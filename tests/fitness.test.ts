import { describe, expect, it } from 'vitest';
import { computeFitness } from '../src/evolution/fitness';
import { emptyAggregates } from '../src/evolution/franchise';

describe('computeFitness', () => {
  it('more points => higher fitness, all else equal', () => {
    const rows = [0, 1, 2].map((slot) => {
      const agg = emptyAggregates();
      agg.played = 7;
      agg.pts = slot * 6; // 0, 6, 12
      agg.shots = 10;
      agg.xg = 2;
      agg.passes = 100;
      agg.passesCompleted = 70;
      agg.recoveries = 20;
      agg.staminaSpent = 5;
      agg.styleSamples = [
        { passVol: 10, pressVol: 5 },
        { passVol: 10, pressVol: 5 },
      ];
      return { slot, agg };
    });
    const fit = computeFitness(rows);
    expect(fit[2].total).toBeGreaterThan(fit[1].total);
    expect(fit[1].total).toBeGreaterThan(fit[0].total);
  });

  it('inconsistent style is penalized', () => {
    const mk = (samples: Array<{ passVol: number; pressVol: number }>, slot: number) => {
      const agg = emptyAggregates();
      agg.played = 7;
      agg.pts = 10;
      agg.shots = 10;
      agg.xg = 2;
      agg.passes = 100;
      agg.passesCompleted = 70;
      agg.recoveries = 20;
      agg.staminaSpent = 5;
      agg.styleSamples = samples;
      return { slot, agg };
    };
    const steady = mk(
      [
        { passVol: 10, pressVol: 5 },
        { passVol: 10.5, pressVol: 5.2 },
      ],
      0,
    );
    const chaotic = mk(
      [
        { passVol: 2, pressVol: 12 },
        { passVol: 20, pressVol: 1 },
      ],
      1,
    );
    const fit = computeFitness([steady, chaotic]);
    expect(fit[0].components.styleConsistency).toBeGreaterThan(fit[1].components.styleConsistency);
    expect(fit[0].total).toBeGreaterThan(fit[1].total);
  });

  it('components are normalized to [0,1] and weights sum to totals sanely', () => {
    const rows = [0, 1].map((slot) => {
      const agg = emptyAggregates();
      agg.played = 7;
      agg.pts = slot === 0 ? 21 : 0;
      agg.shots = 5 + slot * 10;
      agg.xg = 1 + slot;
      agg.passes = 50;
      agg.passesCompleted = 40;
      agg.recoveries = 10;
      agg.staminaSpent = 4;
      return { slot, agg };
    });
    for (const f of computeFitness(rows)) {
      expect(f.total).toBeGreaterThanOrEqual(0);
      expect(f.total).toBeLessThanOrEqual(1);
      for (const v of Object.values(f.components)) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });
});
