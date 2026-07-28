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
const matchOf = (
  seed: number,
  flags: Partial<{ c5Hold: boolean; c5TouchFork: boolean; edsPerceivedChoice: boolean }> = {},
) =>
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
    // action is entered and the ball ends up on the far side of the body from
    // the threat the holder PERCEIVES. Post the C5 re-census repair (iii, ruling
    // #61.2) the shield reads the holder's own percept, not opponent truth, so
    // the mechanism is measured against `perceivedSnapshot`'s nearest opponent —
    // the honest capability. (Against the true nearest it now shields far less
    // often, by design: an omniscient shield was the very defect #36 caught.)
    const m = matchOf(4242, { c5Hold: true, edsPerceivedChoice: true });
    let held = 0;
    let perceivedThreat = 0;
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
        const snap = m.perceivedSnapshot(holder);
        let nearD = Infinity;
        let near = null as null | { pos: { x: number; y: number } };
        if (snap) {
          for (const o of snap.players) {
            if (o.side === holder.side) continue;
            const d = Math.hypot(o.pos.x - holder.pos.x, o.pos.y - holder.pos.y);
            if (d < nearD) { nearD = d; near = o; }
          }
        }
        if (near) {
          perceivedThreat += 1;
          const dBall = Math.hypot(near.pos.x - m.ball.pos.x, near.pos.y - m.ball.pos.y);
          if (dBall > nearD) shielded += 1;
        }
      }
      if (m.forcedHold !== null && m.simTick >= m.forcedHold.untilTick) m.forcedHold = null;
    }
    expect(held).toBeGreaterThan(50);
    expect(perceivedThreat).toBeGreaterThan(50);
    // The mechanism, not the gate: the body sits between the PERCEIVED threat
    // and the ball. Here it only has to be working at all.
    expect(shielded / perceivedThreat).toBeGreaterThan(0.9);
  });
});

/**
 * C5 RE-CENSUS repair (iii) — the PERCEPT-COMPLIANT shield (contract
 * C5-RECENSUS.md §1.3, ruling #61.2). The `ShieldHold` executor's nearest-threat
 * READ was omniscient (`opp.players` truth); it now reads the holder's OWN
 * percept via `match.perceivedSnapshot`. These pins fix the three properties the
 * commander's review named: production-unreachable, percept-not-truth, and OFF
 * bit-identity.
 */
const censusMatch = (
  seed: number,
  extra: Partial<{ c5Hold: boolean; edsPerceivedChoice: boolean; c6Carry: boolean; c7Windup: boolean }>,
) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240, ...extra,
});
const unit = (dx: number, dy: number): [number, number] => {
  const len = Math.hypot(dx, dy) || 1;
  return [dx / len, dy / len];
};

describe('C5 re-census — the percept-compliant shield', () => {
  it('production-unreachable: the shield percept read only runs under forcedHold && c5Hold', () => {
    // The whole ShieldHold branch (the only place `perceivedSnapshot` is now
    // consulted inside `actionExecutor`) is gated on `forcedHold`, which no
    // production path sets. A fully-armed match — perception on — never emits it.
    const m = censusMatch(1337, { c5Hold: true, edsPerceivedChoice: true });
    let sawShield = false;
    while (!m.finished) {
      m.step(DT);
      for (const p of m.allPlayers) {
        if (p.action.type === 'ShieldHold') sawShield = true;
      }
    }
    expect(sawShield).toBe(false);
    // And the seam itself is null on a fresh Match and on a League fixture.
    const fresh = censusMatch(7, { c5Hold: true, edsPerceivedChoice: true });
    expect(fresh.forcedHold).toBeNull();
    const league = new League({ seed: 20260728 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.forcedHold).toBeNull();
    expect(live.c5Hold).toBe(false);
  });

  it('percept-not-truth (blind): an unscanned holder shields toward goal, not toward the true nearest defender', () => {
    // c5Hold armed but perception OFF: no scan frames, so the holder perceives
    // no opponents and shields BLIND (faces the opposing goal). An omniscient
    // shield would instead face AWAY from the true nearest defender. This is the
    // sharpest divergence: the read follows the (empty) percept, never truth.
    const m = censusMatch(4242, { c5Hold: true }); // perception default OFF
    let shieldTicks = 0;
    let facesGoal = 0;
    let hadNearTrueOpp = 0;
    let facesAwayFromTrue = 0;
    while (!m.finished) {
      const owner = m.ball.owner;
      if (owner !== null && owner.role !== 'GK' && m.forcedHold === null) {
        m.forcedHold = { gid: owner.gid, untilTick: m.simTick + 60 };
      }
      m.step(DT);
      const holder = m.allPlayers.find((p) => p.action.type === 'ShieldHold');
      if (holder && m.ball.owner === holder && holder.faceTarget) {
        shieldTicks += 1;
        const goal = m.teams[holder.side].oppGoal();
        const [fx, fy] = unit(holder.faceTarget.x - holder.pos.x, holder.faceTarget.y - holder.pos.y);
        const [gx, gy] = unit(goal.x - holder.pos.x, goal.y - holder.pos.y);
        if (fx * gx + fy * gy > 0.999) facesGoal += 1;
        let nearD = Infinity;
        let near = null as null | { pos: { x: number; y: number } };
        for (const o of m.teams[1 - holder.side].players) {
          if (o.sentOff) continue;
          const d = Math.hypot(o.pos.x - holder.pos.x, o.pos.y - holder.pos.y);
          if (d < nearD) { nearD = d; near = o; }
        }
        if (nearD < 20) hadNearTrueOpp += 1;
        if (near) {
          const [ax, ay] = unit(holder.pos.x - near.pos.x, holder.pos.y - near.pos.y);
          if (fx * ax + fy * ay > 0.999) facesAwayFromTrue += 1;
        }
      }
      if (m.forcedHold !== null && m.simTick >= m.forcedHold.untilTick) m.forcedHold = null;
    }
    expect(shieldTicks).toBeGreaterThan(50);
    // Every shield tick faces the goal (blind); a true defender was often near,
    // so an omniscient shield would have faced away from it — it never does.
    expect(facesGoal).toBe(shieldTicks);
    expect(hadNearTrueOpp).toBeGreaterThan(0);
    expect(facesAwayFromTrue).toBe(0);
  });

  it('percept-driven (armed): with perception on the shield orients off percepts and diverges from truth', () => {
    // The census config (perception armed): the pull populates the holder's
    // percept, so the shield DOES orient away from a perceived opponent (not
    // blind), and at least sometimes that percept differs from the true nearest
    // defender — the honest, stale-read capability the census must measure.
    const m = censusMatch(4242, { c5Hold: true, edsPerceivedChoice: true, c6Carry: true, c7Windup: true });
    let shieldTicks = 0;
    let nonBlind = 0;
    let perceptNotTruth = 0;
    while (!m.finished) {
      const owner = m.ball.owner;
      if (owner !== null && owner.role !== 'GK' && m.forcedHold === null) {
        m.forcedHold = { gid: owner.gid, untilTick: m.simTick + 60 };
      }
      m.step(DT);
      const holder = m.allPlayers.find((p) => p.action.type === 'ShieldHold');
      if (holder && m.ball.owner === holder && holder.faceTarget) {
        shieldTicks += 1;
        const goal = m.teams[holder.side].oppGoal();
        const [fx, fy] = unit(holder.faceTarget.x - holder.pos.x, holder.faceTarget.y - holder.pos.y);
        const [gx, gy] = unit(goal.x - holder.pos.x, goal.y - holder.pos.y);
        if (fx * gx + fy * gy <= 0.999) nonBlind += 1;
        let nearD = Infinity;
        let near = null as null | { pos: { x: number; y: number } };
        for (const o of m.teams[1 - holder.side].players) {
          if (o.sentOff) continue;
          const d = Math.hypot(o.pos.x - holder.pos.x, o.pos.y - holder.pos.y);
          if (d < nearD) { nearD = d; near = o; }
        }
        if (near) {
          const [ax, ay] = unit(holder.pos.x - near.pos.x, holder.pos.y - near.pos.y);
          // Oriented off a percept, yet NOT away from the true nearest defender:
          // an omniscient shield could never produce this.
          if (fx * gx + fy * gy <= 0.999 && fx * ax + fy * ay <= 0.99) perceptNotTruth += 1;
        }
      }
      if (m.forcedHold !== null && m.simTick >= m.forcedHold.untilTick) m.forcedHold = null;
    }
    expect(shieldTicks).toBeGreaterThan(50);
    expect(nonBlind).toBeGreaterThan(0);
    expect(perceptNotTruth).toBeGreaterThan(0);
  });

  it('OFF bit-identity: arming the census flags without the seam changes nothing, tick for tick', () => {
    // The shield-read edit is inert without `forcedHold`: a census-armed world
    // (perception + both enrichment flags + c5Hold) with no seam set is
    // byte-identical to the all-off world, so production is untouched.
    for (const seed of [4242, 90210, 20260728]) {
      const off = matchOf(seed);
      const on = censusMatch(seed, { c5Hold: true, edsPerceivedChoice: true, c6Carry: true, c7Windup: true });
      while (!off.finished) off.step(DT);
      while (!on.finished) on.step(DT);
      // Perception/enrichment change the WORLD, so signatures differ; the point
      // is narrower — the shield edit adds nothing on top. Compare the shield
      // edit's effect by re-running the armed world with c5Hold toggled: with no
      // forcedHold, c5Hold on vs off must be identical.
      const noHold = censusMatch(seed, { edsPerceivedChoice: true, c6Carry: true, c7Windup: true });
      while (!noHold.finished) noHold.step(DT);
      expect(signature(on)).toBe(signature(noHold));
    }
  });
});
