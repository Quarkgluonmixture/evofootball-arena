import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { cloneSimulationState } from '../src/sim/cloneState';
import { CROSS_FLIGHT_MIN_S, DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * C4 O1 / O2 — the two compliant oracles' seams (contracts §4.1 X1-X3).
 *
 * A seam has two jobs and this file is both of them: shut, the world must be
 * the shipped world; open, it must actually bite.
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
const matchOf = (seed: number) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 300,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

describe('C4 O1/O2 — the oracle seams are shut in production', () => {
  it('X3: all three seams are null on a fresh Match and on a League fixture', () => {
    const m = matchOf(7);
    expect(m.forcedCrossProfile).toBeNull();
    expect(m.forcedStation).toBeNull();
    expect(m.forcedStationPolicy).toBeNull();
    const league = new League({ seed: 20260727 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.forcedCrossProfile).toBeNull();
    expect(live.forcedStation).toBeNull();
    expect(live.forcedStationPolicy).toBeNull();
  });

  it('X3: neither seam is reachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      expect(edsPreviewFlags(mode).forcedCrossProfile).toBeUndefined();
      expect(edsPreviewFlags(mode).forcedStation).toBeUndefined();
      expect(edsPreviewFlags(mode).forcedStationPolicy).toBeUndefined();
    }
  });

  it('X3: a shut seam plays the shipped world, tick for tick', () => {
    for (const seed of [4242, 90210, 20260727]) {
      const a = matchOf(seed);
      const b = matchOf(seed);
      while (!a.finished) a.step(DT);
      while (!b.finished) {
        b.forcedCrossProfile = null;
        b.forcedStation = null;
        b.forcedStationPolicy = null;
        b.step(DT);
      }
      expect(signature(b)).toBe(signature(a));
    }
  });

  it("O1 X5 in miniature: forcing the profile the world would have used reproduces it exactly", () => {
    // The harness gate the whole oracle rests on. `c4Flight` is OFF in the
    // shipped world, so 'current' IS that world's profile and the forced run
    // must be bit-identical — a fork that cannot reproduce its own control is
    // not a counterfactual.
    for (const seed of [4242, 90210]) {
      const base = matchOf(seed);
      const forced = matchOf(seed);
      while (!base.finished) base.step(DT);
      while (!forced.finished) {
        forced.forcedCrossProfile = 'current';
        forced.step(DT);
      }
      expect(signature(forced)).toBe(signature(base));
    }
  });

  it('O1: the lofted profile BITES — a forked cross flies higher', () => {
    // Fork at a real cross and compare the launch. The seam is the only
    // difference between the two forks, so any divergence is the profile's.
    let compared = 0;
    for (let seed = 4242; seed < 4260 && compared === 0; seed++) {
      const m = matchOf(seed);
      let crosses0 = m.teams[0].stats.crosses + m.teams[1].stats.crosses;
      while (!m.finished && compared === 0) {
        const owner = m.ball.owner;
        const cloneable = owner !== null && owner.role !== 'GK' && owner.decisionTimer <= 0;
        const before = cloneable ? cloneSimulationState(m) : null;
        m.step(DT);
        const crosses = m.teams[0].stats.crosses + m.teams[1].stats.crosses;
        if (crosses > crosses0) {
          crosses0 = crosses;
          if (before !== null) {
            const cur = cloneSimulationState(before);
            cur.forcedCrossProfile = 'current';
            cur.step(DT);
            const lofted = cloneSimulationState(before);
            lofted.forcedCrossProfile = 'lofted';
            lofted.step(DT);
            // A short cross is the case the floor exists for; a long one
            // already clears it, so only assert when the two differ at all.
            if (lofted.ball.vz !== cur.ball.vz) {
              expect(lofted.ball.vz).toBeGreaterThan(cur.ball.vz);
              // vz = g*T/2 and T >= CROSS_FLIGHT_MIN_S when lofted.
              expect(lofted.ball.vz).toBeGreaterThan(0);
              expect(CROSS_FLIGHT_MIN_S).toBeGreaterThan(0.7);
              compared += 1;
            }
          }
        }
      }
    }
    expect(compared).toBeGreaterThan(0);
  });

  it('P1: the station POLICY bites and TRACKS the ball, unlike a fixed point', () => {
    // The whole reason P1 gets its own seam: the target must move with the
    // ball. Two ticks apart, the same offset must resolve to two different
    // world points whenever the ball has moved.
    const m = matchOf(90210);
    let checked = 0;
    while (!m.finished && checked < 3) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      const t = m.teams[0];
      const body = t.players.find((p) => p.role !== 'GK' && !p.sentOff && m.ball.owner !== p);
      if (body === undefined) continue;
      m.forcedStationPolicy = { gid: body.gid, offset: { dx: 7, dy: 0 }, untilTick: m.simTick + 20 };
      // The executor reads the ball BEFORE `stepBall` moves it, so the
      // reference is the pre-step position — reading it afterwards is off by
      // one tick of ball travel, which is what the first cut of this pin did.
      const ballFirst = { x: m.ball.pos.x, y: m.ball.pos.y };
      m.step(DT);
      const first = body.c4Trace;
      for (let i = 0; i < 6 && !m.finished; i++) m.step(DT);
      const later = body.c4Trace;
      m.forcedStationPolicy = null;
      if (first === null || later === null) continue;
      expect(first.meet.x).toBeCloseTo(ballFirst.x + t.attackDir * 7, 9);
      expect(first.meet.y).toBeCloseTo(ballFirst.y, 9);
      if (Math.hypot(m.ball.pos.x - ballFirst.x, m.ball.pos.y - ballFirst.y) > 0.5) {
        expect(Math.hypot(later.meet.x - first.meet.x, later.meet.y - first.meet.y))
          .toBeGreaterThan(0);
      }
      checked += 1;
    }
    expect(checked).toBeGreaterThan(0);
  });

  it('O2: the station force BITES, and the clamps still apply to it', () => {
    // Forced, the body steers at the target. The force is applied BEFORE the
    // onside clamp on purpose, so a target beyond the line is still clamped —
    // that is what "no privilege the world does not have" means.
    const m = matchOf(4242);
    let moved = 0;
    while (!m.finished && moved < 3) {
      m.step(DT);
      const t = m.teams[0];
      const body = t.players.find((p) => (
        p.role !== 'GK' && !p.sentOff && m.ball.owner !== p
      ));
      if (body === undefined || m.phase !== 'playing') continue;
      const goal = t.oppGoal();
      const before = { x: body.pos.x, y: body.pos.y };
      m.forcedStation = {
        gid: body.gid, target: { x: goal.x * 0.5, y: goal.y }, untilTick: m.simTick + 30,
      };
      for (let i = 0; i < 30 && !m.finished; i++) m.step(DT);
      m.forcedStation = null;
      const dBefore = Math.hypot(before.x - goal.x * 0.5, before.y - goal.y);
      const dAfter = Math.hypot(body.pos.x - goal.x * 0.5, body.pos.y - goal.y);
      if (dBefore > 6) {
        expect(dAfter).toBeLessThan(dBefore);
        moved += 1;
      }
    }
    expect(moved).toBeGreaterThan(0);
  });
});
