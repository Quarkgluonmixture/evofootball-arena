#!/usr/bin/env tsx
/**
 * ============================================================================
 * IN-T2B — THE POWER EXTENSION (instrument-only; H-IN.1(a1) RE-RUN VERBATIM)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #334 item 5 (the shared power dispatch with
 * DF-T3B), which ratified IN-T2-INFORMATION-EXAM.md §COMMANDER CORRECTIONS
 * item 4, VERBATIM: "(a1)'s REMEDY IS POWER, NOT A NEW CUT (§R9 item 1
 * ratified): IN-T2B — the same frozen pairwise conjunct on a larger virgin
 * battery — is QUEUED and MAY SHARE a dispatch with DF-T3B (both are pure
 * power re-runs of frozen rules)."
 *
 * ⛔⛔ THE RULE IS NOT RE-CUT. IN-T2 §P10 item 1 wrote, BEFORE its battery:
 * "the pairwise rule is frozen as it stands; if the carrier/off-ball pair
 * overlaps, (a1) is RED, is reported as RED, and is NOT re-cut to 'at least
 * one pair'." It overlapped. It is STILL not re-cut here — not to "at least
 * one pair", not to a one-sided read, not to a wider interval. The ONLY
 * variable is the seed count: 41 → 161.
 * ⚠⚠ AND #334 item 5 NAMED THE RISK AT DISPATCH: "the carrier's half-width was
 * 4.2× the off-ball's — power may still not resolve it; THAT TOO IS A RESULT."
 *
 * ⭐⭐ THE FROZEN RULE, VERBATIM from IN-T2-INFORMATION-EXAM.md §P1's table:
 *   (a1) USAGE NON-DEGENERACY BY SITUATION — "the three SITUATION look shares —
 *   carrier / off-ball outfield / keeper, src's OWN `inLookSituation` buckets
 *   read off the shipped ledger — are PAIRWISE RESOLVED DISTINCT: all THREE
 *   pairs of seed-clustered bootstrap intervals DISJOINT".
 *   kind: CI (unpaired, within-arm).
 *
 * ⭐ (a1)'s FORM IS #329 §CORR item 3, BINDING — BY SITUATION, NEVER PER-BODY.
 * IN-T1's `gEveryBodyLooks` was ratified a MIS-PITCHED conjunct: "a keeper who
 * almost never looks is footballing sense EMERGING from the price, not a
 * defect." The per-body spread is REPORTED beside the verdict, never gated.
 *
 * ⭐ THIS IS A THIN INSTRUMENT. It reproduces ONLY the (a1) machinery from
 * IN-T2's frozen form — the three situation look shares, the pairwise-disjoint
 * rule, the within-arm seed-clustered bootstrap, the per-seed cells, the
 * walk-side composition fixtures — and NOTHING else. Named out, explicitly:
 *   ⛔ NO FLIP ORACLE, NO STRATA, NO H-IN.1(b) — banked PASS at 7.95
 *      half-widths (IN-T2 §R0/§R1) and not re-asked. The oracle is also what
 *      made IN-T2's battery expensive; a power re-run of a within-arm usage
 *      conjunct must not pay for it.
 *   ⛔ NO (a2) ALL-SCANNING GUARD — banked PASS at 32.4 half-widths from zero.
 *      ⚠ The DECLINE share is nevertheless published as a REPORTED companion
 *      because it is the exact arithmetic complement of the pooled look share
 *      this stage must publish anyway; it is NOT re-scored.
 *   ⛔ NO SEASON LADDER (IN-T2 §R3 owns it, and its gen-1 level separation is
 *      the arc's named pre-entry question — a LATER contract's, not a power
 *      re-run's).
 *   ⛔ NO PRESS-IMMUNITY / HOLDING / ATTRIBUTION / R-乙 / §2 FACES — IN-T2
 *      §R2/§R4–§R7's, banked, not re-asked.
 *   ⛔ NO DOSING (both arms are flag worlds; #334 item 3's match-local-copy
 *      idiom is N/A and stated as N/A).
 *
 * ⭐ THE FROZEN CI RULES — IN-T2 §P3's, REPRODUCED, never re-cut:
 *   · PER-SEED CELLS are stored so every headline re-derives (canon, home
 *     ruling #282.2(ii)).
 *   · WITHIN-ARM contrasts ((a1)'s three situations) are UNPAIRED: each side
 *     gets its own seed-clustered bootstrap interval and the frozen test is
 *     INTERVAL OVERLAP — DISJOINT = resolved apart.
 *   · 2,000 resamples; 95 % percentile intervals; the bootstrap rng is seeded
 *     from its OWN published STATS BASE (block-base discipline).
 *   · Canon VERBATIM: "a starred finding states its |Δ|÷half-width ratio"
 *     (home BU-T0B §CORR item 2) — every pair publishes its gap over the
 *     LARGER half-width, IN-T2 §P3's own form.
 *   · Canon (paraphrase): moving denominators disclosed per face (home PW-C0
 *     §CORR item 2) — each situation publishes its own decision denominator.
 *   · Canon VERBATIM: "a max−min face reports a noise-floor comparison, not a
 *     zero-null CI" (home PC-T1 §CORR item 3) — the per-body look spread's
 *     min/max are published with NO interval attached, exactly as IN-T2 did.
 *   · ⭐⭐ THE WEIGHT-SENTENCE DISAMBIGUATION RIDES (IN-T2 §CORR item 2, which
 *     ordered: "Future exam-idiom stages carry the one-clause disambiguation
 *     in their §P"), VERBATIM: "the SHUT arm's stratum weights are held fixed"
 *     means SHUT SUPPLIES THE WEIGHTS BOTH ARMS ARE READ THROUGH; the
 *     implementation recomputes them per paired draw — the CONSERVATIVE
 *     direction. ⚠ It is N/A to (a1) (a within-arm share carries no
 *     standardisation weights at all) and the clause rides anyway, as ordered,
 *     so the idiom travels with the stage rather than with one conjunct.
 *
 * ⭐⭐ WALK-SIDE PREDICATES PINNED — canon VERBATIM: "a scored face's walk-side
 * predicate is pinned — anchored extraction or fixture — because the
 * re-derivation gate proves arithmetic, not definitions" (home: DF-T3 §CORR
 * item 2, ruling #332 item 3), REFINED at #334 item 2: "anchored extraction
 * protects the source line; a headline-bearing walk-side predicate ALSO needs
 * a COMPOSITION FIXTURE" (home: BK-T3 §CORR item 2). ⭐ THE STRONGEST FORM IS
 * AVAILABLE HERE: the situation bucket is a SHIPPED EXPORTED FUNCTION, so the
 * fixtures call `inLookSituation` ITSELF on constructed pictures — including a
 * KEEPER WHO HAS THE BALL (the carrier test comes FIRST, so he is situation 0,
 * not 2). No transcription to drift. And the pairwise DISJOINTNESS test is
 * pinned against IN-T2 §R0's OWN PUBLISHED INTERVALS: the record's
 * carrier/off-ball pair must come out OVERLAPPING and both keeper pairs
 * DISJOINT.
 *
 * ⭐ RED ROUTING (#334 item 3, now a REQUIRED brief clause): a RED run writes
 * `…RED.json`; the canonical path is only reached all-green.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: INT2B_MODE (smoke|full, REQUIRED) · INT2B_N · INT2B_OUT.
 *   ANY other `INT2B_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run (smoke / N / OUT) may NOT write the canonical path.
 *
 * RUN: INT2B_MODE=full npx tsx scripts/probes/in-t2b-power-extension.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { inLookSituation } from '../../src/ai/inLookAct';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { InSnapshotField } from '../../src/ai/inSnapshotView';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';

const banner = (s: string): void => { process.stdout.write(`${s}\n`); };

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['INT2B_MODE', 'INT2B_N', 'INT2B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'A4_WORLD', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('INT2B_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
type Mode = 'smoke' | 'full';
const MODE = process.env.INT2B_MODE as Mode | undefined;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: INT2B_MODE must be smoke|full');
  process.exit(2);
}
const N_ENV = process.env.INT2B_N === undefined ? null : Number(process.env.INT2B_N);
const OUT_OVERRIDE = process.env.INT2B_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/in-t2b-power-extension.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE !== 'full' || N_ENV !== null;
if (IS_OVERRIDE && OUT === CANONICAL_OUT) {
  console.error('REFUSAL: an override run (smoke / N / OUT) may not write the canonical path');
  process.exit(2);
}

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** IN-T2B's OWN booked block (ruling #334 item 5): 12,519,000–999. */
const BLOCK_BASE = 12_519_000;
const RECEIPT_SEED = BLOCK_BASE + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 160 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED reported after):
 *   12,519,000 – 12,519,159  the power battery (160 paired virgin seeds)
 *   12,519,800 – 12,519,802  the in-band smoke prefix
 *   12,519,999               the xxx,999 world-construction receipt seed (WALKED)
 * ⛔ NO LADDER SUB-RANGE — this stage runs no ladder.
 * THE BLOCK 12,519,000–999 IS CONSUMED WHOLE OF RECORD either way.
 */
const FULL_SEEDS = [
  ...Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i),
  RECEIPT_SEED,
];
const SMOKE_SEEDS = [BLOCK_BASE + 800, BLOCK_BASE + 801, BLOCK_BASE + 802];
const SEEDS = MODE === 'full' ? FULL_SEEDS : SMOKE_SEEDS;

/* ========================================================================== */
/* §2 THE WORLD, AND THE ANCHORED SRC EXTRACTIONS                             */
/* ========================================================================== */
const IN_WORLD = 9 as const;
const F2 = 'F2squareAcross' satisfies InSnapshotField;
type Arm = 'lookShut' | 'lookArmed';
const ARMS: readonly Arm[] = ['lookShut', 'lookArmed'];
/** 0 = carrier · 1 = off-ball outfield · 2 = keeper — src's OWN `inLookSituation` buckets */
const SITUATIONS = ['carrier', 'offBall', 'keeper'] as const;
const N_SIT = SITUATIONS.length;

const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>) as readonly L3DoseCell[];
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

const readSrc = (rel: string): string => readFileSync(rel, 'utf8');
/**
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): every line the scored share's
 * bucket definition lives on is pulled from ONE named line that must occur EXACTLY ONCE in
 * its file. Line numbers are REPORTED, never asserted.
 */
interface Anchor { id: string; file: string; line: string; re: RegExp; expect: string }
const ANCHORS: readonly Anchor[] = [
  {
    /** bucket 0: THE CARRIER — and this test comes FIRST, which the fixtures below prove */
    id: 'inLookSituationCarrier',
    file: 'src/ai/inLookAct.ts',
    line: '  if (match.ball.owner === p) return 0;',
    re: /match\.ball\.owner === p\) return (\d);/,
    expect: '0',
  },
  {
    /** buckets 2 and 1: the KEEPER, else the off-ball OUTFIELDER */
    id: 'inLookSituationKeeperElseOffBall',
    file: 'src/ai/inLookAct.ts',
    line: "  return p.role === 'GK' ? 2 : 1;",
    re: /p\.role === 'GK' \? (2 : 1);/,
    expect: '2 : 1',
  },
  {
    /** THE NUMERATOR's write site */
    id: 'inLookLedgerLooksBySituation',
    file: 'src/ai/inLookAct.ts',
    line: '  led.looksBySituation[situation] += 1;',
    re: /looksBySituation\[(situation)\] \+= 1;/,
    expect: 'situation',
  },
  {
    /** THE DENOMINATOR's write site — the SAME `situation`, one line above the look test */
    id: 'inLookLedgerDecisionsBySituation',
    file: 'src/ai/inLookAct.ts',
    line: '  led.decisionsBySituation[situation] += 1;',
    re: /decisionsBySituation\[(situation)\] \+= 1;/,
    expect: 'situation',
  },
];
interface AnchorReceipt {
  id: string; file: string; line: string; re: string;
  matches: number; lineNumbers: number[]; captured: string; expected: string;
}
const anchorReceipts: AnchorReceipt[] = ANCHORS.map((a) => {
  const lines = readSrc(a.file).split('\n');
  const hits = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, re: a.re.source,
    matches: hits.length, lineNumbers: hits,
    captured: m === null ? 'NO-MATCH' : (m[1] as string),
    expected: a.expect,
  };
});
const ANCHORS_OK = anchorReceipts.every((r) => r.matches === 1 && r.captured === r.expected);
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}

/* ========================================================================== */
/* §2b THE ARMS — IN-T2 §P4's, byte-for-byte                                  */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/**
 * ⭐ THE ARMS (IN-T2 §P4, reproduced): shut = the world-9 stack + IN-T0's `inSnapshotLaw` at
 * F2 (IN-T1's OWN `lookShut` world, the matched floor); armed = the same + `inLookAct`.
 * `inLookAct` is the ONLY difference. ⭐ THE DF DOORS ARE SHUT ON BOTH ARMS — one seam family
 * per exam. ⛔ NO DOSE anywhere — both arms are flag worlds.
 */
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(IN_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    inSnapshotLaw: true,
    inSnapshotField: F2,
    ...(arm === 'lookArmed' ? { inLookAct: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, IN_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
const worldConjuncts = (m: Match, arm: Arm): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: unknown; l3Defence: unknown;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
    l3DefenceLearn: boolean; l3DefenceVeto: boolean; o2Look: boolean;
  };
  return {
    armedVersionIsWorldNine: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    l3BooksPresent: mm.l3Defence !== null,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    l3DefenceDoorsArmed: mm.l3DefenceLearn === true && mm.l3DefenceVeto === true,
    /** THE MATCHED BASE: IN-T0's law armed at F2 on BOTH arms */
    inLawArmedBothArms: m.inSnapshotLaw === true && m.inSnapshotField === F2,
    /** THE ONLY ARM DIFFERENCE */
    lookDoorMatchesArm: m.inLookAct === (arm === 'lookArmed'),
    /** ⭐ THE DF DOORS ARE SHUT ON BOTH ARMS — one seam family per exam */
    dfDoorsShutBothArms: m.dfAssignPersist === false && m.dfSurface === false,
    /** the BANKED O2 look seam stays shut — IN-T1 built NEW (its §P2(d)) */
    o2LookShut: mm.o2Look === false,
  };
};

/* ========================================================================== */
/* §2c ⭐⭐ THE WALK-SIDE PREDICATE PINS — the refined canon's composition half */
/* ========================================================================== */
interface Interval { value: number; ciLo: number; ciHi: number; halfWidth: number }
/** THE FROZEN PAIRWISE TEST — the whole (a1) criterion turns on this one function. */
const disjoint = (a: Interval, b: Interval): boolean =>
  Number.isFinite(a.ciLo) && Number.isFinite(b.ciLo) && (a.ciHi < b.ciLo || b.ciHi < a.ciLo);
const iv = (ciLo: number, ciHi: number): Interval =>
  ({ value: (ciLo + ciHi) / 2, ciLo, ciHi, halfWidth: (ciHi - ciLo) / 2 });
/** THE PAIR SET, frozen: ALL THREE pairs, and (a1) passes iff EVERY one is disjoint. */
const PAIRS: ReadonlyArray<readonly [number, number]> = [[0, 1], [0, 2], [1, 2]];

interface PredicatePin { predicate: string; case: string; expected: string; actual: string }
const predicatePins: PredicatePin[] = [];
const pin = (predicate: string, name: string, expected: unknown, actual: unknown): void => {
  predicatePins.push({
    predicate, case: name, expected: JSON.stringify(expected), actual: JSON.stringify(actual),
  });
};
/**
 * ⭐⭐ THE SITUATION BUCKET IS PINNED AGAINST THE SHIPPED FUNCTION ITSELF, not a
 * transcription of it: `inLookSituation` is exported, so these fixtures CALL IT on
 * constructed pictures. There is no instrument-side copy to drift.
 */
const situationFixtureMatch = buildMatch(RECEIPT_SEED, 'lookShut');
while (situationFixtureMatch.phase !== 'playing') situationFixtureMatch.step(DT);
{
  const m = situationFixtureMatch;
  const us = m.teams[0];
  const gk = us.players.find((p) => p.role === 'GK') as Player;
  const outfield = us.players.find((p) => p.role !== 'GK') as Player;
  const theirOutfield = m.teams[1].players.find((p) => p.role !== 'GK') as Player;
  const restore = m.ball.owner;
  m.ball.owner = outfield;
  pin('inLookSituation', 'the man ON the ball — bucket 0 (carrier)',
    0, inLookSituation(outfield, m));
  pin('inLookSituation', 'a team-mate OFF the ball, outfield — bucket 1',
    1, inLookSituation(theirOutfield, m));
  pin('inLookSituation', 'the KEEPER, off the ball — bucket 2',
    2, inLookSituation(gk, m));
  m.ball.owner = gk;
  pin('inLookSituation',
    '⭐⭐ THE KEEPER WITH THE BALL — bucket 0, NOT 2: the carrier test comes FIRST, so a '
    + 'keeper in possession is counted in the CARRIER share, not the keeper share',
    0, inLookSituation(gk, m));
  pin('inLookSituation', 'and with the keeper on the ball an outfielder is bucket 1',
    1, inLookSituation(outfield, m));
  m.ball.owner = null;
  pin('inLookSituation', 'a LOOSE ball — nobody is the carrier; the keeper is still 2',
    2, inLookSituation(gk, m));
  pin('inLookSituation', 'a LOOSE ball — an outfielder is still 1',
    1, inLookSituation(outfield, m));
  pin('inLookSituation', 'the three buckets are EXHAUSTIVE and the order of record is '
    + 'carrier/offBall/keeper', ['carrier', 'offBall', 'keeper'], [...SITUATIONS]);
  m.ball.owner = restore;
}
/* --- THE PAIR SET: ALL THREE pairs, in the published order --- */
pin('PAIRS', 'exactly three pairs, in the order carrier-offBall / carrier-keeper / '
  + 'offBall-keeper', [[0, 1], [0, 2], [1, 2]], PAIRS.map((p) => [...p]));
pin('PAIRS', '⭐ the conjunct is ALL THREE, never "at least one" — an all-but-one pattern '
  + 'FAILS', false, [true, false, true].every(Boolean));
pin('PAIRS', 'and all three disjoint PASSES', true, [true, true, true].every(Boolean));
/* --- ⭐⭐ THE DISJOINTNESS TEST, PINNED AGAINST IN-T2 §R0's OWN PUBLISHED NUMBERS --- */
pin('disjoint', 'clearly separated intervals — TRUE', true, disjoint(iv(0, 1), iv(2, 3)));
pin('disjoint', 'nested intervals — FALSE', false, disjoint(iv(0, 3), iv(1, 2)));
pin('disjoint', '⭐ intervals that merely TOUCH at an endpoint — FALSE (strict `<`)',
  false, disjoint(iv(0, 1), iv(1, 2)));
pin('disjoint', 'order does not matter — the reversed pair agrees',
  [true, true], [disjoint(iv(0, 1), iv(2, 3)), disjoint(iv(2, 3), iv(0, 1))]);
pin('disjoint', 'a NaN edge — FALSE, never silently true',
  false, disjoint(iv(Number.NaN, 1), iv(2, 3)));
pin('disjoint',
  '⭐⭐ IN-T2 §R0\'s carrier [0.638524822695, 0.78707450607] vs offBall '
  + '[0.652113176346, 0.687541050649] — OVERLAP, exactly as that draw scored ⛔ (this is '
  + 'the red IN-T2B exists to re-power; the criterion is proven to reproduce it)',
  false, disjoint(iv(0.638524822695, 0.78707450607), iv(0.652113176346, 0.687541050649)));
pin('disjoint',
  '⭐ IN-T2 §R0\'s carrier vs keeper [0.0789204362701, 0.11594057014] — DISJOINT ✅',
  true, disjoint(iv(0.638524822695, 0.78707450607), iv(0.0789204362701, 0.11594057014)));
pin('disjoint',
  '⭐ IN-T2 §R0\'s offBall vs keeper — DISJOINT ✅',
  true, disjoint(iv(0.652113176346, 0.687541050649), iv(0.0789204362701, 0.11594057014)));
pin('disjoint',
  '⭐⭐ AND THE WHOLE CONJUNCT ON THE RECORD\'S OWN NUMBERS: pairsDisjoint = '
  + '[false, true, true] ⇒ (a1) FAILS, which is IN-T2 §R0\'s verdict of record',
  { pairs: [false, true, true], pass: false },
  {
    pairs: [
      disjoint(iv(0.638524822695, 0.78707450607), iv(0.652113176346, 0.687541050649)),
      disjoint(iv(0.638524822695, 0.78707450607), iv(0.0789204362701, 0.11594057014)),
      disjoint(iv(0.652113176346, 0.687541050649), iv(0.0789204362701, 0.11594057014)),
    ],
    pass: [
      disjoint(iv(0.638524822695, 0.78707450607), iv(0.652113176346, 0.687541050649)),
      disjoint(iv(0.638524822695, 0.78707450607), iv(0.0789204362701, 0.11594057014)),
      disjoint(iv(0.652113176346, 0.687541050649), iv(0.0789204362701, 0.11594057014)),
    ].every(Boolean),
  });
const PREDICATE_PINS_OK = predicatePins.every((p) => p.expected === p.actual);
if (!PREDICATE_PINS_OK) {
  console.error('CONSTRUCTION CLASS: a walk-side predicate pin FAILED',
    predicatePins.filter((p) => p.expected !== p.actual));
  process.exit(3);
}

/* ========================================================================== */
/* §3 THE ROW — per-seed cells, ONLY what (a1) and its companions need         */
/* ========================================================================== */
interface Row {
  arm: Arm;
  seed: number;
  worldOk: boolean;
  ticks: number;
  stepWallMs: number;
  /* ---- IN-T0's ledger: the MATCHED FLOOR must be non-vacuous on BOTH arms ---- */
  viewsBuilt: number;
  bodiesViewed: number;
  /* ---- IN-T1's ledger (structurally ZERO on the shut arm) ---- */
  decisionsSeen: number;
  looks: number;
  declines: number;
  lockedDecisions: number;
  turnTicksPaid: number;
  looksBySituation: number[];
  decisionsBySituation: number[];
  gidsThatLooked: number;
  /**
   * ⭐ AN ARMING RECEIPT, NOT A FOOTBALL FACE (canon, home ruling #289 item 1): a digest of
   * the walk's own outcome, used ONLY to prove the two arms are different worlds per seed.
   * No football quantity is published from it and no CI is attached to it.
   */
  outcomeDigest: string;
}
const zeros = (n: number): number[] => Array.from({ length: n }, () => 0);

const walk = (seed: number, arm: Arm): Row => {
  const m = buildMatch(seed, arm);
  const wOk = Object.values(worldConjuncts(m, arm)).every(Boolean);
  const t0 = Date.now();
  let ticks = 0;
  while (!m.finished) { m.step(DT); ticks += 1; }
  const snap = m.inSnapshotLedger;
  const k = m.inLookLedger;
  const r = m.getResult();
  return {
    arm,
    seed,
    worldOk: wOk,
    ticks,
    stepWallMs: Date.now() - t0,
    viewsBuilt: snap.viewsBuilt,
    bodiesViewed: snap.bodiesViewed,
    decisionsSeen: k.decisionsSeen,
    looks: k.looks,
    declines: k.declines,
    lockedDecisions: k.lockedDecisions,
    turnTicksPaid: k.turnTicksPaid,
    looksBySituation: [...k.looksBySituation],
    decisionsBySituation: [...k.decisionsBySituation],
    gidsThatLooked: k.looksByGid.size,
    outcomeDigest: createHash('sha256')
      .update(JSON.stringify({ score: r.score, stats: r.stats, events: r.events.length, ticks }))
      .digest('hex'),
  };
};

/* ========================================================================== */
/* §4 STATS BASES — the registry, floor 116,600, step ≥ 200                    */
/* ========================================================================== */
const R9_INHERITED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
  113_800, 102_200, 102_800, 103_200, 103_600, 103_800, 104_200, 104_600, 104_800, 105_200,
  105_800, 109_400, 109_600, 109_800, 110_000, 114_000,
];
/**
 * THE REGISTRY ENTERING THIS STAGE IS 68: the 67 of record at ruling #333 item 4, PLUS
 * ⭐ 116,400, which THIS ROUND'S DF-T3B consumed (its §R4, the first half of the same shared
 * power dispatch). The two stages are ONE dispatch and the registry is summed, not cached —
 * the #332 item 3 lesson (the rulings' consumption items are the authority AND must be
 * summed). THIS STAGE CONSUMES EXACTLY ONE base, so the registry leaves at 69.
 */
const REGISTRY_ADDITIONS: readonly number[] = [
  114_200, 114_400, 114_600, 114_800, 115_000, 115_200, 115_400, 115_600,
  115_800, 116_000, 116_200, 116_400,
];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 68
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 116_600;
const STATS_STEP = 200;
/** ONE draw ⇒ ONE base: the WITHIN-ARM seed-clustered bootstrap that carries (a1). */
const STATS_BASES_CONSUMED = [STATS_BASE] as const;
const minStatsGap = Math.min(...STATS_BASES_CONSUMED
  .flatMap((mine) => STATS_PUBLISHED_BASES.map((b) => Math.abs(mine - b))));

/* ========================================================================== */
/* §5 THE CONSTRUCTION CLASS — refuse BEFORE any battery (nothing written)     */
/* ========================================================================== */
const RECEIPT = worldConjuncts(buildMatch(RECEIPT_SEED, 'lookShut'), 'lookShut');
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
if (!RECEIPT_OK) {
  console.error('CONSTRUCTION CLASS: the xxx,999 world receipt failed', RECEIPT);
  process.exit(3);
}
if (!REGISTRY_COMPLETE) {
  console.error('CONSTRUCTION CLASS: the stats registry did not reconcile');
  process.exit(3);
}

/* ========================================================================== */
/* §6 THE BATTERY                                                              */
/* ========================================================================== */
banner(`IN-T2B: mode=${MODE} battery=${SEEDS.length} seeds × 2 arms (NO ladder, NO oracle)`);
const tBattery0 = Date.now();
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const arm of ARMS) rows.push(walk(seed, arm));
}
const batteryWallSec = Number(((Date.now() - tBattery0) / 1000).toFixed(3));
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
banner(`battery done in ${batteryWallSec}s — ${rows.length} walks`);

/* ========================================================================== */
/* §7 ⭐⭐ H-IN.1(a1) — THE WITHIN-ARM SITUATION BLOCK, IN-T2's form reproduced  */
/* ========================================================================== */
const round = (v: number, digits = 12): number =>
  (Number.isFinite(v) ? Number(v.toPrecision(digits)) : v);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);
const armedRows = rows.filter((r) => r.arm === 'lookArmed');
const shutRows = rows.filter((r) => r.arm === 'lookShut');
const armedBySeed = new Map(armedRows.map((r) => [r.seed, r]));
const shutBySeed = new Map(shutRows.map((r) => [r.seed, r]));

const BOOTSTRAP = 2000;
const pickPct = (draws: readonly number[], p: number): number => (draws.length === 0 ? Number.NaN
  : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
/**
 * ⭐ THE WITHIN-ARM BOOTSTRAP — IN-T2 §P3's idiom, reproduced: the cluster is the SEED, the
 * contrast is UNPAIRED, each side gets its OWN interval and the frozen test is INTERVAL
 * OVERLAP. The rng is seeded from THIS stage's own published stats base.
 */
const rngWithin = new Rng(STATS_BASE);
const withinIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngWithin.next() * seedsWalked.length)));
const intervalOf = (draws: number[], value: number): Interval => {
  draws.sort((a, b) => a - b);
  const lo = pickPct(draws, 0.025);
  const hi = pickPct(draws, 0.975);
  return { value: round(value), ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2) };
};
const withinInterval = (pick: (rs: readonly Row[]) => number): Interval => {
  const draws: number[] = [];
  for (const idx of withinIndex) {
    const rs = idx.map((i) => armedBySeed.get(seedsWalked[i])!);
    const v = pick(rs);
    if (Number.isFinite(v)) draws.push(v);
  }
  return intervalOf(draws, pick(armedRows));
};

/* ---- (a1) THE THREE SITUATION LOOK SHARES, PAIRWISE ---- */
const situationShare = (rs: readonly Row[], s: number): number =>
  ratio(sum(rs.map((r) => r.looksBySituation[s])), sum(rs.map((r) => r.decisionsBySituation[s])));
const a1Intervals: Interval[] = [0, 1, 2].map((s) => withinInterval((rs) => situationShare(rs, s)));
const a1Pairs = PAIRS.map(([i, j]) => ({
  pair: `${SITUATIONS[i]} vs ${SITUATIONS[j]}`,
  disjoint: disjoint(a1Intervals[i], a1Intervals[j]),
  absoluteGap: round(Math.abs(a1Intervals[i].value - a1Intervals[j].value)),
  ratioToHalfWidth: round(Math.abs(a1Intervals[i].value - a1Intervals[j].value)
    / Math.max(a1Intervals[i].halfWidth, a1Intervals[j].halfWidth), 6),
}));
const A1_PASS = a1Pairs.every((p) => p.disjoint);
const situationDenominators = [0, 1, 2].map((s) =>
  sum(armedRows.map((r) => r.decisionsBySituation[s])));
const situationNumerators = [0, 1, 2].map((s) =>
  sum(armedRows.map((r) => r.looksBySituation[s])));

/* ---- THE COMPANIONS: pooled look/decline share and the per-body spread (REPORTED) ---- */
const lookShareOf = (rs: readonly Row[]): number =>
  ratio(sum(rs.map((r) => r.looks)), sum(rs.map((r) => r.decisionsSeen)));
const declineShareOf = (rs: readonly Row[]): number =>
  ratio(sum(rs.map((r) => r.declines)), sum(rs.map((r) => r.decisionsSeen)));
const lookShare = withinInterval(lookShareOf);
const declineShare = withinInterval(declineShareOf);
const gidsThatLooked = armedRows.map((r) => r.gidsThatLooked);

/* ========================================================================== */
/* §8 GATES (frozen; a RED gate stays RED and is reported)                     */
/* ========================================================================== */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
/**
 * BOOKED = WALKED from INDEPENDENT RECORDS (#334 item 3: gates that cannot fail are not
 * gates): BOOKED is the declared seed constant, WALKED is derived from the per-seed cells the
 * battery actually produced. Neither is computed from the other.
 */
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s))
  && seedsWalked.every((s) => SEEDS.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2)
  && seedsWalked.every((s) => shutBySeed.has(s) && armedBySeed.has(s));
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK;
gates.gWalkSidePredicatesPinned = PREDICATE_PINS_OK && predicatePins.length >= 20;
const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']).trim();
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']).trim();
gates.gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';
/** DORMANCY MEASURED IN-BATTERY: IN-T1's ledger is untouched with the look door shut */
gates.gShutLookLedgerEmpty = shutRows.every((r) => r.decisionsSeen === 0 && r.looks === 0
  && r.declines === 0 && r.lockedDecisions === 0 && r.turnTicksPaid === 0
  && r.looksBySituation.every((x) => x === 0)
  && r.decisionsBySituation.every((x) => x === 0) && r.gidsThatLooked === 0);
/** IN-T0's law is armed and BITING on BOTH arms — the matched floor is non-vacuous */
gates.gInLawFiresBothArms = rows.every((r) => r.viewsBuilt > 0 && r.bodiesViewed > 0);
/** the look is USED and DECLINED on every armed walk (IN-T2's own liveness gate) */
gates.gLookFiresEveryArmedWalk = armedRows.every((r) => r.looks > 0 && r.declines > 0);
/**
 * ⭐ THE SCORED CELLS ARE ALIVE: ALL THREE situations carry decisions AND looks. A zero
 * keeper denominator would make the "keeper looks a seventh as often" story unmeasurable
 * while every arithmetic gate stayed green.
 */
gates.gSituationCellsAlive = situationDenominators.every((d) => d > 0)
  && situationNumerators.every((n) => n > 0)
  && armedRows.every((r) => r.decisionsBySituation.every((d) => d > 0));
/** ⭐ the bootstrap really resampled — a degenerate interval is not a measurement */
gates.gWithinBootstrapAlive = withinIndex.length === BOOTSTRAP
  && a1Intervals.every((i) => i.halfWidth > 0);
/** ⭐ AN ARMING RECEIPT: the two arms are different worlds on EVERY seed */
gates.gArmsDistinguishable = seedsWalked.every((s) =>
  shutBySeed.get(s)!.outcomeDigest !== armedBySeed.get(s)!.outcomeDigest);
gates.gSeedDiscipline = SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999)
  && seedsWalked.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gStatsDisjoint = STATS_BASE >= 116_600 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE;
gates.gFingerprintUnmoved = false; // filled below
gates.gFacesFromDisk = false;      // filled below (staging re-parse)

const FINGERPRINT_OF_RECORD = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
let fingerprintNow = 'NOT-RUN';
try {
  const out = execFileSync('npx', ['tsx', 'scripts/fingerprint.ts'], { encoding: 'utf8' });
  fingerprintNow = (/sha256=([0-9a-f]{64})/.exec(out) ?? [, 'NO-MATCH'])[1] as string;
} catch { fingerprintNow = 'FINGERPRINT-FAILED'; }
gates.gFingerprintUnmoved = fingerprintNow === FINGERPRINT_OF_RECORD;

/* ========================================================================== */
/* §9 THE ARTIFACT — allowlist schema; STAGE, re-derive off disk, hash LAST    */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');

const hin1a1 = {
  ruleVerbatim: 'the three SITUATION look shares — carrier / off-ball outfield / keeper, '
    + 'src\'s OWN `inLookSituation` buckets read off the shipped ledger — are PAIRWISE '
    + 'RESOLVED DISTINCT: all THREE pairs of seed-clustered bootstrap intervals DISJOINT',
  ruleHome: 'IN-T2-INFORMATION-EXAM.md §P1, conjunct (a1) USAGE NON-DEGENERACY BY SITUATION — '
    + 'QUOTED VERBATIM AND NOT RE-CUT. The only thing this stage changed is the number of '
    + `seeds (41 → ${SEEDS.length}).`,
  formHome: '#329 §CORR item 3, BINDING — BY SITUATION, NEVER PER-BODY. IN-T1\'s '
    + '`gEveryBodyLooks` was ratified a MIS-PITCHED conjunct: "a keeper who almost never '
    + 'looks is footballing sense EMERGING from the price, not a defect."',
  kind: 'CI (unpaired, within-arm) — interval OVERLAP is the frozen test; DISJOINT = resolved',
  priorDraw: {
    stage: 'IN-T2 §R0 (41 paired seeds, block 12,516,000–999, stats base 116,200)',
    carrier: '0.719124403207 [0.638524822695, 0.78707450607]',
    offBall: '0.66964132854 [0.652113176346, 0.687541050649]',
    keeper: '0.0970949153554 [0.0789204362701, 0.11594057014]',
    pairsDisjoint: 'false / true / true ⇒ (a1) RED — the exact red §P10 item 1 predicted by '
      + 'name; the carrier/off-ball gap was 0.049483074667 at ratioToHalfWidth 0.666216, and '
      + 'the carrier\'s interval was FOUR TIMES WIDER than the off-ball\'s (hw 0.0743 vs '
      + '0.0177). The other two pairs were 8.37 and 30.93 half-widths.',
    disposition: 'IN-T2 §R9 item 1 / §CORR item 4: "(a1) IS UNDERPOWERED, NOT CONTRADICTED — '
      + 'and the remedy is power, not a new cut."',
    dispatchWarning: '⚠⚠ #334 item 5, at dispatch: "the carrier\'s half-width was 4.2× the '
      + 'off-ball\'s — power may still not resolve it; that too is a result."',
  },
  situations: [...SITUATIONS],
  intervals: SITUATIONS.map((name, s) => ({
    situation: name,
    ...a1Intervals[s],
    looks: situationNumerators[s],
    decisions: situationDenominators[s],
    denNote: `denominator = decisionsBySituation[${s}] — the moments the shipped ledger `
      + 'counted in THIS situation. It MOVES with how much of the battery each situation '
      + 'occupies (a carrier is one body, off-ball outfield is ten, keeper is one), which is '
      + 'the whole mechanism behind the carrier interval being the widest.',
  })),
  pairs: a1Pairs,
  pass: A1_PASS,
  verdict: A1_PASS ? 'PASS' : `FAIL — ${a1Pairs.filter((p) => !p.disjoint).map((p) => p.pair).join(' · ')}`,
  scopeNote: '⛔ THIS STAGE SCORES (a1) ONLY. (a2) is IN-T2 §R0\'s ✅ at 32.4153 half-widths '
    + 'from zero and H-IN.1(b) is its ✅ at 7.94567 half-widths; neither is re-adjudicated '
    + 'here, and H-IN.1(a) as a whole is NOT claimed by this stage.',
};

const bodyCore = {
  stage: 'IN-T2B-POWER-EXTENSION',
  kind: 'power extension (H-IN.1(a1) RE-RUN VERBATIM on a larger virgin battery; nothing '
    + 'else scored, nothing re-cut)',
  ruling: '#334 item 5 (ratifying IN-T2 §COMMANDER CORRECTIONS item 4)',
  contract: 'IN-SNAPSHOT-CONTRACT.md §1 H-IN.1 + §2 M-IN.1/M-IN.2/M-IN.3 + §4 ("an '
    + 'all-scanning world is a FAILURE mode")',
  parentStage: 'IN-T2-INFORMATION-EXAM.md (§P1 the frozen rule · §P3 the frozen CI rules · '
    + '§P10 item 1 the pre-named red · §R0 the prior draw · §R9 item 1 + §CORR item 4 the '
    + 'power disposition · §CORR item 2 the weight-sentence disambiguation)',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/in-t2b-power-extension.ts',
    sha256: instrumentSha,
    thinBy: 'ONLY the H-IN.1(a1) machinery is reproduced from IN-T2\'s frozen form: the three '
      + 'situation look shares, the pairwise-disjoint rule, the within-arm seed-clustered '
      + 'bootstrap, the per-seed cells and the walk-side composition fixtures.',
    reproducedFrom: 'scripts/probes/in-t2-information-exam.ts §10 (situationShare / '
      + 'a1Intervals / a1Pairs / withinInterval / intervalOf / disjoint / the withinIndex '
      + 'resampler) and its §4 ledger read at the whistle.',
    /**
     * ⭐⭐ THE WEIGHT-SENTENCE DISAMBIGUATION, CARRIED VERBATIM AS ORDERED (IN-T2 §CORR
     * item 2: "Future exam-idiom stages carry the one-clause disambiguation in their §P").
     */
    weightSentenceDisambiguation: 'IN-T2 §CORR item 2, VERBATIM: "the SHUT arm\'s stratum '
      + 'weights are held fixed" means SHUT SUPPLIES THE WEIGHTS BOTH ARMS ARE READ THROUGH; '
      + 'the implementation recomputes them per paired draw — the CONSERVATIVE direction '
      + '(propagates weight uncertainty, widens the interval). ⚠ N/A TO (a1): a within-arm '
      + 'share carries no standardisation weights at all, and this stage runs no '
      + 'stratum-standardised face. THE CLAUSE RIDES ANYWAY, as ordered, so the idiom travels '
      + 'with the stage rather than with one conjunct.',
    namedOut: [
      '⛔ NO FLIP ORACLE, NO STRATA, NO H-IN.1(b) — banked PASS at 7.94567 half-widths '
      + '(IN-T2 §R0/§R1); the oracle is also what made IN-T2\'s battery expensive',
      '⛔ NO (a2) all-scanning guard — banked PASS at 32.4153 half-widths from zero. The '
      + 'DECLINE share is published as a REPORTED companion (the arithmetic complement of '
      + 'the pooled look share) and is NOT re-scored.',
      '⛔ NO SEASON LADDER — IN-T2 §R3 owns it, and its gen-1 level separation is the arc\'s '
      + 'named pre-entry question (#333 item 3 / IN-T2 §CORR item 5), a LATER contract\'s',
      '⛔ NO PRESS-IMMUNITY / HOLDING / ATTRIBUTION / R-乙 / §2 equilibrium faces — IN-T2 '
      + '§R2 and §R4–§R7\'s, banked, not re-asked',
      '⛔ NO DOSING (both arms are flag worlds; #334 item 3\'s match-local-copy dose idiom '
      + 'is N/A, stated as N/A)',
    ],
  },
  definitions: {
    situationBuckets: '0 = carrier · 1 = off-ball outfield · 2 = keeper — src\'s OWN '
      + '`inLookSituation` (src/ai/inLookAct.ts), read off the shipped ledger, never '
      + 're-typed. ⭐ THE BUCKET IS PINNED BY CALLING THE SHIPPED EXPORTED FUNCTION on '
      + 'constructed pictures (see walkSidePredicatePins), including a KEEPER WITH THE BALL, '
      + 'who is bucket 0 and not 2 because the carrier test comes FIRST.',
    situationLookShare: 'looksBySituation[s] ÷ decisionsBySituation[s], both written by the '
      + 'shipped ledger at the SAME `situation` index in the same call.',
    pairwiseRule: 'ALL THREE pairs — carrier×offBall, carrier×keeper, offBall×keeper — must '
      + 'have DISJOINT intervals. ⛔ NEVER "at least one pair" (IN-T2 §P10 item 1).',
    outcomeDigest: '⭐ AN ARMING RECEIPT, NOT A FOOTBALL FACE (canon, home ruling #289 item '
      + '1): sha256 over the walk\'s score/stats/event-count/tick-count, used ONLY by '
      + 'gArmsDistinguishable. No football quantity is derived from it and no CI is attached.',
  },
  world: {
    version: IN_WORLD,
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw + inSnapshotLaw at F2 (IN-T1\'s own '
      + 'lookShut world, the matched floor) in BOTH arms',
    inSnapshotField: F2,
    armDifference: 'inLookAct only',
    arms: {
      lookShut: 'the world-9 stack + inSnapshotLaw at F2, the LOOK door SHUT',
      lookArmed: 'the same + inLookAct',
    },
    dfDoors: '⭐ dfAssignPersist and dfSurface are BOTH FALSE on both arms — one seam family '
      + 'per exam, asserted per walk.',
    dosing: '⛔ NONE. Both arms are FLAG worlds; nothing is written to any genome view, so '
      + '#334 item 3\'s match-local-copy dose idiom and its info.genome-cleanliness conjunct '
      + 'are N/A — stated, not silently omitted.',
    ladder: '⛔ NOT RUN by this stage.',
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subRanges: {
      battery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} paired virgin seeds)`,
      smokePrefix: `${BLOCK_BASE + 800}–${BLOCK_BASE + 802} (in band)`,
      receipt: `${RECEIPT_SEED} (the xxx,999 world-construction receipt — WALKED)`,
      ladderLeagues: 'NONE — this stage runs no ladder',
    },
    booked: SEEDS,
    walked: seedsWalked,
    bookedEqualsWalked: seedsWalked.length === SEEDS.length
      && SEEDS.every((s) => seedsWalked.includes(s)),
    walksTotal: rows.length,
    seedsVsInT2: 'IN-T2 walked 41 paired seeds (12,516,000–039 + 999); this stage walks '
      + `${SEEDS.length} VIRGIN paired seeds — the power ratio is `
      + `${round(SEEDS.length / 41, 6)}× the clusters.`,
    blockConsumedWhole: `${BLOCK_BASE}–${BLOCK_BASE + 999} CONSUMED WHOLE of record`,
    nextSimBlock: 12_520_000,
  },
  stats: {
    basesConsumed: STATS_BASES_CONSUMED,
    step: STATS_STEP,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryComplete: REGISTRY_COMPLETE,
    registryCompletionMethod: 'the registry of record at ruling #333 item 4 is 67; ⭐ THIS '
      + 'ROUND\'S DF-T3B consumed 116,400 (the first half of the same shared power dispatch, '
      + 'its §R4), so the registry ENTERING this stage is 68 — summed from the rulings\' own '
      + 'consumption items plus this dispatch\'s first half, never cached (#332 item 3\'s '
      + 'lesson). THIS STAGE CONSUMES EXACTLY ONE base, so the registry leaves at 69.',
    minGapToAnyPublishedBase: minStatsGap,
    nextBase: STATS_BASE + STATS_STEP,
    draw1: `${STATS_BASE} — the WITHIN-ARM seed-clustered bootstrap that carries (a1) (and `
      + 'the pooled look/decline companions, which share the SAME resample index by '
      + 'construction, exactly as IN-T2\'s single within-arm draw did)',
    bootstrapDraws: BOOTSTRAP,
  },
  anchoredExtractions: anchorReceipts,
  walkSidePredicatePins: predicatePins,
  hin1a1,
  companions: {
    reported: true,
    scored: false,
    note: '⭐ REPORTED, NEVER SCORED HERE. The pooled look share and its arithmetic '
      + 'complement the DECLINE share are published because (a1)\'s three situation shares '
      + 'are meaningless without the pooled denominator beside them; (a2) is IN-T2 §R0\'s '
      + 'verdict of record and is NOT re-scored.',
    lookShareOfDecisions: lookShare,
    declineShareOfDecisions: declineShare,
    sharesSumToOne: round(lookShare.value + declineShare.value),
    decisionsSeenArmed: sum(armedRows.map((r) => r.decisionsSeen)),
    looksArmed: sum(armedRows.map((r) => r.looks)),
    declinesArmed: sum(armedRows.map((r) => r.declines)),
    looksPerMatch: round(ratio(sum(armedRows.map((r) => r.looks)), armedRows.length)),
    turnTicksPerLook: round(ratio(sum(armedRows.map((r) => r.turnTicksPaid)),
      sum(armedRows.map((r) => r.looks)))),
    turnSimSecondsPerLook: round(ratio(sum(armedRows.map((r) => r.turnTicksPaid)),
      sum(armedRows.map((r) => r.looks))) * DT),
    perBodySpread: {
      note: 'the per-BODY spread is REPORTED and is NOT a conjunct (#329 §CORR item 3), and '
        + 'canon VERBATIM: "a max−min face reports a noise-floor comparison, not a zero-null '
        + 'CI" (home PC-T1 §CORR item 3) — NO interval is attached to these.',
      gidsThatLookedPerMatch: round(ratio(sum(gidsThatLooked), armedRows.length)),
      gidsThatLookedMin: Math.min(...gidsThatLooked),
      gidsThatLookedMax: Math.max(...gidsThatLooked),
    },
  },
  wall: { batterySeconds: batteryWallSec },
  perSeedCells: rows,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'INSTRUMENT-ONLY: src is UNTOUCHED by this stage (it has no rider commit — IN-T2 '
      + '§CORR ordered no pin, only the disambiguation clause, which is prose)',
    gitStatusSrc: srcPorcelain,
    gitDiffStatSrcHead: srcDiffStat,
    head: gitOut(['rev-parse', 'HEAD']).trim(),
  },
};

/* ---- gFacesFromDisk: STAGE the body, re-parse it off disk, re-derive EVERY face ---- */
mkdirSync('docs/world-model/data', { recursive: true });
const STAGING = `${OUT.replace(/\.json$/, '')}.staging.json`;
writeFileSync(STAGING, `${JSON.stringify(bodyCore, null, 2)}\n`);
const onDisk = JSON.parse(readFileSync(STAGING, 'utf8')) as typeof bodyCore;
const mismatches: string[] = [];
let checks = 0;
const asJson = (v: number): number | null => (Number.isFinite(v) ? v : null);
const same = (recomputed: number, published: unknown): boolean =>
  Object.is(asJson(recomputed), published as number | null);
{
  const dRows = onDisk.perSeedCells as Row[];
  const dArmed = dRows.filter((r) => r.arm === 'lookArmed');
  const dShut = dRows.filter((r) => r.arm === 'lookShut');
  /* ---- ⭐⭐ (a1): three point estimates, three numerators, three denominators ---- */
  const ivs = onDisk.hin1a1.intervals;
  for (let s = 0; s < N_SIT; s++) {
    checks += 3;
    if (!same(round(situationShare(dArmed, s)), ivs[s].value)) {
      mismatches.push(`a1/${SITUATIONS[s]}/value`);
    }
    if (sum(dArmed.map((r) => r.looksBySituation[s])) !== ivs[s].looks) {
      mismatches.push(`a1/${SITUATIONS[s]}/looks`);
    }
    if (sum(dArmed.map((r) => r.decisionsBySituation[s])) !== ivs[s].decisions) {
      mismatches.push(`a1/${SITUATIONS[s]}/decisions`);
    }
  }
  /* ---- the THREE PAIR BOOLEANS, both gap faces, the conjunct pass and the VERDICT ---- */
  for (let p = 0; p < PAIRS.length; p++) {
    const [i, j] = PAIRS[p];
    checks += 3;
    if (disjoint(ivs[i], ivs[j]) !== onDisk.hin1a1.pairs[p].disjoint) {
      mismatches.push(`a1/pair${p}/disjoint`);
    }
    if (!same(round(Math.abs(ivs[i].value - ivs[j].value)), onDisk.hin1a1.pairs[p].absoluteGap)) {
      mismatches.push(`a1/pair${p}/absoluteGap`);
    }
    if (!same(round(Math.abs(ivs[i].value - ivs[j].value)
      / Math.max(ivs[i].halfWidth, ivs[j].halfWidth), 6),
    onDisk.hin1a1.pairs[p].ratioToHalfWidth)) mismatches.push(`a1/pair${p}/ratioToHalfWidth`);
  }
  checks += 2;
  const rA1 = onDisk.hin1a1.pairs.every((p) => p.disjoint);
  if (rA1 !== onDisk.hin1a1.pass) mismatches.push('a1/pass');
  const expectVerdict = rA1 ? 'PASS'
    : `FAIL — ${onDisk.hin1a1.pairs.filter((p) => !p.disjoint).map((p) => p.pair).join(' · ')}`;
  if (expectVerdict !== onDisk.hin1a1.verdict) mismatches.push('a1/verdict');
  /* ---- the COMPANIONS, off disk ---- */
  const c = onDisk.companions;
  checks += 8;
  if (!same(round(lookShareOf(dArmed)), c.lookShareOfDecisions.value)) mismatches.push('companions/lookShare');
  if (!same(round(declineShareOf(dArmed)), c.declineShareOfDecisions.value)) mismatches.push('companions/declineShare');
  if (!same(round(c.lookShareOfDecisions.value + c.declineShareOfDecisions.value),
    c.sharesSumToOne)) mismatches.push('companions/sharesSumToOne');
  if (sum(dArmed.map((r) => r.decisionsSeen)) !== c.decisionsSeenArmed) mismatches.push('companions/decisionsSeen');
  if (sum(dArmed.map((r) => r.looks)) !== c.looksArmed) mismatches.push('companions/looks');
  if (sum(dArmed.map((r) => r.declines)) !== c.declinesArmed) mismatches.push('companions/declines');
  if (!same(round(ratio(sum(dArmed.map((r) => r.looks)), dArmed.length)), c.looksPerMatch)) {
    mismatches.push('companions/looksPerMatch');
  }
  if (!same(round(ratio(sum(dArmed.map((r) => r.turnTicksPaid)), sum(dArmed.map((r) => r.looks)))),
    c.turnTicksPerLook)) mismatches.push('companions/turnTicksPerLook');
  /* ---- the per-body spread (no interval, by canon) ---- */
  const g = dArmed.map((r) => r.gidsThatLooked);
  checks += 3;
  if (!same(round(ratio(sum(g), dArmed.length)), c.perBodySpread.gidsThatLookedPerMatch)) {
    mismatches.push('companions/gidsPerMatch');
  }
  if (Math.min(...g) !== c.perBodySpread.gidsThatLookedMin) mismatches.push('companions/gidsMin');
  if (Math.max(...g) !== c.perBodySpread.gidsThatLookedMax) mismatches.push('companions/gidsMax');
  /* ---- DORMANCY, the MATCHED FLOOR and the ARMING RECEIPT, off disk ---- */
  checks += 3;
  if (!dShut.every((r) => r.decisionsSeen === 0 && r.looks === 0
    && r.looksBySituation.every((x) => x === 0))) mismatches.push('dormancy/shutLedgerOnDisk');
  if (!dRows.every((r) => r.viewsBuilt > 0 && r.bodiesViewed > 0)) {
    mismatches.push('matchedFloor/inLawSilentOnDisk');
  }
  const dSeeds = [...new Set(dRows.map((r) => r.seed))].sort((a, b) => a - b);
  if (!dSeeds.every((s) => dRows.find((r) => r.seed === s && r.arm === 'lookShut')!.outcomeDigest
    !== dRows.find((r) => r.seed === s && r.arm === 'lookArmed')!.outcomeDigest)) {
    mismatches.push('armsDistinguishable/onDisk');
  }
}
gates.gFacesFromDisk = mismatches.length === 0;
rmSync(STAGING, { force: true });

/* ---- the FINAL body: every gate written, THEN hashed (DF-C0 §CORR item 2) ---- */
const body = {
  ...bodyCore,
  faceReDerivation: { checks, mismatches },
  gates,
  gatesAllGreen: Object.values(gates).every(Boolean),
};
const ALL_GREEN = body.gatesAllGreen;
const artifact = {
  ...body,
  bodySha256: createHash('sha256').update(JSON.stringify(body)).digest('hex'),
};
/** ⭐ RED ROUTING (#334 item 3, REQUIRED): a RED run never touches the canonical path. */
const outPath = ALL_GREEN || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
const tmp = `${outPath}.tmp`;
writeFileSync(tmp, `${JSON.stringify(artifact, null, 2)}\n`);
renameSync(tmp, outPath);

banner(`\nwrote ${outPath}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
banner(`\nH-IN.1(a1) = ${hin1a1.verdict}`);
for (let s = 0; s < N_SIT; s++) {
  banner(`  ${SITUATIONS[s]}: ${a1Intervals[s].value} [${a1Intervals[s].ciLo}, `
    + `${a1Intervals[s].ciHi}] hw ${a1Intervals[s].halfWidth}`
    + `  (${situationNumerators[s]} / ${situationDenominators[s]})`);
}
for (const p of a1Pairs) {
  banner(`  ${p.pair}: disjoint=${p.disjoint} gap=${p.absoluteGap} gap/hw=${p.ratioToHalfWidth}`);
}
banner(`companions: look ${lookShare.value} · decline ${declineShare.value}`
  + ` · gidsThatLooked ${Math.min(...gidsThatLooked)}–${Math.max(...gidsThatLooked)}`);
banner(`walk-side predicate pins: ${predicatePins.length}, all pass=${PREDICATE_PINS_OK}`);
banner(`re-derivation: ${checks} checks, ${mismatches.length} mismatches`);
process.exit(ALL_GREEN ? 0 : 1);
