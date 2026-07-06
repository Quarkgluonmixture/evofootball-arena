import { v2, type V2 } from '../utils/vec';
import type { PlayerAttributes } from '../evolution/playerGenome';
import type { ActionState, Role, Side } from './types';

/** Physical top speed by role (m/s) before pace/stamina scaling. */
const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };
const ACCEL = 14; // m/s^2 toward desired velocity

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

  stamina = 1;
  staminaSpent = 0;
  distance = 0;

  action: ActionState = { type: 'HoldPosition', scores: [] };
  decisionTimer = 0;
  kickCooldown = 0;
  tackleCooldown = 0;

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
    if (sp > 0.5) this.heading = { x: this.vel.x / sp, y: this.vel.y / sp };
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
    this.decisionTimer -= dt;
  }

  resetForKickoff(pos: V2): void {
    this.pos = pos;
    this.vel = v2();
    this.desiredVel = v2();
    this.action = { type: 'MoveToFormationSpot', scores: [] };
    this.kickCooldown = 0;
    this.tackleCooldown = 0;
  }
}
