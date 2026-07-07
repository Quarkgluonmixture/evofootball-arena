import { Rng } from '../utils/rng';
import { add, clone, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import { decidePlayer } from '../ai/PlayerBrain';
import { updateTeamBrain } from '../ai/TeamBrain';
import { executeAction } from '../ai/actionExecutor';
import { formationSpot } from '../ai/formations';
import { Ball } from './Ball';
import {
  AI_INTERVAL, BALL_BOUNCE, BALL_FRICTION_K, BOUNCE_DAMP, BOUNCE_MIN_VZ, BOX_DEPTH, BOX_WIDTH,
  CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS,
  DEFLECT_MAX_SPEED, DT,
  GK_CONTROL_MAX_SPEED, GK_HOLD_CLEARANCE, GOAL_HEIGHT, GOAL_WIDTH, GRAVITY, HALF_L, HALF_W,
  KICK_COOLDOWN, MATCH_DURATION,
  PENALTY_CLEARANCE, PENALTY_SPOT_DIST, PLAYER_MIN_DIST, RESTART_CLEARANCE, RESTART_MIN_SETUP,
  RESTART_TIMEOUT, STOPPAGE_MAX, TEAM_AI_INTERVAL,
} from './constants';
import * as mech from './mechanics';
import { Player } from './Player';
import { Team } from './Team';
import {
  emptyPlayerStats,
  type EventType, type MatchEvent, type MatchPhase, type MatchResult, type PlayerMatchStats,
  type RestartKind, type RestartState, type Side, type TeamInfo,
} from './types';

export interface PendingPass {
  side: Side;
  passerGid: number;
  targetGid: number;
  t: number;
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
}

/** One shot for the analytics timeline (xG race chart). */
export interface ShotLogEntry {
  t: number;
  minute: number;
  side: Side;
  xg: number;
  outcome: 'pending' | 'goal' | 'saved' | 'miss';
}

export interface MatchConfig {
  seed: number;
  teamA: TeamInfo;
  teamB: TeamInfo;
  /** Sim-seconds for the whole match (default MATCH_DURATION). Tests use short ones. */
  duration?: number;
}

/**
 * A fully deterministic 5v5 match: same config + seed => same result, whether
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
  /** Live dead-ball restart (kick-in/corner/goal kick); null in open play. */
  restart: RestartState | null = null;
  /** Gid whose next carrier decision must be a kick (restart first touch). */
  restartKickGid: number | null = null;
  /** Gid whose next carrier decision is the kickoff — played BACKWARD (27.3). */
  kickoffKickGid: number | null = null;
  /** What kind of restart that kick is — penalties force a shot. */
  restartKickKind: RestartKind | null = null;
  pendingPass: PendingPass | null = null;
  pendingShot: PendingShot | null = null;
  shotLog: ShotLogEntry[] = [];
  /** Gid of the most recent goalscorer — passive, for celebration visuals only. */
  lastScorerGid: number | null = null;
  /** Per-player counters (goals/assists/shots/saves/recoveries), gid-indexed. Passive. */
  playerStats: PlayerMatchStats[] = [];
  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;

  private kickoffSide: Side = 0;
  private stepCount = 0;
  /** One "stoppage time" feed line per half (Phase 27.4). */
  private stoppageAnnounced = false;
  /** Sim time when the second half kicked off — first-half stoppage must not
   * leak into the second half's display clock (Phase 28.1). */
  private secondHalfStart = 0;

  constructor(cfg: MatchConfig) {
    this.rng = new Rng(cfg.seed);
    this.duration = cfg.duration ?? MATCH_DURATION;
    this.teams = [new Team(0, cfg.teamA), new Team(1, cfg.teamB)];
    this.allPlayers = [...this.teams[0].players, ...this.teams[1].players];
    this.allPlayersReversed = [...this.allPlayers].reverse();
    this.playerStats = this.allPlayers.map(() => emptyPlayerStats());
    // Stagger decision ticks deterministically (symmetric across the teams)
    // so all 10 players don't think in the same frame.
    this.allPlayers.forEach((p) => (p.decisionTimer = ((p.index % 5) + 1) * (AI_INTERVAL / 5)));
    this.setupKickoff(0);
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

    // Stale in-flight bookkeeping expires.
    if (this.pendingPass && this.simTime - this.pendingPass.t > 3.5) this.pendingPass = null;
    if (this.pendingShot && this.simTime - this.pendingShot.t > 3.0) {
      this.markShotOutcome('miss');
      this.pendingShot = null;
    }

    // Each half runs its own nominal length + its own stoppage (28.1) —
    // first-half added time no longer eats into the second half.
    if (this.half === 1 && this.simTime >= this.duration / 2) {
      if (this.refBlowsNow(this.duration / 2)) {
        this.phase = 'halftime';
        this.phaseTimer = 1.2;
        this.stoppageAnnounced = false;
        this.pushEvent('halftime', -1, 'Half-time');
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
    if (this.simTime >= nominal + STOPPAGE_MAX) return true; // patience over
    let holdOn = false;
    if (this.pendingShot || this.pendingPass) holdOn = true;
    else if (this.phase === 'restart') holdOn = this.restart!.kind === 'penalty';
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
      events: this.events,
      duration: this.duration,
    };
  }

  /* ---------------- kicks (delegated to mechanics) ---------------- */

  shotQuality(p: Player): number {
    return mech.shotQuality(this, p);
  }
  performPass(p: Player, mate: Player): void {
    mech.performPass(this, p, mate);
  }
  performThroughBall(p: Player, runner: Player, lofted = false): void {
    mech.performThroughBall(this, p, runner, lofted);
  }
  performCross(p: Player, target: Player): void {
    mech.performCross(this, p, target);
  }
  performLoftedPass(p: Player, mate: Player): void {
    mech.performLoftedPass(this, p, mate);
  }
  performShot(p: Player): void {
    mech.performShot(this, p);
  }
  performClear(p: Player): void {
    mech.performClear(this, p);
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
    p.kickCooldown = KICK_COOLDOWN;
  }

  /** Give a player clean control of the ball, resolving pass bookkeeping. */
  giveBall(p: Player): void {
    const ball = this.ball;
    ball.owner = p;
    ball.lastTouch = p;
    ball.vel = v2();
    ball.z = 0;
    ball.vz = 0;
    const team = this.teams[p.side];

    // Settle on the ball: carry it briefly before the next decision instead of
    // one-touch ping-pong. Outfielders start driving forward immediately.
    if (p.role !== 'GK') {
      p.action = { type: 'Dribble', scores: p.action.scores };
      team.stats.dribbles++;
    } else if (this.restartKickGid !== p.gid) {
      // Keeper hold (Phase 27.2): scoop it up and hold before distributing —
      // hands, not feet. Restart first touches (goal kicks) stay quick.
      p.gkHoldTimer = 1.1;
    }
    p.decisionTimer = Math.max(p.decisionTimer, 0.3);

    const pass = this.pendingPass;
    if (pass) {
      if (p.side === pass.side && p.gid !== pass.passerGid) {
        team.stats.passesCompleted++;
        this.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, t: this.simTime };
      } else if (p.side !== pass.side) {
        team.stats.interceptions++;
        this.playerStats[p.gid].recoveries++;
        this.pushEvent('interception', p.side, `${p.name} intercepts`);
      }
      this.pendingPass = null;
    }
    if (this.pendingShot && p.side !== this.pendingShot.side) {
      this.markShotOutcome('miss'); // no-op if the keeper already logged a save
      this.pendingShot = null;
    }

    if (this.possessionSide !== p.side) {
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
      if (ball.owner.gkHoldTimer > 0) {
        const gk = ball.owner;
        for (const o of this.teams[1 - gk.side].players) {
          if (o.sentOff) continue;
          const d = dist(o.pos, gk.pos);
          if (d < GK_HOLD_CLEARANCE) {
            const dir = d < 1e-6 ? v2(this.teams[1 - gk.side].attackDir, 0) : norm(sub(o.pos, gk.pos));
            o.pos = add(gk.pos, scale(dir, GK_HOLD_CLEARANCE));
            o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
            o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
          }
        }
        return; // untackleable, unsmotherable — hands beat everything
      }
      mech.tryTackles(this);
      mech.trySmother(this);
      return;
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
        } else {
          ball.vz = 0;
        }
      }
    } else {
      const fr = Math.exp(-BALL_FRICTION_K * dt);
      ball.vel.x *= fr;
      ball.vel.y *= fr;
    }
    if (this.checkGoal()) return;
    if (this.checkOutOfPlay()) return;
    mech.tryKeeperSave(this);
    if (ball.z > CONTROL_MAX_HEIGHT) {
      // Too high for feet: only heads (or the keeper's hands) can meet it.
      const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
      mech.tryAerial(this, order);
      return;
    }
    this.tryCapture();
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
    this.score[side]++;
    team.stats.goals++;
    this.markShotOutcome(this.pendingShot?.side === side ? 'goal' : 'miss');

    let scorerText: string;
    const shot = this.pendingShot;
    if (shot && shot.side === side) {
      team.stats.shotsOnTarget++;
      const shooter = this.allPlayers[shot.shooterGid]; // allPlayers is gid-indexed
      scorerText = shooter ? `${shooter.name} (${shooter.role})` : team.info.name;
      this.lastScorerGid = shot.shooterGid;
      this.playerStats[shot.shooterGid].goals++;
      if (shot.assistGid !== null) this.playerStats[shot.assistGid].assists++;
    } else if (this.ball.lastTouch && this.ball.lastTouch.side !== side) {
      scorerText = `${this.ball.lastTouch.name} (og)`;
      this.lastScorerGid = this.ball.lastTouch.gid;
      // Own goals credit nobody's tally.
    } else {
      scorerText = this.ball.lastTouch ? `${this.ball.lastTouch.name} (scramble)` : team.info.name;
      this.lastScorerGid = this.ball.lastTouch?.gid ?? null;
      if (this.ball.lastTouch) this.playerStats[this.ball.lastTouch.gid].goals++;
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
      if (lastSide === defSide) {
        const sy = ball.pos.y >= 0 ? 1 : -1;
        this.awardRestart('corner', (1 - defSide) as Side, v2(sx * (HALF_L - 0.6), sy * (HALF_W - 0.6)));
      } else {
        this.awardRestart('goalKick', defSide, v2(sx * (HALF_L - 7), 0));
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
      // Advantage (Phase 27.2): outfield fouls no longer stop play. The only
      // foul this sim produces is a FAILED tackle — the carrier kept the
      // ball, so the whistle only ever interrupted the attacking team's own
      // move. The foul still counts and still draws cards; box fouls above
      // still concede a penalty.
      this.pushEvent('foul', side, `Foul by ${offender.name} on ${victim.name} — advantage`);
    }
    this.maybeCard(offender);
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
    const yellowP = 0.16 + team.genome.markingAggression * 0.12;
    if (this.rng.chance(yellowP)) {
      team.stats.yellows++;
      if (offender.booked) {
        this.pushEvent('card', offender.side, `Second yellow — ${offender.name} is SENT OFF`);
        this.sendOff(offender);
      } else {
        offender.booked = true;
        this.pushEvent('card', offender.side, `${offender.name} is booked`);
      }
    } else if (this.rng.chance(0.012)) {
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
    p.sentOff = true;
    const team = this.teams[p.side];
    team.stats.reds++;
    p.pos = v2(-team.attackDir * 12, (p.side === 0 ? -1 : 1) * (HALF_W + 4));
    p.vel = v2();
    p.desiredVel = v2();
    p.action = { type: 'HoldPosition', scores: [] };
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

  private awardRestart(kind: RestartKind, side: Side, pos: V2): void {
    const team = this.teams[side];
    // A shot that went out is a miss; any pass in flight is dead.
    this.markShotOutcome('miss');
    this.pendingShot = null;
    this.pendingPass = null;

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
    const clearance = r.kind === 'penalty' ? PENALTY_CLEARANCE : RESTART_CLEARANCE;
    for (const o of this.allPlayers) {
      if (o.sentOff || o.gid === r.takerGid) continue;
      if (o.side === r.side && r.kind !== 'penalty') continue; // only penalties hold teammates
      if (o.side !== r.side && r.kind === 'penalty' && o.role === 'GK') continue; // keeper keeps the line
      const d = dist(o.pos, r.pos);
      if (d < clearance) {
        const dir = d < 1e-6 ? v2(-this.teams[r.side].attackDir, 0) : norm(sub(o.pos, r.pos));
        o.pos = add(r.pos, scale(dir, clearance));
        o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
        o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
      }
      // Goal kicks (Phase 27.3): opponents must be OUT OF THE BOX until the
      // kick is taken — held at the edge, not camped on the six-yard line.
      if (r.kind === 'goalKick' && o.side !== r.side && this.inPenaltyBox(o.pos, r.side)) {
        const attackDir = this.teams[r.side].attackDir;
        o.pos.x = -attackDir * HALF_L + attackDir * (BOX_DEPTH + 0.4);
      }
    }

    const taker = this.allPlayers[r.takerGid];
    // Kick-ins and corners breathe (Phase 28.1): the taker settles the ball
    // and both teams get a beat to shape up — instant touchline restarts
    // read as chaos, and the box picture needs time to form for a cross.
    const minSetup =
      r.kind === 'kickIn' ? 1.8 : r.kind === 'corner' ? 2.0 : RESTART_MIN_SETUP;
    const ready = dist(taker.pos, r.pos) < 1.3 && r.timer >= minSetup;
    if (ready || r.timer >= RESTART_TIMEOUT) {
      this.restart = null;
      this.phase = 'playing';
      this.restartKickGid = taker.gid;
      this.restartKickKind = r.kind;
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
    const deflectable = speed > CONTROL_MAX_SPEED && speed <= DEFLECT_MAX_SPEED;
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
      const maxSpeed = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : CONTROL_MAX_SPEED;
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
    this.restartKickGid = null;
    this.restartKickKind = null;
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
    for (let i = 4; i >= 1; i--) {
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
    // Fold per-player physical output into team stats.
    for (const team of this.teams) {
      for (const p of team.players) {
        team.stats.distance += p.distance;
        team.stats.staminaSpent += p.staminaSpent;
      }
    }
    this.phase = 'fulltime';
    this.finished = true;
    this.pushEvent(
      'fulltime',
      -1,
      `Full time: ${this.teams[0].info.name} ${this.score[0]}–${this.score[1]} ${this.teams[1].info.name}`,
    );
  }
}
