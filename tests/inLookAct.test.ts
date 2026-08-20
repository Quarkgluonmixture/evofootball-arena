import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match, BK_CONE_TICKS, bkFacingExtraTicks } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { TURN_RATE } from '../src/sim/Player';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import type { Player } from '../src/sim/Player';
import {
  IN_LOOK_AGE_CAP_TICKS, chooseInLook, createInLookLedger, inLookGate, inLookRefreshField,
  inLookSituation, inLookTurnTicks,
} from '../src/ai/inLookAct';
import {
  coldStart, inFieldDotMin, type InSeenBody, type InSnapshotField,
} from '../src/ai/inSnapshotView';

/**
 * IN T1 — THE LOOK (docs/world-model/IN-T1-THE-LOOK.md; contract IN-SNAPSHOT-CONTRACT.md
 * §2 M-IN.2/M-IN.3/M-IN.4; ruling #327 item 5) — THE SEAM'S PERMANENT PIN SUITE, in the
 * house form (`inSnapshotLaw.test.ts` / `dfSurface.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY — flag ABSENT ≡ flag EXPLICITLY FALSE, byte for byte, BOTH world
 *     shapes × 2 seeds (pooled digest); windows and ledger stay empty when the door is shut.
 *   • ⭐⭐ THE LOOK LAW on a CONSTRUCTED FIXTURE — a look refreshes EXACTLY the looked field
 *     (inside written, outside untouched to the byte) and costs EXACTLY the derived time.
 *   • ⭐⭐ THE COST LAW — `ceil(theta/(TURN_RATE·DT))` taken by ANCHORED EXTRACTION from the
 *     NAMED line in `src/sim/Match.ts`, and cross-checked LIVE against the shipped
 *     `bkFacingExtraTicks` itself, so the look's price and the BK facing law's price can
 *     never drift apart. The AGE CAP is the same algebra's full reversal.
 *   • ⭐⭐ NO LOOK ⇒ NO CHANGE — an empty book, or a picture entirely in field, elects
 *     nothing, opens no window and charges nothing.
 *   • ⭐ THE ELECTION IS PRICED — the zero threshold bites, a body already in field is not a
 *     candidate, a body never seen cannot be aimed at, and ties resolve deterministically.
 *   • ⭐⭐ PHYSICS STAYS TRUTH (M-IN.1) — the module writes no heading, no `faceTarget`, no
 *     action, no velocity, draws no rng, and no executor/physics/render file names it.
 *   • ⭐⭐ NO SERIALIZATION — windows and ledger are per-match transient (the DF-T0 precedent).
 *   • ⭐⭐ COMPOSITION — the 16-cell power set {inLookAct} × {inSnapshotLaw} ×
 *     {dfAssignPersist} × {dfSurface} on the world-9 stack; lifecycle clean; no refusal.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon: PC-C0 §CORR 1).
 *   • ⭐ THE §CORR 3 COMMENT FIX — the `whetherEye.ts:147` clause is present in
 *     `PlayerBrain.ts`'s IN-T0 §SEAM comment, and the line it names is really there.
 *   • ⭐ ANY BODY MAY LOOK — carrier, off-ball outfield and keeper all look on a real walk.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside IN-T1's OWN booked block (ruling #327 item 5: 12,513,000–999). */
const SEED_A = 12_513_800;
const SEED_B = 12_513_801;
const SEED_C = 12_513_802;

const W8 = 8 as const;
const W9 = 9 as const;
const F2 = 'F2squareAcross' satisfies InSnapshotField;
const F4 = 'F4contactHalfPrice' satisfies InSnapshotField;

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
  /** arm THIS slice's door */
  look?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  lookExplicitFalse?: boolean;
  /** arm IN-T0's law (the look's CONSUMER — armed on both battery arms) */
  in?: boolean;
  field?: InSnapshotField;
  /** the DF doors (the composition stack) */
  df?: boolean;
  dfs?: boolean;
  world?: 8 | 9;
  duration?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const base = a.world === undefined
    ? { c7Windup: true, o1PassWindup: true }
    : a4MatchFlags(a.world);
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.duration === undefined ? {} : { duration: a.duration }),
    ...base,
    ...(a.look === true ? { inLookAct: true } : {}),
    ...(a.lookExplicitFalse === true ? { inLookAct: false } : {}),
    ...(a.in === true ? { inSnapshotLaw: true } : {}),
    ...(a.field === undefined ? {} : { inSnapshotField: a.field }),
    ...(a.df === true ? { dfAssignPersist: true } : {}),
    ...(a.dfs === true ? { dfSurface: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0/T1, DF-T0, IN-T0). */
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

const src = (rel: string): string =>
  readFileSync(new URL(`../src/${rel}`, import.meta.url), 'utf8');
const brainSource = src('ai/PlayerBrain.ts');
const matchSource = src('sim/Match.ts');
const lookSource = src('ai/inLookAct.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;

/**
 * ⭐ THE CODE HALF OF `inLookAct.ts` — prose may NAME what code may not touch (the IN-T0
 * §P5 idiom), so the forbidden-needle pins below run on CODE LINES ONLY.
 *
 * ⚠ CANON "text-census corpus integrity" (home: IN-C0 §CORR item 2, ruling #317): a
 * stripper is itself an instrument, and the #317 failure was a `/*` inside a line comment
 * opening a phantom block. This stripper cannot have that bug because it is LINE-CLASSED,
 * and the classification is PINNED below: in this file every line is either a whole-line
 * comment or carries no block-comment delimiter at all. The non-vacuity of the stripped
 * corpus is asserted too.
 */
const codeLinesOf = (source: string): string => {
  const lines = source.split('\n');
  for (const l of lines) {
    const t = l.trim();
    const isCommentLine = t.startsWith('*') || t.startsWith('/*') || t.startsWith('//');
    if (!isCommentLine) expect(l.includes('/*') || l.includes('*/')).toBe(false);
  }
  return lines.filter((l) => {
    const t = l.trim();
    return !(t.startsWith('*') || t.startsWith('/*') || t.startsWith('//'));
  }).join('\n');
};
const lookCode = codeLinesOf(lookSource);

/* ========================================================================== */
/* THE CONSTRUCTED LOOK FIXTURE                                               */
/* ========================================================================== */
/**
 * A hand-placed reader with a KNOWN heading and hand-placed bodies at KNOWN bearings,
 * driven through the look's OWN pure functions (never through physics). This is the
 * smallest fixture that can prove "a look refreshes exactly the looked field, and costs
 * exactly the derived time" — and it reads the law's OUTPUT (the book) rather than a proxy.
 */
interface Fix {
  reader: Player;
  bodies: Player[];
  book: Map<number, InSeenBody>;
  place(i: number, x: number, y: number, vx?: number, vy?: number): Player;
}
const fix = (seed: number, others: number): Fix => {
  const m = matchOf(seed);
  while (m.phase !== 'playing') m.step(DT);
  const reader = m.teams[0].players[0];
  reader.pos = { x: 0, y: 0 };
  reader.vel = { x: 0, y: 0 };
  reader.heading = { x: 1, y: 0 }; // facing +x
  const pool = [...m.teams[1].players, ...m.teams[0].players.slice(1)];
  const bodies = [reader, ...pool.slice(0, others)];
  return {
    reader,
    bodies,
    book: new Map<number, InSeenBody>(),
    place: (i, x, y, vx = 0, vy = 0): Player => {
      const b = bodies[i];
      b.pos = { x, y };
      b.vel = { x: vx, y: vy };
      b.sentOff = false;
      return b;
    },
  };
};
/** a unit vector at `deg` from +x */
const dir = (deg: number): { x: number; y: number } => ({
  x: Math.cos((deg * Math.PI) / 180), y: Math.sin((deg * Math.PI) / 180),
});

describe('IN T1 — the look is dormant (Road B)', () => {
  it('⭐ default-off: inLookAct false everywhere, and absent from every shipped world', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.inLookAct).toBe(false);
    const league = new League({ seed: 20260820 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.inLookAct).toBe(false);
    for (const w of [W8, W9] as const) {
      expect((a4MatchFlags(w) as Record<string, unknown>).inLookAct).toBeUndefined();
    }
    // …and the entry layer does not NAME it at all
    expect(src('game/a4World.ts')).not.toContain('inLook');
  });

  it('⭐⭐ ROAD B DORMANCY: flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes', () => {
    const digest = createHash('sha256');
    for (const world of [W8, W9] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        const absent = signatureOf(matchOf(seed, { world }));
        const explicitFalse = signatureOf(matchOf(seed, { world, lookExplicitFalse: true }));
        expect(explicitFalse).toBe(absent);
        digest.update(absent);
      }
    }
    expect(digest.digest('hex')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('⭐⭐ THE WINDOWS AND THE LEDGER STAY EMPTY when the door is shut — pure bookkeeping', () => {
    // shut alongside IN-T0 ARMED: the look's state must stay empty even though the store fills
    const m = matchOf(SEED_A, { world: W9, in: true, duration: 60 });
    while (!m.finished) m.step(DT);
    expect(m.inLookWindows.size).toBe(0);
    expect(m.inSnapshotStore.size).toBeGreaterThan(0); // IN-T0 IS running — non-vacuous
    const led = m.inLookLedger;
    for (const [k, v] of Object.entries(led)) {
      if (k === 'looksBySituation' || k === 'decisionsBySituation') {
        expect(v).toEqual([0, 0, 0]);
      } else if (k === 'looksByGid') {
        expect((v as Map<number, number>).size).toBe(0);
      } else {
        expect(v).toBe(0);
      }
    }
  });

  it('⭐ arming it is a REAL change — both world shapes, with and without IN-T0', () => {
    for (const world of [W8, W9] as const) {
      for (const inLaw of [false, true]) {
        const shut = signatureOf(matchOf(SEED_A, { world, in: inLaw }));
        expect(signatureOf(matchOf(SEED_A, { world, in: inLaw, look: true }))).not.toBe(shut);
      }
    }
  });
});

describe('IN T1 §THE COST LAW — anchored to the shipped turn form, never re-typed', () => {
  it('⭐⭐ ANCHORED EXTRACTION: the turn form comes from ONE named line in Match.ts', () => {
    // canon VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
    // anchored match + line receipt — never first-occurrence" (home: BK-C0 §CORR item 1).
    const anchor = '  const turnTicks = Math.ceil(theta / (TURN_RATE * DT));';
    expect(linesOf(matchSource, anchor)).toBe(1);
    // …and it is the BK FACING LAW's own line: the enclosing function is `bkFacingExtraTicks`
    const at = matchSource.indexOf(anchor);
    expect(matchSource.lastIndexOf('export const bkFacingExtraTicks', at)).toBeGreaterThan(-1);
  });

  it('⭐⭐ THE LIVE CROSS-CHECK: the look\'s price IS the BK facing law\'s own turn count', () => {
    // `bkFacingExtraTicks` returns max(0, turnTicks − BK_CONE_TICKS) for the same theta, so
    // outside the cone the two must agree EXACTLY. A drift in either is a red test.
    const from = { x: 0, y: 0 };
    let checked = 0;
    for (let deg = 0; deg <= 180; deg += 5) {
      const d = dir(deg);
      const theta = (deg * Math.PI) / 180;
      const ours = inLookTurnTicks(theta);
      const shipped = bkFacingExtraTicks({ x: 1, y: 0 }, d.x * 10, d.y * 10, from.x, from.y);
      expect(ours).toBe(Math.ceil(theta / (TURN_RATE * DT)));
      if (shipped > 0) {
        expect(ours).toBe(shipped + BK_CONE_TICKS);
        checked += 1;
      }
    }
    expect(checked).toBeGreaterThan(10); // non-vacuous
  });

  it('⭐⭐ THE AGE CAP IS THE FULL REVERSAL — same algebra, 29 ticks, no chosen number', () => {
    expect(IN_LOOK_AGE_CAP_TICKS).toBe(inLookTurnTicks(Math.PI));
    expect(IN_LOOK_AGE_CAP_TICKS).toBe(Math.ceil(Math.PI / (TURN_RATE * DT)));
    expect(IN_LOOK_AGE_CAP_TICKS).toBe(29); // BK-T0 §LAW's own "full reversal of record"
    // the widest turn the shipped form can charge for is exactly the cap
    expect(bkFacingExtraTicks({ x: 1, y: 0 }, -10, 0, 0, 0) + BK_CONE_TICKS)
      .toBe(IN_LOOK_AGE_CAP_TICKS);
    // …and the module contains no other numeric magnitude than the guards and the algebra
    expect(count(lookSource, /Math\.PI/g)).toBe(1);
  });
});

describe('IN T1 §THE LOOK LAW — exactly the looked field, at exactly the derived price', () => {
  it('⭐⭐ A LOOK REFRESHES EXACTLY THE LOOKED FIELD, and nothing outside it', () => {
    const f = fix(SEED_A, 4);
    const dotMin = inFieldDotMin(F2);
    // bodies at +30° (in the AIM field), +100° (in it), −100° (out), −30° (out)
    const b1 = f.place(1, ...([12 * Math.cos(Math.PI / 6), 12 * Math.sin(Math.PI / 6)] as [number, number]));
    const b2 = f.place(2, 12 * Math.cos((100 * Math.PI) / 180), 12 * Math.sin((100 * Math.PI) / 180));
    const b3 = f.place(3, 12 * Math.cos((-100 * Math.PI) / 180), 12 * Math.sin((-100 * Math.PI) / 180));
    const b4 = f.place(4, 12 * Math.cos(-Math.PI / 6), 12 * Math.sin(-Math.PI / 6));
    // every body is remembered at the origin, aged 50 ticks
    for (const b of [b1, b2, b3, b4]) f.book.set(b.gid, { x: 0, y: 1, vx: 0, vy: 0, tick: 0 });
    // LOOK along +65° — its 90° field covers −25°..+155°: b1 (+30) and b2 (+100) only
    const aim = dir(65);
    const r = inLookRefreshField(f.reader, f.bodies, aim.x, aim.y, f.book, 50, dotMin);
    expect(r.written).toBe(2);
    expect(r.erased).toBe(100); // 2 bodies × 50 ticks
    expect(f.book.get(b1.gid)).toEqual({ x: b1.pos.x, y: b1.pos.y, vx: 0, vy: 0, tick: 50 });
    expect(f.book.get(b2.gid)!.tick).toBe(50);
    // ⭐ AND THE ONES OUTSIDE ARE UNTOUCHED, to the byte
    expect(f.book.get(b3.gid)).toEqual({ x: 0, y: 1, vx: 0, vy: 0, tick: 0 });
    expect(f.book.get(b4.gid)).toEqual({ x: 0, y: 1, vx: 0, vy: 0, tick: 0 });
  });

  it('⭐⭐ THE PRICE IS THE TURN TO THE AIM — exactly, at both fields', () => {
    for (const field of [F2, F4] as const) {
      const dotMin = inFieldDotMin(field);
      const f = fix(SEED_B, 1);
      const b = f.place(1, 10 * Math.cos(Math.PI), 10 * Math.sin(Math.PI)); // dead behind
      f.book.set(b.gid, { x: b.pos.x, y: b.pos.y, vx: 0, vy: 0, tick: 0 });
      const e = chooseInLook(f.reader, f.bodies, f.book, 100, dotMin);
      expect(e).not.toBeNull();
      expect(e!.aimGid).toBe(b.gid);
      // he is remembered dead behind ⇒ the turn is π ⇒ the FULL REVERSAL
      expect(e!.turnTicks).toBe(IN_LOOK_AGE_CAP_TICKS);
      // gain = his capped age (29), loss = 0 (nothing in front is remembered)
      expect(e!.gain).toBe(IN_LOOK_AGE_CAP_TICKS);
      expect(e!.loss).toBe(0);
    }
  });

  it('⭐ THE AIM IS TAKEN FROM MEMORY, NOT FROM TRUTH — he looks where he BELIEVES', () => {
    const f = fix(SEED_C, 1);
    const b = f.place(1, 30, 0); // TRUTH: dead ahead
    f.book.set(b.gid, { x: -10, y: 0, vx: 0, vy: 0, tick: 0 }); // MEMORY: dead behind
    const e = chooseInLook(f.reader, f.bodies, f.book, 100, inFieldDotMin(F2));
    expect(e).not.toBeNull();
    // the aim points at the REMEMBERED position (−x), never at the true one (+x)
    expect(e!.ux).toBeCloseTo(-1, 12);
    expect(e!.turnTicks).toBe(IN_LOOK_AGE_CAP_TICKS);
  });
});

describe('IN T1 §NO LOOK ⇒ NO CHANGE, and the zero threshold bites', () => {
  it('⭐⭐ AN EMPTY BOOK ELECTS NOTHING — he cannot aim at a man he has never seen', () => {
    const f = fix(SEED_A, 3);
    f.place(1, -10, 0);
    f.place(2, -10, 5);
    f.place(3, 10, 0);
    expect(chooseInLook(f.reader, f.bodies, f.book, 500, inFieldDotMin(F2))).toBeNull();
  });

  it('⭐⭐ A PICTURE ENTIRELY IN FIELD ELECTS NOTHING — a look at what you see is not a look', () => {
    const f = fix(SEED_B, 2);
    const b1 = f.place(1, 10, 3);
    const b2 = f.place(2, 14, -4);
    for (const b of [b1, b2]) f.book.set(b.gid, { x: b.pos.x, y: b.pos.y, vx: 0, vy: 0, tick: 0 });
    // aged by a whole match: still no candidate, because every remembered body is IN FIELD
    expect(chooseInLook(f.reader, f.bodies, f.book, 14_400, inFieldDotMin(F2))).toBeNull();
  });

  it('⭐⭐ THE ZERO THRESHOLD BITES: one stale man behind vs the men he would stop seeing', () => {
    const dotMin = inFieldDotMin(F2);
    const f = fix(SEED_C, 3);
    const back = f.place(1, -10, 0);          // dead behind: turn = 29 ticks
    const front1 = f.place(2, 10, 2);
    const front2 = f.place(3, 10, -2);
    f.book.set(back.gid, { x: back.pos.x, y: back.pos.y, vx: 0, vy: 0, tick: 0 });
    for (const b of [front1, front2]) {
      f.book.set(b.gid, { x: b.pos.x, y: b.pos.y, vx: 0, vy: 0, tick: 0 });
    }
    // At tick 29 the back man's capped gain is 29; the loss is 29 × 2 men in front = 58.
    // 29 ≤ 58 ⇒ DECLINED. The cost is real, and it is what stops an all-scanning world.
    expect(chooseInLook(f.reader, f.bodies, f.book, 29, dotMin)).toBeNull();
    // Take the two men in front OUT of his book (he has never seen them): loss collapses to
    // 0 and the very same geometry now elects the look. The threshold is the only difference.
    f.book.delete(front1.gid);
    f.book.delete(front2.gid);
    const e = chooseInLook(f.reader, f.bodies, f.book, 29, dotMin);
    expect(e).not.toBeNull();
    expect(e!.loss).toBe(0);
    expect(e!.gain).toBe(29);
  });

  /**
   * ⭐⭐ ADDED BY THE UNPINNED-TERM HUNT (the DF-T2 lesson, #327 §CORR 1): mutant M5
   * (`return true` → `return false` at the open-window branch) killed ZERO pins — the LOCK,
   * which IS the look's whole price, was unpinned. The ledger's `lockedDecisions` counter
   * is NOT the pin, because a broken lock still increments it; the pin has to be the gate's
   * own ANSWER. Disclosed in §R8 as landing on commit 2 rather than commit 1.
   */
  it('⭐⭐ THE LOCK IS THE PRICE: an open window says DO-NOT-RE-DECIDE, and suspends sight', () => {
    const m = matchOf(SEED_A, { world: W9, in: true, look: true });
    while (m.phase !== 'playing') m.step(DT);
    // a body who is NOT the carrier (the ball arriving is an abort channel, not a lock)
    const p = m.teams[0].players.find((b) => m.ball.owner !== b && !b.sentOff)!;
    p.stunTimer = 0;
    const until = m.simTick + 10;
    m.inLookWindows.set(p.gid, until);
    const passesBefore = m.inLookLedger.passivePasses;
    const lockedBefore = m.inLookLedger.lockedDecisions;
    // ⭐ THE PRICE, BEING PAID — the gate's own answer, not a counter
    expect(inLookGate(p, m)).toBe(true);
    expect(m.inLookLedger.lockedDecisions).toBe(lockedBefore + 1);
    // …and THE PASSIVE HALF IS SUSPENDED while he is turned away (the `loss` term's substrate)
    expect(m.inLookLedger.passivePasses).toBe(passesBefore);
    expect(m.inLookWindows.get(p.gid)).toBe(until);
    // when the window expires the gate hands him back his decision, and sight resumes
    m.inLookWindows.set(p.gid, m.simTick);
    inLookGate(p, m);
    expect(m.inLookWindows.has(p.gid) && m.inLookWindows.get(p.gid) === m.simTick).toBe(false);
    expect(m.inLookLedger.passivePasses).toBe(passesBefore + 1);
    expect(m.inLookLedger.completed).toBeGreaterThan(0);
  });

  /**
   * ⭐⭐ ADDED BY THE UNPINNED-TERM HUNT: mutant M7 (`} else if (` → `}` + `if (` in the
   * gain/loss loop) killed ZERO pins — the EXCLUSIVITY of the two sides was unpinned. A body
   * the look would KEEP seeing must be counted as gain and NOT ALSO as loss, or the body
   * pays twice for the same man. The two fields genuinely overlap whenever the turn is less
   * than a full reversal, so the fixture is a real geometry, not a contrivance.
   */
  it('⭐⭐ GAIN AND LOSS ARE EXCLUSIVE: a body in BOTH fields is never charged as loss', () => {
    const dotMin = inFieldDotMin(F2);
    const f = fix(SEED_C, 2);
    // A at +120° — the only candidate (outside the +x heading's 90° field), turn = 20 ticks
    const a = f.place(1, 12 * Math.cos((120 * Math.PI) / 180), 12 * Math.sin((120 * Math.PI) / 180));
    // B at +60° — INSIDE the heading field AND inside the aim's field (|60 − 120| = 60 < 90)
    const b = f.place(2, 12 * Math.cos((60 * Math.PI) / 180), 12 * Math.sin((60 * Math.PI) / 180));
    for (const q of [a, b]) f.book.set(q.gid, { x: q.pos.x, y: q.pos.y, vx: 0, vy: 0, tick: 0 });
    const e = chooseInLook(f.reader, f.bodies, f.book, IN_LOOK_AGE_CAP_TICKS, dotMin);
    expect(e).not.toBeNull();
    expect(e!.aimGid).toBe(a.gid);
    expect(e!.turnTicks).toBe(inLookTurnTicks((120 * Math.PI) / 180));
    expect(e!.turnTicks).toBe(20);
    // BOTH bodies sit inside the aim field ⇒ both are GAIN, at the cap
    expect(e!.gain).toBe(2 * IN_LOOK_AGE_CAP_TICKS);
    // ⭐ …and B, though he is also in the heading field, is NOT charged as loss
    expect(e!.loss).toBe(0);
  });

  it('⭐ THE AGE CAP IS A CAP — a book left to rot does not buy an unbounded look', () => {
    const f = fix(SEED_A, 1);
    const b = f.place(1, -10, 0);
    f.book.set(b.gid, { x: b.pos.x, y: b.pos.y, vx: 0, vy: 0, tick: 0 });
    const e = chooseInLook(f.reader, f.bodies, f.book, 14_400, inFieldDotMin(F2));
    expect(e!.gain).toBe(IN_LOOK_AGE_CAP_TICKS); // NOT 14,400
  });

  it('⭐ SENT-OFF BODIES ARE NEITHER AIMED AT NOR PRICED, and cold starts erase no age', () => {
    const f = fix(SEED_B, 1);
    const b = f.place(1, -10, 0);
    b.sentOff = true;
    f.book.set(b.gid, { x: b.pos.x, y: b.pos.y, vx: 0, vy: 0, tick: 0 });
    expect(chooseInLook(f.reader, f.bodies, f.book, 900, inFieldDotMin(F2))).toBeNull();
    // a cold start writes the body but erases NO age (there was none to erase)
    b.sentOff = false;
    const fresh = new Map<number, InSeenBody>();
    const r = inLookRefreshField(f.reader, f.bodies, -1, 0, fresh, 900, inFieldDotMin(F2));
    expect(r.written).toBe(1);
    expect(r.erased).toBe(0);
    expect(fresh.get(b.gid)).toEqual(coldStart(b, 900));
  });
});

describe('IN T1 §THE ACT IN A LIVE WORLD — any body looks, and the price is charged', () => {
  it('⭐⭐ ANY BODY MAY LOOK: carrier, off-ball outfield AND keeper all look on one walk', () => {
    const m = matchOf(SEED_A, { world: W9, in: true, look: true, duration: 240 });
    while (!m.finished) m.step(DT);
    const led = m.inLookLedger;
    expect(led.looks).toBeGreaterThan(0);
    for (const s of led.looksBySituation) expect(s).toBeGreaterThan(0); // all three situations
    for (const d of led.decisionsBySituation) expect(d).toBeGreaterThan(0);
    // …and it is not one body's habit: every gid on the pitch takes at least one look
    expect(led.looksByGid.size).toBe(2 * TEAM_SIZE);
    // the price was CHARGED: ticks paid, and decisions actually lost to the windows
    expect(led.turnTicksPaid).toBeGreaterThanOrEqual(led.looks * 15);
    expect(led.lockedDecisions).toBeGreaterThan(0);
    // ⭐ NON-DEGENERACY BOTH WAYS: looks happen, and the cost also DECLINES looks
    expect(led.declines).toBeGreaterThan(0);
    expect(led.looks / led.decisionsSeen).toBeGreaterThan(0);
    expect(led.looks / led.decisionsSeen).toBeLessThan(1);
    // every window opened is accounted for: completed + aborted + still open = looks
    expect(led.completed + led.aborted + m.inLookWindows.size).toBe(led.looks);
  });

  it('⭐⭐ THE LOOK BUYS THE BOOK BACK — staleness AGE collapses against the shut arm', () => {
    // A RECEIPT PIN, not a football claim: the seam must move the quantity it exists to move.
    const shut = matchOf(SEED_B, { world: W9, in: true, duration: 240 });
    while (!shut.finished) shut.step(DT);
    const armed = matchOf(SEED_B, { world: W9, in: true, look: true, duration: 240 });
    while (!armed.finished) armed.step(DT);
    const age = (m: Match): number =>
      m.inSnapshotLedger.staleAgeTickSum / Math.max(1, m.inSnapshotLedger.readsStale);
    expect(shut.inSnapshotLedger.readsStale).toBeGreaterThan(0);
    expect(armed.inSnapshotLedger.readsStale).toBeGreaterThan(0);
    expect(age(armed)).toBeLessThan(age(shut));
    // …and the LOOK itself did a real share of the erasing (not just the free passive half)
    const led = armed.inLookLedger;
    expect(led.lookAgeErasedTicks).toBeGreaterThan(0);
    expect(led.passiveAgeErasedTicks).toBeGreaterThan(0);
  });

  it('⭐ THE BALL ARRIVING ENDS A LOOK — the 接球前观察 payoff moment is a real path', () => {
    const m = matchOf(SEED_C, { world: W9, in: true, look: true, duration: 240 });
    while (!m.finished) m.step(DT);
    expect(m.inLookLedger.abortedBallArrived).toBeGreaterThan(0);
    // and the seam's situation classifier is the one the ledger buckets by
    const p = m.teams[0].players[1];
    expect(inLookSituation(p, m)).toBe(p.role === 'GK' ? 2 : 1);
  });

  it('⭐ the store stays bounded when the look fills it — at most 11 others per reader', () => {
    const m = matchOf(SEED_A, { world: W9, in: true, look: true, duration: 120 });
    while (!m.finished) m.step(DT);
    expect(m.inSnapshotStore.size).toBeGreaterThan(0);
    for (const book of m.inSnapshotStore.values()) {
      expect(book.size).toBeLessThanOrEqual(2 * TEAM_SIZE - 1);
    }
    expect(m.inSnapshotStore.size).toBeLessThanOrEqual(2 * TEAM_SIZE);
    expect(m.inLookWindows.size).toBeLessThanOrEqual(2 * TEAM_SIZE);
  });
});

describe('IN T1 §PHYSICS STAYS TRUTH (M-IN.1) — the look spends time and nothing else', () => {
  it('⭐⭐ THE MODULE WRITES NO BODY STATE, DRAWS NO RNG AND NAMES NO KNOB', () => {
    for (const forbidden of [
      /\.heading\s*=/, /faceTarget/, /\.vel\s*=/, /\.pos\s*=/, /\.action\s*=/, /perform[A-Z]/,
      /rng/, /Rng/, /\.genome/, /\.attrs/, /\.traits/, /\.policies/, /Math\.random/,
      /\.decisionTimer/, /\.kickCooldown/, /giveBall/,
    ]) {
      expect(count(lookCode, new RegExp(forbidden.source, 'g'))).toBe(0);
    }
    // …and the stripped corpus is NOT vacuous: the law's own code is still in it
    expect(lookCode).toContain('export function inLookGate');
    expect(lookCode).toContain('inLookTurnTicks(Math.acos(');
    expect(lookCode.split('\n').filter((l) => l.trim().length > 0).length).toBeGreaterThan(120);
    // THE IMPORT LIST, PINNED EXACTLY: two shipped quantities, the Match/Player types, and
    // IN-T0's own book writers. No look seam, no gene table, no percept channel.
    expect(lookSource.split('\n').filter((l) => l.startsWith("import ") || l.startsWith("  coldStart") || l.startsWith("} from '"))).toEqual([
      "import { DT } from '../sim/constants';",
      "import { TURN_RATE } from '../sim/Player';",
      "import type { Player } from '../sim/Player';",
      "import type { Match } from '../sim/Match';",
      "import {",
      '  coldStart, inFieldDotMin, refresh,',
      "} from './inSnapshotView';",
    ]);
    // the ONLY writes it makes are into the book, the windows map and the ledger
    expect(count(lookSource, /book\.set\(|match\.inLookWindows\.set\(|led\./g))
      .toBeGreaterThan(0);
  });

  it('⭐⭐ NO EXECUTOR, PHYSICS, MARKING OR RENDER FILE NAMES THE NEEDLE', () => {
    for (const rel of ['ai/actionExecutor.ts', 'ai/TeamBrain.ts', 'sim/mechanics.ts',
      'sim/Player.ts', 'sim/Team.ts', 'sim/Ball.ts', 'game/a4World.ts',
      'ai/defensiveCoordination.ts', 'render3d/RenderStateAdapter.ts', 'sim/cloneState.ts']) {
      expect(src(rel)).not.toContain('inLook');
      expect(src(rel)).not.toContain('InLook');
    }
    // ⭐ THE BANKED O2 LOOK SEAM IS UNTOUCHED — this slice built NEW, it did not extend it
    // (the extend-vs-new ruling is the stage doc's §P2(d)); so its own file is byte-clean of
    // this needle, and this module is byte-clean of its.
    expect(src('ai/lookSeat.ts')).not.toContain('inLook');
    for (const o2 of [/o2Look/, /O2_LOOK/, /forcedLook/, /armO2Look/, /lookSeat/]) {
      expect(count(lookCode, new RegExp(o2.source, 'g'))).toBe(0);
    }
    // …and the O2 seam's own permanent suite still exists, untouched by this slice
    expect(readFileSync(new URL('./o2Look.test.ts', import.meta.url), 'utf8'))
      .not.toContain('inLook');
  });
});

describe('IN T1 §NO SERIALIZATION — the windows are per-match transient (the DF-T0 precedent)', () => {
  it('⭐⭐ neither the windows nor the ledger can reach League.toJSON, clone or the adapter', () => {
    const leagueSource = src('sim/League.ts');
    expect(count(leagueSource, /inLookAct/g)).toBe(1); // the matchFlags key union, nowhere else
    expect(leagueSource).not.toContain('inLookWindows');
    expect(leagueSource).not.toContain('inLookLedger');
    // canon VERBATIM (home ruling #283.2(iv)): "WORKER-SIMMED fixtures play the SHIPPED
    // world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned;
    // refines #270's E4 correction; matches the perf diagnostic)".
    const league = new League({ seed: 20260820 });
    expect(JSON.stringify(league.toJSON())).not.toContain('inLook');
  });
});

describe('IN T1 §FLAG SEMANTICS — it composes freely, and owns no refusal', () => {
  it('⭐⭐ THE 16-CELL POWER SET BUILDS: {inLookAct}×{inSnapshotLaw}×{dfAssignPersist}×{dfSurface}', () => {
    for (const look of [false, true]) {
      for (const inLaw of [false, true]) {
        for (const df of [false, true]) {
          for (const dfs of [false, true]) {
            const m = matchOf(SEED_A, { world: W9, look, in: inLaw, df, dfs });
            expect(m.inLookAct).toBe(look);
            expect(m.inSnapshotLaw).toBe(inLaw);
            expect(m.dfAssignPersist).toBe(df);
            expect(m.dfSurface).toBe(dfs);
          }
        }
      }
    }
    // alone, with no other seam at all: perfectly legal — it owns its one fork
    const alone = new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      c7Windup: false, o1PassWindup: false, inLookAct: true,
    });
    expect(alone.inLookAct).toBe(true);
    // …and the FIELD parameter it borrows from IN-T0 is live for the look too
    expect(matchOf(SEED_A, { look: true, field: F4 }).inSnapshotField).toBe(F4);
  });

  it('⭐⭐ LIFECYCLE CLEAN: the full stack composes to a real, distinct, terminating world', () => {
    const all = matchOf(SEED_B, {
      world: W9, look: true, in: true, df: true, dfs: true, duration: 240,
    });
    while (!all.finished) all.step(DT);
    expect(all.finished).toBe(true);
    expect(all.inLookLedger.looks).toBeGreaterThan(0);
    expect(all.inSnapshotLedger.viewsBuilt).toBeGreaterThan(0);
    // …and the composed world differs from the same stack with the look shut (no absorption)
    const sigAll = signatureOf(matchOf(SEED_B, { world: W9, look: true, in: true, df: true, dfs: true }));
    const sigNoLook = signatureOf(matchOf(SEED_B, { world: W9, in: true, df: true, dfs: true }));
    expect(sigAll).not.toBe(sigNoLook);
  });

  it('⭐ ARMED WITHOUT ITS CONSUMER is legal and stated: it still costs time, buys nothing priced', () => {
    const m = matchOf(SEED_C, { world: W9, look: true, duration: 120 });
    while (!m.finished) m.step(DT);
    expect(m.inLookLedger.looks).toBeGreaterThan(0);
    expect(m.inSnapshotLedger.viewsBuilt).toBe(0); // IN-T0's gateway never ran
  });

  it('⭐ no constructor refusal anywhere names this flag', () => {
    for (const chunk of matchSource.split('throw new Error(').slice(1)) {
      expect(chunk.slice(0, 600)).not.toContain('inLook');
    }
  });
});

describe('IN T1 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE PREFIX `inLook` / `InLook` / `IN_LOOK` — every occurrence, counted and sited', () => {
    // PREFIX STATED: the needle family is `inLook*` in all three of the engine's casings.
    // Its members are exactly: the flag `inLookAct` (which is also the MODULE name), the two
    // per-match states `inLookWindows` / `inLookLedger`, the ledger factory
    // `createInLookLedger`, the fork `inLookGate`, the pure law `chooseInLook` /
    // `inLookTurnTicks` / `inLookRefreshField` / `inLookSituation`, the constant
    // `IN_LOOK_AGE_CAP_TICKS`, and the types `InLookLedger` / `InLookWindows` /
    // `InLookElection` / `InLookRefreshReceipt`.
    const members = new RegExp(
      '(inLook(Act|Windows|Ledger|Gate|TurnTicks|RefreshField|Situation)'
      + '|createInLookLedger|chooseInLook|IN_LOOK_AGE_CAP_TICKS'
      + '|InLook(Ledger|Windows|Election|RefreshReceipt))', 'g',
    );
    for (const hay of [matchSource, brainSource, src('sim/League.ts')]) {
      expect(count(hay, /inLook|InLook|IN_LOOK/gi)).toBe(count(hay, members));
    }
    // Match.ts: the config declaration + the three readonly declarations + the initialiser +
    // the import line's two type names and factory = the ONLY places the engine names it.
    expect(count(matchSource, /^ {2}inLookAct\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly inLookAct: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly inLookWindows: InLookWindows = new Map\(\);$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly inLookLedger: InLookLedger = createInLookLedger\(\);$/gm)).toBe(1);
    expect(count(matchSource, /this\.inLookAct = cfg\.inLookAct \?\? false;/g)).toBe(1);
    // PlayerBrain.ts: ONE fork, ONE import, and the flag read EXACTLY ONCE
    expect(count(brainSource, /match\.inLookAct/g)).toBe(1);
    expect(count(brainSource, /inLookGate\(/g)).toBe(1);
    expect(count(brainSource, /from '\.\/inLookAct'/g)).toBe(1);
    expect(linesOf(brainSource, '  if (match.inLookAct && inLookGate(p, match)) return;')).toBe(1);
    // …and the fork is ABOVE the carrier dispatch, which is what makes it ANY body's
    expect(brainSource.indexOf('if (match.inLookAct && inLookGate(p, match)) return;'))
      .toBeLessThan(brainSource.indexOf('    decideCarrier(p, team, opp, match);'));
  });

  it('⭐ THE §CORR 3 COMMENT FIX (ruling #325) — the whetherEye clause is present and true', () => {
    // The IN-T0 §SEAM comment claimed NO helper re-enters team/opp/match for another body's
    // position. `whetherEyeDecision` does reach for a roster — identity only — and the doc
    // named it out correctly while the comment did not. ORDERED FIXED onto this commit.
    expect(brainSource).toContain('THE ONE');
    expect(brainSource).toContain('`whetherEye.ts:147`');
    expect(brainSource).toContain('IDENTITY only');
    expect(brainSource).toContain('ordered here by ruling #325 §CORR 3');
    // …and the line the comment names is really there, and is really a roster walk
    const whether = src('ai/whetherEye.ts').split('\n');
    expect(whether[146]).toContain('match.teams[p.side].players');
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.inLookAct).toBe(false);
    expect(bare.inLookWindows.size).toBe(0);
    expect(createInLookLedger().looks).toBe(0);
  });
});
