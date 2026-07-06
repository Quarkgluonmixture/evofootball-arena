import { Rng } from '../utils/rng';
import { add, clone, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import { decidePlayer } from '../ai/PlayerBrain';
import { updateTeamBrain } from '../ai/TeamBrain';
import { executeAction } from '../ai/actionExecutor';
import { formationSpot } from '../ai/formations';
import { Ball } from './Ball';
import {
  AI_INTERVAL, BALL_FRICTION_K, CONTROL_MAX_SPEED, CONTROL_RADIUS, DT,
  GK_CONTROL_MAX_SPEED, GOAL_WIDTH, HALF_L, HALF_W, KICK_COOLDOWN, MATCH_DURATION,
  PLAYER_MIN_DIST, RESTART_CLEARANCE, RESTART_MIN_SETUP, RESTART_TIMEOUT, TEAM_AI_INTERVAL,
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

  /** Display minute: sim time scaled onto a 90' clock. */
  minute(): number {
    return Math.min(90, Math.floor((this.simTime / this.duration) * 90));
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
      if (p.decisionTimer <= 0) {
        decidePlayer(p, this);
        p.decisionTimer = AI_INTERVAL;
      }
    }

    for (const p of order) executeAction(p, this, dt);
    for (const p of order) p.physicsStep(dt);
    this.resolveOverlaps();
    this.clampPlayersToPitch();
    if (this.phase === 'restart') this.stepRestart(dt);
    else this.stepBall(dt);

    // Possession only accrues in open play — restarts are dead-ball time,
    // so the calibrate "ball-in-play share" stays an honest metric.
    if (this.phase === 'playing' && this.possessionSide !== -1) {
      this.teams[this.possessionSide].stats.possessionTime += dt;
    }

    // Stale in-flight bookkeeping expires.
    if (this.pendingPass && this.simTime - this.pendingPass.t > 3.5) this.pendingPass = null;
    if (this.pendingShot && this.simTime - this.pendingShot.t > 3.0) {
      this.markShotOutcome('miss');
      this.pendingShot = null;
    }

    if (this.half === 1 && this.simTime >= this.duration / 2) {
      this.phase = 'halftime';
      this.phaseTimer = 1.2;
      this.pushEvent('halftime', -1, 'Half-time');
    } else if (this.simTime >= this.duration) {
      this.endMatch();
    }
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
  performThroughBall(p: Player, runner: Player): void {
    mech.performThroughBall(this, p, runner);
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

  /** Low-level kick: releases the ball with velocity and a re-capture cooldown. */
  kickBall(p: Player, dir: V2, speed: number): void {
    const ball = this.ball;
    ball.owner = null;
    ball.lastTouch = p;
    ball.vel = scale(dir, speed);
    ball.pos = add(p.pos, scale(dir, 0.9));
    p.kickCooldown = KICK_COOLDOWN;
  }

  /** Give a player clean control of the ball, resolving pass bookkeeping. */
  giveBall(p: Player): void {
    const ball = this.ball;
    ball.owner = p;
    ball.lastTouch = p;
    ball.vel = v2();
    const team = this.teams[p.side];

    // Settle on the ball: carry it briefly before the next decision instead of
    // one-touch ping-pong. Outfielders start driving forward immediately.
    if (p.role !== 'GK') {
      p.action = { type: 'Dribble', scores: p.action.scores };
      team.stats.dribbles++;
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
      // Dribble: the ball rides slightly ahead of the owner's heading.
      // In-place writes (was add/scale/clone — 3 vectors per step); ball.pos
      // and ball.vel are never aliased, all other writers assign fresh objects.
      ball.pos.x = ball.owner.pos.x + ball.owner.heading.x * 0.85;
      ball.pos.y = ball.owner.pos.y + ball.owner.heading.y * 0.85;
      ball.vel.x = ball.owner.vel.x;
      ball.vel.y = ball.owner.vel.y;
      mech.tryTackles(this);
      return;
    }
    ball.pos.x += ball.vel.x * dt;
    ball.pos.y += ball.vel.y * dt;
    const fr = Math.exp(-BALL_FRICTION_K * dt);
    ball.vel.x *= fr;
    ball.vel.y *= fr;
    if (this.checkGoal()) return;
    if (this.checkOutOfPlay()) return;
    mech.tryKeeperSave(this);
    this.tryCapture();
  }

  private checkGoal(): boolean {
    const ball = this.ball;
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

  private awardRestart(kind: RestartKind, side: Side, pos: V2): void {
    const team = this.teams[side];
    // A shot that went out is a miss; any pass in flight is dead.
    this.markShotOutcome('miss');
    this.pendingShot = null;
    this.pendingPass = null;

    this.ball.owner = null;
    this.ball.pos = clone(pos);
    this.ball.vel = v2();

    // The restart team is "in possession" for shape/marking purposes.
    this.possessionSide = side;
    team.possessionGainedAt = this.simTime;
    this.teams[0].brainTimer = Math.min(this.teams[0].brainTimer, 0.05);
    this.teams[1].brainTimer = Math.min(this.teams[1].brainTimer, 0.05);

    if (kind === 'corner') {
      team.stats.corners++;
      this.pushEvent('corner', side, `Corner — ${team.info.name}`);
    }

    this.restart = { kind, side, pos: clone(pos), timer: 0, takerGid: this.pickTaker(kind, side, pos) };
    this.phase = 'restart';
  }

  /** GK takes goal kicks; otherwise the nearest outfielder walks over. */
  private pickTaker(kind: RestartKind, side: Side, pos: V2): number {
    const team = this.teams[side];
    if (kind === 'goalKick') return team.goalkeeper.gid;
    let best = team.players[1];
    let bestD = Infinity;
    for (const p of team.players) {
      if (p.role === 'GK') continue;
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

    // Hold opponents out of the restart circle (slide along its edge).
    for (const o of this.teams[1 - r.side].players) {
      const d = dist(o.pos, r.pos);
      if (d < RESTART_CLEARANCE) {
        const dir = d < 1e-6 ? v2(-this.teams[r.side].attackDir, 0) : norm(sub(o.pos, r.pos));
        o.pos = add(r.pos, scale(dir, RESTART_CLEARANCE));
        o.pos.x = Math.max(-HALF_L + 0.3, Math.min(HALF_L - 0.3, o.pos.x));
        o.pos.y = Math.max(-HALF_W + 0.3, Math.min(HALF_W - 0.3, o.pos.y));
      }
    }

    const taker = this.allPlayers[r.takerGid];
    const ready = dist(taker.pos, r.pos) < 1.3 && r.timer >= RESTART_MIN_SETUP;
    if (ready || r.timer >= RESTART_TIMEOUT) {
      this.restart = null;
      this.phase = 'playing';
      this.restartKickGid = taker.gid;
      this.giveBall(taker);
      taker.decisionTimer = 0.12; // kick promptly (giveBall's settle is for open play)
    }
  }

  private tryCapture(): void {
    const ball = this.ball;
    const speed = Math.hypot(ball.vel.x, ball.vel.y);
    let best: Player | null = null;
    let bestD = Infinity;
    // Alternate scan direction so equal-distance ties don't favor one team.
    const order = this.stepCount % 2 === 0 ? this.allPlayers : this.allPlayersReversed;
    for (const p of order) {
      if (p.kickCooldown > 0) continue;
      const maxSpeed = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : CONTROL_MAX_SPEED;
      if (speed > maxSpeed) continue;
      // Same cheap reject as resolveOverlaps: |dx| ≥ radius ⇒ d ≥ radius.
      const dx = p.pos.x - ball.pos.x;
      if (dx >= CONTROL_RADIUS || dx <= -CONTROL_RADIUS) continue;
      const dy = p.pos.y - ball.pos.y;
      if (dy >= CONTROL_RADIUS || dy <= -CONTROL_RADIUS) continue;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < CONTROL_RADIUS && d < bestD) {
        best = p;
        bestD = d;
      }
    }
    if (best) this.giveBall(best);
  }

  /* ---------------- player constraints ---------------- */

  private resolveOverlaps(): void {
    const ps = this.allPlayers;
    for (let i = 0; i < ps.length; i++) {
      const a = ps[i];
      for (let j = i + 1; j < ps.length; j++) {
        const b = ps[j];
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
        a.pos.x += px;
        a.pos.y += py;
        b.pos.x -= px;
        b.pos.y -= py;
      }
    }
  }

  private clampPlayersToPitch(): void {
    for (const p of this.allPlayers) {
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
    this.ball.reset();

    for (const team of this.teams) {
      team.mode = 'ResetShape';
      team.chasers.clear();
      team.marks.clear();
      for (const p of team.players) {
        p.resetForKickoff(formationSpot(p, team, this.ball, team.side === kickSide));
      }
    }

    const kicking = this.teams[kickSide];
    const st = kicking.players[4];
    st.pos = v2(-kicking.attackDir * 1.2, 0);
    st.heading = v2(kicking.attackDir, 0);
    st.decisionTimer = 0.05;
    this.ball.owner = st;
    this.ball.lastTouch = st;
    this.possessionSide = kickSide;
    kicking.possessionGainedAt = this.simTime;
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
