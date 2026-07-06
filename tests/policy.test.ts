import { describe, expect, it } from 'vitest';
import {
  POLICY_BOUNDS, POLICY_KEYS, candidateFrom, clampPolicy, crossoverCandidate, crossoverPolicy,
  mutateCandidate, mutatePolicy,
} from '../src/ai/policy';
import { buildWildcardTeamInfo, neutralGenome, neutralSquad } from '../src/ai/wildcard';
import { WILDCARD } from '../src/ai/wildcardPolicy';
import { GENE_KEYS } from '../src/evolution/genome';
import { Match } from '../src/sim/Match';
import { DEFAULT_POLICY, ROLES, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

const team = (name: string, policy?: TeamInfo['policy'], rolePolicies?: TeamInfo['rolePolicies']): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wg', 'St'],
  genome: neutralGenome(),
  squad: neutralSquad(),
  policy,
  rolePolicies,
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

  it('explicit per-role defaults ≡ bare, bit for bit (Phase 23 plumbing)', () => {
    for (const seed of [11, 4242]) {
      const bare = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 }).runToCompletion();
      const perRole = new Match({
        seed,
        teamA: team('A', undefined, ROLES.map(() => ({ ...DEFAULT_POLICY }))),
        teamB: team('B', undefined, ROLES.map(() => ({ ...DEFAULT_POLICY }))),
        duration: 120,
      }).runToCompletion();
      expect(perRole.score).toEqual(bare.score);
      expect(JSON.stringify(perRole.stats)).toBe(JSON.stringify(bare.stats));
      expect(perRole.events.length).toBe(bare.events.length);
    }
  });

  it('a single role vector changes play (others stay default)', () => {
    // Only the striker turns shoot-happy — the team's play must move.
    const rolePolicies = ROLES.map((r) =>
      r === 'ST' ? { ...DEFAULT_POLICY, shootBase: 4.0, passBase: 0.05 } : { ...DEFAULT_POLICY },
    );
    const bare = new Match({ seed: 7, teamA: team('A'), teamB: team('B'), duration: 120 }).runToCompletion();
    const skewed = new Match({ seed: 7, teamA: team('A', undefined, rolePolicies), teamB: team('B'), duration: 120 }).runToCompletion();
    expect(JSON.stringify(skewed.stats)).not.toBe(JSON.stringify(bare.stats));
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

  it('candidate mutation/crossover are deterministic, bounded and complete (Phase 23)', () => {
    const seedCand = candidateFrom(neutralGenome(), DEFAULT_POLICY);
    expect(seedCand.policies).toHaveLength(ROLES.length);
    const a = mutateCandidate(seedCand, new Rng(5), 0.12);
    const b = mutateCandidate(seedCand, new Rng(5), 0.12);
    const c = mutateCandidate(seedCand, new Rng(6), 0.12);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
    for (const g of GENE_KEYS) {
      expect(a.genome[g]).toBeGreaterThanOrEqual(0);
      expect(a.genome[g]).toBeLessThanOrEqual(1);
    }
    for (const p of a.policies) {
      for (const k of POLICY_KEYS) {
        const [lo, hi] = POLICY_BOUNDS[k];
        expect(p[k]).toBeGreaterThanOrEqual(lo);
        expect(p[k]).toBeLessThanOrEqual(hi);
      }
    }
    // Role vectors mutate independently — co-training has per-role freedom.
    expect(JSON.stringify(a.policies[0])).not.toBe(JSON.stringify(a.policies[4]));
    const x = crossoverCandidate(a, c, new Rng(9));
    for (const g of GENE_KEYS) expect([a.genome[g], c.genome[g]]).toContain(x.genome[g]);
    for (let i = 0; i < ROLES.length; i++) {
      for (const k of POLICY_KEYS) expect([a.policies[i][k], c.policies[i][k]]).toContain(x.policies[i][k]);
    }
  });

  it('the trained wildcard candidate is valid and playable', () => {
    expect(WILDCARD.policies).toHaveLength(ROLES.length);
    for (const p of WILDCARD.policies) {
      for (const k of POLICY_KEYS) {
        const [lo, hi] = POLICY_BOUNDS[k];
        expect(p[k]).toBeGreaterThanOrEqual(lo);
        expect(p[k]).toBeLessThanOrEqual(hi);
      }
    }
    for (const g of GENE_KEYS) {
      expect(WILDCARD.genome[g]).toBeGreaterThanOrEqual(0);
      expect(WILDCARD.genome[g]).toBeLessThanOrEqual(1);
    }
    const wc = buildWildcardTeamInfo(WILDCARD);
    const r = new Match({ seed: 3, teamA: wc, teamB: team('B'), duration: 120 }).runToCompletion();
    expect(r.duration).toBe(120);
    // Same seed, same opponent: the learned candidate plays differently from default.
    const base = new Match({ seed: 3, teamA: buildWildcardTeamInfo(undefined), teamB: team('B'), duration: 120 }).runToCompletion();
    expect(JSON.stringify(r.stats)).not.toBe(JSON.stringify(base.stats));
  });
});
