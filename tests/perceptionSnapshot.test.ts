import { describe, expect, it } from 'vitest';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot, type PerceptionTruth,
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
});
