import type { ActionType } from '../sim/types';

/** Short human labels for player actions — shared by the 2D and 3D views. */
export const ACTION_SHORT: Record<ActionType, string> = {
  MoveToFormationSpot: 'form',
  ChaseBall: 'chase',
  ReceivePass: 'recv',
  MakeRun: 'run!',
  MarkOpponent: 'mark',
  InterceptPass: 'cut',
  SupportBallCarrier: 'support',
  Dribble: 'dribble',
  Pass: 'pass',
  ThroughBall: 'through!',
  Shoot: 'shoot!',
  ClearBall: 'clear',
  GoalkeeperSave: 'SAVE',
  GoalkeeperPosition: 'gk',
  GoalkeeperRush: 'RUSH!',
  HoldPosition: 'hold',
};
