/**
 * Style-space scatter geometry (Track D2) — the arithmetic under the evolution
 * map's season trails, ghost points, hover hit-testing and identity card.
 *
 * The pixels themselves are the user's eyes' business (Track D's rule). What
 * is pinned here is everything that could go wrong WITHOUT looking wrong: a
 * trail window that quietly drops the ghost season, a hit test that prefers
 * whichever club sorts first, an identity card that hangs off a phone's right
 * edge, a "moved 0.00σ" that still draws an arrow.
 */

import { describe, expect, it } from 'vitest';
import {
  STEADY_Z, TRAIL_LEN, Z_LIMIT, axisMove, cardPlacement, driftMagnitude,
  nearestDot, projectZ, styleZ, toViewBox, trailOpacity, trailStart,
} from '../src/ui/scatterGeom';
import { t } from '../src/ui/i18n';

/* ---------------- z-scores and projection ---------------- */

describe('styleZ', () => {
  it('measures deviation in population sigmas', () => {
    expect(styleZ(0.7, 0.5, 0.1, 1)).toBeCloseTo(2, 10);
    expect(styleZ(0.5, 0.5, 0.1, 1)).toBe(0);
  });

  it('floors std at 2% of the dim scale so an agreed dim cannot explode', () => {
    // A monoculture: std 0 on a 0..1 gene. Without the floor this is Infinity
    // and every club pins to the frame edge on a dimension nobody differs on.
    const z = styleZ(0.51, 0.5, 0, 1);
    expect(Number.isFinite(z)).toBe(true);
    expect(z).toBeCloseTo(0.5, 10); // 0.01 / 0.02
  });

  it('scales the floor with the dim range, not the raw number', () => {
    // A policy dim whose full range is 12 tolerates a 0.24 std before flooring.
    expect(styleZ(12.24, 12, 0, 12)).toBeCloseTo(1, 10);
  });
});

describe('projectZ', () => {
  const W = 420;
  const H = 320;
  const PAD = 28;

  it('puts the population mean at the centre of both axes', () => {
    expect(projectZ(0, W, PAD)).toBe(W / 2);
    expect(projectZ(0, H, PAD, true)).toBe(H / 2);
  });

  it('counts y upwards even though SVG counts downwards', () => {
    expect(projectZ(1, H, PAD, true)).toBeLessThan(H / 2);
    expect(projectZ(1, W, PAD)).toBeGreaterThan(W / 2);
  });

  it('lands the plot limit exactly on the padded frame edge', () => {
    expect(projectZ(Z_LIMIT, W, PAD)).toBeCloseTo(W - PAD, 10);
    expect(projectZ(-Z_LIMIT, W, PAD)).toBeCloseTo(PAD, 10);
  });

  it('clamps outliers to the edge instead of drawing them off-canvas', () => {
    expect(projectZ(40, W, PAD)).toBeCloseTo(W - PAD, 10);
    expect(projectZ(-40, H, PAD, true)).toBeCloseTo(H - PAD, 10);
  });
});

/* ---------------- the trail window ---------------- */

describe('trailStart', () => {
  it('spans the trail length back from the current frame', () => {
    expect(trailStart(20)).toBe(20 - TRAIL_LEN);
    expect(trailStart(20, 3)).toBe(17);
  });

  it('never reaches before the first recorded season', () => {
    expect(trailStart(0)).toBe(0);
    expect(trailStart(2)).toBe(0);
    expect(trailStart(-5)).toBe(0);
  });

  it('always leaves the ghost season inside the window when one exists', () => {
    // The map draws trail points over [trailStart(idx), idx) and the ghost is
    // idx-1 — so for every league older than one frame the ghost is covered.
    for (let idx = 1; idx < 40; idx++) {
      expect(trailStart(idx)).toBeLessThanOrEqual(idx - 1);
    }
  });

  it('yields an empty trail on the very first generation', () => {
    // idx 0: [trailStart(0), 0) is empty, and no ghost is drawn either.
    expect(trailStart(0)).toBe(0);
  });

  it('refuses a zero-length window (which would erase the trail entirely)', () => {
    expect(trailStart(9, 0)).toBe(8);
    expect(trailStart(9, -4)).toBe(8);
  });
});

describe('trailOpacity', () => {
  it('fades monotonically into the past', () => {
    const n = 8;
    const ramp = Array.from({ length: n - 1 }, (_, k) => trailOpacity(k + 1, n, 0.85));
    for (let i = 1; i < ramp.length; i++) expect(ramp[i]).toBeGreaterThanOrEqual(ramp[i - 1]);
    expect(ramp[ramp.length - 1]).toBeCloseTo(0.85, 10); // newest segment, full strength
  });

  it('gives a two-point trail its full strength (there is no ramp to walk)', () => {
    expect(trailOpacity(1, 2, 0.85)).toBeCloseTo(0.85, 10);
    expect(trailOpacity(1, 1, 0.85)).toBeCloseTo(0.85, 10);
  });

  it('never fades a drawn segment to invisible', () => {
    for (let n = 3; n <= 20; n++) {
      for (let i = 1; i < n; i++) expect(trailOpacity(i, n, 0.85)).toBeGreaterThan(0.1);
    }
  });

  it('honours the peak it is given', () => {
    expect(trailOpacity(7, 8, 0.4)).toBeCloseTo(0.4, 10);
  });
});

/* ---------------- pointing at a dot ---------------- */

describe('nearestDot', () => {
  const dots = [
    { slot: 3, x: 100, y: 100 },
    { slot: 7, x: 140, y: 100 },
    { slot: 9, x: 300, y: 200 },
  ];

  it('picks the closest club, not the first one drawn', () => {
    expect(nearestDot(dots, 138, 104, 22)?.slot).toBe(7);
    expect(nearestDot(dots, 96, 97, 22)?.slot).toBe(3);
  });

  it('returns null when the pointer is over empty space', () => {
    expect(nearestDot(dots, 210, 40, 22)).toBeNull();
  });

  it('treats maxDist as a radius, not a bounding box', () => {
    // (dx, dy) = (15, 15) is 21.2 away — inside 22 but outside a 15-square.
    expect(nearestDot(dots, 115, 115, 22)?.slot).toBe(3);
    expect(nearestDot(dots, 116, 116, 22)).toBeNull(); // 22.6 away
  });

  it('breaks a tie on the smaller slot so the card cannot flicker', () => {
    // A monoculture stacks clubs on one point; the tie is real.
    const stacked = [
      { slot: 5, x: 50, y: 50 },
      { slot: 2, x: 50, y: 50 },
      { slot: 8, x: 50, y: 50 },
    ];
    expect(nearestDot(stacked, 50, 50, 22)?.slot).toBe(2);
    expect(nearestDot([...stacked].reverse(), 50, 50, 22)?.slot).toBe(2);
  });

  it('handles an empty league without throwing', () => {
    expect(nearestDot([], 10, 10, 22)).toBeNull();
  });
});

describe('toViewBox', () => {
  const rect = { left: 40, top: 100, width: 840, height: 640 };

  it('maps a click on the rendered box back onto the viewBox', () => {
    // The SVG is drawn at 2× its 420×320 viewBox here.
    expect(toViewBox(40, 100, rect, 420, 320)).toEqual({ x: 0, y: 0 });
    expect(toViewBox(880, 740, rect, 420, 320)).toEqual({ x: 420, y: 320 });
    expect(toViewBox(460, 420, rect, 420, 320)).toEqual({ x: 210, y: 160 });
  });

  it('does not divide by a zero-sized box (a hidden panel measures 0)', () => {
    const p = toViewBox(10, 10, { left: 0, top: 0, width: 0, height: 0 }, 420, 320);
    expect(Number.isFinite(p.x)).toBe(true);
    expect(Number.isFinite(p.y)).toBe(true);
  });
});

/* ---------------- the identity card's placement ---------------- */

describe('cardPlacement', () => {
  const CARD_W = 200;
  const CARD_H = 120;
  const HOST_W = 560;
  const HOST_H = 427;

  it('prefers down-right of the dot', () => {
    const p = cardPlacement(100, 100, CARD_W, CARD_H, HOST_W, HOST_H);
    expect(p.left).toBeGreaterThan(100);
    expect(p.top).toBeGreaterThan(100);
  });

  it('flips left rather than overflowing the right edge', () => {
    const p = cardPlacement(540, 100, CARD_W, CARD_H, HOST_W, HOST_H);
    expect(p.left + CARD_W).toBeLessThanOrEqual(HOST_W);
    expect(p.left).toBeLessThan(540);
  });

  it('flips up rather than overflowing the bottom edge', () => {
    const p = cardPlacement(100, 420, CARD_W, CARD_H, HOST_W, HOST_H);
    expect(p.top + CARD_H).toBeLessThanOrEqual(HOST_H);
    expect(p.top).toBeLessThan(420);
  });

  it('stays on the map in the far corner, where both flips fire at once', () => {
    const p = cardPlacement(559, 426, CARD_W, CARD_H, HOST_W, HOST_H);
    expect(p.left).toBeGreaterThanOrEqual(0);
    expect(p.top).toBeGreaterThanOrEqual(0);
    expect(p.left + CARD_W).toBeLessThanOrEqual(HOST_W);
    expect(p.top + CARD_H).toBeLessThanOrEqual(HOST_H);
  });

  it('pins to the origin when the card is wider than the map (a 320px phone)', () => {
    // No placement fits; clamping must not produce a NEGATIVE offset, which
    // would slide the card's own text off the left edge.
    const p = cardPlacement(150, 80, 260, 300, 240, 183);
    expect(p.left).toBe(0);
    expect(p.top).toBe(0);
  });

  it('keeps the card inside the map for every dot position on a phone', () => {
    const w = 320;
    const h = Math.round(320 * 320 / 420);
    for (let x = 0; x <= w; x += 16) {
      for (let y = 0; y <= h; y += 16) {
        const p = cardPlacement(x, y, 180, 110, w, h);
        expect(p.left).toBeGreaterThanOrEqual(0);
        expect(p.top).toBeGreaterThanOrEqual(0);
        expect(p.left + 180).toBeLessThanOrEqual(w);
        expect(p.top + 110).toBeLessThanOrEqual(h);
      }
    }
  });
});

/* ---------------- what the card claims about movement ---------------- */

describe('axisMove', () => {
  it('reports the change since the ghost season', () => {
    const m = axisMove(1.2, 0.5);
    expect(m.dz).toBeCloseTo(0.7, 10);
    expect(m.arrow).toBe('↑');
  });

  it('points down when the club moved back along the axis', () => {
    expect(axisMove(-0.4, 0.9).arrow).toBe('↓');
  });

  it('says "held its ground" inside the deadband instead of inventing drift', () => {
    expect(axisMove(1.0, 1.0).arrow).toBe('→');
    expect(axisMove(1.0 + STEADY_Z / 2, 1.0).arrow).toBe('→');
    expect(axisMove(1.0 - STEADY_Z / 2, 1.0).arrow).toBe('→');
    expect(axisMove(1.0 + STEADY_Z * 2, 1.0).arrow).toBe('↑');
  });

  it('claims no movement at all when there is no earlier season', () => {
    const m = axisMove(1.2, null);
    expect(m.dz).toBeNull();
    expect(m.arrow).toBe('→');
    expect(m.z).toBe(1.2);
  });
});

describe('driftMagnitude', () => {
  it('measures the distance travelled across the plotted plane, in sigmas', () => {
    expect(driftMagnitude(axisMove(3, 0), axisMove(4, 0))).toBeCloseTo(5, 10);
  });

  it('is zero for a club that did not move (not a small false positive)', () => {
    expect(driftMagnitude(axisMove(1.5, 1.5), axisMove(-2, -2))).toBe(0);
  });

  it('is null — not 0 — with no ghost season, so the card says so', () => {
    expect(driftMagnitude(axisMove(1, null), axisMove(2, null))).toBeNull();
    expect(driftMagnitude(axisMove(1, 0.5), axisMove(2, null))).toBeNull();
  });
});

/* ---------------- the strings the map puts on screen ---------------- */

describe('scatter localization', () => {
  // The UI is Chinese by default; an untranslated key degrades to English
  // silently, which is exactly the kind of rot nobody notices in review.
  it('translates every string Track D2 added', () => {
    for (const key of [
      'Hollow ring = where every club stood last season; the locked club also trails the seasons before that. Hover a dot for its identity, tap to lock it.',
      'drift',
      'no earlier season yet',
      'Tap the dot again to unpin',
    ]) {
      expect(t(key), key).not.toBe(key);
    }
  });
});
