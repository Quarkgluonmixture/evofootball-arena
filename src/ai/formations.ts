import { clamp } from '../utils/math';
import { v2, type V2 } from '../utils/vec';
import { GOAL_WIDTH, HALF_L, HALF_W } from '../sim/constants';
import type { Ball } from '../sim/Ball';
import type { Player } from '../sim/Player';
import type { Team } from '../sim/Team';
import type { Role, TeamMode } from '../sim/types';

/**
 * Formation spots in team-local coordinates: +x = our attacking direction,
 * x=-45 is our goal line. The whole block then slides with the ball, the
 * tactical mode, and three genes (formationDepth, attackingWidth,
 * defensiveCompactness).
 */
const BASE_SPOTS: Record<Role, V2> = {
  GK: v2(-41, 0),
  DF: v2(-26, -2),
  MF: v2(-11, -7),
  WG: v2(-7, 15),
  ST: v2(5, -1),
};

/** How far up/down the pitch each tactical mode pushes the block. */
const MODE_SHIFT: Record<TeamMode, number> = {
  Attack: 10,
  BuildUp: 4,
  CounterAttack: 8,
  Press: 6,
  Defend: -8,
  ResetShape: 0,
};

/**
 * World-space formation target for a player. `hasBall` decides whether width
 * (attackingWidth) or compactness (defensiveCompactness) shapes the block.
 */
export function formationSpot(p: Player, team: Team, ball: Ball, hasBall: boolean): V2 {
  const g = team.genome;
  const base = BASE_SPOTS[p.role];

  // Block slides toward the ball along x (local coords), capped at ±10m.
  const ballLocalX = team.localX(ball.pos.x);
  const slide = clamp(ballLocalX * 0.3, -10, 10);

  // formationDepth: 0 = sit 6m deeper, 1 = push 6m higher.
  const depth = (g.formationDepth - 0.5) * 12;

  let x = base.x + slide + depth + MODE_SHIFT[team.mode];

  // Width: stretch when we have the ball, squeeze when we don't.
  const widthMul = hasBall
    ? 0.85 + g.attackingWidth * 0.65 // 0.85 .. 1.5
    : 1.15 - g.defensiveCompactness * 0.6; // 1.15 .. 0.55
  let y = base.y * widthMul;

  // Compact teams also drag their block a little toward the ball's y.
  if (!hasBall) y += (ball.pos.y - y * team.attackDir) * team.attackDir * g.defensiveCompactness * 0.25;

  if (p.role === 'GK') {
    // Keepers hold a narrow band in front of goal regardless of mode.
    x = clamp(base.x + (g.keeperAggression - 0.5) * 4, -44, -34);
    y = clamp(ball.pos.y * 0.25, -GOAL_WIDTH / 2, GOAL_WIDTH / 2);
    return v2(x * team.attackDir, y);
  }

  x = clamp(x, -HALF_L + 3, HALF_L - 7);
  y = clamp(y, -HALF_W + 2, HALF_W - 2);
  return v2(x * team.attackDir, y);
}

/**
 * Where an off-ball player supports the carrier: ahead of the ball for
 * attacking modes, offset laterally toward the supporter's own formation lane,
 * at a radius set by the supportDistance gene.
 */
export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
  const g = team.genome;
  const radius = 6 + g.supportDistance * 9; // 6 .. 15m from the carrier
  const aheadBias = team.mode === 'CounterAttack' || team.mode === 'Attack' ? 0.75 : 0.35;

  const lane = formationSpot(p, team, ball, true);
  // Direction: mostly forward (attackDir), pulled toward the player's lane y.
  const dy = Math.sign(lane.y - ball.pos.y) || (p.index % 2 === 0 ? 1 : -1);
  const dir = v2(team.attackDir * aheadBias, dy * (1 - aheadBias));
  const l = Math.hypot(dir.x, dir.y) || 1;

  return v2(
    clamp(ball.pos.x + (dir.x / l) * radius, -HALF_L + 2, HALF_L - 2),
    clamp(ball.pos.y + (dir.y / l) * radius, -HALF_W + 2, HALF_W - 2),
  );
}
