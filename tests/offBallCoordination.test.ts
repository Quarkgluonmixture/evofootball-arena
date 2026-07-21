import { describe, expect, it } from 'vitest';
import {
  createOffBallOfferCommitment, evaluateOffBallOfferCoordination,
  type OffBallOfferCommitment,
} from '../src/ai/offBallCoordination';
import type { OffBallAffordance } from '../src/ai/offBallAffordance';

const affordance = (
  playerGid: number,
  point: { x: number; y: number },
  selfArrival = 1,
  carrierGid = 1,
): OffBallAffordance => ({
  candidate: {
    id: `${playerGid}`,
    point,
    sampleHorizon: 1,
    directionIndex: 0,
    forwardDelta: point.x,
    lateralDelta: point.y,
  },
  playerGid,
  carrierGid,
  selfArrival,
  selfTurnTime: 0,
  opponentArrival: selfArrival + 1,
  opponentArrivalMargin: 1,
  nearestOpponentDistanceAtArrival: 5,
  nearestTeammateDistanceAtArrival: 5,
  carrierDistanceAtArrival: Math.hypot(point.x, point.y),
  carrierLaneClearance: 3,
  fieldMargin: 10,
  offsideMargin: -2,
  offsideRisk: 0,
  selfObservationAgeTicks: 0,
  carrierObservationAgeTicks: 0,
  observedOpponentCount: 6,
  observedTeammateCount: 5,
});

const commitment = (
  playerGid: number,
  targetPoint: { x: number; y: number },
  arrivalTime = 1,
  carrierGid = 1,
  committedTick = 10,
  validUntilTick = 20,
): OffBallOfferCommitment => ({
  playerGid,
  carrierGid,
  targetPoint,
  arrivalTime,
  committedTick,
  validUntilTick,
});

describe('shared off-ball offer commitments (O3)', () => {
  it('keeps no-commitment capacity honest and nullable', () => {
    const result = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }),
      carrierPoint: { x: 0, y: 0 },
      commitments: [],
      currentTick: 10,
    });
    expect(result).toMatchObject({
      activeCommitmentCount: 0,
      nearestTargetDistance: null,
      nearestBearingSeparation: null,
      nearestArrivalTimeSeparation: null,
      nearestCorridorSeparation: null,
    });
  });

  it('reports identical target and lane geometry without inventing a penalty', () => {
    const result = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }, 1.2),
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(3, { x: 6, y: 0 }, 1.5)],
      currentTick: 10,
    })!;
    expect(result.activeCommitmentCount).toBe(1);
    expect(result.nearestTargetDistance).toBe(0);
    expect(result.nearestBearingSeparation).toBe(0);
    expect(result.nearestCorridorSeparation).toBe(0);
    expect(result.nearestArrivalTimeSeparation).toBeCloseTo(0.3, 12);
  });

  it('distinguishes same-ray depth from target identity', () => {
    const result = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 8, y: 0 }),
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(3, { x: 4, y: 0 })],
      currentTick: 10,
    })!;
    expect(result.nearestTargetDistance).toBe(4);
    expect(result.nearestBearingSeparation).toBe(0);
    expect(result.nearestCorridorSeparation).toBe(0);
  });

  it('measures orthogonal carrier-centric offers', () => {
    const result = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }),
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(3, { x: 0, y: 6 })],
      currentTick: 10,
    })!;
    expect(result.nearestBearingSeparation).toBeCloseTo(Math.PI / 2, 12);
    expect(result.nearestCorridorSeparation).toBe(6);
  });

  it('keeps arrival timing independent from geometry', () => {
    const early = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }, 1),
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(3, { x: 6, y: 0 }, 1.1)],
      currentTick: 10,
    })!;
    const late = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }, 1),
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(3, { x: 6, y: 0 }, 2.1)],
      currentTick: 10,
    })!;
    expect(early.nearestTargetDistance).toBe(late.nearestTargetDistance);
    expect(early.nearestArrivalTimeSeparation).toBeCloseTo(0.1, 12);
    expect(late.nearestArrivalTimeSeparation).toBeCloseTo(1.1, 12);
  });

  it('ignores self, other-carrier and expired commitments', () => {
    const result = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }),
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(2, { x: 6, y: 0 }),
        commitment(3, { x: 6, y: 0 }, 1, 99),
        commitment(4, { x: 6, y: 0 }, 1, 1, 0, 9),
      ],
      currentTick: 10,
    })!;
    expect(result.activeCommitmentCount).toBe(0);
    expect(result.nearestTargetDistance).toBeNull();
  });

  it('rejects malformed relevant intent instead of treating it as open capacity', () => {
    const bad = commitment(3, { x: Number.NaN, y: 0 });
    expect(evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: 0 }),
      carrierPoint: { x: 0, y: 0 },
      commitments: [bad],
      currentTick: 10,
    })).toBeNull();
  });

  it('is mirror-invariant, deterministic and leaves inputs untouched', () => {
    const candidate = affordance(2, { x: 6, y: 2 }, 1.3);
    const commitments = [commitment(3, { x: 3, y: -4 }, 0.8)];
    const before = JSON.stringify({ candidate, commitments });
    const input = { candidate, carrierPoint: { x: 0, y: 0 }, commitments, currentTick: 10 };
    const first = evaluateOffBallOfferCoordination(input)!;
    const second = evaluateOffBallOfferCoordination(input)!;
    const mirrored = evaluateOffBallOfferCoordination({
      candidate: affordance(2, { x: 6, y: -2 }, 1.3),
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(3, { x: 3, y: 4 }, 0.8)],
      currentTick: 10,
    })!;
    expect(first).toEqual(second);
    expect(mirrored.nearestTargetDistance).toBeCloseTo(first.nearestTargetDistance!, 12);
    expect(mirrored.nearestBearingSeparation).toBeCloseTo(first.nearestBearingSeparation!, 12);
    expect(mirrored.nearestCorridorSeparation).toBeCloseTo(first.nearestCorridorSeparation!, 12);
    expect(JSON.stringify({ candidate, commitments })).toBe(before);
  });

  it('freezes a candidate without choosing its lifetime or mutating its point', () => {
    const candidate = affordance(2, { x: 6, y: 2 }, 1.3);
    const result = createOffBallOfferCommitment(candidate, 10, 20)!;
    expect(result).toEqual({
      playerGid: 2,
      carrierGid: 1,
      targetPoint: { x: 6, y: 2 },
      arrivalTime: 1.3,
      committedTick: 10,
      validUntilTick: 20,
    });
    expect(result.targetPoint).not.toBe(candidate.candidate.point);
    expect(createOffBallOfferCommitment(candidate, 20, 10)).toBeNull();
  });
});
