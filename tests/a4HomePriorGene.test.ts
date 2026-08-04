import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import {
  GENE_KEYS, crossoverGenomes, mutateGenome, randomGenome, type TacticalGenome,
} from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { clamp01 } from '../src/utils/math';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  EYE_LATTICE, HOME_MAP_STRENGTH_MAX, homePriorStrength,
  type MergedChildTable, type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';

/**
 * A4-P2 (docs/world-model/A4-ASSIGNMENT-CONTRACT.md §5 as amended by ruling #148;
 * PROGRAMME-RULINGS #148.5) — the DORMANT, SHIPPED-FORM home-prior mechanism:
 *   • THE GENE `homePriorObedience` (TacticalGenome idiom, [0,1], BORN 0/ABSENT),
 *     mapped LINEARLY onto strength [0, HOME_MAP_STRENGTH_MAX = 0.5×VAL_SCALE =
 *     0.081747] — the A4-P1e-certified non-harmful span (docs/world-model/
 *     A4-P1E-LOWDOSE-CENSUS.md). Deliberately NOT in GENE_KEYS: the RNG-stream
 *     trap (#148.5, the #75 genre) — its mutation/crossover draws are gated behind
 *     an explicit `evolveHomePrior` opt-in and happen ONLY after the GENE_KEYS loop.
 *   • THE MASTER FLAG `eye.v4.homePrior` (default OFF, explicit `=== true`): ON ⇒
 *     each side's home-map strength is derived from ITS genome's obedience gene at
 *     the banked v3 consumption point (both teams). The probe `Match.homeMapGrant`
 *     stays available and takes PRECEDENCE for any side it targets (independence).
 * Dormancy contract (I-A5/I-A7): gene born 0, flag off ⇒ the sim's decision stream
 * and the production fingerprint 57b0bdab…c673 are byte-identical to HEAD, AND a
 * seeded EVOLUTION run's OTHER genes are unperturbed by the new gene's existence.
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

// --- a synthetic R3p-style eye with a SHALLOW favoured gap ---------------------
// The certified strength ceiling (0.0817) is small BY DESIGN (松约定); a shallow
// argmax gap (0.08 vs 0.05) is what the real P1d/P1e merged table has where these
// low doses move decisions, so the harness reproduces that regime.
const roleCell = (score: number, concede: number, n = 400): RoleCell => ({
  n, score, concede, value: score - concede, underPowered: false,
});
const ctxKeys = [
  'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
  'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
  'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
  'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
];
const fav: Record<Role, string> = { GK: 'r7a0', DF: 'r7a0', MF: 'r7a0', WG: 'r7a0', ST: 'r7a0' };
const columnFor = (favId: string): Record<string, RoleCell> =>
  Object.fromEntries(EYE_LATTICE.map((c) => [c.id, roleCell(c.id === favId ? 0.08 : 0.05, 0.05)]));
const roleTable: RoleConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: columnFor(fav.DF), MF: columnFor(fav.MF), WG: columnFor(fav.WG), ST: columnFor(fav.ST),
}]));
const control: RoleControlLevels = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: roleCell(0.05, 0.05), MF: roleCell(0.05, 0.05), WG: roleCell(0.05, 0.05), ST: roleCell(0.05, 0.05),
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

/** Set the obedience gene on ALL genome references a team may read through the
 *  match (info.genome / baseGenome / effGenome share one object at construction;
 *  mentality/underdog rebuilds spread from baseGenome, so setting all is robust). */
const setObedience = (m: Match, side: Side, v: number): void => {
  const t = m.teams[side];
  (t.info.genome as TacticalGenome).homePriorObedience = v;
  (t.baseGenome as TacticalGenome).homePriorObedience = v;
  (t.effGenome as TacticalGenome).homePriorObedience = v;
};

interface RunOpts {
  homePrior?: boolean;
  obedience?: Partial<Record<Side, number>>;
  mapGrant?: { side: Side; strength: number };
}
/** Warm a match, clone, arm a both-scope R3p eye (optionally with the master flag),
 *  optionally set per-side obedience genes and/or a probe map grant; run to end. */
const runR3p = (opts: RunOpts = {}): string => {
  const m = matchOf(7);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {},
    v3: { roleTable, control, children, mergedTableSha: 'test' },
    v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true, homePrior: opts.homePrior === true },
  };
  if (opts.obedience !== undefined) {
    for (const s of [0, 1] as const) {
      const v = opts.obedience[s];
      if (v !== undefined) setObedience(clone, s, v);
    }
  }
  if (opts.mapGrant !== undefined) clone.homeMapGrant = opts.mapGrant;
  while (!clone.finished) clone.step(DT);
  return signature(clone);
};

// ===========================================================================
describe('A4-P2 — the gene is BORN 0 (generation 0 unchanged)', () => {
  it('the strength ceiling is the certified 0.5×VAL_SCALE = 0.081747', () => {
    expect(HOME_MAP_STRENGTH_MAX).toBeCloseTo(0.5 * 0.163494, 12);
    expect(HOME_MAP_STRENGTH_MAX).toBeCloseTo(0.081747, 9);
  });

  it('fresh random genomes are born WITHOUT the gene (absent ⇒ ≡ 0 ⇒ strength 0)', () => {
    for (let s = 1; s <= 30; s++) {
      const g = randomGenome(new Rng(s));
      expect(g.homePriorObedience).toBeUndefined();
      expect(homePriorStrength(g.homePriorObedience ?? 0)).toBe(0);
      // the key is OMITTED by serialization (the fingerprint-safety invariant).
      expect(Object.prototype.hasOwnProperty.call(JSON.parse(JSON.stringify(g)), 'homePriorObedience'))
        .toBe(false);
    }
  });

  it('a gen-0 League franchise coach genome carries no obedience gene', () => {
    const league = new League({ seed: 20260804 });
    const { franchises } = league.toJSON() as { franchises: Array<{ coach: { genome: TacticalGenome } }> };
    expect(franchises.length).toBeGreaterThan(0);
    for (const f of franchises) expect(f.coach.genome.homePriorObedience).toBeUndefined();
  });

  it('homePriorStrength maps [0,1] linearly onto [0, MAX] and clamps its domain', () => {
    expect(homePriorStrength(0)).toBe(0);
    expect(homePriorStrength(1)).toBeCloseTo(HOME_MAP_STRENGTH_MAX, 12);
    // obedience 0.5 = the certified PRIMARY dose (0.25×VAL_SCALE = 0.0409); the
    // gene's [0,1] spans the whole certified region, so the primary sits mid-range.
    expect(homePriorStrength(0.5)).toBeCloseTo(0.25 * 0.163494, 9);
    expect(homePriorStrength(0.25)).toBeCloseTo(0.25 * HOME_MAP_STRENGTH_MAX, 12);
    expect(homePriorStrength(-0.3)).toBe(0);
    expect(homePriorStrength(5)).toBeCloseTo(HOME_MAP_STRENGTH_MAX, 12);
    expect(homePriorStrength(Number.NaN)).toBe(0);
  });
});

// ===========================================================================
describe('A4-P2 — FLAG-OFF byte-identity (Road B / I-A5 / X-FP-PROD)', () => {
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
describe('A4-P2 — THE RNG-STREAM TRAP (#148.5): flag-off evolution consumes ZERO extra draws', () => {
  // A faithful re-implementation of HEAD's mutate/crossover (GENE_KEYS ONLY — the
  // gene did not exist). If the flag-off code path draws even ONE extra RNG value
  // or reorders a draw, the two pipelines' genomes OR final rng state diverge.
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

  it('mutate+crossover over several generations is byte-identical to the pre-gene HEAD sequence', () => {
    const seed = 909090;
    // ACTUAL pipeline: the shipped mutate/crossover with the opt-in OFF (default).
    const rngA = new Rng(seed);
    // HEAD reference pipeline: identical draws, gene never existed.
    const rngH = new Rng(seed);
    let a0 = randomGenome(new Rng(11)); let a1 = randomGenome(new Rng(22));
    let h0: TacticalGenome = { ...a0 }; let h1: TacticalGenome = { ...a1 };
    for (let gen = 0; gen < 8; gen++) {
      // mutate two parents
      a0 = mutateGenome(a0, rngA, { rate: 0.45, scale: 0.14 });       // opt-in OFF
      a1 = mutateGenome(a1, rngA, { rate: 0.4, scale: 0.08 });
      h0 = headMutate(h0, rngH, 0.45, 0.14);
      h1 = headMutate(h1, rngH, 0.4, 0.08);
      // breed a child (crossover then heavy mutate) — the evolve.ts idiom
      a0 = mutateGenome(crossoverGenomes(a0, a1, rngA), rngA, { rate: 0.5, scale: 0.15 });
      h0 = headMutate(headCross(h0, h1, rngH), rngH, 0.5, 0.15);
    }
    // the OTHER genes evolved identically ⇒ the new gene perturbed nothing.
    for (const k of GENE_KEYS) { expect(a0[k]).toBe(h0[k]); expect(a1[k]).toBe(h1[k]); }
    // the gene stayed absent (never mutated/crossed under the flag-off path).
    expect(a0.homePriorObedience).toBeUndefined();
    expect(a1.homePriorObedience).toBeUndefined();
    // and the RNG is at the SAME position ⇒ every downstream consumer is unmoved.
    expect((rngA as unknown as { s: number }).s).toBe((rngH as unknown as { s: number }).s);
  });

  it('flag-on evolution DOES draw and DOES move the gene (the capability is real, not dead)', () => {
    const rng = new Rng(31337);
    let g = randomGenome(new Rng(5));
    let moved = false;
    for (let i = 0; i < 200; i++) {
      g = mutateGenome(g, rng, { rate: 0.9, scale: 0.3, evolveHomePrior: true });
      if (g.homePriorObedience !== undefined && g.homePriorObedience > 0) moved = true;
      // BOUNDS: every mutation keeps the gene in [0,1].
      if (g.homePriorObedience !== undefined) {
        expect(g.homePriorObedience).toBeGreaterThanOrEqual(0);
        expect(g.homePriorObedience).toBeLessThanOrEqual(1);
      }
    }
    expect(moved).toBe(true);
    // crossover under the opt-in also carries a defined value.
    const child = crossoverGenomes(g, { ...g, homePriorObedience: 0.9 }, new Rng(7), true);
    expect(child.homePriorObedience).toBeGreaterThanOrEqual(0);
    expect(child.homePriorObedience).toBeLessThanOrEqual(1);
  });
});

// ===========================================================================
describe('A4-P2 — FLAG-ON effect (gene-derived, per-team, both sides)', () => {
  it('the master flag with a BORN-0 (absent) gene is a no-op (inert ⇒ baseline)', () => {
    const base = runR3p();
    expect(runR3p({ homePrior: true })).toBe(base);                       // gene absent
    expect(runR3p({ homePrior: true, obedience: { 0: 0, 1: 0 } })).toBe(base); // gene 0
  });

  it('the master flag OFF but the gene SET is still a no-op (the flag gates consumption)', () => {
    const base = runR3p();
    expect(runR3p({ obedience: { 0: 1, 1: 1 } })).toBe(base);
  });

  it('two teams with DIFFERENT obedience genes station differently (both differ from baseline)', () => {
    const base = runR3p();
    const side0 = runR3p({ homePrior: true, obedience: { 0: 1, 1: 0 } });
    const side1 = runR3p({ homePrior: true, obedience: { 0: 0, 1: 1 } });
    expect(side0).not.toBe(base);
    expect(side1).not.toBe(base);
    expect(side0).not.toBe(side1); // each side reads its OWN genome
  });

  it('a stronger obedience gene is a different world from a weaker one', () => {
    const weak = runR3p({ homePrior: true, obedience: { 0: 0.5 } });
    const strong = runR3p({ homePrior: true, obedience: { 0: 1 } });
    expect(weak).not.toBe(runR3p());
    expect(strong).not.toBe(weak);
  });
});

// ===========================================================================
describe('A4-P2 — the probe homeMapGrant takes PRECEDENCE (instrument independence)', () => {
  it('a probe grant on a side overrides that side\'s obedience gene entirely', () => {
    const geneOnly = runR3p({ homePrior: true, obedience: { 0: 1 } });
    // flag on + probe on side 0: the gene value for side 0 must be IGNORED, so two
    // different side-0 gene values with the same probe yield the SAME world.
    const probeHi = runR3p({ homePrior: true, obedience: { 0: 1 }, mapGrant: { side: 0, strength: 0.0409 } });
    const probeLo = runR3p({ homePrior: true, obedience: { 0: 0.2 }, mapGrant: { side: 0, strength: 0.0409 } });
    expect(probeHi).toBe(probeLo);       // side-0 gene ignored ⇒ probe wins
    expect(probeHi).not.toBe(geneOnly);  // and it is genuinely a different strength
  });
});

// ===========================================================================
describe('A4-P2 — INERT outside the consumption point', () => {
  it('with stationEye null, the master flag + a maxed gene are a no-op', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    const base = runToEnd(matchOf(7));
    const m = matchOf(7);
    setObedience(m, 0, 1); setObedience(m, 1, 1); // no eye to read the gene
    expect(runToEnd(m)).toBe(base);
  });
});
