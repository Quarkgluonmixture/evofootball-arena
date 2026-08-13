/**
 * EK T1 — THE HOLD CONVERGENCE EXAM (docs/world-model/EK-T1-HOLD-CONVERGENCE-EXAM.md).
 *
 * H-EK is scored here. Contract EK-HOLD-EARNED-BELIEF-CONTRACT.md §1/§3 under commander
 * ruling #262.3 (the #257.3 exam frame replayed on the hold family: the DRILL world, the
 * LEARN-ONLY arm as the scored one, LEARN+VETO reported, OFF the identity anchor, the
 * SHARPENED conjunction predicate, M/R/τ sized EX ANTE), governed by #261.3's four picks
 * (W = 10 s · the MEASURED target shape `free > pressed > mid` · the dosed-drill
 * training-ground venue · the zero-constant comparative veto).
 *
 * ⭐ INSTRUMENT-ONLY ROUND: `src/**` is byte-untouched (X-SRC-UNTOUCHED is a HARD gate).
 * ⭐ #247: this probe may READ the committed censuses; `src/**` may not (G-VALUES-UNREACHABLE).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE, in the #262.2 THIRD-VISIT form:
 *   accepted: EKT1_MODE (smoke|full, REQUIRED) · EKT1_R · EKT1_M · EKT1_SKIP_FP · EKT1_OUT.
 *   ANY other `EKT1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors
 *   (EDS_BUNDLE · EDS_TRACE_CHOICE · EMERGENT_POS · the constants.ts scale doors) being set —
 *   the engine doors are inside the refuse-scan, not outside it (#262.2(2a)).
 *   ⭐ EKT1_OUT is an OVERRIDE (#262.2(2b)): an output-path override is a PREFLIGHT, so it
 *   routes onto the guard block, may never write a canonical repo path, and reds G-ENV-CLEAN.
 *
 * RUN: EKT1_MODE=full npx tsx scripts/probes/ek-t1-hold-convergence-exam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import {
  appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { join, resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import {
  EK_HOLD_BANDS, EK_HOLD_WINDOW_S, HoldAccountBook, HoldLabelLedger,
} from '../../src/ai/holdAccountBook';
import type { RecensusCostTable, WhetherEyeConfig } from '../../src/ai/whetherEye';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { mtArmedVersion, MT_WORLD_FLAGS } from '../../src/game/a4World';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ⭐ ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)     */
/* ========================================================================== */
const ENV_WHITELIST = ['EKT1_MODE', 'EKT1_R', 'EKT1_M', 'EKT1_SKIP_FP', 'EKT1_OUT'] as const;
/** ⭐ #262.2(2a): the ENGINE's own env doors are INSIDE the refuse-scan. */
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'EMERGENT_POS', 'PITCH_SCALE',
  'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('EKT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('EK-T1 FATAL — refused env surface. '
    + `rogue EKT1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')}; the engine doors must be UNSET `
    + '(whitelist-or-refuse, #261.2 + #262.2(2a)).');
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.EKT1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`EK-T1 FATAL — EKT1_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v !== undefined
  ? Math.max(1, Number.parseInt(v, 10)) : null);
const R_ENV = intEnv(process.env.EKT1_R);
const M_ENV = intEnv(process.env.EKT1_M);
const SKIP_FP = process.env.EKT1_SKIP_FP === '1';
const OUT_ENV = process.env.EKT1_OUT;
/** ⭐ EVERY override that changes WHAT IS MEASURED **or WHERE IT LANDS** is a PREFLIGHT. */
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'EKT1_R', set: R_ENV !== null },
  { name: 'EKT1_M', set: M_ENV !== null },
  { name: 'EKT1_SKIP_FP', set: SKIP_FP },
  { name: 'EKT1_OUT', set: OUT_ENV !== undefined },
];
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
/** MODE is NOT an override — each mode owns its OWN canonical artifact (the EK-C0 family form). */
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/ek-t1-hold-convergence-exam-smoke.json',
  full: 'docs/world-model/data/ek-t1-hold-convergence-exam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/ek-t1-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('EK-T1 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}
const CHECKPOINT_PATH = `/tmp/ek-t1-checkpoint-${MODE}.jsonl`;

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — every literal machine-checked by G-N                 */
/* ========================================================================== */
/** ⭐ INSTRUMENT-SIDE ONLY (#247): the probe may read the TRUE tables; `src/**` may not. */
const EKC0_PATH = 'docs/world-model/data/ek-c0-hold-outcome-census.json';
const EKC0B_PATH = 'docs/world-model/data/ek-c0b-inversion-diagnostic.json';
const EKT0_PATH = 'docs/world-model/data/ek-t0-hold-belief-seam.json';
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';

/** replicates; each replicate is ONE persistent `ekHoldBooks` set = 2 books. */
const R_FROZEN = 20;
/** matches per replicate — the ex-ante sized run length (FROZEN before the battery). */
const M_FROZEN = 180;
/** the ordered-book-share threshold, frozen ≥ 0.9 (#257.3(c) replayed by #262.3). */
const TAU = 0.90;
/** the ex-ante power target for the CONJUNCTION under census-true rates. */
const POWER_TARGET = 0.80;
/** the M search grid the N rule minimises over. */
const M_GRID_STEP = 20;
const M_GRID_MAX = 600;
/** the frozen LEARNING-CURVE checkpoints (logarithmic in M, ending at M*). */
const CHECKPOINTS: readonly number[] = [10, 20, 40, 80, 160, 180];
/** the wall cap, declared ex ante, at a DECLARED (not measured) ms/walk — no timing may
 *  enter the hashed body (#258.3), so the nominal rate is a design literal, not a reading. */
const WALL_CAP_S = 7200;
const NOMINAL_MS_PER_WALK = 150;
/** the seed-room cap: the pre-registered battery band's size. */
const SEED_ROOM = 9000;

/** the sizing outputs, FROZEN before the battery (G-N recomputes and compares). */
const FROZEN_SIZING = {
  deff: 1.613402,
  designHoldRates: [3.386395, 2.318716, 12.592659],
  censusRates: [0.794118, 0.694696, 0.748329],
  smokeRates: [0.762821, 0.790909, 0.785978],
  mStar: 180,
  qPerBook: 0.932118,
  limbIPower: 1,
  limbIIPowerConservative: 0.849218,
  limbIIPowerIndependent: 0.86755,
  conjunctionPowerConservative: 0.849218,
  mdeFreeMinusPressedPp: 4.2669,
} as const;

/* ---- the frozen league-identity baseline (inherited UNTRUNCATED) ------------------- */
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/* ---- the drill world of record — EK-C0's committed exam configuration, verbatim ---- */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
const MATCH_DURATION = 240;
const MOMENT_SPACING = 30;
const HOLD_K_TICKS = 30;
/** the training ground's tempo, DERIVED from the census's own two constants (EK-T0 §DEV 3). */
const DRILL_SPACING = HOLD_K_TICKS + MOMENT_SPACING;

/* ---- the guard tolerances, inherited VERBATIM from DV-T1/#251 --------------------- */
const NI_FRACTION = 1 - 0.275 / 0.380;
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;

/* ---- the estimator ---------------------------------------------------------------- */
const BOOTSTRAP = 2000;
const STATS_BASE = 109_000;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800,
];

/* ---- §SEED LEDGER (#163) ---------------------------------------------------------- */
const CORE_BASE = 12_451_000; //     12,451,000–011 the core + sampler-inertness twin
const CORE_N = 12;
const SMOKE_BATTERY_BASE = 12_451_100; // the smoke MODE's own battery sub-block
const GUARD_BASE = 12_451_050; //    12,451,050–099 the preflight/guard block
const GUARD_SPAN = 50;
const GWORLD_SEED = 12_451_999; //   constructed, never stepped
const BATTERY_BASE = 12_452_000; //  12,452,000 + r·M + i
/** ⭐ A RE-WALK, NOT A CONSUMPTION: EK-T0's own committed smoke block, replayed
 *  deterministically to measure the label's cluster size (the EK-C0b re-walk idiom). */
const DEFF_REWALK_BASE = 12_450_100;
const DEFF_REWALK_N = 20;

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
  { name: 'EK-C0 census band (#259.3/#260.4)', range: [12_448_000, 12_448_999] },
  { name: 'EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
  {
    name: '⭐ EK-T0 seam band (#261.4/#262) — THE BLOCK THIS STAGE RE-WALKS (never consumes)',
    range: [12_450_000, 12_450_999],
  },
];

const R = IS_PREFLIGHT ? (R_ENV ?? 2) : (MODE === 'smoke' ? 2 : R_FROZEN);
const M = IS_PREFLIGHT ? (M_ENV ?? 6) : (MODE === 'smoke' ? 20 : M_FROZEN);
const seedOf = (r: number, i: number): number => {
  if (IS_PREFLIGHT) return GUARD_BASE + ((r * M + i) % GUARD_SPAN);
  return (MODE === 'smoke' ? SMOKE_BATTERY_BASE : BATTERY_BASE) + r * M + i;
};

/* ========================================================================== */
/* §2 SMALL TOOLS                                                             */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0
  ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  const idx = (s.length - 1) * q;
  const lo = Math.floor(idx); const hi = Math.ceil(idx);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (idx - lo);
};
const readJson = (p: string): Record<string, unknown> =>
  JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;

/* ========================================================================== */
/* §3 THE WORLD — the DRILL world of record (#261.3(iii))                     */
/* ========================================================================== */
const tableRaw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (tableRaw.tableSha !== EXPECTED_TABLE_SHA) {
  console.error(`EK-T1 FATAL — certified table SHA drift: ${tableRaw.tableSha}`);
  process.exit(2);
}
const tableParams = tableRaw.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: tableParams.pressureBands, staleBands: tableParams.staleBands,
  supportCuts: tableParams.supportCuts, supportWindowM: tableParams.supportWindowM,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cells: tableRaw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper,
      reachesZero: k.reachesZero,
    })),
  })),
};
const EYE_CONFIG: WhetherEyeConfig = { arm: 'neutral', scope: { kind: 'both' }, table: TABLE };
/** the cells the certified table LICENSES — the no-subsidy reference (R-B, #64.1). */
const LICENSED_CELLS = new Set(
  TABLE.cells.filter((c) => c.costs.some((k) => k.reachesZero))
    .map((c) => `${c.pressureBand}|${c.staleBand}|${c.supportBand}`),
);

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
type Arm = 'off' | 'learnOnly' | 'learnVeto';
type Books = readonly [HoldAccountBook, HoldAccountBook];
const matchOf = (seed: number, arm: Arm, books: Books | null): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS,
    ...(arm === 'off' ? {} : { ekHoldLearn: true }),
    ...(arm === 'off' || books === null ? {} : { ekHoldBooks: books }),
    ...(arm === 'learnVeto' ? { ekHoldVeto: true } : {}),
  });
  m.whetherEye = EYE_CONFIG;
  return m;
};

/**
 * ⭐ THE TRAINING-GROUND DRILL DRIVER — EK-T0's own definition, verbatim (its §DEV 1/3):
 * PUBLIC STATE ONLY, two-phase (arm at a decision moment, dose on the next tick so the band
 * lag is exactly one tick), one dose at a time, cadence `HOLD_K_TICKS + MOMENT_SPACING`.
 * It is a property of the WORLD, not of the learning door: every arm doses the same way.
 */
class DrillDriver {
  private since = DRILL_SPACING;

  private pending: number | null = null;

  preStep(m: Match): void {
    this.since += 1;
    if (m.forcedHold !== null && m.simTick >= m.forcedHold.untilTick) m.forcedHold = null;
    const owner: Player | null = m.ball.owner;
    if (m.phase !== 'playing' || owner === null || owner.role === 'GK' || owner.sentOff
      || m.forcedHold !== null) {
      this.pending = null;
      return;
    }
    if (this.pending !== null && owner.gid === this.pending) {
      m.forcedHold = { gid: owner.gid, untilTick: m.simTick + HOLD_K_TICKS };
      this.pending = null;
      this.since = 0;
      return;
    }
    this.pending = owner.decisionTimer <= 0 && this.since >= DRILL_SPACING ? owner.gid : null;
  }
}

/** The whole-match signature, INCLUDING the rng stream state (the banked form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));
/**
 * ⭐ every commitment the armed seat made — the NO-SUBSIDY read (public state).
 * ⚠ IT MUST BE SAMPLED DURING THE WALK: `whetherHoldState` entries are DELETED by `Match` the
 * tick a commitment ends, so reading the map at the whistle is a VACUOUS read (measured: zero
 * commitments over a whole battery). The walker therefore collects the live entries every tick.
 */
const holdCellsOf = (m: Match): string[] =>
  [...m.whetherHoldState.values()].map((c) => c.cellAtDecision);

/* ---- ⭐ THE CONFIGURATION-IDENTITY PREDICATE, DERIVED FOR THIS EXAM -------- */
const DOOR_FLAGS = ['ptpPassLead', 'dlcDeliveryChoice', 'dlcStrikePlane', 'obmMovement',
  'ctbSupportPlane', 'o1PassWindup', 'pmPhaseModulation', 'mtMarkTightness', 'ptpPassToPath',
  'ctbCheckToBall', 'dvLearnedMap', 'dvDeliveryValue'] as const;
const GENE_NEEDLES = ['defLaneConvergence', 'markSag', 'passLeadSupport', 'obmMoveWeights',
  'ctbSupportPlane', 'dlcStrikePlaneGene', 'dvExposureWeight', 'dvLossBelief',
  'ekHoldBelief'] as const;
const genomeViews = (m: Match): Record<string, unknown>[] => ([0, 1] as const).flatMap((s) => [
  m.teams[s].info.genome, m.teams[s].baseGenome, m.teams[s].effGenome,
] as unknown as Record<string, unknown>[]);
const armConjuncts = (m: Match, arm: Arm, books: Books | null, seed: number)
: Record<string, boolean> => {
  const mm = m as unknown as Record<string, unknown>;
  const mtKeys = Object.keys(MT_WORLD_FLAGS) as (keyof typeof MT_WORLD_FLAGS)[];
  const ledger = (m as unknown as { ekHold: HoldLabelLedger | null }).ekHold;
  return {
    learnFlag: m.ekHoldLearn === (arm !== 'off'),
    vetoFlag: m.ekHoldVeto === (arm === 'learnVeto'),
    booksWired: arm === 'off'
      ? ledger === null
      : (books !== null && ledger !== null && ledger.books === books),
    drillWorld: (Object.keys(CENSUS_FLAGS) as (keyof typeof CENSUS_FLAGS)[])
      .every((k) => mm[k] === CENSUS_FLAGS[k]),
    eyeArmed: m.whetherEye !== null && m.whetherEye === EYE_CONFIG,
    // ⚠ the MT world-flag set OVERLAPS the drill world's own census flags (the two percept
    // doors are members of both), so the MT limb is scoped to the flags the DRILL WORLD does
    // NOT arm — declared, and the census flags are gated in their own conjunct above.
    doorsShut: DOOR_FLAGS.every((k) => mm[k] !== true)
      && mtKeys.filter((k) => !(k in CENSUS_FLAGS)).every((k) => mm[k] !== true)
      && mtArmedVersion(m) === 0 && m.stationEye === null,
    // ⭐ THE LAMARCK LIMB, in its EK form: this seam has NO GENE AT ALL, in any arm or view.
    noGene: genomeViews(m).every((g) => GENE_NEEDLES.every((k) => g[k] === undefined)),
    censusConstruction: canonical(m.teams[0].info.genome) === canonical(team('A', seed * 2 + 1).genome)
      && canonical(m.teams[1].info.genome) === canonical(team('B', seed * 2 + 2).genome),
  };
};

interface GuardRow {
  interceptions: number; offsides: number; goals: number;
  spreadYOut: number; spacingMedian: number; spacingUnder4: number;
}
interface WalkOut {
  signature: string; guards: GuardRow; armOk: boolean;
  holds: number; drills: number; takes: number; unbanded: number;
  vetoes: number; labelsClosed: number; cellsLicensed: boolean; commitments: number;
}
/** the walk. `sample=false` gives the BARE walk (the sampler-inertness twin). */
const walk = (seed: number, arm: Arm, books: Books | null, sample = true): WalkOut => {
  const m = matchOf(seed, arm, books);
  const armOk = Object.values(armConjuncts(m, arm, books, seed)).every(Boolean);
  const driver = new DrillDriver();
  const pairs: number[] = [];
  const spreadOut: number[] = [];
  let samples = 0; let tick = 0;
  const commitments = new Set<string>();
  while (!m.finished) {
    driver.preStep(m);
    m.step(DT);
    tick += 1;
    for (const c of holdCellsOf(m)) commitments.add(c);
    if (!sample) continue;
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      if (m.possessionSide !== (t.side as 0 | 1)) {
        const ys = outfield.map((p) => p.pos.y);
        const mu = mean(ys);
        spreadOut.push(Math.sqrt(ys.reduce((a, b) => a + (b - mu) ** 2, 0) / ys.length));
      }
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            pairs.push(Math.hypot(
              outfield[i].pos.x - outfield[j].pos.x, outfield[i].pos.y - outfield[j].pos.y,
            ));
          }
        }
      }
    }
  }
  const st = [m.teams[0].stats, m.teams[1].stats];
  const led = (m as unknown as { ekHold: HoldLabelLedger | null }).ekHold;
  const cells = [...commitments];
  return {
    signature: signature(m),
    armOk,
    holds: led === null ? 0 : led.takeHolds + led.drillHolds,
    drills: led?.drillHolds ?? 0,
    takes: led?.takeHolds ?? 0,
    unbanded: led?.drillHoldsUnbanded ?? 0,
    vetoes: led?.vetoes ?? 0,
    labelsClosed: led?.closedLabels ?? 0,
    cellsLicensed: cells.every((c) => LICENSED_CELLS.has(c)),
    commitments: cells.length, // DISTINCT commitment cells seen live in this match
    guards: {
      interceptions: st[0].interceptions + st[1].interceptions,
      offsides: st[0].offsides + st[1].offsides,
      goals: st[0].goals + st[1].goals,
      spreadYOut: mean(spreadOut),
      spacingMedian: quantile(pairs, 0.5),
      spacingUnder4: pairs.length === 0 ? Number.NaN
        : pairs.filter((v) => v < CLOSE_PAIR_M).length / pairs.length,
    },
  };
};

/* ========================================================================== */
/* §4 THE EX-ANTE SIZING — recomputed FROM the committed artifacts             */
/* ========================================================================== */
const ekc0 = readJson(EKC0_PATH);
const ekt0 = readJson(EKT0_PATH);
const ekc0Census = ((ekc0.result as Record<string, unknown>).census
  ?? {}) as Record<string, unknown>;
const yardstick = ekc0Census.yardstick as {
  schema: string; windowS: number; holdTicks: number; bandCuts: number[];
  bands: Record<string, { punishRate: number; holds: number; punished: number;
    ci95: [number, number] }>;
  relative: Record<string, number>; ordering: string[];
};
const ekt0Smoke = ekt0.smoke as {
  matches: number;
  rows: { band: string; label: string; bookHolds: number; bookPunished: number }[];
};
/** ⭐ THE BOOK'S OWN BAND ORDER (the seat's): 0 free · 1 mid · 2 pressed. */
const BANDS = ['p0', 'p1', 'p2'] as const;
const BAND_LABEL = ['free', 'mid', 'pressed'] as const;
/** ⭐ THE TARGET SHAPE OF RECORD (#261.3(ii)) — the MEASURED truth: free > pressed > mid. */
const isOrdered = (v: readonly number[]): boolean => v[0] > v[2] && v[2] > v[1];

/** ⭐ RELATIVES AND RATES FROM RAW COUNTS, never from a stored rounded rate. */
const rateFromCounts = (punished: number, holds: number): number => (holds > 0
  ? punished / holds : 0);
const censusRates = BANDS.map((b) => rateFromCounts(
  yardstick.bands[b].punished, yardstick.bands[b].holds,
));
const censusRelative = ((): number[] => {
  const mu = mean(censusRates);
  return censusRates.map((r) => r / mu);
})();
const smokeTeamMatches = ekt0Smoke.matches * 2;
const smokeRow = (b: string): { bookHolds: number; bookPunished: number } => {
  const row = ekt0Smoke.rows.find((r) => r.band === b);
  return { bookHolds: row?.bookHolds ?? 0, bookPunished: row?.bookPunished ?? 0 };
};
const smokeRates = BANDS.map((b) => rateFromCounts(smokeRow(b).bookPunished, smokeRow(b).bookHolds));
const smokeHoldRates = BANDS.map((b) => smokeRow(b).bookHolds / smokeTeamMatches);
/** EK-C0's own per-band moments — GRID-LIMITED (its artifact says so), published beside. */
const censusMomentRates = BANDS.map((b) => {
  const rows = (ekc0Census.eventRateMoments as {
    byBand: { band: string; censusMomentsPerTeamPerMatch: { mean: number } }[] }).byBand;
  return rows.find((r) => r.band === b)?.censusMomentsPerTeamPerMatch.mean ?? Number.NaN;
});

/* ---- normal / binomial machinery ------------------------------------------ */
const erf = (x0: number): number => {
  const s = x0 < 0 ? -1 : 1; const x = Math.abs(x0);
  const a1 = 0.254829592; const a2 = -0.284496736; const a3 = 1.421413741;
  const a4 = -1.453152027; const a5 = 1.061405429; const p = 0.3275911;
  const t = 1 / (1 + p * x);
  return s * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
};
const normCdf = (z: number): number => 0.5 * (1 + erf(z / Math.SQRT2));
/** the one-sided 95 % normal quantile, SOLVED (not typed) — no invented literal. */
const zFor = (p: number): number => {
  let lo = 0; let hi = 6;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (normCdf(mid) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
};
const Z95 = zFor(0.95);
const Z975 = zFor(0.975);
const binomPmf = (n: number, p: number): Float64Array => {
  const out = new Float64Array(n + 1);
  out[0] = Math.exp(n * Math.log1p(-p));
  let lc = 0;
  for (let k = 1; k <= n; k++) {
    lc += Math.log((n - k + 1) / k);
    out[k] = Math.exp(lc + k * Math.log(p) + (n - k) * Math.log1p(-p));
  }
  return out;
};
const cdfOf = (pmf: Float64Array): Float64Array => {
  const c = new Float64Array(pmf.length);
  let s = 0;
  for (let i = 0; i < pmf.length; i++) { s += pmf[i]; c[i] = s; }
  return c;
};

/* ---- ⭐⭐ THE CLUSTER DESIGN EFFECT, MEASURED by re-walking EK-T0's block --- */
/**
 * The hold label is CLUSTER-level in the drill world: one possession loss closes EVERY open
 * label of that team, so the punished count is over-dispersed relative to binomial. The
 * inflation is measured by RE-WALKING EK-T0's own committed smoke block (a deterministic
 * replay of a committed parent, not a fresh consumption) and counting punished labels per
 * DISTINCT punishing loss. It is an equal-cluster LOWER bound, exactly as DV-T2-T1's was.
 */
const measureDeff = (): Record<string, unknown> => {
  let punished = 0;
  const clusters = new Set<string>();
  let holds = 0;
  const perBandHolds = [0, 0, 0];
  for (let i = 0; i < DEFF_REWALK_N; i++) {
    const seed = DEFF_REWALK_BASE + i;
    const books: [HoldAccountBook, HoldAccountBook] = [
      new HoldAccountBook(), new HoldAccountBook(),
    ];
    const m = matchOf(seed, 'learnOnly', books);
    const driver = new DrillDriver();
    const losses: { tSim: number; loser: number }[] = [];
    let cur: number | null = null;
    const observe = (): void => {
      if (m.phase !== 'playing') { cur = null; return; }
      const owner = m.ball.owner;
      if (owner === null) return;
      if (cur !== null && cur !== owner.side) losses.push({ tSim: m.simTime, loser: cur });
      cur = owner.side;
    };
    while (!m.finished) { observe(); driver.preStep(m); m.step(DT); }
    observe();
    const led = (m as unknown as { ekHold: HoldLabelLedger }).ekHold;
    for (const h of led.noted) {
      holds += 1;
      perBandHolds[h.band] += 1;
      let first: number | null = null;
      for (const l of losses) {
        if (l.tSim < h.tSim || l.loser !== h.side) continue;
        first = l.tSim; break;
      }
      if (first !== null && first <= h.tSim + EK_HOLD_WINDOW_S) {
        punished += 1;
        clusters.add(`${seed}|${h.side}|${first}`);
      }
    }
  }
  return {
    matches: DEFF_REWALK_N,
    block: [DEFF_REWALK_BASE, DEFF_REWALK_BASE + DEFF_REWALK_N - 1],
    holds,
    perBandHolds,
    punishedLabels: punished,
    distinctPunishingLosses: clusters.size,
    deff: clusters.size > 0 ? punished / clusters.size : 1,
  };
};
const deffRows = measureDeff();
const DEFF = deffRows.deff as number;

/**
 * ⭐ THE CONSERVATIVE HOLD RATE, PER BAND. The two committed sources measure DIFFERENT
 * venues: EK-C0's `censusMomentsPerTeamPerMatch` is a GRID-LIMITED count in the clone-dosing
 * census (its own artifact says so), while EK-T0's smoke is the only measurement of THIS
 * exam's venue (the drill world). The design rate is therefore the drill world's own,
 * conservatively bounded at its ONE-SIDED 95 % lower limit (Poisson, on the committed
 * counts), and the census's grid-limited rate is published beside — never merged.
 */
const designHoldRates = BANDS.map((b) => {
  const n = smokeRow(b).bookHolds;
  return Math.max(0, (n - Z95 * Math.sqrt(n)) / smokeTeamMatches);
});
/** effective per-band book counts at M matches (the cluster design effect applied). */
const nEff = (m: number): number[] => designHoldRates
  .map((d) => Math.max(1, Math.round((d * m) / DEFF)));
/** ⭐ q(M) — the probability ONE book is STRICTLY ordered free > pressed > mid.
 *  Exact binomial convolution over the PRESSED band (the ordering's middle term). */
const qPerBook = (m: number, rates: readonly number[]): number => {
  const n = nEff(m);
  const pmf = n.map((nn, i) => binomPmf(nn, rates[i]));
  const cdf = pmf.map(cdfOf);
  let tot = 0;
  for (let kp = 0; kp <= n[2]; kp++) {
    const pp = pmf[2][kp];
    if (pp < 1e-15) continue;
    const rp = kp / n[2];
    // free strictly ABOVE the pressed rate
    const thrF = rp * n[0];
    let kF = Math.floor(thrF);
    if (Math.abs(thrF - Math.round(thrF)) < 1e-9) kF = Math.round(thrF);
    const pF = kF >= n[0] ? 0 : 1 - cdf[0][Math.min(kF, n[0])];
    // mid strictly BELOW the pressed rate
    const thrM = rp * n[1];
    let kM = Math.ceil(thrM) - 1;
    if (Math.abs(thrM - Math.round(thrM)) < 1e-9) kM = Math.round(thrM) - 1;
    const pM = kM < 0 ? 0 : cdf[1][Math.min(kM, n[1])];
    tot += pp * pF * pM;
  }
  return tot;
};
/** P(observed ordered share over B books ≥ τ). */
const sharePower = (b: number, q: number, tau: number): number => {
  const need = Math.ceil(tau * b);
  const pmf = binomPmf(b, q);
  let s = 0;
  for (let k = need; k <= b; k++) s += pmf[k];
  return s;
};
/** LIMB (i): BOTH replicate-mean gaps RESOLVED at SET grain (cluster = replicate). */
const limbIPower = (m: number, r: number, rates: readonly number[]): number => {
  const n = nEff(m);
  const v = (p: number, nn: number): number => (p * (1 - p)) / nn;
  const sdFreePressed = Math.sqrt(v(rates[0], n[0]) + v(rates[2], n[2]));
  const sdPressedMid = Math.sqrt(v(rates[2], n[2]) + v(rates[1], n[1]));
  // CONSERVATIVE: the two books of a replicate are treated as ONE cluster (√R, not √2R).
  const p1 = normCdf((rates[0] - rates[2]) / (sdFreePressed / Math.sqrt(r)) - Z975);
  const p2 = normCdf((rates[2] - rates[1]) / (sdPressedMid / Math.sqrt(r)) - Z975);
  return Math.min(p1, p2);
};
const conjunctionPower = (m: number, r: number, rates: readonly number[]): number =>
  limbIPower(m, r, rates) * sharePower(r, qPerBook(m, rates), TAU);

const sizing = ((): Record<string, unknown> => {
  const grid: { m: number; powerCensus: number; powerSmoke: number }[] = [];
  let mRaw = Number.NaN;
  for (let m = M_GRID_STEP; m <= M_GRID_MAX; m += M_GRID_STEP) {
    const pc = conjunctionPower(m, R_FROZEN, censusRates);
    const ps = conjunctionPower(m, R_FROZEN, smokeRates);
    grid.push({ m, powerCensus: round(pc, 6), powerSmoke: round(ps, 6) });
    if (!Number.isFinite(mRaw) && pc >= POWER_TARGET) mRaw = m;
  }
  const seedCap = Math.floor(SEED_ROOM / R_FROZEN);
  const wallCap = Math.floor((WALL_CAP_S * 1000) / (R_FROZEN * 3 * NOMINAL_MS_PER_WALK));
  const mStar = Math.min(mRaw, seedCap, wallCap);
  /** the MDE: the free−pressed gap shrunk until the conjunction loses 80 % power at M*. */
  const mde = ((): number => {
    for (let g = censusRates[0] - censusRates[2]; g > 0.0005; g -= 0.00002) {
      const rates = [censusRates[2] + g, censusRates[1], censusRates[2]];
      if (conjunctionPower(mStar, R_FROZEN, rates) < POWER_TARGET) {
        return round((g + 0.00002) * 100, 4);
      }
    }
    return Number.NaN;
  })();
  return {
    deff: round(DEFF, 6),
    deffMeasurement: deffRows,
    designHoldRates: designHoldRates.map((v) => round(v, 6)),
    smokeHoldRates: smokeHoldRates.map((v) => round(v, 6)),
    censusMomentRatesGridLimited: censusMomentRates.map((v) => round(v, 6)),
    censusRates: censusRates.map((v) => round(v, 6)),
    censusRelative: censusRelative.map((v) => round(v, 6)),
    smokeRates: smokeRates.map((v) => round(v, 6)),
    censusGapFreeMinusPressedPp: round((censusRates[0] - censusRates[2]) * 100, 4),
    censusGapPressedMinusMidPp: round((censusRates[2] - censusRates[1]) * 100, 4),
    nEffAtMStar: nEff(mStar),
    grid,
    mRaw,
    seedCap,
    seedCapBinds: seedCap < mRaw,
    wallCap,
    wallCapBinds: wallCap < mRaw,
    wallCapFormula: `floor(${WALL_CAP_S}·1000 / (R · 3 arms · ${NOMINAL_MS_PER_WALK} ms nominal))`,
    mStar,
    qPerBook: round(qPerBook(mStar, censusRates), 6),
    limbIPower: round(limbIPower(mStar, R_FROZEN, censusRates), 6),
    limbIIPowerConservative: round(sharePower(R_FROZEN, qPerBook(mStar, censusRates), TAU), 6),
    limbIIPowerIndependent: round(sharePower(2 * R_FROZEN, qPerBook(mStar, censusRates), TAU), 6),
    conjunctionPowerConservative: round(conjunctionPower(mStar, R_FROZEN, censusRates), 6),
    powerUnderSmokeRates: round(conjunctionPower(mStar, R_FROZEN, smokeRates), 6),
    mdeFreeMinusPressedPp: mde,
    booksTotal: 2 * R_FROZEN,
    orderedBooksRequired: Math.ceil(TAU * 2 * R_FROZEN),
    z95: round(Z95, 6),
    honestNote: 'THE SECOND RATE SOURCE IS NOT ORDERED. EK-T0\'s 20-match pooled smoke book '
      + 'reads mid > pressed > free, so the conjunction power evaluated at THAT vector is ~0 '
      + 'at every M on the grid: no sample size can rescue a world whose truth is unordered. '
      + 'The sizing is therefore stated in its true form — power ≥ 0.80 UNDER CENSUS-TRUE '
      + 'RATES (#262.3), with the smoke vector\'s power PUBLISHED beside as the honest prior '
      + 'that F-EK-a may fire. The smoke\'s HOLD COUNTS (not its rates) are what size M, '
      + 'because they are the only measurement of this exam\'s own venue.',
  };
})();

/* ========================================================================== */
/* §5 THE BATTERY — one persistent book-set per replicate, no season boundary  */
/* ========================================================================== */
interface Cells { holds: number[]; punished: number[] }
interface RepRow {
  r: number; seedFirst: number; seedLast: number; matches: number;
  learnCells: Cells[][];
  vetoCells: Cells[][];
  guards: Record<Arm, GuardRow>;
  byteIdentical: number; armOk: number; labelsClosed: number;
  holdsLearn: number; holdsVeto: number; vetoes: number; vetoesLearnOnly: number;
  unbandedLearn: number;
  takesLearn: number; drillsLearn: number;
  cellsLicensed: number; commitments: number;
  digest: string;
}
const checkpointsFor = (m: number): number[] => {
  const cps = CHECKPOINTS.filter((c) => c <= m);
  if (cps.length === 0 || cps[cps.length - 1] !== m) cps.push(m);
  return cps;
};
const snapshot = (b: HoldAccountBook): Cells => ({
  holds: [...b.holds], punished: [...b.punished],
});
const runReplicate = (r: number): RepRow => {
  const learnBooks: [HoldAccountBook, HoldAccountBook] = [
    new HoldAccountBook(), new HoldAccountBook(),
  ];
  const vetoBooks: [HoldAccountBook, HoldAccountBook] = [
    new HoldAccountBook(), new HoldAccountBook(),
  ];
  const cps = checkpointsFor(M);
  const learnCells: Cells[][] = [[], []];
  const vetoCells: Cells[][] = [[], []];
  const acc: Record<Arm, GuardRow[]> = { off: [], learnOnly: [], learnVeto: [] };
  let byteIdentical = 0; let armOk = 0; let labelsClosed = 0;
  let holdsLearn = 0; let holdsVeto = 0; let vetoes = 0; let vetoesLearnOnly = 0;
  let unbandedLearn = 0;
  let takesLearn = 0; let drillsLearn = 0; let cellsLicensed = 0; let commitments = 0;
  for (let i = 0; i < M; i++) {
    const seed = seedOf(r, i);
    const off = walk(seed, 'off', null);
    const lo = walk(seed, 'learnOnly', learnBooks);
    const lv = walk(seed, 'learnVeto', vetoBooks);
    if (off.signature === lo.signature) byteIdentical += 1;
    armOk += (off.armOk ? 1 : 0) + (lo.armOk ? 1 : 0) + (lv.armOk ? 1 : 0);
    cellsLicensed += (off.cellsLicensed ? 1 : 0) + (lo.cellsLicensed ? 1 : 0)
      + (lv.cellsLicensed ? 1 : 0);
    commitments += off.commitments + lo.commitments + lv.commitments;
    acc.off.push(off.guards); acc.learnOnly.push(lo.guards); acc.learnVeto.push(lv.guards);
    labelsClosed += lo.labelsClosed;
    holdsLearn += lo.holds; holdsVeto += lv.holds; vetoes += lv.vetoes;
    vetoesLearnOnly += lo.vetoes;
    unbandedLearn += lo.unbanded; takesLearn += lo.takes; drillsLearn += lo.drills;
    if (cps.includes(i + 1)) {
      for (const s of [0, 1]) {
        learnCells[s].push(snapshot(learnBooks[s]));
        vetoCells[s].push(snapshot(vetoBooks[s]));
      }
    }
  }
  const gm = (rows: GuardRow[]): GuardRow => ({
    interceptions: mean(rows.map((x) => x.interceptions)),
    offsides: mean(rows.map((x) => x.offsides)),
    goals: mean(rows.map((x) => x.goals)),
    spreadYOut: mean(rows.map((x) => x.spreadYOut).filter(Number.isFinite)),
    spacingMedian: mean(rows.map((x) => x.spacingMedian).filter(Number.isFinite)),
    spacingUnder4: mean(rows.map((x) => x.spacingUnder4).filter(Number.isFinite)),
  });
  const row: RepRow = {
    r, seedFirst: seedOf(r, 0), seedLast: seedOf(r, M - 1), matches: M,
    learnCells, vetoCells,
    guards: { off: gm(acc.off), learnOnly: gm(acc.learnOnly), learnVeto: gm(acc.learnVeto) },
    byteIdentical, armOk, labelsClosed, holdsLearn, holdsVeto, vetoes, vetoesLearnOnly,
    unbandedLearn,
    takesLearn, drillsLearn, cellsLicensed, commitments,
    digest: '',
  };
  row.digest = sha(canonical({ ...row, digest: '' }));
  return row;
};

/* ---- the CHECKPOINTED long run (a torn-down session resumes) --------------- */
/** ⭐ THE CHECKPOINT'S DESIGN TAG carries the PROBE'S OWN SOURCE HASH: a row written by a
 *  different build of this instrument is NOT resumable, so a mid-build edit can never leave
 *  stale cells in a resumed run (measured the hard way at smoke scale). */
const PROBE_SRC_SHA = sha(readFileSync('scripts/probes/ek-t1-hold-convergence-exam.ts', 'utf8'));
const DESIGN_TAG = `${R}x${M}-${MODE}${IS_PREFLIGHT ? '-preflight' : ''}-${
  PROBE_SRC_SHA.slice(0, 12)}`;
const loadCheckpoint = (): Map<number, RepRow> => {
  const out = new Map<number, RepRow>();
  if (IS_PREFLIGHT || !existsSync(CHECKPOINT_PATH)) return out;
  for (const line of readFileSync(CHECKPOINT_PATH, 'utf8').split('\n')) {
    if (line.trim().length === 0) continue;
    const row = JSON.parse(line) as RepRow & { design?: string };
    if (row.design !== DESIGN_TAG) continue;
    out.set(row.r, row);
  }
  return out;
};
const t0Battery = Date.now();
const done = loadCheckpoint();
const reps: RepRow[] = [];
for (let r = 0; r < R; r++) {
  const cached = done.get(r);
  if (cached !== undefined) {
    reps.push(cached);
    process.stderr.write(`  [ek-t1] replicate ${r} RESUMED from checkpoint\n`);
    continue;
  }
  const t0 = Date.now();
  const row = runReplicate(r);
  reps.push(row);
  if (!IS_PREFLIGHT) {
    appendFileSync(CHECKPOINT_PATH, `${JSON.stringify({ ...row, design: DESIGN_TAG })}\n`);
  }
  process.stderr.write(`  [ek-t1] replicate ${r + 1}/${R} done in ${
    Math.round((Date.now() - t0) / 1000)}s (${row.matches} matches × 3 arms)\n`);
}
const batteryWallS = Math.round((Date.now() - t0Battery) / 1000);

/* ========================================================================== */
/* §6 THE SCORING — the SHARPENED conjunction (#257.3(c) / #262.3)            */
/* ========================================================================== */
const CPS = checkpointsFor(M);
const beliefOf = (c: Cells): number[] => c.holds.map((h, i) => (h > 0 ? c.punished[i] / h : 0));
const booksAt = (cpIdx: number, which: 'learn' | 'veto'): { r: number; side: number;
  cells: Cells; belief: number[] }[] => reps.flatMap((row) => [0, 1].map((s) => {
  const cells = (which === 'learn' ? row.learnCells : row.vetoCells)[s][cpIdx];
  return { r: row.r, side: s, cells, belief: beliefOf(cells) };
}));

const bootRng = new Rng(STATS_BASE);
const bootIdx: number[][] = Array.from({ length: BOOTSTRAP }, () =>
  Array.from({ length: reps.length }, () => bootRng.int(0, reps.length - 1)));
/** one SHARED resample-index matrix ⇒ every gap is paired by construction. */
const bootCi = (perReplicate: readonly number[]): [number, number] => {
  const stats = bootIdx.map((idx) => mean(idx.map((k) => perReplicate[k])));
  return [quantile(stats, 0.025), quantile(stats, 0.975)];
};

const scoreAt = (cpIdx: number, which: 'learn' | 'veto'): Record<string, unknown> => {
  const books = booksAt(cpIdx, which);
  const byRep = reps.map((row) => {
    const two = books.filter((b) => b.r === row.r);
    return BANDS.map((_b, i) => mean(two.map((x) => x.belief[i])));
  });
  const meanVec = BANDS.map((_b, i) => mean(byRep.map((v) => v[i])));
  const gapFP = byRep.map((v) => v[0] - v[2]);
  const gapPM = byRep.map((v) => v[2] - v[1]);
  const ciFP = bootCi(gapFP); const ciPM = bootCi(gapPM);
  const bandCis = BANDS.map((_b, i) => bootCi(byRep.map((v) => v[i])));
  const orderedBooks = books.filter((b) => isOrdered(b.belief)).length;
  const share = orderedBooks / books.length;
  const relMu = mean(meanVec);
  const relative = meanVec.map((v) => (relMu > 0 ? v / relMu : 0));
  const limbI = isOrdered(meanVec) && ciFP[0] > 0 && ciPM[0] > 0;
  const limbII = share >= TAU;
  return {
    matches: CPS[cpIdx],
    books: books.length,
    bandOrder: BAND_LABEL,
    meanVector: meanVec.map((v) => round(v, 6)),
    meanVectorPct: meanVec.map((v) => round(v * 100, 3)),
    bandCi95Pct: bandCis.map((c) => [round(c[0] * 100, 3), round(c[1] * 100, 3)]),
    bandCiHalfWidthPp: bandCis.map((c) => round(((c[1] - c[0]) / 2) * 100, 4)),
    relative: relative.map((v) => round(v, 5)),
    gapFreeMinusPressedPp: round((meanVec[0] - meanVec[2]) * 100, 4),
    ciFreeMinusPressedPp: [round(ciFP[0] * 100, 4), round(ciFP[1] * 100, 4)],
    gapPressedMinusMidPp: round((meanVec[2] - meanVec[1]) * 100, 4),
    ciPressedMinusMidPp: [round(ciPM[0] * 100, 4), round(ciPM[1] * 100, 4)],
    orderedBooks,
    orderedShare: round(share, 5),
    limbIOrderedResolved: limbI,
    limbIIShareAtThreshold: limbII,
    conjunction: limbI && limbII,
    observedOrdering: [0, 1, 2].slice().sort((a, b) => meanVec[b] - meanVec[a])
      .map((i) => BAND_LABEL[i]),
    l1AbsoluteVsCensus: round(meanVec.reduce((a, v, i) => a + Math.abs(v - censusRates[i]), 0), 6),
    l1RelativeVsCensus: round(
      relative.reduce((a, v, i) => a + Math.abs(v - censusRelative[i]), 0), 5,
    ),
    perBookOrdered: books.map((b) => ({ r: b.r, side: b.side, ordered: isOrdered(b.belief) })),
  };
};

const curveLearn = CPS.map((_c, i) => scoreAt(i, 'learn'));
const curveVeto = CPS.map((_c, i) => scoreAt(i, 'veto'));
const finalLearn = curveLearn[curveLearn.length - 1];
const finalVeto = curveVeto[curveVeto.length - 1];

/* ---- the football guards (REPORTED, at the BANKED tolerances) -------------- */
const GUARD_KEYS = ['interceptions', 'offsides', 'goals', 'spreadYOut', 'spacingMedian',
  'spacingUnder4'] as const;
const GUARD_DIRECTION: Record<string, 'ceiling' | 'floor' | 'flag'> = {
  interceptions: 'ceiling', spreadYOut: 'floor', spacingMedian: 'floor',
  spacingUnder4: 'ceiling', offsides: 'flag', goals: 'flag',
};
const guardRows = (arm: Arm): Record<string, unknown>[] => GUARD_KEYS.map((k) => {
  const deltas = reps.map((row) => row.guards[arm][k] - row.guards.off[k]);
  const control = mean(reps.map((row) => row.guards.off[k]));
  const ci = bootCi(deltas);
  const delta = mean(deltas);
  const tol = NI_FRACTION * Math.abs(control);
  const resolved = ci[0] > 0 || ci[1] < 0;
  const dir = GUARD_DIRECTION[k];
  const beyond = dir === 'ceiling' ? delta > tol : dir === 'floor' ? delta < -tol
    : Math.abs(delta) > tol;
  return {
    ruler: k, direction: dir, control: round(control, 6), tolerance: round(tol, 6),
    delta: round(delta, 6), ci95: [round(ci[0], 6), round(ci[1], 6)],
    resolved, beyondTolerance: beyond, breach: resolved && beyond && dir !== 'flag',
  };
});
const guardsVeto = guardRows('learnVeto');
const guardsLearnOnly = guardRows('learnOnly');

/* ---- THE FEEDBACK QUESTION (REPORTED): does vetoing STARVE the book? ------- */
const totalCells = (which: 'learn' | 'veto'): { holds: number[]; punished: number[] } => {
  const cells = booksAt(CPS.length - 1, which).map((b) => b.cells);
  return {
    holds: BANDS.map((_b, i) => cells.reduce((a, c) => a + c.holds[i], 0)),
    punished: BANDS.map((_b, i) => cells.reduce((a, c) => a + c.punished[i], 0)),
  };
};
const feedback = ((): Record<string, unknown> => {
  const l = totalCells('learn'); const v = totalCells('veto');
  const shareOf = (t: { holds: number[] }): number[] => {
    const tot = t.holds.reduce((a, b) => a + b, 0);
    return t.holds.map((d) => (tot > 0 ? d / tot : 0));
  };
  return {
    learnOnlyHolds: l.holds,
    learnVetoHolds: v.holds,
    learnOnlyPunished: l.punished,
    learnVetoPunished: v.punished,
    learnOnlyMix: shareOf(l).map((x) => round(x, 5)),
    learnVetoMix: shareOf(v).map((x) => round(x, 5)),
    holdCountRatio: BANDS.map((_b, i) => round(v.holds[i] / Math.max(1, l.holds[i]), 5)),
    vetoesServed: reps.reduce((a, row) => a + row.vetoes, 0),
    holdsLearnOnly: reps.reduce((a, row) => a + row.holdsLearn, 0),
    holdsLearnVeto: reps.reduce((a, row) => a + row.holdsVeto, 0),
    question: 'does VETOING the licensed hold STARVE (fewer holds booked, especially in the '
      + 'vetoed band) or DISTORT (a different book) the account book? REPORTED beside the '
      + 'learn-only books; it gates nothing and adjudicates nothing (#203).',
  };
})();

/* ========================================================================== */
/* §7 THE GATES — the FROZEN list; the headline count is this list's length    */
/* ========================================================================== */
const FROZEN_GATE_NAMES = [
  'gDet', 'xSrcUntouched', 'xFpProd', 'gWorld', 'gByteIdentical', 'gArms', 'gBooksLive',
  'gBookMath', 'gYardstick', 'gN', 'gCurve', 'gCells', 'gVeto', 'gValuesUnreachable',
  'gSeed', 'gStats', 'gEnvClean', 'gResume',
] as const;

/* ---- G-WORLD -------------------------------------------------------------- */
const gWorldRows = ((): Record<string, unknown> => {
  const m = matchOf(GWORLD_SEED, 'off', null);
  const conj = armConjuncts(m, 'off', null, GWORLD_SEED);
  const perMatchArmOk = reps.reduce((a, row) => a + row.armOk, 0);
  const perMatchArmExpected = reps.length * M * 3;
  return {
    ...conj,
    constructionSeed: GWORLD_SEED,
    censusFlags: CENSUS_FLAGS,
    durationS: MATCH_DURATION,
    tableSha: EXPECTED_TABLE_SHA,
    doorKeys: DOOR_FLAGS,
    geneKeysChecked: GENE_NEEDLES,
    genomeViewsChecked: genomeViews(m).length,
    perMatchArmOk,
    perMatchArmExpected,
    pass: Object.values(conj).every(Boolean) && perMatchArmOk === perMatchArmExpected,
  };
})();
const gWorld = gWorldRows.pass === true;

/* ---- F-EK-c / G-BYTE-IDENTICAL + the SAMPLER-INERTNESS twin ---------------- */
const samplerTwin = Array.from({ length: CORE_N }, (_, i) => {
  const seed = IS_PREFLIGHT ? GUARD_BASE + i : CORE_BASE + i;
  return walk(seed, 'off', null, true).signature === walk(seed, 'off', null, false).signature;
});
const byteIdenticalTotal = reps.reduce((a, row) => a + row.byteIdentical, 0);
const byteIdenticalExpected = reps.length * M;
const gByteIdentical = byteIdenticalTotal === byteIdenticalExpected
  && samplerTwin.every(Boolean);

/* ---- G-ARMS: the identity predicate, ONE MUTANT PER CONJUNCT, RE-INVOKING -- */
const gArmsRows = ((): Record<string, unknown> => {
  const seed = IS_PREFLIGHT ? GUARD_BASE + 1 : CORE_BASE + 1;
  const books: [HoldAccountBook, HoldAccountBook] = [
    new HoldAccountBook(), new HoldAccountBook(),
  ];
  const truth = armConjuncts(matchOf(seed, 'learnOnly', books), 'learnOnly', books, seed);
  const mutants: { conjunct: string; flipped: boolean }[] = [];
  // 1 learnFlag — the OFF match read as if it were the learn arm
  mutants.push({ conjunct: 'learnFlag',
    flipped: armConjuncts(matchOf(seed, 'off', null), 'learnOnly', books, seed)
      .learnFlag === false });
  // 2 vetoFlag — the VETO match read as the learn-only arm
  mutants.push({ conjunct: 'vetoFlag',
    flipped: armConjuncts(matchOf(seed, 'learnVeto', books), 'learnOnly', books, seed)
      .vetoFlag === false });
  // 3 booksWired — an armed match whose ledger seat is nulled
  const m3 = matchOf(seed, 'learnOnly', books);
  (m3 as unknown as { ekHold: unknown }).ekHold = null;
  mutants.push({ conjunct: 'booksWired',
    flipped: armConjuncts(m3, 'learnOnly', books, seed).booksWired === false });
  // 4 drillWorld — the c5 hold door shut, so the drill venue does not exist
  const m4 = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS, c5Hold: false, ekHoldLearn: true,
    ekHoldBooks: books });
  m4.whetherEye = EYE_CONFIG;
  mutants.push({ conjunct: 'drillWorld',
    flipped: armConjuncts(m4, 'learnOnly', books, seed).drillWorld === false });
  // 5 eyeArmed — the seat unarmed
  const m5 = matchOf(seed, 'learnOnly', books);
  m5.whetherEye = null;
  mutants.push({ conjunct: 'eyeArmed',
    flipped: armConjuncts(m5, 'learnOnly', books, seed).eyeArmed === false });
  // 6 doorsShut — a foreign door armed
  const m6 = matchOf(seed, 'learnOnly', books);
  (m6 as unknown as Record<string, unknown>).ptpPassLead = true;
  mutants.push({ conjunct: 'doorsShut',
    flipped: armConjuncts(m6, 'learnOnly', books, seed).doorsShut === false });
  // 7 noGene — a belief gene planted on one genome view
  const m7 = matchOf(seed, 'learnOnly', books);
  (m7.teams[0].baseGenome as TacticalGenome & Record<string, unknown>).ekHoldBelief
    = [0.1, 0.2, 0.3];
  mutants.push({ conjunct: 'noGene',
    flipped: armConjuncts(m7, 'learnOnly', books, seed).noGene === false });
  // 8 censusConstruction — the squads built off the WRONG seed derivation
  const m8 = new Match({ seed, teamA: team('A', seed * 2 + 7), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS, ekHoldLearn: true, ekHoldBooks: books });
  m8.whetherEye = EYE_CONFIG;
  mutants.push({ conjunct: 'censusConstruction',
    flipped: armConjuncts(m8, 'learnOnly', books, seed).censusConstruction === false });
  return {
    truth,
    mutants,
    coverage: 'EVERY conjunct of the exam\'s configuration-identity predicate carries its own '
      + 'mutant (8 conjuncts / 8 mutants), and every mutant RE-INVOKES `armConjuncts` rather '
      + 'than re-implementing it (#260.2). The claim reaches exactly those eight.',
    pass: Object.values(truth).every(Boolean) && mutants.every((x) => x.flipped),
  };
})();
const gArms = gArmsRows.pass === true;

/* ---- G-BOOKS-LIVE --------------------------------------------------------- */
const finalBooks = booksAt(CPS.length - 1, 'learn');
const gBooksLiveRows = {
  books: finalBooks.length,
  booksWithAllThreeBands: finalBooks.filter((b) => b.cells.holds.every((d) => d > 0)).length,
  booksWithPunishment: finalBooks.filter((b) => b.cells.punished
    .reduce((a, x) => a + x, 0) > 0).length,
  labelsClosed: reps.reduce((a, row) => a + row.labelsClosed, 0),
  takes: reps.reduce((a, row) => a + row.takesLearn, 0),
  drills: reps.reduce((a, row) => a + row.drillsLearn, 0),
  unbandedRefusals: reps.reduce((a, row) => a + row.unbandedLearn, 0),
  minHoldsPerBand: BANDS.map((_b, i) => Math.min(...finalBooks.map((b) => b.cells.holds[i]))),
};
const gBooksLive = gBooksLiveRows.booksWithAllThreeBands === finalBooks.length
  && gBooksLiveRows.booksWithPunishment === finalBooks.length
  && gBooksLiveRows.labelsClosed > 0;

/* ---- G-BOOKMATH ----------------------------------------------------------- */
const gBookMathRows = ((): Record<string, unknown> => {
  let bad = 0; let cells = 0;
  for (const which of ['learn', 'veto'] as const) {
    for (let c = 0; c < CPS.length; c++) {
      for (const b of booksAt(c, which)) {
        for (let z = 0; z < EK_HOLD_BANDS; z++) {
          cells += 1;
          const h = b.cells.holds[z]; const p = b.cells.punished[z];
          const belief = h > 0 ? p / h : 0;
          if (b.belief[z] !== belief || p > h || p < 0) bad += 1;
        }
      }
    }
  }
  return {
    cellsChecked: cells,
    mismatches: bad,
    // STRICTNESS: a tie is NOT ordered, on either pair, on the shape of record.
    strictTieRejected: !isOrdered([0.80, 0.70, 0.80]) && !isOrdered([0.80, 0.75, 0.75])
      && isOrdered([0.80, 0.69, 0.75]),
    relativesFromRawCounts: BANDS.every((b, i) =>
      Math.abs(censusRelative[i] - yardstick.relative[b]) < 1e-4),
    pass: false,
  };
})();
const gBookMath = gBookMathRows.mismatches === 0
  && gBookMathRows.strictTieRejected === true
  && gBookMathRows.relativesFromRawCounts === true;
gBookMathRows.pass = gBookMath;

/* ---- G-YARDSTICK ---------------------------------------------------------- */
const gYardstickRows = {
  schema: yardstick.schema,
  windowS: yardstick.windowS,
  windowMatchesSeam: yardstick.windowS === EK_HOLD_WINDOW_S,
  orderingRead: yardstick.ordering,
  ratesFromRawCounts: censusRates.map((v) => round(v, 6)),
  relativeFromRawCounts: censusRelative.map((v) => round(v, 5)),
  storedRelative: BANDS.map((b) => yardstick.relative[b]),
  orderedTruth: isOrdered(censusRates),
  maxRelativeDrift: round(Math.max(...BANDS
    .map((b, i) => Math.abs(censusRelative[i] - yardstick.relative[b]))), 6),
};
const gYardstick = gYardstickRows.schema === 'ek-c0.hold-truth-table.v1'
  && gYardstickRows.orderedTruth
  && gYardstickRows.windowMatchesSeam
  && JSON.stringify(gYardstickRows.orderingRead) === JSON.stringify(['p0', 'p2', 'p1'])
  && gYardstickRows.maxRelativeDrift < 1e-4;

/* ---- G-N: the frozen literals ARE the recomputed sizing -------------------- */
const gNRows = {
  frozen: FROZEN_SIZING,
  recomputed: {
    deff: sizing.deff,
    designHoldRates: sizing.designHoldRates,
    censusRates: sizing.censusRates,
    smokeRates: sizing.smokeRates,
    mStar: sizing.mStar,
    qPerBook: sizing.qPerBook,
    limbIPower: sizing.limbIPower,
    limbIIPowerConservative: sizing.limbIIPowerConservative,
    limbIIPowerIndependent: sizing.limbIIPowerIndependent,
    conjunctionPowerConservative: sizing.conjunctionPowerConservative,
    mdeFreeMinusPressedPp: sizing.mdeFreeMinusPressedPp,
  },
  rFrozen: R_FROZEN,
  tau: TAU,
  powerTarget: POWER_TARGET,
  ranAtM: M,
  ranAtR: R,
  /** ⭐ MODE-CONDITIONED (#250.3): only the FULL exam must run AT the sized M. */
  mRuleApplies: MODE === 'full' && !IS_PREFLIGHT,
  seedCapBinds: sizing.seedCapBinds,
  wallCapBinds: sizing.wallCapBinds,
};
const gN = canonical(gNRows.frozen) === canonical(gNRows.recomputed)
  && (sizing.conjunctionPowerConservative as number) >= POWER_TARGET
  && TAU >= 0.9
  && (!gNRows.mRuleApplies || (M === (sizing.mStar as number) && R === R_FROZEN));

/* ---- G-CURVE -------------------------------------------------------------- */
const gCurveRows = ((): Record<string, unknown> => {
  let violations = 0;
  for (const which of ['learn', 'veto'] as const) {
    for (let c = 1; c < CPS.length; c++) {
      const prev = booksAt(c - 1, which); const cur = booksAt(c, which);
      for (let b = 0; b < cur.length; b++) {
        for (let z = 0; z < EK_HOLD_BANDS; z++) {
          if (cur[b].cells.holds[z] < prev[b].cells.holds[z]) violations += 1;
          if (cur[b].cells.punished[z] < prev[b].cells.punished[z]) violations += 1;
        }
      }
    }
  }
  return {
    checkpoints: CPS, violations, endsAtM: CPS[CPS.length - 1] === M,
    frozenCheckpoints: CHECKPOINTS,
  };
})();
const gCurve = gCurveRows.violations === 0 && gCurveRows.endsAtM === true;

/* ---- G-CELLS -------------------------------------------------------------- */
const storedCells = reps.map((row) => ({
  r: row.r, seedFirst: row.seedFirst, seedLast: row.seedLast,
  learn: row.learnCells, veto: row.vetoCells, guards: row.guards,
}));
const gCellsRows = ((): Record<string, unknown> => {
  const books = storedCells.flatMap((row) => [0, 1].map((s) => beliefOf(
    row.learn[s][CPS.length - 1],
  )));
  const share = books.filter(isOrdered).length / books.length;
  const byRep = storedCells.map((row) => BANDS.map((_b, i) => mean([0, 1]
    .map((s) => beliefOf(row.learn[s][CPS.length - 1])[i]))));
  const vec = BANDS.map((_b, i) => round(mean(byRep.map((v) => v[i])), 6));
  return {
    rederivedShare: round(share, 5),
    publishedShare: finalLearn.orderedShare,
    rederivedMeanVector: vec,
    publishedMeanVector: finalLearn.meanVector,
    clustersStored: storedCells.length,
    cellsPerCluster: 2 * CPS.length * 2,
  };
})();
const gCells = gCellsRows.rederivedShare === gCellsRows.publishedShare
  && canonical(gCellsRows.rederivedMeanVector) === canonical(gCellsRows.publishedMeanVector)
  && storedCells.length === reps.length;

/* ---- ⭐ G-VETO: R-B strict NO-SUBSIDY, measured in EVERY arm (#262.2(1)) ---- */
const gVetoRows = ((): Record<string, unknown> => {
  const licensedOk = reps.reduce((a, row) => a + row.cellsLicensed, 0);
  const licensedExpected = reps.length * M * 3;
  const commitments = reps.reduce((a, row) => a + row.commitments, 0);
  const vetoes = reps.reduce((a, row) => a + row.vetoes, 0);
  /** the learn-only arm's veto door is SHUT, so its ledger can serve none — measured, not assumed. */
  const learnVetoes = reps.reduce((a, row) => a + row.vetoesLearnOnly, 0);
  // the veto's own arithmetic, re-derived independently in floats on the FINAL books.
  let mismatches = 0; let declines = 0;
  for (const b of booksAt(CPS.length - 1, 'veto')) {
    const book = new HoldAccountBook();
    for (let i = 0; i < EK_HOLD_BANDS; i++) {
      book.holds[i] = b.cells.holds[i]; book.punished[i] = b.cells.punished[i];
    }
    for (let band = 0; band < EK_HOLD_BANDS; band++) {
      let oh = 0; let op = 0;
      for (let i = 0; i < EK_HOLD_BANDS; i++) {
        if (i === band) continue;
        oh += b.cells.holds[i]; op += b.cells.punished[i];
      }
      const ref = b.cells.holds[band] > 0 && oh > 0
        && b.cells.punished[band] / b.cells.holds[band] > op / oh;
      if (book.declinesHold(band) !== ref) mismatches += 1;
      if (ref) declines += 1;
    }
  }
  return {
    noSubsidyArmMatches: licensedOk,
    noSubsidyArmMatchesExpected: licensedExpected,
    distinctCommitmentCellsSeenLive: commitments,
    vetoesServedInVetoArm: vetoes,
    vetoesServedInLearnOnlyArm: learnVetoes,
    vetoArithmeticMismatches: mismatches,
    finalBooksDecliningSomewhere: declines,
    semantics: '#262.2(1) discharged: the NO-SUBSIDY property is measured in EVERY arm of '
      + 'this exam — every whether-seat commitment in every arm sits in a `reachesZero` cell '
      + 'of the injected certified table — and the veto\'s integer arithmetic is re-derived '
      + 'independently in floats on every final book of the consuming arm.',
  };
})();
const gVeto = gVetoRows.noSubsidyArmMatches === gVetoRows.noSubsidyArmMatchesExpected
  && gVetoRows.vetoArithmeticMismatches === 0
  && gVetoRows.vetoesServedInLearnOnlyArm === 0
  // ⭐ NON-VACUITY: the no-subsidy limb must have SEEN commitments (the whistle-read trap).
  && (gVetoRows.distinctCommitmentCellsSeenLive as number) > 0;

/* ---- G-VALUES-UNREACHABLE ------------------------------------------------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFiles(p);
  return p.endsWith('.ts') ? [p] : [];
});
const SRC = srcFiles('src');
const srcAll = SRC.map((f) => readFileSync(f, 'utf8')).join('\n');
/**
 * ⭐ THE NEEDLE SET — EK-T0's OWN COMMITTED G-NOTABLE METHOD, replayed (the banked extraction
 * is the authority, not a re-invention): the MEASURED ANSWERS only, i.e. every field whose KEY
 * names a rate, a CI bound, a share, a margin, a mean/SD or a certified cost, taken from BOTH
 * hold censuses and the certified table; integers excluded (a count is not an answer) and a
 * DECLARED value floor. ⭐ THIS STAGE'S ONE CHANGE: the printed PERCENTAGE form is searched at
 * THREE decimals (EK-T0's two-decimal percentage form was always dropped by its own form
 * floor, so its percentage limb could never hit — the #262.3 canon asks for formatted
 * percentage grep-forms, and this is that limb made LIVE).
 */
const NEEDLE_FLOOR = 0.0001;
const VALUE_KEY_RE = /rate|ci95|share|margin|mean|sd$|point|lower|upper|p10|p50|p90|median|quantile|delta|diff|tvd/i;
const collectNumbers = (v: unknown, out: Set<number>, keyed: boolean): void => {
  if (typeof v === 'number') {
    if (keyed && Number.isFinite(v) && !Number.isInteger(v) && Math.abs(v) >= NEEDLE_FLOOR) {
      out.add(v);
    }
    return;
  }
  if (Array.isArray(v)) { for (const x of v) collectNumbers(x, out, keyed); return; }
  if (v !== null && typeof v === 'object') {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      collectNumbers(x, out, keyed || VALUE_KEY_RE.test(k));
    }
  }
};
const ekc0b = readJson(EKC0B_PATH);
const needleValues = new Set<number>();
collectNumbers(ekc0.result, needleValues, false);
collectNumbers(ekc0b.result, needleValues, false);
collectNumbers(tableRaw.build.table.cells, needleValues, false);
/**
 * ⭐ THE DECLARED FORM FLOOR (EK-T0 §DEV 7, SHARPENED HERE and published): a searchable form
 * must carry at least THREE DECIMALS **and at least FOUR SIGNIFICANT DIGITS**. EK-T0's floor
 * counted decimals alone, which is enough while the percentage limb is dead; with the printed
 * percentage form made live, the ×100 form of a very small value ("0.00012" → "0.012") carries
 * two significant digits and collides with ordinary engine constants by arithmetic accident —
 * exactly the noise the floor exists to keep out. The count excluded is PUBLISHED beside the
 * gate, and every real rate form ("79.412", "0.74833") clears it easily.
 */
const significantDigits = (f: string): number =>
  f.replace('.', '').replace(/^0+/, '').length;
const searchableForm = (f: string): boolean =>
  /^\d+\.\d{3,}$/.test(f) && significantDigits(f) >= 4;
const needleForms = new Set<string>();
let excludedForms = 0;
for (const v of needleValues) {
  for (const f of [String(v), v.toFixed(5), (v * 100).toFixed(3)]) {
    if (searchableForm(f)) needleForms.add(f); else excludedForms += 1;
  }
}
const searchable = [...needleForms];
const rateNeedles = [...needleValues];
const srcTokens = new Set(srcAll.match(/\d+\.\d+|\d+/g) ?? []);
const valueHits = searchable.filter((f) => srcTokens.has(f));
const NAME_NEEDLES = ['ek-c0-hold-outcome-census', 'ek-c0b-inversion-diagnostic',
  'c5-recensus.json', 'ek-c0.hold-truth-table', 'ek-t0-hold-belief-seam'];
const nameHits = NAME_NEEDLES.filter((s) => srcAll.includes(s));
/** ⭐ THE CONTROL NEEDLE: a token that IS in src, so a silently empty search cannot pass. */
const controlNeedleFound = srcTokens.has('0.5') && srcAll.includes('EK_HOLD_WINDOW_S');
const gValuesRows = {
  needleFormsBuilt: needleForms.size,
  needleFormsSearched: searchable.length,
  excludedByFloor: excludedForms,
  rateNeedles: rateNeedles.length,
  valueHits,
  nameHits,
  controlNeedleFound,
  coverage: 'EK-T0\'s own committed extraction, replayed: every KEYED measured answer (rate · '
    + 'CI bound · share · margin · mean/SD · point/lower/upper · quantile · delta · TVD) of '
    + 'EK-C0\'s result, EK-C0b\'s result and the certified table\'s cells, non-integer and '
    + `above the declared floor ${NEEDLE_FLOOR}, in THREE string forms (raw serialisation · `
    + '5-dp · the printed PERCENTAGE form at 3 dp — this stage\'s one change, since EK-T0\'s '
    + '2-dp percentage form was always dropped by the form floor and could never hit). Forms '
    + 'with fewer than three decimals are EXCLUDED and counted. The CONTROL NEEDLE proves the '
    + 'search is live. It does NOT cover this exam\'s own measured values (they are the '
    + 'result, not a table src could copy).',
};
const gValuesUnreachable = valueHits.length === 0 && nameHits.length === 0
  && controlNeedleFound && rateNeedles.length >= 12;

/* ---- X-SRC-UNTOUCHED / X-FP-PROD ------------------------------------------ */
const srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim();
const srcStatus = execSync('git status --porcelain -- src', { encoding: 'utf8' }).trim();
const xSrcUntouched = srcDiff.length === 0 && srcStatus.length === 0;
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'SKIPPED' : leagueHash(1337);
const xFpProd = !SKIP_FP && fpObserved === FINGERPRINT_BASELINE;

/* ---- G-SEED / G-STATS ------------------------------------------------------ */
const batteryFirst = seedOf(0, 0);
const batteryLast = seedOf(R - 1, M - 1);
const blocksUsed = IS_PREFLIGHT
  ? [{ name: 'preflight (guard block)', first: GUARD_BASE, last: GUARD_BASE + GUARD_SPAN - 1 }]
  : [
    { name: 'core + sampler-inertness twin', first: CORE_BASE, last: CORE_BASE + CORE_N - 1 },
    { name: 'preflight/guard block', first: GUARD_BASE, last: GUARD_BASE + GUARD_SPAN - 1 },
    { name: 'G-WORLD construction seed', first: GWORLD_SEED, last: GWORLD_SEED },
    { name: `the battery (${MODE})`, first: batteryFirst, last: batteryLast },
  ];
const seedBlocks = blocksUsed.map((b) => ({
  ...b,
  collisions: CONSUMED.filter((c) => b.first <= c.range[1] && b.last >= c.range[0])
    .map((c) => c.name),
})).map((b) => ({ ...b, ok: b.collisions.length === 0 }));
const sortedBlocks = [...seedBlocks].sort((a, b) => a.first - b.first);
const blocksOrdered = sortedBlocks.every((b, i) => i === 0 || b.first > sortedBlocks[i - 1].last);
const gSeed = seedBlocks.every((b) => b.ok) && blocksOrdered
  && CONSUMED.some((c) => c.name.includes('EK-T0 seam band'));
const statsGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
const gStats = STATS_BASE >= 109_000 && statsGap >= 200;

/* ---- ⭐ G-ENV-CLEAN (#261.2 + #262.2) -------------------------------------- */
const gEnvCleanRows = {
  whitelist: ENV_WHITELIST,
  engineDoorsScanned: ENGINE_DOORS,
  rogueOwn,
  rogueEngine,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  outPath: OUT_PATH,
  outPathIsCanonical: isCanonicalPath(OUT_PATH),
  mode: MODE,
  semantics: 'WHITELIST-OR-REFUSE in its THIRD-VISIT form: any unrecognised EKT1_* variable '
    + 'AND any ENGINE env door (EDS_BUNDLE, EDS_TRACE_CHOICE, EMERGENT_POS, the constants.ts '
    + 'scale doors) is a FATAL refusal (exit 2), and EVERY override — INCLUDING the output '
    + 'path EKT1_OUT — is a PREFLIGHT that routes onto the guard block, may not write a '
    + 'canonical repo path, and reds this gate. MODE is not an override: each mode owns its '
    + 'own canonical artifact.',
};
const gEnvClean = !IS_PREFLIGHT && rogueOwn.length === 0 && rogueEngine.length === 0;

/* ---- G-RESUME -------------------------------------------------------------- */
const resumeRow = runReplicate(0);
const gResumeRows = {
  replicate: 0,
  checkpointDigest: reps[0].digest,
  recomputedDigest: resumeRow.digest,
  resumedFromCheckpoint: done.has(0),
  checkpointPath: CHECKPOINT_PATH,
  designTag: DESIGN_TAG,
};
const gResume = resumeRow.digest === reps[0].digest;

/* ---- G-DET: the deterministic CORE runs twice ------------------------------ */
const core = (): Record<string, unknown> => {
  const books: [HoldAccountBook, HoldAccountBook] = [
    new HoldAccountBook(), new HoldAccountBook(),
  ];
  const sigs: string[] = [];
  for (let i = 0; i < CORE_N; i++) {
    const seed = (IS_PREFLIGHT ? GUARD_BASE : CORE_BASE) + i;
    sigs.push(walk(seed, 'learnOnly', books).signature);
  }
  return {
    sigs,
    cells: [0, 1].map((s) => snapshot(books[s])),
    sizing,
    censusRates: censusRates.map((v) => round(v, 8)),
    finalMeanVector: finalLearn.meanVector,
    finalShare: finalLearn.orderedShare,
  };
};
const digestA = sha(canonical(core()));
const digestB = sha(canonical(core()));
const gDet = digestA === digestB;

/* ========================================================================== */
/* §8 THE ARTIFACT                                                            */
/* ========================================================================== */
const gates: Record<string, boolean> = {
  gDet,
  xSrcUntouched,
  xFpProd,
  gWorld,
  gByteIdentical,
  gArms,
  gBooksLive,
  gBookMath,
  gYardstick,
  gN,
  gCurve,
  gCells,
  gVeto,
  gValuesUnreachable,
  gSeed,
  gStats,
  gEnvClean,
  gResume,
};
const gateListMatches = canonical(Object.keys(gates).sort())
  === canonical([...FROZEN_GATE_NAMES].sort());
if (!gateListMatches) {
  process.stdout.write('*** THE GATE OBJECT DOES NOT MATCH THE FROZEN GATE LIST ***\n');
  process.exit(1);
}
const allPass = Object.values(gates).every(Boolean);

/** ⭐ THE FORKS — #262.3's words VERBATIM, printed MECHANICALLY, never resolved here. */
const censusSmallestGapPp = Math.min(
  (censusRates[0] - censusRates[2]) * 100, (censusRates[2] - censusRates[1]) * 100,
);
const tightCis = (finalLearn.bandCiHalfWidthPp as number[])
  .every((h) => h < censusSmallestGapPp);
const forks = {
  fEkA: {
    fired: !(finalLearn.conjunction as boolean),
    consequent: 'an honest negative about experience-only hold learning at rung one',
  },
  fEkB: {
    fired: tightCis && !isOrdered(finalLearn.meanVector as number[]),
    predicate: 'CONVERGED (every band mean\'s 95 % CI half-width below the census\'s smallest '
      + `pairwise gap, ${round(censusSmallestGapPp, 4)} pp) to a mean vector whose ordering is `
      + 'NOT the census shape free > pressed > mid — the frozen mechanical reading of '
      + '"books CONVERGE (tight CIs) to a NON-census shape in learn-only".',
    consequent: 'a label/semantics defect hunt, STOP',
  },
  fEkC: {
    fired: !gByteIdentical,
    consequent: 'the learn-only world not byte-identical ⇒ STOP',
  },
  note: 'MECHANICAL PREDICATE FLAGS ONLY (#203). A fired fork is STILL A COMMIT: the honest '
    + 'result lands and the commander adjudicates it.',
};

const result = {
  stage: 'EK-T1 — THE HOLD CONVERGENCE EXAM (H-EK scored)',
  contract: 'docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §1/§3; ruling #262.3',
  doc: 'docs/world-model/EK-T1-HOLD-CONVERGENCE-EXAM.md',
  mode: IS_PREFLIGHT ? 'PREFLIGHT — NOT THE EXAM' : (MODE === 'full' ? 'EXAM' : 'SMOKE'),
  gatingGrain: IS_PREFLIGHT
    ? 'PREFLIGHT, guard block — these rows adjudicate NOTHING'
    : `${MODE === 'full' ? 'THE BATTERY' : 'THE SMOKE'}: R = ${R} replicates × M = ${M} `
      + `matches, ${2 * R} books`,
  design: {
    replicates: R,
    matchesPerReplicate: M,
    books: 2 * R,
    tau: TAU,
    powerTarget: POWER_TARGET,
    checkpoints: CPS,
    window: EK_HOLD_WINDOW_S,
    bands: BAND_LABEL,
    targetShape: 'free > pressed > mid — the MEASURED truth of record (#261.3(ii)); the '
      + 'drafting\'s naive pressure-monotone expectation was REFUTED BY MEASUREMENT and retired.',
    world: 'THE DRILL WORLD (the training-ground venue of record, #261.3(iii)): EK-C0\'s '
      + 'committed exam flags + 240 s + the certified table INJECTED into an armed whetherEye, '
      + 'with the EK-T0 drill driver dosing holds at the census cadence. Public state only; '
      + 'every arm doses identically.',
    seasonBoundary: 'NEVER FIRES — the probe drives the sequence directly, so '
      + 'League.startSeason() is never called and M-EK.2\'s reset clause is HONOURED, not '
      + 'amended. One long season in substance, DECLARED as such.',
    learner: 'the SIDE (A/B). Squads are redrawn per fixture exactly as EK-C0 draws them '
      + '(teamA = seed·2+1, teamB = seed·2+2), so the book\'s sampling population is the '
      + 'yardstick\'s population.',
  },
  sizing,
  seeds: { blocks: seedBlocks, ordered: blocksOrdered, statsBase: STATS_BASE, statsGap },
  gates,
  gateCount: FROZEN_GATE_NAMES.length,
  frozenGateNames: FROZEN_GATE_NAMES,
  gDet: { pass: gDet, digestA, digestB },
  xSrcUntouched: { pass: xSrcUntouched, diff: srcDiff, status: srcStatus },
  xFpProd: { pass: xFpProd, observed: fpObserved, baseline: FINGERPRINT_BASELINE },
  gWorld: gWorldRows,
  gByteIdentical: {
    pass: gByteIdentical,
    matchesIdentical: byteIdenticalTotal,
    matchesWalked: byteIdenticalExpected,
    samplerInertTwins: samplerTwin.filter(Boolean).length,
    samplerTwinsRun: samplerTwin.length,
    semantics: 'F-EK-c\'s gate. The LEARN-ONLY arm\'s whole-run signature (rng stream state '
      + 'inside) equals the learn-OFF drill world\'s on EVERY battery seed, so the books '
      + 'sample exactly the drill world the census semantics are read in. The guard sampler\'s '
      + 'own inertness is proved on the declared twin block (sampled vs bare).',
  },
  gArms: gArmsRows,
  gBooksLive: { ...gBooksLiveRows, pass: gBooksLive },
  gBookMath: gBookMathRows,
  gYardstick: { ...gYardstickRows, pass: gYardstick },
  gN: { ...gNRows, pass: gN },
  gCurve: { ...gCurveRows, pass: gCurve },
  gCells: { ...gCellsRows, pass: gCells },
  gVeto: { ...gVetoRows, pass: gVeto },
  gValuesUnreachable: { ...gValuesRows, pass: gValuesUnreachable },
  gSeed: { blocks: seedBlocks, ordered: blocksOrdered, pass: gSeed },
  gStats: { base: STATS_BASE, minGap: statsGap, pass: gStats },
  gEnvClean: { ...gEnvCleanRows, pass: gEnvClean },
  gResume: { ...gResumeRows, pass: gResume },
  /* ---- ⭐⭐ THE CLAIM ---- */
  claim: {
    hEk: 'Given only their own hold outcomes (the observable label), teams can EARN a '
      + 'hold-risk map over pressure whose SHAPE matches the world\'s own measured truth.',
    predicate: 'H-EK scored on the #257.3(c) SHARPENED CONJUNCTION: (i) the replicate-mean '
      + 'belief vector strictly ordered free > pressed > mid with BOTH pairwise gaps RESOLVED '
      + `at set grain, AND (ii) the ordered-book share ≥ τ = ${TAU} at the ex-ante-sized M.`,
    limbI: {
      meanVectorPct: finalLearn.meanVectorPct,
      bandOrder: BAND_LABEL,
      ordered: isOrdered(finalLearn.meanVector as number[]),
      observedOrdering: finalLearn.observedOrdering,
      gapFreeMinusPressedPp: finalLearn.gapFreeMinusPressedPp,
      ciFreeMinusPressedPp: finalLearn.ciFreeMinusPressedPp,
      gapPressedMinusMidPp: finalLearn.gapPressedMinusMidPp,
      ciPressedMinusMidPp: finalLearn.ciPressedMinusMidPp,
      pass: finalLearn.limbIOrderedResolved,
    },
    limbII: {
      orderedBooks: finalLearn.orderedBooks,
      books: finalLearn.books,
      orderedShare: finalLearn.orderedShare,
      threshold: TAU,
      required: Math.ceil(TAU * (finalLearn.books as number)),
      pass: finalLearn.limbIIShareAtThreshold,
    },
    conjunction: finalLearn.conjunction,
    convergenceReported: {
      censusRatesPct: censusRates.map((v) => round(v * 100, 3)),
      censusRelative: censusRelative.map((v) => round(v, 5)),
      bookRelative: finalLearn.relative,
      l1AbsoluteVsCensus: finalLearn.l1AbsoluteVsCensus,
      l1RelativeVsCensus: finalLearn.l1RelativeVsCensus,
      note: 'REPORTED, never gated (#246): the SHAPE is the claim, the magnitudes are this '
        + 'world\'s — and the drill world is a GREENHOUSE, not the census\'s clone-dosing '
        + 'venue (EK-T0 §HONESTY 3).',
    },
  },
  learningCurve: { learnOnly: curveLearn, learnVeto: curveVeto },
  learnVetoReported: {
    final: finalVeto,
    guards: guardsVeto,
    guardsLearnOnlyControlCheck: guardsLearnOnly,
    feedback,
    semantics: 'REPORTED ONLY (#262.3): the consuming arm\'s books, its hold/decline counts, '
      + 'its football guards at the BANKED tolerances (NI_FRACTION · |control|, NI_FRACTION = '
      + '1 − 0.275/0.380) and the starvation question. It gates nothing and scores nothing. '
      + 'The learn-only guard row is the NULL CONTROL: it must be exactly zero, because that '
      + 'arm\'s world is byte-identical to the control.',
  },
  forks,
  perClusterCells: storedCells,
};

const envelope = {
  head: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
  generatedAt: new Date().toISOString(),
  outPath: OUT_PATH,
  batteryWallSeconds: batteryWallS,
  note: 'UNHASHED (#197-M1 / #258.3): head, timestamps and ALL machine timings live here so '
    + 'resultSha256 re-derives at any commit or path.',
};
const resultSha256 = sha(canonical(result));
writeFileSync(OUT_PATH, `${JSON.stringify({ envelope, resultSha256, result }, null, 2)}\n`);

for (const k of FROZEN_GATE_NAMES) {
  process.stdout.write(`${gates[k] ? 'PASS' : 'FAIL'}  ${k}\n`);
}
process.stdout.write(`gates ${Object.values(gates).filter(Boolean).length}/${
  FROZEN_GATE_NAMES.length}\n`);
process.stdout.write(`resultSha256 ${resultSha256}\n`);
process.stdout.write(`G-DET digest ${digestA}\n`);
process.stdout.write(`M* ${sizing.mStar} q ${sizing.qPerBook} power ${
  sizing.conjunctionPowerConservative} MDE ${sizing.mdeFreeMinusPressedPp} pp deff ${
  sizing.deff}\n`);
process.stdout.write(`mean vector % ${JSON.stringify(finalLearn.meanVectorPct)} (${
  BAND_LABEL.join('/')})\n`);
process.stdout.write(`LIMB I ${finalLearn.limbIOrderedResolved} · LIMB II ${
  finalLearn.limbIIShareAtThreshold} (share ${finalLearn.orderedShare}) · CONJUNCTION ${
  finalLearn.conjunction}\n`);
process.stdout.write(`forks: a=${forks.fEkA.fired} b=${forks.fEkB.fired} c=${forks.fEkC.fired}\n`);
process.stdout.write(`${allPass ? 'ALL HARD GATES PASS' : '*** A GATE IS RED ***'}\n`);
process.exit(allPass ? 0 : 1);
