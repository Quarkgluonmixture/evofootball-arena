import { describe, expect, it } from 'vitest';
import {
  createOffBallOfferCommitment, evaluateOffBallOfferCoordination,
  evaluateOffBallOfferPortfolio,
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

describe('team off-ball offer portfolio (O5)', () => {
  it('keeps empty and singleton portfolios valid without fabricated pairs', () => {
    const empty = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [],
      currentTick: 10,
    })!;
    expect(empty).toMatchObject({
      carrierGid: 1,
      commitments: [],
      pairs: [],
      targetDistance: null,
      bearingSeparation: null,
      arrivalTimeSeparation: null,
      corridorSeparation: null,
    });

    const singleton = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [commitment(2, { x: 5, y: 1 })],
      currentTick: 10,
    })!;
    expect(singleton.commitments).toHaveLength(1);
    expect(singleton.pairs).toHaveLength(0);
    expect(singleton.targetDistance).toBeNull();
  });

  it('emits every unordered pair in stable player order', () => {
    const result = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(4, { x: 0, y: 6 }),
        commitment(2, { x: 2, y: 0 }),
        commitment(3, { x: 4, y: 0 }),
      ],
      currentTick: 10,
    })!;
    expect(result.commitments.map((value) => value.playerGid)).toEqual([2, 3, 4]);
    expect(result.pairs.map((pair) => [pair.leftPlayerGid, pair.rightPlayerGid])).toEqual([
      [2, 3], [2, 4], [3, 4],
    ]);
  });

  it('preserves identical and same-ray geometry as separate facts', () => {
    const identical = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(2, { x: 6, y: 0 }, 1),
        commitment(3, { x: 6, y: 0 }, 1.4),
      ],
      currentTick: 10,
    })!.pairs[0];
    expect(identical).toMatchObject({
      targetDistance: 0,
      bearingSeparation: 0,
      corridorSeparation: 0,
    });
    expect(identical.arrivalTimeSeparation).toBeCloseTo(0.4, 12);

    const sameRay = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(2, { x: 4, y: 0 }),
        commitment(3, { x: 8, y: 0 }),
      ],
      currentTick: 10,
    })!.pairs[0];
    expect(sameRay.targetDistance).toBe(4);
    expect(sameRay.bearingSeparation).toBe(0);
    expect(sameRay.corridorSeparation).toBe(0);
  });

  it('measures orthogonal offers and freezes distinct min/max supplying pairs', () => {
    const result = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(2, { x: 2, y: 0 }, 1),
        commitment(3, { x: 4, y: 0 }, 1.2),
        commitment(4, { x: 0, y: 6 }, 2),
      ],
      currentTick: 10,
    })!;
    expect(result.pairs[1].bearingSeparation).toBeCloseTo(Math.PI / 2, 12);
    expect(result.pairs[1].corridorSeparation).toBe(2);
    expect(result.targetDistance).toMatchObject({ min: 2, minPair: [2, 3], maxPair: [3, 4] });
    expect(result.bearingSeparation).toMatchObject({
      min: 0,
      minPair: [2, 3],
      max: Math.PI / 2,
      maxPair: [2, 4],
    });
    expect(result.arrivalTimeSeparation).toMatchObject({
      minPair: [2, 3],
      maxPair: [2, 4],
    });
  });

  it('keeps a carrier-point target valid with nullable bearing only', () => {
    const result = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(2, { x: 0, y: 0 }),
        commitment(3, { x: 5, y: 0 }),
      ],
      currentTick: 10,
    })!;
    expect(result.pairs[0].bearingSeparation).toBeNull();
    expect(result.bearingSeparation).toBeNull();
    expect(result.targetDistance).not.toBeNull();
    expect(result.corridorSeparation).not.toBeNull();
  });

  it('ignores expired commitments and rejects mixed, duplicate, or malformed active intent', () => {
    const base = {
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      currentTick: 10,
    } as const;
    const expired = evaluateOffBallOfferPortfolio({
      ...base,
      commitments: [commitment(2, { x: 2, y: 0 }, 1, 1, 0, 9)],
    })!;
    expect(expired.commitments).toHaveLength(0);
    expect(evaluateOffBallOfferPortfolio({
      ...base,
      commitments: [commitment(2, { x: 2, y: 0 }), commitment(3, { x: 3, y: 0 }, 1, 9)],
    })).toBeNull();
    expect(evaluateOffBallOfferPortfolio({
      ...base,
      commitments: [commitment(2, { x: 2, y: 0 }), commitment(2, { x: 3, y: 0 })],
    })).toBeNull();
    expect(evaluateOffBallOfferPortfolio({
      ...base,
      commitments: [commitment(2, { x: Number.NaN, y: 0 })],
    })).toBeNull();
  });

  it('is mirror-invariant, deterministic, and owns target copies', () => {
    const mutablePoint = { x: 5, y: 2 };
    const commitments = [
      commitment(3, { x: 2, y: -4 }, 0.8),
      commitment(2, mutablePoint, 1.3),
    ];
    const input = { carrierGid: 1, carrierPoint: { x: 0, y: 0 }, commitments, currentTick: 10 };
    const first = evaluateOffBallOfferPortfolio(input)!;
    const second = evaluateOffBallOfferPortfolio(input)!;
    const mirrored = evaluateOffBallOfferPortfolio({
      carrierGid: 1,
      carrierPoint: { x: 0, y: 0 },
      commitments: [
        commitment(3, { x: 2, y: 4 }, 0.8),
        commitment(2, { x: 5, y: -2 }, 1.3),
      ],
      currentTick: 10,
    })!;
    expect(first).toEqual(second);
    expect(mirrored.targetDistance).toEqual(first.targetDistance);
    expect(mirrored.bearingSeparation).toEqual(first.bearingSeparation);
    expect(mirrored.arrivalTimeSeparation).toEqual(first.arrivalTimeSeparation);
    expect(mirrored.corridorSeparation).toEqual(first.corridorSeparation);
    mutablePoint.x = 99;
    expect(first.commitments.find((value) => value.playerGid === 2)!.targetPoint.x).toBe(5);
  });
});
