import { v2, type V2 } from '../utils/vec';
import type { TacticalGenome } from '../evolution/genome';
import { NEUTRAL_MENTALITY, type Mentality } from '../ai/mentality';
import { HALF_L } from './constants';
import { Player } from './Player';
import type { PlayerAttributes } from '../evolution/playerGenome';
import {
  BENCH_ROLES, DEFAULT_POLICY, ROLES, deriveTeamStyle, emptyStats,
  type CornerRoutine, type PolicyParams, type Role, type Side, type TeamInfo,
  type TeamMatchStats, type TeamMode, type TeamStyle,
} from './types';

/**
 * One bench body (Phase 61, N2): everything a substitution needs to swap a
 * pitch slot's identity. `role` is NOMINAL (the pick prefers a like-for-like
 * body); on the pitch he assumes the slot he replaces.
 */
export interface BenchEntry {
  rosterIdx: number;
  role: Role;
  name: string;
  attrs: PlayerAttributes;
  age?: number;
  /** His personal-style policy (Phase 54 wire), swapped in with him. */
  policy: PolicyParams;
  used: boolean;
}

export class Team {
  readonly side: Side;
  /** +1 attacks toward +x, -1 toward -x. */
  readonly attackDir: 1 | -1;
  readonly info: TeamInfo;
  readonly players: Player[];
  /** Utility-policy weights the brains score with (learned for wildcards). */
  readonly policy: PolicyParams;
  /** Per-player policy resolved by index — `rolePolicies[i]`, else `policy`.
   * Elements are swapped when a substitute brings his own appetites on. */
  readonly policies: PolicyParams[];
  /** The bench (Phase 61): roster rows past the starting six. May be empty
   * (ad-hoc TeamInfos, older tests) — then no substitutions ever happen. */
  readonly bench: BenchEntry[];
  /** Substitutions made (SUBS_MAX caps them; no re-entry). */
  subsUsed = 0;
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

  /**
   * Game-state mentality (Phase 35): recomputed each brain tick from
   * (score diff, minute, raw genes). `effGenome` is what the `genome`
   * getter serves — every in-match gene read sees the mentality-modified
   * view; the raw identity stays at `info.genome` (style derivation,
   * evolution, UI). Identity object when neutral (bit discipline).
   */
  mentality: Mentality = NEUTRAL_MENTALITY;
  effGenome: TacticalGenome;
  /**
   * 门将上前 (Phase 35): the keeper is licensed to crash the opponent box
   * for a stoppage-time attacking corner while trailing. Set by TeamBrain,
   * survives the hand-off + flight like the corner crash does (31.9).
   */
  keeperUp = false;
  /** One feed line each per match — the surge, the shut-down, the keeper. */
  surgeAnnounced = false;
  shutdownAnnounced = false;
  keeperUpAnnounced = false;
  /** Captain's player index (Phase 39): highest age·technique outfielder. */
  captain = -1;

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
    // The bench (Phase 61): whatever the roster carries past the starters.
    this.bench = [];
    for (let i = ROLES.length; i < info.squad.length; i++) {
      const rp = info.rolePolicies?.[i];
      this.bench.push({
        rosterIdx: i,
        role: BENCH_ROLES[i - ROLES.length] ?? 'MF',
        name: info.playerNames[i] ?? 'SUB',
        attrs: info.squad[i],
        age: info.ages?.[i],
        policy: rp ? { ...DEFAULT_POLICY, ...rp } : this.policy,
        used: false,
      });
    }
    // The captain (Phase 39): the oldest cool head — age·technique. He
    // steadies the TEAM's mode switching (TeamBrain hysteresis), nothing
    // else; deterministic (index tiebreak).
    let bestC = -1;
    let bestScore = -Infinity;
    for (let i = 1; i < this.players.length; i++) {
      const p = this.players[i];
      const s = (p.age ?? 24) * ((p.attrs.passing + p.attrs.dribbling) / 2);
      if (s > bestScore) {
        bestScore = s;
        bestC = i;
      }
    }
    this.captain = bestC;
    this.effGenome = info.genome;
    this.ownGoalPos = v2(-this.attackDir * HALF_L, 0);
    this.oppGoalPos = v2(this.attackDir * HALF_L, 0);
  }

  /** The mentality-modified gene view (Phase 35). Raw = `info.genome`. */
  get genome(): TacticalGenome {
    return this.effGenome;
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
