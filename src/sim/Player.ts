import { add, approachV, clampLen, len, norm, scale, v2, type V2 } from '../utils/vec';
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
    const target = clampLen(this.desiredVel, this.topSpeed);
    this.vel = approachV(this.vel, target, this.accel * dt);
    this.pos = add(this.pos, scale(this.vel, dt));

    const sp = len(this.vel);
    if (sp > 0.5) this.heading = norm(this.vel);
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
