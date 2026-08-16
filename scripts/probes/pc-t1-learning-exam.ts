/**
 * PC-T1 — THE LEARNING EXAM (docs/world-model/PC-T1-LEARNING-EXAM.md).
 *
 * Dispatched by ruling #298 item 6 under PC-PERCEPTION-CONTRACT.md §2 (M-PC.1–5), on the seam
 * built at PC-T0 and AMENDED at the head of this stage (#298 item 4). The L3-T1 exam FORM:
 * multi-season ARMED leagues, every published face re-derived from stored per-cluster cells.
 *
 * ⭐ NOTHING HERE SCORES H-PC.1. H-PC.1(a) is scored at PC-T2 (#297 item 4 H2: "H-PC.1(a) is
 * scored at CELL grain"); this stage PREVIEWS the differentiation faces and MEASURES the
 * things the census could only assume.
 *
 * THE SIX QUESTIONS (#298 item 6):
 *   (1) ⭐ DO THE BOOKS FILL AS THE CENSUS ARITHMETIC PREDICTS — per-cell fill trajectories vs
 *       PC-C0's predicted fill times; ⭐ and THE RELATION SPLIT MEASURED AT LAST (PC-T0 §DOUBTS
 *       3 assumed 50/50 and said so), with the fill table of record CORRECTED.
 *   (2) ⭐ TIER DIFFERENTIATION AT CELL GRAIN — within a body across cells, and across bodies
 *       within a cell, with CIs bootstrapped over BOOKS.
 *   (3) ⭐ THE SENSITIVITY BAND — tier-transition curves at N_cover = 9 · 18 · 36, re-derived
 *       INSTRUMENT-SIDE from the same exposure streams (the shipped world always runs
 *       PC_N_COVER; nothing here ships a different N). "A conclusion that flips across the
 *       band is no conclusion" (#297 item 4 H1).
 *   (4) ROLE DIFFERENTIATION, REPORTED — H2's honest test, never scored.
 *   (5) THE ADDED-LAG RECEIPT — a small PAIRED battery (base v7 vs v7+PC, same seeds) with the
 *       PC-C0 decide-lag instrument re-run commensurably: added-lag = armed − base. The
 *       world's own ≈6.54-tick cadence (#297 corrections item 2) is NOT the seam's credit.
 *       Plus: season reset actually resets, and the four amendment behaviours live.
 *   (6) SELF-STARVATION — does maturity change the exposure SUPPLY (the L3-T2 lesson)?
 *
 * ⭐ CLOCK CONVENTION, stated once: every duration in this artifact is APPLIED TICKS on the SIM
 *   clock (`DT = 1/60` sim-s) unless the field NAME ends `SimSeconds`, `Metres`, `Seasons` or
 *   `Share` (#294 item 3: "a field carries the unit its name claims").
 *
 * ⭐⭐ THE ALLOWLIST SCHEMA (#298 item 3 canon, and this stage is its FIRST RIDER): "the hashed
 *   body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never enters
 *   the body; forbidden-name lists are retired." `BODY_SCHEMA` below is that schema; the body
 *   is passed through `applySchema`, which REFUSES THE RUN (exit 3) on any key the schema does
 *   not name, on any schema key the body does not carry, and on any object smuggled into a
 *   leaf slot. Invocation facts live in the ENVELOPE and cannot reach the digest.
 *
 * ⭐ INSTRUMENT-ONLY AFTER THE AMENDMENT: `src/**` moves only by the amendment commit at the
 *   head of this stage. `gSrcScope` asserts BOTH halves — the amendment's declared scope
 *   against the dispatch commit, and NOTHING since the amendment commit.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: PCT1_MODE (smoke|full, REQUIRED) · PCT1_BOOKS · PCT1_SEASONS · PCT1_PAIRS ·
 *             PCT1_SKIP_FP · PCT1_OUT.
 *   ANY other `PCT1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it may not write a canonical repo path.
 *
 * RUN: PCT1_MODE=full npx tsx scripts/probes/pc-t1-learning-exam.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { interceptBall } from '../../src/ai/perception';
import {
  PC_BOOK_CELLS, PC_CLASSES, PC_N_COVER, PC_N_COVER_SENSITIVITY, PC_RELEVANCE_M,
  PC_TIER_CHOICE_TICKS, PC_TIER_SIMPLE_TICKS, PcRecognitionBook, pcHoldKeptOlderExpiry,
  pcRecognitionKey, pcTierTicks, type PcClass, type PcTier,
} from '../../src/ai/pcLatency';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells, L3_T1_SHA,
} from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROLES, ROSTER_SIZE, TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PCT1_MODE', 'PCT1_BOOKS', 'PCT1_SEASONS', 'PCT1_PAIRS', 'PCT1_SKIP_FP',
  'PCT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PCT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('PC-T1 FATAL — refused env surface. '
    + `rogue PCT1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PCT1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`PC-T1 FATAL — PCT1_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v !== undefined
  ? Math.max(1, Number.parseInt(v, 10)) : null);
const BOOKS_ENV = intEnv(process.env.PCT1_BOOKS);
const SEASONS_ENV = intEnv(process.env.PCT1_SEASONS);
const PAIRS_ENV = intEnv(process.env.PCT1_PAIRS);
const SKIP_FP = process.env.PCT1_SKIP_FP === '1';
const OUT_ENV = process.env.PCT1_OUT;
const PREFLIGHT_REASONS = [
  ...(BOOKS_ENV !== null ? ['PCT1_BOOKS'] : []),
  ...(SEASONS_ENV !== null ? ['PCT1_SEASONS'] : []),
  ...(PAIRS_ENV !== null ? ['PCT1_PAIRS'] : []),
  ...(SKIP_FP ? ['PCT1_SKIP_FP'] : []),
  ...(OUT_ENV !== undefined ? ['PCT1_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pc-t1-learning-exam-smoke.json',
  full: 'docs/world-model/data/pc-t1-learning-exam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pc-t1-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('PC-T1 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 SMALL HELPERS                                                            */
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
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
/** p-th percentile from a HISTOGRAM (stored bins — #297 corrections item 4). */
const pctFromBins = (bins: readonly number[], p: number): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  const want = p * n;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= want) return i;
  }
  return bins.length - 1;
};
const zeros = (n: number): number[] => Array.from({ length: n }, () => 0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 THE SRC SCOPE — the amendment, and NOTHING after it                      */
/* ========================================================================== */
/** ⭐ The dispatch commit — ruling #298's own landing, the amendment's diff reference. */
const DISPATCH_COMMIT = '1b36da7';
/** ⭐ THE AMENDMENT COMMIT — the head of this stage. `src` may not move after it. */
const AMENDMENT_COMMIT = 'f5e470c';
/** ⭐ The amendment's DECLARED src scope — the whole of it, nothing else may have moved. */
const AMENDMENT_SRC_SCOPE: readonly string[] = ['src/ai/pcLatency.ts', 'src/sim/Match.ts'];
const SRC_SINCE_DISPATCH = gitOut(`git diff --name-only ${DISPATCH_COMMIT} -- src`)
  .split('\n').filter((s) => s.length > 0).sort();
const SRC_SINCE_AMENDMENT = gitOut(`git diff --stat ${AMENDMENT_COMMIT} HEAD -- src`).trim();
const SRC_WORKTREE_STATUS = gitOut('git status --porcelain -- src');

/* ========================================================================== */
/* §3 DATA SOURCES — every guard hashes the FILE BYTES it reads                */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const T1_BYTES = readFileSync(T1_PATH, 'utf8');
const DOSE = poolT1DoseCells(JSON.parse(T1_BYTES) as Record<string, unknown>);
const DOSE_FILE_BYTES_SHA = sha(T1_BYTES);
const DOSE_REDERIVED_SHA = (() => {
  const cc = JSON.parse(T1_BYTES) as Record<string, unknown>;
  delete cc.resultSha256;
  delete cc.envelope;
  return sha(canonical(cc));
})();
/** ⭐ THE CENSUS ARITHMETIC THIS EXAM TESTS — read from PC-C0's own artifact, never retyped. */
const C0_PATH = 'docs/world-model/data/pc-c0-reaction-baseline.json';
const C0_BYTES = readFileSync(C0_PATH, 'utf8');
const C0_FILE_BYTES_SHA = sha(C0_BYTES);
const C0 = JSON.parse(C0_BYTES) as Record<string, unknown>;
const C0_REDERIVED_SHA = (() => {
  const cc = JSON.parse(C0_BYTES) as Record<string, unknown>;
  delete cc.resultSha256;
  delete cc.envelope;
  return sha(canonical(cc));
})();
const C0_COMMITTED_SHA = String(C0.resultSha256 ?? '');
/** the PC-T0 artifact — read for its own tier receipt, hashed by BYTES like every source. */
const T0_PATH = 'docs/world-model/data/pc-t0-seam-receipts.json';
const T0_BYTES = readFileSync(T0_PATH, 'utf8');
const T0_FILE_BYTES_SHA = sha(T0_BYTES);

const ROLE_LIST: readonly Role[] = ['GK', 'DF', 'MF', 'WG', 'ST'];
const ROLE_IDX: Record<string, number> = Object.fromEntries(ROLE_LIST.map((r, i) => [r, i]));

/** exposures per BODY per SEASON, per class per role — PC-C0 §CLASSES + EXPOSURE (c). */
const C0_EXPOSURES: Record<string, number> = {};
for (const row of (C0.exposure as { perClass: { klass: string; perRole: {
  role: string; exposuresPerBodyPerSeason: number }[] }[] }).perClass) {
  for (const r of row.perRole) C0_EXPOSURES[`${row.klass}|${r.role}`] = r.exposuresPerBodyPerSeason;
}
/** the PRESSED share of each class's EVENTS — PC-C0's own split, from its own run block. */
const C0_RUN = C0.run as { eventsByClass: Record<string, number>;
  eventsByClassPressed: Record<string, number> };
const C0_PRESSED_SHARE: Record<string, number> = Object.fromEntries(PC_CLASSES.map((k) => [k,
  C0_RUN.eventsByClass[k] === 0 ? 0 : C0_RUN.eventsByClassPressed[k] / C0_RUN.eventsByClass[k]]));
/** A SEASON = 7 league fixtures per franchise — traced from PC-C0, never typed here. */
const FIXTURES_PER_SEASON = 7;
const C0_SEASON_DEFINITION = String((C0.exposure as { seasonDefinition: string }).seasonDefinition);
if (!C0_SEASON_DEFINITION.startsWith('7 league fixtures per franchise per season')) {
  console.error('PC-T1 FATAL — the census season definition moved; FIXTURES_PER_SEASON is stale.');
  process.exit(3);
}

/* ========================================================================== */
/* §4 SEEDS — BOOKED = WALKED (ruling #298 item 5: the block is ≥ 12,498,000)   */
/* ========================================================================== */
const BLOCK: readonly [number, number] = [12_498_000, 12_498_999];
const BATTERY_BASE = 12_498_000;
const BOOKS_FROZEN = 12;
const SEASONS_FROZEN = 8;
const PAIR_BASE = 12_498_700;
const PAIRS_FROZEN = 12;
const PIN_SUITE_SEEDS: readonly number[] = [12_498_800, 12_498_801, 12_498_802];
/** ⚠ DISCLOSED: the amendment's own bench measurements (H4 rate, dead-ball clears). */
const AMENDMENT_SCRATCH: readonly [number, number] = [12_498_803, 12_498_819];
/** ⚠ DECLARED and DRAWN: this probe's preflight band (see §SEEDS in the stage doc). */
const PREFLIGHT_BAND: readonly [number, number] = [12_498_900, 12_498_999];
const RETIRED_BLOCK: readonly [number, number] = [12_494_000, 12_494_999];
/** the world-identity band, FOREIGN and disclosed — PW-T0b's consumed block, re-walked only. */
const WORLD_IDENTITY_SEEDS: readonly number[] = Array.from({ length: 10 }, (_, i) => 12_492_900 + i);
const WORLD_IDENTITY_POOLED_AT_HEAD =
  '5dafce81dfc26677147d6734c10118cfcff40b771c117da011a04eb44fc1f70c';
const LEAGUE_FINGERPRINT_AT_HEAD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_FINGERPRINT_SEED = 1337;
const LEAGUE_FINGERPRINT_SEASONS = 2;
/** ⭐ THE STATS STREAM (ruling #298 item 5: the floor is 113,200). One seed per CI family. */
const STATS_FLOOR_FROM_RULING = 113_200;
const STATS_SEEDS: readonly number[] = [113_200, 113_201, 113_202, 113_203, 113_204];
const BOOTSTRAP = 2000;

const BOOKS = BOOKS_ENV ?? (MODE === 'smoke' ? 2 : BOOKS_FROZEN);
const SEASONS = SEASONS_ENV ?? (MODE === 'smoke' ? 2 : SEASONS_FROZEN);
const PAIRS = PAIRS_ENV ?? (MODE === 'smoke' ? 2 : PAIRS_FROZEN);
const MATCHES_PER_BOOK = FIXTURES_PER_SEASON * SEASONS;
const BATTERY_SPAN = BOOKS * MATCHES_PER_BOOK;
const PAIR_SEEDS = Array.from({ length: PAIRS }, (_, i) => PAIR_BASE + i);

/* ========================================================================== */
/* §5 THE ARM — matchFlags ASSERTED LIVE, matches CONSTRUCTED DIRECTLY         */
/* ========================================================================== */
/**
 * ⭐ #283.2(iv): "worker-simmed fixtures play the SHIPPED world (League.toJSON omits
 * matchFlags)" — so every fixture here is constructed DIRECTLY with its flags and the arm is
 * ASSERTED LIVE on every walk (`gArms`), never assumed from a League round-trip.
 *
 * ⭐ A BOOK = A FRANCHISE PAIR WALKED ACROSS SEASONS. The two TeamInfos are fixed for the whole
 * book, so the same twelve bodies (and the same nine roster slots a side) live the whole
 * career — which is what makes "his own book" and the role faces mean anything. Only the SEED
 * varies fixture to fixture, exactly as a league schedule varies the match.
 */
const V7 = 7 as const;
const rngTeam = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const bookTeams = (book: number): [TeamInfo, TeamInfo] => [
  rngTeam('A', BATTERY_BASE + book * 1000 + 1),
  rngTeam('B', BATTERY_BASE + book * 1000 + 2),
];
interface ArmOpts {
  pc?: boolean;
  bare?: boolean;
  teams?: [TeamInfo, TeamInfo];
  books?: readonly [PcRecognitionBook, PcRecognitionBook];
}
const makeMatch = (seed: number, opts: ArmOpts): Match => {
  const [teamA, teamB] = opts.teams ?? [rngTeam('A', seed * 2 + 1), rngTeam('B', seed * 2 + 2)];
  const pcCfg = opts.pc === true
    ? { pcReactionLatency: true, ...(opts.books === undefined ? {} : { pcRecognitionBooks: opts.books }) }
    : {};
  if (opts.bare === true) return new Match({ seed, teamA, teamB, ...pcCfg });
  const m = new Match({ seed, teamA, teamB, ...a4MatchFlags(V7), ...pcCfg });
  armA4World(m, null, V7, DOSE);
  return m;
};

/* ========================================================================== */
/* §6 DORMANCY, RE-PROVEN AFTER THE AMENDMENT (the house method)               */
/* ========================================================================== */
const signatureOf = (m: Match): string => {
  const trace: number[] = [];
  let ticks = 0;
  while (!m.finished && ticks < 60_000) {
    m.step(DT);
    ticks++;
    if (ticks % 37 === 0) {
      trace.push(m.ball.pos.x, m.ball.pos.y, m.ball.vel.x, m.ball.vel.y, m.score[0], m.score[1]);
      for (const t of m.teams) for (const p of t.players) trace.push(p.pos.x, p.pos.y, p.heading.x);
    }
  }
  const r = m.getResult();
  return sha(JSON.stringify({
    trace: trace.map((v) => Math.round(v * 1e9)),
    score: r.score, stats: r.stats, events: r.events.length, ticks,
  }));
};
const IDENTITY_SEEDS = MODE === 'smoke' ? WORLD_IDENTITY_SEEDS.slice(0, 2) : WORLD_IDENTITY_SEEDS;
const IDENTITY_COMPLETE = IDENTITY_SEEDS.length === WORLD_IDENTITY_SEEDS.length;
const tId0 = Date.now();
const identityRows: string[] = [];
for (const s of IDENTITY_SEEDS) identityRows.push(`bare ${s} ${signatureOf(makeMatch(s, { bare: true }))}`);
for (const s of IDENTITY_SEEDS) identityRows.push(`v7 ${s} ${signatureOf(makeMatch(s, {}))}`);
const IDENTITY_POOLED = sha(identityRows.join('|'));
/** flag-ABSENT ≡ flag-FALSE, per seed, per world shape — the other half of Road B. */
const absentEqualsFalse: boolean[] = [];
for (const s of IDENTITY_SEEDS.slice(0, 2)) {
  for (const bare of [true, false]) {
    const teams: [TeamInfo, TeamInfo] = [rngTeam('A', s * 2 + 1), rngTeam('B', s * 2 + 2)];
    const buildFalse = (): Match => {
      if (bare) return new Match({ seed: s, teamA: teams[0], teamB: teams[1], pcReactionLatency: false });
      const mm = new Match({
        seed: s, teamA: teams[0], teamB: teams[1], ...a4MatchFlags(V7), pcReactionLatency: false,
      });
      armA4World(mm, null, V7, DOSE);
      return mm;
    };
    absentEqualsFalse.push(signatureOf(makeMatch(s, { bare })) === signatureOf(buildFalse()));
  }
}
const LEAGUE_FP = SKIP_FP ? 'SKIPPED'
  : gitOut(`npx tsx scripts/fingerprint.ts ${LEAGUE_FINGERPRINT_SEED} ${LEAGUE_FINGERPRINT_SEASONS}`)
    .split('\n').map((l) => l.trim()).find((l) => l.startsWith('sha256='))?.slice(7) ?? 'FP-FAILED';
const IDENTITY_MS = Date.now() - tId0;

/* ========================================================================== */
/* §7 THE LEAGUE BATTERY — the DETERMINISTIC CORE (G-DET runs it twice)        */
/* ========================================================================== */
const N_BAND = PC_N_COVER_SENSITIVITY;
const N_CELLS = PC_BOOK_CELLS.length;
const N_BODIES = 2 * ROSTER_SIZE;
const CELL_IDX: Record<string, number> = Object.fromEntries(PC_BOOK_CELLS.map((c, i) => [c, i]));
const CLASS_IDX: Record<string, number> = Object.fromEntries(PC_CLASSES.map((c, i) => [c, i]));

/**
 * ⭐⭐ THE INSTRUMENT-SIDE N SWEEP, and why it is exact rather than a re-walk.
 *
 * The seat writes EXACTLY ONE exposure per arm (`exposuresNoted === arms`, pinned at PC-T0),
 * and it decides the tier BEFORE writing it. So the coverage count a body had for a cell at the
 * moment he was armed is, exactly, THE NUMBER OF TIMES HE HAS ALREADY BEEN ARMED IN THAT CELL
 * SINCE THE LAST SEASON RESET. The instrument keeps that running count and re-derives
 * `tier(N) = priorArms >= N ? simple : choice` for every N in the band — from the SAME exposure
 * stream the shipped world ran, with no second walk and no second N shipped into any world.
 * `gNSweep` proves the re-derivation at N = PC_N_COVER reproduces the seat's OWN tier on 100 %
 * of arms, which is what makes the other two rungs of the band trustworthy.
 */
interface BookCells {
  book: number;
  seedFirst: number;
  seedLast: number;
  /** per season, per fixture (1..7), per N: covered BODY-CELLS at the end of that fixture. */
  coveredByFixture: number[][][];
  /** per season, per N: covered BODY-CELLS at the end of the season (before the reset). */
  coveredAtSeasonEnd: number[][];
  /** ⭐ the relation split, MEASURED: exposures per class per relation (0 = own, 1 = opp). */
  expByClassRelation: number[][];
  /** exposures per class per pressed (0 = pressed, 1 = open) — the other half of the key. */
  expByClassPressed: number[][];
  /** arms per cell (28), pooled over the book. */
  armsByCell: number[];
  /** simple-tier arms per cell per N. */
  simpleByCellAtN: number[][];
  /** arms per season per cell — the tier-by-cell matrix OVER SEASONS. */
  armsBySeasonCell: number[][];
  /** simple arms per N per season per cell. */
  simpleAtNBySeasonCell: number[][][];
  /** arms per role (5) and simple per role per N. */
  armsByRole: number[];
  simpleByRoleAtN: number[][];
  /** ⭐ the body × cell matrix, pooled over seasons: arms, and simple per N. */
  armsByBodyCell: number[][];
  simpleAtNByBodyCell: number[][][];
  /** per season: arms, firings, applied ticks — the SELF-STARVATION trajectory. */
  armsBySeason: number[];
  firingsBySeason: number[];
  ticksBySeason: number[];
  /** per season: exposures the books held at the end of the season (the fill receipt). */
  bookExposuresAtSeasonEnd: number[];
  /** ⭐ the SEASON-RESET receipt: exposures the books held immediately AFTER each reset. */
  bookExposuresAfterReset: number[];
  /** the seat ledger, pooled over the book's fixtures, in COUNTER_FIELD_ORDER. */
  counters: number[];
  /** matches walked, and the arm receipts. */
  matches: number;
  armsOk: number;
}

const COUNTER_FIELD_ORDER = ['appliedTicks', 'firings', 'arms', 'armsSimple', 'armsChoice',
  'overlapRestarts', 'overlapNoExtend', 'heldExecutorTicks', 'decisionsHeld', 'exposuresNoted',
  'armedWithMemory', 'preProcessedSkips', 'heldThroughReassignment', 'subClears',
  'subClearedLiveHolds', 'subClearedMemories', 'deadBallClears', 'deadBallClearedHolds',
  'subSwapsSeen', 'subSwapsWithInheritedHold'] as const;
const CF = Object.fromEntries(COUNTER_FIELD_ORDER.map((k, i) => [k, i])) as Record<string, number>;

const emptyBookCells = (book: number): BookCells => ({
  book,
  seedFirst: 0,
  seedLast: 0,
  coveredByFixture: Array.from({ length: SEASONS }, () => zeros2(FIXTURES_PER_SEASON, N_BAND.length)),
  coveredAtSeasonEnd: zeros2(SEASONS, N_BAND.length),
  expByClassRelation: zeros2(PC_CLASSES.length, 2),
  expByClassPressed: zeros2(PC_CLASSES.length, 2),
  armsByCell: zeros(N_CELLS),
  simpleByCellAtN: zeros2(N_CELLS, N_BAND.length),
  armsBySeasonCell: zeros2(SEASONS, N_CELLS),
  simpleAtNBySeasonCell: Array.from({ length: N_BAND.length }, () => zeros2(SEASONS, N_CELLS)),
  armsByRole: zeros(ROLE_LIST.length),
  simpleByRoleAtN: zeros2(ROLE_LIST.length, N_BAND.length),
  armsByBodyCell: zeros2(N_BODIES, N_CELLS),
  simpleAtNByBodyCell: Array.from({ length: N_BAND.length }, () => zeros2(N_BODIES, N_CELLS)),
  armsBySeason: zeros(SEASONS),
  firingsBySeason: zeros(SEASONS),
  ticksBySeason: zeros(SEASONS),
  bookExposuresAtSeasonEnd: zeros(SEASONS),
  bookExposuresAfterReset: zeros(SEASONS),
  counters: zeros(COUNTER_FIELD_ORDER.length),
  matches: 0,
  armsOk: 0,
});

/** the instrument's own coverage counter — priorArms[body][cell], reset with the books. */
type Counts = number[][];
const freshCounts = (): Counts => zeros2(N_BODIES, N_CELLS);

/** ⭐ gNSweep's own tally: does the re-derivation at PC_N_COVER match the seat's own tier? */
const sweepAgreement = { arms: 0, agreed: 0 };

const walkBook = (book: number): BookCells => {
  const cells = emptyBookCells(book);
  const teams = bookTeams(book);
  const books: readonly [PcRecognitionBook, PcRecognitionBook] =
    [new PcRecognitionBook(), new PcRecognitionBook()];
  let counts = freshCounts();
  cells.seedFirst = BATTERY_BASE + book * MATCHES_PER_BOOK;
  cells.seedLast = cells.seedFirst + MATCHES_PER_BOOK - 1;
  for (let i = 0; i < MATCHES_PER_BOOK; i++) {
    const season = Math.floor(i / FIXTURES_PER_SEASON);
    const fixture = i % FIXTURES_PER_SEASON;
    const seed = cells.seedFirst + i;
    const m = makeMatch(seed, { pc: true, teams, books });
    const seat = m.pcLatency;
    if (seat === null) throw new Error('PC-T1 FATAL — a battery walk is not armed.');
    const players = m.allPlayers;
    const armOk = a4ArmedVersion(m) === V7 && l3ArmedVersion(m) === V7 && m.pcReactionLatency;
    if (armOk) cells.armsOk++;
    cells.matches++;
    const nTicks = Math.round(MATCH_DURATION / DT);
    /** the last hold we saw per gid, so a NEW arm is a new (gid, armedTick) pair. */
    const lastArmedTick = new Map<number, number>();
    // ⭐ AMENDMENT (a)'s INDEPENDENT CAMERA, run over the WHOLE battery: the man standing in
    // each pitch slot, by roster index. When the slot's man changes, a substitution happened —
    // and no hold may be live on that gid afterwards.
    const slotRoster = players.map((p) => p.rosterIdx);
    let subSwapsSeen = 0;
    let subSwapsInherited = 0;
    let ticks = 0;
    while (!m.finished && ticks < nTicks + 600) {
      m.step(DT);
      ticks++;
      for (const p of players) {
        if (slotRoster[p.gid] === p.rosterIdx) continue;
        slotRoster[p.gid] = p.rosterIdx;
        subSwapsSeen++;
        if (seat.holdFor(p.gid, m.simTick) !== null) subSwapsInherited++;
      }
      for (const { gid, hold } of seat.holdSnapshot()) {
        if (lastArmedTick.get(gid) === hold.armedTick) continue;
        lastArmedTick.set(gid, hold.armedTick);
        // ⭐ A NEW ARM. Everything below is instrument-side bookkeeping off the seat's own
        // read-only view; nothing here can touch the world.
        const p = players[gid];
        const body = p.side * ROSTER_SIZE + p.rosterIdx;
        const cell = CELL_IDX[hold.key];
        const klass = CLASS_IDX[hold.klass];
        const rel = hold.key.endsWith('|own') ? 0 : 1;
        const pressed = hold.key.includes('|pressed|') ? 0 : 1;
        const prior = counts[body][cell];
        // ⭐ THE INSTRUMENT-SIDE SWEEP, checked against the seat at the shipped N
        sweepAgreement.arms++;
        const derivedAtShipped: PcTier = prior >= PC_N_COVER ? 'simple' : 'choice';
        if (derivedAtShipped === hold.tier) sweepAgreement.agreed++;
        cells.armsByCell[cell]++;
        cells.armsBySeasonCell[season][cell]++;
        cells.armsByRole[ROLE_IDX[p.role]]++;
        cells.armsByBodyCell[body][cell]++;
        cells.armsBySeason[season]++;
        cells.expByClassRelation[klass][rel]++;
        cells.expByClassPressed[klass][pressed]++;
        N_BAND.forEach((n, ni) => {
          if (prior >= n) {
            cells.simpleByCellAtN[cell][ni]++;
            cells.simpleAtNBySeasonCell[ni][season][cell]++;
            cells.simpleByRoleAtN[ROLE_IDX[p.role]][ni]++;
            cells.simpleAtNByBodyCell[ni][body][cell]++;
          }
        });
        counts[body][cell] = prior + 1;
      }
    }
    const led = seat.ledger;
    const armsThis = led.armedByTier.simple + led.armedByTier.choice;
    const firingsThis = sum(PC_CLASSES.map((k) => led.firings[k]));
    cells.firingsBySeason[season] += firingsThis;
    cells.ticksBySeason[season] += ticks;
    const add = [ticks, firingsThis, armsThis, led.armedByTier.simple, led.armedByTier.choice,
      led.overlapRestarts, led.overlapNoExtend, led.heldExecutorTicks, led.decisionsHeld,
      led.exposuresNoted, led.armedWithMemory, led.preProcessedSkips,
      led.heldThroughReassignment, led.subClears, led.subClearedLiveHolds,
      led.subClearedMemories, led.deadBallClears, led.deadBallClearedHolds,
      subSwapsSeen, subSwapsInherited];
    add.forEach((v, k) => { cells.counters[k] += v; });
    // ⭐ THE FILL TRAJECTORY, read from the BOOKS themselves at every fixture boundary
    const covered = zeros(N_BAND.length);
    for (const b of books) {
      const snap = b.snapshot();
      for (const row of Object.values(snap)) {
        for (const v of Object.values(row)) {
          N_BAND.forEach((n, ni) => { if (v >= n) covered[ni]++; });
        }
      }
    }
    covered.forEach((v, ni) => { cells.coveredByFixture[season][fixture][ni] = v; });
    if (fixture === FIXTURES_PER_SEASON - 1) {
      covered.forEach((v, ni) => { cells.coveredAtSeasonEnd[season][ni] = v; });
      cells.bookExposuresAtSeasonEnd[season] = books[0].totalExposures + books[1].totalExposures;
      // ⭐ THE SEASON BOUNDARY, exactly as `League.startSeason` does it (M-PC.3)
      for (const b of books) b.reset();
      counts = freshCounts();
      cells.bookExposuresAfterReset[season] = books[0].totalExposures + books[1].totalExposures;
    }
  }
  return cells;
};

const coreRun = (): BookCells[] => {
  sweepAgreement.arms = 0;
  sweepAgreement.agreed = 0;
  const out: BookCells[] = [];
  for (let b = 0; b < BOOKS; b++) {
    out.push(walkBook(b));
    banner(`  [pc-t1] book ${b + 1}/${BOOKS} — ${out[b].counters[CF.arms]} arms · `
      + `${out[b].counters[CF.armsSimple]} simple · ${out[b].matches} fixtures`);
  }
  return out;
};
banner(`  [pc-t1] mode=${MODE} books=${BOOKS} seasons=${SEASONS} `
  + `(${BATTERY_SPAN} fixtures) × 2 G-DET runs`);
const tWalk0 = Date.now();
const cellsA = coreRun();
const digestA = sha(canonical(cellsA));
const sweepA = { ...sweepAgreement };
banner('  [pc-t1] G-DET second run…');
const cellsB = coreRun();
const digestB = sha(canonical(cellsB));
const CELLS = cellsA;
const SWEEP = sweepA;
const WALK_MS = Date.now() - tWalk0;

/* ========================================================================== */
/* §8 THE PAIRED ADDED-LAG BATTERY — the PC-C0 instrument, re-run commensurably */
/* ========================================================================== */
/**
 * ⭐ #297 item 5 ADDITIVITY, binding: "the exam reports added-lag = armed − base at event
 * grain, never the raw total". The world's own decide cadence — the corrected mean ≈ 6.54
 * applied ticks (#297 corrections item 2) — must NOT be credited to the seam.
 *
 * THE INSTRUMENT is PC-C0's DECIDE channel verbatim: for every affected body inside the
 * relevance radius of a surprise event, the first APPLIED tick k at which he enters a step with
 * an open decision slot (`decisionTimer <= 0`). ⭐ The published value is `k + 1`, the
 * k−1-corrected form of record (#297 corrections item 2: events are written AFTER the decide
 * loop within the same step), so the BASE arm is directly comparable with the census's 6.54.
 *
 * ⚠ PAIRING IS AT SEED LEVEL, NOT EVENT LEVEL, and the artifact says so: an armed world diverges
 * from its base within a few ticks, so the two arms do not contain the same events. The receipt
 * is the difference of two DISTRIBUTIONS drawn from the same seeds, which is what "same seeds"
 * can buy — and the denominators are published per arm because they MOVE.
 */
const H_DECIDE = 60; // 1.0 sim-s — PC-C0's own horizon, reused verbatim
const H_STEER = 30; // PC-C0's steering horizon, reused for the applied-hold receipt
const STEER_EPS_M = 0.05;

interface LagRow {
  seed: number;
  arm: 'base' | 'armed';
  armOk: boolean;
  ticks: number;
  events: number;
  bodies: number;
  /** decide-lag histogram, index = k (0 = never reached a slot within the horizon). */
  decideBins: number[];
  /** ⭐ THE RE-DECIDE histogram — the first tick his `decisionTimer` was actually RE-ARMED. */
  redecideBins: number[];
  /** the steering channel, PC-C0's own applicable population (a DIFFERENT quantity — see doc). */
  steerApplicable: number;
  steerRetargetedOnFirstTick: number;
  /** hold-record receipts (armed arm only) */
  holdRecords: number;
  holdRecordsClean: number;
  holdRecordsCleanAtTierLength: number;
  holdRecordsKeptOlderExpiry: number;
  holdRecordsSuperseded: number;
  holdRecordsOpenAtWhistle: number;
  holdRecordsSpanningDeadBall: number;
  holdTickBins: number[];
  /** ⭐ the amendment cameras */
  subSwapsSeen: number;
  subSwapsWithInheritedHold: number;
  counters: number[];
}

const PAUSED = new Set(['kickoff', 'goalPause', 'halftime', 'fulltime']);

const walkLag = (seed: number, armed: boolean): LagRow => {
  const m = makeMatch(seed, armed ? { pc: true } : {});
  const seat = m.pcLatency;
  const players = m.allPlayers;
  const nTicks = Math.round(MATCH_DURATION / DT);
  const row: LagRow = {
    seed,
    arm: armed ? 'armed' : 'base',
    armOk: a4ArmedVersion(m) === V7 && l3ArmedVersion(m) === V7 && m.pcReactionLatency === armed,
    ticks: 0, events: 0, bodies: 0,
    decideBins: zeros(H_DECIDE + 1),
    redecideBins: zeros(H_DECIDE + 1),
    steerApplicable: 0, steerRetargetedOnFirstTick: 0,
    holdRecords: 0, holdRecordsClean: 0, holdRecordsCleanAtTierLength: 0,
    holdRecordsKeptOlderExpiry: 0, holdRecordsSuperseded: 0, holdRecordsOpenAtWhistle: 0,
    holdRecordsSpanningDeadBall: 0, holdTickBins: zeros(48),
    subSwapsSeen: 0, subSwapsWithInheritedHold: 0,
    counters: zeros(COUNTER_FIELD_ORDER.length),
  };
  interface WBody { gid: number; decide: number; redecide: number; frozenX: number;
    frozenY: number; frozenVX: number; frozenVY: number; steerDone: boolean }
  interface Win { startTick: number; bodies: WBody[] }
  const wins: Win[] = [];
  const prevTimer = new Float64Array(players.length);
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let lastKnownOwnerGid: number | null = prevOwnerGid;
  let prevTouchPasts = m.cbLedger.touchPasts;
  let prevDribbleTouchKey: string | null = m.dribbleTouch === null ? null
    : `${m.dribbleTouch.gid}:${m.dribbleTouch.until}`;
  let prevPendingPassT: number | null = m.pendingPass?.t ?? null;
  let prevPendingShot = m.pendingShot !== null;
  // ⭐ the SUB camera: the man standing in each pitch slot, by roster index
  const slotRoster = players.map((p) => p.rosterIdx);
  interface HoldRec { gid: number; armedTick: number; untilTick: number; ticks: number;
    tier: PcTier; observedTicks: number; spannedDeadBall: boolean; keptOlderExpiry: boolean;
    superseded: boolean; openAtWhistle: boolean }
  const open = new Map<number, HoldRec>();
  const done: HoldRec[] = [];

  for (let t = 0; t < nTicks; t++) {
    for (let i = 0; i < players.length; i++) prevTimer[i] = players[i].decisionTimer;
    const preBall = { x: m.ball.pos.x, y: m.ball.pos.y, vx: m.ball.vel.x, vy: m.ball.vel.y };
    const preOwnerGid = m.ball.owner?.gid ?? null;
    const preLastTouchGid = m.ball.lastTouch?.gid ?? null;
    const prePhase = m.phase;

    m.step(DT);
    row.ticks++;

    /* ---- the SUB camera (amendment (a)): the slot's man changed ⇒ no hold may survive ---- */
    if (seat !== null) {
      for (const p of players) {
        if (slotRoster[p.gid] === p.rosterIdx) continue;
        slotRoster[p.gid] = p.rosterIdx;
        row.subSwapsSeen++;
        if (seat.holdFor(p.gid, m.simTick) !== null) row.subSwapsWithInheritedHold++;
      }
    }

    /* ---- the hold-record camera (armed arm only) ---- */
    if (seat !== null) {
      const executorRan = !PAUSED.has(prePhase);
      const live = new Set<number>();
      for (const { gid, hold } of seat.holdSnapshot()) {
        live.add(gid);
        const rec = open.get(gid);
        if (rec === undefined || rec.armedTick !== hold.armedTick) {
          if (rec !== undefined) { rec.superseded = true; done.push(rec); }
          open.set(gid, {
            gid, armedTick: hold.armedTick, untilTick: hold.untilTick, ticks: hold.ticks,
            tier: hold.tier, observedTicks: executorRan ? 1 : 0,
            spannedDeadBall: !executorRan, keptOlderExpiry: pcHoldKeptOlderExpiry(hold),
            superseded: false, openAtWhistle: false,
          });
        } else {
          if (executorRan) rec.observedTicks++; else rec.spannedDeadBall = true;
          rec.untilTick = hold.untilTick;
          rec.keptOlderExpiry = rec.keptOlderExpiry || pcHoldKeptOlderExpiry(
            { untilTick: hold.untilTick, armedTick: rec.armedTick, ticks: rec.ticks },
          );
        }
      }
      for (const [gid, rec] of [...open]) {
        if (!live.has(gid)) { done.push(rec); open.delete(gid); }
      }
    }

    /* ---- PC-C0's event predicates, verbatim ---- */
    const ownerGid = m.ball.owner?.gid ?? null;
    const lastTouchGid = m.ball.lastTouch?.gid ?? null;
    const touchPasts = m.cbLedger.touchPasts;
    const dribbleTouchGid = m.dribbleTouch?.gid ?? null;
    const dribbleTouchKey = m.dribbleTouch === null ? null
      : `${m.dribbleTouch.gid}:${m.dribbleTouch.until}`;
    const pendingPassT = m.pendingPass?.t ?? null;
    const pendingShot = m.pendingShot !== null;
    const fired: { initiatorGid: number | null }[] = [];
    if (prePhase === 'playing' && m.phase === 'playing') {
      if (touchPasts > prevTouchPasts) fired.push({ initiatorGid: lastTouchGid });
      else if (dribbleTouchKey !== null && dribbleTouchKey !== prevDribbleTouchKey) {
        fired.push({ initiatorGid: lastTouchGid });
      }
      if (pendingPassT !== null && pendingPassT !== prevPendingPassT) {
        fired.push({ initiatorGid: m.pendingPass?.passerGid ?? lastTouchGid });
      }
      if (pendingShot && !prevPendingShot) fired.push({ initiatorGid: lastTouchGid });
      if (ownerGid !== null && ownerGid !== prevOwnerGid) {
        const prevSide = lastKnownOwnerGid === null ? null : players[lastKnownOwnerGid].side;
        if (prevSide !== null && players[ownerGid].side !== prevSide) {
          fired.push({ initiatorGid: ownerGid });
        }
      }
      if (ownerGid === null && preOwnerGid === null && lastTouchGid !== preLastTouchGid
        && lastTouchGid !== null) {
        const a = Math.hypot(preBall.vx, preBall.vy);
        const b = Math.hypot(m.ball.vel.x, m.ball.vel.y);
        const cosT = a > 1e-6 && b > 1e-6
          ? (preBall.vx * m.ball.vel.x + preBall.vy * m.ball.vel.y) / (a * b) : 1;
        if (Math.acos(Math.max(-1, Math.min(1, cosT))) > 0.2) {
          fired.push({ initiatorGid: lastTouchGid });
        }
      }
      if (preOwnerGid !== null && ownerGid === null && pendingPassT === prevPendingPassT
        && !pendingShot && dribbleTouchGid === null) {
        fired.push({ initiatorGid: preOwnerGid });
      }
    }
    for (const ev of fired) {
      row.events++;
      const initiator = ev.initiatorGid === null ? null : players[ev.initiatorGid];
      const bodies: WBody[] = [];
      for (const p of players) {
        if (p.sentOff) continue;
        if (initiator !== null && p.gid === initiator.gid) continue;
        const d = Math.hypot(p.pos.x - m.ball.pos.x, p.pos.y - m.ball.pos.y);
        if (d > PC_RELEVANCE_M) continue;
        bodies.push({
          gid: p.gid, decide: 0, redecide: 0,
          frozenX: preBall.x, frozenY: preBall.y, frozenVX: preBall.vx, frozenVY: preBall.vy,
          steerDone: false,
        });
      }
      if (bodies.length > 0) {
        row.bodies += bodies.length;
        wins.push({ startTick: t, bodies });
      }
    }
    for (let wi = wins.length - 1; wi >= 0; wi--) {
      const w = wins[wi];
      const k = t - w.startTick + 1;
      for (const wb of w.bodies) {
        const p = players[wb.gid];
        if (wb.decide === 0 && k <= H_DECIDE && prevTimer[wb.gid] <= 0) wb.decide = k;
        // ⭐ THE RE-DECIDE CHANNEL: his timer was RE-ARMED this tick, i.e. the decide loop
        // actually ran for him. In the BASE world this is identical to "reached a slot" (the
        // loop arms `AI_INTERVAL` the moment the slot opens), so the base arm stays exactly
        // commensurable with the census's 6.54; in the ARMED world the AND-gate separates them,
        // which is the whole point (PC-C0 §DOUBTS 7: "reaches a slot" ≠ "re-decides").
        if (wb.redecide === 0 && k <= H_DECIDE
          && p.decisionTimer > prevTimer[wb.gid] + 1e-12) wb.redecide = k;
        if (!wb.steerDone && k === 1) {
          const fam = p.action.type === 'ChaseBall' || p.action.type === 'ReceivePass'
            || p.action.type === 'InterceptPass';
          if (fam && !(p.action.type === 'ChaseBall' && p.containing)) {
            wb.steerDone = true;
            row.steerApplicable++;
            const fresh = interceptBall(p, m.ball).point;
            const frozen = { pos: { x: wb.frozenX, y: wb.frozenY },
              vel: { x: wb.frozenVX, y: wb.frozenVY }, z: 0, vz: 0, spin: 0 };
            const stale = interceptBall(p, frozen as unknown as typeof m.ball).point;
            if (Math.hypot(fresh.x - stale.x, fresh.y - stale.y) > STEER_EPS_M) {
              row.steerRetargetedOnFirstTick++;
            }
          }
        }
      }
      if (k >= Math.max(H_DECIDE, H_STEER)) {
        for (const wb of w.bodies) { row.decideBins[wb.decide]++; row.redecideBins[wb.redecide]++; }
        wins.splice(wi, 1);
      }
    }
    prevOwnerGid = ownerGid;
    if (ownerGid !== null) lastKnownOwnerGid = ownerGid;
    prevTouchPasts = touchPasts;
    prevDribbleTouchKey = dribbleTouchKey;
    prevPendingPassT = pendingPassT;
    prevPendingShot = pendingShot;
  }
  // windows still open at the whistle are DROPPED from the denominators, and disclosed
  if (seat !== null) {
    for (const rec of open.values()) { rec.openAtWhistle = true; done.push(rec); }
    const clean = done.filter((h) => !h.superseded && !h.openAtWhistle && !h.keptOlderExpiry
      && !h.spannedDeadBall);
    for (const r of clean) row.holdTickBins[Math.min(r.observedTicks, 47)]++;
    row.holdRecords = done.length;
    row.holdRecordsClean = clean.length;
    row.holdRecordsCleanAtTierLength = clean.filter((h) => h.observedTicks === pcTierTicks(h.tier)).length;
    row.holdRecordsKeptOlderExpiry = done.filter((h) => h.keptOlderExpiry).length;
    row.holdRecordsSuperseded = done.filter((h) => h.superseded).length;
    row.holdRecordsOpenAtWhistle = done.filter((h) => h.openAtWhistle).length;
    row.holdRecordsSpanningDeadBall = done.filter((h) => h.spannedDeadBall).length;
    const led = seat.ledger;
    const armsThis = led.armedByTier.simple + led.armedByTier.choice;
    const firingsThis = sum(PC_CLASSES.map((kk) => led.firings[kk]));
    row.counters = [row.ticks, firingsThis, armsThis, led.armedByTier.simple,
      led.armedByTier.choice, led.overlapRestarts, led.overlapNoExtend, led.heldExecutorTicks,
      led.decisionsHeld, led.exposuresNoted, led.armedWithMemory, led.preProcessedSkips,
      led.heldThroughReassignment, led.subClears, led.subClearedLiveHolds,
      led.subClearedMemories, led.deadBallClears, led.deadBallClearedHolds,
      row.subSwapsSeen, row.subSwapsWithInheritedHold];
  }
  return row;
};

const tPair0 = Date.now();
const PAIR_ROWS: LagRow[] = [];
for (const s of PAIR_SEEDS) {
  PAIR_ROWS.push(walkLag(s, false));
  PAIR_ROWS.push(walkLag(s, true));
}
const PAIR_MS = Date.now() - tPair0;

/* ========================================================================== */
/* §9 THE FACES — every one re-derived from the STORED cells by gFaces          */
/* ========================================================================== */
const col = (i: number): number => sum(CELLS.map((c) => c.counters[i]));
const ARMS_TOTAL = col(CF.arms);
const SIMPLE_TOTAL = col(CF.armsSimple);

/* ---- (1a) THE RELATION SPLIT, MEASURED (PC-T0 §DOUBTS 3) ------------------------- */
const relationSplit = PC_CLASSES.map((k, ki) => {
  const own = sum(CELLS.map((c) => c.expByClassRelation[ki][0]));
  const opp = sum(CELLS.map((c) => c.expByClassRelation[ki][1]));
  return { klass: k, own, opp, ownShare: round(own + opp === 0 ? Number.NaN : own / (own + opp)) };
});
const pressedSplitMeasured = PC_CLASSES.map((k, ki) => {
  const pr = sum(CELLS.map((c) => c.expByClassPressed[ki][0]));
  const op = sum(CELLS.map((c) => c.expByClassPressed[ki][1]));
  return {
    klass: k, pressed: pr, open: op,
    pressedShare: round(pr + op === 0 ? Number.NaN : pr / (pr + op)),
    censusPressedShare: round(C0_PRESSED_SHARE[k]),
  };
});
const relationOwnShareOf: Record<string, number> = Object.fromEntries(
  relationSplit.map((r) => [r.klass, r.ownShare]),
);

/* ---- (1b) THE FILL TABLE OF RECORD, CORRECTED ------------------------------------ */
/**
 * The census arithmetic, re-run with the MEASURED relation split in place of PC-T0's stated
 * 50/50 assumption. `exposuresPerBodyPerSeason(class, role)` × the cell's share of the class
 * ⇒ the seasons a body of that role needs to reach N_cover in that cell.
 *
 * ⚠ THE STRUCTURAL CORRECTION THIS EXAM FORCES: M-PC.3's book RESETS EVERY SEASON, so a cell
 * whose predicted fill time exceeds ONE season is not "slow to fill" — it NEVER fills. The
 * predicted quantity of record is therefore `exposuresPerSeason` against N_cover directly, and
 * `seasonsToFill` is published beside it as the census's own (un-reset) arithmetic.
 */
interface FillPrediction {
  cell: string; klass: string; pressed: boolean; relation: string; role: string;
  exposuresPerSeasonAssumed5050: number; exposuresPerSeasonMeasuredSplit: number;
  seasonsToFillAssumed5050: number; seasonsToFillMeasuredSplit: number;
  fillsWithinOneSeasonAtN: boolean[];
}
const FILL_PREDICTIONS: FillPrediction[] = [];
for (const k of PC_CLASSES) {
  for (const pressed of [true, false]) {
    for (const rel of ['own', 'opp'] as const) {
      for (const role of ROLE_LIST) {
        const base = C0_EXPOSURES[`${k}|${role}`] ?? 0;
        const pShare = pressed ? C0_PRESSED_SHARE[k] : 1 - C0_PRESSED_SHARE[k];
        const rShare5050 = 0.5;
        const rShareMeas = rel === 'own' ? relationOwnShareOf[k] : 1 - relationOwnShareOf[k];
        const e50 = base * pShare * rShare5050;
        const eMe = base * pShare * (Number.isFinite(rShareMeas) ? rShareMeas : 0.5);
        FILL_PREDICTIONS.push({
          cell: pcRecognitionKey(k, pressed, rel), klass: k, pressed, relation: rel, role,
          exposuresPerSeasonAssumed5050: round(e50, 4),
          exposuresPerSeasonMeasuredSplit: round(eMe, 4),
          seasonsToFillAssumed5050: round(e50 === 0 ? Number.POSITIVE_INFINITY : PC_N_COVER / e50, 4),
          seasonsToFillMeasuredSplit: round(eMe === 0 ? Number.POSITIVE_INFINITY : PC_N_COVER / eMe, 4),
          fillsWithinOneSeasonAtN: N_BAND.map((n) => eMe >= n),
        });
      }
    }
  }
}
/** the MEASURED per-cell fill: the share of body-cells that ever reach coverage within a season. */
const cellFillMeasured = PC_BOOK_CELLS.map((cellKey, ci) => {
  const arms = sum(CELLS.map((c) => c.armsByCell[ci]));
  const simpleAtN = N_BAND.map((_n, ni) => sum(CELLS.map((c) => c.simpleByCellAtN[ci][ni])));
  // how many (book, body) pairs ever reached N in this cell — from the body × cell matrix
  const bodiesReachingAtN = N_BAND.map((_n, ni) => sum(CELLS.map(
    (c) => c.simpleAtNByBodyCell[ni].filter((rowB) => rowB[ci] > 0).length,
  )));
  const bodiesArmed = sum(CELLS.map((c) => c.armsByBodyCell.filter((rowB) => rowB[ci] > 0).length));
  return {
    cell: cellKey, arms,
    simpleShareAtN: simpleAtN.map((s) => round(arms === 0 ? Number.NaN : s / arms)),
    simpleArmsAtN: simpleAtN,
    bodiesArmed, bodiesReachingCoverageAtN: bodiesReachingAtN,
  };
});

/* ---- (2) TIER DIFFERENTIATION AT CELL GRAIN -------------------------------------- */
/**
 * ⭐ THE TWO FACES #298 item 6 names, both at CELL grain, both computed per BOOK so the CI is
 * bootstrapped over the independent unit:
 *   WITHIN A BODY, ACROSS CELLS — for each body, the spread (max − min) of his SIMPLE share
 *     across the cells he was actually armed in (a body who pays one tier everywhere has 0).
 *   ACROSS BODIES, WITHIN A CELL — for each cell, the spread of SIMPLE share across the bodies
 *     armed in it (bodies who lived it vs bodies who did not).
 * A world with NO differentiation scores 0 on both. The null is therefore exactly 0, which is
 * what makes |Δ| ÷ half-width a legitimate statement about these faces.
 */
const MIN_ARMS_PER_CELL = 5; // a cell a body barely visited carries no share worth spreading
const withinBodySpreadOf = (c: BookCells, ni: number): number => {
  const spreads: number[] = [];
  for (let b = 0; b < N_BODIES; b++) {
    const shares: number[] = [];
    for (let ce = 0; ce < N_CELLS; ce++) {
      const a = c.armsByBodyCell[b][ce];
      if (a < MIN_ARMS_PER_CELL) continue;
      shares.push(c.simpleAtNByBodyCell[ni][b][ce] / a);
    }
    if (shares.length >= 2) spreads.push(Math.max(...shares) - Math.min(...shares));
  }
  return spreads.length === 0 ? Number.NaN : mean(spreads);
};
const acrossBodySpreadOf = (c: BookCells, ni: number): number => {
  const spreads: number[] = [];
  for (let ce = 0; ce < N_CELLS; ce++) {
    const shares: number[] = [];
    for (let b = 0; b < N_BODIES; b++) {
      const a = c.armsByBodyCell[b][ce];
      if (a < MIN_ARMS_PER_CELL) continue;
      shares.push(c.simpleAtNByBodyCell[ni][b][ce] / a);
    }
    if (shares.length >= 2) spreads.push(Math.max(...shares) - Math.min(...shares));
  }
  return spreads.length === 0 ? Number.NaN : mean(spreads);
};
const simpleShareOf = (c: BookCells, ni: number): number => {
  const arms = c.counters[CF.arms];
  return arms === 0 ? Number.NaN
    : sum(c.simpleByCellAtN.map((rowC) => rowC[ni])) / arms;
};

/** the bootstrap over BOOKS — the independent cluster (#229's form). */
const bootstrapCI = (
  values: readonly number[], statsSeed: number,
): { mean: number; lo: number; hi: number; halfWidth: number } => {
  const clean = values.filter((v) => Number.isFinite(v));
  if (clean.length === 0) return { mean: Number.NaN, lo: Number.NaN, hi: Number.NaN, halfWidth: Number.NaN };
  const rng = new Rng(statsSeed);
  const draws: number[] = [];
  for (let b = 0; b < BOOTSTRAP; b++) {
    let acc = 0;
    for (let i = 0; i < clean.length; i++) acc += clean[Math.floor(rng.next() * clean.length)];
    draws.push(acc / clean.length);
  }
  draws.sort((a, b) => a - b);
  const lo = draws[Math.floor(0.025 * BOOTSTRAP)];
  const hi = draws[Math.min(BOOTSTRAP - 1, Math.floor(0.975 * BOOTSTRAP))];
  return { mean: mean(clean), lo, hi, halfWidth: (hi - lo) / 2 };
};
const ciFace = (values: readonly number[], statsSeed: number, nullValue = 0): {
  mean: number; ci95: number[]; halfWidth: number; deltaOverHalfWidth: number; books: number;
} => {
  const b = bootstrapCI(values, statsSeed);
  return {
    mean: round(b.mean), ci95: [round(b.lo), round(b.hi)], halfWidth: round(b.halfWidth),
    deltaOverHalfWidth: round(b.halfWidth === 0 ? Number.POSITIVE_INFINITY
      : Math.abs(b.mean - nullValue) / b.halfWidth, 3),
    books: values.filter((v) => Number.isFinite(v)).length,
  };
};

const DIFFERENTIATION = N_BAND.map((n, ni) => ({
  nCover: n,
  simpleShare: ciFace(CELLS.map((c) => simpleShareOf(c, ni)), STATS_SEEDS[0]),
  withinBodyCellSpread: ciFace(CELLS.map((c) => withinBodySpreadOf(c, ni)), STATS_SEEDS[1]),
  acrossBodyCellSpread: ciFace(CELLS.map((c) => acrossBodySpreadOf(c, ni)), STATS_SEEDS[2]),
}));

/* ---- (3) THE TIER-TRANSITION CURVES ACROSS THE BAND ------------------------------ */
/** per N, per season, the SIMPLE share — the learning curve, one per rung of the band. */
const TRANSITION_CURVES = N_BAND.map((n, ni) => ({
  nCover: n,
  bySeason: Array.from({ length: SEASONS }, (_, s) => {
    const arms = sum(CELLS.map((c) => c.armsBySeason[s]));
    const simple = sum(CELLS.map((c) => sum(c.simpleAtNBySeasonCell[ni][s])));
    return { season: s + 1, arms, simple, simpleShare: round(arms === 0 ? Number.NaN : simple / arms) };
  }),
  byFixtureWithinSeason: Array.from({ length: FIXTURES_PER_SEASON }, (_, f) => ({
    fixture: f + 1,
    coveredBodyCells: sum(CELLS.map((c) => sum(
      Array.from({ length: SEASONS }, (_, s) => c.coveredByFixture[s][f][ni]),
    ))),
  })),
}));

/* ---- (4) THE ROLE FACE (H2, REPORTED, NEVER SCORED) ------------------------------ */
const ROLE_FACE = N_BAND.map((n, ni) => {
  const rows = ROLE_LIST.map((r, ri) => {
    const arms = sum(CELLS.map((c) => c.armsByRole[ri]));
    const simple = sum(CELLS.map((c) => c.simpleByRoleAtN[ri][ni]));
    return { role: r, arms, simple, simpleShare: round(arms === 0 ? Number.NaN : simple / arms) };
  });
  const outfield = rows.filter((r) => r.role !== 'GK' && r.arms > 0).map((r) => r.simpleShare);
  const perBookSpread = CELLS.map((c) => {
    const shares = ROLE_LIST.map((_r, ri) => (c.armsByRole[ri] === 0 ? Number.NaN
      : c.simpleByRoleAtN[ri][ni] / c.armsByRole[ri]))
      .filter((v, i) => Number.isFinite(v) && ROLE_LIST[i] !== 'GK');
    return shares.length >= 2 ? Math.max(...shares) - Math.min(...shares) : Number.NaN;
  });
  return {
    nCover: n, rows,
    outfieldSpread: round(outfield.length >= 2 ? Math.max(...outfield) - Math.min(...outfield) : Number.NaN),
    outfieldSpreadCI: ciFace(perBookSpread, STATS_SEEDS[3]),
  };
});
/** the exposure side of H2: is the SUPPLY role-flat, as the census measured it to be? */
const ROLE_EXPOSURE = ROLE_LIST.map((r, ri) => ({
  role: r, arms: sum(CELLS.map((c) => c.armsByRole[ri])),
}));

/* ---- (5) THE ADDED-LAG RECEIPT --------------------------------------------------- */
const lagRowsOf = (arm: 'base' | 'armed'): LagRow[] => PAIR_ROWS.filter((r) => r.arm === arm);
const decideStats = (rows: readonly LagRow[], channel: 'decide' | 'redecide' = 'redecide'): {
  bodies: number; reached: number; meanAppliedTicks: number; p50AppliedTicks: number;
  p90AppliedTicks: number; noSlotWithinHorizon: number; bins: number[];
} => {
  const bins = zeros(H_DECIDE + 1);
  for (const r of rows) {
    (channel === 'decide' ? r.decideBins : r.redecideBins).forEach((v, i) => { bins[i] += v; });
  }
  const bodies = sum(bins);
  const never = bins[0];
  const reached = bodies - never;
  // ⭐ the k−1 CORRECTION (#297 corrections item 2): the published value is k + 1
  let acc = 0;
  for (let k = 1; k <= H_DECIDE; k++) acc += bins[k] * (k + 1);
  const reachedBins = bins.map((v, i) => (i === 0 ? 0 : v));
  return {
    bodies, reached,
    meanAppliedTicks: round(reached === 0 ? Number.NaN : acc / reached, 4),
    p50AppliedTicks: pctFromBins(reachedBins, 0.5) + 1,
    p90AppliedTicks: pctFromBins(reachedBins, 0.9) + 1,
    noSlotWithinHorizon: never, bins,
  };
};
const BASE_DECIDE = decideStats(lagRowsOf('base'));
const ARMED_DECIDE = decideStats(lagRowsOf('armed'));
/** the PC-C0-verbatim "reached a slot" channel, published beside it and NEVER differenced. */
const BASE_SLOT = decideStats(lagRowsOf('base'), 'decide');
const ARMED_SLOT = decideStats(lagRowsOf('armed'), 'decide');
/** the per-seed paired differences — the CI's independent unit is the SEED. */
const perSeedAddedLag = PAIR_SEEDS.map((s) => {
  const b = decideStats(PAIR_ROWS.filter((r) => r.seed === s && r.arm === 'base'));
  const a = decideStats(PAIR_ROWS.filter((r) => r.seed === s && r.arm === 'armed'));
  return a.meanAppliedTicks - b.meanAppliedTicks;
});
const ADDED_LAG = {
  baseMeanAppliedTicks: BASE_DECIDE.meanAppliedTicks,
  armedMeanAppliedTicks: ARMED_DECIDE.meanAppliedTicks,
  addedLagAppliedTicks: round(ARMED_DECIDE.meanAppliedTicks - BASE_DECIDE.meanAppliedTicks, 4),
  ci: ciFace(perSeedAddedLag, STATS_SEEDS[4]),
  censusFreeLagOfRecordAppliedTicks: 6.54,
};

/* ---- (6) SELF-STARVATION --------------------------------------------------------- */
const SELF_STARVATION = Array.from({ length: SEASONS }, (_, s) => {
  const matches = BOOKS * FIXTURES_PER_SEASON;
  const arms = sum(CELLS.map((c) => c.armsBySeason[s]));
  const firings = sum(CELLS.map((c) => c.firingsBySeason[s]));
  return {
    season: s + 1, matches, arms, firings,
    armsPerMatch: round(arms / matches, 3),
    firingsPerMatch: round(firings / matches, 3),
  };
});

/* ---- the amendment receipts, from the paired battery's armed arm ----------------- */
const armedRows = lagRowsOf('armed');
const AMENDMENT_RECEIPTS = {
  subSwapsSeen: sum(armedRows.map((r) => r.subSwapsSeen)),
  subSwapsWithInheritedHold: sum(armedRows.map((r) => r.subSwapsWithInheritedHold)),
  holdRecordsSpanningDeadBall: sum(armedRows.map((r) => r.holdRecordsSpanningDeadBall)),
  holdRecordsTotal: sum(armedRows.map((r) => r.holdRecords)),
  holdRecordsClean: sum(armedRows.map((r) => r.holdRecordsClean)),
  holdRecordsCleanAtTierLength: sum(armedRows.map((r) => r.holdRecordsCleanAtTierLength)),
  holdRecordsKeptOlderExpiry: sum(armedRows.map((r) => r.holdRecordsKeptOlderExpiry)),
  deadBallClears: sum(armedRows.map((r) => r.counters[CF.deadBallClears])),
  deadBallClearedHolds: sum(armedRows.map((r) => r.counters[CF.deadBallClearedHolds])),
  subClears: sum(armedRows.map((r) => r.counters[CF.subClears])),
  subClearedLiveHolds: sum(armedRows.map((r) => r.counters[CF.subClearedLiveHolds])),
  preProcessedSkips: sum(armedRows.map((r) => r.counters[CF.preProcessedSkips])),
};
const holdBinsPooled = Array.from({ length: 48 }, (_, i) => sum(armedRows.map((r) => r.holdTickBins[i])));
/** the SEASON-RESET receipt, from the battery itself. */
const SEASON_RESET = {
  seasonEnds: BOOKS * SEASONS,
  nonEmptyAfterReset: sum(CELLS.map((c) => c.bookExposuresAfterReset.filter((v) => v !== 0).length)),
  exposuresAtSeasonEndTotal: sum(CELLS.map((c) => sum(c.bookExposuresAtSeasonEnd))),
};

/* ---- THE PUBLISHED FACE LIST (gFaces re-derives EVERY one off disk) --------------- */
const FACES: { key: string; valueCount: number }[] = [
  { key: 'armsTotal', valueCount: ARMS_TOTAL },
  { key: 'armsSimpleTotal', valueCount: SIMPLE_TOTAL },
  { key: 'armsChoiceTotal', valueCount: col(CF.armsChoice) },
  { key: 'firingsTotal', valueCount: col(CF.firings) },
  { key: 'exposuresNotedTotal', valueCount: col(CF.exposuresNoted) },
  { key: 'armedWithMemoryTotal', valueCount: col(CF.armedWithMemory) },
  { key: 'heldExecutorTicksTotal', valueCount: col(CF.heldExecutorTicks) },
  { key: 'decisionsHeldTotal', valueCount: col(CF.decisionsHeld) },
  { key: 'overlapRestartsTotal', valueCount: col(CF.overlapRestarts) },
  { key: 'overlapNoExtendTotal', valueCount: col(CF.overlapNoExtend) },
  { key: 'preProcessedSkipsTotal', valueCount: col(CF.preProcessedSkips) },
  { key: 'heldThroughReassignmentTotal', valueCount: col(CF.heldThroughReassignment) },
  { key: 'subClearsTotal', valueCount: col(CF.subClears) },
  { key: 'subClearedLiveHoldsTotal', valueCount: col(CF.subClearedLiveHolds) },
  { key: 'subClearedMemoriesTotal', valueCount: col(CF.subClearedMemories) },
  { key: 'deadBallClearsTotal', valueCount: col(CF.deadBallClears) },
  { key: 'deadBallClearedHoldsTotal', valueCount: col(CF.deadBallClearedHolds) },
  { key: 'batterySubSwapsSeenTotal', valueCount: col(CF.subSwapsSeen) },
  { key: 'batterySubSwapsWithInheritedHoldTotal', valueCount: col(CF.subSwapsWithInheritedHold) },
  { key: 'appliedTicksWalkedTotal', valueCount: col(CF.appliedTicks) },
  { key: 'matchesWalkedTotal', valueCount: sum(CELLS.map((c) => c.matches)) },
  { key: 'armsOkTotal', valueCount: sum(CELLS.map((c) => c.armsOk)) },
  { key: 'seasonResetsNonEmpty', valueCount: SEASON_RESET.nonEmptyAfterReset },
  ...PC_CLASSES.map((k, ki) => ({
    key: `relationOwn.${k}`, valueCount: sum(CELLS.map((c) => c.expByClassRelation[ki][0])),
  })),
  ...PC_CLASSES.map((k, ki) => ({
    key: `relationOpp.${k}`, valueCount: sum(CELLS.map((c) => c.expByClassRelation[ki][1])),
  })),
  ...PC_CLASSES.map((k, ki) => ({
    key: `pressed.${k}`, valueCount: sum(CELLS.map((c) => c.expByClassPressed[ki][0])),
  })),
  ...PC_BOOK_CELLS.map((cellKey, ci) => ({
    key: `armsByCell.${cellKey}`, valueCount: sum(CELLS.map((c) => c.armsByCell[ci])),
  })),
  ...N_BAND.flatMap((n, ni) => PC_BOOK_CELLS.map((cellKey, ci) => ({
    key: `simpleByCellAtN${n}.${cellKey}`,
    valueCount: sum(CELLS.map((c) => c.simpleByCellAtN[ci][ni])),
  }))),
  ...N_BAND.flatMap((n, ni) => ROLE_LIST.map((r, ri) => ({
    key: `simpleByRoleAtN${n}.${r}`, valueCount: sum(CELLS.map((c) => c.simpleByRoleAtN[ri][ni])),
  }))),
  ...ROLE_LIST.map((r, ri) => ({
    key: `armsByRole.${r}`, valueCount: sum(CELLS.map((c) => c.armsByRole[ri])),
  })),
  ...Array.from({ length: SEASONS }, (_, s) => ({
    key: `armsBySeason.${s + 1}`, valueCount: sum(CELLS.map((c) => c.armsBySeason[s])),
  })),
  ...Array.from({ length: SEASONS }, (_, s) => ({
    key: `firingsBySeason.${s + 1}`, valueCount: sum(CELLS.map((c) => c.firingsBySeason[s])),
  })),
  ...N_BAND.flatMap((n, ni) => Array.from({ length: SEASONS }, (_, s) => ({
    key: `simpleBySeasonAtN${n}.${s + 1}`,
    valueCount: sum(CELLS.map((c) => sum(c.simpleAtNBySeasonCell[ni][s]))),
  }))),
  ...N_BAND.flatMap((n, ni) => Array.from({ length: FIXTURES_PER_SEASON }, (_, f) => ({
    key: `coveredByFixtureAtN${n}.${f + 1}`,
    valueCount: sum(CELLS.map((c) => sum(
      Array.from({ length: SEASONS }, (_, s) => c.coveredByFixture[s][f][ni]),
    ))),
  }))),
  // ⭐ the paired battery's faces, re-derived from the STORED per-seed lag cells
  { key: 'pairBaseSlotChannelBodies', valueCount: BASE_SLOT.bodies },
  { key: 'pairArmedSlotChannelBodies', valueCount: ARMED_SLOT.bodies },
  { key: 'pairBaseSlotChannelP50AppliedTicks', valueCount: BASE_SLOT.p50AppliedTicks },
  { key: 'pairArmedSlotChannelP50AppliedTicks', valueCount: ARMED_SLOT.p50AppliedTicks },
  { key: 'pairBaseDecideBodies', valueCount: BASE_DECIDE.bodies },
  { key: 'pairArmedDecideBodies', valueCount: ARMED_DECIDE.bodies },
  { key: 'pairBaseDecideP50AppliedTicks', valueCount: BASE_DECIDE.p50AppliedTicks },
  { key: 'pairArmedDecideP50AppliedTicks', valueCount: ARMED_DECIDE.p50AppliedTicks },
  { key: 'pairBaseDecideP90AppliedTicks', valueCount: BASE_DECIDE.p90AppliedTicks },
  { key: 'pairArmedDecideP90AppliedTicks', valueCount: ARMED_DECIDE.p90AppliedTicks },
  { key: 'pairArmedSubSwapsWithInheritedHold', valueCount: AMENDMENT_RECEIPTS.subSwapsWithInheritedHold },
  { key: 'pairArmedHoldRecordsSpanningDeadBall', valueCount: AMENDMENT_RECEIPTS.holdRecordsSpanningDeadBall },
  { key: 'pairArmedHoldRecordsClean', valueCount: AMENDMENT_RECEIPTS.holdRecordsClean },
  { key: 'pairArmedHoldRecordsCleanAtTierLength', valueCount: AMENDMENT_RECEIPTS.holdRecordsCleanAtTierLength },
  { key: 'pairArmedHoldTicksP50', valueCount: pctFromBins(holdBinsPooled, 0.5) },
  { key: 'pairArmedHoldTicksP90', valueCount: pctFromBins(holdBinsPooled, 0.9) },
];

/* ========================================================================== */
/* §10 THE GATES                                                               */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string; fn: (i: I) => Conj; input: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): void => { REGISTRY.push(spec as unknown as GateSpec<never>); };
const runMutant = <I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult => {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base).filter((k) => k !== conjunct)
    .every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
};

/* ---- 1 gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: digestA === digestB, digest: digestA },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second run differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- 2 ⭐⭐ gDormancy — RE-PROVEN AFTER THE AMENDMENT ---- */
registerGate<{ pooled: string; rows: number; league: string; skipped: boolean; complete: boolean;
  absentFalse: boolean[] }>({
  name: 'gDormancy',
  fn: (i) => ({
    theFlagsOffWorldsRederiveTheCleanHeadPooledDigest: i.pooled === WORLD_IDENTITY_POOLED_AT_HEAD,
    bothWorldFamiliesWereWalked: i.rows === (i.complete ? WORLD_IDENTITY_SEEDS.length : i.rows / 2) * 2,
    theLeagueFingerprintIsUnmoved: i.skipped || i.league === LEAGUE_FINGERPRINT_AT_HEAD,
    theBaselineIsTheCompleteOne: i.complete,
    flagAbsentEqualsFlagFalseEverywhere: i.absentFalse.length > 0 && i.absentFalse.every(Boolean),
  }),
  input: {
    pooled: IDENTITY_POOLED, rows: identityRows.length, league: LEAGUE_FP, skipped: SKIP_FP,
    complete: IDENTITY_COMPLETE, absentFalse: absentEqualsFalse,
  },
  mutants: [
    { conjunct: 'theFlagsOffWorldsRederiveTheCleanHeadPooledDigest', name: 'a flags-off world moved', mutate: (i) => ({ ...i, pooled: 'deadbeef' }) },
    { conjunct: 'bothWorldFamiliesWereWalked', name: 'only one family walked', mutate: (i) => ({ ...i, rows: i.rows - 1 }) },
    { conjunct: 'theLeagueFingerprintIsUnmoved', name: 'the league fingerprint moved', mutate: (i) => ({ ...i, skipped: false, league: 'moved' }) },
    { conjunct: 'theBaselineIsTheCompleteOne', name: 'a truncated baseline', mutate: (i) => ({ ...i, complete: false }) },
    { conjunct: 'flagAbsentEqualsFlagFalseEverywhere', name: 'absent ≠ false somewhere', mutate: (i) => ({ ...i, absentFalse: [...i.absentFalse.slice(1), false] }) },
  ],
});

/* ---- 3 ⭐ gSrcScope — the amendment, and NOTHING after it ---- */
registerGate<{ sinceDispatch: string[]; declared: readonly string[]; sinceAmendment: string;
  status: string }>({
  name: 'gSrcScope',
  fn: (i) => ({
    theAmendmentTouchedExactlyItsDeclaredFiles: i.sinceDispatch.length > 0
      && i.sinceDispatch.every((f) => i.declared.includes(f)),
    theDeclaredAmendmentScopeIsNotOverstated: i.declared.every((f) => i.sinceDispatch.includes(f)),
    noSrcMovedAfterTheAmendmentCommit: i.sinceAmendment === '',
    theWorkingTreeSrcIsCommitted: i.status === '',
  }),
  input: {
    sinceDispatch: SRC_SINCE_DISPATCH, declared: AMENDMENT_SRC_SCOPE,
    sinceAmendment: SRC_SINCE_AMENDMENT, status: SRC_WORKTREE_STATUS,
  },
  mutants: [
    { conjunct: 'theAmendmentTouchedExactlyItsDeclaredFiles', name: 'an undeclared src file moved', mutate: (i) => ({ ...i, sinceDispatch: [...i.sinceDispatch, 'src/sim/mechanics.ts'] }) },
    { conjunct: 'theDeclaredAmendmentScopeIsNotOverstated', name: 'a declared file did not move', mutate: (i) => ({ ...i, declared: [...i.declared, 'src/sim/Ball.ts'] }) },
    { conjunct: 'noSrcMovedAfterTheAmendmentCommit', name: 'src moved after the amendment', mutate: (i) => ({ ...i, sinceAmendment: ' src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'theWorkingTreeSrcIsCommitted', name: 'uncommitted src at result time', mutate: (i) => ({ ...i, status: ' M src/sim/Match.ts' }) },
  ],
});

/* ---- 4 gArms — every walk carries the FULL composition and the door open ---- */
registerGate<{ ok: number; total: number; pairBase: number; pairArmed: number }>({
  name: 'gArms',
  fn: (i) => ({
    everyBatteryWalkCarriedTheV7ArmTheL3DoseAndTheLatencyDoor: i.ok === i.total,
    theBatteryIsNonVacuous: i.total > 0,
    everyPairedBaseWalkHadTheDoorSHUT: i.pairBase === PAIRS,
    everyPairedArmedWalkHadTheDoorOPEN: i.pairArmed === PAIRS,
  }),
  input: {
    ok: sum(CELLS.map((c) => c.armsOk)), total: sum(CELLS.map((c) => c.matches)),
    pairBase: lagRowsOf('base').filter((r) => r.armOk).length,
    pairArmed: lagRowsOf('armed').filter((r) => r.armOk).length,
  },
  mutants: [
    { conjunct: 'everyBatteryWalkCarriedTheV7ArmTheL3DoseAndTheLatencyDoor', name: 'a walk was mis-armed', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theBatteryIsNonVacuous', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
    { conjunct: 'everyPairedBaseWalkHadTheDoorSHUT', name: 'a base walk was armed', mutate: (i) => ({ ...i, pairBase: i.pairBase - 1 }) },
    { conjunct: 'everyPairedArmedWalkHadTheDoorOPEN', name: 'an armed walk was shut', mutate: (i) => ({ ...i, pairArmed: i.pairArmed - 1 }) },
  ],
});

/* ---- 5 gSources — ⭐ #289 canon: every data source hashes its FILE BYTES ---- */
registerGate<{ doseRederived: string; doseBytes: string; c0Bytes: string; c0Rederived: string;
  c0Committed: string; t0Bytes: string; cells: number }>({
  name: 'gSources',
  fn: (i) => ({
    theDoseArtifactsOwnBytesRederiveTheShippedDigest: i.doseRederived === L3_T1_SHA,
    theDoseBytesWereActuallyHashed: i.doseBytes.length === 64,
    theCensusArtifactsBytesWereHashed: i.c0Bytes.length === 64,
    theCensusArtifactRederivesItsOwnCommittedDigest: i.c0Rederived === i.c0Committed
      && i.c0Committed.length === 64,
    thePCT0ArtifactsBytesWereHashed: i.t0Bytes.length === 64,
    theDoseHasBothArrivalGroups: i.cells === 2,
  }),
  input: {
    doseRederived: DOSE_REDERIVED_SHA, doseBytes: DOSE_FILE_BYTES_SHA, c0Bytes: C0_FILE_BYTES_SHA,
    c0Rederived: C0_REDERIVED_SHA, c0Committed: C0_COMMITTED_SHA, t0Bytes: T0_FILE_BYTES_SHA,
    cells: DOSE.length,
  },
  mutants: [
    { conjunct: 'theDoseArtifactsOwnBytesRederiveTheShippedDigest', name: 'the dose file drifted', mutate: (i) => ({ ...i, doseRederived: 'x'.repeat(64) }) },
    { conjunct: 'theDoseBytesWereActuallyHashed', name: 'the dose bytes were never hashed', mutate: (i) => ({ ...i, doseBytes: '' }) },
    { conjunct: 'theCensusArtifactsBytesWereHashed', name: 'the census bytes were never hashed', mutate: (i) => ({ ...i, c0Bytes: '' }) },
    { conjunct: 'theCensusArtifactRederivesItsOwnCommittedDigest', name: 'the census artifact drifted', mutate: (i) => ({ ...i, c0Rederived: 'y'.repeat(64) }) },
    { conjunct: 'thePCT0ArtifactsBytesWereHashed', name: 'the PC-T0 bytes were never hashed', mutate: (i) => ({ ...i, t0Bytes: '' }) },
    { conjunct: 'theDoseHasBothArrivalGroups', name: 'a one-group dose', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 6 gClock — APPLIED, not nominal (#280 form / #294 item 3) ---- */
registerGate<{ dt: number; dur: number; simple: number; choice: number; fixtures: number;
  seasonDef: string; walksFull: boolean }>({
  name: 'gClock',
  fn: (i) => ({
    theShippedTickIsTheOneUsed: i.dt === DT,
    theShippedDurationIsTheOneWalked: i.dur === MATCH_DURATION,
    theTiersAreTwelveAndTwentySevenAppliedTicks: i.simple === 12 && i.choice === 27
      && i.simple === PC_TIER_SIMPLE_TICKS && i.choice === PC_TIER_CHOICE_TICKS,
    theSeasonIsTheCensusesOwnSevenFixtures: i.fixtures === 7
      && i.seasonDef.startsWith('7 league fixtures per franchise per season'),
    everyBatteryWalkSteppedItsFullMatch: i.walksFull,
  }),
  input: {
    dt: DT, dur: MATCH_DURATION, simple: PC_TIER_SIMPLE_TICKS, choice: PC_TIER_CHOICE_TICKS,
    fixtures: FIXTURES_PER_SEASON, seasonDef: C0_SEASON_DEFINITION,
    walksFull: CELLS.every(
      (c) => c.counters[CF.appliedTicks] >= c.matches * Math.round(MATCH_DURATION / DT),
    ),
  },
  mutants: [
    { conjunct: 'theShippedTickIsTheOneUsed', name: 'a different tick', mutate: (i) => ({ ...i, dt: 1 / 30 }) },
    { conjunct: 'theShippedDurationIsTheOneWalked', name: 'a different duration', mutate: (i) => ({ ...i, dur: 1 }) },
    { conjunct: 'theTiersAreTwelveAndTwentySevenAppliedTicks', name: 'a tier drifted', mutate: (i) => ({ ...i, simple: 13 }) },
    { conjunct: 'theSeasonIsTheCensusesOwnSevenFixtures', name: 'the season length drifted', mutate: (i) => ({ ...i, fixtures: 6 }) },
    { conjunct: 'everyBatteryWalkSteppedItsFullMatch', name: 'a short walk', mutate: (i) => ({ ...i, walksFull: false }) },
  ],
});

/* ---- 7 ⭐⭐ gNSweep — the instrument-side N re-derivation is EXACT at the shipped N ---- */
registerGate<{ arms: number; agreed: number; band: number[]; shipped: number }>({
  name: 'gNSweep',
  fn: (i) => ({
    theInstrumentRederivesTheSeatsOwnTierOnEveryArm: i.arms === i.agreed,
    theBandIsHalfOneDouble: i.band.length === 3 && i.band[0] === Math.floor(PC_N_COVER / 2)
      && i.band[1] === PC_N_COVER && i.band[2] === PC_N_COVER * 2,
    theShippedNIsTheDerivedEighteen: i.shipped === Math.floor(184 / 10) && i.shipped === 18,
    theSweepSawArms: i.arms > 0,
  }),
  input: {
    arms: SWEEP.arms, agreed: SWEEP.agreed, band: [...N_BAND], shipped: PC_N_COVER,
  },
  mutants: [
    { conjunct: 'theInstrumentRederivesTheSeatsOwnTierOnEveryArm', name: 'the sweep disagreed with the seat', mutate: (i) => ({ ...i, agreed: i.agreed - 1 }) },
    { conjunct: 'theBandIsHalfOneDouble', name: 'the band drifted', mutate: (i) => ({ ...i, band: [1, 2, 3] }) },
    { conjunct: 'theShippedNIsTheDerivedEighteen', name: 'N_cover drifted', mutate: (i) => ({ ...i, shipped: 19 }) },
    { conjunct: 'theSweepSawArms', name: 'the sweep saw nothing', mutate: (i) => ({ ...i, arms: 0, agreed: 0 }) },
  ],
});

/* ---- 8 ⭐ gBooks — the conservation identities of the exposure stream ---- */
registerGate<{ arms: number; exposures: number; withMem: number; simple: number; choice: number;
  cells: number; sawBothTiers: boolean }>({
  name: 'gBooks',
  fn: (i) => ({
    everyArmWroteExactlyOneExposure: i.arms > 0 && i.arms === i.exposures,
    everyArmFrozeALiveStalePlan: i.arms === i.withMem,
    theTwoTiersAccountForEveryArm: i.simple + i.choice === i.arms,
    theKeySpaceIsTheRuledTwentyEight: i.cells === 28,
    bothTiersWereActuallyPaid: i.sawBothTiers,
  }),
  input: {
    arms: ARMS_TOTAL, exposures: col(CF.exposuresNoted), withMem: col(CF.armedWithMemory),
    simple: SIMPLE_TOTAL, choice: col(CF.armsChoice), cells: N_CELLS,
    sawBothTiers: SIMPLE_TOTAL > 0 && col(CF.armsChoice) > 0,
  },
  mutants: [
    { conjunct: 'everyArmWroteExactlyOneExposure', name: 'an exposure went missing', mutate: (i) => ({ ...i, exposures: i.exposures - 1 }) },
    { conjunct: 'everyArmFrozeALiveStalePlan', name: 'an arm had no memory', mutate: (i) => ({ ...i, withMem: i.withMem - 1 }) },
    { conjunct: 'theTwoTiersAccountForEveryArm', name: 'a third tier appeared', mutate: (i) => ({ ...i, simple: i.simple - 1 }) },
    { conjunct: 'theKeySpaceIsTheRuledTwentyEight', name: 'the key space drifted', mutate: (i) => ({ ...i, cells: 27 }) },
    { conjunct: 'bothTiersWereActuallyPaid', name: 'a tier was never paid', mutate: (i) => ({ ...i, sawBothTiers: false }) },
  ],
});

/* ---- 9 ⭐⭐ gAmendment — the four clauses, LIVE in the battery ---- */
registerGate<{ swaps: number; inherited: number; spanning: number; records: number;
  clears: number; cleared: number; skipsOnGrain: boolean; keptFlagUsed: number }>({
  name: 'gAmendment',
  fn: (i) => ({
    aSubNEVERInheritsALiveHold: i.inherited === 0,
    theSubCameraActuallySawSubstitutions: i.swaps > 0,
    noHoldEVERSPansADeadBall: i.spanning === 0,
    theDeadBallCameraActuallySawStoppagesCutHolds: i.clears > 0 && i.cleared > 0,
    theHoldPopulationIsNonVacuous: i.records > 0,
    thePreProcessedCounterSitsAfterTheRadiusFilter: i.skipsOnGrain,
    theRenamedFlagIsTheOneTheInstrumentReads: i.keptFlagUsed === 1,
  }),
  input: {
    swaps: AMENDMENT_RECEIPTS.subSwapsSeen + col(CF.subSwapsSeen),
    inherited: AMENDMENT_RECEIPTS.subSwapsWithInheritedHold + col(CF.subSwapsWithInheritedHold),
    spanning: AMENDMENT_RECEIPTS.holdRecordsSpanningDeadBall,
    records: AMENDMENT_RECEIPTS.holdRecordsTotal,
    clears: AMENDMENT_RECEIPTS.deadBallClears, cleared: AMENDMENT_RECEIPTS.deadBallClearedHolds,
    skipsOnGrain: (() => {
      const src = readFileSync('src/sim/Match.ts', 'utf8');
      const iRadius = src.indexOf('if (d > PC_RELEVANCE_M) continue;');
      const iSkip = src.indexOf('if (p.firstTouchWindow > 0) { seat.ledger.preProcessedSkips++; continue; }');
      return iRadius > 0 && iSkip > iRadius;
    })(),
    keptFlagUsed: readFileSync('src/ai/pcLatency.ts', 'utf8')
      .split('export const pcHoldKeptOlderExpiry').length - 1,
  },
  mutants: [
    { conjunct: 'aSubNEVERInheritsALiveHold', name: 'a sub inherited a hold', mutate: (i) => ({ ...i, inherited: 1 }) },
    { conjunct: 'theSubCameraActuallySawSubstitutions', name: 'no substitution ever happened', mutate: (i) => ({ ...i, swaps: 0 }) },
    { conjunct: 'noHoldEVERSPansADeadBall', name: 'a hold straddled a stoppage', mutate: (i) => ({ ...i, spanning: 1 }) },
    { conjunct: 'theDeadBallCameraActuallySawStoppagesCutHolds', name: 'no stoppage ever cut a hold', mutate: (i) => ({ ...i, clears: 0, cleared: 0 }) },
    { conjunct: 'theHoldPopulationIsNonVacuous', name: 'no holds at all', mutate: (i) => ({ ...i, records: 0 }) },
    { conjunct: 'thePreProcessedCounterSitsAfterTheRadiusFilter', name: 'the counter drifted off the census grain', mutate: (i) => ({ ...i, skipsOnGrain: false }) },
    { conjunct: 'theRenamedFlagIsTheOneTheInstrumentReads', name: 'the renamed predicate vanished', mutate: (i) => ({ ...i, keptFlagUsed: 0 }) },
  ],
});

/* ---- 10 ⭐ gSeasonReset — the books really are empty at the boundary ---- */
registerGate<{ ends: number; nonEmpty: number; exposures: number }>({
  name: 'gSeasonReset',
  fn: (i) => ({
    everySeasonBoundaryLeftTheBooksEMPTY: i.nonEmpty === 0,
    thereWereSeasonBoundariesToCheck: i.ends > 0,
    theBooksHadSomethingToLose: i.exposures > 0,
  }),
  input: {
    ends: SEASON_RESET.seasonEnds, nonEmpty: SEASON_RESET.nonEmptyAfterReset,
    exposures: SEASON_RESET.exposuresAtSeasonEndTotal,
  },
  mutants: [
    { conjunct: 'everySeasonBoundaryLeftTheBooksEMPTY', name: 'a book survived a season', mutate: (i) => ({ ...i, nonEmpty: 1 }) },
    { conjunct: 'thereWereSeasonBoundariesToCheck', name: 'no season ever ended', mutate: (i) => ({ ...i, ends: 0 }) },
    { conjunct: 'theBooksHadSomethingToLose', name: 'the books were empty anyway', mutate: (i) => ({ ...i, exposures: 0 }) },
  ],
});

/* ---- 11 ⭐ gAddedLag — additivity, and the world's own cadence not credited ---- */
registerGate<{ baseMean: number; armedMean: number; baseBodies: number; armedBodies: number;
  timerWrites: number; census: number }>({
  name: 'gAddedLag',
  fn: (i) => ({
    theBaseArmReproducesTheCensusesFreeLagWithinHalfATick:
      Math.abs(i.baseMean - i.census) <= 0.5,
    theArmedArmIsSLOWERThanItsOwnBase: i.armedMean > i.baseMean,
    bothArmsHaveNonVacuousDenominators: i.baseBodies > 0 && i.armedBodies > 0,
    theSeamNEVERWritesTheWorldsOwnTimer: i.timerWrites === 0,
  }),
  input: {
    baseMean: BASE_DECIDE.meanAppliedTicks, armedMean: ARMED_DECIDE.meanAppliedTicks,
    baseBodies: BASE_DECIDE.reached, armedBodies: ARMED_DECIDE.reached,
    timerWrites: (readFileSync('src/ai/pcLatency.ts', 'utf8').match(/decisionTimer\s*=/g) ?? []).length
      + (readFileSync('src/ai/actionExecutor.ts', 'utf8').match(/p\.decisionTimer\s*=/g) ?? []).length,
    census: 6.54,
  },
  mutants: [
    { conjunct: 'theBaseArmReproducesTheCensusesFreeLagWithinHalfATick', name: 'the base arm drifted off the census', mutate: (i) => ({ ...i, baseMean: i.census + 3 }) },
    { conjunct: 'theArmedArmIsSLOWERThanItsOwnBase', name: 'arming made the world faster', mutate: (i) => ({ ...i, armedMean: i.baseMean - 1 }) },
    { conjunct: 'bothArmsHaveNonVacuousDenominators', name: 'an empty arm', mutate: (i) => ({ ...i, baseBodies: 0 }) },
    { conjunct: 'theSeamNEVERWritesTheWorldsOwnTimer', name: 'the seam wrote decisionTimer', mutate: (i) => ({ ...i, timerWrites: 1 }) },
  ],
});

/* ---- 12 gSeeds — booked = walked ---- */
const walkedBatterySeeds: readonly [number, number] = [BATTERY_BASE, BATTERY_BASE + BATTERY_SPAN - 1];
const inBlock = (s: number): boolean => s >= BLOCK[0] && s <= BLOCK[1];
const walkedSeeds = [
  ...Array.from({ length: BATTERY_SPAN }, (_, i) => BATTERY_BASE + i),
  ...PAIR_SEEDS, ...IDENTITY_SEEDS,
];
registerGate<{ walked: number[]; retiredHit: number; preflightHit: number; batteryEnd: number;
  pairStart: number }>({
  name: 'gSeeds',
  fn: (i) => ({
    everyWalkedSeedIsBookedOrADisclosedIdentitySeed: i.walked.length > 0
      && i.walked.every((s) => inBlock(s) || WORLD_IDENTITY_SEEDS.includes(s)),
    theRetiredBlockIsNeverTouched: i.retiredHit === 0,
    thePreflightBandIsDisjointFromEveryWalkedSeed: i.preflightHit === 0,
    theBatteryAndThePairedBatteryDoNotOverlap: i.batteryEnd < i.pairStart,
  }),
  input: {
    walked: walkedSeeds,
    retiredHit: walkedSeeds.filter((s) => s >= RETIRED_BLOCK[0] && s <= RETIRED_BLOCK[1]).length,
    preflightHit: walkedSeeds.filter((s) => s >= PREFLIGHT_BAND[0] && s <= PREFLIGHT_BAND[1]).length,
    batteryEnd: walkedBatterySeeds[1], pairStart: PAIR_BASE,
  },
  mutants: [
    { conjunct: 'everyWalkedSeedIsBookedOrADisclosedIdentitySeed', name: 'an unbooked seed was walked', mutate: (i) => ({ ...i, walked: [...i.walked, 1] }) },
    { conjunct: 'theRetiredBlockIsNeverTouched', name: 'the retired block was walked', mutate: (i) => ({ ...i, retiredHit: 1 }) },
    { conjunct: 'thePreflightBandIsDisjointFromEveryWalkedSeed', name: 'a preflight seed was walked', mutate: (i) => ({ ...i, preflightHit: 1 }) },
    { conjunct: 'theBatteryAndThePairedBatteryDoNotOverlap', name: 'the two batteries collided', mutate: (i) => ({ ...i, batteryEnd: i.pairStart }) },
  ],
});

/* ---- 13 ⭐⭐ gSchema — THE ALLOWLIST SCHEMA (#298 item 3 canon, first rider) ---- */
const schemaInput = { violations: [] as string[], keysAllowed: 0, refusesUnknown: false,
  refusesObjectInLeaf: false, catchesTimings: false };
registerGate<typeof schemaInput>({
  name: 'gSchema',
  fn: (i) => ({
    theHashedBodyViolatesNothingInTheSchema: i.violations.length === 0,
    theSchemaIsNonEmpty: i.keysAllowed > 0,
    aFieldNotInTheSchemaIsREFUSED: i.refusesUnknown,
    anObjectSmuggledIntoALeafSlotIsREFUSED: i.refusesObjectInLeaf,
    anInvocationTimingWouldBeCAUGHT: i.catchesTimings,
  }),
  input: schemaInput,
  mutants: [
    { conjunct: 'theHashedBodyViolatesNothingInTheSchema', name: 'the body violated the schema', mutate: (i) => ({ ...i, violations: ['x'] }) },
    { conjunct: 'theSchemaIsNonEmpty', name: 'an empty schema', mutate: (i) => ({ ...i, keysAllowed: 0 }) },
    { conjunct: 'aFieldNotInTheSchemaIsREFUSED', name: 'an unknown field slipped through', mutate: (i) => ({ ...i, refusesUnknown: false }) },
    { conjunct: 'anObjectSmuggledIntoALeafSlotIsREFUSED', name: 'an object slipped into a leaf', mutate: (i) => ({ ...i, refusesObjectInLeaf: false }) },
    { conjunct: 'anInvocationTimingWouldBeCAUGHT', name: 'a wall-clock leaf would pass', mutate: (i) => ({ ...i, catchesTimings: false }) },
  ],
});

/* ---- 14 gEnvelope — the digest is envelope-blind and re-derives off disk ---- */
const envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false };
registerGate<typeof envelopeInput>({
  name: 'gEnvelope',
  fn: (i) => ({
    aDifferentEnvelopeYieldsTheIdenticalDigest: i.crossOutIdentical,
    theDiskCopyRederivesItsOwnDigest: i.rederivesFromDisk,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'aDifferentEnvelopeYieldsTheIdenticalDigest', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'theDiskCopyRederivesItsOwnDigest', name: 'the disk copy did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
  ],
});

/* ---- 15 gFaces — EVERY published face re-derived off disk ---- */
const gFacesInput = { checked: 0, bad: [] as string[], parsed: false, keys: 0 };
registerGate<typeof gFacesInput>({
  name: 'gFaces',
  fn: (i) => ({
    theArtifactParsed: i.parsed,
    everyFaceRederivesFromTheSerializedCells: i.bad.length === 0,
    everyPublishedFaceWasChecked: i.checked === i.keys && i.keys > 0,
  }),
  input: gFacesInput,
  mutants: [
    { conjunct: 'theArtifactParsed', name: 'the artifact did not parse', mutate: (i) => ({ ...i, parsed: false }) },
    { conjunct: 'everyFaceRederivesFromTheSerializedCells', name: 'a face disagreed with its cells', mutate: (i) => ({ ...i, bad: ['x'] }) },
    { conjunct: 'everyPublishedFaceWasChecked', name: 'a face escaped the check', mutate: (i) => ({ ...i, checked: i.checked - 1 }) },
  ],
});

/* ---- 16 gMutants — the machine-derived liveness map (#268.3(a)) ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    everyConjunctIsCoveredByExactlyOneMutant: i.uncovered.length === 0,
    everyOtherMutantIsLive: i.dead === 0,
    theMutantSetIsNonEmpty: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'everyConjunctIsCoveredByExactlyOneMutant', name: 'an uncovered conjunct', mutate: (i) => ({ ...i, uncovered: ['x.y'] }) },
    { conjunct: 'everyOtherMutantIsLive', name: 'a dead mutant', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'theMutantSetIsNonEmpty', name: 'no mutants', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ========================================================================== */
/* §11 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                      */
/* ========================================================================== */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.input));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  const seen = new Set<string>();
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
    if (seen.has(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(duplicate)`);
    seen.add(mu.conjunct);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('PC-T1 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}
const runRegistry = (): { gates: Record<string, boolean>; mutants: MutantResult[] } => {
  const gates: Record<string, boolean> = {};
  const mutants: MutantResult[] = [];
  for (const spec of REGISTRY) {
    const base = spec.fn(spec.input);
    gates[spec.name] = Object.values(base).every(Boolean);
    for (const mu of spec.mutants) {
      mutants.push(runMutant(spec.name, mu.name, mu.conjunct, spec.fn, base, mu.mutate(spec.input)));
    }
  }
  return { gates, mutants };
};

/* ========================================================================== */
/* §12 ⭐⭐ THE ALLOWLIST SCHEMA (#298 item 3 canon — this stage's first ride)  */
/* ========================================================================== */
/**
 * "The hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema never
 * enters the body; forbidden-name lists are retired." (#298 item 3, verbatim.)
 *
 * A schema NODE is one of:
 *   `LEAF`             — a primitive, or an array of primitives / arrays-of-primitives. An
 *                        OBJECT here is a REFUSAL: that is exactly how the PC-T0 breach
 *                        happened (a timings object rode inside a free-form leaf).
 *   `[node]`           — an array, every element validated against `node`.
 *   `{ k: node, … }`   — an object whose key set must match the schema EXACTLY, both ways.
 */
type SchemaNode = 'LEAF' | SchemaNode[] | { [k: string]: SchemaNode };
const LEAF: SchemaNode = 'LEAF';
const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
const primitiveOk = (v: unknown): boolean => v === null || ['string', 'number', 'boolean']
  .includes(typeof v);
const leafOk = (v: unknown): boolean => {
  if (Array.isArray(v)) return v.every((x) => leafOk(x));
  return primitiveOk(v);
};
const validate = (value: unknown, node: SchemaNode, path: string, out: string[]): void => {
  if (node === 'LEAF') {
    if (!leafOk(value)) out.push(`${path}: an object (or a function) in a LEAF slot`);
    return;
  }
  if (Array.isArray(node)) {
    if (!Array.isArray(value)) { out.push(`${path}: expected an array`); return; }
    value.forEach((v, i) => validate(v, node[0], `${path}[${i}]`, out));
    return;
  }
  if (!isPlainObject(value)) { out.push(`${path}: expected an object`); return; }
  for (const k of Object.keys(value)) {
    if (!(k in node)) out.push(`${path}.${k}: NOT IN THE SCHEMA`);
  }
  for (const k of Object.keys(node)) {
    if (!(k in value)) out.push(`${path}.${k}: declared by the schema, absent from the body`);
    else validate((value as Record<string, unknown>)[k], node[k], `${path}.${k}`, out);
  }
};
const countSchemaKeys = (node: SchemaNode): number => {
  if (node === 'LEAF') return 1;
  if (Array.isArray(node)) return countSchemaKeys(node[0]);
  return Object.keys(node).reduce((a, k) => a + 1 + countSchemaKeys(node[k]), 0);
};

const CI_NODE: SchemaNode = {
  mean: LEAF, ci95: LEAF, halfWidth: LEAF, deltaOverHalfWidth: LEAF, books: LEAF,
};
const BODY_SCHEMA: SchemaNode = {
  stage: LEAF, doc: LEAF, contract: LEAF, envWhitelist: LEAF, engineEnvDoorsRefused: LEAF,
  frozen: {
    question: LEAF, clockConvention: LEAF, form: LEAF, sizingJustification: LEAF,
    tiers: { simpleAppliedTicks: LEAF, choiceAppliedTicks: LEAF },
    nCover: { value: LEAF, sensitivityBand: LEAF, sweepMethod: LEAF },
    recognitionKey: LEAF, classOrder: LEAF, relevanceRadiusMetres: LEAF,
    pressedDistanceMetres: LEAF, fixturesPerSeason: LEAF, minArmsPerCellForSpread: LEAF,
    additivity: LEAF, scoringNonClaim: LEAF,
  },
  amendment: {
    ruling: LEAF, clauses: [LEAF], srcScope: LEAF, dispatchCommit: LEAF, amendmentCommit: LEAF,
    srcTouchedSinceDispatch: [LEAF], srcTouchedSinceAmendment: LEAF,
    receipts: {
      subSwapsSeen: LEAF, subSwapsWithInheritedHold: LEAF, holdRecordsSpanningDeadBall: LEAF,
      holdRecordsTotal: LEAF, holdRecordsClean: LEAF, holdRecordsCleanAtTierLength: LEAF,
      holdRecordsKeptOlderExpiry: LEAF, deadBallClears: LEAF, deadBallClearedHolds: LEAF,
      subClears: LEAF, subClearedLiveHolds: LEAF, preProcessedSkips: LEAF,
    },
    holdTickBinsPooled: LEAF, holdTicksP50: LEAF, holdTicksP90: LEAF,
    batteryCounters: LEAF,
  },
  dormancy: {
    method: LEAF, seeds: LEAF, pooled: LEAF, pooledAtCleanHead: LEAF, identical: LEAF,
    completeBaseline: LEAF, leagueFingerprint: LEAF, leagueFingerprintAtCleanHead: LEAF,
    flagAbsentEqualsFlagFalse: LEAF,
  },
  fill: {
    method: LEAF, structuralCorrection: LEAF,
    predictions: [{
      cell: LEAF, klass: LEAF, pressed: LEAF, relation: LEAF, role: LEAF,
      exposuresPerSeasonAssumed5050: LEAF, exposuresPerSeasonMeasuredSplit: LEAF,
      seasonsToFillAssumed5050: LEAF, seasonsToFillMeasuredSplit: LEAF,
      fillsWithinOneSeasonAtN: LEAF,
    }],
    measured: [{
      cell: LEAF, arms: LEAF, simpleShareAtN: LEAF, simpleArmsAtN: LEAF, bodiesArmed: LEAF,
      bodiesReachingCoverageAtN: LEAF,
    }],
    relationSplit: [{ klass: LEAF, own: LEAF, opp: LEAF, ownShare: LEAF }],
    pressedSplit: [{
      klass: LEAF, pressed: LEAF, open: LEAF, pressedShare: LEAF, censusPressedShare: LEAF,
    }],
  },
  differentiation: [{
    nCover: LEAF, simpleShare: CI_NODE, withinBodyCellSpread: CI_NODE,
    acrossBodyCellSpread: CI_NODE,
  }],
  transitionCurves: [{
    nCover: LEAF,
    bySeason: [{ season: LEAF, arms: LEAF, simple: LEAF, simpleShare: LEAF }],
    byFixtureWithinSeason: [{ fixture: LEAF, coveredBodyCells: LEAF }],
  }],
  roleFace: {
    note: LEAF,
    atN: [{
      nCover: LEAF,
      rows: [{ role: LEAF, arms: LEAF, simple: LEAF, simpleShare: LEAF }],
      outfieldSpread: LEAF, outfieldSpreadCI: CI_NODE,
    }],
    exposureByRole: [{ role: LEAF, arms: LEAF }],
  },
  addedLag: {
    method: LEAF, pairingDisclosure: LEAF,
    baseMeanAppliedTicks: LEAF, armedMeanAppliedTicks: LEAF, addedLagAppliedTicks: LEAF,
    censusFreeLagOfRecordAppliedTicks: LEAF, ci: CI_NODE,
    base: { bodies: LEAF, reached: LEAF, meanAppliedTicks: LEAF, p50AppliedTicks: LEAF,
      p90AppliedTicks: LEAF, noSlotWithinHorizon: LEAF, bins: LEAF },
    armed: { bodies: LEAF, reached: LEAF, meanAppliedTicks: LEAF, p50AppliedTicks: LEAF,
      p90AppliedTicks: LEAF, noSlotWithinHorizon: LEAF, bins: LEAF },
    slotChannelDisclosure: LEAF,
    baseSlotChannel: { bodies: LEAF, reached: LEAF, meanAppliedTicks: LEAF, p50AppliedTicks: LEAF,
      p90AppliedTicks: LEAF, noSlotWithinHorizon: LEAF, bins: LEAF },
    armedSlotChannel: { bodies: LEAF, reached: LEAF, meanAppliedTicks: LEAF, p50AppliedTicks: LEAF,
      p90AppliedTicks: LEAF, noSlotWithinHorizon: LEAF, bins: LEAF },
    steeringChannelDisclosure: LEAF,
    steerBase: LEAF, steerArmed: LEAF,
  },
  selfStarvation: [{
    season: LEAF, matches: LEAF, arms: LEAF, firings: LEAF, armsPerMatch: LEAF,
    firingsPerMatch: LEAF,
  }],
  seasonReset: { seasonEnds: LEAF, nonEmptyAfterReset: LEAF, exposuresAtSeasonEndTotal: LEAF },
  nSweep: { method: LEAF, arms: LEAF, agreedAtShippedN: LEAF },
  faces: [{ key: LEAF, valueCount: LEAF }],
  perBookCells: [{
    book: LEAF, seedFirst: LEAF, seedLast: LEAF, matches: LEAF, armsOk: LEAF, counters: LEAF,
    coveredByFixture: LEAF, coveredAtSeasonEnd: LEAF, expByClassRelation: LEAF,
    expByClassPressed: LEAF, armsByCell: LEAF, simpleByCellAtN: LEAF, armsBySeasonCell: LEAF,
    simpleAtNBySeasonCell: LEAF, armsByRole: LEAF, simpleByRoleAtN: LEAF, armsByBodyCell: LEAF,
    simpleAtNByBodyCell: LEAF, armsBySeason: LEAF, firingsBySeason: LEAF, ticksBySeason: LEAF,
    bookExposuresAtSeasonEnd: LEAF, bookExposuresAfterReset: LEAF,
  }],
  perPairCells: [{
    seed: LEAF, arm: LEAF, armOk: LEAF, ticks: LEAF, events: LEAF, bodies: LEAF,
    decideBins: LEAF, redecideBins: LEAF, steerApplicable: LEAF,
    steerRetargetedOnFirstTick: LEAF,
    holdRecords: LEAF, holdRecordsClean: LEAF, holdRecordsCleanAtTierLength: LEAF,
    holdRecordsKeptOlderExpiry: LEAF, holdRecordsSuperseded: LEAF, holdRecordsOpenAtWhistle: LEAF,
    holdRecordsSpanningDeadBall: LEAF, holdTickBins: LEAF, subSwapsSeen: LEAF,
    subSwapsWithInheritedHold: LEAF, counters: LEAF,
  }],
  fieldOrders: {
    counters: LEAF, cells: LEAF, classes: LEAF, roles: LEAF, nBand: LEAF,
  },
  sources: {
    dose: LEAF, doseFileBytesSha256: LEAF, doseRederivedBodySha256: LEAF, doseShippedConstant: LEAF,
    census: LEAF, censusFileBytesSha256: LEAF, censusRederivedBodySha256: LEAF,
    censusCommittedSha256: LEAF, pcT0: LEAF, pcT0FileBytesSha256: LEAF,
  },
  seeds: {
    block: LEAF, battery: LEAF, pairedBattery: LEAF, pinSuite: LEAF,
    amendmentScratchDisclosed: LEAF, preflightBandDeclaredAndDrawn: LEAF,
    identityDisclosedForeign: LEAF, retiredBlockNeverTouched: LEAF,
  },
  stats: { floorFromRuling: LEAF, seedsDrawn: LEAF, bootstrapResamples: LEAF, unit: LEAF },
  gDetDigests: { runA: LEAF, runB: LEAF },
  // ⭐ the gate maps are keyed by the REGISTRY's own names — an explicit allowlist derived from
  // the one place gate names live, so a new gate cannot enter the body unregistered.
  gates: Object.fromEntries(REGISTRY.map((s) => [s.name, LEAF])),
  mutants: [{ gate: LEAF, name: LEAF, conjunct: LEAF, flipped: LEAF,
    othersSurvived: LEAF, live: LEAF }],
  coverage: Object.fromEntries(REGISTRY.map((s) => [s.name, LEAF])),
  conjunctTotal: LEAF, allGatesPass: LEAF,
  nonClaims: LEAF, movingDenominators: LEAF,
};
const SCHEMA_KEYS = countSchemaKeys(BODY_SCHEMA);

/* ========================================================================== */
/* §13 THE ARTIFACT                                                            */
/* ========================================================================== */
const bookCellOf = (c: BookCells): Record<string, unknown> => ({
  book: c.book, seedFirst: c.seedFirst, seedLast: c.seedLast, matches: c.matches,
  armsOk: c.armsOk, counters: c.counters,
  coveredByFixture: c.coveredByFixture, coveredAtSeasonEnd: c.coveredAtSeasonEnd,
  expByClassRelation: c.expByClassRelation, expByClassPressed: c.expByClassPressed,
  armsByCell: c.armsByCell, simpleByCellAtN: c.simpleByCellAtN,
  armsBySeasonCell: c.armsBySeasonCell, simpleAtNBySeasonCell: c.simpleAtNBySeasonCell,
  armsByRole: c.armsByRole, simpleByRoleAtN: c.simpleByRoleAtN,
  armsByBodyCell: c.armsByBodyCell, simpleAtNByBodyCell: c.simpleAtNByBodyCell,
  armsBySeason: c.armsBySeason, firingsBySeason: c.firingsBySeason, ticksBySeason: c.ticksBySeason,
  bookExposuresAtSeasonEnd: c.bookExposuresAtSeasonEnd,
  bookExposuresAfterReset: c.bookExposuresAfterReset,
});
const pairCellOf = (r: LagRow): Record<string, unknown> => ({
  seed: r.seed, arm: r.arm, armOk: r.armOk, ticks: r.ticks, events: r.events, bodies: r.bodies,
  decideBins: r.decideBins, redecideBins: r.redecideBins, steerApplicable: r.steerApplicable,
  steerRetargetedOnFirstTick: r.steerRetargetedOnFirstTick,
  holdRecords: r.holdRecords, holdRecordsClean: r.holdRecordsClean,
  holdRecordsCleanAtTierLength: r.holdRecordsCleanAtTierLength,
  holdRecordsKeptOlderExpiry: r.holdRecordsKeptOlderExpiry,
  holdRecordsSuperseded: r.holdRecordsSuperseded,
  holdRecordsOpenAtWhistle: r.holdRecordsOpenAtWhistle,
  holdRecordsSpanningDeadBall: r.holdRecordsSpanningDeadBall,
  holdTickBins: r.holdTickBins, subSwapsSeen: r.subSwapsSeen,
  subSwapsWithInheritedHold: r.subSwapsWithInheritedHold, counters: r.counters,
});

/** ⭐ #287 item 1 + #297 corrections item 4: re-derive EVERY face off the SERIALIZED artifact. */
const rederiveFromDisk = (p: string): { checked: number; bad: string[]; parsed: boolean } => {
  let file: Record<string, unknown>;
  try { file = readJson(p); } catch { return { checked: 0, bad: ['PARSE'], parsed: false }; }
  const books = file.perBookCells as Record<string, unknown>[] | undefined;
  const pairs = file.perPairCells as Record<string, unknown>[] | undefined;
  const faces = file.faces as { key: string; valueCount: number }[] | undefined;
  if (books === undefined || pairs === undefined || faces === undefined) {
    return { checked: 0, bad: ['SHAPE'], parsed: false };
  }
  const bcol = (i: number): number => books.reduce((a, c) => a + (c.counters as number[])[i], 0);
  const want: Record<string, number> = {
    armsTotal: bcol(CF.arms),
    armsSimpleTotal: bcol(CF.armsSimple),
    armsChoiceTotal: bcol(CF.armsChoice),
    firingsTotal: bcol(CF.firings),
    exposuresNotedTotal: bcol(CF.exposuresNoted),
    armedWithMemoryTotal: bcol(CF.armedWithMemory),
    heldExecutorTicksTotal: bcol(CF.heldExecutorTicks),
    decisionsHeldTotal: bcol(CF.decisionsHeld),
    overlapRestartsTotal: bcol(CF.overlapRestarts),
    overlapNoExtendTotal: bcol(CF.overlapNoExtend),
    preProcessedSkipsTotal: bcol(CF.preProcessedSkips),
    heldThroughReassignmentTotal: bcol(CF.heldThroughReassignment),
    subClearsTotal: bcol(CF.subClears),
    subClearedLiveHoldsTotal: bcol(CF.subClearedLiveHolds),
    subClearedMemoriesTotal: bcol(CF.subClearedMemories),
    deadBallClearsTotal: bcol(CF.deadBallClears),
    deadBallClearedHoldsTotal: bcol(CF.deadBallClearedHolds),
    appliedTicksWalkedTotal: bcol(CF.appliedTicks),
    matchesWalkedTotal: books.reduce((a, c) => a + (c.matches as number), 0),
    armsOkTotal: books.reduce((a, c) => a + (c.armsOk as number), 0),
    seasonResetsNonEmpty: books.reduce((a, c) => a
      + (c.bookExposuresAfterReset as number[]).filter((v) => v !== 0).length, 0),
    batterySubSwapsSeenTotal: bcol(CF.subSwapsSeen),
    batterySubSwapsWithInheritedHoldTotal: bcol(CF.subSwapsWithInheritedHold),
  };
  PC_CLASSES.forEach((k, ki) => {
    want[`relationOwn.${k}`] = books.reduce(
      (a, c) => a + (c.expByClassRelation as number[][])[ki][0], 0);
    want[`relationOpp.${k}`] = books.reduce(
      (a, c) => a + (c.expByClassRelation as number[][])[ki][1], 0);
    want[`pressed.${k}`] = books.reduce(
      (a, c) => a + (c.expByClassPressed as number[][])[ki][0], 0);
  });
  PC_BOOK_CELLS.forEach((cellKey, ci) => {
    want[`armsByCell.${cellKey}`] = books.reduce((a, c) => a + (c.armsByCell as number[])[ci], 0);
    N_BAND.forEach((n, ni) => {
      want[`simpleByCellAtN${n}.${cellKey}`] = books.reduce(
        (a, c) => a + (c.simpleByCellAtN as number[][])[ci][ni], 0);
    });
  });
  ROLE_LIST.forEach((r, ri) => {
    want[`armsByRole.${r}`] = books.reduce((a, c) => a + (c.armsByRole as number[])[ri], 0);
    N_BAND.forEach((n, ni) => {
      want[`simpleByRoleAtN${n}.${r}`] = books.reduce(
        (a, c) => a + (c.simpleByRoleAtN as number[][])[ri][ni], 0);
    });
  });
  for (let s = 0; s < SEASONS; s++) {
    want[`armsBySeason.${s + 1}`] = books.reduce((a, c) => a + (c.armsBySeason as number[])[s], 0);
    want[`firingsBySeason.${s + 1}`] = books.reduce(
      (a, c) => a + (c.firingsBySeason as number[])[s], 0);
    N_BAND.forEach((n, ni) => {
      want[`simpleBySeasonAtN${n}.${s + 1}`] = books.reduce(
        (a, c) => a + sum((c.simpleAtNBySeasonCell as number[][][])[ni][s]), 0);
    });
  }
  for (let f = 0; f < FIXTURES_PER_SEASON; f++) {
    N_BAND.forEach((n, ni) => {
      want[`coveredByFixtureAtN${n}.${f + 1}`] = books.reduce((a, c) => a + sum(
        Array.from({ length: SEASONS }, (_, s) => (c.coveredByFixture as number[][][])[s][f][ni]),
      ), 0);
    });
  }
  const armBins = (arm: string, field: 'decideBins' | 'redecideBins'): number[] => {
    const bins = zeros(H_DECIDE + 1);
    for (const r of pairs) {
      if (r.arm !== arm) continue;
      (r[field] as number[]).forEach((v, i) => { bins[i] += v; });
    }
    return bins;
  };
  const p50Of = (bins: number[], q: number): number =>
    pctFromBins(bins.map((v, i) => (i === 0 ? 0 : v)), q) + 1;
  const bSlot = armBins('base', 'decideBins');
  const aSlot = armBins('armed', 'decideBins');
  want.pairBaseSlotChannelBodies = sum(bSlot);
  want.pairArmedSlotChannelBodies = sum(aSlot);
  want.pairBaseSlotChannelP50AppliedTicks = p50Of(bSlot, 0.5);
  want.pairArmedSlotChannelP50AppliedTicks = p50Of(aSlot, 0.5);
  const bBins = armBins('base', 'redecideBins');
  const aBins = armBins('armed', 'redecideBins');
  want.pairBaseDecideBodies = sum(bBins);
  want.pairArmedDecideBodies = sum(aBins);
  want.pairBaseDecideP50AppliedTicks = p50Of(bBins, 0.5);
  want.pairArmedDecideP50AppliedTicks = p50Of(aBins, 0.5);
  want.pairBaseDecideP90AppliedTicks = p50Of(bBins, 0.9);
  want.pairArmedDecideP90AppliedTicks = p50Of(aBins, 0.9);
  const armedPairs = pairs.filter((r) => r.arm === 'armed');
  want.pairArmedSubSwapsWithInheritedHold = armedPairs.reduce(
    (a, r) => a + (r.subSwapsWithInheritedHold as number), 0);
  want.pairArmedHoldRecordsSpanningDeadBall = armedPairs.reduce(
    (a, r) => a + (r.holdRecordsSpanningDeadBall as number), 0);
  want.pairArmedHoldRecordsClean = armedPairs.reduce(
    (a, r) => a + (r.holdRecordsClean as number), 0);
  want.pairArmedHoldRecordsCleanAtTierLength = armedPairs.reduce(
    (a, r) => a + (r.holdRecordsCleanAtTierLength as number), 0);
  const hb = Array.from({ length: 48 }, (_, i) => armedPairs.reduce(
    (a, r) => a + (r.holdTickBins as number[])[i], 0));
  want.pairArmedHoldTicksP50 = pctFromBins(hb, 0.5);
  want.pairArmedHoldTicksP90 = pctFromBins(hb, 0.9);

  const bad: string[] = [];
  let checked = 0;
  for (const f of faces) {
    checked++;
    if (!(f.key in want)) { bad.push(`${f.key}:UNCOVERED`); continue; }
    const w = want[f.key];
    const got = f.valueCount;
    const same = (Number.isNaN(w) && Number.isNaN(got)) || w === got;
    if (!same) bad.push(`${f.key}:${got}≠${w}`);
  }
  return { checked, bad, parsed: true };
};

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PC-T1 — THE LEARNING EXAM (the pre-exam amendment + the multi-season armed read)',
  doc: 'docs/world-model/PC-T1-LEARNING-EXAM.md',
  contract: 'docs/world-model/PC-PERCEPTION-CONTRACT.md §2 (M-PC.1–5); dispatched by ruling '
    + '#298 item 6 with the pre-exam amendment ordered at #298 item 4.',
  envWhitelist: [...ENV_WHITELIST],
  engineEnvDoorsRefused: [...ENGINE_DOORS],
  frozen: {
    question: 'Do the recognition books FILL as the census arithmetic predicts, and do reaction '
      + 'tiers DIFFERENTIATE at cell grain, across a multi-season ARMED league?',
    clockConvention: '⭐ every duration here is APPLIED TICKS on the SIM clock unless the field '
      + 'name ends `SimSeconds`, `Metres`, `Seasons` or `Share` (#294 item 3: a field carries '
      + 'the unit its name claims).',
    form: 'THE L3-T1 EXAM FORM: a BOOK is a franchise pair walked across seasons with FIXED '
      + 'TeamInfos, so the same bodies live the whole career; only the seed varies fixture to '
      + 'fixture. Fixtures are CONSTRUCTED DIRECTLY with matchFlags and the arm is ASSERTED '
      + 'LIVE on every walk (#283.2(iv): worker-simmed fixtures play the SHIPPED world — '
      + 'League.toJSON omits matchFlags).',
    sizingJustification: `${BOOKS} books × ${SEASONS} seasons × ${FIXTURES_PER_SEASON} fixtures `
      + `= ${BATTERY_SPAN} armed fixtures. SIZED FROM THE FILL TABLE: PC-T0 §2 predicts most `
      + 'cells cross N_cover = 18 inside 4 seasons of un-reset accumulation and the hot cells '
      + 'inside HALF A MATCH, while dribblePush|GK|pressed needs ~39 seasons and '
      + 'looseBallSpill|GK|open never fills. Because M-PC.3 RESETS the book every season, the '
      + 'informative horizon is WITHIN a season; the seasons are replications that also carry '
      + 'the self-starvation trajectory. 8 seasons gives 8 within-season replications per book '
      + 'and 12 books gives the bootstrap its independent clusters.',
    tiers: { simpleAppliedTicks: PC_TIER_SIMPLE_TICKS, choiceAppliedTicks: PC_TIER_CHOICE_TICKS },
    nCover: {
      value: PC_N_COVER, sensitivityBand: [...N_BAND],
      sweepMethod: '⭐ INSTRUMENT-SIDE: the seat writes exactly ONE exposure per arm and decides '
        + 'the tier BEFORE writing it, so a body\'s coverage at arm time IS his count of prior '
        + 'arms in that cell since the season reset. The band is re-derived from that stream; '
        + 'NO world ever ran an N other than PC_N_COVER. gNSweep proves the re-derivation '
        + 'reproduces the seat\'s own tier on every arm at the shipped N.',
    },
    recognitionKey: 'class × pressed × relation (#297 item 4 H1) — 7 × 2 × 2 = 28 cells.',
    classOrder: [...PC_CLASSES],
    relevanceRadiusMetres: PC_RELEVANCE_M,
    pressedDistanceMetres: TOUCH_CONTROL_DIST,
    fixturesPerSeason: FIXTURES_PER_SEASON,
    minArmsPerCellForSpread: MIN_ARMS_PER_CELL,
    additivity: '⭐ #297 item 5 BINDING: added-lag = armed − base at event grain. The world\'s '
      + 'own ≈6.54-tick decide cadence (#297 corrections item 2) is NOT the seam\'s credit and '
      + 'the raw total is never reported as one.',
    scoringNonClaim: '⭐ H-PC.1 IS NOT SCORED HERE. H-PC.1(a) is scored at CELL grain at PC-T2; '
      + 'the differentiation faces below are the PREVIEW #298 item 6 asked for.',
  },
  amendment: {
    ruling: '#298 item 4 — the PRE-EXAM AMENDMENT, ridden at the head of this stage.',
    clauses: [
      '(a) becomeSub clears the seat\'s per-gid state — a sub must not inherit the departed '
        + 'body\'s hold and frozen target.',
      '(b) holds CLEAR at dead-ball transitions — "a restart voids the surprise\'s context — '
        + 'closes the clock-skew class".',
      '(c) the preProcessedSkips counter moves onto the census grain (counted AFTER the '
        + 'relevance-radius filter; the PC-C0 ordering sentOff → initiator → distance).',
      '(d) the `extended` flag is renamed to what it measures — pcHoldKeptOlderExpiry marks '
        + 'max() KEEPING the older expiry.',
    ],
    srcScope: [...AMENDMENT_SRC_SCOPE],
    dispatchCommit: DISPATCH_COMMIT,
    amendmentCommit: AMENDMENT_COMMIT,
    srcTouchedSinceDispatch: SRC_SINCE_DISPATCH,
    srcTouchedSinceAmendment: SRC_SINCE_AMENDMENT === '' ? 'NOTHING' : SRC_SINCE_AMENDMENT,
    receipts: AMENDMENT_RECEIPTS,
    holdTickBinsPooled: holdBinsPooled,
    holdTicksP50: pctFromBins(holdBinsPooled, 0.5),
    holdTicksP90: pctFromBins(holdBinsPooled, 0.9),
    batteryCounters: COUNTER_FIELD_ORDER.map((_k, i) => col(i)),
  },
  dormancy: {
    method: '10 bare + 10 v7-armed matches, ball state + all 12 bodies every 37th tick, pooled '
      + 'into ONE digest, RE-PROVEN AFTER the amendment; plus the repo\'s own league '
      + 'fingerprint. ⚠ the identity seeds belong to the CONSUMED PW-T0b block and are '
      + 're-walked for the comparison only.',
    seeds: [...IDENTITY_SEEDS],
    pooled: IDENTITY_POOLED,
    pooledAtCleanHead: WORLD_IDENTITY_POOLED_AT_HEAD,
    identical: IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD,
    completeBaseline: IDENTITY_COMPLETE,
    leagueFingerprint: LEAGUE_FP,
    leagueFingerprintAtCleanHead: LEAGUE_FINGERPRINT_AT_HEAD,
    flagAbsentEqualsFlagFalse: absentEqualsFalse,
  },
  fill: {
    method: 'the census arithmetic (PC-C0 §CLASSES + EXPOSURE, read from its own artifact) '
      + 'run per cell per role, at the 50/50 relation split PC-T0 ASSUMED and at the split '
      + 'MEASURED here; against the walked books\' own per-fixture coverage counts.',
    structuralCorrection: '⭐⭐ THE CORRECTION THE EXAM FORCES: M-PC.3 resets the book EVERY '
      + 'SEASON, so a cell whose predicted fill time exceeds ONE season does not fill slowly — '
      + 'it NEVER fills. `exposuresPerSeason` against N_cover is therefore the predicted '
      + 'quantity of record, and `seasonsToFill` is published beside it as the census\'s own '
      + 'un-reset arithmetic.',
    predictions: FILL_PREDICTIONS,
    measured: cellFillMeasured,
    relationSplit,
    pressedSplit: pressedSplitMeasured,
  },
  differentiation: DIFFERENTIATION,
  transitionCurves: TRANSITION_CURVES,
  roleFace: {
    note: '⭐ H2 IS REPORTED, NEVER SCORED (#297 item 4 H2). If role-flat exposure yields '
      + 'role-flat reaction, that is a FINDING about doctrine §0\'s claim.',
    atN: ROLE_FACE,
    exposureByRole: ROLE_EXPOSURE,
  },
  addedLag: {
    method: 'PC-C0\'s DECIDE-channel instrument re-run verbatim on a PAIRED battery (base v7 vs '
      + 'v7+PC, the same seeds): for every affected body inside the relevance radius, the first '
      + 'APPLIED tick at which he enters a step with an open decision slot. The published value '
      + 'is the k−1-CORRECTED form (#297 corrections item 2), so the base arm is directly '
      + 'comparable with the census\'s free lag of record.',
    pairingDisclosure: '⚠ PAIRING IS AT SEED LEVEL, NOT EVENT LEVEL: an armed world diverges '
      + 'from its base within ticks, so the two arms do not contain the same events. This is '
      + 'the difference of two distributions drawn from the same seeds, and the denominators '
      + 'are published per arm because they MOVE.',
    baseMeanAppliedTicks: ADDED_LAG.baseMeanAppliedTicks,
    armedMeanAppliedTicks: ADDED_LAG.armedMeanAppliedTicks,
    addedLagAppliedTicks: ADDED_LAG.addedLagAppliedTicks,
    censusFreeLagOfRecordAppliedTicks: ADDED_LAG.censusFreeLagOfRecordAppliedTicks,
    ci: ADDED_LAG.ci,
    base: BASE_DECIDE,
    armed: ARMED_DECIDE,
    slotChannelDisclosure: '⚠⚠ THE CHANNEL OF RECORD IS "RE-DECIDED", NOT "REACHED A SLOT", and '
      + 'the preflight is why. PC-C0 §DOUBTS 7 already warned that its decide lag measures '
      + '"reaches a slot", not "re-decides differently". Under this seam the AND-gate blocks a '
      + 'held body\'s slot AND never re-arms his timer, so a held body sits at '
      + '`decisionTimer <= 0` for the whole hold and PC-C0\'s own predicate fires EARLIER in '
      + 'the armed arm than in the base arm — the raw slot channel reports the seam making the '
      + 'world FASTER, which is an instrument artefact, not a finding. The re-decide predicate '
      + '(his timer was actually RE-ARMED) is IDENTICAL to PC-C0\'s in the base arm, because '
      + 'the decide loop arms `AI_INTERVAL` the moment the slot opens; the two only separate '
      + 'where the gate bites. Both channels are published; only the re-decide one is '
      + 'differenced.',
    baseSlotChannel: BASE_SLOT,
    armedSlotChannel: ARMED_SLOT,
    steeringChannelDisclosure: '⚠ THE STEERING CHANNEL IS NOT GIVEN AN ADDED-LAG NUMBER, and '
      + 'the reason is PC-C0\'s own §CORRECTIONS 5 hazard: its steering instrument measures the '
      + 'divergence of `interceptBall(p, ball)` — a FUNCTION OF STATE the held body is not '
      + 'using. Under a hold the body\'s APPLIED target is the frozen one while that function '
      + 'keeps tracking the truth, so the instrument would report NO added lag on precisely the '
      + 'channel the seam holds. The two arms\' raw first-tick retargeting counts are published '
      + 'so the asymmetry is visible, and they are NOT differenced.',
    steerBase: [sum(lagRowsOf('base').map((r) => r.steerApplicable)),
      sum(lagRowsOf('base').map((r) => r.steerRetargetedOnFirstTick))],
    steerArmed: [sum(armedRows.map((r) => r.steerApplicable)),
      sum(armedRows.map((r) => r.steerRetargetedOnFirstTick))],
  },
  selfStarvation: SELF_STARVATION,
  seasonReset: SEASON_RESET,
  nSweep: {
    method: 'the instrument re-derives the tier at the shipped N from its own running exposure '
      + 'count and compares it to the seat\'s own decision on EVERY arm.',
    arms: SWEEP.arms, agreedAtShippedN: SWEEP.agreed,
  },
  faces: FACES,
  perBookCells: CELLS.map(bookCellOf),
  perPairCells: PAIR_ROWS.map(pairCellOf),
  fieldOrders: {
    counters: [...COUNTER_FIELD_ORDER], cells: [...PC_BOOK_CELLS], classes: [...PC_CLASSES],
    roles: [...ROLE_LIST], nBand: [...N_BAND],
  },
  sources: {
    dose: `${T1_PATH} · poolT1DoseCells`,
    doseFileBytesSha256: DOSE_FILE_BYTES_SHA,
    doseRederivedBodySha256: DOSE_REDERIVED_SHA,
    doseShippedConstant: L3_T1_SHA,
    census: C0_PATH,
    censusFileBytesSha256: C0_FILE_BYTES_SHA,
    censusRederivedBodySha256: C0_REDERIVED_SHA,
    censusCommittedSha256: C0_COMMITTED_SHA,
    pcT0: T0_PATH,
    pcT0FileBytesSha256: T0_FILE_BYTES_SHA,
  },
  seeds: {
    block: [...BLOCK],
    battery: [...walkedBatterySeeds],
    pairedBattery: [PAIR_SEEDS[0], PAIR_SEEDS[PAIR_SEEDS.length - 1]],
    pinSuite: [...PIN_SUITE_SEEDS],
    amendmentScratchDisclosed: [...AMENDMENT_SCRATCH],
    preflightBandDeclaredAndDrawn: [...PREFLIGHT_BAND],
    identityDisclosedForeign: [...IDENTITY_SEEDS],
    retiredBlockNeverTouched: [...RETIRED_BLOCK],
  },
  stats: {
    floorFromRuling: STATS_FLOOR_FROM_RULING, seedsDrawn: [...STATS_SEEDS],
    bootstrapResamples: BOOTSTRAP,
    unit: 'the BOOK (the franchise pair walked across seasons) for every battery face; the '
      + 'SEED for the paired added-lag face.',
  },
  gDetDigests: { runA: digestA, runB: digestB },
  gates, mutants, coverage: COVERAGE_MAP, conjunctTotal: CONJUNCT_TOTAL,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ H-PC.1 IS NOT SCORED HERE (#297 item 4 H2: it is scored at CELL grain at PC-T2). The '
      + 'differentiation faces are the preview #298 item 6 ordered, with CIs.',
    '⭐ H2 (role differentiation) is REPORTED and never scored, by ruling.',
    'The class predicates are PC-C0\'s, reused verbatim; they are STATE-TRANSITION detectors '
      + 'over public state and can under- or over-count at the margin as the census disclosed.',
    'The added-lag receipt pairs at SEED level, not event level; the two arms\' event streams '
      + 'diverge and the denominators are published because they move.',
    'A book here is a franchise pair walked with FIXED TeamInfos, not a League round-trip: '
      + 'promotion, rotation, injury turnover and the Evo Cup are absent by construction.',
    'The steering channel gets no added-lag number, for the reason stated in `addedLag'
      + '.steeringChannelDisclosure` — an instrument that would understate it is worse than none.',
  ],
  movingDenominators: [
    'addedLag.base.bodies vs addedLag.armed.bodies — the affected-body counts differ between '
      + 'arms because the worlds diverge; every lag face is conditioned on its OWN arm.',
    'fill.measured[].bodiesArmed — the per-cell body denominator differs cell by cell; a cell '
      + 'no body ever visits has denominator 0 and is published as NaN, never as 0 %.',
    'differentiation[].withinBodyCellSpread — the body denominator is bodies with ≥ 2 cells at '
      + `≥ ${MIN_ARMS_PER_CELL} arms; it moves with N only through the numerator, never the set.`,
    'transitionCurves[].bySeason[].arms — the per-season arm count is the self-starvation '
      + 'trajectory itself and is published beside every share taken over it.',
  ],
});

const writeArtifact = (rawBody: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean; violations: string[];
} => {
  const violations: string[] = [];
  validate(rawBody, BODY_SCHEMA, '$', violations);
  if (violations.length > 0) {
    banner('PC-T1 REFUSES TO WRITE — the hashed body violates the ALLOWLIST SCHEMA '
      + '(#298 item 3 canon):');
    for (const v of violations.slice(0, 40)) banner(`  · ${v}`);
    process.exit(3);
  }
  const digest = sha(canonical(rawBody));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, mode: MODE, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall, walkMs: WALK_MS, pairMs: PAIR_MS, identityMs: IDENTITY_MS,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...rawBody, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256; delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pc-t1-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...rawBody, resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      walkMs: envelope.walkMs + 11, pairMs: envelope.pairMs + 13, identityMs: 0,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD', mode: 'ANOTHER-MODE',
      preflight: !IS_PREFLIGHT, preflightReasons: ['ANOTHER-REASON'],
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest, reread: strip(fileA), violations,
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

/* ---- the schema's own liveness: it must REFUSE the three shapes it exists to refuse ---- */
schemaInput.keysAllowed = SCHEMA_KEYS;
schemaInput.refusesUnknown = (() => {
  const v: string[] = [];
  validate({ stage: 'x', sneaky: 1 }, { stage: LEAF }, '$', v);
  return v.some((s) => s.includes('NOT IN THE SCHEMA'));
})();
schemaInput.refusesObjectInLeaf = (() => {
  const v: string[] = [];
  validate({ stage: { nested: 1 } }, { stage: LEAF }, '$', v);
  return v.length > 0;
})();
schemaInput.catchesTimings = (() => {
  const v: string[] = [];
  validate({ run: { walks: 3, wallMs: 12 } }, { run: { walks: LEAF } }, '$', v);
  return v.some((s) => s.includes('wallMs'));
})();

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
schemaInput.violations = pass1.violations;
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
const disk = rederiveFromDisk(OUT_PATH);
gFacesInput.checked = disk.checked;
gFacesInput.bad = disk.bad;
gFacesInput.parsed = disk.parsed;
gFacesInput.keys = FACES.length;
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pc-t1] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pc-t1] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
if (disk.bad.length > 0) banner(`  [pc-t1] BAD FACES: ${disk.bad.slice(0, 12).join(', ')}`);
banner(`  [pc-t1] dormancy ${IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD ? 'IDENTICAL' : 'MOVED'}`
  + ` · league fp ${LEAGUE_FP === LEAGUE_FINGERPRINT_AT_HEAD ? 'unmoved' : LEAGUE_FP}`);
banner(`  [pc-t1] arms ${ARMS_TOTAL} · simple ${SIMPLE_TOTAL} `
  + `(${round(100 * SIMPLE_TOTAL / Math.max(1, ARMS_TOTAL), 2)} %) · sweep `
  + `${SWEEP.agreed}/${SWEEP.arms}`);
for (const d of DIFFERENTIATION) {
  banner(`  [pc-t1] N=${d.nCover}  simpleShare ${d.simpleShare.mean} `
    + `· withinBody ${d.withinBodyCellSpread.mean} (Δ/hw ${d.withinBodyCellSpread.deltaOverHalfWidth})`
    + ` · acrossBody ${d.acrossBodyCellSpread.mean} (Δ/hw ${d.acrossBodyCellSpread.deltaOverHalfWidth})`);
}
banner(`  [pc-t1] added-lag ${ADDED_LAG.addedLagAppliedTicks} applied ticks `
  + `(base ${ADDED_LAG.baseMeanAppliedTicks} vs armed ${ADDED_LAG.armedMeanAppliedTicks}; census 6.54)`);
banner('  [pc-t1] amendment: inherited holds '
  + `${AMENDMENT_RECEIPTS.subSwapsWithInheritedHold + col(CF.subSwapsWithInheritedHold)}`
  + `/${AMENDMENT_RECEIPTS.subSwapsSeen + col(CF.subSwapsSeen)} swaps · dead-ball spanning `
  + `${AMENDMENT_RECEIPTS.holdRecordsSpanningDeadBall}/${AMENDMENT_RECEIPTS.holdRecordsTotal}`
  + ` · dead-ball clears ${col(CF.deadBallClears)} cutting ${col(CF.deadBallClearedHolds)} holds`);
banner(`  [pc-t1] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
void ROLES;
process.exit(allPass ? 0 : 1);
