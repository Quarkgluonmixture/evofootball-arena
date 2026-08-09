/**
 * THE GOAL-GENEALOGY CENSUS — commander ruling #214 (the user ruled 甲 on the #213.3 fork).
 *
 * Authority: docs/world-model/GOAL-GENEALOGY-CENSUS.md (the FROZEN pre-registration, which
 * ELABORATES and NEVER re-cuts #214) + #213 (the user's three play-test observations, which
 * are HYPOTHESES until instrumented) + the #170–#173 TEMPO CENSUS form (descriptive absolute
 * ruler; X-family gates only; the commander adjudicates the gap table) + #203 (per-arm rows)
 * + #181.2 / #194 / #196 / #197 / #198 (receipts; head OUTSIDE the hashed body; hashes
 * computed in-probe; no doc-typed numbers) + #163 (stats bases stream-disjoint, gaps ≥ 200)
 * + #128 (wall measured OUTSIDE the X-DET-compared core) + VISION §3 (reference SHAPES may
 * be cited, CONSTANTS ARE NEVER IMPORTED).
 *
 * WHAT THIS IS: the BUILD-UP arc's phase-0 GAP TABLE. Three arms — the world the user plays
 * and the two MT play-test worlds he just watched — censused on three frozen quantities:
 *   (a) ⭐ GOAL GENEALOGY: every goal traced to its possession segment's ORIGIN and to that
 *       segment's CONSTRUCTION, with the constructed-vs-transition split reported at a
 *       THRESHOLD LADDER (≥3 / ≥4 / ≥5 completed passes — no single N to game) and the
 *       set-piece share reported separately;
 *   (b) 后场倒脚: own-third pass share, the lateral/backward share of those passes, own-third
 *       pass chains per possession, own-third time share;
 *   (c) 后场失误: own-third turnovers per match and the DANGEROUS subset (an opponent shot /
 *       goal within {5 s, 10 s} — a temporal co-occurrence, never a causal claim).
 *
 * ⭐ ZERO src/** (X-SRC-ZERO HARD). Everything is a TICK-WALK over observable match state,
 * extending the tempo census's own possession/spell machinery. #214.2 forbids a telemetry
 * hook; none was needed.
 *
 * ⭐ NO DOSE, NO FLAG AND NO WORLD IS TYPED HERE. The two MT arms are armed by calling
 * `a4MatchFlags` / `armA4World` from src/game/a4World.ts — the same functions GameApp calls
 * — so the censused world IS the world the user played, by construction. `gArm` reads the
 * built matches back and asserts the full #196.3-D4 checklist on both.
 *
 * ⭐⭐ NO PASS/FAIL ON ANY MEASURED QUANTITY. The gates are the X-family plus a segmentation-
 * ACCOUNTING identity. The ladder thresholds are a REPORTING GRID. The commander adjudicates.
 *
 * MODES (explicit GGC_MODE, NO default):
 *   smoke — plumbing + exactly TWO sizing numbers (ms/match, min goals/match). ADJUDICATES NOTHING.
 *   full  — the census at the frozen rule's N (read off the committed smoke artifact).
 *
 * COMMANDS (stage doc §6):
 *   GGC_MODE=smoke npx tsx scripts/probes/goal-genealogy-census.ts
 *   GGC_MODE=full  npx tsx scripts/probes/goal-genealogy-census.ts
 *   GGC_MODE=smoke GGC_CAP=2 GGC_SKIP_FP=1 GGC_OUT=/tmp/ggc.json npx tsx …   (preflight)
 * EXIT: 0 = clean census · 1 = X-family invalid · 2 = usage/fatal.
 *
 * ⚠ #215.3 FIX ROUND (five corrections, marked in place, old claims left readable):
 *   H1+M2 the loss spot is the LAST OWNED tick for both the 后场失误 count and the by-third
 *         origin classes; the regain-tick reading is published beside it (the WEDGE);
 *   M3    GGC_CAP *or* GGC_SKIP_FP ⇒ PREFLIGHT ⇒ never a canonical artifact path;
 *   L4    the published stats-base ledger is complete;
 *   L5    matchOpenFallback split out of restartSecondBall.
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  MT_WORLD_ARM, MT_WORLD_DOSE, MT_WORLD_FLAGS, a4MatchFlags, armA4World, mtArmedVersion,
  type MtWorldVersion,
} from '../../src/game/a4World';

/* ========================================================================== */
/* §1 ARMS — the live entry worlds, armed the way the app arms them            */
/* ========================================================================== */
const ARMS = ['PROD', 'MT02', 'MT08'] as const;
type Arm = (typeof ARMS)[number];
const ARMS_COUNT = ARMS.length;
/** arm → the a4World version it IS (null = production). No dose is typed anywhere. */
const ARM_VERSION: Readonly<Record<Arm, MtWorldVersion | null>> = {
  PROD: null, MT02: 4, MT08: 5,
};

/* ========================================================================== */
/* §2 FROZEN INSTRUMENT CONSTANTS — every one of them TRACED                   */
/* ========================================================================== */
/** Third boundary in the frame team's LOCAL x — the #188 / PM-T1 `OWN_THIRD_LOCAL_X`,
 *  inherited verbatim (`-HALF_L / 3`), mirrored for the final third. */
const THIRD_LOCAL_X = HALF_L / 3;
/** ⭐ THE ENGINE'S OWN "FORWARD" PREDICATE, TRACED — src/sim/mechanics.ts:406 (and :497,
 *  :624, :644): `if (team.localX(mate.pos.x) - team.localX(passer.pos.x) > 2)
 *  team.stats.passesForward++`. The 2 m is the substrate's own definition of a forward
 *  pass; this probe applies THE SAME predicate to the observed origin → destination of a
 *  COMPLETED pass (the declared population difference, stage doc §7.2). */
const FORWARD_MIN_DX_M = 2;
/** The DANGEROUS-turnover ladder, in SIM-SECONDS on `match.simTime` (#214.1c). */
const DANGER_WINDOWS_S = [5, 10] as const;
/** ⭐ THE CONSTRUCTION LADDER (#214.1a) — a REPORTING GRID, gates nothing, no N privileged. */
const CONSTRUCTED_LADDER = [3, 4, 5] as const;

/* --- §3 the seed ledger ------------------------------------------------------ */
const RESERVED_BAND: readonly [number, number] = [12_421_000, 12_421_999];
const SMOKE_BASE = 12_421_000;
const SMOKE_N = 12;
/** Stepped ONLY to prove a full-mode GGC_N override turns gNDerived RED and exits 1. */
const EXIT_CHECK_BLOCK: readonly [number, number] = [12_421_050, 12_421_099];
const FULL_BASE = 12_421_100;
/** Honest hard cap = the reserved battery block 12,421,100..12,421,999. A SEED-BUDGET cap. */
const N_CAP = 900;
const N_STEP = 25;
/** Every block the arc has consumed (the MT-LADDER ledger carried forward + its own band). */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing', range: [12_310_000, 12_310_199] },
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
];
/** §4.2 the stats stream — a SEPARATE namespace. MT-LADDER's base was 104,200 ⇒ the next
 *  legal base under the #163 200-floor is 104,400 (the #214.2 dispatch's own floor). */
const BOOTSTRAP_SEED = 104_400;
const BOOTSTRAP_RESAMPLES = 2000;
/** ⚠ CORRECTION (#215.3-L4 — the #215 verify found NINE bases missing from the ledger the
 *  #214 probe shipped, which began at 101,403). The ledger below is now the COMPLETE stats
 *  namespace: every base DECLARED anywhere under scripts/** — spent bases and
 *  reserved-unused ones alike — re-derived by reading the other probes, in the tempo census's
 *  own CONSUMED_STATS form (which also lists reserved seeds). The gate RESULT is unchanged:
 *  the nearest base to 104,400 is still 104,200 ⇒ minGap 200 = the #163 floor. */
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200,
];

/* --- §4.3 THE N ARITHMETIC, frozen ex ante ---------------------------------- */
/** ⭐ THE SIZING TARGET: goals per arm. Every genealogy row is a share OF GOALS, so the
 *  precision that matters is the goal count, not the match count. 600 goals ⇒ a binomial
 *  share's worst-case SE = sqrt(0.25/600) = 0.0204 — ±2 pp at one sigma. */
const TARGET_GOALS_PER_ARM = 600;
const WALL_BUDGET_HOURS = 0.5;
const XDET_FACTOR = 2;
/** The PRIOR ms/match used when no committed smoke artifact exists yet (the PM-T1 form) —
 *  MT-LADDER's own published smoke cost. Superseded by the smoke artifact the moment it exists. */
const PRIOR_MS_PER_MATCH = 113.4;

/* --- the X-family pins ------------------------------------------------------ */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/** CITED, NEVER RE-RUN AND NEVER READ FOR A LEVEL (#181.2): the tempo census's committed
 *  artifact is the repo home of band B3 (passes per open-play sequence). Its BYTES are
 *  hashed so the citation is auditable; no number is read out of it. */
const TEMPO_ARTIFACT = 'docs/world-model/data/tempo-census.json';

/* ========================================================================== */
/* §5 ENV / MODE                                                              */
/* ========================================================================== */
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.GGC_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`GOAL-GENEALOGY FATAL — GGC_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const CAP = process.env.GGC_CAP ? Math.max(1, Number.parseInt(process.env.GGC_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_CAPPED = Number.isFinite(CAP);
const SKIP_FP = process.env.GGC_SKIP_FP === '1';
/** ⚠ CORRECTION (#215.3-M3 — the gate-bypass hole the #215 verify found). The #214 probe made
 *  a run "preflight" on the CAP alone, so `GGC_SKIP_FP=1` on an UNCAPPED run passed xFpProd as
 *  "skipped" AND was allowed to write the CANONICAL artifact path. ⭐ ANY skip/preflight lever
 *  now makes the run a preflight REGARDLESS of cap, and a preflight can never write a canonical
 *  path ⇒ a canonical-path artifact ALWAYS carries a genuinely re-derived xFpProd. */
const IS_PREFLIGHT = IS_CAPPED || SKIP_FP;
const PREFLIGHT_REASONS = [IS_CAPPED ? `GGC_CAP=${CAP}` : null, SKIP_FP ? 'GGC_SKIP_FP=1' : null]
  .filter((r): r is string => r !== null);
const N_ENV = process.env.GGC_N ? Math.max(1, Number.parseInt(process.env.GGC_N, 10)) : null;

const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/goal-genealogy-census-smoke.json',
  full: 'docs/world-model/data/goal-genealogy-census.json',
};
const SMOKE_PATH = OUT_BY_MODE.smoke;
const CANONICAL_DIR = 'docs/world-model/data/';
/** the canonical-path test, applied to the RESOLVED write path (absolute or relative). */
const isCanonicalPath = (p: string): boolean => p.includes(CANONICAL_DIR);
/** ⭐ a preflight NEVER defaults onto a canonical path: /tmp, with a -preflight suffix. */
const OUT_PATH = process.env.GGC_OUT ?? (IS_PREFLIGHT ? '/tmp/goal-genealogy-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('GOAL-GENEALOGY FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}. `
    + 'Pass GGC_OUT=/tmp/… , or drop GGC_CAP / GGC_SKIP_FP to run the real thing.');
  process.exit(2);
}

/* ========================================================================== */
/* §6 numeric helpers (the house forms)                                       */
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
/** Deterministic percentile bootstrap CI of a mean (STATS stream, never the match RNG). */
const bootstrapCi = (xs: readonly number[], seed: number): [number, number] => {
  if (xs.length < 2) return [Number.NaN, Number.NaN];
  const rng = new Rng(seed);
  const means: number[] = [];
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    let s = 0;
    for (let i = 0; i < xs.length; i++) s += xs[Math.floor(rng.next() * xs.length) % xs.length];
    means.push(s / xs.length);
  }
  means.sort((a, b) => a - b);
  return [round(quantileSorted(means, 0.025), 4), round(quantileSorted(means, 0.975), 4)];
};
const distOf = (xs: readonly number[]) => {
  const sorted = [...xs].sort((a, b) => a - b);
  return {
    n: xs.length,
    mean: round(mean(xs), 4),
    p25: round(quantileSorted(sorted, 0.25), 4),
    median: round(quantileSorted(sorted, 0.5), 4),
    p75: round(quantileSorted(sorted, 0.75), 4),
    p90: round(quantileSorted(sorted, 0.9), 4),
    max: round(sorted.length === 0 ? Number.NaN : sorted[sorted.length - 1], 4),
  };
};

/* ========================================================================== */
/* §7 THE ARMS — built by calling src/game/a4World.ts, never by transcription  */
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
const matchFor = (arm: Arm, seed: number): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  const version = ARM_VERSION[arm];
  if (version === null) return new Match(base);
  const m = new Match({ ...base, ...a4MatchFlags(version) });
  armA4World(m, null, version); // ⭐ the app's own call — an MT world needs no census tables
  return m;
};

/* ========================================================================== */
/* §8 ⭐ THE INSTRUMENT — a pure TICK-WALK over observable match state         */
/*    Reads ONLY: match.phase · ball.owner · ball.pos · score · simTick ·      */
/*    simTime · possessionPhase · restartKickGid / restartKickKind /           */
/*    kickoffKickGid · lastCompletedPass · allPlayers[gid].pos · team.stats.   */
/*    Writes NOTHING back into the match. Zero src/**.                        */
/* ========================================================================== */
/** ⚠ CORRECTION (#215.3-L5): `matchOpenFallback` was SPLIT OUT of `restartSecondBall`, which the
 *  #214 probe made carry two different things at once — a real second ball off a dead-ball
 *  restart, and the no-previous-segment FALLBACK (an open-play regain with nothing before it to
 *  read a loss spot from). The partition stays EXHAUSTIVE and MUTUALLY EXCLUSIVE; the fallback
 *  class is expected to be EMPTY in every arm (the match opens from a kickoff), and publishing it
 *  separately is what makes that emptiness auditable instead of assumed. */
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

type Third = 'own' | 'middle' | 'final';
/** ⭐ THE ORTHOGONAL CROSS-CUT (added at PLUMBING time, before any measured run — see the
 *  artifact's deviations): the substrate's `contested` test absorbs most regains, so the
 *  WHERE of a regain is reported for EVERY open-play regain, contested or clean, instead of
 *  living only inside the three clean-turnover classes. The origin CLASS list is unchanged. */
const REGAIN_CELLS = [
  'contested_own', 'contested_middle', 'contested_final',
  'clean_own', 'clean_middle', 'clean_final',
] as const;
const regainCellOf = (contested: boolean, t: Third): string => `${contested ? 'contested' : 'clean'}_${t}`;
const thirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');

interface Segment {
  team: Side;
  origin: OriginClass;
  startTick: number;
  lastOwnedTick: number;
  assignedTicks: number;
  ownedTicks: number;
  ownThirdOwnedTicks: number;
  completedPasses: number;
  attemptedPasses: number;
  /** located completed passes, in order: was the ORIGIN in the passing team's own third? */
  passOriginOwnThird: boolean[];
  /** located completed passes: own-third-origin passes that were NOT forward (2 m predicate). */
  ownThirdLateralBack: number;
  ownThirdLocated: number;
  located: number;
  minLocalX: number;
  maxLocalX: number;
  startThird: Third;
  thirdsVisited: Record<Third, boolean>;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
  /** ⭐ THE DEFINITIONAL LOSS SPOT (#215.3-H1): the ball's position at THIS segment's LAST
   *  OWNED tick — the release/loss point — in the LOSING (this) team's frame. Live-updated on
   *  every owned tick, frozen when the segment ends. */
  lastOwnedLocalXOwnerFrame: number;
  lossLocalXLoserFrame: number | null;
  /** the REGAIN SPOT: the ball's position at the tick the opponent established control, in the
   *  loser's frame — what the #214 probe wrongly used AS the loss spot. Kept as the declared
   *  cross-cut so the wedge between the two readings stays measurable. */
  regainSpotLocalXLoserFrame: number | null;
  goalScoringSide: Side | null;
  /** ⭐ THE DEFINITIONAL third of the loss spot, in the WINNER's attacking frame — this is what
   *  the by-third origin CLASSES are cut on (#215.3-M2). */
  lossThird: Third | null;
  /** ⭐ THE ORTHOGONAL CROSS-CUT (open-play origins only): WHERE the ball was regained, in
   *  the WINNER's attacking frame, INDEPENDENTLY of whether the regain was contested. */
  regainThird: Third | null;
  regainContested: boolean;
  /** the SAME origin class computed on the REGAIN spot — published beside `origin` so the
   *  loss-vs-regain wedge is visible per class, not just in the turnover count. */
  originAtRegainSpot: OriginClass;
}

interface GoalRecord {
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  lossThird: Third | null;
  family: Family;
  completedPasses: number;
  attemptedPasses: number;
  durationS: number;
  thirdsTraversed: number;
  startThird: Third;
  scoringSideMatchesSegment: boolean;
  regainThird: Third | null;
  regainContested: boolean;
}

interface MatchRow {
  seed: number;
  simSeconds: number;
  totalTicks: number;
  deadBallTicks: number;
  segmentTicks: number;
  looseGapTicks: number;
  spanOrderViolations: number;
  assignedTicksSum: number;
  segments: number;
  segmentsByOrigin: Record<string, number>;
  segmentsByOriginAtRegainSpot: Record<string, number>;
  segmentsByRegainCell: Record<string, number>;
  goals: GoalRecord[];
  goalsFromScore: number;
  unattributedGoals: number;
  /* 后场倒脚 */
  completedPassesTotal: number;
  locatedPasses: number;
  ownThirdLocated: number;
  ownThirdLateralBack: number;
  orphanCompletedPasses: number;
  ownedTicks: number;
  ownThirdOwnedTicks: number;
  chainLens: number[];
  chainMaxPerSegment: number[];
  /* 后场失误 — BOTH readings (#215.3-H1): the definitional LOSS spot and the REGAIN cross-cut. */
  ownThirdTurnovers: number;
  ownThirdTurnoversAtRegainSpot: number;
  turnoversTotal: number;
  dangerShot: number[]; // parallel to DANGER_WINDOWS_S
  dangerGoal: number[];
  dangerShotAtRegain: number[];
  dangerGoalAtRegain: number[];
}

function censusOne(arm: Arm, seed: number): MatchRow {
  const m = matchFor(arm, seed);
  const segments: Segment[] = [];
  const goals: GoalRecord[] = [];
  /** side → sim-times of that side's shots / goals (the danger-window ladder reads them). */
  const shotTimes: [number[], number[]] = [[], []];
  const goalTimes: [number[], number[]] = [[], []];
  /** own-third turnovers at the DEFINITIONAL LOSS SPOT: sim-time + the side that WON the ball
   *  (the danger窗口's shooter). ⚠ CORRECTION (#215.3-H1) — the #214 probe filled this list at
   *  the REGAIN tick instead; that reading now lives in `ownThirdTurnoversAtRegain`, published
   *  beside it so the wedge between the two is itself data. */
  const ownThirdTurnovers: { t: number; winner: Side }[] = [];
  const ownThirdTurnoversAtRegain: { t: number; winner: Side }[] = [];

  const lastOwnedPos = new Map<number, { x: number; y: number }>();
  let cur: Segment | null = null;
  let prevSeg: Segment | null = null;
  const prevStats: { passes: number; completed: number; shots: number }[] = ([0, 1] as const).map((s) => ({
    passes: m.teams[s].stats.passes,
    completed: m.teams[s].stats.passesCompleted,
    shots: m.teams[s].stats.shots,
  }));
  const prevScore: [number, number] = [m.score[0], m.score[1]];
  let prevPassT = m.lastCompletedPass?.t ?? -1;
  let sinceDeadBall = true;   // the match opens from a kickoff
  let contestedSinceLastSeg = false;
  let totalTicks = 0; let deadBallTicks = 0; let segmentTicks = 0; let looseGapTicks = 0;
  let orphanCompletedPasses = 0;
  let unattributedGoals = 0;
  let goalsFromScore = 0;
  let spanOrderViolations = 0;

  const closeSegment = (s: Segment, terminator: Segment['terminator'], scoringSide: Side | null): void => {
    s.terminator = terminator;
    s.goalScoringSide = scoringSide;
    // ORDERED + NON-OVERLAPPING: start ticks strictly increase, and (checked in the row below)
    // the per-segment assigned ticks sum EXACTLY to the tick-walk's own segmentTicks counter —
    // which is what "no tick belongs to two segments" means operationally.
    const last = segments.length === 0 ? null : segments[segments.length - 1];
    if (last !== null && s.startTick <= last.startTick) spanOrderViolations++;
    segments.push(s);
    prevSeg = s;
  };

  /** the by-third open-play class, given WHERE (winner's frame) and whether it was contested. */
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
    // ⚠ CORRECTION (#215.3-L5): the no-previous-segment case is its OWN class, not a second ball.
    else if (prevSeg === null) origin = 'matchOpenFallback';
    else {
      // ⚠ CORRECTION (#215.3-M2) — AN OPEN-PLAY REGAIN, classified on the DEFINITIONAL LOSS
      // SPOT: the ball's position at the previous segment's LAST OWNED tick, mirrored into the
      // WINNER's attacking frame (localX_winner = −localX_loser exactly — the two attack
      // directions are opposite). The #214 probe read the ball at the REGAIN tick here and
      // described it as the loss tick; that reading is KEPT, beside it, as the cross-cut.
      const lost = prevSeg.lossLocalXLoserFrame;
      const regained = prevSeg.regainSpotLocalXLoserFrame;
      lossThird = thirdOf(lost === null ? 0 : -lost);
      regainThird = thirdOf(regained === null ? 0 : -regained);
      regainContested = contestedSinceLastSeg;
      origin = openPlayClass(contestedSinceLastSeg, lossThird);
      regainSpotClass = openPlayClass(contestedSinceLastSeg, regainThird);
    }
    /** for every non-open-play origin the two readings COINCIDE by construction. */
    const originAtRegainSpot: OriginClass = regainSpotClass ?? origin;
    const ballLocal = m.teams[team].localX(m.ball.pos.x);
    const st = thirdOf(ballLocal);
    return {
      team, origin, startTick: tick, lastOwnedTick: tick, assignedTicks: 0, ownedTicks: 0,
      ownThirdOwnedTicks: 0, completedPasses: 0, attemptedPasses: 0, passOriginOwnThird: [],
      ownThirdLateralBack: 0, ownThirdLocated: 0, located: 0,
      minLocalX: ballLocal, maxLocalX: ballLocal, startThird: st,
      thirdsVisited: { own: st === 'own', middle: st === 'middle', final: st === 'final' },
      terminator: 'matchEnd', lastOwnedLocalXOwnerFrame: ballLocal,
      lossLocalXLoserFrame: null, regainSpotLocalXLoserFrame: null, goalScoringSide: null,
      lossThird, regainThird, regainContested, originAtRegainSpot,
    };
  };

  const goalOf = (s: Segment): GoalRecord => ({
    origin: s.origin,
    originAtRegainSpot: s.originAtRegainSpot,
    lossThird: s.lossThird,
    family: familyOf(s.origin),
    completedPasses: s.completedPasses,
    attemptedPasses: s.attemptedPasses,
    durationS: round((s.lastOwnedTick - s.startTick + 1) * DT, 4),
    thirdsTraversed: (['own', 'middle', 'final'] as Third[]).filter((t) => s.thirdsVisited[t]).length,
    startThird: s.startThird,
    scoringSideMatchesSegment: s.goalScoringSide === s.team,
    regainThird: s.regainThird,
    regainContested: s.regainContested,
  });

  while (!m.finished) {
    m.step(DT);
    totalTicks++;
    const tick = m.simTick;
    const phase = m.phase;
    const owner = m.ball.owner;

    /* --- passive ledgers: shots, goals, pass counters ---------------------- */
    const lp = m.lastCompletedPass;
    const lpFresh = lp !== null && lp.t !== prevPassT;
    if (lp !== null) prevPassT = lp.t;
    let goalSide: Side | null = null;
    for (const s of [0, 1] as const) {
      if (m.score[s] > prevScore[s]) {
        goalSide = s;
        goalsFromScore += m.score[s] - prevScore[s];
        goalTimes[s].push(m.simTime);
      }
      prevScore[s] = m.score[s];
      const st = m.teams[s].stats;
      if (st.shots > prevStats[s].shots) shotTimes[s].push(m.simTime);
      const dCompleted = st.passesCompleted - prevStats[s].completed;
      const dPasses = st.passes - prevStats[s].passes;
      if (dCompleted > 0) {
        if (cur !== null && cur.team === s) {
          cur.completedPasses += dCompleted;
          // LOCATE it: the engine's own lastCompletedPass, fresh on THIS tick.
          const from = lpFresh && lp !== null ? lastOwnedPos.get(lp.passerGid) : undefined;
          const to = lpFresh && lp !== null ? m.allPlayers[lp.receiverGid] : undefined;
          if (from !== undefined && to !== undefined && to.side === s) {
            const ox = m.teams[s].localX(from.x);
            const dx = m.teams[s].localX(to.pos.x);
            const ownThird = thirdOf(ox) === 'own';
            cur.located++;
            cur.passOriginOwnThird.push(ownThird);
            if (ownThird) {
              cur.ownThirdLocated++;
              if (dx - ox <= FORWARD_MIN_DX_M) cur.ownThirdLateralBack++;
            }
          }
        } else orphanCompletedPasses += dCompleted;
      }
      if (dPasses > 0 && cur !== null && cur.team === s) cur.attemptedPasses += dPasses;
      prevStats[s] = { passes: st.passes, completed: st.passesCompleted, shots: st.shots };
    }

    /* --- the segment walk --------------------------------------------------- */
    if (phase !== 'playing') {
      deadBallTicks++;
      if (cur !== null) {
        if (goalSide !== null) {
          closeSegment(cur, 'goal', goalSide);
          goals.push(goalOf(cur));
        } else closeSegment(cur, 'deadBall', null);
        cur = null;
      } else if (goalSide !== null) unattributedGoals++;
      sinceDeadBall = true;
      contestedSinceLastSeg = false;
      continue;
    }

    if (m.possessionPhase.kind === 'contested') contestedSinceLastSeg = true;

    if (owner === null) {
      if (cur !== null) { cur.assignedTicks++; segmentTicks++; } else looseGapTicks++;
      if (goalSide !== null && cur === null) unattributedGoals++;
      continue;
    }

    const side = owner.side;
    if (cur !== null && cur.team !== side) {
      // ⭐ THE LOSS POINT (#215.3-H1, the DEFINITIONAL one): the ball's position at the
      // segment's LAST OWNED tick — the release/loss point — in the LOSING team's own
      // attacking frame (the 后场失误 frame).
      const lossLocal = cur.lastOwnedLocalXOwnerFrame;
      // the REGAIN POINT: the ball where the opponent ESTABLISHED control, same (loser's)
      // frame. This is what the #214 probe counted; it is kept as the declared cross-cut.
      const regainLocal = m.teams[cur.team].localX(m.ball.pos.x);
      cur.lossLocalXLoserFrame = lossLocal;
      cur.regainSpotLocalXLoserFrame = regainLocal;
      if (thirdOf(lossLocal) === 'own') ownThirdTurnovers.push({ t: m.simTime, winner: side });
      if (thirdOf(regainLocal) === 'own') ownThirdTurnoversAtRegain.push({ t: m.simTime, winner: side });
      closeSegment(cur, 'opponentControl', null);
      cur = null;
    }
    if (cur === null) {
      cur = openSegment(side, tick, owner.gid);
      sinceDeadBall = false;
      contestedSinceLastSeg = false;
    }
    const seg = cur;
    // ⭐ THE CONTESTED WINDOW IS THE HAND-OVER GAP, NOT THE WHOLE POSSESSION: the flag is
    // cleared on EVERY owned tick, so only ownerless ticks since the ball was last held can
    // make the next regain a `scrambleLooseBall`.
    contestedSinceLastSeg = false;
    seg.assignedTicks++; segmentTicks++;
    seg.ownedTicks++;
    seg.lastOwnedTick = tick;
    const localX = m.teams[side].localX(m.ball.pos.x);
    // ⭐ the LOSS SPOT is this, frozen at the last owned tick (#215.3-H1).
    seg.lastOwnedLocalXOwnerFrame = localX;
    const t3 = thirdOf(localX);
    seg.thirdsVisited[t3] = true;
    if (t3 === 'own') seg.ownThirdOwnedTicks++;
    if (localX < seg.minLocalX) seg.minLocalX = localX;
    if (localX > seg.maxLocalX) seg.maxLocalX = localX;
    lastOwnedPos.set(owner.gid, { x: owner.pos.x, y: owner.pos.y });
  }
  if (cur !== null) { closeSegment(cur, 'matchEnd', null); cur = null; }

  /* --- derived per-match aggregates --------------------------------------- */
  const chainLens: number[] = [];
  const chainMaxPerSegment: number[] = [];
  const segmentsByOrigin: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) segmentsByOrigin[o] = 0;
  const segmentsByOriginAtRegainSpot: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) segmentsByOriginAtRegainSpot[o] = 0;
  const segmentsByRegainCell: Record<string, number> = {};
  for (const c of REGAIN_CELLS) segmentsByRegainCell[c] = 0;
  let completedPassesTotal = 0; let locatedPasses = 0; let ownThirdLocated = 0;
  let ownThirdLateralBack = 0; let ownedTicks = 0; let ownThirdOwnedTicks = 0;
  let turnoversTotal = 0; let assignedTicksSum = 0;
  for (const s of segments) {
    segmentsByOrigin[s.origin]++;
    segmentsByOriginAtRegainSpot[s.originAtRegainSpot]++;
    if (s.regainThird !== null) segmentsByRegainCell[regainCellOf(s.regainContested, s.regainThird)]++;
    assignedTicksSum += s.assignedTicks;
    completedPassesTotal += s.completedPasses;
    locatedPasses += s.located;
    ownThirdLocated += s.ownThirdLocated;
    ownThirdLateralBack += s.ownThirdLateralBack;
    ownedTicks += s.ownedTicks;
    ownThirdOwnedTicks += s.ownThirdOwnedTicks;
    if (s.terminator === 'opponentControl') turnoversTotal++;
    let run = 0; let best = 0;
    for (const inOwn of s.passOriginOwnThird) {
      if (inOwn) { run++; if (run > best) best = run; } else if (run > 0) { chainLens.push(run); run = 0; }
    }
    if (run > 0) { chainLens.push(run); if (run > best) best = run; }
    if (s.passOriginOwnThird.length > 0) chainMaxPerSegment.push(best);
  }

  const dangerOn = (evts: readonly { t: number; winner: Side }[], times: [number[], number[]]) =>
    DANGER_WINDOWS_S.map((w) => evts.filter(
      (tv) => times[tv.winner].some((ts) => ts >= tv.t && ts <= tv.t + w),
    ).length);
  const dangerShot = dangerOn(ownThirdTurnovers, shotTimes);
  const dangerGoal = dangerOn(ownThirdTurnovers, goalTimes);
  const dangerShotAtRegain = dangerOn(ownThirdTurnoversAtRegain, shotTimes);
  const dangerGoalAtRegain = dangerOn(ownThirdTurnoversAtRegain, goalTimes);

  return {
    seed,
    simSeconds: m.simTime,
    totalTicks, deadBallTicks, segmentTicks, looseGapTicks, spanOrderViolations, assignedTicksSum,
    segments: segments.length, segmentsByOrigin, segmentsByOriginAtRegainSpot, segmentsByRegainCell,
    goals, goalsFromScore, unattributedGoals,
    completedPassesTotal, locatedPasses, ownThirdLocated, ownThirdLateralBack,
    orphanCompletedPasses, ownedTicks, ownThirdOwnedTicks, chainLens, chainMaxPerSegment,
    ownThirdTurnovers: ownThirdTurnovers.length,
    ownThirdTurnoversAtRegainSpot: ownThirdTurnoversAtRegain.length,
    turnoversTotal, dangerShot, dangerGoal, dangerShotAtRegain, dangerGoalAtRegain,
  };
}

/* ========================================================================== */
/* §9 AGGREGATION — per-arm rows (#203). DESCRIPTIVE. No gate reads any of it. */
/* ========================================================================== */
function aggregateArm(arm: Arm, per: MatchRow[], statsOffset: number) {
  const matches = per.length;
  const ci = (xs: number[], off: number): [number, number] => bootstrapCi(xs, BOOTSTRAP_SEED + statsOffset + off);
  const allGoals = per.flatMap((p) => p.goals);
  const nGoals = allGoals.length;

  const byOrigin: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) byOrigin[o] = allGoals.filter((g) => g.origin === o).length;
  const byOriginShare: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) byOriginShare[o] = shareOf(byOrigin[o], nGoals);
  /** ⚠ CORRECTION (#215.3-M2): the SAME classes cut on the REGAIN spot — the #214 reading,
   *  kept beside the definitional one so the wedge is visible per class. */
  const byOriginAtRegainSpot: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) {
    byOriginAtRegainSpot[o] = allGoals.filter((g) => g.originAtRegainSpot === o).length;
  }
  const byOriginShareAtRegainSpot: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) byOriginShareAtRegainSpot[o] = shareOf(byOriginAtRegainSpot[o], nGoals);
  const byFamily = {
    setPiece: allGoals.filter((g) => g.family === 'setPiece').length,
    restart: allGoals.filter((g) => g.family === 'restart').length,
    openPlay: allGoals.filter((g) => g.family === 'openPlay').length,
  };

  const nonSetPiece = allGoals.filter((g) => g.family !== 'setPiece');
  const openPlayOnly = allGoals.filter((g) => g.family === 'openPlay');
  const ladderOn = (pool: readonly GoalRecord[]) => Object.fromEntries(CONSTRUCTED_LADDER.map((n) => {
    const constructed = pool.filter((g) => g.completedPasses >= n).length;
    return [`ge${n}`, {
      threshold: n,
      constructed,
      transition: pool.length - constructed,
      constructedShareOfPool: shareOf(constructed, pool.length),
      constructedShareOfAllGoals: shareOf(constructed, nGoals),
    }];
  }));

  const segmentsPerMatch = mean(per.map((p) => p.segments));
  const segOriginTotals: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) segOriginTotals[o] = sum(per.map((p) => p.segmentsByOrigin[o]));
  const segOriginTotalsAtRegain: Record<string, number> = {};
  for (const o of ORIGIN_CLASSES) {
    segOriginTotalsAtRegain[o] = sum(per.map((p) => p.segmentsByOriginAtRegainSpot[o]));
  }
  const segTotal = sum(Object.values(segOriginTotals));

  const locatedTotal = sum(per.map((p) => p.locatedPasses));
  const completedTotal = sum(per.map((p) => p.completedPassesTotal));
  const ownThirdLocated = sum(per.map((p) => p.ownThirdLocated));
  const ownThirdLateralBack = sum(per.map((p) => p.ownThirdLateralBack));
  const ownedTicks = sum(per.map((p) => p.ownedTicks));
  const ownThirdOwnedTicks = sum(per.map((p) => p.ownThirdOwnedTicks));
  const chainLens = per.flatMap((p) => p.chainLens);
  const chainMax = per.flatMap((p) => p.chainMaxPerSegment);

  const ownThirdTurnoversPerMatch = per.map((p) => p.ownThirdTurnovers);
  const ownThirdTurnoversAtRegainPerMatch = per.map((p) => p.ownThirdTurnoversAtRegainSpot);
  const dangerLadder = (
    shotOf: (p: MatchRow, i: number) => number,
    goalOfRow: (p: MatchRow, i: number) => number,
    den: readonly number[],
  ) => DANGER_WINDOWS_S.map((w, i) => ({
    windowS: w,
    turnoversFollowedByOpponentShot: sum(per.map((p) => shotOf(p, i))),
    shareOfOwnThirdTurnovers: shareOf(sum(per.map((p) => shotOf(p, i))), sum(den)),
    turnoversFollowedByOpponentGoal: sum(per.map((p) => goalOfRow(p, i))),
    goalShareOfOwnThirdTurnovers: shareOf(sum(per.map((p) => goalOfRow(p, i))), sum(den)),
    perMatchShot: round(mean(per.map((p) => shotOf(p, i))), 4),
    perMatchGoal: round(mean(per.map((p) => goalOfRow(p, i))), 4),
  }));
  const dangerRows = dangerLadder((p, i) => p.dangerShot[i], (p, i) => p.dangerGoal[i], ownThirdTurnoversPerMatch);
  const dangerRowsAtRegain = dangerLadder(
    (p, i) => p.dangerShotAtRegain[i], (p, i) => p.dangerGoalAtRegain[i], ownThirdTurnoversAtRegainPerMatch,
  );

  return {
    arm,
    matches,
    simSecondsPerMatch: round(mean(per.map((p) => p.simSeconds)), 4),

    /* ---------------- ⭐ (a) GOAL GENEALOGY ---------------- */
    goalGenealogy: {
      definition: 'every goal (a match.score delta) is mapped to the possession SEGMENT open at '
        + 'that tick — the segment the walk then closes with terminator "goal". Origin classes '
        + 'and families are the stage doc §2.1 table; thirds are named in the WINNING team\'s '
        + 'attacking frame (turnoverWonInFinalThird = a HIGH regain = the ball was lost in the '
        + 'LOSER\'s own third — exact mirror).',
      goals: nGoals,
      goalsPerMatch: round(nGoals / Math.max(1, matches), 4),
      goalsPerMatchCi95: ci(per.map((p) => p.goals.length), 1),
      byOrigin, byOriginShare, byFamily,
      byOriginAtRegainSpot, byOriginShareAtRegainSpot,
      lossVsRegainOriginNote: '⚠ CORRECTION (#215.3-M2): `byOrigin` is the DEFINITIONAL cut — the '
        + 'by-third classes read the ball at the segment\'s LAST OWNED tick (the loss/release '
        + 'point), mirrored into the WINNER\'s frame, exactly as the published definition states. '
        + '`byOriginAtRegainSpot` is the SAME classifier run on the REGAIN tick (where the '
        + 'opponent established control) — the reading the #214 probe shipped while describing it '
        + 'as the loss spot. BOTH are published so the wedge between them is itself data; the '
        + 'contested/scramble limb is identical in the two cuts by construction.',
      byLossThird: (() => {
        const cells: Record<string, number> = { own: 0, middle: 0, final: 0, notARegain: 0 };
        for (const g of allGoals) {
          if (g.lossThird === null) cells.notARegain++; else cells[g.lossThird]++;
        }
        return cells;
      })(),
      byRegainCell: (() => {
        const cells: Record<string, number> = {};
        for (const c of REGAIN_CELLS) cells[c] = 0;
        for (const g of allGoals) if (g.regainThird !== null) cells[regainCellOf(g.regainContested, g.regainThird)]++;
        return cells;
      })(),
      byRegainThird: (() => {
        const cells: Record<string, number> = { own: 0, middle: 0, final: 0, notARegain: 0 };
        for (const g of allGoals) {
          if (g.regainThird === null) cells.notARegain++; else cells[g.regainThird]++;
        }
        return cells;
      })(),
      regainCrossCutNote: '⭐ THE ORTHOGONAL CROSS-CUT: WHERE the scoring possession was regained '
        + '(winner\'s frame) × whether the regain was CONTESTED — reported for EVERY open-play-origin '
        + 'goal, because the substrate\'s own contested test absorbs most regains and would otherwise '
        + 'empty the by-third buckets. `final` = a HIGH regain = the ball was lost in the opponent\'s '
        + 'own third. `notARegain` = a set-piece / restart / kickoff origin.',
      byFamilyShare: {
        setPiece: shareOf(byFamily.setPiece, nGoals),
        restart: shareOf(byFamily.restart, nGoals),
        openPlay: shareOf(byFamily.openPlay, nGoals),
      },
      setPieceShareNote: '⭐ REPORTED SEPARATELY (#214.1a) and folded into NEITHER side of the '
        + 'constructed/transition split.',
      construction: {
        completedPassesDist: distOf(allGoals.map((g) => g.completedPasses)),
        durationSDist: distOf(allGoals.map((g) => g.durationS)),
        thirdsTraversedDist: distOf(allGoals.map((g) => g.thirdsTraversed)),
        startThirdMix: Object.fromEntries((['own', 'middle', 'final'] as Third[]).map(
          (t) => [t, allGoals.filter((g) => g.startThird === t).length],
        )),
      },
      constructedLadder: {
        note: '⭐ A REPORTING GRID, NOT A GATE (#214.1a): constructed(N) = a goal whose segment '
          + 'completed ≥ N passes. Reported at EVERY N ∈ {3,4,5} on TWO populations; no N is '
          + 'privileged and nothing computes PASS/FAIL from any of them.',
        nonSetPiece: { pool: nonSetPiece.length, ladder: ladderOn(nonSetPiece) },
        openPlayOriginOnly: { pool: openPlayOnly.length, ladder: ladderOn(openPlayOnly) },
      },
      ownGoalsOrDeflections: allGoals.filter((g) => !g.scoringSideMatchesSegment).length,
      ownGoalNote: 'goals whose SCORING side is not the segment\'s possessing side (own goal / '
        + 'deflection). REPORTED, never dropped; they still map to exactly one segment.',
    },

    /* ---------------- (b) 后场倒脚 ---------------- */
    backThirdCirculation: {
      definition: 'completed passes are counted from team.stats.passesCompleted deltas (the '
        + 'engine\'s own counter) and LOCATED from match.lastCompletedPass: origin = the passer\'s '
        + 'position at his last owned tick (the release point), destination = the receiver\'s '
        + 'position at completion. "forward" is the ENGINE\'S OWN predicate, traced: '
        + `localX(dest) − localX(origin) > ${FORWARD_MIN_DX_M} (src/sim/mechanics.ts:406).`,
      completedPassesPerMatch: round(completedTotal / Math.max(1, matches), 4),
      completedPassesPerMatchCi95: ci(per.map((p) => p.completedPassesTotal), 2),
      locatedPasses: locatedTotal,
      locatedShare: shareOf(locatedTotal, completedTotal),
      locatedShareNote: '⚠ HONESTY TERM: an unlocated completed pass is counted in the totals and '
        + 'excluded from every positional block below. Never silently dropped.',
      orphanCompletedPassesPerMatch: round(sum(per.map((p) => p.orphanCompletedPasses)) / Math.max(1, matches), 4),
      orphanNote: 'a completed pass whose side is not the open segment\'s side (or that arrived with '
        + 'no segment open) — a boundary artefact of the tick walk, published as its own count.',
      ownThirdPassShare: shareOf(ownThirdLocated, locatedTotal),
      ownThirdPassSharePerMatchCi95: ci(
        per.map((p) => (p.locatedPasses === 0 ? Number.NaN : p.ownThirdLocated / p.locatedPasses)).filter(Number.isFinite), 3,
      ),
      lateralOrBackwardShareOfOwnThirdPasses: shareOf(ownThirdLateralBack, ownThirdLocated),
      ownThirdChains: {
        definition: 'within ONE segment, a maximal run of consecutive LOCATED completed passes whose '
          + 'ORIGIN is in the passing team\'s own third.',
        chains: chainLens.length,
        meanChainLength: round(mean(chainLens), 4),
        chainLengthDist: distOf(chainLens),
        meanMaxChainPerPossession: round(mean(chainMax), 4),
        maxChainObserved: chainMax.reduce((a, b) => (b > a ? b : a), 0),
      },
      ownThirdTimeShare: shareOf(ownThirdOwnedTicks, ownedTicks),
      ownThirdTimeShareNote: 'owned ticks with the ball in the POSSESSING team\'s own third ÷ all '
        + 'owned ticks (loose and dead-ball ticks are in neither).',
    },

    /* ---------------- (c) 后场失误 ---------------- */
    backThirdErrors: {
      definition: 'an own-third turnover = a segment ending with terminator "opponentControl" whose '
        + 'LOSS position (ball position at the segment\'s LAST OWNED tick) is in the LOSING team\'s '
        + 'own third. ⚠ CORRECTION (#215.3-H1): the #214 probe read the ball at the REGAIN tick '
        + 'instead — the definition above is now what the count MEASURES, and the regain-tick '
        + 'reading is published beside it (atRegainSpot) as the declared cross-cut.',
      ownThirdTurnoversPerMatch: round(mean(ownThirdTurnoversPerMatch), 4),
      ownThirdTurnoversPerMatchCi95: ci(ownThirdTurnoversPerMatch, 4),
      ownThirdTurnovers: sum(ownThirdTurnoversPerMatch),
      turnoversPerMatch: round(mean(per.map((p) => p.turnoversTotal)), 4),
      ownThirdShareOfAllTurnovers: shareOf(sum(ownThirdTurnoversPerMatch), sum(per.map((p) => p.turnoversTotal))),
      /** ⭐ THE LOSS-vs-REGAIN WEDGE, published per arm (#215.3): the same quantity read at the
       *  two ticks. The gap is not an error term — it is where the ball travels between release
       *  and the opponent establishing control, and it is worth watching. */
      atRegainSpot: {
        note: 'THE CROSS-CUT: the identical count read at the REGAIN tick (ball position where the '
          + 'opponent established control, still in the LOSER\'s frame). This is the #214 number.',
        ownThirdTurnovers: sum(ownThirdTurnoversAtRegainPerMatch),
        ownThirdTurnoversPerMatch: round(mean(ownThirdTurnoversAtRegainPerMatch), 4),
        ownThirdTurnoversPerMatchCi95: ci(ownThirdTurnoversAtRegainPerMatch, 5),
        ownThirdShareOfAllTurnovers: shareOf(
          sum(ownThirdTurnoversAtRegainPerMatch), sum(per.map((p) => p.turnoversTotal)),
        ),
        dangerousLadder: dangerRowsAtRegain,
      },
      lossVsRegainWedge: {
        note: '⭐ THE WEDGE (#215.3): definitional LOSS-spot count minus REGAIN-spot count, on the '
          + 'SAME turnovers. Published because the gap is a measurable property of the world (how '
          + 'far the ball travels between release and the opponent\'s control), not a defect.',
        lossSpot: sum(ownThirdTurnoversPerMatch),
        regainSpot: sum(ownThirdTurnoversAtRegainPerMatch),
        delta: sum(ownThirdTurnoversPerMatch) - sum(ownThirdTurnoversAtRegainPerMatch),
        regainOverLossRatio: shareOf(sum(ownThirdTurnoversAtRegainPerMatch), sum(ownThirdTurnoversPerMatch)),
        lossSpotPerMatch: round(mean(ownThirdTurnoversPerMatch), 4),
        regainSpotPerMatch: round(mean(ownThirdTurnoversAtRegainPerMatch), 4),
      },
      dangerousLadder: dangerRows,
      dangerousNote: '⚠ TEMPORAL CO-OCCURRENCE, NOT CAUSATION: "an opponent shot within W sim-seconds '
        + 'of the turnover", on match.simTime. No causal claim is made or permitted.',
    },

    /* ---------------- the segment population (context) ---------------- */
    segmentPopulation: {
      segmentsPerMatch: round(segmentsPerMatch, 4),
      byOrigin: segOriginTotals,
      byOriginShare: Object.fromEntries(ORIGIN_CLASSES.map((o) => [o, shareOf(segOriginTotals[o], segTotal)])),
      byOriginAtRegainSpot: segOriginTotalsAtRegain,
      byOriginShareAtRegainSpot: Object.fromEntries(
        ORIGIN_CLASSES.map((o) => [o, shareOf(segOriginTotalsAtRegain[o], segTotal)]),
      ),
      byRegainCell: Object.fromEntries(REGAIN_CELLS.map(
        (c) => [c, sum(per.map((p) => p.segmentsByRegainCell[c]))],
      )),
      byRegainCellShareOfRegains: (() => {
        const totals = REGAIN_CELLS.map((c) => sum(per.map((p) => p.segmentsByRegainCell[c])));
        const den = sum(totals);
        return Object.fromEntries(REGAIN_CELLS.map((c, i) => [c, shareOf(totals[i], den)]));
      })(),
    },

    /* ---------------- the accounting identity (gate input) ---------------- */
    accounting: {
      totalTicks: sum(per.map((p) => p.totalTicks)),
      deadBallTicks: sum(per.map((p) => p.deadBallTicks)),
      segmentTicks: sum(per.map((p) => p.segmentTicks)),
      looseGapTicks: sum(per.map((p) => p.looseGapTicks)),
      assignedTicksSum: sum(per.map((p) => p.assignedTicksSum)),
      goalsFromScore: sum(per.map((p) => p.goalsFromScore)),
      goalsMappedToSegments: nGoals,
      unattributedGoals: sum(per.map((p) => p.unattributedGoals)),
      spanOrderViolations: sum(per.map((p) => p.spanOrderViolations)),
    },
  };
}
type ArmRow = ReturnType<typeof aggregateArm>;

/* ========================================================================== */
/* §10 N DERIVATION (the frozen §4.3 rule)                                    */
/* ========================================================================== */
const wall0 = Date.now();
const frozenNStar = (msPerMatch: number, msSource: string, goalsPerMatch: number, goalsSource: string) => {
  const nRaw = goalsPerMatch > 0 ? Math.ceil(TARGET_GOALS_PER_ARM / goalsPerMatch) : Number.NaN;
  const nStepped = Number.isFinite(nRaw) ? Math.ceil(nRaw / N_STEP) * N_STEP : Number.NaN;
  const nWall = Math.floor((WALL_BUDGET_HOURS * 3_600_000) / (msPerMatch * ARMS_COUNT * XDET_FACTOR));
  const nStar = Math.min(nStepped, nWall, N_CAP);
  const binding = nStar === nStepped ? 'precision' : nStar === nWall ? 'wall' : 'seedBandCap';
  return {
    targetGoalsPerArm: TARGET_GOALS_PER_ARM,
    goalsPerMatchBinding: round(goalsPerMatch, 4), goalsSource,
    msPerMatch: round(msPerMatch, 3), msSource,
    nRaw, nStepped, nStep: N_STEP, nWall, nCap: N_CAP,
    nStar: Number.isFinite(nStar) ? nStar : null,
    bindingTerm: binding,
    projectedWallHours: Number.isFinite(nStar)
      ? round((nStar * ARMS_COUNT * XDET_FACTOR * msPerMatch) / 3_600_000, 4) : null,
    arithmetic: `N* = min( ceil(${TARGET_GOALS_PER_ARM} / goalsPerMatch_min) ↑${N_STEP}, `
      + `floor(${WALL_BUDGET_HOURS} h / (ms/match × ${ARMS_COUNT} arms × ${XDET_FACTOR} X-DET)), ${N_CAP} ) `
      + '— frozen in the stage doc §4.3 BEFORE the smoke ran.',
  };
};

interface NDeriv {
  mode: 'smoke' | 'full';
  n: number;
  nStar: number | null;
  smokeArtifactSha256: string | null;
  envOverride: number | null;
  note?: string;
  arithmetic?: string;
  smokeArtifact?: string;
  targetGoalsPerArm?: number;
  goalsPerMatchBinding?: number;
  goalsSource?: string;
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
      note: `SMOKE — N is FIXED by stage doc §4.1 at ${SMOKE_N} seeds (12,421,000..12,421,011). It `
        + 'publishes exactly TWO sizing numbers (ms/match, min goals/match) and ADJUDICATES NOTHING.',
      smokeArtifactSha256: null as string | null,
      envOverride: N_ENV,
    };
  }
  let msPerMatch = PRIOR_MS_PER_MATCH;
  let goalsPerMatch = Number.NaN;
  let msSource = `the PRIOR ${PRIOR_MS_PER_MATCH} ms/match (MT-LADDER's published smoke cost) — no `
    + 'committed smoke artifact was found at this path';
  let goalsSource = 'ABSENT — no committed smoke artifact';
  let smokeSha: string | null = null;
  if (existsSync(SMOKE_PATH)) {
    const bytes = readFileSync(SMOKE_PATH);
    const smoke = JSON.parse(bytes.toString('utf8')) as {
      mode?: string; sizing?: { msPerMatch?: number; goalsPerMatchMin?: number };
    };
    const v = smoke.sizing?.msPerMatch; const g = smoke.sizing?.goalsPerMatchMin;
    if (smoke.mode === 'smoke' && typeof v === 'number' && v > 0 && typeof g === 'number' && g > 0) {
      msPerMatch = v; goalsPerMatch = g;
      smokeSha = createHash('sha256').update(bytes).digest('hex');
      msSource = `the committed SMOKE artifact ${SMOKE_PATH} (sha256 ${smokeSha})`;
      goalsSource = 'the same committed SMOKE artifact — THE SMOKE INFORMS ONLY N (the #188 §4.3 '
        + 'precedent): exactly TWO numbers are read out of it, ms/match and the MINIMUM goals per '
        + 'match over the three arms. No level, share, rate, CI or threshold from it is read '
        + 'anywhere. ⚠ The probe reads the WORKING-TREE file at that path, not the committed blob '
        + '— the provenance is sha-audited (this field), not git-enforced.';
    }
  }
  const derived = frozenNStar(msPerMatch, msSource, goalsPerMatch, goalsSource);
  return {
    mode: 'full' as const, smokeArtifact: SMOKE_PATH, smokeArtifactSha256: smokeSha,
    ...derived, envOverride: N_ENV, n: N_ENV ?? derived.nStar ?? 0,
  };
})();

if (MODE === 'full' && nDerivation.n <= 0) {
  console.error('GOAL-GENEALOGY FATAL — full mode needs the committed SMOKE artifact (or GGC_N, which '
    + `turns gNDerived RED). Run the smoke first: GGC_MODE=smoke … → ${SMOKE_PATH}`);
  process.exit(2);
}

/** ⭐ A full-mode GGC_N override — or ANY bounded (GGC_CAP) invocation — is BY DEFINITION not
 *  the census: gNDerived goes RED and the process exits 1. Every such run is routed onto the
 *  EXIT-SEMANTICS sub-block, so the battery block stays VIRGIN and only a clean, uncapped,
 *  rule-derived full run can touch it. */
const RUN_BASE = MODE === 'smoke' ? SMOKE_BASE
  : (N_ENV === null && !IS_PREFLIGHT ? FULL_BASE : EXIT_CHECK_BLOCK[0]);
const RUN_N = Math.min(nDerivation.n, CAP);

/* ========================================================================== */
/* §11 STARTUP BANNER                                                         */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
banner('');
banner('=============================================================================');
banner(`GOAL-GENEALOGY CENSUS (#214) · mode ${MODE} · N ${RUN_N} seeds × ${ARMS_COUNT} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1}   (reserved band ${RESERVED_BAND[0]}..${RESERVED_BAND[1]})`);
banner(`arms  PROD (shipped) · MT02 (a4World v4 = ladder ${MT_WORLD_ARM[4]} @ ${MT_WORLD_DOSE[4]})`
  + ` · MT08 (a4World v5 = ladder ${MT_WORLD_ARM[5]} @ ${MT_WORLD_DOSE[5]})`);
banner('      ⭐ armed by CALLING src/game/a4World.ts (a4MatchFlags + armA4World) — no dose typed here');
banner(`N rule ${String(nDerivation.arithmetic ?? nDerivation.note)}`);
if (MODE === 'full') {
  banner(`       goals/match_min ${String(nDerivation.goalsPerMatchBinding)} ⇒ raw ${String(nDerivation.nRaw)}`
    + ` → step ${String(nDerivation.nStepped)} · wall ${String(nDerivation.nWall)} · cap ${N_CAP}`
    + ` ⇒ N* ${String(nDerivation.nStar)} (${String(nDerivation.bindingTerm)} binds;`
    + ` projected ${String(nDerivation.projectedWallHours)} h)`);
} else {
  banner('       ⚠ SMOKE — PLUMBING ONLY. It adjudicates NOTHING and tunes NO threshold.');
}
banner('FROZEN THIS RUN — and NOTHING below is a gate (#214.1: descriptive census):');
banner('  (a) GOAL GENEALOGY: origin class × construction; constructed/transition at the');
banner(`      REPORTING LADDER ≥${CONSTRUCTED_LADDER.join(' / ≥')} completed passes, set-piece share separate`);
banner('  (b) 后场倒脚: own-third pass share · lateral/backward share · own-third chains · time share');
banner(`  (c) 后场失误: own-third turnovers /match + the DANGEROUS subset at {${DANGER_WINDOWS_S.join(' s, ')} s}`);
banner('  GATES = X-FAMILY ONLY (xDet · xFpProd · xSrcZero · gArm · gSeed · gStats · gNDerived)');
banner('          + gSegAcct, the segmentation-ACCOUNTING identity (ticks and goals, not football)');
banner('  NO CHECKPOINT/RESUME: the battery is a few minutes; a kill costs the run (stated).');
banner('=============================================================================');
banner('');

/* ========================================================================== */
/* §12 THE CORE (run TWICE for X-DET)                                         */
/* ========================================================================== */
const PROGRESS_EVERY_MS = 20_000;
let lastProgress = 0;
const progress = (tag: string, done: number, total: number): void => {
  const now = Date.now();
  if (now - lastProgress < PROGRESS_EVERY_MS && done !== total) return;
  lastProgress = now;
  const el = (now - wall0) / 1000;
  const rate = done === 0 ? 0 : el / done;
  process.stderr.write(`  [ggc ${tag}] ${done}/${total} matches · ${el.toFixed(0)}s elapsed · `
    + `${rate.toFixed(3)} s/match · ETA ${((total - done) * rate).toFixed(0)}s\n`);
};

interface Core {
  seeds: { base: number; n: number; first: number; last: number };
  perArm: Record<string, ArmRow>;
  goalsPerMatchByArm: Record<string, number>;
}
function runCore(tag: string): Core {
  const seeds = Array.from({ length: RUN_N }, (_, k) => RUN_BASE + k);
  const perArm: Record<string, ArmRow> = {};
  const goalsPerMatchByArm: Record<string, number> = {};
  let done = 0;
  const total = RUN_N * ARMS_COUNT;
  for (let ai = 0; ai < ARMS.length; ai++) {
    const arm = ARMS[ai];
    const rows: MatchRow[] = [];
    for (const seed of seeds) {
      rows.push(censusOne(arm, seed));
      done++;
      progress(tag, done, total);
    }
    perArm[arm] = aggregateArm(arm, rows, ai * 10);
    goalsPerMatchByArm[arm] = mean(rows.map((r) => r.goals.length));
  }
  return {
    seeds: { base: RUN_BASE, n: RUN_N, first: seeds[0], last: seeds[seeds.length - 1] },
    perArm, goalsPerMatchByArm,
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
/* §13 THE GATES — X-FAMILY + the segmentation-accounting identity            */
/* ========================================================================== */
/** gArm: the FULL #196.3-D4 checklist, read back off freshly built matches (never stepped). */
interface ArmCheckRow {
  arm: Arm; version: number; dose: number | null; ladderArm: string | null;
  flagsOn: boolean; noFlags: boolean; genesDosed: boolean; genesAbsent: boolean;
  eyeNull: boolean; evolveOptInsOff: boolean; readback: boolean;
  genomeViewsChecked: number; pass: boolean;
}
/** ⭐ THE FIXED-DOSE LIMB of the #196.3-D4 checklist. The two EVOLUTION opt-ins are
 *  `MutateOptions` fields (src/evolution/genome.ts), NOT genome fields — a world cannot carry
 *  them, only an evolve() CALL can. So the honest check is that this instrument contains no
 *  mutation/crossover entry point at all: the arms are fixed-dose exhibits and nothing here
 *  can mutate either gene. The needles are assembled at run time so this test cannot match
 *  ITSELF (the pgrep-self-match trap, in string form). */
const SELF_PATH = 'scripts/probes/goal-genealogy-census.ts';
const noEvolutionHere = (() => {
  const needles = ['mutate' + 'Genome', 'crossover' + 'Genomes', 'evolve' + 'DefLaneConvergence', 'evolve' + 'MarkSag'];
  let src = '';
  try {
    src = readFileSync(SELF_PATH, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
  } catch { return { pass: false, needles, hits: ['self-source-unreadable'], sourcePath: SELF_PATH }; }
  const hits = needles.filter((nd) => src.includes(nd));
  return { pass: hits.length === 0, needles, hits, sourcePath: SELF_PATH };
})();

const armCheck = (() => {
  const gateSeed = RESERVED_BAND[1]; // CONSTRUCTION ONLY — this match is never stepped
  const rows: ArmCheckRow[] = ARMS.map((arm) => {
    const m = matchFor(arm, gateSeed);
    const version = ARM_VERSION[arm];
    const views = ([0, 1] as const).flatMap((s) => [
      m.teams[s].info.genome, m.teams[s].baseGenome, m.teams[s].effGenome,
    ] as TacticalGenome[]);
    const flagKeys = Object.keys(MT_WORLD_FLAGS) as (keyof typeof MT_WORLD_FLAGS)[];
    const mm = m as unknown as Record<string, unknown>;
    const eyeNull = m.stationEye === null;
    const evolveOptInsOff = noEvolutionHere.pass;
    if (version === null) {
      const noFlags = flagKeys.every((k) => mm[k] !== true);
      const genesAbsent = views.every((g) => g.defLaneConvergence === undefined && g.markSag === undefined);
      const readback = mtArmedVersion(m) === 0;
      return {
        arm, version: 0, dose: null, ladderArm: null,
        flagsOn: false, noFlags, genesDosed: false, genesAbsent, eyeNull, evolveOptInsOff, readback,
        genomeViewsChecked: views.length,
        pass: noFlags && genesAbsent && eyeNull && evolveOptInsOff && readback,
      };
    }
    const dose = MT_WORLD_DOSE[version];
    const flagsOn = flagKeys.every((k) => mm[k] === MT_WORLD_FLAGS[k]);
    const genesDosed = views.every((g) => g.defLaneConvergence === dose && g.markSag === dose);
    const readback = mtArmedVersion(m) === version;
    return {
      arm, version, dose, ladderArm: MT_WORLD_ARM[version],
      flagsOn, noFlags: false, genesDosed, genesAbsent: false, eyeNull, evolveOptInsOff, readback,
      genomeViewsChecked: views.length,
      pass: flagsOn && genesDosed && eyeNull && evolveOptInsOff && readback,
    };
  });
  return {
    pass: rows.every((r) => r.pass) && noEvolutionHere.pass,
    rows,
    fixedDoseNoEvolution: noEvolutionHere,
    fixedDoseNote: 'the two EVOLUTION opt-ins are MutateOptions fields, not genome fields — a WORLD '
      + 'cannot arm them, only an evolve() call can. This limb therefore proves the instrument '
      + 'contains NO mutation/crossover entry point at all (needles assembled at run time so the '
      + 'test cannot match itself). The arms are fixed-dose exhibits; nothing here mutates a gene.',
    note: '⭐ the arms are built by CALLING a4MatchFlags + armA4World from src/game/a4World.ts (the '
      + 'app\'s own path) and then READ BACK: both consumption flags, both genes at the world\'s '
      + 'dose on ALL THREE genome views of BOTH teams, stationEye null, both EVOLUTION opt-ins '
      + 'off, and the engine-side mtArmedVersion readback. No dose or flag is typed in this probe.',
  };
})();

/** gSegAcct: the accounting identity. Ticks and goals — NOT a football quantity. */
const segAcct = (() => {
  const rows = ARMS.map((arm) => {
    const a = coreA.perArm[arm].accounting;
    const ticksIdentity = a.deadBallTicks + a.segmentTicks + a.looseGapTicks === a.totalTicks;
    const goalsIdentity = a.goalsMappedToSegments === a.goalsFromScore && a.unattributedGoals === 0;
    const ordered = a.spanOrderViolations === 0;
    /** no tick in two segments: the per-segment assignments sum EXACTLY to the walk's counter. */
    const noOverlap = a.assignedTicksSum === a.segmentTicks;
    return {
      arm, pass: ticksIdentity && goalsIdentity && ordered && noOverlap,
      ticksIdentity, goalsIdentity, spansOrdered: ordered, noOverlap, ...a,
      looseGapShare: shareOf(a.looseGapTicks, a.totalTicks),
    };
  });
  return {
    pass: rows.every((r) => r.pass),
    rows,
    identity: 'EVERY tick is assigned to EXACTLY ONE of {a segment · an inter-segment loose interval '
      + '· dead ball}, the three sum to the total, segment spans are ordered and non-overlapping, '
      + 'and EVERY goal maps to exactly one segment (unattributed = 0).',
    thirdBucketDisclosure: '⚠ DISCLOSED, NOT HIDDEN: the ticks between a restart and the first body '
      + 'actually owning the ball are `playing` but ownerless and belong to NO segment. They are '
      + 'the looseGapTicks bucket, published per arm (looseGapShare).',
  };
})();

/** X-FP-PROD (#181.2): the shipped fingerprint re-derived HERE. */
let fpObserved = 'skipped';
let xFpProd = false;
if (SKIP_FP) { xFpProd = true; fpObserved = 'skipped (preflight)'; } else {
  process.stderr.write('  [ggc] X-FP-PROD: re-deriving the production fingerprint...\n');
  const league = new League({ seed: FINGERPRINT_SEED });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
  xFpProd = fpObserved === FINGERPRINT_BASELINE;
  process.stderr.write(`  [ggc] X-FP-PROD ${xFpProd ? 'PASS' : '*** FAIL ***'} ${fpObserved}\n`);
}

let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

const firstSeed = RUN_BASE; const lastSeed = RUN_BASE + RUN_N - 1;
const seedDisjoint = (() => {
  const clashes = CONSUMED.filter((c) => !(lastSeed < c.range[0] || firstSeed > c.range[1]));
  const inBand = firstSeed >= RESERVED_BAND[0] && lastSeed <= RESERVED_BAND[1];
  const smokeLast = SMOKE_BASE + SMOKE_N - 1;
  const ownBlocks = smokeLast < EXIT_CHECK_BLOCK[0]
    && EXIT_CHECK_BLOCK[1] < FULL_BASE
    && (MODE === 'smoke'
      ? lastSeed <= smokeLast
      : (N_ENV === null && !IS_PREFLIGHT
        ? firstSeed >= FULL_BASE
        : (firstSeed >= EXIT_CHECK_BLOCK[0] && lastSeed <= EXIT_CHECK_BLOCK[1])));
  return {
    pass: clashes.length === 0 && inBand && ownBlocks,
    block: `${firstSeed}..${lastSeed}`, band: RESERVED_BAND, inBand,
    smokeBlock: `${SMOKE_BASE}..${smokeLast}`,
    exitSemanticsBlock: `${EXIT_CHECK_BLOCK[0]}..${EXIT_CHECK_BLOCK[1]}`,
    exitSemanticsNote: 'where EVERY non-census full-mode run is routed (a GGC_N override or any '
      + 'bounded GGC_CAP preflight): such a run turns gNDerived RED and exits 1, and its output '
      + 'adjudicates nothing. Reserved so the battery block stays VIRGIN. ⚠ ONE EXCEPTION OF '
      + 'RECORD: seed 12,421,100 was stepped once by a bounded /tmp preflight taken BEFORE this '
      + 'routing rule was added; that run\'s artifact was discarded, and the engine is '
      + 'deterministic, so the battery re-derives it identically.',
    fullBase: FULL_BASE, ownBlocksDisjoint: ownBlocks,
    gArmGateSeed: RESERVED_BAND[1],
    gArmGateSeedNote: `gArm CONSTRUCTS three matches at ${RESERVED_BAND[1]} and NEVER STEPS THEM — no `
      + 'match RNG is drawn from that seed, and it is inside this stage\'s own reserved band.',
    consumedBlocks: CONSUMED, collisions: clashes.map((c) => c.name),
  };
})();
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

const xGates = {
  xDet: { pass: xDet, digestA, digestB, note: 'the whole measured core computed TWICE, canonical-JSON digests' },
  xFpProd: {
    pass: xFpProd,
    baseline: FINGERPRINT_BASELINE,
    observed: fpObserved,
    seed: FINGERPRINT_SEED,
    seasons: FINGERPRINT_SEASONS,
    skipped: SKIP_FP,
    reDerivedInThisProcess: !SKIP_FP,
    skipNote: '⚠ #215.3-M3: a SKIPPED fingerprint forces the run onto a PREFLIGHT path — no '
      + 'canonical artifact can exist with skipped:true. Read `preflightProvenance` beside this.',
  },
  xSrcZero: { pass: srcDiff === '', srcDiff, note: 'instrument-only: this stage adds ZERO src/** (#214.2)' },
  gArm: armCheck,
  gSeed: seedDisjoint,
  gStats: { pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, published: PUBLISHED_STATS_BASES, minGap: statsMinGap },
  gNDerived: {
    pass: MODE === 'smoke' ? N_ENV === null : (N_ENV === null && RUN_N === nDerivation.nStar),
    ranN: RUN_N, derivedNStar: nDerivation.nStar ?? null, envOverride: N_ENV,
    note: 'in FULL mode the N run must BE the frozen §4.3 rule\'s output — a GGC_N override turns '
      + 'this gate RED (and the process exits 1) rather than passing quietly. GGC_N is accepted in '
      + 'NO mode; the smoke\'s 12 seeds are frozen by the stage doc.',
  },
  gSegAcct: segAcct,
};
const xPass = Object.values(xGates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §14 CITED, NEVER READ FOR A LEVEL (#181.2)                                 */
/* ========================================================================== */
const citedTempo = (() => {
  if (!existsSync(TEMPO_ARTIFACT)) return { path: TEMPO_ARTIFACT, present: false, sha256: null, resultSha256: null };
  const bytes = readFileSync(TEMPO_ARTIFACT);
  let inner: string | null = null;
  try { inner = (JSON.parse(bytes.toString('utf8')) as { resultSha256?: string }).resultSha256 ?? null; } catch { inner = null; }
  return {
    path: TEMPO_ARTIFACT, present: true,
    sha256: createHash('sha256').update(bytes).digest('hex'), resultSha256: inner,
  };
})();

/* ========================================================================== */
/* §15 ARTIFACT                                                               */
/* ========================================================================== */
const msPerMatchMeasured = passMs / Math.max(1, RUN_N * ARMS_COUNT);
const goalsPerMatchMin = Math.min(...ARMS.map((a) => coreA.goalsPerMatchByArm[a]));
const sizingOut = {
  msPerMatch: round(msPerMatchMeasured, 3),
  goalsPerMatchByArm: Object.fromEntries(ARMS.map((a) => [a, round(coreA.goalsPerMatchByArm[a], 4)])),
  goalsPerMatchMin: round(goalsPerMatchMin, 4),
  provenance: MODE === 'smoke'
    ? 'THE SMOKE\'S TWO SIZING NUMBERS — ms/match and the MINIMUM goals per match over the three '
      + 'arms. These are the ONLY numbers a FULL run reads out of this artifact, and they feed ONLY '
      + 'N. THE SMOKE ADJUDICATES NOTHING.'
    : 'POST-HOC on this FULL run — it selected nothing (N came from the frozen rule on the SMOKE\'s '
      + 'two numbers). Reported so the smoke\'s estimate can be checked against reality.',
};

const verdict = !xPass ? 'X-FAMILY FAIL — the measurement is invalid'
  : MODE === 'smoke' ? 'SMOKE — PLUMBING ONLY; ADJUDICATES NOTHING'
    : `GOAL-GENEALOGY CENSUS at N=${RUN_N} × ${ARMS_COUNT} arms — plumbing GREEN. The levels are `
      + 'DESCRIPTIVE; the GAP TABLE is the commander\'s to adjudicate from the PER-ARM rows (#203).';

const body = {
  stage: 'THE GOAL-GENEALOGY CENSUS — the BUILD-UP arc\'s phase-0 gap table',
  doc: 'docs/world-model/GOAL-GENEALOGY-CENSUS.md',
  ruling: '#214 (the user ruled 甲 on the #213.3 fork); form inherited from the #170–#173 tempo census',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  /** ⭐ #215.3-M3: WHY this run is (or is not) a preflight, and whether it was allowed anywhere
   *  near a canonical repo path. A canonical-path artifact can only ever say `preflight: false`,
   *  `fingerprintSkipped: false` — i.e. it ALWAYS carries a genuinely re-derived xFpProd. */
  preflightProvenance: {
    preflight: IS_PREFLIGHT,
    reasons: PREFLIGHT_REASONS,
    capped: IS_CAPPED,
    fingerprintSkipped: SKIP_FP,
    outPath: OUT_PATH,
    canonicalPath: isCanonicalPath(OUT_PATH),
    rule: '⚠ CORRECTION (#215.3-M3): ANY skip/preflight lever (GGC_CAP or GGC_SKIP_FP) makes the '
      + 'run a PREFLIGHT regardless of N or cap, a preflight may NEVER write a canonical repo '
      + 'path (guarded at parse time AND again at write time), and the skip is recorded here and '
      + 'in gates.xFpProd. The #214 probe keyed "preflight" off the CAP alone, so an UNCAPPED '
      + 'GGC_SKIP_FP=1 run could pass xFpProd as "skipped" and still write the canonical artifact.',
  },
  frozenDesign: {
    arms: ARMS,
    armDefinitions: {
      PROD: 'the SHIPPED game — no match flags, no station eye, no gene written.',
      MT02: `a4World v4 = MT-LADDER arm ${MT_WORLD_ARM[4]}, both seams armed at dose ${MT_WORLD_DOSE[4]}.`,
      MT08: `a4World v5 = MT-LADDER arm ${MT_WORLD_ARM[5]}, both seams armed at dose ${MT_WORLD_DOSE[5]}.`,
    },
    armingProvenance: '⭐ the MT arms are armed by CALLING src/game/a4World.ts — `a4MatchFlags(v)` at '
      + 'construction and `armA4World(match, null, v)` after it, the GameApp path — so no dose, flag '
      + 'or world is transcribed into this probe and the censused world IS the world the user played.',
    mtWorldFlags: MT_WORLD_FLAGS,
    mtWorldDose: MT_WORLD_DOSE,
    declaredConfound: 'PROD differs from the MT arms in flags AND genes at once (the percept flags '
      + 'ride the MT worlds\' substrate). Deliberate and inherited from #211.3: these are the three '
      + 'worlds that EXIST, not a single-factor decomposition. NO PROD-vs-MT causal claim is made.',
    definitions: {
      possessionSegment: 'INHERITED VERBATIM from the tempo census §3.1: a maximal interval of '
        + 'same-owner-TEAM ball control while phase === "playing"; opened at the first tick a body of '
        + 'that team owns the ball, SUSPENDED (not ended) while the ball is loose in play, ended by an '
        + 'opponent establishing ownership, by the phase leaving "playing", or by full time. That IS '
        + 'the debounce; restarts always start a NEW segment with their own origin class.',
      originClasses: ORIGIN_CLASSES,
      originObservation: 'kickoff/restart classes from match.kickoffKickGid / restartKickGid + '
        + 'restartKickKind; scrambleLooseBall when the substrate\'s OWN match.possessionPhase read '
        + '"contested" during the hand-over gap; otherwise a clean regain classified by the ball\'s '
        + 'position at the LOSS TICK = the previous segment\'s LAST OWNED tick (⚠ CORRECTION '
        + '#215.3-M2 — the #214 probe used the REGAIN tick here while claiming the loss tick; the '
        + 'regain-tick cut is now published separately as `byOriginAtRegainSpot`). '
        + 'matchOpenFallback = an open-play regain with NO previous segment to read a loss spot '
        + 'from (⚠ CORRECTION #215.3-L5 — split out of restartSecondBall; expected empty).',
      thirdFrame: '⭐ thirds are named in the WINNING (new possessing) team\'s attacking frame. '
        + 'turnoverWonInFinalThird = a HIGH regain = the ball was lost in the LOSER\'s own third. The '
        + 'two frames are exact mirrors (localX_winner = −localX_loser), and the mirror is applied '
        + 'to the LOSS-tick position (the definitional spot).',
      lossSpotDefinition: '⭐ THE LOSS SPOT (#215.3-H1) = the ball\'s position at the segment\'s '
        + 'LAST OWNED tick, in the LOSING team\'s frame. It drives BOTH the 后场失误 count and the '
        + 'by-third origin classes. THE REGAIN SPOT (ball where the opponent established control) '
        + 'is published beside it everywhere, so the wedge between the two readings is data.',
      thirdBoundaryLocalX: round(THIRD_LOCAL_X, 6),
      thirdBoundaryTrace: 'HALF_L / 3 — the #188 / PM-T1 OWN_THIRD_LOCAL_X, inherited, mirrored for '
        + 'the final third.',
      forwardPredicate: `localX(destination) − localX(origin) > ${FORWARD_MIN_DX_M} m — the ENGINE'S `
        + 'OWN forward-pass predicate, traced to src/sim/mechanics.ts:406 (:497/:624/:644), the same '
        + 'test that increments stats.passesForward.',
      constructedLadder: CONSTRUCTED_LADDER,
      constructedLadderNote: '⭐ A REPORTING GRID (#214.1a), NOT a gate and NOT a tuned N.',
      dangerWindowsS: DANGER_WINDOWS_S,
      completedPassObservation: 'team.stats.passesCompleted deltas (count, side-attributed) + '
        + 'match.lastCompletedPass (location: passer release point → receiver position).',
      goalObservation: 'match.score deltas, mapped to the segment open at that tick.',
    },
    seedLedger: seedDisjoint,
    statsBase: { base: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, cluster: 'seed', minGap: statsMinGap },
    nRule: nDerivation,
  },
  referenceShapes: {
    houseLaw: '⭐⭐ SHAPES ONLY, AND THEY GATE NOTHING (VISION §3): 常数永不进口 — no number here '
      + 'reaches any sim value or any predicate in this probe.',
    axis: 'The build-up / transition / set-piece decomposition of goal origins is a standard '
      + 'real-football analytics axis — that SHAPE is what #214 cites, and it is why the split exists.',
    numericBands: 'ABSENT. The repo\'s reference file (docs/efootball_engine_research_for_evofootball.md) '
      + 'is an ENGINE study with no real-football goal-origin statistics, and no verified public '
      + 'figure is quoted here. ⇒ OUR GENEALOGY LEVELS ARE REPORTED AGAINST NO BAND.',
    repoOrientation: {
      what: 'the tempo census\'s band B3 (passes per open-play sequence, PUBLIC/Opta, league range '
        + '2.88–5.12) lives in docs/world-model/TEMPO-CENSUS.md §5. CITED, hashed, and READ FOR NO '
        + 'LEVEL — the 3/4/5 ladder is the ruling\'s own reporting grid, not a quantity derived from it.',
      artifact: citedTempo,
    },
    scaleCaveat: '⚠ every real-football shape is ELEVEN-a-side, full pitch. This world is 6v6 on a '
      + '0.70-scaled pitch with 240 sim-seconds mapped to 90 display-minutes. Counts do not transfer; '
      + 'only shapes and orderings are worth reading.',
  },
  result: { seeds: coreA.seeds, perArm: coreA.perArm },
  gates: xGates,
  xPass,
  deviations: [
    'A TOUCH / OWNERSHIP EPISODE IS NOT A FOOT-BALL CONTACT (inherited from the tempo census): Match '
      + 'exposes ball.owner, not a contact event. Deriving everything from observable state is REQUIRED '
      + 'by X-SRC-ZERO — the alternative was a telemetry hook in src/**, which #214.2 forbids.',
    'PASS DIRECTION IS OBSERVED ON COMPLETED PASSES AT THE RECEIVER\'S ACTUAL POSITION, while the '
      + 'engine\'s own passesForward counter fires at the STRIKE, on the INTENDED target\'s position, '
      + 'for ATTEMPTED passes. Same 2 m predicate, different population — declared, and the located '
      + 'share is published per arm.',
    'THE ORIGIN CLASSIFIER IS A CLASSIFIER. A deflected clearance collected cleanly is a turnover…; a '
      + 'contested one is a scrambleLooseBall — and the contested test is the SUBSTRATE\'S OWN '
      + 'possessionPhase classification, not a threshold of ours.',
    '⭐ THE REGAIN CROSS-CUT WAS ADDED AT PLUMBING TIME, BEFORE ANY MEASURED RUN, and is declared '
      + 'rather than quietly folded in: the bounded preflight showed the substrate\'s `contested` test '
      + 'absorbs ~60–70 % of regains, which would have left the three by-third origin classes nearly '
      + 'empty. The frozen ORIGIN CLASS LIST IS UNCHANGED; what was added is the ORTHOGONAL report '
      + '(where × contested) over EVERY open-play regain. No measured level was seen for any arm '
      + 'before this was frozen — the preflight is plumbing and adjudicates nothing.',
    '⚠⚠ THE #215 FIX ROUND (ruling #215.3, this artifact): the #214 build measured 后场失误 AND the '
      + 'by-third origin classes at the REGAIN tick while its own published definition said the LOSS '
      + 'tick. Both now read the ball at the segment\'s LAST OWNED tick, in the loser\'s frame, '
      + 'mirrored to the winner\'s frame for the classes — and the REGAIN-tick reading is published '
      + 'BESIDE the definitional one everywhere (atRegainSpot / byOriginAtRegainSpot / '
      + 'lossVsRegainWedge), because the gap between the two ticks is a real property of the world. '
      + 'Also fixed here: the GGC_SKIP_FP canonical-path bypass, the incomplete published stats-base '
      + 'ledger, and the restartSecondBall / matchOpenFallback conflation. Old claims stay readable.',
    'THE DANGEROUS-TURNOVER WINDOW IS TEMPORAL CO-OCCURRENCE, NOT CAUSATION.',
    'PROD IS NOT A SINGLE-FACTOR CONTROL (the declared confound above).',
    'NO REFERENCE BAND EXISTS FOR GOAL GENEALOGY — the levels are reported against nothing, and that '
      + 'absence is published rather than papered over with an unsourced number.',
    'THE ACCOUNTING IDENTITY CARRIES A THIRD BUCKET (looseGapTicks): ticks that are `playing` but '
      + 'ownerless with no segment open (a restart\'s whistle-to-first-touch). Disclosed and published, '
      + 'not folded into either neighbour.',
    'NO CHECKPOINT/RESUME: the battery is a few minutes, so a kill costs the whole run. Stated, not hidden.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS (Road B): zero src/** changes, the production fingerprint re-derived unchanged, '
      + 'every flag armed ONLY inside this instrument.',
    'NO PASS/FAIL ON ANY MEASURED QUANTITY. The gates are the X-family plus a tick/goal ACCOUNTING '
      + 'identity. No football number in this artifact has a threshold anywhere.',
    'THE LADDER THRESHOLDS ARE A REPORTING GRID (#214.1a) — no N is privileged and none is tunable '
      + 'after sight.',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING. Whether the user\'s #213 story (goals are '
      + 'turnover-fed; the attack cannot construct) is confirmed, refuted or split is the COMMANDER\'S '
      + 'adjudication from the per-arm rows (#203).',
  ],
  verdict,
};

/** ⭐ #181.2 + #197-M1: `resultSha256` hashes ONLY the timing-free AND commit-free measured body,
 *  so a third party re-running this probe at ANY commit re-derives it. `head` and every wall-clock
 *  field ride the envelope OUTSIDE the hash. The one git-derived field still inside is
 *  `gates.xSrcZero` — a GATE OUTPUT (empty on any clean tree at any commit), not a commit id. */
const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
/** ⭐ #215.3-M3, the SECOND limb of the guard, at the WRITE itself: no preflight artifact ever
 *  lands on a canonical repo path, whatever route (env, default, cap, skip) got it here. */
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error(`GOAL-GENEALOGY FATAL — refusing to write a PREFLIGHT artifact to the canonical path ${OUT_PATH} `
    + `(preflight because: ${PREFLIGHT_REASONS.join(' + ')}).`);
  process.exit(2);
}
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  sizing: sizingOut,
  headContextOnly: head,
  headNote: 'CONTEXT ONLY, and OUTSIDE resultSha256 (#197-M1): the git short-hash of the tree this run '
    + 'was launched from. Recorded for provenance and hashed NOWHERE, so the receipt re-derives at any '
    + 'later commit.',
  wallContextOnly: {
    corePassMs: passMs, totalMs: Date.now() - wall0,
    note: 'CONTEXT ONLY, and OUTSIDE resultSha256 (#128) — used in no gate. `sizing.msPerMatch` is the '
      + 'one timing number with a job: the wall term of the frozen N rule reads it.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §16 STDOUT — the per-arm rows (#203)                                       */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
o('');
o(`=== GOAL-GENEALOGY CENSUS (#214) — ${MODE} — HEAD ${head} — ${RUN_N} seeds × ${ARMS_COUNT} arms, `
  + `block ${firstSeed}..${lastSeed} ===`);
o('');
o('⭐ (a) GOAL GENEALOGY — per arm (DESCRIPTIVE; no gate reads any of it):');
for (const arm of ARMS) {
  const g = coreA.perArm[arm].goalGenealogy;
  o(`  ${arm.padEnd(5)} goals ${g.goals} (${g.goalsPerMatch}/match, CI ${JSON.stringify(g.goalsPerMatchCi95)})`
    + ` · family openPlay ${g.byFamilyShare.openPlay} · restart ${g.byFamilyShare.restart}`
    + ` · SET PIECE ${g.byFamilyShare.setPiece}`);
  o('        origins (LOSS-SPOT, definitional): ' + ORIGIN_CLASSES.map((c) => `${c} ${g.byOriginShare[c]}`).join(' · '));
  o('        origins (REGAIN-SPOT cross-cut):   ' + ORIGIN_CLASSES.map((c) => `${c} ${g.byOriginShareAtRegainSpot[c]}`).join(' · '));
  o('        ⭐ regain CROSS-CUT (where × contested): '
    + REGAIN_CELLS.map((c) => `${c} ${g.byRegainCell[c]}`).join(' · ')
    + ` · notARegain ${g.byRegainThird.notARegain}`);
  o(`        construction: completedPasses mean ${g.construction.completedPassesDist.mean}`
    + ` median ${g.construction.completedPassesDist.median} p90 ${g.construction.completedPassesDist.p90}`
    + ` · duration mean ${g.construction.durationSDist.mean}s · thirds mean ${g.construction.thirdsTraversedDist.mean}`);
  for (const n of CONSTRUCTED_LADDER) {
    type LadderCell = { constructed: number; transition: number; constructedShareOfPool: number };
    const nsp = (g.constructedLadder.nonSetPiece.ladder as Record<string, LadderCell>)[`ge${n}`];
    const opo = (g.constructedLadder.openPlayOriginOnly.ladder as Record<string, LadderCell>)[`ge${n}`];
    o(`        LADDER ≥${n}: non-set-piece constructed ${nsp.constructed} / transition ${nsp.transition}`
      + ` (share ${nsp.constructedShareOfPool}) · open-play-only constructed ${opo.constructed} / `
      + `transition ${opo.transition} (share ${opo.constructedShareOfPool})`);
  }
  o(`        own goals / deflections ${g.ownGoalsOrDeflections}`);
}
o('');
o('(b) 后场倒脚 — per arm:');
for (const arm of ARMS) {
  const b = coreA.perArm[arm].backThirdCirculation;
  o(`  ${arm.padEnd(5)} completedPasses/match ${b.completedPassesPerMatch} (located ${b.locatedShare})`
    + ` · ownThirdPassShare ${b.ownThirdPassShare} · lateral/backward of those ${b.lateralOrBackwardShareOfOwnThirdPasses}`);
  o(`        chains: mean ${b.ownThirdChains.meanChainLength} · meanMax/possession `
    + `${b.ownThirdChains.meanMaxChainPerPossession} · max ${b.ownThirdChains.maxChainObserved}`
    + ` · ownThirdTimeShare ${b.ownThirdTimeShare}`);
}
o('');
o('(c) 后场失误 — per arm:');
for (const arm of ARMS) {
  const e = coreA.perArm[arm].backThirdErrors;
  o(`  ${arm.padEnd(5)} ⭐ LOSS-SPOT (definitional) ownThirdTurnovers/match ${e.ownThirdTurnoversPerMatch} `
    + `(CI ${JSON.stringify(e.ownThirdTurnoversPerMatchCi95)}) · all turnovers/match ${e.turnoversPerMatch}`
    + ` · own-third share ${e.ownThirdShareOfAllTurnovers}`);
  o(`        ⭐ WEDGE loss ${e.lossVsRegainWedge.lossSpot} vs regain ${e.lossVsRegainWedge.regainSpot}`
    + ` (Δ ${e.lossVsRegainWedge.delta} · regain/loss ${e.lossVsRegainWedge.regainOverLossRatio})`
    + ` · regain-spot /match ${e.atRegainSpot.ownThirdTurnoversPerMatch}`);
  for (const d of e.dangerousLadder) {
    o(`        DANGEROUS @${d.windowS}s: → opponent shot ${d.turnoversFollowedByOpponentShot} `
      + `(${d.shareOfOwnThirdTurnovers}) · → opponent goal ${d.turnoversFollowedByOpponentGoal} `
      + `(${d.goalShareOfOwnThirdTurnovers})`);
  }
}
o('');
o('SEGMENT POPULATION (context):');
for (const arm of ARMS) {
  const s = coreA.perArm[arm].segmentPopulation;
  o(`  ${arm.padEnd(5)} segments/match ${s.segmentsPerMatch} · regain cross-cut share `
    + REGAIN_CELLS.map((c) => `${c} ${s.byRegainCellShareOfRegains[c]}`).join(' · '));
}
o('ACCOUNTING (gate input — ticks and goals, not football):');
for (const r of segAcct.rows) {
  o(`  ${r.arm.padEnd(5)} ticks ${r.totalTicks} = segment ${r.segmentTicks} + loose ${r.looseGapTicks}`
    + ` + deadBall ${r.deadBallTicks} ⇒ ${r.ticksIdentity ? 'ok' : 'BROKEN'}`
    + ` · goals ${r.goalsFromScore} → mapped ${r.goalsMappedToSegments} (unattributed ${r.unattributedGoals})`
    + ` ⇒ ${r.goalsIdentity ? 'ok' : 'BROKEN'} · looseGapShare ${r.looseGapShare}`);
}
o('');
o(`X-FAMILY ${xPass ? 'GREEN' : '*** RED ***'}: `
  + Object.entries(xGates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
for (const r of armCheck.rows) {
  o(`  gArm ${r.arm.padEnd(5)} version ${r.version} dose ${String(r.dose)} · flags `
    + `${r.version === 0 ? `absent ${r.noFlags}` : `on ${r.flagsOn}`} · genes `
    + `${r.version === 0 ? `absent ${r.genesAbsent}` : `dosed ${r.genesDosed}`} · eyeNull ${r.eyeNull}`
    + ` · evolveOptInsOff ${r.evolveOptInsOff} · readback ${r.readback} ⇒ ${r.pass ? 'PASS' : 'FAIL'}`);
}
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s · ${round(msPerMatchMeasured, 1)} ms/match`
  + ` · goals/match min ${sizingOut.goalsPerMatchMin} · artifact ${OUT_PATH}`);
o(`VERDICT: ${verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!xPass) process.exit(1);
process.exit(0);
