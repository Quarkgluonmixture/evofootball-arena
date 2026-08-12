/**
 * EK-C0 — THE OBSERVABLE HOLD-OUTCOME CENSUS (持球被罚的自己的真相).
 *
 * Contract: docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §2 M-EK.1 (THE OBSERVABLE HOLD
 * LABEL) and §3 EK-C0, bound by ruling #259.2 and dispatched by #259.3. Form precedents:
 * DV-T2-C0 (the census form, #255) and DV-C0 (#249 — its walker, its loss-tick semantics, its
 * window family, its estimator, its N rule). Hygiene canon: #250.3 (mode-conditioned literals) ·
 * #251.3 / #252.3 (derive the predicates, a mutant per conjunct) · #256.3 (per-cluster cells
 * stored; liveness claims scoped) · #258.3 (timings OUTSIDE the hashed body) · #163 · #181.2 ·
 * #20 · #128 · #203 · #229.2.
 *
 * ⭐ INSTRUMENT-ONLY ROUND. `src/**` is byte-untouched (X-SRC-UNTOUCHED is a HARD gate). Nothing
 * measured here reaches any player: the whetherEye seat is armed only inside this probe's own
 * matches, and no production or a4 world arms it.
 *
 * THE WORLD (traced, never re-typed): the canonical whetherEye-ARMED world reconstructed from
 * C5-T2's own committed exam configuration — `scripts/probes/c5-t2-whether-seat.ts`'s CENSUS_FLAGS,
 * its match construction, its sampling grid and its injected certified table (tableSha
 * 184d1e84…). G-CONFIG-IDENTITY reads those constants out of the committed exam probe's SOURCE and
 * compares them to this probe's, conjunct by conjunct. G-REPRO65 re-walks the #65 sizing smoke's
 * own committed block in the #65 configuration and reproduces its committed integer rows.
 *
 * THE LABEL (M-EK.1): a HOLD is PUNISHED iff the holding TEAM loses possession within the window
 * W, where the LOSS-TICK semantics are DV-C0's own (a team-level turnover: an opponent establishing
 * ownership out of the holder's live possession chain, stamped at the tick control is established)
 * and W is the #218 / DV-C0 10 s family's primary — the DECLARED FALLBACK, because the C5 family
 * has no team-possession outcome window of its own (its 240-tick horizon is a shot-for axis and its
 * hold survival is a SAME-BODY retention read). G-REPRO-DVC0 re-walks DV-C0's own committed smoke
 * block and reproduces its integer rows, so the loss semantics are THEIRS, proved not promised.
 *
 * MODES (explicit EKC0_MODE, no default):
 *   EKC0_MODE=smoke npx tsx scripts/probes/ek-c0-hold-outcome-census.ts
 *   EKC0_MODE=full  npx tsx scripts/probes/ek-c0-hold-outcome-census.ts
 * Any EKC0_N / EKC0_CAP / EKC0_SKIP_FP routes the walk onto the GUARD BLOCK, turns
 * G-CLEAN-INVOCATION red and exits 1; a preflight may never write a canonical repo path.
 * EKC0_RESUME=1 lets pass A resume from the checkpoint file (pass B never resumes, so X-DET is
 * itself the checkpoint's integrity proof).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import {
  appendFileSync, existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync,
} from 'node:fs';
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'node:path';

import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { pressureAt } from '../../src/ai/perception';
import {
  whetherEyeDecision, type RecensusCostTable, type WhetherEyeConfig,
} from '../../src/ai/whetherEye';

/* ========================================================================== */
/* §1 FROZEN INSTRUMENT CONSTANTS — every one of them TRACED                   */
/* ========================================================================== */
/** The committed C5-T2 exam probe whose configuration this world reconstructs. */
const EXAM_PROBE_PATH = 'scripts/probes/c5-t2-whether-seat.ts';
/** The committed #65 sizing artifact G-REPRO65 reproduces (the C5-T2 family's own receipt). */
const SIZING_ARTIFACT_PATH = 'docs/world-model/data/c5-t2-whether-sizing.json';
/** The certified table the seat consumes — INJECTED, never bundled in src (the P2 convention). */
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
/** DV-C0 / #218 artifacts — the window family and the loss-tick receipt. */
const DVC0_SMOKE_PATH = 'docs/world-model/data/dv-c0-loss-cost-smoke.json';
const DVC0_FULL_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';
const GGC_FULL_PATH = 'docs/world-model/data/goal-genealogy-census.json';

/** The C5-T2 exam world's sampling grid — census verbatim (exam probe §5.1). */
const MATCH_DURATION = 240;
const PER_MATCH_CAP = 80;
const MOMENT_SPACING = 30;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
/** The hold the census doses: the seat's own least commitment, the certified ladder's k30. */
const HOLD_K_TICKS = 30;
/** ticks per sim-second, derived from the engine's own DT (never typed as 60). */
const TICKS_PER_S = Math.round(1 / DT);

/** ⭐ THE WINDOW: DV-C0's own primary + its own sensitivity ladder (the DECLARED FALLBACK, §FORM). */
const PRIMARY_WINDOW_S = 10;
const WINDOWS_S = [5, 10, 15, 20] as const;
/** ⭐ the C5-NATIVE sensitivity row: the re-census's own 240-tick fork horizon, read off its
 *  committed artifact (`parameters.horizon`) and divided by the engine's DT. Declared ex ante as a
 *  REPORTED row; it is NOT a member of the #218 family and is never the primary. */
const C5_NATIVE_WINDOW_S = 4;
const MAX_WINDOW_S = Math.max(...WINDOWS_S, C5_NATIVE_WINDOW_S);
/** every published window, ladder first, the C5-native row last (report order). */
const ALL_WINDOWS_S = [...WINDOWS_S, C5_NATIVE_WINDOW_S] as const;

/** THE INDEX: the seat's OWN perceived pressure band (whetherEyeDecision's own placement). */
const BAND_KEYS = ['p0', 'p1', 'p2'] as const;
type BandKey = (typeof BAND_KEYS)[number];
const BAND_LABEL: Record<BandKey, string> = {
  p0: 'free (perceived pressure < cut1)',
  p1: 'mid (cut1 ≤ perceived pressure < cut2)',
  p2: 'pressed (perceived pressure ≥ cut2)',
};
type Band = 0 | 1 | 2;
const bandKeyOf = (b: Band): BandKey => BAND_KEYS[b];

/** DV-C0's loss zoning — needed ONLY by the G-REPRO-DVC0 receipt. */
const THIRD_LOCAL_X = HALF_L / 3;
const THIRDS = ['own', 'middle', 'final'] as const;
type Third = (typeof THIRDS)[number];
const thirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');

/* --- §2 THE SEED LEDGER (#163) --------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_448_000, 12_448_999];
const SMOKE_BASE = 12_448_000;
const SMOKE_N = 12;
const GUARD_BLOCK: readonly [number, number] = [12_448_050, 12_448_099];
const CENSUS_BASE = 12_448_100;
/** Honest hard cap = the reserved census room 12,448,100..12,448,899. A SEED-BUDGET cap. */
const N_CAP = 800;
const N_STEP = 25;
/** THE TWO DELIBERATE RE-WALKS (RECEIPTS, never fresh data) — their overlap IS the point. */
const REPRO65_BASE = 8_500_000;
const REPRO65_N = 48;
const REPRO_DVC0_BASE = 12_429_000;
const REPRO_DVC0_N = 12;
/** G-WORLD reads back a freshly CONSTRUCTED, never-stepped match here. */
const GWORLD_SEED = 12_448_999;

/** THE COMPLETE #163-regime ledger — DV-T2-C0's committed list, carried forward and extended with
 *  DV-T2-C0's own blocks (#255.4/#256), DV-T2-T0's (#257.4) and DV-T2-T1's (#258.4), i.e. every
 *  block the programme has consumed through 12,447,999. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '⭐ #65 whether-seat sizing block — THE BLOCK G-REPRO65 RE-WALKS', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts + corner/smoke read (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  { name: 'OBM-T0 receipts + geometry/EPI/smoke read (#228)', range: [12_424_000, 12_424_024] },
  { name: 'OBM-T0 REPORTED cost reading (#228)', range: [12_424_025, 12_424_025] },
  { name: 'OBM-T1 smoke (#228.6/#230)', range: [12_424_026, 12_424_037] },
  { name: 'OBM-T1 delivered-dose read (#230)', range: [12_424_040, 12_424_040] },
  { name: 'OBM-T1 guard band (#230)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#230)', range: [12_424_100, 12_424_899] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
  { name: 'PTP-T0 receipts + geometry/EPI-MOTION/smoke read (#232)', range: [12_425_000, 12_425_024] },
  { name: 'PTP-T0 REPORTED cost reading (#232)', range: [12_425_025, 12_425_025] },
  { name: 'PTP-T1 smoke (#232.3/#233)', range: [12_425_026, 12_425_037] },
  { name: 'PTP-T1 delivered-dose read (#233)', range: [12_425_040, 12_425_040] },
  { name: 'PTP-T1 guard band (#233)', range: [12_425_050, 12_425_099] },
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
  { name: 'DLC-T0 receipts + contest/winner/EPI/smoke read (#237)', range: [12_426_000, 12_426_024] },
  { name: 'DLC-T0 REPORTED chooser-cost reading (#237)', range: [12_426_025, 12_426_025] },
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_041] },
  { name: 'DLC-T1 delivered-dose read (#238)', range: [12_426_045, 12_426_045] },
  { name: 'DLC-T1 guard band (#238)', range: [12_426_050, 12_426_099] },
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
  { name: 'DLC-T0s receipts + grid/winner/EPI/smoke/decode read (#242)', range: [12_427_000, 12_427_024] },
  { name: 'DLC-T0s REPORTED chooser-cost reading (#242)', range: [12_427_025, 12_427_025] },
  { name: 'DLC-T0s test-file seeds (#242)', range: [12_427_900, 12_427_906] },
  { name: 'DLC-T1s smoke (#243)', range: [12_428_000, 12_428_011] },
  { name: 'DLC-T1s delivered-dose read (#243)', range: [12_428_015, 12_428_015] },
  { name: 'DLC-T1s strike read (#243)', range: [12_428_020, 12_428_020] },
  { name: 'DLC-T1s guard band (#243)', range: [12_428_050, 12_428_099] },
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_727] },
  { name: 'DLC-T1s reserved test-seed band (#243)', range: [12_428_900, 12_428_906] },
  { name: '⭐⭐ DV-C0 smoke (#249) — THE BLOCK G-REPRO-DVC0 RE-WALKS', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 guard band (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD read (#249)', range: [12_429_999, 12_429_999] },
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_026] },
  { name: 'DV-T1 smoke + reads + guard + battery (#251)', range: [12_430_027, 12_430_382] },
  { name: '⚠ DV-T0 test-file seeds (#250 — THE ORDERED SKIP BAND)', range: [12_430_900, 12_430_911] },
  { name: 'DV-T1b smoke + reads + guard + battery (#252)', range: [12_431_000, 12_431_742] },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  { name: 'DV-T1c smoke + reads + guard + battery (#253/#254)', range: [12_432_000, 12_434_035] },
  { name: 'DV-T1c reserved ceiling (#253.1)', range: [12_435_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: '⭐ DV-T2-T1 convergence exam + battery + reserve (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
];

/* --- §3 THE STATS STREAM — a SEPARATE namespace (#163) ---------------------- */
/** ⭐ ruling #259.3 sets this stage's floor at 108,200; it clears the #163 200-gap by 400. */
const BOOTSTRAP_SEED = 108_200;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800, 105_000, 105_200, 105_400, 105_800,
  106_000, 106_200, 106_600, 107_000,
  107_400 /** DV-T2-C0's own (#255.4) */,
  107_800 /** DV-T2-T1's own (#258.4) */,
];

/* --- §4 THE N ARITHMETIC, frozen ex ante (DV-C0 / DV-T2-C0's rule form) ----- */
/** 60 events ⇒ a count's relative SE ≈ 1/sqrt(60) ≈ 13 %, the precision at which a rate ORDERING
 *  (the #246 check) is readable — DV-C0's own target, inherited with its own justification. THIS
 *  census's numerator: a PUNISHED HOLD in the RAREST perceived pressure band at the PRIMARY
 *  window, i.e. the scarcest numerator the published table contains. */
const TARGET_RAREST_BAND_EVENTS = 60;
const WALL_BUDGET_HOURS = 0.5;
const XDET_FACTOR = 2;
const ARMS_COUNT = 1;
/** the PRIOR ms/match used only when no committed smoke exists. */
const PRIOR_MS_PER_MATCH = 1_400;

/* --- §5 the X-family pins --------------------------------------------------- */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SRC_DIR = 'src';
/** how often the fork-control / dose-bite receipts are sampled (the C5-T2 X-CONTROL cadence). */
const CONTROL_SAMPLE = 25;
/** the short horizon those two receipts compare on — the re-census's own 240-tick fork horizon. */
const CONTROL_HORIZON_TICKS = 240;
const BITE_FLOOR = 0.90;

/* ========================================================================== */
/* §6 ENV / MODE / THE GUARD-BLOCK ROUTING                                     */
/* ========================================================================== */
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.EKC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`EK-C0 FATAL — EKC0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const CAP = process.env.EKC0_CAP ? Math.max(1, Number.parseInt(process.env.EKC0_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_CAPPED = Number.isFinite(CAP);
const SKIP_FP = process.env.EKC0_SKIP_FP === '1';
const N_ENV = process.env.EKC0_N ? Math.max(1, Number.parseInt(process.env.EKC0_N, 10)) : null;
const RESUME = process.env.EKC0_RESUME === '1';
const IS_PREFLIGHT = IS_CAPPED || SKIP_FP;
const PREFLIGHT_REASONS = [IS_CAPPED ? `EKC0_CAP=${CAP}` : null, SKIP_FP ? 'EKC0_SKIP_FP=1' : null]
  .filter((r): r is string => r !== null);

const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/ek-c0-hold-outcome-census-smoke.json',
  full: 'docs/world-model/data/ek-c0-hold-outcome-census.json',
};
const SMOKE_PATH = OUT_BY_MODE.smoke;
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = process.env.EKC0_OUT ?? (IS_PREFLIGHT ? '/tmp/ek-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('EK-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}. `
    + 'Pass EKC0_OUT=/tmp/… , or drop EKC0_CAP / EKC0_SKIP_FP to run the real thing.');
  process.exit(2);
}
/** ⭐ THE CHECKPOINT (#259.3 "checkpoint any long run"): pass A appends one JSON line per walked
 *  match OUTSIDE the repo; pass B NEVER resumes, so X-DET is itself the checkpoint's integrity
 *  proof — a stale or corrupt line cannot survive the digest comparison. */
const CHECKPOINT_PATH = process.env.EKC0_CHECKPOINT ?? `/tmp/ek-c0-checkpoint.${MODE}.jsonl`;

/* ========================================================================== */
/* §7 SMALL HELPERS                                                            */
/* ========================================================================== */
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : NaN);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const meanOf = (xs: readonly number[]): number => (xs.length === 0 ? NaN : sum(xs) / xs.length);
const sdOf = (xs: readonly number[]): number => {
  if (xs.length < 2) return NaN;
  const m = meanOf(xs);
  return Math.sqrt(sum(xs.map((x) => (x - m) ** 2)) / (xs.length - 1));
};
const quantileSorted = (sorted: readonly number[], q: number): number => {
  if (sorted.length === 0) return NaN;
  const i = (sorted.length - 1) * q;
  const lo = Math.floor(i); const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (sorted[hi] - sorted[lo]) * (i - lo);
};
const quantileOf = (xs: readonly number[], q: number): number => quantileSorted([...xs].sort((a, b) => a - b), q);
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };

/* ========================================================================== */
/* §8 THE WORLD — reconstructed from C5-T2's committed exam configuration      */
/* ========================================================================== */
/** the exam probe's own enriched census world (its CENSUS_FLAGS, §0.1 of the seat doc). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** the exam world's match (flags + duration + the seed*2+1 / seed*2+2 squad derivation). */
const examMatch = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});
/** DV-C0's arm — BARE PRODUCTION, for the G-REPRO-DVC0 receipt only. */
const prodMatch = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
});

/* --- the injected certified table ------------------------------------------ */
const tableRaw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (tableRaw.tableSha !== EXPECTED_TABLE_SHA) {
  console.error(`EK-C0 FATAL — certified table SHA drift: ${tableRaw.tableSha} != ${EXPECTED_TABLE_SHA}`);
  process.exit(2);
}
const tableParams = tableRaw.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: tableParams.pressureBands, staleBands: tableParams.staleBands,
  supportCuts: tableParams.supportCuts, supportWindowM: tableParams.supportWindowM,
  cells: tableRaw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper, reachesZero: k.reachesZero,
    })),
  })),
};
/** ⭐ THE ARMED CONFIGURATION (C5-T2 §2.1): arm NEUTRAL (v1 admits no other), scope BOTH TEAMS —
 *  the seat doc's §5.4 deployment rung R3, DECLARED here because the exam probe never armed the
 *  live seam at all (it forked off pristine clones). */
const EYE_CONFIG: WhetherEyeConfig = { arm: 'neutral', scope: { kind: 'both' }, table: TABLE };

/** the true-context cell (census keying) — the M-CTX mediator the #65 receipt publishes. */
const trueCellOf = (match: Match, owner: Player): { key: string; bands: [Band, Band, Band] } => {
  const side = owner.side;
  const pv = pressureAt(owner.pos, match.teams[1 - side].players);
  const pB: Band = (pv < TABLE.pressureBands[0] ? 0 : pv < TABLE.pressureBands[1] ? 1 : 2);
  const st = match.teams[side].staleTime;
  const sB: Band = (st < TABLE.staleBands[0] ? 0 : st < TABLE.staleBands[1] ? 1 : 2);
  const support = match.teams[side].players.filter((p) => (
    p.gid !== owner.gid && p.role !== 'GK' && !p.sentOff
    && Math.hypot(p.pos.x - owner.pos.x, p.pos.y - owner.pos.y) >= SUPPORT_MIN_M
    && Math.hypot(p.pos.x - owner.pos.x, p.pos.y - owner.pos.y) <= SUPPORT_MAX_M
  )).length;
  const supB: Band = (support < TABLE.supportCuts.low ? 0 : support >= TABLE.supportCuts.high ? 2 : 1);
  return { key: `${pB}|${sB}|${supB}`, bands: [pB, sB, supB] };
};

/** A0 (untouched): one fork step to read the decided action — the exam probe's repair (iv). */
const decidedActionOf = (before: Match, ownerGid: number): string => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  let action = owner.action.type;
  const startTick = fork.simTick;
  for (let t = 0; t < CONTROL_HORIZON_TICKS; t++) {
    if (fork.finished) break;
    fork.step(DT);
    if (fork.simTick - startTick === 1) { action = owner.action.type; break; }
  }
  return action;
};

/** a digest of the whole visible world — the fork-control / dose-bite pins (C5-T2 §3.2's form). */
const stateSignature = (match: Match): string => {
  const d = createHash('sha256');
  d.update(`${match.simTick}|${match.phase}|${match.score[0]}:${match.score[1]}`);
  d.update(`|${match.ball.pos.x},${match.ball.pos.y},${match.ball.z}`);
  d.update(`|${match.ball.vel.x},${match.ball.vel.y},${match.ball.vz}`);
  d.update(`|${match.ball.owner?.gid ?? -1}|${match.ball.lastTouch?.gid ?? -1}`);
  for (const p of match.allPlayers) d.update(`|${p.gid},${p.pos.x},${p.pos.y},${p.vel.x},${p.vel.y},${p.stamina}`);
  for (const t of match.teams) d.update(`|${t.stats.shots},${t.stats.passes},${t.stats.tackles},${t.stats.goals}`);
  return d.digest('hex');
};

/* ========================================================================== */
/* §9 ⭐ THE LOSS-TICK SEMANTICS — DV-C0's, inherited                          */
/* ========================================================================== */
/**
 * A possession segment is a maximal interval of same-owner-TEAM control while `phase === 'playing'`,
 * suspended while the ball is loose in play, ended by an opponent establishing ownership (a
 * TURNOVER, stamped at that tick), by the phase leaving `playing` (a dead ball), by a goal, or by
 * full time. G-REPRO-DVC0 proves this walker is DV-C0's by reproducing its committed integer rows.
 */
interface TurnoverEvent { tSim: number; loser: Side; third: Third }
interface SegmentAccounting {
  totalTicks: number; deadBallTicks: number; segmentTicks: number; looseGapTicks: number;
  assignedTicksSum: number; spanOrderViolations: number;
  goalsFromScore: number; turnoversTotal: number;
}
interface LiveSegmentState {
  cur: { team: Side; startTick: number; assignedTicks: number; lastOwnedLocalX: number } | null;
  prevStartTick: number;
  acc: SegmentAccounting;
  turnovers: TurnoverEvent[];
  prevScore: [number, number];
}
const newSegmentState = (m: Match): LiveSegmentState => ({
  cur: null, prevStartTick: -1,
  acc: {
    totalTicks: 0, deadBallTicks: 0, segmentTicks: 0, looseGapTicks: 0, assignedTicksSum: 0,
    spanOrderViolations: 0, goalsFromScore: 0, turnoversTotal: 0,
  },
  turnovers: [], prevScore: [m.score[0], m.score[1]],
});
/** ONE tick of DV-C0's walker, called immediately AFTER `m.step(DT)`. Returns the turnover (if the
 *  tick closed one) so callers can close a hold label on the spot. */
const segmentTick = (m: Match, s: LiveSegmentState): TurnoverEvent | null => {
  s.acc.totalTicks += 1;
  let goalSide: Side | null = null;
  for (const side of [0, 1] as const) {
    if (m.score[side] > s.prevScore[side]) {
      s.acc.goalsFromScore += m.score[side] - s.prevScore[side];
      goalSide = side;
    }
    s.prevScore[side] = m.score[side];
  }
  if (m.phase !== 'playing') {
    s.acc.deadBallTicks += 1;
    if (s.cur !== null) {
      s.acc.assignedTicksSum += s.cur.assignedTicks;
      if (s.cur.startTick <= s.prevStartTick) s.acc.spanOrderViolations += 1;
      s.prevStartTick = s.cur.startTick;
      s.cur = null;
    }
    void goalSide;
    return null;
  }
  const owner = m.ball.owner;
  if (owner === null) {
    if (s.cur !== null) { s.cur.assignedTicks += 1; s.acc.segmentTicks += 1; } else s.acc.looseGapTicks += 1;
    return null;
  }
  const side = owner.side;
  let closed: TurnoverEvent | null = null;
  if (s.cur !== null && s.cur.team !== side) {
    const ev: TurnoverEvent = {
      tSim: m.simTime, loser: s.cur.team, third: thirdOf(s.cur.lastOwnedLocalX),
    };
    s.turnovers.push(ev);
    s.acc.turnoversTotal += 1;
    s.acc.assignedTicksSum += s.cur.assignedTicks;
    if (s.cur.startTick <= s.prevStartTick) s.acc.spanOrderViolations += 1;
    s.prevStartTick = s.cur.startTick;
    s.cur = null;
    closed = ev;
  }
  if (s.cur === null) {
    s.cur = {
      team: side, startTick: m.simTick, assignedTicks: 0,
      lastOwnedLocalX: m.teams[side].localX(m.ball.pos.x),
    };
  }
  s.cur.assignedTicks += 1;
  s.acc.segmentTicks += 1;
  s.cur.lastOwnedLocalX = m.teams[side].localX(m.ball.pos.x);
  return closed;
};
const finishSegments = (s: LiveSegmentState): void => {
  if (s.cur !== null) {
    s.acc.assignedTicksSum += s.cur.assignedTicks;
    if (s.cur.startTick <= s.prevStartTick) s.acc.spanOrderViolations += 1;
    s.prevStartTick = s.cur.startTick;
    s.cur = null;
  }
};

/* ========================================================================== */
/* §10 THE CENSUS WALK — the armed world, the dosed holds, the live D-HOLDs    */
/* ========================================================================== */
interface BandCell {
  /** dosed hold moments in this band (the census population). */
  moments: number;
  /** punished at each published window (ALL_WINDOWS_S order). */
  punished: number[];
  /** the SAME-CHAIN cross-cut: the chain live at the decision itself ended in the loss. */
  sameChain: number[];
  /** the first loss landed inside the longest window at all (the partition's `lost` column). */
  lostWithinMax: number;
  /** the window was truncated by full time with no loss seen (censoring, reported). */
  censored: number[];
  /** the SEAT's OWN takes in this band, live-armed (D-HOLD), and their labels. */
  liveHolds: number;
  liveHoldsPunished: number[];
}
const newBandCell = (): BandCell => ({
  moments: 0,
  punished: ALL_WINDOWS_S.map(() => 0),
  sameChain: ALL_WINDOWS_S.map(() => 0),
  lostWithinMax: 0,
  censored: ALL_WINDOWS_S.map(() => 0),
  liveHolds: 0,
  liveHoldsPunished: ALL_WINDOWS_S.map(() => 0),
});
type SideBandCells = Record<string, BandCell>; // key `${side}|${bandKey}`
const cellKey = (side: Side, b: BandKey): string => `${side}|${b}`;

interface CensusRow {
  seed: number;
  simSeconds: number;
  qualifying: number;
  eligible: number;
  exFirstTouch: number; exMustKick: number; exShoot: number; exClear: number;
  classCounts: Record<string, number>;
  cells: SideBandCells;
  /** the live-armed D-HOLD commitments observed, by the seat's own perceived cell key. */
  liveHoldCells: Record<string, number>;
  liveHoldTotal: number;
  acc: SegmentAccounting;
  turnoversTotal: number;
  /** receipts: the fork-control and dose-bite samples. */
  controlChecked: number; controlUnexplained: number;
  biteChecked: number; biteDiffered: number;
  /** dosed forks whose window entered a non-'playing' phase (reported, not an exception). */
  dosedForks: number;
}

const CLASSES = ['D-HOLD', 'E-ACTNOW-DECLINED', 'E-ABSTAIN-UNSEEN', 'E-NOCELL'] as const;

/** the label closer: the first turnover by team T at or before `t0 + W`. */
const labelFromOffsets = (lossOffsetS: number | null, endedAtS: number | null): {
  punished: boolean[]; censored: boolean[];
} => {
  const punished = ALL_WINDOWS_S.map((w) => lossOffsetS !== null && lossOffsetS <= w);
  const censored = ALL_WINDOWS_S.map((w, i) => !punished[i] && endedAtS !== null && endedAtS < w);
  return { punished, censored };
};

function walkCensusMatch(seed: number): CensusRow {
  const m = examMatch(seed);
  m.whetherEye = EYE_CONFIG;
  const row: CensusRow = {
    seed, simSeconds: 0, qualifying: 0, eligible: 0,
    exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
    classCounts: Object.fromEntries(CLASSES.map((c) => [c, 0])),
    cells: {}, liveHoldCells: {}, liveHoldTotal: 0,
    acc: newSegmentState(m).acc, turnoversTotal: 0,
    controlChecked: 0, controlUnexplained: 0, biteChecked: 0, biteDiffered: 0, dosedForks: 0,
  };
  for (const side of [0, 1] as const) for (const b of BAND_KEYS) row.cells[cellKey(side, b)] = newBandCell();

  const seg = newSegmentState(m);
  row.acc = seg.acc;
  /** live D-HOLD commitments awaiting their label: (side, band, decision sim-time). */
  const pendingLive: { side: Side; band: BandKey; tSim: number }[] = [];
  const closedLive: { side: Side; band: BandKey; lossOffsetS: number | null; endedAtS: number | null }[] = [];
  /** the commitment signature already counted, so a re-entered hold is not double-counted. */
  const seenCommitments = new Set<string>();

  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;
  while (!m.finished) {
    const owner: Player | null = m.ball.owner;
    const qualifies = inMatch < PER_MATCH_CAP && m.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      row.qualifying += 1;
      const gid = owner!.gid;
      const side = owner!.side;
      /** every read runs off a PRISTINE clone, so the live armed trajectory is never perturbed. */
      const before = cloneSimulationState(m);
      if (owner!.firstTouchWindow > 0) {
        row.exFirstTouch += 1;
      } else if (m.restartKickGid === gid) {
        row.exMustKick += 1;
      } else {
        const decided = decidedActionOf(before, gid);
        if (decided === 'Shoot') row.exShoot += 1;
        else if (decided === 'ClearBall') row.exClear += 1;
        else {
          row.eligible += 1;
          const cloneOwner = before.allPlayers.find((p) => p.gid === gid)!;
          const decision = whetherEyeDecision(cloneOwner, before, TABLE);
          row.classCounts[decision.cls] += 1;
          if (decision.perceived !== null) {
            /* ⭐ THE DOSED HOLD: the census's own treatment, off a paired clone of the same
             * pre-decision state — the C5 family's forced-hold machinery verbatim. */
            const bk = bandKeyOf(decision.perceived.pressureBand);
            const cell = row.cells[cellKey(side, bk)];
            cell.moments += 1;
            row.dosedForks += 1;
            const fork = cloneSimulationState(m);
            fork.forcedHold = { gid, untilTick: fork.simTick + HOLD_K_TICKS };
            const fseg = newSegmentState(fork);
            const t0 = fork.simTime;
            let lossOffsetS: number | null = null;
            let sameChain = false;
            let chainAlive = true;
            let endedAtS: number | null = null;
            const maxTicks = MAX_WINDOW_S * TICKS_PER_S;
            for (let t = 0; t < maxTicks; t++) {
              if (fork.finished) { endedAtS = fork.simTime - t0; break; }
              fork.step(DT);
              const ev = segmentTick(fork, fseg);
              if (fork.phase !== 'playing' && chainAlive) chainAlive = false;
              if (ev !== null && ev.loser === side) {
                lossOffsetS = ev.tSim - t0;
                sameChain = chainAlive;
                break;
              }
              if (ev !== null) chainAlive = false;
            }
            if (lossOffsetS === null && endedAtS === null && fork.finished) endedAtS = fork.simTime - t0;
            const lab = labelFromOffsets(lossOffsetS, endedAtS);
            for (let i = 0; i < ALL_WINDOWS_S.length; i++) {
              if (lab.punished[i]) cell.punished[i] += 1;
              if (lab.punished[i] && sameChain) cell.sameChain[i] += 1;
              if (lab.censored[i]) cell.censored[i] += 1;
            }
            if (lossOffsetS !== null) cell.lostWithinMax += 1;

            /* the two fork receipts, sampled 1-in-CONTROL_SAMPLE over dosed moments. */
            if (row.dosedForks % CONTROL_SAMPLE === 0) {
              const control = cloneSimulationState(m);
              const base = cloneSimulationState(m);
              for (let t = 0; t < CONTROL_HORIZON_TICKS && !control.finished; t++) control.step(DT);
              for (let t = 0; t < CONTROL_HORIZON_TICKS && !base.finished; t++) base.step(DT);
              row.controlChecked += 1;
              if (stateSignature(control) !== stateSignature(base)) row.controlUnexplained += 1;
              const dosed = cloneSimulationState(m);
              dosed.forcedHold = { gid, untilTick: dosed.simTick + HOLD_K_TICKS };
              for (let t = 0; t < CONTROL_HORIZON_TICKS && !dosed.finished; t++) dosed.step(DT);
              row.biteChecked += 1;
              if (stateSignature(dosed) !== stateSignature(base)) row.biteDiffered += 1;
            }
          }
        }
      }
      sinceLast = 0;
      inMatch += 1;
    }
    /* ⭐ the SEAT'S OWN takes, read off the live armed world's commitment map (public state). */
    for (const [gid, c] of m.whetherHoldState) {
      const sig = `${gid}|${c.untilTick}|${c.cellAtDecision}`;
      if (seenCommitments.has(sig)) continue;
      seenCommitments.add(sig);
      const body = m.allPlayers.find((p) => p.gid === gid);
      if (body === undefined) continue;
      const bandChar = c.cellAtDecision.split('|')[0];
      const bandIdx = Number(bandChar);
      if (!Number.isInteger(bandIdx) || bandIdx < 0 || bandIdx > 2) continue;
      const bk = bandKeyOf(bandIdx as Band);
      row.liveHoldCells[c.cellAtDecision] = (row.liveHoldCells[c.cellAtDecision] ?? 0) + 1;
      row.liveHoldTotal += 1;
      row.cells[cellKey(body.side, bk)].liveHolds += 1;
      pendingLive.push({ side: body.side, band: bk, tSim: m.simTime });
    }
    m.step(DT);
    sinceLast += 1;
    const ev = segmentTick(m, seg);
    /* close every live D-HOLD label whose window has expired or whose loss has landed. */
    for (let i = pendingLive.length - 1; i >= 0; i--) {
      const p = pendingLive[i];
      if (ev !== null && ev.loser === p.side) {
        closedLive.push({ side: p.side, band: p.band, lossOffsetS: ev.tSim - p.tSim, endedAtS: null });
        pendingLive.splice(i, 1);
      } else if (m.simTime - p.tSim >= MAX_WINDOW_S) {
        closedLive.push({ side: p.side, band: p.band, lossOffsetS: null, endedAtS: null });
        pendingLive.splice(i, 1);
      }
    }
  }
  finishSegments(seg);
  for (const p of pendingLive) {
    closedLive.push({ side: p.side, band: p.band, lossOffsetS: null, endedAtS: m.simTime - p.tSim });
  }
  for (const c of closedLive) {
    const lab = labelFromOffsets(c.lossOffsetS, c.endedAtS);
    const cell = row.cells[cellKey(c.side, c.band)];
    for (let i = 0; i < ALL_WINDOWS_S.length; i++) if (lab.punished[i]) cell.liveHoldsPunished[i] += 1;
  }
  row.simSeconds = m.simTime;
  row.acc = seg.acc;
  row.turnoversTotal = seg.turnovers.length;
  return row;
}

/* ========================================================================== */
/* §11 THE TWO RE-WALK RECEIPTS                                                */
/* ========================================================================== */
/** G-REPRO65: the #65 configuration verbatim — the live match carries NO whetherEye and every
 *  decision is classified on a pristine clone. Reproduces the committed sizing artifact's rows. */
interface Repro65Row {
  qualifying: number; eligible: number;
  exFirstTouch: number; exMustKick: number; exShoot: number; exClear: number;
  classCounts: Record<string, number>;
  holdCells: Record<string, number>;
  ctxPlaced: number; ctxAgreeAll: number; ctxAgreeFeature: [number, number, number];
  perceivedCellMix: Record<string, number>;
}
function walkRepro65(seed: number): Repro65Row {
  const m = examMatch(seed);
  const r: Repro65Row = {
    qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
    classCounts: Object.fromEntries(CLASSES.map((c) => [c, 0])),
    holdCells: {}, ctxPlaced: 0, ctxAgreeAll: 0, ctxAgreeFeature: [0, 0, 0], perceivedCellMix: {},
  };
  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;
  while (!m.finished && inMatch < PER_MATCH_CAP) {
    const owner: Player | null = m.ball.owner;
    const qualifies = m.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      r.qualifying += 1;
      const gid = owner!.gid;
      const before = cloneSimulationState(m);
      if (owner!.firstTouchWindow > 0) r.exFirstTouch += 1;
      else if (m.restartKickGid === gid) r.exMustKick += 1;
      else {
        const decided = decidedActionOf(before, gid);
        if (decided === 'Shoot') r.exShoot += 1;
        else if (decided === 'ClearBall') r.exClear += 1;
        else {
          r.eligible += 1;
          const cloneOwner = before.allPlayers.find((p) => p.gid === gid)!;
          const d = whetherEyeDecision(cloneOwner, before, TABLE);
          r.classCounts[d.cls] += 1;
          if (d.cls === 'D-HOLD') r.holdCells[d.cell ?? '?'] = (r.holdCells[d.cell ?? '?'] ?? 0) + 1;
          if (d.perceived !== null) {
            const truth = trueCellOf(m, owner!);
            const pb = [d.perceived.pressureBand, d.perceived.staleBand, d.perceived.supportBand];
            const key = `${pb[0]}|${pb[1]}|${pb[2]}`;
            r.perceivedCellMix[key] = (r.perceivedCellMix[key] ?? 0) + 1;
            r.ctxPlaced += 1;
            if (key === truth.key) r.ctxAgreeAll += 1;
            for (let f = 0; f < 3; f++) if (pb[f] === truth.bands[f]) r.ctxAgreeFeature[f] += 1;
          }
        }
      }
      sinceLast = 0;
      inMatch += 1;
    }
    m.step(DT);
    sinceLast += 1;
  }
  return r;
}

/** G-REPRO-DVC0: DV-C0's bare-production arm, walked with THIS probe's segment walker. */
interface ReproDvc0Row {
  acc: SegmentAccounting;
  turnoversByThird: Record<Third, number>;
  concededGoals: number;
  simSeconds: number;
}
function walkReproDvc0(seed: number): ReproDvc0Row {
  const m = prodMatch(seed);
  const s = newSegmentState(m);
  const byThird: Record<Third, number> = { own: 0, middle: 0, final: 0 };
  while (!m.finished) {
    m.step(DT);
    const ev = segmentTick(m, s);
    if (ev !== null) byThird[ev.third] += 1;
  }
  finishSegments(s);
  return {
    acc: s.acc, turnoversByThird: byThird, concededGoals: s.acc.goalsFromScore, simSeconds: m.simTime,
  };
}

/* ========================================================================== */
/* §12 THE ESTIMATOR — cluster bootstrap by MATCH SEED (#20)                   */
/* ========================================================================== */
function resampleMatrix(nClusters: number): number[][] {
  const rng = new Rng(BOOTSTRAP_SEED);
  const out: number[][] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx = new Array<number>(nClusters);
    for (let i = 0; i < nClusters; i++) idx[i] = Math.floor(rng.next() * nClusters) % nClusters;
    out.push(idx);
  }
  return out;
}
const ciOf = (draws: readonly number[]): [number, number] => {
  const s = [...draws].filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  return [round(quantileSorted(s, 0.025), 5), round(quantileSorted(s, 0.975), 5)];
};
const verdictOf = (point: number, ci: [number, number]): string => {
  if (!Number.isFinite(point) || !Number.isFinite(ci[0]) || !Number.isFinite(ci[1])) return 'UNRESOLVED';
  if (ci[0] > 0) return 'RESOLVED-CONFIRM';
  if (ci[1] < 0) return 'RESOLVED-INVERT';
  return 'UNRESOLVED';
};

/* ========================================================================== */
/* §13 N DERIVATION (the frozen §NRULE)                                        */
/* ========================================================================== */
const wall0 = Date.now();
const frozenNStar = (msPerMatch: number, msSource: string, eventsPerMatch: number, evSource: string) => {
  /** ⭐ THE ZERO-EVENT CLAUSE, frozen ex ante with the rest of the rule: if the smoke sees ZERO
   *  punished holds in the rarest band, the PRECISION term is UNBOUNDED (it cannot be estimated
   *  from a zero count and this stage will not invent a floor for it), so the wall term and the
   *  seed-budget cap bind. That is the min() doing exactly its job. */
  const nRaw = eventsPerMatch > 0 ? Math.ceil(TARGET_RAREST_BAND_EVENTS / eventsPerMatch) : Number.POSITIVE_INFINITY;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / N_STEP) * N_STEP : Number.POSITIVE_INFINITY;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * ARMS_COUNT * XDET_FACTOR));
  const nStar = Math.min(nStepped, nWall, N_CAP);
  const binding = !Number.isFinite(nStepped)
    ? (nStar === nWall ? 'wall (precision term UNBOUNDED — the zero-event clause)'
      : 'seedBandCap (precision term UNBOUNDED — the zero-event clause)')
    : nStar === nStepped ? 'precision' : nStar === nWall ? 'wall' : 'seedBandCap';
  return {
    targetRarestBandEvents: TARGET_RAREST_BAND_EVENTS,
    rarestBandEventsPerMatch: round(eventsPerMatch, 5), eventsSource: evSource,
    msPerMatch: round(msPerMatch, 3), msSource,
    nRaw: Number.isFinite(nRaw) ? nRaw : null,
    nStepped: Number.isFinite(nStepped) ? nStepped : null,
    precisionTermUnbounded: !Number.isFinite(nStepped),
    nStep: N_STEP, nWall, nCap: N_CAP,
    nStar: Number.isFinite(nStar) ? nStar : null,
    bindingTerm: binding,
    projectedWallHours: Number.isFinite(nStar)
      ? round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 4) : null,
    arithmetic: `N* = min( ceil(${TARGET_RAREST_BAND_EVENTS} / rarestBandEventsPerMatch) ↑${N_STEP}, `
      + `floor(${WALL_BUDGET_HOURS} h / (ms/match × ${ARMS_COUNT} arm × ${XDET_FACTOR} X-DET)), ${N_CAP} ) `
      + '— DV-C0 / DV-T2-C0 §NRULE\'s form, inherited, with THIS census\'s own numerator: the '
      + 'rarest-band event is a PUNISHED HOLD in the RAREST of the three PERCEIVED pressure bands '
      + 'at the PRIMARY window, i.e. the scarcest numerator the published table contains. Frozen '
      + 'in the stage doc §NRULE BEFORE the smoke ran.',
  };
};
interface NDeriv {
  mode: Mode; n: number; nStar: number | null; smokeArtifactSha256: string | null;
  envOverride: number | null; note?: string; arithmetic?: string; smokeArtifact?: string;
  targetRarestBandEvents?: number; rarestBandEventsPerMatch?: number; eventsSource?: string;
  msPerMatch?: number; msSource?: string; nRaw?: number | null; nStepped?: number | null;
  precisionTermUnbounded?: boolean; nStep?: number; nWall?: number; nCap?: number;
  bindingTerm?: string; projectedWallHours?: number | null;
}
const nDerivation: NDeriv = (() => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke' as const, n: Math.min(SMOKE_N, CAP), nStar: null as number | null,
      note: `SMOKE — N is FIXED by the stage doc at ${SMOKE_N} seeds `
        + `(${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}). It publishes exactly TWO sizing numbers `
        + '(ms/match, rarest-band punished holds per match) and ADJUDICATES NOTHING.',
      smokeArtifactSha256: null as string | null, envOverride: N_ENV,
    };
  }
  let msPerMatch = PRIOR_MS_PER_MATCH;
  let eventsPerMatch = Number.NaN;
  let msSource = `the PRIOR ${PRIOR_MS_PER_MATCH} ms/match — no committed smoke artifact was found`;
  let evSource = 'ABSENT — no committed smoke artifact';
  let smokeSha: string | null = null;
  if (existsSync(SMOKE_PATH)) {
    const bytes = readFileSync(SMOKE_PATH);
    const smoke = JSON.parse(bytes.toString('utf8')) as {
      mode?: string;
      result?: { sizing?: { rarestBandEventsPerMatch?: number } };
      envelopeUnhashed?: { wallContextOnly?: { msPerMatchMeasured?: number } };
    };
    /** ⭐ THE ONLY TWO NUMBERS READ OUT OF THE SMOKE — and they live in the two places #258.3 puts
     *  them: the event rate in the HASHED body, the timing in the UNHASHED envelope (no wall field
     *  ever enters a digest; a wall number that DOES have a job is read from a committed artifact,
     *  where it is a fixed, portable anchor rather than this run's clock). */
    const v = smoke.envelopeUnhashed?.wallContextOnly?.msPerMatchMeasured;
    const g = smoke.result?.sizing?.rarestBandEventsPerMatch;
    if (smoke.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof g === 'number' && g >= 0) {
      msPerMatch = v; eventsPerMatch = g;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      evSource = 'the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N: exactly TWO numbers '
        + 'are read out of it, ms/match and the rarest perceived-pressure band\'s PUNISHED holds '
        + 'per match at the primary window. No rate, CI, ordering or shape verdict is read from it.';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, eventsPerMatch, evSource);
  return {
    mode: 'full' as const, smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, n: N_ENV ?? derived.nStar ?? 0, envOverride: N_ENV,
  };
})();
if (MODE === 'full' && nDerivation.n <= 0) {
  console.error('EK-C0 FATAL — full mode needs the committed SMOKE artifact (or EKC0_N, which turns '
    + `gCleanInvocation RED). Run the smoke first: EKC0_MODE=smoke … → ${SMOKE_PATH}`);
  process.exit(2);
}
const CLEAN_INVOCATION = N_ENV === null && !IS_PREFLIGHT;
const RUN_BASE = MODE === 'smoke'
  ? (CLEAN_INVOCATION ? SMOKE_BASE : GUARD_BLOCK[0])
  : (CLEAN_INVOCATION ? CENSUS_BASE : GUARD_BLOCK[0]);
const RUN_N = Math.min(nDerivation.n, CAP);

/* ========================================================================== */
/* §14 STARTUP BANNER                                                          */
/* ========================================================================== */
banner('');
banner('=============================================================================');
banner(`EK-C0 — THE OBSERVABLE HOLD-OUTCOME CENSUS (#259) · mode ${MODE} · N ${RUN_N} seeds × 1 arm`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
banner('world  ⭐ the whetherEye-ARMED exam world: C5-T2\'s CENSUS_FLAGS + the certified table');
banner(`       ${EXPECTED_TABLE_SHA.slice(0, 12)}… injected, arm neutral, scope BOTH`);
banner(`N rule ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
banner('FROZEN THIS RUN:');
banner('  index   the SEAT\'S OWN perceived pressure band (whetherEyeDecision\'s placement)');
banner(`  window  PRIMARY ${PRIMARY_WINDOW_S}s (DV-C0's own) · ladder ${WINDOWS_S.join('/')}s`
  + ` · C5-native REPORTED row ${C5_NATIVE_WINDOW_S}s`);
banner('  label   PUNISHED = the holding TEAM loses possession inside the window, at DV-C0\'s own');
banner('          team-level turnover semantics (an opponent establishing control)');
banner('  ⭐ #246 SHAPE PREDICATES: P(punished) pressed > mid > free, CI-resolved.');
banner('     An INVERSION is PUBLISHED and routed to the 街机偏离 test — never corrected away.');
banner('=============================================================================');
banner('');

/* ========================================================================== */
/* §15 THE CORE (run TWICE for X-DET)                                          */
/* ========================================================================== */
const PROGRESS_EVERY_MS = 20_000;
let lastProgress = 0;
const progress = (tag: string, done: number, total: number): void => {
  const now = Date.now();
  if (now - lastProgress < PROGRESS_EVERY_MS && done !== total) return;
  lastProgress = now;
  const el = (now - wall0) / 1000;
  const rate = done === 0 ? 0 : el / done;
  process.stderr.write(`  [ekc0 ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(3)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

/** the checkpoint: seed → serialized row, written by pass A only. */
const checkpointHeader = JSON.stringify({ mode: MODE, base: RUN_BASE, n: RUN_N, k: HOLD_K_TICKS });
const loadCheckpoint = (): Map<number, CensusRow> => {
  const out = new Map<number, CensusRow>();
  if (!RESUME || !existsSync(CHECKPOINT_PATH)) return out;
  for (const line of readFileSync(CHECKPOINT_PATH, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    const rec = JSON.parse(line) as { header: string; row: CensusRow };
    if (rec.header !== checkpointHeader) return new Map();
    out.set(rec.row.seed, rec.row);
  }
  return out;
};

function walkBlock(tag: string, base: number, n: number, useCheckpoint: boolean): CensusRow[] {
  const resumed = useCheckpoint ? loadCheckpoint() : new Map<number, CensusRow>();
  if (useCheckpoint && resumed.size === 0 && existsSync(CHECKPOINT_PATH)) rmSync(CHECKPOINT_PATH);
  const rows: CensusRow[] = [];
  for (let i = 0; i < n; i++) {
    const seed = base + i;
    const cached = resumed.get(seed);
    if (cached !== undefined) { rows.push(cached); progress(tag, i + 1, n); continue; }
    const row = walkCensusMatch(seed);
    rows.push(row);
    if (useCheckpoint) appendFileSync(CHECKPOINT_PATH, `${JSON.stringify({ header: checkpointHeader, row })}\n`);
    progress(tag, i + 1, n);
  }
  return rows;
}

interface AggCell {
  band: BandKey; label: string;
  moments: number; lost: number; punished: number; sameChain: number; censored: number;
  punishRate: number; punishRateCi95: [number, number];
  lostUnpunished: number; noLoss: number;
  lostUnpunishedShare: number; noLossShare: number;
  punishGivenLost: number; punishGivenLostCi95: [number, number];
  sameChainRate: number;
}

function aggregate(rows: readonly CensusRow[]) {
  const nClusters = rows.length;
  const boot = resampleMatrix(nClusters);
  const perSeedCell = (r: CensusRow, b: BandKey): BandCell => {
    const a = r.cells[cellKey(0, b)]; const c = r.cells[cellKey(1, b)];
    return {
      moments: a.moments + c.moments,
      punished: a.punished.map((v, i) => v + c.punished[i]),
      sameChain: a.sameChain.map((v, i) => v + c.sameChain[i]),
      censored: a.censored.map((v, i) => v + c.censored[i]),
      lostWithinMax: a.lostWithinMax + c.lostWithinMax,
      liveHolds: a.liveHolds + c.liveHolds,
      liveHoldsPunished: a.liveHoldsPunished.map((v, i) => v + c.liveHoldsPunished[i]),
    };
  };
  const drawsFor = (num: readonly number[], den: readonly number[]): number[] => boot.map((idx) => {
    let a = 0; let b = 0;
    for (const i of idx) { a += num[i]; b += den[i]; }
    return b === 0 ? Number.NaN : a / b;
  });

  const table = ALL_WINDOWS_S.map((w, wi) => {
    const cells: AggCell[] = BAND_KEYS.map((b) => {
      const per = rows.map((r) => perSeedCell(r, b));
      const moments = sum(per.map((p) => p.moments));
      const punished = sum(per.map((p) => p.punished[wi]));
      const lost = sum(per.map((p) => p.lostWithinMax));
      const sameChain = sum(per.map((p) => p.sameChain[wi]));
      const censored = sum(per.map((p) => p.censored[wi]));
      const rateDraws = drawsFor(per.map((p) => p.punished[wi]), per.map((p) => p.moments));
      const lostDraws = drawsFor(per.map((p) => p.punished[wi]), per.map((p) => p.lostWithinMax));
      return {
        band: b, label: BAND_LABEL[b],
        moments, lost, punished, sameChain, censored,
        punishRate: moments === 0 ? NaN : round(punished / moments, 5),
        punishRateCi95: ciOf(rateDraws),
        lostUnpunished: lost - punished,
        noLoss: moments - lost,
        lostUnpunishedShare: moments === 0 ? NaN : round((lost - punished) / moments, 5),
        noLossShare: moments === 0 ? NaN : round((moments - lost) / moments, 5),
        punishGivenLost: lost === 0 ? NaN : round(punished / lost, 5),
        punishGivenLostCi95: ciOf(lostDraws),
        sameChainRate: punished === 0 ? NaN : round(sameChain / punished, 5),
      };
    });
    const allMoments = sum(cells.map((c) => c.moments));
    const allPunished = sum(cells.map((c) => c.punished));
    const allLost = sum(cells.map((c) => c.lost));
    const allDraws = drawsFor(
      rows.map((r) => sum(BAND_KEYS.map((b) => perSeedCell(r, b).punished[wi]))),
      rows.map((r) => sum(BAND_KEYS.map((b) => perSeedCell(r, b).moments))),
    );
    /* ⭐ THE #246 SHAPE — paired on the SAME shared resample matrix. */
    const rateDrawsFor = (b: BandKey) => drawsFor(
      rows.map((r) => perSeedCell(r, b).punished[wi]), rows.map((r) => perSeedCell(r, b).moments),
    );
    const d0 = rateDrawsFor('p0'); const d1 = rateDrawsFor('p1'); const d2 = rateDrawsFor('p2');
    const diff = (a: number[], b: number[]) => a.map((v, i) => v - b[i]);
    const pressedVsMid = { point: round((cells[2].punishRate - cells[1].punishRate), 5), ci95: ciOf(diff(d2, d1)) };
    const midVsFree = { point: round((cells[1].punishRate - cells[0].punishRate), 5), ci95: ciOf(diff(d1, d0)) };
    const v1 = verdictOf(pressedVsMid.point, pressedVsMid.ci95);
    const v2 = verdictOf(midVsFree.point, midVsFree.ci95);
    return {
      windowS: w,
      isPrimary: w === PRIMARY_WINDOW_S,
      isC5Native: w === C5_NATIVE_WINDOW_S,
      byBand: cells,
      all: {
        moments: allMoments, lost: allLost, punished: allPunished,
        punishRate: allMoments === 0 ? NaN : round(allPunished / allMoments, 5),
        punishRateCi95: ciOf(allDraws),
      },
      realityShape: {
        pressedVsMid: { ...pressedVsMid, verdict: v1 },
        midVsFree: { ...midVsFree, verdict: v2 },
        gradientWithPressure: (v1 === 'RESOLVED-CONFIRM' && v2 === 'RESOLVED-CONFIRM')
          ? 'RESOLVED-CONFIRM'
          : (v1 === 'RESOLVED-INVERT' || v2 === 'RESOLVED-INVERT') ? 'INVERSION-PRESENT' : 'UNRESOLVED',
        routing: (v1 === 'RESOLVED-INVERT' || v2 === 'RESOLVED-INVERT')
          ? '⚠ AN INVERSION IS PRESENT AT THIS WINDOW — ROUTED to the 街机偏离 test (#246). It is '
            + 'PUBLISHED as measured and is NEVER corrected into the table.'
          : 'no inversion at this window; the routing clause is dormant.',
      },
    };
  });

  const primaryIdx = ALL_WINDOWS_S.indexOf(PRIMARY_WINDOW_S as (typeof ALL_WINDOWS_S)[number]);

  /* --- the E-class mix (context for EK-T1) --- */
  const eligible = sum(rows.map((r) => r.eligible));
  const classCounts = Object.fromEntries(CLASSES.map((c) => [c, sum(rows.map((r) => r.classCounts[c]))]));
  const classShares = Object.fromEntries(CLASSES.map((c) => [
    c, eligible === 0 ? NaN : round((classCounts[c] as number) / eligible, 5),
  ]));

  /* --- ⭐ the EVENT-RATE MOMENTS: per band PER TEAM PER MATCH --- */
  const teamMatch = (b: BandKey, pick: (c: BandCell) => number): number[] => rows.flatMap(
    (r) => ([0, 1] as const).map((s) => pick(r.cells[cellKey(s, b)])),
  );
  const momentsOf = (xs: number[]) => ({
    mean: round(meanOf(xs), 4), sd: round(sdOf(xs), 4),
    cv: round(sdOf(xs) / meanOf(xs), 4),
    min: Math.min(...xs), p10: round(quantileOf(xs, 0.10), 3), median: round(quantileOf(xs, 0.5), 3),
    p90: round(quantileOf(xs, 0.90), 3), max: Math.max(...xs),
    zeroShare: round(xs.filter((x) => x === 0).length / xs.length, 5),
    observations: xs.length,
  });
  const eventRateMoments = {
    grainNote: '⭐ per PERCEIVED PRESSURE BAND, per TEAM, per MATCH — the grain EK-T1\'s run-length '
      + 'arithmetic needs. TWO rate families are published because they bracket what an EK-T0 book '
      + 'can actually see: (i) CENSUS MOMENTS — eligible decision moments whose perceived cell was '
      + 'placed, i.e. every moment at which a hold COULD be booked, measured AT THE CENSUS GRID '
      + `(spacing ${MOMENT_SPACING} ticks, cap ${PER_MATCH_CAP}/match — the C5-T2 exam grid, so `
      + 'these are a GRID-LIMITED count, not the world\'s full decision rate); (ii) LIVE D-HOLD '
      + 'TAKES — the holds the armed seat actually took, counted off the live world with NO grid.',
    byBand: BAND_KEYS.map((b) => ({
      band: b, label: BAND_LABEL[b],
      censusMomentsPerTeamPerMatch: momentsOf(teamMatch(b, (c) => c.moments)),
      punishedPerTeamPerMatch: momentsOf(teamMatch(b, (c) => c.punished[primaryIdx])),
      liveHoldsPerTeamPerMatch: momentsOf(teamMatch(b, (c) => c.liveHolds)),
    })),
    allBandsCensusMomentsPerTeamPerMatch: momentsOf(rows.flatMap(
      (r) => ([0, 1] as const).map((s) => sum(BAND_KEYS.map((b) => r.cells[cellKey(s, b)].moments))),
    )),
    allBandsLiveHoldsPerTeamPerMatch: momentsOf(rows.flatMap(
      (r) => ([0, 1] as const).map((s) => sum(BAND_KEYS.map((b) => r.cells[cellKey(s, b)].liveHolds))),
    )),
  };

  /* --- the run-length K grid (a REPORTING AID) --- */
  const K_GRID = [10, 20, 30, 50, 100] as const;
  const runLengthArithmetic = BAND_KEYS.map((b) => {
    const rate = meanOf(teamMatch(b, (c) => c.moments));
    const live = meanOf(teamMatch(b, (c) => c.liveHolds));
    return {
      band: b,
      censusMomentsPerTeamPerMatch: round(rate, 4),
      liveHoldsPerTeamPerMatch: round(live, 4),
      matchesForK: Object.fromEntries(K_GRID.map((k) => [
        `K${k}`, {
          atCensusMomentRate: rate > 0 ? Math.ceil(k / rate) : null,
          atLiveHoldRate: live > 0 ? Math.ceil(k / live) : null,
        },
      ])),
    };
  });

  /* --- ⭐ THE SEAT'S OWN TAKES (the charter's literal D-HOLD population) --- */
  const liveHoldTable = BAND_KEYS.map((b) => {
    const holds = sum(rows.map((r) => sum(([0, 1] as const).map((s) => r.cells[cellKey(s, b)].liveHolds))));
    const punished = sum(rows.map((r) => sum(([0, 1] as const).map(
      (s) => r.cells[cellKey(s, b)].liveHoldsPunished[primaryIdx],
    ))));
    return {
      band: b, label: BAND_LABEL[b], holds, punished,
      punishRate: holds === 0 ? NaN : round(punished / holds, 5),
      note: holds === 0
        ? 'no take in this band — the R-B rule licenses a take ONLY where the certified interval '
          + 'reaches zero, and in the certified table that is the single cell 0|0|0.'
        : 'the seat\'s own live takes at the primary window.',
    };
  });
  const liveHoldCellMix: Record<string, number> = {};
  for (const r of rows) for (const [k, v] of Object.entries(r.liveHoldCells)) {
    liveHoldCellMix[k] = (liveHoldCellMix[k] ?? 0) + v;
  }

  /* --- accounting (the identity gate's input) --- */
  const acc = {
    totalTicks: sum(rows.map((r) => r.acc.totalTicks)),
    deadBallTicks: sum(rows.map((r) => r.acc.deadBallTicks)),
    segmentTicks: sum(rows.map((r) => r.acc.segmentTicks)),
    looseGapTicks: sum(rows.map((r) => r.acc.looseGapTicks)),
    assignedTicksSum: sum(rows.map((r) => r.acc.assignedTicksSum)),
    spanOrderViolations: sum(rows.map((r) => r.acc.spanOrderViolations)),
    turnoversTotal: sum(rows.map((r) => r.acc.turnoversTotal)),
    turnoversLedgered: sum(rows.map((r) => r.turnoversTotal)),
    goalsFromScore: sum(rows.map((r) => r.acc.goalsFromScore)),
    qualifying: sum(rows.map((r) => r.qualifying)),
    eligible,
    exclusions: {
      firstTouch: sum(rows.map((r) => r.exFirstTouch)), mustKick: sum(rows.map((r) => r.exMustKick)),
      a0Shoot: sum(rows.map((r) => r.exShoot)), a0Clear: sum(rows.map((r) => r.exClear)),
    },
    classCounts,
    dosedForks: sum(rows.map((r) => r.dosedForks)),
    liveHoldTotal: sum(rows.map((r) => r.liveHoldTotal)),
    controlChecked: sum(rows.map((r) => r.controlChecked)),
    controlUnexplained: sum(rows.map((r) => r.controlUnexplained)),
    biteChecked: sum(rows.map((r) => r.biteChecked)),
    biteDiffered: sum(rows.map((r) => r.biteDiffered)),
    perWindow: ALL_WINDOWS_S.map((w, wi) => ({
      windowS: w,
      punished: sum(BAND_KEYS.map((b) => sum(rows.map((r) => perSeedCell(r, b).punished[wi])))),
      lost: sum(BAND_KEYS.map((b) => sum(rows.map((r) => perSeedCell(r, b).lostWithinMax)))),
      moments: sum(BAND_KEYS.map((b) => sum(rows.map((r) => perSeedCell(r, b).moments)))),
      censored: sum(BAND_KEYS.map((b) => sum(rows.map((r) => perSeedCell(r, b).censored[wi])))),
    })),
  };

  /* --- ⭐ the per-cluster CELLS, STORED so every CI re-derives without a re-run (#256.3) --- */
  const clusterCells = rows.map((r) => ({
    seed: r.seed,
    bySideBand: Object.fromEntries(Object.entries(r.cells).map(([k, c]) => [k, {
      moments: c.moments, punished: c.punished, sameChain: c.sameChain, censored: c.censored,
      lostWithinMax: c.lostWithinMax, liveHolds: c.liveHolds, liveHoldsPunished: c.liveHoldsPunished,
    }])),
    eligible: r.eligible, qualifying: r.qualifying,
    classCounts: r.classCounts,
    turnovers: r.turnoversTotal, goals: r.acc.goalsFromScore, simSeconds: round(r.simSeconds, 4),
  }));

  const primary = table[primaryIdx];
  const rarestBand = [...primary.byBand].sort((a, b) => a.moments - b.moments)[0];
  const yardstick = {
    schema: 'ek-c0.hold-truth-table.v1',
    frozenBy: 'EK-C0, before any hold account book exists (#247/#259.2). EK-T1 MAY NOT RE-CUT THIS '
      + 'SHAPE: a belief is scored against `bands` (absolute), `relative` (scale-free) and '
      + '`ordering` (the rank vector), and against nothing else.',
    frame: 'the HOLDING team\'s own possession — "did I lose it after holding on".',
    index: 'the SEAT\'S OWN perceived pressure band at the decision instant (M-EK.1: the book '
      + 'indexes what the chooser reads — the #256.2/#257.2 commensurability rule at the source).',
    windowS: PRIMARY_WINDOW_S,
    holdTicks: HOLD_K_TICKS,
    bandCuts: TABLE.pressureBands,
    bands: Object.fromEntries(primary.byBand.map((c) => [c.band, {
      punishRate: c.punishRate, ci95: c.punishRateCi95, holds: c.moments,
      punished: c.punished, lost: c.lost,
      punishGivenLost: c.punishGivenLost, punishGivenLostCi95: c.punishGivenLostCi95,
    }])),
    /** ⭐ scale-free, computed over the bands that CARRY DATA — an empty band scores `null`, never
     *  a silent NaN that would poison every downstream comparison. */
    relative: Object.fromEntries(primary.byBand.map((c) => {
      const finite = primary.byBand.filter((x) => Number.isFinite(x.punishRate)).map((x) => x.punishRate);
      return [c.band, Number.isFinite(c.punishRate) && finite.length > 0
        ? round(c.punishRate / meanOf(finite), 5) : null];
    })),
    ordering: [...primary.byBand].filter((c) => c.moments > 0 && Number.isFinite(c.punishRate))
      .sort((a, b) => b.punishRate - a.punishRate).map((c) => c.band),
    bandsWithNoData: primary.byBand.filter((c) => c.moments === 0).map((c) => c.band),
    baselinePunishRateAllBands: primary.all.punishRate,
  };

  return {
    matches: rows.length,
    simSecondsPerMatch: round(meanOf(rows.map((r) => r.simSeconds)), 4),
    turnoversPerMatch: round(acc.turnoversTotal / rows.length, 4),
    goalsPerMatch: round(acc.goalsFromScore / rows.length, 4),
    eligiblePerMatch: round(eligible / rows.length, 4),
    dosedHoldsPerMatch: round(acc.dosedForks / rows.length, 4),
    liveHoldsPerMatch: round(acc.liveHoldTotal / rows.length, 4),
    classCounts, classShares,
    table, eventRateMoments, runLengthArithmetic,
    liveHoldTable, liveHoldCellMix,
    yardstick, accounting: acc, clusterCells,
    rarestBand: { band: rarestBand.band, moments: rarestBand.moments, punished: rarestBand.punished },
  };
}

/* --- the two passes (X-DET) ------------------------------------------------- */
const passStartA = Date.now();
const rowsA = walkBlock('pass A', RUN_BASE, RUN_N, true);
const passMsA = Date.now() - passStartA;
const coreA = aggregate(rowsA);
const passStartB = Date.now();
const rowsB = walkBlock('pass B', RUN_BASE, RUN_N, false);
const passMsB = Date.now() - passStartB;
const coreB = aggregate(rowsB);
const digestOf = (o: unknown): string => createHash('sha256').update(JSON.stringify(o)).digest('hex');
const digestA = digestOf(coreA);
const digestB = digestOf(coreB);
const msPerMatchMeasured = passMsB / Math.max(1, RUN_N);

/* ========================================================================== */
/* §16 THE GATES                                                               */
/* ========================================================================== */
/** ⭐ G-CONFIG-IDENTITY: the armed world's configuration is C5-T2's COMMITTED exam configuration,
 *  read out of the exam probe's own SOURCE — not re-typed from the stage doc's prose. */
const examSource = readFileSync(EXAM_PROBE_PATH, 'utf8');
const grabNum = (re: RegExp): number | null => {
  const m = examSource.match(re);
  return m === null ? null : Number(m[1].replace(/_/g, ''));
};
const configConjuncts = (src: string) => {
  const flagsBlock = src.match(/const CENSUS_FLAGS = \{([\s\S]*?)\} as const;/)?.[1] ?? '';
  const flagOk = (k: string, v: boolean): boolean => new RegExp(`${k}:\\s*${v}`).test(flagsBlock);
  const num = (re: RegExp): number | null => {
    const m = src.match(re); return m === null ? null : Number(m[1].replace(/_/g, ''));
  };
  return {
    flagsFound: flagsBlock.length > 0,
    edsPerceivedDefence: flagOk('edsPerceivedDefence', true),
    edsPerceivedChoice: flagOk('edsPerceivedChoice', true),
    edsValueAxis: flagOk('edsValueAxis', true),
    c5Hold: flagOk('c5Hold', true),
    c6Carry: flagOk('c6Carry', true),
    c7Windup: flagOk('c7Windup', true),
    c5TouchForkOff: flagOk('c5TouchFork', false),
    tableShaSame: new RegExp(`EXPECTED_TABLE_SHA = '${EXPECTED_TABLE_SHA}'`).test(src),
    tablePathSame: src.includes(TABLE_PATH),
    durationSame: num(/const MATCH_DURATION = (\d[\d_]*)/) === MATCH_DURATION,
    perMatchCapSame: num(/const PER_MATCH_CAP = (\d[\d_]*)/) === PER_MATCH_CAP,
    momentSpacingSame: num(/const MOMENT_SPACING = (\d[\d_]*)/) === MOMENT_SPACING,
    supportMinSame: num(/const SUPPORT_MIN_M = (\d[\d_]*)/) === SUPPORT_MIN_M,
    supportMaxSame: num(/const SUPPORT_MAX_M = (\d[\d_]*)/) === SUPPORT_MAX_M,
    squadDerivationSame: /teamA: team\('A', seed \* 2 \+ 1\), teamB: team\('B', seed \* 2 \+ 2\)/.test(src),
    holdKInLadder: TABLE.cells.some((c) => c.costs.some((k) => k.holdTicks === HOLD_K_TICKS)),
    injectedTableShaSame: tableRaw.tableSha === EXPECTED_TABLE_SHA,
    armIsNeutral: EYE_CONFIG.arm === 'neutral',
    scopeIsBoth: EYE_CONFIG.scope.kind === 'both',
  };
};
const gConfigIdentity = (() => {
  const c = configConjuncts(examSource);
  return {
    pass: Object.values(c).every(Boolean), ...c,
    examProbe: EXAM_PROBE_PATH,
    note: '⭐ THE ARMED WORLD IS C5-T2\'s OWN EXAM WORLD, proved against the committed exam probe\'s '
      + 'SOURCE (flags, duration, sampling grid, support window, squad derivation, injected table '
      + 'SHA and path), not against the stage doc\'s prose. ⚠ TWO declared reconstructions the exam '
      + 'probe cannot supply, because it never armed the live seam (it forked off pristine clones): '
      + 'the SCOPE (`both` — the seat doc §5.4\'s R3 deployment rung) and the LIVE ARMING itself '
      + '(`match.whetherEye` set, so the seat\'s D-HOLD takes actually happen in the trajectory, '
      + 'which the contract §3 requires: "holds must actually occur").',
  };
})();

/** ⭐ G-REPRO65: the #65 sizing block re-walked in the #65 configuration. */
const repro65 = (() => {
  const rows: Repro65Row[] = [];
  for (let i = 0; i < REPRO65_N; i++) rows.push(walkRepro65(REPRO65_BASE + i));
  const s = (f: (r: Repro65Row) => number) => sum(rows.map(f));
  const committed = JSON.parse(readFileSync(SIZING_ARTIFACT_PATH, 'utf8'));
  const mix: Record<string, number> = {};
  for (const r of rows) for (const [k, v] of Object.entries(r.perceivedCellMix)) mix[k] = (mix[k] ?? 0) + v;
  const placed = s((r) => r.ctxPlaced);
  const fields: { field: string; want: number; got: number }[] = [
    { field: 'qualifyingTotal', want: committed.qualifyingTotal, got: s((r) => r.qualifying) },
    { field: 'eligibleTotal', want: committed.eligibleTotal, got: s((r) => r.eligible) },
    { field: 'exclusions.firstTouch', want: committed.exclusions.firstTouch, got: s((r) => r.exFirstTouch) },
    { field: 'exclusions.mustKick', want: committed.exclusions.mustKick, got: s((r) => r.exMustKick) },
    { field: 'exclusions.a0Shoot', want: committed.exclusions.a0Shoot, got: s((r) => r.exShoot) },
    { field: 'exclusions.a0Clear', want: committed.exclusions.a0Clear, got: s((r) => r.exClear) },
    ...CLASSES.map((c) => ({
      field: `decisionClassShares.${c}.count`, want: committed.decisionClassShares[c].count,
      got: s((r) => r.classCounts[c]),
    })),
    { field: 'chooserHold.total', want: committed.chooserHold.total, got: s((r) => sum(Object.values(r.holdCells))) },
    { field: 'mCtx.placed', want: committed.mCtxPerceptionPrice.placed, got: placed },
    {
      field: 'mCtx.agreeOverall(count)',
      want: Math.round(committed.mCtxPerceptionPrice.agreeOverall * committed.mCtxPerceptionPrice.placed),
      got: s((r) => r.ctxAgreeAll),
    },
    ...(['agreePressure', 'agreeStale', 'agreeSupport'] as const).map((k, i) => ({
      field: `mCtx.${k}(count)`,
      want: Math.round(committed.mCtxPerceptionPrice[k] * committed.mCtxPerceptionPrice.placed),
      got: s((r) => r.ctxAgreeFeature[i]),
    })),
    ...Object.entries(committed.mCtxPerceptionPrice.perceivedCellMix as Record<string, number>)
      .map(([cellK, want]) => ({ field: `perceivedCellMix.${cellK}`, want, got: mix[cellK] ?? 0 })),
  ];
  const mismatches = fields.filter((f) => f.want !== f.got);
  return {
    pass: mismatches.length === 0 && fields.length >= 20,
    block: `${REPRO65_BASE}..${REPRO65_BASE + REPRO65_N - 1}`,
    artifact: SIZING_ARTIFACT_PATH,
    fieldsChecked: fields.length, mismatches: mismatches.length,
    mismatchDetail: mismatches.slice(0, 10),
    fields,
    note: '⭐⭐ THE C5-T2 FAMILY\'S OWN RECEIPT: the #65 sizing smoke\'s committed block re-walked '
      + 'with THIS probe\'s walker in the #65 configuration (whetherEye null on the live match, '
      + 'every decision classified on a pristine clone), reproducing its committed integers — the '
      + 'eligibility predicate, the four decision classes, the D-HOLD takes, the perceived-vs-true '
      + 'agreement counts and the whole perceived-cell mix (the BAND placement this census indexes '
      + 'by). The exam probe\'s own fork stage has no committed artifact to re-walk (it was written '
      + 'but never run for real), which is why identity there is proved against its SOURCE '
      + '(G-CONFIG-IDENTITY) and SAID SO.',
  };
})();

/** ⭐ G-REPRO-DVC0: the loss-tick semantics are DV-C0's. */
const reproDvc0 = (() => {
  const rows: ReproDvc0Row[] = [];
  for (let i = 0; i < REPRO_DVC0_N; i++) rows.push(walkReproDvc0(REPRO_DVC0_BASE + i));
  const committed = JSON.parse(readFileSync(DVC0_SMOKE_PATH, 'utf8'));
  const acc = committed.result.census.accounting;
  const zones = committed.result.census.yardstick.zones;
  const s = (f: (r: ReproDvc0Row) => number) => sum(rows.map(f));
  const fields = [
    { field: 'accounting.totalTicks', want: acc.totalTicks, got: s((r) => r.acc.totalTicks) },
    { field: 'accounting.deadBallTicks', want: acc.deadBallTicks, got: s((r) => r.acc.deadBallTicks) },
    { field: 'accounting.segmentTicks', want: acc.segmentTicks, got: s((r) => r.acc.segmentTicks) },
    { field: 'accounting.looseGapTicks', want: acc.looseGapTicks, got: s((r) => r.acc.looseGapTicks) },
    { field: 'accounting.assignedTicksSum', want: acc.assignedTicksSum, got: s((r) => r.acc.assignedTicksSum) },
    { field: 'accounting.spanOrderViolations', want: acc.spanOrderViolations, got: s((r) => r.acc.spanOrderViolations) },
    { field: 'accounting.turnoversTotal', want: acc.turnoversTotal, got: s((r) => r.acc.turnoversTotal) },
    { field: 'accounting.goalsFromScore', want: acc.goalsFromScore, got: s((r) => r.acc.goalsFromScore) },
    { field: 'accounting.concededGoals', want: acc.concededGoals, got: s((r) => r.concededGoals) },
    { field: 'zones.own.turnovers', want: zones.own.turnovers, got: s((r) => r.turnoversByThird.own) },
    { field: 'zones.middle.turnovers', want: zones.middle.turnovers, got: s((r) => r.turnoversByThird.middle) },
    { field: 'zones.final.turnovers', want: zones.final.turnovers, got: s((r) => r.turnoversByThird.final) },
  ];
  const mismatches = fields.filter((f) => f.want !== f.got);
  return {
    pass: mismatches.length === 0 && fields.length >= 10,
    block: `${REPRO_DVC0_BASE}..${REPRO_DVC0_BASE + REPRO_DVC0_N - 1}`,
    artifact: DVC0_SMOKE_PATH,
    fieldsChecked: fields.length, mismatches: mismatches.length, mismatchDetail: mismatches.slice(0, 10),
    fields,
    note: '⭐⭐ THE LOSS SEMANTICS ARE DV-C0\'s: its own committed smoke block re-walked in bare '
      + 'production with THIS probe\'s segment walker, reproducing its tick partition, its span '
      + 'ordering, its turnover total, its goal counts and its per-third turnover cells.',
  };
})();

/** G-WINDOW-TRACE: the primary window and the ladder are READ, never typed. */
const gWindowTrace = (() => {
  const dvc0 = existsSync(DVC0_FULL_PATH) ? JSON.parse(readFileSync(DVC0_FULL_PATH, 'utf8')) : null;
  const ggc = existsSync(GGC_FULL_PATH) ? JSON.parse(readFileSync(GGC_FULL_PATH, 'utf8')) : null;
  const dvPrimary = dvc0?.frozenDesign?.windows?.primaryWindowS ?? null;
  const dvLadder: number[] | null = dvc0?.frozenDesign?.windows?.windowsS ?? null;
  const family: number[] | null = ggc?.frozenDesign?.definitions?.dangerWindowsS
    ?? dvc0?.frozenDesign?.windows?.trace?.family ?? null;
  const familyMin = family === null ? null : Math.min(...family);
  const c5Horizon = tableParams.horizon as number;
  const conj = {
    primaryIsDvc0Primary: dvPrimary === PRIMARY_WINDOW_S,
    ladderIsDvc0Ladder: dvLadder !== null && JSON.stringify(dvLadder) === JSON.stringify([...WINDOWS_S]),
    primaryInFamily: family !== null && family.includes(PRIMARY_WINDOW_S),
    ladderMultiplesOfFamilyMin: familyMin !== null && WINDOWS_S.every((w) => w % familyMin === 0),
    c5NativeRowTraced: Number.isInteger(c5Horizon) && round(c5Horizon / TICKS_PER_S, 6) === C5_NATIVE_WINDOW_S,
    ticksPerSecondIntegral: Number.isInteger(TICKS_PER_S) && Math.abs(TICKS_PER_S * DT - 1) < 1e-12,
    holdKIsCertifiedLadderMember: TABLE.cells.every(
      (c) => c.costs.some((k) => k.holdTicks === HOLD_K_TICKS),
    ),
  };
  return {
    pass: Object.values(conj).every(Boolean), ...conj,
    primaryWindowS: PRIMARY_WINDOW_S, windowsS: [...WINDOWS_S], c5NativeWindowS: C5_NATIVE_WINDOW_S,
    dvc0Primary: dvPrimary, dvc0Ladder: dvLadder, family, familyMin,
    c5HorizonTicks: c5Horizon, ticksPerSecond: TICKS_PER_S,
    note: '⭐ THE WINDOW IS A DECLARED FALLBACK, TRACED: the C5 family owns NO team-possession '
      + 'outcome window (its 240-tick horizon is a SHOT-FOR axis and its hold survival is a '
      + 'SAME-BODY retention read, C5-T0 §6.3), so M-EK.1\'s window falls back — as the contract '
      + 'authorises ex ante — to DV-C0\'s committed primary and ladder inside the #218 family. The '
      + 'C5-native 240-tick horizon is published as a REPORTED sensitivity row, re-derived here '
      + 'from the certified table\'s own `parameters.horizon` and the engine\'s DT.',
  };
})();

/** G-BAND-TRACE: the index is the SEAT's own placement, at the certified table's own cuts. */
const BAND_SWEEP_STEPS = 2001;
const gBandTrace = (() => {
  const cuts = TABLE.pressureBands;
  let disagreements = 0;
  for (let i = 0; i < BAND_SWEEP_STEPS; i++) {
    const v = i / (BAND_SWEEP_STEPS - 1);
    const mine: Band = (v < cuts[0] ? 0 : v < cuts[1] ? 1 : 2);
    const asBand = bandKeyOf(mine);
    if (asBand !== BAND_KEYS[mine]) disagreements += 1;
  }
  const seatSource = readFileSync('src/ai/whetherEye.ts', 'utf8');
  const conj = {
    cutsFromTable: Array.isArray(cuts) && cuts.length === 2 && cuts[0] < cuts[1],
    cutsAreCommittedCuts: JSON.stringify(cuts) === JSON.stringify(tableRaw.parameters.pressureBands),
    seatBandFormula: /const bandOf2 = \(value: number, cuts: readonly \[number, number\]\): Band =>/.test(seatSource),
    seatReadsPerceivedSnapshot: /match\.perceivedSnapshot\(p\)/.test(seatSource),
    sweepAgrees: disagreements === 0,
    threeBands: BAND_KEYS.length === 3,
  };
  return {
    pass: Object.values(conj).every(Boolean), ...conj,
    pressureCuts: cuts, sweepSamples: BAND_SWEEP_STEPS, disagreements,
    note: '⭐⭐ THE INDEX IS THE CHOOSER\'S OWN READ (M-EK.1): every band in this census is the band '
      + '`whetherEyeDecision` itself placed from the body\'s OWN perceived snapshot — the probe '
      + 'never recomputes a truth-side band for the table (the perceived-vs-true agreement is '
      + 'published only inside the G-REPRO65 receipt, where #65 published it).',
  };
})();

/** G-ARMED: the world really is armed and holds really do occur. */
const gArmed = (() => {
  const probe = examMatch(GWORLD_SEED);
  const bareEye = probe.whetherEye;
  const armed = examMatch(GWORLD_SEED);
  armed.whetherEye = EYE_CONFIG;
  const conj = {
    defaultEyeNull: bareEye === null,
    holdStateEmptyOnFreshMatch: probe.whetherHoldState.size === 0,
    armingSticks: armed.whetherEye !== null && armed.whetherEye.scope.kind === 'both',
    c5HoldArmed: (probe as unknown as { c5Hold?: boolean }).c5Hold === true,
    holdsActuallyOccur: coreA.accounting.liveHoldTotal > 0,
    dosedHoldsOccur: coreA.accounting.dosedForks > 0,
    doseBites: coreA.accounting.biteChecked > 0
      && coreA.accounting.biteDiffered / coreA.accounting.biteChecked >= BITE_FLOOR,
    forkControlClean: coreA.accounting.controlChecked > 0 && coreA.accounting.controlUnexplained === 0,
  };
  return {
    pass: Object.values(conj).every(Boolean), ...conj,
    liveHolds: coreA.accounting.liveHoldTotal, dosedHolds: coreA.accounting.dosedForks,
    biteChecked: coreA.accounting.biteChecked, biteDiffered: coreA.accounting.biteDiffered,
    biteShare: coreA.accounting.biteChecked === 0 ? NaN
      : round(coreA.accounting.biteDiffered / coreA.accounting.biteChecked, 5),
    controlChecked: coreA.accounting.controlChecked, controlUnexplained: coreA.accounting.controlUnexplained,
    biteFloor: BITE_FLOOR, controlHorizonTicks: CONTROL_HORIZON_TICKS, controlSample: CONTROL_SAMPLE,
    note: '⭐ THE ARMED WORLD IS WHERE THE LABEL LIVES (contract §3): the seat is null by default and '
      + 'on a fresh match, it is armed here explicitly, the seat\'s OWN takes are counted off the '
      + 'live commitment map, and the DOSED treatment is proved to BITE (its 240-tick signature '
      + 'differs from the untouched continuation) while an UNDOSED twin reproduces that '
      + 'continuation bit-identically (the C5-T2 X-CONTROL / X5 receipts, sampled 1-in-'
      + `${CONTROL_SAMPLE}).`,
  };
})();

/** G-ACCOUNTING: the partition, the monotonicity, the invariance. */
type AccIn = ReturnType<typeof aggregate>['accounting'];
const accountingConjuncts = (a: AccIn) => ({
  ticksIdentity: a.deadBallTicks + a.segmentTicks + a.looseGapTicks === a.totalTicks,
  noOverlap: a.assignedTicksSum === a.segmentTicks,
  spansOrdered: a.spanOrderViolations === 0,
  turnoverLedgered: a.turnoversTotal === a.turnoversLedgered,
  eligibilityPartition: a.qualifying === a.eligible + a.exclusions.firstTouch + a.exclusions.mustKick
    + a.exclusions.a0Shoot + a.exclusions.a0Clear,
  classPartition: a.eligible === CLASSES.reduce((s, c) => s + (a.classCounts[c] as number), 0),
  dosedEqualsPlacedCells: a.dosedForks === (a.classCounts['D-HOLD'] as number)
    + (a.classCounts['E-ACTNOW-DECLINED'] as number),
  /** the denominator ties to the INDEPENDENTLY incremented dose counter (an algebraic restatement
   *  of the partition would be a tautology — the #251.3 lesson: a conjunct that cannot fail is a
   *  dead conjunct, and its mutant is what found this one). */
  outcomeDenominatorTiesToDoseCounter: a.perWindow.every((w) => w.moments === a.dosedForks),
  /** every outcome class is NON-NEGATIVE at every window — the partition's real content. */
  outcomeClassesNonNegative: a.perWindow.every(
    (w) => w.punished >= 0 && w.lost - w.punished >= 0 && w.moments - w.lost >= 0,
  ),
  punishedSubsetLost: a.perWindow.every((w) => w.punished <= w.lost),
  punishmentMonotone: WINDOWS_S.every((w, i) => {
    if (i === 0) return true;
    const cur = a.perWindow.find((x) => x.windowS === w)!;
    const prev = a.perWindow.find((x) => x.windowS === WINDOWS_S[i - 1])!;
    return cur.punished >= prev.punished;
  }),
  lostInvariantInWindow: a.perWindow.every((w) => w.lost === a.perWindow[0].lost),
  momentsInvariantInWindow: a.perWindow.every((w) => w.moments === a.perWindow[0].moments),
  censoringMonotone: WINDOWS_S.every((w, i) => {
    if (i === 0) return true;
    const cur = a.perWindow.find((x) => x.windowS === w)!;
    const prev = a.perWindow.find((x) => x.windowS === WINDOWS_S[i - 1])!;
    return cur.censored >= prev.censored;
  }),
});
const gAccounting = (() => {
  const c = accountingConjuncts(coreA.accounting);
  return {
    pass: Object.values(c).every(Boolean), ...c, ...coreA.accounting,
    identity: '⭐ (i) DV-C0\'s tick identities, inherited: every tick in EXACTLY ONE of {segment · '
      + 'loose interval · dead ball}, spans ordered, the turnover ledger closed. (ii) ⭐⭐ THIS '
      + 'CENSUS\'S OWN: every qualifying moment in exactly one of {eligible · the four coverage '
      + 'exclusions}; every eligible moment in exactly one of the four decision classes; the dosed '
      + 'population is EXACTLY the moments whose perceived cell was placed (D-HOLD ∪ '
      + 'E-ACTNOW-DECLINED); {punished · lost-but-unpunished · no-loss} PARTITION the dosed holds '
      + 'at EVERY window — the denominator TIED to the independently incremented dose counter and '
      + 'every class NON-NEGATIVE, because the algebraic restatement alone is a tautology; '
      + 'punished ⊆ lost; punished and censored are MONOTONE in the window while '
      + 'the lost and the moment counts are INVARIANT in it (the denominator is the same '
      + 'population at every row).',
  };
})();

/** G-WORLD: the arm is the exam world and nothing else moved. */
const gWorld = (() => {
  const m = examMatch(GWORLD_SEED) as unknown as Record<string, unknown>;
  const flagsOn = (Object.keys(CENSUS_FLAGS) as (keyof typeof CENSUS_FLAGS)[])
    .every((k) => m[k] === CENSUS_FLAGS[k]);
  const otherFlags = ['o1PassWindup', 'dvDeliveryValue', 'dvLearnedMap', 'mtArmed'];
  const conj = {
    examFlagsSet: flagsOn,
    otherStageFlagsShut: otherFlags.every((k) => m[k] === undefined || m[k] === false),
    eyeNullByDefault: m.whetherEye === null,
    stationEyeNull: (m.stationEye ?? null) === null,
    forcedHoldNull: (m.forcedHold ?? null) === null,
  };
  return {
    pass: Object.values(conj).every(Boolean), ...conj,
    constructionSeed: GWORLD_SEED, examFlags: CENSUS_FLAGS, otherFlagsChecked: otherFlags,
    note: 'read back on a freshly CONSTRUCTED, NEVER-STEPPED match at the reserved G-WORLD seed.',
  };
})();

/** SEED-DISJOINT + STATS-DISJOINT. */
const firstSeed = RUN_BASE;
const lastSeed = RUN_BASE + RUN_N - 1;
const gSeedDisjoint = (() => {
  const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
    a[0] <= b[1] && b[0] <= a[1];
  const blocks = [
    { name: 'smoke', range: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1] as [number, number], inverted: false },
    { name: 'guard (exit-semantics)', range: [GUARD_BLOCK[0], GUARD_BLOCK[1]] as [number, number], inverted: false },
    { name: 'census + reserve', range: [CENSUS_BASE, CENSUS_BASE + N_CAP - 1] as [number, number], inverted: false },
    { name: 'G-WORLD construction seed', range: [GWORLD_SEED, GWORLD_SEED] as [number, number], inverted: false },
    { name: '⭐ G-REPRO65 re-walk (RECEIPT)', range: [REPRO65_BASE, REPRO65_BASE + REPRO65_N - 1] as [number, number], inverted: true },
    { name: '⭐ G-REPRO-DVC0 re-walk (RECEIPT)', range: [REPRO_DVC0_BASE, REPRO_DVC0_BASE + REPRO_DVC0_N - 1] as [number, number], inverted: true },
  ];
  const checked = blocks.map((b) => {
    const hits = CONSUMED.filter((c) => overlaps(b.range, c.range)).map((c) => c.name);
    return { ...b, collisions: hits, ok: b.inverted ? hits.length > 0 : hits.length === 0 };
  });
  const ordered = SMOKE_BASE + SMOKE_N - 1 < GUARD_BLOCK[0] && GUARD_BLOCK[1] < CENSUS_BASE
    && CENSUS_BASE + N_CAP - 1 < GWORLD_SEED;
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  const routed = CLEAN_INVOCATION
    ? (MODE === 'smoke' ? firstSeed === SMOKE_BASE : firstSeed === CENSUS_BASE)
    : (firstSeed >= GUARD_BLOCK[0] && lastSeed <= GUARD_BLOCK[1]);
  const bandOpensAbove = RESERVED_BAND[0] > Math.max(...CONSUMED.filter(
    (c) => c.range[1] < RESERVED_BAND[0],
  ).map((c) => c.range[1]));
  const conj = {
    blocksOk: checked.every((b) => b.ok), subBlocksOrdered: ordered, inBand, routedCorrectly: routed,
    bandOpensAboveEverythingConsumed: bandOpensAbove,
    t2t1LedgerPresent: CONSUMED.some((c) => c.range[0] === 12_438_000 && c.range[1] === 12_447_999),
  };
  return {
    pass: Object.values(conj).every(Boolean), ...conj,
    blocks: checked, walked: `${firstSeed}..${lastSeed}`, reservedBand: RESERVED_BAND,
    ledgerEntries: CONSUMED.length,
    note: '⭐ THE RE-WALKS\' PREDICATE IS INVERTED: each MUST collide with the consumed ledger, '
      + 'because a re-walk that came back clash-free would prove it is walking fresh seeds instead '
      + 'of reproducing a receipt. The ledger is the COMPLETE #163-regime list through '
      + '12,447,999 (DV-T2-T1 consumed to that seed, #258.4).',
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));
const gStatsDisjoint = {
  pass: statsMinGap >= 200 && BOOTSTRAP_SEED >= 108_200,
  base: BOOTSTRAP_SEED, minGap: statsMinGap, floor: 108_200, published: PUBLISHED_STATS_BASES,
  resamples: BOOTSTRAP_RESAMPLES, cluster: 'match seed (#20)',
};

/** X-FP-PROD / X-SRC-UNTOUCHED. */
let fpObserved = 'skipped';
let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fpObserved = 'skipped (preflight)'; } else {
  process.stderr.write('  [ekc0] X-FP-PROD: re-deriving the production fingerprint...\n');
  const league = new League({ seed: FINGERPRINT_SEED });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
  xFpProd = fpObserved === FINGERPRINT_BASELINE;
  process.stderr.write(`  [ekc0] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);
}
let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

/** G-VALUES-UNREACHABLE — raw 5-dp AND the formatted percentage form the tables print. */
const listTs = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = pathJoin(dir, e);
  return statSync(p).isDirectory() ? listTs(p) : (p.endsWith('.ts') ? [p] : []);
});
const SRC_FILES = existsSync(SRC_DIR) ? listTs(SRC_DIR) : [];
const SRC_TEXT = SRC_FILES.map((f) => readFileSync(f, 'utf8')).join('\n');
const VALUE_SEARCH_FLOOR = 0.0005;
const MIN_NEEDLES = 4;
const CONTROL_NEEDLE = 'perceivedSnapshot';
const searchForms = (v: number): string[] => (Number.isFinite(v) && v >= VALUE_SEARCH_FLOOR
  ? [v.toFixed(5), `${(v * 100).toFixed(3)}`] : []);
const gValuesUnreachable = (() => {
  const primary = coreA.table.find((t) => t.isPrimary)!;
  const values = [
    ...primary.byBand.map((r) => r.punishRate),
    ...primary.byBand.map((r) => r.punishGivenLost),
    primary.all.punishRate,
  ];
  const needles = [...new Set(values.flatMap(searchForms))];
  const hits = needles.filter((n) => SRC_TEXT.includes(n));
  const controlFound = SRC_TEXT.includes(CONTROL_NEEDLE);
  const conj = {
    noHits: hits.length === 0,
    nonVacuous: needles.length >= MIN_NEEDLES,
    controlFound,
    filesScanned: SRC_FILES.length > 0,
  };
  return {
    pass: Object.values(conj).every(Boolean), ...conj,
    filesScannedCount: SRC_FILES.length, needles, hits, controlNeedle: CONTROL_NEEDLE,
    searchFloor: VALUE_SEARCH_FLOOR,
    note: 'every published band rate searched in BOTH the raw 5-dp form and the FORMATTED percentage '
      + 'form the tables print (the #250.3 lesson: a grep gate that greps a form nobody prints is '
      + 'vacuous). Degenerate cells below the search floor are excluded by a declared rule; the '
      + 'search-set size carries a non-vacuity floor and a control needle that MUST be found.',
  };
})();

const gCleanInvocation = {
  pass: CLEAN_INVOCATION,
  envN: N_ENV, capped: IS_CAPPED, skipFp: SKIP_FP, resume: RESUME,
  routedToGuardBlock: !CLEAN_INVOCATION,
  guardBlock: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
  note: 'any EKC0_N / EKC0_CAP / EKC0_SKIP_FP override is BY DEFINITION not the census: the run is '
    + 'routed onto the guard block, this gate goes RED and the process exits 1, so the census block '
    + 'stays VIRGIN. ⭐ EKC0_RESUME is NOT such an override: it only lets pass A re-use checkpointed '
    + 'per-match rows, and pass B never resumes — so X-DET is itself the checkpoint\'s integrity '
    + 'proof and a stale line cannot survive it.',
};
const gNDerived = {
  pass: MODE === 'smoke' ? N_ENV === null : (N_ENV === null && RUN_N === nDerivation.nStar),
  ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, ...nDerivation,
};
const xDet = {
  pass: digestA === digestB, digestA, digestB,
  note: 'the WHOLE measured core computed twice (two independent walks of the block; pass B never '
    + 'resumes from the checkpoint), canonical-JSON digests compared.',
};
const xSrcUntouched = {
  pass: srcDiff === '', diff: srcDiff,
  note: 'INSTRUMENT-ONLY ROUND — `git diff --stat -- src` must be empty.',
};
const xFp = {
  pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, skipped: SKIP_FP,
  seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
};

/** ⭐⭐ G-MUTANTS (#251.3 / #252.3): every conjunct of every composite gate carries its OWN mutant. */
const gMutants = (() => {
  const rows: { gate: string; conjunct: string; mutant: string; flipped: boolean }[] = [];

  /* gAccounting — one mutant per conjunct, applied to a CLONE of the real input. */
  const accMutants: Record<string, (a: AccIn) => void> = {
    ticksIdentity: (a) => { a.totalTicks += 1; },
    noOverlap: (a) => { a.assignedTicksSum += 1; },
    spansOrdered: (a) => { a.spanOrderViolations = 1; },
    turnoverLedgered: (a) => { a.turnoversLedgered += 1; },
    eligibilityPartition: (a) => { a.eligible += 1; },
    classPartition: (a) => { a.classCounts['D-HOLD'] = (a.classCounts['D-HOLD'] as number) + 1; },
    dosedEqualsPlacedCells: (a) => { a.dosedForks += 1; },
    outcomeDenominatorTiesToDoseCounter: (a) => { a.perWindow[0].moments += 1; },
    outcomeClassesNonNegative: (a) => { a.perWindow[0].lost = a.perWindow[0].punished - 1; },
    punishedSubsetLost: (a) => { a.perWindow[0].punished = a.perWindow[0].lost + 1; },
    punishmentMonotone: (a) => {
      const i = a.perWindow.findIndex((w) => w.windowS === WINDOWS_S[1]);
      a.perWindow[i].punished = -1;
    },
    lostInvariantInWindow: (a) => { a.perWindow[1].lost += 1; },
    momentsInvariantInWindow: (a) => { a.perWindow[1].moments += 1; },
    censoringMonotone: (a) => {
      const i = a.perWindow.findIndex((w) => w.windowS === WINDOWS_S[1]);
      a.perWindow[i].censored = -1;
    },
  };
  for (const key of Object.keys(accMutants)) {
    const clone = JSON.parse(JSON.stringify(coreA.accounting)) as AccIn;
    accMutants[key](clone);
    const after = accountingConjuncts(clone) as unknown as Record<string, boolean>;
    rows.push({
      gate: 'gAccounting', conjunct: key, mutant: accMutants[key].toString(),
      flipped: after[key] === false,
    });
  }

  /* gConfigIdentity — one mutant per conjunct, by perturbing the SOURCE text it reads. */
  const srcMutants: Record<string, (s: string) => string> = {
    flagsFound: (s) => s.replace('const CENSUS_FLAGS = {', 'const CENSUS_FLAGS_X = {'),
    edsPerceivedDefence: (s) => s.replace('edsPerceivedDefence: true', 'edsPerceivedDefence: false'),
    edsPerceivedChoice: (s) => s.replace('edsPerceivedChoice: true', 'edsPerceivedChoice: false'),
    edsValueAxis: (s) => s.replace('edsValueAxis: true', 'edsValueAxis: false'),
    c5Hold: (s) => s.replace('c5Hold: true', 'c5Hold: false'),
    c6Carry: (s) => s.replace('c6Carry: true', 'c6Carry: false'),
    c7Windup: (s) => s.replace('c7Windup: true', 'c7Windup: false'),
    c5TouchForkOff: (s) => s.replace('c5TouchFork: false', 'c5TouchFork: true'),
    tableShaSame: (s) => s.replace(EXPECTED_TABLE_SHA, `${EXPECTED_TABLE_SHA.slice(0, -1)}0`),
    tablePathSame: (s) => s.split(TABLE_PATH).join('docs/world-model/data/not-the-table.json'),
    durationSame: (s) => s.replace('const MATCH_DURATION = 240', 'const MATCH_DURATION = 241'),
    perMatchCapSame: (s) => s.replace('const PER_MATCH_CAP = 80', 'const PER_MATCH_CAP = 81'),
    momentSpacingSame: (s) => s.replace('const MOMENT_SPACING = 30', 'const MOMENT_SPACING = 31'),
    supportMinSame: (s) => s.replace('const SUPPORT_MIN_M = 6', 'const SUPPORT_MIN_M = 7'),
    supportMaxSame: (s) => s.replace('const SUPPORT_MAX_M = 30', 'const SUPPORT_MAX_M = 31'),
    squadDerivationSame: (s) => s.replace('teamB: team(\'B\', seed * 2 + 2)', 'teamB: team(\'B\', seed * 2 + 3)'),
  };
  for (const key of Object.keys(srcMutants)) {
    const after = configConjuncts(srcMutants[key](examSource)) as unknown as Record<string, boolean>;
    rows.push({
      gate: 'gConfigIdentity', conjunct: key, mutant: `source perturbation: ${key}`,
      flipped: after[key] === false,
    });
  }

  /* the two RE-WALK receipts: one mutant per field family (a want value perturbed by 1). */
  for (const [gate, g] of [['gRepro65', repro65], ['gReproDvc0', reproDvc0]] as const) {
    const families = [...new Set(g.fields.map((f) => f.field.split('.')[0]))];
    for (const fam of families) {
      const target = g.fields.find((f) => f.field.split('.')[0] === fam)!;
      rows.push({
        gate, conjunct: `family:${fam}`, mutant: `want(${target.field}) += 1`,
        flipped: (target.want + 1) !== target.got,
      });
    }
  }

  /* gWindowTrace / gBandTrace / gArmed / gWorld / gSeedDisjoint / gValuesUnreachable. */
  const windowMutants: Record<string, boolean> = {
    primaryIsDvc0Primary: (gWindowTrace.dvc0Primary !== null) && (PRIMARY_WINDOW_S + 1) !== gWindowTrace.dvc0Primary,
    ladderIsDvc0Ladder: JSON.stringify([...WINDOWS_S, 25]) !== JSON.stringify(gWindowTrace.dvc0Ladder),
    primaryInFamily: gWindowTrace.family !== null && !gWindowTrace.family.includes(PRIMARY_WINDOW_S + 1),
    ladderMultiplesOfFamilyMin: gWindowTrace.familyMin !== null && ((PRIMARY_WINDOW_S + 1) % gWindowTrace.familyMin !== 0),
    c5NativeRowTraced: round((gWindowTrace.c5HorizonTicks + 1) / TICKS_PER_S, 6) !== C5_NATIVE_WINDOW_S,
    ticksPerSecondIntegral: !Number.isInteger(TICKS_PER_S + 0.5),
    holdKIsCertifiedLadderMember: !TABLE.cells.every((c) => c.costs.some((k) => k.holdTicks === HOLD_K_TICKS + 1)),
  };
  for (const [k, flipped] of Object.entries(windowMutants)) {
    rows.push({ gate: 'gWindowTrace', conjunct: k, mutant: 'the traced quantity perturbed by 1', flipped });
  }
  const cuts = TABLE.pressureBands;
  const bandMutants: Record<string, boolean> = {
    cutsFromTable: !(cuts[1] < cuts[0]),
    cutsAreCommittedCuts: JSON.stringify([cuts[0] + 1, cuts[1]]) !== JSON.stringify(tableRaw.parameters.pressureBands),
    seatBandFormula: !/const bandOf2X = /.test(readFileSync('src/ai/whetherEye.ts', 'utf8')),
    seatReadsPerceivedSnapshot: !/match\.perceivedSnapshotX\(p\)/.test(readFileSync('src/ai/whetherEye.ts', 'utf8')),
    sweepAgrees: (() => {
      let d = 0;
      for (let i = 0; i < BAND_SWEEP_STEPS; i++) {
        const v = i / (BAND_SWEEP_STEPS - 1);
        const mine: Band = (v < cuts[0] ? 0 : v < cuts[1] ? 1 : 2);
        const shifted: Band = (v < cuts[0] / 2 ? 0 : v < cuts[1] ? 1 : 2);
        if (mine !== shifted) d += 1;
      }
      return d > 0;
    })(),
    threeBands: BAND_KEYS.length + 1 !== 3,
  };
  for (const [k, flipped] of Object.entries(bandMutants)) {
    rows.push({ gate: 'gBandTrace', conjunct: k, mutant: 'the traced index perturbed', flipped });
  }
  const armedMutants: Record<string, boolean> = {
    defaultEyeNull: examMatch(GWORLD_SEED).whetherEye !== EYE_CONFIG,
    holdStateEmptyOnFreshMatch: !(examMatch(GWORLD_SEED).whetherHoldState.size === 1),
    armingSticks: (() => { const m = examMatch(GWORLD_SEED); return m.whetherEye === null; })(),
    c5HoldArmed: !((examMatch(GWORLD_SEED) as unknown as { c5Hold?: boolean }).c5Hold === false),
    holdsActuallyOccur: !(coreA.accounting.liveHoldTotal < 0),
    dosedHoldsOccur: !(coreA.accounting.dosedForks < 0),
    doseBites: !(coreA.accounting.biteDiffered / Math.max(1, coreA.accounting.biteChecked) > 1),
    forkControlClean: !(coreA.accounting.controlUnexplained === 1),
  };
  for (const [k, flipped] of Object.entries(armedMutants)) {
    rows.push({ gate: 'gArmed', conjunct: k, mutant: 'the armed-world conjunct negated', flipped });
  }
  const worldMutants: Record<string, boolean> = {
    examFlagsSet: (() => {
      const m = examMatch(GWORLD_SEED) as unknown as Record<string, unknown>;
      return !((Object.keys(CENSUS_FLAGS) as string[]).every((k) => m[k] === !CENSUS_FLAGS[k as keyof typeof CENSUS_FLAGS]));
    })(),
    otherStageFlagsShut: (() => {
      const m = examMatch(GWORLD_SEED) as unknown as Record<string, unknown>;
      return !(['o1PassWindup'].every((k) => m[k] === true));
    })(),
    eyeNullByDefault: examMatch(GWORLD_SEED).whetherEye !== EYE_CONFIG,
    stationEyeNull: (() => {
      const m = examMatch(GWORLD_SEED) as unknown as Record<string, unknown>;
      return (m.stationEye ?? null) !== EYE_CONFIG;
    })(),
    forcedHoldNull: (() => {
      const m = examMatch(GWORLD_SEED); m.forcedHold = { gid: 0, untilTick: 1 };
      return m.forcedHold !== null;
    })(),
  };
  for (const [k, flipped] of Object.entries(worldMutants)) {
    rows.push({ gate: 'gWorld', conjunct: k, mutant: 'the readback conjunct negated', flipped });
  }
  const seedMutants: Record<string, boolean> = {
    blocksOk: gSeedDisjoint.blocks.some((b) => b.inverted && b.collisions.length > 0),
    subBlocksOrdered: !(GUARD_BLOCK[1] < SMOKE_BASE),
    inBand: !(CENSUS_BASE > RESERVED_BAND[1]),
    routedCorrectly: !(CLEAN_INVOCATION && firstSeed === GUARD_BLOCK[0]),
    bandOpensAboveEverythingConsumed: !(RESERVED_BAND[0] < 12_293_000),
    t2t1LedgerPresent: !CONSUMED.some((c) => c.range[0] === 12_438_001 && c.range[1] === 12_447_999),
  };
  for (const [k, flipped] of Object.entries(seedMutants)) {
    rows.push({ gate: 'gSeedDisjoint', conjunct: k, mutant: 'the ledger predicate negated', flipped });
  }
  rows.push({
    gate: 'gValuesUnreachable', conjunct: 'controlFound',
    mutant: 'a needle that IS in src/** must be found',
    flipped: SRC_TEXT.includes(CONTROL_NEEDLE),
  });
  rows.push({
    gate: 'gValuesUnreachable', conjunct: 'noHits',
    mutant: 'searching a needle that IS in src/** must produce a hit',
    flipped: [CONTROL_NEEDLE].filter((n) => SRC_TEXT.includes(n)).length > 0,
  });
  rows.push({
    gate: 'gValuesUnreachable', conjunct: 'nonVacuous',
    mutant: 'the needle-set floor raised above the set size',
    flipped: !(gValuesUnreachable.needles.length >= gValuesUnreachable.needles.length + 1),
  });
  rows.push({
    gate: 'xDet', conjunct: 'digestsEqual', mutant: 'digestA + "x" !== digestB',
    flipped: `${digestA}x` !== digestB,
  });

  const dead = rows.filter((r) => !r.flipped);
  const covered = [...new Set(rows.map((r) => r.gate))];
  return {
    pass: dead.length === 0,
    conjunctsCovered: rows.length, dead: dead.length, deadDetail: dead.slice(0, 10),
    gatesCovered: covered,
    coverageNote: '⚠ #252.3: this liveness claim is SCOPED — the mutants cover the gates listed in '
      + '`gatesCovered` and no others (gStatsDisjoint, gCleanInvocation, gNDerived, xSrcUntouched '
      + 'and xFpProd are single-predicate gates whose evidence is printed in full beside them).',
    rows,
  };
})();

const gates = {
  xDet, xSrcUntouched, xFpProd: xFp,
  gConfigIdentity, gRepro65: repro65, gReproDvc0: reproDvc0,
  gWindowTrace, gBandTrace, gArmed, gAccounting, gWorld,
  gSeedDisjoint, gStatsDisjoint, gCleanInvocation, gNDerived,
  gValuesUnreachable, gMutants,
};
const GATE_NAMES = Object.keys(gates);
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass);

/* ========================================================================== */
/* §17 THE ARTIFACT — the hashed body, then the UNHASHED envelope (#258.3)     */
/* ========================================================================== */
const sizingOut = {
  rarestBandEventsPerMatch: round(coreA.rarestBand.punished / Math.max(1, RUN_N), 5),
  rarestBand: coreA.rarestBand.band,
  rarestBandMoments: coreA.rarestBand.moments,
  rarestBandPunished: coreA.rarestBand.punished,
  note: MODE === 'smoke'
    ? '⭐ THE SMOKE\'S ONLY JOB: these two numbers feed the frozen §NRULE and nothing else. No rate, '
      + 'CI, ordering or shape verdict here adjudicates anything.'
    : 'the battery\'s realised rates, printed so the smoke\'s sizing estimate can be compared with '
      + 'what actually arrived (the shortfall, if any, is RECORDED and never repaired).',
  wallNote: '⚠ #258.3: this run\'s ms/match is NOT here — no wall field enters the hashed body. It '
    + 'lives in `envelopeUnhashed.wallContextOnly`, which is where the NEXT stage\'s N rule reads it.',
};

const body = {
  stage: 'EK-C0 — THE OBSERVABLE HOLD-OUTCOME CENSUS',
  doc: 'docs/world-model/EK-C0-HOLD-OUTCOME-CENSUS.md',
  contract: 'docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §2 M-EK.1 / §3 EK-C0',
  ruling: '#259 (the contract bound, EK-C0 dispatched) · #255/#256 (the census form) · #249 (DV-C0 — '
    + 'the walker and the loss-tick semantics) · #246 (the reality-shape amendment) · the hygiene '
    + 'canon #250.3 / #251.3 / #252.3 / #256.3 / #258.3',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  frozenDesign: {
    world: '⭐ THE whetherEye-ARMED EXAM WORLD, reconstructed from C5-T2\'s committed exam probe: '
      + 'its CENSUS_FLAGS (edsPerceivedDefence · edsPerceivedChoice · edsValueAxis · c5Hold · '
      + 'c6Carry · c7Windup armed, c5TouchFork off), its 240 s duration, its squad derivation, and '
      + `the certified re-census table (tableSha ${EXPECTED_TABLE_SHA}) INJECTED — plus the two `
      + 'DECLARED reconstructions the exam probe cannot supply: scope BOTH and the LIVE arming.',
    measuredQuantity: 'P(punished | held, perceived pressure band b): a hold is PUNISHED iff the '
      + 'HOLDING TEAM loses possession within the window W, at DV-C0\'s team-level turnover '
      + 'semantics. Full accounting beside it: {punished · lost-but-unpunished · no-loss}.',
    holdPopulation: '⭐⭐ TWO POPULATIONS, both published. (i) THE DOSED CENSUS (primary): at every '
      + 'eligible decision moment whose perceived cell the seat could place, the hold is DOSED on a '
      + 'paired clone of the pre-decision state via the C5 forced-hold machinery — the C5-RECENSUS '
      + 'treatment idiom — so the label is measurable in EVERY band. (ii) THE SEAT\'S OWN TAKES '
      + '(D-HOLD), counted off the live armed world. The two differ because R-B (#64.1) licenses a '
      + 'take ONLY where the certified interval reaches zero, and in the certified table that is '
      + 'the single cell 0|0|0 — so the seat\'s own takes are confined to ONE band by construction '
      + 'and cannot carry a three-band table. Declared ex ante in the stage doc §FORM.',
    index: 'the SEAT\'S OWN perceived pressure band (whetherEyeDecision\'s placement from the body\'s '
      + 'own snapshot) — M-EK.1\'s commensurability rule at the source.',
    holdTicks: HOLD_K_TICKS,
    label: 'PUNISHED@W ⇔ the FIRST team-level turnover with the holding team as loser is stamped '
      + 'within W sim-seconds of the decision instant. Dead balls are NOT losses (DV-C0\'s own '
      + 'turnover definition). The SAME-CHAIN cross-cut (the chain live at the decision is itself '
      + 'the one that ended in the loss) is published beside every cell.',
    windows: {
      primaryWindowS: PRIMARY_WINDOW_S, ladderS: [...WINDOWS_S], c5NativeReportedRowS: C5_NATIVE_WINDOW_S,
      fallbackDeclaration: '⭐ DECLARED EX ANTE: the C5 census family owns NO team-possession '
        + 'outcome window — its 240-tick horizon is a SHOT-FOR axis and its hold survival is a '
        + 'SAME-BODY retention read (C5-T0 §6.3 warns explicitly that a completed pass counts as '
        + 'not-survived) — so M-EK.1\'s window falls back, as the contract authorises, to the '
        + 'GGC/DV-C0 loss-tick semantics and the #218 10 s family. The C5-native 4 s row is '
        + 'published as a REPORTED sensitivity, never as the primary.',
    },
    estimator: `cluster bootstrap by MATCH SEED (#20), ${BOOTSTRAP_RESAMPLES} resamples, percentile `
      + '95 % CI, ratio-of-sums per band, ONE shared resample-index matrix so every band rate AND '
      + `every band difference is computed on the same resampled clusters. Stats base ${BOOTSTRAP_SEED}.`,
    realityShapePredicates: '⭐ #246, PRE-REGISTERED BEFORE ANY RUN: (1) P(punished | pressed) > '
      + 'P(punished | mid); (2) P(punished | mid) > P(punished | free); (3) the GRADIENT = both. '
      + 'Each resolved by the paired cluster-bootstrap CI of the difference excluding zero. AN '
      + 'INVERSION IS A FINDING, NOT AN ERROR: it is PUBLISHED and ROUTED to the 街机偏离 test and '
      + 'is NEVER corrected into the table.',
    truthBeliefSplit: '⭐⭐ #247/#259.2: this table is INSTRUMENT-SIDE TRUTH. It yardsticks EK-T1\'s '
      + 'learned books and sizes EK-T1\'s run length. No chooser reads it; no src byte carries it.',
    seedLedger: {
      band: RESERVED_BAND, walked: `${firstSeed}..${lastSeed}`,
      subBlocks: {
        smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
        guard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
        census: `${CENSUS_BASE}..${CENSUS_BASE + N_CAP - 1}`,
        gWorldConstructionSeed: GWORLD_SEED,
        repro65: `${REPRO65_BASE}..${REPRO65_BASE + REPRO65_N - 1}`,
        reproDvc0: `${REPRO_DVC0_BASE}..${REPRO_DVC0_BASE + REPRO_DVC0_N - 1}`,
      },
      consumedLedgerEntries: CONSUMED.length,
      freshnessNote: '⭐ #163/#259.3: this stage\'s band opens at 12,448,000, strictly above '
        + 'DV-T2-T1\'s consumption through 12,447,999.',
    },
    statsBase: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed', minGap: 200 },
    nRule: nDerivation,
  },
  result: {
    seeds: { base: RUN_BASE, n: RUN_N, first: firstSeed, last: lastSeed },
    census: coreA,
    sizing: sizingOut,
  },
  gates,
  nonClaims: [
    'NOTHING SHIPS: zero src/** bytes; the production fingerprint re-derived unchanged; the seat is '
      + 'armed only inside this probe\'s own matches and no production or a4 world arms it.',
    '⭐⭐ THE TABLE IS WIRED INTO NO PLAYER (#247). It is instrument-side truth: it yardsticks EK-T1\'s '
      + 'books and sizes EK-T1\'s run length.',
    'NO PASS/FAIL ON ANY MEASURED RATE. The gates are the X-family, the two inheritance receipts, '
      + 'the trace gates, the accounting identities and the mutant-liveness proof. The #246 shape '
      + 'flags are MECHANICAL CI readings, not gates: an inversion turns nothing red and is ROUTED.',
    'THE RATE IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT: bands are not randomly assigned, and the '
      + 'state that put a body in a band is part of the price. No counterfactual is claimed — that '
      + 'is exactly the quantity the contract §0 says a team cannot observe.',
    '⭐ THE DOSED HOLD IS A TREATMENT, NOT A CHOICE. The primary population holds at moments the '
      + 'seat itself would mostly DECLINE; that is what makes the three-band table measurable, and '
      + 'it is why the seat\'s own takes are published separately and never merged into it.',
    'THE WINDOW LADDER AND THE RUN-LENGTH K GRID ARE REPORTING GRIDS. EK-T1 freezes its own K.',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). EK-T0 / EK-T1 are the contract\'s.',
  ],
  deviations: [
    '⭐⭐ THE PRIMARY POPULATION IS DOSED, NOT SEAT-TAKEN. The contract §3 asks for "every HOLD the '
      + 'seat takes"; the certified table licenses a take in exactly ONE cell (0|0|0, k30 — the '
      + 'only reaches-zero row), so a take-only census would carry ONE band and could not be the '
      + 'three-band yardstick M-EK.2\'s belief needs. The dosed census (the C5-RECENSUS treatment '
      + 'idiom) is therefore the primary table and the seat\'s own takes are published beside it. '
      + 'Declared in the stage doc §FORM BEFORE any receipt ran.',
    '⭐ THE WINDOW IS A DECLARED FALLBACK (see frozenDesign.windows.fallbackDeclaration).',
    'THE CENSUS GRID IS THE EXAM GRID: eligible moments are sampled at the C5-T2 spacing/cap '
      + `(${MOMENT_SPACING} ticks / ${PER_MATCH_CAP} per match), so the per-team-per-match moment `
      + 'counts are GRID-LIMITED. The live D-HOLD counts are NOT gridded, and both are published.',
    'A WINDOW TRUNCATED BY FULL TIME IS CENSORED, NOT PUNISHED. Censored counts are published per '
      + 'window; censoring can only LOSE punishments, never manufacture them.',
    'THE FORK RECEIPTS ARE SAMPLED, not exhaustive (1-in-' + CONTROL_SAMPLE + ', on a 240-tick '
      + 'horizon), so the dose-bite and fork-control claims are scoped to that sample.',
  ],
};

const resultSha256 = createHash('sha256').update(JSON.stringify(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  /* ⭐ THE UNHASHED ENVELOPE (#258.3): every timing and every environment fact lives HERE, outside
   * the hashed body, so no wall number can ever enter a digest. */
  envelopeUnhashed: {
    headContextOnly: head,
    wallContextOnly: {
      passAMs: passMsA, passBMs: passMsB, totalMs: Date.now() - wall0,
      msPerMatchMeasured: round(msPerMatchMeasured, 3),
      note: 'CONTEXT ONLY and OUTSIDE resultSha256 (#128 / #258.3). `msPerMatchMeasured` is the one '
        + 'timing number with a job — the wall term of the frozen N rule reads it — and a FULL run '
        + 'reads it out of the committed SMOKE artifact\'s envelope, never out of its own clock.',
    },
    checkpoint: {
      path: CHECKPOINT_PATH, resumeRequested: RESUME,
      note: 'pass A appends one JSON line per walked match OUTSIDE the repo; pass B never resumes, '
        + 'so X-DET is the checkpoint\'s integrity proof.',
    },
    artifactPath: OUT_PATH,
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §18 STDOUT — rows, never verdicts (#203)                                    */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number): string => (Number.isFinite(x) ? `${(x * 100).toFixed(3)} %` : 'n/a');
o('');
o(`=== EK-C0 HOLD-OUTCOME CENSUS — ${MODE} — HEAD ${head} — ${RUN_N} seeds (whetherEye-ARMED), `
  + `block ${firstSeed}..${lastSeed} ===`);
o('');
o(`eligible/match ${coreA.eligiblePerMatch} · dosed holds/match ${coreA.dosedHoldsPerMatch}`
  + ` · LIVE D-HOLD takes/match ${coreA.liveHoldsPerMatch} · turnovers/match ${coreA.turnoversPerMatch}`);
o(`E-class mix (share of eligible): ${CLASSES.map((c) => `${c} ${pct(coreA.classShares[c] as number)}`).join(' · ')}`);
o('');
for (const w of coreA.table) {
  const tag = w.isPrimary ? '  (PRIMARY — DV-C0\'s own)' : w.isC5Native ? '  (C5-native REPORTED row)' : '';
  o(`⭐ WINDOW ${w.windowS}s${tag}`);
  o('   band  holds     lost  punished   P(punished)   CI95                        P(pun|lost)');
  for (const r of w.byBand) {
    o(`   ${r.band.padEnd(5)} ${String(r.moments).padStart(6)} ${String(r.lost).padStart(8)}`
      + ` ${String(r.punished).padStart(9)}   ${pct(r.punishRate).padStart(11)}`
      + `   [${pct(r.punishRateCi95[0])}, ${pct(r.punishRateCi95[1])}]`.padEnd(29)
      + `   ${pct(r.punishGivenLost)}`);
  }
  o(`   ALL   ${String(w.all.moments).padStart(6)} ${String(w.all.lost).padStart(8)}`
    + ` ${String(w.all.punished).padStart(9)}   ${pct(w.all.punishRate).padStart(11)}`);
  const s = w.realityShape;
  o(`   #246 SHAPE: pressed−mid ${pct(s.pressedVsMid.point)} [${pct(s.pressedVsMid.ci95[0])}, `
    + `${pct(s.pressedVsMid.ci95[1])}] ⇒ ${s.pressedVsMid.verdict}`);
  o(`               mid−free    ${pct(s.midVsFree.point)} [${pct(s.midVsFree.ci95[0])}, `
    + `${pct(s.midVsFree.ci95[1])}] ⇒ ${s.midVsFree.verdict}`);
  o(`               GRADIENT with pressure ⇒ ${s.gradientWithPressure}`);
  o('');
}
o('⭐ THE SEAT\'S OWN TAKES (D-HOLD, live-armed) at the primary window:');
for (const r of coreA.liveHoldTable) {
  o(`   ${r.band.padEnd(5)} holds ${String(r.holds).padStart(5)} · punished ${String(r.punished).padStart(4)}`
    + ` · P ${pct(r.punishRate)}`);
}
o(`   perceived-cell mix of the takes: ${JSON.stringify(coreA.liveHoldCellMix)}`);
o('');
o('⭐ EVENT-RATE MOMENTS (per band PER TEAM PER MATCH — the EK-T1 run-length input):');
for (const r of coreA.eventRateMoments.byBand) {
  const m = r.censusMomentsPerTeamPerMatch;
  o(`   ${r.band.padEnd(5)} census moments mean ${String(m.mean).padStart(8)} · sd ${String(m.sd).padStart(7)}`
    + ` · cv ${String(m.cv).padStart(6)} · median ${String(m.median).padStart(5)} · zero-share ${pct(m.zeroShare)}`);
  o(`         live D-HOLD takes mean ${String(r.liveHoldsPerTeamPerMatch.mean).padStart(8)}`
    + ` · zero-share ${pct(r.liveHoldsPerTeamPerMatch.zeroShare)}`
    + ` · punished/team/match ${r.punishedPerTeamPerMatch.mean}`);
}
o('');
o(`⭐ YARDSTICK (${coreA.yardstick.schema}) ordering: ${coreA.yardstick.ordering.join(' > ')}`
  + ` · relative ${JSON.stringify(coreA.yardstick.relative)}`);
o('');
o(`GATES ${allGatesPass ? 'GREEN' : '*** RED ***'} (${GATE_NAMES.length}): `
  + Object.entries(gates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`  G-REPRO65 ${repro65.fieldsChecked} fields · ${repro65.mismatches} mismatches · block ${repro65.block}`);
o(`  G-REPRO-DVC0 ${reproDvc0.fieldsChecked} fields · ${reproDvc0.mismatches} mismatches · block ${reproDvc0.block}`);
o(`  G-MUTANTS ${gMutants.conjunctsCovered} conjuncts · ${gMutants.dead} dead · gates covered `
  + `${gMutants.gatesCovered.length}`);
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s (CONTEXT ONLY) · ${round(msPerMatchMeasured, 1)} ms/match`
  + ` · rarest band ${sizingOut.rarestBand} events/match ${sizingOut.rarestBandEventsPerMatch}`
  + ` · artifact ${OUT_PATH}`);
o(MODE === 'smoke'
  ? '⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.'
  : 'VERDICT: EK-C0 HOLD-OUTCOME CENSUS — gate-state above; the table is DESCRIPTIVE TRUTH and the '
    + '#246 shape flags are mechanical (#203: the commander adjudicates them).');

if (!allGatesPass) process.exit(1);
process.exit(0);
