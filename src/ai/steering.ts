import { add, dist, norm, scale, sub, v2, type V2 } from '../utils/vec';
import type { Player } from '../sim/Player';

/** Steering behaviors: each returns a desired-velocity contribution. */

/** Full-speed run at a target. */
export function seek(p: Player, target: V2, speed: number): V2 {
  return scale(norm(sub(target, p.pos)), speed);
}

/** Like seek but decelerates inside `slowRadius` so players settle on spots. */
export function arrive(p: Player, target: V2, speed: number, slowRadius = 2.5): V2 {
  // Flat form of scale(norm(sub(target, p.pos)), s) — runs for every player
  // every frame. dist() and norm's internal length share the same bits
  // ((-a)² === a² in IEEE), so one sqrt serves both; results are unchanged.
  const dx = target.x - p.pos.x;
  const dy = target.y - p.pos.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d < 0.05) return v2();
  const s = d < slowRadius ? speed * (d / slowRadius) : speed;
  if (d < 1e-8) return v2();
  return { x: (dx / d) * s, y: (dy / d) * s };
}

/**
 * Push away from nearby players so nobody stacks. Applied to everyone every
 * frame on top of their primary steering; hard overlap is also resolved in
 * Match physics as a positional constraint.
 */
export function separation(p: Player, all: Player[], radius = 2.2, strength = 3.0): V2 {
  let out = v2();
  for (const o of all) {
    if (o === p) continue;
    const d = dist(o.pos, p.pos);
    if (d < radius && d > 1e-6) {
      out = add(out, scale(norm(sub(p.pos, o.pos)), strength * (1 - d / radius)));
    }
  }
  return out;
}

/** Small sideways push around opponents directly in the movement path. */
export function avoidOpponents(p: Player, desired: V2, opponents: Player[]): V2 {
  const dir = norm(desired);
  if (dir.x === 0 && dir.y === 0) return v2();
  let out = v2();
  for (const o of opponents) {
    const to = sub(o.pos, p.pos);
    const ahead = to.x * dir.x + to.y * dir.y; // projection onto heading
    if (ahead < 0.5 || ahead > 5) continue;
    const lateral = { x: to.x - dir.x * ahead, y: to.y - dir.y * ahead };
    const ld = Math.hypot(lateral.x, lateral.y);
    if (ld < 1.6) {
      const side = lateral.x * dir.y - lateral.y * dir.x > 0 ? 1 : -1;
      out = add(out, scale({ x: -dir.y * side, y: dir.x * side }, 2.0 * (1 - ld / 1.6)));
    }
  }
  return out;
}
