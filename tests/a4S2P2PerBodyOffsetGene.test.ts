import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import {
  GENE_KEYS, HOME_PRIOR_OBEDIENCE_OFFSET_MAX, HOME_PRIOR_OFFSET_SLOTS, crossoverGenomes,
  effectiveHomePriorObedience, mutateGenome, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { clamp01 } from '../src/utils/math';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  EYE_LATTICE, HOME_MAP_STRENGTH_MAX, homePriorStrength,
  type MergedChildTable, type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';
import {
  CONFIRM_OFFSIDE_FLAG_ABS, CONFIRM_REFERENCE_ARM, CONFIRM_TREAT_ARM, evalConfirmGate, type CI,
} from '../scripts/probes/a4S2P1ConfirmGate';

/**
 * A4 SLICE 2, S2-P2 (docs/world-model/A4-SLICE2-PERBODY-CONTRACT.md §2 M-S2.1/M-S2.2,
 * §3 invariants; ruling #164.3) — the PER-BODY OBEDIENCE OFFSET GENE FAMILY, built
 * DORMANT. The pins (the a4HomePriorGene / a4S2VectorGrant idioms, extended):
 *   • BORN-EQUIVALENCE (the load-bearing identity) — with the offsets ABSENT the
 *     shipped `eye.v4.homePrior` seam computes BYTE-IDENTICAL worlds to HEAD's
 *     per-team read, NON-VACUOUSLY (the seam is proven to actually bite on the
 *     fixture, so the equality is not the trivial "nothing happened either way").
 *   • RNG-STREAM IDENTITY — with the `evolveHomePriorOffsets` opt-in OFF, mutation
 *     and crossover consume EXACTLY the draws they consume today: none added, none
 *     skipped, none re-ordered — asserted against BOTH the pre-gene HEAD sequence
 *     AND (ruling #165.2.i, the named debt DISCHARGED at S2-P3) a genuine HEAD
 *     REIMPLEMENTATION of the `evolveHomePrior`-ON pipeline: the earlier form of that
 *     second test called CURRENT code on both arms and could not fail. Both proofs now
 *     compare against a reimplementation, draw-for-draw AND on RNG internal state.
 *   • X-FP-PROD — the production fingerprint 57b0bdab…c673 is unchanged (Road B).
 *   • ⭐ BIRTH NEUTRALITY (contract §3, the §8 audit's one live-risk clause) — NO
 *     role-derived birth content anywhere in `src/**`: every freshly created genome
 *     (random / League franchise / live match team) carries the family ABSENT, and a
 *     source scan proves no `src/**` path assigns a role-derived offset at birth.
 *   • THE #163.2.iv DEBT — a gate-POLARITY unit test for the S2-P1b confirm mode's
 *     `evalConfirmGate` over synthetic contrast fixtures: leg (a) UPPER < 0, leg (b)
 *     UPPER < 0, leg (c) LOWER ≤ 0, and the offside flag in NO conjunct.
 * NOTHING SHIPS: the family is born absent, the evolve opt-in defaults OFF, and the
 * consumption path stays behind the dormant `eye.v4.homePrior` master flag.
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

// --- the R3p fixture, the a4S2VectorGrant TIGHT column (verbatim) --------------
// The candidates are separated by ~0.0006 in value — FAR below the shipped-form
// strength ceiling (0.0817) — so a whisper-volume home prior can actually FLIP an
// argmax here. The P1c fixture's 0.25 gap is unflippable at these doses, which would
// make every equivalence assertion below VACUOUS; the non-vacuity assertions guard it.
const roleCell = (score: number, concede: number, n = 400): RoleCell => ({
  n, score, concede, value: score - concede, underPowered: false,
});
const ctxKeys = [
  'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
  'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
  'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
  'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
];
const columnFor = (): Record<string, RoleCell> =>
  Object.fromEntries(EYE_LATTICE.map((c, i) => [c.id, roleCell(0.05 + 0.0006 * i, 0.05)]));
const roleTable: RoleConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: columnFor(), MF: columnFor(), WG: columnFor(), ST: columnFor(),
}]));
const control: RoleControlLevels = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: roleCell(0.10, 0.05), MF: roleCell(0.10, 0.05), WG: roleCell(0.10, 0.05), ST: roleCell(0.10, 0.05),
}]));
const buildChildren = (): MergedChildTable => {
  const delivery: Record<string, Record<string, Partial<Record<'0' | '1', RoleCell>>>> = {};
  const offside: Record<string, Record<string, Partial<Record<'0' | '1', RoleCell>>>> = {};
  for (const k of ctxKeys) {
    for (const role of ['DF', 'MF', 'WG', 'ST'] as const) {
      const col = roleTable[k][role];
      const key = `${k}||${role}`;
      const d: Record<string, Partial<Record<'0' | '1', RoleCell>>> = {};
      const o: Record<string, Partial<Record<'0' | '1', RoleCell>>> = {};
      for (const c of EYE_LATTICE) { d[c.id] = { 1: col[c.id] }; o[c.id] = { 0: col[c.id], 1: col[c.id] }; }
      delivery[key] = d; offside[key] = o;
    }
  }
  return { delivery, offside };
};
const children = buildChildren();

/** Set the obedience gene (and optionally the per-slot offsets) on ALL genome
 *  references a team may read through the match — the a4HomePriorGene idiom. */
const setGenes = (
  m: Match, side: Side, obedience: number | undefined, offsets?: readonly number[],
): void => {
  const t = m.teams[side];
  for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
    if (obedience !== undefined) g.homePriorObedience = obedience;
    if (offsets !== undefined) g.homePriorObedienceOffset = offsets;
  }
};

interface RunOpts {
  homePrior?: boolean;
  obedience?: Partial<Record<Side, number>>;
  offsets?: Partial<Record<Side, readonly number[]>>;
}
/** Warm a match, clone, arm a both-scope R3p eye (optionally with the shipped master
 *  flag), optionally set per-side obedience / offsets, run to the end. */
const runR3p = (opts: RunOpts = {}): string => {
  const m = matchOf(7);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {},
    v3: { roleTable, control, children, mergedTableSha: 'test' },
    v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: opts.homePrior === true },
  };
  for (const s of [0, 1] as const) {
    const ob = opts.obedience?.[s];
    const off = opts.offsets?.[s];
    if (ob !== undefined || off !== undefined) setGenes(clone, s, ob, off);
  }
  while (!clone.finished) clone.step(DT);
  return signature(clone);
};

// ===========================================================================
describe('A4 S2-P2 — the gene family shape + the frozen bound', () => {
  it('the offset family covers exactly the squad slots', () => {
    expect(HOME_PRIOR_OFFSET_SLOTS).toBe(TEAM_SIZE);
  });

  it('the frozen bound is ±0.5 — enough to reach either end of the certified domain', () => {
    expect(HOME_PRIOR_OBEDIENCE_OFFSET_MAX).toBe(0.5);
    // from the certified whisper (obedience 0.5, #148's PRIMARY dose) the bound reaches
    // BOTH ends of the gene's [0,1] domain and no further.
    expect(clamp01(0.5 + HOME_PRIOR_OBEDIENCE_OFFSET_MAX)).toBe(1);
    expect(clamp01(0.5 - HOME_PRIOR_OBEDIENCE_OFFSET_MAX)).toBe(0);
    // and it spans every S2-P1 frozen instrument vector's deviation about the mean 0.5
    // (spread ±0.3, backLoaded/frontLoaded ±0.4, singleAnchor +0.5 / −0.125).
    for (const v of [0.8, 0.2, 0.9, 0.1, 1.0, 0.375]) {
      expect(Math.abs(v - 0.5)).toBeLessThanOrEqual(HOME_PRIOR_OBEDIENCE_OFFSET_MAX);
    }
  });

  it('effective obedience = clamp01(team obedience + slot offset), absent ⇒ the team value', () => {
    const g = randomGenome(new Rng(3));
    expect(effectiveHomePriorObedience(g, 1)).toBe(0);              // both born absent
    g.homePriorObedience = 0.5;
    for (let i = 0; i < TEAM_SIZE; i++) expect(effectiveHomePriorObedience(g, i)).toBe(0.5);
    g.homePriorObedienceOffset = [0, 0.4, -0.4, 0.5, -0.5, 0.1];
    expect(effectiveHomePriorObedience(g, 0)).toBe(0.5);
    expect(effectiveHomePriorObedience(g, 1)).toBeCloseTo(0.9, 12);
    expect(effectiveHomePriorObedience(g, 2)).toBeCloseTo(0.1, 12);
    expect(effectiveHomePriorObedience(g, 3)).toBe(1);
    expect(effectiveHomePriorObedience(g, 4)).toBe(0);
    // out-of-range slot ⇒ no offset (inert), never a throw.
    expect(effectiveHomePriorObedience(g, 99)).toBe(0.5);
    // the EFFECTIVE value is what is clamped: a maxed team gene + a positive offset
    // saturates at the certified ceiling rather than running away.
    g.homePriorObedience = 1;
    expect(homePriorStrength(effectiveHomePriorObedience(g, 1))).toBeCloseTo(HOME_MAP_STRENGTH_MAX, 12);
  });
});

// ===========================================================================
describe('A4 S2-P2 — ⭐ BORN-EQUIVALENCE: offsets ABSENT ⇒ byte-identical to HEAD', () => {
  it('the shipped prior with the family ABSENT plays exactly as the per-team read did', () => {
    const base = runR3p();
    const flagOnly = runR3p({ homePrior: true });                              // both genes absent
    const whisper = runR3p({ homePrior: true, obedience: { 0: 0.5 } });        // HEAD's per-team read
    // NON-VACUITY: the seam genuinely executes and BITES on this fixture — the
    // equality below is not "nothing happened on either side".
    expect(flagOnly).toBe(base);
    expect(whisper).not.toBe(base);
    // BORN-EQUIVALENCE: with the family absent the per-body path reproduces it exactly.
    expect(runR3p({ homePrior: true, obedience: { 0: 0.5 } })).toBe(whisper);
    // and an ALL-ZERO family (present but neutral) is the same world again.
    expect(runR3p({ homePrior: true, obedience: { 0: 0.5 }, offsets: { 0: [0, 0, 0, 0, 0, 0] } }))
      .toBe(whisper);
    // both sides at the whisper, family absent vs all-zero: still identical.
    const bothAbsent = runR3p({ homePrior: true, obedience: { 0: 0.5, 1: 0.5 } });
    const bothZero = runR3p({
      homePrior: true, obedience: { 0: 0.5, 1: 0.5 },
      offsets: { 0: [0, 0, 0, 0, 0, 0], 1: [0, 0, 0, 0, 0, 0] },
    });
    expect(bothZero).toBe(bothAbsent);
    expect(bothAbsent).not.toBe(base);
  });

  it('a UNIFORM offset is exactly the equivalent team whisper (the same map, no new mechanism)', () => {
    const viaTeam = runR3p({ homePrior: true, obedience: { 0: 0.8 } });
    const viaOffset = runR3p({
      homePrior: true, obedience: { 0: 0.5 }, offsets: { 0: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3] },
    });
    expect(viaOffset).toBe(viaTeam);
    expect(viaTeam).not.toBe(runR3p());
  });

  it('a HETEROGENEOUS family is a different world (the S2-P3 lever is real, not dead)', () => {
    const uniform = runR3p({ homePrior: true, obedience: { 0: 0.5 } });
    // the S2-P1 frozen backLoaded shape [0,.9,.7,.5,.3,.1], expressed as offsets about
    // the whisper 0.5 — the gene family can EXPRESS what the census priced.
    const backLoaded = runR3p({
      homePrior: true, obedience: { 0: 0.5 }, offsets: { 0: [0, 0.4, 0.2, 0, -0.2, -0.4] },
    });
    expect(backLoaded).not.toBe(uniform);
    // side scoping holds — each side reads its OWN genome.
    const otherSide = runR3p({
      homePrior: true, obedience: { 1: 0.5 }, offsets: { 1: [0, 0.4, 0.2, 0, -0.2, -0.4] },
    });
    expect(otherSide).not.toBe(backLoaded);
  });

  it('the master flag OFF but the family SET is a no-op (the flag still gates consumption)', () => {
    const base = runR3p();
    expect(runR3p({ obedience: { 0: 0.5 }, offsets: { 0: [0, 0.5, -0.5, 0.5, -0.5, 0.5] } }))
      .toBe(base);
  });

  it('with stationEye null, the family is inert (byte-identical to the plain world)', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    const base = runToEnd(matchOf(7));
    const m = matchOf(7);
    setGenes(m, 0, 1, [0.5, 0.5, -0.5, 0.5, -0.5, 0.5]);
    setGenes(m, 1, 1, [0.5, -0.5, 0.5, -0.5, 0.5, -0.5]);
    expect(runToEnd(m)).toBe(base);
  });
});

// ===========================================================================
describe('A4 S2-P2 — FLAG-OFF byte-identity (Road B / X-FP-PROD)', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000);

  it('a plain match still reproduces itself byte-for-byte', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    for (const seed of [7, 4242]) expect(runToEnd(matchOf(seed))).toBe(runToEnd(matchOf(seed)));
  });
});

// ===========================================================================
describe('A4 S2-P2 — ⭐ RNG-STREAM IDENTITY (the #148.5 / #75 trap, the slice-1 P2 form)', () => {
  // A faithful re-implementation of HEAD's mutate/crossover (GENE_KEYS ONLY). If the
  // flag-off path draws even ONE extra RNG value or re-orders a draw, the two
  // pipelines' genomes OR the final rng state diverge.
  const headMutate = (g: TacticalGenome, rng: Rng, rate: number, scale: number): TacticalGenome => {
    const out = { ...g };
    for (const k of GENE_KEYS) if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
    return out;
  };
  const headCross = (a: TacticalGenome, b: TacticalGenome, rng: Rng): TacticalGenome => {
    const out = {} as TacticalGenome;
    for (const k of GENE_KEYS) { const r = rng.next(); out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2; }
    return out;
  };
  const rngState = (r: Rng): number => (r as unknown as { s: number }).s;

  it('flag-off evolution consumes EXACTLY the pre-gene HEAD draws (none added, none skipped)', () => {
    const seed = 4242424;
    const rngA = new Rng(seed);   // the SHIPPED pipeline, both opt-ins OFF (the default)
    const rngH = new Rng(seed);   // the HEAD reference: neither gene ever existed
    let a0 = randomGenome(new Rng(11)); let a1 = randomGenome(new Rng(22));
    let h0: TacticalGenome = { ...a0 }; let h1: TacticalGenome = { ...a1 };
    for (let gen = 0; gen < 8; gen++) {
      a0 = mutateGenome(a0, rngA, { rate: 0.45, scale: 0.14 });
      a1 = mutateGenome(a1, rngA, { rate: 0.4, scale: 0.08 });
      h0 = headMutate(h0, rngH, 0.45, 0.14);
      h1 = headMutate(h1, rngH, 0.4, 0.08);
      a0 = mutateGenome(crossoverGenomes(a0, a1, rngA), rngA, { rate: 0.5, scale: 0.15 });
      h0 = headMutate(headCross(h0, h1, rngH), rngH, 0.5, 0.15);
    }
    for (const k of GENE_KEYS) { expect(a0[k]).toBe(h0[k]); expect(a1[k]).toBe(h1[k]); }
    expect(a0.homePriorObedienceOffset).toBeUndefined();
    expect(a1.homePriorObedienceOffset).toBeUndefined();
    expect(a0.homePriorObedience).toBeUndefined();
    // ⭐ the stream is at the SAME position ⇒ every downstream consumer is unmoved.
    expect(rngState(rngA)).toBe(rngState(rngH));
  });

  // ⭐ THE #165.2.i DEBT, DISCHARGED. The previous form of this test called CURRENT code on
  // BOTH arms, so it could not fail; it is replaced by a genuine HEAD REIMPLEMENTATION with
  // `evolveHomePrior` ON — the headMutate/headCross form above, extended with the
  // homePriorObedience block exactly as it stood BEFORE the offset family existed.
  const headMutateHP = (g: TacticalGenome, rng: Rng, rate: number, scale: number): TacticalGenome => {
    const out = { ...g };
    for (const k of GENE_KEYS) if (rng.chance(rate)) out[k] = clamp01(out[k] + rng.gaussian() * scale);
    if (rng.chance(rate)) out.homePriorObedience = clamp01((out.homePriorObedience ?? 0) + rng.gaussian() * scale);
    return out;
  };
  const headCrossHP = (a: TacticalGenome, b: TacticalGenome, rng: Rng): TacticalGenome => {
    const out = {} as TacticalGenome;
    for (const k of GENE_KEYS) { const r = rng.next(); out[k] = r < 0.4 ? a[k] : r < 0.8 ? b[k] : (a[k] + b[k]) / 2; }
    const r = rng.next();
    const av = a.homePriorObedience ?? 0;
    const bv = b.homePriorObedience ?? 0;
    out.homePriorObedience = r < 0.4 ? av : r < 0.8 ? bv : (av + bv) / 2;
    return out;
  };

  it('the offsets opt-in leaves an EXISTING homePrior-ON stream bit-identical to its HEAD form (#75: its own flag)', () => {
    const seed = 777_001;
    const rngWith = new Rng(seed);   // CURRENT code: evolveHomePrior ON, offsets OFF (the shipped pair today)
    const rngH = new Rng(seed);      // the HEAD REFERENCE: the same run before the offset family existed
    let gw = randomGenome(new Rng(31)); let gh: TacticalGenome = { ...gw };
    let pw = randomGenome(new Rng(32)); let ph: TacticalGenome = { ...pw };
    for (let i = 0; i < 40; i++) {
      gw = mutateGenome(gw, rngWith, { rate: 0.5, scale: 0.2, evolveHomePrior: true });
      gh = headMutateHP(gh, rngH, 0.5, 0.2);
      pw = mutateGenome(pw, rngWith, { rate: 0.45, scale: 0.14, evolveHomePrior: true });
      ph = headMutateHP(ph, rngH, 0.45, 0.14);
      gw = crossoverGenomes(gw, pw, rngWith, true);
      gh = headCrossHP(gh, ph, rngH);
      // DRAW-FOR-DRAW: the streams must be at the same position after EVERY step, not just
      // at the end — a compensating pair of extra/skipped draws could not hide here.
      expect(rngState(rngWith)).toBe(rngState(rngH));
    }
    // the GENOMES agree gene for gene, including the home-prior gene itself.
    for (const k of GENE_KEYS) { expect(gw[k]).toBe(gh[k]); expect(pw[k]).toBe(ph[k]); }
    expect(gw.homePriorObedience).toBe(gh.homePriorObedience);
    expect(pw.homePriorObedience).toBe(ph.homePriorObedience);
    // NON-VACUITY: the home-prior gene really evolved on this stream (otherwise the equality
    // above would be the trivial "the block never fired on either side").
    expect(typeof gh.homePriorObedience).toBe('number');
    expect(gh.homePriorObedience).not.toBe(0);
    // and the offset family never appeared: its opt-in was OFF throughout.
    expect(gw.homePriorObedienceOffset).toBeUndefined();
    expect(pw.homePriorObedienceOffset).toBeUndefined();
    // ⭐ the stream is at the SAME position ⇒ every downstream consumer is unmoved.
    expect(rngState(rngWith)).toBe(rngState(rngH));
  });

  it('crossover with the opt-in OFF carries parent A\'s family through with NO draw', () => {
    const a = randomGenome(new Rng(5)) as TacticalGenome;
    const b = randomGenome(new Rng(6)) as TacticalGenome;
    a.homePriorObedienceOffset = [0, 0.4, -0.4, 0, 0.1, -0.1];
    const rngOff = new Rng(99); const rngRef = new Rng(99);
    const child = crossoverGenomes(a, b, rngOff);
    const ref = headCross(a, b, rngRef);
    for (const k of GENE_KEYS) expect(child[k]).toBe(ref[k]);
    expect(rngState(rngOff)).toBe(rngState(rngRef));
    expect(child.homePriorObedienceOffset).toEqual(a.homePriorObedienceOffset);
  });

  it('flag-ON evolution DOES draw and DOES move the family, always inside the frozen bound', () => {
    const rng = new Rng(20_260_808);
    let g = randomGenome(new Rng(8));
    let moved = false;
    for (let i = 0; i < 200; i++) {
      g = mutateGenome(g, rng, { rate: 0.9, scale: 0.4, evolveHomePriorOffsets: true });
      const off = g.homePriorObedienceOffset;
      expect(off).toBeDefined();
      expect(off!.length).toBe(HOME_PRIOR_OFFSET_SLOTS);
      for (const v of off!) {
        expect(v).toBeGreaterThanOrEqual(-HOME_PRIOR_OBEDIENCE_OFFSET_MAX);
        expect(v).toBeLessThanOrEqual(HOME_PRIOR_OBEDIENCE_OFFSET_MAX);
      }
      if (off!.some((v) => v !== 0)) moved = true;
      // heterogeneity is REACHABLE (what the family exists for) — not asserted every
      // iteration, only that the family is not pinned to a single shared value.
    }
    expect(moved).toBe(true);
    const spread = new Set(g.homePriorObedienceOffset!.map((v) => v.toFixed(9)));
    expect(spread.size).toBeGreaterThan(1);
    // crossover under the opt-in also produces a bounded, full-length family.
    const child = crossoverGenomes(
      g, { ...g, homePriorObedienceOffset: [0.5, -0.5, 0.5, -0.5, 0.5, -0.5] }, new Rng(7), false, true,
    );
    expect(child.homePriorObedienceOffset!.length).toBe(HOME_PRIOR_OFFSET_SLOTS);
    for (const v of child.homePriorObedienceOffset!) {
      expect(Math.abs(v)).toBeLessThanOrEqual(HOME_PRIOR_OBEDIENCE_OFFSET_MAX);
    }
  });
});

// ===========================================================================
describe('A4 S2-P2 — ⭐ BIRTH NEUTRALITY (contract §3: no role-derived birth content)', () => {
  it('every freshly created genome carries the family ABSENT (and it is omitted by JSON)', () => {
    for (let s = 1; s <= 30; s++) {
      const g = randomGenome(new Rng(s));
      expect(g.homePriorObedienceOffset).toBeUndefined();
      expect(Object.prototype.hasOwnProperty.call(
        JSON.parse(JSON.stringify(g)), 'homePriorObedienceOffset',
      )).toBe(false);
      for (let i = 0; i < TEAM_SIZE; i++) {
        expect(homePriorStrength(effectiveHomePriorObedience(g, i))).toBe(0);
      }
    }
  });

  it('a gen-0 League franchise and a live match team carry no offsets', () => {
    const league = new League({ seed: 20260808 });
    const { franchises } = league.toJSON() as { franchises: Array<{ coach: { genome: TacticalGenome } }> };
    expect(franchises.length).toBeGreaterThan(0);
    for (const f of franchises) expect(f.coach.genome.homePriorObedienceOffset).toBeUndefined();
    const live = league.createMatch(league.nextFixture()!);
    for (const side of [0, 1] as const) {
      for (const g of [
        live.teams[side].info.genome, live.teams[side].baseGenome, live.teams[side].effGenome,
      ] as TacticalGenome[]) {
        expect(g.homePriorObedienceOffset).toBeUndefined();
      }
    }
  });

  it('a whole evolved league (flag-off) never grows the family', () => {
    const league = new League({ seed: 515151 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    const json = JSON.stringify(out.league);
    expect(json.includes('homePriorObedienceOffset')).toBe(false);
    expect(json.includes('homePriorObedience')).toBe(false);
  }, 120_000);

  it('NO src/** path assigns role-derived birth content to the family', () => {
    const files: string[] = [];
    const walk = (dir: string): void => {
      for (const e of readdirSync(dir)) {
        const p = join(dir, e);
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.ts')) files.push(p);
      }
    };
    walk('src');
    expect(files.length).toBeGreaterThan(50);
    const mentions: Array<{ file: string; line: string }> = [];
    for (const f of files) {
      for (const raw of readFileSync(f, 'utf8').split('\n')) {
        if (raw.includes('homePriorObedienceOffset')) mentions.push({ file: f, line: raw.trim() });
      }
    }
    expect(mentions.length).toBeGreaterThan(0); // the family EXISTS in src (non-vacuity)
    // (i) the FIELD itself is touched by exactly ONE module (the gene module); every
    //     consumer must go through the pure `effectiveHomePriorObedience` helper.
    const owners = new Set(mentions.map((m) => m.file.replace(/\\/g, '/')));
    expect([...owners].sort()).toEqual(['src/evolution/genome.ts']);
    // and that helper has exactly ONE call site in src/** — the shipped eye seam.
    const callers = files.filter((f) => readFileSync(f, 'utf8')
      .includes('effectiveHomePriorObedience(')).map((f) => f.replace(/\\/g, '/')).sort();
    expect(callers).toEqual(['src/ai/actionExecutor.ts', 'src/evolution/genome.ts']);
    for (const { line } of mentions) {
      // (ii) NO literal birth vector is ever assigned to the family in src/**.
      expect(/homePriorObedienceOffset\s*[:=]\s*\[/.test(line)).toBe(false);
      // (iii) NO line that touches the family also names a ROLE — no "defenders born
      //       obedient" (= 替球队定X, rejected ex ante by the §8 VISION audit).
      expect(/\b(GK|DF|MF|WG|ST|role|Role)\b/.test(line)).toBe(false);
    }
  });
});

// ===========================================================================
// THE #163.2.iv DEBT — gate POLARITY for the S2-P1b confirm mode.
// Synthetic contrast fixtures only: this asserts the PREDICATE's direction, never a
// result. The banked run (#164.2) was adjudicated on exactly this code, lifted
// byte-for-byte into scripts/probes/a4S2P1ConfirmGate.ts.
// ===========================================================================
describe('A4 S2-P1b — the confirm gate POLARITIES (#163.2.iv, discharged)', () => {
  const ci = (point: number, lower: number, upper: number, n = 96_000): CI => ({ point, lower, upper, n });
  /** all four instruments neutral-but-PASSING, then overridden per leg. */
  const fixture = (over: Partial<Record<'dupRun' | 'deep' | 'box' | 'offsides', CI>>) => ({
    vsNone: {
      [CONFIRM_TREAT_ARM]: {
        dupRun: ci(-2.5, -2.8, -2.2), box: ci(-0.0017, -0.0028, -0.0006),
        deep: ci(0.0045, -0.0021, 0.0110), offsides: ci(-0.011, -0.02, 0.001),
        ...over,
      },
      [CONFIRM_REFERENCE_ARM]: {
        dupRun: ci(-0.5, -0.7, -0.3), box: ci(-0.001, -0.002, 0), deep: ci(0, -0.01, 0.01),
        offsides: ci(0, -0.01, 0.01),
      },
    } as Record<string, Record<string, CI>>,
    levels: { offsides: { none: 0.02, [CONFIRM_REFERENCE_ARM]: 0.02, [CONFIRM_TREAT_ARM]: 0.02 } },
  });
  const run = (over: Parameters<typeof fixture>[0]) => {
    const f = fixture(over);
    return evalConfirmGate(f.vsNone, f.levels);
  };

  it('the all-holding fixture PASSES (non-vacuity: the gate can say yes)', () => {
    const g = run({});
    expect(g.legA.holds).toBe(true);
    expect(g.legB.holds).toBe(true);
    expect(g.legC.holds).toBe(true);
    expect(g.pass).toBe(true);
  });

  it('leg (a) is dupRun CI UPPER < 0 — a CI touching or crossing zero FAILS', () => {
    expect(run({ dupRun: ci(-2.5, -2.8, -0.0001) }).legA.holds).toBe(true);
    expect(run({ dupRun: ci(-2.5, -2.8, 0) }).legA.holds).toBe(false);       // upper = 0 ⇒ unresolved
    expect(run({ dupRun: ci(-2.5, -2.8, +0.1) }).legA.holds).toBe(false);    // CI spans 0
    expect(run({ dupRun: ci(+2.5, +2.2, +2.8) }).legA.holds).toBe(false);    // duplication ROSE
    expect(run({ dupRun: ci(Number.NaN, Number.NaN, Number.NaN) }).legA.holds).toBe(false);
    expect(run({ dupRun: ci(+2.5, +2.2, +2.8) }).pass).toBe(false);
  });

  it('leg (b) is box CI UPPER < 0 — the box account must resolvedly PAY', () => {
    expect(run({ box: ci(-0.002, -0.003, -0.000001) }).legB.holds).toBe(true);
    expect(run({ box: ci(-0.002, -0.003, 0) }).legB.holds).toBe(false);
    expect(run({ box: ci(-0.002, -0.004, +0.001) }).legB.holds).toBe(false); // spans 0 ⇒ not paid
    expect(run({ box: ci(+0.002, +0.001, +0.003) }).legB.holds).toBe(false); // box got WORSE
    expect(run({ box: ci(+0.002, +0.001, +0.003) }).pass).toBe(false);
  });

  it('leg (c) is deep CI LOWER ≤ 0 — a BREAK-EVEN leg, not a benefit leg', () => {
    // ⭐ the opposite polarity from (a)/(b): (c) asks "does NOT resolve worse".
    expect(run({ deep: ci(+0.0045, -0.0021, +0.0110) }).legC.holds).toBe(true); // spans 0 ⇒ level
    expect(run({ deep: ci(-0.5, -0.9, -0.1) }).legC.holds).toBe(true);          // BETTER also holds
    expect(run({ deep: ci(+0.01, 0, +0.02) }).legC.holds).toBe(true);           // lower = 0 ⇒ holds (≤)
    expect(run({ deep: ci(+0.01, +0.0001, +0.02) }).legC.holds).toBe(false);    // resolvedly WORSE
    expect(run({ deep: ci(Number.NaN, Number.NaN, Number.NaN) }).legC.holds).toBe(false);
    expect(run({ deep: ci(+0.01, +0.0001, +0.02) }).pass).toBe(false);
  });

  it('PASS is exactly (a) ∧ (b) ∧ (c) — the offside flag is in NO conjunct', () => {
    // the flag FIRES (offsides CI lower far above +0.0338) and PASS is untouched.
    const flagged = run({ offsides: ci(+0.5, +0.4, +0.6) });
    expect(flagged.offsideFlag.flagged).toBe(true);
    expect(flagged.pass).toBe(true);
    expect(flagged.disposition.startsWith('PASS')).toBe(true);
    // the threshold itself: strictly ABOVE +0.0338, and a quiet contrast stays quiet.
    expect(CONFIRM_OFFSIDE_FLAG_ABS).toBe(0.0338);
    expect(run({ offsides: ci(0.05, CONFIRM_OFFSIDE_FLAG_ABS, 0.07) }).offsideFlag.flagged).toBe(false);
    expect(run({ offsides: ci(0.05, CONFIRM_OFFSIDE_FLAG_ABS + 1e-9, 0.07) }).offsideFlag.flagged).toBe(true);
    // and a fired flag cannot RESCUE a failing leg either.
    const failedAndFlagged = run({ dupRun: ci(+1, +0.5, +1.5), offsides: ci(+0.5, +0.4, +0.6) });
    expect(failedAndFlagged.pass).toBe(false);
    // the descriptive reference arm appears in no leg: moving it cannot move PASS.
    const f = fixture({});
    f.vsNone[CONFIRM_REFERENCE_ARM].dupRun = ci(+99, +98, +100);
    f.vsNone[CONFIRM_REFERENCE_ARM].box = ci(+99, +98, +100);
    f.vsNone[CONFIRM_REFERENCE_ARM].deep = ci(+99, +98, +100);
    expect(evalConfirmGate(f.vsNone, f.levels).pass).toBe(true);
  });

  it('an EMPTY pooled cell reads as an attainability failure, not a pass', () => {
    const g = run({ dupRun: ci(Number.NaN, Number.NaN, Number.NaN, 0) });
    expect(g.pass).toBe(false);
    expect(g.emptyCellVacuity).toContain('POOLED CELL EMPTY');
  });
});
