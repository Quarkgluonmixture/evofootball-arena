import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { ballLanding } from '../src/ai/perception';
import { performFreeKick, performShot } from '../src/sim/mechanics';
import { Match } from '../src/sim/Match';
import { DT, GRAVITY, HALF_L } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 37 — the curved ball (Magnus). Spin rotates the free ball's
 * velocity at a constant rate (a circular arc): kicks that curl launch
 * pre-compensated by −spin·T/2 so the chord still crosses at the aim
 * point, and both projectors (ballLanding, interceptBall) read the same
 * closed form — designed deliveries land where they were designed to.
 */

const attrs = (over: Partial<PlayerAttributes> = {}): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return { ...p, ...over };
};
const genome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const team = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: genome(),
  squad: Array.from({ length: TEAM_SIZE }, () => attrs()),
});

/** A quiet live match with everyone parked out of the way. */
function staged(seed: number): Match {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  m.kickoffKickGid = null;
  for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
    p.pos = v2(p.side === 0 ? -38 : 38, p.gid % 2 === 0 ? 22 : -22);
    p.vel = v2(0, 0);
  }
  m.pendingPass = null;
  return m;
}

/** Launch a free ball by hand and step to the FIRST touchdown (a landing
 * bounces — waiting for the ball to stop measures the bounces, not the
 * flight). Ground balls run until they slow. */
function fly(m: Match, vel: { x: number; y: number }, spin: number, vz = 0): { x: number; y: number } {
  m.ball.owner = null;
  m.ball.pos = v2(-20, 0);
  m.ball.vel = v2(vel.x, vel.y);
  m.ball.z = 0.01;
  m.ball.vz = vz;
  m.ball.spin = spin;
  for (let t = 0; t < 240; t++) {
    m.step(DT);
    if (m.ball.owner !== null || m.finished) break;
    if (vz > 0 && m.ball.z < 0.12 && m.ball.vz < 0) break; // about to touch down
    if (vz > 0 && m.ball.z <= 0) break; // touched down inside this step
    if (vz === 0 && Math.hypot(m.ball.vel.x, m.ball.vel.y) < 2) break;
  }
  return { x: m.ball.pos.x, y: m.ball.pos.y };
}

describe('the curved ball (Phase 37)', () => {
  it('spin bends the flight; zero spin flies dead straight', () => {
    const bent = fly(staged(1), { x: 14, y: 0 }, 0.6, 6);
    expect(Math.abs(bent.y)).toBeGreaterThan(0.8); // a real visible bow
    const straight = fly(staged(1), { x: 14, y: 0 }, 0, 6);
    expect(straight.y).toBe(0); // the straight game is EXACTLY untouched
  });

  it('ballLanding projects the arc: prediction meets the actual descent', () => {
    const m = staged(2);
    m.ball.owner = null;
    m.ball.pos = v2(-15, 5);
    m.ball.vel = v2(12, 3);
    m.ball.z = 0.01;
    m.ball.vz = 7;
    m.ball.spin = 0.5;
    const predicted = ballLanding(m.ball);
    let landed: { x: number; y: number } | null = null;
    for (let t = 0; t < 240; t++) {
      m.step(DT);
      if (m.ball.owner !== null) break;
      if ((m.ball.z < 0.12 && m.ball.vz < 0) || m.ball.z <= 0) {
        landed = { x: m.ball.pos.x, y: m.ball.pos.y };
        break;
      }
    }
    expect(landed).not.toBeNull();
    // Spin decays in flight (the projection assumes the launch rate), so
    // the arc form is near-exact, not exact — well inside a body's reach.
    expect(Math.hypot(landed!.x - predicted.x, landed!.y - predicted.y)).toBeLessThan(0.8);
  });

  it('pre-compensation: the curled launch lands where the straight aim did', () => {
    const T = 2 * 7 / GRAVITY; // flight of a vz=7 kick from the ground
    const spin = 0.55;
    const straight = fly(staged(3), { x: 13, y: 0 }, 0, 7);
    // Launch rotated by −spin·T/2, spinning at `spin` — the kick funnel's math.
    const half = -spin * T * 0.5;
    const c = Math.cos(half);
    const s = Math.sin(half);
    const curled = fly(staged(3), { x: 13 * c, y: 13 * s }, spin, 7);
    expect(Math.hypot(curled.x - straight.x, curled.y - straight.y)).toBeLessThan(1.0);
  });

  it('the free kick carries real curl toward the corner', () => {
    const m = staged(4);
    const taker = m.teams[0].players[2];
    taker.pos = v2(HALF_L - 22, 6);
    m.ball.owner = taker;
    m.ball.pos = v2(taker.pos.x, taker.pos.y);
    m.possessionSide = 0;
    performFreeKick(m, taker);
    expect(m.ball.owner).toBeNull();
    expect(Math.abs(m.ball.spin)).toBeGreaterThan(0.3);
  });

  it('shot curl is the technician\'s tool: technique prices the bend', () => {
    const shot = (tech: number): number => {
      const m = staged(5);
      const st = m.teams[0].players[5];
      (st.attrs as { dribbling: number }).dribbling = tech;
      st.pos = v2(HALF_L - 14, 2);
      st.heading = v2(1, 0);
      m.ball.owner = st;
      m.ball.pos = v2(st.pos.x, st.pos.y);
      m.possessionSide = 0;
      performShot(m, st);
      return Math.abs(m.ball.spin);
    };
    const crafted = shot(0.95);
    const blunt = shot(0.05);
    expect(crafted).toBeGreaterThan(blunt);
    expect(crafted).toBeGreaterThan(0.25);
  });
});
