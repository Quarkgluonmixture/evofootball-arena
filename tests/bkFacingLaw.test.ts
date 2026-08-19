import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { BK_CONE_RAD, BK_CONE_TICKS, Match, bkFacingExtraTicks } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { TURN_RATE, type Player } from '../src/sim/Player';
import { kickMisalignment } from '../src/sim/mechanics';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';

/**
 * BK T0 — THE FACING LAW (docs/world-model/BK-T0-FACING-LAW.md; contract
 * BK-BODYBALL-CONTRACT.md §2 M-BK.1; ruling #306 items 3 + 6) — THE SEAM'S PERMANENT PIN
 * SUITE, in the house form (`pcLatencySeam.test.ts` / `pwWeightChooserSeat.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY — flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes;
 *     the ledger stays all-zero on a wind-up-armed walk with the door shut.
 *   • ⭐⭐ THE §LAW IS DERIVED, NOT TYPED — the cone is `round(C7_W_CAP·60)` ticks spent at
 *     `TURN_RATE`; BK-C0 §R4's turn-cost column reproduced at all 13 published angles.
 *   • ⭐⭐ THE ARM IS ACTUALLY EXTENDED, and the BODY TURNS — residual misalign at release
 *     collapses on the very fixture that stays reversed without the law.
 *   • ⭐ THE CHANNELS — the one-touch bypass is honoured (the kept H4 lineage); the
 *     beyond-cone strike is never banned (the backheel path is alive).
 *   • ⭐⭐ FLAG SEMANTICS — inert-law constructor refusal; partial composition legal AND
 *     byte-identical on the channel it does not cover.
 *   • ⭐ THE SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1).
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside BK-T0's OWN booked block (ruling #306 item 6: 12,502,000–999). */
const SEED_A = 12_502_800;
const SEED_B = 12_502_801;
const SEED_C = 12_502_802;

const W8 = 8 as const;
const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>);
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

interface Arm {
  /** arm the facing law */
  bk?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  bkExplicitFalse?: boolean;
  /** the world-8 stack the user plays, rather than a bare both-wind-ups match */
  armed?: boolean;
  /** override the wind-up channels (the partial-composition pins) */
  c7?: boolean;
  o1?: boolean;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.armed === true
    ? a4MatchFlags(W8)
    : { c7Windup: true, o1PassWindup: true };
  const cfg = {
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.duration === undefined ? {} : { duration: a.duration }),
    ...base,
    ...(a.c7 === undefined ? {} : { c7Windup: a.c7 }),
    ...(a.o1 === undefined ? {} : { o1PassWindup: a.o1 }),
    ...(a.bk === true ? { bkFacingLaw: true } : {}),
    ...(a.bkExplicitFalse === true ? { bkFacingLaw: false } : {}),
  };
  const m = new Match(cfg);
  if (a.armed === true) armA4World(m, null, W8, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0). */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
      for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
    }
  }
  const r = m.getResult();
  return createHash('sha256').update(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)),
    score: r.score, stats: r.stats, events: r.events.length, ticks,
  })).digest('hex');
};

const matchSource = readFileSync(new URL('../src/sim/Match.ts', import.meta.url), 'utf8');
const brainSource = readFileSync(new URL('../src/ai/PlayerBrain.ts', import.meta.url), 'utf8');

/**
 * Drive a match to a 'playing' tick and hand `passer` a clean owned ball with every opponent
 * parked in the far corner, the body facing `headingDeg` away from the strike direction. The
 * controlled fixture the window pins step through (the O1 `armedFixture` idiom).
 */
const fixture = (seed: number, a: Arm, headingDeg: number): {
  m: Match; passer: Player; mate: Player;
} => {
  const m = matchOf(seed, { ...a, duration: 240 });
  while (m.phase !== 'playing') m.step(DT);
  for (let i = 0; i < 30 && m.phase === 'playing'; i++) m.step(DT);
  const outfield = m.teams[0].players.filter((p) => p.role !== 'GK' && !p.sentOff);
  const passer = outfield[0];
  const mate = outfield[1];
  for (const o of m.teams[1].players) { o.pos = { x: 50, y: 30 }; o.vel = { x: 0, y: 0 }; }
  passer.kickCooldown = 0;
  passer.stunTimer = 0;
  passer.firstTouchWindow = 0;
  passer.vel = { x: 0, y: 0 };
  passer.pos = { x: 0, y: 0 };
  mate.pos = { x: 10, y: 0 }; // the strike direction is +x
  mate.vel = { x: 0, y: 0 };
  const th = (headingDeg * Math.PI) / 180;
  passer.heading = { x: Math.cos(th), y: Math.sin(th) };
  m.ball.owner = passer;
  m.ball.pos = { x: passer.pos.x + 0.85, y: passer.pos.y };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  return { m, passer, mate };
};

describe('BK T0 — the facing law is dormant (Road B)', () => {
  it('⭐ default-off: bkFacingLaw false and the ledger all-zero everywhere it can be read', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.bkFacingLaw).toBe(false);
    expect(bare.bkFacingLedger).toEqual({
      armsSeen: 0, armsExtended: 0, extraTicksTotal: 0, maxExtraTicks: 0,
    });
    const league = new League({ seed: 20260819 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.bkFacingLaw).toBe(false);
    // the shipped play-test world of record does NOT arm it (Road B: nothing ships)
    expect((a4MatchFlags(W8) as Record<string, unknown>).bkFacingLaw).toBeUndefined();
    const a4Source = readFileSync(new URL('../src/game/a4World.ts', import.meta.url), 'utf8');
    expect(a4Source).not.toContain('bkFacingLaw');
  });

  it('⭐⭐ ROAD B DORMANCY: flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes', () => {
    for (const armed of [false, true]) {
      for (const seed of [SEED_A, SEED_B]) {
        const absent = signatureOf(matchOf(seed, { armed }));
        const explicitFalse = signatureOf(matchOf(seed, { armed, bkExplicitFalse: true }));
        expect(explicitFalse).toBe(absent);
      }
    }
  });

  it('⭐ the ledger stays all-zero on a wind-up-ARMED walk with the facing door shut', () => {
    const m = matchOf(SEED_A, { armed: true, duration: 240 });
    m.runToCompletion();
    // liveness: the wind-up channels this seam extends really did fire in that walk
    expect(m.o1WindupLedger.arms).toBeGreaterThan(0);
    expect(m.bkFacingLedger).toEqual({
      armsSeen: 0, armsExtended: 0, extraTicksTotal: 0, maxExtraTicks: 0,
    });
  });

  it('⭐ arming it is a REAL change — the armed world is distinguishable from the shut one', () => {
    for (const armed of [false, true]) {
      const shut = signatureOf(matchOf(SEED_A, { armed }));
      const open = signatureOf(matchOf(SEED_A, { armed, bk: true }));
      expect(open).not.toBe(shut);
    }
  });
});

describe('BK T0 §LAW — the cone and the added ticks are DERIVED, never typed (#200)', () => {
  it('⭐⭐ THE CONE: round(C7_W_CAP·60) ticks spent at TURN_RATE = 68.2775° / misalign 0.31494', () => {
    // derived from the SHIPPED C7 §LAW constant, extracted from its NAMED site (canon:
    // anchored extraction, home BK-C0 §CORR item 1) — not a literal in this test
    const c7Cap = Number(/const C7_W_CAP = ([0-9.]+);/.exec(matchSource)![1]);
    expect(c7Cap).toBe(0.18);
    expect(BK_CONE_TICKS).toBe(Math.round(c7Cap * 60));
    expect(BK_CONE_TICKS).toBe(11);
    // and the [3,11] clamp the shipped wind-up enforces ENDS at the same tick
    expect(/return ticks < 3 \? 3 : ticks > 11 \? 11 : ticks;/.test(matchSource)).toBe(true);
    expect(BK_CONE_RAD).toBeCloseTo(BK_CONE_TICKS * DT * TURN_RATE, 15);
    expect((BK_CONE_RAD * 180) / Math.PI).toBeCloseTo(68.2774705864231, 10);
    // ⭐ the engine's OWN misalign measure at the cone edge = BK-C0 §R4's published 0.3149
    expect((1 - Math.cos(BK_CONE_RAD)) / 2).toBeCloseTo(0.31494396, 8);
  });

  it('⭐⭐ THE FORMULA: BK-C0 §R4\'s turnTicksWhole column, reproduced at all 13 angles', () => {
    // BK-C0 §R4's own arithmetic: turnTicks = ceil(θ / (TURN_RATE · DT)); added = excess
    // over the cone. Every published row of the turn-cost table is a pin here.
    const rows: [number, number, number][] = [ // [θ°, turnTicksWhole, addedTicks]
      [0, 0, 0], [15, 3, 0], [30, 5, 0], [45, 8, 0], [60, 10, 0], [68, 11, 0],
      [75, 13, 2], [90, 15, 4], [105, 17, 6], [120, 20, 9], [135, 22, 11],
      [150, 25, 14], [180, 29, 18],
    ];
    for (const [deg, turnTicks, added] of rows) {
      const th = (deg * Math.PI) / 180;
      expect(Math.ceil(th / (TURN_RATE * DT))).toBe(turnTicks);
      expect(bkFacingExtraTicks({ x: 1, y: 0 }, Math.cos(th), Math.sin(th), 0, 0)).toBe(added);
    }
    // ⭐ THE FULL REVERSAL OF RECORD: 29 ticks (π/6.5 = 0.483322 s), 2.64× the 11-tick cap
    expect(Math.ceil(Math.PI / (TURN_RATE * DT))).toBe(29);
    expect(Math.PI / TURN_RATE).toBeCloseTo(0.483322, 6);
    expect(29 / BK_CONE_TICKS).toBeCloseTo(2.636, 3); // BK-C0 §CORR item 3's 2.64×
    // and the structural range needs no clamp: [0, 29 − 11]
    expect(bkFacingExtraTicks({ x: 1, y: 0 }, -1, 0, 0, 0)).toBe(29 - BK_CONE_TICKS);
  });

  it('⭐ the cone EDGE is where the charge starts, and the sign is symmetric', () => {
    const at = (deg: number, sign = 1): number => {
      const th = (sign * deg * Math.PI) / 180;
      return bkFacingExtraTicks({ x: 1, y: 0 }, Math.cos(th), Math.sin(th), 0, 0);
    };
    expect(at(68.2)).toBe(0); // inside: the shipped budget absorbs it
    expect(at(68.4)).toBe(1); // outside: the timeline pays the excess
    for (const deg of [30, 75, 120, 179]) expect(at(deg, -1)).toBe(at(deg, +1));
    // monotone non-decreasing in θ (a wider turn never costs less)
    let prev = -1;
    for (let deg = 0; deg <= 180; deg += 1) {
      const v = at(deg);
      expect(v).toBeGreaterThanOrEqual(prev);
      prev = v;
    }
  });

  it('⭐ a degenerate aim (the strike point ON the body) names no direction and charges 0', () => {
    expect(bkFacingExtraTicks({ x: 1, y: 0 }, 0, 0, 0, 0)).toBe(0);
    expect(bkFacingExtraTicks({ x: 1, y: 0 }, 5, 5, 5, 5)).toBe(0);
  });

  it('⭐ NO NEW PRICE, NO RNG: the law body touches neither rng nor a price multiplier', () => {
    const law = matchSource.slice(
      matchSource.indexOf('export const bkFacingExtraTicks'),
      matchSource.indexOf("/* ------------- O2 T0 THE LOOK"),
    );
    expect(law.length).toBeGreaterThan(200);
    for (const forbidden of ['rng', 'orientationPowerMul', 'orientationNoiseMul', 'Math.random']) {
      expect(law).not.toContain(forbidden);
    }
    const note = matchSource.slice(
      matchSource.indexOf('private bkNoteFacing('),
      matchSource.lastIndexOf('/* ------------- C7 T1 the shot wind-up'),
    );
    expect(note.length).toBeGreaterThan(100);
    for (const forbidden of ['rng', 'Math.random']) expect(note).not.toContain(forbidden);
  });
});

describe('BK T0 §SEAM — the arm is extended and the body actually turns', () => {
  it('⭐⭐ THE PASS ARM: readyTick = stepCount + W + addedTicks, and W itself is unchanged', () => {
    const shut = fixture(SEED_A, {}, 180);
    shut.m.armPendingPass(shut.passer, shut.mate);
    const wOnly = shut.m.pendingPassWindup!.readyTick - shut.m.simTick;

    const open = fixture(SEED_A, { bk: true }, 180);
    open.m.armPendingPass(open.passer, open.mate);
    const wPlus = open.m.pendingPassWindup!.readyTick - open.m.simTick;

    const added = bkFacingExtraTicks(
      open.passer.heading, open.mate.pos.x, open.mate.pos.y, open.passer.pos.x, open.passer.pos.y,
    );
    expect(added).toBe(18); // the full reversal: 29 − 11
    expect(wPlus).toBe(wOnly + added);
    expect(wOnly).toBeGreaterThanOrEqual(3); // the shipped [3,11] clamp, untouched
    expect(wOnly).toBeLessThanOrEqual(11);
    expect(open.m.bkFacingLedger).toEqual({
      armsSeen: 1, armsExtended: 1, extraTicksTotal: 18, maxExtraTicks: 18,
    });
  });

  it('⭐⭐ THE SHOT ARM: the same law, the same added ticks, on armPendingKick', () => {
    const shut = fixture(SEED_B, {}, 180);
    const aim = { x: 20, y: 0 };
    shut.m.armPendingKick(shut.passer, aim);
    const wOnly = shut.m.pendingKick!.readyTick - shut.m.simTick;
    const open = fixture(SEED_B, { bk: true }, 180);
    open.m.armPendingKick(open.passer, aim);
    const wPlus = open.m.pendingKick!.readyTick - open.m.simTick;
    expect(wPlus - wOnly).toBe(18);
    expect(open.m.bkFacingLedger.armsSeen).toBe(1);
    expect(open.m.bkFacingLedger.maxExtraTicks).toBe(18);
  });

  it('⭐ INSIDE THE CONE THE ARM IS UNCHANGED — the law charges only what it must', () => {
    for (const deg of [0, 30, 60]) {
      const shut = fixture(SEED_A, {}, deg);
      shut.m.armPendingPass(shut.passer, shut.mate);
      const open = fixture(SEED_A, { bk: true }, deg);
      open.m.armPendingPass(open.passer, open.mate);
      expect(open.m.pendingPassWindup!.readyTick).toBe(shut.m.pendingPassWindup!.readyTick);
      expect(open.m.bkFacingLedger.armsExtended).toBe(0);
      expect(open.m.bkFacingLedger.armsSeen).toBe(1); // seen, and charged nothing
    }
  });

  it('⭐⭐ THE BODY TURNS: residual misalign AT RELEASE lands INSIDE the cone', () => {
    // ⭐ WHAT THE LAW PROMISES (M-BK.1, verbatim): "the required rotation to bring the target
    // into the STRIKE CONE". It does NOT promise perfect alignment — the base W is spent
    // turning too, so the residual is at worst the cone edge and usually far better, and the
    // EXISTING orientation prices then price exactly that residual. Proof that the bound is
    // structural: extra = ceil(θ/(TURN_RATE·DT)) − 11 ≥ θ/(TURN_RATE·DT) − 11, i.e. the added
    // ticks ALONE cover the turn down to the cone edge; every base tick is surplus.
    const coneMisalign = (1 - Math.cos(BK_CONE_RAD)) / 2;
    // the SAME reversed fixture, stepped to its own readyTick, both ways
    const residual = (bk: boolean, deg = 180, seed = SEED_C): number => {
      const f = fixture(seed, bk ? { bk: true } : {}, deg);
      f.m.armPendingPass(f.passer, f.mate);
      const window = f.m.pendingPassWindup!.readyTick - f.m.simTick;
      const aimAt = { x: f.m.pendingPassWindup!.aim.x, y: f.m.pendingPassWindup!.aim.y };
      // the heading integrator is the SHIPPED one; `faceTarget` was set by the arm, and the
      // window is exactly the time the seam bought — turn it, tick by shipped tick
      expect(f.passer.faceTarget).not.toBeNull();
      for (let i = 0; i < window; i++) f.passer.physicsStep(DT);
      const dx = aimAt.x - f.passer.pos.x;
      const dy = aimAt.y - f.passer.pos.y;
      const dl = Math.sqrt(dx * dx + dy * dy);
      return kickMisalignment(f.passer, { x: dx / dl, y: dy / dl });
    };
    const without = residual(false);
    const with_ = residual(true);
    // WITHOUT the law the shipped window runs out mid-turn: the body strikes OUTSIDE the cone
    expect(without).toBeGreaterThan(coneMisalign);
    // WITH it the release is INSIDE the cone — the law's whole claim, and a real fall
    expect(with_).toBeLessThanOrEqual(coneMisalign);
    expect(with_).toBeLessThan(without);
    // ⭐ and the bound holds at EVERY beyond-cone angle, on three seeds' bodies
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      for (const deg of [75, 90, 120, 150, 180]) {
        expect(residual(true, deg, seed)).toBeLessThanOrEqual(coneMisalign);
      }
    }
  });
});

describe('BK T0 §CHANNELS — the bypass is honoured and the strike is never banned', () => {
  it('⭐⭐ THE ONE-TOUCH BYPASS (the kept H4 lineage): the arm gate is untouched', () => {
    // the law lives INSIDE the arm methods, so PlayerBrain's own bypass gate — the single
    // arm site, `firstTouchWindow > 0` releasing synchronously — needs no change and got none
    expect(brainSource).toContain(
      'if (match.o1PassWindup && !mustKick && p.firstTouchWindow <= 0) {',
    );
    expect((brainSource.match(/match\.armPendingPass\(/g) ?? []).length).toBe(1);
    expect((brainSource.match(/match\.armPendingKick\(/g) ?? []).length).toBe(1);
    // ...and no facing needle anywhere in the brain: the law adds NO chooser term
    expect(brainSource).not.toContain('bkFacingLaw');
    expect(brainSource).not.toContain('bkFacingExtraTicks');
  });

  it('⭐ a body inside its one-touch window pays NO facing time (it never arms)', () => {
    const f = fixture(SEED_A, { bk: true, armed: false }, 180);
    f.passer.firstTouchWindow = 0.2;
    // the brain's own gate is what routes; nothing in the law can charge a body that
    // never reaches an arm site, and the ledger proves it
    expect(f.m.bkFacingLedger.armsSeen).toBe(0);
    expect(f.m.bkFacingLedger.extraTicksTotal).toBe(0);
  });

  it('⭐ THE BACKHEEL PATH IS ALIVE — a fully reversed strike still RELEASES, only later', () => {
    const f = fixture(SEED_C, { bk: true }, 180);
    f.m.armPendingPass(f.passer, f.mate);
    const ready = f.m.pendingPassWindup!.readyTick;
    expect(ready - f.m.simTick).toBeGreaterThan(11); // it paid real time
    let released = false;
    for (let i = 0; i < 200 && !released; i++) {
      f.m.step(DT);
      if (f.m.pendingPassWindup === null) released = true;
    }
    expect(released).toBe(true); // a TIME cost, never a ban
    expect(f.m.bkFacingLedger.armsExtended).toBeGreaterThanOrEqual(1);
  });
});

describe('BK T0 §FLAG SEMANTICS — the inert-law door is shut and loud', () => {
  it('⭐⭐ REFUSAL: bkFacingLaw with NEITHER wind-up channel armed refuses to build', () => {
    expect(() => new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2), bkFacingLaw: true,
    })).toThrow(/INERT WITHOUT A WIND-UP CHANNEL/);
    expect(() => new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      bkFacingLaw: true, c7Windup: false, o1PassWindup: false,
    })).toThrow(/INERT WITHOUT A WIND-UP CHANNEL/);
  });

  it('⭐ PARTIAL COMPOSITION IS LEGAL — either channel alone builds and arms', () => {
    for (const [c7, o1] of [[true, false], [false, true], [true, true]] as const) {
      const m = new Match({
        seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
        bkFacingLaw: true, c7Windup: c7, o1PassWindup: o1,
      });
      expect(m.bkFacingLaw).toBe(true);
    }
  });

  it('⭐⭐ PARTIAL COMPOSITION IS HONEST — the uncovered channel is byte-identical', () => {
    // shots-only: the PASS family is untouched, so a pass arm charges nothing
    const f = fixture(SEED_B, { bk: true, c7: true, o1: false }, 180);
    expect(f.m.o1PassWindup).toBe(false);
    // the shot channel, by contrast, DOES charge in the very same world
    f.m.armPendingKick(f.passer, { x: 20, y: 0 });
    expect(f.m.bkFacingLedger.armsExtended).toBe(1);
    // passes-only: the SHOT family is untouched
    const g = fixture(SEED_B, { bk: true, c7: false, o1: true }, 180);
    expect(g.m.c7Windup).toBe(false);
    g.m.armPendingPass(g.passer, g.mate);
    expect(g.m.bkFacingLedger.armsExtended).toBe(1);
  });
});

describe('BK T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  const src = (rel: string): string => readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
  const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;

  it('⭐⭐ THE TWELVE RELEASE SITES: two IN SCOPE (the wind-up channels), ten NAMED OUT', () => {
    const brain = src('ai/PlayerBrain.ts');
    // IN SCOPE — the two wind-up channels the facing law extends
    expect(count(brain, /match\.armPendingKick\(/g)).toBe(1); // Shoot, open play/one-touch
    expect(count(brain, /match\.armPendingPass\(/g)).toBe(1); // Pass, shortPass, window closed
    // OUT OF SCOPE for T0 — every other release site, by name and by count.
    // Each strikes SYNCHRONOUSLY at its EXISTING orientation price; T0 states this
    // boundary rather than half-covering it silently.
    expect(count(brain, /match\.performShot\(/g)).toBe(2); // penalty (:144) + non-c7 fallback
    expect(count(brain, /match\.performPass\(/g)).toBe(3); // kickoff-back + PTP lead + plain
    expect(count(brain, /match\.performCutback\(/g)).toBe(1);
    expect(count(brain, /match\.performLoftedPass\(/g)).toBe(1); // incl. the GK punt
    expect(count(brain, /match\.performCross\(/g)).toBe(1);
    expect(count(brain, /match\.performKeeperThrow\(/g)).toBe(1);
    expect(count(brain, /match\.performThroughBall\(/g)).toBe(1);
    expect(count(brain, /match\.performFreeKick\(/g)).toBe(1);
    expect(count(brain, /match\.performClear\(/g)).toBe(1);
    // the header family is not a brain release at all — it lives in mechanics
    expect(count(src('sim/mechanics.ts'), /\n  headBall\(match, /g)).toBe(1);
  });

  it('⭐ THE LAW HAS EXACTLY TWO CONSUMPTION SITES, both inside the arm methods', () => {
    expect(count(matchSource, /this\.bkNoteFacing\(/g)).toBe(2);
    expect(count(matchSource, /bkFacingExtraTicks\(/g)).toBe(1); // the ONE call, in bkNoteFacing
    expect(count(matchSource, /private bkNoteFacing\(/g)).toBe(1);
    // and the two readyTick expressions are the ONLY places the added ticks land
    expect(count(matchSource, /this\.stepCount \+ wTicks \+ bkTicks/g)).toBe(2);
    // nothing outside Match.ts consumes the law
    for (const rel of ['ai/PlayerBrain.ts', 'sim/mechanics.ts', 'sim/Player.ts', 'game/a4World.ts']) {
      expect(src(rel)).not.toContain('bkFacing');
    }
  });
});

describe('BK T0 — the production world is untouched', () => {
  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    // the walk itself is scripts/fingerprint.ts (the stage doc records the run); this pin
    // keeps the value of record inside the permanent suite so a drift has a named home
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    expect(new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) }).bkFacingLaw).toBe(false);
  });
});
