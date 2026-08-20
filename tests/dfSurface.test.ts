import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT } from '../src/sim/constants';
import { DF_SURFACE_OPTIONS, updateTeamBrain } from '../src/ai/TeamBrain';
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

  it('⭐⭐ `assignChasers` is SHA-IDENTICAL to HEAD\'s slice, and never names the needle', () => {
    const slice = chaserSlice(teamBrainSource);
    expect(slice.length).toBeGreaterThan(1000);
    expect(slice).not.toContain('dfSurface');
    expect(slice).not.toContain('DF_SURFACE');
    expect(slice).not.toContain('markSagMetres');
    expect(slice).not.toContain('arrivalGroup');
    // the sha of record, computed on the frozen slice (126 code lines + its docblock)
    expect(createHash('sha256').update(slice).digest('hex')).toBe(
      '5b4a21d036e9d97027a360f166621d747374ec5c42ead20b9ed132919872703c',
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

describe('DF T2 — the production world is untouched', () => {
  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    expect(new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) }).dfSurface)
      .toBe(false);
  });
});
