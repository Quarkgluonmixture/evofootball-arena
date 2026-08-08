import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match, O2_LOOK_TICKS } from '../src/sim/Match';
import { runHeadless } from '../src/sim/simRunner';
import { DT } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { a4MatchFlags, A4_WORLD_FLAGS } from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import type { Player } from '../src/sim/Player';

/**
 * O2 T0 — THE LOOK (`o2Look`), DORMANT
 * (docs/world-model/O2-T0-DORMANT-SEAM.md, contract O2-LOOK-CONTRACT §3).
 *
 * The O1-T1 / C7-T1 test idiom carried over. The gates these pin (§GATES):
 *   G1  X-FP-PROD        the production fingerprint 57b0bdab…c673 is unchanged
 *   G2  FLAG-OFF IDENTITY  absent ≡ false ≡ plain, tick for tick
 *   G3  BORN EQUIVALENT  ARMED with no instrument ≡ OFF (M-O2.3)
 *   G4  NON-VACUITY      forced, the seam is reached and the world diverges
 *   G5  NO RNG           zero rng draws at arm and across the whole window
 *   G6  NEVER RELEASES OWNERSHIP  ball owned every window tick; no owner write
 *   G7  FROZEN INTERVAL  every completed window is exactly O2_LOOK_TICKS ticks,
 *                        and that number IS the traced C7 constant family
 *   G8  THE REFRESH IS REAL  one scan moment per look tick (the cadence), and
 *                        heading-gated: the cone is applied unchanged
 *   G9  SEAM SINGULARITY / FLAG HYGIENE  one arm site; not in a4World, not in
 *                        any bundle/preset/env default
 *   plus the re-decide lock (holds while owning, lapses on loss) and the plant.
 */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** The percept trunk alive — the world the whether seat (M-O2.4) is measured in. */
const PERCEPT_FLAGS = { edsPerceivedDefence: true, edsPerceivedChoice: true } as const;
const matchOf = (seed: number, o2Look?: boolean, percept = false) => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: 240,
  ...(percept ? PERCEPT_FLAGS : {}),
  ...(o2Look === undefined ? {} : { o2Look }),
});
const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const brainSource = readFileSync(new URL('../src/ai/PlayerBrain.ts', import.meta.url), 'utf8');
const matchSource = readFileSync(new URL('../src/sim/Match.ts', import.meta.url), 'utf8');
const execSource = readFileSync(new URL('../src/ai/actionExecutor.ts', import.meta.url), 'utf8');
const seatSource = readFileSync(new URL('../src/ai/lookSeat.ts', import.meta.url), 'utf8');
const a4Source = readFileSync(new URL('../src/game/a4World.ts', import.meta.url), 'utf8');
const armSource = matchSource.slice(
  matchSource.indexOf('armO2Look(p: Player)'),
  matchSource.indexOf('private stepO2Look()'));

/**
 * The instrument the contract's M-O2.3 names (`forcedLook`, the `forcedHold`
 * idiom): force a look on each NEW carrier. Exam vectors are T1's business — this
 * is only enough forcing to prove the seam is reachable and behaves.
 */
const drive = (m: Match, ticks: number, force: boolean): {
  windows: number[]; staleOwnerTicks: number;
} => {
  let lastOwner = -1;
  let live = 0;
  const windows: number[] = [];
  let staleOwnerTicks = 0;
  for (let i = 0; i < ticks; i++) {
    const owner = m.ball.owner;
    if (force && owner && owner.gid !== lastOwner && owner.role !== 'GK') {
      lastOwner = owner.gid;
      m.forcedLook = { gid: owner.gid, untilTick: m.simTick + 40 };
    }
    const before = m.o2LookWindow;
    m.step(DT);
    const now = m.o2LookWindow;
    if (now !== null) {
      live += 1;
      const body = m.allPlayers.find((p) => p.gid === now.gid);
      // The seam never releases ownership itself; an EXISTING channel (a tackle
      // inside the window) can, and the next head-of-tick aborts the window.
      if (m.ball.owner !== body) staleOwnerTicks += 1;
    } else if (before !== null) {
      windows.push(live);
      live = 0;
    }
  }
  return { windows, staleOwnerTicks };
};

/** A stepped fixture: a settled carrier, every opponent parked far away. */
const carrierFixture = (seed: number): { m: Match; carrier: Player } => {
  const m = matchOf(seed, true, true);
  while (m.phase !== 'playing') m.step(DT);
  for (let i = 0; i < 60 && (m.phase !== 'playing' || m.ball.owner === null); i++) m.step(DT);
  const carrier = m.ball.owner ?? m.teams[0].players.filter((p) => p.role !== 'GK')[0];
  if (m.ball.owner !== carrier) {
    m.ball.owner = carrier;
    m.ball.pos = { x: carrier.pos.x, y: carrier.pos.y };
  }
  carrier.kickCooldown = 0;
  carrier.stunTimer = 0;
  carrier.firstTouchWindow = 0;
  return { m, carrier };
};

describe('O2 T0 — the LOOK seam is DORMANT', () => {
  it('G1 X-FP-PROD: the production fingerprint is unchanged', () => {
    const league = new League({ seed: 1337 });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + 2,
    });
    expect(createHash('sha256').update(JSON.stringify(out.league)).digest('hex'))
      .toBe(FINGERPRINT_BASELINE);
  }, 180_000);

  it('G2 FLAG-OFF IDENTITY: absent ≡ false ≡ plain, tick for tick', () => {
    for (const seed of [4242, 90210]) {
      const absent = matchOf(seed);
      const explicit = matchOf(seed, false);
      const plain = new Match({
        seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: 240,
      });
      for (let i = 0; i < 900; i++) {
        absent.step(DT); explicit.step(DT); plain.step(DT);
        expect(signature(explicit)).toBe(signature(absent));
        expect(signature(plain)).toBe(signature(absent));
      }
      expect(absent.o2Look).toBe(false);
      expect(absent.o2LookWindow).toBeNull();
      expect(absent.o2LookLedger).toEqual({
        looks: 0, scans: 0, completed: 0, abortedLoss: 0, abortedPhase: 0,
      });
    }
  });

  it('G3 BORN EQUIVALENT: armed with no instrument is identical to OFF (M-O2.3)', () => {
    for (const seed of [4242, 90210]) {
      const off = matchOf(seed, false, true);
      const armed = matchOf(seed, true, true);
      for (let i = 0; i < 900; i++) {
        off.step(DT); armed.step(DT);
        expect(signature(armed)).toBe(signature(off));
      }
      expect(armed.forcedLook).toBeNull();
      expect(armed.o2LookLedger.looks).toBe(0);
    }
  });

  it('G4 NON-VACUITY: forced, the seam is reached and the world diverges', () => {
    const off = matchOf(12311000, true, true);
    const on = matchOf(12311000, true, true);
    drive(off, 2400, false);
    const { windows, staleOwnerTicks } = drive(on, 2400, true);
    expect(on.o2LookLedger.looks).toBeGreaterThan(5);
    expect(on.o2LookLedger.scans).toBeGreaterThan(5);
    expect(windows.length).toBeGreaterThan(5);
    // G6: every tick the window was live with the ball elsewhere is a tick that
    // the very next head-of-tick aborted — one per abort, never a silent carry-on.
    expect(staleOwnerTicks).toBe(on.o2LookLedger.abortedLoss);
    expect(signature(on)).not.toBe(signature(off));
    // Every arm is accounted for: nothing vanishes.
    const l = on.o2LookLedger;
    expect(l.completed + l.abortedLoss + l.abortedPhase + (on.o2LookWindow ? 1 : 0))
      .toBe(l.looks);
  });

  it('G7 FROZEN INTERVAL: completed windows last exactly O2_LOOK_TICKS ticks', () => {
    const m = matchOf(12311001, true, true);
    const { windows } = drive(m, 2400, true);
    const completed = windows.filter((w) => w === O2_LOOK_TICKS).length;
    expect(completed).toBe(m.o2LookLedger.completed);
    expect(completed).toBeGreaterThan(3);
    for (const w of windows) expect(w).toBeLessThanOrEqual(O2_LOOK_TICKS);
    // …and the interval IS the traced C7 §LAW family, not a new number: it is
    // round(C7_W_CAP · 60) with C7_W_CAP = 0.18 s, which is also the [3,11]
    // clamp ceiling `c7WindupTicks` already enforces.
    expect(O2_LOOK_TICKS).toBe(Math.round(0.18 * 60));
    expect(O2_LOOK_TICKS).toBe(11);
    expect(matchSource).toContain('export const O2_LOOK_TICKS = Math.round(C7_W_CAP * 60)');
  });

  it('G5 NO RNG: the arm and the whole window draw zero rng', () => {
    const { m, carrier } = carrierFixture(777);
    m.forcedLook = { gid: carrier.gid, untilTick: m.simTick + 400 };
    const rngState = () => (m.rng as unknown as { s: number }).s;
    const before = rngState();
    m.armO2Look(carrier);
    expect(rngState()).toBe(before); // no draw at arm
    expect(m.o2LookWindow).not.toBeNull();
    // …and the arm body contains no price term and no rng.
    expect(armSource).not.toMatch(/this\.rng|gaussian|pressureAt|oneTouchMul|orientation\w*Mul/);
    expect(armSource).not.toContain('ball.owner =');
  });

  it('G6 the seam never writes ball ownership and never scores', () => {
    const seam = matchSource.slice(
      matchSource.indexOf('armO2Look(p: Player)'),
      matchSource.indexOf('  /**', matchSource.indexOf('private stepO2Look()')),
    );
    expect(seam).not.toContain('ball.owner =');
    expect(seam).not.toContain('score');
    // The executor's plant writes neither the ball nor a faceTarget (no chosen
    // look direction — the honesty limit the stage doc records).
    const plant = execSource.slice(
      execSource.indexOf('const lw = match.o2LookWindow;'),
      execSource.indexOf('// Stay onside (Phase 29)'),
    );
    expect(plant).toContain('speedF = 0.22');
    expect(plant).not.toContain('faceTarget');
    expect(plant).not.toMatch(/ball\.owner\s*=[^=]/); // read as a guard, never written
  });

  it('G8 THE REFRESH IS REAL: one scan moment per look tick, heading-gated', () => {
    // Looking: 11 recorded scan moments over the 11-tick window.
    const looking = carrierFixture(31337);
    looking.m.forcedLook = { gid: looking.carrier.gid, untilTick: looking.m.simTick + 400 };
    const scans0 = looking.m.o2LookLedger.scans;
    looking.m.armO2Look(looking.carrier);
    for (let i = 0; i < O2_LOOK_TICKS; i++) looking.m.step(DT);
    expect(looking.m.o2LookLedger.scans - scans0).toBe(O2_LOOK_TICKS);
    expect(looking.m.o2LookLedger.completed).toBe(1);
    // The look opens NO new channel: it goes through the SAME recorder the
    // ordinary scan clock uses, so the cone in `visibleDistance` is applied
    // unchanged when the frames are replayed. Structural proof, at the seam:
    expect(matchSource).toContain('this.recordObserverScanFrame(p.gid);');
    expect(matchSource.slice(
      matchSource.indexOf('armO2Look(p: Player)'),
      matchSource.indexOf('private stepO2Look()'),
    )).not.toMatch(/perceptionTruth\(\)\.players|truthBuffer|allPlayers\.filter/);
    // The refreshed reads reach the whether seat's own inputs: the looker's
    // perceived opponents carry observations made INSIDE the window.
    const snap = looking.m.perceivedSnapshot(looking.carrier);
    expect(snap).not.toBeNull();
    const opp = snap!.players.filter((o) => o.side !== looking.carrier.side);
    if (opp.length > 0) {
      expect(Math.min(...opp.map((o) => o.ageTicks))).toBeLessThanOrEqual(O2_LOOK_TICKS);
    }
  });

  it('the re-decide lock holds while owning and lapses on ball loss', () => {
    const { m, carrier } = carrierFixture(5150);
    m.forcedLook = { gid: carrier.gid, untilTick: m.simTick + 400 };
    m.armO2Look(carrier);
    expect(brainSource).toContain('match.o2Look && match.o2LookWindow !== null');
    // Lose the ball inside the window ⇒ the commitment lapses and the window aborts.
    m.ball.owner = null;
    m.step(DT);
    expect(m.o2LookWindow).toBeNull();
    expect(m.o2LookLedger.abortedLoss).toBe(1);
  });

  it('G9 SEAM SINGULARITY + FLAG HYGIENE: one arm site, never bundle-defaulted', () => {
    const callSites = (brainSource.match(/match\.armO2Look\(/g) ?? []).length
      + (execSource.match(/match\.armO2Look\(/g) ?? []).length
      + (seatSource.match(/armO2Look\(/g) ?? []).length;
    expect(callSites).toBe(1); // exactly one, in PlayerBrain
    expect((matchSource.match(/armO2Look\(/g) ?? []).length).toBe(1); // the definition
    // The flag is an EXPLICIT boolean: hard false, never EDS_BUNDLE_ARMED, never
    // env-armed (contract §3 FLAG HYGIENE + ruling #193.2 "never bundle-defaulted").
    expect(matchSource).toContain('this.o2Look = cfg.o2Look ?? false;');
    expect(matchSource).not.toMatch(/o2Look\s*=\s*cfg\.o2Look\s*\?\?\s*EDS_BUNDLE_ARMED/);
    expect(matchSource).not.toMatch(/envArmed\(['"]O2/);
    // …and it reaches no play-test world: not in A4_WORLD_FLAGS, not in any
    // a4MatchFlags version, not mentioned anywhere in the entry module.
    expect(a4Source).not.toContain('o2Look');
    expect(Object.keys(A4_WORLD_FLAGS)).not.toContain('o2Look');
    for (const v of [1, 2, 3] as const) {
      expect(Object.keys(a4MatchFlags(v))).not.toContain('o2Look');
    }
    // The instrument seam is null in every production path.
    expect(matchOf(4242, true).forcedLook).toBeNull();
    expect(seatSource).toContain('match.forcedLook');
  });

  it('the incumbent seats are untouched: the whether fork and the two wind-ups', () => {
    // The LOOK block sits immediately BEFORE the whether fork and adds nothing to it.
    expect(brainSource.indexOf('if (o2LookEligible('))
      .toBeLessThan(brainSource.indexOf('C5 T2 — THE WHETHER SEAT'));
    expect(readFileSync(new URL('../src/ai/whetherEye.ts', import.meta.url), 'utf8'))
      .not.toContain('o2Look');
    // The C7 and O1 locks are separate blocks, not widened.
    expect(brainSource).toContain('match.c7Windup && match.pendingKick !== null');
    expect(brainSource).toContain('match.o1PassWindup && match.pendingPassWindup !== null');
  });
});
