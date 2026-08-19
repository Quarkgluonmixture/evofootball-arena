/**
 * ⭐⭐ BK-T2 — THE COMPOSITION EXAM (docs/world-model/BK-T2-COMPOSITION-EXAM.md).
 *
 * Authorized by ruling #308 item 4 for EXACTLY this stage. INSTRUMENT-ONLY: `src/**` is
 * untouched — the two seams are ALREADY BANKED (#307 `bkFacingLaw`, #308 `bkContactLaw`).
 * This stage is an EXAM: it SCORES H-BK.1 and H-BK.2 (contract §1) on virgin seeds against
 * frozen CI rules, and REPORTS H-BK.3.
 *
 *   BASE  = the world-8 composition  (a4MatchFlags(8) + armA4World with the MATURED L3/PC
 *           doses, both dose FILES hashed AS BYTES before they are parsed)
 *   ARMED = BASE + `bkFacingLaw: true` + `bkContactLaw: true`
 *   PAIRED: every seed is walked TWICE, once per arm.
 *
 * ⭐ CANON, COPIED FROM CANON.md BESIDE ITS ACTUAL HOME (never re-typed from memory, #301):
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; the artifact
 *     records the instrument hash.  HOME: ruling #266.3(c). (paraphrase)
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
 *     never enters the body; forbidden-name lists are retired".  HOME:
 *     PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1.
 *   · per-seed cells — per-seed/per-cluster cells stored so every headline re-derives.
 *     HOME: ruling #282.2(ii). (paraphrase)
 *   · gFaces-from-disk — the re-derivation gate parses the SERIALIZED artifact off disk.
 *     HOME: ruling #287 item 1.  VERBATIM extension: "the re-derivation gate covers EVERY
 *     published face; a percentile face requires stored bins" — HOME:
 *     PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4.
 *   · "a field carries the unit its name claims".   HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
 *     face".  HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a starred finding states its |Δ| ÷ half-width ratio".  HOME:
 *     BU-T0B-PRICE-SEPARATION.md §COMMANDER CORRECTIONS item 2.
 *   · "a max−min face reports a noise-floor comparison, not a zero-null CI".  HOME:
 *     PC-T1-LEARNING-EXAM.md §COMMANDER CORRECTIONS item 3.
 *   · moving denominators disclosed per face; prefer the denominator-stable form.  HOME:
 *     PW-C0-WEIGHT-PHYSICS-CENSUS.md §COMMANDER CORRECTIONS item 2. (paraphrase)
 *   · clock honesty — every rate on the 240 s match clock or dual-axis; APPLIED never
 *     nominal.  HOMES: ruling #280.2(iii) + PC-T2 §CORR item 3. (paraphrase)
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared field".
 *     HOME: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6.
 *   · seed discipline — BOOKED = WALKED; blocks consumed whole; stats floors step ≥ 200 on
 *     the lattice.  HOME: the standing frontier practice. (paraphrase)
 *
 * ⭐ THE INSTRUMENTS ARE INHERITED, NOT INVENTED:
 *   (a) the release-facing census — BK-C0 §2(a) VERBATIM in definition (pre-step heading ·
 *       the ball's own de-rotated velocity · the four quadrant tiers · the 12 classes off the
 *       engine's own stat signatures · 20 stored bins).
 *   (b) the through-body sweep — BK-C0 §2(b) / BK-T1 §9(1) VERBATIM (two radii, the 7-cause
 *       ladder in the census's own order, the last-toucher + this-tick's-contact exclusions).
 *   (c) the GK-loop ledger — BK-C0 §2(c), with the CORRECTED window of record (240 ticks,
 *       BK-C0 §COMMANDER CORRECTIONS item 1) and ONE declared improvement: the GK record is
 *       retired at age > 420 ticks, not > 240, so the stored gap histogram is UNCENSORED
 *       inside its own 41-bin range (BK-C0 §CORR item 2's defect, fixed).
 *   (d) the R-乙 chain faces — R-YI-STANDING-GAP-TABLE.md's §definitions VERBATIM for Q01
 *       (spell), Q05 (touches/spell), Q06 (completion), Q07 (forward share), Q14 (pressed).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BKT2_MODE (smoke|full, REQUIRED) · BKT2_N · BKT2_OUT · BKT2_CORRIDOR.
 *   ANY other `BKT2_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BKT2_MODE=full npx tsx scripts/probes/bk-t2-composition-exam.ts
 * EXIT: 0 = every gate green · 1 = a SCORED verdict is FAIL or a gate is RED (reported, never
 *       patched) · 2 = a refusal · 3 = the world/dose construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { Player, TURN_RATE } from '../../src/sim/Player';
import {
  CONTROL_MAX_HEIGHT, CONTROL_MAX_SPEED, CONTROL_RADIUS, DEFLECT_MAX_SPEED, DT,
  GK_CLAIM_HEIGHT, GK_CONTROL_MAX_SPEED, HEADER_MIN_HEIGHT, MATCH_DURATION,
  PLAYER_CORE_RADIUS, TOUCH_CONTROL_DIST,
} from '../../src/sim/constants';
import { kickMisalignment } from '../../src/sim/mechanics';
import { L3_DEFENCE_WINDOW_S } from '../../src/ai/defenceBook';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['BKT2_MODE', 'BKT2_N', 'BKT2_OUT', 'BKT2_CORRIDOR'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BKT2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('BK-T2 FATAL — refused env surface. '
    + `rogue BKT2_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BKT2_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`BK-T2 FATAL — BKT2_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.BKT2_N !== undefined ? Number(process.env.BKT2_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1 || N_ENV > 900)) {
  banner('BK-T2 FATAL — BKT2_N must be an integer in [1, 900].');
  process.exit(2);
}
const CORRIDOR_ENV = process.env.BKT2_CORRIDOR;
if (CORRIDOR_ENV !== undefined && CORRIDOR_ENV !== '0' && CORRIDOR_ENV !== '1') {
  banner('BK-T2 FATAL — BKT2_CORRIDOR must be `0` or `1`.');
  process.exit(2);
}
const OUT_ENV = process.env.BKT2_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? ['BKT2_N set'] : []),
  ...(CORRIDOR_ENV !== undefined ? ['BKT2_CORRIDOR set'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bk-t2-composition-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bk-t2-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === pathResolve(CANONICAL_OUT) || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
if (IS_PREFLIGHT && isCanonical(OUT_PATH)) {
  banner(`BK-T2 FATAL — an OVERRIDE run (${PREFLIGHT_REASONS.join(', ')}) may not write a `
    + `canonical repo path (${OUT_PATH}).`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 SMALL HELPERS                                                           */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Number(v.toFixed(d)) : (Number.isNaN(v) ? Number.NaN : v));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
/** canonical JSON for the ALLOWLIST-SCHEMA hashed body */
const canonical = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
};

/* ========================================================================== */
/* §2 TRACED CONSTANTS — anchored at their NAMED declarations (#306 item 4)   */
/* ========================================================================== */
const MATCH_SRC = readFileSync('src/sim/Match.ts', 'utf8');
const MECH_SRC = readFileSync('src/sim/mechanics.ts', 'utf8');
const CONST_SRC = readFileSync('src/sim/constants.ts', 'utf8');
const PLAYER_SRC = readFileSync('src/sim/Player.ts', 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return -1;
};
const extractNum = (src: string, re: RegExp, what: string): number => {
  const m = re.exec(src);
  if (m === null) { banner(`BK-T2 FATAL — anchored extraction failed for ${what}`); process.exit(3); }
  return Number(m![1]);
};
/** BK-T0 §LAW: the cone = round(C7_W_CAP · 60) ticks, from the NAMED C7 §LAW declaration. */
const C7_W_CAP = extractNum(MATCH_SRC, /const C7_W_CAP = ([0-9.]+);/, 'C7_W_CAP');
const C7_W_CAP_LINE = lineOf(MATCH_SRC, /const C7_W_CAP = [0-9.]+;/);
const SRC_TURN_RATE = extractNum(PLAYER_SRC, /export const TURN_RATE = ([0-9.]+);/, 'TURN_RATE');
const TURN_RATE_LINE = lineOf(PLAYER_SRC, /export const TURN_RATE = [0-9.]+;/);
const CONE_TICKS = Math.round(C7_W_CAP * 60);
const CONE_RAD = CONE_TICKS * DT * TURN_RATE;
const CONE_DEG = (CONE_RAD * 180) / Math.PI;
/** the census's own cone edge, in the `kickMisalignment` measure: (1 − cos θ)/2 */
const CONE_MISALIGN = (1 - Math.cos(CONE_RAD)) / 2;
/** the pin: the exported law must reproduce the census's 68.28°/.3149 edge */
const CONE_OK = SRC_TURN_RATE === TURN_RATE && CONE_TICKS === 11
  && Math.abs(CONE_MISALIGN - 0.3149439624) < 1e-9;
/** ⭐ Q14's own pressure switch — the substrate's constant, traced not typed. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_LINE = lineOf(CONST_SRC, /export const TOUCH_CONTROL_DIST = [\d.]+;/);
/** ⭐⭐ Q07's own ±band, EXTRACTED from the engine's own forward-pass line. */
const FORWARD_BAND_M = extractNum(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > (\d+(?:\.\d+)?)\)/,
  'the forward-pass band');
const FORWARD_BAND_LINE = lineOf(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > \d/);
/**
 * ⭐ THE NAMED performLoftedPass site's own tMax — reported, NOT the window of record (§below).
 * CANON, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
 * anchored match + line receipt — never first-occurrence" (home: BK-C0 §COMMANDER CORRECTIONS
 * item 1 — the very correction this stage inherits). The extraction is therefore SCOPED to the
 * body of `performLoftedPass` before the `loftKick(` call is matched at all, and `tMax` is
 * taken as the 7th POSITIONAL argument of `loftKick`'s own declared signature
 * (`match, p, target, tBase, tPerM, tMin, tMax, noiseMul, spin?`). Four `loftKick(` callers
 * exist (performThroughBall's dink 2.0 · performCross 1.7 · the keeper's own loft 1.5 ·
 * performLoftedPass 2.1) — the unanchored regex that took the FIRST is what #306 struck.
 */
const LOFT_FN_START = MECH_SRC.indexOf('export function performLoftedPass(');
if (LOFT_FN_START < 0) {
  banner('BK-T2 FATAL — the NAMED performLoftedPass declaration was not found.');
  process.exit(3);
}
const LOFT_FN_END = (() => {
  const next = MECH_SRC.indexOf('\nexport function ', LOFT_FN_START + 1);
  return next < 0 ? MECH_SRC.length : next;
})();
const LOFT_BODY = MECH_SRC.slice(LOFT_FN_START, LOFT_FN_END);
const LOFT_CALL = /loftKick\(\s*match,\s*[A-Za-z]+,\s*[A-Za-z]+,\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),\s*([0-9.]+),/
  .exec(LOFT_BODY);
if (LOFT_CALL === null) {
  banner('BK-T2 FATAL — the loftKick call inside performLoftedPass did not parse.');
  process.exit(3);
}
const LOFT_T_MAX_NAMED = Number(LOFT_CALL[4]);
const LOFT_NAMED_LINE = MECH_SRC.slice(0, LOFT_FN_START + LOFT_CALL.index).split('\n').length;
const CONSTANTS_OK = [C7_W_CAP, SRC_TURN_RATE, PRESSURE_R, FORWARD_BAND_M, LOFT_T_MAX_NAMED]
  .every((v) => Number.isFinite(v) && v > 0)
  && [C7_W_CAP_LINE, TURN_RATE_LINE, PRESSURE_R_LINE, FORWARD_BAND_LINE, LOFT_NAMED_LINE]
    .every((l) => l > 0);

/* ========================================================================== */
/* §3 THE DOSE SOURCES — FILE BYTES HASHED BEFORE THEY ARE PARSED             */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const BKC0_PATH = 'docs/world-model/data/bk-c0-bodyball-census.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_BYTES_SHA = sha(PC_BYTES);
const PC_DOSE: readonly (readonly number[])[] = poolPcDoseTable(
  JSON.parse(PC_BYTES) as Record<string, unknown>,
);
const PC_DOSE_EXPOSURES = sum(PC_DOSE.map((r) => sum(r)));
const L3_DOSE_LUNGES = sum(L3_DOSE.map((c) => c.lunges));

/**
 * ⭐⭐ THE BOUNCE-BACK WINDOW OF RECORD = 240 TICKS, CARRIED FROM THE COMMITTED BK-C0 ARTIFACT.
 * BK-C0 §COMMANDER CORRECTIONS item 1 struck the pre-registration's "2 × 2.1 s = 252": what
 * RAN was `definitions.bounceBackWindowTicks = 240`. This stage reads that number OFF THE
 * COMMITTED ARTIFACT (bytes hashed first) rather than re-deriving it, so the GK headline is
 * commensurable with the census by construction. The NAMED performLoftedPass tMax
 * (mechanics.ts:LOFT_NAMED_LINE) is extracted and PUBLISHED beside it as the alternative
 * window, and the full gap histogram is stored so any window re-derives off disk.
 */
const BKC0_BYTES = readFileSync(BKC0_PATH, 'utf8');
const BKC0_BYTES_SHA = sha(BKC0_BYTES);
const BKC0_DEFS = (JSON.parse(BKC0_BYTES) as { definitions?: Record<string, unknown> }).definitions
  ?? {};
const BOUNCE_WINDOW_TICKS = Number(BKC0_DEFS.bounceBackWindowTicks);
const BOUNCE_WINDOW_ALT_TICKS = Math.round((2 * LOFT_T_MAX_NAMED) / DT);
/** ⭐ THE TURNOVER WINDOW, DERIVED: the engine's own arrival law (defenceBook.ts). */
const TURNOVER_WINDOW_TICKS = Math.round(L3_DEFENCE_WINDOW_S / DT);
/**
 * ⭐ THE ONE DECLARED IMPROVEMENT over BK-C0's instrument: the GK record is retired at
 * age > GK_RETIRE_TICKS, not at the bounce window, so the 41×10-tick histogram is UNCENSORED
 * inside its own range — BK-C0 §COMMANDER CORRECTIONS item 2's defect, fixed. The 240-tick
 * headline is unaffected (it is a within-240 rate either way).
 */
const GK_RETIRE_TICKS = 420;
const WINDOWS_OK = BOUNCE_WINDOW_TICKS === 240 && TURNOVER_WINDOW_TICKS > 0;

/* ========================================================================== */
/* §4 THE PRE-REGISTERED DEFINITIONS (BK-C0 §2 VERBATIM IN DEFINITION)        */
/* ========================================================================== */
const TIER_EDGES = [(1 - Math.SQRT1_2) / 2, 0.5, (1 + Math.SQRT1_2) / 2] as const;
const TIERS = ['aligned', 'across', 'reversed', 'blind'] as const;
const tierOf = (misalign: number): number => (misalign < TIER_EDGES[0] ? 0
  : misalign < TIER_EDGES[1] ? 1 : misalign < TIER_EDGES[2] ? 2 : 3);
const MIS_BINS = 20;
const misBinOf = (m: number): number => Math.min(MIS_BINS - 1, Math.max(0, Math.floor(m * MIS_BINS)));

const CLASSES = ['shot', 'headerShot', 'shortPass', 'loftedPass', 'throughBall', 'cross',
  'cutback', 'keeperThrow', 'clearance', 'headerClearance', 'headerKnockdown', 'other'] as const;
const HEADER_CLASSES = ['headerShot', 'headerClearance', 'headerKnockdown'] as const;
type Klass = (typeof CLASSES)[number];
const K = Object.fromEntries(CLASSES.map((c, i) => [c, i])) as Record<Klass, number>;
const HEADER_IDX = HEADER_CLASSES.map((c) => K[c]);
/**
 * ⭐ THE TWO WIND-UP CHANNELS the facing law extends (BK-T0 §6 IN-SCOPE map): the `shot`
 * class (armPendingKick) and the `shortPass` class (armPendingPass). EVERY OTHER CLASS is
 * BK-T0's own NAMED-OUT family and is therefore a lawful beyond-cone channel.
 */
const IN_SCOPE_CLASSES: readonly Klass[] = ['shot', 'shortPass'];
const IN_SCOPE_IDX = IN_SCOPE_CLASSES.map((c) => K[c]);

const CAUSES = [
  'aboveGkClaim', 'deadBand', 'aerialBand', 'cooldownInvisible', 'stunned',
  'speedAboveControl', 'rollOrClaimOrder',
] as const;
type Cause = (typeof CAUSES)[number];
const C = Object.fromEntries(CAUSES.map((c, i) => [c, i])) as Record<Cause, number>;
const TRIVIAL_TRAP_SPEED = 6;

const GK_CHANNELS = ['punt', 'throwOut', 'gkShortPass', 'gkClearance', 'gkOther'] as const;
type GkChannel = (typeof GK_CHANNELS)[number];
const G = Object.fromEntries(GK_CHANNELS.map((c, i) => [c, i])) as Record<GkChannel, number>;
const LAND = ['ownGround', 'ownAerial', 'oppGround', 'oppAerial', 'outOfPlay', 'none'] as const;
const LA = Object.fromEntries(LAND.map((c, i) => [c, i])) as Record<string, number>;
const GAP_BINS = 41;
const GAP_BIN_TICKS = 10;
const gapBinOf = (t: number): number => Math.min(GAP_BINS - 1, Math.floor(t / GAP_BIN_TICKS));

/** the added-ticks histogram: the law's structural range [0, 18] (= 29 − 11), one bin each */
const ADD_BINS = 19;
const addBinOf = (t: number): number => Math.min(ADD_BINS - 1, Math.max(0, t));
/** observed wind-up window lengths, 0..39 ticks then an overflow bin (3..11 + up to 18 added) */
const WIN_BINS = 41;
const winBinOf = (t: number): number => Math.min(WIN_BINS - 1, Math.max(0, t));
/** the striker's speed at ARM, 0.5 m/s bins over [0, 10) + overflow — NO threshold invented */
const SPD_BINS = 21;
const spdBinOf = (v: number): number => Math.min(SPD_BINS - 1, Math.max(0, Math.floor(v * 2)));
/** crossing-episode duration histogram: 1..19 ticks then an overflow bin */
const EP_BINS = 20;
const epBinOf = (t: number): number => Math.min(EP_BINS - 1, Math.max(0, t));

/**
 * ⭐ THE BEYOND-CONE CHANNEL SPLIT (H-BK.1's "never a ban" limb), frozen:
 *   · `windupResidual`      — the release came from an OBSERVED wind-up arm (the law charged
 *                             at arm time and the body still released outside the cone: the
 *                             #307 §CORR 1 MOVING-BODY residual);
 *   · `oneTouchPassBypass`  — an in-scope class released by a body whose `firstTouchWindow`
 *                             was > 0 at the pre-step boundary and which no arm covered
 *                             (BK-T0 §4: THE DESIGNED BYPASS);
 *   · `outOfScopeFamily`    — the class is one of BK-T0 §6's NAMED-OUT families;
 *   · `unarmedInScope`      — the residual: an in-scope class, no arm, no one-touch window
 *                             (a restart taker / a synchronous fallback path).
 */
const BEYOND_CHANNELS = ['windupResidual', 'oneTouchPassBypass', 'outOfScopeFamily',
  'unarmedInScope'] as const;
type BeyondChannel = (typeof BEYOND_CHANNELS)[number];
const B = Object.fromEntries(BEYOND_CHANNELS.map((c, i) => [c, i])) as Record<BeyondChannel, number>;

/* ========================================================================== */
/* §5 THE TWO ARMS — world 8, constructed DIRECTLY with its flags (#283.2(iv)) */
/* ========================================================================== */
const ARMS = ['base', 'armed'] as const;
type Arm = (typeof ARMS)[number];
const PC_WORLD = 8 as const;
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(PC_WORLD),
    ...(arm === 'armed' ? { bkFacingLaw: true, bkContactLaw: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
/** the world-8 identity conjuncts, ASSERTED on the very match the walk measures */
const worldConjuncts = (m: Match, arm: Arm): Record<string, boolean> => {
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
    bkLawsMatchTheArm: m.bkFacingLaw === (arm === 'armed') && m.bkContactLaw === (arm === 'armed'),
  };
};

/* ========================================================================== */
/* §6 THE CORRIDOR RUNG — BU-C0's ladder, reused (REPORTED, moving denominator) */
/* ========================================================================== */
/**
 * ⚠ MOVING DENOMINATOR, DISCLOSED (PW-C0 §CORR item 2): each rung is conditioned on the one
 * above it (mates → flight-reachable → race-winning → uncut). The corridor share is a share
 * of RACE-WINNING options, and the race rung itself can move between the arms — so every rung's
 * own denominator is published beside it.
 */
interface Corridor {
  samples: number;
  mates: number; behind: number; lateral: number; ahead: number;
  flight: number; race: number; uncut: number;
  behindRace: number; behindUncut: number;
  lateralRace: number; lateralUncut: number;
  aheadRace: number; aheadUncut: number;
  oracleNulls: number; corridorCalls: number;
}
const CORRIDOR_KEYS = ['samples', 'mates', 'behind', 'lateral', 'ahead', 'flight', 'race',
  'uncut', 'behindRace', 'behindUncut', 'lateralRace', 'lateralUncut', 'aheadRace',
  'aheadUncut', 'oracleNulls', 'corridorCalls'] as const;
const EMPTY_CORRIDOR = (): Corridor => Object.fromEntries(
  CORRIDOR_KEYS.map((k) => [k, 0]),
) as unknown as Corridor;
const addCorridor = (a: Corridor, b: Corridor): void => {
  for (const k of CORRIDOR_KEYS) a[k] += b[k];
};
const corridorAt = (m: Match, carrier: Player): Corridor => {
  const out = EMPTY_CORRIDOR();
  out.samples = 1;
  const t = m.teams[carrier.side];
  const opp = m.teams[(1 - carrier.side) as Side];
  const truth = capturePerceptionTruth(m);
  const snapshot = oraclePerceptionSnapshot(truth, carrier.gid);
  const profiles = m.reachProfiles();
  const ballLocalX = t.localX(m.ball.pos.x);
  for (const mate of t.players) {
    if (mate === carrier || mate.sentOff) continue;
    out.mates += 1;
    const delta = t.localX(mate.pos.x) - ballLocalX;
    const isBehind = delta <= -FORWARD_BAND_M;
    const isAhead = delta >= FORWARD_BAND_M;
    if (isBehind) out.behind += 1; else if (isAhead) out.ahead += 1; else out.lateral += 1;
    const res = evaluatePassAffordance({
      snapshot, passerGid: carrier.gid, targetGid: mate.gid,
      attackDir: t.attackDir, reachProfiles: profiles,
    });
    if (res === null) { out.oracleNulls += 1; continue; }
    if (!res.flight.reachable) continue;
    out.flight += 1;
    if (res.affordance.arrivalMargin <= 0) continue;
    out.race += 1;
    if (isBehind) out.behindRace += 1; else if (isAhead) out.aheadRace += 1;
    else out.lateralRace += 1;
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
    out.uncut += 1;
    if (isBehind) out.behindUncut += 1; else if (isAhead) out.aheadUncut += 1;
    else out.lateralUncut += 1;
  }
  return out;
};

/* ========================================================================== */
/* §7 THE PER-SEED ROW (per-seed cells — canon, home ruling #282.2(ii))        */
/* ========================================================================== */
interface Row {
  seed: number; arm: Arm; worldOk: boolean;
  /* clock */
  ticks: number; playingTicks: number; simSeconds: number;
  /* (a) release facing */
  releases: number;
  relByClass: number[];
  relMisSum: number[];
  relMisBins: number[][];              // class × 20 bins  (the stored bins)
  relByClassTier: number[][];          // class × 4 tiers
  relOutsideCone: number[];            // class → releases with misalign > CONE_MISALIGN
  beyondByChannel: number[];           // BEYOND_CHANNELS cells (outside-cone only)
  unattributedReleases: number;
  multiSignatureTicks: number;
  /* the ARM ledger (both slots), and the APPLIED time */
  armsObserved: number; armsApplied: number; armsCancelled: number;
  /** ⭐ ARM-TIME totals over EVERY observed arm — the independent re-implementation of the law,
   *  which must equal the ENGINE's own `bkFacingLedger` exactly on the armed arm (gLawReproduced). */
  observedChargedArms: number; observedAddedTicks: number; observedMaxAddedTicks: number;
  appliedWindowTicks: number;          // Σ (readyTick − armTick) over APPLIED arms
  appliedWindowBins: number[];
  appliedAddedTicks: number;           // Σ law-derived added ticks over APPLIED arms
  appliedAddedArms: number;            // APPLIED arms whose added ticks > 0
  appliedAddedBins: number[];
  maxAppliedAddedTicks: number;
  /** ⭐ NAMED OBSERVATION (#307 §CORR 2): the ONE-TOUCH SHOT tax */
  oneTouchShotArms: number; oneTouchShotArmsCharged: number; oneTouchShotAddedTicks: number;
  /** ⭐ NAMED OBSERVATION (#307 §CORR 1): the MOVING-BODY residual — speed at arm, binned */
  armSpeedBins: number[];
  outsideConeFromArmSpeedBins: number[];
  outsideConeFromArm: number;
  /* the engine's own BK ledgers */
  ledFacingArmsSeen: number; ledFacingArmsExtended: number;
  ledFacingExtraTicks: number; ledFacingMaxExtra: number;
  ledStrikesApplied: number; ledStrikeClaims: number;
  ledPartitionGroundTicks: number; ledMaxStrikeSpeed: number;
  ledStrikesOutsidePlaying: number; ledStrikesFollowedByOwnership: number;
  /* (b) through-body */
  reachBodyTicks: number; coreBodyTicks: number;
  reachCauseTicks: number[]; coreCauseTicks: number[];
  reachEpisodes: number; coreEpisodes: number;
  reachEpisodeBins: number[]; coreEpisodeBins: number[];
  deadBandBallTicks: number; deadBandBallTicksWithBody: number;
  cooldownInvisibleBodyTicks: number; cooldownInvisibleEpisodes: number;
  /* (c) the GK loop */
  gkReleases: number;
  gkByChannel: number[];
  gkLandByChannel: number[][];
  gkBounceBacks: number; gkBounceBackWithin: number; gkBounceBackBins: number[];
  gkShortCompleted: number; gkShortTurnovers: number; gkShortTurnoverWithin: number;
  gkShortTurnoverBins: number[];
  /* (d) the R-乙 chain faces + direction mix + equilibrium */
  openSpells: number; openSpellTickSum: number; openSpellTouchSum: number;
  openFirstReceptions: number; openFirstReceptionsPressed: number;
  enginePasses: number; enginePassesCompleted: number; enginePassesForward: number;
  goals: number; shots: number; crosses: number; headersWon: number;
  longBalls: number; cutbacks: number;
  /* the corridor rung (REPORTED) */
  corridor: Corridor;
}
const emptyRow = (seed: number, arm: Arm): Row => ({
  seed, arm, worldOk: false,
  ticks: 0, playingTicks: 0, simSeconds: 0,
  releases: 0,
  relByClass: zeros(CLASSES.length),
  relMisSum: zeros(CLASSES.length),
  relMisBins: zeros2(CLASSES.length, MIS_BINS),
  relByClassTier: zeros2(CLASSES.length, TIERS.length),
  relOutsideCone: zeros(CLASSES.length),
  beyondByChannel: zeros(BEYOND_CHANNELS.length),
  unattributedReleases: 0, multiSignatureTicks: 0,
  armsObserved: 0, armsApplied: 0, armsCancelled: 0,
  observedChargedArms: 0, observedAddedTicks: 0, observedMaxAddedTicks: 0,
  appliedWindowTicks: 0, appliedWindowBins: zeros(WIN_BINS),
  appliedAddedTicks: 0, appliedAddedArms: 0, appliedAddedBins: zeros(ADD_BINS),
  maxAppliedAddedTicks: 0,
  oneTouchShotArms: 0, oneTouchShotArmsCharged: 0, oneTouchShotAddedTicks: 0,
  armSpeedBins: zeros(SPD_BINS), outsideConeFromArmSpeedBins: zeros(SPD_BINS),
  outsideConeFromArm: 0,
  ledFacingArmsSeen: 0, ledFacingArmsExtended: 0, ledFacingExtraTicks: 0, ledFacingMaxExtra: 0,
  ledStrikesApplied: 0, ledStrikeClaims: 0, ledPartitionGroundTicks: 0, ledMaxStrikeSpeed: 0,
  ledStrikesOutsidePlaying: 0, ledStrikesFollowedByOwnership: 0,
  reachBodyTicks: 0, coreBodyTicks: 0,
  reachCauseTicks: zeros(CAUSES.length), coreCauseTicks: zeros(CAUSES.length),
  reachEpisodes: 0, coreEpisodes: 0,
  reachEpisodeBins: zeros(EP_BINS), coreEpisodeBins: zeros(EP_BINS),
  deadBandBallTicks: 0, deadBandBallTicksWithBody: 0,
  cooldownInvisibleBodyTicks: 0, cooldownInvisibleEpisodes: 0,
  gkReleases: 0, gkByChannel: zeros(GK_CHANNELS.length),
  gkLandByChannel: zeros2(GK_CHANNELS.length, LAND.length),
  gkBounceBacks: 0, gkBounceBackWithin: 0, gkBounceBackBins: zeros(GAP_BINS),
  gkShortCompleted: 0, gkShortTurnovers: 0, gkShortTurnoverWithin: 0,
  gkShortTurnoverBins: zeros(GAP_BINS),
  openSpells: 0, openSpellTickSum: 0, openSpellTouchSum: 0,
  openFirstReceptions: 0, openFirstReceptionsPressed: 0,
  enginePasses: 0, enginePassesCompleted: 0, enginePassesForward: 0,
  goals: 0, shots: 0, crosses: 0, headersWon: 0, longBalls: 0, cutbacks: 0,
  corridor: EMPTY_CORRIDOR(),
});

/* ========================================================================== */
/* §8 THE WALK — one match, pure reads of public engine state                  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'longBalls', 'crosses', 'throughBalls', 'cutbacks', 'clearances',
  'shots', 'headersWon'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface OpenGk {
  tick: number; gid: number; side: Side; channel: GkChannel;
  landed: boolean; firstTeammateTouchTick: number | null;
  resolvedBounce: boolean; resolvedTurnover: boolean;
}
interface OpenArm {
  gid: number; armTick: number; readyTick: number; added: number;
  oneTouch: boolean; speed: number; isShot: boolean;
}
interface Spell {
  team: Side; startTick: number; endTick: number; touches: number;
  origin: 'openPlay' | 'kickoff' | 'restart';
}

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Infinity;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
    if (d < best) best = d;
  }
  return best;
};

const walk = (seed: number, arm: Arm, withCorridor: boolean): Row => {
  const m = buildMatch(seed, arm);
  const row = emptyRow(seed, arm);
  row.worldOk = Object.values(worldConjuncts(m, arm)).every(Boolean);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: { gid: number; readyTick: number; aim: { x: number; y: number } } | null;
    pendingKick: { gid: number; readyTick: number; aim: { x: number; y: number } } | null;
  };
  const players = m.allPlayers;
  const N = players.length;

  /* ---- the pre-step snapshot: exactly the state a kick/arm fired this step reads ---- */
  const preHx = new Float64Array(N);
  const preHy = new Float64Array(N);
  const prePx = new Float64Array(N);
  const prePy = new Float64Array(N);
  const preSpeed = new Float64Array(N);
  const preFtw = new Float64Array(N);
  const preGkDist = new Array<boolean>(N).fill(false);
  const snapBodies = (): void => {
    for (let i = 0; i < N; i++) {
      const p = players[i];
      preHx[i] = p.heading.x; preHy[i] = p.heading.y;
      prePx[i] = p.pos.x; prePy[i] = p.pos.y;
      preSpeed[i] = Math.hypot(p.vel.x, p.vel.y);
      preFtw[i] = p.firstTouchWindow;
      preGkDist[i] = p.gkDistributing;
    }
  };
  snapBodies();

  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevWindupKey = '';
  let prevKickKey = '';
  let prevStrikes = 0;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];

  const openGk: OpenGk[] = [];
  const openReach = new Map<number, number>();
  const openCore = new Map<number, number>();
  const openCool = new Map<number, number>();
  /** arms that RESOLVED this tick, keyed by gid — the release's own arm record */
  const armAppliedAt = new Map<number, OpenArm>();
  let liveWindup: OpenArm | null = null;
  let liveKick: OpenArm | null = null;

  const closeEpisode = (map: Map<number, number>, gid: number, tick: number,
    bins: number[], which: 'reach' | 'core' | 'cool'): void => {
    const start = map.get(gid);
    if (start === undefined) return;
    map.delete(gid);
    const len = tick - start;
    if (which === 'reach') { row.reachEpisodes++; bins[epBinOf(len)]++; }
    else if (which === 'core') { row.coreEpisodes++; bins[epBinOf(len)]++; }
    else row.cooldownInvisibleEpisodes++;
  };
  const noteArmTime = (added: number): void => {
    row.observedAddedTicks += added;
    if (added > 0) row.observedChargedArms += 1;
    if (added > row.observedMaxAddedTicks) row.observedMaxAddedTicks = added;
  };
  /** THE LAW, re-derived probe-side from the shipped constants (BK-T0 §1). */
  const lawAddedTicks = (gid: number, aimX: number, aimY: number): number => {
    const dx = aimX - prePx[gid];
    const dy = aimY - prePy[gid];
    const d = Math.hypot(dx, dy);
    if (d < 1e-6) return 0;
    const dot = Math.min(1, Math.max(-1, preHx[gid] * (dx / d) + preHy[gid] * (dy / d)));
    const theta = Math.acos(dot);
    return Math.max(0, Math.ceil(theta / (TURN_RATE * DT)) - CONE_TICKS);
  };
  const closeArm = (a: OpenArm, tick: number): void => {
    if (tick >= a.readyTick) {
      row.armsApplied += 1;
      const win = a.readyTick - a.armTick;
      row.appliedWindowTicks += win;
      row.appliedWindowBins[winBinOf(win)] += 1;
      row.appliedAddedTicks += a.added;
      row.appliedAddedBins[addBinOf(a.added)] += 1;
      if (a.added > 0) row.appliedAddedArms += 1;
      if (a.added > row.maxAppliedAddedTicks) row.maxAppliedAddedTicks = a.added;
      if (a.isShot && a.oneTouch) {
        row.oneTouchShotArms += 1;
        if (a.added > 0) { row.oneTouchShotArmsCharged += 1; row.oneTouchShotAddedTicks += a.added; }
      }
      row.armSpeedBins[spdBinOf(a.speed)] += 1;
      armAppliedAt.set(a.gid, a);
    } else row.armsCancelled += 1;
  };

  /* ---- the R-乙 spell walker (#173 semantics, R-乙 Q01/Q05 VERBATIM) ---- */
  const spells: Spell[] = [];
  let cur: Spell | null = null;
  const finish = (s: Spell, tick: number): void => { s.endTick = tick; spells.push(s); };

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
    armAppliedAt.clear();

    /* ---------------- stat deltas, per side ---------------- */
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ============ THE ARM LEDGER (both wind-up slots), at the step boundary ============ */
    const wu = mm.pendingPassWindup;
    const wuKey = wu === null ? '' : `${wu.gid}:${wu.readyTick}`;
    if (wuKey !== prevWindupKey) {
      if (liveWindup !== null) closeArm(liveWindup, tick);
      liveWindup = null;
      if (wu !== null) {
        const added = lawAddedTicks(wu.gid, wu.aim.x, wu.aim.y);
        row.armsObserved += 1;
        noteArmTime(added);
        liveWindup = {
          gid: wu.gid, armTick: tick, readyTick: wu.readyTick, added,
          oneTouch: preFtw[wu.gid] > 0, speed: preSpeed[wu.gid], isShot: false,
        };
      }
    }
    prevWindupKey = wuKey;
    const pk = mm.pendingKick;
    const pkKey = pk === null ? '' : `${pk.gid}:${pk.readyTick}`;
    if (pkKey !== prevKickKey) {
      if (liveKick !== null) closeArm(liveKick, tick);
      liveKick = null;
      if (pk !== null) {
        const added = lawAddedTicks(pk.gid, pk.aim.x, pk.aim.y);
        row.armsObserved += 1;
        noteArmTime(added);
        liveKick = {
          gid: pk.gid, armTick: tick, readyTick: pk.readyTick, added,
          oneTouch: preFtw[pk.gid] > 0, speed: preSpeed[pk.gid], isShot: true,
        };
      }
    }
    prevKickKey = pkKey;

    /* ============ (a) RELEASE DETECTION — BK-C0 §2(a) VERBATIM IN DEFINITION ============ */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    const releasesThisTick: { gid: number; klass: Klass }[] = [];
    const kickLive = playing || m.phase === 'restart';
    if (kickLive) {
      for (const side of [0, 1] as const) {
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
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) { row.unattributedReleases++; continue; }
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releasesThisTick.push({ gid, klass });
      }
    }

    const hSpeed = Math.hypot(ball.vel.x, ball.vel.y);
    const spinRot = Math.abs(ball.spin) * DT;
    for (const rel of releasesThisTick) {
      const gid = rel.gid;
      if (hSpeed < 1e-6) { row.unattributedReleases++; continue; }
      const p = players[gid];
      const klass: Klass = rel.klass;
      const cs = Math.cos(-spinRot * Math.sign(ball.spin || 0));
      const sn = Math.sin(-spinRot * Math.sign(ball.spin || 0));
      const dx0 = ball.vel.x / hSpeed;
      const dy0 = ball.vel.y / hSpeed;
      const dx = dx0 * cs - dy0 * sn;
      const dy = dx0 * sn + dy0 * cs;
      const misalign = Math.min(1, Math.max(0, (1 - (preHx[gid] * dx + preHy[gid] * dy)) / 2));
      const ki = K[klass];
      if (!playing) {
        // OPEN PLAY ONLY, declared (BK-C0 §2(a)): a dead-ball release resolves through the
        // restart machinery. Restart releases are counted nowhere but the honesty counters.
        continue;
      }
      row.releases++;
      row.relByClass[ki]++;
      row.relMisSum[ki] += misalign;
      row.relMisBins[ki][misBinOf(misalign)]++;
      row.relByClassTier[ki][tierOf(misalign)]++;
      if (misalign > CONE_MISALIGN) {
        row.relOutsideCone[ki]++;
        const armRec = armAppliedAt.get(gid);
        const inScope = IN_SCOPE_IDX.includes(ki);
        let ch: BeyondChannel;
        if (armRec !== undefined) {
          ch = 'windupResidual';
          row.outsideConeFromArm += 1;
          row.outsideConeFromArmSpeedBins[spdBinOf(armRec.speed)] += 1;
        } else if (inScope && preFtw[gid] > 0) ch = 'oneTouchPassBypass';
        else if (!inScope) ch = 'outOfScopeFamily';
        else ch = 'unarmedInScope';
        row.beyondByChannel[B[ch]] += 1;
      }
      /* ---- the GK-loop ledger's own opening (BK-C0 §2(c)) ---- */
      if (p.role === 'GK') {
        const channel: GkChannel = klass === 'loftedPass' && preGkDist[gid] ? 'punt'
          : klass === 'keeperThrow' ? 'throwOut'
            : klass === 'clearance' ? 'gkClearance'
              : (klass === 'shortPass' || klass === 'throughBall') ? 'gkShortPass' : 'gkOther';
        row.gkReleases++;
        row.gkByChannel[G[channel]]++;
        openGk.push({
          tick, gid, side: p.side as Side, channel, landed: false,
          firstTeammateTouchTick: null, resolvedBounce: false, resolvedTurnover: false,
        });
      }
    }

    /* ================= (c) THE GK LOOP ================= */
    const ballIsLive = playing || m.phase === 'restart';
    for (let i = openGk.length - 1; i >= 0; i--) {
      const g = openGk[i];
      if (g.tick === tick) continue;
      const age = tick - g.tick;
      if (!g.landed) {
        if (contactGid !== null && contactGid !== g.gid) {
          const aerial = ball.z >= HEADER_MIN_HEIGHT;
          const own = players[contactGid].side === g.side;
          const cell = own ? (aerial ? LA.ownAerial : LA.ownGround)
            : (aerial ? LA.oppAerial : LA.oppGround);
          g.landed = true;
          row.gkLandByChannel[G[g.channel]][cell]++;
          if (own) {
            g.firstTeammateTouchTick = tick;
            if (g.channel === 'throwOut' || g.channel === 'gkShortPass') row.gkShortCompleted++;
          }
        } else if (!ballIsLive) {
          g.landed = true;
          row.gkLandByChannel[G[g.channel]][LA.outOfPlay]++;
        }
      }
      if (!g.resolvedBounce && ownerGid === g.gid && ownerGid !== prevOwnerGid) {
        g.resolvedBounce = true;
        row.gkBounceBacks++;
        row.gkBounceBackBins[gapBinOf(age)]++;
        if (age <= BOUNCE_WINDOW_TICKS) row.gkBounceBackWithin++;
      }
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
      // ⭐ the DECLARED IMPROVEMENT: retire late, so the stored histogram is UNCENSORED
      if ((g.landed || !ballIsLive) && age > GK_RETIRE_TICKS) openGk.splice(i, 1);
    }

    /* ================= (b) THE THROUGH-BODY SWEEP ================= */
    const inDeadBand = ball.z > CONTROL_MAX_HEIGHT && ball.z < HEADER_MIN_HEIGHT;
    let anyBodyInReach = false;
    if (playing && ball.owner === null) {
      for (let i = 0; i < N; i++) {
        const p = players[i];
        if (p.sentOff) continue;
        const dxp = p.pos.x - ball.pos.x;
        const dyp = p.pos.y - ball.pos.y;
        const dd = Math.hypot(dxp, dyp);
        if (dd < CONTROL_RADIUS) anyBodyInReach = true;
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
          if (!openReach.has(p.gid)) openReach.set(p.gid, tick);
          if (core) {
            row.coreBodyTicks++;
            row.coreCauseTicks[cause]++;
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

    /* ============ the seam LIFECYCLE / SUPERPOWER reads (ledger deltas) ============ */
    const strikes = m.bkContactLedger.strikesApplied;
    if (strikes > prevStrikes) {
      const delta = strikes - prevStrikes;
      if (!playing) row.ledStrikesOutsidePlaying += delta;
      if (ownerGid !== null && ownerGid === lastTouchGid) {
        row.ledStrikesFollowedByOwnership += delta;
      }
      prevStrikes = strikes;
    }

    /* ============ (d) THE R-乙 SPELL WALKER (Q01/Q05/Q14 VERBATIM) ============ */
    if (!playing) {
      if (cur !== null) { finish(cur, tick); cur = null; }
      prevOwnerGid = ownerGid;
      prevLastTouchGid = lastTouchGid;
      prevPendingPassT = passT;
      snapBodies();
      continue;
    }
    if (ownerGid !== null) {
      const owner = players[ownerGid];
      const side = owner.side as Side;
      if (cur !== null && cur.team !== side) { finish(cur, tick); cur = null; }
      if (cur === null) {
        const origin: Spell['origin'] = m.kickoffKickGid === ownerGid ? 'kickoff'
          : m.restartKickGid === ownerGid ? 'restart' : 'openPlay';
        cur = { team: side, startTick: tick, endTick: tick, touches: 0, origin };
      }
      if (ownerGid !== prevOwnerGid) {
        cur.touches += 1;
        // ⭐ Q14 VERBATIM: the FIRST reception of each openPlay-origin spell, pressed iff the
        // nearest-opponent distance at the reception tick is ≤ TOUCH_CONTROL_DIST.
        if (cur.origin === 'openPlay' && cur.touches === 1) {
          row.openFirstReceptions += 1;
          if (nearestOpponent(m, owner) <= PRESSURE_R) row.openFirstReceptionsPressed += 1;
        }
        if (withCorridor && cur.origin === 'openPlay') addCorridor(row.corridor, corridorAt(m, owner));
      }
    }

    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
    snapBodies();
  }
  if (cur !== null) finish(cur, m.simTick);
  for (const gid of [...openReach.keys()]) {
    closeEpisode(openReach, gid, m.simTick, row.reachEpisodeBins, 'reach');
  }
  for (const gid of [...openCore.keys()]) {
    closeEpisode(openCore, gid, m.simTick, row.coreEpisodeBins, 'core');
  }
  for (const gid of [...openCool.keys()]) {
    closeEpisode(openCool, gid, m.simTick, row.reachEpisodeBins, 'cool');
  }
  for (const g of openGk) if (!g.landed) row.gkLandByChannel[G[g.channel]][LA.none]++;

  const open = spells.filter((s) => s.origin === 'openPlay');
  row.openSpells = open.length;
  row.openSpellTickSum = sum(open.map((s) => s.endTick - s.startTick));
  row.openSpellTouchSum = sum(open.map((s) => s.touches));

  const lf = m.bkFacingLedger;
  row.ledFacingArmsSeen = lf.armsSeen;
  row.ledFacingArmsExtended = lf.armsExtended;
  row.ledFacingExtraTicks = lf.extraTicksTotal;
  row.ledFacingMaxExtra = lf.maxExtraTicks;
  const lc = m.bkContactLedger;
  row.ledStrikesApplied = lc.strikesApplied;
  row.ledStrikeClaims = lc.strikeClaimsCooldown + lc.strikeClaimsStunned;
  row.ledPartitionGroundTicks = lc.partitionGroundTicks;
  row.ledMaxStrikeSpeed = lc.maxStrikeRelativeSpeed;

  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  row.enginePassesForward = m.teams[0].stats.passesForward + m.teams[1].stats.passesForward;
  row.goals = m.score[0] + m.score[1];
  row.shots = m.teams[0].stats.shots + m.teams[1].stats.shots;
  row.crosses = m.teams[0].stats.crosses + m.teams[1].stats.crosses;
  row.headersWon = m.teams[0].stats.headersWon + m.teams[1].stats.headersWon;
  row.longBalls = m.teams[0].stats.longBalls + m.teams[1].stats.longBalls;
  row.cutbacks = m.teams[0].stats.cutbacks + m.teams[1].stats.cutbacks;
  row.simSeconds = row.ticks * DT;
  return row;
};

/* ========================================================================== */
/* §9 THE WORLD-CONSTRUCTION RECEIPT (its own booked seed, xxx,999)           */
/* ========================================================================== */
const BLOCK = 12_504_000;
const RECEIPT_SEED = BLOCK + 999;
const receiptMatch = buildMatch(RECEIPT_SEED, 'base');
const RECEIPT = worldConjuncts(receiptMatch, 'base');
const RECEIPT_OK = Object.values(RECEIPT).every(Boolean);
/** the misalign-formula identity: the probe's arithmetic IS `kickMisalignment` */
const formulaProbe = receiptMatch.allPlayers[0] as Player;
const FORMULA_OK = ([[1, 0], [0, 1], [-1, 0], [Math.SQRT1_2, Math.SQRT1_2], [-0.6, 0.8]] as const)
  .every(([dx, dy]) => {
    const mine = (1 - (formulaProbe.heading.x * dx + formulaProbe.heading.y * dy)) / 2;
    return Math.abs(mine - kickMisalignment(formulaProbe, { x: dx, y: dy })) < 1e-12;
  });
if (!RECEIPT_OK || !FORMULA_OK || !CONSTANTS_OK || !CONE_OK || !WINDOWS_OK) {
  banner(`BK-T2 FATAL — the world/dose/constant class BIT. receipt=${JSON.stringify(RECEIPT)} `
    + `formula=${FORMULA_OK} constants=${CONSTANTS_OK} cone=${CONE_OK} windows=${WINDOWS_OK}. `
    + 'Nothing is written.');
  process.exit(3);
}

/* ========================================================================== */
/* §10 THE BATTERY — PAIRED, virgin seeds                                     */
/* ========================================================================== */
/**
 * ⭐ THE SIZE, WITH ITS REASON — THE RAREST SCORED CELL GOVERNS. The scored cells are:
 * the outside-cone share at release (≈ 106 releases/match — saturated at any N), the applied
 * added-ticks distribution (≈ 26 arms/match), the cooldown-invisibility class (≈ 93 core
 * body-ticks/match) and — the RAREST — the dead-band cause cell at the LAWFUL REACH radius,
 * which BK-C0 measured at 328 body-ticks over 500 matches = 0.656/match. N = 400 paired seeds
 * puts ≈ 260 base-arm events under that cell, which is the grain a paired cluster bootstrap
 * needs to separate it from zero; it also puts ≈ 320 punts under the GK landing table
 * (7.6 % of 10.58 GK releases/match, BK-C0 §R3), the thinnest REPORTED cell. Wall is not the
 * binding constraint: the pre-freeze sizing smoke measured 0.19 s per walk on this machine
 * (3 paired seeds + the receipt = 7 walks in 1.3 s), so 801 walks costs ≈ 2.6 min against a
 * 60 min ceiling. The battery's own measurement is published in `battery.wallSeconds`.
 */
const N_BY_MODE: Record<Mode, number> = { smoke: 3, full: 400 };
const N_SEEDS = N_ENV ?? N_BY_MODE[MODE];
const WITH_CORRIDOR = CORRIDOR_ENV !== '0';
const SEEDS = Array.from({ length: N_SEEDS }, (_, i) => BLOCK + i);
const rows: Row[] = [];
let walksBooked = 1; // the world receipt above
banner(`BK-T2 exam: mode=${MODE} N=${N_SEEDS} corridor=${WITH_CORRIDOR ? 'on' : 'off'} block=${BLOCK}`);
for (const seed of SEEDS) {
  for (const arm of ARMS) {
    rows.push(walk(seed, arm, WITH_CORRIDOR));
    walksBooked++;
  }
  if (rows.length % 20 === 0) {
    banner(`  … ${rows.length / 2}/${N_SEEDS} paired seeds `
      + `(${((Date.now() - t0Wall) / 1000).toFixed(0)} s)`);
  }
}
const rowsOf = (arm: Arm): Row[] => rows.filter((r) => r.arm === arm);

/* ========================================================================== */
/* §11 THE FACE TABLE — every published face is (numerator, denominator)       */
/* ========================================================================== */
interface FaceDef {
  num: (r: Row) => number;
  den: (r: Row) => number;
  unit: string;
  what: string;
  /** the denominator's own honesty note, where it moves between the arms */
  denNote?: string;
}
const perMatch = (): number => 1;
const facingPriced = (r: Row): number => sum(r.relByClass) - sum(HEADER_IDX.map((i) => r.relByClass[i]));
const facingPricedOutside = (r: Row): number => sum(r.relOutsideCone)
  - sum(HEADER_IDX.map((i) => r.relOutsideCone[i]));

const FACES: Record<string, FaceDef> = {
  /* ---------------- H-BK.1 (SCORED) ---------------- */
  outsideConeShareAtRelease: {
    num: facingPricedOutside, den: facingPriced,
    unit: 'share of facing-priced open-play releases',
    what: '⭐⭐ H-BK.1 (a) SCORED — releases leaving the boot OUTSIDE the strike cone '
      + `(misalign > ${round(CONE_MISALIGN, 7)} = the census's own 68.28° edge)`,
    denNote: '⚠ MOVING DENOMINATOR: the release COUNT itself can move between the arms; the '
      + 'denominator is facing-priced open-play releases (all classes but the three header '
      + 'classes, which `headBall` never facing-prices).',
  },
  outsideConeShareAllReleases: {
    num: (r) => sum(r.relOutsideCone), den: (r) => sum(r.relByClass),
    unit: 'share of ALL open-play releases',
    what: 'the same face over EVERY class incl. the headers — the wider denominator, reported',
  },
  meanMisalignAtRelease: {
    num: (r) => sum(r.relMisSum), den: (r) => sum(r.relByClass),
    unit: 'kickMisalignment (0..1)', what: 'mean misalign at release, all open-play classes',
  },
  meanAppliedWindupTicks: {
    num: (r) => r.appliedWindowTicks, den: (r) => r.armsApplied,
    unit: 'TICKS per APPLIED wind-up arm',
    what: '⭐⭐ H-BK.1 (b) SCORED — the TIME ACTUALLY PAID: the mean length of a wind-up window '
      + 'that reached its readyTick (APPLIED, never nominal — canon clock honesty)',
    denNote: '⚠ MOVING DENOMINATOR: the number of APPLIED arms can move between the arms; the '
      + 'per-seed counts are stored so any other denominator re-derives.',
  },
  meanAppliedAddedTicksPerChargedArm: {
    num: (r) => r.appliedAddedTicks, den: (r) => r.appliedAddedArms,
    unit: 'TICKS per CHARGED applied arm',
    what: 'the added-ticks charge, over APPLIED arms that paid anything (bins stored)',
  },
  chargedShareOfAppliedArms: {
    num: (r) => r.appliedAddedArms, den: (r) => r.armsApplied,
    unit: 'share of applied arms', what: 'how often an applied arm paid facing time',
  },
  appliedAddedTicksPerMatch: {
    num: (r) => r.appliedAddedTicks, den: perMatch,
    unit: 'TICKS / match', what: 'the total facing time the world pays per match (APPLIED)',
  },
  beyondConeReleasesPerMatch: {
    num: (r) => sum(r.relOutsideCone), den: perMatch,
    unit: 'releases / match', what: '⭐ H-BK.1 (c) SCORED — beyond-cone usage, never a ban',
  },
  beyondConeViaOneTouchPassBypassPerMatch: {
    num: (r) => r.beyondByChannel[B.oneTouchPassBypass], den: perMatch,
    unit: 'releases / match', what: '⭐ H-BK.1 (c) — the LAWFUL one-touch bypass channel',
  },
  beyondConeViaOutOfScopeFamilyPerMatch: {
    num: (r) => r.beyondByChannel[B.outOfScopeFamily], den: perMatch,
    unit: 'releases / match', what: '⭐ H-BK.1 (c) — BK-T0 §6\'s NAMED-OUT families',
  },
  beyondConeViaWindupResidualPerMatch: {
    num: (r) => r.beyondByChannel[B.windupResidual], den: perMatch,
    unit: 'releases / match', what: 'the MOVING-BODY residual (#307 §CORR 1), per match',
  },
  beyondConeViaUnarmedInScopePerMatch: {
    num: (r) => r.beyondByChannel[B.unarmedInScope], den: perMatch,
    unit: 'releases / match', what: 'in-scope class, no arm, no one-touch window (the residual)',
  },
  /* ---------------- H-BK.2 (SCORED) ---------------- */
  cooldownInvisibleCoreBodyTicksPerMatch: {
    num: (r) => r.coreCauseTicks[C.cooldownInvisible], den: perMatch,
    unit: 'body-TICKS / match',
    what: '⭐⭐ H-BK.2 (a) SCORED — the COOLDOWN-INVISIBILITY class at the VISUAL core radius '
      + '(the picture the user complained about)',
  },
  deadBandCauseReachBodyTicksPerMatch: {
    num: (r) => r.reachCauseTicks[C.deadBand], den: perMatch,
    unit: 'body-TICKS / match',
    what: '⭐⭐ H-BK.2 (b) SCORED — the DEAD-BAND PASS-THROUGH class at the LAWFUL REACH radius '
      + '(BK-T1\'s own pre-registered `gDeadBandFalls` cell, reused)',
  },
  deadBandCauseCoreBodyTicksPerMatch: {
    num: (r) => r.coreCauseTicks[C.deadBand], den: perMatch,
    unit: 'body-TICKS / match', what: 'the same dead-band class at the visual core radius',
  },
  cooldownInvisibleCoreShare: {
    num: (r) => r.coreCauseTicks[C.cooldownInvisible], den: (r) => r.coreBodyTicks,
    unit: 'share of visual through-body body-ticks',
    what: 'the cooldown class as a SHARE',
    denNote: '⚠ MOVING DENOMINATOR: the visual through-body total falls hard armed, so the '
      + 'share is read beside the ABSOLUTE per-match face, never instead of it.',
  },
  visualThroughBodyBodyTicksPerMatch: {
    num: (r) => r.coreBodyTicks, den: perMatch,
    unit: 'body-TICKS / match', what: 'visual through-body: BODY-TICKS (not events)',
  },
  visualThroughBodyEpisodesPerMatch: {
    num: (r) => r.coreEpisodes, den: perMatch,
    unit: 'EPISODES / match', what: 'visual through-body: EPISODES (maximal per-body runs)',
  },
  reachCrossingBodyTicksPerMatch: {
    num: (r) => r.reachBodyTicks, den: perMatch,
    unit: 'body-TICKS / match',
    what: '⭐ NAMED OBSERVATION — reach crossings as BODY-TICKS (the unit its name claims)',
  },
  reachCrossingEpisodesPerMatch: {
    num: (r) => r.reachEpisodes, den: perMatch,
    unit: 'EPISODES / match',
    what: '⭐ NAMED OBSERVATION — reach crossings as EPISODES (BK-T1 §R2\'s honest read: a '
      + 'carom makes crossings MORE NUMEROUS and SHORTER)',
  },
  deadBandBallTicksPerMatch: {
    num: (r) => r.deadBandBallTicks, den: perMatch,
    unit: 'ball-TICKS / match', what: 'ball-ticks flown through the (1.30, 1.35) z region',
  },
  aboveGkClaimCoreShare: {
    num: (r) => r.coreCauseTicks[C.aboveGkClaim], den: (r) => r.coreBodyTicks,
    unit: 'share of visual through-body body-ticks', what: 'the residual class NAMED OUT by BK-T1 §3',
  },
  aerialBandCoreShare: {
    num: (r) => r.coreCauseTicks[C.aerialBand], den: (r) => r.coreBodyTicks,
    unit: 'share of visual through-body body-ticks', what: 'the residual class NAMED OUT by BK-T1 §3',
  },
  rollOrClaimOrderCoreShare: {
    num: (r) => r.coreCauseTicks[C.rollOrClaimOrder], den: (r) => r.coreBodyTicks,
    unit: 'share of visual through-body body-ticks', what: 'the residual class NAMED OUT by BK-T1 §3',
  },
  speedAboveControlCoreShare: {
    num: (r) => r.coreCauseTicks[C.speedAboveControl], den: (r) => r.coreBodyTicks,
    unit: 'share of visual through-body body-ticks', what: 'the residual class NAMED OUT by BK-T1 §3',
  },
  /* ---------------- H-BK.3 (REPORTED, never gated) ---------------- */
  gkReleasesPerMatch: {
    num: (r) => r.gkReleases, den: perMatch, unit: 'GK releases / match', what: 'the GK-loop ledger',
  },
  gkShortPassShare: {
    num: (r) => r.gkByChannel[G.gkShortPass], den: (r) => r.gkReleases,
    unit: 'share of GK distributions', what: 'the short-build-up channel (H-303a\'s own face)',
  },
  gkPuntShare: {
    num: (r) => r.gkByChannel[G.punt], den: (r) => r.gkReleases,
    unit: 'share of GK distributions', what: 'the punt channel',
  },
  gkClearanceShare: {
    num: (r) => r.gkByChannel[G.gkClearance], den: (r) => r.gkReleases,
    unit: 'share of GK distributions', what: 'the hoofed clearance channel',
  },
  gkThrowOutShare: {
    num: (r) => r.gkByChannel[G.throwOut], den: (r) => r.gkReleases,
    unit: 'share of GK distributions', what: 'the hand throw channel',
  },
  puntAerialFirstTouchShare: {
    num: (r) => r.gkLandByChannel[G.punt][LA.ownAerial] + r.gkLandByChannel[G.punt][LA.oppAerial],
    den: (r) => sum(r.gkLandByChannel[G.punt].slice(0, 4)),
    unit: 'share of punts with a landing first touch',
    what: '⭐ the user\'s own sentence: 打到人身上 — punts first met in the AIR',
    denNote: '⚠ MOVING DENOMINATOR: punts that went out of play or were never met are excluded '
      + 'from the denominator; their counts are stored per seed.',
  },
  puntOppFirstTouchShare: {
    num: (r) => r.gkLandByChannel[G.punt][LA.oppGround] + r.gkLandByChannel[G.punt][LA.oppAerial],
    den: (r) => sum(r.gkLandByChannel[G.punt].slice(0, 4)),
    unit: 'share of punts with a landing first touch', what: 'punts whose first touch is the opponent\'s',
  },
  gkClearanceOppFirstTouchShare: {
    num: (r) => r.gkLandByChannel[G.gkClearance][LA.oppGround]
      + r.gkLandByChannel[G.gkClearance][LA.oppAerial],
    den: (r) => sum(r.gkLandByChannel[G.gkClearance].slice(0, 4)),
    unit: 'share of clearances with a landing first touch', what: 'the hoof that concedes',
  },
  gkShortOwnGroundShare: {
    num: (r) => r.gkLandByChannel[G.gkShortPass][LA.ownGround],
    den: (r) => sum(r.gkLandByChannel[G.gkShortPass].slice(0, 4)),
    unit: 'share of short GK balls with a landing first touch',
    what: 'the short ball reaching its own side on the ground',
  },
  bounceBackWithin240PerGkRelease: {
    num: (r) => r.gkBounceBackWithin, den: (r) => r.gkReleases,
    unit: 'bounce-backs within 240 ticks / GK release',
    what: `⭐ the loop closing: the releasing keeper owns the ball again inside `
      + `${BOUNCE_WINDOW_TICKS} ticks (BK-C0 §CORR item 1's CORRECTED window of record)`,
  },
  bounceBackAnyGapPerGkRelease: {
    num: (r) => r.gkBounceBacks, den: (r) => r.gkReleases,
    unit: 'bounce-backs at ANY gap / GK release',
    what: 'the same, at any gap — the UNCENSORED read (BK-C0 §CORR item 2\'s defect, fixed here)',
  },
  shortTurnoverWithinWindowShare: {
    num: (r) => r.gkShortTurnoverWithin, den: (r) => r.gkShortCompleted,
    unit: 'share of completed short GK balls',
    what: `⭐ 瞬间被断: the opponent owns it within ${TURNOVER_WINDOW_TICKS} ticks of the `
      + 'teammate\'s first touch (the engine\'s own defender-arrival window)',
  },
  /* the R-乙 chain faces, definitions reused VERBATIM from R-YI-STANDING-GAP-TABLE.md */
  ryiQ01SpellSeconds: {
    num: (r) => r.openSpellTickSum * DT, den: (r) => r.openSpells,
    unit: 'sim-seconds per open-play spell',
    what: 'R-乙 Q01 — "how long a team keeps the ball (open-play possession spell, mean)"',
  },
  ryiQ05TouchesPerSpell: {
    num: (r) => r.openSpellTouchSum, den: (r) => r.openSpells,
    unit: 'touches per open-play spell',
    what: 'R-乙 Q05 — "how many touches a possession is made of"',
  },
  ryiQ06PassCompletion: {
    num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
    unit: 'share of passes completed',
    what: 'R-乙 Q06 — "how many passes find a team-mate" (the engine\'s OWN passive counters)',
  },
  ryiQ14PressedReceptionShare: {
    num: (r) => r.openFirstReceptionsPressed, den: (r) => r.openFirstReceptions,
    unit: 'share of open-play first receptions',
    what: 'R-乙 Q14 — "how much of the game is played under pressure", the nearest opponent '
      + `≤ TOUCH_CONTROL_DIST = ${PRESSURE_R} m at the reception tick`,
  },
  ryiQ07ForwardPassShare: {
    num: (r) => r.enginePassesForward, den: (r) => r.enginePasses,
    unit: 'share of passes forward',
    what: '⭐ THE DIRECTION MIX — R-乙 Q07 VERBATIM (the engine\'s own `passesForward`)',
  },
  /* the §2 equilibrium faces — REPORTED ONLY, nothing ships from an exam */
  goalsPerMatch: { num: (r) => r.goals, den: perMatch, unit: 'goals / match', what: '§2 equilibrium (REPORTED)' },
  crossesPerMatch: { num: (r) => r.crosses, den: perMatch, unit: 'crosses / match', what: '§2 equilibrium (REPORTED)' },
  headersPerMatch: { num: (r) => r.headersWon, den: perMatch, unit: 'headers / match', what: '§2 equilibrium (REPORTED)' },
  longBallsPerMatch: { num: (r) => r.longBalls, den: perMatch, unit: 'longBalls / match', what: '§2 equilibrium (REPORTED)' },
  cutbacksPerMatch: { num: (r) => r.cutbacks, den: perMatch, unit: 'cutbacks / match', what: '§2 equilibrium (REPORTED)' },
  shotsPerMatch: { num: (r) => r.shots, den: perMatch, unit: 'shots / match', what: 'reported beside the band' },
  releasesPerMatch: { num: (r) => sum(r.relByClass), den: perMatch, unit: 'open-play releases / match', what: 'the release denominator itself' },
  /* the corridor rung — REPORTED, moving denominators disclosed */
  corridorSurvivalOfRaceWinners: {
    num: (r) => r.corridor.uncut, den: (r) => r.corridor.race,
    unit: 'share of race-winning options',
    what: '⭐ THE CORRIDOR RUNG (BU-C0\'s ladder, reused): options that win the race AND survive '
      + 'the corridor',
    denNote: '⚠ MOVING DENOMINATOR (PW-C0 §CORR item 2): the race rung is itself conditioned on '
      + 'flight reachability and can move between the arms; every rung count is stored per seed.',
  },
  behindCorridorSurvival: {
    num: (r) => r.corridor.behindUncut, den: (r) => r.corridor.behindRace,
    unit: 'share of race-winning BEHIND options', what: 'the backward limb of the corridor rung',
  },
  lateralCorridorSurvival: {
    num: (r) => r.corridor.lateralUncut, den: (r) => r.corridor.lateralRace,
    unit: 'share of race-winning LATERAL options', what: 'the lateral limb',
  },
  aheadCorridorSurvival: {
    num: (r) => r.corridor.aheadUncut, den: (r) => r.corridor.aheadRace,
    unit: 'share of race-winning AHEAD options', what: 'the forward limb',
  },
  raceRungShareOfFlightOptions: {
    num: (r) => r.corridor.race, den: (r) => r.corridor.flight,
    unit: 'share of flight-reachable options', what: 'the rung above the corridor, published',
  },
  /* the NAMED OBSERVATIONS */
  oneTouchShotTaxShare: {
    num: (r) => r.oneTouchShotArmsCharged, den: (r) => r.oneTouchShotArms,
    unit: 'share of one-touch SHOT arms',
    what: '⭐ NAMED OBSERVATION (#307 §CORR 2): one-touch shots that pay added ticks',
  },
  oneTouchShotTaxMeanTicks: {
    num: (r) => r.oneTouchShotAddedTicks, den: (r) => r.oneTouchShotArmsCharged,
    unit: 'TICKS per charged one-touch shot arm',
    what: '⭐ NAMED OBSERVATION (#307 §CORR 2): what the one-touch shot tax costs when it bites',
  },
};
const FACE_KEYS = Object.keys(FACES);

/* ========================================================================== */
/* §12 THE ESTIMATOR — PAIRED CLUSTER BOOTSTRAP over match seeds              */
/* ========================================================================== */
/**
 * ⭐ THE STATS LATTICE (frozen): base 113,800, step ≥ 200 from every published base. ONE base
 * is drawn by this stage — one resample-index matrix draws BOTH arms, so the pairing is inside
 * every interval.
 */
const BOOTSTRAP = 2000;
const STATS_BASE = 113_800;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_200, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600,
  111_800, 112_000, 112_200, 112_400, 112_600, 112_800, 113_000, 113_200, 113_400, 113_600,
];

interface FaceRow {
  face: string; unit: string; what: string; denNote: string | null;
  base: { point: number; num: number; den: number; ci95: [number, number] };
  armed: { point: number; num: number; den: number; ci95: [number, number] };
  delta: number;
  deltaCi95: [number, number];
  halfWidth: number;
  absDeltaOverHalfWidth: number;
  relative: number;
}
const pct = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
const scoreFaces = (): FaceRow[] => {
  const baseRows = rowsOf('base');
  const armedRows = rowsOf('armed');
  const Kn = baseRows.length;
  const rng = new Rng(STATS_BASE);
  const draws: number[][] = [];
  for (let dI = 0; dI < BOOTSTRAP; dI++) {
    const idx: number[] = [];
    for (let i = 0; i < Kn; i++) idx.push(Math.floor(rng.next() * Kn) % Kn);
    draws.push(idx);
  }
  const out: FaceRow[] = [];
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nb = baseRows.map((r) => f.num(r));
    const db = baseRows.map((r) => f.den(r));
    const na = armedRows.map((r) => f.num(r));
    const da = armedRows.map((r) => f.den(r));
    const pB = ratio(sum(nb), sum(db));
    const pA = ratio(sum(na), sum(da));
    const vb: number[] = []; const va: number[] = []; const vd: number[] = [];
    for (const idx of draws) {
      let nB = 0; let dB = 0; let nA = 0; let dA = 0;
      for (const i of idx) { nB += nb[i]; dB += db[i]; nA += na[i]; dA += da[i]; }
      const rB = ratio(nB, dB); const rA = ratio(nA, dA);
      if (Number.isFinite(rB)) vb.push(rB);
      if (Number.isFinite(rA)) va.push(rA);
      if (Number.isFinite(rA) && Number.isFinite(rB)) vd.push(rA - rB);
    }
    vb.sort((x, y) => x - y); va.sort((x, y) => x - y); vd.sort((x, y) => x - y);
    const dCi: [number, number] = [pct(vd, 0.025), pct(vd, 0.975)];
    const hw = (dCi[1] - dCi[0]) / 2;
    out.push({
      face: key, unit: f.unit, what: f.what, denNote: f.denNote ?? null,
      base: { point: pB, num: sum(nb), den: sum(db), ci95: [pct(vb, 0.025), pct(vb, 0.975)] },
      armed: { point: pA, num: sum(na), den: sum(da), ci95: [pct(va, 0.025), pct(va, 0.975)] },
      delta: pA - pB,
      deltaCi95: dCi,
      halfWidth: hw,
      absDeltaOverHalfWidth: hw === 0 ? Number.NaN : Math.abs(pA - pB) / hw,
      relative: pB === 0 ? Number.NaN : (pA - pB) / pB,
    });
  }
  return out;
};
const faces = scoreFaces();
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`BK-T2 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};

/* ========================================================================== */
/* §13 THE FROZEN SUCCESS CRITERIA — decidable, and never re-cut after sight   */
/* ========================================================================== */
/**
 * H-BK.1 (contract §1 VERBATIM): "release-facing misalignment collapses toward the strike cone
 * as a DISTRIBUTION ... at an honest TIME cost, never a ban; deliberate high-misalign strikes
 * (the backheel class) survive as a priced choice with usage > 0."
 *   (a) COLLAPSE  := Δ `outsideConeShareAtRelease` has its paired 95 % CI strictly BELOW 0.
 *   (b) TIME PAID := Δ `meanAppliedWindupTicks` has its paired 95 % CI strictly ABOVE 0
 *                    AND the armed arm's APPLIED added ticks total > 0.
 *   (c) NEVER A BAN := armed beyond-cone releases > 0, AND both LAWFUL channels are non-empty
 *                    (the one-touch pass bypass > 0 AND the out-of-scope families > 0).
 * PASS := (a) ∧ (b) ∧ (c).
 *
 * H-BK.2 (contract §1 VERBATIM): "through-body flight events and dead-band pass-throughs
 * collapse to ~0 by construction", scored AT EXAM GRAIN on the two named classes:
 *   (a) COOLDOWN-INVISIBILITY := Δ `cooldownInvisibleCoreBodyTicksPerMatch` CI strictly BELOW 0
 *       AND armed point ≤ 0.50 × base point.
 *   (b) DEAD-BAND := Δ `deadBandCauseReachBodyTicksPerMatch` CI strictly BELOW 0
 *       AND armed point ≤ 0.50 × base point.
 * PASS := (a) ∧ (b).
 *
 * ⭐ THE 0.50 BAR'S PROVENANCE, STATED: BK-T1 §R2's own receipts on ITS 40-seed band measured
 * the cooldown class at 3715 → 874 core body-ticks (ratio 0.235) and the dead-band cause cell
 * at 0.575 → 0.25 per match (ratio 0.435). The bar is set at 0.50 — LOOSER than both — so it
 * tests the word "collapse" rather than replaying the receipt, and a mere nudge fails it.
 * ⭐ WHAT IS **NOT** CLAIMED: "~0" is NOT scored as an absolute zero. The residual is the
 * classes BK-T1 §3 NAMED OUT (aboveGkClaim · aerialBand · rollOrClaimOrder ·
 * speedAboveControl), and each is published beside the verdict.
 */
const COLLAPSE_BAR = 0.5;
const fOutside = face('outsideConeShareAtRelease');
const fWindow = face('meanAppliedWindupTicks');
const fBeyond = face('beyondConeReleasesPerMatch');
const fBypass = face('beyondConeViaOneTouchPassBypassPerMatch');
const fOutScope = face('beyondConeViaOutOfScopeFamilyPerMatch');
const fCool = face('cooldownInvisibleCoreBodyTicksPerMatch');
const fDead = face('deadBandCauseReachBodyTicksPerMatch');
const armedAppliedAdded = sum(rowsOf('armed').map((r) => r.appliedAddedTicks));

const hbk1 = {
  a_collapse: fOutside.deltaCi95[1] < 0,
  b_timePaid: fWindow.deltaCi95[0] > 0 && armedAppliedAdded > 0,
  c_neverABan: fBeyond.armed.num > 0 && fBypass.armed.num > 0 && fOutScope.armed.num > 0,
  verdict: '',
};
hbk1.verdict = (hbk1.a_collapse && hbk1.b_timePaid && hbk1.c_neverABan) ? 'PASS' : 'FAIL';
const hbk2 = {
  a_cooldownCollapses: fCool.deltaCi95[1] < 0
    && fCool.armed.point <= COLLAPSE_BAR * fCool.base.point,
  b_deadBandCollapses: fDead.deltaCi95[1] < 0
    && fDead.armed.point <= COLLAPSE_BAR * fDead.base.point,
  verdict: '',
};
hbk2.verdict = (hbk2.a_cooldownCollapses && hbk2.b_deadBandCollapses) ? 'PASS' : 'FAIL';

/* ========================================================================== */
/* §14 THE GATES                                                              */
/* ========================================================================== */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
const baseSeedKey = rowsOf('base').map((r) => r.seed).join(',');
const armedSeedKey = rowsOf('armed').map((r) => r.seed).join(',');
const minStatsGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));

const gates: Record<string, boolean> = {
  gWorld: RECEIPT_OK && rows.every((r) => r.worldOk),
  gDoseBytes: L3_DOSE.length > 0 && PC_DOSE.length > 0 && L3_BYTES_SHA.length === 64
    && PC_BYTES_SHA.length === 64 && BKC0_BYTES_SHA.length === 64,
  gConstants: CONSTANTS_OK && CONE_OK && WINDOWS_OK,
  gPaired: baseSeedKey === armedSeedKey && rowsOf('base').length === rowsOf('armed').length,
  gBaseDormant: rowsOf('base').every((r) => r.ledFacingArmsSeen === 0 && r.ledFacingExtraTicks === 0
    && r.ledStrikesApplied === 0 && r.ledStrikeClaims === 0 && r.ledPartitionGroundTicks === 0),
  gArmedFires: sum(rowsOf('armed').map((r) => r.ledFacingArmsExtended)) > 0
    && sum(rowsOf('armed').map((r) => r.ledStrikesApplied)) > 0,
  gNoSuperpower: sum(rowsOf('armed').map((r) => r.ledStrikesFollowedByOwnership)) === 0,
  gLifecycle: sum(rowsOf('armed').map((r) => r.ledStrikesOutsidePlaying)) === 0,
  gReleasesObserved: rowsOf('base').every((r) => sum(r.relByClass) > 0)
    && rowsOf('armed').every((r) => sum(r.relByClass) > 0),
  gArmsObserved: sum(rows.map((r) => r.armsApplied)) > 0,
  /**
   * ⭐⭐ gLawReproduced — THE INSTRUMENT VALIDATES ITSELF AGAINST THE ENGINE. The probe
   * re-implements BK-T0's §LAW from the shipped constants and observes every arm at the step
   * boundary; on the ARMED arm those ARM-TIME totals must equal the engine's own
   * `bkFacingLedger` EXACTLY (arms seen · arms extended · extra ticks · max extra). An
   * independent implementation agreeing to the tick is the layer that catches definition
   * errors a tautological self-check cannot (BK-C0 §COMMANDER CORRECTIONS item 3).
   */
  gLawReproduced: (() => {
    const a = rowsOf('armed');
    return sum(a.map((r) => r.armsObserved)) === sum(a.map((r) => r.ledFacingArmsSeen))
      && sum(a.map((r) => r.observedChargedArms)) === sum(a.map((r) => r.ledFacingArmsExtended))
      && sum(a.map((r) => r.observedAddedTicks)) === sum(a.map((r) => r.ledFacingExtraTicks))
      && Math.max(0, ...a.map((r) => r.observedMaxAddedTicks))
        === Math.max(0, ...a.map((r) => r.ledFacingMaxExtra));
  })(),
  gBoundHolds: rows.every((r) => r.maxAppliedAddedTicks <= 18 && r.observedMaxAddedTicks <= 18),
  gStatsDisjoint: STATS_BASE >= 113_800 && minStatsGap >= STATS_STEP,
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  gSeedsBookedEqualWalked: walksBooked === N_SEEDS * 2 + 1,
  gFaces: false, // set below, after the artifact is on disk
};

/* ========================================================================== */
/* §15 THE ARTIFACT                                                           */
/* ========================================================================== */
/**
 * ⭐ THE HASHED BODY IS AN EXPLICIT ALLOWLIST SCHEMA (canon, home PC-T0 §CORR item 1): a field
 * not in this schema NEVER enters the hashed body. Wall-clock and other non-deterministic
 * fields sit OUTSIDE it by construction.
 */
const BODY_SCHEMA = ['stage', 'definitions', 'world', 'seeds', 'stats', 'faces', 'verdicts',
  'namedObservations', 'perSeedCells', 'gates'] as const;

const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, arm: r.arm, worldOk: r.worldOk,
  ticks: r.ticks, playingTicks: r.playingTicks,
  releases: r.releases, relByClass: r.relByClass, relMisSum: r.relMisSum,
  relMisBins: r.relMisBins, relByClassTier: r.relByClassTier,
  relOutsideCone: r.relOutsideCone, beyondByChannel: r.beyondByChannel,
  unattributedReleases: r.unattributedReleases, multiSignatureTicks: r.multiSignatureTicks,
  armsObserved: r.armsObserved, armsApplied: r.armsApplied, armsCancelled: r.armsCancelled,
  observedChargedArms: r.observedChargedArms, observedAddedTicks: r.observedAddedTicks,
  observedMaxAddedTicks: r.observedMaxAddedTicks,
  appliedWindowTicks: r.appliedWindowTicks, appliedWindowBins: r.appliedWindowBins,
  appliedAddedTicks: r.appliedAddedTicks, appliedAddedArms: r.appliedAddedArms,
  appliedAddedBins: r.appliedAddedBins, maxAppliedAddedTicks: r.maxAppliedAddedTicks,
  oneTouchShotArms: r.oneTouchShotArms, oneTouchShotArmsCharged: r.oneTouchShotArmsCharged,
  oneTouchShotAddedTicks: r.oneTouchShotAddedTicks,
  armSpeedBins: r.armSpeedBins, outsideConeFromArmSpeedBins: r.outsideConeFromArmSpeedBins,
  outsideConeFromArm: r.outsideConeFromArm,
  ledFacingArmsSeen: r.ledFacingArmsSeen, ledFacingArmsExtended: r.ledFacingArmsExtended,
  ledFacingExtraTicks: r.ledFacingExtraTicks, ledFacingMaxExtra: r.ledFacingMaxExtra,
  ledStrikesApplied: r.ledStrikesApplied, ledStrikeClaims: r.ledStrikeClaims,
  ledPartitionGroundTicks: r.ledPartitionGroundTicks, ledMaxStrikeSpeed: r.ledMaxStrikeSpeed,
  ledStrikesOutsidePlaying: r.ledStrikesOutsidePlaying,
  ledStrikesFollowedByOwnership: r.ledStrikesFollowedByOwnership,
  reachBodyTicks: r.reachBodyTicks, coreBodyTicks: r.coreBodyTicks,
  reachCauseTicks: r.reachCauseTicks, coreCauseTicks: r.coreCauseTicks,
  reachEpisodes: r.reachEpisodes, coreEpisodes: r.coreEpisodes,
  reachEpisodeBins: r.reachEpisodeBins, coreEpisodeBins: r.coreEpisodeBins,
  deadBandBallTicks: r.deadBandBallTicks, deadBandBallTicksWithBody: r.deadBandBallTicksWithBody,
  cooldownInvisibleBodyTicks: r.cooldownInvisibleBodyTicks,
  cooldownInvisibleEpisodes: r.cooldownInvisibleEpisodes,
  gkReleases: r.gkReleases, gkByChannel: r.gkByChannel, gkLandByChannel: r.gkLandByChannel,
  gkBounceBacks: r.gkBounceBacks, gkBounceBackWithin: r.gkBounceBackWithin,
  gkBounceBackBins: r.gkBounceBackBins,
  gkShortCompleted: r.gkShortCompleted, gkShortTurnovers: r.gkShortTurnovers,
  gkShortTurnoverWithin: r.gkShortTurnoverWithin, gkShortTurnoverBins: r.gkShortTurnoverBins,
  openSpells: r.openSpells, openSpellTickSum: r.openSpellTickSum,
  openSpellTouchSum: r.openSpellTouchSum,
  openFirstReceptions: r.openFirstReceptions,
  openFirstReceptionsPressed: r.openFirstReceptionsPressed,
  enginePasses: r.enginePasses, enginePassesCompleted: r.enginePassesCompleted,
  enginePassesForward: r.enginePassesForward,
  goals: r.goals, shots: r.shots, crosses: r.crosses, headersWon: r.headersWon,
  longBalls: r.longBalls, cutbacks: r.cutbacks,
  corridor: r.corridor,
});

const aggBins = (arm: Arm, pick: (r: Row) => number[]): number[] => {
  const acc = zeros(pick(rows[0]).length);
  for (const r of rowsOf(arm)) addInto(acc, pick(r));
  return acc;
};
const namedObservations = {
  oneTouchShotTax: {
    what: '⭐ #307 §CORR item 2 — 「一脚出球的射门要不要付转身时间」, measured where cheap',
    armedOneTouchShotArms: sum(rowsOf('armed').map((r) => r.oneTouchShotArms)),
    armedOneTouchShotArmsCharged: sum(rowsOf('armed').map((r) => r.oneTouchShotArmsCharged)),
    armedOneTouchShotAddedTicksTotal: sum(rowsOf('armed').map((r) => r.oneTouchShotAddedTicks)),
    chargedShare: round(face('oneTouchShotTaxShare').armed.point, 6),
    meanChargedTicks: round(face('oneTouchShotTaxMeanTicks').armed.point, 6),
    note: 'the BASE arm\'s identical columns are the COUNTERFACTUAL charge (the law is OFF; no '
      + 'time is paid there) and are published in the per-seed cells for contrast only.',
  },
  movingBodyResidual: {
    what: '⭐ #307 §CORR item 1 — the outside-cone residual for a MOVING body. NO THRESHOLD IS '
      + 'INVENTED: the striker\'s SPEED AT ARM is published as a distribution (0.5 m/s bins, '
      + 'index i = [i/2, (i+1)/2) m/s, last bin = overflow ≥ 10 m/s).',
    armedOutsideConeFromWindupArm: sum(rowsOf('armed').map((r) => r.outsideConeFromArm)),
    armedSpeedAtArmBinsAllArms: aggBins('armed', (r) => r.armSpeedBins),
    armedSpeedAtArmBinsOutsideConeReleases: aggBins('armed', (r) => r.outsideConeFromArmSpeedBins),
    baseSpeedAtArmBinsAllArms: aggBins('base', (r) => r.armSpeedBins),
    binWidthMetresPerSecond: 0.5,
  },
  lawReproduction: {
    what: '⭐⭐ the probe\'s INDEPENDENT re-implementation of BK-T0 §LAW, at ARM TIME, against '
      + 'the ENGINE\'s own bkFacingLedger on the ARMED arm (gLawReproduced asserts equality)',
    probeArmsObserved: sum(rowsOf('armed').map((r) => r.armsObserved)),
    engineArmsSeen: sum(rowsOf('armed').map((r) => r.ledFacingArmsSeen)),
    probeChargedArms: sum(rowsOf('armed').map((r) => r.observedChargedArms)),
    engineArmsExtended: sum(rowsOf('armed').map((r) => r.ledFacingArmsExtended)),
    probeAddedTicksTotal: sum(rowsOf('armed').map((r) => r.observedAddedTicks)),
    engineExtraTicksTotal: sum(rowsOf('armed').map((r) => r.ledFacingExtraTicks)),
    probeMaxAddedTicks: Math.max(0, ...rowsOf('armed').map((r) => r.observedMaxAddedTicks)),
    engineMaxExtraTicks: Math.max(0, ...rowsOf('armed').map((r) => r.ledFacingMaxExtra)),
    armsCancelledArmed: sum(rowsOf('armed').map((r) => r.armsCancelled)),
    note: 'the ARM-TIME columns count EVERY observed arm (the engine books at arm time too); '
      + 'the APPLIED columns used by the scored TIME face count only arms that reached their '
      + 'readyTick — canon clock honesty, APPLIED never nominal.',
  },
  reachCrossingUnitSplit: {
    what: '⭐ BK-C0 §CORR item 4 / BK-T1 §R2 — EPISODES and BODY-TICKS are DIFFERENT UNITS and '
      + 'both are published under names that say which they are.',
    baseReachCrossingBodyTicksPerMatch: round(face('reachCrossingBodyTicksPerMatch').base.point, 4),
    armedReachCrossingBodyTicksPerMatch: round(face('reachCrossingBodyTicksPerMatch').armed.point, 4),
    baseReachCrossingEpisodesPerMatch: round(face('reachCrossingEpisodesPerMatch').base.point, 4),
    armedReachCrossingEpisodesPerMatch: round(face('reachCrossingEpisodesPerMatch').armed.point, 4),
  },
  appliedAddedTicksDistribution: {
    what: 'the APPLIED added-ticks histogram (index = ticks, 0..18 — the law\'s structural range)',
    armedBins: aggBins('armed', (r) => r.appliedAddedBins),
    baseBinsCounterfactual: aggBins('base', (r) => r.appliedAddedBins),
  },
  appliedWindupWindowDistribution: {
    what: 'the APPLIED wind-up window histogram (index = ticks, 0..39 + overflow)',
    armedBins: aggBins('armed', (r) => r.appliedWindowBins),
    baseBins: aggBins('base', (r) => r.appliedWindowBins),
  },
  misalignBinsAllClasses: {
    what: 'the stored misalign bins every percentile face reads (20 equal bins over [0,1])',
    armedBins: (() => {
      const acc = zeros(MIS_BINS);
      for (const r of rowsOf('armed')) for (const cls of r.relMisBins) addInto(acc, cls);
      return acc;
    })(),
    baseBins: (() => {
      const acc = zeros(MIS_BINS);
      for (const r of rowsOf('base')) for (const cls of r.relMisBins) addInto(acc, cls);
      return acc;
    })(),
  },
  gkGapHistograms: {
    what: 'the UNCENSORED bounce-back and short-turnover gap histograms (41 bins × 10 ticks)',
    armedBounceBackBins: aggBins('armed', (r) => r.gkBounceBackBins),
    baseBounceBackBins: aggBins('base', (r) => r.gkBounceBackBins),
    armedShortTurnoverBins: aggBins('armed', (r) => r.gkShortTurnoverBins),
    baseShortTurnoverBins: aggBins('base', (r) => r.gkShortTurnoverBins),
  },
};

const artifact: Record<string, unknown> = {
  stage: 'BK-T2',
  what: 'THE COMPOSITION EXAM — both BK laws armed atop the world-8 stack vs the base, paired '
    + 'on virgin seeds. H-BK.1 / H-BK.2 SCORED against frozen CI rules; H-BK.3 REPORTED.',
  doc: 'docs/world-model/BK-T2-COMPOSITION-EXAM.md',
  contract: 'BK-BODYBALL-CONTRACT.md §1 H-BK.1 / H-BK.2 / H-BK.3',
  ruling: '#308 item 4',
  mode: MODE,
  corridorRungWalked: WITH_CORRIDOR,
  hashedBodySchema: BODY_SCHEMA,
  definitions: {
    arms: { base: 'a4MatchFlags(8) + armA4World(m, null, 8, L3 dose, PC dose)',
      armed: 'BASE + bkFacingLaw: true + bkContactLaw: true' },
    pairing: 'every seed walked TWICE, one walk per arm; one bootstrap resample-index matrix '
      + 'draws BOTH arms so the pairing is inside every interval',
    coneTicks: CONE_TICKS,
    coneRadians: round(CONE_RAD, 10),
    coneDegrees: round(CONE_DEG, 10),
    coneMisalign: round(CONE_MISALIGN, 10),
    c7WCapSeconds: C7_W_CAP,
    c7WCapSrcLine: C7_W_CAP_LINE,
    turnRateRadPerSecond: SRC_TURN_RATE,
    turnRateSrcLine: TURN_RATE_LINE,
    lawExpression: 'addedTicks = max(0, ceil(theta / (TURN_RATE * DT)) - BK_CONE_TICKS)',
    misalignMeasure: 'the engine\'s own kickMisalignment = (1 - cos theta)/2',
    releaseDirection: 'the ball\'s horizontal velocity at the tick boundary, de-rotated by the '
      + 'one tick of Magnus rotation stepBall applied (BK-C0 §2(a))',
    releaseFacing: 'the striker\'s PRE-STEP heading (kicks fire before physicsStep writes the '
      + 'new heading)',
    releaseScope: 'OPEN PLAY ONLY (phase === playing at the release tick)',
    facingPricedClasses: CLASSES.filter((c) => !(HEADER_CLASSES as readonly string[]).includes(c)),
    headerClasses: HEADER_CLASSES,
    inScopeWindupClasses: IN_SCOPE_CLASSES,
    beyondConeChannels: BEYOND_CHANNELS,
    causeLadder: CAUSES,
    causeLadderRule: 'BK-C0 §3(b)\'s own order; one cell per body-tick; the residual is '
      + 'rollOrClaimOrder',
    throughBodyExclusions: 'free ball, phase playing, not sentOff, not the ball\'s lastTouch, '
      + 'not this tick\'s contact',
    visualThroughBodyRadiusMetres: PLAYER_CORE_RADIUS,
    reachCrossingRadiusMetres: CONTROL_RADIUS,
    trivialTrapSpeedMetresPerSecond: TRIVIAL_TRAP_SPEED,
    zBandsShipped: [CONTROL_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    bounceBackWindowTicks: BOUNCE_WINDOW_TICKS,
    bounceBackWindowProvenance: '⭐ BK-C0 §COMMANDER CORRECTIONS item 1: the window OF RECORD is '
      + '240 ticks (what RAN), read here off the COMMITTED BK-C0 artifact\'s own '
      + '`definitions.bounceBackWindowTicks` (bytes hashed first), never re-derived by regex.',
    bounceBackWindowAlternativeTicks: BOUNCE_WINDOW_ALT_TICKS,
    bounceBackWindowAlternativeProvenance: `the NAMED performLoftedPass site's tMax = `
      + `${LOFT_T_MAX_NAMED} s (mechanics.ts:${LOFT_NAMED_LINE}), out and back`,
    gkRecordRetireTicks: GK_RETIRE_TICKS,
    gkRetireNote: '⭐ THE ONE DECLARED IMPROVEMENT over BK-C0: retiring at 420 ticks instead of '
      + 'at the window leaves the 41×10-tick gap histogram UNCENSORED inside its own range '
      + '(BK-C0 §COMMANDER CORRECTIONS item 2\'s defect). The 240-tick headline is unaffected.',
    turnoverWindowTicks: TURNOVER_WINDOW_TICKS,
    turnoverWindowProvenance: 'L3_DEFENCE_WINDOW_S / DT — the engine\'s own arrival law '
      + '(defenceBook.ts: sqrt(2·CB_TACKLE_RADIUS/ACCEL) + π/TURN_RATE)',
    ryiQ01: 'R-乙 VERBATIM — "how long a team keeps the ball (open-play possession spell, mean)": '
      + 'a maximal interval of same-owner-TEAM control while phase === "playing", SUSPENDED (not '
      + 'ended) while the ball is loose in play, ended by an opponent establishing ownership / '
      + 'the phase leaving "playing" / full time; duration = (endTick − startTick)·DT so in-spell '
      + 'loose time is INCLUDED (the Opta "sequence" shape). openPlay origin only.',
    ryiQ05: 'R-乙 VERBATIM — "how many touches a possession is made of": ownership episodes '
      + 'counted inside each openPlay-origin spell.',
    ryiQ06: 'R-乙 VERBATIM — "how many passes find a team-mate": the engine\'s OWN passive '
      + 'counters, Σ team.stats.passesCompleted / Σ team.stats.passes, both teams.',
    ryiQ14: 'R-乙 VERBATIM — "how much of the game is played under pressure (pressing-intensity '
      + 'proxy)": among the FIRST reception of each openPlay-origin spell, the share whose '
      + 'nearest-opponent distance at the reception tick is ≤ the substrate\'s OWN pressure '
      + 'switch TOUCH_CONTROL_DIST. Restart/kickoff-origin receptions are EXCLUDED.',
    ryiQ07: 'R-乙 Q07 VERBATIM — FORWARD is the engine\'s own team.stats.passesForward counter.',
    ryiSource: 'docs/world-model/R-YI-STANDING-GAP-TABLE.md §definitions (Q01 · Q05 · Q06 · Q07 '
      + '· Q14), reused verbatim',
    pressureRadiusMetres: PRESSURE_R,
    pressureRadiusSrcLine: PRESSURE_R_LINE,
    forwardBandMetres: FORWARD_BAND_M,
    forwardBandSrcLine: FORWARD_BAND_LINE,
    corridorRung: 'BU-C0\'s option ladder reused: mates → flight-reachable (the engine\'s own '
      + 'passAffordance) → race-winning (arrivalMargin > 0) → uncut (the engine\'s own '
      + 'passCorridorInterception, over every live opponent). Sampled at every open-play '
      + 'reception. REPORTED — it gates nothing.',
    equilibriumFaces: 'goals · crosses · headers · longBalls · cutbacks per match — REPORTED '
      + 'ONLY (nothing ships from an exam; the C1 §4 band is not a gate here).',
    clockNote: 'the match clock is 240 s (MATCH_DURATION); 1 sim-s = 22.5 display-s. Every '
      + 'per-match rate below is per 240 s match.',
    matchDurationSeconds: MATCH_DURATION,
  },
  world: {
    version: PC_WORLD,
    receiptSeed: RECEIPT_SEED,
    receiptConjuncts: RECEIPT,
    everyWalkedMatchConformed: rows.every((r) => r.worldOk),
    l3DoseFileBytesSha256: L3_BYTES_SHA,
    pcDoseFileBytesSha256: PC_BYTES_SHA,
    bkC0ArtifactBytesSha256: BKC0_BYTES_SHA,
    l3DoseLungesTotal: L3_DOSE_LUNGES,
    pcDoseExposuresTotal: PC_DOSE_EXPOSURES,
    formulaIdentityHolds: FORMULA_OK,
  },
  seeds: {
    block: BLOCK,
    batteryFirst: SEEDS[0],
    batteryLast: SEEDS[SEEDS.length - 1],
    pairedSeeds: N_SEEDS,
    batteryWalks: N_SEEDS * 2,
    receiptSeed: RECEIPT_SEED,
    walksBooked,
    smokePrefix: [BLOCK, BLOCK + 2],
    bookedEqualsWalked: walksBooked === N_SEEDS * 2 + 1,
  },
  stats: {
    base: STATS_BASE,
    step: STATS_STEP,
    resamples: BOOTSTRAP,
    estimator: 'PAIRED cluster bootstrap by match seed, percentile 95 % CIs; ONE resample-index '
      + 'matrix draws both arms',
    publishedBasesCheckedAgainst: STATS_PUBLISHED_BASES,
    minimumGapToAnyPublishedBase: minStatsGap,
    drawsTaken: 1,
    nextBaseAtLeast: STATS_BASE + STATS_STEP,
  },
  faces,
  verdicts: {
    hbk1: {
      claimVerbatim: 'release-facing misalignment collapses toward the strike cone as a '
        + 'DISTRIBUTION ... at an honest TIME cost, never a ban; deliberate high-misalign '
        + 'strikes (the backheel class) survive as a priced choice with usage > 0.',
      rule: '(a) Δ outsideConeShareAtRelease CI strictly < 0 ∧ (b) Δ meanAppliedWindupTicks CI '
        + 'strictly > 0 ∧ armed applied added ticks > 0 ∧ (c) armed beyond-cone releases > 0 '
        + '∧ one-touch-bypass > 0 ∧ out-of-scope-family > 0',
      ...hbk1,
      armedAppliedAddedTicksTotal: armedAppliedAdded,
    },
    hbk2: {
      claimVerbatim: 'through-body flight events and dead-band pass-throughs collapse to ~0 by '
        + 'construction',
      rule: `(a) Δ cooldownInvisibleCoreBodyTicksPerMatch CI strictly < 0 ∧ armed ≤ `
        + `${COLLAPSE_BAR} × base ∧ (b) Δ deadBandCauseReachBodyTicksPerMatch CI strictly < 0 `
        + `∧ armed ≤ ${COLLAPSE_BAR} × base`,
      collapseBar: COLLAPSE_BAR,
      collapseBarProvenance: 'BK-T1 §R2 measured 3715 → 874 core body-ticks (0.235) for the '
        + 'cooldown class and 0.575 → 0.25 per match (0.435) for the dead-band cause cell on '
        + 'ITS OWN 40-seed band; 0.50 is LOOSER than both, so it tests "collapse" rather than '
        + 'replaying the receipt.',
      residualClassesNamedOutOfScope: ['aboveGkClaim', 'aerialBand', 'rollOrClaimOrder',
        'speedAboveControl'],
      ...hbk2,
    },
  },
  namedObservations,
  perSeedCells: rows.map(cellOf),
  gates,
  instrumentSha256: sha(readFileSync(new URL(import.meta.url).pathname, 'utf8')),
  headCommit: gitOut('git rev-parse HEAD'),
  battery: {
    matches: rows.length,
    ticksTotal: sum(rows.map((r) => r.ticks)),
    wallSeconds: round((Date.now() - t0Wall) / 1000, 1),
  },
};

writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ---- gFaces: re-derive EVERY published face by RE-PARSING the artifact off disk ---- */
const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as {
  faces: FaceRow[];
  perSeedCells: Record<string, unknown>[];
  namedObservations: Record<string, Record<string, unknown>>;
};
const diskRow = (c: Record<string, unknown>): Row => c as unknown as Row;
/** ⚠ JSON serializes a non-finite number as `null` — the re-derivation reads it back as NaN. */
const asNum = (v: unknown): number => (v === null || v === undefined ? Number.NaN : Number(v));
const eq = (av: unknown, bv: unknown): boolean => {
  const a = asNum(av); const b = asNum(bv);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Number.isNaN(a) === Number.isNaN(b) && a === b || (Number.isNaN(a) && Number.isNaN(b));
  return Math.abs(a - b) < 1e-9;
};
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const fr of onDisk.faces) {
  const def = FACES[fr.face];
  const cells = onDisk.perSeedCells.map(diskRow);
  for (const arm of ARMS) {
    const rs = cells.filter((r) => r.arm === arm);
    const n = sum(rs.map((r) => def.num(r)));
    const dd = sum(rs.map((r) => def.den(r)));
    const side = arm === 'base' ? fr.base : fr.armed;
    faceChecks += 3;
    if (eq(side.num, n)) faceOk++; else faceFailures.push(`${fr.face}.${arm}.num`);
    if (eq(side.den, dd)) faceOk++; else faceFailures.push(`${fr.face}.${arm}.den`);
    if (eq(side.point, ratio(n, dd))) faceOk++; else faceFailures.push(`${fr.face}.${arm}.point`);
  }
  faceChecks += 1;
  if (eq(fr.delta, asNum(fr.armed.point) - asNum(fr.base.point))) faceOk++;
  else faceFailures.push(`${fr.face}.delta`);
}
/** the stored-bin faces re-derive too (canon: a percentile face requires stored bins) */
const binCheck = (stored: number[], pick: (r: Row) => number[], arm: Arm): boolean => {
  const acc = zeros(stored.length);
  for (const r of onDisk.perSeedCells.map(diskRow).filter((r) => r.arm === arm)) {
    addInto(acc, pick(r));
  }
  return acc.every((v, i) => v === stored[i]);
};
const binsOk = [
  binCheck(namedObservations.appliedAddedTicksDistribution.armedBins, (r) => r.appliedAddedBins, 'armed'),
  binCheck(namedObservations.appliedWindupWindowDistribution.armedBins, (r) => r.appliedWindowBins, 'armed'),
  binCheck(namedObservations.movingBodyResidual.armedSpeedAtArmBinsAllArms, (r) => r.armSpeedBins, 'armed'),
  binCheck(namedObservations.movingBodyResidual.armedSpeedAtArmBinsOutsideConeReleases,
    (r) => r.outsideConeFromArmSpeedBins, 'armed'),
  binCheck(namedObservations.gkGapHistograms.armedBounceBackBins, (r) => r.gkBounceBackBins, 'armed'),
  binCheck(namedObservations.gkGapHistograms.baseBounceBackBins, (r) => r.gkBounceBackBins, 'base'),
  binCheck(namedObservations.gkGapHistograms.armedShortTurnoverBins, (r) => r.gkShortTurnoverBins, 'armed'),
  binCheck(namedObservations.gkGapHistograms.baseShortTurnoverBins, (r) => r.gkShortTurnoverBins, 'base'),
].every(Boolean);
gates.gFaces = faceOk === faceChecks && binsOk;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: FACE_KEYS.length, checksRun: faceChecks, checksPassed: faceOk, binsOk,
  failures: faceFailures,
};
/** the ALLOWLIST-SCHEMA hashed body, computed LAST so it covers the final gate values */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonical(body));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
banner('');
banner('=== BK-T2 — THE COMPOSITION EXAM ===');
banner(`artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
const show = (k: string): string => {
  const f = face(k);
  return `${k}: base=${round(f.base.point, 6)} armed=${round(f.armed.point, 6)} `
    + `Δ=${round(f.delta, 6)} CI[${round(f.deltaCi95[0], 6)}, ${round(f.deltaCi95[1], 6)}] `
    + `|Δ|/hw=${round(f.absDeltaOverHalfWidth, 3)}`;
};
banner(`H-BK.1 = ${hbk1.verdict}  (a=${hbk1.a_collapse} b=${hbk1.b_timePaid} c=${hbk1.c_neverABan})`);
banner(`  ${show('outsideConeShareAtRelease')}`);
banner(`  ${show('meanAppliedWindupTicks')}`);
banner(`  beyond-cone armed: total=${fBeyond.armed.num} bypass=${fBypass.armed.num} `
  + `outOfScope=${fOutScope.armed.num}`);
banner(`H-BK.2 = ${hbk2.verdict}  (a=${hbk2.a_cooldownCollapses} b=${hbk2.b_deadBandCollapses})`);
banner(`  ${show('cooldownInvisibleCoreBodyTicksPerMatch')}`);
banner(`  ${show('deadBandCauseReachBodyTicksPerMatch')}`);
banner('');
for (const k of ['gkShortPassShare', 'gkPuntShare', 'puntAerialFirstTouchShare',
  'bounceBackWithin240PerGkRelease', 'shortTurnoverWithinWindowShare', 'ryiQ01SpellSeconds',
  'ryiQ05TouchesPerSpell', 'ryiQ06PassCompletion', 'ryiQ14PressedReceptionShare',
  'ryiQ07ForwardPassShare', 'goalsPerMatch', 'corridorSurvivalOfRaceWinners']) {
  banner(`  ${show(k)}`);
}
banner(`walks booked = walked: ${walksBooked}  ·  wall ${round((Date.now() - t0Wall) / 1000, 1)} s`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
if (red.length > 0) banner(`RED GATES: ${red.join(', ')} — REPORTED, NEVER PATCHED`);
if (hbk1.verdict === 'FAIL' || hbk2.verdict === 'FAIL') {
  banner('A SCORED VERDICT IS **FAIL** — reported as-is (a red gate stays red).');
}
process.exit(red.length > 0 || hbk1.verdict === 'FAIL' || hbk2.verdict === 'FAIL' ? 1 : 0);
