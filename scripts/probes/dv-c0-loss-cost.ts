/**
 * DV-C0 — THE LOSS-COST CENSUS (⭐ THE TRUE TABLE: turnover → goal-against hazard by zone).
 *
 * Authority: the DELIVERY-VALUE contract `docs/world-model/DELIVERY-VALUE-CONTRACT.md` §3 DV-C0,
 * INCLUDING the ⭐ #246 REALITY-SHAPE amendment (the measured table's SHAPE is compared against
 * real football's structure; a shape inversion is PUBLISHED and routed to the 街机偏离 test, never
 * corrected into the table) and the ⭐ #247 TRUTH/BELIEF split (this table is INSTRUMENT-side
 * truth: it grounds exams and it is the YARDSTICK for belief convergence at DV-T2; it is wired
 * into NO player's head). Rulings #245 (the contract) · #248 (the earned-knowledge ledger — the
 * DV arc is the pilot; nothing here reaches a chooser) · #214/#215.3/#216 (the GOAL-GENEALOGY
 * CENSUS — THE FORM this probe inherits: whole-match tick walking, ⭐ LOSS-TICK semantics
 * (#215.3-H1/M2), segment accounting identities, the canonical-write guard, the exit-semantics
 * guard block) · #218 (the census's own 10 s co-occurrence window — the traced window family this
 * stage reuses) · #163 (seed/stats disjointness) · #181.2 (every HARD gate computed in-probe) ·
 * #197-M1/#198 (hashed body vs unhashed envelope) · #20 (cluster = match seed) · #128 (wall is
 * CONTEXT ONLY) · #203 (rows, never verdicts) · #226.1 (the transcript form) · #229.2 (no table
 * typed that the artifact does not carry — discharged by a committed generator).
 *
 * WHAT THIS IS: a single-arm CENSUS of the PRODUCTION world (`new Match({seed, teamA, teamB})` —
 * the shipped game, no flag, no gene, no eye). For EVERY team-level turnover — the goal-genealogy
 * census's own definition, inherited VERBATIM with its loss-tick semantics — it measures whether
 * the CONCEDING side (the team that lost the ball) concedes a goal within a traced window of the
 * loss, and it reports that hazard BY ZONE of the loss.
 *
 * ⭐⭐ INSTRUMENT-ONLY. ZERO src/** (X-SRC-UNTOUCHED is a HARD gate). Everything is a tick-walk
 * over observable match state. Nothing here is consumed by any player, now or at DV-T1/T2.
 *
 * ⭐ NOT A CONTRAST. One arm, one world. There is no treatment, no pairing, no primary predicate
 * about a lever. The ONLY pre-registered predicates are the #246 REALITY-SHAPE ones, which are
 * REPORTED comparisons against real football's structure and adjudicate no mechanic.
 *
 * MODES (explicit DVC0_MODE, NO default):
 *   smoke — plumbing + exactly TWO sizing numbers (ms/match, rarest-zone attributed goals/match).
 *           ADJUDICATES NOTHING and freezes no level.
 *   full  — the census at the frozen §NRULE N (read off the committed smoke artifact).
 *
 * COMMANDS (stage doc §CHECKS):
 *   DVC0_MODE=smoke npx tsx scripts/probes/dv-c0-loss-cost.ts
 *   DVC0_MODE=full  npx tsx scripts/probes/dv-c0-loss-cost.ts
 *   DVC0_MODE=full DVC0_CAP=2 DVC0_SKIP_FP=1 DVC0_OUT=/tmp/dvc0.json npx tsx …   (preflight)
 * EXIT: 0 = clean census · 1 = a gate is RED · 2 = usage/fatal.
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { mtArmedVersion, MT_WORLD_FLAGS } from '../../src/game/a4World';

/* ========================================================================== */
/* §1 FROZEN INSTRUMENT CONSTANTS — every one of them TRACED                   */
/* ========================================================================== */
/** THE THIRD BOUNDARY, in the frame team's LOCAL x: `HALF_L / 3` — the #188 / PM-T1
 *  `OWN_THIRD_LOCAL_X`, inherited through the goal-genealogy census VERBATIM, mirrored for the
 *  final third. DERIVED from the pitch's own geometry constant; never invented. */
const THIRD_LOCAL_X = HALF_L / 3;
/** ⭐ THE LATERAL BAND BOUNDARY: `HALF_W / 3` — the SAME one-third rule applied to the pitch's
 *  own WIDTH constant. |y| ≤ HALF_W/3 = CENTRAL, else WIDE. It is the width-axis ANALOGUE of the
 *  traced third rule (declared as such in the stage doc; it is a zoning choice, frozen ex ante,
 *  and it enters the SECONDARY table only — the primary table is thirds). */
const BAND_LOCAL_Y = HALF_W / 3;
/** ⭐ THE PRIMARY WINDOW: 10 sim-seconds — the #218 goal-genealogy census's OWN co-occurrence
 *  window (its `DANGER_WINDOWS_S` = [5, 10]). It is not typed as a level here: gWindowTrace READS
 *  the census's committed artifact and asserts this number is a member of that family. */
const PRIMARY_WINDOW_S = 10;
/** THE SENSITIVITY LADDER — the same traced family's smaller member (5 s) plus integer multiples
 *  of it, so the table's window-dependence is visible. gWindowTrace asserts every member is an
 *  integer multiple of the census family's MINIMUM member. Pre-registered; gates nothing. */
const WINDOWS_S = [5, 10, 15, 20] as const;

/** THE ZONES — the loss third in the LOSING team's OWN attacking frame (own = its own goal end). */
const THIRDS = ['own', 'middle', 'final'] as const;
type Third = (typeof THIRDS)[number];
const BANDS = ['central', 'wide'] as const;
type Band = (typeof BANDS)[number];
const CELLS: readonly string[] = THIRDS.flatMap((t) => BANDS.map((b) => `${t}_${b}`));
const thirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');
const bandOf = (y: number): Band => (Math.abs(y) <= BAND_LOCAL_Y ? 'central' : 'wide');

/* --- §2 THE SEED LEDGER (#163) --------------------------------------------- */
const RESERVED_BAND: readonly [number, number] = [12_429_000, 12_429_999];
const SMOKE_BASE = 12_429_000;
const SMOKE_N = 12;
/** Where EVERY non-census invocation is routed (any DVC0_N / DVC0_CAP / DVC0_SKIP_FP), so the
 *  census block stays VIRGIN. Such a run turns gCleanInvocation RED and exits 1. */
const GUARD_BLOCK: readonly [number, number] = [12_429_050, 12_429_099];
const CENSUS_BASE = 12_429_100;
/** Honest hard cap = the reserved census room 12,429,100..12,429,899. A SEED-BUDGET cap. */
const N_CAP = 800;
const N_STEP = 25;
/** THE DELIBERATE RE-WALK (a RECEIPT, never fresh data): the goal-genealogy census's OWN
 *  committed SMOKE block, PROD arm — G-REPRO-GGC. Its overlap with the ledger is THE POINT. */
const REPRO_GGC_BASE = 12_421_000;
const REPRO_GGC_N = 12;
const GGC_SMOKE_PATH = 'docs/world-model/data/goal-genealogy-census-smoke.json';
const GGC_FULL_PATH = 'docs/world-model/data/goal-genealogy-census.json';

/** The COMPLETE #163-regime ledger, carried forward from the DLC-T1s committed artifact and
 *  extended with that stage's own blocks (its battery+reserve ran to 12,428,899 and its test-seed
 *  band to 12,428,906). Pre-regime seeds are not listed and cannot move any verdict. */
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
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_899] },
  { name: 'DLC-T1s test-file seed band (#243)', range: [12_428_900, 12_428_906] },
];

/* --- §3 THE STATS STREAM — a SEPARATE namespace (#163) ---------------------- */
const BOOTSTRAP_SEED = 106_000;
const BOOTSTRAP_RESAMPLES = 2000;
/** DLC-T1s's COMPLETE ≥91,100-regime ledger + its own base 105,800. Pre-regime bases (90,730 and
 *  the 50xxx family) are ≥ 13,000 away and cannot move the minimum. */
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800,
  105_000, 105_200, 105_400, 105_800,
];

/* --- §4 THE N ARITHMETIC, frozen ex ante ------------------------------------ */
/** ⭐ THE SIZING TARGET, derived from the RARITY OF THE MEASURED EVENT: turnovers are plentiful
 *  (~35/match in the census's PROD arm), but the NUMERATOR — a conceded goal cleanly attributed to
 *  a turnover inside the primary window — is rare, and it is the numerator that sets the per-zone
 *  CI width. The rule targets 60 attributed goals IN THE RAREST third-level zone: a binomial
 *  count's relative SE is then ≈ 1/sqrt(60) ≈ 13 %, which is the precision at which a hazard
 *  ORDERING (the #246 shape check) is readable. */
const TARGET_RAREST_ZONE_EVENTS = 60;
const WALL_BUDGET_HOURS = 0.5;
const XDET_FACTOR = 2;
const ARMS_COUNT = 1;
/** The PRIOR ms/match used when no committed smoke artifact exists yet — the goal-genealogy
 *  census's own published smoke cost family. Superseded by the smoke artifact the moment it exists. */
const PRIOR_MS_PER_MATCH = 113.4;

/* --- §5 the X-family pins --------------------------------------------------- */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* ========================================================================== */
/* §6 ENV / MODE / THE GUARD-BLOCK ROUTING                                     */
/* ========================================================================== */
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.DVC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`DV-C0 FATAL — DVC0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const CAP = process.env.DVC0_CAP ? Math.max(1, Number.parseInt(process.env.DVC0_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_CAPPED = Number.isFinite(CAP);
const SKIP_FP = process.env.DVC0_SKIP_FP === '1';
const N_ENV = process.env.DVC0_N ? Math.max(1, Number.parseInt(process.env.DVC0_N, 10)) : null;
const IS_PREFLIGHT = IS_CAPPED || SKIP_FP;
const PREFLIGHT_REASONS = [IS_CAPPED ? `DVC0_CAP=${CAP}` : null, SKIP_FP ? 'DVC0_SKIP_FP=1' : null]
  .filter((r): r is string => r !== null);

const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/dv-c0-loss-cost-smoke.json',
  full: 'docs/world-model/data/dv-c0-loss-cost.json',
};
const SMOKE_PATH = OUT_BY_MODE.smoke;
const CANONICAL_DIR = 'docs/world-model/data';
const CANONICAL_DIR_ABS = pathResolve(CANONICAL_DIR);
/** The #216-H form: BOTH sides resolved, separator-aware prefix, so every spelling of the same
 *  directory (traversal, `./`, absolute) collapses to one answer. */
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = process.env.DVC0_OUT ?? (IS_PREFLIGHT ? '/tmp/dv-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('DV-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}. `
    + 'Pass DVC0_OUT=/tmp/… , or drop DVC0_CAP / DVC0_SKIP_FP to run the real thing.');
  process.exit(2);
}

/* ========================================================================== */
/* §7 numeric helpers (the house forms)                                        */
/* ========================================================================== */
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const sum = (xs: readonly number[]): number => xs.reduce((s, x) => s + x, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
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

/* ========================================================================== */
/* §8 THE WORLD — BARE PRODUCTION, built exactly as the census's PROD arm is    */
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
/** ⭐ THE SHIPPED GAME: no MatchConfig flag, no gene written, no eye armed. This is byte-for-byte
 *  the goal-genealogy census's `PROD` arm constructor, which is WHY G-REPRO-GGC can reproduce its
 *  committed rows exactly. */
const matchFor = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
});

/* ========================================================================== */
/* §9 ⭐ THE INSTRUMENT — the goal-genealogy census's tick-walk, INHERITED       */
/*    VERBATIM in its loss-tick semantics, extended with the loss-cost ledger   */
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
  team: Side;
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  startTick: number;
  lastOwnedTick: number;
  assignedTicks: number;
  completedPasses: number;
  /** ⭐ THE DEFINITIONAL LOSS SPOT (#215.3-H1): ball position at the segment's LAST OWNED tick,
   *  in the LOSING (this) team's own attacking frame. Live-updated on every owned tick. */
  lastOwnedLocalXOwnerFrame: number;
  /** ⭐ THE SAME TICK's lateral coordinate (world y — the pitch is symmetric about y = 0, so no
   *  frame mirror applies to width). This is the DV-C0 extension; the TICK is the census's. */
  lastOwnedBallY: number;
  lossLocalXLoserFrame: number | null;
  regainSpotLocalXLoserFrame: number | null;
  lossThird: Third | null;
  regainThird: Third | null;
  regainContested: boolean;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
  goalScoringSide: Side | null;
}

interface GoalRec {
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  lossThird: Third | null;
  family: Family;
  completedPasses: number;
}

/** ⭐ THE MEASURED EVENT: one team-level turnover, at the census's own loss-tick semantics. */
interface TurnoverRec {
  /** the sim-time at which the opponent ESTABLISHED control — the census's own event stamp for a
   *  turnover (it stamps the event here while reading the POSITION at the last owned tick). */
  tSim: number;
  loser: Side;
  third: Third;
  band: Band;
  cell: string;
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
  /* --- ⭐ THE DV-C0 LEDGER --- */
  turnovers: TurnoverRec[];
  /** conceded-goal events: sim-time + the CONCEDING side. */
  concededGoals: { tSim: number; conceding: Side }[];
}

function walkOne(seed: number): MatchRow {
  const m = matchFor(seed);
  const segments: Segment[] = [];
  const goals: GoalRec[] = [];
  const turnovers: TurnoverRec[] = [];
  const concededGoals: { tSim: number; conceding: Side }[] = [];

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

  const closeSegment = (s: Segment, terminator: Segment['terminator'], scoringSide: Side | null): void => {
    s.terminator = terminator;
    s.goalScoringSide = scoringSide;
    const last = segments.length === 0 ? null : segments[segments.length - 1];
    if (last !== null && s.startTick <= last.startTick) spanOrderViolations++;
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
      lossThird = thirdOf(lost === null ? 0 : -lost);
      regainThird = thirdOf(regained === null ? 0 : -regained);
      regainContested = contestedSinceLastSeg;
      origin = openPlayClass(contestedSinceLastSeg, lossThird);
      regainSpotClass = openPlayClass(contestedSinceLastSeg, regainThird);
    }
    const originAtRegainSpot: OriginClass = regainSpotClass ?? origin;
    return {
      team, origin, originAtRegainSpot, startTick: tick, lastOwnedTick: tick, assignedTicks: 0,
      completedPasses: 0,
      lastOwnedLocalXOwnerFrame: m.teams[team].localX(m.ball.pos.x),
      lastOwnedBallY: m.ball.pos.y,
      lossLocalXLoserFrame: null, regainSpotLocalXLoserFrame: null,
      lossThird, regainThird, regainContested,
      terminator: 'matchEnd', goalScoringSide: null,
    };
  };

  while (!m.finished) {
    m.step(DT);
    totalTicks++;
    const tick = m.simTick;
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
          closeSegment(cur, 'goal', goalSide);
          goals.push({
            origin: cur.origin, originAtRegainSpot: cur.originAtRegainSpot, lossThird: cur.lossThird,
            family: familyOf(cur.origin), completedPasses: cur.completedPasses,
          });
        } else closeSegment(cur, 'deadBall', null);
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
      /* ⭐ THE LOSS POINT (#215.3-H1, DEFINITIONAL): ball at the segment's LAST OWNED tick, in the
       * LOSING team's own attacking frame. The REGAIN point is kept beside it as the cross-cut. */
      const lossLocal = cur.lastOwnedLocalXOwnerFrame;
      const regainLocal = m.teams[cur.team].localX(m.ball.pos.x);
      cur.lossLocalXLoserFrame = lossLocal;
      cur.regainSpotLocalXLoserFrame = regainLocal;
      const lt = thirdOf(lossLocal);
      const lb = bandOf(cur.lastOwnedBallY);
      if (lt === 'own') ownThirdTurnovers++;
      if (thirdOf(regainLocal) === 'own') ownThirdTurnoversAtRegainSpot++;
      turnovers.push({ tSim: m.simTime, loser: cur.team, third: lt, band: lb, cell: `${lt}_${lb}` });
      closeSegment(cur, 'opponentControl', null);
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
    seg.lastOwnedBallY = m.ball.pos.y;
  }
  if (cur !== null) { closeSegment(cur, 'matchEnd', null); cur = null; }

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

  return {
    seed, simSeconds: m.simTime,
    totalTicks, deadBallTicks, segmentTicks, looseGapTicks, assignedTicksSum, spanOrderViolations,
    goalsFromScore, unattributedGoalSegments,
    segmentsByOrigin, segmentsByOriginAtRegainSpot, goals,
    turnoversTotal, ownThirdTurnovers, ownThirdTurnoversAtRegainSpot,
    turnovers, concededGoals,
  };
}

/* ========================================================================== */
/* §10 ⭐⭐ THE ATTRIBUTION RULE — FROZEN EX ANTE, stated before any run        */
/* ========================================================================== */
/**
 * NEAREST-IN-WINDOW, GREEDY, ONE-TO-ONE. Per match, per window W:
 *   conceded goals are processed in CHRONOLOGICAL order; for a goal conceded by team T at t_g the
 *   candidate set is {T's turnovers with t_l ∈ [t_g − W, t_g] that are not already attributed};
 *   the goal is attributed to the LATEST such turnover (ties → the earliest index, deterministic);
 *   if the set is empty the goal is UNATTRIBUTED.
 * ⇒ every goal is attributed to EXACTLY ONE-OR-ZERO turnovers and every turnover carries AT MOST
 *   ONE goal, which is the accounting identity gAccounting checks.
 * The #218 CO-OCCURRENCE reading ("was there ANY conceded goal within W of this loss") is computed
 * beside it as the declared cross-cut — it is many-to-one and is NOT the primary.
 */
interface CellCount { n: number; k: number; co: number }
const emptyCells = (): Record<string, CellCount> => Object.fromEntries(
  CELLS.map((c) => [c, { n: 0, k: 0, co: 0 }]),
);

interface MatchCells {
  seed: number;
  /** per window index → per cell counts */
  byWindow: Record<string, CellCount>[];
  turnoversTotal: number;
  concededGoals: number;
  attributedGoals: number[];   // per window
  unattributedGoals: number[]; // per window
  doubleAttributed: number;    // must be 0 by construction — a self-check, published
}

function attribute(row: MatchRow): MatchCells {
  const byWindow: Record<string, CellCount>[] = [];
  const attributedGoals: number[] = [];
  const unattributedGoals: number[] = [];
  let doubleAttributed = 0;
  const goalsSorted = [...row.concededGoals].sort((a, b) => a.tSim - b.tSim);
  for (const W of WINDOWS_S) {
    const cells = emptyCells();
    for (const t of row.turnovers) cells[t.cell].n++;
    const used = new Array<boolean>(row.turnovers.length).fill(false);
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
        cells[row.turnovers[best].cell].k++;
        attributed++;
      }
    }
    /* the #218 CO-OCCURRENCE cross-cut: many-to-one, computed independently of `used`. */
    for (const t of row.turnovers) {
      if (goalsSorted.some((g) => g.conceding === t.loser && g.tSim >= t.tSim && g.tSim <= t.tSim + W)) {
        cells[t.cell].co++;
      }
    }
    byWindow.push(cells);
    attributedGoals.push(attributed);
    unattributedGoals.push(goalsSorted.length - attributed);
  }
  return {
    seed: row.seed, byWindow, turnoversTotal: row.turnovers.length,
    concededGoals: goalsSorted.length, attributedGoals, unattributedGoals, doubleAttributed,
  };
}

/* ========================================================================== */
/* §11 THE ESTIMATOR — cluster bootstrap by MATCH SEED (#20), the standing form */
/* ========================================================================== */
/** One shared resample-index matrix ⇒ every zone hazard and every zone DIFFERENCE is computed on
 *  the SAME resampled clusters (paired), deterministically, from the stats stream only. */
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
/* §12 N DERIVATION (the frozen §NRULE)                                        */
/* ========================================================================== */
const wall0 = Date.now();
const frozenNStar = (msPerMatch: number, msSource: string, eventsPerMatch: number, evSource: string) => {
  const nRaw = eventsPerMatch > 0 ? Math.ceil(TARGET_RAREST_ZONE_EVENTS / eventsPerMatch) : Number.NaN;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / N_STEP) * N_STEP : Number.NaN;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * ARMS_COUNT * XDET_FACTOR));
  const nStar = Math.min(nStepped, nWall, N_CAP);
  const binding = nStar === nStepped ? 'precision' : nStar === nWall ? 'wall' : 'seedBandCap';
  return {
    targetRarestZoneEvents: TARGET_RAREST_ZONE_EVENTS,
    rarestZoneEventsPerMatch: round(eventsPerMatch, 5), eventsSource: evSource,
    msPerMatch: round(msPerMatch, 3), msSource,
    nRaw, nStepped, nStep: N_STEP, nWall, nCap: N_CAP,
    nStar: Number.isFinite(nStar) ? nStar : null,
    bindingTerm: binding,
    projectedWallHours: Number.isFinite(nStar)
      ? round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 4) : null,
    arithmetic: `N* = min( ceil(${TARGET_RAREST_ZONE_EVENTS} / rarestZoneEventsPerMatch) ↑${N_STEP}, `
      + `floor(${WALL_BUDGET_HOURS} h / (ms/match × ${ARMS_COUNT} arm × ${XDET_FACTOR} X-DET)), ${N_CAP} ) `
      + '— frozen in the stage doc §NRULE BEFORE the smoke ran. The rarest-zone event is an '
      + 'ATTRIBUTED conceded goal in the RAREST of the three third-level zones at the PRIMARY '
      + 'window, i.e. the scarcest numerator the published table contains.',
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
  nRaw?: number;
  nStepped?: number;
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
      note: `SMOKE — N is FIXED by the stage doc at ${SMOKE_N} seeds (12,429,000..12,429,011). It `
        + 'publishes exactly TWO sizing numbers (ms/match, rarest-zone attributed goals/match) and '
        + 'ADJUDICATES NOTHING.',
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
    if (smoke.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof g === 'number' && g > 0) {
      msPerMatch = v; eventsPerMatch = g;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      evSource = 'the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N: exactly TWO numbers '
        + 'are read out of it, ms/match and the rarest third-level zone\'s attributed goals per '
        + 'match at the primary window. No hazard, share, CI, ordering or shape verdict is read '
        + 'from it anywhere.';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, eventsPerMatch, evSource);
  return {
    mode: 'full' as const, smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, envOverride: N_ENV, n: N_ENV ?? derived.nStar ?? 0,
  };
})();

if (MODE === 'full' && nDerivation.n <= 0) {
  console.error('DV-C0 FATAL — full mode needs the committed SMOKE artifact (or DVC0_N, which turns '
    + `gCleanInvocation RED). Run the smoke first: DVC0_MODE=smoke … → ${SMOKE_PATH}`);
  process.exit(2);
}

/** ⭐ G-CLEAN-INVOCATION: any DVC0_N / DVC0_CAP / DVC0_SKIP_FP is BY DEFINITION not the census —
 *  the run is routed onto the GUARD BLOCK, the gate goes RED and the process exits 1, so the
 *  census block stays VIRGIN and only a clean, rule-derived run can touch it. */
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
banner(`DV-C0 — THE LOSS-COST CENSUS (#245/#246/#247) · mode ${MODE} · N ${RUN_N} seeds × 1 arm`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
banner('world  ⭐ BARE PRODUCTION — new Match({seed, teamA, teamB}); no flag, no gene, no eye');
banner(`N rule ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
banner('FROZEN THIS RUN:');
banner(`  zones   thirds (LOSER frame, boundary ±HALF_L/3 = ±${round(THIRD_LOCAL_X, 4)} m)`
  + ` × bands (|y| ≤ HALF_W/3 = ${round(BAND_LOCAL_Y, 4)} m ⇒ central)`);
banner(`  windows PRIMARY ${PRIMARY_WINDOW_S}s (the #218 census's own) · sensitivity ${WINDOWS_S.join('/')}s`);
banner('  rule    NEAREST-IN-WINDOW greedy one-to-one attribution (frozen ex ante)');
banner('  ⭐ #246 SHAPE PREDICATES: hazard(own) > hazard(middle) > hazard(final), CI-resolved.');
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
  process.stderr.write(`  [dvc0 ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(3)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

/** the aggregate the X-DET digest is taken over (integers + the ledger, no wall clock). */
function aggregate(rows: MatchRow[]) {
  const cellsPerMatch = rows.map(attribute);
  const nClusters = rows.length;
  const boot = resampleMatrix(nClusters);

  const totalsFor = (wi: number, cellKeys: readonly string[]) => {
    let n = 0; let k = 0; let co = 0;
    for (const mc of cellsPerMatch) for (const c of cellKeys) {
      n += mc.byWindow[wi][c].n; k += mc.byWindow[wi][c].k; co += mc.byWindow[wi][c].co;
    }
    return { n, k, co };
  };
  /** per-cluster (num, den) vectors for a zone ⇒ ratio-of-sums bootstrap draws. */
  const drawsFor = (wi: number, cellKeys: readonly string[]): number[] => {
    const num = cellsPerMatch.map((mc) => sum(cellKeys.map((c) => mc.byWindow[wi][c].k)));
    const den = cellsPerMatch.map((mc) => sum(cellKeys.map((c) => mc.byWindow[wi][c].n)));
    return boot.map((idx) => {
      let a = 0; let b = 0;
      for (const i of idx) { a += num[i]; b += den[i]; }
      return b === 0 ? Number.NaN : a / b;
    });
  };
  const thirdKeys = (t: Third): readonly string[] => BANDS.map((b) => `${t}_${b}`);

  const zoneRow = (wi: number, label: string, keys: readonly string[]) => {
    const tot = totalsFor(wi, keys);
    const draws = drawsFor(wi, keys);
    return {
      zone: label,
      turnovers: tot.n,
      goalsAgainstAttributed: tot.k,
      hazard: shareOf(tot.k, tot.n),
      hazardCi95: ciOf(draws.filter((d) => Number.isFinite(d))),
      turnoversFollowedByGoalCoOccurrence: tot.co,
      coOccurrenceRate: shareOf(tot.co, tot.n),
    };
  };

  const table = WINDOWS_S.map((W, wi) => {
    const thirds = THIRDS.map((t) => zoneRow(wi, t, thirdKeys(t)));
    const cells = CELLS.map((c) => zoneRow(wi, c, [c]));
    const all = zoneRow(wi, 'all', CELLS);
    /* ⭐ THE #246 SHAPE PREDICATES — paired differences on the SAME resampled clusters. */
    const diff = (a: Third, b: Third) => {
      const da = drawsFor(wi, thirdKeys(a));
      const db = drawsFor(wi, thirdKeys(b));
      const d = da.map((x, i) => x - db[i]).filter((x) => Number.isFinite(x));
      const ci = ciOf(d);
      const pointA = thirds[THIRDS.indexOf(a)].hazard;
      const pointB = thirds[THIRDS.indexOf(b)].hazard;
      const point = round(pointA - pointB, 5);
      const verdict = ci[0] > 0 ? 'RESOLVED-CONFIRM' : ci[1] < 0 ? 'RESOLVED-INVERT' : 'UNRESOLVED';
      return { pair: `${a} − ${b}`, point, ci95: ci, verdict };
    };
    const ownVsMiddle = diff('own', 'middle');
    const middleVsFinal = diff('middle', 'final');
    const gradient = ownVsMiddle.verdict === 'RESOLVED-CONFIRM' && middleVsFinal.verdict === 'RESOLVED-CONFIRM'
      ? 'RESOLVED-CONFIRM'
      : (ownVsMiddle.verdict === 'RESOLVED-INVERT' || middleVsFinal.verdict === 'RESOLVED-INVERT')
        ? 'RESOLVED-INVERT' : 'UNRESOLVED';
    return {
      windowS: W,
      isPrimary: W === PRIMARY_WINDOW_S,
      all,
      byThird: thirds,
      byCell: cells,
      realityShape: {
        predicateSource: '⭐ #246, PRE-REGISTERED: real football\'s structure — own-third losses are '
          + 'the most dangerous, danger falls as the loss moves up the pitch, i.e. hazard rises '
          + 'toward one\'s OWN goal. SHAPES ONLY; no real-football NUMBER is imported (VISION §3).',
        ownVsMiddle, middleVsFinal,
        gradientTowardOwnGoal: gradient,
        routing: gradient === 'RESOLVED-INVERT'
          ? '⚠ AN INVERSION IS PUBLISHED HERE AND ROUTED TO THE 街机偏离 TEST (deliberate arcade '
            + 'trade-off vs defect) — it is NOT corrected into the table (#246).'
          : 'no inversion at this window; the routing clause is dormant.',
      },
    };
  });

  const primaryIdx = WINDOWS_S.indexOf(PRIMARY_WINDOW_S as (typeof WINDOWS_S)[number]);
  const primary = table[primaryIdx];

  /* --- ⭐ THE CONVERGENCE YARDSTICK: the exact JSON shape DV-T2 compares beliefs against ----- */
  const meanHazard = mean(primary.byThird.map((r) => r.hazard).filter((h) => Number.isFinite(h)));
  const yardstick = {
    schema: 'dv-c0.truth-table.v1',
    frozenBy: 'DV-C0, before any belief exists (#247). DV-T2 MAY NOT RE-CUT THIS SHAPE: a belief '
      + 'vector is compared to `zones` (absolute hazards), to `relative` (scale-free — the shape '
      + 'only), and to `ordering` (the rank vector), and to nothing else.',
    frame: 'the LOSING team\'s own attacking frame — "where did I lose it".',
    windowS: PRIMARY_WINDOW_S,
    zoning: {
      thirds: THIRDS,
      thirdBoundaryLocalX: round(THIRD_LOCAL_X, 6),
      bands: BANDS,
      bandBoundaryAbsY: round(BAND_LOCAL_Y, 6),
      cells: CELLS,
    },
    zones: Object.fromEntries(primary.byThird.map((r) => [r.zone, {
      hazard: r.hazard, ci95: r.hazardCi95, turnovers: r.turnovers, goalsAgainst: r.goalsAgainstAttributed,
    }])),
    cells: Object.fromEntries(primary.byCell.map((r) => [r.zone, {
      hazard: r.hazard, ci95: r.hazardCi95, turnovers: r.turnovers, goalsAgainst: r.goalsAgainstAttributed,
    }])),
    relative: Object.fromEntries(primary.byThird.map((r) => [r.zone,
      round(Number.isFinite(meanHazard) && meanHazard > 0 ? r.hazard / meanHazard : Number.NaN, 5)])),
    ordering: [...primary.byThird].sort((a, b) => b.hazard - a.hazard).map((r) => r.zone),
    baselineHazardAllZones: primary.all.hazard,
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
    turnoversInCellsPrimary: sum(cellsPerMatch.map((c) => sum(CELLS.map((k) => c.byWindow[primaryIdx][k].n)))),
    doubleAttributed: sum(cellsPerMatch.map((c) => c.doubleAttributed)),
    perWindow: WINDOWS_S.map((W, wi) => ({
      windowS: W,
      attributed: sum(cellsPerMatch.map((c) => c.attributedGoals[wi])),
      unattributed: sum(cellsPerMatch.map((c) => c.unattributedGoals[wi])),
      attributedInCells: sum(cellsPerMatch.map((c) => sum(CELLS.map((k) => c.byWindow[wi][k].k)))),
    })),
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

  return {
    matches: rows.length,
    simSecondsPerMatch: round(mean(rows.map((r) => r.simSeconds)), 4),
    turnoversPerMatch: round(mean(rows.map((r) => r.turnoversTotal)), 4),
    concededGoalsPerMatch: round(mean(cellsPerMatch.map((c) => c.concededGoals)), 4),
    table, yardstick, accounting, inherited,
    rarestZoneEventsPerMatch: round(
      Math.min(...primary.byThird.map((r) => r.goalsAgainstAttributed)) / Math.max(1, rows.length), 5,
    ),
  };
}
type Agg = ReturnType<typeof aggregate>;

interface Core { seeds: { base: number; n: number; first: number; last: number }; census: Agg }
function runCore(tag: string): Core {
  const seeds = Array.from({ length: RUN_N }, (_, k) => RUN_BASE + k);
  const rows: MatchRow[] = [];
  let done = 0;
  for (const seed of seeds) { rows.push(walkOne(seed)); done++; progress(tag, done, RUN_N); }
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
/* §15 G-REPRO-GGC — the inherited machinery proved against the census's OWN    */
/*     committed rows (a DELIBERATE re-walk; a receipt, never fresh data)       */
/* ========================================================================== */
const readJson = (p: string): { bytes: Buffer; j: Record<string, unknown> } | null => {
  if (!existsSync(p)) return null;
  const bytes = readFileSync(p);
  try { return { bytes, j: JSON.parse(bytes.toString('utf8')) as Record<string, unknown> }; }
  catch { return null; }
};
const GGC_SMOKE = readJson(GGC_SMOKE_PATH);
const GGC_FULL = readJson(GGC_FULL_PATH);

banner(`  [dvc0] G-REPRO-GGC: re-walking the census's OWN smoke block ${REPRO_GGC_BASE} (${REPRO_GGC_N} matches)...`);
const reproRows: MatchRow[] = [];
for (let i = 0; i < REPRO_GGC_N; i++) reproRows.push(walkOne(REPRO_GGC_BASE + i));
const reproAgg = aggregate(reproRows);

/* eslint-disable @typescript-eslint/no-explicit-any */
const gReproGgc = (() => {
  const want = GGC_SMOKE === null ? null : (GGC_SMOKE.j as any).result?.perArm?.PROD;
  const got = reproAgg.inherited;
  const checks: { field: string; want: number; got: number }[] = want === null ? [] : [
    { field: 'goalGenealogy.goals', want: want.goalGenealogy.goals, got: got.goals },
    ...ORIGIN_CLASSES.map((o) => ({
      field: `goalGenealogy.byOrigin.${o}`, want: want.goalGenealogy.byOrigin[o], got: got.byOrigin[o],
    })),
    ...ORIGIN_CLASSES.map((o) => ({
      field: `goalGenealogy.byOriginAtRegainSpot.${o}`,
      want: want.goalGenealogy.byOriginAtRegainSpot[o], got: got.byOriginAtRegainSpot[o],
    })),
    ...(['setPiece', 'restart', 'openPlay'] as const).map((f) => ({
      field: `goalGenealogy.byFamily.${f}`, want: want.goalGenealogy.byFamily[f], got: got.byFamily[f],
    })),
    ...(['own', 'middle', 'final', 'notARegain'] as const).map((t) => ({
      field: `goalGenealogy.byLossThird.${t}`, want: want.goalGenealogy.byLossThird[t], got: got.byLossThird[t],
    })),
    ...(['nonSetPiece', 'openPlayOriginOnly'] as const).flatMap((pool) => [
      {
        field: `goalGenealogy.constructedLadder.${pool}.pool`,
        want: want.goalGenealogy.constructedLadder[pool].pool,
        got: (got.constructedLadder as any)[pool].pool as number,
      },
      ...CONSTRUCTED_LADDER.map((k) => ({
        field: `goalGenealogy.constructedLadder.${pool}.ge${k}.constructed`,
        want: want.goalGenealogy.constructedLadder[pool].ladder[`ge${k}`].constructed,
        got: (got.constructedLadder as any)[pool].ladder[`ge${k}`].constructed as number,
      })),
    ]),
    ...ORIGIN_CLASSES.map((o) => ({
      field: `segmentPopulation.byOrigin.${o}`,
      want: want.segmentPopulation.byOrigin[o], got: got.segmentsByOrigin[o],
    })),
    {
      field: 'backThirdErrors.ownThirdTurnovers',
      want: want.backThirdErrors.ownThirdTurnovers, got: got.ownThirdTurnovers,
    },
    {
      field: 'backThirdErrors.atRegainSpot.ownThirdTurnovers',
      want: want.backThirdErrors.atRegainSpot.ownThirdTurnovers, got: got.ownThirdTurnoversAtRegainSpot,
    },
    {
      field: 'backThirdErrors.turnoversTotal (per-match × matches)',
      want: Math.round((want.backThirdErrors.turnoversPerMatch as number) * (want.matches as number)),
      got: got.turnoversTotal,
    },
    ...(['totalTicks', 'deadBallTicks', 'segmentTicks', 'looseGapTicks', 'assignedTicksSum',
      'goalsFromScore', 'goalsMappedToSegments'] as const).map((k) => ({
      field: `accounting.${k}`, want: want.accounting[k], got: (got.accountingTicks as any)[k] as number,
    })),
  ];
  const mismatches = checks.filter((c) => c.want !== c.got);
  return {
    pass: want !== null && mismatches.length === 0,
    block: `${REPRO_GGC_BASE}..${REPRO_GGC_BASE + REPRO_GGC_N - 1}`,
    source: GGC_SMOKE_PATH,
    sourceArm: 'PROD',
    sourceSha256: GGC_SMOKE === null ? null : createHash('sha256').update(GGC_SMOKE.bytes).digest('hex'),
    fieldsChecked: checks.length,
    mismatches: mismatches.length,
    mismatchRows: mismatches,
    note: '⭐ THE INHERITANCE, PROVED: this probe\'s walker IS the goal-genealogy census\'s, with its '
      + 'LOSS-TICK semantics (#215.3-H1/M2) verbatim. It re-walks the census\'s OWN committed SMOKE '
      + 'block in the census\'s OWN PROD world and must reproduce its published INTEGER rows exactly. '
      + 'The limbs DV-C0 does not read (pass LOCATION, own-third chains, the danger ladder, the '
      + 'regain cross-cut cells) are not lifted — the G-REPRO-173 precedent — and this gate is what '
      + 'proves the omission changes nothing on the columns that ARE read.',
  };
})();

/** gWindowTrace: the window family is READ off the census's committed artifact, never typed. */
const gWindowTrace = (() => {
  const fam = GGC_FULL === null ? null
    : ((GGC_FULL.j as any).frozenDesign?.definitions?.dangerWindowsS as number[] | undefined) ?? null;
  const famMin = fam === null || fam.length === 0 ? null : Math.min(...fam);
  const primaryInFamily = fam !== null && fam.includes(PRIMARY_WINDOW_S);
  const allMultiples = famMin === null ? false
    : WINDOWS_S.every((w) => w % famMin === 0 && w >= famMin);
  return {
    pass: primaryInFamily && allMultiples,
    source: GGC_FULL_PATH,
    sourceField: 'frozenDesign.definitions.dangerWindowsS',
    family: fam, familyMin: famMin,
    primaryWindowS: PRIMARY_WINDOW_S, primaryInFamily,
    windowsS: WINDOWS_S, allIntegerMultiplesOfFamilyMin: allMultiples,
    note: '⭐ THE WINDOW IS NOT TYPED AS A LEVEL: the PRIMARY window must be a MEMBER of the #218 '
      + 'census\'s own committed co-occurrence family, and every sensitivity window must be an '
      + 'integer multiple of that family\'s smallest member. Both are checked against the committed '
      + 'artifact at run time.',
  };
})();

/** gZoneTrace: every zoning constant is the pitch\'s own geometry, mechanically re-derived. */
const gZoneTrace = (() => {
  const thirdOk = THIRD_LOCAL_X === HALF_L / 3;
  const bandOk = BAND_LOCAL_Y === HALF_W / 3;
  return {
    pass: thirdOk && bandOk,
    thirdLocalX: round(THIRD_LOCAL_X, 6), thirdFormula: 'HALF_L / 3', thirdOk,
    bandAbsY: round(BAND_LOCAL_Y, 6), bandFormula: 'HALF_W / 3', bandOk,
    halfL: round(HALF_L, 6), halfW: round(HALF_W, 6),
    note: 'the third boundary is the #188 / PM-T1 OWN_THIRD_LOCAL_X inherited through the #214 '
      + 'census; the lateral band boundary is the SAME one-third rule applied to the pitch\'s own '
      + 'WIDTH constant. Both are DERIVED from src/sim/constants.ts at run time — neither is a '
      + 'typed metre value.',
  };
})();

/* ========================================================================== */
/* §16 THE REST OF THE GATES                                                   */
/* ========================================================================== */
let fpObserved = 'skipped';
let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fpObserved = 'skipped (preflight)'; } else {
  process.stderr.write('  [dvc0] X-FP-PROD: re-deriving the production fingerprint...\n');
  const league = new League({ seed: FINGERPRINT_SEED });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
  xFpProd = fpObserved === FINGERPRINT_BASELINE;
  process.stderr.write(`  [dvc0] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);
}

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + RUN_N - 1;
const gSeedDisjoint = (() => {
  const collide = (a: number, b: number): string[] => CONSUMED
    .filter((c) => !(b < c.range[0] || a > c.range[1])).map((c) => c.name);
  const walked = [
    { name: 'census walk (fresh)', first: firstSeed, last: lastSeed, kind: 'fresh' as const },
    { name: 'smoke block (reserved)', first: SMOKE_BASE, last: SMOKE_BASE + SMOKE_N - 1, kind: 'reserved' as const },
    { name: 'exit-semantics guard block (reserved)', first: GUARD_BLOCK[0], last: GUARD_BLOCK[1], kind: 'reserved' as const },
    { name: 'census block + reserve (reserved)', first: CENSUS_BASE, last: CENSUS_BASE + N_CAP - 1, kind: 'reserved' as const },
    { name: 'gWorld construction seed (never stepped)', first: RESERVED_BAND[1], last: RESERVED_BAND[1], kind: 'reserved' as const },
    { name: 'reproGgc (re-walk RECEIPT)', first: REPRO_GGC_BASE, last: REPRO_GGC_BASE + REPRO_GGC_N - 1, kind: 're-walk' as const },
  ].map((b) => {
    const ledgerCollisions = collide(b.first, b.last);
    /** ⭐ THE INVERTED PREDICATE for a re-walk: it MUST land inside a consumed interval — a
     *  clash-free re-walk would prove it is walking fresh seeds instead of reproducing a receipt. */
    const ok = b.kind === 're-walk' ? ledgerCollisions.length > 0 : ledgerCollisions.length === 0;
    return { ...b, seeds: b.last - b.first + 1, ledgerCollisions, ok };
  });
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  const routedCorrectly = CLEAN_INVOCATION
    ? (MODE === 'smoke' ? firstSeed === SMOKE_BASE : firstSeed === CENSUS_BASE)
    : (firstSeed >= GUARD_BLOCK[0] && lastSeed <= GUARD_BLOCK[1]);
  const ownOrdered = SMOKE_BASE + SMOKE_N - 1 < GUARD_BLOCK[0]
    && GUARD_BLOCK[1] < CENSUS_BASE
    && CENSUS_BASE + N_CAP - 1 < RESERVED_BAND[1];
  return {
    pass: walked.every((b) => b.ok) && inBand && routedCorrectly && ownOrdered,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, inBand, routedCorrectly,
    subBlocksOrdered: ownOrdered,
    walkedBlocks: walked,
    subBlocks: {
      smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
      guard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      census: `${CENSUS_BASE}..${CENSUS_BASE + N_CAP - 1}`,
      censusN: RUN_N,
      gWorldConstructionSeed: RESERVED_BAND[1],
    },
    freshnessNote: `⭐ #163: this stage's band opens at ${RESERVED_BAND[0]}, strictly above everything `
      + 'the programme has consumed — DLC-T1s\'s battery + reserve ran to 12,428,899 and its '
      + 'test-seed band to 12,428,906.',
    reproNote: 'the ONE re-walk block (GGC smoke) is a DELIBERATE receipt, so its predicate is '
      + 'INVERTED: it must COLLIDE with the ledger. Every other block carries the ordinary '
      + 'predicate (collision-free), and the sub-blocks are ordered and disjoint from each other.',
    gWorldSeedNote: `gWorld CONSTRUCTS one match at ${RESERVED_BAND[1]} and NEVER STEPS IT — no match `
      + 'RNG is drawn from that seed, and it is inside this stage\'s own reserved band.',
    consumedLedger: CONSUMED,
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

/** gWorld: the arm is BARE PRODUCTION, read back off a freshly built (never stepped) match. */
const gWorld = (() => {
  const m = matchFor(RESERVED_BAND[1]);
  const flagKeys = Object.keys(MT_WORLD_FLAGS) as (keyof typeof MT_WORLD_FLAGS)[];
  const mm = m as unknown as Record<string, unknown>;
  const noMtFlags = flagKeys.every((k) => mm[k] !== true);
  const OTHER_FLAGS = ['dlcStrikePlane', 'dlcDeliveryChoice', 'obmMovement', 'ptpPassToPath',
    'ctbCheckToBall', 'pmPhaseModulation', 'mtMarkTightness', 'dvDeliveryValue'] as const;
  const noStageFlags = OTHER_FLAGS.every((k) => mm[k] !== true);
  const views = ([0, 1] as const).flatMap((s) => [
    m.teams[s].info.genome, m.teams[s].baseGenome, m.teams[s].effGenome,
  ] as unknown as Record<string, unknown>[]);
  const GENE_KEYS = ['defLaneConvergence', 'markSag', 'passLeadSupport', 'obmMoveWeights',
    'ctbSupportPlane', 'dlcStrikePlaneGene'] as const;
  const genesAbsent = views.every((g) => GENE_KEYS.every((k) => g[k] === undefined));
  const eyeNull = m.stationEye === null;
  const readback = mtArmedVersion(m) === 0;
  return {
    pass: noMtFlags && noStageFlags && genesAbsent && eyeNull && readback,
    noMtFlags, noStageFlags, genesAbsent, eyeNull, readback,
    genomeViewsChecked: views.length,
    mtFlagKeys: flagKeys, otherFlagKeys: OTHER_FLAGS, geneKeysChecked: GENE_KEYS,
    constructionSeed: RESERVED_BAND[1],
    note: '⭐ THE WORLD WHOSE PRICES GROUND EVERYTHING is the SHIPPED game: `new Match({seed, teamA, '
      + 'teamB})` with nothing else written. Read back on a freshly constructed, NEVER-STEPPED match: '
      + 'no MT consumption flag, no banked stage flag, no seam gene on ANY of the six genome views, '
      + 'stationEye null, and the engine-side mtArmedVersion readback 0.',
  };
})();

/** gAccounting: the identities — every turnover in exactly one zone, every goal 0-or-1 turnovers. */
const gAccounting = (() => {
  const a = coreA.census.accounting;
  const ticksIdentity = a.deadBallTicks + a.segmentTicks + a.looseGapTicks === a.totalTicks;
  const noOverlap = a.assignedTicksSum === a.segmentTicks;
  const ordered = a.spanOrderViolations === 0;
  const goalsIdentity = a.concededGoals === a.goalsFromScore;
  const turnoverPartition = a.turnoversTotal === a.turnoversLedgered
    && a.turnoversLedgered === a.turnoversInCellsPrimary;
  const oneToOne = a.doubleAttributed === 0;
  const windowIdentity = a.perWindow.every((w) => w.attributed + w.unattributed === a.concededGoals
    && w.attributed === w.attributedInCells);
  const monotone = a.perWindow.every((w, i) => i === 0 || w.attributed >= a.perWindow[i - 1].attributed);
  return {
    pass: ticksIdentity && noOverlap && ordered && goalsIdentity && turnoverPartition && oneToOne
      && windowIdentity && monotone,
    ticksIdentity, noOverlap, spansOrdered: ordered, goalsIdentity, turnoverPartition, oneToOne,
    windowIdentity, attributedMonotoneInWindow: monotone,
    ...a,
    identity: '⭐ (i) every tick is in EXACTLY ONE of {segment · loose interval · dead ball} and the '
      + 'spans are ordered and non-overlapping (the #214 identity, inherited); (ii) EVERY turnover '
      + 'is classified into EXACTLY ONE zone cell (total = ledgered = summed over the six cells); '
      + '(iii) EVERY conceded goal is attributed to EXACTLY ONE-OR-ZERO turnovers by the frozen '
      + 'nearest-in-window rule (attributed + unattributed = conceded, at EVERY window, and no '
      + 'turnover carries two goals); (iv) attribution is MONOTONE in the window, which is a '
      + 'mechanical consequence of the rule and is checked rather than assumed.',
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
    note: 'INSTRUMENT-ONLY: this stage adds ZERO src/** — the contract\'s DV-C0 clause ("No src change").',
  },
  gReproGgc,
  gWindowTrace,
  gZoneTrace,
  gWorld,
  gSeedDisjoint,
  gStatsDisjoint: {
    pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap,
    resamples: BOOTSTRAP_RESAMPLES, cluster: 'match seed (#20)',
    publishedScope: 'DLC-T1s\'s COMPLETE ≥91,100-regime ledger + its own base 105,800. Pre-regime '
      + 'bases (90,730, the 50xxx family) are ≥ 13,000 away and cannot move the minimum.',
  },
  gCleanInvocation: {
    pass: CLEAN_INVOCATION,
    envN: N_ENV, capped: IS_CAPPED, skipFp: SKIP_FP,
    routedToGuardBlock: !CLEAN_INVOCATION,
    guardBlock: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
    note: 'any DVC0_N / DVC0_CAP / DVC0_SKIP_FP override is BY DEFINITION not the census: the run is '
      + 'routed onto the exit-semantics guard block, this gate goes RED and the process exits 1, so '
      + 'the census block stays VIRGIN.',
  },
  gNDerived: {
    pass: MODE === 'smoke' ? N_ENV === null : (N_ENV === null && RUN_N === nDerivation.nStar),
    ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, envOverride: N_ENV,
    note: 'in FULL mode the N run must BE the frozen §NRULE output; DVC0_N is accepted in NO mode.',
  },
  gAccounting,
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §17 ARTIFACT                                                                */
/* ========================================================================== */
const msPerMatchMeasured = passMs / Math.max(1, RUN_N * ARMS_COUNT);
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  rarestZoneEventsPerMatch: coreA.census.rarestZoneEventsPerMatch,
  turnoversPerMatch: coreA.census.turnoversPerMatch,
  concededGoalsPerMatch: coreA.census.concededGoalsPerMatch,
  provenance: MODE === 'smoke'
    ? 'THE SMOKE\'S TWO SIZING NUMBERS — ms/match and the RAREST third-level zone\'s attributed '
      + 'goals per match at the primary window. These are the ONLY numbers a FULL run reads out of '
      + 'this artifact, and they feed ONLY N. THE SMOKE ADJUDICATES NOTHING.'
    : 'POST-HOC on this FULL run — it selected nothing (N came from the frozen rule on the SMOKE\'s '
      + 'two numbers). Reported so the smoke\'s estimate can be checked against reality.',
};

const verdict = !allGatesPass ? 'GATES RED — the measurement is invalid'
  : MODE === 'smoke' ? 'SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING'
    : `DV-C0 LOSS-COST CENSUS at N=${RUN_N} × 1 arm (production) — gate-green. THE TABLE IS `
      + 'DESCRIPTIVE TRUTH: the #246 shape flags are mechanical and the commander adjudicates them.';

const body = {
  stage: 'DV-C0 — THE LOSS-COST CENSUS (the TRUE TABLE: turnover → goal-against hazard by zone)',
  doc: 'docs/world-model/DV-C0-LOSS-COST-CENSUS.md',
  contract: 'docs/world-model/DELIVERY-VALUE-CONTRACT.md §3 DV-C0 (+ the #246 amendment, + #247)',
  ruling: '#245 (the contract) · #246 (the reality-shape amendment) · #247 (truth/belief split) · '
    + '#248 (the earned-knowledge ledger — DV is the pilot)',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  frozenDesign: {
    world: '⭐ BARE PRODUCTION — `new Match({seed, teamA, teamB})`, the SHIPPED game. No flag, no '
      + 'gene, no eye. This is the world whose prices ground everything (gWorld reads it back).',
    measuredQuantity: 'for EVERY team-level turnover — the goal-genealogy census\'s own definition, '
      + 'inherited VERBATIM with its LOSS-TICK semantics (#215.3-H1: the turnover POSITION is the '
      + 'ball at the LOSING team\'s LAST-CONTROLLED tick) — does the CONCEDING side concede a goal '
      + 'within W sim-seconds of the loss, attributed cleanly by the frozen nearest-in-window rule?',
    turnoverDefinition: 'INHERITED VERBATIM (#214 §3.1 / #215.3): a possession segment is a maximal '
      + 'interval of same-owner-TEAM control while phase === "playing", suspended while the ball is '
      + 'loose in play; a TURNOVER is a segment that ends with terminator "opponentControl". The '
      + 'event is STAMPED at the tick the opponent establishes control (the census\'s own stamp) and '
      + 'its POSITION is read at the segment\'s LAST OWNED tick.',
    zoning: {
      frame: '⭐ THE LOSER\'S OWN ATTACKING FRAME — "where did I lose it". own third = the losing '
        + 'team\'s own defensive third. ⚠ This is the MIRROR of the #214 census\'s origin classes, '
        + 'which name thirds in the WINNER\'s frame (turnoverWonInFinalThird = a loss in the loser\'s '
        + 'own third). Both frames are exact mirrors; DV-C0 states its frame explicitly because the '
        + 'PRICE belongs to the team that pays it.',
      thirds: THIRDS,
      thirdBoundaryLocalX: round(THIRD_LOCAL_X, 6),
      thirdBoundaryTrace: 'HALF_L / 3 — the #188 / PM-T1 OWN_THIRD_LOCAL_X, inherited through #214.',
      bands: BANDS,
      bandBoundaryAbsY: round(BAND_LOCAL_Y, 6),
      bandBoundaryTrace: 'HALF_W / 3 — the SAME one-third rule applied to the pitch\'s own WIDTH '
        + 'constant (the width-axis ANALOGUE; declared as a zoning choice, frozen ex ante). The '
        + 'pitch is symmetric about y = 0, so |y| needs no frame mirror.',
      cells: CELLS,
      primaryTable: 'THIRDS (three zones). The six third × band cells are the SECONDARY table.',
    },
    windows: {
      primaryWindowS: PRIMARY_WINDOW_S,
      windowsS: WINDOWS_S,
      trace: gWindowTrace,
      note: '⭐ PRE-REGISTERED: the primary window is the #218 census\'s own 10 s co-occurrence '
        + 'window, and the sensitivity ladder is integer multiples of that family\'s 5 s member, so '
        + 'the table\'s WINDOW-DEPENDENCE is visible rather than hidden behind one choice.',
    },
    attributionRule: '⭐ FROZEN EX ANTE — NEAREST-IN-WINDOW, GREEDY, ONE-TO-ONE: conceded goals are '
      + 'processed chronologically; a goal conceded by T at t_g is attributed to the LATEST not-yet-'
      + 'attributed turnover by T with loss stamp in [t_g − W, t_g] (ties → earliest index); if none '
      + 'exists the goal is UNATTRIBUTED. Every goal therefore maps to exactly one-or-zero turnovers '
      + 'and every turnover carries at most one goal. The #218 CO-OCCURRENCE reading (many-to-one) '
      + 'is published beside every cell as the declared cross-cut.',
    estimator: `cluster bootstrap by MATCH SEED (#20), ${BOOTSTRAP_RESAMPLES} resamples, percentile `
      + '95 % CI, ratio-of-sums per zone. ⭐ ONE SHARED resample-index matrix, so every zone hazard '
      + 'and every zone DIFFERENCE (the #246 shape predicates) is computed on the SAME resampled '
      + `clusters. Stats stream base ${BOOTSTRAP_SEED}, disjoint from the match RNG (#163).`,
    realityShapePredicates: '⭐ #246, PRE-REGISTERED BEFORE ANY RUN: (1) hazard(own third) > '
      + 'hazard(middle third); (2) hazard(middle third) > hazard(final third); (3) the GRADIENT — '
      + 'both together, i.e. hazard rising toward one\'s own goal. Each is resolved by the paired '
      + 'cluster-bootstrap CI of the DIFFERENCE excluding zero. ⚠ AN INVERSION IS A FINDING, NOT AN '
      + 'ERROR: it is PUBLISHED and routed to the 街机偏离 test (deliberate arcade trade-off vs '
      + 'defect) and is NEVER corrected into the table. MAGNITUDES are OUR world\'s and are supposed '
      + 'to be; only the SHAPE is the fidelity check.',
    truthBeliefSplit: '⭐⭐ #247: this table is INSTRUMENT-SIDE TRUTH. It grounds DV-T1\'s hand doses '
      + 'and it is the YARDSTICK against which DV-T2 measures belief convergence. It is NOT wired '
      + 'into any player\'s head — no player is born knowing it, and #248 names this arc as the '
      + 'pilot for the whole earned-knowledge ledger.',
    seedLedger: gSeedDisjoint,
    statsBase: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed', minGap: statsMinGap },
    nRule: nDerivation,
  },
  referenceShapes: {
    houseLaw: '⭐⭐ SHAPES ONLY, AND THEY REACH NO SIM VALUE (VISION §3): 常数永不进口. No '
      + 'real-football NUMBER appears in this probe; the #246 comparison is an ORDERING.',
    axis: 'that losing the ball near your own goal is more expensive than losing it near theirs, and '
      + 'that the cost falls as the loss moves up the pitch, is the standard structure of real '
      + 'football\'s risk sense — the SHAPE #246 cites.',
    scaleCaveat: '⚠ this world is 6v6 on a 0.70-scaled pitch with 240 sim-seconds mapped to 90 '
      + 'display-minutes. MAGNITUDES DO NOT TRANSFER and are not supposed to (#246): only the '
      + 'ordering is compared.',
  },
  result: { seeds: coreA.seeds, census: coreA.census },
  gates,
  allGatesPass,
  deviations: [
    'A TOUCH / OWNERSHIP EPISODE IS NOT A FOOT-BALL CONTACT (inherited from the #170 tempo census '
      + 'through #214): Match exposes ball.owner, not a contact event. Everything here is derived '
      + 'from observable state, which is what X-SRC-UNTOUCHED requires.',
    '⭐ THE TURNOVER EVENT CARRIES TWO TICKS AND THIS PROBE USES BOTH AS THE CENSUS DOES: the '
      + 'POSITION is read at the LAST OWNED tick (#215.3-H1) and the TIME is stamped at the tick the '
      + 'opponent establishes control (the census\'s own stamp for the same event). The gap between '
      + 'them is the #215 wedge and is a real property of the world, not a defect.',
    '⭐ THE LATERAL BAND IS AN ANALOGUE, NOT AN INHERITANCE: HALF_L/3 is a traced, twice-inherited '
      + 'constant; HALF_W/3 is the same one-third rule applied to the width constant, chosen ex ante '
      + 'by this stage. It enters the SECONDARY table only — the primary table and every #246 '
      + 'predicate are on THIRDS alone.',
    'THE HAZARD IS A CONDITIONAL RATE, NOT A CAUSAL EFFECT. "Goal against within W of a loss here" '
      + 'is temporal attribution under a frozen rule; no counterfactual is claimed, and losses are '
      + 'not randomly assigned to zones (a team that loses it in its own third is in a different '
      + 'state from one that loses it in the final third — the state is part of the price).',
    'THE ATTRIBUTION RULE IS A RULE, NOT A TRUTH. A goal 9 s after a midfield loss and 2 s after an '
      + 'own-third loss is credited to the own-third loss; a different rule would move it. The rule '
      + 'is frozen ex ante, the CO-OCCURRENCE cross-cut is published beside every cell, and the '
      + 'whole table is republished at four windows so the reader can see how much the choice moves.',
    'SINGLE ARM, NO PAIRING. This is a CENSUS, not a contrast: there is no treatment, no control and '
      + 'no A/B predicate anywhere in this stage.',
    'NO CHECKPOINT/RESUME: the census is a few minutes; a kill costs the run. Stated, not hidden.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, no flag and '
      + 'no gene written anywhere.',
    '⭐⭐ THE TABLE IS NOT WIRED INTO ANY PLAYER (#247). It is instrument-side truth: it grounds '
      + 'DV-T1\'s hand doses and yardsticks DV-T2\'s belief convergence. No chooser reads it, now or '
      + 'as a consequence of this stage.',
    'NO PASS/FAIL ON ANY MEASURED HAZARD. The gates are the X-family, the inheritance receipt, the '
      + 'trace gates and the ACCOUNTING identities. The #246 shape flags are MECHANICAL CI readings, '
      + 'not gates: an inversion turns nothing red and is routed, not corrected.',
    'THE WINDOW LADDER IS A REPORTING GRID. No window is privileged beyond the pre-registered '
      + 'primary, and none is tunable after sight.',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). DV-T0/T1/T2 are the contract\'s.',
  ],
  verdict,
};

const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
/** the SECOND limb of the canonical-write guard, at the write itself. */
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error(`DV-C0 FATAL — refusing to write a PREFLIGHT artifact to the canonical path ${OUT_PATH} `
    + `(resolved: ${pathResolve(OUT_PATH)}; preflight because: ${PREFLIGHT_REASONS.join(' + ')}).`);
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
    rule: 'ANY skip/preflight lever (DVC0_CAP or DVC0_SKIP_FP) makes the run a PREFLIGHT regardless '
      + 'of N, a preflight may NEVER write a canonical repo path (guarded at parse time AND again at '
      + 'write time, on the RESOLVED absolute path with a separator-aware prefix test so `..` '
      + 'traversal spellings cannot slip past), and the skip is recorded here and in gates.xFpProd.',
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
o(`=== DV-C0 LOSS-COST CENSUS — ${MODE} — HEAD ${head} — ${RUN_N} seeds (production), `
  + `block ${firstSeed}..${lastSeed} ===`);
o('');
o(`turnovers/match ${coreA.census.turnoversPerMatch} · conceded goals/match ${coreA.census.concededGoalsPerMatch}`);
o('');
for (const w of coreA.census.table) {
  o(`⭐ WINDOW ${w.windowS}s${w.isPrimary ? '  (PRIMARY — the #218 census\'s own)' : ''}`);
  o('   zone      turnovers   goalsAgainst   hazard        CI95                     co-occurrence');
  for (const r of [...w.byThird, w.all]) {
    o(`   ${r.zone.padEnd(9)} ${String(r.turnovers).padStart(9)}   ${String(r.goalsAgainstAttributed).padStart(12)}`
      + `   ${pct(r.hazard).padStart(10)}   [${pct(r.hazardCi95[0])}, ${pct(r.hazardCi95[1])}]`.padEnd(28)
      + `   ${pct(r.coOccurrenceRate)}`);
  }
  const s = w.realityShape;
  o(`   #246 SHAPE: own−middle ${pct(s.ownVsMiddle.point)} [${pct(s.ownVsMiddle.ci95[0])}, `
    + `${pct(s.ownVsMiddle.ci95[1])}] ⇒ ${s.ownVsMiddle.verdict}`);
  o(`               middle−final ${pct(s.middleVsFinal.point)} [${pct(s.middleVsFinal.ci95[0])}, `
    + `${pct(s.middleVsFinal.ci95[1])}] ⇒ ${s.middleVsFinal.verdict}`);
  o(`               GRADIENT toward own goal ⇒ ${s.gradientTowardOwnGoal}`);
  o('');
}
o('SECONDARY (third × band) at the PRIMARY window:');
for (const r of coreA.census.table.find((t) => t.isPrimary)?.byCell ?? []) {
  o(`   ${r.zone.padEnd(15)} n ${String(r.turnovers).padStart(6)} · k ${String(r.goalsAgainstAttributed).padStart(4)}`
    + ` · hazard ${pct(r.hazard)} [${pct(r.hazardCi95[0])}, ${pct(r.hazardCi95[1])}]`);
}
o('');
o(`⭐ CONVERGENCE YARDSTICK (${coreA.census.yardstick.schema}) ordering: `
  + `${coreA.census.yardstick.ordering.join(' > ')} · relative `
  + JSON.stringify(coreA.census.yardstick.relative));
o('');
o(`GATES ${allGatesPass ? 'GREEN' : '*** RED ***'}: `
  + Object.entries(gates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`  G-REPRO-GGC ${gReproGgc.fieldsChecked} fields · ${gReproGgc.mismatches} mismatches · block ${gReproGgc.block}`);
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s · ${round(msPerMatchMeasured, 1)} ms/match`
  + ` · rarest-zone events/match ${sizingOut.rarestZoneEventsPerMatch} · artifact ${OUT_PATH}`);
o(`VERDICT: ${verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!allGatesPass) process.exit(1);
process.exit(0);
