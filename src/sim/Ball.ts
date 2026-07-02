import { v2 } from '../utils/vec';
import type { Player } from './Player';

/**
 * The ball is either free (integrated by Match physics with friction and wall
 * bounces) or owned — glued slightly ahead of its owner while they dribble.
 */
export class Ball {
  pos = v2();
  vel = v2();
  owner: Player | null = null;
  lastTouch: Player | null = null;

  reset(): void {
    this.pos = v2();
    this.vel = v2();
    this.owner = null;
    this.lastTouch = null;
  }
}
