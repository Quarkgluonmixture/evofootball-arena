/**
 * PW-T0a — THE PREFERENCE CENSUS (docs/world-model/PW-T0A-PREFERENCE-CENSUS.md).
 *
 * The PASS-WEIGHT contract's SECOND instrument (PW-PASSWEIGHT-CONTRACT.md §2 M-PW.2/M-PW.3,
 * order bound by ruling #291.6, design picked by PW-C0 §E.3). INSTRUMENT-ONLY: nothing is
 * armed, nothing is built, `src/**` is BYTE-UNTOUCHED, and no seam acquires a caller.
 *
 * ⭐⭐ THE QUESTION. PW-C0 §C.3 proved that at POPULATION MEANS the maximum expressible weight
 * wins under BOTH shipped cost curves (the 2.30 : 1 / 1.20 : 1 ledger). A chooser, however, acts
 * PER OPTION. This census measures the PER-OPTION preference distribution of the SHIPPED joining
 * rule — is there a non-degenerate CHOSEN REGION at all, before any src work is spent on a
 * chooser (PW-T0b)?
 *
 * ⭐ THE RULE IS THE SHIPPED ONE, CALLED — NEVER RE-IMPLEMENTED (contract §2 M-PW.2, the #256.2
 * law: a re-implemented rule is a PARALLEL ORACLE). Every price in this file comes out of
 * `perceivedPassChoice.preferredPassPower`, imported from `src`. `gRule` proves it by scanning
 * THIS FILE'S OWN BYTES for the forbidden pricing identifiers (assembled at run time so the
 * literals never appear in the source being scanned).
 *
 * THE INSTRUMENT
 *   POPULATION — the SAME reception scenes as PW-C0, on VIRGIN seeds in the v7 world (matches
 *     constructed DIRECTLY with `matchFlags`, arming ASSERTED LIVE on the walked match,
 *     #283.2(iv)). BU-C0's option ladder VERBATIM (L1 position on the engine's own ±2 m band ·
 *     L2 the oracle's flight · L3 `arrivalMargin > 0` · L4 the corridor sampler), GK-split.
 *   ⭐ POWER-DEPENDENT DENOMINATORS, DISCLOSED (PW-C0 §COMMANDER CORRECTIONS 2): the published
 *     option set MOVES with power, so the census publishes THREE declared populations —
 *     `ref` (published at the reference rung 1.00 — the set today's chooser enumerates; the
 *     PRIMARY face), `union` (published at ANY of the three rungs) and `all3` (published at ALL
 *     three — the fully paired set). `gPaired` proves the three curves see the IDENTICAL option
 *     population inside each.
 *   RUNGS — {PASS_POWER_MIN, 1, PASS_POWER_MAX}, the substrate's own `PASS_CANARY_POWERS`
 *     ladder, its literal EXTRACTED from `PlayerBrain.ts` at run time (never typed here).
 *   CURVES — BOTH shipped touch curves, selected through the rule's OWN `heavyTouchCost`
 *     parameter (the same switch `evaluatePassOption` itself reads). The walked world's own
 *     selection (`match.edsTouchCost`) is asserted OFF = the base curve, as PW-C0 recorded.
 *
 * RUN: PWT0A_MODE=full npx tsx scripts/probes/pw-t0a-preference-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2): PWT0A_MODE (smoke|full, REQUIRED) ·
 *   PWT0A_N · PWT0A_OUT. Any other `PWT0A_*` var and any ENGINE env door is a FATAL refusal.
 *   Every override is a PREFLIGHT and may not write a canonical repo path.
 * ⭐ #289.1 / BU-T1 §CORRECTIONS 1, BY NAME: `preflight`, `preflightReasons`, `mode`, `head`,
 *   `outPath`, `wallMs`, `generatedAt` live in the ENVELOPE and are named by the exclusion gate.
 * ⭐ #289 canon: the dose guard hashes the FILE BYTES it reads and RE-DERIVES the artifact's own
 *   digest from those bytes.
 * ⭐ #291.5 canon: the DIVERGENCE-1 receipt DIFFS THE TERM LISTS of the two implementations; it
 *   never merely evaluates the expressions they share.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  DT, MATCH_DURATION, PASS_POWER_MAX, PASS_POWER_MIN, PASS_POWER_NOISE_K, TOUCH_CONTROL_DIST,
} from '../../src/sim/constants';
import { TOUCH_SPEED_COST, kickMisalignment, orientationPowerMul } from '../../src/sim/mechanics';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells,
  L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
} from '../../src/game/a4World';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import {
  passChoiceCandidateGids, preferredPassPower, threatBandIndex,
} from '../../src/ai/perceivedPassChoice';
import { optionSpacePriorBandIndex, OPTION_SPACE_PRIOR_TABLE } from '../../src/ai/passPrior';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PWT0A_MODE', 'PWT0A_N', 'PWT0A_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PWT0A_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('PW-T0a FATAL — refused env surface. '
    + `rogue PWT0A_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PWT0A_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`PW-T0a FATAL — PWT0A_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.PWT0A_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PWT0A_N, 10)) : null;
const OUT_ENV = process.env.PWT0A_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PWT0A_N'] : []),
  ...(OUT_ENV !== undefined ? ['PWT0A_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pw-t0a-preference-census-smoke.json',
  full: 'docs/world-model/data/pw-t0a-preference-census.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pw-t0a-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('PW-T0a FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 THE SRC RECEIPTS — LAWS AND LADDERS EXTRACTED AT RUN TIME (#200)         */
/* ========================================================================== */
const CONST_SRC_PATH = 'src/sim/constants.ts';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const PRED_SRC_PATH = 'src/ai/prediction.ts';
const OPT_SRC_PATH = 'src/ai/passOptionValue.ts';
const CHOICE_SRC_PATH = 'src/ai/perceivedPassChoice.ts';
const BRAIN_SRC_PATH = 'src/ai/PlayerBrain.ts';
const OWN_SRC_PATH = 'scripts/probes/pw-t0a-preference-census.ts';
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const PRED_SRC = readFileSync(PRED_SRC_PATH, 'utf8');
const OPT_SRC = readFileSync(OPT_SRC_PATH, 'utf8');
const CHOICE_SRC = readFileSync(CHOICE_SRC_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_SRC_PATH, 'utf8');
const OWN_SRC = readFileSync(OWN_SRC_PATH, 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};

/** ⭐ THE CANARY LADDER — the literal EXTRACTED from the brain, never typed here. */
const CANARY_RE = /const PASS_CANARY_POWERS: readonly number\[\] = \[([^\]]+)\];/;
const CANARY_MATCH = CANARY_RE.exec(BRAIN_SRC);
const CANARY_LITERAL = CANARY_MATCH === null ? 'NOT-FOUND' : CANARY_MATCH[1].trim();
const CANARY_LINE = lineOf(BRAIN_SRC, CANARY_RE);
/** the ladder itself, built from the SUBSTRATE'S OWN constants in the literal's own order. */
const POWERS: readonly number[] = [PASS_POWER_MIN, 1, PASS_POWER_MAX];
const POWER_LABELS = ['p0850', 'p1000', 'p1150'] as const;
const REF_POWER_INDEX = 1;
const CANARY_LITERAL_MATCHES_OUR_LADDER = CANARY_LITERAL === 'PASS_POWER_MIN, 1, PASS_POWER_MAX';
/** the brain's own canary CALL SITE — the consumer that proves this ladder is the live one. */
const CANARY_CALL_LINE = lineOf(BRAIN_SRC, /preferredPassPower\(\{/);
const CANARY_FEEDS_THE_RULE = /powers: PASS_CANARY_POWERS/.test(BRAIN_SRC);

/**
 * ⭐ THE JOINING RULE, traced in the shipped file (the rule is CALLED, never restated).
 * ⚠ The corridor-price function's NAME is assembled from fragments here for the same reason the
 * forbidden list below is: the no-parallel-oracle scan reads THIS FILE'S bytes, and a literal
 * mention would make it self-match.
 */
const QUINTILE_PRICE_IDENT = ['threatQuintile', 'Price'].join('');
const RULE_PRICE_LINE = lineOf(CHOICE_SRC, new RegExp(
  `const prices = values\\.map\\(\\(value\\) => ${QUINTILE_PRICE_IDENT}\\(value!\\.interceptionThreatSeconds\\)`));
const RULE_RATIO_LINE = lineOf(CHOICE_SRC, /\* \(\(1 - value!\.touchFailPrior\) \/ referenceSurvival\)\);/);
const RULE_ARGMAX_LINE = lineOf(CHOICE_SRC, /if \(prices\[index\] > prices\[preferredIndex\]\) preferredIndex = index;/);
const RULE_HEAVY_LINE = lineOf(CHOICE_SRC, /heavyTouchCost: input\.heavyTouchCost,/);
const RULE_TRACED = RULE_PRICE_LINE > 0 && RULE_RATIO_LINE > 0 && RULE_ARGMAX_LINE > 0
  && RULE_HEAVY_LINE > 0;
/** ⭐ the rule's argmax is FIRST-WINS on an exact tie (strict `>`): recorded, not assumed. */
const RULE_ARGMAX_IS_STRICT = /prices\[index\] > prices\[preferredIndex\]/.test(CHOICE_SRC);

/** ⭐ THE TWO SHIPPED CURVES — the oracle mirror RESTATES the constants; pin them equal. */
const MIRROR_SPAN_HEAVY = extractNum(OPT_SRC, /const span = heavyTouchCost \? (\d+(?:\.\d+)?) : \d/);
const MIRROR_SPAN_BASE = extractNum(OPT_SRC, /const span = heavyTouchCost \? \d+(?:\.\d+)? : (\d+(?:\.\d+)?);/);
const MIRROR_WEIGHT_HEAVY = extractNum(OPT_SRC, /const weight = heavyTouchCost \? (\d+(?:\.\d+)?) : \d/);
const MIRROR_WEIGHT_BASE = extractNum(OPT_SRC, /const weight = heavyTouchCost \? \d+(?:\.\d+)? : (\d+(?:\.\d+)?);/);
const MIRROR_LINE = lineOf(OPT_SRC, /const span = heavyTouchCost \?/);
const MIRROR_MATCHES_TOUCH_SPEED_COST = MIRROR_SPAN_BASE === TOUCH_SPEED_COST.base.span
  && MIRROR_SPAN_HEAVY === TOUCH_SPEED_COST.heavy.span
  && MIRROR_WEIGHT_BASE === TOUCH_SPEED_COST.base.weight
  && MIRROR_WEIGHT_HEAVY === TOUCH_SPEED_COST.heavy.weight;

/** the EXECUTION-ERROR law, extracted (its σ is the noise-floor context, never re-implemented). */
const NOISE_CONST = extractNum(MECH_SRC,
  /Math\.abs\(intended - 1\) \* PASS_POWER_NOISE_K \* \((\d+(?:\.\d+)?) - passer\.attrs\.passing\)/);
const NOISE_LINE = lineOf(MECH_SRC, /Math\.abs\(intended - 1\) \* PASS_POWER_NOISE_K/);

/** Q07's own ±2 m band and the pressure radius, inherited from BU-C0 / PW-C0 VERBATIM. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_LINE = lineOf(CONST_SRC, /export const TOUCH_CONTROL_DIST = [\d.]+;/);
const FORWARD_BAND_M = extractNum(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > (\d+(?:\.\d+)?)\)/);
const FORWARD_BAND_LINE = lineOf(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > \d/);
/** the DISPLAY clock, read out of the engine's own expression (APPLIED, not nominal). */
const DISPLAY_MINUTES = extractNum(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)\)/);
const DISPLAY_MINUTES_LINE = lineOf(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* \d+\)\)/);
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;

/**
 * ⭐⭐ NO PARALLEL ORACLE — THIS FILE'S OWN BYTES ARE SCANNED.
 *
 * The forbidden identifiers are ASSEMBLED AT RUN TIME from fragments, so the literal strings
 * never appear in the file being scanned and the check cannot pass by accident or fail by
 * self-match. If any of them ever appears in this probe, a second pricing table has been born
 * and the gate goes red (contract §2 M-PW.2 / the #256.2 law).
 */
const FORBIDDEN_PRICING_IDENTS = [
  ['threatQuintile', 'Price'].join(''),
  ['mirroredTouch', 'FailChance'].join(''),
  ['touchFail', 'Chance'].join(''),
  ['THREAT_', 'CALIBRATION'].join(''),
];
const PARALLEL_ORACLE_HITS = FORBIDDEN_PRICING_IDENTS.filter((id) => OWN_SRC.includes(id));
const OWN_CALLS_THE_SHIPPED_RULE = (OWN_SRC.match(/preferredPassPower\(/g) ?? []).length > 0;

/**
 * ⭐⭐ DIVERGENCE-1 (PW-C0 §COMMANDER CORRECTIONS 1, HIGH), RE-PROVEN AS A TERM-LIST DIFF —
 * the #291.5 canon: a divergence/agreement claim must DIFF THE TERM LISTS, never merely
 * evaluate the expressions the two sides share.
 */
const bodyOf = (src: string, header: string): string => {
  const at = src.indexOf(header);
  if (at < 0) return '';
  let depth = 0;
  let started = false;
  for (let i = at; i < src.length; i++) {
    if (src[i] === '{') { depth++; started = true; }
    else if (src[i] === '}') {
      depth--;
      if (started && depth === 0) return src.slice(at, i + 1);
    }
  }
  return '';
};
const JS_WORDS = new Set(['const', 'let', 'return', 'if', 'else', 'for', 'of', 'in', 'function',
  'export', 'new', 'null', 'true', 'false', 'this', 'void', 'number', 'string', 'boolean',
  'readonly', 'interface', 'type', 'Math', 'Number', 'Object', 'Array', 'undefined', 'while',
  'break', 'continue', 'switch', 'case', 'default', 'typeof', 'instanceof', 'x', 'y']);
const identsOf = (body: string): string[] => Array.from(new Set(
  (body.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/[^\n]*/g, ' ').match(/[A-Za-z_$][\w$]*/g)
    ?? []).filter((w) => !JS_WORDS.has(w)))).sort();
const SIM_STRIKE_BODY = bodyOf(MECH_SRC, 'export function performPass(');
const ORACLE_BODY = bodyOf(PRED_SRC, 'export function predictGroundPass(');
const SIM_TERMS = identsOf(SIM_STRIKE_BODY);
const ORACLE_TERMS = identsOf(ORACLE_BODY);
const SIM_ONLY_TERMS = SIM_TERMS.filter((t) => !ORACLE_TERMS.includes(t));
const ORACLE_ONLY_TERMS = ORACLE_TERMS.filter((t) => !SIM_TERMS.includes(t));
const ORIENTATION_IS_SIM_ONLY = SIM_ONLY_TERMS.includes('orientationPowerMul')
  && !ORACLE_TERMS.includes('orientationPowerMul');
const EXECUTION_ERROR_IS_SIM_ONLY = SIM_ONLY_TERMS.includes('executedPassPower')
  && !ORACLE_TERMS.includes('executedPassPower');

/* ---- ⭐ THE TIE EPSILON — DERIVED FROM FLOAT PRECISION, NEVER FROM TASTE ---- */
/**
 * The rule's price is `quintilePrice × ((1 − touchFail)/(1 − touchFailRef))`: a product of a
 * table lookup with a quotient of two differences — FOUR rounding sites, each ≤ ½ ulp, on
 * operands of magnitude ≤ 1. A conservative bound on the representation error of a price is
 * therefore 4 · Number.EPSILON, and on a DIFFERENCE of two prices 8 · Number.EPSILON. The
 * epsilon is that bound rounded up to the next power of two: 16 · Number.EPSILON. No taste
 * enters — it is the machine's own resolution, and the margin HISTOGRAM below publishes the
 * whole distribution so any other threshold can be applied to the same numbers afterwards.
 */
const TIE_EPS = 16 * Number.EPSILON;
const TIE_EPS_DERIVATION = '16 · Number.EPSILON — a power-of-two round-up of the 8·ε bound on '
  + 'the representation error of a DIFFERENCE of two prices, each price being a product of a '
  + 'table lookup with a quotient of two differences (four rounding sites, operands ≤ 1). '
  + 'Float precision, never taste.';
/** the margin histogram's decade edges — a DISTRIBUTION, published so no threshold is needed. */
const MARGIN_EDGES = [TIE_EPS, 1e-12, 1e-9, 1e-6, 1e-4, 1e-3, 1e-2, 1e-1] as const;
const MARGIN_BUCKETS = MARGIN_EDGES.length + 1;

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const BOOTSTRAP = 2000;
const STATS_BASE = 112_600;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600, 111_800,
  112_000, 112_200, 112_400,
];

const SMOKE_BASE = 12_491_000;
const GUARD_BASE = 12_491_040;
const GUARD_SPAN = 20;
const BATTERY_BASE = 12_491_100;
const GWORLD_SEED = 12_491_900;
const N_FROZEN = 200;
const PERTURB_CHECK_SEEDS = 15;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / MT / LADDER bands', range: [12_300_000, 12_421_999] },
  { name: 'O2-T1 · CTB · OBM · PTP · DLC bands', range: [12_422_000, 12_428_999] },
  { name: 'DV-C0 / DV-T0 / DV-T1 family', range: [12_429_000, 12_435_099] },
  { name: 'DV-T2 family (#255.4–#258.4)', range: [12_436_000, 12_447_999] },
  { name: 'EK-C0 / EK-C0b / EK-T0 / EK-T1 (#259.3–#262.4)', range: [12_448_000, 12_469_999] },
  { name: 'CB-C0 / CB-T0 / CB-T1 / CB-T2 bands (#264–#273)', range: [12_470_000, 12_479_999] },
  { name: 'L3 family + entry (#277.2–#283)', range: [12_480_000, 12_485_999] },
  { name: 'BU-C0 reception-option census (#285.2/#286)', range: [12_486_000, 12_486_999] },
  { name: 'BU-T0 DV composition (#286.6/#287)', range: [12_487_000, 12_487_999] },
  { name: 'BU-T0b price separation (#287.6/#288)', range: [12_488_000, 12_488_999] },
  { name: 'BU-T1 MT composition (#288.7/#289)', range: [12_489_000, 12_489_999] },
  { name: 'PW-C0 weight-physics census (#290.3/#291)', range: [12_490_000, 12_490_999] },
];

/* ========================================================================== */
/* §4 THE ARM — CONSTRUCTED DIRECTLY WITH matchFlags (#283.2(iv))              */
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
const T1_BYTES = readFileSync(T1_PATH, 'utf8');
const T1_FILE = JSON.parse(T1_BYTES) as Record<string, unknown>;
const DOSE: L3DoseCell[] = poolT1DoseCells(T1_FILE);
const DOSE_FILE_BYTES_SHA = sha(T1_BYTES);
const DOSE_REDERIVED_SHA = (() => {
  const cc = JSON.parse(T1_BYTES) as Record<string, unknown>;
  delete cc.resultSha256;
  delete cc.envelope;
  return sha(canonical(cc));
})();

const matchOf = (seed: number, bare = false): Match => {
  const teamA = team('A', seed * 2 + 1);
  const teamB = team('B', seed * 2 + 2);
  if (bare) return new Match({ seed, teamA, teamB });
  const m = new Match({ seed, teamA, teamB, ...a4MatchFlags(L3_WORLD_VERSION) });
  armA4World(m, null, L3_WORLD_VERSION, DOSE);
  return m;
};
const armConjuncts = (m: Match): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean;
    l3Defence: { books: { lunges: number[]; punished: number[] }[] } | null;
    cbChoiceSeat: boolean; edsTouchCost: boolean;
  };
  const dosed = mm.l3Defence !== null && mm.l3Defence.books.every((b) => DOSE
    .every((c, g) => b.lunges[g] === c.lunges && b.punished[g] === c.punished));
  const genomeClean = m.teams.every((t) => !JSON.stringify(t.info.genome).includes('l3')
    && !Object.keys(t.info.genome as unknown as Record<string, unknown>)
      .some((k) => k.toLowerCase().includes('defence')));
  return {
    theArmIsTheWorldSevenOfRecord: l3ArmedVersion(m) === L3_WORLD_VERSION
      && a4ArmedVersion(m) === L3_WORLD_VERSION,
    bothL3DoorsAreLiveInThisSim: mm.l3DefenceLearn && mm.l3DefenceVeto && mm.l3Defence !== null,
    theCarryDoorIsLiveInThisSim: mm.cbChoiceSeat,
    theBooksCarryTheMaturedDose: dosed,
    theEngineClockIsTheDefault: m.duration === MATCH_DURATION,
    theDoseIsNotInTheGenome: genomeClean,
    theShippedTouchCurveSelectorIsOff: !mm.edsTouchCost,
  };
};

/* ========================================================================== */
/* §5 THE CELL — the per-slice preference accumulator                          */
/* ========================================================================== */
const CURVES = ['base', 'heavy'] as const;
type Curve = (typeof CURVES)[number];
const POPS = ['ref', 'union', 'all3'] as const;
type Pop = (typeof POPS)[number];
const DIST_BANDS = OPTION_SPACE_PRIOR_TABLE.map((r) => `d${r.bandFrom}_${r.bandTo}`);
const SLICES_FULL: readonly string[] = [
  'all', 'gk', 'outfield', 'backward', 'lateral', 'forward', 'outfieldBackward', 'gkBackward',
  'pressed', 'unpressed', 'inChooserWindow', 'outsideChooserWindow',
  ...DIST_BANDS, 'dOutsideTable',
  'q0', 'q1', 'q2', 'q3', 'q4',
];
const SLICES_SMALL: readonly string[] = ['all', 'outfieldBackward'];
const slicesOf = (pop: Pop): readonly string[] => (pop === 'ref' ? SLICES_FULL : SLICES_SMALL);

const CELL_KEYS = [
  'n', 'k0', 'k1', 'k2', 'tie', 'marginSum', 'spreadSum', 'noiseErased', 'sigmaSum',
  'quintileFlat', 'quintileImprovesAtCeiling', 'quintileFlatButNotFloorPreferred',
  ...Array.from({ length: MARGIN_BUCKETS }, (_, i) => `h${i}`),
] as const;
type Cell = Record<(typeof CELL_KEYS)[number], number>;
const emptyCell = (): Cell => Object.fromEntries(CELL_KEYS.map((k) => [k, 0])) as Cell;
const addCell = (a: Cell, b: Cell): void => { for (const k of CELL_KEYS) a[k] += b[k]; };
type Cells = Record<Pop, Record<Curve, Record<string, Cell>>>;
const emptyCells = (): Cells => Object.fromEntries(POPS.map((p) => [p,
  Object.fromEntries(CURVES.map((c) => [c,
    Object.fromEntries(slicesOf(p).map((s) => [s, emptyCell()]))])),
])) as Cells;
const addCells = (a: Cells, b: Cells): void => {
  for (const p of POPS) for (const c of CURVES) for (const s of slicesOf(p)) {
    addCell(a[p][c][s], b[p][c][s]);
  }
};

/** the ORIENTATION face's own accumulator (DIVERGENCE-1's measured size; curve-independent). */
const ORI_KEYS = ['n', 'misalignSum', 'mulSum', 'below095', 'below090', 'below085',
  'spanExceedsPowerAxis'] as const;
type OriCell = Record<(typeof ORI_KEYS)[number], number>;
const emptyOri = (): OriCell => Object.fromEntries(ORI_KEYS.map((k) => [k, 0])) as OriCell;
const addOri = (a: OriCell, b: OriCell): void => { for (const k of ORI_KEYS) a[k] += b[k]; };

/* ========================================================================== */
/* §6 THE SCENE — BU-C0's ladder VERBATIM, then the SHIPPED RULE per option     */
/* ========================================================================== */
const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = Math.sqrt((o.pos.x - p.pos.x) ** 2 + (o.pos.y - p.pos.y) ** 2);
    if (d < best) best = d;
  }
  return best;
};

interface SceneOut { cells: Cells; ori: OriCell; ladderNulls: number; ruleNulls: number;
  ruleCalls: number; optionsSeen: number; }

/**
 * ONE reception scene.
 *
 * (1) the LADDER (BU-C0 verbatim) is run at EACH of the three rungs — L1 position on the
 *     engine's own ±2 m band, L2 the oracle's own reachability, L3 `arrivalMargin > 0`, L4 the
 *     engine's corridor sampler — which is what makes the three declared populations possible.
 * (2) for every candidate in the UNION population the SHIPPED RULE is called ONCE PER CURVE.
 *     Nothing about the price is computed here: `preferredPassPower` returns the prices, the
 *     threat seconds, the touch-fail priors and its own `preferredIndex`.
 */
const censusAt = (m: Match, carrier: Player, pressed: boolean): SceneOut => {
  const t = m.teams[carrier.side];
  const opp = m.teams[(1 - carrier.side) as Side];
  const truth = capturePerceptionTruth(m);
  const snapshot = oraclePerceptionSnapshot(truth, carrier.gid);
  const profiles = m.reachProfiles();
  const windowGids = new Set(passChoiceCandidateGids(carrier, t.players));
  const ballLocalX = t.localX(m.ball.pos.x);
  const out: SceneOut = {
    cells: emptyCells(), ori: emptyOri(),
    ladderNulls: 0, ruleNulls: 0, ruleCalls: 0, optionsSeen: 0,
  };
  for (const mate of t.players) {
    if (mate === carrier || mate.sentOff) continue;
    const delta = t.localX(mate.pos.x) - ballLocalX;
    const isBehind = delta <= -FORWARD_BAND_M;
    const isAhead = delta >= FORWARD_BAND_M;
    const isGk = mate.role === 'GK';
    const inWindow = windowGids.has(mate.gid);

    /* ---- the LADDER at each rung (BU-C0's L1∧L2∧L3∧L4, verbatim) ---- */
    const published: boolean[] = [];
    for (const P of POWERS) {
      const res = evaluatePassAffordance({
        snapshot,
        passerGid: carrier.gid,
        targetGid: mate.gid,
        attackDir: t.attackDir,
        reachProfiles: profiles,
        powerMultiplier: P,
      });
      if (res === null) { out.ladderNulls += 1; published.push(false); continue; }
      if (!res.flight.reachable || res.affordance.arrivalMargin <= 0) {
        published.push(false);
        continue;
      }
      let cut = false;
      for (const d of opp.players) {
        if (d.sentOff) continue;
        const facts = evaluatePassCorridorInterception({
          snapshot,
          passerGid: carrier.gid,
          targetGid: mate.gid,
          defenderGid: d.gid,
          reachProfiles: profiles,
          powerMultiplier: P,
        });
        if (facts !== null && facts.earliestFeasiblePoint !== null) { cut = true; break; }
      }
      published.push(!cut);
    }
    const inRef = published[REF_POWER_INDEX];
    const inUnion = published.some(Boolean);
    const inAll3 = published.every(Boolean);
    if (!inUnion) continue;
    out.optionsSeen += 1;

    /* ---- the SHIPPED RULE, once per curve ---- */
    for (const curve of CURVES) {
      out.ruleCalls += 1;
      const pref = preferredPassPower({
        snapshot,
        passerGid: carrier.gid,
        targetGid: mate.gid,
        attackDir: t.attackDir,
        reachProfiles: profiles,
        powers: POWERS,
        heavyTouchCost: curve === 'heavy',
      });
      if (pref === null) { out.ruleNulls += 1; continue; }
      const prices = pref.prices;
      const best = pref.preferredIndex;
      let runnerUp = -1;
      for (let i = 0; i < prices.length; i++) {
        if (i === best) continue;
        if (runnerUp < 0 || prices[i] > prices[runnerUp]) runnerUp = i;
      }
      const margin = Math.abs(prices[best] - prices[runnerUp]);
      const spread = Math.max(...prices) - Math.min(...prices);
      /**
       * ⚠ THE EXECUTION-NOISE PROXY, declared as a PROXY (see §DOUBTS in the stage doc).
       * σ is the SHIPPED law's own standard deviation for THIS passer at the chosen rung
       * (|p−1|·PASS_POWER_NOISE_K·(C − passing), constants extracted from src); the price
       * sensitivity is the FIRST-ORDER slope of the option's OWN measured prices over the
       * expressible span. `noiseErased` = margin < slope·σ. Nothing is re-implemented: σ's
       * law is transcribed from the extracted constants and applied to the passer the sim
       * would use, and the slope is a finite difference of the RULE'S OWN outputs.
       */
      const sigma = Math.abs(POWERS[best] - 1) * PASS_POWER_NOISE_K
        * (NOISE_CONST - carrier.attrs.passing);
      const slope = spread / (PASS_POWER_MAX - PASS_POWER_MIN);
      const noiseErased = margin < slope * sigma;
      let bucket = MARGIN_BUCKETS - 1;
      for (let i = 0; i < MARGIN_EDGES.length; i++) {
        if (margin <= MARGIN_EDGES[i]) { bucket = i; break; }
      }
      /**
       * ⭐⭐ THE MECHANISM FACE. The rule's corridor factor is a QUINTILE lookup — a STEP
       * function of the threat seconds. Where the option's threat quintile is the SAME at all
       * three rungs, the corridor half of the price is IDENTICALLY 1 and the touch-fail ratio
       * alone decides the argmax. Both quintile indices come from the oracle's OWN
       * `threatBandIndex`, on the rule's OWN published threat seconds — nothing is re-priced.
       */
      const qAt = pref.threatSeconds.map((s) => threatBandIndex(s));
      const quintileFlat = qAt.every((q) => q === qAt[REF_POWER_INDEX]);
      const quintileImproves = qAt[qAt.length - 1] < qAt[REF_POWER_INDEX];

      const one = emptyCell();
      one.n = 1;
      one.quintileFlat = quintileFlat ? 1 : 0;
      one.quintileImprovesAtCeiling = quintileImproves ? 1 : 0;
      one.quintileFlatButNotFloorPreferred = quintileFlat && best !== 0 ? 1 : 0;
      one[`k${best}` as 'k0'] = 1;
      one.tie = margin <= TIE_EPS ? 1 : 0;
      one.marginSum = margin;
      one.spreadSum = spread;
      one.noiseErased = noiseErased ? 1 : 0;
      one.sigmaSum = sigma;
      one[`h${bucket}` as 'h0'] += 1;

      /* ---- the slices this option belongs to ---- */
      const threatQuintile = threatBandIndex(pref.threatSeconds[REF_POWER_INDEX]);
      const distance = Math.hypot(mate.pos.x - carrier.pos.x, mate.pos.y - carrier.pos.y);
      const bandIndex = optionSpacePriorBandIndex(distance);
      const sliceNames: string[] = [
        'all',
        isGk ? 'gk' : 'outfield',
        isBehind ? 'backward' : isAhead ? 'forward' : 'lateral',
        pressed ? 'pressed' : 'unpressed',
        inWindow ? 'inChooserWindow' : 'outsideChooserWindow',
        bandIndex === null ? 'dOutsideTable' : DIST_BANDS[bandIndex],
        `q${threatQuintile}`,
      ];
      if (isBehind && !isGk) sliceNames.push('outfieldBackward');
      if (isBehind && isGk) sliceNames.push('gkBackward');
      for (const pop of POPS) {
        const inPop = pop === 'ref' ? inRef : pop === 'union' ? inUnion : inAll3;
        if (!inPop) continue;
        const target = out.cells[pop][curve];
        for (const s of sliceNames) {
          if (target[s] !== undefined) addCell(target[s], one);
        }
      }
    }

    /* ---- ⭐ THE ORIENTATION FACE (DIVERGENCE-1, measured on the same scenes) ---- */
    if (inRef) {
      const dx = mate.pos.x - carrier.pos.x;
      const dy = mate.pos.y - carrier.pos.y;
      const len = Math.hypot(dx, dy);
      if (len > 1e-8) {
        const misalign = kickMisalignment(carrier, { x: dx / len, y: dy / len });
        const mul = orientationPowerMul(misalign, carrier.attrs.passing);
        out.ori.n += 1;
        out.ori.misalignSum += misalign;
        out.ori.mulSum += mul;
        if (mul < 0.95) out.ori.below095 += 1;
        if (mul < 0.90) out.ori.below090 += 1;
        if (mul < PASS_POWER_MIN) out.ori.below085 += 1;
        if (1 - mul > PASS_POWER_MAX - 1) out.ori.spanExceedsPowerAxis += 1;
      }
    }
  }
  return out;
};

/* ========================================================================== */
/* §7 THE WALK — PW-C0's reception population VERBATIM                         */
/* ========================================================================== */
interface Row {
  seed: number;
  signature: string;
  armOk: boolean;
  receptions: number;
  receptionsPressed: number;
  cells: Cells;
  ori: OriCell;
  ladderNulls: number; ruleNulls: number; ruleCalls: number; optionsSeen: number;
  ticks: number; inPlayTicks: number; simSeconds: number; goals: number; enginePasses: number;
}
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

const walk = (seed: number, measure = true): Row => {
  const m = matchOf(seed);
  const armOk = Object.values(armConjuncts(m)).every(Boolean);
  const row: Row = {
    seed, signature: '', armOk, receptions: 0, receptionsPressed: 0,
    cells: emptyCells(), ori: emptyOri(),
    ladderNulls: 0, ruleNulls: 0, ruleCalls: 0, optionsSeen: 0,
    ticks: 0, inPlayTicks: 0, simSeconds: 0, goals: 0, enginePasses: 0,
  };
  let prevOwnerGid: number | null = null;
  let inPlayTicks = 0;
  while (!m.finished) {
    m.step(DT);
    if (m.phase !== 'playing') { prevOwnerGid = null; continue; }
    inPlayTicks++;
    const owner = m.ball.owner;
    if (owner === null) { prevOwnerGid = null; continue; }
    const ownerGid = owner.gid;
    const isReception = ownerGid !== prevOwnerGid;
    if (measure && isReception) {
      const pressed = nearestOpponent(m, owner) <= PRESSURE_R;
      const scene = censusAt(m, owner, pressed);
      row.receptions += 1;
      if (pressed) row.receptionsPressed += 1;
      addCells(row.cells, scene.cells);
      addOri(row.ori, scene.ori);
      row.ladderNulls += scene.ladderNulls;
      row.ruleNulls += scene.ruleNulls;
      row.ruleCalls += scene.ruleCalls;
      row.optionsSeen += scene.optionsSeen;
    }
    prevOwnerGid = ownerGid;
  }
  row.signature = signature(m);
  row.ticks = m.simTick;
  row.inPlayTicks = inPlayTicks;
  row.simSeconds = m.simTime;
  row.goals = m.teams[0].stats.goals + m.teams[1].stats.goals;
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  return row;
};

/* ========================================================================== */
/* §8 THE BATTERY                                                              */
/* ========================================================================== */
const N_RUN = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' && N_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);
interface Battery { rows: Row[] }
const runBattery = (): Battery => {
  const rows: Row[] = [];
  for (let i = 0; i < N_RUN; i++) {
    rows.push(walk(BASE_RUN + i));
    if ((i + 1) % 10 === 0) banner(`  [pw-t0a] ${i + 1}/${N_RUN} walks done`);
  }
  return { rows };
};

/* ========================================================================== */
/* §9 THE FACES — every one a RATIO OF SUMS over the stored per-seed cells      */
/* ========================================================================== */
interface Metric {
  key: string; unit: string; what: string; starred: boolean;
  num: (c: Cell) => number;
}
const METRICS: readonly Metric[] = [
  { key: 'sharePreferring0850', unit: 'share of options', starred: true,
    what: '⭐⭐ the share of options whose argmax price is the FLOOR rung 0.85 (the softest ball)',
    num: (c) => c.k0 },
  { key: 'sharePreferring1000', unit: 'share of options', starred: true,
    what: '⭐⭐ the share of options whose argmax price is the SHIPPED DEFAULT 1.00',
    num: (c) => c.k1 },
  { key: 'sharePreferring1150', unit: 'share of options', starred: true,
    what: '⭐⭐ THE DEGENERACY FACE — the share of options whose argmax price is the CEILING '
      + 'rung 1.15 (the firmest expressible ball)',
    num: (c) => c.k2 },
  { key: 'tieShareAtFloatEpsilon', unit: 'share of options', starred: true,
    what: '⭐ THE PLATEAU FACE — the share whose top two prices are within the DERIVED float '
      + 'epsilon; on these the rule\'s first-wins argmax is an artefact of ordering, not a choice',
    num: (c) => c.tie },
  { key: 'meanMarginOfPreference', unit: 'price units', starred: true,
    what: '⭐⭐ THE MARGIN OF PREFERENCE — mean |price(argmax) − price(runner-up)|. A preference '
      + 'the noise floor erases is not a preference.',
    num: (c) => c.marginSum },
  { key: 'meanPriceSpreadAcrossTheLadder', unit: 'price units', starred: false,
    what: 'mean (max − min) price across the three rungs — how much the whole weight axis is '
      + 'worth to this option at all',
    num: (c) => c.spreadSum },
  { key: 'shareMarginBelowTheExecutionNoiseProxy', unit: 'share of options', starred: true,
    what: '⚠ PROXY (see §DOUBTS): the share whose margin is smaller than slope·σ, where σ is the '
      + 'SHIPPED execution law\'s own sigma for this passer at the chosen rung and the slope is '
      + 'a finite difference of the RULE\'S OWN prices. First-order, declared, not a re-derivation.',
    num: (c) => c.noiseErased },
  { key: 'shareWhoseThreatQuintileIsFlatAcrossTheLadder', unit: 'share of options', starred: true,
    what: '⭐⭐ THE MECHANISM — the share of options whose THREAT QUINTILE is identical at all '
      + 'three rungs. On these the rule\'s corridor factor is identically 1 and the touch-fail '
      + 'ratio ALONE decides the argmax; the corridor gain a firmer ball buys is invisible to a '
      + 'STEP function that never steps.',
    num: (c) => c.quintileFlat },
  { key: 'shareWhoseThreatQuintileImprovesAtTheCeiling', unit: 'share of options', starred: true,
    what: '⭐ the share whose threat quintile actually IMPROVES (a lower index) at the ceiling '
      + 'rung — the options on which a firmer ball buys the rule anything at all',
    num: (c) => c.quintileImprovesAtCeiling },
  { key: 'shareFlatQuintileWhereTheFloorDidNotWin', unit: 'share of options', starred: false,
    what: '⭐ THE TOUCH-RATIO INVERSION — options whose corridor factor never steps yet whose '
      + 'argmax is NOT the floor. The touch price is a function of the CLOSING speed (ball minus '
      + 'the receiver\'s own motion), so a firmer ball can arrive with a LOWER relative speed; '
      + 'this face counts how often that happens.',
    num: (c) => c.quintileFlatButNotFloorPreferred },
  { key: 'meanExecutionSigmaAtTheChosenRung', unit: 'power multiplier units', starred: false,
    what: 'mean σ of the execution error at the rung the rule chose — identically 0 wherever the '
      + 'rule chooses the shipped default (executedPassPower(1) = 1 draws no RNG)',
    num: (c) => c.sigmaSum },
];
type Face = { face: string; metric: Metric; pop: Pop; slice: string };
const FACES: Face[] = [];
for (const pop of POPS) {
  for (const slice of slicesOf(pop)) {
    for (const metric of METRICS) {
      FACES.push({ face: `${metric.key}__${pop}__${slice}`, metric, pop, slice });
    }
  }
}
const FACE_KEYS = FACES.map((f) => f.face);

let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
interface CurveCol { point: number; num: number; den: number; ci95: [number, number] }
interface FaceRow {
  face: string; unit: string; what: string; starred: boolean; pop: Pop; slice: string;
  curves: Record<string, CurveCol>;
  contrast: {
    delta: number; ci95: [number, number]; relative: number; halfWidth: number;
    absOverHalfWidth: number; resolved: boolean;
  };
}
const makeDraws = (K: number): number[][] => {
  resetStats();
  const draws: number[][] = [];
  for (let d = 0; d < BOOTSTRAP; d++) {
    const idx: number[] = [];
    for (let i = 0; i < K; i++) idx.push(Math.floor(statsRng.next() * K) % K);
    draws.push(idx);
  }
  return draws;
};
const bootstrapColumn = (
  nums: readonly number[], dens: readonly number[], draws: readonly number[][],
): { point: number; ci95: [number, number]; vals: number[] } => {
  const point = ratio(sum(nums), sum(dens));
  const vals: number[] = [];
  for (const idx of draws) {
    let nn = 0; let dd = 0;
    for (const i of idx) { nn += nums[i]; dd += dens[i]; }
    vals.push(ratio(nn, dd));
  }
  const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
  return {
    point,
    ci95: s.length === 0 ? [Number.NaN, Number.NaN]
      : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
    vals,
  };
};
const scoreFaces = (b: Battery): FaceRow[] => {
  const draws = makeDraws(b.rows.length);
  const out: FaceRow[] = [];
  for (const f of FACES) {
    const curves: Record<string, CurveCol> = {};
    const point: Record<string, number> = {};
    const drawVals: Record<string, number[]> = {};
    for (const c of CURVES) {
      const nums = b.rows.map((r) => f.metric.num(r.cells[f.pop][c][f.slice]));
      const dens = b.rows.map((r) => r.cells[f.pop][c][f.slice].n);
      const col = bootstrapColumn(nums, dens, draws);
      point[c] = col.point;
      drawVals[c] = col.vals;
      curves[c] = { point: col.point, num: sum(nums), den: sum(dens), ci95: col.ci95 };
    }
    const diffs: number[] = [];
    for (let d = 0; d < BOOTSTRAP; d++) diffs.push(drawVals.heavy[d] - drawVals.base[d]);
    const s = diffs.filter(Number.isFinite).sort((x, y) => x - y);
    const lo = s.length === 0 ? Number.NaN : s[Math.floor(0.025 * s.length)];
    const hi = s.length === 0 ? Number.NaN
      : s[Math.min(s.length - 1, Math.floor(0.975 * s.length))];
    const delta = point.heavy - point.base;
    const halfWidth = (hi - lo) / 2;
    out.push({
      face: f.face, unit: f.metric.unit, what: f.metric.what, starred: f.metric.starred,
      pop: f.pop, slice: f.slice, curves,
      contrast: {
        delta, ci95: [lo, hi],
        relative: point.base === 0 ? Number.NaN : delta / point.base,
        halfWidth,
        absOverHalfWidth: halfWidth === 0 ? Number.NaN : Math.abs(delta) / halfWidth,
        resolved: (lo > 0 && hi > 0) || (lo < 0 && hi < 0),
      },
    });
  }
  return out;
};

/** the ORIENTATION block — one curve-independent population, its own bootstrap. */
interface OriFace { face: string; unit: string; what: string; point: number; num: number;
  den: number; ci95: [number, number]; }
const ORI_FACES: readonly { key: string; unit: string; what: string; num: (o: OriCell) => number;
  den: (o: OriCell) => number }[] = [
  { key: 'meanKickMisalignmentToTheOption', unit: '(1−cosθ)/2',
    what: 'the passer\'s own body misalignment toward this option (the sim\'s own '
      + '`kickMisalignment`); 0 = striking dead ahead, 0.5 = square across the body',
    num: (o) => o.misalignSum, den: (o) => o.n },
  { key: 'meanOrientationPowerMultiplier', unit: 'power multiplier',
    what: '⭐⭐ DIVERGENCE-1 MEASURED — the sim\'s own `orientationPowerMul` on the published '
      + 'options; the ORACLE that prices every rung above carries NO orientation term at all',
    num: (o) => o.mulSum, den: (o) => o.n },
  { key: 'shareOfOptionsBelowOrientation095', unit: 'share of options',
    what: 'options the passer\'s body already costs more than 5 % of ball pace',
    num: (o) => o.below095, den: (o) => o.n },
  { key: 'shareOfOptionsBelowOrientation090', unit: 'share of options',
    what: 'options the passer\'s body already costs more than 10 % of ball pace',
    num: (o) => o.below090, den: (o) => o.n },
  { key: 'shareOfOptionsBelowThePowerFloor', unit: 'share of options',
    what: `⭐ options whose orientation multiplier is BELOW the substrate's own power floor `
      + `(${PASS_POWER_MIN}) — the passer's body has already taken more pace off the ball than `
      + 'the softest weight a chooser could pick',
    num: (o) => o.below085, den: (o) => o.n },
  { key: 'shareWhereOrientationLossExceedsTheCeilingGain', unit: 'share of options',
    what: `⭐⭐ options where (1 − orientation) exceeds the whole ceiling gain `
      + `(${round(PASS_POWER_MAX - 1, 2)}) — the blind term is LARGER than the axis being priced`,
    num: (o) => o.spanExceedsPowerAxis, den: (o) => o.n },
];
const scoreOrientation = (b: Battery): OriFace[] => {
  const draws = makeDraws(b.rows.length);
  return ORI_FACES.map((f) => {
    const nums = b.rows.map((r) => f.num(r.ori));
    const dens = b.rows.map((r) => f.den(r.ori));
    const col = bootstrapColumn(nums, dens, draws);
    return {
      face: f.key, unit: f.unit, what: f.what,
      point: col.point, num: sum(nums), den: sum(dens), ci95: col.ci95,
    };
  });
};

/* ========================================================================== */
/* §10 THE DETERMINISTIC CORE (G-DET runs it twice)                            */
/* ========================================================================== */
interface Core { battery: Battery; faces: FaceRow[]; ori: OriFace[] }
const runCore = (): Core => {
  const battery = runBattery();
  return { battery, faces: scoreFaces(battery), ori: scoreOrientation(battery) };
};
const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, sig: r.signature, armOk: r.armOk,
  rec: r.receptions, recP: r.receptionsPressed,
  cells: r.cells, ori: r.ori,
  ladderNulls: r.ladderNulls, ruleNulls: r.ruleNulls, ruleCalls: r.ruleCalls,
  optionsSeen: r.optionsSeen,
  ticks: r.ticks, inPlay: r.inPlayTicks, simS: r.simSeconds, goals: r.goals, passes: r.enginePasses,
});
const coreDigest = (c: Core): string => sha(canonical({
  faces: c.faces, ori: c.ori, rows: c.battery.rows.map(cellOf),
}));

banner(`  [pw-t0a] mode=${MODE} N=${N_RUN} seeds × ${POWERS.length} rungs × ${CURVES.length} `
  + 'curves × 2 G-DET runs');
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [pw-t0a] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;
const rows = (): Row[] => C.battery.rows;

/* ---- the NON-PERTURBATION control: the same worlds, instrument OFF ---- */
const perturbCheck = (() => {
  let ok = 0; let total = 0;
  const n = Math.min(PERTURB_CHECK_SEEDS, N_RUN);
  for (let i = 0; i < n; i++) {
    const quiet = walk(BASE_RUN + i, false);
    total += 1;
    if (quiet.signature === rows()[i].signature && quiet.enginePasses === rows()[i].enginePasses) {
      ok += 1;
    }
  }
  return { ok, total };
})();

/* ========================================================================== */
/* §11 THE READINGS THE GATES SCORE                                            */
/* ========================================================================== */
const armOkCount = rows().filter((r) => r.armOk).length;
const armTotal = rows().length;
const armedProbe = matchOf(GWORLD_SEED);
const bareProbe = matchOf(GWORLD_SEED, true);
const worldSeedOk = l3ArmedVersion(armedProbe) === L3_WORLD_VERSION
  && a4ArmedVersion(bareProbe) === 0;

/** ⭐⭐ THE PAIRING RECEIPT — the two CURVES see the IDENTICAL option population, per slice. */
const pairing = (() => {
  let checked = 0; let bad = 0;
  for (const r of rows()) {
    for (const p of POPS) {
      for (const s of slicesOf(p)) {
        checked += 1;
        if (r.cells[p].base[s].n !== r.cells[p].heavy[s].n) bad += 1;
      }
    }
  }
  return { checked, bad };
})();

/** ⭐ THE CURVE RECEIPT — both curves ran, and they are NOT the same instrument. */
const curveReceipt = (() => {
  const perCurve: Record<string, { options: number; margin: number; prefersMax: number }> = {};
  for (const c of CURVES) {
    let options = 0; let margin = 0; let prefersMax = 0;
    for (const r of rows()) {
      const cell = r.cells.ref[c].all;
      options += cell.n; margin += cell.marginSum; prefersMax += cell.k2;
    }
    perCurve[c] = { options, margin, prefersMax };
  }
  return perCurve;
})();
const bothCurvesRan = CURVES.every((c) => curveReceipt[c].options > 0);
const theCurvesDiffer = curveReceipt.base.margin !== curveReceipt.heavy.margin;

/** ⭐ THE RULE RECEIPT — the shipped rule was actually asked, and it answered. */
const ruleReceipt = {
  calls: sum(rows().map((r) => r.ruleCalls)),
  nulls: sum(rows().map((r) => r.ruleNulls)),
  optionsSeen: sum(rows().map((r) => r.optionsSeen)),
  ladderNulls: sum(rows().map((r) => r.ladderNulls)),
};
const everyRungWasReachedByTheRule = (() => {
  /* every one of the three rungs is chosen by SOMEBODY under at least one curve, or the
     distribution is degenerate — recorded as a READING, never gated on. */
  const counts = [0, 0, 0];
  for (const r of rows()) {
    for (const c of CURVES) {
      counts[0] += r.cells.ref[c].all.k0;
      counts[1] += r.cells.ref[c].all.k1;
      counts[2] += r.cells.ref[c].all.k2;
    }
  }
  return counts;
})();

/** NON-VACUITY: every published face's denominator, per curve — and the BU-T1 form of the
 *  distinction between "never occurred" and "unmeasured". Every slice IS scanned on every
 *  option (the slice map is exhaustive), so a zero denominator here means NEVER OCCURRED. */
const vacuity = (() => {
  const empties: string[] = [];
  let cells = 0;
  for (const f of C.faces) {
    for (const c of CURVES) {
      cells += 1;
      if (f.curves[c].den === 0) empties.push(`${c}.${f.face}`);
    }
  }
  return { cells, empties };
})();
const SLICE_TOTAL = POPS.reduce((a, p) => a + slicesOf(p).length, 0);
const everySliceWasScanned = SLICE_TOTAL === POPS.reduce(
  (a, p) => a + Object.keys(rows()[0].cells[p].base).length, 0);

/** the margin HISTOGRAM, published raw so any threshold can be applied afterwards. */
const histogramBlock = (() => {
  const out: Record<string, unknown> = {};
  for (const p of POPS) {
    for (const c of CURVES) {
      for (const s of slicesOf(p)) {
        if (!SLICES_SMALL.includes(s)) continue;
        out[`${p}.${c}.${s}`] = {
          buckets: Array.from({ length: MARGIN_BUCKETS }, (_, i) => sum(rows()
            .map((r) => r.cells[p][c][s][`h${i}` as 'h0']))),
          denominator: sum(rows().map((r) => r.cells[p][c][s].n)),
        };
      }
    }
  }
  return out;
})();

/* ========================================================================== */
/* §12 gFaces — RE-DERIVED FROM THE SERIALIZED ARTIFACT ON DISK (#287.1)        */
/* ========================================================================== */
const rederiveFromDisk = (path: string): { checked: number; bad: number; parsed: boolean } => {
  let file: Record<string, unknown>;
  try { file = readJson(path); } catch { return { checked: 0, bad: 1, parsed: false }; }
  const cells = (file.perSeedCells ?? []) as Record<string, unknown>[];
  const faces = (file.faces ?? []) as Record<string, unknown>[];
  if (cells.length === 0 || faces.length === 0) return { checked: 0, bad: 1, parsed: false };
  const byKey = new Map(FACES.map((f) => [f.face, f]));
  let checked = 0; let bad = 0;
  for (const fr of faces) {
    const key = String(fr.face);
    const spec = byKey.get(key);
    if (spec === undefined) { bad += 1; continue; }
    const published = fr.curves as Record<string, { point: number | string }>;
    for (const c of CURVES) {
      checked += 1;
      let n = 0; let d = 0;
      for (const cell of cells) {
        const cc = ((cell.cells as Record<string, Record<string, Record<string, Cell>>>)
        )[spec.pop][c][spec.slice];
        n += spec.metric.num(cc);
        d += cc.n;
      }
      const want = ratio(n, d);
      const got = published[c].point;
      if (d === 0) { if (got !== 'NEVER-OCCURRED') bad += 1; continue; }
      if (typeof got !== 'number' || Math.abs(round(want) - got) > 1e-9) bad += 1;
    }
  }
  return { checked, bad, parsed: true };
};

/* ---- gSeed ---- */
const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{ name: 'PW-T0a battery', range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'PW-T0a smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'PW-T0a preflight/guard block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: 'PW-T0a world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = rows().every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1);
const allSeedsInTheDispatchedBlock = CLAIMED
  .every((c) => c.range[0] >= 12_491_000 && c.range[1] <= 12_491_999);

/* ========================================================================== */
/* §13 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
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

/* ---- 2 xSrcUntouched (the CORRECTED form: BU-C0 §CORRECTIONS 5, ruling #286.1) ---- */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noDiffAgainstHead: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noDiffAgainstHead', name: 'src moved against HEAD', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 gArms ---- */
registerGate<{ ok: number; total: number; probe: boolean }>({
  name: 'gArms',
  fn: (i) => ({
    everyWalkedMatchCarriesTheV7ArmLive: i.ok === i.total,
    theIdentitySeedSeparatesTheTwoWorlds: i.probe,
    nonVacuousWalkCount: i.total > 0,
  }),
  input: { ok: armOkCount, total: armTotal, probe: worldSeedOk },
  mutants: [
    { conjunct: 'everyWalkedMatchCarriesTheV7ArmLive', name: 'a walk was not the v7 world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theIdentitySeedSeparatesTheTwoWorlds', name: 'the worlds were indistinguishable', mutate: (i) => ({ ...i, probe: false }) },
    { conjunct: 'nonVacuousWalkCount', name: 'nothing was walked', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 4 gDose — ⭐ #289 canon: hash the FILE BYTES, re-derive the digest from them ---- */
const doseLabels = sum(DOSE.map((c) => c.lunges));
registerGate<{ rederived: string; bytes: string; labels: number; groups: number }>({
  name: 'gDose',
  fn: (i) => ({
    theDoseArtifactsOwnBytesRederiveTheShippedDigest: i.rederived === L3_T1_SHA,
    theBytesWereActuallyHashed: i.bytes.length === 64,
    theDoseIsNonEmpty: i.labels > 0,
    theDoseHasBothArrivalGroups: i.groups === 2,
  }),
  input: {
    rederived: DOSE_REDERIVED_SHA, bytes: DOSE_FILE_BYTES_SHA,
    labels: doseLabels, groups: DOSE.length,
  },
  mutants: [
    { conjunct: 'theDoseArtifactsOwnBytesRederiveTheShippedDigest', name: 'the exam artifact bytes were swapped', mutate: (i) => ({ ...i, rederived: 'deadbeef' }) },
    { conjunct: 'theBytesWereActuallyHashed', name: 'the byte hash was never taken', mutate: (i) => ({ ...i, bytes: '' }) },
    { conjunct: 'theDoseIsNonEmpty', name: 'the dose was empty', mutate: (i) => ({ ...i, labels: 0 }) },
    { conjunct: 'theDoseHasBothArrivalGroups', name: 'a group went missing', mutate: (i) => ({ ...i, groups: 1 }) },
  ],
});

/* ---- 5 gNonPerturbing ---- */
registerGate<{ ok: number; total: number }>({
  name: 'gNonPerturbing',
  fn: (i) => ({
    theInstrumentedWalkIsTheQuietWalk: i.ok === i.total,
    nonVacuousControlCount: i.total > 0,
  }),
  input: perturbCheck,
  mutants: [
    { conjunct: 'theInstrumentedWalkIsTheQuietWalk', name: 'the oracle changed the world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'nonVacuousControlCount', name: 'no control walk ran', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
  ],
});

/* ---- 6 gRule — ⭐⭐ THE SHIPPED RULE IS THE ONE MEASURED, AND NOTHING IS RE-IMPLEMENTED ---- */
registerGate<{
  hits: number; calls: boolean; traced: boolean; strict: boolean; canary: boolean;
  canaryLine: number; feeds: boolean; mirror: boolean; noise: number; ruleCalls: number;
}>({
  name: 'gRule',
  fn: (i) => ({
    noParallelPricingIdentifierAppearsInThisProbe: i.hits === 0,
    thisProbeCallsTheShippedRule: i.calls,
    theJoiningRuleWasTracedInTheShippedFile: i.traced,
    theRulesArgmaxIsFirstWinsOnAnExactTie: i.strict,
    theCanaryLadderLiteralIsTheSubstratesOwn: i.canary,
    theCanaryLadderWasFoundInTheBrain: i.canaryLine > 0,
    theBrainFeedsThatLadderToThisRule: i.feeds,
    theOracleMirrorRestatesTheSHIPPEDCurveConstants: i.mirror,
    theExecutionNoiseLawWasExtractedFromSrc: Number.isFinite(i.noise) && i.noise > 0,
    theRuleWasActuallyAsked: i.ruleCalls > 0,
  }),
  input: {
    hits: PARALLEL_ORACLE_HITS.length, calls: OWN_CALLS_THE_SHIPPED_RULE, traced: RULE_TRACED,
    strict: RULE_ARGMAX_IS_STRICT, canary: CANARY_LITERAL_MATCHES_OUR_LADDER,
    canaryLine: CANARY_LINE, feeds: CANARY_FEEDS_THE_RULE,
    mirror: MIRROR_MATCHES_TOUCH_SPEED_COST, noise: NOISE_CONST, ruleCalls: ruleReceipt.calls,
  },
  mutants: [
    { conjunct: 'noParallelPricingIdentifierAppearsInThisProbe', name: 'a second pricing table was born in the probe', mutate: (i) => ({ ...i, hits: 1 }) },
    { conjunct: 'thisProbeCallsTheShippedRule', name: 'the probe stopped calling the shipped rule', mutate: (i) => ({ ...i, calls: false }) },
    { conjunct: 'theJoiningRuleWasTracedInTheShippedFile', name: 'the joining rule moved in src', mutate: (i) => ({ ...i, traced: false }) },
    { conjunct: 'theRulesArgmaxIsFirstWinsOnAnExactTie', name: 'the argmax tie-break changed', mutate: (i) => ({ ...i, strict: false }) },
    { conjunct: 'theCanaryLadderLiteralIsTheSubstratesOwn', name: 'the ladder stopped being the substrate\'s', mutate: (i) => ({ ...i, canary: false }) },
    { conjunct: 'theCanaryLadderWasFoundInTheBrain', name: 'the canary declaration vanished', mutate: (i) => ({ ...i, canaryLine: 0 }) },
    { conjunct: 'theBrainFeedsThatLadderToThisRule', name: 'the brain stopped feeding the ladder to the rule', mutate: (i) => ({ ...i, feeds: false }) },
    { conjunct: 'theOracleMirrorRestatesTheSHIPPEDCurveConstants', name: 'the mirror drifted from TOUCH_SPEED_COST', mutate: (i) => ({ ...i, mirror: false }) },
    { conjunct: 'theExecutionNoiseLawWasExtractedFromSrc', name: 'the noise law stopped tracing', mutate: (i) => ({ ...i, noise: Number.NaN }) },
    { conjunct: 'theRuleWasActuallyAsked', name: 'the rule was never called', mutate: (i) => ({ ...i, ruleCalls: 0 }) },
  ],
});

/* ---- 7 gCurves — BOTH shipped curves, selected the way the engine selects them ---- */
registerGate<{ both: boolean; differ: boolean; shipped: boolean; base: number; heavy: number }>({
  name: 'gCurves',
  fn: (i) => ({
    bothShippedCurvesWereEvaluated: i.both,
    theTwoCurvesAreNotTheSameInstrument: i.differ,
    theWalkedWorldsOwnSelectorIsTheBaseCurve: i.shipped,
    theCurveSpansAreTheShippedConstants: i.base === TOUCH_SPEED_COST.base.span
      && i.heavy === TOUCH_SPEED_COST.heavy.span,
  }),
  input: {
    both: bothCurvesRan, differ: theCurvesDiffer,
    shipped: !(matchOf(GWORLD_SEED) as unknown as { edsTouchCost: boolean }).edsTouchCost,
    base: TOUCH_SPEED_COST.base.span, heavy: TOUCH_SPEED_COST.heavy.span,
  },
  mutants: [
    { conjunct: 'bothShippedCurvesWereEvaluated', name: 'a curve never ran', mutate: (i) => ({ ...i, both: false }) },
    { conjunct: 'theTwoCurvesAreNotTheSameInstrument', name: 'the curve switch did nothing', mutate: (i) => ({ ...i, differ: false }) },
    { conjunct: 'theWalkedWorldsOwnSelectorIsTheBaseCurve', name: 'the walked world ran the heavy curve', mutate: (i) => ({ ...i, shipped: false }) },
    { conjunct: 'theCurveSpansAreTheShippedConstants', name: 'a curve constant was replaced', mutate: (i) => ({ ...i, base: 1 }) },
  ],
});

/* ---- 8 gPaired — the two curves see the IDENTICAL option population ---- */
registerGate<{ checked: number; bad: number; slices: number; pops: number }>({
  name: 'gPaired',
  fn: (i) => ({
    bothCurvesSeeTheIdenticalOptionPopulation: i.bad === 0,
    everyDeclaredSliceExists: i.slices === SLICE_TOTAL,
    allThreeDeclaredPopulationsArePublished: i.pops === POPS.length,
    nonVacuousPairingCheck: i.checked > 0,
  }),
  input: {
    checked: pairing.checked, bad: pairing.bad,
    slices: POPS.reduce((a, p) => a + Object.keys(rows()[0].cells[p].base).length, 0),
    pops: POPS.length,
  },
  mutants: [
    { conjunct: 'bothCurvesSeeTheIdenticalOptionPopulation', name: 'a curve saw a different population', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyDeclaredSliceExists', name: 'a slice went missing', mutate: (i) => ({ ...i, slices: 1 }) },
    { conjunct: 'allThreeDeclaredPopulationsArePublished', name: 'a declared population vanished', mutate: (i) => ({ ...i, pops: 1 }) },
    { conjunct: 'nonVacuousPairingCheck', name: 'the pairing was never checked', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 9 gDivergence — ⭐ #291.5 canon: DIFF THE TERM LISTS, never the shared expression ---- */
registerGate<{
  simTerms: number; oracleTerms: number; orientation: boolean; execution: boolean;
  simOnly: number;
}>({
  name: 'gDivergence',
  fn: (i) => ({
    bothImplementationBodiesWereExtracted: i.simTerms > 0 && i.oracleTerms > 0,
    theTermListsWereActuallyDiffed: i.simOnly > 0,
    orientationIsASIMONLYTerm: i.orientation,
    theExecutionErrorIsASIMONLYTerm: i.execution,
  }),
  input: {
    simTerms: SIM_TERMS.length, oracleTerms: ORACLE_TERMS.length,
    orientation: ORIENTATION_IS_SIM_ONLY, execution: EXECUTION_ERROR_IS_SIM_ONLY,
    simOnly: SIM_ONLY_TERMS.length,
  },
  mutants: [
    { conjunct: 'bothImplementationBodiesWereExtracted', name: 'a function body stopped being found', mutate: (i) => ({ ...i, simTerms: 0 }) },
    { conjunct: 'theTermListsWereActuallyDiffed', name: 'the diff was vacuous', mutate: (i) => ({ ...i, simOnly: 0 }) },
    { conjunct: 'orientationIsASIMONLYTerm', name: 'the oracle grew an orientation term (DIVERGENCE-1 closed)', mutate: (i) => ({ ...i, orientation: false }) },
    { conjunct: 'theExecutionErrorIsASIMONLYTerm', name: 'the oracle grew the execution error', mutate: (i) => ({ ...i, execution: false }) },
  ],
});

/* ---- 10 gEpsilon — the tie threshold is FLOAT PRECISION, not taste ---- */
registerGate<{
  eps: number; epsScale: number; edges: number; buckets: number; firstEdge: number;
}>({
  name: 'gEpsilon',
  fn: (i) => ({
    theEpsilonIsAMachineEpsilonMultiple: i.eps === 16 * Number.EPSILON,
    theEpsilonIsFarBelowAnyPriceScale: i.epsScale > 0 && i.epsScale < 1e-12,
    theHistogramStartsAtTheEpsilon: i.firstEdge === TIE_EPS,
    theHistogramCoversEveryMargin: i.buckets === i.edges + 1,
  }),
  input: {
    eps: TIE_EPS, epsScale: TIE_EPS, edges: MARGIN_EDGES.length, buckets: MARGIN_BUCKETS,
    firstEdge: MARGIN_EDGES[0],
  },
  mutants: [
    { conjunct: 'theEpsilonIsAMachineEpsilonMultiple', name: 'the epsilon became taste', mutate: (i) => ({ ...i, eps: 0.01 }) },
    { conjunct: 'theEpsilonIsFarBelowAnyPriceScale', name: 'the epsilon grew into the data', mutate: (i) => ({ ...i, epsScale: 1e-3 }) },
    { conjunct: 'theHistogramStartsAtTheEpsilon', name: 'the histogram lost its tie bucket', mutate: (i) => ({ ...i, firstEdge: 1 }) },
    { conjunct: 'theHistogramCoversEveryMargin', name: 'a margin could fall off the histogram', mutate: (i) => ({ ...i, buckets: 1 }) },
  ],
});

/* ---- 11 gNonVacuity — denominators shown; NEVER-OCCURRED is not UNMEASURED (BU-T1 form) ---- */
const denominatorsPublished = C.faces
  .reduce((a, f) => a + CURVES.filter((c) => Number.isFinite(f.curves[c].den)).length, 0);
registerGate<{ dens: number; cells: number; scanned: boolean; options: number }>({
  name: 'gNonVacuity',
  fn: (i) => ({
    everySliceIsScannedOnEveryOptionSoAZeroIsNeverOccurred: i.scanned,
    thePrimaryPopulationIsNonEmpty: i.options > 0,
    nonVacuousCellCount: i.cells > 0,
    everyPublishedFaceCarriesItsOwnDenominator: i.dens === i.cells,
  }),
  input: {
    dens: denominatorsPublished, cells: vacuity.cells, scanned: everySliceWasScanned,
    options: sum(rows().map((r) => r.cells.ref.base.all.n)),
  },
  mutants: [
    { conjunct: 'everySliceIsScannedOnEveryOptionSoAZeroIsNeverOccurred', name: 'a slice stopped being scanned', mutate: (i) => ({ ...i, scanned: false }) },
    { conjunct: 'thePrimaryPopulationIsNonEmpty', name: 'the primary population was empty', mutate: (i) => ({ ...i, options: 0 }) },
    { conjunct: 'nonVacuousCellCount', name: 'nothing was published', mutate: (i) => ({ ...i, cells: 0, dens: 0 }) },
    { conjunct: 'everyPublishedFaceCarriesItsOwnDenominator', name: 'a face was published without its denominator', mutate: (i) => ({ ...i, dens: i.dens - 1 }) },
  ],
});

/* ---- 12 gFaces — parses the SERIALIZED artifact back off disk (#287.1) ---- */
const gFacesInput = { checked: 0, bad: 1, parsed: false, keys: 0 };
registerGate<typeof gFacesInput>({
  name: 'gFaces',
  fn: (i) => ({
    theSerializedArtifactParsesBackOffDisk: i.parsed,
    everyPublishedPointRederivesFromTheStoredCells: i.bad === 0,
    everyFrozenFaceIsPublished: i.keys === FACE_KEYS.length,
    nonVacuousRederivationCount: i.checked > 0,
  }),
  input: gFacesInput,
  mutants: [
    { conjunct: 'theSerializedArtifactParsesBackOffDisk', name: 'the artifact could not be re-read', mutate: (i) => ({ ...i, parsed: false }) },
    { conjunct: 'everyPublishedPointRederivesFromTheStoredCells', name: 'a point did not re-derive', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'everyFrozenFaceIsPublished', name: 'a face went missing', mutate: (i) => ({ ...i, keys: i.keys - 1 }) },
    { conjunct: 'nonVacuousRederivationCount', name: 'nothing was re-derived', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 13 gClock ---- */
const clockOk = rows().every((r) => r.ticks > 0 && r.simSeconds > 0);
registerGate<{ durationOk: boolean; displayOk: boolean; mappingOk: boolean; walks: boolean }>({
  name: 'gClock',
  fn: (i) => ({
    theMatchClockIsTheEngineDefault: i.durationOk,
    theDisplayMinutesCameOutOfTheEnginesOwnExpression: i.displayOk,
    theMappingIsDerivedNotTyped: i.mappingOk,
    everyWalkRanOnTheMatchClock: i.walks,
  }),
  input: {
    durationOk: MATCH_DURATION === 240,
    displayOk: DISPLAY_MINUTES === 90,
    mappingOk: Math.abs(DISPLAY_S_PER_SIM_S - (DISPLAY_MINUTES * 60) / MATCH_DURATION) < 1e-12,
    walks: clockOk,
  },
  mutants: [
    { conjunct: 'theMatchClockIsTheEngineDefault', name: 'the clock was overridden', mutate: (i) => ({ ...i, durationOk: false }) },
    { conjunct: 'theDisplayMinutesCameOutOfTheEnginesOwnExpression', name: 'the display clock stopped tracing', mutate: (i) => ({ ...i, displayOk: false }) },
    { conjunct: 'theMappingIsDerivedNotTyped', name: 'the mapping was typed', mutate: (i) => ({ ...i, mappingOk: false }) },
    { conjunct: 'everyWalkRanOnTheMatchClock', name: 'a walk never stepped', mutate: (i) => ({ ...i, walks: false }) },
  ],
});

/* ---- 14 gSeed ---- */
registerGate<{
  clashes: string[]; internal: string[]; inBand: boolean; ordered: boolean; block: boolean;
}>({
  name: 'gSeed',
  fn: (i) => ({
    noClashWithTheConsumedLedger: i.clashes.length === 0,
    noInternalClash: i.internal.length === 0,
    everyWalkedSeedIsInTheClaimedBattery: i.inBand,
    theClaimedBlocksAreOrdered: i.ordered,
    everyClaimedBlockIsInsideTheDispatchedBand: i.block,
  }),
  input: {
    clashes: seedClashes, internal: claimedInternalClashes, inBand: allSeedsInBand,
    ordered: CLAIMED.every((c) => c.range[0] <= c.range[1]),
    block: allSeedsInTheDispatchedBlock,
  },
  mutants: [
    { conjunct: 'noClashWithTheConsumedLedger', name: 'a claimed block collided with a consumed one', mutate: (i) => ({ ...i, clashes: ['x'] }) },
    { conjunct: 'noInternalClash', name: 'two claimed blocks overlapped', mutate: (i) => ({ ...i, internal: ['x'] }) },
    { conjunct: 'everyWalkedSeedIsInTheClaimedBattery', name: 'a walk left the claimed band', mutate: (i) => ({ ...i, inBand: false }) },
    { conjunct: 'theClaimedBlocksAreOrdered', name: 'a block was inverted', mutate: (i) => ({ ...i, ordered: false }) },
    { conjunct: 'everyClaimedBlockIsInsideTheDispatchedBand', name: 'a block left 12,491,000–999', mutate: (i) => ({ ...i, block: false }) },
  ],
});

/* ---- 15 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 112_600,
    theGapToEveryPublishedBaseIsAtLeastTheStep: i.gap >= STATS_STEP,
    theResampleCountIsTheFrozenOne: i.resamples === BOOTSTRAP,
  }),
  input: { base: STATS_BASE, gap: minGap, resamples: BOOTSTRAP },
  mutants: [
    { conjunct: 'theBaseIsTheDispatchedFloor', name: 'the stats base moved', mutate: (i) => ({ ...i, base: 1 }) },
    { conjunct: 'theGapToEveryPublishedBaseIsAtLeastTheStep', name: 'the stream collided with a published base', mutate: (i) => ({ ...i, gap: 0 }) },
    { conjunct: 'theResampleCountIsTheFrozenOne', name: 'the resample count moved', mutate: (i) => ({ ...i, resamples: 1 }) },
  ],
});

/* ---- 16 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    aPreflightNeverWritesACanonicalPath: !i.preflight || !isCanonicalPath(i.out),
  }),
  input: { rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue PWT0A_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 17 gHashEnvelope — #266.3(a) + #289.1: invocation facts NAMED in the envelope ---- */
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs', 'head', 'outPath',
  'preflight', 'preflightReasons', 'mode'];
const envelopeInput = {
  crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[],
  named: FORBIDDEN_BODY_KEYS.length,
};
registerGate<typeof envelopeInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    theBodyRederivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest: i.crossOutIdentical,
    noInvocationFactIsInTheHashedBody: i.forbidden.length === 0,
    theExclusionListNamesPreflightExplicitly: i.named === FORBIDDEN_BODY_KEYS.length
      && FORBIDDEN_BODY_KEYS.includes('preflight')
      && FORBIDDEN_BODY_KEYS.includes('preflightReasons'),
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyRederivesItsDigestFromDisk', name: 'the artifact on disk did not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'aCrossOutWithAnotherEnvelopeHasTheIdenticalDigest', name: 'the envelope entered the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'noInvocationFactIsInTheHashedBody', name: 'an invocation fact entered the body', mutate: (i) => ({ ...i, forbidden: ['preflight'] }) },
    { conjunct: 'theExclusionListNamesPreflightExplicitly', name: 'the exclusion list stopped naming preflight', mutate: (i) => ({ ...i, named: 0 }) },
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
/* §14 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                      */
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
  banner('PW-T0a REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
/* §15 THE ARTIFACT                                                            */
/* ========================================================================== */
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what, starred: f.starred, pop: f.pop, slice: f.slice,
  curves: Object.fromEntries(Object.entries(f.curves).map(([k, v]) => [k, {
    point: v.den === 0 ? 'NEVER-OCCURRED' : round(v.point), num: v.num, den: v.den,
    ci95: v.den === 0 ? 'NEVER-OCCURRED' : v.ci95.map((x) => round(x)),
  }])),
  heavyVsBase: {
    delta: round(f.contrast.delta), ci95: f.contrast.ci95.map((x) => round(x)),
    relative: round(f.contrast.relative), halfWidth: round(f.contrast.halfWidth),
    absOverHalfWidth: round(f.contrast.absOverHalfWidth, 3), resolved: f.contrast.resolved,
  },
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PW-T0a — THE PREFERENCE CENSUS',
  doc: 'docs/world-model/PW-T0A-PREFERENCE-CENSUS.md',
  contract: 'docs/world-model/PW-PASSWEIGHT-CONTRACT.md §2 (M-PW.2 / M-PW.3); order bound by '
    + 'ruling #291.6; design picked by PW-C0 §E.3 (the chooser-slice design pick)',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: '⭐⭐ PW-C0 §C.3 proved max weight wins AT POPULATION MEANS under both shipped cost '
      + 'curves. A chooser acts PER OPTION. Does a non-degenerate CHOSEN REGION exist at all in '
      + 'the SHIPPED joining rule\'s per-option preference distribution — before any src work is '
      + 'spent on a chooser? INSTRUMENT-ONLY: nothing is armed, nothing is built.',
    theRule: 'the SHIPPED `perceivedPassChoice.preferredPassPower`, CALLED — never restated. Its '
      + 'own pre-registered joining rule (PW-C0 §C.3(iii)): price(power) = '
      + 'quintilePrice(threat(power)) × (1 − touchFail(power)) / (1 − touchFail(1.0)), traced at '
      + `${CHOICE_SRC_PATH}:${RULE_PRICE_LINE}–${RULE_RATIO_LINE}; argmax at `
      + `${CHOICE_SRC_PATH}:${RULE_ARGMAX_LINE}, FIRST-WINS on an exact tie (strict \`>\`).`,
    theLadder: `{PASS_POWER_MIN, 1, PASS_POWER_MAX} = [${POWERS.join(', ')}] — the substrate's `
      + `own PASS_CANARY_POWERS, literal EXTRACTED from ${BRAIN_SRC_PATH}:${CANARY_LINE} `
      + `(\`${CANARY_LITERAL}\`) and fed to this very rule by the brain at `
      + `${BRAIN_SRC_PATH}:${CANARY_CALL_LINE}.`,
    theCurves: 'BOTH shipped curves. Selection rides the rule\'s OWN `heavyTouchCost` parameter '
      + `(the switch \`evaluatePassOption\` itself reads, ${OPT_SRC_PATH}:${MIRROR_LINE}); the `
      + 'walked world\'s own per-match selector `match.edsTouchCost` is asserted OFF (= base), '
      + 'exactly as PW-C0 recorded. NOTHING about either curve is re-implemented here.',
    arm: '⭐ THE v7 WORLD: `new Match({...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
      + 'poolT1DoseCells(L3-T1))`, asserted LIVE on every walked match (#283.2(iv)). VIRGIN SEEDS.',
    ladderDefinition: 'BU-C0\'s reception-option ladder VERBATIM (L1 position on the ±2 m band '
      + `EXTRACTED at run time from ${MECH_SRC_PATH}:${FORWARD_BAND_LINE} · L2 the oracle's own `
      + 'flight prediction · L3 `arrivalMargin > 0` · L4 the engine\'s corridor sampler), run at '
      + 'EACH rung. GK-split throughout (#286.1).',
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing" — '
        + 'PW-C0\'s population verbatim.',
      pressedOption: `an option at a reception whose receiver has an opponent within `
        + `${PRESSURE_R} m (TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      ref: '⭐ THE PRIMARY POPULATION — options published (L1∧L2∧L3∧L4) at the REFERENCE rung '
        + '1.00: the set a chooser enumerating today\'s ladder actually sees.',
      union: 'options published at ANY of the three rungs — the set a rung-aware enumerator would '
        + 'see. Published because the option set MOVES WITH POWER (PW-C0 §CORRECTIONS 2).',
      all3: 'options published at ALL three rungs — the fully paired set, where the denominator '
        + 'cannot move at all.',
      note: '⭐ THE POWER-DEPENDENT DENOMINATOR IS DISCLOSED PER FACE by publishing all three; '
        + 'every face carries its own `den` and the three populations are directly comparable.',
    },
    slices: {
      full: SLICES_FULL,
      small: SLICES_SMALL,
      distanceBands: 'the ENGINE\'s own option-space prior bands (`optionSpacePriorBandIndex`, '
        + 'passPrior.ts) on the true passer→target distance; `dOutsideTable` is everything the '
        + 'table does not cover (below 6 m or beyond 30 m).',
      threatQuintiles: 'the ORACLE\'s own quintiles (`threatBandIndex`), read at the REFERENCE '
        + 'rung so the conditioning variable does not move with power.',
      chooserWindow: 'whether the option is inside `passChoiceCandidateGids` — the 6–30 m, '
        + 'GK-excluded window the LIVE chooser actually enumerates.',
    },
    tieEpsilon: { value: TIE_EPS, derivation: TIE_EPS_DERIVATION },
    marginHistogramEdges: MARGIN_EDGES,
    /* ---- ⭐⭐ THE PRE-REGISTERED READING RULES, FROZEN BEFORE THE BATTERY (#291.6) ---- */
    readingRules: {
      form: 'THE VERDICT IS A DISTRIBUTION SHAPE, NEVER A TASTE THRESHOLD (#291.6). No cutoff is '
        + 'invented here; the shares and their CIs are published and the COMMANDER adjudicates.',
      DEGENERATE: 'ONE rung takes essentially the whole distribution UNDER BOTH CURVES — report '
        + 'the shares. If this reads, the chooser as designed cannot produce a chosen region and '
        + 'the arc must reframe BEFORE any src work (PW-C0 §E.3\'s own cheap gate).',
      STRUCTURED: 'the preferred rung varies SYSTEMATICALLY with a scene feature (distance · '
        + 'threat · direction · pressure) — shown by the CONDITIONAL distributions, each with '
        + 'its own denominator and CI.',
      MIXED: 'anything between, described in words with the numbers that make it so.',
      mustNotBeRediscoveredAsNews: '⭐ PW-C0 §C.3(iii) ALREADY FOUND that at POPULATION MEANS max '
        + 'weight wins under both curves (2.30 : 1 shipped, 1.20 : 1 heavy). That is the '
        + 'BACKGROUND of this stage, not its finding. THIS stage\'s question is the SHAPE of the '
        + 'per-option distribution around that mean.',
      marginRule: 'a preference the noise floor erases is not a preference: the margin '
        + 'distribution is published in full (histogram + mean + the declared float-epsilon tie '
        + 'share), and the execution-noise PROXY face is labelled a PROXY.',
      starredFindings: 'every starred finding states |Δ| ÷ half-width (#288 canon); plumbing '
        + 'receipts are NEVER quoted as effect sizes (#289 canon).',
    },
    clock: {
      matchDurationSimSeconds: MATCH_DURATION,
      displayMinutes: DISPLAY_MINUTES,
      displayMinutesTracedTo: `${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE} (Match.minute())`,
      displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
      law: 'every face here is a SHARE or a per-option MEAN — dimensionless, and identical on '
        + 'both clock axes. No per-match count is published as a headline. APPLIED, not nominal: '
        + 'the duration is never overridden and gClock asserts it on every walk.',
    },
  },
  /* ---- the SRC RECEIPTS ---- */
  srcReceipts: {
    canaryLadder: {
      literal: CANARY_LITERAL,
      tracedTo: `${BRAIN_SRC_PATH}:${CANARY_LINE}`,
      callSite: `${BRAIN_SRC_PATH}:${CANARY_CALL_LINE}`,
      feedsTheRule: CANARY_FEEDS_THE_RULE,
      powers: POWERS,
      labels: POWER_LABELS,
      referenceIndex: REF_POWER_INDEX,
    },
    joiningRule: {
      priceLine: `${CHOICE_SRC_PATH}:${RULE_PRICE_LINE}`,
      ratioLine: `${CHOICE_SRC_PATH}:${RULE_RATIO_LINE}`,
      argmaxLine: `${CHOICE_SRC_PATH}:${RULE_ARGMAX_LINE}`,
      heavySelectorLine: `${CHOICE_SRC_PATH}:${RULE_HEAVY_LINE}`,
      argmaxIsFirstWinsOnExactTie: RULE_ARGMAX_IS_STRICT,
    },
    touchCurves: {
      shippedConstants: TOUCH_SPEED_COST,
      oracleMirrorLine: `${OPT_SRC_PATH}:${MIRROR_LINE}`,
      mirrorSpanBase: MIRROR_SPAN_BASE, mirrorSpanHeavy: MIRROR_SPAN_HEAVY,
      mirrorWeightBase: MIRROR_WEIGHT_BASE, mirrorWeightHeavy: MIRROR_WEIGHT_HEAVY,
      mirrorMatchesTheShippedConstants: MIRROR_MATCHES_TOUCH_SPEED_COST,
      note: `⚠ the oracle's mirror (\`${['mirroredTouch', 'FailChance'].join('')}\`, named here `
        + 'by run-time assembly so the no-parallel-oracle scan cannot self-match) RESTATES the '
        + 'two curves\' constants rather than '
        + 'importing `TOUCH_SPEED_COST` (its own header says a contract test pins them equal). '
        + 'This probe checks that equality itself, at run time, rather than trusting the note.',
    },
    executionNoiseLaw: {
      constant: NOISE_CONST,
      tracedTo: `${MECH_SRC_PATH}:${NOISE_LINE}`,
      form: `σ = |intended − 1| · PASS_POWER_NOISE_K (${PASS_POWER_NOISE_K}) · `
        + `(${NOISE_CONST} − passer.attrs.passing); identically 0 at the shipped default.`,
    },
    noParallelOracle: {
      forbiddenIdentifiersAssembledAtRunTime: FORBIDDEN_PRICING_IDENTS.length,
      hitsInThisProbe: PARALLEL_ORACLE_HITS,
      thisProbeCallsTheShippedRule: OWN_CALLS_THE_SHIPPED_RULE,
      probeFileSha256: sha(OWN_SRC),
      law: '⭐ the identifiers are ASSEMBLED FROM FRAGMENTS at run time so the literals never '
        + 'appear in the file being scanned — the check cannot pass by accident or self-match.',
    },
  },
  /* ---- ⭐⭐ DIVERGENCE-1, RE-PROVEN AS A TERM-LIST DIFF (#291.5) ---- */
  divergenceOneTermDiff: {
    law: '⭐ #291.5 canon: a divergence claim must DIFF THE TERM LISTS, never merely evaluate the '
      + 'expressions the two sides share. The bodies of `mechanics.performPass` and '
      + '`prediction.predictGroundPass` are extracted by brace matching and their identifier sets '
      + 'differenced.',
    simTermCount: SIM_TERMS.length,
    oracleTermCount: ORACLE_TERMS.length,
    simOnlyTerms: SIM_ONLY_TERMS,
    oracleOnlyTerms: ORACLE_ONLY_TERMS,
    orientationIsSimOnly: ORIENTATION_IS_SIM_ONLY,
    executionErrorIsSimOnly: EXECUTION_ERROR_IS_SIM_ONLY,
    reading: 'PW-C0 §COMMANDER CORRECTIONS 1 (HIGH) stands and is CONFIRMED by term list: the '
      + 'oracle every price in this census comes from carries NO orientation term and NO '
      + 'execution error. The preference distribution below is therefore what the CHOOSER\'S OWN '
      + 'ORACLE prefers — the same optimistic instrument PW-T0b would ship with — and the '
      + 'orientation face measures how big the blind term is on the very same options.',
  },
  run: {
    N: N_RUN, base: BASE_RUN, rungs: POWERS.length, curves: CURVES.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    receptions: sum(rows().map((r) => r.receptions)),
    pressedReceptions: sum(rows().map((r) => r.receptionsPressed)),
    optionsInUnion: ruleReceipt.optionsSeen,
    optionsInRefPopulation: sum(rows().map((r) => r.cells.ref.base.all.n)),
    optionsInAll3Population: sum(rows().map((r) => r.cells.all3.base.all.n)),
    ruleCalls: ruleReceipt.calls,
    ruleNulls: ruleReceipt.nulls,
    ladderOracleNulls: ruleReceipt.ladderNulls,
    preferredRungCountsPooledOverCurves: everyRungWasReachedByTheRule,
  },
  populations: POPS,
  curves: CURVES,
  slices: { full: SLICES_FULL, small: SLICES_SMALL },
  faces: C.faces.map(pubFace),
  orientationFaces: C.ori.map((f) => ({
    face: f.face, unit: f.unit, what: f.what,
    point: f.den === 0 ? 'NEVER-OCCURRED' : round(f.point), num: f.num, den: f.den,
    ci95: f.den === 0 ? 'NEVER-OCCURRED' : f.ci95.map((x) => round(x)),
  })),
  marginHistogram: histogramBlock,
  pairingReceipt: pairing,
  curveReceipt,
  ruleReceipt,
  perturbCheck,
  emptyFaces: vacuity.empties,
  dose: {
    source: `${T1_PATH} · poolT1DoseCells (the SHIPPED world-7 entry's own pooling)`,
    fileBytesSha256: DOSE_FILE_BYTES_SHA,
    rederivedBodySha256: DOSE_REDERIVED_SHA,
    shippedConstant: L3_T1_SHA,
    cells: DOSE,
    labels: doseLabels,
    houseLaw: '#270 — the dose is written through DefenceAccountBook.note() by the shipped entry '
      + 'path and appears NOWHERE in info.genome (asserted per walk in gArms). ⭐ #289 canon: the '
      + 'guard hashes the FILE BYTES it reads and RE-DERIVES the digest from them.',
  },
  perSeedCells: rows().map(cellOf),
  seeds: { claimed: CLAIMED, block: [12_491_000, 12_491_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 112_600, step: STATS_STEP },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ INSTRUMENT-ONLY: nothing is armed, nothing is built, no seam acquires a caller, and '
      + '`src/**` is byte-untouched. NO CHOOSER EXISTS — PW-T0b is a separate, unauthorised slice.',
    'This census measures a PREFERENCE, never a USAGE: no ball was struck at any weight, no '
      + 'player chose anything. What is measured is what the shipped rule WOULD pick per option.',
    'The prices are the ORACLE\'s: they carry no orientation term and no execution error '
      + '(DIVERGENCE-1, re-proven above). Levels inherit the shipped optimism; the within-'
      + 'instrument SHAPE is what this stage reports.',
    'The execution-noise face is a declared FIRST-ORDER PROXY (slope × σ), not a measurement of '
      + 'realised outcomes — PW-T1\'s sim exam is where execution honesty is measured (#291.1).',
    'The margin is in PRICE units of the shipped rule; it is not a probability of anything and '
      + 'not commensurable with PW-C0\'s pp-denominated survival faces.',
    'The verdict is a DISTRIBUTION SHAPE against the pre-registered clauses; the commander '
      + 'adjudicates, and no cutoff is invented in this document.',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath,
    mode: MODE,
    preflight: IS_PREFLIGHT,
    preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/pw-t0a-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION', head: 'ANOTHER-HEAD',
      mode: 'ANOTHER-MODE', preflight: !IS_PREFLIGHT, preflightReasons: ['ANOTHER-REASON'],
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
gFacesInput.keys = C.faces.length;
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [pw-t0a] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pw-t0a] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const show = (metric: string, pop: string, slice: string): string => {
  const f = face(`${metric}__${pop}__${slice}`);
  return CURVES.map((c) => `${c}=${
    f.curves[c].den === 0 ? 'NONE' : f.curves[c].point.toFixed(4)}`).join(' ');
};
for (const slice of ['all', 'outfieldBackward']) {
  banner(`  [pw-t0a] ${slice}: prefers 0.85 — ${show('sharePreferring0850', 'ref', slice)}`);
  banner(`  [pw-t0a] ${slice}: prefers 1.00 — ${show('sharePreferring1000', 'ref', slice)}`);
  banner(`  [pw-t0a] ${slice}: prefers 1.15 — ${show('sharePreferring1150', 'ref', slice)}`);
  banner(`  [pw-t0a] ${slice}: tie share    — ${show('tieShareAtFloatEpsilon', 'ref', slice)}`);
  banner(`  [pw-t0a] ${slice}: mean margin  — ${show('meanMarginOfPreference', 'ref', slice)}`);
}
banner(`  [pw-t0a] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
