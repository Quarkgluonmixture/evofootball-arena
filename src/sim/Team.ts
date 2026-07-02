import { v2, type V2 } from '../utils/vec';
import type { TacticalGenome } from '../evolution/genome';
import { HALF_L } from './constants';
import { Player } from './Player';
import { ROLES, emptyStats, type Side, type TeamInfo, type TeamMatchStats, type TeamMode } from './types';

export class Team {
  readonly side: Side;
  /** +1 attacks toward +x, -1 toward -x. */
  readonly attackDir: 1 | -1;
  readonly info: TeamInfo;
  readonly players: Player[];

  mode: TeamMode = 'ResetShape';
  modeTime = 0;
  brainTimer = 0;

  /** Player indices currently assigned to chase/press the ball. */
  chasers = new Set<number>();
  /** Marking assignments: our player index -> opponent player index. */
  marks = new Map<number, number>();

  /** Sim time when we last gained possession (for counter-attack windows). */
  possessionGainedAt = -999;

  stats: TeamMatchStats = emptyStats();

  constructor(side: Side, info: TeamInfo) {
    this.side = side;
    this.attackDir = side === 0 ? 1 : -1;
    this.info = info;
    this.players = ROLES.map(
      (role, i) => new Player(side, i, role, info.playerNames[i] ?? role, info.squad[i]),
    );
  }

  get genome(): TacticalGenome {
    return this.info.genome;
  }

  get goalkeeper(): Player {
    return this.players[0];
  }

  /** Center of the goal we defend. */
  ownGoal(): V2 {
    return v2(-this.attackDir * HALF_L, 0);
  }

  /** Center of the goal we attack. */
  oppGoal(): V2 {
    return v2(this.attackDir * HALF_L, 0);
  }

  /** Attacking-direction-local x: positive = closer to opponent goal. */
  localX(x: number): number {
    return x * this.attackDir;
  }
}
