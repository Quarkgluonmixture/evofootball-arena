import { describe, expect, it } from 'vitest';
import {
  FACTORIZED_BALANCING_ITERATIONS,
  fitFactorizedTransitionModelV1,
  predictFactorizedTransitionDecisionV1,
  type FactorizedTransitionCandidate,
  type FactorizedTransitionTrainingRow,
} from '../scripts/probes/factorized-transition-model';

const training = (): FactorizedTransitionTrainingRow[] => {
  const rows: FactorizedTransitionTrainingRow[] = [];
  for (let decision = 0; decision < 40; decision++) {
    const state = [decision / 40, 0.5];
    for (let action = 0; action < 5; action++) {
      rows.push({
        stateFeatures: state,
        actionFeatures: [state[0] + action - 2, state[1] + (action % 2) - 0.5],
        label: action,
      });
    }
  }
  return rows;
};

const candidates = (): FactorizedTransitionCandidate[] => [
  { candidateKey: 14, stateFeatures: [0.25, 0.5], actionFeatures: [-1.75, 0] },
  { candidateKey: 11, stateFeatures: [0.25, 0.5], actionFeatures: [-0.75, 1] },
  { candidateKey: 19, stateFeatures: [0.25, 0.5], actionFeatures: [0.25, 0] },
  { candidateKey: 12, stateFeatures: [0.25, 0.5], actionFeatures: [1.25, 1] },
  { candidateKey: 16, stateFeatures: [0.25, 0.5], actionFeatures: [2.25, 0] },
];

describe('T0b-R factorized transition model', () => {
  it('fits deterministically and keeps the frozen balancing budget', () => {
    const first = fitFactorizedTransitionModelV1(training());
    const second = fitFactorizedTransitionModelV1(training());
    expect(second).toEqual(first);
    expect(FACTORIZED_BALANCING_ITERATIONS).toBe(128);
  });

  it('preserves the state marginal while distinguishing targets', () => {
    const model = fitFactorizedTransitionModelV1(training());
    const result = predictFactorizedTransitionDecisionV1(model, candidates());
    expect(result.maxRowSumError).toBeLessThanOrEqual(1e-12);
    expect(result.meanVectorL1Error).toBeLessThanOrEqual(1e-10);
    expect(result.candidates.every((candidate) =>
      candidate.probabilities.every((value) => Number.isFinite(value) && value > 0)))
      .toBe(true);
    expect(new Set(result.candidates.map((candidate) =>
      JSON.stringify(candidate.probabilities))).size).toBeGreaterThan(1);
  });

  it('is candidate-order permutation equivariant by construction', () => {
    const model = fitFactorizedTransitionModelV1(training());
    const forward = predictFactorizedTransitionDecisionV1(model, candidates());
    const reversed = predictFactorizedTransitionDecisionV1(model, candidates().reverse());
    expect(reversed).toEqual(forward);
  });

  it('gives identical candidates identical probabilities', () => {
    const model = fitFactorizedTransitionModelV1(training());
    const repeated = candidates().map((candidate) => ({
      ...candidate,
      actionFeatures: [0.25, 0.5],
    }));
    const result = predictFactorizedTransitionDecisionV1(model, repeated);
    expect(result.candidates.every((candidate) =>
      JSON.stringify(candidate.probabilities)
        === JSON.stringify(result.candidates[0].probabilities))).toBe(true);
  });

  it('rejects non-shared state and duplicate candidate identity', () => {
    const model = fitFactorizedTransitionModelV1(training());
    const nonShared = candidates();
    nonShared[1] = { ...nonShared[1], stateFeatures: [0.26, 0.5] };
    expect(() => predictFactorizedTransitionDecisionV1(model, nonShared)).toThrow();
    const duplicate = candidates();
    duplicate[1] = { ...duplicate[1], candidateKey: duplicate[0].candidateKey };
    expect(() => predictFactorizedTransitionDecisionV1(model, duplicate)).toThrow();
  });
});
