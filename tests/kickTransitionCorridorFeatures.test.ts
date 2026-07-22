import { describe, expect, it } from 'vitest';
import {
  KICK_TRANSITION_CORRIDOR_FEATURE_DIMENSIONS,
  KICK_TRANSITION_CORRIDOR_FEATURE_VERSION,
  projectKickTransitionCorridorFeaturesV1,
} from '../src/ai/kickTransitionCorridorFeatures';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../src/ai/reachability';

const observed = (gid: number, side: 0 | 1, x: number, y: number): ObservedPlayer => ({
  gid,
  side,
  pos: { x, y },
  vel: { x: 0, y: 0 },
  bodyDir: { x: 1, y: 0 },
  observedTick: 100,
  ageTicks: 0,
});

const world: PerceptionSnapshot = {
  observerGid: 1,
  tick: 100,
  awareness: 0.8,
  ball: null,
  players: [
    observed(1, 0, 0, 0),
    observed(2, 0, 18, 0),
    observed(10, 1, 7, 1),
    observed(11, 1, -12, 16),
  ],
};

const profiles = new Map<number, KnownReachProfile>([
  [10, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
  [11, { topSpeed: 7, accel: 6, dribbling: 0.5 }],
]);

const project = (defenderGids: readonly number[]) =>
  projectKickTransitionCorridorFeaturesV1({
    snapshot: world,
    passerGid: 1,
    targetGid: 2,
    defenderGids,
    reachProfiles: profiles,
  });

describe('T-CORRIDOR-0 observer pathwise transition facts', () => {
  it('projects a finite total summary of the strongest observed defender', () => {
    const result = project([10, 11])!;
    expect(result.version).toBe(KICK_TRANSITION_CORRIDOR_FEATURE_VERSION);
    expect(Object.keys(result.features)).toEqual(KICK_TRANSITION_CORRIDOR_FEATURE_DIMENSIONS);
    expect(Object.values(result.features).every(Number.isFinite)).toBe(true);
    expect(result.strongestDefenderGid).toBe(10);
    expect(result.supportedDefenderCount).toBe(2);
    expect(result.features.corridorFeasibleDefenderCount).toBeGreaterThanOrEqual(1);
  });

  it('is invariant to defender input order and does not mutate the snapshot', () => {
    const before = JSON.stringify(world);
    expect(project([11, 10])).toEqual(project([10, 11]));
    expect(JSON.stringify(world)).toBe(before);
  });

  it('returns unsupported rather than filling absent defenders with zero', () => {
    expect(project([])).toBeNull();
    expect(project([99])).toBeNull();
  });

  it('does not expose a probability, winner, action or role', () => {
    const result = project([10, 11])! as unknown as Record<string, unknown>;
    expect(result.probability).toBeUndefined();
    expect(result.winner).toBeUndefined();
    expect(result.action).toBeUndefined();
    expect(result.role).toBeUndefined();
  });
});
