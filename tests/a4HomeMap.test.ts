import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { runHeadless } from '../src/sim/simRunner';
import { DT, HALF_L, BOX_WIDTH } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import {
  EYE_LATTICE, HOME_MAP_DECAY_M, HOME_MAP_HALF_DEPTH, HOME_MAP_HALF_WIDTH,
  homeMapBias, priceApproachesV3Partial,
  type MergedChildTable, type RoleCell, type RoleConditionedTable, type RoleControlLevels,
} from '../src/ai/stationEye';
import { ATTACK_FORMATIONS } from '../src/ai/formations';

/**
 * A4-P1d (docs/world-model/A4-P1D-MAP-GRANT-CENSUS.md, ruling #143) — the DORMANT
 * HOME-MAP GRANT seam `Match.homeMapGrant` (null in every production path) + its
 * consumption at the established v3 station-scoring point (the per-body `homeBias`
 * added to the per-candidate advantage, centred on HIS ATTACK_FORMATIONS base spot).
 * The P1c single-body flag `Match.homeRegionGrant` is BANKED UNTOUCHED — this is a
 * NEW parallel form. The pins (the a4HomeGrant idiom):
 *   • DEFAULT OFF — null on a fresh Match and a League match.
 *   • FLAG-OFF BYTE-IDENTITY — the shipped world plays tick-for-tick as HEAD and
 *     the production fingerprint 57b0bdab…c673 is unchanged (X-FP-PROD).
 *   • FLAG-ON EFFECT EXISTENCE — granted, MULTIPLE bodies' station argmaxes diverge
 *     on the eye world (distinct per-body homes ⇒ distinct bias fields; a full
 *     R3p-style match diverges).
 *   • SIDE-SCOPING — granting side 0 vs side 1 changes DIFFERENT worlds.
 *   • INDEPENDENCE — the map flag (all outfielders) with the old single flag null is
 *     a DIFFERENT world from the old single-body flag on (only body 1).
 *   • INERT OUTSIDE THE CONSUMPTION POINT — with `stationEye` null (no eye) the map
 *     grant is a no-op: it lives ONLY at the eye's station-scoring point.
 * NO clamp, NO new consumption moment; per-body centres are the world's own
 * formation variable, extents are pre-registered from published pitch constants on
 * BOTH axes.
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

// --- a synthetic R3p-style eye (the a4HomeGrant idiom) -----------------------
const roleCell = (score: number, concede: number, n = 400): RoleCell => ({
  n, score, concede, value: score - concede, underPowered: false,
});
const ctxKeys = [
  'ours|ownThird|sparse', 'ours|ownThird|crowded', 'ours|middle|sparse', 'ours|middle|crowded',
  'ours|theirThird|sparse', 'ours|theirThird|crowded', 'theirs|ownThird|sparse',
  'theirs|ownThird|crowded', 'theirs|middle|sparse', 'theirs|middle|crowded',
  'theirs|theirThird|sparse', 'theirs|theirThird|crowded',
];
// a FRONT-favouring column (favoured pick is dx>0) so a home-map bias has
// something to overcome — every body's argmax must be able to legally move.
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

/** Warm a match, clone, arm a both-scope R3p eye, optionally set a home grant
 *  (map or single-body), run to end, return the signature. */
const runR3p = (
  opts: { map?: { side: Side; strength: number }; single?: { side: Side; bodyIndex: number; strength: number } } = {},
): string => {
  const m = matchOf(7);
  for (let i = 0; i < 400; i++) m.step(DT);
  const clone = cloneSimulationState(m);
  clone.stationEye = {
    arm: 'neutral', scope: { kind: 'both' }, table: {},
    v3: { roleTable, control, children, mergedTableSha: 'test' },
    v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
  };
  if (opts.map !== undefined) clone.homeMapGrant = opts.map;
  if (opts.single !== undefined) clone.homeRegionGrant = opts.single;
  while (!clone.finished) clone.step(DT);
  return signature(clone);
};

describe('A4-P1d — the map-grant seam is shut in production (default OFF)', () => {
  it('homeMapGrant is null on a fresh Match and on a League match', () => {
    expect(matchOf(11).homeMapGrant).toBeNull();
    const league = new League({ seed: 20260803 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.homeMapGrant).toBeNull();
  });
});

describe('A4-P1d — FLAG-OFF byte-identity (Road B / X-FP-PROD)', () => {
  it('the production fingerprint is UNCHANGED (57b0bdab…c673)', () => {
    const fpLeague = new League({ seed: 1337 });
    const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: fpLeague.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 120_000); // the 2-season league fingerprint is heavy; override the 20 s global timeout

  it('a match with BOTH grants left null plays tick-for-tick as an independent plain run', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    for (const seed of [7, 4242]) {
      expect(runToEnd(matchOf(seed))).toBe(runToEnd(matchOf(seed)));
    }
  });

  it('an R3p eye world with both grants left null reproduces itself byte-for-byte', () => {
    expect(runR3p()).toBe(runR3p());
  });
});

describe('A4-P1d — the 2D home-box geometry (published-anchored soft decay)', () => {
  it('extents derive from published pitch constants on both axes', () => {
    expect(HOME_MAP_HALF_DEPTH).toBeCloseTo(HALF_L / 6, 9);
    expect(HOME_MAP_HALF_WIDTH).toBeCloseTo(BOX_WIDTH / 4, 9);
    expect(HOME_MAP_DECAY_M).toBeCloseTo(HALF_L / 3, 9);
  });

  it('homeMapBias is full inside the box, decays outside on both axes, symmetric, inert at 0', () => {
    const hx = -12; const hy = 5;
    // inside the box ⇒ full strength.
    expect(homeMapBias(1, hx, hy, hx, hy)).toBeCloseTo(1, 9);
    expect(homeMapBias(1, hx + HOME_MAP_HALF_DEPTH, hy + HOME_MAP_HALF_WIDTH, hx, hy)).toBeCloseTo(1, 9);
    // outside on depth ⇒ strictly less, monotone in depth distance.
    const nearD = homeMapBias(1, hx + HOME_MAP_HALF_DEPTH + 6, hy, hx, hy);
    const farD = homeMapBias(1, hx + HOME_MAP_HALF_DEPTH + 20, hy, hx, hy);
    expect(nearD).toBeLessThan(1);
    expect(farD).toBeLessThan(nearD);
    // outside on width ⇒ decays too (BOTH axes, #136).
    const offW = homeMapBias(1, hx, hy + HOME_MAP_HALF_WIDTH + 10, hx, hy);
    expect(offW).toBeLessThan(1);
    // symmetric about the centre on each axis.
    expect(homeMapBias(1, hx + 10, hy, hx, hy)).toBeCloseTo(homeMapBias(1, hx - 10, hy, hx, hy), 9);
    expect(homeMapBias(1, hx, hy + 12, hx, hy)).toBeCloseTo(homeMapBias(1, hx, hy - 12, hx, hy), 9);
    // strength 0 ⇒ exactly inert.
    expect(homeMapBias(0, hx, hy, hx, hy)).toBe(0);
  });

  it('DISTINCT per-body homes give DISTINCT bias fields (the map is not one region)', () => {
    // two different formation base spots ⇒ a candidate deep-left is home-ward for one
    // body and away for another — proof the map prices EACH body by HIS own home.
    const bodyA = { x: -16, y: -6 }; // wide-212 DF
    const bodyB = { x: 8, y: 19 };   // wide-212 WGR
    const candDeepLeft = { x: -16, y: -6 };
    expect(homeMapBias(1, candDeepLeft.x, candDeepLeft.y, bodyA.x, bodyA.y))
      .toBeGreaterThan(homeMapBias(1, candDeepLeft.x, candDeepLeft.y, bodyB.x, bodyB.y));
  });
});

describe('A4-P1d — FLAG-ON effect existence (multiple bodies station toward their homes)', () => {
  it('every outfield body\'s home-ward candidate scores higher under the map bias', () => {
    const g = randomGenome(new Rng(2));
    const k = 'ours|middle|sparse';
    const bits = { deliveryOn: true, offsideOn: true, widthHeld: 1 as const, offsideLine: null, ballLocalX: -5 };
    const home = ATTACK_FORMATIONS['wide-212'];
    // for a sample of DISTINCT bodies (DF/MF/WG/ST), a bias favouring their OWN home
    // depth flips the argmax to a home-ward candidate — the multi-body effect.
    let shifted = 0;
    for (const [idx, role] of [[1, 'DF'], [2, 'MF'], [4, 'WG'], [5, 'ST']] as const) {
      const hx = home[idx].x;
      const bare = priceApproachesV3Partial(roleTable, control, children, k, role, 'neutral', g, bits);
      const bias = (cand: { dx: number; dy: number }): number =>
        homeMapBias(2.0, cand.dx, cand.dy, hx, home[idx].y);
      const granted = priceApproachesV3Partial(roleTable, control, children, k, role, 'neutral', g, bits, bias);
      if (bare.outcome.kind === 'deviate' && granted.outcome.kind === 'deviate'
        && granted.outcome.candidate.id !== bare.outcome.candidate.id) shifted += 1;
    }
    expect(shifted).toBeGreaterThanOrEqual(2); // MULTIPLE bodies diverge
  });

  it('a full R3p-style match with side 0 map-granted DIVERGES from the ungranted world', () => {
    const base = runR3p();
    const granted = runR3p({ map: { side: 0, strength: 1.0 } });
    expect(granted).not.toBe(base);
  });
});

describe('A4-P1d — SIDE-scoping', () => {
  it('granting side 0 vs side 1 are different worlds, both differ from baseline', () => {
    const base = runR3p();
    const s0 = runR3p({ map: { side: 0, strength: 1.0 } });
    const s1 = runR3p({ map: { side: 1, strength: 1.0 } });
    expect(s0).not.toBe(base);
    expect(s1).not.toBe(base);
    expect(s0).not.toBe(s1);
  });
});

describe('A4-P1d — INDEPENDENCE from the banked P1c single-body flag', () => {
  it('the map grant (all outfielders) differs from the single-body grant (only body 1)', () => {
    const mapOnly = runR3p({ map: { side: 0, strength: 1.0 } });
    const singleOnly = runR3p({ single: { side: 0, bodyIndex: 1, strength: 1.0 } });
    expect(mapOnly).not.toBe(singleOnly);
  });
});

describe('A4-P1d — INERT outside the consumption point (the grant lives at the eye)', () => {
  it('with stationEye null, a map grant is a no-op (byte-identical to baseline)', () => {
    const runToEnd = (m: Match): string => { while (!m.finished) m.step(DT); return signature(m); };
    const base = runToEnd(matchOf(7));
    const withGrant = matchOf(7);
    withGrant.homeMapGrant = { side: 0, strength: 5.0 }; // huge, but no eye to read it
    expect(runToEnd(withGrant)).toBe(base);
  });
});
