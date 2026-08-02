import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { runHeadless } from '../src/sim/simRunner';
import { DT, HALF_L } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  EYE_LATTICE, HOME_REGION_CENTER_LOCAL_X, HOME_REGION_DECAY_M, HOME_REGION_HALF_DEPTH,
  backHomeRegionBias, priceApproachesV3, priceApproachesV3Partial,
  type MergedChildTable, type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';

/**
 * A4-P1c (docs/world-model/A4-P1C-GRANT-CENSUS.md, ruling #137) — the DORMANT
 * back-home-region GRANT seam `Match.homeRegionGrant` (null in every production
 * path) + its consumption at the established v3 station-scoring point
 * (priceApproachesV3 / priceApproachesV3Partial's `homeBias`, added to the
 * per-candidate advantage). The pins (the a4RestAbandon idiom):
 *   • DEFAULT OFF — null on a fresh Match and a League match.
 *   • FLAG-OFF BYTE-IDENTITY — the shipped world plays tick-for-tick as HEAD and
 *     the production fingerprint 57b0bdab…c673 is unchanged (X-FP-PROD); the
 *     scoring functions with `homeBias` omitted === the pre-seam calls.
 *   • FLAG-ON EFFECT EXISTENCE — granted, the body's station argmax diverges on
 *     the eye world at a live consumption moment (a full R3p-style match diverges).
 *   • BODY- and SIDE-SCOPING — granting body 1 vs 2, or side 0 vs 1, changes
 *     DIFFERENT worlds.
 *   • INERT OUTSIDE THE CONSUMPTION POINT — with `stationEye` null (no eye) the
 *     grant is a no-op: the grant lives ONLY at the eye's station-scoring point.
 * NO clamp, NO new consumption moment; the region is anchored on published
 * constants (the neutral rest-defence clamp depth + REST_THIRD geometry).
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
// the enriched eye-null census world (the A4 world), short duration for the tests.
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

// --- a synthetic R3p-style eye (the stationEyeV4 idiom) ----------------------
const roleCell = (score: number, concede: number, n = 400): RoleCell => ({
  n, score, concede, value: score - concede, underPowered: false,
});
const ctxKeys = [
  'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
  'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
  'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
  'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
];
// a FRONT-favouring column (the favoured pick is dx>0) so a back-home grant has
// something to overcome — the argmax must be able to legally move deeper.
const fav: Record<Role, string> = { GK: 'r7a0', DF: 'r7a0', MF: 'r7a0', WG: 'r7a0', ST: 'r7a0' };
const columnFor = (favId: string): Record<string, RoleCell> =>
  Object.fromEntries(EYE_LATTICE.map((c) => [c.id, roleCell(c.id === favId ? 0.30 : 0.05, 0.05)]));
const roleTable: RoleConditionedTable = Object.fromEntries(ctxKeys.map((k) => [k, {
  DF: columnFor(fav.DF), MF: columnFor(fav.MF), WG: columnFor(fav.WG), ST: columnFor(fav.ST),
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
      for (const c of EYE_LATTICE) {
        d[c.id] = { 1: col[c.id] };
        o[c.id] = { 0: col[c.id], 1: col[c.id] };
      }
      delivery[key] = d; offside[key] = o;
    }
  }
  return { delivery, offside };
};
const children = buildChildren();

/** Warm a match, clone, arm a both-scope R3p eye (v3 + children + all three v4
 *  flags), optionally set a home-region grant, run on, return the signature. */
const runR3p = (grant?: { side: Side; bodyIndex: number; strength: number }): string => {
  const m = matchOf(7);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {},
    v3: { roleTable, control, children, mergedTableSha: 'test' },
    v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
  };
  if (grant !== undefined) clone.homeRegionGrant = grant;
  // run to match end — the deep index-1 body is consulted under the in-support
  // law only intermittently (the F-NULL consideration the census measures), so a
  // full match is needed for the grant's argmax shifts to accrue into the state.
  while (!clone.finished) clone.step(DT);
  return signature(clone);
};

describe('A4-P1c — the grant seam is shut in production (default OFF)', () => {
  it('homeRegionGrant is null on a fresh Match and on a League match', () => {
    expect(matchOf(11).homeRegionGrant).toBeNull();
    const league = new League({ seed: 20260803 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.homeRegionGrant).toBeNull();
  });
});

describe('A4-P1c — FLAG-OFF byte-identity (Road B / X-FP-PROD)', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000); // the 2-season league fingerprint is heavy; override the 20 s global timeout

  it('a match with the grant left null plays tick-for-tick as an independent plain run', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    for (const seed of [7, 4242]) {
      expect(runToEnd(matchOf(seed))).toBe(runToEnd(matchOf(seed)));
    }
  });

  it('an R3p eye world with the grant left null reproduces itself byte-for-byte', () => {
    expect(runR3p()).toBe(runR3p());
  });

  it('priceApproachesV3 / …Partial with homeBias omitted === the pre-seam call (default inert)', () => {
    const bits = { deliveryOn: true, offsideOn: true, widthHeld: 1 as const, offsideLine: null, ballLocalX: -5 };
    const g = randomGenome(new Rng(1));
    const k = 'ours|middle|sparse';
    const a = priceApproachesV3(roleTable, control, k, 'DF', 'neutral', g);
    const b = priceApproachesV3(roleTable, control, k, 'DF', 'neutral', g, undefined);
    expect(a).toEqual(b);
    const pa = priceApproachesV3Partial(roleTable, control, children, k, 'DF', 'neutral', g, bits);
    const pb = priceApproachesV3Partial(roleTable, control, children, k, 'DF', 'neutral', g, bits, undefined);
    expect(pa).toEqual(pb);
  });
});

describe('A4-P1c — the region geometry (published-anchored soft decay)', () => {
  it('backHomeRegionBias is full inside the region, decays outside, symmetric, inert at 0', () => {
    expect(HOME_REGION_CENTER_LOCAL_X).toBe(-12);
    expect(HOME_REGION_HALF_DEPTH).toBe(4);
    expect(HOME_REGION_DECAY_M).toBeCloseTo(HALF_L / 3, 9);
    // inside the band [-16,-8] ⇒ full strength.
    expect(backHomeRegionBias(1, -12)).toBeCloseTo(1, 9);
    expect(backHomeRegionBias(1, -8)).toBeCloseTo(1, 9);
    expect(backHomeRegionBias(1, -16)).toBeCloseTo(1, 9);
    // outside ⇒ strictly less, and monotone in distance from the band.
    const nearFront = backHomeRegionBias(1, 0); // 4 outside (|-12-0|-4 = 8)
    const farFront = backHomeRegionBias(1, 20);
    expect(nearFront).toBeLessThan(1);
    expect(farFront).toBeLessThan(nearFront);
    // symmetric about the centre by construction.
    expect(backHomeRegionBias(1, -12 + 10)).toBeCloseTo(backHomeRegionBias(1, -12 - 10), 9);
    // strength 0 ⇒ exactly inert.
    expect(backHomeRegionBias(0, -12)).toBe(0);
  });
});

describe('A4-P1c — FLAG-ON effect existence (the granted argmax moves deeper)', () => {
  it('a strong home bias flips the station argmax toward a deep candidate', () => {
    const g = randomGenome(new Rng(2));
    const k = 'ours|middle|sparse';
    const bits = { deliveryOn: true, offsideOn: true, widthHeld: 1 as const, offsideLine: null, ballLocalX: -5 };
    const bare = priceApproachesV3Partial(roleTable, control, children, k, 'DF', 'neutral', g, bits);
    // a big bias favouring the deepest back candidate (dx<0), computed on its dx.
    const homeBias = (cand: { dx: number }): number => backHomeRegionBias(1.0, cand.dx < 0 ? -12 : 40);
    const granted = priceApproachesV3Partial(roleTable, control, children, k, 'DF', 'neutral', g, bits, homeBias);
    expect(bare.outcome.kind).toBe('deviate');
    expect(granted.outcome.kind).toBe('deviate');
    if (bare.outcome.kind === 'deviate' && granted.outcome.kind === 'deviate') {
      expect(granted.outcome.candidate.id).not.toBe(bare.outcome.candidate.id);
      expect(granted.outcome.candidate.dx).toBeLessThan(0); // moved to a back candidate
    }
  });

  it('a full R3p-style match with side 0 body 1 granted DIVERGES from the ungranted world', () => {
    const base = runR3p();
    const granted = runR3p({ side: 0, bodyIndex: 1, strength: 1.0 });
    expect(granted).not.toBe(base);
  });
});

describe('A4-P1c — BODY- and SIDE-scoping', () => {
  it('granting body 1 vs body 2 are different worlds', () => {
    const b1 = runR3p({ side: 0, bodyIndex: 1, strength: 1.0 });
    const b2 = runR3p({ side: 0, bodyIndex: 2, strength: 1.0 });
    expect(b1).not.toBe(b2);
  });

  it('granting side 0 vs side 1 are different worlds, both differ from baseline', () => {
    const base = runR3p();
    const s0 = runR3p({ side: 0, bodyIndex: 1, strength: 1.0 });
    const s1 = runR3p({ side: 1, bodyIndex: 1, strength: 1.0 });
    expect(s0).not.toBe(base);
    expect(s1).not.toBe(base);
    expect(s0).not.toBe(s1);
  });
});

describe('A4-P1c — INERT outside the consumption point (the grant lives at the eye)', () => {
  it('with stationEye null, a grant set is a no-op (byte-identical to baseline)', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    const base = runToEnd(matchOf(7));
    const withGrant = matchOf(7);
    withGrant.homeRegionGrant = { side: 0, bodyIndex: 1, strength: 5.0 }; // huge, but no eye to read it
    expect(runToEnd(withGrant)).toBe(base);
  });
});
