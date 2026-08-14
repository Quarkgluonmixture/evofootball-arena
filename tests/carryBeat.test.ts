import { describe, expect, it } from 'vitest';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import {
  CB_TACKLE_RADIUS, beatsDefender, commitmentFactor, duelHorizon, overcommitSpeed,
  recoveryInterval, touchPastPush, touchRaceWindow, type CbBody,
} from '../src/sim/carryBeat';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags } from '../src/game/a4World';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * CB-T0 (docs/world-model/CB-T0-DORMANT-LAYER1-SEAM.md; contract
 * docs/world-model/CB-CARRY-BEAT-CONTRACT.md §2 M-CB.1; rulings #265.3 / #266.5) — the DORMANT
 * LAYER-1 SEAM. The pins:
 *   • ⭐⭐ THE PRIMITIVE — reachability slack over the body's OWN duel horizon, with the braking
 *     identity `½·a·T² = R` exact and `v* = sqrt(2aR)` its own inverse.
 *   • ⭐⭐ GEOMETRY DOES REAL WORK — χ is not a function of distance (same distance, different
 *     velocity, different answer); an arrival at v* through the ball has χ = 0.
 *   • ⭐⭐ THE RECOVERY INTERVAL IS DERIVED — brake + turn + close, strictly increasing in each,
 *     never the incumbent constants.
 *   • ⭐⭐ THE TOUCH-PAST IS GEOMETRY — deterministic, direction-dependent, and the ball really
 *     leaves the feet (ownership released into the engine's own loose-ball race).
 *   • ⭐⭐ TWO DOORS, BOTH DORMANT — flags off ⇒ the incumbent world; the touch door armed with
 *     no seam is inert; the ledger is all-zero in production.
 * Road B: both flags hard-false (the 2-season fingerprint pin is deliberately NOT duplicated
 * here — G-IDENT / X-FP-PROD recompute it in the probe).
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
const SEED_A = 12_472_900;
const SEED_B = 12_472_901;
const SEED_C = 12_472_902;

interface Arm {
  commit?: 'absent' | boolean;
  touch?: 'absent' | boolean;
  armedSubstrate?: boolean;
}
const matchOf = (seed: number, a: Arm = {}): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  ...(a.armedSubstrate === true ? a4MatchFlags(3) : {}),
  ...(a.commit === undefined || a.commit === 'absent' ? {} : { cbCommitPhysics: a.commit }),
  ...(a.touch === undefined || a.touch === 'absent' ? {} : { cbTouchPast: a.touch }),
});
const signature = (m: Match): string => JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, stamina: p.stamina })),
});
const walk = (seed: number, a: Arm = {}): string => {
  const m = matchOf(seed, a);
  while (!m.finished) m.step(DT);
  return signature(m);
};
/** a body's own acceleration, the engine's own expression (`Player.accel`). */
const ACCEL_BASE = 14;
const body = (px: number, py: number, vx: number, vy: number, accel = ACCEL_BASE): CbBody =>
  ({ pos: { x: px, y: py }, vel: { x: vx, y: vy }, accel });

describe('CB-T0 — the primitive and its identities', () => {
  it('the braking identity is EXACT: ½·a·T² = R over a family of accelerations', () => {
    for (const a of [12.6, 14, 15.2, 16.8]) {
      const t = duelHorizon(a);
      expect((a * t * t) / 2).toBeCloseTo(CB_TACKLE_RADIUS, 12);
      expect((overcommitSpeed(a) ** 2) / (2 * a)).toBeCloseTo(CB_TACKLE_RADIUS, 12);
      expect(overcommitSpeed(a) / a).toBeCloseTo(t, 12);
    }
  });

  it('the challenge radius equals the literal the engine selects on', () => {
    expect(CB_TACKLE_RADIUS).toBe(1.15);
  });

  it('χ is 1 when the projected ball and the projected body coincide', () => {
    // Same position, same velocity: the gap is zero at every t, so the whole disc is spare.
    expect(commitmentFactor(body(0, 0, 3, 0), { x: 0, y: 0 }, { x: 3, y: 0 })).toBe(1);
  });

  it('⭐⭐ OVERCOMMITMENT IS PUNISHED: at a fixed miss-line, χ FALLS with arrival speed to 0', () => {
    const a = ACCEL_BASE;
    // The carrier drives ACROSS him at 4 m/s; the taker charges in on a line that does not pass
    // through the ball's future. The faster he arrives, the less of his own disc is left to
    // cancel his momentum with — and past some speed his body simply cannot get there.
    const chiAt = (v: number, accel = a): number => commitmentFactor(
      body(1.2, 1, -v, 0, accel), { x: 0, y: 0 }, { x: 0, y: 4 },
    );
    const grid = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const chi = grid.map((v) => chiAt(v));
    let argmax = 0;
    for (let i = 1; i < chi.length; i++) if (chi[i] > chi[argmax]) argmax = i;
    // there IS a right pace to arrive at — an interior optimum, not "as fast as possible"
    expect(argmax).toBeGreaterThan(0);
    expect(argmax).toBeLessThan(chi.length - 1);
    expect(chi[argmax]).toBeGreaterThan(0);
    // and past it, every extra metre per second is a cost, down to a lost challenge
    for (let i = argmax + 1; i < chi.length; i++) expect(chi[i]).toBeLessThanOrEqual(chi[i - 1]);
    expect(chi[chi.length - 1]).toBe(0); // the dive is lost before the roll is even drawn
    // the speed at which it dies is the BODY's own: a quicker body carries further
    expect(chiAt(6, 16.8)).toBeGreaterThan(chiAt(6, 12.6));
  });

  it('⭐⭐ ANTI-COLLAPSE: same distance, different velocity ⇒ different χ (not a distance test)', () => {
    const ball = { x: 0, y: 0 };
    const ballVel = { x: 4, y: 0 };
    const planted = commitmentFactor(body(-1, 0, 0, 0), ball, ballVel);
    const chasing = commitmentFactor(body(-1, 0, 4, 0), ball, ballVel);
    const overrun = commitmentFactor(body(-1, 0, 9, 0), ball, ballVel);
    expect(chasing).not.toBe(planted);
    expect(overrun).not.toBe(chasing);
    // and the ordering is the football one: matching the carrier's pace beats being left behind
    expect(chasing).toBeGreaterThan(planted);
  });

  it('χ never leaves [0, 1]', () => {
    const rng = new Rng(12_472_903);
    for (let i = 0; i < 400; i++) {
      const chi = commitmentFactor(
        body(rng.range(-3, 3), rng.range(-3, 3), rng.range(-9, 9), rng.range(-9, 9)),
        { x: rng.range(-3, 3), y: rng.range(-3, 3) },
        { x: rng.range(-9, 9), y: rng.range(-9, 9) },
      );
      expect(chi).toBeGreaterThanOrEqual(0);
      expect(chi).toBeLessThanOrEqual(1);
    }
  });
});

describe('CB-T0 — the physics-derived recovery interval', () => {
  const ball = { x: 1, y: 0 };
  const facing = { x: 1, y: 0 };

  it('brake is |v|/a and the total is the sum of the three legs', () => {
    const r = recoveryInterval(body(0, 0, 6, 0), ball, facing);
    expect(r.brake).toBeCloseTo(6 / ACCEL_BASE, 12);
    expect(r.close).toBeCloseTo(Math.sqrt(2 / ACCEL_BASE), 12);
    expect(r.total).toBeCloseTo(r.brake + r.turn + r.close, 12);
  });

  it('⭐ it is STRICTLY INCREASING in arrival speed at fixed geometry', () => {
    let prev = -1;
    for (const v of [0, 1, 2, 4, 6, 8]) {
      const r = recoveryInterval(body(0, 0, v, 0), ball, facing);
      expect(r.total).toBeGreaterThan(prev);
      prev = r.total;
    }
  });

  it('⭐ it is STRICTLY INCREASING in the turn he must make', () => {
    let prev = -1;
    for (const ang of [0, 0.5, 1.2, 2.0, Math.PI]) {
      // same speed, pointing progressively further from the ball
      const r = recoveryInterval(body(0, 0, 5 * Math.cos(ang), 5 * Math.sin(ang)), ball, facing);
      expect(r.total).toBeGreaterThan(prev);
      expect(r.turnAngle).toBeCloseTo(ang, 6);
      prev = r.total;
    }
  });

  it('⭐ it is STRICTLY INCREASING in the gap the miss left', () => {
    let prev = -1;
    for (const d of [0.2, 0.6, 1.0, 1.15, 2.0]) {
      const r = recoveryInterval(body(0, 0, 3, 0), { x: d, y: 0 }, facing);
      expect(r.total).toBeGreaterThan(prev);
      prev = r.total;
    }
  });

  it('a faster body pays a longer CARRY-THROUGH (the stun IS his braking time)', () => {
    expect(recoveryInterval(body(0, 0, 7, 0), ball, facing).brake)
      .toBeGreaterThan(recoveryInterval(body(0, 0, 1, 0), ball, facing).brake);
  });

  it('the degenerate body (stopped, on the ball) pays exactly zero — no invented floor', () => {
    const r = recoveryInterval(body(0, 0, 0, 0), { x: 0, y: 0 }, facing);
    expect(r.total).toBe(0);
  });
});

describe('CB-T0 — the touch-past is geometry, never a roll', () => {
  const push = touchPastPush(10, 0.5);

  it('the push law is the engine\'s own: more open field ⇒ a longer knock, technique tightens it', () => {
    expect(touchPastPush(12, 0.5)).toBeGreaterThan(touchPastPush(3, 0.5));
    expect(touchPastPush(10, 0.9)).toBeLessThan(touchPastPush(10, 0.1));
    expect(touchRaceWindow(push)).toBeGreaterThan(0);
  });

  it('⭐⭐ it is DETERMINISTIC — identical inputs, identical answer, every time', () => {
    const d = body(2, 0, 0, 0);
    const first = beatsDefender({ x: 0, y: 0 }, { x: -1, y: 0 }, 4, push, d);
    for (let i = 0; i < 50; i++) {
      expect(beatsDefender({ x: 0, y: 0 }, { x: -1, y: 0 }, 4, push, d)).toBe(first);
    }
  });

  it('⭐⭐ it is DIRECTION-DEPENDENT — one direction beats him, another does not', () => {
    const defender = body(2.4, 0, 0, 0);
    const away = beatsDefender({ x: 0, y: 0 }, { x: -1, y: 0 }, 5, push, defender);
    const at = beatsDefender({ x: 0, y: 0 }, { x: 1, y: 0 }, 5, push, defender);
    expect(away).toBe(true);
    expect(at).toBe(false);
  });

  it('a defender standing ON the ball is never beaten', () => {
    for (const ang of [0, 1, 2, 3, 4, 5]) {
      expect(beatsDefender(
        { x: 0, y: 0 }, { x: Math.cos(ang), y: Math.sin(ang) }, 6, push, body(0, 0, 0, 0),
      )).toBe(false);
    }
  });

  it('a defender\'s own MOMENTUM decides too: running the wrong way loses the ball', () => {
    const ballPos = { x: 0, y: 0 };
    const dir = { x: 1, y: 0 }; // knocked straight past him
    const set = body(2.4, 0, 0, 0);
    const committed = body(2.4, 0, 0, 9); // same spot, but sprinting across the knock's line
    expect(beatsDefender(ballPos, dir, 5, push, set)).toBe(false);
    expect(beatsDefender(ballPos, dir, 5, push, committed)).toBe(true);
  });
});

describe('CB-T0 — the doors are dormant (Road B)', () => {
  it('both flags default to false on a fresh Match, in both world shapes', () => {
    for (const armedSubstrate of [false, true]) {
      const m = matchOf(12_472_999, { armedSubstrate });
      expect(m.cbCommitPhysics).toBe(false);
      expect(m.cbTouchPast).toBe(false);
      expect(m.forcedTouchPast).toBeNull();
    }
  });

  it('⭐ flags ABSENT ≡ flags FALSE, whole run, both shapes', () => {
    for (const seed of [SEED_A, SEED_B]) {
      for (const armedSubstrate of [false, true]) {
        expect(walk(seed, { armedSubstrate }))
          .toBe(walk(seed, { commit: false, touch: false, armedSubstrate }));
      }
    }
  });

  it('⭐⭐ the TOUCH door armed ALONE (no seam) is inert — byte-identical', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      expect(walk(seed, { touch: true })).toBe(walk(seed, {}));
      expect(walk(seed, { touch: true, armedSubstrate: true }))
        .toBe(walk(seed, { armedSubstrate: true }));
    }
  });

  it('the carry-beat ledger is ALL ZERO in a production world', () => {
    const m = matchOf(SEED_A);
    while (!m.finished) m.step(DT);
    for (const v of Object.values(m.cbLedger)) expect(v).toBe(0);
  });

  it('⭐ the COMMITMENT door armed BITES (the seam is not dead code)', () => {
    const m = matchOf(SEED_A, { commit: true });
    while (!m.finished) m.step(DT);
    expect(m.cbLedger.armedChallenges).toBeGreaterThan(0);
    expect(m.cbLedger.recoveries).toBeGreaterThan(0);
    expect(walk(SEED_A, { commit: true })).not.toBe(walk(SEED_A, {}));
  });

  it('⭐⭐ the touch-past really RELEASES the ball into the engine\'s own loose-ball race', () => {
    const m = matchOf(SEED_B, { touch: true });
    let fired = false;
    while (!m.finished && !fired) {
      const o = m.ball.owner;
      if (o !== null && o.role !== 'GK' && m.phase === 'playing' && o.kickCooldown <= 0) {
        m.forcedTouchPast = { gid: o.gid, dir: { x: -o.heading.x, y: -o.heading.y } };
        m.step(DT);
        if (m.cbLedger.touchPasts > 0) {
          fired = true;
          expect(m.ball.owner).toBeNull();          // it genuinely left his feet
          expect(m.dribbleTouch?.gid).toBe(o.gid);  // the engine's own knock bookkeeping
          expect(o.kickCooldown).toBeGreaterThan(0); // and he cannot instantly regather
          expect(m.forcedTouchPast).toBeNull();      // one arming, one knock
        }
        continue;
      }
      m.step(DT);
    }
    expect(fired).toBe(true);
  });

  it('the touch seam is IGNORED while the door is shut', () => {
    const m = matchOf(SEED_B);
    while (!m.finished) {
      const o = m.ball.owner;
      if (o !== null && o.role !== 'GK') m.forcedTouchPast = { gid: o.gid, dir: { x: 1, y: 0 } };
      m.step(DT);
    }
    expect(m.cbLedger.touchPasts).toBe(0);
  });

  it('no League arms either door by default, and both keys are explicit opt-ins', () => {
    const flags = a4MatchFlags(3) as Record<string, unknown>;
    expect(flags.cbCommitPhysics).toBeUndefined();
    expect(flags.cbTouchPast).toBeUndefined();
  });
});
