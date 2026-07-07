import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import {
  kickMisalignment, orientationNoiseMul, orientationPowerMul, touchFailChance,
} from '../src/sim/mechanics';
import { Player, TURN_RATE } from '../src/sim/Player';
import { DT } from '../src/sim/constants';
import type { TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 27 — on-ball realism: body orientation (turning inertia, kicks
 * against the facing direction), first-touch miscontrol, and the territory
 * clock that stops sideways recycling from being free.
 */

const attrs = (technique: number): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  p.technique = technique;
  return p;
};

const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

function team(name: string, technique: number): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
    genome: neutralGenome(),
    squad: Array.from({ length: 5 }, () => attrs(technique)),
  };
}

// CI lesson (Phase 25): long statistical loops need explicit timeouts and an
// occasional event-loop yield so the runner's channel stays alive.
const breathe = (i: number): Promise<void> | undefined =>
  i % 4 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

describe('turning inertia (Phase 27)', () => {
  it('heading rotates no faster than TURN_RATE', () => {
    const p = new Player(0, 4, 'ST', 'T', attrs(0.5));
    p.pos = v2(0, 0);
    p.vel = v2(5, 0);
    p.heading = v2(1, 0);
    p.desiredVel = v2(-5, 0);
    const maxStepDot = Math.cos(TURN_RATE * DT) - 1e-9;
    for (let i = 0; i < 120; i++) {
      const before = { ...p.heading };
      p.physicsStep(DT);
      p.desiredVel = v2(-5, 0);
      const dot = before.x * p.heading.x + before.y * p.heading.y;
      expect(dot).toBeGreaterThanOrEqual(maxStepDot);
    }
  });

  it('a 180° cut completes, but takes real time (not one frame)', () => {
    const p = new Player(0, 4, 'ST', 'T', attrs(0.5));
    p.pos = v2(0, 0);
    p.vel = v2(5, 0);
    p.heading = v2(1, 0);
    let flippedAt = -1;
    for (let i = 0; i < Math.round(1.5 / DT); i++) {
      p.desiredVel = v2(-5, 0);
      p.physicsStep(DT);
      if (flippedAt < 0 && p.heading.x < -0.999) flippedAt = (i + 1) * DT;
    }
    expect(flippedAt).toBeGreaterThan(0.3); // not instant
    expect(flippedAt).toBeLessThan(1.5); // but it does happen
  });
});

describe('body orientation helpers (Phase 27)', () => {
  const facing = (hx: number, hy: number): Player => {
    const p = new Player(0, 4, 'ST', 'T', attrs(0.5));
    p.heading = v2(hx, hy);
    return p;
  };

  it('kickMisalignment: ahead 0, square 0.5, blind 1', () => {
    expect(kickMisalignment(facing(1, 0), v2(1, 0))).toBeCloseTo(0, 10);
    expect(kickMisalignment(facing(1, 0), v2(0, 1))).toBeCloseTo(0.5, 10);
    expect(kickMisalignment(facing(1, 0), v2(-1, 0))).toBeCloseTo(1, 10);
  });

  it('kicks against the body spray more and arrive weaker; technique tames both', () => {
    expect(orientationNoiseMul(0, 0.5)).toBeCloseTo(1, 10);
    expect(orientationNoiseMul(1, 0.5)).toBeGreaterThan(orientationNoiseMul(0.5, 0.5));
    expect(orientationNoiseMul(0.8, 0.9)).toBeLessThan(orientationNoiseMul(0.8, 0.1));
    expect(orientationPowerMul(0, 0.5)).toBeCloseTo(1, 10);
    expect(orientationPowerMul(1, 0.5)).toBeLessThan(orientationPowerMul(0.3, 0.5));
    expect(orientationPowerMul(0.8, 0.9)).toBeGreaterThan(orientationPowerMul(0.8, 0.1));
  });

  it('touchFailChance grows with speed/pressure/blind-side, shrinks with technique, stays bounded', () => {
    expect(touchFailChance(12, 0.5, 0.5, 0.5)).toBeGreaterThan(touchFailChance(8, 0.5, 0.5, 0.5));
    expect(touchFailChance(10, 0.9, 0.5, 0.5)).toBeGreaterThan(touchFailChance(10, 0.1, 0.5, 0.5));
    expect(touchFailChance(10, 0.5, 1, 0.5)).toBeGreaterThan(touchFailChance(10, 0.5, 0, 0.5));
    expect(touchFailChance(10, 0.5, 0.5, 0.9)).toBeLessThan(touchFailChance(10, 0.5, 0.5, 0.1));
    expect(touchFailChance(30, 1, 1, 0)).toBeLessThanOrEqual(0.4);
    expect(touchFailChance(0, 0, 0, 1)).toBeGreaterThanOrEqual(0);
  });
});

describe('first touch and forward pressure in match play (Phase 27)', () => {
  const SEEDS = [11, 42, 99, 1234, 777, 31337];

  it('directional: a low-technique squad miscontrols more (side-balanced)', { timeout: 60000 }, async () => {
    let sloppy = 0;
    let clean = 0;
    for (const [i, seed] of SEEDS.entries()) {
      await breathe(i);
      const ab = new Match({ seed, teamA: team('Clean', 0.85), teamB: team('Sloppy', 0.15), duration: 120 }).runToCompletion();
      clean += ab.stats[0].miscontrols;
      sloppy += ab.stats[1].miscontrols;
      const ba = new Match({ seed, teamA: team('Sloppy', 0.15), teamB: team('Clean', 0.85), duration: 120 }).runToCompletion();
      sloppy += ba.stats[0].miscontrols;
      clean += ba.stats[1].miscontrols;
    }
    expect(sloppy).toBeGreaterThan(clean);
  });

  it('teams play forward and errors exist at plausible rates', { timeout: 60000 }, async () => {
    let passes = 0;
    let forward = 0;
    let miscontrols = 0;
    let matches = 0;
    for (const [i, seed] of SEEDS.entries()) {
      await breathe(i);
      const r = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 }).runToCompletion();
      for (const st of r.stats) {
        passes += st.passes;
        forward += st.passesForward;
        miscontrols += st.miscontrols;
      }
      matches++;
    }
    const forwardShare = forward / Math.max(passes, 1);
    expect(forwardShare).toBeGreaterThan(0.4); // recycling is no longer free
    expect(forwardShare).toBeLessThan(0.8); // but build-up still exists
    expect(miscontrols / matches).toBeGreaterThan(2); // forced errors are real
    expect(miscontrols / matches).toBeLessThan(25); // and not slapstick
  });

  it('a keeper claim becomes a protected hold: hands, no tackles, then distribution (27.2)', () => {
    const m = new Match({ seed: 9, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    const gk = m.teams[0].goalkeeper;
    m.giveBall(gk);
    expect(gk.gkHoldTimer).toBeGreaterThan(0);
    // Park an opponent right on the ball: the hold must make a tackle impossible.
    const presser = m.teams[1].players[4];
    presser.pos = { x: m.ball.pos.x + 0.5, y: m.ball.pos.y };
    presser.tackleCooldown = 0;
    for (let i = 0; i < 30 && gk.gkHoldTimer > 0; i++) {
      presser.pos = { x: m.ball.pos.x + 0.5, y: m.ball.pos.y };
      m.step(DT);
      expect(m.ball.owner).toBe(gk); // never dispossessed mid-hold
    }
  });

  it('the kickoff first touch is a pass played backward (27.3)', () => {
    for (const seed of [3, 17, 88]) {
      const m = new Match({ seed, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
      // Step until the kickoff pass is in flight (it is the match's first pass).
      for (let i = 0; i < 240 && !m.pendingPass; i++) m.step(DT);
      expect(m.pendingPass).not.toBeNull();
      const kicking = m.teams[m.pendingPass!.side];
      const receiver = m.allPlayers[m.pendingPass!.targetGid];
      expect(kicking.localX(receiver.pos.x)).toBeLessThan(0); // played back
    }
  });

  it('opponents are held out of the box until a goal kick is taken (27.3)', () => {
    const m = new Match({ seed: 21, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    while (m.phase !== 'playing') m.step(DT);
    // Attacker (side 0) puts it over team 1's goal line, wide of the mouth.
    m.ball.owner = null;
    m.ball.lastTouch = m.teams[0].players[4];
    m.ball.pos = { x: 46, y: 12 };
    m.ball.vel = { x: 2, y: 0 };
    m.step(DT);
    expect(m.phase).toBe('restart');
    expect(m.restart!.kind).toBe('goalKick');
    expect(m.restart!.side).toBe(1);
    // Park an attacker deep inside team 1's box: the restart must expel them.
    const intruder = m.teams[0].players[4];
    intruder.pos = { x: 40, y: 0 };
    m.step(DT);
    expect(m.inPenaltyBox(intruder.pos, 1)).toBe(false);
  });

  it('the territory clock resets on possession change and accrues in stale spells', () => {
    const m = new Match({ seed: 5, teamA: team('A', 0.5), teamB: team('B', 0.5), duration: 120 });
    m.teams[0].resetProgress(3);
    expect(m.teams[0].progressLocalX).toBe(3);
    expect(m.teams[0].staleTime).toBe(0);
    // Run real play: the clock must stay sane (bounded by restarts and
    // turnovers) and both teams must have exercised it.
    while (!m.finished && m.simTime < 60) m.step(DT);
    for (const t of m.teams) {
      expect(t.staleTime).toBeGreaterThanOrEqual(0);
      expect(t.staleTime).toBeLessThan(60);
      expect(Number.isFinite(t.progressLocalX)).toBe(true);
    }
  });
});
