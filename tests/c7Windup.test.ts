import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import type { Player } from '../src/sim/Player';
import { Rng } from '../src/utils/rng';

/**
 * C7 T1 — the shot wind-up (`pendingKick`), dormant
 * (docs/world-model/C7-T1-PENDINGKICK.md).
 *
 * These are the X-family pinning tests the freeze names (§GATES):
 *   default-off      — c7Windup false / pendingKick null on a fresh Match and a
 *                      League fixture.
 *   single-seam      — the shot commit is the SINGLE fork point (one armPendingKick
 *                      call), and c7Windup gates NO excluded release path
 *                      (free-kick / pass / cross / through-ball / clearance /
 *                      keeper distribution strike synchronously).
 *   SEAM-NEVER-RELEASES-OWNERSHIP (I3, #56.3(iv)) — (a) the seam holds the ball
 *                      owned through the window; (b) the armPendingKick + plant
 *                      code write ball.owner NOWHERE.
 *   STRIKE-MATH-EVALUATED-NOT-DUPLICATED (I1, #56.3(iv)) — the deferred strike
 *                      runs EXACTLY once, at readyTick, never at commit, never
 *                      twice; ZERO for a shot interrupted before readyTick.
 *   non-vacuous      — the seam is actually reached when armed.
 *   X-DET            — the armed world is deterministic twice.
 * X-FP / X-OFF-IDENT (fingerprint + 3 league seeds × 2 seasons byte-identical to
 * pre-change HEAD) are proven by the house world-signature method in the run
 * result; the default-off pin below is their unit-level companion.
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
const matchOf = (seed: number, c7Windup = false) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: 240, c7Windup,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const brainSource = readFileSync(new URL('../src/ai/PlayerBrain.ts', import.meta.url), 'utf8');
const matchSource = readFileSync(new URL('../src/sim/Match.ts', import.meta.url), 'utf8');
const execSource = readFileSync(new URL('../src/ai/actionExecutor.ts', import.meta.url), 'utf8');

// Drive an OFF base to a 'playing' tick, then hand `shooter` a clean owned ball
// with EVERY opponent parked in the far corner (no tackle can reach the window).
// This is the controlled fixture the structural window tests step through.
const armedFixture = (seed: number): { m: Match; shooter: Player; readyTick: number } => {
  const m = matchOf(seed, true);
  while (m.phase !== 'playing') m.step(DT);
  // step a little into open play so at least one owned tick has happened
  for (let i = 0; i < 30 && m.phase === 'playing'; i++) m.step(DT);
  const shooter = m.teams[0].players.find((p) => p.role !== 'GK' && !p.sentOff)!;
  // park every opponent far from the ball so no ball-keyed tackle can interrupt
  for (const o of m.teams[1].players) {
    o.pos = { x: o.side === 0 ? -50 : 50, y: 30 };
    o.vel = { x: 0, y: 0 };
  }
  shooter.kickCooldown = 0;
  shooter.stunTimer = 0;
  shooter.sentOff = false;
  shooter.vel = { x: 3, y: 0 };
  m.ball.owner = shooter;
  m.ball.pos = { x: shooter.pos.x + 0.85, y: shooter.pos.y };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  const goal = m.teams[shooter.side].oppGoal();
  m.armPendingKick(shooter, goal);
  const readyTick = m.pendingKick!.readyTick;
  return { m, shooter, readyTick };
};

describe('C7 T1 — the shot wind-up is dormant', () => {
  it('default-off: c7Windup false / pendingKick null on a fresh Match and a League fixture', () => {
    const fresh = matchOf(7);
    expect(fresh.c7Windup).toBe(false);
    expect(fresh.pendingKick).toBeNull();
    // Not env-armed, not default-ON — Road B guarantees OFF regardless of EDS_BUNDLE.
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.c7Windup).toBe(false);
    expect(bare.pendingKick).toBeNull();
    const league = new League({ seed: 20260728 });
    const fixture = league.nextFixture()!;
    const live = league.createMatch(fixture);
    expect(live.c7Windup).toBe(false);
    expect(live.pendingKick).toBeNull();
  });

  it('single-seam: the shot commit is the ONE fork point, and gates no excluded path', () => {
    // Exactly one arming call in the whole codebase — the single fork POINT.
    const armCalls = brainSource.match(/match\.armPendingKick\(/g) ?? [];
    expect(armCalls.length).toBe(1);
    expect((matchSource.match(/armPendingKick\(/g) ?? []).length).toBe(1); // the definition only
    // The fork sits in the Shoot case, gated on c7Windup, mutually exclusive with
    // both the free-kick strike and the synchronous performShot.
    const shootCase = brainSource.slice(
      brainSource.indexOf("case 'Shoot':"), brainSource.indexOf("case 'ClearBall':"));
    expect(shootCase).toMatch(/if \(kickKind === 'freeKick'\) match\.performFreeKick\(p\);/);
    expect(shootCase).toMatch(/else if \(match\.c7Windup\) match\.armPendingKick\(p, goal\);/);
    expect(shootCase).toMatch(/else match\.performShot\(p\);/);
    // No excluded release path is wrapped by c7Windup — they strike synchronously.
    for (const fn of [
      'performPass', 'performCutback', 'performLoftedPass', 'performCross',
      'performKeeperThrow', 'performThroughBall', 'performClear', 'performFreeKick',
    ]) {
      const line = brainSource.split('\n').find((l) => l.includes(`match.${fn}(`))!;
      expect(line).toBeDefined();
      expect(line).not.toContain('c7Windup');
      expect(line).not.toContain('armPendingKick');
    }
  });

  it('SEAM-NEVER-RELEASES-OWNERSHIP (a): the ball stays owned by the shooter across the window', () => {
    const { m, shooter, readyTick } = armedFixture(4242);
    // step every window tick BEFORE readyTick — the ball must stay owned by the shooter.
    while (m.simTick < readyTick - 1) {
      m.step(DT);
      expect(m.ball.owner).toBe(shooter); // held owned, never released by the seam
      expect(m.pendingKick).not.toBeNull();
    }
  });

  it('SEAM-NEVER-RELEASES-OWNERSHIP (b): the arm + plant code write ball.owner nowhere', () => {
    const arm = matchSource.slice(
      matchSource.indexOf('armPendingKick(shooter: Player'),
      matchSource.indexOf('private resolvePendingKick()'));
    expect(arm).toContain('this.pendingKick = {');
    expect(arm).not.toMatch(/\.owner\s*=[^=]/); // the seam never writes ownership (I3)
    // the executor plant block holds the movement target + faceTarget only.
    const plant = execSource.slice(
      execSource.indexOf('const pk = match.pendingKick;'),
      execSource.indexOf('// Stay onside (Phase 29)'));
    expect(plant).toContain('target = { x: p.pos.x, y: p.pos.y };');
    expect(plant).not.toMatch(/\.owner\s*=[^=]/); // reads ball.owner (===), never assigns it
  });

  it('STRIKE-MATH-EVALUATED-NOT-DUPLICATED: strike runs once, at readyTick, never at commit', () => {
    const { m, shooter, readyTick } = armedFixture(90210);
    const spy = vi.spyOn(m, 'performShot');
    // through the window (before readyTick): the deferred strike math is NEVER run.
    while (m.simTick < readyTick - 1) {
      m.step(DT);
      expect(spy).not.toHaveBeenCalled();
    }
    // the readyTick step resolves the strike — exactly once.
    m.step(DT); // stepCount -> readyTick
    expect(m.simTick).toBe(readyTick);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(shooter);
    expect(m.pendingKick).toBeNull(); // consumed
    // stepping on does not re-fire it (never twice).
    m.step(DT);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('STRIKE-MATH: ZERO strikes for a shot interrupted before readyTick', () => {
    const { m, readyTick } = armedFixture(90210);
    const spy = vi.spyOn(m, 'performShot');
    // interrupt through an EXISTING channel: the carrier is stunned in-window.
    m.step(DT);
    m.allPlayers[m.pendingKick!.gid].stunTimer = 1;
    while (m.simTick < readyTick) m.step(DT);
    expect(m.simTick).toBe(readyTick);
    expect(spy).not.toHaveBeenCalled(); // the interruption voided the strike (INT-STUN)
    expect(m.pendingKick).toBeNull();
  });

  it('non-vacuous: arming c7Windup reaches the seam and changes the world', () => {
    for (const seed of [4242, 90210, 20260728]) {
      const off = matchOf(seed, false);
      const on = matchOf(seed, true);
      let reached = false;
      while (!on.finished) {
        on.step(DT);
        if (on.pendingKick !== null) reached = true;
      }
      while (!off.finished) off.step(DT);
      expect(reached).toBe(true); // the wind-up fired at least once
      expect(signature(on)).not.toBe(signature(off));
    }
  });

  it('X-DET: the armed world is deterministic (no rng added to the wind-up)', () => {
    const a = matchOf(90210, true);
    const b = matchOf(90210, true);
    while (!a.finished) a.step(DT);
    while (!b.finished) b.step(DT);
    expect(signature(a)).toBe(signature(b));
    expect(a.score).toEqual(b.score);
  });
});
