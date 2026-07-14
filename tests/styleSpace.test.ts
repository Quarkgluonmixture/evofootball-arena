import { describe, expect, it } from 'vitest';
import { GENE_KEYS, type TacticalGenome } from '../src/evolution/genome';
import {
  STYLE_DIMS, dimStats, nameplateFor, nameplates, styleSpread, styleValues, topVarianceDims,
} from '../src/evolution/styleSpace';
import { League } from '../src/sim/League';

/**
 * Phase 49 — the style space is DATA-DRIVEN: nameplates come from deviation
 * against the current population (never fixed buckets), axes from where the
 * population actually disagrees. These pin the grammar's mechanics; which
 * names any real club wears is evolution's business.
 */

const flat = (v: number, over: Partial<TacticalGenome> = {}): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = v;
  return { ...g, ...over };
};

describe('style space (Phase 49)', () => {
  it('vector covers genes + policy dims; missing policy reads DEFAULT', () => {
    const v = styleValues({ genome: flat(0.5) });
    expect(v.length).toBe(STYLE_DIMS.length);
    expect(v[0]).toBe(0.5); // first gene
    // policy dims present with defaults
    expect(v.filter((x) => x > 0).length).toBeGreaterThan(GENE_KEYS.length);
  });

  it('the deviant club is NAMED by its deviation; the conformist reads Balanced', () => {
    const clubs = [
      ...Array.from({ length: 8 }, () => ({ genome: flat(0.5) })),
      { genome: flat(0.5, { pressIntensity: 0.95 }) },
    ];
    const plates = nameplates(clubs);
    expect(plates[8]).toContain('High press');
    expect(plates[0]).toEqual(['Balanced']);
  });

  it('direction matters: the low-width outlier wears the narrow word', () => {
    const clubs = [
      ...Array.from({ length: 8 }, () => ({ genome: flat(0.5) })),
      { genome: flat(0.5, { attackingWidth: 0.05 }) },
    ];
    expect(nameplates(clubs)[8]).toContain('Narrow knife');
  });

  it('nameplates cap at 2, ranked by |z|', () => {
    // The population VARIES in tempo/dribble (real σ ⇒ moderate z for the
    // outlier there) but agrees on press (σ floored ⇒ a press deviation is
    // a huge z) — the ranking must put the press word first. A flat
    // population can't test ranking: single-outlier z is constant in d.
    const clubs = [
      ...Array.from({ length: 8 }, (_, i) => ({
        genome: flat(0.5, { tempo: 0.2 + i * 0.08, dribbleBias: 0.25 + i * 0.07 }),
      })),
      { genome: flat(0.5, { pressIntensity: 0.62, tempo: 0.9, dribbleBias: 0.85 }) },
    ];
    const plate = nameplates(clubs)[8];
    expect(plate.length).toBe(2);
    expect(plate[0]).toBe('High press');
  });

  it('topVarianceDims picks the dims with injected variance', () => {
    const clubs = Array.from({ length: 10 }, (_, i) => ({
      genome: flat(0.5, { tempo: 0.1 + i * 0.08, formationDepth: 0.9 - i * 0.07 }),
    }));
    const [a, b] = topVarianceDims(dimStats(clubs.map(styleValues)));
    const keys = [STYLE_DIMS[a].key, STYLE_DIMS[b].key].sort();
    expect(keys).toEqual(['formationDepth', 'tempo']);
  });

  it('styleSpread is 0 for a monoculture and positive for a spread population', () => {
    const mono = Array.from({ length: 8 }, () => ({ genome: flat(0.5) }));
    expect(styleSpread(dimStats(mono.map(styleValues)))).toBeCloseTo(0, 9);
    const varied = Array.from({ length: 8 }, (_, i) => ({ genome: flat(0.2 + i * 0.08) }));
    expect(styleSpread(dimStats(varied.map(styleValues)))).toBeGreaterThan(0.05);
  });

  it('nameplateFor is pure and deterministic', () => {
    const pop = Array.from({ length: 9 }, (_, i) => styleValues({ genome: flat(0.3 + i * 0.05) }));
    const stats = dimStats(pop);
    expect(nameplateFor(pop[8], stats)).toEqual(nameplateFor(pop[8], stats));
  });

  it('season records carry the styleMatrix snapshot for trails + divergence', () => {
    const league = new League({ seed: 17, matchDuration: 30 });
    while (!league.seasonDone) {
      const f = league.nextFixture()!;
      league.applyResult(f, league.createMatch(f).runToCompletion());
    }
    const rec = league.finishSeason();
    expect(rec.styleMatrix).toBeDefined();
    expect(rec.styleMatrix!.length).toBe(16);
    expect(rec.styleMatrix![0].values.length).toBe(STYLE_DIMS.length);
  });
});
