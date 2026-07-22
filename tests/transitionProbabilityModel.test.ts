import { describe, expect, it } from 'vitest';
import {
  fitSoftTransitionSoftmaxV1,
  fitTransitionSoftmaxV1,
  predictSoftTransitionProbabilitiesV1,
  predictTransitionProbabilitiesV1,
} from '../scripts/probes/transition-probability-model';

const separable = (): { inputs: number[][]; labels: number[] } => {
  const inputs: number[][] = [];
  const labels: number[] = [];
  for (let klass = 0; klass < 5; klass++) {
    for (let sample = 0; sample < 20; sample++) {
      inputs.push(Array.from({ length: 5 }, (_, dimension) =>
        dimension === klass ? 1 + sample * 0.001 : 0));
      labels.push(klass);
    }
  }
  return { inputs, labels };
};

describe('T0b deterministic transition softmax', () => {
  it('fits deterministic finite weights and normalised probabilities', () => {
    const data = separable();
    const first = fitTransitionSoftmaxV1(data.inputs, data.labels);
    const second = fitTransitionSoftmaxV1(data.inputs, data.labels);
    expect(second).toEqual(first);
    const probabilities = predictTransitionProbabilitiesV1(first, [1, 0, 0, 0, 0]);
    expect(probabilities).toHaveLength(5);
    expect(probabilities.every(Number.isFinite)).toBe(true);
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(probabilities[0]).toBeGreaterThan(0.8);
  });

  it('keeps a constant dimension finite through the frozen scale floor', () => {
    const data = separable();
    const inputs = data.inputs.map((input) => [...input, 7]);
    const model = fitTransitionSoftmaxV1(inputs, data.labels);
    expect(model.scales[5]).toBe(1);
    expect(predictTransitionProbabilitiesV1(model, [1, 0, 0, 0, 0, 7])
      .every(Number.isFinite)).toBe(true);
  });

  it('rejects malformed rows rather than silently filling them', () => {
    expect(() => fitTransitionSoftmaxV1([[0], [Infinity]], [0, 1])).toThrow();
  });
});

describe('T-STUDENT-0 deterministic soft-label transition softmax', () => {
  it('learns finite probability targets without converting them to hard labels', () => {
    const data = separable();
    const targets = data.labels.map((label) => Array.from({ length: 5 }, (_, klass) =>
      klass === label ? 0.8 : 0.05));
    const first = fitSoftTransitionSoftmaxV1(data.inputs, targets);
    const second = fitSoftTransitionSoftmaxV1(data.inputs, targets);
    expect(second).toEqual(first);
    const probabilities = predictSoftTransitionProbabilitiesV1(first, [1, 0, 0, 0, 0]);
    expect(probabilities).toHaveLength(5);
    expect(probabilities.every(Number.isFinite)).toBe(true);
    expect(probabilities.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 12);
    expect(probabilities[0]).toBeGreaterThan(0.65);
    expect(probabilities[0]).toBeLessThan(0.9);
  });

  it('rejects missing, non-positive and non-unit soft targets', () => {
    expect(() => fitSoftTransitionSoftmaxV1([[0]], [[1, 0, 0, 0, 0]])).toThrow();
    expect(() => fitSoftTransitionSoftmaxV1([[0]], [[0.1, 0.1, 0.1, 0.1, 0.1]])).toThrow();
  });
});
