import type { OffBallAffordance } from './offBallAffordance';
import { closestPointOnSegment, type V2 } from '../utils/vec';

const EPS = 1e-9;

export interface OffBallOfferCommitment {
  readonly playerGid: number;
  readonly carrierGid: number;
  readonly targetPoint: Readonly<V2>;
  readonly arrivalTime: number;
  readonly committedTick: number;
  readonly validUntilTick: number;
}

export interface OffBallOfferCoordinationFacts {
  readonly playerGid: number;
  readonly carrierGid: number;
  readonly candidateId: string;
  readonly activeCommitmentCount: number;
  readonly nearestTargetDistance: number | null;
  readonly nearestTargetPlayerGid: number | null;
  readonly nearestBearingSeparation: number | null;
  readonly nearestBearingPlayerGid: number | null;
  readonly nearestArrivalTimeSeparation: number | null;
  readonly nearestArrivalPlayerGid: number | null;
  readonly nearestCorridorSeparation: number | null;
  readonly nearestCorridorPlayerGid: number | null;
}

export interface OffBallOfferCoordinationInput {
  readonly candidate: OffBallAffordance;
  readonly carrierPoint: Readonly<V2>;
  readonly commitments: readonly OffBallOfferCommitment[];
  readonly currentTick: number;
}

const finitePoint = (point: Readonly<V2>): boolean =>
  Number.isFinite(point.x) && Number.isFinite(point.y);

const validCommitment = (commitment: OffBallOfferCommitment): boolean =>
  Number.isInteger(commitment.playerGid)
  && Number.isInteger(commitment.carrierGid)
  && finitePoint(commitment.targetPoint)
  && Number.isFinite(commitment.arrivalTime)
  && commitment.arrivalTime >= 0
  && Number.isInteger(commitment.committedTick)
  && Number.isInteger(commitment.validUntilTick)
  && commitment.validUntilTick >= commitment.committedTick;

const bearingFrom = (origin: Readonly<V2>, point: Readonly<V2>): number | null => {
  const x = point.x - origin.x;
  const y = point.y - origin.y;
  if (Math.hypot(x, y) < EPS) return null;
  return Math.atan2(y, x);
};

const angleSeparation = (left: number, right: number): number => {
  const raw = Math.abs(left - right) % (Math.PI * 2);
  return Math.min(raw, Math.PI * 2 - raw);
};

const pointSegmentDistance = (
  point: Readonly<V2>, start: Readonly<V2>, end: Readonly<V2>,
): number => {
  const closest = closestPointOnSegment(start, end, point);
  return Math.hypot(point.x - closest.x, point.y - closest.y);
};

const corridorSeparation = (
  carrier: Readonly<V2>, left: Readonly<V2>, right: Readonly<V2>,
): number => Math.min(
  pointSegmentDistance(left, carrier, right),
  pointSegmentDistance(right, carrier, left),
);

/**
 * Freeze one already-evaluated generic offer as shareable intent. This helper
 * records no tactical name and does not choose an expiry policy for its caller.
 */
export function createOffBallOfferCommitment(
  candidate: OffBallAffordance,
  committedTick: number,
  validUntilTick: number,
): OffBallOfferCommitment | null {
  const commitment: OffBallOfferCommitment = {
    playerGid: candidate.playerGid,
    carrierGid: candidate.carrierGid,
    targetPoint: { x: candidate.candidate.point.x, y: candidate.candidate.point.y },
    arrivalTime: candidate.selfArrival,
    committedTick,
    validUntilTick,
  };
  return validCommitment(commitment) ? commitment : null;
}

/**
 * Compare one candidate with teammates' explicit same-carrier commitments.
 * Every output remains a separate fact; no duplicate threshold or score exists.
 */
export function evaluateOffBallOfferCoordination(
  input: OffBallOfferCoordinationInput,
): OffBallOfferCoordinationFacts | null {
  const { candidate, carrierPoint, commitments, currentTick } = input;
  if (!finitePoint(carrierPoint) || !Number.isInteger(currentTick)) return null;

  const relevant: OffBallOfferCommitment[] = [];
  for (const commitment of commitments) {
    if (
      commitment.carrierGid !== candidate.carrierGid
      || commitment.playerGid === candidate.playerGid
      || commitment.validUntilTick < currentTick
    ) continue;
    if (!validCommitment(commitment)) return null;
    relevant.push(commitment);
  }

  const result: OffBallOfferCoordinationFacts = {
    playerGid: candidate.playerGid,
    carrierGid: candidate.carrierGid,
    candidateId: candidate.candidate.id,
    activeCommitmentCount: relevant.length,
    nearestTargetDistance: null,
    nearestTargetPlayerGid: null,
    nearestBearingSeparation: null,
    nearestBearingPlayerGid: null,
    nearestArrivalTimeSeparation: null,
    nearestArrivalPlayerGid: null,
    nearestCorridorSeparation: null,
    nearestCorridorPlayerGid: null,
  };
  if (relevant.length === 0) return result;

  const candidateBearing = bearingFrom(carrierPoint, candidate.candidate.point);
  let nearestTargetDistance = Infinity;
  let nearestTargetPlayerGid: number | null = null;
  let nearestBearingSeparation = Infinity;
  let nearestBearingPlayerGid: number | null = null;
  let nearestArrivalTimeSeparation = Infinity;
  let nearestArrivalPlayerGid: number | null = null;
  let nearestCorridorSeparation = Infinity;
  let nearestCorridorPlayerGid: number | null = null;

  for (const commitment of relevant) {
    const targetDistance = Math.hypot(
      commitment.targetPoint.x - candidate.candidate.point.x,
      commitment.targetPoint.y - candidate.candidate.point.y,
    );
    if (targetDistance < nearestTargetDistance) {
      nearestTargetDistance = targetDistance;
      nearestTargetPlayerGid = commitment.playerGid;
    }

    const otherBearing = bearingFrom(carrierPoint, commitment.targetPoint);
    if (candidateBearing !== null && otherBearing !== null) {
      const separation = angleSeparation(candidateBearing, otherBearing);
      if (separation < nearestBearingSeparation) {
        nearestBearingSeparation = separation;
        nearestBearingPlayerGid = commitment.playerGid;
      }
    }

    const arrivalSeparation = Math.abs(commitment.arrivalTime - candidate.selfArrival);
    if (arrivalSeparation < nearestArrivalTimeSeparation) {
      nearestArrivalTimeSeparation = arrivalSeparation;
      nearestArrivalPlayerGid = commitment.playerGid;
    }

    const laneSeparation = corridorSeparation(
      carrierPoint, candidate.candidate.point, commitment.targetPoint,
    );
    if (laneSeparation < nearestCorridorSeparation) {
      nearestCorridorSeparation = laneSeparation;
      nearestCorridorPlayerGid = commitment.playerGid;
    }
  }

  return {
    ...result,
    nearestTargetDistance,
    nearestTargetPlayerGid,
    nearestBearingSeparation: Number.isFinite(nearestBearingSeparation)
      ? nearestBearingSeparation
      : null,
    nearestBearingPlayerGid,
    nearestArrivalTimeSeparation,
    nearestArrivalPlayerGid,
    nearestCorridorSeparation,
    nearestCorridorPlayerGid,
  };
}
