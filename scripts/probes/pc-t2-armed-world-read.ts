/**
 * ⭐⭐ PC-T2 — THE ARMED-WORLD READ (docs/world-model/PC-T2-ARMED-WORLD-READ.md).
 *
 * Authorized by ruling #299 item 6 for EXACTLY this stage — INSTRUMENT-ONLY (ZERO src edits;
 * the seam is banked by PC-T0 and the pre-exam amendment by PC-T1). H-PC.1 is SCORED here
 * (PC-PERCEPTION-CONTRACT.md §1); every H-PC.2 face is REPORTED and no gate reads one.
 *
 * ⭐ THE BRIEF'S OWN CITATIONS, VERIFIED AS THE FIRST ACT, EACH QUOTED VERBATIM BESIDE ITS
 *   ACTUAL HOME (PC-T1 §COMMANDER CORRECTIONS item 1: "a canon quote cites the sentence's
 *   ACTUAL HOME (doc + section); stage-doc §CORRECTIONS sections are part of the canon corpus
 *   and are cited as themselves"):
 *     · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the
 *       schema never enters the body; forbidden-name lists are retired"
 *          HOME: PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1.  VERIFIED (grep).
 *     · "a max−min face reports a noise-floor comparison, not a zero-null CI"
 *          HOME: PC-T1-LEARNING-EXAM.md §COMMANDER CORRECTIONS item 3.  VERIFIED (grep).
 *     · "the re-derivation gate covers EVERY published face; a percentile face requires
 *       stored bins"
 *          HOME: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4.  VERIFIED (grep).
 *     · "a field carries the unit its name claims"
 *          HOME: PROGRAMME-RULINGS.md #294 item 3 (CORRECTIONS).  VERIFIED (grep).
 *     · "verifier scratch = the stage's consumed band or ≥ 900,000,000, never the next virgin
 *       block"                    HOME: PROGRAMME-RULINGS.md #294 item 3.  VERIFIED (grep).
 *     · "arming receipts, not football findings"
 *          HOME: PROGRAMME-RULINGS.md #289 item 1.  VERIFIED (grep).
 *     · "worker-simmed fixtures play the SHIPPED world (League.toJSON omits matchFlags)"
 *          HOME: PROGRAMME-RULINGS.md #283.2(iv).  VERIFIED (grep).
 *     · xSrcUntouched's corrected form (`git diff --stat HEAD -- src` AND
 *       `git status --porcelain -- src`)
 *          HOME: BU-C0-RECEPTION-OPTION-CENSUS.md §COMMANDER CORRECTIONS item 5 / #286 item 1.
 *     · "the armed-arm terminal census is ENTANGLED with the L3 veto's own mechanism"
 *          HOME: BU-C0-RECEPTION-OPTION-CENSUS.md §COMMANDER CORRECTIONS item 3.
 *     · the carrier-anchored t0: "any CB exam consuming a separation baseline MUST re-measure
 *       with a carrier-anchored t0"
 *          HOME: CB-C0-DISPOSSESSION-CENSUS.md §RATIFIED (#266.2(i)) inline marker.
 *
 * ORDER OF PROOF (binding, #299 item 6):
 *   1. ⭐⭐ FIRST — the M-BU.2-form lifecycle/doors proof at the CB+L3+PC composition: the FULL
 *      2^6 power set (C · T · S · L · V · ⭐P) × seeds on the a4MatchFlags substrate (CALLED,
 *      never copied), the byte-inertness of every door without its partner, the PC seat's own
 *      SILENCE law (door shut ⇒ `m.pcLatency === null`, no ledger, no hold, no book), and the
 *      CB arming-lifecycle receipts riding along. A defect ⇒ exit 4, nothing is written.
 *   2. DORMANCY / ZERO-SRC: `xSrcUntouched` in the #286.1-CORRECTED form.
 *   3. The freeze commit, then the battery. The battery never changes the design.
 *
 * ⭐ #283.2(iv): every match is constructed DIRECTLY with its `matchFlags`, and the arming is
 *    ASSERTED LIVE on the very match the walk measures.
 * ⭐ #287.1 / PC-C0 §CORRECTIONS 4: `gFaces` PARSES THE SERIALIZED ARTIFACT off disk and
 *    re-derives every published face; percentile faces read STORED BINS.
 * ⭐ #294 item 3: every artifact field carries the unit its name claims — and this stage GATES
 *    the naming rule (`gUnits`), the gap PC-T1 §CORRECTIONS 4 named.
 * ⭐ #289 item 1: plumbing receipts are NEVER effect sizes; data-source guards hash FILE BYTES.
 * ⭐ #288: every face carries |Δ| ÷ its own half-width, applied by machine.
 * ⭐ #270: nothing is written to `info.genome`.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: PCT2_MODE (smoke|full, REQUIRED) · PCT2_N · PCT2_OUT.
 *   ANY other `PCT2_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: PCT2_MODE=full npx tsx scripts/probes/pc-t2-armed-world-read.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal ·
 *       4 = the arming-lifecycle / doors class BIT at this composition.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  CONTEST_RADIUS, DT, MATCH_DURATION, TOUCH_CONTROL_DIST,
  TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
} from '../../src/sim/constants';
import { beatsDefender, touchRaceWindow, type CbBody } from '../../src/sim/carryBeat';
import { L3_DEFENCE_WINDOW_S } from '../../src/ai/defenceBook';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells,
  setCbProneness, CB_WORLD_DOSE, L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
} from '../../src/game/a4World';
import {
  PC_BOOK_CELLS, PC_CLASSES, PC_N_COVER, PC_N_COVER_SENSITIVITY, PC_RELEVANCE_M,
  PC_TIER_CHOICE_TICKS, PC_TIER_SIMPLE_TICKS, PcRecognitionBook,
  type PcTier,
} from '../../src/ai/pcLatency';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PCT2_MODE', 'PCT2_N', 'PCT2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PCT2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('PC-T2 FATAL — refused env surface. '
    + `rogue PCT2_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PCT2_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`PC-T2 FATAL — PCT2_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.PCT2_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PCT2_N, 10)) : null;
const OUT_ENV = process.env.PCT2_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PCT2_N'] : []),
  ...(OUT_ENV !== undefined ? ['PCT2_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pc-t2-armed-world-read-smoke.json',
  full: 'docs/world-model/data/pc-t2-armed-world-read.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pc-t2-override.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner('PC-T2 FATAL — an OVERRIDE invocation may not write a canonical repo path '
    + `(the canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
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
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] =>
  Array.from({ length: a }, () => zeros(b));
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const dist = (a: Readonly<V2>, b: Readonly<V2>): number => Math.hypot(a.x - b.x, a.y - b.y);
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 TRACED CONSTANTS — imported, or EXTRACTED from src/** at run time (#200)  */
/* ========================================================================== */
const CONST_SRC_PATH = 'src/sim/constants.ts';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const BRAIN_SRC_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_SRC_PATH = 'src/ai/actionExecutor.ts';
const PC_SRC_PATH = 'src/ai/pcLatency.ts';
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_SRC_PATH, 'utf8');
const EXEC_SRC = readFileSync(EXEC_SRC_PATH, 'utf8');
const PC_SRC = readFileSync(PC_SRC_PATH, 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
const countOf = (src: string, re: RegExp): number => (src.match(re) ?? []).length;
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
/** ⭐ THE PRESSURE RADIUS — #173 / Q14's own "under pressure" switch, the engine's constant. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_LINE = lineOf(CONST_SRC, /export const TOUCH_CONTROL_DIST = [\d.]+;/);
/** ⭐⭐ Q07'S OWN ±2 m BAND, EXTRACTED FROM THE ENGINE'S OWN FORWARD-PASS LINE — never typed. */
const FORWARD_BAND_M = extractNum(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > (\d+(?:\.\d+)?)\)/);
const FORWARD_BAND_LINE = lineOf(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > \d/);
/** the DISPLAY clock, read out of the engine's own `Match.minute()` expression. */
const DISPLAY_MINUTES = extractNum(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)\)/);
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;
/** #173's own foul-attribution lookahead, inherited with the spell walker. */
const FOUL_LOOKAHEAD_TICKS = 6;
/** the pressed-carrier sampling cadence (declared; 12 ticks = 0.2 sim-s). */
const CARRIER_SAMPLE_TICKS = 12;
/** the behind-ball option histogram's top bucket (k >= this is pooled into the last cell). */
const HIST_MAX = 5;
/**
 * ⭐⭐ THE Δsep WINDOW — the APPLIED window LAW OF RECORD, #280.2(iii), re-derived here from
 * the ENGINE'S OWN `L3_DEFENCE_WINDOW_S` (defenceBook.ts) rather than typed: 54 applied ticks
 * = 0.9000 s. The same window both arms are measured over, so the contrast is commensurable.
 */
const SEP_WINDOW_TICKS = Math.ceil(L3_DEFENCE_WINDOW_S / DT);
/** the SECONDARY Δsep window: the CHOICE tier's own length — "the time the tier itself buys". */
const SEP_WINDOW_TIER_TICKS = PC_TIER_CHOICE_TICKS;

/** ⭐ THE ARMING-LIFECYCLE SITES, TRACED to `src/**` at run time (never asserted from memory). */
const ARM_SITE_LINE = lineOf(BRAIN_SRC, /match\.armTouchPast\(p, knockDir!, knockBack\);/);
const CLEAR_SITE_LINE = lineOf(BRAIN_SRC, /else match\.clearTouchPastArming\(p\);/);
const FIRE_SITE_LINE = lineOf(MATCH_SRC, /mech\.performTouchPast\(this, o, aim\);/);
/** ⭐⭐ THE PC SEAM'S OWN LINES, traced: the ONE seat fork, the ONE detector, the ONE gate. */
const PC_SEAT_FORK_LINE = lineOf(MATCH_SRC, /this\.pcLatency = this\.pcReactionLatency/);
const PC_DETECTOR_LINE = lineOf(MATCH_SRC, /private pcLatencyObserve\(\): void \{/);
const PC_DECIDE_GATE_LINE = lineOf(MATCH_SRC, /const pcHeld = p\.decisionTimer <= 0/);

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const PC_C0_PATH = 'docs/world-model/data/pc-c0-reaction-baseline.json';
/** ⭐ #289 CANON: a data-source guard hashes FILE BYTES, not a field of the parsed object. */
const L3_T1_FILE_BYTES_SHA =
  'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_T1_FILE_BYTES_SHA =
  '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const PC_C0_FILE_BYTES_SHA =
  'f17120a5a86f0a4852a6a3298bd70d07d88ddcf84b66e32d74b6ce938657dacc';
/** the COMMITTED body digests of the two PC artifacts (their own `resultSha256`). */
const PC_T1_RESULT_SHA =
  'd9f323c7528d7de9d27205d49147c463ce7ecb07587926c773ad92f4a0bc2824';
const PC_C0_RESULT_SHA =
  '1620396b37cab425d28c12e3b33036f2c568673c00be4e6eabf9f4a080c18e6f';

const BOOTSTRAP = 2000;
/** ⭐ #299 item 5: "next stats ≥ 113,600" — the 200-lattice point clearing 113,204. */
const STATS_BASE = 113_600;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600, 111_800,
  112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200,
];

/** ⭐ #299 item 5: PC-T2 BOOKS FROM 12,499,000 (ceiling 12,499,999). */
const BLOCK: readonly [number, number] = [12_499_000, 12_499_999];
const BATTERY_BASE = 12_499_000;
const N_FROZEN = 200;
/** the FIXTURE-GRAIN SUPPLY TRAJECTORY block (the PC-T1 §DOUBTS 2 named gap). */
const TRAJ_BASE = 12_499_300;
const TRAJ_BOOKS_FULL = 8;
const FIXTURES_PER_SEASON = 7;
/** the smoke sub-block, its own artifact, scoring nothing. */
const SMOKE_BASE = 12_499_600;
/** ⭐ the ARMING-LIFECYCLE / DOORS-MATRIX block — its own seeds, walked BEFORE the battery. */
const LIFECYCLE_BASE = 12_499_500;
const LIFECYCLE_SEEDS_FULL = 3;
/** the world-identity construction seed (constructed, stepped only for the arm separation). */
const GWORLD_SEED = 12_499_900;
/** every override routes here. */
const GUARD_BASE = 12_499_920;
const GUARD_SPAN = 20;
/** how many paired seeds the NON-PERTURBATION control re-walks WITHOUT the instruments. */
const PERTURB_CHECK_SEEDS = 25;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'the pre-BU programme bands (#65 … #283)', range: [8_500_000, 12_485_999] },
  { name: 'BU-C0 reception-option census (#285.2/#286)', range: [12_486_000, 12_486_999] },
  { name: 'BU-T0 DV-in-v7 composition (#286.5/#287.5)', range: [12_487_000, 12_487_999] },
  { name: 'BU-T0b price separation (#287.6/#288.6)', range: [12_488_000, 12_488_999] },
  { name: 'BU-T1 MT composition (#288.7/#289)', range: [12_489_000, 12_489_999] },
  { name: 'PW-C0 weight-physics census (#290.3/#291)', range: [12_490_000, 12_490_999] },
  { name: 'PW-T0a preference census (#291.6/#292)', range: [12_491_000, 12_491_999] },
  { name: 'PW-T0b weight chooser (#292.4/#293)', range: [12_492_000, 12_492_999] },
  { name: 'PW-T0c amendment receipts (#293.3/#294)', range: [12_493_000, 12_493_999] },
  { name: '⭐ RETIRED AS TAINTED — the PW-T0c verifier\'s walks (#294 item 4)',
    range: [12_494_000, 12_494_999] },
  { name: 'PW-T1 composition exam (#294 item 5/#295)', range: [12_495_000, 12_495_999] },
  { name: 'the #295-era bands', range: [12_496_000, 12_496_999] },
  { name: 'PC-T0 latency seam (#297 item 6/#298 item 5)', range: [12_497_000, 12_497_999] },
  { name: 'PC-T1 learning exam (#298 item 6/#299 item 5)', range: [12_498_000, 12_498_999] },
];

/* ========================================================================== */
/* §4 THE DOSES — from COMMITTED artifacts, read at RUN TIME, never typed       */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ THE L3 MATURED DOSE — the SHIPPED entry's own pooled cells (`poolT1DoseCells`). */
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_FILE = JSON.parse(L3_BYTES) as Record<string, unknown>;
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(L3_FILE);
const L3_DOSE_LABELS = sum(L3_DOSE.map((c) => c.lunges));

/** the PC-C0 census bytes — read ONLY to re-derive its committed digest (`gSources`). */
const C0_BYTES = readFileSync(PC_C0_PATH, 'utf8');
const C0_BYTES_SHA = sha(C0_BYTES);
const C0_FILE = JSON.parse(C0_BYTES) as Record<string, unknown>;

/**
 * ⭐⭐ THE PC MATURED DOSE — THE L3-T2 ARM-C IDIOM, applied to the recognition book.
 *
 * L3-T2 dosed arm C with "L3-T1's committed final-book cells … read from the artifact AT RUN
 * TIME, never typed … written THROUGH the book's own public `note()` — the only way a cell
 * moves in the shipped seam". This stage does the same thing one contract over.
 *
 * PC-T1 committed `perBookCells[b].armsByBodyCell[body][cell]` — arms per body-slot per cell,
 * POOLED over that book's whole career (SEASONS × FIXTURES_PER_SEASON fixtures). M-PC.3 wipes
 * the book every season, so the state a matured world actually reaches is the END-OF-SEASON
 * book, and the artifact's own arithmetic for it is:
 *
 *     dose[rosterIdx][cell] = round( Σ_books Σ_sides armsByBodyCell[side·9 + rosterIdx][cell]
 *                                    ÷ (books × sides × seasons) )
 *
 * — the MEAN end-of-season exposures a body in that roster slot has lived in that cell. It is
 * pooled across sides deliberately: PC-T2's squads are REDRAWN per fixture (the banked draw),
 * so a side-asymmetric dose would be an artefact of PC-T1's fixed franchises, not a fact about
 * the slot. Every count is written through `PcRecognitionBook.note(rosterIdx, key)`, so a
 * dosed book is a state the world could itself have reached (`gDose` re-reads the books and
 * proves the resulting cells are bit-equal to this table, on every walk).
 *
 * ⚠ DECLARED (§DOUBTS): this transplants a SLOT's typical season onto a random squad. The
 * dose is a level, not a personalised book, and the doc says so.
 */
const PCT1_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PCT1_BYTES_SHA = sha(PCT1_BYTES);
const PCT1_FILE = JSON.parse(PCT1_BYTES) as Record<string, unknown>;
const N_CELLS = PC_BOOK_CELLS.length;
const CELL_IDX: Record<string, number> =
  Object.fromEntries(PC_BOOK_CELLS.map((c, i) => [c, i]));
const PC_DOSE_SOURCE = (() => {
  const books = PCT1_FILE.perBookCells as { armsByBodyCell: number[][]; armsBySeason: number[] }[];
  const seasons = books[0].armsBySeason.length;
  const sides = 2;
  const totals = zeros2(ROSTER_SIZE, N_CELLS);
  for (const b of books) {
    for (let body = 0; body < b.armsByBodyCell.length; body++) {
      const ri = body % ROSTER_SIZE;
      for (let c = 0; c < N_CELLS; c++) totals[ri][c] += b.armsByBodyCell[body][c];
    }
  }
  const denom = books.length * sides * seasons;
  const dose = totals.map((row) => row.map((v) => Math.round(v / denom)));
  return { dose, books: books.length, seasons, sides, denom, totals };
})();
const PC_DOSE: readonly number[][] = PC_DOSE_SOURCE.dose;
const PC_DOSE_EXPOSURES = sum(PC_DOSE.map((r) => sum(r)));
/** how many of the 9×28 dose cells are at or above the shipped N — the matured world's SIMPLE map. */
const PC_DOSE_COVERED_CELLS =
  PC_DOSE.reduce((a, r) => a + r.filter((v) => v >= PC_N_COVER).length, 0);

/** Write the dose into a pair of born-absent books, through the SHIPPED writer only. */
const dosedBooks = (): readonly [PcRecognitionBook, PcRecognitionBook] => {
  const mk = (): PcRecognitionBook => {
    const b = new PcRecognitionBook();
    for (let ri = 0; ri < ROSTER_SIZE; ri++) {
      for (let c = 0; c < N_CELLS; c++) {
        for (let i = 0; i < PC_DOSE[ri][c]; i++) b.note(ri, PC_BOOK_CELLS[c]);
      }
    }
    return b;
  };
  return [mk(), mk()];
};
const emptyBooks = (): readonly [PcRecognitionBook, PcRecognitionBook] =>
  [new PcRecognitionBook(), new PcRecognitionBook()];

/** the read-back check: does a book carry EXACTLY the dose table? */
const bookMatchesDose = (b: PcRecognitionBook): boolean => {
  for (let ri = 0; ri < ROSTER_SIZE; ri++) {
    for (let c = 0; c < N_CELLS; c++) {
      if (b.count(ri, PC_BOOK_CELLS[c]) !== PC_DOSE[ri][c]) return false;
    }
  }
  return true;
};
const bookIsEmpty = (b: PcRecognitionBook): boolean => b.totalExposures === 0;

/* ========================================================================== */
/* §5 THE THREE ARMS — constructed DIRECTLY with matchFlags (#283.2(iv))        */
/* ========================================================================== */
/**
 * | arm            | construction                                                          |
 * |----------------|-----------------------------------------------------------------------|
 * | `v7`           | `new Match({seed, teams, ...a4MatchFlags(7)})` + `armA4World(m,null,7,L3)` |
 * | `v7pcEmpty`    | THE SAME + `pcReactionLatency` with BORN-ABSENT books — the honest WEAK form |
 * | `v7pcMatured`  | THE SAME + `pcReactionLatency` with the TRUTH-DOSED books — the PRIMARY arm  |
 *
 * ⭐⭐ THE SLICE IS EXACTLY ONE FLAG plus the book state. `v7pcEmpty` is the shipped law on a
 * single match (a book born absent, which is where every match of a season-reset world starts);
 * `v7pcMatured` is the world where the season's lesson has already been learned. H-PC.1 is
 * scored on the MATURED arm; the EMPTY arm is the weak-form contrast the entry rung will need.
 */
const ARMS = ['v7', 'v7pcEmpty', 'v7pcMatured'] as const;
type ArmKind = (typeof ARMS)[number];
const PC_ARMS: readonly ArmKind[] = ['v7pcEmpty', 'v7pcMatured'];
const REF_ARM: ArmKind = 'v7';
const PRIMARY_ARM: ArmKind = 'v7pcMatured';
const isPc = (a: ArmKind): boolean => a !== 'v7';
const isMatured = (a: ArmKind): boolean => a === 'v7pcMatured';

const matchCfg = (seed: number, arm: ArmKind): ConstructorParameters<typeof Match>[0] => ({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  ...a4MatchFlags(L3_WORLD_VERSION),
  ...(isPc(arm)
    ? {
      pcReactionLatency: true,
      pcRecognitionBooks: isMatured(arm) ? dosedBooks() : emptyBooks(),
    }
    : {}),
});

const infoGenomeOf = (m: Match, s: Side): Record<string, unknown> =>
  m.teams[s].info.genome as unknown as Record<string, unknown>;

/** ⭐⭐ THE ARM-IDENTITY CONJUNCTS, ASSERTED ON THE MATCH THE WALK MEASURES (#283.2(iv)). */
const armConjuncts = (m: Match, arm: ArmKind): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    cbChoiceSeat: boolean; cbTouchPast: boolean; cbCommitPhysics: boolean;
    dvLearnedMap: boolean; dvDeliveryValue: boolean; dvLearn: unknown;
    pmLaneConvergence: boolean; mtMarkSag: boolean; ptpPassLead: boolean;
    pwWeightChooser: boolean; forcedTouchPast: unknown;
  };
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const genomeClean = ([0, 1] as const).every((s) => {
    const g = infoGenomeOf(m, s);
    return g.markSag === undefined && g.defLaneConvergence === undefined
      && g.cbCarryProneness === undefined && g.dvLossBelief === undefined
      && Object.keys(g).every((k) => !k.toLowerCase().startsWith('pc'));
  });
  const cbDosed = ([0, 1] as const).every((s) =>
    (m.teams[s].effGenome as TacticalGenome).cbCarryProneness === CB_WORLD_DOSE);
  const seat = m.pcLatency;
  const booksRight = !isPc(arm)
    ? seat === null
    : seat !== null && seat.nCover === PC_N_COVER
      && seat.books.every((b) => (isMatured(arm) ? bookMatchesDose(b) : bookIsEmpty(b)));
  return {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION
      && a4ArmedVersion(m) === L3_WORLD_VERSION,
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theThreeCbDoorsAreLiveInThisSim: mm.cbChoiceSeat && mm.cbTouchPast && mm.cbCommitPhysics,
    theL3BooksCarryTheMaturedDose: l3Dosed,
    theCbSeatCarriesItsDeclaredProneness: cbDosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    noDoseIsInTheFranchiseGenome: genomeClean,
    noArmingExistsAtConstruction: mm.forcedTouchPast === null,
    theDvSeamIsUnarmedOnBothArms: !mm.dvLearnedMap && !mm.dvDeliveryValue && mm.dvLearn === null,
    theMtFamilyIsUnarmedOnBothArms: !mm.pmLaneConvergence && !mm.mtMarkSag,
    thePtpAndPwDoorsAreShut: !mm.ptpPassLead && !mm.pwWeightChooser,
    /** ⭐⭐ THE SLICE'S OWN DOOR, and the BOOK STATE that makes the arm what it is. */
    thePcDoorMatchesThisArm: m.pcReactionLatency === isPc(arm),
    thePcBookStateMatchesThisArm: booksRight,
  };
};

/* ========================================================================== */
/* §6 THE ARMING-LIFECYCLE READ (the M-BU.2 debt, at a NEW composition)         */
/* ========================================================================== */
/**
 * THE STALENESS CLASS (CB-T2 §CORRECTIONS (iv)): `Match.forcedTouchPast` is a SINGLE
 * match-scoped slot, written by the CB-T2 choice seat, withdrawn at that same site, consumed by
 * the ONE fork in `Match.stepBall`. A world that arms OTHER seams beside it may take an EARLY
 * RETURN above the seat's block, so the withdrawal never runs and an aim survives its own tick.
 * #287.3 discharged CB+L3+DV, #289 CB+L3+MT, #295 CB+L3+PW; ⭐ CB+L3+PC IS NEW, so it is taken
 * in full — AND the PC seam's own deposit-analogue, THE SEAT, is read at the same boundary.
 *
 * ⭐ THE PC ANALOGUE IS NOT A SLOT, IT IS A SEAT. PW deposited a value into a one-tick slot; PC
 * holds per-body state across ticks BY DESIGN, so the law that applies is not "empty at every
 * boundary" but SILENCE WITH THE DOOR SHUT: with `P` shut, `m.pcLatency` is `null` — there is
 * no ledger, no hold map and no book to be stale. That is a structural unreachability, and it
 * is counted in 32 worlds rather than claimed.
 */
interface Lifecycle {
  ticks: number;
  carryOvers: number;
  carryOverAcrossOwnerChange: number;
  carryOverAcrossPhaseChange: number;
  maxArmingAgeTicks: number;
  armedAtWhistle: number;
  armedAtConstruction: number;
  armings: number; armingsCleared: number; seats: number; touchPasts: number;
  /** ⭐ THE PC SEAT, at the same step boundary: 1 per tick the seat EXISTS. */
  pcSeatLiveAtStepBoundary: number;
  /** live holds summed over every step boundary — the seat's own state, counted. */
  pcHeldBodiesAtStepBoundary: number;
  pcSeatLiveAtWhistle: number;
  /** ⭐ holds still live at the whistle (a hold is allowed to be; counted, never gated as 0). */
  pcHoldsLiveAtWhistle: number;
}
const EMPTY_LIFECYCLE: Lifecycle = {
  ticks: 0, carryOvers: 0, carryOverAcrossOwnerChange: 0, carryOverAcrossPhaseChange: 0,
  maxArmingAgeTicks: 0, armedAtWhistle: 0, armedAtConstruction: 0,
  armings: 0, armingsCleared: 0, seats: 0, touchPasts: 0,
  pcSeatLiveAtStepBoundary: 0, pcHeldBodiesAtStepBoundary: 0,
  pcSeatLiveAtWhistle: 0, pcHoldsLiveAtWhistle: 0,
};
const addLifecycle = (a: Lifecycle, b: Lifecycle): void => {
  for (const k of Object.keys(a) as (keyof Lifecycle)[]) {
    a[k] = k === 'maxArmingAgeTicks' ? Math.max(a[k], b[k]) : a[k] + b[k];
  }
};

/** ⭐ THE PC SEAT LEDGER, read off the engine at the whistle — receipts, never effect sizes. */
const PC_LEDGER_KEYS = ['firings', 'arms', 'armsSimple', 'armsChoice', 'overlapRestarts',
  'overlapNoExtend', 'heldExecutorTicks', 'decisionsHeld', 'exposuresNoted', 'armedWithMemory',
  'preProcessedSkips', 'heldThroughReassignment', 'subClears', 'subClearedLiveHolds',
  'subClearedMemories', 'deadBallClears', 'deadBallClearedHolds'] as const;
type PcLedgerKey = (typeof PC_LEDGER_KEYS)[number];
type PcLedgerRow = Record<PcLedgerKey, number> & { firingsByClass: number[] };
const emptyPcLedger = (): PcLedgerRow => ({
  ...(Object.fromEntries(PC_LEDGER_KEYS.map((k) => [k, 0])) as Record<PcLedgerKey, number>),
  firingsByClass: zeros(PC_CLASSES.length),
});
const addPcLedger = (a: PcLedgerRow, b: PcLedgerRow): void => {
  for (const k of PC_LEDGER_KEYS) a[k] += b[k];
  for (let i = 0; i < a.firingsByClass.length; i++) a.firingsByClass[i] += b.firingsByClass[i] ?? 0;
};
const readPcLedger = (m: Match): PcLedgerRow => {
  const out = emptyPcLedger();
  const seat = m.pcLatency;
  if (seat === null) return out;
  const l = seat.ledger;
  out.firings = sum(PC_CLASSES.map((k) => l.firings[k]));
  out.arms = l.armedByTier.simple + l.armedByTier.choice;
  out.armsSimple = l.armedByTier.simple;
  out.armsChoice = l.armedByTier.choice;
  out.overlapRestarts = l.overlapRestarts;
  out.overlapNoExtend = l.overlapNoExtend;
  out.heldExecutorTicks = l.heldExecutorTicks;
  out.decisionsHeld = l.decisionsHeld;
  out.exposuresNoted = l.exposuresNoted;
  out.armedWithMemory = l.armedWithMemory;
  out.preProcessedSkips = l.preProcessedSkips;
  out.heldThroughReassignment = l.heldThroughReassignment;
  out.subClears = l.subClears;
  out.subClearedLiveHolds = l.subClearedLiveHolds;
  out.subClearedMemories = l.subClearedMemories;
  out.deadBallClears = l.deadBallClears;
  out.deadBallClearedHolds = l.deadBallClearedHolds;
  out.firingsByClass = PC_CLASSES.map((k) => l.firings[k]);
  return out;
};

/* ========================================================================== */
/* §7 ⭐⭐ THE DOORS MATRIX AT THE CB+L3+PC COMPOSITION — 64 CELLS, FIRST        */
/* ========================================================================== */
/**
 * THE COMPOSITION'S SIX DOORS, enumerated EXHAUSTIVELY (2^6 = 64 cells) on the v7 SUBSTRATE
 * (`a4MatchFlags(3)` — CALLED, not copied, BU-T0's own line), so every pairwise flag
 * interaction appears in the matrix and so does every higher-order one:
 *
 *   C  cbCommitPhysics      T  cbTouchPast         S  cbChoiceSeat (+ the proneness dose)
 *   L  l3DefenceLearn (+ the matured L3 dose)      V  l3DefenceVeto
 *   ⭐⭐ P  pcReactionLatency (+ the MATURED recognition dose — the arm the exam scores)
 *
 * ⚠ THREE AXES CARRY THEIR OWN DOSE, DECLARED: `S` without a proneness cannot form a seat,
 * `L` without a dosed book has nothing to read, and `P` without a book has nothing to
 * recognise — each is "door + its banked dose", exactly as the armed entries compose them.
 */
interface DoorCell {
  C: boolean; T: boolean; S: boolean; L: boolean; V: boolean; P: boolean;
}
const DOOR_AXES = ['C', 'T', 'S', 'L', 'V', 'P'] as const;
type DoorAxis = (typeof DOOR_AXES)[number];
const doorKey = (c: DoorCell): string => DOOR_AXES.map((a) => (c[a] ? '1' : '0')).join('');
const ALL_DOOR_CELLS: DoorCell[] = (() => {
  const out: DoorCell[] = [];
  for (let bits = 0; bits < 1 << DOOR_AXES.length; bits++) {
    const c = {} as DoorCell;
    DOOR_AXES.forEach((a, i) => { c[a] = ((bits >> i) & 1) === 1; });
    out.push(c);
  }
  return out;
})();
const withAxis = (c: DoorCell, a: DoorAxis, v: boolean): DoorCell => ({ ...c, [a]: v });

const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/** ONE doors-matrix walk: the whistle signature + the full lifecycle read + the PC ledger. */
const doorsWalk = (seed: number, c: DoorCell): {
  sig: string; life: Lifecycle; pc: PcLedgerRow; seatNull: boolean; bookExposures: number;
} => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(3),
    ...(c.C ? { cbCommitPhysics: true } : {}),
    ...(c.T ? { cbTouchPast: true } : {}),
    ...(c.S ? { cbChoiceSeat: true } : {}),
    ...(c.L ? { l3DefenceLearn: true } : {}),
    ...(c.V ? { l3DefenceVeto: true } : {}),
    ...(c.P ? { pcReactionLatency: true, pcRecognitionBooks: dosedBooks() } : {}),
  });
  if (c.S) for (const side of [0, 1] as const) setCbProneness(m, side, CB_WORLD_DOSE);
  if (c.L) {
    const led = (m as unknown as {
      l3Defence: { books: { note(g: number, p: boolean): void }[] } | null;
    }).l3Defence;
    if (led !== null) {
      for (const book of led.books) {
        for (let g = 0; g < L3_DOSE.length; g++) {
          for (let i = 0; i < L3_DOSE[g].punished; i++) book.note(g, true);
          for (let i = 0; i < L3_DOSE[g].lunges - L3_DOSE[g].punished; i++) book.note(g, false);
        }
      }
    }
  }
  const mm = m as unknown as {
    forcedTouchPast: { gid: number; dir: { x: number; y: number } } | null;
    cbChoiceLedger: { armings: number; armingsCleared: number; seats: number };
    cbLedger: { touchPasts: number };
  };
  const life: Lifecycle = { ...EMPTY_LIFECYCLE };
  life.armedAtConstruction = mm.forcedTouchPast === null ? 0 : 1;
  let prevArmKey = '';
  let armAge = 0;
  let prevOwner: number | null = null;
  let prevPhase = m.phase;
  while (!m.finished) {
    m.step(DT);
    life.ticks += 1;
    const f = mm.forcedTouchPast;
    const key = f === null ? '' : `${f.gid}:${f.dir.x}:${f.dir.y}`;
    const owner = m.ball.owner === null ? null : m.ball.owner.gid;
    if (key !== '') {
      life.carryOvers += 1;
      armAge = key === prevArmKey ? armAge + 1 : 1;
      if (armAge > life.maxArmingAgeTicks) life.maxArmingAgeTicks = armAge;
      if (key === prevArmKey && owner !== prevOwner) life.carryOverAcrossOwnerChange += 1;
      if (key === prevArmKey && m.phase !== prevPhase) life.carryOverAcrossPhaseChange += 1;
    } else armAge = 0;
    prevArmKey = key;
    prevOwner = owner;
    prevPhase = m.phase;
    if (m.pcLatency !== null) {
      life.pcSeatLiveAtStepBoundary += 1;
      life.pcHeldBodiesAtStepBoundary += m.pcLatency.liveHolds;
    }
  }
  life.armedAtWhistle = mm.forcedTouchPast === null ? 0 : 1;
  life.pcSeatLiveAtWhistle = m.pcLatency === null ? 0 : 1;
  life.pcHoldsLiveAtWhistle = m.pcLatency === null ? 0 : m.pcLatency.liveHolds;
  life.armings = mm.cbChoiceLedger.armings;
  life.armingsCleared = mm.cbChoiceLedger.armingsCleared;
  life.seats = mm.cbChoiceLedger.seats;
  life.touchPasts = mm.cbLedger.touchPasts;
  return {
    sig: signature(m),
    life,
    pc: readPcLedger(m),
    seatNull: m.pcLatency === null,
    bookExposures: m.pcLatency === null ? 0
      : m.pcLatency.books[0].totalExposures + m.pcLatency.books[1].totalExposures,
  };
};

const LIFECYCLE_SEED_COUNT = MODE === 'smoke' ? 1 : LIFECYCLE_SEEDS_FULL;
const LIFECYCLE_SEEDS = Array.from({ length: LIFECYCLE_SEED_COUNT }, (_, i) => LIFECYCLE_BASE + i);
banner('  [pc-t2] ⭐ ORDER OF PROOF STEP 1 — the M-BU.2 lifecycle/doors proof at CB+L3+PC: '
  + `${ALL_DOOR_CELLS.length} door cells × ${LIFECYCLE_SEEDS.length} seeds…`);
const doorSig: Record<number, Record<string, string>> = {};
const doorLife: Record<number, Record<string, Lifecycle>> = {};
const doorPc: Record<number, Record<string, PcLedgerRow>> = {};
const doorSeatNull: Record<number, Record<string, boolean>> = {};
const doorBookExp: Record<number, Record<string, number>> = {};
for (const seed of LIFECYCLE_SEEDS) {
  doorSig[seed] = {}; doorLife[seed] = {}; doorPc[seed] = {};
  doorSeatNull[seed] = {}; doorBookExp[seed] = {};
  for (const c of ALL_DOOR_CELLS) {
    const r = doorsWalk(seed, c);
    doorSig[seed][doorKey(c)] = r.sig;
    doorLife[seed][doorKey(c)] = r.life;
    doorPc[seed][doorKey(c)] = r.pc;
    doorSeatNull[seed][doorKey(c)] = r.seatNull;
    doorBookExp[seed][doorKey(c)] = r.bookExposures;
  }
  banner(`  [pc-t2]   doors seed ${seed} — ${ALL_DOOR_CELLS.length} cells walked`);
}
const sigOf = (seed: number, c: DoorCell): string => doorSig[seed][doorKey(c)];

/**
 * ⭐⭐ THE LIFECYCLE VERDICT — the DICHOTOMY #287.3 established, re-proven at THIS composition,
 * with the PC seat read at the same boundary:
 *   (a) IN EVERY CELL WHERE AN AIM CAN FIRE (`T`), no arming survives its own tick;
 *   (b) IN EVERY CELL WHERE ARMINGS PERSIST (`S ∧ ¬T`), ZERO knocks fire — the S∧¬T EXHIBIT,
 *       expected to REPRODUCE INERT (a configuration no armed world constructs);
 *   (c) IN EVERY CELL WITH `P` SHUT, the PC seat does not exist at all: no seat at any step
 *       boundary, no ledger movement, no book — the deposit-analogue is structurally silent.
 */
const CAN_FIRE = (c: DoorCell): boolean => c.T;
const lifecycleMatrix = (() => {
  const total: Lifecycle = { ...EMPTY_LIFECYCLE };
  const firing: Lifecycle = { ...EMPTY_LIFECYCLE };
  const inert: Lifecycle = { ...EMPTY_LIFECYCLE };
  const pcOn: Lifecycle = { ...EMPTY_LIFECYCLE };
  const pcOff: Lifecycle = { ...EMPTY_LIFECYCLE };
  const pcOffLedger = emptyPcLedger();
  const pcOnLedger = emptyPcLedger();
  let cells = 0; let firingCells = 0; let inertCells = 0;
  let seatNullWithDoorShut = 0; let seatLiveWithDoorOpen = 0;
  const offenders: string[] = [];
  const persistingCells: string[] = [];
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      const k = doorKey(c);
      const l = doorLife[seed][k];
      const p = doorPc[seed][k];
      cells += 1;
      addLifecycle(total, l);
      addLifecycle(c.P ? pcOn : pcOff, l);
      addPcLedger(c.P ? pcOnLedger : pcOffLedger, p);
      if (!c.P) {
        if (doorSeatNull[seed][k]) seatNullWithDoorShut += 1;
        else offenders.push(`${seed}:${k}(PC-SEAT-EXISTS-WITH-THE-DOOR-SHUT)`);
        if (l.pcSeatLiveAtStepBoundary > 0 || l.pcSeatLiveAtWhistle > 0
          || doorBookExp[seed][k] > 0 || PC_LEDGER_KEYS.some((q) => p[q] !== 0)) {
          offenders.push(`${seed}:${k}(PC-SEAM-MOVED-WITH-THE-DOOR-SHUT)`);
        }
      } else if (!doorSeatNull[seed][k]) seatLiveWithDoorOpen += 1;
      if (CAN_FIRE(c)) {
        firingCells += 1;
        addLifecycle(firing, l);
        if (l.carryOvers > 0 || l.armedAtWhistle > 0 || l.armedAtConstruction > 0) {
          offenders.push(`${seed}:${k}`);
        }
      } else {
        inertCells += 1;
        addLifecycle(inert, l);
        if (l.carryOvers > 0) persistingCells.push(`${seed}:${k}`);
        if (l.touchPasts > 0 || l.armedAtConstruction > 0) {
          offenders.push(`${seed}:${k}(FIRED-WITH-THE-DOOR-SHUT)`);
        }
      }
    }
  }
  return {
    total, firing, inert, pcOn, pcOff, pcOnLedger, pcOffLedger,
    cells, firingCells, inertCells, offenders, persistingCells,
    seatNullWithDoorShut, seatLiveWithDoorOpen,
  };
})();

/** ⭐⭐ THE STOP RULE (the order of proof): a defect here is a `src` question. */
if (lifecycleMatrix.offenders.length > 0) {
  banner('PC-T2 STOPS FOR ADJUDICATION — the arming-lifecycle class BIT at CB+L3+PC:');
  banner(`  in FIRING cells — carry-overs ${lifecycleMatrix.firing.carryOvers} · armed at the `
    + `whistle ${lifecycleMatrix.firing.armedAtWhistle} · longest arming life `
    + `${lifecycleMatrix.firing.maxArmingAgeTicks} ticks`);
  banner(`  in NON-FIRING cells — knocks fired ${lifecycleMatrix.inert.touchPasts}`);
  banner(`  PC seat live with its door shut — ${lifecycleMatrix.pcOff.pcSeatLiveAtStepBoundary}`);
  banner(`  offending cells (seed:CTSLVP): ${lifecycleMatrix.offenders.slice(0, 40).join(' ')}`);
  banner('  A FIX IS A src CHANGE AND NEEDS ITS OWN AUTHORIZATION. Nothing was written.');
  process.exit(4);
}
banner(`  [pc-t2] ⭐ lifecycle: ${lifecycleMatrix.firingCells} FIRING cells CLEAN `
  + `(${lifecycleMatrix.firing.armings} armings, ${lifecycleMatrix.firing.touchPasts} knocks) · `
  + `${lifecycleMatrix.persistingCells.length} S∧¬T cells hold an UNCONSUMED arming `
  + `(${lifecycleMatrix.inert.touchPasts} knocks fired there — the inert half) · `
  + `PC seat null in ${lifecycleMatrix.seatNullWithDoorShut} door-shut cells`);

/** THE IDENTITY CLAIMS — checked on EVERY cell of the matrix and EVERY seed (`always`). */
const doorsAlways = (() => {
  const fail: Record<string, string[]> = {
    touchPastDoorInertWithoutTheChoiceSeat: [],
    l3LearnDoorInertWithoutTheVeto: [],
    l3VetoDoorInertWithoutTheBook: [],
    pcSeatStructurallySilentWithItsDoorShut: [],
  };
  const checked: Record<string, number> = Object.fromEntries(
    Object.keys(fail).map((k) => [k, 0]));
  const claim = (
    name: string, seed: number, c: DoorCell, axis: DoorAxis, when: boolean,
  ): void => {
    if (!when || c[axis]) return;
    checked[name] += 1;
    if (sigOf(seed, withAxis(c, axis, true)) !== sigOf(seed, c)) {
      fail[name].push(`${seed}:${doorKey(c)}`);
    }
  };
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      claim('touchPastDoorInertWithoutTheChoiceSeat', seed, c, 'T', !c.S);
      claim('l3LearnDoorInertWithoutTheVeto', seed, c, 'L', !c.V);
      claim('l3VetoDoorInertWithoutTheBook', seed, c, 'V', !c.L);
      if (!c.P) {
        const k = doorKey(c);
        checked.pcSeatStructurallySilentWithItsDoorShut += 1;
        const p = doorPc[seed][k];
        const l = doorLife[seed][k];
        const silent = doorSeatNull[seed][k] && doorBookExp[seed][k] === 0
          && PC_LEDGER_KEYS.every((q) => p[q] === 0)
          && p.firingsByClass.every((v) => v === 0)
          && l.pcSeatLiveAtStepBoundary === 0 && l.pcSeatLiveAtWhistle === 0
          && l.pcHeldBodiesAtStepBoundary === 0;
        if (!silent) fail.pcSeatStructurallySilentWithItsDoorShut.push(`${seed}:${k}`);
      }
    }
  }
  return { fail, checked, allHold: Object.values(fail).every((v) => v.length === 0) };
})();

/** THE LIVENESS CLAIMS — SETWISE (a door that can never move the world is a DEAD door). */
const doorsLive = (() => {
  const hits: Record<string, number> = {
    theCommitPhysicsDoorMovesTheWorld: 0,
    theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen: 0,
    theL3VetoMovesTheWorldOnADosedBook: 0,
    thePcDoorMovesTheWorld: 0,
    thePcDoorMovesTheWorldOnTheFullCbL3Stack: 0,
  };
  for (const seed of LIFECYCLE_SEEDS) {
    for (const c of ALL_DOOR_CELLS) {
      if (!c.C && sigOf(seed, withAxis(c, 'C', true)) !== sigOf(seed, c)) {
        hits.theCommitPhysicsDoorMovesTheWorld += 1;
      }
      if (!c.S && c.T && sigOf(seed, withAxis(c, 'S', true)) !== sigOf(seed, c)) {
        hits.theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen += 1;
      }
      if (!c.V && c.L && sigOf(seed, withAxis(c, 'V', true)) !== sigOf(seed, c)) {
        hits.theL3VetoMovesTheWorldOnADosedBook += 1;
      }
      if (!c.P && sigOf(seed, withAxis(c, 'P', true)) !== sigOf(seed, c)) {
        hits.thePcDoorMovesTheWorld += 1;
        if (c.C && c.T && c.S && c.L && c.V) {
          hits.thePcDoorMovesTheWorldOnTheFullCbL3Stack += 1;
        }
      }
    }
  }
  return hits;
})();

/**
 * ⭐ THE STRUCTURAL HALF of the lifecycle proof — the call-site census, machine-read from
 * `src/**`, plus the NON-VACUITY fact that the early-return exposure is REAL in this
 * composition. ⭐ AND the PC seam's own site census: ONE seat fork, ONE detector, ONE executor
 * gate, ONE decide AND-gate, and ZERO PC tokens in `TeamBrain.ts` / `PlayerBrain.ts` (H3, and
 * M-PC.5 / M-PW.4's form: the CB seat's arming block untouched, so the S∧¬T guard is not due).
 */
const TEAMBRAIN_SRC = readFileSync('src/ai/TeamBrain.ts', 'utf8');
const lifecycleStructure = (() => {
  const probe = new Match(matchCfg(GWORLD_SEED, 'v7pcMatured'));
  const pm = probe as unknown as {
    o2Look: boolean; ekHoldVeto: boolean; o1PassWindup: boolean; c7Windup: boolean;
    stationEye: unknown; ptpPassLead: boolean;
  };
  const pcTokens = (src: string): number => countOf(src, /\bpc(?:Latency|ReactionLatency|Hold|Recognition)/g);
  return {
    armCallSites: countOf(BRAIN_SRC, /match\.armTouchPast\(/g),
    clearCallSites: countOf(BRAIN_SRC, /match\.clearTouchPastArming\(/g),
    slotClearedInSrc: countOf(MATCH_SRC, /this\.forcedTouchPast = null;/g),
    fireForks: countOf(MATCH_SRC, /mech\.performTouchPast\(/g),
    pcSeatForks: countOf(MATCH_SRC, /this\.pcLatency = this\.pcReactionLatency/g),
    pcDetectorSites: countOf(MATCH_SRC, /private pcLatencyObserve\(/g),
    pcDetectorCalls: countOf(MATCH_SRC, /this\.pcLatencyObserve\(\);/g),
    pcExecutorGates: countOf(EXEC_SRC, /pcLatency/g),
    pcForgetBodyCalls: countOf(MATCH_SRC, /this\.pcLatency\?\.forgetBody\(/g),
    pcDecisionTimerWrites: countOf(PC_SRC, /decisionTimer\s*=/g)
      + countOf(EXEC_SRC, /decisionTimer\s*=/g),
    pcTokensInTeamBrain: pcTokens(TEAMBRAIN_SRC),
    pcTokensInPlayerBrain: pcTokens(BRAIN_SRC),
    pcModuleImportLines: countOf(PC_SRC, /^import .*$/gm),
    o2LookArmed: pm.o2Look === true,
    ekHoldVetoArmed: pm.ekHoldVeto === true,
    o1PassWindupArmed: pm.o1PassWindup === true,
    c7WindupArmed: pm.c7Windup === true,
    ptpArmed: pm.ptpPassLead === true,
    stationEyeNull: pm.stationEye === null,
    lines: {
      arm: `${BRAIN_SRC_PATH}:${ARM_SITE_LINE}`,
      withdraw: `${BRAIN_SRC_PATH}:${CLEAR_SITE_LINE}`,
      fire: `${MATCH_SRC_PATH}:${FIRE_SITE_LINE}`,
      pcSeatFork: `${MATCH_SRC_PATH}:${PC_SEAT_FORK_LINE}`,
      pcDetector: `${MATCH_SRC_PATH}:${PC_DETECTOR_LINE}`,
      pcDecideGate: `${MATCH_SRC_PATH}:${PC_DECIDE_GATE_LINE}`,
    },
  };
})();

/* ========================================================================== */
/* §8 THE ORACLE — THE ENGINE'S OWN PASS MACHINERY (#256.2), GK-SPLIT (#286.1)  */
/* ========================================================================== */
const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = dist(o.pos, p.pos);
    if (d < best) best = d;
  }
  return best;
};

/**
 * ONE option census at ONE moment — BU-C0's ladder VERBATIM in definition (commensurable with
 * the committed census and with BU-T0 / BU-T0b / BU-T1 / PW-T1), with the GK split at every
 * behind-ball rung (BU-C0 §COMMANDER CORRECTIONS item 1's debt: "any future instrument that
 * quotes this ladder carries GK-SPLIT RUNGS"). L1 POSITION (Q07's own ±2 m band, EXTRACTED
 * from src) · L2 the engine's own flight prediction · L3 `arrivalMargin > 0` · L4 the engine's
 * corridor sampler.
 */
interface OptionCensus {
  mates: number;
  behind: number; lateral: number; ahead: number;
  behindFlight: number; behindRace: number; behindUncut: number;
  behindGk: number; behindFlightGk: number; behindRaceGk: number; behindUncutGk: number;
  behindUncutInWindow: number;
  lateralRace: number; lateralUncut: number;
  aheadFlight: number; aheadRace: number; aheadUncut: number;
  raceAll: number; uncutAll: number;
  oracleCalls: number; oracleNulls: number; corridorCalls: number;
  deltaSum: number; marginSumBehind: number;
}
const CENSUS_KEYS = [
  'mates', 'behind', 'lateral', 'ahead', 'behindFlight', 'behindRace', 'behindUncut',
  'behindGk', 'behindFlightGk', 'behindRaceGk', 'behindUncutGk', 'behindUncutInWindow',
  'lateralRace', 'lateralUncut', 'aheadFlight', 'aheadRace', 'aheadUncut',
  'raceAll', 'uncutAll', 'oracleCalls', 'oracleNulls', 'corridorCalls',
  'deltaSum', 'marginSumBehind',
] as const;
const EMPTY_CENSUS: OptionCensus = Object.fromEntries(
  CENSUS_KEYS.map((k) => [k, 0]),
) as unknown as OptionCensus;

const censusAt = (m: Match, carrier: Player): OptionCensus => {
  const t = m.teams[carrier.side];
  const opp = m.teams[(1 - carrier.side) as Side];
  const truth = capturePerceptionTruth(m);
  const snapshot = oraclePerceptionSnapshot(truth, carrier.gid);
  const profiles = m.reachProfiles();
  const windowGids = new Set(passChoiceCandidateGids(carrier, t.players));
  const ballLocalX = t.localX(m.ball.pos.x);
  const out: OptionCensus = { ...EMPTY_CENSUS };
  for (const mate of t.players) {
    if (mate === carrier || mate.sentOff) continue;
    out.mates += 1;
    const delta = t.localX(mate.pos.x) - ballLocalX;
    out.deltaSum += delta;
    const isBehind = delta <= -FORWARD_BAND_M;
    const isAhead = delta >= FORWARD_BAND_M;
    const isLateral = !isBehind && !isAhead;
    const isGk = mate.role === 'GK';
    if (isBehind) { out.behind += 1; if (isGk) out.behindGk += 1; }
    else if (isAhead) out.ahead += 1;
    else out.lateral += 1;
    out.oracleCalls += 1;
    const res = evaluatePassAffordance({
      snapshot, passerGid: carrier.gid, targetGid: mate.gid,
      attackDir: t.attackDir, reachProfiles: profiles,
    });
    if (res === null) { out.oracleNulls += 1; continue; }
    if (!res.flight.reachable) continue;
    if (isBehind) { out.behindFlight += 1; if (isGk) out.behindFlightGk += 1; }
    else if (isAhead) out.aheadFlight += 1;
    if (res.affordance.arrivalMargin <= 0) continue;
    out.raceAll += 1;
    if (isBehind) {
      out.behindRace += 1;
      if (isGk) out.behindRaceGk += 1;
      out.marginSumBehind += res.affordance.arrivalMargin;
    } else if (isLateral) out.lateralRace += 1;
    else out.aheadRace += 1;
    let cut = false;
    for (const d of opp.players) {
      if (d.sentOff) continue;
      out.corridorCalls += 1;
      const facts = evaluatePassCorridorInterception({
        snapshot, passerGid: carrier.gid, targetGid: mate.gid,
        defenderGid: d.gid, reachProfiles: profiles,
      });
      if (facts !== null && facts.earliestFeasiblePoint !== null) { cut = true; break; }
    }
    if (cut) continue;
    out.uncutAll += 1;
    if (isBehind) {
      out.behindUncut += 1;
      if (windowGids.has(mate.gid)) out.behindUncutInWindow += 1;
      if (isGk) out.behindUncutGk += 1;
    } else if (isAhead) out.aheadUncut += 1;
    else out.lateralUncut += 1;
  }
  return out;
};
const addCensus = (a: OptionCensus, b: OptionCensus): void => {
  for (const k of CENSUS_KEYS) a[k] += b[k];
};

/* ========================================================================== */
/* §9 ⭐⭐ THE CARRIER-ANCHORED Δsep CAMERA AT THE TOUCH-PAST (H-PC.1 (b))       */
/* ========================================================================== */
/**
 * ⭐⭐ THE INSTRUMENT IS #266.2(i)'s, REUSED, NOT REINVENTED. Its home is
 * CB-C0-DISPOSSESSION-CENSUS.md's RATIFIED marker: *"any CB exam consuming a separation
 * baseline MUST re-measure with a carrier-anchored t0"* — the t0 term is defender→CARRIER, not
 * defender→BALL, because the ball rides ~0.85 m ahead of the carrier and a ball-anchored term
 * is level-inflated by ≈ +0.39–0.60 m. CB-T2 implements exactly this pair
 * (`sepCarrierT0` / `sepCarrierEnd`, `scripts/probes/cb-t2-choice-seat.ts`), and this camera is
 * that pair moved onto the KNOCK:
 *
 *   t0            the tick the engine's own `cbLedger.touchPasts` counter moves — the knock.
 *   the DEFENDER  every opponent inside `CONTEST_RADIUS` of the ball at t0 (CB-T2's own
 *                 challenger set), classified BEATEN by the engine's own `beatsDefender`.
 *   sep(t)        |defender − CARRIER| — carrier-anchored at BOTH ends.
 *   Δsep          sep(t0 + W) − sep(t0), W = the APPLIED window law of record (54 ticks =
 *                 0.9000 s, re-derived from `L3_DEFENCE_WINDOW_S`), and a SECOND read at the
 *                 CHOICE tier's own 27 ticks.
 *
 * ⭐ THE FOOTBALL: the knocker is the INITIATOR, so he is never in his own surprise set (PC-T0
 * §1: initiators free BY EXCLUSION) and reacts at zero latency; the beaten defender is a
 * non-initiator inside 25 m and pays HIS tier. If processing time is real, the gap he concedes
 * over the same window must GROW.
 *
 * ⭐ THE DEFENDER'S TIER is read from the seat's OWN hold snapshot on the tick after t0 — the
 * tier the seat itself decided, never a probe re-derivation. In the base arm there is no seat
 * and every row is tier `none`.
 *
 * ⚠ CENSORING, disclosed: a row whose window runs past the whistle, or whose carrier/defender
 * has left the pitch at t0+W, is counted CENSORED and dropped from the Δsep sums. A row whose
 * phase leaves `playing` inside the window is counted separately (`deadBallCensored`) because
 * a restart teleports bodies and would fabricate separation (the L3-T0 §DEV 3 hazard).
 */
type SepTier = 'none' | 'simple' | 'choice';
const SEP_TIERS: readonly SepTier[] = ['none', 'simple', 'choice'];
interface SepCensus {
  knocks: number;
  challengers: number;
  beaten: number;
  /** rows that survived to be measured at the LAW window, by tier index. */
  nByTier: number[];
  sepT0SumByTier: number[];
  sepEndSumByTier: number[];
  dSepSumByTier: number[];
  /** the same at the CHOICE-TIER window (27 applied ticks). */
  nTierWindowByTier: number[];
  dSepTierWindowSumByTier: number[];
  censoredWhistle: number;
  censoredDeadBall: number;
  censoredMissingBody: number;
  /** ⭐ the replica check: our challenger/beaten reconstruction vs the ENGINE's own deltas. */
  replicaMismatches: number;
  /** Δsep histogram bins, 0.5 m wide from −5 m to +10 m, for the percentile faces (#287.1). */
  dSepBins: number[];
}
const SEP_BIN_LO = -5;
const SEP_BIN_W = 0.5;
const SEP_BIN_N = 30;
const emptySepCensus = (): SepCensus => ({
  knocks: 0, challengers: 0, beaten: 0,
  nByTier: zeros(SEP_TIERS.length),
  sepT0SumByTier: zeros(SEP_TIERS.length),
  sepEndSumByTier: zeros(SEP_TIERS.length),
  dSepSumByTier: zeros(SEP_TIERS.length),
  nTierWindowByTier: zeros(SEP_TIERS.length),
  dSepTierWindowSumByTier: zeros(SEP_TIERS.length),
  censoredWhistle: 0, censoredDeadBall: 0, censoredMissingBody: 0,
  replicaMismatches: 0,
  dSepBins: zeros(SEP_BIN_N),
});
const addSepCensus = (a: SepCensus, b: SepCensus): void => {
  a.knocks += b.knocks; a.challengers += b.challengers; a.beaten += b.beaten;
  a.censoredWhistle += b.censoredWhistle; a.censoredDeadBall += b.censoredDeadBall;
  a.censoredMissingBody += b.censoredMissingBody;
  a.replicaMismatches += b.replicaMismatches;
  for (let i = 0; i < SEP_TIERS.length; i++) {
    a.nByTier[i] += b.nByTier[i];
    a.sepT0SumByTier[i] += b.sepT0SumByTier[i];
    a.sepEndSumByTier[i] += b.sepEndSumByTier[i];
    a.dSepSumByTier[i] += b.dSepSumByTier[i];
    a.nTierWindowByTier[i] += b.nTierWindowByTier[i];
    a.dSepTierWindowSumByTier[i] += b.dSepTierWindowSumByTier[i];
  }
  for (let i = 0; i < SEP_BIN_N; i++) a.dSepBins[i] += b.dSepBins[i];
};
const sepBinOf = (d: number): number =>
  Math.max(0, Math.min(SEP_BIN_N - 1, Math.floor((d - SEP_BIN_LO) / SEP_BIN_W)));
const bodyOf = (p: Player): CbBody => ({
  pos: { x: p.pos.x, y: p.pos.y }, vel: { x: p.vel.x, y: p.vel.y }, accel: p.accel,
});

/** an open Δsep row, waiting for its window to close. */
interface OpenSep {
  t0: number;
  carrierGid: number;
  defenderGid: number;
  tier: SepTier;
  sepT0: number;
  sepTierWindow: number | null;
  deadBall: boolean;
}

/* ========================================================================== */
/* §10 THE WALK — #173's spell/touch semantics + every instrument               */
/* ========================================================================== */
type Terminator = 'opponentControl' | 'fouledWon' | 'foulCommitted' | 'goal' | 'outOfPlay'
  | 'matchEnd';
const TERMINALS = ['tackled', 'intercepted', 'badTouch', 'lostOther', 'shot', 'forcedLong',
  'outOfPlay', 'foulWon', 'foulCommitted', 'goal', 'matchEnd'] as const;
type TerminalClass = (typeof TERMINALS)[number];
const LOSS_TERMINALS: readonly TerminalClass[] = ['tackled', 'intercepted', 'badTouch',
  'lostOther'];

interface Spell {
  team: Side; startTick: number; endTick: number; ownedTicks: number; touches: number;
  origin: 'openPlay' | 'restart' | 'kickoff'; terminator: Terminator; terminal: TerminalClass;
  /** ⭐ Q14's own population: was the FIRST reception of this spell pressed? */
  firstReceptionPressed: boolean;
  /** ⭐ PRESSING EFFICACY: was the carrier pressed on the spell's LAST owned tick? */
  pressedAtEnd: boolean;
  /** ⭐ PRESSING EFFICACY, the tier limb: the carrier's PC tier on the last owned tick. */
  tierAtEnd: SepTier;
}

const ROLE_LIST: readonly Role[] = ['GK', 'DF', 'MF', 'WG', 'ST'];
const ROLE_IDX: Record<string, number> = Object.fromEntries(ROLE_LIST.map((r, i) => [r, i]));

interface Row {
  seed: number;
  signature: string;
  armOk: boolean;
  lifecycle: Lifecycle;
  pcLedger: PcLedgerRow;
  sep: SepCensus;
  /** ⭐ per-cell arms and simple-tier arms, from the seat's own hold snapshots. */
  armsByCell: number[];
  simpleByCell: number[];
  /** per-role arms / simple, for the reported role face. */
  armsByRole: number[];
  simpleByRole: number[];
  /** coverage the books actually hold at the whistle, per N of the band. */
  coveredBodyCellsAtN: number[];
  bookExposuresAtWhistle: number;
  receptions: number;
  receptionsPressed: number;
  atReceptions: OptionCensus;
  atPressedReceptions: OptionCensus;
  carrierSamples: number;
  carrierSamplesPressed: number;
  atPressedCarrier: OptionCensus;
  behindHist: number[];
  behindHistPressed: number[];
  attempts: number; attemptsUnattributed: number;
  attemptsForwardEngine: number; attemptsBackwardMine: number; attemptsLateralMine: number;
  completed: number; completedForwardEngine: number;
  completedBackwardMine: number; completedLateralMine: number;
  enginePasses: number; enginePassesForward: number; enginePassesCompleted: number;
  engineTackles: number; engineInterceptions: number;
  spells: number; openSpells: number; openSpellTickSum: number; openSpellTouchSum: number;
  terminalAll: Record<TerminalClass, number>;
  terminalOpen: Record<TerminalClass, number>;
  /** ⭐ PRESSING EFFICACY cells: open-play spells split by end-pressure and by the loss class. */
  pressedEndSpells: number; pressedEndLost: number;
  freeEndSpells: number; freeEndLost: number;
  /** ⭐ the VICTIM'S TIER limb: pressed-end spells whose carrier was held, by tier. */
  pressedEndByTier: number[]; pressedEndLostByTier: number[];
  ticks: number; inPlayTicks: number; simSeconds: number;
  goals: number;
}

const emptyTerminals = (): Record<TerminalClass, number> => {
  const o = {} as Record<TerminalClass, number>;
  for (const k of TERMINALS) o[k] = 0;
  return o;
};
const N_BAND = PC_N_COVER_SENSITIVITY;

/**
 * ONE match, ONE arm. `measure=false` walks the SAME world with EVERY probe-side instrument
 * switched off — the NON-PERTURBATION control (`gNonPerturbing`). The seat/ledger reads are
 * pure reads of `Match` state and ride BOTH shapes.
 */
const walk = (seed: number, arm: ArmKind, measure = true): Row => {
  const m = new Match(matchCfg(seed, arm));
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  const armOk = Object.values(armConjuncts(m, arm)).every(Boolean);
  const mm = m as unknown as {
    forcedTouchPast: { gid: number; dir: { x: number; y: number } } | null;
    cbChoiceLedger: { armings: number; armingsCleared: number; seats: number };
    cbLedger?: { touchPasts?: number; touchPastChallengers?: number; touchPastBeaten?: number };
  };
  const life: Lifecycle = { ...EMPTY_LIFECYCLE };
  life.armedAtConstruction = mm.forcedTouchPast === null ? 0 : 1;

  const row: Row = {
    seed, signature: '', armOk, lifecycle: life, pcLedger: emptyPcLedger(),
    sep: emptySepCensus(),
    armsByCell: zeros(N_CELLS), simpleByCell: zeros(N_CELLS),
    armsByRole: zeros(ROLE_LIST.length), simpleByRole: zeros(ROLE_LIST.length),
    coveredBodyCellsAtN: zeros(N_BAND.length), bookExposuresAtWhistle: 0,
    receptions: 0, receptionsPressed: 0,
    atReceptions: { ...EMPTY_CENSUS }, atPressedReceptions: { ...EMPTY_CENSUS },
    carrierSamples: 0, carrierSamplesPressed: 0, atPressedCarrier: { ...EMPTY_CENSUS },
    behindHist: zeros(HIST_MAX + 1), behindHistPressed: zeros(HIST_MAX + 1),
    attempts: 0, attemptsUnattributed: 0,
    attemptsForwardEngine: 0, attemptsBackwardMine: 0, attemptsLateralMine: 0,
    completed: 0, completedForwardEngine: 0,
    completedBackwardMine: 0, completedLateralMine: 0,
    enginePasses: 0, enginePassesForward: 0, enginePassesCompleted: 0,
    engineTackles: 0, engineInterceptions: 0,
    spells: 0, openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
    terminalAll: emptyTerminals(), terminalOpen: emptyTerminals(),
    pressedEndSpells: 0, pressedEndLost: 0, freeEndSpells: 0, freeEndLost: 0,
    pressedEndByTier: zeros(SEP_TIERS.length), pressedEndLostByTier: zeros(SEP_TIERS.length),
    ticks: 0, inPlayTicks: 0, simSeconds: 0, goals: 0,
  };

  const spells: Spell[] = [];
  const foulTicks: { tick: number; side: Side }[] = [];
  let cur: Spell | null = null;
  let prevOwnerGid: number | null = null;
  let prevScore: [number, number] = [0, 0];
  let inPlayTicks = 0;
  let prevFouls: [number, number] = [0, 0];
  const statKeys = ['passes', 'passesCompleted', 'passesForward', 'tackles', 'interceptions',
    'miscontrols', 'clearances', 'longBalls', 'shots', 'fouls'] as const;
  type StatKey = (typeof statKeys)[number];
  const prev: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of statKeys) prev[k] = [0, 0];
  const delta: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of statKeys) delta[k] = [0, 0];
  const TERMINAL_KEYS = ['tackles', 'interceptions', 'miscontrols', 'clearances', 'longBalls',
    'shots'] as const;
  const termEvents: { tick: number; k: (typeof TERMINAL_KEYS)[number]; side: Side }[] = [];

  const slotOfGid = new Map<number, number>();
  m.allPlayers.forEach((p, i) => slotOfGid.set(p.gid, i));
  const preX = new Float64Array(m.allPlayers.length);
  const capturePositions = (): void => {
    m.allPlayers.forEach((p, i) => { preX[i] = p.pos.x; });
  };
  const xBeforeStep = new Float64Array(m.allPlayers.length);
  capturePositions();

  interface Attempt {
    side: Side; passerGid: number; targetGid: number; t: number;
    forwardEngine: boolean; mine: 'forward' | 'backward' | 'lateral' | 'unknown';
    completed: boolean;
  }
  const attempts: Attempt[] = [];
  const lastAttemptOfSide: [Attempt | null, Attempt | null] = [null, null];
  let prevPendingKey = '';
  let prevCompletedT = -1;

  let prevArmKey = '';
  let armAge = 0;
  let prevLifeOwner: number | null = null;
  let prevLifePhase = m.phase;

  /* --- the PC arm-grain instrument's own carried state --- */
  const lastArmedTick = new Map<number, number>();
  const priorCount = new Map<string, number>();
  /* --- the Δsep camera's own carried state --- */
  let prevKnocks = Number(mm.cbLedger?.touchPasts ?? 0);
  let prevChal = Number(mm.cbLedger?.touchPastChallengers ?? 0);
  let prevBeaten = Number(mm.cbLedger?.touchPastBeaten ?? 0);
  const openSeps: OpenSep[] = [];
  const pendingTier: { t0: number; rows: OpenSep[] }[] = [];

  const newSpell = (side: Side, tick: number, origin: Spell['origin']): Spell => ({
    team: side, startTick: tick, endTick: tick, ownedTicks: 0, touches: 0, origin,
    terminator: 'matchEnd', terminal: 'matchEnd',
    firstReceptionPressed: false, pressedAtEnd: false, tierAtEnd: 'none',
  });
  const finishSpell = (s: Spell, tick: number, terminator: Terminator): void => {
    s.endTick = tick; s.terminator = terminator; spells.push(s);
  };
  const tierOfBody = (gid: number): SepTier => {
    const seat = m.pcLatency;
    if (seat === null) return 'none';
    const h = seat.holdFor(gid, m.simTick);
    return h === null ? 'none' : (h.tier as PcTier);
  };

  while (!m.finished) {
    xBeforeStep.set(preX);
    m.step(DT);
    const tick = m.simTick;
    capturePositions();

    /* --- ⭐⭐ THE ARMING-LIFECYCLE OBSERVATION, at the step boundary (BOTH seats) --- */
    life.ticks += 1;
    {
      const f = mm.forcedTouchPast;
      const key = f === null ? '' : `${f.gid}:${f.dir.x}:${f.dir.y}`;
      const owner0 = m.ball.owner === null ? null : m.ball.owner.gid;
      if (key !== '') {
        life.carryOvers += 1;
        armAge = key === prevArmKey ? armAge + 1 : 1;
        if (armAge > life.maxArmingAgeTicks) life.maxArmingAgeTicks = armAge;
        if (key === prevArmKey && owner0 !== prevLifeOwner) life.carryOverAcrossOwnerChange += 1;
        if (key === prevArmKey && m.phase !== prevLifePhase) life.carryOverAcrossPhaseChange += 1;
      } else armAge = 0;
      prevArmKey = key;
      prevLifeOwner = owner0;
      prevLifePhase = m.phase;
      if (m.pcLatency !== null) {
        life.pcSeatLiveAtStepBoundary += 1;
        life.pcHeldBodiesAtStepBoundary += m.pcLatency.liveHolds;
      }
    }

    /* --- ⭐ THE PC ARM-GRAIN INSTRUMENT, off the seat's own read-only hold snapshot --- */
    if (measure && m.pcLatency !== null) {
      const seat = m.pcLatency;
      for (const { gid, hold } of seat.holdSnapshot()) {
        if (lastArmedTick.get(gid) === hold.armedTick) continue;
        lastArmedTick.set(gid, hold.armedTick);
        const p = m.allPlayers[gid];
        const cell = CELL_IDX[hold.key];
        if (cell === undefined || p === undefined) continue;
        row.armsByCell[cell] += 1;
        row.armsByRole[ROLE_IDX[p.role]] += 1;
        if (hold.tier === 'simple') {
          row.simpleByCell[cell] += 1;
          row.simpleByRole[ROLE_IDX[p.role]] += 1;
        }
        const pk = `${p.side}:${p.rosterIdx}:${cell}`;
        priorCount.set(pk, (priorCount.get(pk) ?? 0) + 1);
      }
    }

    for (const k of statKeys) {
      for (const s of [0, 1] as const) {
        const v = Number((m.teams[s].stats as unknown as Record<string, number>)[k]);
        delta[k][s] = v - prev[k][s];
        prev[k][s] = v;
      }
    }
    for (const k of TERMINAL_KEYS) {
      for (const s of [0, 1] as const) if (delta[k][s] > 0) termEvents.push({ tick, k, side: s });
    }

    /* --- ⭐⭐ THE Δsep CAMERA: open rows at the knock, close them at the window --- */
    if (measure) {
      const touchDelta = Number(mm.cbLedger?.touchPasts ?? 0) - prevKnocks;
      const chalDelta = Number(mm.cbLedger?.touchPastChallengers ?? 0) - prevChal;
      const beatenDelta = Number(mm.cbLedger?.touchPastBeaten ?? 0) - prevBeaten;
      prevKnocks = Number(mm.cbLedger?.touchPasts ?? 0);
      prevChal = Number(mm.cbLedger?.touchPastChallengers ?? 0);
      prevBeaten = Number(mm.cbLedger?.touchPastBeaten ?? 0);
      if (touchDelta > 0) {
        const carrier = m.ball.lastTouch;
        const speed = Math.hypot(m.ball.vel.x, m.ball.vel.y);
        if (carrier !== null && speed > 1e-9) {
          row.sep.knocks += 1;
          const dir = { x: m.ball.vel.x / speed, y: m.ball.vel.y / speed };
          const ballPos = { x: m.ball.pos.x, y: m.ball.pos.y };
          /** ⭐ THE PUSH, INVERTED FROM THE ENGINE'S OWN RECOLLECT WINDOW — CB-T2's derivation
           *  verbatim, and cross-checked against `touchRaceWindow` before it is used. */
          const raceWindow = carrier.kickCooldown;
          const push = (raceWindow - TOUCH_RECOLLECT_BASE) / TOUCH_RECOLLECT_PER_PUSH;
          if (Math.abs(touchRaceWindow(push) - raceWindow) > 1e-9) {
            row.sep.replicaMismatches += 1;
          }
          const opened: OpenSep[] = [];
          let chal = 0; let beat = 0;
          for (const o of m.teams[(1 - carrier.side) as Side].players) {
            if (o.sentOff) continue;
            if (dist(o.pos, ballPos) > CONTEST_RADIUS) continue;
            chal += 1;
            const isBeaten = beatsDefender(ballPos, dir, speed, push, bodyOf(o));
            if (isBeaten) beat += 1;
            if (!isBeaten) continue;
            opened.push({
              t0: tick, carrierGid: carrier.gid, defenderGid: o.gid, tier: 'none',
              sepT0: dist(o.pos, carrier.pos), sepTierWindow: null, deadBall: false,
            });
          }
          row.sep.challengers += chal;
          row.sep.beaten += beat;
          if (chal !== chalDelta || beat !== beatenDelta) row.sep.replicaMismatches += 1;
          if (opened.length > 0) pendingTier.push({ t0: tick, rows: opened });
        }
      }
      /* the tier is read on the tick AFTER t0 — the seat arms for `nowTick + 1 …` */
      for (let i = pendingTier.length - 1; i >= 0; i--) {
        if (tick <= pendingTier[i].t0) continue;
        for (const r of pendingTier[i].rows) {
          r.tier = tierOfBody(r.defenderGid);
          openSeps.push(r);
        }
        pendingTier.splice(i, 1);
      }
      for (let i = openSeps.length - 1; i >= 0; i--) {
        const r = openSeps[i];
        if (m.phase !== 'playing') r.deadBall = true;
        if (tick === r.t0 + SEP_WINDOW_TIER_TICKS) {
          const d = m.allPlayers[r.defenderGid];
          const c = m.allPlayers[r.carrierGid];
          r.sepTierWindow = (d === undefined || c === undefined) ? null : dist(d.pos, c.pos);
        }
        if (tick < r.t0 + SEP_WINDOW_TICKS) continue;
        const ti = SEP_TIERS.indexOf(r.tier);
        const d = m.allPlayers[r.defenderGid];
        const c = m.allPlayers[r.carrierGid];
        if (r.deadBall) row.sep.censoredDeadBall += 1;
        else if (d === undefined || c === undefined || d.sentOff || c.sentOff) {
          row.sep.censoredMissingBody += 1;
        } else {
          const sepEnd = dist(d.pos, c.pos);
          row.sep.nByTier[ti] += 1;
          row.sep.sepT0SumByTier[ti] += r.sepT0;
          row.sep.sepEndSumByTier[ti] += sepEnd;
          row.sep.dSepSumByTier[ti] += sepEnd - r.sepT0;
          row.sep.dSepBins[sepBinOf(sepEnd - r.sepT0)] += 1;
          if (r.sepTierWindow !== null) {
            row.sep.nTierWindowByTier[ti] += 1;
            row.sep.dSepTierWindowSumByTier[ti] += r.sepTierWindow - r.sepT0;
          }
        }
        openSeps.splice(i, 1);
      }
    }

    const pp = m.pendingPass;
    const key = pp === null ? '' : `${pp.side}:${pp.passerGid}:${pp.targetGid}:${pp.t}`;
    const attributedThisTick: [number, number] = [0, 0];
    if (pp !== null && key !== prevPendingKey && delta.passes[pp.side] > 0) {
      const t = m.teams[pp.side];
      const ia = slotOfGid.get(pp.passerGid);
      const ib = slotOfGid.get(pp.targetGid);
      const d = ia !== undefined && ib !== undefined
        ? t.localX(xBeforeStep[ib]) - t.localX(xBeforeStep[ia]) : Number.NaN;
      const mine: Attempt['mine'] = !Number.isFinite(d) ? 'unknown'
        : d > FORWARD_BAND_M ? 'forward' : d < -FORWARD_BAND_M ? 'backward' : 'lateral';
      const at: Attempt = {
        side: pp.side, passerGid: pp.passerGid, targetGid: pp.targetGid, t: m.simTime,
        forwardEngine: delta.passesForward[pp.side] > 0, mine, completed: false,
      };
      attempts.push(at);
      lastAttemptOfSide[pp.side] = at;
      attributedThisTick[pp.side] = 1;
    }
    prevPendingKey = key;
    for (const s of [0, 1] as const) {
      row.attemptsUnattributed += Math.max(0, delta.passes[s] - attributedThisTick[s]);
    }
    const lcp = m.lastCompletedPass;
    if (lcp !== null && lcp.t !== prevCompletedT) {
      prevCompletedT = lcp.t;
      for (const s of [0, 1] as const) {
        const a = lastAttemptOfSide[s];
        if (a === null || a.completed) continue;
        if (a.passerGid !== lcp.passerGid) continue;
        a.completed = true;
      }
    }

    const phase = m.phase;
    const owner = m.ball.owner;
    const ownerGid = owner === null ? null : owner.gid;
    for (const s of [0, 1] as const) {
      const f = m.teams[s].stats.fouls;
      if (f > prevFouls[s]) foulTicks.push({ tick, side: s });
      prevFouls[s] = f;
    }
    const goalThisTick = m.score[0] !== prevScore[0] || m.score[1] !== prevScore[1];
    prevScore = [m.score[0], m.score[1]];
    if (phase !== 'playing') {
      if (cur !== null) { finishSpell(cur, tick, goalThisTick ? 'goal' : 'outOfPlay'); cur = null; }
      prevOwnerGid = null;
      continue;
    }
    inPlayTicks++;
    if (owner === null) { prevOwnerGid = null; continue; }
    const side = owner.side;
    if (cur !== null && cur.team !== side) { finishSpell(cur, tick, 'opponentControl'); cur = null; }
    const isReception = ownerGid !== prevOwnerGid;
    const pressedNow = nearestOpponent(m, owner) <= PRESSURE_R;
    if (cur === null) {
      const origin: Spell['origin'] = m.kickoffKickGid === owner.gid ? 'kickoff'
        : m.restartKickGid === owner.gid ? 'restart' : 'openPlay';
      cur = newSpell(side, tick, origin);
      cur.firstReceptionPressed = pressedNow;
    }
    const spell: Spell = cur;
    spell.ownedTicks++;
    if (isReception) spell.touches++;
    /* ⭐ PRESSING EFFICACY: the LAST owned tick's pressure and the carrier's OWN tier. */
    spell.pressedAtEnd = pressedNow;
    spell.tierAtEnd = tierOfBody(owner.gid);

    if (measure && isReception) {
      const c = censusAt(m, owner);
      row.receptions += 1;
      addCensus(row.atReceptions, c);
      const k = Math.min(HIST_MAX, c.behindUncut);
      row.behindHist[k] += 1;
      if (pressedNow) {
        row.receptionsPressed += 1;
        addCensus(row.atPressedReceptions, c);
        row.behindHistPressed[k] += 1;
      }
    }
    if (measure && !isReception && tick % CARRIER_SAMPLE_TICKS === 0) {
      row.carrierSamples += 1;
      if (pressedNow) {
        row.carrierSamplesPressed += 1;
        addCensus(row.atPressedCarrier, censusAt(m, owner));
      }
    }
    prevOwnerGid = ownerGid;
  }
  if (cur !== null) finishSpell(cur, m.simTick, 'matchEnd');
  row.sep.censoredWhistle += openSeps.length
    + sum(pendingTier.map((g) => g.rows.length));
  life.armedAtWhistle = mm.forcedTouchPast === null ? 0 : 1;
  life.pcSeatLiveAtWhistle = m.pcLatency === null ? 0 : 1;
  life.pcHoldsLiveAtWhistle = m.pcLatency === null ? 0 : m.pcLatency.liveHolds;
  life.armings = mm.cbChoiceLedger.armings;
  life.armingsCleared = mm.cbChoiceLedger.armingsCleared;
  life.seats = mm.cbChoiceLedger.seats;
  life.touchPasts = Number(mm.cbLedger?.touchPasts ?? 0);
  row.pcLedger = readPcLedger(m);
  if (m.pcLatency !== null) {
    row.bookExposuresAtWhistle =
      m.pcLatency.books[0].totalExposures + m.pcLatency.books[1].totalExposures;
    for (const b of m.pcLatency.books) {
      for (const rowB of Object.values(b.snapshot())) {
        for (const v of Object.values(rowB)) {
          N_BAND.forEach((n, ni) => { if (v >= n) row.coveredBodyCellsAtN[ni] += 1; });
        }
      }
    }
  }

  for (const s of spells) {
    if (s.terminator !== 'outOfPlay') continue;
    const f = foulTicks.find((x) => x.tick >= s.endTick - FOUL_LOOKAHEAD_TICKS
      && x.tick <= s.endTick + FOUL_LOOKAHEAD_TICKS);
    if (f === undefined) continue;
    s.terminator = f.side === s.team ? 'foulCommitted' : 'fouledWon';
  }
  const lastInSpell = (
    sp: Spell, wanted: readonly { k: (typeof TERMINAL_KEYS)[number]; side: Side }[],
  ): (typeof TERMINAL_KEYS)[number] | null => {
    let best: { tick: number; k: (typeof TERMINAL_KEYS)[number]; rank: number } | null = null;
    for (const e of termEvents) {
      if (e.tick < sp.startTick || e.tick > sp.endTick) continue;
      const rank = wanted.findIndex((w) => w.k === e.k && w.side === e.side);
      if (rank < 0) continue;
      if (best === null || e.tick > best.tick || (e.tick === best.tick && rank < best.rank)) {
        best = { tick: e.tick, k: e.k, rank };
      }
    }
    return best === null ? null : best.k;
  };
  for (const sp of spells) {
    const own = sp.team;
    const opp = (1 - sp.team) as Side;
    if (sp.terminator === 'goal') sp.terminal = 'goal';
    else if (sp.terminator === 'matchEnd') sp.terminal = 'matchEnd';
    else if (sp.terminator === 'foulCommitted') sp.terminal = 'foulCommitted';
    else if (sp.terminator === 'fouledWon') sp.terminal = 'foulWon';
    else if (sp.terminator === 'opponentControl') {
      const k = lastInSpell(sp, [
        { k: 'tackles', side: opp }, { k: 'interceptions', side: opp },
        { k: 'miscontrols', side: own },
      ]);
      sp.terminal = k === 'tackles' ? 'tackled' : k === 'interceptions' ? 'intercepted'
        : k === 'miscontrols' ? 'badTouch' : 'lostOther';
    } else {
      const k = lastInSpell(sp, [
        { k: 'shots', side: own }, { k: 'clearances', side: own }, { k: 'longBalls', side: own },
      ]);
      sp.terminal = k === 'shots' ? 'shot'
        : (k === 'clearances' || k === 'longBalls') ? 'forcedLong' : 'outOfPlay';
    }
    row.terminalAll[sp.terminal] += 1;
    if (sp.origin !== 'openPlay') continue;
    row.terminalOpen[sp.terminal] += 1;
    /* ⭐⭐ THE PRESSING-EFFICACY CELLS */
    const lost = (LOSS_TERMINALS as readonly string[]).includes(sp.terminal);
    if (sp.pressedAtEnd) {
      row.pressedEndSpells += 1;
      if (lost) row.pressedEndLost += 1;
      const ti = SEP_TIERS.indexOf(sp.tierAtEnd);
      row.pressedEndByTier[ti] += 1;
      if (lost) row.pressedEndLostByTier[ti] += 1;
    } else {
      row.freeEndSpells += 1;
      if (lost) row.freeEndLost += 1;
    }
  }

  row.signature = signature(m);
  row.spells = spells.length;
  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = sum(open.map((s) => s.endTick - s.startTick));
  row.openSpellTouchSum = sum(open.map((s) => s.touches));
  row.attempts = attempts.length;
  row.attemptsForwardEngine = attempts.filter((a) => a.forwardEngine).length;
  row.attemptsBackwardMine = attempts
    .filter((a) => !a.forwardEngine && a.mine === 'backward').length;
  row.attemptsLateralMine = attempts
    .filter((a) => !a.forwardEngine && a.mine !== 'backward').length;
  const done = attempts.filter((a) => a.completed);
  row.completed = done.length;
  row.completedForwardEngine = done.filter((a) => a.forwardEngine).length;
  row.completedBackwardMine = done.filter((a) => !a.forwardEngine && a.mine === 'backward').length;
  row.completedLateralMine = done.filter((a) => !a.forwardEngine && a.mine !== 'backward').length;
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesForward = m.teams[0].stats.passesForward + m.teams[1].stats.passesForward;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  row.engineTackles = m.teams[0].stats.tackles + m.teams[1].stats.tackles;
  row.engineInterceptions = m.teams[0].stats.interceptions + m.teams[1].stats.interceptions;
  row.ticks = m.simTick;
  row.inPlayTicks = inPlayTicks;
  row.simSeconds = m.simTime;
  row.goals = m.teams[0].stats.goals + m.teams[1].stats.goals;
  return row;
};

/* ========================================================================== */
/* §11 ⭐ THE FIXTURE-GRAIN SUPPLY TRAJECTORY (the PC-T1 §DOUBTS 2 named gap)    */
/* ========================================================================== */
/**
 * PC-T1 §DOUBTS 2, verbatim: *"THE SELF-STARVATION CHECK IS AT SEASON GRAIN, AND THE
 * INFORMATIVE GRAIN IS WITHIN-SEASON … the probe stores coverage by fixture but not arms or
 * firings by fixture, so the within-season supply trajectory is not re-derivable from this
 * artifact … Named as a PC-T2 requirement."* And #299 §CORRECTIONS 2 ruled the 14.1 % gap a
 * COLD-BOOK TRANSIENT whose transition curve is not stored.
 *
 * THIS BLOCK STORES IT. A BOOK = a fixed franchise pair walked across ONE season of 7 fixtures
 * with a PERSISTENT born-absent recognition book (the shipped law: reset at the season
 * boundary, and one season is the whole informative horizon). Each fixture is walked TWICE —
 * once armed (the book carried forward) and once on the SAME seed with the door shut — so the
 * armed-vs-base supply gap is readable AT EVERY FIXTURE INDEX, which is exactly the curve the
 * transient lives on. ⚠ It is a SUPPLY instrument: no oracle, no Δsep camera, no football face.
 */
interface TrajFixture {
  book: number; fixture: number; seed: number;
  armed: {
    ticks: number; arms: number; firings: number; simpleArms: number;
    coveredBodyCellsAtN: number[]; heldExecutorTicks: number;
  };
  base: { ticks: number };
  /** the ENGINE's own event supply on both arms — the commensurable "surprise supply" proxy. */
  armedEvents: number;
  baseEvents: number;
  armOk: boolean;
}
/** the engine-side event supply: the counters a surprise class is derived from. */
const eventSupplyOf = (m: Match): number => {
  const s = (i: 0 | 1): Record<string, number> =>
    m.teams[i].stats as unknown as Record<string, number>;
  const k = ['passes', 'shots', 'tackles', 'interceptions', 'miscontrols', 'clearances'];
  return sum(k.map((q) => Number(s(0)[q] ?? 0) + Number(s(1)[q] ?? 0)));
};
const trajTeams = (book: number): [TeamInfo, TeamInfo] => [
  team('A', TRAJ_BASE + book * 100 + 1),
  team('B', TRAJ_BASE + book * 100 + 2),
];
const TRAJ_BOOKS = MODE === 'smoke' ? 2 : TRAJ_BOOKS_FULL;
const runTrajectory = (): TrajFixture[] => {
  const out: TrajFixture[] = [];
  for (let book = 0; book < TRAJ_BOOKS; book++) {
    const teams = trajTeams(book);
    const books = emptyBooks();
    for (let fixture = 0; fixture < FIXTURES_PER_SEASON; fixture++) {
      const seed = TRAJ_BASE + book * FIXTURES_PER_SEASON + fixture;
      const armedM = new Match({
        seed, teamA: teams[0], teamB: teams[1], ...a4MatchFlags(L3_WORLD_VERSION),
        pcReactionLatency: true, pcRecognitionBooks: books,
      });
      armA4World(armedM, null, L3_WORLD_VERSION, L3_DOSE);
      const armOk = armedM.pcLatency !== null
        && l3ArmedVersion(armedM) === L3_WORLD_VERSION
        && a4ArmedVersion(armedM) === L3_WORLD_VERSION;
      let ticks = 0;
      while (!armedM.finished) { armedM.step(DT); ticks++; }
      const led = readPcLedger(armedM);
      const covered = zeros(N_BAND.length);
      for (const b of books) {
        for (const rowB of Object.values(b.snapshot())) {
          for (const v of Object.values(rowB)) {
            N_BAND.forEach((n, ni) => { if (v >= n) covered[ni] += 1; });
          }
        }
      }
      const baseM = new Match({
        seed, teamA: teams[0], teamB: teams[1], ...a4MatchFlags(L3_WORLD_VERSION),
      });
      armA4World(baseM, null, L3_WORLD_VERSION, L3_DOSE);
      let baseTicks = 0;
      while (!baseM.finished) { baseM.step(DT); baseTicks++; }
      out.push({
        book, fixture, seed,
        armed: {
          ticks, arms: led.arms, firings: led.firings, simpleArms: led.armsSimple,
          coveredBodyCellsAtN: covered, heldExecutorTicks: led.heldExecutorTicks,
        },
        base: { ticks: baseTicks },
        armedEvents: eventSupplyOf(armedM),
        baseEvents: eventSupplyOf(baseM),
        armOk: armOk && baseM.pcLatency === null,
      });
    }
  }
  return out;
};

/* ========================================================================== */
/* §12 THE BATTERY                                                             */
/* ========================================================================== */
const N_RUN = N_ENV ?? (MODE === 'smoke' ? 4 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' && N_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

interface Battery { rows: Record<ArmKind, Row[]>; traj: TrajFixture[] }
const runBattery = (): Battery => {
  const rows: Record<ArmKind, Row[]> = { v7: [], v7pcEmpty: [], v7pcMatured: [] };
  for (const arm of ARMS) {
    for (let i = 0; i < N_RUN; i++) rows[arm].push(walk(BASE_RUN + i, arm));
    banner(`  [pc-t2] ${arm} — ${N_RUN} walks done`);
  }
  const traj = runTrajectory();
  banner(`  [pc-t2] trajectory — ${traj.length} fixtures × 2 arms done`);
  return { rows, traj };
};

/* ========================================================================== */
/* §13 THE FACES — every one a RATIO OF SUMS over the stored per-seed rows      */
/* ========================================================================== */
type Face = {
  num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string;
  /** declared ARM-STRUCTURAL: its denominator is 0 on the base arm BY CONSTRUCTION. */
  armStructural?: boolean;
};
const perMatch = (): number => 1;
const outfield = (
  c: OptionCensus, k: 'behind' | 'behindFlight' | 'behindRace' | 'behindUncut',
): number => {
  const gk = k === 'behind' ? c.behindGk : k === 'behindFlight' ? c.behindFlightGk
    : k === 'behindRace' ? c.behindRaceGk : c.behindUncutGk;
  return c[k] - gk;
};
const TI = { none: 0, simple: 1, choice: 2 } as const;

const FACES: Record<string, Face> = {
  /* ==== ⭐⭐ H-PC.1 (a) — TIER DIFFERENTIATION BY COVERAGE, at CELL grain ==== */
  simpleTierShare: {
    num: (r) => r.pcLedger.armsSimple, den: (r) => r.pcLedger.arms,
    unit: 'share of arms', armStructural: true,
    what: '⭐⭐ H-PC.1 (a) THE POOLED TIER SPLIT — the share of surprises paid at the SHORT '
      + 'tier. Born-absent books pay it almost never; a matured book pays it wherever the cell '
      + 'is covered. 0/0 on the base arm BY CONSTRUCTION (no seat exists).',
  },
  choiceTierShare: {
    num: (r) => r.pcLedger.armsChoice, den: (r) => r.pcLedger.arms,
    unit: 'share of arms', armStructural: true,
    what: 'the complement — the share paid at the LONG tier.',
  },
  armsPerMatch: {
    num: (r) => r.pcLedger.arms, den: perMatch, unit: 'arms / match', armStructural: true,
    what: '⭐ ARMING RECEIPTS, NOT FOOTBALL FINDINGS (#289 item 1) — the surprise supply.',
  },
  firingsPerMatch: {
    num: (r) => r.pcLedger.firings, den: perMatch, unit: 'firings / match', armStructural: true,
    what: 'the detector\'s own event count per match. A receipt.',
  },
  heldExecutorTicksPerMatch: {
    num: (r) => r.pcLedger.heldExecutorTicks, den: perMatch,
    unit: 'held executor ticks / match', armStructural: true,
    what: '⭐ APPLIED TICKS a body spent running a stale plan. A receipt, never an effect size.',
  },
  decisionsHeldPerMatch: {
    num: (r) => r.pcLedger.decisionsHeld, den: perMatch,
    unit: 'suppressed decision slots / match', armStructural: true,
    what: 'decision slots the AND-gate refused to open. A receipt.',
  },
  coveredBodyCellsAtShippedNPerMatch: {
    num: (r) => r.coveredBodyCellsAtN[1], den: perMatch,
    unit: 'covered body-cells / match', armStructural: true,
    what: `⭐ COVERAGE AT THE WHISTLE, at the shipped N = ${PC_N_COVER}. The EMPTY arm reads a `
      + 'single match\'s own learning; the MATURED arm reads the dose plus the match.',
  },
  /* ==== ⭐⭐ H-PC.1 (b) — THE CARRIER-ANCHORED INFORMATION GAP ==== */
  deltaSepAtTouchPastMetres: {
    num: (r) => sum(r.sep.dSepSumByTier), den: (r) => sum(r.sep.nByTier),
    unit: 'metres (+ = the beaten defender falls further behind)',
    what: '⭐⭐ H-PC.1 (b) THE SCORED FACE — the CARRIER-ANCHORED Δsep of the BEATEN defender '
      + `over the APPLIED window (${SEP_WINDOW_TICKS} ticks = `
      + `${round(SEP_WINDOW_TICKS * DT, 4)} sim-s), measured defender→CARRIER at BOTH ends `
      + '(#266.2(i)\'s instrument, home CB-C0 §RATIFIED). 过人终于买到时间 iff this GROWS.',
  },
  sepAtTouchPastT0Metres: {
    num: (r) => sum(r.sep.sepT0SumByTier), den: (r) => sum(r.sep.nByTier),
    unit: 'metres',
    what: 'the LEVEL at t0 — the beaten defender\'s carrier-anchored separation at the knock. '
      + 'Published so the Δ is read against a stated starting gap, not in the air.',
  },
  sepAtTouchPastEndMetres: {
    num: (r) => sum(r.sep.sepEndSumByTier), den: (r) => sum(r.sep.nByTier),
    unit: 'metres', what: 'the LEVEL at the window\'s end.',
  },
  deltaSepAtChoiceTierWindowMetres: {
    num: (r) => sum(r.sep.dSepTierWindowSumByTier), den: (r) => sum(r.sep.nTierWindowByTier),
    unit: 'metres',
    what: `⭐ THE SECOND WINDOW — Δsep at the CHOICE tier's own length (${SEP_WINDOW_TIER_TICKS} `
      + 'applied ticks). If the tier is what buys the gap, this is where it should be widest.',
  },
  ...Object.fromEntries((['simple', 'choice'] as const).map((t) => [
    `deltaSepMetresWhenTheBeatenDefenderPays_${t}`, {
      num: (r: Row) => r.sep.dSepSumByTier[TI[t]], den: (r: Row) => r.sep.nByTier[TI[t]],
      unit: 'metres', armStructural: true,
      what: `⭐⭐ THE FOOTBALL SENTENCE, BY THE VICTIM'S OWN TIER — Δsep when the beaten `
        + `defender was paying the ${t.toUpperCase()} tier, read from the SEAT'S OWN hold on `
        + 'the tick after the knock. A SIMPLE-tier defender should concede LESS than a '
        + 'CHOICE-tier one. Structurally empty on the base arm (there is no seat).',
    }])) as Record<string, Face>,
  deltaSepMetresWhenTheBeatenDefenderPays_none: {
    num: (r) => r.sep.dSepSumByTier[TI.none], den: (r) => r.sep.nByTier[TI.none],
    unit: 'metres', armStructural: true,
    what: 'the UNHELD population — every base-arm row lands here, and so does any armed row '
      + 'whose beaten defender was outside the 25 m relevance radius or was the initiator.',
  },
  beatenSharePerKnock: {
    num: (r) => r.sep.beaten, den: (r) => r.sep.knocks, unit: 'beaten defenders / knock',
    what: 'the knock population\'s own shape — how many challengers the geometry beat.',
  },
  knocksPerMatch: {
    num: (r) => r.sep.knocks, den: perMatch, unit: 'knocks / match',
    what: '⚠ MOVING DENOMINATOR DISCLOSED: the Δsep faces are conditioned on knocks happening, '
      + 'and the knock rate itself may move between arms. This row is how you see that.',
  },
  /* ==== H-PC.2 — THE DISEASE FACES AT SIM GRAIN (REPORTED, NEVER GATED) ==== */
  passCompletionRate: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share', what: '⭐ Q06 — the ENGINE\'s own completion rate. PRE-REGISTERED: UP.',
  },
  ...Object.fromEntries(TERMINALS.map((t) => [`terminal_${t}`, {
    num: (r: Row) => r.terminalOpen[t], den: (r: Row) => r.openSpells,
    unit: 'share of open-play spells',
    what: `THE TERMINAL CENSUS — open-play spells ending in: ${t}. ⚠ L3-VETO ENTANGLED AT THE `
      + 'LEVEL (BU-C0 §COMMANDER CORRECTIONS item 3); the CONTRAST is entanglement-free '
      + 'because every arm carries the veto.',
  }])) as Record<string, Face>,
  lossToOpponentShare: {
    num: (r) => sum(LOSS_TERMINALS.map((t) => r.terminalOpen[t])), den: (r) => r.openSpells,
    unit: 'share of open-play spells',
    what: '⭐ TOTAL LOSS TO AN OPPONENT — the honest cross-arm aggregate (BU-C0 §CORRECTIONS 3).',
  },
  interceptionsPerMatch: {
    num: (r) => r.engineInterceptions, den: perMatch, unit: 'interceptions / match',
    what: '⭐ the ENGINE\'s own interception counter. PRE-REGISTERED: DOWN at sim grain.',
  },
  tacklesPerMatch: {
    num: (r) => r.engineTackles, den: perMatch, unit: 'tackles / match',
    what: 'the engine\'s own tackle counter (context for the veto entanglement).',
  },
  /* ---- the BU census supply faces, GK-SPLIT ---- */
  behindBallOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncut, den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐⭐ THE SUPPLY HEADLINE — behind-the-ball team-mates the ENGINE\'S OWN machinery '
      + 'calls a live option (L1 ∧ L2 ∧ L3 ∧ L4), per reception. BU-C0\'s frozen definition. '
      + '⚠ THE PRICED CORRIDOR IS EXPECTED TO STAND STILL (contract §4): the oracle is '
      + 'full-truth and cannot see a defender\'s processing time.',
  },
  outfieldBehindBallOptionsPerReception: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'), den: (r) => r.receptions,
    unit: 'options / reception',
    what: '⭐ the SAME with the keeper removed — BU-C0 §CORRECTIONS 1\'s GK-SPLIT debt.',
  },
  gkBehindBallOptionsPerReception: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.receptions,
    unit: 'options / reception', what: 'the keeper ball, split out.',
  },
  behindBallOptionsPerPressedReception: {
    num: (r) => r.atPressedReceptions.behindUncut, den: (r) => r.receptionsPressed,
    unit: 'options / pressed reception',
    what: '⭐ PRESSED-RECEPTION SUPPLY (the #288.3 hypothesis face, carried for '
      + 'commensurability with BU-T0b / BU-T1 / PW-T1).',
  },
  behindBallOptionsPerPressedCarrierMoment: {
    num: (r) => r.atPressedCarrier.behindUncut, den: (r) => r.carrierSamplesPressed,
    unit: 'options / pressed-carrier moment',
    what: `the same count at PRESSED-CARRIER moments (sampled every ${CARRIER_SAMPLE_TICKS} ticks)`,
  },
  shareReceptionsWithNoBehindOption: {
    num: (r) => r.behindHist[0], den: (r) => r.receptions,
    unit: 'share of receptions',
    what: '⭐ ZERO-OPTION SHARE — receptions offering no behind-ball option at all '
      + '(BU-C0 measured 43.73 %).',
  },
  shareReceptionsWithTwoOrMore: {
    num: (r) => r.receptions - r.behindHist[0] - r.behindHist[1], den: (r) => r.receptions,
    unit: 'share of receptions', what: 'the #246 BAND — receptions offering 2 or more.',
  },
  outfieldCorridorSurvivalRate: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'),
    den: (r) => outfield(r.atReceptions, 'behindRace'),
    unit: 'share of race-winning outfield options',
    what: 'the corridor rung\'s bite, outfield. ⚠ MOVING DENOMINATOR (the L3 race-winner set).',
  },
  outfieldEndToEndConversion: {
    num: (r) => outfield(r.atReceptions, 'behindUncut'), den: (r) => outfield(r.atReceptions, 'behind'),
    unit: 'share of outfield behind-ball bodies',
    what: '⭐ THE DENOMINATOR-STABLE FACE (PW-C0 §CORRECTIONS 2): outfield backward END-TO-END '
      + 'conversion L4/L1 — L1 is instrument-independent, so the pairing is clean.',
  },
  keeperShareOfSurvivingOptions: {
    num: (r) => r.atReceptions.behindUncutGk, den: (r) => r.atReceptions.behindUncut,
    unit: 'share of surviving behind-ball options',
    what: 'the KEEPER SHARE (BU-C0 54.20 % armed; BU-T0 replicated 53.89 %).',
  },
  receptionsPerMatch: {
    num: (r) => r.receptions, den: perMatch, unit: 'receptions / match', what: 'context',
  },
  /* ---- R-乙 ---- */
  spellMeanSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds', what: '⭐ Q01 — the mean open-play spell duration (REPORTED).',
  },
  touchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches / spell', what: '⭐ Q05 (REPORTED).',
  },
  pressedReceptionShare: {
    num: (r) => r.receptionsPressed, den: (r) => r.receptions,
    unit: 'share of receptions',
    what: '⭐ Q14-shaped (REPORTED) — ⚠ ALL receptions, NOT Q14\'s first-of-spell population.',
  },
  openSpellsPerMatch: {
    num: (r) => r.openSpells, den: perMatch, unit: 'open-play spells / match', what: 'context',
  },
  goalsPerMatch: {
    num: (r) => r.goals, den: perMatch, unit: 'goals / match', what: '⭐ goals/match (REPORTED)',
  },
  forwardShareOfAttempts: {
    num: (r) => r.attemptsForwardEngine, den: (r) => r.attempts,
    unit: 'share of pass attempts', what: 'Q07 VERBATIM — the ENGINE\'S OWN forward counter.',
  },
  circulationShareOfCompletions: {
    num: (r) => r.completedBackwardMine + r.completedLateralMine, den: (r) => r.completed,
    unit: 'share of completed passes',
    what: '⭐ BACKWARD + LATERAL together — the circulation ball (⭐ 大力穿缝-ADJACENT CONTEXT: '
      + 'this is the lane a bought half-second is supposed to open).',
  },
  /* ---- ⭐⭐ PRESSING EFFICACY — the doctrine's time-budget attack ---- */
  pressedEndLossShare: {
    num: (r) => r.pressedEndLost, den: (r) => r.pressedEndSpells,
    unit: 'share of pressed-ended open-play spells',
    what: '⭐⭐ PRESSING EFFICACY, the numerator half — open-play spells whose carrier was '
      + `PRESSED (an opponent inside ${PRESSURE_R} m) on his LAST owned tick, and which ended `
      + 'in a loss to an opponent. The doctrine predicts pressing becomes a TIME-BUDGET '
      + 'ATTACK: a pressed carrier who must RE-plan pays his tier while the pressure arrives.',
  },
  freeEndLossShare: {
    num: (r) => r.freeEndLost, den: (r) => r.freeEndSpells,
    unit: 'share of free-ended open-play spells',
    what: 'the CONTRAST half — the same rate when the carrier was NOT pressed at the end.',
  },
  pressedEndShareOfOpenSpells: {
    num: (r) => r.pressedEndSpells, den: (r) => r.openSpells,
    unit: 'share of open-play spells',
    what: '⚠ THE MOVING DENOMINATOR OF THE PRESSING FACES, published: how much of the world '
      + 'ends its spells under pressure at all.',
  },
  ...Object.fromEntries((['simple', 'choice'] as const).map((t) => [
    `pressedEndLossShareWhenTheVictimPays_${t}`, {
      num: (r: Row) => r.pressedEndLostByTier[TI[t]],
      den: (r: Row) => r.pressedEndByTier[TI[t]],
      unit: 'share of pressed-ended spells at this tier', armStructural: true,
      what: `⭐⭐ PRESSING DIFFERENTIATES BY THE VICTIM'S TIER — the pressed-loss rate when the `
        + `carrier was himself paying the ${t.toUpperCase()} tier at the moment he lost it. `
        + 'Structurally empty on the base arm.',
    }])) as Record<string, Face>,
  pressedEndLossShareWhenTheVictimIsFree: {
    num: (r) => r.pressedEndLostByTier[TI.none], den: (r) => r.pressedEndByTier[TI.none],
    unit: 'share of pressed-ended spells with a free carrier',
    what: 'the unheld comparison population — every base-arm spell is here.',
  },
};
const FACE_KEYS = Object.keys(FACES);
const ARM_STRUCTURAL_FACES = FACE_KEYS.filter((k) => FACES[k].armStructural === true);

/* ---- the estimator: PAIRED CLUSTER BOOTSTRAP over match seeds ---- */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
interface FaceRow {
  face: string; unit: string; what: string;
  arms: Record<string, { point: number; num: number; den: number; ci95: [number, number] }>;
  contrasts: Record<string, { delta: number; ci95: [number, number]; relative: number }>;
}
const pct = (vals: number[]): [number, number] => {
  const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
  return s.length === 0 ? [Number.NaN, Number.NaN]
    : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]];
};
const scoreFaces = (b: Battery): FaceRow[] => {
  const K = b.rows[REF_ARM].length;
  resetStats();
  const draws: number[][] = [];
  for (let d = 0; d < BOOTSTRAP; d++) {
    const idx: number[] = [];
    for (let i = 0; i < K; i++) idx.push(Math.floor(statsRng.next() * K) % K);
    draws.push(idx);
  }
  const out: FaceRow[] = [];
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nums: Record<string, number[]> = {};
    const dens: Record<string, number[]> = {};
    for (const arm of ARMS) {
      nums[arm] = b.rows[arm].map((r) => f.num(r));
      dens[arm] = b.rows[arm].map((r) => f.den(r));
    }
    const arms: FaceRow['arms'] = {};
    const point: Record<string, number> = {};
    for (const arm of ARMS) {
      const n = sum(nums[arm]); const d = sum(dens[arm]);
      point[arm] = ratio(n, d);
      const vals: number[] = [];
      for (const idx of draws) {
        let nn = 0; let dd = 0;
        for (const i of idx) { nn += nums[arm][i]; dd += dens[arm][i]; }
        vals.push(ratio(nn, dd));
      }
      arms[arm] = { point: point[arm], num: n, den: d, ci95: d === 0
        ? [Number.NaN, Number.NaN] : pct(vals) };
    }
    /** ⭐ PAIRED: ONE resample-index matrix draws EVERY arm, so a contrast and its two levels
     *  are always the SAME resampled worlds and the pairing is inside the interval. */
    const contrasts: FaceRow['contrasts'] = {};
    for (const arm of PC_ARMS) {
      const vals: number[] = [];
      for (const idx of draws) {
        let nA = 0; let dA = 0; let nB = 0; let dB = 0;
        for (const i of idx) {
          nA += nums[arm][i]; dA += dens[arm][i];
          nB += nums[REF_ARM][i]; dB += dens[REF_ARM][i];
        }
        vals.push(ratio(nA, dA) - ratio(nB, dB));
      }
      const delta = point[arm] - point[REF_ARM];
      contrasts[arm] = {
        delta, ci95: pct(vals),
        relative: point[REF_ARM] === 0 ? Number.NaN : delta / point[REF_ARM],
      };
    }
    /** the MATURED-vs-EMPTY contrast: the arm-structural faces have no base-arm level at all,
     *  so their only honest comparison is the two PC arms against each other. */
    {
      const vals: number[] = [];
      for (const idx of draws) {
        let nA = 0; let dA = 0; let nB = 0; let dB = 0;
        for (const i of idx) {
          nA += nums.v7pcMatured[i]; dA += dens.v7pcMatured[i];
          nB += nums.v7pcEmpty[i]; dB += dens.v7pcEmpty[i];
        }
        vals.push(ratio(nA, dA) - ratio(nB, dB));
      }
      const delta = point.v7pcMatured - point.v7pcEmpty;
      contrasts.maturedVsEmpty = {
        delta, ci95: pct(vals),
        relative: point.v7pcEmpty === 0 ? Number.NaN : delta / point.v7pcEmpty,
      };
    }
    out.push({ face: key, unit: f.unit, what: f.what, arms, contrasts });
  }
  return out;
};

/* ========================================================================== */
/* §14 THE DETERMINISTIC CORE (G-DET runs it twice)                            */
/* ========================================================================== */
interface Core { battery: Battery; faces: FaceRow[] }
const runCore = (): Core => {
  const battery = runBattery();
  return { battery, faces: scoreFaces(battery) };
};
const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, sig: r.signature, armOk: r.armOk, life: r.lifecycle, pc: r.pcLedger,
  sep: r.sep,
  armsByCell: r.armsByCell, simpleByCell: r.simpleByCell,
  armsByRole: r.armsByRole, simpleByRole: r.simpleByRole,
  coveredAtN: r.coveredBodyCellsAtN, bookExp: r.bookExposuresAtWhistle,
  rec: r.receptions, recP: r.receptionsPressed,
  atRec: r.atReceptions, atRecP: r.atPressedReceptions, atCar: r.atPressedCarrier,
  carS: r.carrierSamples, carSP: r.carrierSamplesPressed,
  hist: r.behindHist, histP: r.behindHistPressed,
  att: r.attempts, attU: r.attemptsUnattributed, attFE: r.attemptsForwardEngine,
  attBM: r.attemptsBackwardMine, attLM: r.attemptsLateralMine,
  cmp: r.completed, cmpF: r.completedForwardEngine, cmpB: r.completedBackwardMine,
  cmpL: r.completedLateralMine,
  eP: r.enginePasses, ePF: r.enginePassesForward, ePC: r.enginePassesCompleted,
  eTk: r.engineTackles, eIn: r.engineInterceptions,
  spells: r.spells, openSpells: r.openSpells, openTicks: r.openSpellTickSum,
  openTouches: r.openSpellTouchSum,
  termAll: r.terminalAll, termOpen: r.terminalOpen,
  presEndN: r.pressedEndSpells, presEndL: r.pressedEndLost,
  freeEndN: r.freeEndSpells, freeEndL: r.freeEndLost,
  presEndByTier: r.pressedEndByTier, presEndLostByTier: r.pressedEndLostByTier,
  ticks: r.ticks, inPlay: r.inPlayTicks, simS: r.simSeconds, goals: r.goals,
});
const rowFromCell = (c: Record<string, unknown>): Row => ({
  seed: Number(c.seed), signature: String(c.sig), armOk: Boolean(c.armOk),
  lifecycle: c.life as Lifecycle, pcLedger: c.pc as PcLedgerRow, sep: c.sep as SepCensus,
  armsByCell: c.armsByCell as number[], simpleByCell: c.simpleByCell as number[],
  armsByRole: c.armsByRole as number[], simpleByRole: c.simpleByRole as number[],
  coveredBodyCellsAtN: c.coveredAtN as number[], bookExposuresAtWhistle: Number(c.bookExp),
  receptions: Number(c.rec), receptionsPressed: Number(c.recP),
  atReceptions: c.atRec as OptionCensus, atPressedReceptions: c.atRecP as OptionCensus,
  atPressedCarrier: c.atCar as OptionCensus,
  carrierSamples: Number(c.carS), carrierSamplesPressed: Number(c.carSP),
  behindHist: c.hist as number[], behindHistPressed: c.histP as number[],
  attempts: Number(c.att), attemptsUnattributed: Number(c.attU),
  attemptsForwardEngine: Number(c.attFE), attemptsBackwardMine: Number(c.attBM),
  attemptsLateralMine: Number(c.attLM),
  completed: Number(c.cmp), completedForwardEngine: Number(c.cmpF),
  completedBackwardMine: Number(c.cmpB), completedLateralMine: Number(c.cmpL),
  enginePasses: Number(c.eP), enginePassesForward: Number(c.ePF),
  enginePassesCompleted: Number(c.ePC),
  engineTackles: Number(c.eTk), engineInterceptions: Number(c.eIn),
  spells: Number(c.spells), openSpells: Number(c.openSpells),
  openSpellTickSum: Number(c.openTicks), openSpellTouchSum: Number(c.openTouches),
  terminalAll: c.termAll as Record<TerminalClass, number>,
  terminalOpen: c.termOpen as Record<TerminalClass, number>,
  pressedEndSpells: Number(c.presEndN), pressedEndLost: Number(c.presEndL),
  freeEndSpells: Number(c.freeEndN), freeEndLost: Number(c.freeEndL),
  pressedEndByTier: c.presEndByTier as number[],
  pressedEndLostByTier: c.presEndLostByTier as number[],
  ticks: Number(c.ticks), inPlayTicks: Number(c.inPlay), simSeconds: Number(c.simS),
  goals: Number(c.goals),
});
const trajCellOf = (t: TrajFixture): Record<string, unknown> => ({
  book: t.book, fixture: t.fixture, seed: t.seed, armOk: t.armOk,
  armedAppliedTicks: t.armed.ticks, armedArms: t.armed.arms, armedFirings: t.armed.firings,
  armedSimpleArms: t.armed.simpleArms, armedHeldExecutorTicks: t.armed.heldExecutorTicks,
  armedCoveredBodyCellsAtN: t.armed.coveredBodyCellsAtN,
  baseAppliedTicks: t.base.ticks,
  armedEngineEvents: t.armedEvents, baseEngineEvents: t.baseEvents,
});
const coreDigest = (c: Core): string => sha(canonical({
  faces: c.faces,
  rows: Object.fromEntries(ARMS.map((a) => [a, c.battery.rows[a].map(cellOf)])),
  traj: c.battery.traj.map(trajCellOf),
}));

banner(`  [pc-t2] ⭐ THE BATTERY: mode=${MODE} N=${N_RUN} seeds × ${ARMS.length} arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [pc-t2] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;

/* ---- the NON-PERTURBATION control: the same worlds, every instrument OFF ---- */
const perturbCheck = (() => {
  let ok = 0; let total = 0;
  const n = Math.min(PERTURB_CHECK_SEEDS, N_RUN);
  for (const arm of ARMS) {
    for (let i = 0; i < n; i++) {
      const quiet = walk(BASE_RUN + i, arm, false);
      total += 1;
      if (quiet.signature === C.battery.rows[arm][i].signature
        && quiet.spells === C.battery.rows[arm][i].spells
        && quiet.enginePasses === C.battery.rows[arm][i].enginePasses
        && quiet.pcLedger.arms === C.battery.rows[arm][i].pcLedger.arms) ok += 1;
    }
  }
  return { ok, total };
})();

/* ========================================================================== */
/* §15 THE READINGS THE GATES SCORE                                            */
/* ========================================================================== */
const rowsOf = (a: ArmKind): Row[] => C.battery.rows[a];
const allRows = (): Row[] => ARMS.flatMap(rowsOf);
const armOkCount = allRows().filter((r) => r.armOk).length;
const armTotal = allRows().length;
const armProbes = Object.fromEntries(ARMS.map((a) => {
  const m = new Match(matchCfg(GWORLD_SEED, a));
  armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
  return [a, m];
})) as Record<ArmKind, Match>;
const worldSeedOk = ARMS.every((a) => l3ArmedVersion(armProbes[a]) === L3_WORLD_VERSION
  && a4ArmedVersion(armProbes[a]) === L3_WORLD_VERSION)
  && armProbes.v7.pcLatency === null
  && armProbes.v7pcEmpty.pcLatency !== null && armProbes.v7pcMatured.pcLatency !== null;
const armsSeparate = (() => {
  const sigs = ARMS.map((a) => {
    const m = new Match(matchCfg(GWORLD_SEED, a));
    armA4World(m, null, L3_WORLD_VERSION, L3_DOSE);
    for (let i = 0; i < 900 && !m.finished; i++) m.step(DT);
    return signature(m);
  });
  return new Set(sigs).size === ARMS.length;
})();

const batteryLifecycle = (() => {
  const total: Lifecycle = { ...EMPTY_LIFECYCLE };
  for (const r of allRows()) addLifecycle(total, r.lifecycle);
  return total;
})();
const pcLedgerByArm = Object.fromEntries(ARMS.map((a) => {
  const acc = emptyPcLedger();
  for (const r of rowsOf(a)) addPcLedger(acc, r.pcLedger);
  return [a, acc];
})) as Record<ArmKind, PcLedgerRow>;
const sepByArm = Object.fromEntries(ARMS.map((a) => {
  const acc = emptySepCensus();
  for (const r of rowsOf(a)) addSepCensus(acc, r.sep);
  return [a, acc];
})) as Record<ArmKind, SepCensus>;
const cellArmsByArm = Object.fromEntries(ARMS.map((a) => {
  const arms = zeros(N_CELLS); const simple = zeros(N_CELLS);
  for (const r of rowsOf(a)) {
    for (let i = 0; i < N_CELLS; i++) { arms[i] += r.armsByCell[i]; simple[i] += r.simpleByCell[i]; }
  }
  return [a, { arms, simple }];
})) as Record<ArmKind, { arms: number[]; simple: number[] }>;

/** the three conservation identities of the seat, per PC arm. */
const conservation = Object.fromEntries(PC_ARMS.map((a) => {
  const l = pcLedgerByArm[a];
  const cellArms = sum(cellArmsByArm[a].arms);
  return [a, {
    arms: l.arms,
    exposuresNoted: l.exposuresNoted,
    armedWithMemory: l.armedWithMemory,
    tiersAccountForEveryArm: l.armsSimple + l.armsChoice === l.arms,
    oneExposurePerArm: l.exposuresNoted === l.arms,
    aLiveStalePlanPerArm: l.armedWithMemory === l.arms,
    /** ⚠ the arm-grain camera can only see an arm whose hold is still alive at a step
     *  boundary; a hold superseded within the same tick is invisible to it. Published, and
     *  the identity it must satisfy is a BOUND, not an equality. */
    cellCameraArms: cellArms,
    theCameraNeverSeesMoreArmsThanTheSeatWrote: cellArms <= l.arms,
    theCameraSawMostOfThem: cellArms > 0 && cellArms >= l.arms * 0.5,
  }];
})) as Record<string, {
  arms: number; exposuresNoted: number; armedWithMemory: number;
  tiersAccountForEveryArm: boolean; oneExposurePerArm: boolean; aLiveStalePlanPerArm: boolean;
  cellCameraArms: number; theCameraNeverSeesMoreArmsThanTheSeatWrote: boolean;
  theCameraSawMostOfThem: boolean;
}>;

/* ---- ⭐ #288's CANON, MACHINE-APPLIED: every face carries |Δ| ÷ its own half-width ---- */
const ratioToHalfWidth = (delta: number, ci: readonly [number, number]): number => {
  const hw = (ci[1] - ci[0]) / 2;
  return hw === 0 || !Number.isFinite(hw) ? Number.NaN : Math.abs(delta) / hw;
};
const faceOf = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const resolvedPositive = (ci: readonly [number, number]): boolean => ci[0] > 0 && ci[1] > 0;
const resolvedNegative = (ci: readonly [number, number]): boolean => ci[0] < 0 && ci[1] < 0;

/* ========================================================================== */
/* §16 ⭐⭐ H-PC.1 — THE SCORED CLAIM, ON A PRE-REGISTERED RULE                  */
/* ========================================================================== */
/**
 * ⭐ THE RULE IS FROZEN HERE, ABOVE THE NUMBERS, AND NO GATE READS IT (contract §1; the gates
 * prove the instrument, the score is a reading of the football).
 *
 *   (a) TIER DIFFERENTIATION BY COVERAGE on the armed MATURED world, at CELL grain:
 *       (i)  the matured arm's pooled SIMPLE share is RESOLVEDLY ABOVE the empty arm's
 *            (paired CI excludes zero), AND
 *       (ii) at cell grain the world separates: covered cells pay SIMPLE and uncovered cells
 *            pay CHOICE. The face is the SIMPLE share among arms in cells whose dose is
 *            ≥ N_cover versus among arms in cells whose dose is < N_cover, in the MATURED
 *            arm, with a paired-by-seed CI on the DIFFERENCE.
 *       ⭐ THE MAX−MIN LIMB IS A NOISE-FLOOR COMPARISON, NEVER A ZERO-NULL CI — canon,
 *          home PC-T1-LEARNING-EXAM.md §COMMANDER CORRECTIONS item 3: *"a max−min face
 *          reports a noise-floor comparison, not a zero-null CI"*. The noise floor is the
 *          SAME statistic computed on the BASE-arm-shaped null (the empty arm's own covered
 *          /uncovered split, where the dose does not exist), and it is published beside it.
 *   (b) THE CARRIER-ANCHORED INFORMATION GAP AT THE TOUCH-PAST TURNS POSITIVE:
 *       Δsep(matured) − Δsep(base) is RESOLVEDLY POSITIVE on the paired CI.
 *
 * BOTH conjuncts must hold for POSITIVE; either failing = NEGATIVE with the mechanism account.
 */
const H_PC1_RULE = {
  a: '(a) the matured arm\'s pooled SIMPLE share is resolvedly above the empty arm\'s, AND at '
    + `CELL grain the SIMPLE share in DOSE-COVERED cells (dose ≥ N_cover = ${PC_N_COVER}) `
    + 'exceeds the SIMPLE share in uncovered cells with a paired CI excluding zero.',
  b: '(b) the carrier-anchored Δsep of the BEATEN defender at the touch-past is resolvedly '
    + 'LARGER in the matured arm than in the base arm (paired CI excludes zero, positive).',
  both: 'POSITIVE requires BOTH. Either failing is NEGATIVE, reported with its mechanism.',
  noGateReadsIt: true,
};

/** which of the 28 cells the DOSE covers at the shipped N — the matured world's SIMPLE map. */
const DOSE_CELL_COVERED: boolean[] = (() => {
  const out: boolean[] = [];
  for (let c = 0; c < N_CELLS; c++) {
    /** a cell counts as DOSE-COVERED if the MEDIAN roster slot's dose reaches N. */
    const col = PC_DOSE.map((rw) => rw[c]).slice().sort((x, y) => x - y);
    out.push(col[Math.floor(col.length / 2)] >= PC_N_COVER);
  }
  return out;
})();
const DOSE_COVERED_CELL_COUNT = DOSE_CELL_COVERED.filter(Boolean).length;

/** the cell-grain differentiation face, per arm, paired by SEED over the same bootstrap draws. */
const cellGrainSplit = (() => {
  resetStats();
  const K = rowsOf(REF_ARM).length;
  const draws: number[][] = [];
  for (let d = 0; d < BOOTSTRAP; d++) {
    const idx: number[] = [];
    for (let i = 0; i < K; i++) idx.push(Math.floor(statsRng.next() * K) % K);
    draws.push(idx);
  }
  const build = (arm: ArmKind): {
    coveredSimple: number; coveredArms: number; uncoveredSimple: number; uncoveredArms: number;
    coveredShare: number; uncoveredShare: number; gap: number;
    gapCi95: [number, number]; gapOverHalfWidth: number;
    perSeed: { cs: number; ca: number; us: number; ua: number }[];
  } => {
    const perSeed = rowsOf(arm).map((r) => {
      let cs = 0; let ca = 0; let us = 0; let ua = 0;
      for (let c = 0; c < N_CELLS; c++) {
        if (DOSE_CELL_COVERED[c]) { cs += r.simpleByCell[c]; ca += r.armsByCell[c]; }
        else { us += r.simpleByCell[c]; ua += r.armsByCell[c]; }
      }
      return { cs, ca, us, ua };
    });
    const cs = sum(perSeed.map((p) => p.cs));
    const ca = sum(perSeed.map((p) => p.ca));
    const us = sum(perSeed.map((p) => p.us));
    const ua = sum(perSeed.map((p) => p.ua));
    const vals: number[] = [];
    for (const idx of draws) {
      let a = 0; let b = 0; let c2 = 0; let d2 = 0;
      for (const i of idx) {
        a += perSeed[i].cs; b += perSeed[i].ca; c2 += perSeed[i].us; d2 += perSeed[i].ua;
      }
      vals.push(ratio(a, b) - ratio(c2, d2));
    }
    const gap = ratio(cs, ca) - ratio(us, ua);
    const ci = pct(vals);
    return {
      coveredSimple: cs, coveredArms: ca, uncoveredSimple: us, uncoveredArms: ua,
      coveredShare: ratio(cs, ca), uncoveredShare: ratio(us, ua), gap,
      gapCi95: ci, gapOverHalfWidth: ratioToHalfWidth(gap, ci), perSeed,
    };
  };
  return { matured: build('v7pcMatured'), empty: build('v7pcEmpty') };
})();

/**
 * ⭐ THE NOISE-FLOOR COMPARISON for the max−min limb (PC-T1 §CORRECTIONS 3's canon). The
 * statistic is the per-seed max−min SIMPLE share across cells with ≥ MIN_ARMS arms; its null
 * is structurally NON-NEGATIVE, so it gets a FLOOR, not a zero-null CI. The floor is the SAME
 * statistic on the EMPTY arm, whose book is born absent and whose spread is therefore whatever
 * a single match's own learning + sampling noise produces.
 */
const MIN_ARMS_PER_CELL = 5;
const maxMinSpread = (() => {
  const perSeedSpread = (arm: ArmKind): number[] => rowsOf(arm).map((r) => {
    const shares: number[] = [];
    for (let c = 0; c < N_CELLS; c++) {
      if (r.armsByCell[c] >= MIN_ARMS_PER_CELL) shares.push(r.simpleByCell[c] / r.armsByCell[c]);
    }
    return shares.length < 2 ? Number.NaN : Math.max(...shares) - Math.min(...shares);
  });
  const mean = (xs: number[]): number => {
    const f = xs.filter(Number.isFinite);
    return f.length === 0 ? Number.NaN : sum(f) / f.length;
  };
  const mat = perSeedSpread('v7pcMatured');
  const emp = perSeedSpread('v7pcEmpty');
  resetStats();
  const K = mat.length;
  const vals: number[] = [];
  for (let d = 0; d < BOOTSTRAP; d++) {
    const idx: number[] = [];
    for (let i = 0; i < K; i++) idx.push(Math.floor(statsRng.next() * K) % K);
    vals.push(mean(idx.map((i) => mat[i])) - mean(idx.map((i) => emp[i])));
  }
  const delta = mean(mat) - mean(emp);
  const ci = pct(vals);
  return {
    statistic: 'per-seed max−min SIMPLE share across cells with ≥ '
      + `${MIN_ARMS_PER_CELL} arms, averaged over seeds`,
    maturedMean: mean(mat), noiseFloorEmptyMean: mean(emp),
    excessOverNoiseFloor: delta, excessCi95: ci,
    excessOverHalfWidth: ratioToHalfWidth(delta, ci),
    canon: 'PC-T1-LEARNING-EXAM.md §COMMANDER CORRECTIONS item 3, verbatim: "a max−min face '
      + 'reports a noise-floor comparison, not a zero-null CI". The floor here is the EMPTY '
      + 'arm\'s own spread on the same seeds — never zero.',
    seedsMatured: mat.filter(Number.isFinite).length,
    seedsEmpty: emp.filter(Number.isFinite).length,
  };
})();

const hPc1 = (() => {
  const pooled = faceOf('simpleTierShare');
  const pooledC = pooled.contrasts.maturedVsEmpty;
  const aPooled = resolvedPositive(pooledC.ci95);
  const aCell = resolvedPositive(cellGrainSplit.matured.gapCi95)
    && cellGrainSplit.matured.gap > 0;
  const sepF = faceOf('deltaSepAtTouchPastMetres');
  const sepC = sepF.contrasts.v7pcMatured;
  const bOk = resolvedPositive(sepC.ci95);
  const tierSimple = faceOf('deltaSepMetresWhenTheBeatenDefenderPays_simple');
  const tierChoice = faceOf('deltaSepMetresWhenTheBeatenDefenderPays_choice');
  /** ⭐ POOLED ACROSS THE TWO PC ARMS, because the beaten defender is almost always HELD and
   *  which tier he pays is decided by the ARM's book state: the matured arm supplies the
   *  SIMPLE-tier rows and the empty arm the CHOICE-tier ones. Both Ns are published. */
  const poolTier = (f: FaceRow): { v: number; n: number } => {
    const n = f.arms.v7pcMatured.den + f.arms.v7pcEmpty.den;
    const num = f.arms.v7pcMatured.num + f.arms.v7pcEmpty.num;
    return { v: ratio(num, n), n };
  };
  const ps = poolTier(tierSimple);
  const pc = poolTier(tierChoice);
  const footballSentence = {
    what: '⭐ THE FOOTBALL SENTENCE: a SIMPLE-tier defender should concede LESS ground than a '
      + 'CHOICE-tier one over the same window. Pooled across the two PC arms (the matured arm '
      + 'supplies the SIMPLE rows, the empty arm the CHOICE rows).',
    simpleTierDeltaSepMetres: ps.v,
    simpleTierN: ps.n,
    choiceTierDeltaSepMetres: pc.v,
    choiceTierN: pc.n,
    orderHolds: Number.isFinite(ps.v) && Number.isFinite(pc.v) && ps.v < pc.v,
    disclosure: '⚠ THIS LIMB IS NOT PART OF THE SCORING RULE, AND IT IS NOT A RANDOMISED '
      + 'CONTRAST. A body pays SIMPLE precisely in the situations he has lived, so tier and '
      + 'situation are confounded by construction; and because the two tiers here come from '
      + 'two different ARMS, arm and tier are confounded too. Reported as a DIRECTION with '
      + 'its Ns, never as an effect size.',
  };
  return {
    preRegisteredRule: H_PC1_RULE,
    a: {
      verdict: aPooled && aCell ? 'HOLDS' : 'FAILS',
      pooledSimpleShareMatured: pooled.arms.v7pcMatured.point,
      pooledSimpleShareEmpty: pooled.arms.v7pcEmpty.point,
      pooledContrastMaturedMinusEmpty: pooledC.delta,
      pooledContrastCi95: pooledC.ci95,
      pooledContrastOverHalfWidth: ratioToHalfWidth(pooledC.delta, pooledC.ci95),
      pooledLimbHolds: aPooled,
      cellGrainCoveredShare: cellGrainSplit.matured.coveredShare,
      cellGrainUncoveredShare: cellGrainSplit.matured.uncoveredShare,
      cellGrainGap: cellGrainSplit.matured.gap,
      cellGrainGapCi95: cellGrainSplit.matured.gapCi95,
      cellGrainGapOverHalfWidth: cellGrainSplit.matured.gapOverHalfWidth,
      cellGrainLimbHolds: aCell,
      doseCoveredCellCount: DOSE_COVERED_CELL_COUNT,
      cellCount: N_CELLS,
      emptyArmCellGrainGap: cellGrainSplit.empty.gap,
      emptyArmCellGrainGapCi95: cellGrainSplit.empty.gapCi95,
      noiseFloorComparison: maxMinSpread,
    },
    b: {
      verdict: bOk ? 'HOLDS' : 'FAILS',
      deltaSepMaturedMetres: sepF.arms.v7pcMatured.point,
      deltaSepEmptyMetres: sepF.arms.v7pcEmpty.point,
      deltaSepBaseMetres: sepF.arms.v7.point,
      contrastMaturedMinusBaseMetres: sepC.delta,
      contrastCi95Metres: sepC.ci95,
      contrastOverHalfWidth: ratioToHalfWidth(sepC.delta, sepC.ci95),
      contrastEmptyMinusBaseMetres: sepF.contrasts.v7pcEmpty.delta,
      contrastEmptyCi95Metres: sepF.contrasts.v7pcEmpty.ci95,
      rowsMatured: sepF.arms.v7pcMatured.den,
      rowsBase: sepF.arms.v7.den,
      windowAppliedTicks: SEP_WINDOW_TICKS,
      windowSimSeconds: round(SEP_WINDOW_TICKS * DT, 4),
      byDefenderTier: footballSentence,
    },
    verdict: (aPooled && aCell && bOk) ? '⭐⭐ POSITIVE' : 'NEGATIVE',
  };
})();

/* ========================================================================== */
/* §17 ⭐ THE GATED FACES #299 item 6 ADDED: confusion + rank invariance         */
/* ========================================================================== */
/**
 * ⭐ THE CENSUS-vs-OBSERVED CONFUSION TABLE. PC-T1's committed `fill.measured[]` says which
 * cells its own armed league actually covered at the shipped N; the DOSE this stage writes is
 * derived from the same artifact. The table asks the honest question: does the world PC-T2
 * walks agree cell-by-cell with the world PC-T1 measured?
 *
 *   PREDICTED covered = the dose reaches N_cover for the median roster slot (this stage's own
 *                       matured map — the thing the arm was built from).
 *   OBSERVED covered  = in the MATURED arm, that cell's SIMPLE share exceeds 0.5 (the majority
 *                       of arms in it were paid short) — a coverage read at ARM grain.
 * Cells with no arms at all are counted separately: a structural zero is NOT a disagreement
 * (the non-vacuity rule — never-occurred ≠ unmeasured).
 */
const confusionTable = (() => {
  let bothCovered = 0; let bothUncovered = 0;
  let predictedCoveredNotObserved = 0; let observedCoveredNotPredicted = 0;
  let unarmedCells = 0;
  const rowsOut: { cell: string; dosedMedian: number; predicted: boolean; arms: number;
    simpleShare: number; observed: boolean; agrees: boolean | null }[] = [];
  const arms = cellArmsByArm.v7pcMatured.arms;
  const simple = cellArmsByArm.v7pcMatured.simple;
  for (let c = 0; c < N_CELLS; c++) {
    const col = PC_DOSE.map((rw) => rw[c]).slice().sort((x, y) => x - y);
    const med = col[Math.floor(col.length / 2)];
    const predicted = DOSE_CELL_COVERED[c];
    if (arms[c] === 0) {
      unarmedCells += 1;
      rowsOut.push({ cell: PC_BOOK_CELLS[c], dosedMedian: med, predicted, arms: 0,
        simpleShare: Number.NaN, observed: false, agrees: null });
      continue;
    }
    const share = simple[c] / arms[c];
    const observed = share > 0.5;
    if (predicted && observed) bothCovered += 1;
    else if (!predicted && !observed) bothUncovered += 1;
    else if (predicted && !observed) predictedCoveredNotObserved += 1;
    else observedCoveredNotPredicted += 1;
    rowsOut.push({ cell: PC_BOOK_CELLS[c], dosedMedian: med, predicted, arms: arms[c],
      simpleShare: share, observed, agrees: predicted === observed });
  }
  const classified = bothCovered + bothUncovered + predictedCoveredNotObserved
    + observedCoveredNotPredicted;
  return {
    definition: 'PREDICTED = the dose reaches N_cover for the MEDIAN roster slot; OBSERVED = '
      + 'the cell\'s SIMPLE share in the MATURED arm exceeds 0.5. Cells with ZERO arms are '
      + 'counted apart — a structural zero is not a disagreement (non-vacuity: never-occurred '
      + '≠ unmeasured).',
    bothCovered, bothUncovered, predictedCoveredNotObserved, observedCoveredNotPredicted,
    unarmedCells, classified, cells: N_CELLS,
    closes: classified + unarmedCells === N_CELLS,
    agreementShare: ratio(bothCovered + bothUncovered, classified),
    rows: rowsOut,
  };
})();

/**
 * ⭐ RANK INVARIANCE — does this stage's armed world rank the 28 cells the way PC-T1's did?
 * Spearman (ORDINAL ranks, the conservative form PC-T1 §CORRECTIONS 3 flagged) between
 * PC-T1's committed `fill.measured[].simpleShareAtN[1]` (the shipped N) and this stage's own
 * per-cell SIMPLE share in the MATURED arm, over cells with arms on BOTH sides.
 */
const rankInvariance = (() => {
  const measured = PCT1_FILE.fill as { measured: { cell: string; arms: number;
    simpleShareAtN: number[] }[] };
  const arms = cellArmsByArm.v7pcMatured.arms;
  const simple = cellArmsByArm.v7pcMatured.simple;
  const pairs: { cell: string; t1: number; t2: number }[] = [];
  for (const mrow of measured.measured) {
    const c = CELL_IDX[mrow.cell];
    if (c === undefined || mrow.arms === 0 || arms[c] === 0) continue;
    pairs.push({ cell: mrow.cell, t1: mrow.simpleShareAtN[1], t2: simple[c] / arms[c] });
  }
  const rankOf = (xs: number[]): number[] => {
    const order = xs.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
    const r = zeros(xs.length);
    order.forEach(([, i], k) => { r[i] = k + 1; });
    return r;
  };
  const n = pairs.length;
  const r1 = rankOf(pairs.map((p) => p.t1));
  const r2 = rankOf(pairs.map((p) => p.t2));
  const d2 = sum(r1.map((v, i) => (v - r2[i]) ** 2));
  const rho = n < 2 ? Number.NaN : 1 - (6 * d2) / (n * (n * n - 1));
  return {
    method: 'Spearman on ORDINAL ranks (the conservative form; mid-rank values are higher — '
      + 'PC-T1 §COMMANDER CORRECTIONS item 3), over cells with arms in BOTH worlds.',
    cellsCompared: n, spearmanOrdinal: rho, sumSquaredRankDiff: d2,
    pairs,
  };
})();

/* ---- ⭐ THE FIXTURE-GRAIN SUPPLY TRAJECTORY, aggregated ---- */
const trajectory = (() => {
  const byFixture = Array.from({ length: FIXTURES_PER_SEASON }, (_, f) => {
    const rowsF = C.battery.traj.filter((t) => t.fixture === f);
    const armedEv = sum(rowsF.map((t) => t.armedEvents));
    const baseEv = sum(rowsF.map((t) => t.baseEvents));
    const arms = sum(rowsF.map((t) => t.armed.arms));
    const firings = sum(rowsF.map((t) => t.armed.firings));
    const simple = sum(rowsF.map((t) => t.armed.simpleArms));
    return {
      fixtureInSeason: f + 1,
      books: rowsF.length,
      armsPerFixture: ratio(arms, rowsF.length),
      firingsPerFixture: ratio(firings, rowsF.length),
      simpleShare: ratio(simple, arms),
      coveredBodyCellsAtShippedNPerFixture:
        ratio(sum(rowsF.map((t) => t.armed.coveredBodyCellsAtN[1])), rowsF.length),
      heldExecutorAppliedTicksPerFixture:
        ratio(sum(rowsF.map((t) => t.armed.heldExecutorTicks)), rowsF.length),
      armedEngineEventsPerFixture: ratio(armedEv, rowsF.length),
      baseEngineEventsPerFixture: ratio(baseEv, rowsF.length),
      /** ⭐ THE TRANSIENT'S OWN CURVE: the armed-vs-base supply gap AT THIS FIXTURE INDEX. */
      armedMinusBaseEngineEventRelativeChange: ratio(armedEv - baseEv, baseEv),
    };
  });
  return {
    what: '⭐ THE PC-T1 §DOUBTS 2 GAP, CLOSED: arms · firings · coverage · the ENGINE\'s own '
      + 'event supply, BY FIXTURE INDEX within one season, with a same-seed door-shut walk at '
      + 'every fixture. #299 §CORRECTIONS 2 ruled the 14.1 % starvation a COLD-BOOK TRANSIENT; '
      + 'this is its transition curve.',
    books: TRAJ_BOOKS, fixturesPerSeason: FIXTURES_PER_SEASON,
    supplyProxy: 'the ENGINE\'s own passes + shots + tackles + interceptions + miscontrols + '
      + 'clearances, summed over both teams — a door-shut world has no seat and therefore no '
      + 'arm counter, so the commensurable supply quantity is the engine\'s, not the seam\'s.',
    byFixture,
    coldToWarmEngineEventRelativeChangeDelta:
      byFixture[FIXTURES_PER_SEASON - 1].armedMinusBaseEngineEventRelativeChange
      - byFixture[0].armedMinusBaseEngineEventRelativeChange,
    armOkFixtures: C.battery.traj.filter((t) => t.armOk).length,
    fixtures: C.battery.traj.length,
  };
})();

/* ---- the book-keeping receipts ---- */
const spellReceipt = (() => {
  let spells = 0; let classified = 0; let open = 0; let openClassified = 0;
  let pressSplit = 0;
  for (const r of allRows()) {
    spells += r.spells; open += r.openSpells;
    classified += sum(TERMINALS.map((t) => r.terminalAll[t]));
    openClassified += sum(TERMINALS.map((t) => r.terminalOpen[t]));
    pressSplit += r.pressedEndSpells + r.freeEndSpells;
  }
  return { spells, classified, open, openClassified, pressureSplitTotal: pressSplit,
    closes: spells === classified && open === openClassified,
    thePressureSplitPartitionsTheOpenSpells: pressSplit === open };
})();
const tierSplitReceipt = (() => {
  let ok = 0; let total = 0;
  for (const r of allRows()) {
    total += 1;
    if (sum(r.pressedEndByTier) === r.pressedEndSpells
      && sum(r.pressedEndLostByTier) === r.pressedEndLost) ok += 1;
  }
  return { ok, total };
})();
const histReceipt = (() => {
  let ok = 0; let total = 0;
  for (const r of allRows()) {
    total += 1;
    if (sum(r.behindHist) === r.receptions && sum(r.behindHistPressed) === r.receptionsPressed) {
      ok += 1;
    }
  }
  return { ok, total };
})();
const sepReceipt = (() => {
  const perArm = Object.fromEntries(ARMS.map((a) => {
    const s = sepByArm[a];
    const measured = sum(s.nByTier);
    const censored = s.censoredWhistle + s.censoredDeadBall + s.censoredMissingBody;
    return [a, {
      knocks: s.knocks, challengers: s.challengers, beaten: s.beaten,
      measuredRows: measured, censoredRows: censored,
      rowsAccountedFor: measured + censored === s.beaten,
      replicaMismatches: s.replicaMismatches,
      binsCloseOnMeasuredRows: sum(s.dSepBins) === measured,
      nByTier: s.nByTier, censoredWhistle: s.censoredWhistle,
      censoredDeadBall: s.censoredDeadBall, censoredMissingBody: s.censoredMissingBody,
    }];
  }));
  return {
    perArm,
    everyArmAccountsForEveryBeatenDefender: ARMS.every((a) =>
      (perArm[a] as { rowsAccountedFor: boolean }).rowsAccountedFor),
    noReplicaMismatchAnywhere: ARMS.every((a) => sepByArm[a].replicaMismatches === 0),
    binsClose: ARMS.every((a) =>
      (perArm[a] as { binsCloseOnMeasuredRows: boolean }).binsCloseOnMeasuredRows),
    theBaseArmHasNoTieredRows: sepByArm.v7.nByTier[TI.simple] === 0
      && sepByArm.v7.nByTier[TI.choice] === 0,
    theMaturedArmHasBothTiers: sepByArm.v7pcMatured.nByTier[TI.simple] > 0
      && sepByArm.v7pcMatured.nByTier[TI.choice] > 0,
    /** ⭐ THE STRUCTURAL FACT, REPORTED: the beaten defender is ALMOST ALWAYS held, and which
     *  tier he pays is decided by the ARM's book state — so the tier contrast lives ACROSS the
     *  two PC arms, not inside one of them. Gated in that form. */
    theTwoPcArmsBetweenThemCoverBothTiers:
      sepByArm.v7pcMatured.nByTier[TI.simple] + sepByArm.v7pcEmpty.nByTier[TI.simple] > 0
      && sepByArm.v7pcMatured.nByTier[TI.choice] + sepByArm.v7pcEmpty.nByTier[TI.choice] > 0,
    simpleRowsMatured: sepByArm.v7pcMatured.nByTier[TI.simple],
    choiceRowsMatured: sepByArm.v7pcMatured.nByTier[TI.choice],
    simpleRowsEmpty: sepByArm.v7pcEmpty.nByTier[TI.simple],
    choiceRowsEmpty: sepByArm.v7pcEmpty.nByTier[TI.choice],
  };
})();

const faceRederivationInMemory = (() => {
  let checked = 0; let bad = 0;
  for (const rowF of C.faces) {
    const f = FACES[rowF.face];
    for (const arm of ARMS) {
      checked += 1;
      const want = ratio(sum(rowsOf(arm).map(f.num)), sum(rowsOf(arm).map(f.den)));
      const got = rowF.arms[arm].point;
      if (!(Number.isNaN(want) && Number.isNaN(got)) && Math.abs(want - got) > 1e-12) bad += 1;
    }
  }
  return { checked, bad };
})();

/** ⭐ NON-VACUITY: a face whose denominator is zero is UNMEASURED, and it is named, not hidden. */
const vacuity = (() => {
  const empties: string[] = [];
  const structuralEmpties: string[] = [];
  let cells = 0;
  for (const f of C.faces) {
    const structural = FACES[f.face].armStructural === true;
    for (const arm of ARMS) {
      cells += 1;
      if (f.arms[arm].den !== 0) continue;
      /** ⭐ A DECLARED arm-structural face may be empty on ANY arm whose world cannot produce
       *  its denominator (the base arm has no seat at all; a born-absent book pays SIMPLE
       *  rarely). Every empty is PUBLISHED BY NAME either way — never-occurred ≠ unmeasured. */
      if (structural) structuralEmpties.push(`${arm}.${f.face}`);
      else empties.push(`${arm}.${f.face}`);
    }
  }
  const armedDens = ARM_STRUCTURAL_FACES.map((k) => Math.max(
    ...ARMS.map((a) => faceOf(k).arms[a].den)));
  return {
    cells, empties, structuralEmpties,
    declaredArmStructuralFaces: ARM_STRUCTURAL_FACES.length,
    everyArmStructuralFaceIsMeasuredSomewhere: armedDens.every((d) => d > 0),
    /** ⭐ never-occurred ≠ unmeasured: the cells with ZERO arms in the matured arm, NAMED. */
    cellsWithZeroArmsInTheMaturedArm: PC_BOOK_CELLS
      .filter((_, i) => cellArmsByArm.v7pcMatured.arms[i] === 0),
  };
})();

/* ---- ⭐ THE CLOCK, APPLIED not nominal (#280's form) ---- */
const clockReceipt = {
  matchDurationSimSeconds: MATCH_DURATION,
  dtSimSeconds: DT,
  appliedTicksPerWalk: Math.round(MATCH_DURATION / DT),
  simpleTierAppliedTicks: PC_TIER_SIMPLE_TICKS,
  choiceTierAppliedTicks: PC_TIER_CHOICE_TICKS,
  sepWindowAppliedTicks: SEP_WINDOW_TICKS,
  sepWindowSimSeconds: round(SEP_WINDOW_TICKS * DT, 6),
  sepWindowNominalSimSeconds: round(L3_DEFENCE_WINDOW_S, 6),
  choiceTierWindowAppliedTicks: SEP_WINDOW_TIER_TICKS,
  displayMinutes: DISPLAY_MINUTES,
  displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
  everyWalkSteppedItsFullMatch: allRows().every((r) => r.ticks >= Math.round(MATCH_DURATION / DT)),
  walksStepped: allRows().length,
  law: '⭐ APPLIED, never nominal (#280): the tier lengths and the Δsep window are counted in '
    + 'ticks the executor actually ran; the 22.5× scoreboard mapping is display-only and no '
    + 'reaction number is ever quoted on it.',
};

/**
 * ⭐⭐ THE UNIT-NAMING RULE, GATED THIS TIME (the PC-T1 §COMMANDER CORRECTIONS item 4 gap).
 * Canon, home ruling #294 item 3: *"a field carries the unit its name claims"*. The gate walks
 * the SERIALIZED body and refuses any leaf whose NAME claims a unit its VALUE cannot carry:
 *   · `*Metres` / `*Ticks` / `*Seconds` / `*Share` / `*Count` / `*Sha256` must be numbers
 *     (or arrays of numbers), except `*Sha256` which must be a 64-hex string;
 *   · a `*Share` must lie in [0, 1] (or be NaN-serialized as null/UNMEASURED);
 *   · a name containing `Ticks` must be an integer (applied ticks are counted, never fractional)
 *     — with the ONE declared exception of a `mean*Ticks` field, which is an average of them.
 * The check runs over the REAL body, so it cannot be satisfied by a field that does not exist.
 */
const UNIT_LEAVES_SEEN = { n: 0 };
const unitViolationsOf = (body: unknown): string[] => {
  const out: string[] = [];
  UNIT_LEAVES_SEEN.n = 0;
  const isNum = (v: unknown): v is number => typeof v === 'number';
  const walkNode = (v: unknown, path: string, name: string): void => {
    if (Array.isArray(v)) { v.forEach((x, i) => walkNode(x, `${path}[${i}]`, name)); return; }
    if (v !== null && typeof v === 'object') {
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
        walkNode(x, `${path}.${k}`, k);
      }
      return;
    }
    if (v === null || v === 'UNMEASURED') return;
    UNIT_LEAVES_SEEN.n += 1;
    if (/Sha256$/.test(name)) {
      if (typeof v !== 'string' || !/^[0-9a-f]{64}$/.test(v)) {
        out.push(`${path}: a *Sha256 name that is not a 64-hex digest`);
      }
      return;
    }
    if (/(Metres|Seconds|Ticks|Share|Count|PerMatch|PerFixture)$/.test(name)) {
      if (!isNum(v)) { out.push(`${path}: "${name}" claims a unit but holds ${typeof v}`); return; }
      if (/Share$/.test(name) && Number.isFinite(v) && (v < -1e-9 || v > 1 + 1e-9)) {
        out.push(`${path}: a *Share outside [0, 1] (${v})`);
      }
      if (/Ticks$/.test(name) && !/^mean/.test(name) && Number.isFinite(v)
        && !Number.isInteger(v)) {
        out.push(`${path}: a *Ticks field that is not an integer (${v})`);
      }
    }
  };
  walkNode(body, '$', 'body');
  return out;
};

/* ---- the seed ledger ---- */
const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{ name: 'PC-T2 battery (3 arms, SAME seeds)',
      range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: '⭐ PC-T2 fixture-grain supply trajectory (books × fixtures, each walked twice)',
    range: [TRAJ_BASE, TRAJ_BASE + TRAJ_BOOKS_FULL * FIXTURES_PER_SEASON - 1] },
  { name: '⭐ PC-T2 lifecycle/doors block',
    range: [LIFECYCLE_BASE, LIFECYCLE_BASE + LIFECYCLE_SEEDS_FULL - 1] },
  { name: 'PC-T2 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'PC-T2 world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
  { name: 'PC-T2 guard/override block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = ARMS.every((a) => rowsOf(a)
  .every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1));
const allClaimedInsideTheBlock = CLAIMED
  .every((c) => c.range[0] >= BLOCK[0] && c.range[1] <= BLOCK[1]);
const trajSeedsInBand = C.battery.traj.every((t) => t.seed >= TRAJ_BASE
  && t.seed <= TRAJ_BASE + TRAJ_BOOKS_FULL * FIXTURES_PER_SEASON - 1);
const refSeedKey = rowsOf(REF_ARM).map((r) => r.seed).join(',');
const pairedSameSeeds = ARMS.every((a) => rowsOf(a).map((r) => r.seed).join(',') === refSeedKey);
const retiredUntouched = CLAIMED.every((c) => !overlaps(c.range, [12_494_000, 12_494_999]));

/* ========================================================================== */
/* §18 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string;
  fn: (i: I) => Conj;
  input: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): void => {
  REGISTRY.push(spec as unknown as GateSpec<never>);
};
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

/* ---- 2 xSrcUntouched — ⭐ THE #286.1-CORRECTED FORM: WORKTREE vs HEAD, both conjuncts ---- */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noWorktreeVsHeadDiff: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noWorktreeVsHeadDiff', name: 'src moved against HEAD', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 gArms ---- */
registerGate<{
  ok: number; total: number; probe: boolean; separate: boolean; arms: number; paired: boolean;
  trajOk: number; trajTotal: number;
}>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkedMatchCarriesItsArmLive: i.ok === i.total,
    theIdentitySeedReadsTheEntrysOwnArmedVersions: i.probe,
    theThreeArmsAreThreeDifferentWorlds: i.separate,
    allThreeArmsWereWalked: i.arms === 3,
    theArmsWalkTheSameSeeds: i.paired,
    everyTrajectoryFixtureCarriedItsDoor: i.trajOk === i.trajTotal,
    nonVacuousWalkCount: i.total > 0 && i.trajTotal > 0,
  }),
  input: {
    ok: armOkCount, total: armTotal, probe: worldSeedOk, separate: armsSeparate,
    arms: ARMS.length, paired: pairedSameSeeds,
    trajOk: trajectory.armOkFixtures, trajTotal: trajectory.fixtures,
  },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesItsArmLive', name: 'a walk was not its arm', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theIdentitySeedReadsTheEntrysOwnArmedVersions', name: 'the entry\'s armed-version read disagreed', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'theThreeArmsAreThreeDifferentWorlds', name: '⭐ two arms were the same world', mutate: (i) => ({ ...i, separate: false }) },
    { conjunct: 'allThreeArmsWereWalked', name: 'an arm was dropped', mutate: (i) => ({ ...i, arms: 2 }) },
    { conjunct: 'theArmsWalkTheSameSeeds', name: 'the arms were not paired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'everyTrajectoryFixtureCarriedItsDoor', name: 'a trajectory fixture lost its door', mutate: (i) => ({ ...i, trajOk: i.trajOk - 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0, trajOk: 0, trajTotal: 0 }) },
  ],
});

/* ---- 4 gSources — ⭐ #289 CANON: every data-source guard hashes FILE BYTES ---- */
const pcT1CommittedSha = String((PCT1_FILE as { resultSha256?: string }).resultSha256 ?? '');
const pcC0CommittedSha = String((C0_FILE as { resultSha256?: string }).resultSha256 ?? '');
registerGate<{
  l3Bytes: string; l3Declared: string; l3Labels: number; l3Groups: number;
  t1Bytes: string; t1Declared: string; t1Committed: string;
  c0Bytes: string; c0Declared: string; c0Committed: string;
  cbDose: number; l3ResultSha: string;
}>({
  name: 'gSources',
  fn: (i) => ({
    theL3DoseFileIsTheDECLAREDBYTES: i.l3Bytes === i.l3Declared,
    theL3DoseIsNonEmptyAndTwoGrouped: i.l3Labels > 0 && i.l3Groups === 2,
    theL3ArtifactStillCarriesTheShippedDigest: i.l3ResultSha === L3_T1_SHA,
    thePcT1DoseFileIsTheDECLAREDBYTES: i.t1Bytes === i.t1Declared,
    thePcT1ArtifactRederivesItsOwnCommittedDigest: i.t1Committed === PC_T1_RESULT_SHA
      && i.t1Committed.length === 64,
    thePcC0CensusFileIsTheDECLAREDBYTES: i.c0Bytes === i.c0Declared,
    thePcC0ArtifactRederivesItsOwnCommittedDigest: i.c0Committed === PC_C0_RESULT_SHA
      && i.c0Committed.length === 64,
    theCbPronenessIsTheShippedEntrysOwn: i.cbDose === CB_WORLD_DOSE,
  }),
  input: {
    l3Bytes: L3_BYTES_SHA, l3Declared: L3_T1_FILE_BYTES_SHA,
    l3Labels: L3_DOSE_LABELS, l3Groups: L3_DOSE.length,
    t1Bytes: PCT1_BYTES_SHA, t1Declared: PC_T1_FILE_BYTES_SHA, t1Committed: pcT1CommittedSha,
    c0Bytes: C0_BYTES_SHA, c0Declared: PC_C0_FILE_BYTES_SHA, c0Committed: pcC0CommittedSha,
    cbDose: CB_WORLD_DOSE,
    l3ResultSha: String((L3_FILE as { resultSha256?: string }).resultSha256 ?? ''),
  },
  mutants: [
    { conjunct: 'theL3DoseFileIsTheDECLAREDBYTES', name: '⭐ the L3 dose file\'s BYTES moved', mutate: (i) => ({ ...i, l3Bytes: 'deadbeef' }) },
    { conjunct: 'theL3DoseIsNonEmptyAndTwoGrouped', name: 'the L3 dose was empty', mutate: (i) => ({ ...i, l3Labels: 0 }) },
    { conjunct: 'theL3ArtifactStillCarriesTheShippedDigest', name: 'the L3 artifact lost its digest', mutate: (i) => ({ ...i, l3ResultSha: '' }) },
    { conjunct: 'thePcT1DoseFileIsTheDECLAREDBYTES', name: '⭐⭐ the PC-T1 dose file\'s BYTES moved', mutate: (i) => ({ ...i, t1Bytes: 'deadbeef' }) },
    { conjunct: 'thePcT1ArtifactRederivesItsOwnCommittedDigest', name: 'the PC-T1 artifact lost its digest', mutate: (i) => ({ ...i, t1Committed: '' }) },
    { conjunct: 'thePcC0CensusFileIsTheDECLAREDBYTES', name: 'the census file\'s BYTES moved', mutate: (i) => ({ ...i, c0Bytes: 'deadbeef' }) },
    { conjunct: 'thePcC0ArtifactRederivesItsOwnCommittedDigest', name: 'the census lost its digest', mutate: (i) => ({ ...i, c0Committed: '' }) },
    { conjunct: 'theCbPronenessIsTheShippedEntrysOwn', name: 'the CB dose drifted', mutate: (i) => ({ ...i, cbDose: 99 }) },
  ],
});

/* ---- 5 ⭐⭐ gDose — THE MATURED DOSE, READ BACK OFF EVERY WALKED BOOK ---- */
const doseReadBack = (() => {
  let matured = 0; let maturedOk = 0; let empty = 0; let emptyOk = 0;
  for (const arm of PC_ARMS) {
    for (let i = 0; i < Math.min(10, N_RUN); i++) {
      const m = new Match(matchCfg(BASE_RUN + i, arm));
      const seat = m.pcLatency;
      if (seat === null) continue;
      if (isMatured(arm)) {
        matured += 1;
        if (seat.books.every(bookMatchesDose)) maturedOk += 1;
      } else {
        empty += 1;
        if (seat.books.every(bookIsEmpty)) emptyOk += 1;
      }
    }
  }
  return { matured, maturedOk, empty, emptyOk };
})();
registerGate<{
  exposures: number; coveredCells: number; slots: number; cells: number;
  books: number; seasons: number; denom: number;
  matured: number; maturedOk: number; empty: number; emptyOk: number;
  writerSites: number; noteIsTheOnlyWriter: boolean; genomeClean: boolean;
}>({
  name: 'gDose',
  fn: (i) => ({
    theDoseIsNonEmpty: i.exposures > 0,
    theDoseCoversSomeCellsAndNotOthers: i.coveredCells > 0 && i.coveredCells < i.slots * i.cells,
    theDoseTableIsTheFullSlotByCellShape: i.slots === ROSTER_SIZE && i.cells === N_CELLS,
    theDoseDenominatorIsTheArtifactsOwnBooksTimesSidesTimesSeasons:
      i.denom === i.books * 2 * i.seasons && i.books > 0 && i.seasons > 0,
    everyMaturedWalkedBookIsBitEqualToTheDoseTable: i.matured > 0 && i.maturedOk === i.matured,
    everyEmptyWalkedBookIsBORNABSENT: i.empty > 0 && i.emptyOk === i.empty,
    theDoseIsWrittenThroughTheSHIPPEDWriterOnly: i.noteIsTheOnlyWriter,
    theBookHasExactlyOnePublicWriteMethod: i.writerSites === 1,
    noDoseIsInTheFranchiseGenome: i.genomeClean,
  }),
  input: {
    exposures: PC_DOSE_EXPOSURES, coveredCells: PC_DOSE_COVERED_CELLS,
    slots: PC_DOSE.length, cells: PC_DOSE[0].length,
    books: PC_DOSE_SOURCE.books, seasons: PC_DOSE_SOURCE.seasons, denom: PC_DOSE_SOURCE.denom,
    ...doseReadBack,
    writerSites: countOf(PC_SRC, /^ {2}note\(rosterIdx: number, key: string\): void \{/gm),
    noteIsTheOnlyWriter: countOf(PC_SRC, /\.cells\.set\(/g) === 1
      && countOf(PC_SRC, /row\.set\(/g) === 1,
    genomeClean: allRows().every((r) => r.armOk),
  },
  mutants: [
    { conjunct: 'theDoseIsNonEmpty', name: 'the PC dose was empty', mutate: (i) => ({ ...i, exposures: 0 }) },
    { conjunct: 'theDoseCoversSomeCellsAndNotOthers', name: '⭐ the dose covered EVERY cell (no differentiation possible)', mutate: (i) => ({ ...i, coveredCells: i.slots * i.cells }) },
    { conjunct: 'theDoseTableIsTheFullSlotByCellShape', name: 'the dose table lost a slot', mutate: (i) => ({ ...i, slots: ROSTER_SIZE + 1 }) },
    { conjunct: 'theDoseDenominatorIsTheArtifactsOwnBooksTimesSidesTimesSeasons', name: 'the dose arithmetic used a typed denominator', mutate: (i) => ({ ...i, denom: 1 }) },
    { conjunct: 'everyMaturedWalkedBookIsBitEqualToTheDoseTable', name: '⭐⭐ a matured book did not carry the dose', mutate: (i) => ({ ...i, maturedOk: i.maturedOk - 1 }) },
    { conjunct: 'everyEmptyWalkedBookIsBORNABSENT', name: '⭐ the EMPTY arm was not born absent', mutate: (i) => ({ ...i, emptyOk: i.emptyOk - 1 }) },
    { conjunct: 'theDoseIsWrittenThroughTheSHIPPEDWriterOnly', name: 'a second write path into the book appeared', mutate: (i) => ({ ...i, noteIsTheOnlyWriter: false }) },
    { conjunct: 'theBookHasExactlyOnePublicWriteMethod', name: 'the book gained a second writer', mutate: (i) => ({ ...i, writerSites: 2 }) },
    { conjunct: 'noDoseIsInTheFranchiseGenome', name: '#270 breached — a dose reached info.genome', mutate: (i) => ({ ...i, genomeClean: false }) },
  ],
});

/* ---- 6 ⭐⭐ gLifecycle — THE M-BU.2 DEBT AT THE NEW CB+L3+PC COMPOSITION ---- */
registerGate<{
  firingCarry: number; firingOwner: number; firingPhase: number; firingWhistle: number;
  firingConstruct: number; firingAge: number; firedInInertCells: number;
  seatShutBoundary: number; seatShutWhistle: number; seatShutLedger: number;
  seatNullShut: number; seatLiveOpen: number;
  batteryCarry: number; batteryArmings: number; batteryKnocks: number; batteryConstruct: number;
  seatArmed: number; arm: number; clear: number; slotClears: number; fire: number;
  pcForks: number; pcDetectors: number; pcDetectorCalls: number; pcExecGate: number;
  pcForget: number; pcTimerWrites: number; pcTeamBrain: number; pcPlayerBrain: number;
  pcImports: number;
  o2: boolean; ek: boolean; o1: boolean; c7: boolean; ptp: boolean; eye: boolean; cells: number;
}>({
  name: 'gLifecycle',
  fn: (i) => ({
    noArmingSurvivesItsOwnTickWhereAnAimCanFire: i.firingCarry === 0,
    noArmingCrossesAPossessionWhereAnAimCanFire: i.firingOwner === 0,
    noArmingCrossesAPhaseWhereAnAimCanFire: i.firingPhase === 0,
    noArmingIsLiveAtTheWhistleWhereAnAimCanFire: i.firingWhistle === 0,
    noArmingExistsAtConstruction: i.firingConstruct === 0 && i.batteryConstruct === 0,
    theLongestArmingLifeIsZeroWhereAnAimCanFire: i.firingAge === 0,
    noKnockEverFiresWithTheCapabilityDoorShut: i.firedInInertCells === 0,
    /** ⭐⭐ THE PC SEAT'S OWN LAW: with its door shut it does not exist at all. */
    theSeatNeverExistsAtAStepBoundaryWithItsDoorShut: i.seatShutBoundary === 0,
    theSeatNeverExistsAtTheWhistleWithItsDoorShut: i.seatShutWhistle === 0,
    thePcLedgerIsAllZeroWithItsDoorShut: i.seatShutLedger === 0,
    theSeatIsNullInEveryDoorShutCellAndLiveInEveryDoorOpenOne:
      i.seatNullShut > 0 && i.seatLiveOpen > 0 && i.seatNullShut === i.seatLiveOpen,
    theMeasuredBatteryHoldsTheSameLaw: i.batteryCarry === 0,
    everyArmingIsConsumedInItsOwnTickAcrossTheBattery: i.batteryArmings === i.batteryKnocks,
    theSeatActuallyArmedSomething: i.seatArmed > 0,
    theEarlyReturnExposureIsRealInThisComposition: i.o1 && i.c7,
    theTwoNamedSeamsAreNotArmedHere: !i.o2 && !i.ek,
    theDownstreamSlicesAreNotArmedHere: !i.ptp,
    theStationEyeIsNull: i.eye,
    exactlyOneArmingWriteSite: i.arm === 1,
    exactlyOneWithdrawalCallSite: i.clear === 1,
    theSlotIsClearedInExactlyTwoPlaces: i.slotClears === 2,
    exactlyOneFiringFork: i.fire === 1,
    /** ⭐ the PC seam's own site census */
    exactlyOnePcSeatFork: i.pcForks === 1,
    exactlyOnePcDetectorAndOneCallToIt: i.pcDetectors === 1 && i.pcDetectorCalls === 1,
    thePcExecutorGateIsPresent: i.pcExecGate > 0,
    theSeatIsClearedAtBothSubstitutionSites: i.pcForget === 2,
    /** ⭐ ADDITIVITY (PC-T0 §4): the seam never writes `decisionTimer`. */
    theSeamNeverWritesTheDecisionTimer: i.pcTimerWrites === 0,
    theTeamAndPlayerBrainsCarryZeroPcTokens: i.pcTeamBrain === 0 && i.pcPlayerBrain === 0,
    thePcModuleImportListIsStillClosedToOneLine: i.pcImports === 1,
    theMatrixIsTheFullPowerSet: i.cells === 64,
  }),
  input: {
    firingCarry: lifecycleMatrix.firing.carryOvers,
    firingOwner: lifecycleMatrix.firing.carryOverAcrossOwnerChange,
    firingPhase: lifecycleMatrix.firing.carryOverAcrossPhaseChange,
    firingWhistle: lifecycleMatrix.firing.armedAtWhistle,
    firingConstruct: lifecycleMatrix.firing.armedAtConstruction,
    firingAge: lifecycleMatrix.firing.maxArmingAgeTicks,
    firedInInertCells: lifecycleMatrix.inert.touchPasts,
    seatShutBoundary: lifecycleMatrix.pcOff.pcSeatLiveAtStepBoundary,
    seatShutWhistle: lifecycleMatrix.pcOff.pcSeatLiveAtWhistle,
    seatShutLedger: sum(PC_LEDGER_KEYS.map((k) => lifecycleMatrix.pcOffLedger[k]))
      + sum(rowsOf('v7').map((r) => sum(PC_LEDGER_KEYS.map((k) => r.pcLedger[k])))),
    seatNullShut: lifecycleMatrix.seatNullWithDoorShut,
    seatLiveOpen: lifecycleMatrix.seatLiveWithDoorOpen,
    batteryCarry: batteryLifecycle.carryOvers,
    batteryArmings: batteryLifecycle.armings,
    batteryKnocks: batteryLifecycle.touchPasts,
    batteryConstruct: batteryLifecycle.armedAtConstruction,
    seatArmed: lifecycleMatrix.firing.armings + batteryLifecycle.armings,
    arm: lifecycleStructure.armCallSites,
    clear: lifecycleStructure.clearCallSites,
    slotClears: lifecycleStructure.slotClearedInSrc,
    fire: lifecycleStructure.fireForks,
    pcForks: lifecycleStructure.pcSeatForks,
    pcDetectors: lifecycleStructure.pcDetectorSites,
    pcDetectorCalls: lifecycleStructure.pcDetectorCalls,
    pcExecGate: lifecycleStructure.pcExecutorGates,
    pcForget: lifecycleStructure.pcForgetBodyCalls,
    pcTimerWrites: lifecycleStructure.pcDecisionTimerWrites,
    pcTeamBrain: lifecycleStructure.pcTokensInTeamBrain,
    pcPlayerBrain: lifecycleStructure.pcTokensInPlayerBrain,
    pcImports: lifecycleStructure.pcModuleImportLines,
    o2: lifecycleStructure.o2LookArmed, ek: lifecycleStructure.ekHoldVetoArmed,
    o1: lifecycleStructure.o1PassWindupArmed, c7: lifecycleStructure.c7WindupArmed,
    ptp: lifecycleStructure.ptpArmed, eye: lifecycleStructure.stationEyeNull,
    cells: ALL_DOOR_CELLS.length,
  },
  mutants: [
    { conjunct: 'noArmingSurvivesItsOwnTickWhereAnAimCanFire', name: 'an arming outlived its tick', mutate: (i) => ({ ...i, firingCarry: 1 }) },
    { conjunct: 'noArmingCrossesAPossessionWhereAnAimCanFire', name: 'an arming crossed a possession', mutate: (i) => ({ ...i, firingOwner: 1 }) },
    { conjunct: 'noArmingCrossesAPhaseWhereAnAimCanFire', name: 'an arming crossed a restart', mutate: (i) => ({ ...i, firingPhase: 1 }) },
    { conjunct: 'noArmingIsLiveAtTheWhistleWhereAnAimCanFire', name: 'an arming was live at the whistle', mutate: (i) => ({ ...i, firingWhistle: 1 }) },
    { conjunct: 'noArmingExistsAtConstruction', name: 'a match was born armed', mutate: (i) => ({ ...i, firingConstruct: 1 }) },
    { conjunct: 'theLongestArmingLifeIsZeroWhereAnAimCanFire', name: 'an arming aged', mutate: (i) => ({ ...i, firingAge: 3 }) },
    { conjunct: 'noKnockEverFiresWithTheCapabilityDoorShut', name: '⭐ a knock fired with the door shut', mutate: (i) => ({ ...i, firedInInertCells: 1 }) },
    { conjunct: 'theSeatNeverExistsAtAStepBoundaryWithItsDoorShut', name: '⭐⭐ the seat existed with its door shut', mutate: (i) => ({ ...i, seatShutBoundary: 1 }) },
    { conjunct: 'theSeatNeverExistsAtTheWhistleWithItsDoorShut', name: 'the seat survived to the whistle unarmed', mutate: (i) => ({ ...i, seatShutWhistle: 1 }) },
    { conjunct: 'thePcLedgerIsAllZeroWithItsDoorShut', name: '⭐ the PC ledger moved with the door shut', mutate: (i) => ({ ...i, seatShutLedger: 1 }) },
    { conjunct: 'theSeatIsNullInEveryDoorShutCellAndLiveInEveryDoorOpenOne', name: 'the seat census was vacuous', mutate: (i) => ({ ...i, seatNullShut: 0 }) },
    { conjunct: 'theMeasuredBatteryHoldsTheSameLaw', name: 'the battery carried an arming over', mutate: (i) => ({ ...i, batteryCarry: 1 }) },
    { conjunct: 'everyArmingIsConsumedInItsOwnTickAcrossTheBattery', name: 'armings and knocks stopped matching', mutate: (i) => ({ ...i, batteryKnocks: i.batteryKnocks - 1 }) },
    { conjunct: 'theSeatActuallyArmedSomething', name: '⭐ the proof was vacuous (nothing armed)', mutate: (i) => ({ ...i, seatArmed: 0 }) },
    { conjunct: 'theEarlyReturnExposureIsRealInThisComposition', name: '⭐ a zero of absence (no early return armed)', mutate: (i) => ({ ...i, o1: false }) },
    { conjunct: 'theTwoNamedSeamsAreNotArmedHere', name: 'the discharge over-claimed its scope', mutate: (i) => ({ ...i, o2: true }) },
    { conjunct: 'theDownstreamSlicesAreNotArmedHere', name: 'PTP was silently composed', mutate: (i) => ({ ...i, ptp: true }) },
    { conjunct: 'theStationEyeIsNull', name: 'an eye entered the composition', mutate: (i) => ({ ...i, eye: false }) },
    { conjunct: 'exactlyOneArmingWriteSite', name: 'a second arming site appeared', mutate: (i) => ({ ...i, arm: 2 }) },
    { conjunct: 'exactlyOneWithdrawalCallSite', name: 'a second withdrawal site appeared', mutate: (i) => ({ ...i, clear: 2 }) },
    { conjunct: 'theSlotIsClearedInExactlyTwoPlaces', name: 'the slot gained a third clear', mutate: (i) => ({ ...i, slotClears: 3 }) },
    { conjunct: 'exactlyOneFiringFork', name: 'a second firing fork appeared', mutate: (i) => ({ ...i, fire: 2 }) },
    { conjunct: 'exactlyOnePcSeatFork', name: '⭐ a second seat fork appeared', mutate: (i) => ({ ...i, pcForks: 2 }) },
    { conjunct: 'exactlyOnePcDetectorAndOneCallToIt', name: 'a second detector appeared', mutate: (i) => ({ ...i, pcDetectors: 2 }) },
    { conjunct: 'thePcExecutorGateIsPresent', name: 'the executor gate vanished', mutate: (i) => ({ ...i, pcExecGate: 0 }) },
    { conjunct: 'theSeatIsClearedAtBothSubstitutionSites', name: '⭐ a substitution site stopped clearing the seat', mutate: (i) => ({ ...i, pcForget: 1 }) },
    { conjunct: 'theSeamNeverWritesTheDecisionTimer', name: '⭐⭐ ADDITIVITY BROKEN — the seam wrote decisionTimer', mutate: (i) => ({ ...i, pcTimerWrites: 1 }) },
    { conjunct: 'theTeamAndPlayerBrainsCarryZeroPcTokens', name: 'H3 / the S∧¬T guard fell due', mutate: (i) => ({ ...i, pcTeamBrain: 1 }) },
    { conjunct: 'thePcModuleImportListIsStillClosedToOneLine', name: 'the seam module opened its import list', mutate: (i) => ({ ...i, pcImports: 2 }) },
    { conjunct: 'theMatrixIsTheFullPowerSet', name: 'the doors matrix was not exhaustive', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 7 ⭐⭐ gDoors — the composition's IDENTITY and LIVENESS laws ---- */
registerGate<{
  inertHold: boolean; checked: number; pcChecked: number;
  liveC: number; liveS: number; liveV: number; liveP: number; livePfull: number;
  cells: number; seeds: number; sAndNotT: number;
}>({
  name: 'gDoors',
  fn: (i) => ({
    everyDoorIsInertWithoutItsPartner: i.inertHold,
    theInertnessWasCheckedOnRealCells: i.checked > 0,
    thePcSilenceLawWasCheckedOnRealCells: i.pcChecked > 0,
    theCommitPhysicsDoorIsALiveDoor: i.liveC > 0,
    theChoiceSeatIsALiveDoor: i.liveS > 0,
    theL3VetoIsALiveDoor: i.liveV > 0,
    thePcDoorIsALiveDoor: i.liveP > 0,
    thePcDoorIsLiveOnTheFullCbL3Stack: i.livePfull > 0,
    theSAndNotTExhibitReproduced: i.sAndNotT > 0,
    theMatrixIsExhaustive: i.cells === 64 && i.seeds > 0,
  }),
  input: {
    inertHold: doorsAlways.allHold,
    checked: sum(Object.values(doorsAlways.checked)),
    pcChecked: doorsAlways.checked.pcSeatStructurallySilentWithItsDoorShut,
    liveC: doorsLive.theCommitPhysicsDoorMovesTheWorld,
    liveS: doorsLive.theChoiceSeatMovesTheWorldWhenTheCapabilityDoorIsOpen,
    liveV: doorsLive.theL3VetoMovesTheWorldOnADosedBook,
    liveP: doorsLive.thePcDoorMovesTheWorld,
    livePfull: doorsLive.thePcDoorMovesTheWorldOnTheFullCbL3Stack,
    cells: ALL_DOOR_CELLS.length, seeds: LIFECYCLE_SEEDS.length,
    sAndNotT: lifecycleMatrix.persistingCells.length,
  },
  mutants: [
    { conjunct: 'everyDoorIsInertWithoutItsPartner', name: '⭐ a door moved the world without its partner', mutate: (i) => ({ ...i, inertHold: false }) },
    { conjunct: 'theInertnessWasCheckedOnRealCells', name: 'the inertness laws checked nothing', mutate: (i) => ({ ...i, checked: 0 }) },
    { conjunct: 'thePcSilenceLawWasCheckedOnRealCells', name: 'the PC silence law checked nothing', mutate: (i) => ({ ...i, pcChecked: 0 }) },
    { conjunct: 'theCommitPhysicsDoorIsALiveDoor', name: 'the CB physics door was dead', mutate: (i) => ({ ...i, liveC: 0 }) },
    { conjunct: 'theChoiceSeatIsALiveDoor', name: 'the choice seat was dead', mutate: (i) => ({ ...i, liveS: 0 }) },
    { conjunct: 'theL3VetoIsALiveDoor', name: 'the L3 veto was dead', mutate: (i) => ({ ...i, liveV: 0 }) },
    { conjunct: 'thePcDoorIsALiveDoor', name: '⭐⭐ THE SLICE ITSELF was a dead door', mutate: (i) => ({ ...i, liveP: 0 }) },
    { conjunct: 'thePcDoorIsLiveOnTheFullCbL3Stack', name: '⭐ the PC door died in the exam composition', mutate: (i) => ({ ...i, livePfull: 0 }) },
    { conjunct: 'theSAndNotTExhibitReproduced', name: 'the S∧¬T exhibit vanished (a silent composition change)', mutate: (i) => ({ ...i, sAndNotT: 0 }) },
    { conjunct: 'theMatrixIsExhaustive', name: 'the matrix was not the full power set', mutate: (i) => ({ ...i, cells: 1 }) },
  ],
});

/* ---- 8 gNonPerturbing ---- */
registerGate<{ ok: number; total: number }>({
  name: 'gNonPerturbing',
  fn: (i) => ({
    theInstrumentedWalkIsTheQuietWalk: i.ok === i.total,
    nonVacuousControlCount: i.total > 0,
  }),
  input: perturbCheck,
  mutants: [
    { conjunct: 'theInstrumentedWalkIsTheQuietWalk', name: 'an instrument perturbed its world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousControlCount', name: 'no control was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 9 gClock — APPLIED, never nominal ---- */
registerGate<{
  duration: number; dt: number; simple: number; choice: number; window: number;
  nominal: number; full: boolean; walks: number;
}>({
  name: 'gClock',
  fn: (i) => ({
    theShippedMatchDurationIsUnoverridden: i.duration === MATCH_DURATION,
    theTiersAreTheDerivedAppliedTicks: i.simple === 12 && i.choice === 27
      && i.simple === Math.round(0.20 / i.dt) && i.choice === Math.round(0.45 / i.dt),
    theSepWindowIsTheAppliedFormOfTheEnginesOwnNominalWindow:
      i.window === Math.ceil(i.nominal / i.dt) && i.window === 54,
    everyWalkSteppedItsFullMatch: i.full,
    nonVacuousWalkCount: i.walks > 0,
  }),
  input: {
    duration: MATCH_DURATION, dt: DT,
    simple: PC_TIER_SIMPLE_TICKS, choice: PC_TIER_CHOICE_TICKS,
    window: SEP_WINDOW_TICKS, nominal: L3_DEFENCE_WINDOW_S,
    full: clockReceipt.everyWalkSteppedItsFullMatch, walks: clockReceipt.walksStepped,
  },
  mutants: [
    { conjunct: 'theShippedMatchDurationIsUnoverridden', name: 'the clock was overridden', mutate: (i) => ({ ...i, duration: 90 }) },
    { conjunct: 'theTiersAreTheDerivedAppliedTicks', name: 'a tier drifted off its derivation', mutate: (i) => ({ ...i, simple: 11 }) },
    { conjunct: 'theSepWindowIsTheAppliedFormOfTheEnginesOwnNominalWindow', name: '⭐ the Δsep window stopped being the applied law of record', mutate: (i) => ({ ...i, window: 55 }) },
    { conjunct: 'everyWalkSteppedItsFullMatch', name: 'a walk was truncated', mutate: (i) => ({ ...i, full: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was stepped', mutate: (i) => ({ ...i, walks: 0 }) },
  ],
});

/* ---- 10 ⭐⭐ gUnits — THE NAMING RULE, GATED (the PC-T1 §CORRECTIONS 4 gap) ---- */
const unitsInput = { violations: [] as string[], checkedLeaves: 0, refusesAViolation: false };
registerGate<typeof unitsInput>({
  name: 'gUnits',
  fn: (i) => ({
    everyUnitClaimingFieldCarriesThatUnit: i.violations.length === 0,
    theNamingCheckActuallyWalkedTheBody: i.checkedLeaves > 0,
    theNamingCheckDemonstrablyREFUSESAViolation: i.refusesAViolation,
  }),
  input: unitsInput,
  mutants: [
    { conjunct: 'everyUnitClaimingFieldCarriesThatUnit', name: '⭐ a field lied about its unit', mutate: (i) => ({ ...i, violations: ['$.x.fooMetres'] }) },
    { conjunct: 'theNamingCheckActuallyWalkedTheBody', name: 'the naming check saw nothing', mutate: (i) => ({ ...i, checkedLeaves: 0 }) },
    { conjunct: 'theNamingCheckDemonstrablyREFUSESAViolation', name: 'the naming check could not refuse anything', mutate: (i) => ({ ...i, refusesAViolation: false }) },
  ],
});

/* ---- 11 gBooks — the seat's conservation identities, on both PC arms ---- */
registerGate<{
  tiers: boolean; expo: boolean; mem: boolean; camBound: boolean; camSaw: boolean;
  cells: number; nCover: number; band: string; bothTiersPaid: boolean;
  maturedArms: number; emptyArms: number;
}>({
  name: 'gBooks',
  fn: (i) => ({
    theTwoTiersAccountForEveryArm: i.tiers,
    exactlyOneExposureWasWrittenPerArm: i.expo,
    everyArmFrozeALiveStalePlan: i.mem,
    theCellCameraNeverExceedsTheSeat: i.camBound,
    theCellCameraSawTheBulkOfTheArms: i.camSaw,
    theKeySpaceIsTheRuled28: i.cells === 28,
    theShippedNIsTheDerived18WithItsBand: i.nCover === 18 && i.band === '9,18,36',
    bothTiersWereActuallyPaidOnTheMaturedArm: i.bothTiersPaid,
    bothPcArmsAreNonVacuous: i.maturedArms > 0 && i.emptyArms > 0,
  }),
  input: {
    tiers: PC_ARMS.every((a) => conservation[a].tiersAccountForEveryArm),
    expo: PC_ARMS.every((a) => conservation[a].oneExposurePerArm),
    mem: PC_ARMS.every((a) => conservation[a].aLiveStalePlanPerArm),
    camBound: PC_ARMS.every((a) => conservation[a].theCameraNeverSeesMoreArmsThanTheSeatWrote),
    camSaw: PC_ARMS.every((a) => conservation[a].theCameraSawMostOfThem),
    cells: N_CELLS, nCover: PC_N_COVER, band: N_BAND.join(','),
    bothTiersPaid: pcLedgerByArm.v7pcMatured.armsSimple > 0
      && pcLedgerByArm.v7pcMatured.armsChoice > 0,
    maturedArms: pcLedgerByArm.v7pcMatured.arms, emptyArms: pcLedgerByArm.v7pcEmpty.arms,
  },
  mutants: [
    { conjunct: 'theTwoTiersAccountForEveryArm', name: 'an arm paid neither tier', mutate: (i) => ({ ...i, tiers: false }) },
    { conjunct: 'exactlyOneExposureWasWrittenPerArm', name: 'the exposure identity broke', mutate: (i) => ({ ...i, expo: false }) },
    { conjunct: 'everyArmFrozeALiveStalePlan', name: 'an arm froze nothing', mutate: (i) => ({ ...i, mem: false }) },
    { conjunct: 'theCellCameraNeverExceedsTheSeat', name: 'the camera invented arms', mutate: (i) => ({ ...i, camBound: false }) },
    { conjunct: 'theCellCameraSawTheBulkOfTheArms', name: '⭐ the cell camera missed most arms', mutate: (i) => ({ ...i, camSaw: false }) },
    { conjunct: 'theKeySpaceIsTheRuled28', name: 'the key space moved', mutate: (i) => ({ ...i, cells: 27 }) },
    { conjunct: 'theShippedNIsTheDerived18WithItsBand', name: 'N drifted off its derivation', mutate: (i) => ({ ...i, nCover: 17 }) },
    { conjunct: 'bothTiersWereActuallyPaidOnTheMaturedArm', name: '⭐ the matured world paid only one tier', mutate: (i) => ({ ...i, bothTiersPaid: false }) },
    { conjunct: 'bothPcArmsAreNonVacuous', name: 'a PC arm never armed', mutate: (i) => ({ ...i, emptyArms: 0 }) },
  ],
});

/* ---- 12 ⭐⭐ gSep — the carrier-anchored Δsep instrument ---- */
registerGate<{
  accounted: boolean; replica: boolean; bins: boolean; baseNoTiers: boolean;
  bothTiersAcrossPcArms: boolean; knocks: number; measured: number; window: number;
  carrierAnchored: boolean; carrierAnchoredT0: boolean; deadBallExcluded: number;
}>({
  name: 'gSep',
  fn: (i) => ({
    everyBeatenDefenderIsMeasuredOrCENSOREDAndCounted: i.accounted,
    theChallengerReconstructionMATCHESTheEnginesOwnDeltas: i.replica,
    theHistogramBinsCloseOnTheMeasuredRows: i.bins,
    theBaseArmCarriesNOTieredRowsByConstruction: i.baseNoTiers,
    theTwoPcArmsBetweenThemCoverBOTHTiers: i.bothTiersAcrossPcArms,
    theInstrumentIsCarrierAnchoredAtBOTHENDS: i.carrierAnchored && i.carrierAnchoredT0,
    theWindowIsTheAppliedLawOfRecord: i.window === 54,
    nonVacuousKnockAndRowCounts: i.knocks > 0 && i.measured > 0,
    theDeadBallCensoringActuallyFired: i.deadBallExcluded > 0,
  }),
  input: {
    accounted: sepReceipt.everyArmAccountsForEveryBeatenDefender,
    replica: sepReceipt.noReplicaMismatchAnywhere,
    bins: sepReceipt.binsClose,
    baseNoTiers: sepReceipt.theBaseArmHasNoTieredRows,
    bothTiersAcrossPcArms: sepReceipt.theTwoPcArmsBetweenThemCoverBothTiers,
    knocks: sum(ARMS.map((a) => sepByArm[a].knocks)),
    measured: sum(ARMS.map((a) => sum(sepByArm[a].nByTier))),
    window: SEP_WINDOW_TICKS,
    /** the SOURCE-LEVEL proof: both separation reads take the CARRIER, never the ball. */
    carrierAnchored: countOf(
      readFileSync('scripts/probes/pc-t2-armed-world-read.ts', 'utf8'),
      /dist\(d\.pos, c\.pos\)/g) === 2,
    carrierAnchoredT0: countOf(
      readFileSync('scripts/probes/pc-t2-armed-world-read.ts', 'utf8'),
      /sepT0: dist\(o\.pos, carrier\.pos\)/g) === 1,
    deadBallExcluded: sum(ARMS.map((a) => sepByArm[a].censoredDeadBall)),
  },
  mutants: [
    { conjunct: 'everyBeatenDefenderIsMeasuredOrCENSOREDAndCounted', name: 'a beaten defender vanished', mutate: (i) => ({ ...i, accounted: false }) },
    { conjunct: 'theChallengerReconstructionMATCHESTheEnginesOwnDeltas', name: '⭐⭐ the replica disagreed with the engine', mutate: (i) => ({ ...i, replica: false }) },
    { conjunct: 'theHistogramBinsCloseOnTheMeasuredRows', name: 'the stored bins lost a row', mutate: (i) => ({ ...i, bins: false }) },
    { conjunct: 'theBaseArmCarriesNOTieredRowsByConstruction', name: 'the base arm grew a tier', mutate: (i) => ({ ...i, baseNoTiers: false }) },
    { conjunct: 'theTwoPcArmsBetweenThemCoverBOTHTiers', name: '⭐ the two PC arms never produced both tiers', mutate: (i) => ({ ...i, bothTiersAcrossPcArms: false }) },
    { conjunct: 'theInstrumentIsCarrierAnchoredAtBOTHENDS', name: '⭐⭐ #266.2(i) BREACHED — a ball-anchored t0 returned', mutate: (i) => ({ ...i, carrierAnchored: false }) },
    { conjunct: 'theWindowIsTheAppliedLawOfRecord', name: 'the window drifted', mutate: (i) => ({ ...i, window: 40 }) },
    { conjunct: 'nonVacuousKnockAndRowCounts', name: 'no knock was ever seen', mutate: (i) => ({ ...i, knocks: 0 }) },
    { conjunct: 'theDeadBallCensoringActuallyFired', name: 'the restart guard never fired (a dead predicate)', mutate: (i) => ({ ...i, deadBallExcluded: 0 }) },
  ],
});

/* ---- 13 ⭐ gCensus — the confusion table + the rank invariance (GATED FACES, #299.6) ---- */
registerGate<{
  closes: boolean; classified: number; unarmed: number; cells: number;
  rankN: number; rho: number; namedZeros: number;
}>({
  name: 'gCensus',
  fn: (i) => ({
    theConfusionTableACCOUNTSForEveryCell: i.closes && i.classified + i.unarmed === i.cells,
    theConfusionTableIsNonVacuous: i.classified > 0,
    theStructuralZEROSAreNAMEDNotDropped: i.unarmed === i.namedZeros,
    theRankComparisonRanRealCells: i.rankN >= 2,
    theSpearmanIsAFiniteNumber: Number.isFinite(i.rho),
  }),
  input: {
    closes: confusionTable.closes, classified: confusionTable.classified,
    unarmed: confusionTable.unarmedCells, cells: N_CELLS,
    rankN: rankInvariance.cellsCompared, rho: rankInvariance.spearmanOrdinal,
    namedZeros: vacuity.cellsWithZeroArmsInTheMaturedArm.length,
  },
  mutants: [
    { conjunct: 'theConfusionTableACCOUNTSForEveryCell', name: 'a cell fell out of the table', mutate: (i) => ({ ...i, classified: i.classified - 1 }) },
    { conjunct: 'theConfusionTableIsNonVacuous', name: 'the table classified nothing', mutate: (i) => ({ ...i, classified: 0, unarmed: i.cells, namedZeros: i.cells }) },
    { conjunct: 'theStructuralZEROSAreNAMEDNotDropped', name: '⭐ a never-occurred cell was silently dropped', mutate: (i) => ({ ...i, namedZeros: i.namedZeros + 1 }) },
    { conjunct: 'theRankComparisonRanRealCells', name: 'the rank comparison was empty', mutate: (i) => ({ ...i, rankN: 0 }) },
    { conjunct: 'theSpearmanIsAFiniteNumber', name: 'the Spearman was NaN', mutate: (i) => ({ ...i, rho: Number.NaN }) },
  ],
});

/* ---- 14 ⭐ gTrajectory — the fixture-grain supply curve (the PC-T1 named gap) ---- */
registerGate<{
  fixtures: number; books: number; perFixture: number; armOk: number;
  coverageMonotone: boolean; bothArmsWalked: boolean; firstFixtureIsColdBook: boolean;
}>({
  name: 'gTrajectory',
  fn: (i) => ({
    everyFixtureIndexIsPopulated: i.perFixture === FIXTURES_PER_SEASON,
    everyBookWalkedItsWholeSeason: i.fixtures === i.books * FIXTURES_PER_SEASON,
    everyTrajectoryFixtureCarriedItsArm: i.armOk === i.fixtures,
    bothTheArmedAndTheDoorShutWalkExistAtEveryFixture: i.bothArmsWalked,
    theCurveStartsOnACOLDBook: i.firstFixtureIsColdBook,
    theCoverageCurveRisesAcrossTheSeason: i.coverageMonotone,
  }),
  input: {
    fixtures: trajectory.fixtures, books: trajectory.books,
    perFixture: trajectory.byFixture.filter((f) => f.books > 0).length,
    armOk: trajectory.armOkFixtures,
    coverageMonotone: trajectory.byFixture[FIXTURES_PER_SEASON - 1]
      .coveredBodyCellsAtShippedNPerFixture
      > trajectory.byFixture[0].coveredBodyCellsAtShippedNPerFixture,
    bothArmsWalked: C.battery.traj.every((t) => t.armed.ticks > 0 && t.base.ticks > 0),
    firstFixtureIsColdBook:
      trajectory.byFixture[0].coveredBodyCellsAtShippedNPerFixture
      < trajectory.byFixture[1].coveredBodyCellsAtShippedNPerFixture,
  },
  mutants: [
    { conjunct: 'everyFixtureIndexIsPopulated', name: 'a fixture index was empty', mutate: (i) => ({ ...i, perFixture: 1 }) },
    { conjunct: 'everyBookWalkedItsWholeSeason', name: 'a book stopped mid-season', mutate: (i) => ({ ...i, books: i.books + 1 }) },
    { conjunct: 'everyTrajectoryFixtureCarriedItsArm', name: 'a trajectory fixture lost its arm', mutate: (i) => ({ ...i, armOk: i.armOk - 1 }) },
    { conjunct: 'bothTheArmedAndTheDoorShutWalkExistAtEveryFixture', name: 'the paired door-shut walk went missing', mutate: (i) => ({ ...i, bothArmsWalked: false }) },
    { conjunct: 'theCurveStartsOnACOLDBook', name: '⭐ the trajectory did not start cold', mutate: (i) => ({ ...i, firstFixtureIsColdBook: false }) },
    { conjunct: 'theCoverageCurveRisesAcrossTheSeason', name: 'the books stopped filling', mutate: (i) => ({ ...i, coverageMonotone: false }) },
  ],
});

/* ---- 15 gVacuity — never-occurred ≠ unmeasured ---- */
registerGate<{
  empties: number; structuralNamed: boolean; declared: number; measuredOnMatured: boolean;
  spellsClose: boolean; pressureSplits: boolean; tierSplitOk: number; tierSplitN: number;
  histOk: number; histN: number;
}>({
  name: 'gVacuity',
  fn: (i) => ({
    noUNDECLAREDFaceIsEmpty: i.empties === 0,
    everyStructuralEmptyIsPUBLISHEDByName: i.structuralNamed && i.declared > 0,
    everyArmStructuralFaceIsMeasuredSomewhere: i.measuredOnMatured,
    theSpellBooksClose: i.spellsClose,
    thePressureSplitPartitionsTheOpenSpells: i.pressureSplits,
    theTierSplitPartitionsThePressedSpells: i.tierSplitOk === i.tierSplitN && i.tierSplitN > 0,
    theOptionHistogramsCloseOnTheirDenominators: i.histOk === i.histN && i.histN > 0,
  }),
  input: {
    empties: vacuity.empties.length,
    structuralNamed: vacuity.structuralEmpties.every((n) => ARM_STRUCTURAL_FACES
      .some((k) => n.endsWith(`.${k}`))),
    declared: vacuity.declaredArmStructuralFaces,
    measuredOnMatured: vacuity.everyArmStructuralFaceIsMeasuredSomewhere,
    spellsClose: spellReceipt.closes,
    pressureSplits: spellReceipt.thePressureSplitPartitionsTheOpenSpells,
    tierSplitOk: tierSplitReceipt.ok, tierSplitN: tierSplitReceipt.total,
    histOk: histReceipt.ok, histN: histReceipt.total,
  },
  mutants: [
    { conjunct: 'noUNDECLAREDFaceIsEmpty', name: 'an undeclared face was empty', mutate: (i) => ({ ...i, empties: 1 }) },
    { conjunct: 'everyStructuralEmptyIsPUBLISHEDByName', name: 'a structural empty was not a declared face', mutate: (i) => ({ ...i, structuralNamed: false }) },
    { conjunct: 'everyArmStructuralFaceIsMeasuredSomewhere', name: '⭐ a scored face was never measured', mutate: (i) => ({ ...i, measuredOnMatured: false }) },
    { conjunct: 'theSpellBooksClose', name: 'a spell went unclassified', mutate: (i) => ({ ...i, spellsClose: false }) },
    { conjunct: 'thePressureSplitPartitionsTheOpenSpells', name: 'the pressing split lost a spell', mutate: (i) => ({ ...i, pressureSplits: false }) },
    { conjunct: 'theTierSplitPartitionsThePressedSpells', name: 'the victim-tier split lost a spell', mutate: (i) => ({ ...i, tierSplitOk: i.tierSplitOk - 1 }) },
    { conjunct: 'theOptionHistogramsCloseOnTheirDenominators', name: 'a histogram lost a reception', mutate: (i) => ({ ...i, histOk: i.histOk - 1 }) },
  ],
});

/* ---- 16 gSeeds — BOOKED = WALKED ---- */
registerGate<{
  clashes: number; internal: number; inBand: boolean; trajInBand: boolean;
  inBlock: boolean; paired: boolean; retired: boolean; n: number;
}>({
  name: 'gSeeds',
  fn: (i) => ({
    noClaimedBlockTouchesAConsumedOne: i.clashes === 0,
    noTwoClaimedBlocksOverlap: i.internal === 0,
    everyWalkedBatterySeedIsInsideItsClaimedBlock: i.inBand,
    everyWalkedTrajectorySeedIsInsideItsClaimedBlock: i.trajInBand,
    everyClaimedBlockIsInsideTheRuledBand: i.inBlock,
    theArmsWalkTheSameSeeds: i.paired,
    theRetiredBlockIsNEVERTouched: i.retired,
    nonVacuousBatterySize: i.n > 0,
  }),
  input: {
    clashes: seedClashes.length, internal: claimedInternalClashes.length,
    inBand: allSeedsInBand, trajInBand: trajSeedsInBand, inBlock: allClaimedInsideTheBlock,
    paired: pairedSameSeeds, retired: retiredUntouched, n: N_RUN,
  },
  mutants: [
    { conjunct: 'noClaimedBlockTouchesAConsumedOne', name: 'a consumed block was re-entered', mutate: (i) => ({ ...i, clashes: 1 }) },
    { conjunct: 'noTwoClaimedBlocksOverlap', name: 'two claimed blocks overlapped', mutate: (i) => ({ ...i, internal: 1 }) },
    { conjunct: 'everyWalkedBatterySeedIsInsideItsClaimedBlock', name: 'a walked seed escaped its block', mutate: (i) => ({ ...i, inBand: false }) },
    { conjunct: 'everyWalkedTrajectorySeedIsInsideItsClaimedBlock', name: 'a trajectory seed escaped', mutate: (i) => ({ ...i, trajInBand: false }) },
    { conjunct: 'everyClaimedBlockIsInsideTheRuledBand', name: 'a block left the ruled band', mutate: (i) => ({ ...i, inBlock: false }) },
    { conjunct: 'theArmsWalkTheSameSeeds', name: 'the arms unpaired', mutate: (i) => ({ ...i, paired: false }) },
    { conjunct: 'theRetiredBlockIsNEVERTouched', name: 'the tainted block was re-entered', mutate: (i) => ({ ...i, retired: false }) },
    { conjunct: 'nonVacuousBatterySize', name: 'the battery was empty', mutate: (i) => ({ ...i, n: 0 }) },
  ],
});

/* ---- 17 gStats ---- */
registerGate<{ base: number; gap: number; boot: number; floor: number }>({
  name: 'gStats',
  fn: (i) => ({
    theStreamOpensAtTheRuledFloor: i.base === i.floor,
    theStreamClearsEveryPublishedBaseByTheLatticeStep: i.gap >= STATS_STEP,
    theResampleCountIsTheFrozenOne: i.boot === 2000,
  }),
  input: {
    base: STATS_BASE,
    gap: Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b))),
    boot: BOOTSTRAP, floor: 113_600,
  },
  mutants: [
    { conjunct: 'theStreamOpensAtTheRuledFloor', name: 'the stats floor was ignored', mutate: (i) => ({ ...i, base: 1 }) },
    { conjunct: 'theStreamClearsEveryPublishedBaseByTheLatticeStep', name: 'a stats stream collided', mutate: (i) => ({ ...i, gap: 1 }) },
    { conjunct: 'theResampleCountIsTheFrozenOne', name: 'the resample count moved', mutate: (i) => ({ ...i, boot: 10 }) },
  ],
});

/* ---- 18 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnEnvVarIsSet: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    thisIsNotAnOverrideRun: !i.preflight,
    theCanonicalPathIsTheOneWritten: i.out === OUT_BY_MODE[MODE],
  }),
  input: {
    rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH,
  },
  mutants: [
    { conjunct: 'noRogueOwnEnvVarIsSet', name: 'a rogue PCT2_* var was set', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'thisIsNotAnOverrideRun', name: 'an override wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true }) },
    { conjunct: 'theCanonicalPathIsTheOneWritten', name: 'the artifact went somewhere else', mutate: (i) => ({ ...i, out: '/tmp/x.json' }) },
  ],
});

/* ---- ⭐ THE PERCENTILE FACES, FROM STORED BINS (PC-C0 §CORRECTIONS 4's canon) ---- */
const percentileFromBins = (bins: readonly number[], q: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= q * total) return round(SEP_BIN_LO + (i + 0.5) * SEP_BIN_W, 6);
  }
  return round(SEP_BIN_LO + (bins.length - 0.5) * SEP_BIN_W, 6);
};
const sepPercentiles = Object.fromEntries(ARMS.map((a) => [a, {
  deltaSepP50Metres: percentileFromBins(sepByArm[a].dSepBins, 0.5),
  deltaSepP90Metres: percentileFromBins(sepByArm[a].dSepBins, 0.9),
  binLowEdgeMetres: SEP_BIN_LO, binWidthMetres: SEP_BIN_W, bins: sepByArm[a].dSepBins,
}]));

/* ---- gFaces: re-derive EVERY published face by PARSING THE SERIALIZED ARTIFACT ---- */
const facesFromDisk = { checked: 0, bad: [] as string[], parsed: false };
const rederiveFacesFromDisk = (p: string): void => {
  facesFromDisk.checked = 0;
  facesFromDisk.bad = [];
  facesFromDisk.parsed = false;
  let file: Record<string, unknown>;
  try { file = readJson(p); } catch { facesFromDisk.bad.push('PARSE'); return; }
  const cells = file.perSeedCells as Record<string, Record<string, unknown>[]> | undefined;
  const faces = file.faces as { face: string; arms: Record<string, { point: unknown }> }[]
    | undefined;
  const sepBlock = file.sepPercentiles as Record<string, { deltaSepP50Metres: number;
    deltaSepP90Metres: number; bins: number[] }> | undefined;
  if (cells === undefined || faces === undefined || sepBlock === undefined) {
    facesFromDisk.bad.push('SHAPE');
    return;
  }
  facesFromDisk.parsed = true;
  const parsed = Object.fromEntries(ARMS.map((a) => [a, (cells[a] ?? []).map(rowFromCell)]));
  for (const f of faces) {
    const spec = FACES[f.face];
    if (spec === undefined) { facesFromDisk.bad.push(`${f.face}(UNKNOWN)`); continue; }
    for (const arm of ARMS) {
      facesFromDisk.checked += 1;
      const rowsA = parsed[arm];
      const want = ratio(sum(rowsA.map(spec.num)), sum(rowsA.map(spec.den)));
      const got = f.arms[arm].point;
      if (got === 'UNMEASURED') {
        if (Number.isFinite(want)) facesFromDisk.bad.push(`${arm}.${f.face}(CLAIMED-UNMEASURED)`);
        continue;
      }
      if (!Number.isFinite(want) || Math.abs(want - Number(got)) > 1e-6) {
        facesFromDisk.bad.push(`${arm}.${f.face}`);
      }
    }
  }
  /** ⭐ the PERCENTILE faces re-derive FROM THE STORED BINS, not from a live array. */
  for (const arm of ARMS) {
    const stored = sepBlock[arm];
    facesFromDisk.checked += 2;
    if (Math.abs(percentileFromBins(stored.bins, 0.5) - stored.deltaSepP50Metres) > 1e-9) {
      facesFromDisk.bad.push(`${arm}.deltaSepP50Metres`);
    }
    if (Math.abs(percentileFromBins(stored.bins, 0.9) - stored.deltaSepP90Metres) > 1e-9) {
      facesFromDisk.bad.push(`${arm}.deltaSepP90Metres`);
    }
  }
};

/* ---- 19 gFaces ---- */
const facesGateInput = {
  disk: facesFromDisk,
  memBad: faceRederivationInMemory.bad,
  memChecked: faceRederivationInMemory.checked,
};
registerGate<typeof facesGateInput>({
  name: 'gFaces',
  fn: (i) => ({
    everyPublishedFaceREDERIVESFromTheSerializedArtifact: i.disk.bad.length === 0,
    theArtifactWasActuallyParsedOffDisk: i.disk.parsed,
    nonVacuousFaceCount: i.disk.checked > 0,
    theInMemoryCrossCheckAlsoAgrees: i.memBad === 0 && i.memChecked > 0,
  }),
  input: facesGateInput,
  mutants: [
    { conjunct: 'everyPublishedFaceREDERIVESFromTheSerializedArtifact', name: 'a face did not re-derive', mutate: (i) => ({ ...i, disk: { ...i.disk, bad: ['x'] } }) },
    { conjunct: 'theArtifactWasActuallyParsedOffDisk', name: 'the artifact was never read back', mutate: (i) => ({ ...i, disk: { ...i.disk, parsed: false } }) },
    { conjunct: 'nonVacuousFaceCount', name: 'no face was checked', mutate: (i) => ({ ...i, disk: { ...i.disk, checked: 0 } }) },
    { conjunct: 'theInMemoryCrossCheckAlsoAgrees', name: 'the in-memory cross-check disagreed', mutate: (i) => ({ ...i, memBad: 1 }) },
  ],
});

/* ---- 20 ⭐⭐ gSchema — THE ALLOWLIST SCHEMA (canon: PC-T0 §CORRECTIONS item 1) ---- */
const schemaInput = {
  violations: [] as string[], schemaKeys: 0,
  refusesUnknownField: false, refusesMissingField: false, refusesObjectInLeaf: false,
  refusesAWallClockField: false,
};
registerGate<typeof schemaInput>({
  name: 'gSchema',
  fn: (i) => ({
    theHashedBodyVIOLATESNothingInTheAllowlistSchema: i.violations.length === 0,
    theSchemaIsNonTrivial: i.schemaKeys > 50,
    theSchemaREFUSESAnUnknownField: i.refusesUnknownField,
    theSchemaREFUSESAMissingField: i.refusesMissingField,
    theSchemaREFUSESAnObjectSmuggledIntoALeafSlot: i.refusesObjectInLeaf,
    theSchemaREFUSESAWallClockTiming: i.refusesAWallClockField,
  }),
  input: schemaInput,
  mutants: [
    { conjunct: 'theHashedBodyVIOLATESNothingInTheAllowlistSchema', name: 'a field escaped the schema', mutate: (i) => ({ ...i, violations: ['$.x'] }) },
    { conjunct: 'theSchemaIsNonTrivial', name: 'the schema was a stub', mutate: (i) => ({ ...i, schemaKeys: 1 }) },
    { conjunct: 'theSchemaREFUSESAnUnknownField', name: 'the schema admitted an unknown field', mutate: (i) => ({ ...i, refusesUnknownField: false }) },
    { conjunct: 'theSchemaREFUSESAMissingField', name: 'the schema admitted a missing field', mutate: (i) => ({ ...i, refusesMissingField: false }) },
    { conjunct: 'theSchemaREFUSESAnObjectSmuggledIntoALeafSlot', name: 'the PC-T0 breach class returned', mutate: (i) => ({ ...i, refusesObjectInLeaf: false }) },
    { conjunct: 'theSchemaREFUSESAWallClockTiming', name: 'a timing could enter the body', mutate: (i) => ({ ...i, refusesAWallClockField: false }) },
  ],
});

/* ---- 21 gEnvelope ---- */
const envelopeInput = {
  crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[],
};
registerGate<typeof envelopeInput>({
  name: 'gEnvelope',
  fn: (i) => ({
    theBodyRederivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest: i.crossOutIdentical,
    noInvocationFactIsInTheHashedBody: i.forbidden.length === 0,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyRederivesItsDigestFromDisk', name: 'the artifact on disk did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest', name: 'the envelope entered the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'noInvocationFactIsInTheHashedBody', name: 'a wall-clock field entered the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- 22 gMutants ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    noUncoveredConjunctNoGhostNoDuplicate: i.uncovered.length === 0,
    everyMutantIsLive: i.dead === 0,
    nonVacuousMutantCount: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'noUncoveredConjunctNoGhostNoDuplicate', name: 'a conjunct owned no mutant', mutate: (i) => ({ ...i, uncovered: ['x'] }) },
    { conjunct: 'everyMutantIsLive', name: 'a mutant was dead', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'nonVacuousMutantCount', name: 'no mutant ran', mutate: (i) => ({ ...i, total: 0 }) },
  ],
});

/* ========================================================================== */
/* §19 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
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
  banner('PC-T2 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §20 ⭐⭐ THE ALLOWLIST SCHEMA — canon, home PC-T0 §COMMANDER CORRECTIONS 1    */
/* ========================================================================== */
/**
 * > *"the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
 * > never enters the body; forbidden-name lists are retired"*
 * >   — PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1, verbatim.
 *
 * ⭐ AND ITS SECOND RIDE MUST SURVIVE A PATH-VARIED RE-RUN (the PC-T0 voiding lesson): the
 * cross-OUT written to a DIFFERENT path with a DIFFERENT envelope must produce the IDENTICAL
 * digest, which is `gEnvelope`'s middle conjunct — proven on real files, not argued.
 */
type SchemaNode = 'LEAF' | { [k: string]: SchemaNode } | [SchemaNode];
const LEAF: SchemaNode = 'LEAF';
const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
const primitiveOk = (v: unknown): boolean =>
  v === null || ['string', 'number', 'boolean'].includes(typeof v);
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

/** node builders — the key sets come from the DECLARED interfaces, never from the body. */
const nodeOf = (keys: readonly string[]): SchemaNode =>
  Object.fromEntries(keys.map((k) => [k, LEAF])) as SchemaNode;
const LIFECYCLE_NODE = nodeOf(Object.keys(EMPTY_LIFECYCLE));
const PCLEDGER_NODE = nodeOf([...PC_LEDGER_KEYS, 'firingsByClass']);
const CENSUS_NODE = nodeOf(CENSUS_KEYS);
const SEP_NODE = nodeOf(Object.keys(emptySepCensus()));
const TERMINAL_NODE = nodeOf(TERMINALS);
const CELL_NODE: SchemaNode = {
  seed: LEAF, sig: LEAF, armOk: LEAF, life: LIFECYCLE_NODE, pc: PCLEDGER_NODE, sep: SEP_NODE,
  armsByCell: LEAF, simpleByCell: LEAF, armsByRole: LEAF, simpleByRole: LEAF,
  coveredAtN: LEAF, bookExp: LEAF, rec: LEAF, recP: LEAF,
  atRec: CENSUS_NODE, atRecP: CENSUS_NODE, atCar: CENSUS_NODE,
  carS: LEAF, carSP: LEAF, hist: LEAF, histP: LEAF,
  att: LEAF, attU: LEAF, attFE: LEAF, attBM: LEAF, attLM: LEAF,
  cmp: LEAF, cmpF: LEAF, cmpB: LEAF, cmpL: LEAF,
  eP: LEAF, ePF: LEAF, ePC: LEAF, eTk: LEAF, eIn: LEAF,
  spells: LEAF, openSpells: LEAF, openTicks: LEAF, openTouches: LEAF,
  termAll: TERMINAL_NODE, termOpen: TERMINAL_NODE,
  presEndN: LEAF, presEndL: LEAF, freeEndN: LEAF, freeEndL: LEAF,
  presEndByTier: LEAF, presEndLostByTier: LEAF,
  ticks: LEAF, inPlay: LEAF, simS: LEAF, goals: LEAF,
};
const ARM_LEVEL_NODE: SchemaNode = { point: LEAF, num: LEAF, den: LEAF, ci95: LEAF };
const CONTRAST_NODE: SchemaNode = {
  delta: LEAF, ci95: LEAF, relative: LEAF, resolved: LEAF,
  absDeltaOverHalfWidth: LEAF, strength: LEAF,
};
const CI_LIMB_NODE: SchemaNode = {
  coveredSimple: LEAF, coveredArms: LEAF, uncoveredSimple: LEAF, uncoveredArms: LEAF,
  coveredShare: LEAF, uncoveredShare: LEAF, gap: LEAF, gapCi95: LEAF, gapOverHalfWidth: LEAF,
};

/* ========================================================================== */
/* §21 THE ARTIFACT                                                            */
/* ========================================================================== */
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what,
  armStructural: FACES[f.face].armStructural === true,
  arms: Object.fromEntries(ARMS.map((a) => {
    const v = f.arms[a];
    return [a, {
      point: v.den === 0 ? 'UNMEASURED' : round(v.point), num: v.num, den: v.den,
      ci95: v.den === 0 ? 'UNMEASURED' : v.ci95.map((x) => round(x)),
    }];
  })),
  contrasts: Object.fromEntries(Object.entries(f.contrasts).map(([k, c]) => {
    const resolved = resolvedPositive(c.ci95) || resolvedNegative(c.ci95);
    const r = ratioToHalfWidth(c.delta, c.ci95);
    return [k, {
      delta: round(c.delta), ci95: c.ci95.map((x: number) => round(x)),
      relative: round(c.relative), resolved,
      absDeltaOverHalfWidth: round(r, 4),
      strength: !Number.isFinite(r) ? 'UNMEASURED'
        : r < 1 ? 'UNRESOLVED' : r < 2 ? '⚠ MARGINAL (within 2× of its half-width)' : 'RESOLVED',
    }];
  })),
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: '⭐⭐ PC-T2 — THE ARMED-WORLD READ (H-PC.1 SCORED; H-PC.2 REPORTED)',
  doc: 'docs/world-model/PC-T2-ARMED-WORLD-READ.md',
  contract: 'docs/world-model/PC-PERCEPTION-CONTRACT.md §1 (H-PC.1 scored / H-PC.2 reported) · '
    + '§2 M-PC.1–5; authorized by ruling #299 item 6; the bases are PC-C0 / PC-T0 / PC-T1 and '
    + 'BU-C0 / L3-T1 / L3-T2 / CB-C0 / CB-T2, INCLUDING every §COMMANDER CORRECTIONS OF RECORD '
    + '(#297 · #298 · #299 · #286 · #266.2(i)).',
  mode: MODE, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST, engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: '本方被过掉的人真的慢半拍了吗?—— and does the world that has LEARNED to read '
      + 'itself play different football from the world that has not?',
    arms: {
      v7: 'THE BASE — `new Match({seed, teams, ...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
        + 'poolT1DoseCells(L3-T1))`: the CB layer (commit physics + touch-past + the choice seat '
        + 'at the declared proneness) + the two L3 book doors at the shipped matured dose. DV, '
        + 'MT/PM, PTP and PW stay SHUT on every arm. NO PC seat exists at all.',
      v7pcEmpty: 'THE WEAK FORM — the same world plus `pcReactionLatency` with BORN-ABSENT '
        + 'books. This is where every match of a season-reset world actually starts, and it is '
        + 'the honest contrast the entry rung will need.',
      v7pcMatured: '⭐⭐ THE PRIMARY ARM — the same world plus `pcReactionLatency` with '
        + 'TRUTH-DOSED books, written at match construction through the SHIPPED writer from '
        + 'PC-T1\'s committed per-book cells (the L3-T2 arm-C idiom).',
    },
    doseProvenance: {
      source: `${PC_T1_PATH} · perBookCells[].armsByBodyCell, read AT RUN TIME, never typed`,
      arithmetic: 'dose[rosterIdx][cell] = round( Σ_books Σ_sides armsByBodyCell[side·'
        + `${ROSTER_SIZE} + rosterIdx][cell] ÷ (books × sides × seasons) ) — the MEAN `
        + 'END-OF-SEASON exposures a body in that roster slot lived in that cell. M-PC.3 wipes '
        + 'the book every season, so the end-of-season book is the state a matured world '
        + 'actually reaches.',
      books: PC_DOSE_SOURCE.books, seasons: PC_DOSE_SOURCE.seasons, sides: PC_DOSE_SOURCE.sides,
      denominator: PC_DOSE_SOURCE.denom,
      writtenThrough: 'PcRecognitionBook.note(rosterIdx, key) — the ONLY way a cell moves in '
        + 'the shipped seam, so a dosed book is a state the world could itself have reached.',
      totalExposuresPerBook: PC_DOSE_EXPOSURES,
      slotCellsAtOrAboveNCover: PC_DOSE_COVERED_CELLS,
      slotCells: ROSTER_SIZE * N_CELLS,
      doseCoveredCellsAtMedianSlot: DOSE_COVERED_CELL_COUNT,
      table: PC_DOSE,
      cellOrder: PC_BOOK_CELLS,
      guard: '⭐ #289 CANON: the dose-source guard hashes FILE BYTES, and the artifact must '
        + 'also re-derive its OWN committed resultSha256 (gSources).',
      pooledAcrossSidesBecause: '⚠ DECLARED: PC-T2 redraws squads per fixture (the banked '
        + 'draw), so a side-asymmetric dose would be an artefact of PC-T1\'s fixed franchises '
        + 'rather than a fact about the slot. The dose is a LEVEL, not a personalised book.',
    },
    hPc1Rule: H_PC1_RULE,
    clock: clockReceipt,
    preRegisteredReads: [
      '⭐ H-PC.2, PRE-REGISTERED (doctrine §1/§3): completion UP · interception DOWN at SIM '
        + 'grain · lanes open at SIM grain WHILE THE PRICED CORRIDOR STANDS STILL (expected and '
        + 'honest, contract §4 — the chooser\'s oracle is full-truth and cannot see a '
        + 'defender\'s processing time) · pressing differentiates by the VICTIM\'S tier.',
      '⭐ H-PC.1 (a) PRE-REGISTERED: the matured arm\'s pooled SIMPLE share is resolvedly above '
        + 'the empty arm\'s AND covered cells pay SIMPLE where uncovered cells pay CHOICE.',
      '⭐ H-PC.1 (b) PRE-REGISTERED: the carrier-anchored Δsep at the touch-past turns POSITIVE.',
      '⚠ AN INVERSION ROUTES TO DIAGNOSIS, NEVER TO A CORRECTION OF THIS TABLE (#246).',
      '⭐ NO GATE IN THIS PROBE READS A FOOTBALL NUMBER. The gates prove the instrument.',
    ],
    movingDenominators: [
      '⚠ THE Δsep FACES are conditioned on knocks happening: `knocksPerMatch` is published so '
        + 'the denominator\'s own movement is visible, and the by-tier limbs have their own Ns.',
      '⚠ THE PRESSING FACES are conditioned on a spell ENDING under pressure: '
        + '`pressedEndShareOfOpenSpells` is the denominator, published.',
      '⚠ THE CORRIDOR-SURVIVAL faces are conditioned on the L3 race-winner set; the END-TO-END '
        + 'faces (L4/L1) are the denominator-stable ones and are published beside them.',
      '⚠ THE TIER FACES have no base-arm denominator AT ALL (no seat exists) — they are '
        + 'declared `armStructural` and their only honest contrast is MATURED vs EMPTY.',
      '⚠ THE TERMINAL CENSUS is L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §COMMANDER CORRECTIONS '
        + 'item 3); every arm carries the veto so the CONTRASTS are entanglement-free.',
    ],
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing".',
      pressedReception: `a reception whose receiver has an opponent within ${PRESSURE_R} m `
        + `(TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      pressedCarrierMoment: `a NON-reception carrier tick sampled every ${CARRIER_SAMPLE_TICKS} `
        + `ticks (${round(CARRIER_SAMPLE_TICKS * DT, 4)} sim-s) at which the carrier is pressed.`,
      knock: 'a tick at which the engine\'s own `cbLedger.touchPasts` counter moves.',
      beatenDefender: `an opponent inside CONTEST_RADIUS (${CONTEST_RADIUS} m) of the ball at `
        + 'the knock whom the engine\'s own `beatsDefender` says the geometry beat.',
      openPlaySpell: 'the #173 / R-乙 Q01 segmentation VERBATIM.',
    },
    optionLadder: 'BU-C0\'s ladder VERBATIM in definition (L1 POSITION on Q07\'s own ±2 m band, '
      + `EXTRACTED from ${MECH_SRC_PATH}:${FORWARD_BAND_LINE} · L2 the engine's own flight `
      + 'prediction · L3 arrivalMargin > 0 · L4 the engine\'s corridor sampler), GK-SPLIT at '
      + 'every behind-ball rung (BU-C0 §COMMANDER CORRECTIONS item 1).',
    separationInstrument: '⭐⭐ #266.2(i)\'s CARRIER-ANCHORED instrument, home CB-C0-'
      + 'DISPOSSESSION-CENSUS.md §RATIFIED: *"any CB exam consuming a separation baseline MUST '
      + 're-measure with a carrier-anchored t0"*. sep = |defender − CARRIER| at BOTH ends, '
      + `never defender→ball. Window = ${SEP_WINDOW_TICKS} applied ticks = `
      + `${round(SEP_WINDOW_TICKS * DT, 4)} sim-s, the APPLIED window law of record `
      + '(#280.2(iii)), re-derived from the engine\'s own L3_DEFENCE_WINDOW_S.',
    estimator: `PAIRED cluster bootstrap by match seed, ${BOOTSTRAP} resamples, percentile 95 % `
      + 'CI, ratio of sums; ONE resample-index matrix drawn once and shared by every face and '
      + 'EVERY arm, so a contrast and its levels are always the SAME resampled worlds.',
    sizing: `N = ${N_FROZEN} paired seeds × 3 arms. ⚠ a face inside 2× of its half-width is `
      + 'MARGINAL and is NEVER rounded up (the `strength` field applies the rule by machine).',
    terminalClasses: TERMINALS,
    recognitionKey: 'class × pressed × relation (#297 item 4 H1) — 7 × 2 × 2 = 28 cells.',
    cellOrder: PC_BOOK_CELLS,
    classOrder: PC_CLASSES,
    roleOrder: ROLE_LIST,
    tierOrder: SEP_TIERS,
    nCover: PC_N_COVER,
    nCoverBand: N_BAND,
    relevanceRadiusMetres: PC_RELEVANCE_M,
    pressureRadiusMetres: PRESSURE_R,
    forwardBandMetres: FORWARD_BAND_M,
    histogramTopBucket: HIST_MAX,
    minArmsPerCellForSpread: MIN_ARMS_PER_CELL,
  },
  run: {
    N: N_RUN, base: BASE_RUN, arms: ARMS.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    doorsMatrixWalks: LIFECYCLE_SEEDS.length * ALL_DOOR_CELLS.length,
    trajectoryWalks: C.battery.traj.length * 2,
    receptions: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.receptions))])),
    openSpells: Object.fromEntries(ARMS.map((a) => [a, sum(rowsOf(a).map((r) => r.openSpells))])),
    knocks: Object.fromEntries(ARMS.map((a) => [a, sepByArm[a].knocks])),
    arms_: Object.fromEntries(ARMS.map((a) => [a, pcLedgerByArm[a].arms])),
    oracleCalls: sum(allRows().map((r) => r.atReceptions.oracleCalls)),
  },
  armingLifecycle: {
    debt: 'M-BU.2 / #269.2(iv) — the clearTouchPastArming staleness class, PROVEN AT THE NEW '
      + 'CB+L3+PC COMPOSITION (#287.3 discharged CB+L3+DV, #289 CB+L3+MT, #295 CB+L3+PW), '
      + 'TOGETHER WITH the PC seam\'s own deposit-analogue, the SEAT.',
    law: 'A DICHOTOMY plus the PC clause: (a) in every cell where an aim CAN fire, no arming '
      + 'survives its own tick; (b) in every cell where armings persist (choice-armed without '
      + 'capability — the S∧¬T EXHIBIT), ZERO knocks fire; (c) in EVERY cell with the PC door '
      + 'shut, the seat DOES NOT EXIST — no ledger, no hold map, no book.',
    scope: '⚠ o2Look, ekHoldVeto, PTP, PW, DV and MT are NOT armed here, so the discharge is '
      + 'for CB+L3+PC ONLY; their own compositions remain UNDISCHARGED.',
    nonVacuity: 'the exposure is REAL: o1PassWindup and c7Windup (two early returns above the '
      + 'seat\'s arm/withdraw block) ARE armed in the v7 substrate.',
    firingHalf: lifecycleMatrix.firing,
    inertHalf: lifecycleMatrix.inert,
    pcDoorOpenHalf: lifecycleMatrix.pcOn,
    pcDoorShutHalf: lifecycleMatrix.pcOff,
    pcLedgerWithTheDoorOpen: lifecycleMatrix.pcOnLedger,
    pcLedgerWithTheDoorShut: lifecycleMatrix.pcOffLedger,
    total: lifecycleMatrix.total,
    cellsWalked: lifecycleMatrix.cells,
    firingCellWalks: lifecycleMatrix.firingCells,
    inertCellWalks: lifecycleMatrix.inertCells,
    sAndNotTCellsHoldingAnArming: lifecycleMatrix.persistingCells.length,
    seatNullWalksWithTheDoorShut: lifecycleMatrix.seatNullWithDoorShut,
    seatLiveWalksWithTheDoorOpen: lifecycleMatrix.seatLiveWithDoorOpen,
    measuredBattery: batteryLifecycle,
    structure: {
      armCallSites: lifecycleStructure.armCallSites,
      clearCallSites: lifecycleStructure.clearCallSites,
      slotClearedInSrc: lifecycleStructure.slotClearedInSrc,
      fireForks: lifecycleStructure.fireForks,
      pcSeatForks: lifecycleStructure.pcSeatForks,
      pcDetectorSites: lifecycleStructure.pcDetectorSites,
      pcDetectorCalls: lifecycleStructure.pcDetectorCalls,
      pcExecutorGates: lifecycleStructure.pcExecutorGates,
      pcForgetBodyCalls: lifecycleStructure.pcForgetBodyCalls,
      pcDecisionTimerWrites: lifecycleStructure.pcDecisionTimerWrites,
      pcTokensInTeamBrain: lifecycleStructure.pcTokensInTeamBrain,
      pcTokensInPlayerBrain: lifecycleStructure.pcTokensInPlayerBrain,
      pcModuleImportLines: lifecycleStructure.pcModuleImportLines,
      o2LookArmed: lifecycleStructure.o2LookArmed,
      ekHoldVetoArmed: lifecycleStructure.ekHoldVetoArmed,
      o1PassWindupArmed: lifecycleStructure.o1PassWindupArmed,
      c7WindupArmed: lifecycleStructure.c7WindupArmed,
      ptpArmed: lifecycleStructure.ptpArmed,
      stationEyeNull: lifecycleStructure.stationEyeNull,
      lines: lifecycleStructure.lines,
    },
    unitNote: '⚠ the cell counts above are WALKS (cells × seeds), not distinct flag cells; and '
      + '⭐ these are ARMING RECEIPTS, NOT FOOTBALL FINDINGS (#289 item 1).',
  },
  doorsMatrix: {
    axes: 'C cbCommitPhysics · T cbTouchPast · S cbChoiceSeat(+proneness) · L l3DefenceLearn'
      + '(+dose) · V l3DefenceVeto · ⭐⭐ P pcReactionLatency(+the MATURED recognition dose)',
    substrate: 'a4MatchFlags(3) — CALLED, not copied',
    cells: ALL_DOOR_CELLS.length,
    seeds: LIFECYCLE_SEEDS,
    identityLaws: [
      'cbTouchPast is INERT without the choice seat (nothing can write the arming slot)',
      'l3DefenceLearn is INERT without the veto (the book fills, nothing reads it)',
      'l3DefenceVeto is INERT without the learning door (there is no book to read)',
      '⭐⭐ pcReactionLatency SHUT ⇒ the seat is STRUCTURALLY ABSENT: `m.pcLatency === null` at '
        + 'every step boundary and at the whistle, the whole ledger is all-zero, and no book '
        + 'holds a single exposure — an unreachability, not an inertness',
    ],
    inertnessChecked: doorsAlways.checked,
    inertnessFailures: doorsAlways.fail,
    liveness: doorsLive,
  },
  hPc1,
  cellGrainSplit: {
    definition: 'DOSE-COVERED cells = the dose reaches N_cover for the MEDIAN roster slot. The '
      + 'gap is (SIMPLE share in covered cells) − (SIMPLE share in uncovered cells), paired by '
      + 'seed over the SAME bootstrap draws.',
    matured: {
      coveredSimple: cellGrainSplit.matured.coveredSimple,
      coveredArms: cellGrainSplit.matured.coveredArms,
      uncoveredSimple: cellGrainSplit.matured.uncoveredSimple,
      uncoveredArms: cellGrainSplit.matured.uncoveredArms,
      coveredShare: round(cellGrainSplit.matured.coveredShare),
      uncoveredShare: round(cellGrainSplit.matured.uncoveredShare),
      gap: round(cellGrainSplit.matured.gap),
      gapCi95: cellGrainSplit.matured.gapCi95.map((x) => round(x)),
      gapOverHalfWidth: round(cellGrainSplit.matured.gapOverHalfWidth, 4),
    },
    empty: {
      coveredSimple: cellGrainSplit.empty.coveredSimple,
      coveredArms: cellGrainSplit.empty.coveredArms,
      uncoveredSimple: cellGrainSplit.empty.uncoveredSimple,
      uncoveredArms: cellGrainSplit.empty.uncoveredArms,
      coveredShare: round(cellGrainSplit.empty.coveredShare),
      uncoveredShare: round(cellGrainSplit.empty.uncoveredShare),
      gap: round(cellGrainSplit.empty.gap),
      gapCi95: cellGrainSplit.empty.gapCi95.map((x) => round(x)),
      gapOverHalfWidth: round(cellGrainSplit.empty.gapOverHalfWidth, 4),
    },
  },
  perCellTierTable: PC_BOOK_CELLS.map((cell, i) => ({
    cell,
    doseMedianSlot: PC_DOSE.map((rw) => rw[i]).slice().sort((x, y) => x - y)[
      Math.floor(ROSTER_SIZE / 2)],
    doseCovered: DOSE_CELL_COVERED[i],
    maturedArms: cellArmsByArm.v7pcMatured.arms[i],
    maturedSimple: cellArmsByArm.v7pcMatured.simple[i],
    maturedSimpleShare: round(ratio(cellArmsByArm.v7pcMatured.simple[i],
      cellArmsByArm.v7pcMatured.arms[i])),
    emptyArms: cellArmsByArm.v7pcEmpty.arms[i],
    emptySimple: cellArmsByArm.v7pcEmpty.simple[i],
    emptySimpleShare: round(ratio(cellArmsByArm.v7pcEmpty.simple[i],
      cellArmsByArm.v7pcEmpty.arms[i])),
  })),
  roleFace: {
    note: '⭐ H2 IS REPORTED, NEVER SCORED (#297 item 4 H2). PC-T1\'s finding of record stands: '
      + 'outfield reaction is ROLE-FLAT and the mechanism differentiates by SITUATION.',
    rows: ROLE_LIST.map((r, i) => ({
      role: r,
      maturedArms: cellArmsByArm.v7pcMatured.arms.length === 0 ? 0
        : sum(rowsOf('v7pcMatured').map((x) => x.armsByRole[i])),
      maturedSimple: sum(rowsOf('v7pcMatured').map((x) => x.simpleByRole[i])),
      maturedSimpleShare: round(ratio(
        sum(rowsOf('v7pcMatured').map((x) => x.simpleByRole[i])),
        sum(rowsOf('v7pcMatured').map((x) => x.armsByRole[i])))),
    })),
  },
  censusConfusion: confusionTable,
  rankInvariance,
  supplyTrajectory: trajectory,
  sepPercentiles,
  sepReceipt,
  faces: C.faces.map(pubFace),
  behindOptionHistogram: Object.fromEntries(ARMS.map((a) => [a, {
    allReceptions: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rowsOf(a).map((r) => r.behindHist[k]))),
    pressedReceptions: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rowsOf(a).map((r) => r.behindHistPressed[k]))),
    denominator: sum(rowsOf(a).map((r) => r.receptions)),
    pressedDenominator: sum(rowsOf(a).map((r) => r.receptionsPressed)),
  }])),
  gkSplitLadder: Object.fromEntries(ARMS.map((a) => [a, {
    L1: sum(rowsOf(a).map((r) => r.atReceptions.behind)),
    L1gk: sum(rowsOf(a).map((r) => r.atReceptions.behindGk)),
    L2: sum(rowsOf(a).map((r) => r.atReceptions.behindFlight)),
    L2gk: sum(rowsOf(a).map((r) => r.atReceptions.behindFlightGk)),
    L3: sum(rowsOf(a).map((r) => r.atReceptions.behindRace)),
    L3gk: sum(rowsOf(a).map((r) => r.atReceptions.behindRaceGk)),
    L4: sum(rowsOf(a).map((r) => r.atReceptions.behindUncut)),
    L4gk: sum(rowsOf(a).map((r) => r.atReceptions.behindUncutGk)),
    receptions: sum(rowsOf(a).map((r) => r.receptions)),
  }])),
  terminalCensus: Object.fromEntries(ARMS.map((a) => [a, {
    openPlay: Object.fromEntries(TERMINALS.map((t) => [t,
      sum(rowsOf(a).map((r) => r.terminalOpen[t]))])),
    openDenominator: sum(rowsOf(a).map((r) => r.openSpells)),
    allDenominator: sum(rowsOf(a).map((r) => r.spells)),
    entanglement: '⚠ L3-VETO ENTANGLED AT THE LEVEL (BU-C0 §COMMANDER CORRECTIONS item 3); the '
      + 'CONTRAST is entanglement-free because every arm carries the veto.',
  }])),
  pcLedgerByArm,
  conservation,
  spellReceipt,
  tierSplitReceipt,
  histReceipt,
  perturbCheck,
  vacuity,
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, rowsOf(a).map(cellOf)])),
  trajectoryCells: C.battery.traj.map(trajCellOf),
  sources: {
    l3Dose: `${L3_T1_PATH} · poolT1DoseCells (the SHIPPED world-7 entry's own pooling)`,
    l3DoseFileBytesSha256: L3_BYTES_SHA,
    l3DoseDeclaredBytesSha256: L3_T1_FILE_BYTES_SHA,
    l3DoseCells: L3_DOSE, l3DoseLabels: L3_DOSE_LABELS,
    pcT1: PC_T1_PATH,
    pcT1FileBytesSha256: PCT1_BYTES_SHA,
    pcT1DeclaredBytesSha256: PC_T1_FILE_BYTES_SHA,
    pcT1CommittedResultSha256: pcT1CommittedSha,
    pcC0: PC_C0_PATH,
    pcC0FileBytesSha256: C0_BYTES_SHA,
    pcC0DeclaredBytesSha256: PC_C0_FILE_BYTES_SHA,
    pcC0CommittedResultSha256: pcC0CommittedSha,
    cbProneness: CB_WORLD_DOSE,
    houseLaw: '#270 — no dose anywhere in info.genome, asserted per walk in gArms.',
  },
  seeds: {
    block: BLOCK, claimed: CLAIMED, consumedLedger: CONSUMED,
    verifierScratchCanon: '⭐ #294 item 3, verbatim: "verifier scratch = the stage\'s consumed '
      + 'band or ≥ 900,000,000, never the next virgin block" — it binds the verifier of this '
      + 'stage too.',
    preflightBand: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1],
    retiredBlockNeverTouched: [12_494_000, 12_494_999],
  },
  stats: {
    base: STATS_BASE, bootstrapResamples: BOOTSTRAP, floorFromRuling: 113_600,
    latticeStep: STATS_STEP, unit: 'the MATCH SEED is the bootstrap cluster.',
  },
  faceRederivationInMemoryCrossCheck: faceRederivationInMemory,
  faceRederivationFromTheSerializedArtifact: {
    checked: facesFromDisk.checked, bad: facesFromDisk.bad, parsed: facesFromDisk.parsed,
  },
  unitNamingAudit: {
    canon: '⭐ #294 item 3, verbatim: "a field carries the unit its name claims" — GATED here '
      + '(`gUnits`), the gap PC-T1 §COMMANDER CORRECTIONS item 4 named.',
    violations: unitsInput.violations,
    checkedLeaves: unitsInput.checkedLeaves,
  },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ H-PC.1 IS SCORED HERE, ON A PRE-REGISTERED RULE — but NO GATE READS IT.',
    'H-PC.2 faces are REPORTED, never gated (contract §1).',
    'ZERO src edits: instrument-only, and `xSrcUntouched` proves it in the #286.1-corrected '
      + 'form (`git diff --stat HEAD -- src` AND `git status --porcelain -- src`).',
    '⚠ THIS IS NOT A SHIP DECISION. The entry rung is the NEXT stage\'s and the play-test is '
      + 'the USER\'S gate (过人时对面真的慢半拍了吗 · 逼抢读作时间攻击了吗 · 世界更像足球了吗).',
    '⚠ THE MATURED DOSE IS A SLOT-KEYED LEVEL, NOT A PERSONALISED BOOK: it transplants the '
      + 'mean end-of-season book of a ROSTER SLOT onto a randomly drawn squad.',
    '⚠ The oracle faces answer "could the engine\'s own machinery get the ball there" — '
      + 'capability, never choice, never perception; the PRICED corridor is expected to stand '
      + 'still (contract §4).',
    '⚠ The Δsep by-tier limbs are NOT a randomised contrast: a body pays SIMPLE precisely in '
      + 'the situations he has lived, so tier and situation are confounded by construction.',
    '⚠ The class predicates are PC-C0\'s, reused verbatim through the shipped detector; they '
      + 'can under- or over-count at the margin exactly as the census disclosed.',
  ],
});

/* ---- the schema, keyed by the REGISTRY's own names for the gate maps ---- */
const BODY_SCHEMA: SchemaNode = {
  stage: LEAF, doc: LEAF, contract: LEAF, mode: LEAF, preflight: LEAF, preflightReasons: LEAF,
  envWhitelist: LEAF, engineEnvDoorsRefused: LEAF,
  frozen: {
    question: LEAF,
    arms: { v7: LEAF, v7pcEmpty: LEAF, v7pcMatured: LEAF },
    doseProvenance: {
      source: LEAF, arithmetic: LEAF, books: LEAF, seasons: LEAF, sides: LEAF,
      denominator: LEAF, writtenThrough: LEAF, totalExposuresPerBook: LEAF,
      slotCellsAtOrAboveNCover: LEAF, slotCells: LEAF, doseCoveredCellsAtMedianSlot: LEAF,
      table: LEAF, cellOrder: LEAF, guard: LEAF, pooledAcrossSidesBecause: LEAF,
    },
    hPc1Rule: { a: LEAF, b: LEAF, both: LEAF, noGateReadsIt: LEAF },
    clock: nodeOf(Object.keys(clockReceipt)),
    preRegisteredReads: LEAF, movingDenominators: LEAF,
    populations: {
      reception: LEAF, pressedReception: LEAF, pressedCarrierMoment: LEAF, knock: LEAF,
      beatenDefender: LEAF, openPlaySpell: LEAF,
    },
    optionLadder: LEAF, separationInstrument: LEAF, estimator: LEAF, sizing: LEAF,
    terminalClasses: LEAF, recognitionKey: LEAF, cellOrder: LEAF, classOrder: LEAF,
    roleOrder: LEAF, tierOrder: LEAF, nCover: LEAF, nCoverBand: LEAF,
    relevanceRadiusMetres: LEAF, pressureRadiusMetres: LEAF, forwardBandMetres: LEAF,
    histogramTopBucket: LEAF, minArmsPerCellForSpread: LEAF,
  },
  run: {
    N: LEAF, base: LEAF, arms: LEAF, walks: LEAF, perturbationControls: LEAF,
    doorsMatrixWalks: LEAF, trajectoryWalks: LEAF,
    receptions: nodeOf(ARMS), openSpells: nodeOf(ARMS), knocks: nodeOf(ARMS),
    arms_: nodeOf(ARMS), oracleCalls: LEAF,
  },
  armingLifecycle: {
    debt: LEAF, law: LEAF, scope: LEAF, nonVacuity: LEAF,
    firingHalf: LIFECYCLE_NODE, inertHalf: LIFECYCLE_NODE,
    pcDoorOpenHalf: LIFECYCLE_NODE, pcDoorShutHalf: LIFECYCLE_NODE,
    pcLedgerWithTheDoorOpen: PCLEDGER_NODE, pcLedgerWithTheDoorShut: PCLEDGER_NODE,
    total: LIFECYCLE_NODE, cellsWalked: LEAF, firingCellWalks: LEAF, inertCellWalks: LEAF,
    sAndNotTCellsHoldingAnArming: LEAF, seatNullWalksWithTheDoorShut: LEAF,
    seatLiveWalksWithTheDoorOpen: LEAF, measuredBattery: LIFECYCLE_NODE,
    structure: {
      armCallSites: LEAF, clearCallSites: LEAF, slotClearedInSrc: LEAF, fireForks: LEAF,
      pcSeatForks: LEAF, pcDetectorSites: LEAF, pcDetectorCalls: LEAF, pcExecutorGates: LEAF,
      pcForgetBodyCalls: LEAF, pcDecisionTimerWrites: LEAF, pcTokensInTeamBrain: LEAF,
      pcTokensInPlayerBrain: LEAF, pcModuleImportLines: LEAF, o2LookArmed: LEAF,
      ekHoldVetoArmed: LEAF, o1PassWindupArmed: LEAF, c7WindupArmed: LEAF, ptpArmed: LEAF,
      stationEyeNull: LEAF, lines: nodeOf(Object.keys(lifecycleStructure.lines)),
    },
    unitNote: LEAF,
  },
  doorsMatrix: {
    axes: LEAF, substrate: LEAF, cells: LEAF, seeds: LEAF, identityLaws: LEAF,
    inertnessChecked: nodeOf(Object.keys(doorsAlways.checked)),
    inertnessFailures: nodeOf(Object.keys(doorsAlways.fail)),
    liveness: nodeOf(Object.keys(doorsLive)),
  },
  hPc1: {
    preRegisteredRule: { a: LEAF, b: LEAF, both: LEAF, noGateReadsIt: LEAF },
    a: {
      verdict: LEAF, pooledSimpleShareMatured: LEAF, pooledSimpleShareEmpty: LEAF,
      pooledContrastMaturedMinusEmpty: LEAF, pooledContrastCi95: LEAF,
      pooledContrastOverHalfWidth: LEAF, pooledLimbHolds: LEAF,
      cellGrainCoveredShare: LEAF, cellGrainUncoveredShare: LEAF, cellGrainGap: LEAF,
      cellGrainGapCi95: LEAF, cellGrainGapOverHalfWidth: LEAF, cellGrainLimbHolds: LEAF,
      doseCoveredCellCount: LEAF, cellCount: LEAF,
      emptyArmCellGrainGap: LEAF, emptyArmCellGrainGapCi95: LEAF,
      noiseFloorComparison: nodeOf(Object.keys(maxMinSpread)),
    },
    b: {
      verdict: LEAF, deltaSepMaturedMetres: LEAF, deltaSepEmptyMetres: LEAF,
      deltaSepBaseMetres: LEAF, contrastMaturedMinusBaseMetres: LEAF, contrastCi95Metres: LEAF,
      contrastOverHalfWidth: LEAF, contrastEmptyMinusBaseMetres: LEAF,
      contrastEmptyCi95Metres: LEAF, rowsMatured: LEAF, rowsBase: LEAF,
      windowAppliedTicks: LEAF, windowSimSeconds: LEAF,
      byDefenderTier: {
        what: LEAF, simpleTierDeltaSepMetres: LEAF, simpleTierN: LEAF,
        choiceTierDeltaSepMetres: LEAF, choiceTierN: LEAF, orderHolds: LEAF, disclosure: LEAF,
      },
    },
    verdict: LEAF,
  },
  cellGrainSplit: { definition: LEAF, matured: CI_LIMB_NODE, empty: CI_LIMB_NODE },
  perCellTierTable: [{
    cell: LEAF, doseMedianSlot: LEAF, doseCovered: LEAF, maturedArms: LEAF, maturedSimple: LEAF,
    maturedSimpleShare: LEAF, emptyArms: LEAF, emptySimple: LEAF, emptySimpleShare: LEAF,
  }],
  roleFace: {
    note: LEAF,
    rows: [{ role: LEAF, maturedArms: LEAF, maturedSimple: LEAF, maturedSimpleShare: LEAF }],
  },
  censusConfusion: {
    definition: LEAF, bothCovered: LEAF, bothUncovered: LEAF,
    predictedCoveredNotObserved: LEAF, observedCoveredNotPredicted: LEAF, unarmedCells: LEAF,
    classified: LEAF, cells: LEAF, closes: LEAF, agreementShare: LEAF,
    rows: [{ cell: LEAF, dosedMedian: LEAF, predicted: LEAF, arms: LEAF, simpleShare: LEAF,
      observed: LEAF, agrees: LEAF }],
  },
  rankInvariance: {
    method: LEAF, cellsCompared: LEAF, spearmanOrdinal: LEAF, sumSquaredRankDiff: LEAF,
    pairs: [{ cell: LEAF, t1: LEAF, t2: LEAF }],
  },
  supplyTrajectory: {
    what: LEAF, books: LEAF, fixturesPerSeason: LEAF, supplyProxy: LEAF,
    byFixture: [nodeOf(Object.keys(trajectory.byFixture[0]))],
    coldToWarmEngineEventRelativeChangeDelta: LEAF, armOkFixtures: LEAF, fixtures: LEAF,
  },
  sepPercentiles: Object.fromEntries(ARMS.map((a) => [a, nodeOf([
    'deltaSepP50Metres', 'deltaSepP90Metres', 'binLowEdgeMetres', 'binWidthMetres',
    'bins'])])) as SchemaNode,
  sepReceipt: {
    perArm: Object.fromEntries(ARMS.map((a) => [a, nodeOf([
      'knocks', 'challengers', 'beaten', 'measuredRows', 'censoredRows', 'rowsAccountedFor',
      'replicaMismatches', 'binsCloseOnMeasuredRows', 'nByTier', 'censoredWhistle',
      'censoredDeadBall', 'censoredMissingBody'])])) as SchemaNode,
    everyArmAccountsForEveryBeatenDefender: LEAF, noReplicaMismatchAnywhere: LEAF,
    binsClose: LEAF, theBaseArmHasNoTieredRows: LEAF, theMaturedArmHasBothTiers: LEAF,
    theTwoPcArmsBetweenThemCoverBothTiers: LEAF, simpleRowsMatured: LEAF,
    choiceRowsMatured: LEAF, simpleRowsEmpty: LEAF, choiceRowsEmpty: LEAF,
  },
  faces: [{
    face: LEAF, unit: LEAF, what: LEAF, armStructural: LEAF,
    arms: Object.fromEntries(ARMS.map((a) => [a, ARM_LEVEL_NODE])) as SchemaNode,
    contrasts: {
      v7pcEmpty: CONTRAST_NODE, v7pcMatured: CONTRAST_NODE, maturedVsEmpty: CONTRAST_NODE,
    },
  }],
  behindOptionHistogram: Object.fromEntries(ARMS.map((a) => [a, nodeOf([
    'allReceptions', 'pressedReceptions', 'denominator', 'pressedDenominator'])])) as SchemaNode,
  gkSplitLadder: Object.fromEntries(ARMS.map((a) => [a, nodeOf([
    'L1', 'L1gk', 'L2', 'L2gk', 'L3', 'L3gk', 'L4', 'L4gk', 'receptions'])])) as SchemaNode,
  terminalCensus: Object.fromEntries(ARMS.map((a) => [a, {
    openPlay: TERMINAL_NODE, openDenominator: LEAF, allDenominator: LEAF, entanglement: LEAF,
  }])) as SchemaNode,
  pcLedgerByArm: Object.fromEntries(ARMS.map((a) => [a, PCLEDGER_NODE])) as SchemaNode,
  conservation: Object.fromEntries(PC_ARMS.map((a) => [a, nodeOf(
    Object.keys(conservation[a]))])) as SchemaNode,
  spellReceipt: nodeOf(Object.keys(spellReceipt)),
  tierSplitReceipt: nodeOf(Object.keys(tierSplitReceipt)),
  histReceipt: nodeOf(Object.keys(histReceipt)),
  perturbCheck: nodeOf(Object.keys(perturbCheck)),
  vacuity: nodeOf(Object.keys(vacuity)),
  perSeedCells: Object.fromEntries(ARMS.map((a) => [a, [CELL_NODE]])) as SchemaNode,
  trajectoryCells: [nodeOf(Object.keys(trajCellOf(C.battery.traj[0])))],
  sources: nodeOf([
    'l3Dose', 'l3DoseFileBytesSha256', 'l3DoseDeclaredBytesSha256', 'l3DoseLabels',
    'pcT1', 'pcT1FileBytesSha256', 'pcT1DeclaredBytesSha256', 'pcT1CommittedResultSha256',
    'pcC0', 'pcC0FileBytesSha256', 'pcC0DeclaredBytesSha256', 'pcC0CommittedResultSha256',
    'cbProneness', 'houseLaw']),
  seeds: {
    block: LEAF, claimed: [{ name: LEAF, range: LEAF }],
    consumedLedger: [{ name: LEAF, range: LEAF }],
    verifierScratchCanon: LEAF, preflightBand: LEAF, retiredBlockNeverTouched: LEAF,
  },
  stats: nodeOf(['base', 'bootstrapResamples', 'floorFromRuling', 'latticeStep', 'unit']),
  faceRederivationInMemoryCrossCheck: nodeOf(['checked', 'bad']),
  faceRederivationFromTheSerializedArtifact: nodeOf(['checked', 'bad', 'parsed']),
  unitNamingAudit: nodeOf(['canon', 'violations', 'checkedLeaves']),
  gDetDigests: { runA: LEAF, runB: LEAF },
  gates: Object.fromEntries(REGISTRY.map((s) => [s.name, LEAF])) as SchemaNode,
  mutants: [nodeOf(['gate', 'name', 'conjunct', 'flipped', 'othersSurvived', 'live'])],
  coverage: Object.fromEntries(REGISTRY.map((s) => [s.name, LEAF])) as SchemaNode,
  conjunctTotal: LEAF, allGatesPass: LEAF, nonClaims: LEAF,
};
/** ⭐ `l3DoseCells` is an ARRAY OF OBJECTS, so it needs its own node, not a LEAF. */
(BODY_SCHEMA as Record<string, SchemaNode>).sources =
  { ...(nodeOf([
    'l3Dose', 'l3DoseFileBytesSha256', 'l3DoseDeclaredBytesSha256', 'l3DoseLabels',
    'pcT1', 'pcT1FileBytesSha256', 'pcT1DeclaredBytesSha256', 'pcT1CommittedResultSha256',
    'pcC0', 'pcC0FileBytesSha256', 'pcC0DeclaredBytesSha256', 'pcC0CommittedResultSha256',
    'cbProneness', 'houseLaw']) as Record<string, SchemaNode>),
  l3DoseCells: [nodeOf(Object.keys(L3_DOSE[0]))] };
const SCHEMA_KEYS = countSchemaKeys(BODY_SCHEMA);

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
    note: 'UNHASHED (#266.3(a) / #289 item 1): head, timestamps, paths and all machine timings '
      + 'live here BY NAME so resultSha256 re-derives at any commit or path. ⭐ The body itself '
      + 'is built from an ALLOWLIST SCHEMA (canon, home PC-T0 §COMMANDER CORRECTIONS item 1), '
      + 'so a timing cannot reach it even under a new field name.',
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  /** ⭐ THE PATH-VARIED RE-RUN (the PC-T0 voiding lesson): a DIFFERENT path, a DIFFERENT
   *  envelope, and the digest must be bit-identical. */
  const crossPath = '/tmp/pc-t2-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD',
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

/* ---- the schema's own REFUSAL receipts, exercised on real mutated bodies ---- */
const schemaRefuses = (mutate: (b: Record<string, unknown>) => void): boolean => {
  const probeBody = buildBody({}, []);
  mutate(probeBody);
  const v: string[] = [];
  validate(probeBody, BODY_SCHEMA, '$', v);
  return v.length > 0;
};

let { gates, mutants } = runRegistry();
const rawBody0 = buildBody(gates, mutants);
{
  const v: string[] = [];
  validate(rawBody0, BODY_SCHEMA, '$', v);
  schemaInput.violations = v;
  schemaInput.schemaKeys = SCHEMA_KEYS;
  schemaInput.refusesUnknownField = schemaRefuses((b) => { b.aFieldNobodyDeclared = 1; });
  schemaInput.refusesMissingField = schemaRefuses((b) => { delete b.stage; });
  schemaInput.refusesObjectInLeaf = schemaRefuses((b) => {
    (b.gDetDigests as Record<string, unknown>).runA = { smuggled: 1 };
  });
  schemaInput.refusesAWallClockField = schemaRefuses((b) => { b.wallMs = 1; });
  unitsInput.violations = unitViolationsOf(rawBody0);
  unitsInput.checkedLeaves = UNIT_LEAVES_SEEN.n;
  /** ⭐ the naming check must DEMONSTRABLY refuse: a body carrying `aFakeShare = 7` (a *Share
   *  outside [0,1]) and `aFakeTicks = 1.5` (a fractional applied tick) must produce two
   *  violations. A check that cannot fail is not a check. */
  unitsInput.refusesAViolation = unitViolationsOf(
    { probe: { aFakeShare: 7, aFakeTicks: 1.5, aFakeMetres: 'not-a-number' } },
  ).length === 3;
}

({ gates, mutants } = runRegistry());
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
/** ⭐⭐ #287.1 / PC-C0 §CORRECTIONS 4: read the artifact BACK OFF DISK and re-derive every face
 *  — including the two PERCENTILE faces, from the STORED BINS. */
rederiveFacesFromDisk(OUT_PATH);
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs', 'head', 'outPath'];
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pc-t2] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pc-t2] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
if (schemaInput.violations.length > 0) {
  banner('  [pc-t2] SCHEMA VIOLATIONS:');
  for (const v of schemaInput.violations.slice(0, 30)) banner(`    · ${v}`);
}
if (unitsInput.violations.length > 0) {
  banner('  [pc-t2] UNIT-NAMING VIOLATIONS:');
  for (const v of unitsInput.violations.slice(0, 30)) banner(`    · ${v}`);
}
const show = (k: string, arm: 'v7pcEmpty' | 'v7pcMatured' | 'maturedVsEmpty' = 'v7pcMatured'):
string => {
  const f = faceOf(k);
  const c = f.contrasts[arm];
  const res = resolvedPositive(c.ci95) || resolvedNegative(c.ci95);
  const r = ratioToHalfWidth(c.delta, c.ci95);
  const lvl = (a: ArmKind): string => (f.arms[a].den === 0 ? 'n/a' : f.arms[a].point.toFixed(4));
  return `v7 ${lvl('v7')} · empty ${lvl('v7pcEmpty')} · matured ${lvl('v7pcMatured')} (Δ`
    + `${c.delta >= 0 ? '+' : ''}${c.delta.toFixed(4)} [${c.ci95[0].toFixed(4)}, `
    + `${c.ci95[1].toFixed(4)}] |Δ|/hw ${r.toFixed(2)}${res ? ' ⭐RESOLVED' : ''})`;
};
banner(`  [pc-t2] ⭐⭐ H-PC.1 = ${hPc1.verdict} — (a) ${hPc1.a.verdict} `
  + `[pooled ${(hPc1.a.pooledSimpleShareMatured * 100).toFixed(1)} % vs `
  + `${(hPc1.a.pooledSimpleShareEmpty * 100).toFixed(1)} %, cell-grain gap `
  + `${(hPc1.a.cellGrainGap * 100).toFixed(1)} pp Δ/hw `
  + `${hPc1.a.cellGrainGapOverHalfWidth.toFixed(1)}] · (b) ${hPc1.b.verdict} `
  + `[Δsep +${hPc1.b.contrastMaturedMinusBaseMetres.toFixed(4)} m Δ/hw `
  + `${hPc1.b.contrastOverHalfWidth.toFixed(1)}]`);
banner(`  [pc-t2] ⭐⭐ Δsep at the touch-past          — ${show('deltaSepAtTouchPastMetres')}`);
banner(`  [pc-t2] ⭐ Δsep, SIMPLE-tier victim         — ${show('deltaSepMetresWhenTheBeatenDefenderPays_simple', 'maturedVsEmpty')}`);
banner(`  [pc-t2] ⭐ Δsep, CHOICE-tier victim         — ${show('deltaSepMetresWhenTheBeatenDefenderPays_choice', 'maturedVsEmpty')}`);
banner(`  [pc-t2] ⭐⭐ SIMPLE-tier share               — ${show('simpleTierShare', 'maturedVsEmpty')}`);
banner(`  [pc-t2] completion (Q06)                   — ${show('passCompletionRate')}`);
banner(`  [pc-t2] intercepted terminal share         — ${show('terminal_intercepted')}`);
banner(`  [pc-t2] total loss to an opponent          — ${show('lossToOpponentShare')}`);
banner(`  [pc-t2] behind-ball options / reception    — ${show('behindBallOptionsPerReception')}`);
banner(`  [pc-t2] zero-option share                  — ${show('shareReceptionsWithNoBehindOption')}`);
banner(`  [pc-t2] pressed supply                     — ${show('behindBallOptionsPerPressedReception')}`);
banner(`  [pc-t2] ⭐ pressed-end loss share           — ${show('pressedEndLossShare')}`);
banner(`  [pc-t2] ⭐ free-end loss share              — ${show('freeEndLossShare')}`);
banner(`  [pc-t2] Q01 spell mean (sim-s)             — ${show('spellMeanSeconds')}`);
banner(`  [pc-t2] Q05 touches / spell                — ${show('touchesPerSpell')}`);
banner(`  [pc-t2] Q14 pressed-reception share        — ${show('pressedReceptionShare')}`);
banner(`  [pc-t2] goals / match                      — ${show('goalsPerMatch')}`);
banner(`  [pc-t2] ⭐ census confusion: ${confusionTable.bothCovered}+${confusionTable.bothUncovered} agree · `
  + `${confusionTable.predictedCoveredNotObserved} predicted-not-observed · `
  + `${confusionTable.observedCoveredNotPredicted} observed-not-predicted · `
  + `${confusionTable.unarmedCells} structural zeros · Spearman `
  + `${rankInvariance.spearmanOrdinal.toFixed(4)} over ${rankInvariance.cellsCompared} cells`);
banner(`  [pc-t2] ⭐ supply trajectory (armed−base engine events, by fixture): `
  + trajectory.byFixture.map((f) =>
    `${f.fixtureInSeason}:${(f.armedMinusBaseEngineEventRelativeChange * 100).toFixed(1)}%`)
    .join(' '));
banner(`  [pc-t2] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · `
  + `${CONJUNCT_TOTAL} conjuncts · schema keys ${SCHEMA_KEYS} · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
