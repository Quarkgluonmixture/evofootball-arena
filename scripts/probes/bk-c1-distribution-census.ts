/**
 * ⭐⭐ BK-C1 — THE DISTRIBUTION CENSUS (docs/world-model/BK-C1-DISTRIBUTION-CENSUS.md).
 *
 * Authorized by ruling #329 item 5, serving the USER MANDATE of ruling #328 item 3. The user
 * ruled the DISTRIBUTION-CAROM sub-pattern UNREALISTIC — 「门将开球本来要给前面或者中锋,结果
 * 直接弹到后卫或者对面压迫过来的前锋的身体上然后弹回来,这个不现实足球」 — and asked
 * 「球的弧线要不要提高?」. #328 item 3 froze TWO hypotheses and their discriminator:
 *
 *   A (CAPABILITY): the loft ceiling is too low for a launch to clear a body wall at
 *     realistic ranges.  ⇒ the substrate CEILING moves honestly.
 *   B (PRICING):     clearing higher lines EXIST and are never chosen (the corridor is
 *     unpriced).  ⇒ the corridor gets a price; WHEN to go high stays emergent.
 *
 *   THE DISCRIMINATOR (#328 item 3, verbatim): "of the distribution caroms, how many had a
 *   CLEARING higher line AVAILABLE at the same target (available-but-unchosen = B;
 *   unavailable = A)".
 *   THE REALITY SIGNATURE (#328 item 3, verbatim): "block rate should RISE with pressure
 *   (learned line-picking) — flat-in-pressure = blind launching".
 *
 * INSTRUMENT-ONLY: `src/**` is untouched — nothing here arms, doses or edits a seam. There is
 * NO SCORED HYPOTHESIS. This is a CENSUS: it publishes MEASUREMENTS and a design pick, never a
 * football claim.
 *
 * THE WORLD OF RECORD: the **world-9 stack** — `a4MatchFlags(8)` + `armA4World` (matured L3/PC
 * doses, both dose FILES hashed AS BYTES before they are parsed) + `bkFacingLaw` +
 * `bkContactLaw`. ONE ARM: the carom only exists where the contact law is armed, and this
 * stage measures THAT world's anatomy — there is no between-arm comparison here and none is
 * invented.
 *
 * ⭐ CANON, COPIED FROM docs/world-model/CANON.md BESIDE ITS ACTUAL HOME (never re-typed from
 * memory, #301):
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
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site".  HOME: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1.
 *   · text-census corpus integrity, incl. THE FILE LIST.  HOMES: IN-C0-PERCEPTION-SURFACE.md
 *     §COMMANDER CORRECTIONS item 2 + third series item 1. (paraphrase)
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true
 *     since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf
 *     diagnostic)".  HOME: ruling #283.2(iv). — quoted for completeness; THIS probe builds
 *     `Match` DIRECTLY and never round-trips a League, so no worker fixture is generated.
 *   · "a dose-source guard should hash the bytes it reads, not a self-declared field".
 *     HOME: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6.
 *   · receipts ≠ effect sizes — a census publishes MEASUREMENTS and a design pick, never
 *     football claims.  HOMES: ruling #289 item 1 + BU-T1 §CORR item 5. (paraphrase)
 *   · seed discipline — BOOKED = WALKED; blocks consumed whole.  HOME: the standing frontier
 *     practice (#286 item 5 onward). (paraphrase)
 *   · clock honesty — 1 sim-s = 22.5 display-s; APPLIED never nominal.
 *     HOMES: ruling #280.2(iii) + PC-T2 §CORR item 3. (paraphrase)
 *
 * ⭐⭐ THE COUNTERFACTUAL USES THE SHIPPED FLIGHT MODEL, NOT AN IDEALISED BALLISTIC ONE
 * (#329 item 5's ⚠, binding). `replayFlight` below is the engine's OWN per-tick integrator,
 * transcribed statement-for-statement from `Match.stepBallPhysics` (`pos += vel·dt`;
 * `z += vz·dt`; `vz -= GRAVITY·dt`; the Magnus rotation with its own decay and 0.02 cutoff),
 * and it is CROSS-CHECKED against live flights at sampled kicks (`gReplayMatchesLive`): the
 * replay must reproduce the engine's own per-tick `(x, y, z)` to 1e-9 or the gate is RED.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BKC1_MODE (smoke|full, REQUIRED) · BKC1_N · BKC1_OUT.
 *   ANY other `BKC1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BKC1_MODE=full npx tsx scripts/probes/bk-c1-distribution-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) · 2 = a refusal ·
 *       3 = the world/dose/constant construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  BALL_AIR_SPIN_DECAY, BALL_GROUND_SPIN_DECAY, CROSS_FLIGHT_MIN_S, DT, GRAVITY,
  HEADER_MIN_HEIGHT, CONTROL_RADIUS, PLAYER_CORE_RADIUS, BALL_RADIUS,
} from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['BKC1_MODE', 'BKC1_N', 'BKC1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BKC1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('BK-C1 FATAL — refused env surface. '
    + `rogue BKC1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BKC1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`BK-C1 FATAL — BKC1_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.BKC1_N !== undefined ? Number(process.env.BKC1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1 || N_ENV > 999)) {
  banner('BK-C1 FATAL — BKC1_N must be an integer in [1, 999].');
  process.exit(2);
}
const OUT_ENV = process.env.BKC1_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? ['BKC1_N set'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bk-c1-distribution-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bk-c1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === pathResolve(CANONICAL_OUT) || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
if (IS_PREFLIGHT && isCanonical(OUT_PATH)) {
  banner(`BK-C1 FATAL — an OVERRIDE run (${PREFLIGHT_REASONS.join(', ')}) may not write a `
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
const addInto2 = (a: number[][], b: readonly (readonly number[])[]): void => {
  for (let i = 0; i < a.length; i++) addInto(a[i], b[i]);
};
const sum2 = (m: readonly (readonly number[])[]): number => sum(m.map((r) => sum(r)));
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const canonical = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
};
/** the median of a stored histogram, quoted at the LOWER EDGE of the containing bin */
const medianFromBins = (bins: readonly number[], binWidth: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= total / 2) return i * binWidth;
  }
  return (bins.length - 1) * binWidth;
};

/* ========================================================================== */
/* §2 THE SHIPPED FLIGHT PARAMETERIZATION — anchored at its NAMED call sites   */
/* ========================================================================== */
/**
 * ⭐⭐ CANON, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
 * anchored match + line receipt — never first-occurrence" (HOME: BK-C0 §COMMANDER CORRECTIONS
 * item 1). FOUR `loftKick` callers exist in `src/sim/mechanics.ts`; each is extracted from
 * INSIDE the body of its OWN named `export function` declaration, and the arguments are taken
 * POSITIONALLY off `loftKick`'s declared signature:
 *
 *   loftKick(match, p, target, tBase, tPerM, tMin, tMax, noiseMul, spin?)
 *
 * The needle is the literal string `loftKick(` and the gate pins the OCCURRENCE COUNT per
 * needle and enumerates EVERY occurrence's site (canon: needle-occurrence counts, HOME:
 * PC-C0 §CORR item 1) — 4 call sites + 1 declaration = 5 occurrences of record.
 */
const MECH_PATH = 'src/sim/mechanics.ts';
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const MECH_SHA = sha(MECH_SRC);
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
/** every occurrence of the needle, enumerated with its site — canon, not a spot check */
const LOFTKICK_NEEDLE = 'loftKick(';
const LOFTKICK_OCCURRENCES: { line: number; kind: string; text: string }[] = (() => {
  const out: { line: number; kind: string; text: string }[] = [];
  let i = MECH_SRC.indexOf(LOFTKICK_NEEDLE);
  while (i >= 0) {
    const ln = lineOf(MECH_SRC, i);
    const lineText = MECH_SRC.split('\n')[ln - 1].trim();
    out.push({ line: ln, kind: lineText.startsWith('function loftKick(') ? 'declaration' : 'call', text: lineText });
    i = MECH_SRC.indexOf(LOFTKICK_NEEDLE, i + 1);
  }
  return out;
})();
/** the body of a NAMED `export function` declaration, up to the next top-level one */
const namedFnBody = (name: string): { body: string; start: number } | null => {
  const start = MECH_SRC.indexOf(`export function ${name}(`);
  if (start < 0) return null;
  const next = MECH_SRC.indexOf('\nexport function ', start + 1);
  return { body: MECH_SRC.slice(start, next < 0 ? MECH_SRC.length : next), start };
};
/** split ONE `loftKick(...)` call's argument list into raw positional tokens */
const loftArgsAt = (name: string): { args: string[]; line: number } | null => {
  const fn = namedFnBody(name);
  if (fn === null) return null;
  const rel = fn.body.indexOf(LOFTKICK_NEEDLE);
  if (rel < 0) return null;
  const open = rel + LOFTKICK_NEEDLE.length;
  let depth = 1;
  let j = open;
  while (j < fn.body.length && depth > 0) {
    const c = fn.body[j];
    if (c === '(') depth++;
    else if (c === ')') depth--;
    if (depth === 0) break;
    j++;
  }
  const inner = fn.body.slice(open, j);
  const args: string[] = [];
  let d = 0;
  let cur = '';
  for (const c of inner) {
    if (c === '(' || c === '[' || c === '{') d++;
    if (c === ')' || c === ']' || c === '}') d--;
    if (c === ',' && d === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  if (cur.trim() !== '') args.push(cur.trim());
  return { args, line: lineOf(MECH_SRC, fn.start + rel) };
};
/**
 * ⭐ THE CROSS's tMin IS NOT A LITERAL — it is `tMinCross`, itself a one-line ternary in the
 * SAME named function. It is extracted from THAT line (anchored) and resolved at run time off
 * the built match's own `c4Flight` policy, so the census uses the value the WORLD OF RECORD
 * actually flies, never a guessed branch.
 */
const CROSS_TMIN_LINE_RE = /const tMinCross = loft \? CROSS_FLIGHT_MIN_S : ([0-9.]+);/;
const crossFn = namedFnBody('performCross');
const CROSS_TMIN_MATCH = crossFn === null ? null : CROSS_TMIN_LINE_RE.exec(crossFn.body);
const CROSS_TMIN_FLAT = CROSS_TMIN_MATCH === null ? Number.NaN : Number(CROSS_TMIN_MATCH[1]);
const CROSS_TMIN_LINE = (crossFn === null || CROSS_TMIN_MATCH === null) ? -1
  : lineOf(MECH_SRC, crossFn.start + CROSS_TMIN_MATCH.index);

interface LoftParam {
  family: string; site: string; line: number;
  tBase: number; tPerM: number; tMin: number; tMaxParam: number; noiseMul: number;
  tMinIsLiteral: boolean; rawArgs: string[];
}
const extractLoft = (family: string, site: string): LoftParam => {
  const got = loftArgsAt(site);
  if (got === null || got.args.length < 8) {
    banner(`BK-C1 FATAL — the loftKick call inside the NAMED ${site} did not parse.`);
    process.exit(3);
  }
  const a = got!.args;
  const num = (s: string): number => Number(s);
  const tMinRaw = a[5];
  const tMinLiteral = /^[0-9.]+$/.test(tMinRaw);
  return {
    family, site, line: got!.line,
    tBase: num(a[3]), tPerM: num(a[4]),
    tMin: tMinLiteral ? num(tMinRaw) : Number.NaN, // resolved at run time for the cross
    tMaxParam: num(a[6]), noiseMul: num(a[7]),
    tMinIsLiteral: tMinLiteral, rawArgs: a.slice(3, 8),
  };
};
const P_PUNT = extractLoft('punt/loftSwitch', 'performLoftedPass');
const P_THROW = extractLoft('throw', 'performKeeperThrow');
const P_CROSS = extractLoft('cross', 'performCross');
const P_THROUGH = extractLoft('throughLoft', 'performThroughBall');
/**
 * ⭐ THE CLEARANCE IS NOT A `loftKick` AT ALL — `performClear` calls `match.kickBall` with a
 * DRAWN vertical launch `match.rng.range(lo, hi)`. Extracted from the NAMED site the same way.
 */
const CLEAR_FN = namedFnBody('performClear');
const CLEAR_VZ_RE = /match\.rng\.range\(([0-9.]+),\s*([0-9.]+)\)/;
const CLEAR_VZ_MATCH = CLEAR_FN === null ? null : CLEAR_VZ_RE.exec(CLEAR_FN.body);
const CLEAR_VZ_LO = CLEAR_VZ_MATCH === null ? Number.NaN : Number(CLEAR_VZ_MATCH[1]);
const CLEAR_VZ_HI = CLEAR_VZ_MATCH === null ? Number.NaN : Number(CLEAR_VZ_MATCH[2]);
const CLEAR_VZ_LINE = (CLEAR_FN === null || CLEAR_VZ_MATCH === null) ? -1
  : lineOf(MECH_SRC, CLEAR_FN.start + CLEAR_VZ_MATCH.index);

const PARAMS_OK = P_PUNT.tMaxParam === 2.1 && P_THROW.tMaxParam === 1.5
  && P_CROSS.tMaxParam === 1.7 && P_THROUGH.tMaxParam === 2.0
  && P_PUNT.tMinIsLiteral && P_THROW.tMinIsLiteral && P_THROUGH.tMinIsLiteral
  && !P_CROSS.tMinIsLiteral && CROSS_TMIN_FLAT === 0.7 && CROSS_TMIN_LINE > 0
  && Number.isFinite(CLEAR_VZ_LO) && Number.isFinite(CLEAR_VZ_HI) && CLEAR_VZ_LINE > 0
  && LOFTKICK_OCCURRENCES.length === 5
  && LOFTKICK_OCCURRENCES.filter((o) => o.kind === 'call').length === 4;

/**
 * ⭐⭐ THE STRIKE SURFACE, from the contact law's own two expressions (Match.ts):
 *   · the SHELL — `const shell = p.coreRadius + ball.radius` in `bkCollectBodyStrikes`
 *   · the HEIGHT — `const aerialOnly = this.bkContactLaw ? ball.z >= HEADER_MIN_HEIGHT : ...`,
 *     so ARMED, the whole ground channel (control attempt · deflection · body strike) runs at
 *     `z < HEADER_MIN_HEIGHT` and NOTHING below a head can touch a ball at or above it.
 * Both are pinned by an ANCHORED needle count, not by a re-typed number.
 */
const MATCH_PATH = 'src/sim/Match.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const MATCH_SHA = sha(MATCH_SRC);
const SHELL_NEEDLE = 'const shell = p.coreRadius + ball.radius;';
const AERIAL_NEEDLE = 'const aerialOnly = this.bkContactLaw ? ball.z >= HEADER_MIN_HEIGHT : ball.z > CONTROL_MAX_HEIGHT;';
const countOf = (src: string, needle: string): number => src.split(needle).length - 1;
const SHELL_HITS = countOf(MATCH_SRC, SHELL_NEEDLE);
const AERIAL_HITS = countOf(MATCH_SRC, AERIAL_NEEDLE);
const SHELL_LINE = SHELL_HITS === 1 ? lineOf(MATCH_SRC, MATCH_SRC.indexOf(SHELL_NEEDLE)) : -1;
const AERIAL_LINE = AERIAL_HITS === 1 ? lineOf(MATCH_SRC, MATCH_SRC.indexOf(AERIAL_NEEDLE)) : -1;
/** the strike surface's own radius, in METRES (unit-name truth) */
const STRIKE_SHELL_M = PLAYER_CORE_RADIUS + BALL_RADIUS;
/** the reach surface's radius — the TWIN, for a body who is NOT cooling/stunned */
const REACH_SHELL_M = CONTROL_RADIUS;
const CLEAR_HEIGHT_M = HEADER_MIN_HEIGHT;
const SURFACE_OK = SHELL_HITS === 1 && AERIAL_HITS === 1 && SHELL_LINE > 0 && AERIAL_LINE > 0
  && STRIKE_SHELL_M > 0 && REACH_SHELL_M > STRIKE_SHELL_M;

/* ========================================================================== */
/* §3 THE DOSE SOURCES + THE Q06 LINKAGE — FILE BYTES HASHED BEFORE PARSING   */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const BKT2_PATH = 'docs/world-model/data/bk-t2-composition-exam.json';
const R9_PATH = 'docs/world-model/data/r9-possession-chain-ledger.json';
const PERF_PATH = 'docs/perf/baseline.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_BYTES_SHA = sha(PC_BYTES);
const PC_DOSE: readonly (readonly number[])[] = poolPcDoseTable(
  JSON.parse(PC_BYTES) as Record<string, unknown>,
);
/** the perf BUDGET — bytes hashed, then the field quoted (never re-typed) */
const PERF_BYTES = readFileSync(PERF_PATH, 'utf8');
const PERF_BYTES_SHA = sha(PERF_BYTES);
const PERF_JSON = JSON.parse(PERF_BYTES) as Record<string, unknown>;
/**
 * ⭐ THE Q06 LINKAGE (#329 item 5(e)) — the −8.9 pp completion cost is BK-T2's own artifact
 * field, carried here with its bytes hashed, never re-typed from the stage doc's prose
 * (canon: doc-prose fidelity).
 */
const BKT2_BYTES = readFileSync(BKT2_PATH, 'utf8');
const BKT2_BYTES_SHA = sha(BKT2_BYTES);
const BKT2_JSON = JSON.parse(BKT2_BYTES) as {
  faces?: { face: string; base: { point: number }; armed: { point: number };
    delta: number; deltaCi95: [number, number]; absDeltaOverHalfWidth: number }[];
};
const bkt2Face = (k: string): Record<string, unknown> | null => {
  const f = (BKT2_JSON.faces ?? []).find((x) => x.face === k);
  return f === undefined ? null : {
    face: f.face, base: f.base.point, armed: f.armed.point, delta: f.delta,
    deltaCi95: f.deltaCi95, absDeltaOverHalfWidth: f.absDeltaOverHalfWidth,
  };
};
const Q06 = bkt2Face('ryiQ06PassCompletion');
/** R9's own decomposition, carried the same way — the FAMILY DEFINITION is reused, not reinvented */
const R9_BYTES = readFileSync(R9_PATH, 'utf8');
const R9_BYTES_SHA = sha(R9_BYTES);
const R9_JSON = JSON.parse(R9_BYTES) as {
  decomposition?: { distributionFamilyShareOfTheRise?: number };
  definitions?: Record<string, unknown>;
  faces?: { face: string; armed: { point: number } }[];
};
const R9_DIST_SHARE = R9_JSON.decomposition?.distributionFamilyShareOfTheRise ?? Number.NaN;
const SOURCES_OK = L3_DOSE.length > 0 && PC_DOSE.length > 0 && Q06 !== null
  && Number.isFinite(R9_DIST_SHARE) && typeof PERF_JSON.usPerStep === 'number';

/* ========================================================================== */
/* §4 THE PRE-REGISTERED CLASSES (frozen before the battery)                  */
/* ========================================================================== */
/**
 * THE DELIVERY TYPES — the #329 item 5(a) list (punt · loft · cross · throw · driven pass),
 * plus the two other launch channels the same physics produces (the outfield hoof and the
 * lofted through-ball dink), so the inventory PARTITIONS every release it books.
 */
const DELIVERIES = ['punt', 'loftSwitch', 'cross', 'throw', 'drivenPass', 'clearance',
  'throughLoft', 'throughGround', 'otherRelease'] as const;
type Delivery = (typeof DELIVERIES)[number];
const D = Object.fromEntries(DELIVERIES.map((c, i) => [c, i])) as Record<Delivery, number>;
/** the engine's own release-signature classes (BK-C0 §2(a)), inherited from R9 verbatim */
const KLASSES = ['shot', 'headerShot', 'clearance', 'headerClearance', 'cross', 'cutback',
  'throughBall', 'loftedPass', 'shortPass', 'keeperThrow', 'headerKnockdown', 'other'] as const;
type Klass = (typeof KLASSES)[number];

/**
 * ⭐⭐ THE RETURN-PATH LADDER — R9's own, class for class, definition for definition
 * (docs/world-model/R9-POSSESSION-CHAIN-LEDGER.md §3(d)). REUSED, NEVER REINVENTED: the
 * distribution family is `{oppControlledThenLost, ownDefenderBackPass, directCarom,
 * noOtherTouch}` and it is the POPULATION OF RECORD's parent set.
 */
const RETURN_CLASSES = ['saveHeld', 'restartAward', 'parryRegather', 'oppControlledThenLost',
  'ownDefenderBackPass', 'directCarom', 'noOtherTouch', 'otherReturn'] as const;
type ReturnClass = (typeof RETURN_CLASSES)[number];
const R = Object.fromEntries(RETURN_CLASSES.map((c, i) => [c, i])) as Record<ReturnClass, number>;
const DISTRIBUTION_FAMILY: ReturnClass[] = ['oppControlledThenLost', 'ownDefenderBackPass',
  'directCarom', 'noOtherTouch'];

/** the WINDOW OF RECORD (BK-T2's) and R9's retire cap = 3× it */
const BOUNCE_WINDOW_TICKS = 240;
const CHAIN_RETIRE_TICKS = 3 * BOUNCE_WINDOW_TICKS;

/* --- the stored bins (canon: a percentile face requires stored bins) --- */
/** launch angle above the horizontal, DEGREES: 13 bins × 5°, last bin holds ≥ 60° */
const ANGLE_BIN_DEG = 5;
const ANGLE_BINS = 13;
const angleBin = (deg: number): number => Math.min(ANGLE_BINS - 1, Math.max(0, Math.floor(deg / ANGLE_BIN_DEG)));
/** apex height, METRES: 25 bins × 0.25 m, last bin holds ≥ 6.00 m */
const APEX_BIN_M = 0.25;
const APEX_BINS = 25;
const apexBin = (m: number): number => Math.min(APEX_BINS - 1, Math.max(0, Math.floor(m / APEX_BIN_M)));
/** flight time, TICKS: 26 bins × 10 ticks, last bin holds ≥ 250 ticks */
const FLIGHT_BIN_TICKS = 10;
const FLIGHT_BINS = 26;
const flightBin = (t: number): number => Math.min(FLIGHT_BINS - 1, Math.max(0, Math.floor(t / FLIGHT_BIN_TICKS)));
/** presser distance at launch, METRES: 8 bins × 2 m, last bin holds ≥ 14 m */
const PRESS_BIN_M = 2;
const PRESS_BINS = 8;
const pressBin = (m: number): number => Math.min(PRESS_BINS - 1, Math.max(0, Math.floor(m / PRESS_BIN_M)));
/** the struck body's along-line distance at launch, METRES: 10 bins × 2 m, last ≥ 18 m */
const STRUCK_BIN_M = 2;
const STRUCK_BINS = 10;
const struckBin = (m: number): number => Math.min(STRUCK_BINS - 1, Math.max(0, Math.floor(m / STRUCK_BIN_M)));

/* ========================================================================== */
/* §5 THE SHIPPED FLIGHT MODEL, TRANSCRIBED (the counterfactual's engine)     */
/* ========================================================================== */
/**
 * ⭐⭐ `replayFlight` IS `Match.stepBallPhysics`'s airborne branch, statement for statement:
 *
 *   if (spin !== 0) { rotate vel by spin·dt; spin *= exp(-decay·dt); if |spin| < 0.02 spin = 0 }
 *   pos.x += vel.x·dt; pos.y += vel.y·dt
 *   if (z > 0 || vz !== 0) { z += vz·dt; vz -= GRAVITY·dt; if (z <= 0) LAND }
 *
 * FRICTION IS ABSENT ON PURPOSE — the shipped integrator applies `BALL_FRICTION_K` only in the
 * GROUND branch (`else`), so a ball in the air is friction-free and this replay is EXACT while
 * airborne. It stops at the first landing (a bounce is a different ball); the samples the
 * cross-check compares are therefore all pre-landing samples.
 *
 * ⚠ The engine's spin decay reads `ball.z > 0 ? BALL_AIR_SPIN_DECAY : BALL_GROUND_SPIN_DECAY`
 * BEFORE the height integration of that tick — reproduced in that order here.
 */
interface FlightState { x: number; y: number; vx: number; vy: number; z: number; vz: number; spin: number }
interface FlightSample { tick: number; x: number; y: number; z: number }
const replayFlight = (
  s0: Readonly<FlightState>, maxTicks: number,
): { samples: FlightSample[]; apexM: number; flightTicks: number; landedX: number; landedY: number } => {
  const s: FlightState = { ...s0 };
  const samples: FlightSample[] = [];
  let apex = s.z;
  let t = 0;
  while (t < maxTicks) {
    if (s.spin !== 0) {
      const a = s.spin * DT;
      const c = Math.cos(a);
      const sn = Math.sin(a);
      const vx = s.vx;
      s.vx = vx * c - s.vy * sn;
      s.vy = vx * sn + s.vy * c;
      s.spin *= Math.exp(-(s.z > 0 ? BALL_AIR_SPIN_DECAY : BALL_GROUND_SPIN_DECAY) * DT);
      if (s.spin > -0.02 && s.spin < 0.02) s.spin = 0;
    }
    s.x += s.vx * DT;
    s.y += s.vy * DT;
    let landed = false;
    if (s.z > 0 || s.vz !== 0) {
      s.z += s.vz * DT;
      s.vz -= GRAVITY * DT;
      if (s.z <= 0) { s.z = 0; landed = true; }
    } else landed = true;
    t++;
    if (s.z > apex) apex = s.z;
    samples.push({ tick: t, x: s.x, y: s.y, z: s.z });
    if (landed) break;
  }
  return { samples, apexM: apex, flightTicks: t, landedX: s.x, landedY: s.y };
};

/**
 * ⭐⭐ THE COUNTERFACTUAL'S EXACT DEFINITION OF "AVAILABLE" (frozen at the freeze commit).
 *
 * A CLEARING HIGHER LINE IS AVAILABLE AT THE SAME TARGET iff there exists a delivery family
 * F in the SHIPPED loft set {punt/loftSwitch, throw, cross, throughLoft} such that, launching
 * from the SAME point along the SAME direction to the SAME landing distance `d`:
 *
 *   T_F  = clamp(F.tBase + F.tPerM · d, F.tMin, F.tMax)      ← the family's own expression
 *   vz_F = GRAVITY · T_F / 2                                  ← `loftKick`'s own launch
 *   |v|_F = d / T_F                                           ← `loftKick`'s own speed
 *
 * and the SHIPPED per-tick integrator, replayed from that launch, never puts the ball below
 * `HEADER_MIN_HEIGHT` on any tick at which its along-line position lies inside the first
 * struck body's strike surface [s − shell, s + shell]; and the ball must still be airborne
 * when it passes s + shell (a ball that lands short has not cleared anything).
 *
 * Two variants are published, both stored:
 *   · `shippedDefaults` — T_F is the family's own clamp at THIS d (what the engine would fly
 *      if that family were chosen at this moment). THE PRIMARY.
 *   · `familyTMax` — T_F is the family's own `tMax`, i.e. the HIGHEST line the shipped
 *      parameterization can express at all, regardless of what the distance formula would
 *      pick. An UPPER BOUND on capability: if this is false, hypothesis A is true at that
 *      launch under any conceivable choice within the shipped ranges.
 *
 * ⚠ HONEST LIMIT, STATED: clearing the strike surface converts a BODY CAROM into an AERIAL
 * DUEL (`tryAerial` owns z ≥ HEADER_MIN_HEIGHT). "Available" never means "uncontested".
 */
const LOFT_FAMILIES = (): { name: string; tBase: number; tPerM: number; tMin: number; tMax: number }[] => [
  { name: 'punt/loftSwitch', tBase: P_PUNT.tBase, tPerM: P_PUNT.tPerM, tMin: P_PUNT.tMin, tMax: P_PUNT.tMaxParam },
  { name: 'throw', tBase: P_THROW.tBase, tPerM: P_THROW.tPerM, tMin: P_THROW.tMin, tMax: P_THROW.tMaxParam },
  { name: 'cross', tBase: P_CROSS.tBase, tPerM: P_CROSS.tPerM, tMin: Number.NaN, tMax: P_CROSS.tMaxParam },
  { name: 'throughLoft', tBase: P_THROUGH.tBase, tPerM: P_THROUGH.tPerM, tMin: P_THROUGH.tMin, tMax: P_THROUGH.tMaxParam },
];
const clampN = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

/** does a launch (vz0, |v| along dir) clear a body at along-line distance `s` with `shell`? */
const clearsBody = (
  origin: { x: number; y: number }, dir: { x: number; y: number },
  hSpeed: number, vz0: number, s: number, shell: number, maxTicks: number,
): boolean => {
  if (!(vz0 > 0)) return false;
  const r = replayFlight(
    { x: origin.x, y: origin.y, vx: dir.x * hSpeed, vy: dir.y * hSpeed, z: 0, vz: vz0, spin: 0 },
    maxTicks,
  );
  const near = s - shell;
  const far = s + shell;
  let passedFar = false;
  for (const smp of r.samples) {
    const u = (smp.x - origin.x) * dir.x + (smp.y - origin.y) * dir.y;
    if (u >= near && u <= far && smp.z < CLEAR_HEIGHT_M) return false;
    if (u > far) { passedFar = smp.z > 0 || true; break; }
  }
  // the ball must actually REACH past the far edge while still in flight
  const last = r.samples[r.samples.length - 1];
  const uLast = last === undefined ? 0 : (last.x - origin.x) * dir.x + (last.y - origin.y) * dir.y;
  passedFar = uLast > far;
  return passedFar;
};
/** the CONTINUOUS twin — the closed form, for the tick-phase robustness row only */
const clearsBodyContinuous = (hSpeed: number, vz0: number, s: number, shell: number): boolean => {
  if (!(vz0 > 0) || !(hSpeed > 0)) return false;
  const zAt = (u: number): number => {
    const t = u / hSpeed;
    return vz0 * t - (GRAVITY / 2) * t * t;
  };
  const near = Math.max(0, s - shell);
  const far = s + shell;
  const range = (2 * vz0 * hSpeed) / GRAVITY;
  if (range <= far) return false;
  return zAt(near) >= CLEAR_HEIGHT_M && zAt(far) >= CLEAR_HEIGHT_M;
};

/* ========================================================================== */
/* §6 THE WORLD OF RECORD — R9's ARMED arm, reused EXACTLY                    */
/* ========================================================================== */
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
const buildMatch = (seed: number): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(PC_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
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
    armedVersionIsWorld9: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
  };
};

/* ========================================================================== */
/* §7 THE PER-SEED ROW (per-seed cells — canon, home ruling #282.2(ii))       */
/* ========================================================================== */
interface Row {
  seed: number; worldOk: boolean; ticks: number; playingTicks: number;
  /* --- (a) THE ARC INVENTORY, by delivery type --- */
  launches: number[];                 // delivery × count
  launchesLofted: number[];           // delivery × count with vz0 > 0
  angleBinsByDelivery: number[][];    // delivery × ANGLE_BINS
  apexBinsByDelivery: number[][];     // delivery × APEX_BINS
  flightBinsByDelivery: number[][];   // delivery × FLIGHT_BINS
  apexSumByDelivery: number[];        // metres, for the mean (denominator = launchesLofted)
  angleSumByDelivery: number[];       // degrees
  flightTickSumByDelivery: number[];  // ticks
  /* --- (c) THE PRESSURE SIGNATURE --- */
  gkLaunchesByPressBin: number[]; gkBlockedByPressBin: number[];
  outLaunchesByPressBin: number[]; outBlockedByPressBin: number[];
  /* --- the block ledger, by delivery --- */
  blockedByDelivery: number[]; strikeBlockedByDelivery: number[]; interruptedByDelivery: number[];
  struckDistBins: number[];           // along-line distance of the first struck body
  /* --- (b) THE DISCRIMINATOR --- */
  gkReleases: number; unattributedGkReleases: number;
  chainsOpened: number; chainsReturned: number; chainsNoReturn: number;
  returnWithinByClass: number[];      // ≤ 240 ticks
  returnAnyByClass: number[];         // ≤ 720 ticks
  /** the POPULATION OF RECORD: a directCarom return within the window whose first body
   *  contact happened IN FLIGHT (before the launch ball ever landed) */
  caromPopulation: number;
  caromExcludedContactAfterLanding: number;
  caromBlockedShort: number;
  /** the A/B split over the population of record */
  availDefaultsStrike: number;        // B, primary
  availTMaxStrike: number;            // B, generous upper bound
  availDefaultsReach: number;         // B, against the 1.25 m reach surface (stricter)
  availContinuousStrike: number;      // B, closed-form twin (tick-phase robustness)
  /** the same split over ALL blocked GK lofted launches (the wider, denominator-stable face) */
  blockedGkLofted: number; blockedGkLoftedAvailDefaults: number; blockedGkLoftedAvailTMax: number;
  /* --- the engine's OWN final counters, for the labelling gate --- */
  engineLongBalls: number; engineCrosses: number; engineThroughBalls: number;
  /* --- the arming receipts (never football findings) --- */
  ledStrikesApplied: number; ledStrikeClaims: number; ledPartitionGroundTicks: number;
  /* --- the replay cross-check --- */
  replaySamples: number; replayMaxAbsDiff: number;
}
const emptyRow = (seed: number): Row => ({
  seed, worldOk: false, ticks: 0, playingTicks: 0,
  launches: zeros(DELIVERIES.length), launchesLofted: zeros(DELIVERIES.length),
  angleBinsByDelivery: zeros2(DELIVERIES.length, ANGLE_BINS),
  apexBinsByDelivery: zeros2(DELIVERIES.length, APEX_BINS),
  flightBinsByDelivery: zeros2(DELIVERIES.length, FLIGHT_BINS),
  apexSumByDelivery: zeros(DELIVERIES.length), angleSumByDelivery: zeros(DELIVERIES.length),
  flightTickSumByDelivery: zeros(DELIVERIES.length),
  gkLaunchesByPressBin: zeros(PRESS_BINS), gkBlockedByPressBin: zeros(PRESS_BINS),
  outLaunchesByPressBin: zeros(PRESS_BINS), outBlockedByPressBin: zeros(PRESS_BINS),
  blockedByDelivery: zeros(DELIVERIES.length), strikeBlockedByDelivery: zeros(DELIVERIES.length),
  interruptedByDelivery: zeros(DELIVERIES.length),
  struckDistBins: zeros(STRUCK_BINS),
  gkReleases: 0, unattributedGkReleases: 0,
  chainsOpened: 0, chainsReturned: 0, chainsNoReturn: 0,
  returnWithinByClass: zeros(RETURN_CLASSES.length),
  returnAnyByClass: zeros(RETURN_CLASSES.length),
  caromPopulation: 0, caromExcludedContactAfterLanding: 0, caromBlockedShort: 0,
  availDefaultsStrike: 0, availTMaxStrike: 0, availDefaultsReach: 0, availContinuousStrike: 0,
  blockedGkLofted: 0, blockedGkLoftedAvailDefaults: 0, blockedGkLoftedAvailTMax: 0,
  engineLongBalls: 0, engineCrosses: 0, engineThroughBalls: 0,
  ledStrikesApplied: 0, ledStrikeClaims: 0, ledPartitionGroundTicks: 0,
  replaySamples: 0, replayMaxAbsDiff: 0,
});

/* ========================================================================== */
/* §8 THE WALK — one match, pure reads of public engine state                  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'longBalls', 'crosses', 'throughBalls', 'cutbacks', 'clearances',
  'shots', 'headersWon'] as const;
type StatKey = (typeof STAT_KEYS)[number];

/** the launch record — everything the discriminator needs, captured AT the launch tick */
interface Launch {
  tick: number; gid: number; side: Side; isGk: boolean; delivery: Delivery;
  ox: number; oy: number;            // the launch point (ball pos BEFORE the launch tick's step)
  dx: number; dy: number;            // unit horizontal direction
  hSpeed: number; vz0: number; spin: number;
  d: number;                          // horizontal landing distance (replayed)
  apexM: number; flightTicks: number;
  nearestOppM: number;
  /* live tracking */
  live: boolean; landed: boolean;
  firstContactGid: number | null; firstContactTick: number | null; firstContactWasStrike: boolean;
  firstContactAlongM: number; firstContactInFlight: boolean; firstContactBlockedShort: boolean;
  /** the engine's OWN statement of who the ball was for, at the launch tick */
  targetGid: number | null;
  liveTicks: number;
}
/** the R9 chain, class for class */
interface Chain {
  releaseTick: number; gid: number; side: Side; resolved: boolean;
  sawTeammateOwner: boolean; sawOppOwner: boolean; sawOtherBodyTouch: boolean;
  sawGkSaveCredit: boolean; launch: Launch | null;
}

/** how many kicks per seed contribute per-tick samples to the replay cross-check */
const REPLAY_SAMPLE_KICKS = 8;

const walk = (seed: number): Row => {
  const m = buildMatch(seed);
  const row = emptyRow(seed);
  row.worldOk = Object.values(worldConjuncts(m)).every(Boolean);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    c4Flight: boolean;
  };
  const crossTMin = mm.c4Flight ? CROSS_FLIGHT_MIN_S : CROSS_TMIN_FLAT;
  const families = LOFT_FAMILIES().map((f) => (f.name === 'cross' ? { ...f, tMin: crossTMin } : f));
  const players = m.allPlayers;
  const N = players.length;

  const preGkDist = new Array<boolean>(N).fill(false);
  const snapBodies = (): void => {
    for (let i = 0; i < N; i++) preGkDist[i] = players[i].gkDistributing;
  };
  snapBodies();

  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevStrikes = 0;
  const prevSaves = new Int32Array(N);
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];

  const openLaunches: Launch[] = [];
  const chains: Chain[] = [];
  const sinceOwnParry = new Array<boolean>(N).fill(false);
  /**
   * the pending replay cross-checks. ⭐ THE PROBE STARTS FROM THE ENGINE'S OWN POST-STEP STATE
   * (no inversion, so the comparison tests the INTEGRATOR and nothing else) and it CLOSES the
   * moment the flight stops being a pure free flight — the ball is owned, it has landed, or
   * `lastTouch` has left the kicker. A probe that kept sampling past any of those would be
   * comparing the replay against a DIFFERENT ball, which is how a cross-check goes vacuously
   * red (or, worse, vacuously green on a short window).
   */
  interface ReplayProbe {
    s0: FlightState; startTick: number; kickerGid: number; live: FlightSample[]; open: boolean;
  }
  const replayProbes: ReplayProbe[] = [];
  let replayKicksTaken = 0;

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    if (playing) row.playingTicks++;
    const ball = m.ball;
    const ownerGid = ball.owner?.gid ?? null;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const ballIsLive = playing || m.phase === 'restart';
    const strikes = m.bkContactLedger.strikesApplied;
    const strikeThisTick = strikes > prevStrikes;
    prevStrikes = strikes;

    /* ---- save credits (needed for R9's saveHeld / parryRegather arms) ---- */
    let heldSaveGid: number | null = null;
    for (let i = 0; i < N; i++) {
      const gid = players[i].gid;
      const s = m.stat(gid).saves;
      if (s > prevSaves[i]) {
        prevSaves[i] = s;
        if (ownerGid === gid) heldSaveGid = gid;
        else sinceOwnParry[gid] = true;
        for (const c of chains) if (c.gid === gid) c.sawGkSaveCredit = true;
      }
    }

    /* ---- stat deltas, per side ---- */
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ===== RELEASE DETECTION — R9's / BK-C0 §2(a)'s idiom, reused verbatim ===== */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    const releasesThisTick: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        let klass: Klass | null = null;
        if (d.shots[side] > 0) klass = d.headersWon[side] > 0 ? 'headerShot' : 'shot';
        if (d.clearances[side] > 0 && klass === null) {
          klass = d.headersWon[side] > 0 ? 'headerClearance' : 'clearance';
        }
        if (d.passes[side] > 0 && klass === null) {
          klass = d.crosses[side] > 0 ? 'cross'
            : d.cutbacks[side] > 0 ? 'cutback'
              : d.throughBalls[side] > 0 ? 'throughBall'
                : d.longBalls[side] > 0 ? 'loftedPass' : 'shortPass';
        }
        if (d.headersWon[side] > 0 && klass === null) klass = 'headerKnockdown';
        if (klass === null && passChangedSide === side) klass = 'other';
        if (klass === null) continue;
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releasesThisTick.push({ gid, klass });
      }
    }

    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);

    /* ===== THE LAUNCH RECORD — captured at the release tick ===== */
    for (const rel of releasesThisTick) {
      const p = players[rel.gid];
      const isGk = p.role === 'GK';
      /* shots and headed knock-ons are NOT deliveries — named out, never booked */
      if (rel.klass === 'shot' || rel.klass === 'headerShot' || rel.klass === 'headerKnockdown'
        || rel.klass === 'headerClearance') continue;
      /**
       * ⭐⭐ THE DELIVERY LABEL IS THE BODY'S OWN ACTION, NOT THE STAT LADDER. BK-C0 §2(c)'s
       * idiom ("the keeper's own action label at the pre-step boundary") generalised to every
       * body, and it is a CORRECTION of record over the pure stat-delta ladder R9 inherits:
       * the per-side stat ladder collapses a tick on which `passes`, `longBalls` AND
       * `throughBalls` all move into ONE class, and MEASURED HERE that combination is not
       * rare — 9 of seed 12,514,800's 11 lofted switches would have been booked as through
       * balls. R9 could tolerate it (it only ever needed the KEEPER's channel, where the
       * combination does not arise); an arc inventory BY DELIVERY TYPE cannot. The stat ladder
       * is still what FINDS the release tick and the releasing body, and it still supplies the
       * header/shot exclusions; `gDeliveryLabelsAgreeWithEngineCounters` proves the labelling
       * against the engine's OWN final counters, class by class.
       */
      const act = p.action.type;
      const deliveryRaw: Delivery = act === 'LoftedPass'
        ? (isGk && preGkDist[rel.gid] ? 'punt' : 'loftSwitch')
        : act === 'ThrowOut' ? 'throw'
          : act === 'Cross' ? 'cross'
            : act === 'ClearBall' ? 'clearance'
              : act === 'ThroughBall' ? 'throughLoft'
                : act === 'Pass' ? 'drivenPass'
                  : 'otherRelease';
      /* a "release" whose ball is not moving at the tick boundary is an artefact (R9's guard) */
      if (hSpeedNow < 1e-6) {
        if (isGk && playing) row.unattributedGkReleases++;
        continue;
      }
      /* the launch state, reconstructed EXACTLY: the tick's physics has run once, so
         z = vz0·DT and pos = launchPos + vel·DT (airborne) — invert both. */
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      /**
       * ⭐ THE THROUGH BALL IS TWO DELIVERIES, and only its own launch tells them apart:
       * `performThroughBall(…, lofted)` either DINKS through `loftKick` or DRILLS along the
       * ground, and it books `throughBalls++` either way. The arc inventory splits them at the
       * only honest place — whether the launch had a positive vertical component.
       */
      const delivery: Delivery = deliveryRaw === 'throughLoft' && !(vz0 > 0)
        ? 'throughGround' : deliveryRaw;
      const ox = ball.pos.x - ball.vel.x * DT;
      const oy = ball.pos.y - ball.vel.y * DT;
      const dxu = ball.vel.x / hSpeedNow;
      const dyu = ball.vel.y / hSpeedNow;
      const s0: FlightState = {
        x: ox, y: oy, vx: ball.vel.x, vy: ball.vel.y, z: 0, vz: vz0, spin: ball.spin,
      };
      const rep = replayFlight(s0, CHAIN_RETIRE_TICKS);
      const dist = Math.hypot(rep.landedX - ox, rep.landedY - oy);
      let nearest = Number.POSITIVE_INFINITY;
      for (const o of m.teams[1 - p.side].players) {
        if (o.sentOff) continue;
        const dd = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
        if (dd < nearest) nearest = dd;
      }
      const angleDeg = Math.atan2(vz0, hSpeedNow) * (180 / Math.PI);
      const di = D[delivery];
      row.launches[di]++;
      if (vz0 > 0) {
        row.launchesLofted[di]++;
        row.angleBinsByDelivery[di][angleBin(angleDeg)]++;
        row.apexBinsByDelivery[di][apexBin(rep.apexM)]++;
        row.flightBinsByDelivery[di][flightBin(rep.flightTicks)]++;
        row.apexSumByDelivery[di] += rep.apexM;
        row.angleSumByDelivery[di] += angleDeg;
        row.flightTickSumByDelivery[di] += rep.flightTicks;
      }
      const pb = pressBin(Number.isFinite(nearest) ? nearest : PRESS_BINS * PRESS_BIN_M);
      if (isGk) row.gkLaunchesByPressBin[pb]++; else row.outLaunchesByPressBin[pb]++;
      const launch: Launch = {
        tick, gid: rel.gid, side: p.side as Side, isGk, delivery,
        ox, oy, dx: dxu, dy: dyu, hSpeed: hSpeedNow, vz0, spin: ball.spin,
        d: dist, apexM: rep.apexM, flightTicks: rep.flightTicks,
        nearestOppM: Number.isFinite(nearest) ? nearest : Number.NaN,
        live: true, landed: false,
        firstContactGid: null, firstContactTick: null, firstContactWasStrike: false,
        firstContactAlongM: Number.NaN, firstContactInFlight: false,
        firstContactBlockedShort: false,
        targetGid: (mm.pendingPass !== null && mm.pendingPass.passerGid === rel.gid)
          ? mm.pendingPass.targetGid : null,
        liveTicks: 0,
      };
      openLaunches.push(launch);
      /* the replay cross-check — the first REPLAY_SAMPLE_KICKS lofted kicks of the match */
      if (vz0 > 0 && replayKicksTaken < REPLAY_SAMPLE_KICKS) {
        replayKicksTaken++;
        replayProbes.push({
          s0: { x: ball.pos.x, y: ball.pos.y, vx: ball.vel.x, vy: ball.vel.y, z: ball.z, vz: ball.vz, spin: ball.spin },
          startTick: tick, kickerGid: rel.gid, live: [], open: true,
        });
      }
      /* the chain — GK releases only, OPEN PLAY only (R9's own scope) */
      if (isGk && playing) {
        row.gkReleases++;
        row.chainsOpened++;
        chains.push({
          releaseTick: tick, gid: rel.gid, side: p.side as Side, resolved: false,
          sawTeammateOwner: false, sawOppOwner: false, sawOtherBodyTouch: false,
          sawGkSaveCredit: false, launch,
        });
      }
    }

    /* ===== LIVE FLIGHT TRACKING — the block ledger + the replay samples ===== */
    for (const probe of replayProbes) {
      if (!probe.open || tick === probe.startTick) continue;
      if (ball.owner !== null || lastTouchGid !== probe.kickerGid || (ball.z === 0 && ball.vz === 0)
        || probe.live.length >= 24) { probe.open = false; continue; }
      probe.live.push({ tick: probe.live.length + 1, x: ball.pos.x, y: ball.pos.y, z: ball.z });
    }
    for (const L of openLaunches) {
      if (!L.live) continue;
      if (L.tick === tick) continue; // the launch tick itself
      L.liveTicks++;
      const contactGid = (lastTouchGid !== null && lastTouchGid !== prevLastTouchGid)
        ? lastTouchGid
        : (ownerGid !== null && ownerGid !== prevOwnerGid && ownerGid !== L.gid ? ownerGid : null);
      const stillFlying = ball.z > 0 || ball.vz !== 0;
      if (contactGid !== null && contactGid !== L.gid && L.firstContactGid === null) {
        L.firstContactGid = contactGid;
        L.firstContactTick = tick;
        L.firstContactWasStrike = strikeThisTick;
        const bp = players[contactGid].pos;
        L.firstContactAlongM = (bp.x - L.ox) * L.dx + (bp.y - L.oy) * L.dy;
        L.firstContactInFlight = !L.landed;
        /**
         * ⭐⭐ BLOCKED SHORT OF THE TARGET — the FACE OF RECORD, and the reason the wide
         * "any in-flight contact" count is NOT it: a delivery that reaches its man and is met
         * there is a delivery ARRIVING, not a block, and counting it would make every punt
         * "blocked" and the pressure signature meaningless. Two anchored conditions, no taste
         * constant: the toucher is not the engine's OWN `pendingPass.targetGid`, and his
         * along-line distance is inside `d − shell`, i.e. the ball was struck before it ever
         * reached the target's own body radius. `interruptedByDelivery` keeps the wide count.
         */
        L.firstContactBlockedShort = L.firstContactInFlight
          && contactGid !== L.targetGid
          && L.firstContactAlongM < L.d - STRIKE_SHELL_M;
        L.live = false;
        const di = D[L.delivery];
        if (L.firstContactInFlight) row.interruptedByDelivery[di]++;
        if (L.firstContactBlockedShort) {
          row.blockedByDelivery[di]++;
          if (strikeThisTick) row.strikeBlockedByDelivery[di]++;
          row.struckDistBins[struckBin(Math.max(0, L.firstContactAlongM))]++;
          const pb = pressBin(Number.isFinite(L.nearestOppM) ? L.nearestOppM : PRESS_BINS * PRESS_BIN_M);
          if (L.isGk) row.gkBlockedByPressBin[pb]++; else row.outBlockedByPressBin[pb]++;
          if (L.isGk && L.vz0 > 0) {
            row.blockedGkLofted++;
            const s = Math.max(0, L.firstContactAlongM);
            let availD = false;
            let availT = false;
            for (const f of families) {
              const Td = clampN(f.tBase + f.tPerM * L.d, f.tMin, f.tMax);
              if (clearsBody({ x: L.ox, y: L.oy }, { x: L.dx, y: L.dy }, L.d / Td, (GRAVITY * Td) / 2, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)) availD = true;
              const Tm = f.tMax;
              if (clearsBody({ x: L.ox, y: L.oy }, { x: L.dx, y: L.dy }, L.d / Tm, (GRAVITY * Tm) / 2, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)) availT = true;
            }
            if (availD) row.blockedGkLoftedAvailDefaults++;
            if (availT) row.blockedGkLoftedAvailTMax++;
          }
        }
        continue;
      }
      if (!L.landed && !stillFlying) L.landed = true;
      if (L.liveTicks >= CHAIN_RETIRE_TICKS) L.live = false;
    }

    /* ===== THE CHAINS — R9's ladder, class for class ===== */
    if (ownerGid !== null && ownerGid !== prevOwnerGid) {
      for (const c of chains) {
        if (c.resolved) continue;
        if (ownerGid === c.gid) continue;
        if (players[ownerGid].side === c.side) c.sawTeammateOwner = true;
        else c.sawOppOwner = true;
      }
    }
    if (lastTouchGid !== null && lastTouchGid !== prevLastTouchGid) {
      for (const c of chains) {
        if (c.resolved) continue;
        if (lastTouchGid !== c.gid && lastTouchGid !== ownerGid) c.sawOtherBodyTouch = true;
      }
    }
    if (strikeThisTick) for (const c of chains) if (!c.resolved) c.sawOtherBodyTouch = true;

    for (const c of chains) {
      if (c.resolved) continue;
      const age = tick - c.releaseTick;
      if (ownerGid === c.gid && ownerGid !== prevOwnerGid) {
        c.resolved = true;
        row.chainsReturned++;
        const klass: ReturnClass = heldSaveGid === c.gid ? 'saveHeld'
          : m.restartKickGid === c.gid ? 'restartAward'
            : sinceOwnParry[c.gid] ? 'parryRegather'
              : c.sawOppOwner ? 'oppControlledThenLost'
                : c.sawTeammateOwner ? 'ownDefenderBackPass'
                  : c.sawOtherBodyTouch ? 'directCarom'
                    : 'noOtherTouch';
        row.returnAnyByClass[R[klass]]++;
        if (age <= BOUNCE_WINDOW_TICKS) {
          row.returnWithinByClass[R[klass]]++;
          /* ⭐⭐ THE POPULATION OF RECORD — a distribution CAROM whose first body contact
             happened IN FLIGHT (the user's pattern: 开球 → 直接弹到身上 → 弹回来) */
          if (klass === 'directCarom' && c.launch !== null) {
            const L = c.launch;
            if (L.firstContactGid !== null && L.firstContactInFlight) {
              row.caromPopulation++;
              if (L.firstContactBlockedShort) row.caromBlockedShort++;
              const s = Math.max(0, L.firstContactAlongM);
              let availD = false;
              let availT = false;
              let availR = false;
              let availC = false;
              for (const f of families) {
                const Td = clampN(f.tBase + f.tPerM * L.d, f.tMin, f.tMax);
                const vzD = (GRAVITY * Td) / 2;
                const hD = L.d / Td;
                if (clearsBody({ x: L.ox, y: L.oy }, { x: L.dx, y: L.dy }, hD, vzD, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)) availD = true;
                if (clearsBody({ x: L.ox, y: L.oy }, { x: L.dx, y: L.dy }, hD, vzD, s, REACH_SHELL_M, CHAIN_RETIRE_TICKS)) availR = true;
                if (clearsBodyContinuous(hD, vzD, s, STRIKE_SHELL_M)) availC = true;
                const Tm = f.tMax;
                if (clearsBody({ x: L.ox, y: L.oy }, { x: L.dx, y: L.dy }, L.d / Tm, (GRAVITY * Tm) / 2, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)) availT = true;
              }
              if (availD) row.availDefaultsStrike++;
              if (availT) row.availTMaxStrike++;
              if (availR) row.availDefaultsReach++;
              if (availC) row.availContinuousStrike++;
            } else row.caromExcludedContactAfterLanding++;
          }
        }
      } else if (age >= CHAIN_RETIRE_TICKS) {
        c.resolved = true;
        row.chainsNoReturn++;
      }
    }
    if (ownerGid !== null && ownerGid !== prevOwnerGid && players[ownerGid].role === 'GK') {
      sinceOwnParry[ownerGid] = false;
    }

    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
    snapBodies();
  }
  for (const c of chains) if (!c.resolved) { c.resolved = true; row.chainsNoReturn++; }

  for (const t of m.teams) {
    row.engineLongBalls += t.stats.longBalls;
    row.engineCrosses += t.stats.crosses;
    row.engineThroughBalls += t.stats.throughBalls;
  }
  const led = m.bkContactLedger;
  row.ledStrikesApplied = led.strikesApplied;
  row.ledStrikeClaims = led.strikeClaimsCooldown + led.strikeClaimsStunned;
  row.ledPartitionGroundTicks = led.partitionGroundTicks;

  /* ---- the replay cross-check: the SHIPPED integrator vs the transcription ---- */
  for (const probe of replayProbes) {
    const rep = replayFlight(probe.s0, 64);
    const n = Math.min(rep.samples.length, probe.live.length);
    for (let i = 0; i < n; i++) {
      const a = rep.samples[i];
      const b = probe.live[i];
      const dd = Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
      if (dd > row.replayMaxAbsDiff) row.replayMaxAbsDiff = dd;
      row.replaySamples++;
    }
  }
  return row;
};

/* ========================================================================== */
/* §9 THE CEILING TABLE — the CODE-DERIVED answer to hypothesis A            */
/* ========================================================================== */
/**
 * ⭐⭐ THE PHYSICS CEILING, ANSWERED EXACTLY AND WITHOUT A SINGLE SEED (#329 item 5(a)).
 *
 * For every shipped loft family F and every (target distance d, presser along-line distance s),
 * "can a max-loft launch within the shipped parameterization clear a standing body's strike
 * surface?" is a CLOSED QUESTION: the family's clamp fixes T, T fixes the whole parabola, and
 * the strike surface is a fixed height and a fixed radius.
 *
 * The closed form of record (published beside the table, re-derivable by hand):
 *   apex = g·T²/8   and   x_clear = (d/2)·(1 − sqrt(1 − h/apex))   with h = HEADER_MIN_HEIGHT,
 * i.e. the along-line distance at which the ball first reaches head height. A body whose NEAR
 * shell edge lies inside x_clear is UNCLEARABLE by that family at that target.
 */
const CEIL_TARGETS = [8, 12, 16, 20, 24, 30, 36, 42, 48, 54];
const CEIL_PRESSERS = [2, 3, 4, 5, 6, 8, 10];
const ceilingTable = (crossTMin: number): Record<string, unknown> => {
  const families = LOFT_FAMILIES().map((f) => (f.name === 'cross' ? { ...f, tMin: crossTMin } : f));
  const rows: Record<string, unknown>[] = [];
  for (const f of families) {
    for (const d of CEIL_TARGETS) {
      const Td = clampN(f.tBase + f.tPerM * d, f.tMin, f.tMax);
      const apexD = (GRAVITY * Td * Td) / 8;
      const xClearD = apexD <= CLEAR_HEIGHT_M ? Number.POSITIVE_INFINITY
        : (d / 2) * (1 - Math.sqrt(1 - CLEAR_HEIGHT_M / apexD));
      const Tm = f.tMax;
      const apexM = (GRAVITY * Tm * Tm) / 8;
      const xClearM = apexM <= CLEAR_HEIGHT_M ? Number.POSITIVE_INFINITY
        : (d / 2) * (1 - Math.sqrt(1 - CLEAR_HEIGHT_M / apexM));
      rows.push({
        family: f.name, targetDistanceM: d,
        flightSecondsAtDefault: round(Td, 6), apexMetresAtDefault: round(apexD, 6),
        launchAngleDegAtDefault: round(Math.atan2((GRAVITY * Td) / 2, d / Td) * (180 / Math.PI), 4),
        clearsAtDefaultByPresserM: Object.fromEntries(CEIL_PRESSERS.map((s) => [String(s),
          clearsBody({ x: 0, y: 0 }, { x: 1, y: 0 }, d / Td, (GRAVITY * Td) / 2, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)])),
        clearsAtFamilyTMaxByPresserM: Object.fromEntries(CEIL_PRESSERS.map((s) => [String(s),
          clearsBody({ x: 0, y: 0 }, { x: 1, y: 0 }, d / Tm, (GRAVITY * Tm) / 2, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)])),
        xClearMetresAtDefault: Number.isFinite(xClearD) ? round(xClearD, 6) : null,
        xClearMetresAtFamilyTMax: Number.isFinite(xClearM) ? round(xClearM, 6) : null,
      });
    }
  }
  /** the SMALLEST presser distance any shipped family can clear, per target distance */
  const minClearable = CEIL_TARGETS.map((d) => {
    let best: number | null = null;
    for (const f of families) {
      for (const T of [clampN(f.tBase + f.tPerM * d, f.tMin, f.tMax), f.tMax]) {
        for (const s of [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 8, 9, 10]) {
          if (clearsBody({ x: 0, y: 0 }, { x: 1, y: 0 }, d / T, (GRAVITY * T) / 2, s, STRIKE_SHELL_M, CHAIN_RETIRE_TICKS)) {
            if (best === null || s < best) best = s;
            break;
          }
        }
      }
    }
    return { targetDistanceM: d, minClearablePresserMetres: best };
  });
  return { rows, minClearablePresserByTarget: minClearable, presserGridMetres: CEIL_PRESSERS };
};

/* ========================================================================== */
/* §10 THE BATTERY — virgin seeds, BOOKED = WALKED                            */
/* ========================================================================== */
const BLOCK_BASE = 12_514_000;
const N_SEEDS = N_ENV ?? (MODE === 'smoke' ? 2 : 40);
const SMOKE_SEEDS = [BLOCK_BASE + 800, BLOCK_BASE + 801, BLOCK_BASE + 802];
const BATTERY_SEEDS = MODE === 'smoke'
  ? SMOKE_SEEDS.slice(0, N_SEEDS)
  : Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i);
const RECEIPT_SEED = BLOCK_BASE + 999;

const rows: Row[] = [];
for (const s of BATTERY_SEEDS) rows.push(walk(s));
let walksBooked = rows.length;

/** the WORLD-CONSTRUCTION RECEIPT — its own booked seed (R9's idiom) */
const receiptMatch = buildMatch(RECEIPT_SEED);
const receiptConjuncts = worldConjuncts(receiptMatch);
const receiptC4Flight = (receiptMatch as unknown as { c4Flight: boolean }).c4Flight;
const RECEIPT_OK = Object.values(receiptConjuncts).every(Boolean);
walksBooked += 1;

const CROSS_TMIN_APPLIED = receiptC4Flight ? CROSS_FLIGHT_MIN_S : CROSS_TMIN_FLAT;

/* pooled cells */
const pool = <T,>(pick: (r: Row) => T[]): number[] => {
  const acc = zeros((pick(rows[0]) as unknown as number[]).length);
  for (const r of rows) addInto(acc, pick(r) as unknown as number[]);
  return acc;
};
const pool2 = (pick: (r: Row) => number[][]): number[][] => {
  const acc = pick(rows[0]).map((x) => zeros(x.length));
  for (const r of rows) addInto2(acc, pick(r));
  return acc;
};

/* ========================================================================== */
/* §11 THE FACE TABLE — every published face is (numerator, denominator)      */
/* ========================================================================== */
interface FaceDef { num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string; denNote: string }
const FACES: Record<string, FaceDef> = {};
/* --- (b) THE DISCRIMINATOR, the headline --- */
FACES.caromClearingLineAvailableShare = {
  num: (r) => r.availDefaultsStrike, den: (r) => r.caromPopulation,
  unit: 'share of the distribution caroms of record',
  what: '⭐⭐ THE A-vs-B DISCRIMINATOR (#328 item 3): the share of distribution caroms at which '
    + 'a CLEARING higher line was AVAILABLE at the same target within the shipped '
    + 'parameterization. AVAILABLE-BUT-UNCHOSEN = hypothesis B (pricing); the complement = '
    + 'hypothesis A (capability)',
  denNote: 'denominator = the POPULATION OF RECORD: R9 `directCarom` returns within 240 ticks '
    + 'whose first body contact happened IN FLIGHT',
};
FACES.caromClearingLineAvailableAtFamilyTMaxShare = {
  num: (r) => r.availTMaxStrike, den: (r) => r.caromPopulation,
  unit: 'share of the distribution caroms of record',
  what: '⭐ THE GENEROUS UPPER BOUND: the same share when every family is allowed its own tMax '
    + '— the HIGHEST line the shipped ranges can express at all. Its complement is hypothesis '
    + 'A under ANY choice inside the shipped parameterization',
  denNote: 'denominator = the POPULATION OF RECORD',
};
FACES.caromClearingLineAvailableVsReachSurfaceShare = {
  num: (r) => r.availDefaultsReach, den: (r) => r.caromPopulation,
  unit: 'share of the distribution caroms of record',
  what: 'the STRICTER twin: clearance measured against the 1.25 m CONTROL_RADIUS reach surface '
    + 'rather than the strike shell (a body who is NOT cooling claims through the shipped loop)',
  denNote: 'denominator = the POPULATION OF RECORD',
};
FACES.caromClearingLineAvailableContinuousShare = {
  num: (r) => r.availContinuousStrike, den: (r) => r.caromPopulation,
  unit: 'share of the distribution caroms of record',
  what: 'the CLOSED-FORM twin (tick-phase robustness): the same test evaluated continuously '
    + 'instead of on the engine\'s own per-tick sampling',
  denNote: 'denominator = the POPULATION OF RECORD',
};
FACES.blockedGkLoftAvailableShare = {
  num: (r) => r.blockedGkLoftedAvailDefaults, den: (r) => r.blockedGkLofted,
  unit: 'share of blocked GK lofted launches',
  what: '⭐ THE WIDER, DENOMINATOR-STABLE FACE: the same availability question asked of EVERY '
    + 'blocked GK lofted launch, not only of those whose chain closed as a carom within the '
    + 'window (the carom population is a window-censored subset of this one)',
  denNote: 'denominator = GK lofted launches whose flight was interrupted by another body',
};
FACES.blockedGkLoftAvailableAtFamilyTMaxShare = {
  num: (r) => r.blockedGkLoftedAvailTMax, den: (r) => r.blockedGkLofted,
  unit: 'share of blocked GK lofted launches',
  what: 'the generous upper bound on the wider face',
  denNote: 'denominator = GK lofted launches whose flight was interrupted by another body',
};
/* --- (c) THE PRESSURE SIGNATURE --- */
for (let b = 0; b < PRESS_BINS; b++) {
  const lo = b * PRESS_BIN_M;
  const label = b === PRESS_BINS - 1 ? `${lo}+` : `${lo}-${lo + PRESS_BIN_M}`;
  FACES[`gkBlockRatePressBin_${b}`] = {
    num: (r) => r.gkBlockedByPressBin[b], den: (r) => r.gkLaunchesByPressBin[b],
    unit: `share of GK launches with the nearest opponent ${label} m away`,
    what: `⭐ THE REALITY SIGNATURE (GK): block rate at presser distance ${label} m. RISING with `
      + 'pressure = error-under-pressure (realistic); FLAT = blind launching',
    denNote: `denominator = GK launches whose nearest opponent at launch was ${label} m away`,
  };
  FACES[`outfieldBlockRatePressBin_${b}`] = {
    num: (r) => r.outBlockedByPressBin[b], den: (r) => r.outLaunchesByPressBin[b],
    unit: `share of outfield launches with the nearest opponent ${label} m away`,
    what: `THE REALITY SIGNATURE (OUTFIELD, reported separately per #329 item 5(c)): block rate `
      + `at presser distance ${label} m`,
    denNote: `denominator = outfield launches whose nearest opponent at launch was ${label} m away`,
  };
}
/* --- (a) the arc inventory's summary faces --- */
for (const dv of DELIVERIES) {
  const di = D[dv];
  FACES[`meanApexMetres_${dv}`] = {
    num: (r) => r.apexSumByDelivery[di], den: (r) => r.launchesLofted[di],
    unit: 'metres (mean apex of the replayed flight)',
    what: `THE ARC INVENTORY: mean apex of a ${dv} launch`,
    denNote: `denominator = ${dv} launches with a positive vertical launch`,
  };
  FACES[`meanLaunchAngleDeg_${dv}`] = {
    num: (r) => r.angleSumByDelivery[di], den: (r) => r.launchesLofted[di],
    unit: 'degrees above the horizontal',
    what: `THE ARC INVENTORY: mean launch angle of a ${dv} launch`,
    denNote: `denominator = ${dv} launches with a positive vertical launch`,
  };
  FACES[`meanFlightTicks_${dv}`] = {
    num: (r) => r.flightTickSumByDelivery[di], den: (r) => r.launchesLofted[di],
    unit: 'ticks (1 sim-s = 60 ticks; 1 sim-s = 22.5 display-s)',
    what: `THE ARC INVENTORY: mean flight time of a ${dv} launch`,
    denNote: `denominator = ${dv} launches with a positive vertical launch`,
  };
  FACES[`blockShare_${dv}`] = {
    num: (r) => r.blockedByDelivery[di], den: (r) => r.launches[di],
    unit: `share of ${dv} launches`,
    what: `⭐ the share of ${dv} launches BLOCKED SHORT OF THE TARGET — struck by a body who is `
      + 'not the engine\'s own pendingPass target, inside `d − shell`. The face of record',
    denNote: `denominator = ${dv} launches booked`,
  };
  FACES[`interruptShare_${dv}`] = {
    num: (r) => r.interruptedByDelivery[di], den: (r) => r.launches[di],
    unit: `share of ${dv} launches`,
    what: `the WIDE count beside it: any in-flight contact by a body other than the kicker, `
      + 'including the delivery ARRIVING at its man (which is not a block)',
    denNote: `denominator = ${dv} launches booked`,
  };
}
/* --- context --- */
FACES.caromShareOfGkReleases = {
  num: (r) => r.caromPopulation, den: (r) => r.gkReleases,
  unit: 'per GK release',
  what: 'the POPULATION OF RECORD as a rate on the release menu — the size of the thing the '
    + 'user disliked',
  denNote: 'denominator = GK releases (open play, R9\'s own scope)',
};
FACES.distributionFamilyWithin240PerGkRelease = {
  num: (r) => sum(DISTRIBUTION_FAMILY.map((c) => r.returnWithinByClass[R[c]])),
  den: (r) => r.gkReleases,
  unit: 'per GK release',
  what: 'R9\'s DISTRIBUTION FAMILY, reused not reinvented — the parent set of the population of '
    + 'record, on this stage\'s own seeds',
  denNote: 'denominator = GK releases (open play)',
};
FACES.directCaromWithin240PerGkRelease = {
  num: (r) => r.returnWithinByClass[R.directCarom], den: (r) => r.gkReleases,
  unit: 'per GK release',
  what: 'R9\'s `directCarom` class on this stage\'s own seeds (the population of record is this '
    + 'class RESTRICTED to first contact in flight)',
  denNote: 'denominator = GK releases (open play)',
};

const FACE_KEYS = Object.keys(FACES);

/* ========================================================================== */
/* §12 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats) */
/* ========================================================================== */
/**
 * ⭐ STATS CONSUMED: ZERO. The intervals are BOOTSTRAP RESAMPLES OF THE WALKED SEEDS, not a
 * registry-consuming statistic (the IN-T0 / DF-T2 / IN-T1 precedent, #329 item 4). The next
 * stats base therefore remains ≥ 115,200. The resample rng is seeded from the SEED BLOCK's own
 * base, exactly as IN-T1 seeded it, so the draw is reproducible without booking anything.
 */
const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: seedsWalked.length }, () => Math.floor(rngBoot.next() * seedsWalked.length) % seedsWalked.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = rows.map((r) => f.num(r));
  const de = rows.map((r) => f.den(r));
  const point = ratio(sum(nu), sum(de));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0;
    let dd = 0;
    for (const i of idx) { n += nu[i]; dd += de[i]; }
    const v = ratio(n, dd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  return {
    face: key, unit: f.unit, what: f.what, denNote: f.denNote,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`BK-C1 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};

/* ========================================================================== */
/* §13 THE GATES (frozen — a red gate is REPORTED, never patched)             */
/* ========================================================================== */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
const ceiling = ceilingTable(CROSS_TMIN_APPLIED);
const pooledStruckBins = pool((r) => r.struckDistBins);
const pooledAngle = pool2((r) => r.angleBinsByDelivery);
const pooledApex = pool2((r) => r.apexBinsByDelivery);
const pooledFlight = pool2((r) => r.flightBinsByDelivery);

const gates: Record<string, boolean> = {
  gWorld: RECEIPT_OK && rows.every((r) => r.worldOk),
  gDoseBytes: L3_BYTES_SHA.length === 64 && PC_BYTES_SHA.length === 64
    && BKT2_BYTES_SHA.length === 64 && R9_BYTES_SHA.length === 64 && PERF_BYTES_SHA.length === 64
    && SOURCES_OK,
  /** ⭐ the anchored extraction + the enumerated needle occurrences */
  gAnchoredParams: PARAMS_OK,
  gStrikeSurfaceAnchored: SURFACE_OK,
  /** ⭐⭐ THE COUNTERFACTUAL USES THE SHIPPED FLIGHT MODEL — proven, not asserted */
  gReplayMatchesLive: sum(rows.map((r) => r.replaySamples)) >= 20 * rows.length
    && rows.every((r) => r.replayMaxAbsDiff < 1e-9),
  /** the census's own world FIRES (the carom exists here) */
  gContactLawFires: sum(rows.map((r) => r.ledStrikesApplied)) > 0
    && sum(rows.map((r) => r.ledStrikeClaims)) > 0,
  /** the delivery partition: every booked launch lands in exactly one class */
  gDeliveryPartition: rows.every((r) => r.launchesLofted.every((v, i) => v <= r.launches[i])
    && r.interruptedByDelivery.every((v, i) => v <= r.launches[i])
    && r.blockedByDelivery.every((v, i) => v <= r.interruptedByDelivery[i])
    && r.strikeBlockedByDelivery.every((v, i) => v <= r.blockedByDelivery[i])),
  /**
   * ⭐⭐ THE LABELLING IS PROVEN AGAINST THE ENGINE'S OWN COUNTERS, class by class. Each of
   * `longBalls` / `crosses` / `throughBalls` is incremented at exactly ONE site
   * (`performLoftedPass` / `performCross` / `performThroughBall`), so the booked counts must
   * equal them EXACTLY. This gate is what makes the arc inventory a census and not a sample.
   */
  gDeliveryLabelsAgreeWithEngineCounters: rows.every((r) =>
    /* ⭐ `performThroughBall`'s LOFTED branch books `longBalls++` too — "a chip is a lofted
       long ball too" (mechanics.ts:477). The engine's `longBalls` counter is therefore
       punt + loftSwitch + the LOFTED chips, and the gate says so exactly. */
    r.launches[D.punt] + r.launches[D.loftSwitch] + r.launches[D.throughLoft] === r.engineLongBalls
    && r.launches[D.cross] === r.engineCrosses
    && r.launches[D.throughLoft] + r.launches[D.throughGround] === r.engineThroughBalls),
  /** the stored bins account for every lofted launch, per delivery */
  gArcBinsComplete: rows.every((r) => DELIVERIES.every((_, i) => sum(r.angleBinsByDelivery[i]) === r.launchesLofted[i]
    && sum(r.apexBinsByDelivery[i]) === r.launchesLofted[i]
    && sum(r.flightBinsByDelivery[i]) === r.launchesLofted[i])),
  /** the chain ladder is exhaustive and disjoint; the overflow cell stays empty */
  gChainPartition: rows.every((r) => r.chainsOpened === r.gkReleases
    && r.chainsReturned + r.chainsNoReturn === r.chainsOpened
    && sum(r.returnAnyByClass) === r.chainsReturned
    && sum(r.returnWithinByClass) <= r.chainsReturned
    && r.returnAnyByClass[R.otherReturn] === 0
    && r.returnWithinByClass.every((v, i) => v <= r.returnAnyByClass[i])),
  /** the population of record is a SUBSET of R9's own class, and its splits are subsets of it */
  gPopulationNested: rows.every((r) => r.caromPopulation + r.caromExcludedContactAfterLanding
      === r.returnWithinByClass[R.directCarom]
    && r.availDefaultsStrike <= r.caromPopulation
    && r.availTMaxStrike <= r.caromPopulation
    && r.availDefaultsReach <= r.caromPopulation
    && r.availContinuousStrike <= r.caromPopulation
    && r.caromBlockedShort <= r.caromPopulation
    && r.blockedGkLoftedAvailDefaults <= r.blockedGkLofted
    && r.blockedGkLoftedAvailTMax <= r.blockedGkLofted),
  /**
   * ⭐ MONOTONICITY OF THE COUNTERFACTUAL, PROVEN ON THE DATA: a higher line is a WEAKER
   * requirement than the family default only in the generous direction, and the stricter reach
   * surface can never be easier than the strike shell. Both are structural — if either fails
   * the counterfactual is mis-specified and the discriminator is void.
   */
  gCounterfactualMonotone: rows.every((r) => r.availDefaultsStrike <= r.availTMaxStrike
    && r.availDefaultsReach <= r.availDefaultsStrike),
  /** the pressure signature's denominators account for every launch */
  gPressurePartition: rows.every((r) => sum(r.gkLaunchesByPressBin) + sum(r.outLaunchesByPressBin)
      === sum(r.launches)
    && r.gkBlockedByPressBin.every((v, i) => v <= r.gkLaunchesByPressBin[i])
    && r.outBlockedByPressBin.every((v, i) => v <= r.outLaunchesByPressBin[i])),
  /** the ceiling table is NON-VACUOUS in both directions — it contains a NO and a YES */
  gCeilingNonVacuous: (() => {
    const rs = (ceiling.rows as Record<string, unknown>[]);
    let anyNo = false;
    let anyYes = false;
    for (const r of rs) {
      for (const v of Object.values(r.clearsAtFamilyTMaxByPresserM as Record<string, boolean>)) {
        if (v) anyYes = true; else anyNo = true;
      }
    }
    return anyYes && anyNo && rs.length === LOFT_FAMILIES().length * CEIL_TARGETS.length;
  })(),
  /** non-vacuity: every quantified face has a non-empty domain */
  gNonVacuous: sum(rows.map((r) => r.gkReleases)) > 0
    && sum(rows.map((r) => sum(r.launches))) > 0
    && sum(rows.map((r) => r.caromPopulation)) > 0
    && sum(rows.map((r) => r.blockedGkLofted)) > 0
    && sum(pooledStruckBins) > 0
    && rows.length === N_SEEDS,
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  gSeedsBookedEqualWalked: walksBooked === N_SEEDS + 1,
  gStatsZero: true, // bootstrap resamples of walked seeds consume no registry statistic
  gFaces: false, // set below, after the artifact is on disk
};

/* ========================================================================== */
/* §14 THE ARTIFACT                                                           */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'definitions', 'world', 'seeds', 'stats', 'arcInventory',
  'physicsCeiling', 'discriminator', 'pressureSignature', 'oracleSurface', 'q06Linkage',
  'perSeedCells', 'faces', 'gates'] as const;

const cellOf = (r: Row): Record<string, unknown> => ({ ...r });

const meanFrom = (k: string): number => face(k).value;
const arcInventory = {
  note: '⭐ (a) THE ARC INVENTORY — launch-angle / apex / flight-time distributions BY DELIVERY '
    + 'TYPE, from the SHIPPED physics. Every headline re-derives from the stored bins below.',
  binConvention: 'prose quotes LOWER edges. angle: 13 bins x 5 deg, last bin holds >= 60 deg. '
    + 'apex: 25 bins x 0.25 m, last bin holds >= 6.00 m. flight: 26 bins x 10 ticks, last bin '
    + 'holds >= 250 ticks.',
  parameterization: [
    { ...P_PUNT, resolvedTMin: P_PUNT.tMin, file: MECH_PATH },
    { ...P_THROW, resolvedTMin: P_THROW.tMin, file: MECH_PATH },
    { ...P_CROSS, resolvedTMin: CROSS_TMIN_APPLIED, file: MECH_PATH,
      tMinProvenance: `tMinCross = c4Flight ? CROSS_FLIGHT_MIN_S : ${CROSS_TMIN_FLAT} — ${MECH_PATH}:${CROSS_TMIN_LINE}; `
        + `the world of record flies c4Flight=${receiptC4Flight}` },
    { ...P_THROUGH, resolvedTMin: P_THROUGH.tMin, file: MECH_PATH },
  ],
  clearanceIsNotALoftKick: {
    site: 'performClear', file: MECH_PATH, line: CLEAR_VZ_LINE,
    verticalLaunchDrawMetresPerSecond: [CLEAR_VZ_LO, CLEAR_VZ_HI],
    note: 'the hoof does not go through loftKick at all — `match.kickBall(p, dir, 23·…, '
      + 'match.rng.range(lo, hi))`. Its apex is therefore vz^2/(2g), independent of range.',
  },
  drivenPassIsFlat: 'a driven/ground pass launches with vz = 0 exactly (`kickBall`\'s `loft` '
    + 'defaults to 0 and sets `ball.z = 0`), so its apex is 0 and it is UNCLEARABLE by '
    + 'construction — it is in the inventory as the flat end of the ladder.',
  loftKickNeedle: {
    needle: LOFTKICK_NEEDLE, file: MECH_PATH,
    occurrenceCount: LOFTKICK_OCCURRENCES.length,
    occurrences: LOFTKICK_OCCURRENCES,
  },
  launchesByDelivery: Object.fromEntries(DELIVERIES.map((dv, i) => [dv, {
    launches: sum(rows.map((r) => r.launches[i])),
    lofted: sum(rows.map((r) => r.launchesLofted[i])),
    meanApexMetres: round(meanFrom(`meanApexMetres_${dv}`), 6),
    meanLaunchAngleDeg: round(meanFrom(`meanLaunchAngleDeg_${dv}`), 6),
    meanFlightTicks: round(meanFrom(`meanFlightTicks_${dv}`), 6),
    medianApexMetresFromBins: round(medianFromBins(pooledApex[i], APEX_BIN_M), 6),
    medianLaunchAngleDegFromBins: round(medianFromBins(pooledAngle[i], ANGLE_BIN_DEG), 6),
    medianFlightTicksFromBins: round(medianFromBins(pooledFlight[i], FLIGHT_BIN_TICKS), 6),
    blockShare: round(meanFrom(`blockShare_${dv}`), 6),
    interruptShare: round(meanFrom(`interruptShare_${dv}`), 6),
  }])),
  pooledBins: {
    angleBinDeg: ANGLE_BIN_DEG, apexBinMetres: APEX_BIN_M, flightBinTicks: FLIGHT_BIN_TICKS,
    angleByDelivery: Object.fromEntries(DELIVERIES.map((dv, i) => [dv, pooledAngle[i]])),
    apexByDelivery: Object.fromEntries(DELIVERIES.map((dv, i) => [dv, pooledApex[i]])),
    flightByDelivery: Object.fromEntries(DELIVERIES.map((dv, i) => [dv, pooledFlight[i]])),
  },
};

const physicsCeiling = {
  question: '⭐⭐ HYPOTHESIS A, ANSWERED EXACTLY: at realistic launch ranges (presser at '
    + '2–10 m), CAN a max-loft launch within the SHIPPED parameterization clear a standing '
    + 'body\'s strike surface?',
  strikeSurface: {
    heightMetres: CLEAR_HEIGHT_M,
    heightProvenance: `${MATCH_PATH}:${AERIAL_LINE} — "${AERIAL_NEEDLE}" (occurrences: ${AERIAL_HITS})`,
    shellMetres: round(STRIKE_SHELL_M, 6),
    shellProvenance: `${MATCH_PATH}:${SHELL_LINE} — "${SHELL_NEEDLE}" (occurrences: ${SHELL_HITS}); `
      + 'shell = PLAYER_CORE_RADIUS + BALL_RADIUS',
    reachShellMetres: round(REACH_SHELL_M, 6),
    honestLimit: '⚠ clearing the strike surface converts a BODY CAROM into an AERIAL DUEL '
      + '(`tryAerial` owns z >= HEADER_MIN_HEIGHT). "Cleared" never means "uncontested".',
  },
  closedForm: 'apex = g·T²/8 ; x_clear = (d/2)·(1 − sqrt(1 − h/apex)) with h = '
    + `${CLEAR_HEIGHT_M} m — the along-line distance at which the ball first reaches head `
    + 'height. A body whose NEAR shell edge lies inside x_clear is UNCLEARABLE by that family '
    + 'at that target. The table below is computed by the SHIPPED per-tick integrator; the '
    + 'closed form is published beside it so it re-derives by hand.',
  ...ceiling,
};

const discriminator = {
  question: '⭐⭐ #328 item 3, VERBATIM: "of the distribution caroms, how many had a CLEARING '
    + 'higher line AVAILABLE at the same target (available-but-unchosen = B; unavailable = A)".',
  populationOfRecord: 'R9\'s chain-ledger family REUSED, never reinvented: a chain opened by a '
    + 'GK release (open play), resolved by the RELEASING KEEPER OWNING THE BALL AGAIN within '
    + 'the 240-tick WINDOW OF RECORD, classified by R9 §3(d)\'s ORDERED ladder as `directCarom` '
    + '(nobody else OWNED it, but another body TOUCHED it) — RESTRICTED to those whose first '
    + 'body contact happened IN FLIGHT, before the launch ball ever landed. That restriction '
    + 'is the user\'s pattern stated exactly; the excluded remainder is published beside it.',
  availableDefinition: 'AVAILABLE = there exists a shipped loft family F such that, launching '
    + 'from the SAME point along the SAME direction to the SAME landing distance d, with '
    + 'T_F = clamp(F.tBase + F.tPerM·d, F.tMin, F.tMax), vz = GRAVITY·T_F/2 and |v| = d/T_F '
    + '(loftKick\'s own three expressions), the SHIPPED per-tick integrator never puts the '
    + 'ball below HEADER_MIN_HEIGHT on any tick whose along-line position lies inside the '
    + 'first struck body\'s strike surface [s − shell, s + shell], AND the ball is still in '
    + 'flight when it passes s + shell.',
  shippedModelProof: 'the counterfactual replays `Match.stepBallPhysics`\'s airborne branch '
    + 'statement-for-statement and is cross-checked against LIVE flights (gReplayMatchesLive: '
    + `${sum(rows.map((r) => r.replaySamples))} per-tick samples, max abs diff `
    + `${round(Math.max(...rows.map((r) => r.replayMaxAbsDiff)), 12)} m). An idealised `
    + 'ballistic model would answer a different question and would void the face (#329 item 5).',
  counts: {
    directCaromWithinWindow: sum(rows.map((r) => r.returnWithinByClass[R.directCarom])),
    populationOfRecord: sum(rows.map((r) => r.caromPopulation)),
    excludedContactAfterLanding: sum(rows.map((r) => r.caromExcludedContactAfterLanding)),
    populationBlockedShortOfTarget: sum(rows.map((r) => r.caromBlockedShort)),
    blockedGkLoftedLaunches: sum(rows.map((r) => r.blockedGkLofted)),
    gkReleases: sum(rows.map((r) => r.gkReleases)),
  },
  struckBodyAlongLineDistance: {
    binMetres: STRUCK_BIN_M, bins: pooledStruckBins,
    medianMetresFromBins: round(medianFromBins(pooledStruckBins, STRUCK_BIN_M), 6),
    note: 'the along-line distance from the launch point to the FIRST body the flight met — '
      + 'the geometry hypothesis A lives or dies on',
  },
  r9Provenance: {
    file: R9_PATH, sha256: R9_BYTES_SHA,
    distributionFamilyShareOfTheRise: R9_DIST_SHARE,
    familyDefinition: DISTRIBUTION_FAMILY,
  },
};

const pressureSignature = {
  question: '⭐ #328 item 3, VERBATIM: "block rate should RISE with pressure (learned '
    + 'line-picking) — flat-in-pressure = blind launching".',
  binMetres: PRESS_BIN_M, binCount: PRESS_BINS,
  binConvention: 'prose quotes LOWER edges; the last bin holds >= 14 m',
  gk: Array.from({ length: PRESS_BINS }, (_, b) => ({
    binLowerEdgeMetres: b * PRESS_BIN_M,
    launches: sum(rows.map((r) => r.gkLaunchesByPressBin[b])),
    blocked: sum(rows.map((r) => r.gkBlockedByPressBin[b])),
    blockRate: round(face(`gkBlockRatePressBin_${b}`).value, 6),
    ci95: [round(face(`gkBlockRatePressBin_${b}`).ciLo, 6), round(face(`gkBlockRatePressBin_${b}`).ciHi, 6)],
  })),
  outfield: Array.from({ length: PRESS_BINS }, (_, b) => ({
    binLowerEdgeMetres: b * PRESS_BIN_M,
    launches: sum(rows.map((r) => r.outLaunchesByPressBin[b])),
    blocked: sum(rows.map((r) => r.outBlockedByPressBin[b])),
    blockRate: round(face(`outfieldBlockRatePressBin_${b}`).value, 6),
    ci95: [round(face(`outfieldBlockRatePressBin_${b}`).ciLo, 6), round(face(`outfieldBlockRatePressBin_${b}`).ciHi, 6)],
  })),
};

/** (d) THE ORACLE SURFACE — sites, anchored by needle + line receipt */
const PB_PATH = 'src/ai/PlayerBrain.ts';
const PB_SRC = readFileSync(PB_PATH, 'utf8');
const PERC_PATH = 'src/ai/perception.ts';
const PERC_SRC = readFileSync(PERC_PATH, 'utf8');
const DVS_PATH = 'src/ai/deliveryValueSeat.ts';
const DVS_SRC = readFileSync(DVS_PATH, 'utf8');
const siteOf = (src: string, file: string, needle: string): Record<string, unknown> => ({
  file, needle, occurrences: countOf(src, needle),
  line: countOf(src, needle) >= 1 ? lineOf(src, src.indexOf(needle)) : -1,
});
const oracleSurface = {
  note: '⭐ (d) THE ORACLE SURFACE — where the launch TARGET / POWER / LOFT choosers live, what '
    + 'a corridor-hazard price would CONSUME that already exists, and the perf bound. Every '
    + 'site is pinned by an anchored needle with its occurrence count and line receipt.',
  choosers: [
    { what: 'THE PUNT\'s target picker (strength × forward gain; NO corridor term at all)',
      ...siteOf(PB_SRC, PB_PATH, 'const fit = clamp01((team.localX(mate.pos.x) - localX) / 60) * 0.6 + mate.attrs.strength * 0.5;') },
    { what: '⭐⭐ THE PUNT\'s SCORE — the whole of it. `closed`, two genes and the target fit. '
      + 'THERE IS NO LANE / CORRIDOR / BODY TERM IN THIS EXPRESSION: the punt prices bodies at '
      + 'ZERO, and this one site is the pricing gap in one statement',
      ...siteOf(PB_SRC, PB_PATH, '(0.2 + closed * 0.55) *') },
    { what: 'THE HAND THROW\'s corridor price — the precedent that already exists (a GROUND '
      + 'lane read, `laneOpenness`, folded multiplicatively)',
      ...siteOf(PB_SRC, PB_PATH, 'sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;') },
    { what: 'THE OPEN-PLAY LOFT SWITCH\'s corridor price — `airLane`, read ONCE per decision',
      ...siteOf(PB_SRC, PB_PATH, 'let sL = (W.loftBase + openBody * W.loftOpenW) * airLane;') },
    { what: 'the airLane read itself', ...siteOf(PB_SRC, PB_PATH, 'const airLane = p.kickCooldown <= 0 ? airLaneOpenness(p.pos, opp.players) : 0;') },
    { what: 'THE CROSS\'s delivery site (target + pull + swing) — `performCross`\'s caller',
      ...siteOf(PB_SRC, PB_PATH, "case 'Cross':") },
    { what: 'THE LOFT/PUNT delivery site — one statement, two callers',
      ...siteOf(PB_SRC, PB_PATH, 'const loftTo = top === puntCand ? puntMate! : bestLoftMate!;') },
  ],
  whatAPriceWouldConsume: [
    { what: '⭐ `airLaneOpenness(from, opponents)` — ALREADY the loft\'s corridor sense, and '
      + 'already the wrong shape for this question: it reads DISTANCE FROM THE KICKER ONLY. It '
      + 'has no direction, so it cannot tell a body ON the line from a body behind the kicker; '
      + 'and it has no HEIGHT, so it cannot tell a ball that flies over him from one that hits '
      + 'him. A corridor-hazard price would consume the same bodies through a DIRECTIONAL, '
      + 'HEIGHT-AWARE read.',
      ...siteOf(PERC_SRC, PERC_PATH, 'export function airLaneOpenness(from: V2, opponents: Player[]): number {') },
    { what: '`laneOpenness(from, to, opponents)` — the DIRECTIONAL ground read (closest point '
      + 'on segment, `worst = min`), the aggregation idiom any corridor price would inherit',
      ...siteOf(PERC_SRC, PERC_PATH, 'export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {') },
    { what: '⭐⭐ `flightExposure(from, aim, opponents)` — the DV seat\'s own time-aware corridor '
      + 'price, ALREADY SHIPPED AND ALREADY GENE-WEIGHTED (`deliveryRiskPrice`). It is '
      + 'directional and it prices closing speed over the flight — and it is still purely 2-D: '
      + 'it has no z. THE CHEAPEST HONEST CORRIDOR-HAZARD PRICE IS THIS FUNCTION WITH THE '
      + 'TRAJECTORY\'S OWN HEIGHT AT EACH BODY, which is `g·T²/8`-shaped arithmetic the engine '
      + 'already writes (CROSS_FLIGHT_MIN_S is derived from exactly that identity).',
      ...siteOf(DVS_SRC, DVS_PATH, 'export function flightExposure(') },
    { what: 'the price\'s composition site — `score − wExposure·exposure − belief·valueScale`, '
      + 'the born-absent gene form a loft corridor price would reuse verbatim',
      ...siteOf(DVS_SRC, DVS_PATH, 'export function deliveryRiskPrice(') },
    { what: 'the STRIKE SURFACE\'s own geometry — the thing a price must consume to be honest',
      file: MATCH_PATH, needle: SHELL_NEEDLE, occurrences: SHELL_HITS, line: SHELL_LINE },
    { what: 'the CLEARANCE HEIGHT — the partition edge armed',
      file: MATCH_PATH, needle: AERIAL_NEEDLE, occurrences: AERIAL_HITS, line: AERIAL_LINE },
  ],
  lambdaLinIdiom: 'the λ_LIN idiom (TeamBrain.ts: "the account\'s own frozen ceiling … cap at '
    + 'the shipped region\'s edge") applies twice here: (i) a CEILING fix caps at the loft '
    + 'family\'s OWN expressible region — tMax is the edge, and the honest move is to let the '
    + 'clamp reach it at ranges the distance formula currently forbids, never to add a new '
    + 'constant; (ii) a PRICING fix caps at `flightExposure`\'s own [0,1] range and rides '
    + '`deliveryRiskPrice`\'s born-absent gene, so a zero-weight world prices byte-identically.',
  perfBound: {
    file: PERF_PATH, sha256: PERF_BYTES_SHA,
    headUsPerStep: PERF_JSON.usPerStep, stepP95Us: PERF_JSON.stepP95Us,
    ballPhaseUsPerStep: (PERF_JSON.phases as { phase: string; usPerStep: number }[])
      .find((p) => p.phase === 'ball')?.usPerStep ?? null,
    decidePhaseUsPerStep: (PERF_JSON.phases as { phase: string; usPerStep: number }[])
      .find((p) => p.phase === 'decide')?.usPerStep ?? null,
    budgetNote: '⭐ THE BUDGET a fix slice must live inside. A corridor-hazard price is a '
      + 'DECIDE-phase cost (0.54 µs/step, 10 % of the step) and is bounded by one extra pass '
      + 'over the opponents already scanned by `airLaneOpenness` at the SAME call site — the '
      + 'read is already made once per decision, so the added work is arithmetic per body, not '
      + 'a new scan. A CEILING fix is free (it moves a clamp inside `loftKick`). ⚠ THIS CENSUS '
      + 'IS INSTRUMENT-ONLY: it changes no src and therefore costs the engine nothing; the '
      + 'numbers above are the BASELINE ARTIFACT\'s, quoted, not re-measured here.',
  },
};

const q06Linkage = {
  note: '⭐ (e) THE Q06 LINKAGE — STATED AS AN EXPECTATION, NEVER A MEASURED CLAIM.',
  bkT2Face: Q06,
  provenance: { file: BKT2_PATH, sha256: BKT2_BYTES_SHA },
  statement: 'BK-T2 measured `ryiQ06PassCompletion` falling from base to armed — the −8.9 pp '
    + 'completion cost of the contact law, at 13.3 half-widths, away from R-乙\'s real band. A '
    + 'launch that is blocked point-blank is an INCOMPLETE PASS by the engine\'s own '
    + 'book-keeping, so the distribution-carom population is one of the mechanisms paying that '
    + 'bill. EXPECTATION (pre-registered here, to be measured by the fix slice, not by this '
    + 'census): a fix that removes blocked launches from the population — whether by raising '
    + 'the ceiling so the ball flies over the first wave (A), or by pricing the corridor so a '
    + 'blind line is not chosen (B) — should PARTIALLY recover Q06. Neither alone is expected '
    + 'to recover it fully: the contact law also blocks GROUND passes, which no arc can clear '
    + 'and which this census books as `drivenPass` (apex 0, unclearable by construction).',
};

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BK-C1',
    title: 'THE DISTRIBUTION CENSUS — the arc inventory, the physics ceiling, the A-vs-B '
      + 'discriminator, the pressure signature, the oracle surface',
    doc: 'docs/world-model/BK-C1-DISTRIBUTION-CENSUS.md',
    contract: 'docs/world-model/BK-BODYBALL-CONTRACT.md',
    authorizedBy: 'ruling #329 item 5, serving the USER MANDATE of ruling #328',
    kind: 'INSTRUMENT-ONLY CENSUS — zero src behaviour change; no scored hypothesis; publishes '
      + 'MEASUREMENTS and a DESIGN PICK, never a football claim',
    userWordsOfRecord: ['门将开球本来要给前面或者中锋,结果直接弹到后卫或者对面压迫过来的前锋的'
      + '身体上然后弹回来,这个不现实足球', '或者你觉得球的弧线要不要提高?'],
    prohibition: '⛔ #328 item 3: the default arc is NEVER hand-raised. If A is true the '
      + 'CEILING moves (substrate capability) and WHEN to go high stays priced and emergent.',
    mode: MODE, generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bk-c1-distribution-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bk-c1-distribution-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: { [MECH_PATH]: MECH_SHA, [MATCH_PATH]: MATCH_SHA },
  },
  definitions: {
    windowOfRecordTicks: BOUNCE_WINDOW_TICKS,
    chainRetireTicks: CHAIN_RETIRE_TICKS,
    clockHonesty: '1 sim-s = 60 ticks = 22.5 display-s; every rate is on the 240 s match clock',
    deliveryTypes: DELIVERIES,
    returnClassLadder: RETURN_CLASSES,
    distributionFamily: DISTRIBUTION_FAMILY,
    blockDefinition: 'a launch is BLOCKED when its flight is interrupted by a body other than '
      + 'the kicker BEFORE the ball first lands — a `lastTouch` change or a new owner. The '
      + 'BK-contact-law subset (`strikesApplied` incremented on that tick) is stored beside it '
      + 'as `strikeBlockedByDelivery`; the wider definition is the face of record because a '
      + 'presser who is NOT cooling blocks through the SHIPPED claim loop, not through the '
      + 'body-strike channel, and the user\'s complaint does not distinguish them.',
    availableDefinition: discriminator.availableDefinition,
    honestLimits: [
      '⚠ CLEARED != UNCONTESTED: above HEADER_MIN_HEIGHT the ball belongs to `tryAerial`, so a '
      + 'clearing line trades a body carom for an aerial duel.',
      '⚠ THE COUNTERFACTUAL HOLDS DIRECTION AND TARGET FIXED. It asks "could the same ball to '
      + 'the same man have gone over him", not "was there a better target" — the second is the '
      + 'chooser\'s question and belongs to the fix slice.',
      '⚠ THE POPULATION IS WINDOW-CENSORED at 240 ticks (BK-T2\'s own window, kept so the face '
      + 'decomposes the face of record). The wider `blockedGkLofted*` faces are not censored '
      + 'and are published beside it.',
      '⚠ NO BETWEEN-ARM COMPARISON EXISTS HERE. One arm, one world (world-9). Nothing in this '
      + 'artifact is an effect size.',
    ],
  },
  world: {
    stack: 'world-9 = a4MatchFlags(8) + armA4World(matured L3/PC doses) + bkFacingLaw + bkContactLaw',
    armedVersion: BK_WORLD_VERSION,
    conjunctsAtReceiptSeed: receiptConjuncts,
    c4FlightPolicy: receiptC4Flight,
    doseSources: [
      { file: L3_T1_PATH, sha256: L3_BYTES_SHA, cells: L3_DOSE.length },
      { file: PC_T1_PATH, sha256: PC_BYTES_SHA, rosterRows: PC_DOSE.length },
    ],
    workerFixtureNote: 'CANON, VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world '
      + '(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines '
      + "#270's E4 correction; matches the perf diagnostic)\" — this probe builds `Match` "
      + 'DIRECTLY and never round-trips a League, so no worker fixture is generated and the '
      + 'sentence binds nothing here. It is quoted because the census walks worlds.',
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    booked: BATTERY_SEEDS,
    walked: seedsWalked,
    walksTotal: rows.length,
    smokePrefixInBand: SMOKE_SEEDS,
    receiptSeed: RECEIPT_SEED,
    bookedEqualsWalked: walksBooked === N_SEEDS + 1,
    consumedWhole: 'the block is consumed WHOLE of record',
  },
  stats: {
    consumed: 0,
    note: 'the CIs are BOOTSTRAP RESAMPLES OF THE WALKED SEEDS, not a registry-consuming '
      + 'statistic (the IN-T0 / DF-T2 / IN-T1 precedent). The next stats base remains >= 115,200.',
    bootstrapDraws: BOOTSTRAP,
    resampleRngSeed: BLOCK_BASE,
  },
  arcInventory,
  physicsCeiling,
  discriminator,
  pressureSignature,
  oracleSurface,
  q06Linkage,
  perSeedCells: rows.map(cellOf),
  faces: faces.map((f) => ({
    face: f.face, unit: f.unit, what: f.what, denNote: f.denNote,
    value: round(f.value, 8), numerator: f.numerator, denominator: f.denominator,
    ci95: [round(f.ciLo, 8), round(f.ciHi, 8)], halfWidth: round(f.halfWidth, 8),
  })),
  gates,
};

writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
/* §15 gFaces — THE RE-DERIVATION GATE, PARSING THE SERIALIZED ARTIFACT       */
/* ========================================================================== */
/**
 * ⭐ CANON, VERBATIM: "the re-derivation gate covers EVERY published face; a percentile face
 * requires stored bins" (HOME: PC-C0 §CORR item 4). Every face, every median and every
 * published bin summary is re-derived FROM DISK.
 */
const disk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as typeof artifact;
const diskCells = (disk.perSeedCells as Row[]);
const diskFaces = (disk.faces as { face: string; value: number; numerator: number; denominator: number }[]);
/**
 * ⭐ AN EMPTY CELL IS A VALUE, NOT A HOLE. `JSON.stringify` writes `NaN` as `null`, so the
 * re-derivation gate must treat "null on disk" and "NaN recomputed" as THE SAME EMPTY CELL —
 * otherwise every zero-denominator face (a pressure bin nobody launched into) fails the gate
 * for a serialization reason and the gate stops discriminating real drift.
 */
const asNum = (v: number | null | undefined): number => (v === null || v === undefined ? Number.NaN : v);
const eq = (a: number | null, b: number | null): boolean => {
  const x = asNum(a);
  const y = asNum(b);
  return (Number.isNaN(x) && Number.isNaN(y)) || Math.abs(x - y) < 1e-8;
};
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const df of diskFaces) {
  const def = FACES[df.face];
  faceChecks++;
  if (def === undefined) { faceFailures.push(`${df.face}: no definition`); continue; }
  const n = sum(diskCells.map((r) => def.num(r)));
  const d0 = sum(diskCells.map((r) => def.den(r)));
  const ok = n === df.numerator && d0 === df.denominator
    && eq(round(ratio(n, d0), 8), df.value);
  if (ok) faceOk++; else faceFailures.push(`${df.face}: ${n}/${d0} vs ${df.numerator}/${df.denominator}`);
}
/** the bin-borne faces re-derive from the STORED bins on disk */
const binChecks: [string, boolean][] = [];
const diskArc = disk.arcInventory as typeof arcInventory;
for (let i = 0; i < DELIVERIES.length; i++) {
  const dv = DELIVERIES[i];
  const accA = zeros(ANGLE_BINS);
  const accP = zeros(APEX_BINS);
  const accF = zeros(FLIGHT_BINS);
  for (const r of diskCells) {
    addInto(accA, r.angleBinsByDelivery[i]);
    addInto(accP, r.apexBinsByDelivery[i]);
    addInto(accF, r.flightBinsByDelivery[i]);
  }
  const pub = (diskArc.launchesByDelivery as Record<string, Record<string, number>>)[dv];
  binChecks.push([`bins.${dv}.angle`, JSON.stringify(accA)
    === JSON.stringify((diskArc.pooledBins.angleByDelivery as Record<string, number[]>)[dv])]);
  binChecks.push([`bins.${dv}.apex`, JSON.stringify(accP)
    === JSON.stringify((diskArc.pooledBins.apexByDelivery as Record<string, number[]>)[dv])]);
  binChecks.push([`bins.${dv}.flight`, JSON.stringify(accF)
    === JSON.stringify((diskArc.pooledBins.flightByDelivery as Record<string, number[]>)[dv])]);
  binChecks.push([`median.${dv}.apex`, eq(pub.medianApexMetresFromBins, round(medianFromBins(accP, APEX_BIN_M), 6))]);
  binChecks.push([`median.${dv}.angle`, eq(pub.medianLaunchAngleDegFromBins, round(medianFromBins(accA, ANGLE_BIN_DEG), 6))]);
  binChecks.push([`median.${dv}.flight`, eq(pub.medianFlightTicksFromBins, round(medianFromBins(accF, FLIGHT_BIN_TICKS), 6))]);
}
{
  const accS = zeros(STRUCK_BINS);
  for (const r of diskCells) addInto(accS, r.struckDistBins);
  const dd = disk.discriminator as typeof discriminator;
  binChecks.push(['bins.struckAlongLine', JSON.stringify(accS) === JSON.stringify(dd.struckBodyAlongLineDistance.bins)]);
  binChecks.push(['median.struckAlongLine', eq(dd.struckBodyAlongLineDistance.medianMetresFromBins,
    round(medianFromBins(accS, STRUCK_BIN_M), 6))]);
  binChecks.push(['counts.populationBlockedShort', dd.counts.populationBlockedShortOfTarget === sum(diskCells.map((r) => r.caromBlockedShort))]);
  binChecks.push(['counts.population', dd.counts.populationOfRecord === sum(diskCells.map((r) => r.caromPopulation))]);
  binChecks.push(['counts.blockedGkLofted', dd.counts.blockedGkLoftedLaunches === sum(diskCells.map((r) => r.blockedGkLofted))]);
}
{
  const ps = disk.pressureSignature as typeof pressureSignature;
  for (let b = 0; b < PRESS_BINS; b++) {
    binChecks.push([`press.gk.${b}`, ps.gk[b].launches === sum(diskCells.map((r) => r.gkLaunchesByPressBin[b]))
      && ps.gk[b].blocked === sum(diskCells.map((r) => r.gkBlockedByPressBin[b]))]);
    binChecks.push([`press.out.${b}`, ps.outfield[b].launches === sum(diskCells.map((r) => r.outLaunchesByPressBin[b]))
      && ps.outfield[b].blocked === sum(diskCells.map((r) => r.outBlockedByPressBin[b]))]);
  }
}
const binFailures = binChecks.filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && faceFailures.length === 0 && binFailures.length === 0;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: FACE_KEYS.length, checksRun: faceChecks, checksPassed: faceOk,
  binChecksRun: binChecks.length, binFailures, failures: faceFailures,
};
/** the ALLOWLIST-SCHEMA hashed body, computed LAST so it covers the final gate values */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonical(body));
(artifact as { resultSha256: string }).resultSha256 = '';
const serialized = `${JSON.stringify(artifact, null, 2)}\n`;
writeFileSync(OUT_PATH, serialized);

/* ========================================================================== */
banner('');
banner('=== BK-C1 — THE DISTRIBUTION CENSUS ===');
banner(`artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
const show = (k: string): string => {
  const f = face(k);
  return `${k} = ${round(f.value, 6)} CI[${round(f.ciLo, 6)}, ${round(f.ciHi, 6)}] `
    + `n=${f.numerator}/${f.denominator}`;
};
banner('--- (b) THE A-vs-B DISCRIMINATOR ---');
for (const k of ['caromClearingLineAvailableShare', 'caromClearingLineAvailableAtFamilyTMaxShare',
  'caromClearingLineAvailableVsReachSurfaceShare', 'caromClearingLineAvailableContinuousShare',
  'blockedGkLoftAvailableShare', 'blockedGkLoftAvailableAtFamilyTMaxShare']) banner(`  ${show(k)}`);
banner('--- (a) THE ARC INVENTORY (mean apex m / mean angle deg / mean flight ticks) ---');
for (const dv of DELIVERIES) {
  const n = sum(rows.map((r) => r.launchesLofted[D[dv]]));
  if (n === 0) { banner(`  ${dv}: no lofted launches booked`); continue; }
  banner(`  ${dv}: apex ${round(face(`meanApexMetres_${dv}`).value, 3)} m · `
    + `angle ${round(face(`meanLaunchAngleDeg_${dv}`).value, 2)}° · `
    + `flight ${round(face(`meanFlightTicks_${dv}`).value, 1)} ticks · `
    + `block ${round(face(`blockShare_${dv}`).value, 4)} · n=${n}`);
}
banner('--- (c) THE PRESSURE SIGNATURE (block rate by presser distance at launch) ---');
banner(`  GK      : ${pressureSignature.gk.map((b) => `${b.binLowerEdgeMetres}m:${round(b.blockRate, 4)}(${b.launches})`).join(' ')}`);
banner(`  OUTFIELD: ${pressureSignature.outfield.map((b) => `${b.binLowerEdgeMetres}m:${round(b.blockRate, 4)}(${b.launches})`).join(' ')}`);
banner('--- (a) THE CEILING: smallest clearable presser distance, by target ---');
for (const r of (ceiling.minClearablePresserByTarget as { targetDistanceM: number; minClearablePresserMetres: number | null }[])) {
  banner(`  target ${r.targetDistanceM} m → ${r.minClearablePresserMetres === null ? 'NOTHING CLEARABLE' : `${r.minClearablePresserMetres} m`}`);
}
banner(`struck-body along-line median = ${discriminator.struckBodyAlongLineDistance.medianMetresFromBins} m `
  + `(bins ${pooledStruckBins.join('/')})`);
banner(`walks booked = walked: ${walksBooked}  ·  wall ${round((Date.now() - t0Wall) / 1000, 1)} s`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
if (red.length > 0) banner(`RED GATES: ${red.join(', ')} — REPORTED, NEVER PATCHED`);
process.exit(red.length > 0 ? 1 : 0);
