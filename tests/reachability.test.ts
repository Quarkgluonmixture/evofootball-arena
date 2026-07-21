import { describe, expect, it } from 'vitest';
import { estimateReach, timeToReach, type ReachState } from '../src/ai/reachability';

const body = (over: Partial<ReachState> = {}): ReachState => ({
  pos: { x: 0, y: 0 },
  vel: { x: 0, y: 0 },
  bodyDir: { x: 1, y: 0 },
  topSpeed: 8,
  accel: 12,
  attrs: { dribbling: 0.5 },
  ...over,
});

describe('S1 timeToReach', () => {
  it('is pure, finite, and deterministic', () => {
    const p = body({ vel: { x: 2, y: 1 } });
    const before = JSON.stringify(p);
    const a = estimateReach(p, { x: 12, y: 4 });
    const b = estimateReach(p, { x: 12, y: 4 });
    expect(a).toEqual(b);
    expect(Number.isFinite(a.eta)).toBe(true);
    expect(JSON.stringify(p)).toBe(before);
  });

  it('current momentum has the correct directional bite', () => {
    const point = { x: 12, y: 0 };
    const toward = timeToReach(body({ vel: { x: 5, y: 0 } }), point);
    const still = timeToReach(body(), point);
    const away = timeToReach(body({ vel: { x: -5, y: 0 } }), point);
    expect(toward).toBeLessThan(still);
    expect(still).toBeLessThan(away);
  });

  it('fatigue-speed, acceleration, and carrying all price arrival rather than success', () => {
    const point = { x: 14, y: 0 };
    expect(timeToReach(body({ topSpeed: 8 }), point)).toBeLessThan(
      timeToReach(body({ topSpeed: 5 }), point),
    );
    expect(timeToReach(body({ accel: 14 }), point)).toBeLessThan(
      timeToReach(body({ accel: 7 }), point),
    );
    expect(timeToReach(body(), point)).toBeLessThan(
      timeToReach(body(), point, { carrying: true }),
    );
  });

  it('separates centre arrival from body readiness and reach radius', () => {
    const point = { x: 1, y: 0 };
    const facing = estimateReach(body(), point);
    const backTurned = estimateReach(body({ bodyDir: { x: -1, y: 0 } }), point);
    const movementOnly = estimateReach(body({ bodyDir: { x: -1, y: 0 } }), point, {
      requireFacing: false,
    });
    expect(backTurned.eta).toBeGreaterThan(facing.eta);
    expect(movementOnly.eta).toBe(backTurned.movementEta);
    expect(timeToReach(body(), point, { reachRadius: 1 })).toBe(0);
    expect(timeToReach(body({ bodyDir: { x: -1, y: 0 } }), point, { reachRadius: 1 }))
      .toBeGreaterThan(0);
    expect(timeToReach(body({ bodyDir: { x: -1, y: 0 } }), point, {
      reachRadius: 1,
      requireFacing: false,
    })).toBe(0);
  });
});
