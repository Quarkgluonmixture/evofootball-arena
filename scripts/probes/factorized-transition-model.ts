import {
  fitRelativeTransitionSoftmaxV1,
  fitTransitionSoftmaxV1,
  predictTransitionProbabilitiesV1,
  TRANSITION_CLASS_COUNT,
  type TransitionSoftmaxModelV1,
} from './transition-probability-model';

export const FACTORIZED_TRANSITION_MODEL_VERSION = 'factorized-transition-v1' as const;
export const FACTORIZED_BALANCING_ITERATIONS = 128;
export const FACTORIZED_PROBABILITY_FLOOR = 1e-12;

export interface FactorizedTransitionTrainingRow {
  readonly actionFeatures: readonly number[];
  readonly stateFeatures: readonly number[];
  readonly label: number;
}

export interface FactorizedTransitionModelV1 {
  readonly version: typeof FACTORIZED_TRANSITION_MODEL_VERSION;
  readonly stateModel: TransitionSoftmaxModelV1;
  readonly relativeModel: TransitionSoftmaxModelV1;
}

export interface FactorizedTransitionCandidate {
  readonly candidateKey: number;
  readonly actionFeatures: readonly number[];
  readonly stateFeatures: readonly number[];
}

export interface FactorizedTransitionPrediction {
  readonly stateProbabilities: readonly number[];
  readonly candidates: readonly {
    readonly candidateKey: number;
    readonly probabilities: readonly number[];
  }[];
  readonly maxRowSumError: number;
  readonly meanVectorL1Error: number;
}

const relativeFeatures = (
  action: readonly number[],
  state: readonly number[],
): number[] => {
  if (
    action.length === 0
    || action.length !== state.length
    || !action.every(Number.isFinite)
    || !state.every(Number.isFinite)
  ) throw new Error('invalid factorized transition features');
  return action.map((value, index) => value - state[index]);
};

export function fitFactorizedTransitionModelV1(
  rows: readonly FactorizedTransitionTrainingRow[],
): FactorizedTransitionModelV1 {
  if (rows.length === 0) throw new Error('factorized transition model needs rows');
  const labels = rows.map((row) => row.label);
  return {
    version: FACTORIZED_TRANSITION_MODEL_VERSION,
    stateModel: fitTransitionSoftmaxV1(
      rows.map((row) => row.stateFeatures),
      labels,
    ),
    relativeModel: fitRelativeTransitionSoftmaxV1(
      rows.map((row) => relativeFeatures(row.actionFeatures, row.stateFeatures)),
      labels,
    ),
  };
}

export function predictFactorizedTransitionDecisionV1(
  model: FactorizedTransitionModelV1,
  candidates: readonly FactorizedTransitionCandidate[],
): FactorizedTransitionPrediction {
  if (model.version !== FACTORIZED_TRANSITION_MODEL_VERSION || candidates.length === 0) {
    throw new Error('invalid factorized transition decision');
  }
  const ordered = [...candidates].sort((left, right) => left.candidateKey - right.candidateKey);
  for (let index = 1; index < ordered.length; index++) {
    if (ordered[index].candidateKey === ordered[index - 1].candidateKey) {
      throw new Error('duplicate factorized transition candidate key');
    }
  }
  const sharedState = ordered[0].stateFeatures;
  for (const candidate of ordered) {
    if (
      candidate.stateFeatures.length !== sharedState.length
      || candidate.stateFeatures.some((value, index) => value !== sharedState[index])
    ) throw new Error('factorized decision state must be shared exactly');
  }
  const stateProbabilities = predictTransitionProbabilitiesV1(model.stateModel, sharedState);
  if (ordered.length === 1) {
    return {
      stateProbabilities,
      candidates: [{
        candidateKey: ordered[0].candidateKey,
        probabilities: stateProbabilities,
      }],
      maxRowSumError: 0,
      meanVectorL1Error: 0,
    };
  }

  const matrix = ordered.map((candidate) => {
    const relative = predictTransitionProbabilitiesV1(
      model.relativeModel,
      relativeFeatures(candidate.actionFeatures, sharedState),
    );
    return relative.map((value, klass) =>
      Math.max(FACTORIZED_PROBABILITY_FLOOR, value * stateProbabilities[klass]));
  });

  for (let iteration = 0; iteration < FACTORIZED_BALANCING_ITERATIONS; iteration++) {
    for (let klass = 0; klass < TRANSITION_CLASS_COUNT; klass++) {
      let columnSum = 0;
      for (const row of matrix) columnSum += row[klass];
      const scale = ordered.length * stateProbabilities[klass] / columnSum;
      for (const row of matrix) row[klass] *= scale;
    }
    for (const row of matrix) {
      const rowSum = row.reduce((sum, value) => sum + value, 0);
      for (let klass = 0; klass < TRANSITION_CLASS_COUNT; klass++) row[klass] /= rowSum;
    }
  }

  let maxRowSumError = 0;
  for (const row of matrix) {
    maxRowSumError = Math.max(
      maxRowSumError,
      Math.abs(row.reduce((sum, value) => sum + value, 0) - 1),
    );
  }
  let meanVectorL1Error = 0;
  for (let klass = 0; klass < TRANSITION_CLASS_COUNT; klass++) {
    const mean = matrix.reduce((sum, row) => sum + row[klass], 0) / matrix.length;
    meanVectorL1Error += Math.abs(mean - stateProbabilities[klass]);
  }
  if (matrix.some((row) => row.some((value) => !Number.isFinite(value) || value <= 0))) {
    throw new Error('factorized transition balancing produced invalid probability');
  }

  return {
    stateProbabilities,
    candidates: ordered.map((candidate, index) => ({
      candidateKey: candidate.candidateKey,
      probabilities: matrix[index],
    })),
    maxRowSumError,
    meanVectorL1Error,
  };
}
