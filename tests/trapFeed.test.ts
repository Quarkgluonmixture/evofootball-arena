import { describe, expect, it } from 'vitest';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../src/evolution/playerGenome';
import { Match } from '../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';

/** The trap school's feed credit (Phase 115 — the 109 visible-face debt). */

const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};

const neutralSquad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });

function team(name: string, genome: TacticalGenome): TeamInfo {
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
    genome,
    squad: neutralSquad(),
    style: { formationAtk: 'wide-212', formationDef: 'high-line', scheme: 'zonal' },
  };
}

const offsideLines = (trapBias: number, seeds: number[]): string[] => {
  const lines: string[] = [];
  for (const seed of seeds) {
    const g = neutral();
    g.trapBias = trapBias; // B defends with (or without) the trap
    const m = new Match({ seed, teamA: team('Alpha', neutral()), teamB: team('Trappers', g) });
    m.runToCompletion();
    lines.push(...m.events.filter((e) => e.text.includes('Offside') || e.text.includes('🪤')).map((e) => e.text));
  }
  return lines;
};

describe('trap-school feed credit (Phase 115)', () => {
  const SEEDS = [1, 2, 3, 5, 8];

  it('a committed trap side gets the 🪤 line when its flag wins', () => {
    const lines = offsideLines(0.95, SEEDS);
    const trapLines = lines.filter((l) => l.includes('🪤'));
    expect(trapLines.length).toBeGreaterThan(0);
    // Only the TRAP side's flags earn it — the neutral side never does.
    for (const l of trapLines) expect(l).toContain('Trappers line');
  });

  it('a neutral back line keeps the plain call', () => {
    const lines = offsideLines(0.5, SEEDS);
    expect(lines.some((l) => l.includes('🪤'))).toBe(false);
  });
});
