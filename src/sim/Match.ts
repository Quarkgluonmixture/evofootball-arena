import { Rng } from '../utils/rng';
import { add, clone, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import { decidePlayer } from '../ai/PlayerBrain';
import { updateTeamBrain } from '../ai/TeamBrain';
import { executeAction } from '../ai/actionExecutor';
import { formationSpot } from '../ai/formations';
import { Ball } from './Ball';
import {
  AI_INTERVAL, BALL_FRICTION_K, BALL_WALL_RESTITUTION, CONTROL_MAX_SPEED, CONTROL_RADIUS, DT,
  GK_CONTROL_MAX_SPEED, GOAL_WIDTH, HALF_L, HALF_W, KICK_COOLDOWN, MATCH_DURATION,
  PLAYER_MIN_DIST, TEAM_AI_INTERVAL,
} from './constants';
import * as mech from './mechanics';
import { Player } from './Player';
import { Team } from './Team';
import type { EventType, MatchEvent, MatchPhase, MatchResult, Side, TeamInfo } from './types';

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
  pendingPass: PendingPass | null = null;
  pendingShot: PendingShot | null = null;
  shotLog: ShotLogEntry[] = [];
  /** Gid of the most recent goalscorer — passive, for celebration visuals only. */
  lastScorerGid: number | null = null;
  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;

  private kickoffSide: Side = 0;
  private stepCount = 0;

  constructor(cfg: MatchConfig) {
    this.rng = new Rng(cfg.seed);
    this.duration = cfg.duration ?? MATCH_DURATION;
    this.teams = [new Team(0, cfg.teamA), new Team(1, cfg.teamB)];
    this.allPlayers = [...this.teams[0].players, ...this.teams[1].players];
    this.allPlayersReversed = [...this.allPlayers].reverse();
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

    // ---- playing ----
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
    this.stepBall(dt);

    if (this.possessionSide !== -1) this.teams[this.possessionSide].stats.possessionTime += dt;

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
      ball.pos = add(ball.owner.pos, scale(ball.owner.heading, 0.85));
      ball.vel = clone(ball.owner.vel);
      mech.tryTackles(this);
      return;
    }
    ball.pos = add(ball.pos, scale(ball.vel, dt));
    ball.vel = scale(ball.vel, Math.exp(-BALL_FRICTION_K * dt));
    if (this.checkGoal()) return;
    this.bounceWalls();
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
      const shooter = this.allPlayers.find((p) => p.gid === shot.shooterGid);
      scorerText = shooter ? `${shooter.name} (${shooter.role})` : team.info.name;
      this.lastScorerGid = shot.shooterGid;
    } else if (this.ball.lastTouch && this.ball.lastTouch.side !== side) {
      scorerText = `${this.ball.lastTouch.name} (og)`;
      this.lastScorerGid = this.ball.lastTouch.gid;
    } else {
      scorerText = this.ball.lastTouch ? `${this.ball.lastTouch.name} (scramble)` : team.info.name;
      this.lastScorerGid = this.ball.lastTouch?.gid ?? null;
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

  private bounceWalls(): void {
    const ball = this.ball;
    const r = BALL_WALL_RESTITUTION;
    if (ball.pos.x < -HALF_L) {
      ball.pos.x = -HALF_L - (ball.pos.x + HALF_L);
      ball.vel.x = -ball.vel.x * r;
      ball.vel.y *= 0.85;
    } else if (ball.pos.x > HALF_L) {
      ball.pos.x = HALF_L - (ball.pos.x - HALF_L);
      ball.vel.x = -ball.vel.x * r;
      ball.vel.y *= 0.85;
    }
    if (ball.pos.y < -HALF_W) {
      ball.pos.y = -HALF_W - (ball.pos.y + HALF_W);
      ball.vel.y = -ball.vel.y * r;
      ball.vel.x *= 0.85;
    } else if (ball.pos.y > HALF_W) {
      ball.pos.y = HALF_W - (ball.pos.y - HALF_W);
      ball.vel.y = -ball.vel.y * r;
      ball.vel.x *= 0.85;
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
      const d = dist(p.pos, ball.pos);
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
      for (let j = i + 1; j < ps.length; j++) {
        const a = ps[i];
        const b = ps[j];
        const d = dist(a.pos, b.pos);
        if (d >= PLAYER_MIN_DIST) continue;
        if (d < 1e-6) {
          a.pos = add(a.pos, v2(0.02 * (i + 1), 0.01));
          continue;
        }
        const push = scale(norm(sub(a.pos, b.pos)), (PLAYER_MIN_DIST - d) / 2);
        a.pos = add(a.pos, push);
        b.pos = sub(b.pos, push);
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
