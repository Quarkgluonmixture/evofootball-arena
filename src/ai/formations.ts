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
// Lanes are deliberately separated (Phase 27.1): with DF/MF/ST all within
// ~7m of the center line, BOTH teams' spines stacked into one central
// corridor and open play collapsed into a six-player chase around the ball.
// The DF spot stepped up -26 → -23 in Phase 29: with offside real, a back
// line that dares to hold higher compresses the game — and the space it
// leaves BEHIND is what timed runs (and sweeping keepers) now contest.
const BASE_SPOTS: Record<Role, V2> = {
  GK: v2(-41, 0),
  DF: v2(-20, -5),
  MF: v2(-11, -12),
  WG: v2(-7, 17),
  ST: v2(5, 4),
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

  // Width: stretch when we have the ball, squeeze when we don't. The
  // in-possession floor is 1.0 (Phase 27.1) — an attacking shape should
  // never be narrower than its base lanes.
  const widthMul = hasBall
    ? 1.0 + g.attackingWidth * 0.55 // 1.0 .. 1.55
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
 * The opponents' last defensive line, in `team`-local x (bigger = deeper
 * toward their goal). GK excluded — beating the keeper is the striker's job.
 */
export function defenderLineLocalX(team: Team, opponents: Player[]): number {
  let line = -HALF_L;
  for (const o of opponents) {
    if (o.role === 'GK' || o.sentOff) continue;
    const lx = team.localX(o.pos.x);
    if (lx > line) line = lx;
  }
  return line;
}

/**
 * The OFFSIDE line in `team`-local x (Phase 29): the second-last opponent
 * COUNTING the keeper (the real law — usually the last outfield defender,
 * because the keeper is the last man), or the ball itself if it's deeper,
 * floored at halfway (you cannot be offside in your own half). An attacker
 * ahead of this line when a teammate strikes the ball is in an offside
 * position; level is onside (callers add their own epsilon).
 */
export function offsideLineLocalX(team: Team, opponents: Player[], ballLocalX: number): number {
  let last = -HALF_L;
  let secondLast = -HALF_L;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const lx = team.localX(o.pos.x);
    if (lx > last) {
      secondLast = last;
      last = lx;
    } else if (lx > secondLast) {
      secondLast = lx;
    }
  }
  return Math.max(secondLast, ballLocalX, 0);
}

/**
 * Where an assigned runner sprints: past the last defender's shoulder,
 * angling into the channel toward goal. Clamped short of the keeper's box so
 * runs stretch the defence without parking on the goal line. The target aims
 * BEYOND the line on purpose — while a teammate still carries the ball the
 * executor holds the run at the offside line (Phase 29), and the instant the
 * kick is struck the clamp releases and this target is the burst in behind.
 */
export function runTarget(p: Player, team: Team, opponents: Player[]): V2 {
  const line = defenderLineLocalX(team, opponents);
  const myX = team.localX(p.pos.x);
  const targetLocalX = clamp(Math.max(line + 7, myX + 5), myX + 3, HALF_L - 9);
  // Narrow toward the goal mouth as the run goes deeper, keeping the lane.
  const y = clamp(p.pos.y * 0.6, -HALF_W + 4, HALF_W - 4);
  return v2(targetLocalX * team.attackDir, y);
}

/**
 * Where a through ball should MEET a runner (Phase 29). A runner already in
 * stride is led by their velocity, like any pass. But a runner HELD at the
 * offside line hovers with near-zero velocity — leading by velocity would
 * put the ball at their feet ON the line, exactly the ball the line exists
 * to kill. The pass anticipates the break instead: it projects the burst
 * along the run target at the runner's top speed, and the runner breaks the
 * instant the kick releases the onside hold. Judgment stays honest — the
 * flag is judged on where the runner STANDS at the kick, not the aim point.
 */
export function runBurstPoint(p: Player, team: Team, opponents: Player[], flight: number): V2 {
  const speed = Math.hypot(p.vel.x, p.vel.y);
  if (speed > 3) {
    return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);
  }
  const rt = runTarget(p, team, opponents);
  const dx = rt.x - p.pos.x;
  const dy = rt.y - p.pos.y;
  const d = Math.hypot(dx, dy) || 1;
  const burst = Math.min(d, p.topSpeed * flight * 1.1);
  return v2(p.pos.x + (dx / d) * burst, p.pos.y + (dy / d) * burst);
}

/**
 * Where an off-ball player supports the carrier: ahead of the ball for
 * attacking modes, offset laterally toward the supporter's own formation lane,
 * at a radius set by the supportDistance gene.
 */
export function supportSpot(p: Player, team: Team, ball: Ball): V2 {
  const g = team.genome;
  // 10..18m: close enough for a give-and-go, far enough that the carrier
  // isn't mobbed by their own teammates (Phase 19 spacing pass, widened in
  // Phase 27.1 — the crowd complaint was real).
  const radius = 10 + g.supportDistance * 8;
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
