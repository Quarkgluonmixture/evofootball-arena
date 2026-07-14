import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { traitsOf } from '../src/evolution/traits';
import { Match } from '../src/sim/Match';
import { Player } from '../src/sim/Player';
import { DT } from '../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

/**
 * Phase 39 — players become PEOPLE. Traits are DERIVED (attrs+role → ≤2),
 * never stored; each carries one small play effect. Directional tests use
 * the DISCONTINUITY method: attrs 0.79 vs 0.81 across a 0.8 bar differ by
 * a hair, so any measurable step is the trait's own effect (§10.5 — no
 * match-stat soups).
 */

const attrs = (over: Partial<PlayerAttributes> = {}): PlayerAttributes => {
  const p = {} as PlayerAttributes;
  for (const k of ATTR_KEYS) p[k] = 0.5;
  return { ...p, ...over };
};

describe('trait derivation (pure)', () => {
  it('thresholds gate, roles gate, and the cap is TWO', () => {
    expect(traitsOf(attrs({ finishing: 0.85 }), 'ST')).toContain('clinical');
    // Below the clinical bar (technique raised so the poacher gate stays shut).
    expect(traitsOf(attrs({ finishing: 0.79, dribbling: 0.65 }), 'ST')).toHaveLength(0);
    expect(traitsOf(attrs({ finishing: 0.85 }), 'DF')).toHaveLength(0); // DFs don't get clinical
    expect(traitsOf(attrs({ passing: 0.85 }), 'MF')).toContain('playmaker');
    expect(traitsOf(attrs({ defending: 0.85 }), 'DF')).toContain('enforcer');
    expect(traitsOf(attrs({ pace: 0.9 }), 'WG')).toContain('engine');
    // The poacher: instinct over craft, strikers only.
    expect(traitsOf(attrs({ finishing: 0.78, dribbling: 0.4 }), 'ST')).toContain('poacher');
    expect(traitsOf(attrs({ finishing: 0.78, dribbling: 0.7 }), 'ST')).toHaveLength(0);
    expect(traitsOf(attrs({ finishing: 0.78, dribbling: 0.4 }), 'WG')).toHaveLength(0);
    // Keepers are keepers.
    expect(traitsOf(attrs({ reflexes: 0.9 }), 'GK')).toEqual(['cat']);
    expect(traitsOf(attrs({ finishing: 0.95, passing: 0.95 }), 'GK')).toHaveLength(0);
    // Cap at 2, ranked by excess.
    // dribbling raised too: the poacher gate (ST fin≥0.75 + drb<0.6) must
    // stay SHUT here or poacher's 0.20 excess outranks clinical's 0.15.
    const many = traitsOf(attrs({ finishing: 0.95, passing: 0.85, dribbling: 0.85, defending: 0.9, pace: 0.9 }), 'ST');
    expect(many).toHaveLength(2);
    expect(many[0]).toBe('clinical'); // biggest excess (0.15)
  });

  it('derivation is deterministic and pure', () => {
    const a = attrs({ finishing: 0.9, passing: 0.82 });
    expect(traitsOf(a, 'ST')).toEqual(traitsOf(a, 'ST'));
    expect(a.finishing).toBe(0.9);
  });
});

describe('trait effects reach the sim', () => {
  it('engine: the cached drain factor steps across the bar', () => {
    const engine = new Player(0, 5, 'ST', 'E', attrs({ pace: 0.83 }));
    const plain = new Player(0, 5, 'ST', 'P', attrs({ pace: 0.81 }));
    expect(engine.staminaDrainMul).toBe(0.9);
    expect(plain.staminaDrainMul).toBe(1);
  });

  it('the captain is the oldest cool head, deterministically', () => {
    const genome = (() => {
      const g = {} as TacticalGenome;
      for (const k of GENE_KEYS) g[k] = 0.5;
      return g;
    })();
    const squad = Array.from({ length: TEAM_SIZE }, () => attrs());
    squad[2] = attrs({ passing: 0.9, dribbling: 0.9 }); // MF: sharp but young
    const info: TeamInfo = {
      id: 'A', name: 'A', short: 'AAA',
      colors: { primary: 1, secondary: 2 },
      playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
      genome, squad,
      ages: [30, 24, 22, 34, 24, 24], // Wl: old with average technique
    };
    const m = new Match({ seed: 1, teamA: info, teamB: { ...info, id: 'B', name: 'B' }, duration: 60 });
    // Wl: 34·0.5 = 17 < Mf: 22·0.9 = 19.8 — the young technician wears it.
    expect(m.teams[0].captain).toBe(2);
    // The keeper never captains (index 0 excluded).
    expect(m.teams[0].captain).not.toBe(0);
    void DT;
  });
});
