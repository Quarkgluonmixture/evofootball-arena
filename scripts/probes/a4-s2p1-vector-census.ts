// A4 SLICE 2, S2-P1 — THE PER-BODY OBEDIENCE VECTOR CENSUS (does HETEROGENEITY at a
// MATCHED whisper dose cure the duplication the user's eyes caught, without selling the
// defence slice 1 bought?).
//
// Authority: docs/world-model/A4-S2P1-VECTOR-CENSUS.md (the FROZEN pre-registration) +
// A4-SLICE2-PERBODY-CONTRACT §1 (H-A4.2 / the H-157c discriminator), §2 (M-S2.3 — the
// P1c seam generalizes to a per-body dose VECTOR, instrument-side ONLY), §3 (BIRTH
// NEUTRALITY + Road B), §4 (S2-P1: the frozen vector grid), §5 (the #157 instrument
// debt: a DEDICATED foul counter, offsides descriptive + FLAG, the E4 combination
// counters REPORTED, the proximity block DESCRIPTIVE) · ruling #158 (slice 2 opens;
// the user rules 甲) · #157 (the user's play verdict: 很多时候球员不知道自己该往哪走;
// dupRun +7.8 %, restartTicks +29 %, offsides ≈2× production) · #154 (the slice-1
// CERTIFIED prices: deep −0.7395 [−1.2055, −0.2440]/set; box −0.380 [−0.480, −0.275]/set)
// · #152 (the proximity readouts are DESCRIPTIVE; the restart/offside FLAG idiom) ·
// #148 (the certified whisper: obedience 0.5 = 0.25×VAL_SCALE) · #128 (wall outside the
// X-DET core) · #20 (cluster = match seed) · #46.2 (seed disjointness) · #105.4 (no
// optional stopping) · #49.3 (per-record receipts) · the P1c probe idiom
// (scripts/probes/a4-p1c-grant-census.ts: the R3p fixture, the paired same-seed
// multi-branch fork, X-FORK-IDENT, X-MERGE-IDENT, E-NONSTATION, the match-cluster
// bootstrap, the sizing→frozen-N arithmetic).
//
// WORLD. The R3p arm reconstructed EXACTLY as the P3p-3 battery / A4-P1c built it: the
// ENRICHED world (#67.3) with the stationEye ARMED (v3 base+children+SHA; v4
// inSupportLaw+deliveryBit+offsideBit), `homeRegionGrant` NULL in the base run.
//
// THE FORK. At a qualifying own-possession playing moment for side d, the base state is
// cloned into INDEPENDENT deep copies:
//   • branch NONE — no grant (the eye world as-is; the level anchor).
//   • branch <arm> — `homeRegionGrant = { side:d, obedienceByIndex: <the arm's frozen
//     vector> }` on the clone: each of side d's outfield bodies reads HIS OWN obedience,
//     mapped through the SHIPPED-FORM homePriorStrength onto HIS OWN ATTACK_FORMATIONS
//     home via the SAME homeMapBias closure the shipped prior builds. A UNIFORM 0.5
//     vector is therefore EXACTLY the slice-1 certified PRIOR content on that side
//     (tests/a4S2VectorGrant.test.ts asserts the byte-identity).
// Five arms, all at MATCHED MEAN 0.5 (uniform / spread / back-loaded / front-loaded /
// single-anchor) ⇒ only the SHAPE of the agreement differs; the dose is constant.
// X-FORK-IDENT: an independent plain clone == branch NONE (zero leakage).
//
// THE FROZEN GATE (pre-registration §4; the smoke may NOT inform it):
//   PRIMARY        dupRun(spread − uniform) paired CI UPPER < 0 (duplication FALLS).
//   NON-INFERIORITY deep and box (spread − uniform) CI UPPER < M_limb, where
//                  M_deep = 0.6700·|Δdeep(uniform − none)| and
//                  M_box  = 0.2763·|Δbox(uniform − none)| — the give-back slice 1 could
//                  NOT certify for that currency (#154: 0.2440/0.7395 = 0.3300 of the
//                  deep point and 0.275/0.380 = 0.7237 of the box point were certified).
//                  If a limb's uniform benefit is not resolvedly negative, its margin is
//                  UNDEFINED ⇒ that leg reads UNRESOLVED ⇒ NOT-ADVANCE (declared ex ante).
//   FLAGS (never gating): offsides (spread ≥ 2× the uniform level, resolved) ⇒ the axis
//                  returns to the USER (contract F-S2d, the 乙 axis is user-gated);
//                  fouls / restartTicks / the E4 combination counters are REPORTED.
//
// ⭐ S2-P1b (ruling #162) — THE backLoaded CONFIRMATORY EXAM, added as two further modes
// over THIS SAME machinery (zero behaviour change to `smoke`/`census`). Three branches
// only — NONE / uniform (descriptive reference, in NO gate leg) / backLoaded (the S2-P1
// frozen vector, verbatim) — and the gate is read against the NONE anchor (the user's
// 门前的账不亏 · 外围打平 · 撞车大减 line, #162.1):
//   leg (a) dupRun(backLoaded − none) CI UPPER < 0
//   leg (b) box   (backLoaded − none) CI UPPER < 0
//   leg (c) deep  (backLoaded − none) CI LOWER ≤ 0
//   OFFSIDE FLAG (descriptive, NEVER gating): offsides(backLoaded − none) CI LOWER >
//   +0.0338 (= 2 × the S2-P1 seen +0.0169, the #152.4 doubling idiom) ⇒ F-S2d, to the USER.
// N is FROZEN EX ANTE at 8,000 by #162 — the confirmatory smoke sizes NOTHING.
//
// FOUR MODES (explicit A4S2P1_MODE, NO default):
//   smoke         — 40 matches @ 12,237,000 + k; realises the fork populations, the arm
//                   levels, the primary contrast σ̂, the per-match wall INCLUDING arms, and
//                   the FROZEN N arithmetic; X-DET double-run. Writes
//                   a4-s2p1-vector-census-sizing-smoke.json.
//   census        — A4S2P1_N matches @ 12,240,000 + k; the S2-P1 gate-bearing run. Writes
//                   a4-s2p1-vector-census.json.
//   confirm-smoke — 40 matches @ 12,256,000 + k (a DISJOINT block); WALL + PLUMBING ONLY:
//                   populations, per-arm LEVELS and every hard gate. It computes NO
//                   contrast, NO gate and NO N arithmetic — N is already frozen at 8,000
//                   (#162) and nothing here may inform anything. Writes
//                   a4-s2p1b-backloaded-confirmatory-smoke.json.
//   confirm       — the FROZEN N = 8,000 matches @ 12,248,000 + k; the S2-P1b gate-bearing
//                   run. Writes a4-s2p1b-backloaded-confirmatory.json.
//
// COMMAND LINES:
//   smoke:   A4S2P1_MODE=smoke npx tsx scripts/probes/a4-s2p1-vector-census.ts
//   census:  A4S2P1_MODE=census A4S2P1_N=<disclosed N* from the smoke> \
//            npx tsx scripts/probes/a4-s2p1-vector-census.ts
//   S2-P1b:  A4S2P1_MODE=confirm-smoke npx tsx scripts/probes/a4-s2p1-vector-census.ts
//            A4S2P1_MODE=confirm       npx tsx scripts/probes/a4-s2p1-vector-census.ts
//   preflight (bounded; writes OUTSIDE the repo, NOT a verdict):
//     A4S2P1_MODE=smoke A4S2P1_CAP=2 A4S2P1_FORK_CAP=2 A4S2P1_OUT=/tmp/x.json \
//       A4S2P1_SKIP_FP=1 npx tsx scripts/probes/a4-s2p1-vector-census.ts
//
// ROAD B. Nothing ships. `Match.homeRegionGrant` (both union members) is null in every
// production path; the vectors exist ONLY inside this instrument; the production
// fingerprint 57b0bdab…c673 is unchanged (X-FP-PROD + the flag-off byte-identity test).

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { runHeadless } from '../../src/sim/simRunner';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import {
  CELL_FLOOR, EYE_LATTICE, HOME_MAP_STRENGTH_MAX, homePriorStrength, newStationEyeTrace,
  type MergedChildTable, type RoleConditionedTable, type RoleControlLevels, type RoleCell,
  type StationEyeTrace,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING — every constant pinned before any run (pre-registration §2–§7).
// =============================================================================
const CENSUS_SEED_BASE = 12_240_000; // census: 12,240,000 + k, k∈0..N−1 (N ≤ 8,000 ⇒ ≤ 12,247,999)
const SMOKE_SEED_BASE = 12_237_000; // smoke: 12,237,000 + k, k∈0..39
const SMOKE_MATCHES = 40;
const RESERVED_BAND = [12_237_000, 12_300_000] as const; // the REMAINING slice-2 pool (contract §9)
// every consumed block of the A4 arc (the P3′ §7 ledger + the P3′ blocks themselves).
const CONSUMED_BLOCKS = [
  [11_150_000, 11_150_039], // P3p-3 smoke
  [11_200_000, 11_600_000], // P3p-3 battery band
  [11_700_000, 11_700_039], // A4-P1 smoke
  [11_800_000, 11_807_999], // A4-P1 census
  [11_850_000, 11_850_039], // A4-P1b smoke
  [11_900_000, 11_907_999], // A4-P1b census
  [11_950_000, 11_950_039], // A4-P1c smoke
  [12_000_000, 12_007_999], // A4-P1c census
  [12_050_000, 12_050_039], // A4-P1d smoke
  [12_100_000, 12_107_999], // A4-P1d census
  [12_150_000, 12_150_039], // A4-P1e smoke
  [12_200_000, 12_207_999], // A4-P1e census
  [12_208_000, 12_217_999], // A4-P3 (retired IN FULL, #152.4.iii)
  [12_220_000, 12_220_039], // A4-P3′ smoke
  [12_230_000, 12_236_999], // A4-P3′ battery
] as const;

// the match-cluster bootstrap (#20) — slice-2 stats seeds from the 1014xx family.
const BOOTSTRAP_SEED = 101_403;
const BOOTSTRAP_RESAMPLES = 2_000;
const STATS_SEED_RESERVED = 101_503; // reserved-unused (no dispersion/permutation statistic)

// =============================================================================
// ⭐ S2-P1b — THE CONFIRMATORY FREEZE (ruling #162.3, copied; NEVER re-cut here).
// =============================================================================
const CONFIRM_SEED_BASE = 12_248_000; // FRESH: 12,248,000 + k, k∈0..7,999 ⇒ ≤ 12,255,999
const CONFIRM_N_FROZEN = 8_000; // ⭐ FROZEN EX ANTE by #162 — leg (c) must not be passable by underpowering
const CONFIRM_SMOKE_SEED_BASE = 12_256_000; // the DISJOINT plumbing block: 12,256,000 + k, k∈0..39
const CONFIRM_SMOKE_MATCHES = 40;
// FRESH stats seeds (101403 / 101503 are CONSUMED by S2-P1): the 1015xx family.
const CONFIRM_BOOTSTRAP_SEED = 101_513;
const CONFIRM_STATS_SEED_RESERVED = 101_523;
// ⭐ the frozen OFFSIDE FLAG threshold: 2 × the S2-P1 seen +0.0169 (the #152.4 doubling idiom).
const CONFIRM_OFFSIDE_FLAG_ABS = 0.0338;
// the S2-P1 SEEN backLoaded−none anchors (docs/world-model/data/a4-s2p1-vector-census.json)
// — CONTEXT ONLY, the P3′ replication idiom: they name the magnitude, never the predicate.
const S2P1_SEEN_VS_NONE = { dupRun: -2.4543, deep: 0.0026, box: -0.0023, offsides: 0.0169 } as const;
// S2-P1's OWN blocks become CONSUMED for S2-P1b (added ONLY on the confirmatory modes, so the
// census mode's own disjointness gate is byte-unchanged).
const CONFIRM_EXTRA_CONSUMED = [
  [12_237_000, 12_237_039], // A4-S2-P1 sizing smoke
  [12_240_000, 12_247_999], // A4-S2-P1 census (RAN, #161)
] as const;

// horizon: the certified P0b concede horizon, the P1c value VERBATIM.
const W_PRICE_S = 10;
const W_MAX_TICKS = Math.round(W_PRICE_S / DT);
const SAMPLE_EVERY = 10; // the battery's 6 Hz proximity-sample cadence
const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket

// fork sampling (P1c idiom; the cap is LOWER than P1c's 20 because each fork runs
// 1 + 5 arm branches + 1 X-FORK-IDENT step-through on the ARMED eye).
const FORK_SPACING_S = 4.0;
const FORK_CAP_PER_MATCH = 12;

// ⭐ THE FROZEN VECTOR GRID (pre-registration §3). Index 0 = GK (never reaches the v3
// station eye ⇒ always 0); the five OUTFIELD bodies are indices 1..5. Every arm's mean
// over indices 1..5 is EXACTLY 0.5 — the slice-1 certified whisper (obedience 0.5 =
// homePriorStrength(0.5) = 0.25×VAL_SCALE, #148) — so the arms differ ONLY in SHAPE.
const ARM_VECTORS = {
  uniform: [0, 0.5, 0.5, 0.5, 0.5, 0.5],
  spread: [0, 0.8, 0.2, 0.8, 0.2, 0.5],
  backLoaded: [0, 0.9, 0.7, 0.5, 0.3, 0.1],
  frontLoaded: [0, 0.1, 0.3, 0.5, 0.7, 0.9],
  singleAnchor: [0, 1.0, 0.375, 0.375, 0.375, 0.375],
} as const;
type ArmName = keyof typeof ARM_VECTORS;
const ALL_ARMS = Object.keys(ARM_VECTORS) as ArmName[];
const CONTROL_ARM: ArmName = 'uniform'; // = the slice-1 PRIOR content (the control)
const TREAT_ARM: ArmName = 'spread'; // = the H-157c discriminator (matched mean, max heterogeneity)
const MEAN_TARGET = 0.5;
// ⭐ S2-P1b arms (#162.3): none / uniform (DESCRIPTIVE reference, in NO gate leg) / backLoaded.
const CONFIRM_TREAT_ARM: ArmName = 'backLoaded'; // the S2-P1 frozen vector, VERBATIM
const CONFIRM_REFERENCE_ARM: ArmName = 'uniform';
const CONFIRM_ARMS: ArmName[] = [CONFIRM_REFERENCE_ARM, CONFIRM_TREAT_ARM];

// ⭐ THE FROZEN NON-INFERIORITY MARGIN FRACTIONS (pre-registration §4), derived ONLY from
// the slice-1 CERTIFIED prices (#154): deep −0.7395 [−1.2055, −0.2440] ⇒ the CI bound
// nearest zero certifies 0.2440/0.7395 = 0.3300 of the point; box −0.380 [−0.480, −0.275]
// ⇒ 0.275/0.380 = 0.7237. The margin = the share slice 1 could NOT certify, applied to
// the UNIFORM arm's OWN benefit measured on the same forks in this run.
const CERT_DEEP_POINT = -0.7395; const CERT_DEEP_NEAR_ZERO = -0.2440;
const CERT_BOX_POINT = -0.380; const CERT_BOX_NEAR_ZERO = -0.275;
const MARGIN_FRACTION_DEEP = 1 - Math.abs(CERT_DEEP_NEAR_ZERO) / Math.abs(CERT_DEEP_POINT); // 0.6700
const MARGIN_FRACTION_BOX = 1 - Math.abs(CERT_BOX_NEAR_ZERO) / Math.abs(CERT_BOX_POINT); // 0.2763

// ⭐ THE FROZEN OFFSIDE FLAG (pre-registration §5, contract §5 debt): descriptive, never
// gating — FLAGGED iff the spread−uniform offside contrast RESOLVES (CI lower > 0) ABOVE
// the uniform arm's own per-fork offside level, i.e. spread at least DOUBLES it (#157:
// the user's eye caught ≈2× production offsides; the P3′ restart-flag doubling idiom).
const OFFSIDE_FLAG_MULTIPLE = 1.0; // "lower > 1.0 × L_uniform" ⇔ ≥ 2× the uniform level

// the frozen N arithmetic (pre-registration §6). The primary reads dup-run COUNTS per fork.
const MDL_REL_157 = 0.078; // the #157 duplication cost: dupRun +7.8 % on PRIOR−R3p
const POWER_Z = 3.605; // z_.975 + z_.95
const Z_975 = 1.96;
const N_STEP = 200;
const N_CAP = 8_000; // keeps the census band ≤ 12,247,999, inside the remaining pool
const WALL_BUDGET_HOURS = 12;
const WALL_BUDGET_MS = WALL_BUDGET_HOURS * 3600 * 1000;
const XDET_FACTOR = 2;
const PROGRESS_EVERY = 5; // matches per progress line (long silent runs get killed)

// X-FP-PROD — the frozen shipped-world production fingerprint (verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// X-MERGE-IDENT (the battery's P3p-1 merged-table identity, verbatim).
const MERGED_PATH = 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const MERGED_SHA_EXPECTED = '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
const VAL_SCALE_PINNED = 0.163494; // the P1e-certified value (src HOME_MAP_STRENGTH_MAX's provenance)

// the ENRICHED census world (#67.3).
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const RECEIPT_CAP = 1_000;
const CONTEXTS = ['own', 'mid', 'their'] as const;
type Context = (typeof CONTEXTS)[number];

// =============================================================================
// ENV / MODE.
// =============================================================================
const MODE = process.env.A4S2P1_MODE;
if (MODE !== 'smoke' && MODE !== 'census' && MODE !== 'confirm-smoke' && MODE !== 'confirm') {
  console.error('A4-S2P1 FATAL — A4S2P1_MODE must be "smoke" | "census" | "confirm-smoke" | "confirm" '
    + '(see the header command lines).');
  process.exit(2);
}
const IS_CONFIRM = MODE === 'confirm' || MODE === 'confirm-smoke'; // ⭐ the S2-P1b (#162) modes
const IS_CONFIRM_SMOKE = MODE === 'confirm-smoke';
// the ACTIVE arm set: S2-P1 runs all five; S2-P1b runs uniform + backLoaded only (#162.3).
const ARMS: ArmName[] = IS_CONFIRM ? CONFIRM_ARMS : ALL_ARMS;
// the ACTIVE bootstrap seed: FRESH 1015xx for S2-P1b (101403/101503 are consumed).
const STATS_SEED = IS_CONFIRM ? CONFIRM_BOOTSTRAP_SEED : BOOTSTRAP_SEED;
const CAP = process.env.A4S2P1_CAP ? Math.max(1, Number.parseInt(process.env.A4S2P1_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(CAP);
const FORK_CAP = (IS_PREFLIGHT && process.env.A4S2P1_FORK_CAP)
  ? Math.max(1, Number.parseInt(process.env.A4S2P1_FORK_CAP, 10)) : FORK_CAP_PER_MATCH;
const SKIP_DET = process.env.A4S2P1_SKIP_DET === '1';
const SKIP_FP = process.env.A4S2P1_SKIP_FP === '1';
const N_ENV = process.env.A4S2P1_N ? Math.max(1, Number.parseInt(process.env.A4S2P1_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('A4-S2P1 FATAL — census mode requires A4S2P1_N (pinned from the smoke arithmetic).');
  process.exit(2);
}
// ⭐ S2-P1b: N is FROZEN EX ANTE at 8,000 by ruling #162.3 and may NOT be supplied, re-cut or
// re-derived — leg (c) (deep CI lower ≤ 0) must not be passable by underpowering.
if (IS_CONFIRM && N_ENV !== null) {
  console.error('A4-S2P1b FATAL — N is FROZEN at 8,000 by ruling #162.3; A4S2P1_N is REFUSED in the '
    + 'confirmatory modes (bound the run with A4S2P1_CAP for a preflight instead).');
  process.exit(2);
}
const N_CENSUS = MODE === 'census' ? Math.min(N_ENV as number, N_CAP) : 0;
const FROZEN_BASE = MODE === 'smoke' ? SMOKE_SEED_BASE
  : MODE === 'confirm-smoke' ? CONFIRM_SMOKE_SEED_BASE
    : MODE === 'confirm' ? CONFIRM_SEED_BASE : CENSUS_SEED_BASE;
const SEED_BASE = (IS_PREFLIGHT && process.env.A4S2P1_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.A4S2P1_SEED_BASE, 10)) : FROZEN_BASE;
const PLANNED_MATCHES = MODE === 'smoke' ? SMOKE_MATCHES
  : MODE === 'confirm-smoke' ? CONFIRM_SMOKE_MATCHES
    : MODE === 'confirm' ? CONFIRM_N_FROZEN : N_CENSUS;
const MATCH_COUNT = IS_PREFLIGHT ? Math.min(PLANNED_MATCHES, CAP) : PLANNED_MATCHES;
const SMOKE_OUT = 'docs/world-model/data/a4-s2p1-vector-census-sizing-smoke.json';
const CENSUS_OUT = 'docs/world-model/data/a4-s2p1-vector-census.json';
const CONFIRM_SMOKE_OUT = 'docs/world-model/data/a4-s2p1b-backloaded-confirmatory-smoke.json';
const CONFIRM_OUT = 'docs/world-model/data/a4-s2p1b-backloaded-confirmatory.json';
const DEFAULT_OUT = MODE === 'smoke' ? SMOKE_OUT
  : MODE === 'confirm-smoke' ? CONFIRM_SMOKE_OUT
    : MODE === 'confirm' ? CONFIRM_OUT : CENSUS_OUT;
const OUT_PATH = process.env.A4S2P1_OUT
  ?? (IS_PREFLIGHT ? '/tmp/a4s2p1-preflight.json' : DEFAULT_OUT);

// =============================================================================
// SMALL NUMERIC HELPERS (P1c verbatim).
// =============================================================================
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const sumBy = <T>(xs: readonly T[], f: (x: T) => number): number => xs.reduce((s, x) => s + f(x), 0);
const pct = (sorted: readonly number[], q: number): number => (sorted.length === 0
  ? Number.NaN
  : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]);
const sampleSd = (xs: readonly number[]): number => {
  const f = xs.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const m = f.reduce((s, x) => s + x, 0) / f.length;
  const v = f.reduce((s, x) => s + (x - m) * (x - m), 0) / (f.length - 1);
  return Math.sqrt(v);
};
const phi = (z: number): number => {
  const t = 1 / (1 + 0.3275911 * Math.abs(z) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592)
    * t * Math.exp(-(z * z) / 2);
  return Math.min(1, Math.max(0, 0.5 * (1 + Math.sign(z) * y)));
};

// --- per-record receipts (#49.3), capped, first-N deterministic --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook | null, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  if (book === null) return;
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// =============================================================================
// THE INJECTED P3p-1 MERGED TABLE + CONTROL (X-MERGE-IDENT) — never bundled in src/**.
// =============================================================================
interface MergedTableFile {
  mergedTableSha: string; base: RoleConditionedTable; children: MergedChildTable;
}
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable: RoleConditionedTable = rawMerged.base;
const children: MergedChildTable = rawMerged.children;
const mergedTableSha = rawMerged.mergedTableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as { control: RoleControlLevels };
const control: RoleControlLevels = rawControl.control;

const shaOf = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const buildMergeIdent = () => {
  const mergedRehash = shaOf({ base: roleTable, children });
  const baseRehash = shaOf(roleTable);
  const pass = mergedTableSha === MERGED_SHA_EXPECTED
    && mergedRehash === MERGED_SHA_EXPECTED && baseRehash === BASE_SHA_EXPECTED;
  return { mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash, baseRehash, baseShaExpected: BASE_SHA_EXPECTED, pass };
};

// VAL_SCALE: the eye's native score dispersion recomputed from the SHA-pinned merged
// table (never from smoke). Used ONLY as the priorEquivalence HARD gate's target — the
// arms are expressed in OBEDIENCE, not in dose units.
const computeValScale = (): number => {
  const vals: number[] = [];
  for (const ck of Object.keys(roleTable)) {
    const byRole = roleTable[ck];
    for (const role of Object.keys(byRole)) {
      const cells = byRole[role];
      for (const candId of Object.keys(cells)) {
        if (candId === 'control') continue;
        const c = cells[candId] as RoleCell;
        if (c.n >= CELL_FLOOR && c.underPowered !== true) vals.push(0.5 * c.score - 0.5 * c.concede);
      }
    }
  }
  return sampleSd(vals);
};
const VAL_SCALE = computeValScale();

// priorEquivalence (HARD): the vectors are anchored to the CERTIFIED whisper.
const buildPriorEquivalence = () => {
  const valScaleMatches = round(VAL_SCALE) === VAL_SCALE_PINNED;
  const whisper = homePriorStrength(MEAN_TARGET);
  const whisperMatches = Math.abs(whisper - 0.25 * VAL_SCALE_PINNED) < 1e-12;
  const ceilingMatches = Math.abs(HOME_MAP_STRENGTH_MAX - 0.5 * VAL_SCALE_PINNED) < 1e-12;
  const meansMatched = ARMS.map((a) => ({
    arm: a,
    mean: round(mean(ARM_VECTORS[a].slice(1))),
    matched: Math.abs(mean(ARM_VECTORS[a].slice(1)) - MEAN_TARGET) < 1e-12,
    inDomain: ARM_VECTORS[a].every((v) => v >= 0 && v <= 1),
  }));
  const pass = valScaleMatches && whisperMatches && ceilingMatches
    && meansMatched.every((m) => m.matched && m.inDomain);
  return {
    valScaleRecomputed: round(VAL_SCALE), valScalePinned: VAL_SCALE_PINNED, valScaleMatches,
    whisperStrength: whisper, whisperMatches, homeMapStrengthMax: HOME_MAP_STRENGTH_MAX, ceilingMatches,
    meansMatched, pass,
    note: 'every arm\'s mean obedience over the five OUTFIELD bodies is EXACTLY 0.5 (the certified whisper, '
      + '#148: homePriorStrength(0.5) = 0.25×VAL_SCALE), and every entry is inside the gene domain [0,1] '
      + '⇒ the arms differ ONLY in SHAPE, never in dose.',
  };
};

// =============================================================================
// THE R3p FIXTURE (= the battery's arm) — enriched world + the ARMED R3p eye.
// =============================================================================
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const r3pEye = (trace?: StationEyeTrace) => ({
  arm: 'neutral' as const, scope: { kind: 'both' as const }, table: {},
  v3: { roleTable, control, children, mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
  ...(trace ? { trace } : {}),
});
const bareMatchOf = (seed: number): Match =>
  new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS });
const matchOf = (seed: number): Match => {
  const m = bareMatchOf(seed);
  m.stationEye = r3pEye(newStationEyeTrace());
  return m;
};

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const REST_THIRD = HALF_L / 3; // own-third depth (the P1 detector geometry, verbatim)
const BOX_INNER_X = -(HALF_L - BOX_DEPTH); // own-box inner depth (the P1 box detector)
const contextOf = (lx: number): Context => (lx < -REST_THIRD ? 'own' : lx > REST_THIRD ? 'their' : 'mid');

// E-NONSTATION (the battery's X-SEAM verbatim, the P1c form).
const checkENonStation = () => {
  const seed = SEED_BASE;
  const freshNull = bareMatchOf(seed).stationEye === null && bareMatchOf(seed).stationEyeState.size === 0;
  const bodyGid = 1 + (seed % 5);
  const bodyM = bareMatchOf(seed);
  bodyM.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: bodyGid }, table: {}, v3: { roleTable, control, children, mergedTableSha }, v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true } };
  let bodyScopeOk = true; let carrierNeverOverridden = true;
  const prevUntil = new Map<number, number>();
  for (let i = 0; i < 3000 && !bodyM.finished; i++) {
    bodyM.step(DT);
    for (const [gid, st] of bodyM.stationEyeState) {
      if (gid !== bodyGid) bodyScopeOk = false;
      const pv = prevUntil.get(gid);
      if (bodyM.ball.owner !== null && bodyM.ball.owner.gid === gid && st.offset !== null
        && (pv === undefined || st.untilTick > pv)) carrierNeverOverridden = false;
      prevUntil.set(gid, st.untilTick);
    }
  }
  const teamM = bareMatchOf(seed);
  teamM.stationEye = { arm: 'neutral', scope: { kind: 'team', side: 0 }, table: {}, v3: { roleTable, control, children, mergedTableSha }, v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true } };
  let teamScopeOk = true;
  for (let i = 0; i < 3000 && !teamM.finished; i++) {
    teamM.step(DT);
    for (const gid of teamM.stationEyeState.keys()) {
      if (Math.floor(gid / TEAM_SIZE) !== 0 || gid % TEAM_SIZE === 0) teamScopeOk = false;
    }
  }
  const bothM = matchOf(seed);
  let bothActivated = false;
  for (let i = 0; i < 3000 && !bothM.finished; i++) {
    bothM.step(DT);
    if (bothM.stationEyeState.size > 0) { bothActivated = true; break; }
  }
  const pass = freshNull && bodyScopeOk && teamScopeOk && bothActivated && carrierNeverOverridden;
  return { pass, freshNull, bodyScopeOk, teamScopeOk, bothActivated, carrierNeverOverridden };
};

// =============================================================================
// ONE BRANCH — clone the base, optionally set the ARM's obedience VECTOR for side d,
// step W_MAX_TICKS, and accumulate EVERY instrument for side d over the window:
//   discipline currency  deep + box entries suffered (the P1 detectors, VERBATIM)
//   proximity (DESCRIPTIVE, #152)  dup-runs + nearest-teammate spacing at 6 Hz
//   restarts             restart-state ticks (aggregate) …
//   ⭐ the #157 debt      … PLUS a DEDICATED foul counter (foul-born restarts = free
//                        kicks + penalties, counted from the fouls/penalties ledgers,
//                        separately from every other restart) and OFFSIDES
//   ⭐ the E4 counters    third-man releases, overlaps, forward-pass share, chain length
// =============================================================================
interface Metrics {
  deep: number; box: number;
  restartTicks: number; foulRestarts: number; foulsByD: number; penaltyRestarts: number;
  offsides: number;
  dupRun: number; spacingSum: number; spacingSamples: number;
  thirdMan: number; overlaps: number; passes: number; passesForward: number; chainGain: number;
}
const ZERO_METRICS = (): Metrics => ({
  deep: 0, box: 0, restartTicks: 0, foulRestarts: 0, foulsByD: 0, penaltyRestarts: 0, offsides: 0,
  dupRun: 0, spacingSum: 0, spacingSamples: 0,
  thirdMan: 0, overlaps: 0, passes: 0, passesForward: 0, chainGain: 0,
});
interface BranchOut { m: Metrics; ended: boolean; signature: string }

const runBranch = (
  base: Match, d: Side, arm: ArmName | null, seed: number, decisionTick: number,
  receipts: ReceiptBook | null,
): BranchOut => {
  const fork = cloneSimulationState(base);
  if (arm !== null) {
    // the counterfactual, on THIS clone only: side d's per-body obedience VECTOR.
    fork.homeRegionGrant = { side: d, obedienceByIndex: [...ARM_VECTORS[arm]] };
  }
  const mine = fork.teams[d];
  const opp = fork.teams[d === 0 ? 1 : 0];
  const startTick = fork.simTick;
  const out = ZERO_METRICS();

  // baselines for the counter LEDGERS (all counters are window DELTAS).
  const s0Mine = { ...mine.stats }; const s0Opp = { ...opp.stats };

  const ball0 = fork.ball;
  const owner0 = ball0.owner;
  const oppOwns0 = owner0 !== null && owner0.side !== d;
  const lx0 = mine.localX(ball0.pos.x);
  let deepPrev = oppOwns0 && fork.phase === 'playing' && lx0 < -REST_THIRD;
  let boxPrev = oppOwns0 && fork.phase === 'playing'
    && lx0 <= BOX_INNER_X && Math.abs(ball0.pos.y) <= BOX_WIDTH / 2;

  let ended = false;
  while (!fork.finished && fork.simTick - startTick < W_MAX_TICKS) {
    fork.step(DT);
    if (fork.finished) { ended = true; break; }
    if (fork.restart !== null) out.restartTicks += 1;
    const owner = fork.ball.owner;
    const oppOwns = owner !== null && owner.side !== d;
    const playing = fork.phase === 'playing';
    const lx = mine.localX(fork.ball.pos.x);
    const deepNow = oppOwns && playing && lx < -REST_THIRD;
    if (deepNow && !deepPrev) {
      out.deep += 1;
      addReceipt(receipts, 'deep-entry-against', seed, decisionTick, owner?.gid ?? -1,
        `${arm ?? 'none'} d${d} lx=${round(lx, 2)}`);
    }
    deepPrev = deepNow;
    const boxNow = oppOwns && playing && lx <= BOX_INNER_X && Math.abs(fork.ball.pos.y) <= BOX_WIDTH / 2;
    if (boxNow && !boxPrev) out.box += 1;
    boxPrev = boxNow;
    // the proximity block (DESCRIPTIVE, #152) — side d's outfielders at 6 Hz.
    if ((fork.simTick - startTick) % SAMPLE_EVERY === 0) {
      const outs = mine.players.filter((q) => q.role !== 'GK' && !q.sentOff);
      for (let a = 0; a < outs.length; a++) {
        let nearest = Number.POSITIVE_INFINITY;
        for (let b = 0; b < outs.length; b++) {
          if (a === b) continue;
          const dd = Math.hypot(outs[a].pos.x - outs[b].pos.x, outs[a].pos.y - outs[b].pos.y);
          if (dd < nearest) nearest = dd;
          if (b > a && dd < DUP_RUN_M) out.dupRun += 1;
        }
        if (Number.isFinite(nearest)) { out.spacingSum += nearest; out.spacingSamples += 1; }
      }
    }
  }
  // ⭐ the #157 instrument debt, read from the match's own ledgers as window deltas.
  const dMine = mine.stats; const dOpp = opp.stats;
  out.foulsByD = dMine.fouls - s0Mine.fouls;
  out.foulRestarts = out.foulsByD + (dOpp.fouls - s0Opp.fouls); // free kicks + penalties, BOTH sides
  out.penaltyRestarts = (dMine.penalties - s0Mine.penalties) + (dOpp.penalties - s0Opp.penalties);
  out.offsides = (dMine.offsides - s0Mine.offsides) + (dOpp.offsides - s0Opp.offsides);
  // ⭐ the E4 combination counters (REPORTED), side d's own play.
  out.thirdMan = dMine.thirdMan - s0Mine.thirdMan;
  out.overlaps = dMine.overlaps - s0Mine.overlaps;
  out.passes = dMine.passes - s0Mine.passes; // pass ATTEMPTS (the forward-share denominator)
  out.passesForward = dMine.passesForward - s0Mine.passesForward;
  out.chainGain = dMine.bestPassChain - s0Mine.bestPassChain;
  return { m: out, ended, signature: signatureOf(fork) };
};

// =============================================================================
// THE RAW COLLECTION per match: sample fork moments, run branch NONE + one branch per
// ARM (+ X-FORK-IDENT), admit the tuple (exclude if ANY branch ENDED within W_MAX).
// =============================================================================
interface ForkRec {
  d: Side; context: Context; gid: number;
  none: Metrics;
  arms: Record<ArmName, Metrics>;
}
interface CensusRow {
  seed: number; forks: ForkRec[];
  drops: { ended: number };
  counts: { qualifying: number; forked: number; capSkipped: number };
  eyeDecisions: number;
  xForkChecked: number; xForkMismatched: number;
}

const runCensusMatch = (seed: number, receipts: ReceiptBook | null): CensusRow => {
  const m = matchOf(seed); // the ARMED R3p eye; homeRegionGrant NULL in the base run
  const forks: ForkRec[] = [];
  let endedDrops = 0; let qualifying = 0; let forked = 0; let capSkipped = 0;
  let xForkChecked = 0; let xForkMismatched = 0;
  let lastForkTime = -Infinity;
  let forksThisMatch = 0;

  while (!m.finished) {
    const owner = m.ball.owner;
    const qualifies = m.phase === 'playing' && owner !== null && m.simTime - lastForkTime >= FORK_SPACING_S;
    if (!qualifies) { m.step(DT); if (m.finished) break; continue; }
    qualifying += 1;
    lastForkTime = m.simTime;
    if (forksThisMatch >= FORK_CAP) { capSkipped += 1; m.step(DT); if (m.finished) break; continue; }

    const d = owner!.side as Side;
    const mine = m.teams[d];
    const context = contextOf(mine.localX(m.ball.pos.x));
    const decisionTick = m.simTick;
    const gid = mine.players.find((p) => p.index === 1 && !p.sentOff)?.gid ?? -1;

    const none = runBranch(m, d, null, seed, decisionTick, receipts);
    const byArm = {} as Record<ArmName, BranchOut>;
    for (const a of ARMS) byArm[a] = runBranch(m, d, a, seed, decisionTick, receipts);
    forked += 1;
    forksThisMatch += 1;

    // X-FORK-IDENT (HARD, 100 % coverage): an independent plain clone == branch NONE.
    const plain = cloneSimulationState(m);
    for (let i = 0; i < W_MAX_TICKS && !plain.finished; i++) plain.step(DT);
    xForkChecked += 1;
    if (signatureOf(plain) !== none.signature) xForkMismatched += 1;

    if (none.ended || ARMS.some((a) => byArm[a].ended)) {
      endedDrops += 1;
      addReceipt(receipts, 'fork-excluded-ended', seed, decisionTick, gid, `d${d} ctx=${context}`);
    } else {
      forks.push({
        d, context, gid, none: none.m,
        arms: Object.fromEntries(ARMS.map((a) => [a, byArm[a].m])) as Record<ArmName, Metrics>,
      });
      addReceipt(receipts, 'fork', seed, decisionTick, gid, `d${d} ctx=${context}`);
    }
    m.step(DT);
    if (m.finished) break;
  }
  return {
    seed, forks, drops: { ended: endedDrops },
    counts: { qualifying, forked, capSkipped },
    eyeDecisions: m.stationEye?.trace?.decisions ?? 0,
    xForkChecked, xForkMismatched,
  };
};

// =============================================================================
// STATISTICS — the match-cluster bootstrap (#20), the P1 engine.
// =============================================================================
type ForkValue = (f: ForkRec) => number;
type CI = { point: number; lower: number; upper: number; n: number };

const meanCI = (rows: readonly CensusRow[], value: ForkValue, offset: number): CI => {
  const stat = (sample: readonly CensusRow[]): number => {
    let sum = 0; let n = 0;
    for (const r of sample) for (const f of r.forks) { sum += value(f); n += 1; }
    return n === 0 ? Number.NaN : sum / n;
  };
  const point = stat(rows);
  const rng = new Rng(STATS_SEED + offset);
  const draws: number[] = [];
  const nRows = rows.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const sample: CensusRow[] = [];
    for (let i = 0; i < nRows; i++) sample.push(rows[rng.int(0, nRows - 1)]);
    const v = stat(sample);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const nForks = sumBy(rows, (r) => r.forks.length);
  return { point: round(point), lower: round(pct(draws, 0.025)), upper: round(pct(draws, 0.975)), n: nForks };
};

// the reported metric surface: raw counters + the two derived shares.
const METRIC_KEYS = [
  'deep', 'box', 'restartTicks', 'foulRestarts', 'foulsByD', 'penaltyRestarts', 'offsides',
  'dupRun', 'spacing', 'thirdMan', 'overlaps', 'forwardShare', 'chainGain',
] as const;
type MetricKey = (typeof METRIC_KEYS)[number];
const readMetric = (m: Metrics, k: MetricKey): number => {
  switch (k) {
    case 'spacing': return m.spacingSamples === 0 ? Number.NaN : m.spacingSum / m.spacingSamples;
    case 'forwardShare': return m.passes === 0 ? Number.NaN : m.passesForward / m.passes; // forward ATTEMPTS / all attempts ∈ [0,1]
    case 'deep': return m.deep;
    case 'box': return m.box;
    case 'restartTicks': return m.restartTicks;
    case 'foulRestarts': return m.foulRestarts;
    case 'foulsByD': return m.foulsByD;
    case 'penaltyRestarts': return m.penaltyRestarts;
    case 'offsides': return m.offsides;
    case 'dupRun': return m.dupRun;
    case 'thirdMan': return m.thirdMan;
    case 'overlaps': return m.overlaps;
    case 'chainGain': return m.chainGain;
    default: return Number.NaN;
  }
};
// NaN-safe pairing: a derived share undefined in EITHER branch contributes 0 to the
// paired delta (declared ex ante; the raw counters are always finite).
const pairedDelta = (a: Metrics, b: Metrics, k: MetricKey): number => {
  const va = readMetric(a, k); const vb = readMetric(b, k);
  return (Number.isFinite(va) && Number.isFinite(vb)) ? va - vb : 0;
};
const levelOf = (m: Metrics, k: MetricKey): number => {
  const v = readMetric(m, k);
  return Number.isFinite(v) ? v : 0;
};

let ciOffset = 100;
const nextOff = (): number => (ciOffset += 1);

const buildLevels = (rows: readonly CensusRow[]) => {
  const out: Record<string, Record<string, number>> = {};
  for (const k of METRIC_KEYS) {
    out[k] = { none: round(mean(rows.flatMap((r) => r.forks.map((f) => levelOf(f.none, k))))) };
    for (const a of ARMS) {
      out[k][a] = round(mean(rows.flatMap((r) => r.forks.map((f) => levelOf(f.arms[a], k)))));
    }
  }
  return out;
};

/** every arm's paired contrast vs a reference branch, on every metric. */
const buildContrasts = (rows: readonly CensusRow[], ref: 'none' | ArmName) => {
  const out: Record<string, Record<string, CI>> = {};
  for (const a of ARMS) {
    if (a === ref) continue;
    out[a] = {};
    for (const k of METRIC_KEYS) {
      out[a][k] = meanCI(rows, (f) => pairedDelta(f.arms[a], ref === 'none' ? f.none : f.arms[ref], k), nextOff());
    }
  }
  return out;
};

// =============================================================================
// ⭐ THE FROZEN GATE (pre-registration §4) — never re-cut after sight.
// =============================================================================
const evalGate = (
  vsUniform: Record<string, Record<string, CI>>,
  uniformVsNone: Record<string, CI>,
  levels: Record<string, Record<string, number>>,
) => {
  const t = vsUniform[TREAT_ARM];
  const primaryCI = t.dupRun;
  const primary = Number.isFinite(primaryCI.upper) && primaryCI.upper < 0;

  const limb = (key: 'deep' | 'box', frac: number) => {
    const benefit = uniformVsNone[key];
    const benefitResolved = Number.isFinite(benefit.upper) && benefit.upper < 0;
    const margin = benefitResolved ? frac * Math.abs(benefit.point) : Number.NaN;
    const ci = t[key];
    const holds = benefitResolved && Number.isFinite(ci.upper) && ci.upper < margin;
    return {
      contrastSpreadMinusUniform: ci,
      uniformBenefitVsNone: benefit, benefitResolved,
      marginFraction: round(frac), margin: round(margin), holds,
      note: benefitResolved
        ? 'non-inferior iff the spread−uniform CI UPPER < margin'
        : 'UNRESOLVED — the uniform arm buys no resolved benefit on this limb at this N ⇒ the margin is '
          + 'UNDEFINED ⇒ the leg fails (declared ex ante; an honest attainability failure, never re-cut).',
    };
  };
  const deep = limb('deep', MARGIN_FRACTION_DEEP);
  const box = limb('box', MARGIN_FRACTION_BOX);

  const offCI = t.offsides;
  const offsideFlagged = Number.isFinite(offCI.lower) && offCI.lower > 0
    && offCI.lower > OFFSIDE_FLAG_MULTIPLE * levels.offsides[CONTROL_ARM];
  const pass = primary && deep.holds && box.holds;

  return {
    predicate: 'PRIMARY: dupRun(spread − uniform) CI UPPER < 0 (duplication resolvedly FALLS) AND '
      + 'NON-INFERIORITY: deep and box (spread − uniform) CI UPPER < the frozen margin '
      + '(margin_limb = fraction_limb × |Δ_limb(uniform − none)|; fractions 0.6700 / 0.2763 derived from the '
      + '#154 certified prices). Flags never gate.',
    primary: { contrast: primaryCI, holds: primary },
    nonInferiority: { deep, box },
    offsideFlag: {
      contrast: offCI, uniformLevel: levels.offsides[CONTROL_ARM], multiple: OFFSIDE_FLAG_MULTIPLE,
      flagged: offsideFlagged,
      note: 'DESCRIPTIVE + FLAG (contract §5): flagged iff the contrast RESOLVES above the uniform level '
        + '(⇔ spread ≥ 2× uniform offsides). NEVER gating; a fired flag returns the axis to the USER (F-S2d).',
    },
    pass,
    emptyCellVacuity: primaryCI.n === 0
      ? 'POOLED CELL EMPTY ⇒ the primary reads UNRESOLVED ⇒ NOT-ADVANCE (attainability failure)'
      : 'co-populated (every admitted fork contributes to every arm)',
    disposition: pass
      ? (offsideFlagged
        ? 'PASS with the OFFSIDE FLAG raised — heterogeneity at matched dose cures duplication non-inferiorly, '
          + 'but the offside axis moved: RETURNS TO THE USER (contract F-S2d; the 乙 axis is user-gated).'
        : 'PASS — heterogeneity at MATCHED dose resolvedly reduces duplication and does not sell the certified '
          + 'defence: H-157c SUPPORTED; the arc proceeds to S2-P2 on commander review.')
      : (!primary
        ? 'NOT-ADVANCE (F-S2a) — the spread arm does not resolvedly reduce dupRun at matched mean: H-157c is '
          + 'recorded WRONG; RETURNS to the commander (the named alternative = the punish-compactness substrate).'
        : 'NOT-ADVANCE (F-S2b) — duplication falls but a certified-currency limb is inferior beyond the frozen '
          + 'margin (or its margin is UNRESOLVED): the look-vs-value fork RETURNS TO THE USER.'),
  };
};

// =============================================================================
// ⭐ THE S2-P1b CONFIRMATORY GATE (ruling #162.3, copied VERBATIM) — never re-cut.
//   (a) dupRun( backLoaded − none ) CI UPPER < 0    — 撞车大减 must REPLICATE on fresh seeds
//   (b) box   ( backLoaded − none ) CI UPPER < 0    — 门前的账不亏: the 12× currency must PAY
//   (c) deep  ( backLoaded − none ) CI LOWER ≤ 0    — 外围打平: must not RESOLVE worse
// PASS := (a) ∧ (b) ∧ (c) ∧ the football hard gates ∧ the X-family. The OFFSIDE FLAG is
// DESCRIPTIVE and NEVER gating: fired iff offsides(backLoaded − none) CI LOWER > +0.0338.
// =============================================================================
const evalConfirmGate = (
  vsNone: Record<string, Record<string, CI>>,
  levels: Record<string, Record<string, number>>,
) => {
  const t = vsNone[CONFIRM_TREAT_ARM];
  // magnitude reporting, the P3′ replication idiom: the S2-P1 SEEN value is CONTEXT ONLY.
  const replication = (key: 'dupRun' | 'deep' | 'box' | 'offsides') => {
    const seen: number = S2P1_SEEN_VS_NONE[key];
    const frac = seen === 0 ? Number.NaN : t[key].point / seen;
    return { s2p1Seen: seen, replicatedFractionOfSeen: round(frac, 4) };
  };

  const legA = {
    leg: '(a) PRIMARY 撞车大减', reading: 'dupRun(backLoaded − none) CI UPPER < 0',
    contrast: t.dupRun, holds: Number.isFinite(t.dupRun.upper) && t.dupRun.upper < 0,
    ...replication('dupRun'),
    note: 'MAGNITUDE IS DESCRIPTIVE, the P3′ replication idiom: the leg is DIRECTIONAL, so a '
      + 'confirmatory run reproducing even HALF the S2-P1 seen −2.4543 still HOLDS leg (a) — the '
      + 'honest reading is then "the effect replicates, smaller than first seen", and the fraction '
      + 'above is the number to report. The leg is never re-cut on the magnitude.',
  };
  const legB = {
    leg: '(b) 门前的账不亏', reading: 'box(backLoaded − none) CI UPPER < 0',
    contrast: t.box, holds: Number.isFinite(t.box.upper) && t.box.upper < 0,
    ...replication('box'),
    note: 'the 12×-currency limb: box entries suffered must resolvedly FALL against the WILD world '
      + '(the NONE anchor) — an agreement that costs the box is not bought.',
  };
  const legC = {
    leg: '(c) 外围打平', reading: 'deep(backLoaded − none) CI LOWER ≤ 0 (must not RESOLVE worse)',
    contrast: t.deep, holds: Number.isFinite(t.deep.lower) && t.deep.lower <= 0,
    ...replication('deep'),
    note: 'a BREAK-EVEN leg, not a benefit leg (#162.2.iii: break-even is the honest bar for rung ONE '
      + 'of the doctrine ladder). N is FROZEN EX ANTE at 8,000 precisely so this leg cannot be passed '
      + 'by underpowering — the S2-P1 source estimate carried the same N and the same forks.',
  };

  const offCI = t.offsides;
  const offsideFlagged = Number.isFinite(offCI.lower) && offCI.lower > CONFIRM_OFFSIDE_FLAG_ABS;
  const pass = legA.holds && legB.holds && legC.holds;

  return {
    predicate: 'PASS := (a) dupRun(backLoaded − none) CI UPPER < 0 ∧ (b) box(backLoaded − none) CI '
      + 'UPPER < 0 ∧ (c) deep(backLoaded − none) CI LOWER ≤ 0 ∧ the football hard gates ∧ the X-family '
      + '(ruling #162.3, copied verbatim). The uniform arm is a DESCRIPTIVE reference and appears in NO '
      + 'gate leg. The offside flag NEVER gates.',
    anchor: 'vs NONE (the wild world), per the user ruling 考 at the #161.5 fork: 门前的账不亏 · '
      + '外围打平 · 撞车大减 (#162.1).',
    nFrozen: CONFIRM_N_FROZEN,
    legA, legB, legC,
    offsideFlag: {
      contrast: offCI, threshold: CONFIRM_OFFSIDE_FLAG_ABS, ...replication('offsides'),
      flagged: offsideFlagged,
      note: 'DESCRIPTIVE, NEVER GATING (#162.3): fired iff the offsides(backLoaded − none) CI LOWER '
        + 'exceeds +0.0338 = 2 × the S2-P1 seen +0.0169 (the #152.4 doubling idiom). A fired flag ⇒ '
        + 'F-S2d: the 乙 offside axis returns to the USER, and it never flips PASS/FAIL.',
    },
    descriptiveReference: {
      arm: CONFIRM_REFERENCE_ARM, contrasts: vsNone[CONFIRM_REFERENCE_ARM] ?? null,
      note: 'the slice-1 PRIOR content (the whole-team whisper) carried as a LEVEL/CONTRAST reference '
        + 'so the confirmatory read has its S2-P1 context — it is in NO gate leg.',
    },
    pass,
    emptyCellVacuity: t.dupRun.n === 0
      ? 'POOLED CELL EMPTY ⇒ every leg reads UNRESOLVED ⇒ NOT-ADVANCE (attainability failure)'
      : 'co-populated (every admitted fork contributes to NONE and to every arm)',
    disposition: pass
      ? (offsideFlagged
        ? 'PASS with the OFFSIDE FLAG raised — the backLoaded read CONFIRMS on fresh seeds (撞车大减, '
          + '门前的账不亏, 外围打平), but the offside axis moved ≥ 2× the S2-P1 seen level: F-S2d, '
          + 'RETURNS TO THE USER (the 乙 axis is user-gated, #158).'
        : 'PASS — the S2-P1 descriptive backLoaded read is CONFIRMED on FRESH seeds against the wild '
          + 'world: duplication resolvedly falls, the box account resolvedly pays, and the outer account '
          + 'does not resolve worse. Self-drive proceeds to S2-P2 (gene-ization, offsets born ABSENT) on '
          + 'commander review.')
      : `NOT-ADVANCE — the confirmatory exam FAILED: ${[
        legA.holds ? null : 'leg (a) dupRun', legB.holds ? null : 'leg (b) box',
        legC.holds ? null : 'leg (c) deep',
      ].filter((x) => x !== null).join(' + ')}. STOP; the fork RETURNS TO THE USER (#162.3).`,
    levelsNote: `per-arm LEVELS are published for none/${CONFIRM_REFERENCE_ARM}/${CONFIRM_TREAT_ARM} on every `
      + 'instrument (levels.* above); the S2-P1 instrument debt (the DEDICATED foul counter, the E4 '
      + 'combination counters, the DESCRIPTIVE proximity block whose verdict authority is the USER\'s) '
      + 'is carried UNCHANGED.',
    offsideLevels: levels.offsides,
  };
};

// =============================================================================
// THE SIZING SMOKE — populations + the primary σ̂ + the FROZEN N arithmetic.
// The wall-derived half is computed OUTSIDE the X-DET-compared core (#128).
// =============================================================================
interface SizingRaw { sigma: number; mdl: number; forksPerMatch: number; nMatches: number }

const buildSizingCore = (rows: readonly CensusRow[]): { sizing: Record<string, unknown>; raw: SizingRaw } => {
  const nMatches = rows.length;
  const primaryOf = (f: ForkRec): number => pairedDelta(f.arms[TREAT_ARM], f.arms[CONTROL_ARM], 'dupRun');
  const perMatchDelta = rows.map((r) => (r.forks.length === 0
    ? Number.NaN : mean(r.forks.map(primaryOf))));
  const sigma = sampleSd(perMatchDelta);
  const pooled = meanCI(rows, primaryOf, 1).point;
  const levels = buildLevels(rows);
  // ⭐ the MDL, its derivation FLAGGED: the absolute floor is the #157 duplication cost
  // (dupRun +7.8 % on PRIOR−R3p) expressed on the UNIFORM arm's own dup-run level — the
  // slice must be able to resolve a FULL cure of the observed damage; the 0.5·|point|
  // guard stops smoke noise INFLATING the MDL.
  const mdlAbs = MDL_REL_157 * levels.dupRun[CONTROL_ARM];
  const mdl = Math.min(0.5 * Math.abs(pooled), mdlAbs);

  const totalForks = sumBy(rows, (r) => r.forks.length);
  const strataN: Record<string, number> = {};
  for (const c of CONTEXTS) strataN[c] = sumBy(rows, (r) => r.forks.filter((f) => f.context === c).length);
  const capBound = rows.some((r) => r.counts.capSkipped > 0);

  return {
    sizing: {
      nMatches, finiteMatchesForSigma: perMatchDelta.filter(Number.isFinite).length,
      armVectors: ARM_VECTORS, controlArm: CONTROL_ARM, treatArm: TREAT_ARM,
      populations: {
        perMatchForksMean: round(mean(rows.map((r) => r.forks.length))), totalForks,
        forkContextStrataN: strataN,
        qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
        forkedTotal: sumBy(rows, (r) => r.counts.forked),
        capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
        forkCapPerMatch: FORK_CAP, forkCapBinds: capBound,
        endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
        eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
        xForkChecked: sumBy(rows, (r) => r.xForkChecked),
        xForkMismatched: sumBy(rows, (r) => r.xForkMismatched),
      },
      armLevels: levels,
      smokeContext: {
        note: 'SMOKE CONTEXT ONLY — sizing, never a verdict; no gate leg is read here and none of these '
          + 'numbers may inform the frozen gate (I-A6).',
        pooledPrimaryDelta: round(pooled),
        uniformDupRunLevel: levels.dupRun[CONTROL_ARM],
        uniformDeepLevel: levels.deep[CONTROL_ARM], uniformBoxLevel: levels.box[CONTROL_ARM],
        uniformOffsideLevel: levels.offsides[CONTROL_ARM], uniformFoulLevel: levels.foulRestarts[CONTROL_ARM],
      },
      sigmaPerMatchPrimary: round(sigma), mdl: round(mdl), mdlAbsFrom157: round(mdlAbs),
      nArithmetic: {
        mdlFormula: 'MDL = min( 0.5·|dupRun(spread−uniform) smoke point| , 0.078 × uniform dup-run level ) '
          + '— the absolute floor is a FULL cure of the #157-observed +7.8 % duplication cost',
        seFormula: 'SE_N = σ̂·√(1/N); resolve at 95 % power ⇒ SE_N ≤ MDL / 3.605 (POWER_Z)',
        nStarFormula: 'N* = smallest 200-step N with SE_N ≤ MDL/POWER_Z, capped at N_MAX',
        powerZ: POWER_Z, nStep: N_STEP, nCap: N_CAP, wallBudgetHours: WALL_BUDGET_HOURS,
        note: 'per-fork vs per-match accounting: the delta statistic is a MEAN OVER FORKS; the resample/σ̂ unit is the MATCH.',
      },
    },
    raw: { sigma, mdl, forksPerMatch: nMatches === 0 ? 0 : totalForks / nMatches, nMatches },
  };
};

interface WallArithmetic {
  perMatchWallMs: number; nMaxWall: number; nMax: number;
  nStar: number; nBinding: number; underPowered: boolean; reducedPowerDisclosure: boolean;
  projectedForksAtNStar: number; projectedPrimaryPowerAtNStar: number; note: string;
}
const computeWallArithmetic = (raw: SizingRaw, perMatchWallMs: number): WallArithmetic => {
  const { sigma, mdl, forksPerMatch } = raw;
  const wallStepN = (n: number): number => n * perMatchWallMs * XDET_FACTOR;
  let nMaxWall = 0;
  for (let n = N_STEP; n <= N_CAP; n += N_STEP) { if (wallStepN(n) <= WALL_BUDGET_MS) nMaxWall = n; }
  const nMax = Math.min(nMaxWall === 0 ? N_STEP : nMaxWall, N_CAP);

  let nStar: number; let underPowered = false; let note = 'resolvable at N* ≤ N_MAX';
  if (!Number.isFinite(sigma) || !Number.isFinite(mdl) || mdl <= 0) {
    nStar = nMax; underPowered = true;
    note = 'σ̂ or MDL undefined/zero ⇒ N* := N_MAX; UNDER-POWERED (published); the primary reads UNRESOLVED at the gate';
  } else {
    const needRaw = (POWER_Z * sigma / mdl) ** 2;
    nStar = Math.min(Math.ceil(needRaw / N_STEP) * N_STEP, nMax);
    if (needRaw > nMax) { underPowered = true; note = 'N* > N_MAX ⇒ UNDER-POWERED (published); the census runs at N_MAX and the primary reads UNRESOLVED at the gate'; }
  }
  const seAtNStar = Number.isFinite(sigma) ? sigma * Math.sqrt(1 / nStar) : Number.NaN;
  return {
    perMatchWallMs: round(perMatchWallMs, 2), nMaxWall, nMax,
    nStar, nBinding: nStar, underPowered, reducedPowerDisclosure: underPowered,
    projectedForksAtNStar: Math.round(forksPerMatch * nStar),
    projectedPrimaryPowerAtNStar: (Number.isFinite(seAtNStar) && mdl > 0) ? round(phi(mdl / seAtNStar - Z_975), 4) : Number.NaN,
    note: `${note}. Pass nStar as A4S2P1_N to the census. Wall INCLUDES arms (each fork = ONE branch NONE + `
      + `${ARMS.length} arm branches + one X-FORK-IDENT step-through, each up to W_MAX_TICKS on the ARMED R3p eye).`,
  };
};

// =============================================================================
// ⭐ THE S2-P1b BOUNDED SMOKE — WALL + PLUMBING ONLY. N is FROZEN at 8,000 by #162.3, so
// this block computes NO contrast, NO gate and NO N arithmetic: it exists to confirm the
// per-match wall cost of the three-branch fork and that every counter/gate plumbs through.
// =============================================================================
const buildConfirmSmokeCore = (rows: readonly CensusRow[]) => {
  const strataN: Record<string, number> = {};
  for (const c of CONTEXTS) strataN[c] = sumBy(rows, (r) => r.forks.filter((f) => f.context === c).length);
  return {
    nMatches: rows.length,
    armVectors: Object.fromEntries(ARMS.map((a) => [a, ARM_VECTORS[a]])),
    branches: ['none', ...ARMS],
    treatArm: CONFIRM_TREAT_ARM, referenceArm: CONFIRM_REFERENCE_ARM,
    populations: {
      perMatchForksMean: round(mean(rows.map((r) => r.forks.length))),
      totalForks: sumBy(rows, (r) => r.forks.length),
      forkContextStrataN: strataN,
      qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
      forkedTotal: sumBy(rows, (r) => r.counts.forked),
      capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
      forkCapPerMatch: FORK_CAP, forkCapBinds: rows.some((r) => r.counts.capSkipped > 0),
      endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
      eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
      xForkChecked: sumBy(rows, (r) => r.xForkChecked),
      xForkMismatched: sumBy(rows, (r) => r.xForkMismatched),
    },
    armLevels: buildLevels(rows),
    note: '⭐ WALL + PLUMBING ONLY. N is FROZEN EX ANTE at 8,000 by ruling #162.3 — this smoke sizes '
      + 'NOTHING and informs NOTHING. NO contrast, NO σ̂, NO MDL, NO N arithmetic and NO gate leg is '
      + 'computed here, so no frozen number can be touched by it (I-A6, #105.4). The levels below only '
      + 'evidence that every S2-P1 instrument (deep/box, the DESCRIPTIVE proximity block, restarts, the '
      + 'DEDICATED foul counter, offsides, the E4 combination counters) populates on the three branches.',
  };
};

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET) — mode-dispatched payload.
// =============================================================================
const runExperiment = (pass: number) => {
  const seeds: number[] = [];
  for (let k = 0; k < MATCH_COUNT; k++) seeds.push(SEED_BASE + k);
  const receipts: ReceiptBook = {};
  const t0 = Date.now();
  const rows: CensusRow[] = [];
  for (let i = 0; i < seeds.length; i++) {
    rows.push(runCensusMatch(seeds[i], receipts));
    if ((i + 1) % PROGRESS_EVERY === 0 || i === seeds.length - 1) {
      const forksSoFar = sumBy(rows, (r) => r.forks.length);
      console.error(`A4-S2P1 [${MODE} pass ${pass}] ${i + 1}/${seeds.length} matches · forks ${forksSoFar}`
        + ` · ${((Date.now() - t0) / 1000).toFixed(1)} s elapsed`);
    }
  }
  const perMatchWallMs = seeds.length === 0 ? 0 : (Date.now() - t0) / seeds.length;

  ciOffset = 100; // deterministic bootstrap offsets on every pass (X-DET)
  const seedRange = { first: seeds[0] ?? null, last: seeds[seeds.length - 1] ?? null, count: seeds.length };
  const receiptOut = {
    cap: RECEIPT_CAP,
    counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
    records: receipts,
  };
  const xForkChecked = sumBy(rows, (r) => r.xForkChecked);
  const xForkMismatched = sumBy(rows, (r) => r.xForkMismatched);
  const xFork = { checked: xForkChecked, mismatched: xForkMismatched, pass: xForkMismatched === 0 };

  if (MODE === 'confirm-smoke') {
    return {
      core: {
        mode: 'confirm-smoke' as const, seedRange,
        seedFamily: '12,256,000 + k, k∈0..39 (the S2-P1b plumbing block; inside the remaining pool '
          + '12.237M–12.3M; DISJOINT from the S2-P1b gate block 12,248,000–12,255,999 and from every '
          + 'consumed block incl. S2-P1\'s own smoke/census)',
        wPriceS: W_PRICE_S, xForkIdent: xFork, confirmSmoke: buildConfirmSmokeCore(rows),
        receipts: receiptOut,
      },
      wallMs: perMatchWallMs, sizingRaw: null,
    };
  }
  if (MODE === 'confirm') {
    const levels = buildLevels(rows);
    const vsNone = buildContrasts(rows, 'none');
    const gate = evalConfirmGate(vsNone, levels);
    return {
      core: {
        mode: 'confirm' as const, seedRange,
        seedFamily: '12,248,000 + k, k∈0..7,999 (FRESH; inside the remaining pool; disjoint from the '
          + 'S2-P1 census 12,240,000–12,247,999 and from the S2-P1b smoke block)',
        wPriceS: W_PRICE_S,
        armVectors: Object.fromEntries(ARMS.map((a) => [a, ARM_VECTORS[a]])),
        armLevels: levels, contrastsVsNone: vsNone, gate, xForkIdent: xFork,
        populations: {
          totalForks: sumBy(rows, (r) => r.forks.length),
          qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
          forkedTotal: sumBy(rows, (r) => r.counts.forked),
          capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
          endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
          eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
        },
        receipts: receiptOut,
      },
      wallMs: perMatchWallMs, sizingRaw: null,
    };
  }
  if (MODE === 'smoke') {
    const { sizing, raw } = buildSizingCore(rows);
    return {
      core: {
        mode: 'smoke' as const, seedRange,
        seedFamily: '12,237,000 + k, k∈0..39 (sizing only; inside the remaining pool 12.237M–12.3M; disjoint from the census block)',
        wPriceS: W_PRICE_S, xForkIdent: xFork, sizing, receipts: receiptOut,
      },
      wallMs: perMatchWallMs, sizingRaw: raw,
    };
  }
  const levels = buildLevels(rows);
  const vsNone = buildContrasts(rows, 'none');
  const uniformVsNone = Object.fromEntries(METRIC_KEYS.map((k) => [
    k, meanCI(rows, (f) => pairedDelta(f.arms[CONTROL_ARM], f.none, k), nextOff()),
  ])) as Record<string, CI>;
  const vsUniform = buildContrasts(rows, CONTROL_ARM);
  const gate = evalGate(vsUniform, uniformVsNone, levels);
  return {
    core: {
      mode: 'census' as const, seedRange,
      seedFamily: '12,240,000 + k, k∈0..N−1 (inside the remaining pool; disjoint from the smoke block)',
      wPriceS: W_PRICE_S, armVectors: ARM_VECTORS,
      armLevels: levels,
      contrastsVsNone: vsNone, uniformVsNone, contrastsVsUniform: vsUniform,
      gate,
      xForkIdent: xFork,
      populations: {
        totalForks: sumBy(rows, (r) => r.forks.length),
        qualifyingTotal: sumBy(rows, (r) => r.counts.qualifying),
        forkedTotal: sumBy(rows, (r) => r.counts.forked),
        capSkippedTotal: sumBy(rows, (r) => r.counts.capSkipped),
        endedDropsTotal: sumBy(rows, (r) => r.drops.ended),
        eyeDecisionsTotal: sumBy(rows, (r) => r.eyeDecisions),
      },
      receipts: receiptOut,
    },
    wallMs: perMatchWallMs, sizingRaw: null,
  };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET, the X-family, disjointness, the verdict.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);
const { core: experiment, wallMs, sizingRaw } = runExperiment(1);
const experiment2 = SKIP_DET ? null : runExperiment(2).core;
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

if (experiment.mode === 'smoke' && sizingRaw !== null) {
  (experiment.sizing as { nArithmetic: Record<string, unknown> }).nArithmetic = {
    ...(experiment.sizing as { nArithmetic: Record<string, unknown> }).nArithmetic,
    ...computeWallArithmetic(sizingRaw, wallMs),
  };
}

const xForkIdent = experiment.xForkIdent.pass;
const mergeIdent = buildMergeIdent();
const priorEquivalence = buildPriorEquivalence();
const eNonStation = checkENonStation();

let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
let fingerprint = 'skipped'; let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fingerprint = 'skipped (preflight)'; } else {
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  xFpProd = fingerprint === FINGERPRINT_BASELINE;
}

// SEED DISJOINTNESS (HARD) — computed from the FROZEN family constants.
const censusMaxSeed = CENSUS_SEED_BASE + N_CAP - 1; // 12,247,999
const smokeMaxSeed = SMOKE_SEED_BASE + SMOKE_MATCHES - 1; // 12,237,039
const confirmMaxSeed = CONFIRM_SEED_BASE + CONFIRM_N_FROZEN - 1; // 12,255,999
const confirmSmokeMaxSeed = CONFIRM_SMOKE_SEED_BASE + CONFIRM_SMOKE_MATCHES - 1; // 12,256,039
const disjointFrom = (aLo: number, aHi: number, bLo: number, bHi: number): boolean => aHi < bLo || bHi < aLo;
// ⭐ S2-P1b consumes S2-P1's OWN blocks as well (added ONLY on the confirmatory modes, so the
// S2-P1 census-mode gate is byte-unchanged).
const ACTIVE_CONSUMED: readonly (readonly [number, number])[] = IS_CONFIRM
  ? [...CONSUMED_BLOCKS, ...CONFIRM_EXTRA_CONSUMED]
  : CONSUMED_BLOCKS;
const seedDisjoint = IS_CONFIRM
  ? (CONFIRM_SEED_BASE >= RESERVED_BAND[0] && confirmSmokeMaxSeed <= RESERVED_BAND[1]
    && confirmMaxSeed < CONFIRM_SMOKE_SEED_BASE
    && ACTIVE_CONSUMED.every(([lo, hi]) => disjointFrom(CONFIRM_SEED_BASE, confirmMaxSeed, lo, hi)
      && disjointFrom(CONFIRM_SMOKE_SEED_BASE, confirmSmokeMaxSeed, lo, hi)))
  : (SMOKE_SEED_BASE >= RESERVED_BAND[0] && censusMaxSeed <= RESERVED_BAND[1]
    && smokeMaxSeed < CENSUS_SEED_BASE
    && CONSUMED_BLOCKS.every(([lo, hi]) => disjointFrom(SMOKE_SEED_BASE, smokeMaxSeed, lo, hi)
      && disjointFrom(CENSUS_SEED_BASE, censusMaxSeed, lo, hi)));

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = {
  xDet, xForkIdent, xMergeIdent: mergeIdent.pass, priorEquivalence: priorEquivalence.pass,
  eNonStation: eNonStation.pass, xFpProd, seedDisjoint,
};

let verdict: string;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the R3p arm, the fork sampling, branch NONE + `
    + 'the five vector arms, X-FORK-IDENT, X-MERGE-IDENT, priorEquivalence, E-NONSTATION, every instrument '
    + '(deep/box, proximity, restarts, the DEDICATED foul counter, offsides, the E4 counters) and X-DET on a capped slice.';
} else if (xDet === false) {
  verdict = 'FAIL — X-DET: the output is not byte-identical across the double-run; STOP';
} else if (!xForkIdent) {
  verdict = 'FAIL — X-FORK-IDENT: branch NONE diverged from an independent plain step-through (fork leakage); STOP';
} else if (!mergeIdent.pass) {
  verdict = 'FAIL — X-MERGE-IDENT: the injected merged table SHA/rehash does not match the P3p-1 identity; STOP';
} else if (!priorEquivalence.pass) {
  verdict = 'FAIL — priorEquivalence: the arms are not anchored at the certified whisper (mean 0.5 / 0.25×VAL_SCALE); STOP';
} else if (!eNonStation.pass) {
  verdict = 'FAIL — E-NONSTATION: the eye did not activate on the R3p world, or it overrode the ball carrier; STOP';
} else if (!xFpProd) {
  verdict = 'FAIL — X-FP-PROD: the production fingerprint moved (the dormant seam is not dormant); STOP';
} else if (!seedDisjoint) {
  verdict = 'FAIL — SEED DISJOINTNESS: a seed family escaped the pool or collided; STOP';
} else if (MODE === 'smoke') {
  verdict = 'SIZING SMOKE — NOT a verdict: realises the fork populations, the arm levels, the primary σ̂ and the '
    + 'per-match wall, and pins the census N via the frozen arithmetic. Pass nArithmetic.nStar as A4S2P1_N.';
} else if (MODE === 'confirm-smoke') {
  verdict = 'S2-P1b BOUNDED SMOKE — NOT a verdict and NOT a sizing: it confirms the per-match wall of the '
    + 'three-branch fork and that every counter + hard gate plumbs through. N is FROZEN at 8,000 (#162.3); '
    + 'no contrast, no gate leg and no N arithmetic is computed here.';
} else if (MODE === 'confirm') {
  verdict = (experiment as Extract<typeof experiment, { mode: 'confirm' }>).gate.disposition;
} else {
  verdict = (experiment as Extract<typeof experiment, { mode: 'census' }>).gate.disposition;
}

const body = {
  experiment: IS_CONFIRM
    ? `A4 S2-P1b (the backLoaded CONFIRMATORY exam on FRESH seeds, against the NONE anchor) [${MODE}]`
    : `A4 S2-P1 (the per-body obedience VECTOR census — heterogeneity at MATCHED whisper dose) [${MODE}]`,
  authority: IS_CONFIRM
    ? 'docs/world-model/A4-S2P1B-BACKLOADED-CONFIRMATORY.md (the FROZEN pre-registration) — which '
      + 'ELABORATES and never re-cuts ruling #162.3 (the gate frozen at commander level: arms, seeds, '
      + 'N = 8,000, the three legs, the offside flag threshold +0.0338); #162.1 (the user rules 考: '
      + '门前的账不亏 · 外围打平 · 撞车大减); #162.2 (the VISION audit); #161 (the S2-P1 census, '
      + 'F-S2b, and the descriptive backLoaded read this exam confirms or refutes); '
      + 'docs/world-model/A4-S2P1-VECTOR-CENSUS.md (the machinery, the instruments, the X-family); '
      + 'A4-SLICE2-PERBODY-CONTRACT §3 (BIRTH NEUTRALITY + Road B) / §5 (the #157 instrument debt) / '
      + '§6 (F-S2d); #152.4 (the FLAG doubling idiom); A4-P3PRIME-REPLICATION (the replication idiom)'
    : 'docs/world-model/A4-S2P1-VECTOR-CENSUS.md (the FROZEN pre-registration); '
    + 'A4-SLICE2-PERBODY-CONTRACT §1/§2/§3/§4/§5 (ruling #158); #157 (the user\'s play verdict); '
    + '#154 (the certified slice-1 prices); #152 (descriptive proximity + the FLAG idiom); #148 (the certified whisper); '
    + 'the A4-P1c probe idiom (the R3p fixture, the paired same-seed fork, the X-family, the sizing arithmetic)',
  head, mode: MODE,
  world: 'ENRICHED (#67.3) + the ARMED R3p eye (v3 base+children+SHA; v4 inSupportLaw+deliveryBit+offsideBit); '
    + 'homeRegionGrant NULL in the base run — the vectors exist ONLY on the fork clones',
  flags: CENSUS_FLAGS,
  seam: 'Match.homeRegionGrant, VECTOR member { side, obedienceByIndex } (the P1c single-body member untouched). '
    + 'Each side-d outfield body reads HIS OWN obedience → homePriorStrength → the SAME homeMapBias closure over HIS '
    + 'OWN ATTACK_FORMATIONS home at the established v3 consumption point. A uniform 0.5 vector is BYTE-IDENTICAL to '
    + 'the shipped-form prior on that side (tests/a4S2VectorGrant.test.ts).',
  birthNeutrality: 'Contract §3: the vectors are MEASUREMENT FORKS. No role-derived birth default exists anywhere in '
    + 'src/**; the shipped gene is a single per-TEAM obedience born absent; nothing here ships.',
  preflight: IS_PREFLIGHT ? { cap: Number.isFinite(CAP) ? CAP : null, forkCap: FORK_CAP, seedBase: SEED_BASE, skipFp: SKIP_FP, note: 'bounded preflight — not a verdict' } : null,
  parameters: {
    matchCount: MATCH_COUNT, plannedMatches: PLANNED_MATCHES, nEnv: N_ENV,
    nCensus: MODE === 'census' ? N_CENSUS : null, nCap: N_CAP,
    seedBaseFrozen: FROZEN_BASE, seedBaseUsed: SEED_BASE,
    reservedBand: RESERVED_BAND, censusSeedBase: CENSUS_SEED_BASE, smokeSeedBase: SMOKE_SEED_BASE,
    censusSeedRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeSeedRange: [SMOKE_SEED_BASE, smokeMaxSeed],
    consumedBlocks: CONSUMED_BLOCKS,
    wPriceS: W_PRICE_S, forkSpacingS: FORK_SPACING_S, forkCapPerMatch: FORK_CAP,
    armVectors: ARM_VECTORS,
    controlArm: IS_CONFIRM ? 'none' : CONTROL_ARM,
    treatArm: IS_CONFIRM ? CONFIRM_TREAT_ARM : TREAT_ARM,
    meanTarget: MEAN_TARGET,
    valScaleRecomputed: round(VAL_SCALE), whisperStrength: homePriorStrength(MEAN_TARGET),
    certifiedSlice1Prices: {
      deep: { point: CERT_DEEP_POINT, ciNearZero: CERT_DEEP_NEAR_ZERO },
      box: { point: CERT_BOX_POINT, ciNearZero: CERT_BOX_NEAR_ZERO },
      source: 'ruling #154 (A4-P3′, PRIOR−R3p, per set)',
    },
    // the S2-P1 non-inferiority machinery — NOT part of the S2-P1b gate (#162.3 replaced the
    // spread-vs-uniform margins with the three vs-NONE legs), so it is omitted there.
    ...(IS_CONFIRM ? {} : {
      marginFractions: { deep: round(MARGIN_FRACTION_DEEP), box: round(MARGIN_FRACTION_BOX) },
      offsideFlagMultiple: OFFSIDE_FLAG_MULTIPLE, mdlRelFrom157: MDL_REL_157,
    }),
    bootstrapSeed: STATS_SEED,
    bootstrapResamples: BOOTSTRAP_RESAMPLES,
    statsSeedReserved: IS_CONFIRM ? CONFIRM_STATS_SEED_RESERVED : STATS_SEED_RESERVED,
    clusterUnit: 'match seed (#20); the delta statistic is a mean over forks',
    restThird: REST_THIRD, boxInnerLocalX: BOX_INNER_X, boxDepth: BOX_DEPTH, boxWidth: BOX_WIDTH,
    dupRunM: DUP_RUN_M, sampleEvery: SAMPLE_EVERY, contexts: CONTEXTS,
    metricKeys: METRIC_KEYS,
    // ⭐ present ONLY on the S2-P1b modes, so the S2-P1 smoke/census payloads are byte-unchanged.
    ...(IS_CONFIRM ? {
      confirmatory: {
        ruling: '#162.3 — frozen at COMMANDER level; the stage doc elaborates and NEVER re-cuts',
        activeArms: ARMS, branches: ['none', ...ARMS],
        treatArm: CONFIRM_TREAT_ARM, referenceArm: CONFIRM_REFERENCE_ARM,
        referenceArmIsDescriptiveOnly: true,
        anchor: 'none (the wild world)',
        nFrozen: CONFIRM_N_FROZEN, nEnvRefused: true,
        gateSeedRange: [CONFIRM_SEED_BASE, confirmMaxSeed],
        smokeSeedRange: [CONFIRM_SMOKE_SEED_BASE, confirmSmokeMaxSeed],
        bootstrapSeed: CONFIRM_BOOTSTRAP_SEED, statsSeedReserved: CONFIRM_STATS_SEED_RESERVED,
        offsideFlagAbsolute: CONFIRM_OFFSIDE_FLAG_ABS,
        s2p1SeenVsNone: S2P1_SEEN_VS_NONE,
        extraConsumedBlocks: CONFIRM_EXTRA_CONSUMED,
        legs: {
          a: 'dupRun(backLoaded − none) CI UPPER < 0',
          b: 'box(backLoaded − none) CI UPPER < 0',
          c: 'deep(backLoaded − none) CI LOWER ≤ 0',
        },
      },
    } : {}),
  },
  result: experiment,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xForkIdent: { pass: xForkIdent, checked: experiment.xForkIdent.checked, mismatched: experiment.xForkIdent.mismatched, note: 'branch NONE == an independent plain step-through on EVERY fork (zero leakage)' },
    xMergeIdent: { ...mergeIdent, note: 'the injected P3p-1 merged table identity (battery X-MERGE-SHA), inherited HARD gate' },
    priorEquivalence,
    eNonStation: { ...eNonStation, note: 'the eye ACTIVATES on the R3p world AND never overrides the ball carrier, inherited HARD gate' },
    xFpProd: { pass: xFpProd, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, skipped: SKIP_FP, note: 'src IS touched (the vector generalization of the dormant seam) ⇒ git diff src is NON-empty BY DESIGN; Road B = X-FP-PROD + the flag-off byte-identity test (tests/a4S2VectorGrant.test.ts)' },
    srcDiffStat: srcDiff, srcDiffExpectedNonEmpty: true,
    seedDisjoint: IS_CONFIRM
      ? {
        pass: seedDisjoint, reservedBand: RESERVED_BAND,
        confirmGateRange: [CONFIRM_SEED_BASE, confirmMaxSeed],
        confirmSmokeRange: [CONFIRM_SMOKE_SEED_BASE, confirmSmokeMaxSeed],
        consumedBlocks: ACTIVE_CONSUMED,
        note: 'the S2-P1b ledger: BOTH S2-P1 blocks (smoke 12,237,000–12,237,039 and census '
          + '12,240,000–12,247,999) are now CONSUMED and asserted disjoint, as is every earlier arc block; '
          + 'the gate block 12,248,000–12,255,999 and the plumbing-smoke block 12,256,000–12,256,039 are '
          + 'mutually disjoint and inside the remaining pool 12.237M–12.3M.',
      }
      : { pass: seedDisjoint, reservedBand: RESERVED_BAND, censusRange: [CENSUS_SEED_BASE, censusMaxSeed], smokeRange: [SMOKE_SEED_BASE, smokeMaxSeed], consumedBlocks: CONSUMED_BLOCKS },
    xCorpusIdent: 'N/A (a fresh interventional corpus has no identity target — the P1 §4 precedent)',
  },
  gates,
  deviations: [
    'SINGLE-ANCHOR IS MATCHED-MEAN (flagged): contract §4 names single-anchor "the P1c echo" (one high body, the '
    + 'rest silent), which would carry mean 0.2 and confound SHAPE with DOSE. The arm is frozen at '
    + '[1.0, 0.375, 0.375, 0.375, 0.375] (mean 0.5) so the whole grid is dose-matched; the silent-rest variant is '
    + 'named as a later instrument, not run here.',
    'THE VECTOR SEAM generalizes Match.homeRegionGrant with a SECOND union member; the P1c single-body member is '
    + 'untouched and still takes its own branch. The vector arm consumes the SHIPPED-FORM strength map + the P1d '
    + 'homeMapBias closure (per-body ATTACK_FORMATIONS homes) — NOT the P1c back-region bias — because the slice-1 '
    + 'control this grid must match is the map-shaped whisper (#148/#154), not the single back region.',
    'ONE-SIDED FORKS (the P1c machinery, contract §4): the vector is granted to the possessing side d only; the '
    + 'both-sides form is the S2-P3 battery\'s business.',
    'THE #157 DEBT is implemented PROBE-SIDE from the match\'s own public ledgers (TeamMatchStats): the DEDICATED '
    + 'foul counter = window Δ fouls (both sides; every foul hands over a free kick or a penalty) with penalties '
    + 'counted separately, offsides = window Δ offsides, and the E4 counters = window Δ {thirdMan, overlaps, '
    + 'passesForward/passes, bestPassChain}. NO telemetry export was needed and NO sim behaviour was touched.',
    'CHAIN LENGTH is reported as the window GAIN in bestPassChain (a running per-match maximum), so it is a '
    + 'one-sided readout by construction — labelled, REPORTED only.',
    'DERIVED SHARES (spacing, forwardShare) are NaN-safe: a fork whose window has no samples/passes in EITHER '
    + 'branch contributes 0 to that paired delta (declared ex ante).',
    'THE NON-INFERIORITY MARGIN is self-scaling: margin_limb = fraction_limb × |Δ_limb(uniform − none)| measured on '
    + 'the SAME forks, with the fractions derived ONLY from the #154 certified prices (deep 1 − 0.2440/0.7395 = '
    + '0.6700; box 1 − 0.275/0.380 = 0.2763). If a limb\'s uniform benefit is not resolvedly negative the margin is '
    + 'UNDEFINED and the leg FAILS (declared ex ante — an honest attainability failure).',
    'THE PROXIMITY BLOCK stays DESCRIPTIVE for the USER\'s play-test (#152) — except dupRun, which contract §1 makes '
    + 'the H-157c DISCRIMINATOR and this stage\'s PRIMARY. Spacing remains descriptive.',
    'MODE is EXPLICIT via A4S2P1_MODE (no default); a bare invocation errors rather than silently running a corpus.',
  ],
  registeredNonClaims: [
    'S2-P1 PRICES VECTOR SHAPES, BUILDS NO GENE: the per-slot gene family is S2-P2; nothing here evolves, mutates or ships.',
    'NO OFFSIDE-RULE CHANGE (the 乙 axis hangs by #158): offsides are measured and FLAGGED only.',
    'NO SHIPPED-DEFAULT CHANGE ANYWHERE (contract §3 BIRTH NEUTRALITY): role-derived content lives ONLY inside these '
    + 'instrument vectors.',
    'THE PROXIMITY BLOCK\'S VERDICT AUTHORITY REMAINS THE USER\'S EYES (#152); dupRun here is a countable face, not '
    + 'the watchability verdict.',
    'NOTHING SHIPS (Road B): the fingerprint 57b0bdab…c673 is unchanged; every flag dormant.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...body, sha256 }, null, 2)}\n`);

if (MODE === 'confirm-smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'confirm-smoke' }>).confirmSmoke;
  console.error(
    `A4-S2P1b SMOKE (plumbing/wall ONLY) · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · ${MATCH_COUNT}m`
    + ` · forks ${s.populations.totalForks} (cap ${s.populations.forkCapBinds}) · eyeDec ${s.populations.eyeDecisionsTotal}`
    + ` · dupRun L none/${CONFIRM_REFERENCE_ARM}/${CONFIRM_TREAT_ARM} ${s.armLevels.dupRun.none}/`
    + `${s.armLevels.dupRun[CONFIRM_REFERENCE_ARM]}/${s.armLevels.dupRun[CONFIRM_TREAT_ARM]}`
    + ` · wall/match ${round(wallMs, 1)} ms · projected N=8000 x2 (X-DET) ${round(CONFIRM_N_FROZEN * wallMs * XDET_FACTOR / 3_600_000, 2)} h`
    + ` · xDet ${xDet} · xFork ${xForkIdent} · xMerge ${mergeIdent.pass} · priorEq ${priorEquivalence.pass}`
    + ` · eNonSt ${eNonStation.pass} · xFp ${xFpProd} · disj ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
} else if (MODE === 'confirm') {
  const c = experiment as Extract<typeof experiment, { mode: 'confirm' }>;
  console.error(
    `A4-S2P1b ${verdict.slice(0, 40)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · confirm ${MATCH_COUNT}m`
    + ` · (a) dupRun ${c.gate.legA.contrast.point} [${c.gate.legA.contrast.lower}, ${c.gate.legA.contrast.upper}] ${c.gate.legA.holds}`
    + ` (×${c.gate.legA.replicatedFractionOfSeen} of the S2-P1 seen ${S2P1_SEEN_VS_NONE.dupRun})`
    + ` · (b) box ${c.gate.legB.contrast.point} [${c.gate.legB.contrast.lower}, ${c.gate.legB.contrast.upper}] ${c.gate.legB.holds}`
    + ` · (c) deep ${c.gate.legC.contrast.point} [${c.gate.legC.contrast.lower}, ${c.gate.legC.contrast.upper}] ${c.gate.legC.holds}`
    + ` · offFlag ${c.gate.offsideFlag.flagged} · pass ${c.gate.pass} · xDet ${xDet} · SHA ${sha256.slice(0, 12)}`,
  );
} else if (MODE === 'smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'smoke' }>).sizing as {
    populations: { totalForks: number; forkCapBinds: boolean; endedDropsTotal: number; eyeDecisionsTotal: number };
    smokeContext: { pooledPrimaryDelta: number; uniformDupRunLevel: number };
    sigmaPerMatchPrimary: number; mdl: number; nArithmetic: { nStar?: number; nMax?: number };
  };
  console.error(
    `A4-S2P1 ${verdict.slice(0, 40)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · smoke ${MATCH_COUNT}m`
    + ` · forks ${s.populations.totalForks} (cap ${s.populations.forkCapBinds}) · eyeDec ${s.populations.eyeDecisionsTotal}`
    + ` · Δprimary ${s.smokeContext.pooledPrimaryDelta} · Luniform ${s.smokeContext.uniformDupRunLevel}`
    + ` · σ̂ ${s.sigmaPerMatchPrimary} · MDL ${s.mdl} · N* ${s.nArithmetic.nStar} / N_MAX ${s.nArithmetic.nMax}`
    + ` · xDet ${xDet} · xFork ${xForkIdent} · xMerge ${mergeIdent.pass} · priorEq ${priorEquivalence.pass}`
    + ` · eNonSt ${eNonStation.pass} · xFp ${xFpProd} · disj ${seedDisjoint} · SHA ${sha256.slice(0, 12)}`,
  );
} else {
  const c = experiment as Extract<typeof experiment, { mode: 'census' }>;
  console.error(
    `A4-S2P1 ${verdict.slice(0, 40)} · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · census ${MATCH_COUNT}m`
    + ` · dupRun(spread−uniform) ${c.gate.primary.contrast.point} [${c.gate.primary.contrast.lower}, ${c.gate.primary.contrast.upper}]`
    + ` · deepNI ${c.gate.nonInferiority.deep.holds} · boxNI ${c.gate.nonInferiority.box.holds}`
    + ` · offFlag ${c.gate.offsideFlag.flagged} · pass ${c.gate.pass} · xDet ${xDet} · SHA ${sha256.slice(0, 12)}`,
  );
}
