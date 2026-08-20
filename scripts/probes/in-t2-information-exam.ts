#!/usr/bin/env tsx
/**
 * ============================================================================
 * IN-T2 — THE INFORMATION EXAM (instrument-only; H-IN.1(a)+(b) on virgin seeds)
 * ============================================================================
 * ORDERED BY COMMANDER RULING #332 item 6, bound by
 * `docs/world-model/IN-SNAPSHOT-CONTRACT.md` §1 (H-IN.1 / H-IN.2) and §2
 * (M-IN.1 the snapshot law · M-IN.2 scanning as an ACT · M-IN.3 no new knobs ·
 * M-IN.4 scope & debts), and by §4's own sentence: "an all-scanning world is a
 * FAILURE mode (the look must cost real time, so situations must differentiate)".
 *
 * ⭐ INSTRUMENT-ONLY. `src/**` is UNTOUCHED by this stage: the #329 §CORR 1
 * riders (the argmax `- loss` selection pin + the two inert-guard pins) landed
 * in their own TESTS-ONLY commit BEFORE this file was frozen. `gSrcUntouched`
 * proves it at run time.
 *
 * ⭐⭐ THE SCORED CLAIMS — PRE-REGISTERED, FROZEN BEFORE THE BATTERY, NEVER
 * RE-CUT AFTER SIGHT:
 *
 *   H-IN.1(a) — LOOKS ARE GENUINELY TAKEN AT THEIR DERIVED COST, two conjuncts:
 *     (a1) USAGE NON-DEGENERACY **BY SITUATION** (#329 §CORR item 3's form,
 *          binding: never per-body universality — the keeper's emergent refusal
 *          to turn his back is FOOTBALL, not failure). The three situation look
 *          shares (carrier / off-ball outfield / keeper, the ledger's OWN
 *          buckets, classified by src's OWN `inLookSituation`) must be
 *          PAIRWISE RESOLVED DISTINCT: all THREE pairs of seed-clustered
 *          bootstrap intervals DISJOINT.
 *     (a2) THE ALL-SCANNING GUARD, re-checked with #329 §CORR item 2's
 *          PAY-AFTER-SERVE approximation NAMED: the DECLINE share of decisions
 *          must stay RESOLVEDLY ABOVE ZERO — its 95 % seed-clustered bootstrap
 *          interval's LOWER edge > 0. The cost must bite.
 *
 *   H-IN.1(b) — INFORMATION DIFFERENTIATES OUTCOMES (the contract's own
 *     sentence: "at matched situations, the carrier acting on a FRESH snapshot
 *     chooses/releases resolvedly better than the one acting on a STALE one" —
 *     the user's 接球前观察 ⇒ 零处理传到应该传到的人).
 *     THE CONJUNCT IS THE **BETWEEN-ARM LIMB AT MATCHED STRATA** (the cleaner
 *     limb, frozen as the conjunct here): the STRATUM-STANDARDISED flip-vs-truth
 *     share must be RESOLVEDLY LOWER in the armed arm — the paired
 *     seed-clustered bootstrap interval of (standardised armed - shut) EXCLUDES
 *     ZERO and lies BELOW it. Standardisation holds the SHUT arm's stratum
 *     weights fixed, so the two arms are compared at MATCHED situations.
 *     THE SUPPORTING LIMB (REPORTED, NEVER GATED): within an arm, at the same
 *     matched strata, FRESH-book carrier moments flip less than STALE-book ones.
 *     ⚠⚠ THE CONFOUND, STATED HONESTLY AND FROZEN AS THE REASON FOR THE SPLIT:
 *     freshness is NOT randomly assigned WITHIN an arm — a carrier whose book is
 *     fresh is a carrier who has just looked or has just been facing the play,
 *     which is itself a football situation. The within-arm contrast is therefore
 *     SUPPORTING evidence only; the door is randomised BETWEEN arms (the same
 *     seed walked twice, the look the only difference), which is why the
 *     between-arm limb carries the conjunct.
 *
 * ⭐ THE MEASURES, FROZEN BEFORE THE CODE (§P2 of the stage doc):
 *   · FRESHNESS = the carrier's BOOK AGE at the decision, in TICKS: the mean
 *     over every other body on the pitch of (the age of that body's entry in the
 *     carrier's book when the carrier is reading him from MEMORY, else ZERO —
 *     a body inside the field, or never seen, is at TRUTH and carries no age).
 *     THE CUT IS DERIVED, NOT CHOSEN: FRESH iff bookAgeMeanTicks <=
 *     IN_LOOK_AGE_CAP_TICKS (29 — the FULL REVERSAL, IN-T1's own age cap, the
 *     widest turn the shipped form can charge for). No taste constant (#200).
 *   · OUTCOME = the FLIP-vs-TRUTH share, IN-T0 §R2 / IN-T1 §R4's instrument
 *     REUSED VERBATIM: at a carrier moment the shipped perceived-choice oracle
 *     is priced twice, once on TRUTH and once on the carrier's REAL BOOK, and a
 *     FLIP is a different chosen target. ⚠ ORACLE LIMITS RESTATED (IN-T1 §R4,
 *     verbatim): "the oracle is the PERCEIVED-CHOICE chooser, not
 *     decideCarrier's full ladder; and it is read at EVERY carrier tick (a
 *     superset of his decision ticks), so the flip share is a LOWER BOUND. Its
 *     denominator MOVES between arms because the arms are different worlds."
 *     A LOWER BOUND, and the DECLARED oracle.
 *   · MATCHING = SITUATION STRATA, frozen before the battery: PRESSURE (nearest
 *     opponent to the carrier <= TOUCH_CONTROL_DIST, the substrate's OWN
 *     pressure switch, anchored) x ZONE (the carrier's progress along his own
 *     attackDir, in PITCH_LENGTH thirds) = 6 cells.
 *
 * ⭐ THE FROZEN CI RULES (pre-registered; NEVER re-cut after sight) — the DF-T3
 *   idiom, inherited verbatim:
 *   · PER-SEED CELLS are stored so every headline re-derives (canon, home
 *     ruling #282.2(ii)).
 *   · BETWEEN-ARM faces (the same seeds walked twice, the look the only
 *     difference) use the PAIRED DELTA (armed - shut) with a SEED-CLUSTERED
 *     PAIRED bootstrap: resample the walked seeds with replacement, compute BOTH
 *     arms over the SAME resampled seed set in every draw, then the delta.
 *     RESOLVED iff the interval EXCLUDES ZERO.
 *   · WITHIN-ARM contrasts ((a1)'s three situations, (a2)'s decline share, the
 *     supporting fresh-vs-stale limb) are UNPAIRED: each side gets its own
 *     seed-clustered bootstrap interval and the frozen test is INTERVAL OVERLAP
 *     — DISJOINT = resolved apart.
 *   · 2,000 resamples everywhere; 95 % percentile intervals; every bootstrap's
 *     rng is seeded from its own published STATS BASE (block-base discipline).
 *   · Canon VERBATIM: "a starred finding states its |D|/half-width ratio"
 *     (home BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2).
 *   · Canon (paraphrase): moving denominators disclosed per face (home PW-C0
 *     §CORR item 2) — every face publishes its own `denNote`.
 *   · Canon (paraphrase): clock honesty — every rate on the 240 s match clock or
 *     dual-axis; APPLIED values, never nominal.
 *   · Canon VERBATIM (NEW, ruling #332 item 3): "a scored face's walk-side
 *     predicate is pinned — anchored extraction or fixture — because the
 *     re-derivation gate proves arithmetic, not definitions" (home DF-T3
 *     §COMMANDER CORRECTIONS item 2). EVERY walk-side predicate this stage
 *     scores on is pinned by a HAND-COMPUTED FIXTURE evaluated in the
 *     CONSTRUCTION CLASS, before any battery runs — see §2b.
 *
 * REPORTED, NEVER GATED (H-IN.2's institutions):
 *   ⭐ THE SEASON LADDER (goals x generation, BOTH arms, paired league seeds,
 *     against the atkFrozen FLOOR +0.2211 QUOTED as a REFERENCE LINE — the
 *     goalsPerMatch 2.93 -> 1.80 receipt weighed at ladder grain, #332 item 6),
 *     plus passCompletion and interceptions at ladder grain.
 *   ⭐ THE PRESS-IMMUNITY FACE (压迫压的是没看的人吗 — the doctrine's 时间预算
 *     攻击 sharpened): the outcome of pressure on carriers whose book was FRESH
 *     vs STALE at reception.
 *   ⭐ HOLDING USAGE (拿住球 gains a PRODUCT) with its per-seed CORRELATION to
 *     look usage — reported, CLAIMING NOTHING (contract §4: no promise that
 *     holding rises).
 *   · the R-乙 chain faces (Q01 · Q05 · Q06 · Q14) · the DIRECTION MIX (Q07) ·
 *     the BODY-TICK ATTRIBUTION SPLIT (passive vs look) · the look usage and
 *     cost receipts at exam grain (turn ticks inside the derived [15, 29] band).
 *   ⛔ NAMED OUT (#332 item 6, explicitly): the passive-vs-look HALF-SPLIT
 *     COUNTERFACTUAL. It needs a sub-flag src change and is a later slice if the
 *     number matters. The BODY-TICK attribution is published instead, labelled
 *     as an attribution and never as a counterfactual.
 *
 * ⭐ CANON HONOURED (sentences COPIED from docs/world-model/CANON.md, #301):
 *   · freeze-before-battery (home ruling #266.3(c)).
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not
 *     in the schema never enters the body; forbidden-name lists are retired"
 *     (home PC-T0 §CORR item 1).
 *   · per-seed cells (home ruling #282.2(ii)).
 *   · "the re-derivation gate covers EVERY published face; a percentile face
 *     requires stored bins" (home PC-C0 §CORR item 4).
 *   · "a scored face's walk-side predicate is pinned — anchored extraction or
 *     fixture — because the re-derivation gate proves arithmetic, not
 *     definitions" (home DF-T3 §CORR item 2).
 *   · "a field carries the unit its name claims" (home ruling #294 item 3).
 *   · "a src-extracted constant pins its extraction to the NAMED call site —
 *     anchored match + line receipt — never first-occurrence" (home BK-C0
 *     §CORR item 1).
 *   · "a max-min face reports a noise-floor comparison, not a zero-null CI"
 *     (home PC-T1 §CORR item 3).
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
 *     matchFlags; true since #155, stated now, test-pinned; refines #270's E4
 *     correction; matches the perf diagnostic)" (home ruling #283.2(iv)).
 *   · seed discipline: BOOKED = WALKED; blocks consumed whole; stats step >= 200.
 *   · DF-C0 §CORR item 2 (ruling #321): the body is hashed LAST, after EVERY
 *     gate is written — including `gFacesFromDisk`, which re-parses a STAGING
 *     file off disk. A RED run writes a SIDE PATH.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: INT2_MODE (smoke|full, REQUIRED) · INT2_N · INT2_GENS · INT2_OUT.
 *   ANY other `INT2_*` var is a FATAL refusal, and so is ANY engine env door.
 *   An override run (smoke / N / GENS / OUT) may NOT write the canonical path.
 *
 * RUN: INT2_MODE=full npx tsx scripts/probes/in-t2-information-exam.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) ·
 *       2 = an env refusal · 3 = the construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { Match, BK_CONE_TICKS, bkFacingExtraTicks } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import {
  DT, MATCH_DURATION, TOUCH_CONTROL_DIST, PITCH_LENGTH, HALF_L,
} from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { inFieldDotMin, type InSnapshotField } from '../../src/ai/inSnapshotView';
import { IN_LOOK_AGE_CAP_TICKS, inLookTurnTicks } from '../../src/ai/inLookAct';
import {
  choosePerceivedPassTarget, passChoiceCandidateGids,
} from '../../src/ai/perceivedPassChoice';
import { capturePerceptionTruth } from '../../src/ai/perceptionSnapshot';
import type { PerceptionSnapshot, PerceptionTruth } from '../../src/ai/perceptionSnapshot';
import { randomGenome, GENE_KEYS } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import type { Player } from '../../src/sim/Player';

const banner = (s: string): void => { process.stdout.write(`${s}\n`); };

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE                                               */
/* ========================================================================== */
const ENV_WHITELIST = ['INT2_MODE', 'INT2_N', 'INT2_GENS', 'INT2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE_ARMED', 'EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'A4_WORLD',
  'EMERGENT_POS', 'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE',
  'CONTROL_REACH_SCALE', 'SPEED_TIME_SCALE', 'EVO_', 'SIM_'];
for (const k of Object.keys(process.env)) {
  if (k.startsWith('INT2_') && !(ENV_WHITELIST as readonly string[]).includes(k)) {
    console.error(`ENV REFUSAL: ${k} is not on the whitelist`);
    process.exit(2);
  }
  if (ENGINE_DOORS.some((d) => k === d || k.startsWith(d))) {
    console.error(`ENV REFUSAL: engine door ${k} is set`);
    process.exit(2);
  }
}
type Mode = 'smoke' | 'full';
const MODE = process.env.INT2_MODE as Mode | undefined;
if (MODE !== 'smoke' && MODE !== 'full') {
  console.error('ENV REFUSAL: INT2_MODE must be smoke|full');
  process.exit(2);
}
const N_ENV = process.env.INT2_N === undefined ? null : Number(process.env.INT2_N);
const GENS_ENV = process.env.INT2_GENS === undefined ? null : Number(process.env.INT2_GENS);
const OUT_OVERRIDE = process.env.INT2_OUT ?? null;
const CANONICAL_OUT = 'docs/world-model/data/in-t2-information-exam.json';
const OUT = OUT_OVERRIDE ?? CANONICAL_OUT;
const IS_OVERRIDE = OUT_OVERRIDE !== null || MODE !== 'full' || N_ENV !== null || GENS_ENV !== null;
if (IS_OVERRIDE && OUT === CANONICAL_OUT) {
  console.error('REFUSAL: an override run (smoke / N / GENS / OUT) may not write the canonical path');
  process.exit(2);
}

/* ========================================================================== */
/* §1 SEEDS — BOOKED = WALKED, the block consumed whole                       */
/* ========================================================================== */
/** IN-T2's OWN booked block (ruling #332 item 6): 12,516,000–999. */
const BLOCK_BASE = 12_516_000;
const RECEIPT_SEED = BLOCK_BASE + 999;
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 40 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
/**
 * THE SUB-RANGES, DECLARED BEFORE THE RUN (BOOKED = WALKED reported after):
 *   12,516,000 – 12,516,039  the exam battery (40 paired seeds)
 *   12,516,800 – 12,516,802  the in-band smoke prefix
 *   12,516,900 – 12,516,903  the season ladder's four league seeds (the SAME four
 *                            leagues in BOTH arms — the paired design)
 *   12,516,999               the xxx,999 world-construction receipt seed (WALKED)
 * THE BLOCK 12,516,000–999 IS CONSUMED WHOLE OF RECORD either way.
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
/** 0 = carrier · 1 = off-ball outfield · 2 = keeper (src's OWN `inLookSituation` buckets) */
const SITUATIONS = ['carrier', 'offBall', 'keeper'] as const;

const L3_DOSE = poolT1DoseCells(JSON.parse(
  readFileSync('docs/world-model/data/l3-t1-convergence-exam.json', 'utf8'),
) as Record<string, unknown>) as readonly L3DoseCell[];
const PC_DOSE = poolPcDoseTable(JSON.parse(
  readFileSync('docs/world-model/data/pc-t1-learning-exam.json', 'utf8'),
) as Record<string, unknown>);

const readSrc = (rel: string): string => readFileSync(rel, 'utf8');
/**
 * ⭐ ANCHORED EXTRACTION (canon, home BK-C0 §CORR item 1): every constant this stage's
 * WALK-SIDE PREDICATES consume is pulled from ONE named line that must occur EXACTLY ONCE
 * in its file. Never first-occurrence, never a re-typed literal. Line numbers are REPORTED,
 * never asserted — the line number is the thing that drifts.
 */
interface Anchor { id: string; file: string; line: string; re: RegExp }
const ANCHORS: readonly Anchor[] = [
  {
    id: 'bkTurnTicksForm',
    file: 'src/sim/Match.ts',
    line: '  const turnTicks = Math.ceil(theta / (TURN_RATE * DT));',
    re: /Math\.ceil\(theta \/ \((TURN_RATE) \* DT\)\)/,
  },
  {
    id: 'touchControlDist',
    file: 'src/sim/constants.ts',
    line: 'export const TOUCH_CONTROL_DIST = 4.2;',
    re: /TOUCH_CONTROL_DIST = (\d+(?:\.\d+)?);/,
  },
  {
    id: 'pitchLength',
    file: 'src/sim/constants.ts',
    line: 'export const PITCH_LENGTH = 90 * FIELD_SCALE;',
    re: /PITCH_LENGTH = (\d+(?:\.\d+)?) \* FIELD_SCALE;/,
  },
];
interface AnchorReceipt {
  id: string; file: string; line: string; re: string;
  matches: number; lineNumbers: number[]; captured: string;
}
const anchorReceipts: AnchorReceipt[] = ANCHORS.map((a) => {
  const lines = readSrc(a.file).split('\n');
  const hits = lines.map((l, i) => (l === a.line ? i + 1 : 0)).filter((n) => n > 0);
  const m = a.re.exec(a.line);
  return {
    id: a.id, file: a.file, line: a.line, re: a.re.source,
    matches: hits.length, lineNumbers: hits,
    captured: m === null ? 'NO-MATCH' : (m[1] as string),
  };
});
/**
 * ⭐ THE LIVE CROSS-CHECK (IN-T1 §P2(c)'s, reused): outside the BK cone the shipped
 * `bkFacingExtraTicks` returns `turnTicks - BK_CONE_TICKS`, so the look's own price must
 * equal it plus the cone at every angle. A text match alone would not catch a drift.
 */
const turnFormChecks: Array<{ deg: number; ours: number; shippedPlusCone: number }> = [];
for (let deg = 100; deg <= 180; deg += 10) {
  const theta = (deg * Math.PI) / 180;
  const shipped = bkFacingExtraTicks(
    { x: 1, y: 0 }, Math.cos(theta) * 10, Math.sin(theta) * 10, 0, 0,
  );
  turnFormChecks.push({
    deg, ours: inLookTurnTicks(theta), shippedPlusCone: shipped + BK_CONE_TICKS,
  });
}
const ANCHORS_OK = anchorReceipts.every((r) => r.matches === 1)
  && anchorReceipts.find((r) => r.id === 'bkTurnTicksForm')!.captured === 'TURN_RATE'
  && Number(anchorReceipts.find((r) => r.id === 'touchControlDist')!.captured) === TOUCH_CONTROL_DIST
  && Number(anchorReceipts.find((r) => r.id === 'pitchLength')!.captured) === 90
  && turnFormChecks.every((c) => c.ours === c.shippedPlusCone)
  && IN_LOOK_AGE_CAP_TICKS === Math.ceil(Math.PI / (TURN_RATE * DT));
if (!ANCHORS_OK) {
  console.error('CONSTRUCTION CLASS: an anchored extraction did not resolve', anchorReceipts);
  process.exit(3);
}

/* ========================================================================== */
/* §2a THE WALK-SIDE PREDICATES — the SCORED faces' definitions, in one place  */
/* ========================================================================== */
/** the DERIVED freshness cut: the FULL REVERSAL (IN-T1's own age cap), never a chosen number */
const FRESH_CUT_TICKS = IN_LOOK_AGE_CAP_TICKS;
const PRESSURE_R = TOUCH_CONTROL_DIST;
const N_ZONES = 3;
const N_PRESS = 2;
const N_STRATA = N_PRESS * N_ZONES;
const N_FRESH = 2;
const STRATUM_NAMES: string[] = [];
for (const pr of ['free', 'pressed']) {
  for (const z of ['defThird', 'midThird', 'attThird']) STRATUM_NAMES.push(`${pr}:${z}`);
}
const FRESH_NAMES = ['freshBook', 'staleBook'] as const;

/** PRESSURE: the substrate's OWN pressure switch, at the anchored radius. */
const pressIndexOf = (nearestOppMetres: number): number =>
  (nearestOppMetres <= PRESSURE_R ? 1 : 0);
/**
 * ZONE: the carrier's PROGRESS along his own attacking direction, in PITCH_LENGTH thirds.
 * progress = (x * attackDir + HALF_L) / PITCH_LENGTH, clamped into [0, 1); thirds by floor.
 */
const zoneIndexOf = (x: number, attackDir: number): number => {
  const progress = (x * attackDir + HALF_L) / PITCH_LENGTH;
  const p = progress < 0 ? 0 : progress > 0.999999999 ? 0.999999999 : progress;
  return Math.floor(p * N_ZONES);
};
const stratumIndexOf = (nearestOppMetres: number, x: number, attackDir: number): number =>
  pressIndexOf(nearestOppMetres) * N_ZONES + zoneIndexOf(x, attackDir);
/** FRESHNESS: the DERIVED cut on the carrier's book age at the decision. */
const freshIndexOf = (bookAgeMeanTicks: number): number =>
  (bookAgeMeanTicks <= FRESH_CUT_TICKS ? 0 : 1);

/* ========================================================================== */
/* §2b ⭐⭐ THE WALK-SIDE PREDICATE PINS — canon (NEW, ruling #332 item 3)      */
/* ========================================================================== */
/**
 * Canon VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
 * FIXTURE — because the re-derivation gate proves arithmetic, not definitions" (home:
 * DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2). `gFacesFromDisk` re-derives the
 * ARITHMETIC of every published face; it cannot tell whether `pressIndexOf` means what the
 * prose says. THESE FIXTURES ARE THAT PROOF, hand-computed, evaluated in the CONSTRUCTION
 * CLASS — before a single battery walk — and a disagreement BITS the run (exit 3, nothing
 * written). Each case names the reason it discriminates.
 */
interface PredicatePin { predicate: string; case: string; expected: number; actual: number }
const predicatePins: PredicatePin[] = [];
const pin = (predicate: string, name: string, expected: number, actual: number): void => {
  predicatePins.push({ predicate, case: name, expected, actual });
};
/* --- PRESSURE: the switch is at the anchored radius, and it is INCLUSIVE (<=) --- */
pin('pressIndexOf', 'nearest opponent 0 m — the tightest possible press', 1, pressIndexOf(0));
pin('pressIndexOf', `exactly at TOUCH_CONTROL_DIST (${PRESSURE_R} m) — INCLUSIVE`, 1,
  pressIndexOf(PRESSURE_R));
pin('pressIndexOf', 'a hair outside the radius — FREE', 0, pressIndexOf(PRESSURE_R + 1e-9));
pin('pressIndexOf', 'half a pitch away — FREE', 0, pressIndexOf(HALF_L));
pin('pressIndexOf', 'nobody on the pitch (Infinity) — FREE', 0, pressIndexOf(Infinity));
/* --- ZONE: thirds of PROGRESS along the carrier's OWN attacking direction --- */
pin('zoneIndexOf', 'his own goal line, attacking +x — DEFENSIVE third', 0, zoneIndexOf(-HALF_L, 1));
pin('zoneIndexOf', 'the halfway line, attacking +x — MIDDLE third', 1, zoneIndexOf(0, 1));
pin('zoneIndexOf', 'the opponent goal line, attacking +x — ATTACKING third', 2,
  zoneIndexOf(HALF_L, 1));
pin('zoneIndexOf', '⭐ THE SAME POINT, attacking -x — the MIRROR is the ATTACKING third', 2,
  zoneIndexOf(-HALF_L, -1));
pin('zoneIndexOf', '⭐ the mirror of the opponent goal line, attacking -x — DEFENSIVE third', 0,
  zoneIndexOf(HALF_L, -1));
pin('zoneIndexOf', 'a third short of halfway, attacking +x — DEFENSIVE third', 0,
  zoneIndexOf(-HALF_L + PITCH_LENGTH / 3 - 1e-6, 1));
pin('zoneIndexOf', 'exactly a third up, attacking +x — MIDDLE third (lower edge inclusive)', 1,
  zoneIndexOf(-HALF_L + PITCH_LENGTH / 3, 1));
pin('zoneIndexOf', 'past the goal line (clamped) — still the ATTACKING third', 2,
  zoneIndexOf(HALF_L + 50, 1));
/* --- THE STRATUM COMPOSITION: press x zone, in the published order --- */
pin('stratumIndexOf', 'free + defensive third = cell 0', 0, stratumIndexOf(50, -HALF_L, 1));
pin('stratumIndexOf', 'free + attacking third = cell 2', 2, stratumIndexOf(50, HALF_L, 1));
pin('stratumIndexOf', 'pressed + defensive third = cell 3', 3, stratumIndexOf(1, -HALF_L, 1));
pin('stratumIndexOf', 'pressed + attacking third = cell 5', 5, stratumIndexOf(1, HALF_L, 1));
/* --- FRESHNESS: the DERIVED cut, at the full reversal, INCLUSIVE on the fresh side --- */
pin('freshIndexOf', 'a book with no age at all — FRESH', 0, freshIndexOf(0));
pin('freshIndexOf', `exactly at the full reversal (${FRESH_CUT_TICKS} ticks) — FRESH`, 0,
  freshIndexOf(FRESH_CUT_TICKS));
pin('freshIndexOf', 'one tick past the full reversal — STALE', 1, freshIndexOf(FRESH_CUT_TICKS + 1));
pin('freshIndexOf', 'IN-T1 lookShut\'s published mean book age (1649.3 ticks) — STALE', 1,
  freshIndexOf(1649.32209226));
pin('freshIndexOf', 'IN-T1 lookArmed\'s published mean book age (56.9 ticks) — STALE', 1,
  freshIndexOf(56.8843572535));
const PREDICATE_PINS_OK = predicatePins.every((p) => p.expected === p.actual);
if (!PREDICATE_PINS_OK) {
  console.error('CONSTRUCTION CLASS: a walk-side predicate pin FAILED',
    predicatePins.filter((p) => p.expected !== p.actual));
  process.exit(3);
}

/* ========================================================================== */
/* §2c THE ARMS                                                               */
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
 * ⭐ THE ARMS (frozen at dispatch, #332 item 6): shut = the world-9 stack + IN-T0's
 * `inSnapshotLaw` at F2 (IN-T1's OWN `lookShut` world, the matched floor); armed = the same
 * + `inLookAct`. `inLookAct` is the ONLY difference. ⭐ THE DF DOORS ARE SHUT ON BOTH ARMS
 * (#332 item 6, explicit) — one seam family per exam.
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
    /** ⭐ THE DF DOORS ARE SHUT ON BOTH ARMS (#332 item 6) */
    dfDoorsShutBothArms: m.dfAssignPersist === false && m.dfSurface === false,
    /** the BANKED O2 look seam stays shut — IN-T1 built NEW (its §P2(d)) */
    o2LookShut: mm.o2Look === false,
  };
};

/* ========================================================================== */
/* §3 THE FLIP INSTRUMENT — IN-T0 §R2 / IN-T1 §R4's oracle, REUSED VERBATIM    */
/* ========================================================================== */
interface Remembered { x: number; y: number; vx: number; vy: number; tick: number }
/** the snapshot the oracle prices on: full truth, with the named gids replaced by memory */
const oracleSnapshotWith = (
  truth: PerceptionTruth, observerGid: number, memory: ReadonlyMap<number, Remembered>,
): PerceptionSnapshot => ({
  tick: truth.tick,
  observerGid,
  awareness: 1,
  ball: {
    pos: { x: truth.ball.pos.x, y: truth.ball.pos.y },
    vel: { x: truth.ball.vel.x, y: truth.ball.vel.y },
    ownerGid: truth.ball.ownerGid,
    observedTick: truth.tick,
    ageTicks: 0,
  },
  players: truth.players.filter((p) => !p.sentOff).map((p) => {
    const old = memory.get(p.gid);
    return {
      gid: p.gid,
      side: p.side,
      pos: old === undefined ? { x: p.pos.x, y: p.pos.y } : { x: old.x, y: old.y },
      vel: old === undefined ? { x: p.vel.x, y: p.vel.y } : { x: old.vx, y: old.vy },
      // ⚠ bodyDir is NEVER staled by this seam family (#324 item 4 scopes it to
      // position/velocity), so the oracle reads TRUTH facing on both sides of the pair.
      bodyDir: { x: p.bodyDir.x, y: p.bodyDir.y },
      observedTick: old === undefined ? truth.tick : old.tick,
      ageTicks: old === undefined ? 0 : truth.tick - old.tick,
    };
  }),
});

/* ========================================================================== */
/* §4 THE ROW — per-seed cells (canon: every headline re-derives)              */
/* ========================================================================== */
interface Row {
  arm: Arm;
  seed: number;
  worldOk: boolean;
  ticks: number;
  playingTicks: number;
  stepWallMs: number;
  /* ---- (A) IN-T0's OWN ledger ---- */
  viewsBuilt: number;
  bodiesViewed: number;
  readsInField: number;
  readsStale: number;
  readsColdStart: number;
  staleAgeTickSum: number;
  staleAgeMaxTicks: number;
  storeReaders: number;
  storeEntries: number;
  /* ---- (B) IN-T1's ledger (structurally ZERO on the shut arm) ---- */
  decisionsSeen: number;
  looks: number;
  declines: number;
  lockedDecisions: number;
  turnTicksPaid: number;
  completed: number;
  aborted: number;
  abortedBallArrived: number;
  passivePasses: number;
  passiveBodies: number;
  lookBodies: number;
  passiveAgeErasedTicks: number;
  lookAgeErasedTicks: number;
  lookGain: number;
  lookLoss: number;
  looksBySituation: number[];
  decisionsBySituation: number[];
  gidsThatLooked: number;
  /* ---- (C) THE FLIP ORACLE, pooled ---- */
  flipEval: number;
  flipAnyOut: number;
  flips: number;
  oracleReads: number;
  oracleStale: number;
  oracleStaleAgeTickSum: number;
  /* ---- (D) ⭐⭐ H-IN.1(b): the STRATUM x FRESHNESS cells ---- */
  /** length N_STRATA — carrier moments the oracle priced, by situation stratum */
  strataEval: number[];
  /** length N_STRATA — of those, FLIPS */
  strataFlips: number[];
  /** length N_STRATA * N_FRESH — the supporting within-arm limb's cells */
  strataFreshEval: number[];
  strataFreshFlips: number[];
  /** Σ bookAgeMeanTicks over priced moments (the freshness face's own numerator) */
  bookAgeTickSum: number;
  bookAgeMoments: number;
  /* ---- (E) ⭐ THE PRESS-IMMUNITY FACE (压迫压的是没看的人吗) ---- */
  /** index = pressedIdx * N_FRESH + freshIdx over open-play FIRST receptions */
  pressCellReceptions: number[];
  pressCellTurnovers: number[];
  /* ---- (F) the R-乙 chain + holding + equilibrium ---- */
  openSpells: number;
  openSpellTickSum: number;
  openSpellTouchSum: number;
  openFirstReceptions: number;
  openFirstReceptionsPressed: number;
  enginePasses: number;
  enginePassesCompleted: number;
  enginePassesForward: number;
  ownershipEpisodes: number;
  ownershipTicks: number;
  goals: number;
  shots: number;
  tackles: number;
  interceptions: number;
}
const zeros = (n: number): number[] => Array.from({ length: n }, () => 0);
const emptyRow = (arm: Arm, seed: number): Row => ({
  arm, seed, worldOk: false, ticks: 0, playingTicks: 0, stepWallMs: 0,
  viewsBuilt: 0, bodiesViewed: 0, readsInField: 0, readsStale: 0, readsColdStart: 0,
  staleAgeTickSum: 0, staleAgeMaxTicks: 0, storeReaders: 0, storeEntries: 0,
  decisionsSeen: 0, looks: 0, declines: 0, lockedDecisions: 0, turnTicksPaid: 0,
  completed: 0, aborted: 0, abortedBallArrived: 0, passivePasses: 0, passiveBodies: 0,
  lookBodies: 0, passiveAgeErasedTicks: 0, lookAgeErasedTicks: 0, lookGain: 0, lookLoss: 0,
  looksBySituation: zeros(3), decisionsBySituation: zeros(3), gidsThatLooked: 0,
  flipEval: 0, flipAnyOut: 0, flips: 0, oracleReads: 0, oracleStale: 0,
  oracleStaleAgeTickSum: 0,
  strataEval: zeros(N_STRATA), strataFlips: zeros(N_STRATA),
  strataFreshEval: zeros(N_STRATA * N_FRESH), strataFreshFlips: zeros(N_STRATA * N_FRESH),
  bookAgeTickSum: 0, bookAgeMoments: 0,
  pressCellReceptions: zeros(N_PRESS * N_FRESH), pressCellTurnovers: zeros(N_PRESS * N_FRESH),
  openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
  openFirstReceptions: 0, openFirstReceptionsPressed: 0,
  enginePasses: 0, enginePassesCompleted: 0, enginePassesForward: 0,
  ownershipEpisodes: 0, ownershipTicks: 0,
  goals: 0, shots: 0, tackles: 0, interceptions: 0,
});

interface Spell { team: 0 | 1; startTick: number; endTick: number; touches: number; origin: 'openPlay' | 'kickoff' | 'restart' }
/** THE TURNOVER WINDOW is DERIVED, not chosen: the full reversal (IN-T1's own age cap). */
const TURNOVER_WINDOW_TICKS = IN_LOOK_AGE_CAP_TICKS;
interface Pending { dueTick: number; side: 0 | 1; cell: number; resolved: boolean }

const nearestOpponentMetres = (m: Match, p: Player): number => {
  let best = Infinity;
  for (const o of m.teams[(1 - p.side) as 0 | 1].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
    if (d < best) best = d;
  }
  return best;
};

const walk = (seed: number, arm: Arm): Row => {
  const m = buildMatch(seed, arm);
  const row = emptyRow(arm, seed);
  row.worldOk = Object.values(worldConjuncts(m, arm)).every(Boolean);
  const dotMin = inFieldDotMin(F2);
  const spells: Spell[] = [];
  let cur: Spell | null = null;
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  const finish = (s: Spell, at: number): void => { s.endTick = at; spells.push(s); };
  const pending: Pending[] = [];
  let tick = 0;

  /**
   * ⭐ THE FRESHNESS MEASURE (the walk-side predicate pinned in §2b, computed here): the
   * carrier's BOOK AGE at this moment, meaned over EVERY other body on the pitch. A body
   * inside his field, or one he has never seen (IN-T0's cold-start rule serves TRUTH), is
   * at truth and contributes ZERO. Read out of the carrier's REAL book, which exists on
   * BOTH arms because IN-T0's law is armed on both.
   */
  const carrierBookAgeTicks = (): number => {
    const c = m.ball.owner;
    if (c === null || c.sentOff) return Number.NaN;
    const book = m.inSnapshotStore.get(c.gid);
    let ageSum = 0;
    let n = 0;
    for (const other of m.allPlayers) {
      if (other === c || other.sentOff) continue;
      n += 1;
      if (book === undefined) continue;
      const dx = other.pos.x - c.pos.x;
      const dy = other.pos.y - c.pos.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= 1e-9 || (c.heading.x * dx + c.heading.y * dy) / d >= dotMin) continue;
      const held = book.get(other.gid);
      if (held === undefined) continue;
      ageSum += m.simTick - held.tick;
    }
    return n === 0 ? Number.NaN : ageSum / n;
  };

  while (!m.finished) {
    const t0 = Date.now();
    m.step(DT);
    row.stepWallMs += Date.now() - t0;
    row.ticks += 1;
    tick += 1;

    /* ---- the press-immunity window: resolve every pending reception ---- */
    if (pending.length > 0) {
      const ownerNow = m.ball.owner;
      for (const p of pending) {
        if (p.resolved) continue;
        if (ownerNow !== null && !ownerNow.sentOff && ownerNow.side !== p.side) {
          row.pressCellTurnovers[p.cell] += 1;
          p.resolved = true;
        } else if (tick >= p.dueTick) {
          p.resolved = true;
        }
      }
      if (pending.every((p) => p.resolved)) pending.length = 0;
    }

    /* ---- the carrier's book age THIS TICK (used by BOTH (b) and the press face) ---- */
    const bookAge = carrierBookAgeTicks();

    /* ====== the R-乙 SPELL WALKER (Q01/Q05/Q14 VERBATIM, BK-T2 §(d)'s code) ====== */
    {
      const playing = m.phase === 'playing';
      const ownerGid = m.ball.owner?.gid ?? null;
      if (!playing) {
        if (cur !== null) { finish(cur, tick); cur = null; }
        prevOwnerGid = ownerGid;
      } else {
        if (ownerGid !== null) {
          const owner = m.allPlayers[ownerGid];
          const side = owner.side as 0 | 1;
          if (cur !== null && cur.team !== side) { finish(cur, tick); cur = null; }
          if (cur === null) {
            const origin: Spell['origin'] = m.kickoffKickGid === ownerGid ? 'kickoff'
              : m.restartKickGid === ownerGid ? 'restart' : 'openPlay';
            cur = { team: side, startTick: tick, endTick: tick, touches: 0, origin };
          }
          if (ownerGid !== prevOwnerGid) {
            cur.touches += 1;
            row.ownershipEpisodes += 1;
            if (cur.origin === 'openPlay' && cur.touches === 1) {
              const pressedIdx = pressIndexOf(nearestOpponentMetres(m, owner));
              row.openFirstReceptions += 1;
              if (pressedIdx === 1) row.openFirstReceptionsPressed += 1;
              /* ⭐ THE PRESS-IMMUNITY CELL: pressure x the receiver's OWN book freshness */
              if (Number.isFinite(bookAge)) {
                const cell = pressedIdx * N_FRESH + freshIndexOf(bookAge);
                row.pressCellReceptions[cell] += 1;
                pending.push({
                  dueTick: tick + TURNOVER_WINDOW_TICKS, side, cell, resolved: false,
                });
              }
            }
          }
          row.ownershipTicks += 1;
        }
        prevOwnerGid = ownerGid;
      }
    }

    if (m.phase !== 'playing') continue;
    row.playingTicks += 1;

    /* ---------------- THE FLIP ORACLE AT MATCHED MOMENTS ----------------
     * IN-T0 §R2 / IN-T1 §R4's instrument, verbatim. The carrier's REAL book is read
     * straight out of `match.inSnapshotStore` — genuinely present on BOTH arms. */
    const carrier = m.ball.owner;
    if (carrier === null || carrier.sentOff) continue;
    const book = m.inSnapshotStore.get(carrier.gid);
    if (book === undefined) continue;
    const truth = capturePerceptionTruth(m);
    const t = m.teams[carrier.side];
    const candidateGids = passChoiceCandidateGids(carrier, t.players);
    if (candidateGids.length === 0) continue;
    const memory = new Map<number, Remembered>();
    for (const other of truth.players) {
      if (other.sentOff || other.gid === carrier.gid) continue;
      const dx = other.pos.x - carrier.pos.x;
      const dy = other.pos.y - carrier.pos.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      const inField = d <= 1e-9
        || (carrier.heading.x * dx + carrier.heading.y * dy) / d >= dotMin;
      row.oracleReads += 1;
      if (inField) continue;
      const held = book.get(other.gid);
      if (held === undefined) continue; // never seen ⇒ IN-T0's cold-start rule serves truth
      memory.set(other.gid, { x: held.x, y: held.y, vx: held.vx, vy: held.vy, tick: held.tick });
      row.oracleStale += 1;
      row.oracleStaleAgeTickSum += truth.tick - held.tick;
    }
    const reach = m.reachProfiles();
    const fresh = choosePerceivedPassTarget({
      snapshot: oracleSnapshotWith(truth, carrier.gid, new Map()),
      passerGid: carrier.gid,
      candidateGids,
      attackDir: t.attackDir,
      reachProfiles: reach,
      valueAxis: m.edsValueAxis,
    });
    if (fresh === null) continue;
    row.flipEval += 1;
    if (memory.size > 0) row.flipAnyOut += 1;
    const believed = choosePerceivedPassTarget({
      snapshot: oracleSnapshotWith(truth, carrier.gid, memory),
      passerGid: carrier.gid,
      candidateGids,
      attackDir: t.attackDir,
      reachProfiles: reach,
      valueAxis: m.edsValueAxis,
    });
    const flipped = believed === null || believed.targetGid !== fresh.targetGid;
    if (flipped) row.flips += 1;
    /* ---- ⭐⭐ H-IN.1(b)'s CELLS: the stratum, and the freshness bin inside it ---- */
    if (Number.isFinite(bookAge)) {
      const s = stratumIndexOf(
        nearestOpponentMetres(m, carrier), carrier.pos.x, t.attackDir,
      );
      row.strataEval[s] += 1;
      if (flipped) row.strataFlips[s] += 1;
      const fi = s * N_FRESH + freshIndexOf(bookAge);
      row.strataFreshEval[fi] += 1;
      if (flipped) row.strataFreshFlips[fi] += 1;
      row.bookAgeTickSum += bookAge;
      row.bookAgeMoments += 1;
    }
  }
  if (cur !== null) finish(cur, m.simTick);
  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = open.reduce((a, s) => a + (s.endTick - s.startTick), 0);
  row.openSpellTouchSum = open.reduce((a, s) => a + s.touches, 0);
  row.goals = m.score[0] + m.score[1];
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  row.enginePassesForward = m.teams[0].stats.passesForward + m.teams[1].stats.passesForward;
  for (const tt of m.teams) {
    row.shots += tt.stats.shots;
    row.tackles += tt.stats.tackles;
    row.interceptions += tt.stats.interceptions;
  }
  /* ---- IN-T0's ledger ---- */
  const led = m.inSnapshotLedger;
  row.viewsBuilt = led.viewsBuilt;
  row.bodiesViewed = led.bodiesViewed;
  row.readsInField = led.readsInField;
  row.readsStale = led.readsStale;
  row.readsColdStart = led.readsColdStart;
  row.staleAgeTickSum = led.staleAgeTickSum;
  row.staleAgeMaxTicks = led.staleAgeMaxTicks;
  row.storeReaders = m.inSnapshotStore.size;
  let entries = 0;
  for (const b of m.inSnapshotStore.values()) entries += b.size;
  row.storeEntries = entries;
  /* ---- IN-T1's ledger ---- */
  const k = m.inLookLedger;
  row.decisionsSeen = k.decisionsSeen;
  row.looks = k.looks;
  row.declines = k.declines;
  row.lockedDecisions = k.lockedDecisions;
  row.turnTicksPaid = k.turnTicksPaid;
  row.completed = k.completed;
  row.aborted = k.aborted;
  row.abortedBallArrived = k.abortedBallArrived;
  row.passivePasses = k.passivePasses;
  row.passiveBodies = k.passiveBodies;
  row.lookBodies = k.lookBodies;
  row.passiveAgeErasedTicks = k.passiveAgeErasedTicks;
  row.lookAgeErasedTicks = k.lookAgeErasedTicks;
  row.lookGain = k.lookGain;
  row.lookLoss = k.lookLoss;
  row.looksBySituation = [...k.looksBySituation];
  row.decisionsBySituation = [...k.decisionsBySituation];
  row.gidsThatLooked = k.looksByGid.size;
  return row;
};

/* ========================================================================== */
/* §5 THE SEASON LADDER — ORDERED by #332 item 6, the DF-T3 idiom reused       */
/* ========================================================================== */
/**
 * ⭐ THE ARMS: `liveShut` = the LIVE (shipped) world + `inSnapshotLaw` at F2, the look door
 * SHUT; `liveArmed` = the same + `inLookAct`. Both armed through the League's OWN
 * `matchFlags` probe surface, which the shipped `createMatch` spread carries into every
 * fixture — nothing is hand-written onto `info.genome` (dose-placement canon, home ruling
 * #270.2). Canon VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON
 * omits matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction;
 * matches the perf diagnostic)" (home: ruling #283.2(iv)) — THE LADDER IS THE ECOLOGY, not
 * world 9. NO GENE IS FROZEN IN EITHER ARM. The atkFrozen FLOOR is NOT re-run: it is
 * DF-C0 §R4's published +0.2211, QUOTED as a reference line.
 */
type LadderArm = 'liveShut' | 'liveArmed';
const LADDER_ARMS: readonly LadderArm[] = ['liveShut', 'liveArmed'];
const LADDER_ARM_NOTE: Record<LadderArm, string> = {
  liveShut: 'THE LIVE WORLD + inSnapshotLaw at F2, the LOOK door SHUT (IN-T1\'s lookShut world).',
  liveArmed: 'THE LIVE WORLD + inSnapshotLaw at F2 + inLookAct, armed through '
    + 'League.matchFlags (the shipped createMatch spread). Nothing else differs.',
};
const ATK_FROZEN_FLOOR = 0.2211;
const ATK_FROZEN_FLOOR_SOURCE = 'DF-C0-DEFENSIVE-BRAIN.md §R4 (ruling #320 item 3 / #321 '
  + 'item 3): the atkFrozen arm\'s goals/match early(1–5)→late(16–20) delta +0.2211 '
  + '(half-width 0.1423, |Δ|÷hw 1.55). QUOTED, not re-run.';

interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; shotsOnTarget: number;
  tackles: number; interceptions: number; clearances: number; blocks: number;
  passes: number; passesCompleted: number;
  doorChecked: number; doorWrong: number;
  wallSeconds: number;
}
const round = (v: number, digits = 12): number =>
  (Number.isFinite(v) ? Number(v.toPrecision(digits)) : v);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);

const gen1Fingerprint = (leagueSeed: number): string => {
  const l = new League({ seed: leagueSeed });
  const rows2 = l.franchises.map((f) => {
    const g = f.coach.genome as unknown as Record<string, number>;
    const st = f.coach.style as unknown as Record<string, string>;
    return `${f.slot}|${(GENE_KEYS as readonly string[]).map((key) => g[key]).join(',')}`
      + `|${['formationDef', 'formationAtk', 'scheme'].map((key) => st[key]).join(',')}`;
  });
  return createHash('sha256').update(rows2.join('\n')).digest('hex');
};
const runLadderArm = (arm: LadderArm, leagueSeed: number, gens: number): LadderCell[] => {
  const league = new League({ seed: leagueSeed });
  league.matchFlags = arm === 'liveArmed'
    ? { inSnapshotLaw: true, inSnapshotField: F2, inLookAct: true }
    : { inSnapshotLaw: true, inSnapshotField: F2 };
  const cells: LadderCell[] = [];
  for (let gen = 1; gen <= gens; gen++) {
    const tGen = Date.now();
    let matches = 0;
    const acc = {
      goals: 0, shots: 0, shotsOnTarget: 0, tackles: 0, interceptions: 0,
      clearances: 0, blocks: 0, passes: 0, passesCompleted: 0,
    };
    let doorChecked = 0;
    let doorWrong = 0;
    while (!league.seasonDone) {
      const fx = league.nextFixture();
      if (fx === null) break;
      const match = league.createMatch(fx);
      doorChecked += 1;
      if (match.inLookAct !== (arm === 'liveArmed') || match.inSnapshotLaw !== true
        || match.inSnapshotField !== F2) doorWrong += 1;
      const res = match.runToCompletion();
      matches += 1;
      for (const s of res.stats) {
        acc.goals += s.goals;
        acc.shots += s.shots;
        acc.shotsOnTarget += s.shotsOnTarget;
        acc.tackles += s.tackles;
        acc.interceptions += s.interceptions;
        acc.clearances += s.clearances;
        acc.blocks += s.blocks;
        acc.passes += s.passes;
        acc.passesCompleted += s.passesCompleted;
      }
      league.applyResult(fx, res);
    }
    cells.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, shotsOnTarget: acc.shotsOnTarget,
      tackles: acc.tackles, interceptions: acc.interceptions,
      clearances: acc.clearances, blocks: acc.blocks,
      passes: acc.passes, passesCompleted: acc.passesCompleted,
      doorChecked, doorWrong,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    league.finishSeason();
  }
  return cells;
};

/* ========================================================================== */
/* §6 STATS BASES — the registry of record 64 (#332 item 4), floor 115,800     */
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
 * ⭐ THE REGISTRY OF RECORD IS 64 (ruling #332 item 4's CORRECTION — the running "59" was
 * stale since DF-T1). IN-C0's COMPLETED 56 + 114,200 (IN-C0/IN-C0-FIX, #317 item 4) +
 * 114,400 and 114,600 (DF-C0, #320 item 4) + 114,800 and 115,000 (DF-T1 §R7) + 115,200,
 * 115,400 and 115,600 (DF-T3, #332 item 5) = 64. DF-T2, IN-T0, IN-T1 and BK-C1 consumed ZERO.
 */
const REGISTRY_ADDITIONS: readonly number[] = [
  114_200, 114_400, 114_600, 114_800, 115_000, 115_200, 115_400, 115_600,
];
const STATS_PUBLISHED_BASES: readonly number[] = [
  ...new Set([...R9_INHERITED_BASES, ...REGISTRY_ADDITIONS]),
].sort((a, b) => a - b);
const REGISTRY_COMPLETE = R9_INHERITED_BASES.length === 56
  && STATS_PUBLISHED_BASES.length === 64
  && REGISTRY_ADDITIONS.every((b) => !R9_INHERITED_BASES.includes(b));
const STATS_BASE = 115_800;
const STATS_STEP = 200;
/** THREE draws ⇒ THREE bases, all booked (#332 item 6: stats from 115,800 on the lattice) */
const STATS_BASES_CONSUMED = [STATS_BASE, STATS_BASE + STATS_STEP, STATS_BASE + 2 * STATS_STEP] as const;
const minStatsGap = Math.min(...STATS_BASES_CONSUMED
  .flatMap((mine) => STATS_PUBLISHED_BASES.map((b) => Math.abs(mine - b))));

/* ========================================================================== */
/* §7 THE CONSTRUCTION CLASS — refuse BEFORE any battery (nothing written)     */
/* ========================================================================== */
const receiptMatch = buildMatch(RECEIPT_SEED, 'lookShut');
const RECEIPT = worldConjuncts(receiptMatch, 'lookShut');
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
/* §8 THE BATTERY                                                              */
/* ========================================================================== */
const LADDER_GENS = GENS_ENV ?? (MODE === 'full' ? 20 : 2);
const LADDER_SEEDS_ALL = [BLOCK_BASE + 900, BLOCK_BASE + 901, BLOCK_BASE + 902, BLOCK_BASE + 903];
const LADDER_SEEDS = MODE === 'smoke' ? LADDER_SEEDS_ALL.slice(0, 1) : LADDER_SEEDS_ALL;

banner(`IN-T2: mode=${MODE} battery=${SEEDS.length} seeds × 2 arms  ladder=${LADDER_SEEDS.length}`
  + ` leagues × ${LADDER_GENS} generations × ${LADDER_ARMS.length} arms`);
const tBattery0 = Date.now();
const rows: Row[] = [];
for (const seed of SEEDS) {
  for (const arm of ARMS) rows.push(walk(seed, arm));
  if ((seed - BLOCK_BASE) % 10 === 0 || seed === RECEIPT_SEED) {
    banner(`  … battery seed ${seed} paired (${((Date.now() - tBattery0) / 1000).toFixed(0)} s)`);
  }
}
const batteryWallSec = round((Date.now() - tBattery0) / 1000, 3);

const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
const gen1Fingerprints = LADDER_SEEDS.map((ls) => ({ leagueSeed: ls, sha256: gen1Fingerprint(ls) }));
for (const arm of LADDER_ARMS) {
  for (const ls of LADDER_SEEDS) {
    ladderCells.push(...runLadderArm(arm, ls, LADDER_GENS));
    banner(`  … ladder ${arm} seed ${ls} done (${((Date.now() - tLadder0) / 1000).toFixed(0)} s)`);
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
const ladderLeagueSeasons = LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS;
const ladderMatches = sum(ladderCells.map((c) => c.matches));

/* ========================================================================== */
/* §9 THE BETWEEN-ARM FACES — paired, seed-clustered (the DF-T3 idiom)         */
/* ========================================================================== */
const perMatch = (): number => 1;
const simSeconds = (r: Row): number => r.ticks * DT;
interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string; family: string }
const FACES: Record<string, FaceDef> = {
  /* ---------- the FLIP family — H-IN.1(b)'s raw (unstandardised) view ---------- */
  flipShare: {
    num: (r) => r.flips, den: (r) => r.flipEval,
    unit: 'share of priced carrier moments whose BELIEVED choice differs from the TRUTH choice',
    what: '⭐ THE OUTCOME MEASURE, POOLED (H-IN.1(b) scores the STRATUM-STANDARDISED form; '
      + 'this is the raw pooled view of the same instrument). ⚠ A LOWER BOUND — the declared '
      + 'oracle is the PERCEIVED-CHOICE chooser, not decideCarrier\'s full ladder, and it is '
      + 'read at EVERY carrier tick (a superset of his decision ticks).',
    denNote: 'denominator = carrier moments the oracle could price — MOVES between arms '
      + 'because the arms are different worlds (a locked carrier does not re-decide)',
    family: 'flip (H-IN.1(b) supporting view)',
  },
  anyOutOfFieldShare: {
    num: (r) => r.flipAnyOut, den: (r) => r.flipEval,
    unit: 'share of priced carrier moments with at least one body served from memory',
    what: 'the COULD-FLIP population (a moment with nothing in memory can never flip)',
    denNote: 'same priced-moment denominator', family: 'flip (REPORTED)',
  },
  oracleStaleShare: {
    num: (r) => r.oracleStale, den: (r) => r.oracleReads,
    unit: 'share of the oracle\'s other-body reads served from the book',
    what: '⚠ PRE-REGISTERED TO POSSIBLY RISE while ages fall (IN-T1 §P9(4)): a fuller book '
      + 'makes MORE bodies eligible to be served from memory, because a body never seen is '
      + 'served TRUTH by IN-T0\'s cold-start rule. Mechanism, not contradiction.',
    denNote: 'denominator = the oracle\'s other-body reads at EVERY carrier tick',
    family: 'flip (REPORTED)',
  },
  oracleStaleAgeMeanTicks: {
    num: (r) => r.oracleStaleAgeTickSum, den: (r) => r.oracleStale,
    unit: 'TICKS (sim ticks; 1 tick = DT sim-seconds)',
    what: 'the oracle\'s own mean staleness age (the second, independent view of the book)',
    denNote: 'denominator = the oracle\'s stale reads', family: 'flip (REPORTED)',
  },
  /* ---------- ⭐ THE FRESHNESS MEASURE ITSELF ---------- */
  carrierBookAgeMeanTicks: {
    num: (r) => r.bookAgeTickSum, den: (r) => r.bookAgeMoments,
    unit: 'TICKS (sim ticks; 1 tick = DT sim-seconds)',
    what: '⭐ THE FRESHNESS MEASURE of H-IN.1(b), at its own grain: the carrier\'s book age '
      + 'at the decision, meaned over every other body (in-field and never-seen bodies are at '
      + 'TRUTH and carry ZERO age).',
    denNote: 'denominator = priced carrier moments — MOVES between arms', family: 'freshness',
  },
  carrierBookAgeMeanSimSeconds: {
    num: (r) => r.bookAgeTickSum * DT, den: (r) => r.bookAgeMoments,
    unit: 'sim-seconds (the dual axis; clock honesty)',
    what: 'the same measure on the sim clock', denNote: 'same priced-moment denominator',
    family: 'freshness',
  },
  /* ---------- IN-T0's ledger, re-measured at exam grain ---------- */
  chooserReadsStaleShare: {
    num: (r) => r.readsStale, den: (r) => r.bodiesViewed,
    unit: 'share of the carrier chooser\'s other-body reads served from the private book',
    what: 'IN-T0\'s OWN staleness share, re-measured on virgin seeds',
    denNote: 'denominator = other bodies resolved through the gateway — MOVES with how often '
      + 'the carrier re-decides at all', family: 'snapshot ledger',
  },
  chooserStaleAgeMeanTicks: {
    num: (r) => r.staleAgeTickSum, den: (r) => r.readsStale,
    unit: 'TICKS (sim ticks; 1 tick = DT sim-seconds)',
    what: 'IN-T0\'s headline age, re-measured on virgin seeds (IN-T1 §R1\'s estimand)',
    denNote: 'denominator = stale reads', family: 'snapshot ledger',
  },
  chooserStaleAgeMeanSimSeconds: {
    num: (r) => r.staleAgeTickSum * DT, den: (r) => r.readsStale,
    unit: 'sim-seconds (the dual axis; clock honesty)',
    what: 'the same age on the sim clock', denNote: 'denominator = stale reads',
    family: 'snapshot ledger',
  },
  viewsBuiltPerMatch: {
    num: (r) => r.viewsBuilt, den: perMatch, unit: 'chooser views per match',
    what: '⚠ THE MOVING DENOMINATOR ITSELF (IN-T1 §R8 item 5): a locked carrier does not '
      + 'rebuild a view, so every share above has a materially different denominator per arm.',
    denNote: 'one match per seed', family: 'snapshot ledger',
  },
  /* ---------- ⭐ HOLDING (拿住球 gains a PRODUCT) ---------- */
  meanCarrySimSecondsPerOwnership: {
    num: (r) => r.ownershipTicks * DT, den: (r) => r.ownershipEpisodes,
    unit: 'sim-seconds of ball ownership per ownership episode',
    what: '⭐ HOLDING USAGE — how long a body keeps the ball once he gets it. Contract §4: '
      + 'NO promise that holding rises; H-IN.2 REPORTS it, and the per-seed correlation with '
      + 'look usage is published beside it, CLAIMING NOTHING.',
    denNote: 'denominator = ownership episodes (a change of owner) — MOVES with how often '
      + 'possession changes hands at all', family: 'holding (REPORTED)',
  },
  ownershipEpisodesPerMatch: {
    num: (r) => r.ownershipEpisodes, den: perMatch, unit: 'ownership episodes per match',
    what: 'holding\'s own denominator, published as its own face (moving-denominator canon)',
    denNote: 'one match per seed', family: 'holding (REPORTED)',
  },
  /* ---------- the R-乙 chain faces (definitions reused VERBATIM) ---------- */
  ryiQ01SpellSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds per open-play spell',
    what: 'R-乙 Q01 — "how long a team keeps the ball (open-play possession spell, mean)"',
    denNote: 'denominator = openPlay-origin spells — MOVES with how the world segments possession',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ05TouchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches per open-play spell',
    what: 'R-乙 Q05 — "how many touches a possession is made of"',
    denNote: 'same openPlay-spell denominator', family: 'R-乙 chain (REPORTED)',
  },
  ryiQ06PassCompletion: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share of passes completed',
    what: 'R-乙 Q06 — "how many passes find a team-mate" (the engine\'s OWN passive counters)',
    denNote: 'denominator = Σ team.stats.passes, both teams — MOVES with attempts',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ14PressedReceptionShare: {
    num: (r) => r.openFirstReceptionsPressed, den: (r) => r.openFirstReceptions,
    unit: 'share of open-play first receptions',
    what: 'R-乙 Q14 — "how much of the game is played under pressure", the nearest opponent '
      + `≤ TOUCH_CONTROL_DIST = ${PRESSURE_R} m at the reception tick`,
    denNote: 'denominator = openPlay-origin first receptions — MOVES with spell count',
    family: 'R-乙 chain (REPORTED)',
  },
  ryiQ07ForwardPassShare: {
    num: (r) => r.enginePassesForward, den: (r) => r.enginePasses,
    unit: 'share of passes forward',
    what: '⭐ THE DIRECTION MIX — R-乙 Q07 VERBATIM (the engine\'s own `passesForward`)',
    denNote: 'same engine pass denominator', family: 'R-乙 chain (REPORTED)',
  },
  /* ---------- goals + the §2 equilibrium faces (REPORT ONLY) ---------- */
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals per match',
    what: '⚠⚠ THE LOUDEST RECEIPT IN THE PROGRAMME re-measured on virgin seeds (IN-T1 §R5: '
      + '2.93 → 1.80). §2 equilibrium — REPORTED; nothing ships from an exam, and the '
      + 'VERDICT on this quantity lives at LADDER grain (§10).',
    denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  shotsPerMatch: {
    num: (r) => r.shots, den: perMatch, unit: 'shots per match (both teams)',
    what: '§2 equilibrium (REPORTED)', denNote: 'one match per seed', family: 'equilibrium (REPORTED)',
  },
  tacklesPerMatch: {
    num: (r) => r.tackles, den: perMatch, unit: 'tackles per match (both teams)',
    what: '⚠ THE CONTACT half at FRIENDLY-MATCH grain — NOT the ladder estimand (DF-T2 §R11 '
      + 'item 6): random genomes, one friendly, read at the whistle.',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED, friendly grain)',
  },
  interceptionsPerMatch: {
    num: (r) => r.interceptions, den: perMatch, unit: 'interceptions per match (both teams)',
    what: '⚠ THE READING half at FRIENDLY-MATCH grain — NOT the ladder estimand. The two '
      + 'numbers must never be quoted as the same thing.',
    denNote: 'one match per seed', family: 'reading-vs-contact (REPORTED, friendly grain)',
  },
  matchSimSeconds: {
    num: simSeconds, den: perMatch, unit: 'sim-seconds walked per match (the 240 s clock)',
    what: 'clock honesty: the walk length itself, so every per-match rate has its clock',
    denNote: 'one match per seed', family: 'clock',
  },
};

const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(STATS_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngBoot.next() * seedsWalked.length)));
const shutBySeed = new Map(rows.filter((r) => r.arm === 'lookShut').map((r) => [r.seed, r]));
const armedBySeed = new Map(rows.filter((r) => r.arm === 'lookArmed').map((r) => [r.seed, r]));
const shutRowsAll = rows.filter((r) => r.arm === 'lookShut');
const armedRows = rows.filter((r) => r.arm === 'lookArmed');

interface FaceRow {
  face: string; family: string; unit: string; what: string; denNote: string;
  shutValue: number; shutNumerator: number; shutDenominator: number;
  armedValue: number; armedNumerator: number; armedDenominator: number;
  delta: number; ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  resolved: boolean; direction: 'down' | 'up' | 'unresolved';
}
const pickPct = (draws: readonly number[], p: number): number => (draws.length === 0 ? Number.NaN
  : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(p * draws.length)))]);
const faceOf = (name: string, d: FaceDef): FaceRow => {
  const bn = sum(shutRowsAll.map(d.num));
  const bd = sum(shutRowsAll.map(d.den));
  const an = sum(armedRows.map(d.num));
  const ad = sum(armedRows.map(d.den));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let bnn = 0; let bdd = 0; let ann = 0; let add = 0;
    for (const i of idx) {
      const s = seedsWalked[i];
      const rb = shutBySeed.get(s)!;
      const ra = armedBySeed.get(s)!;
      bnn += d.num(rb); bdd += d.den(rb);
      ann += d.num(ra); add += d.den(ra);
    }
    const v = ratio(ann, add) - ratio(bnn, bdd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pickPct(draws, 0.025);
  const hi = pickPct(draws, 0.975);
  const hw = (hi - lo) / 2;
  const delta = ratio(an, ad) - ratio(bn, bd);
  const resolved = Number.isFinite(lo) && Number.isFinite(hi) && (lo > 0 || hi < 0);
  return {
    face: name, family: d.family, unit: d.unit, what: d.what, denNote: d.denNote,
    shutValue: round(ratio(bn, bd)), shutNumerator: round(bn), shutDenominator: round(bd),
    armedValue: round(ratio(an, ad)), armedNumerator: round(an), armedDenominator: round(ad),
    delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round(hw),
    ratioToHalfWidth: round(Math.abs(delta) / hw, 6),
    resolved, direction: resolved ? (hi < 0 ? 'down' : 'up') : 'unresolved',
  };
};
const faces: FaceRow[] = Object.entries(FACES).map(([k, d]) => faceOf(k, d));
const faceRow = (name: string): FaceRow => faces.find((f) => f.face === name)!;

/* ========================================================================== */
/* §10 THE WITHIN-ARM BLOCK — H-IN.1(a1) + (a2), and the look receipts         */
/* ========================================================================== */
/**
 * ⭐ THE WITHIN-ARM BOOTSTRAP — its OWN stats base, its OWN resample index; the cluster is
 * the SEED, exactly as the between-arm bootstrap's is. UNPAIRED by construction: each side
 * gets its own interval and the frozen test is INTERVAL OVERLAP.
 */
const rngWithin = new Rng(STATS_BASE + 2 * STATS_STEP);
const withinIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngWithin.next() * seedsWalked.length)));
interface Interval { value: number; ciLo: number; ciHi: number; halfWidth: number }
const intervalOf = (draws: number[], value: number): Interval => {
  draws.sort((a, b) => a - b);
  const lo = pickPct(draws, 0.025);
  const hi = pickPct(draws, 0.975);
  return { value: round(value), ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2) };
};
const disjoint = (a: Interval, b: Interval): boolean =>
  Number.isFinite(a.ciLo) && Number.isFinite(b.ciLo) && (a.ciHi < b.ciLo || b.ciHi < a.ciLo);
/** a within-arm ratio over a resampled ARMED seed set */
const withinInterval = (
  pick: (rs: readonly Row[]) => number, armRows: readonly Row[],
  bySeed: Map<number, Row>,
): Interval => {
  const draws: number[] = [];
  for (const idx of withinIndex) {
    const rs = idx.map((i) => bySeed.get(seedsWalked[i])!);
    const v = pick(rs);
    if (Number.isFinite(v)) draws.push(v);
  }
  return intervalOf(draws, pick(armRows));
};

/* ---- (a1) USAGE NON-DEGENERACY BY SITUATION (#329 §CORR 3's form) ---- */
const situationShare = (rs: readonly Row[], s: number): number =>
  ratio(sum(rs.map((r) => r.looksBySituation[s])), sum(rs.map((r) => r.decisionsBySituation[s])));
const a1Intervals: Interval[] = [0, 1, 2].map(
  (s) => withinInterval((rs) => situationShare(rs, s), armedRows, armedBySeed),
);
const a1Pairs = [[0, 1], [0, 2], [1, 2]].map(([i, j]) => ({
  pair: `${SITUATIONS[i]} vs ${SITUATIONS[j]}`,
  disjoint: disjoint(a1Intervals[i], a1Intervals[j]),
  absoluteGap: round(Math.abs(a1Intervals[i].value - a1Intervals[j].value)),
  ratioToHalfWidth: round(Math.abs(a1Intervals[i].value - a1Intervals[j].value)
    / Math.max(a1Intervals[i].halfWidth, a1Intervals[j].halfWidth), 6),
}));
const a1Pass = a1Pairs.every((p) => p.disjoint);

/* ---- (a2) THE ALL-SCANNING GUARD, re-checked with pay-after-serve NAMED ---- */
const declineShareOf = (rs: readonly Row[]): number =>
  ratio(sum(rs.map((r) => r.declines)), sum(rs.map((r) => r.decisionsSeen)));
const a2Decline = withinInterval(declineShareOf, armedRows, armedBySeed);
const a2Pass = Number.isFinite(a2Decline.ciLo) && a2Decline.ciLo > 0;
const HIN1A_PASS = a1Pass && a2Pass;

/* ---- the look USAGE and COST receipts at exam grain (REPORTED) ---- */
const lookShareOf = (rs: readonly Row[]): number =>
  ratio(sum(rs.map((r) => r.looks)), sum(rs.map((r) => r.decisionsSeen)));
const turnTicksPerLook = ratio(sum(armedRows.map((r) => r.turnTicksPaid)),
  sum(armedRows.map((r) => r.looks)));
const DERIVED_BAND_LO = 15;
const DERIVED_BAND_HI = IN_LOOK_AGE_CAP_TICKS;
const lookReceipts = {
  note: '⭐ RECEIPTS at exam grain, on VIRGIN seeds — IN-T1 §R2\'s faces re-measured. '
    + 'Canon: receipts ≠ effect sizes (homes ruling #289 item 1 + BU-T1 §CORR item 5).',
  lookShareOfDecisions: withinInterval(lookShareOf, armedRows, armedBySeed),
  declineShareOfDecisions: a2Decline,
  lookShareBySituation: SITUATIONS.map((name, s) => ({ situation: name, ...a1Intervals[s] })),
  turnTicksPerLook: round(turnTicksPerLook),
  turnSimSecondsPerLook: round(turnTicksPerLook * DT),
  derivedBandTicks: [DERIVED_BAND_LO, DERIVED_BAND_HI],
  derivedBandNote: 'the look\'s price is bounded BELOW by the smallest possible turn at F2 '
    + '(the aim must lie OUTSIDE a 90° half-angle field, so θ > 90° ⇒ ≥ 15 ticks) and ABOVE '
    + 'by the FULL REVERSAL (θ ≤ π ⇒ ≤ 29 ticks). Both edges are the shipped turn form\'s '
    + 'own algebra — no chosen number.',
  paidTimeWithinDerivedBand: turnTicksPerLook >= DERIVED_BAND_LO && turnTicksPerLook <= DERIVED_BAND_HI,
  lockedDecisionsPerLook: round(ratio(sum(armedRows.map((r) => r.lockedDecisions)),
    sum(armedRows.map((r) => r.looks)))),
  looksPerMatch: round(ratio(sum(armedRows.map((r) => r.looks)), armedRows.length)),
  lookTicksPaidPerMatch: round(ratio(sum(armedRows.map((r) => r.turnTicksPaid)), armedRows.length)),
  gainPerLook: round(ratio(sum(armedRows.map((r) => r.lookGain)), sum(armedRows.map((r) => r.looks)))),
  lossPerLook: round(ratio(sum(armedRows.map((r) => r.lookLoss)), sum(armedRows.map((r) => r.looks)))),
  abortedBallArrivedShare: round(ratio(sum(armedRows.map((r) => r.abortedBallArrived)),
    sum(armedRows.map((r) => r.looks)))),
  bodiesPerLook: round(ratio(sum(armedRows.map((r) => r.lookBodies)), sum(armedRows.map((r) => r.looks)))),
  bodiesPerPassivePass: round(ratio(sum(armedRows.map((r) => r.passiveBodies)),
    sum(armedRows.map((r) => r.passivePasses)))),
  gidsThatLookedPerMatch: round(mean(armedRows.map((r) => r.gidsThatLooked))),
  gidsThatLookedMin: Math.min(...armedRows.map((r) => r.gidsThatLooked)),
  gidsThatLookedMax: Math.max(...armedRows.map((r) => r.gidsThatLooked)),
  gidsCaution: '⚠ REPORTED, NEVER A CONJUNCT (ruling #329 §CORR item 3): IN-T1\'s '
    + '`gEveryBodyLooks` was RATIFIED as a MIS-PITCHED conjunct — the keeper\'s emergent '
    + 'refusal to turn his back is FOOTBALL, not failure. This exam\'s form of the '
    + 'non-degeneracy question is BY SITUATION (a1), never per-body universality.',
};

/* ---- ⭐ THE BODY-TICK ATTRIBUTION SPLIT (REPORTED; NOT a counterfactual) ---- */
const lookErasedShareOf = (rs: readonly Row[]): number =>
  ratio(sum(rs.map((r) => r.lookAgeErasedTicks)),
    sum(rs.map((r) => r.lookAgeErasedTicks + r.passiveAgeErasedTicks)));
const attribution = {
  lookAgeErasedShare: withinInterval(lookErasedShareOf, armedRows, armedBySeed),
  lookAgeErasedTicks: sum(armedRows.map((r) => r.lookAgeErasedTicks)),
  passiveAgeErasedTicks: sum(armedRows.map((r) => r.passiveAgeErasedTicks)),
  unit: 'share of ALL erased staleness (BODY-TICKS) erased by an elective LOOK',
  honestLimit: '⚠ A BODY-TICK ATTRIBUTION, NOT A COUNTERFACTUAL (IN-T1 §P9(2)). The armed '
    + 'arm arms BOTH halves — the free passive refresh for every body AND the priced look.',
  namedOut: '⛔ THE PASSIVE-vs-LOOK HALF-SPLIT COUNTERFACTUAL IS NAMED OUT OF THIS EXAM '
    + '(ruling #332 item 6, explicit): a clean separation needs a THIRD arm behind a SUB-FLAG '
    + '— an `src/**` change this instrument-only stage may not make. It is a LATER SLICE if '
    + 'the number matters. Reported as a gap, not smuggled in.',
};

/* ---- ⭐ HOLDING USAGE and its correlation to look usage (CLAIMS NOTHING) ---- */
const pearson = (xs: readonly number[], ys: readonly number[]): number => {
  const n = xs.length;
  if (n < 3) return Number.NaN;
  const mx = mean(xs);
  const my = mean(ys);
  let sxy = 0; let sxx = 0; let syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxx === 0 || syy === 0 ? Number.NaN : sxy / Math.sqrt(sxx * syy);
};
const perSeedLookShare = armedRows.map((r) => ratio(r.looks, r.decisionsSeen));
const perSeedCarrySeconds = armedRows.map((r) => ratio(r.ownershipTicks * DT, r.ownershipEpisodes));
const holding = {
  what: '⭐ 拿住球买信息 — the contract\'s H-IN.2 direction, VERBATIM: "拿住球 gains a '
    + 'PRODUCT (looks) — if holding usage rises it must rise because looks pay, never because '
    + 'a weight was nudged."',
  meanCarrySimSecondsPerOwnership: {
    shut: faceRow('meanCarrySimSecondsPerOwnership').shutValue,
    armed: faceRow('meanCarrySimSecondsPerOwnership').armedValue,
    delta: faceRow('meanCarrySimSecondsPerOwnership').delta,
    resolved: faceRow('meanCarrySimSecondsPerOwnership').resolved,
    direction: faceRow('meanCarrySimSecondsPerOwnership').direction,
  },
  perSeedCorrelationLookShareVsCarrySeconds: round(pearson(perSeedLookShare, perSeedCarrySeconds), 6),
  correlationN: armedRows.length,
  claim: '⛔ NOTHING IS CLAIMED FROM THIS CORRELATION. It is a cross-seed association inside '
    + 'ONE arm with no randomisation and no adjustment; it is published because #332 item 6 '
    + 'ordered the correlation REPORTED, and it is not a conjunct of anything.',
};

/* ========================================================================== */
/* §11 ⭐⭐ H-IN.1(b) — INFORMATION DIFFERENTIATES OUTCOMES, AT MATCHED STRATA  */
/* ========================================================================== */
/**
 * THE STANDARDISATION, FROZEN BEFORE THE BATTERY: the SHUT arm's stratum weights are held
 * fixed and both arms are read through them, so the contrast is at MATCHED SITUATIONS.
 * A stratum with a ZERO denominator in EITHER arm is DROPPED and the weights are
 * RENORMALISED over the retained set (the retained set is published, and `gStrataRetained`
 * reports it). This rule is frozen here, before any battery walk, and is never re-cut.
 */
const stratumSum = (rs: readonly Row[], pickA: (r: Row) => number[], s: number): number =>
  sum(rs.map((r) => pickA(r)[s]));
const retainedStrata = (shutRs: readonly Row[], armedRs: readonly Row[]): number[] => {
  const keep: number[] = [];
  for (let s = 0; s < N_STRATA; s++) {
    if (stratumSum(shutRs, (r) => r.strataEval, s) > 0
      && stratumSum(armedRs, (r) => r.strataEval, s) > 0) keep.push(s);
  }
  return keep;
};
const standardisedFlipShare = (
  target: readonly Row[], weightArm: readonly Row[], keep: readonly number[],
): number => {
  const wTot = sum(keep.map((s) => stratumSum(weightArm, (r) => r.strataEval, s)));
  if (wTot === 0) return Number.NaN;
  let acc = 0;
  for (const s of keep) {
    const w = stratumSum(weightArm, (r) => r.strataEval, s) / wTot;
    const den = stratumSum(target, (r) => r.strataEval, s);
    if (den === 0) return Number.NaN;
    acc += w * (stratumSum(target, (r) => r.strataFlips, s) / den);
  }
  return acc;
};
const KEEP = retainedStrata(shutRowsAll, armedRows);
const bStdShut = standardisedFlipShare(shutRowsAll, shutRowsAll, KEEP);
const bStdArmed = standardisedFlipShare(armedRows, shutRowsAll, KEEP);
const bDelta = bStdArmed - bStdShut;
/** the PAIRED, seed-clustered bootstrap of the standardised delta (draw 1's base) */
const bDraws: number[] = [];
for (const idx of resampleIndex) {
  const rs = idx.map((i) => seedsWalked[i]);
  const sh = rs.map((s) => shutBySeed.get(s)!);
  const ar = rs.map((s) => armedBySeed.get(s)!);
  const keep = retainedStrata(sh, ar);
  const v = standardisedFlipShare(ar, sh, keep) - standardisedFlipShare(sh, sh, keep);
  if (Number.isFinite(v)) bDraws.push(v);
}
bDraws.sort((a, b) => a - b);
const bLo = pickPct(bDraws, 0.025);
const bHi = pickPct(bDraws, 0.975);
const bHalfWidth = (bHi - bLo) / 2;
const bResolvedDown = Number.isFinite(bLo) && Number.isFinite(bHi) && bHi < 0;
const HIN1B_PASS = bResolvedDown;

/** the per-stratum table (stored cells — canon: every headline re-derives) */
const strataTable = Array.from({ length: N_STRATA }, (_, s) => ({
  stratum: s,
  name: STRATUM_NAMES[s],
  retained: KEEP.includes(s),
  shutEval: stratumSum(shutRowsAll, (r) => r.strataEval, s),
  shutFlips: stratumSum(shutRowsAll, (r) => r.strataFlips, s),
  shutFlipShare: round(ratio(stratumSum(shutRowsAll, (r) => r.strataFlips, s),
    stratumSum(shutRowsAll, (r) => r.strataEval, s))),
  armedEval: stratumSum(armedRows, (r) => r.strataEval, s),
  armedFlips: stratumSum(armedRows, (r) => r.strataFlips, s),
  armedFlipShare: round(ratio(stratumSum(armedRows, (r) => r.strataFlips, s),
    stratumSum(armedRows, (r) => r.strataEval, s))),
  shutWeight: round(ratio(stratumSum(shutRowsAll, (r) => r.strataEval, s),
    sum(KEEP.map((k) => stratumSum(shutRowsAll, (r) => r.strataEval, k))))),
}));

/* ---- THE SUPPORTING LIMB: fresh vs stale WITHIN an arm, standardised the same way ---- */
const freshStandardised = (rs: readonly Row[], fi: number, keep: readonly number[]): number => {
  const wTot = sum(keep.map((s) => stratumSum(rs, (r) => r.strataEval, s)));
  if (wTot === 0) return Number.NaN;
  let acc = 0;
  let wUsed = 0;
  for (const s of keep) {
    const den = sum(rs.map((r) => r.strataFreshEval[s * N_FRESH + fi]));
    if (den === 0) continue;
    const w = stratumSum(rs, (r) => r.strataEval, s) / wTot;
    acc += w * (sum(rs.map((r) => r.strataFreshFlips[s * N_FRESH + fi])) / den);
    wUsed += w;
  }
  return wUsed === 0 ? Number.NaN : acc / wUsed;
};
const supportingLimb = (armRows: readonly Row[], bySeed: Map<number, Row>): {
  fresh: Interval; stale: Interval; disjoint: boolean; freshLower: boolean;
  freshEval: number; staleEval: number;
} => {
  const keep = retainedStrata(armRows, armRows);
  const f = withinInterval((rs) => freshStandardised(rs, 0, retainedStrata(rs, rs)), armRows, bySeed);
  const s = withinInterval((rs) => freshStandardised(rs, 1, retainedStrata(rs, rs)), armRows, bySeed);
  return {
    fresh: f, stale: s, disjoint: disjoint(f, s), freshLower: f.value < s.value,
    freshEval: sum(armRows.flatMap((r) => keep.map((k) => r.strataFreshEval[k * N_FRESH]))),
    staleEval: sum(armRows.flatMap((r) => keep.map((k) => r.strataFreshEval[k * N_FRESH + 1]))),
  };
};
const supportingShut = supportingLimb(shutRowsAll, shutBySeed);
const supportingArmed = supportingLimb(armedRows, armedBySeed);

/* ---- ⭐ THE PRESS-IMMUNITY FACE (压迫压的是没看的人吗) ---- */
const PRESS_CELL_NAMES = ['free:freshBook', 'free:staleBook', 'pressed:freshBook', 'pressed:staleBook'];
const pressImmunity = {
  what: '⭐ 压迫压的是没看的人吗 — the doctrine\'s 时间预算攻击 SHARPENED. At every open-play '
    + 'FIRST reception the receiver is classed by (i) whether he is under pressure (nearest '
    + 'opponent ≤ TOUCH_CONTROL_DIST, the substrate\'s own switch) and (ii) whether his OWN '
    + 'book was FRESH or STALE at that tick (the derived full-reversal cut). The outcome is '
    + 'whether the OPPOSITION takes the ball within the DERIVED window.',
  windowTicks: TURNOVER_WINDOW_TICKS,
  windowSimSeconds: round(TURNOVER_WINDOW_TICKS * DT),
  windowNote: 'the window is the FULL REVERSAL (IN-T1\'s own age cap) — the time it takes to '
    + 'turn all the way round. Derived from the shipped turn form, never chosen.',
  cellNames: PRESS_CELL_NAMES,
  arms: ARMS.map((a) => {
    const rs = rows.filter((r) => r.arm === a);
    const bySeed = a === 'lookShut' ? shutBySeed : armedBySeed;
    return {
      arm: a,
      receptions: Array.from({ length: N_PRESS * N_FRESH },
        (_, c) => sum(rs.map((r) => r.pressCellReceptions[c]))),
      turnovers: Array.from({ length: N_PRESS * N_FRESH },
        (_, c) => sum(rs.map((r) => r.pressCellTurnovers[c]))),
      turnoverShare: Array.from({ length: N_PRESS * N_FRESH }, (_, c) => withinInterval(
        (rr) => ratio(sum(rr.map((r) => r.pressCellTurnovers[c])),
          sum(rr.map((r) => r.pressCellReceptions[c]))), rs, bySeed,
      )),
    };
  }),
  honestLimit: '⚠ REPORTED, NEVER GATED, and the freshness class is NOT randomly assigned: '
    + 'a receiver with a fresh book is a receiver who has just looked or has just been facing '
    + 'the play, which is itself a football situation. The pressure class is not randomised '
    + 'either. Read as a description of the world, not as a causal estimate.',
};

/* ========================================================================== */
/* §12 THE LADDER FACES + SLOPES — DF-C0-FIX §RF1's ONE FORMULA, verbatim      */
/* ========================================================================== */
interface LadderFaceRow {
  arm: LadderArm; generation: number; leagues: number; matches: number;
  goalsPerMatch: number; shotsPerTeamMatch: number; shotsOnTargetPerTeamMatch: number;
  tacklesPerTeamMatch: number; interceptionsPerTeamMatch: number;
  clearancesPerTeamMatch: number; blocksPerTeamMatch: number; passCompletion: number;
  perLeagueGoalsPerMatch: number[];
}
const ladderFaces: LadderFaceRow[] = [];
for (const arm of LADDER_ARMS) {
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const cs = ladderCells.filter((c) => c.arm === arm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    ladderFaces.push({
      arm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), mt * 2)),
      shotsOnTargetPerTeamMatch: round(ratio(sum(cs.map((c) => c.shotsOnTarget)), mt * 2)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), mt * 2)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt * 2)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), mt * 2)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), mt * 2)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
      perLeagueGoalsPerMatch: cs.map((c) => round(ratio(c.goals, c.matches))),
    });
  }
}
const EARLY_GENS = Math.min(5, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - EARLY_GENS + 1);
const LADDER_SLOPE_FACES = ['goals', 'interceptions', 'tackles', 'shots', 'passCompletion'] as const;
type SlopeFace = (typeof LADDER_SLOPE_FACES)[number];
const numOf = (c: LadderCell, f: SlopeFace): number =>
  (f === 'goals' ? c.goals : f === 'interceptions' ? c.interceptions
    : f === 'tackles' ? c.tackles : f === 'shots' ? c.shots : c.passesCompleted);
const denOf = (c: LadderCell, f: SlopeFace): number =>
  (f === 'goals' ? c.matches : f === 'passCompletion' ? c.passes : c.matches * 2);
/** ⭐ DF-C0-FIX §RF1's ONE FORMULA — publish side and re-derivation call THIS function. */
const slopeDeltaThroughOneFormula = (
  perLeague: ReadonlyArray<{ early: number; late: number; delta: number }>,
): number => mean(perLeague.map((p) => p.delta));
interface LadderSlope {
  arm: LadderArm; face: string;
  early: number; late: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; ratioToHalfWidth: number;
  earlyGens: string; lateGens: string; leagues: number;
}
const rngLadder = new Rng(STATS_BASE + STATS_STEP);
const ladderSlopes: LadderSlope[] = [];
const perLeagueOf = (arm: LadderArm, f: SlopeFace, cells: readonly LadderCell[]) =>
  LADDER_SEEDS.map((ls) => {
    const cs = cells.filter((c) => c.arm === arm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    const e = ratio(sum(early.map((c) => numOf(c, f))), sum(early.map((c) => denOf(c, f))));
    const l = ratio(sum(late.map((c) => numOf(c, f))), sum(late.map((c) => denOf(c, f))));
    return { early: e, late: l, delta: l - e };
  });
for (const arm of LADDER_ARMS) {
  for (const f of LADDER_SLOPE_FACES) {
    const perLeague = perLeagueOf(arm, f, ladderCells);
    const draws: number[] = [];
    for (let b = 0; b < BOOTSTRAP; b++) {
      const ds: number[] = [];
      for (let i = 0; i < perLeague.length; i++) {
        ds.push(perLeague[Math.floor(rngLadder.next() * perLeague.length)].delta);
      }
      const v = mean(ds);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    const lo = pickPct(draws, 0.025);
    const hi = pickPct(draws, 0.975);
    const delta = slopeDeltaThroughOneFormula(perLeague);
    ladderSlopes.push({
      arm, face: f,
      early: round(mean(perLeague.map((p) => p.early))),
      late: round(mean(perLeague.map((p) => p.late))),
      delta: round(delta), ciLo: round(lo), ciHi: round(hi), halfWidth: round((hi - lo) / 2),
      ratioToHalfWidth: round(Math.abs(delta) / ((hi - lo) / 2), 6),
      earlyGens: `1..${EARLY_GENS}`, lateGens: `${LATE_FROM}..${LADDER_GENS}`,
      leagues: LADDER_SEEDS.length,
    });
  }
}
const slopeOf = (arm: LadderArm, face: string): LadderSlope =>
  ladderSlopes.find((s) => s.arm === arm && s.face === face)!;
const shutGoalSlope = slopeOf('liveShut', 'goals');
const armedGoalSlope = slopeOf('liveArmed', 'goals');
const ladderGen = (arm: LadderArm, gen: number): LadderFaceRow =>
  ladderFaces.find((l) => l.arm === arm && l.generation === gen)!;
const ladderFloorRead = {
  atkFrozenFloor: ATK_FROZEN_FLOOR,
  atkFrozenFloorSource: ATK_FROZEN_FLOOR_SOURCE,
  shutGoalsSlopeDelta: shutGoalSlope.delta,
  armedGoalsSlopeDelta: armedGoalSlope.delta,
  shutDistanceAboveFloor: round(shutGoalSlope.delta - ATK_FROZEN_FLOOR),
  armedDistanceAboveFloor: round(armedGoalSlope.delta - ATK_FROZEN_FLOOR),
  fractionOfExcessClosed: round(
    (shutGoalSlope.delta - ATK_FROZEN_FLOOR) === 0 ? Number.NaN
      : ((shutGoalSlope.delta - ATK_FROZEN_FLOOR) - (armedGoalSlope.delta - ATK_FROZEN_FLOOR))
        / (shutGoalSlope.delta - ATK_FROZEN_FLOOR),
  ),
  armedMinusShut: round(armedGoalSlope.delta - shutGoalSlope.delta),
  bendsTowardFloor: armedGoalSlope.delta < shutGoalSlope.delta,
  goalsLevelGen1: { shut: ladderGen('liveShut', 1).goalsPerMatch, armed: ladderGen('liveArmed', 1).goalsPerMatch },
  goalsLevelGenLast: {
    shut: ladderGen('liveShut', LADDER_GENS).goalsPerMatch,
    armed: ladderGen('liveArmed', LADDER_GENS).goalsPerMatch,
  },
  readingAtLadderGrain: {
    note: '⭐ DF-C0 §R4\'s ESTIMAND — evolved LEAGUE play across generations, per team-match. '
      + 'The friendly-match `interceptionsPerMatch` face is a DIFFERENT number and is never '
      + 'quoted as this one (DF-T2 §R11 item 6). ORDERED at dispatch (#332 item 6): does '
      + 'better information STARVE defenders of interceptions across seasons? REPORT, NEVER GATE.',
    shutInterceptionsDelta: slopeOf('liveShut', 'interceptions').delta,
    armedInterceptionsDelta: slopeOf('liveArmed', 'interceptions').delta,
    shutInterceptionsGen1: ladderGen('liveShut', 1).interceptionsPerTeamMatch,
    shutInterceptionsGenLast: ladderGen('liveShut', LADDER_GENS).interceptionsPerTeamMatch,
    armedInterceptionsGen1: ladderGen('liveArmed', 1).interceptionsPerTeamMatch,
    armedInterceptionsGenLast: ladderGen('liveArmed', LADDER_GENS).interceptionsPerTeamMatch,
    shutPassCompletionDelta: slopeOf('liveShut', 'passCompletion').delta,
    armedPassCompletionDelta: slopeOf('liveArmed', 'passCompletion').delta,
    shutPassCompletionGen1: ladderGen('liveShut', 1).passCompletion,
    shutPassCompletionGenLast: ladderGen('liveShut', LADDER_GENS).passCompletion,
    armedPassCompletionGen1: ladderGen('liveArmed', 1).passCompletion,
    armedPassCompletionGenLast: ladderGen('liveArmed', LADDER_GENS).passCompletion,
  },
  interpretationNote: '⚠ THE FLOOR IS A REFERENCE LINE, NOT A MATCHED CONTROL — DF-C0\'s '
    + 'atkFrozen arm froze the ATTACK genes on league seeds 12,508,900–903; this stage arms '
    + 'a PERCEPTION door on 12,516,900–903. The floor says what the ecology\'s inflation '
    + 'looks like when attack stops evolving; it does not say what this door should have '
    + 'achieved. REPORTED, never gated. ⚠ NO between-arm SLOPE TEST IS PRE-REGISTERED AND '
    + 'NONE IS INVENTED: each arm carries its own league-clustered interval and the '
    + 'comparison is read as OVERLAP (DF-T1 §R8 item 2\'s discipline, inherited verbatim).',
  preRegisteredDirection: '#320 item 3\'s FROZEN DIRECTION, restated at dispatch: the ladder '
    + 'is REPORTED and a deviation ROUTES TO A SLICE, never to a nudge.',
};

/* ========================================================================== */
/* §13 H-IN.1 — THE FROZEN VERDICT (never re-cut after sight)                  */
/* ========================================================================== */
const hin1 = {
  claim: 'H-IN.1 (contract §1, VERBATIM): "with the snapshot law and the look armed and '
    + 'priced through EXISTING machinery, (a) LOOKS ARE GENUINELY TAKEN (usage > 0 at claim '
    + 'grain, distribution by situation reported, not one degenerate corner) at their derived '
    + 'time cost; AND (b) INFORMATION DIFFERENTIATES OUTCOMES: at matched situations, the '
    + 'carrier acting on a FRESH snapshot chooses/releases resolvedly better than the one '
    + 'acting on a STALE one (the user\'s 中场 story made measurable — 接球前观察 ⇒ 球到来时'
    + '零处理传到应该传到的人). Capability + honest prices; NO usage promise beyond '
    + 'non-degeneracy."',
  ciRule: 'BETWEEN-ARM faces: RESOLVED = the 95 % seed-clustered PAIRED bootstrap interval of '
    + '(armed − shut) EXCLUDES ZERO (2,000 draws, percentile, the SAME resampled seed set '
    + 'used for both arms in every draw). WITHIN-ARM contrasts: each side carries its OWN '
    + 'seed-clustered bootstrap interval and the test is INTERVAL OVERLAP — DISJOINT = '
    + 'resolved apart. Frozen before the battery; NEVER re-cut after sight.',
  a_looksGenuinelyTakenAtTheirCost: {
    pass: HIN1A_PASS,
    a1_usageNonDegeneracyBySituation: {
      pass: a1Pass,
      rule: 'the three SITUATION look shares (carrier / off-ball outfield / keeper — src\'s '
        + 'OWN `inLookSituation` buckets) are PAIRWISE RESOLVED DISTINCT: ALL THREE pairs of '
        + 'seed-clustered bootstrap intervals DISJOINT.',
      form: '⭐ #329 §CORR item 3, BINDING: the exam\'s form of the non-degeneracy gate is BY '
        + 'SITUATION, NEVER per-body universality. IN-T1\'s `gEveryBodyLooks` was ratified as '
        + 'a MIS-PITCHED conjunct — a keeper who almost never looks is footballing sense '
        + 'EMERGING from the loss term, not a defect.',
      situations: SITUATIONS,
      intervals: SITUATIONS.map((name, s) => ({ situation: name, ...a1Intervals[s] })),
      pairs: a1Pairs,
    },
    a2_allScanningGuard: {
      pass: a2Pass,
      rule: 'the DECLINE share of decisions stays RESOLVEDLY ABOVE ZERO: the lower edge of '
        + 'its 95 % seed-clustered bootstrap interval > 0. The cost must bite.',
      source: 'contract §4, VERBATIM: "an all-scanning world is a FAILURE mode (the look must '
        + 'cost real time, so situations must differentiate)."',
      declineShare: a2Decline,
      lowerEdge: a2Decline.ciLo,
      halfWidthsFromZero: round(a2Decline.value / a2Decline.halfWidth, 6),
      halfWidthsFromOne: round((1 - a2Decline.value) / a2Decline.halfWidth, 6),
      payAfterServeApproximationNamed: '⚠⚠ RULING #329 §CORR item 2, NAMED HERE AS ORDERED — '
        + 'the slice\'s SECOND REALITY APPROXIMATION of record: "sight before payment, with '
        + 'an arrival refund". The looked field is served at TRUTH INSTANTLY and the turn is '
        + 'paid AFTERWARDS (a physical sweep yields sight as it completes), and the '
        + 'ball-arrived abort REFUNDS the unpaid balance at exactly the payoff moment. BOTH '
        + 'halves are frozen §P3 law and published faces. THE DIRECTION OF THE '
        + 'APPROXIMATION IS CHEAPENING — it makes the look cost LESS than a physical sweep '
        + 'would, so this guard is being re-checked against a MORE PERMISSIVE world than '
        + 'reality, and a PASS here is therefore conservative in the right direction. The '
        + 'refund\'s size is published as `abortedBallArrivedShare` beside this conjunct.',
      abortedBallArrivedShare: lookReceipts.abortedBallArrivedShare,
    },
  },
  b_informationDifferentiatesOutcomes: {
    pass: HIN1B_PASS,
    conjunctLimb: 'BETWEEN-ARM AT MATCHED STRATA',
    rule: 'the STRATUM-STANDARDISED flip-vs-truth share is RESOLVEDLY LOWER in the armed arm: '
      + 'the 95 % PAIRED seed-clustered bootstrap interval of (standardised armed − shut) '
      + 'lies ENTIRELY BELOW ZERO. Standardisation holds the SHUT arm\'s stratum weights '
      + 'fixed, so the two arms are compared at MATCHED SITUATIONS.',
    whyThisLimbIsTheConjunct: '⚠⚠ THE CONFOUND, STATED HONESTLY AND FROZEN AS THE REASON FOR '
      + 'THE SPLIT: freshness is NOT randomly assigned WITHIN an arm — a carrier whose book '
      + 'is fresh is a carrier who has just looked or has just been facing the play, which is '
      + 'itself a football situation. The DOOR, by contrast, IS randomised between arms (the '
      + 'same seed walked twice, `inLookAct` the only difference), so the between-arm '
      + 'contrast at matched strata is the CLEANER limb and carries the conjunct. The '
      + 'within-arm fresh-vs-stale contrast is SUPPORTING and is REPORTED, never gated.',
    freshnessMeasure: 'the carrier\'s BOOK AGE at the decision, in TICKS: the mean over every '
      + 'other body on the pitch of (that body\'s entry age when the carrier reads him from '
      + 'MEMORY, else ZERO). THE CUT IS DERIVED: FRESH iff ≤ IN_LOOK_AGE_CAP_TICKS = '
      + `${FRESH_CUT_TICKS} (the FULL REVERSAL). Walk-side predicate PINNED in §2b.`,
    outcomeMeasure: 'the FLIP-vs-TRUTH share (IN-T0 §R2 / IN-T1 §R4\'s oracle REUSED '
      + 'VERBATIM): the shipped perceived-choice chooser priced twice at the same moment, '
      + 'once on TRUTH and once on the carrier\'s REAL BOOK; a FLIP is a different target.',
    oracleLimits: '⚠ IN-T1 §R4, VERBATIM: "the oracle is the PERCEIVED-CHOICE chooser, not '
      + 'decideCarrier\'s full ladder; and it is read at EVERY carrier tick (a superset of '
      + 'his decision ticks), so the flip share is a LOWER BOUND. Its denominator MOVES '
      + 'between arms because the arms are different worlds — disclosed per face." A LOWER '
      + 'BOUND, and THE DECLARED ORACLE.',
    strataDesign: `PRESSURE (nearest opponent ≤ TOUCH_CONTROL_DIST = ${PRESSURE_R} m) × ZONE `
      + '(the carrier\'s progress along his OWN attackDir, in PITCH_LENGTH thirds) = 6 cells, '
      + 'frozen before the battery. Walk-side predicates PINNED in §2b.',
    retentionRule: 'a stratum with a ZERO denominator in EITHER arm is DROPPED and the '
      + 'weights RENORMALISED over the retained set. Frozen before the battery.',
    strataRetained: KEEP,
    strataNames: STRATUM_NAMES,
    standardisedShutFlipShare: round(bStdShut),
    standardisedArmedFlipShare: round(bStdArmed),
    delta: round(bDelta),
    ciLo: round(bLo),
    ciHi: round(bHi),
    halfWidth: round(bHalfWidth),
    ratioToHalfWidth: round(Math.abs(bDelta) / bHalfWidth, 6),
    resolvedDown: bResolvedDown,
    perStratum: strataTable,
    supportingWithinArmLimb: {
      note: '⚠ SUPPORTING, REPORTED, NEVER GATED (the confound above). Fresh-book vs '
        + 'stale-book carrier moments INSIDE one arm, standardised over the same strata.',
      lookShut: supportingShut,
      lookArmed: supportingArmed,
    },
  },
  verdict: HIN1A_PASS && HIN1B_PASS ? 'PASS'
    : HIN1A_PASS ? 'FAIL — (b)' : HIN1B_PASS ? 'FAIL — (a)' : 'FAIL — (a) and (b)',
};

/* ========================================================================== */
/* §14 GATES (frozen; a RED gate stays RED and is reported)                    */
/* ========================================================================== */
const gitOut = (args: string[]): string => {
  try { return execFileSync('git', args, { encoding: 'utf8' }); } catch { return 'GIT-FAILED'; }
};
const gates: Record<string, boolean> = {};
gates.gWorldOkEveryWalk = rows.every((r) => r.worldOk);
gates.gSeedsBookedEqualWalked = seedsWalked.length === SEEDS.length
  && SEEDS.every((s) => seedsWalked.includes(s));
gates.gArmsPairedPerSeed = seedsWalked.every((s) => rows.filter((r) => r.seed === s).length === 2)
  && seedsWalked.every((s) => shutBySeed.has(s) && armedBySeed.has(s));
gates.gAnchorsResolveOnce = anchorReceipts.every((r) => r.matches === 1) && ANCHORS_OK;
gates.gWalkSidePredicatesPinned = PREDICATE_PINS_OK && predicatePins.length >= 20;
const srcPorcelain = gitOut(['status', '--porcelain', '--', 'src']).trim();
const srcDiffStat = gitOut(['diff', '--stat', 'HEAD', '--', 'src']).trim();
gates.gSrcUntouched = srcPorcelain === '' && srcDiffStat === '';
/** DORMANCY MEASURED IN-BATTERY: IN-T1's ledger is untouched with the look door shut */
gates.gShutLookLedgerEmpty = shutRowsAll.every((r) => r.decisionsSeen === 0 && r.looks === 0
  && r.declines === 0 && r.lockedDecisions === 0 && r.turnTicksPaid === 0
  && r.looksBySituation.every((x) => x === 0) && r.gidsThatLooked === 0);
/** IN-T0's law is armed and BITING on BOTH arms (the matched floor is non-vacuous) */
gates.gInLawFiresBothArms = rows.every((r) => r.viewsBuilt > 0 && r.bodiesViewed > 0);
gates.gLookFiresEveryArmedWalk = armedRows.every((r) => r.looks > 0 && r.declines > 0);
gates.gFlipPopulationNonEmpty = ARMS.every((a) =>
  sum(rows.filter((r) => r.arm === a).map((r) => r.flipEval)) > 0);
/** ⭐ the (b) instrument really ran: strata cells stored, and the retained set non-empty */
gates.gStrataCellsStored = rows.every((r) => r.strataEval.length === N_STRATA
  && r.strataFreshEval.length === N_STRATA * N_FRESH) && KEEP.length > 0;
/** ⭐ NON-DEGENERACY LIVENESS of the matching: >= 4 of the 6 strata carry both arms */
gates.gStrataMatchingLive = KEEP.length >= 4;
/** ⭐ BOTH freshness bins are occupied in BOTH arms — a one-bin split is silently dead */
gates.gFreshnessBinsOccupied = ARMS.every((a) => {
  const rs = rows.filter((r) => r.arm === a);
  return [0, 1].every((fi) => sum(rs.flatMap((r) => Array.from({ length: N_STRATA },
    (_, s) => r.strataFreshEval[s * N_FRESH + fi]))) > 0);
});
/** ⭐ the press-immunity instrument is alive in every cell of both arms */
gates.gPressImmunityAlive = pressImmunity.arms.every((a) => a.receptions.every((x) => x > 0));
gates.gHoldingInstrumentAlive = rows.every((r) => r.ownershipEpisodes > 0 && r.ownershipTicks > 0);
gates.gRyiInstrumentAlive = rows.every((r) => r.openSpells > 0 && r.enginePasses > 0
  && r.openFirstReceptions > 0);
gates.gPaidTimeWithinDerivedBand = lookReceipts.paidTimeWithinDerivedBand;
gates.gLadderComplete = ladderCells.length === LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS
  && ladderCells.every((c) => c.matches > 0);
gates.gLadderDoorHeld = ladderCells.every((c) => c.doorWrong === 0 && c.doorChecked > 0);
gates.gLadderGen1Identical = gen1Fingerprints.length === LADDER_SEEDS.length
  && gen1Fingerprints.every((g) => /^[0-9a-f]{64}$/.test(g.sha256));
gates.gSeedDiscipline = SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999)
  && LADDER_SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gStatsDisjoint = STATS_BASE >= 115_800 && minStatsGap >= STATS_STEP && REGISTRY_COMPLETE;
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
/* §15 THE ARTIFACT — allowlist schema; STAGE, re-derive off disk, hash LAST   */
/* ========================================================================== */
const instrumentSha = createHash('sha256')
  .update(readFileSync(new URL(import.meta.url))).digest('hex');
const perfAnchorBytes = readFileSync('docs/perf/baseline.json');
const perfAnchor = JSON.parse(perfAnchorBytes.toString('utf8')) as Record<string, unknown>;

const bodyCore = {
  stage: 'IN-T2-INFORMATION-EXAM',
  kind: 'exam (H-IN.1(a)+(b) SCORED on virgin paired seeds; H-IN.2 REPORTED, never gated)',
  ruling: '#332 item 6',
  contract: 'IN-SNAPSHOT-CONTRACT.md §1 H-IN.1/H-IN.2 + §2 M-IN.1/M-IN.2/M-IN.3/M-IN.4 + §4',
  mode: MODE,
  isOverrideRun: IS_OVERRIDE,
  instrument: {
    file: 'scripts/probes/in-t2-information-exam.ts',
    sha256: instrumentSha,
    flipOracleReusedFrom: 'scripts/probes/in-t0-snapshot-law.ts §3 via '
      + 'scripts/probes/in-t1-the-look.ts §3 — the shipped `choosePerceivedPassTarget` /'
      + '`passChoiceCandidateGids` priced twice at the same moment, VERBATIM.',
    flipOracleLimits: 'the oracle is the PERCEIVED-CHOICE chooser, not decideCarrier\'s full '
      + 'ladder; and it is read at EVERY carrier tick (a superset of his decision ticks), so '
      + 'the flip share is a LOWER BOUND. Its denominator MOVES between arms because the arms '
      + 'are different worlds — disclosed per face.',
    ryiDefinitionsReusedFrom: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions '
      + '(Q01 · Q05 · Q06 · Q07 · Q14), ported verbatim through '
      + 'scripts/probes/bk-t2-composition-exam.ts §(d) THE R-乙 SPELL WALKER (#324 §CORR 1\'s '
      + 'restored loose-ball clause carried: spells are SUSPENDED, not ended, while the ball '
      + 'is loose in play).',
    ladderMechanismReusedFrom: 'scripts/probes/df-c0-defensive-brain-census.ts §7(d) + '
      + 'DF-C0-FIX §RF1\'s ONE FORMULA (slopeDeltaThroughOneFormula), via df-t1 and df-t3',
    newWalkers: 'THREE: (1) the STRATUM × FRESHNESS cells that carry H-IN.1(b); (2) the '
      + 'PRESS-IMMUNITY reception walker (压迫压的是没看的人吗); (3) the HOLDING '
      + 'ownership-episode walker. All instrument-side; src is UNTOUCHED.',
  },
  walkSidePredicatePins: {
    canon: '⭐ NEW CANON (ruling #332 item 3), VERBATIM: "a scored face\'s walk-side '
      + 'predicate is pinned — anchored extraction or fixture — because the re-derivation '
      + 'gate proves arithmetic, not definitions" (home: DF-T3-SURFACE-EXAM.md §COMMANDER '
      + 'CORRECTIONS item 2).',
    where: 'evaluated in the CONSTRUCTION CLASS, BEFORE any battery walk; a disagreement '
      + 'exits 3 and writes nothing.',
    count: predicatePins.length,
    allPass: PREDICATE_PINS_OK,
    pins: predicatePins,
  },
  definitions: {
    situationBuckets: '0 = carrier · 1 = off-ball outfield · 2 = keeper — src\'s OWN '
      + '`inLookSituation` (src/ai/inLookAct.ts), read off the shipped ledger, never re-typed.',
    freshnessMeasure: hin1.b_informationDifferentiatesOutcomes.freshnessMeasure,
    freshCutTicks: FRESH_CUT_TICKS,
    outcomeMeasure: hin1.b_informationDifferentiatesOutcomes.outcomeMeasure,
    stratum: hin1.b_informationDifferentiatesOutcomes.strataDesign,
    pressureRadiusMetres: PRESSURE_R,
    pitchLengthMetres: PITCH_LENGTH,
    turnoverWindowTicks: TURNOVER_WINDOW_TICKS,
    ryiQ01: 'R-乙 VERBATIM — "how long a team keeps the ball (open-play possession spell, '
      + 'mean)": a maximal interval of same-owner-TEAM control while phase === "playing".',
    ryiQ05: 'R-乙 VERBATIM — "how many touches a possession is made of".',
    ryiQ06: 'R-乙 VERBATIM — "how many passes find a team-mate": the engine\'s OWN passive '
      + 'counters, Σ team.stats.passesCompleted / Σ team.stats.passes, both teams.',
    ryiQ14: 'R-乙 VERBATIM — the share of open-play FIRST receptions whose nearest-opponent '
      + 'distance at the reception tick is ≤ TOUCH_CONTROL_DIST.',
    ryiQ07: 'R-乙 Q07 VERBATIM — FORWARD is the engine\'s own team.stats.passesForward counter.',
    ownershipEpisode: 'a change of ball owner while the phase is "playing" — the denominator '
      + 'of the HOLDING face.',
  },
  world: {
    version: IN_WORLD,
    doors: 'a4MatchFlags(9) + bkFacingLaw + bkContactLaw + inSnapshotLaw at F2 in BOTH arms',
    armDifference: 'inLookAct only',
    arms: {
      lookShut: 'the world-9 stack + inSnapshotLaw at F2 (IN-T1\'s lookShut world)',
      lookArmed: 'the same + inLookAct',
    },
    dfDoors: '⭐ SHUT ON BOTH ARMS (#332 item 6, explicit) — one seam family per exam.',
    ladderWorld: 'the SHIPPED world (League — canon: worker fixtures play the SHIPPED world; '
      + 'League.toJSON omits matchFlags). The ladder is NOT world-9: it is the ecology.',
    ladderArmNotes: LADDER_ARM_NOTE,
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    subRanges: {
      battery: `${BLOCK_BASE}–${BLOCK_BASE + N_SEEDS - 1} (${N_SEEDS} paired seeds)`,
      smokePrefix: `${BLOCK_BASE + 800}–${BLOCK_BASE + 802} (in band)`,
      ladderLeagues: `${LADDER_SEEDS_ALL[0]}–${LADDER_SEEDS_ALL[3]} (booked once, walked in both arms)`,
      receipt: `${RECEIPT_SEED} (the xxx,999 world-construction receipt — WALKED)`,
    },
    booked: SEEDS,
    walked: seedsWalked,
    ladderSeeds: LADDER_SEEDS,
    bookedEqualsWalked: seedsWalked.length === SEEDS.length && SEEDS.every((s) => seedsWalked.includes(s)),
    walksTotal: rows.length,
    blockConsumedWhole: `${BLOCK_BASE}–${BLOCK_BASE + 999} CONSUMED WHOLE of record`,
    nextSimBlock: 12_517_000,
  },
  stats: {
    basesConsumed: STATS_BASES_CONSUMED,
    step: STATS_STEP,
    registryEntries: STATS_PUBLISHED_BASES.length,
    registryComplete: REGISTRY_COMPLETE,
    registryOfRecordEntering: 64,
    registryCompletionMethod: 'IN-C0\'s COMPLETED 56-entry registry + 114,200 '
      + '(IN-C0/IN-C0-FIX, #317 item 4) + 114,400 and 114,600 (DF-C0, #320 item 4) + 114,800 '
      + 'and 115,000 (DF-T1 §R7) + 115,200, 115,400 and 115,600 (DF-T3, #332 item 5) = 64, '
      + 'the REGISTRY OF RECORD corrected at #332 item 4. DF-T2, IN-T0, IN-T1 and BK-C1 '
      + 'consumed ZERO.',
    minGapToAnyPublishedBase: minStatsGap,
    nextBase: STATS_BASE + 3 * STATS_STEP,
    draw1: `${STATS_BASE} — the PAIRED seed-clustered between-arm bootstrap (every face in `
      + '`faces`, and H-IN.1(b)\'s standardised delta)',
    draw2: `${STATS_BASE + STATS_STEP} — the ladder's league-clustered slope bootstrap`,
    draw3: `${STATS_BASE + 2 * STATS_STEP} — the WITHIN-ARM seed-clustered bootstrap that `
      + 'carries H-IN.1(a1), (a2), the supporting fresh-vs-stale limb, the press-immunity '
      + 'cells and the attribution split',
    bootstrapDraws: BOOTSTRAP,
  },
  anchoredExtractions: anchorReceipts,
  turnFormLiveCrossCheck: turnFormChecks,
  hin1,
  lookReceipts,
  attribution,
  holding,
  pressImmunity,
  faces,
  ladder: {
    arms: LADDER_ARMS,
    leagues: LADDER_SEEDS.length,
    generations: LADDER_GENS,
    leagueSeasons: ladderLeagueSeasons,
    matches: ladderMatches,
    earlyGens: `1..${EARLY_GENS}`,
    lateGens: `${LATE_FROM}..${LADDER_GENS}`,
    gen1Fingerprints,
    faces: ladderFaces,
    slopes: ladderSlopes,
    floorRead: ladderFloorRead,
  },
  perf: {
    anchorFile: 'docs/perf/baseline.json',
    anchorSha256: createHash('sha256').update(perfAnchorBytes).digest('hex'),
    anchorHead: (perfAnchor as { head?: string }).head ?? null,
    anchorUsPerStep: (perfAnchor as { usPerStep?: number }).usPerStep ?? null,
    note: 'IN-T2 is INSTRUMENT-ONLY — it measures no seam cost. IN-T1 §R5/§P8 owns the perf '
      + 'receipt for this door; nothing is re-measured or re-published here. ⚠ The step wall '
      + 'times stored per seed EXCLUDE the flip oracle (it runs OUTSIDE the timer on BOTH '
      + 'arms) but are NOT a perf claim.',
  },
  wall: { batterySeconds: batteryWallSec, ladderSeconds: ladderWallSec },
  perSeedCells: rows,
  ladderCells,
  fingerprint: { ofRecord: FINGERPRINT_OF_RECORD, recomputed: fingerprintNow },
  srcTouched: {
    note: 'INSTRUMENT-ONLY stage: src must be UNTOUCHED (the #329 §CORR 1 riders are '
      + 'TESTS-ONLY and landed in their OWN commit BEFORE this instrument froze)',
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
  const dShut = dRows.filter((r) => r.arm === 'lookShut');
  const dArmed = dRows.filter((r) => r.arm === 'lookArmed');
  const dShutBySeed = new Map(dShut.map((r) => [r.seed, r]));
  const dArmedBySeed = new Map(dArmed.map((r) => [r.seed, r]));
  /* ---- every between-arm face: shut / armed / delta ---- */
  for (const [name, d] of Object.entries(FACES)) {
    const published = (onDisk.faces as FaceRow[]).find((f) => f.face === name)!;
    const b = round(ratio(sum(dShut.map(d.num)), sum(dShut.map(d.den))));
    const a = round(ratio(sum(dArmed.map(d.num)), sum(dArmed.map(d.den))));
    const dl = round(ratio(sum(dArmed.map(d.num)), sum(dArmed.map(d.den)))
      - ratio(sum(dShut.map(d.num)), sum(dShut.map(d.den))));
    checks += 5;
    if (!same(b, published.shutValue)) mismatches.push(`face ${name} shut`);
    if (!same(a, published.armedValue)) mismatches.push(`face ${name} armed`);
    if (!same(dl, published.delta)) mismatches.push(`face ${name} delta`);
    if (!same(round(sum(dShut.map(d.num))), published.shutNumerator)) mismatches.push(`face ${name} shutNum`);
    if (!same(round(sum(dArmed.map(d.num))), published.armedNumerator)) mismatches.push(`face ${name} armedNum`);
  }
  /* ---- H-IN.1(a1): the three situation point estimates + the three pair booleans ---- */
  {
    const a1 = onDisk.hin1.a_looksGenuinelyTakenAtTheirCost.a1_usageNonDegeneracyBySituation;
    for (let s = 0; s < 3; s++) {
      checks += 1;
      if (!same(round(situationShare(dArmed, s)), a1.intervals[s].value)) {
        mismatches.push(`hin1/a1/${SITUATIONS[s]}/value`);
      }
    }
    const iv = a1.intervals as Array<Interval & { situation: string }>;
    const pairIdx = [[0, 1], [0, 2], [1, 2]];
    for (let p = 0; p < 3; p++) {
      checks += 2;
      const [i, j] = pairIdx[p];
      if (disjoint(iv[i], iv[j]) !== a1.pairs[p].disjoint) mismatches.push(`hin1/a1/pair${p}/disjoint`);
      if (!same(round(Math.abs(iv[i].value - iv[j].value)), a1.pairs[p].absoluteGap)) {
        mismatches.push(`hin1/a1/pair${p}/gap`);
      }
    }
    checks += 1;
    if (a1.pairs.every((p) => p.disjoint) !== a1.pass) mismatches.push('hin1/a1/pass');
  }
  /* ---- H-IN.1(a2): the decline share and its frozen rule ---- */
  {
    const a2 = onDisk.hin1.a_looksGenuinelyTakenAtTheirCost.a2_allScanningGuard;
    checks += 3;
    if (!same(round(declineShareOf(dArmed)), a2.declineShare.value)) mismatches.push('hin1/a2/value');
    if (!same(a2.declineShare.ciLo, a2.lowerEdge)) mismatches.push('hin1/a2/lowerEdge');
    if ((Number.isFinite(a2.declineShare.ciLo) && a2.declineShare.ciLo > 0) !== a2.pass) {
      mismatches.push('hin1/a2/pass');
    }
    checks += 1;
    if (onDisk.hin1.a_looksGenuinelyTakenAtTheirCost.pass
      !== (onDisk.hin1.a_looksGenuinelyTakenAtTheirCost.a1_usageNonDegeneracyBySituation.pass
        && a2.pass)) mismatches.push('hin1/a/pass');
  }
  /* ---- H-IN.1(b): the strata cells, the retained set, the standardised delta ---- */
  {
    const b = onDisk.hin1.b_informationDifferentiatesOutcomes;
    const keep = retainedStrata(dShut, dArmed);
    checks += 1;
    if (JSON.stringify(keep) !== JSON.stringify(b.strataRetained)) mismatches.push('hin1/b/retained');
    for (const row of b.perStratum) {
      checks += 4;
      if (stratumSum(dShut, (r) => r.strataEval, row.stratum) !== row.shutEval) mismatches.push(`hin1/b/s${row.stratum}/shutEval`);
      if (stratumSum(dArmed, (r) => r.strataEval, row.stratum) !== row.armedEval) mismatches.push(`hin1/b/s${row.stratum}/armedEval`);
      if (!same(round(ratio(stratumSum(dShut, (r) => r.strataFlips, row.stratum),
        stratumSum(dShut, (r) => r.strataEval, row.stratum))), row.shutFlipShare)) {
        mismatches.push(`hin1/b/s${row.stratum}/shutShare`);
      }
      if (!same(round(ratio(stratumSum(dArmed, (r) => r.strataFlips, row.stratum),
        stratumSum(dArmed, (r) => r.strataEval, row.stratum))), row.armedFlipShare)) {
        mismatches.push(`hin1/b/s${row.stratum}/armedShare`);
      }
    }
    const sShut = standardisedFlipShare(dShut, dShut, keep);
    const sArmed = standardisedFlipShare(dArmed, dShut, keep);
    checks += 5;
    if (!same(round(sShut), b.standardisedShutFlipShare)) mismatches.push('hin1/b/stdShut');
    if (!same(round(sArmed), b.standardisedArmedFlipShare)) mismatches.push('hin1/b/stdArmed');
    if (!same(round(sArmed - sShut), b.delta)) mismatches.push('hin1/b/delta');
    if (!same(round(Math.abs(sArmed - sShut) / b.halfWidth, 6), b.ratioToHalfWidth)) {
      mismatches.push('hin1/b/ratioToHalfWidth');
    }
    const rB = Number.isFinite(b.ciLo) && Number.isFinite(b.ciHi) && b.ciHi < 0;
    if (rB !== b.pass || rB !== b.resolvedDown) mismatches.push('hin1/b/pass');
    /* the supporting limb's directions, off disk */
    for (const [k2, arm] of [['lookShut', dShut], ['lookArmed', dArmed]] as const) {
      const pub = (b.supportingWithinArmLimb as unknown as Record<string, {
        fresh: Interval; stale: Interval; disjoint: boolean; freshLower: boolean;
      }>)[k2];
      checks += 3;
      if (!same(round(freshStandardised(arm, 0, retainedStrata(arm, arm))), pub.fresh.value)) {
        mismatches.push(`hin1/b/support/${k2}/fresh`);
      }
      if (!same(round(freshStandardised(arm, 1, retainedStrata(arm, arm))), pub.stale.value)) {
        mismatches.push(`hin1/b/support/${k2}/stale`);
      }
      if ((pub.fresh.value < pub.stale.value) !== pub.freshLower) {
        mismatches.push(`hin1/b/support/${k2}/freshLower`);
      }
    }
  }
  /* ---- the VERDICT itself, recomputed off disk ---- */
  {
    const pa = onDisk.hin1.a_looksGenuinelyTakenAtTheirCost.pass;
    const pb = onDisk.hin1.b_informationDifferentiatesOutcomes.pass;
    const expected = pa && pb ? 'PASS' : pa ? 'FAIL — (b)' : pb ? 'FAIL — (a)' : 'FAIL — (a) and (b)';
    checks += 1;
    if (expected !== onDisk.hin1.verdict) mismatches.push('hin1/verdict');
  }
  /* ---- the look receipts, the attribution, holding, press immunity ---- */
  {
    const lr = onDisk.lookReceipts;
    checks += 6;
    if (!same(round(lookShareOf(dArmed)), lr.lookShareOfDecisions.value)) mismatches.push('lookReceipts/lookShare');
    const tt = ratio(sum(dArmed.map((r) => r.turnTicksPaid)), sum(dArmed.map((r) => r.looks)));
    if (!same(round(tt), lr.turnTicksPerLook)) mismatches.push('lookReceipts/turnTicksPerLook');
    if (!same(round(tt * DT), lr.turnSimSecondsPerLook)) mismatches.push('lookReceipts/turnSeconds');
    if ((tt >= DERIVED_BAND_LO && tt <= DERIVED_BAND_HI) !== lr.paidTimeWithinDerivedBand) {
      mismatches.push('lookReceipts/band');
    }
    if (!same(round(ratio(sum(dArmed.map((r) => r.abortedBallArrived)),
      sum(dArmed.map((r) => r.looks)))), lr.abortedBallArrivedShare)) {
      mismatches.push('lookReceipts/abortShare');
    }
    if (!same(round(mean(dArmed.map((r) => r.gidsThatLooked))), lr.gidsThatLookedPerMatch)) {
      mismatches.push('lookReceipts/gids');
    }
    checks += 3;
    if (!same(round(lookErasedShareOf(dArmed)), onDisk.attribution.lookAgeErasedShare.value)) {
      mismatches.push('attribution/share');
    }
    if (sum(dArmed.map((r) => r.lookAgeErasedTicks)) !== onDisk.attribution.lookAgeErasedTicks) {
      mismatches.push('attribution/lookTicks');
    }
    if (sum(dArmed.map((r) => r.passiveAgeErasedTicks)) !== onDisk.attribution.passiveAgeErasedTicks) {
      mismatches.push('attribution/passiveTicks');
    }
    checks += 1;
    const rho = pearson(dArmed.map((r) => ratio(r.looks, r.decisionsSeen)),
      dArmed.map((r) => ratio(r.ownershipTicks * DT, r.ownershipEpisodes)));
    if (!same(round(rho, 6), onDisk.holding.perSeedCorrelationLookShareVsCarrySeconds)) {
      mismatches.push('holding/correlation');
    }
    for (const ap of onDisk.pressImmunity.arms) {
      const rs = ap.arm === 'lookShut' ? dShut : dArmed;
      for (let c = 0; c < N_PRESS * N_FRESH; c++) {
        checks += 3;
        if (sum(rs.map((r) => r.pressCellReceptions[c])) !== ap.receptions[c]) mismatches.push(`press/${ap.arm}/rec${c}`);
        if (sum(rs.map((r) => r.pressCellTurnovers[c])) !== ap.turnovers[c]) mismatches.push(`press/${ap.arm}/to${c}`);
        if (!same(round(ratio(sum(rs.map((r) => r.pressCellTurnovers[c])),
          sum(rs.map((r) => r.pressCellReceptions[c])))), ap.turnoverShare[c].value)) {
          mismatches.push(`press/${ap.arm}/share${c}`);
        }
      }
    }
    /* the paired maps are used so the re-derivation walks the same clustering */
    checks += 1;
    if (dShutBySeed.size !== dArmedBySeed.size) mismatches.push('perSeedCells/pairing');
  }
  /* ---- the ladder: every per-generation face and every slope, through THE ONE FORMULA ---- */
  const dCells = onDisk.ladderCells as LadderCell[];
  for (const lf of onDisk.ladder.faces as LadderFaceRow[]) {
    const cs = dCells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
    const mt = sum(cs.map((c) => c.matches));
    const expect: Record<string, number> = {
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt)),
      shotsPerTeamMatch: round(ratio(sum(cs.map((c) => c.shots)), mt * 2)),
      shotsOnTargetPerTeamMatch: round(ratio(sum(cs.map((c) => c.shotsOnTarget)), mt * 2)),
      tacklesPerTeamMatch: round(ratio(sum(cs.map((c) => c.tackles)), mt * 2)),
      interceptionsPerTeamMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt * 2)),
      clearancesPerTeamMatch: round(ratio(sum(cs.map((c) => c.clearances)), mt * 2)),
      blocksPerTeamMatch: round(ratio(sum(cs.map((c) => c.blocks)), mt * 2)),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)), sum(cs.map((c) => c.passes)))),
    };
    for (const [k2, v] of Object.entries(expect)) {
      checks += 1;
      if (!same(v, (lf as unknown as Record<string, number>)[k2])) {
        mismatches.push(`ladderFace ${lf.arm}/gen${lf.generation}/${k2}`);
      }
    }
    checks += 1;
    if (JSON.stringify(cs.map((c) => round(ratio(c.goals, c.matches)))) !== JSON.stringify(lf.perLeagueGoalsPerMatch)) {
      mismatches.push(`ladderFace ${lf.arm}/gen${lf.generation}/perLeagueGoalsPerMatch`);
    }
  }
  for (const s of onDisk.ladder.slopes as LadderSlope[]) {
    const perLeague = perLeagueOf(s.arm, s.face as SlopeFace, dCells);
    checks += 4;
    if (!same(round(mean(perLeague.map((p) => p.early))), s.early)) mismatches.push(`slope ${s.arm}/${s.face}/early`);
    if (!same(round(mean(perLeague.map((p) => p.late))), s.late)) mismatches.push(`slope ${s.arm}/${s.face}/late`);
    if (!same(round(slopeDeltaThroughOneFormula(perLeague)), s.delta)) mismatches.push(`slope ${s.arm}/${s.face}/delta`);
    if (!same(round(Math.abs(slopeDeltaThroughOneFormula(perLeague)) / s.halfWidth, 6), s.ratioToHalfWidth)) {
      mismatches.push(`slope ${s.arm}/${s.face}/ratioToHalfWidth`);
    }
  }
  {
    const bs = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveShut' && s.face === 'goals')!;
    const as2 = (onDisk.ladder.slopes as LadderSlope[]).find((s) => s.arm === 'liveArmed' && s.face === 'goals')!;
    const fr = onDisk.ladder.floorRead;
    checks += 5;
    if (!same(round(bs.delta - ATK_FROZEN_FLOOR), fr.shutDistanceAboveFloor)) mismatches.push('floorRead/shut');
    if (!same(round(as2.delta - ATK_FROZEN_FLOOR), fr.armedDistanceAboveFloor)) mismatches.push('floorRead/armed');
    if (!same(round(as2.delta - bs.delta), fr.armedMinusShut)) mismatches.push('floorRead/armedMinusShut');
    if ((as2.delta < bs.delta) !== fr.bendsTowardFloor) mismatches.push('floorRead/bendsTowardFloor');
    if (!same(round(((bs.delta - ATK_FROZEN_FLOOR) - (as2.delta - ATK_FROZEN_FLOOR))
      / (bs.delta - ATK_FROZEN_FLOOR)), fr.fractionOfExcessClosed)) {
      mismatches.push('floorRead/fractionOfExcessClosed');
    }
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
const outPath = ALL_GREEN || IS_OVERRIDE ? OUT : `${OUT.replace(/\.json$/, '')}.RED.json`;
const tmp = `${outPath}.tmp`;
writeFileSync(tmp, `${JSON.stringify(artifact, null, 2)}\n`);
renameSync(tmp, outPath);

banner(`\nwrote ${outPath}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : 'RED  '}  ${k}`);
banner(`\nH-IN.1 = ${hin1.verdict}`);
banner(`  (a1) ${SITUATIONS.map((n, s) => `${n} ${a1Intervals[s].value}`).join(' · ')}`
  + `  pairsDisjoint=${a1Pairs.map((p) => p.disjoint).join('/')}`);
banner(`  (a2) decline ${a2Decline.value} [${a2Decline.ciLo}, ${a2Decline.ciHi}] pass=${a2Pass}`);
banner(`  (b)  std flip shut ${round(bStdShut)} → armed ${round(bStdArmed)}  Δ ${round(bDelta)}`
  + ` [${round(bLo)}, ${round(bHi)}] pass=${HIN1B_PASS}  strata kept ${KEEP.length}/${N_STRATA}`);
banner(`  support: shut fresh ${supportingShut.fresh.value} vs stale ${supportingShut.stale.value}`
  + ` · armed fresh ${supportingArmed.fresh.value} vs stale ${supportingArmed.stale.value}`);
banner(`ladder goals slope: shut ${shutGoalSlope.delta} vs armed ${armedGoalSlope.delta}`
  + `  floor ${ATK_FROZEN_FLOOR}`);
banner(`re-derivation: ${checks} checks, ${mismatches.length} mismatches`);
process.exit(ALL_GREEN ? 0 : 1);
