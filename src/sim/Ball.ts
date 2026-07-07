import { v2 } from '../utils/vec';
import type { Player } from './Player';

/**
 * The ball is either free (integrated by Match physics with friction and wall
 * bounces) or owned — glued slightly ahead of its owner while they dribble.
 * Since Phase 28 it also has a height: lofted kicks fly parabolic arcs
 * (z up, gravity, bounces) while ground balls keep z = vz = 0 exactly.
 */
export class Ball {
  pos = v2();
  vel = v2();
  /** Height above the pitch (m). 0 for ground balls. */
  z = 0;
  /** Vertical velocity (m/s, + up). 0 for ground balls. */
  vz = 0;
  owner: Player | null = null;
  lastTouch: Player | null = null;

  /** In the air right now (grounded balls take the exact pre-Phase-28 path). */
  get airborne(): boolean {
    return this.z > 0 || this.vz !== 0;
  }

  reset(): void {
    this.pos = v2();
    this.vel = v2();
    this.z = 0;
    this.vz = 0;
    this.owner = null;
    this.lastTouch = null;
  }
}
