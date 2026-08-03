/**
 * SCATTER GEOMETRY (Track D2) — the pure half of the style-space map: where a
 * club's dot lands, how its season trail fades, which dot the pointer is over
 * and where the identity card can sit without falling off the edge.
 *
 * It lives apart from `EvolutionScreen` for one reason: the drawing is DOM and
 * the only judge of pixels is the user's eyes, but this arithmetic can rot
 * silently — an off-by-one trail window that quietly drops the ghost season, a
 * hit test that prefers whichever club happens to be first in the array, a
 * card that hangs off the right edge on a phone. Those are pinned by tests.
 *
 * No sim contact, no rng, no DOM.
 */

/** Frames older than this never draw — a 40-season trail is a scribble. */
export const TRAIL_LEN = 8;

/** Faintest a trail segment gets before it may as well not be drawn. */
const TRAIL_MIN_OPACITY = 0.12;

/** A club's dot in viewBox coordinates. */
export interface ScatterDot {
  slot: number;
  x: number;
  y: number;
}

/**
 * z-score of a raw style value. `std` is floored at 2% of the dim's full range
 * for the same reason `nameplateFor` floors it: a dim the population agrees on
 * would otherwise turn measurement noise into giant z-scores.
 */
export function styleZ(value: number, mean: number, std: number, scale: number): number {
  return (value - mean) / Math.max(std, scale * 0.02);
}

/** The plotted window of z — beyond this a club is pinned to the frame edge. */
export const Z_LIMIT = 2.5;

/**
 * Map a z-score onto one axis of the viewBox. `size` is the axis length, `pad`
 * the margin; the population mean sits at the centre. `flip` for the y axis,
 * where SVG counts downwards but football charts count up.
 */
export function projectZ(z: number, size: number, pad: number, flip = false): number {
  const clamped = Math.max(-Z_LIMIT, Math.min(Z_LIMIT, z));
  const half = (size / 2 - pad) / Z_LIMIT;
  return flip ? size / 2 - clamped * half : size / 2 + clamped * half;
}

/**
 * First frame of the trail ending at `idx`. Inclusive, never negative — so a
 * league one season old still draws the two points it honestly has.
 */
export function trailStart(idx: number, len = TRAIL_LEN): number {
  return Math.max(0, idx - Math.max(1, len));
}

/**
 * Opacity for the segment leading INTO point `i` of `n` trail points: the tail
 * end of history is faintest, the newest segment carries `peak`. With two
 * points there is one segment and it gets the full `peak` — the reason the
 * ramp is indexed off segments-remaining rather than a plain `i / n`.
 */
export function trailOpacity(i: number, n: number, peak: number): number {
  if (n <= 2) return peak;
  const age = (n - 1 - i) / (n - 2); // 0 = newest segment, 1 = oldest
  return Math.max(TRAIL_MIN_OPACITY, peak * (1 - age * 0.8));
}

/**
 * The dot under the pointer, or null. Ties break on the smaller slot so the
 * card never flickers between two clubs sharing a point (a monoculture puts
 * every club on the same spot — the tie is real, not hypothetical).
 */
export function nearestDot(
  dots: readonly ScatterDot[], x: number, y: number, maxDist: number,
): ScatterDot | null {
  let best: ScatterDot | null = null;
  let bestD2 = maxDist * maxDist;
  for (const d of dots) {
    const d2 = (d.x - x) ** 2 + (d.y - y) ** 2;
    if (d2 < bestD2 || (d2 === bestD2 && best !== null && d.slot < best.slot)) {
      best = d;
      bestD2 = d2;
    }
  }
  return best;
}

/** Pointer → viewBox coordinates, given the element's on-screen box. */
export function toViewBox(
  clientX: number, clientY: number,
  rect: { left: number; top: number; width: number; height: number },
  vbW: number, vbH: number,
): { x: number; y: number } {
  const sx = rect.width > 0 ? vbW / rect.width : 1;
  const sy = rect.height > 0 ? vbH / rect.height : 1;
  return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy };
}

/**
 * Where the identity card goes, in host pixels. It prefers down-right of the
 * pointer and flips rather than overflow — the phone is the binding case, and
 * a card clipped by the map edge is a card that can't be read. Clamped to the
 * host even when the card is wider than the host itself.
 */
export function cardPlacement(
  px: number, py: number, cardW: number, cardH: number,
  hostW: number, hostH: number, gap = 12,
): { left: number; top: number } {
  let left = px + gap;
  if (left + cardW > hostW) left = px - gap - cardW;
  let top = py + gap;
  if (top + cardH > hostH) top = py - gap - cardH;
  return {
    left: Math.max(0, Math.min(left, Math.max(0, hostW - cardW))),
    top: Math.max(0, Math.min(top, Math.max(0, hostH - cardH))),
  };
}

/** How a club moved on one axis between the ghost season and now. */
export interface AxisMove {
  /** Current z on this axis. */
  z: number;
  /** Change in z since the ghost frame; null when there is no earlier frame. */
  dz: number | null;
  arrow: '↑' | '↓' | '→';
}

/** A move smaller than this (in σ) reads as "held its ground", not drift. */
export const STEADY_Z = 0.05;

export function axisMove(z: number, ghostZ: number | null): AxisMove {
  if (ghostZ === null) return { z, dz: null, arrow: '→' };
  const dz = z - ghostZ;
  return { z, dz, arrow: dz > STEADY_Z ? '↑' : dz < -STEADY_Z ? '↓' : '→' };
}

/**
 * Distance a club travelled across the plotted plane since the ghost season,
 * in σ — the card's one-number answer to "did this club actually change?".
 * Null when there is no ghost season to measure against.
 */
export function driftMagnitude(
  x: AxisMove, y: AxisMove,
): number | null {
  if (x.dz === null || y.dz === null) return null;
  return Math.hypot(x.dz, y.dz);
}
