import { clamp01, mean, stddev } from '../utils/math';
import type { SeasonAggregates } from './franchise';

/**
 * Multi-factor fitness. Winning matters most, but teams are also rewarded for
 * HOW they play, so evolution can climb gradients even between teams with the
 * same points. Every component is min-max normalized across the league, so
 * fitness is relative to the current population (weights sum to 1):
 *
 *   points            0.28  — league performance
 *   goal difference   0.15  — margin quality
 *   shot quality      0.12  — avg xG per shot (chance creation quality)
 *   pass completion   0.12  — technical security
 *   recoveries        0.11  — defensive activity (interceptions + tackles) per match
 *   stamina efficiency 0.10 — points achieved per unit of energy burned
 *   style consistency 0.12  — plays the same identifiable way every match
 */
export interface FitnessComponents {
  points: number;
  goalDiff: number;
  shotQuality: number;
  passCompletion: number;
  recoveries: number;
  staminaEfficiency: number;
  styleConsistency: number;
}

export interface FitnessBreakdown {
  slot: number;
  total: number;
  components: FitnessComponents;
}

export const FITNESS_WEIGHTS: FitnessComponents = {
  points: 0.28,
  goalDiff: 0.15,
  shotQuality: 0.12,
  passCompletion: 0.12,
  recoveries: 0.11,
  staminaEfficiency: 0.1,
  styleConsistency: 0.12,
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
  const played = rows.map((r) => Math.max(r.agg.played, 1));

  const raw = {
    points: rows.map((r) => r.agg.pts),
    goalDiff: rows.map((r) => r.agg.gf - r.agg.ga),
    shotQuality: rows.map((r) => r.agg.xg / Math.max(r.agg.shots, 1)),
    passCompletion: rows.map((r) => r.agg.passesCompleted / Math.max(r.agg.passes, 1)),
    recoveries: rows.map((r, i) => r.agg.recoveries / played[i]),
    staminaEfficiency: rows.map((r) => (r.agg.pts + 1) / Math.max(r.agg.staminaSpent, 0.1)),
    styleConsistency: rows.map((r) => styleConsistencyOf(r.agg)),
  };

  const norm: Record<keyof FitnessComponents, number[]> = {
    points: minMax(raw.points),
    goalDiff: minMax(raw.goalDiff),
    shotQuality: minMax(raw.shotQuality),
    passCompletion: minMax(raw.passCompletion),
    recoveries: minMax(raw.recoveries),
    staminaEfficiency: minMax(raw.staminaEfficiency),
    styleConsistency: minMax(raw.styleConsistency),
  };

  return rows.map((r, i) => {
    const components = {
      points: norm.points[i],
      goalDiff: norm.goalDiff[i],
      shotQuality: norm.shotQuality[i],
      passCompletion: norm.passCompletion[i],
      recoveries: norm.recoveries[i],
      staminaEfficiency: norm.staminaEfficiency[i],
      styleConsistency: norm.styleConsistency[i],
    };
    let total = 0;
    for (const k of Object.keys(components) as Array<keyof FitnessComponents>) {
      total += components[k] * FITNESS_WEIGHTS[k];
    }
    return { slot: r.slot, total, components };
  });
}
