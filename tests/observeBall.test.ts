import { describe, expect, it } from 'vitest';
import {
  createPerceptionMemory, observeBall, perceiveSnapshot,
  type PerceptionTruth, type PerceptionTruthPlayer,
} from '../src/ai/perceptionSnapshot';

/**
 * EDS E2b-1R HONESTY PIN (gate X6). The O(1) ball percept exists to compute
 * less, never to perceive less, and this is what keeps that true: driven over
 * the same tick sequence with memory chains advanced in lockstep, the cheap
 * path must return exactly what the full snapshot's ball returns. If a future
 * change makes the cheap path blinder — a wider cone, a slower scan, a dropped
 * error channel — it fails here rather than silently flattering a perf gate.
 */

const body = (gid: number, x: number, y: number, facing: number): PerceptionTruthPlayer => ({
  gid,
  side: gid % 2 === 0 ? 0 : 1,
  pos: { x, y },
  vel: { x: 0.3, y: -0.2 },
  bodyDir: { x: Math.cos(facing), y: Math.sin(facing) },
  sentOff: false,
});

describe('EDS E2b-1R ball-only percept', () => {
  it('X6: returns exactly what the full snapshot ball returns', () => {
    for (const awareness of [0.2, 0.5, 0.8, 1]) {
      for (const facing of [0, Math.PI / 2, Math.PI, -Math.PI / 3]) {
        for (const ownerGid of [null, 0, 1]) {
          for (const ballX of [1, 6, 17, 30, 55]) {
            const observer = body(0, 0, 0, facing);
            const others = [observer, body(1, 5, 5, 0), body(2, -12, 3, 1), body(3, 25, -8, 2)];
            const full = createPerceptionMemory();
            const cheap = createPerceptionMemory();
            // Drive both chains over the same ticks: scan cadence, retention
            // and the keyed error are all tick-dependent, so a single-shot
            // comparison would prove nothing.
            for (let tick = 0; tick < 40; tick++) {
              const truth: PerceptionTruth = {
                tick,
                ball: {
                  pos: { x: ballX + tick * 0.4, y: 2 - tick * 0.1 },
                  vel: { x: 4.5, y: -1.25 },
                  ownerGid,
                },
                players: others,
              };
              const fromFull = perceiveSnapshot(truth, 0, awareness, 4242, full).ball;
              const fromCheap = observeBall(
                cheap, observer, truth.ball, tick, awareness, 4242,
              );
              expect(fromCheap).toEqual(fromFull);
            }
          }
        }
      }
    }
  });

  it('a carrier knows his own ball exactly, on the cheap path too', () => {
    const observer = body(0, 10, -4, 0.7);
    const memory = createPerceptionMemory();
    const seen = observeBall(
      memory, observer,
      { pos: { x: 10.2, y: -4.1 }, vel: { x: 1, y: 2 }, ownerGid: 0 },
      7, 0.2, 99,
    );
    // Proprioception is exact regardless of awareness — no observation error.
    expect(seen?.pos).toEqual({ x: 10.2, y: -4.1 });
    expect(seen?.ageTicks).toBe(0);
  });

  it('forgets the ball once retention lapses', () => {
    const observer = body(0, 0, 0, 0);
    const memory = createPerceptionMemory();
    observeBall(memory, observer, { pos: { x: 2, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 1 }, 0, 0.8, 7);
    expect(memory.ball).not.toBeNull();
    // Far away and behind: no re-acquisition, so the memory must lapse.
    const away = body(0, 200, 200, Math.PI);
    for (let tick = 1; tick <= 80; tick++) {
      observeBall(memory, away, { pos: { x: 2, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: 1 }, tick, 0.8, 7);
    }
    expect(memory.ball).toBeNull();
  });
});
