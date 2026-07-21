import type { ComparablePassPayoffV1 } from './oracle-v2';

export type ComparablePayoffDimension = keyof ComparablePassPayoffV1;
export type ComparablePassPayoffVector = Readonly<
  Record<ComparablePayoffDimension, number>
>;
export type PayoffRelation =
  | 'alternativeDominates'
  | 'chosenDominates'
  | 'equivalent'
  | 'tradeoff';

export const COMPARABLE_PAYOFF_DIMENSIONS: readonly ComparablePayoffDimension[] = [
  'physicalControlValue',
  'goalDelta',
  'xgDelta',
  'actionProgressionMetres',
  'ownExecutableExitOptions',
];

export const COMPARABLE_PAYOFF_V1_TOLERANCE: Readonly<
  Record<ComparablePayoffDimension, number>
> = {
  physicalControlValue: 0,
  goalDelta: 0,
  xgDelta: 0.01,
  actionProgressionMetres: 0.5,
  ownExecutableExitOptions: 0,
};

export function compareComparablePassPayoffs(
  alternative: ComparablePassPayoffVector,
  chosen: ComparablePassPayoffVector,
): PayoffRelation {
  let alternativeNoWorse = true;
  let chosenNoWorse = true;
  let alternativeStrict = false;
  let chosenStrict = false;
  for (const dimension of COMPARABLE_PAYOFF_DIMENSIONS) {
    const delta = alternative[dimension] - chosen[dimension];
    const tolerance = COMPARABLE_PAYOFF_V1_TOLERANCE[dimension];
    if (delta < -tolerance) alternativeNoWorse = false;
    if (delta > tolerance) chosenNoWorse = false;
    if (delta > tolerance) alternativeStrict = true;
    if (delta < -tolerance) chosenStrict = true;
  }
  if (alternativeNoWorse && alternativeStrict) return 'alternativeDominates';
  if (chosenNoWorse && chosenStrict) return 'chosenDominates';
  if (!alternativeStrict && !chosenStrict) return 'equivalent';
  return 'tradeoff';
}

export interface LegacyRolloutOutcome {
  readonly possession: number;
  readonly goalDelta: number;
  readonly xgDelta: number;
  readonly progressionMetres: number;
  readonly exitOptionCount: number;
}

/** Algorithm-parity adapter only; it does not make legacy semantics authoritative. */
export const legacyOutcomeAsComparableTuple = (
  outcome: LegacyRolloutOutcome,
): ComparablePassPayoffV1 => ({
  physicalControlValue: outcome.possession as -1 | 0 | 1,
  goalDelta: outcome.goalDelta,
  xgDelta: outcome.xgDelta,
  actionProgressionMetres: outcome.progressionMetres,
  ownExecutableExitOptions: outcome.exitOptionCount,
});

export const compareLegacyPassPayoffs = (
  alternative: LegacyRolloutOutcome,
  chosen: LegacyRolloutOutcome,
): PayoffRelation => compareComparablePassPayoffs(
  legacyOutcomeAsComparableTuple(alternative),
  legacyOutcomeAsComparableTuple(chosen),
);

export function meanComparablePassPayoffs(
  samples: readonly ComparablePassPayoffV1[],
): ComparablePassPayoffVector {
  if (samples.length === 0) throw new Error('cannot average an empty payoff sample');
  const sum: Record<ComparablePayoffDimension, number> = {
    physicalControlValue: 0,
    goalDelta: 0,
    xgDelta: 0,
    actionProgressionMetres: 0,
    ownExecutableExitOptions: 0,
  };
  for (const sample of samples) {
    for (const dimension of COMPARABLE_PAYOFF_DIMENSIONS) {
      sum[dimension] += sample[dimension];
    }
  }
  const denominator = samples.length;
  return {
    physicalControlValue: sum.physicalControlValue / denominator,
    goalDelta: sum.goalDelta / denominator,
    xgDelta: sum.xgDelta / denominator,
    actionProgressionMetres: sum.actionProgressionMetres / denominator,
    ownExecutableExitOptions: sum.ownExecutableExitOptions / denominator,
  };
}
