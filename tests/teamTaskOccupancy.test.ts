import { describe, expect, it } from 'vitest';
import {
  evaluateTeamCoordinationOccupancy,
  evaluateTeamCoordinationPlayerFacts,
  type TeamCoordinationClaim,
  type TeamCoordinationDemand,
} from '../src/ai/teamTaskOccupancy';

const demand = (
  overrides: Partial<TeamCoordinationDemand> = {},
): TeamCoordinationDemand => ({
  demandId: 'd:1',
  targetPoint: { x: 8, y: 3 },
  earliestArrival: 0.75,
  latestArrival: 1.5,
  minimumParticipants: 1,
  maximumParticipants: 1,
  publishedTick: 10,
  validUntilTick: 30,
  ...overrides,
});
const claim = (
  playerGid: number,
  overrides: Partial<TeamCoordinationClaim> = {},
): TeamCoordinationClaim => ({
  demandId: 'd:1',
  playerGid,
  committedTick: 12,
  validUntilTick: 25,
  ...overrides,
});

describe('C0 team coordination occupancy', () => {
  it('conserves an empty demand without fabricating occupancy', () => {
    expect(evaluateTeamCoordinationOccupancy({
      demand: demand({ minimumParticipants: 2, maximumParticipants: 3 }),
      claims: [],
      currentTick: 15,
    })).toMatchObject({
      activeClaimantGids: [],
      activeClaimCount: 0,
      missingParticipantCount: 2,
      excessParticipantCount: 0,
    });
  });

  it('reports below, within and above capacity as exact arithmetic', () => {
    const task = demand({ minimumParticipants: 2, maximumParticipants: 3 });
    const at = (claims: TeamCoordinationClaim[]) => evaluateTeamCoordinationOccupancy({
      demand: task,
      claims,
      currentTick: 15,
    })!;
    expect(at([claim(2)])).toMatchObject({
      activeClaimCount: 1, missingParticipantCount: 1, excessParticipantCount: 0,
    });
    expect(at([claim(2), claim(3)])).toMatchObject({
      activeClaimCount: 2, missingParticipantCount: 0, excessParticipantCount: 0,
    });
    expect(at([claim(2), claim(3), claim(4), claim(5)])).toMatchObject({
      activeClaimCount: 4, missingParticipantCount: 0, excessParticipantCount: 1,
    });
  });

  it('does not merge another opaque demand into current capacity', () => {
    const result = evaluateTeamCoordinationOccupancy({
      demand: demand(),
      claims: [claim(2, { demandId: 'd:other' })],
      currentTick: 15,
    })!;
    expect(result.activeClaimCount).toBe(0);
    expect(result.missingParticipantCount).toBe(1);
  });

  it('honours both active tick boundaries and ignores expired or future claims', () => {
    const task = demand({ publishedTick: 10, validUntilTick: 20 });
    const active = [
      claim(2, { committedTick: 10, validUntilTick: 10 }),
      claim(3, { committedTick: 11, validUntilTick: 20 }),
      claim(4, { committedTick: 21, validUntilTick: 30 }),
    ];
    expect(evaluateTeamCoordinationOccupancy({
      demand: task, claims: active, currentTick: 10,
    })!.activeClaimantGids).toEqual([2]);
    expect(evaluateTeamCoordinationOccupancy({
      demand: task, claims: active, currentTick: 20,
    })!.activeClaimantGids).toEqual([3]);
  });

  it('rejects duplicate active claims instead of double-counting them', () => {
    expect(evaluateTeamCoordinationOccupancy({
      demand: demand(),
      claims: [claim(2), claim(2, { committedTick: 13 })],
      currentTick: 15,
    })).toBeNull();
  });

  it('rejects malformed demand or claim facts', () => {
    expect(evaluateTeamCoordinationOccupancy({
      demand: demand({ minimumParticipants: 2, maximumParticipants: 1 }),
      claims: [],
      currentTick: 15,
    })).toBeNull();
    expect(evaluateTeamCoordinationOccupancy({
      demand: demand(),
      claims: [claim(2, { validUntilTick: 11 })],
      currentTick: 15,
    })).toBeNull();
    expect(evaluateTeamCoordinationOccupancy({
      demand: demand(),
      claims: [],
      currentTick: 31,
    })).toBeNull();
  });

  it('is input-order independent with stable claimant order', () => {
    const task = demand({ minimumParticipants: 1, maximumParticipants: 3 });
    const left = evaluateTeamCoordinationOccupancy({
      demand: task, claims: [claim(8), claim(2), claim(5)], currentTick: 15,
    });
    const right = evaluateTeamCoordinationOccupancy({
      demand: task, claims: [claim(5), claim(8), claim(2)], currentTick: 15,
    });
    expect(left).toEqual(right);
    expect(left!.activeClaimantGids).toEqual([2, 5, 8]);
  });

  it('keeps capacity changes confined to conservation arithmetic', () => {
    const claims = [claim(2), claim(3)];
    const narrow = evaluateTeamCoordinationOccupancy({
      demand: demand({ minimumParticipants: 1, maximumParticipants: 1 }),
      claims,
      currentTick: 15,
    })!;
    const broad = evaluateTeamCoordinationOccupancy({
      demand: demand({ minimumParticipants: 2, maximumParticipants: 3 }),
      claims,
      currentTick: 15,
    })!;
    expect(narrow.activeClaimantGids).toEqual(broad.activeClaimantGids);
    expect(narrow.targetPoint).toEqual(broad.targetPoint);
    expect(narrow).toMatchObject({ missingParticipantCount: 0, excessParticipantCount: 1 });
    expect(broad).toMatchObject({ missingParticipantCount: 0, excessParticipantCount: 0 });
  });

  it('changes arrival facts without changing occupancy', () => {
    const input = { demand: demand(), claims: [claim(3)], currentTick: 15, playerGid: 2 };
    const early = evaluateTeamCoordinationPlayerFacts({ ...input, arrivalTime: 0.5 })!;
    const inside = evaluateTeamCoordinationPlayerFacts({ ...input, arrivalTime: 1.25 })!;
    const late = evaluateTeamCoordinationPlayerFacts({ ...input, arrivalTime: 2 })!;
    expect(early.insideArrivalWindow).toBe(false);
    expect(inside.insideArrivalWindow).toBe(true);
    expect(late.insideArrivalWindow).toBe(false);
    expect(early.occupancy).toEqual(inside.occupancy);
    expect(inside.occupancy).toEqual(late.occupancy);
    expect(inside.earliestArrivalSlack).toBe(0.5);
    expect(inside.latestArrivalSlack).toBe(0.25);
  });

  it('reports other active claims without inventing a conflict', () => {
    const result = evaluateTeamCoordinationPlayerFacts({
      demand: demand(),
      claims: [
        claim(2),
        claim(2, { demandId: 'd:z' }),
        claim(2, { demandId: 'd:a' }),
        claim(3, { demandId: 'd:other-player' }),
      ],
      currentTick: 15,
      playerGid: 2,
      arrivalTime: 1,
    })!;
    expect(result.alreadyClaimsDemand).toBe(true);
    expect(result.otherActiveDemandIds).toEqual(['d:a', 'd:z']);
    expect(result.occupancy.activeClaimantGids).toEqual([2]);
  });

  it('preserves scalar facts under mirrored target geometry', () => {
    const left = evaluateTeamCoordinationPlayerFacts({
      demand: demand({ targetPoint: { x: 8, y: 3 } }),
      claims: [claim(2)], currentTick: 15, playerGid: 3, arrivalTime: 1,
    })!;
    const right = evaluateTeamCoordinationPlayerFacts({
      demand: demand({ targetPoint: { x: 8, y: -3 } }),
      claims: [claim(2)], currentTick: 15, playerGid: 3, arrivalTime: 1,
    })!;
    expect(right.occupancy.targetPoint).toEqual({ x: 8, y: -3 });
    expect({ ...right, occupancy: { ...right.occupancy, targetPoint: left.occupancy.targetPoint } })
      .toEqual(left);
  });

  it('is deterministic, copies output geometry and leaves inputs untouched', () => {
    const task = demand();
    const claims = [claim(2)];
    const input = { demand: task, claims, currentTick: 15, playerGid: 3, arrivalTime: 1 };
    const before = JSON.stringify(input);
    const first = evaluateTeamCoordinationPlayerFacts(input)!;
    const second = evaluateTeamCoordinationPlayerFacts(input)!;
    expect(first).toEqual(second);
    expect(first.occupancy.targetPoint).not.toBe(task.targetPoint);
    expect(JSON.stringify(input)).toBe(before);
  });
});
