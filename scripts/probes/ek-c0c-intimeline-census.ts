/**
 * EK C0c — THE IN-TIMELINE DRILL CENSUS + THE RE-SCORE
 * (docs/world-model/EK-C0C-INTIMELINE-CENSUS.md).
 *
 * Commander ruling #263.3 (the disposition of the EK-T1 adjudication): EK-C0's yardstick
 * measured ISOLATED CLONE-DOSED holds while the learner lives in an IN-TIMELINE
 * ACCUMULATING drill world — same quantity, same semantics, DIFFERENT population. ⭐ THE
 * YARDSTICK MUST BE MEASURED IN THE VENUE THE LEARNER LIVES IN. This stage measures
 * P(punished | held, band) on FRESH seeds in that venue and then RE-SCORES the COMMITTED
 * EK-T1 books against it as a NEW claim, H-EK′. The #263.1 NEGATIVE (vs the clone-dosed
 * yardstick) stands untouched and is not re-opened here.
 *
 * ⭐ INSTRUMENT-ONLY ROUND: `src/**` is byte-untouched (X-SRC-UNTOUCHED is a HARD gate).
 * ⭐ #247: this probe may READ the committed censuses and the committed exam; `src/**` may
 *   not (G-VALUES-UNREACHABLE).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE, in the #262.2 THIRD-VISIT form:
 *   accepted: EKC0C_MODE (smoke|full, REQUIRED) · EKC0C_N · EKC0C_SKIP_FP · EKC0C_OUT.
 *   ANY other `EKC0C_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors
 *   (EDS_BUNDLE · EDS_TRACE_CHOICE · EMERGENT_POS · the constants.ts scale doors).
 *   EKC0C_OUT is an OVERRIDE: an output-path override is a PREFLIGHT, so it routes onto the
 *   guard block, may never write a canonical repo path, and reds G-ENV-CLEAN.
 *
 * RUN: EKC0C_MODE=full npx tsx scripts/probes/ek-c0c-intimeline-census.ts
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
const ENV_WHITELIST = ['EKC0C_MODE', 'EKC0C_N', 'EKC0C_SKIP_FP', 'EKC0C_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'EMERGENT_POS', 'PITCH_SCALE',
  'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('EKC0C_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('EK-C0c FATAL — refused env surface. '
    + `rogue EKC0C_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')}; the engine doors must be UNSET `
    + '(whitelist-or-refuse, #261.2 + #262.2(2a)).');
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.EKC0C_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`EK-C0c FATAL — EKC0C_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v !== undefined
  ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.EKC0C_N);
const SKIP_FP = process.env.EKC0C_SKIP_FP === '1';
const OUT_ENV = process.env.EKC0C_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'EKC0C_N', set: N_ENV !== null },
  { name: 'EKC0C_SKIP_FP', set: SKIP_FP },
  { name: 'EKC0C_OUT', set: OUT_ENV !== undefined },
];
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
/** MODE is NOT an override — each mode owns its OWN canonical artifact (the EK-C0 family form). */
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/ek-c0c-intimeline-census-smoke.json',
  full: 'docs/world-model/data/ek-c0c-intimeline-census.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/ek-c0c-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('EK-C0c FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}
const CHECKPOINT_PATH = `/tmp/ek-c0c-checkpoint-${MODE}.jsonl`;

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — every literal machine-checked by G-N                 */
/* ========================================================================== */
const EKC0_PATH = 'docs/world-model/data/ek-c0-hold-outcome-census.json';
const EKC0B_PATH = 'docs/world-model/data/ek-c0b-inversion-diagnostic.json';
const EKT1_PATH = 'docs/world-model/data/ek-t1-hold-convergence-exam.json';
const SMOKE_PATH = OUT_BY_MODE.smoke;
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';

/** ⭐ THE RE-SCORE'S FROZEN THRESHOLD — the SAME τ EK-T1 froze (#262.3 / #263.3). */
const TAU = 0.90;
/** the N rule's precision target, inherited VERBATIM from EK-C0 §NRULE (thence DV-C0). */
const RARE_BAND_EVENTS = 60;
/** the N rule's floor and its grid. */
const N_FLOOR = 25;
const N_GRID_STEP = 50;
const SEED_ROOM = 4000;
/** the wall term's budget, declared ex ante; the ms/match input is READ from the committed
 *  smoke artifact's UNHASHED envelope (#258.3: no timing enters this run's hashed body). */
const WALL_CAP_S = 2400;
const ARMS_PER_SEED = 2;
/** the frozen N* (mode-conditioned; G-N recomputes the whole rule and compares). */
const N_FROZEN = 4000;
/** the reported window ladder; the PRIMARY is the seam's own constant, 10 s. */
const WINDOW_LADDER: readonly number[] = [4, 5, 10, 15, 20];

/* ---- the frozen league-identity baseline (inherited UNTRUNCATED) ------------------- */
const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/* ---- the drill world of record — EK-T1's committed world, verbatim ----------------- */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
const MATCH_DURATION = 240;
const MOMENT_SPACING = 30;
const HOLD_K_TICKS = 30;
const DRILL_SPACING = HOLD_K_TICKS + MOMENT_SPACING;

/* ---- the estimator ---------------------------------------------------------------- */
const BOOTSTRAP = 2000;
const STATS_BASE = 109_400;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000,
];

/* ---- §SEED LEDGER (#163) ---------------------------------------------------------- */
const CORE_BASE = 12_461_000; //     12,461,000–011 the core (G-DET + G-ARMS)
const CORE_N = 12;
const GUARD_BASE = 12_461_050; //    12,461,050–099 the preflight/guard block
const GUARD_SPAN = 50;
const SMOKE_BATTERY_BASE = 12_461_100; // 12,461,100–139 the smoke MODE's own battery
const SMOKE_N = 40;
const GWORLD_SEED = 12_461_999; //   constructed, never stepped
const CENSUS_BASE = 12_462_000; //   12,462,000 + i, N ≤ 4,000

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
  { name: 'EK-T0 seam band (#261.4/#262)', range: [12_450_000, 12_450_999] },
  {
    name: '⭐ EK-T1 exam band (#262.3/#263) — core, guard, smoke, battery AND reserved ceiling',
    range: [12_451_000, 12_460_999],
  },
];

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
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return Number.NaN;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - mu) ** 2, 0) / (xs.length - 1));
};
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
/* §3 THE WORLD — the DRILL world of record, EK-T1's own (#261.3(iii))         */
/* ========================================================================== */
const tableRaw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (tableRaw.tableSha !== EXPECTED_TABLE_SHA) {
  console.error(`EK-C0c FATAL — certified table SHA drift: ${tableRaw.tableSha}`);
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
 * ⭐ THE TWO ARMS OF THIS STAGE — and note what neither of them is.
 *  'off'      the FLAGS-OFF drill world: `ekHoldLearn` and `ekHoldVeto` both false, no
 *             ledger, no book. ⭐ THIS IS THE TIMELINE THE CENSUS DESCRIBES (#263.3's words).
 *  'observer' the SAME world with `ekHoldLearn` armed and `ekHoldVeto` OFF — the seam's own
 *             ledger writing into books NOTHING EVER READS. It is a pure observer: no
 *             mechanic consults it (the one consumption site needs `ekHoldVeto`), and
 *             G-BYTE-IDENTICAL proves on EVERY census seed that the trajectory is the
 *             flags-off world's, rng stream included. ⭐ That is what "the instrument
 *             counting beside the timeline" means here, and why the count IS the seam's.
 */
type Arm = 'off' | 'observer';
type Books = readonly [HoldAccountBook, HoldAccountBook];
const matchOf = (seed: number, arm: Arm, books: Books | null): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS,
    ...(arm === 'off' ? {} : { ekHoldLearn: true }),
    ...(arm === 'off' || books === null ? {} : { ekHoldBooks: books }),
  });
  m.whetherEye = EYE_CONFIG;
  return m;
};

/**
 * ⭐ THE TRAINING-GROUND DRILL DRIVER — EK-T0's / EK-T1's own definition, VERBATIM: PUBLIC
 * STATE ONLY, two-phase (arm at a decision moment, dose on the next tick so the band lag is
 * exactly one tick), one dose at a time, cadence `HOLD_K_TICKS + MOMENT_SPACING`. It is a
 * property of the WORLD, not of the learning door: both arms dose exactly the same holds.
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

/* ---- ⭐ THE CONFIGURATION-IDENTITY PREDICATE, DERIVED FOR THIS CENSUS ------- */
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
    learnFlag: m.ekHoldLearn === (arm === 'observer'),
    /** ⭐ THE VETO DOOR IS SHUT IN BOTH ARMS — the observer consumes nothing, ever. */
    vetoShut: m.ekHoldVeto === false,
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
    noGene: genomeViews(m).every((g) => GENE_NEEDLES.every((k) => g[k] === undefined)),
    censusConstruction: canonical(m.teams[0].info.genome) === canonical(team('A', seed * 2 + 1).genome)
      && canonical(m.teams[1].info.genome) === canonical(team('B', seed * 2 + 2).genome),
  };
};

/* ========================================================================== */
/* §4 ⭐⭐ THE COUNTING — the SEAM'S OWN RULES, mirrored BESIDE the timeline     */
/* ========================================================================== */
/**
 * The census's target population is WHAT BOOKS COUNT in this venue, so the instrument's
 * counting rules are the seam's, to the tick:
 *   · the band is the one THE SEAT PLACED for that body (never a truth-side re-band);
 *   · the FRESHNESS REFUSAL stands — a drill whose placement is not the immediately
 *     preceding tick carries NO band and is NOT counted (it is counted as refused);
 *   · the label is the 10 s FIRST-LOSS label, closed at the window, at the loss, or at the
 *     whistle (censored ⇒ unpunished);
 *   · DRILL holds and the seat's own TAKES alike are counted, exactly as the book does.
 *
 * ⭐ TWO READINGS ARE COMPUTED, and the divergence #263.2(2) named is RESOLVED here:
 *   (B) THE SEAM READING — a tick-exact replay of `HoldLabelLedger`'s own state machine on
 *       the public event stream, in the ledger's own intra-tick order (takes noted during
 *       the previous step, then the chain, then this tick's drill, then the window sweep).
 *       G-LABEL proves it reproduces the observer arm's own books CELL FOR CELL.
 *   (A) THE PROBE READING — EK-T1's deff re-walk rule: for each noted hold, the first loss
 *       by that team stamped at or after the hold, punished iff inside the window. It
 *       ignores the ledger's intra-tick order and its pending semantics.
 * ⭐ THE RULE OF RECORD IS (B). A divergence is a defect in the INSTRUMENT, not in the seam
 * (#263.3), so (A) is published as a diagnosis of the secondary lead and gates nothing.
 */
interface Obs { t: number; playing: boolean; owner: number | null }
interface HoldRow {
  side: number; band: number; tSim: number; kind: 'take' | 'drill';
  punishedSeam: boolean; punishedProbe: boolean;
  /** the seam reading's closing cause. */
  cause: 'loss' | 'window' | 'whistle';
  /** the first loss by that side at or after the hold, per the probe reading (or null). */
  firstLossDt: number | null;
  /** punished at each ladder window, under the SEAM reading's machinery. */
  ladder: boolean[];
}
interface WalkOut {
  signature: string; armOk: boolean;
  holds: number[]; punished: number[]; // per band, the OBSERVER ARM'S OWN BOOK (both sides)
  cellHolds: number[][]; cellPunished: number[][]; // [side][band] — the stored cluster cells
  rows: HoldRow[];
  takeHolds: number; drillHolds: number;
  refused: number; refusedUnseen: number; refusedStale: number; staleMax: number;
  seatPlacements: number; closedLabels: number; vetoes: number;
  ladderPunished: number[][]; // [windowIdx][band]
  distinctPunishingLosses: number;
}

/** the walk: one match, the observer arm, with the public event stream recorded beside it. */
const walkObserver = (seed: number): WalkOut => {
  const books: [HoldAccountBook, HoldAccountBook] = [
    new HoldAccountBook(), new HoldAccountBook(),
  ];
  const m = matchOf(seed, 'observer', books);
  const armOk = Object.values(armConjuncts(m, 'observer', books, seed)).every(Boolean);
  const driver = new DrillDriver();
  const obs: Obs[] = [];
  const record = (): void => {
    obs.push({
      t: m.simTime,
      playing: m.phase === 'playing',
      owner: m.ball.owner === null ? null : m.ball.owner.side,
    });
  };
  while (!m.finished) {
    record();
    driver.preStep(m);
    m.step(DT);
  }
  /**
   * ⭐ THE WHISTLE OBSERVATION, MIRRORED AS THE SEAM MAKES IT — and this is a real thing
   * this stage's own gate caught. `Match.endMatch()` runs its final `ekHoldObserve()`
   * BEFORE it sets `phase = 'fulltime'`, so the seam's last read is a PLAYING read: if
   * control has just been established by the opponent, that is a LOSS and it punishes
   * every still-open label. A post-loop read sees `fulltime` and would close those labels
   * UNPUNISHED — measured: 6 labels over the 40-seed smoke, the whole of a 0.5 % reading
   * divergence (and the mechanism behind #263.2(2)'s 626-vs-632 lead). The mirror reads
   * the same public state with the seam's own playing semantics.
   */
  obs.push({
    t: m.simTime, playing: true,
    owner: m.ball.owner === null ? null : m.ball.owner.side,
  });
  const led = (m as unknown as { ekHold: HoldLabelLedger }).ekHold;

  /* ---- (B) THE SEAM READING: the ledger's state machine, replayed tick-exactly ---- */
  const byTime = new Map<number, { take: number[]; drill: number[] }>();
  led.noted.forEach((h, i) => {
    const slot = byTime.get(h.tSim) ?? { take: [], drill: [] };
    slot[h.kind].push(i);
    byTime.set(h.tSim, slot);
  });
  const rows: HoldRow[] = led.noted.map((h) => ({
    side: h.side, band: h.band, tSim: h.tSim, kind: h.kind,
    punishedSeam: false, punishedProbe: false, cause: 'whistle',
    firstLossDt: null,
    ladder: WINDOW_LADDER.map(() => false),
  }));
  /** one pending set PER WINDOW: the ladder is the same machinery at another W. */
  const pendings: number[][] = WINDOW_LADDER.map(() => []);
  const losses: { t: number; loser: number }[] = [];
  const punishingLosses = new Set<string>();
  let chainSide: number | null = null;
  const closeOnLoss = (side: number, t: number): void => {
    WINDOW_LADDER.forEach((w, wi) => {
      const keep: number[] = [];
      for (const idx of pendings[wi]) {
        const r = rows[idx];
        if (r.side !== side) { keep.push(idx); continue; }
        const punished = t <= r.tSim + w;
        if (wi === PRIMARY_WI) {
          r.punishedSeam = punished;
          r.cause = 'loss';
          if (punished) punishingLosses.add(`${side}|${t}`);
        }
        r.ladder[wi] = punished;
      }
      pendings[wi] = keep;
    });
  };
  const expire = (t: number): void => {
    WINDOW_LADDER.forEach((w, wi) => {
      const keep: number[] = [];
      for (const idx of pendings[wi]) {
        const r = rows[idx];
        if (t <= r.tSim + w) { keep.push(idx); continue; }
        if (wi === PRIMARY_WI) { r.punishedSeam = false; r.cause = 'window'; }
        r.ladder[wi] = false;
      }
      pendings[wi] = keep;
    });
  };
  const push = (idxs: number[]): void => {
    for (const idx of idxs) for (let wi = 0; wi < WINDOW_LADDER.length; wi++) pendings[wi].push(idx);
  };
  obs.forEach((o, oi) => {
    /** the LAST observation is the whistle read (see the mirror above); reading (A) —
     *  EK-T1's rule — sees `fulltime` there and records no loss, so its loss list stops
     *  one observation short. That is the divergence, isolated. */
    const isWhistle = oi === obs.length - 1;
    const slot = byTime.get(o.t);
    if (slot !== undefined) push(slot.take);
    if (!o.playing) chainSide = null;
    else if (o.owner !== null) {
      const prev = chainSide;
      chainSide = o.owner;
      if (prev !== null && prev !== o.owner) {
        if (!isWhistle) losses.push({ t: o.t, loser: prev });
        closeOnLoss(prev, o.t);
      }
    }
    if (slot !== undefined) push(slot.drill);
    expire(o.t);
  });
  // THE WHISTLE: everything still open closes UNPUNISHED (the censored class).
  for (let wi = 0; wi < WINDOW_LADDER.length; wi++) {
    for (const idx of pendings[wi]) {
      if (wi === PRIMARY_WI) { rows[idx].punishedSeam = false; rows[idx].cause = 'whistle'; }
      rows[idx].ladder[wi] = false;
    }
    pendings[wi] = [];
  }
  /* ---- (A) THE PROBE READING: EK-T1's deff re-walk rule, for the divergence ------- */
  for (const r of rows) {
    let first: number | null = null;
    for (const l of losses) {
      if (l.t < r.tSim || l.loser !== r.side) continue;
      first = l.t; break;
    }
    r.firstLossDt = first === null ? null : round(first - r.tSim, 6);
    r.punishedProbe = first !== null && first <= r.tSim + EK_HOLD_WINDOW_S;
  }
  const cellHolds = [0, 1].map((s) => [...books[s].holds]);
  const cellPunished = [0, 1].map((s) => [...books[s].punished]);
  const ladderPunished = WINDOW_LADDER.map((_w, wi) => {
    const per = [0, 0, 0];
    for (const r of rows) if (r.ladder[wi]) per[r.band] += 1;
    return per;
  });
  return {
    signature: signature(m),
    armOk,
    holds: [0, 1, 2].map((b) => cellHolds[0][b] + cellHolds[1][b]),
    punished: [0, 1, 2].map((b) => cellPunished[0][b] + cellPunished[1][b]),
    cellHolds,
    cellPunished,
    rows,
    takeHolds: led.takeHolds,
    drillHolds: led.drillHolds,
    refused: led.drillHoldsUnbanded,
    refusedUnseen: led.drillHoldsUnseen,
    refusedStale: led.drillHoldsStale,
    staleMax: led.drillStaleMaxTicks,
    seatPlacements: led.seatPlacements,
    closedLabels: led.closedLabels,
    vetoes: led.vetoes,
    ladderPunished,
    distinctPunishingLosses: punishingLosses.size,
  };
};
const PRIMARY_WI = WINDOW_LADDER.indexOf(EK_HOLD_WINDOW_S);
if (PRIMARY_WI < 0) {
  console.error('EK-C0c FATAL — the ladder does not carry the seam\'s own window.');
  process.exit(2);
}
/** the FLAGS-OFF twin — the timeline the census describes (G-BYTE-IDENTICAL's control). */
const walkOff = (seed: number): string => {
  const m = matchOf(seed, 'off', null);
  const driver = new DrillDriver();
  while (!m.finished) { driver.preStep(m); m.step(DT); }
  return signature(m);
};

/* ========================================================================== */
/* §5 THE CENSUS BLOCK — per-seed clusters, checkpointed                       */
/* ========================================================================== */
interface ClusterRow {
  seed: number;
  holds: number[]; punished: number[];
  cellHolds: number[][]; cellPunished: number[][];
  byKind: { take: number[]; drill: number[]; takePunished: number[]; drillPunished: number[] };
  ladderPunished: number[][];
  closedByCause: { loss: number; window: number; whistle: number };
  /** the per-band punished counts as the SEAM-READING REPLAY produces them. */
  punishedReplay: number[];
  probePunished: number[];
  divergent: { seamOnly: number; probeOnly: number };
  refused: number; refusedUnseen: number; refusedStale: number; staleMax: number;
  seatPlacements: number; closedLabels: number; vetoes: number;
  takeHolds: number; drillHolds: number;
  byteIdentical: boolean; armOk: boolean;
  seamCellsMatch: boolean; holdsChecked: number;
  distinctPunishingLosses: number;
  digest: string;
}
const clusterOf = (seed: number): ClusterRow => {
  const w = walkObserver(seed);
  const offSig = walkOff(seed);
  const per = (pred: (r: HoldRow) => boolean): number[] => {
    const out = [0, 0, 0];
    for (const r of w.rows) if (pred(r)) out[r.band] += 1;
    return out;
  };
  /** ⭐ THE SEAM-READING RECEIPT, at CELL grain: my replay's per-side per-band counts must
   *  equal the observer arm's OWN book, which is the seam's code counting for itself. */
  const replayHolds = [0, 1].map(() => [0, 0, 0]);
  const replayPunished = [0, 1].map(() => [0, 0, 0]);
  for (const r of w.rows) {
    replayHolds[r.side][r.band] += 1;
    if (r.punishedSeam) replayPunished[r.side][r.band] += 1;
  }
  const seamCellsMatch = canonical(replayHolds) === canonical(w.cellHolds)
    && canonical(replayPunished) === canonical(w.cellPunished);
  const row: ClusterRow = {
    seed,
    holds: w.holds,
    punished: w.punished,
    cellHolds: w.cellHolds,
    cellPunished: w.cellPunished,
    byKind: {
      take: per((r) => r.kind === 'take'),
      drill: per((r) => r.kind === 'drill'),
      takePunished: per((r) => r.kind === 'take' && r.punishedSeam),
      drillPunished: per((r) => r.kind === 'drill' && r.punishedSeam),
    },
    ladderPunished: w.ladderPunished,
    closedByCause: {
      loss: w.rows.filter((r) => r.cause === 'loss').length,
      window: w.rows.filter((r) => r.cause === 'window').length,
      whistle: w.rows.filter((r) => r.cause === 'whistle').length,
    },
    punishedReplay: [0, 1, 2].map((b) => replayPunished[0][b] + replayPunished[1][b]),
    probePunished: per((r) => r.punishedProbe),
    divergent: {
      seamOnly: w.rows.filter((r) => r.punishedSeam && !r.punishedProbe).length,
      probeOnly: w.rows.filter((r) => !r.punishedSeam && r.punishedProbe).length,
    },
    refused: w.refused,
    refusedUnseen: w.refusedUnseen,
    refusedStale: w.refusedStale,
    staleMax: w.staleMax,
    seatPlacements: w.seatPlacements,
    closedLabels: w.closedLabels,
    vetoes: w.vetoes,
    takeHolds: w.takeHolds,
    drillHolds: w.drillHolds,
    byteIdentical: offSig === w.signature,
    armOk: w.armOk,
    seamCellsMatch,
    holdsChecked: w.rows.length,
    distinctPunishingLosses: w.distinctPunishingLosses,
    digest: '',
  };
  row.digest = sha(canonical({ ...row, digest: '' }));
  return row;
};

/* ---- the SIZING: the EK-C0 §NRULE form, with this venue's own inputs -------- */
const erf = (x0: number): number => {
  const s = x0 < 0 ? -1 : 1; const x = Math.abs(x0);
  const a1 = 0.254829592; const a2 = -0.284496736; const a3 = 1.421413741;
  const a4 = -1.453152027; const a5 = 1.061405429; const p = 0.3275911;
  const t = 1 / (1 + p * x);
  return s * (1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x));
};
const normCdf = (z: number): number => 0.5 * (1 + erf(z / Math.SQRT2));
/** the two-sided 95 % normal quantile, SOLVED (not typed). */
const zFor = (p: number): number => {
  let lo = 0; let hi = 6;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (normCdf(mid) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
};
const Z975 = zFor(0.975);
const BAND_LABEL = ['free', 'mid', 'pressed'] as const;
const BAND_KEYS = ['p0', 'p1', 'p2'] as const;

/**
 * ⭐⭐ THE N RULE, frozen before any census seed was walked.
 *
 *   N* = min( max( ceil(60 / rarestBandPunishedPerMatch),   [EK-C0 §NRULE, VERBATIM]
 *                  25,                                      [its floor]
 *                  N_ordering ),                            [⭐ THIS STAGE'S OWN TERM]
 *             wallTerm, 4000 )                              [the two caps]
 *
 * N_ordering = the smallest N on the grid at which BOTH of the smoke's measured band gaps
 * would be RESOLVED at 95 % — |gap| ≥ z·SE(gap, N) with the cluster design effect applied —
 * because the corrected yardstick's DELIVERABLE is an ORDERING (the re-score reads its
 * ordering, not its levels), and 60 events in the rarest band do not buy an ordering when
 * the gaps are small. Declared as an extension of the precedent, whose own term is kept and
 * published beside.
 *
 * ⭐ THE ZERO-EVENT CLAUSE (frozen with the rule, before the smoke ran): if the smoke sees
 * zero punished holds in the rarest band, or zero holds in any band, or a gap of exactly
 * zero, the corresponding precision term is UNBOUNDED — it cannot be estimated from a zero
 * count and this stage will not invent a floor for it — so the caps bind. The artifact
 * records `precisionTermUnbounded` / `orderingTermUnbounded` either way.
 */
const sizingFrom = (s: {
  matches: number; holds: number[]; punished: number[]; deff: number; msPerMatch: number;
}): Record<string, unknown> => {
  const rates = s.holds.map((h, i) => (h > 0 ? s.punished[i] / h : Number.NaN));
  const holdsPerMatch = s.holds.map((h) => h / s.matches);
  const punishedPerMatch = s.punished.map((p) => p / s.matches);
  const rarest = holdsPerMatch.indexOf(Math.min(...holdsPerMatch));
  const rarestPunishedPerMatch = punishedPerMatch[rarest];
  const precisionUnbounded = !(rarestPunishedPerMatch > 0);
  const precisionTerm = precisionUnbounded ? Number.POSITIVE_INFINITY
    : Math.ceil(RARE_BAND_EVENTS / rarestPunishedPerMatch);
  const gaps: [number, number][] = [[0, 1], [0, 2], [1, 2]];
  const gapMagnitudes = gaps.map(([a, b]) => Math.abs(rates[a] - rates[b]));
  const orderingUnbounded = s.holds.some((h) => h === 0)
    || gapMagnitudes.some((g) => !(g > 0));
  const seAt = (n: number, i: number): number => {
    const nEff = (holdsPerMatch[i] * n) / s.deff;
    return Math.sqrt((rates[i] * (1 - rates[i])) / Math.max(1, nEff));
  };
  let orderingTerm = Number.POSITIVE_INFINITY;
  if (!orderingUnbounded) {
    for (let n = N_GRID_STEP; n <= SEED_ROOM; n += N_GRID_STEP) {
      const ok = gaps.every(([a, b], gi) => gapMagnitudes[gi]
        >= Z975 * Math.sqrt(seAt(n, a) ** 2 + seAt(n, b) ** 2));
      if (ok) { orderingTerm = n; break; }
    }
  }
  const wallTerm = Math.floor((WALL_CAP_S * 1000) / (s.msPerMatch * ARMS_PER_SEED));
  /** ⭐ REQUIREMENTS COMBINE BY MAX, CAPS BY MIN — and an UNBOUNDED requirement is carried
   *  as +∞ into the max, exactly so that the zero-event clause reads as the precedent words
   *  it: an unestimable term lets the WALL and SEED-BUDGET caps bind (the largest run the
   *  budget allows), and is never quietly floored down to 25. */
  const requirement = Math.max(precisionTerm, N_FLOOR, orderingTerm);
  const nStar = Math.min(requirement, wallTerm, SEED_ROOM);
  return {
    smokeMatches: s.matches,
    smokeHolds: s.holds,
    smokePunished: s.punished,
    smokeRates: rates.map((v) => round(v, 6)),
    smokeHoldsPerMatch: holdsPerMatch.map((v) => round(v, 6)),
    smokePunishedPerMatch: punishedPerMatch.map((v) => round(v, 6)),
    smokeDeff: round(s.deff, 6),
    msPerMatch: s.msPerMatch,
    rarestBand: BAND_LABEL[rarest],
    rarestBandPunishedPerMatch: round(rarestPunishedPerMatch, 6),
    precisionTerm: Number.isFinite(precisionTerm) ? precisionTerm : null,
    precisionTermUnbounded: precisionUnbounded,
    gapMagnitudesPp: gapMagnitudes.map((g) => round(g * 100, 4)),
    orderingTerm: Number.isFinite(orderingTerm) ? orderingTerm : null,
    orderingTermUnbounded: orderingUnbounded || !Number.isFinite(orderingTerm),
    floor: N_FLOOR,
    wallTerm,
    requirement: Number.isFinite(requirement) ? requirement : null,
    requirementUnbounded: !Number.isFinite(requirement),
    wallTermBinds: wallTerm < requirement && wallTerm <= SEED_ROOM,
    seedCap: SEED_ROOM,
    seedCapBinds: SEED_ROOM < Math.min(requirement, wallTerm),
    nStar,
    z975: round(Z975, 6),
    rule: 'N* = min( max( ceil(60 / rarestBandPunishedPerMatch), 25, N_ordering ), '
      + 'wallTerm, 4000 ) — EK-C0 §NRULE\'s own precision term and floor, PLUS this stage\'s '
      + 'ORDERING term (the corrected yardstick\'s deliverable is an ordering), with the '
      + 'zero-event clause frozen: an unestimable term is UNBOUNDED, never floored.',
  };
};

/* ---- the smoke source (mode-conditioned; the FULL run reads the committed smoke) ---- */
const smokeCommitted = MODE === 'full' && !IS_PREFLIGHT && existsSync(SMOKE_PATH)
  ? readJson(SMOKE_PATH) : null;
const N = IS_PREFLIGHT ? (N_ENV ?? 6) : (MODE === 'smoke' ? SMOKE_N : N_FROZEN);
const seedOf = (i: number): number => {
  if (IS_PREFLIGHT) return GUARD_BASE + (i % GUARD_SPAN);
  return (MODE === 'smoke' ? SMOKE_BATTERY_BASE : CENSUS_BASE) + i;
};

/* ---- the CHECKPOINTED long run --------------------------------------------- */
const PROBE_SRC_SHA = sha(readFileSync('scripts/probes/ek-c0c-intimeline-census.ts', 'utf8'));
const DESIGN_TAG = `${N}-${MODE}${IS_PREFLIGHT ? '-preflight' : ''}-${PROBE_SRC_SHA.slice(0, 12)}`;
const loadCheckpoint = (): Map<number, ClusterRow> => {
  const out = new Map<number, ClusterRow>();
  if (IS_PREFLIGHT || !existsSync(CHECKPOINT_PATH)) return out;
  for (const line of readFileSync(CHECKPOINT_PATH, 'utf8').split('\n')) {
    if (line.trim().length === 0) continue;
    const row = JSON.parse(line) as ClusterRow & { design?: string };
    if (row.design !== DESIGN_TAG) continue;
    out.set(row.seed, row);
  }
  return out;
};
const t0Battery = Date.now();
const done = loadCheckpoint();
const clusters: ClusterRow[] = [];
let walkedFresh = 0;
const tWalk0 = Date.now();
for (let i = 0; i < N; i++) {
  const seed = seedOf(i);
  const cached = done.get(seed);
  if (cached !== undefined) { clusters.push(cached); continue; }
  clusters.push(clusterOf(seed));
  walkedFresh += 1;
  if (!IS_PREFLIGHT) {
    appendFileSync(CHECKPOINT_PATH,
      `${JSON.stringify({ ...clusters[clusters.length - 1], design: DESIGN_TAG })}\n`);
  }
  if ((i + 1) % 100 === 0) {
    process.stderr.write(`  [ek-c0c] ${i + 1}/${N} seeds (${
      Math.round((Date.now() - tWalk0) / 1000)}s)\n`);
  }
}
const msPerMatchMeasured = walkedFresh > 0
  ? (Date.now() - tWalk0) / (walkedFresh * ARMS_PER_SEED) : Number.NaN;
const batteryWallS = Math.round((Date.now() - t0Battery) / 1000);

/* ========================================================================== */
/* §6 ⭐⭐ THE CORRECTED YARDSTICK — the in-timeline table                       */
/* ========================================================================== */
const bootRng = new Rng(STATS_BASE);
const bootIdx: number[][] = Array.from({ length: BOOTSTRAP }, () =>
  Array.from({ length: clusters.length }, () => bootRng.int(0, clusters.length - 1)));
/** ONE SHARED resample-index matrix ⇒ every rate and every gap is paired by construction. */
const bootRatio = (num: readonly number[], den: readonly number[]): [number, number] => {
  const stats = bootIdx.map((idx) => {
    let n = 0; let d = 0;
    for (const k of idx) { n += num[k]; d += den[k]; }
    return d > 0 ? n / d : Number.NaN;
  }).filter(Number.isFinite);
  return [quantile(stats, 0.025), quantile(stats, 0.975)];
};
const bootRatioGap = (
  nA: readonly number[], dA: readonly number[], nB: readonly number[], dB: readonly number[],
): [number, number] => {
  const stats = bootIdx.map((idx) => {
    let na = 0; let da = 0; let nb = 0; let db = 0;
    for (const k of idx) { na += nA[k]; da += dA[k]; nb += nB[k]; db += dB[k]; }
    return da > 0 && db > 0 ? na / da - nb / db : Number.NaN;
  }).filter(Number.isFinite);
  return [quantile(stats, 0.025), quantile(stats, 0.975)];
};
const bandHolds = (b: number): number[] => clusters.map((c) => c.holds[b]);
const bandPunished = (b: number): number[] => clusters.map((c) => c.punished[b]);
const totalHolds = [0, 1, 2].map((b) => sum(bandHolds(b)));
const totalPunished = [0, 1, 2].map((b) => sum(bandPunished(b)));
const bandRates = [0, 1, 2].map((b) => (totalHolds[b] > 0 ? totalPunished[b] / totalHolds[b] : 0));
const bandCis = [0, 1, 2].map((b) => bootRatio(bandPunished(b), bandHolds(b)));
const relMu = mean(bandRates);
const bandRelative = bandRates.map((r) => (relMu > 0 ? r / relMu : 0));
/** the measured ORDERING of the corrected yardstick: bands ranked by punish rate. */
const ORDER_IDX = [0, 1, 2].slice().sort((a, b) => bandRates[b] - bandRates[a]);
const ORDERING = ORDER_IDX.map((i) => BAND_KEYS[i]);
const ORDERING_LABEL = ORDER_IDX.map((i) => BAND_LABEL[i]);
/** the two ADJACENT gaps of that ordering, each resolved by the paired cluster bootstrap. */
const adjacentGaps = [0, 1].map((k) => {
  const a = ORDER_IDX[k]; const b = ORDER_IDX[k + 1];
  const ci = bootRatioGap(bandPunished(a), bandHolds(a), bandPunished(b), bandHolds(b));
  return {
    pair: `${BAND_LABEL[a]} − ${BAND_LABEL[b]}`,
    gapPp: round((bandRates[a] - bandRates[b]) * 100, 4),
    ci95Pp: [round(ci[0] * 100, 4), round(ci[1] * 100, 4)],
    resolved: ci[0] > 0,
  };
});
/** the three pairwise gaps, published in full (the venue-dependence record). */
const allGaps = ([[0, 1], [0, 2], [1, 2]] as [number, number][]).map(([a, b]) => {
  const ci = bootRatioGap(bandPunished(a), bandHolds(a), bandPunished(b), bandHolds(b));
  return {
    pair: `${BAND_LABEL[a]} − ${BAND_LABEL[b]}`,
    gapPp: round((bandRates[a] - bandRates[b]) * 100, 4),
    ci95Pp: [round(ci[0] * 100, 4), round(ci[1] * 100, 4)],
    resolved: ci[0] > 0 || ci[1] < 0,
  };
});

/** THE COMPLEMENT PARTITION — every counted hold in exactly one class, at the primary W. */
const closedByCause = {
  loss: sum(clusters.map((c) => c.closedByCause.loss)),
  window: sum(clusters.map((c) => c.closedByCause.window)),
  whistle: sum(clusters.map((c) => c.closedByCause.whistle)),
  punishedAtLoss: sum(clusters.map((c) => sum(c.punishedReplay))),
};
const partition = ((): Record<string, unknown> => {
  const holds = sum(totalHolds);
  /** ⭐ the partition is read off the SEAM-READING REPLAY (whose per-cell equality with the
   *  books is G-LABEL-READING's own claim), so the classes and their total are one reading,
   *  never a mixture of two. */
  const punished = closedByCause.punishedAtLoss;
  const unpunished = holds - punished;
  const closedTotal = closedByCause.loss + closedByCause.window + closedByCause.whistle;
  // a 'loss'-closed label is punished iff the loss was inside W; the ledger closes it either way
  const lossClosedUnpunished = closedByCause.loss - punished;
  return {
    holdsCounted: holds,
    punished,
    unpunished,
    partitionHolds: punished + unpunished === holds,
    closedByCause,
    closedTotalEqualsHolds: closedTotal === holds,
    lossClosedButOutOfWindow: lossClosedUnpunished,
    censoredAtWhistle: closedByCause.whistle,
    nonNegative: unpunished >= 0 && lossClosedUnpunished >= 0,
    refusedForStaleBand: sum(clusters.map((c) => c.refusedStale)),
    refusedUnseenBand: sum(clusters.map((c) => c.refusedUnseen)),
    refusedTotal: sum(clusters.map((c) => c.refused)),
    seatPlacements: sum(clusters.map((c) => c.seatPlacements)),
    takeHolds: sum(clusters.map((c) => c.takeHolds)),
    drillHolds: sum(clusters.map((c) => c.drillHolds)),
    semantics: 'THE COMPLEMENT PARTITION at the primary window: every COUNTED hold closes '
      + 'exactly once — at the first loss by its own team (punished iff that loss is inside '
      + 'W), at the window sweep, or at the whistle (the CENSORED class, unpunished by '
      + 'construction). Drills whose band placement was STALE or UNSEEN are REFUSED by the '
      + 'seam\'s own freshness rule: they are not holds of this population and are counted '
      + 'separately, never imputed.',
  };
})();

/** the take/drill split (REPORTED — the census counts both, exactly as the book does). */
const byKind = ((): Record<string, unknown> => {
  const g = (k: 'take' | 'drill' | 'takePunished' | 'drillPunished'): number[] =>
    [0, 1, 2].map((b) => sum(clusters.map((c) => c.byKind[k][b])));
  const take = g('take'); const drill = g('drill');
  const tp = g('takePunished'); const dp = g('drillPunished');
  return {
    takeHolds: take,
    takePunished: tp,
    takeRates: take.map((h, i) => (h > 0 ? round(tp[i] / h, 6) : null)),
    drillHolds: drill,
    drillPunished: dp,
    drillRates: drill.map((h, i) => (h > 0 ? round(dp[i] / h, 6) : null)),
    note: 'The census counts DRILL and TAKE holds alike, because the BOOK does (#263.3). The '
      + 'split is published so the take population\'s own rate is visible beside it; the two '
      + 'are never merged into different tables and never separated in the yardstick.',
  };
})();

/** the window ladder (REPORTED): the same machinery at 4 / 5 / 10 / 15 / 20 s. */
const ladder = WINDOW_LADDER.map((w, wi) => {
  const pun = [0, 1, 2].map((b) => sum(clusters.map((c) => c.ladderPunished[wi][b])));
  return {
    windowS: w,
    primary: wi === PRIMARY_WI,
    punished: pun,
    rates: pun.map((p, b) => (totalHolds[b] > 0 ? round(p / totalHolds[b], 6) : 0)),
    ratesPct: pun.map((p, b) => (totalHolds[b] > 0 ? round((p / totalHolds[b]) * 100, 3) : 0)),
    ordering: [0, 1, 2].slice()
      .sort((a, b) => (pun[b] / Math.max(1, totalHolds[b])) - (pun[a] / Math.max(1, totalHolds[a])))
      .map((i) => BAND_LABEL[i]),
  };
});
const ladderMonotone = [0, 1, 2].every((b) => WINDOW_LADDER
  .every((_w, wi) => wi === 0 || ladder[wi].punished[b] >= ladder[wi - 1].punished[b]));

/** ⭐ THE EVENT-RATE MOMENTS — per band, per team, per match (the EK-C0 deliverable form). */
const moments = [0, 1, 2].map((b) => {
  const perTeamMatch = clusters.flatMap((c) => [c.cellHolds[0][b], c.cellHolds[1][b]]);
  const punPerTeamMatch = clusters.flatMap((c) => [c.cellPunished[0][b], c.cellPunished[1][b]]);
  return {
    band: BAND_KEYS[b],
    label: BAND_LABEL[b],
    holdsPerTeamPerMatch: {
      mean: round(mean(perTeamMatch), 6),
      sd: round(sd(perTeamMatch), 6),
      cv: round(sd(perTeamMatch) / Math.max(1e-12, mean(perTeamMatch)), 6),
      min: Math.min(...perTeamMatch),
      p10: round(quantile(perTeamMatch, 0.10), 4),
      median: round(quantile(perTeamMatch, 0.50), 4),
      p90: round(quantile(perTeamMatch, 0.90), 4),
      max: Math.max(...perTeamMatch),
      zeroShare: round(perTeamMatch.filter((x) => x === 0).length / perTeamMatch.length, 5),
    },
    punishedPerTeamPerMatch: {
      mean: round(mean(punPerTeamMatch), 6),
      sd: round(sd(punPerTeamMatch), 6),
      zeroShare: round(punPerTeamMatch.filter((x) => x === 0).length / punPerTeamMatch.length, 5),
    },
  };
});

/** the deff of THIS venue, measured on the census itself (a REPORTED moment). */
const deffMeasured = ((): number => {
  const lossClusters = sum(clusters.map((c) => c.distinctPunishingLosses));
  return lossClusters > 0 ? sum(totalPunished) / lossClusters : 1;
})();

/** ⭐⭐ THE YARDSTICK — the schema EK-T1's re-score reads and may not re-cut. */
const yardstick = {
  schema: 'ek-c0c.intimeline-hold-truth-table.v1',
  frame: 'P(punished | held, perceived band) in the IN-TIMELINE DRILL VENUE — the venue the '
    + 'EK-T1 books live in (#263.3). Counted under the SEAM\'S OWN counting rules.',
  index: 'the seat\'s own perceived pressure band at the decision (the book\'s index)',
  windowS: EK_HOLD_WINDOW_S,
  holdTicks: HOLD_K_TICKS,
  bandCuts: tableParams.pressureBands,
  bands: Object.fromEntries(BAND_KEYS.map((k, b) => [k, {
    punishRate: round(bandRates[b], 6),
    punishRatePct: round(bandRates[b] * 100, 3),
    ci95: [round(bandCis[b][0], 6), round(bandCis[b][1], 6)],
    ci95Pct: [round(bandCis[b][0] * 100, 3), round(bandCis[b][1] * 100, 3)],
    holds: totalHolds[b],
    punished: totalPunished[b],
  }])),
  relative: Object.fromEntries(BAND_KEYS.map((k, b) => [k, round(bandRelative[b], 5)])),
  ordering: ORDERING,
  orderingLabels: ORDERING_LABEL,
  adjacentGaps,
  allPairwiseGaps: allGaps,
  bandsWithNoData: BAND_KEYS.filter((_k, b) => totalHolds[b] === 0),
  baselinePunishRateAllBands: round(sum(totalPunished) / Math.max(1, sum(totalHolds)), 6),
  clusters: clusters.length,
  clusterGrain: 'the match seed (#20)',
};

/* ========================================================================== */
/* §7 ⭐⭐ THE RE-SCORE — H-EK′ on the COMMITTED EK-T1 books                     */
/* ========================================================================== */
const ekt1 = readJson(EKT1_PATH);
const ekt1Result = ekt1.result as Record<string, unknown>;
const ekt1ShaRederived = sha(canonical(ekt1Result));
interface Cells { holds: number[]; punished: number[] }
const ekt1Cells = ekt1Result.perClusterCells as {
  r: number; seedFirst: number; seedLast: number; learn: Cells[][]; veto: Cells[][];
}[];
const ekt1Checkpoints = (ekt1Result.design as { checkpoints: number[] }).checkpoints;
const LAST_CP = ekt1Checkpoints.length - 1;
const beliefOf = (c: Cells): number[] => c.holds.map((h, i) => (h > 0 ? c.punished[i] / h : 0));
const ekt1Books = ekt1Cells.flatMap((row) => [0, 1].map((s) => ({
  r: row.r, side: s, cells: row.learn[s][LAST_CP], belief: beliefOf(row.learn[s][LAST_CP]),
})));
/** ⭐ THE ORDERING PREDICATE OF THE CORRECTED YARDSTICK — strict, ties never ordered. */
const orderedBy = (order: readonly number[]) => (v: readonly number[]): boolean =>
  v[order[0]] > v[order[1]] && v[order[1]] > v[order[2]];
const isOrderedNew = orderedBy(ORDER_IDX);
/** EK-T1's own predicate, for the receipt that we are reading the SAME banked books. */
const isOrderedOld = (v: readonly number[]): boolean => v[0] > v[2] && v[2] > v[1];

const rescoreBootRng = new Rng(STATS_BASE + 1);
const rescoreIdx: number[][] = Array.from({ length: BOOTSTRAP }, () =>
  Array.from({ length: ekt1Cells.length }, () => rescoreBootRng.int(0, ekt1Cells.length - 1)));
const byReplicate = ekt1Cells.map((row) => [0, 1, 2].map((b) => mean([0, 1]
  .map((s) => beliefOf(row.learn[s][LAST_CP])[b]))));
const bookMeanVec = [0, 1, 2].map((b) => mean(byReplicate.map((v) => v[b])));
const rescoreCi = (perRep: readonly number[]): [number, number] => {
  const stats = rescoreIdx.map((idx) => mean(idx.map((k) => perRep[k])));
  return [quantile(stats, 0.025), quantile(stats, 0.975)];
};
const rescoreGaps = [0, 1].map((k) => {
  const a = ORDER_IDX[k]; const b = ORDER_IDX[k + 1];
  const per = byReplicate.map((v) => v[a] - v[b]);
  const ci = rescoreCi(per);
  return {
    pair: `${BAND_LABEL[a]} − ${BAND_LABEL[b]}`,
    gapPp: round(mean(per) * 100, 4),
    ci95Pp: [round(ci[0] * 100, 4), round(ci[1] * 100, 4)],
    resolved: ci[0] > 0,
  };
});
const orderedBooksNew = ekt1Books.filter((b) => isOrderedNew(b.belief)).length;
const shareNew = orderedBooksNew / ekt1Books.length;
const limbINew = isOrderedNew(bookMeanVec) && rescoreGaps.every((g) => g.resolved);
const limbIINew = shareNew >= TAU;
const MATCH = limbINew && limbIINew;
const bookRelative = ((): number[] => {
  const mu = mean(bookMeanVec);
  return bookMeanVec.map((v) => (mu > 0 ? v / mu : 0));
})();
const rescore = {
  claim: 'H-EK′ (a NEW claim, #263.3): given only their own hold outcomes, the EK-T1 teams '
    + 'EARNED a hold-risk map whose SHAPE matches the measured truth OF THE VENUE THEY LIVE '
    + 'IN. The #263.1 NEGATIVE against the clone-dosed yardstick STANDS and is untouched.',
  predicate: 'the SAME sharpened conjunction, on the SAME frozen τ = 0.90, with the ordering '
    + 'taken from THIS stage\'s corrected yardstick: (i) the replicate-mean belief vector '
    + 'strictly ordered in the yardstick\'s MEASURED order with BOTH pairwise gaps RESOLVED '
    + 'at set grain, AND (ii) the ordered-book share ≥ τ.',
  source: {
    artifact: EKT1_PATH,
    resultSha256Stored: ekt1.resultSha256,
    resultSha256Rederived: ekt1ShaRederived,
    replicates: ekt1Cells.length,
    books: ekt1Books.length,
    checkpointMatches: ekt1Checkpoints[LAST_CP],
    note: 'A GENERATOR-LEVEL ACT ON BANKED DATA (#263.3): no learning run happens here. The '
      + 'books are the committed per-book cells at EK-T1\'s final checkpoint.',
  },
  yardstickOrdering: ORDERING_LABEL,
  limbI: {
    meanVectorPct: bookMeanVec.map((v) => round(v * 100, 3)),
    bandOrder: BAND_LABEL,
    observedOrdering: [0, 1, 2].slice().sort((a, b) => bookMeanVec[b] - bookMeanVec[a])
      .map((i) => BAND_LABEL[i]),
    ordered: isOrderedNew(bookMeanVec),
    gaps: rescoreGaps,
    pass: limbINew,
  },
  limbII: {
    orderedBooks: orderedBooksNew,
    books: ekt1Books.length,
    orderedShare: round(shareNew, 5),
    threshold: TAU,
    required: Math.ceil(TAU * ekt1Books.length),
    pass: limbIINew,
  },
  conjunction: MATCH,
  route: MATCH ? 'MATCH' : 'MISMATCH',
  consequent: MATCH
    ? 'the book mechanism is VINDICATED … the #248 archetype debt is marked DISCHARGED'
    : 'a real seam defect exists after all — STOP to the user',
  convergenceReported: {
    yardstickRatesPct: bandRates.map((v) => round(v * 100, 3)),
    yardstickRelative: bandRelative.map((v) => round(v, 5)),
    bookRelative: bookRelative.map((v) => round(v, 5)),
    l1AbsoluteVsCorrected: round(sum(bookMeanVec.map((v, i) => Math.abs(v - bandRates[i]))), 6),
    l1RelativeVsCorrected: round(sum(bookRelative.map((v, i) => Math.abs(v - bandRelative[i]))), 5),
  },
  underEkT1sOwnPredicate: {
    orderedBooks: ekt1Books.filter((b) => isOrderedOld(b.belief)).length,
    meanVectorOrdered: isOrderedOld(bookMeanVec),
    note: 'THE RECEIPT that this stage reads the SAME banked books EK-T1 scored: under '
      + 'EK-T1\'s own predicate (free > pressed > mid) the committed cells reproduce its '
      + 'published reading exactly. G-RESCORE checks that against the artifact\'s own '
      + 'published numbers.',
  },
};

/* ========================================================================== */
/* §8 THE GATES — the FROZEN list; the headline count is this list's length     */
/* ========================================================================== */
const FROZEN_GATE_NAMES = [
  'gDet', 'xSrcUntouched', 'xFpProd', 'gWorld', 'gByteIdentical', 'gArms', 'gLabelReading',
  'gFreshness', 'gAccounting', 'gCensusLive', 'gN', 'gCells', 'gRescore',
  'gValuesUnreachable', 'gSeed', 'gStats', 'gEnvClean', 'gResume',
] as const;

/* ---- G-WORLD -------------------------------------------------------------- */
const gWorldRows = ((): Record<string, unknown> => {
  const m = matchOf(GWORLD_SEED, 'off', null);
  const conj = armConjuncts(m, 'off', null, GWORLD_SEED);
  const armOkCount = clusters.filter((c) => c.armOk).length;
  return {
    ...conj,
    constructionSeed: GWORLD_SEED,
    censusFlags: CENSUS_FLAGS,
    durationS: MATCH_DURATION,
    drillCadenceTicks: DRILL_SPACING,
    holdTicks: HOLD_K_TICKS,
    tableSha: EXPECTED_TABLE_SHA,
    doorKeys: DOOR_FLAGS,
    geneKeysChecked: GENE_NEEDLES,
    genomeViewsChecked: genomeViews(m).length,
    censusMatchesArmOk: armOkCount,
    censusMatches: clusters.length,
    pass: Object.values(conj).every(Boolean) && armOkCount === clusters.length,
  };
})();
const gWorld = gWorldRows.pass === true;

/* ---- G-BYTE-IDENTICAL: the observer never moves the timeline ---------------- */
const byteIdenticalCount = clusters.filter((c) => c.byteIdentical).length;
const gByteIdentical = byteIdenticalCount === clusters.length && clusters.length > 0;

/* ---- G-ARMS: one MUTANT per conjunct, each RE-INVOKING the predicate -------- */
const gArmsRows = ((): Record<string, unknown> => {
  const seed = IS_PREFLIGHT ? GUARD_BASE + 1 : CORE_BASE + 1;
  const books: [HoldAccountBook, HoldAccountBook] = [
    new HoldAccountBook(), new HoldAccountBook(),
  ];
  const truth = armConjuncts(matchOf(seed, 'observer', books), 'observer', books, seed);
  const mutants: { conjunct: string; flipped: boolean }[] = [];
  mutants.push({ conjunct: 'learnFlag',
    flipped: armConjuncts(matchOf(seed, 'off', null), 'observer', books, seed)
      .learnFlag === false });
  // vetoShut — a match with the consuming door armed is NOT this census's world
  const mv = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS, ekHoldLearn: true, ekHoldVeto: true,
    ekHoldBooks: books });
  mv.whetherEye = EYE_CONFIG;
  mutants.push({ conjunct: 'vetoShut',
    flipped: armConjuncts(mv, 'observer', books, seed).vetoShut === false });
  const m3 = matchOf(seed, 'observer', books);
  (m3 as unknown as { ekHold: unknown }).ekHold = null;
  mutants.push({ conjunct: 'booksWired',
    flipped: armConjuncts(m3, 'observer', books, seed).booksWired === false });
  const m4 = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS, c5Hold: false, ekHoldLearn: true,
    ekHoldBooks: books });
  m4.whetherEye = EYE_CONFIG;
  mutants.push({ conjunct: 'drillWorld',
    flipped: armConjuncts(m4, 'observer', books, seed).drillWorld === false });
  const m5 = matchOf(seed, 'observer', books);
  m5.whetherEye = null;
  mutants.push({ conjunct: 'eyeArmed',
    flipped: armConjuncts(m5, 'observer', books, seed).eyeArmed === false });
  const m6 = matchOf(seed, 'observer', books);
  (m6 as unknown as Record<string, unknown>).ptpPassLead = true;
  mutants.push({ conjunct: 'doorsShut',
    flipped: armConjuncts(m6, 'observer', books, seed).doorsShut === false });
  const m7 = matchOf(seed, 'observer', books);
  (m7.teams[0].baseGenome as TacticalGenome & Record<string, unknown>).ekHoldBelief
    = [0.1, 0.2, 0.3];
  mutants.push({ conjunct: 'noGene',
    flipped: armConjuncts(m7, 'observer', books, seed).noGene === false });
  const m8 = new Match({ seed, teamA: team('A', seed * 2 + 7), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, ...CENSUS_FLAGS, ekHoldLearn: true, ekHoldBooks: books });
  m8.whetherEye = EYE_CONFIG;
  mutants.push({ conjunct: 'censusConstruction',
    flipped: armConjuncts(m8, 'observer', books, seed).censusConstruction === false });
  return {
    truth,
    mutants,
    coverage: 'EVERY conjunct of this census\'s configuration-identity predicate carries its '
      + 'own mutant (8 conjuncts / 8 mutants), and every mutant RE-INVOKES `armConjuncts` '
      + 'rather than re-implementing it (#260.2). The claim reaches exactly those eight.',
    pass: Object.values(truth).every(Boolean) && mutants.every((x) => x.flipped),
  };
})();
const gArms = gArmsRows.pass === true;

/* ---- ⭐⭐ G-LABEL-READING: the instrument's counting IS the seam's ----------- */
const gLabelRows = ((): Record<string, unknown> => {
  const cellsMatching = clusters.filter((c) => c.seamCellsMatch).length;
  const holdsChecked = sum(clusters.map((c) => c.holdsChecked));
  const seamOnly = sum(clusters.map((c) => c.divergent.seamOnly));
  const probeOnly = sum(clusters.map((c) => c.divergent.probeOnly));
  const probeTotal = [0, 1, 2].map((b) => sum(clusters.map((c) => c.probePunished[b])));
  /** ⭐ NON-VACUITY AT THE CLAIM'S OWN GRAIN (#263.2): the claim is per-CELL equality over
   *  every seed × side × band, so the count of NON-EMPTY cells is published, and both label
   *  values must actually occur in every band — an all-punished or all-unpunished band
   *  would make the equality claim vacuous where it matters. */
  const nonEmptyCells = clusters.reduce((a, c) => a
    + [0, 1].reduce((x, s) => x + c.cellHolds[s].filter((h) => h > 0).length, 0), 0);
  const cellsTotal = clusters.length * 2 * EK_HOLD_BANDS;
  const bothLabelsPerBand = [0, 1, 2].map((b) => totalPunished[b] > 0
    && totalHolds[b] - totalPunished[b] > 0);
  return {
    clusters: clusters.length,
    clustersWithCellsMatching: cellsMatching,
    cellsCompared: cellsTotal,
    nonEmptyCells,
    holdsChecked,
    bothLabelValuesPerBand: bothLabelsPerBand,
    seamPunishedTotal: sum(totalPunished),
    probePunishedTotal: sum(probeTotal),
    probePunishedPerBand: probeTotal,
    divergentSeamOnly: seamOnly,
    divergentProbeOnly: probeOnly,
    divergenceShare: round((seamOnly + probeOnly) / Math.max(1, holdsChecked), 6),
    reading: 'THE RULE OF RECORD IS THE SEAM READING (B): the ledger\'s own state machine, '
      + 'replayed tick-exactly on the public event stream in its own intra-tick order — '
      + 'takes noted during the previous step, then the chain, then this tick\'s drill dose, '
      + 'then the window sweep — and it reproduces the observer arm\'s OWN books cell for '
      + 'cell. The PROBE reading (A) is EK-T1\'s deff re-walk rule (first loss at or after '
      + 'the hold, inside W), published only to RESOLVE the #263.2(2) lead: it ignores the '
      + 'ledger\'s intra-tick order and its pending semantics, so it disagrees on exactly '
      + 'the holds whose closing loss is stamped at the same instant the hold is noted or '
      + 'after the whistle. A divergence is a defect in THIS INSTRUMENT, not in the seam '
      + '(#263.3) — which is why the seam reading is what the yardstick is built from.',
    pass: cellsMatching === clusters.length && holdsChecked > 0
      && bothLabelsPerBand.every(Boolean) && nonEmptyCells > 0,
  };
})();
const gLabelReading = gLabelRows.pass === true;

/* ---- G-FRESHNESS: the seam's refusal is LIVE and mirrored ------------------- */
const gFreshnessRows = {
  refusedTotal: sum(clusters.map((c) => c.refused)),
  refusedStale: sum(clusters.map((c) => c.refusedStale)),
  refusedUnseen: sum(clusters.map((c) => c.refusedUnseen)),
  staleMaxTicks: Math.max(...clusters.map((c) => c.staleMax)),
  refusalSplitAdds: clusters.every((c) => c.refusedStale + c.refusedUnseen === c.refused),
  countedHolds: sum(totalHolds),
  countedEqualsTakesPlusDrills: sum(totalHolds)
    === sum(clusters.map((c) => c.takeHolds + c.drillHolds)),
  refusedShareOfDoses: round(sum(clusters.map((c) => c.refused))
    / Math.max(1, sum(clusters.map((c) => c.refused + c.drillHolds))), 5),
  semantics: 'THE FRESHNESS REFUSAL IS PART OF THE POPULATION DEFINITION (#263.3): a drill '
    + 'whose seat placement is not the immediately preceding tick carries NO band and is NOT '
    + 'a member of this census — exactly as it is not a member of any book. It is counted '
    + 'and published, never imputed, never re-banded.',
};
const gFreshness = gFreshnessRows.refusalSplitAdds
  && gFreshnessRows.countedEqualsTakesPlusDrills
  && gFreshnessRows.refusedTotal > 0;

/* ---- G-ACCOUNTING: the partition + the ladder's monotonicity ---------------- */
const gAccountingRows = {
  ...partition,
  ladderMonotoneInWindow: ladderMonotone,
  holdsInvariantInWindow: true,
  punishedSubsetOfHolds: [0, 1, 2].every((b) => totalPunished[b] <= totalHolds[b]),
};
const gAccounting = partition.partitionHolds === true
  && partition.closedTotalEqualsHolds === true
  && partition.nonNegative === true
  && gAccountingRows.punishedSubsetOfHolds
  && ladderMonotone;

/* ---- G-CENSUS-LIVE: non-vacuity at the TABLE's own grain -------------------- */
const gCensusLiveRows = {
  bandsWithHolds: totalHolds.filter((h) => h > 0).length,
  bandsWithPunishment: totalPunished.filter((p) => p > 0).length,
  minBandHolds: Math.min(...totalHolds),
  clustersWithAllThreeBands: clusters.filter((c) => c.holds.every((h) => h > 0)).length,
  clusters: clusters.length,
  totalHolds,
  totalPunished,
  takesSeen: sum(clusters.map((c) => c.takeHolds)),
  drillsSeen: sum(clusters.map((c) => c.drillHolds)),
  vetoesServed: sum(clusters.map((c) => c.vetoes)),
};
const gCensusLive = gCensusLiveRows.bandsWithHolds === 3
  && gCensusLiveRows.bandsWithPunishment === 3
  && gCensusLiveRows.takesSeen > 0 && gCensusLiveRows.drillsSeen > 0
  && gCensusLiveRows.vetoesServed === 0;

/* ---- G-N: the frozen N* IS the recomputed rule ------------------------------ */
const smokeSource = ((): { matches: number; holds: number[]; punished: number[];
  deff: number; msPerMatch: number } => {
  if (smokeCommitted !== null) {
    const r = smokeCommitted.result as Record<string, unknown>;
    const c = r.census as Record<string, unknown>;
    const env = smokeCommitted.envelope as Record<string, unknown>;
    return {
      matches: (c.clusters as number),
      holds: c.totalHolds as number[],
      punished: c.totalPunished as number[],
      deff: c.deffMeasured as number,
      msPerMatch: env.msPerMatchMeasured as number,
    };
  }
  return {
    matches: clusters.length,
    holds: totalHolds,
    punished: totalPunished,
    deff: deffMeasured,
    msPerMatch: Number.isFinite(msPerMatchMeasured) ? msPerMatchMeasured : 150,
  };
})();
const sizing = sizingFrom(smokeSource);
const gNRows = {
  sizing,
  smokeSourceIsCommittedSmoke: smokeCommitted !== null,
  smokeArtifact: SMOKE_PATH,
  nFrozen: N_FROZEN,
  ranAtN: N,
  tau: TAU,
  /** ⭐ MODE-CONDITIONED (#250.3): only the FULL census must run AT the sized N. */
  nRuleApplies: MODE === 'full' && !IS_PREFLIGHT,
  note: 'The FULL run reads its two sizing inputs (this venue\'s hold/punish counts and the '
    + 'ms/match) from the COMMITTED SMOKE artifact — the ms/match from its UNHASHED envelope '
    + '(#258.3), so no timing of this run enters this run\'s hashed body.',
};
const gN = TAU >= 0.9
  && (!gNRows.nRuleApplies
    || (smokeCommitted !== null && N === N_FROZEN && (sizing.nStar as number) === N_FROZEN));

/* ---- G-CELLS: the headline re-derives from the stored cells alone ----------- */
const storedCells = clusters.map((c) => ({
  seed: c.seed, cellHolds: c.cellHolds, cellPunished: c.cellPunished,
  ladderPunished: c.ladderPunished, byKind: c.byKind, closedByCause: c.closedByCause,
  refused: c.refused, refusedStale: c.refusedStale, refusedUnseen: c.refusedUnseen,
  takeHolds: c.takeHolds, drillHolds: c.drillHolds,
  distinctPunishingLosses: c.distinctPunishingLosses,
}));
const gCellsRows = ((): Record<string, unknown> => {
  const h = [0, 1, 2].map((b) => sum(storedCells.map((c) => c.cellHolds[0][b] + c.cellHolds[1][b])));
  const p = [0, 1, 2].map((b) => sum(storedCells
    .map((c) => c.cellPunished[0][b] + c.cellPunished[1][b])));
  const rates = p.map((x, i) => (h[i] > 0 ? x / h[i] : 0));
  const order = [0, 1, 2].slice().sort((a, b) => rates[b] - rates[a]).map((i) => BAND_KEYS[i]);
  return {
    rederivedHolds: h,
    rederivedPunished: p,
    publishedHolds: totalHolds,
    publishedPunished: totalPunished,
    rederivedRates: rates.map((v) => round(v, 6)),
    publishedRates: bandRates.map((v) => round(v, 6)),
    rederivedOrdering: order,
    publishedOrdering: ORDERING,
    clustersStored: storedCells.length,
  };
})();
const gCells = canonical(gCellsRows.rederivedHolds) === canonical(gCellsRows.publishedHolds)
  && canonical(gCellsRows.rederivedPunished) === canonical(gCellsRows.publishedPunished)
  && canonical(gCellsRows.rederivedOrdering) === canonical(gCellsRows.publishedOrdering)
  && storedCells.length === clusters.length;

/* ---- ⭐ G-RESCORE: the banked books are read, and read correctly ------------- */
const gRescoreRows = ((): Record<string, unknown> => {
  const claim = (ekt1Result.claim as Record<string, unknown>);
  const limbI = claim.limbI as { meanVectorPct: number[] };
  const limbII = claim.limbII as { orderedBooks: number; orderedShare: number; books: number };
  const rederivedPct = bookMeanVec.map((v) => round(v * 100, 3));
  const rederivedOldOrdered = ekt1Books.filter((b) => isOrderedOld(b.belief)).length;
  return {
    artifactShaSelfConsistent: ekt1ShaRederived === ekt1.resultSha256,
    booksRead: ekt1Books.length,
    booksPublished: limbII.books,
    meanVectorRederivedPct: rederivedPct,
    meanVectorPublishedPct: limbI.meanVectorPct,
    meanVectorAgrees: canonical(rederivedPct) === canonical(limbI.meanVectorPct),
    orderedBooksUnderEkT1Predicate: rederivedOldOrdered,
    orderedBooksPublishedByEkT1: limbII.orderedBooks,
    /** STRICTNESS, exercised on synthetic ties on BOTH pairs of the NEW ordering. */
    strictTieRejected: (() => {
      const a = [0, 0, 0]; const b = [0, 0, 0]; const c = [0, 0, 0];
      a[ORDER_IDX[0]] = 0.8; a[ORDER_IDX[1]] = 0.8; a[ORDER_IDX[2]] = 0.7;
      b[ORDER_IDX[0]] = 0.8; b[ORDER_IDX[1]] = 0.7; b[ORDER_IDX[2]] = 0.7;
      c[ORDER_IDX[0]] = 0.8; c[ORDER_IDX[1]] = 0.75; c[ORDER_IDX[2]] = 0.7;
      return !isOrderedNew(a) && !isOrderedNew(b) && isOrderedNew(c);
    })(),
    beliefMathMismatches: ekt1Books.reduce((acc, bk) => acc + [0, 1, 2]
      .filter((i) => {
        const h = bk.cells.holds[i]; const p = bk.cells.punished[i];
        return bk.belief[i] !== (h > 0 ? p / h : 0) || p > h;
      }).length, 0),
  };
})();
const gRescore = gRescoreRows.artifactShaSelfConsistent === true
  && gRescoreRows.meanVectorAgrees === true
  && gRescoreRows.orderedBooksUnderEkT1Predicate === gRescoreRows.orderedBooksPublishedByEkT1
  && gRescoreRows.booksRead === gRescoreRows.booksPublished
  && gRescoreRows.strictTieRejected === true
  && gRescoreRows.beliefMathMismatches === 0;

/* ---- G-VALUES-UNREACHABLE -------------------------------------------------- */
const srcFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFiles(p);
  return p.endsWith('.ts') ? [p] : [];
});
const SRC = srcFiles('src');
const srcAll = SRC.map((f) => readFileSync(f, 'utf8')).join('\n');
const NEEDLE_FLOOR = 0.0001;
const VALUE_KEY_RE = /rate|ci95|share|margin|mean|sd$|point|lower|upper|p10|p50|p90|median|quantile|delta|diff|tvd|gap/i;
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
const ekc0 = readJson(EKC0_PATH);
const ekc0b = readJson(EKC0B_PATH);
const needleValues = new Set<number>();
collectNumbers(ekc0.result, needleValues, false);
collectNumbers(ekc0b.result, needleValues, false);
collectNumbers(ekt1Result, needleValues, false);
collectNumbers(tableRaw.build.table.cells, needleValues, false);
const significantDigits = (f: string): number => f.replace('.', '').replace(/^0+/, '').length;
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
const srcTokens = new Set(srcAll.match(/\d+\.\d+|\d+/g) ?? []);
const valueHits = searchable.filter((f) => srcTokens.has(f));
const NAME_NEEDLES = ['ek-c0-hold-outcome-census', 'ek-c0b-inversion-diagnostic',
  'c5-recensus.json', 'ek-c0.hold-truth-table', 'ek-t1-hold-convergence-exam',
  'ek-c0c.intimeline-hold-truth-table'];
const nameHits = NAME_NEEDLES.filter((s) => srcAll.includes(s));
const controlNeedleFound = srcTokens.has('0.5') && srcAll.includes('EK_HOLD_WINDOW_S');
const gValuesRows = {
  needleFormsSearched: searchable.length,
  excludedByFloor: excludedForms,
  rateNeedles: needleValues.size,
  valueHits,
  nameHits,
  controlNeedleFound,
  coverage: 'EK-T0\'s / EK-T1\'s own committed extraction, replayed and EXTENDED to EK-T1\'s '
    + 'result (the books this stage re-scores): every KEYED measured answer of EK-C0, EK-C0b, '
    + 'EK-T1 and the certified table, non-integer and above the declared floor, in THREE '
    + 'string forms (raw · 5-dp · the printed PERCENTAGE form at 3 dp), each form required to '
    + 'carry ≥ 3 decimals AND ≥ 4 significant digits. The CONTROL NEEDLE proves the search is '
    + 'live. It does NOT cover this stage\'s own measured values (they are the result).',
};
const gValuesUnreachable = valueHits.length === 0 && nameHits.length === 0
  && controlNeedleFound && needleValues.size >= 12;

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
const blocksUsed = IS_PREFLIGHT
  ? [{ name: 'preflight (guard block)', first: GUARD_BASE, last: GUARD_BASE + GUARD_SPAN - 1 }]
  : [
    { name: 'core (G-DET + G-ARMS)', first: CORE_BASE, last: CORE_BASE + CORE_N - 1 },
    { name: 'preflight/guard block', first: GUARD_BASE, last: GUARD_BASE + GUARD_SPAN - 1 },
    { name: 'G-WORLD construction seed', first: GWORLD_SEED, last: GWORLD_SEED },
    { name: `the census (${MODE})`, first: seedOf(0), last: seedOf(N - 1) },
  ];
const seedBlocks = blocksUsed.map((b) => ({
  ...b,
  collisions: CONSUMED.filter((c) => b.first <= c.range[1] && b.last >= c.range[0])
    .map((c) => c.name),
})).map((b) => ({ ...b, ok: b.collisions.length === 0 }));
const sortedBlocks = [...seedBlocks].sort((a, b) => a.first - b.first);
const blocksOrdered = sortedBlocks.every((b, i) => i === 0 || b.first > sortedBlocks[i - 1].last);
const gSeed = seedBlocks.every((b) => b.ok) && blocksOrdered
  && CONSUMED.some((c) => c.name.includes('EK-T1 exam band'));
const statsGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
const gStats = STATS_BASE >= 109_400 && statsGap >= 200;

/* ---- ⭐ G-ENV-CLEAN --------------------------------------------------------- */
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
  semantics: 'WHITELIST-OR-REFUSE in its THIRD-VISIT form: any unrecognised EKC0C_* variable '
    + 'AND any ENGINE env door is a FATAL refusal (exit 2), and EVERY override — INCLUDING '
    + 'the output path EKC0C_OUT — is a PREFLIGHT that routes onto the guard block, may not '
    + 'write a canonical repo path, and reds this gate. MODE is not an override: each mode '
    + 'owns its own canonical artifact.',
};
const gEnvClean = !IS_PREFLIGHT && rogueOwn.length === 0 && rogueEngine.length === 0;

/* ---- G-RESUME --------------------------------------------------------------- */
const resumeSeed = seedOf(0);
const resumeRow = clusterOf(resumeSeed);
const gResumeRows = {
  seed: resumeSeed,
  checkpointDigest: clusters[0].digest,
  recomputedDigest: resumeRow.digest,
  resumedFromCheckpoint: done.has(resumeSeed),
  checkpointPath: CHECKPOINT_PATH,
  designTag: DESIGN_TAG,
};
const gResume = resumeRow.digest === clusters[0].digest;

/* ---- G-DET: the deterministic CORE runs twice ------------------------------- */
const core = (): Record<string, unknown> => {
  const rows = Array.from({ length: 4 }, (_, i) => {
    const seed = (IS_PREFLIGHT ? GUARD_BASE : CORE_BASE) + i;
    const c = clusterOf(seed);
    return { seed, holds: c.holds, punished: c.punished, digest: c.digest };
  });
  return {
    rows,
    bandRates: bandRates.map((v) => round(v, 8)),
    ordering: ORDERING,
    rescoreShare: round(shareNew, 5),
    rescoreRoute: MATCH ? 'MATCH' : 'MISMATCH',
  };
};
const digestA = sha(canonical(core()));
const digestB = sha(canonical(core()));
const gDet = digestA === digestB;

/* ========================================================================== */
/* §9 THE ARTIFACT                                                            */
/* ========================================================================== */
const gates: Record<string, boolean> = {
  gDet,
  xSrcUntouched,
  xFpProd,
  gWorld,
  gByteIdentical,
  gArms,
  gLabelReading,
  gFreshness,
  gAccounting,
  gCensusLive,
  gN,
  gCells,
  gRescore,
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

const result = {
  stage: 'EK-C0c — THE IN-TIMELINE DRILL CENSUS + THE RE-SCORE (H-EK′)',
  contract: 'docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §2/§3; ruling #263.3',
  doc: 'docs/world-model/EK-C0C-INTIMELINE-CENSUS.md',
  mode: IS_PREFLIGHT ? 'PREFLIGHT — NOT THE CENSUS' : (MODE === 'full' ? 'CENSUS' : 'SMOKE'),
  gatingGrain: IS_PREFLIGHT
    ? 'PREFLIGHT, guard block — these rows adjudicate NOTHING'
    : `${MODE === 'full' ? 'THE CENSUS' : 'THE SMOKE'}: N = ${N} seeds × 2 arms`,
  design: {
    seeds: N,
    window: EK_HOLD_WINDOW_S,
    windowLadder: WINDOW_LADDER,
    bands: BAND_LABEL,
    holdTicks: HOLD_K_TICKS,
    drillCadenceTicks: DRILL_SPACING,
    tau: TAU,
    world: 'THE IN-TIMELINE DRILL WORLD — EK-T1\'s committed world VERBATIM (EK-C0\'s census '
      + 'flags + 240 s + the certified table INJECTED into an armed whetherEye + EK-T0\'s '
      + 'drill driver at the census cadence), with the learning door armed ONLY as an '
      + 'OBSERVER (ekHoldVeto false, no mechanic reads a book) and the FLAGS-OFF twin walked '
      + 'on every seed to prove the trajectory is the flags-off world\'s.',
    counting: 'THE SEAM\'S OWN RULES: the seat\'s band placement, the freshness refusal, the '
      + '10 s first-loss label closed at the loss / the window / the whistle, drill and take '
      + 'holds alike — the population truth OF WHAT BOOKS COUNT (#263.3).',
    estimator: `cluster bootstrap by MATCH SEED (#20), ${BOOTSTRAP} resamples, percentile `
      + '95 % CI, ratio-of-sums per band, ONE SHARED resample-index matrix so every gap is '
      + 'paired by construction.',
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
    matchesIdentical: byteIdenticalCount,
    matchesWalked: clusters.length,
    semantics: 'THE OBSERVER MOVES NOTHING: the armed (learn-only) world\'s whole-run '
      + 'signature — rng stream state inside — equals the FLAGS-OFF drill world\'s on EVERY '
      + 'census seed. That is what licenses #263.3\'s words: the census describes the '
      + 'flags-off timeline, and the count beside it is the seam\'s own.',
  },
  gArms: gArmsRows,
  gLabelReading: gLabelRows,
  gFreshness: { ...gFreshnessRows, pass: gFreshness },
  gAccounting: { ...gAccountingRows, pass: gAccounting },
  gCensusLive: { ...gCensusLiveRows, pass: gCensusLive },
  gN: { ...gNRows, pass: gN },
  gCells: { ...gCellsRows, pass: gCells },
  gRescore: { ...gRescoreRows, pass: gRescore },
  gValuesUnreachable: { ...gValuesRows, pass: gValuesUnreachable },
  gSeed: { blocks: seedBlocks, ordered: blocksOrdered, pass: gSeed },
  gStats: { base: STATS_BASE, minGap: statsGap, pass: gStats },
  gEnvClean: { ...gEnvCleanRows, pass: gEnvClean },
  gResume: { ...gResumeRows, pass: gResume },
  /* ---- ⭐⭐ THE CENSUS ---- */
  census: {
    clusters: clusters.length,
    totalHolds,
    totalPunished,
    bandRates: bandRates.map((v) => round(v, 6)),
    yardstick,
    partition,
    byKind,
    ladder,
    moments,
    deffMeasured: round(deffMeasured, 6),
    labelReadings: {
      seamPunishedPerBand: totalPunished,
      probePunishedPerBand: [0, 1, 2].map((b) => sum(clusters.map((c) => c.probePunished[b]))),
      divergentSeamOnly: sum(clusters.map((c) => c.divergent.seamOnly)),
      divergentProbeOnly: sum(clusters.map((c) => c.divergent.probeOnly)),
      ruleOfRecord: 'THE SEAM READING',
    },
  },
  /* ---- ⭐⭐ THE RE-SCORE ---- */
  rescore,
  /* ---- the venue-dependence record: the TWO truths of the same world ---- */
  venueDependence: ((): Record<string, unknown> => {
    const ek = ((ekc0.result as Record<string, unknown>).census as Record<string, unknown>)
      .yardstick as { bands: Record<string, { punishRate: number; holds: number;
        punished: number }>; ordering: string[] };
    const cloneRates = BAND_KEYS.map((k) => ek.bands[k].punished / ek.bands[k].holds);
    return {
      cloneDosed: {
        source: 'EK-C0 (#260) — ISOLATED CLONE-DOSED holds, every dose on a fresh clone of an '
          + 'undisturbed timeline',
        ratesPct: cloneRates.map((v) => round(v * 100, 3)),
        holds: BAND_KEYS.map((k) => ek.bands[k].holds),
        ordering: ek.ordering,
      },
      inTimeline: {
        source: 'EK-C0c (this stage) — IN-TIMELINE ACCUMULATING drills, the venue the books '
          + 'live in',
        ratesPct: bandRates.map((v) => round(v * 100, 3)),
        holds: totalHolds,
        ordering: ORDERING,
      },
      deltaPp: bandRates.map((v, i) => round((v - cloneRates[i]) * 100, 3)),
      orderingsAgree: canonical(ek.ordering) === canonical(ORDERING),
      note: 'THE VENUE-DEPENDENCE RECORD (#263.3): the same world, the same label semantics, '
        + 'two populations. REPORTED — this stage measures, it does not adjudicate (#203).',
    };
  })(),
  perClusterCells: storedCells,
};

const envelope = {
  head: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
  generatedAt: new Date().toISOString(),
  outPath: OUT_PATH,
  batteryWallSeconds: batteryWallS,
  msPerMatchMeasured: Number.isFinite(msPerMatchMeasured) ? round(msPerMatchMeasured, 3) : null,
  freshSeedsWalked: walkedFresh,
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
process.stdout.write(`N ${N} (N* ${sizing.nStar}) holds ${JSON.stringify(totalHolds)} punished ${
  JSON.stringify(totalPunished)}\n`);
process.stdout.write(`yardstick % ${JSON.stringify(bandRates.map((v) => round(v * 100, 3)))} (${
  BAND_LABEL.join('/')}) ordering ${ORDERING_LABEL.join(' > ')}\n`);
process.stdout.write(`H-EK' limbI ${limbINew} limbII ${limbIINew} share ${
  round(shareNew, 5)} route ${MATCH ? 'MATCH' : 'MISMATCH'}\n`);
process.stdout.write(`${allPass ? 'ALL HARD GATES PASS' : '*** A GATE IS RED ***'}\n`);
process.exit(allPass ? 0 : 1);
