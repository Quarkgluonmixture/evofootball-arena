import { describe, expect, it } from 'vitest';
import {
  advancePerceptionMemory, createPerceptionMemory, createScanFrame,
  materialisePerceptionSnapshot, observeBall, recordScanFrame, reconstructBodyMemory,
  type PerceptionTruth, type ScanFrame,
} from '../src/ai/perceptionSnapshot';

/**
 * EDS E3R2 — the perpetual pin for PULL perception (commander ruling #13.3).
 *
 * "A body knows what its scans would have shown, materialised at the moment it
 * acts." That is only true if the lazy reconstruction is the eager perception,
 * field for field — so this test drives BOTH paths over the same moving world,
 * at every awareness the substrate supports, and demands identical snapshots.
 * It is the X6 pattern: the cheap path is pinned against the honest one in
 * perpetuity, so nobody can make perception cheaper by making it blinder.
 */

const BRAIN_CADENCE = 9; // AI_INTERVAL 0.15s at 60Hz
const TICKS = 240;
const RING = 16;

/** A moving world: bodies on different orbits, a ball crossing them. */
const truthAt = (tick: number, count = 12): PerceptionTruth => ({
  tick,
  ball: {
    pos: { x: -30 + tick * 0.25, y: Math.sin(tick / 11) * 8 },
    vel: { x: 15, y: Math.cos(tick / 11) * 4 },
    ownerGid: tick % 97 === 0 ? 0 : null,
  },
  players: Array.from({ length: count }, (_, index) => {
    const phase = tick / (7 + index) + index;
    return {
      gid: index,
      side: (index % 2) as 0 | 1,
      pos: { x: Math.cos(phase) * (6 + index * 2.5), y: Math.sin(phase) * (4 + index * 1.5) },
      vel: { x: -Math.sin(phase) * 3, y: Math.cos(phase) * 3 },
      bodyDir: { x: Math.cos(phase * 1.3), y: Math.sin(phase * 1.3) },
      sentOff: index === 11 && tick > 150, // a sending-off mid-sequence
    };
  }),
});

describe('EDS E3R2 — pull perception is the same perception', () => {
  for (const awareness of [0.2, 0.5, 0.8, 1.0]) {
    it(`lazy reconstruction equals eager observation field for field (awareness ${awareness})`, () => {
      const observerGid = 3;
      const seed = 987_654;
      const eager = createPerceptionMemory();
      const lazy = createPerceptionMemory();
      const ring: ScanFrame[] = Array.from({ length: RING }, () => createScanFrame());
      let next = 0;
      let compared = 0;
      let nonEmpty = 0;

      for (let tick = 0; tick < TICKS; tick++) {
        const truth = truthAt(tick);
        if (tick % BRAIN_CADENCE === 0) {
          // The eager path: observe every visible body at scan time.
          advancePerceptionMemory(truth, observerGid, awareness, seed, eager);
          // The pull path: the ball eagerly (the sim reads it), and the moment
          // recorded when the scan clock fires — nothing observed yet.
          const before = lazy.nextScanTick;
          const observer = truth.players.find((player) => player.gid === observerGid)!;
          observeBall(lazy, observer, truth.ball, tick, awareness, seed);
          if (lazy.nextScanTick !== before) {
            recordScanFrame(ring[next], truth);
            next = (next + 1) % RING;
          }
        }
        // The pin's frozen predicate is "at every brain tick of the sequence"
        // (contract §3 P1) — a body is asked when it ACTS, and it acts on its
        // brain tick. §3's companion test below pins what happens if something
        // ever pulls between them.
        if (tick % BRAIN_CADENCE !== 0) continue;
        const ordered = Array.from({ length: RING }, (_, index) => ring[(next + index) % RING])
          .filter((frame) => frame.tick >= 0);
        reconstructBodyMemory(lazy, ordered, truthAt(tick), observerGid, awareness, seed);
        const fromEager = materialisePerceptionSnapshot(truth, observerGid, awareness, eager);
        const fromLazy = materialisePerceptionSnapshot(truth, observerGid, awareness, lazy);
        expect(fromLazy).toEqual(fromEager);
        compared += 1;
        if (fromEager.players.length > 1) nonEmpty += 1;
      }

      // The comparison must have had something to compare: a pin that only ever
      // matched two empty snapshots would pass while proving nothing.
      expect(compared).toBeGreaterThan(20);
      expect(nonEmpty).toBeGreaterThan(15);
    });
  }

  it('pulled BETWEEN brain ticks, the pull is merely UP TO DATE, never better informed', () => {
    // Measured, disclosed and pinned rather than left to drift. Off a brain
    // tick the two paths differ in exactly two ways, and both are "the pull
    // knows what time it is while the push is as of its last call":
    //   (a) the observer's own entry — proprioception is continuous by the
    //       eager path's own documented rule, so the pull reads the body now;
    //   (b) retention — the pull forgets everything older than the window as of
    //       NOW, while the eager memory still holds what was in window at its
    //       last call.
    // Crucially the pull never contains a body the eager path does not, and
    // every shared entry is identical: no extra information, ever. No live
    // consumer pulls off a brain tick (the chooser runs inside the decide
    // call), which is why P1 is frozen at brain ticks; this is the seat to
    // revisit if one ever does.
    const observerGid = 3;
    const seed = 987_654;
    const awareness = 0.8;
    const retention = Math.round(15 + awareness * 45);
    const eager = createPerceptionMemory();
    const lazy = createPerceptionMemory();
    const ring: ScanFrame[] = Array.from({ length: RING }, () => createScanFrame());
    let next = 0;
    let offTickComparisons = 0;
    for (let tick = 0; tick < TICKS; tick++) {
      const truth = truthAt(tick);
      if (tick % BRAIN_CADENCE === 0) {
        advancePerceptionMemory(truth, observerGid, awareness, seed, eager);
        const before = lazy.nextScanTick;
        const observer = truth.players.find((player) => player.gid === observerGid)!;
        observeBall(lazy, observer, truth.ball, tick, awareness, seed);
        if (lazy.nextScanTick !== before) {
          recordScanFrame(ring[next], truth);
          next = (next + 1) % RING;
        }
        continue;
      }
      if (tick % 5 !== 0) continue;
      const ordered = Array.from({ length: RING }, (_, index) => ring[(next + index) % RING])
        .filter((frame) => frame.tick >= 0);
      reconstructBodyMemory(lazy, ordered, truth, observerGid, awareness, seed);
      const fromEager = materialisePerceptionSnapshot(truth, observerGid, awareness, eager);
      const fromLazy = materialisePerceptionSnapshot(truth, observerGid, awareness, lazy);
      const byGid = (snapshot: typeof fromEager) => new Map(
        snapshot.players.filter((player) => player.gid !== observerGid)
          .map((player) => [player.gid, player]),
      );
      const eagerBodies = byGid(fromEager);
      const lazyBodies = byGid(fromLazy);
      for (const [gid, observed] of lazyBodies) {
        // No body the eager path does not have, and identical where shared.
        expect(eagerBodies.has(gid)).toBe(true);
        expect(observed).toEqual(eagerBodies.get(gid));
      }
      for (const [gid, observed] of eagerBodies) {
        // Anything the pull dropped must genuinely be out of retention NOW.
        if (!lazyBodies.has(gid)) expect(tick - observed.observedTick).toBeGreaterThan(retention);
      }
      expect(fromLazy.ball).toEqual(fromEager.ball);
      const selfLazy = fromLazy.players.find((player) => player.gid === observerGid)!;
      expect(selfLazy.observedTick).toBe(tick); // the body is known continuously
      offTickComparisons += 1;
    }
    expect(offTickComparisons).toBeGreaterThan(20);
  });

  it('the scan clock, not the asking, decides what a body could have seen', () => {
    // Asking more often must not reveal more: the pull is a replay of scans,
    // never a fresh look. Two observers with the same scans, one polled every
    // 5 ticks and one polled once at the end, must agree.
    const observerGid = 2;
    const seed = 42;
    const awareness = 0.8;
    const polled = createPerceptionMemory();
    const patient = createPerceptionMemory();
    const ring: ScanFrame[] = Array.from({ length: RING }, () => createScanFrame());
    let next = 0;
    for (let tick = 0; tick < 120; tick++) {
      const truth = truthAt(tick);
      if (tick % BRAIN_CADENCE === 0) {
        const observer = truth.players.find((player) => player.gid === observerGid)!;
        const before = polled.nextScanTick;
        observeBall(polled, observer, truth.ball, tick, awareness, seed);
        observeBall(patient, observer, truth.ball, tick, awareness, seed);
        if (polled.nextScanTick !== before) {
          recordScanFrame(ring[next], truth);
          next = (next + 1) % RING;
        }
      }
      if (tick % 5 === 0) {
        const ordered = Array.from({ length: RING }, (_, index) => ring[(next + index) % RING])
          .filter((frame) => frame.tick >= 0);
        reconstructBodyMemory(polled, ordered, truthAt(tick), observerGid, awareness, seed);
      }
    }
    const finalTruth = truthAt(119);
    const ordered = Array.from({ length: RING }, (_, index) => ring[(next + index) % RING])
      .filter((frame) => frame.tick >= 0);
    reconstructBodyMemory(polled, ordered, finalTruth, observerGid, awareness, 42);
    reconstructBodyMemory(patient, ordered, finalTruth, observerGid, awareness, 42);
    expect(materialisePerceptionSnapshot(finalTruth, observerGid, awareness, polled))
      .toEqual(materialisePerceptionSnapshot(finalTruth, observerGid, awareness, patient));
  });

  it('retention still forgets: a body seen once and never again drops out', () => {
    const observerGid = 0;
    const awareness = 0.8; // retention 51 ticks
    const memory = createPerceptionMemory();
    const ring: ScanFrame[] = [createScanFrame()];
    // One scan at tick 0 with a partner in view, then nothing ever again.
    const first: PerceptionTruth = {
      tick: 0,
      ball: { pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, ownerGid: null },
      players: [
        { gid: 0, side: 0, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
        { gid: 1, side: 0, pos: { x: 8, y: 0 }, vel: { x: 0, y: 0 }, bodyDir: { x: 1, y: 0 }, sentOff: false },
      ],
    };
    recordScanFrame(ring[0], first);
    const later = (tick: number): PerceptionTruth => ({ ...first, tick });
    reconstructBodyMemory(memory, ring, later(40), 0, awareness, 7);
    expect(memory.players.has(1)).toBe(true); // inside retention
    reconstructBodyMemory(memory, ring, later(60), 0, awareness, 7);
    expect(memory.players.has(1)).toBe(false); // 60 > 51: forgotten
    expect(memory.players.has(observerGid)).toBe(true); // proprioception is continuous
  });
});
