/**
 * PC-T0 — THE REACTION-LATENCY SEAM'S UNIT RECEIPTS (docs/world-model/PC-T0-LATENCY-SEAM.md).
 *
 * The build-slice form: RECEIPTS, never an exam. Dispatched by ruling #297 item 7 under
 * PC-PERCEPTION-CONTRACT.md §2 (M-PC.1–5) with the design fixed by #297 items 3–5. Nothing here
 * scores H-PC.1 or H-PC.2; nothing here reports an effect size. Everything here is a plumbing
 * receipt for a seam that is ASLEEP in the shipped game (#289 item 1: plumbing receipts are
 * never effect sizes).
 *
 * SIX RECEIPTS:
 *   (1) ⭐⭐ DORMANCY, THE HARD GATE — the house world-identity method: 10 bare + 10 v7-armed
 *       matches pooled into ONE digest, compared to the constant taken at a clean HEAD before
 *       this seam existed, PLUS the repo's own league fingerprint (`scripts/fingerprint.ts`
 *       1337 2). Both must be UNMOVED. And flag-ABSENT ≡ flag-FALSE, per seed, per world shape.
 *   (2) TRIGGER FIRING COUNTS PER CLASS on armed walks — all seven classes, with denominators.
 *   (3) ⭐ HOLD DURATIONS EXACTLY THE DERIVED TICKS — every hold observed tick by tick; its
 *       length is its tier's own constant (12 / 27 APPLIED ticks) and nothing else.
 *   (4) ⭐⭐ THE BOOK FILLS FROM OWN EXPOSURE ONLY — an INDEPENDENT camera: at each tick the
 *       probe records the ball's position and every body's position from the ENGINE's public
 *       state, then checks that every body whose book grew on the next tick was inside the
 *       relevance radius. It re-implements NO predicate; it measures distance.
 *   (5) THE SEAM MAP — the eleven+2 steering channels and the five initiator paths located in
 *       the SHIPPED bytes with ⭐ OCCURRENCE COUNTS and EVERY site enumerated (#297 corrections
 *       item 1: one needle, one site is a lie of omission).
 *   (6) ARMED SMOKE SHAPE — a receipt that an armed world still plays football, never the exam.
 *
 * ⭐ CLOCK CONVENTION, stated once: every duration in this artifact is APPLIED TICKS on the SIM
 *   clock (`DT = 1/60` sim-s), except fields whose NAME ends `SimSeconds` (#294 item 3 /
 *   #295 item 4: a field carries the unit its name claims; a name that lies is a false field).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: PCT0_MODE (smoke|full, REQUIRED) · PCT0_N · PCT0_OUT.
 *   ANY other `PCT0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it may not write a canonical repo path.
 *
 * ⭐ #289 item 1, BY NAME: `preflight`, `preflightReasons`, `mode`, `wallMs`, `generatedAt`,
 *   `head`, `outPath` live in the ENVELOPE, never in the hashed body.
 * ⭐ #289 canon: the dose guard hashes the FILE BYTES it reads and RE-DERIVES the artifact's own
 *   digest from those bytes.
 * ⭐ #287 item 1 + #297 corrections item 4: `gFaces` re-derives EVERY published face by parsing
 *   the SERIALIZED artifact off disk — and every percentile face has its BINS stored.
 *
 * RUN: PCT0_MODE=full npx tsx scripts/probes/pc-t0-seam-receipts.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  PC_BOOK_CELLS, PC_CLASSES, PC_INITIATOR_PAYS, PC_N_COVER, PC_N_COVER_SENSITIVITY,
  PC_RELEVANCE_M, PC_TIER_CHOICE_SIM_S, PC_TIER_CHOICE_TICKS, PC_TIER_SIMPLE_SIM_S,
  PC_TIER_SIMPLE_TICKS, pcTierTicks, type PcClass, type PcTier,
} from '../../src/ai/pcLatency';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells, L3_T1_SHA,
} from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PCT0_MODE', 'PCT0_N', 'PCT0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PCT0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('PC-T0 FATAL — refused env surface. '
    + `rogue PCT0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PCT0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`PC-T0 FATAL — PCT0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.PCT0_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PCT0_N, 10)) : null;
const OUT_ENV = process.env.PCT0_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PCT0_N'] : []),
  ...(OUT_ENV !== undefined ? ['PCT0_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pc-t0-seam-receipts-smoke.json',
  full: 'docs/world-model/data/pc-t0-seam-receipts.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pc-t0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('PC-T0 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 THE DECLARED SRC SCOPE + THE DIFF-SCOPE GATE                             */
/* ========================================================================== */
/** ⭐ The dispatch commit — ruling #297's own landing (`git log`), the diff-scope reference. */
const DISPATCH_COMMIT = '49bfd46';
/** ⭐ THE DECLARED SRC SCOPE OF THIS SLICE — the whole of it, nothing else may have moved. */
const DECLARED_SRC_SCOPE: readonly string[] = [
  'src/ai/actionExecutor.ts', 'src/ai/pcLatency.ts', 'src/sim/League.ts', 'src/sim/Match.ts',
];
const SRC_TOUCHED = gitOut(`git diff --name-only ${DISPATCH_COMMIT} -- src`)
  .split('\n').filter((s) => s.length > 0).sort();

/* ========================================================================== */
/* §3 THE DORMANCY BASELINE — the constants from a clean HEAD before this seam */
/* ========================================================================== */
/**
 * ⭐⭐ Reproduced from PW-T0b/PW-T0c: 10 bare + 10 v7-armed matches on seeds
 * 12,492,900–909, ball state + all 12 bodies sampled every 37th tick, pooled into ONE digest.
 * ⚠ Those seeds belong to the CONSUMED PW-T0b block and are re-walked here for the IDENTITY
 * comparison only — the comparison is meaningless against any other seeds.
 */
const WORLD_IDENTITY_SEEDS: readonly number[] = Array.from({ length: 10 }, (_, i) => 12_492_900 + i);
const WORLD_IDENTITY_POOLED_AT_HEAD =
  '5dafce81dfc26677147d6734c10118cfcff40b771c117da011a04eb44fc1f70c';
const LEAGUE_FINGERPRINT_SEED = 1337;
const LEAGUE_FINGERPRINT_SEASONS = 2;
const LEAGUE_FINGERPRINT_AT_HEAD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/* ========================================================================== */
/* §4 SEEDS — BOOKED = WALKED (ruling #297 item 6: the block is ≥ 12,497,000)   */
/* ========================================================================== */
const BLOCK: readonly [number, number] = [12_497_000, 12_497_999];
const SMOKE_BASE = 12_497_000;
const SMOKE_N = 3;
const RECEIPT_BASE = 12_497_100;
const RECEIPT_N_FROZEN = 8;
const CAMERA_SEED = 12_497_200;
const PIN_SUITE_SEEDS: readonly number[] = [12_497_800, 12_497_801, 12_497_802];
const PREFLIGHT_BAND: readonly [number, number] = [12_497_900, 12_497_919];
const RETIRED_BLOCK: readonly [number, number] = [12_494_000, 12_494_999];
/** ⭐ NO CI IS DRAWN IN THIS SLICE — it is a build slice. The stats stream is UNCONSUMED. */
const STATS_FLOOR_FROM_RULING = 113_200;
const STATS_DRAWS = 0;

const RECEIPT_N = N_ENV ?? (MODE === 'smoke' ? 2 : RECEIPT_N_FROZEN);
const RECEIPT_SEEDS = Array.from({ length: RECEIPT_N }, (_, i) => RECEIPT_BASE + i);
const SMOKE_SEEDS = Array.from(
  { length: MODE === 'smoke' ? 2 : SMOKE_N }, (_, i) => SMOKE_BASE + i,
);
const IDENTITY_SEEDS = N_ENV !== null ? WORLD_IDENTITY_SEEDS.slice(0, 2) : WORLD_IDENTITY_SEEDS;
const SKIP_FP = N_ENV !== null;

/* ========================================================================== */
/* §5 THE ARM — CONSTRUCTED DIRECTLY WITH matchFlags (#283 item 2)             */
/* ========================================================================== */
const V7 = 7 as const;
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
const rngTeam = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
interface ArmOpts { pc?: boolean; bare?: boolean }
const makeMatch = (seed: number, opts: ArmOpts): Match => {
  const teamA = rngTeam('A', seed * 2 + 1);
  const teamB = rngTeam('B', seed * 2 + 2);
  if (opts.bare === true) {
    return new Match({
      seed, teamA, teamB, ...(opts.pc === true ? { pcReactionLatency: true } : {}),
    });
  }
  const m = new Match({
    seed, teamA, teamB, ...a4MatchFlags(V7),
    ...(opts.pc === true ? { pcReactionLatency: true } : {}),
  });
  armA4World(m, null, V7, DOSE);
  return m;
};

/* ========================================================================== */
/* §6 THE WORLD-IDENTITY SIGNATURE — reproduced VERBATIM from PW-T0b           */
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

const tId0 = Date.now();
const identityRows: string[] = [];
for (const s of IDENTITY_SEEDS) identityRows.push(`bare ${s} ${signatureOf(makeMatch(s, { bare: true }))}`);
for (const s of IDENTITY_SEEDS) identityRows.push(`v7 ${s} ${signatureOf(makeMatch(s, {}))}`);
const IDENTITY_POOLED = sha(identityRows.join('|'));
const IDENTITY_COMPLETE = IDENTITY_SEEDS.length === WORLD_IDENTITY_SEEDS.length;
/** ⭐ flag-ABSENT ≡ flag-FALSE, per seed, per world shape — the other half of Road B. */
const absentEqualsFalse: boolean[] = [];
for (const s of IDENTITY_SEEDS.slice(0, 2)) {
  for (const bare of [true, false]) {
    const teamA = rngTeam('A', s * 2 + 1);
    const teamB = rngTeam('B', s * 2 + 2);
    const buildFalse = (): Match => {
      if (bare) return new Match({ seed: s, teamA, teamB, pcReactionLatency: false });
      const mm = new Match({ seed: s, teamA, teamB, ...a4MatchFlags(V7), pcReactionLatency: false });
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
/* §7 THE RECEIPT WALKS — the DETERMINISTIC CORE (G-DET runs it twice)         */
/* ========================================================================== */
interface HoldRecord {
  gid: number; armedTick: number; untilTick: number; ticks: number; tier: PcTier; klass: PcClass;
  /**
   * The ticks his EXECUTOR was actually held. ⚠ NOT the same as `untilTick − armedTick − 1`:
   * the engine's `step` returns before the decide/execute loops during `kickoff` / `goalPause`
   * / `halftime`, while `stepCount` has already advanced — so a hold that straddles a dead-ball
   * pause expires on the SIM clock without the body ever paying those ticks. Counted here, and
   * disclosed as `recordsSpanningDeadBall`.
   */
  observedTicks: number;
  /** true if this record's window straddled a dead-ball pause (no executor call that tick). */
  spannedDeadBall: boolean;
  /** true if the record was extended by a later surprise (the overlap rule) */
  extended: boolean;
  /** ⭐ true if a NEW arm (a fresh armedTick) replaced this record before it ran out */
  superseded: boolean;
  /** true if the record was still live at the final whistle */
  openAtWhistle: boolean;
}
interface ReceiptRow {
  seed: number;
  armedVersion: number; l3Version: number; pcLive: boolean; ticks: number;
  firings: Record<PcClass, number>;
  armedByClass: Record<PcClass, number>;
  armedByTier: Record<PcTier, number>;
  overlapRestarts: number; overlapNoExtend: number; heldExecutorTicks: number;
  decisionsHeld: number; exposuresNoted: number; armedWithMemory: number;
  preProcessedSkips: number; heldThroughReassignment: number;
  bookExposures: number; bookCellsTouched: number; bodiesWithBooks: number;
  /** cells that reached coverage at each sensitivity value (the N/2 · N · 2N hook) */
  coveredCellsAtN: number[];
  /** ⭐ STORED BINS: hold length in APPLIED ticks, index = ticks, 0..47 */
  holdTickBins: number[];
  holdRecords: number; holdRecordsClean: number; holdRecordsCleanAtTierLength: number;
  holdRecordsExtended: number; holdRecordsSuperseded: number; holdRecordsOpenAtWhistle: number;
  holdRecordsSpanningDeadBall: number;
  holdTicksMatchTierConstant: boolean;
  goals: number[]; shots: number[]; passes: number[];
}

const walkReceipt = (seed: number): ReceiptRow => {
  const m = makeMatch(seed, { pc: true });
  const seat = m.pcLatency;
  if (seat === null) throw new Error('PC-T0 FATAL — the receipt walk is not armed.');
  const nTicks = Math.round(MATCH_DURATION / DT);
  const open = new Map<number, HoldRecord>();
  const done: HoldRecord[] = [];
  let ticks = 0;
  const PAUSED = new Set(['kickoff', 'goalPause', 'halftime', 'fulltime']);
  while (!m.finished && ticks < nTicks + 600) {
    const prePhase = m.phase;
    m.step(DT);
    ticks++;
    const executorRan = !PAUSED.has(prePhase);
    // observe the hold set AFTER the step, from the seat's own read-only view
    const live = new Set<number>();
    for (const { gid, hold } of seat.holdSnapshot()) {
      live.add(gid);
      const rec = open.get(gid);
      if (rec === undefined || rec.armedTick !== hold.armedTick) {
        if (rec !== undefined) { rec.superseded = true; done.push(rec); }
        open.set(gid, {
          gid, armedTick: hold.armedTick, untilTick: hold.untilTick, ticks: hold.ticks,
          tier: hold.tier, klass: hold.klass, observedTicks: executorRan ? 1 : 0,
          extended: hold.untilTick !== hold.armedTick + 1 + hold.ticks,
          superseded: false, openAtWhistle: false, spannedDeadBall: !executorRan,
        });
      } else {
        if (executorRan) rec.observedTicks++; else rec.spannedDeadBall = true;
        rec.untilTick = hold.untilTick;
        rec.extended = rec.extended || hold.untilTick !== rec.armedTick + 1 + rec.ticks;
      }
    }
    for (const [gid, rec] of [...open]) {
      if (!live.has(gid)) { done.push(rec); open.delete(gid); }
    }
  }
  for (const rec of open.values()) { rec.openAtWhistle = true; done.push(rec); }
  // ⭐ A CLEAN record is one that was allowed to run out: not replaced by a fresh arm, not
  // extended by an overlap, and not cut off by the final whistle. Only those can be asked
  // "did you last exactly your tier's constant?" — the other three are named and counted.
  const clean = done
    .filter((h) => !h.superseded && !h.openAtWhistle && !h.extended && !h.spannedDeadBall);
  const bins = Array.from({ length: 48 }, () => 0);
  for (const r of clean) bins[Math.min(r.observedTicks, 47)]++;
  const books = [seat.books[0].snapshot(), seat.books[1].snapshot()];
  let cellsTouched = 0;
  let bodies = 0;
  const coveredAtN = PC_N_COVER_SENSITIVITY.map(() => 0);
  for (const b of books) {
    for (const row of Object.values(b)) {
      bodies++;
      for (const v of Object.values(row)) {
        cellsTouched++;
        PC_N_COVER_SENSITIVITY.forEach((n, i) => { if (v >= n) coveredAtN[i]++; });
      }
    }
  }
  const led = seat.ledger;
  const r = m.getResult();
  return {
    seed,
    armedVersion: a4ArmedVersion(m), l3Version: l3ArmedVersion(m), pcLive: m.pcReactionLatency,
    ticks,
    firings: { ...led.firings }, armedByClass: { ...led.armedByClass },
    armedByTier: { ...led.armedByTier },
    overlapRestarts: led.overlapRestarts, overlapNoExtend: led.overlapNoExtend,
    heldExecutorTicks: led.heldExecutorTicks, decisionsHeld: led.decisionsHeld,
    exposuresNoted: led.exposuresNoted, armedWithMemory: led.armedWithMemory,
    preProcessedSkips: led.preProcessedSkips,
    heldThroughReassignment: led.heldThroughReassignment,
    bookExposures: seat.books[0].totalExposures + seat.books[1].totalExposures,
    bookCellsTouched: cellsTouched, bodiesWithBooks: bodies, coveredCellsAtN: coveredAtN,
    holdTickBins: bins,
    holdRecords: done.length,
    holdRecordsClean: clean.length,
    holdRecordsCleanAtTierLength: clean.filter((h) => h.observedTicks === pcTierTicks(h.tier)).length,
    holdRecordsExtended: done.filter((h) => h.extended).length,
    holdRecordsSuperseded: done.filter((h) => h.superseded).length,
    holdRecordsOpenAtWhistle: done.filter((h) => h.openAtWhistle).length,
    holdRecordsSpanningDeadBall: done.filter((h) => h.spannedDeadBall).length,
    holdTicksMatchTierConstant: done.every((h) => h.ticks === pcTierTicks(h.tier)),
    goals: [r.score[0], r.score[1]],
    shots: [r.stats[0].shots, r.stats[1].shots],
    passes: [r.stats[0].passesCompleted, r.stats[1].passesCompleted],
  };
};

const coreRun = (): ReceiptRow[] => RECEIPT_SEEDS.map((s) => walkReceipt(s));
const tWalk0 = Date.now();
const rowsA = coreRun();
const digestA = sha(canonical(rowsA));
const rowsB = coreRun();
const digestB = sha(canonical(rowsB));
const ROWS = rowsA;
const WALK_MS = Date.now() - tWalk0;

/* ========================================================================== */
/* §8 RECEIPT (4) — THE OWN-EXPOSURE CAMERA, INDEPENDENT OF EVERY PREDICATE    */
/* ========================================================================== */
/**
 * ⭐⭐ The claim under test: "a body never gains coverage from an event outside his relevance."
 * The camera re-implements NOTHING. Each tick it records, from public engine state, the ball's
 * position and every body's distance to it; the NEXT tick it reads the books again and asks
 * only one question of every body whose book grew: was he inside `PC_RELEVANCE_M` in the
 * geometry the detector actually read? (The detector runs at the head of the following step, so
 * the geometry it reads is exactly the post-step geometry recorded here.)
 */
const tCam0 = Date.now();
const camera = (() => {
  const m = makeMatch(CAMERA_SEED, { pc: true });
  const seat = m.pcLatency;
  if (seat === null) throw new Error('PC-T0 FATAL — the camera walk is not armed.');
  const nTicks = MODE === 'smoke' ? 1200 : Math.round(MATCH_DURATION / DT);
  const totals = new Map<number, number>();
  const totalOf = (): Map<number, number> => {
    const out = new Map<number, number>();
    for (const side of [0, 1] as const) {
      const snap = seat.books[side].snapshot();
      for (const [ri, row] of Object.entries(snap)) {
        out.set(side * 1000 + Number(ri), sum(Object.values(row)));
      }
    }
    return out;
  };
  let grew = 0;
  let grewInsideRelevance = 0;
  let maxGrowerDistanceM = 0;
  let ticks = 0;
  let prevDist = new Map<number, number>();
  while (!m.finished && ticks < nTicks) {
    m.step(DT);
    ticks++;
    const now = totalOf();
    for (const [k, v] of now) {
      const before = totals.get(k) ?? 0;
      if (v > before) {
        grew++;
        const d = prevDist.get(k);
        if (d !== undefined && d <= PC_RELEVANCE_M) grewInsideRelevance++;
        if (d !== undefined && d > maxGrowerDistanceM) maxGrowerDistanceM = d;
      }
      totals.set(k, v);
    }
    // record the geometry the NEXT step's detector will read
    prevDist = new Map<number, number>();
    for (const p of m.allPlayers) {
      prevDist.set(p.side * 1000 + p.rosterIdx,
        Math.hypot(p.pos.x - m.ball.pos.x, p.pos.y - m.ball.pos.y));
    }
  }
  return {
    seed: CAMERA_SEED, ticks, growthEvents: grew, growthEventsInsideRelevance: grewInsideRelevance,
    maxGrowerDistanceMetres: round(maxGrowerDistanceM, 4),
    relevanceRadiusMetres: PC_RELEVANCE_M,
  };
})();
const CAMERA_MS = Date.now() - tCam0;

/* ========================================================================== */
/* §9 RECEIPT (5) — THE SEAM MAP, OCCURRENCE COUNTS, EVERY SITE ENUMERATED     */
/* ========================================================================== */
interface Needle { channel: string; file: string; needle: string; expect: number; role: string }
const NEEDLES: readonly Needle[] = [
  // the eleven+2 steering channels the ONE gate covers
  { channel: 'steering.chase.interceptSolution', file: 'src/ai/actionExecutor.ts', needle: 'const sol = interceptBall(p, ball);', expect: 3, role: 'HELD' },
  { channel: 'steering.chase.jockeyStandoff', file: 'src/ai/actionExecutor.ts', needle: 'const standoff = 0.9 + jockey * 0.5;', expect: 1, role: 'HELD' },
  { channel: 'steering.mark.stance', file: 'src/ai/actionExecutor.ts', needle: 'const laneW = 0.22 + g.markingAggression * 0.22;', expect: 1, role: 'HELD' },
  { channel: 'steering.mark.reactionLag', file: 'src/ai/actionExecutor.ts', needle: 'const lag = 0.45 - p.attrs.defending * 0.25;', expect: 1, role: 'ALREADY-A-HOLD (the generalised precedent)' },
  { channel: 'steering.mark.trapHold', file: 'src/ai/actionExecutor.ts', needle: 'const trapHold = ((g.trapBias ?? 0.5) - 0.5) * 2;', expect: 1, role: 'HELD' },
  { channel: 'steering.receive.descentReroute', file: 'src/ai/actionExecutor.ts', needle: "p.action.type === 'ReceivePass' &&", expect: 1, role: 'HELD' },
  { channel: 'steering.formationSpot', file: 'src/ai/actionExecutor.ts', needle: 'target = formationSpot(p, team, ball, hasBall, opp, abandonRest, pmMover);', expect: 2, role: 'HELD' },
  { channel: 'steering.support', file: 'src/ai/actionExecutor.ts', needle: 'target = supportSpot(p, team, ball, match.ctbSupportPlane);', expect: 1, role: 'HELD' },
  { channel: 'steering.gk.position', file: 'src/ai/actionExecutor.ts', needle: 'p.faceTarget = ball.pos; // backpedal facing the play (27.5)', expect: 1, role: 'HELD (⭐ COPIED — aliases ball.pos)' },
  { channel: 'steering.gk.rush', file: 'src/ai/actionExecutor.ts', needle: "case 'GoalkeeperRush': {", expect: 1, role: 'HELD (⭐ COPIED — aliases ball.pos)' },
  { channel: 'steering.gk.save', file: 'src/ai/actionExecutor.ts', needle: "case 'GoalkeeperSave': {", expect: 1, role: 'HELD (⭐ #297 corrections item 1 — the amended channel; COPIED)' },
  { channel: 'steering.makeRun', file: 'src/ai/actionExecutor.ts', needle: "case 'MakeRun': {", expect: 1, role: 'HELD (⭐ #297 corrections item 1 — the amended channel)' },
  // ⭐ the ONE gate, and the ONE detector
  { channel: 'pc.executorGate', file: 'src/ai/actionExecutor.ts', needle: 'const pcSeat = match.pcLatency;', expect: 1, role: '⭐⭐ THE ONE PER-BODY GATE' },
  { channel: 'pc.decideAndGate', file: 'src/sim/Match.ts', needle: 'const pcHeld = p.decisionTimer <= 0 && this.pcLatency !== null', expect: 1, role: '⭐ THE DECIDE-LOOP AND-GATE' },
  { channel: 'pc.detector', file: 'src/sim/Match.ts', needle: 'private pcLatencyObserve(): void {', expect: 1, role: '⭐ THE ONE DETECTOR' },
  { channel: 'pc.seatFork', file: 'src/sim/Match.ts', needle: 'this.pcLatency = this.pcReactionLatency', expect: 1, role: '⭐ THE ONE ARMING FORK' },
  // the FIVE initiator paths — untouched, by name, with every occurrence enumerated
  { channel: 'initiator.knockAndGo', file: 'src/sim/mechanics.ts', needle: 'p.decisionTimer = 0;', expect: 1, role: 'INITIATOR-PATH (untouched)' },
  { channel: 'initiator.captureSettle', file: 'src/sim/Match.ts', needle: 'p.decisionTimer = Math.max(p.decisionTimer, inShootingRange ? 0.08 : recollect ? 0.18 : 0.3);', expect: 1, role: 'INITIATOR-PATH (untouched)' },
  { channel: 'initiator.gkFeetOverride', file: 'src/sim/Match.ts', needle: 'if (gkFeet) p.decisionTimer = Math.min(p.decisionTimer, 0.18);', expect: 1, role: 'INITIATOR-PATH (untouched)' },
  { channel: 'initiator.oneTouchWindow', file: 'src/sim/Match.ts', needle: 'p.firstTouchWindow = 0.28;', expect: 1, role: 'INITIATOR-PATH (untouched; H4 the PRE-PROCESSING channel)' },
  { channel: 'initiator.substitutionArrival', file: 'src/sim/Match.ts', needle: 'out.decisionTimer = 0.05;', expect: 2, role: 'INITIATOR-PATH (untouched; TWO sites: injury sub + ordinary sub)' },
  { channel: 'restart.kickoffStriker', file: 'src/sim/Match.ts', needle: 'st.decisionTimer = 0.05;', expect: 1, role: 'NOT AN INITIATOR PATH — enumerated so `= 0.05` has no silent third site' },
  // ⭐ the team layer stays out of it (H3)
  { channel: 'assignment.chasers', file: 'src/ai/TeamBrain.ts', needle: 'pcLatency', expect: 0, role: 'HOLD-INSUFFICIENT by design — the team layer is UNTOUCHED (H3)' },
  { channel: 'cbSeat.armingBlock', file: 'src/ai/PlayerBrain.ts', needle: 'pcLatency', expect: 0, role: '⭐ M-PC.5 / M-PW.4 form: the CB seat\'s arming block is machine-asserted UNTOUCHED' },
];
const SEAM_FILE_BYTES: Record<string, string> = {};
const seamRows = NEEDLES.map((n) => {
  const src = SEAM_FILE_BYTES[n.file] ?? (SEAM_FILE_BYTES[n.file] = readFileSync(n.file, 'utf8'));
  const occurrences = src.split(n.needle).length - 1;
  const lines: number[] = [];
  const all = src.split('\n');
  for (let i = 0; i < all.length; i++) if (all[i].includes(n.needle)) lines.push(i + 1);
  return {
    channel: n.channel, file: n.file, needle: n.needle, role: n.role,
    occurrencesFound: occurrences, occurrencesExpected: n.expect,
    sites: lines.map((l) => `${n.file}:${l}`),
  };
});
const seamCountsMatch = seamRows.every((r) => r.occurrencesFound === r.occurrencesExpected);
const seamSitesEnumerated = seamRows.every((r) => r.sites.length === r.occurrencesFound);
const SRC_FILE_SHAS = Object.fromEntries(
  Object.entries(SEAM_FILE_BYTES).map(([f, b]) => [f, sha(b)]),
);

/* ========================================================================== */
/* §10 RECEIPT (6) — THE ARMED SMOKE SHAPE (a receipt, never the exam)         */
/* ========================================================================== */
const tSmoke0 = Date.now();
const smokeRows = SMOKE_SEEDS.map((s) => {
  const m = makeMatch(s, { pc: true });
  m.runToCompletion();
  const r = m.getResult();
  const seat = m.pcLatency;
  return {
    seed: s, goals: [r.score[0], r.score[1]],
    shots: [r.stats[0].shots, r.stats[1].shots],
    passesCompleted: [r.stats[0].passesCompleted, r.stats[1].passesCompleted],
    holdsArmed: seat === null ? 0 : PC_CLASSES.reduce((a, k) => a + seat.ledger.armedByClass[k], 0),
    heldExecutorTicks: seat === null ? 0 : seat.ledger.heldExecutorTicks,
  };
});
const SMOKE_MS = Date.now() - tSmoke0;

/* ========================================================================== */
/* §11 THE FACES (every one re-derived from the SERIALIZED artifact by gFaces) */
/* ========================================================================== */
const totalTicksWalked = sum(ROWS.map((r) => r.ticks));
const firingsByClass = Object.fromEntries(
  PC_CLASSES.map((k) => [k, sum(ROWS.map((r) => r.firings[k]))]),
) as Record<PcClass, number>;
const armsByClass = Object.fromEntries(
  PC_CLASSES.map((k) => [k, sum(ROWS.map((r) => r.armedByClass[k]))]),
) as Record<PcClass, number>;
const armsSimple = sum(ROWS.map((r) => r.armedByTier.simple));
const armsChoice = sum(ROWS.map((r) => r.armedByTier.choice));
const pooledBins = Array.from({ length: 48 }, (_, i) => sum(ROWS.map((r) => r.holdTickBins[i])));
const FACES = [
  { key: 'firingsTotal', valueCount: sum(Object.values(firingsByClass)) },
  { key: 'armsTotal', valueCount: armsSimple + armsChoice },
  { key: 'armsSimpleTier', valueCount: armsSimple },
  { key: 'armsChoiceTier', valueCount: armsChoice },
  { key: 'heldExecutorTicksTotal', valueCount: sum(ROWS.map((r) => r.heldExecutorTicks)) },
  { key: 'decisionsHeldTotal', valueCount: sum(ROWS.map((r) => r.decisionsHeld)) },
  { key: 'exposuresNotedTotal', valueCount: sum(ROWS.map((r) => r.exposuresNoted)) },
  { key: 'overlapRestartsTotal', valueCount: sum(ROWS.map((r) => r.overlapRestarts)) },
  { key: 'overlapNoExtendTotal', valueCount: sum(ROWS.map((r) => r.overlapNoExtend)) },
  { key: 'preProcessedSkipsTotal', valueCount: sum(ROWS.map((r) => r.preProcessedSkips)) },
  { key: 'heldThroughReassignmentTotal', valueCount: sum(ROWS.map((r) => r.heldThroughReassignment)) },
  { key: 'holdRecordsTotal', valueCount: sum(ROWS.map((r) => r.holdRecords)) },
  { key: 'holdRecordsCleanTotal', valueCount: sum(ROWS.map((r) => r.holdRecordsClean)) },
  { key: 'holdRecordsCleanAtTierLengthTotal', valueCount: sum(ROWS.map((r) => r.holdRecordsCleanAtTierLength)) },
  { key: 'holdRecordsExtendedTotal', valueCount: sum(ROWS.map((r) => r.holdRecordsExtended)) },
  { key: 'holdRecordsSupersededTotal', valueCount: sum(ROWS.map((r) => r.holdRecordsSuperseded)) },
  { key: 'holdRecordsOpenAtWhistleTotal', valueCount: sum(ROWS.map((r) => r.holdRecordsOpenAtWhistle)) },
  { key: 'holdRecordsSpanningDeadBallTotal', valueCount: sum(ROWS.map((r) => r.holdRecordsSpanningDeadBall)) },
  { key: 'appliedTicksWalkedTotal', valueCount: totalTicksWalked },
  ...PC_CLASSES.map((k) => ({ key: `firings.${k}`, valueCount: firingsByClass[k] })),
  ...PC_CLASSES.map((k) => ({ key: `arms.${k}`, valueCount: armsByClass[k] })),
  // ⭐ the PERCENTILE faces, each backed by the STORED BINS (#297 corrections item 4)
  { key: 'holdTicksP50', valueCount: pctFromBins(pooledBins, 0.5) },
  { key: 'holdTicksP90', valueCount: pctFromBins(pooledBins, 0.9) },
] as const;

/* ========================================================================== */
/* §12 THE GATES                                                               */
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

/* ---- 2 ⭐⭐ gDormancy — THE HARD GATE ---- */
registerGate<{
  pooled: string; rows: number; league: string; skipped: boolean; complete: boolean;
  absentFalse: boolean[];
}>({
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

/* ---- 3 ⭐ gDiffScope — the src scope against the DISPATCH COMMIT ---- */
registerGate<{ touched: string[]; declared: readonly string[]; status: string }>({
  name: 'gDiffScope',
  fn: (i) => ({
    everyTouchedSrcFileIsDeclared: i.touched.every((f) => i.declared.includes(f)),
    theDeclaredScopeIsNotOverstated: i.declared.every((f) => i.touched.includes(f)),
    theWorkingTreeSrcIsCommitted: i.status === '',
  }),
  input: {
    touched: SRC_TOUCHED, declared: DECLARED_SRC_SCOPE,
    status: gitOut('git status --porcelain -- src'),
  },
  mutants: [
    { conjunct: 'everyTouchedSrcFileIsDeclared', name: 'an undeclared src file moved', mutate: (i) => ({ ...i, touched: [...i.touched, 'src/sim/mechanics.ts'] }) },
    { conjunct: 'theDeclaredScopeIsNotOverstated', name: 'a declared file did not actually move', mutate: (i) => ({ ...i, declared: [...i.declared, 'src/sim/Ball.ts'] }) },
    { conjunct: 'theWorkingTreeSrcIsCommitted', name: 'uncommitted src at result time', mutate: (i) => ({ ...i, status: ' M src/sim/Match.ts' }) },
  ],
});

/* ---- 4 gArms ---- */
registerGate<{ v7: number; l3: number; pc: number; total: number }>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkCarriesTheV7ArmLive: i.v7 === i.total,
    everyWalkCarriesTheL3DoseLive: i.l3 === i.total,
    everyWalkHasTheLatencyDoorOpen: i.pc === i.total,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: {
    v7: ROWS.filter((r) => r.armedVersion === V7).length,
    l3: ROWS.filter((r) => r.l3Version === V7).length,
    pc: ROWS.filter((r) => r.pcLive).length,
    total: ROWS.length,
  },
  mutants: [
    { conjunct: 'everyWalkCarriesTheV7ArmLive', name: 'a walk was not the v7 world', mutate: (i) => ({ ...i, v7: i.v7 - 1 }) },
    { conjunct: 'everyWalkCarriesTheL3DoseLive', name: 'the L3 dose was absent', mutate: (i) => ({ ...i, l3: i.l3 - 1 }) },
    { conjunct: 'everyWalkHasTheLatencyDoorOpen', name: 'the door was shut on a receipt walk', mutate: (i) => ({ ...i, pc: i.pc - 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, v7: 0, l3: 0, pc: 0, total: 0 }) },
  ],
});

/* ---- 5 gDose — ⭐ #289 canon: hash the FILE BYTES, re-derive the digest from them ---- */
registerGate<{ rederived: string; bytes: string; cells: number }>({
  name: 'gDose',
  fn: (i) => ({
    theDoseArtifactsOwnBytesRederiveTheShippedDigest: i.rederived === L3_T1_SHA,
    theBytesWereActuallyHashed: i.bytes.length === 64,
    theDoseHasBothArrivalGroups: i.cells === 2,
  }),
  input: { rederived: DOSE_REDERIVED_SHA, bytes: DOSE_FILE_BYTES_SHA, cells: DOSE.length },
  mutants: [
    { conjunct: 'theDoseArtifactsOwnBytesRederiveTheShippedDigest', name: 'the dose file drifted', mutate: (i) => ({ ...i, rederived: 'x'.repeat(64) }) },
    { conjunct: 'theBytesWereActuallyHashed', name: 'the bytes were never hashed', mutate: (i) => ({ ...i, bytes: '' }) },
    { conjunct: 'theDoseHasBothArrivalGroups', name: 'a one-group dose', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 6 gClock — APPLIED, not nominal (#280 form) ---- */
registerGate<{ dt: number; dur: number; simple: number; choice: number; ticksOk: boolean }>({
  name: 'gClock',
  fn: (i) => ({
    theShippedTickIsTheOneUsed: i.dt === DT,
    theShippedDurationIsTheOneWalked: i.dur === MATCH_DURATION,
    theSimpleTierIsTwelveAppliedTicks: i.simple === Math.round(PC_TIER_SIMPLE_SIM_S / DT)
      && i.simple === 12,
    theChoiceTierIsTwentySevenAppliedTicks: i.choice === Math.round(PC_TIER_CHOICE_SIM_S / DT)
      && i.choice === 27,
    everyWalkSteppedItsFullMatch: i.ticksOk,
  }),
  input: {
    dt: DT, dur: MATCH_DURATION, simple: PC_TIER_SIMPLE_TICKS, choice: PC_TIER_CHOICE_TICKS,
    ticksOk: ROWS.every((r) => r.ticks >= Math.round(MATCH_DURATION / DT)),
  },
  mutants: [
    { conjunct: 'theShippedTickIsTheOneUsed', name: 'a different tick', mutate: (i) => ({ ...i, dt: 1 / 30 }) },
    { conjunct: 'theShippedDurationIsTheOneWalked', name: 'a different duration', mutate: (i) => ({ ...i, dur: 1 }) },
    { conjunct: 'theSimpleTierIsTwelveAppliedTicks', name: 'the simple tier drifted', mutate: (i) => ({ ...i, simple: 13 }) },
    { conjunct: 'theChoiceTierIsTwentySevenAppliedTicks', name: 'the choice tier drifted', mutate: (i) => ({ ...i, choice: 28 }) },
    { conjunct: 'everyWalkSteppedItsFullMatch', name: 'a short walk', mutate: (i) => ({ ...i, ticksOk: false }) },
  ],
});

/* ---- 7 ⭐ gSeamMap — occurrence COUNTS, every site enumerated (#297 corrections item 1) ---- */
registerGate<{ counts: boolean; sites: boolean; rows: number; shas: Record<string, string> }>({
  name: 'gSeamMap',
  fn: (i) => ({
    everyNeedleHasExactlyItsExpectedOccurrenceCount: i.counts,
    everyOccurrenceIsEnumeratedAsASite: i.sites,
    theMapIsNonEmpty: i.rows >= 20,
    everySourceFileWasHashed: Object.values(i.shas).every((s) => s.length === 64)
      && Object.keys(i.shas).length >= 5,
  }),
  input: {
    counts: seamCountsMatch, sites: seamSitesEnumerated, rows: seamRows.length,
    shas: SRC_FILE_SHAS,
  },
  mutants: [
    { conjunct: 'everyNeedleHasExactlyItsExpectedOccurrenceCount', name: 'a needle count drifted', mutate: (i) => ({ ...i, counts: false }) },
    { conjunct: 'everyOccurrenceIsEnumeratedAsASite', name: 'an occurrence had no site', mutate: (i) => ({ ...i, sites: false }) },
    { conjunct: 'theMapIsNonEmpty', name: 'an empty map', mutate: (i) => ({ ...i, rows: 0 }) },
    { conjunct: 'everySourceFileWasHashed', name: 'a source file was not hashed', mutate: (i) => ({ ...i, shas: { ...i.shas, 'src/x.ts': '' } }) },
  ],
});

/* ---- 8 ⭐ gTriggers — every class fires; every arm found a stale plan ---- */
registerGate<{ zeroClasses: string[]; arms: number; withMem: number; exposures: number }>({
  name: 'gTriggers',
  fn: (i) => ({
    everyOneOfTheSevenClassesFired: i.zeroClasses.length === 0,
    armsAreNonVacuous: i.arms > 0,
    everyArmFrozeALiveStalePlan: i.arms === i.withMem,
    everyArmWroteExactlyOneExposure: i.arms === i.exposures,
  }),
  input: {
    zeroClasses: PC_CLASSES.filter((k) => firingsByClass[k] === 0),
    arms: armsSimple + armsChoice,
    withMem: sum(ROWS.map((r) => r.armedWithMemory)),
    exposures: sum(ROWS.map((r) => r.exposuresNoted)),
  },
  mutants: [
    { conjunct: 'everyOneOfTheSevenClassesFired', name: 'a class never fired', mutate: (i) => ({ ...i, zeroClasses: ['dribblePush'] }) },
    { conjunct: 'armsAreNonVacuous', name: 'nothing was ever armed', mutate: (i) => ({ ...i, arms: 0, withMem: 0, exposures: 0 }) },
    { conjunct: 'everyArmFrozeALiveStalePlan', name: 'an arm had no memory', mutate: (i) => ({ ...i, withMem: i.withMem - 1 }) },
    { conjunct: 'everyArmWroteExactlyOneExposure', name: 'an exposure went missing', mutate: (i) => ({ ...i, exposures: i.exposures - 1 }) },
  ],
});

/* ---- 9 ⭐⭐ gHoldLength — hold durations are EXACTLY the derived ticks ---- */
const holdRecordsTotal = sum(ROWS.map((r) => r.holdRecords));
const holdClean = sum(ROWS.map((r) => r.holdRecordsClean));
const holdCleanAtTier = sum(ROWS.map((r) => r.holdRecordsCleanAtTierLength));
registerGate<{
  clean: number; cleanAtTier: number; bins: number[]; binsSum: number; allDeclared: boolean;
  simple: number; choice: number;
}>({
  name: 'gHoldLength',
  fn: (i) => ({
    everyCLEANHoldRanItsOwnTiersLength: i.clean > 0 && i.clean === i.cleanAtTier,
    everyHoldsDECLAREDLengthIsItsTiersConstant: i.allDeclared,
    theOnlyCLEANLengthsAreTheTwoTierConstants: i.bins
      .every((v, k) => v === 0 || k === i.simple || k === i.choice),
    theBinsAccountForEveryCLEANRecord: i.binsSum === i.clean,
    bothTiersWereActuallyObserved: i.bins[i.simple] > 0 && i.bins[i.choice] > 0,
  }),
  input: {
    clean: holdClean, cleanAtTier: holdCleanAtTier, bins: pooledBins, binsSum: sum(pooledBins),
    allDeclared: ROWS.every((r) => r.holdTicksMatchTierConstant),
    simple: PC_TIER_SIMPLE_TICKS, choice: PC_TIER_CHOICE_TICKS,
  },
  mutants: [
    { conjunct: 'everyCLEANHoldRanItsOwnTiersLength', name: 'a clean hold ran a length no tier names', mutate: (i) => ({ ...i, cleanAtTier: i.cleanAtTier - 1 }) },
    { conjunct: 'everyHoldsDECLAREDLengthIsItsTiersConstant', name: 'a hold declared a non-tier length', mutate: (i) => ({ ...i, allDeclared: false }) },
    { conjunct: 'theOnlyCLEANLengthsAreTheTwoTierConstants', name: 'a sub-tier length appeared', mutate: (i) => ({ ...i, bins: i.bins.map((v, k) => (k === 5 ? v + 1 : v)) }) },
    { conjunct: 'theBinsAccountForEveryCLEANRecord', name: 'a record escaped the bins', mutate: (i) => ({ ...i, binsSum: i.binsSum + 1 }) },
    { conjunct: 'bothTiersWereActuallyObserved', name: 'a tier was never observed', mutate: (i) => ({ ...i, bins: i.bins.map((v, k) => (k === i.simple ? 0 : v)) }) },
  ],
});

/* ---- 10 ⭐⭐ gOwnExposure — the INDEPENDENT camera ---- */
registerGate<{ grew: number; inside: number; maxD: number }>({
  name: 'gOwnExposure',
  fn: (i) => ({
    everyBookGrowthCameFromABodyInsideHisRelevance: i.grew === i.inside,
    noGrowerStoodBeyondTheRelevanceRadius: i.maxD <= PC_RELEVANCE_M,
    theCameraSawSomething: i.grew > 0,
  }),
  input: {
    grew: camera.growthEvents, inside: camera.growthEventsInsideRelevance,
    maxD: camera.maxGrowerDistanceMetres,
  },
  mutants: [
    { conjunct: 'everyBookGrowthCameFromABodyInsideHisRelevance', name: 'a distant body gained coverage', mutate: (i) => ({ ...i, inside: i.inside - 1 }) },
    { conjunct: 'noGrowerStoodBeyondTheRelevanceRadius', name: 'a grower stood beyond the radius', mutate: (i) => ({ ...i, maxD: PC_RELEVANCE_M + 1 }) },
    { conjunct: 'theCameraSawSomething', name: 'the camera saw nothing', mutate: (i) => ({ ...i, grew: 0, inside: 0 }) },
  ],
});

/* ---- 11 gBooks — born absent, own exposures, no leak into the genome ---- */
const bookTotal = sum(ROWS.map((r) => r.bookExposures));
registerGate<{ books: number; exposures: number; cells: number; sens: number[]; nCover: number }>({
  name: 'gBooks',
  fn: (i) => ({
    theBooksHoldExactlyTheExposuresWritten: i.books === i.exposures,
    theKeySpaceIsTheRuledTwentyEight: i.cells === 28,
    theSensitivityBandIsHalfOneDouble: i.sens.length === 3
      && i.sens[0] === Math.floor(PC_N_COVER / 2) && i.sens[1] === PC_N_COVER
      && i.sens[2] === PC_N_COVER * 2,
    nCoverIsTheDerivedEighteen: i.nCover === Math.floor(184 / 10) && i.nCover === 18,
  }),
  input: {
    books: bookTotal, exposures: sum(ROWS.map((r) => r.exposuresNoted)),
    cells: PC_BOOK_CELLS.length, sens: [...PC_N_COVER_SENSITIVITY], nCover: PC_N_COVER,
  },
  mutants: [
    { conjunct: 'theBooksHoldExactlyTheExposuresWritten', name: 'the books and the ledger disagree', mutate: (i) => ({ ...i, books: i.books - 1 }) },
    { conjunct: 'theKeySpaceIsTheRuledTwentyEight', name: 'the key space drifted', mutate: (i) => ({ ...i, cells: 27 }) },
    { conjunct: 'theSensitivityBandIsHalfOneDouble', name: 'the sensitivity band drifted', mutate: (i) => ({ ...i, sens: [1, 2, 3] }) },
    { conjunct: 'nCoverIsTheDerivedEighteen', name: 'N_cover drifted', mutate: (i) => ({ ...i, nCover: 19 }) },
  ],
});

/* ---- 12 gSeeds — booked = walked ---- */
const walkedSeeds = [...new Set([
  ...RECEIPT_SEEDS, ...SMOKE_SEEDS, CAMERA_SEED, ...IDENTITY_SEEDS,
])].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK[0] && s <= BLOCK[1];
registerGate<{ walked: number[]; retiredHit: number; preflightHit: number }>({
  name: 'gSeeds',
  fn: (i) => ({
    everyWalkedSeedIsBookedOrADisclosedIdentitySeed: i.walked.length > 0
      && i.walked.every((s) => inBlock(s) || WORLD_IDENTITY_SEEDS.includes(s)),
    theRetiredBlockIsNeverTouched: i.retiredHit === 0,
    thePreflightBandIsDisjointFromEveryWalkedSeed: i.preflightHit === 0,
  }),
  input: {
    walked: walkedSeeds,
    retiredHit: walkedSeeds.filter((s) => s >= RETIRED_BLOCK[0] && s <= RETIRED_BLOCK[1]).length,
    preflightHit: walkedSeeds.filter((s) => s >= PREFLIGHT_BAND[0] && s <= PREFLIGHT_BAND[1]).length,
  },
  mutants: [
    { conjunct: 'everyWalkedSeedIsBookedOrADisclosedIdentitySeed', name: 'an unbooked seed was walked', mutate: (i) => ({ ...i, walked: [...i.walked, 1] }) },
    { conjunct: 'theRetiredBlockIsNeverTouched', name: 'the retired block was walked', mutate: (i) => ({ ...i, retiredHit: 1 }) },
    { conjunct: 'thePreflightBandIsDisjointFromEveryWalkedSeed', name: 'a preflight seed was walked', mutate: (i) => ({ ...i, preflightHit: 1 }) },
  ],
});

/* ---- 13 gEnvelope — #289 item 1, BY NAME ---- */
const FORBIDDEN_BODY_KEYS = ['generatedAt', 'head', 'outPath', 'mode', 'preflight',
  'preflightReasons', 'wallMs', 'envelope'] as const;
const envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[] };
registerGate<typeof envelopeInput>({
  name: 'gEnvelope',
  fn: (i) => ({
    aDifferentEnvelopeYieldsTheIdenticalDigest: i.crossOutIdentical,
    theDiskCopyRederivesItsOwnDigest: i.rederivesFromDisk,
    noInvocationFactSitsInsideTheHashedBody: i.forbidden.length === 0,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'aDifferentEnvelopeYieldsTheIdenticalDigest', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'theDiskCopyRederivesItsOwnDigest', name: 'the disk copy did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'noInvocationFactSitsInsideTheHashedBody', name: 'an invocation fact in the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- 14 gFaces — #287 item 1 + #297 corrections item 4 ---- */
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

/* ---- 15 gMutants — the machine-derived liveness map (#268.3(a)) ---- */
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
/* §13 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                      */
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
  banner('PC-T0 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §14 THE ARTIFACT                                                            */
/* ========================================================================== */
/** The published field order of every `perSeedCells[].counters` array (#282 item 2(ii)). */
const COUNTER_FIELD_ORDER = ['ticks', 'armsSimple', 'armsChoice', 'overlapRestarts',
  'overlapNoExtend', 'heldExecutorTicks', 'decisionsHeld', 'exposuresNoted', 'armedWithMemory',
  'preProcessedSkips', 'heldThroughReassignment', 'bookExposures', 'holdRecords',
  'holdRecordsClean', 'holdRecordsCleanAtTierLength', 'holdRecordsExtended',
  'holdRecordsSuperseded', 'holdRecordsOpenAtWhistle', 'holdRecordsSpanningDeadBall'] as const;
const cellOf = (r: ReceiptRow): Record<string, unknown> => ({
  seed: r.seed,
  counters: [r.ticks, r.armedByTier.simple, r.armedByTier.choice, r.overlapRestarts,
    r.overlapNoExtend, r.heldExecutorTicks, r.decisionsHeld, r.exposuresNoted, r.armedWithMemory,
    r.preProcessedSkips, r.heldThroughReassignment, r.bookExposures, r.holdRecords,
    r.holdRecordsClean, r.holdRecordsCleanAtTierLength, r.holdRecordsExtended,
    r.holdRecordsSuperseded, r.holdRecordsOpenAtWhistle, r.holdRecordsSpanningDeadBall],
  firings: PC_CLASSES.map((k) => r.firings[k]),
  arms: PC_CLASSES.map((k) => r.armedByClass[k]),
  holdTickBins: r.holdTickBins,
  coveredCellsAtN: r.coveredCellsAtN,
  goals: r.goals, shots: r.shots, passes: r.passes,
});
const CF = Object.fromEntries(COUNTER_FIELD_ORDER.map((k, i) => [k, i])) as Record<string, number>;

/** ⭐ #287 item 1: re-derive EVERY published face by parsing the SERIALIZED artifact. */
const rederiveFromDisk = (p: string): { checked: number; bad: string[]; parsed: boolean } => {
  let file: Record<string, unknown>;
  try { file = readJson(p); } catch { return { checked: 0, bad: ['PARSE'], parsed: false }; }
  const cells = file.perSeedCells as Record<string, unknown>[] | undefined;
  const faces = file.faces as { key: string; valueCount: number }[] | undefined;
  if (cells === undefined || faces === undefined) return { checked: 0, bad: ['SHAPE'], parsed: false };
  const col = (i: number): number => cells.reduce((a, c) => a + (c.counters as number[])[i], 0);
  const clsCol = (field: 'firings' | 'arms', k: number): number =>
    cells.reduce((a, c) => a + (c[field] as number[])[k], 0);
  const bins = Array.from({ length: 48 }, (_, i) =>
    cells.reduce((a, c) => a + (c.holdTickBins as number[])[i], 0));
  const want: Record<string, number> = {
    firingsTotal: PC_CLASSES.reduce((a, _k, i) => a + clsCol('firings', i), 0),
    armsTotal: col(CF.armsSimple) + col(CF.armsChoice),
    armsSimpleTier: col(CF.armsSimple),
    armsChoiceTier: col(CF.armsChoice),
    heldExecutorTicksTotal: col(CF.heldExecutorTicks),
    decisionsHeldTotal: col(CF.decisionsHeld),
    exposuresNotedTotal: col(CF.exposuresNoted),
    overlapRestartsTotal: col(CF.overlapRestarts),
    overlapNoExtendTotal: col(CF.overlapNoExtend),
    preProcessedSkipsTotal: col(CF.preProcessedSkips),
    heldThroughReassignmentTotal: col(CF.heldThroughReassignment),
    holdRecordsTotal: col(CF.holdRecords),
    holdRecordsCleanTotal: col(CF.holdRecordsClean),
    holdRecordsCleanAtTierLengthTotal: col(CF.holdRecordsCleanAtTierLength),
    holdRecordsExtendedTotal: col(CF.holdRecordsExtended),
    holdRecordsSupersededTotal: col(CF.holdRecordsSuperseded),
    holdRecordsOpenAtWhistleTotal: col(CF.holdRecordsOpenAtWhistle),
    holdRecordsSpanningDeadBallTotal: col(CF.holdRecordsSpanningDeadBall),
    appliedTicksWalkedTotal: col(CF.ticks),
    holdTicksP50: pctFromBins(bins, 0.5),
    holdTicksP90: pctFromBins(bins, 0.9),
  };
  PC_CLASSES.forEach((k, i) => {
    want[`firings.${k}`] = clsCol('firings', i);
    want[`arms.${k}`] = clsCol('arms', i);
  });
  const bad: string[] = [];
  let checked = 0;
  for (const f of faces) {
    checked++;
    if (!(f.key in want)) { bad.push(`${f.key}:UNCOVERED`); continue; }
    if (want[f.key] !== f.valueCount) bad.push(`${f.key}:${f.valueCount}≠${want[f.key]}`);
  }
  return { checked, bad, parsed: true };
};

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PC-T0 — THE DORMANT REACTION-LATENCY SEAM (unit receipts)',
  doc: 'docs/world-model/PC-T0-LATENCY-SEAM.md',
  contract: 'docs/world-model/PC-PERCEPTION-CONTRACT.md §2 (M-PC.1–5), design fixed by '
    + 'ruling #297 items 3–5, dispatched #297 item 7',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'Does the dormant latency seam (a) leave the flags-off world BYTE-IDENTICAL, and '
      + '(b) do exactly what #297 items 3–5 say when armed? RECEIPTS ONLY — nothing is scored.',
    clockConvention: '⭐ every duration here is APPLIED TICKS on the SIM clock unless the field '
      + 'name ends `SimSeconds` or `Metres` (#294 item 3 / #295 item 4: a field carries the unit '
      + 'its name claims).',
    tiers: {
      simpleTierSimSeconds: PC_TIER_SIMPLE_SIM_S,
      simpleTierAppliedTicks: PC_TIER_SIMPLE_TICKS,
      choiceTierSimSeconds: PC_TIER_CHOICE_SIM_S,
      choiceTierAppliedTicks: PC_TIER_CHOICE_TICKS,
      derivation: '⭐⭐ DERIVED TWICE OVER (#297 item 3): the psychology literature\'s two '
        + 'constants (#272 §0) AND the SHIPPED markAnchor band `0.45 − defending·0.25` ∈ '
        + '[0.20, 0.45] sim-s, which arrived by a wholly independent route.',
    },
    nCover: {
      value: PC_N_COVER,
      derivation: 'ANCHOR = the L3 τ yardstick, 184 labels (L3-T1, the programme\'s only '
        + 'measured book-sufficiency figure). DISCOUNT = the census\'s own stated bound '
        + '(PC-C0 §DOUBTS 4): an ORDERING book needs two rates to separate; a COVERAGE book is '
        + 'a count with no comparison, and "plausibly needs an order of magnitude less". '
        + '⇒ floor(184/10) = 18. SENSITIVITY-CHECKED at the exam (#297 item 4 H1).',
      sensitivityBand: [...PC_N_COVER_SENSITIVITY],
    },
    recognitionKey: 'class × pressed × relation (#297 item 4 H1) — engine-written context bits '
      + 'only, zero information cost. `pressed` = an opponent of the initiator inside '
      + `TOUCH_CONTROL_DIST = ${TOUCH_CONTROL_DIST} m of the ball at the event tick (PC-C0's own `
      + 'split). Cells = 7 × 2 × 2 = 28.',
    classOrder: [...PC_CLASSES],
    classOrderRuling: '#297 item 5 — the census picks, the commander signs; turnover '
      + 'FIRST-CLASS. When several classes fire on one tick for one body, the earliest here wins.',
    initiatorPays: { ...PC_INITIATOR_PAYS },
    overlapRule: '⭐⭐ MONOTONE RESTART, pinned: a new surprise during a live hold restarts the '
      + 'timer at the NEW event\'s tier and the expiry NEVER moves earlier '
      + '(`untilTick = max(oldUntil, nowTick + 1 + ticks)`). The stale plan is NOT re-captured — '
      + 'he has reacted to nothing yet. Deterministic, and it cannot be shortened by a second '
      + 'surprise.',
    additivity: '⭐ #297 item 5 BINDING: the seam ADDS to the world\'s own ≈6.54-tick decide '
      + 'cadence rather than replacing it — `decisionTimer` is never written by this seam and '
      + 'never re-armed while a body is held, so PC-T1/T2 can measure added-lag = armed − base '
      + 'at event grain. The world\'s own cadence is NOT the seam\'s credit.',
    relevanceRadiusMetres: PC_RELEVANCE_M,
  },

  /* ---- (1) DORMANCY ---- */
  dormancy: {
    method: '10 bare + 10 v7-armed matches, ball state + all 12 bodies sampled every 37th tick, '
      + 'pooled into ONE digest; plus the repo\'s own league fingerprint. ⚠ the identity seeds '
      + 'belong to the CONSUMED PW-T0b block and are re-walked for the comparison only.',
    seeds: [...IDENTITY_SEEDS],
    pooled: IDENTITY_POOLED,
    pooledAtCleanHead: WORLD_IDENTITY_POOLED_AT_HEAD,
    identical: IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD,
    completeBaseline: IDENTITY_COMPLETE,
    leagueFingerprint: LEAGUE_FP,
    leagueFingerprintAtCleanHead: LEAGUE_FINGERPRINT_AT_HEAD,
    leagueFingerprintSeed: LEAGUE_FINGERPRINT_SEED,
    leagueFingerprintSeasons: LEAGUE_FINGERPRINT_SEASONS,
    flagAbsentEqualsFlagFalse: absentEqualsFalse,
  },

  /* ---- THE SRC SCOPE ---- */
  srcScope: {
    dispatchCommit: DISPATCH_COMMIT,
    declared: DECLARED_SRC_SCOPE,
    touchedSinceDispatch: SRC_TOUCHED,
    srcFileSha256: SRC_FILE_SHAS,
  },

  /* ---- (5) THE SEAM MAP ---- */
  seamMap: {
    method: 'each needle is searched in the SHIPPED bytes at run time; ⭐ #297 corrections item '
      + '1: the OCCURRENCE COUNT is pinned and EVERY occurrence\'s site is enumerated — one '
      + 'needle with one site is a lie of omission.',
    rows: seamRows,
    countsMatch: seamCountsMatch,
    sitesEnumerated: seamSitesEnumerated,
  },

  /* ---- (2)(3) THE TRIGGER + HOLD RECEIPTS ---- */
  triggers: {
    firingsByClass,
    armsByClass,
    armsSimpleTier: armsSimple,
    armsChoiceTier: armsChoice,
    note: '⭐ EVERY arm in this battery is CHOICE tier — the books are born absent and one '
      + 'match cannot fill an 18-exposure cell for most bodies. That is M-PC.3 working, not a '
      + 'defect: the SIMPLE tier is what PC-T1 has to EARN across a season.',
  },
  holds: {
    recordsTotal: holdRecordsTotal,
    recordsClean: holdClean,
    recordsCleanAtTierLength: holdCleanAtTier,
    recordsExtendedByOverlap: sum(ROWS.map((r) => r.holdRecordsExtended)),
    recordsSupersededByARearm: sum(ROWS.map((r) => r.holdRecordsSuperseded)),
    recordsOpenAtWhistle: sum(ROWS.map((r) => r.holdRecordsOpenAtWhistle)),
    recordsSpanningDeadBall: sum(ROWS.map((r) => r.holdRecordsSpanningDeadBall)),
    cleanDefinition: '⭐ a CLEAN record ran out on its own: not replaced by a fresh arm, not '
      + 'extended by an overlap, not cut off by the whistle, and not straddling a dead-ball '
      + 'pause. The bins below are CLEAN records only, and the other FOUR populations are '
      + 'counted beside them rather than dropped.',
    deadBallDisclosure: '⚠ OF RECORD, and a named DOUBT: the latency clock is `simTick`, which '
      + 'keeps advancing during `kickoff` / `goalPause` / `halftime` even though `step` returns '
      + 'before the decide and execute loops. A hold armed just before such a pause therefore '
      + 'expires without the body paying those ticks — the world\'s own `decisionTimer` freezes '
      + 'across the same pauses (Player.update is skipped too), so the two clocks disagree there. '
      + 'Small (see `recordsSpanningDeadBall` against `recordsTotal`) and disclosed, not hidden.',
    holdTickBinsPooled: pooledBins,
    holdTicksP50: pctFromBins(pooledBins, 0.5),
    holdTicksP90: pctFromBins(pooledBins, 0.9),
    binsNote: '⭐ #297 corrections item 4: the percentiles above are derived from the STORED '
      + 'bins, which are published per seed, so gFaces can re-derive them off disk.',
  },

  /* ---- (4) THE OWN-EXPOSURE CAMERA ---- */
  ownExposureCamera: camera,

  /* ---- (6) THE ARMED SMOKE SHAPE ---- */
  armedSmokeShape: {
    note: '⭐ A RECEIPT, NEVER THE EXAM (#289 item 1): these are shape numbers proving an armed '
      + 'world still plays football and the seam fires in it. No baseline is paired, no CI is '
      + 'drawn, and NOTHING here is an effect size.',
    rows: smokeRows,
  },

  faces: FACES,
  run: {
    receiptSeeds: RECEIPT_SEEDS,
    walks: ROWS.length,
    appliedTicksWalked: totalTicksWalked,
    walkMs: WALK_MS, identityMs: IDENTITY_MS, cameraMs: CAMERA_MS, smokeMs: SMOKE_MS,
  },
  dose: {
    source: `${T1_PATH} · poolT1DoseCells`,
    fileBytesSha256: DOSE_FILE_BYTES_SHA, rederivedBodySha256: DOSE_REDERIVED_SHA,
    shippedConstant: L3_T1_SHA,
  },
  perSeedCells: ROWS.map(cellOf),
  perSeedCellsCounterFieldOrder: COUNTER_FIELD_ORDER,
  perSeedCellsClassFieldOrder: [...PC_CLASSES],
  seeds: {
    block: BLOCK, walked: walkedSeeds,
    smoke: SMOKE_SEEDS, receipts: RECEIPT_SEEDS, camera: CAMERA_SEED,
    pinSuite: PIN_SUITE_SEEDS,
    identityDisclosedForeign: IDENTITY_SEEDS,
    preflightBandDeclaredDisjoint: PREFLIGHT_BAND,
    retiredBlockNeverTouched: RETIRED_BLOCK,
  },
  stats: {
    floorFromRuling: STATS_FLOOR_FROM_RULING, draws: STATS_DRAWS,
    note: '⭐ NO CI IS DRAWN IN THIS SLICE — it is a build slice. The stats stream is '
      + 'UNCONSUMED and the floor stands.',
  },
  gDetDigests: { runA: digestA, runB: digestB },
  gates, mutants, coverage: COVERAGE_MAP, conjunctTotal: CONJUNCT_TOTAL, uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ RECEIPTS ONLY. Nothing here scores H-PC.1 or H-PC.2; no baseline is paired; no CI is '
      + 'drawn; no number here is an effect size (#289 item 1).',
    'The armed smoke shape is a LIVENESS receipt. A goal count from an armed world with no '
      + 'paired control says nothing about the seam\'s effect and is not offered as saying it.',
    'The class predicates are PC-C0\'s, reused verbatim; they are STATE-TRANSITION detectors '
      + 'over public state, not engine callbacks, so they can under- or over-count at the margin '
      + 'exactly as the census disclosed.',
    'N_cover = 18 is a DERIVED STRUCTURE, not a measured threshold. #297 item 4 H1 requires the '
      + 'exam to report tier-transition curves at 9 · 18 · 36; the hooks are built here, the '
      + 'curves are PC-T1\'s.',
    'The own-exposure camera proves the RELEVANCE bound (nobody distant gains). It does not '
      + 'independently re-derive WHICH class a body was exposed to — the detector is the only '
      + 'implementation of the predicates in the tree.',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, mode: MODE, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256; delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pc-t0-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body, resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD', mode: 'ANOTHER-MODE',
      preflight: !IS_PREFLIGHT, preflightReasons: ['ANOTHER-REASON'],
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest, reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
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
banner(`\n  [pc-t0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pc-t0] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
if (disk.bad.length > 0) banner(`  [pc-t0] BAD FACES: ${disk.bad.join(', ')}`);
banner(`  [pc-t0] dormancy ${IDENTITY_POOLED === WORLD_IDENTITY_POOLED_AT_HEAD ? 'IDENTICAL' : 'MOVED'}`
  + ` · league fp ${LEAGUE_FP === LEAGUE_FINGERPRINT_AT_HEAD ? 'unmoved' : LEAGUE_FP}`);
for (const k of PC_CLASSES) {
  banner(`  [pc-t0] ${k.padEnd(15)} fired=${String(firingsByClass[k]).padStart(6)} `
    + `armed=${String(armsByClass[k]).padStart(7)}`);
}
banner(`  [pc-t0] holds ${holdRecordsTotal} · clean ${holdClean}/${holdCleanAtTier} at-tier · p50 `
  + `${pctFromBins(pooledBins, 0.5)}t p90 ${pctFromBins(pooledBins, 0.9)}t · camera `
  + `${camera.growthEventsInsideRelevance}/${camera.growthEvents} inside ${PC_RELEVANCE_M} m`);
banner(`  [pc-t0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
