import { clamp } from '../utils/math';
import { add, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import { GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
import type { Match } from '../sim/Match';
import type { Player } from '../sim/Player';
import { formationSpot, runTarget, supportSpot } from './formations';
import { interceptBall } from './perception';
import { arrive, avoidOpponents, separation } from './steering';

/**
 * Turns the player's current (discrete) action into a desired velocity every
 * frame. Dynamic targets — moving balls, moving opponents, sliding formation
 * spots — are recomputed here each frame so actions never chase stale data.
 */
export function executeAction(p: Player, match: Match, _dt: number): void {
  const team = match.teams[p.side];
  const opp = match.teams[1 - p.side];
  const g = team.genome;
  const ball = match.ball;
  const hasBall = match.possessionSide === team.side;

  // staminaConservation is a real trade-off: misers jog slower AND press with
  // less sprint (weaker pressing, fresher legs late in the match).
  const conserve = g.staminaConservation;
  const jog = 0.78 - conserve * 0.25;
  const sprint = 1 - conserve * 0.12;
  let target: V2 | null = null;
  let speedF = jog;
  p.faceTarget = null; // per-frame; only keeper cases set it (backpedal, 27.5)

  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': {
      target = formationSpot(p, team, ball, hasBall);
      // Hurry back if badly out of position.
      if (dist(p.pos, target) > 14) speedF = 0.95 - conserve * 0.2;
      break;
    }
    case 'ChaseBall': {
      const sol = interceptBall(p, ball);
      target = sol.point;
      speedF = sprint;
      break;
    }
    case 'ReceivePass':
    case 'InterceptPass': {
      const sol = interceptBall(p, ball);
      target = sol.point;
      speedF = sprint;
      break;
    }
    case 'MarkOpponent': {
      const markIdx = p.action.targetIdx;
      const mark = markIdx !== undefined ? opp.players[markIdx] : null;
      if (mark) {
        // Goal-side AND ball-side (Phase 27): the stance blends "between my
        // man and our goal" with "between my man and the ball", so markers
        // shadow the passing lane and anticipated balls can be cut out.
        const markDist = 2.6 - g.markingAggression * 1.8;
        const goal = team.ownGoal();
        const gx = goal.x - mark.pos.x;
        const gy = goal.y - mark.pos.y;
        const gl = Math.sqrt(gx * gx + gy * gy);
        const nx = gl < 1e-8 ? 0 : gx / gl;
        const ny = gl < 1e-8 ? 0 : gy / gl;
        const bx = ball.pos.x - mark.pos.x;
        const by = ball.pos.y - mark.pos.y;
        const bl = Math.sqrt(bx * bx + by * by);
        // Kept moderate (Phase 27.1): a stronger ball-side pull dragged every
        // marker into the central corridor and fed the crowding complaint.
        const laneW = 0.22 + g.markingAggression * 0.22;
        const mx = nx + (bl < 1e-8 ? 0 : (bx / bl) * laneW);
        const my = ny + (bl < 1e-8 ? 0 : (by / bl) * laneW);
        const ml = Math.sqrt(mx * mx + my * my);
        const dx = ml < 1e-8 ? nx : mx / ml;
        const dy = ml < 1e-8 ? ny : my / ml;
        target = { x: mark.pos.x + dx * markDist, y: mark.pos.y + dy * markDist };
        speedF = 0.85 + g.markingAggression * 0.15;
      } else {
        target = formationSpot(p, team, ball, hasBall);
      }
      break;
    }
    case 'SupportBallCarrier': {
      target = supportSpot(p, team, ball);
      speedF = (team.mode === 'CounterAttack' ? 1 : 0.9) - conserve * 0.15;
      break;
    }
    case 'MakeRun': {
      // Attacking run in behind — a full sprint, recomputed each frame so the
      // run bends with the defensive line.
      target = runTarget(p, team, opp.players);
      speedF = sprint;
      break;
    }
    case 'Dribble': {
      target = dribbleTarget(p, match);
      // Dribbling is slower than free running; close control (technique)
      // lets a carrier keep more of their pace (Phase 27).
      speedF = 0.84 + p.attrs.technique * 0.1;
      break;
    }
    case 'Pass':
    case 'LoftedPass':
    case 'ThroughBall':
    case 'Cross':
    case 'Shoot':
    case 'ClearBall': {
      // Kick already happened at decision time — brief follow-through.
      target = null;
      break;
    }
    case 'HoldUp': {
      // Pivot shield (Phase 28): keep the body between ball and defender —
      // a slow drift away from the nearest opponent, chest toward our own
      // half so the lay-off is played with the facing, not against it.
      let near: Player | null = null;
      let nearD = Infinity;
      for (const o of opp.players) {
        if (o.sentOff) continue;
        const d = dist(o.pos, p.pos);
        if (d < nearD) {
          nearD = d;
          near = o;
        }
      }
      if (near && nearD > 1e-6) {
        const ax = (p.pos.x - near.pos.x) / nearD;
        const ay = (p.pos.y - near.pos.y) / nearD;
        target = { x: p.pos.x + ax * 1.4, y: p.pos.y + ay * 1.4 };
      } else {
        target = p.pos;
      }
      speedF = 0.35;
      p.faceTarget = team.ownGoal();
      break;
    }
    case 'GoalkeeperSave': {
      const sol = interceptBall(p, ball);
      // Never leave the goal area chasing a shot.
      target = clampToBox(sol.point, team.attackDir);
      speedF = 1;
      p.faceTarget = ball.pos;
      break;
    }
    case 'GoalkeeperRush': {
      // 1v1 (Phase 27.5): charge the ball at full sprint — deliberately NOT
      // clamped to the box; an aggressive keeper sweeps outside it.
      target = ball.pos;
      speedF = 1;
      p.faceTarget = ball.pos;
      break;
    }
    case 'GoalkeeperPosition': {
      p.faceTarget = ball.pos; // backpedal facing the play (27.5)
      // Flat form of add(goal, scale(sub(ball.pos, goal), k)) — every frame for keepers.
      const goal = team.ownGoal();
      const out = 2.5 + g.keeperAggression * 7;
      const tbx = ball.pos.x - goal.x;
      const tby = ball.pos.y - goal.y;
      const d = Math.max(Math.sqrt(tbx * tbx + tby * tby), 0.1);
      const k = Math.min(out, d * 0.5) / d;
      target = clampToBox({ x: goal.x + tbx * k, y: goal.y + tby * k }, team.attackDir);
      speedF = 0.9;
      break;
    }
  }

  // arrive/scale return fresh vectors, so accumulating into `desired` in place
  // is alias-free — same additions in the same order, two fewer allocations
  // per player per frame.
  const desired = target ? arrive(p, target, p.topSpeed * speedF, 2.2) : scale(p.vel, 0.4);

  // Steering blend: hard anti-stacking vs teammates + soft path avoidance.
  const sep = separation(p, team.players, 2.4, 2.5);
  desired.x += sep.x;
  desired.y += sep.y;
  if (p.action.type === 'MoveToFormationSpot' || p.action.type === 'SupportBallCarrier') {
    const av = avoidOpponents(p, desired, opp.players);
    desired.x += av.x;
    desired.y += av.y;
  }

  p.desiredVel = desired;
}

/** Dribble toward goal, bending away from the nearest defender ahead. */
function dribbleTarget(p: Player, match: Match): V2 {
  const team = match.teams[p.side];
  const opp = match.teams[1 - p.side];
  const goal = team.oppGoal();
  const toGoal = norm(sub(goal, p.pos));

  // Find the most obstructive opponent within 6m ahead.
  let block: Player | null = null;
  let blockD = Infinity;
  for (const o of opp.players) {
    if (o.sentOff) continue;
    const to = sub(o.pos, p.pos);
    const ahead = to.x * toGoal.x + to.y * toGoal.y;
    if (ahead > 0 && ahead < 6) {
      const d = dist(o.pos, p.pos);
      if (d < blockD) {
        blockD = d;
        block = o;
      }
    }
  }

  let dir = toGoal;
  if (block) {
    // Slalom: steer perpendicular, away from the blocker's side.
    const side = (block.pos.x - p.pos.x) * toGoal.y - (block.pos.y - p.pos.y) * toGoal.x > 0 ? -1 : 1;
    const perp = v2(-toGoal.y * side, toGoal.x * side);
    const w = clamp(1 - blockD / 6, 0, 1);
    dir = norm(add(scale(toGoal, 1 - w * 0.8), scale(perp, w)));
  }

  const t = add(p.pos, scale(dir, 6));
  t.x = clamp(t.x, -HALF_L + 1.5, HALF_L - 1.5);
  t.y = clamp(t.y, -HALF_W + 1.5, HALF_W - 1.5);
  return t;
}

/** Keep goalkeeper targets inside a sane area in front of their own goal. */
function clampToBox(pt: V2, attackDir: 1 | -1): V2 {
  const gx = -attackDir * HALF_L; // own goal line x
  const minX = Math.min(gx, gx + attackDir * 14);
  const maxX = Math.max(gx, gx + attackDir * 14);
  return v2(clamp(pt.x, minX, maxX), clamp(pt.y, -GOAL_WIDTH / 2 - 4, GOAL_WIDTH / 2 + 4));
}
