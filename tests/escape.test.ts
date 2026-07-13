import { describe, expect, it } from 'vitest';
import { escapeCarry } from '../src/ai/perception';
import type { Player } from '../src/sim/Player';
import { v2 } from '../src/utils/vec';

/**
 * 脱压带球 (Phase 34.2, user report "球员不会向后带球"): the pure predicate
 * both the scorer and the executor share. A pressured carrier with the
 * front door closed gets an AWAY-from-press direction; anything else — no
 * pressure, open front, final third, boxed in — must return null so the
 * normal forward game is untouched.
 */

const opp = (x: number, y: number): Player => ({ pos: v2(x, y), sentOff: false }) as unknown as Player;
const carrier = (x: number, y: number): Player => ({ pos: v2(x, y) }) as unknown as Player;

describe('escapeCarry', () => {
  it('pressured with the front closed → carries back/sideways with space', () => {
    // Wall ahead (attackDir +x), nothing behind.
    const esc = escapeCarry(carrier(0, 0), 1, 0, [opp(2, 0), opp(4, 1.5), opp(4, -1.5), opp(6, 0)]);
    expect(esc).not.toBeNull();
    expect(esc!.dir.x).toBeLessThan(0.3); // not still charging forward
    expect(esc!.space).toBeGreaterThanOrEqual(0.25);
  });

  it('no pressure → null (keep the normal game)', () => {
    expect(escapeCarry(carrier(0, 0), 1, 0, [opp(8, 0)])).toBeNull();
  });

  it('front door open → null even under side pressure', () => {
    expect(escapeCarry(carrier(0, 0), 1, 0, [opp(-2, 0)])).toBeNull();
  });

  it('final third → null (go at them, never turn tail)', () => {
    expect(escapeCarry(carrier(20, 0), 1, 20, [opp(22, 0), opp(24, 1.5), opp(24, -1.5)])).toBeNull();
  });

  it('boxed in on every side → null (not an escape, fight for it)', () => {
    const ring = [opp(1.4, 0), opp(-1.4, 0), opp(0, 1.4), opp(0, -1.4), opp(1, 1), opp(-1, -1), opp(1, -1), opp(-1, 1)];
    expect(escapeCarry(carrier(0, 0), 1, 0, ring)).toBeNull();
  });

  it('a WIDE carrier escapes OUTWARD to his touchline, never on an inward arc (34.3)', () => {
    // Winger at y=+14, wall ahead and a body inside — repulsion alone would
    // point him across the pitch; the wide bias sends him line-or-back.
    const esc = escapeCarry(carrier(0, 14), 1, 0, [opp(2, 14), opp(4, 15.5), opp(4, 12.5), opp(1, 11)]);
    expect(esc).not.toBeNull();
    expect(esc!.dir.y).toBeGreaterThan(0); // toward HIS touchline (+y), not inward
    expect(esc!.dir.x).toBeLessThan(0.3);
  });
});
