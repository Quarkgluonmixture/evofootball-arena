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
  | 'MakeRun'
  | 'MarkOpponent'
  | 'InterceptPass'
  | 'SupportBallCarrier'
  | 'Dribble'
  | 'Pass'
  | 'LoftedPass'
  | 'ThroughBall'
  | 'Cross'
  | 'ThrowOut'
  | 'HoldUp'
  | 'Shoot'
  | 'ClearBall'
  | 'GoalkeeperSave'
  | 'GoalkeeperPosition'
  | 'GoalkeeperRush'
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

/**
 * Utility-policy weights (Phase 18): the hand-tuned constants of the
 * PlayerBrain scorers, exposed as data so a "wildcard" team can carry a
 * LEARNED policy. DEFAULT_POLICY holds the exact literals the brain always
 * used — a team without an explicit policy is bit-identical to before.
 */
export interface PolicyParams {
  shootBase: number;
  shootGene: number;
  shootModeMul: number;
  shootPressurePen: number;
  passBase: number;
  passLaneW: number;
  passOpenW: number;
  passFwdBase: number;
  passFwdRisk: number;
  passBackPen: number;
  passOutletMul: number;
  dribbleBase: number;
  dribbleSpaceW: number;
  dribbleGeneBase: number;
  dribbleGeneW: number;
  dribblePressurePen: number;
  clearBase: number;
  clearPressureW: number;
  supportBase: number;
  supportProxW: number;
  formationBase: number;
  chaseBase: number;
  markBase: number;
  interceptScore: number;
  /** Off-ball attacking run priority (assigned runners, Phase 19). */
  runScore: number;
  /** Through-ball scoring: base + open-lane and behind-the-line weights. */
  throughBase: number;
  throughOpenW: number;
  throughBehindW: number;
  /** Cross scoring (Phase 28): base + weight on the best box target. */
  crossBase: number;
  crossBoxW: number;
  /** Lofted switch scoring: base + weight on the receiver's open space. */
  loftBase: number;
  loftOpenW: number;
  /** Long-range shot appetite bonus (16–30m, scaled by shootBias). */
  longShotW: number;
}

export const DEFAULT_POLICY: PolicyParams = {
  shootBase: 1.9,
  shootGene: 2.2,
  shootModeMul: 1.2,
  shootPressurePen: 0.25,
  passBase: 0.2,
  passLaneW: 0.3,
  passOpenW: 0.2,
  passFwdBase: 0.35,
  passFwdRisk: 0.75,
  passBackPen: 0.25,
  passOutletMul: 1.15,
  dribbleBase: 0.28,
  dribbleSpaceW: 0.55,
  dribbleGeneBase: 0.45,
  dribbleGeneW: 1.0,
  dribblePressurePen: 0.35,
  clearBase: 0.12,
  clearPressureW: 0.55,
  supportBase: 0.3,
  supportProxW: 0.35,
  formationBase: 0.45,
  chaseBase: 0.85,
  markBase: 0.62,
  interceptScore: 0.95,
  runScore: 0.95,
  throughBase: 0.22,
  throughOpenW: 0.35,
  throughBehindW: 0.52,
  crossBase: 0.26,
  crossBoxW: 0.5,
  loftBase: 0.14,
  loftOpenW: 0.38,
  longShotW: 0.38,
};

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
  /** Player ages in role order (Phase 26) — display only, never read by the sim. */
  ages?: number[];
  /** Learned utility-policy weights (wildcard team); omitted = DEFAULT_POLICY. */
  policy?: PolicyParams;
  /**
   * Per-role policy vectors in role order [GK, DF, MF, WG, ST] (Phase 23).
   * A missing entry falls back to `policy` (then DEFAULT_POLICY), so a team
   * without this field is bit-identical to the shared-policy path.
   */
  rolePolicies?: PolicyParams[];
}

export type MatchPhase = 'kickoff' | 'playing' | 'restart' | 'goalPause' | 'halftime' | 'fulltime';

/**
 * Dead-ball restart kinds. Futsal-style kick-ins (not throws) from the
 * touchline; free kicks and penalties are awarded for fouls (Phase 20).
 */
export type RestartKind = 'kickIn' | 'corner' | 'goalKick' | 'freeKick' | 'penalty';

export interface RestartState {
  kind: RestartKind;
  /** Team taking the restart. */
  side: Side;
  pos: V2;
  /** Sim-seconds since the restart was awarded. */
  timer: number;
  /** The player walking over to take it (GK for goal kicks). */
  takerGid: number;
}

export type EventType =
  | 'goal'
  | 'shot'
  | 'save'
  | 'interception'
  | 'tackle'
  | 'keypass'
  | 'corner'
  | 'foul'
  | 'card'
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
  /** Direct balls played into a runner's path (subset of passes). */
  throughBalls: number;
  /** Passes played ≥2m toward the opponent goal (subset of passes, Phase 27). */
  passesForward: number;
  /** First touches that got away from the receiver (forced errors, Phase 27). */
  miscontrols: number;
  /** Lofted balls whipped into the box from wide (Phase 28). */
  crosses: number;
  /** Aerial duels won — headed shots, clears and knockdowns (Phase 28). */
  headersWon: number;
  /** Lofted long deliveries — switches/diagonals + chipped through balls (Phase 28). */
  longBalls: number;
  keyPasses: number;
  interceptions: number;
  tackles: number;
  clearances: number;
  saves: number;
  dribbles: number;
  corners: number;
  /** Fouls committed — each hands the opponents a free kick or penalty. */
  fouls: number;
  /** Offside flags against this team (Phase 29) — free kick to the opponents. */
  offsides: number;
  /** Penalties won (fouled inside the opponents' box). */
  penalties: number;
  /** Bookings picked up (a second yellow counts here AND as a red). */
  yellows: number;
  /** Players sent off — the team plays a man short from that moment. */
  reds: number;
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
  throughBalls: 0,
  passesForward: 0,
  miscontrols: 0,
  crosses: 0,
  headersWon: 0,
  longBalls: 0,
  keyPasses: 0,
  interceptions: 0,
  tackles: 0,
  clearances: 0,
  saves: 0,
  dribbles: 0,
  corners: 0,
  fouls: 0,
  offsides: 0,
  penalties: 0,
  yellows: 0,
  reds: 0,
  possessionTime: 0,
  distance: 0,
  staminaSpent: 0,
});

/** Per-player counters for awards/records — passive, never read by the sim. */
export interface PlayerMatchStats {
  goals: number;
  assists: number;
  shots: number;
  saves: number;
  recoveries: number;
}

export const emptyPlayerStats = (): PlayerMatchStats => ({
  goals: 0,
  assists: 0,
  shots: 0,
  saves: 0,
  recoveries: 0,
});

export interface MatchResult {
  score: [number, number];
  stats: [TeamMatchStats, TeamMatchStats];
  /** Indexed by gid (0-4 home, 5-9 away). */
  playerStats: PlayerMatchStats[];
  events: MatchEvent[];
  duration: number;
}
