import { describe, expect, it } from 'vitest';
import { evaluatePassAffordance, observationAgeSeconds } from '../src/ai/passAffordance';
import { groundBallTravelTime, predictGroundPass } from '../src/ai/prediction';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import { BALL_FRICTION_K, DT } from '../src/sim/constants';

const player = (
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
  observedTick: 20,
  ageTicks: 0,
  ...over,
});

const snapshot = (players: ObservedPlayer[]): PerceptionSnapshot => ({
  tick: 20,
  observerGid: 0,
  awareness: 0.5,
  ball: { pos: { x: 0.6, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 0, observedTick: 20, ageTicks: 0 },
  players,
});

const profiles = (...gids: number[]) => new Map(gids.map((gid) => [gid, {
  topSpeed: 8,
  accel: 12,
  dribbling: 0.5,
}]));

describe('S4 ground-pass prediction', () => {
  it('matches the engine ground-friction displacement exactly', () => {
    const d = 18;
    const speed = 20;
    const t = groundBallTravelTime(d, speed);
    const steps = Math.round(t / DT);
    const friction = Math.exp(-BALL_FRICTION_K * DT);
    const displacement = (n: number) => speed * DT * (1 - friction ** n) / (1 - friction);
    expect(displacement(steps)).toBeGreaterThanOrEqual(d);
    expect(displacement(steps - 1)).toBeLessThan(d);
  });

  it('leads observed receiver motion without mutating the observation', () => {
    const target = { pos: { x: 12, y: 1 }, vel: { x: 3, y: 2 } };
    const before = JSON.stringify(target);
    const predicted = predictGroundPass({ x: 0, y: 0 }, target);
    expect(predicted.targetPoint.x).toBeGreaterThan(target.pos.x);
    expect(predicted.targetPoint.y).toBeGreaterThan(target.pos.y);
    expect(predicted.arrivalTime).toBeGreaterThan(0);
    expect(predicted.reachable).toBe(true);
    expect(JSON.stringify(target)).toBe(before);
  });
});

describe('S5 pass affordance vector', () => {
  it('prices arrival, pressure and control directionally without emitting one score', () => {
    const passer = player(0, 0, 0, 0);
    const target = player(1, 0, 12, 0);
    const far = evaluatePassAffordance({
      snapshot: snapshot([passer, target, player(6, 1, 25, 10), player(7, 1, 20, -10)]),
      passerGid: 0,
      targetGid: 1,
      attackDir: 1,
      reachProfiles: profiles(0, 1, 6, 7),
    })!;
    const close = evaluatePassAffordance({
      snapshot: snapshot([passer, target, player(6, 1, 12, 0), player(7, 1, 10, 2)]),
      passerGid: 0,
      targetGid: 1,
      attackDir: 1,
      reachProfiles: profiles(0, 1, 6, 7),
    })!;

    expect(far.affordance.arrivalMargin).toBeGreaterThan(close.affordance.arrivalMargin);
    expect(far.affordance.controlProbability).toBeGreaterThan(close.affordance.controlProbability);
    expect(far.affordance.receivePressure).toBeLessThan(close.affordance.receivePressure);
    expect('score' in far.affordance).toBe(false);
  });

  it('keeps body readiness, progression, line breaks, offside and exits separate', () => {
    const passer = player(0, 0, 0, 0);
    const target = player(1, 0, 12, 0, { bodyDir: { x: 1, y: 0 }, ageTicks: 6 });
    const result = evaluatePassAffordance({
      snapshot: snapshot([
        passer,
        target,
        player(2, 0, 10, 8),
        player(6, 1, 8, 1),
        player(7, 1, 10, -1),
      ]),
      passerGid: 0,
      targetGid: 1,
      attackDir: 1,
      reachProfiles: profiles(0, 1, 2, 6, 7),
    })!.affordance;

    expect(result.bodyReadiness).toBeLessThan(1);
    expect(result.progressionMetres).toBeGreaterThan(10);
    expect(result.lineBreakCount).toBe(2);
    expect(result.offsideMargin).toBeGreaterThan(0);
    expect(result.offsideRisk).toBeGreaterThan(0.5);
    expect(result.exitOptionCount).toBe(1);
    expect(result.targetObservationAgeTicks).toBe(6);
    expect(observationAgeSeconds(6)).toBeCloseTo(6 * DT, 12);
  });

  it('returns null when perception lacks the target instead of consulting truth', () => {
    expect(evaluatePassAffordance({
      snapshot: snapshot([player(0, 0, 0, 0), player(6, 1, 10, 0)]),
      passerGid: 0,
      targetGid: 1,
      attackDir: 1,
      reachProfiles: profiles(0, 1, 6),
    })).toBeNull();
  });

  it('does not mistake an unobserved defence for open space', () => {
    expect(evaluatePassAffordance({
      snapshot: snapshot([player(0, 0, 0, 0), player(1, 0, 12, 0)]),
      passerGid: 0,
      targetGid: 1,
      attackDir: 1,
      reachProfiles: profiles(0, 1),
    })).toBeNull();
  });
});
