import { describe, expect, it } from 'vitest';
import { EDS_PREVIEW_MODES, edsPreviewFlags } from '../src/game/edsPreview';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';
import { createHash } from 'node:crypto';

/**
 * C5 T0 — the dormant hold's identity pins (contract §3.1).
 *
 * A dormant stage has exactly one real job: the world without it must be
 * unchanged. Everything here is that job, stated four ways.
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
const matchOf = (seed: number, flags: Partial<{ c5Hold: boolean; c5TouchFork: boolean }> = {}) =>
  new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: 240, ...flags,
  });
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina })),
})).digest('hex');

describe('C5 T0 — the hold is dormant', () => {
  it('X2: arming the flags with no seam set changes nothing, tick for tick', () => {
    // The pin the whole stage rests on. `forcedHold`/`forcedTouchFork` are the
    // ONLY doors; with them shut, an armed world must be the shipped world.
    for (const seed of [4242, 90210, 20260727]) {
      const off = matchOf(seed);
      const on = matchOf(seed, { c5Hold: true, c5TouchFork: true });
      while (!off.finished) off.step(DT);
      while (!on.finished) on.step(DT);
      expect(signature(on)).toBe(signature(off));
      expect(on.score).toEqual(off.score);
    }
  });

  it('X4: zero live callers — no candidate can ever emit ShieldHold', () => {
    // Armed, played out, and asked whether the action ever appeared. It cannot:
    // the only producer is the forcedHold branch, and nothing sets it.
    const m = matchOf(1337, { c5Hold: true, c5TouchFork: true });
    let sawShield = false;
    while (!m.finished) {
      m.step(DT);
      for (const p of m.allPlayers) {
        if (p.action.type === 'ShieldHold') sawShield = true;
        if (p.action.scores.some((s) => s.action === 'ShieldHold')) sawShield = true;
      }
    }
    expect(sawShield).toBe(false);
  });

  it('X4: the seams are null on a fresh Match and on a League fixture', () => {
    const m = matchOf(7);
    expect(m.forcedHold).toBeNull();
    expect(m.forcedTouchFork).toBeNull();
    expect(m.c5Hold).toBe(false);
    expect(m.c5TouchFork).toBe(false);
    const league = new League({ seed: 20260727 });
    const fixture = league.nextFixture()!;
    const live = league.createMatch(fixture);
    expect(live.c5Hold).toBe(false);
    expect(live.c5TouchFork).toBe(false);
    expect(live.forcedHold).toBeNull();
    expect(live.forcedTouchFork).toBeNull();
  });

  it('X4: neither flag is reachable from the E4 preview', () => {
    for (const mode of EDS_PREVIEW_MODES) {
      expect(edsPreviewFlags(mode).c5Hold).toBeUndefined();
      expect(edsPreviewFlags(mode).c5TouchFork).toBeUndefined();
    }
  });

  it('X3: the legacy HoldUp path still runs and is untouched', () => {
    // Not "HoldUp exists" — that it still FIRES in played matches, so the
    // narrow legacy action was not accidentally shadowed by the new one.
    // Scanned over a range on purpose: HoldUp needs an ST with his back to
    // goal under pressure in a narrow band of the pitch, so it appears in
    // roughly a third of random-genome matches and a single seed proves
    // nothing either way (measured while writing this pin: 10 of 30).
    let holdUpTicks = 0;
    for (let seed = 1000; seed < 1008; seed++) {
      const m = matchOf(seed);
      while (!m.finished) {
        m.step(DT);
        for (const p of m.allPlayers) if (p.action.type === 'HoldUp') holdUpTicks += 1;
      }
    }
    expect(holdUpTicks).toBeGreaterThan(0);
  });

  it('the seam WORKS when a probe opens it — the capability is real', () => {
    // The other half of dormancy: dormant must not mean broken. Forced, the
    // action is entered and the ball ends up on the far side of the body.
    const m = matchOf(4242, { c5Hold: true });
    let held = 0;
    let shielded = 0;
    while (!m.finished) {
      const owner = m.ball.owner;
      if (owner !== null && owner.role !== 'GK' && m.forcedHold === null) {
        m.forcedHold = { gid: owner.gid, untilTick: m.simTick + 60 };
      }
      m.step(DT);
      const holder = m.allPlayers.find((p) => p.action.type === 'ShieldHold');
      if (holder && m.ball.owner === holder) {
        held += 1;
        let nearD = Infinity;
        let near = null as null | typeof holder;
        for (const o of m.teams[1 - holder.side].players) {
          if (o.sentOff) continue;
          const d = Math.hypot(o.pos.x - holder.pos.x, o.pos.y - holder.pos.y);
          if (d < nearD) { nearD = d; near = o; }
        }
        if (near) {
          const dBall = Math.hypot(near.pos.x - m.ball.pos.x, near.pos.y - m.ball.pos.y);
          if (dBall > nearD) shielded += 1;
        }
      }
      if (m.forcedHold !== null && m.simTick >= m.forcedHold.untilTick) m.forcedHold = null;
    }
    expect(held).toBeGreaterThan(50);
    // The mechanism, not the gate: A1's 90% is measured by the anatomy probe
    // over a real population. Here it only has to be working at all.
    expect(shielded / held).toBeGreaterThan(0.5);
  });
});
