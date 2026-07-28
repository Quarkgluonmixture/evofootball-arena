import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * C6 T1 — THE HONEST OFFSET, dormant (docs/world-model/C6-T1-HONEST-OFFSET.md).
 *
 * These are the X-family pinning tests the freeze names (§GATES):
 *   X-SEAM  — c6Carry is READ in exactly one place (the outfield fork), null on
 *             a fresh Match and a League fixture, and gates neither the de-glue
 *             branch nor the GK-hold path (single-fork-point).
 *   #48.3   — the seam writes only ball.pos/ball.vel, NEVER ball.owner
 *             (SEAM-NEVER-WRITES-OWNER, the structural zero-loose).
 * X-FP / X-OFF-IDENT (fingerprint + 3 league seeds × 2 seasons byte-identical to
 * pre-change HEAD) are proven by the house world-signature method in the run
 * result, not here; the default-off pin below is their unit-level companion.
 */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, c6Carry = false) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: 240, c6Carry,
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const matchSource = readFileSync(new URL('../src/sim/Match.ts', import.meta.url), 'utf8');

describe('C6 T1 — the honest offset is dormant', () => {
  it('default-off: c6Carry is false on a fresh Match and a League fixture', () => {
    expect(matchOf(7).c6Carry).toBe(false);
    // Not env-armed, not default-ON — Road B guarantees OFF regardless of EDS_BUNDLE.
    expect(new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) }).c6Carry).toBe(false);
    const league = new League({ seed: 20260727 });
    const fixture = league.nextFixture()!;
    const live = league.createMatch(fixture);
    expect(live.c6Carry).toBe(false);
  });

  it('X-SEAM: c6Carry is READ in exactly one place, and not on the de-glue / GK paths', () => {
    // Every `this.c6Carry` that is not the constructor assignment is a read.
    const reads = matchSource.split('\n').filter((l) =>
      l.includes('this.c6Carry') && !/this\.c6Carry\s*=[^=]/.test(l));
    expect(reads.length).toBe(1);
    // That one read is the outfield fork gate, joined with the 0.85 carry.
    expect(reads[0]).toContain("carry === 0.85");
    // The de-glue branch gate (v > 2.5 && nearOpp) and the GK 0.3 selector do
    // NOT mention c6Carry — the honest offset governs only the outfield glue.
    const deglue = matchSource.match(/o\.vel\.x \* o\.vel\.x[^\n]*> 2\.5 \* 2\.5/);
    expect(deglue).not.toBeNull();
    const gkSelector = matchSource.match(/gkDistributing\)\s*\n\s*\?\s*0\.3/);
    expect(gkSelector).not.toBeNull();
  });

  it('#48.3 SEAM-NEVER-WRITES-OWNER: the honest-offset seam writes ball.pos only', () => {
    // Structural: the law's method assigns ball.pos.x/ball.pos.y and touches
    // neither ball.owner nor ball.vel (ball.vel is the shipped common line).
    const body = matchSource.slice(
      matchSource.indexOf('private applyC6HonestOffset('),
      matchSource.indexOf('/* ---------------- ball physics ---------------- */'),
    );
    expect(body).toContain('ball.pos.x = owner.pos.x');
    expect(body).toContain('ball.pos.y = owner.pos.y');
    expect(body).not.toMatch(/ball\.owner\s*=/);
    expect(body).not.toMatch(/\.owner\s*=/);
    expect(body).not.toMatch(/ball\.vel\.[xy]\s*=/);
  });

  it('the seam is actually reached: arming c6Carry changes the world (non-vacuous)', () => {
    // If the fork never fired, ON would equal OFF and every pin above would be
    // vacuous. It fires: an armed world diverges from the shipped one.
    for (const seed of [4242, 90210, 20260727]) {
      const off = matchOf(seed, false);
      const on = matchOf(seed, true);
      while (!off.finished) off.step(DT);
      while (!on.finished) on.step(DT);
      expect(signature(on)).not.toBe(signature(off));
    }
  });

  it('X-DET: the armed world is deterministic (keyed noise, never match.rng)', () => {
    const a = matchOf(90210, true);
    const b = matchOf(90210, true);
    while (!a.finished) a.step(DT);
    while (!b.finished) b.step(DT);
    expect(signature(a)).toBe(signature(b));
    expect(a.score).toEqual(b.score);
  });
});
