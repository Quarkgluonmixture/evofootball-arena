import { clamp } from '../utils/math';
import { add, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import { GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
import type { Match } from '../sim/Match';
import type { Player } from '../sim/Player';
import { formationSpot, supportSpot } from './formations';
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
        // Goal-side position: between the opponent and our goal, tighter with aggression.
        const markDist = 2.6 - g.markingAggression * 1.8;
        target = add(mark.pos, scale(norm(sub(team.ownGoal(), mark.pos)), markDist));
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
    case 'Dribble': {
      target = dribbleTarget(p, match);
      speedF = 0.88; // dribbling is slower than free running
      break;
    }
    case 'Pass':
    case 'Shoot':
    case 'ClearBall': {
      // Kick already happened at decision time — brief follow-through.
      target = null;
      break;
    }
    case 'GoalkeeperSave': {
      const sol = interceptBall(p, ball);
      // Never leave the goal area chasing a shot.
      target = clampToBox(sol.point, team.attackDir);
      speedF = 1;
      break;
    }
    case 'GoalkeeperPosition': {
      const goal = team.ownGoal();
      const out = 2.5 + g.keeperAggression * 7;
      const toBall = sub(ball.pos, goal);
      const d = Math.max(dist(ball.pos, goal), 0.1);
      const raw = add(goal, scale(toBall, Math.min(out, d * 0.5) / d));
      target = clampToBox(raw, team.attackDir);
      speedF = 0.9;
      break;
    }
  }

  let desired = target ? arrive(p, target, p.topSpeed * speedF, 2.2) : scale(p.vel, 0.4);

  // Steering blend: hard anti-stacking vs teammates + soft path avoidance.
  desired = add(desired, separation(p, team.players, 2.4, 2.5));
  if (p.action.type === 'MoveToFormationSpot' || p.action.type === 'SupportBallCarrier') {
    desired = add(desired, avoidOpponents(p, desired, opp.players));
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
