import { describe, expect, it } from 'vitest';
import type { TacticalGenome } from '../src/evolution/genome';
import { GENE_KEYS } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

/**
 * Phase 58 — the energy economy BINDS. Before this phase full-time stamina
 * sat at 0.98-0.99 (recovery dwarfed drain), so every fatigue payoff —
 * the stamina attribute, staminaConservation's "fresher legs late", the
 * tired-legs brain gate — was dead, and the N1 matrix meta (relentless
 * aggression) ran free of its natural price. These tests pin the mechanism
 * (a lunge costs legs, absorbed by the stamina attribute) and the binding
 * itself (a full match must SPEND the tank, but not empty it).
 */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

const squadOf = (stamina: number): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    p.stamina = stamina;
    return p;
  });

function team(name: string, squad: PlayerAttributes[]): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome: neutral(),
    squad,
    style: { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' },
  };
}

describe('the energy economy binds (Phase 58)', () => {
  it('a tackle lunge spends stamina, scaled down by the stamina attribute', () => {
    const m = new Match({ seed: 7, teamA: team('A', squadOf(0.1)), teamB: team('B', squadOf(0.9)) });
    const weak = m.teams[0].players.find((p) => p.role !== 'GK')!;
    const strong = m.teams[1].players.find((p) => p.role !== 'GK')!;
    const w0 = weak.stamina;
    const s0 = strong.stamina;
    weak.spendBurst(0.02);
    strong.spendBurst(0.02);
    expect(weak.stamina).toBeLessThan(w0);
    expect(strong.stamina).toBeLessThan(s0);
    // The high-stamina motor absorbs the same burst more cheaply.
    expect(w0 - weak.stamina).toBeGreaterThan(s0 - strong.stamina);
    expect(weak.staminaSpent).toBeGreaterThan(strong.staminaSpent);
  });

  it('a full match SPENDS the tank — the gauge can never go dead again', () => {
    // Pre-phase-58 this sat at 0.98-0.99 and every fatigue payoff was
    // decorative. Bind means: meaningfully below full at the whistle,
    // yet nowhere near empty (sludge is a play-feel bug, not a price).
    const ftMeans: number[] = [];
    for (const seed of [11, 42]) {
      const m = new Match({ seed, teamA: team('A', squadOf(0.5)), teamB: team('B', squadOf(0.5)) });
      m.runToCompletion();
      const outfield = [...m.teams[0].players, ...m.teams[1].players].filter((p) => p.role !== 'GK');
      ftMeans.push(outfield.reduce((s, p) => s + p.stamina, 0) / outfield.length);
    }
    const ft = ftMeans.reduce((a, b) => a + b, 0) / ftMeans.length;
    expect(ft).toBeLessThan(0.93);
    expect(ft).toBeGreaterThan(0.35);
  });
});
