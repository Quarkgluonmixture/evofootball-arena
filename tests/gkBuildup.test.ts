import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { BOX_DEPTH, DT, HALF_L } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 32.2 — the ball-playing keeper. The back-pass law: a DELIBERATE
 * teammate ball may not be picked up — the keeper plays it at his FEET
 * (pressable, no hold, no box clearance). The same genes (passBias +
 * riskTolerance) price both sides of the identity: teammates using him as
 * the press-escape outlet, and his own feet-vs-hoof choice.
 */

const attrs = (): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return p;
};
const genome = (over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return { ...g, ...over };
};
const team = (name: string, g: TacticalGenome = genome()): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome: g,
  squad: Array.from({ length: TEAM_SIZE }, () => attrs()),
});

/** A deliberate teammate ball rolling at team 0's keeper (or a loose one). */
function ballAtKeeper(seed: number, deliberate: boolean): Match {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  m.kickoffKickGid = null;
  const gk = m.teams[0].goalkeeper;
  const passer = m.teams[0].players[1];
  passer.pos = v2(-25, 5);
  for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
    if (p === gk || p === passer || p.role === 'GK') continue;
    p.pos = v2(20, p.gid % 2 === 0 ? 18 : -18);
    p.vel = v2(0, 0);
  }
  m.ball.owner = null;
  m.ball.pos = v2(gk.pos.x + 4, gk.pos.y);
  m.ball.vel = v2(-8, 0); // rolling at the keeper
  m.ball.z = 0;
  m.ball.vz = 0;
  m.possessionSide = 0;
  m.pendingPass = deliberate
    ? { side: 0, passerGid: passer.gid, targetGid: gk.gid, t: m.simTime, offside: false, offsideSpot: null }
    : null;
  return m;
}

const breathe = (i: number): Promise<void> | undefined =>
  i % 25 === 0 ? new Promise((r) => setImmediate(r)) : undefined;

describe('the ball-playing keeper (Phase 32.2)', () => {
  it('back-pass law: a teammate ball goes to FEET, a loose ball to HANDS', () => {
    let feet = 0;
    let hands = 0;
    for (let seed = 0; seed < 20; seed++) {
      const back = ballAtKeeper(seed, true);
      const gk = back.teams[0].goalkeeper;
      for (let t = 0; t < 90 && back.ball.owner !== gk; t++) back.step(DT);
      if (back.ball.owner === gk) {
        if (gk.gkHoldTimer <= 0 && !gk.gkDistributing) feet++;
      }
      const loose = ballAtKeeper(seed, false);
      const gk2 = loose.teams[0].goalkeeper;
      for (let t = 0; t < 90 && loose.ball.owner !== gk2; t++) loose.step(DT);
      if (loose.ball.owner === gk2) {
        if (gk2.gkHoldTimer > 0 || gk2.gkDistributing) hands++;
      }
    }
    expect(feet).toBeGreaterThan(14); // the deliberate ball stays at the feet
    expect(hands).toBeGreaterThan(14); // the loose ball is scooped up
  });

  it('hands only inside the box (28.5): a sweeper who collects OUTSIDE his area plays it at his FEET', () => {
    // team 0 defends the left; its box is x ≤ -(HALF_L - BOX_DEPTH) = -32.
    const capture = (gkX: number): { got: boolean; hands: boolean; inBox: boolean } => {
      const m = new Match({ seed: 7, teamA: team('A'), teamB: team('B'), duration: 120 });
      while (m.phase !== 'playing') m.step(DT);
      m.kickoffKickGid = null;
      const gk = m.teams[0].goalkeeper;
      // Park everyone else far up-field so only the keeper can reach the ball.
      for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
        if (p === gk) continue;
        p.pos = v2(20, p.gid % 2 === 0 ? 22 : -22);
        p.vel = v2(0, 0);
      }
      gk.pos = v2(gkX, 0);
      gk.vel = v2(0, 0);
      m.ball.owner = null;
      m.ball.pos = v2(gkX + 0.6, 0); // a loose ball at his feet, captured next step
      m.ball.vel = v2(0, 0);
      m.ball.z = 0;
      m.ball.vz = 0;
      m.possessionSide = 0;
      m.pendingPass = null; // loose, NOT a deliberate back-pass
      for (let t = 0; t < 40 && m.ball.owner !== gk; t++) m.step(DT);
      return {
        got: m.ball.owner === gk,
        hands: gk.gkHoldTimer > 0 || gk.gkDistributing,
        inBox: m.inPenaltyBox(gk.pos, 0),
      };
    };
    const outside = capture(-(HALF_L - BOX_DEPTH) + 4); // ~4m beyond the box edge
    expect(outside.got).toBe(true);
    expect(outside.inBox).toBe(false);
    expect(outside.hands).toBe(false); // the fix: feet, not hands, off his line
    const inside = capture(-HALF_L + 6); // deep in his own box
    expect(inside.got).toBe(true);
    expect(inside.inBox).toBe(true);
    expect(inside.hands).toBe(true); // scooped up and held — legal, unchanged
  });

  it('the keeper at his feet RELEASES: no carrying the ball out of the box', () => {
    for (let seed = 0; seed < 20; seed++) {
      const m = ballAtKeeper(seed, true);
      const gk = m.teams[0].goalkeeper;
      for (let t = 0; t < 90 && m.ball.owner !== gk; t++) m.step(DT);
      if (m.ball.owner !== gk) continue;
      let held = 0;
      while (m.ball.owner === gk && held < 60 * 2 && !m.finished) {
        m.step(DT);
        held++;
        // Never strolls out: within the box + a small margin while on the ball.
        expect(m.teams[0].localX(gk.pos.x)).toBeLessThan(-(HALF_L - BOX_DEPTH) + 4);
      }
      expect(held).toBeLessThan(60 * 1.5); // moved it inside ~1.5s
    }
  });

  // n 40 → 80 (34.3) → 160 (28.5): the escape carry + combo outlets, and now
  // the sweeper's out-of-box feet clearances, add variance to this count. The
  // true ratio is a stable ~1.30 at n=160 (measured identical either side of
  // the 28.5 hands-in-box change); at n=80 a single sample swung to 1.18.
  // §10.5: scale the test, don't weaken the lever or the bar.
  // IN-BOX only (28.5): the sweeper-keeper now takes loose balls OUTSIDE his
  // box at his feet too (the hands-in-box law), but that clearance is a
  // style-independent behavior — counting it diluted the build-up signal
  // this test exists to measure, so gate the count to the box.
  it('directional: ball-playing sides route more build-up through their keeper', { timeout: 240000 }, async () => {
    const feetReceptions = async (g: TacticalGenome): Promise<number> => {
      let feet = 0;
      for (let seed = 0; seed < 160; seed++) {
        await breathe(seed);
        const m = new Match({ seed, teamA: team('A', g), teamB: team('B'), duration: 240 });
        const gk = m.teams[0].goalkeeper;
        let prev = m.ball.owner;
        while (!m.finished) {
          m.step(DT);
          const o = m.ball.owner;
          if (
            o === gk && prev !== gk && gk.gkHoldTimer <= 0 && !gk.gkDistributing &&
            m.inPenaltyBox(gk.pos, 0)
          ) feet++;
          prev = o;
        }
      }
      return feet;
    };
    const ballPlay = await feetReceptions(genome({ passBias: 0.9, riskTolerance: 0.9 }));
    const hoofer = await feetReceptions(genome({ passBias: 0.1, riskTolerance: 0.1 }));
    expect(ballPlay).toBeGreaterThan(hoofer * 1.25);
  });
});
