import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  EYE_LATTICE, HOME_MAP_STRENGTH_MAX, homePriorStrength,
  type MergedChildTable, type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';

/**
 * A4 SLICE 2, S2-P1 (docs/world-model/A4-S2P1-VECTOR-CENSUS.md;
 * A4-SLICE2-PERBODY-CONTRACT §2 M-S2.3, ruling #158) — the PER-BODY OBEDIENCE
 * VECTOR form of the banked `Match.homeRegionGrant` seam. The pins (the
 * a4HomeGrant idiom, extended):
 *   • DEFAULT OFF — null on a fresh Match and on a League match (both members).
 *   • FLAG-OFF BYTE-IDENTITY — with the seam null the shipped world plays
 *     tick-for-tick as HEAD and the production fingerprint 57b0bdab…c673 is
 *     unchanged (X-FP-PROD, Road B).
 *   • P1c NON-REGRESSION — the single-body member behaves exactly as before the
 *     generalization (it is still the branch that fires, and it still moves the
 *     world).
 *   • ⭐ UNIFORM-VECTOR ≡ THE SLICE-1 CERTIFIED PRIOR — a uniform obedience-0.5
 *     vector on side d is BYTE-IDENTICAL to the shipped-form prior
 *     (`eye.v4.homePrior` + `homePriorObedience = 0.5`) armed on that side only.
 *     This is what makes `uniform` an honest slice-1 control arm.
 *   • HETEROGENEITY EXISTS — a matched-mean SPREAD vector is a different world
 *     from the uniform vector (the S2-P1 discriminator has a lever).
 *   • INERT OUTSIDE THE CONSUMPTION POINT — with `stationEye` null the vector is
 *     a no-op.
 *   • BIRTH NEUTRALITY (contract §3) — no role-derived per-body default exists:
 *     the seam is null at birth and the shipped gene is a single per-TEAM value.
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const team = (name: string, seed: number, obedience?: number): TeamInfo => {
  const rng = new Rng(seed);
  const genome = randomGenome(rng);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: obedience === undefined ? genome : { ...genome, homePriorObedience: obedience },
    squad: randomSquad(rng),
  };
};
// the enriched eye-null census world (the A4 world), short duration for the tests.
const matchOf = (seed: number, obedienceA?: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1, obedienceA), teamB: team('B', seed * 2 + 2), duration: 300,
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

// --- a synthetic R3p-style eye (the a4HomeGrant fixture, verbatim) -----------
const roleCell = (score: number, concede: number, n = 400): RoleCell => ({
  n, score, concede, value: score - concede, underPowered: false,
});
const ctxKeys = [
  'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
  'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
  'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
  'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
];
// ⚠ a TIGHT column (deliberately different from the a4HomeGrant fixture): the
// candidates are separated by ~0.0006 in value, i.e. FAR below the shipped-form
// strength ceiling (HOME_MAP_STRENGTH_MAX = 0.0817). The P1c fixture's 0.25 gap
// is unflippable by a whisper-volume home prior, which would make every
// equivalence assertion below VACUOUS (both sides equal to the ungranted world);
// the non-vacuity assertion in the equivalence block guards exactly that.
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

type Grant = NonNullable<Match['homeRegionGrant']>;
/** Warm a match, clone, arm a both-scope R3p eye, optionally set the seam and/or
 *  the SHIPPED-FORM prior flag, run to the end, return the signature. */
const runR3p = (opts: { grant?: Grant; homePrior?: boolean; obedienceA?: number } = {}): string => {
  const m = matchOf(7, opts.obedienceA);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {},
    v3: { roleTable, control, children, mergedTableSha: 'test' },
    v4: {
      inSupportLaw: true, deliveryBit: true, offsideBit: true,
      ...(opts.homePrior === true ? { homePrior: true } : {}),
    },
  };
  if (opts.grant !== undefined) clone.homeRegionGrant = opts.grant;
  while (!clone.finished) clone.step(DT);
  return signature(clone);
};

// the S2-P1 frozen grid's two anchor arms (outfield indices 1..5; index 0 = GK).
const UNIFORM = [0, 0.5, 0.5, 0.5, 0.5, 0.5] as const;
const SPREAD = [0, 0.8, 0.2, 0.8, 0.2, 0.5] as const; // mean over 1..5 = 0.5 exactly

describe('A4 S2-P1 — the vector seam is shut in production (default OFF)', () => {
  it('homeRegionGrant is null on a fresh Match and on a League match', () => {
    expect(matchOf(11).homeRegionGrant).toBeNull();
    const league = new League({ seed: 20260803 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.homeRegionGrant).toBeNull();
  });

  it('BIRTH NEUTRALITY — a born genome carries no per-body obedience content', () => {
    const g = randomGenome(new Rng(99)) as unknown as Record<string, unknown>;
    expect(g.homePriorObedience).toBeUndefined();
    expect(Object.keys(g).some((k) => /offset|byIndex|perBody/i.test(k))).toBe(false);
  });
});

describe('A4 S2-P1 — FLAG-OFF byte-identity (Road B / X-FP-PROD)', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000);

  it('an R3p eye world with the seam left null reproduces itself byte-for-byte', () => {
    expect(runR3p()).toBe(runR3p());
  });

  it('a plain match with the seam left null plays tick-for-tick as an independent run', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    for (const seed of [7, 4242]) expect(runToEnd(matchOf(seed))).toBe(runToEnd(matchOf(seed)));
  });
});

describe('A4 S2-P1 — the P1c single-body member is UNTOUCHED by the generalization', () => {
  it('the single-body grant still moves the world (and is not the vector branch)', () => {
    const base = runR3p();
    const single = runR3p({ grant: { side: 0 as Side, bodyIndex: 1, strength: 1.0 } });
    expect(single).not.toBe(base);
    expect(single).not.toBe(runR3p({ grant: { side: 0 as Side, bodyIndex: 2, strength: 1.0 } }));
  });
});

describe('A4 S2-P1 — ⭐ UNIFORM VECTOR ≡ the slice-1 certified PRIOR content', () => {
  it('homePriorStrength(0.5) is the certified 0.25×VAL_SCALE primary', () => {
    expect(homePriorStrength(0.5)).toBeCloseTo(0.5 * HOME_MAP_STRENGTH_MAX, 12);
    expect(homePriorStrength(0.5)).toBeCloseTo(0.25 * 0.163494, 12);
  });

  it('a uniform 0.5 vector on side 0 is BYTE-IDENTICAL to the shipped-form prior on side 0', () => {
    const base = runR3p();
    const viaGene = runR3p({ homePrior: true, obedienceA: 0.5 }); // side 0's genome only
    const viaVector = runR3p({ grant: { side: 0 as Side, obedienceByIndex: [...UNIFORM] } });
    expect(viaVector).toBe(viaGene);
    expect(viaVector).not.toBe(base); // NON-VACUITY: the prior actually bites on this fixture
  });

  it('an all-zero vector is inert (byte-identical to the ungranted world)', () => {
    expect(runR3p({ grant: { side: 0 as Side, obedienceByIndex: [0, 0, 0, 0, 0, 0] } }))
      .toBe(runR3p());
  });
});

describe('A4 S2-P1 — heterogeneity at MATCHED mean has a lever', () => {
  it('the spread vector (mean 0.5) is a different world from the uniform vector', () => {
    const uniform = runR3p({ grant: { side: 0 as Side, obedienceByIndex: [...UNIFORM] } });
    const spread = runR3p({ grant: { side: 0 as Side, obedienceByIndex: [...SPREAD] } });
    expect(spread).not.toBe(uniform);
    // the grid's matched-mean arithmetic, asserted (the doc's frozen claim).
    const meanOf = (v: readonly number[]): number => v.slice(1).reduce((a, b) => a + b, 0) / (v.length - 1);
    expect(meanOf(UNIFORM)).toBeCloseTo(0.5, 12);
    expect(meanOf(SPREAD)).toBeCloseTo(0.5, 12);
  });

  it('side scoping holds — the same vector on side 1 is a different world again', () => {
    const s0 = runR3p({ grant: { side: 0 as Side, obedienceByIndex: [...SPREAD] } });
    const s1 = runR3p({ grant: { side: 1 as Side, obedienceByIndex: [...SPREAD] } });
    expect(s0).not.toBe(s1);
  });
});

describe('A4 S2-P1 — INERT outside the consumption point', () => {
  it('with stationEye null, a vector grant is a no-op (byte-identical to baseline)', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    const base = runToEnd(matchOf(7));
    const withVector = matchOf(7);
    withVector.homeRegionGrant = { side: 0, obedienceByIndex: [0, 1, 1, 1, 1, 1] };
    expect(runToEnd(withVector)).toBe(base);
  });
});
