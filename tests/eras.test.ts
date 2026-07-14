import { describe, expect, it } from 'vitest';
import { detectEras, MIN_ERA_SEASONS } from '../src/evolution/eras';
import { STYLE_DIMS } from '../src/evolution/styleSpace';
import type { SeasonRecord } from '../src/sim/League';
import { DEFAULT_POLICY, type PolicyParams } from '../src/sim/types';

/** A style vector at neutral values with named overrides. */
function vec(overrides: Record<string, number> = {}): number[] {
  return STYLE_DIMS.map((d) =>
    overrides[d.key] ?? (d.kind === 'gene' ? 0.5 : DEFAULT_POLICY[d.key as keyof PolicyParams]));
}

function rec(generation: number, champion: string, style?: number[]): SeasonRecord {
  return {
    generation,
    championSlot: 0,
    championName: champion,
    table: Array.from({ length: 16 }, (_, slot) => ({
      slot, name: `T${slot}`, pts: 10, w: 3, d: 1, l: 3, gf: 8, ga: 8,
      division: (slot < 8 ? 0 : 1) as 0 | 1,
    })),
    fitness: [],
    evolution: { generation: generation + 1, entries: [] },
    styleMatrix: style
      ? Array.from({ length: 16 }, (_, slot) => ({ slot, values: [...style] }))
      : undefined,
  };
}

// Two tactical ages: a passive league that turns into a pressing league.
// The bulk of the drift rides on UN-nameable policy dims (passLaneW etc.)
// so the style word is earned by the one nameable mover: pressIntensity.
const AGE_A = vec({ pressIntensity: 0.2 });
const AGE_B = vec({
  pressIntensity: 0.7,
  passLaneW: DEFAULT_POLICY.passLaneW + 0.18,
  passOpenW: DEFAULT_POLICY.passOpenW + 0.12,
  passOutletMul: DEFAULT_POLICY.passOutletMul + 0.69,
  clearPressureW: DEFAULT_POLICY.clearPressureW + 0.33,
});

describe('detectEras', () => {
  it('splits history where the population centroid jumps, and style-names both ages', () => {
    const h = [
      ...Array.from({ length: 5 }, (_, i) => rec(i + 1, `C${i}`, AGE_A)),
      ...Array.from({ length: 5 }, (_, i) => rec(i + 6, `C${i + 5}`, AGE_B)),
    ];
    const eras = detectEras(h);
    expect(eras).toHaveLength(2);
    expect([eras[0].start, eras[0].end]).toEqual([1, 5]);
    expect([eras[1].start, eras[1].end]).toEqual([6, 10]);
    expect(eras[0].label).toEqual({ kind: 'style', word: 'Passive block' });
    expect(eras[1].label).toEqual({ kind: 'style', word: 'High press' });
  });

  it('never opens an era shorter than the minimum', () => {
    const h = [
      ...Array.from({ length: 2 }, (_, i) => rec(i + 1, `C${i}`, AGE_A)),
      ...Array.from({ length: 8 }, (_, i) => rec(i + 3, `C${i + 2}`, AGE_B)),
    ];
    const eras = detectEras(h);
    expect(eras[0].seasons).toBeGreaterThanOrEqual(MIN_ERA_SEASONS);
  });

  it('a stable history is a single era, and one era cannot be style-named', () => {
    const h = Array.from({ length: 6 }, (_, i) => rec(i + 1, `C${i}`, AGE_A));
    const eras = detectEras(h);
    expect(eras).toHaveLength(1);
    expect(eras[0].label).toEqual({ kind: 'contested' });
  });

  it('crowns a dynasty when one club owns the era, with the honours tally', () => {
    const champs = ['Wolves', 'Wolves', 'Comets', 'Wolves', 'Herons'];
    const h = champs.map((c, i) => rec(i + 1, c, AGE_A));
    const eras = detectEras(h);
    expect(eras).toHaveLength(1);
    expect(eras[0].label).toEqual({ kind: 'dynasty', club: 'Wolves' });
    expect(eras[0].honours[0]).toEqual({ name: 'Wolves', titles: 3 });
  });

  it('handles records that predate the style matrix', () => {
    const h = [
      rec(1, 'Wolves'),
      rec(2, 'Wolves'),
      ...Array.from({ length: 4 }, (_, i) => rec(i + 3, `C${i}`, AGE_A)),
    ];
    const eras = detectEras(h);
    expect(eras.length).toBeGreaterThanOrEqual(2);
    expect(eras[0].label).toEqual({ kind: 'dynasty', club: 'Wolves' });
    expect(detectEras([])).toEqual([]);
  });
});
