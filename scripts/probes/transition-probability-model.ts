import { hashSeed, Rng } from '../../src/utils/rng';

export const TRANSITION_CLASS_COUNT = 5;
export const TRANSITION_MODEL_VERSION = 'transition-softmax-v1' as const;
export const TRANSITION_MODEL_EPOCHS = 30;
export const TRANSITION_MODEL_BATCH_SIZE = 1024;
export const TRANSITION_MODEL_LEARNING_RATE = 0.01;
export const TRANSITION_MODEL_L2 = 1e-4;
export const TRANSITION_MODEL_SHUFFLE_NAMESPACE = 0x74306231;
export const RELATIVE_TRANSITION_MODEL_SHUFFLE_NAMESPACE = 0x74306272;

export interface TransitionSoftmaxModelV1 {
  readonly version: typeof TRANSITION_MODEL_VERSION;
  readonly inputDimensions: number;
  readonly basisDimensions: number;
  readonly means: readonly number[];
  readonly scales: readonly number[];
  readonly weights: readonly number[];
}

const assertRows = (
  inputs: readonly (readonly number[])[],
  labels: readonly number[],
): number => {
  if (inputs.length === 0 || inputs.length !== labels.length) {
    throw new Error('transition model needs matching non-empty inputs and labels');
  }
  const dimensions = inputs[0].length;
  if (dimensions === 0) throw new Error('transition model needs input dimensions');
  for (let row = 0; row < inputs.length; row++) {
    if (
      inputs[row].length !== dimensions
      || !inputs[row].every(Number.isFinite)
      || !Number.isInteger(labels[row])
      || labels[row] < 0
      || labels[row] >= TRANSITION_CLASS_COUNT
    ) throw new Error(`invalid transition training row ${row}`);
  }
  return dimensions;
};

const fitStandardizer = (
  inputs: readonly (readonly number[])[],
  dimensions: number,
): { means: number[]; scales: number[] } => {
  const means = Array<number>(dimensions).fill(0);
  for (const input of inputs) {
    for (let dimension = 0; dimension < dimensions; dimension++) {
      means[dimension] += input[dimension];
    }
  }
  for (let dimension = 0; dimension < dimensions; dimension++) {
    means[dimension] /= inputs.length;
  }
  const variances = Array<number>(dimensions).fill(0);
  for (const input of inputs) {
    for (let dimension = 0; dimension < dimensions; dimension++) {
      const delta = input[dimension] - means[dimension];
      variances[dimension] += delta * delta;
    }
  }
  const scales = variances.map((sum) => {
    const standardDeviation = Math.sqrt(sum / inputs.length);
    return standardDeviation < 1e-12 ? 1 : standardDeviation;
  });
  return { means, scales };
};

const basisOf = (
  input: readonly number[],
  means: readonly number[],
  scales: readonly number[],
): Float64Array => {
  const basis = new Float64Array(1 + input.length * 2);
  basis[0] = 1;
  for (let dimension = 0; dimension < input.length; dimension++) {
    const standardised = Math.max(-6, Math.min(
      6,
      (input[dimension] - means[dimension]) / scales[dimension],
    ));
    basis[1 + dimension] = standardised;
    basis[1 + input.length + dimension] = standardised * standardised;
  }
  return basis;
};

const probabilitiesFromBasis = (
  basis: Float64Array,
  weights: ArrayLike<number>,
): number[] => {
  const dimensions = basis.length;
  const logits = Array<number>(TRANSITION_CLASS_COUNT).fill(0);
  let maxLogit = -Infinity;
  for (let klass = 0; klass < TRANSITION_CLASS_COUNT; klass++) {
    let value = 0;
    const offset = klass * dimensions;
    for (let dimension = 0; dimension < dimensions; dimension++) {
      value += weights[offset + dimension] * basis[dimension];
    }
    logits[klass] = value;
    maxLogit = Math.max(maxLogit, value);
  }
  let denominator = 0;
  for (let klass = 0; klass < TRANSITION_CLASS_COUNT; klass++) {
    logits[klass] = Math.exp(logits[klass] - maxLogit);
    denominator += logits[klass];
  }
  return logits.map((value) => value / denominator);
};

const fitTransitionSoftmaxWithNamespaceV1 = (
  inputs: readonly (readonly number[])[],
  labels: readonly number[],
  shuffleNamespace: number,
): TransitionSoftmaxModelV1 => {
  const inputDimensions = assertRows(inputs, labels);
  const { means, scales } = fitStandardizer(inputs, inputDimensions);
  const basisRows = inputs.map((input) => basisOf(input, means, scales));
  const basisDimensions = basisRows[0].length;
  const weightCount = TRANSITION_CLASS_COUNT * basisDimensions;
  const weights = new Float64Array(weightCount);
  const firstMoment = new Float64Array(weightCount);
  const secondMoment = new Float64Array(weightCount);
  const gradient = new Float64Array(weightCount);
  const order = Array.from({ length: inputs.length }, (_, index) => index);
  let update = 0;

  for (let epoch = 0; epoch < TRANSITION_MODEL_EPOCHS; epoch++) {
    for (let index = 0; index < order.length; index++) order[index] = index;
    new Rng(hashSeed(shuffleNamespace, epoch)).shuffle(order);
    for (let start = 0; start < order.length; start += TRANSITION_MODEL_BATCH_SIZE) {
      gradient.fill(0);
      const end = Math.min(start + TRANSITION_MODEL_BATCH_SIZE, order.length);
      const batchSize = end - start;
      for (let position = start; position < end; position++) {
        const row = order[position];
        const basis = basisRows[row];
        const probabilities = probabilitiesFromBasis(basis, weights);
        for (let klass = 0; klass < TRANSITION_CLASS_COUNT; klass++) {
          const error = probabilities[klass] - (labels[row] === klass ? 1 : 0);
          const offset = klass * basisDimensions;
          for (let dimension = 0; dimension < basisDimensions; dimension++) {
            gradient[offset + dimension] += error * basis[dimension];
          }
        }
      }

      update++;
      const beta1Correction = 1 - 0.9 ** update;
      const beta2Correction = 1 - 0.999 ** update;
      for (let index = 0; index < weightCount; index++) {
        const dimension = index % basisDimensions;
        const regularisation = dimension === 0 ? 0 : 2 * TRANSITION_MODEL_L2 * weights[index];
        const value = gradient[index] / batchSize + regularisation;
        firstMoment[index] = 0.9 * firstMoment[index] + 0.1 * value;
        secondMoment[index] = 0.999 * secondMoment[index] + 0.001 * value * value;
        const correctedFirst = firstMoment[index] / beta1Correction;
        const correctedSecond = secondMoment[index] / beta2Correction;
        weights[index] -= TRANSITION_MODEL_LEARNING_RATE
          * correctedFirst / (Math.sqrt(correctedSecond) + 1e-8);
      }
    }
  }

  if (![...weights].every(Number.isFinite)) {
    throw new Error('transition model produced non-finite weights');
  }
  return {
    version: TRANSITION_MODEL_VERSION,
    inputDimensions,
    basisDimensions,
    means,
    scales,
    weights: [...weights],
  };
};

export function fitTransitionSoftmaxV1(
  inputs: readonly (readonly number[])[],
  labels: readonly number[],
): TransitionSoftmaxModelV1 {
  return fitTransitionSoftmaxWithNamespaceV1(
    inputs,
    labels,
    TRANSITION_MODEL_SHUFFLE_NAMESPACE,
  );
}

export function fitRelativeTransitionSoftmaxV1(
  inputs: readonly (readonly number[])[],
  labels: readonly number[],
): TransitionSoftmaxModelV1 {
  return fitTransitionSoftmaxWithNamespaceV1(
    inputs,
    labels,
    RELATIVE_TRANSITION_MODEL_SHUFFLE_NAMESPACE,
  );
}

export function predictTransitionProbabilitiesV1(
  model: TransitionSoftmaxModelV1,
  input: readonly number[],
): readonly number[] {
  if (
    model.version !== TRANSITION_MODEL_VERSION
    || input.length !== model.inputDimensions
    || !input.every(Number.isFinite)
  ) throw new Error('invalid transition prediction input');
  return probabilitiesFromBasis(
    basisOf(input, model.means, model.scales),
    model.weights,
  );
}
