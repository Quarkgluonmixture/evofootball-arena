import type { ActionType } from '../sim/types';

/** Short human labels for player actions — shared by the 2D and 3D views. */
export const ACTION_SHORT: Record<ActionType, string> = {
  MoveToFormationSpot: 'form',
  ChaseBall: 'chase',
  ReceivePass: 'recv',
  MarkOpponent: 'mark',
  InterceptPass: 'cut',
  SupportBallCarrier: 'support',
  Dribble: 'dribble',
  Pass: 'pass',
  Shoot: 'shoot!',
  ClearBall: 'clear',
  GoalkeeperSave: 'SAVE',
  GoalkeeperPosition: 'gk',
  HoldPosition: 'hold',
};
