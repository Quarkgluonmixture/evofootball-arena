import type { V2 } from '../utils/vec';
import type { TacticalGenome } from '../evolution/genome';
import type { PlayerAttributes } from '../evolution/playerGenome';

export type Side = 0 | 1;
export type Role = 'GK' | 'DF' | 'MF' | 'WG' | 'ST';
export const ROLES: Role[] = ['GK', 'DF', 'MF', 'WG', 'ST'];

export type TeamMode = 'BuildUp' | 'Attack' | 'Defend' | 'Press' | 'CounterAttack' | 'ResetShape';

export type ActionType =
  | 'MoveToFormationSpot'
  | 'ChaseBall'
  | 'ReceivePass'
  | 'MarkOpponent'
  | 'InterceptPass'
  | 'SupportBallCarrier'
  | 'Dribble'
  | 'Pass'
  | 'Shoot'
  | 'ClearBall'
  | 'GoalkeeperSave'
  | 'GoalkeeperPosition'
  | 'HoldPosition';

/** One scored candidate from utility evaluation — kept for the debug panel. */
export interface UtilityScore {
  action: ActionType;
  score: number;
  /** Short human-readable factor breakdown, e.g. "lane 0.8 · open 0.6 · passBias×1.3". */
  why: string;
}

export interface ActionState {
  type: ActionType;
  /** Static target (dribble direction, clear direction...). Dynamic targets are recomputed each frame. */
  targetPos?: V2;
  /** Opponent index (for marking) or teammate gid (for receive). */
  targetIdx?: number;
  /** Top candidates from the last decision, for explainability. */
  scores: UtilityScore[];
}

export interface KitColors {
  primary: number;
  secondary: number;
}

/** Everything a Match needs to know about one participating team. */
export interface TeamInfo {
  id: string;
  name: string;
  short: string;
  colors: KitColors;
  /** Surnames in role order [GK, DF, MF, WG, ST]. */
  playerNames: string[];
  genome: TacticalGenome;
  /** Per-player attribute genes in role order [GK, DF, MF, WG, ST]. */
  squad: PlayerAttributes[];
}

export type MatchPhase = 'kickoff' | 'playing' | 'goalPause' | 'halftime' | 'fulltime';

export type EventType =
  | 'goal'
  | 'shot'
  | 'save'
  | 'interception'
  | 'tackle'
  | 'keypass'
  | 'kickoff'
  | 'halftime'
  | 'fulltime'
  | 'info';

export interface MatchEvent {
  t: number;
  /** Display minute (sim time scaled to a 90' clock). */
  minute: number;
  type: EventType;
  /** -1 for neutral events. */
  side: Side | -1;
  text: string;
}

export interface TeamMatchStats {
  goals: number;
  shots: number;
  shotsOnTarget: number;
  xg: number;
  passes: number;
  passesCompleted: number;
  keyPasses: number;
  interceptions: number;
  tackles: number;
  clearances: number;
  saves: number;
  dribbles: number;
  possessionTime: number;
  distance: number;
  staminaSpent: number;
}

export const emptyStats = (): TeamMatchStats => ({
  goals: 0,
  shots: 0,
  shotsOnTarget: 0,
  xg: 0,
  passes: 0,
  passesCompleted: 0,
  keyPasses: 0,
  interceptions: 0,
  tackles: 0,
  clearances: 0,
  saves: 0,
  dribbles: 0,
  possessionTime: 0,
  distance: 0,
  staminaSpent: 0,
});

export interface MatchResult {
  score: [number, number];
  stats: [TeamMatchStats, TeamMatchStats];
  events: MatchEvent[];
  duration: number;
}
