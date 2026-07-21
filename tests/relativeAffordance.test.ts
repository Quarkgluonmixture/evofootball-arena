import { describe, expect, it } from 'vitest';
import {
  evaluateRelativePointAffordance,
  type RelativePointAffordanceInput,
} from '../src/ai/relativeAffordance';
import type { KnownReachProfile } from '../src/ai/reachability';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import { BOX_DEPTH, HALF_L, HALF_W } from '../src/sim/constants';

const observed = (
  gid: number,
  side: 0 | 1,
  x: number,
  y: number,
  vx = 0,
  vy = 0,
): ObservedPlayer => ({
  gid,
  side,
  pos: { x, y },
  vel: { x: vx, y: vy },
  bodyDir: { x: side === 0 ? 1 : -1, y: 0 },
  observedTick: 10,
  ageTicks: 0,
});

const profile = (topSpeed = 7, accel = 11): KnownReachProfile => ({
  topSpeed,
  accel,
  dribbling: 0.5,
});

const players = (): ObservedPlayer[] => [
  observed(0, 0, 0, 0, 2, 0),
  observed(1, 0, -4, 2),
  observed(2, 0, 2, -2, 1, 0),
  observed(3, 0, -8, 8),
  observed(6, 1, 12, 6),
  observed(7, 1, 9, -5),
  observed(8, 1, 2, 10),
];

const profiles = (values = players()): Map<number, KnownReachProfile> =>
  new Map(values.map((player) => [player.gid, profile()]));

const snapshot = (values = players(), ownerGid = 0): PerceptionSnapshot => ({
  tick: 10,
  observerGid: 1,
  awareness: 1,
  ball: {
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
    ownerGid,
    observedTick: 10,
    ageTicks: 0,
  },
  players: values,
});

const input = (overrides: Partial<RelativePointAffordanceInput> = {}): RelativePointAffordanceInput => ({
  relationId: 'test-relation',
  snapshot: snapshot(),
  playerGid: 1,
  carrierGid: 0,
  attackDir: 1,
  reachProfiles: profiles(),
  referenceIntent: {
    referenceGid: 2,
    targetPoint: { x: 7, y: -2 },
    arrivalTime: 1.5,
  },
  relativeOffset: { x: 3, y: 2 },
  commitments: [],
  currentTick: 10,
  barredFromOpposingBox: false,
  ...overrides,
});

describe('R1 dormant relative-affordance facts', () => {
  it('mirrors attack-forward geometry without mirroring pitch lateral geometry', () => {
    const right = evaluateRelativePointAffordance(input())!;
    const mirroredPlayers = players().map((player) => ({
      ...player,
      pos: { x: -player.pos.x, y: player.pos.y },
      vel: { x: -player.vel.x, y: player.vel.y },
      bodyDir: { x: -player.bodyDir.x, y: player.bodyDir.y },
    }));
    const left = evaluateRelativePointAffordance(input({
      snapshot: snapshot(mirroredPlayers),
      attackDir: -1,
      reachProfiles: profiles(mirroredPlayers),
      referenceIntent: {
        referenceGid: 2,
        targetPoint: { x: -7, y: -2 },
        arrivalTime: 1.5,
      },
    }))!;

    expect(right.targetPoint).toEqual({ x: 10, y: 0 });
    expect(left.targetPoint).toEqual({ x: -10, y: 0 });
    expect(left.projectedOffsideMargin).toBeCloseTo(right.projectedOffsideMargin, 12);
    expect(left.selfArrival).toBeCloseTo(right.selfArrival, 12);
  });

  it('moves the future relation only when the supplied reference intent changes', () => {
    const firstInput = input();
    const before = JSON.stringify(firstInput);
    const first = evaluateRelativePointAffordance(firstInput)!;
    const second = evaluateRelativePointAffordance(input({
      referenceIntent: {
        referenceGid: 2,
        targetPoint: { x: 4, y: 5 },
        arrivalTime: 1.5,
      },
    }))!;
    expect(first.targetPoint).toEqual({ x: 10, y: 0 });
    expect(second.targetPoint).toEqual({ x: 7, y: 7 });
    expect(JSON.stringify(firstInput)).toBe(before);
  });

  it('uses opponent motion for the projected line without changing the current line', () => {
    const dropping = players();
    dropping[4] = observed(6, 1, 12, 6, 3, 0);
    dropping[5] = observed(7, 1, 9, -5, 3, 0);
    const rising = players();
    rising[4] = observed(6, 1, 12, 6, -3, 0);
    rising[5] = observed(7, 1, 9, -5, -3, 0);
    const drop = evaluateRelativePointAffordance(input({
      snapshot: snapshot(dropping), reachProfiles: profiles(dropping),
    }))!;
    const rise = evaluateRelativePointAffordance(input({
      snapshot: snapshot(rising), reachProfiles: profiles(rising),
    }))!;
    expect(drop.currentOffsideLine).toBe(rise.currentOffsideLine);
    expect(drop.projectedOffsideLine).toBeGreaterThan(rise.projectedOffsideLine);
    expect(drop.projectedOffsideMargin).toBeLessThan(rise.projectedOffsideMargin);
  });

  it('improves arrival time and slack for the same faster mover', () => {
    const slowProfiles = profiles();
    slowProfiles.set(1, profile(4, 7));
    const fastProfiles = profiles();
    fastProfiles.set(1, profile(10, 16));
    const slow = evaluateRelativePointAffordance(input({ reachProfiles: slowProfiles }))!;
    const fast = evaluateRelativePointAffordance(input({ reachProfiles: fastProfiles }))!;
    expect(fast.selfArrival).toBeLessThan(slow.selfArrival);
    expect(fast.arrivalSlack).toBeGreaterThan(slow.arrivalSlack);
  });

  it('keeps outside-pitch and barred-box endpoints as explicit negative facts', () => {
    const outside = evaluateRelativePointAffordance(input({
      referenceIntent: {
        referenceGid: 2,
        targetPoint: { x: 7, y: HALF_W },
        arrivalTime: 1.5,
      },
      relativeOffset: { x: 0, y: 1 },
    }))!;
    expect(outside.insidePhysicalPitch).toBe(false);
    expect(outside.fieldMargin).toBeLessThan(0);
    expect(outside.pointAffordance).toBeNull();

    const boxX = HALF_L - BOX_DEPTH / 2;
    const barred = evaluateRelativePointAffordance(input({
      referenceIntent: {
        referenceGid: 2,
        targetPoint: { x: boxX, y: 0 },
        arrivalTime: 1.5,
      },
      relativeOffset: { x: 0, y: 0 },
      barredFromOpposingBox: true,
    }))!;
    expect(barred.insidePhysicalPitch).toBe(true);
    expect(barred.barredBoxIntrusion).toBe(true);
    expect(barred.barredAreaAllowed).toBe(false);
  });

  it('composes existing point-access and shared-occupancy facts without a score', () => {
    const result = evaluateRelativePointAffordance(input({
      commitments: [{
        playerGid: 3,
        carrierGid: 0,
        targetPoint: { x: 10, y: 0 },
        arrivalTime: 1.2,
        committedTick: 8,
        validUntilTick: 20,
      }],
    }))!;
    expect(result.pointAffordance).not.toBeNull();
    expect(result.pointAffordance!.opponentArrivalMargin).toBeTypeOf('number');
    expect(result.coordination).toMatchObject({
      activeCommitmentCount: 1,
      nearestTargetDistance: 0,
      nearestTargetPlayerGid: 3,
    });
    expect('score' in result).toBe(false);
    expect('pattern' in result).toBe(false);
    expect('committable' in result).toBe(false);
  });

  it('is deterministic and refuses missing or contradictory world facts', () => {
    const value = input();
    expect(evaluateRelativePointAffordance(value)).toEqual(evaluateRelativePointAffordance(value));
    expect(evaluateRelativePointAffordance(input({ playerGid: 2 }))).toBeNull();
    expect(evaluateRelativePointAffordance(input({ carrierGid: 99 }))).toBeNull();
    expect(evaluateRelativePointAffordance(input({
      referenceIntent: { referenceGid: 99, targetPoint: { x: 0, y: 0 }, arrivalTime: 1 },
    }))).toBeNull();
    expect(evaluateRelativePointAffordance(input({ snapshot: snapshot(players(), 99) }))).toBeNull();
    expect(evaluateRelativePointAffordance(input({
      relativeOffset: { x: Number.NaN, y: 0 },
    }))).toBeNull();
    const missingProfile = profiles();
    missingProfile.delete(6);
    expect(evaluateRelativePointAffordance(input({ reachProfiles: missingProfile }))).toBeNull();
  });
});
