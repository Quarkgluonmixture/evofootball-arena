import { clamp01 } from '../utils/math';
import {
  add, closestPointOnSegment, dist, len, norm, scale, type V2,
} from '../utils/vec';
import { BALL_FRICTION_K } from '../sim/constants';
import type { Ball } from '../sim/Ball';
import type { Player } from '../sim/Player';

/**
 * Perception helpers — small pure queries the utility scorers are built from.
 * All return values are normalized to [0, 1] so scoring math stays readable.
 */

/** Pressure on a position from the nearest opponent: 1 at 0m, 0 beyond 6m. */
export function pressureAt(pos: V2, opponents: Player[]): number {
  let best = Infinity;
  for (const o of opponents) {
    const d = dist(o.pos, pos);
    if (d < best) best = d;
  }
  return clamp01(1 - best / 6);
}

/** How clean the passing lane from `from` to `to` is (1 = wide open). */
export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {
  let worst = 1;
  for (const o of opponents) {
    const cp = closestPointOnSegment(from, to, o.pos);
    // Ignore defenders standing right on top of the passer — the kick clears them.
    if (dist(cp, from) < 1.5) continue;
    const d = dist(cp, o.pos);
    worst = Math.min(worst, clamp01(d / 4));
  }
  return worst;
}

/** How much free space a receiver has (nearest opponent distance / 8m). */
export function opennessOf(p: Player, opponents: Player[]): number {
  let best = Infinity;
  for (const o of opponents) best = Math.min(best, dist(o.pos, p.pos));
  return clamp01(best / 8);
}

/** Free space in front of a dribbler toward `dir` (10m lookahead cone). */
export function spaceAhead(p: Player, dir: V2, opponents: Player[]): number {
  const probe = add(p.pos, scale(norm(dir), 7));
  let crowd = 0;
  for (const o of opponents) {
    const d = dist(o.pos, probe);
    if (d < 8) crowd += 1 - d / 8;
  }
  return clamp01(1 - crowd / 2);
}

/** Rough time for a player to reach a point at top speed (+turn overhead). */
export function timeToPoint(p: Player, point: V2): number {
  return dist(p.pos, point) / Math.max(p.topSpeed, 0.1) + 0.15;
}

export interface InterceptSolution {
  point: V2;
  tBall: number;
  tMe: number;
  reachable: boolean;
}

/**
 * Intercept sampling grid, precomputed once. Uses the same `t += 0.1` float
 * accumulation and exp() evaluations the per-call loop used to run (30 exps
 * per call, every chasing player, every frame) — table values are
 * bit-identical to what the loop produced; only the recomputation is gone.
 */
const INTERCEPT_T: number[] = [];
const INTERCEPT_TRAVEL: number[] = [];
for (let t = 0.1; t <= 3.0; t += 0.1) {
  INTERCEPT_T.push(t);
  INTERCEPT_TRAVEL.push((1 - Math.exp(-BALL_FRICTION_K * t)) / BALL_FRICTION_K);
}

/**
 * Where should I run to meet the moving ball? The free ball follows
 * pos(t) = p0 + v0 * (1 - e^{-kt}) / k. We sample forward and take the first
 * point we can reach before the ball does; falls back to the rest point.
 */
export function interceptBall(p: Player, ball: Ball): InterceptSolution {
  const v0 = ball.vel;
  const speed0 = len(v0);
  // timeToPoint inlined with the topSpeed getter hoisted out of the sampling
  // loop (stamina can't change mid-call, so every sample read the same value);
  // sample points stay scalar until one is actually returned. Same arithmetic
  // in the same order — results are bit-identical, the garbage is gone.
  const ts = Math.max(p.topSpeed, 0.1);
  if (speed0 < 0.5) {
    const dx = p.pos.x - ball.pos.x;
    const dy = p.pos.y - ball.pos.y;
    return { point: ball.pos, tBall: 0, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: true };
  }
  for (let i = 0; i < INTERCEPT_T.length; i++) {
    const t = INTERCEPT_T[i];
    const travel = INTERCEPT_TRAVEL[i];
    const px = ball.pos.x + v0.x * travel;
    const py = ball.pos.y + v0.y * travel;
    const dx = p.pos.x - px;
    const dy = p.pos.y - py;
    const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;
    if (tMe <= t) return { point: { x: px, y: py }, tBall: t, tMe, reachable: true };
  }
  const rest = add(ball.pos, scale(v0, 1 / BALL_FRICTION_K));
  const dx = p.pos.x - rest.x;
  const dy = p.pos.y - rest.y;
  return { point: rest, tBall: 3, tMe: Math.sqrt(dx * dx + dy * dy) / ts + 0.15, reachable: false };
}

/** Can `p` cut out a pass traveling from the ball along its velocity? */
export function canInterceptPass(p: Player, ball: Ball): { ok: boolean; point: V2 } {
  const dir = norm(ball.vel);
  if (dir.x === 0 && dir.y === 0) return { ok: false, point: ball.pos };
  const end = add(ball.pos, scale(dir, 22));
  const cp = closestPointOnSegment(ball.pos, end, p.pos);
  const along = dist(ball.pos, cp);
  // Average ball speed over the segment, decayed by friction (crude but stable).
  const avgSpeed = Math.max(len(ball.vel) * 0.7, 4);
  const tBall = along / avgSpeed;
  const tMe = timeToPoint(p, cp);
  return { ok: tMe < tBall * 0.95 && dist(p.pos, cp) < 10, point: cp };
}
