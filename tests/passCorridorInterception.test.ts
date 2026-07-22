import { describe, expect, it } from 'vitest';
import {
  evaluatePassCorridorInterception,
} from '../src/ai/passCorridorInterception';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';

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
  bodyDir: { x: 1, y: 0 },
  observedTick: 100,
  ageTicks: gid,
});

const snapshot = (players: readonly ObservedPlayer[]): PerceptionSnapshot => ({
  observerGid: 10,
  tick: 100,
  awareness: 0.8,
  players,
  ball: null,
});

const profiles = new Map<number, KnownReachProfile>([
  [10, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [11, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
]);

const base = [
  observed(1, 0, 0, 0),
  observed(2, 0, 18, 0),
  observed(10, 1, 7, 1),
];

const evaluate = (players = base, defenderGid = 10) =>
  evaluatePassCorridorInterception({
    snapshot: snapshot(players),
    passerGid: 1,
    targetGid: 2,
    defenderGid,
    reachProfiles: profiles,
  });

describe('observer-grounded pass-corridor interception', () => {
  it('returns finite fixed-step race facts for an observed opponent', () => {
    const facts = evaluate()!;
    expect(facts.sampleCount).toBeGreaterThan(1);
    expect(Number.isFinite(facts.strongestMargin)).toBe(true);
    expect(facts.strongestBallTime).toBeGreaterThan(0);
    expect(facts.strongestDefenderEta).toBeGreaterThanOrEqual(0);
    expect(facts.strongestPathFraction).toBeGreaterThan(0);
    expect(facts.strongestPathFraction).toBeLessThanOrEqual(1.01);
  });

  it('finds an earlier feasible corridor point for a defender on the lane', () => {
    const facts = evaluate()!;
    expect(facts.earliestFeasiblePoint).not.toBeNull();
    expect(facts.earliestFeasibleBallTime).not.toBeNull();
    expect(facts.strongestMargin).toBeGreaterThanOrEqual(0);
  });

  it('keeps a distant defender late to the same pass', () => {
    const facts = evaluate([
      base[0],
      base[1],
      observed(10, 1, -15, 20),
    ])!;
    expect(facts.strongestMargin).toBeLessThan(0);
    expect(facts.earliestFeasiblePoint).toBeNull();
  });

  it('uses observed target motion in the intended pass flight', () => {
    const still = evaluate()!;
    const moving = evaluate([
      base[0],
      observed(2, 0, 18, 0, 0, 4),
      base[2],
    ])!;
    expect(moving.strongestPoint).not.toEqual(still.strongestPoint);
  });

  it('rejects a missing defender instead of consulting truth', () => {
    expect(evaluate(base.slice(0, 2))).toBeNull();
  });

  it('rejects same-side defenders and missing profiles', () => {
    expect(evaluate([base[0], base[1], observed(10, 0, 7, 1)])).toBeNull();
    expect(evaluate([...base, observed(11, 1, 7, 1)], 11)).not.toBeNull();
    const noProfile = evaluatePassCorridorInterception({
      snapshot: snapshot([...base, observed(12, 1, 7, 1)]),
      passerGid: 1,
      targetGid: 2,
      defenderGid: 12,
      reachProfiles: profiles,
    });
    expect(noProfile).toBeNull();
  });

  it('is deterministic and does not mutate its observation', () => {
    const world = snapshot(base);
    const before = JSON.stringify(world);
    const input = {
      snapshot: world,
      passerGid: 1,
      targetGid: 2,
      defenderGid: 10,
      reachProfiles: profiles,
    } as const;
    expect(evaluatePassCorridorInterception(input)).toEqual(
      evaluatePassCorridorInterception(input),
    );
    expect(JSON.stringify(world)).toBe(before);
  });

  it('does not expose a score, role, task, action or winner', () => {
    const facts = evaluate()! as unknown as Record<string, unknown>;
    expect(facts.score).toBeUndefined();
    expect(facts.role).toBeUndefined();
    expect(facts.task).toBeUndefined();
    expect(facts.action).toBeUndefined();
    expect(facts.winner).toBeUndefined();
  });
});
