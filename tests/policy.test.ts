import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DEFAULT_POLICY, ROLES, type TeamInfo } from '../src/sim/types';

// Local neutral helpers (used to live in the removed wildcard module).
const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: 5 }, () => {
    const a = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) a[k] = 0.5;
    return a;
  });

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
    // Pooled over seeds — a single short match's shot count is a small
    // integer that can coincide across configs by chance (a 3-seed pool
    // flipped on engine churn in 28.3; 8 carries the large true effect).
    const shootHappy = { ...DEFAULT_POLICY, shootBase: 4.0, passBase: 0.05 };
    let bareShots = 0;
    let skewedShots = 0;
    for (const seed of [7, 11, 42, 99, 777, 1234, 5150, 31337]) {
      bareShots += new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 })
        .runToCompletion().stats[0].shots;
      skewedShots += new Match({ seed, teamA: team('A', shootHappy), teamB: team('B'), duration: 120 })
        .runToCompletion().stats[0].shots;
    }
    expect(skewedShots).toBeGreaterThan(bareShots);
  });

});
