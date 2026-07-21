import { describe, expect, it } from 'vitest';
import {
  evaluateOffBallAffordances, evaluateOffBallCandidate, generateOffBallCandidates,
} from '../src/ai/offBallAffordance';
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

const snapshot = (players: ObservedPlayer[]): PerceptionSnapshot => ({
  tick: 100,
  observerGid: 1,
  awareness: 0.7,
  ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 0, observedTick: 100, ageTicks: 0 },
  players,
});

const profile = (topSpeed = 8, accel = 12): KnownReachProfile => ({ topSpeed, accel });

const profiles = (entries: readonly [number, KnownReachProfile][]) => new Map(entries);

const evaluate = (
  players: ObservedPlayer[],
  reachProfiles = profiles([
    [0, profile()], [1, profile()], [2, profile()], [6, profile()], [7, profile()],
  ]),
) => evaluateOffBallAffordances({
  snapshot: snapshot(players),
  playerGid: 1,
  carrierGid: 0,
  attackDir: 1,
  reachProfiles,
});

const candidate = (
  affordances: NonNullable<ReturnType<typeof evaluate>>,
  id: string,
) => affordances.find((entry) => entry.candidate.id === id)!;

describe('O0 off-ball candidate field', () => {
  it('is deterministic, unique, in-bounds and covers the full attack-frame directions', () => {
    const player = observed(1, 0, 0, 0);
    const before = JSON.stringify(player);
    const first = generateOffBallCandidates(player, profile(), 1);
    const second = generateOffBallCandidates(player, profile(), 1);

    expect(second).toEqual(first);
    expect(JSON.stringify(player)).toBe(before);
    expect(new Set(first.map((entry) => entry.id)).size).toBe(first.length);
    expect(first).toHaveLength(17);
    expect(first.every((entry) => (
      Math.abs(entry.point.x) <= HALF_L - 2 && Math.abs(entry.point.y) <= HALF_W - 2
    ))).toBe(true);
    expect(first.some((entry) => entry.forwardDelta > 0 && Math.abs(entry.lateralDelta) < 1e-9)).toBe(true);
    expect(first.some((entry) => entry.forwardDelta < 0 && Math.abs(entry.lateralDelta) < 1e-9)).toBe(true);
    expect(first.some((entry) => Math.abs(entry.forwardDelta) < 1e-9 && entry.lateralDelta > 0)).toBe(true);
    expect(first.some((entry) => Math.abs(entry.forwardDelta) < 1e-9 && entry.lateralDelta < 0)).toBe(true);
    expect(first.every((entry) => !('score' in entry) && !('pattern' in entry))).toBe(true);
  });

  it('rotates the same role-neutral field with attack direction', () => {
    const player = observed(1, 0, 4, -3);
    const right = generateOffBallCandidates(player, profile(), 1);
    const left = generateOffBallCandidates(player, profile(), -1);
    expect(left.map((entry) => entry.id)).toEqual(right.map((entry) => entry.id));
    for (let i = 0; i < right.length; i++) {
      expect(left[i].point.x - player.pos.x).toBeCloseTo(-(right[i].point.x - player.pos.x), 12);
      expect(left[i].point.y).toBeCloseTo(right[i].point.y, 12);
    }
  });

  it('does not create duplicated boundary targets', () => {
    const points = generateOffBallCandidates(observed(1, 0, HALF_L - 2.1, HALF_W - 2.1), profile(), 1);
    expect(points.length).toBeLessThan(17);
    const positions = points.map((entry) => `${entry.point.x.toFixed(12)}:${entry.point.y.toFixed(12)}`);
    expect(new Set(positions).size).toBe(positions.length);
  });
});

describe('O0 off-ball affordance vector', () => {
  const basePlayers = () => [
    observed(0, 0, -4, 0),
    observed(1, 0, 0, 0, { ageTicks: 3 }),
    observed(2, 0, -8, 8),
    observed(6, 1, 15, 8),
    observed(7, 1, 16, -8),
  ];

  it('keeps opponent pressure, teammate occupancy and lane clearance as separate facts', () => {
    const open = evaluate(basePlayers())!;
    const point = candidate(open, '0:0').candidate.point;

    const blockedPlayers = basePlayers();
    blockedPlayers[3] = observed(6, 1, point.x, point.y);
    const blocked = evaluate(blockedPlayers)!;
    expect(candidate(open, '0:0').opponentArrivalMargin)
      .toBeGreaterThan(candidate(blocked, '0:0').opponentArrivalMargin);
    expect(candidate(open, '0:0').nearestOpponentDistanceAtArrival)
      .toBeGreaterThan(candidate(blocked, '0:0').nearestOpponentDistanceAtArrival);

    const occupiedPlayers = basePlayers();
    occupiedPlayers[2] = observed(2, 0, point.x, point.y);
    const occupied = evaluate(occupiedPlayers)!;
    expect(candidate(open, '0:0').nearestTeammateDistanceAtArrival)
      .toBeGreaterThan(candidate(occupied, '0:0').nearestTeammateDistanceAtArrival);

    const lanePlayers = basePlayers();
    lanePlayers[3] = observed(6, 1, (point.x - 4) / 2, 0);
    const laneBlocked = evaluate(lanePlayers)!;
    expect(candidate(open, '0:0').carrierLaneClearance)
      .toBeGreaterThan(candidate(laneBlocked, '0:0').carrierLaneClearance);
  });

  it('improves self arrival and margin for a physically faster player', () => {
    const players = basePlayers();
    const slowProfiles = profiles([
      [0, profile()], [1, profile(5, 8)], [2, profile()], [6, profile()], [7, profile()],
    ]);
    const fastProfiles = profiles([
      [0, profile()], [1, profile(9, 15)], [2, profile()], [6, profile()], [7, profile()],
    ]);
    const fixedPoint = generateOffBallCandidates(players[1], slowProfiles.get(1)!, 1)
      .find((entry) => entry.id === '0:0')!;
    const baseInput = {
      snapshot: snapshot(players), playerGid: 1, carrierGid: 0, attackDir: 1 as const,
    };
    const slow = evaluateOffBallCandidate({ ...baseInput, reachProfiles: slowProfiles }, fixedPoint)!;
    const fast = evaluateOffBallCandidate({ ...baseInput, reachProfiles: fastProfiles }, fixedPoint)!;
    expect(fast.selfArrival).toBeLessThan(slow.selfArrival);
    expect(fast.opponentArrivalMargin).toBeGreaterThan(slow.opponentArrivalMargin);
  });

  it('exposes offside as a fact without filtering or labelling the candidate', () => {
    const values = evaluate([
      observed(0, 0, 2, 0),
      observed(1, 0, 5, 0),
      observed(2, 0, -5, 8),
      observed(6, 1, 8, 8),
      observed(7, 1, 9, -8),
    ])!;
    const back = candidate(values, '0:4');
    const forward = candidate(values, '0:0');
    expect(forward.offsideMargin).toBeGreaterThan(back.offsideMargin);
    expect(forward.offsideRisk).toBeGreaterThan(back.offsideRisk);
    expect('score' in forward).toBe(false);
    expect('pattern' in forward).toBe(false);
  });

  it('is pure, deterministic and refuses missing world facts', () => {
    const players = basePlayers();
    const snap = snapshot(players);
    const reachProfiles = profiles([
      [0, profile()], [1, profile()], [2, profile()], [6, profile()], [7, profile()],
    ]);
    const input = { snapshot: snap, playerGid: 1, carrierGid: 0, attackDir: 1 as const, reachProfiles };
    const beforeSnapshot = JSON.stringify(snap);
    const beforeProfiles = JSON.stringify([...reachProfiles]);
    const first = evaluateOffBallAffordances(input);
    const second = evaluateOffBallAffordances(input);
    expect(second).toEqual(first);
    expect(JSON.stringify(snap)).toBe(beforeSnapshot);
    expect(JSON.stringify([...reachProfiles])).toBe(beforeProfiles);
    expect(first!.every((entry) => !('score' in entry) && !('pattern' in entry))).toBe(true);

    expect(evaluateOffBallAffordances({ ...input, carrierGid: 99 })).toBeNull();
    expect(evaluateOffBallAffordances({
      ...input,
      snapshot: snapshot(players.filter((entry) => entry.side === 0)),
    })).toBeNull();
    const missingOpponentProfile = new Map(reachProfiles);
    missingOpponentProfile.delete(6);
    expect(evaluateOffBallAffordances({ ...input, reachProfiles: missingOpponentProfile })).toBeNull();
  });
});
