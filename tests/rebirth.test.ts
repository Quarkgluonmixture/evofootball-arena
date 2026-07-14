import { describe, expect, it } from 'vitest';
import type { LineageEntry } from '../src/evolution/franchise';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import { League } from '../src/sim/League';
import { buildCeremony, mutatedGenes, parentChain } from '../src/ui/rebirth';

/**
 * Phase 32.5 — the rebirth ceremony's data layer. The ceremony replays the
 * moment of evolution from the SeasonRecord alone, so the snapshots recorded
 * by evolve.ts (parent/child genomes, the dead club's name, the inherited
 * style) and the pure mining helpers must hold up without any live UI.
 */

const genome = (v: number): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = v;
  return g;
};

// One shared played season — the expensive part — reused by every test below.
let cached: League | null = null;
const playedLeague = (): League => {
  if (cached) return cached;
  const league = new League({ seed: 99, matchDuration: 30 });
  while (!league.seasonDone) {
    const f = league.nextFixture()!;
    league.applyResult(f, league.createMatch(f).runToCompletion());
  }
  league.finishSeason();
  cached = league;
  return league;
};

describe('rebirth snapshots (evolve.ts)', () => {
  it('reborn entries carry the dead name, both parent genomes, child genome and inherited style', () => {
    const league = playedLeague();
    const rec = league.history[league.history.length - 1];
    const reborn = rec.evolution.entries.filter((e) => e.kind === 'reborn');
    expect(reborn.length).toBe(3);
    for (const e of reborn) {
      const f = league.franchise(e.slot);
      expect(e.oldName).toBeDefined();
      expect(e.oldName).not.toBe(e.name);
      expect(e.parentGenomes?.length).toBe(2);
      // The child snapshot IS the newborn's genome, and the parent snapshots
      // match the (still-living, untouched-since) parents' current genomes.
      expect(e.childGenome).toEqual(f.coach.genome);
      expect(e.inheritedStyle).toEqual(f.coach.style);
      e.parents!.forEach((name, i) => {
        const parent = league.franchises.find((x) => x.name === name)!;
        expect(e.parentGenomes![i]).toEqual(parent.coach.genome);
      });
      // Snapshots are COPIES, not references to the living objects.
      expect(e.childGenome).not.toBe(f.coach.genome);
    }
  });

  it('mutated entries carry the style-switch note when one happened', () => {
    // Style switches are rare (~0.08/club/season); assert the FIELD contract,
    // not the roll: every note that exists is a lineage-grade string.
    const league = playedLeague();
    const rec = league.history[league.history.length - 1];
    for (const e of rec.evolution.entries.filter((x) => x.kind === 'mutated')) {
      if (e.note !== undefined) expect(e.note).toMatch(/^🔧 switched to /);
    }
  });

  it('snapshots survive the save round-trip', () => {
    const league = playedLeague();
    const restored = League.fromJSON(JSON.parse(JSON.stringify(league.toJSON())));
    const before = league.history[0].evolution.entries.filter((e) => e.kind === 'reborn');
    const after = restored.history[0].evolution.entries.filter((e) => e.kind === 'reborn');
    expect(after).toEqual(before);
  });
});

describe('mutatedGenes', () => {
  it('flags only genes outside both parents’ range', () => {
    const pa = genome(0.4);
    const pb = genome(0.6);
    const child = genome(0.5); // mean everywhere — pure crossover
    expect(mutatedGenes(child, pa, pb)).toEqual([]);
    child.tempo = 0.9; // above both parents
    child.passBias = 0.1; // below both parents
    child.shootBias = 0.61; // inside the epsilon band — NOT novel
    expect(mutatedGenes(child, pa, pb)).toEqual(['passBias', 'tempo']);
  });
});

describe('parentChain', () => {
  it('reconstructs each incarnation’s born-name from the next rebirth’s "was" note', () => {
    const lineage: LineageEntry[] = [
      { generation: 1, event: 'founded' },
      { generation: 3, event: 'reborn', parents: ['Alpha', 'Beta'], note: 'was Old One' },
      { generation: 5, event: 'mutated' },
      { generation: 7, event: 'reborn', parents: ['Gamma', 'Delta'], note: 'was Middle Child' },
    ];
    const hops = parentChain(lineage, 'Current FC');
    expect(hops).toEqual([
      { generation: 7, child: 'Current FC', parents: ['Gamma', 'Delta'] },
      { generation: 3, child: 'Middle Child', parents: ['Alpha', 'Beta'] },
    ]);
  });

  it('caps the chain', () => {
    const lineage: LineageEntry[] = [1, 2, 3, 4, 5].map((g) => ({
      generation: g, event: 'reborn' as const, parents: ['A', 'B'], note: `was G${g}`,
    }));
    expect(parentChain(lineage, 'Now', 3).length).toBe(3);
  });
});

describe('buildCeremony', () => {
  it('mines deaths, elites and switches from the latest record', () => {
    const league = playedLeague();
    const rec = league.history[league.history.length - 1];
    const model = buildCeremony(rec, league.franchises);
    expect(model.fromGen).toBe(rec.generation);
    expect(model.toGen).toBe(rec.generation + 1);
    expect(model.elites.length).toBe(4);
    expect(model.deaths.length).toBe(3);
    for (const d of model.deaths) {
      expect(d.oldName).not.toBe('?');
      expect(d.parentGenomes).not.toBeNull();
      expect(d.childGenome).not.toBeNull();
      expect(d.inheritedStyle).not.toBeNull();
      expect(d.colors).not.toBeNull();
      // Mutation detection ran against the snapshots.
      expect(Array.isArray(d.mutated)).toBe(true);
    }
  });

  it('falls back to live franchise state on pre-32.5 records (no snapshots)', () => {
    const league = playedLeague();
    const rec = JSON.parse(JSON.stringify(league.history[league.history.length - 1]));
    for (const e of rec.evolution.entries) {
      delete e.oldName;
      delete e.parentGenomes;
      delete e.childGenome;
      delete e.inheritedStyle;
      delete e.note;
    }
    const model = buildCeremony(rec, league.franchises);
    expect(model.deaths.length).toBe(3);
    for (const d of model.deaths) {
      // Parents are D1 survivors — resolvable by name; the child genome comes
      // from the slot's live franchise; the old name from the lineage note.
      expect(d.parentGenomes).not.toBeNull();
      expect(d.childGenome).toEqual(league.franchise(d.slot).coach.genome);
      expect(d.oldName).not.toBe('?');
    }
  });
});
