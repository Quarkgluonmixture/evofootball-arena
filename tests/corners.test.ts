import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { cornerCrashSpots, cornerKeyZone } from '../src/ai/formations';
import { Match } from '../src/sim/Match';
import { DT, HALF_L, HALF_W } from '../src/sim/constants';
import { TEAM_SIZE, type CornerRoutine, type TeamInfo } from '../src/sim/types';
import { dist, v2 } from '../src/utils/vec';

/**
 * Phase 31 step 3 — corner ROUTINES. Each routine is a target-spot table
 * plus which crashers attack it; the taker's side picks one mid-setup from
 * zone openness, the kick waits for the crashers to arrive (the 30.3
 * keeper-waits pattern), and the delivery aims at the RUN, not at the
 * goal-side marker.
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

/**
 * Manufacture a live corner for team 0 at the +y flag, with both sides in
 * realistic attacking-phase positions (a corner arises from deep attacking
 * play — manufacturing one from kickoff spots leaves the crashers 50m away
 * and every measurement reads as "runners can't arrive").
 */
function corner(seed: number, routine?: CornerRoutine): Match {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 });
  while (m.phase !== 'playing') m.step(DT);
  const a = m.teams[0].players;
  a[1].pos = v2(16, -4); // DF up for the set piece
  a[2].pos = v2(24, 8);
  a[3].pos = v2(27, -14);
  a[5].pos = v2(32, 4);
  const d = m.teams[1].players;
  d[1].pos = v2(40, 3);
  d[2].pos = v2(38, -3);
  d[3].pos = v2(36, 8);
  d[4].pos = v2(39, -7);
  d[5].pos = v2(30, 0);
  for (const p of [...a, ...d]) p.vel = v2(0, 0);
  const taker = a[4];
  taker.pos = v2(HALF_L - 4, HALF_W - 4);
  m.ball.owner = null;
  m.phase = 'restart';
  m.restart = {
    kind: 'corner', side: 0, pos: v2(HALF_L - 0.3, HALF_W - 0.3), timer: 0,
    takerGid: taker.gid, routine,
  };
  return m;
}

describe('corner routine geometry', () => {
  it('key zones sit where the routine says: near post, far post, short, the arc', () => {
    expect(cornerKeyZone('nearPost', 1, 28).y).toBeGreaterThan(0);
    expect(cornerKeyZone('farPost', 1, 28).y).toBeLessThan(0);
    expect(Math.abs(cornerKeyZone('short', 1, 28).y)).toBeGreaterThan(HALF_W - 10);
    expect(cornerKeyZone('arcCutback', 1, 28).x).toBeLessThan(HALF_L - 12);
    // Mirrored flag mirrors the zones.
    expect(cornerKeyZone('nearPost', 1, -28).y).toBeLessThan(0);
    // Crash tables always provide the three spots.
    for (const r of ['nearPost', 'farPost', 'short', 'arcCutback', undefined] as const) {
      expect(cornerCrashSpots(r, 1, 28)).toHaveLength(3);
    }
  });
});

describe('routine choice', () => {
  it('is deterministic: the same seed always picks the same routine', () => {
    const routineOf = (seed: number): CornerRoutine | undefined => {
      const m = corner(seed);
      for (let i = 0; i < 90 && m.restart; i++) {
        m.step(DT);
        if (m.restart?.routine) return m.restart.routine;
      }
      return undefined;
    };
    for (const seed of [1, 7, 42]) {
      const a = routineOf(seed);
      expect(a).toBeDefined();
      expect(routineOf(seed)).toBe(a);
    }
  });
});

describe('the corner waits for its crashers (30.3 pattern)', () => {
  it('with the taker set but the runners still arriving, the kick holds past min setup', () => {
    const m = corner(9, 'farPost');
    // Put the taker on the spot immediately but drag the would-be crashers
    // DEEP — the WAIT is for them, not the taker.
    m.allPlayers[m.restart!.takerGid].pos = v2(HALF_L - 0.6, HALF_W - 0.6);
    const a = m.teams[0].players;
    for (const p of [a[1], a[2], a[3], a[5]]) p.pos = v2(-20, p.pos.y);
    for (let i = 0; i < Math.round(2.6 * 60); i++) {
      m.step(DT);
      if (!m.restart) break;
    }
    // At 2.6s (min setup is 2.0) the corner must STILL be waiting.
    expect(m.restart).not.toBeNull();
    // ...but the failsafe takes it before the restart timeout expires.
    for (let i = 0; i < Math.round(4 * 60) && m.restart; i++) m.step(DT);
    expect(m.restart).toBeNull();
  });
});

describe('routine plumbing', () => {
  it('an arcCutback corner produces cutback attempts (the arc strike is the plan)', () => {
    let cutbacks = 0;
    for (let seed = 0; seed < 30; seed++) {
      const m = corner(seed, 'arcCutback');
      for (let i = 0; i < 60 * 8 && !m.finished; i++) {
        m.step(DT);
        if (m.teams[0].stats.cutbacks > 0) break;
      }
      cutbacks += m.teams[0].stats.cutbacks;
    }
    expect(cutbacks).toBeGreaterThan(5);
  });

  it('a short corner keeps the ball on the ground: the taker does not whip the cross', () => {
    let crossed = 0;
    let taken = 0;
    for (let seed = 0; seed < 30; seed++) {
      const m = corner(seed, 'short');
      const crosses0 = m.teams[0].stats.crosses;
      for (let i = 0; i < 60 * 8 && !m.finished; i++) {
        m.step(DT);
        if (m.restart === null && m.pendingPass) break; // first delivery away
      }
      taken++;
      if (m.teams[0].stats.crosses > crosses0) crossed++;
    }
    // The routine suppresses the whip — most short corners play the pass.
    expect(crossed / taken).toBeLessThan(0.4);
  });

  it('post routines route the crashers to the routine spots during the setup', () => {
    const m = corner(21, 'farPost');
    // Let the setup develop (licenses assigned, runs underway) — long
    // enough for arrivals from deep starting spots.
    for (let i = 0; i < Math.round(5.2 * 60) && m.restart; i++) m.step(DT);
    if (m.restart) {
      const spots = cornerCrashSpots('farPost', 1, m.restart.pos.y);
      const ranked = [...m.teams[0].runners].sort((a, b) => a - b);
      expect(ranked.length).toBeGreaterThan(0);
      let near = 0;
      for (const idx of ranked) {
        const p = m.teams[0].players[idx];
        if (dist(p.pos, spots[ranked.indexOf(idx) % 3]) < 8) near++;
      }
      expect(near).toBeGreaterThanOrEqual(2); // that's what the kick waited for
    }
  });
});
