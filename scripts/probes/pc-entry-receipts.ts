/**
 * ⭐ PC ENTRY RUNG — THE RECEIPTS RUN (ruling #300 item 6;
 * docs/world-model/PC-ENTRY-RUNG.md).
 *
 * This is an ENTRY, not a gate battery: it adds no mechanism and draws no inferential statistic.
 * What it proves is PLUMBING — that the world reachable from `?a4world=8` is the world PC-T2
 * measured, that the flags-off game is byte-identical, that the dose rides an opt-in chunk, and
 * that the new version value names the composition. ⭐ EVERY NUMBER BELOW IS A RECEIPT, NEVER AN
 * EFFECT SIZE (canon, home ruling #289 item 1); PC-T2 owns every football claim.
 *
 * The hygiene canon in its entry-slice form:
 *   * `xSrcUntouched` does not apply (this rung is a src slice); its seat is taken by
 *     ⭐⭐ `xByteIdenticalOff` (the flags-off world digest + the league fingerprint) and
 *     ⭐ `xDiffScope` (taken against the DISPATCH commit, so it cannot go silently empty).
 *   * ⭐ the hashed body is built from an explicit ALLOWLIST SCHEMA — canon, home
 *     PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1: *"the hashed body is built from an
 *     explicit ALLOWLIST SCHEMA — a field not in the schema never enters the body; forbidden-name
 *     lists are retired"*. Proven able to refuse, and proven envelope-free by a PATH-VARIED re-run.
 *   * ⭐ a data-source guard hashes FILE BYTES (#289 item 1) — this probe hashes PC-T1 itself.
 *   * ⭐ artifact fields are TRUE with the units their names claim (`gUnits`, #294 item 3 and
 *     PC-T2 §COMMANDER CORRECTIONS item 3: nominal ≠ applied).
 *   * the mutant coverage map is DERIVED FROM THE GATE OBJECTS; an uncovered conjunct makes this
 *     probe REFUSE TO RUN (exit 3).
 *   * ⭐ the CB seat's arming block is machine-asserted untouched (the M-PW.4 / M-PC.5 form).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2/#262.2), including the ENGINE's own doors:
 *   accepted: PCENTRY_MODE (smoke|full, REQUIRED) · PCENTRY_N · PCENTRY_OUT · PCENTRY_SKIP_FP
 * Any other `PCENTRY_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override makes the
 * run a PREFLIGHT: it may never write a canonical repo path.
 *
 * ⚠ `npm run build` MUST have been run on this tree first: `gPrecache` reads the REAL `dist/`.
 *
 * RUN: PCENTRY_MODE=full npx tsx scripts/probes/pc-entry-receipts.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a LIVENESS refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import type { Match } from '../../src/sim/Match';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
import { ROSTER_SIZE } from '../../src/sim/types';
import {
  PC_BOOK_CELLS, PC_N_COVER, PC_TIER_CHOICE_TICKS, PC_TIER_SIMPLE_TICKS,
} from '../../src/ai/pcLatency';
import {
  CB_WORLD_VERSION, L3_WORLD_VERSION, PC_DOSE_PARAM, PC_T1_BYTES_SHA, PC_T1_SHA, PC_WORLD_DOORS,
  PC_WORLD_VERSION, a4ArmedVersion, a4MatchFlags, a4UrlOverride, armA4World, l3ArmedVersion,
  loadPcDose, pcArmedVersion, pcDoseWanted, poolPcDoseTable, poolT1DoseCells,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { isShellAsset } from '../pwaAssets';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS                         */
/* ========================================================================== */
const ENV_WHITELIST = ['PCENTRY_MODE', 'PCENTRY_N', 'PCENTRY_OUT', 'PCENTRY_SKIP_FP'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PCENTRY_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('PC-ENTRY FATAL — refused env surface. '
    + `rogue PCENTRY_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PCENTRY_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`PC-ENTRY FATAL — PCENTRY_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.PCENTRY_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PCENTRY_N, 10)) : null;
const OUT_ENV = process.env.PCENTRY_OUT;
const SKIP_FP = process.env.PCENTRY_SKIP_FP === '1';
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PCENTRY_N'] : []),
  ...(OUT_ENV !== undefined ? ['PCENTRY_OUT'] : []),
  ...(SKIP_FP ? ['PCENTRY_SKIP_FP'] : []),
  ...(MODE === 'smoke' ? ['PCENTRY_MODE=smoke'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/pc-entry-receipts.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pc-entry-preflight.json' : CANONICAL_OUT);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner('PC-ENTRY FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const bodyOf = (src: string, header: string): string => {
  const at = src.indexOf(header);
  if (at < 0) return '';
  let depth = 0;
  let started = false;
  for (let i = at; i < src.length; i++) {
    if (src[i] === '{') { depth++; started = true; }
    if (src[i] === '}') {
      depth--;
      if (started && depth === 0) return src.slice(at, i + 1);
    }
  }
  return '';
};
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 THE FROZEN DESIGN — seeds, the declared scope, the baselines             */
/* ========================================================================== */
/** ⭐ THE DISPATCH COMMIT (ruling #300). The diff-scope receipt is taken against IT. */
const DISPATCH_HEAD = '745d43b';
const A4WORLD_PATH = 'src/game/a4World.ts';
const GAMEAPP_PATH = 'src/game/GameApp.ts';
const BADGE_PATH = 'src/ui/A4WorldBadge.ts';
const SETTINGS_PATH = 'src/ui/SettingsScreen.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const PC_SRC_PATH = 'src/ai/pcLatency.ts';
const PWA_PATH = 'scripts/pwaAssets.ts';
const PIN_SUITE_PATH = 'tests/pcPlaytestEntry.test.ts';
/** ⭐ THE DECLARED SRC SCOPE OF THIS RUNG — the whole of it, nothing else may move. */
const DECLARED_SRC_SCOPE: readonly string[] = [GAMEAPP_PATH, A4WORLD_PATH, BADGE_PATH, SETTINGS_PATH];
/** The engine directories this rung may not touch AT ALL. */
const ENGINE_DIRS = ['src/sim/', 'src/ai/', 'src/evolution/'] as const;

const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T2_PATH = 'docs/world-model/data/pc-t2-armed-world-read.json';

const LEAGUE_FINGERPRINT_SEED = 1337;
const LEAGUE_FINGERPRINT_SEASONS = 2;
const LEAGUE_FINGERPRINT_OF_RECORD =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⭐ SEED SUB-BANDS, booked = walked (block 12,500,000–999 per ruling #300 item 5). */
const IDENT_BASE = 12_500_000;
const IDENT_N_FULL = 6;
const ARM_BASE = 12_500_100;
const ARM_N_FULL = 8;
const VERSION_SEED = 12_500_200;
const PREFLIGHT_BAND: readonly [number, number] = [12_500_600, 12_500_609];
const BLOCK: readonly [number, number] = [12_500_000, 12_500_999];
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'PW-T1 composition exam (#295/#296)', range: [12_496_000, 12_497_999] },
  { name: 'PC-C0 reaction baseline (#296.6/#297)', range: [12_498_000, 12_498_999] },
  { name: 'PC-T2 armed-world read (#299.6/#300)', range: [12_499_000, 12_499_999] },
];
/** ⭐ NO CI IS DRAWN IN THIS RUNG — it is an entry. The stats stream is UNCONSUMED. */
const STATS_FLOOR_FROM_RULING = 113_800;
const STATS_DRAWS = 0;

const IDENT_N = N_ENV ?? (MODE === 'smoke' ? 2 : IDENT_N_FULL);
const ARM_N = N_ENV ?? (MODE === 'smoke' ? 2 : ARM_N_FULL);
const IDENT_SEEDS = Array.from({ length: IDENT_N }, (_, i) => IDENT_BASE + i);
const ARM_SEEDS = Array.from({ length: ARM_N }, (_, i) => ARM_BASE + i);

/**
 * ⭐⭐ THE RECEIPT CORRIDOR, FROZEN ABOVE THE NUMBERS AND NOT A RE-EXAM. PC-T2's pooled matured
 * SIMPLE share is 0.9491922761868649 over 200 paired seeds. This rung walks a handful of league
 * fixtures through the ENTRY's own path and asks only that the armed world lands in the same
 * neighbourhood — a corridor, with no CI, no test and no denominator discipline.
 */
const CORRIDOR: readonly [number, number] = [0.85, 1.0];
const PC_T2_POOLED_SIMPLE_SHARE_MATURED = 0.9491922761868649;

/* ========================================================================== */
/* §3 THE DOSES — read at run time, hashed by FILE BYTES                       */
/* ========================================================================== */
const PC_T1_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_T1_BYTES_SHA_MEASURED = sha(PC_T1_BYTES);
const PC_T1_FILE = JSON.parse(PC_T1_BYTES) as { resultSha256: string };
const L3_T1_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_DOSE: readonly L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_T1_BYTES) as unknown);
const PC_T2_FILE = JSON.parse(readFileSync(PC_T2_PATH, 'utf8')) as {
  resultSha256: string;
  frozen: { doseProvenance: {
    table: number[][]; totalExposuresPerBook: number; books: number; seasons: number;
    sides: number; denominator: number; slotCellsAtOrAboveNCover: number;
  } };
};
const PC_T2_DOSE_TABLE = PC_T2_FILE.frozen.doseProvenance.table;
/** the table THIS ENTRY derives, through its own exported pooling law. */
const PC_DOSE_REDERIVED = poolPcDoseTable(JSON.parse(PC_T1_BYTES));

/* ========================================================================== */
/* §4 THE ARMS — built the way the APP builds them, never re-implemented       */
/* ========================================================================== */
type Arm = 'production' | 'v6' | 'v7' | 'v8empty' | 'v8matured';
const versionOf = (arm: Arm): 0 | 6 | 7 | 8 => (arm === 'production' ? 0
  : arm === 'v6' ? CB_WORLD_VERSION : arm === 'v7' ? L3_WORLD_VERSION : PC_WORLD_VERSION);

/**
 * ⭐ THE ENTRY'S OWN TWO CALLS, AND NOTHING ELSE: `a4MatchFlags(v)` onto `League.matchFlags` at
 * construction, `armA4World(match, null, v, l3Dose, pcDose)` after it — the GameApp path. No
 * flag, no door and no cell is typed here, so the played world and the receipted world cannot
 * drift.
 */
const matchOf = (seed: number, arm: Arm, pcDose: PcDoseTable | null): Match => {
  const league = new League({ seed });
  const version = versionOf(arm);
  if (version !== 0) league.matchFlags = a4MatchFlags(version);
  const match = league.createMatch(league.nextFixture()!);
  if (version !== 0) {
    armA4World(match, null, version, L3_DOSE, arm === 'v8matured' ? pcDose : null);
  }
  return match;
};

const signature = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
})).digest('hex');

interface IdentRow {
  seed: number;
  signature: string;
  reproduces: boolean;
  /** every dormancy conjunct of the shipped world, on the match that was actually walked. */
  seatNull: boolean;
  doorOff: boolean;
  defenceSeatNull: boolean;
  armedVersion: number;
}
interface ArmRow {
  seed: number;
  arm: Arm;
  signature: string;
  armedVersion: number;
  pcVersion: number;
  l3Version: number;
  seatLive: boolean;
  nCover: number;
  clockSimSeconds: number;
  bookExposuresAtConstruction: number;
  booksMatchTheDoseAtConstruction: boolean;
  armsSimple: number;
  armsChoice: number;
  simpleShare: number;
  heldExecutorTicks: number;
  decisionsHeld: number;
  exposuresNoted: number;
  bookExposuresAtWhistle: number;
  genomeCleanOfPcKeys: boolean;
  goals: number;
}

const bookExposures = (m: Match): number => (m.pcLatency === null ? 0
  : m.pcLatency.books[0].totalExposures + m.pcLatency.books[1].totalExposures);
const booksAreTheDose = (m: Match, dose: PcDoseTable): boolean => {
  if (m.pcLatency === null) return false;
  for (const book of m.pcLatency.books) {
    for (let ri = 0; ri < ROSTER_SIZE; ri++) {
      for (let c = 0; c < PC_BOOK_CELLS.length; c++) {
        if (book.count(ri, PC_BOOK_CELLS[c]) !== dose[ri][c]) return false;
      }
    }
  }
  return true;
};
/** ⭐ #270: nothing of any seam in `info.genome` — asserted on the match that was walked. */
const genomeClean = (m: Match): boolean => ([0, 1] as const).every((s) => {
  const g = m.teams[s].info.genome as unknown as Record<string, unknown>;
  return g.cbCarryProneness === undefined && g.pcReactionLatency === undefined
    && g.markSag === undefined && g.defLaneConvergence === undefined;
});

const walkIdentity = (seed: number): IdentRow => {
  const a = matchOf(seed, 'production', null);
  const b = matchOf(seed, 'production', null);
  while (!a.finished) a.step(DT);
  while (!b.finished) b.step(DT);
  return {
    seed,
    signature: signature(a),
    reproduces: signature(a) === signature(b),
    seatNull: a.pcLatency === null,
    doorOff: !a.pcReactionLatency,
    defenceSeatNull: a.l3Defence === null,
    armedVersion: a4ArmedVersion(a),
  };
};

const walkArm = (seed: number, arm: Arm, dose: PcDoseTable): ArmRow => {
  const m = matchOf(seed, arm, dose);
  const atConstruction = bookExposures(m);
  const dosedAtConstruction = arm === 'v8matured' ? booksAreTheDose(m, dose) : false;
  while (!m.finished) m.step(DT);
  const led = m.pcLatency?.ledger ?? null;
  const simple = led?.armedByTier.simple ?? 0;
  const choice = led?.armedByTier.choice ?? 0;
  return {
    seed,
    arm,
    signature: signature(m),
    armedVersion: a4ArmedVersion(m),
    pcVersion: pcArmedVersion(m),
    l3Version: l3ArmedVersion(m),
    seatLive: m.pcLatency !== null,
    nCover: m.pcLatency?.nCover ?? -1,
    clockSimSeconds: m.duration,
    bookExposuresAtConstruction: atConstruction,
    booksMatchTheDoseAtConstruction: dosedAtConstruction,
    armsSimple: simple,
    armsChoice: choice,
    simpleShare: simple + choice === 0 ? Number.NaN : round(simple / (simple + choice)),
    heldExecutorTicks: led?.heldExecutorTicks ?? 0,
    decisionsHeld: led?.decisionsHeld ?? 0,
    exposuresNoted: led?.exposuresNoted ?? 0,
    bookExposuresAtWhistle: bookExposures(m),
    genomeCleanOfPcKeys: genomeClean(m),
    goals: m.score[0] + m.score[1],
  };
};

/* ========================================================================== */
/* §5 THE RUN                                                                  */
/* ========================================================================== */
const DOSE: PcDoseTable = await loadPcDose(); // ⭐ THE ENTRY'S OWN LOADER — the app's own chunk
const walkT0 = Date.now();
const IDENT_ROWS = IDENT_SEEDS.map(walkIdentity);
const ARM_ROWS: ArmRow[] = [];
for (const arm of ['v7', 'v8empty', 'v8matured'] as const) {
  for (const seed of ARM_SEEDS) ARM_ROWS.push(walkArm(seed, arm, DOSE));
}
/** ⭐ G-DET: the whole arm battery re-walked, and the two digests compared. */
const ARM_ROWS_B: ArmRow[] = [];
for (const arm of ['v7', 'v8empty', 'v8matured'] as const) {
  for (const seed of ARM_SEEDS) ARM_ROWS_B.push(walkArm(seed, arm, DOSE));
}
const WALK_MS = Date.now() - walkT0;
const digestA = sha(canonical(ARM_ROWS));
const digestB = sha(canonical(ARM_ROWS_B));

/** ⭐ THE VERSION READ, on four freshly constructed worlds of the SAME seed. */
const VERSION_READS = (['production', 'v6', 'v7', 'v8matured'] as const).map((arm) => {
  const m = matchOf(VERSION_SEED, arm, DOSE);
  return {
    arm,
    requested: versionOf(arm),
    a4ArmedVersion: a4ArmedVersion(m),
    pcArmedVersion: pcArmedVersion(m),
    l3ArmedVersion: l3ArmedVersion(m),
  };
});

const rowsOf = (arm: Arm): ArmRow[] => ARM_ROWS.filter((r) => r.arm === arm);
const sum = (xs: number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const pooledSimpleShare = (arm: Arm): number => {
  const rs = rowsOf(arm);
  const s = sum(rs.map((r) => r.armsSimple));
  const c = sum(rs.map((r) => r.armsChoice));
  return s + c === 0 ? Number.NaN : round(s / (s + c));
};
const MATURED_SIMPLE_SHARE = pooledSimpleShare('v8matured');
const EMPTY_SIMPLE_SHARE = pooledSimpleShare('v8empty');

/* ---- the league fingerprint, re-derived by the repo's own script ---- */
const LEAGUE_FP = SKIP_FP ? 'SKIPPED'
  : gitOut(`npx tsx scripts/fingerprint.ts ${LEAGUE_FINGERPRINT_SEED} ${LEAGUE_FINGERPRINT_SEASONS}`)
    .split('\n').map((l) => (/[0-9a-f]{64}/.exec(l) ?? [''])[0]).filter((s) => s !== '').pop() ?? 'NO-FP';

/* ---- the diff scope, the engine dirs, the CB seat block ---- */
const DIFF_STAT = gitOut(`git diff --stat ${DISPATCH_HEAD} -- src`);
const DIFF_NAMES = gitOut(`git diff --name-only ${DISPATCH_HEAD} -- src`)
  .split('\n').filter((s) => s !== '');
const UNTRACKED = gitOut('git ls-files --others --exclude-standard -- src')
  .split('\n').filter((s) => s !== '');
const TOUCHED = Array.from(new Set([...DIFF_NAMES, ...UNTRACKED])).sort();
const SCOPE_MATCHES = canonical(TOUCHED) === canonical([...DECLARED_SRC_SCOPE].sort());
const ENGINE_TOUCHED = TOUCHED.filter((f) => ENGINE_DIRS.some((d) => f.startsWith(d)));

const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const PC_SRC = readFileSync(PC_SRC_PATH, 'utf8');
const A4WORLD_SRC = readFileSync(A4WORLD_PATH, 'utf8');
const GAMEAPP_SRC = readFileSync(GAMEAPP_PATH, 'utf8');
const PWA_SRC = readFileSync(PWA_PATH, 'utf8');
const PIN_SUITE_SRC = existsSync(PIN_SUITE_PATH) ? readFileSync(PIN_SUITE_PATH, 'utf8') : '';
/** ⭐ THE CB SEAT'S ARMING BLOCK — machine-read, hashed, and proven absent from this rung's diff. */
const CB_ARMING_BLOCK = bodyOf(BRAIN_SRC, 'if (cbSeat !== null) {');
const CB_ARMING_BLOCK_SHA = sha(CB_ARMING_BLOCK);
const CB_ARMING_BLOCK_IN_DIFF = gitOut(`git diff ${DISPATCH_HEAD} -- ${BRAIN_PATH}`)
  .split('\n').filter((l) => /^[-+]/.test(l) && /cbSeat/.test(l)).length;
/** the recognition book has exactly ONE public write method — the dose cannot cheat. */
const BOOK_WRITE_METHODS = (PC_SRC.match(/^ {2}(note|reset)\(/gm) ?? []).length;
const DOSE_WRITES_THROUGH_NOTE = bodyOf(A4WORLD_SRC, 'export function dosePcBooks')
  .includes('book.note(ri, PC_BOOK_CELLS[c])');
const ARMING_CALL_SITES = (GAMEAPP_SRC.match(/armA4World\(/g) ?? []).length;
const DYNAMIC_ARTIFACT_IMPORTS =
  (A4WORLD_SRC.match(/import\('\.\.\/\.\.\/docs\/world-model\/data\//g) ?? []).length;
const RAW_IMPORT_IS_DYNAMIC = A4WORLD_SRC.includes(
  "await import('../../docs/world-model/data/pc-t1-learning-exam.json?raw')",
);
/**
 * ⭐ NO DOSE NUMERAL IS TYPED INTO SRC — and this is a TOKEN search, never a digit search (the
 * L3 pin's own lesson: a 64-hex SHA or a ruling number contains any digit string by chance, and
 * a substring match on `109` inside `0301d7109cb…` is a false positive). A numeral counts as
 * typed only when it stands alone: not inside a longer word, a decimal, or a `#ruling` number.
 */
const typedNumeral = (v: number): boolean =>
  new RegExp(`(?<![\\w.#])${v}(?![\\w.])`).test(A4WORLD_SRC);
const DOSE_NUMERALS_IN_SRC = [
  PC_T2_FILE.frozen.doseProvenance.totalExposuresPerBook,
  ...PC_DOSE_REDERIVED.flat().filter((v) => v >= 100),
].filter(typedNumeral).length;

/* ---- the REAL build: the chunk is emitted, and it is NOT precached ---- */
const DIST_DIR = 'dist';
const SW_PATH = `${DIST_DIR}/sw.js`;
const DIST_PRESENT = existsSync(SW_PATH) && existsSync(`${DIST_DIR}/assets`);
const DIST_ASSETS = DIST_PRESENT ? readdirSync(`${DIST_DIR}/assets`) : [];
const SW_TEXT = DIST_PRESENT ? readFileSync(SW_PATH, 'utf8') : '';
/**
 * ⭐ THE PRECACHE LIST IS PARSED FROM THE WORKER'S OWN ARRAY, not grepped out of the file — an
 * "is it in the list" check whose list came back EMPTY would pass vacuously, which is the whole
 * failure mode this gate exists to catch. `gPrecache` therefore also asserts the list is a real
 * one (it must contain the main bundle).
 */
const PRECACHE_BLOCK = /const PRECACHE = \[([\s\S]*?)\];/.exec(SW_TEXT);
const PRECACHE_ENTRIES = PRECACHE_BLOCK === null ? []
  : (PRECACHE_BLOCK[1].match(/"[^"]+"/g) ?? []).map((s) => s.slice(1, -1));
const PC_CHUNKS = DIST_ASSETS.filter((f) => f.startsWith('pc-t1-learning-exam-') && f.endsWith('.js'));
const PC_CHUNK_BYTES = PC_CHUNKS.length === 0 ? 0
  : readFileSync(`${DIST_DIR}/assets/${PC_CHUNKS[0]}`).length;
const PRECACHED_PC = PRECACHE_ENTRIES.filter((e) => e.includes('pc-t1-')).length;
const PRECACHED_L3 = PRECACHE_ENTRIES.filter((e) => e.includes('l3-')).length;
const PRECACHED_STAGE3 = PRECACHE_ENTRIES.filter((e) => e.includes('stage3')).length;
const MAIN_CHUNKS = DIST_ASSETS.filter((f) => f.startsWith('index-') && f.endsWith('.js'));
const MAIN_BUNDLE_BYTES = MAIN_CHUNKS.length === 0 ? 0
  : readFileSync(`${DIST_DIR}/assets/${MAIN_CHUNKS[0]}`).length;
/** ⭐ the DATA is in the chunk, not the main bundle — checked by needle, not by faith. */
const MAIN_BUNDLE_TEXT = MAIN_CHUNKS.length === 0 ? ''
  : readFileSync(`${DIST_DIR}/assets/${MAIN_CHUNKS[0]}`, 'utf8');
/**
 * ⭐ THE NEEDLES ARE DATA-ONLY KEYS. `armsByBodyCell` / `perBookCells` are deliberately NOT used:
 * they are the ENTRY MODULE's own interface property names, so they survive minification into the
 * main bundle as property accesses and would report a leak that is not one (the L3 rung's honest
 * `lunges` / `punished` note, same class). These three keys appear in the artifact and nowhere in
 * `src/**`, so finding them in the main bundle would mean the DATA had leaked.
 */
const NEEDLES = ['simpleAtNByBodyCell', 'transitionCurves', 'perPairCells'] as const;
const NEEDLES_IN_MAIN = NEEDLES.filter((n) => MAIN_BUNDLE_TEXT.includes(n)).length;
const NEEDLES_IN_CHUNK = PC_CHUNKS.length === 0 ? 0
  : NEEDLES.filter((n) => readFileSync(`${DIST_DIR}/assets/${PC_CHUNKS[0]}`, 'utf8').includes(n)).length;

/* ---- the entry chain, exercised (URL param → flags → dose) ---- */
const ENTRY_CHAIN = {
  urlEightArmsWorldEight: a4UrlOverride('?a4world=8') === PC_WORLD_VERSION,
  urlNineIsNothing: a4UrlOverride('?a4world=9') === null,
  urlSevenStillArmsWorldSeven: a4UrlOverride('?a4world=7') === L3_WORLD_VERSION,
  urlZeroStillDisarms: a4UrlOverride('?a4world=0') === 0,
  doseParamDefaultsToMatured: pcDoseWanted('?a4world=8'),
  doseParamZeroIsTheWeakForm: !pcDoseWanted('?a4world=8&pcdose=0'),
  doseParamOffAndEmptyAlsoWork: !pcDoseWanted('?pcdose=off') && !pcDoseWanted('?pcdose=empty'),
  flagsAreWorldSevenPlusTheDoor: canonical(a4MatchFlags(PC_WORLD_VERSION))
    === canonical({ ...a4MatchFlags(L3_WORLD_VERSION), ...PC_WORLD_DOORS }),
  theChunkIsExcludedFromTheShell: !isShellAsset('assets/pc-t1-learning-exam-DEADBEEF.js'),
  theMainBundleIsStillShell: isShellAsset('assets/index-DEADBEEF.js'),
  theExclusionListNamesThePcPrefix: PWA_SRC.includes("'assets/pc-'"),
};

/* ========================================================================== */
/* §6 THE GATE REGISTRY                                                        */
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
    { conjunct: 'rederivesBitIdentically', name: 'the second battery differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- 2 ⭐⭐ xByteIdenticalOff — the dormancy prong ---- */
registerGate<{ rows: number; reproduces: number; dormant: number; league: string; skipped: boolean }>({
  name: 'xByteIdenticalOff',
  fn: (i) => ({
    everyFlagsOffWalkReproducesItself: i.reproduces === i.rows,
    everyFlagsOffWalkIsCompletelyDormant: i.dormant === i.rows,
    theLeagueFingerprintIsUnmoved: i.skipped || i.league === LEAGUE_FINGERPRINT_OF_RECORD,
    nonVacuousIdentityWalkCount: i.rows > 0,
  }),
  input: {
    rows: IDENT_ROWS.length,
    reproduces: IDENT_ROWS.filter((r) => r.reproduces).length,
    dormant: IDENT_ROWS.filter((r) => r.seatNull && r.doorOff && r.defenceSeatNull
      && r.armedVersion === 0).length,
    league: LEAGUE_FP, skipped: SKIP_FP,
  },
  mutants: [
    { conjunct: 'everyFlagsOffWalkReproducesItself', name: 'a flags-off world stopped reproducing', mutate: (i) => ({ ...i, reproduces: 0 }) },
    { conjunct: 'everyFlagsOffWalkIsCompletelyDormant', name: 'a seat existed in the shipped world', mutate: (i) => ({ ...i, dormant: 0 }) },
    { conjunct: 'theLeagueFingerprintIsUnmoved', name: 'the league fingerprint moved', mutate: (i) => ({ ...i, league: 'deadbeef', skipped: false }) },
    { conjunct: 'nonVacuousIdentityWalkCount', name: 'no identity walk ran', mutate: (i) => ({ ...i, rows: 0, reproduces: 0, dormant: 0 }) },
  ],
});

/* ---- 3 ⭐ xDiffScope — against the DISPATCH commit ---- */
registerGate<{ touched: readonly string[]; matches: boolean; stat: string; engine: number }>({
  name: 'xDiffScope',
  fn: (i) => ({
    theTouchedSetIsExactlyTheDeclaredScope: i.matches,
    theScopeIsNonEmptyAndBounded: i.touched.length === DECLARED_SRC_SCOPE.length,
    noEngineFileMoved: i.engine === 0,
    theDiffStatWasActuallyRead: i.stat !== 'GIT-FAILED',
  }),
  input: { touched: TOUCHED, matches: SCOPE_MATCHES, stat: DIFF_STAT, engine: ENGINE_TOUCHED.length },
  mutants: [
    { conjunct: 'theTouchedSetIsExactlyTheDeclaredScope', name: 'a file outside the scope moved', mutate: (i) => ({ ...i, matches: false }) },
    { conjunct: 'theScopeIsNonEmptyAndBounded', name: 'the touched set changed size', mutate: (i) => ({ ...i, touched: [] }) },
    { conjunct: 'noEngineFileMoved', name: 'an engine file entered the diff', mutate: (i) => ({ ...i, engine: 1 }) },
    { conjunct: 'theDiffStatWasActuallyRead', name: 'git never answered', mutate: (i) => ({ ...i, stat: 'GIT-FAILED' }) },
  ],
});

/* ---- 4 gArms — every armed walk IS world 8, asserted on the match measured ---- */
const ARMED_ROWS = ARM_ROWS.filter((r) => r.arm !== 'v7');
registerGate<{
  armed: number; eight: number; seat: number; nCover: number; clock: number; total: number;
  l3: number; genome: number; controls: number; controlsSeven: number;
}>({
  name: 'gArms',
  fn: (i) => ({
    everyArmedWalkReportsWorldEightThroughTheEntryRead: i.armed > 0 && i.eight === i.armed,
    everyArmedWalkCarriesTheLatencySeatAtTheShippedNCover:
      i.seat === i.armed && i.nCover === i.armed,
    everyArmedWalkIsStillTheWorldSevenStack: i.l3 === i.armed,
    theEngineClockIsTheDefaultOnEveryWalk: i.clock === i.total,
    nothingOfAnySeamIsInInfoGenome: i.genome === i.total,
    theWorldSevenControlStillReportsSeven: i.controls > 0 && i.controlsSeven === i.controls,
  }),
  input: {
    armed: ARMED_ROWS.length,
    eight: ARMED_ROWS.filter((r) => r.armedVersion === PC_WORLD_VERSION
      && r.pcVersion === PC_WORLD_VERSION).length,
    seat: ARMED_ROWS.filter((r) => r.seatLive).length,
    nCover: ARMED_ROWS.filter((r) => r.nCover === PC_N_COVER).length,
    l3: ARMED_ROWS.filter((r) => r.l3Version === L3_WORLD_VERSION).length,
    clock: ARM_ROWS.filter((r) => r.clockSimSeconds === MATCH_DURATION).length,
    genome: ARM_ROWS.filter((r) => r.genomeCleanOfPcKeys).length,
    total: ARM_ROWS.length,
    controls: rowsOf('v7').length,
    controlsSeven: rowsOf('v7').filter((r) => r.armedVersion === L3_WORLD_VERSION
      && !r.seatLive).length,
  },
  mutants: [
    { conjunct: 'everyArmedWalkReportsWorldEightThroughTheEntryRead', name: 'an armed walk reported another world', mutate: (i) => ({ ...i, eight: i.eight - 1 }) },
    { conjunct: 'everyArmedWalkCarriesTheLatencySeatAtTheShippedNCover', name: 'a walk carried no seat', mutate: (i) => ({ ...i, seat: i.seat - 1 }) },
    { conjunct: 'everyArmedWalkIsStillTheWorldSevenStack', name: 'the world-7 stack fell away', mutate: (i) => ({ ...i, l3: i.l3 - 1 }) },
    { conjunct: 'theEngineClockIsTheDefaultOnEveryWalk', name: 'a walk overrode the clock', mutate: (i) => ({ ...i, clock: i.clock - 1 }) },
    { conjunct: 'nothingOfAnySeamIsInInfoGenome', name: 'a dose reached info.genome', mutate: (i) => ({ ...i, genome: i.genome - 1 }) },
    { conjunct: 'theWorldSevenControlStillReportsSeven', name: 'the world-7 control was mislabelled', mutate: (i) => ({ ...i, controlsSeven: 0 }) },
  ],
});

/* ---- 5 ⭐⭐ gDose — the pooling IS PC-T2's arm-C dose, and it rides the shipped writer ---- */
registerGate<{
  identical: boolean; exposures: number; bytes: string; declared: string; covered: number;
  dosedAtConstruction: number; maturedRows: number; emptyBorn: number; emptyRows: number;
  writeMethods: number; throughNote: boolean; numeralsInSrc: number; dynamic: boolean;
}>({
  name: 'gDose',
  fn: (i) => ({
    theEntrysPoolingIsBitEqualToPcT2sCommittedArmCTable: i.identical,
    theExposuresPerBookAreTheCommittedCount:
      i.exposures === PC_T2_FILE.frozen.doseProvenance.totalExposuresPerBook,
    theDoseSourceGuardHashesFileBytes: i.bytes === PC_T1_BYTES_SHA
      && i.declared === PC_T1_SHA,
    theDoseCoversSomeCellsAndNotOthers: i.covered > 0
      && i.covered < ROSTER_SIZE * PC_BOOK_CELLS.length,
    everyMaturedWalkedBookIsBitEqualToTheTableAtConstruction:
      i.maturedRows > 0 && i.dosedAtConstruction === i.maturedRows,
    everyEmptyWalkedBookIsBornAbsent: i.emptyRows > 0 && i.emptyBorn === i.emptyRows,
    theBookHasExactlyOnePublicWriterAndTheDoseUsesIt:
      i.writeMethods === 2 && i.throughNote,
    noDoseNumeralIsTypedIntoSrcAndTheImportIsDYNAMIC: i.numeralsInSrc === 0 && i.dynamic,
  }),
  input: {
    identical: canonical(PC_DOSE_REDERIVED) === canonical(PC_T2_DOSE_TABLE)
      && canonical(DOSE) === canonical(PC_T2_DOSE_TABLE),
    exposures: sum(PC_DOSE_REDERIVED.map((r) => sum(r))),
    bytes: PC_T1_BYTES_SHA_MEASURED, declared: PC_T1_FILE.resultSha256,
    covered: PC_DOSE_REDERIVED.reduce((a, r) => a + r.filter((v) => v >= PC_N_COVER).length, 0),
    dosedAtConstruction: rowsOf('v8matured').filter((r) => r.booksMatchTheDoseAtConstruction).length,
    maturedRows: rowsOf('v8matured').length,
    emptyBorn: rowsOf('v8empty').filter((r) => r.bookExposuresAtConstruction === 0).length,
    emptyRows: rowsOf('v8empty').length,
    writeMethods: BOOK_WRITE_METHODS, throughNote: DOSE_WRITES_THROUGH_NOTE,
    numeralsInSrc: DOSE_NUMERALS_IN_SRC, dynamic: RAW_IMPORT_IS_DYNAMIC,
  },
  mutants: [
    { conjunct: 'theEntrysPoolingIsBitEqualToPcT2sCommittedArmCTable', name: 'the pooling drifted from PC-T2', mutate: (i) => ({ ...i, identical: false }) },
    { conjunct: 'theExposuresPerBookAreTheCommittedCount', name: 'the exposure total moved', mutate: (i) => ({ ...i, exposures: 0 }) },
    { conjunct: 'theDoseSourceGuardHashesFileBytes', name: 'the artifact bytes changed under the guard', mutate: (i) => ({ ...i, bytes: 'deadbeef' }) },
    { conjunct: 'theDoseCoversSomeCellsAndNotOthers', name: 'the dose covered nothing', mutate: (i) => ({ ...i, covered: 0 }) },
    { conjunct: 'everyMaturedWalkedBookIsBitEqualToTheTableAtConstruction', name: 'a matured book was not the table', mutate: (i) => ({ ...i, dosedAtConstruction: 0 }) },
    { conjunct: 'everyEmptyWalkedBookIsBornAbsent', name: 'an empty-form book arrived pre-filled', mutate: (i) => ({ ...i, emptyBorn: 0 }) },
    { conjunct: 'theBookHasExactlyOnePublicWriterAndTheDoseUsesIt', name: 'the dose stopped using note()', mutate: (i) => ({ ...i, throughNote: false }) },
    { conjunct: 'noDoseNumeralIsTypedIntoSrcAndTheImportIsDYNAMIC', name: 'a dose numeral was typed into src', mutate: (i) => ({ ...i, numeralsInSrc: 1 }) },
  ],
});

/* ---- 6 ⭐⭐ gCorridor — RECEIPT 1/2: the armed world through the entry's own path ---- */
registerGate<{
  matured: number; empty: number; heldTicks: number; arms: number; decisions: number;
  emptyArmsAtConstruction: number; emptyRows: number; walks: number;
}>({
  name: 'gCorridor',
  fn: (i) => ({
    theLatencyActuallyFires: i.arms > 0 && i.heldTicks > 0 && i.decisions > 0,
    theMaturedArmLandsInTheFrozenReceiptCorridor:
      Number.isFinite(i.matured) && i.matured >= CORRIDOR[0] && i.matured <= CORRIDOR[1],
    theEmptyFormPaysTheLongTierFarMoreOften: Number.isFinite(i.empty) && i.empty < i.matured,
    theEmptyFormsBooksStartAtZeroSoEverySimpleArmIsEarnedInMatch:
      i.emptyRows > 0 && i.emptyArmsAtConstruction === 0,
    nonVacuousWalkCount: i.walks > 0,
  }),
  input: {
    matured: MATURED_SIMPLE_SHARE, empty: EMPTY_SIMPLE_SHARE,
    heldTicks: sum(rowsOf('v8matured').map((r) => r.heldExecutorTicks)),
    arms: sum(rowsOf('v8matured').map((r) => r.armsSimple + r.armsChoice)),
    decisions: sum(rowsOf('v8matured').map((r) => r.decisionsHeld)),
    emptyArmsAtConstruction: sum(rowsOf('v8empty').map((r) => r.bookExposuresAtConstruction)),
    emptyRows: rowsOf('v8empty').length,
    walks: ARM_ROWS.length,
  },
  mutants: [
    { conjunct: 'theLatencyActuallyFires', name: 'the seam armed nothing', mutate: (i) => ({ ...i, arms: 0 }) },
    // ⭐ CONJUNCT-ISOLATED BY CONSTRUCTION: the mutated share must fall OUT of the corridor and
    // still stay ABOVE the empty arm's, or it would flip its neighbour too and read as dead.
    { conjunct: 'theMaturedArmLandsInTheFrozenReceiptCorridor', name: 'the matured arm left the corridor', mutate: (i) => ({ ...i, matured: (CORRIDOR[0] + i.empty) / 2 }) },
    { conjunct: 'theEmptyFormPaysTheLongTierFarMoreOften', name: 'the empty form stopped differing', mutate: (i) => ({ ...i, empty: 1 }) },
    { conjunct: 'theEmptyFormsBooksStartAtZeroSoEverySimpleArmIsEarnedInMatch', name: 'the empty form arrived dosed', mutate: (i) => ({ ...i, emptyArmsAtConstruction: 1 }) },
    { conjunct: 'nonVacuousWalkCount', name: 'no walk ran', mutate: (i) => ({ ...i, walks: 0 }) },
  ],
});

/* ---- 7 ⭐⭐ gVersion — the BU-T1 mislabel class, killed ---- */
registerGate<{ reads: typeof VERSION_READS; chainOrder: boolean }>({
  name: 'gVersion',
  fn: (i) => ({
    aWorldEightMatchReportsEight:
      (i.reads.find((r) => r.arm === 'v8matured')?.a4ArmedVersion ?? 0) === PC_WORLD_VERSION,
    aWorldSevenMatchStillReportsSeven:
      (i.reads.find((r) => r.arm === 'v7')?.a4ArmedVersion ?? 0) === L3_WORLD_VERSION,
    aWorldSixMatchStillReportsSix:
      (i.reads.find((r) => r.arm === 'v6')?.a4ArmedVersion ?? 0) === CB_WORLD_VERSION,
    theProductionMatchReportsNothing:
      (i.reads.find((r) => r.arm === 'production')?.a4ArmedVersion ?? -1) === 0,
    theReadWalksTheContainmentChainWidestFirst: i.chainOrder,
  }),
  input: {
    reads: VERSION_READS,
    chainOrder: (() => {
      const fn = A4WORLD_SRC.slice(A4WORLD_SRC.indexOf('export function a4ArmedVersion'));
      const body = fn.slice(0, fn.indexOf('\n}'));
      return body.indexOf('pcArmedVersion(match)') < body.indexOf('l3ArmedVersion(match)')
        && body.indexOf('l3ArmedVersion(match)') < body.indexOf('cbArmedVersion(match)');
    })(),
  },
  mutants: [
    { conjunct: 'aWorldEightMatchReportsEight', name: 'the world-8 match was mislabelled', mutate: (i) => ({ ...i, reads: i.reads.map((r) => (r.arm === 'v8matured' ? { ...r, a4ArmedVersion: 7 } : r)) }) },
    { conjunct: 'aWorldSevenMatchStillReportsSeven', name: 'the world-7 read broke', mutate: (i) => ({ ...i, reads: i.reads.map((r) => (r.arm === 'v7' ? { ...r, a4ArmedVersion: 8 } : r)) }) },
    { conjunct: 'aWorldSixMatchStillReportsSix', name: 'the world-6 read broke', mutate: (i) => ({ ...i, reads: i.reads.map((r) => (r.arm === 'v6' ? { ...r, a4ArmedVersion: 8 } : r)) }) },
    { conjunct: 'theProductionMatchReportsNothing', name: 'the shipped world claimed a version', mutate: (i) => ({ ...i, reads: i.reads.map((r) => (r.arm === 'production' ? { ...r, a4ArmedVersion: 8 } : r)) }) },
    { conjunct: 'theReadWalksTheContainmentChainWidestFirst', name: 'the read order was inverted', mutate: (i) => ({ ...i, chainOrder: false }) },
  ],
});

/* ---- 8 ⭐ gEntry — the URL-param → flags → chunk chain, exercised ---- */
registerGate<typeof ENTRY_CHAIN & { armingSites: number; imports: number; pins: number }>({
  name: 'gEntry',
  fn: (i) => ({
    theUrlParamNamesExactlyTheEightWorlds:
      i.urlEightArmsWorldEight && i.urlNineIsNothing && i.urlSevenStillArmsWorldSeven
      && i.urlZeroStillDisarms,
    theDoseParamDefaultsToMaturedAndNamesTheWeakForm:
      i.doseParamDefaultsToMatured && i.doseParamZeroIsTheWeakForm
      && i.doseParamOffAndEmptyAlsoWork,
    theFlagsAreWorldSevenPlusTheDoor: i.flagsAreWorldSevenPlusTheDoor,
    theChunkIsExcludedFromTheShellAndTheMainBundleIsNot:
      i.theChunkIsExcludedFromTheShell && i.theMainBundleIsStillShell
      && i.theExclusionListNamesThePcPrefix,
    theAppStillHasExactlyOneArmingCallSite: i.armingSites === 1,
    everyWorldModelArtifactIsBehindADynamicImport: i.imports === 4,
    thePermanentPinSuiteExistsAndHasRealTests: i.pins >= 20,
  }),
  input: {
    ...ENTRY_CHAIN,
    armingSites: ARMING_CALL_SITES,
    imports: DYNAMIC_ARTIFACT_IMPORTS,
    pins: (PIN_SUITE_SRC.match(/\n {2}it\(/g) ?? []).length,
  },
  mutants: [
    { conjunct: 'theUrlParamNamesExactlyTheEightWorlds', name: 'a ninth world became reachable', mutate: (i) => ({ ...i, urlNineIsNothing: false }) },
    { conjunct: 'theDoseParamDefaultsToMaturedAndNamesTheWeakForm', name: 'the dose param stopped defaulting to matured', mutate: (i) => ({ ...i, doseParamDefaultsToMatured: false }) },
    { conjunct: 'theFlagsAreWorldSevenPlusTheDoor', name: 'the substrate drifted from world 7', mutate: (i) => ({ ...i, flagsAreWorldSevenPlusTheDoor: false }) },
    { conjunct: 'theChunkIsExcludedFromTheShellAndTheMainBundleIsNot', name: 'the dose chunk entered the shell', mutate: (i) => ({ ...i, theChunkIsExcludedFromTheShell: false }) },
    { conjunct: 'theAppStillHasExactlyOneArmingCallSite', name: 'a second arming call site appeared', mutate: (i) => ({ ...i, armingSites: 2 }) },
    { conjunct: 'everyWorldModelArtifactIsBehindADynamicImport', name: 'an artifact left the async chunks', mutate: (i) => ({ ...i, imports: 3 }) },
    { conjunct: 'thePermanentPinSuiteExistsAndHasRealTests', name: 'the pin suite was emptied out', mutate: (i) => ({ ...i, pins: 0 }) },
  ],
});

/* ---- 9 ⭐⭐ gPrecache — the REAL build: emitted, excluded, and not in the main path ---- */
registerGate<{
  dist: boolean; chunks: number; precachedPc: number; precachedL3: number; precachedStage3: number;
  entries: number; needlesMain: number; needlesChunk: number; chunkBytes: number;
  mainInPrecache: boolean;
}>({
  name: 'gPrecache',
  fn: (i) => ({
    theBuildWasReadFromDisk: i.dist && i.entries > 0 && i.mainInPrecache,
    theDoseChunkIsEMITTEDAsItsOwnAsyncChunk: i.chunks === 1 && i.chunkBytes > 0,
    theDoseChunkIsNOTPRECACHED: i.precachedPc === 0,
    theOtherOptInChunksAreStillExcludedToo: i.precachedL3 === 0 && i.precachedStage3 === 0,
    theCellsAreInTheCHUNKAndNotInTheMainBundle:
      i.needlesChunk === NEEDLES.length && i.needlesMain === 0,
  }),
  input: {
    dist: DIST_PRESENT, chunks: PC_CHUNKS.length, precachedPc: PRECACHED_PC,
    precachedL3: PRECACHED_L3, precachedStage3: PRECACHED_STAGE3,
    entries: PRECACHE_ENTRIES.length, needlesMain: NEEDLES_IN_MAIN,
    needlesChunk: NEEDLES_IN_CHUNK, chunkBytes: PC_CHUNK_BYTES,
    mainInPrecache: PRECACHE_ENTRIES.some((e) => e.startsWith('./assets/index-') && e.endsWith('.js')),
  },
  mutants: [
    { conjunct: 'theBuildWasReadFromDisk', name: 'the precache list came back empty (the vacuous pass)', mutate: (i) => ({ ...i, entries: 0, mainInPrecache: false }) },
    { conjunct: 'theDoseChunkIsEMITTEDAsItsOwnAsyncChunk', name: 'the chunk was not emitted', mutate: (i) => ({ ...i, chunks: 0 }) },
    { conjunct: 'theDoseChunkIsNOTPRECACHED', name: 'the chunk entered the precache', mutate: (i) => ({ ...i, precachedPc: 1 }) },
    { conjunct: 'theOtherOptInChunksAreStillExcludedToo', name: 'an older opt-in chunk entered the precache', mutate: (i) => ({ ...i, precachedL3: 1 }) },
    { conjunct: 'theCellsAreInTheCHUNKAndNotInTheMainBundle', name: 'the cells leaked into the main bundle', mutate: (i) => ({ ...i, needlesMain: 1 }) },
  ],
});

/* ---- 10 ⭐ gSeam — the CB seat's arming block is untouched by this rung ---- */
registerGate<{ cbBlockChars: number; cbInDiff: number; engine: number; pcTokensInBrain: number }>({
  name: 'gSeam',
  fn: (i) => ({
    theCbSeatArmingBlockWasActuallyFound: i.cbBlockChars > 0,
    theCbSeatArmingBlockIsUntouchedByThisRung: i.cbInDiff === 0,
    noEngineFileIsInThisRungsDiffAtAll: i.engine === 0,
    theBrainStillCarriesNoPcToken: i.pcTokensInBrain === 0,
  }),
  input: {
    cbBlockChars: CB_ARMING_BLOCK.length,
    cbInDiff: CB_ARMING_BLOCK_IN_DIFF,
    engine: ENGINE_TOUCHED.length,
    pcTokensInBrain: (BRAIN_SRC.match(/\bpc(?:Latency|ReactionLatency|Hold|Recognition)/g) ?? []).length,
  },
  mutants: [
    { conjunct: 'theCbSeatArmingBlockWasActuallyFound', name: 'the block could not be located', mutate: (i) => ({ ...i, cbBlockChars: 0 }) },
    { conjunct: 'theCbSeatArmingBlockIsUntouchedByThisRung', name: 'the CB arming block entered this diff', mutate: (i) => ({ ...i, cbInDiff: 1 }) },
    { conjunct: 'noEngineFileIsInThisRungsDiffAtAll', name: 'an engine file moved', mutate: (i) => ({ ...i, engine: 1 }) },
    { conjunct: 'theBrainStillCarriesNoPcToken', name: 'the brain learned about the PC seam', mutate: (i) => ({ ...i, pcTokensInBrain: 1 }) },
  ],
});

/* ---- 11 gSeed — BOOKED = WALKED ---- */
const CLAIMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'identity walks (flags off, twice each)', range: [IDENT_SEEDS[0], IDENT_SEEDS[IDENT_SEEDS.length - 1]] },
  { name: 'arm battery × 3 arms (v7 · v8 empty · v8 matured), each walked TWICE for G-DET', range: [ARM_SEEDS[0], ARM_SEEDS[ARM_SEEDS.length - 1]] },
  { name: 'the version-read seed (4 worlds constructed)', range: [VERSION_SEED, VERSION_SEED] },
  { name: '⚠ DECLARED AND DRAWN: the preflight band (smoke runs, /tmp only)', range: PREFLIGHT_BAND },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const inBlock = CLAIMED.every((c) => c.range[0] >= BLOCK[0] && c.range[1] <= BLOCK[1]);
const disjointFromConsumed = CLAIMED.every((c) => !CONSUMED.some((k) => overlaps(c.range, k.range)));
const claimedDisjoint = CLAIMED.every((a, i) => CLAIMED
  .every((b, j) => i === j || !overlaps(a.range, b.range)));
registerGate<{ inBlock: boolean; disjoint: boolean; selfDisjoint: boolean; n: number }>({
  name: 'gSeed',
  fn: (i) => ({
    everyClaimedRangeIsInsideTheDispatchedBlock: i.inBlock,
    noClaimedRangeTouchesAConsumedBand: i.disjoint,
    theClaimedRangesAreMutuallyDisjoint: i.selfDisjoint,
    nonVacuousClaimCount: i.n > 0,
  }),
  input: { inBlock, disjoint: disjointFromConsumed, selfDisjoint: claimedDisjoint, n: CLAIMED.length },
  mutants: [
    { conjunct: 'everyClaimedRangeIsInsideTheDispatchedBlock', name: 'a range left the block', mutate: (i) => ({ ...i, inBlock: false }) },
    { conjunct: 'noClaimedRangeTouchesAConsumedBand', name: 'a range re-used consumed seeds', mutate: (i) => ({ ...i, disjoint: false }) },
    { conjunct: 'theClaimedRangesAreMutuallyDisjoint', name: 'two claimed ranges overlapped', mutate: (i) => ({ ...i, selfDisjoint: false }) },
    { conjunct: 'nonVacuousClaimCount', name: 'nothing was claimed', mutate: (i) => ({ ...i, n: 0 }) },
  ],
});

/* ---- 12 gStats ---- */
registerGate<{ draws: number; floor: number }>({
  name: 'gStats',
  fn: (i) => ({
    thisRungDrawsNoStatsStream: i.draws === 0,
    theFloorFromTheRulingIsRecorded: i.floor === STATS_FLOOR_FROM_RULING,
  }),
  input: { draws: STATS_DRAWS, floor: STATS_FLOOR_FROM_RULING },
  mutants: [
    { conjunct: 'thisRungDrawsNoStatsStream', name: 'a stats draw appeared', mutate: (i) => ({ ...i, draws: 1 }) },
    { conjunct: 'theFloorFromTheRulingIsRecorded', name: 'the floor was mis-recorded', mutate: (i) => ({ ...i, floor: 0 }) },
  ],
});

/* ---- 13 gEnvClean ---- */
registerGate<{ rogueOwn: number; rogueEngine: number; preflight: boolean; canonical: boolean }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnEnv: i.rogueOwn === 0,
    noEngineDoorIsSet: i.rogueEngine === 0,
    aPreflightNeverWritesACanonicalPath: !(i.preflight && i.canonical),
  }),
  input: {
    rogueOwn: rogueOwn.length, rogueEngine: rogueEngine.length, preflight: IS_PREFLIGHT,
    canonical: isCanonicalPath(OUT_PATH),
  },
  mutants: [
    { conjunct: 'noRogueOwnEnv', name: 'a rogue own env survived', mutate: (i) => ({ ...i, rogueOwn: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door survived', mutate: (i) => ({ ...i, rogueEngine: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote a canonical path', mutate: (i) => ({ ...i, preflight: true, canonical: true }) },
  ],
});

/* ---- 14 gFaces — the published receipts re-derive from the STORED rows, off disk ---- */
const gFacesInput = { checked: 0, bad: 1, parsed: false, keys: 0 };
const RECEIPT_KEYS = ['identity', 'armedCorridor', 'versionValue', 'dose', 'chunkCost'] as const;
registerGate<typeof gFacesInput>({
  name: 'gFaces',
  fn: (i) => ({
    theSerializedArtifactParsesBackOffDisk: i.parsed,
    everyPublishedReceiptRederivesFromTheStoredRows: i.bad === 0,
    everyFrozenReceiptIsPublished: i.keys === RECEIPT_KEYS.length,
    nonVacuousRederivationCount: i.checked > 0,
  }),
  input: gFacesInput,
  mutants: [
    { conjunct: 'theSerializedArtifactParsesBackOffDisk', name: 'the artifact could not be re-read', mutate: (i) => ({ ...i, parsed: false }) },
    { conjunct: 'everyPublishedReceiptRederivesFromTheStoredRows', name: 'a receipt did not re-derive', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyFrozenReceiptIsPublished', name: 'a receipt went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousRederivationCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 15 ⭐⭐ gSchema — the ALLOWLIST SCHEMA, proven able to refuse ---- */
const schemaInput = {
  violations: [] as string[], schemaKeys: 0, refusesUnknownField: false,
  refusesMissingField: false, refusesObjectInLeaf: false, refusesAWallClockField: false,
};
registerGate<typeof schemaInput>({
  name: 'gSchema',
  fn: (i) => ({
    theBodyValidatesAgainstTheAllowlistSchema: i.violations.length === 0,
    theSchemaIsNonVacuous: i.schemaKeys > 50,
    theSchemaRefusesAnUnknownFieldAndAMissingOne:
      i.refusesUnknownField && i.refusesMissingField,
    theSchemaRefusesAnObjectInALeafSlotAndAWallClock:
      i.refusesObjectInLeaf && i.refusesAWallClockField,
  }),
  input: schemaInput,
  mutants: [
    { conjunct: 'theBodyValidatesAgainstTheAllowlistSchema', name: 'the body broke its schema', mutate: (i) => ({ ...i, violations: ['x'] }) },
    { conjunct: 'theSchemaIsNonVacuous', name: 'the schema was emptied', mutate: (i) => ({ ...i, schemaKeys: 0 }) },
    { conjunct: 'theSchemaRefusesAnUnknownFieldAndAMissingOne', name: 'the schema stopped refusing an unknown field', mutate: (i) => ({ ...i, refusesUnknownField: false }) },
    { conjunct: 'theSchemaRefusesAnObjectInALeafSlotAndAWallClock', name: 'a wall clock could enter the body', mutate: (i) => ({ ...i, refusesAWallClockField: false }) },
  ],
});

/* ---- 16 ⭐ gUnits — a field carries the unit its name claims (#294 item 3) ---- */
const unitsInput = { violations: [] as string[], checkedLeaves: 0, refusesAViolation: false };
registerGate<typeof unitsInput>({
  name: 'gUnits',
  fn: (i) => ({
    everyUnitClaimingLeafCarriesItsUnit: i.violations.length === 0,
    nonVacuousLeafCount: i.checkedLeaves > 0,
    theCheckIsProvenAbleToRefuse: i.refusesAViolation,
  }),
  input: unitsInput,
  mutants: [
    { conjunct: 'everyUnitClaimingLeafCarriesItsUnit', name: 'a unit-claiming field lied', mutate: (i) => ({ ...i, violations: ['x'] }) },
    { conjunct: 'nonVacuousLeafCount', name: 'no leaf was checked', mutate: (i) => ({ ...i, checkedLeaves: 0 }) },
    { conjunct: 'theCheckIsProvenAbleToRefuse', name: 'the check could not fail', mutate: (i) => ({ ...i, refusesAViolation: false }) },
  ],
});

/* ---- 17 gEnvelope — the digest survives a PATH-VARIED re-run ---- */
const envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false };
registerGate<typeof envelopeInput>({
  name: 'gEnvelope',
  fn: (i) => ({
    theBodyRederivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOutAtAnotherPathWithAnotherEnvelopeHasTheIdenticalDigest: i.crossOutIdentical,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyRederivesItsDigestFromDisk', name: 'the artifact on disk did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'aCrossOutAtAnotherPathWithAnotherEnvelopeHasTheIdenticalDigest', name: 'the envelope entered the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
  ],
});

/* ---- 18 gMutants ---- */
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
/* §7 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
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
  banner('PC-ENTRY REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §8 THE ALLOWLIST SCHEMA + THE UNIT CHECK                                    */
/* ========================================================================== */
type SchemaNode = 'LEAF' | { [k: string]: SchemaNode } | [SchemaNode];
const LEAF: SchemaNode = 'LEAF';
const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);
const primitiveOk = (v: unknown): boolean =>
  v === null || ['string', 'number', 'boolean'].includes(typeof v);
const leafOk = (v: unknown): boolean => (Array.isArray(v) ? v.every(leafOk) : primitiveOk(v));
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
  for (const k of Object.keys(value)) if (!(k in node)) out.push(`${path}.${k}: NOT IN THE SCHEMA`);
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
const nodeOf = (keys: readonly string[]): SchemaNode =>
  Object.fromEntries(keys.map((k) => [k, LEAF])) as SchemaNode;

/** ⭐ #294 item 3 — a field carries the unit its name claims, and the check can refuse. */
const UNIT_LEAVES_SEEN = { n: 0 };
const unitViolationsOf = (body: unknown): string[] => {
  const out: string[] = [];
  UNIT_LEAVES_SEEN.n = 0;
  const walkNode = (v: unknown, path: string, name: string): void => {
    if (Array.isArray(v)) { v.forEach((x, i) => walkNode(x, `${path}[${i}]`, name)); return; }
    if (v !== null && typeof v === 'object') {
      for (const [k, x] of Object.entries(v as Record<string, unknown>)) walkNode(x, `${path}.${k}`, k);
      return;
    }
    if (v === null) return;
    UNIT_LEAVES_SEEN.n += 1;
    if (/Sha256$/.test(name)) {
      if (typeof v !== 'string' || !/^[0-9a-f]{64}$/.test(v)) {
        out.push(`${path}: a *Sha256 name that is not a 64-hex digest`);
      }
      return;
    }
    if (/(Metres|SimSeconds|Ticks|Share|Bytes|Count)$/.test(name)) {
      if (typeof v !== 'number') { out.push(`${path}: "${name}" claims a unit but holds ${typeof v}`); return; }
      if (/Share$/.test(name) && Number.isFinite(v) && (v < -1e-9 || v > 1 + 1e-9)) {
        out.push(`${path}: a *Share outside [0, 1] (${v})`);
      }
      if (/(Ticks|Bytes|Count)$/.test(name) && Number.isFinite(v) && !Number.isInteger(v)) {
        out.push(`${path}: a *${/Ticks$/.test(name) ? 'Ticks' : /Bytes$/.test(name) ? 'Bytes' : 'Count'} field that is not an integer (${v})`);
      }
    }
  };
  walkNode(body, '$', 'body');
  return out;
};

/* ========================================================================== */
/* §9 THE ARTIFACT                                                             */
/* ========================================================================== */
const RECEIPTS = {
  identity: {
    what: '⭐⭐ RECEIPT 3 — FLAGS OFF ⇒ THE SHIPPED WORLD, UNTOUCHED. Every identity seed walked '
      + 'to the final tick twice: the signature reproduces, the latency seat is null, the door is '
      + 'off, the defence seat is null and the entry-layer read names no world. The structural '
      + 'half is xDiffScope: not one file under src/sim, src/ai or src/evolution moved.',
    seedsWalked: IDENT_SEEDS.length,
    walksReproducing: IDENT_ROWS.filter((r) => r.reproduces).length,
    walksFullyDormant: IDENT_ROWS.filter((r) => r.seatNull && r.doorOff && r.defenceSeatNull
      && r.armedVersion === 0).length,
    leagueFingerprint: LEAGUE_FP,
    leagueFingerprintOfRecord: LEAGUE_FINGERPRINT_OF_RECORD,
    engineFilesTouched: ENGINE_TOUCHED.length,
  },
  armedCorridor: {
    what: '⭐⭐ RECEIPTS 1 AND 2 — THE ARMED WORLD THROUGH THE ENTRY\'S OWN PATH. `a4MatchFlags(8)` '
      + 'onto League.matchFlags at construction and `armA4World(m, null, 8, l3Dose, pcDose)` after '
      + 'it, with the dose from the entry\'s own `loadPcDose()`. ⚠ A RECEIPT CORRIDOR, NOT A '
      + 'RE-EXAM: a handful of league fixtures, no CI, no test, no denominator discipline. '
      + 'PC-T2 owns the estimate.',
    corridor: CORRIDOR,
    pcT2PooledSimpleShareMatured: PC_T2_POOLED_SIMPLE_SHARE_MATURED,
    maturedPooledSimpleShare: MATURED_SIMPLE_SHARE,
    emptyPooledSimpleShare: EMPTY_SIMPLE_SHARE,
    maturedArmsSimple: sum(rowsOf('v8matured').map((r) => r.armsSimple)),
    maturedArmsChoice: sum(rowsOf('v8matured').map((r) => r.armsChoice)),
    emptyArmsSimple: sum(rowsOf('v8empty').map((r) => r.armsSimple)),
    emptyArmsChoice: sum(rowsOf('v8empty').map((r) => r.armsChoice)),
    maturedHeldExecutorTicks: sum(rowsOf('v8matured').map((r) => r.heldExecutorTicks)),
    emptyHeldExecutorTicks: sum(rowsOf('v8empty').map((r) => r.heldExecutorTicks)),
    maturedDecisionsHeld: sum(rowsOf('v8matured').map((r) => r.decisionsHeld)),
    emptyDecisionsHeld: sum(rowsOf('v8empty').map((r) => r.decisionsHeld)),
    emptyBookExposuresAtConstruction: sum(rowsOf('v8empty').map((r) => r.bookExposuresAtConstruction)),
    emptyBookExposuresAtWhistleMean: round(mean(rowsOf('v8empty').map((r) => r.bookExposuresAtWhistle))),
    maturedGoalsMean: round(mean(rowsOf('v8matured').map((r) => r.goals))),
    emptyGoalsMean: round(mean(rowsOf('v8empty').map((r) => r.goals))),
    v7GoalsMean: round(mean(rowsOf('v7').map((r) => r.goals))),
    tierSimpleTicks: PC_TIER_SIMPLE_TICKS,
    tierChoiceTicks: PC_TIER_CHOICE_TICKS,
    note: '⚠ GOALS AND EXPOSURES ARE COUNTS OF A HANDFUL OF MATCHES — plumbing receipts, never '
      + 'effect sizes (#289 item 1). Nothing here estimates anything.',
  },
  versionValue: {
    what: '⭐⭐ RECEIPT 4 — THE NEW VERSION VALUE. BU-T1 §DOUBTS 7 recorded the mislabel class: '
      + '"`a4ArmedVersion` HAS NO NAME FOR THIS COMPOSITION … the entry layer would need a new '
      + 'version value first". World 8 has one, and the shipped read now walks the containment '
      + 'chain widest-first, so a world-8 match reports EIGHT and the worlds it contains still '
      + 'report themselves.',
    reads: VERSION_READS,
    armedWalksReportingEight: ARMED_ROWS.filter((r) => r.armedVersion === PC_WORLD_VERSION).length,
    ofArmedWalks: ARMED_ROWS.length,
    controlWalksReportingSeven: rowsOf('v7').filter((r) => r.armedVersion === L3_WORLD_VERSION).length,
    ofControlWalks: rowsOf('v7').length,
  },
  dose: {
    what: '⭐⭐ THE DOSE IS PC-T2\'s ARM-C TABLE, re-derived by the entry\'s own exported pooling '
      + 'law from PC-T1\'s committed artifact and proven BIT-EQUAL to the table PC-T2 committed. '
      + 'Written through the recognition book\'s own public note() — the only way a cell moves in '
      + 'the shipped seam.',
    source: `${PC_T1_PATH} · perBookCells[].armsByBodyCell, read AT RUN TIME, never typed`,
    arithmetic: 'dose[rosterIdx][cell] = round( Σ_books Σ_sides armsByBodyCell[side·9 + '
      + 'rosterIdx][cell] ÷ (books × sides × seasons) ) — PC-T2 §FORM, verbatim',
    pcT1FileBytesSha256: PC_T1_BYTES_SHA_MEASURED,
    pcT1DeclaredBytesSha256: PC_T1_BYTES_SHA,
    pcT1CommittedResultSha256: PC_T1_FILE.resultSha256,
    pcT1ShippedConstant: PC_T1_SHA,
    pcT2CommittedResultSha256: PC_T2_FILE.resultSha256,
    identicalToPcT2CommittedTable: canonical(PC_DOSE_REDERIVED) === canonical(PC_T2_DOSE_TABLE),
    loaderReturnsTheSameTable: canonical(DOSE) === canonical(PC_T2_DOSE_TABLE),
    exposuresPerBookCount: sum(PC_DOSE_REDERIVED.map((r) => sum(r))),
    slotCount: PC_DOSE_REDERIVED.length,
    cellCount: PC_BOOK_CELLS.length,
    coveredSlotCellCount: PC_DOSE_REDERIVED
      .reduce((a, r) => a + r.filter((v) => v >= PC_N_COVER).length, 0),
    nCover: PC_N_COVER,
    books: PC_T2_FILE.frozen.doseProvenance.books,
    seasons: PC_T2_FILE.frozen.doseProvenance.seasons,
    sides: PC_T2_FILE.frozen.doseProvenance.sides,
    denominator: PC_T2_FILE.frozen.doseProvenance.denominator,
    writtenThrough: 'PcRecognitionBook.note(rosterIdx, key)',
    l3DoseLabelsCount: L3_DOSE.reduce((a, c) => a + c.lunges, 0),
    disclosure: '⚠ PC-T2 §COMMANDER CORRECTIONS item 6, carried: the slot-pooled dose ERASES the '
      + 'across-bodies spread — every body in a slot carries an identical book. A LEVEL, not a '
      + 'population of careers, and this entry makes no role claim of any kind.',
  },
  chunkCost: {
    what: '⭐ THE COST OF RECORD, MEASURED IN ONE ENVIRONMENT (the #283.2(i) lesson: a '
      + 'cross-environment size comparison does not reproduce). The dose rides its own async '
      + 'chunk, the service worker does not precache it, and the artifact\'s own keys are absent '
      + 'from the main bundle. The main-bundle DELTA is measured separately and reported in the '
      + 'stage doc with the environment named.',
    distRead: DIST_PRESENT,
    precacheEntryCount: PRECACHE_ENTRIES.length,
    precacheEntriesNamingThePcChunkCount: PRECACHED_PC,
    precacheEntriesNamingTheL3ChunkCount: PRECACHED_L3,
    precacheEntriesNamingTheCensusTablesCount: PRECACHED_STAGE3,
    doseChunkFileName: PC_CHUNKS[0] ?? 'NONE',
    doseChunkBytes: PC_CHUNK_BYTES,
    mainBundleFileName: MAIN_CHUNKS[0] ?? 'NONE',
    mainBundleBytes: MAIN_BUNDLE_BYTES,
    artifactNeedlesInTheChunkCount: NEEDLES_IN_CHUNK,
    artifactNeedlesInTheMainBundleCount: NEEDLES_IN_MAIN,
    needles: NEEDLES,
  },
} as const;

const rederiveFromDisk = (p: string): { parsed: boolean; checked: number; bad: number } => {
  let parsed = false;
  let checked = 0;
  let bad = 0;
  try {
    const f = readJson(p);
    parsed = true;
    const r = f.receipts as Record<string, Record<string, unknown>>;
    const arms = f.armRows as ArmRow[];
    const ident = f.identityRows as IdentRow[];
    const eq = (a: number, b: number): void => { checked++; if (a !== b) bad++; };
    const armsOf = (a: Arm): ArmRow[] => arms.filter((x) => x.arm === a);
    eq(r.identity.walksReproducing as number, ident.filter((x) => x.reproduces).length);
    eq(r.identity.seedsWalked as number, ident.length);
    eq(r.armedCorridor.maturedArmsSimple as number,
      sum(armsOf('v8matured').map((x) => x.armsSimple)));
    eq(r.armedCorridor.maturedArmsChoice as number,
      sum(armsOf('v8matured').map((x) => x.armsChoice)));
    eq(r.armedCorridor.emptyArmsSimple as number, sum(armsOf('v8empty').map((x) => x.armsSimple)));
    eq(r.armedCorridor.maturedPooledSimpleShare as number, round(
      sum(armsOf('v8matured').map((x) => x.armsSimple))
      / sum(armsOf('v8matured').map((x) => x.armsSimple + x.armsChoice)),
    ));
    eq(r.armedCorridor.emptyBookExposuresAtConstruction as number,
      sum(armsOf('v8empty').map((x) => x.bookExposuresAtConstruction)));
    eq(r.versionValue.armedWalksReportingEight as number,
      arms.filter((x) => x.arm !== 'v7' && x.armedVersion === PC_WORLD_VERSION).length);
    eq(r.versionValue.controlWalksReportingSeven as number,
      armsOf('v7').filter((x) => x.armedVersion === L3_WORLD_VERSION).length);
    eq(r.dose.exposuresPerBookCount as number, sum(PC_DOSE_REDERIVED.map((x) => sum(x))));
  } catch {
    parsed = false;
  }
  return { parsed, checked, bad };
};

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PC-ENTRY — THE ?a4world=8 PLAY-TEST ENTRY (processing time, live in a watchable world)',
  doc: 'docs/world-model/PC-ENTRY-RUNG.md',
  dispatch: 'ruling #300 item 6; the L3-ENTRY precedent (#282.4 / #283.2)',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    whatThisRungIs: 'AN ENTRY, NOT A GATE BATTERY. It adds no mechanism and draws no inferential '
      + 'statistic; every number is a plumbing receipt (canon, home ruling #289 item 1: "arming '
      + 'receipts, not football findings").',
    world: 'world 8 = a4MatchFlags(7) — CALLED, not copied — plus pcReactionLatency, with the '
      + 'recognition books dosed from PC-T2\'s arm-C table. The L3 matured cells ride ALWAYS '
      + '(they are part of the v7 stack PC-T2 measured the latency on).',
    contrast: `?${PC_DOSE_PARAM}=0 plays the same world with BORN-ABSENT books — PC-T2's `
      + 'v7pcEmpty arm, and the honest expectation is that it is the WILDEST of the two.',
    corridorLaw: 'the receipt corridor was frozen ABOVE the numbers and no gate reads a football '
      + 'claim: the armed world must land in [0.85, 1.0] pooled SIMPLE share, which is a '
      + 'neighbourhood check against PC-T2\'s 0.9491922761868649, not a re-estimate of it.',
    declaredSrcScope: DECLARED_SRC_SCOPE,
    engineDirsThatMayNotMove: ENGINE_DIRS,
    pinSuite: PIN_SUITE_PATH,
    dispatchCommit: DISPATCH_HEAD,
    workerHonesty: 'canon, home ruling #283.2(iv), verbatim: "WORKER-SIMMED fixtures play the '
      + 'SHIPPED world (matchFlags not serialized)". A watched world-8 match is armed; the '
      + 'league\'s background fixtures are the shipped world.',
  },
  receipts: RECEIPTS,
  identityRows: IDENT_ROWS,
  armRows: ARM_ROWS,
  entryChain: ENTRY_CHAIN,
  srcReceipts: {
    touched: TOUCHED,
    diffStat: DIFF_STAT,
    engineFilesTouched: ENGINE_TOUCHED,
    armingCallSitesInTheApp: ARMING_CALL_SITES,
    dynamicWorldModelImportsInTheEntry: DYNAMIC_ARTIFACT_IMPORTS,
    theRawImportIsDynamic: RAW_IMPORT_IS_DYNAMIC,
    doseNumeralsTypedIntoSrcCount: DOSE_NUMERALS_IN_SRC,
    recognitionBookPublicMutatorCount: BOOK_WRITE_METHODS,
    doseWritesThroughNote: DOSE_WRITES_THROUGH_NOTE,
    cbSeatArmingBlockBytes: CB_ARMING_BLOCK.length,
    cbSeatArmingBlockSha256: CB_ARMING_BLOCK_SHA,
    cbSeatLinesInThisRungsDiffCount: CB_ARMING_BLOCK_IN_DIFF,
    pcTokensInThePlayerBrainCount:
      (BRAIN_SRC.match(/\bpc(?:Latency|ReactionLatency|Hold|Recognition)/g) ?? []).length,
    pinSuiteTestCount: (PIN_SUITE_SRC.match(/\n {2}it\(/g) ?? []).length,
  },
  seeds: { block: BLOCK, claimed: CLAIMED, consumedLedger: CONSUMED,
    verifierScratchCanon: 'ruling #294 item 3, verbatim: "verifier scratch = the stage\'s '
      + 'consumed band or ≥ 900,000,000, never the next virgin block".' },
  stats: { draws: STATS_DRAWS, floorFromRuling: STATS_FLOOR_FROM_RULING },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ THIS RUNG ADDS NO MECHANISM AND MAKES NO FOOTBALL CLAIM. Every count is a receipt; '
      + 'PC-T2 owns the estimates and the user\'s eyes own the verdict.',
    'The corridor is a NEIGHBOURHOOD CHECK on a handful of league fixtures — not an estimate, '
      + 'not a replication, and not commensurable with PC-T2\'s 200-seed battery.',
    'The dose is a DECLARED PRESENTATION CHOICE (#270.3(1)), not a claim that a shipped world '
      + 'should start its defences experienced.',
    'Nothing here measures whether the world looks better. That is the play-test gate.',
  ],
});

const ROW_NODE = nodeOf(Object.keys(ARM_ROWS[0] ?? {
  seed: 0, arm: '', signature: '', armedVersion: 0, pcVersion: 0, l3Version: 0, seatLive: false,
  nCover: 0, clockSimSeconds: 0, bookExposuresAtConstruction: 0,
  booksMatchTheDoseAtConstruction: false, armsSimple: 0, armsChoice: 0, simpleShare: 0,
  heldExecutorTicks: 0, decisionsHeld: 0, exposuresNoted: 0, bookExposuresAtWhistle: 0,
  genomeCleanOfPcKeys: false, goals: 0,
}));
const BODY_SCHEMA: SchemaNode = {
  stage: LEAF, doc: LEAF, dispatch: LEAF, envWhitelist: LEAF, engineEnvDoorsRefused: LEAF,
  frozen: nodeOf(['whatThisRungIs', 'world', 'contrast', 'corridorLaw', 'declaredSrcScope',
    'engineDirsThatMayNotMove', 'pinSuite', 'dispatchCommit', 'workerHonesty']),
  receipts: {
    identity: nodeOf(Object.keys(RECEIPTS.identity)),
    armedCorridor: nodeOf(Object.keys(RECEIPTS.armedCorridor)),
    versionValue: {
      ...(nodeOf(Object.keys(RECEIPTS.versionValue).filter((k) => k !== 'reads')) as Record<string, SchemaNode>),
      reads: [nodeOf(Object.keys(VERSION_READS[0]))],
    },
    dose: nodeOf(Object.keys(RECEIPTS.dose)),
    chunkCost: nodeOf(Object.keys(RECEIPTS.chunkCost)),
  },
  identityRows: [nodeOf(Object.keys(IDENT_ROWS[0]))],
  armRows: [ROW_NODE],
  entryChain: nodeOf(Object.keys(ENTRY_CHAIN)),
  srcReceipts: nodeOf(['touched', 'diffStat', 'engineFilesTouched', 'armingCallSitesInTheApp',
    'dynamicWorldModelImportsInTheEntry', 'theRawImportIsDynamic', 'doseNumeralsTypedIntoSrcCount',
    'recognitionBookPublicMutatorCount', 'doseWritesThroughNote', 'cbSeatArmingBlockBytes',
    'cbSeatArmingBlockSha256', 'cbSeatLinesInThisRungsDiffCount', 'pcTokensInThePlayerBrainCount',
    'pinSuiteTestCount']),
  seeds: {
    block: LEAF, claimed: [{ name: LEAF, range: LEAF }],
    consumedLedger: [{ name: LEAF, range: LEAF }], verifierScratchCanon: LEAF,
  },
  stats: nodeOf(['draws', 'floorFromRuling']),
  gDetDigests: { runA: LEAF, runB: LEAF },
  gates: Object.fromEntries(REGISTRY.map((s) => [s.name, LEAF])) as SchemaNode,
  mutants: [nodeOf(['gate', 'name', 'conjunct', 'flipped', 'othersSurvived', 'live'])],
  coverage: Object.fromEntries(REGISTRY.map((s) => [s.name, LEAF])) as SchemaNode,
  conjunctTotal: LEAF, allGatesPass: LEAF, nonClaims: LEAF,
};
const SCHEMA_KEYS = countSchemaKeys(BODY_SCHEMA);

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, mode: MODE, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall, walkMs: WALK_MS,
    note: 'UNHASHED (#266.3(a) / #289 item 1): head, timestamps, paths and all machine timings '
      + 'live here BY NAME so resultSha256 re-derives at any commit or path. ⭐ The body itself '
      + 'is built from an ALLOWLIST SCHEMA (canon, home PC-T0 §COMMANDER CORRECTIONS item 1), so '
      + 'a timing cannot reach it even under a new field name.',
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pc-entry-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7, walkMs: 0,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD', mode: 'ANOTHER-MODE',
      preflight: !IS_PREFLIGHT, preflightReasons: ['ANOTHER-REASON'],
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

/** the schema's own REFUSAL receipts, exercised on real mutated bodies. */
const schemaRefuses = (mutate: (b: Record<string, unknown>) => void): boolean => {
  const probeBody = buildBody({}, []);
  mutate(probeBody);
  const v: string[] = [];
  validate(probeBody, BODY_SCHEMA, '$', v);
  return v.length > 0;
};

let { gates, mutants } = runRegistry();
{
  const rawBody0 = buildBody(gates, mutants);
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
  unitsInput.refusesAViolation = unitViolationsOf(
    { probe: { aFakeShare: 7, aFakeTicks: 1.5, aFakeMetres: 'not-a-number', aFakeSha256: 'nope' } },
  ).length === 4;
  unitsInput.violations = unitViolationsOf(rawBody0);
  unitsInput.checkedLeaves = UNIT_LEAVES_SEEN.n;
}
({ gates, mutants } = runRegistry());
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
const disk = rederiveFromDisk(OUT_PATH);
gFacesInput.checked = disk.checked;
gFacesInput.bad = disk.bad;
gFacesInput.parsed = disk.parsed;
gFacesInput.keys = Object.keys(RECEIPTS).length;
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pc-entry] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pc-entry] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
if (schemaInput.violations.length > 0) {
  banner('  [pc-entry] SCHEMA VIOLATIONS:');
  for (const v of schemaInput.violations.slice(0, 30)) banner(`    · ${v}`);
}
if (unitsInput.violations.length > 0) {
  banner('  [pc-entry] UNIT VIOLATIONS:');
  for (const v of unitsInput.violations.slice(0, 30)) banner(`    · ${v}`);
}
banner(`  [pc-entry] identity ${RECEIPTS.identity.walksReproducing}/${IDENT_SEEDS.length} reproduce · `
  + `${RECEIPTS.identity.walksFullyDormant}/${IDENT_SEEDS.length} dormant · fingerprint ${LEAGUE_FP === LEAGUE_FINGERPRINT_OF_RECORD ? 'UNMOVED' : LEAGUE_FP}`);
banner(`  [pc-entry] corridor: matured SIMPLE share ${MATURED_SIMPLE_SHARE} (corridor `
  + `${CORRIDOR[0]}–${CORRIDOR[1]}, PC-T2 pooled ${PC_T2_POOLED_SIMPLE_SHARE_MATURED}) · `
  + `empty ${EMPTY_SIMPLE_SHARE}`);
banner(`  [pc-entry] version: ${RECEIPTS.versionValue.armedWalksReportingEight}/${ARMED_ROWS.length} armed walks report 8 · `
  + `reads ${VERSION_READS.map((r) => `${r.arm}=${r.a4ArmedVersion}`).join(' ')}`);
banner(`  [pc-entry] chunk ${RECEIPTS.chunkCost.doseChunkFileName} ${PC_CHUNK_BYTES} B · precached-pc `
  + `${PRECACHED_PC} of ${PRECACHE_ENTRIES.length} entries · needles in main ${NEEDLES_IN_MAIN}`);
banner(`  [pc-entry] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
