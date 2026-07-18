import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DT, GOAL_HEIGHT, GOAL_WIDTH, HALF_L } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

/**
 * Phase 100 — WOODWORK: the outer band of the frame clangs the ball back
 * into play; the inner band stays a goal exactly as before. Deterministic
 * (no rng draws), so the trajectories here are exact.
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
const team = (name: string): TeamInfo => ({
  id: name, name, short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: neutralGenome(),
  squad: Array.from({ length: TEAM_SIZE }, attrs),
});

/** A match mid-play with everyone parked far from the flight path. */
function openMatch(): Match {
  const m = new Match({ seed: 5, teamA: team('A'), teamB: team('B'), duration: 600 });
  for (let i = 0; i < 300; i++) m.step(DT); // past kickoff into open play
  for (const p of m.allPlayers) {
    p.pos = { x: -40, y: p.gid * 2 - 12 };
    p.vel = { x: 0, y: 0 };
  }
  if (m.ball.owner) m.ball.owner = null;
  return m;
}

function fireAt(m: Match, y: number, z: number, vz = 0): void {
  m.ball.pos = { x: HALF_L - 0.4, y };
  m.ball.vel = { x: 24, y: 0 };
  m.ball.z = z;
  m.ball.vz = vz;
  m.ball.spin = 0;
  // Fixed steps: an airborne ball at 24 m/s lands EXACTLY on x=45.0 after
  // one step (no air friction, 0.4 = 24·DT) and only crosses on the next —
  // a position-conditioned loop quits on the line and never sees the hit.
  for (let i = 0; i < 3 && m.phase === 'playing'; i++) m.step(DT);
}

describe('woodwork (Phase 100)', () => {
  it('the outer post band clangs back into play', () => {
    const m = openMatch();
    const score0 = m.score[0];
    fireAt(m, GOAL_WIDTH / 2 + 0.08, 0.6);
    expect(m.events.some((e) => e.type === 'woodwork' && e.text.includes('post'))).toBe(true);
    expect(Math.abs(m.ball.pos.x)).toBeLessThan(HALF_L); // back in play
    expect(m.ball.vel.x).toBeLessThan(0); // reflected
    expect(m.score[0]).toBe(score0); // no goal
    expect(m.phase).toBe('playing'); // no restart awarded
  });

  it('the bar band clangs and the ball comes down', () => {
    const m = openMatch();
    fireAt(m, 0, GOAL_HEIGHT + 0.08, 1.5);
    expect(m.events.some((e) => e.type === 'woodwork' && e.text.includes('CROSSBAR'))).toBe(true);
    expect(Math.abs(m.ball.pos.x)).toBeLessThan(HALF_L);
    expect(m.ball.vz).toBeLessThanOrEqual(0); // knocked DOWN off the bar
  });

  it('the inner frame edge is still a goal — the goal rate is untouched', () => {
    const m = openMatch();
    const score0 = m.score[0];
    fireAt(m, GOAL_WIDTH / 2 - 0.12, 0.6);
    expect(m.score[0]).toBe(score0 + 1);
    expect(m.events.some((e) => e.type === 'woodwork')).toBe(false);
  });

  it('a ball trickling out near the post is NOT woodwork', () => {
    const m = openMatch();
    m.ball.pos = { x: HALF_L - 0.4, y: GOAL_WIDTH / 2 + 0.08 };
    m.ball.vel = { x: 1.2, y: 0 }; // rolling, not driven
    m.ball.z = 0;
    m.ball.vz = 0;
    m.ball.spin = 0;
    for (let i = 0; i < 120 && m.phase === 'playing'; i++) m.step(DT);
    expect(m.events.some((e) => e.type === 'woodwork')).toBe(false);
  });
});
