import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import type { RecensusCostTable } from '../src/ai/whetherEye';

/**
 * C5 T2 — THE WHETHER SEAT pinning tests (docs/world-model/C5-T2-WHETHER-SEAT.md
 * §2, ruling #64.3). A dormant seam's one job is that the shipped world is
 * unchanged; the seat's extra job is that when it DOES bite it reads the body's
 * own percept and holds ONLY where the certified interval reaches zero (R-B).
 */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** The enriched census world (§0.1) — the world the table was priced on. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true,
} as const;
const matchOf = (seed: number, armed: boolean): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: 240, ...(armed ? CENSUS_FLAGS : {}),
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina })),
})).digest('hex');

// --- the certified table, loaded from data (never bundled in src) ------------
const raw = JSON.parse(readFileSync('docs/world-model/data/c5-recensus.json', 'utf8'));
const params = raw.parameters;
const tableFrom = (override: boolean | null): RecensusCostTable => ({
  pressureBands: params.pressureBands,
  staleBands: params.staleBands,
  supportCuts: params.supportCuts,
  supportWindowM: params.supportWindowM,
  cells: raw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper,
      reachesZero: override === null ? k.reachesZero : override,
    })),
  })),
});
const CERTIFIED = tableFrom(null); // the real table: only 0|0|0 k30 reaches zero
const ALL_ZERO = tableFrom(true); // every cell reaches zero → the seat bites often
const ALL_DECLINED = tableFrom(false); // no cell reaches zero → the seat never bites

const arm = (m: Match, table: RecensusCostTable): void => {
  m.whetherEye = { arm: 'neutral', scope: { kind: 'both' }, table };
};
/** Count of committed whether-holds (ShieldHold ticks under the seat) + cells. */
const playWithSeat = (seed: number, table: RecensusCostTable) => {
  const m = matchOf(seed, true);
  arm(m, table);
  let holdTicks = 0;
  const cells = new Set<string>();
  while (!m.finished) {
    m.step(DT);
    for (const [, c] of m.whetherHoldState) cells.add(c.cellAtDecision);
    for (const p of m.allPlayers) if (p.action.type === 'ShieldHold') holdTicks += 1;
  }
  return { holdTicks, cells };
};

describe('C5 T2 — the whether seat is dormant by default', () => {
  it('default-off: whetherEye is null on a fresh Match and a League fixture', () => {
    const m = matchOf(7, false);
    expect(m.whetherEye).toBeNull();
    expect(m.whetherHoldState.size).toBe(0);
    const league = new League({ seed: 20260730 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.whetherEye).toBeNull();
    expect(live.whetherHoldState.size).toBe(0);
  });

  it('default-off: an armed census world with NO seat never emits ShieldHold', () => {
    // whetherEye left null: the whole seam is unreachable, forcedHold unset.
    const m = matchOf(4242, true);
    let sawShield = false;
    while (!m.finished) {
      m.step(DT);
      for (const p of m.allPlayers) if (p.action.type === 'ShieldHold') sawShield = true;
    }
    expect(sawShield).toBe(false);
  });
});

describe('C5 T2 — the seam is read in exactly one place (X-SEAM)', () => {
  it('single-seam: whetherEyeDecision is called from exactly one src site', () => {
    const brain = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
    const calls = (brain.match(/whetherEyeDecision\(/g) ?? []).length;
    expect(calls).toBe(1);
    // And nowhere else in the sim/ai layer reads the decision.
    for (const f of ['src/sim/Match.ts', 'src/ai/actionExecutor.ts']) {
      expect(readFileSync(f, 'utf8').includes('whetherEyeDecision(')).toBe(false);
    }
  });
});

describe('C5 T2 — OFF bit-identity and the reaches-zero gate', () => {
  it('X4 seam inert: armed with an all-declined table, the world is byte-identical to null', () => {
    // Every cell resolved-negative ⇒ the seat prices and DECLINES everywhere; it
    // never overrides `top`. Even though the percept is pulled each eligible
    // moment, the world must be bit-for-bit the unarmed census world (proving
    // the pull has no side effect on the sim).
    for (const seed of [4242, 90210, 20260730]) {
      const off = matchOf(seed, true);
      const on = matchOf(seed, true);
      arm(on, ALL_DECLINED);
      while (!off.finished) off.step(DT);
      while (!on.finished) on.step(DT);
      expect(signature(on)).toBe(signature(off));
      expect(on.score).toEqual(off.score);
    }
  });

  it('the option is absent when the cell is not certified-zero', () => {
    // All-declined ⇒ zero holds; all-zero ⇒ the capability is real and holds fire.
    let declinedHolds = 0;
    let zeroHolds = 0;
    for (const seed of [4242, 90210, 20260730]) {
      declinedHolds += playWithSeat(seed, ALL_DECLINED).holdTicks;
      zeroHolds += playWithSeat(seed, ALL_ZERO).holdTicks;
    }
    expect(declinedHolds).toBe(0);
    expect(zeroHolds).toBeGreaterThan(0);
  });

  it('R-B: with the certified table every committed hold is in the one reaches-zero cell 0|0|0', () => {
    const cells = new Set<string>();
    for (let seed = 4242; seed < 4258; seed++) {
      for (const c of playWithSeat(seed, CERTIFIED).cells) cells.add(c);
    }
    // Only 0|0|0 k30 reaches zero in the certified table, so no other cell may hold.
    for (const c of cells) expect(c).toBe('0|0|0');
  });
});

describe('C5 T2 — the perceived cell is percept, not truth', () => {
  it('percept-not-truth: blind (perception OFF) the seat holds NOWHERE even with an all-zero table', () => {
    // The seat reads `perceivedSnapshot`. With perception OFF the body perceives
    // no opponents, so no cell can be placed (E-NOCELL / E-ABSTAIN-UNSEEN) and the
    // seat abstains — a truth-reading seat would place a cell from the always-present
    // true opponents and hold constantly. Zero holds is the divergence.
    let blindHolds = 0;
    for (const seed of [4242, 90210, 20260730]) {
      const m = new Match({
        seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
        duration: 240, c5Hold: true, c6Carry: true, c7Windup: true, // NO perception
      });
      arm(m, ALL_ZERO);
      while (!m.finished) {
        m.step(DT);
        for (const p of m.allPlayers) if (p.action.type === 'ShieldHold') blindHolds += 1;
      }
    }
    expect(blindHolds).toBe(0);
  });
});
