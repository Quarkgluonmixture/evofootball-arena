import { describe, expect, it } from 'vitest';
import { approachV, clampLen, closestPointOnSegment, dist, len, norm, v2 } from '../src/utils/vec';

describe('vec', () => {
  it('norm is zero-safe', () => {
    const z = norm(v2(0, 0));
    expect(z.x).toBe(0);
    expect(z.y).toBe(0);
    const n = norm(v2(3, 4));
    expect(len(n)).toBeCloseTo(1);
  });

  it('clampLen limits magnitude', () => {
    expect(len(clampLen(v2(10, 0), 3))).toBeCloseTo(3);
    expect(len(clampLen(v2(1, 0), 3))).toBeCloseTo(1);
  });

  it('approachV converges without overshoot', () => {
    let cur = v2(0, 0);
    const target = v2(1, 0);
    for (let i = 0; i < 20; i++) cur = approachV(cur, target, 0.1);
    expect(dist(cur, target)).toBeLessThan(1e-9);
  });

  it('closestPointOnSegment clamps to endpoints', () => {
    const a = v2(0, 0);
    const b = v2(10, 0);
    expect(closestPointOnSegment(a, b, v2(-5, 3)).x).toBe(0);
    expect(closestPointOnSegment(a, b, v2(15, 3)).x).toBe(10);
    expect(closestPointOnSegment(a, b, v2(5, 3)).x).toBeCloseTo(5);
    // degenerate zero-length segment
    const p = closestPointOnSegment(a, a, v2(1, 1));
    expect(p.x).toBe(0);
  });
});
