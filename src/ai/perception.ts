import { clamp01 } from '../utils/math';
import {
  add, closestPointOnSegment, dist, len, norm, scale, sub, type V2,
} from '../utils/vec';
import { BALL_FRICTION_K, GRAVITY } from '../sim/constants';
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
    if (o.sentOff) continue;
    const d = dist(o.pos, pos);
    if (d < best) best = d;
  }
  return clamp01(1 - best / 6);
}

/**
 * 脱压带球 (Phase 34.2, user report "球员不会向后带球"): a pressured
 * carrier outside the final third whose FORWARD path is closed should
 * carry the ball AWAY from the press — back or sideways — to buy time,
 * instead of stopping dead or driving into bodies. Returns the escape
 * direction (opponent-repulsion within 8m, tilted lateral so the carry
 * arcs to the safe wing rather than straight into his own goalmouth) and
 * the space along it, or null when this is not an escape situation.
 * Shared by the SCORER and the EXECUTOR so the utility and the legs agree.
 */
export function escapeCarry(
  p: Player,
  attackDir: number,
  localX: number,
  opponents: Player[],
): { dir: V2; space: number } | null {
  if (localX > 15) return null; // final third: go at them or release, never turn tail
  const pressure = pressureAt(p.pos, opponents);
  if (pressure < 0.45) return null;
  let rx = 0;
  let ry = 0;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const dx = p.pos.x - o.pos.x;
    const dy = p.pos.y - o.pos.y;
    const d2 = dx * dx + dy * dy;
    if (d2 > 64 || d2 < 1e-6) continue;
    rx += dx / d2;
    ry += dy / d2;
  }
  if (rx === 0 && ry === 0) return null;
  // Tilt lateral: straight retreats toward the own goal are the last resort.
  ry += Math.sign(ry || p.pos.y || 1) * 0.35 * Math.hypot(rx, ry);
  let dir = norm({ x: rx, y: ry });
  const forward = spaceAhead(p, { x: attackDir, y: 0 }, opponents);
  if (forward > 0.55) return null; // the front door is open — no need to turn
  const space = spaceAhead(p, dir, opponents);
  if (space < 0.25) return null; // boxed in on every side — not an escape
  return { dir, space };
}

/**
 * How clean an AERIAL lane is (Phase 28): a lofted ball only cares about
 * opponents close enough to the kicker to charge it down before it rises —
 * everything downfield is flown over. Landing safety is the receiver's
 * openness, scored separately by the caller.
 */
export function airLaneOpenness(from: V2, opponents: Player[]): number {
  let worst = 1;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const d = dist(o.pos, from);
    if (d < 1.5) continue; // right on top of the kicker — the chip clears them
    worst = Math.min(worst, clamp01((d - 1.5) / 3));
  }
  return worst;
}

/** How clean the passing lane from `from` to `to` is (1 = wide open). */
export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {
  let worst = 1;
  for (const o of opponents) {
    if (o.sentOff) continue;
    const cp = closestPointOnSegment(from, to, o.pos);
    // Ignore defenders standing right on top of the passer — the kick clears them.
    if (dist(cp, from) < 1.5) continue;
    const d = dist(cp, o.pos);
    worst = Math.min(worst, clamp01(d / 4));
  }
  return worst;
}

/**
 * Bodies parked on a shot path (Phase 31): outfield opponents within ~1m of
 * the corridor's FIRST 60% — the final stretch belongs to the keeper (who
 * has the save path, not the block path). This is what `shotQuality`'s
 * distance·angle·pressure model cannot see: four set defenders between the
 * ball and the goal read as "low pressure" while the drive has zero chance.
 */
export function laneBlockers(from: V2, goal: V2, opponents: Player[]): number {
  const end = add(from, scale(sub(goal, from), 0.6));
  let n = 0;
  for (const o of opponents) {
    if (o.sentOff || o.role === 'GK') continue;
    const cp = closestPointOnSegment(from, end, o.pos);
    if (dist(cp, o.pos) < 1.0) n++;
  }
  return n;
}

/** How much free space a receiver has (nearest opponent distance / 8m). */
export function opennessOf(p: Player, opponents: Player[]): number {
  let best = Infinity;
  for (const o of opponents) {
    if (o.sentOff) continue;
    best = Math.min(best, dist(o.pos, p.pos));
  }
  return clamp01(best / 8);
}

/** Free space in front of a dribbler toward `dir` (10m lookahead cone). */
export function spaceAhead(p: Player, dir: V2, opponents: Player[]): number {
  const probe = add(p.pos, scale(norm(dir), 7));
  let crowd = 0;
  for (const o of opponents) {
    if (o.sentOff) continue;
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
  // Airborne ball (Phase 28): nothing on the ground meets it mid-flight —
  // run to where it comes DOWN (friction-free flight, so the landing point
  // is exact) and be there when it drops.
  if (ball.z > 0.02 || ball.vz > 0.02) {
    const tLand = (ball.vz + Math.sqrt(ball.vz * ball.vz + 2 * GRAVITY * ball.z)) / GRAVITY;
    const px = ball.pos.x + v0.x * tLand;
    const py = ball.pos.y + v0.y * tLand;
    const dx = p.pos.x - px;
    const dy = p.pos.y - py;
    const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;
    return { point: { x: px, y: py }, tBall: tLand, tMe, reachable: tMe <= tLand + 0.6 };
  }
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
