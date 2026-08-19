/**
 * ⭐⭐ BK-C0 — THE BODY-BALL CENSUS (docs/world-model/BK-C0-BODYBALL-CENSUS.md).
 *
 * Authorized by ruling #305 item 3 for EXACTLY this stage — INSTRUMENT-ONLY (ZERO src edits).
 * The binding contract is BK-BODYBALL-CONTRACT.md §3 BK-C0, whose four instruments are:
 *   (a) the RELEASE-FACING census — misalign-at-release × action class × outcome;
 *   (b) the THROUGH-BODY FLIGHT census — per-tick sweep of flights crossing a lawful reach
 *       with no handler contact · dead-band occupancy · cooldown-invisibility;
 *   (c) the GK-LOOP LEDGER — distribution mix × landing first-touch side × bounce-back
 *       cycles × short-ball turnover-within-N (H-303a's census, absorbed here);
 *   (d) the TURN-COST ARITHMETIC — the TURN_RATE-derived cone/tick table (no sims).
 * Nothing here is SCORED: BK-C0 is a census. Every face is REPORTED.
 *
 * ⭐ THE BRIEF'S CANON, EACH QUOTED VERBATIM BESIDE ITS ACTUAL HOME (copied from CANON.md,
 *   never re-typed from memory — #301):
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
 *     never enters the body; forbidden-name lists are retired"
 *        HOME: PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1.
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; the artifact
 *     records the instrument hash.            HOME: ruling #266.3(c). (paraphrase)
 *   · per-seed cells — per-seed/per-cluster cells stored so every headline re-derives.
 *        HOME: ruling #282.2(ii). (paraphrase)
 *   · gFaces-from-disk — the re-derivation gate parses the SERIALIZED artifact off disk
 *        (HOME: ruling #287 item 1); VERBATIM extension: "the re-derivation gate covers EVERY
 *        published face; a percentile face requires stored bins"
 *        HOME: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4.
 *   · "a field carries the unit its name claims"        HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated face"
 *        HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · clock honesty — every rate on the 240 s match clock or dual-axis; APPLIED values, never
 *     nominal.               HOMES: ruling #280.2(iii) + PC-T2 §CORR item 3. (paraphrase)
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared field"
 *        HOME: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6.
 *   · xSrcUntouched — `git diff --stat HEAD -- src` AND `git status --porcelain -- src`.
 *        HOME: BU-C0-RECEPTION-OPTION-CENSUS.md §COMMANDER CORRECTIONS item 5 (#286 item 1).
 *   · seed discipline — BOOKED = WALKED reporting; blocks consumed whole of record.
 *        HOME: the standing frontier practice. (paraphrase)
 *
 * ⭐ THE WORLD: the world-8 composition — `a4MatchFlags(8)` + `armA4World(m, null, 8, L3_DOSE,
 *   PC_DOSE)` — the WATCHED world of record (the user's three observations live there;
 *   wind-ups armed). The PC-T2 arm-C construction idiom, one contract over; both dose
 *   artifacts are hashed AS FILE BYTES before they are parsed.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BKC0_MODE (smoke|full, REQUIRED) · BKC0_N · BKC0_OUT.
 *   ANY other `BKC0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BKC0_MODE=full npx tsx scripts/probes/bk-c0-bodyball-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = the world/dose
 *       construction class BIT (nothing is written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { Player, TURN_RATE } from '../../src/sim/Player';
import {
  AI_INTERVAL, CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS, DEFLECT_MAX_SPEED,
  DT, GK_CLAIM_HEIGHT, GK_CONTROL_MAX_SPEED, GRAVITY, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT,
  HEADER_RADIUS, KICK_COOLDOWN, MATCH_DURATION, PLAYER_CORE_RADIUS, TOUCH_CONTROL_DIST,
} from '../../src/sim/constants';
import { kickMisalignment, orientationNoiseMul, orientationPowerMul } from '../../src/sim/mechanics';
import { L3_DEFENCE_WINDOW_S } from '../../src/ai/defenceBook';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  L3_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['BKC0_MODE', 'BKC0_N', 'BKC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BKC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('BK-C0 FATAL — refused env surface. '
    + `rogue BKC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BKC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`BK-C0 FATAL — BKC0_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.BKC0_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.BKC0_N, 10)) : null;
const OUT_ENV = process.env.BKC0_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['BKC0_N'] : []),
  ...(OUT_ENV !== undefined ? ['BKC0_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/bk-c0-bodyball-census-smoke.json',
  full: 'docs/world-model/data/bk-c0-bodyball-census.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bk-c0-override.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner('BK-C0 FATAL — an OVERRIDE invocation may not write a canonical repo path '
    + `(the canonical-write guard). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 SMALL HELPERS                                                           */
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
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const addInto2 = (a: number[][], b: readonly (readonly number[])[]): void => {
  for (let i = 0; i < a.length; i++) addInto(a[i], b[i]);
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 TRACED CONSTANTS — imported, or EXTRACTED from src/** at run time (#200) */
/* ========================================================================== */
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
/** ⭐ THE C7 §LAW CONSTANTS — module-private in Match.ts, so they are EXTRACTED, never typed. */
const C7 = {
  base: extractNum(MATCH_SRC, /const C7_W_BASE = ([\d.]+);/),
  move: extractNum(MATCH_SRC, /const C7_W_MOVE = ([\d.]+);/),
  turn: extractNum(MATCH_SRC, /const C7_W_TURN = ([\d.]+);/),
  tech: extractNum(MATCH_SRC, /const C7_W_TECH = ([\d.]+);/),
  floor: extractNum(MATCH_SRC, /const C7_W_FLOOR = ([\d.]+);/),
  cap: extractNum(MATCH_SRC, /const C7_W_CAP = ([\d.]+);/),
  vRef: extractNum(MATCH_SRC, /const C7_V_REF = ([\d.]+);/),
  tBar: extractNum(MATCH_SRC, /const C7_T_BAR = ([\d.]+);/),
} as const;
const C7_LINE = lineOf(MATCH_SRC, /const c7WindupTicks = /);
/** The shipped `c7WindupTicks`, re-derived from the EXTRACTED constants (Match.ts §C7 §LAW). */
const c7WindupTicksDerived = (v: number, omega: number, tech: number): number => {
  const raw = C7.base + C7.move * (v / C7.vRef) + C7.turn * (omega / TURN_RATE)
    - C7.tech * (tech - C7.tBar);
  const clamped = raw < C7.floor ? C7.floor : raw > C7.cap ? C7.cap : raw;
  const ticks = Math.round(clamped * 60);
  return ticks < 3 ? 3 : ticks > 11 ? 11 : ticks;
};
/** ⭐ THE LOFTED-KICK FLIGHT CAP — `performLoftedPass`'s own `tMax` argument to `loftKick`. */
const LOFT_T_MAX = extractNum(
  MECH_SRC, /loftKick\(match, passer, lead, [\d.]+, [\d.]+, [\d.]+, ([\d.]+), /,
);
const LOFT_LINE = lineOf(MECH_SRC, /loftKick\(match, passer, lead, /);
/** the orientation-price sites, for the doc's own file:line prose. */
const ORIENT_POWER_LINE = lineOf(MECH_SRC, /export function orientationPowerMul/);
const ORIENT_NOISE_LINE = lineOf(MECH_SRC, /export function orientationNoiseMul/);
const MISALIGN_LINE = lineOf(MECH_SRC, /export function kickMisalignment/);

const CONSTANTS_OK = [C7.base, C7.move, C7.turn, C7.tech, C7.floor, C7.cap, C7.vRef, C7.tBar,
  LOFT_T_MAX].every((x) => Number.isFinite(x))
  && C7_LINE > 0 && LOFT_LINE > 0 && ORIENT_POWER_LINE > 0 && ORIENT_NOISE_LINE > 0
  && MISALIGN_LINE > 0;

/* ========================================================================== */
/* §3 THE DOSE SOURCES — FILE BYTES HASHED BEFORE THEY ARE PARSED             */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_FILE = JSON.parse(L3_BYTES) as Record<string, unknown>;
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(L3_FILE);
const PCT1_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PCT1_BYTES_SHA = sha(PCT1_BYTES);
const PCT1_FILE = JSON.parse(PCT1_BYTES) as Record<string, unknown>;
/** ⭐ THE MATURED PC DOSE, through the SHIPPED pooling function — not a probe-side copy. */
const PC_DOSE: readonly (readonly number[])[] = poolPcDoseTable(PCT1_FILE);
const PC_DOSE_EXPOSURES = sum(PC_DOSE.map((r) => sum(r)));
const L3_DOSE_LUNGES = sum(L3_DOSE.map((c) => c.lunges));

/* ========================================================================== */
/* §4 THE PRE-REGISTERED CENSUS DEFINITIONS (every one stated, none silent)   */
/* ========================================================================== */
/**
 * ⭐ THE MISALIGN MEASURE is the ENGINE's own: `kickMisalignment` = (1 − cos θ)/2, where θ is
 * the angle between the body's `heading` and the kick direction (mechanics.ts:MISALIGN_LINE).
 * 0 = dead ahead, 0.5 = square across the body, 1 = fully reversed.
 *
 * ⭐ THE FOUR FACING TIERS are QUADRANT GEOMETRY, not taste: the cuts sit at θ = 45°, 90°, 135°,
 * i.e. misalign = (1 − cos45°)/2, 0.5, (1 + cos45°)/2. No constant is invented.
 */
const TIER_EDGES = [(1 - Math.SQRT1_2) / 2, 0.5, (1 + Math.SQRT1_2) / 2] as const;
const TIERS = ['aligned', 'across', 'reversed', 'blind'] as const;
type Tier = (typeof TIERS)[number];
const tierOf = (misalign: number): number => (misalign < TIER_EDGES[0] ? 0
  : misalign < TIER_EDGES[1] ? 1 : misalign < TIER_EDGES[2] ? 2 : 3);
/** 20 equal bins over the [0,1] misalign measure — the stored bins every percentile reads. */
const MIS_BINS = 20;
const misBinOf = (m: number): number => Math.min(MIS_BINS - 1, Math.max(0, Math.floor(m * MIS_BINS)));

/**
 * The release classes = the engine's own kick family, read off ITS OWN per-side stat
 * bookkeeping (the signature each `perform*` writes), with the striker's ACTION label as the
 * tie-break for the labels the executor shares.
 *
 * ⚠ THE THREE HEADER CLASSES ARE NOT FACING-PRICED: `headBall` writes `ball.vel` directly and
 * never calls `orientationPowerMul`/`orientationNoiseMul`. They are censused BECAUSE of that —
 * how much of the world's ball-striking is outside the facing price at all is a BK-C0 question.
 */
const CLASSES = ['shot', 'headerShot', 'shortPass', 'loftedPass', 'throughBall', 'cross',
  'cutback', 'keeperThrow', 'clearance', 'headerClearance', 'headerKnockdown', 'other'] as const;
const HEADER_CLASSES = ['headerShot', 'headerClearance', 'headerKnockdown'] as const;
type Klass = (typeof CLASSES)[number];
const K = Object.fromEntries(CLASSES.map((c, i) => [c, i])) as Record<Klass, number>;

/** The outcome of a release = who touches the ball NEXT (the engine's own `lastTouch`). */
const OUTCOMES = ['ownNextTouch', 'oppNextTouch', 'outOfPlay', 'goal', 'noTouchByEnd'] as const;
type Outcome = (typeof OUTCOMES)[number];
const O = Object.fromEntries(OUTCOMES.map((c, i) => [c, i])) as Record<Outcome, number>;

/**
 * ⭐ THE THROUGH-BODY CAUSE LADDER — evaluated in THIS order, per body-tick, so every
 * uncontacted crossing lands in exactly one cell. Each cause names the engine gate that
 * produced it.
 */
const CAUSES = [
  'aboveGkClaim',       // z > GK_CLAIM_HEIGHT — tryAerial returns; nothing can touch it
  'deadBand',           // CONTROL_MAX_HEIGHT < z < HEADER_MIN_HEIGHT — feet can't, heads won't
  'aerialBand',         // HEADER_MIN_HEIGHT ≤ z ≤ GK_CLAIM_HEIGHT — argmax duel, not reach
  'cooldownInvisible',  // z ≤ CONTROL_MAX_HEIGHT and kickCooldown > 0 (Match.ts:4562)
  'stunned',            // stunTimer > 0 — the same claim filter
  'speedAboveControl',  // horizontal speed above this body's control cap
  'rollOrClaimOrder',   // the residual: blind/speed roll refused, screening, or another claim won
] as const;
type Cause = (typeof CAUSES)[number];
const C = Object.fromEntries(CAUSES.map((c, i) => [c, i])) as Record<Cause, number>;

/** The GK distribution channels — the PlayerBrain block's own four names (+ a residual). */
const GK_CHANNELS = ['punt', 'throwOut', 'gkShortPass', 'gkClearance', 'gkOther'] as const;
type GkChannel = (typeof GK_CHANNELS)[number];
const G = Object.fromEntries(GK_CHANNELS.map((c, i) => [c, i])) as Record<GkChannel, number>;
/** Landing first-touch cells: who met it, and in which z band. */
const LAND = ['ownGround', 'ownAerial', 'oppGround', 'oppAerial', 'outOfPlay', 'none'] as const;
const LA = Object.fromEntries(LAND.map((c, i) => [c, i])) as Record<string, number>;

/**
 * ⭐ THE BOUNCE-BACK WINDOW, DERIVED: `2 × LOFT_T_MAX` — the engine's own lofted-flight cap
 * (`performLoftedPass`'s `tMax`, mechanics.ts:LOFT_LINE) OUT and BACK. A keeper who owns the
 * ball again inside that window has had it returned to him inside one lofted round trip.
 * The FULL gap histogram is stored, so any other window re-derives off disk.
 */
const BOUNCE_WINDOW_TICKS = Math.round((2 * LOFT_T_MAX) / DT);
/**
 * ⭐ THE TURNOVER WINDOW, DERIVED: `L3_DEFENCE_WINDOW_S / DT` — the engine's own arrival law
 * (defenceBook.ts: `sqrt(2·CB_TACKLE_RADIUS/ACCEL) + π/TURN_RATE`), i.e. the widest window the
 * engine itself says a defender needs to arrive and challenge. Full histogram stored.
 */
const TURNOVER_WINDOW_TICKS = Math.round(L3_DEFENCE_WINDOW_S / DT);
/** Gap histograms: 40 bins of 10 ticks (0..399 ticks = 0..6.65 sim-s), plus an overflow bin. */
const GAP_BINS = 41;
const GAP_BIN_TICKS = 10;
const gapBinOf = (t: number): number => Math.min(GAP_BINS - 1, Math.floor(t / GAP_BIN_TICKS));
/** Crossing-episode duration histogram: 1..19 ticks then an overflow bin. */
const EP_BINS = 20;
const epBinOf = (t: number): number => Math.min(EP_BINS - 1, Math.max(0, t));
/** Observed wind-up lengths: the [3,11] clamp band, indexed 0..8 = 3..11 ticks. */
const W_BINS = 9;
/** The engine's own "trivially trapped" cut (`attemptFirstTouch`: `speed <= 6`). */
const TRIVIAL_TRAP_SPEED = 6;

/* ========================================================================== */
/* §5 THE WORLD — world 8, CONSTRUCTED DIRECTLY WITH ITS FLAGS (#283.2(iv))   */
/* ========================================================================== */
const PC_WORLD = 8 as const;
const ROLE_LIST: Role[] = ['GK', 'DF', 'MF', 'WG', 'ST'];
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchCfg = (seed: number): ConstructorParameters<typeof Match>[0] => ({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  ...a4MatchFlags(PC_WORLD),
});
const buildWorld8 = (seed: number): Match => {
  const m = new Match(matchCfg(seed));
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
/** The world-8 identity conjuncts, ASSERTED on the very match the walk measures. */
const worldConjuncts = (m: Match): Record<string, boolean> => {
  const mm = m as unknown as {
    pcLatency: { books: { count(ri: number, key: string): number }[] } | null;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    c7Windup: boolean; o1PassWindup: boolean; pcReactionLatency: boolean;
  };
  const booksDosed = mm.pcLatency !== null && mm.pcLatency.books.every((b) => {
    for (let ri = 0; ri < ROSTER_SIZE; ri++) {
      for (let c = 0; c < PC_BOOK_CELLS.length; c++) {
        if (b.count(ri, PC_BOOK_CELLS[c]) !== PC_DOSE[ri][c]) return false;
      }
    }
    return true;
  });
  const l3Dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => L3_DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  return {
    armedVersionIsEight: a4ArmedVersion(m) === PC_WORLD,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
  };
};

/* ========================================================================== */
/* §6 THE PER-SEED ROW                                                        */
/* ========================================================================== */
interface Row {
  seed: number;
  worldOk: boolean;
  /* clock */
  ticks: number; playingTicks: number; simSeconds: number; goals: number;
  /* (a) release-facing */
  releases: number;
  restartReleases: number;
  relByClassRestart: number[];
  relByClassTierRestart: number[][];
  relMisBinsRestart: number[][];
  relMisSumRestart: number[];
  gkByChannelRestart: number[];
  multiSignatureTicks: number;
  unattributedReleases: number;
  relByClass: number[];
  relByClassTier: number[][];            // class × tier
  relMisBins: number[][];                // class × 20 bins  (the stored bins)
  relMisSum: number[];                   // class → Σ misalign  (mean re-derives)
  relOutcome: number[][];                // class × outcome
  relTierOutcome: number[][];            // tier  × outcome
  intentMisBins: number[];               // 20 bins — heading vs the TARGET direction (passes)
  intentMisSum: number; intentN: number;
  spinRotSum: number; spinRotMax: number; // |spin|·DT (rad) — the observation's own error bound
  windupBins: number[];                  // observed wind-up lengths, 3..11 ticks
  /* (b) through-body */
  freeBallTicks: number; freeBallPlayingTicks: number;
  reachBodyTicks: number; reachBodyTicksFast: number;
  coreBodyTicks: number; coreBodyTicksFast: number;
  reachCauseTicks: number[];             // cause cells, reach radius
  coreCauseTicks: number[];              // cause cells, core radius
  reachEpisodes: number; coreEpisodes: number;
  reachEpisodeBins: number[]; coreEpisodeBins: number[];
  contactTicks: number;                  // ticks a handler contact resolved
  deadBandBallTicks: number;             // ball-ticks in (1.30, 1.35), free ball
  deadBandBallTicksWithBody: number;     // …with ≥1 body inside CONTROL_RADIUS
  aboveClaimBallTicks: number;
  cooldownInvisibleBodyTicks: number; cooldownInvisibleEpisodes: number;
  /* (c) the GK loop */
  gkReleases: number;
  gkByChannel: number[];
  gkLandByChannel: number[][];           // channel × landing cell
  gkBounceBackBins: number[];            // gap-ticks histogram, releaser regains ownership
  gkBounceBacks: number;                 // total bounce-backs seen at ANY gap
  gkBounceBackWithin: number;            // …within BOUNCE_WINDOW_TICKS
  gkShortCompleted: number;              // short-channel releases that reached a teammate
  gkShortTurnoverBins: number[];         // gap-ticks to the opponent gaining ownership
  gkShortTurnovers: number;
  gkShortTurnoverWithin: number;
  gkPuntFirstTouchOpp: number; gkPuntFirstTouchOwn: number;
}
const emptyRow = (seed: number): Row => ({
  seed,
  worldOk: false,
  ticks: 0, playingTicks: 0, simSeconds: 0, goals: 0,
  releases: 0,
  restartReleases: 0,
  relByClassRestart: zeros(CLASSES.length),
  relByClassTierRestart: zeros2(CLASSES.length, TIERS.length),
  relMisBinsRestart: zeros2(CLASSES.length, MIS_BINS),
  relMisSumRestart: zeros(CLASSES.length),
  gkByChannelRestart: zeros(GK_CHANNELS.length),
  multiSignatureTicks: 0,
  unattributedReleases: 0,
  relByClass: zeros(CLASSES.length),
  relByClassTier: zeros2(CLASSES.length, TIERS.length),
  relMisBins: zeros2(CLASSES.length, MIS_BINS),
  relMisSum: zeros(CLASSES.length),
  relOutcome: zeros2(CLASSES.length, OUTCOMES.length),
  relTierOutcome: zeros2(TIERS.length, OUTCOMES.length),
  intentMisBins: zeros(MIS_BINS), intentMisSum: 0, intentN: 0,
  spinRotSum: 0, spinRotMax: 0,
  windupBins: zeros(W_BINS),
  freeBallTicks: 0, freeBallPlayingTicks: 0,
  reachBodyTicks: 0, reachBodyTicksFast: 0,
  coreBodyTicks: 0, coreBodyTicksFast: 0,
  reachCauseTicks: zeros(CAUSES.length),
  coreCauseTicks: zeros(CAUSES.length),
  reachEpisodes: 0, coreEpisodes: 0,
  reachEpisodeBins: zeros(EP_BINS), coreEpisodeBins: zeros(EP_BINS),
  contactTicks: 0,
  deadBandBallTicks: 0, deadBandBallTicksWithBody: 0, aboveClaimBallTicks: 0,
  cooldownInvisibleBodyTicks: 0, cooldownInvisibleEpisodes: 0,
  gkReleases: 0,
  gkByChannel: zeros(GK_CHANNELS.length),
  gkLandByChannel: zeros2(GK_CHANNELS.length, LAND.length),
  gkBounceBackBins: zeros(GAP_BINS), gkBounceBacks: 0, gkBounceBackWithin: 0,
  gkShortCompleted: 0,
  gkShortTurnoverBins: zeros(GAP_BINS), gkShortTurnovers: 0, gkShortTurnoverWithin: 0,
  gkPuntFirstTouchOpp: 0, gkPuntFirstTouchOwn: 0,
});

/* ========================================================================== */
/* §7 THE WALK — ONE MATCH, PURE READS OF PUBLIC ENGINE STATE                 */
/* ========================================================================== */
interface OpenRelease {
  tick: number; klass: Klass; tier: number; gid: number; side: Side;
  isGk: boolean; channel: GkChannel | null; targetGid: number | null;
}
interface OpenGkRelease {
  tick: number; gid: number; side: Side; channel: GkChannel;
  landed: boolean; landingCell: number;
  firstTeammateTouchTick: number | null; firstTeammateGid: number | null;
  resolvedBounce: boolean; resolvedTurnover: boolean;
}

const STAT_KEYS = ['passes', 'longBalls', 'crosses', 'throughBalls', 'cutbacks', 'clearances',
  'shots', 'headersWon'] as const;
type StatKey = (typeof STAT_KEYS)[number];

const walk = (seed: number): Row => {
  const m = buildWorld8(seed);
  const row = emptyRow(seed);
  row.worldOk = Object.values(worldConjuncts(m)).every(Boolean);

  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingShot: { resolved: boolean } | null;
    pendingPassWindup: { gid: number; readyTick: number } | null;
    pendingKick: { gid: number; readyTick: number } | null;
  };
  const players = m.allPlayers;
  const N = players.length;

  /* ---- the pre-step snapshot: exactly the state a kick fired this step reads ---- */
  const preHx = new Float64Array(N);
  const preHy = new Float64Array(N);
  const preGkDist = new Array<boolean>(N).fill(false);
  const snapBodies = (): void => {
    for (let i = 0; i < N; i++) {
      const p = players[i];
      preHx[i] = p.heading.x; preHy[i] = p.heading.y;
      preGkDist[i] = p.gkDistributing;
    }
  };
  snapBodies();
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevPendingShot = mm.pendingShot !== null;
  let prevScore: [number, number] = [0, 0];
  let prevWindupKey = '';
  let prevKickKey = '';
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];

  /* ---- carried state ---- */
  const openReleases: OpenRelease[] = [];
  const openGk: OpenGkRelease[] = [];
  const openReach = new Map<number, number>();   // gid → episode start tick
  const openCore = new Map<number, number>();
  const openCool = new Map<number, number>();

  const closeEpisode = (map: Map<number, number>, gid: number, tick: number,
    bins: number[], counter: 'reach' | 'core' | 'cool'): void => {
    const start = map.get(gid);
    if (start === undefined) return;
    map.delete(gid);
    const len = tick - start;
    if (counter === 'reach') { row.reachEpisodes++; bins[epBinOf(len)]++; }
    else if (counter === 'core') { row.coreEpisodes++; bins[epBinOf(len)]++; }
    else row.cooldownInvisibleEpisodes++;
  };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    if (playing) row.playingTicks++;
    const ball = m.ball;
    const ownerGid = ball.owner?.gid ?? null;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const contactGid = lastTouchGid !== prevLastTouchGid ? lastTouchGid
      : (ownerGid !== null && ownerGid !== prevOwnerGid ? ownerGid : null);
    if (contactGid !== null) row.contactTicks++;
    const scored = m.score[0] + m.score[1] > prevScore[0] + prevScore[1];

    /* ---------------- stat deltas, per side ---------------- */
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ================= (a) RELEASE DETECTION ================= */
    /* A release is a kick that left a body this step. The striker is read from the engine's
     * own pending records where they exist, else from the ball's `lastTouch`. The kick's
     * FACING is the body's PRE-STEP heading — kicks fire in `executeAction` and at the two
     * head-of-tick wind-up resolves, both BEFORE `physicsStep` writes the new heading. */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    const releasesThisTick: { gid: number; klass: Klass; targetGid: number | null }[] = [];
    const liveKick = playing || m.phase === 'restart';
    if (liveKick) {
      for (const side of [0, 1] as const) {
        // the SIGNATURE: exactly what this side's `perform*` wrote into the engine's own stats
        let klass: Klass | null = null;
        let signatures = 0;
        if (d.shots[side] > 0) { klass = d.headersWon[side] > 0 ? 'headerShot' : 'shot'; signatures++; }
        if (d.clearances[side] > 0) {
          if (klass === null) klass = d.headersWon[side] > 0 ? 'headerClearance' : 'clearance';
          signatures++;
        }
        if (d.passes[side] > 0) {
          if (klass === null) {
            klass = d.crosses[side] > 0 ? 'cross'
              : d.cutbacks[side] > 0 ? 'cutback'
                : d.throughBalls[side] > 0 ? 'throughBall'
                  : d.longBalls[side] > 0 ? 'loftedPass' : 'shortPass';
          }
          signatures++;
        }
        if (d.headersWon[side] > 0 && klass === null) { klass = 'headerKnockdown'; signatures++; }
        if (klass === null && passChangedSide === side) klass = 'other';
        if (klass === null) continue;
        if (signatures > 1) row.multiSignatureTicks++;
        // the STRIKER: the engine's own passer where it recorded one, else `lastTouch`
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) { row.unattributedReleases++; continue; }
        // the keeper's HAND throw is the one label the stat signature cannot separate from an
        // ordinary short pass — the executor's own action label does it.
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releasesThisTick.push({
          gid,
          klass,
          targetGid: passChangedSide === side ? (mm.pendingPass?.targetGid ?? null) : null,
        });
      }
    }
    const shotNow = mm.pendingShot !== null;

    const hSpeed = Math.hypot(ball.vel.x, ball.vel.y);
    const spinRot = Math.abs(ball.spin) * DT;
    for (const rel of releasesThisTick) {
      const gid = rel.gid;
      if (hSpeed < 1e-6) { row.unattributedReleases++; continue; }
      const p = players[gid];
      const side = p.side as Side;
      const klass: Klass = rel.klass;

      // the OBSERVED release direction: the ball's own horizontal velocity at the tick
      // boundary, de-rotated by the one tick of Magnus rotation `stepBall` applied.
      const cs = Math.cos(-spinRot * Math.sign(ball.spin || 0));
      const sn = Math.sin(-spinRot * Math.sign(ball.spin || 0));
      const dx0 = ball.vel.x / hSpeed;
      const dy0 = ball.vel.y / hSpeed;
      const dx = dx0 * cs - dy0 * sn;
      const dy = dx0 * sn + dy0 * cs;
      const misalign = Math.min(1, Math.max(0, (1 - (preHx[gid] * dx + preHy[gid] * dy)) / 2));
      const tier = tierOf(misalign);
      const ki = K[klass];
      const fromRestart = !playing;
      if (fromRestart) {
        row.restartReleases++;
        row.relByClassRestart[ki]++;
        row.relByClassTierRestart[ki][tier]++;
        row.relMisBinsRestart[ki][misBinOf(misalign)]++;
        row.relMisSumRestart[ki] += misalign;
      } else {
        row.releases++;
        row.relByClass[ki]++;
        row.relByClassTier[ki][tier]++;
        row.relMisBins[ki][misBinOf(misalign)]++;
        row.relMisSum[ki] += misalign;
      }
      if (!fromRestart) row.spinRotSum += spinRot;
      if (spinRot > row.spinRotMax) row.spinRotMax = spinRot;
      // the INTENT face: the body's facing against the direction of the intended TARGET
      if (!fromRestart && rel.targetGid !== null && rel.targetGid >= 0 && rel.targetGid < N) {
        const t = players[rel.targetGid];
        const tx = t.pos.x - p.pos.x;
        const ty = t.pos.y - p.pos.y;
        const tl = Math.hypot(tx, ty);
        if (tl > 1e-6) {
          const im = Math.min(1, Math.max(0,
            (1 - (preHx[gid] * (tx / tl) + preHy[gid] * (ty / tl))) / 2));
          row.intentMisBins[misBinOf(im)]++;
          row.intentMisSum += im;
          row.intentN++;
        }
      }
      const isGk = p.role === 'GK';
      let channel: GkChannel | null = null;
      if (isGk) {
        channel = klass === 'loftedPass' && preGkDist[gid] ? 'punt'
          : klass === 'keeperThrow' ? 'throwOut'
            : klass === 'clearance' ? 'gkClearance'
              : (klass === 'shortPass' || klass === 'throughBall') ? 'gkShortPass' : 'gkOther';
        row.gkReleases++;
        row.gkByChannel[G[channel]]++;
        if (fromRestart) row.gkByChannelRestart[G[channel]]++;
        openGk.push({
          tick, gid, side, channel, landed: false, landingCell: LA.none,
          firstTeammateTouchTick: null, firstTeammateGid: null,
          resolvedBounce: false, resolvedTurnover: false,
        });
      }
      // ⚠ the OUTCOME census is OPEN-PLAY ONLY: a dead-ball release resolves through the
      // restart machinery, not through the next open-play touch.
      if (!fromRestart) {
        openReleases.push({ tick, klass, tier, gid, side, isGk, channel, targetGid: rel.targetGid });
      }
    }

    /* ---- resolve OPEN releases: the next body to touch the ball decides the outcome ---- */
    const ballIsLive = m.phase === 'playing' || m.phase === 'restart';
    if (openReleases.length > 0) {
      const outOfPlay = !ballIsLive;
      for (let i = openReleases.length - 1; i >= 0; i--) {
        const r = openReleases[i];
        if (r.tick === tick) continue; // the release tick itself is not its own next touch
        let out: number | null = null;
        if (scored) out = O.goal;
        else if (contactGid !== null) {
          out = players[contactGid].side === r.side ? O.ownNextTouch : O.oppNextTouch;
        } else if (outOfPlay) out = O.outOfPlay;
        if (out !== null) {
          row.relOutcome[K[r.klass]][out]++;
          row.relTierOutcome[r.tier][out]++;
          openReleases.splice(i, 1);
        }
      }
    }

    /* ================= (c) THE GK LOOP ================= */
    if (openGk.length > 0) {
      for (let i = openGk.length - 1; i >= 0; i--) {
        const g = openGk[i];
        if (g.tick === tick) continue;
        const age = tick - g.tick;
        // the LANDING first touch: the first body other than the keeper himself
        if (!g.landed) {
          if (contactGid !== null && contactGid !== g.gid) {
            const aerial = ball.z >= HEADER_MIN_HEIGHT;
            const own = players[contactGid].side === g.side;
            g.landingCell = own ? (aerial ? LA.ownAerial : LA.ownGround)
              : (aerial ? LA.oppAerial : LA.oppGround);
            g.landed = true;
            row.gkLandByChannel[G[g.channel]][g.landingCell]++;
            if (g.channel === 'punt') {
              if (own) row.gkPuntFirstTouchOwn++; else row.gkPuntFirstTouchOpp++;
            }
            if (own) {
              g.firstTeammateTouchTick = tick;
              g.firstTeammateGid = contactGid;
              if (g.channel === 'throwOut' || g.channel === 'gkShortPass') row.gkShortCompleted++;
            }
          } else if (!ballIsLive) {
            g.landed = true;
            g.landingCell = LA.outOfPlay;
            row.gkLandByChannel[G[g.channel]][LA.outOfPlay]++;
          }
        }
        // the BOUNCE-BACK: the releasing keeper OWNS the ball again
        if (!g.resolvedBounce && ownerGid === g.gid && ownerGid !== prevOwnerGid) {
          g.resolvedBounce = true;
          row.gkBounceBacks++;
          row.gkBounceBackBins[gapBinOf(age)]++;
          if (age <= BOUNCE_WINDOW_TICKS) row.gkBounceBackWithin++;
        }
        // the SHORT-BALL TURNOVER: an opponent OWNS the ball after the teammate got it
        if (!g.resolvedTurnover && g.firstTeammateTouchTick !== null
          && (g.channel === 'throwOut' || g.channel === 'gkShortPass')
          && ownerGid !== null && ownerGid !== prevOwnerGid
          && players[ownerGid].side !== g.side) {
          g.resolvedTurnover = true;
          const gap = tick - g.firstTeammateTouchTick;
          row.gkShortTurnovers++;
          row.gkShortTurnoverBins[gapBinOf(gap)]++;
          if (gap <= TURNOVER_WINDOW_TICKS) row.gkShortTurnoverWithin++;
        }
        // retire the record once every question it can answer is answered or the window shut
        const done = (g.landed || !ballIsLive)
          && age > Math.max(BOUNCE_WINDOW_TICKS, TURNOVER_WINDOW_TICKS);
        if (done) openGk.splice(i, 1);
      }
    }

    /* ================= (b) THE THROUGH-BODY SWEEP ================= */
    if (ball.owner === null) {
      row.freeBallTicks++;
      if (playing) row.freeBallPlayingTicks++;
    }
    const inDeadBand = ball.z > CONTROL_MAX_HEIGHT && ball.z < HEADER_MIN_HEIGHT;
    let anyBodyInReach = false;
    if (playing && ball.owner === null) {
      const fast = hSpeed >= TRIVIAL_TRAP_SPEED;
      for (let i = 0; i < N; i++) {
        const p = players[i];
        if (p.sentOff) continue;
        const dxp = p.pos.x - ball.pos.x;
        const dyp = p.pos.y - ball.pos.y;
        const dd = Math.hypot(dxp, dyp);
        if (dd < CONTROL_RADIUS) anyBodyInReach = true;
        // ⚠ the LAST TOUCHER is excluded from the census by construction: the ball sitting
        // inside the boot that just struck it is a self-contact artefact, not 球穿身.
        const excluded = p.gid === lastTouchGid || p.gid === contactGid;
        const crossing = dd < CONTROL_RADIUS && !excluded;
        const core = dd < PLAYER_CORE_RADIUS && !excluded;
        if (crossing) {
          const cap = p.role === 'GK' ? GK_CONTROL_MAX_SPEED : CONTROL_MAX_SPEED;
          const cause: number = ball.z > GK_CLAIM_HEIGHT ? C.aboveGkClaim
            : inDeadBand ? C.deadBand
              : ball.z >= HEADER_MIN_HEIGHT ? C.aerialBand
                : p.kickCooldown > 0 ? C.cooldownInvisible
                  : p.stunTimer > 0 ? C.stunned
                    : hSpeed > cap && hSpeed > DEFLECT_MAX_SPEED ? C.speedAboveControl
                      : C.rollOrClaimOrder;
          row.reachBodyTicks++;
          row.reachCauseTicks[cause]++;
          if (fast) row.reachBodyTicksFast++;
          if (!openReach.has(p.gid)) openReach.set(p.gid, tick);
          if (core) {
            row.coreBodyTicks++;
            row.coreCauseTicks[cause]++;
            if (fast) row.coreBodyTicksFast++;
            if (!openCore.has(p.gid)) openCore.set(p.gid, tick);
          } else closeEpisode(openCore, p.gid, tick, row.coreEpisodeBins, 'core');
          if (ball.z <= CONTROL_MAX_HEIGHT && p.kickCooldown > 0) {
            row.cooldownInvisibleBodyTicks++;
            if (!openCool.has(p.gid)) openCool.set(p.gid, tick);
          } else closeEpisode(openCool, p.gid, tick, row.reachEpisodeBins, 'cool');
        } else {
          closeEpisode(openReach, p.gid, tick, row.reachEpisodeBins, 'reach');
          closeEpisode(openCore, p.gid, tick, row.coreEpisodeBins, 'core');
          closeEpisode(openCool, p.gid, tick, row.reachEpisodeBins, 'cool');
        }
      }
      if (inDeadBand) {
        row.deadBandBallTicks++;
        if (anyBodyInReach) row.deadBandBallTicksWithBody++;
      }
      if (ball.z > GK_CLAIM_HEIGHT) row.aboveClaimBallTicks++;
    } else {
      for (const gid of [...openReach.keys()]) {
        closeEpisode(openReach, gid, tick, row.reachEpisodeBins, 'reach');
      }
      for (const gid of [...openCore.keys()]) {
        closeEpisode(openCore, gid, tick, row.coreEpisodeBins, 'core');
      }
      for (const gid of [...openCool.keys()]) {
        closeEpisode(openCool, gid, tick, row.reachEpisodeBins, 'cool');
      }
    }

    /* ================= (d)'s EMPIRICAL CROSS-CHECK: observed wind-up lengths ========= */
    const wu = mm.pendingPassWindup;
    const wuKey = wu === null ? '' : `${wu.gid}:${wu.readyTick}`;
    if (wuKey !== '' && wuKey !== prevWindupKey) {
      const w = wu!.readyTick - tick;
      if (w >= 3 && w <= 11) row.windupBins[w - 3]++;
    }
    prevWindupKey = wuKey;
    const pk = mm.pendingKick;
    const pkKey = pk === null ? '' : `${pk.gid}:${pk.readyTick}`;
    if (pkKey !== '' && pkKey !== prevKickKey) {
      const w = pk!.readyTick - tick;
      if (w >= 3 && w <= 11) row.windupBins[w - 3]++;
    }
    prevKickKey = pkKey;

    /* ---- roll the snapshot ---- */
    snapBodies();
    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
    prevPendingShot = shotNow;
    prevScore = [m.score[0], m.score[1]];
  }

  // anything still open at the whistle is booked honestly
  for (const r of openReleases) { row.relOutcome[K[r.klass]][O.noTouchByEnd]++; row.relTierOutcome[r.tier][O.noTouchByEnd]++; }
  for (const g of openGk) if (!g.landed) row.gkLandByChannel[G[g.channel]][LA.none]++;
  row.simSeconds = row.ticks * DT;
  row.goals = m.score[0] + m.score[1];
  return row;
};

/* ========================================================================== */
/* §8 THE WORLD-CONSTRUCTION RECEIPT (its own booked seed, xxx,999)           */
/* ========================================================================== */
const SEED_BLOCK_BASE = 12_501_000;
const RECEIPT_SEED = SEED_BLOCK_BASE + 999;
const receiptMatch = buildWorld8(RECEIPT_SEED);
const RECEIPT = worldConjuncts(receiptMatch);
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
/** the misalign-formula identity: the probe's arithmetic IS `kickMisalignment`. */
const formulaProbe = receiptMatch.allPlayers[0] as Player;
const FORMULA_OK = (() => {
  const dirs = [[1, 0], [0, 1], [-1, 0], [Math.SQRT1_2, Math.SQRT1_2], [-0.6, 0.8]] as const;
  return dirs.every(([dx, dy]) => {
    const mine = (1 - (formulaProbe.heading.x * dx + formulaProbe.heading.y * dy)) / 2;
    const theirs = kickMisalignment(formulaProbe, { x: dx, y: dy });
    return Math.abs(mine - theirs) < 1e-12;
  });
})();
if (!RECEIPT_OK || !FORMULA_OK || !CONSTANTS_OK) {
  banner(`BK-C0 FATAL — the world/dose construction class BIT. receipt=${JSON.stringify(RECEIPT)} `
    + `formula=${FORMULA_OK} constants=${CONSTANTS_OK}. Nothing is written.`);
  process.exit(3);
}

/* ========================================================================== */
/* §9 THE BATTERY                                                            */
/* ========================================================================== */
/**
 * ⭐ THE BATTERY SIZE, WITH ITS REASON. A world-8 match walks in ~0.22 s wall on this machine
 * (the pre-freeze smoke's own measurement), so 500 matches costs ~2 min — far inside the
 * ~45 min ceiling. 500 is chosen by the RAREST PUBLISHED CELL, not by the clock: the keeper's
 * per-channel landing faces run at ~10 GK releases/match, and the thinnest channel (the punt)
 * at ~0.5/match — 500 matches puts a few hundred rows under it, which is the grain a
 * DISTRIBUTION face needs. Everything else (≈14k releases/100 matches, ≈45k reach-crossing
 * body-ticks/100 matches) is saturated long before that.
 */
const N_BY_MODE: Record<Mode, number> = { smoke: 4, full: 500 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
const SEEDS = Array.from({ length: N_SEEDS }, (_, i) => SEED_BLOCK_BASE + i);
const rows: Row[] = [];
for (const s of SEEDS) {
  rows.push(walk(s));
  if (rows.length % 20 === 0) {
    banner(`  … ${rows.length}/${N_SEEDS} matches (${((Date.now() - t0Wall) / 1000).toFixed(0)} s)`);
  }
}

/* ========================================================================== */
/* §10 AGGREGATION — every face is a SUM OVER THE STORED PER-SEED CELLS       */
/* ========================================================================== */
const agg = emptyRow(-1);
for (const r of rows) {
  agg.ticks += r.ticks; agg.playingTicks += r.playingTicks; agg.simSeconds += r.simSeconds;
  agg.goals += r.goals; agg.releases += r.releases;
  agg.restartReleases += r.restartReleases;
  addInto(agg.relByClassRestart, r.relByClassRestart);
  addInto2(agg.relByClassTierRestart, r.relByClassTierRestart);
  addInto2(agg.relMisBinsRestart, r.relMisBinsRestart);
  addInto(agg.relMisSumRestart, r.relMisSumRestart);
  addInto(agg.gkByChannelRestart, r.gkByChannelRestart);
  agg.multiSignatureTicks += r.multiSignatureTicks;
  agg.unattributedReleases += r.unattributedReleases;
  addInto(agg.relByClass, r.relByClass);
  addInto2(agg.relByClassTier, r.relByClassTier);
  addInto2(agg.relMisBins, r.relMisBins);
  addInto(agg.relMisSum, r.relMisSum);
  addInto2(agg.relOutcome, r.relOutcome);
  addInto2(agg.relTierOutcome, r.relTierOutcome);
  addInto(agg.intentMisBins, r.intentMisBins);
  agg.intentMisSum += r.intentMisSum; agg.intentN += r.intentN;
  agg.spinRotSum += r.spinRotSum;
  if (r.spinRotMax > agg.spinRotMax) agg.spinRotMax = r.spinRotMax;
  addInto(agg.windupBins, r.windupBins);
  agg.freeBallTicks += r.freeBallTicks; agg.freeBallPlayingTicks += r.freeBallPlayingTicks;
  agg.reachBodyTicks += r.reachBodyTicks; agg.reachBodyTicksFast += r.reachBodyTicksFast;
  agg.coreBodyTicks += r.coreBodyTicks; agg.coreBodyTicksFast += r.coreBodyTicksFast;
  addInto(agg.reachCauseTicks, r.reachCauseTicks);
  addInto(agg.coreCauseTicks, r.coreCauseTicks);
  agg.reachEpisodes += r.reachEpisodes; agg.coreEpisodes += r.coreEpisodes;
  addInto(agg.reachEpisodeBins, r.reachEpisodeBins);
  addInto(agg.coreEpisodeBins, r.coreEpisodeBins);
  agg.contactTicks += r.contactTicks;
  agg.deadBandBallTicks += r.deadBandBallTicks;
  agg.deadBandBallTicksWithBody += r.deadBandBallTicksWithBody;
  agg.aboveClaimBallTicks += r.aboveClaimBallTicks;
  agg.cooldownInvisibleBodyTicks += r.cooldownInvisibleBodyTicks;
  agg.cooldownInvisibleEpisodes += r.cooldownInvisibleEpisodes;
  agg.gkReleases += r.gkReleases;
  addInto(agg.gkByChannel, r.gkByChannel);
  addInto2(agg.gkLandByChannel, r.gkLandByChannel);
  addInto(agg.gkBounceBackBins, r.gkBounceBackBins);
  agg.gkBounceBacks += r.gkBounceBacks; agg.gkBounceBackWithin += r.gkBounceBackWithin;
  agg.gkShortCompleted += r.gkShortCompleted;
  addInto(agg.gkShortTurnoverBins, r.gkShortTurnoverBins);
  agg.gkShortTurnovers += r.gkShortTurnovers;
  agg.gkShortTurnoverWithin += r.gkShortTurnoverWithin;
  agg.gkPuntFirstTouchOpp += r.gkPuntFirstTouchOpp;
  agg.gkPuntFirstTouchOwn += r.gkPuntFirstTouchOwn;
}
const M = rows.length;
const worldOkAll = rows.every((r) => r.worldOk);

/** a percentile from STORED BINS (the bin's UPPER edge — the honest coarse read). */
const pctlFromBins = (bins: readonly number[], q: number, edge: (i: number) => number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  const want = q * total;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= want) return edge(i);
  }
  return edge(bins.length - 1);
};
const misEdge = (i: number): number => (i + 1) / MIS_BINS;
const gapEdge = (i: number): number => (i + 1) * GAP_BIN_TICKS;

/* ---- (a) THE RELEASE-FACING FACES ---- */
const allMisBins = zeros(MIS_BINS);
for (const ki of CLASSES.map((c) => K[c])) addInto(allMisBins, agg.relMisBins[ki]);
const allTier = zeros(TIERS.length);
for (const ki of CLASSES.map((c) => K[c])) addInto(allTier, agg.relByClassTier[ki]);
const allMisBinsRestart = zeros(MIS_BINS);
for (const ki of CLASSES.map((c) => K[c])) addInto(allMisBinsRestart, agg.relMisBinsRestart[ki]);
const allTierRestart = zeros(TIERS.length);
for (const ki of CLASSES.map((c) => K[c])) addInto(allTierRestart, agg.relByClassTierRestart[ki]);
const releaseFaces = {
  releasesTotal: agg.releases,
  releasesPerMatch: round(ratio(agg.releases, M), 4),
  meanMisalignAtRelease: round(ratio(sum(agg.relMisSum), agg.releases), 6),
  medianMisalignAtReleaseFromBins: round(pctlFromBins(allMisBins, 0.5, misEdge), 6),
  p90MisalignAtReleaseFromBins: round(pctlFromBins(allMisBins, 0.9, misEdge), 6),
  shareAligned: round(ratio(allTier[0], agg.releases), 6),
  shareAcross: round(ratio(allTier[1], agg.releases), 6),
  shareReversed: round(ratio(allTier[2], agg.releases), 6),
  shareBlind: round(ratio(allTier[3], agg.releases), 6),
  shareBeyondSquare: round(ratio(allTier[2] + allTier[3], agg.releases), 6),
  meanIntentMisalign: round(ratio(agg.intentMisSum, agg.intentN), 6),
  intentRows: agg.intentN,
  meanSpinRotationPerTickRad: round(ratio(agg.spinRotSum, agg.releases), 6),
  maxSpinRotationPerTickRad: round(agg.spinRotMax, 6),
  headerClassReleases: sum(HEADER_CLASSES.map((c) => agg.relByClass[K[c]])),
  headerClassShareOfReleases: round(
    ratio(sum(HEADER_CLASSES.map((c) => agg.relByClass[K[c]])), agg.releases), 6,
  ),
  facingPricedReleases: agg.releases - sum(HEADER_CLASSES.map((c) => agg.relByClass[K[c]])),
  multiSignatureTicks: agg.multiSignatureTicks,
  unattributedReleases: agg.unattributedReleases,
} as const;
/** The RESTART half — dead-ball kicks, where the taker has all the time in the world to turn. */
const restartFaces = {
  restartReleasesTotal: agg.restartReleases,
  restartReleasesPerMatch: round(ratio(agg.restartReleases, M), 4),
  meanMisalignAtRestartRelease: round(ratio(sum(agg.relMisSumRestart), agg.restartReleases), 6),
  medianMisalignAtRestartReleaseFromBins:
    round(pctlFromBins(allMisBinsRestart, 0.5, misEdge), 6),
  shareBeyondSquareAtRestart: round(
    ratio(allTierRestart[2] + allTierRestart[3], agg.restartReleases), 6,
  ),
  gkRestartReleases: sum(agg.gkByChannelRestart),
  gkRestartClearanceShare: round(
    ratio(agg.gkByChannelRestart[G.gkClearance], sum(agg.gkByChannelRestart)), 6,
  ),
} as const;
const perClassFaces = CLASSES.map((c) => {
  const i = K[c];
  const n = agg.relByClass[i];
  const outs = agg.relOutcome[i];
  const outN = sum(outs);
  return {
    klass: c,
    releases: n,
    meanMisalign: round(ratio(agg.relMisSum[i], n), 6),
    medianMisalignFromBins: round(pctlFromBins(agg.relMisBins[i], 0.5, misEdge), 6),
    shareBeyondSquare: round(ratio(agg.relByClassTier[i][2] + agg.relByClassTier[i][3], n), 6),
    ownNextTouchShare: round(ratio(outs[O.ownNextTouch], outN), 6),
    oppNextTouchShare: round(ratio(outs[O.oppNextTouch], outN), 6),
    outcomeRows: outN,
  };
});
const perTierOutcomeFaces = TIERS.map((t, i) => {
  const outs = agg.relTierOutcome[i];
  const outN = sum(outs);
  return {
    tier: t,
    outcomeRows: outN,
    ownNextTouchShare: round(ratio(outs[O.ownNextTouch], outN), 6),
    oppNextTouchShare: round(ratio(outs[O.oppNextTouch], outN), 6),
    outOfPlayShare: round(ratio(outs[O.outOfPlay], outN), 6),
  };
});

/* ---- (b) THE THROUGH-BODY FACES ---- */
const throughFaces = {
  freeBallPlayingTicks: agg.freeBallPlayingTicks,
  reachCrossingBodyTicks: agg.reachBodyTicks,
  reachCrossingBodyTicksPerMatch: round(ratio(agg.reachBodyTicks, M), 4),
  reachCrossingBodyTicksFast: agg.reachBodyTicksFast,
  visualThroughBodyTicks: agg.coreBodyTicks,
  visualThroughBodyTicksPerMatch: round(ratio(agg.coreBodyTicks, M), 4),
  visualThroughBodyTicksFast: agg.coreBodyTicksFast,
  reachCrossingEpisodes: agg.reachEpisodes,
  reachCrossingEpisodesPerMatch: round(ratio(agg.reachEpisodes, M), 4),
  visualThroughBodyEpisodes: agg.coreEpisodes,
  visualThroughBodyEpisodesPerMatch: round(ratio(agg.coreEpisodes, M), 4),
  medianReachEpisodeTicksFromBins: round(pctlFromBins(agg.reachEpisodeBins, 0.5, (i) => i + 1), 4),
  deadBandBallTicks: agg.deadBandBallTicks,
  deadBandBallTicksPerMatch: round(ratio(agg.deadBandBallTicks, M), 4),
  deadBandSecondsPerMatchSim: round(ratio(agg.deadBandBallTicks, M) * DT, 6),
  deadBandTicksWithBodyInReach: agg.deadBandBallTicksWithBody,
  aboveGkClaimBallTicksPerMatch: round(ratio(agg.aboveClaimBallTicks, M), 4),
  cooldownInvisibleBodyTicks: agg.cooldownInvisibleBodyTicks,
  cooldownInvisibleBodyTicksPerMatch: round(ratio(agg.cooldownInvisibleBodyTicks, M), 4),
  cooldownInvisibleEpisodesPerMatch: round(ratio(agg.cooldownInvisibleEpisodes, M), 4),
  handlerContactTicksPerMatch: round(ratio(agg.contactTicks, M), 4),
} as const;
const causeFaces = CAUSES.map((c, i) => ({
  cause: c,
  reachBodyTicks: agg.reachCauseTicks[i],
  reachShare: round(ratio(agg.reachCauseTicks[i], agg.reachBodyTicks), 6),
  coreBodyTicks: agg.coreCauseTicks[i],
  coreShare: round(ratio(agg.coreCauseTicks[i], agg.coreBodyTicks), 6),
}));

/* ---- (c) THE GK-LOOP FACES ---- */
const gkFaces = {
  gkReleases: agg.gkReleases,
  gkReleasesPerMatch: round(ratio(agg.gkReleases, M), 4),
  puntShare: round(ratio(agg.gkByChannel[G.punt], agg.gkReleases), 6),
  throwOutShare: round(ratio(agg.gkByChannel[G.throwOut], agg.gkReleases), 6),
  gkShortPassShare: round(ratio(agg.gkByChannel[G.gkShortPass], agg.gkReleases), 6),
  gkClearanceShare: round(ratio(agg.gkByChannel[G.gkClearance], agg.gkReleases), 6),
  gkOtherShare: round(ratio(agg.gkByChannel[G.gkOther], agg.gkReleases), 6),
  puntFirstTouchOppShare: round(
    ratio(agg.gkPuntFirstTouchOpp, agg.gkPuntFirstTouchOpp + agg.gkPuntFirstTouchOwn), 6,
  ),
  puntFirstTouchRows: agg.gkPuntFirstTouchOpp + agg.gkPuntFirstTouchOwn,
  bounceBacks: agg.gkBounceBacks,
  bounceBacksWithinWindow: agg.gkBounceBackWithin,
  bounceBackWithinWindowPerGkRelease: round(ratio(agg.gkBounceBackWithin, agg.gkReleases), 6),
  medianBounceBackGapTicksFromBins: round(pctlFromBins(agg.gkBounceBackBins, 0.5, gapEdge), 4),
  shortCompleted: agg.gkShortCompleted,
  shortTurnovers: agg.gkShortTurnovers,
  shortTurnoverWithinWindow: agg.gkShortTurnoverWithin,
  shortTurnoverWithinWindowShare: round(ratio(agg.gkShortTurnoverWithin, agg.gkShortCompleted), 6),
  medianShortTurnoverGapTicksFromBins: round(pctlFromBins(agg.gkShortTurnoverBins, 0.5, gapEdge), 4),
} as const;
const gkLandingFaces = GK_CHANNELS.map((c) => {
  const i = G[c];
  const cells = agg.gkLandByChannel[i];
  const n = sum(cells);
  return {
    channel: c,
    releases: agg.gkByChannel[i],
    landingRows: n,
    ownGroundShare: round(ratio(cells[LA.ownGround], n), 6),
    ownAerialShare: round(ratio(cells[LA.ownAerial], n), 6),
    oppGroundShare: round(ratio(cells[LA.oppGround], n), 6),
    oppAerialShare: round(ratio(cells[LA.oppAerial], n), 6),
    oppFirstTouchShare: round(ratio(cells[LA.oppGround] + cells[LA.oppAerial], n), 6),
    aerialFirstTouchShare: round(ratio(cells[LA.ownAerial] + cells[LA.oppAerial], n), 6),
  };
});

/* ---- (d) THE TURN-COST ARITHMETIC (no sims — pure engine algebra) ---- */
const TURN_ROWS = [0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180];
const TECH_LEVELS = [0.2, C7.tBar, 0.6, 0.8];
const turnCostTable = TURN_ROWS.map((deg) => {
  const theta = (deg * Math.PI) / 180;
  const misalign = (1 - Math.cos(theta)) / 2;
  return {
    thetaDeg: deg,
    misalign: round(misalign, 6),
    turnSeconds: round(theta / TURN_RATE, 6),
    turnTicks: round(theta / TURN_RATE / DT, 4),
    turnTicksWhole: Math.ceil(theta / TURN_RATE / DT),
    powerMulAtTechLow: round(orientationPowerMul(misalign, TECH_LEVELS[0]), 6),
    powerMulAtTechMean: round(orientationPowerMul(misalign, TECH_LEVELS[1]), 6),
    powerMulAtTechHigh: round(orientationPowerMul(misalign, TECH_LEVELS[3]), 6),
    noiseMulAtTechLow: round(orientationNoiseMul(misalign, TECH_LEVELS[0]), 6),
    noiseMulAtTechMean: round(orientationNoiseMul(misalign, TECH_LEVELS[1]), 6),
    noiseMulAtTechHigh: round(orientationNoiseMul(misalign, TECH_LEVELS[3]), 6),
    turnTicksOverWindupCapTicks: round((theta / TURN_RATE / DT) / (C7.cap * 60), 4),
  };
});
const windupGrid = [
  { v: 0, omega: 0 }, { v: 3.5, omega: 0 }, { v: 7, omega: 0 },
  { v: 0, omega: TURN_RATE / 2 }, { v: 0, omega: TURN_RATE },
  { v: 7, omega: TURN_RATE },
].map((g) => ({
  vMetresPerSecond: g.v,
  omegaRadPerSecond: round(g.omega, 6),
  windupTicksAtTechLow: c7WindupTicksDerived(g.v, g.omega, TECH_LEVELS[0]),
  windupTicksAtTechMean: c7WindupTicksDerived(g.v, g.omega, TECH_LEVELS[1]),
  windupTicksAtTechHigh: c7WindupTicksDerived(g.v, g.omega, TECH_LEVELS[3]),
}));
const turnFaces = {
  turnRateRadPerSecond: TURN_RATE,
  fullReversalSeconds: round(Math.PI / TURN_RATE, 6),
  fullReversalTicks: round(Math.PI / TURN_RATE / DT, 4),
  fullReversalTicksWhole: Math.ceil(Math.PI / TURN_RATE / DT),
  windupCapTicks: Math.round(C7.cap * 60),
  windupFloorTicks: Math.round(C7.floor * 60),
  fullReversalOverWindupCap: round((Math.PI / TURN_RATE / DT) / (C7.cap * 60), 4),
  squareTurnTicksWhole: Math.ceil((Math.PI / 2) / TURN_RATE / DT),
  maxPowerPenaltyAtTechZero: round(1 - orientationPowerMul(1, 0), 6),
  maxNoiseInflationAtTechZero: round(orientationNoiseMul(1, 0) - 1, 6),
  observedWindupArms: sum(agg.windupBins),
  observedWindupMeanTicks: round(
    ratio(agg.windupBins.reduce((a, b, i) => a + b * (i + 3), 0), sum(agg.windupBins)), 6,
  ),
} as const;

/* ---- the clock (canon: every rate on the 240 s match clock or dual-axis) ---- */
const clockFaces = {
  matchDurationSimSeconds: MATCH_DURATION,
  simSecondsPerDisplaySecond: round(1 / 22.5, 6),
  ticksPerMatchMean: round(ratio(agg.ticks, M), 4),
  playingTicksPerMatchMean: round(ratio(agg.playingTicks, M), 4),
  goalsPerMatchMean: round(ratio(agg.goals, M), 4),
  reachCrossingsPerPlayingSimMinute: round(
    ratio(agg.reachBodyTicks, agg.playingTicks * DT / 60), 4,
  ),
  visualThroughBodyPerPlayingSimMinute: round(
    ratio(agg.coreBodyTicks, agg.playingTicks * DT / 60), 4,
  ),
} as const;

/* ========================================================================== */
/* §11 THE GATES                                                             */
/* ========================================================================== */
const xSrcDiff = gitOut('git diff --stat HEAD -- src');
const xSrcStatus = gitOut('git status --porcelain -- src');
const gates: Record<string, boolean> = {
  gWorld: worldOkAll && RECEIPT_OK,
  gFormula: FORMULA_OK,
  gConstants: CONSTANTS_OK,
  gSrcUntouched: xSrcDiff === '' && xSrcStatus === '',
  gSeedsBookedEqualWalked: rows.length === SEEDS.length
    && rows.every((r, i) => r.seed === SEEDS[i]),
  gLivenessReleases: agg.releases > 0 && agg.relByClass[K.shortPass] > 0
    && agg.relByClass[K.shot] > 0 && agg.relByClass[K.clearance] > 0,
  gLivenessThroughBody: agg.reachBodyTicks > 0 && agg.freeBallPlayingTicks > 0,
  gLivenessGk: agg.gkReleases > 0,
  gLivenessWindup: sum(agg.windupBins) > 0,
  gCausePartition: sum(agg.reachCauseTicks) === agg.reachBodyTicks
    && sum(agg.coreCauseTicks) === agg.coreBodyTicks,
  gCoreSubsetOfReach: agg.coreBodyTicks <= agg.reachBodyTicks,
  gTierPartition: sum(allTier) === agg.releases
    && sum(allMisBins) === agg.releases,
  gDoseBytes: L3_BYTES_SHA.length === 64 && PCT1_BYTES_SHA.length === 64
    && PC_DOSE_EXPOSURES > 0 && L3_DOSE_LUNGES > 0,
};

/* ========================================================================== */
/* §12 THE ARTIFACT — ALLOWLIST-SCHEMA HASHED BODY                           */
/* ========================================================================== */
const instrumentPath = 'scripts/probes/bk-c0-bodyball-census.ts';
const artifact: Record<string, unknown> = {
  stage: 'BK-C0',
  title: 'THE BODY-BALL CENSUS — release facing · through-body flight · the GK loop · turn cost',
  contract: 'docs/world-model/BK-BODYBALL-CONTRACT.md §3 BK-C0',
  authorization: 'ruling #305 item 3 (instrument-only)',
  mode: MODE,
  isOverrideRun: IS_PREFLIGHT,
  instrumentCommit: gitOut('git rev-parse HEAD'),
  instrumentPath,
  instrumentSha256: sha(readFileSync(instrumentPath, 'utf8')),
  generatedAtIso: new Date().toISOString(),
  wallSeconds: round((Date.now() - t0Wall) / 1000, 3),

  world: {
    composition: 'world 8 — `new Match({seed, teams, ...a4MatchFlags(8)})` + '
      + '`armA4World(m, null, 8, poolT1DoseCells(L3-T1), poolPcDoseTable(PC-T1))`',
    armedVersionAsserted: PC_WORLD,
    receiptSeed: RECEIPT_SEED,
    receiptConjuncts: RECEIPT,
    everyWalkedMatchConformed: worldOkAll,
    l3DoseSourcePath: L3_T1_PATH,
    l3DoseFileBytesSha256: L3_BYTES_SHA,
    l3DoseLungesTotal: L3_DOSE_LUNGES,
    pcDoseSourcePath: PC_T1_PATH,
    pcDoseFileBytesSha256: PCT1_BYTES_SHA,
    pcDoseExposuresTotal: PC_DOSE_EXPOSURES,
  },
  seedLedger: {
    blockOfRecord: '12,501,000–999 (opened by ruling #305 item 3)',
    batterySeedFirst: SEEDS[0],
    batterySeedLast: SEEDS[SEEDS.length - 1],
    batterySeedCount: SEEDS.length,
    worldConstructionReceiptSeed: RECEIPT_SEED,
    statsStreamBasesDrawn: [] as number[],
    bookedEqualsWalked: gates.gSeedsBookedEqualWalked,
  },
  definitions: {
    misalignMeasure: 'the engine\'s own `kickMisalignment` = (1 − cos θ)/2 on the body\'s '
      + `heading (src/sim/mechanics.ts:${MISALIGN_LINE})`,
    facingTierEdgesMisalign: TIER_EDGES.map((e) => round(e, 6)),
    facingTierRationale: 'quadrant geometry — θ = 45°, 90°, 135°; no invented constant',
    releaseFacingDirection: 'the ball\'s own horizontal velocity direction at the tick '
      + 'boundary after the release, de-rotated by the one tick of Magnus rotation '
      + '`stepBall` applied; the residual error bound is published as '
      + '`maxSpinRotationPerTickRad`',
    releaseFacingHeading: 'the striker\'s PRE-STEP heading — kicks fire in `executeAction` '
      + 'and at the two head-of-tick wind-up resolves, both BEFORE `physicsStep` writes the '
      + 'new heading',
    intentMisalign: 'the same measure against the direction of the intended TARGET body at '
      + 'the pre-step boundary (passes with a `pendingPass.targetGid` only)',
    releaseOutcome: 'the side of the NEXT body to touch the ball (the engine\'s own '
      + '`lastTouch`/owner transition), else out-of-play / goal / no-touch-by-whistle',
    visualThroughBodyRadiusMetres: PLAYER_CORE_RADIUS,
    reachRadiusMetres: CONTROL_RADIUS,
    throughBodyScope: 'FREE ball (owner === null), phase === playing, body not sentOff, and '
      + 'the body is NOT the ball\'s `lastTouch` nor the tick\'s contact — the ball sitting '
      + 'inside the boot that just struck it is a self-contact artefact, not 球穿身',
    handlerContactDefinition: '`ball.lastTouch` changed this step, or ownership passed to a '
      + 'body that did not own it last tick',
    deadBandMetres: [CONTROL_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    aboveClaimMetres: GK_CLAIM_HEIGHT,
    causeLadder: CAUSES,
    causeLadderRule: 'evaluated in the listed order, one cell per body-tick; the residual '
      + '`rollOrClaimOrder` is the blind/speed roll, the oriented-shell screening, or another '
      + 'claim winning the tick',
    fastBallSplitMetresPerSecond: TRIVIAL_TRAP_SPEED,
    fastBallSplitRationale: 'the engine\'s own trivially-trapped cut in `attemptFirstTouch` '
      + '(`speed <= 6` returns a clean touch unconditionally)',
    gkChannels: GK_CHANNELS,
    gkChannelRule: 'the keeper\'s own ACTION label at the pre-step boundary; `punt` = '
      + '`LoftedPass` while `gkDistributing`',
    bounceBackDefinition: 'the RELEASING keeper owns the ball again after his own release',
    bounceBackWindowTicks: BOUNCE_WINDOW_TICKS,
    bounceBackWindowRationale: `2 × the engine's own lofted-flight cap tMax = ${LOFT_T_MAX} s `
      + `(src/sim/mechanics.ts:${LOFT_LINE}) — one lofted round trip, out and back`,
    turnoverWindowTicks: TURNOVER_WINDOW_TICKS,
    turnoverWindowRationale: 'the engine\'s own arrival law `L3_DEFENCE_WINDOW_S = '
      + 'sqrt(2·CB_TACKLE_RADIUS/ACCEL) + π/TURN_RATE` (src/ai/defenceBook.ts), i.e. the '
      + 'widest window the engine itself says a defender needs to arrive and challenge',
    turnoverMeasuredFrom: 'the TEAMMATE\'s first touch, not the keeper\'s release',
    binning: {
      misalignBins: MIS_BINS,
      misalignBinWidth: round(1 / MIS_BINS, 6),
      gapBins: GAP_BINS,
      gapBinTicks: GAP_BIN_TICKS,
      episodeBins: EP_BINS,
      windupBinsTicksThreeToEleven: W_BINS,
      percentileConvention: 'a percentile face reports the UPPER EDGE of the bin the '
        + 'cumulative count crosses (the honest coarse read from stored bins)',
    },
  },
  tracedConstants: {
    turnRateRadPerSecond: TURN_RATE,
    dtSeconds: DT,
    matchDurationSimSeconds: MATCH_DURATION,
    controlRadiusMetres: CONTROL_RADIUS,
    playerCoreRadiusMetres: PLAYER_CORE_RADIUS,
    controlMaxHeightMetres: CONTROL_MAX_HEIGHT,
    headerMinHeightMetres: HEADER_MIN_HEIGHT,
    headerMaxHeightMetres: HEADER_MAX_HEIGHT,
    headerRadiusMetres: HEADER_RADIUS,
    gkClaimHeightMetres: GK_CLAIM_HEIGHT,
    controlMaxSpeedMetresPerSecond: CONTROL_MAX_SPEED,
    gkControlMaxSpeedMetresPerSecond: GK_CONTROL_MAX_SPEED,
    deflectMaxSpeedMetresPerSecond: DEFLECT_MAX_SPEED,
    kickCooldownSeconds: KICK_COOLDOWN,
    aiIntervalSeconds: AI_INTERVAL,
    touchControlDistMetres: TOUCH_CONTROL_DIST,
    gravityMetresPerSecondSquared: GRAVITY,
    l3DefenceWindowSeconds: round(L3_DEFENCE_WINDOW_S, 6),
    loftFlightCapSeconds: LOFT_T_MAX,
    c7ExtractedConstants: C7,
    c7WindupTicksLine: C7_LINE,
    orientationPowerMulLine: ORIENT_POWER_LINE,
    orientationNoiseMulLine: ORIENT_NOISE_LINE,
    kickMisalignmentLine: MISALIGN_LINE,
  },
  battery: {
    matches: M,
    ticksTotal: agg.ticks,
    wallSecondsPerMatch: round((Date.now() - t0Wall) / 1000 / Math.max(M, 1), 4),
  },
  clockFaces,
  releaseFaces,
  restartFaces,
  perClassFaces,
  perTierOutcomeFaces,
  throughFaces,
  causeFaces,
  gkFaces,
  gkLandingFaces,
  turnFaces,
  turnCostTable,
  windupGrid,
  aggregateCells: {
    relByClass: agg.relByClass,
    relByClassTier: agg.relByClassTier,
    relMisBins: agg.relMisBins,
    relMisSum: agg.relMisSum.map((v) => round(v, 6)),
    relOutcome: agg.relOutcome,
    relTierOutcome: agg.relTierOutcome,
    allMisBins,
    allTier,
    relByClassRestart: agg.relByClassRestart,
    relByClassTierRestart: agg.relByClassTierRestart,
    relMisBinsRestart: agg.relMisBinsRestart,
    relMisSumRestart: agg.relMisSumRestart.map((v) => round(v, 6)),
    allMisBinsRestart: allMisBinsRestart,
    allTierRestart: allTierRestart,
    gkByChannelRestart: agg.gkByChannelRestart,
    intentMisBins: agg.intentMisBins,
    reachCauseTicks: agg.reachCauseTicks,
    coreCauseTicks: agg.coreCauseTicks,
    reachEpisodeBins: agg.reachEpisodeBins,
    coreEpisodeBins: agg.coreEpisodeBins,
    gkByChannel: agg.gkByChannel,
    gkLandByChannel: agg.gkLandByChannel,
    gkBounceBackBins: agg.gkBounceBackBins,
    gkShortTurnoverBins: agg.gkShortTurnoverBins,
    windupBins: agg.windupBins,
  },
  perSeedCells: rows.map((r) => ({
    seed: r.seed,
    worldOk: r.worldOk,
    ticks: r.ticks,
    playingTicks: r.playingTicks,
    goals: r.goals,
    releases: r.releases,
    restartReleases: r.restartReleases,
    relByClassRestart: r.relByClassRestart,
    relByClassTierRestart: r.relByClassTierRestart,
    relMisBinsRestart: r.relMisBinsRestart,
    relMisSumRestart: r.relMisSumRestart.map((v) => round(v, 6)),
    gkByChannelRestart: r.gkByChannelRestart,
    multiSignatureTicks: r.multiSignatureTicks,
    unattributedReleases: r.unattributedReleases,
    relByClass: r.relByClass,
    relByClassTier: r.relByClassTier,
    relMisBins: r.relMisBins,
    relMisSum: r.relMisSum.map((v) => round(v, 6)),
    relOutcome: r.relOutcome,
    relTierOutcome: r.relTierOutcome,
    intentMisBins: r.intentMisBins,
    intentMisSum: round(r.intentMisSum, 6),
    intentN: r.intentN,
    spinRotSum: round(r.spinRotSum, 6),
    spinRotMax: round(r.spinRotMax, 6),
    windupBins: r.windupBins,
    freeBallTicks: r.freeBallTicks,
    freeBallPlayingTicks: r.freeBallPlayingTicks,
    reachBodyTicks: r.reachBodyTicks,
    reachBodyTicksFast: r.reachBodyTicksFast,
    coreBodyTicks: r.coreBodyTicks,
    coreBodyTicksFast: r.coreBodyTicksFast,
    reachCauseTicks: r.reachCauseTicks,
    coreCauseTicks: r.coreCauseTicks,
    reachEpisodes: r.reachEpisodes,
    coreEpisodes: r.coreEpisodes,
    reachEpisodeBins: r.reachEpisodeBins,
    coreEpisodeBins: r.coreEpisodeBins,
    contactTicks: r.contactTicks,
    deadBandBallTicks: r.deadBandBallTicks,
    deadBandBallTicksWithBody: r.deadBandBallTicksWithBody,
    aboveClaimBallTicks: r.aboveClaimBallTicks,
    cooldownInvisibleBodyTicks: r.cooldownInvisibleBodyTicks,
    cooldownInvisibleEpisodes: r.cooldownInvisibleEpisodes,
    gkReleases: r.gkReleases,
    gkByChannel: r.gkByChannel,
    gkLandByChannel: r.gkLandByChannel,
    gkBounceBackBins: r.gkBounceBackBins,
    gkBounceBacks: r.gkBounceBacks,
    gkBounceBackWithin: r.gkBounceBackWithin,
    gkShortCompleted: r.gkShortCompleted,
    gkShortTurnoverBins: r.gkShortTurnoverBins,
    gkShortTurnovers: r.gkShortTurnovers,
    gkShortTurnoverWithin: r.gkShortTurnoverWithin,
    gkPuntFirstTouchOpp: r.gkPuntFirstTouchOpp,
    gkPuntFirstTouchOwn: r.gkPuntFirstTouchOwn,
  })),
  gates,
  xSrcUntouched: { diffStat: xSrcDiff, porcelain: xSrcStatus },
};

/**
 * ⭐ THE HASHED BODY IS BUILT FROM AN EXPLICIT ALLOWLIST SCHEMA — a field not in the schema
 * never enters the body (PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1). The excluded
 * keys are exactly the ones that cannot be stable across two identical runs.
 */
const BODY_SCHEMA = [
  'stage', 'title', 'contract', 'authorization', 'mode', 'isOverrideRun',
  'world', 'seedLedger', 'definitions', 'tracedConstants',
  'clockFaces', 'releaseFaces', 'restartFaces', 'perClassFaces', 'perTierOutcomeFaces',
  'throughFaces', 'causeFaces', 'gkFaces', 'gkLandingFaces',
  'turnFaces', 'turnCostTable', 'windupGrid',
  'aggregateCells', 'perSeedCells', 'gates',
] as const;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySchema = BODY_SCHEMA;
artifact.resultSha256 = sha(canonical(body));

writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
/* §13 gFaces — RE-DERIVE EVERY PUBLISHED FACE BY PARSING THE ARTIFACT OFF DISK */
/* ========================================================================== */
const disk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, any>;
const checks: { name: string; ok: boolean }[] = [];
/** JSON has no NaN — a NaN face serializes as `null`, so the disk read is normalised back. */
const fromDisk = (b: number | null): number => (b === null ? Number.NaN : b);
const eq = (name: string, a: number, bRaw: number | null): void => {
  const b = fromDisk(bRaw);
  checks.push({ name, ok: (Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) < 1e-9 });
};
const eqI = (name: string, a: number, bRaw: number | null): void => {
  checks.push({ name, ok: a === fromDisk(bRaw) });
};
{
  const ps = disk.perSeedCells as any[];
  const nMatches = ps.length;
  // ---- the aggregate cells re-sum from the per-seed cells ----
  const sumField = (f: string): number => ps.reduce((a, r) => a + (r[f] as number), 0);
  const sumArr = (f: string, n: number): number[] => {
    const o = zeros(n);
    for (const r of ps) addInto(o, r[f] as number[]);
    return o;
  };
  const sumArr2 = (f: string, a: number, b: number): number[][] => {
    const o = zeros2(a, b);
    for (const r of ps) addInto2(o, r[f] as number[][]);
    return o;
  };
  const dRelByClass = sumArr('relByClass', CLASSES.length);
  const dRelTierClass = sumArr2('relByClassTier', CLASSES.length, TIERS.length);
  const dRelMisBins = sumArr2('relMisBins', CLASSES.length, MIS_BINS);
  const dRelOutcome = sumArr2('relOutcome', CLASSES.length, OUTCOMES.length);
  const dRelTierOutcome = sumArr2('relTierOutcome', TIERS.length, OUTCOMES.length);
  const dReachCause = sumArr('reachCauseTicks', CAUSES.length);
  const dCoreCause = sumArr('coreCauseTicks', CAUSES.length);
  const dGkByChannel = sumArr('gkByChannel', GK_CHANNELS.length);
  const dGkLanding = sumArr2('gkLandByChannel', GK_CHANNELS.length, LAND.length);
  const dBounceBins = sumArr('gkBounceBackBins', GAP_BINS);
  const dTurnBins = sumArr('gkShortTurnoverBins', GAP_BINS);
  const dWindupBins = sumArr('windupBins', W_BINS);
  const dEpReach = sumArr('reachEpisodeBins', EP_BINS);
  const dRelMisSum = zeros(CLASSES.length);
  for (const r of ps) addInto(dRelMisSum, r.relMisSum as number[]);
  const dAllMis = zeros(MIS_BINS);
  for (const b of dRelMisBins) addInto(dAllMis, b);
  const dAllTier = zeros(TIERS.length);
  for (const b of dRelTierClass) addInto(dAllTier, b);
  const dReleases = sumField('releases');

  eqI('gFaces.aggregateCells.relByClass', sum(dRelByClass), sum(disk.aggregateCells.relByClass));
  eqI('gFaces.aggregateCells.allMisBins', sum(dAllMis), sum(disk.aggregateCells.allMisBins));
  eqI('gFaces.aggregateCells.allTier', sum(dAllTier), sum(disk.aggregateCells.allTier));
  eqI('gFaces.battery.matches', nMatches, disk.battery.matches);

  // ---- clockFaces ----
  eq('gFaces.clock.ticksPerMatchMean',
    round(ratio(sumField('ticks'), nMatches), 4), disk.clockFaces.ticksPerMatchMean);
  eq('gFaces.clock.playingTicksPerMatchMean',
    round(ratio(sumField('playingTicks'), nMatches), 4), disk.clockFaces.playingTicksPerMatchMean);
  eq('gFaces.clock.goalsPerMatchMean',
    round(ratio(sumField('goals'), nMatches), 4), disk.clockFaces.goalsPerMatchMean);
  eq('gFaces.clock.reachCrossingsPerPlayingSimMinute',
    round(ratio(sumField('reachBodyTicks'), sumField('playingTicks') * DT / 60), 4),
    disk.clockFaces.reachCrossingsPerPlayingSimMinute);
  eq('gFaces.clock.visualThroughBodyPerPlayingSimMinute',
    round(ratio(sumField('coreBodyTicks'), sumField('playingTicks') * DT / 60), 4),
    disk.clockFaces.visualThroughBodyPerPlayingSimMinute);

  // ---- releaseFaces (incl. both percentile faces FROM STORED BINS) ----
  eqI('gFaces.release.releasesTotal', dReleases, disk.releaseFaces.releasesTotal);
  eq('gFaces.release.releasesPerMatch',
    round(ratio(dReleases, nMatches), 4), disk.releaseFaces.releasesPerMatch);
  eq('gFaces.release.meanMisalignAtRelease',
    round(ratio(sum(dRelMisSum), dReleases), 6), disk.releaseFaces.meanMisalignAtRelease);
  eq('gFaces.release.medianMisalignFromBins',
    round(pctlFromBins(dAllMis, 0.5, misEdge), 6),
    disk.releaseFaces.medianMisalignAtReleaseFromBins);
  eq('gFaces.release.p90MisalignFromBins',
    round(pctlFromBins(dAllMis, 0.9, misEdge), 6), disk.releaseFaces.p90MisalignAtReleaseFromBins);
  eq('gFaces.release.shareAligned', round(ratio(dAllTier[0], dReleases), 6), disk.releaseFaces.shareAligned);
  eq('gFaces.release.shareAcross', round(ratio(dAllTier[1], dReleases), 6), disk.releaseFaces.shareAcross);
  eq('gFaces.release.shareReversed', round(ratio(dAllTier[2], dReleases), 6), disk.releaseFaces.shareReversed);
  eq('gFaces.release.shareBlind', round(ratio(dAllTier[3], dReleases), 6), disk.releaseFaces.shareBlind);
  eq('gFaces.release.shareBeyondSquare',
    round(ratio(dAllTier[2] + dAllTier[3], dReleases), 6), disk.releaseFaces.shareBeyondSquare);
  eq('gFaces.release.meanIntentMisalign',
    round(ratio(ps.reduce((a, r) => a + (r.intentMisSum as number), 0), sumField('intentN')), 6),
    disk.releaseFaces.meanIntentMisalign);
  eqI('gFaces.release.intentRows', sumField('intentN'), disk.releaseFaces.intentRows);
  eq('gFaces.release.meanSpinRotationPerTickRad',
    round(ratio(ps.reduce((a, r) => a + (r.spinRotSum as number), 0), dReleases), 6),
    disk.releaseFaces.meanSpinRotationPerTickRad);
  eq('gFaces.release.maxSpinRotationPerTickRad',
    round(Math.max(...ps.map((r) => r.spinRotMax as number)), 6),
    disk.releaseFaces.maxSpinRotationPerTickRad);
  const dHeaderRel = sum(HEADER_CLASSES.map((c) => dRelByClass[K[c]]));
  eqI('gFaces.release.headerClassReleases', dHeaderRel, disk.releaseFaces.headerClassReleases);
  eq('gFaces.release.headerClassShareOfReleases',
    round(ratio(dHeaderRel, dReleases), 6), disk.releaseFaces.headerClassShareOfReleases);
  eqI('gFaces.release.facingPricedReleases',
    dReleases - dHeaderRel, disk.releaseFaces.facingPricedReleases);
  eqI('gFaces.release.multiSignatureTicks',
    sumField('multiSignatureTicks'), disk.releaseFaces.multiSignatureTicks);
  eqI('gFaces.release.unattributedReleases',
    sumField('unattributedReleases'), disk.releaseFaces.unattributedReleases);

  // ---- restartFaces ----
  const dRelClassRestart = sumArr('relByClassRestart', CLASSES.length);
  const dRelTierClassRestart = sumArr2('relByClassTierRestart', CLASSES.length, TIERS.length);
  const dRelMisBinsRestart = sumArr2('relMisBinsRestart', CLASSES.length, MIS_BINS);
  const dRelMisSumRestart = zeros(CLASSES.length);
  for (const r of ps) addInto(dRelMisSumRestart, r.relMisSumRestart as number[]);
  const dAllMisRestart = zeros(MIS_BINS);
  for (const b of dRelMisBinsRestart) addInto(dAllMisRestart, b);
  const dAllTierRestart = zeros(TIERS.length);
  for (const b of dRelTierClassRestart) addInto(dAllTierRestart, b);
  const dGkChannelRestart = sumArr('gkByChannelRestart', GK_CHANNELS.length);
  const dRestartReleases = sumField('restartReleases');
  eqI('gFaces.restart.restartReleasesTotal', dRestartReleases, disk.restartFaces.restartReleasesTotal);
  eq('gFaces.restart.restartReleasesPerMatch',
    round(ratio(dRestartReleases, nMatches), 4), disk.restartFaces.restartReleasesPerMatch);
  eq('gFaces.restart.meanMisalignAtRestartRelease',
    round(ratio(sum(dRelMisSumRestart), dRestartReleases), 6),
    disk.restartFaces.meanMisalignAtRestartRelease);
  eq('gFaces.restart.medianMisalignAtRestartReleaseFromBins',
    round(pctlFromBins(dAllMisRestart, 0.5, misEdge), 6),
    disk.restartFaces.medianMisalignAtRestartReleaseFromBins);
  eq('gFaces.restart.shareBeyondSquareAtRestart',
    round(ratio(dAllTierRestart[2] + dAllTierRestart[3], dRestartReleases), 6),
    disk.restartFaces.shareBeyondSquareAtRestart);
  eqI('gFaces.restart.gkRestartReleases', sum(dGkChannelRestart), disk.restartFaces.gkRestartReleases);
  eq('gFaces.restart.gkRestartClearanceShare',
    round(ratio(dGkChannelRestart[G.gkClearance], sum(dGkChannelRestart)), 6),
    disk.restartFaces.gkRestartClearanceShare);
  eqI('gFaces.aggregateCells.relByClassRestart',
    sum(dRelClassRestart), sum(disk.aggregateCells.relByClassRestart));

  // ---- perClassFaces (every field of every row) ----
  (disk.perClassFaces as any[]).forEach((f, i) => {
    const n = dRelByClass[i];
    const outs = dRelOutcome[i];
    const outN = sum(outs);
    eqI(`gFaces.class[${f.klass}].releases`, n, f.releases);
    eq(`gFaces.class[${f.klass}].meanMisalign`, round(ratio(dRelMisSum[i], n), 6), f.meanMisalign);
    eq(`gFaces.class[${f.klass}].medianMisalignFromBins`,
      round(pctlFromBins(dRelMisBins[i], 0.5, misEdge), 6), f.medianMisalignFromBins);
    eq(`gFaces.class[${f.klass}].shareBeyondSquare`,
      round(ratio(dRelTierClass[i][2] + dRelTierClass[i][3], n), 6), f.shareBeyondSquare);
    eq(`gFaces.class[${f.klass}].ownNextTouchShare`,
      round(ratio(outs[O.ownNextTouch], outN), 6), f.ownNextTouchShare);
    eq(`gFaces.class[${f.klass}].oppNextTouchShare`,
      round(ratio(outs[O.oppNextTouch], outN), 6), f.oppNextTouchShare);
    eqI(`gFaces.class[${f.klass}].outcomeRows`, outN, f.outcomeRows);
  });

  // ---- perTierOutcomeFaces ----
  (disk.perTierOutcomeFaces as any[]).forEach((f, i) => {
    const outs = dRelTierOutcome[i];
    const outN = sum(outs);
    eqI(`gFaces.tier[${f.tier}].outcomeRows`, outN, f.outcomeRows);
    eq(`gFaces.tier[${f.tier}].ownNextTouchShare`,
      round(ratio(outs[O.ownNextTouch], outN), 6), f.ownNextTouchShare);
    eq(`gFaces.tier[${f.tier}].oppNextTouchShare`,
      round(ratio(outs[O.oppNextTouch], outN), 6), f.oppNextTouchShare);
    eq(`gFaces.tier[${f.tier}].outOfPlayShare`,
      round(ratio(outs[O.outOfPlay], outN), 6), f.outOfPlayShare);
  });

  // ---- throughFaces ----
  const tf = disk.throughFaces;
  eqI('gFaces.through.freeBallPlayingTicks', sumField('freeBallPlayingTicks'), tf.freeBallPlayingTicks);
  eqI('gFaces.through.reachCrossingBodyTicks', sumField('reachBodyTicks'), tf.reachCrossingBodyTicks);
  eq('gFaces.through.reachCrossingBodyTicksPerMatch',
    round(ratio(sumField('reachBodyTicks'), nMatches), 4), tf.reachCrossingBodyTicksPerMatch);
  eqI('gFaces.through.reachCrossingBodyTicksFast', sumField('reachBodyTicksFast'), tf.reachCrossingBodyTicksFast);
  eqI('gFaces.through.visualThroughBodyTicks', sumField('coreBodyTicks'), tf.visualThroughBodyTicks);
  eq('gFaces.through.visualThroughBodyTicksPerMatch',
    round(ratio(sumField('coreBodyTicks'), nMatches), 4), tf.visualThroughBodyTicksPerMatch);
  eqI('gFaces.through.visualThroughBodyTicksFast', sumField('coreBodyTicksFast'), tf.visualThroughBodyTicksFast);
  eqI('gFaces.through.reachCrossingEpisodes', sumField('reachEpisodes'), tf.reachCrossingEpisodes);
  eq('gFaces.through.reachCrossingEpisodesPerMatch',
    round(ratio(sumField('reachEpisodes'), nMatches), 4), tf.reachCrossingEpisodesPerMatch);
  eqI('gFaces.through.visualThroughBodyEpisodes', sumField('coreEpisodes'), tf.visualThroughBodyEpisodes);
  eq('gFaces.through.visualThroughBodyEpisodesPerMatch',
    round(ratio(sumField('coreEpisodes'), nMatches), 4), tf.visualThroughBodyEpisodesPerMatch);
  eq('gFaces.through.medianReachEpisodeTicksFromBins',
    round(pctlFromBins(dEpReach, 0.5, (i) => i + 1), 4), tf.medianReachEpisodeTicksFromBins);
  eqI('gFaces.through.deadBandBallTicks', sumField('deadBandBallTicks'), tf.deadBandBallTicks);
  eq('gFaces.through.deadBandBallTicksPerMatch',
    round(ratio(sumField('deadBandBallTicks'), nMatches), 4), tf.deadBandBallTicksPerMatch);
  eq('gFaces.through.deadBandSecondsPerMatchSim',
    round(ratio(sumField('deadBandBallTicks'), nMatches) * DT, 6), tf.deadBandSecondsPerMatchSim);
  eqI('gFaces.through.deadBandTicksWithBodyInReach',
    sumField('deadBandBallTicksWithBody'), tf.deadBandTicksWithBodyInReach);
  eq('gFaces.through.aboveGkClaimBallTicksPerMatch',
    round(ratio(sumField('aboveClaimBallTicks'), nMatches), 4), tf.aboveGkClaimBallTicksPerMatch);
  eqI('gFaces.through.cooldownInvisibleBodyTicks',
    sumField('cooldownInvisibleBodyTicks'), tf.cooldownInvisibleBodyTicks);
  eq('gFaces.through.cooldownInvisibleBodyTicksPerMatch',
    round(ratio(sumField('cooldownInvisibleBodyTicks'), nMatches), 4),
    tf.cooldownInvisibleBodyTicksPerMatch);
  eq('gFaces.through.cooldownInvisibleEpisodesPerMatch',
    round(ratio(sumField('cooldownInvisibleEpisodes'), nMatches), 4),
    tf.cooldownInvisibleEpisodesPerMatch);
  eq('gFaces.through.handlerContactTicksPerMatch',
    round(ratio(sumField('contactTicks'), nMatches), 4), tf.handlerContactTicksPerMatch);

  // ---- causeFaces ----
  (disk.causeFaces as any[]).forEach((f, i) => {
    eqI(`gFaces.cause[${f.cause}].reachBodyTicks`, dReachCause[i], f.reachBodyTicks);
    eq(`gFaces.cause[${f.cause}].reachShare`,
      round(ratio(dReachCause[i], sum(dReachCause)), 6), f.reachShare);
    eqI(`gFaces.cause[${f.cause}].coreBodyTicks`, dCoreCause[i], f.coreBodyTicks);
    eq(`gFaces.cause[${f.cause}].coreShare`,
      round(ratio(dCoreCause[i], sum(dCoreCause)), 6), f.coreShare);
  });

  // ---- gkFaces ----
  const gf = disk.gkFaces;
  const dGkReleases = sumField('gkReleases');
  eqI('gFaces.gk.gkReleases', dGkReleases, gf.gkReleases);
  eq('gFaces.gk.gkReleasesPerMatch', round(ratio(dGkReleases, nMatches), 4), gf.gkReleasesPerMatch);
  eq('gFaces.gk.puntShare', round(ratio(dGkByChannel[G.punt], dGkReleases), 6), gf.puntShare);
  eq('gFaces.gk.throwOutShare', round(ratio(dGkByChannel[G.throwOut], dGkReleases), 6), gf.throwOutShare);
  eq('gFaces.gk.gkShortPassShare',
    round(ratio(dGkByChannel[G.gkShortPass], dGkReleases), 6), gf.gkShortPassShare);
  eq('gFaces.gk.gkClearanceShare',
    round(ratio(dGkByChannel[G.gkClearance], dGkReleases), 6), gf.gkClearanceShare);
  eq('gFaces.gk.gkOtherShare', round(ratio(dGkByChannel[G.gkOther], dGkReleases), 6), gf.gkOtherShare);
  const dOpp = sumField('gkPuntFirstTouchOpp');
  const dOwn = sumField('gkPuntFirstTouchOwn');
  eq('gFaces.gk.puntFirstTouchOppShare', round(ratio(dOpp, dOpp + dOwn), 6), gf.puntFirstTouchOppShare);
  eqI('gFaces.gk.puntFirstTouchRows', dOpp + dOwn, gf.puntFirstTouchRows);
  eqI('gFaces.gk.bounceBacks', sumField('gkBounceBacks'), gf.bounceBacks);
  eqI('gFaces.gk.bounceBacksWithinWindow', sumField('gkBounceBackWithin'), gf.bounceBacksWithinWindow);
  eq('gFaces.gk.bounceBackWithinWindowPerGkRelease',
    round(ratio(sumField('gkBounceBackWithin'), dGkReleases), 6),
    gf.bounceBackWithinWindowPerGkRelease);
  eq('gFaces.gk.medianBounceBackGapTicksFromBins',
    round(pctlFromBins(dBounceBins, 0.5, gapEdge), 4), gf.medianBounceBackGapTicksFromBins);
  eqI('gFaces.gk.shortCompleted', sumField('gkShortCompleted'), gf.shortCompleted);
  eqI('gFaces.gk.shortTurnovers', sumField('gkShortTurnovers'), gf.shortTurnovers);
  eqI('gFaces.gk.shortTurnoverWithinWindow',
    sumField('gkShortTurnoverWithin'), gf.shortTurnoverWithinWindow);
  eq('gFaces.gk.shortTurnoverWithinWindowShare',
    round(ratio(sumField('gkShortTurnoverWithin'), sumField('gkShortCompleted')), 6),
    gf.shortTurnoverWithinWindowShare);
  eq('gFaces.gk.medianShortTurnoverGapTicksFromBins',
    round(pctlFromBins(dTurnBins, 0.5, gapEdge), 4), gf.medianShortTurnoverGapTicksFromBins);

  // ---- gkLandingFaces ----
  (disk.gkLandingFaces as any[]).forEach((f, i) => {
    const cells = dGkLanding[i];
    const n = sum(cells);
    eqI(`gFaces.gkLanding[${f.channel}].releases`, dGkByChannel[i], f.releases);
    eqI(`gFaces.gkLanding[${f.channel}].landingRows`, n, f.landingRows);
    eq(`gFaces.gkLanding[${f.channel}].ownGroundShare`,
      round(ratio(cells[LA.ownGround], n), 6), f.ownGroundShare);
    eq(`gFaces.gkLanding[${f.channel}].ownAerialShare`,
      round(ratio(cells[LA.ownAerial], n), 6), f.ownAerialShare);
    eq(`gFaces.gkLanding[${f.channel}].oppGroundShare`,
      round(ratio(cells[LA.oppGround], n), 6), f.oppGroundShare);
    eq(`gFaces.gkLanding[${f.channel}].oppAerialShare`,
      round(ratio(cells[LA.oppAerial], n), 6), f.oppAerialShare);
    eq(`gFaces.gkLanding[${f.channel}].oppFirstTouchShare`,
      round(ratio(cells[LA.oppGround] + cells[LA.oppAerial], n), 6), f.oppFirstTouchShare);
    eq(`gFaces.gkLanding[${f.channel}].aerialFirstTouchShare`,
      round(ratio(cells[LA.ownAerial] + cells[LA.oppAerial], n), 6), f.aerialFirstTouchShare);
  });

  // ---- turnFaces + the turn-cost table + the wind-up grid (pure arithmetic) ----
  const trf = disk.turnFaces;
  const TR = disk.tracedConstants.turnRateRadPerSecond as number;
  eq('gFaces.turn.fullReversalSeconds', round(Math.PI / TR, 6), trf.fullReversalSeconds);
  eq('gFaces.turn.fullReversalTicks', round(Math.PI / TR / DT, 4), trf.fullReversalTicks);
  eqI('gFaces.turn.fullReversalTicksWhole', Math.ceil(Math.PI / TR / DT), trf.fullReversalTicksWhole);
  eqI('gFaces.turn.squareTurnTicksWhole',
    Math.ceil((Math.PI / 2) / TR / DT), trf.squareTurnTicksWhole);
  eqI('gFaces.turn.windupCapTicks',
    Math.round((disk.tracedConstants.c7ExtractedConstants.cap as number) * 60), trf.windupCapTicks);
  eqI('gFaces.turn.windupFloorTicks',
    Math.round((disk.tracedConstants.c7ExtractedConstants.floor as number) * 60), trf.windupFloorTicks);
  eq('gFaces.turn.fullReversalOverWindupCap',
    round((Math.PI / TR / DT) / ((disk.tracedConstants.c7ExtractedConstants.cap as number) * 60), 4),
    trf.fullReversalOverWindupCap);
  eq('gFaces.turn.maxPowerPenaltyAtTechZero',
    round(1 - orientationPowerMul(1, 0), 6), trf.maxPowerPenaltyAtTechZero);
  eq('gFaces.turn.maxNoiseInflationAtTechZero',
    round(orientationNoiseMul(1, 0) - 1, 6), trf.maxNoiseInflationAtTechZero);
  eqI('gFaces.turn.observedWindupArms', sum(dWindupBins), trf.observedWindupArms);
  eq('gFaces.turn.observedWindupMeanTicks',
    round(ratio(dWindupBins.reduce((a, b, i) => a + b * (i + 3), 0), sum(dWindupBins)), 6),
    trf.observedWindupMeanTicks);
  (disk.turnCostTable as any[]).forEach((r) => {
    const theta = (r.thetaDeg * Math.PI) / 180;
    const mis = (1 - Math.cos(theta)) / 2;
    eq(`gFaces.turnTable[${r.thetaDeg}].misalign`, round(mis, 6), r.misalign);
    eq(`gFaces.turnTable[${r.thetaDeg}].turnSeconds`, round(theta / TR, 6), r.turnSeconds);
    eq(`gFaces.turnTable[${r.thetaDeg}].turnTicks`, round(theta / TR / DT, 4), r.turnTicks);
    eqI(`gFaces.turnTable[${r.thetaDeg}].turnTicksWhole`,
      Math.ceil(theta / TR / DT), r.turnTicksWhole);
    eq(`gFaces.turnTable[${r.thetaDeg}].powerMulAtTechMean`,
      round(orientationPowerMul(mis, C7.tBar), 6), r.powerMulAtTechMean);
    eq(`gFaces.turnTable[${r.thetaDeg}].noiseMulAtTechMean`,
      round(orientationNoiseMul(mis, C7.tBar), 6), r.noiseMulAtTechMean);
    eq(`gFaces.turnTable[${r.thetaDeg}].powerMulAtTechLow`,
      round(orientationPowerMul(mis, TECH_LEVELS[0]), 6), r.powerMulAtTechLow);
    eq(`gFaces.turnTable[${r.thetaDeg}].powerMulAtTechHigh`,
      round(orientationPowerMul(mis, TECH_LEVELS[3]), 6), r.powerMulAtTechHigh);
    eq(`gFaces.turnTable[${r.thetaDeg}].noiseMulAtTechLow`,
      round(orientationNoiseMul(mis, TECH_LEVELS[0]), 6), r.noiseMulAtTechLow);
    eq(`gFaces.turnTable[${r.thetaDeg}].noiseMulAtTechHigh`,
      round(orientationNoiseMul(mis, TECH_LEVELS[3]), 6), r.noiseMulAtTechHigh);
    eq(`gFaces.turnTable[${r.thetaDeg}].turnTicksOverWindupCapTicks`,
      round((theta / TR / DT)
        / ((disk.tracedConstants.c7ExtractedConstants.cap as number) * 60), 4),
      r.turnTicksOverWindupCapTicks);
  });
  (disk.windupGrid as any[]).forEach((r, i) => {
    eqI(`gFaces.windupGrid[${i}].low`,
      c7WindupTicksDerived(r.vMetresPerSecond, r.omegaRadPerSecond, TECH_LEVELS[0]),
      r.windupTicksAtTechLow);
    eqI(`gFaces.windupGrid[${i}].mean`,
      c7WindupTicksDerived(r.vMetresPerSecond, r.omegaRadPerSecond, TECH_LEVELS[1]),
      r.windupTicksAtTechMean);
    eqI(`gFaces.windupGrid[${i}].high`,
      c7WindupTicksDerived(r.vMetresPerSecond, r.omegaRadPerSecond, TECH_LEVELS[3]),
      r.windupTicksAtTechHigh);
  });

  // ---- the hashed body itself re-derives off disk ----
  const diskBody: Record<string, unknown> = {};
  for (const k of disk.hashedBodySchema as string[]) diskBody[k] = disk[k];
  checks.push({ name: 'gFaces.resultSha256', ok: sha(canonical(diskBody)) === disk.resultSha256 });
}
const facesOk = checks.every((c) => c.ok);
gates.gFaces = facesOk;
gates.gFacesCoverage = checks.length >= 150;

/* re-write with the two face gates settled (the body hash covers `gates`, so it re-hashes) */
artifact.gates = gates;
artifact.gFacesChecks = checks.length;
artifact.gFacesFailed = checks.filter((c) => !c.ok).map((c) => c.name);
const body2: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body2[k] = artifact[k];
artifact.resultSha256 = sha(canonical(body2));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
/* §14 THE BANNER                                                             */
/* ========================================================================== */
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner('');
banner(`BK-C0 — mode=${MODE} matches=${M} seeds=${SEEDS[0]}..${SEEDS[SEEDS.length - 1]} `
  + `receipt=${RECEIPT_SEED} wall=${((Date.now() - t0Wall) / 1000).toFixed(1)} s`);
banner(`  (a) releases ${releaseFaces.releasesTotal} · mean misalign `
  + `${releaseFaces.meanMisalignAtRelease} · beyond-square share ${releaseFaces.shareBeyondSquare}`);
banner(`  (b) reach-crossing body-ticks/match ${throughFaces.reachCrossingBodyTicksPerMatch} · `
  + `visual through-body/match ${throughFaces.visualThroughBodyTicksPerMatch} · dead-band `
  + `ticks/match ${throughFaces.deadBandBallTicksPerMatch}`);
banner(`  (c) GK releases/match ${gkFaces.gkReleasesPerMatch} · punt share ${gkFaces.puntShare} · `
  + `punt opp-first-touch ${gkFaces.puntFirstTouchOppShare} · bounce-back/release `
  + `${gkFaces.bounceBackWithinWindowPerGkRelease}`);
banner(`  (d) full reversal = ${turnFaces.fullReversalTicksWhole} ticks `
  + `(${turnFaces.fullReversalSeconds} s) vs wind-up cap ${turnFaces.windupCapTicks} ticks`);
banner(`  gFaces: ${checks.filter((c) => c.ok).length}/${checks.length} re-derived off disk`);
banner(`  artifact: ${OUT_PATH}  sha256=${String(artifact.resultSha256).slice(0, 16)}…`);
banner(red.length === 0 ? '  ALL GATES GREEN' : `  RED GATES: ${red.join(', ')}`);
process.exit(red.length === 0 ? 0 : 1);
