import { describe, expect, it } from 'vitest';
import {
  appendObservedMotionSample,
  evaluateTemporalMotionEvidence,
  type ObservedMotionHistory,
} from '../src/ai/motionEvidence';
import type { ObservedPlayer, PerceptionSnapshot } from '../src/ai/perceptionSnapshot';

const actor = (
  tick: number,
  pos: { x: number; y: number },
  vel: { x: number; y: number },
  bodyDir: { x: number; y: number } = { x: 1, y: 0 },
  ageTicks = 0,
): ObservedPlayer => ({
  gid: 2,
  side: 0,
  pos,
  vel,
  bodyDir,
  observedTick: tick - ageTicks,
  ageTicks,
});

const snapshot = (tick: number, observedActor: ObservedPlayer | null): PerceptionSnapshot => ({
  tick,
  observerGid: 1,
  awareness: 0.8,
  ball: null,
  players: observedActor ? [observedActor] : [],
});

const historyOf = (
  values: readonly {
    tick: number;
    pos: { x: number; y: number };
    vel: { x: number; y: number };
    body?: { x: number; y: number };
  }[],
): ObservedMotionHistory => {
  let history: ObservedMotionHistory | null = null;
  for (const value of values) {
    const next = appendObservedMotionSample(
      snapshot(value.tick, actor(value.tick, value.pos, value.vel, value.body)),
      2, 3, 4, history,
    );
    if (!next) throw new Error('invalid fixture');
    history = next;
  }
  if (!history) throw new Error('empty fixture');
  return history;
};

describe('observer-local temporal motion evidence', () => {
  it('does not append a stale repeated observation', () => {
    const first = historyOf([{ tick: 10, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } }]);
    const stale = appendObservedMotionSample(
      snapshot(12, actor(12, { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, 2)),
      2, 3, 4, first,
    )!;
    expect(stale.samples).toHaveLength(1);
    expect(stale.samples).toEqual(first.samples);
    expect(stale.samples).not.toBe(first.samples);
  });

  it('rejects an out-of-order observation tick', () => {
    const first = historyOf([{ tick: 10, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } }]);
    expect(appendObservedMotionSample(
      snapshot(11, actor(9, { x: 0, y: 0 }, { x: 1, y: 0 })), 2, 3, 4, first,
    )).toBeNull();
  });

  it('rejects actor, reference and epoch mismatches', () => {
    const first = historyOf([{ tick: 10, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } }]);
    expect(appendObservedMotionSample(
      snapshot(11, actor(11, { x: 1, y: 0 }, { x: 1, y: 0 })), 2, 9, 4, first,
    )).toBeNull();
    expect(appendObservedMotionSample(
      snapshot(11, actor(11, { x: 1, y: 0 }, { x: 1, y: 0 })), 2, 3, 5, first,
    )).toBeNull();
    expect(appendObservedMotionSample(snapshot(11, null), 2, 3, 4, first)).toBeNull();
  });

  it('requires exactly three strictly newer samples for total evidence', () => {
    expect(evaluateTemporalMotionEvidence(historyOf([
      { tick: 10, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 18, pos: { x: 1, y: 0 }, vel: { x: 1, y: 0 } },
    ]))).toBeNull();
  });

  it('reports constant velocity with zero deltas and turns', () => {
    const result = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 60, pos: { x: 1, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 120, pos: { x: 2, y: 0 }, vel: { x: 1, y: 0 } },
    ]))!;
    expect(result.firstSpeedDelta).toBe(0);
    expect(result.secondSpeedDelta).toBe(0);
    expect(result.firstVelocityTurn).toBe(0);
    expect(result.secondVelocityTurn).toBe(0);
    expect(result.displacementPersistence).toBe(1);
  });

  it('reports braking as negative speed deltas without private state', () => {
    const result = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 2, y: 0 } },
      { tick: 10, pos: { x: 0.2, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 20, pos: { x: 0.3, y: 0 }, vel: { x: 0.2, y: 0 } },
    ]))!;
    expect(result.firstSpeedDelta).toBe(-1);
    expect(result.secondSpeedDelta).toBeCloseTo(-0.8, 12);
    expect(Object.keys(result)).not.toContain('targetPoint');
  });

  it('reports signed velocity and body redirection', () => {
    const result = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 }, body: { x: 1, y: 0 } },
      { tick: 10, pos: { x: 0.2, y: 0 }, vel: { x: 1, y: 0 }, body: { x: 1, y: 0 } },
      { tick: 20, pos: { x: 0.3, y: 0.1 }, vel: { x: 0, y: 1 }, body: { x: 0, y: 1 } },
    ]))!;
    expect(result.secondVelocityTurn).toBeCloseTo(Math.PI / 2, 12);
    expect(result.secondBodyTurn).toBeCloseTo(Math.PI / 2, 12);
  });

  it('keeps zero-displacement persistence unsupported rather than zero', () => {
    const result = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } },
      { tick: 10, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } },
      { tick: 20, pos: { x: 1, y: 0 }, vel: { x: 1, y: 0 } },
    ]))!;
    expect(result.displacementPersistence).toBeNull();
  });

  it('copies source observations and retains only the newest three', () => {
    const mutable = actor(0, { x: 0, y: 0 }, { x: 1, y: 0 });
    let history = appendObservedMotionSample(snapshot(0, mutable), 2, 3, 4, null)!;
    (mutable.pos as { x: number }).x = 99;
    expect(history.samples[0].pos.x).toBe(0);
    for (const tick of [10, 20, 30]) {
      history = appendObservedMotionSample(
        snapshot(tick, actor(tick, { x: tick / 10, y: 0 }, { x: 1, y: 0 })),
        2, 3, 4, history,
      )!;
    }
    expect(history.samples.map((sample) => sample.observedTick)).toEqual([10, 20, 30]);
  });

  it('keeps coach doctrine and familiarity outside temporal evidence', () => {
    const result = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 10, pos: { x: 1, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 20, pos: { x: 2, y: 0 }, vel: { x: 1, y: 0 } },
    ]))!;
    expect(Object.keys(result)).not.toContain('coachDoctrine');
    expect(Object.keys(result)).not.toContain('familiarity');
  });

  it('cannot observe private revocation before a new body observation', () => {
    const history = historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 10, pos: { x: 1, y: 0 }, vel: { x: 1, y: 0 } },
      { tick: 20, pos: { x: 2, y: 0 }, vel: { x: 1, y: 0 } },
    ]);
    const repeated = appendObservedMotionSample(
      snapshot(21, actor(21, { x: 2, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0 }, 1)),
      2, 3, 4, history,
    )!;
    expect(repeated).toEqual(history);
  });

  it('preserves speed and flips signed turns under a mirror transform', () => {
    const original = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 }, body: { x: 1, y: 0 } },
      { tick: 10, pos: { x: 1, y: 0.2 }, vel: { x: 1, y: 0.2 }, body: { x: 1, y: 0.2 } },
      { tick: 20, pos: { x: 1.5, y: 1 }, vel: { x: 0.5, y: 1 }, body: { x: 0.5, y: 1 } },
    ]))!;
    const mirrored = evaluateTemporalMotionEvidence(historyOf([
      { tick: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 }, body: { x: 1, y: 0 } },
      { tick: 10, pos: { x: 1, y: -0.2 }, vel: { x: 1, y: -0.2 }, body: { x: 1, y: -0.2 } },
      { tick: 20, pos: { x: 1.5, y: -1 }, vel: { x: 0.5, y: -1 }, body: { x: 0.5, y: -1 } },
    ]))!;
    expect(mirrored.lastSpeed).toBeCloseTo(original.lastSpeed, 12);
    expect(mirrored.firstVelocityTurn).toBeCloseTo(-original.firstVelocityTurn!, 12);
    expect(mirrored.secondBodyTurn).toBeCloseTo(-original.secondBodyTurn!, 12);
  });
});
