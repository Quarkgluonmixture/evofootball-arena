import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { kickMisalignment, orientationPowerMul, performPass } from '../src/sim/mechanics';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { norm, sub, v2 } from '../src/utils/vec';

/**
 * Phase 31.9 — 一脚出球 (user request): a PRESSURED intended receiver plays
 * the ball as it comes — the reception opens a first-touch window (decide
 * now) and a pass struck inside it carries an accuracy penalty priced by
 * technique. Unpressured receptions keep the 0.3s settle touch (one-touch
 * ping-pong was the original disease — the window must NOT be free).
 */

const attrs = (technique = 0.5): PlayerAttributes => {
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
function team(name: string, technique = 0.5): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutralGenome(),
    squad: Array.from({ length: TEAM_SIZE }, () => attrs(technique)),
  };
}

/**
 * A targeted 12 m/s ground pass arriving at team 0's MF in midfield, with a
 * marker breathing down his neck (2.2m — inside the 3.75m neutral trigger)
 * or standing off (8m) — and two open teammates ahead as layoff outlets.
 */
function pressuredReception(seed: number, pressured: boolean, technique = 0.5): Match {
  const m = new Match({ seed, teamA: team('A', technique), teamB: team('B'), duration: 120 });
  while (m.phase !== 'playing') m.step(DT);
  m.kickoffKickGid = null; // disarm the forced kickoff back-pass
  const receiver = m.teams[0].players[2];
  receiver.pos = v2(-2, 0);
  receiver.vel = v2(0, 0);
  const passer = m.teams[0].players[1];
  passer.pos = v2(-16, 5);
  // Layoff outlets in open forward lanes.
  m.teams[0].players[3].pos = v2(9, 9);
  m.teams[0].players[4].pos = v2(8, -10);
  m.teams[0].players[3].vel = v2(0, 0);
  m.teams[0].players[4].vel = v2(0, 0);
  m.teams[0].players[5].pos = v2(20, 0);
  // The marker: right behind the reception, or standing well off.
  const marker = m.teams[1].players[2];
  marker.pos = pressured ? v2(0.2, 0) : v2(6, 0);
  marker.vel = v2(0, 0);
  for (const p of m.teams[1].players) {
    if (p === marker || p.role === 'GK') continue;
    p.pos = v2(30, p.gid % 2 === 0 ? 20 : -20);
    p.vel = v2(0, 0);
  }
  m.ball.owner = null;
  m.ball.pos = v2(-5, 0); // 3m out, rolling straight at the receiver
  m.ball.vel = v2(12, 0);
  m.ball.z = 0;
  m.ball.vz = 0;
  m.possessionSide = 0;
  m.pendingPass = {
    side: 0, passerGid: passer.gid, targetGid: receiver.gid,
    t: m.simTime, offside: false, offsideSpot: null,
  };
  return m;
}

/** Step until the receiver controls the ball (or give up). */
function capture(m: Match): boolean {
  const receiver = m.teams[0].players[2];
  for (let i = 0; i < 40 && m.ball.owner !== receiver; i++) m.step(DT);
  return m.ball.owner === receiver;
}

describe('一脚出球 — the first-touch window (Phase 31.9)', () => {
  it('a pressured intended reception opens the window; an unpressured one settles', () => {
    let sawPressured = 0;
    let sawUnpressured = 0;
    let captures = 0;
    for (let seed = 0; seed < 30; seed++) {
      const p = pressuredReception(seed, true);
      if (capture(p)) {
        captures++;
        if (m0(p).firstTouchWindow > 0) sawPressured++;
        expect(m0(p).decisionTimer).toBeLessThanOrEqual(0.07 + 1e-9);
      }
      const u = pressuredReception(seed, false);
      if (capture(u)) {
        if (m0(u).firstTouchWindow > 0) sawUnpressured++;
        // The settle touch survives: no snap decision without pressure.
        expect(m0(u).decisionTimer).toBeGreaterThan(0.2);
      }
    }
    expect(captures).toBeGreaterThan(15); // the harness actually exercises the path
    expect(sawPressured).toBe(captures); // pressure ⇒ window, every time
    expect(sawUnpressured).toBe(0); // no pressure ⇒ never
    function m0(m: Match) {
      return m.teams[0].players[2];
    }
  });

  it('any kick consumes the window; holding the ball lets it expire ≤0.28s', () => {
    for (let seed = 0; seed < 20; seed++) {
      const m = pressuredReception(seed, true);
      if (!capture(m)) continue;
      const receiver = m.teams[0].players[2];
      expect(receiver.firstTouchWindow).toBeGreaterThan(0);
      // Run 0.4s: whatever the brain chose (pass, dribble, hold), the
      // window is gone — consumed by the kick or expired with the touch.
      for (let i = 0; i < 24; i++) m.step(DT);
      expect(receiver.firstTouchWindow).toBe(0);
    }
  });

  it('directional: the penalty is real and technique tames it (release-angle spread)', () => {
    // Measure the mechanic DIRECTLY: capture under pressure, then call
    // performPass ourselves (the brain's kind-of-pass choice — through
    // ball vs feet — aims at different points and buried the noise under
    // a ~23° structural spread when measured through full decisions; the
    // window/brain integration is tests 1–2's job). Rebuilding the exact
    // lead performPass aims at makes the measured signed error a pure
    // noise draw, so the per-arm std ratios are the multipliers themselves.
    const sprayStdRad = (technique: number, oneTouch: boolean): number => {
      const errs: number[] = [];
      for (let seed = 0; seed < 120; seed++) {
        const m = pressuredReception(seed, true, technique);
        if (!capture(m)) continue;
        const receiver = m.teams[0].players[2];
        if (!oneTouch) receiver.firstTouchWindow = 0; // white-box A/B: same scene, window off
        const mate = m.teams[0].players[3];
        // performPass's own aim, rebuilt exactly (helpers are exported).
        const toMate = norm(sub(mate.pos, receiver.pos));
        const misalign = kickMisalignment(receiver, toMate);
        const powerMul = orientationPowerMul(misalign, receiver.attrs.technique);
        const flight = Math.hypot(mate.pos.x - receiver.pos.x, mate.pos.y - receiver.pos.y) / (16 * powerMul);
        const lead = v2(mate.pos.x + mate.vel.x * flight * 0.8, mate.pos.y + mate.vel.y * flight * 0.8);
        const want = Math.atan2(lead.y - receiver.pos.y, lead.x - receiver.pos.x);
        performPass(m, receiver, mate);
        if (m.ball.owner === receiver) continue; // guard refused (cooldown)
        const got = Math.atan2(m.ball.vel.y, m.ball.vel.x);
        let err = got - want;
        if (err > Math.PI) err -= 2 * Math.PI;
        if (err < -Math.PI) err += 2 * Math.PI;
        errs.push(err);
      }
      expect(errs.length).toBeGreaterThan(40); // the harness genuinely releases passes
      const mean = errs.reduce((a, b) => a + b, 0) / errs.length;
      return Math.sqrt(errs.reduce((a, e) => a + (e - mean) * (e - mean), 0) / errs.length);
    };
    // The penalty exists: same feet, window on sprays more than window off
    // (oneTouchMul at tech .5 = ×1.6)...
    expect(sprayStdRad(0.5, true)).toBeGreaterThan(sprayStdRad(0.5, false) * 1.15);
    // ...and ability prices it: tech .1 vs .9 compounds to ≈×2.5 noise.
    expect(sprayStdRad(0.1, true)).toBeGreaterThan(sprayStdRad(0.9, true) * 1.3);
  });
});
