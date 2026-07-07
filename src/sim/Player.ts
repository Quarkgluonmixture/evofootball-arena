import { v2, type V2 } from '../utils/vec';
import type { PlayerAttributes } from '../evolution/playerGenome';
import type { ActionState, Role, Side } from './types';

/** Physical top speed by role (m/s) before pace/stamina scaling. */
const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };
const ACCEL = 14; // m/s^2 toward desired velocity

/**
 * Body turn rate (rad/s), Phase 27: heading sweeps toward the movement
 * direction instead of snapping to it, so a 180° cut takes ~0.48s of visible
 * rotation. Velocity itself is already inertia-bound by ACCEL — this cap is
 * what the eye (and the kick-orientation mechanics) read as "facing".
 */
export const TURN_RATE = 6.5;
// cos/sin of the per-step turn cap, cached per dt (the sim always uses DT).
let turnDt = -1;
let turnCos = 1;
let turnSin = 0;

export class Player {
  /** Index within team (0..4, role order GK/DF/MF/WG/ST). */
  readonly index: number;
  /** Global id across both teams (0..9), = side * 5 + index. */
  readonly gid: number;
  readonly side: Side;
  readonly role: Role;
  readonly name: string;
  /** Attribute genes (squad DNA) — pace/technique/finishing/defending/reflexes. */
  readonly attrs: PlayerAttributes;

  pos = v2();
  vel = v2();
  heading = v2(1, 0);
  /** Set every frame by the action executor; physics chases it. */
  desiredVel = v2();
  /**
   * When set (by the executor, per frame), heading turns toward this point
   * instead of the movement direction — keepers backpedal FACING the play
   * (27.5). Holds a live reference (e.g. ball.pos); cleared each frame.
   */
  faceTarget: V2 | null = null;

  stamina = 1;
  staminaSpent = 0;
  distance = 0;

  action: ActionState = { type: 'HoldPosition', scores: [] };
  decisionTimer = 0;
  kickCooldown = 0;
  tackleCooldown = 0;
  /**
   * Recovery stun (Phase 27): a dispossessed carrier stumbles and a beaten
   * lunger picks themself up — movement is heavily damped while it runs, and
   * a stunned player can't control a loose ball or tackle.
   */
  stunTimer = 0;
  /**
   * Keeper hold (Phase 27.2): after claiming the ball a keeper scoops it up
   * and holds it briefly — untackleable, ball carried in the hands — before
   * distributing. Never set for restart first touches (goal kicks stay quick).
   */
  gkHoldTimer = 0;
  /** Display-only: renderers play a lunge animation while this runs. */
  tackleAnimTimer = 0;
  /** Display-only: renderers play a keeper dive while this runs (27.4). */
  saveAnimTimer = 0;
  /** Display-only: renderers play a header jump while this runs (Phase 28). */
  headerAnimTimer = 0;
  /**
   * Keeper distribution mode (Phase 28.3): set while holding the ball in the
   * hands, cleared on the kick — a keeper who HELD the ball releases it
   * deliberately (throw/pass/switch), never with a panic hoof.
   */
  gkDistributing = false;

  /** Age in seasons (Phase 26) — display only, set by Team from TeamInfo. */
  age?: number;
  /** Has a yellow card this match — a second booking is a red (Phase 25). */
  booked = false;
  /** Sent off: parked on the apron, excluded from every sim interaction. */
  sentOff = false;

  readonly baseSpeed: number;
  readonly accel: number;

  constructor(side: Side, index: number, role: Role, name: string, attrs: PlayerAttributes) {
    this.side = side;
    this.index = index;
    this.gid = side * 5 + index;
    this.role = role;
    this.name = name;
    this.attrs = attrs;
    // pace: ±12% top speed, ±10% acceleration around the role baseline.
    this.baseSpeed = BASE_SPEED[role] * (0.88 + attrs.pace * 0.24);
    this.accel = ACCEL * (0.9 + attrs.pace * 0.2);
  }

  /** Effective top speed — tired players slow down but never stop. */
  get topSpeed(): number {
    return this.baseSpeed * (0.62 + 0.38 * this.stamina);
  }

  physicsStep(dt: number): void {
    // In-place integration — this ran as clampLen/approachV/add/norm, which
    // allocated ~6 vectors per player per step (860k per match). The exact
    // same operations in the exact same IEEE order, written out flat:
    // results are bit-identical (regression: same seed ⇒ same save JSON).
    const dv = this.desiredVel;
    const max = this.topSpeed;
    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen
    let tx = dv.x;
    let ty = dv.y;
    if (dl > max && dl > 1e-8) {
      const s = max / dl;
      tx = dv.x * s;
      ty = dv.y * s;
    }
    // Stunned (Phase 27): stumbling players can barely move until they recover.
    if (this.stunTimer > 0) {
      tx *= 0.15;
      ty *= 0.15;
    }
    const maxDelta = this.accel * dt; // approachV
    const ax = tx - this.vel.x;
    const ay = ty - this.vel.y;
    const al = Math.sqrt(ax * ax + ay * ay);
    if (al <= maxDelta || al < 1e-8) {
      this.vel.x = tx;
      this.vel.y = ty;
    } else {
      const s = maxDelta / al;
      this.vel.x = this.vel.x + ax * s;
      this.vel.y = this.vel.y + ay * s;
    }
    this.pos.x = this.pos.x + this.vel.x * dt;
    this.pos.y = this.pos.y + this.vel.y * dt;

    const sp = Math.sqrt(this.vel.x * this.vel.x + this.vel.y * this.vel.y);
    // Rotate heading toward the face target (backpedal, 27.5) or, failing
    // that, the movement direction — capped at TURN_RATE either way.
    // No trig in the loop: the per-step rotation's cos/sin are cached per dt.
    if (dt !== turnDt) {
      turnDt = dt;
      turnCos = Math.cos(TURN_RATE * dt);
      turnSin = Math.sin(TURN_RATE * dt);
    }
    const ft = this.faceTarget;
    let wx = 0;
    let wy = 0;
    let turn = false;
    if (ft) {
      const fx = ft.x - this.pos.x;
      const fy = ft.y - this.pos.y;
      const fl = Math.sqrt(fx * fx + fy * fy);
      if (fl > 1e-6) {
        wx = fx / fl;
        wy = fy / fl;
        turn = true;
      }
    } else if (sp > 0.5) {
      wx = this.vel.x / sp;
      wy = this.vel.y / sp;
      turn = true;
    }
    if (turn) {
      const hx = this.heading.x;
      const hy = this.heading.y;
      if (hx * wx + hy * wy >= turnCos) {
        this.heading = { x: wx, y: wy };
      } else {
        const s = hx * wy - hy * wx >= 0 ? turnSin : -turnSin;
        this.heading = { x: hx * turnCos - hy * s, y: hx * s + hy * turnCos };
      }
    }
    this.distance += sp * dt;

    // Stamina: quadratic drain above ~55% effort, slow recovery when jogging/idle.
    const effort = sp / this.baseSpeed;
    if (effort > 0.55) {
      const drain = 0.006 * effort * effort * dt;
      this.stamina = Math.max(0.05, this.stamina - drain);
      this.staminaSpent += drain;
    } else {
      this.stamina = Math.min(1, this.stamina + 0.014 * dt);
    }

    this.kickCooldown = Math.max(0, this.kickCooldown - dt);
    this.tackleCooldown = Math.max(0, this.tackleCooldown - dt);
    this.stunTimer = Math.max(0, this.stunTimer - dt);
    this.gkHoldTimer = Math.max(0, this.gkHoldTimer - dt);
    this.tackleAnimTimer = Math.max(0, this.tackleAnimTimer - dt);
    this.saveAnimTimer = Math.max(0, this.saveAnimTimer - dt);
    this.headerAnimTimer = Math.max(0, this.headerAnimTimer - dt);
    this.decisionTimer -= dt;
  }

  resetForKickoff(pos: V2): void {
    this.pos = pos;
    this.vel = v2();
    this.desiredVel = v2();
    this.action = { type: 'MoveToFormationSpot', scores: [] };
    this.kickCooldown = 0;
    this.tackleCooldown = 0;
    this.stunTimer = 0;
    this.gkHoldTimer = 0;
    this.gkDistributing = false;
    this.tackleAnimTimer = 0;
    this.saveAnimTimer = 0;
    this.headerAnimTimer = 0;
  }
}
