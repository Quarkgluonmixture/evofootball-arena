import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 31.7 — the cushioned trap (user report "长球停不住"): the pass's
 * INTENDED receiver may take down a driven delivery (up to 22 m/s) that a
 * bystander can't touch (CONTROL_MAX_SPEED 14). attemptFirstTouch prices
 * the attempt, so hot balls still get away sometimes.
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

/** A 19 m/s ground ball arriving at team 0's WGR, everyone else far away. */
function drivenBall(seed: number, targeted: boolean): Match {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  const receiver = m.teams[0].players[4];
  receiver.pos = v2(20, 18);
  receiver.vel = v2(0, 0);
  const passer = m.teams[0].players[2];
  passer.pos = v2(-15, -10);
  for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
    if (p === receiver || p === passer) continue;
    p.pos = v2(-35, p.gid % 2 === 0 ? 24 : -24);
    p.vel = v2(0, 0);
  }
  m.ball.owner = null;
  m.ball.pos = v2(17, 18); // 3m out, flying straight at the receiver
  m.ball.vel = v2(19, 0);
  m.ball.z = 0;
  m.ball.vz = 0;
  m.possessionSide = 0;
  m.pendingPass = targeted
    ? {
        side: 0, passerGid: passer.gid, targetGid: receiver.gid,
        t: m.simTime, offside: false, offsideSpot: null,
      }
    : null;
  return m;
}

describe('the cushioned trap (Phase 31.7)', () => {
  it('the intended receiver takes down a 19 m/s delivery a fair share of the time', () => {
    let trapped = 0;
    for (let seed = 0; seed < 100; seed++) {
      const m = drivenBall(seed, true);
      const receiver = m.teams[0].players[4];
      for (let i = 0; i < 30 && !m.ball.owner; i++) m.step(DT);
      if (m.ball.owner === receiver) trapped++;
    }
    expect(trapped).toBeGreaterThan(40); // priced by attemptFirstTouch, not free
    expect(trapped).toBeLessThan(100); // hot balls still get away sometimes
  });

  it('a bystander (no pass aimed at them) cannot control the same ball', () => {
    for (let seed = 0; seed < 40; seed++) {
      const m = drivenBall(seed, false);
      const receiver = m.teams[0].players[4];
      for (let i = 0; i < 20; i++) {
        m.step(DT);
        expect(m.ball.owner).not.toBe(receiver);
        const speed = Math.hypot(m.ball.vel.x, m.ball.vel.y);
        if (speed < 15) break; // friction has braked it below the old ceiling
      }
    }
  });
});
