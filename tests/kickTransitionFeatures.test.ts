import { describe, expect, it } from 'vitest';
import type { PassAffordanceResult } from '../src/ai/passAffordance';
import {
  KICK_TRANSITION_FEATURE_DIMENSIONS,
  KICK_TRANSITION_FEATURE_VERSION,
  projectKickTransitionFeaturesV1,
} from '../src/ai/kickTransitionFeatures';

const result = (): PassAffordanceResult => ({
  flight: {
    targetPoint: { x: 12, y: 1 },
    distance: 12.5,
    launchSpeed: 15,
    arrivalTime: 0.9,
    reachable: true,
  },
  affordance: {
    passerGid: 0,
    targetGid: 1,
    targetPoint: { x: 12, y: 1 },
    ballArrival: 0.9,
    receiverArrival: 0.8,
    opponentArrival: 1.2,
    arrivalMargin: 0.4,
    controlProbability: 0.97,
    receivePressure: 0.35,
    bodyReadiness: 0.7,
    progressionMetres: 8,
    lineBreakCount: 2,
    offsideMargin: -0.4,
    offsideRisk: 0.1,
    exitOptionCount: 3,
    targetObservationAgeTicks: 4,
    observedOpponentCount: 5,
  },
});

describe('T0 kick-time transition features', () => {
  it('projects the frozen finite feature order without aggregate priors or identities', () => {
    const projected = projectKickTransitionFeaturesV1(result())!;
    expect(projected.version).toBe(KICK_TRANSITION_FEATURE_VERSION);
    expect(Object.keys(projected.features)).toEqual(KICK_TRANSITION_FEATURE_DIMENSIONS);
    expect(projected.features).toMatchObject({
      flightDistance: 12.5,
      arrivalMargin: 0.4,
      offsideMargin: -0.4,
      observedOpponentCount: 5,
    });
    expect('controlProbability' in projected.features).toBe(false);
    expect('offsideRisk' in projected.features).toBe(false);
    expect('targetGid' in projected.features).toBe(false);
    expect('score' in projected.features).toBe(false);
  });

  it('rejects a non-finite action fact instead of filling a sentinel', () => {
    const base = result();
    const input: PassAffordanceResult = {
      ...base,
      affordance: { ...base.affordance, receiverArrival: Infinity },
    };
    expect(projectKickTransitionFeaturesV1(input)).toBeNull();
  });

  it('does not mutate the S4/S5 affordance', () => {
    const input = result();
    const before = JSON.stringify(input);
    projectKickTransitionFeaturesV1(input);
    expect(JSON.stringify(input)).toBe(before);
  });
});
