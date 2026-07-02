import { describe, expect, it } from 'vitest';
import { Rng, hashSeed } from '../src/utils/rng';

describe('Rng', () => {
  it('is deterministic for the same seed', () => {
    const a = new Rng(42);
    const b = new Rng(42);
    for (let i = 0; i < 100; i++) expect(a.next()).toBe(b.next());
  });

  it('produces different streams for different seeds', () => {
    const a = new Rng(1);
    const b = new Rng(2);
    const same = Array.from({ length: 20 }, () => a.next() === b.next()).filter(Boolean);
    expect(same.length).toBeLessThan(3);
  });

  it('stays in [0,1) and respects range/int bounds', () => {
    const rng = new Rng(7);
    for (let i = 0; i < 1000; i++) {
      const v = rng.next();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
      const r = rng.range(-5, 5);
      expect(r).toBeGreaterThanOrEqual(-5);
      expect(r).toBeLessThan(5);
      const n = rng.int(0, 3);
      expect(n).toBeGreaterThanOrEqual(0);
      expect(n).toBeLessThanOrEqual(3);
    }
  });

  it('gaussian is finite and roughly centered', () => {
    const rng = new Rng(11);
    let sum = 0;
    for (let i = 0; i < 2000; i++) {
      const g = rng.gaussian();
      expect(Number.isFinite(g)).toBe(true);
      sum += g;
    }
    expect(Math.abs(sum / 2000)).toBeLessThan(0.1);
  });

  it('hashSeed separates nearby inputs', () => {
    const s = new Set([hashSeed(1, 1, 1), hashSeed(1, 1, 2), hashSeed(1, 2, 1), hashSeed(2, 1, 1)]);
    expect(s.size).toBe(4);
  });
});
