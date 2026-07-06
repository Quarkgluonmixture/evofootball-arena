import type { ActionType } from '../sim/types';
import type { RenderPlayer, RenderState } from './RenderStateAdapter';
import type { PlayerModel } from './PlayerModel';

/**
 * Procedural animation: no keyframe assets — legs/arms swing from run phase,
 * bodies lean with effort, kicks/dives/celebrations are one-shot or stateful
 * poses driven by the player's current sim action. `animFor` is the pure
 * action->animation mapping (unit-tested); AnimationSystem applies it to a
 * PlayerModel's joints every frame.
 */
export type AnimName =
  | 'idle'
  | 'jog'
  | 'sprint'
  | 'dribble'
  | 'kick'
  | 'lunge'
  | 'gkReady'
  | 'gkDive'
  | 'celebrate';

export function animFor(action: ActionType, speed: number, celebrating: boolean): AnimName {
  if (celebrating) return 'celebrate';
  switch (action) {
    case 'Pass':
    case 'ThroughBall':
    case 'Shoot':
    case 'ClearBall':
      return 'kick';
    case 'Dribble':
      return 'dribble';
    case 'InterceptPass':
      return 'lunge';
    case 'GoalkeeperSave':
      return 'gkDive';
    case 'GoalkeeperPosition':
      return 'gkReady';
    default:
      break;
  }
  if (speed < 0.8) return 'idle';
  if (speed < 5.2) return 'jog';
  return 'sprint';
}

/** Leg-swing amplitude per animation (radians). Sprint reads clearly bigger than jog. */
const SWING_AMP: Partial<Record<AnimName, number>> = {
  idle: 0.05,
  jog: 0.6,
  sprint: 1.05,
  dribble: 0.48,
  gkReady: 0.08,
  kick: 0.3,
  lunge: 0.2,
};

/** Forward body lean per animation (radians). */
const LEAN: Partial<Record<AnimName, number>> = {
  idle: 0.02,
  jog: 0.1,
  sprint: 0.3,
  dribble: 0.15,
  lunge: 0.55,
  kick: 0.12,
  gkReady: 0.32,
};

/** Arm-swing factor relative to leg swing. */
const ARM_F: Partial<Record<AnimName, number>> = {
  jog: 0.65,
  sprint: 1.0, // full arm pump — sprints read urgent even at tactical range
  dribble: 0.55,
};

/** Vertical run bob amplitude (m) — makes strides read as steps, not sliding. */
const BOB: Partial<Record<AnimName, number>> = {
  jog: 0.04,
  sprint: 0.075,
  dribble: 0.05,
};

/** Run-cycle frequency multiplier — dribblers take short quick touches. */
const FREQ: Partial<Record<AnimName, number>> = {
  dribble: 1.4,
  sprint: 1.05,
};

const approach = (cur: number, target: number, maxDelta: number): number =>
  Math.abs(target - cur) <= maxDelta ? target : cur + Math.sign(target - cur) * maxDelta;

export class AnimationSystem {
  update(model: PlayerModel, p: RenderPlayer, state: RenderState, dt: number): void {
    const celebrating = state.celebratingSide === p.side && p.role !== 'GK';
    const anim = animFor(p.action, p.speed, celebrating);

    // One-shot kick trigger on entering the kick state.
    if (anim === 'kick' && model.prevAnim !== 'kick') {
      model.kickT = 0;
      model.kickPower =
        p.action === 'Shoot' || p.action === 'ClearBall' ? 1 : p.action === 'ThroughBall' ? 0.85 : 0.65;
    }
    model.prevAnim = anim;

    // Run cycle phase: distance-driven so feet match ground speed.
    model.phase += Math.max(p.speed, anim === 'celebrate' ? 4 : 0.6) * dt * 1.7 * (FREQ[anim] ?? 1);
    model.animTime += dt;
    const swing = Math.sin(model.phase) * (SWING_AMP[anim] ?? 0);
    const armF = ARM_F[anim] ?? 0.7;

    const r = 10 * dt; // smoothing rate for poses
    let legL = swing;
    let legR = -swing;
    let armL = -swing * armF;
    let armR = swing * armF;
    let armLz = 0.12;
    let armRz = -0.12;
    let leanX = LEAN[anim] ?? 0.04;
    let leanZ = 0;
    // Run bob: feet strike twice per cycle.
    let hop = (BOB[anim] ?? 0) * Math.abs(Math.sin(model.phase));
    let legLz = 0;
    let legRz = 0;

    if (model.kickT >= 0) {
      // Kick: windup (lean back, leg cocked) then snap-through with a forward
      // lean; shots swing harder than passes.
      model.kickT += dt;
      const k = model.kickT / 0.38;
      if (k >= 1) model.kickT = -1;
      else if (k < 0.35) {
        legR = -0.7 * (k / 0.35) * model.kickPower;
        legL = -0.12;
        leanX = -0.12;
        armL = 0.55;
        armR = -0.55;
      } else {
        legR = 1.35 * Math.sin(((k - 0.35) / 0.65) * Math.PI) * model.kickPower;
        legL = -0.18;
        leanX = 0.3 * model.kickPower;
        armL = 0.6;
        armR = -0.6;
      }
    }

    if (anim === 'lunge') {
      // Tackle/interception: low, one leg thrust forward, arms out for balance.
      legL = 0.95;
      legR = -0.5;
      armLz = 0.7;
      armRz = -0.7;
      hop = 0;
    } else if (anim === 'gkReady') {
      armLz = 0.85;
      armRz = -0.85;
    } else if (anim === 'gkDive') {
      // Full-stretch dive toward the ball's side (in the keeper's local frame).
      const toBall = Math.atan2(state.ball.x - p.x, state.ball.z - p.z);
      const side = Math.sign(Math.sin(toBall - p.yaw)) || 1;
      leanZ = -side * 1.3;
      armLz = side > 0 ? 2.7 : 1.5; // top arm reaches further
      armRz = side > 0 ? -1.5 : -2.7;
      legLz = side * 0.7; // legs trail into the dive — full-stretch silhouette
      legRz = side * 0.55;
      leanX = 0.12;
      hop = 0;
    } else if (anim === 'celebrate') {
      // The scorer leaps; teammates raise arms with a lighter bounce.
      const isScorer = state.celebratingGid === model.gid;
      armLz = 2.5;
      armRz = -2.5;
      armL = 0;
      armR = 0;
      hop = Math.abs(Math.sin(model.animTime * (isScorer ? 9 : 6))) * (isScorer ? 0.62 : 0.16);
      leanX = isScorer ? -0.15 : -0.06;
    }

    model.legL.rotation.x = approach(model.legL.rotation.x, legL, r * 1.6);
    model.legR.rotation.x = approach(model.legR.rotation.x, legR, r * 1.6);
    model.legL.rotation.z = approach(model.legL.rotation.z, legLz, r);
    model.legR.rotation.z = approach(model.legR.rotation.z, legRz, r);
    model.armL.rotation.x = approach(model.armL.rotation.x, armL, r * 1.6);
    model.armR.rotation.x = approach(model.armR.rotation.x, armR, r * 1.6);
    model.armL.rotation.z = approach(model.armL.rotation.z, armLz, r);
    model.armR.rotation.z = approach(model.armR.rotation.z, armRz, r);
    model.lean.rotation.x = approach(model.lean.rotation.x, leanX, r);
    model.lean.rotation.z = approach(model.lean.rotation.z, leanZ, r);
    model.root.position.y = approach(model.root.position.y, hop, 8 * dt);
  }
}
