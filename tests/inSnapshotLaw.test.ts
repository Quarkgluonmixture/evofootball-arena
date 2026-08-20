import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { League } from '../src/sim/League';
import { Match } from '../src/sim/Match';
import { DT, CONTACT_BLIND_PEN } from '../src/sim/constants';
import { randomGenome } from '../src/evolution/genome';
import { randomSquad } from '../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../src/sim/types';
import {
  a4MatchFlags, armA4World, poolPcDoseTable, poolT1DoseCells,
} from '../src/game/a4World';
import { Rng } from '../src/utils/rng';
import type { Player } from '../src/sim/Player';
import {
  IN_FIELD_MISALIGN_MAX, buildCarrierSnapshotView, createInSnapshotLedger, inFieldDotMin,
  snapshotTeamView, type InSnapshotField, type InSnapshotStore,
} from '../src/ai/inSnapshotView';

/**
 * IN T0 — THE SNAPSHOT LAW AT THE CARRIER'S CHOOSER GATEWAY
 * (docs/world-model/IN-T0-SNAPSHOT-LAW.md; contract IN-SNAPSHOT-CONTRACT.md §2
 * M-IN.1/M-IN.3/M-IN.4; ruling #324 item 4) — THE SEAM'S PERMANENT PIN SUITE, in the
 * house form (`dfAssignPersist.test.ts` / `bkContactLaw.test.ts`).
 * ⭐ CANON "pin suites from birth" (home: ruling #297 item 7): no one-shot-probe-only seams.
 *
 * The pins:
 *   • ⭐⭐ ROAD B DORMANCY — flag ABSENT ≡ flag FALSE, byte for byte, BOTH world shapes ×
 *     2 seeds (pooled digest), and the ledger stays at zero when the door is shut.
 *   • ⭐⭐ THE FIELD LAW — a body BEHIND the shoulder line reads STALE (constructed
 *     fixtures at both fields, plus the in-sim integration receipt).
 *   • ⭐⭐ THE REFRESH LAW — a body INSIDE the field reads TRUTH, and the store is written.
 *   • ⭐⭐ THE COLD-START RULE — a body never yet resolved reads TRUTH exactly once.
 *   • ⭐⭐ THE F2/F4 PARAMETERISATION — both ceilings derived from the engine's own algebra
 *     by ANCHORED EXTRACTION (named line text, never a re-typed literal), and the F4-only
 *     band is proven to be a band (truth at F4, stale at F2, same fixture).
 *   • ⭐⭐ PHYSICS STAYS TRUTH (M-IN.1) — the three resolution sites are present verbatim,
 *     no `perform*`/executor/marking/physics file names the needle, and a full armed walk
 *     never hands a VIEW body to an action.
 *   • ⭐⭐ NO SERIALIZATION — the store and the ledger are per-match transient; `League`,
 *     `cloneState`, `Team` and the render adapter never name them (the DF-T0 precedent).
 *   • ⭐⭐ COMPOSITION SEMANTICS — the {inSnapshotLaw} power set over the world-9 +
 *     dfAssignPersist stack; no refusal.
 *   • ⭐⭐ THE SEAM MAP — occurrence COUNTS per needle, PREFIX stated (canon: PC-C0 §CORR
 *     item 1).
 *   • ⭐ NO LOOK, NO NEW KNOBS (M-IN.3) — the module spends no time and names no attr/gene.
 */

/** The production fingerprint of record (#305 item 1) — this seam may not move it. */
const FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⚠ These seeds live inside IN-T0's OWN booked block (ruling #324 item 4: 12,511,000–999). */
const SEED_A = 12_511_800;
const SEED_B = 12_511_801;
const SEED_C = 12_511_802;

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
  /** arm the snapshot law */
  in?: boolean;
  /** pass the door EXPLICITLY as false rather than omitting it (dormancy's other half) */
  inExplicitFalse?: boolean;
  /** which vision field the law reads with (the seam's ONE parameter) */
  field?: InSnapshotField;
  /** arm the DF-T0 door too (the composition stack) */
  df?: boolean;
  /** which armed world shape to build (8 = the shipped play world, 9 = the body-honest one) */
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
    ...(a.in === true ? { inSnapshotLaw: true } : {}),
    ...(a.inExplicitFalse === true ? { inSnapshotLaw: false } : {}),
    ...(a.field === undefined ? {} : { inSnapshotField: a.field }),
    ...(a.df === true ? { dfAssignPersist: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (a.world !== undefined) armA4World(m, null, a.world, L3_DOSE, PC_DOSE);
  return m;
};

/** The house world-identity signature (PW-T0b's, verbatim via PC-T0, BK-T0/T1 and DF-T0). */
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
const viewSource = src('ai/inSnapshotView.ts');
const count = (hay: string, needle: RegExp): number => (hay.match(needle) ?? []).length;
const linesOf = (hay: string, line: string): number =>
  hay.split('\n').filter((l) => l === line).length;

/* ========================================================================== */
/* THE CONSTRUCTED PERCEPTION FIXTURE                                         */
/* ========================================================================== */
/**
 * A hand-placed reader with a KNOWN heading and one other body placed at a KNOWN angle,
 * driven through `buildCarrierSnapshotView` directly (never through physics), so the only
 * thing moving between resolutions is the body's position and the reader's heading. This
 * is the smallest fixture that can prove the field law, and it reads the law's OUTPUT
 * (the body handed back) rather than a proxy.
 */
interface Fix {
  reader: Player;
  other: Player;
  mates: Player[];
  opps: Player[];
  store: InSnapshotStore;
  ledger: ReturnType<typeof createInSnapshotLedger>;
  /** resolve the opposition body ONCE at this tick, and hand back what the chooser sees */
  see(tick: number, field?: InSnapshotField): Player;
}
const fix = (seed: number): Fix => {
  const m = matchOf(seed);
  while (m.phase !== 'playing') m.step(DT);
  const reader = m.teams[0].players[1];
  const other = m.teams[1].players[2];
  reader.pos = { x: 0, y: 0 };
  reader.vel = { x: 0, y: 0 };
  reader.heading = { x: 1, y: 0 }; // facing +x
  const mates = [reader];
  const opps = [other];
  const store: InSnapshotStore = new Map();
  const ledger = createInSnapshotLedger();
  return {
    reader,
    other,
    mates,
    opps,
    store,
    ledger,
    see: (tick: number, field: InSnapshotField = F2): Player =>
      buildCarrierSnapshotView(reader, mates, opps, store, tick, field, ledger).opps[0],
  };
};

describe('IN T0 — the snapshot law is dormant (Road B)', () => {
  it('⭐ default-off: inSnapshotLaw false everywhere, and absent from every shipped world', () => {
    const bare = new Match({ seed: 7, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.inSnapshotLaw).toBe(false);
    const league = new League({ seed: 20260820 });
    const live = league.createMatch(league.nextFixture()!);
    expect(live.inSnapshotLaw).toBe(false);
    // the shipped play-test worlds do NOT arm it (Road B: nothing ships)
    for (const w of [W8, W9] as const) {
      expect((a4MatchFlags(w) as Record<string, unknown>).inSnapshotLaw).toBeUndefined();
      expect((a4MatchFlags(w) as Record<string, unknown>).inSnapshotField).toBeUndefined();
    }
    // …and the entry layer does not NAME it at all
    expect(src('game/a4World.ts')).not.toContain('inSnapshot');
  });

  it('⭐⭐ ROAD B DORMANCY: flag ABSENT ≡ flag FALSE, byte for byte, in both world shapes', () => {
    const digest = createHash('sha256');
    for (const world of [W8, W9] as const) {
      for (const seed of [SEED_A, SEED_B]) {
        const absent = signatureOf(matchOf(seed, { world }));
        const explicitFalse = signatureOf(matchOf(seed, { world, inExplicitFalse: true }));
        expect(explicitFalse).toBe(absent);
        // …and the FIELD parameter is inert while the law is shut (it must not be a door)
        const withField = signatureOf(matchOf(seed, { world, field: F4 }));
        expect(withField).toBe(absent);
        digest.update(absent);
      }
    }
    // the POOLED digest (the house idiom): one value the stage doc can quote
    expect(digest.digest('hex')).toMatch(/^[0-9a-f]{64}$/);
  });

  it('⭐⭐ THE LEDGER AND THE STORE STAY EMPTY when the door is shut — pure bookkeeping', () => {
    const m = matchOf(SEED_A, { world: W9, duration: 60 });
    while (!m.finished) m.step(DT);
    expect(m.inSnapshotStore.size).toBe(0);
    for (const v of Object.values(m.inSnapshotLedger)) expect(v).toBe(0);
  });

  it('⭐ arming it is a REAL change — both fields, both world shapes', () => {
    for (const world of [W8, W9] as const) {
      const shut = signatureOf(matchOf(SEED_A, { world }));
      for (const field of [F2, F4] as const) {
        expect(signatureOf(matchOf(SEED_A, { world, in: true, field }))).not.toBe(shut);
      }
    }
  });

  it('⭐⭐ AND THE TWO FIELDS ARE DIFFERENT WORLDS — the parameter is live', () => {
    expect(signatureOf(matchOf(SEED_B, { world: W9, in: true, field: F2 })))
      .not.toBe(signatureOf(matchOf(SEED_B, { world: W9, in: true, field: F4 })));
  });
});

describe('IN T0 §THE FIELD LAW — a body behind the shoulder line reads STALE', () => {
  it('⭐⭐ THE LAW ITSELF: seen at A, turn away, he moves to B — the chooser still reads A', () => {
    for (const seed of [SEED_A, SEED_B, SEED_C]) {
      const f = fix(seed);
      // tick 0 — dead ahead (dot = +1): IN FIELD at every field, so he is SEEN at A
      f.other.pos = { x: 10, y: 0 };
      f.other.vel = { x: 1, y: 0 };
      expect(f.see(0)).toBe(f.other); // truth, by identity
      // the reader turns his back; the body moves to B
      f.reader.heading = { x: -1, y: 0 };
      f.other.pos = { x: 14, y: 3 };
      f.other.vel = { x: 2, y: 2 };
      const seen = f.see(9);
      // ⭐ THE STALE READ: position and velocity are A's, not B's
      expect(seen).not.toBe(f.other);
      expect(seen.pos).toEqual({ x: 10, y: 0 });
      expect(seen.vel).toEqual({ x: 1, y: 0 });
      // …and NOTHING ELSE about the body is affected (the prototype-delegating view)
      expect(seen.gid).toBe(f.other.gid);
      expect(seen.index).toBe(f.other.index);
      expect(seen.role).toBe(f.other.role);
      expect(seen.attrs).toBe(f.other.attrs);
      expect(seen.sentOff).toBe(f.other.sentOff);
      // the STALENESS AGE is booked in TICKS, per the field's own name
      expect(f.ledger.readsStale).toBe(1);
      expect(f.ledger.staleAgeTickSum).toBe(9);
      expect(f.ledger.staleAgeMaxTicks).toBe(9);
    }
  });

  it('⭐⭐ THE REFRESH LAW: back in field ⇒ TRUTH, and the store is rewritten', () => {
    const f = fix(SEED_A);
    f.other.pos = { x: 10, y: 0 };
    f.see(0);
    f.reader.heading = { x: -1, y: 0 };
    f.other.pos = { x: 14, y: 3 };
    expect(f.see(5).pos).toEqual({ x: 10, y: 0 }); // stale
    // he turns back round: the very same decision refreshes to truth
    f.reader.heading = { x: 1, y: 0 };
    expect(f.see(6)).toBe(f.other);
    expect(f.ledger.readsInField).toBe(2);
    // …and the store now carries B, so a LATER blind read is stale at B, not at A
    f.reader.heading = { x: -1, y: 0 };
    f.other.pos = { x: 20, y: 9 };
    expect(f.see(8).pos).toEqual({ x: 14, y: 3 });
    expect(f.ledger.staleAgeMaxTicks).toBe(5);
  });

  it('⭐⭐ THE COLD-START RULE: a body never yet resolved reads TRUTH, exactly once', () => {
    const f = fix(SEED_B);
    // his very first resolution is from BEHIND the shoulder — and it is TRUTH
    f.reader.heading = { x: -1, y: 0 };
    f.other.pos = { x: 10, y: 0 };
    expect(f.see(3)).toBe(f.other);
    expect(f.ledger.readsColdStart).toBe(1);
    expect(f.ledger.readsStale).toBe(0);
    // and it ages from there: the SECOND blind read is stale at the cold-start position
    f.other.pos = { x: 25, y: 25 };
    const seen = f.see(11);
    expect(seen).not.toBe(f.other);
    expect(seen.pos).toEqual({ x: 10, y: 0 });
    expect(f.ledger.readsColdStart).toBe(1); // exactly once
    expect(f.ledger.staleAgeTickSum).toBe(8); // 11 − 3
  });

  it('⭐ THE READER IS HIS OWN TRUTH OBJECT, and a sent-off body is never staled', () => {
    const f = fix(SEED_C);
    f.reader.heading = { x: -1, y: 0 };
    const view = buildCarrierSnapshotView(
      f.reader, f.mates, f.opps, f.store, 4, F2, f.ledger,
    );
    expect(view.mates[0]).toBe(f.reader); // identity — `mate === p` guards still work
    expect(f.ledger.bodiesViewed).toBe(1); // himself excluded
    f.other.sentOff = true;
    f.other.pos = { x: 99, y: 9 };
    expect(f.see(40)).toBe(f.other);
    expect(f.ledger.bodiesViewed).toBe(1); // a sent-off body is not booked either
  });

  it('⭐ A BODY ON TOP OF THE READER is felt, not seen — the degenerate guard, not a range', () => {
    const f = fix(SEED_A);
    f.reader.heading = { x: -1, y: 0 };
    f.other.pos = { x: 0, y: 0 };
    expect(f.see(0)).toBe(f.other);
    // …and the field carries NO distance term: a body 60 m away, faced, is TRUTH
    f.reader.heading = { x: 1, y: 0 };
    f.other.pos = { x: 60, y: 0 };
    expect(f.see(1)).toBe(f.other);
  });

  it('⭐⭐ THE VIEW RESOLVES BACK TO TRUTH — `real()` is the physics gate (M-IN.1)', () => {
    const f = fix(SEED_B);
    f.other.pos = { x: 10, y: 0 };
    f.see(0);
    f.reader.heading = { x: -1, y: 0 };
    f.other.pos = { x: 14, y: 3 };
    const view = buildCarrierSnapshotView(f.reader, f.mates, f.opps, f.store, 7, F2, f.ledger);
    const stale = view.opps[0];
    expect(stale).not.toBe(f.other);
    expect(view.real(stale)).toBe(f.other);          // a staled body resolves back
    expect(view.real(f.other)).toBe(f.other);        // a truth body is its own answer
    expect(view.real(f.reader)).toBe(f.reader);      // and so is the reader
  });
});

describe('IN T0 §THE F2/F4 PARAMETERISATION — anchored, derived, and a real band', () => {
  it('⭐⭐ ANCHORED EXTRACTION: both ceilings come from NAMED lines, never a re-typed literal', () => {
    // canon VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
    // anchored match + line receipt — never first-occurrence" (home: BK-C0 §CORR item 1).
    // F2 — the engine's OWN midpoint, named in `kickMisalignment`'s doc comment:
    const f2Anchor = ' * 0 = striking dead ahead, 0.5 = square across the body, 1 = fully blind.';
    expect(linesOf(src('sim/mechanics.ts'), f2Anchor)).toBe(1);
    expect(/0\.5 = square across the body/.exec(f2Anchor)).not.toBeNull();
    expect(IN_FIELD_MISALIGN_MAX.F2squareAcross).toBe(0.5);
    expect(inFieldDotMin(F2)).toBe(0);              // 90° half-angle
    // F4 — the CONTACT blind price at HALF, from the shipped constant at its named site:
    const f4Anchor = '          (0.95 - (speed - 7) * 0.04) * (1 - blind * CONTACT_BLIND_PEN),';
    expect(linesOf(matchSource, f4Anchor)).toBe(1);
    expect(CONTACT_BLIND_PEN).toBe(0.7);
    expect(IN_FIELD_MISALIGN_MAX.F4contactHalfPrice).toBe(0.5 / CONTACT_BLIND_PEN);
    expect(inFieldDotMin(F4)).toBeCloseTo(-0.42857142857142855, 15);
    // the census's PUBLISHED half-angles, reproduced BY DERIVATION (IN-C0 §R2)
    const halfAngleDeg = (field: InSnapshotField): number =>
      (Math.acos(inFieldDotMin(field)) * 180) / Math.PI;
    expect(halfAngleDeg(F2)).toBeCloseTo(90, 9);
    // ⚠ DISCLOSED, not smoothed: the derivation gives 115.376934…°, and IN-C0 §R2 PUBLISHED
    // 115.3768 — the census's own 4th-decimal rounding. The seam pins the DERIVATION.
    expect(halfAngleDeg(F4)).toBeCloseTo(115.3768, 3);
    expect(Number(halfAngleDeg(F4).toFixed(6))).toBe(115.376934);
    // ⚠ ANGLE-ONLY: the module names no distance, range or metre constant at all
    expect(viewSource).not.toMatch(/rangeMetres|nearField|Metres|awareness \* 22/);
  });

  it('⭐⭐ THE F4-ONLY BAND IS A BAND: the same body is TRUTH at F4 and STALE at F2', () => {
    // a bearing of 100° from the heading: outside F2 (90°), inside F4 (115.3768°)
    const bearing = (100 * Math.PI) / 180;
    for (const field of [F2, F4] as const) {
      const f = fix(SEED_C);
      f.other.pos = { x: 10, y: 0 };
      f.see(0, field);                        // seen dead ahead
      f.other.pos = { x: 12 * Math.cos(bearing), y: 12 * Math.sin(bearing) };
      const seen = f.see(6, field);
      if (field === F4) expect(seen).toBe(f.other);           // still in field ⇒ TRUTH
      else expect(seen.pos).toEqual({ x: 10, y: 0 });         // out of field ⇒ STALE
    }
  });

  it('⭐ the field is a TYPED parameter with exactly two members, F2 the default', () => {
    expect(Object.keys(IN_FIELD_MISALIGN_MAX).sort()).toEqual([F4, F2].sort());
    expect(matchOf(SEED_A).inSnapshotField).toBe(F2);
    expect(matchOf(SEED_A, { field: F4 }).inSnapshotField).toBe(F4);
    // F4 is strictly WIDER than F2 (the sensitivity arm is a widening, not a rotation)
    expect(IN_FIELD_MISALIGN_MAX.F4contactHalfPrice)
      .toBeGreaterThan(IN_FIELD_MISALIGN_MAX.F2squareAcross);
  });
});

describe('IN T0 §PHYSICS STAYS TRUTH (M-IN.1) — the resolution sites and the exclusions', () => {
  it('⭐⭐ THE THREE RESOLUTION SITES are present, verbatim and singular', () => {
    // Every winner is resolved back to its TRUTH object before it can reach an action, a
    // heading or a `perform*` call. THREE sites, because `passMate` and the kickoff
    // back-pass are re-seated OUTSIDE the ladder (the stage doc's §SEAM MAP enumerates them).
    for (const line of [
      '  if (inView !== null) {',
      '    if (bestMate !== null) bestMate = inView.real(bestMate);',
      '    if (puntMate !== null) puntMate = inView.real(puntMate);',
      '  if (inView !== null && passMate !== null) passMate = inView.real(passMate);',
      '    if (inView !== null && back !== null) back = inView.real(back);',
    ]) {
      expect(linesOf(brainSource, line)).toBe(1);
    }
    // the ladder block resolves ALL SEVEN of its Player-typed winners
    for (const v of ['bestMate', 'bestLoftMate', 'bestRunner', 'bestCrossMate',
      'cutbackMate', 'bestThrowMate', 'puntMate']) {
      expect(count(brainSource, new RegExp(`= inView\\.real\\(${v}\\)`, 'g'))).toBe(1);
    }
    // …and there are exactly NINE `inView.real(` calls in the whole engine: the 7 ladder
    // winners + `passMate` + the kickoff `back`. A tenth would be an unaudited path.
    expect(count(brainSource, /inView\.real\(/g)).toBe(9);
  });

  it('⭐⭐ AN ARMED WALK NEVER HANDS A VIEW BODY TO AN ACTION — the identity audit', () => {
    // A view body is an `Object.create(truth)` proxy: it is NOT a member of `team.players`.
    // So if any action's `targetIdx` ever named a body absent from the truth rosters, or if
    // any body's own `pos` object were ever shared with a view, physics would be reading a
    // ghost. Walked at BOTH fields.
    for (const field of [F2, F4] as const) {
      const m = matchOf(SEED_C, { world: W9, in: true, field, duration: 240 });
      let checked = 0;
      while (!m.finished) {
        m.step(DT);
        const gids = new Set<number>();
        for (const t of m.teams) for (const p of t.players) gids.add(p.gid);
        for (const t of m.teams) {
          for (const p of t.players) {
            const a = p.action as { targetIdx?: number };
            if (a.targetIdx === undefined) continue;
            expect(gids.has(a.targetIdx)).toBe(true);
            checked += 1;
          }
        }
      }
      expect(checked).toBeGreaterThan(0);
      // the law FIRED on this walk (a vacuous audit is not an audit)
      expect(m.inSnapshotLedger.viewsBuilt).toBeGreaterThan(0);
      expect(m.inSnapshotLedger.readsStale).toBeGreaterThan(0);
    }
  });

  it('⭐⭐ THE MODULE HAS EXACTLY ONE CONSUMER, and no executor/physics file names it', () => {
    expect(count(brainSource, /from '\.\/inSnapshotView'/g)).toBe(1);
    for (const rel of ['ai/actionExecutor.ts', 'ai/TeamBrain.ts', 'sim/mechanics.ts',
      'sim/Player.ts', 'sim/Team.ts', 'sim/Ball.ts', 'game/a4World.ts',
      'ai/defensiveCoordination.ts', 'render3d/RenderStateAdapter.ts']) {
      expect(src(rel)).not.toContain('inSnapshot');
    }
    // the ONE fork in the sim lives in `decideCarrier`; the off-ball chooser is untouched
    // (IN-C0 §R1: it is ALREADY percept-based) and so is the keeper's own decider
    const offBall = brainSource.slice(brainSource.indexOf('function decideOffBall('));
    expect(offBall).not.toContain('inView');
    expect(offBall).not.toContain('inSnapshot');
    const gk = brainSource.slice(
      brainSource.indexOf('function decideGoalkeeper('),
      brainSource.indexOf('function decideOffBall('),
    );
    expect(gk.length).toBeGreaterThan(1000);
    expect(gk).not.toContain('inView');
  });

  it('⭐ NO LOOK, NO NEW KNOBS (M-IN.3) — the module spends no time and adds no channel', () => {
    // THE IMPORT LIST, PINNED EXACTLY: one shipped constant and two types. No look seam, no
    // turn rate, no genome, no attribute table — there is nothing in scope to spend or read.
    expect(viewSource.split('\n').filter((l) => l.startsWith('import '))).toEqual([
      "import { CONTACT_BLIND_PEN } from '../sim/constants';",
      "import type { Player } from '../sim/Player';",
      "import type { Team } from '../sim/Team';",
    ]);
    // and no CODE read of a look, a clock or a knob (prose may NAME them; code may not)
    for (const forbidden of [/o2Look/, /lookSeat/, /TURN_RATE/, /\.gkHoldTimer/, /\.kickCooldown/,
      /\.firstTouchWindow/, /\.genome/, /\.attrs/, /\.traits/, /\.simTime/]) {
      expect(count(viewSource, new RegExp(forbidden.source, 'g'))).toBe(0);
    }
    // …and it writes nothing onto any body: the ONLY assignments are on its own view objects
    expect(count(viewSource, /^\s*\(view as/gm)).toBe(3);
    // the ONLY truth reads that leave the module are position and velocity: 4 in the
    // cold-start seeding + 4 in the refresh. Nothing else about a body is ever copied.
    expect(count(viewSource, /truth\.pos|truth\.vel/g)).toBe(8);
  });
});

describe('IN T0 §NO SERIALIZATION — the books are per-match transient (the DF-T0 precedent)', () => {
  it('⭐⭐ neither the store nor the ledger can reach League.toJSON, clone or the adapter', () => {
    const leagueSource = src('sim/League.ts');
    // League.ts names the flag ONCE — in the matchFlags key union, nowhere else
    expect(count(leagueSource, /inSnapshotLaw/g)).toBe(1);
    expect(count(leagueSource, /inSnapshotField/g)).toBe(1);
    expect(leagueSource).not.toContain('inSnapshotStore');
    expect(leagueSource).not.toContain('inSnapshotLedger');
    expect(src('sim/cloneState.ts')).not.toContain('inSnapshot');
    expect(src('render3d/RenderStateAdapter.ts')).not.toContain('inSnapshot');
    // canon VERBATIM (home ruling #283.2(iv)): "WORKER-SIMMED fixtures play the SHIPPED
    // world (League.toJSON omits matchFlags…)" — so a worker fixture plays with the door
    // SHUT and no book exists at all.
    const league = new League({ seed: 20260820 });
    expect(JSON.stringify(league.toJSON())).not.toContain('inSnapshot');
  });

  it('⭐ the store is per-reader and bounded — at most one entry per other body', () => {
    const m = matchOf(SEED_A, { world: W9, in: true, duration: 120 });
    while (!m.finished) m.step(DT);
    expect(m.inSnapshotStore.size).toBeGreaterThan(0);
    for (const seen of m.inSnapshotStore.values()) {
      // 12 bodies on the pitch ⇒ at most 11 others in any one reader's book
      expect(seen.size).toBeLessThanOrEqual(11);
    }
    expect(m.inSnapshotStore.size).toBeLessThanOrEqual(2 * TEAM_SIZE);
  });
});

describe('IN T0 §FLAG SEMANTICS — it composes freely, and owns no refusal', () => {
  it('⭐⭐ THE POWER SET BUILDS: {inSnapshotLaw} × {dfAssignPersist} × the world-9 stack', () => {
    for (const world of [W8, W9] as const) {
      for (const on of [false, true]) {
        for (const df of [false, true]) {
          for (const field of [F2, F4] as const) {
            const m = matchOf(SEED_A, { world, in: on, field, df });
            expect(m.inSnapshotLaw).toBe(on);
            expect(m.inSnapshotField).toBe(field);
            expect(m.dfAssignPersist).toBe(df);
          }
        }
      }
    }
    // alone, with no other seam at all: perfectly legal — it owns its one site
    const alone = new Match({
      seed: SEED_A, teamA: team('A', 1), teamB: team('B', 2),
      c7Windup: false, o1PassWindup: false, inSnapshotLaw: true,
    });
    expect(alone.inSnapshotLaw).toBe(true);
  });

  it('⭐⭐ LIFECYCLE CLEAN: the two doors compose to a real, distinct, terminating world', () => {
    const both = matchOf(SEED_B, { world: W9, in: true, df: true, duration: 240 });
    while (!both.finished) both.step(DT);
    expect(both.finished).toBe(true);
    expect(both.inSnapshotLedger.viewsBuilt).toBeGreaterThan(0);
    // …and the composed world differs from either door alone (no silent absorption)
    const sigBoth = signatureOf(matchOf(SEED_B, { world: W9, in: true, df: true }));
    const sigIn = signatureOf(matchOf(SEED_B, { world: W9, in: true }));
    const sigDf = signatureOf(matchOf(SEED_B, { world: W9, df: true }));
    expect(sigBoth).not.toBe(sigIn);
    expect(sigBoth).not.toBe(sigDf);
  });

  it('⭐ no constructor refusal anywhere names this flag', () => {
    for (const chunk of matchSource.split('throw new Error(').slice(1)) {
      expect(chunk.slice(0, 600)).not.toContain('inSnapshot');
    }
  });
});

describe('IN T0 §SEAM MAP — occurrence COUNTS per needle (canon: PC-C0 §CORR item 1)', () => {
  it('⭐⭐ THE PREFIX `inSnapshot` — every occurrence, counted and sited', () => {
    // PREFIX STATED: the needle family is `inSnapshot*`; its members are exactly
    // `inSnapshotLaw`, `inSnapshotField`, `inSnapshotStore`, `inSnapshotLedger` and the
    // module name `inSnapshotView` (the file + its two imports).
    const members = /inSnapshot(Law|Field|Store|Ledger|View)/g;
    for (const hay of [matchSource, brainSource, src('sim/League.ts')]) {
      expect(count(hay, /inSnapshot/g)).toBe(count(hay, members));
    }
    // Match.ts: the four config/readonly declarations + their four initialisers + the
    // two-name import line = the ONLY places the engine names the seam.
    expect(count(matchSource, /^ {2}inSnapshotLaw\?: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}inSnapshotField\?: InSnapshotField;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly inSnapshotLaw: boolean;$/gm)).toBe(1);
    expect(count(matchSource, /^ {2}readonly inSnapshotField: InSnapshotField;$/gm)).toBe(1);
    expect(count(matchSource, /this\.inSnapshotLaw = cfg\.inSnapshotLaw \?\? false;/g)).toBe(1);
    expect(count(matchSource,
      /this\.inSnapshotField = cfg\.inSnapshotField \?\? 'F2squareAcross';/g)).toBe(1);
    expect(count(matchSource,
      /readonly inSnapshotStore: InSnapshotStore = new Map\(\);/g)).toBe(1);
    expect(count(matchSource,
      /readonly inSnapshotLedger: InSnapshotLedger = createInSnapshotLedger\(\);/g)).toBe(1);
    // PlayerBrain.ts: the flag is READ EXACTLY ONCE — the one gateway fork
    expect(count(brainSource, /match\.inSnapshotLaw/g)).toBe(1);
    expect(count(brainSource, /match\.inSnapshotStore/g)).toBe(1);
    expect(count(brainSource, /match\.inSnapshotField/g)).toBe(1);
    expect(count(brainSource, /match\.inSnapshotLedger/g)).toBe(1);
    expect(count(brainSource, /buildCarrierSnapshotView\(/g)).toBe(1);
    // the gateway shadowing: exactly TWO `Team` bindings are rebound, and no read renamed
    expect(count(brainSource, /snapshotTeamView\(/g)).toBe(2);
    expect(linesOf(brainSource,
      '  const team = inView === null ? teamTruth : snapshotTeamView(teamTruth, inView.mates);'))
      .toBe(1);
    expect(linesOf(brainSource,
      '  const opp = inView === null ? oppTruth : snapshotTeamView(oppTruth, inView.opps);'))
      .toBe(1);
    // ⭐ THE SHADOW'S WHOLE POINT: the carrier's own reads are UNRENAMED, so the pinned
    // source lines of the OTHER seams' suites all still stand. Spot-checked here.
    for (const line of [
      '  const pressure = pressureAt(p.pos, opp.players);',
      '    const space = spaceAhead(p, toGoal, opp.players);',
    ]) {
      expect(linesOf(brainSource, line)).toBe(1);
    }
  });

  it('⭐ the fingerprint of record is a literal in this suite, and the seam may not move it', () => {
    expect(FINGERPRINT_OF_RECORD).toBe(
      '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',
    );
    const bare = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
    expect(bare.inSnapshotLaw).toBe(false);
    expect(bare.inSnapshotStore.size).toBe(0);
  });
});

describe('IN T0 §THE SHADOW TEAM VIEW — enumeration only, everything else delegates', () => {
  it('⭐⭐ only `players` is an own property; index and identity are preserved', () => {
    const m = matchOf(SEED_A, { world: W9 });
    while (m.phase !== 'playing') m.step(DT);
    const t = m.teams[0];
    const swapped = [...t.players].reverse();
    const view = snapshotTeamView(t, swapped);
    expect(Object.getOwnPropertyNames(view)).toEqual(['players']);
    expect(view.players).toBe(swapped);
    expect(view.attackDir).toBe(t.attackDir);
    expect(view.genome).toBe(t.genome);
    expect(view.policies).toBe(t.policies);
    expect(view.mode).toBe(t.mode);
    expect(view.side).toBe(t.side);
    expect(view.localX(3)).toBe(t.localX(3));
    // …and INDEX-PRESERVING enumeration is what the real view guarantees
    const identity = snapshotTeamView(t, t.players);
    for (let i = 0; i < t.players.length; i++) {
      expect(identity.players[i]).toBe(t.players[i]);
    }
  });
});
