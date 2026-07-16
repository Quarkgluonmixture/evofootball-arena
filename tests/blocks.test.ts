import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { blockReadiness, effectiveBlockers, laneBlockers } from '../src/ai/perception';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import type { Player } from '../src/sim/Player';
import { DT, UNSET_BLOCK_WEIGHT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 31 step 1 — lane-aware shot selection + explicit shot blocks.
 * The pair ships together on purpose: the utility discount stops carriers
 * shooting into walls, and the block mechanic makes daring one anyway a
 * real cost (ROADMAP: blocked = loose ball, ON the pendingShot path — NOT
 * the 30.4 speed-window deflection accident).
 */

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};

const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

function team(name: string): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutralGenome(),
    squad: Array.from({ length: TEAM_SIZE }, () => attrs()),
  };
}

const breathe = (i: number): Promise<void> | undefined =>
  i % 25 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

/** Minimal body for pure-geometry laneBlockers checks. */
const body = (x: number, y: number, role = 'DF', sentOff = false): Player =>
  ({ pos: v2(x, y), role, sentOff } as unknown as Player);

describe('laneBlockers geometry (Phase 31)', () => {
  const goal = v2(45, 0);

  it('counts a body on the corridor, ignores one wide of it', () => {
    expect(laneBlockers(v2(25, 0), goal, [body(30, 0)])).toBe(1);
    expect(laneBlockers(v2(25, 0), goal, [body(30, 3)])).toBe(0);
  });

  it('the last 40% of the corridor belongs to the keeper — no count there', () => {
    // From 25m out the corridor's first 60% ends at x = 37.
    expect(laneBlockers(v2(25, 0), goal, [body(41, 0)])).toBe(0);
  });

  it('keepers and sent-off players never count', () => {
    expect(laneBlockers(v2(25, 0), goal, [body(30, 0, 'GK')])).toBe(0);
    expect(laneBlockers(v2(25, 0), goal, [body(30, 0, 'DF', true)])).toBe(0);
  });

  it('counts each parked body once', () => {
    expect(laneBlockers(v2(25, 0), goal, [body(29, 0.4), body(32, -0.5), body(35, 8)])).toBe(2);
  });
});

describe('the unset wall (Phase 60)', () => {
  const goal = v2(45, 0);
  const wall = (x: number, y: number, vel: ReturnType<typeof v2>, heading: ReturnType<typeof v2>): Player =>
    ({ pos: v2(x, y), vel, heading, role: 'DF', sentOff: false } as unknown as Player);

  it('a set, facing body counts in full; a sprinting blind one sits at the floor', () => {
    const shooter = v2(25, 0);
    const set = wall(30, 0, v2(0, 0), v2(-1, 0)); // still, eyes on the shooter
    const unset = wall(30, 0, v2(6, 0), v2(1, 0)); // sprinting goalward, back turned
    expect(effectiveBlockers(shooter, goal, [set])).toBeGreaterThan(0.95);
    expect(effectiveBlockers(shooter, goal, [unset])).toBeLessThanOrEqual(UNSET_BLOCK_WEIGHT + 1e-9);
    expect(blockReadiness(set, shooter)).toBeGreaterThan(blockReadiness(unset, shooter));
  });

  it('four mid-collapse retreaters all sit at the floor — dare the strike', () => {
    // Every retreater is fully unset, so the pack reads 4 × the floor —
    // 2.2 at the shipped 0.55 (vs the raw count's 4). The literal "~1.5"
    // this test pinned at first was the floor-0.3 iteration; the sweep to
    // 0.55 (phase-60 ledger: 0.3 broke attack/defence balance) moved it,
    // and the contract is FLOOR-RELATIVE, not a magic number.
    const shooter = v2(25, 0);
    const retreaters = [26.5, 28, 29.5, 31].map((x) => wall(x, 0.3, v2(5, 0), v2(1, 0)));
    const eff = effectiveBlockers(shooter, goal, retreaters);
    expect(eff).toBeLessThanOrEqual(4 * UNSET_BLOCK_WEIGHT + 1e-9);
    expect(eff).toBeLessThan(4 - 1e-9); // meaningfully below the raw count
    expect(laneBlockers(shooter, goal, retreaters)).toBe(4); // the raw count still sees 4
  });
});

describe('shot blocks (Phase 31)', () => {
  it('a defender parked on the path blocks a real share of drives into a loose ball', { timeout: 60000 }, async () => {
    let blocks = 0;
    let shots = 0;
    for (let seed = 0; seed < 150; seed++) {
      await breathe(seed);
      const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
      while (m.phase !== 'playing') m.step(DT);
      const shooter = m.teams[0].players[5];
      shooter.pos = v2(24, 0);
      shooter.heading = { x: 1, y: 0 };
      // Park everyone else far away so only the one wall body is in play.
      for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
        if (p === shooter || p.role === 'GK') continue;
        p.pos = v2(-30, p.gid % 2 === 0 ? 20 : -20);
        p.vel = v2(0, 0);
      }
      const wall = m.teams[1].players[1];
      wall.pos = v2(27.5, 0); // square on the corridor, 3.5m ahead
      wall.vel = v2(0, 0);
      wall.heading = { x: -1, y: 0 }; // SET and facing the strike (Phase 60 readiness)
      m.ball.owner = shooter;
      m.ball.pos = v2(24.8, 0);
      m.possessionSide = 0;
      m.performShot(shooter);
      shots++;
      for (let i = 0; i < 90 && m.pendingShot; i++) m.step(DT);
      blocks += m.teams[1].stats.blocks;
    }
    // The parked body blocks a meaningful share — but a drive still gets
    // through often enough that shooting over a lone leg stays viable.
    expect(blocks / shots).toBeGreaterThan(0.15);
    expect(blocks / shots).toBeLessThan(0.75);
  });

  it('a blocked shot is a LOOSE ball: shot resolved as miss, nobody owns it, the drive is killed', () => {
    // Deterministic single case: scan seeds for the first block, then assert
    // the state the mechanic promises.
    for (let seed = 0; seed < 60; seed++) {
      const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
      while (m.phase !== 'playing') m.step(DT);
      const shooter = m.teams[0].players[5];
      shooter.pos = v2(24, 0);
      shooter.heading = { x: 1, y: 0 };
      for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
        if (p === shooter || p.role === 'GK') continue;
        p.pos = v2(-30, p.gid % 2 === 0 ? 20 : -20);
        p.vel = v2(0, 0);
      }
      const wall = m.teams[1].players[1];
      wall.pos = v2(27.5, 0);
      wall.vel = v2(0, 0);
      m.ball.owner = shooter;
      m.ball.pos = v2(24.8, 0);
      m.possessionSide = 0;
      m.performShot(shooter);
      for (let i = 0; i < 30 && m.pendingShot; i++) m.step(DT);
      if (m.teams[1].stats.blocks === 0) continue;
      expect(m.pendingShot).toBeNull();
      expect(m.shotLog[m.shotLog.length - 1].outcome).toBe('miss');
      const speed = Math.hypot(m.ball.vel.x, m.ball.vel.y);
      expect(speed).toBeLessThan(12); // ricochet, not the 27 m/s drive
      expect(m.ball.lastTouch).toBe(wall);
      return;
    }
    throw new Error('no block occurred in 60 seeds — the mechanic is dead');
  });

  it('directional: two bodies on the corridor cut the same shot\'s conversion nearly in half', { timeout: 120000 }, async () => {
    // CONTROLLED A/B, not league observation: selection now filters doomed
    // walled shots out, so the walled shots that survive in league data are
    // the good ones (selection bias — same lesson as failure mode 20). The
    // causal claim needs the same forced geometry with and without a wall.
    // Geometry note: an ANGLED 13.6m strike — a straight central drive at a
    // SET keeper converts ~0 in this engine regardless of walls (the save
    // roll plus the capture swallow eat it), so the wall's effect would be
    // invisible there. Measured at this geometry: clean 13%, walled 6.5%.
    const convert = async (walls: boolean): Promise<number> => {
      let goals = 0;
      for (let seed = 0; seed < 200; seed++) {
        await breathe(seed);
        const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
        while (m.phase !== 'playing') m.step(DT);
        const shooter = m.teams[0].players[5];
        shooter.pos = v2(32, 4);
        const goal = v2(45, 0);
        const hd = Math.hypot(goal.x - 32, goal.y - 4);
        shooter.heading = { x: (goal.x - 32) / hd, y: (goal.y - 4) / hd };
        for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
          if (p === shooter || p.role === 'GK') continue;
          p.pos = v2(-30, p.gid % 2 === 0 ? 20 : -20);
          p.vel = v2(0, 0);
        }
        if (walls) {
          m.teams[1].players[1].pos = v2(35, 3.08); // both dead on the corridor
          m.teams[1].players[2].pos = v2(36.8, 2.52);
          m.teams[1].players[1].vel = v2(0, 0);
          m.teams[1].players[2].vel = v2(0, 0);
          // SET walls face the strike (Phase 60 readiness) — the test's
          // contract is about set bodies, not mid-collapse retreaters.
          for (const w of [m.teams[1].players[1], m.teams[1].players[2]]) {
            const wd = Math.hypot(32 - w.pos.x, 4 - w.pos.y);
            w.heading = { x: (32 - w.pos.x) / wd, y: (4 - w.pos.y) / wd };
          }
        }
        m.ball.owner = shooter;
        m.ball.pos = v2(32.6, 3.8);
        m.possessionSide = 0;
        m.performShot(shooter);
        const scoreBefore = m.score[0];
        for (let i = 0; i < 150 && m.pendingShot; i++) {
          // Keep the manufactured walls SET (Phase 60): their brains start
          // recovering the moment the scene runs, and a drifting body is —
          // by design — a weaker wall. The contract here is about set ones.
          if (walls) {
            for (const w of [m.teams[1].players[1], m.teams[1].players[2]]) {
              w.vel = v2(0, 0);
              const wd = Math.hypot(32 - w.pos.x, 4 - w.pos.y);
              w.heading = { x: (32 - w.pos.x) / wd, y: (4 - w.pos.y) / wd };
            }
          }
          m.step(DT);
        }
        if (m.score[0] > scoreBefore) goals++;
      }
      return goals / 200;
    };
    const clean = await convert(false);
    const walled = await convert(true);
    expect(clean).toBeGreaterThan(0.08); // the clean angled strike is a real chance
    expect(walled).toBeLessThan(clean * 0.65); // the wall takes ≥35% off it
  });
});

describe('the open run (Phase 31 — 单刀回传 / 大空间不突破)', () => {
  it('a breakaway carrier drives or finishes — never turns back', () => {
    // Grid of breakaway geometries: carrier bearing down with only the
    // keeper ahead, one chaser at his back, one trailing open teammate.
    // Decisions are deterministic — every single one must go forward.
    for (const carrierX of [20, 24, 28]) {
      for (const chaserGap of [1.8, 3]) {
        for (const mateBack of [8, 14]) {
          const m = new Match({ seed: 11, teamA: team('A'), teamB: team('B'), duration: 120 });
          while (m.phase !== 'playing') m.step(DT);
          const carrier = m.teams[0].players[5];
          carrier.pos = v2(carrierX, 0);
          carrier.heading = { x: 1, y: 0 };
          carrier.vel = v2(6, 0);
          for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
            if (p === carrier || p.role === 'GK') continue;
            p.pos = v2(-35, p.gid % 2 === 0 ? 22 : -22); // everyone else far behind
            p.vel = v2(0, 0);
          }
          const chaser = m.teams[1].players[1];
          chaser.pos = v2(carrierX - chaserGap, 0.5); // at his back
          const mate = m.teams[0].players[2];
          mate.pos = v2(carrierX - mateBack, -4); // the trailing outlet
          m.ball.owner = carrier;
          m.ball.pos = v2(carrierX + 0.8, 0);
          m.possessionSide = 0;
          m.pendingPass = null;
          m.kickoffKickGid = null; // the ST is the kickoff taker — disarm the forced back-pass
          m.restartKickGid = null;
          decidePlayer(carrier, m);
          const a = carrier.action.type;
          const forward = a === 'Dribble' || a === 'Shoot';
          if (!forward) {
            // A pass is only acceptable if it goes FORWARD (nobody is —
            // the only mate is trailing, so any pass here is the crime).
            throw new Error(
              `breakaway at x=${carrierX} (chaser ${chaserGap}m, mate −${mateBack}m) chose ${a}`,
            );
          }
        }
      }
    }
  });
});
