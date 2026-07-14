import { clamp01, mean, stddev } from '../utils/math';
import type { SeasonAggregates } from './franchise';

/**
 * Results-dominant fitness (Phase 50 — the emergence pivot's selection
 * slimming). The pre-50 mix paid THREE uniform virtues — pass completion,
 * recoveries, stamina efficiency — which rewarded every club for playing the
 * SAME texture (possession + pressing + economy): a hidden convergence
 * pressure, and `recoveries` directly fed the press-inflation equilibrium
 * (evo-drift press → 0.75-0.94). WINNING is the selector now; HOW you win is
 * style, and style is priced only for being consistently ITSELF:
 *
 *   points            0.50  — league performance (the selector)
 *   goal difference   0.25  — margin quality (smooth gradient between equals)
 *   shot quality      0.10  — avg xG per shot: a forward-looking tiebreaker,
 *                             kept small (it is mildly virtue-flavored)
 *   style consistency 0.15  — plays the same identifiable way every match
 *                             (style-NEUTRAL: rewards having an identity,
 *                             never which identity)
 *
 * Every component is min-max normalized across the group (weights sum to 1).
 */
export interface FitnessComponents {
  points: number;
  goalDiff: number;
  shotQuality: number;
  styleConsistency: number;
}

export interface FitnessBreakdown {
  slot: number;
  total: number;
  components: FitnessComponents;
}

export const FITNESS_WEIGHTS: FitnessComponents = {
  points: 0.5,
  goalDiff: 0.25,
  shotQuality: 0.1,
  styleConsistency: 0.15,
};

function minMax(values: number[]): number[] {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  if (hi - lo < 1e-9) return values.map(() => 0.5);
  return values.map((v) => (v - lo) / (hi - lo));
}

/** Coefficient-of-variation based consistency: 1 = identical style every match. */
function styleConsistencyOf(agg: SeasonAggregates): number {
  const s = agg.styleSamples;
  if (s.length < 2) return 0.5;
  const passVols = s.map((x) => x.passVol);
  const pressVols = s.map((x) => x.pressVol);
  const cv = (xs: number[]) => stddev(xs) / (Math.abs(mean(xs)) + 1e-6);
  return clamp01(1 - (cv(passVols) + cv(pressVols)) / 2);
}

export function computeFitness(rows: Array<{ slot: number; agg: SeasonAggregates }>): FitnessBreakdown[] {
  const raw = {
    points: rows.map((r) => r.agg.pts),
    goalDiff: rows.map((r) => r.agg.gf - r.agg.ga),
    shotQuality: rows.map((r) => r.agg.xg / Math.max(r.agg.shots, 1)),
    styleConsistency: rows.map((r) => styleConsistencyOf(r.agg)),
  };

  const norm: Record<keyof FitnessComponents, number[]> = {
    points: minMax(raw.points),
    goalDiff: minMax(raw.goalDiff),
    shotQuality: minMax(raw.shotQuality),
    styleConsistency: minMax(raw.styleConsistency),
  };

  return rows.map((r, i) => {
    const components = {
      points: norm.points[i],
      goalDiff: norm.goalDiff[i],
      shotQuality: norm.shotQuality[i],
      styleConsistency: norm.styleConsistency[i],
    };
    let total = 0;
    for (const k of Object.keys(components) as Array<keyof FitnessComponents>) {
      total += components[k] * FITNESS_WEIGHTS[k];
    }
    return { slot: r.slot, total, components };
  });
}
