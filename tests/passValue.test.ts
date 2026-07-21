import { describe, expect, it } from 'vitest';
import type { PassAffordanceResult } from '../src/ai/passAffordance';
import {
  comparePassNextStates, passNextStateValue, passParetoFrontier,
  type PassNextStateValue,
} from '../src/ai/passValue';

const value = (targetGid: number, over: Partial<PassNextStateValue> = {}): PassNextStateValue => ({
  targetGid,
  arrivalMarginSeconds: 0.4,
  receiverTiming: 0,
  pressureRelief: 0.6,
  bodyReadiness: 0.7,
  progressionMetres: 8,
  lineBreakCount: 1,
  offsideSafety: 1,
  exitOptionCount: 2,
  ...over,
});

const result = (reachable = true): PassAffordanceResult => ({
  flight: {
    targetPoint: { x: 12, y: 0 },
    distance: 12,
    launchSpeed: 15,
    arrivalTime: reachable ? 0.8 : Infinity,
    reachable,
  },
  affordance: {
    passerGid: 0,
    targetGid: 1,
    targetPoint: { x: 12, y: 0 },
    ballArrival: reachable ? 0.8 : Infinity,
    receiverArrival: 1,
    opponentArrival: 1.4,
    arrivalMargin: 0.4,
    controlProbability: 0.99,
    receivePressure: 0.4,
    bodyReadiness: 0.7,
    progressionMetres: 8,
    lineBreakCount: 1,
    offsideMargin: -1,
    offsideRisk: 0,
    exitOptionCount: 2,
    targetObservationAgeTicks: 3,
    observedOpponentCount: 4,
  },
});

describe('S7 pass next-state value', () => {
  it('keeps next-state dimensions separate and excludes the uncalibrated control prior', () => {
    const next = passNextStateValue(result())!;
    expect(next).toMatchObject({
      targetGid: 1,
      arrivalMarginSeconds: 0.4,
      pressureRelief: 0.6,
      progressionMetres: 8,
    });
    expect(next.receiverTiming).toBeCloseTo(-0.2, 12);
    expect('controlProbability' in next).toBe(false);
    expect('score' in next).toBe(false);
    expect(passNextStateValue(result(false))).toBeNull();
  });

  it('eliminates only a candidate that is no worse on every dimension', () => {
    const weaker = value(1);
    const stronger = value(2, { arrivalMarginSeconds: 0.7, progressionMetres: 10 });
    expect(comparePassNextStates(stronger, weaker)).toBe('leftDominates');
    expect(comparePassNextStates(weaker, stronger)).toBe('rightDominates');
  });

  it('preserves real tactical tradeoffs instead of inventing one universal winner', () => {
    const safeRecycle = value(1, { arrivalMarginSeconds: 1, progressionMetres: -3, lineBreakCount: 0 });
    const riskyProgress = value(2, { arrivalMarginSeconds: 0.1, progressionMetres: 16, lineBreakCount: 2 });
    expect(comparePassNextStates(safeRecycle, riskyProgress)).toBe('tradeoff');
    expect(passParetoFrontier([safeRecycle, riskyProgress]).map((candidate) => candidate.targetGid))
      .toEqual([1, 2]);
  });

  it('returns a stable frontier without mutating candidates or input order', () => {
    const dominated = value(1);
    const safe = value(2, { arrivalMarginSeconds: 0.8 });
    const progressive = value(3, { progressionMetres: 15, arrivalMarginSeconds: 0.2 });
    const input = [dominated, safe, progressive];
    const before = JSON.stringify(input);
    expect(passParetoFrontier(input).map((candidate) => candidate.targetGid)).toEqual([2, 3]);
    expect(JSON.stringify(input)).toBe(before);
  });
});
