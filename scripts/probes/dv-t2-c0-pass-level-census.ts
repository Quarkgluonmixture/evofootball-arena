/**
 * DV-T2-C0 — THE PASS-LEVEL CENSUS (⭐ THE LABEL'S OWN TRUTH: P(punished | delivery into z)).
 *
 * Authority: the DV-T2 LEARNED-MAP CONTRACT `docs/world-model/DV-T2-LEARNED-MAP-CONTRACT.md`
 * §2 M-DV2.1 (THE PASS-LEVEL LABEL) and §3 T2-C0 ("measure the label's own truth globally —
 * P(conceded ≤ 10 s | delivery into z, lost) by AIM zone, production world — because the banked
 * GGC cut indexes losses by LAST-OWNED zone and cannot be re-cut by aim"), bound by ruling #255.2,
 * dispatched by #255.4. Rulings #245/#246/#247/#248 (the DV arc: the reality-shape check, the
 * truth/belief split, the earned-knowledge ledger) · #249 (DV-C0 — ⭐ THE FORM this stage
 * inherits: census form, loss-tick semantics, the attribution rule, the accounting identities,
 * the N rule) · #214/#215.3/#216/#218 (the goal-genealogy census — the walker and the 10 s
 * window family) · #250.3 (mode-conditioned caveat literals) · #251.3 (⭐⭐ DERIVE YOUR OWN
 * PREDICATES AND PROVE EVERY CONJUNCT LIVE — a mutant per conjunct) · #252.3 (mutant COVERAGE:
 * every conjunct, not a subset) · #163 (seed/stats disjointness) · #181.2 (every HARD gate
 * computed in-probe) · #197-M1/#198 (hashed body vs unhashed envelope) · #20 (cluster = match
 * seed) · #128 (wall is CONTEXT ONLY) · #203 (rows, never verdicts) · #226.1 (the transcript
 * form) · #229.2 (no table typed that the artifact does not carry — a committed generator).
 *
 * WHAT THIS IS: a single-arm CENSUS of the PRODUCTION world (`new Match({seed, teamA, teamB})` —
 * the shipped game, no flag, no gene, no eye). For EVERY ground DELIVERY it measures the
 * M-DV2.1 LABEL: the delivery's own possession chain ends in a LOSS and the deliverer's side
 * concedes inside the census's OWN 10 s window ⇒ a PUNISHMENT tick (z, 1); otherwise (z, 0) —
 * indexed by the AIM zone in the PASSING team's frame, which is the pricing's own read
 * (`receptionZoneIndex`, imported from the shipped seat module, never re-typed).
 *
 * ⭐⭐ INSTRUMENT-ONLY. ZERO src/** (X-SRC-UNTOUCHED is a HARD gate). Everything is a tick-walk
 * over observable match state plus one INERT instance wrapper on `performPass` (G-WRAPPER-INERT
 * proves the inertness on a twin walk rather than asserting it). Nothing here reaches any player.
 *
 * ⭐ NOT A CONTRAST. One arm, one world, no treatment, no pairing. The ONLY pre-registered
 * predicates are the #246 REALITY-SHAPE ones, which are REPORTED and adjudicate no mechanic.
 *
 * MODES (explicit DVT2C0_MODE, NO default):
 *   smoke — plumbing + exactly TWO sizing numbers (ms/match, rarest-zone punished deliveries per
 *           match at the primary window). ADJUDICATES NOTHING and freezes no level.
 *   full  — the census at the frozen §NRULE N (read off the committed smoke artifact).
 *
 * COMMANDS (stage doc §CHECKS):
 *   DVT2C0_MODE=smoke npx tsx scripts/probes/dv-t2-c0-pass-level-census.ts
 *   DVT2C0_MODE=full  npx tsx scripts/probes/dv-t2-c0-pass-level-census.ts
 * EXIT: 0 = clean census · 1 = a gate is RED · 2 = usage/fatal.
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'node:path';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';
import { mtArmedVersion, MT_WORLD_FLAGS } from '../../src/game/a4World';
/** ⭐⭐ THE AIM INDEX IS THE PRICING'S OWN READ, IMPORTED — the §HONESTY 8 mismatch fixed AT THE
 *  SOURCE (M-DV2.1). `receptionZoneIndex` is the very classifier the risk price reads the belief
 *  with; this census does not re-implement it and does not re-type its boundary. */
import { DV_THIRD_BOUNDARY_LOCAL_X, DV_ZONES, receptionZoneIndex } from '../../src/ai/deliveryValueSeat';

/* ========================================================================== */
/* §1 FROZEN INSTRUMENT CONSTANTS — every one of them TRACED                   */
/* ========================================================================== */
/** THE THIRD BOUNDARY in the frame team's LOCAL x: `HALF_L / 3` — the #188 / PM-T1
 *  `OWN_THIRD_LOCAL_X` inherited through #214 → DV-C0 → the shipped seat. gZoneTrace re-derives
 *  it from the pitch constant AND proves it is the seat module's own exported boundary. */
const THIRD_LOCAL_X = HALF_L / 3;
/** ⭐ THE PRIMARY WINDOW: 10 sim-seconds — "the census's OWN 10 s window" (M-DV2.1). NOT typed as
 *  a level: gWindowTrace READS it off DV-C0's committed artifact and asserts membership of the
 *  #218 goal-genealogy family. */
const PRIMARY_WINDOW_S = 10;
/** THE SENSITIVITY LADDER — DV-C0's own published ladder, re-asserted against its artifact. */
const WINDOWS_S = [5, 10, 15, 20] as const;

/** THE ZONES — the AIM third in the PASSING team's own attacking frame (`DV_ZONES` order). */
const THIRDS = DV_ZONES;
type Third = (typeof THIRDS)[number];
/** the LOSS third (the census's own cut, kept for the inherited G-REPRO columns). */
const lossThirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');
/** ⭐ the AIM third — through the SHIPPED pricer's classifier, not a local copy. */
const aimThirdOf = (localX: number): Third => THIRDS[receptionZoneIndex(localX)];
/** the DELIVERY's outcome classes — a PARTITION (gAccounting checks it as one). */
const OUTCOMES = ['punished', 'lostUnpunished', 'survived'] as const;
type Outcome = (typeof OUTCOMES)[number];

/* --- §2 THE SEED LEDGER (#163) --------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_436_000, 12_436_999];
const SMOKE_BASE = 12_436_000;
const SMOKE_N = 12;
/** the DECLARED observational block: the wrapper-inertness twin (one seed, walked twice). */
const INERT_TWIN_SEED = 12_436_020;
/** Where EVERY non-census invocation is routed (any DVT2C0_N / _CAP / _SKIP_FP). */
const GUARD_BLOCK: readonly [number, number] = [12_436_050, 12_436_099];
const CENSUS_BASE = 12_436_100;
/** Honest hard cap = the reserved census room 12,436,100..12,436,899. A SEED-BUDGET cap. */
const N_CAP = 800;
const N_STEP = 25;
/** THE TWO DELIBERATE RE-WALKS (RECEIPTS, never fresh data) — their overlap IS the point. */
const REPRO_GGC_BASE = 12_421_000;
const REPRO_GGC_N = 12;
const REPRO_DVC0_BASE = 12_429_000;
const REPRO_DVC0_N = 12;
const GGC_SMOKE_PATH = 'docs/world-model/data/goal-genealogy-census-smoke.json';
const GGC_FULL_PATH = 'docs/world-model/data/goal-genealogy-census.json';
const DVC0_SMOKE_PATH = 'docs/world-model/data/dv-c0-loss-cost-smoke.json';
const DVC0_FULL_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';

/** THE COMPLETE #163-regime ledger — DV-T1c's committed list, extended with T1c's OWN blocks
 *  (battery 12,432,100–12,434,035 with its smoke/reads below it, and its reserved ceiling
 *  12,435,000–099) exactly as ruling #255.4 enumerates them. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
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
  { name: '⭐ goal-genealogy census band (#214/#217) — G-REPRO-GGC re-walks its smoke', range: [12_421_000, 12_421_999] },
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
  /** ⭐⭐ DV-C0's own band (#249) — its SMOKE block is what G-REPRO-DVC0 re-walks. */
  { name: '⭐⭐ DV-C0 smoke (#249) — THE BLOCK G-REPRO-DVC0 RE-WALKS', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 guard band (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD read (#249)', range: [12_429_999, 12_429_999] },
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_024] },
  { name: 'DV-T0 REPORTED cost read (#250)', range: [12_430_025, 12_430_025] },
  { name: 'DV-T0 REPORTED truth-dosed smoke (#250)', range: [12_430_026, 12_430_026] },
  /** ⚠ THE ORDERED SKIP BAND (#251/#253): DV-T0's test-file seeds. */
  { name: '⚠ DV-T0 test-file seeds (#250 — THE ORDERED SKIP BAND)', range: [12_430_900, 12_430_911] },
  { name: 'DV-T1 smoke (#251)', range: [12_430_027, 12_430_038] },
  { name: 'DV-T1 delivered-dose read (#251)', range: [12_430_040, 12_430_040] },
  { name: 'DV-T1 strike read (#251)', range: [12_430_045, 12_430_045] },
  { name: 'DV-T1 H-250a counterfactual read (#251)', range: [12_430_047, 12_430_047] },
  { name: 'DV-T1 guard band (#251)', range: [12_430_050, 12_430_099] },
  { name: 'DV-T1 battery (#251)', range: [12_430_100, 12_430_382] },
  { name: 'DV-T1b smoke (#252)', range: [12_431_000, 12_431_007] },
  { name: 'DV-T1b delivered-dose read (#252)', range: [12_431_010, 12_431_010] },
  { name: 'DV-T1b strike read (#252)', range: [12_431_015, 12_431_015] },
  { name: 'DV-T1b H-250a counterfactual read (#252)', range: [12_431_020, 12_431_020] },
  { name: 'DV-T1b guard band (#252)', range: [12_431_050, 12_431_099] },
  { name: 'DV-T1b battery (#252)', range: [12_431_100, 12_431_742] },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  /** ⭐ DV-T1c's OWN consumption (#254): smoke 12,432,000–007, the three observational reads at
   *  …010/015/020, the guard band, and the BATTERY 12,432,100–12,434,035 — entered as ONE
   *  interval from the block's floor to the battery's last walked seed, per #255.4's ledger. */
  { name: '⭐ DV-T1c smoke + reads + guard + battery (#253/#254)', range: [12_432_000, 12_434_035] },
  { name: '⭐ DV-T1c reserved ceiling (#253.1)', range: [12_435_000, 12_435_099] },
];

/* --- §3 THE STATS STREAM — a SEPARATE namespace (#163) ---------------------- */
/** ⭐ ruling #255.4 sets this stage's floor at 107,400; it clears the #163 200-gap by 400. */
const BOOTSTRAP_SEED = 107_400;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800, 105_000, 105_200, 105_400, 105_800,
  106_000, /** DV-C0's own (#249) */
  106_200, /** DV-T1's own (#251) */
  106_600, /** DV-T1b's own (#252) */
  107_000, /** DV-T1c's own (#254) */
];

/* --- §4 THE N ARITHMETIC, frozen ex ante (DV-C0's §NRULE form, inherited) ---- */
/** ⭐ THE SIZING TARGET, DERIVED FROM THE RARITY OF THE NUMERATOR exactly as DV-C0's rule is:
 *  deliveries are plentiful, but a PUNISHED delivery in the rarest aim zone is the scarce
 *  quantity and it is what sets that cell's CI width. 60 events ⇒ a count's relative SE ≈
 *  1/sqrt(60) ≈ 13 %, the precision at which an ORDERING (the #246 check) is readable. */
const TARGET_RAREST_ZONE_EVENTS = 60;
const WALL_BUDGET_HOURS = 0.5;
const XDET_FACTOR = 2;
const ARMS_COUNT = 1;
/** the PRIOR ms/match used only when no committed smoke exists — DV-C0's own measured cost. */
const PRIOR_MS_PER_MATCH = 82.9;

/* --- §5 the X-family pins --------------------------------------------------- */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SRC_DIR = 'src';

/* ========================================================================== */
/* §6 ENV / MODE / THE GUARD-BLOCK ROUTING                                     */
/* ========================================================================== */
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.DVT2C0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`DV-T2-C0 FATAL — DVT2C0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const CAP = process.env.DVT2C0_CAP ? Math.max(1, Number.parseInt(process.env.DVT2C0_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_CAPPED = Number.isFinite(CAP);
const SKIP_FP = process.env.DVT2C0_SKIP_FP === '1';
const N_ENV = process.env.DVT2C0_N ? Math.max(1, Number.parseInt(process.env.DVT2C0_N, 10)) : null;
const IS_PREFLIGHT = IS_CAPPED || SKIP_FP;
const PREFLIGHT_REASONS = [IS_CAPPED ? `DVT2C0_CAP=${CAP}` : null, SKIP_FP ? 'DVT2C0_SKIP_FP=1' : null]
  .filter((r): r is string => r !== null);

const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/dv-t2-c0-pass-level-census-smoke.json',
  full: 'docs/world-model/data/dv-t2-c0-pass-level-census.json',
};
const SMOKE_PATH = OUT_BY_MODE.smoke;
const CANONICAL_DIR = 'docs/world-model/data';
const CANONICAL_DIR_ABS = pathResolve(CANONICAL_DIR);
/** the #216-H form: BOTH sides resolved, separator-aware, so every spelling collapses to one. */
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = process.env.DVT2C0_OUT ?? (IS_PREFLIGHT ? '/tmp/dv-t2-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('DV-T2-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}. `
    + 'Pass DVT2C0_OUT=/tmp/… , or drop DVT2C0_CAP / DVT2C0_SKIP_FP to run the real thing.');
  process.exit(2);
}

/* ========================================================================== */
/* §7 numeric helpers (the house forms)                                        */
/* ========================================================================== */
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const sum = (xs: readonly number[]): number => xs.reduce((s, x) => s + x, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return Number.NaN;
  const m = mean(xs);
  return Math.sqrt(sum(xs.map((x) => (x - m) * (x - m))) / (xs.length - 1));
};
const shareOf = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 5);
const quantileSorted = (sorted: readonly number[], q: number): number => {
  if (sorted.length === 0) return Number.NaN;
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))];
};
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

/* ========================================================================== */
/* §8 THE WORLD — BARE PRODUCTION, built exactly as DV-C0's census arm is       */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ THE SHIPPED GAME, byte-for-byte DV-C0's (and the GGC census's PROD) constructor — which is
 *  WHY both G-REPRO gates can reproduce their committed rows exactly. */
const matchFor = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
});

/* ========================================================================== */
/* §9 ⭐ THE INSTRUMENT — DV-C0's walker (the GGC census's, with its LOSS-TICK   */
/*    semantics #215.3-H1/M2 verbatim), extended with the DELIVERY ledger       */
/* ========================================================================== */
const ORIGIN_CLASSES = [
  'kickoff', 'goalKick', 'kickIn', 'restartSecondBall', 'matchOpenFallback',
  'setPieceCorner', 'setPieceFreeKick', 'setPiecePenalty',
  'scrambleLooseBall',
  'turnoverWonInOwnThird', 'turnoverWonInMiddleThird', 'turnoverWonInFinalThird',
] as const;
type OriginClass = (typeof ORIGIN_CLASSES)[number];
const SET_PIECE_CLASSES: readonly OriginClass[] = ['setPieceCorner', 'setPieceFreeKick', 'setPiecePenalty'];
const OPEN_PLAY_CLASSES: readonly OriginClass[] = [
  'scrambleLooseBall', 'turnoverWonInOwnThird', 'turnoverWonInMiddleThird', 'turnoverWonInFinalThird',
];
type Family = 'setPiece' | 'restart' | 'openPlay';
const familyOf = (o: OriginClass): Family => (SET_PIECE_CLASSES.includes(o) ? 'setPiece'
  : OPEN_PLAY_CLASSES.includes(o) ? 'openPlay' : 'restart');
const CONSTRUCTED_LADDER = [3, 4, 5] as const;

interface Segment {
  index: number;
  team: Side;
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  startTick: number;
  closeTick: number;
  lastOwnedTick: number;
  assignedTicks: number;
  completedPasses: number;
  lastOwnedLocalXOwnerFrame: number;
  lossLocalXLoserFrame: number | null;
  regainSpotLocalXLoserFrame: number | null;
  lossThird: Third | null;
  regainThird: Third | null;
  regainContested: boolean;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
  goalScoringSide: Side | null;
  /** the index into `turnovers` if this segment ended with `opponentControl`, else −1. */
  turnoverIndex: number;
}

interface GoalRec {
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  lossThird: Third | null;
  family: Family;
  completedPasses: number;
}

/** ⭐ THE MEASURED LOSS EVENT — DV-C0's, verbatim (its band cut is not lifted: the belief is
 *  three-cell by M-DV2.2 and the lateral analogue is a later slice's). */
interface TurnoverRec {
  tSim: number;
  loser: Side;
  third: Third;
}

/** ⭐⭐ THE MEASURED DELIVERY — one ground pass STRUCK, indexed by its AIM zone. */
interface DeliveryRec {
  tSim: number;
  tick: number;
  side: Side;
  aimLocalX: number;
  third: Third;
  /** the possession segment this delivery was struck inside; −1 = unassigned (published). */
  segIndex: number;
  /** the priced displacement handed to the strike — MUST be null in a bare production world. */
  ledStrike: boolean;
}

interface MatchRow {
  seed: number;
  simSeconds: number;
  /* --- the inherited census columns (G-REPRO-GGC reads these) --- */
  totalTicks: number;
  deadBallTicks: number;
  segmentTicks: number;
  looseGapTicks: number;
  assignedTicksSum: number;
  spanOrderViolations: number;
  goalsFromScore: number;
  unattributedGoalSegments: number;
  segmentsByOrigin: Record<string, number>;
  segmentsByOriginAtRegainSpot: Record<string, number>;
  goals: GoalRec[];
  turnoversTotal: number;
  ownThirdTurnovers: number;
  ownThirdTurnoversAtRegainSpot: number;
  /* --- the DV-C0 loss ledger (G-REPRO-DVC0 reads these) --- */
  turnovers: TurnoverRec[];
  concededGoals: { tSim: number; conceding: Side }[];
  /* --- ⭐⭐ THE DV-T2-C0 DELIVERY LEDGER --- */
  deliveries: DeliveryRec[];
  /** `performPass` calls the engine's own guard suppressed (no strike happened). */
  suppressedPassCalls: number;
  /** deliveries whose containing segment's team is not the passer's — a violation counter. */
  deliveryTeamMismatch: number;
  /** true iff the match's `o1PassWindup` door is shut (the family-purity conjunct). */
  windupShut: boolean;
  /** the two per-segment facts the LABEL reads, carried out of the walk by index. */
  segTerminator: ('opponentControl' | 'deadBall' | 'goal' | 'matchEnd')[];
  segTurnoverIndex: number[];
}
type WalkRow = MatchRow;

/** the WHOLE walk, with the delivery capture optional so G-WRAPPER-INERT can walk the twin. */
function walkOne(seed: number, captureDeliveries = true): WalkRow {
  const m = matchFor(seed);
  const segments: Segment[] = [];
  const goals: GoalRec[] = [];
  const turnovers: TurnoverRec[] = [];
  const concededGoals: { tSim: number; conceding: Side }[] = [];
  const deliveries: DeliveryRec[] = [];
  let suppressedPassCalls = 0;

  /** ⭐ THE DELIVERY CAPTURE — an INERT instance wrapper (the PTP-T0/DV-T1 idiom). The strike is
   *  recorded ONLY when the engine's own `lastPassKind` object is replaced by the call, i.e. when
   *  the shipped guard (`ball.owner === passer && kickCooldown <= 0`) actually let the kick
   *  through — the ENGINE's truth, never a re-implemented guard. The AIM is `mate.pos`, which in
   *  a bare production world IS the ground pricer's own aim for the candidate it struck (the PTP
   *  seat is null ⇒ `aim = mate.pos`, and the decision and the strike are the SAME tick because
   *  `o1PassWindup` is shut — both are gated, not assumed). */
  /** strikes captured DURING a `m.step` call, drained onto that tick's number right after it
   *  returns — so the delivery's tick and the segment spans are read on the SAME clock, whatever
   *  `simTick`'s internal advance order is. */
  const pending: DeliveryRec[] = [];
  if (captureDeliveries) {
    const orig = m.performPass.bind(m);
    m.performPass = (
      p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<V2> | null = null,
    ): void => {
      const before = m.lastPassKind;
      orig(p, mate, offsideExempt, powerChoice, ptpLead);
      if (m.lastPassKind === before) { suppressedPassCalls++; return; }
      const aimLocalX = m.teams[p.side].localX(mate.pos.x);
      pending.push({
        tSim: m.simTime, tick: -1, side: p.side, aimLocalX: round(aimLocalX, 6),
        third: aimThirdOf(aimLocalX), segIndex: -1, ledStrike: ptpLead !== null,
      });
    };
  }

  let cur: Segment | null = null;
  let prevSeg: Segment | null = null;
  const prevStats: { completed: number }[] = ([0, 1] as const).map((s) => ({
    completed: m.teams[s].stats.passesCompleted,
  }));
  const prevScore: [number, number] = [m.score[0], m.score[1]];
  let sinceDeadBall = true;
  let contestedSinceLastSeg = false;
  let totalTicks = 0; let deadBallTicks = 0; let segmentTicks = 0; let looseGapTicks = 0;
  let unattributedGoalSegments = 0; let goalsFromScore = 0; let spanOrderViolations = 0;
  let ownThirdTurnovers = 0; let ownThirdTurnoversAtRegainSpot = 0;

  const closeSegment = (s: Segment, terminator: Segment['terminator'], scoringSide: Side | null,
    closeTick: number): void => {
    s.terminator = terminator;
    s.goalScoringSide = scoringSide;
    s.closeTick = closeTick;
    const last = segments.length === 0 ? null : segments[segments.length - 1];
    if (last !== null && s.startTick <= last.startTick) spanOrderViolations++;
    s.index = segments.length;
    segments.push(s);
    prevSeg = s;
  };

  const openPlayClass = (contested: boolean, t: Third): OriginClass => (contested ? 'scrambleLooseBall'
    : t === 'own' ? 'turnoverWonInOwnThird'
      : t === 'final' ? 'turnoverWonInFinalThird' : 'turnoverWonInMiddleThird');

  const openSegment = (team: Side, tick: number, ownerGid: number): Segment => {
    let origin: OriginClass;
    let lossThird: Third | null = null;
    let regainThird: Third | null = null;
    let regainContested = false;
    let regainSpotClass: OriginClass | null = null;
    if (m.kickoffKickGid === ownerGid) origin = 'kickoff';
    else if (m.restartKickGid === ownerGid) {
      const k = m.restartKickKind;
      origin = k === 'corner' ? 'setPieceCorner'
        : k === 'freeKick' ? 'setPieceFreeKick'
          : k === 'penalty' ? 'setPiecePenalty'
            : k === 'goalKick' ? 'goalKick'
              : k === 'kickIn' ? 'kickIn' : 'restartSecondBall';
    } else if (sinceDeadBall) origin = 'restartSecondBall';
    else if (prevSeg === null) origin = 'matchOpenFallback';
    else {
      const lost = prevSeg.lossLocalXLoserFrame;
      const regained = prevSeg.regainSpotLocalXLoserFrame;
      lossThird = lossThirdOf(lost === null ? 0 : -lost);
      regainThird = lossThirdOf(regained === null ? 0 : -regained);
      regainContested = contestedSinceLastSeg;
      origin = openPlayClass(contestedSinceLastSeg, lossThird);
      regainSpotClass = openPlayClass(contestedSinceLastSeg, regainThird);
    }
    const originAtRegainSpot: OriginClass = regainSpotClass ?? origin;
    return {
      index: -1, team, origin, originAtRegainSpot, startTick: tick, closeTick: tick,
      lastOwnedTick: tick, assignedTicks: 0, completedPasses: 0,
      lastOwnedLocalXOwnerFrame: m.teams[team].localX(m.ball.pos.x),
      lossLocalXLoserFrame: null, regainSpotLocalXLoserFrame: null,
      lossThird, regainThird, regainContested,
      terminator: 'matchEnd', goalScoringSide: null, turnoverIndex: -1,
    };
  };

  while (!m.finished) {
    m.step(DT);
    totalTicks++;
    const tick = m.simTick;
    while (pending.length > 0) {
      const d = pending.shift()!;
      d.tick = tick;
      deliveries.push(d);
    }
    const phase = m.phase;
    const owner = m.ball.owner;

    let goalSide: Side | null = null;
    for (const s of [0, 1] as const) {
      if (m.score[s] > prevScore[s]) {
        const d = m.score[s] - prevScore[s];
        goalSide = s;
        goalsFromScore += d;
        for (let i = 0; i < d; i++) concededGoals.push({ tSim: m.simTime, conceding: (1 - s) as Side });
      }
      prevScore[s] = m.score[s];
      const st = m.teams[s].stats;
      const dCompleted = st.passesCompleted - prevStats[s].completed;
      if (dCompleted > 0 && cur !== null && cur.team === s) cur.completedPasses += dCompleted;
      prevStats[s] = { completed: st.passesCompleted };
    }

    if (phase !== 'playing') {
      deadBallTicks++;
      if (cur !== null) {
        if (goalSide !== null) {
          closeSegment(cur, 'goal', goalSide, tick);
          goals.push({
            origin: cur.origin, originAtRegainSpot: cur.originAtRegainSpot, lossThird: cur.lossThird,
            family: familyOf(cur.origin), completedPasses: cur.completedPasses,
          });
        } else closeSegment(cur, 'deadBall', null, tick);
        cur = null;
      } else if (goalSide !== null) unattributedGoalSegments++;
      sinceDeadBall = true;
      contestedSinceLastSeg = false;
      continue;
    }

    if (m.possessionPhase.kind === 'contested') contestedSinceLastSeg = true;

    if (owner === null) {
      if (cur !== null) { cur.assignedTicks++; segmentTicks++; } else looseGapTicks++;
      if (goalSide !== null && cur === null) unattributedGoalSegments++;
      continue;
    }

    const side = owner.side;
    if (cur !== null && cur.team !== side) {
      /* ⭐ THE LOSS POINT (#215.3-H1, DEFINITIONAL): ball at the segment's LAST OWNED tick, in
       * the LOSING team's own attacking frame. Inherited from DV-C0 verbatim. */
      const lossLocal = cur.lastOwnedLocalXOwnerFrame;
      const regainLocal = m.teams[cur.team].localX(m.ball.pos.x);
      cur.lossLocalXLoserFrame = lossLocal;
      cur.regainSpotLocalXLoserFrame = regainLocal;
      const lt = lossThirdOf(lossLocal);
      if (lt === 'own') ownThirdTurnovers++;
      if (lossThirdOf(regainLocal) === 'own') ownThirdTurnoversAtRegainSpot++;
      cur.turnoverIndex = turnovers.length;
      turnovers.push({ tSim: m.simTime, loser: cur.team, third: lt });
      closeSegment(cur, 'opponentControl', null, tick);
      cur = null;
    }
    if (cur === null) {
      cur = openSegment(side, tick, owner.gid);
      sinceDeadBall = false;
      contestedSinceLastSeg = false;
    }
    const seg = cur;
    contestedSinceLastSeg = false;
    seg.assignedTicks++; segmentTicks++;
    seg.lastOwnedTick = tick;
    seg.lastOwnedLocalXOwnerFrame = m.teams[side].localX(m.ball.pos.x);
  }
  if (cur !== null) { closeSegment(cur, 'matchEnd', null, m.simTick); cur = null; }

  /** ⭐ THE DELIVERY→CHAIN ASSIGNMENT: a strike happens on a tick the passer's team OWNED the
   *  ball, so the tick lies inside exactly one segment's [startTick, closeTick] span (the spans
   *  are disjoint by construction — only one segment is open at a time, and gAccounting proves
   *  the tick partition). The match is the unit; the search is linear and deterministic. */
  let deliveryTeamMismatch = 0;
  for (const d of deliveries) {
    let found = -1;
    /** the passer's OWN team's segment wins the tick: a chain can close on the very tick the
     *  opponent's opens, and the delivery belongs to the team that struck it. */
    for (const s of segments) {
      if (s.team === d.side && d.tick >= s.startTick && d.tick <= s.closeTick) { found = s.index; break; }
    }
    if (found < 0) {
      for (const s of segments) {
        if (d.tick >= s.startTick && d.tick <= s.closeTick) { found = s.index; break; }
      }
    }
    d.segIndex = found;
    if (found >= 0 && segments[found].team !== d.side) deliveryTeamMismatch++;
  }

  const segmentsByOrigin: Record<string, number> = {};
  const segmentsByOriginAtRegainSpot: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) { segmentsByOrigin[o] = 0; segmentsByOriginAtRegainSpot[o] = 0; }
  let assignedTicksSum = 0; let turnoversTotal = 0;
  for (const s of segments) {
    segmentsByOrigin[s.origin]++;
    segmentsByOriginAtRegainSpot[s.originAtRegainSpot]++;
    assignedTicksSum += s.assignedTicks;
    if (s.terminator === 'opponentControl') turnoversTotal++;
  }
  /** the delivery's OUTCOME comes from its segment — carried out of the walk as a small table. */
  const segTerminator = segments.map((s) => s.terminator);
  const segTurnoverIndex = segments.map((s) => s.turnoverIndex);

  return {
    seed, simSeconds: m.simTime,
    totalTicks, deadBallTicks, segmentTicks, looseGapTicks, assignedTicksSum, spanOrderViolations,
    goalsFromScore, unattributedGoalSegments,
    segmentsByOrigin, segmentsByOriginAtRegainSpot, goals,
    turnoversTotal, ownThirdTurnovers, ownThirdTurnoversAtRegainSpot,
    turnovers, concededGoals, deliveries,
    suppressedPassCalls, deliveryTeamMismatch,
    windupShut: m.o1PassWindup !== true,
    segTerminator, segTurnoverIndex,
  };
}

/* ========================================================================== */
/* §10 ⭐⭐ THE ATTRIBUTION RULE — DV-C0's, INHERITED VERBATIM, and the LABEL    */
/* ========================================================================== */
/**
 * DV-C0's frozen rule: NEAREST-IN-WINDOW, GREEDY, ONE-TO-ONE. Per match, per window W: conceded
 * goals in chronological order; a goal conceded by T at t_g is attributed to the LATEST
 * not-yet-attributed turnover by T with loss stamp in [t_g − W, t_g] (ties → earliest index); if
 * none, UNATTRIBUTED. G-REPRO-DVC0 proves this implementation reproduces DV-C0's committed rows.
 *
 * ⭐⭐ THE LABEL ON TOP (M-DV2.1): a delivery is PUNISHED iff the possession chain it was struck
 * inside ENDED IN A LOSS **and** that loss carries an attributed conceded goal at the window.
 * The complement rows are LOST-BUT-UNPUNISHED and SURVIVED (chain ended in a dead ball, a goal
 * FOR, or full time) — the three classes are a PARTITION of every delivery.
 */
interface ZoneCount { deliveries: number; punished: number; lost: number; punishedCo: number; survived: number }
const emptyZones = (): Record<string, ZoneCount> => Object.fromEntries(
  THIRDS.map((t) => [t, { deliveries: 0, punished: 0, lost: 0, punishedCo: 0, survived: 0 }]),
);

interface MatchCells {
  seed: number;
  /** per window index → per aim zone counts */
  byWindow: Record<string, ZoneCount>[];
  /** per window index → per zone LOSS-side counts (the DV-C0 cut, for G-REPRO-DVC0) */
  lossByWindow: { n: number; k: number; co: number }[][];
  deliveriesTotal: number;
  deliveriesAssigned: number;
  deliveriesUnassigned: number;
  turnoversTotal: number;
  concededGoals: number;
  attributedGoals: number[];
  unattributedGoals: number[];
  doubleAttributed: number;
  /** per zone, per team, the delivery counts — the T2-T1 run-length moments' raw grain. */
  perTeamZone: { side: Side; zone: Third; deliveries: number; punished: number }[];
  outcomeTotals: Record<Outcome, number>;
  survivedBy: { deadBall: number; goal: number; matchEnd: number };
  ledStrikes: number;
  suppressedPassCalls: number;
  deliveryTeamMismatch: number;
  windupShut: boolean;
}

function attribute(row: WalkRow): MatchCells {
  const byWindow: Record<string, ZoneCount>[] = [];
  const lossByWindow: { n: number; k: number; co: number }[][] = [];
  const attributedGoals: number[] = [];
  const unattributedGoals: number[] = [];
  let doubleAttributed = 0;
  const goalsSorted = [...row.concededGoals].sort((a, b) => a.tSim - b.tSim);
  const outcomeTotals: Record<Outcome, number> = { punished: 0, lostUnpunished: 0, survived: 0 };
  const survivedBy = { deadBall: 0, goal: 0, matchEnd: 0 };
  const perTeamZoneMap = new Map<string, { side: Side; zone: Third; deliveries: number; punished: number }>();
  for (const s of [0, 1] as const) {
    for (const z of THIRDS) perTeamZoneMap.set(`${s}_${z}`, { side: s, zone: z, deliveries: 0, punished: 0 });
  }

  const primaryIdx = WINDOWS_S.indexOf(PRIMARY_WINDOW_S as (typeof WINDOWS_S)[number]);

  for (let wi = 0; wi < WINDOWS_S.length; wi++) {
    const W = WINDOWS_S[wi];
    const zones = emptyZones();
    const lossCells = THIRDS.map(() => ({ n: 0, k: 0, co: 0 }));
    for (const t of row.turnovers) lossCells[THIRDS.indexOf(t.third)].n++;
    const used = new Array<boolean>(row.turnovers.length).fill(false);
    const punishedTurnover = new Array<boolean>(row.turnovers.length).fill(false);
    let attributed = 0;
    for (const g of goalsSorted) {
      let best = -1;
      for (let i = 0; i < row.turnovers.length; i++) {
        const t = row.turnovers[i];
        if (t.loser !== g.conceding || used[i]) continue;
        if (t.tSim > g.tSim || t.tSim < g.tSim - W) continue;
        if (best === -1 || t.tSim > row.turnovers[best].tSim) best = i;
      }
      if (best >= 0) {
        if (used[best]) doubleAttributed++;
        used[best] = true;
        punishedTurnover[best] = true;
        lossCells[THIRDS.indexOf(row.turnovers[best].third)].k++;
        attributed++;
      }
    }
    /* the #218 CO-OCCURRENCE cross-cut: many-to-one, computed independently of `used`. */
    const coTurnover = row.turnovers.map((t) => goalsSorted.some(
      (g) => g.conceding === t.loser && g.tSim >= t.tSim && g.tSim <= t.tSim + W,
    ));
    row.turnovers.forEach((t, i) => { if (coTurnover[i]) lossCells[THIRDS.indexOf(t.third)].co++; });

    /* ⭐⭐ THE LABEL */
    for (const d of row.deliveries) {
      const z = zones[d.third];
      z.deliveries++;
      const term = d.segIndex < 0 ? null : row.segTerminator[d.segIndex];
      const ti = d.segIndex < 0 ? -1 : row.segTurnoverIndex[d.segIndex];
      if (term === 'opponentControl' && ti >= 0) {
        z.lost++;
        if (punishedTurnover[ti]) z.punished++;
        if (coTurnover[ti]) z.punishedCo++;
      } else {
        z.survived++;
      }
      if (wi === primaryIdx) {
        const key = `${d.side}_${d.third}`;
        const cell = perTeamZoneMap.get(key);
        if (cell !== undefined) {
          cell.deliveries++;
          if (term === 'opponentControl' && ti >= 0 && punishedTurnover[ti]) cell.punished++;
        }
        if (term === 'opponentControl' && ti >= 0) {
          if (punishedTurnover[ti]) outcomeTotals.punished++; else outcomeTotals.lostUnpunished++;
        } else {
          outcomeTotals.survived++;
          if (term === 'deadBall') survivedBy.deadBall++;
          else if (term === 'goal') survivedBy.goal++;
          else if (term === 'matchEnd') survivedBy.matchEnd++;
        }
      }
    }
    byWindow.push(zones);
    lossByWindow.push(lossCells);
    attributedGoals.push(attributed);
    unattributedGoals.push(goalsSorted.length - attributed);
  }

  return {
    seed: row.seed, byWindow, lossByWindow,
    deliveriesTotal: row.deliveries.length,
    deliveriesAssigned: row.deliveries.filter((d) => d.segIndex >= 0).length,
    deliveriesUnassigned: row.deliveries.filter((d) => d.segIndex < 0).length,
    turnoversTotal: row.turnovers.length,
    concededGoals: goalsSorted.length, attributedGoals, unattributedGoals, doubleAttributed,
    perTeamZone: [...perTeamZoneMap.values()],
    outcomeTotals, survivedBy,
    ledStrikes: row.deliveries.filter((d) => d.ledStrike).length,
    suppressedPassCalls: row.suppressedPassCalls,
    deliveryTeamMismatch: row.deliveryTeamMismatch,
    windupShut: row.windupShut,
  };
}

/* ========================================================================== */
/* §11 THE ESTIMATOR — cluster bootstrap by MATCH SEED (#20), the standing form */
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
const ciOf = (draws: number[]): [number, number] => {
  const s = [...draws].sort((a, b) => a - b);
  return [round(quantileSorted(s, 0.025), 5), round(quantileSorted(s, 0.975), 5)];
};

/* ========================================================================== */
/* §12 N DERIVATION (the frozen §NRULE — DV-C0's rule form, its numerator)     */
/* ========================================================================== */
const wall0 = Date.now();
const frozenNStar = (msPerMatch: number, msSource: string, eventsPerMatch: number, evSource: string) => {
  /** ⭐ THE ZERO-EVENT CLAUSE, frozen ex ante with the rest of the rule: if the smoke does not see
   *  the rarest-zone event at all, the PRECISION term is UNBOUNDED (it cannot be estimated from a
   *  zero count and this stage will not invent a floor for it), so the rule's other two terms —
   *  the wall budget and the seed-budget cap — bind. That is the min() doing exactly its job. */
  const nRaw = eventsPerMatch > 0 ? Math.ceil(TARGET_RAREST_ZONE_EVENTS / eventsPerMatch)
    : Number.POSITIVE_INFINITY;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / N_STEP) * N_STEP : Number.POSITIVE_INFINITY;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * ARMS_COUNT * XDET_FACTOR));
  const nStar = Math.min(nStepped, nWall, N_CAP);
  const binding = !Number.isFinite(nStepped)
    ? (nStar === nWall ? 'wall (precision term UNBOUNDED — the zero-event clause)'
      : 'seedBandCap (precision term UNBOUNDED — the zero-event clause)')
    : nStar === nStepped ? 'precision' : nStar === nWall ? 'wall' : 'seedBandCap';
  return {
    targetRarestZoneEvents: TARGET_RAREST_ZONE_EVENTS,
    rarestZoneEventsPerMatch: round(eventsPerMatch, 5), eventsSource: evSource,
    msPerMatch: round(msPerMatch, 3), msSource,
    nRaw: Number.isFinite(nRaw) ? nRaw : null,
    nStepped: Number.isFinite(nStepped) ? nStepped : null,
    precisionTermUnbounded: !Number.isFinite(nStepped),
    nStep: N_STEP, nWall, nCap: N_CAP,
    nStar: Number.isFinite(nStar) ? nStar : null,
    bindingTerm: binding,
    projectedWallHours: Number.isFinite(nStar)
      ? round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 4) : null,
    arithmetic: `N* = min( ceil(${TARGET_RAREST_ZONE_EVENTS} / rarestZoneEventsPerMatch) ↑${N_STEP}, `
      + `floor(${WALL_BUDGET_HOURS} h / (ms/match × ${ARMS_COUNT} arm × ${XDET_FACTOR} X-DET)), ${N_CAP} ) `
      + '— DV-C0 §NRULE\'s form, inherited, with THIS census\'s own numerator: the rarest-zone '
      + 'event is a PUNISHED DELIVERY in the RAREST of the three AIM zones at the PRIMARY window, '
      + 'i.e. the scarcest numerator the published table contains. Frozen in the stage doc §NRULE '
      + 'BEFORE the smoke ran.',
  };
};

interface NDeriv {
  mode: Mode;
  n: number;
  nStar: number | null;
  smokeArtifactSha256: string | null;
  envOverride: number | null;
  note?: string;
  arithmetic?: string;
  smokeArtifact?: string;
  targetRarestZoneEvents?: number;
  rarestZoneEventsPerMatch?: number;
  eventsSource?: string;
  msPerMatch?: number;
  msSource?: string;
  nRaw?: number | null;
  nStepped?: number | null;
  precisionTermUnbounded?: boolean;
  nStep?: number;
  nWall?: number;
  nCap?: number;
  bindingTerm?: string;
  projectedWallHours?: number | null;
}
const nDerivation: NDeriv = (() => {
  if (MODE === 'smoke') {
    return {
      mode: 'smoke' as const, n: Math.min(SMOKE_N, CAP), nStar: null as number | null,
      note: `SMOKE — N is FIXED by the stage doc at ${SMOKE_N} seeds `
        + `(${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}). It publishes exactly TWO sizing numbers `
        + '(ms/match, rarest-zone punished deliveries per match) and ADJUDICATES NOTHING.',
      smokeArtifactSha256: null as string | null,
      envOverride: N_ENV,
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
      mode?: string; sizing?: { msPerMatch?: number; rarestZoneEventsPerMatch?: number };
    };
    const v = smoke.sizing?.msPerMatch; const g = smoke.sizing?.rarestZoneEventsPerMatch;
    /** ⭐ g === 0 is ACCEPTED and routed through the ZERO-EVENT CLAUSE (a zero is a reading, not a
     *  missing artifact); only a missing/ill-typed field falls back to the prior. */
    if (smoke.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof g === 'number' && g >= 0) {
      msPerMatch = v; eventsPerMatch = g;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      evSource = 'the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N: exactly TWO numbers '
        + 'are read out of it, ms/match and the rarest AIM zone\'s PUNISHED deliveries per match at '
        + 'the primary window. No rate, CI, ordering or shape verdict is read from it anywhere.';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, eventsPerMatch, evSource);
  return {
    mode: 'full' as const, smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, envOverride: N_ENV, n: N_ENV ?? derived.nStar ?? 0,
  };
})();

if (MODE === 'full' && nDerivation.n <= 0) {
  console.error('DV-T2-C0 FATAL — full mode needs the committed SMOKE artifact (or DVT2C0_N, which '
    + `turns gCleanInvocation RED). Run the smoke first: DVT2C0_MODE=smoke … → ${SMOKE_PATH}`);
  process.exit(2);
}

/** ⭐ G-CLEAN-INVOCATION: any override is BY DEFINITION not the census — the run is routed onto
 *  the GUARD BLOCK, the gate goes RED and the process exits 1, so the census block stays VIRGIN. */
const CLEAN_INVOCATION = N_ENV === null && !IS_PREFLIGHT;
const RUN_BASE = MODE === 'smoke'
  ? (CLEAN_INVOCATION ? SMOKE_BASE : GUARD_BLOCK[0])
  : (CLEAN_INVOCATION ? CENSUS_BASE : GUARD_BLOCK[0]);
const RUN_N = Math.min(nDerivation.n, CAP);

/* ========================================================================== */
/* §13 STARTUP BANNER                                                          */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
banner('');
banner('=============================================================================');
banner(`DV-T2-C0 — THE PASS-LEVEL CENSUS (#255) · mode ${MODE} · N ${RUN_N} seeds × 1 arm`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
banner('world  ⭐ BARE PRODUCTION — new Match({seed, teamA, teamB}); no flag, no gene, no eye');
banner(`N rule ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
banner('FROZEN THIS RUN:');
banner(`  zones   AIM thirds in the PASSING team's frame, via the SHIPPED receptionZoneIndex `
  + `(boundary ±${round(THIRD_LOCAL_X, 4)} m = HALF_L/3)`);
banner(`  window  PRIMARY ${PRIMARY_WINDOW_S}s (DV-C0's own) · sensitivity ${WINDOWS_S.join('/')}s`);
banner('  label   PUNISHED = the delivery\'s chain ends in a LOSS and the deliverer concedes');
banner('          inside the window, by DV-C0\'s frozen nearest-in-window one-to-one attribution');
banner('  ⭐ #246 SHAPE PREDICATES: P(punished) own > middle > final, CI-resolved.');
banner('     An INVERSION is PUBLISHED and routed to the 街机偏离 test — never corrected away.');
banner('  ⭐ #247: this table is INSTRUMENT-side truth. It is wired into NO player.');
banner('=============================================================================');
banner('');

/* ========================================================================== */
/* §14 THE CORE (run TWICE for X-DET)                                          */
/* ========================================================================== */
const PROGRESS_EVERY_MS = 20_000;
let lastProgress = 0;
const progress = (tag: string, done: number, total: number): void => {
  const now = Date.now();
  if (now - lastProgress < PROGRESS_EVERY_MS && done !== total) return;
  lastProgress = now;
  const el = (now - wall0) / 1000;
  const rate = done === 0 ? 0 : el / done;
  process.stderr.write(`  [dvt2c0 ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(3)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

function aggregate(rows: WalkRow[]) {
  const cellsPerMatch = rows.map(attribute);
  const nClusters = rows.length;
  const boot = resampleMatrix(nClusters);
  const primaryIdx = WINDOWS_S.indexOf(PRIMARY_WINDOW_S as (typeof WINDOWS_S)[number]);

  const totalsFor = (wi: number, zone: Third | 'all') => {
    let deliveries = 0; let punished = 0; let lost = 0; let punishedCo = 0; let survived = 0;
    const keys: readonly Third[] = zone === 'all' ? THIRDS : [zone];
    for (const mc of cellsPerMatch) for (const z of keys) {
      const c = mc.byWindow[wi][z];
      deliveries += c.deliveries; punished += c.punished; lost += c.lost;
      punishedCo += c.punishedCo; survived += c.survived;
    }
    return { deliveries, punished, lost, punishedCo, survived };
  };
  /** ratio-of-sums bootstrap draws over the SAME shared resample matrix (paired by construction) */
  const drawsFor = (wi: number, zone: Third | 'all', numKey: 'punished', denKey: 'deliveries' | 'lost'): number[] => {
    const keys: readonly Third[] = zone === 'all' ? THIRDS : [zone];
    const num = cellsPerMatch.map((mc) => sum(keys.map((z) => mc.byWindow[wi][z][numKey])));
    const den = cellsPerMatch.map((mc) => sum(keys.map((z) => mc.byWindow[wi][z][denKey])));
    return boot.map((idx) => {
      let a = 0; let b = 0;
      for (const i of idx) { a += num[i]; b += den[i]; }
      return b === 0 ? Number.NaN : a / b;
    });
  };

  const zoneRow = (wi: number, zone: Third | 'all') => {
    const t = totalsFor(wi, zone);
    return {
      zone,
      deliveries: t.deliveries,
      lost: t.lost,
      survived: t.survived,
      punished: t.punished,
      lostUnpunished: t.lost - t.punished,
      /** ⭐⭐ THE PRIMARY QUANTITY — the account book's own convergence target (M-DV2.2): the
       *  running frequency of punishment over the team's OWN deliveries into z. */
      punishRate: shareOf(t.punished, t.deliveries),
      punishRateCi95: ciOf(drawsFor(wi, zone, 'punished', 'deliveries').filter(Number.isFinite)),
      /** the contract §3 wording's conditional — the declared cross-cut. */
      punishGivenLost: shareOf(t.punished, t.lost),
      punishGivenLostCi95: ciOf(drawsFor(wi, zone, 'punished', 'lost').filter(Number.isFinite)),
      lossRate: shareOf(t.lost, t.deliveries),
      survivalRate: shareOf(t.survived, t.deliveries),
      lostUnpunishedRate: shareOf(t.lost - t.punished, t.deliveries),
      /** the #218 many-to-one cross-cut, published beside every cell as DV-C0 publishes it. */
      punishRateCoOccurrence: shareOf(t.punishedCo, t.deliveries),
    };
  };

  const table = WINDOWS_S.map((W, wi) => {
    const byZone = THIRDS.map((z) => zoneRow(wi, z));
    const all = zoneRow(wi, 'all');
    /* ⭐ THE #246 SHAPE PREDICATES — paired differences on the SAME resampled clusters. */
    const diff = (a: Third, b: Third, den: 'deliveries' | 'lost') => {
      const da = drawsFor(wi, a, 'punished', den);
      const db = drawsFor(wi, b, 'punished', den);
      const d = da.map((x, i) => x - db[i]).filter((x) => Number.isFinite(x));
      const ci = ciOf(d);
      const ra = byZone[THIRDS.indexOf(a)];
      const rb = byZone[THIRDS.indexOf(b)];
      const point = round((den === 'deliveries' ? ra.punishRate : ra.punishGivenLost)
        - (den === 'deliveries' ? rb.punishRate : rb.punishGivenLost), 5);
      const verdict = ci[0] > 0 ? 'RESOLVED-CONFIRM' : ci[1] < 0 ? 'RESOLVED-INVERT' : 'UNRESOLVED';
      return { pair: `${a} − ${b}`, denominator: den, point, ci95: ci, verdict };
    };
    const gradientOf = (om: { verdict: string }, mf: { verdict: string }): string => (
      om.verdict === 'RESOLVED-CONFIRM' && mf.verdict === 'RESOLVED-CONFIRM' ? 'RESOLVED-CONFIRM'
        : (om.verdict === 'RESOLVED-INVERT' || mf.verdict === 'RESOLVED-INVERT') ? 'RESOLVED-INVERT'
          : 'UNRESOLVED');
    const ownVsMiddle = diff('own', 'middle', 'deliveries');
    const middleVsFinal = diff('middle', 'final', 'deliveries');
    const ownVsMiddleGivenLost = diff('own', 'middle', 'lost');
    const middleVsFinalGivenLost = diff('middle', 'final', 'lost');
    const gradient = gradientOf(ownVsMiddle, middleVsFinal);
    return {
      windowS: W,
      isPrimary: W === PRIMARY_WINDOW_S,
      all,
      byZone,
      realityShape: {
        predicateSource: '⭐ #246, PRE-REGISTERED: real football\'s structure — a ball played into '
          + 'one\'s OWN third is the most punished, and the punishment falls as the delivery aims '
          + 'further up the pitch. SHAPES ONLY; no real-football NUMBER is imported (VISION §3). '
          + 'THE PRIMARY PREDICATE IS ON THE MARGINAL RATE P(punished | delivery into z) — the '
          + 'account book\'s own quantity (M-DV2.2); the conditional-on-lost form is published '
          + 'beside it as the contract §3 wording\'s cross-cut and gates nothing extra.',
        ownVsMiddle, middleVsFinal,
        gradientTowardOwnGoal: gradient,
        conditionalOnLost: {
          ownVsMiddle: ownVsMiddleGivenLost, middleVsFinal: middleVsFinalGivenLost,
          gradientTowardOwnGoal: gradientOf(ownVsMiddleGivenLost, middleVsFinalGivenLost),
        },
        routing: gradient === 'RESOLVED-INVERT'
          ? '⚠ AN INVERSION IS PUBLISHED HERE AND ROUTED TO THE 街机偏离 TEST (deliberate arcade '
            + 'trade-off vs defect) — it is NOT corrected into the table (#246).'
          : 'no inversion at this window; the routing clause is dormant.',
      },
    };
  });

  const primary = table[primaryIdx];

  /* --- ⭐ THE EVENT-RATE MOMENTS: deliveries per zone PER TEAM PER MATCH ------ */
  const perTeamMatch = THIRDS.map((z) => {
    const counts: number[] = [];
    const punishedCounts: number[] = [];
    for (const mc of cellsPerMatch) {
      for (const c of mc.perTeamZone) {
        if (c.zone !== z) continue;
        counts.push(c.deliveries);
        punishedCounts.push(c.punished);
      }
    }
    const sorted = [...counts].sort((a, b) => a - b);
    const m = mean(counts);
    const s = sd(counts);
    return {
      zone: z,
      observations: counts.length,
      deliveriesPerTeamPerMatch: round(m, 4),
      sd: round(s, 4),
      cv: round(Number.isFinite(m) && m > 0 ? s / m : Number.NaN, 4),
      min: sorted.length === 0 ? Number.NaN : sorted[0],
      p10: quantileSorted(sorted, 0.10),
      median: quantileSorted(sorted, 0.50),
      p90: quantileSorted(sorted, 0.90),
      max: sorted.length === 0 ? Number.NaN : sorted[sorted.length - 1],
      zeroShare: shareOf(counts.filter((c) => c === 0).length, counts.length),
      punishedPerTeamPerMatch: round(mean(punishedCounts), 4),
      punishedSd: round(sd(punishedCounts), 4),
    };
  });
  const teamMatchTotals = (() => {
    const totals: number[] = [];
    for (const mc of cellsPerMatch) {
      for (const s of [0, 1] as const) {
        totals.push(sum(mc.perTeamZone.filter((c) => c.side === s).map((c) => c.deliveries)));
      }
    }
    const sorted = [...totals].sort((a, b) => a - b);
    return {
      observations: totals.length,
      deliveriesPerTeamPerMatch: round(mean(totals), 4),
      sd: round(sd(totals), 4),
      min: sorted.length === 0 ? Number.NaN : sorted[0],
      median: quantileSorted(sorted, 0.50),
      max: sorted.length === 0 ? Number.NaN : sorted[sorted.length - 1],
    };
  })();
  /** ⭐ THE RUN-LENGTH ARITHMETIC T2-T1 NEEDS, printed as a table rather than left to be redone:
   *  matches a team must play for its book to hold K deliveries in the RAREST zone, at the
   *  measured mean rate. K is a REPORTING GRID (no level is frozen here — T2-T1 freezes its own). */
  const RUN_LENGTH_K = [10, 20, 30, 50, 100] as const;
  const runLength = THIRDS.map((z) => {
    const row = perTeamMatch[THIRDS.indexOf(z)];
    const rate = row.deliveriesPerTeamPerMatch;
    return {
      zone: z,
      deliveriesPerTeamPerMatch: rate,
      matchesForK: Object.fromEntries(RUN_LENGTH_K.map((k) => [
        `k${k}`, rate > 0 ? Math.ceil(k / rate) : null,
      ])),
    };
  });

  /* --- ⭐ THE CONVERGENCE YARDSTICK: what T2-T1 scores the books against ------ */
  const meanRate = mean(primary.byZone.map((r) => r.punishRate).filter(Number.isFinite));
  const yardstick = {
    schema: 'dv-t2c0.pass-truth-table.v1',
    frozenBy: 'DV-T2-C0, before any account book exists (#247). T2-T1 compares a learned belief '
      + 'vector to `zones` (absolute punish rates), to `relative` (scale-free — the shape only) '
      + 'and to `ordering` (the rank vector), and to nothing else. The AIM index makes this table '
      + 'COMMENSURABLE with the belief the seam reads (the DV-T0 §HONESTY 8 mismatch, fixed at '
      + 'the source), which DV-C0\'s loss-indexed table is not.',
    frame: 'the PASSING team\'s own attacking frame — "where was this ball aimed".',
    index: 'AIM zone via the shipped `receptionZoneIndex` — the pricer\'s own read (M-DV2.1).',
    windowS: PRIMARY_WINDOW_S,
    zoning: { thirds: THIRDS, thirdBoundaryLocalX: round(THIRD_LOCAL_X, 6) },
    zones: Object.fromEntries(primary.byZone.map((r) => [r.zone, {
      punishRate: r.punishRate, ci95: r.punishRateCi95,
      deliveries: r.deliveries, punished: r.punished, lost: r.lost,
      punishGivenLost: r.punishGivenLost, punishGivenLostCi95: r.punishGivenLostCi95,
    }])),
    relative: Object.fromEntries(primary.byZone.map((r) => [r.zone,
      round(Number.isFinite(meanRate) && meanRate > 0 ? r.punishRate / meanRate : Number.NaN, 5)])),
    ordering: [...primary.byZone].sort((a, b) => b.punishRate - a.punishRate).map((r) => r.zone),
    baselinePunishRateAllZones: primary.all.punishRate,
    eventRateMoments: perTeamMatch,
    runLengthArithmetic: runLength,
  };

  /* --- the accounting identities (gate input) ------------------------------ */
  const accounting = {
    totalTicks: sum(rows.map((r) => r.totalTicks)),
    deadBallTicks: sum(rows.map((r) => r.deadBallTicks)),
    segmentTicks: sum(rows.map((r) => r.segmentTicks)),
    looseGapTicks: sum(rows.map((r) => r.looseGapTicks)),
    assignedTicksSum: sum(rows.map((r) => r.assignedTicksSum)),
    spanOrderViolations: sum(rows.map((r) => r.spanOrderViolations)),
    goalsFromScore: sum(rows.map((r) => r.goalsFromScore)),
    concededGoals: sum(cellsPerMatch.map((c) => c.concededGoals)),
    turnoversTotal: sum(rows.map((r) => r.turnoversTotal)),
    turnoversLedgered: sum(cellsPerMatch.map((c) => c.turnoversTotal)),
    doubleAttributed: sum(cellsPerMatch.map((c) => c.doubleAttributed)),
    perWindow: WINDOWS_S.map((W, wi) => ({
      windowS: W,
      attributed: sum(cellsPerMatch.map((c) => c.attributedGoals[wi])),
      unattributed: sum(cellsPerMatch.map((c) => c.unattributedGoals[wi])),
      attributedInLossCells: sum(cellsPerMatch.map((c) => sum(c.lossByWindow[wi].map((x) => x.k)))),
      turnoversInLossCells: sum(cellsPerMatch.map((c) => sum(c.lossByWindow[wi].map((x) => x.n)))),
    })),
    /* --- ⭐⭐ THE DELIVERY IDENTITIES --- */
    deliveriesWalked: sum(rows.map((r) => r.deliveries.length)),
    deliveriesAssigned: sum(cellsPerMatch.map((c) => c.deliveriesAssigned)),
    deliveriesUnassigned: sum(cellsPerMatch.map((c) => c.deliveriesUnassigned)),
    deliveriesInZonesPrimary: sum(cellsPerMatch.map(
      (c) => sum(THIRDS.map((z) => c.byWindow[primaryIdx][z].deliveries)),
    )),
    outcomeTotals: {
      punished: sum(cellsPerMatch.map((c) => c.outcomeTotals.punished)),
      lostUnpunished: sum(cellsPerMatch.map((c) => c.outcomeTotals.lostUnpunished)),
      survived: sum(cellsPerMatch.map((c) => c.outcomeTotals.survived)),
    },
    survivedBy: {
      deadBall: sum(cellsPerMatch.map((c) => c.survivedBy.deadBall)),
      goal: sum(cellsPerMatch.map((c) => c.survivedBy.goal)),
      matchEnd: sum(cellsPerMatch.map((c) => c.survivedBy.matchEnd)),
    },
    punishedPrimary: sum(cellsPerMatch.map(
      (c) => sum(THIRDS.map((z) => c.byWindow[primaryIdx][z].punished)),
    )),
    lostPrimary: sum(cellsPerMatch.map(
      (c) => sum(THIRDS.map((z) => c.byWindow[primaryIdx][z].lost)),
    )),
    punishedByWindow: WINDOWS_S.map((W, wi) => ({
      windowS: W,
      punished: sum(cellsPerMatch.map((c) => sum(THIRDS.map((z) => c.byWindow[wi][z].punished)))),
      lost: sum(cellsPerMatch.map((c) => sum(THIRDS.map((z) => c.byWindow[wi][z].lost)))),
    })),
    ledStrikes: sum(cellsPerMatch.map((c) => c.ledStrikes)),
    suppressedPassCalls: sum(cellsPerMatch.map((c) => c.suppressedPassCalls)),
    deliveryTeamMismatch: sum(cellsPerMatch.map((c) => c.deliveryTeamMismatch)),
    matchesWithWindupOpen: cellsPerMatch.filter((c) => !c.windupShut).length,
  };

  /* --- the inherited census columns (G-REPRO-GGC compares these) ------------ */
  const allGoals = rows.flatMap((r) => r.goals);
  const nGoals = allGoals.length;
  const byOrigin = Object.fromEntries(ORIGIN_CLASSES.map((o) => [o, allGoals.filter((g) => g.origin === o).length]));
  const byOriginAtRegainSpot = Object.fromEntries(
    ORIGIN_CLASSES.map((o) => [o, allGoals.filter((g) => g.originAtRegainSpot === o).length]),
  );
  const byFamily = {
    setPiece: allGoals.filter((g) => g.family === 'setPiece').length,
    restart: allGoals.filter((g) => g.family === 'restart').length,
    openPlay: allGoals.filter((g) => g.family === 'openPlay').length,
  };
  const byLossThird: Record<string, number> = { own: 0, middle: 0, final: 0, notARegain: 0 };
  for (const g of allGoals) {
    if (g.lossThird === null) byLossThird.notARegain++; else byLossThird[g.lossThird]++;
  }
  const ladderOn = (pool: readonly GoalRec[]) => ({
    pool: pool.length,
    ladder: Object.fromEntries(CONSTRUCTED_LADDER.map((n) => {
      const constructed = pool.filter((g) => g.completedPasses >= n).length;
      return [`ge${n}`, { threshold: n, constructed, transition: pool.length - constructed }];
    })),
  });
  const inherited = {
    goals: nGoals,
    byOrigin, byOriginAtRegainSpot, byFamily, byLossThird,
    constructedLadder: {
      nonSetPiece: ladderOn(allGoals.filter((g) => g.family !== 'setPiece')),
      openPlayOriginOnly: ladderOn(allGoals.filter((g) => g.family === 'openPlay')),
    },
    segmentsByOrigin: Object.fromEntries(
      ORIGIN_CLASSES.map((o) => [o, sum(rows.map((r) => r.segmentsByOrigin[o]))]),
    ),
    segmentsByOriginAtRegainSpot: Object.fromEntries(
      ORIGIN_CLASSES.map((o) => [o, sum(rows.map((r) => r.segmentsByOriginAtRegainSpot[o]))]),
    ),
    ownThirdTurnovers: sum(rows.map((r) => r.ownThirdTurnovers)),
    ownThirdTurnoversAtRegainSpot: sum(rows.map((r) => r.ownThirdTurnoversAtRegainSpot)),
    turnoversTotal: sum(rows.map((r) => r.turnoversTotal)),
    accountingTicks: {
      totalTicks: accounting.totalTicks, deadBallTicks: accounting.deadBallTicks,
      segmentTicks: accounting.segmentTicks, looseGapTicks: accounting.looseGapTicks,
      assignedTicksSum: accounting.assignedTicksSum, goalsFromScore: accounting.goalsFromScore,
      goalsMappedToSegments: nGoals,
      unattributedGoalSegments: sum(rows.map((r) => r.unattributedGoalSegments)),
    },
  };

  /** ⭐ THE DV-C0 LOSS CUT, recomputed here so G-REPRO-DVC0 can compare it to DV-C0's committed
   *  rows field for field: per window, per LOSS third, {turnovers, attributed, co-occurrence}. */
  const dvc0LossTable = WINDOWS_S.map((W, wi) => ({
    windowS: W,
    byThird: THIRDS.map((z, zi) => {
      const n = sum(cellsPerMatch.map((c) => c.lossByWindow[wi][zi].n));
      const k = sum(cellsPerMatch.map((c) => c.lossByWindow[wi][zi].k));
      const co = sum(cellsPerMatch.map((c) => c.lossByWindow[wi][zi].co));
      return { zone: z, turnovers: n, goalsAgainstAttributed: k, turnoversFollowedByGoalCoOccurrence: co };
    }),
  }));

  return {
    matches: rows.length,
    simSecondsPerMatch: round(mean(rows.map((r) => r.simSeconds)), 4),
    deliveriesPerMatch: round(mean(rows.map((r) => r.deliveries.length)), 4),
    turnoversPerMatch: round(mean(rows.map((r) => r.turnoversTotal)), 4),
    concededGoalsPerMatch: round(mean(cellsPerMatch.map((c) => c.concededGoals)), 4),
    table, yardstick, accounting, inherited, dvc0LossTable,
    eventRateMoments: { byZone: perTeamMatch, allZonesPerTeamPerMatch: teamMatchTotals, runLength },
    rarestZoneEventsPerMatch: round(
      Math.min(...primary.byZone.map((r) => r.punished)) / Math.max(1, rows.length), 5,
    ),
  };
}
type Agg = ReturnType<typeof aggregate>;

interface Core { seeds: { base: number; n: number; first: number; last: number }; census: Agg }
function runCore(tag: string): Core {
  const seeds = Array.from({ length: RUN_N }, (_, k) => RUN_BASE + k);
  const rows: WalkRow[] = [];
  let done = 0;
  for (const seed of seeds) { rows.push(walkOne(seed) as WalkRow); done++; progress(tag, done, RUN_N); }
  return {
    seeds: { base: RUN_BASE, n: RUN_N, first: seeds[0], last: seeds[seeds.length - 1] },
    census: aggregate(rows),
  };
}

const passStart = Date.now();
const coreA = runCore('pass1');
const passMs = Date.now() - passStart;
const coreB = runCore('pass2');
const digestA = createHash('sha256').update(canonical(coreA)).digest('hex');
const digestB = createHash('sha256').update(canonical(coreB)).digest('hex');
const xDet = digestA === digestB;

/* ========================================================================== */
/* §15 THE TWO RE-WALK RECEIPTS (G-REPRO-GGC · G-REPRO-DVC0)                   */
/* ========================================================================== */
const readJson = (p: string): { bytes: Buffer; j: Record<string, unknown> } | null => {
  if (!existsSync(p)) return null;
  const bytes = readFileSync(p);
  try { return { bytes, j: JSON.parse(bytes.toString('utf8')) as Record<string, unknown> }; }
  catch { return null; }
};
const GGC_SMOKE = readJson(GGC_SMOKE_PATH);
const GGC_FULL = readJson(GGC_FULL_PATH);
const DVC0_SMOKE = readJson(DVC0_SMOKE_PATH);
const DVC0_FULL = readJson(DVC0_FULL_PATH);

banner(`  [dvt2c0] G-REPRO-GGC: re-walking the GGC census's OWN smoke block ${REPRO_GGC_BASE}...`);
const reproGgcRows: WalkRow[] = [];
for (let i = 0; i < REPRO_GGC_N; i++) reproGgcRows.push(walkOne(REPRO_GGC_BASE + i) as WalkRow);
const reproGgcAgg = aggregate(reproGgcRows);

banner(`  [dvt2c0] G-REPRO-DVC0: re-walking DV-C0's OWN smoke block ${REPRO_DVC0_BASE}...`);
const reproDvc0Rows: WalkRow[] = [];
for (let i = 0; i < REPRO_DVC0_N; i++) reproDvc0Rows.push(walkOne(REPRO_DVC0_BASE + i) as WalkRow);
const reproDvc0Agg = aggregate(reproDvc0Rows);

interface FieldCheck { field: string; family: string; want: number; got: number }
const mismatchesOf = (checks: FieldCheck[]): FieldCheck[] => checks.filter((c) => c.want !== c.got);

/* eslint-disable @typescript-eslint/no-explicit-any */
const ggcChecks: FieldCheck[] = (() => {
  const want = GGC_SMOKE === null ? null : (GGC_SMOKE.j as any).result?.perArm?.PROD;
  const got = reproGgcAgg.inherited;
  if (want === null || want === undefined) return [];
  return [
    { family: 'goals', field: 'goalGenealogy.goals', want: want.goalGenealogy.goals, got: got.goals },
    ...ORIGIN_CLASSES.map((o) => ({
      family: 'byOrigin', field: `goalGenealogy.byOrigin.${o}`,
      want: want.goalGenealogy.byOrigin[o], got: got.byOrigin[o],
    })),
    ...ORIGIN_CLASSES.map((o) => ({
      family: 'byOriginAtRegainSpot', field: `goalGenealogy.byOriginAtRegainSpot.${o}`,
      want: want.goalGenealogy.byOriginAtRegainSpot[o], got: got.byOriginAtRegainSpot[o],
    })),
    ...(['setPiece', 'restart', 'openPlay'] as const).map((f) => ({
      family: 'byFamily', field: `goalGenealogy.byFamily.${f}`,
      want: want.goalGenealogy.byFamily[f], got: (got.byFamily as any)[f],
    })),
    ...(['own', 'middle', 'final', 'notARegain'] as const).map((t) => ({
      family: 'byLossThird', field: `goalGenealogy.byLossThird.${t}`,
      want: want.goalGenealogy.byLossThird[t], got: got.byLossThird[t],
    })),
    ...(['nonSetPiece', 'openPlayOriginOnly'] as const).flatMap((pool) => [
      {
        family: 'constructedLadder', field: `goalGenealogy.constructedLadder.${pool}.pool`,
        want: want.goalGenealogy.constructedLadder[pool].pool,
        got: (got.constructedLadder as any)[pool].pool as number,
      },
      ...CONSTRUCTED_LADDER.map((k) => ({
        family: 'constructedLadder',
        field: `goalGenealogy.constructedLadder.${pool}.ge${k}.constructed`,
        want: want.goalGenealogy.constructedLadder[pool].ladder[`ge${k}`].constructed,
        got: (got.constructedLadder as any)[pool].ladder[`ge${k}`].constructed as number,
      })),
    ]),
    ...ORIGIN_CLASSES.map((o) => ({
      family: 'segmentPopulation', field: `segmentPopulation.byOrigin.${o}`,
      want: want.segmentPopulation.byOrigin[o], got: got.segmentsByOrigin[o],
    })),
    {
      family: 'backThirdErrors', field: 'backThirdErrors.ownThirdTurnovers',
      want: want.backThirdErrors.ownThirdTurnovers, got: got.ownThirdTurnovers,
    },
    {
      family: 'backThirdErrors', field: 'backThirdErrors.atRegainSpot.ownThirdTurnovers',
      want: want.backThirdErrors.atRegainSpot.ownThirdTurnovers, got: got.ownThirdTurnoversAtRegainSpot,
    },
    {
      family: 'backThirdErrors', field: 'backThirdErrors.turnoversTotal (per-match × matches)',
      want: Math.round((want.backThirdErrors.turnoversPerMatch as number) * (want.matches as number)),
      got: got.turnoversTotal,
    },
    ...(['totalTicks', 'deadBallTicks', 'segmentTicks', 'looseGapTicks', 'assignedTicksSum',
      'goalsFromScore', 'goalsMappedToSegments'] as const).map((k) => ({
      family: 'accounting', field: `accounting.${k}`,
      want: want.accounting[k], got: (got.accountingTicks as any)[k] as number,
    })),
  ];
})();

const dvc0Checks: FieldCheck[] = (() => {
  const want = DVC0_SMOKE === null ? null : (DVC0_SMOKE.j as any).result?.census;
  if (want === null || want === undefined) return [];
  const got = reproDvc0Agg;
  const out: FieldCheck[] = [];
  WINDOWS_S.forEach((W, wi) => {
    const wantW = (want.table as any[]).find((t) => t.windowS === W);
    const gotW = got.dvc0LossTable[wi];
    for (const z of THIRDS) {
      const wr = (wantW.byThird as any[]).find((r) => r.zone === z);
      const gr = gotW.byThird.find((r) => r.zone === z)!;
      out.push({ family: 'lossTurnovers', field: `w${W}.${z}.turnovers`, want: wr.turnovers, got: gr.turnovers });
      out.push({
        family: 'lossAttributed', field: `w${W}.${z}.goalsAgainstAttributed`,
        want: wr.goalsAgainstAttributed, got: gr.goalsAgainstAttributed,
      });
      out.push({
        family: 'lossCoOccurrence', field: `w${W}.${z}.coOccurrence`,
        want: wr.turnoversFollowedByGoalCoOccurrence, got: gr.turnoversFollowedByGoalCoOccurrence,
      });
    }
  });
  const wa = want.accounting;
  const ga = got.accounting;
  for (const k of ['totalTicks', 'deadBallTicks', 'segmentTicks', 'looseGapTicks', 'assignedTicksSum',
    'spanOrderViolations', 'goalsFromScore', 'concededGoals', 'turnoversTotal', 'turnoversLedgered',
    'doubleAttributed'] as const) {
    out.push({ family: 'accounting', field: `accounting.${k}`, want: wa[k], got: (ga as any)[k] as number });
  }
  (wa.perWindow as any[]).forEach((w, wi) => {
    out.push({
      family: 'perWindow', field: `perWindow.${w.windowS}.attributed`,
      want: w.attributed, got: ga.perWindow[wi].attributed,
    });
    out.push({
      family: 'perWindow', field: `perWindow.${w.windowS}.unattributed`,
      want: w.unattributed, got: ga.perWindow[wi].unattributed,
    });
  });
  return out;
})();

const gReproGgc = {
  pass: ggcChecks.length > 0 && mismatchesOf(ggcChecks).length === 0,
  block: `${REPRO_GGC_BASE}..${REPRO_GGC_BASE + REPRO_GGC_N - 1}`,
  source: GGC_SMOKE_PATH,
  sourceArm: 'PROD',
  sourceSha256: GGC_SMOKE === null ? null : createHash('sha256').update(GGC_SMOKE.bytes).digest('hex'),
  fieldsChecked: ggcChecks.length,
  mismatches: mismatchesOf(ggcChecks).length,
  mismatchRows: mismatchesOf(ggcChecks),
  families: [...new Set(ggcChecks.map((c) => c.family))],
  note: '⭐ THE WALKER IS THE GOAL-GENEALOGY CENSUS\'S, with its LOSS-TICK semantics (#215.3-H1/M2) '
    + 'verbatim: it re-walks the census\'s OWN committed SMOKE block in the census\'s OWN PROD world '
    + 'and must reproduce its published INTEGER rows exactly.',
};

const gReproDvc0 = {
  pass: dvc0Checks.length > 0 && mismatchesOf(dvc0Checks).length === 0,
  block: `${REPRO_DVC0_BASE}..${REPRO_DVC0_BASE + REPRO_DVC0_N - 1}`,
  source: DVC0_SMOKE_PATH,
  sourceSha256: DVC0_SMOKE === null ? null : createHash('sha256').update(DVC0_SMOKE.bytes).digest('hex'),
  fieldsChecked: dvc0Checks.length,
  mismatches: mismatchesOf(dvc0Checks).length,
  mismatchRows: mismatchesOf(dvc0Checks),
  families: [...new Set(dvc0Checks.map((c) => c.family))],
  note: '⭐⭐ THE LOSS AND CONCESSION SEMANTICS ARE DV-C0\'S, PROVED RATHER THAN ASSERTED: this '
    + 'probe re-walks DV-C0\'s OWN committed smoke block and reproduces its published per-third '
    + 'TURNOVER counts, its ATTRIBUTED goals-against and its CO-OCCURRENCE counts AT EVERY WINDOW, '
    + 'plus its accounting totals and its per-window attributed/unattributed split. The label\'s '
    + '"LOSS" and "concession inside the window" are therefore the census\'s, not a re-typing.',
};

/** gWindowTrace: the window is READ off DV-C0's artifact and checked against the #218 family. */
const gWindowTrace = (() => {
  const fam = GGC_FULL === null ? null
    : ((GGC_FULL.j as any).frozenDesign?.definitions?.dangerWindowsS as number[] | undefined) ?? null;
  const famMin = fam === null || fam.length === 0 ? null : Math.min(...fam);
  const dvc0Primary = DVC0_FULL === null ? null
    : ((DVC0_FULL.j as any).frozenDesign?.windows?.primaryWindowS as number | undefined) ?? null;
  const dvc0Ladder = DVC0_FULL === null ? null
    : ((DVC0_FULL.j as any).frozenDesign?.windows?.windowsS as number[] | undefined) ?? null;
  const primaryIsCensusOwn = dvc0Primary === PRIMARY_WINDOW_S;
  const primaryInFamily = fam !== null && fam.includes(PRIMARY_WINDOW_S);
  const ladderIsCensusOwn = dvc0Ladder !== null
    && dvc0Ladder.length === WINDOWS_S.length
    && dvc0Ladder.every((w, i) => w === WINDOWS_S[i]);
  const allMultiples = famMin === null ? false : WINDOWS_S.every((w) => w % famMin === 0 && w >= famMin);
  return {
    pass: primaryIsCensusOwn && primaryInFamily && ladderIsCensusOwn && allMultiples,
    primaryIsCensusOwn, primaryInFamily, ladderIsCensusOwn, allIntegerMultiplesOfFamilyMin: allMultiples,
    dvc0Source: DVC0_FULL_PATH, dvc0PrimaryWindowS: dvc0Primary, dvc0WindowsS: dvc0Ladder,
    ggcSource: GGC_FULL_PATH, family: fam, familyMin: famMin,
    primaryWindowS: PRIMARY_WINDOW_S, windowsS: WINDOWS_S,
    note: '⭐ "THE CENSUS\'S OWN 10 s WINDOW" (M-DV2.1) IS NOT TYPED AS A LEVEL: the primary window '
      + 'must EQUAL DV-C0\'s committed primary, must be a MEMBER of the #218 goal-genealogy family, '
      + 'and the sensitivity ladder must be DV-C0\'s own ladder and integer multiples of that '
      + 'family\'s smallest member. All four are read off committed artifacts at run time.',
  };
})();

/** gZoneTrace: the AIM index is the SHIPPED pricer's classifier, swept, not re-implemented. */
const ZONE_SWEEP_STEPS = 2001;
const gZoneTrace = (() => {
  const thirdOk = THIRD_LOCAL_X === HALF_L / 3;
  const seatBoundaryOk = DV_THIRD_BOUNDARY_LOCAL_X === THIRD_LOCAL_X;
  const dvc0Boundary = DVC0_FULL === null ? null
    : ((DVC0_FULL.j as any).frozenDesign?.zoning?.thirdBoundaryLocalX as number | undefined) ?? null;
  const censusBoundaryOk = dvc0Boundary !== null && Math.abs(dvc0Boundary - round(THIRD_LOCAL_X, 6)) < 1e-9;
  /** the SWEEP: over the pitch's whole length the shipped classifier and the census's own
   *  boundary rule must agree on EVERY sample — the AIM index IS the loss index's zoning. */
  let sweepDisagreements = 0;
  for (let i = 0; i < ZONE_SWEEP_STEPS; i++) {
    const x = -HALF_L + (2 * HALF_L * i) / (ZONE_SWEEP_STEPS - 1);
    if (aimThirdOf(x) !== lossThirdOf(x)) sweepDisagreements++;
  }
  const orderOk = THIRDS.length === 3 && THIRDS[0] === 'own' && THIRDS[1] === 'middle' && THIRDS[2] === 'final';
  return {
    pass: thirdOk && seatBoundaryOk && censusBoundaryOk && sweepDisagreements === 0 && orderOk,
    thirdOk, seatBoundaryOk, censusBoundaryOk, sweepDisagreements, orderOk,
    sweepSamples: ZONE_SWEEP_STEPS,
    thirdLocalX: round(THIRD_LOCAL_X, 6), thirdFormula: 'HALF_L / 3',
    seatBoundary: round(DV_THIRD_BOUNDARY_LOCAL_X, 6), dvc0Boundary,
    zoneOrder: THIRDS,
    note: '⭐⭐ THE AIM INDEX IS THE PRICING\'S OWN READ: the census classifies deliveries through '
      + 'the SHIPPED `receptionZoneIndex`, whose boundary is the seat module\'s exported '
      + '`DV_THIRD_BOUNDARY_LOCAL_X`; that constant is re-derived here from `HALF_L`, checked '
      + 'against DV-C0\'s committed boundary, and swept against the census\'s own classifier at '
      + `${ZONE_SWEEP_STEPS} samples across the pitch. Nothing is re-typed and nothing is assumed.`,
  };
})();

/* ========================================================================== */
/* §16 THE REST OF THE GATES                                                   */
/* ========================================================================== */
let fpObserved = 'skipped';
let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fpObserved = 'skipped (preflight)'; } else {
  process.stderr.write('  [dvt2c0] X-FP-PROD: re-deriving the production fingerprint...\n');
  const league = new League({ seed: FINGERPRINT_SEED });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
  xFpProd = fpObserved === FINGERPRINT_BASELINE;
  process.stderr.write(`  [dvt2c0] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);
}

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

/** ⭐ G-WRAPPER-INERT: the delivery capture is an instance wrapper, so the claim "it perturbs
 *  nothing" is PROVED on a twin walk of one declared seed — the same match walked with and
 *  without the wrapper must agree on every inherited column. */
const gWrapperInert = (() => {
  const withWrap = walkOne(INERT_TWIN_SEED, true) as WalkRow;
  const without = walkOne(INERT_TWIN_SEED, false) as WalkRow;
  const sig = (r: WalkRow) => canonical({
    simSeconds: r.simSeconds, totalTicks: r.totalTicks, deadBallTicks: r.deadBallTicks,
    segmentTicks: r.segmentTicks, looseGapTicks: r.looseGapTicks,
    assignedTicksSum: r.assignedTicksSum, spanOrderViolations: r.spanOrderViolations,
    goalsFromScore: r.goalsFromScore, unattributedGoalSegments: r.unattributedGoalSegments,
    segmentsByOrigin: r.segmentsByOrigin, segmentsByOriginAtRegainSpot: r.segmentsByOriginAtRegainSpot,
    turnoversTotal: r.turnoversTotal, ownThirdTurnovers: r.ownThirdTurnovers,
    ownThirdTurnoversAtRegainSpot: r.ownThirdTurnoversAtRegainSpot,
    turnovers: r.turnovers, concededGoals: r.concededGoals, goals: r.goals,
  });
  const a = sig(withWrap); const b = sig(without);
  return {
    pass: a === b && withWrap.deliveries.length > 0 && without.deliveries.length === 0,
    seed: INERT_TWIN_SEED,
    digestWrapped: createHash('sha256').update(a).digest('hex'),
    digestBare: createHash('sha256').update(b).digest('hex'),
    identical: a === b,
    deliveriesWrapped: withWrap.deliveries.length,
    deliveriesBare: without.deliveries.length,
    note: '⭐ THE CAPTURE IS INERT AND THE CHECK IS NON-VACUOUS: the wrapped walk must reproduce '
      + 'the bare walk on every inherited column (identical digests) AND must actually have '
      + 'captured deliveries, while the bare walk captures none.',
  };
})();

const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + RUN_N - 1;
const gSeedDisjoint = (() => {
  const collide = (a: number, b: number): string[] => CONSUMED
    .filter((c) => !(b < c.range[0] || a > c.range[1])).map((c) => c.name);
  const walked = [
    { name: 'census walk (fresh)', first: firstSeed, last: lastSeed, kind: 'fresh' as const },
    { name: 'smoke block (reserved)', first: SMOKE_BASE, last: SMOKE_BASE + SMOKE_N - 1, kind: 'reserved' as const },
    { name: 'wrapper-inertness twin read (declared)', first: INERT_TWIN_SEED, last: INERT_TWIN_SEED, kind: 'fresh' as const },
    { name: 'exit-semantics guard block (reserved)', first: GUARD_BLOCK[0], last: GUARD_BLOCK[1], kind: 'reserved' as const },
    { name: 'census block + reserve (reserved)', first: CENSUS_BASE, last: CENSUS_BASE + N_CAP - 1, kind: 'reserved' as const },
    { name: 'gWorld construction seed (never stepped)', first: RESERVED_BAND[1], last: RESERVED_BAND[1], kind: 'reserved' as const },
    { name: 'reproGgc (re-walk RECEIPT)', first: REPRO_GGC_BASE, last: REPRO_GGC_BASE + REPRO_GGC_N - 1, kind: 're-walk' as const },
    { name: 'reproDvc0 (re-walk RECEIPT)', first: REPRO_DVC0_BASE, last: REPRO_DVC0_BASE + REPRO_DVC0_N - 1, kind: 're-walk' as const },
  ].map((b) => {
    const ledgerCollisions = collide(b.first, b.last);
    /** ⭐ THE INVERTED PREDICATE for a re-walk: it MUST land inside a consumed interval. */
    const ok = b.kind === 're-walk' ? ledgerCollisions.length > 0 : ledgerCollisions.length === 0;
    return { ...b, seeds: b.last - b.first + 1, ledgerCollisions, ok };
  });
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  const routedCorrectly = CLEAN_INVOCATION
    ? (MODE === 'smoke' ? firstSeed === SMOKE_BASE : firstSeed === CENSUS_BASE)
    : (firstSeed >= GUARD_BLOCK[0] && lastSeed <= GUARD_BLOCK[1]);
  const ownOrdered = SMOKE_BASE + SMOKE_N - 1 < INERT_TWIN_SEED
    && INERT_TWIN_SEED < GUARD_BLOCK[0]
    && GUARD_BLOCK[1] < CENSUS_BASE
    && CENSUS_BASE + N_CAP - 1 < RESERVED_BAND[1];
  /** ⭐ the DV-T0 ORDERED SKIP BAND is in the ledger, so the skip is machine-checked, not promised */
  const skipBandLedgered = CONSUMED.some((c) => c.range[0] === 12_430_900 && c.range[1] === 12_430_911);
  const t1cLedgered = CONSUMED.some((c) => c.range[0] === 12_432_000 && c.range[1] === 12_434_035)
    && CONSUMED.some((c) => c.range[0] === 12_435_000 && c.range[1] === 12_435_099);
  return {
    pass: walked.every((b) => b.ok) && inBand && routedCorrectly && ownOrdered && skipBandLedgered && t1cLedgered,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, inBand, routedCorrectly,
    subBlocksOrdered: ownOrdered, skipBandLedgered, t1cLedgered,
    walkedBlocks: walked,
    subBlocks: {
      smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
      inertTwin: `${INERT_TWIN_SEED}`,
      guard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      census: `${CENSUS_BASE}..${CENSUS_BASE + N_CAP - 1}`,
      censusN: RUN_N,
      gWorldConstructionSeed: RESERVED_BAND[1],
    },
    freshnessNote: `⭐ #163: this stage's band opens at ${RESERVED_BAND[0]} (ruling #255.4), strictly `
      + 'above everything the programme has consumed — DV-T1c\'s battery ran to 12,434,035 and its '
      + 'reserved ceiling to 12,435,099.',
    reproNote: 'the TWO re-walk blocks (GGC smoke, DV-C0 smoke) are DELIBERATE receipts, so their '
      + 'predicate is INVERTED: each must COLLIDE with the ledger. Every other block carries the '
      + 'ordinary predicate (collision-free), and the sub-blocks are ordered and disjoint.',
    consumedLedger: CONSUMED,
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

/** gWorld: the arm is BARE PRODUCTION, read back off a freshly built (never stepped) match. */
const gWorldReadback = (() => {
  const m = matchFor(RESERVED_BAND[1]);
  const flagKeys = Object.keys(MT_WORLD_FLAGS) as (keyof typeof MT_WORLD_FLAGS)[];
  const mm = m as unknown as Record<string, unknown>;
  const OTHER_FLAGS = ['dlcStrikePlane', 'dlcDeliveryChoice', 'obmMovement', 'ptpPassToPath',
    'ctbCheckToBall', 'pmPhaseModulation', 'mtMarkTightness', 'dvDeliveryValue', 'ptpPassLead',
    'o1PassWindup'] as const;
  const views = ([0, 1] as const).flatMap((s) => [
    m.teams[s].info.genome, m.teams[s].baseGenome, m.teams[s].effGenome,
  ] as unknown as Record<string, unknown>[]);
  const GENE_KEYS = ['defLaneConvergence', 'markSag', 'passLeadSupport', 'obmMoveWeights',
    'ctbSupportPlane', 'dlcStrikePlaneGene', 'dvExposureWeight', 'dvLossBelief'] as const;
  return {
    noMtFlags: flagKeys.every((k) => mm[k] !== true),
    noStageFlags: OTHER_FLAGS.every((k) => mm[k] !== true),
    genesAbsent: views.every((g) => GENE_KEYS.every((k) => g[k] === undefined)),
    eyeNull: m.stationEye === null,
    readback: mtArmedVersion(m) === 0,
    genomeViewsChecked: views.length,
    mtFlagKeys: flagKeys, otherFlagKeys: OTHER_FLAGS, geneKeysChecked: GENE_KEYS,
    constructionSeed: RESERVED_BAND[1],
  };
})();
type WorldReadback = typeof gWorldReadback;
const worldConjuncts = (r: WorldReadback) => ({
  noMtFlags: r.noMtFlags, noStageFlags: r.noStageFlags, genesAbsent: r.genesAbsent,
  eyeNull: r.eyeNull, readback: r.readback,
});
const gWorld = {
  ...gWorldReadback,
  pass: Object.values(worldConjuncts(gWorldReadback)).every((v) => v === true),
  note: '⭐ THE WORLD WHOSE PRICES GROUND EVERYTHING is the SHIPPED game. Read back on a freshly '
    + 'constructed, NEVER-STEPPED match: no MT consumption flag, no banked stage flag (⭐ including '
    + '`dvDeliveryValue` itself and `o1PassWindup`, whose shut door is what makes the pricing and '
    + 'the strike the SAME tick), no seam gene on any of the six genome views, stationEye null, '
    + 'and the engine-side mtArmedVersion readback 0.',
};

/** ⭐⭐ gAccounting — DV-C0's identities PLUS this stage's delivery identities, written as PURE
 *  per-conjunct predicates so every one of them can carry its own mutant (#251.3 / #252.3). */
type AccIn = Agg['accounting'];
const accountingConjuncts = (a: AccIn) => ({
  ticksIdentity: a.deadBallTicks + a.segmentTicks + a.looseGapTicks === a.totalTicks,
  noOverlap: a.assignedTicksSum === a.segmentTicks,
  spansOrdered: a.spanOrderViolations === 0,
  goalsIdentity: a.concededGoals === a.goalsFromScore,
  turnoverLedgered: a.turnoversTotal === a.turnoversLedgered,
  oneToOne: a.doubleAttributed === 0,
  windowIdentity: a.perWindow.every((w) => w.attributed + w.unattributed === a.concededGoals
    && w.attributed === w.attributedInLossCells),
  lossZonePartition: a.perWindow.every((w) => w.turnoversInLossCells === a.turnoversTotal),
  attributionMonotone: a.perWindow.every((w, i) => i === 0 || w.attributed >= a.perWindow[i - 1].attributed),
  /* --- the DELIVERY identities --- */
  deliveryAssignment: a.deliveriesWalked === a.deliveriesAssigned + a.deliveriesUnassigned,
  deliveryFullyAssigned: a.deliveriesUnassigned === 0,
  deliveryZonePartition: a.deliveriesWalked === a.deliveriesInZonesPrimary,
  deliveryOutcomePartition: a.outcomeTotals.punished + a.outcomeTotals.lostUnpunished
    + a.outcomeTotals.survived === a.deliveriesWalked,
  survivedSplit: a.survivedBy.deadBall + a.survivedBy.goal + a.survivedBy.matchEnd === a.outcomeTotals.survived,
  punishedSubsetLost: a.punishedPrimary <= a.lostPrimary
    && a.punishedPrimary === a.outcomeTotals.punished
    && a.lostPrimary === a.outcomeTotals.punished + a.outcomeTotals.lostUnpunished,
  punishmentMonotone: a.punishedByWindow.every((w, i) => i === 0 || w.punished >= a.punishedByWindow[i - 1].punished),
  lostInvariantInWindow: a.punishedByWindow.every((w) => w.lost === a.lostPrimary),
  /* --- the FAMILY-PURITY identities (the delivery family boundary) --- */
  noLedStrikes: a.ledStrikes === 0,
  noTeamMismatch: a.deliveryTeamMismatch === 0,
  windupShutEverywhere: a.matchesWithWindupOpen === 0,
});
type AccConj = keyof ReturnType<typeof accountingConjuncts>;
const gAccounting = (() => {
  const c = accountingConjuncts(coreA.census.accounting);
  return {
    pass: Object.values(c).every((v) => v === true),
    ...c,
    ...coreA.census.accounting,
    identity: '⭐ (i) DV-C0\'s identities, inherited: every tick in EXACTLY ONE of {segment · loose '
      + 'interval · dead ball}, spans ordered, every conceded goal attributed to exactly '
      + 'one-or-zero turnovers at EVERY window, attribution monotone in the window, every turnover '
      + 'in exactly one LOSS zone. (ii) ⭐⭐ THIS STAGE\'S DELIVERY IDENTITIES: every delivery is '
      + 'assigned to exactly one possession chain and to exactly one AIM zone; the three outcome '
      + 'classes {punished · lost-but-unpunished · survived} PARTITION the deliveries; punished ⊆ '
      + 'lost and the punished count is monotone in the window while the LOST count is invariant '
      + 'in it (the denominator is the same population at every row). (iii) THE FAMILY BOUNDARY: '
      + 'zero led strikes (a bare production world strikes only the to-feet candidate the ground '
      + 'pricer prices), zero team mismatches, and the `o1PassWindup` door shut in every match — '
      + 'so pricing and strike are the same tick and the recorded AIM is the pricer\'s own.',
  };
})();

/** ⭐ G-NOTABLE-PRE — the published values are not reachable from `src/**`, checked in BOTH the
 *  raw 5-dp form and the FORMATTED PERCENTAGE form the tables actually print (the #250.3 lesson:
 *  a grep gate that greps a form nobody prints is a vacuous gate). */
const listTs = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = pathJoin(dir, e);
  return statSync(p).isDirectory() ? listTs(p) : (p.endsWith('.ts') ? [p] : []);
});
const SRC_FILES = existsSync(SRC_DIR) ? listTs(SRC_DIR) : [];
const SRC_TEXT = SRC_FILES.map((f) => readFileSync(f, 'utf8')).join('\n');
/** ⭐ THE SEARCH SET IS DECLARED, NOT MAXIMAL: a value is searched in BOTH the raw 5-dp form and
 *  the FORMATTED PERCENTAGE form the tables print, and DEGENERATE cells (a rate of exactly zero,
 *  or below the 5-dp form's own resolution) are EXCLUDED — "0.00000"/"0.000" is a numeral this
 *  codebase writes everywhere and matching it would prove nothing about a census value leaking.
 *  Frozen ex ante with a non-vacuity floor on the set size and a control needle. */
const VALUE_SEARCH_FLOOR = 0.0005;
const MIN_NEEDLES = 4;
const searchForms = (v: number): string[] => (Number.isFinite(v) && v >= VALUE_SEARCH_FLOOR
  ? [v.toFixed(5), `${(v * 100).toFixed(3)}`] : []);
const gValuesUnreachable = (() => {
  const primary = coreA.census.table.find((t) => t.isPrimary)!;
  const values = [
    ...primary.byZone.map((r) => r.punishRate),
    ...primary.byZone.map((r) => r.punishGivenLost),
    primary.all.punishRate,
  ];
  const needles = [...new Set(values.flatMap(searchForms))];
  const hits = needles.filter((n) => SRC_TEXT.includes(n));
  /** the LIVENESS control: a string that IS in src must be found, or the search is vacuous. */
  const controlNeedle = 'DV_THIRD_BOUNDARY_LOCAL_X';
  const controlFound = SRC_TEXT.includes(controlNeedle);
  return {
    pass: hits.length === 0 && controlFound && needles.length >= MIN_NEEDLES && SRC_FILES.length > 0,
    filesScanned: SRC_FILES.length, needles, hits, controlNeedle, controlFound,
    searchFloor: VALUE_SEARCH_FLOOR, minNeedles: MIN_NEEDLES,
    note: '⭐ #247 IN ADVANCE: none of this census\'s published values appears anywhere in `src/**`, '
      + 'searched in BOTH the raw 5-dp form and the formatted percentage form the tables print. '
      + 'The control needle proves the search is live rather than vacuously clean.',
  };
})();

/** ⭐⭐ G-MUTANTS (#251.3 derived-predicate rule, #252.3 coverage rule): EVERY conjunct of the
 *  composite gates carries its OWN mutant, and the mutant must flip THAT conjunct to false. */
const gMutants = (() => {
  const rows: { gate: string; conjunct: string; mutant: string; flipped: boolean }[] = [];

  /* --- gAccounting: one mutant per conjunct, applied to a CLONE of the real input --- */
  const base = coreA.census.accounting;
  const accMutants: Record<AccConj, (a: AccIn) => void> = {
    ticksIdentity: (a) => { a.deadBallTicks += 1; },
    noOverlap: (a) => { a.assignedTicksSum += 1; },
    spansOrdered: (a) => { a.spanOrderViolations = 1; },
    goalsIdentity: (a) => { a.goalsFromScore += 1; },
    turnoverLedgered: (a) => { a.turnoversLedgered += 1; },
    oneToOne: (a) => { a.doubleAttributed = 1; },
    windowIdentity: (a) => { a.perWindow[0].attributed += 1; },
    lossZonePartition: (a) => { a.perWindow[0].turnoversInLossCells += 1; },
    attributionMonotone: (a) => { a.perWindow[a.perWindow.length - 1].attributed = -1; },
    deliveryAssignment: (a) => { a.deliveriesAssigned += 1; },
    deliveryFullyAssigned: (a) => { a.deliveriesUnassigned = 1; a.deliveriesWalked += 1; },
    deliveryZonePartition: (a) => { a.deliveriesInZonesPrimary += 1; },
    deliveryOutcomePartition: (a) => { a.outcomeTotals.survived += 1; },
    survivedSplit: (a) => { a.survivedBy.deadBall += 1; },
    punishedSubsetLost: (a) => { a.punishedPrimary += 1; },
    punishmentMonotone: (a) => { a.punishedByWindow[a.punishedByWindow.length - 1].punished = -1; },
    lostInvariantInWindow: (a) => { a.punishedByWindow[0].lost += 1; },
    noLedStrikes: (a) => { a.ledStrikes = 1; },
    noTeamMismatch: (a) => { a.deliveryTeamMismatch = 1; },
    windupShutEverywhere: (a) => { a.matchesWithWindupOpen = 1; },
  };
  for (const key of Object.keys(accMutants) as AccConj[]) {
    const mutated = clone(base);
    accMutants[key](mutated);
    const after = accountingConjuncts(mutated);
    rows.push({ gate: 'gAccounting', conjunct: key, mutant: accMutants[key].toString(), flipped: after[key] === false });
  }

  /* --- gWorld: one mutant per conjunct --- */
  const worldMutants: Record<keyof ReturnType<typeof worldConjuncts>, (r: WorldReadback) => void> = {
    noMtFlags: (r) => { r.noMtFlags = false; },
    noStageFlags: (r) => { r.noStageFlags = false; },
    genesAbsent: (r) => { r.genesAbsent = false; },
    eyeNull: (r) => { r.eyeNull = false; },
    readback: (r) => { r.readback = false; },
  };
  for (const key of Object.keys(worldMutants) as (keyof ReturnType<typeof worldConjuncts>)[]) {
    const mutated = clone(gWorldReadback);
    worldMutants[key](mutated);
    rows.push({
      gate: 'gWorld', conjunct: key, mutant: `${key} := false`,
      flipped: worldConjuncts(mutated)[key] === false,
    });
  }

  /* --- the two RE-WALK receipts: one mutant per FIELD FAMILY (a want value perturbed by 1) --- */
  const reproMutant = (gate: string, checks: FieldCheck[]): void => {
    for (const fam of [...new Set(checks.map((c) => c.family))]) {
      const mutated = checks.map((c) => ({ ...c }));
      const target = mutated.find((c) => c.family === fam)!;
      target.want += 1;
      rows.push({
        gate, conjunct: `family:${fam}`, mutant: `want(${target.field}) += 1`,
        flipped: mismatchesOf(mutated).length > 0,
      });
    }
  };
  reproMutant('gReproGgc', ggcChecks);
  reproMutant('gReproDvc0', dvc0Checks);

  /* --- gZoneTrace: the sweep's own liveness (a shifted boundary must disagree) --- */
  let shiftedDisagreements = 0;
  for (let i = 0; i < ZONE_SWEEP_STEPS; i++) {
    const x = -HALF_L + (2 * HALF_L * i) / (ZONE_SWEEP_STEPS - 1);
    const shifted: Third = x < -(THIRD_LOCAL_X / 2) ? 'own' : x > THIRD_LOCAL_X / 2 ? 'final' : 'middle';
    if (aimThirdOf(x) !== shifted) shiftedDisagreements++;
  }
  rows.push({
    gate: 'gZoneTrace', conjunct: 'sweepDisagreements',
    mutant: 'compare the shipped classifier against a HALVED boundary',
    flipped: shiftedDisagreements > 0,
  });

  /* --- gValuesUnreachable: the search machinery itself --- */
  rows.push({
    gate: 'gValuesUnreachable', conjunct: 'searchIsLive',
    mutant: 'a needle that IS in src/** must be found',
    flipped: gValuesUnreachable.controlFound === true,
  });

  /* --- gWrapperInert: the twin comparison must be able to see a difference --- */
  rows.push({
    gate: 'gWrapperInert', conjunct: 'nonVacuity',
    mutant: 'the bare walk must capture ZERO deliveries while the wrapped walk captures some',
    flipped: gWrapperInert.deliveriesBare === 0 && gWrapperInert.deliveriesWrapped > 0,
  });

  const dead = rows.filter((r) => !r.flipped);
  return {
    pass: dead.length === 0 && rows.length > 0,
    conjunctsCovered: rows.length, dead: dead.length, deadRows: dead, rows,
    note: '⭐⭐ #251.3 / #252.3: this stage DERIVED its own predicates and proves EVERY conjunct '
      + 'LIVE — each row perturbs exactly one input and asserts that exactly that conjunct goes '
      + 'false. A dead conjunct inside a PASS gate is the defect this gate exists to catch.',
  };
})();

const gates = {
  xDet: { pass: xDet, digestA, digestB, note: 'the whole measured core computed TWICE, canonical-JSON digests' },
  xFpProd: {
    pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS, skipped: SKIP_FP,
    reDerivedInThisProcess: !SKIP_FP,
    skipNote: 'a SKIPPED fingerprint forces the run onto a PREFLIGHT path — no canonical artifact '
      + 'can exist with skipped:true (the canonical-write guard, both limbs).',
  },
  xSrcUntouched: {
    pass: srcDiff === '', srcDiff,
    note: 'INSTRUMENT-ONLY: this stage adds ZERO src/** — the contract\'s T2-C0 clause ("no src change").',
  },
  gReproGgc,
  gReproDvc0,
  gWindowTrace,
  gZoneTrace,
  gWrapperInert,
  gWorld,
  gSeedDisjoint,
  gStatsDisjoint: {
    pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap,
    resamples: BOOTSTRAP_RESAMPLES, cluster: 'match seed (#20)',
    publishedScope: 'DLC-T1s\'s COMPLETE ≥91,100-regime ledger + DV-C0\'s 106,000 + DV-T1\'s 106,200 '
      + '+ DV-T1b\'s 106,600 + DV-T1c\'s 107,000. Pre-regime bases are ≥ 16,000 away.',
  },
  gCleanInvocation: {
    pass: CLEAN_INVOCATION,
    envN: N_ENV, capped: IS_CAPPED, skipFp: SKIP_FP,
    routedToGuardBlock: !CLEAN_INVOCATION,
    guardBlock: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
    note: 'any DVT2C0_N / DVT2C0_CAP / DVT2C0_SKIP_FP override is BY DEFINITION not the census: the '
      + 'run is routed onto the exit-semantics guard block, this gate goes RED and the process '
      + 'exits 1, so the census block stays VIRGIN.',
  },
  gNDerived: {
    pass: MODE === 'smoke' ? N_ENV === null : (N_ENV === null && RUN_N === nDerivation.nStar),
    ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, envOverride: N_ENV,
    note: 'in FULL mode the N run must BE the frozen §NRULE output; DVT2C0_N is accepted in NO mode.',
  },
  gAccounting,
  gValuesUnreachable,
  gMutants,
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §17 ARTIFACT                                                                */
/* ========================================================================== */
const msPerMatchMeasured = passMs / Math.max(1, RUN_N * ARMS_COUNT);
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  rarestZoneEventsPerMatch: coreA.census.rarestZoneEventsPerMatch,
  deliveriesPerMatch: coreA.census.deliveriesPerMatch,
  turnoversPerMatch: coreA.census.turnoversPerMatch,
  concededGoalsPerMatch: coreA.census.concededGoalsPerMatch,
  provenance: MODE === 'smoke'
    ? 'THE SMOKE\'S TWO SIZING NUMBERS — ms/match and the RAREST AIM zone\'s PUNISHED deliveries '
      + 'per match at the primary window. These are the ONLY numbers a FULL run reads out of this '
      + 'artifact, and they feed ONLY N. THE SMOKE ADJUDICATES NOTHING.'
    : 'POST-HOC on this FULL run — it selected nothing (N came from the frozen rule on the SMOKE\'s '
      + 'two numbers). Reported so the smoke\'s estimate can be checked against reality.',
};

const verdict = !allGatesPass ? 'GATES RED — the measurement is invalid'
  : MODE === 'smoke' ? 'SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING'
    : `DV-T2-C0 PASS-LEVEL CENSUS at N=${RUN_N} × 1 arm (production) — gate-green. THE TABLE IS `
      + 'DESCRIPTIVE TRUTH: the #246 shape flags are mechanical and the commander adjudicates them.';

const body = {
  stage: 'DV-T2-C0 — THE PASS-LEVEL CENSUS (the label\'s own truth: P(punished | delivery into z))',
  doc: 'docs/world-model/DV-T2-C0-PASS-LEVEL-CENSUS.md',
  contract: 'docs/world-model/DV-T2-LEARNED-MAP-CONTRACT.md §2 M-DV2.1 / §3 T2-C0',
  ruling: '#255 (the contract bound, T2-C0 dispatched) · #246 (the reality-shape check) · #247 '
    + '(truth/belief split) · #249 (DV-C0 — THE FORM) · #251.3/#252.3 (derived predicates, mutant '
    + 'per conjunct) · #250.3 (mode-conditioned literals)',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  frozenDesign: {
    world: '⭐ BARE PRODUCTION — `new Match({seed, teamA, teamB})`, the SHIPPED game. No flag, no '
      + 'gene, no eye (gWorld reads it back on a never-stepped match).',
    measuredQuantity: '⭐⭐ THE M-DV2.1 LABEL, measured globally: for EVERY ground DELIVERY, does '
      + 'the possession chain it was struck inside END IN A LOSS and does the delivering side '
      + 'CONCEDE inside the census\'s own window, by DV-C0\'s frozen nearest-in-window greedy '
      + 'one-to-one attribution? PUNISHED ⇒ the tick (z, 1); anything else ⇒ (z, 0). The primary '
      + 'rate is the MARGINAL P(punished | delivery into z) — the account book\'s own quantity '
      + '(M-DV2.2, a running frequency over the team\'s OWN deliveries into z); the contract §3 '
      + 'wording\'s conditional P(punished | delivery into z, LOST) is published beside it.',
    deliveryFamily: '⭐ THE FAMILY BOUNDARY, traced to the DV-T0 §SEAM scope note: the risk price '
      + 'reaches every candidate that goes through the GROUND-PASS pricer; the loft, the through '
      + 'ball, the cross and the cutback price themselves on their own chains and are NOT in this '
      + 'family. The census therefore counts GROUND PASSES STRUCK — every `Match.performPass` '
      + 'strike the engine\'s own guard let through — and nothing else. In a bare production world '
      + 'the PTP seat is null, so the pricer\'s aim for the candidate it struck IS `mate.pos`, and '
      + 'the `o1PassWindup` door is shut, so the pricing and the strike are the SAME tick: the '
      + 'recorded AIM is the pricer\'s own read (gAccounting.noLedStrikes + gWorld + '
      + 'gAccounting.windupShutEverywhere prove all three rather than asserting them).',
    aimIndex: '⭐⭐ THE INDEX IS THE AIM ZONE IN THE PASSING TEAM\'S FRAME, computed by the SHIPPED '
      + '`receptionZoneIndex` imported from `src/ai/deliveryValueSeat.ts` — the very classifier the '
      + 'risk price reads the belief with. This is the DV-T0 §HONESTY 8 index-commensurability '
      + 'mismatch fixed AT THE SOURCE: DV-C0\'s table is indexed by the LOSS (last-owned) zone and '
      + 'cannot be re-cut by aim, which is exactly why this census exists.',
    lossSemantics: 'INHERITED VERBATIM from DV-C0 (#215.3-H1/M2): a possession segment is a maximal '
      + 'interval of same-owner-TEAM control while phase === "playing", suspended while the ball is '
      + 'loose in play; a TURNOVER is a segment ending with terminator "opponentControl", stamped at '
      + 'the tick the opponent establishes control with its POSITION read at the last owned tick. '
      + 'G-REPRO-DVC0 re-walks DV-C0\'s own smoke block and reproduces its committed rows.',
    windows: {
      primaryWindowS: PRIMARY_WINDOW_S, windowsS: WINDOWS_S, trace: gWindowTrace,
      note: '⭐ the primary window is DV-C0\'s own (which is itself the #218 census\'s own 10 s '
        + 'co-occurrence window); the ladder is DV-C0\'s own ladder, re-asserted against its artifact.',
    },
    zoning: {
      thirds: THIRDS, thirdBoundaryLocalX: round(THIRD_LOCAL_X, 6),
      trace: gZoneTrace,
      note: 'THREE ZONES ONLY. The belief is three-cell by M-DV2.2 (coarse on purpose, DV-T0 '
        + '§HONESTY 6) and DV-C0\'s lateral analogue is NOT lifted: re-cutting the zoning finer is '
        + 'a later slice\'s, and doing it here would give T2-T1 a yardstick the book cannot hold.',
    },
    attributionRule: '⭐ DV-C0\'S FROZEN RULE, INHERITED: NEAREST-IN-WINDOW, GREEDY, ONE-TO-ONE '
      + '(goals chronological; a goal conceded by T at t_g goes to the LATEST not-yet-attributed '
      + 'turnover by T with loss stamp in [t_g − W, t_g]; ties → earliest index; else UNATTRIBUTED). '
      + 'The #218 CO-OCCURRENCE reading (many-to-one) is published beside every cell as the '
      + 'declared cross-cut.',
    estimator: `cluster bootstrap by MATCH SEED (#20), ${BOOTSTRAP_RESAMPLES} resamples, percentile `
      + '95 % CI, ratio-of-sums per zone. ⭐ ONE SHARED resample-index matrix, so every zone rate '
      + 'and every zone DIFFERENCE (the #246 predicates) is computed on the SAME resampled clusters '
      + `— the differences are paired by construction. Stats stream base ${BOOTSTRAP_SEED} (#163).`,
    realityShapePredicates: '⭐ #246, PRE-REGISTERED BEFORE ANY RUN: (1) P(punished | own) > '
      + 'P(punished | middle); (2) P(punished | middle) > P(punished | final); (3) the GRADIENT — '
      + 'both together. Each resolved by the paired cluster-bootstrap CI of the DIFFERENCE excluding '
      + 'zero. ⚠ AN INVERSION IS A FINDING, NOT AN ERROR: PUBLISHED and routed to the 街机偏离 test, '
      + 'NEVER corrected into the table. MAGNITUDES are OUR world\'s; only the SHAPE is the check.',
    truthBeliefSplit: '⭐⭐ #247: this table is INSTRUMENT-SIDE TRUTH and is wired into NO player. '
      + 'It is the YARDSTICK T2-T1 scores learned books against, and the source of the EVENT-RATE '
      + 'MOMENTS T2-T1 sizes its run length from. No team is given it (#247 intact — wrong books '
      + 'are legal and are STYLE).',
    seedLedger: gSeedDisjoint,
    statsBase: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed', minGap: statsMinGap },
    nRule: nDerivation,
  },
  referenceShapes: {
    houseLaw: '⭐⭐ SHAPES ONLY, AND THEY REACH NO SIM VALUE (VISION §3): 常数永不进口. No '
      + 'real-football NUMBER appears in this probe; the #246 comparison is an ORDERING.',
    axis: 'that a ball played into your own third is the most punished, and that the punishment '
      + 'falls as the delivery aims further up the pitch, is the standard structure of real '
      + 'football\'s risk sense — the SHAPE #246 cites, and the shape the FIFTH REGISTRATION '
      + 'predicts the books will grow on their own.',
    scaleCaveat: '⚠ this world is 6v6 on a 0.70-scaled pitch with 240 sim-seconds mapped to 90 '
      + 'display-minutes. MAGNITUDES DO NOT TRANSFER and are not supposed to (#246).',
  },
  result: { seeds: coreA.seeds, census: coreA.census },
  gates,
  allGatesPass,
  deviations: [
    'A TOUCH / OWNERSHIP EPISODE IS NOT A FOOT-BALL CONTACT (inherited from the #170 tempo census '
      + 'through #214/DV-C0): Match exposes ball.owner, not a contact event. Everything here is '
      + 'derived from observable state, which is what X-SRC-UNTOUCHED requires.',
    '⭐ THE DELIVERY IS OBSERVED THROUGH AN INSTANCE WRAPPER ON `performPass` (the PTP-T0/DV-T1 '
      + 'idiom). It is a pass-through, and G-WRAPPER-INERT proves inertness on a twin walk of one '
      + 'declared seed rather than asserting it. A `performPass` call the ENGINE\'s own guard '
      + 'rejects is counted as a suppressed call and is NOT a delivery.',
    '⭐ THE AIM IS `mate.pos` AT THE STRIKE TICK. In a bare production world that IS the ground '
      + 'pricer\'s aim for the candidate it struck (the PTP seat is null ⇒ `aim = mate.pos`) and '
      + 'the decision and the strike share a tick (`o1PassWindup` shut). Both facts are GATED. In a '
      + 'world with the led or plane doors open the aim would move, which is why the census is '
      + 'defined on the production world and nowhere else.',
    '⭐⭐ THE LABEL IS CHAIN-LEVEL, SO SEVERAL DELIVERIES CAN SHARE ONE PUNISHMENT. Every delivery '
      + 'struck inside a chain that ended in a punished loss carries the tick — that is M-DV2.1\'s '
      + 'own wording ("a delivery whose possession outcome is a LOSS followed by a concession"), and '
      + 'it is what the account book will actually see. It means the punished-delivery count is NOT '
      + 'the punished-turnover count, and the two are published side by side.',
    'THE RATE IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT. Deliveries are not randomly assigned to '
      + 'aim zones: a team aiming into its own third is in a different state from one aiming into '
      + 'the final third, and that state is part of the price. No counterfactual is claimed.',
    'THE ATTRIBUTION RULE IS A RULE, NOT A TRUTH (DV-C0\'s deviation, inherited). It is frozen ex '
      + 'ante, the CO-OCCURRENCE cross-cut is published beside every cell, and the whole table is '
      + 'republished at four windows so the reader can see how much the choice moves.',
    'NO LATERAL BAND. DV-C0 published a third × band secondary table; this census does not, because '
      + 'the belief M-DV2.2 defines is three-cell and a finer yardstick would be one T2-T1\'s books '
      + 'cannot be scored against.',
    'SINGLE ARM, NO PAIRING. This is a CENSUS, not a contrast.',
    'NO CHECKPOINT/RESUME: the census is a few minutes; a kill costs the run. Stated, not hidden.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, no flag and '
      + 'no gene written anywhere.',
    '⭐⭐ THE TABLE IS NOT WIRED INTO ANY PLAYER (#247). It is instrument-side truth: it yardsticks '
      + 'T2-T1\'s learned books and it sizes T2-T1\'s run length. No chooser reads it.',
    'NO PASS/FAIL ON ANY MEASURED RATE. The gates are the X-family, the two inheritance receipts, '
      + 'the trace gates, the accounting identities and the mutant-liveness proof. The #246 shape '
      + 'flags are MECHANICAL CI readings, not gates: an inversion turns nothing red and is ROUTED, '
      + 'never corrected.',
    'THE WINDOW LADDER IS A REPORTING GRID, and so is the run-length K grid: T2-T1 freezes its own '
      + 'K before it runs, from these moments.',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). T2-T0 / T2-T1 are the contract\'s.',
    'THE LEARNING SEAM DOES NOT EXIST YET. Nothing here builds the account book, the write path or '
      + 'the learning flag — T2-T0 does, and this stage adds no src byte toward it.',
  ],
  verdict,
};

const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
/** the SECOND limb of the canonical-write guard, at the write itself. */
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error(`DV-T2-C0 FATAL — refusing to write a PREFLIGHT artifact to the canonical path `
    + `${OUT_PATH} (resolved: ${pathResolve(OUT_PATH)}; preflight because: ${PREFLIGHT_REASONS.join(' + ')}).`);
  process.exit(2);
}
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  sizing: sizingOut,
  /** UNHASHED ENVELOPE (#197-M1 / #216-M): path-bearing and wall-clock fields live OUTSIDE
   *  resultSha256, so a /tmp re-run re-derives the canonical artifact's receipt byte-for-byte. */
  preflightProvenance: {
    preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS, capped: IS_CAPPED, fingerprintSkipped: SKIP_FP,
    outPath: OUT_PATH, outPathResolved: pathResolve(OUT_PATH), canonicalPath: isCanonicalPath(OUT_PATH),
    rule: 'ANY skip/preflight lever makes the run a PREFLIGHT regardless of N, a preflight may NEVER '
      + 'write a canonical repo path (guarded at parse time AND again at write time, on the RESOLVED '
      + 'absolute path with a separator-aware prefix test), and the skip is recorded here and in '
      + 'gates.xFpProd.',
  },
  headContextOnly: head,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (#197-M1).',
  wallContextOnly: {
    corePassMs: passMs, totalMs: Date.now() - wall0,
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 (#128) — used in no gate. `sizing.msPerMatch` is '
      + 'the one timing number with a job: the wall term of the frozen N rule reads it.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §18 STDOUT — rows, never verdicts (#203)                                    */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number): string => (Number.isFinite(x) ? `${(x * 100).toFixed(3)} %` : 'n/a');
o('');
o(`=== DV-T2-C0 PASS-LEVEL CENSUS — ${MODE} — HEAD ${head} — ${RUN_N} seeds (production), `
  + `block ${firstSeed}..${lastSeed} ===`);
o('');
o(`deliveries/match ${coreA.census.deliveriesPerMatch} · turnovers/match ${coreA.census.turnoversPerMatch}`
  + ` · conceded goals/match ${coreA.census.concededGoalsPerMatch}`);
o('');
for (const w of coreA.census.table) {
  o(`⭐ WINDOW ${w.windowS}s${w.isPrimary ? '  (PRIMARY — DV-C0\'s own)' : ''}`);
  o('   aim zone   deliveries      lost   punished   P(punished)    CI95                       P(pun|lost)');
  for (const r of [...w.byZone, w.all]) {
    o(`   ${String(r.zone).padEnd(9)} ${String(r.deliveries).padStart(11)} ${String(r.lost).padStart(9)}`
      + ` ${String(r.punished).padStart(10)}   ${pct(r.punishRate).padStart(11)}`
      + `   [${pct(r.punishRateCi95[0])}, ${pct(r.punishRateCi95[1])}]`.padEnd(28)
      + `   ${pct(r.punishGivenLost)}`);
  }
  const s = w.realityShape;
  o(`   #246 SHAPE: own−middle ${pct(s.ownVsMiddle.point)} [${pct(s.ownVsMiddle.ci95[0])}, `
    + `${pct(s.ownVsMiddle.ci95[1])}] ⇒ ${s.ownVsMiddle.verdict}`);
  o(`               middle−final ${pct(s.middleVsFinal.point)} [${pct(s.middleVsFinal.ci95[0])}, `
    + `${pct(s.middleVsFinal.ci95[1])}] ⇒ ${s.middleVsFinal.verdict}`);
  o(`               GRADIENT toward own goal ⇒ ${s.gradientTowardOwnGoal}`);
  o('');
}
o('⭐ EVENT-RATE MOMENTS (deliveries per zone PER TEAM PER MATCH — the T2-T1 run-length input):');
for (const r of coreA.census.eventRateMoments.byZone) {
  o(`   ${r.zone.padEnd(7)} mean ${String(r.deliveriesPerTeamPerMatch).padStart(8)} · sd ${String(r.sd).padStart(7)}`
    + ` · cv ${String(r.cv).padStart(6)} · median ${String(r.median).padStart(4)} · p10 ${String(r.p10).padStart(4)}`
    + ` · p90 ${String(r.p90).padStart(4)} · zero-share ${pct(r.zeroShare)}`);
}
o('');
o(`⭐ CONVERGENCE YARDSTICK (${coreA.census.yardstick.schema}) ordering: `
  + `${coreA.census.yardstick.ordering.join(' > ')} · relative `
  + JSON.stringify(coreA.census.yardstick.relative));
o('');
o(`GATES ${allGatesPass ? 'GREEN' : '*** RED ***'}: `
  + Object.entries(gates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`  G-REPRO-GGC ${gReproGgc.fieldsChecked} fields · ${gReproGgc.mismatches} mismatches · block ${gReproGgc.block}`);
o(`  G-REPRO-DVC0 ${gReproDvc0.fieldsChecked} fields · ${gReproDvc0.mismatches} mismatches · block ${gReproDvc0.block}`);
o(`  G-MUTANTS ${gMutants.conjunctsCovered} conjuncts · ${gMutants.dead} dead`);
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s · ${round(msPerMatchMeasured, 1)} ms/match`
  + ` · rarest-zone events/match ${sizingOut.rarestZoneEventsPerMatch} · artifact ${OUT_PATH}`);
o(`VERDICT: ${verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!allGatesPass) process.exit(1);
process.exit(0);
