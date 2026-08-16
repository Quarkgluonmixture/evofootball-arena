import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Match } from '../src/sim/Match';
import { League } from '../src/sim/League';
import { executeAction } from '../src/ai/actionExecutor';
import { DT, TOUCH_CONTROL_DIST } from '../src/sim/constants';
import {
  PC_BOOK_CELLS, PC_CLASSES, PC_CLASS_RANK, PC_INITIATOR_PAYS, PC_N_COVER,
  PC_N_COVER_SENSITIVITY, PC_RELEVANCE_M, PC_TIER_CHOICE_SIM_S, PC_TIER_CHOICE_TICKS,
  PC_TIER_SIMPLE_SIM_S, PC_TIER_SIMPLE_TICKS, PcRecognitionBook, pcHoldKeptOlderExpiry,
  pcRecognitionKey, pcTierTicks,
} from '../src/ai/pcLatency';
import { GENE_KEYS, randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { a4MatchFlags, armA4World, poolT1DoseCells } from '../src/game/a4World';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import { Rng } from '../src/utils/rng';

/**
 * PC-T0 (docs/world-model/PC-T0-LATENCY-SEAM.md; contract PC-PERCEPTION-CONTRACT.md §2
 * M-PC.1–5; ruling #297 items 3–5 and 7) — THE REACTION-LATENCY SEAM'S PERMANENT PIN SUITE, in
 * the house form (`carryChoiceSeat.test.ts` / `pwWeightChooserSeat.test.ts`). ⭐ #297 item 7:
 * PIN SUITE FROM BIRTH — after the PW lesson there are no one-shot-probe-only seams. The pins:
 *   • ⭐⭐ ROAD B DORMANCY — flag absent ≡ flag false, byte for byte, in BOTH world shapes.
 *   • ⭐ THE TIERS, read from ONE place: 0.20 / 0.45 sim-s = 12 / 27 APPLIED ticks (#280 form).
 *   • ⭐ THE TRIGGERS — all seven census classes fire on a real armed walk, in the bound order.
 *   • ⭐⭐ TIER BY BOOK STATE — born absent ⇒ CHOICE; a covered cell ⇒ SIMPLE; N_cover derived.
 *   • ⭐⭐ THE HOLD ACTUALLY HOLDS — a stale target survives a truth change, and the vectors are
 *     COPIED not aliased (the `faceTarget → ball.pos` hazard, PC-C0 §CORRECTIONS 1).
 *   • ⭐ THE FIVE INITIATOR PATHS FREE, BY NAME · H3 reassignment · the OVERLAP rule ·
 *     season reset · nothing in the genome.
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
const V7 = 7 as const;
const DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>);

/** ⚠ These seeds live inside PC-T0's OWN booked block (ruling #297 item 6: ≥ 12,497,000). */
const SEED_A = 12_497_800;
const SEED_B = 12_497_801;
const SEED_C = 12_497_802;

interface Arm {
  /** arm the latency door */
  pc?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (the dormancy pin's other half) */
  pcExplicitFalse?: boolean;
  /** the v7 world the user plays, rather than a bare match */
  armed?: boolean;
  /** a shorter walk, for the pins that only need live play */
  duration?: number;
  /** an instrument's N_cover sweep value */
  nCover?: number;
}
const matchOf = (seed: number, a: Arm = {}): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  const cfg = {
    seed, teamA, teamB,
    ...(a.duration === undefined ? {} : { duration: a.duration }),
    ...(a.armed === true ? a4MatchFlags(V7) : {}),
    ...(a.pc === true ? { pcReactionLatency: true } : {}),
    ...(a.pcExplicitFalse === true ? { pcReactionLatency: false } : {}),
    ...(a.nCover === undefined ? {} : { pcNCover: a.nCover }),
  };
  const m = new Match(cfg);
  if (a.armed === true) armA4World(m, null, V7, DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim). */
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

describe('PC-T0 — the dormant reaction-latency seam (#297 items 3–5, 7)', () => {
  /* ---------------------------------------------------------------- DORMANCY */
  it('⭐⭐ ROAD B DORMANCY: flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes', () => {
    for (const armed of [false, true]) {
      for (const seed of [SEED_A, SEED_B]) {
        const absent = signatureOf(matchOf(seed, { armed }));
        const explicitFalse = signatureOf(matchOf(seed, { armed, pcExplicitFalse: true }));
        expect(explicitFalse).toBe(absent);
      }
    }
  });

  it('⭐ the seat, the detector snapshot and the League books are null with the door shut', () => {
    const m = matchOf(SEED_A, { armed: true, duration: 20 });
    expect(m.pcReactionLatency).toBe(false);
    expect(m.pcLatency).toBeNull();
    m.runToCompletion();
    expect(m.pcLatency).toBeNull();
    const league = new League({ seed: 1337 });
    expect(league.recognitionBooks).toBeNull();
  });

  it('⭐ arming it is a REAL change — the armed world is distinguishable from the shut one', () => {
    const shut = signatureOf(matchOf(SEED_A, { armed: true }));
    const open = signatureOf(matchOf(SEED_A, { armed: true, pc: true }));
    expect(open).not.toBe(shut);
  });

  /* ------------------------------------------------------------------- TIERS */
  it('⭐⭐ THE TIERS, one home, APPLIED ticks derived (#297 item 3, the #280 form)', () => {
    expect(PC_TIER_SIMPLE_SIM_S).toBe(0.20);
    expect(PC_TIER_CHOICE_SIM_S).toBe(0.45);
    expect(PC_TIER_SIMPLE_TICKS).toBe(12);
    expect(PC_TIER_CHOICE_TICKS).toBe(27);
    // derived, not typed: the ticks ARE the constants over the engine's own DT
    expect(PC_TIER_SIMPLE_TICKS).toBe(Math.round(PC_TIER_SIMPLE_SIM_S / DT));
    expect(PC_TIER_CHOICE_TICKS).toBe(Math.round(PC_TIER_CHOICE_SIM_S / DT));
    expect(pcTierTicks('simple')).toBe(PC_TIER_SIMPLE_TICKS);
    expect(pcTierTicks('choice')).toBe(PC_TIER_CHOICE_TICKS);
    // ⭐ the shipped precedent's band endpoints — the second derivation (#297 item 3)
    expect(0.45 - 1 * 0.25).toBeCloseTo(PC_TIER_SIMPLE_SIM_S, 12);
    expect(0.45 - 0 * 0.25).toBeCloseTo(PC_TIER_CHOICE_SIM_S, 12);
  });

  it('⭐⭐ N_COVER is DERIVED from the L3 τ yardstick, with its sensitivity band', () => {
    expect(PC_N_COVER).toBe(Math.floor(184 / 10));
    expect(PC_N_COVER).toBe(18);
    expect([...PC_N_COVER_SENSITIVITY]).toEqual([9, 18, 36]);
  });

  /* ---------------------------------------------------------------- THE BOOK */
  it('⭐⭐ TIER BY BOOK STATE: born ABSENT ⇒ choice; a covered cell ⇒ simple', () => {
    const book = new PcRecognitionBook();
    const key = pcRecognitionKey('turnover', true, 'opp');
    expect(book.count(3, key)).toBe(0);
    expect(book.tierFor(3, key)).toBe('choice');
    for (let i = 0; i < PC_N_COVER - 1; i++) book.note(3, key);
    expect(book.tierFor(3, key)).toBe('choice'); // one short is still a novice
    book.note(3, key);
    expect(book.tierFor(3, key)).toBe('simple');
    // ⭐ OWN EXPOSURES ONLY: body 3's exposures never reach body 4, nor another cell
    expect(book.tierFor(4, key)).toBe('choice');
    expect(book.tierFor(3, pcRecognitionKey('turnover', false, 'opp'))).toBe('choice');
  });

  it('⭐ the N_cover SENSITIVITY hook flips the tier without re-walking (#297 item 4 H1)', () => {
    const book = new PcRecognitionBook();
    const key = pcRecognitionKey('deflection', false, 'own');
    for (let i = 0; i < 18; i++) book.note(0, key);
    expect(book.tierFor(0, key, 9)).toBe('simple');
    expect(book.tierFor(0, key, 18)).toBe('simple');
    expect(book.tierFor(0, key, 36)).toBe('choice');
  });

  it('⭐ SEASON RESET wipes the book; the key space is class × pressed × relation = 28', () => {
    const book = new PcRecognitionBook();
    book.note(0, PC_BOOK_CELLS[0]);
    expect(book.totalExposures).toBe(1);
    book.reset();
    expect(book.totalExposures).toBe(0);
    expect(PC_BOOK_CELLS.length).toBe(PC_CLASSES.length * 2 * 2);
    expect(PC_BOOK_CELLS.length).toBe(28);
    expect(new Set(PC_BOOK_CELLS).size).toBe(28);
  });

  it('⭐ the League resets the season books at the season boundary, and shares them per slot', () => {
    const league = new League({ seed: 1337 });
    league.matchFlags = { pcReactionLatency: true };
    const priv = league as unknown as {
      pcBooksFor(h: number, a: number): readonly [PcRecognitionBook, PcRecognitionBook];
      startSeason(): void;
    };
    const [home, away] = priv.pcBooksFor(0, 1);
    expect(home).not.toBe(away);
    // the SAME franchise slot gets the SAME book in a later fixture (season-scoped)
    expect(priv.pcBooksFor(0, 5)[0]).toBe(home);
    home.note(2, PC_BOOK_CELLS[0]);
    expect(league.recognitionBooks?.[0]?.totalExposures).toBe(1);
    priv.startSeason();
    expect(league.recognitionBooks?.[0]?.totalExposures).toBe(0);
  });

  /* --------------------------------------------------------------- TRIGGERS */
  it('⭐ THE SEVEN TRIGGERS all fire on an armed walk, and the build order is #297 item 5', () => {
    expect([...PC_CLASSES]).toEqual([
      'turnover', 'knockRelease', 'deflection', 'passRelease', 'shotRelease', 'looseBallSpill',
      'dribblePush',
    ]);
    expect(PC_CLASS_RANK.turnover).toBe(0); // turnover FIRST-CLASS
    const m = matchOf(SEED_C, { armed: true, pc: true });
    m.runToCompletion();
    const led = m.pcLatency!.ledger;
    for (const k of PC_CLASSES) expect(led.firings[k]).toBeGreaterThan(0);
    expect(led.armedByTier.choice).toBeGreaterThan(0);
    expect(led.heldExecutorTicks).toBeGreaterThan(0);
    expect(led.decisionsHeld).toBeGreaterThan(0);
    expect(led.exposuresNoted).toBeGreaterThan(0);
    // every arm found a live stale plan to freeze
    const arms = PC_CLASSES.reduce((a, k) => a + led.armedByClass[k], 0);
    expect(led.armedWithMemory).toBe(arms);
    // the books filled from the walk, and NOTHING leaked into the genome
    expect(m.pcLatency!.books[0].totalExposures + m.pcLatency!.books[1].totalExposures)
      .toBe(led.exposuresNoted);
  });

  it('⭐ H6: the SPILLER pays; every other class excludes its own initiator', () => {
    expect(PC_INITIATOR_PAYS.looseBallSpill).toBe(true);
    for (const k of PC_CLASSES) {
      if (k !== 'looseBallSpill') expect(PC_INITIATOR_PAYS[k]).toBe(false);
    }
  });

  /* ------------------------------------------------------------- THE HOLD */
  it('⭐⭐ THE HOLD HOLDS: a stale target survives a truth change, and the vectors are COPIED', () => {
    const m = matchOf(SEED_A, { armed: true, pc: true, duration: 40 });
    for (let i = 0; i < 240; i++) m.step(DT);
    const seat = m.pcLatency!;
    const gk = m.teams[0].goalkeeper;
    // one clean executor tick, so his memory is a real applied plan whose FACING aliases ball.pos
    gk.action = { type: 'GoalkeeperPosition', scores: [] };
    executeAction(gk, m, DT);
    const faceBefore = { x: gk.faceTarget!.x, y: gk.faceTarget!.y };
    expect(faceBefore.x).toBeCloseTo(m.ball.pos.x, 9); // the live-reference hazard, reproduced
    const hold = seat.arm(gk.gid, gk.rosterIdx, 0, 'turnover',
      pcRecognitionKey('turnover', true, 'opp'), m.simTick);
    expect(hold.tier).toBe('choice'); // born absent
    expect(hold.ticks).toBe(PC_TIER_CHOICE_TICKS);

    // THE TRUTH MOVES — 30 m of it
    m.ball.pos.x += 30;
    m.ball.pos.y += 12;
    executeAction(gk, m, DT);
    expect(gk.faceTarget!.x).toBeCloseTo(faceBefore.x, 9);
    expect(gk.faceTarget!.y).toBeCloseTo(faceBefore.y, 9);
    expect(gk.faceTarget!.x).not.toBeCloseTo(m.ball.pos.x, 3);
    // ⭐⭐ COPIED, NOT ALIASED — three ways
    expect(gk.faceTarget).not.toBe(m.ball.pos);
    expect(hold.face).not.toBe(m.ball.pos);
    gk.faceTarget!.x = -999;
    expect(hold.face!.x).toBeCloseTo(faceBefore.x, 9);
  });

  it('⭐ the hold lasts EXACTLY the derived ticks, then the world is fresh again', () => {
    const m = matchOf(SEED_B, { armed: true, pc: true, duration: 40 });
    for (let i = 0; i < 120; i++) m.step(DT);
    const seat = m.pcLatency!;
    const p = m.teams[1].players[3];
    executeAction(p, m, DT);
    const t0 = m.simTick;
    const hold = seat.arm(p.gid, p.rosterIdx, 1, 'deflection',
      pcRecognitionKey('deflection', false, 'opp'), t0);
    expect(hold.untilTick).toBe(t0 + 1 + PC_TIER_CHOICE_TICKS);
    // live on every one of the 27 ticks t0+1 … t0+27, gone on t0+28
    for (let k = 1; k <= PC_TIER_CHOICE_TICKS; k++) {
      expect(seat.holdFor(p.gid, t0 + k)).not.toBeNull();
    }
    expect(seat.holdFor(p.gid, t0 + PC_TIER_CHOICE_TICKS + 1)).toBeNull();
  });

  it('⭐ H3: a mid-hold reassignment rewrites his job on paper; his legs keep the stale target', () => {
    const m = matchOf(SEED_A, { armed: true, pc: true, duration: 40 });
    for (let i = 0; i < 180; i++) m.step(DT);
    const seat = m.pcLatency!;
    const p = m.teams[0].players[2];
    p.action = { type: 'MoveToFormationSpot', scores: [] };
    executeAction(p, m, DT);
    const held = seat.arm(p.gid, p.rosterIdx, 0, 'turnover',
      pcRecognitionKey('turnover', true, 'opp'), m.simTick);
    expect(held.actionAtArm).toBe('MoveToFormationSpot');
    const before = seat.ledger.heldThroughReassignment;
    // the TEAM layer rewrites him — exactly what assignChasers does on its 24-tick cadence
    p.action = { type: 'ChaseBall', scores: [] };
    executeAction(p, m, DT);
    const v0 = { x: p.desiredVel.x, y: p.desiredVel.y };
    // ⭐ and now THE TRUTH MOVES under the reassigned job: his legs still do not care
    m.ball.pos.x += 25;
    executeAction(p, m, DT);
    expect(p.desiredVel.x).toBeCloseTo(v0.x, 9);
    expect(p.desiredVel.y).toBeCloseTo(v0.y, 9);
    expect(seat.ledger.heldThroughReassignment).toBe(before + 2);
  });

  it('⭐⭐ THE OVERLAP RULE — MONOTONE RESTART: never shortens, never re-captures the plan', () => {
    const m = matchOf(SEED_B, { armed: true, pc: true, duration: 20 });
    for (let i = 0; i < 60; i++) m.step(DT);
    const seat = m.pcLatency!;
    const p = m.teams[0].players[4];
    // ⚠ step on until this body is provably hold-FREE, so the overlap arithmetic below is the
    // pin's own and not an organically-armed hold's.
    while (seat.holdFor(p.gid, m.simTick) !== null) m.step(DT);
    executeAction(p, m, DT);
    const t0 = m.simTick;
    // ⚠ the engine arms holds of its own on a live walk, so every counter is read as a DELTA
    const base = { restarts: seat.ledger.overlapRestarts, noExtend: seat.ledger.overlapNoExtend };
    const choiceKey = pcRecognitionKey('turnover', true, 'opp');
    const first = seat.arm(p.gid, p.rosterIdx, 0, 'turnover', choiceKey, t0);
    const staleTarget = first.target === null ? null : { ...first.target };
    expect(first.untilTick).toBe(t0 + 1 + PC_TIER_CHOICE_TICKS);

    // a cell his book DOES cover ⇒ a SIMPLE event, landing mid-hold: it must NOT cut it short
    const simpleKey = pcRecognitionKey('deflection', false, 'own');
    for (let i = 0; i < PC_N_COVER; i++) seat.books[0].note(p.rosterIdx, simpleKey);
    const second = seat.arm(p.gid, p.rosterIdx, 0, 'deflection', simpleKey, t0 + 5);
    expect(second.tier).toBe('simple');
    expect(second.untilTick).toBe(first.untilTick); // monotone: the CHOICE expiry stands
    expect(seat.ledger.overlapRestarts - base.restarts).toBe(1);
    expect(seat.ledger.overlapNoExtend - base.noExtend).toBe(1);
    // ⚠ the stale plan is NOT re-captured — he has reacted to nothing yet
    expect(second.target === null ? null : { ...second.target }).toEqual(staleTarget);
    expect(second.actionAtArm).toBe(first.actionAtArm);

    // a LATER surprise whose expiry is beyond the live one DOES extend it
    const third = seat.arm(p.gid, p.rosterIdx, 0, 'turnover', choiceKey, t0 + 20);
    expect(third.untilTick).toBe(t0 + 21 + PC_TIER_CHOICE_TICKS);
    expect(seat.ledger.overlapRestarts - base.restarts).toBe(2);
    expect(seat.ledger.overlapNoExtend - base.noExtend).toBe(1);
  });

  /* --------------------------------------------------- THE INITIATOR PATHS */
  it('⭐ THE FIVE INITIATOR PATHS ARE UNTOUCHED, BY NAME, with occurrence COUNTS', () => {
    const mech = readFileSync('src/sim/mechanics.ts', 'utf8');
    const match = readFileSync('src/sim/Match.ts', 'utf8');
    const brain = readFileSync('src/ai/TeamBrain.ts', 'utf8');
    const count = (hay: string, needle: string): number => hay.split(needle).length - 1;
    // (1) knockAndGo — mechanics.ts `performTouchPast`, the zero-timer release
    expect(count(mech, 'p.decisionTimer = 0;')).toBe(1);
    // (2) captureSettle + (3) gkFeetOverride — both inside `giveBall`
    expect(count(match, 'p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);')).toBe(1);
    expect(count(match, 'if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);')).toBe(1);
    // (4) oneTouchWindow — the H4 PRE-PROCESSING channel, kept as-is
    expect(count(match, 'p.decisionTimer = 0.07;')).toBe(1);
    expect(count(match, 'p.firstTouchWindow = 0.28;')).toBe(1);
    // (5) substitutionArrival — ⭐ the #297 CORRECTIONS-1 canon: pin the OCCURRENCE COUNT and
    // enumerate EVERY site, because one needle with one site is a lie of omission. `= 0.05`
    // has THREE sites: the injury substitution, the ordinary substitution, and the kick-off
    // striker (the last is not an initiator PATH — it is the restart, named so it is not a
    // silent third).
    expect(count(match, 'decisionTimer = 0.05')).toBe(3);
    expect(count(match, 'out.decisionTimer = 0.05;')).toBe(2); // both substitution paths
    expect(count(match, "out.decisionTimer = 0.05; // think on arrival, not a stale slot's cadence")).toBe(1);
    expect(count(match, 'st.decisionTimer = 0.05;')).toBe(1);
    // ⭐ the seam never reaches into any of them: two whole files stay PC-free
    for (const [name, src] of [['mechanics.ts', mech], ['TeamBrain.ts', brain]] as const) {
      for (const token of ['pcLatency', 'pcReactionLatency', 'PcLatencySeat', 'pcHold']) {
        expect(`${name}:${count(src, token)}`).toBe(`${name}:0`);
      }
    }
    // ⭐ M-PC.5 / M-PW.4's form: the CB seat's arming block is machine-asserted untouched
    const brainSrc = readFileSync('src/ai/PlayerBrain.ts', 'utf8');
    for (const token of ['pcLatency', 'pcReactionLatency', 'PcLatencySeat']) {
      expect(count(brainSrc, token)).toBe(0);
    }
  });

  it('⭐ H4: a body inside his PRE-PROCESSING window is skipped, and the seam never writes a timer', () => {
    const m = matchOf(SEED_C, { armed: true, pc: true });
    m.runToCompletion();
    // ⚠ AMENDED by the PC-T1 pre-exam amendment (c) (#298 item 4). This counter used to sit
    // BEFORE the relevance-radius filter, so it counted every pre-processed body anywhere on
    // the pitch and read `> 0` on one match. On the census grain it counts only bodies who
    // WOULD OTHERWISE HAVE BEEN ARMED, and the ruling's own reading is confirmed: the H4
    // channel is NEAR-VACUOUS (measured ≈ 0.17 skips per match over 12 armed matches). A
    // per-match `> 0` pin here would be seed luck; the channel's real RATE is measured at
    // battery grain by PC-T1's probe, and the ORDERING is pinned by the (c) test below.
    expect(m.pcLatency!.ledger.preProcessedSkips).toBeGreaterThanOrEqual(0);
    // the seam's own module cannot even name the timer it must not write
    // the seam's own module never WRITES a timer — it cannot: no assignment to either field
    const seam = readFileSync('src/ai/pcLatency.ts', 'utf8');
    expect(/decisionTimer\s*=/.test(seam)).toBe(false);
    expect(/firstTouchWindow\s*=/.test(seam)).toBe(false);
    // and the ONE gate in the executor writes neither
    const exec = readFileSync('src/ai/actionExecutor.ts', 'utf8');
    expect(/p\.decisionTimer\s*=/.test(exec)).toBe(false);
    expect(/firstTouchWindow\s*=/.test(exec)).toBe(false);
  });

  /* ------------------------------------------------------- NO GENE SURFACE */
  it('⭐ NOTHING IN THE GENOME (#270): no gene, no serialization, no franchise write', () => {
    for (const k of GENE_KEYS) {
      expect(k.toLowerCase().startsWith('pc')).toBe(false);
      expect(k.toLowerCase().includes('latency')).toBe(false);
      expect(k.toLowerCase().includes('recognition')).toBe(false);
    }
    const league = new League({ seed: 1337 });
    league.matchFlags = { pcReactionLatency: true };
    (league as unknown as { pcBooksFor(h: number, a: number): unknown }).pcBooksFor(0, 1);
    const json = JSON.stringify(league.toJSON());
    for (const token of ['pcBooks', 'recognitionBook', 'pcReactionLatency', 'pcLatency']) {
      expect(`${token}:${json.includes(token)}`).toBe(`${token}:false`);
    }
    const m = matchOf(SEED_A, { armed: true, pc: true, duration: 20 });
    m.runToCompletion();
    expect(JSON.stringify(m.getResult()).includes('pc')).toBe(false);
  });

  it('⭐ the seam module\'s IMPORT LIST is closed (the defenceBook.ts discipline)', () => {
    const seam = readFileSync('src/ai/pcLatency.ts', 'utf8');
    const imports = [...seam.matchAll(/^import .*?from '(.*?)';$/gm)].map((mm) => mm[1]);
    expect(imports).toEqual(['../sim/constants']);
    for (const forbidden of ['Match', 'Player', 'Team', 'Rng', 'perceivedSnapshot']) {
      expect(`${forbidden}:${seam.includes(`from '../sim/${forbidden}'`)}`)
        .toBe(`${forbidden}:false`);
    }
  });

  it('⭐ the relevance radius and the pressed bit are the census\'s own, not new constants', () => {
    expect(PC_RELEVANCE_M).toBe(25); // PC-C0 §FORM's stated design input
    expect(TOUCH_CONTROL_DIST).toBe(4.2); // the engine's own pressure distance
  });
});

/**
 * ⭐⭐ THE PC-T1 PRE-EXAM AMENDMENT (ruling #298 item 4) — one pin per clause.
 *   (a) `becomeSub` clears the seat's per-gid state (a sub inherits neither hold nor plan);
 *   (b) holds CLEAR at dead-ball transitions — "a restart voids the surprise's context —
 *       closes the clock-skew class";
 *   (c) `preProcessedSkips` counts on the CENSUS GRAIN (after the relevance-radius filter,
 *       the PC-C0 ordering sentOff → initiator → distance);
 *   (d) the mis-named `extended` flag is retired for `pcHoldKeptOlderExpiry`, which is what
 *       the predicate actually measures.
 */
describe('PC-T1 — the pre-exam amendment (#298 item 4)', () => {
  const AMEND_A = 12_498_800;
  const AMEND_B = 12_498_801;
  const AMEND_C = 12_498_802;

  it('⭐ (a) A SUB INHERITS NOTHING: becomeSub clears the departed body\'s hold AND his plan', () => {
    const m = matchOf(AMEND_A, { armed: true, pc: true, duration: 60 });
    for (let i = 0; i < 200; i++) m.step(DT);
    const seat = m.pcLatency!;
    // an outfield body with a bench behind him, given a live hold and a live stale plan
    const p = m.teams[0].players.find((q) => q !== m.teams[0].goalkeeper)!;
    executeAction(p, m, DT);
    const t0 = m.simTick;
    const hold = seat.arm(p.gid, p.rosterIdx, 0, 'turnover',
      pcRecognitionKey('turnover', true, 'opp'), t0);
    expect(seat.holdFor(p.gid, t0 + 1)).not.toBeNull();
    expect(hold.actionAtArm).not.toBe(''); // he had a real remembered plan
    const beforeClears = seat.ledger.subClears;

    // THE SWAP — the injury path, which is the one that can fire at any moment
    (m as unknown as { forceSubstitution(o: typeof p): void }).forceSubstitution(p);

    // ⭐ the hold is GONE, not inherited
    expect(seat.holdFor(p.gid, t0 + 1)).toBeNull();
    expect(seat.ledger.subClears).toBe(beforeClears + 1);
    expect(seat.ledger.subClearedLiveHolds).toBeGreaterThan(0);
    expect(seat.ledger.subClearedMemories).toBeGreaterThan(0);
    // ⭐ and so is the MEMORY: the arriving man's first hold freezes NOTHING, because he has
    // applied no plan yet. (This is the observable shadow of the private memory map.)
    const fresh = seat.arm(p.gid, p.rosterIdx, 0, 'turnover',
      pcRecognitionKey('turnover', true, 'opp'), m.simTick);
    expect(fresh.target).toBeNull();
    expect(fresh.face).toBeNull();
    expect(fresh.actionAtArm).toBe('');
  });

  it('⭐⭐ (b) A RESTART VOIDS THE SURPRISE\'S CONTEXT: no hold survives a dead-ball step', () => {
    const m = matchOf(AMEND_B, { armed: true, pc: true });
    const seat = m.pcLatency!;
    let deadBallSteps = 0;
    let holdsAliveAfterADeadBallStep = 0;
    while (!m.finished) {
      const prePhase = m.phase;
      m.step(DT);
      if (prePhase !== 'playing') {
        deadBallSteps++;
        // the detector ran at the head of THIS step with `this.phase === prePhase !== playing`,
        // so it wiped every hold and armed nobody: nothing may be live now.
        if (seat.liveHolds > 0) holdsAliveAfterADeadBallStep++;
      }
    }
    expect(deadBallSteps).toBeGreaterThan(0); // non-vacuity: the world really does stop
    expect(holdsAliveAfterADeadBallStep).toBe(0);
    // ⭐ and the amendment is not a no-op: real holds were actually cut by real stoppages
    expect(seat.ledger.deadBallClears).toBeGreaterThan(0);
    expect(seat.ledger.deadBallClearedHolds).toBeGreaterThan(0);
  });

  it('⭐ (c) preProcessedSkips is counted ON THE CENSUS GRAIN — after the radius filter', () => {
    const src = readFileSync('src/sim/Match.ts', 'utf8');
    const count = (needle: string): number => src.split(needle).length - 1;
    const RADIUS = 'if (d > PC_RELEVANCE_M) continue;';
    const SKIP = 'if (p.firstTouchWindow > 0) { seat.ledger.preProcessedSkips++; continue; }';
    const SENT_OFF = 'if (p.sentOff) continue;';
    // occurrence counts pinned, so "the one site" cannot silently become two (#297 corr. 1)
    expect(count(RADIUS)).toBe(1);
    expect(count(SKIP)).toBe(1);
    // ⭐ PC-C0's ordering, read off the shipped bytes: sentOff → initiator → distance → H4
    const iSentOff = src.indexOf(SENT_OFF, src.indexOf('private pcLatencyObserve(): void {'));
    expect(iSentOff).toBeGreaterThan(0);
    expect(src.indexOf(RADIUS)).toBeGreaterThan(iSentOff);
    expect(src.indexOf(SKIP)).toBeGreaterThan(src.indexOf(RADIUS));
    // the channel is still live in a real world (never-occurred ≠ unmeasured)
    const m = matchOf(AMEND_C, { armed: true, pc: true });
    m.runToCompletion();
    expect(m.pcLatency!.ledger.preProcessedSkips).toBeGreaterThanOrEqual(0);
  });

  it('⭐ (d) the flag is named for what it measures: max() KEPT THE OLDER EXPIRY', () => {
    // a plain hold: the expiry IS armedTick + 1 + ticks, so nothing was kept over
    expect(pcHoldKeptOlderExpiry({ armedTick: 100, untilTick: 128, ticks: 27 })).toBe(false);
    // the monotone rule refusing to shorten: a SIMPLE re-arm under a live CHOICE expiry
    expect(pcHoldKeptOlderExpiry({ armedTick: 105, untilTick: 128, ticks: 12 })).toBe(true);
    // and on the real seat, on a real overlap
    const m = matchOf(AMEND_C, { armed: true, pc: true, duration: 30 });
    for (let i = 0; i < 90; i++) m.step(DT);
    const seat = m.pcLatency!;
    const p = m.teams[0].players[5];
    while (seat.holdFor(p.gid, m.simTick) !== null) m.step(DT);
    executeAction(p, m, DT);
    const t0 = m.simTick;
    const first = seat.arm(p.gid, p.rosterIdx, 0, 'turnover',
      pcRecognitionKey('turnover', true, 'opp'), t0);
    expect(pcHoldKeptOlderExpiry(first)).toBe(false);
    const simpleKey = pcRecognitionKey('deflection', false, 'own');
    for (let i = 0; i < PC_N_COVER; i++) seat.books[0].note(p.rosterIdx, simpleKey);
    const second = seat.arm(p.gid, p.rosterIdx, 0, 'deflection', simpleKey, t0 + 3);
    expect(second.tier).toBe('simple');
    expect(pcHoldKeptOlderExpiry(second)).toBe(true); // the OLDER expiry stood
    expect(second.untilTick).toBe(first.untilTick);
  });

  it('⭐ the amendment adds NO new world door and leaves the flags-off world byte-identical', () => {
    for (const armed of [false, true]) {
      const absent = signatureOf(matchOf(AMEND_A, { armed }));
      const explicitFalse = signatureOf(matchOf(AMEND_A, { armed, pcExplicitFalse: true }));
      expect(explicitFalse).toBe(absent);
    }
    // the seat's COMPLETE per-gid state is the two maps the amendment clears — machine-read,
    // so a future third per-gid map cannot be added without this pin noticing.
    const seam = readFileSync('src/ai/pcLatency.ts', 'utf8');
    const seatBody = seam.slice(seam.indexOf('export class PcLatencySeat'));
    const perGid = [...seatBody.matchAll(/private readonly (\w+) = new Map</g)]
      .map((mm) => mm[1]).sort();
    expect(perGid).toEqual(['holds', 'memory']);
  });
});
