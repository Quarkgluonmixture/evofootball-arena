/**
 * PW-C0 — THE WEIGHT-PHYSICS CENSUS (docs/world-model/PW-C0-WEIGHT-PHYSICS-CENSUS.md).
 *
 * The PASS-WEIGHT contract's first instrument (PW-PASSWEIGHT-CONTRACT.md §3 PW-C0, bound by
 * #290.2, dispatched by #290.3). INSTRUMENT-ONLY: nothing is armed, nothing is built, `src/**`
 * is BYTE-UNTOUCHED, and no seam acquires a caller.
 *
 * FOUR INSTRUMENTS, ONE BATTERY:
 *   (a) THE PHYSICS AUDIT — machine-read from `src/**` at run time: `performPass`'s weight input,
 *       the launch law `clamp(d·0.6 + 8.2, 9, 22) · executedMul`, the oracle's mirror
 *       `predictGroundPass`, the friction law, the arrival speed. The EXPRESSIBLE WEIGHT REGION
 *       and the RUNG LADDER are DERIVED from the shipped constants' own algebra (M-PW.1, the
 *       BU-T0b λ_LIN idiom) — never taste. Every derivation is published.
 *   (b) THE CORRIDOR-RESPONSE CENSUS — on virgin seeds in the v7 world (matches constructed
 *       DIRECTLY with `matchFlags`, arming ASSERTED LIVE on the very match walked, #283.2(iv)),
 *       BU-C0/BU-T1's reception-option ladder VERBATIM in definition, re-evaluated through the
 *       ORACLE'S OWN `powerMultiplier` at every derived rung: survival per rung × direction
 *       (backward / lateral / forward) × GK-SPLIT. PAIRED WITHIN SCENE — the same reception, the
 *       same bodies, only the ball speed differs (gPaired asserts the L1 body counts are
 *       IDENTICAL across rungs).
 *   (c) THE RECEIVING-COST AUDIT (M-PW.3) — what the engine charges TODAY for receiving a faster
 *       ball, measured on the surviving-option population through the engine's OWN
 *       `TOUCH_SPEED_COST` curves and the oracle's own `touchFailPrior`.
 *   (d) THE OVERSHOOT FACE — measured through the oracle's own geometry and the engine's own
 *       roll-out closed forms (`rolledDistance`, `D∞ = v / BALL_FRICTION_K`).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: PWC0_MODE (smoke|full, REQUIRED) · PWC0_N · PWC0_OUT.
 *   ANY other `PWC0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it may not write a canonical repo path.
 *
 * ⭐ #289 correction 1, BY NAME: `preflight`, `preflightReasons`, `mode` and every other
 *   invocation fact live in the ENVELOPE, never in the hashed body; `gHashEnvelope` lists them
 *   by name in its forbidden-key scan.
 * ⭐ #289 canon: the dose guard hashes the FILE BYTES it reads and RE-DERIVES the artifact's own
 *   digest from those bytes — never a self-declared field alone.
 *
 * RUN: PWC0_MODE=full npx tsx scripts/probes/pw-c0-weight-physics-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  BALL_FRICTION_K, CONTROL_RADIUS, DT, HALF_L, HALF_W, MATCH_DURATION,
  PASS_POWER_EXECUTED_MAX, PASS_POWER_EXECUTED_MIN, PASS_POWER_MAX, PASS_POWER_MIN,
  PASS_POWER_NOISE_K, TOUCH_CONTROL_DIST,
} from '../../src/sim/constants';
import { TOUCH_SPEED_COST } from '../../src/sim/mechanics';
import { rolledDistance } from '../../src/sim/carryBeat';
import {
  a4MatchFlags, armA4World, a4ArmedVersion, l3ArmedVersion, poolT1DoseCells,
  L3_WORLD_VERSION, L3_T1_SHA, type L3DoseCell,
} from '../../src/game/a4World';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import {
  evaluatePassOption, groundBallSpeedAt, GENERIC_RECEIVER_TECHNIQUE,
} from '../../src/ai/passOptionValue';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { predictGroundPass, groundBallTravelTime } from '../../src/ai/prediction';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo, type Side } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)       */
/* ========================================================================== */
const ENV_WHITELIST = ['PWC0_MODE', 'PWC0_N', 'PWC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PWC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('PW-C0 FATAL — refused env surface. '
    + `rogue PWC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.PWC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`PW-C0 FATAL — PWC0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const N_ENV = process.env.PWC0_N !== undefined
  ? Math.max(1, Number.parseInt(process.env.PWC0_N, 10)) : null;
const OUT_ENV = process.env.PWC0_OUT;
const PREFLIGHT_REASONS = [
  ...(N_ENV !== null ? ['PWC0_N'] : []),
  ...(OUT_ENV !== undefined ? ['PWC0_OUT'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/pw-c0-weight-physics-census-smoke.json',
  full: 'docs/world-model/data/pw-c0-weight-physics-census.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/pw-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('PW-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
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
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
const t0Wall = Date.now();

/* ========================================================================== */
/* §2 THE PHYSICS AUDIT — CONSTANTS IMPORTED, LAWS EXTRACTED FROM src (#200)   */
/* ========================================================================== */
const CONST_SRC_PATH = 'src/sim/constants.ts';
const MATCH_SRC_PATH = 'src/sim/Match.ts';
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const PRED_SRC_PATH = 'src/ai/prediction.ts';
const AFF_SRC_PATH = 'src/ai/passAffordance.ts';
const COR_SRC_PATH = 'src/ai/passCorridorInterception.ts';
const OPT_SRC_PATH = 'src/ai/passOptionValue.ts';
const BRAIN_SRC_PATH = 'src/ai/PlayerBrain.ts';
const CONST_SRC = readFileSync(CONST_SRC_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_SRC_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const PRED_SRC = readFileSync(PRED_SRC_PATH, 'utf8');
const AFF_SRC = readFileSync(AFF_SRC_PATH, 'utf8');
const COR_SRC = readFileSync(COR_SRC_PATH, 'utf8');
const OPT_SRC = readFileSync(OPT_SRC_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_SRC_PATH, 'utf8');
const lineOf = (src: string, re: RegExp): number => {
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
const countOf = (src: string, re: RegExp): number => (src.match(re) ?? []).length;

/** ⭐ THE LAUNCH LAW, EXTRACTED from the SIM's own strike line — never typed here.
 *  `const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;` */
const LAUNCH_LINE_RE = /clamp\(d \* (\d+(?:\.\d+)?) \+ (\d+(?:\.\d+)?), (\d+), (\d+)\) \* executedMul/;
const LAUNCH_MATCH = LAUNCH_LINE_RE.exec(MECH_SRC);
const LAUNCH_SLOPE = LAUNCH_MATCH === null ? Number.NaN : Number(LAUNCH_MATCH[1]);
const LAUNCH_INTERCEPT = LAUNCH_MATCH === null ? Number.NaN : Number(LAUNCH_MATCH[2]);
const LAUNCH_CLAMP_LO = LAUNCH_MATCH === null ? Number.NaN : Number(LAUNCH_MATCH[3]);
const LAUNCH_CLAMP_HI = LAUNCH_MATCH === null ? Number.NaN : Number(LAUNCH_MATCH[4]);
const LAUNCH_LINE = lineOf(MECH_SRC, LAUNCH_LINE_RE);
/** the ORACLE's mirror of the same law: `clamp(distance * 0.6 + 8.2, 9, 22) * power`. */
const ORACLE_LAUNCH_RE = /clamp\(distance \* (\d+(?:\.\d+)?) \+ (\d+(?:\.\d+)?), (\d+), (\d+)\) \* power/;
const ORACLE_LAUNCH_MATCH = ORACLE_LAUNCH_RE.exec(PRED_SRC);
const ORACLE_SLOPE = ORACLE_LAUNCH_MATCH === null ? Number.NaN : Number(ORACLE_LAUNCH_MATCH[1]);
const ORACLE_INTERCEPT = ORACLE_LAUNCH_MATCH === null ? Number.NaN : Number(ORACLE_LAUNCH_MATCH[2]);
const ORACLE_CLAMP_LO = ORACLE_LAUNCH_MATCH === null ? Number.NaN : Number(ORACLE_LAUNCH_MATCH[3]);
const ORACLE_CLAMP_HI = ORACLE_LAUNCH_MATCH === null ? Number.NaN : Number(ORACLE_LAUNCH_MATCH[4]);
const ORACLE_LAUNCH_LINE = lineOf(PRED_SRC, ORACLE_LAUNCH_RE);
/** ⭐⭐ THE ONE ASYMMETRY: the SIM clamps the multiplier, the ORACLE only floors it. */
const SIM_POWER_CLAMP_LINE = lineOf(MECH_SRC, /const intended = clamp\(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX\);/);
const SIM_POWER_CLAMPS = countOf(MECH_SRC, /clamp\(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX\)/g);
const ORACLE_POWER_FLOOR = extractNum(PRED_SRC, /const power = Math\.max\((\d+(?:\.\d+)?), powerMultiplier\);/);
const ORACLE_POWER_FLOOR_LINE = lineOf(PRED_SRC, /const power = Math\.max\([\d.]+, powerMultiplier\);/);
const ORACLE_HAS_UPPER_CLAMP = /Math\.min\([^)]*powerMultiplier|clamp\(powerMultiplier/.test(PRED_SRC);
/** the LEAD law, both sides (the passer leads on the INTENDED power). */
const SIM_LEAD_DIVISOR = extractNum(MECH_SRC, /dist\(passer\.pos, mate\.pos\) \/ \((\d+) \* powerMul\)/);
const ORACLE_LEAD_DIVISOR = extractNum(PRED_SRC, /initialDistance \/ \((\d+) \* power\)/);
const LEAD_FRACTION_SIM = extractNum(MECH_SRC, /scale\(mate\.vel, flight \* (\d+(?:\.\d+)?)\)/);
const LEAD_FRACTION_ORACLE = extractNum(PRED_SRC, /target\.vel\.x \* leadTime \* (\d+(?:\.\d+)?)/);
/** the ARRIVAL-SPEED law (the oracle's own, `passOptionValue.groundBallSpeedAt`). */
const ARRIVAL_SPEED_LINE = lineOf(OPT_SRC, /return launchSpeed \* Math\.exp\(-BALL_FRICTION_K \* seconds\);/);
/** the propagation receipts — where `powerMultiplier` reaches. */
const AFF_POWER_LINE = lineOf(AFF_SRC, /predictGroundPass\(passer\.pos, target, input\.powerMultiplier \?\? 1\)/);
const COR_POWER_LINE = lineOf(COR_SRC, /predictGroundPass\(passer\.pos, target, input\.powerMultiplier \?\? 1\)/);
const OPT_POWER_LINE = lineOf(OPT_SRC, /powerMultiplier,$/m);
/**
 * ⭐ THE LIVE-CALLER AUDIT: does any production path CHOOSE a weight today?
 *
 * ⚠ CORRECTED BEFORE THE BANKED BATTERY (disclosed in the stage doc §DOUBTS). The first
 * implementation counted call sites with a regex whose negative lookahead sat on the SECOND
 * argument, so it reported EVERY ≥2-argument call as "non-default" (3 of 3 — an obvious
 * falsehood the first battery published). This version walks BALANCED PARENTHESES from each
 * `performPass(` and splits the top-level argument list, so the 5th argument (`powerChoice`)
 * is read as itself. The finding is unchanged; the RECEIPT is now true.
 */
const REF_POWER_RAW = (/offsideExempt = false, powerChoice = (\d+(?:\.\d+)?),/
  .exec(MECH_SRC) ?? [, 'NO-DEFAULT-FOUND'])[1] as string;
const performPassArgs = (src: string): string[][] => {
  const out: string[][] = [];
  const needle = '.performPass(';
  for (let at = src.indexOf(needle); at >= 0; at = src.indexOf(needle, at + 1)) {
    let depth = 0; let i = at + needle.length - 1;
    const start = i + 1;
    for (; i < src.length; i++) {
      if (src[i] === '(') depth++;
      else if (src[i] === ')') { depth--; if (depth === 0) break; }
    }
    if (depth !== 0) continue;
    const inner = src.slice(start, i);
    const args: string[] = [];
    let d = 0; let cur = '';
    for (const ch of inner) {
      if (ch === '(' || ch === '[' || ch === '{') d++;
      if (ch === ')' || ch === ']' || ch === '}') d--;
      if (ch === ',' && d === 0) { args.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    if (cur.trim().length > 0) args.push(cur.trim());
    out.push(args);
  }
  return out;
};
const PERFORM_PASS_ARGLISTS = performPassArgs(BRAIN_SRC);
const PERFORM_PASS_CALLS = PERFORM_PASS_ARGLISTS.length;
/**
 * `Match.performPass(p, mate, offsideExempt, powerChoice, ptpLead)` — the WRAPPER the brain
 * calls, so `powerChoice` is the FOURTH positional argument (index 3). The mechanics function
 * behind it takes `match` first and is not called from the brain. The index is CHECKED against
 * the wrapper's own signature at run time rather than counted by eye.
 */
const MATCH_PERFORM_PASS_SIG = /performPass\(\s*\n?\s*p: Player, mate: Player, offsideExempt = false, powerChoice = \d/
  .test(MATCH_SRC.replace(/\n\s*/g, ' ').replace(/performPass\( /g, 'performPass('));
const POWER_ARG_INDEX = 3;
const PERFORM_PASS_WITH_EXPLICIT_POWER = PERFORM_PASS_ARGLISTS
  .filter((a) => a.length > POWER_ARG_INDEX).length;
const PERFORM_PASS_NONDEFAULT = PERFORM_PASS_ARGLISTS
  .filter((a) => a.length > POWER_ARG_INDEX && a[POWER_ARG_INDEX] !== REF_POWER_RAW).length;
const BRAIN_POWER_1_LINE = lineOf(BRAIN_SRC, /match\.performPass\(p, passMate!, offsideExemptKick, 1, v2\(/);
/** the pressure radius and Q07's own ±2 m band, inherited from BU-C0 VERBATIM. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
const PRESSURE_R_LINE = lineOf(CONST_SRC, /export const TOUCH_CONTROL_DIST = [\d.]+;/);
const FORWARD_BAND_M = extractNum(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > (\d+(?:\.\d+)?)\)/);
const FORWARD_BAND_LINE = lineOf(
  MECH_SRC, /localX\(mate\.pos\.x\) - team\.localX\(passer\.pos\.x\) > \d/);
/** the DISPLAY clock, read out of the engine's own expression. */
const DISPLAY_MINUTES = extractNum(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)\)/);
const DISPLAY_MINUTES_LINE = lineOf(
  MATCH_SRC, /Math\.min\(45, Math\.floor\(\(this\.simTime \/ this\.duration\) \* \d+\)\)/);
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;
/** the pressed-carrier cadence and histogram bucket, inherited from BU-C0. */
const CARRIER_SAMPLE_TICKS = 12;
const HIST_MAX = 5;

/* ---- ⭐⭐ THE DERIVED EXPRESSIBLE REGION AND RUNG LADDER (M-PW.1) ---- */
/**
 * THE ALGEBRA, printed:
 *
 *   SIM  (mechanics.performPass):
 *      intended  = clamp(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX)      ← THE ONLY POWER CLAMP
 *      powerMul  = orientationPowerMul(...) · intended                      (the LEAD's power)
 *      executed  = orientationPowerMul(...) · executedPassPower(intended)   (the STRIKE's power)
 *      speed     = clamp(d·m + c, lo, hi) · executed
 *   ORACLE (prediction.predictGroundPass):
 *      power     = max(0.1, powerMultiplier)                                ← FLOOR ONLY
 *      speed     = clamp(distance·m + c, lo, hi) · power
 *
 *   ⭐ THE CLAMP IS APPLIED TO THE DISTANCE LAW, THEN MULTIPLIED. So launchSpeed is EXACTLY
 *   LINEAR in the multiplier at every distance — d(speed)/d(power) = clamp(d·m+c, lo, hi),
 *   a constant per distance. The multiplier is therefore FAITHFUL everywhere it is accepted:
 *   there is NO saturation of the power axis itself, and no transform is needed or invented.
 *   ⭐⭐ WHAT BOUNDS THE AXIS IS THE SIM'S OWN `clamp(powerChoice, MIN, MAX)`. Beyond it the
 *   ORACLE keeps pricing (it has only a floor) while the SIM would strike a different ball —
 *   the oracle would LIE. λ_LIN idiom ⇒ CAP AT THE EDGE: the expressible region is exactly
 *   [PASS_POWER_MIN, PASS_POWER_MAX].
 *
 *   THE LADDER, from the region's own arithmetic (no taste):
 *      r1 = PASS_POWER_MIN                       (the substrate's floor)
 *      r2 = (PASS_POWER_MIN + REF) / 2           (declared midpoint of the lower half)
 *      r3 = REF = the value EVERY live caller passes (the shipped default, extracted from src)
 *      r4 = (REF + PASS_POWER_MAX) / 2           (declared midpoint of the upper half)
 *      r5 = PASS_POWER_MAX                       (the substrate's ceiling)
 *      rX = PASS_POWER_EXECUTED_MAX              ⚠ DIAGNOSTIC ONLY — OUTSIDE the expressible
 *           region; reachable by EXECUTION ERROR, never by choice. Published to EXHIBIT the
 *           oracle/sim divergence, never offered to a chooser.
 */
const REF_POWER = extractNum(MECH_SRC, /offsideExempt = false, powerChoice = (\d+(?:\.\d+)?),/);
const EXPRESSIBLE = [PASS_POWER_MIN, PASS_POWER_MAX] as const;
interface Rung { label: string; power: number; expressible: boolean; derivation: string }
const RUNGS: readonly Rung[] = [
  { label: 'p0850', power: PASS_POWER_MIN, expressible: true,
    derivation: 'PASS_POWER_MIN — the substrate\'s own floor in performPass\'s clamp' },
  { label: 'p0925', power: (PASS_POWER_MIN + REF_POWER) / 2, expressible: true,
    derivation: '(PASS_POWER_MIN + REF)/2 — the declared midpoint of the lower half' },
  { label: 'p1000', power: REF_POWER, expressible: true,
    derivation: 'the SHIPPED DEFAULT `powerChoice = 1`, the value every live caller passes' },
  { label: 'p1075', power: (REF_POWER + PASS_POWER_MAX) / 2, expressible: true,
    derivation: '(REF + PASS_POWER_MAX)/2 — the declared midpoint of the upper half' },
  { label: 'p1150', power: PASS_POWER_MAX, expressible: true,
    derivation: 'PASS_POWER_MAX — the substrate\'s own ceiling in performPass\'s clamp' },
  { label: 'p1300', power: PASS_POWER_EXECUTED_MAX, expressible: false,
    derivation: '⚠ PASS_POWER_EXECUTED_MAX — OUTSIDE the chooser\'s region. The DIAGNOSTIC rung: '
      + 'the oracle prices it (floor-only), the sim would clamp any CHOICE back to 1.15. '
      + 'Reachable only as an execution error. Never offered to a chooser.' },
];
const RUNG_LABELS = RUNGS.map((r) => r.label);
const REF_LABEL = 'p1000';
const EXPRESSIBLE_LABELS = RUNGS.filter((r) => r.expressible).map((r) => r.label);

/** the clamp's own distance edges: where the DISTANCE law saturates (power-independent). */
const CLAMP_LO_DISTANCE_M = (LAUNCH_CLAMP_LO - LAUNCH_INTERCEPT) / LAUNCH_SLOPE;
const CLAMP_HI_DISTANCE_M = (LAUNCH_CLAMP_HI - LAUNCH_INTERCEPT) / LAUNCH_SLOPE;
/** the friction range ceiling: the ball cannot roll further than this (prediction.ts's own). */
const FRICTION_STEP_DECAY = Math.exp(-BALL_FRICTION_K * DT);
const RANGE_PER_LAUNCH_SPEED = DT / (1 - FRICTION_STEP_DECAY);
/** ⭐ THE RECEIVING-COST EDGES, from the engine's own TOUCH_SPEED_COST entries. */
const TOUCH_FREE_SPEED = extractNum(MECH_SRC, /if \(p\.role === 'GK' \|\| speed <= (\d+)\) return true;/);
const TOUCH_SPEED_ORIGIN = extractNum(MECH_SRC, /clamp01\(\(speed - (\d+)\) \/ cost\.span\)/);
const BASE_SATURATION_SPEED = TOUCH_SPEED_ORIGIN + TOUCH_SPEED_COST.base.span;
const HEAVY_SATURATION_SPEED = TOUCH_SPEED_ORIGIN + TOUCH_SPEED_COST.heavy.span;
/** the GENERIC receiver's technique multiplier on the whole curve (mirroredTouchFailChance). */
const TECHNIQUE_MUL = 1.3 - GENERIC_RECEIVER_TECHNIQUE * 0.85;
const TOUCH_PRIOR_CEILING = extractNum(MECH_SRC, /return clamp\(raw \* \(1\.3 - technique \* 0\.85\), 0, (\d+(?:\.\d+)?)\);/);
const baseSpeedTerm = (s: number): number => clamp01((s - TOUCH_SPEED_ORIGIN) / TOUCH_SPEED_COST.base.span)
  * TOUCH_SPEED_COST.base.weight;
const heavySpeedTerm = (s: number): number => clamp01((s - TOUCH_SPEED_ORIGIN) / TOUCH_SPEED_COST.heavy.span)
  * TOUCH_SPEED_COST.heavy.weight;

/* ========================================================================== */
/* §3 THE FROZEN DESIGN — seeds, stats stream, sizing                          */
/* ========================================================================== */
const T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const BOOTSTRAP = 2000;
const STATS_BASE = 112_400;
const STATS_STEP = 200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_400, 110_600, 110_800, 111_000, 111_200, 111_400, 111_600, 111_800,
  112_000, 112_200,
];

const SMOKE_BASE = 12_490_000;
const GUARD_BASE = 12_490_040;
const GUARD_SPAN = 20;
const BATTERY_BASE = 12_490_100;
const GWORLD_SEED = 12_490_900;
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
  { name: 'L3-C0 / L3-C0b / L3-T0 / L3-T1 / L3-T2 / entry (#277.2–#283)', range: [12_480_000, 12_485_999] },
  { name: 'BU-C0 reception-option census (#285.2/#286)', range: [12_486_000, 12_486_999] },
  { name: 'BU-T0 DV composition (#286.6/#287)', range: [12_487_000, 12_487_999] },
  { name: 'BU-T0b price separation (#287.6/#288)', range: [12_488_000, 12_488_999] },
  { name: 'BU-T1 MT composition (#288.7/#289)', range: [12_489_000, 12_489_999] },
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

/** ⭐ THE MATURED DOSE — the SHIPPED entry's own pooled cells, read from the committed artifact. */
const T1_BYTES = readFileSync(T1_PATH, 'utf8');
const T1_FILE = JSON.parse(T1_BYTES) as Record<string, unknown>;
const DOSE: L3DoseCell[] = poolT1DoseCells(T1_FILE);
/** ⭐ #289 canon: the guard hashes the FILE BYTES and RE-DERIVES the artifact's own digest. */
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

/** ⭐⭐ THE ARM-IDENTITY CONJUNCTS, ASSERTED ON THE MATCH THE WALK MEASURES (#283.2(iv)). */
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
    theShippedTouchCurveIsTheBaseOne: !mm.edsTouchCost,
  };
};

/* ========================================================================== */
/* §5 THE RUNG CENSUS — BU-C0's LADDER VERBATIM, RE-EVALUATED AT EACH RUNG     */
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

/**
 * ONE rung's census at ONE moment.
 *
 * L1 POSITION (rung-INDEPENDENT — the same bodies at every rung; gPaired asserts it)
 * L2 THE BALL GETS THERE — the engine's own `predictGroundPass` reachability AT THIS RUNG
 * L3 THE RECEIVER WINS THE RACE — `arrivalMargin > 0` AT THIS RUNG
 * L4 THE CORRIDOR IS NOT CUT — the engine's own corridor sampler AT THIS RUNG
 *
 * ⭐ THE PUBLISHED "OPTION" IS L1 ∧ L2 ∧ L3 ∧ L4 — BU-C0's definition VERBATIM, so every
 * rung row is commensurable with BU-C0 / BU-T0 / BU-T0b / BU-T1.
 * ⭐ (c)+(d) ride on the SURVIVOR population only: for each surviving option the engine's own
 * `evaluatePassOption` is asked once, and the receiving-cost / overshoot quantities are read
 * off ITS outputs — no parallel oracle.
 */
interface RungCensus {
  mates: number;
  behind: number; lateral: number; ahead: number; behindGk: number;
  bFlight: number; bFlightGk: number; lFlight: number; aFlight: number;
  bRace: number; bRaceGk: number; lRace: number; aRace: number; raceAll: number;
  bUncut: number; bUncutGk: number; lUncut: number; aUncut: number; uncutAll: number;
  bUncutInWindow: number;
  oracleCalls: number; oracleNulls: number; corridorCalls: number; optionCalls: number;
  /* --- (c) THE RECEIVING COST, over SURVIVING options --- */
  sCount: number;
  sArrivalSpeedSum: number; sRelSpeedSum: number;
  sBaseTermSum: number; sHeavyTermSum: number; sPriorSum: number;
  sFree: number; sAtBaseSat: number; sAtHeavySat: number; sPriorAtCeiling: number;
  /* --- the OUTFIELD BACKWARD survivor slice --- */
  bofCount: number; bofArrivalSpeedSum: number; bofRelSpeedSum: number;
  bofBaseTermSum: number; bofHeavyTermSum: number;
  /* --- (d) THE OVERSHOOT FACE, over SURVIVING options --- */
  sOverrunSum: number; sOverrun: number; sRestOverSum: number; sOffPitch: number;
  sFlightSecondsSum: number;
}
const RUNG_KEYS = [
  'mates', 'behind', 'lateral', 'ahead', 'behindGk',
  'bFlight', 'bFlightGk', 'lFlight', 'aFlight',
  'bRace', 'bRaceGk', 'lRace', 'aRace', 'raceAll',
  'bUncut', 'bUncutGk', 'lUncut', 'aUncut', 'uncutAll', 'bUncutInWindow',
  'oracleCalls', 'oracleNulls', 'corridorCalls', 'optionCalls',
  'sCount', 'sArrivalSpeedSum', 'sRelSpeedSum', 'sBaseTermSum', 'sHeavyTermSum', 'sPriorSum',
  'sFree', 'sAtBaseSat', 'sAtHeavySat', 'sPriorAtCeiling',
  'bofCount', 'bofArrivalSpeedSum', 'bofRelSpeedSum', 'bofBaseTermSum', 'bofHeavyTermSum',
  'sOverrunSum', 'sOverrun', 'sRestOverSum', 'sOffPitch', 'sFlightSecondsSum',
] as const;
const emptyRung = (): RungCensus => Object.fromEntries(
  RUNG_KEYS.map((k) => [k, 0])) as unknown as RungCensus;
const addRung = (a: RungCensus, b: RungCensus): void => {
  for (const k of RUNG_KEYS) a[k] += b[k];
};
type ByRung = Record<string, RungCensus>;
const emptyByRung = (): ByRung => Object.fromEntries(
  RUNG_LABELS.map((l) => [l, emptyRung()]));
const addByRung = (a: ByRung, b: ByRung): void => {
  for (const l of RUNG_LABELS) addRung(a[l], b[l]);
};

const censusAt = (m: Match, carrier: Player): ByRung => {
  const t = m.teams[carrier.side];
  const opp = m.teams[(1 - carrier.side) as Side];
  const truth = capturePerceptionTruth(m);
  const snapshot = oraclePerceptionSnapshot(truth, carrier.gid);
  const profiles = m.reachProfiles();
  const windowGids = new Set(passChoiceCandidateGids(carrier, t.players));
  const ballLocalX = t.localX(m.ball.pos.x);
  const out = emptyByRung();
  for (const rung of RUNGS) {
    const o = out[rung.label];
    const P = rung.power;
    for (const mate of t.players) {
      if (mate === carrier || mate.sentOff) continue;
      o.mates += 1;
      const delta = t.localX(mate.pos.x) - ballLocalX;
      const isBehind = delta <= -FORWARD_BAND_M;
      const isAhead = delta >= FORWARD_BAND_M;
      const isGk = mate.role === 'GK';
      if (isBehind) { o.behind += 1; if (isGk) o.behindGk += 1; }
      else if (isAhead) o.ahead += 1;
      else o.lateral += 1;
      o.oracleCalls += 1;
      const res = evaluatePassAffordance({
        snapshot,
        passerGid: carrier.gid,
        targetGid: mate.gid,
        attackDir: t.attackDir,
        reachProfiles: profiles,
        powerMultiplier: P,
      });
      if (res === null) { o.oracleNulls += 1; continue; }
      if (!res.flight.reachable) continue;
      if (isBehind) { o.bFlight += 1; if (isGk) o.bFlightGk += 1; }
      else if (isAhead) o.aFlight += 1; else o.lFlight += 1;
      if (res.affordance.arrivalMargin <= 0) continue;
      o.raceAll += 1;
      if (isBehind) { o.bRace += 1; if (isGk) o.bRaceGk += 1; }
      else if (isAhead) o.aRace += 1; else o.lRace += 1;
      let cut = false;
      for (const d of opp.players) {
        if (d.sentOff) continue;
        o.corridorCalls += 1;
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
      if (cut) continue;
      o.uncutAll += 1;
      if (isBehind) {
        o.bUncut += 1;
        if (windowGids.has(mate.gid)) o.bUncutInWindow += 1;
        if (isGk) o.bUncutGk += 1;
      } else if (isAhead) o.aUncut += 1;
      else o.lUncut += 1;

      /* --- (c) + (d) on the SURVIVOR: the engine's own option valuation, once --- */
      o.optionCalls += 1;
      const v = evaluatePassOption({
        snapshot,
        passerGid: carrier.gid,
        targetGid: mate.gid,
        powerMultiplier: P,
        attackDir: t.attackDir,
        reachProfiles: profiles,
      });
      if (v === null) continue;
      const rel = v.receptionRelativeSpeed;
      const bTerm = baseSpeedTerm(rel);
      const hTerm = heavySpeedTerm(rel);
      o.sCount += 1;
      o.sArrivalSpeedSum += v.arrivalSpeed;
      o.sRelSpeedSum += rel;
      o.sBaseTermSum += bTerm;
      o.sHeavyTermSum += hTerm;
      o.sPriorSum += v.touchFailPrior;
      o.sFlightSecondsSum += v.flightSeconds;
      if (rel <= TOUCH_FREE_SPEED) o.sFree += 1;
      if (rel >= BASE_SATURATION_SPEED) o.sAtBaseSat += 1;
      if (rel >= HEAVY_SATURATION_SPEED) o.sAtHeavySat += 1;
      if (v.touchFailPrior >= TOUCH_PRIOR_CEILING - 1e-12) o.sPriorAtCeiling += 1;
      if (isBehind && !isGk) {
        o.bofCount += 1;
        o.bofArrivalSpeedSum += v.arrivalSpeed;
        o.bofRelSpeedSum += rel;
        o.bofBaseTermSum += bTerm;
        o.bofHeavyTermSum += hTerm;
      }
      /* the OVERSHOOT geometry, from the engine's own closed forms */
      const lateBy = Math.max(0, res.affordance.receiverArrival - res.flight.arrivalTime);
      const overrun = rolledDistance(v.arrivalSpeed, lateBy);
      o.sOverrunSum += overrun;
      if (overrun > CONTROL_RADIUS) o.sOverrun += 1;
      const dInfinity = v.arrivalSpeed / BALL_FRICTION_K;
      o.sRestOverSum += dInfinity;
      const dx = res.flight.targetPoint.x - carrier.pos.x;
      const dy = res.flight.targetPoint.y - carrier.pos.y;
      const len = Math.hypot(dx, dy);
      if (len > 1e-8) {
        const restX = res.flight.targetPoint.x + (dx / len) * dInfinity;
        const restY = res.flight.targetPoint.y + (dy / len) * dInfinity;
        if (Math.abs(restX) > HALF_L || Math.abs(restY) > HALF_W) o.sOffPitch += 1;
      }
    }
  }
  return out;
};

/* ========================================================================== */
/* §6 THE WALK — BU-C0's reception population VERBATIM                         */
/* ========================================================================== */
interface Row {
  seed: number;
  signature: string;
  armOk: boolean;
  receptions: number;
  receptionsPressed: number;
  receptionsOpenPlay: number;
  atReceptions: ByRung;
  atPressedReceptions: ByRung;
  carrierSamples: number;
  carrierSamplesPressed: number;
  atPressedCarrier: ByRung;
  /** hist[k] = receptions offering exactly k behind-ball options AT THE REFERENCE RUNG. */
  behindHist: number[];
  ticks: number; inPlayTicks: number; simSeconds: number; goals: number;
  enginePasses: number;
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
    seed, signature: '', armOk,
    receptions: 0, receptionsPressed: 0, receptionsOpenPlay: 0,
    atReceptions: emptyByRung(), atPressedReceptions: emptyByRung(),
    carrierSamples: 0, carrierSamplesPressed: 0, atPressedCarrier: emptyByRung(),
    behindHist: new Array<number>(HIST_MAX + 1).fill(0),
    ticks: 0, inPlayTicks: 0, simSeconds: 0, goals: 0, enginePasses: 0,
  };
  let prevOwnerGid: number | null = null;
  let inPlayTicks = 0;
  let openPlay = true;
  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    if (m.phase !== 'playing') { prevOwnerGid = null; openPlay = false; continue; }
    inPlayTicks++;
    const owner = m.ball.owner;
    if (owner === null) { prevOwnerGid = null; continue; }
    const ownerGid = owner.gid;
    const isReception = ownerGid !== prevOwnerGid;
    if (isReception) {
      const fromRestart = m.kickoffKickGid === owner.gid || m.restartKickGid === owner.gid;
      openPlay = !fromRestart;
    }
    if (measure && isReception) {
      const pressed = nearestOpponent(m, owner) <= PRESSURE_R;
      const c = censusAt(m, owner);
      row.receptions += 1;
      if (openPlay) row.receptionsOpenPlay += 1;
      addByRung(row.atReceptions, c);
      row.behindHist[Math.min(HIST_MAX, c[REF_LABEL].bUncut)] += 1;
      if (pressed) {
        row.receptionsPressed += 1;
        addByRung(row.atPressedReceptions, c);
      }
    }
    if (measure && !isReception && tick % CARRIER_SAMPLE_TICKS === 0) {
      row.carrierSamples += 1;
      if (nearestOpponent(m, owner) <= PRESSURE_R) {
        row.carrierSamplesPressed += 1;
        addByRung(row.atPressedCarrier, censusAt(m, owner));
      }
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
/* §7 THE BATTERY                                                              */
/* ========================================================================== */
const N_RUN = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const BASE_RUN = MODE === 'smoke' && N_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

interface Battery { rows: Row[] }
const runBattery = (): Battery => {
  const rows: Row[] = [];
  for (let i = 0; i < N_RUN; i++) {
    rows.push(walk(BASE_RUN + i));
    if ((i + 1) % 10 === 0) banner(`  [pw-c0] ${i + 1}/${N_RUN} walks done`);
  }
  return { rows };
};

/* ========================================================================== */
/* §8 THE FACES — every one a RATIO OF SUMS over the stored per-seed rows       */
/* ========================================================================== */
type Face = {
  num: (c: RungCensus, r: Row) => number;
  den: (c: RungCensus, r: Row) => number;
  unit: string; what: string; starred?: boolean;
};
const outfieldOf = (c: RungCensus, k: 'behind' | 'bFlight' | 'bRace' | 'bUncut'): number => {
  const gk = k === 'behind' ? c.behindGk : k === 'bFlight' ? c.bFlightGk
    : k === 'bRace' ? c.bRaceGk : c.bUncutGk;
  return c[k] - gk;
};
const perReception = (_c: RungCensus, r: Row): number => r.receptions;
const FACES: Record<string, Face> = {
  /* ---- ⭐⭐ (b) THE KEY NUMBER ---- */
  outfieldBackwardCorridorSurvival: {
    num: (c) => outfieldOf(c, 'bUncut'), den: (c) => outfieldOf(c, 'bRace'),
    unit: 'share of race-winning outfield backward options', starred: true,
    what: '⭐⭐ THE KEY NUMBER — of the OUTFIELD behind-ball balls that win the race, how many '
      + 'survive the corridor AT THIS BALL SPEED. BU-T1 baseline of record: 24.56 % at power 1.',
  },
  outfieldBackwardEndToEnd: {
    num: (c) => outfieldOf(c, 'bUncut'), den: (c) => outfieldOf(c, 'behind'),
    unit: 'share of outfield behind-ball bodies', starred: true,
    what: '⭐⭐ THE OUTFIELD LADDER END-TO-END (L4/L1, keeper removed). BU-T1 baseline: 21.08 %.',
  },
  outfieldBackwardOptionsPerReception: {
    num: (c) => outfieldOf(c, 'bUncut'), den: perReception,
    unit: 'options / reception', starred: true,
    what: '⭐⭐ THE OUTFIELD SUPPLY — surviving behind-ball options that are NOT the keeper',
  },
  gkBackwardCorridorSurvival: {
    num: (c) => c.bUncutGk, den: (c) => c.bRaceGk,
    unit: 'share of race-winning GK backward options',
    what: '⭐ the GK SPLIT of the corridor rung (BU-T0: 56.90 % vs the outfielder\'s 24.56 %)',
  },
  gkBackwardEndToEnd: {
    num: (c) => c.bUncutGk, den: (c) => c.behindGk,
    unit: 'share of GK behind-ball bodies', what: 'the keeper\'s own end-to-end conversion',
  },
  gkBackwardOptionsPerReception: {
    num: (c) => c.bUncutGk, den: perReception,
    unit: 'options / reception', what: 'the keeper ball, per reception',
  },
  keeperShareOfSurvivingBackwardOptions: {
    num: (c) => c.bUncutGk, den: (c) => c.bUncut,
    unit: 'share of surviving behind-ball options',
    what: '⭐ the KEEPER SHARE (BU-C0 54.20 % · BU-T0 53.89 %)',
  },
  behindBallOptionsPerReception: {
    num: (c) => c.bUncut, den: perReception,
    unit: 'options / reception', starred: true,
    what: '⭐⭐ THE SUPPLY HEADLINE (GK-inclusive), BU-C0\'s frozen definition. BU-T1 band of '
      + 'record: 0.766–0.794.',
  },
  behindBallOptionsPerPressedReception: {
    num: (c) => c.bUncut, den: (_c, r) => r.receptionsPressed,
    unit: 'options / pressed reception',
    what: '⭐ the same count at PRESSED receptions (the build-up moment that matters)',
  },
  shareReceptionsWithNoBehindOptionAtRef: {
    num: (_c, r) => r.behindHist[0], den: perReception,
    unit: 'share of receptions',
    what: 'receptions offering ZERO behind-ball option — REFERENCE-RUNG histogram only '
      + '(published once, identical across rung columns BY CONSTRUCTION; not a rung response)',
  },
  /* ---- the ladder's own rungs, per direction ---- */
  ladderL2OutfieldBackwardPerReception: {
    num: (c) => outfieldOf(c, 'bFlight'), den: perReception,
    unit: 'bodies / reception', what: 'L2 OUTFIELD BACKWARD — the ball actually arrives',
  },
  ladderL3OutfieldBackwardPerReception: {
    num: (c) => outfieldOf(c, 'bRace'), den: perReception,
    unit: 'options / reception', what: 'L3 OUTFIELD BACKWARD — the receiver wins the race',
  },
  ladderL1OutfieldBackwardBodiesPerReception: {
    num: (c) => outfieldOf(c, 'behind'), den: perReception,
    unit: 'bodies / reception',
    what: 'L1 OUTFIELD BACKWARD — POSITION ONLY, rung-INDEPENDENT by construction (gPaired)',
  },
  lateralCorridorSurvival: {
    num: (c) => c.lUncut, den: (c) => c.lRace,
    unit: 'share of race-winning lateral options', starred: true,
    what: '⭐ THE LATERAL FACE — the corridor rung for the sideways ball',
  },
  lateralOptionsPerReception: {
    num: (c) => c.lUncut, den: perReception,
    unit: 'options / reception', what: 'surviving LATERAL options per reception',
  },
  forwardCorridorSurvival: {
    num: (c) => c.aUncut, den: (c) => c.aRace,
    unit: 'share of race-winning forward options', starred: true,
    what: '⭐ THE FORWARD FACE — the corridor rung for the ball played ahead',
  },
  forwardOptionsPerReception: {
    num: (c) => c.aUncut, den: perReception,
    unit: 'options / reception', what: 'surviving FORWARD options per reception',
  },
  allDirectionOptionsPerReception: {
    num: (c) => c.uncutAll, den: perReception,
    unit: 'options / reception', what: 'ALL surviving options, any direction',
  },
  allDirectionCorridorSurvival: {
    num: (c) => c.uncutAll, den: (c) => c.raceAll,
    unit: 'share of race-winning options', what: 'the corridor rung pooled over all directions',
  },
  raceWinShareAllDirections: {
    num: (c) => c.raceAll, den: (c) => c.mates,
    unit: 'share of team-mates', what: 'L3 pooled — the race rung\'s own response to ball speed',
  },
  /* ---- ⭐ (c) THE RECEIVING COST ---- */
  meanArrivalSpeedOnSurvivingOptions: {
    num: (c) => c.sArrivalSpeedSum, den: (c) => c.sCount,
    unit: 'm/s', starred: true,
    what: '⭐⭐ the ball\'s ARRIVAL SPEED on the surviving-option population — the quantity the '
      + 'receiving cost is a function of',
  },
  meanReceptionRelativeSpeedOnSurvivingOptions: {
    num: (c) => c.sRelSpeedSum, den: (c) => c.sCount,
    unit: 'm/s',
    what: 'the CLOSING speed the receiver must absorb (ball minus his own motion) — the exact '
      + 'argument `touchFailChance` is called with',
  },
  shareSurvivingOptionsBelowTheFreeThreshold: {
    num: (c) => c.sFree, den: (c) => c.sCount,
    unit: 'share of surviving options',
    what: `⭐ FREE BY EARLY RETURN — closing speed <= ${TOUCH_FREE_SPEED} m/s, where `
      + '`attemptFirstTouch` returns clean WITHOUT rolling',
  },
  shareSurvivingOptionsAtOrAboveBaseSaturation: {
    num: (c) => c.sAtBaseSat, den: (c) => c.sCount,
    unit: 'share of surviving options', starred: true,
    what: `⭐⭐ THE DOMINANCE HAZARD, MEASURED — closing speed >= ${BASE_SATURATION_SPEED} m/s, `
      + 'where the SHIPPED touch curve\'s speed term is already SATURATED and one more m/s of '
      + 'ball speed costs EXACTLY ZERO',
  },
  shareSurvivingOptionsAtOrAboveHeavySaturation: {
    num: (c) => c.sAtHeavySat, den: (c) => c.sCount,
    unit: 'share of surviving options',
    what: `the same test against the BANKED heavy curve's edge (${HEAVY_SATURATION_SPEED} m/s = `
      + 'the ground-pass launch cap) — how much headroom the banked alternative would have',
  },
  meanBaseSpeedTermOnSurvivingOptions: {
    num: (c) => c.sBaseTermSum, den: (c) => c.sCount,
    unit: 'raw pFail units', starred: true,
    what: '⭐⭐ WHAT THE ENGINE CHARGES TODAY — the SHIPPED `TOUCH_SPEED_COST.base` speed term '
      + `(clamp01((s-${TOUCH_SPEED_ORIGIN})/${TOUCH_SPEED_COST.base.span})·${TOUCH_SPEED_COST.base.weight}), `
      + `× ${round(TECHNIQUE_MUL, 4)} for the generic receiver`,
  },
  meanHeavySpeedTermOnSurvivingOptions: {
    num: (c) => c.sHeavyTermSum, den: (c) => c.sCount,
    unit: 'raw pFail units',
    what: 'the BANKED heavy curve\'s speed term on the same population (EDS E1b\'s own honest '
      + 'curve, already in src, flag-selected per call) — the derived-cost candidate',
  },
  meanTouchFailPriorOnSurvivingOptions: {
    num: (c) => c.sPriorSum, den: (c) => c.sCount,
    unit: 'probability',
    what: 'the ORACLE\'S OWN full `touchFailPrior` (speed + pressure + blind side, generic '
      + 'receiver) — what a chooser could price today if it read it',
  },
  shareTouchFailPriorAtCeiling: {
    num: (c) => c.sPriorAtCeiling, den: (c) => c.sCount,
    unit: 'share of surviving options',
    what: `the share already pinned at the curve's hard ceiling (${TOUCH_PRIOR_CEILING}) — where `
      + 'even the OTHER terms have stopped responding',
  },
  meanArrivalSpeedOnOutfieldBackwardSurvivors: {
    num: (c) => c.bofArrivalSpeedSum, den: (c) => c.bofCount,
    unit: 'm/s',
    what: '⭐ the arrival speed on the slice this arc is about — surviving OUTFIELD BACKWARD balls',
  },
  meanBaseSpeedTermOnOutfieldBackwardSurvivors: {
    num: (c) => c.bofBaseTermSum, den: (c) => c.bofCount,
    unit: 'raw pFail units',
    what: '⭐ the shipped speed charge on the outfield backward survivors',
  },
  meanHeavySpeedTermOnOutfieldBackwardSurvivors: {
    num: (c) => c.bofHeavyTermSum, den: (c) => c.bofCount,
    unit: 'raw pFail units',
    what: 'the banked heavy curve\'s charge on the same slice',
  },
  /* ---- ⭐ (d) THE OVERSHOOT FACE ---- */
  shareSurvivingOptionsOverrunningTheControlEnvelope: {
    num: (c) => c.sOverrun, den: (c) => c.sCount,
    unit: 'share of surviving options', starred: true,
    what: '⭐⭐ THE OVERSHOOT FACE — the ball rolls past the receiver by more than CONTROL_RADIUS '
      + `(${CONTROL_RADIUS} m) in the time he is LATE to the landing point `
      + '(`rolledDistance(arrivalSpeed, max(0, receiverArrival − ballArrival))`, the engine\'s '
      + 'own closed form)',
  },
  meanOverrunMetresOnSurvivingOptions: {
    num: (c) => c.sOverrunSum, den: (c) => c.sCount,
    unit: 'metres', what: 'the mean overrun distance itself',
  },
  shareSurvivingOptionsWhoseRestPointLeavesThePitch: {
    num: (c) => c.sOffPitch, den: (c) => c.sCount,
    unit: 'share of surviving options', starred: true,
    what: '⭐ THE OUT FACE — the ball\'s roll-out endpoint (targetPoint + dir·D∞, D∞ = v/k, the '
      + 'engine\'s own law) lies outside the pitch, i.e. an UNCONTROLLED ball would leave play',
  },
  meanRestOvershootMetresOnSurvivingOptions: {
    num: (c) => c.sRestOverSum, den: (c) => c.sCount,
    unit: 'metres', what: 'D∞ = arrivalSpeed / BALL_FRICTION_K — how far past the receiver an '
      + 'untouched ball would still travel',
  },
  meanFlightSecondsOnSurvivingOptions: {
    num: (c) => c.sFlightSecondsSum, den: (c) => c.sCount,
    unit: 'sim-s', starred: true,
    what: '⭐ THE MECHANISM ITSELF — flight time on the surviving options. A firmer ball\'s '
      + 'whole claim is that this number falls.',
  },
  /* ---- receipts / context ---- */
  receptionsPerMatch: {
    num: (_c, r) => r.receptions, den: () => 1,
    unit: 'receptions / match', what: 'the census\'s own denominator (dual-axis: see the clock)',
  },
  oracleNullShare: {
    num: (c) => c.oracleNulls, den: (c) => c.oracleCalls,
    unit: 'share of oracle calls', what: 'a receipt — how often the oracle refused a pair',
  },
};
const FACE_KEYS = Object.keys(FACES);

/* ---- the estimator: CLUSTER BOOTSTRAP over match seeds, PAIRED ACROSS RUNGS ---- */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
interface FaceRow {
  face: string; unit: string; what: string; starred: boolean;
  rungs: Record<string, { point: number; num: number; den: number; ci95: [number, number] }>;
  /** vs the REFERENCE rung, on the SAME bootstrap draws (paired within seed AND within scene). */
  contrast: Record<string, {
    delta: number; ci95: [number, number]; relative: number; halfWidth: number;
    absOverHalfWidth: number; resolved: boolean;
  }>;
}
const scoreFaces = (b: Battery): FaceRow[] => {
  const K = b.rows.length;
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
    for (const l of RUNG_LABELS) {
      nums[l] = b.rows.map((r) => f.num(r.atReceptions[l], r));
      dens[l] = b.rows.map((r) => f.den(r.atReceptions[l], r));
    }
    const rungs: FaceRow['rungs'] = {};
    const point: Record<string, number> = {};
    const drawVals: Record<string, number[]> = {};
    for (const l of RUNG_LABELS) {
      const n = sum(nums[l]); const d = sum(dens[l]);
      point[l] = ratio(n, d);
      const vals: number[] = [];
      for (const idx of draws) {
        let nn = 0; let dd = 0;
        for (const i of idx) { nn += nums[l][i]; dd += dens[l][i]; }
        vals.push(ratio(nn, dd));
      }
      drawVals[l] = vals;
      const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
      rungs[l] = {
        point: point[l], num: n, den: d,
        ci95: s.length === 0 ? [Number.NaN, Number.NaN]
          : [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]],
      };
    }
    const contrast: FaceRow['contrast'] = {};
    for (const l of RUNG_LABELS) {
      if (l === REF_LABEL) continue;
      const vals: number[] = [];
      for (let d = 0; d < BOOTSTRAP; d++) vals.push(drawVals[l][d] - drawVals[REF_LABEL][d]);
      const s = vals.filter(Number.isFinite).sort((x, y) => x - y);
      const lo = s.length === 0 ? Number.NaN : s[Math.floor(0.025 * s.length)];
      const hi = s.length === 0 ? Number.NaN
        : s[Math.min(s.length - 1, Math.floor(0.975 * s.length))];
      const delta = point[l] - point[REF_LABEL];
      const halfWidth = (hi - lo) / 2;
      contrast[l] = {
        delta, ci95: [lo, hi],
        relative: point[REF_LABEL] === 0 ? Number.NaN : delta / point[REF_LABEL],
        halfWidth,
        absOverHalfWidth: halfWidth === 0 ? Number.NaN : Math.abs(delta) / halfWidth,
        resolved: (lo > 0 && hi > 0) || (lo < 0 && hi < 0),
      };
    }
    out.push({ face: key, unit: f.unit, what: f.what, starred: f.starred === true, rungs, contrast });
  }
  return out;
};

/* ========================================================================== */
/* §9 THE DETERMINISTIC CORE (G-DET runs it twice)                             */
/* ========================================================================== */
interface Core { battery: Battery; faces: FaceRow[] }
const runCore = (): Core => {
  const battery = runBattery();
  return { battery, faces: scoreFaces(battery) };
};
const cellOf = (r: Row): Record<string, unknown> => ({
  seed: r.seed, sig: r.signature, armOk: r.armOk,
  rec: r.receptions, recP: r.receptionsPressed, recOpen: r.receptionsOpenPlay,
  carS: r.carrierSamples, carSP: r.carrierSamplesPressed,
  hist: r.behindHist,
  atRec: r.atReceptions, atRecP: r.atPressedReceptions, atCar: r.atPressedCarrier,
  ticks: r.ticks, inPlay: r.inPlayTicks, simS: r.simSeconds, goals: r.goals,
  passes: r.enginePasses,
});
const coreDigest = (c: Core): string => sha(canonical({
  faces: c.faces, rows: c.battery.rows.map(cellOf),
}));

banner(`  [pw-c0] mode=${MODE} N=${N_RUN} seeds × ${RUNGS.length} rungs × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [pw-c0] G-DET second run…');
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
/* §10 THE READINGS THE GATES SCORE                                            */
/* ========================================================================== */
const armOkCount = rows().filter((r) => r.armOk).length;
const armTotal = rows().length;
const armedProbe = matchOf(GWORLD_SEED);
const bareProbe = matchOf(GWORLD_SEED, true);
const worldSeedOk = l3ArmedVersion(armedProbe) === L3_WORLD_VERSION
  && a4ArmedVersion(bareProbe) === 0;

/** ⭐⭐ THE PAIRING RECEIPT — the L1 body counts are IDENTICAL across rungs, so every rung row
 *  is the SAME scene population with only the ball speed changed. */
const pairing = (() => {
  let checked = 0; let bad = 0;
  for (const r of rows()) {
    for (const pop of [r.atReceptions, r.atPressedReceptions, r.atPressedCarrier]) {
      const ref = pop[REF_LABEL];
      for (const l of RUNG_LABELS) {
        if (l === REF_LABEL) continue;
        checked += 1;
        const c = pop[l];
        if (c.mates !== ref.mates || c.behind !== ref.behind || c.lateral !== ref.lateral
          || c.ahead !== ref.ahead || c.behindGk !== ref.behindGk) bad += 1;
      }
    }
  }
  return { checked, bad };
})();

/** ⭐ THE ORACLE RECEIPT — the engine's own machinery was actually exercised, at every rung. */
const oracleReceipt = (() => {
  const perRung: Record<string, {
    calls: number; nulls: number; corridor: number; option: number;
    race: number; uncut: number; gk: number; outfieldBehind: number; survivors: number;
  }> = {};
  for (const l of RUNG_LABELS) {
    let calls = 0; let nulls = 0; let corridor = 0; let option = 0;
    let race = 0; let uncut = 0; let gk = 0; let outfieldBehind = 0; let survivors = 0;
    for (const r of rows()) {
      for (const pop of [r.atReceptions, r.atPressedReceptions, r.atPressedCarrier]) {
        const c = pop[l];
        calls += c.oracleCalls; nulls += c.oracleNulls; corridor += c.corridorCalls;
        option += c.optionCalls; race += c.raceAll; uncut += c.uncutAll;
        gk += c.behindGk; outfieldBehind += outfieldOf(c, 'behind'); survivors += c.sCount;
      }
    }
    perRung[l] = { calls, nulls, corridor, option, race, uncut, gk, outfieldBehind, survivors };
  }
  return perRung;
})();
const everyRungRanTheCorridor = RUNG_LABELS.every((l) => oracleReceipt[l].corridor > 0);
const everyRungSawBothVerdicts = RUNG_LABELS.every((l) => oracleReceipt[l].uncut > 0
  && oracleReceipt[l].uncut < oracleReceipt[l].race);
const everyRungSawBothSidesOfTheGkSplit = RUNG_LABELS.every((l) => oracleReceipt[l].gk > 0
  && oracleReceipt[l].outfieldBehind > 0);
const everyRungValuedItsSurvivors = RUNG_LABELS.every((l) => oracleReceipt[l].survivors > 0);

/** ⭐⭐ THE PHYSICS-HONESTY RECEIPT — the multiplier's propagation, PROVEN NUMERICALLY.
 *  The launch law is exactly linear in the multiplier; the two implementations agree; and the
 *  SIM's clamp is the ONLY bound on the axis. */
const physicsProof = (() => {
  const probeDistances = [2, 5, 10, 15, 20, 25, 30, 35];
  const linearity: { d: number; maxRelErr: number }[] = [];
  let maxLinearErr = 0;
  for (const d of probeDistances) {
    const base = Math.min(Math.max(d * LAUNCH_SLOPE + LAUNCH_INTERCEPT, LAUNCH_CLAMP_LO), LAUNCH_CLAMP_HI);
    let worst = 0;
    for (const r of RUNGS) {
      // a STATIONARY target at distance d: lead is zero, so `distance` === d exactly.
      const f = predictGroundPass({ x: 0, y: 0 }, { pos: { x: d, y: 0 }, vel: { x: 0, y: 0 } }, r.power);
      const want = base * r.power;
      const rel = Math.abs(f.launchSpeed - want) / want;
      if (rel > worst) worst = rel;
    }
    linearity.push({ d, maxRelErr: worst });
    if (worst > maxLinearErr) maxLinearErr = worst;
  }
  /** the ORACLE's own travel-time law re-derived at each rung for a mid-range ball. */
  const travel = RUNGS.map((r) => {
    const d = 15;
    const base = Math.min(Math.max(d * LAUNCH_SLOPE + LAUNCH_INTERCEPT, LAUNCH_CLAMP_LO), LAUNCH_CLAMP_HI);
    const launch = base * r.power;
    const t = groundBallTravelTime(d, launch);
    return {
      rung: r.label, power: round(r.power, 6), launchSpeed: round(launch, 6),
      travelSeconds: round(t, 6),
      arrivalSpeed: round(groundBallSpeedAt(launch, t), 6),
      rangeCeilingM: round(launch * RANGE_PER_LAUNCH_SPEED, 6),
    };
  });
  /** ⭐ THE SIM/ORACLE DIVERGENCE, computed: what the sim would actually strike per rung. */
  const simClamped = RUNGS.map((r) => ({
    rung: r.label, chosen: round(r.power, 6),
    simIntended: round(Math.min(Math.max(r.power, PASS_POWER_MIN), PASS_POWER_MAX), 6),
    oraclePriced: round(Math.max(0.1, r.power), 6),
    honest: Math.abs(Math.min(Math.max(r.power, PASS_POWER_MIN), PASS_POWER_MAX)
      - Math.max(0.1, r.power)) < 1e-12,
  }));
  return {
    linearity, maxLinearErr, travel, simClamped,
    everyExpressibleRungIsHonest: simClamped
      .filter((s) => RUNGS.find((r) => r.label === s.rung)!.expressible).every((s) => s.honest),
    theDiagnosticRungIsDishonest: simClamped
      .filter((s) => !RUNGS.find((r) => r.label === s.rung)!.expressible).every((s) => !s.honest),
  };
})();

/** NON-VACUITY at claim grain: every published face's denominator, per rung. */
const vacuity = (() => {
  const empties: string[] = [];
  let cells = 0;
  for (const f of C.faces) {
    for (const l of RUNG_LABELS) {
      cells += 1;
      if (f.rungs[l].den === 0) empties.push(`${l}.${f.face}`);
    }
  }
  return { cells, empties };
})();

/* ========================================================================== */
/* §11 gFaces — RE-DERIVED FROM THE SERIALIZED ARTIFACT ON DISK (#287.1)        */
/* ========================================================================== */
/** parses the artifact BACK OFF DISK and re-derives every published point from its cells. */
const rederiveFromDisk = (path: string): { checked: number; bad: number; parsed: boolean } => {
  let file: Record<string, unknown>;
  try { file = readJson(path); } catch { return { checked: 0, bad: 1, parsed: false }; }
  const cells = (file.perSeedCells ?? []) as Record<string, unknown>[];
  const faces = (file.faces ?? []) as Record<string, unknown>[];
  if (cells.length === 0 || faces.length === 0) return { checked: 0, bad: 1, parsed: false };
  let checked = 0; let bad = 0;
  for (const fr of faces) {
    const key = String(fr.face);
    const f = FACES[key];
    if (f === undefined) { bad += 1; continue; }
    const published = fr.rungs as Record<string, { point: number | string }>;
    for (const l of RUNG_LABELS) {
      checked += 1;
      let n = 0; let d = 0;
      for (const cell of cells) {
        const pseudoRow = {
          receptions: Number(cell.rec), receptionsPressed: Number(cell.recP),
          behindHist: cell.hist as number[],
        } as unknown as Row;
        const c = (cell.atRec as Record<string, RungCensus>)[l];
        n += f.num(c, pseudoRow);
        d += f.den(c, pseudoRow);
      }
      const want = ratio(n, d);
      const got = published[l].point;
      if (d === 0) { if (got !== 'UNMEASURED') bad += 1; continue; }
      if (typeof got !== 'number' || Math.abs(round(want) - got) > 1e-9) bad += 1;
    }
  }
  return { checked, bad, parsed: true };
};

/* ---- gSeed ---- */
const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{ name: 'PW-C0 battery', range: [BATTERY_BASE, BATTERY_BASE + N_RUN - 1] as [number, number] }]
    : []),
  { name: 'PW-C0 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 19] },
  { name: 'PW-C0 preflight/guard block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  { name: 'PW-C0 world-identity seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
const allSeedsInBand = rows().every((r) => r.seed >= BASE_RUN && r.seed <= BASE_RUN + N_RUN - 1);
const allSeedsInTheDispatchedBlock = CLAIMED
  .every((c) => c.range[0] >= 12_490_000 && c.range[1] <= 12_490_999);

/* ========================================================================== */
/* §12 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
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

/* ---- 2 xSrcUntouched (the CORRECTED form: BU-C0 §COMMANDER CORRECTIONS 5, ruling #286.1) ---- */
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

/* ---- 6 gPhysics — ⭐⭐ THE PHYSICS AUDIT'S OWN GATE (M-PW.1) ---- */
registerGate<{
  simLaw: boolean; oracleLaw: boolean; sameLaw: boolean; simClamps: number;
  oracleUpper: boolean; oracleFloor: number; linErr: number; honest: boolean; dishonest: boolean;
  leadSim: number; leadOracle: number; region: readonly [number, number];
  callSites: number; nonDefault: number; sig: boolean;
}>({
  name: 'gPhysics',
  fn: (i) => ({
    theSimLaunchLawWasExtractedFromSrc: i.simLaw,
    theOracleLaunchLawWasExtractedFromSrc: i.oracleLaw,
    theTwoImplementationsAreTheSameLaw: i.sameLaw,
    theSimClampsTheChosenPowerExactlyOnce: i.simClamps === 1,
    theOracleHasNoUpperClampOnPower: !i.oracleUpper,
    theOracleFloorsPowerAtItsOwnConstant: i.oracleFloor > 0,
    theLaunchSpeedIsLinearInTheMultiplier: i.linErr < 1e-12,
    everyExpressibleRungIsStruckAsChosen: i.honest,
    theDiagnosticRungIsProvenDishonest: i.dishonest,
    theTwoLeadLawsUseTheSameDivisor: i.leadSim === i.leadOracle,
    theExpressibleRegionIsTheSubstratesOwnClamp:
      i.region[0] === PASS_POWER_MIN && i.region[1] === PASS_POWER_MAX,
    theLiveCallerScanFoundCallSites: i.callSites > 0,
    noLiveCallerChoosesANonDefaultWeight: i.nonDefault === 0,
    thePowerArgumentIndexTracesToTheWrappersOwnSignature: i.sig,
  }),
  input: {
    simLaw: Number.isFinite(LAUNCH_SLOPE) && Number.isFinite(LAUNCH_CLAMP_HI),
    oracleLaw: Number.isFinite(ORACLE_SLOPE) && Number.isFinite(ORACLE_CLAMP_HI),
    sameLaw: LAUNCH_SLOPE === ORACLE_SLOPE && LAUNCH_INTERCEPT === ORACLE_INTERCEPT
      && LAUNCH_CLAMP_LO === ORACLE_CLAMP_LO && LAUNCH_CLAMP_HI === ORACLE_CLAMP_HI,
    simClamps: SIM_POWER_CLAMPS,
    oracleUpper: ORACLE_HAS_UPPER_CLAMP,
    oracleFloor: ORACLE_POWER_FLOOR,
    linErr: physicsProof.maxLinearErr,
    honest: physicsProof.everyExpressibleRungIsHonest,
    dishonest: physicsProof.theDiagnosticRungIsDishonest,
    leadSim: SIM_LEAD_DIVISOR, leadOracle: ORACLE_LEAD_DIVISOR,
    region: EXPRESSIBLE,
    callSites: PERFORM_PASS_CALLS, nonDefault: PERFORM_PASS_NONDEFAULT,
    sig: MATCH_PERFORM_PASS_SIG,
  },
  mutants: [
    { conjunct: 'theSimLaunchLawWasExtractedFromSrc', name: 'the sim launch law stopped tracing', mutate: (i) => ({ ...i, simLaw: false }) },
    { conjunct: 'theOracleLaunchLawWasExtractedFromSrc', name: 'the oracle launch law stopped tracing', mutate: (i) => ({ ...i, oracleLaw: false }) },
    { conjunct: 'theTwoImplementationsAreTheSameLaw', name: 'the mirror drifted from the sim', mutate: (i) => ({ ...i, sameLaw: false }) },
    { conjunct: 'theSimClampsTheChosenPowerExactlyOnce', name: 'the power clamp moved or multiplied', mutate: (i) => ({ ...i, simClamps: 2 }) },
    { conjunct: 'theOracleHasNoUpperClampOnPower', name: 'the oracle grew an upper clamp', mutate: (i) => ({ ...i, oracleUpper: true }) },
    { conjunct: 'theOracleFloorsPowerAtItsOwnConstant', name: 'the oracle floor stopped tracing', mutate: (i) => ({ ...i, oracleFloor: Number.NaN }) },
    { conjunct: 'theLaunchSpeedIsLinearInTheMultiplier', name: 'the multiplier stopped being faithful', mutate: (i) => ({ ...i, linErr: 1 }) },
    { conjunct: 'everyExpressibleRungIsStruckAsChosen', name: 'a published rung is outside the sim clamp', mutate: (i) => ({ ...i, honest: false }) },
    { conjunct: 'theDiagnosticRungIsProvenDishonest', name: 'the divergence exhibit stopped exhibiting', mutate: (i) => ({ ...i, dishonest: false }) },
    { conjunct: 'theTwoLeadLawsUseTheSameDivisor', name: 'the lead laws diverged', mutate: (i) => ({ ...i, leadSim: 99 }) },
    { conjunct: 'theExpressibleRegionIsTheSubstratesOwnClamp', name: 'the region stopped being the shipped clamp', mutate: (i) => ({ ...i, region: [0, 9] as unknown as readonly [number, number] }) },
    { conjunct: 'theLiveCallerScanFoundCallSites', name: 'the caller scan found nothing (a vacuous receipt)', mutate: (i) => ({ ...i, callSites: 0 }) },
    { conjunct: 'noLiveCallerChoosesANonDefaultWeight', name: 'a live caller started choosing a weight', mutate: (i) => ({ ...i, nonDefault: 1 }) },
    { conjunct: 'thePowerArgumentIndexTracesToTheWrappersOwnSignature', name: 'the wrapper signature stopped tracing', mutate: (i) => ({ ...i, sig: false }) },
  ],
});

/* ---- 7 gPaired — ⭐⭐ THE SAME SCENES, ONLY THE BALL SPEED DIFFERS ---- */
registerGate<{ checked: number; bad: number; rungs: number; ref: boolean }>({
  name: 'gPaired',
  fn: (i) => ({
    everyRungSeesTheIdenticalBodyPopulation: i.bad === 0,
    theLadderHasEveryDerivedRung: i.rungs === RUNGS.length,
    theReferenceRungIsInTheLadder: i.ref,
    nonVacuousPairingCheck: i.checked > 0,
  }),
  input: {
    checked: pairing.checked, bad: pairing.bad, rungs: RUNG_LABELS.length,
    ref: RUNG_LABELS.includes(REF_LABEL),
  },
  mutants: [
    { conjunct: 'everyRungSeesTheIdenticalBodyPopulation', name: 'a rung saw a different scene', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'theLadderHasEveryDerivedRung', name: 'a rung went missing', mutate: (i) => ({ ...i, rungs: 1 }) },
    { conjunct: 'theReferenceRungIsInTheLadder', name: 'the reference rung vanished', mutate: (i) => ({ ...i, ref: false }) },
    { conjunct: 'nonVacuousPairingCheck', name: 'the pairing was never checked', mutate: (i) => ({ ...i, checked: 0 }) },
  ],
});

/* ---- 8 gOracle — the ladder IS the engine's own machinery, at every rung ---- */
registerGate<{
  corridor: boolean; both: boolean; gkSplit: boolean; valued: boolean; band: number;
}>({
  name: 'gOracle',
  fn: (i) => ({
    everyRungActuallyRanTheCorridorSampler: i.corridor,
    everyRungSawBothCorridorVerdicts: i.both,
    everyRungSawBothSidesOfTheGkSplit: i.gkSplit,
    everyRungValuedItsOwnSurvivors: i.valued,
    theForwardBandIsTheEnginesOwn: i.band === 2,
  }),
  input: {
    corridor: everyRungRanTheCorridor, both: everyRungSawBothVerdicts,
    gkSplit: everyRungSawBothSidesOfTheGkSplit, valued: everyRungValuedItsSurvivors,
    band: FORWARD_BAND_M,
  },
  mutants: [
    { conjunct: 'everyRungActuallyRanTheCorridorSampler', name: 'a rung never ran the corridor', mutate: (i) => ({ ...i, corridor: false }) },
    { conjunct: 'everyRungSawBothCorridorVerdicts', name: 'a rung had a constant corridor verdict', mutate: (i) => ({ ...i, both: false }) },
    { conjunct: 'everyRungSawBothSidesOfTheGkSplit', name: 'the GK split went one-sided', mutate: (i) => ({ ...i, gkSplit: false }) },
    { conjunct: 'everyRungValuedItsOwnSurvivors', name: 'the option valuation never ran', mutate: (i) => ({ ...i, valued: false }) },
    { conjunct: 'theForwardBandIsTheEnginesOwn', name: 'the ±2 m band stopped tracing to src', mutate: (i) => ({ ...i, band: 3 }) },
  ],
});

/* ---- 9 gTouchCost — ⭐ the receiving-cost audit reads the SHIPPED curve ---- */
registerGate<{
  span: number; weight: number; heavySpan: number; heavyWeight: number;
  origin: number; free: number; ceiling: number; shipped: boolean;
}>({
  name: 'gTouchCost',
  fn: (i) => ({
    theBaseCurveIsTheShippedOne: i.span === TOUCH_SPEED_COST.base.span
      && i.weight === TOUCH_SPEED_COST.base.weight,
    theHeavyCurveIsTheBankedOne: i.heavySpan === TOUCH_SPEED_COST.heavy.span
      && i.heavyWeight === TOUCH_SPEED_COST.heavy.weight,
    theSpeedOriginWasExtractedFromSrc: Number.isFinite(i.origin) && i.origin > 0,
    theFreeThresholdWasExtractedFromSrc: Number.isFinite(i.free) && i.free > 0,
    theCeilingWasExtractedFromSrc: Number.isFinite(i.ceiling) && i.ceiling > 0,
    theWalkedWorldUsesTheSHIPPEDCurveNotTheHeavyOne: i.shipped,
  }),
  input: {
    span: TOUCH_SPEED_COST.base.span, weight: TOUCH_SPEED_COST.base.weight,
    heavySpan: TOUCH_SPEED_COST.heavy.span, heavyWeight: TOUCH_SPEED_COST.heavy.weight,
    origin: TOUCH_SPEED_ORIGIN, free: TOUCH_FREE_SPEED, ceiling: TOUCH_PRIOR_CEILING,
    shipped: !(matchOf(GWORLD_SEED) as unknown as { edsTouchCost: boolean }).edsTouchCost,
  },
  mutants: [
    { conjunct: 'theBaseCurveIsTheShippedOne', name: 'the base curve was replaced', mutate: (i) => ({ ...i, span: 1 }) },
    { conjunct: 'theHeavyCurveIsTheBankedOne', name: 'the heavy curve was replaced', mutate: (i) => ({ ...i, heavySpan: 1 }) },
    { conjunct: 'theSpeedOriginWasExtractedFromSrc', name: 'the speed origin stopped tracing', mutate: (i) => ({ ...i, origin: Number.NaN }) },
    { conjunct: 'theFreeThresholdWasExtractedFromSrc', name: 'the free threshold stopped tracing', mutate: (i) => ({ ...i, free: Number.NaN }) },
    { conjunct: 'theCeilingWasExtractedFromSrc', name: 'the pFail ceiling stopped tracing', mutate: (i) => ({ ...i, ceiling: Number.NaN }) },
    { conjunct: 'theWalkedWorldUsesTheSHIPPEDCurveNotTheHeavyOne', name: 'the walked world ran the heavy curve', mutate: (i) => ({ ...i, shipped: false }) },
  ],
});

/* ---- 10 gNonVacuity ---- */
registerGate<{ empties: string[]; cells: number }>({
  name: 'gNonVacuity',
  fn: (i) => ({
    noPublishedRateHasAZeroDenominator: i.empties.length === 0,
    nonVacuousCellCount: i.cells > 0,
  }),
  input: { empties: vacuity.empties, cells: vacuity.cells },
  mutants: [
    { conjunct: 'noPublishedRateHasAZeroDenominator', name: 'a rate was published on nothing', mutate: (i) => ({ ...i, empties: ['x'] }) },
    { conjunct: 'nonVacuousCellCount', name: 'nothing was published', mutate: (i) => ({ ...i, cells: 0 }) },
  ],
});

/* ---- 11 gFaces — parses the SERIALIZED artifact back off disk (#287.1) ---- */
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

/* ---- 12 gClock ---- */
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

/* ---- 13 gSeed ---- */
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
    { conjunct: 'everyClaimedBlockIsInsideTheDispatchedBand', name: 'a block left 12,490,000–999', mutate: (i) => ({ ...i, block: false }) },
  ],
});

/* ---- 14 gStats ---- */
const minGap = Math.min(...STATS_PUBLISHED_BASES.map((b) => Math.abs(STATS_BASE - b)));
registerGate<{ base: number; gap: number; resamples: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsTheDispatchedFloor: i.base === 112_400,
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

/* ---- 15 gEnvClean ---- */
registerGate<{ rogue: number; doors: number; preflight: boolean; out: string }>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogue === 0,
    noEngineDoorIsSet: i.doors === 0,
    aPreflightNeverWritesACanonicalPath: !i.preflight || !isCanonicalPath(i.out),
  }),
  input: { rogue: rogueOwn.length, doors: rogueEngine.length, preflight: IS_PREFLIGHT, out: OUT_PATH },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue PWC0_* var was accepted', mutate: (i) => ({ ...i, rogue: 1 }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'aPreflightNeverWritesACanonicalPath', name: 'a preflight wrote the canonical artifact', mutate: (i) => ({ ...i, preflight: true, out: OUT_BY_MODE.full }) },
  ],
});

/* ---- 16 gHashEnvelope — ⭐ #289 correction 1: the invocation facts are named ---- */
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs', 'head', 'outPath',
  'preflight', 'preflightReasons', 'mode'];
const envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[], named: FORBIDDEN_BODY_KEYS.length };
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

/* ---- 17 gMutants ---- */
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
/* §13 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
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
  banner('PW-C0 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
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
const pubFace = (f: FaceRow): Record<string, unknown> => ({
  face: f.face, unit: f.unit, what: f.what, starred: f.starred,
  rungs: Object.fromEntries(Object.entries(f.rungs).map(([k, v]) => [k, {
    point: v.den === 0 ? 'UNMEASURED' : round(v.point), num: v.num, den: v.den,
    ci95: v.den === 0 ? 'UNMEASURED' : v.ci95.map((x) => round(x)),
  }])),
  vsReference: Object.fromEntries(Object.entries(f.contrast).map(([k, v]) => [k, {
    delta: round(v.delta), ci95: v.ci95.map((x) => round(x)), relative: round(v.relative),
    halfWidth: round(v.halfWidth), absOverHalfWidth: round(v.absOverHalfWidth, 3),
    resolved: v.resolved,
  }])),
});

const buildBody = (
  gates: Record<string, boolean>, mutants: MutantResult[],
): Record<string, unknown> => ({
  stage: 'PW-C0 — THE WEIGHT-PHYSICS CENSUS',
  doc: 'docs/world-model/PW-C0-WEIGHT-PHYSICS-CENSUS.md',
  contract: 'docs/world-model/PW-PASSWEIGHT-CONTRACT.md §3 (PW-C0), bound #290.2, dispatched #290.3',
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    question: 'does `powerMultiplier` propagate HONESTLY end to end; where do the clamps bite; '
      + 'what does a firmer ball buy the corridor; what does the engine charge for receiving it; '
      + 'and does a faster ball overrun the receiver? INSTRUMENT-ONLY — nothing is armed or built.',
    arm: '⭐ THE v7 WORLD: `new Match({...a4MatchFlags(7)})` + `armA4World(m, null, 7, '
      + 'poolT1DoseCells(L3-T1))`, the SHIPPED entry path\'s own arming and its own POOLED matured '
      + 'dose; asserted LIVE on every walked match (#283.2(iv)). VIRGIN SEEDS.',
    designNote: 'ONE arm, MANY RUNGS. The contrast is not armed-vs-bare but RUNG-vs-RUNG, PAIRED '
      + 'WITHIN SCENE: the same reception, the same bodies, the same defenders — only the ball '
      + 'speed the oracle prices differs. gPaired asserts the L1 body counts are identical across '
      + 'rung columns, which is the pairing PROOF, not a comment.',
    ladderDefinition: 'BU-C0\'s reception-option ladder VERBATIM (L1 position on Q07\'s own ±2 m '
      + `band extracted from ${MECH_SRC_PATH}:${FORWARD_BAND_LINE} · L2 the engine\'s own flight `
      + 'prediction · L3 `arrivalMargin > 0` · L4 the engine\'s corridor sampler), with the '
      + 'powerMultiplier threaded into L2/L3/L4 through the ORACLE\'S OWN parameter. Commensurable '
      + 'with BU-C0 / BU-T0 / BU-T0b / BU-T1 by construction.',
    populations: {
      reception: 'every tick at which the ball\'s owner CHANGES while phase === "playing".',
      pressedReception: `a reception whose receiver has an opponent within ${PRESSURE_R} m `
        + `(TOUCH_CONTROL_DIST, ${CONST_SRC_PATH}:${PRESSURE_R_LINE}).`,
      pressedCarrierMoment: `a NON-reception carrier tick sampled every ${CARRIER_SAMPLE_TICKS} `
        + `ticks (${round(CARRIER_SAMPLE_TICKS * DT, 4)} sim-s) at which the carrier is pressed.`,
      survivingOption: 'an L1∧L2∧L3∧L4 option AT THAT RUNG; the receiving-cost and overshoot '
        + 'faces are measured on THIS population only (the set a chooser could actually pick from).',
    },
    clock: {
      matchDurationSimSeconds: MATCH_DURATION,
      displayMinutes: DISPLAY_MINUTES,
      displayMinutesTracedTo: `${MATCH_SRC_PATH}:${DISPLAY_MINUTES_LINE} (Match.minute())`,
      displaySecondsPerSimSecond: DISPLAY_S_PER_SIM_S,
      law: 'shares and per-option means are dimensionless or per-event and read the same on both '
        + 'axes; `receptionsPerMatch` is convention B (our match IS the 90′) and its convention-A '
        + 'form is × displaySecondsPerSimSecond. Flight/travel seconds are SIM seconds.',
      applied: 'APPLIED, not nominal: the duration is never overridden and gClock asserts it.',
    },
  },
  /* ---- ⭐⭐ (a) THE PHYSICS AUDIT ---- */
  physicsAudit: {
    pipeline: [
      `1. CHOICE — \`performPass(match, passer, mate, offsideExempt, powerChoice = ${REF_POWER})\` `
        + `(${MECH_SRC_PATH}). The weight INPUT already exists.`,
      `2. THE ONLY POWER CLAMP — \`intended = clamp(powerChoice, ${PASS_POWER_MIN}, `
        + `${PASS_POWER_MAX})\` (${MECH_SRC_PATH}:${SIM_POWER_CLAMP_LINE}). Occurrences in src: `
        + `${SIM_POWER_CLAMPS}.`,
      `3. LEAD — \`flight = dist / (${SIM_LEAD_DIVISOR} · orientation·intended)\`, receiver led by `
        + `\`vel · flight · ${LEAD_FRACTION_SIM}\`. The passer leads on what he MEANT.`,
      `4. EXECUTION ERROR — \`executedPassPower\`: gaussian × |intended−1| × `
        + `${PASS_POWER_NOISE_K} × (1.35 − passing), clamped to `
        + `[${PASS_POWER_EXECUTED_MIN}, ${PASS_POWER_EXECUTED_MAX}]. At intended === 1 it returns `
        + '1 and draws NO RNG — which is why every live call is byte-identical today.',
      `5. STRIKE — \`speed = clamp(d·${LAUNCH_SLOPE} + ${LAUNCH_INTERCEPT}, ${LAUNCH_CLAMP_LO}, `
        + `${LAUNCH_CLAMP_HI}) · executedMul\` (${MECH_SRC_PATH}:${LAUNCH_LINE}). ⭐ THE CLAMP IS `
        + 'APPLIED TO THE DISTANCE LAW, THEN MULTIPLIED.',
      `6. THE ORACLE MIRROR — \`predictGroundPass\` (${PRED_SRC_PATH}:${ORACLE_LAUNCH_LINE}): the `
        + `SAME law, but power is FLOORED ONLY (\`max(${ORACLE_POWER_FLOOR}, powerMultiplier)\`, `
        + `${PRED_SRC_PATH}:${ORACLE_POWER_FLOOR_LINE}) and carries NO execution error.`,
      `7. FRICTION — \`groundBallTravelTime\` walks the engine's own geometric series `
        + `(decay = exp(−${BALL_FRICTION_K}·DT) per tick); the range ceiling is `
        + `launchSpeed × ${round(RANGE_PER_LAUNCH_SPEED, 6)} m.`,
      `8. ARRIVAL SPEED — \`groundBallSpeedAt = launchSpeed · exp(−k·t)\` `
        + `(${OPT_SRC_PATH}:${ARRIVAL_SPEED_LINE}).`,
      `9. PROPAGATION — the multiplier reaches \`evaluatePassAffordance\` `
        + `(${AFF_SRC_PATH}:${AFF_POWER_LINE}), \`evaluatePassCorridorInterception\` `
        + `(${COR_SRC_PATH}:${COR_POWER_LINE}) and \`evaluatePassOption\` `
        + `(${OPT_SRC_PATH}:${OPT_POWER_LINE}) — every one of them defaults it to 1.`,
    ],
    honestyVerdict: {
      theLaunchLawIsExactlyLinearInTheMultiplier: physicsProof.maxLinearErr < 1e-12,
      maxRelativeLinearityError: physicsProof.maxLinearErr,
      linearityProbe: physicsProof.linearity,
      simAndOracleShareTheSameLaunchLaw: LAUNCH_SLOPE === ORACLE_SLOPE
        && LAUNCH_INTERCEPT === ORACLE_INTERCEPT && LAUNCH_CLAMP_LO === ORACLE_CLAMP_LO
        && LAUNCH_CLAMP_HI === ORACLE_CLAMP_HI,
      theOnlyDIVERGENCE: '⭐⭐ the SIM clamps the CHOSEN power to '
        + `[${PASS_POWER_MIN}, ${PASS_POWER_MAX}]; the ORACLE only FLOORS it at `
        + `${ORACLE_POWER_FLOOR}. INSIDE the sim clamp the two agree exactly; OUTSIDE it the `
        + 'oracle keeps pricing a ball the sim would never strike.',
      theSecondDIVERGENCE: 'the oracle prices the INTENDED power; the sim strikes the EXECUTED '
        + `one (gaussian, σ = |p−1|·${PASS_POWER_NOISE_K}·(1.35 − passing)). At p = 1 the error `
        + 'is identically 0; away from 1 the oracle is an UNBIASED but NOISELESS reading of a '
        + 'noisy strike. This is a KNOWN, DECLARED optimism, not a hidden one.',
      liveCallers: {
        performPassCallSitesInPlayerBrain: PERFORM_PASS_CALLS,
        callSitesSupplyingAnExplicitPowerArgument: PERFORM_PASS_WITH_EXPLICIT_POWER,
        powerArgumentIndexInTheWrapper: POWER_ARG_INDEX,
        callSitesPassingANonDefaultPower: PERFORM_PASS_NONDEFAULT,
        shippedDefaultLiteral: REF_POWER_RAW,
        argumentLists: PERFORM_PASS_ARGLISTS,
        note: `every live caller passes the default (${BRAIN_SRC_PATH}:${BRAIN_POWER_1_LINE} `
          + `passes an EXPLICIT ${REF_POWER_RAW}; the others omit the argument entirely) — the `
          + 'axis is dormant, exactly as the contract\'s §0 records. Read by a BALANCED-PAREN '
          + 'argument split, not a regex (see the §2 correction note).',
      },
    },
    whereTheClampsBite: {
      theLowClampBitesBelowMetres: round(CLAMP_LO_DISTANCE_M, 6),
      theHighClampBitesAboveMetres: round(CLAMP_HI_DISTANCE_M, 6),
      arithmetic: `d ≤ (${LAUNCH_CLAMP_LO} − ${LAUNCH_INTERCEPT})/${LAUNCH_SLOPE} = `
        + `${round(CLAMP_LO_DISTANCE_M, 4)} m → the base pins at ${LAUNCH_CLAMP_LO} m/s; `
        + `d ≥ (${LAUNCH_CLAMP_HI} − ${LAUNCH_INTERCEPT})/${LAUNCH_SLOPE} = `
        + `${round(CLAMP_HI_DISTANCE_M, 4)} m → the base pins at ${LAUNCH_CLAMP_HI} m/s.`,
      headline: 'THE CLAMP BITES ON THE DISTANCE→PACE MAP, NEVER ON THE POWER AXIS. Inside a distance '
        + 'band the base is a CONSTANT and the multiplier scales it exactly; beyond '
        + `${round(CLAMP_HI_DISTANCE_M, 2)} m EVERY ball is the same ${LAUNCH_CLAMP_HI} m/s base, `
        + 'which is precisely the "one pace per range" the contract\'s §0 names — and precisely '
        + 'where a weight choice has the MOST to add.',
      rangeCeilingPerLaunchSpeed: round(RANGE_PER_LAUNCH_SPEED, 6),
      rangeCeilingAtTheBaseCap: round(LAUNCH_CLAMP_HI * RANGE_PER_LAUNCH_SPEED, 4),
      rangeCeilingAtTheBaseCapTimesMaxPower:
        round(LAUNCH_CLAMP_HI * PASS_POWER_MAX * RANGE_PER_LAUNCH_SPEED, 4),
    },
    expressibleRegion: {
      region: EXPRESSIBLE,
      derivation: '⭐ THE λ_LIN IDIOM (BU-T0b): find the faithful region, CAP AT ITS EDGE, never '
        + 'invent a transform. The multiplier is faithful on the WHOLE line inside the oracle '
        + '(the launch law is exactly linear in it) — what bounds it is the SIM\'s own '
        + `\`clamp(powerChoice, ${PASS_POWER_MIN}, ${PASS_POWER_MAX})\`. Any rung outside that `
        + 'interval is priced by the oracle and NOT struck by the sim ⇒ UNEXPRESSIBLE. The region '
        + 'is therefore the shipped clamp itself, taken verbatim.',
      executionEnvelope: [PASS_POWER_EXECUTED_MIN, PASS_POWER_EXECUTED_MAX],
      executionEnvelopeNote: 'the EXECUTED power can wander to '
        + `[${PASS_POWER_EXECUTED_MIN}, ${PASS_POWER_EXECUTED_MAX}] through the technique error — `
        + 'that is a CONSEQUENCE of a choice, never a choice. The chooser\'s region is the '
        + 'INTENDED clamp.',
    },
    rungLadder: RUNGS.map((r) => ({
      label: r.label, power: round(r.power, 6), expressible: r.expressible,
      derivation: r.derivation,
    })),
    rungArithmetic: physicsProof.travel,
    rungHonesty: physicsProof.simClamped,
  },
  /* ---- ⭐ (c) THE RECEIVING-COST AUDIT, machine-read ---- */
  receivingCostAudit: {
    whatTheEngineChargesToday: [
      `1. THE FREE ZONE — \`attemptFirstTouch\` returns CLEAN without rolling when the closing `
        + `speed ≤ ${TOUCH_FREE_SPEED} m/s, and ALWAYS for a GK (${MECH_SRC_PATH}).`,
      `2. THE SPEED TERM — \`touchFailChance\`: `
        + `clamp01((s − ${TOUCH_SPEED_ORIGIN})/${TOUCH_SPEED_COST.base.span}) · `
        + `${TOUCH_SPEED_COST.base.weight}, i.e. the SHIPPED curve SATURATES at `
        + `${BASE_SATURATION_SPEED} m/s and its whole span is worth `
        + `${TOUCH_SPEED_COST.base.weight} raw pFail units `
        + `(× ${round(TECHNIQUE_MUL, 4)} for a generic receiver ⇒ `
        + `${round(TOUCH_SPEED_COST.base.weight * TECHNIQUE_MUL, 5)} absolute).`,
      `3. THE HARD CEILING — the whole prior is clamped to ${TOUCH_PRIOR_CEILING}.`,
      '4. THE ORACLE — `passOptionValue.mirroredTouchFailChance` restates the SAME curve and '
        + 'publishes `touchFailPrior`; a contract test pins the two equal.',
      '5. ⭐⭐ THE CHOOSER-FACING GAP — the published OPTION ladder (L1∧L2∧L3∧L4, the definition '
        + 'BU-C0/BU-T1 and this census use) reads flight, race and corridor. It does NOT read '
        + '`touchFailPrior` at all. At the ladder\'s own grain a faster ball is therefore '
        + 'STRICTLY BETTER AT ZERO COST — the dominance hazard, structurally.',
      `6. THE BANKED ALTERNATIVE — \`TOUCH_SPEED_COST.heavy\` (span `
        + `${TOUCH_SPEED_COST.heavy.span}, weight ${TOUCH_SPEED_COST.heavy.weight}) already ships `
        + `in src, flag-selected per call (\`match.edsTouchCost\`, OFF in the walked world). Its `
        + `saturation lands at ${HEAVY_SATURATION_SPEED} m/s = the ground-pass launch cap `
        + `${LAUNCH_CLAMP_HI} m/s — a DERIVED receiving cost, already in the substrate, not taste.`,
    ],
    baseCurve: TOUCH_SPEED_COST.base,
    heavyCurve: TOUCH_SPEED_COST.heavy,
    freeThresholdMetresPerSecond: TOUCH_FREE_SPEED,
    speedOriginMetresPerSecond: TOUCH_SPEED_ORIGIN,
    baseSaturationSpeed: BASE_SATURATION_SPEED,
    heavySaturationSpeed: HEAVY_SATURATION_SPEED,
    genericReceiverTechniqueMultiplier: round(TECHNIQUE_MUL, 6),
    priorCeiling: TOUCH_PRIOR_CEILING,
    ladderReadsTouchFailPrior: false,
    walkedWorldUsesHeavyCurve: false,
  },
  overshootDefinitions: {
    controlEnvelopeMetres: CONTROL_RADIUS,
    overrunLaw: 'rolledDistance(arrivalSpeed, max(0, receiverArrival − ballArrival)) — the '
      + 'engine\'s OWN closed form (src/sim/carryBeat.ts), fed with the oracle\'s own two arrival '
      + 'times. OVERSHOOT ⇔ that distance exceeds CONTROL_RADIUS.',
    restLaw: 'D∞ = arrivalSpeed / BALL_FRICTION_K — carryBeat\'s own roll-out endpoint law. The '
      + 'OUT face asks whether targetPoint + dir·D∞ leaves the pitch '
      + `(|x| > ${HALF_L} or |y| > ${HALF_W}).`,
    caveat: '⚠ BOTH are ORACLE-GEOMETRY faces on an UNTOUCHED ball: the engine\'s real receiver '
      + 'usually DOES touch it. They bound the overshoot pressure, they do not predict balls out.',
  },
  run: {
    N: N_RUN, base: BASE_RUN, rungs: RUNGS.length, walks: armTotal,
    perturbationControls: perturbCheck.total,
    receptions: sum(rows().map((r) => r.receptions)),
    pressedReceptions: sum(rows().map((r) => r.receptionsPressed)),
    pressedCarrierMoments: sum(rows().map((r) => r.carrierSamplesPressed)),
    oracleCallsPerRung: Object.fromEntries(RUNG_LABELS.map((l) => [l, oracleReceipt[l].calls])),
  },
  referenceRung: REF_LABEL,
  expressibleRungs: EXPRESSIBLE_LABELS,
  faces: C.faces.map(pubFace),
  oracleReceipt,
  pairingReceipt: pairing,
  perturbCheck,
  behindOptionHistogramAtReference: {
    buckets: Array.from({ length: HIST_MAX + 1 },
      (_, k) => sum(rows().map((r) => r.behindHist[k]))),
    denominator: sum(rows().map((r) => r.receptions)),
  },
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
  seeds: { claimed: CLAIMED, block: [12_490_000, 12_490_999] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 112_400, step: STATS_STEP },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    '⭐ INSTRUMENT-ONLY: nothing is armed, nothing is built, no seam acquires a caller, and '
      + '`src/**` is byte-untouched.',
    'The ladder answers "could the engine\'s own machinery get the ball there first at this ball '
      + 'speed" — CAPABILITY, never CHOICE (#200). No usage number exists in this stage.',
    'The rung rows are ORACLE re-evaluations of the SAME walked world, not counterfactual sims: '
      + 'nobody actually passed harder. What is measured is the option SET a chooser would see.',
    'The execution error is NOT in these rows: the oracle prices the INTENDED ball. Every rung '
      + 'row away from 1.0 is therefore an OPTIMISTIC reading of what would really be struck; the '
      + 'physics audit states the σ and the chooser slice must carry it.',
    'The overshoot faces are geometry on an UNTOUCHED ball; the sim\'s receiver usually touches it.',
    'The chooser-slice recommendation in the stage doc is ARITHMETIC over these rows; the ORDER '
      + 'itself is the commander\'s to bind.',
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
  const crossPath = '/tmp/pw-c0-cross-out.json';
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
banner(`\n  [pw-c0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [pw-c0] DEAD MUTANTS:');
  for (const m of dead) {
    banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
  }
}
const face = (k: string): FaceRow => C.faces.find((f) => f.face === k) as FaceRow;
const showRungs = (k: string): string => RUNG_LABELS
  .map((l) => `${l}=${face(k).rungs[l].point.toFixed(4)}`).join(' ');
banner(`  [pw-c0] outfield BACKWARD corridor survival — ${showRungs('outfieldBackwardCorridorSurvival')}`);
banner(`  [pw-c0] behind-ball options / reception    — ${showRungs('behindBallOptionsPerReception')}`);
banner(`  [pw-c0] mean flight seconds (survivors)    — ${showRungs('meanFlightSecondsOnSurvivingOptions')}`);
banner(`  [pw-c0] share at/above base saturation     — ${showRungs('shareSurvivingOptionsAtOrAboveBaseSaturation')}`);
banner(`  [pw-c0] mean base speed charge             — ${showRungs('meanBaseSpeedTermOnSurvivingOptions')}`);
banner(`  [pw-c0] overshoot share                    — ${showRungs('shareSurvivingOptionsOverrunningTheControlEnvelope')}`);
banner(`  [pw-c0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
