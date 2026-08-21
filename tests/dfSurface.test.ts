import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { DF_SURFACE_OPTIONS, updateTeamBrain } from '../src/ai/TeamBrain';
import { decidePlayer } from '../src/ai/PlayerBrain';
import { markSagMetres } from '../src/ai/actionExecutor';
import { L3_RECKLESS_ARRIVAL, arrivalGroup } from '../src/ai/defenceBook';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import type { Player } from '../src/sim/Player';

/**
 * DF T2 — THE DEFENSIVE DECISION SURFACE (docs/world-model/DF-T2-DECISION-SURFACE.md;
 * contract DF-DEFENSIVE-BRAIN-CONTRACT.md §2 M-DF.1/M-DF.2/M-DF.3/M-DF.4; ruling #325 item 5)
 * — THE SEAM'S PERMANENT PIN SUITE, in the house form (`dfAssignPersist.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY, STRONG FORM — flag ABSENT ≡ flag EXPLICIT-FALSE, byte for byte,
 *     in BOTH world shapes × 2 seeds, with a POOLED DIGEST.
 *   • ⭐⭐ THE OPTION PRICING LAWS — each of the three accounts (the L3 access-time slack, the
 *     defence book, the commitment-physics arrival group) provably enters at least one
 *     option's price, on constructed fixtures, each with its arithmetic mutant stated.
 *   • ⭐⭐ THE CAP INTACT — `assignChasers` is sha-identical to HEAD's slice, never names the
 *     needle, and the four-chaser bin stays EXACTLY ZERO on an armed walk (M-DF.2).
 *   • ⭐⭐ THE COMPOSITION POWER SET — {dfSurface} × {dfAssignPersist} × the world-9 +
 *     inSnapshotLaw stack, and the HOLD option is provably unreachable without persistence.
 *   • ⭐ NO SERIALIZATION — the ledger is per-match transient (the DF-T0 / IN-T0 precedent).
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon VERBATIM: "a
 *     seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site", home PC-C0 §CORR item 1).
 *   • ⭐ THE ANCHORED EXTRACTIONS — every constant pinned to its NAMED call site.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside DF-T2's OWN booked block (ruling #325 item 5: 12,512,000–999). */
const SEED_A = 12_512_800;
const SEED_B = 12_512_801;
const SEED_C = 12_512_802;

const W8 = 8 as const;
const W9 = 9 as const;
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
  /** arm the decision surface */
  sf?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  sfExplicitFalse?: boolean;
  /** arm DF-T0's persistence law beneath it (the HOLD option's substrate) */
  persist?: boolean;
  /** arm IN-T0's snapshot law too (the composition stack's third seam) */
  snapshot?: boolean;
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
    ...(a.persist === true ? { dfAssignPersist: true } : {}),
    ...(a.snapshot === true ? { inSnapshotLaw: true } : {}),
    ...(a.sf === true ? { dfSurface: true } : {}),
    ...(a.sfExplicitFalse === true ? { dfSurface: false } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0, BK-T1, DF-T0). */
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
const teamBrainSource = src('ai/TeamBrain.ts');
const matchSource = src('sim/Match.ts');
const playerBrainSource = src('ai/PlayerBrain.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const lineHits = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;

/* ========================================================================== */
/* THE CONSTRUCTED DEFENDING FIXTURE                                          */
/* ========================================================================== */
/**
 * A hand-placed out-of-possession picture driven by DIRECT `updateTeamBrain` passes (never by
 * physics), in the DF-T0 form: team 0 defends, three of its outfielders are parked ON the ball
 * as chaser sponges so the subject body can never be licensed as a presser by the Phase-31
 * cap, and the carrier is placed in our defensive territory so the shipped contain branch's
 * geometry is reachable.
 */
interface Fixture {
  m: Match;
  /** the subject defender */
  d: Player;
  /** the spare defender (a second body for the priced-greedy fixtures) */
  d2: Player;
  /** his man */
  manA: Player;
  /** the interloper */
  manC: Player;
  carrier: Player;
  goalX: number;
}
const place = (p: Player, x: number, y: number): void => {
  p.pos = { x, y };
  p.vel = { x: 0, y: 0 };
};
const fixture = (seed: number, a: Arm = {}): Fixture => {
  const m = matchOf(seed, { world: W9, ...a });
  while (m.phase !== 'playing') m.step(DT);
  const us = m.teams[0];
  const them = m.teams[1];
  (us.style as { scheme: string }).scheme = 'man'; // zonal is a different creation rule
  const goalX = us.ownGoal().x;
  const carrier = them.players[1];
  m.ball.owner = carrier;
  m.possessionSide = 1;
  place(carrier, goalX + 25, 0);
  m.ball.pos = { x: goalX + 25, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  // three sponges ON the ball soak up every chaser licence the cap can issue
  place(us.players[3], goalX + 25.5, 0.5);
  place(us.players[4], goalX + 26, 0);
  place(us.players[5], goalX + 26.5, 0.5);
  const d = us.players[1];
  const d2 = us.players[2];
  place(d, goalX + 20, 0);
  place(d2, goalX + 40, 30);
  const manA = them.players[2];
  const manC = them.players[3];
  place(manA, goalX + 20, 1);
  place(manC, goalX + 44, 27);
  place(them.players[4], goalX + 42, -28);
  place(them.players[5], goalX + 46, 27);
  updateTeamBrain(us, m);
  return { m, d, d2, manA, manC, carrier, goalX };
};

/* ========================================================================== */
/* §DORMANCY                                                                  */
/* ========================================================================== */
describe('DF T2 — the decision surface is dormant (Road B)', () => {
  it('⭐ default-off: dfSurface false everywhere, and absent from every shipped world', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.dfSurface).toBe(false);
    const league = new League({ seed: 20260820 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.dfSurface).toBe(false);
    for (const w of [W8, W9] as const) {
      expect((a4MatchFlags(w) as Record<string, unknown>).dfSurface).toBeUndefined();
    }
    expect(src('game/a4World.ts')).not.toContain('dfSurface');
  });

  it('⭐⭐ ROAD B DORMANCY (STRONG): ABSENT ≡ EXPLICIT-FALSE, both worlds × 2 seeds, pooled', () => {
    const absent: string[] = [];
    const explicitFalse: string[] = [];
    for (const world of [W8, W9] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        absent.push(signatureOf(matchOf(seed, { world })));
        explicitFalse.push(signatureOf(matchOf(seed, { world, sfExplicitFalse: true })));
      }
    }
    // per-cell AND pooled — the pooled digest is the one line a mutant must move
    expect(explicitFalse).toEqual(absent);
    const digest = (xs: string[]): string =>
      createHash('sha256').update(xs.join('|')).digest('hex');
    expect(digest(explicitFalse)).toBe(digest(absent));
  });

  it('⭐ arming it is a REAL change — the armed world is distinguishable from the shut one', () => {
    for (const world of [W8, W9] as const) {
      const shut = signatureOf(matchOf(SEED_A, { world, persist: true }));
      const open = signatureOf(matchOf(SEED_A, { world, persist: true, sf: true }));
      expect(open).not.toBe(shut);
    }
  });

  it('⭐ the usage ledger is EMPTY unless the surface is armed', () => {
    const shut = matchOf(SEED_B, { world: W9, persist: true, duration: 60 });
    while (!shut.finished) shut.step(DT);
    expect(shut.dfSurfaceLedger.elections).toBe(0);
    expect(shut.dfSurfaceLedger.byOption).toEqual([0, 0, 0, 0]);
    expect(shut.dfSurfaceLedger.byGid.size).toBe(0);
    const armed = matchOf(SEED_B, { world: W9, persist: true, sf: true, duration: 60 });
    while (!armed.finished) armed.step(DT);
    expect(armed.dfSurfaceLedger.elections).toBeGreaterThan(0);
    expect(armed.dfSurfaceLedger.byGid.size).toBeGreaterThan(0);
  });
});

/* ========================================================================== */
/* §THE OPTION PRICING LAWS — every account provably enters a price           */
/* ========================================================================== */
describe('DF T2 §PRICING — the four options, each priced from a SHIPPED account', () => {
  it('⭐⭐ PRESS: he leaves a distant man for the carrier — and keeps a cheap one', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      // (a) his man is 15 m away with no recoverable slack ⇒ the ball (5 m) outprices him
      {
        const f = fixture(seed, { persist: true, sf: true });
        place(f.manA, f.goalX + 20, 15);
        updateTeamBrain(f.m.teams[0], f.m);
        expect(f.m.teams[0].marks.has(f.d.index)).toBe(false); // ⭐ he elected the ball
        expect(f.m.dfSurfaceLedger.byOption[0]).toBeGreaterThan(0);
      }
      // (a2) ⭐ DEATH CONDITION (8) ITSELF: the man drifts from 4 m to 6 m — BOTH INSIDE the
      // account's own 9 m ceiling, so DF-T0's condition (7) never fires — while the carrier
      // stays 5 m away. At 4 m marking is cheaper and he holds; at 6 m the ball outprices
      // his man, and the assignment must be released by the SURFACE's own death condition.
      {
        const f = fixture(seed, { persist: true, sf: true });
        place(f.manA, f.goalX + 20, 4);
        updateTeamBrain(f.m.teams[0], f.m);
        expect(f.m.teams[0].marks.get(f.d.index)).toBe(f.manA.index); // it survives (7)…
        place(f.manA, f.goalX + 20, 6);
        updateTeamBrain(f.m.teams[0], f.m);
        expect(f.m.teams[0].marks.has(f.d.index)).toBe(false); // …and dies by (8)
      }
      // (b) the SAME picture with the man 1 m away ⇒ marking is cheaper, he stays
      {
        const f = fixture(seed, { persist: true, sf: true });
        place(f.manA, f.goalX + 20, 1);
        updateTeamBrain(f.m.teams[0], f.m);
        expect(f.m.teams[0].marks.get(f.d.index)).toBe(f.manA.index);
      }
      // (c) the SHUT world never vacates: the shipped greedy takes the distant man
      {
        const f = fixture(seed, { persist: true });
        place(f.manA, f.goalX + 20, 15);
        updateTeamBrain(f.m.teams[0], f.m);
        expect(f.m.teams[0].marks.get(f.d.index)).toBe(f.manA.index);
      }
    }
  });

  it('⭐⭐ PRESS is priced UNDISCOUNTED — the account prices the ball at the carrier itself', () => {
    const f = fixture(SEED_A, { persist: true, sf: true });
    // the L3 account, called at the stance line's own argument tuple, returns EXACTLY 0 for
    // the carrier: the ball is at his feet, so t_ball ≈ 0 ⇒ slack < 0 ⇒ no sag. Pressing
    // therefore buys no head start, and that is what makes it expensive — no carve-out.
    expect(markSagMetres(f.m.ball.pos, f.carrier.pos, f.d.pos, f.d.topSpeed)).toBe(0);
  });

  it('⭐⭐ THE BOOK DECLINES THE PRESS — decline-only, and the ARRIVAL GROUP is what it reads', () => {
    // a doctored book: this team's own experience says lunging from the RECKLESS group gets
    // punished far more often than from the controlled one.
    const armBook = (m: Match): void => {
      const book = m.l3Defence!.books[0];
      book.reset(); // the warm-up walk may already have closed labels — start from empty
      for (let i = 0; i < 10; i++) {
        book.note(1, i < 9); // reckless: 9 of 10 punished
        book.note(0, i < 1); // controlled: 1 of 10 punished
      }
      expect(book.declinesLunge(1)).toBe(true);
      expect(book.declinesLunge(0)).toBe(false);
    };
    // (a) ARRIVING RECKLESSLY: the press option is removed and he keeps his distant man
    {
      const f = fixture(SEED_A, { persist: true, sf: true });
      armBook(f.m);
      place(f.manA, f.goalX + 20, 15);
      f.d.vel = { x: L3_RECKLESS_ARRIVAL + 0.5, y: 0 };
      expect(arrivalGroup(Math.hypot(f.d.vel.x, f.d.vel.y))).toBe(1);
      updateTeamBrain(f.m.teams[0], f.m);
      expect(f.m.teams[0].marks.get(f.d.index)).toBe(f.manA.index); // ⭐ declined
      expect(f.m.dfSurfaceLedger.pressDeclinedByBook).toBeGreaterThan(0);
    }
    // (b) THE SAME BOOK, ARRIVING UNDER CONTROL: nothing is declined and he presses
    {
      const f = fixture(SEED_A, { persist: true, sf: true });
      armBook(f.m);
      place(f.manA, f.goalX + 20, 15);
      f.d.vel = { x: 0, y: 0 };
      expect(arrivalGroup(0)).toBe(0);
      updateTeamBrain(f.m.teams[0], f.m);
      expect(f.m.teams[0].marks.has(f.d.index)).toBe(false);
      expect(f.m.dfSurfaceLedger.pressDeclinedByBook).toBe(0);
    }
    // (c) NEVER A SUBSIDY: an EMPTY book declines nothing, so it can only ever REMOVE the
    // option — there is no book state on which pressing becomes MORE likely.
    {
      const f = fixture(SEED_A, { persist: true, sf: true });
      const book = f.m.l3Defence!.books[0];
      book.reset();
      expect(book.total).toBe(0);
      expect(book.declinesLunge(0)).toBe(false);
      expect(book.declinesLunge(1)).toBe(false);
    }
  });

  it('⭐⭐ JUMP vs TAKE: the account\'s own sign splits READING from CONTACT', () => {
    const f = fixture(SEED_A, { persist: true, sf: true });
    // a man 30 m from the ball: a body who can be there before the pass can (slack > 0) is
    // JUMPING the lane; a body the ball beats (slack = 0) is TAKING him on contact terms.
    const reader = markSagMetres({ x: 0, y: 0 }, { x: 0, y: 30 }, { x: 0, y: 25 }, 7);
    const contact = markSagMetres({ x: 0, y: 4 }, { x: 0, y: 30 }, { x: 0, y: 5 }, 7);
    expect(reader).toBeGreaterThan(0);
    expect(contact).toBe(0);
    // and both classes actually occur in a real walk (the ledger's non-degeneracy)
    const m = matchOf(SEED_C, { world: W9, persist: true, sf: true, duration: 240 });
    while (!m.finished) m.step(DT);
    expect(m.dfSurfaceLedger.byOption[2]).toBeGreaterThan(0); // jump
    expect(m.dfSurfaceLedger.byOption[3]).toBeGreaterThan(0); // take
    expect(f.m.dfSurface).toBe(true);
  });

  it('⭐⭐ THE PRICED GREEDY: a FASTER body one metre further outbids a slower nearer one', () => {
    const f = fixture(SEED_B, { persist: true, sf: true });
    const us = f.m.teams[0];
    const them = f.m.teams[1];
    // one man, 30 m from the ball; two candidates, neither holding anything
    place(f.manA, f.goalX + 55, 0);
    place(f.manC, f.goalX + 90, 0);
    place(them.players[4], f.goalX + 88, -28);
    place(them.players[5], f.goalX + 92, 27);
    const near = f.d;
    const far = f.d2;
    place(near, f.goalX + 50, 0); // 5 m away, SLOW
    place(far, f.goalX + 49, 0); // 6 m away, FAST
    (near as unknown as { baseSpeed: number }).baseSpeed = 3;
    (far as unknown as { baseSpeed: number }).baseSpeed = 9;
    us.marks.clear();
    const pNear = 5 - markSagMetres(f.m.ball.pos, f.manA.pos, near.pos, near.topSpeed);
    const pFar = 6 - markSagMetres(f.m.ball.pos, f.manA.pos, far.pos, far.topSpeed);
    expect(pFar).toBeLessThan(pNear); // the account says the FAR man gets there first…
    expect(6).toBeGreaterThan(5); // …while raw distance (the shipped currency) says the near one
    updateTeamBrain(us, f.m);
    expect(us.marks.get(far.index)).toBe(f.manA.index); // ⭐ the priced greedy takes the reader
    // THE MUTANT, stated as arithmetic: with the account dropped (slack := 0) the price
    // collapses to raw distance and the NEAR body wins this fixture, so this pin dies.
    expect(6 - 0).toBeGreaterThan(5 - 0);
  });

  /**
   * ⭐⭐ DF-T3 COMMIT-1 RIDER (DF-T2 §COMMANDER CORRECTIONS item 1, ruling #327; ordered onto
   * this commit by ruling #331 item 5). THE DISAMBIGUATED PIN.
   *
   * The verifier's own mutant found that neutralising the PRESS ELECTION's CANDIDATE-SIDE
   * slack term — `const priceM = d - slackMetres(threat, p);` at `TeamBrain.ts:696`, the
   * election's copy, EIGHT-space indent — killed ZERO of the twenty pins, while the
   * `§R10 M4` edit text matches BOTH that line and the PRICED GREEDY's copy (`:743`,
   * TEN-space indent) as a substring. Account 1 was therefore proven load-bearing AT THE
   * GREEDY ONLY. This fixture flips the VACATE decision on the `:696` term alone:
   *
   *   priced   bestMarkPrice = dist(d, man) − slack(man, d) < dist(d, carrier) ⇒ he MARKS
   *   unpriced bestMarkPrice = dist(d, man)                  > dist(d, carrier) ⇒ he PRESSES
   *
   * so `slack` is squeezed between the two distances by construction, and the two
   * inequalities are ASSERTED before the pass rather than assumed. The greedy's own copy is
   * untouched by this fixture (the subject outprices every rival for the same man either
   * way), so the two pins now die on DIFFERENT single-line mutants.
   */
  it('⭐⭐ THE PRESS ELECTION\'S CANDIDATE-SIDE SLACK (:696) — the DISAMBIGUATED pin', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const f = fixture(seed, { persist: true, sf: true });
      const us = f.m.teams[0];
      const them = f.m.teams[1];
      // every other opponent parked well outside the shipped 22 m creation range, so the
      // subject's best MARKING alternative is exactly ONE man and the price is unambiguous
      place(f.manC, f.goalX + 60, 30);
      place(them.players[4], f.goalX + 60, -30);
      place(them.players[5], f.goalX + 62, 28);
      // the subject is FAST (the account only grants slack to a body who beats the ball)
      (f.d as unknown as { baseSpeed: number }).baseSpeed = 30;
      place(f.manA, f.goalX + 12, 0); // 8 m from the subject, 13 m from the ball
      us.marks.clear(); // nobody holds him: the election reads him through the :696 loop
      const dCarrier = Math.hypot(f.d.pos.x - f.carrier.pos.x, f.d.pos.y - f.carrier.pos.y);
      const dMan = Math.hypot(f.d.pos.x - f.manA.pos.x, f.d.pos.y - f.manA.pos.y);
      const slack = markSagMetres(f.m.ball.pos, f.manA.pos, f.d.pos, f.d.topSpeed);
      expect(slack).toBeGreaterThan(0);
      expect(dMan - slack).toBeLessThan(dCarrier); // PRICED: marking outprices the ball
      expect(dCarrier).toBeLessThan(dMan); // UNPRICED (slack := 0): the ball outprices the man
      updateTeamBrain(us, f.m);
      // ⭐ he keeps his man. Neutralise the :696 slack term and he vacates for the carrier,
      // and this assertion fails — which is the whole point of the pin.
      expect(us.marks.get(f.d.index)).toBe(f.manA.index);
    }
  });

  it('⭐ HOLD is DF-T0\'s law, COMPOSED: no persistence ⇒ the option is unreachable', () => {
    const m = matchOf(SEED_C, { world: W9, sf: true, duration: 120 });
    while (!m.finished) m.step(DT);
    expect(m.dfSurfaceLedger.elections).toBeGreaterThan(0);
    expect(m.dfSurfaceLedger.byOption[1]).toBe(0); // ⭐ nothing can be HELD without the ledger
    const both = matchOf(SEED_C, { world: W9, persist: true, sf: true, duration: 120 });
    while (!both.finished) both.step(DT);
    expect(both.dfSurfaceLedger.byOption[1]).toBeGreaterThan(0);
  });
});

/* ========================================================================== */
/* §THE CAP (M-DF.2)                                                          */
/* ========================================================================== */
describe('DF T2 §THE CAP IS UNTOUCHED (M-DF.2 — two compensators never move in one slice)', () => {
  const chaserSlice = (source: string): string => source.slice(
    source.indexOf('function assignChasers(team: Team, match: Match): void {'),
    source.indexOf('/**\n * Marks: each non-chasing outfielder'),
  );

  /**
   * ⚠⚠ SUPERSEDED OF RECORD AT DF-T4 (ruling #336 item 5: *"the cap slice's sha discipline
   * is replaced by an explicit pin"*). DF-T4's cap-off arm adds two PURELY ADDITIVE
   * flag-gated statements INSIDE this sliced function, so DF-T2 §R6's sha of record
   * `5b4a21d0…703c` moved by construction. What this stage actually needs — that the
   * SURFACE never reaches into the cap — is unchanged and still pinned below by needle;
   * the four-chaser-bin band is pinned in the next test and, with DF-T4's door OFF, in
   * `tests/dfCapOff.test.ts`.
   */
  it('⭐⭐ `assignChasers` never names THIS seam\'s needles (the sha is DF-T4\'s now)', () => {
    const slice = chaserSlice(teamBrainSource);
    expect(slice.length).toBeGreaterThan(1000);
    expect(slice).not.toContain('dfSurface');
    expect(slice).not.toContain('DF_SURFACE');
    expect(slice).not.toContain('markSagMetres');
    expect(slice).not.toContain('arrivalGroup');
    // DF-T2's OWN sha of record, kept as the historical receipt it is
    expect('5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c').toHaveLength(64);
    // the sha of record AT THIS COMMIT (DF-T4 commit 1); the change detector lives in
    // tests/dfCapOff.test.ts, which owns the slice from here on.
    expect(createHash('sha256').update(slice).digest('hex')).toBe(
      '0ae63c71098c8fe12ddf262b8aed57c0b707d21ddef49dc581f1fa49d9c71d62',
    );
  });

  it('⭐⭐ THE FOUR-CHASER BIN IS EXACTLY ZERO on an ARMED walk (DF-C0 §R2\'s band)', () => {
    const m = matchOf(SEED_C, { world: W9, persist: true, sf: true, duration: 240 });
    const bins = [0, 0, 0, 0, 0];
    while (!m.finished) {
      m.step(DT);
      if (m.phase !== 'playing') continue;
      for (const t of m.teams) {
        if (m.possessionSide === t.side) continue;
        bins[Math.min(4, t.chasers.size)] += 1;
      }
    }
    expect(bins[4]).toBe(0);
    expect(bins[0] + bins[1] + bins[2] + bins[3]).toBeGreaterThan(0);
  });
});

/* ========================================================================== */
/* §COMPOSITION                                                               */
/* ========================================================================== */
describe('DF T2 §FLAG SEMANTICS — it composes freely, and owns no refusal', () => {
  it('⭐⭐ THE POWER SET BUILDS: {dfSurface} × {dfAssignPersist} × the world-9 + IN stack', () => {
    for (const sf of [false, true]) {
      for (const persist of [false, true]) {
        for (const snapshot of [false, true]) {
          const m = matchOf(SEED_A, { world: W9, sf, persist, snapshot });
          expect(m.dfSurface).toBe(sf);
          expect(m.dfAssignPersist).toBe(persist);
          expect(m.inSnapshotLaw).toBe(snapshot);
          m.step(DT); // it RUNS in every cell — no refusal, no inert composition
        }
      }
    }
    const alone = new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      c7Windup: false, o1PassWindup: false, dfSurface: true,
    });
    expect(alone.dfSurface).toBe(true);
  });

  it('⭐ the FOUR composition cells are all DISTINCT worlds (none is a no-op of another)', () => {
    const sig = (sf: boolean, persist: boolean): string =>
      signatureOf(matchOf(SEED_B, { world: W9, sf, persist }));
    const cells = [sig(false, false), sig(false, true), sig(true, false), sig(true, true)];
    expect(new Set(cells).size).toBe(4);
  });

  it('⭐ no constructor refusal anywhere names this flag', () => {
    for (const chunk of matchSource.split('throw new Error(').slice(1)) {
      expect(chunk.slice(0, 600)).not.toContain('dfSurface');
    }
  });

  it('⭐ the seam adds NO SERIALIZED state — the usage ledger is per-match transient', () => {
    const leagueSource = src('sim/League.ts');
    expect(count(leagueSource, /dfSurface/g)).toBe(1); // the matchFlags key union only
    expect(src('sim/Team.ts')).not.toContain('dfSurface');
    expect(src('sim/cloneState.ts')).not.toContain('dfSurface');
    expect(src('render3d/RenderStateAdapter.ts')).not.toContain('dfSurface');
    const league = new League({ seed: 20260820 });
    expect(JSON.stringify(league.toJSON())).not.toContain('dfSurface');
  });
});

/* ========================================================================== */
/* §SEAM MAP + ANCHORED EXTRACTIONS                                           */
/* ========================================================================== */
describe('DF T2 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE PREFIXES `dfSurface` and `DF_SURFACE` — every occurrence, counted and sited', () => {
    // PREFIX STATED: two needle families — `dfSurface*` (the flag `dfSurface`, the ledger
    // `dfSurfaceLedger`, the ledger type `DfSurfaceLedger` is a THIRD spelling and is counted
    // separately below) and `DF_SURFACE*` (the option-name export only).
    // Match.ts: 12 — cfg field · readonly · the `this.`/`cfg.` pair · readonly ledger ·
    // 3 prose mentions of the flag + 5 prose mentions of the ledger/type spellings.
    expect(count(matchSource, /dfSurface\?: boolean;/g)).toBe(1);
    expect(count(matchSource, /^ {2}readonly dfSurface: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /this\.dfSurface = cfg\.dfSurface \?\? false;/g)).toBe(1);
    expect(count(matchSource, /^ {2}readonly dfSurfaceLedger: DfSurfaceLedger = \{$/gm)).toBe(1);
    expect(count(matchSource, /export interface DfSurfaceLedger \{/g)).toBe(1);
    // TeamBrain.ts: the ONE consuming site is `assignMarks` — every read is `match.dfSurface`
    expect(count(teamBrainSource, /match\.dfSurface/g)).toBe(7);
    expect(count(teamBrainSource, /match\.dfSurfaceLedger/g)).toBe(2);
    expect(count(teamBrainSource, /export const DF_SURFACE_OPTIONS/g)).toBe(1);
    // nothing else in src names the seam at all
    for (const rel of ['ai/PlayerBrain.ts', 'ai/actionExecutor.ts', 'sim/mechanics.ts',
      'sim/Player.ts', 'sim/Team.ts', 'sim/cloneState.ts', 'game/a4World.ts',
      'ai/defensiveCoordination.ts', 'render3d/RenderStateAdapter.ts']) {
      expect(src(rel)).not.toContain('dfSurface');
      expect(src(rel)).not.toContain('DF_SURFACE');
    }
  });

  it('⭐⭐ THE COORDINATION MODULE STAYS UNWIRED (M-DF.4 — coordination is OUT)', () => {
    // DF-C0 §R3: `defensiveCoordination.ts` is BUILT AND UNWIRED — nothing in src imports it,
    // and this slice does not change that. It is the LATER cluster's, and it is snapshot-shaped.
    // the check is on the IMPORT GRAPH, not on prose: this stage NAMES the module (to say it
    // is out of scope) and must never WIRE it.
    for (const rel of ['ai/TeamBrain.ts', 'ai/PlayerBrain.ts', 'ai/actionExecutor.ts',
      'sim/Match.ts', 'sim/mechanics.ts', 'game/a4World.ts']) {
      expect(src(rel)).not.toMatch(/from '[^']*defensiveCoordination'/);
      expect(src(rel)).not.toMatch(/import\([^)]*defensiveCoordination/);
    }
  });

  it('⭐ THE ANCHORED EXTRACTIONS — each pinned to its NAMED call site, matched exactly once', () => {
    // canon VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
    // anchored match + line receipt — never first-occurrence" (home: BK-C0 §CORR item 1)
    const containLine =
      '      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {';
    expect(lineHits(playerBrainSource, containLine)).toBe(1);
    expect(teamBrainSource).toContain('const CONTAIN_RADIUS_M = 8;');
    expect(teamBrainSource).toContain('const CONTAIN_TERRITORY_M = 35;');
    const rangeLine =
      '      if (d < 22 && (best === null || d < best.d)) best = { idx: p.index, d };';
    expect(lineHits(teamBrainSource, rangeLine)).toBe(1);
    expect(teamBrainSource).toContain('const MARK_RANGE_M = 22;');
    // DF-T0's own extraction is untouched and still singular (MT-T0's narrowed pin's letter)
    expect(teamBrainSource).toContain(
      'const budget = markSagMetres(match.ball.pos, man.pos, p.pos, p.topSpeed);',
    );
    expect(count(teamBrainSource, /markSagMetres\(/g)).toBe(3);
    // the option order of record is the ledger's order, in ONE place
    expect(DF_SURFACE_OPTIONS).toEqual(['press', 'hold', 'jump', 'take']);
  });
});

/* ========================================================================== */
/* §THE CONTAIN-OFFER PREDICATE PIN (DF-T3 §CORR item 2 / ruling #334 item 5)  */
/* ========================================================================== */
/**
 * ⭐⭐ THE ORDERED RIDER — DF-T3 §COMMANDER CORRECTIONS item 2, verbatim: the offer
 * geometry is *"an UNPINNED WALK-SIDE DEFINITION … neutralising the offer predicate's
 * goal-side conjunct moves the starred headline ~2× with all 23 gates green — gFacesFromDisk
 * proves ARITHMETIC, not DEFINITIONS"*. ORDERED there: *"DF-T3B's commit 1 pins the offer
 * predicate (anchored three-term extraction + a fixture whose OFFER membership flips per
 * term)."*
 *
 * Canon VERBATIM (home: CANON.md → DF-T3 §CORR item 2, ruling #332 item 3): *"a scored
 * face's walk-side predicate is pinned — anchored extraction or fixture — because the
 * re-derivation gate proves arithmetic, not definitions"*, REFINED at #334 item 2: *"anchored
 * extraction protects the source line; a headline-bearing walk-side predicate ALSO needs a
 * composition fixture"* (home: BK-T3 §CORR item 2).
 *
 * So this block is BOTH halves:
 *   (i) the ANCHORED THREE-TERM EXTRACTION — the ONE line, matched exactly once, with each
 *       of its three terms captured by its own regex (never a re-typed literal);
 *   (ii) A FIXTURE PER TERM — one POSITIVE picture where all three terms hold and the
 *       shipped contain candidate provably WINS the argmax, and THREE NEGATIVES each
 *       violating EXACTLY ONE term, where it provably does not fire. Neutralising a term in
 *       src (`dC < 8` → `true`, etc.) makes its own negative fixture elect contain and the
 *       fixture DIES — which is what makes the pin specific rather than merely present.
 *
 * ⚠ The predicate lives INSTRUMENT-SIDE (the DF-T3 / DF-T3B press-realisation walkers copy
 * the branch's own three terms). These fixtures pin the SHIPPED branch the instrument claims
 * to mirror, which is the only thing a test can hold still; the instrument's own copy is
 * anchored to this same line by extraction.
 */
const CONTAIN_OFFER_LINE =
  '      if (dC < 8 && carrierGoalD < 35 && dist(p.pos, ownGoal) < carrierGoalD) {';

interface OfferFixture { m: Match; d: Player; carrier: Player }
/**
 * A hand-placed contain picture with EVERY confounder removed by construction: the defending
 * team's chaser and mark sets are CLEARED (so the branch chain reaches the contain else-if),
 * and every other body — ours and theirs — is parked far upfield, OUTSIDE the carrier's own
 * goal-distance, so the branch's ONE-container loop can never find a nearer goal-side rival.
 * The only things that vary between the four fixtures are the two offsets.
 */
const offerFixture = (defenderOffset: number, carrierOffset: number): OfferFixture => {
  const m = matchOf(SEED_C, { world: W9, persist: true });
  while (m.phase !== 'playing') m.step(DT);
  const us = m.teams[0];
  const them = m.teams[1];
  const goalX = us.ownGoal().x;
  us.chasers.clear();
  us.marks.clear();
  const carrier = them.players[1];
  place(carrier, goalX + carrierOffset, 0);
  m.ball.owner = carrier;
  m.possessionSide = 1;
  m.ball.pos = { x: carrier.pos.x, y: 0 };
  m.ball.vel = { x: 0, y: 0 };
  m.ball.z = 0;
  m.ball.vz = 0;
  const d = us.players[1];
  place(d, goalX + defenderOffset, 0);
  for (const q of us.players) if (q !== d && q.role !== 'GK') place(q, goalX + 78, 20);
  for (const q of them.players) if (q !== carrier && q.role !== 'GK') place(q, goalX + 74, -20);
  decidePlayer(d, m);
  return { m, d, carrier };
};
/** the ACT, read exactly as the DF-T3 / DF-T3B realisation walkers read it */
const containWon = (f: OfferFixture): boolean => f.d.action.type === 'MarkOpponent'
  && f.d.action.targetIdx === f.carrier.index
  && (f.d.action.scores[0]?.why ?? '').startsWith('contain ');

describe('DF T3B rider — THE CONTAIN-OFFER PREDICATE, PINNED (DF-T3 §CORR item 2)', () => {
  it('⭐⭐ (i) THE ANCHORED THREE-TERM EXTRACTION — one line, three terms, each captured', () => {
    // canon VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
    // anchored match + line receipt — never first-occurrence" (home: BK-C0 §CORR item 1)
    const lines = playerBrainSource.split('\n');
    const hits = lines.map((l, i) => (l === CONTAIN_OFFER_LINE ? i + 1 : 0)).filter((n) => n > 0);
    expect(hits.length).toBe(1); // THE LINE RECEIPT — the number itself is reported, not pinned
    // TERM 1: the carrier-distance radius · TERM 2: the defensive-territory radius ·
    // TERM 3: the goal-side comparison (no literal at all — a RELATION, which is exactly
    // why it slipped the anchored-constant net and needed a fixture, #332 item 2)
    const t1 = /dC < (\d+(?:\.\d+)?) &&/.exec(CONTAIN_OFFER_LINE);
    const t2 = /carrierGoalD < (\d+(?:\.\d+)?) &&/.exec(CONTAIN_OFFER_LINE);
    const t3 = /&& (dist\(p\.pos, ownGoal\) < carrierGoalD)\) \{$/.exec(CONTAIN_OFFER_LINE);
    expect(t1).not.toBeNull();
    expect(t2).not.toBeNull();
    expect(t3).not.toBeNull();
    expect(Number(t1![1])).toBe(8);
    expect(Number(t2![1])).toBe(35);
    expect(t3![1]).toBe('dist(p.pos, ownGoal) < carrierGoalD');
    // and the three terms are the WHOLE predicate — nothing else gates the offer
    expect(CONTAIN_OFFER_LINE.split('&&').length).toBe(3);
  });

  it('⭐⭐ (ii) POSITIVE — all three terms hold and the contain candidate WINS the argmax', () => {
    // carrier 25 m from our goal (< 35), the subject 5 m off him (< 8) and goal-side (20 < 25)
    const f = offerFixture(20, 25);
    expect(containWon(f)).toBe(true);
    expect(f.d.action.scores[0].why).toContain('hold goal-side');
  });

  it('⭐⭐ FIXTURE PER TERM 1 (`dC < 8`) — 10 m off the carrier, everything else satisfied', () => {
    // goal-side (15 < 25) and in territory (25 < 35): ONLY the radius fails.
    // Neutralising `dC < 8` in src makes this picture elect contain — the fixture dies.
    const f = offerFixture(15, 25);
    expect(containWon(f)).toBe(false);
    expect(f.d.action.type).toBe('MoveToFormationSpot');
  });

  it('⭐⭐ FIXTURE PER TERM 2 (`carrierGoalD < 35`) — a deep build-up carrier, 40 m out', () => {
    // 5 m off the carrier (< 8) and goal-side (35 < 40): ONLY the territory term fails.
    // Neutralising `carrierGoalD < 35` in src makes this picture elect contain.
    const f = offerFixture(35, 40);
    expect(containWon(f)).toBe(false);
    expect(f.d.action.type).toBe('MoveToFormationSpot');
  });

  it('⭐⭐ FIXTURE PER TERM 3 (goal-side) — 5 m off the carrier but on the WRONG SIDE of him', () => {
    // in territory (25 < 35) and inside the radius (5 < 8): ONLY the goal-side relation
    // fails (30 ≥ 25). ⭐ THIS IS THE TERM the DF-T3 verifier neutralised to move the starred
    // headline ~2× with every gate green — it is now a fixture, not a promise.
    const f = offerFixture(30, 25);
    expect(containWon(f)).toBe(false);
    expect(f.d.action.type).toBe('MoveToFormationSpot');
  });

  it('⭐ THE NEGATIVES ARE NOT VACUOUS — the same body, one offset apart, flips the offer', () => {
    // the positive and the term-1 negative differ ONLY in the defender's offset (20 vs 15),
    // so "no contain" cannot be an artefact of the picture being dead.
    expect(containWon(offerFixture(20, 25))).toBe(true);
    expect(containWon(offerFixture(15, 25))).toBe(false);
    // and the ONE-container rule is still the shipped one: a nearer goal-side rival wins it
    const f = offerFixture(20, 25);
    const us = f.m.teams[0];
    const goalX = us.ownGoal().x;
    place(us.players[2], goalX + 23, 0); // 2 m off the carrier, goal-side, unassigned
    decidePlayer(f.d, f.m);
    expect(containWon(f)).toBe(false);
  });
});

describe('DF T2 — the production world is untouched', () => {
  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    expect(new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) }).dfSurface)
      .toBe(false);
  });
});
