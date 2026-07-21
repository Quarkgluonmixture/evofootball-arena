import { describe, expect, it } from 'vitest';
import {
  evaluateCarryAffordances,
  evaluateCarryCandidate,
  generateCarryCandidates,
} from '../src/ai/carryAffordance';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';
import { HALF_L, HALF_W } from '../src/sim/constants';

const observed = (
  gid: number,
  side: 0 | 1,
  x: number,
  y: number,
  over: Partial<ObservedPlayer> = {},
): ObservedPlayer => ({
  gid,
  side,
  pos: { x, y },
  vel: { x: 0, y: 0 },
  bodyDir: { x: 1, y: 0 },
  observedTick: 100,
  ageTicks: 0,
  ...over,
});

const profile = (topSpeed = 8, accel = 12): KnownReachProfile => ({ topSpeed, accel });

const players = () => [
  observed(1, 0, 0, 0, { ageTicks: 2 }),
  observed(2, 0, -7, 8),
  observed(6, 1, 12, 7),
  observed(7, 1, 14, -7),
];

const snapshot = (values = players(), ownerGid: number | null = 1): PerceptionSnapshot => ({
  tick: 100,
  observerGid: 1,
  awareness: 0.7,
  ball: {
    pos: { x: 0.4, y: 0 },
    vel: { x: 0, y: 0 },
    ownerGid,
    observedTick: 100,
    ageTicks: 0,
  },
  players: values,
});

const profiles = (controller = profile()) => new Map<number, KnownReachProfile>([
  [1, controller], [2, profile()], [6, profile()], [7, profile()],
]);

const evaluate = (
  values = players(),
  reachProfiles = profiles(),
  attackDir: 1 | -1 = 1,
) => evaluateCarryAffordances({
  snapshot: snapshot(values),
  controllerGid: 1,
  attackDir,
  reachProfiles,
});

describe('K0 carry-direction candidates', () => {
  it('is deterministic, unique, symmetric and role-free', () => {
    const controller = observed(1, 0, 0, 0);
    const before = JSON.stringify(controller);
    const first = generateCarryCandidates(controller, profile(), 1);
    const second = generateCarryCandidates(controller, profile(), 1);
    expect(second).toEqual(first);
    expect(JSON.stringify(controller)).toBe(before);
    expect(first).toHaveLength(33);
    expect(new Set(first.map((candidate) => candidate.id)).size).toBe(first.length);
    expect(first.every((candidate) =>
      Math.abs(candidate.point.x) <= HALF_L - 2
      && Math.abs(candidate.point.y) <= HALF_W - 2)).toBe(true);
    expect(first.filter((candidate) => candidate.directionIndex !== null)
      .map((candidate) => candidate.directionIndex)).toContain(15);
    expect(first.every((candidate) =>
      !('score' in candidate) && !('pattern' in candidate) && !('role' in candidate)))
      .toBe(true);
  });

  it('mirrors only attack-frame x', () => {
    const controller = observed(1, 0, 4, -3);
    const right = generateCarryCandidates(controller, profile(), 1);
    const left = generateCarryCandidates(controller, profile(), -1);
    expect(left.map((candidate) => candidate.id)).toEqual(right.map((candidate) => candidate.id));
    for (let index = 0; index < right.length; index++) {
      expect(left[index].point.x - controller.pos.x)
        .toBeCloseTo(-(right[index].point.x - controller.pos.x), 12);
      expect(left[index].point.y).toBeCloseTo(right[index].point.y, 12);
    }
  });

  it('rejects duplicate boundary points rather than clamping them', () => {
    const result = generateCarryCandidates(
      observed(1, 0, HALF_L - 2.1, HALF_W - 2.1),
      profile(),
      1,
    );
    expect(result.length).toBeLessThan(33);
    const points = result.map((candidate) =>
      `${candidate.point.x.toFixed(12)}:${candidate.point.y.toFixed(12)}`);
    expect(new Set(points).size).toBe(points.length);
  });
});

describe('K0 carry-direction affordance facts', () => {
  it('keeps endpoint pressure, travel corridor and teammate occupancy separate', () => {
    const open = evaluate()!;
    const base = open.find((value) => value.candidate.id === '1:0')!;

    const endpointBlocked = players();
    endpointBlocked[2] = observed(6, 1, base.candidate.point.x, base.candidate.point.y);
    const blocked = evaluate(endpointBlocked)!
      .find((value) => value.candidate.id === '1:0')!;
    expect(blocked.opponentArrivalMargin).toBeLessThan(base.opponentArrivalMargin);
    expect(blocked.nearestOpponentDistanceAtArrival)
      .toBeLessThan(base.nearestOpponentDistanceAtArrival);

    const corridorBlocked = players();
    corridorBlocked[2] = observed(6, 1, base.candidate.point.x / 2, 0);
    const lane = evaluate(corridorBlocked)!
      .find((value) => value.candidate.id === '1:0')!;
    expect(lane.travelCorridorClearance).toBeLessThan(base.travelCorridorClearance);

    const occupied = players();
    occupied[1] = observed(2, 0, base.candidate.point.x, base.candidate.point.y);
    const teammate = evaluate(occupied)!
      .find((value) => value.candidate.id === '1:0')!;
    expect(teammate.nearestTeammateDistanceAtArrival)
      .toBeLessThan(base.nearestTeammateDistanceAtArrival);
  });

  it('separates goal geometry from opponent access at one fixed point', () => {
    const input = {
      snapshot: snapshot(), controllerGid: 1, reachProfiles: profiles(),
    };
    const fixed = generateCarryCandidates(players()[0], profile(), 1)
      .find((candidate) => candidate.id === '1:0')!;
    const right = evaluateCarryCandidate({ ...input, attackDir: 1 }, fixed)!;
    const left = evaluateCarryCandidate({ ...input, attackDir: -1 }, fixed)!;
    expect(right.opponentArrivalMargin).toBe(left.opponentArrivalMargin);
    expect(right.goalwardProgression).toBeGreaterThan(0);
    expect(left.goalwardProgression).toBeLessThan(0);
  });

  it('reads body direction and physical reach without moving the point', () => {
    const fixed = generateCarryCandidates(players()[0], profile(), 1)
      .find((candidate) => candidate.id === '1:0')!;
    const forward = evaluateCarryCandidate({
      snapshot: snapshot(), controllerGid: 1, attackDir: 1, reachProfiles: profiles(),
    }, fixed)!;
    const reversedPlayers = players();
    reversedPlayers[0] = observed(1, 0, 0, 0, { bodyDir: { x: -1, y: 0 } });
    const reversed = evaluateCarryCandidate({
      snapshot: snapshot(reversedPlayers), controllerGid: 1, attackDir: 1,
      reachProfiles: profiles(),
    }, fixed)!;
    const fast = evaluateCarryCandidate({
      snapshot: snapshot(), controllerGid: 1, attackDir: 1,
      reachProfiles: profiles(profile(10, 16)),
    }, fixed)!;
    expect(reversed.bodyAlignment).toBeLessThan(forward.bodyAlignment);
    expect(reversed.selfTurnTime).toBeGreaterThan(forward.selfTurnTime);
    expect(fast.selfArrival).toBeLessThan(forward.selfArrival);
  });

  it('rejects missing ownership, defence and profiles instead of inventing space', () => {
    expect(evaluateCarryAffordances({
      snapshot: snapshot(players(), null), controllerGid: 1, attackDir: 1,
      reachProfiles: profiles(),
    })).toBeNull();
    expect(evaluate(players().filter((player) => player.side === 0))).toBeNull();
    const missing = profiles();
    missing.delete(6);
    expect(evaluate(players(), missing)).toBeNull();
  });

  it('is deterministic, immutable and contains no hidden selector output', () => {
    const input = {
      snapshot: snapshot(), controllerGid: 1, attackDir: 1 as const,
      reachProfiles: profiles(),
    };
    const before = JSON.stringify(input.snapshot);
    const first = evaluateCarryAffordances(input)!;
    const second = evaluateCarryAffordances(input)!;
    expect(second).toEqual(first);
    expect(JSON.stringify(input.snapshot)).toBe(before);
    expect(first.every((value) =>
      !('score' in value)
      && !('winner' in value)
      && !('pattern' in value)
      && !('role' in value)
      && !('policy' in value))).toBe(true);
  });
});
