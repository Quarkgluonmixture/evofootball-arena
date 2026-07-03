import { describe, expect, it } from 'vitest';
import { POLICY_BOUNDS, POLICY_KEYS, clampPolicy, crossoverPolicy, mutatePolicy } from '../src/ai/policy';
import { buildWildcardTeamInfo, neutralGenome, neutralSquad } from '../src/ai/wildcard';
import { WILDCARD_POLICY } from '../src/ai/wildcardPolicy';
import { Match } from '../src/sim/Match';
import { DEFAULT_POLICY, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

const team = (name: string, policy?: TeamInfo['policy']): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
  genome: neutralGenome(),
  squad: neutralSquad(),
  policy,
});

describe('policy parameterization (Phase 18)', () => {
  it('no policy ≡ explicit DEFAULT_POLICY, bit for bit', () => {
    // The refactor's core guarantee: parameterizing the brain changed nothing.
    for (const seed of [11, 4242]) {
      const bare = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 }).runToCompletion();
      const explicit = new Match({
        seed,
        teamA: team('A', { ...DEFAULT_POLICY }),
        teamB: team('B', { ...DEFAULT_POLICY }),
        duration: 120,
      }).runToCompletion();
      expect(explicit.score).toEqual(bare.score);
      expect(JSON.stringify(explicit.stats)).toBe(JSON.stringify(bare.stats));
      expect(explicit.events.length).toBe(bare.events.length);
    }
  });

  it('a distinct policy actually changes play', () => {
    const shootHappy = { ...DEFAULT_POLICY, shootBase: 4.0, passBase: 0.05 };
    const bare = new Match({ seed: 7, teamA: team('A'), teamB: team('B'), duration: 120 }).runToCompletion();
    const skewed = new Match({ seed: 7, teamA: team('A', shootHappy), teamB: team('B'), duration: 120 }).runToCompletion();
    expect(skewed.stats[0].shots).not.toBe(bare.stats[0].shots);
  });

  it('DEFAULT_POLICY sits inside the ES search bounds', () => {
    for (const k of POLICY_KEYS) {
      const [lo, hi] = POLICY_BOUNDS[k];
      expect(DEFAULT_POLICY[k]).toBeGreaterThanOrEqual(lo);
      expect(DEFAULT_POLICY[k]).toBeLessThanOrEqual(hi);
    }
  });

  it('mutation/crossover are deterministic, bounded and seed-sensitive', () => {
    const a = mutatePolicy(DEFAULT_POLICY, new Rng(5), 0.12);
    const b = mutatePolicy(DEFAULT_POLICY, new Rng(5), 0.12);
    const c = mutatePolicy(DEFAULT_POLICY, new Rng(6), 0.12);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    for (const k of POLICY_KEYS) {
      const [lo, hi] = POLICY_BOUNDS[k];
      expect(a[k]).toBeGreaterThanOrEqual(lo);
      expect(a[k]).toBeLessThanOrEqual(hi);
    }
    const x = crossoverPolicy(a, c, new Rng(9));
    for (const k of POLICY_KEYS) expect([a[k], c[k]]).toContain(x[k]);
    expect(clampPolicy({ ...DEFAULT_POLICY, shootBase: 99 }).shootBase).toBe(POLICY_BOUNDS.shootBase[1]);
  });

  it('the trained wildcard policy is valid and playable', () => {
    for (const k of POLICY_KEYS) {
      const [lo, hi] = POLICY_BOUNDS[k];
      expect(WILDCARD_POLICY[k]).toBeGreaterThanOrEqual(lo);
      expect(WILDCARD_POLICY[k]).toBeLessThanOrEqual(hi);
    }
    const wc = buildWildcardTeamInfo(WILDCARD_POLICY);
    const r = new Match({ seed: 3, teamA: wc, teamB: team('B'), duration: 120 }).runToCompletion();
    expect(r.duration).toBe(120);
    // Same seed, same opponent: the learned policy plays differently from default.
    const base = new Match({ seed: 3, teamA: buildWildcardTeamInfo(undefined), teamB: team('B'), duration: 120 }).runToCompletion();
    expect(JSON.stringify(r.stats)).not.toBe(JSON.stringify(base.stats));
  });
});
