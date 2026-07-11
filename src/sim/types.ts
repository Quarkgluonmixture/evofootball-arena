import type { V2 } from '../utils/vec';
import type { TacticalGenome } from '../evolution/genome';
import type { PlayerAttributes } from '../evolution/playerGenome';

export type Side = 0 | 1;
export type Role = 'GK' | 'DF' | 'MF' | 'WG' | 'ST';
/**
 * Squad slot order (Phase 30: 6v6). The Role SET is unchanged — WG simply
 * appears twice (slot 3 = left winger, slot 4 = right winger; two wings was
 * the whole point of the 6th player). Everything player-array-shaped
 * (playerNames, squad, ages, careers, playerAgg, cup.playerGoals) is indexed
 * by this list; gid = side * TEAM_SIZE + index.
 */
export const ROLES: Role[] = ['GK', 'DF', 'MF', 'WG', 'WG', 'ST'];
export const TEAM_SIZE = ROLES.length;

export type TeamMode = 'BuildUp' | 'Attack' | 'Defend' | 'Press' | 'CounterAttack' | 'ResetShape';

/**
 * Formation system (Phase 30): every team owns a FIXED attacking formation,
 * a FIXED defending formation and a marking scheme — its tactical identity,
 * shown on the team card and inherited through rebirth. Names read as
 * outfield lines from the back (the keeper is implicit).
 */
export type AttackFormationId = 'wide-212' | 'narrow-122';
export type DefendFormationId = 'low-32' | 'press-23';
export type MarkScheme = 'man' | 'zonal';

export interface TeamStyle {
  formationAtk: AttackFormationId;
  formationDef: DefendFormationId;
  scheme: MarkScheme;
}

/**
 * Derive a team's tactical identity from its genome — legible thresholds on
 * the genes that already MEAN width, pressing and marking, so the identity
 * is the DNA's readout, not a separate random draw. Called once at franchise
 * creation/rebirth and STORED (mid-life gene mutation must not flip a
 * club's formation every season — switching is Phase 31's explicit,
 * lineage-logged mutation).
 */
export function deriveTeamStyle(genome: TacticalGenome): TeamStyle {
  return {
    formationAtk: genome.attackingWidth >= 0.5 ? 'wide-212' : 'narrow-122',
    formationDef: genome.pressIntensity >= 0.5 ? 'press-23' : 'low-32',
    // Zonal is the RARE identity (~1 in 5 clubs): a parked zone lattice is
    // structurally much harder to score on than man-marking (measured ~3.5
    // vs ~8 shots conceded — man-markers get DRAGGED out of shape, zones
    // don't), so a 50/50 league collapsed to 1.1 goals/match. Rare keeps
    // the texture ("the league's zone side") without sinking the league.
    scheme: genome.markingAggression >= 0.3 ? 'man' : 'zonal',
  };
}

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
  // 0.38 -> 0.55 in Phase 30.4: set defences (formations + zonal) park the
  // block, and the realistic answer to a parked block is shooting over it.
  longShotW: 0.55,
};

/** Everything a Match needs to know about one participating team. */
export interface TeamInfo {
  id: string;
  name: string;
  short: string;
  colors: KitColors;
  /** Surnames in slot order [GK, DF, MF, WGL, WGR, ST]. */
  playerNames: string[];
  genome: TacticalGenome;
  /** Per-player attribute genes in slot order [GK, DF, MF, WGL, WGR, ST]. */
  squad: PlayerAttributes[];
  /** Player ages in role order (Phase 26) — display only, never read by the sim. */
  ages?: number[];
  /**
   * Tactical identity (Phase 30). Optional: a TeamInfo without one (tests,
   * ad-hoc teams) derives it from the genome — same thresholds, same result.
   */
  style?: TeamStyle;
  /** Learned utility-policy weights (wildcard team); omitted = DEFAULT_POLICY. */
  policy?: PolicyParams;
  /**
   * Per-slot policy vectors in slot order [GK, DF, MF, WGL, WGR, ST]
   * (Phase 23). A missing entry falls back to `policy` (then
   * DEFAULT_POLICY), so a team without this field is bit-identical to the
   * shared-policy path.
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
  /**
   * Display only (Phase 29): this free kick is an offside award — the UI
   * labels it 🚩 offside instead of ⚠ free kick (since 27.2 outfield fouls
   * play advantage, so offside is the ONLY source of free kicks; without
   * the flag every whistle read as "fouls are back").
   */
  offside?: boolean;
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
  /** Indexed by gid (0..TEAM_SIZE-1 home, TEAM_SIZE.. away). */
  playerStats: PlayerMatchStats[];
  events: MatchEvent[];
  duration: number;
}
