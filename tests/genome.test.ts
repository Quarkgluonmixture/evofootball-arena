import { describe, expect, it } from 'vitest';
import { GENE_KEYS, crossoverGenomes, describeIdentity, mutateGenome, randomGenome } from '../src/evolution/genome';
import { Rng } from '../src/utils/rng';

describe('TacticalGenome', () => {
  it('random genomes stay in [0,1]', () => {
    const rng = new Rng(1);
    for (let i = 0; i < 50; i++) {
      const g = randomGenome(rng);
      for (const k of GENE_KEYS) {
        expect(g[k]).toBeGreaterThanOrEqual(0);
        expect(g[k]).toBeLessThanOrEqual(1);
      }
    }
  });

  it('mutation is bounded and deterministic', () => {
    const g = randomGenome(new Rng(2));
    const m1 = mutateGenome(g, new Rng(3));
    const m2 = mutateGenome(g, new Rng(3));
    for (const k of GENE_KEYS) {
      expect(m1[k]).toBe(m2[k]);
      expect(m1[k]).toBeGreaterThanOrEqual(0);
      expect(m1[k]).toBeLessThanOrEqual(1);
    }
    // original untouched
    expect(g).not.toBe(m1);
  });

  it('crossover children stay within parents gene bounds', () => {
    const rng = new Rng(4);
    const a = randomGenome(rng);
    const b = randomGenome(rng);
    const child = crossoverGenomes(a, b, new Rng(5));
    for (const k of GENE_KEYS) {
      expect(child[k]).toBeGreaterThanOrEqual(Math.min(a[k], b[k]) - 1e-9);
      expect(child[k]).toBeLessThanOrEqual(Math.max(a[k], b[k]) + 1e-9);
    }
  });

  it('identity tags reflect extreme genes', () => {
    const g = randomGenome(new Rng(6));
    g.pressIntensity = 0.9;
    expect(describeIdentity(g)).toContain('Gegenpress');
  });
});
