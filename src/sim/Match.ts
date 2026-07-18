import { Rng } from '../utils/rng';
import { add, clone, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import { decidePlayer } from '../ai/PlayerBrain';
import { applyMentality, applyUnderdogShift, mentalityOf } from '../ai/mentality';
import { pickCornerRoutine, updateTeamBrain } from '../ai/TeamBrain';
import { executeAction } from '../ai/actionExecutor';
import { cornerCrashSpots, fkWallSlots, formationSpot, offsideLineLocalX, shapeReady } from '../ai/formations';
import { opennessOf } from '../ai/perception';
import { Ball } from './Ball';
import {
  AI_INTERVAL, BALL_BOUNCE, BALL_FRICTION_K, BOUNCE_DAMP, BOUNCE_MIN_VZ, BOX_DEPTH, BOX_WIDTH,
  CONTACT_BLIND_PEN, CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS, CORNER_CLEARANCE,
  DEFLECT_MAX_SPEED, DT,
  GK_CONTROL_MAX_SPEED, GK_HOLD_CLEARANCE, GOAL_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L, HALF_W,
  KICK_COOLDOWN, MATCH_DURATION, OUT_PLAY_COAST,
  PENALTY_CLEARANCE, PENALTY_SPOT_DIST, PLAYER_MIN_DIST, RESTART_CLEARANCE, RESTART_MIN_SETUP,
  RESTART_TIMEOUT, STOPPAGE_MAX, TEAM_AI_INTERVAL, TOUCH_CONTROL_DIST,
} from './constants';
import * as mech from './mechanics';
import { Player } from './Player';
import { matchRating } from './ratings';
import { Team } from './Team';
import {
  ROSTER_SIZE, SUBS_MAX, TEAM_SIZE, emptyPlayerStats,
  type EventType, type GoalChannel, type MatchEvent, type MatchPhase, type MatchResult,
  type PlayerMatchStats,
  type CornerRoutine, type RestartKind, type RestartState, type Side, type TeamInfo,
} from './types';

/**
 * Feed threshold for 🎼 pass-move lines (Phase 33). Measured (20-match
 * probe): 6 ⇒ ~2.1 lines/match, 8 ⇒ ~0.75 — six keeps the line an event
 * without feed spam (failure mode 7); `bestPassChain` records every chain.
 */
const PASS_MOVE_FEED_MIN = 6;

/**
 * Per-foul injury chance at neutral fatigue/age (Phase 118). Calibrated by
 * the injury-census probe against the user-ratified budget of ~1-2
 * injuries per club-season: ≈4.5-5 fouls/match ×
 * observed mean multiplier ≈0.6 (fouled carriers run fresher than the
 * average leg) × this ≈ 0.27-0.30 injuries/match ≈ 1.2-1.4 per
 * club-season (census, 12-season worlds 991/424242).
 */
const INJURY_BASE = 0.10;

export interface PendingPass {
  side: Side;
  passerGid: number;
  targetGid: number;
  t: number;
  /**
   * Offside, judged AT KICK TIME (Phase 29): the target was in an offside
   * position when the ball was struck. The flag only becomes an offence if
   * the ball reaches the flagged target (giveBall or a won header) —
   * defenders playing it, or another teammate arriving, plays on.
   */
  offside: boolean;
  /** Where the flagged target stood at the kick — the free-kick spot. */
  offsideSpot: V2 | null;
  /** Third-man release (Phase 34): a fresh receiver bouncing it to a runner. */
  bounce?: boolean;
}

export interface PendingShot {
  side: Side;
  shooterGid: number;
  xg: number;
  t: number;
  resolved: boolean;
  /** Index into Match.shotLog for outcome bookkeeping. */
  logIndex: number;
  /** Passer credited with an assist if this shot scores (else null). */
  assistGid: number | null;
  /**
   * Save-probability multiplier fixed AT SHOT TIME from how far the ball's
   * path passes from the keeper's position when the shot is struck. Computed
   * once (not live) so the keeper's dive toward the line doesn't erase the
   * difficulty — it models reaction time. 1 = straight at the keeper,
   * 0.25 = shaving the edge of reach.
   */
  difficulty: number;
  /**
   * A PLACED ball (Phase 32, direct free kicks): the keeper is set and
   * expecting it — tryKeeperSave floors the difficulty discount instead of
   * treating the far-corner curl like an open-play reaction save.
   */
  placed?: boolean;
  /**
   * ANGLE CLOSED (Phase 103, the sweeper's missing physics): how near the
   * keeper stood to the SHOOTER at the strike (1 at his feet, 0 beyond 7m).
   * Frozen at shot time like `difficulty`. The save model was blind to
   * closing down — a keeper at the striker's toes saved at the same rate
   * as one on his line, so 出击 could never pay and the walk-in pipe had
   * no keeper answer. The xG model stays keeper-blind (phase-85's rule:
   * evolved defending shows up as UNDER-performance, like real xG).
   * Chips and placed balls carry 0 — the chip IS the counter.
   */
  closeIn?: number;
}

/** One shot for the analytics timeline (xG race chart). */
export interface ShotLogEntry {
  t: number;
  minute: number;
  side: Side;
  xg: number;
  /** Shot-context telemetry (Phase 86): defender pressure at the strike,
   * the composed-1v1 flag, and what SERVED it. Absent on old entries. */
  pressure?: number;
  oneVone?: boolean;
  assist?: 'through' | 'cutback' | 'cross' | 'pass' | 'lofted' | 'none';
  outcome: 'pending' | 'goal' | 'saved' | 'miss';
  /** Bodies on the shot corridor at the strike (Phase 31, `laneBlockers`). */
  blockers: number;
  /** The lofted finish over an advanced keeper (Phase 69) — probes and the
   * feed tell the chip apart from the placed ground strike. */
  chip?: boolean;
  /** What CREATED the chance (Phase 113) — priced at the strike, banked
   * into the club's goal-channel ledger only if this shot scores. */
  channel?: GoalChannel;
}

export interface MatchConfig {
  seed: number;
  teamA: TeamInfo;
  teamB: TeamInfo;
  /** Sim-seconds for the whole match (default MATCH_DURATION). Tests use short ones. */
  duration?: number;
  /** Armed rivalry fixture (Phase 40): a touch more press and bite, 🔥 banner. */
  derby?: boolean;
}

/**
 * A fully deterministic 6v6 match: same config + seed => same result, whether
 * it's watched frame by frame or run headless. The Match owns all state and a
 * single fixed-timestep `step(DT)`; rendering reads state and never writes.
 */
export class Match {
  readonly rng: Rng;
  readonly duration: number;
  readonly ball = new Ball();
  readonly teams: [Team, Team];
  readonly allPlayers: Player[];
  private readonly allPlayersReversed: Player[];

  phase: MatchPhase = 'kickoff';
  phaseTimer = 0;
  simTime = 0;
  half: 1 | 2 = 1;
  score: [number, number] = [0, 0];
  events: MatchEvent[] = [];
  finished = false;

  /** Which side has effective possession; -1 while the ball is loose. */
  possessionSide: Side | -1 = -1;
  /**
   * Discrete dribble touch in flight (Phase 36): the carrier pushed the
   * ball ahead and is chasing it. The tag keeps his brain on the chase and
   * prices his re-collect gently (it's HIS touch, not a blind reception);
   * any other capture, kick or dead ball clears it.
   */
  dribbleTouch: { gid: number; until: number } | null = null;
  /** Live dead-ball restart (kick-in/corner/goal kick); null in open play. */
  restart: RestartState | null = null;
  /** A ball over the goal line, coasting clear before its corner/goal-kick is
   * placed (Phase 41.1). Goal detection is frozen while this is set, so a wide
   * ball drifting behind the line can't phantom-goal. Transient — lives only
   * ~OUT_PLAY_COAST s of open play, and setupKickoff clears any stragglers. */
  private pendingOut: { kind: RestartKind; side: Side; spot: V2; until: number } | null = null;
  /** Gid whose next carrier decision must be a kick (restart first touch). */
  restartKickGid: number | null = null;
  /** Gid whose next carrier decision is the kickoff — played BACKWARD (27.3). */
  kickoffKickGid: number | null = null;
  /** What kind of restart that kick is — penalties force a shot. */
  restartKickKind: RestartKind | null = null;
  /**
   * Free-kick WALL (Phase 32): picked when a danger-zone FK is awarded —
   * the defending bodies that line up on the ball–goal line at the law
   * clearance. The executor routes them there (their slot IS their
   * steering target, so the clearance clamps never fight them — the wall
   * IS the clearance). The kick STARTS the release timer instead of
   * dissolving it: released instantly, the wallers walked back toward
   * their marks — straight into the climb's header band — and free-headed
   * the kick they had just walled. `until` null = holding; set = released
   * at that sim time. A new restart clears it outright.
   */
  fkWall: { gids: number[]; pos: V2; side: Side; until: number | null } | null = null;
  /** The corner routine the restart handed to the kick (Phase 31). */
  restartKickRoutine: CornerRoutine | null = null;
  pendingPass: PendingPass | null = null;
  /** Consecutive completed passes in the current move, per side (Phase 33). */
  private passChain: [number, number] = [0, 0];
  pendingShot: PendingShot | null = null;
  shotLog: ShotLogEntry[] = [];
  /** Gid of the most recent goalscorer — passive, for celebration visuals only. */
  lastScorerGid: number | null = null;
  /** Per-player counters (goals/assists/shots/saves/recoveries). ROSTER-
   * indexed since Phase 61 (home 0..ROSTER_SIZE-1, then away): a substitute's
   * numbers land on HIS row. Write through `stat(gid)`. Passive. */
  playerStats: PlayerMatchStats[] = [];
  /** Rounds out per roster row (Phase 118) — home 0..8, then away; 0 = fit.
   * Banked by League.applyResult into `f.injuries` (the suspension seam). */
  readonly injuriesOut: number[] = Array<number>(ROSTER_SIZE * 2).fill(0);
  /** Roster surnames (record resolution — the MOTM line may name a sub). */
  private readonly rosterNames: string[];
  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;
  /** The most recent cutback kick (Phase 31) — goals within 5s credit it. */
  lastCutback: { side: Side; t: number } | null = null;
  /** Telemetry (Phase 86): the most recent pass launch's kind — shot-context
   * anatomy reads it; zero RNG, zero behavior. */
  lastPassKind: { kind: 'pass' | 'through' | 'cross' | 'lofted'; t: number } | null = null;
  /* ---- Goal-channel telemetry (Phase 113) — the launch-anatomy probe's
   * band-entry classifier moved in-engine so every GOAL carries a channel
   * tag. All four fields are written from state the step already computed
   * and read ONLY by the shot log: zero RNG, zero behavior. ---- */
  /** The current owner's possession start (team-local x) — the carry clock. */
  carryStart: { gid: number; t: number; x: number } | null = null;
  /** The owner already counted for the final-15m band this possession. */
  private bandInside = false;
  /** The live attack's fresh BREAKAWAY band entry (nobody goal-side but the
   * keeper) and what launched it. A turnover or kickoff kills it. */
  attackEntry: { side: Side; kind: GoalChannel; t: number } | null = null;
  /** The most recent SET-PIECE first touch (corner/free kick/penalty only). */
  lastRestartKick: { kind: RestartKind; side: Side; t: number } | null = null;

  private kickoffSide: Side = 0;
  private stepCount = 0;
  /** One "stoppage time" feed line per half (Phase 27.4). */
  private stoppageAnnounced = false;
  /** Sim time when the second half kicked off — first-half stoppage must not
   * leak into the second half's display clock (Phase 28.1). */
  private secondHalfStart = 0;

  /** Armed rivalry fixture (Phase 40): press + bite up a touch, 🔥 banner. */
  readonly derby: boolean;

  constructor(cfg: MatchConfig) {
    this.rng = new Rng(cfg.seed);
    this.duration = cfg.duration ?? MATCH_DURATION;
    this.derby = cfg.derby ?? false;
    this.teams = [new Team(0, cfg.teamA), new Team(1, cfg.teamB)];
    // The underdog shift (Phase 64): with both clubs' Elo on the team
    // sheet, the outgunned coach bends toward the bus by his gene. Read
    // ONCE at kickoff; the score/clock mentality layers on top each brain
    // tick. 150 Elo = a full class apart — OUR ladder is compressed
    // (K=28, reborn clubs reset to 1500, 14-match seasons), and the first
    // cut at /300 left in-league kickoff factors averaging 0.11-0.19:
    // a sensor whose dynamic range never met its signal (probed).
    if (cfg.teamA.elo !== undefined && cfg.teamB.elo !== undefined) {
      const gap = cfg.teamB.elo - cfg.teamA.elo;
      for (const team of this.teams) {
        const factor = Math.min(1, Math.max(0, (team.side === 0 ? gap : -gap) / 150));
        const s = factor * (team.info.genome.underdogShift ?? 0);
        team.baseGenome = applyUnderdogShift(team.info.genome, s);
        team.effGenome = team.baseGenome;
        // The pragmatist's kickoff call gets NARRATED (Phase 66, N3): the
        // shift existed since 64 but was invisible in the feed. One line,
        // only when the bend is a real bus (s·0.3 ≈ +0.12 compactness), so
        // routine small leans stay quiet (failure mode 7).
        if (s >= 0.4) {
          const oppName = (team.side === 0 ? cfg.teamB : cfg.teamA).name;
          const coach = team.info.coachName;
          this.pushEvent('info', team.side, coach
            ? `🚌 ${coach} parks the bus against ${oppName}`
            : `🚌 ${team.info.name} park the bus against ${oppName}`);
        }
      }
    }
    this.allPlayers = [...this.teams[0].players, ...this.teams[1].players];
    this.allPlayersReversed = [...this.allPlayers].reverse();
    // Roster-indexed stats (Phase 61): bench rows exist from kickoff and
    // stay empty unless their man comes on. Starters are appearances.
    this.playerStats = Array.from({ length: ROSTER_SIZE * 2 }, () => emptyPlayerStats());
    for (const p of this.allPlayers) this.stat(p.gid).apps = 1;
    this.rosterNames = Array.from({ length: ROSTER_SIZE * 2 }, (_, ri) => {
      const side = ri < ROSTER_SIZE ? 0 : 1;
      const info = side === 0 ? cfg.teamA : cfg.teamB;
      return info.playerNames[ri % ROSTER_SIZE] ?? '?';
    });
    // Stagger decision ticks deterministically (symmetric across the teams)
    // so all 12 players don't think in the same frame.
    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % TEAM_SIZE) + 1) * (AI_INTERVAL / TEAM_SIZE)));
    this.setupKickoff(0);
    if (this.derby) this.pushEvent('info', -1, '🔥 Derby! Old rivals meet again');
  }

  /**
   * Display minute: sim time scaled onto a 90' clock, held at 45/90 during
   * stoppage (Phase 28.1 — the first half used to tick into "46', 47'" while
   * its added time played out, which read as the second half starting early).
   * The second half's clock restarts from 45' regardless of how much
   * stoppage the first half ran.
   */
  minute(): number {
    if (this.half === 1) {
      return Math.min(45, Math.floor((this.simTime / this.duration) * 90));
    }
    const secondHalf = Math.floor(((this.simTime - this.secondHalfStart) / this.duration) * 90);
    return Math.min(90, 45 + Math.max(0, secondHalf));
  }

  /** Added display-minutes in the current half (0 outside stoppage). */
  addedMinutes(): number {
    const over =
      this.half === 1
        ? this.simTime - this.duration / 2
        : this.simTime - this.secondHalfStart - this.duration / 2;
    if (over <= 0) return 0;
    return Math.max(1, Math.ceil((over / this.duration) * 90));
  }

  /** Scoreboard clock: `37`, `45+2`, `90+1`. */
  clockText(): string {
    const added = this.addedMinutes();
    return added > 0 ? `${this.minute()}+${added}` : `${this.minute()}`;
  }

  pushEvent(type: EventType, side: Side | -1, text: string): void {
    this.events.push({ t: this.simTime, minute: this.minute(), type, side, text });
  }

  /** The stats row for the CURRENT occupant of a pitch slot (Phase 61):
   * gid → whoever's rosterIdx holds the slot right now. */
  stat(gid: number): PlayerMatchStats {
    const p = this.allPlayers[gid];
    return this.playerStats[p.side * ROSTER_SIZE + p.rosterIdx];
  }

  /**
   * A passing move ends (Phase 33): turnover, dead ball, shot or clear.
   * Long chains earn ONE feed line (failure mode 7 — the threshold keeps
   * them rare) and the match best feeds the season's longest-chain record.
   */
  endPassMove(side: Side): void {
    const n = this.passChain[side];
    if (n === 0) return;
    this.passChain[side] = 0;
    const team = this.teams[side];
    if (n > team.stats.bestPassChain) team.stats.bestPassChain = n;
    if (n >= PASS_MOVE_FEED_MIN) {
      this.pushEvent('info', side, `🎼 ${n}-pass move by ${team.info.name}!`);
    }
  }

  step(dt: number): void {
    if (this.finished) return;
    this.stepCount++;
    // Hard safety net: even a wedged state machine terminates deterministically.
    if (this.stepCount * dt > this.duration * 4) {
      this.endMatch();
      return;
    }

    if (this.phase === 'kickoff' || this.phase === 'goalPause' || this.phase === 'halftime') {
      this.phaseTimer -= dt;
      if (this.phaseTimer <= 0) {
        if (this.phase === 'kickoff') this.phase = 'playing';
        else if (this.phase === 'goalPause') this.setupKickoff(this.kickoffSide);
        else {
          this.half = 2;
          this.secondHalfStart = this.simTime;
          this.setupKickoff(1);
        }
      }
      return;
    }
    if (this.phase === 'fulltime') return;

    // ---- playing or restart (a restart is live: clock runs, players move) ----
    this.simTime += dt;

    for (const team of this.teams) {
      team.brainTimer -= dt;
      team.modeTime += dt;
      if (team.brainTimer <= 0) {
        // Game-state mentality (Phase 35): the gene view every brain and
        // mechanic reads is recomputed here — pure fn of score + clock +
        // (Phase 66) the coach's tinkerBias, which scales how HARD he
        // responds. Read from the RAW genome: personality isn't bent by
        // the underdog shift.
        const diff = this.score[team.side] - this.score[1 - team.side];
        team.mentality = mentalityOf(diff, this.minute(), team.info.genome.tinkerBias ?? 0.5);
        team.effGenome = applyMentality(team.baseGenome, team.mentality);
        // The visible switches earn ONE feed line each (failure mode 7) —
        // the COACH's calls since Phase 66 (N3). A stoic (tinker→0) never
        // crosses 0.8 at all: his silence is the personality showing.
        const coach = team.info.coachName;
        if (team.mentality.urgency > 0.8 && !team.surgeAnnounced) {
          team.surgeAnnounced = true;
          this.pushEvent('info', team.side, coach
            ? `⚡ ${coach} throws everyone forward!`
            : `⚡ ${team.info.name} throw everyone forward!`);
        }
        if (team.mentality.holding > 0.8 && !team.shutdownAnnounced) {
          team.shutdownAnnounced = true;
          this.pushEvent('info', team.side, coach
            ? `🧊 ${coach} shuts up shop`
            : `🧊 ${team.info.name} shut up shop`);
        }
        updateTeamBrain(team, this);
        team.brainTimer = TEAM_AI_INTERVAL;
      }
    }

    // FAIRNESS: within a frame, later-iterated players act on fresher state
    // (they see earlier kicks and reactions). Measured effect: the team
    // iterated second converted ~10pp more of its shots. Alternating the
    // iteration direction every step cancels the asymmetry, deterministically.
    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
    for (const p of order) {
      if (p.sentOff) continue;
      if (p.decisionTimer <= 0) {
        decidePlayer(p, this);
        p.decisionTimer = AI_INTERVAL;
      }
    }

    for (const p of order) {
      if (!p.sentOff) executeAction(p, this, dt);
    }
    for (const p of order) {
      if (!p.sentOff) p.physicsStep(dt);
    }
    this.resolveOverlaps();
    this.clampPlayersToPitch();
    // Kick protection (Phase 31.9): the clearance circle must survive the
    // hand-off — the restart clears ~0.2–0.5s before the taker's kick, and
    // in that gap defenders rushed the taker, so the launch (its first
    // ~2-3m fly at leg height, inside the deflect window) got blocked at
    // the boot. Corners were the loudest victim: probed deliveries left at
    // 19 m/s and were crawling at 8 m/s within metres of the flag. Real
    // law: opponents keep their distance until the ball is IN PLAY.
    if (this.fkWall && this.fkWall.until !== null && this.simTime > this.fkWall.until) {
      this.fkWall = null; // the ball has cleared the wall — break for the marks
    }
    if (this.restartKickGid !== null && this.restartKickKind !== null && this.restartKickKind !== 'penalty') {
      const taker = this.allPlayers[this.restartKickGid];
      const kickClear = this.restartKickKind === 'corner' || this.restartKickKind === 'freeKick' ? CORNER_CLEARANCE : RESTART_CLEARANCE;
      for (const o of this.teams[1 - taker.side].players) {
        if (o.sentOff) continue;
        if (this.fkWall?.gids.includes(o.gid)) continue; // the wall IS the clearance (Phase 32)
        const d = dist(o.pos, this.ball.pos);
        if (d < kickClear) {
          const dir = d < 1e-6 ? v2(-this.teams[taker.side].attackDir, 0) : norm(sub(o.pos, this.ball.pos));
          o.pos = add(this.ball.pos, scale(dir, kickClear));
          o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
          o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
          o.vel.x *= 0.2;
          o.vel.y *= 0.2;
        }
      }
    }
    if (this.phase === 'restart') this.stepRestart(dt);
    else this.stepBall(dt);

    // Possession only accrues in open play — restarts are dead-ball time,
    // so the calibrate "ball-in-play share" stays an honest metric.
    if (this.phase === 'playing' && this.possessionSide !== -1) {
      const holder = this.teams[this.possessionSide];
      holder.stats.possessionTime += dt;
      // Territory clock (Phase 27): the high-water mark only counts as beaten
      // by a real gain (+1.5m); after a retreat it erodes toward the ball so
      // re-won ground counts again. Holding station just ages the possession.
      const lx = holder.localX(this.ball.pos.x);
      if (lx > holder.progressLocalX + 1.5) {
        holder.progressLocalX = lx;
        holder.staleTime = 0;
      } else {
        holder.progressLocalX = Math.max(lx, holder.progressLocalX - 0.35 * dt);
        holder.staleTime += dt;
      }
    }

    this.trackAttackEntry();

    // Stale in-flight bookkeeping expires.
    if (this.pendingPass && this.simTime - this.pendingPass.t > 3.5) this.pendingPass = null;
    if (this.dribbleTouch && this.simTime > this.dribbleTouch.until) this.dribbleTouch = null;
    if (this.pendingShot && this.simTime - this.pendingShot.t > 3.0) {
      this.markShotOutcome('miss');
      this.pendingShot = null;
    }

    // Each half runs its own nominal length + its own stoppage (28.1) —
    // first-half added time no longer eats into the second half.
    if (this.half === 1 && this.simTime >= this.duration / 2) {
      if (this.refBlowsNow(this.duration / 2)) {
        this.endPassMove(0);
        this.endPassMove(1);
        this.phase = 'halftime';
        this.phaseTimer = 1.2;
        this.stoppageAnnounced = false;
        this.pushEvent('halftime', -1, 'Half-time');
        // The break is the classic substitution window (Phase 61); the
        // second-half kickoff will place the entrant into formation.
        this.trySubstitution(0);
        this.trySubstitution(1);
      }
    } else if (this.half === 2 && this.simTime >= this.secondHalfStart + this.duration / 2) {
      if (this.refBlowsNow(this.secondHalfStart + this.duration / 2)) this.endMatch();
    }
  }

  /**
   * Stoppage time (Phase 27.4): the half doesn't cut off mid-move. The
   * whistle waits for a safe break — no shot or pass in flight, no attack
   * into the final third, and a penalty must always be taken — up to
   * STOPPAGE_MAX seconds past the nominal end.
   */
  private refBlowsNow(nominal: number): boolean {
    // The whistle never blows a set piece AWAY (Phase 35 + the reported
    // danger-band cuts): an awarded penalty, corner, or walled free kick is
    // PLAYED — this is what makes the 90'+ keeper-up corner possible at
    // all. Bounded: restarts timeout, shots resolve in ~2s, and the
    // duration×4 safety net in step() is absolute.
    const setPiece =
      this.phase === 'restart' &&
      (this.restart!.kind === 'penalty' ||
        this.restart!.kind === 'corner' ||
        (this.restart!.kind === 'freeKick' && this.fkWall !== null));
    if (this.simTime >= nominal + STOPPAGE_MAX) {
      // Patience over: a ball IN FLIGHT or a live set piece still holds it
      // (the corner that waited for the keeper must land, or the theater
      // is cut at its climax). No keep-ball exploit: pendingPass clears on
      // every reception, and the whistle takes the gap between passes.
      return !(this.pendingShot !== null || this.pendingPass !== null || setPiece);
    }
    let holdOn = false;
    if (this.pendingShot || this.pendingPass) holdOn = true;
    else if (this.phase === 'restart') holdOn = setPiece;
    else if (this.possessionSide !== -1) {
      const t = this.teams[this.possessionSide];
      holdOn = t.localX(this.ball.pos.x) > 12; // live attack plays out
    }
    if (holdOn && !this.stoppageAnnounced) {
      this.stoppageAnnounced = true;
      this.pushEvent('info', -1, 'Stoppage time — the attack plays out');
    }
    return !holdOn;
  }

  /** Run the rest of the match headless. Same trajectory as watching it. */
  runToCompletion(): MatchResult {
    while (!this.finished) this.step(DT);
    return this.getResult();
  }

  getResult(): MatchResult {
    return {
      score: [this.score[0], this.score[1]],
      stats: [this.teams[0].stats, this.teams[1].stats],
      playerStats: this.playerStats,
      injuries: this.injuriesOut,
      events: this.events,
      duration: this.duration,
    };
  }

  /* ---------------- kicks (delegated to mechanics) ---------------- */

  shotQuality(p: Player): number {
    return mech.shotQuality(this, p);
  }
  performPass(p: Player, mate: Player, offsideExempt = false): void {
    mech.performPass(this, p, mate, offsideExempt);
  }
  performThroughBall(p: Player, runner: Player, lofted = false, offsideExempt = false): void {
    mech.performThroughBall(this, p, runner, lofted, offsideExempt);
  }
  performCross(p: Player, target: Player, offsideExempt = false, pull = 0.18, at?: V2): void {
    mech.performCross(this, p, target, offsideExempt, pull, at);
  }
  performKeeperThrow(p: Player, mate: Player): void {
    mech.performKeeperThrow(this, p, mate);
  }
  performLoftedPass(p: Player, mate: Player, offsideExempt = false): void {
    mech.performLoftedPass(this, p, mate, offsideExempt);
  }
  performShot(p: Player): void {
    mech.performShot(this, p);
  }

  performCutback(p: Player, mate: Player): void {
    mech.performCutback(this, p, mate);
  }
  performFreeKick(p: Player): void {
    mech.performFreeKick(this, p);
  }
  performClear(p: Player): void {
    mech.performClear(this, p);
  }

  /* ---------------- goal-channel telemetry (Phase 113) ---------------- */

  /**
   * Per-step band-entry tracker — the launch-anatomy probe's loop, in-engine.
   * Watches the carrier: a FRESH crossing into the final 15m with zero
   * goal-side outfielders is a breakaway entry, classified by what served it.
   * Pure observation of already-computed state; nothing reads the result but
   * the shot log.
   */
  private trackAttackEntry(): void {
    const o = this.ball.owner;
    // No owner (incl. his own pushed touch in flight) or dead ball: the
    // carry clock and any live entry simply persist — same as the probe.
    if (!o || this.phase !== 'playing') return;
    const team = this.teams[o.side];
    const ox = team.localX(o.pos.x);
    if (!this.carryStart || this.carryStart.gid !== o.gid) {
      this.carryStart = { gid: o.gid, t: this.simTime, x: ox };
      // Took over already inside the band (or is the keeper) — not a fresh
      // entry; only a crossing observed from OUTSIDE counts.
      this.bandInside = ox >= HALF_L - 15 || o.role === 'GK';
      // A turnover kills the other side's live entry — the attack it
      // classified is over.
      if (this.attackEntry && this.attackEntry.side !== o.side) this.attackEntry = null;
    }
    if (!this.bandInside && ox >= HALF_L - 15) {
      this.bandInside = true;
      // Breakaway only: zero goal-side outfielders (the walk-in pipe).
      const goalSide = this.teams[1 - o.side].players.some(
        (q) => q.role !== 'GK' && !q.sentOff && team.localX(q.pos.x) > ox,
      );
      if (!goalSide && this.restartKickGid !== o.gid) {
        this.attackEntry = { side: o.side, kind: this.classifyBandEntry(o, ox), t: this.simTime };
      }
    }
  }

  /** What LAUNCHED a fresh breakaway band entry (launch-anatomy classes;
   * lofted long balls fold into `through` — both are balls IN BEHIND — and
   * short-pass/loose service folds into `walkin`: the line was simply beaten). */
  private classifyBandEntry(p: Player, ox: number): GoalChannel {
    const cs = this.carryStart;
    if (cs && cs.gid === p.gid && this.simTime - cs.t > 2.2 && ox - cs.x > 9) return 'carry';
    const lp = this.lastCompletedPass;
    if (lp && lp.receiverGid === p.gid && this.simTime - lp.t < 3.5) {
      if (this.allPlayers[lp.passerGid].role === 'GK') return 'keeper';
      const kind =
        this.lastPassKind && this.simTime - this.lastPassKind.t < 3.5
          ? this.lastPassKind.kind
          : 'pass';
      if (kind === 'through' || kind === 'lofted') return 'through';
      if (kind === 'cross') return 'cross';
    }
    return 'walkin';
  }

  /**
   * The channel a shot by `shooter` would bank if it scores — priced at the
   * STRIKE (context is freshest there; a rebound re-prices on the live
   * entry). Priority: set piece → the live breakaway entry's launch class →
   * cross/cutback service → worked buildup.
   */
  goalChannelFor(shooter: Player): GoalChannel {
    const rk = this.lastRestartKick; // only ever corner / freeKick / penalty
    if (rk && rk.side === shooter.side && this.simTime - rk.t < 6) return 'setpiece';
    const e = this.attackEntry;
    if (e && e.side === shooter.side && this.simTime - e.t < 12) return e.kind;
    if (this.lastCutback && this.lastCutback.side === shooter.side && this.simTime - this.lastCutback.t < 5) {
      return 'cross';
    }
    const pk = this.lastPassKind;
    if (pk && pk.kind === 'cross' && this.simTime - pk.t < 2.5) return 'cross';
    return 'buildup';
  }

  /** Resolve the in-flight shot's timeline entry (first outcome wins). */
  markShotOutcome(outcome: 'goal' | 'saved' | 'miss'): void {
    const shot = this.pendingShot;
    if (!shot) return;
    const entry = this.shotLog[shot.logIndex];
    if (entry && entry.outcome === 'pending') entry.outcome = outcome;
  }

  /**
   * Low-level kick: releases the ball with velocity and a re-capture cooldown.
   * `loft` (Phase 28) is the vertical launch speed — 0 keeps it on the grass.
   */
  kickBall(p: Player, dir: V2, speed: number, loft = 0): void {
    const ball = this.ball;
    ball.owner = null;
    ball.lastTouch = p;
    ball.vel = scale(dir, speed);
    ball.pos = add(p.pos, scale(dir, 0.9));
    ball.z = 0;
    ball.vz = loft;
    ball.spin = 0; // plain kicks fly straight — curlKick re-sets after
    p.gkDistributing = false;
    p.kickCooldown = KICK_COOLDOWN;
    p.firstTouchWindow = 0; // any kick consumes the one-touch window
    // The kick starts the wall's release timer (Phase 32): the bodies hold
    // their line while the ball clears them, THEN break for their marks.
    if (this.fkWall && this.fkWall.until === null) this.fkWall.until = this.simTime + 0.7;
  }

  /** Give a player clean control of the ball, resolving pass bookkeeping. */
  giveBall(p: Player): void {
    // Offside (Phase 29): the flag frozen at kick time becomes an offence the
    // moment the flagged target touches the ball. Checked before ANY
    // bookkeeping — an offside "reception" is not a dribble or a completed
    // pass, it's a dead ball.
    const flagged = this.pendingPass;
    if (flagged && flagged.offside && p.side === flagged.side && p.gid === flagged.targetGid) {
      this.pendingPass = null;
      this.callOffside(p, flagged.offsideSpot ?? p.pos);
      return;
    }
    const ball = this.ball;
    ball.owner = p;
    ball.lastTouch = p;
    ball.vel = v2();
    ball.z = 0;
    ball.vz = 0;
    ball.spin = 0;
    const team = this.teams[p.side];

    // Settle on the ball: carry it briefly before the next decision instead of
    // one-touch ping-pong. Outfielders start driving forward immediately.
    // Back-pass law (Phase 32.2, 出球门将): a DELIBERATE teammate ball may
    // not be picked up — the keeper plays it with his FEET: pressable, no
    // hold, no box clearance, no calm reset. Saves, claims and loose
    // pickups keep the hands. This is what makes the ball-playing keeper
    // (and pressing him) possible at all.
    const backPass =
      this.pendingPass !== null &&
      this.pendingPass.side === p.side &&
      this.pendingPass.passerGid !== p.gid;
    // Re-collecting your own pushed touch is the SAME carry continuing
    // (Phase 36) — not a fresh dribble for the stats, and the next
    // decision comes quicker (the touch was the setup, not a reception).
    const recollect = this.dribbleTouch !== null && this.dribbleTouch.gid === p.gid;
    this.dribbleTouch = null;
    // Hands only inside the box (Phase 28.5, user report "门将出击到禁区外
    // 用手接球了"): a keeper plays with his FEET on a back-pass (by rule) AND
    // whenever he collects the ball OUTSIDE his own area — a sweeper who
    // rushed/chased off his line (GoalkeeperRush / ChaseBall are deliberately
    // un-clamped) may control and clear, but he may not scoop it up and hold.
    // Restart takers (goal kicks) keep their own quick-kick path. This one
    // gate covers every hands entry that funnels through giveBall — the loose
    // capture (tryCapture) and the high claim (tryAerial).
    const gkFeet =
      p.role === 'GK' &&
      this.restartKickGid !== p.gid &&
      (backPass || !this.inPenaltyBox(p.pos, p.side));
    if (p.role !== 'GK') {
      p.action = { type: 'Dribble', scores: p.action.scores };
      if (!recollect) team.stats.dribbles++;
      // The settle beat before the next push: the first decision after any
      // capture happens ON the ball (touchTimer ≥ the decision settle).
      // A continuing carry (recollect) chains faster — 一步一带 lives here:
      // regather, half a beat, next touch (36.1).
      p.touchTimer = (recollect ? 0.2 : 0.32) + (1 - p.attrs.dribbling) * 0.08;
    } else if (gkFeet) {
      p.action = { type: 'Dribble', scores: p.action.scores }; // at his feet, on the clock
    } else if (this.restartKickGid !== p.gid) {
      // Keeper hold (Phase 27.2): scoop it up and hold before distributing —
      // hands, not feet. Restart first touches (goal kicks) stay quick.
      // Game state prices the hold (Phase 35): a keeper protecting a lead
      // milks the clock; a keeper whose side is chasing gets it moving.
      p.gkHoldTimer = 1.1 * (1 + team.mentality.holding * 0.5 - team.mentality.urgency * 0.3);
      p.gkDistributing = true; // the release is deliberate (28.3)
      p.gkShapeWait = 0; // a fresh hold gets a fresh shape-wait budget (30.3)
    }
    // Snap decisions in shooting range (Phase 28.2): a receiver in front of
    // goal decides NOW — the first-time finish exists. Everywhere else the
    // settle touch stays (one-touch ping-pong was the original disease).
    const inShootingRange =
      p.role !== 'GK' &&
      team.localX(p.pos.x) > HALF_L - 24 &&
      dist(p.pos, team.oppGoal()) < 20;
    p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);
    // A keeper with the ball at his FEET is on the press's clock (32.2):
    // he moves it in a beat, he doesn't stroll on it like an outfielder.
    // A sweeper stranded outside his box (28.5) is on the same clock.
    if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);

    const pass = this.pendingPass;
    if (pass) {
      if (p.side === pass.side && p.gid !== pass.passerGid) {
        team.stats.passesCompleted++;
        this.passChain[p.side]++;
        // The give-and-go completed (Phase 34): the wall's return found the
        // bursting passer inside his license window.
        if (p.wallRun && this.simTime < p.wallRun.until && p.wallRun.partnerGid === pass.passerGid) {
          team.stats.oneTwos++;
          p.wallRun = null;
        }
        // The third-man release arrived (Phase 34).
        if (pass.bounce && p.gid === pass.targetGid) team.stats.thirdMan++;
        // The overlap release arrived WIDE (Phase 34). Position-gated only:
        // receivers brake to take the ball, so an in-stride velocity test
        // (tried) zeroed the count at the capture instant.
        if (team.overlapper === p.index && Math.abs(p.pos.y) > 11) team.stats.overlaps++;
        this.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, t: this.simTime };
        // 一脚出球 (Phase 31.9, user request): a PRESSURED intended receiver
        // plays the ball as it comes — decide now, and a pass kicked inside
        // the window carries a first-time noise penalty priced by technique
        // (mechanics). Pressure-triggered only: the 0.3s settle above stays
        // the default, or one-touch ping-pong (the original disease) is
        // back. High-tempo sides live closer to the edge and release under
        // looser pressure.
        if (!inShootingRange && p.role !== 'GK' && p.gid === pass.targetGid) {
          const trigger = 3.0 + team.genome.tempo * 1.5;
          let nearOpp = Infinity;
          for (const o of this.teams[1 - p.side].players) {
            if (o.sentOff) continue;
            const d = dist(o.pos, p.pos);
            if (d < nearOpp) nearOpp = d;
          }
          if (nearOpp < trigger) {
            p.decisionTimer = 0.07;
            p.firstTouchWindow = 0.28;
          }
        }
      } else if (p.side !== pass.side) {
        // No feed line (Phase 28.2): at ~25 per match, "X intercepts" drowned
        // the feed in noise (failure mode 7) — the stats panel carries the
        // count, the debug overlays show the moment.
        team.stats.interceptions++;
        this.stat(p.gid).recoveries++;
      }
      this.pendingPass = null;
    }
    if (this.pendingShot && p.side !== this.pendingShot.side) {
      this.markShotOutcome('miss'); // no-op if the keeper already logged a save
      this.pendingShot = null;
    }

    if (this.possessionSide !== p.side) {
      // The dispossessed side's passing move is over (Phase 33).
      this.endPassMove((1 - p.side) as Side);
      team.possessionGainedAt = this.simTime;
      team.resetProgress(team.localX(ball.pos.x));
      this.possessionSide = p.side;
      // Possession swung — both brains re-evaluate promptly.
      this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
      this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
    }
  }

  /* ---------------- ball physics ---------------- */

  private stepBall(dt: number): void {
    const ball = this.ball;
    if (ball.owner) {
      // Discrete touches (Phase 36, 可见的触球): an outfield carrier DRIVING
      // in open field pushes the ball ahead and chases it — the magnet-ball
      // glue below is only close control now (pressure, shielding, keepers,
      // restart takers). touchTimer ≥ the capture settle guarantees the
      // first decision happens ON the ball, so the pass game keeps its
      // timing and restart takers kick before a push can fire.
      const o = ball.owner;
      if (
        this.phase === 'playing' &&
        o.role !== 'GK' &&
        o.action.type === 'Dribble' &&
        o.touchTimer <= 0 &&
        o.gkHoldTimer <= 0 &&
        // A slow or turning carrier keeps the ball at his feet — pushes
        // belong to the DRIVE (walking pace = close control by definition).
        o.vel.x * o.vel.x + o.vel.y * o.vel.y > 2.5 * 2.5
      ) {
        let nearOpp = Infinity;
        for (const q of this.teams[1 - o.side].players) {
          if (q.sentOff) continue;
          const d = dist(q.pos, o.pos);
          if (d < nearOpp) nearOpp = d;
        }
        if (nearOpp > TOUCH_CONTROL_DIST) {
          mech.performDribbleTouch(this, o);
          return; // the ball is free — it integrates from next step
        }
      }
      // Dribble: the ball rides slightly ahead of the owner's heading — or
      // tight to the chest while a keeper holds it in their hands (27.2).
      // In-place writes (was add/scale/clone — 3 vectors per step); ball.pos
      // and ball.vel are never aliased, all other writers assign fresh objects.
      const carry = ball.owner.gkHoldTimer > 0 ? 0.3 : 0.85;
      ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * carry;
      ball.pos.y = ball.owner.pos.y + ball.owner.heading.y * carry;
      ball.vel.x = ball.owner.vel.x;
      ball.vel.y = ball.owner.vel.y;
      // Ball in the keeper's hands (Phase 28.1): opponents are held off the
      // same way a restart holds them — you cannot challenge a keeper in
      // possession, so let them RELEASE in peace too (the crowd used to
      // stand in the tackle circle waiting for the ball to touch grass).
      // The WHOLE distribution counts (Phase 31.9, user report "手拿球时
      // 对方疯狂抽动"): the shape-wait re-arms the hold in 0.25s quanta,
      // and in the timer==0 gaps between quanta the clearance died — 22%
      // of distribution time was gap, box intrusion ran 7× higher there,
      // and opponents surged in and got expelled at ~4Hz. gkDistributing
      // spans hand-to-kick, so the calm holds without gaps.
      if (ball.owner.gkHoldTimer > 0 || (ball.owner.role === 'GK' && ball.owner.gkDistributing)) {
        const gk = ball.owner;
        for (const o of this.teams[1 - gk.side].players) {
          if (o.sentOff) continue;
          const d = dist(o.pos, gk.pos);
          if (d < GK_HOLD_CLEARANCE) {
            const dir = d < 1e-6 ? v2(this.teams[1 - gk.side].attackDir, 0) : norm(sub(o.pos, gk.pos));
            o.pos = add(gk.pos, scale(dir, GK_HOLD_CLEARANCE));
            o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
            o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
            o.vel.x *= 0.2; // braced — no treadmill legs (28.3)
            o.vel.y *= 0.2;
          }
          // A held ball clears the BOX too (Phase 31.8, user call — same
          // deliberate calm-reset simplification as the offside goal kick;
          // the real law only forbids challenging). Same x-clamp as the
          // goal-kick hold: opponents ride the box edge until the release.
          if (this.inPenaltyBox(o.pos, gk.side)) {
            const attackDir = this.teams[gk.side].attackDir;
            o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);
            o.vel.x *= 0.2; // braced, like the circle clamp — no treadmill
            o.vel.y *= 0.2;
          }
        }
        return; // untackleable, unsmotherable — hands beat everything
      }
      mech.tryTackles(this);
      mech.tryTacticalFoul(this); // guards internally: owner may be gone
      mech.trySlideTackle(this); // Phase 110 — the recovery slide
      mech.trySmother(this);
      return;
    }
    // Magnus (Phase 37): sidespin rotates the velocity — a constant rate is
    // a circular arc, so every projection has an exact closed form. Spin
    // bleeds slowly in the air, fast on the grass, and dies on the bounce.
    if (ball.spin !== 0) {
      const a = ball.spin * dt;
      const c = Math.cos(a);
      const s = Math.sin(a);
      const vx = ball.vel.x;
      ball.vel.x = vx * c - ball.vel.y * s;
      ball.vel.y = vx * s + ball.vel.y * c;
      ball.spin *= Math.exp(-(ball.z > 0 ? 0.25 : 1.5) * dt);
      if (ball.spin > -0.02 && ball.spin < 0.02) ball.spin = 0;
    }
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;
    if (ball.z > 0 || ball.vz !== 0) {
      // Airborne (Phase 28): friction-free parabola, landing bounces. Ground
      // balls never enter this branch — their trajectories are untouched.
      ball.z += ball.vz * dt;
      ball.vz -= GRAVITY * dt;
      if (ball.z <= 0) {
        ball.z = 0;
        if (ball.vz < -BOUNCE_MIN_VZ) {
          ball.vz = -ball.vz * BALL_BOUNCE;
          ball.vel.x *= BOUNCE_DAMP;
          ball.vel.y *= BOUNCE_DAMP;
          ball.spin *= 0.55;
        } else {
          ball.vz = 0;
        }
      }
    } else {
      const fr = Math.exp(-BALL_FRICTION_K * dt);
      ball.vel.x *= fr;
      ball.vel.y *= fr;
    }
    // A ball already over the goal line is coasting clear (Phase 41.1): let it
    // run, freeze goal + out re-checks, and award the restart once it's had its
    // moment out of play.
    if (this.pendingOut !== null) {
      if (this.simTime >= this.pendingOut.until) {
        const o = this.pendingOut;
        this.pendingOut = null;
        this.awardRestart(o.kind, o.side, o.spot);
      }
      return;
    }
    if (this.checkGoal()) return;
    if (this.checkWoodwork()) return; // clanged back into play — not out
    if (this.checkOutOfPlay()) return;
    mech.tryShotBlock(this);
    mech.tryKeeperSave(this);
    if (ball.z > CONTROL_MAX_HEIGHT) {
      // Too high for feet: only heads (or the keeper's hands) can meet it.
      const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
      mech.tryAerial(this, order);
      return;
    }
    this.tryCapture();
  }

  /**
   * WOODWORK (Phase 100 — the queue-tail item that unlocks the recorded
   * crossbar sample): a ball crossing the goal plane in the OUTER band of a
   * post (|y| just past the frame) or just OVER the bar clangs back into
   * play instead of going out. Deliberately outer-half only: the inner
   * half of the frame stays a goal exactly as before — woodwork converts
   * former near-miss OUTS into live rebounds, so the goal rate is
   * untouched at first order and NO new rng draws are consumed (the
   * bounce is deterministic: reflected, damped, spin killed).
   */
  private checkWoodwork(): boolean {
    const ball = this.ball;
    if (this.phase !== 'playing' || ball.owner !== null) return false;
    if (Math.abs(ball.pos.x) <= HALF_L) return false;
    const sign = ball.pos.x > 0 ? 1 : -1;
    if (ball.vel.x * sign <= 2) return false; // must be DRIVEN out, not trickling
    // Interpolate the crossing point back to the plane (a 30 m/s shot
    // travels 0.5m in one step — the post-step position overshoots).
    const stepX = Math.abs(ball.vel.x) * DT;
    const frac = Math.min(1, (Math.abs(ball.pos.x) - HALF_L) / Math.max(stepX, 1e-6));
    const yAt = ball.pos.y - ball.vel.y * DT * frac;
    const zAt = Math.max(0, ball.z - ball.vz * DT * frac);
    const BAND = 0.17; // post/bar radius + ball radius
    const post = Math.abs(yAt) >= GOAL_WIDTH / 2 && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND && zAt < GOAL_HEIGHT;
    const bar = zAt >= GOAL_HEIGHT && zAt < GOAL_HEIGHT + BAND && Math.abs(yAt) < GOAL_WIDTH / 2 + BAND;
    if (!post && !bar) return false;
    // The clang: reflect off the plane, damped DEAD (the frame wins; a
    // lively 0.52 rebound fed the six-yard scramble and pushed calibrate
    // seed 2024 to 3.61 — the mechanic must not be a goal channel). Post
    // hits also ricochet OUTWARD toward the flank, off the frame's curve.
    ball.pos.x = sign * (HALF_L - (Math.abs(ball.pos.x) - HALF_L) * 0.4 - 0.01);
    ball.vel.x *= -0.4;
    if (post) ball.vel.y = Math.sign(yAt || 1) * Math.max(Math.abs(ball.vel.y) * 0.82, 3);
    else ball.vel.y *= 0.82;
    if (bar) ball.vz = -Math.abs(ball.vz) * 0.35; // off the bar it comes DOWN
    ball.spin = 0;
    // Credit the striker's side (sign>0 = the +x goal = team 0's attack).
    const shooterSide: Side = this.pendingShot?.side ?? (sign > 0 ? 0 : 1);
    this.pushEvent('woodwork', shooterSide, bar ? '🔩 Off the CROSSBAR!' : '🔩 Off the post!');
    this.markShotOutcome('miss'); // on the frame ≠ on target
    return true;
  }

  private checkGoal(): boolean {
    const ball = this.ball;
    if (ball.z >= GOAL_HEIGHT) return false; // over the bar (Phase 28)
    if (Math.abs(ball.pos.x) <= HALF_L || Math.abs(ball.pos.y) >= GOAL_WIDTH / 2) return false;
    // Team 0 attacks +x: ball past +x line = goal for team 0.
    const scorer: Side = ball.pos.x > 0 ? 0 : 1;
    this.onGoal(scorer);
    return true;
  }

  private onGoal(side: Side): void {
    const team = this.teams[side];
    // The move's feed line lands BEFORE the goal line it produced (Phase 33).
    this.endPassMove(side);
    this.score[side]++;
    team.stats.goals++;
    this.markShotOutcome(this.pendingShot?.side === side ? 'goal' : 'miss');
    // Bank the goal channel (Phase 113): the tag priced at the strike; an
    // own goal / untracked scramble falls back to `buildup`.
    const channel =
      this.pendingShot && this.pendingShot.side === side
        ? this.shotLog[this.pendingShot.logIndex]?.channel ?? 'buildup'
        : 'buildup';
    team.stats.goalChannels[channel]++;
    // Cutback payoff bookkeeping (Phase 31): a goal within 5s of the
    // pull-back credits the routine (the directional test's metric).
    if (this.lastCutback && this.lastCutback.side === side && this.simTime - this.lastCutback.t < 5) {
      team.stats.cutbackGoals++;
    }

    let scorerText: string;
    const shot = this.pendingShot;
    if (shot && shot.side === side) {
      team.stats.shotsOnTarget++;
      const shooter = this.allPlayers[shot.shooterGid]; // allPlayers is gid-indexed
      scorerText = shooter ? `${shooter.name} (${shooter.role})` : team.info.name;
      this.lastScorerGid = shot.shooterGid;
      this.stat(shot.shooterGid).goals++;
      if (shot.assistGid !== null) this.stat(shot.assistGid).assists++;
    } else if (this.ball.lastTouch && this.ball.lastTouch.side !== side) {
      scorerText = `${this.ball.lastTouch.name} (og)`;
      this.lastScorerGid = this.ball.lastTouch.gid;
      // Own goals credit nobody's tally.
    } else {
      scorerText = this.ball.lastTouch ? `${this.ball.lastTouch.name} (scramble)` : team.info.name;
      this.lastScorerGid = this.ball.lastTouch?.gid ?? null;
      if (this.ball.lastTouch) this.stat(this.ball.lastTouch.gid).goals++;
    }
    this.pushEvent(
      'goal',
      side,
      `GOAL! ${team.info.name} — ${scorerText}  ${this.score[0]}–${this.score[1]}`,
    );

    this.pendingShot = null;
    this.pendingPass = null;
    this.possessionSide = -1;
    this.ball.owner = null;
    this.ball.vel = v2();
    this.ball.z = 0;
    this.ball.vz = 0;
    this.kickoffSide = (1 - side) as Side;
    this.phase = 'goalPause';
    this.phaseTimer = 2.0;
  }

  /* ---------------- set pieces (Phase 14) ---------------- */

  /**
   * Real boundaries: over the touchline = kick-in against the last touch;
   * over the goal line (outside the mouth — goals were checked first) =
   * corner if the defending side touched it last, else goal kick.
   */
  private checkOutOfPlay(): boolean {
    const ball = this.ball;
    const lastSide: Side = this.ball.lastTouch?.side ?? 0;
    if (Math.abs(ball.pos.y) > HALF_W) {
      const sy = ball.pos.y >= 0 ? 1 : -1;
      const pos = v2(
        Math.max(-HALF_L + 1, Math.min(HALF_L - 1, ball.pos.x)),
        sy * (HALF_W - 0.4),
      );
      this.awardRestart('kickIn', (1 - lastSide) as Side, pos);
      return true;
    }
    if (Math.abs(ball.pos.x) > HALF_L) {
      const sx = ball.pos.x >= 0 ? 1 : -1;
      // Team 0 attacks +x: the +x goal line is defended by team 1.
      const defSide: Side = sx > 0 ? 1 : 0;
      // Don't snap to the spot the instant it crosses — let the ball coast out
      // (Phase 41.1) and place the restart a beat later. Goal detection is
      // frozen while pendingOut is set (see stepBall).
      const until = this.simTime + OUT_PLAY_COAST;
      if (lastSide === defSide) {
        const sy = ball.pos.y >= 0 ? 1 : -1;
        this.pendingOut = { kind: 'corner', side: (1 - defSide) as Side, spot: v2(sx * (HALF_L - 0.6), sy * (HALF_W - 0.6)), until };
      } else {
        this.pendingOut = { kind: 'goalKick', side: defSide, spot: v2(sx * (HALF_L - 7), 0), until };
      }
      return true;
    }
    return false;
  }

  /** Is `pos` inside `defSide`'s own penalty box? (Same box the pitch draws.) */
  inPenaltyBox(pos: V2, defSide: Side): boolean {
    if (Math.abs(pos.y) > BOX_WIDTH / 2) return false;
    const goalLineX = -this.teams[defSide].attackDir * HALF_L;
    return goalLineX > 0 ? pos.x >= goalLineX - BOX_DEPTH : pos.x <= goalLineX + BOX_DEPTH;
  }

  /** True while a ball is over the goal line and coasting clear before its
   * corner/goal-kick is placed (Phase 41.1) — lets the renderer and tests tell
   * this brief, deliberate out-of-play excursion from genuine live play. */
  get ballCoastingOut(): boolean {
    return this.pendingOut !== null;
  }

  /**
   * A failed tackle turned foul (Phase 20): free kick where the ball was —
   * or a penalty when the offender fouled inside their own box.
   */
  awardFoul(offender: Player, victim: Player): void {
    const side = victim.side; // the fouled team takes the kick
    this.teams[offender.side].stats.fouls++;
    if (this.inPenaltyBox(this.ball.pos, offender.side)) {
      this.teams[side].stats.penalties++;
      const goalLineX = -this.teams[offender.side].attackDir * HALF_L;
      const spot = v2(goalLineX - Math.sign(goalLineX) * PENALTY_SPOT_DIST, 0);
      this.pushEvent('foul', side, `PENALTY! ${offender.name} brings down ${victim.name} in the box`);
      this.awardRestart('penalty', side, spot);
    } else {
      // Advantage (Phase 27.2): failed-tackle fouls don't stop play — the
      // carrier kept the ball, so the whistle only ever interrupted the
      // attacking team's own move. The foul still counts and still draws
      // cards; box fouls above still concede a penalty. (The PROFESSIONAL
      // foul is different — the carrier goes down — see awardTacticalFoul.)
      // EXCEPT the danger band (Phase 32): with the direct free kick real,
      // the set piece out-values scrappy possession there — the ref brings
      // it back the way real ones do when the foul is in range. Everywhere
      // else the whistle stays swallowed (fluency, the 27.2 user call).
      const dGoal = dist(this.ball.pos, this.teams[side].oppGoal());
      if (this.teams[side].localX(this.ball.pos.x) > 0 && dGoal < 28 && dGoal > 9) {
        this.pushEvent('foul', side, `Foul by ${offender.name} on ${victim.name} — free kick in range`);
        this.awardRestart('freeKick', side, clone(this.ball.pos));
      } else {
        this.pushEvent('foul', side, `Foul by ${offender.name} on ${victim.name} — advantage`);
      }
    }
    this.maybeCard(offender);
    this.maybeInjure(victim);
  }

  /**
   * Cards (Phase 25): a foul is sometimes a booking (aggressive-marking sides
   * pick up more); a second booking — or a rare straight red — is a sending
   * off. Keepers are never carded: with no bench, a red keeper would break
   * the one-goalkeeper premise, and box fouls already concede a penalty.
   */
  private maybeCard(offender: Player): void {
    if (offender.role === 'GK') return;
    const team = this.teams[offender.side];
    // 0.16 → 0.12 in 29.1: professional fouls added their own near-automatic
    // bookings, so the base rate eased to keep cards at a watchable level.
    // Phase 62 (CARDS THAT BIND) reprices upward with a STEEPER aggression
    // slope: probe A found the whole league drawing only 52-67 yellows a
    // season (player median 0) — too thin for any suspension threshold to
    // bind — and club yellows coupling to style at just r≈0.18 (MA) /
    // 0.31 (press). Cards now carry systemic weight (bans), so the referee
    // prices the aggressive STYLE, not just the moment: base 0.16, slope
    // 0.28 (MA 0.3 ⇒ 0.24/foul, MA 0.9 ⇒ 0.41/foul). Referees still
    // MANAGE the game (29.1): a player already booked gets benefit of the
    // doubt on ordinary fouls (×0.45) — the second-yellow governor.
    let yellowP = 0.16 + team.genome.markingAggression * 0.28;
    if (offender.booked) yellowP *= 0.45;
    if (this.rng.chance(yellowP)) {
      team.stats.yellows++;
      this.stat(offender.gid).yellows++;
      if (offender.booked) {
        this.pushEvent('card', offender.side, `Second yellow — ${offender.name} is SENT OFF`);
        this.sendOff(offender);
      } else {
        offender.booked = true;
        this.pushEvent('card', offender.side, `${offender.name} is booked`);
      }
    } else if (this.rng.chance(0.009)) {
      this.pushEvent('card', offender.side, `STRAIGHT RED! ${offender.name} is sent off`);
      this.sendOff(offender);
    }
  }

  /**
   * Send a player off: park them on the apron beside their own half and
   * remove them from every sim interaction (all player loops skip `sentOff`).
   * The team plays a man short for the rest of the match.
   */
  sendOff(p: Player): void {
    if (p.sentOff) return;
    this.teams[p.side].stats.reds++;
    this.stat(p.gid).reds++; // the ban is PERSONAL (Phase 62)
    this.removeFromPitch(p);
  }

  /** Park a player on the apron and clear every assignment pointing at
   * him — send-offs and bench-less serious injuries (Phase 118) share
   * this. Tallies (reds) stay with the callers. */
  private removeFromPitch(p: Player): void {
    p.sentOff = true;
    const team = this.teams[p.side];
    p.pos = v2(-team.attackDir * 12, (p.side === 0 ? -1 : 1) * (HALF_W + 4));
    p.vel = v2();
    p.desiredVel = v2();
    p.action = { type: 'HoldPosition', scores: [] };
    // An injured CARRIER can leave mid-advantage (Phase 118) — the ball
    // he was holding becomes loose. Send-offs never own the ball.
    if (this.ball.owner === p) {
      this.ball.owner = null;
      this.possessionSide = -1;
    }
    // Clear stale assignments in both directions and make both brains
    // re-coordinate promptly (same pattern as possession swings).
    team.chasers.delete(p.index);
    team.marks.delete(p.index);
    team.runners.delete(p.index);
    const opp = this.teams[1 - p.side];
    for (const [own, target] of opp.marks) {
      if (target === p.index) opp.marks.delete(own);
    }
    this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
    this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);
  }

  /**
   * INJURIES (Phase 118, user-ratified defaults): a foul SOMETIMES hurts
   * the man it fouled — no reward channel for the fouler beyond what cards
   * and penalties already price; injury is a side effect of the foul
   * economy, never an incentive. Rare by design (~1-2 per club-season,
   * `injury-census` probe): 70% are KNOCKS — he plays on, visibly slower —
   * the rest come OFF now and miss 2-4 rounds through the suspension seam.
   * Tired legs and old legs are the frailest. Keepers only ever take
   * knocks: no reserve GK exists (the "keepers are never carded" premise).
   */
  private maybeInjure(victim: Player): void {
    if (victim.sentOff || victim.injured) return;
    // stamina 1 → ×0.6 … 0.05 → ×1.55; age 27 = ×1 ± 6%/year in [0.65, 1.5].
    const fatigue = 1.6 - victim.stamina;
    const age = Math.max(0.65, Math.min(1.5, 1 + ((victim.age ?? 27) - 27) * 0.06));
    if (!this.rng.chance(INJURY_BASE * fatigue * age)) return;
    this.teams[victim.side].stats.injuries++;
    if (victim.role === 'GK' || !this.rng.chance(0.3)) {
      victim.takeKnock();
      this.pushEvent('info', victim.side, `🚑 ${victim.name} picks up a knock — plays on`);
      return;
    }
    victim.injured = 'serious';
    const rounds = 2 + Math.floor(this.rng.range(0, 3)); // out 2-4 rounds
    this.injuriesOut[victim.side * ROSTER_SIZE + victim.rosterIdx] = rounds;
    this.pushEvent('info', victim.side, `🚑 ${victim.name} can't continue — stretchered off`);
    this.forceSubstitution(victim);
  }

  /** The injury sub (Phase 118): bypasses the rotation threshold — this
   * man is coming off NOW. Same bench budget and like-for-like pick as
   * trySubstitution; with nothing left he leaves anyway and the side
   * plays short (the send-off geometry, no red, no tally). */
  private forceSubstitution(out: Player): void {
    const team = this.teams[out.side];
    const available = team.bench.filter((b) => !b.used);
    if (team.subsUsed < SUBS_MAX && available.length > 0) {
      const sub = available.find((b) => b.role === out.role) ?? available[0];
      sub.used = true;
      team.subsUsed++;
      const offName = out.name;
      out.becomeSub(sub, v2(out.side === 0 ? -1.2 : 1.2, HALF_W - 0.6));
      out.decisionTimer = 0.05;
      team.policies[out.index] = sub.policy;
      this.stat(out.gid).apps = 1;
      this.pushEvent('info', out.side, `🔄 ${sub.name} on for the injured ${offName}`);
      return;
    }
    this.removeFromPitch(out);
  }

  /**
   * The professional foul (Phase 29.1): a beaten defender hauls down a
   * breakaway carrier from behind. Unlike the failed-tackle foul (advantage
   * — the carrier KEPT the ball there), this one kills the move dead, so
   * the whistle genuinely blows: free kick where the carrier went down, and
   * the cynical foul is a near-automatic booking — the last man denying a
   * clear run occasionally sees straight red.
   */
  awardTacticalFoul(offender: Player, victim: Player): void {
    const team = this.teams[offender.side];
    team.stats.fouls++;
    this.pushEvent('foul', victim.side, `Cynical! ${offender.name} hauls down ${victim.name} on the break`);
    victim.stunTimer = 0.8; // brought down — picks himself up as the kick is set
    victim.kickCooldown = 0.4;
    if (offender.role !== 'GK') {
      if (this.rng.chance(0.03)) {
        this.pushEvent('card', offender.side, `STRAIGHT RED! ${offender.name} is sent off for the professional foul`);
        this.sendOff(offender);
      } else if (this.rng.chance(0.52)) {
        team.stats.yellows++;
        this.stat(offender.gid).yellows++;
        if (offender.booked) {
          this.pushEvent('card', offender.side, `Second yellow — ${offender.name} is SENT OFF`);
          this.sendOff(offender);
        } else {
          offender.booked = true;
          this.pushEvent('card', offender.side, `${offender.name} is booked for the cynical foul`);
        }
      }
    }
    const pos = v2(
      Math.max(-HALF_L + 2, Math.min(HALF_L - 2, this.ball.pos.x)),
      Math.max(-HALF_W + 1, Math.min(HALF_W - 1, this.ball.pos.y)),
    );
    this.awardRestart('freeKick', victim.side, pos);
    this.maybeInjure(victim); // hauled down hard (Phase 118)
  }

  /**
   * Offside whistle (Phase 29 → 31.6): stat against the offender's team,
   * feed line, and the ball to the DEFENDERS' KEEPER as a goal kick.
   * DELIBERATE law simplification (user call, 2026-07-12): the real award
   * is an indirect free kick at the offence spot, but at this match scale
   * that read as "a scrambly free kick somewhere in the defensive third" —
   * the goal-kick restart (keeper takes it, box clears, the team WAITS for
   * shape) is the calm reset the flag is FOR. The 🚩 offside flag keeps
   * the UI honest about why the keeper has the ball.
   */
  callOffside(offender: Player, _spot: V2): void {
    const attTeam = this.teams[offender.side];
    attTeam.stats.offsides++;
    const defSide = (1 - offender.side) as Side;
    // The trap school's visible face (Phase 115, the 109 debt): when a
    // committed trap side (the 'Offside trap' nameplate threshold) wins the
    // flag, the feed credits the SCHOOL, not the runner's error. Same one
    // line either way — no feed spam. Read from the RAW genome: identity,
    // not the mentality-bent view.
    const trap = this.teams[defSide].info.genome.trapBias ?? 0.5;
    this.pushEvent('foul', defSide, trap > 0.72
      ? `🪤 The trap springs — ${offender.name} caught by the ${this.teams[defSide].info.name} line`
      : `Offside — ${offender.name} (${attTeam.info.name})`);
    const goalLineX = -this.teams[defSide].attackDir * HALF_L;
    const pos = v2(goalLineX - Math.sign(goalLineX) * 7, 0);
    this.awardRestart('goalKick', defSide, pos);
    this.restart!.offside = true; // the UI labels the dead ball 🚩 offside
  }

  private awardRestart(kind: RestartKind, side: Side, pos: V2): void {
    // A free kick is always placed ON the pitch (Phase 46): a whistle can
    // catch the ball marginally over a line mid-scramble, and an unclamped
    // spot parked the dead ball out of bounds through the whole setup
    // (probed: x=45.06 for the full 8s timer). Refs put it on the line.
    if (kind === 'freeKick') {
      pos = v2(
        Math.max(-HALF_L + 0.2, Math.min(HALF_L - 0.2, pos.x)),
        Math.max(-HALF_W + 0.2, Math.min(HALF_W - 0.2, pos.y)),
      );
    }
    const team = this.teams[side];
    // A shot that went out is a miss; any pass in flight is dead.
    this.markShotOutcome('miss');
    this.pendingShot = null;
    this.pendingPass = null;
    // The whistle ends any passing move (Phase 33).
    this.endPassMove(0);
    this.endPassMove(1);
    // A dead ball ends any corner crash still running (Phase 31.9).
    this.teams[0].cornerCrash = null;
    this.teams[1].cornerCrash = null;

    this.ball.owner = null;
    this.ball.pos = clone(pos);
    this.ball.vel = v2();
    this.ball.z = 0;
    this.ball.vz = 0;

    // The restart team is "in possession" for shape/marking purposes.
    this.possessionSide = side;
    team.possessionGainedAt = this.simTime;
    team.resetProgress(team.localX(pos.x));
    this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
    this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);

    if (kind === 'corner') {
      team.stats.corners++;
      this.pushEvent('corner', side, `Corner — ${team.info.name}`);
    }

    this.restart = { kind, side, pos: clone(pos), timer: 0, takerGid: this.pickTaker(kind, side, pos) };
    this.phase = 'restart';

    // Substitutions happen at dead balls (Phase 61) — after the taker is
    // picked, so the man walking over is never the man walking off.
    this.trySubstitution(0);
    this.trySubstitution(1);

    // Free-kick wall (Phase 32): a danger-zone FK gets 2–3 defending
    // bodies assigned to the ball–goal line. Nearest outfielders take the
    // duty (they can actually arrive during setup); closer kicks earn the
    // bigger wall.
    this.fkWall = null;
    if (kind === 'freeKick') {
      const goal = v2(this.teams[side].attackDir * HALF_L, 0);
      const dGoal = dist(pos, goal);
      if (dGoal < 30 && dGoal > 8) {
        const defSide = (1 - side) as Side;
        const wallers = this.teams[defSide].players
          .filter((p) => p.role !== 'GK' && !p.sentOff)
          .map((p) => ({ p, d: dist(p.pos, pos) }))
          .sort((a, b) => a.d - b.d || a.p.index - b.p.index)
          .slice(0, dGoal < 19 ? 3 : 2);
        if (wallers.length > 0) {
          this.fkWall = { gids: wallers.map((w) => w.p.gid), pos: clone(pos), side: defSide, until: null };
        }
      }
    }
  }

  /**
   * The SUBSTITUTION (Phase 61, N2 — rotation as an EVOLVABLE strategy).
   * The substrate provides only the laws-of-the-game frame: subs happen
   * at dead balls, at most SUBS_MAX per match, no re-entry, keepers stay.
   * Everything strategic is DNA: WHEN is the coach's `rotationBias` read
   * as a fatigue threshold; WHO comes off is simply the tiredest body
   * below it; WHO comes on prefers the like-for-like nominal role — and
   * which attrs sit on the bench at all is the roster budget's evolvable
   * allocation (a deep bench is paid for by a shallower XI). Deterministic:
   * no rng draws, pure sim state.
   */
  private trySubstitution(side: Side): void {
    const team = this.teams[side];
    if (team.subsUsed >= SUBS_MAX) return;
    const available = team.bench.filter((b) => !b.used);
    if (available.length === 0) return;
    // rotationBias 0 → threshold 0.25 (ride the XI); 1 → 0.75 (carousel).
    const threshold = 0.25 + (team.info.genome.rotationBias ?? 0.5) * 0.5;
    let out: Player | null = null;
    for (let i = 1; i < TEAM_SIZE; i++) {
      const p = team.players[i];
      if (p.sentOff) continue;
      if (this.restart !== null && this.restart.takerGid === p.gid) continue;
      if (p.stamina >= threshold) continue;
      if (out === null || p.stamina < out.stamina) out = p;
    }
    if (out === null) return;
    const sub = available.find((b) => b.role === out!.role) ?? available[0];
    sub.used = true;
    team.subsUsed++;
    const offName = out.name;
    // Enter from the touchline by the halfway line (the bench side).
    out.becomeSub(sub, v2(side === 0 ? -1.2 : 1.2, HALF_W - 0.6));
    out.decisionTimer = 0.05; // think on arrival, not a stale slot's cadence
    team.policies[out.index] = sub.policy;
    this.stat(out.gid).apps = 1;
    // The coach's call by name (Phase 66, N3) — the club keeps the credit
    // only when no coach travels with the team sheet (ad-hoc, old replays).
    const coach = team.info.coachName;
    this.pushEvent('info', side, coach
      ? `🔄 ${coach} sends on ${sub.name} for ${offName}`
      : `🔄 ${team.info.name}: ${sub.name} on for ${offName}`);
  }

  /**
   * GK takes goal kicks; the best finisher steps up for penalties;
   * otherwise the nearest outfielder walks over.
   */
  private pickTaker(kind: RestartKind, side: Side, pos: V2): number {
    const team = this.teams[side];
    if (kind === 'goalKick') return team.goalkeeper.gid;
    // Only outfielders still on the pitch take kicks; if (absurdly) all four
    // are sent off, the keeper steps up so resolution stays total.
    const eligible = team.players.filter((p) => p.role !== 'GK' && !p.sentOff);
    if (eligible.length === 0) return team.goalkeeper.gid;
    if (kind === 'penalty') {
      let taker = eligible[0];
      for (const p of eligible) {
        if (p.attrs.finishing > taker.attrs.finishing) taker = p;
      }
      return taker.gid;
    }
    // A danger-zone free kick belongs to the SPECIALIST (Phase 32): the
    // best striker of a dead ball steps up — among those who can ARRIVE.
    // An unbounded pick summoned the far full-back and the 6s failsafe
    // handed him the ball 6m short of the spot (probed: the strike left
    // from the wrong geometry entirely).
    if (kind === 'freeKick') {
      const goal = v2(this.teams[side].attackDir * HALF_L, 0);
      if (dist(pos, goal) < 30) {
        const reachable = eligible.filter((p) => dist(p.pos, pos) < 26);
        if (reachable.length > 0) {
          let taker = reachable[0];
          let bestS = -Infinity;
          for (const p of reachable) {
            const s = p.attrs.finishing + p.attrs.passing * 0.5;
            if (s > bestS) {
              bestS = s;
              taker = p;
            }
          }
          return taker.gid;
        }
      }
    }
    let best = eligible[0];
    let bestD = Infinity;
    for (const p of eligible) {
      const d = dist(p.pos, pos);
      if (d < bestD) {
        best = p;
        bestD = d;
      }
    }
    return best.gid;
  }

  /**
   * A restart is live play with a dead ball: the taker walks to the spot
   * (their brain chases the stationary ball), defenders reshape but are held
   * out of the clearance circle, and once the taker arrives (or a failsafe
   * timeout passes) they get the ball with a must-kick first touch.
   */
  private stepRestart(dt: number): void {
    const r = this.restart!;
    r.timer += dt;
    const ball = this.ball;
    ball.owner = null;
    ball.pos = clone(r.pos);
    ball.vel = v2();
    ball.z = 0;
    ball.vz = 0;

    // Hold everyone who isn't part of the restart out of the clearance
    // circle (slide along its edge). Penalties clear a wider circle and it
    // applies to BOTH teams — only the taker and the defending keeper (who
    // stands on the line, outside the circle) are near the ball.
    const clearance =
      r.kind === 'penalty' ? PENALTY_CLEARANCE
      // Corners AND free kicks use the real-law 9.15m (Phase 31.9/32): at
      // 6m the FK arc had to float so high the deep defenders beat it to
      // the drop — the flatter flight over a law-distance wall is a shot.
      : r.kind === 'corner' || r.kind === 'freeKick' ? CORNER_CLEARANCE
      : RESTART_CLEARANCE;
    for (const o of this.allPlayers) {
      if (o.sentOff || o.gid === r.takerGid) continue;
      // Strikers HOLD THE LINE at their own goal kicks (Phase 71, user
      // report "站到对面球门里…开大脚完全没有越位" + the ruling that goal
      // kicks now play under normal offside): campers stranded deep by the
      // previous attack get walked back to the line during the setup, so
      // the punt is a flick-on contest, not a goalmouth cherry-pick. Must
      // run BEFORE the same-side skip below (teammates are otherwise free).
      if (r.kind === 'goalKick' && o.side === r.side && o.role !== 'GK') {
        const team = this.teams[r.side];
        const line = offsideLineLocalX(team, this.teams[1 - r.side].players, team.localX(this.ball.pos.x));
        const lx = team.localX(o.pos.x);
        if (lx > line - 0.3) {
          o.pos.x = (line - 0.3) * team.attackDir;
          o.vel.x *= 0.2; // braced at the line, like every restart clamp
        }
      }
      if (o.side === r.side && r.kind !== 'penalty') continue; // only penalties hold teammates
      if (o.side !== r.side && r.kind === 'penalty' && o.role === 'GK') continue; // keeper keeps the line
      // Wall members pass freely (Phase 32): their slot sits on the GOAL
      // side of the ball, so the walk to the wall crosses the circle — the
      // radial clamp read as a glass wall and no wall ever formed.
      if (this.fkWall?.gids.includes(o.gid)) continue;
      const d = dist(o.pos, r.pos);
      if (d < clearance) {
        const dir = d < 1e-6 ? v2(-this.teams[r.side].attackDir, 0) : norm(sub(o.pos, r.pos));
        o.pos = add(r.pos, scale(dir, clearance));
        o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
        o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
        // Braced at the line (Phase 28.3): kill the inward velocity too, or
        // the run animation plays while the clamp holds them still — legs
        // sprinting on a treadmill at the edge of the circle.
        o.vel.x *= 0.2;
        o.vel.y *= 0.2;
      }
      // Goal kicks (Phase 27.3): opponents must be OUT OF THE BOX until the
      // kick is taken — held at the edge, not camped on the six-yard line.
      if (r.kind === 'goalKick' && o.side !== r.side && this.inPenaltyBox(o.pos, r.side)) {
        const attackDir = this.teams[r.side].attackDir;
        o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);
        o.vel.x *= 0.2; // braced, like the circle clamp — no treadmill
        o.vel.y *= 0.2;
      }
    }

    const taker = this.allPlayers[r.takerGid];
    // Corner routine (Phase 31): once the defensive picture has ~formed,
    // the taking side reads the box and commits to a routine — the runner
    // licenses and crash spots key off it for the rest of the setup.
    if (r.kind === 'corner' && r.routine === undefined && r.timer > 0.6) {
      r.routine = pickCornerRoutine(this, r);
    }
    // Kick-ins and corners breathe (Phase 28.1): the taker settles the ball
    // and both teams get a beat to shape up — instant touchline restarts
    // read as chaos, and the box picture needs time to form for a cross.
    const minSetup =
      r.kind === 'kickIn' ? 1.8
      : r.kind === 'corner' ? 2.0
      // A danger FK breathes (Phase 32): the wall needs ~2s to form and the
      // set-piece read as instant chaos without the pause. Quick option below.
      : r.kind === 'freeKick' && this.fkWall ? 2.2
      : RESTART_MIN_SETUP;
    let ready = dist(taker.pos, r.pos) < 1.3 && r.timer >= minSetup;
    // The QUICK free kick (Phase 32): if the taker arrives fast, the wall
    // has not formed yet, and an open teammate exists, play it NOW — real
    // football's punishment for a slow defensive reset.
    if (!ready && r.kind === 'freeKick' && this.fkWall && r.timer < 0.8 && dist(taker.pos, r.pos) < 1.3) {
      const goal = v2(this.teams[r.side].attackDir * HALF_L, 0);
      const wallCenter = add(r.pos, scale(norm(sub(goal, r.pos)), CORNER_CLEARANCE));
      let wallFormed = false;
      for (const gid of this.fkWall.gids) {
        if (dist(this.allPlayers[gid].pos, wallCenter) < 4) {
          wallFormed = true;
          break;
        }
      }
      if (!wallFormed) {
        // A CLEARLY open mate AHEAD of the ball only: half the danger FKs
        // went quick at looser gates and the wall-and-curler spectacle
        // never happened — a sideways quick kick is worth less than the
        // placed strike, so only a forward outlet justifies skipping it.
        const takerTeam = this.teams[r.side];
        for (const mate of takerTeam.players) {
          if (mate.gid === taker.gid || mate.sentOff) continue;
          if (takerTeam.localX(mate.pos.x) <= takerTeam.localX(r.pos.x) + 2) continue;
          if (opennessOf(mate, this.teams[1 - r.side].players) > 0.85) {
            ready = true;
            break;
          }
        }
      }
    }
    // The keeper WAITS for shape (Phase 30 step 3): a goal kick is not
    // struck until the outfielders settle near their attacking spots — the
    // kick finds SET receivers instead of gifting a midfield scramble.
    // Timeout-capped (pure sim-state, invariant 3); RESTART_TIMEOUT is the
    // outer failsafe either way.
    if (ready && r.kind === 'goalKick' && r.timer < minSetup + 4 && !shapeReady(this.teams[r.side], ball)) {
      ready = false;
    }
    // The corner WAITS for its crashers (Phase 31 — the 30.3 pattern): a
    // delivery into empty zones is a delivery wasted (failure mode 14), so
    // the taker stands over the ball until at least two licensed runners
    // are attacking their crash spots. Timeout-capped like everything else.
    // The free kick WAITS for its wall (Phase 32, the corner crasher-wait
    // pattern): a reachable specialist arrives inside 2s while the wall
    // bodies may need 3 — striking early made the set piece a formality.
    // ON THEIR SLOTS (<1.5m), not merely nearby: a waller still 2m short
    // stands exactly where the climb crosses the header band and free-
    // headed the kick (probed at z 2.3-2.5, six seeds in thirty).
    // Timeout-capped; the QUICK option above already beat this gate.
    if (ready && r.kind === 'freeKick' && this.fkWall && r.timer < minSetup + 3) {
      const goal = v2(this.teams[r.side].attackDir * HALF_L, 0);
      const slots = fkWallSlots(r.pos, goal, this.fkWall.gids.length);
      let set = 0;
      this.fkWall.gids.forEach((gid, i) => {
        if (dist(this.allPlayers[gid].pos, slots[i]) < 1.5) set++;
      });
      if (set < Math.min(2, this.fkWall.gids.length)) ready = false;
    }
    if (ready && r.kind === 'corner' && r.timer < minSetup + 3.5) {
      const team = this.teams[r.side];
      const spots = cornerCrashSpots(r.routine, team.attackDir, r.pos.y);
      const ranked = [...team.runners].sort((a, b) => a - b);
      let set = 0;
      for (const idx of ranked) {
        const p = team.players[idx];
        if (dist(p.pos, spots[ranked.indexOf(idx) % 3]) < 7) set++;
      }
      if (set < Math.min(2, ranked.length)) ready = false;
    }
    // 门将上前 (Phase 35): the taker WAITS for his sprinting keeper — the
    // broadcast moment. The chase positioning already carried him to
    // halfway, so the last ~45m fit inside the extended window.
    const keeperUpWait = r.kind === 'corner' && this.teams[r.side].keeperUp;
    if (keeperUpWait && r.timer < 8) {
      const team = this.teams[r.side];
      if (team.localX(team.goalkeeper.pos.x) < HALF_L - 24) ready = false;
    }
    if (ready || r.timer >= (keeperUpWait ? 8.5 : RESTART_TIMEOUT)) {
      this.restart = null;
      this.phase = 'playing';
      this.restartKickGid = taker.gid;
      this.restartKickKind = r.kind;
      this.restartKickRoutine = r.kind === 'corner' ? r.routine ?? null : null;
      // Corner crash state survives the hand-off (Phase 31.9): the taker's
      // kick is still ~0.2–0.5s away and the delivery flies ~1.6s more —
      // without this, the licenses died HERE and the crashers turned back
      // toward their formation spots before the ball was struck.
      if (r.kind === 'corner') {
        const team = this.teams[r.side];
        team.cornerCrash = {
          routine: r.routine ?? 'farPost', y: r.pos.y, until: this.simTime + 2.8,
          runners: [...team.runners], arriver: team.arriver,
        };
      }
      this.giveBall(taker);
      taker.decisionTimer = 0.12; // kick promptly (giveBall's settle is for open play)
    }
  }

  private tryCapture(): void {
    const ball = this.ball;
    const speed = Math.hypot(ball.vel.x, ball.vel.y);
    let best: Player | null = null;
    let bestD = Infinity;
    let deflector: Player | null = null;
    let deflectorD = Infinity;
    // Lane anticipation was always meant for drilled PASSES, not shots
    // ("non-shot" below) — shots left the foot at 27 m/s, above the window.
    // But friction decays a shot into 14–24 m/s within ~5m of flight, and
    // once formations parked bodies on every shot path (Phase 30), the legs
    // silently swallowed the league's goals (measured: conversion ~28% of
    // on-target while saveP said ~50%). A shot in flight is the KEEPER's
    // problem; blocks want lane-aware shot selection first (roadmap).
    const shotInFlight = this.pendingShot !== null && !this.pendingShot.resolved;
    const deflectable = speed > CONTROL_MAX_SPEED && speed <= DEFLECT_MAX_SPEED && !shotInFlight;
    // Alternate scan direction so equal-distance ties don't favor one team.
    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
    for (const p of order) {
      if (p.sentOff || p.kickCooldown > 0 || p.stunTimer > 0) continue;
      // Same cheap reject as resolveOverlaps: |dx| ≥ radius ⇒ d ≥ radius.
      const dx = p.pos.x - ball.pos.x;
      if (dx >= CONTROL_RADIUS || dx <= -CONTROL_RADIUS) continue;
      const dy = p.pos.y - ball.pos.y;
      if (dy >= CONTROL_RADIUS || dy <= -CONTROL_RADIUS) continue;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d >= CONTROL_RADIUS) continue;
      // The cushioned trap (Phase 31.7, user report "长球停不住"): the
      // pass's INTENDED receiver is set for the ball and may take down a
      // driven delivery a bystander can't — the 30.5 driven switch lands
      // at ~19.5 m/s, above CONTROL_MAX_SPEED, so it skipped past every
      // winger it was aimed at. attemptFirstTouch prices the attempt (the
      // fail chance grows with speed and caps at 0.4, so hot deliveries
      // still squirt plenty); interceptors keep the old ceiling, so lane
      // dynamics don't change.
      const intended =
        this.pendingPass !== null &&
        this.pendingPass.targetGid === p.gid &&
        this.pendingPass.side === p.side;
      // 22 → 24 (31.8, user report "门将开长球穿模接不到"): a 40m goal
      // kick arrives at ~21 m/s horizontal with a steep drop — the ball
      // sailed THROUGH the target's model and skipped away untouchable.
      // 24 matches the through-ball pace cap: every delivery the game
      // DESIGNS is takeable by its intended man, priced by the touch roll
      // (a dropping ball's vz counts extra there, so long kicks still get
      // away plenty — and the aerial duel fires first when contested).
      const maxSpeed =
        p.role === 'GK' ? GK_CONTROL_MAX_SPEED : intended ? 24 : CONTROL_MAX_SPEED;
      if (speed <= maxSpeed) {
        if (d < bestD) {
          best = p;
          bestD = d;
        }
      } else if (deflectable && d < deflectorD) {
        deflector = p;
        deflectorD = d;
      }
    }
    // First touch (Phase 27): a firm ball can get away from the receiver —
    // pressing and blind-side receptions turn into real turnovers.
    if (best) {
      // Reaction gate (Phase 59): a BYSTANDER only gets a foot on a live
      // pass he can react to — priced by ball speed and blind-side arrival,
      // the same principle as tryDeflection's stretch. The intended
      // receiver is SET for it (exempt), and a dead/loose ball (no pass in
      // flight) keeps the old scramble physics. A failed gate commits the
      // step (kickCooldown) — the ball beat him, no second bite.
      const intendedBest =
        this.pendingPass !== null &&
        this.pendingPass.targetGid === best.gid &&
        this.pendingPass.side === best.side;
      if (!intendedBest && this.pendingPass !== null && speed > 7) {
        const bx = ball.vel.x / speed;
        const by = ball.vel.y / speed;
        const blind = (1 + (bx * best.heading.x + by * best.heading.y)) / 2;
        const pContact = Math.min(0.95, Math.max(
          0.1,
          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),
        ));
        if (!this.rng.chance(pContact)) {
          best.kickCooldown = 0.3;
          return;
        }
      }
      if (mech.attemptFirstTouch(this, best)) this.giveBall(best);
      return;
    }
    // Nobody can control it — but a player in the path of a drilled (non-shot)
    // ball can stick a leg in and knock it loose (Phase 27 lane anticipation).
    if (deflector) mech.tryDeflection(this, deflector);
  }

  /* ---------------- player constraints ---------------- */

  private resolveOverlaps(): void {
    const ps = this.allPlayers;
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i];
      if (a.sentOff) continue;
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j];
        if (b.sentOff) continue;
        // Cheap reject before the sqrt: √(x²+y²) ≥ |x| holds bitwise in IEEE
        // round-to-nearest, so |dx| or |dy| ≥ PLAYER_MIN_DIST guarantees the
        // d-check below would continue anyway. Most of the 45 pairs exit here.
        const dx = a.pos.x - b.pos.x;
        if (dx >= PLAYER_MIN_DIST || dx <= -PLAYER_MIN_DIST) continue;
        const dy = a.pos.y - b.pos.y;
        if (dy >= PLAYER_MIN_DIST || dy <= -PLAYER_MIN_DIST) continue;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d >= PLAYER_MIN_DIST) continue;
        if (d < 1e-6) {
          a.pos.x += 0.02 * (i + 1);
          a.pos.y += 0.01;
          continue;
        }
        // Flat form of the old norm/scale/add push — same op order, in place.
        const k = (PLAYER_MIN_DIST - d) / 2;
        const px = (dx / d) * k;
        const py = (dy / d) * k;
        // A keeper stands their ground in their own box against opponents
        // (Phase 28): the carrier bounces off — nobody bulldozes the keeper
        // back into the net a half-push at a time.
        const gkA = a.role === 'GK' && b.side !== a.side && this.inPenaltyBox(a.pos, a.side);
        const gkB = b.role === 'GK' && a.side !== b.side && this.inPenaltyBox(b.pos, b.side);
        if (gkA && !gkB) {
          b.pos.x -= px * 2;
          b.pos.y -= py * 2;
        } else if (gkB && !gkA) {
          a.pos.x += px * 2;
          a.pos.y += py * 2;
        } else {
          a.pos.x += px;
          a.pos.y += py;
          b.pos.x -= px;
          b.pos.y -= py;
        }
      }
    }
  }

  private clampPlayersToPitch(): void {
    for (const p of this.allPlayers) {
      if (p.sentOff) continue; // parked on the apron, outside the pitch
      p.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, p.pos.x));
      p.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, p.pos.y));
    }
  }

  /* ---------------- phases ---------------- */

  private setupKickoff(kickSide: Side): void {
    this.phase = 'kickoff';
    this.phaseTimer = 0.9;
    this.kickoffSide = kickSide;
    this.pendingPass = null;
    this.markShotOutcome('miss');
    this.pendingShot = null;
    this.lastCompletedPass = null;
    this.restart = null; // a restart pending at half-time is simply not taken
    this.pendingOut = null; // drop any ball still coasting out (e.g. at the whistle)
    this.restartKickGid = null;
    this.restartKickKind = null;
    this.carryStart = null; // goal-channel telemetry resets with the dead ball
    this.bandInside = false;
    this.attackEntry = null;
    this.lastRestartKick = null;
    this.ball.reset();

    for (const team of this.teams) {
      team.mode = 'ResetShape';
      team.chasers.clear();
      team.marks.clear();
      for (const p of team.players) {
        if (p.sentOff) continue; // stays parked on the apron
        p.resetForKickoff(formationSpot(p, team, this.ball, team.side === kickSide));
        // Everyone starts in their OWN half at kickoff (27.5) — the base
        // striker spot sits past halfway and used to straddle the line.
        const lx = team.localX(p.pos.x);
        if (lx > -1.5) p.pos.x = -1.5 * team.attackDir;
      }
    }

    const kicking = this.teams[kickSide];
    // The striker kicks off; if he was sent off, the deepest remaining
    // outfielder steps in (keeper as the absurd-case failsafe).
    let st = kicking.goalkeeper;
    for (let i = TEAM_SIZE - 1; i >= 1; i--) {
      if (!kicking.players[i].sentOff) {
        st = kicking.players[i];
        break;
      }
    }
    st.pos = v2(-kicking.attackDir * 1.2, 0);
    st.heading = v2(kicking.attackDir, 0);
    st.decisionTimer = 0.05;
    this.kickoffKickGid = st.gid;
    this.ball.owner = st;
    this.ball.lastTouch = st;
    this.possessionSide = kickSide;
    kicking.possessionGainedAt = this.simTime;
    kicking.resetProgress(kicking.localX(this.ball.pos.x));
    this.pushEvent('kickoff', kickSide, `${kicking.info.name} kick off`);
  }

  private endMatch(): void {
    if (this.finished) return;
    this.markShotOutcome('miss'); // a shot in flight at the whistle didn't go in
    this.endPassMove(0);
    this.endPassMove(1);
    // Fold per-player physical output into team stats.
    for (const team of this.teams) {
      for (const p of team.players) {
        team.stats.distance += p.distance;
        team.stats.staminaSpent += p.staminaSpent;
      }
    }
    // Match ratings (Phase 33): written once, at the whistle — MatchResult
    // carries them, so the League and the feed read the same numbers. Only
    // players who actually APPEARED are rated (Phase 61: bench rows that
    // never came on stay at 0 — "didn't play", not "played badly").
    const diff = this.score[0] - this.score[1];
    this.playerStats.forEach((s, ri) => {
      if (s.apps > 0) s.rating = matchRating(s, ri < ROSTER_SIZE ? diff : -diff);
    });
    this.phase = 'fulltime';
    this.finished = true;
    this.pushEvent(
      'fulltime',
      -1,
      `Full time: ${this.teams[0].info.name} ${this.score[0]}–${this.score[1]} ${this.teams[1].info.name}`,
    );
    // Man of the match: best rating, goals then earlier roster row break ties.
    let motm = 0;
    this.playerStats.forEach((s, ri) => {
      const b = this.playerStats[motm];
      if (s.rating > b.rating || (s.rating === b.rating && s.goals > b.goals)) motm = ri;
    });
    const motmSide: Side = motm < ROSTER_SIZE ? 0 : 1;
    this.pushEvent('info', motmSide, `⭐ Man of the match: ${this.rosterNames[motm]} (${this.playerStats[motm].rating.toFixed(1)})`);
  }
}
