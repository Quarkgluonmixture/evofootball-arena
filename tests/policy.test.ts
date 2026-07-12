import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { DEFAULT_POLICY, ROLES, TEAM_SIZE, type TeamInfo } from '../src/sim/types';

// Local neutral helpers (used to live in the removed wildcard module).
const neutralGenome = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const a = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) a[k] = 0.5;
    return a;
  });

const team = (name: string, policy?: TeamInfo['policy'], rolePolicies?: TeamInfo['rolePolicies']): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
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
    // Only the DF turns hoof-happy — the team's play must move. (31: the
    // old ST shoot-skew stopped expressing on single seeds — a striker's
    // choices are dominated by lane geometry now; the DF's clear-vs-pass
    // call under pressure fires every match. Pooled over 3 seeds so one
    // quiet defensive half can't fake a null result.)
    const rolePolicies = ROLES.map((r) =>
      r === 'DF' ? { ...DEFAULT_POLICY, clearBase: 2.5, clearPressureW: 1.5 } : { ...DEFAULT_POLICY },
    );
    let anyDiff = false;
    for (const seed of [7, 11, 42]) {
      const bare = new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 240 }).runToCompletion();
      const skewed = new Match({ seed, teamA: team('A', undefined, rolePolicies), teamB: team('B'), duration: 240 }).runToCompletion();
      if (JSON.stringify(skewed.stats) !== JSON.stringify(bare.stats)) anyDiff = true;
    }
    expect(anyDiff).toBe(true);
  });

  it('a distinct policy actually changes play', () => {
    // Pooled over seeds — a single short match's counter is a small integer
    // that can coincide across configs by chance (a 3-seed pool flipped on
    // engine churn in 28.3). Channel switched shots → clearances in Phase
    // 31: shot volume is no longer monotone in shootBase (a shoot-on-sight
    // policy wastes possessions in the lane-aware economy and can end up
    // OUT-shot — coherent, but useless as a plumbing probe). Clearances
    // are a terminal action with no economy feedback: cranking clearBase
    // moves them 1 → 24 on this pool, a margin engine churn can't erase.
    const hoofHappy = { ...DEFAULT_POLICY, clearBase: 2.5, clearPressureW: 1.5 };
    let bareClears = 0;
    let skewedClears = 0;
    for (const seed of [7, 11, 42, 99, 777, 1234, 5150, 31337]) {
      bareClears += new Match({ seed, teamA: team('A'), teamB: team('B'), duration: 120 })
        .runToCompletion().stats[0].clearances;
      skewedClears += new Match({ seed, teamA: team('A', hoofHappy), teamB: team('B'), duration: 120 })
        .runToCompletion().stats[0].clearances;
    }
    expect(skewedClears).toBeGreaterThan(bareClears + 8);
  });

});
