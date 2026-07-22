import { describe, expect, it } from 'vitest';
import {
  createDefensiveMovementCommitment,
  evaluateDefensiveCoverCoordination,
} from '../src/ai/defensiveCoordination';
import type { OffBallCandidatePoint } from '../src/ai/offBallAffordance';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';

const player = (
  gid: number,
  side: 0 | 1,
  x: number,
  y: number,
  bodyX = 1,
  bodyY = 0,
): ObservedPlayer => ({
  gid,
  side,
  pos: { x, y },
  vel: { x: 0, y: 0 },
  bodyDir: { x: bodyX, y: bodyY },
  observedTick: 100 - gid,
  ageTicks: gid,
});

const candidate = (id: string, x: number, y: number): OffBallCandidatePoint => ({
  id,
  point: { x, y },
  sampleHorizon: 0.75,
  directionIndex: 0,
  forwardDelta: x,
  lateralDelta: y,
});

const snapshot = (players: readonly ObservedPlayer[]): PerceptionSnapshot => ({
  observerGid: 2,
  tick: 100,
  awareness: 0.8,
  players,
  ball: null,
});

const profiles = new Map<number, KnownReachProfile>([
  [1, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [2, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [10, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [11, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [12, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
]);

const basePlayers = [
  player(1, 0, 1, 0),
  player(2, 0, 0, 2),
  player(10, 1, 8, 0),
  player(11, 1, 8, 4),
  player(12, 1, 0, 0),
];

const makeCommitment = (target = candidate('d1', 5, 1)) =>
  createDefensiveMovementCommitment({
    player: basePlayers[0],
    observedCarrierGid: 12,
    candidate: target,
    arrivalTime: 0.75,
    committedTick: 100,
    validUntilTick: 145,
  });

describe('defensive shared-cover coordination', () => {
  it('freezes a movement target without mutating its candidate', () => {
    const source = candidate('d1', 5, 1);
    const result = makeCommitment(source)!;
    expect(result.targetPoint).toEqual({ x: 5, y: 1 });
    expect(result.expectedBodyDir.x).toBeGreaterThan(0);
    expect(source.point).toEqual({ x: 5, y: 1 });
  });

  it('uses the existing body direction for a hold commitment', () => {
    const result = makeCommitment(candidate('hold', 1, 0))!;
    expect(result.expectedBodyDir).toEqual({ x: 1, y: 0 });
  });

  it('rejects an inverted lifetime', () => {
    expect(createDefensiveMovementCommitment({
      player: basePlayers[0],
      observedCarrierGid: 12,
      candidate: candidate('d1', 5, 1),
      arrivalTime: 0.75,
      committedTick: 145,
      validUntilTick: 100,
    })).toBeNull();
  });

  it('returns separate arrival, corridor and separation facts', () => {
    const result = evaluateDefensiveCoverCoordination({
      snapshot: snapshot(basePlayers),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      commitment: makeCommitment()!,
      reachProfiles: profiles,
      currentTick: 110,
    })!;
    expect(result.commitmentAgeTicks).toBe(10);
    expect(result.commitmentRemainingTicks).toBe(35);
    expect(result.targetDistance).toBeGreaterThan(0);
    expect(result.selfArrivalA).toBeGreaterThan(0);
    expect(result.committedArrivalB).toBeGreaterThan(0.75);
    expect(result.selfCorridorDistanceA).toBeGreaterThanOrEqual(0);
    expect(result.bearingSeparation).not.toBeNull();
  });

  it('changes exposed outlet when only the committed target is mirrored', () => {
    const input = {
      snapshot: snapshot(basePlayers),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      reachProfiles: profiles,
      currentTick: 110,
    } as const;
    const nearA = evaluateDefensiveCoverCoordination({
      ...input,
      commitment: makeCommitment(candidate('near-a', 7, 0))!,
    })!;
    const nearB = evaluateDefensiveCoverCoordination({
      ...input,
      commitment: makeCommitment(candidate('near-b', 7, 4))!,
    })!;
    expect(nearA.relativelyExposedOutlet).toBe('b');
    expect(nearB.relativelyExposedOutlet).toBe('a');
    expect(nearA.selfArrivalA).toBe(nearB.selfArrivalA);
    expect(nearA.selfArrivalB).toBe(nearB.selfArrivalB);
  });

  it('rejects expired and pre-commit observations', () => {
    const base = {
      snapshot: snapshot(basePlayers),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      commitment: makeCommitment()!,
      reachProfiles: profiles,
    } as const;
    expect(evaluateDefensiveCoverCoordination({ ...base, currentTick: 99 })).toBeNull();
    expect(evaluateDefensiveCoverCoordination({ ...base, currentTick: 146 })).toBeNull();
  });

  it('rejects missing observed identities instead of consulting truth', () => {
    expect(evaluateDefensiveCoverCoordination({
      snapshot: snapshot(basePlayers.filter((entry) => entry.gid !== 11)),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      commitment: makeCommitment()!,
      reachProfiles: profiles,
      currentTick: 110,
    })).toBeNull();
  });

  it('rejects same-side outlets and opposite-side commitments', () => {
    const invalidPlayers = basePlayers.map((entry) =>
      entry.gid === 11 ? { ...entry, side: 0 as const } : entry);
    expect(evaluateDefensiveCoverCoordination({
      snapshot: snapshot(invalidPlayers),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      commitment: makeCommitment()!,
      reachProfiles: profiles,
      currentTick: 110,
    })).toBeNull();
  });

  it('is deterministic, pure and candidate-order independent', () => {
    const commitment = makeCommitment()!;
    const input = {
      snapshot: snapshot(basePlayers),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      commitment,
      reachProfiles: profiles,
      currentTick: 110,
    } as const;
    const first = evaluateDefensiveCoverCoordination(input);
    const second = evaluateDefensiveCoverCoordination(input);
    expect(first).toEqual(second);
    expect(commitment.targetPoint).toEqual({ x: 5, y: 1 });
  });

  it('does not expose a score, task, role or response winner', () => {
    const result = evaluateDefensiveCoverCoordination({
      snapshot: snapshot(basePlayers),
      playerGid: 2,
      outletAGid: 10,
      outletBGid: 11,
      candidate: candidate('d2', 4, 3),
      commitment: makeCommitment()!,
      reachProfiles: profiles,
      currentTick: 110,
    })! as unknown as Record<string, unknown>;
    expect(result.score).toBeUndefined();
    expect(result.task).toBeUndefined();
    expect(result.role).toBeUndefined();
    expect(result.winner).toBeUndefined();
  });
});
