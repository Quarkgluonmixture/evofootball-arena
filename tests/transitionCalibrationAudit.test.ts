import { describe, expect, it } from 'vitest';
import {
  auditTransitionCalibrationV1,
  type TransitionCalibrationAuditRow,
} from '../scripts/probes/transition-calibration-audit';

const row = (
  matchSeed: number,
  decisionId: string,
  label: number,
  actionProbabilities: readonly number[],
  stateProbabilities: readonly number[],
): TransitionCalibrationAuditRow => ({
  matchSeed,
  decisionId,
  label,
  actionProbabilities,
  stateProbabilities,
});

const sample = (): TransitionCalibrationAuditRow[] => {
  const rows: TransitionCalibrationAuditRow[] = [];
  const state = [0.45, 0.1, 0.25, 0.1, 0.1];
  for (let seed = 1; seed <= 3; seed++) {
    for (let decision = 0; decision < 5; decision++) {
      const label = decision;
      rows.push(row(
        seed,
        `${seed}:${decision}`,
        label,
        [0.55, 0.1, 0.15, 0.1, 0.1],
        state,
      ));
      rows.push(row(
        seed,
        `${seed}:${decision}`,
        label,
        [0.35, 0.1, 0.35, 0.1, 0.1],
        state,
      ));
    }
  }
  return rows;
};

describe('T0b-F transition calibration failure anatomy', () => {
  it('is deterministic, finite and conserves every fixed bin', () => {
    const rows = sample();
    const first = auditTransitionCalibrationV1(rows);
    const second = auditTransitionCalibrationV1(rows);
    expect(second).toEqual(first);
    expect(first).toMatchObject({
      rows: 30,
      clusters: 3,
      decisions: 15,
      invariants: {
        malformedRows: 0,
        binConservationFailures: 0,
        stateWithinDecisionDifferences: 0,
        nonFiniteOutputs: 0,
      },
      bootstrap: { samples: 10000 },
    });
  });

  it('separates decision-level mass shift from state probability', () => {
    const result = auditTransitionCalibrationV1(sample());
    expect(result.decisionMassShift.meanL1).toBeCloseTo(0, 12);
    const shifted = sample().map((value, index) => index % 2 === 0
      ? { ...value, actionProbabilities: [0.65, 0.1, 0.05, 0.1, 0.1] }
      : value);
    expect(auditTransitionCalibrationV1(shifted).decisionMassShift.meanL1)
      .toBeGreaterThan(0);
  });

  it('rejects malformed probability rows instead of filling them', () => {
    const rows = sample();
    rows[0] = { ...rows[0], actionProbabilities: [1, 0, 0, 0] };
    expect(() => auditTransitionCalibrationV1(rows)).toThrow();
  });
});
