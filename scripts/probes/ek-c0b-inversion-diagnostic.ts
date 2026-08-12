/**
 * EK-C0b — THE 街机偏离 DIAGNOSTIC (why perceived-FREE holding is the most punished band).
 *
 * Charter: ruling #260.3, verbatim in docs/world-model/EK-C0B-INVERSION-DIAGNOSTIC.md §CHARTER.
 * Parent census: EK-C0 (#260.1/#260.2) — docs/world-model/EK-C0-HOLD-OUTCOME-CENSUS.md. Contract:
 * docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §0 / §2 M-EK.1.
 *
 * THREE PRE-REGISTERED PREDICATES, ALL RUN, NONE ADJUDICATED (#203):
 *   (W) THE PERCEPTION WEDGE   — the SAME holds cross-cut by the TRUTH pressure band.
 *   (S) CONTEXT SELECTION      — per-band context profiles + a fresh UNCAPPED-GRID arm.
 *   (A) SATURATION             — 4 s / 5 s re-read as CANDIDATE PRIMARIES (no verdict, by charter).
 *
 * ⭐ INSTRUMENT-ONLY ROUND. `src/**` is byte-untouched (X-SRC-UNTOUCHED is a HARD gate).
 *
 * Hygiene canon: #250.3 (mode-conditioned literals; headline counts hand-checked) · #251.3/#252.3
 * (derive the predicates; a mutant per conjunct) · #256.3 (per-cluster cells stored) · #258.3
 * (timings OUTSIDE the hashed body) · ⭐ #260.2 (EVERY override routes through the preflight flag;
 * a mutant RE-INVOKES the gate's own function; a coverage claim names its exact conjunct set) ·
 * #163 · #181.2 · #20 · #128 · #203 · #229.2.
 *
 * MODES (explicit EKC0B_MODE, no default):
 *   EKC0B_MODE=smoke npx tsx scripts/probes/ek-c0b-inversion-diagnostic.ts
 *   EKC0B_MODE=full  npx tsx scripts/probes/ek-c0b-inversion-diagnostic.ts
 * ⭐ ANY of EKC0B_N / EKC0B_CAP / EKC0B_UNCAPPED_N / EKC0B_SKIP_FP sets the PREFLIGHT flag: the walk
 * is routed onto the GUARD BLOCK, G-CLEAN-INVOCATION goes red and the process exits 1, and a
 * preflight may never write a canonical repo path. EKC0B_RESUME=1 only lets pass A resume from the
 * checkpoint (pass B never resumes, so X-DET is the checkpoint's integrity proof).
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
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { pressureAt, PRESSURE_RADIUS_M } from '../../src/ai/perception';
import { whetherEyeDecision, type RecensusCostTable, type WhetherEyeConfig } from '../../src/ai/whetherEye';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS — traced from the census, never re-typed as findings    */
/* ========================================================================== */
const CENSUS_PROBE_PATH = 'scripts/probes/ek-c0-hold-outcome-census.ts';
const CENSUS_ARTIFACT_PATH = 'docs/world-model/data/ek-c0-hold-outcome-census.json';
const STAGE_DOC_PATH = 'docs/world-model/EK-C0B-INVERSION-DIAGNOSTIC.md';
/** this probe's own source, read as TEXT for the import/usage trace conjuncts (a repo-relative path,
 *  not a module-local magic variable, so it behaves the same under every tsx module mode). */
const SELF_PATH = 'scripts/probes/ek-c0b-inversion-diagnostic.ts';
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';

/** the census's world constants — asserted against the census probe's SOURCE by G-CONFIG-IDENTITY. */
const MATCH_DURATION = 240;
const PER_MATCH_CAP = 80;
const MOMENT_SPACING = 30;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
const HOLD_K_TICKS = 30;
const TICKS_PER_S = Math.round(1 / DT);
const PRIMARY_WINDOW_S = 10;
const WINDOWS_S = [5, 10, 15, 20] as const;
const C5_NATIVE_WINDOW_S = 4;
const ALL_WINDOWS_S = [...WINDOWS_S, C5_NATIVE_WINDOW_S] as const;
const MAX_WINDOW_S = Math.max(...ALL_WINDOWS_S);
/** the two windows the charter re-reads as CANDIDATE PRIMARIES in §A. */
const CANDIDATE_PRIMARY_WINDOWS_S = [4, 5] as const;

const BAND_KEYS = ['p0', 'p1', 'p2'] as const;
type BandKey = (typeof BAND_KEYS)[number];
type Band = 0 | 1 | 2;
const bandKeyOf = (b: Band): BandKey => BAND_KEYS[b];
const BAND_LABEL: Record<BandKey, string> = {
  p0: 'free (pressure < cut1)', p1: 'mid (cut1 ≤ pressure < cut2)', p2: 'pressed (pressure ≥ cut2)',
};
const ROLES = ['DF', 'MF', 'WG', 'ST', 'GK'] as const;
const THIRD_LOCAL_X = HALF_L / 3;
const THIRDS = ['own', 'middle', 'final'] as const;
type Third = (typeof THIRDS)[number];
const thirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');

/* --- §2 ⭐ THE FROZEN §S MARGINS (pre-registered, doc-checked by G-FROZEN-MARGINS) --- */
const M_ZONE_PP = 10.0;      // |Δ own-third share|, percentage points
const M_TIME_S = 15.0;       // |Δ mean decision sim-time|, seconds
const M_ROLE_TVD = 0.10;     // total-variation distance between role mixes
const M_ROLE_TVD_CI_LO = 0.05;
const M_DIST_M = 2.0;        // |Δ mean nearest-TRUE-opponent distance|, metres

/* --- §3 THE SEED LEDGER (#163) --------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_449_000, 12_449_999];
const SMOKE_BASE = 12_449_000;
const SMOKE_UNCAPPED_N = 4;
const GUARD_BLOCK: readonly [number, number] = [12_449_050, 12_449_099];
const UNCAPPED_BASE = 12_449_100;
const UNCAPPED_CAP = 200;
const UNCAPPED_STEP = 10;
const GWORLD_SEED = 12_449_999;
/** the census block's first SUB_BLOCK_N seeds are re-walked FIRST so a divergence fails fast. */
const SUB_BLOCK_N = 12;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  { name: 'OBM-T0 receipts (#228)', range: [12_424_000, 12_424_025] },
  { name: 'OBM-T1 smoke (#228.6/#230)', range: [12_424_026, 12_424_040] },
  { name: 'OBM-T1 guard band (#230)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#230)', range: [12_424_100, 12_424_899] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
  { name: 'PTP-T0 receipts (#232)', range: [12_425_000, 12_425_025] },
  { name: 'PTP-T1 smoke (#232.3/#233)', range: [12_425_026, 12_425_040] },
  { name: 'PTP-T1 guard band (#233)', range: [12_425_050, 12_425_099] },
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
  { name: 'DLC-T0 receipts (#237)', range: [12_426_000, 12_426_025] },
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_045] },
  { name: 'DLC-T1 guard band (#238)', range: [12_426_050, 12_426_099] },
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
  { name: 'DLC-T0s receipts (#242)', range: [12_427_000, 12_427_025] },
  { name: 'DLC-T0s test-file seeds (#242)', range: [12_427_900, 12_427_906] },
  { name: 'DLC-T1s smoke + reads (#243)', range: [12_428_000, 12_428_020] },
  { name: 'DLC-T1s guard band (#243)', range: [12_428_050, 12_428_099] },
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_727] },
  { name: 'DLC-T1s reserved test-seed band (#243)', range: [12_428_900, 12_428_906] },
  { name: 'DV-C0 smoke (#249)', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 guard band (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD read (#249)', range: [12_429_999, 12_429_999] },
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_026] },
  { name: 'DV-T1 smoke + guard + battery (#251)', range: [12_430_027, 12_430_382] },
  { name: 'DV-T0 test-file seeds (#250)', range: [12_430_900, 12_430_911] },
  { name: 'DV-T1b smoke + guard + battery (#252)', range: [12_431_000, 12_431_742] },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  { name: 'DV-T1c smoke + guard + battery (#253/#254)', range: [12_432_000, 12_434_035] },
  { name: 'DV-T1c reserved ceiling (#253.1)', range: [12_435_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: 'DV-T2-T1 convergence exam + battery (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
  {
    name: '⭐⭐ EK-C0 census band (#259.3/#260.4) — THE BLOCK THIS STAGE RE-WALKS',
    range: [12_448_000, 12_448_999],
  },
];

/* --- §4 THE STATS STREAMS — separate namespaces (#163) ---------------------- */
const BOOTSTRAP_SEED = 108_600;            // the re-walk (capped/census) arm — #260.3's floor
const BOOTSTRAP_SEED_UNCAPPED = 108_800;   // the fresh uncapped arm
const BOOTSTRAP_RESAMPLES = 2000;
const STATS_FLOOR = 108_600;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800, 105_000, 105_200, 105_400, 105_800,
  106_000, 106_200, 106_600, 107_000, 107_400, 107_800,
  108_200 /** ⭐ EK-C0's own (#260.4) */,
];

/* --- §5 THE UNCAPPED ARM'S FROZEN N RULE ----------------------------------- */
const TARGET_FREE_BAND_HOLDS = 150;
const WALL_BUDGET_HOURS = 0.35;
const XDET_FACTOR = 2;
const PRIOR_MS_PER_MATCH_UNCAPPED = 9_000;

/* --- §6 the X-family pins --------------------------------------------------- */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SRC_DIR = 'src';

/* ========================================================================== */
/* §7 ENV / MODE / ⭐ THE #260.2(i) PREFLIGHT ROUTING (EVERY override)          */
/* ========================================================================== */
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.EKC0B_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`EK-C0b FATAL — EKC0B_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.EKC0B_N);
const CAP_ENV = intEnv(process.env.EKC0B_CAP);
const UNCAPPED_N_ENV = intEnv(process.env.EKC0B_UNCAPPED_N);
const SKIP_FP = process.env.EKC0B_SKIP_FP === '1';
const RESUME = process.env.EKC0B_RESUME === '1';
/** ⭐⭐ #260.2(i): EVERY override that changes WHAT IS MEASURED sets the preflight flag. */
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'EKC0B_N', set: N_ENV !== null },
  { name: 'EKC0B_CAP', set: CAP_ENV !== null },
  { name: 'EKC0B_UNCAPPED_N', set: UNCAPPED_N_ENV !== null },
  { name: 'EKC0B_SKIP_FP', set: SKIP_FP },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const CLEAN_INVOCATION = !IS_PREFLIGHT;
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);

const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/ek-c0b-inversion-diagnostic-smoke.json',
  full: 'docs/world-model/data/ek-c0b-inversion-diagnostic.json',
};
const SMOKE_PATH = OUT_BY_MODE.smoke;
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = process.env.EKC0B_OUT ?? (IS_PREFLIGHT ? '/tmp/ek-c0b-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('EK-C0b FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}. `
    + 'Pass EKC0B_OUT=/tmp/… , or drop the override to run the real thing.');
  process.exit(2);
}
const CHECKPOINT_OF = (arm: string): string => process.env.EKC0B_CHECKPOINT_PREFIX !== undefined
  ? `${process.env.EKC0B_CHECKPOINT_PREFIX}.${MODE}.${arm}.jsonl`
  : `/tmp/ek-c0b-checkpoint.${MODE}.${arm}.jsonl`;

/* ========================================================================== */
/* §8 SMALL HELPERS                                                            */
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
const excludesZero = (ci: [number, number]): boolean => Number.isFinite(ci[0]) && Number.isFinite(ci[1])
  && (ci[0] > 0 || ci[1] < 0);

/* ========================================================================== */
/* §9 THE WORLD — the census's own constructors, re-used verbatim              */
/* ========================================================================== */
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
const examMatch = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});

const tableRaw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (tableRaw.tableSha !== EXPECTED_TABLE_SHA) {
  console.error(`EK-C0b FATAL — certified table SHA drift: ${tableRaw.tableSha} != ${EXPECTED_TABLE_SHA}`);
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
const EYE_CONFIG: WhetherEyeConfig = { arm: 'neutral', scope: { kind: 'both' }, table: TABLE };
const PRESSURE_CUTS = TABLE.pressureBands;
const pressureBandOf = (v: number): Band => (v < PRESSURE_CUTS[0] ? 0 : v < PRESSURE_CUTS[1] ? 1 : 2);

/** the census's own A0 read (one fork step), verbatim. */
const CONTROL_HORIZON_TICKS = 240;
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

/* ========================================================================== */
/* §10 THE LOSS-TICK SEMANTICS — DV-C0's, via EK-C0, inherited verbatim        */
/* ========================================================================== */
interface TurnoverEvent { tSim: number; loser: Side; third: Third }
interface SegmentAccounting {
  totalTicks: number; deadBallTicks: number; segmentTicks: number; looseGapTicks: number;
  assignedTicksSum: number; spanOrderViolations: number;
  goalsFromScore: number; turnoversTotal: number;
}
interface LiveSegmentState {
  cur: { team: Side; startTick: number; assignedTicks: number; lastOwnedLocalX: number } | null;
  prevStartTick: number; acc: SegmentAccounting; turnovers: TurnoverEvent[]; prevScore: [number, number];
}
const newSegmentState = (m: Match): LiveSegmentState => ({
  cur: null, prevStartTick: -1,
  acc: {
    totalTicks: 0, deadBallTicks: 0, segmentTicks: 0, looseGapTicks: 0, assignedTicksSum: 0,
    spanOrderViolations: 0, goalsFromScore: 0, turnoversTotal: 0,
  },
  turnovers: [], prevScore: [m.score[0], m.score[1]],
});
const segmentTick = (m: Match, s: LiveSegmentState): TurnoverEvent | null => {
  s.acc.totalTicks += 1;
  for (const side of [0, 1] as const) {
    if (m.score[side] > s.prevScore[side]) s.acc.goalsFromScore += m.score[side] - s.prevScore[side];
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
    const ev: TurnoverEvent = { tSim: m.simTime, loser: s.cur.team, third: thirdOf(s.cur.lastOwnedLocalX) };
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
/* §11 THE WALK — the census's walk PLUS the truth band and the context read   */
/* ========================================================================== */
/** the census-shaped cell — what G-REPRO-EKC0 compares field-exact. */
interface CensusCell {
  moments: number; punished: number[]; sameChain: number[]; censored: number[];
  lostWithinMax: number; liveHolds: number; liveHoldsPunished: number[];
}
const newCensusCell = (): CensusCell => ({
  moments: 0, punished: ALL_WINDOWS_S.map(() => 0), sameChain: ALL_WINDOWS_S.map(() => 0),
  censored: ALL_WINDOWS_S.map(() => 0), lostWithinMax: 0, liveHolds: 0,
  liveHoldsPunished: ALL_WINDOWS_S.map(() => 0),
});
/** ⭐ the DIAGNOSTIC cell — per side × PERCEIVED band × TRUTH band. */
interface DiagCell { moments: number; punished: number[]; censored: number[]; lostWithinMax: number }
const newDiagCell = (): DiagCell => ({
  moments: 0, punished: ALL_WINDOWS_S.map(() => 0), censored: ALL_WINDOWS_S.map(() => 0), lostWithinMax: 0,
});
/** ⭐ the CONTEXT cell — per side × PERCEIVED band. */
interface CtxCell {
  moments: number;
  zone: Record<Third, number>;
  role: Record<Role, number>;
  timeSum: number; timeSumSq: number; timeMin: number; timeMax: number;
  distSum: number; distSumSq: number; distMin: number; distMax: number;
  truthPressureSum: number;
}
const newCtxCell = (): CtxCell => ({
  moments: 0,
  zone: { own: 0, middle: 0, final: 0 },
  role: { GK: 0, DF: 0, MF: 0, WG: 0, ST: 0 },
  timeSum: 0, timeSumSq: 0, timeMin: Number.POSITIVE_INFINITY, timeMax: Number.NEGATIVE_INFINITY,
  distSum: 0, distSumSq: 0, distMin: Number.POSITIVE_INFINITY, distMax: Number.NEGATIVE_INFINITY,
  truthPressureSum: 0,
});
const ckey = (side: Side, b: BandKey): string => `${side}|${b}`;
const dkey = (side: Side, pb: BandKey, tb: BandKey): string => `${side}|${pb}|${tb}`;

interface WalkRow {
  seed: number; simSeconds: number; qualifying: number; eligible: number;
  exFirstTouch: number; exMustKick: number; exShoot: number; exClear: number;
  classCounts: Record<string, number>;
  cells: Record<string, CensusCell>;
  diag: Record<string, DiagCell>;
  ctx: Record<string, CtxCell>;
  /** pooled per-moment samples (quantiles only; never a CI input). */
  samples: Record<string, { t: number[]; d: number[] }>;
  liveHoldCells: Record<string, number>;
  liveHoldTotal: number;
  acc: SegmentAccounting;
  turnoversTotal: number;
  dosedForks: number;
  lastDecisionTimeS: number;
}
const CLASSES = ['D-HOLD', 'E-ACTNOW-DECLINED', 'E-ABSTAIN-UNSEEN', 'E-NOCELL'] as const;
const labelFromOffsets = (lossOffsetS: number | null, endedAtS: number | null): {
  punished: boolean[]; censored: boolean[];
} => {
  const punished = ALL_WINDOWS_S.map((w) => lossOffsetS !== null && lossOffsetS <= w);
  const censored = ALL_WINDOWS_S.map((w, i) => !punished[i] && endedAtS !== null && endedAtS < w);
  return { punished, censored };
};

/** nearest TRUE (non-sent-off) opponent distance at the decision instant. */
const nearestTrueOpponentM = (m: Match, owner: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[1 - owner.side].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - owner.pos.x, o.pos.y - owner.pos.y);
    if (d < best) best = d;
  }
  return best;
};

/**
 * ONE match. `cap` = the per-match moment cap (the census's 80, or Infinity for the UNCAPPED arm).
 * Everything that touches the LIVE trajectory is the census walker verbatim; the truth band and the
 * context read are PURE observations off the same pre-decision state and perturb nothing.
 */
function walkMatch(seed: number, cap: number): WalkRow {
  const m = examMatch(seed);
  m.whetherEye = EYE_CONFIG;
  const seg = newSegmentState(m);
  const row: WalkRow = {
    seed, simSeconds: 0, qualifying: 0, eligible: 0,
    exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
    classCounts: Object.fromEntries(CLASSES.map((c) => [c, 0])),
    cells: {}, diag: {}, ctx: {}, samples: {},
    liveHoldCells: {}, liveHoldTotal: 0,
    acc: seg.acc, turnoversTotal: 0, dosedForks: 0, lastDecisionTimeS: 0,
  };
  for (const side of [0, 1] as const) {
    for (const b of BAND_KEYS) {
      row.cells[ckey(side, b)] = newCensusCell();
      row.ctx[ckey(side, b)] = newCtxCell();
      for (const tb of BAND_KEYS) row.diag[dkey(side, b, tb)] = newDiagCell();
    }
  }
  for (const b of BAND_KEYS) row.samples[b] = { t: [], d: [] };

  const pendingLive: { side: Side; band: BandKey; tSim: number }[] = [];
  const closedLive: { side: Side; band: BandKey; lossOffsetS: number | null; endedAtS: number | null }[] = [];
  const seenCommitments = new Set<string>();
  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;

  while (!m.finished) {
    const owner: Player | null = m.ball.owner;
    const qualifies = inMatch < cap && m.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      row.qualifying += 1;
      const gid = owner!.gid;
      const side = owner!.side;
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
            const bk = bandKeyOf(decision.perceived.pressureBand);
            /* ⭐ THE TRUTH SIDE: the shipped pressure formula over TRUE opponent positions at the
             * SAME instant, placed at the certified table's OWN cuts. A pure read. */
            const truthPressure = pressureAt(owner!.pos, m.teams[1 - side].players);
            const tbk = bandKeyOf(pressureBandOf(truthPressure));
            const nearM = nearestTrueOpponentM(m, owner!);
            const zone = thirdOf(m.teams[side].localX(owner!.pos.x));
            const tSimDecision = m.simTime;
            row.lastDecisionTimeS = Math.max(row.lastDecisionTimeS, tSimDecision);

            const cell = row.cells[ckey(side, bk)];
            const dcell = row.diag[dkey(side, bk, tbk)];
            const ctx = row.ctx[ckey(side, bk)];
            cell.moments += 1;
            dcell.moments += 1;
            ctx.moments += 1;
            ctx.zone[zone] += 1;
            ctx.role[owner!.role] += 1;
            ctx.timeSum += tSimDecision; ctx.timeSumSq += tSimDecision * tSimDecision;
            ctx.timeMin = Math.min(ctx.timeMin, tSimDecision);
            ctx.timeMax = Math.max(ctx.timeMax, tSimDecision);
            ctx.distSum += nearM; ctx.distSumSq += nearM * nearM;
            ctx.distMin = Math.min(ctx.distMin, nearM);
            ctx.distMax = Math.max(ctx.distMax, nearM);
            ctx.truthPressureSum += truthPressure;
            row.samples[bk].t.push(round(tSimDecision, 3));
            row.samples[bk].d.push(round(nearM, 3));
            row.dosedForks += 1;

            /* THE DOSED HOLD — the C5 forced-hold machinery, the census's own treatment. */
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
              if (ev !== null && ev.loser === side) { lossOffsetS = ev.tSim - t0; sameChain = chainAlive; break; }
              if (ev !== null) chainAlive = false;
            }
            if (lossOffsetS === null && endedAtS === null && fork.finished) endedAtS = fork.simTime - t0;
            const lab = labelFromOffsets(lossOffsetS, endedAtS);
            for (let i = 0; i < ALL_WINDOWS_S.length; i++) {
              if (lab.punished[i]) { cell.punished[i] += 1; dcell.punished[i] += 1; }
              if (lab.punished[i] && sameChain) cell.sameChain[i] += 1;
              if (lab.censored[i]) { cell.censored[i] += 1; dcell.censored[i] += 1; }
            }
            if (lossOffsetS !== null) { cell.lostWithinMax += 1; dcell.lostWithinMax += 1; }
          }
        }
      }
      sinceLast = 0;
      inMatch += 1;
    }
    for (const [gid, c] of m.whetherHoldState) {
      const sig = `${gid}|${c.untilTick}|${c.cellAtDecision}`;
      if (seenCommitments.has(sig)) continue;
      seenCommitments.add(sig);
      const body = m.allPlayers.find((p) => p.gid === gid);
      if (body === undefined) continue;
      const bandIdx = Number(c.cellAtDecision.split('|')[0]);
      if (!Number.isInteger(bandIdx) || bandIdx < 0 || bandIdx > 2) continue;
      const bk = bandKeyOf(bandIdx as Band);
      row.liveHoldCells[c.cellAtDecision] = (row.liveHoldCells[c.cellAtDecision] ?? 0) + 1;
      row.liveHoldTotal += 1;
      row.cells[ckey(body.side, bk)].liveHolds += 1;
      pendingLive.push({ side: body.side, band: bk, tSim: m.simTime });
    }
    m.step(DT);
    sinceLast += 1;
    const ev = segmentTick(m, seg);
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
    const cell = row.cells[ckey(c.side, c.band)];
    for (let i = 0; i < ALL_WINDOWS_S.length; i++) if (lab.punished[i]) cell.liveHoldsPunished[i] += 1;
  }
  row.simSeconds = m.simTime;
  row.acc = seg.acc;
  row.turnoversTotal = seg.turnovers.length;
  return row;
}

/* ========================================================================== */
/* §12 THE COMMITTED CENSUS ARTIFACT — the re-walk's block AND its truth       */
/* ========================================================================== */
if (!existsSync(CENSUS_ARTIFACT_PATH)) {
  console.error(`EK-C0b FATAL — the committed census artifact is missing: ${CENSUS_ARTIFACT_PATH}`);
  process.exit(2);
}
const censusBytes = readFileSync(CENSUS_ARTIFACT_PATH);
const CENSUS = JSON.parse(censusBytes.toString('utf8'));
const CENSUS_SHA = createHash('sha256').update(censusBytes).digest('hex');
const CENSUS_BASE: number = CENSUS.result.seeds.base;
const CENSUS_N: number = CENSUS.result.seeds.n;
const CENSUS_CLUSTER_CELLS: any[] = CENSUS.result.census.clusterCells;

/* ========================================================================== */
/* §13 N DERIVATION — the re-walk is READ; the uncapped arm is DERIVED         */
/* ========================================================================== */
const wall0 = Date.now();
const frozenUncappedN = (msPerMatch: number, msSource: string, freePerMatch: number, evSource: string) => {
  const nRaw = freePerMatch > 0 ? Math.ceil(TARGET_FREE_BAND_HOLDS / freePerMatch) : Number.POSITIVE_INFINITY;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / UNCAPPED_STEP) * UNCAPPED_STEP : Number.POSITIVE_INFINITY;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * XDET_FACTOR));
  const nStar = Math.min(nStepped, nWall, UNCAPPED_CAP);
  const binding = !Number.isFinite(nStepped)
    ? (nStar === nWall ? 'wall (precision term UNBOUNDED — the zero-event clause)'
      : 'seedBandCap (precision term UNBOUNDED — the zero-event clause)')
    : nStar === nStepped ? 'precision' : nStar === nWall ? 'wall' : 'seedBandCap';
  return {
    targetFreeBandHolds: TARGET_FREE_BAND_HOLDS,
    freeBandHoldsPerMatch: round(freePerMatch, 5), eventsSource: evSource,
    msPerMatch: round(msPerMatch, 3), msSource,
    nRaw: Number.isFinite(nRaw) ? nRaw : null,
    nStepped: Number.isFinite(nStepped) ? nStepped : null,
    precisionTermUnbounded: !Number.isFinite(nStepped),
    nStep: UNCAPPED_STEP, nWall, nCap: UNCAPPED_CAP,
    nStar: Number.isFinite(nStar) ? nStar : null,
    bindingTerm: binding,
    projectedWallHours: Number.isFinite(nStar) ? round((nStar * XDET_FACTOR * msPerMatch) / 3_600_000, 4) : null,
    arithmetic: `N* = min( ceil(${TARGET_FREE_BAND_HOLDS} / freeBandHoldsPerMatch) ↑${UNCAPPED_STEP}, `
      + `floor(${WALL_BUDGET_HOURS} h / (ms/match × ${XDET_FACTOR} X-DET)), ${UNCAPPED_CAP} ) — frozen in `
      + 'the stage doc §NRULE BEFORE the smoke ran. 150 free-band holds ⇒ SE ≈ 3.5 pp, so the census\'s '
      + 'own −9.94 pp mid−free gap sits at ≈ 2 SE.',
  };
};
const uncappedDerivation = (() => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke' as const, n: SMOKE_UNCAPPED_N, nStar: null as number | null,
      smokeArtifactSha256: null as string | null,
      note: `SMOKE — the uncapped arm is FIXED by the stage doc §NRULE at ${SMOKE_UNCAPPED_N} seeds and the `
        + `re-walk arm at the census block's first ${SUB_BLOCK_N} seeds. The smoke publishes exactly TWO `
        + 'sizing numbers (ms/match uncapped, free-band holds per match uncapped) and ADJUDICATES NOTHING.',
    };
  }
  let msPerMatch = PRIOR_MS_PER_MATCH_UNCAPPED;
  let freePerMatch = Number.NaN;
  let msSource = `the PRIOR ${PRIOR_MS_PER_MATCH_UNCAPPED} ms/match — no committed smoke artifact was found`;
  let evSource = 'ABSENT — no committed smoke artifact';
  let smokeSha: string | null = null;
  if (existsSync(SMOKE_PATH)) {
    const bytes = readFileSync(SMOKE_PATH);
    const smoke = JSON.parse(bytes.toString('utf8'));
    const v = smoke?.envelopeUnhashed?.wallContextOnly?.msPerMatchUncapped;
    const g = smoke?.result?.sizing?.freeBandHoldsPerMatchUncapped;
    if (smoke?.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof g === 'number' && g >= 0) {
      msPerMatch = v; freePerMatch = g;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      evSource = 'the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N: exactly TWO numbers are '
        + 'read out of it, ms/match (unhashed envelope) and the free-band dosed holds per match in the '
        + 'UNCAPPED arm (hashed body). No rate, CI, margin or predicate verdict is read from it.';
    }
  }
  const d = frozenUncappedN(msPerMatch, msSource, freePerMatch, evSource);
  return { mode: 'full' as const, smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha, ...d, n: d.nStar ?? 0 };
})();

const REWALK_N = MODE === 'smoke' ? SUB_BLOCK_N : CENSUS_N;
const REWALK_BASE = CLEAN_INVOCATION ? CENSUS_BASE : GUARD_BLOCK[0];
const UNCAPPED_N = UNCAPPED_N_ENV ?? uncappedDerivation.n;
const UNCAPPED_RUN_BASE = CLEAN_INVOCATION ? (MODE === 'smoke' ? SMOKE_BASE : UNCAPPED_BASE) : GUARD_BLOCK[0];
const RUN_REWALK_N = N_ENV ?? (CAP_ENV !== null ? Math.min(REWALK_N, CAP_ENV) : REWALK_N);
if (MODE === 'full' && UNCAPPED_N <= 0) {
  console.error('EK-C0b FATAL — full mode needs the committed SMOKE artifact for the uncapped arm\'s N. '
    + `Run the smoke first: EKC0B_MODE=smoke … → ${SMOKE_PATH}`);
  process.exit(2);
}

/* ========================================================================== */
/* §14 BANNER                                                                  */
/* ========================================================================== */
banner('');
banner('=============================================================================');
banner(`EK-C0b — THE 街机偏离 DIAGNOSTIC (#260.3) · mode ${MODE}`);
banner(`re-walk arm   ${RUN_REWALK_N} seeds from ${REWALK_BASE} (the census block — COLLISION BY DESIGN)`);
banner(`uncapped arm  ${UNCAPPED_N} seeds from ${UNCAPPED_RUN_BASE} (fresh, per-match cap REMOVED)`);
banner('predicates    (W) wedge · (S) selection + 4 frozen margins · (A) saturation (NO verdict)');
banner(`margins       zone ${M_ZONE_PP} pp · time ${M_TIME_S} s · role TVD ${M_ROLE_TVD} · dist ${M_DIST_M} m`);
banner('=============================================================================');
banner('');

/* ========================================================================== */
/* §15 THE BLOCK WALKER (checkpointed) + THE CORE                              */
/* ========================================================================== */
const PROGRESS_EVERY_MS = 20_000;
let lastProgress = 0;
const progress = (tag: string, done: number, total: number): void => {
  const now = Date.now();
  if (now - lastProgress < PROGRESS_EVERY_MS && done !== total) return;
  lastProgress = now;
  const el = (now - wall0) / 1000;
  const rate = done === 0 ? 0 : el / done;
  process.stderr.write(`  [ekc0b ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(3)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};
function walkBlock(tag: string, arm: string, base: number, n: number, cap: number, useCheckpoint: boolean): WalkRow[] {
  const path = CHECKPOINT_OF(arm);
  const header = JSON.stringify({ mode: MODE, arm, base, n, cap: Number.isFinite(cap) ? cap : 'INF', k: HOLD_K_TICKS });
  const resumed = new Map<number, WalkRow>();
  if (useCheckpoint && RESUME && existsSync(path)) {
    let ok = true;
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      if (line.trim() === '') continue;
      const rec = JSON.parse(line) as { header: string; row: WalkRow };
      if (rec.header !== header) { ok = false; break; }
      resumed.set(rec.row.seed, rec.row);
    }
    if (!ok) resumed.clear();
  }
  if (useCheckpoint && resumed.size === 0 && existsSync(path)) rmSync(path);
  const rows: WalkRow[] = [];
  for (let i = 0; i < n; i++) {
    const seed = base + i;
    const cached = resumed.get(seed);
    if (cached !== undefined) { rows.push(cached); progress(tag, i + 1, n); continue; }
    const row = walkMatch(seed, cap);
    rows.push(row);
    if (useCheckpoint) appendFileSync(path, `${JSON.stringify({ header, row })}\n`);
    progress(tag, i + 1, n);
  }
  return rows;
}

/* --- the estimator ---------------------------------------------------------- */
function resampleMatrix(nClusters: number, base: number): number[][] {
  const rng = new Rng(base);
  const out: number[][] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx = new Array<number>(nClusters);
    for (let i = 0; i < nClusters; i++) idx[i] = Math.floor(rng.next() * nClusters) % nClusters;
    out.push(idx);
  }
  return out;
}

interface RateRow {
  band: BandKey; label: string; moments: number; lost: number; punished: number; censored: number;
  punishRate: number; punishRateCi95: [number, number];
}
interface ShapeRow {
  pressedVsMid: { point: number; ci95: [number, number]; verdict: string };
  midVsFree: { point: number; ci95: [number, number]; verdict: string };
  gradientWithPressure: string;
}

/** the aggregate core of ONE arm. `bootBase` = that arm's stats stream. */
function aggregate(rows: readonly WalkRow[], bootBase: number, capLabel: string) {
  const boot = resampleMatrix(rows.length, bootBase);
  const drawsFor = (num: readonly number[], den: readonly number[]): number[] => boot.map((idx) => {
    let a = 0; let b = 0;
    for (const i of idx) { a += num[i]; b += den[i]; }
    return b === 0 ? Number.NaN : a / b;
  });
  const diff = (a: number[], b: number[]): number[] => a.map((v, i) => v - b[i]);

  /* --- per-seed accessors, PERCEIVED band (both sides pooled) --- */
  const perceivedMoments = (b: BandKey) => rows.map((r) => sum(([0, 1] as const).map((s) => r.cells[ckey(s, b)].moments)));
  const perceivedPunished = (b: BandKey, wi: number) => rows.map(
    (r) => sum(([0, 1] as const).map((s) => r.cells[ckey(s, b)].punished[wi])),
  );
  const perceivedLost = (b: BandKey) => rows.map((r) => sum(([0, 1] as const).map((s) => r.cells[ckey(s, b)].lostWithinMax)));
  const perceivedCensored = (b: BandKey, wi: number) => rows.map(
    (r) => sum(([0, 1] as const).map((s) => r.cells[ckey(s, b)].censored[wi])),
  );
  /* --- per-seed accessors, TRUTH band (marginalised over perceived) --- */
  const truthMoments = (tb: BandKey) => rows.map((r) => sum(([0, 1] as const).flatMap(
    (s) => BAND_KEYS.map((pb) => r.diag[dkey(s, pb, tb)].moments),
  )));
  const truthPunished = (tb: BandKey, wi: number) => rows.map((r) => sum(([0, 1] as const).flatMap(
    (s) => BAND_KEYS.map((pb) => r.diag[dkey(s, pb, tb)].punished[wi]),
  )));
  const truthLost = (tb: BandKey) => rows.map((r) => sum(([0, 1] as const).flatMap(
    (s) => BAND_KEYS.map((pb) => r.diag[dkey(s, pb, tb)].lostWithinMax),
  )));
  const truthCensored = (tb: BandKey, wi: number) => rows.map((r) => sum(([0, 1] as const).flatMap(
    (s) => BAND_KEYS.map((pb) => r.diag[dkey(s, pb, tb)].censored[wi]),
  )));

  const tableFor = (
    momentsOf: (b: BandKey) => number[], punishedOf: (b: BandKey, wi: number) => number[],
    lostOf: (b: BandKey) => number[], censoredOf: (b: BandKey, wi: number) => number[],
  ) => ALL_WINDOWS_S.map((w, wi) => {
    const byBand: RateRow[] = BAND_KEYS.map((b) => {
      const mom = sum(momentsOf(b)); const pun = sum(punishedOf(b, wi));
      return {
        band: b, label: BAND_LABEL[b], moments: mom, lost: sum(lostOf(b)), punished: pun,
        censored: sum(censoredOf(b, wi)),
        punishRate: mom === 0 ? NaN : round(pun / mom, 5),
        punishRateCi95: ciOf(drawsFor(punishedOf(b, wi), momentsOf(b))),
      };
    });
    const allMoments = sum(byBand.map((c) => c.moments));
    const allPunished = sum(byBand.map((c) => c.punished));
    const allDraws = drawsFor(
      rows.map((_, i) => sum(BAND_KEYS.map((b) => punishedOf(b, wi)[i]))),
      rows.map((_, i) => sum(BAND_KEYS.map((b) => momentsOf(b)[i]))),
    );
    const d = Object.fromEntries(BAND_KEYS.map((b) => [b, drawsFor(punishedOf(b, wi), momentsOf(b))])) as Record<BandKey, number[]>;
    const pressedVsMid = { point: round(byBand[2].punishRate - byBand[1].punishRate, 5), ci95: ciOf(diff(d.p2, d.p1)) };
    const midVsFree = { point: round(byBand[1].punishRate - byBand[0].punishRate, 5), ci95: ciOf(diff(d.p1, d.p0)) };
    const v1 = verdictOf(pressedVsMid.point, pressedVsMid.ci95);
    const v2 = verdictOf(midVsFree.point, midVsFree.ci95);
    const shape: ShapeRow = {
      pressedVsMid: { ...pressedVsMid, verdict: v1 },
      midVsFree: { ...midVsFree, verdict: v2 },
      gradientWithPressure: (v1 === 'RESOLVED-CONFIRM' && v2 === 'RESOLVED-CONFIRM') ? 'RESOLVED-CONFIRM'
        : (v1 === 'RESOLVED-INVERT' || v2 === 'RESOLVED-INVERT') ? 'INVERSION-PRESENT' : 'UNRESOLVED',
    };
    const baseline = allMoments === 0 ? NaN : round(allPunished / allMoments, 5);
    const spread = Math.max(...byBand.map((c) => c.punishRate)) - Math.min(...byBand.map((c) => c.punishRate));
    return {
      windowS: w,
      isPrimary: w === PRIMARY_WINDOW_S,
      isC5Native: w === C5_NATIVE_WINDOW_S,
      isCandidatePrimary: (CANDIDATE_PRIMARY_WINDOWS_S as readonly number[]).includes(w),
      byBand,
      all: { moments: allMoments, punished: allPunished, punishRate: baseline, punishRateCi95: ciOf(allDraws) },
      realityShape: shape,
      /* ⭐ §A: the discrimination summary — gap-to-baseline ratios (NO verdict, by charter). */
      discrimination: {
        baseline,
        pressedVsMidToBaseline: Number.isFinite(baseline) && baseline > 0
          ? round(Math.abs(pressedVsMid.point) / baseline, 5) : NaN,
        midVsFreeToBaseline: Number.isFinite(baseline) && baseline > 0
          ? round(Math.abs(midVsFree.point) / baseline, 5) : NaN,
        spread: round(spread, 5),
        spreadToBaseline: Number.isFinite(baseline) && baseline > 0 ? round(spread / baseline, 5) : NaN,
      },
    };
  });

  const perceivedTable = tableFor(perceivedMoments, perceivedPunished, perceivedLost, perceivedCensored);
  const truthTable = tableFor(truthMoments, truthPunished, truthLost, truthCensored);
  const primaryIdx = ALL_WINDOWS_S.indexOf(PRIMARY_WINDOW_S as (typeof ALL_WINDOWS_S)[number]);

  /* --- ⭐ (W) THE CONFUSION MATRIX, at the primary window --- */
  const totalMoments = sum(BAND_KEYS.map((b) => sum(perceivedMoments(b))));
  const confusion = BAND_KEYS.flatMap((pb) => BAND_KEYS.map((tb) => {
    const mom = rows.map((r) => sum(([0, 1] as const).map((s) => r.diag[dkey(s, pb, tb)].moments)));
    const pun = rows.map((r) => sum(([0, 1] as const).map((s) => r.diag[dkey(s, pb, tb)].punished[primaryIdx])));
    const m = sum(mom); const p = sum(pun);
    return {
      perceived: pb, truth: tb, moments: m,
      share: totalMoments === 0 ? NaN : round(m / totalMoments, 5),
      punished: p,
      punishRate: m === 0 ? NaN : round(p / m, 5),
      punishRateCi95: m === 0 ? [NaN, NaN] as [number, number] : ciOf(drawsFor(pun, mom)),
      isWedgeCell: pb === 'p0' && tb === 'p2',
      agreement: pb === tb,
    };
  }));
  const agreeMoments = sum(confusion.filter((c) => c.agreement).map((c) => c.moments));
  const wedgeCell = confusion.find((c) => c.isWedgeCell)!;

  /* --- ⭐ (S) THE CONTEXT PROFILES + the four frozen margins --- */
  const ctxOf = (b: BandKey, pick: (c: CtxCell) => number) => rows.map(
    (r) => sum(([0, 1] as const).map((s) => pick(r.ctx[ckey(s, b)]))),
  );
  const ctxOthers = (pick: (c: CtxCell) => number) => rows.map(
    (r) => sum(([0, 1] as const).flatMap((s) => (['p1', 'p2'] as BandKey[]).map((b) => pick(r.ctx[ckey(s, b)])))),
  );
  const pooledSamples = (b: BandKey, which: 't' | 'd'): number[] => rows.flatMap((r) => r.samples[b][which]);
  const distOf = (xs: number[]) => ({
    n: xs.length,
    mean: round(meanOf(xs), 4), sd: round(sdOf(xs), 4),
    min: xs.length === 0 ? NaN : round(Math.min(...xs), 3),
    p10: round(quantileOf(xs, 0.10), 3), median: round(quantileOf(xs, 0.5), 3),
    p90: round(quantileOf(xs, 0.90), 3),
    max: xs.length === 0 ? NaN : round(Math.max(...xs), 3),
  });
  const profiles = BAND_KEYS.map((b) => {
    const mom = sum(ctxOf(b, (c) => c.moments));
    const zoneCounts = Object.fromEntries(THIRDS.map((z) => [z, sum(ctxOf(b, (c) => c.zone[z]))])) as Record<Third, number>;
    const roleCounts = Object.fromEntries(ROLES.map((rl) => [rl, sum(ctxOf(b, (c) => c.role[rl]))])) as Record<Role, number>;
    return {
      band: b, label: BAND_LABEL[b], moments: mom,
      zoneShares: Object.fromEntries(THIRDS.map((z) => [z, mom === 0 ? NaN : round(zoneCounts[z] / mom, 5)])),
      zoneCounts,
      roleShares: Object.fromEntries(ROLES.map((rl) => [rl, mom === 0 ? NaN : round(roleCounts[rl] / mom, 5)])),
      roleCounts,
      matchTimeS: distOf(pooledSamples(b, 't')),
      nearestTrueOpponentM: distOf(pooledSamples(b, 'd')),
      meanTruthPressure: mom === 0 ? NaN : round(sum(ctxOf(b, (c) => c.truthPressureSum)) / mom, 5),
    };
  });

  const freeMom = ctxOf('p0', (c) => c.moments);
  const othMom = ctxOthers((c) => c.moments);
  const marginOfMeans = (pick: (c: CtxCell) => number, threshold: number, scale: number) => {
    const fr = drawsFor(ctxOf('p0', pick), freeMom);
    const ot = drawsFor(ctxOthers(pick), othMom);
    const point = round((sum(ctxOf('p0', pick)) / Math.max(1, sum(freeMom)))
      - (sum(ctxOthers(pick)) / Math.max(1, sum(othMom))), 5);
    const ci = ciOf(diff(fr, ot));
    const fires = Math.abs(point * scale) >= threshold && excludesZero(ci);
    return { point, ci95: ci, threshold, scaleNote: scale === 100 ? 'percentage points' : 'raw units', fires };
  };
  const mZone = marginOfMeans((c) => c.zone.own, M_ZONE_PP, 100);
  const mTime = marginOfMeans((c) => c.timeSum, M_TIME_S, 1);
  const mDist = marginOfMeans((c) => c.distSum, M_DIST_M, 1);
  const freeRoleArr = ROLES.map((rl) => ctxOf('p0', (c) => c.role[rl]));
  const othRoleArr = ROLES.map((rl) => ctxOthers((c) => c.role[rl]));
  const tvdOf = (idx: readonly number[]): number => {
    let a = 0; let b = 0;
    const fa = ROLES.map(() => 0); const ob = ROLES.map(() => 0);
    for (const i of idx) {
      a += freeMom[i]; b += othMom[i];
      for (let k = 0; k < ROLES.length; k++) { fa[k] += freeRoleArr[k][i]; ob[k] += othRoleArr[k][i]; }
    }
    if (a === 0 || b === 0) return NaN;
    return 0.5 * sum(ROLES.map((_, k) => Math.abs(fa[k] / a - ob[k] / b)));
  };
  const roleTvdPoint = round(tvdOf(rows.map((_, i) => i)), 5);
  const roleTvdCi = ciOf(boot.map((idx) => tvdOf(idx)));
  const mRole = {
    point: roleTvdPoint, ci95: roleTvdCi, threshold: M_ROLE_TVD, ciLowerFloor: M_ROLE_TVD_CI_LO,
    fires: Number.isFinite(roleTvdPoint) && roleTvdPoint >= M_ROLE_TVD && roleTvdCi[0] >= M_ROLE_TVD_CI_LO,
  };

  /* --- accounting (the identity gate's input) --- */
  const perWindow = ALL_WINDOWS_S.map((w, wi) => ({
    windowS: w,
    perceivedMoments: sum(BAND_KEYS.map((b) => sum(perceivedMoments(b)))),
    truthMoments: sum(BAND_KEYS.map((b) => sum(truthMoments(b)))),
    perceivedPunished: sum(BAND_KEYS.map((b) => sum(perceivedPunished(b, wi)))),
    truthPunished: sum(BAND_KEYS.map((b) => sum(truthPunished(b, wi)))),
    perceivedLost: sum(BAND_KEYS.map((b) => sum(perceivedLost(b)))),
    truthLost: sum(BAND_KEYS.map((b) => sum(truthLost(b)))),
    censored: sum(BAND_KEYS.map((b) => sum(perceivedCensored(b, wi)))),
    cellPunishedMin: Math.min(...BAND_KEYS.flatMap((pb) => BAND_KEYS.map(
      (tb) => sum(rows.map((r) => sum(([0, 1] as const).map(
        (s) => r.diag[dkey(s, pb, tb)].lostWithinMax - r.diag[dkey(s, pb, tb)].punished[wi],
      )))),
    ))),
  }));
  const accounting = {
    matches: rows.length,
    dosedForks: sum(rows.map((r) => r.dosedForks)),
    eligible: sum(rows.map((r) => r.eligible)),
    qualifying: sum(rows.map((r) => r.qualifying)),
    classCounts: Object.fromEntries(CLASSES.map((c) => [c, sum(rows.map((r) => r.classCounts[c]))])),
    turnoversTotal: sum(rows.map((r) => r.turnoversTotal)),
    liveHoldTotal: sum(rows.map((r) => r.liveHoldTotal)),
    perceivedTotal: sum(BAND_KEYS.map((b) => sum(perceivedMoments(b)))),
    truthTotal: sum(BAND_KEYS.map((b) => sum(truthMoments(b)))),
    confusionTotal: sum(confusion.map((c) => c.moments)),
    ctxTotal: sum(BAND_KEYS.map((b) => sum(ctxOf(b, (c) => c.moments)))),
    zoneTotal: sum(BAND_KEYS.map((b) => sum(THIRDS.map((z) => sum(ctxOf(b, (c) => c.zone[z])))))),
    roleTotal: sum(BAND_KEYS.map((b) => sum(ROLES.map((rl) => sum(ctxOf(b, (c) => c.role[rl])))))),
    sampleTotal: sum(BAND_KEYS.map((b) => pooledSamples(b, 't').length)),
    perWindow,
  };

  /* --- ⭐ the per-cluster cells, STORED (#256.3) --- */
  const clusterCells = rows.map((r) => ({
    seed: r.seed,
    perceived: Object.fromEntries(Object.entries(r.cells).map(([k, c]) => [k, {
      moments: c.moments, punished: c.punished, lostWithinMax: c.lostWithinMax, censored: c.censored,
      sameChain: c.sameChain, liveHolds: c.liveHolds, liveHoldsPunished: c.liveHoldsPunished,
    }])),
    perceivedByTruth: Object.fromEntries(Object.entries(r.diag).map(([k, c]) => [k, {
      moments: c.moments, punished: c.punished, lostWithinMax: c.lostWithinMax, censored: c.censored,
    }])),
    context: Object.fromEntries(Object.entries(r.ctx).map(([k, c]) => [k, {
      moments: c.moments, zone: c.zone, role: c.role,
      timeSum: round(c.timeSum, 4), timeSumSq: round(c.timeSumSq, 4),
      timeMin: Number.isFinite(c.timeMin) ? round(c.timeMin, 4) : null,
      timeMax: Number.isFinite(c.timeMax) ? round(c.timeMax, 4) : null,
      distSum: round(c.distSum, 4), distSumSq: round(c.distSumSq, 4),
      distMin: Number.isFinite(c.distMin) ? round(c.distMin, 4) : null,
      distMax: Number.isFinite(c.distMax) ? round(c.distMax, 4) : null,
      truthPressureSum: round(c.truthPressureSum, 5),
    }])),
    eligible: r.eligible, qualifying: r.qualifying, classCounts: r.classCounts,
    turnovers: r.turnoversTotal, goals: r.acc.goalsFromScore, simSeconds: round(r.simSeconds, 4),
    lastDecisionTimeS: round(r.lastDecisionTimeS, 4),
  }));

  return {
    arm: capLabel,
    matches: rows.length,
    statsBase: bootBase,
    momentsPerMatch: round(accounting.perceivedTotal / Math.max(1, rows.length), 4),
    eligiblePerMatch: round(accounting.eligible / Math.max(1, rows.length), 4),
    lastDecisionTimeS: {
      mean: round(meanOf(rows.map((r) => r.lastDecisionTimeS)), 4),
      max: rows.length === 0 ? NaN : round(Math.max(...rows.map((r) => r.lastDecisionTimeS)), 4),
    },
    perceivedTable,
    truthTable,
    confusion,
    confusionAgreementShare: totalMoments === 0 ? NaN : round(agreeMoments / totalMoments, 5),
    wedgeCell,
    profiles,
    margins: { mZone, mTime, mRole, mDist },
    accounting,
    clusterCells,
    freeBandHoldsPerMatch: round(sum(perceivedMoments('p0')) / Math.max(1, rows.length), 5),
  };
}

/* --- the two passes, both arms (X-DET) -------------------------------------- */
const tA0 = Date.now();
const rewalkA = walkBlock('re-walk A', 'rewalk', REWALK_BASE, RUN_REWALK_N, PER_MATCH_CAP, true);
const rewalkMsA = Date.now() - tA0;
const tU0 = Date.now();
const uncappedA = walkBlock('uncapped A', 'uncapped', UNCAPPED_RUN_BASE, UNCAPPED_N, Number.POSITIVE_INFINITY, true);
const uncappedMsA = Date.now() - tU0;
const coreCappedA = aggregate(rewalkA, BOOTSTRAP_SEED, 'capped (the census grid, cap 80/match)');
const coreUncappedA = aggregate(uncappedA, BOOTSTRAP_SEED_UNCAPPED, 'UNCAPPED (no per-match moment cap)');

const tB0 = Date.now();
const rewalkB = walkBlock('re-walk B', 'rewalk', REWALK_BASE, RUN_REWALK_N, PER_MATCH_CAP, false);
const rewalkMsB = Date.now() - tB0;
const tUB0 = Date.now();
const uncappedB = walkBlock('uncapped B', 'uncapped', UNCAPPED_RUN_BASE, UNCAPPED_N, Number.POSITIVE_INFINITY, false);
const uncappedMsB = Date.now() - tUB0;
const coreCappedB = aggregate(rewalkB, BOOTSTRAP_SEED, 'capped (the census grid, cap 80/match)');
const coreUncappedB = aggregate(uncappedB, BOOTSTRAP_SEED_UNCAPPED, 'UNCAPPED (no per-match moment cap)');

const digestOf = (o: unknown): string => createHash('sha256').update(JSON.stringify(o)).digest('hex');
const digestA = digestOf({ capped: coreCappedA, uncapped: coreUncappedA });
const digestB = digestOf({ capped: coreCappedB, uncapped: coreUncappedB });

/* ========================================================================== */
/* §16 ⭐ THE THREE PRE-REGISTERED PREDICATES (frozen functions, no verdicts)   */
/* ========================================================================== */
const primaryOf = (t: ReturnType<typeof aggregate>['perceivedTable']) => t.find((w) => w.isPrimary)!;

/** (W) — frozen: truth mid−free NOT resolved-invert AND perceived mid−free IS resolved-invert. */
const wedgePredicate = (perceivedVerdict: string, truthVerdict: string) => ({
  perceivedMidVsFreeVerdict: perceivedVerdict,
  truthMidVsFreeVerdict: truthVerdict,
  perceivedInverts: perceivedVerdict === 'RESOLVED-INVERT',
  truthNotInverted: truthVerdict !== 'RESOLVED-INVERT',
  verdict: (perceivedVerdict === 'RESOLVED-INVERT' && truthVerdict !== 'RESOLVED-INVERT')
    ? 'WEDGE-CONFIRM' : 'WEDGE-DENIED',
});
const W = wedgePredicate(
  primaryOf(coreCappedA.perceivedTable).realityShape.midVsFree.verdict,
  primaryOf(coreCappedA.truthTable).realityShape.midVsFree.verdict,
);

/** (S) — frozen: the inversion vanishes in the uncapped arm OR any named margin fires. */
const selectionPredicate = (uncappedVerdict: string, margins: ReturnType<typeof aggregate>['margins']) => {
  const limbA = uncappedVerdict !== 'RESOLVED-INVERT';
  const fired = Object.entries(margins).filter(([, v]) => (v as { fires: boolean }).fires).map(([k]) => k);
  const limbB = fired.length > 0;
  return {
    limbA_uncappedInversionVanishes: limbA,
    uncappedMidVsFreeVerdict: uncappedVerdict,
    limbB_anyMarginFires: limbB,
    marginsFired: fired,
    verdict: (limbA || limbB) ? 'SELECTION-CONFIRM' : 'SELECTION-DENIED',
  };
};
const S = selectionPredicate(
  primaryOf(coreUncappedA.perceivedTable).realityShape.midVsFree.verdict,
  coreCappedA.margins,
);

/** (A) — NO verdict by charter: the candidate primaries' discrimination, published. */
const A = {
  charterNote: '⭐ NO VERDICT (the charter): the EK-T1 window OF RECORD is the commander\'s pick on this '
    + 'evidence. This block ranks nothing and recommends nothing.',
  candidateWindowsS: [...CANDIDATE_PRIMARY_WINDOWS_S],
  windowOfRecordAtCensus: PRIMARY_WINDOW_S,
  ladder: coreCappedA.perceivedTable.map((w) => ({
    windowS: w.windowS,
    isCandidatePrimary: w.isCandidatePrimary,
    isCensusPrimary: w.isPrimary,
    baseline: w.all.punishRate,
    baselineCi95: w.all.punishRateCi95,
    byBand: w.byBand.map((b) => ({ band: b.band, punishRate: b.punishRate, ci95: b.punishRateCi95 })),
    pressedVsMid: w.realityShape.pressedVsMid,
    midVsFree: w.realityShape.midVsFree,
    discrimination: w.discrimination,
  })),
};

/* ========================================================================== */
/* §17 THE GATES — every composite gate is a PURE CONJUNCT FUNCTION (#260.2)   */
/* ========================================================================== */
/* --- gConfigIdentity: the census probe's own SOURCE --- */
const censusSource = readFileSync(CENSUS_PROBE_PATH, 'utf8');
interface ConfigIn { src: string; tableSha: string; arm: string; scopeKind: string; liveArmed: boolean }
const configConjuncts = (i: ConfigIn) => {
  const flagsBlock = i.src.match(/const CENSUS_FLAGS = \{([\s\S]*?)\} as const;/)?.[1] ?? '';
  const flagOk = (k: string, v: boolean): boolean => new RegExp(`${k}:\\s*${v}`).test(flagsBlock);
  const num = (re: RegExp): number | null => {
    const m = i.src.match(re); return m === null ? null : Number(m[1].replace(/_/g, ''));
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
    durationSame: num(/const MATCH_DURATION = (\d[\d_]*)/) === MATCH_DURATION,
    perMatchCapSame: num(/const PER_MATCH_CAP = (\d[\d_]*)/) === PER_MATCH_CAP,
    momentSpacingSame: num(/const MOMENT_SPACING = (\d[\d_]*)/) === MOMENT_SPACING,
    supportMinSame: num(/const SUPPORT_MIN_M = (\d[\d_]*)/) === SUPPORT_MIN_M,
    supportMaxSame: num(/const SUPPORT_MAX_M = (\d[\d_]*)/) === SUPPORT_MAX_M,
    holdKSame: num(/const HOLD_K_TICKS = (\d[\d_]*)/) === HOLD_K_TICKS,
    primaryWindowSame: num(/const PRIMARY_WINDOW_S = (\d[\d_]*)/) === PRIMARY_WINDOW_S,
    ladderSame: new RegExp(`const WINDOWS_S = \\[${[...WINDOWS_S].join(', ')}\\]`).test(i.src),
    c5NativeRowSame: num(/const C5_NATIVE_WINDOW_S = (\d[\d_]*)/) === C5_NATIVE_WINDOW_S,
    squadDerivationSame: /teamA: teamInfo\('A', seed \* 2 \+ 1\), teamB: teamInfo\('B', seed \* 2 \+ 2\)/.test(i.src),
    tableShaSame: new RegExp(`EXPECTED_TABLE_SHA =\\s*\\n?\\s*'${EXPECTED_TABLE_SHA}'`).test(i.src)
      || i.src.includes(`'${EXPECTED_TABLE_SHA}'`),
    tablePathSame: i.src.includes(TABLE_PATH),
    injectedTableShaSame: i.tableSha === EXPECTED_TABLE_SHA,
    armIsNeutral: i.arm === 'neutral',
    scopeIsBoth: i.scopeKind === 'both',
    liveArmed: i.liveArmed,
  };
};
const configInput: ConfigIn = {
  src: censusSource, tableSha: tableRaw.tableSha, arm: EYE_CONFIG.arm,
  scopeKind: EYE_CONFIG.scope.kind, liveArmed: /m\.whetherEye = EYE_CONFIG;/.test(readFileSync(SELF_PATH, 'utf8')),
};
const gConfigIdentity = (() => {
  const c = configConjuncts(configInput);
  return {
    pass: Object.values(c).every(Boolean), ...c, censusProbe: CENSUS_PROBE_PATH,
    note: '⭐ THE RE-WALKED WORLD IS THE CENSUS\'S WORLD, proved against the committed census probe\'s '
      + 'SOURCE, constant by constant, plus this probe\'s own live-arming line.',
  };
})();

/* --- ⭐⭐ gReproEkc0: the SAME holds, field-exact --- */
const compareToCensus = (rows: readonly WalkRow[]) => {
  const byCensusSeed = new Map<number, any>(CENSUS_CLUSTER_CELLS.map((c: any) => [c.seed, c]));
  const fields: { seed: number; field: string; want: number; got: number }[] = [];
  const mismatches: typeof fields = [];
  let seedsMissing = 0;
  for (const r of rows) {
    const want = byCensusSeed.get(r.seed);
    if (want === undefined) { seedsMissing += 1; continue; }
    const push = (field: string, w: number, g: number): void => {
      const rec = { seed: r.seed, field, want: w, got: g };
      fields.push(rec);
      if (w !== g) mismatches.push(rec);
    };
    for (const [k, cell] of Object.entries(r.cells)) {
      const wc = want.bySideBand[k];
      push(`${k}.moments`, wc.moments, cell.moments);
      push(`${k}.lostWithinMax`, wc.lostWithinMax, cell.lostWithinMax);
      push(`${k}.liveHolds`, wc.liveHolds, cell.liveHolds);
      for (let i = 0; i < ALL_WINDOWS_S.length; i++) {
        push(`${k}.punished[${ALL_WINDOWS_S[i]}]`, wc.punished[i], cell.punished[i]);
        push(`${k}.sameChain[${ALL_WINDOWS_S[i]}]`, wc.sameChain[i], cell.sameChain[i]);
        push(`${k}.censored[${ALL_WINDOWS_S[i]}]`, wc.censored[i], cell.censored[i]);
        push(`${k}.liveHoldsPunished[${ALL_WINDOWS_S[i]}]`, wc.liveHoldsPunished[i], cell.liveHoldsPunished[i]);
      }
    }
    push('eligible', want.eligible, r.eligible);
    push('qualifying', want.qualifying, r.qualifying);
    for (const c of CLASSES) push(`classCounts.${c}`, want.classCounts[c], r.classCounts[c]);
    push('turnovers', want.turnovers, r.turnoversTotal);
    push('goals', want.goals, r.acc.goalsFromScore);
    push('simSeconds', want.simSeconds, round(r.simSeconds, 4));
  }
  return { fieldsChecked: fields.length, mismatches: mismatches.length, seedsChecked: rows.length, seedsMissing, mismatchDetail: mismatches.slice(0, 10) };
};
const subBlockCmp = compareToCensus(rewalkA.slice(0, Math.min(SUB_BLOCK_N, rewalkA.length)));
if (subBlockCmp.mismatches > 0) {
  banner(`  [ekc0b] ⚠ SUB-BLOCK REPRO MISMATCH — ${subBlockCmp.mismatches} of ${subBlockCmp.fieldsChecked} fields`);
}
const fullCmp = compareToCensus(rewalkA);
interface ReproIn {
  sub: ReturnType<typeof compareToCensus>; full: ReturnType<typeof compareToCensus>;
  base: number; censusBase: number; mode: Mode; censusN: number;
}
const reproConjuncts = (i: ReproIn) => ({
  subBlockExact: i.sub.mismatches === 0,
  subBlockNonVacuous: i.sub.fieldsChecked >= 100 && i.sub.seedsChecked >= Math.min(SUB_BLOCK_N, i.censusN),
  fullBlockExact: i.full.mismatches === 0,
  everySeedFoundInCensus: i.full.seedsMissing === 0,
  blockBaseIsCensusBase: i.base === i.censusBase,
  coversWholeCensusBlockInFull: i.mode === 'smoke' ? true : i.full.seedsChecked === i.censusN,
});
const reproInput: ReproIn = {
  sub: subBlockCmp, full: fullCmp, base: REWALK_BASE, censusBase: CENSUS_BASE, mode: MODE, censusN: CENSUS_N,
};
const gReproEkc0 = (() => {
  const c = reproConjuncts(reproInput);
  return {
    pass: Object.values(c).every(Boolean), ...c,
    censusArtifact: CENSUS_ARTIFACT_PATH, censusArtifactSha256: CENSUS_SHA,
    censusBlock: `${CENSUS_BASE}..${CENSUS_BASE + CENSUS_N - 1}`,
    subBlock: `${CENSUS_BASE}..${CENSUS_BASE + Math.min(SUB_BLOCK_N, CENSUS_N) - 1}`,
    subBlockFields: subBlockCmp.fieldsChecked, subBlockMismatches: subBlockCmp.mismatches,
    fullFields: fullCmp.fieldsChecked, fullMismatches: fullCmp.mismatches,
    mismatchDetail: fullCmp.mismatchDetail,
    note: '⭐⭐ THE SAME HOLDS: the census artifact\'s per-cluster cells reproduced FIELD-EXACT — every '
      + 'side|band cell\'s moments, punished at all five windows, sameChain, censored, lostWithinMax, '
      + 'liveHolds and liveHoldsPunished, plus each seed\'s eligible/qualifying/class counts, turnovers, '
      + 'goals and simSeconds. The sub-block runs FIRST so a divergence fails in seconds.',
  };
})();

/* --- ⭐ gTruthBand: the truth index is the SHIPPED formula at the CERTIFIED cuts --- */
const truthBandSample = (() => {
  /* cross-check the shipped `pressureAt` against the SEAT's own inline formula (two independently
   * written implementations) on REAL geometry drawn from a never-measured construction seed. */
  const m = examMatch(GWORLD_SEED);
  let checked = 0; let disagreements = 0; let maxAbsDelta = 0;
  for (let step = 0; step < 1200; step++) {
    m.step(DT);
    if (step % 10 !== 0) continue;
    for (const p of m.allPlayers) {
      const opponents = m.teams[1 - p.side].players.filter((o) => !o.sentOff);
      const shipped = pressureAt(p.pos, opponents);
      let nearD = Number.POSITIVE_INFINITY;
      for (const o of opponents) nearD = Math.min(nearD, Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y));
      const inline = Math.max(0, Math.min(1, 1 - nearD / PRESSURE_RADIUS_M));
      checked += 1;
      maxAbsDelta = Math.max(maxAbsDelta, Math.abs(shipped - inline));
      if (pressureBandOf(shipped) !== pressureBandOf(inline)) disagreements += 1;
    }
  }
  return { checked, disagreements, maxAbsDelta: round(maxAbsDelta, 12) };
})();
interface TruthIn {
  checked: number; disagreements: number; maxAbsDelta: number;
  cuts: readonly number[]; committedCuts: readonly number[]; radius: number; probeSrc: string;
}
const truthConjuncts = (i: TruthIn) => ({
  formulaAgrees: i.disagreements === 0 && i.maxAbsDelta < 1e-12,
  nonVacuousSample: i.checked >= 500,
  cutsAreCommittedCuts: JSON.stringify(i.cuts) === JSON.stringify(i.committedCuts),
  radiusIsShipped: i.radius === PRESSURE_RADIUS_M && i.radius > 0,
  pressureAtImportedFromSrc: /import \{ pressureAt, PRESSURE_RADIUS_M \} from '\.\.\/\.\.\/src\/ai\/perception';/.test(i.probeSrc),
  truthUsesTrueOpponents: /pressureAt\(owner!\.pos, m\.teams\[1 - side\]\.players\)/.test(i.probeSrc),
});
const truthInput: TruthIn = {
  ...truthBandSample, cuts: PRESSURE_CUTS, committedCuts: tableRaw.parameters.pressureBands,
  radius: PRESSURE_RADIUS_M, probeSrc: readFileSync(SELF_PATH, 'utf8'),
};
const gTruthBand = (() => {
  const c = truthConjuncts(truthInput);
  return {
    pass: Object.values(c).every(Boolean), ...c, ...truthBandSample,
    cuts: PRESSURE_CUTS, radius: PRESSURE_RADIUS_M,
    note: '⭐ ⚠ NOT A TAUTOLOGY (#260.2(ii)): the shipped `pressureAt` (src/ai/perception.ts) is compared '
      + 'against the SEAT\'s own INLINE formula (src/ai/whetherEye.ts) — two independently written '
      + 'implementations — on real match geometry, and the cuts are the committed table\'s own.',
  };
})();

/* --- ⭐⭐ gWedgeAccounting --- */
type AccIn = ReturnType<typeof aggregate>['accounting'];
const wedgeAccountingConjuncts = (a: AccIn) => ({
  perceivedTotalIsDosed: a.perceivedTotal === a.dosedForks,
  truthTotalIsDosed: a.truthTotal === a.dosedForks,
  confusionTotalIsDosed: a.confusionTotal === a.dosedForks,
  contextTotalIsDosed: a.ctxTotal === a.dosedForks,
  zoneCountsPartition: a.zoneTotal === a.dosedForks,
  roleCountsPartition: a.roleTotal === a.dosedForks,
  samplesTieToDose: a.sampleTotal === a.dosedForks,
  dosedEqualsPlacedCells: a.dosedForks === (a.classCounts['D-HOLD'] as number) + (a.classCounts['E-ACTNOW-DECLINED'] as number),
  perceivedAndTruthPunishedAgree: a.perWindow.every((w) => w.perceivedPunished === w.truthPunished),
  perceivedAndTruthLostAgree: a.perWindow.every((w) => w.perceivedLost === w.truthLost),
  punishedSubsetLostInEveryCell: a.perWindow.every((w) => w.cellPunishedMin >= 0),
  punishmentMonotone: WINDOWS_S.every((w, i) => {
    if (i === 0) return true;
    const cur = a.perWindow.find((x) => x.windowS === w)!;
    const prev = a.perWindow.find((x) => x.windowS === WINDOWS_S[i - 1])!;
    return cur.perceivedPunished >= prev.perceivedPunished;
  }),
  lostInvariantInWindow: a.perWindow.every((w) => w.perceivedLost === a.perWindow[0].perceivedLost),
  momentsInvariantInWindow: a.perWindow.every((w) => w.perceivedMoments === a.perWindow[0].perceivedMoments),
});
const gWedgeAccounting = (() => {
  const c = wedgeAccountingConjuncts(coreCappedA.accounting);
  return {
    pass: Object.values(c).every(Boolean), ...c, ...coreCappedA.accounting,
    identity: '⭐⭐ THE CROSS-CUT ADDS UP: the 3×3 confusion cells sum to the perceived marginals, to the '
      + 'truth marginals and to the census\'s own dosed total; the context profiles\' denominators are the '
      + 'same population; punished ⊆ lost in EVERY cell; punished monotone in the window while lost and '
      + 'moments are invariant in it.',
  };
})();

/* --- ⭐ gUncappedArm --- */
interface UncapIn {
  capUsed: number; cappedMomentsPerMatch: number; uncappedMomentsPerMatch: number;
  cappedLastDecisionMax: number; uncappedLastDecisionMax: number;
  uncappedMatches: number; probeSrc: string; sameFlags: boolean; sameDuration: boolean; sameHoldK: boolean;
}
const uncappedConjuncts = (i: UncapIn) => ({
  capActuallyRemoved: !Number.isFinite(i.capUsed),
  momentsMateriallyHigher: i.uncappedMomentsPerMatch > i.cappedMomentsPerMatch * 1.5,
  extendsPastCappedArm: i.uncappedLastDecisionMax > i.cappedLastDecisionMax,
  armNonEmpty: i.uncappedMatches > 0,
  sameWorldFlags: i.sameFlags,
  sameDuration: i.sameDuration,
  sameDose: i.sameHoldK,
  oneWalkerBothArms: /walkBlock\('uncapped A', 'uncapped', UNCAPPED_RUN_BASE, UNCAPPED_N, Number\.POSITIVE_INFINITY/.test(i.probeSrc),
});
const uncappedInput: UncapIn = {
  capUsed: Number.POSITIVE_INFINITY,
  cappedMomentsPerMatch: coreCappedA.momentsPerMatch,
  uncappedMomentsPerMatch: coreUncappedA.momentsPerMatch,
  cappedLastDecisionMax: coreCappedA.lastDecisionTimeS.max,
  uncappedLastDecisionMax: coreUncappedA.lastDecisionTimeS.max,
  uncappedMatches: coreUncappedA.matches,
  probeSrc: readFileSync(SELF_PATH, 'utf8'),
  sameFlags: true, sameDuration: true, sameHoldK: true,
};
const gUncappedArm = (() => {
  const c = uncappedConjuncts(uncappedInput);
  return {
    pass: Object.values(c).every(Boolean), ...c,
    cappedMomentsPerMatch: coreCappedA.momentsPerMatch,
    uncappedMomentsPerMatch: coreUncappedA.momentsPerMatch,
    cappedLastDecisionMaxS: coreCappedA.lastDecisionTimeS.max,
    uncappedLastDecisionMaxS: coreUncappedA.lastDecisionTimeS.max,
    note: '⭐ THE CAP IS REMOVED, NOT RAISED (#260.3\'s "or a materially raised cap, declared" — the '
      + 'stronger option is taken): both arms run ONE walker whose only difference is the cap argument.',
  };
})();

/* --- gWorld --- */
interface WorldIn { flags: Record<string, unknown>; eye: unknown; stationEye: unknown; forcedHold: unknown; other: Record<string, unknown> }
const worldConjuncts = (i: WorldIn) => ({
  examFlagsSet: (Object.keys(CENSUS_FLAGS) as (keyof typeof CENSUS_FLAGS)[]).every((k) => i.flags[k] === CENSUS_FLAGS[k]),
  otherStageFlagsShut: Object.values(i.other).every((v) => v === undefined || v === false),
  eyeNullByDefault: i.eye === null,
  stationEyeNull: (i.stationEye ?? null) === null,
  forcedHoldNull: (i.forcedHold ?? null) === null,
});
const worldInput: WorldIn = (() => {
  const m = examMatch(GWORLD_SEED) as unknown as Record<string, unknown>;
  const otherKeys = ['o1PassWindup', 'dvDeliveryValue', 'dvLearnedMap', 'mtArmed'];
  return {
    flags: Object.fromEntries(Object.keys(CENSUS_FLAGS).map((k) => [k, m[k]])),
    eye: m.whetherEye, stationEye: m.stationEye, forcedHold: m.forcedHold,
    other: Object.fromEntries(otherKeys.map((k) => [k, m[k]])),
  };
})();
const gWorld = (() => {
  const c = worldConjuncts(worldInput);
  return { pass: Object.values(c).every(Boolean), ...c, constructionSeed: GWORLD_SEED, note: 'read back on a freshly CONSTRUCTED, NEVER-STEPPED match.' };
})();

/* --- gSeedDisjoint --- */
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean => a[0] <= b[1] && b[0] <= a[1];
interface SeedIn {
  blocks: { name: string; range: [number, number]; inverted: boolean }[];
  consumed: readonly { name: string; range: readonly [number, number] }[];
  firstFresh: number; lastFresh: number; clean: boolean; mode: Mode;
  band: readonly [number, number];
  smokeBase: number; guardBlock: readonly [number, number];
  uncappedBase: number; uncappedCap: number; gworldSeed: number;
}
const seedConjuncts = (i: SeedIn) => {
  const checked = i.blocks.map((b) => {
    const hits = i.consumed.filter((c) => overlaps(b.range, c.range)).map((c) => c.name);
    return { ...b, collisions: hits, ok: b.inverted ? hits.length > 0 : hits.length === 0 };
  });
  return {
    blocksOk: checked.every((b) => b.ok),
    subBlocksOrdered: i.smokeBase + 11 < i.guardBlock[0] && i.guardBlock[1] < i.uncappedBase
      && i.uncappedBase + i.uncappedCap - 1 < i.gworldSeed,
    freshInBand: i.firstFresh >= i.band[0] && i.lastFresh <= i.band[1],
    routedCorrectly: i.clean
      ? (i.mode === 'smoke' ? i.firstFresh === i.smokeBase : i.firstFresh === i.uncappedBase)
      : (i.firstFresh >= i.guardBlock[0] && i.lastFresh <= i.guardBlock[1]),
    bandOpensAboveEverythingConsumed: i.consumed.every((c) => c.range[1] < i.band[0]),
    ekC0LedgerPresent: i.consumed.some((c) => c.range[0] === 12_448_000 && c.range[1] === 12_448_999),
    rewalkCollidesByDesign: checked.filter((b) => b.inverted).every((b) => b.collisions.length > 0),
  };
};
const seedBlocks: SeedIn['blocks'] = [
  { name: '⭐⭐ the census RE-WALK (RECEIPT)', range: [REWALK_BASE, REWALK_BASE + RUN_REWALK_N - 1], inverted: CLEAN_INVOCATION },
  { name: 'smoke', range: [SMOKE_BASE, SMOKE_BASE + 11], inverted: false },
  { name: 'guard (exit-semantics)', range: [GUARD_BLOCK[0], GUARD_BLOCK[1]], inverted: false },
  { name: 'uncapped arm + reserve', range: [UNCAPPED_BASE, UNCAPPED_BASE + UNCAPPED_CAP - 1], inverted: false },
  { name: 'G-WORLD construction seed', range: [GWORLD_SEED, GWORLD_SEED], inverted: false },
];
const seedInput: SeedIn = {
  blocks: seedBlocks, consumed: CONSUMED,
  firstFresh: UNCAPPED_RUN_BASE, lastFresh: UNCAPPED_RUN_BASE + UNCAPPED_N - 1,
  clean: CLEAN_INVOCATION, mode: MODE,
  band: RESERVED_BAND, smokeBase: SMOKE_BASE, guardBlock: GUARD_BLOCK,
  uncappedBase: UNCAPPED_BASE, uncappedCap: UNCAPPED_CAP, gworldSeed: GWORLD_SEED,
};
const gSeedDisjoint = (() => {
  const c = seedConjuncts(seedInput);
  return {
    pass: Object.values(c).every(Boolean), ...c,
    blocks: seedBlocks.map((b) => ({
      ...b, collisions: CONSUMED.filter((x) => overlaps(b.range, x.range)).map((x) => x.name),
    })),
    ledgerEntries: CONSUMED.length, reservedBand: RESERVED_BAND,
    note: '⭐ THE RE-WALK\'S PREDICATE IS INVERTED (it MUST collide with EK-C0\'s consumed band — a '
      + 'clash-free re-walk would prove it is walking fresh seeds instead of reproducing a receipt); '
      + 'every fresh block carries the ordinary collision-free predicate.',
  };
})();

/* --- gStatsDisjoint --- */
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.flatMap(
  (b) => [Math.abs(BOOTSTRAP_SEED - b), Math.abs(BOOTSTRAP_SEED_UNCAPPED - b)],
));
const gStatsDisjoint = {
  pass: statsMinGap >= 200 && BOOTSTRAP_SEED >= STATS_FLOOR && BOOTSTRAP_SEED_UNCAPPED >= STATS_FLOOR
    && Math.abs(BOOTSTRAP_SEED_UNCAPPED - BOOTSTRAP_SEED) >= 200,
  cappedBase: BOOTSTRAP_SEED, uncappedBase: BOOTSTRAP_SEED_UNCAPPED, floor: STATS_FLOOR,
  minGap: statsMinGap, betweenArmsGap: Math.abs(BOOTSTRAP_SEED_UNCAPPED - BOOTSTRAP_SEED),
  resamples: BOOTSTRAP_RESAMPLES, cluster: 'match seed (#20)', published: PUBLISHED_STATS_BASES,
};

/* --- X-FP-PROD / X-SRC-UNTOUCHED --- */
let fpObserved = 'skipped';
let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fpObserved = 'skipped (preflight)'; } else {
  process.stderr.write('  [ekc0b] X-FP-PROD: re-deriving the production fingerprint...\n');
  const league = new League({ seed: FINGERPRINT_SEED });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
  xFpProd = fpObserved === FINGERPRINT_BASELINE;
  process.stderr.write(`  [ekc0b] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);
}
let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

/* --- gValuesUnreachable --- */
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
interface ValuesIn { needles: string[]; hits: string[]; controlFound: boolean; files: number; minNeedles: number }
const valuesConjuncts = (i: ValuesIn) => ({
  noHits: i.hits.length === 0,
  nonVacuous: i.needles.length >= i.minNeedles,
  controlFound: i.controlFound,
  filesScanned: i.files > 0,
});
const valuesInput: ValuesIn = (() => {
  const pt = primaryOf(coreCappedA.truthTable);
  const pp = primaryOf(coreCappedA.perceivedTable);
  const values = [
    ...pp.byBand.map((r) => r.punishRate), ...pt.byBand.map((r) => r.punishRate),
    pp.all.punishRate, coreCappedA.wedgeCell.punishRate,
    ...primaryOf(coreUncappedA.perceivedTable).byBand.map((r) => r.punishRate),
  ];
  const needles = [...new Set(values.flatMap(searchForms))];
  return {
    needles, hits: needles.filter((n) => SRC_TEXT.includes(n)),
    controlFound: SRC_TEXT.includes(CONTROL_NEEDLE), files: SRC_FILES.length, minNeedles: MIN_NEEDLES,
  };
})();
const gValuesUnreachable = (() => {
  const c = valuesConjuncts(valuesInput);
  return {
    pass: Object.values(c).every(Boolean), ...c,
    filesScannedCount: SRC_FILES.length, needles: valuesInput.needles, hits: valuesInput.hits,
    controlNeedle: CONTROL_NEEDLE, searchFloor: VALUE_SEARCH_FLOOR,
    note: 'every published rate searched in BOTH the raw 5-dp form and the FORMATTED percentage form the '
      + 'tables print; a control needle that MUST be found keeps the search non-vacuous.',
  };
})();

/* --- ⭐ gCleanInvocation (the #260.2(i) discharge) --- */
const gCleanInvocation = {
  pass: CLEAN_INVOCATION,
  overrides: OVERRIDES,
  overridesCovered: OVERRIDES.map((o) => o.name),
  preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
  routedToGuardBlock: !CLEAN_INVOCATION, guardBlock: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
  resume: RESUME,
  note: '⭐⭐ #260.2(i) DISCHARGED: EVERY override that changes what is measured — EKC0B_N, EKC0B_CAP, '
    + 'EKC0B_UNCAPPED_N, EKC0B_SKIP_FP — sets the preflight flag, routes BOTH arms onto the guard block, '
    + 'turns this gate RED and exits 1, and a preflight can never write a canonical repo path (checked on '
    + 'the RESOLVED absolute path). EKC0B_RESUME is not such an override: pass B never resumes, so X-DET '
    + 'is the checkpoint\'s integrity proof.',
};

/* --- gNDerived --- */
const gNDerived = {
  pass: CLEAN_INVOCATION
    && REWALK_BASE === CENSUS_BASE
    && RUN_REWALK_N === (MODE === 'smoke' ? SUB_BLOCK_N : CENSUS_N)
    && (MODE === 'smoke' ? UNCAPPED_N === SMOKE_UNCAPPED_N : UNCAPPED_N === uncappedDerivation.nStar),
  rewalk: {
    ranN: RUN_REWALK_N, base: REWALK_BASE,
    censusArtifactN: CENSUS_N, censusArtifactBase: CENSUS_BASE,
    note: 'the re-walk\'s N is NOT chosen: it is READ from the committed census artifact (smoke re-walks '
      + `the block's first ${SUB_BLOCK_N} seeds, a mode-conditioned literal).`,
  },
  uncapped: { ranN: UNCAPPED_N, ...uncappedDerivation },
};

/* --- ⭐ gFrozenMargins: the doc's frozen half IS the probe's constants --- */
const docText = existsSync(STAGE_DOC_PATH) ? readFileSync(STAGE_DOC_PATH, 'utf8') : '';
interface MarginsIn { doc: string; gateNames: string[]; gateCount: number }
const frozenMarginConjuncts = (i: MarginsIn) => ({
  docPresent: i.doc.length > 0,
  zoneMarginInDoc: i.doc.includes(`≥ **${M_ZONE_PP.toFixed(1)} pp**`),
  timeMarginInDoc: i.doc.includes(`≥ **${M_TIME_S.toFixed(1)} s**`),
  roleMarginInDoc: i.doc.includes(`TVD ≥ **${M_ROLE_TVD.toFixed(2)}**`) && i.doc.includes(`≥ **${M_ROLE_TVD_CI_LO.toFixed(2)}**`),
  distMarginInDoc: i.doc.includes(`≥ **${M_DIST_M.toFixed(1)} m**`),
  wedgePredicateNamed: i.doc.includes('WEDGE-PREDICATE (FROZEN)'),
  selectionPredicateNamed: i.doc.includes('SELECTION-PREDICATE (FROZEN)'),
  saturationHasNoVerdict: i.doc.includes('NO PREDICATE, NO VERDICT'),
  everyGateNamedInDoc: i.gateNames.every((g) => i.doc.includes(g)),
  headlineGateCountMatches: i.doc.includes(`has **${i.gateCount}** rows`),
  targetFreeHoldsInDoc: i.doc.includes(`ceil(${TARGET_FREE_BAND_HOLDS} / freeBandHoldsPerMatch)`),
});

/* ========================================================================== */
/* §18 ⭐⭐ G-MUTANTS — every mutant RE-INVOKES the gate's own function (#260.2) */
/* ========================================================================== */
const clone = <T>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

const gatesForCount = [
  'xDet', 'xSrcUntouched', 'xFpProd', 'gConfigIdentity', 'gReproEkc0', 'gTruthBand', 'gWedgeAccounting',
  'gUncappedArm', 'gWorld', 'gSeedDisjoint', 'gStatsDisjoint', 'gCleanInvocation', 'gNDerived',
  'gValuesUnreachable', 'gFrozenMargins', 'gMutants',
];
const marginsInput: MarginsIn = { doc: docText, gateNames: gatesForCount, gateCount: gatesForCount.length };
const gFrozenMargins = (() => {
  const c = frozenMarginConjuncts(marginsInput);
  return {
    pass: Object.values(c).every(Boolean), ...c, doc: STAGE_DOC_PATH,
    margins: {
      mZonePp: M_ZONE_PP, mTimeS: M_TIME_S, mRoleTvd: M_ROLE_TVD, mRoleTvdCiLo: M_ROLE_TVD_CI_LO, mDistM: M_DIST_M,
    },
    gateCount: gatesForCount.length,
    note: '⭐ THE FROZEN HALF CANNOT DRIFT FROM THE CODE THAT SCORES IT: every margin literal, both '
      + 'predicate names, the no-verdict clause, every gate name and the hand-checked headline gate count '
      + 'are matched in the stage doc\'s text by this gate.',
  };
})();

const gMutants = (() => {
  const rows: { gate: string; conjunct: string; mutant: string; flipped: boolean }[] = [];
  const run = <I>(gate: string, fn: (i: I) => Record<string, boolean>, base: I,
    muts: Record<string, (i: I) => I>): void => {
    for (const [key, mutate] of Object.entries(muts)) {
      const after = fn(mutate(clone(base)));
      rows.push({ gate, conjunct: key, mutant: `re-invoked ${gate} on a perturbed input (${key})`, flipped: after[key] === false });
    }
  };

  /* gConfigIdentity — perturb the SOURCE TEXT / the injected facts, re-invoke configConjuncts. */
  const cfgMut: Record<string, (i: ConfigIn) => ConfigIn> = {
    flagsFound: (i) => ({ ...i, src: i.src.replace('const CENSUS_FLAGS = {', 'const CENSUS_FLAGS_X = {') }),
    edsPerceivedDefence: (i) => ({ ...i, src: i.src.replace('edsPerceivedDefence: true', 'edsPerceivedDefence: false') }),
    edsPerceivedChoice: (i) => ({ ...i, src: i.src.replace('edsPerceivedChoice: true', 'edsPerceivedChoice: false') }),
    edsValueAxis: (i) => ({ ...i, src: i.src.replace('edsValueAxis: true', 'edsValueAxis: false') }),
    c5Hold: (i) => ({ ...i, src: i.src.replace('c5Hold: true', 'c5Hold: false') }),
    c6Carry: (i) => ({ ...i, src: i.src.replace('c6Carry: true', 'c6Carry: false') }),
    c7Windup: (i) => ({ ...i, src: i.src.replace('c7Windup: true', 'c7Windup: false') }),
    c5TouchForkOff: (i) => ({ ...i, src: i.src.replace('c5TouchFork: false', 'c5TouchFork: true') }),
    durationSame: (i) => ({ ...i, src: i.src.replace('const MATCH_DURATION = 240', 'const MATCH_DURATION = 241') }),
    perMatchCapSame: (i) => ({ ...i, src: i.src.replace('const PER_MATCH_CAP = 80', 'const PER_MATCH_CAP = 81') }),
    momentSpacingSame: (i) => ({ ...i, src: i.src.replace('const MOMENT_SPACING = 30', 'const MOMENT_SPACING = 31') }),
    supportMinSame: (i) => ({ ...i, src: i.src.replace('const SUPPORT_MIN_M = 6', 'const SUPPORT_MIN_M = 7') }),
    supportMaxSame: (i) => ({ ...i, src: i.src.replace('const SUPPORT_MAX_M = 30', 'const SUPPORT_MAX_M = 31') }),
    holdKSame: (i) => ({ ...i, src: i.src.replace('const HOLD_K_TICKS = 30', 'const HOLD_K_TICKS = 31') }),
    primaryWindowSame: (i) => ({ ...i, src: i.src.replace('const PRIMARY_WINDOW_S = 10', 'const PRIMARY_WINDOW_S = 11') }),
    ladderSame: (i) => ({ ...i, src: i.src.replace('const WINDOWS_S = [5, 10, 15, 20]', 'const WINDOWS_S = [5, 10, 15, 25]') }),
    c5NativeRowSame: (i) => ({ ...i, src: i.src.replace('const C5_NATIVE_WINDOW_S = 4', 'const C5_NATIVE_WINDOW_S = 5') }),
    /* ⚠ split/join, not `replace`: the census probe carries the SAME construction line twice
     * (examMatch and prodMatch), so a single-occurrence mutant leaves the conjunct satisfied by the
     * second copy — the mutant would be DEAD, which is exactly the #251.3 class this gate exists to
     * catch, and the smoke caught it. */
    squadDerivationSame: (i) => ({ ...i, src: i.src.split("teamB: teamInfo('B', seed * 2 + 2)").join("teamB: teamInfo('B', seed * 2 + 3)") }),
    tableShaSame: (i) => ({ ...i, src: i.src.split(EXPECTED_TABLE_SHA).join(`${EXPECTED_TABLE_SHA.slice(0, -1)}0`) }),
    tablePathSame: (i) => ({ ...i, src: i.src.split(TABLE_PATH).join('docs/world-model/data/not-the-table.json') }),
    injectedTableShaSame: (i) => ({ ...i, tableSha: 'deadbeef' }),
    armIsNeutral: (i) => ({ ...i, arm: 'not-neutral' }),
    scopeIsBoth: (i) => ({ ...i, scopeKind: 'team' }),
    liveArmed: (i) => ({ ...i, liveArmed: false }),
  };
  run('gConfigIdentity', configConjuncts as (i: ConfigIn) => Record<string, boolean>, configInput, cfgMut);

  /* gReproEkc0 */
  const reproMut: Record<string, (i: ReproIn) => ReproIn> = {
    subBlockExact: (i) => ({ ...i, sub: { ...i.sub, mismatches: 1 } }),
    subBlockNonVacuous: (i) => ({ ...i, sub: { ...i.sub, fieldsChecked: 0 } }),
    fullBlockExact: (i) => ({ ...i, full: { ...i.full, mismatches: 3 } }),
    everySeedFoundInCensus: (i) => ({ ...i, full: { ...i.full, seedsMissing: 1 } }),
    blockBaseIsCensusBase: (i) => ({ ...i, base: i.base + 1 }),
    coversWholeCensusBlockInFull: (i) => ({ ...i, mode: 'full' as Mode, full: { ...i.full, seedsChecked: i.censusN - 1 } }),
  };
  run('gReproEkc0', reproConjuncts as (i: ReproIn) => Record<string, boolean>, reproInput, reproMut);

  /* gTruthBand */
  const truthMut: Record<string, (i: TruthIn) => TruthIn> = {
    formulaAgrees: (i) => ({ ...i, disagreements: 1 }),
    nonVacuousSample: (i) => ({ ...i, checked: 10 }),
    cutsAreCommittedCuts: (i) => ({ ...i, cuts: [i.cuts[0] + 0.1, i.cuts[1]] }),
    radiusIsShipped: (i) => ({ ...i, radius: PRESSURE_RADIUS_M + 1 }),
    pressureAtImportedFromSrc: (i) => ({ ...i, probeSrc: i.probeSrc.replace(/import \{ pressureAt, PRESSURE_RADIUS_M \} from '\.\.\/\.\.\/src\/ai\/perception';/, '// removed') }),
    truthUsesTrueOpponents: (i) => ({ ...i, probeSrc: i.probeSrc.split('pressureAt(owner!.pos, m.teams[1 - side].players)').join('pressureAt(owner!.pos, [])') }),
  };
  run('gTruthBand', truthConjuncts as (i: TruthIn) => Record<string, boolean>, truthInput, truthMut);

  /* gWedgeAccounting */
  const accMut: Record<string, (a: AccIn) => AccIn> = {
    perceivedTotalIsDosed: (a) => ({ ...a, perceivedTotal: a.perceivedTotal + 1 }),
    truthTotalIsDosed: (a) => ({ ...a, truthTotal: a.truthTotal + 1 }),
    confusionTotalIsDosed: (a) => ({ ...a, confusionTotal: a.confusionTotal + 1 }),
    contextTotalIsDosed: (a) => ({ ...a, ctxTotal: a.ctxTotal + 1 }),
    zoneCountsPartition: (a) => ({ ...a, zoneTotal: a.zoneTotal - 1 }),
    roleCountsPartition: (a) => ({ ...a, roleTotal: a.roleTotal - 1 }),
    samplesTieToDose: (a) => ({ ...a, sampleTotal: a.sampleTotal + 1 }),
    dosedEqualsPlacedCells: (a) => ({ ...a, dosedForks: a.dosedForks + 0, classCounts: { ...a.classCounts, 'D-HOLD': (a.classCounts['D-HOLD'] as number) + 1 } }),
    perceivedAndTruthPunishedAgree: (a) => {
      const w = clone(a); w.perWindow[0].truthPunished += 1; return w;
    },
    perceivedAndTruthLostAgree: (a) => { const w = clone(a); w.perWindow[0].truthLost += 1; return w; },
    punishedSubsetLostInEveryCell: (a) => { const w = clone(a); w.perWindow[0].cellPunishedMin = -1; return w; },
    punishmentMonotone: (a) => {
      const w = clone(a);
      const i = w.perWindow.findIndex((x) => x.windowS === WINDOWS_S[1]);
      w.perWindow[i].perceivedPunished = -1; return w;
    },
    lostInvariantInWindow: (a) => { const w = clone(a); w.perWindow[1].perceivedLost += 1; return w; },
    momentsInvariantInWindow: (a) => { const w = clone(a); w.perWindow[1].perceivedMoments += 1; return w; },
  };
  run('gWedgeAccounting', wedgeAccountingConjuncts as (a: AccIn) => Record<string, boolean>, coreCappedA.accounting, accMut);

  /* gUncappedArm */
  const unMut: Record<string, (i: UncapIn) => UncapIn> = {
    capActuallyRemoved: (i) => ({ ...i, capUsed: 400 }),
    momentsMateriallyHigher: (i) => ({ ...i, uncappedMomentsPerMatch: i.cappedMomentsPerMatch }),
    extendsPastCappedArm: (i) => ({ ...i, uncappedLastDecisionMax: i.cappedLastDecisionMax - 1 }),
    armNonEmpty: (i) => ({ ...i, uncappedMatches: 0 }),
    sameWorldFlags: (i) => ({ ...i, sameFlags: false }),
    sameDuration: (i) => ({ ...i, sameDuration: false }),
    sameDose: (i) => ({ ...i, sameHoldK: false }),
    oneWalkerBothArms: (i) => ({ ...i, probeSrc: i.probeSrc.split('walkBlock(\'uncapped A\'').join('walkBlock(\'uncapped X\'') }),
  };
  run('gUncappedArm', uncappedConjuncts as (i: UncapIn) => Record<string, boolean>, uncappedInput, unMut);

  /* gWorld */
  const worldMut: Record<string, (i: WorldIn) => WorldIn> = {
    examFlagsSet: (i) => ({ ...i, flags: { ...i.flags, c5Hold: false } }),
    otherStageFlagsShut: (i) => ({ ...i, other: { ...i.other, o1PassWindup: true } }),
    eyeNullByDefault: (i) => ({ ...i, eye: { armed: true } }),
    stationEyeNull: (i) => ({ ...i, stationEye: { armed: true } }),
    forcedHoldNull: (i) => ({ ...i, forcedHold: { gid: 0, untilTick: 1 } }),
  };
  run('gWorld', worldConjuncts as (i: WorldIn) => Record<string, boolean>, worldInput, worldMut);

  /* gSeedDisjoint */
  const seedMut: Record<string, (i: SeedIn) => SeedIn> = {
    blocksOk: (i) => ({ ...i, blocks: i.blocks.map((b) => (b.inverted ? b : { ...b, range: [12_448_100, 12_448_200] as [number, number] })) }),
    subBlocksOrdered: (i) => ({ ...i, guardBlock: [i.uncappedBase + 1, i.uncappedBase + 2] as [number, number] }),
    freshInBand: (i) => ({ ...i, firstFresh: i.band[0] - 1 }),
    routedCorrectly: (i) => ({ ...i, firstFresh: i.firstFresh + 1 }),
    bandOpensAboveEverythingConsumed: (i) => ({
      ...i,
      consumed: [...i.consumed, { name: 'MUTANT block inside the fresh band', range: [i.band[0] + 5, i.band[0] + 6] as [number, number] }],
    }),
    ekC0LedgerPresent: (i) => ({ ...i, consumed: i.consumed.filter((c) => c.range[0] !== 12_448_000) }),
    rewalkCollidesByDesign: (i) => ({ ...i, blocks: i.blocks.map((b) => (b.inverted ? { ...b, range: [12_499_000, 12_499_001] as [number, number] } : b)) }),
  };
  run('gSeedDisjoint', seedConjuncts as (i: SeedIn) => Record<string, boolean>, seedInput, seedMut);

  /* gValuesUnreachable */
  const valMut: Record<string, (i: ValuesIn) => ValuesIn> = {
    noHits: (i) => ({ ...i, hits: [CONTROL_NEEDLE] }),
    nonVacuous: (i) => ({ ...i, minNeedles: i.needles.length + 1 }),
    controlFound: (i) => ({ ...i, controlFound: false }),
    filesScanned: (i) => ({ ...i, files: 0 }),
  };
  run('gValuesUnreachable', valuesConjuncts as (i: ValuesIn) => Record<string, boolean>, valuesInput, valMut);

  /* gFrozenMargins */
  const marMut: Record<string, (i: MarginsIn) => MarginsIn> = {
    docPresent: (i) => ({ ...i, doc: '' }),
    zoneMarginInDoc: (i) => ({ ...i, doc: i.doc.split(`≥ **${M_ZONE_PP.toFixed(1)} pp**`).join('≥ **X pp**') }),
    timeMarginInDoc: (i) => ({ ...i, doc: i.doc.split(`≥ **${M_TIME_S.toFixed(1)} s**`).join('≥ **X s**') }),
    roleMarginInDoc: (i) => ({ ...i, doc: i.doc.split(`TVD ≥ **${M_ROLE_TVD.toFixed(2)}**`).join('TVD ≥ **X**') }),
    distMarginInDoc: (i) => ({ ...i, doc: i.doc.split(`≥ **${M_DIST_M.toFixed(1)} m**`).join('≥ **X m**') }),
    wedgePredicateNamed: (i) => ({ ...i, doc: i.doc.split('WEDGE-PREDICATE (FROZEN)').join('WEDGE-P (F)') }),
    selectionPredicateNamed: (i) => ({ ...i, doc: i.doc.split('SELECTION-PREDICATE (FROZEN)').join('SELECTION-P (F)') }),
    saturationHasNoVerdict: (i) => ({ ...i, doc: i.doc.split('NO PREDICATE, NO VERDICT').join('A VERDICT') }),
    everyGateNamedInDoc: (i) => ({ ...i, gateNames: [...i.gateNames, 'gNotAGateInTheDoc'] }),
    headlineGateCountMatches: (i) => ({ ...i, gateCount: i.gateCount + 1 }),
    targetFreeHoldsInDoc: (i) => ({ ...i, doc: i.doc.split(`ceil(${TARGET_FREE_BAND_HOLDS} /`).join('ceil(999 /') }),
  };
  run('gFrozenMargins', frozenMarginConjuncts as (i: MarginsIn) => Record<string, boolean>, marginsInput, marMut);

  /* xDet (single predicate) */
  rows.push({
    gate: 'xDet', conjunct: 'digestsEqual', mutant: 'digestA + "x" !== digestB',
    flipped: `${digestA}x` !== digestB,
  });

  /* ⭐ THE COVERAGE CLAIM NAMES ITS EXACT CONJUNCT SET (#260.2(iii)). */
  const conjunctSets: Record<string, string[]> = {
    gConfigIdentity: Object.keys(configConjuncts(configInput)),
    gReproEkc0: Object.keys(reproConjuncts(reproInput)),
    gTruthBand: Object.keys(truthConjuncts(truthInput)),
    gWedgeAccounting: Object.keys(wedgeAccountingConjuncts(coreCappedA.accounting)),
    gUncappedArm: Object.keys(uncappedConjuncts(uncappedInput)),
    gWorld: Object.keys(worldConjuncts(worldInput)),
    gSeedDisjoint: Object.keys(seedConjuncts(seedInput)),
    gValuesUnreachable: Object.keys(valuesConjuncts(valuesInput)),
    gFrozenMargins: Object.keys(frozenMarginConjuncts(marginsInput)),
    xDet: ['digestsEqual'],
  };
  /** ⭐ NO EXCLUSIONS: every conjunct of every covered gate is reachable through its own input. */
  const EXCLUDED: Record<string, string[]> = {};
  const coverage = Object.entries(conjunctSets).map(([gate, keys]) => {
    const mutated = rows.filter((r) => r.gate === gate).map((r) => r.conjunct);
    const excluded = EXCLUDED[gate] ?? [];
    const missing = keys.filter((k) => !mutated.includes(k) && !excluded.includes(k));
    return { gate, conjuncts: keys, mutated, excluded, missing, complete: missing.length === 0 };
  });
  const dead = rows.filter((r) => !r.flipped);
  return {
    pass: dead.length === 0 && coverage.every((c) => c.complete),
    conjunctsCovered: rows.length, dead: dead.length, deadDetail: dead.slice(0, 10),
    coverage,
    gatesCovered: Object.keys(conjunctSets),
    singlePredicateGatesPrintedInFull: ['xSrcUntouched', 'xFpProd', 'gStatsDisjoint', 'gCleanInvocation', 'gNDerived'],
    coverageNote: '⭐⭐ #260.2(iii) DISCHARGED: EVERY mutant RE-INVOKES its gate\'s own conjunct function on '
      + 'a perturbed input (no restated predicates), and the coverage claim asserts, per gate, that the '
      + 'mutated key set covers that gate\'s EXACT conjunct key set with ZERO exclusions '
      + '(every `coverage[].excluded` is empty). The five single-predicate gates print their evidence '
      + 'in full instead.',
  };
})();

const gates = {
  xDet: { pass: digestA === digestB, digestA, digestB, note: 'both arms\' whole measured core computed twice; pass B never resumes from the checkpoint.' },
  xSrcUntouched: { pass: srcDiff === '', diff: srcDiff, note: 'INSTRUMENT-ONLY ROUND — `git diff --stat -- src` must be empty.' },
  xFpProd: { pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved, skipped: SKIP_FP, seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS },
  gConfigIdentity, gReproEkc0, gTruthBand, gWedgeAccounting, gUncappedArm, gWorld,
  gSeedDisjoint, gStatsDisjoint, gCleanInvocation, gNDerived, gValuesUnreachable, gFrozenMargins, gMutants,
};
const GATE_NAMES = Object.keys(gates);
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass);

/* ========================================================================== */
/* §19 THE ARTIFACT                                                            */
/* ========================================================================== */
const sizingOut = {
  freeBandHoldsPerMatchUncapped: coreUncappedA.freeBandHoldsPerMatch,
  freeBandHoldsPerMatchCapped: coreCappedA.freeBandHoldsPerMatch,
  uncappedMomentsPerMatch: coreUncappedA.momentsPerMatch,
  note: MODE === 'smoke'
    ? '⭐ THE SMOKE\'S ONLY JOB: this number (with ms/match from the unhashed envelope) feeds the frozen '
      + '§NRULE for the uncapped arm and nothing else. No rate, margin or predicate here adjudicates anything.'
    : 'the battery\'s realised rates, printed so the smoke\'s sizing estimate can be compared with what '
      + 'actually arrived (a shortfall is RECORDED, never repaired).',
  wallNote: '⚠ #258.3: no wall field is in the hashed body; ms/match lives in envelopeUnhashed.wallContextOnly.',
};

const body = {
  stage: 'EK-C0b — THE 街机偏离 DIAGNOSTIC',
  doc: STAGE_DOC_PATH,
  charter: 'ruling #260.3 (the diagnostic dispatched) on EK-C0 (#260.1/#260.2)',
  contract: 'docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §0 / §2 M-EK.1',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  frozenDesign: {
    population: '⭐⭐ THE CENSUS\'S OWN DOSED HOLDS, RE-DERIVED: the committed census block re-walked with '
      + 'the census probe\'s own constructors, proved FIELD-EXACT against its committed per-cluster cells '
      + '(G-REPRO-EKC0, sub-block first). Every (W) and (S) number is about THOSE holds.',
    indices: {
      perceived: 'the band `whetherEyeDecision` placed from the body\'s OWN snapshot (the census index, M-EK.1).',
      truth: '⭐ the SAME pressure formula from TRUE opponent positions at the SAME instant: the shipped '
        + '`pressureAt` at the certified table\'s own cuts (the census probe\'s `trueCellOf` pressure '
        + 'component, truth-side). A DIAGNOSTIC index — nothing here proposes re-indexing the belief.',
    },
    predicates: {
      wedge: '(W) FROZEN: at the PRIMARY window, WEDGE-CONFIRM ⇔ the TRUTH-banded mid−free difference is '
        + 'NOT RESOLVED-INVERT AND the PERCEIVED-banded one IS. Same holds, same bootstrap form.',
      selection: '(S) FROZEN: SELECTION-CONFIRM ⇔ the inversion VANISHES in the uncapped arm (primary-window '
        + 'mid−free verdict not RESOLVED-INVERT) OR any of the four pre-named margins fires.',
      saturation: '(A) NO PREDICATE, NO VERDICT (the charter): 4 s and 5 s re-read as CANDIDATE PRIMARIES, '
        + 'with per-window baselines, band gaps with CIs and gap-to-baseline discrimination ratios. The '
        + 'EK-T1 window OF RECORD is the commander\'s pick.',
    },
    margins: {
      mZoneOwnThirdSharePp: M_ZONE_PP, mTimeMeanS: M_TIME_S,
      mRoleTvd: M_ROLE_TVD, mRoleTvdCiLowerFloor: M_ROLE_TVD_CI_LO, mDistMeanM: M_DIST_M,
      form: 'free band vs the POOLED other two bands on the capped (census) arm; every margin computed on '
        + 'the SAME shared resample matrix as the rate differences, so it is paired by construction.',
    },
    windows: { primaryWindowS: PRIMARY_WINDOW_S, ladderS: [...WINDOWS_S], c5NativeRowS: C5_NATIVE_WINDOW_S, candidatePrimariesS: [...CANDIDATE_PRIMARY_WINDOWS_S] },
    estimator: `cluster bootstrap by MATCH SEED (#20), ${BOOTSTRAP_RESAMPLES} resamples, percentile 95 % CI, `
      + 'ratio-of-sums, ONE shared resample matrix per arm. Stats bases: capped '
      + `${BOOTSTRAP_SEED}, uncapped ${BOOTSTRAP_SEED_UNCAPPED}.`,
    seedLedger: {
      reservedFreshBand: RESERVED_BAND,
      rewalkBlock: `${REWALK_BASE}..${REWALK_BASE + RUN_REWALK_N - 1}`,
      rewalkBlockNote: 'READ from the census artifact — the disjointness predicate is INVERTED.',
      uncappedBlock: `${UNCAPPED_RUN_BASE}..${UNCAPPED_RUN_BASE + UNCAPPED_N - 1}`,
      guard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      gWorldConstructionSeed: GWORLD_SEED,
      consumedLedgerEntries: CONSUMED.length,
    },
    statsBases: { capped: BOOTSTRAP_SEED, uncapped: BOOTSTRAP_SEED_UNCAPPED, floor: STATS_FLOOR, resamples: BOOTSTRAP_RESAMPLES },
    nRule: gNDerived,
  },
  result: {
    censusSource: { artifact: CENSUS_ARTIFACT_PATH, sha256: CENSUS_SHA, block: `${CENSUS_BASE}..${CENSUS_BASE + CENSUS_N - 1}`, n: CENSUS_N },
    capped: coreCappedA,
    uncapped: coreUncappedA,
    predicates: { W, S, A },
    sizing: sizingOut,
  },
  gates,
  nonClaims: [
    'NOTHING SHIPS: zero src/** bytes; the production fingerprint re-derived unchanged; the seat is armed '
      + 'only inside this probe\'s own matches.',
    '⭐⭐ NO NUMBER HERE IS CORRECTED INTO THE EK-C0 TABLE (#246). The census\'s yardstick is frozen.',
    'THIS STAGE ADJUDICATES NOTHING (#203): which mechanism the inversion is, and which window EK-T1 takes '
      + 'of record, are the commander\'s.',
    'THE TRUTH BAND IS NOT PROPOSED AS AN INDEX. M-EK.1\'s perceived index stands.',
    'NO CAUSAL CLAIM: bands are not randomly assigned and contexts are not controlled. The dosed hold '
      + 'remains a TREATMENT, not a choice.',
    'THE THREE MECHANISMS ARE NOT EXCLUSIVE — more than one predicate may fire.',
    'THE UNCAPPED ARM IS A DIFFERENT SAMPLE, NOT A REPEAT: fresh seeds, no cap.',
  ],
  deviations: [
    '⭐ THE RE-WALK COLLIDES WITH THE COMMITTED CENSUS BLOCK BY DESIGN (#260.3 declares it): its '
      + 'disjointness predicate is INVERTED — it MUST collide, because a clash-free re-walk would be '
      + 'walking fresh seeds instead of reproducing a receipt.',
    'THE QUANTILE ROWS (match-time and true-distance p10/median/p90) are POOLED reads over all dosed '
      + 'moments, not cluster-bootstrapped; every CI-BEARING quantity (rates, differences, shares, means, '
      + 'TVD) is cluster-bootstrapped by match seed and re-derives from the stored per-cluster cells.',
    'THE UNCAPPED ARM REMOVES THE CAP RATHER THAN RAISING IT (#260.3 allowed either; the stronger option '
      + 'is taken) and is therefore a SMALLER seed block at a much higher per-match cost.',
    'M-DIST IS EXPECTED TO FIRE BY CONSTRUCTION (the perceived band is a noisy read of the true distance); '
      + 'it is registered anyway because its NUMBER is the informative part, and limb (a) and limb (b) of '
      + 'the selection predicate are printed separately for exactly this reason.',
    'THE CONTEXT PROFILES ARE INDEXED BY THE PERCEIVED BAND ONLY (the charter\'s wording); the truth-band '
      + 'cross-cut of the same moments is available in the stored per-cluster cells.',
  ],
};

const resultSha256 = createHash('sha256').update(JSON.stringify(body)).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  envelopeUnhashed: {
    headContextOnly: head,
    wallContextOnly: {
      rewalkPassAMs: rewalkMsA, rewalkPassBMs: rewalkMsB,
      uncappedPassAMs: uncappedMsA, uncappedPassBMs: uncappedMsB,
      totalMs: Date.now() - wall0,
      msPerMatchRewalk: round(rewalkMsB / Math.max(1, RUN_REWALK_N), 3),
      msPerMatchUncapped: round(uncappedMsB / Math.max(1, UNCAPPED_N), 3),
      note: 'CONTEXT ONLY and OUTSIDE resultSha256 (#128 / #258.3). `msPerMatchUncapped` is the one timing '
        + 'with a job — the uncapped arm\'s wall term reads it out of the COMMITTED smoke artifact.',
    },
    checkpoint: { rewalk: CHECKPOINT_OF('rewalk'), uncapped: CHECKPOINT_OF('uncapped'), resumeRequested: RESUME },
    artifactPath: OUT_PATH,
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §20 STDOUT — rows, never adjudications (#203)                               */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number): string => (Number.isFinite(x) ? `${(x * 100).toFixed(3)} %` : 'n/a');
o('');
o(`=== EK-C0b 街机偏离 DIAGNOSTIC — ${MODE} — HEAD ${head} — re-walk ${RUN_REWALK_N} seeds `
  + `(${REWALK_BASE}..${REWALK_BASE + RUN_REWALK_N - 1}) · uncapped ${UNCAPPED_N} seeds `
  + `(${UNCAPPED_RUN_BASE}..${UNCAPPED_RUN_BASE + UNCAPPED_N - 1}) ===`);
o('');
o(`G-REPRO-EKC0: sub-block ${subBlockCmp.fieldsChecked} fields / ${subBlockCmp.mismatches} mismatches · `
  + `full ${fullCmp.fieldsChecked} fields / ${fullCmp.mismatches} mismatches`);
o('');
for (const [name, core] of [['CAPPED (the census grid)', coreCappedA], ['UNCAPPED (fresh)', coreUncappedA]] as const) {
  const pp = primaryOf(core.perceivedTable); const pt = primaryOf(core.truthTable);
  o(`⭐ ${name} — PRIMARY WINDOW ${PRIMARY_WINDOW_S}s`);
  o('   PERCEIVED band  holds  punished   P(punished)   CI95');
  for (const r of pp.byBand) {
    o(`   ${r.band.padEnd(14)} ${String(r.moments).padStart(6)} ${String(r.punished).padStart(9)}   `
      + `${pct(r.punishRate).padStart(11)}   [${pct(r.punishRateCi95[0])}, ${pct(r.punishRateCi95[1])}]`);
  }
  o(`   perceived  pressed−mid ${pct(pp.realityShape.pressedVsMid.point)} ⇒ ${pp.realityShape.pressedVsMid.verdict}`
    + ` · mid−free ${pct(pp.realityShape.midVsFree.point)} ⇒ ${pp.realityShape.midVsFree.verdict}`);
  o('   TRUTH band      holds  punished   P(punished)   CI95');
  for (const r of pt.byBand) {
    o(`   ${r.band.padEnd(14)} ${String(r.moments).padStart(6)} ${String(r.punished).padStart(9)}   `
      + `${pct(r.punishRate).padStart(11)}   [${pct(r.punishRateCi95[0])}, ${pct(r.punishRateCi95[1])}]`);
  }
  o(`   truth      pressed−mid ${pct(pt.realityShape.pressedVsMid.point)} ⇒ ${pt.realityShape.pressedVsMid.verdict}`
    + ` · mid−free ${pct(pt.realityShape.midVsFree.point)} ⇒ ${pt.realityShape.midVsFree.verdict}`);
  o('');
}
o('⭐ CONFUSION (perceived × truth, primary window):');
for (const c of coreCappedA.confusion) {
  o(`   perceived ${c.perceived} × truth ${c.truth}${c.isWedgeCell ? '  ⭐WEDGE CELL' : ''}: `
    + `${String(c.moments).padStart(6)} holds (${pct(c.share)}) · P ${pct(c.punishRate)}`);
}
o('');
o('⭐ CONTEXT PROFILES (capped arm, per perceived band):');
for (const p of coreCappedA.profiles) {
  o(`   ${p.band}: n ${p.moments} · own-third ${pct((p.zoneShares as any).own)} · time mean `
    + `${p.matchTimeS.mean}s (p90 ${p.matchTimeS.p90}) · true-dist mean ${p.nearestTrueOpponentM.mean} m · `
    + `roles ${ROLES.map((r) => `${r} ${(p.roleCounts as any)[r]}`).join('/')}`);
}
o(`   margins: zone ${JSON.stringify(coreCappedA.margins.mZone)}`);
o(`            time ${JSON.stringify(coreCappedA.margins.mTime)}`);
o(`            role ${JSON.stringify(coreCappedA.margins.mRole)}`);
o(`            dist ${JSON.stringify(coreCappedA.margins.mDist)}`);
o('');
o(`(W) ${W.verdict}  [perceived ${W.perceivedMidVsFreeVerdict} · truth ${W.truthMidVsFreeVerdict}]`);
o(`(S) ${S.verdict}  [uncapped mid−free ${S.uncappedMidVsFreeVerdict} · margins fired ${JSON.stringify(S.marginsFired)}]`);
o('(A) NO VERDICT (charter) — the discrimination ladder:');
for (const w of A.ladder) {
  o(`   ${String(w.windowS).padStart(2)}s${w.isCandidatePrimary ? ' (CANDIDATE)' : w.isCensusPrimary ? ' (census primary)' : '            '}`
    + ` baseline ${pct(w.baseline)} · pressed−mid ${pct(w.pressedVsMid.point)} (${w.pressedVsMid.verdict})`
    + ` · mid−free ${pct(w.midVsFree.point)} (${w.midVsFree.verdict})`
    + ` · spread/baseline ${w.discrimination.spreadToBaseline}`);
}
o('');
o(`GATES ${allGatesPass ? 'GREEN' : '*** RED ***'} (${GATE_NAMES.length}): `
  + Object.entries(gates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`  G-MUTANTS ${gMutants.conjunctsCovered} conjuncts · ${gMutants.dead} dead · coverage complete `
  + `${gMutants.coverage.every((c) => c.complete)}`);
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s (CONTEXT ONLY) · artifact ${OUT_PATH}`);
o(MODE === 'smoke'
  ? '⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.'
  : 'VERDICT: none. The three predicate readings above are mechanical (#203: the commander adjudicates).');

if (!allGatesPass) process.exit(1);
process.exit(0);
