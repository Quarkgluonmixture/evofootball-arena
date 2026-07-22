import { describe, expect, it } from 'vitest';
import {
  capturePerceptionTruth, createObserverGaze, createPerceptionMemory, oraclePerceptionSnapshot,
  perceiveSnapshot, type PerceptionTruth,
} from '../src/ai/perceptionSnapshot';
import type { Match } from '../src/sim/Match';

const truth = (tick = 0): PerceptionTruth => ({
  tick,
  ball: { pos: { x: 0.6, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 0 },
  players: [
    { gid: 0, side: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
    { gid: 1, side: 0, pos: { x: 15, y: 4 }, vel: { x: 2, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
    { gid: 7, side: 1, pos: { x: 10, y: -3 }, vel: { x: -1, y: 1 }, bodyDir: { x: -1, y: 0 }, sentOff: false },
  ],
});

const positionError = (snapshot: ReturnType<typeof perceiveSnapshot>, world: PerceptionTruth): number => {
  let sum = 0;
  let n = 0;
  for (const observed of snapshot.players) {
    if (observed.gid === snapshot.observerGid) continue;
    const actual = world.players.find((p) => p.gid === observed.gid)!;
    sum += Math.hypot(observed.pos.x - actual.pos.x, observed.pos.y - actual.pos.y);
    n++;
  }
  return sum / Math.max(n, 1);
};

describe('S3 PerceptionSnapshot', () => {
  it('captures the public sim tick and copies mutable match vectors', () => {
    const match = {
      simTick: 19,
      ball: { pos: { x: 2, y: 3 }, vel: { x: 4, y: 5 }, owner: null },
      allPlayers: [{
        gid: 0, side: 0, pos: { x: 6, y: 7 }, vel: { x: 8, y: 9 },
        bodyDir: { x: 1, y: 0 }, sentOff: false,
      }],
    } as unknown as Match;
    const captured = capturePerceptionTruth(match);
    match.ball.pos.x = 99;
    match.allPlayers[0].pos.x = 99;

    expect(captured.tick).toBe(19);
    expect(captured.ball.pos).toEqual({ x: 2, y: 3 });
    expect(captured.players[0].pos).toEqual({ x: 6, y: 7 });
  });

  it('builds a copied full-truth snapshot only for offline oracle probes', () => {
    const world = truth(19);
    const snapshot = oraclePerceptionSnapshot(world, 0);
    expect(snapshot).toMatchObject({ tick: 19, observerGid: 0, awareness: 1 });
    expect(snapshot.players.every((player) => player.ageTicks === 0)).toBe(true);
    expect(snapshot.players[0].pos).not.toBe(world.players[0].pos);
  });

  it('is deterministic for the same keyed world and independent memories', () => {
    const world = truth(24);
    const a = perceiveSnapshot(world, 0, 0.5, 991, createPerceptionMemory());
    const b = perceiveSnapshot(world, 0, 0.5, 991, createPerceptionMemory());
    expect(a).toEqual(b);
  });

  it('awareness lowers functional observation error without changing truth', () => {
    const world = truth(24);
    const before = JSON.stringify(world);
    const low = perceiveSnapshot(world, 0, 0.2, 991, createPerceptionMemory());
    const high = perceiveSnapshot(world, 0, 0.8, 991, createPerceptionMemory());
    expect(positionError(high, world)).toBeLessThan(positionError(low, world));
    expect(JSON.stringify(world)).toBe(before);
  });

  it('holds last-known facts between scans and reports their age', () => {
    const memory = createPerceptionMemory();
    const first = perceiveSnapshot(truth(0), 0, 0.5, 77, memory);
    const moved: PerceptionTruth = {
      ...truth(1),
      players: truth(1).players.map((p) => p.gid === 7 ? { ...p, pos: { x: 9, y: -3 } } : p),
    };
    const stale = perceiveSnapshot(moved, 0, 0.5, 77, memory);
    const a = first.players.find((p) => p.gid === 7)!;
    const b = stale.players.find((p) => p.gid === 7)!;
    expect(b.pos).toEqual(a.pos);
    expect(b.ageTicks).toBe(1);
  });

  it('the on-ball passer has a fresh exact ball cue even between scans', () => {
    const memory = createPerceptionMemory();
    perceiveSnapshot(truth(12), 0, 0, 4, memory);
    const base = truth(13);
    const next: PerceptionTruth = { ...base, ball: { ...base.ball, pos: { x: 0.8, y: 0 } } };
    const snap = perceiveSnapshot(next, 0, 0, 4, memory);
    expect(snap.ball).toMatchObject({ pos: { x: 0.8, y: 0 }, ownerGid: 0, observedTick: 13, ageTicks: 0 });
  });

  it('keeps the observer body exact and fresh between visual scans', () => {
    const memory = createPerceptionMemory();
    perceiveSnapshot(truth(12), 0, 0, 4, memory);
    const base = truth(13);
    const next: PerceptionTruth = {
      ...base,
      players: base.players.map((p) => p.gid === 0 ? {
        ...p,
        pos: { x: 0.25, y: -0.1 },
        vel: { x: 3, y: 1 },
        bodyDir: { x: 0, y: 1 },
      } : p),
    };
    const observer = perceiveSnapshot(next, 0, 0, 4, memory).players.find((p) => p.gid === 0)!;
    expect(observer).toMatchObject({
      pos: { x: 0.25, y: -0.1 },
      vel: { x: 3, y: 1 },
      bodyDir: { x: 0, y: 1 },
      observedTick: 13,
      ageTicks: 0,
    });
  });

  it('rejects invalid gaze and copies a normalised valid direction', () => {
    expect(createObserverGaze(0, { x: 0, y: 0 }, 0)).toBeNull();
    expect(createObserverGaze(0, { x: Number.NaN, y: 1 }, 0)).toBeNull();
    expect(createObserverGaze(0, { x: Number.POSITIVE_INFINITY, y: 1 }, 0)).toBeNull();
    const source = { x: 3, y: 4 };
    const gaze = createObserverGaze(0, source, 2)!;
    source.x = 99;
    expect(gaze).toEqual({ observerGid: 0, gazeDir: { x: 0.6, y: 0.8 }, establishedTick: 2 });
  });

  it('rejects a wrong-observer, future or forged non-unit gaze', () => {
    const world = truth(4);
    expect(() => perceiveSnapshot(
      world, 0, 0.8, 7, createPerceptionMemory(), createObserverGaze(1, { x: 1, y: 0 }, 0),
    )).toThrow(/Invalid gaze/);
    expect(() => perceiveSnapshot(
      world, 0, 0.8, 7, createPerceptionMemory(), createObserverGaze(0, { x: 1, y: 0 }, 5),
    )).toThrow(/Invalid gaze/);
    expect(() => perceiveSnapshot(
      world, 0, 0.8, 7, createPerceptionMemory(), {
        observerGid: 0, gazeDir: { x: 2, y: 0 }, establishedTick: 0,
      },
    )).toThrow(/Invalid gaze/);
  });

  it('keeps absent gaze byte-equivalent to the body-facing path', () => {
    const world = truth(24);
    expect(perceiveSnapshot(world, 0, 0.8, 9, createPerceptionMemory()))
      .toEqual(perceiveSnapshot(world, 0, 0.8, 9, createPerceptionMemory(), null));
  });

  it('separates gaze from body direction without changing external body state', () => {
    const world: PerceptionTruth = {
      tick: 0,
      ball: { pos: { x: 0, y: 6 }, vel: { x: 0, y: 0 }, ownerGid: null },
      players: [
        { gid: 0, side: 0, pos: { x: 0, y: 0 }, vel: { x: 1, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 1, side: 0, pos: { x: 12, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 7, side: 1, pos: { x: -12, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: -1, y: 0 }, sentOff: false },
      ],
    };
    const before = JSON.stringify(world);
    const right = perceiveSnapshot(
      world, 0, 0.8, 11, createPerceptionMemory(), createObserverGaze(0, { x: 1, y: 0 }, 0),
    );
    const left = perceiveSnapshot(
      world, 0, 0.8, 11, createPerceptionMemory(), createObserverGaze(0, { x: -1, y: 0 }, 0),
    );
    expect(right.players.some((player) => player.gid === 1 && player.ageTicks === 0)).toBe(true);
    expect(right.players.some((player) => player.gid === 7)).toBe(false);
    expect(left.players.some((player) => player.gid === 7 && player.ageTicks === 0)).toBe(true);
    expect(left.players.some((player) => player.gid === 1)).toBe(false);
    expect(right.players.find((player) => player.gid === 0)?.bodyDir).toEqual({ x: 1, y: 0 });
    expect(left.players.find((player) => player.gid === 0)?.bodyDir).toEqual({ x: 1, y: 0 });
    expect(JSON.stringify(world)).toBe(before);
  });

  it('keeps near-field bodies and an owned ball fresh behind gaze', () => {
    const world: PerceptionTruth = {
      tick: 0,
      ball: { pos: { x: 0.4, y: 0 }, vel: { x: 1, y: 0 }, ownerGid: 0 },
      players: [
        { gid: 0, side: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 1, side: 0, pos: { x: -3, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
      ],
    };
    const snap = perceiveSnapshot(
      world, 0, 0.8, 13, createPerceptionMemory(), createObserverGaze(0, { x: 1, y: 0 }, 0),
    );
    expect(snap.players.find((player) => player.gid === 1)?.ageTicks).toBe(0);
    expect(snap.ball).toMatchObject({ pos: { x: 0.4, y: 0 }, observedTick: 0, ageTicks: 0 });
  });

  it('applies gaze only on the scan clock and retains old facts as aged memory', () => {
    const world: PerceptionTruth = {
      tick: 0,
      ball: { pos: { x: 0, y: 8 }, vel: { x: 0, y: 0 }, ownerGid: null },
      players: [
        { gid: 0, side: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 1, side: 0, pos: { x: 12, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 7, side: 1, pos: { x: -12, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: -1, y: 0 }, sentOff: false },
      ],
    };
    const memory = createPerceptionMemory();
    perceiveSnapshot(
      world, 0, 0.8, 17, memory, createObserverGaze(0, { x: 1, y: 0 }, 0),
    );
    const tick1 = { ...world, tick: 1 };
    const beforeScan = perceiveSnapshot(
      tick1, 0, 0.8, 17, memory, createObserverGaze(0, { x: -1, y: 0 }, 1),
    );
    expect(beforeScan.players.some((player) => player.gid === 7)).toBe(false);
    expect(beforeScan.players.find((player) => player.gid === 1)?.ageTicks).toBe(1);
    const tick8 = { ...world, tick: 8 };
    const afterScan = perceiveSnapshot(
      tick8, 0, 0.8, 17, memory, createObserverGaze(0, { x: -1, y: 0 }, 1),
    );
    expect(afterScan.players.find((player) => player.gid === 7)?.ageTicks).toBe(0);
    expect(afterScan.players.find((player) => player.gid === 1)?.ageTicks).toBe(8);
  });

  it('preserves keyed observations for entities visible under two gazes', () => {
    const world: PerceptionTruth = {
      tick: 0,
      ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: null },
      players: [
        { gid: 0, side: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 4, side: 0, pos: { x: 0, y: 12 }, vel: { x: 1, y: 1 }, bodyDir: { x: 0, y: 1 }, sentOff: false },
      ],
    };
    const northeast = perceiveSnapshot(
      world, 0, 0.8, 19, createPerceptionMemory(), createObserverGaze(0, { x: 1, y: 1 }, 0),
    );
    const northwest = perceiveSnapshot(
      world, 0, 0.8, 19, createPerceptionMemory(), createObserverGaze(0, { x: -1, y: 1 }, 0),
    );
    expect(northeast.players.find((player) => player.gid === 4))
      .toEqual(northwest.players.find((player) => player.gid === 4));
  });
});
