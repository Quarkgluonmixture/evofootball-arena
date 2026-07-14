import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { performDribbleTouch } from '../src/sim/mechanics';
import { Match } from '../src/sim/Match';
import { DT, TOUCH_CONTROL_DIST } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { v2 } from '../src/utils/vec';

/**
 * Phase 36 — 可见的触球. The carrier PUSHES the ball and chases it;
 * between touches it is a free body. Close control (an opponent within
 * TOUCH_CONTROL_DIST, walking pace, shielding, keepers, restart takers)
 * keeps the old glue — the duel economy lives there.
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

/** A live match with the striker on the ball in open field, driving. */
function openCarry(seed: number): Match {
  const m = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  m.kickoffKickGid = null;
  const st = m.teams[0].players[5];
  st.pos = v2(-10, 0);
  st.vel = v2(0, 0);
  for (const p of [...m.teams[0].players, ...m.teams[1].players]) {
    if (p === st) continue;
    p.pos = v2(p.side === 0 ? -35 : 38, p.gid % 2 === 0 ? 20 : -20);
    p.vel = v2(0, 0);
  }
  m.ball.owner = st;
  m.ball.pos = v2(st.pos.x, st.pos.y);
  m.ball.vel = v2(0, 0);
  m.possessionSide = 0;
  m.pendingPass = null;
  return m;
}

describe('discrete dribble touches (Phase 36)', () => {
  it('an open-field drive DETACHES the ball — the magnet is dead', () => {
    let sawDetachedCarry = 0;
    for (let seed = 0; seed < 10; seed++) {
      const m = openCarry(seed);
      const st = m.teams[0].players[5];
      for (let t = 0; t < 60 * 5 && !m.finished; t++) {
        m.step(DT);
        if (
          m.ball.owner === null &&
          m.dribbleTouch?.gid === st.gid &&
          Math.hypot(st.pos.x - m.ball.pos.x, st.pos.y - m.ball.pos.y) > 1.2
        ) {
          sawDetachedCarry++;
          break;
        }
      }
    }
    expect(sawDetachedCarry).toBeGreaterThan(7); // nearly every open drive shows daylight
  });

  it('close control: a marked carrier keeps the ball glued', () => {
    for (let seed = 0; seed < 6; seed++) {
      const m = openCarry(seed);
      const st = m.teams[0].players[5];
      // Park a marker breathing down his neck, inside the control gate.
      const marker = m.teams[1].players[1];
      marker.pos = v2(st.pos.x + 2, st.pos.y + 1);
      let pushed = false;
      for (let t = 0; t < 60 * 1.5 && !m.finished; t++) {
        marker.pos = v2(st.pos.x + 2, st.pos.y + 1); // stays on him
        marker.vel = v2(0, 0);
        m.step(DT);
        if (m.dribbleTouch?.gid === st.gid) pushed = true;
      }
      expect(pushed).toBe(false);
    }
  });

  it('the push is priced by the field: open grass rolls further than a wall', () => {
    const mOpen = openCarry(1);
    const stO = mOpen.teams[0].players[5];
    stO.vel = v2(5, 0);
    stO.heading = v2(1, 0);
    performDribbleTouch(mOpen, stO);
    const openSpeed = Math.hypot(mOpen.ball.vel.x, mOpen.ball.vel.y);

    const mWall = openCarry(1);
    const stW = mWall.teams[0].players[5];
    stW.vel = v2(5, 0);
    stW.heading = v2(1, 0);
    // Three bodies straight ahead at 5m — the touch shortens.
    mWall.teams[1].players[1].pos = v2(stW.pos.x + 5, stW.pos.y);
    mWall.teams[1].players[2].pos = v2(stW.pos.x + 5, stW.pos.y + 1);
    mWall.teams[1].players[3].pos = v2(stW.pos.x + 5, stW.pos.y - 1);
    performDribbleTouch(mWall, stW);
    const wallSpeed = Math.hypot(mWall.ball.vel.x, mWall.ball.vel.y);

    expect(mOpen.ball.owner).toBeNull();
    expect(openSpeed).toBeGreaterThan(wallSpeed);
  });

  it('a keeper ahead is not open grass: the same body shortens the touch more as the GK (Phase 46)', () => {
    // One body 10m ahead in the cone. As an outfielder it's a normal
    // squeeze; as the KEEPER his rush envelope prices the grass shorter —
    // any roll reaching him is dead (hands + the GK control ceiling), so
    // the substrate must stop the carrier knocking it into his arms.
    const mDf = openCarry(1);
    const stD = mDf.teams[0].players[5];
    stD.vel = v2(5, 0);
    stD.heading = v2(1, 0);
    mDf.teams[1].players[1].pos = v2(stD.pos.x + 10, stD.pos.y);
    performDribbleTouch(mDf, stD);
    const dfSpeed = Math.hypot(mDf.ball.vel.x, mDf.ball.vel.y);

    const mGk = openCarry(1);
    const stG = mGk.teams[0].players[5];
    stG.vel = v2(5, 0);
    stG.heading = v2(1, 0);
    mGk.teams[1].players[0].pos = v2(stG.pos.x + 10, stG.pos.y); // the GK
    performDribbleTouch(mGk, stG);
    const gkSpeed = Math.hypot(mGk.ball.vel.x, mGk.ball.vel.y);

    expect(gkSpeed).toBeLessThan(dfSpeed);
  });

  it('the poke: an opponent in the rolling ball\'s path wins it clean', () => {
    // Unit-level: fire the push directly (in play the control gate keeps
    // defenders this close from ever seeing a push — a staged full-flow
    // version showed the carrier correctly gluing and laying off instead).
    let pokes = 0;
    for (let seed = 0; seed < 8; seed++) {
      const m = openCarry(seed);
      const st = m.teams[0].players[5];
      st.vel = v2(5, 0);
      st.heading = v2(1, 0);
      performDribbleTouch(m, st);
      expect(m.ball.owner).toBeNull();
      const df = m.teams[1].players[1];
      df.pos = v2(st.pos.x + 2.6, st.pos.y); // in the lane, inside the roll
      df.vel = v2(0, 0);
      for (let t = 0; t < 60 && !m.finished; t++) {
        m.step(DT);
        if (m.ball.owner === df) {
          pokes++;
          break;
        }
        if (m.ball.owner !== null) break;
      }
    }
    expect(pokes).toBeGreaterThan(5); // the toucher's cooldown is the window
  });

  it('our loose ball is CONTESTED, designed balls are not (36.2)', () => {
    const m = openCarry(4);
    const st = m.teams[0].players[5];
    // A true 50/50: ball squirts loose, possession nominally still ours.
    m.ball.owner = null;
    m.ball.pos = v2(st.pos.x + 6, st.pos.y + 4);
    m.ball.vel = v2(0, 0);
    m.dribbleTouch = null;
    m.pendingPass = null;
    for (let t = 0; t < 30; t++) m.step(DT); // past a team-brain tick
    expect(m.teams[0].chasers.size).toBe(1);
    // A pass in flight to US belongs to its receiver — no extra chaser.
    const m2 = openCarry(4);
    const st2 = m2.teams[0].players[5];
    m2.ball.owner = null;
    m2.ball.pos = v2(st2.pos.x + 6, st2.pos.y + 4);
    m2.ball.vel = v2(2, 0);
    m2.pendingPass = {
      side: 0, passerGid: st2.gid, targetGid: m2.teams[0].players[2].gid,
      t: m2.simTime, offside: false, offsideSpot: null,
    };
    for (let t = 0; t < 30 && m2.pendingPass; t++) m2.step(DT);
    // (checked DURING the flight — the tick inside the loop is what matters)
    expect(m2.teams[0].chasers.size).toBeLessThanOrEqual(1);
  });

  it('keepers never push: the back-pass ball stays at the feet', () => {
    const m = openCarry(3);
    const gk = m.teams[0].goalkeeper;
    const st = m.teams[0].players[5];
    st.pos = v2(30, 20); // out of the way
    m.ball.owner = gk;
    m.ball.pos = v2(gk.pos.x, gk.pos.y);
    gk.vel = v2(4, 0);
    for (let t = 0; t < 30; t++) {
      m.step(DT);
      expect(m.dribbleTouch?.gid).not.toBe(gk.gid);
    }
  });
});
