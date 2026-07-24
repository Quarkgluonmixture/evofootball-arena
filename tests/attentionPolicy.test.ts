import { describe, expect, it } from 'vitest';
import { chooseAttentionGaze } from '../src/ai/attentionPolicy';
import {
  createObserverGaze,
  createPerceptionMemory,
  perceiveSnapshot,
  type ObserverGaze,
  type PerceptionSnapshot,
  type PerceptionTruth,
} from '../src/ai/perceptionSnapshot';

const OBSERVER = 3;
const ACTOR = 9;

const snapshot = (overrides: Partial<PerceptionSnapshot> = {}): PerceptionSnapshot => ({
  tick: 120,
  observerGid: OBSERVER,
  awareness: 0.8,
  ball: null,
  players: [
    {
      gid: OBSERVER, side: 0, pos: { x: 2, y: -1 }, vel: { x: 0, y: 0 },
      bodyDir: { x: 1, y: 0 }, observedTick: 120, ageTicks: 0,
    },
    {
      gid: ACTOR, side: 0, pos: { x: -4, y: 7 }, vel: { x: 1, y: 0 },
      bodyDir: { x: 0, y: 1 }, observedTick: 96, ageTicks: 24,
    },
  ],
  ...overrides,
});

const previous: ObserverGaze = { observerGid: OBSERVER, gazeDir: { x: 0, y: 1 }, establishedTick: 90 };

describe('S3-G1 chooseAttentionGaze', () => {
  it('aims at the last-known actor position relative to proprioceptive self, normalised', () => {
    const gaze = chooseAttentionGaze(snapshot(), ACTOR, previous);
    expect(gaze).not.toBe(previous);
    const dx = -4 - 2;
    const dy = 7 - -1;
    const len = Math.hypot(dx, dy);
    expect(gaze!.gazeDir.x).toBeCloseTo(dx / len, 12);
    expect(gaze!.gazeDir.y).toBeCloseTo(dy / len, 12);
    expect(Math.hypot(gaze!.gazeDir.x, gaze!.gazeDir.y)).toBeCloseTo(1, 12);
  });

  it('returns previousGaze unchanged when the actor fact is absent', () => {
    const view = snapshot({ players: snapshot().players.filter((p) => p.gid !== ACTOR) });
    expect(chooseAttentionGaze(view, ACTOR, previous)).toBe(previous);
    expect(chooseAttentionGaze(view, ACTOR, null)).toBeNull();
  });

  it('returns previousGaze when the aim is degenerate (actor at self)', () => {
    const base = snapshot();
    const view = snapshot({
      players: base.players.map((p) => (p.gid === ACTOR ? { ...p, pos: { x: 2, y: -1 } } : p)),
    });
    expect(chooseAttentionGaze(view, ACTOR, previous)).toBe(previous);
  });

  it('returns previousGaze when asked to attend to the observer itself', () => {
    expect(chooseAttentionGaze(snapshot(), OBSERVER, previous)).toBe(previous);
  });

  it('carries establishedTick = snapshot.tick and the snapshot observerGid, copied output', () => {
    const view = snapshot();
    const gaze = chooseAttentionGaze(view, ACTOR, previous)!;
    expect(gaze.establishedTick).toBe(view.tick);
    expect(gaze.observerGid).toBe(view.observerGid);
    const frozen = { ...gaze.gazeDir };
    (view.players[1].pos as { x: number }).x = 999;
    expect(gaze.gazeDir).toEqual(frozen);
  });

  it('is deterministic across identical inputs', () => {
    const a = chooseAttentionGaze(snapshot(), ACTOR, previous)!;
    const b = chooseAttentionGaze(snapshot(), ACTOR, previous)!;
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it('never mutates the snapshot or previousGaze', () => {
    const view = snapshot();
    const before = JSON.stringify(view);
    const prevBefore = JSON.stringify(previous);
    chooseAttentionGaze(view, ACTOR, previous);
    expect(JSON.stringify(view)).toBe(before);
    expect(JSON.stringify(previous)).toBe(prevBefore);
  });

  it('aged facts aim at the remembered position, not the true one', () => {
    // The snapshot remembers the actor at (-4, 7); pretend truth has moved on.
    const gaze = chooseAttentionGaze(snapshot(), ACTOR, previous)!;
    const rememberedBearing = Math.atan2(7 - -1, -4 - 2);
    expect(Math.atan2(gaze.gazeDir.y, gaze.gazeDir.x)).toBeCloseTo(rememberedBearing, 12);
  });

  it('produces a gaze the existing perceiveSnapshot validation accepts', () => {
    const truth: PerceptionTruth = {
      tick: 121,
      ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: null },
      players: [
        {
          gid: OBSERVER, side: 0, pos: { x: 2, y: -1 }, vel: { x: 0, y: 0 },
          bodyDir: { x: 1, y: 0 }, sentOff: false,
        },
        {
          gid: ACTOR, side: 0, pos: { x: -6, y: 9 }, vel: { x: 1, y: 0 },
          bodyDir: { x: 0, y: 1 }, sentOff: false,
        },
      ],
    };
    const gaze = chooseAttentionGaze(snapshot(), ACTOR, previous)!;
    const memory = createPerceptionMemory();
    expect(() => perceiveSnapshot(truth, OBSERVER, 0.8, 42, memory, gaze)).not.toThrow();
    const view = perceiveSnapshot(truth, OBSERVER, 0.8, 42, createPerceptionMemory(), gaze);
    // The remembered bearing points behind the body; gaze makes the true actor current.
    expect(view.players.some((p) => p.gid === ACTOR && p.ageTicks === 0)).toBe(true);
  });

  it('round-trips through createObserverGaze semantics (normalised copy)', () => {
    const direct = createObserverGaze(OBSERVER, { x: -6, y: 8 }, 120)!;
    const viaPolicy = chooseAttentionGaze(snapshot(), ACTOR, null)!;
    expect(Math.hypot(direct.gazeDir.x, direct.gazeDir.y)).toBeCloseTo(1, 12);
    expect(Math.hypot(viaPolicy.gazeDir.x, viaPolicy.gazeDir.y)).toBeCloseTo(1, 12);
  });
});
