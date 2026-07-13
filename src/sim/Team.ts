import { v2, type V2 } from '../utils/vec';
import type { TacticalGenome } from '../evolution/genome';
import { HALF_L } from './constants';
import { Player } from './Player';
import {
  DEFAULT_POLICY, ROLES, deriveTeamStyle, emptyStats,
  type CornerRoutine, type PolicyParams, type Side, type TeamInfo, type TeamMatchStats,
  type TeamMode, type TeamStyle,
} from './types';

export class Team {
  readonly side: Side;
  /** +1 attacks toward +x, -1 toward -x. */
  readonly attackDir: 1 | -1;
  readonly info: TeamInfo;
  readonly players: Player[];
  /** Utility-policy weights the brains score with (learned for wildcards). */
  readonly policy: PolicyParams;
  /** Per-player policy resolved by index — `rolePolicies[i]`, else `policy`. */
  readonly policies: readonly PolicyParams[];
  /** Tactical identity (Phase 30): formations + marking scheme, resolved once. */
  readonly style: TeamStyle;

  mode: TeamMode = 'ResetShape';
  modeTime = 0;
  brainTimer = 0;

  /** Player indices currently assigned to chase/press the ball. */
  chasers = new Set<number>();
  /** Marking assignments: our player index -> opponent player index. */
  marks = new Map<number, number>();
  /** Player indices assigned to make attacking runs in behind (in possession). */
  runners = new Set<number>();
  /**
   * The ARRIVING runner (Phase 31): one player licensed to attack the
   * edge-of-box arc late when the ball is deep and wide — the body a
   * byline cutback is pulled back for. null = no cutback situation.
   */
  arriver: number | null = null;
  /**
   * 套边 (Phase 34): one trailing teammate licensed to overlap OUTSIDE a
   * confronted wide carrier — the executor routes him down the touchline
   * past the ball. null = no overlap situation.
   */
  overlapper: number | null = null;
  /**
   * Corner crash state persisted THROUGH the hand-off and the flight
   * (Phase 31.9): the restart clears ~0.2–0.5s before the taker's kick,
   * and losing the crash routing at that instant sent every crasher back
   * toward his formation spot before the ball was even struck — the
   * delivery aimed at retreating men and 0/30 corners met their target in
   * the header band. Set at hand-off, honored by TeamBrain licensing and
   * the executor's crash routing until `until` (or an opponent touch).
   */
  cornerCrash: {
    routine: CornerRoutine;
    y: number;
    until: number;
    /** Personnel locked at hand-off: re-scoring licenses mid-flight swapped
     * a crasher for the weak-side winger 27m away and unmapped every spot. */
    runners: number[];
    arriver: number | null;
  } | null = null;

  /** Sim time when we last gained possession (for counter-attack windows). */
  possessionGainedAt = -999;

  /**
   * Territory pressure (Phase 27): high-water mark of the ball's local-x
   * during this possession, and how long we've held the ball without beating
   * it. The carrier brain reads `staleTime` — the longer a team recycles the
   * ball sideways, the more its scoring tilts toward playing forward.
   */
  progressLocalX = -HALF_L;
  staleTime = 0;

  /** Restart the territory clock (possession gained / dead ball / kickoff). */
  resetProgress(ballLocalX: number): void {
    this.progressLocalX = ballLocalX;
    this.staleTime = 0;
  }

  stats: TeamMatchStats = emptyStats();

  // Goal centers never move — cached so per-frame callers (marking, keeper
  // positioning) don't allocate. Shared instances: callers must not mutate.
  private readonly ownGoalPos: V2;
  private readonly oppGoalPos: V2;

  constructor(side: Side, info: TeamInfo) {
    this.side = side;
    this.attackDir = side === 0 ? 1 : -1;
    this.info = info;
    // Explicit policies are merged over the defaults so a vector trained
    // before new weights existed (Phase 28 added five) stays usable — the
    // missing keys read as the hand-tuned constants. Teams WITHOUT a policy
    // keep the DEFAULT_POLICY object itself (bit-identity discipline).
    this.policy = info.policy ? { ...DEFAULT_POLICY, ...info.policy } : DEFAULT_POLICY;
    this.style = info.style ?? deriveTeamStyle(info.genome);
    this.policies = ROLES.map((_, i) => {
      const rp = info.rolePolicies?.[i];
      return rp ? { ...DEFAULT_POLICY, ...rp } : this.policy;
    });
    this.players = ROLES.map(
      (role, i) => new Player(side, i, role, info.playerNames[i] ?? role, info.squad[i]),
    );
    if (info.ages) this.players.forEach((p, i) => (p.age = info.ages![i]));
    this.ownGoalPos = v2(-this.attackDir * HALF_L, 0);
    this.oppGoalPos = v2(this.attackDir * HALF_L, 0);
  }

  get genome(): TacticalGenome {
    return this.info.genome;
  }

  get goalkeeper(): Player {
    return this.players[0];
  }

  /** Center of the goal we defend. Read-only — shared cached instance. */
  ownGoal(): V2 {
    return this.ownGoalPos;
  }

  /** Center of the goal we attack. Read-only — shared cached instance. */
  oppGoal(): V2 {
    return this.oppGoalPos;
  }

  /** Attacking-direction-local x: positive = closer to opponent goal. */
  localX(x: number): number {
    return x * this.attackDir;
  }
}
