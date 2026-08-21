/**
 * BK-T4 — THE CORRIDOR EXAM (docs/world-model/BK-T4-CORRIDOR-EXAM.md).
 *
 * Authorized by ruling #335 item 5 (the #334 ladder), serving the USER MANDATE of rulings
 * #328/#330. THIS IS AN EXAM: two frozen hypotheses, pre-registered in the stage doc §P
 * BEFORE this battery ran, plus a season ladder that lets EVOLUTION find the weight.
 *
 * THE WEIGHT LADDER (the arms): `dvExposureWeight`'s OWN domain is `[0, 1]` —
 * `dvExposureWeightOf` clamps with `clamp01` (anchored below, its file bytes hashed). The
 * rungs are that domain's OWN QUARTERS, all of them: {0, 0.25, 0.5, 0.75, 1}. NO TASTE
 * CONSTANT is chosen and no subset is argued: the ladder walks the gene's own domain.
 *   · rung 0 = THE CONTROL ARM — the flag ABSENT and the gene BORN ABSENT (BK-T3's shut
 *     world of record, unchanged).
 *   · rungs > 0 = the flag ARMED and the weight set through the MATCH-LOCAL-COPY idiom
 *     (bu-t1's `setMtDoseLocal` shape: `baseGenome`/`effGenome` replaced by COPIES,
 *     `info.genome` NEVER touched) with an `info.genome`-CLEANLINESS world conjunct —
 *     the ratified post-#270.2 form ORDERED at #334 item 1.
 *
 * THE TWO FROZEN HYPOTHESES (verdicts, not gates — a missed hypothesis is a RESULT):
 *   H-BK.3(a) THE DEFLECTION FALLS WITH THE CONTROLS FLAT — at SOME rung,
 *     `caromInFlightPerGkRelease` (R9's chain family, BK-C1/BK-T3's face, reused verbatim)
 *     falls RESOLVEDLY against rung 0 (the paired per-seed bootstrap Δ's 95 % interval lies
 *     entirely below zero) WHILE both UNPRICED controls — the cross's and the driven pass's
 *     blocked-short shares — stay INSIDE their own rung-0 intervals.
 *   H-BK.3(b) RE-AIM, NOT SUPPRESS — at the LOWEST rung where (a) passes, lofted delivery
 *     VOLUME (launches per match, POOLED over the four priced deliveries AND per delivery
 *     type) sits at or above rung 0's OWN interval's LOWER EDGE (a non-inferiority band
 *     derived from the control arm's own bootstrap interval — no taste constant). If (a)
 *     passes only where volume collapses, (b) FAILS and that is the result.
 *
 * REPORTED, NEVER GATED: Q06 pass completion by rung · the presser-distance signature by
 * rung · blocked-short by delivery by rung · the price distribution by rung · per-family
 * reachability by rung · ⭐ THE SEASON LADDER (the gene EVOLVABLE under the shipped
 * `evolveDeliveryValue` mutation path vs LOCKED ABSENT — does selection ADOPT the corridor
 * sense, what happens to goals × generation, what happens to the deflection face).
 *
 * INSTRUMENT LAW, all of it previously ordered:
 *   · the CORRECTED `gPriceFires` FORM (#334 item 4): the gate reads the price's
 *     EVALUATION count inside armed decisions, NEVER the chosen launches' residual hazard —
 *     "a chooser that has learned to avoid bodies makes the second one false by succeeding".
 *   · COMPOSITION FIXTURES for every walk-side predicate (the canon REFINED at #334 item 2:
 *     "anchored extraction protects the source line; a headline-bearing walk-side predicate
 *     ALSO needs a composition fixture"). Every walk-side predicate in this file is a PURE
 *     exported-shaped function called by BOTH the walk and its fixture table.
 *   · THE RED-ROUTING IDIOM (#334 item 5, a required brief clause):
 *     `outPath = ALL_GREEN || IS_OVERRIDE ? OUT : OUT + '.RED.json'`.
 *   · BOOKED = WALKED gated against the per-seed CELLS' OWN distinct-seed set (#335 item 4),
 *     never a projection of the input list.
 *   · per-seed cells (canon, home #282.2(ii)); `gFaces` re-derives EVERY published face and
 *     every stored bin from the SERIALIZED artifact off disk (canon: gFaces-from-disk).
 *   · CLOCK HONESTY: every rate is per MATCH on the engine's own 240 s match clock, or per
 *     GK release / per launch — each field carries the unit its name claims.
 *   · NO GATE THAT CANNOT FAIL (#334 item 3): there is no `gStatsZero` here — a hardcoded
 *     true is not a gate. The stats ledger is a FIELD, and zero registry statistics are
 *     drawn anywhere in this file (the intervals are bootstrap resamples of walked seeds).
 *
 * CANON, VERBATIM (quoted because a weight is read from disk): "a dose-source guard should
 * hash the bytes it reads, not a self-declared field" (home: BU-T1 §CORR item 6).
 * CANON, VERBATIM (quoted because the ladder plays leagues of matches): "WORKER-SIMMED
 * fixtures play the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated
 * now, test-pinned; refines #270's E4 correction; matches the perf diagnostic)" (home:
 * ruling #283.2(iv)) — this probe builds `Match` DIRECTLY and never round-trips a League,
 * so no worker fixture is generated; the ladder's ecology is the EXAM's world, stated, and
 * no shipped-League number is quoted as this ladder's.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { execSync } from 'node:child_process';
import { Match } from '../../src/sim/Match';
import {
  BALL_AIR_SPIN_DECAY, BALL_GROUND_SPIN_DECAY, BALL_RADIUS, DT, GRAVITY, HEADER_MIN_HEIGHT,
  PLAYER_CORE_RADIUS,
} from '../../src/sim/constants';
import {
  a4ArmedVersion, a4MatchFlags, armA4World, poolT1DoseCells, poolPcDoseTable,
  BK_WORLD_VERSION, type L3DoseCell,
} from '../../src/game/a4World';
import { PC_BOOK_CELLS } from '../../src/ai/pcLatency';
import {
  crossoverGenomes, mutateGenome, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng, hashSeed } from '../../src/utils/rng';
import { laneOpenness } from '../../src/ai/perception';
import {
  BK_CORRIDOR_FAMILIES, BK_CORRIDOR_LEAD_FLIGHT_FRACTION, bkCorridorFlightOf,
  bkCorridorHazard, bkCorridorLeadAim, bkCorridorPriceLed, bkCorridorPriceOf,
  deliveryValueSeatOf,
} from '../../src/ai/deliveryValueSeat';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS                        */
/* ========================================================================== */
const ENV_WHITELIST = ['BKT4_MODE', 'BKT4_N', 'BKT4_OUT', 'BKT4_LADDER'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BKT4_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`REFUSING: unknown env doors ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = (process.env.BKT4_MODE as Mode | undefined) ?? 'full';
if (!MODES.includes(MODE)) { banner(`REFUSING: BKT4_MODE=${MODE}`); process.exit(2); }
const N_ENV = process.env.BKT4_N !== undefined ? Number(process.env.BKT4_N) : undefined;
const OUT_ENV = process.env.BKT4_OUT;
const LADDER_ENV = process.env.BKT4_LADDER;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? [`N=${N_ENV}`] : []),
  ...(LADDER_ENV !== undefined ? [`LADDER=${LADDER_ENV}`] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bk-t4-corridor-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bk-t4-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean =>
  pathResolve(p).startsWith(CANONICAL_DIR_ABS + pathSep);
if (IS_PREFLIGHT && isCanonical(OUT_BASE)) {
  banner(`REFUSING: a preflight run (${PREFLIGHT_REASONS.join(', ')}) may not write the canonical artifact`);
  process.exit(2);
}
const IS_OVERRIDE = IS_PREFLIGHT;
const RUN_LADDER = LADDER_ENV !== 'off';

const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : (Number.isNaN(v) ? Number.NaN : v));
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return Number.NaN;
  const m = mean(xs);
  return Math.sqrt(sum(xs.map((x) => (x - m) ** 2)) / (xs.length - 1));
};
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const ratio = (n: number, d: number): number => (d === 0 ? Number.NaN : n / d);
const canonical = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonical(o[k])}`).join(',')}}`;
};
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return ''; }
};

/* ========================================================================== */
/* §1 ANCHORED EXTRACTIONS — every constant to its NAMED site                 */
/* ========================================================================== */
const MECH_PATH = 'src/sim/mechanics.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const SEAT_PATH = 'src/ai/deliveryValueSeat.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const EVOLVE_PATH = 'src/evolution/evolve.ts';
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const GENOME_SRC = readFileSync(GENOME_PATH, 'utf8');
const EVOLVE_SRC = readFileSync(EVOLVE_PATH, 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const countOf = (src: string, needle: string): number => src.split(needle).length - 1;
interface Anchor { needle: string; file: string; occurrences: number; line: number }
const anchor = (file: string, src: string, needle: string): Anchor => {
  const occurrences = countOf(src, needle);
  return {
    needle, file, occurrences,
    line: occurrences === 1 ? lineOf(src, src.indexOf(needle)) : -1,
  };
};
/** the body of a NAMED `export function`, up to the next top-level declaration */
const namedFnBody = (src: string, name: string): { body: string; start: number } | null => {
  const at = src.indexOf(`export function ${name}(`);
  if (at < 0) return null;
  const rest = src.slice(at + 1);
  const nxt = rest.indexOf('\nexport function ');
  return { body: nxt < 0 ? rest : rest.slice(0, nxt), start: at };
};
/** the four positional loft constants AT a NAMED call site (never first-occurrence) */
const loftTupleAt = (fn: string): {
  tBase: number; tPerM: number; tMin: number; tMax: number; line: number; text: string;
} => {
  const b = namedFnBody(MECH_SRC, fn);
  if (b === null) throw new Error(`no ${fn}`);
  const at = b.body.indexOf('loftKick(');
  if (at < 0) throw new Error(`no loftKick in ${fn}`);
  const text = b.body.slice(at, b.body.indexOf(';', at) + 1);
  const nums = (text.match(/-?\d+\.\d+|-?\d+/g) ?? []).map(Number);
  return {
    tBase: nums[0], tPerM: nums[1], tMin: nums[2], tMax: nums[3],
    line: lineOf(MECH_SRC, b.start + 1 + at), text: text.trim(),
  };
};
const SITE_LOFT = loftTupleAt('performLoftedPass');
const SITE_THROW = loftTupleAt('performKeeperThrow');
const SITE_DINK = loftTupleAt('performThroughBall');
const FAMILY_ANCHORED_OK =
  SITE_LOFT.tBase === BK_CORRIDOR_FAMILIES.loft.tBase
  && SITE_LOFT.tPerM === BK_CORRIDOR_FAMILIES.loft.tPerM
  && SITE_LOFT.tMin === BK_CORRIDOR_FAMILIES.loft.tMin
  && SITE_LOFT.tMax === BK_CORRIDOR_FAMILIES.loft.tMax
  && SITE_THROW.tBase === BK_CORRIDOR_FAMILIES.keeperThrow.tBase
  && SITE_THROW.tPerM === BK_CORRIDOR_FAMILIES.keeperThrow.tPerM
  && SITE_THROW.tMin === BK_CORRIDOR_FAMILIES.keeperThrow.tMin
  && SITE_THROW.tMax === BK_CORRIDOR_FAMILIES.keeperThrow.tMax
  && SITE_DINK.tBase === BK_CORRIDOR_FAMILIES.dink.tBase
  && SITE_DINK.tPerM === BK_CORRIDOR_FAMILIES.dink.tPerM
  && SITE_DINK.tMin === BK_CORRIDOR_FAMILIES.dink.tMin
  && SITE_DINK.tMax === BK_CORRIDOR_FAMILIES.dink.tMax
  && countOf(MECH_SRC, 'loftKick(') === 5;

/** the strike surface, both halves, at their own single sites */
const A_SHELL = anchor(MATCH_PATH, MATCH_SRC, 'const shell = p.coreRadius + ball.radius;');
const A_EDGE = anchor(
  MATCH_PATH, MATCH_SRC,
  'const aerialOnly = this.bkContactLaw ? ball.z >= HEADER_MIN_HEIGHT : ball.z > CONTROL_MAX_HEIGHT;',
);
const STRIKE_SHELL_M = PLAYER_CORE_RADIUS + BALL_RADIUS;
const SURFACE_OK = A_SHELL.occurrences === 1 && A_EDGE.occurrences === 1
  && STRIKE_SHELL_M === 0.635 && HEADER_MIN_HEIGHT === 1.35;

/**
 * ⭐⭐ BK-T4 §RIDER's OWN ANCHOR — the STRIKE LEAD the priced aim now mirrors. Both named
 * strike bodies carry the SAME statement, and the fraction the seam exports is READ OFF it.
 */
const STRIKE_LEAD_LINE = '  const lead = add(mate.pos, scale(mate.vel, flight0 * 0.7));';
const A_STRIKE_LEAD = anchor(MECH_PATH, MECH_SRC, STRIKE_LEAD_LINE);
const leadFractionOffTheLine = Number(/flight0 \* ([\d.]+)\)/.exec(STRIKE_LEAD_LINE)![1]);
const LEAD_ANCHORED_OK = A_STRIKE_LEAD.occurrences === 2
  && ['performLoftedPass', 'performKeeperThrow'].every((fn) => {
    const b = namedFnBody(MECH_SRC, fn);
    return b !== null && countOf(b.body, STRIKE_LEAD_LINE.trim()) === 1
      && countOf(b.body, 'const flight0 = clamp(') === 1;
  })
  && leadFractionOffTheLine === BK_CORRIDOR_LEAD_FLIGHT_FRACTION;

/** ⭐ THE WEIGHT LADDER'S OWN SOURCE — the gene's domain, anchored, file bytes hashed */
const A_GENE_CLAMP = anchor(GENOME_PATH, GENOME_SRC, 'export function dvExposureWeightOf(g: TacticalGenome): number {');
const A_GENE_DOMAIN = anchor(GENOME_PATH, GENOME_SRC, 'return clamp01(v);');
const A_GENE_MUTATION = anchor(
  GENOME_PATH, GENOME_SRC,
  '      out.dvExposureWeight = clamp01((out.dvExposureWeight ?? 0) + rng.gaussian() * scale);',
);
const A_EVOLVE_OPT_IN = anchor(GENOME_PATH, GENOME_SRC, '  if (opts.evolveDeliveryValue === true) {');
const A_EVOLVE_MUTATED_LAW = anchor(
  EVOLVE_PATH, EVOLVE_SRC,
  '      coach.genome = mutateGenome(coach.genome, rng, { rate: 0.4, scale: 0.08 });',
);
const A_EVOLVE_REBORN_LAW = anchor(
  EVOLVE_PATH, EVOLVE_SRC,
  '        crossoverGenomes(pa.coach.genome, pb.coach.genome, rng), rng, { rate: 0.5, scale: 0.15 },',
);
const GENOME_SHA = sha(GENOME_SRC);
const SEAT_SHA = sha(SEAT_SRC);
const BRAIN_SHA = sha(BRAIN_SRC);
const MATCH_SHA = sha(MATCH_SRC);
const MECH_SHA = sha(MECH_SRC);
const EVOLVE_SHA = sha(EVOLVE_SRC);
/**
 * ⭐⭐ THE RUNGS ARE THE GENE'S OWN DOMAIN QUARTERS — {0, .25, .5, .75, 1}, ALL of them.
 * The domain is `dvExposureWeightOf`'s own `clamp01` (anchored above); the quarters are the
 * domain's own even division, so no rung is a taste constant and no subset is argued.
 * Rung 0 is the CONTROL: flag absent, gene born absent.
 */
const RUNG_QUARTERS = 4;
const RUNGS: readonly number[] = Array.from(
  { length: RUNG_QUARTERS + 1 }, (_, i) => i / RUNG_QUARTERS,
);
const CONTROL_RUNG = 0;
const RUNGS_OK = A_GENE_CLAMP.occurrences === 1 && A_GENE_DOMAIN.occurrences >= 1
  && A_GENE_MUTATION.occurrences === 1 && A_EVOLVE_OPT_IN.occurrences === 1
  && A_EVOLVE_MUTATED_LAW.occurrences === 1 && A_EVOLVE_REBORN_LAW.occurrences === 1
  && RUNGS.length === 5 && RUNGS[0] === 0 && RUNGS[RUNGS.length - 1] === 1
  && RUNGS.every((r) => r >= 0 && r <= 1);

/** ⭐⭐ THE FOUR PRICED SITES, anchored — three LED (BK-T4's rider), the dink at its point */
const A_SITE_SWITCH = anchor(BRAIN_PATH, BRAIN_SRC, 'sL -= bkCorridorPriceLed(bkSeat, p.pos, mate, opp.players, BK_CORRIDOR_FAMILIES.loft);');
const A_SITE_DINK = anchor(BRAIN_PATH, BRAIN_SRC, 'sC -= bkCorridorPriceOf(bkSeat, p.pos, point, opp.players, BK_CORRIDOR_FAMILIES.dink);');
const A_SITE_THROW = anchor(BRAIN_PATH, BRAIN_SRC, 'sT -= bkCorridorPriceLed(bkSeat, p.pos, mate, opp.players, BK_CORRIDOR_FAMILIES.keeperThrow);');
const A_SITE_PUNT = anchor(BRAIN_PATH, BRAIN_SRC, 'sP -= bkCorridorPriceLed(bkSeat, p.pos, puntMate, opp.players, BK_CORRIDOR_FAMILIES.loft);');
const A_FORK = anchor(BRAIN_PATH, BRAIN_SRC, 'const bkSeat = match.bkCorridorPrice ? deliveryValueSeatOf(g) : null;');
const SITES_OK = [A_SITE_SWITCH, A_SITE_DINK, A_SITE_THROW, A_SITE_PUNT, A_FORK]
  .every((a) => a.occurrences === 1);

/** ⭐⭐ THE WALK-SIDE PREDICATES' SOURCE ANCHORS (their FIXTURES are §3b) */
const A_GK_BLOCK = anchor(BRAIN_PATH, BRAIN_SRC, "if (p.role === 'GK' && p.gkDistributing && p.kickCooldown <= 0) {");
const A_THROW_RANGE = anchor(BRAIN_PATH, BRAIN_SRC, 'if (d < 8 || d > 30) continue;');
const A_PUNT_RANGE = anchor(BRAIN_PATH, BRAIN_SRC, 'if (d < 24) continue;');
const A_SWITCH_RANGE = anchor(BRAIN_PATH, BRAIN_SRC, 'if (d > 24 && !layingOff) {');
const A_DINK_RUNNER = anchor(BRAIN_PATH, BRAIN_SRC, "if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;");
const A_DINK_PEN = anchor(BRAIN_PATH, BRAIN_SRC, 'if (team.localX(point.x) < localX + 5) continue; // must genuinely penetrate');
const A_DINK_LANE = anchor(BRAIN_PATH, BRAIN_SRC, 'if (lane < 0.45) {');
const A_LAYOFF = anchor(BRAIN_PATH, BRAIN_SRC, "const layingOff = p.action.type === 'HoldUp'; // pivot lay-off (Phase 28)");
const PREDICATE_ANCHORS = [A_GK_BLOCK, A_THROW_RANGE, A_PUNT_RANGE, A_SWITCH_RANGE,
  A_DINK_RUNNER, A_DINK_PEN, A_DINK_LANE, A_LAYOFF];
const PREDICATES_OK = PREDICATE_ANCHORS.every((a) => a.occurrences === 1);
const num1 = (a: Anchor, re: RegExp): number => {
  const m = re.exec(a.needle);
  return m === null ? Number.NaN : Number(m[1]);
};
const THROW_MIN_M = num1(A_THROW_RANGE, /d < (\d+)/);
const THROW_MAX_M = num1(A_THROW_RANGE, /d > (\d+)/);
const PUNT_MIN_M = num1(A_PUNT_RANGE, /d < (\d+)/);
const SWITCH_MIN_M = num1(A_SWITCH_RANGE, /d > (\d+)/);
const DINK_PEN_M = num1(A_DINK_PEN, /localX \+ (\d+)/);
const DINK_LANE_MAX = num1(A_DINK_LANE, /lane < ([\d.]+)/);

/* ========================================================================== */
/* §2 THE WORLD-DOSE SOURCES AND THE LINKAGE FACE — bytes hashed BEFORE parsing */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const BKT2_PATH = 'docs/world-model/data/bk-t2-composition-exam.json';
const BKC1_PATH = 'docs/world-model/data/bk-c1-distribution-census.json';
const BKT3_PATH = 'docs/world-model/data/bk-t3-corridor-receipts.RED.json';
const L3_BYTES = readFileSync(L3_T1_PATH, 'utf8');
const L3_BYTES_SHA = sha(L3_BYTES);
const L3_DOSE: L3DoseCell[] = poolT1DoseCells(JSON.parse(L3_BYTES) as Record<string, unknown>);
const PC_BYTES = readFileSync(PC_T1_PATH, 'utf8');
const PC_BYTES_SHA = sha(PC_BYTES);
const PC_DOSE: readonly (readonly number[])[] = poolPcDoseTable(
  JSON.parse(PC_BYTES) as Record<string, unknown>,
);
const BKT2_BYTES = readFileSync(BKT2_PATH, 'utf8');
const BKT2_BYTES_SHA = sha(BKT2_BYTES);
const BKT2_JSON = JSON.parse(BKT2_BYTES) as {
  faces?: { face: string; base: { point: number }; armed: { point: number };
    delta: number; deltaCi95: [number, number]; absDeltaOverHalfWidth: number }[];
};
const q06BkT2 = (() => {
  const f = (BKT2_JSON.faces ?? []).find((x) => x.face === 'ryiQ06PassCompletion');
  return f === undefined ? null : {
    face: f.face, base: f.base.point, armed: f.armed.point, delta: f.delta,
    deltaCi95: f.deltaCi95, absDeltaOverHalfWidth: f.absDeltaOverHalfWidth,
  };
})();
const BKC1_BYTES = readFileSync(BKC1_PATH, 'utf8');
const BKC1_BYTES_SHA = sha(BKC1_BYTES);
const BKC1_JSON = JSON.parse(BKC1_BYTES) as {
  faces?: { face: string; value: number; numerator: number; denominator: number }[];
};
const bkc1Face = (k: string): { value: number; numerator: number; denominator: number } | null => {
  const f = (BKC1_JSON.faces ?? []).find((x) => x.face === k);
  return f === undefined ? null : { value: f.value, numerator: f.numerator, denominator: f.denominator };
};
const BKC1_AVAIL = bkc1Face('blockedGkLoftAvailableShare');
/** ⭐ BK-T3's OWN receipts, carried with its bytes hashed — the parent stage this exam scores */
const BKT3_BYTES = readFileSync(BKT3_PATH, 'utf8');
const BKT3_BYTES_SHA = sha(BKT3_BYTES);
const BKT3_JSON = JSON.parse(BKT3_BYTES) as {
  hashedBodySha256?: string;
  faces?: { face: string; arm: string; value: number | null; numerator: number; denominator: number }[];
};
const bkt3Face = (k: string, arm: string): { value: number | null; numerator: number; denominator: number } | null => {
  const f = (BKT3_JSON.faces ?? []).find((x) => x.face === k && x.arm === arm);
  return f === undefined ? null : { value: f.value, numerator: f.numerator, denominator: f.denominator };
};
const SOURCES_OK = L3_DOSE.length > 0 && PC_DOSE.length > 0 && q06BkT2 !== null
  && BKC1_AVAIL !== null && bkt3Face('caromInFlightPerGkRelease', 'shut') !== null;

/* ========================================================================== */
/* §3 THE PRE-REGISTERED CLASSES (BK-C1's / BK-T3's, class for class)          */
/* ========================================================================== */
const DELIVERIES = ['punt', 'loftSwitch', 'cross', 'throw', 'drivenPass', 'clearance',
  'throughLoft', 'throughGround', 'otherRelease'] as const;
type Delivery = (typeof DELIVERIES)[number];
const D: Record<Delivery, number> = Object.fromEntries(
  DELIVERIES.map((d, i) => [d, i]),
) as Record<Delivery, number>;
/** the four LOFTED deliveries this seam prices (the cross is out of scope, by design) */
const PRICED: Delivery[] = ['punt', 'loftSwitch', 'throughLoft', 'throw'];
/** ⛔ THE UNPRICED CONTROLS of H-BK.3(a) — named at §P, never re-picked after sight */
const CONTROLS: Delivery[] = ['cross', 'drivenPass'];
const FAMILY_OF: Partial<Record<Delivery, keyof typeof BK_CORRIDOR_FAMILIES>> = {
  punt: 'loft', loftSwitch: 'loft', throughLoft: 'dink', throw: 'keeperThrow',
};
/** R9's own window and retire cap, reused (BK-C1 §3) */
const CHAIN_WINDOW_TICKS = 240;
const CHAIN_RETIRE_TICKS = 720;
const PRICE_BINS = 10;
const PRESS_BIN_M = 2;
const PRESS_BINS = 8;
const FAMILY_KEYS = ['loft', 'keeperThrow', 'dink'] as const;

/* -------------------------------------------------------------------------- */
/* §3a THE WALK-SIDE PREDICATES — PURE functions, called by the walk AND §3b   */
/* -------------------------------------------------------------------------- */
/**
 * CANON, REFINED at #334 item 2: "anchored extraction protects the source line; a
 * headline-bearing walk-side predicate ALSO needs a composition fixture". Every predicate
 * that decides what a published face COUNTS lives here as a pure function, and every one of
 * them is exercised by the fixture table in §3b — so a faithful-today transcription cannot
 * drift a headline silently.
 */
/** the hazard-histogram bin of a price/hazard in [0,1] */
const priceBin = (v: number): number => Math.min(PRICE_BINS - 1, Math.max(0, Math.floor(v * 10)));
/** presser distance at launch, METRES: 8 bins × 2 m, the last bin holds ≥ 14 m (BK-C1's) */
const pressBin = (m: number): number => Math.min(PRESS_BINS - 1, Math.max(0, Math.floor(m / PRESS_BIN_M)));
/** the RELEASE → DELIVERY classifier (BK-C1's own action/GK/vz ladder) */
const deliveryOf = (
  action: string, isGk: boolean, gkDistributing: boolean, vz0: number,
): Delivery => {
  const raw: Delivery = action === 'LoftedPass'
    ? (isGk && gkDistributing ? 'punt' : 'loftSwitch')
    : action === 'ThrowOut' ? 'throw'
      : action === 'Cross' ? 'cross'
        : action === 'ClearBall' ? 'clearance'
          : action === 'ThroughBall' ? 'throughLoft'
            : action === 'Pass' ? 'drivenPass'
              : 'otherRelease';
  return raw === 'throughLoft' && !(vz0 > 0) ? 'throughGround' : raw;
};
/** BLOCKED SHORT OF THE TARGET — BK-C1 §4(ii)'s face of record, definition for definition */
const blockedShortOf = (
  inFlight: boolean, contactGid: number, targetGid: number | null,
  alongM: number, designD: number,
): boolean => inFlight && contactGid !== targetGid && alongM < designD - STRIKE_SHELL_M;
/** ⭐⭐ R6's INSTANTIABILITY — each conjunct the shipped chooser's OWN gating line */
interface InstantiableInput {
  gkDistributing: boolean; layingOff: boolean; d: number;
  targetIsRunner: boolean; targetPenetrates: boolean; targetLane: number;
}
const instantiableOf = (family: (typeof FAMILY_KEYS)[number], L: InstantiableInput): boolean => (
  family === 'keeperThrow'
    ? (L.gkDistributing && L.d >= THROW_MIN_M && L.d <= THROW_MAX_M)
    : family === 'loft'
      ? ((L.gkDistributing && L.d >= PUNT_MIN_M) || (!L.layingOff && L.d > SWITCH_MIN_M))
      : (L.targetIsRunner && L.targetPenetrates && L.targetLane < DINK_LANE_MAX));
/**
 * R9's CHAIN STEP — the distribution-carom family's own resolution, one tick at a time.
 * A chain counts a CAROM when the RELEASING keeper regains ownership inside the 240-tick
 * window having seen no team-mate and no opponent owner in between.
 */
interface ChainState {
  releaseTick: number; gid: number; resolved: boolean;
  sawTeammateOwner: boolean; sawOppOwner: boolean;
  carom: boolean;
}
interface ChainEvent {
  tick: number; ownerGid: number | null; prevOwnerGid: number | null; ownerSameSide: boolean;
}
const stepChain = (c: ChainState, ev: ChainEvent): ChainState => {
  if (c.resolved) return c;
  const age = ev.tick - c.releaseTick;
  if (age > CHAIN_RETIRE_TICKS) return { ...c, resolved: true };
  if (ev.ownerGid !== null && ev.ownerGid !== ev.prevOwnerGid) {
    if (ev.ownerGid === c.gid && ev.prevOwnerGid !== c.gid) {
      const carom = age <= CHAIN_WINDOW_TICKS && !c.sawTeammateOwner && !c.sawOppOwner;
      return { ...c, resolved: true, carom };
    }
    return ev.ownerSameSide
      ? { ...c, sawTeammateOwner: true } : { ...c, sawOppOwner: true };
  }
  return c;
};

/* -------------------------------------------------------------------------- */
/* §3b THE COMPOSITION FIXTURES — one per walk-side predicate (#334 item 2)     */
/* -------------------------------------------------------------------------- */
interface Fixture { name: string; got: unknown; want: unknown }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got: JSON.parse(JSON.stringify(got)) as unknown, want });
};
/* priceBin — the hazard histogram's own edges */
fx('priceBin.zero', priceBin(0), 0);
fx('priceBin.justUnderEdge', priceBin(0.0999), 0);
fx('priceBin.edge', priceBin(0.1), 1);
fx('priceBin.one', priceBin(1), PRICE_BINS - 1);
/* pressBin — 2 m bins, the last one holds everything ≥ 14 m */
fx('pressBin.0m', pressBin(0), 0);
fx('pressBin.1.99m', pressBin(1.99), 0);
fx('pressBin.2m', pressBin(2), 1);
fx('pressBin.13.99m', pressBin(13.99), 6);
fx('pressBin.14m', pressBin(14), PRESS_BINS - 1);
fx('pressBin.60m', pressBin(60), PRESS_BINS - 1);
/* deliveryOf — every branch, including the punt/switch split and the ground dink */
fx('deliveryOf.puntNeedsGkDistributing', deliveryOf('LoftedPass', true, true, 6), 'punt');
fx('deliveryOf.gkNotDistributingIsSwitch', deliveryOf('LoftedPass', true, false, 6), 'loftSwitch');
fx('deliveryOf.outfieldLoftIsSwitch', deliveryOf('LoftedPass', false, true, 6), 'loftSwitch');
fx('deliveryOf.throw', deliveryOf('ThrowOut', true, true, 3), 'throw');
fx('deliveryOf.cross', deliveryOf('Cross', false, false, 5), 'cross');
fx('deliveryOf.clearance', deliveryOf('ClearBall', false, false, 5), 'clearance');
fx('deliveryOf.dinkAloft', deliveryOf('ThroughBall', false, false, 4), 'throughLoft');
fx('deliveryOf.dinkGrounded', deliveryOf('ThroughBall', false, false, 0), 'throughGround');
fx('deliveryOf.drivenPass', deliveryOf('Pass', false, false, 0), 'drivenPass');
fx('deliveryOf.other', deliveryOf('HoldUp', false, false, 0), 'otherRelease');
/* blockedShortOf — in flight, not the target, short of the target's own shell */
fx('blocked.shortOfTargetInFlight', blockedShortOf(true, 7, 3, 10, 30), true);
fx('blocked.notInFlight', blockedShortOf(false, 7, 3, 10, 30), false);
fx('blocked.isTheTarget', blockedShortOf(true, 3, 3, 10, 30), false);
fx('blocked.atTheTargetsShell', blockedShortOf(true, 7, 3, 30 - STRIKE_SHELL_M, 30), false);
fx('blocked.justInsideTheShell', blockedShortOf(true, 7, 3, 30 - STRIKE_SHELL_M - 0.001, 30), true);
fx('blocked.noTargetKnown', blockedShortOf(true, 7, null, 10, 30), true);
/* instantiableOf — each family's own shipped gating line */
const instBase: InstantiableInput = {
  gkDistributing: false, layingOff: false, d: 20,
  targetIsRunner: false, targetPenetrates: false, targetLane: 0.9,
};
fx('inst.throwNeedsGk', instantiableOf('keeperThrow', instBase), false);
fx('inst.throwInBand', instantiableOf('keeperThrow', { ...instBase, gkDistributing: true }), true);
fx('inst.throwBelowBand', instantiableOf('keeperThrow', { ...instBase, gkDistributing: true, d: THROW_MIN_M - 0.01 }), false);
fx('inst.throwAboveBand', instantiableOf('keeperThrow', { ...instBase, gkDistributing: true, d: THROW_MAX_M + 0.01 }), false);
fx('inst.puntNeedsRange', instantiableOf('loft', { ...instBase, gkDistributing: true, d: PUNT_MIN_M - 0.01 }), false);
fx('inst.puntAtRange', instantiableOf('loft', { ...instBase, gkDistributing: true, d: PUNT_MIN_M }), true);
fx('inst.switchAtRange', instantiableOf('loft', { ...instBase, d: SWITCH_MIN_M + 0.01 }), true);
fx('inst.switchAtTheLine', instantiableOf('loft', { ...instBase, d: SWITCH_MIN_M }), false);
fx('inst.switchWhileLayingOff', instantiableOf('loft', { ...instBase, layingOff: true, d: SWITCH_MIN_M + 0.01 }), false);
fx('inst.dinkNeedsRunner', instantiableOf('dink', { ...instBase, targetPenetrates: true, targetLane: 0.1 }), false);
fx('inst.dinkNeedsPenetration', instantiableOf('dink', { ...instBase, targetIsRunner: true, targetLane: 0.1 }), false);
fx('inst.dinkNeedsBlockedLane', instantiableOf('dink', { ...instBase, targetIsRunner: true, targetPenetrates: true, targetLane: DINK_LANE_MAX }), false);
fx('inst.dinkAllThree', instantiableOf('dink', { ...instBase, targetIsRunner: true, targetPenetrates: true, targetLane: DINK_LANE_MAX - 0.01 }), true);
/* stepChain — R9's family, walked on scripted ownership transitions */
const chain0 = (): ChainState => ({
  releaseTick: 100, gid: 5, resolved: false,
  sawTeammateOwner: false, sawOppOwner: false, carom: false,
});
const runChain = (evs: ChainEvent[]): ChainState => evs.reduce(stepChain, chain0());
fx('chain.caromInsideWindow', runChain([
  { tick: 140, ownerGid: 5, prevOwnerGid: null, ownerSameSide: true },
]), { releaseTick: 100, gid: 5, resolved: true, sawTeammateOwner: false, sawOppOwner: false, carom: true });
fx('chain.pastTheWindowIsNoCarom', runChain([
  { tick: 100 + CHAIN_WINDOW_TICKS + 1, ownerGid: 5, prevOwnerGid: null, ownerSameSide: true },
]).carom, false);
fx('chain.teammateFirstIsNoCarom', runChain([
  { tick: 120, ownerGid: 7, prevOwnerGid: null, ownerSameSide: true },
  { tick: 160, ownerGid: 5, prevOwnerGid: 7, ownerSameSide: true },
]).carom, false);
fx('chain.opponentFirstIsNoCarom', runChain([
  { tick: 120, ownerGid: 12, prevOwnerGid: null, ownerSameSide: false },
  { tick: 160, ownerGid: 5, prevOwnerGid: 12, ownerSameSide: false },
]).carom, false);
fx('chain.retiresAfterCap', runChain([
  { tick: 100 + CHAIN_RETIRE_TICKS + 1, ownerGid: null, prevOwnerGid: null, ownerSameSide: false },
]).resolved, true);
fx('chain.unchangedOwnerIsInert', runChain([
  { tick: 120, ownerGid: 9, prevOwnerGid: 9, ownerSameSide: true },
]), { releaseTick: 100, gid: 5, resolved: false, sawTeammateOwner: false, sawOppOwner: false, carom: false });
const FIXTURES_OK = FIXTURES.every((f) => canonical(f.got) === canonical(f.want));
const FIXTURE_FAILURES = FIXTURES.filter((f) => canonical(f.got) !== canonical(f.want))
  .map((f) => f.name);

/* ========================================================================== */
/* §4 THE SHIPPED FLIGHT MODEL, TRANSCRIBED (the reachability rider)          */
/* ========================================================================== */
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
const clearsBody = (
  origin: { x: number; y: number }, dir: { x: number; y: number },
  d: number, T: number, s: number, shell: number,
): boolean => {
  if (!(T > 0) || !(d > 0)) return false;
  const hSpeed = d / T;
  const vz0 = (GRAVITY * T) / 2;
  const r = replayFlight(
    { x: origin.x, y: origin.y, vx: dir.x * hSpeed, vy: dir.y * hSpeed, z: 0, vz: vz0, spin: 0 },
    CHAIN_RETIRE_TICKS,
  );
  const near = s - shell;
  const far = s + shell;
  for (const smp of r.samples) {
    const u = (smp.x - origin.x) * dir.x + (smp.y - origin.y) * dir.y;
    if (u >= near && u <= far && smp.z < HEADER_MIN_HEIGHT) return false;
    if (u > far) break;
  }
  const last = r.samples[r.samples.length - 1];
  const uLast = last === undefined ? 0 : (last.x - origin.x) * dir.x + (last.y - origin.y) * dir.y;
  return uLast > far;
};

/* ========================================================================== */
/* §5 THE WORLD OF RECORD + THE WEIGHT LADDER'S ARMS                          */
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
/**
 * ⭐⭐ THE WEIGHT-SETTING IDIOM, the RATIFIED post-#270.2 form (ORDERED at #334 item 1):
 * bu-t1's `setMtDoseLocal` shape — `baseGenome` and `effGenome` are replaced by MATCH-LOCAL
 * COPIES carrying the weight, and `info.genome` (the FRANCHISE's genome, the thing that
 * serializes and crosses over) is NEVER written. The `gGenomeClean` conjunct measures that.
 */
const setBkWeightLocal = (match: Match, side: Side, weight: number): void => {
  const t = match.teams[side];
  const view = { ...t.baseGenome, dvExposureWeight: weight } as TacticalGenome;
  t.baseGenome = view;
  t.effGenome = view;
};
const buildMatch = (seed: number, rung: number): Match => {
  const m = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(PC_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    ...(rung > CONTROL_RUNG ? { bkCorridorPrice: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  if (rung > CONTROL_RUNG) for (const s of [0, 1] as const) setBkWeightLocal(m, s, rung);
  return m;
};
const infoGenomeOf = (m: Match, s: Side): Record<string, unknown> =>
  m.teams[s].info.genome as unknown as Record<string, unknown>;
const worldConjuncts = (m: Match, rung: number): Record<string, boolean> => {
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
  const seats = m.teams.map((t) => deliveryValueSeatOf(t.effGenome));
  const armed = rung > CONTROL_RUNG;
  return {
    armedVersionIsWorld9: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    corridorDoorMatchesRung: m.bkCorridorPrice === armed,
    geneStateMatchesRung: armed
      ? seats.every((s) => s !== null && s.exposureWeight === rung)
      : seats.every((s) => s === null),
    /** ⭐⭐ THE #334 item 1 CONJUNCT: the franchise genome is CLEAN of the weight, always */
    infoGenomeCleanOfTheWeight: ([0, 1] as const).every((s) => !('dvExposureWeight'
      in infoGenomeOf(m, s))),
  };
};

/* ========================================================================== */
/* §6 THE PER-SEED ROW (per-seed cells — canon, home ruling #282.2(ii))       */
/* ========================================================================== */
interface Row {
  seed: number; rung: number; worldOk: boolean; ticks: number; matches: number;
  /* the price's DISTRIBUTION on the launches actually played (REPORTED) */
  pricedLaunches: number[]; priceFired: number[];
  hazardSum: number[]; priceSum: number[]; priceBins: number[][];
  /* ⭐ THE CORRECTED LIVENESS RECORD (#334 item 4): the price's own EVALUATION census */
  priceEvals: number; priceEvalsNonZero: number; priceEvalHazardSum: number;
  /* the delivery ledger */
  launches: number[]; blocked: number[]; interrupted: number[];
  /* R9's distribution family */
  gkReleases: number; caromWithin240: number; caromInFlight: number;
  /* the presser signature */
  gkLaunchesByPressBin: number[]; gkBlockedByPressBin: number[];
  outLaunchesByPressBin: number[]; outBlockedByPressBin: number[];
  /* Q06 */
  enginePasses: number; enginePassesCompleted: number;
  /* per-family reachability */
  reachBlocked: number;
  reachClears: number[]; reachInstantiable: number[]; reachBoth: number[];
  reachAnyBoth: number; reachAnyClear: number;
  /* the replay cross-check */
  replaySamples: number; replayMaxAbsDiff: number;
}
const emptyRow = (seed: number, rung: number): Row => ({
  seed, rung, worldOk: false, ticks: 0, matches: 1,
  pricedLaunches: zeros(DELIVERIES.length),
  priceFired: zeros(DELIVERIES.length),
  hazardSum: zeros(DELIVERIES.length),
  priceSum: zeros(DELIVERIES.length),
  priceBins: DELIVERIES.map(() => zeros(PRICE_BINS)),
  priceEvals: 0, priceEvalsNonZero: 0, priceEvalHazardSum: 0,
  launches: zeros(DELIVERIES.length),
  blocked: zeros(DELIVERIES.length),
  interrupted: zeros(DELIVERIES.length),
  gkReleases: 0, caromWithin240: 0, caromInFlight: 0,
  gkLaunchesByPressBin: zeros(PRESS_BINS), gkBlockedByPressBin: zeros(PRESS_BINS),
  outLaunchesByPressBin: zeros(PRESS_BINS), outBlockedByPressBin: zeros(PRESS_BINS),
  enginePasses: 0, enginePassesCompleted: 0,
  reachBlocked: 0,
  reachClears: zeros(FAMILY_KEYS.length),
  reachInstantiable: zeros(FAMILY_KEYS.length),
  reachBoth: zeros(FAMILY_KEYS.length),
  reachAnyBoth: 0, reachAnyClear: 0,
  replaySamples: 0, replayMaxAbsDiff: 0,
});

const STAT_KEYS = ['passes', 'longBalls', 'crosses', 'throughBalls', 'cutbacks', 'clearances',
  'shots', 'headersWon'] as const;
type StatKey = (typeof STAT_KEYS)[number];
type Klass = 'shot' | 'headerShot' | 'clearance' | 'headerClearance' | 'cross' | 'cutback'
  | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'headerKnockdown' | 'other';

interface Launch {
  tick: number; gid: number; side: Side; isGk: boolean; delivery: Delivery;
  ox: number; oy: number; dx: number; dy: number; vz0: number; d: number;
  nearestOppM: number; targetGid: number | null;
  live: boolean; landed: boolean;
  firstContactGid: number | null; firstContactAlongM: number;
  firstContactInFlight: boolean; blockedShort: boolean;
  gkDistributing: boolean; layingOff: boolean; targetIsRunner: boolean;
  targetPenetrates: boolean; targetLane: number;
}
interface Chain extends ChainState { launch: Launch | null }
const REPLAY_SAMPLE_KICKS = 6;

const walk = (seed: number, rung: number): Row => {
  const m = buildMatch(seed, rung);
  const row = emptyRow(seed, rung);
  row.worldOk = Object.values(worldConjuncts(m, rung)).every(Boolean);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
  };
  const players = m.allPlayers;
  const N = players.length;
  const preGkDist = new Array<boolean>(N).fill(false);
  const preAction = new Array<string>(N).fill('');
  const snapBodies = (): void => {
    for (let i = 0; i < N; i++) {
      preGkDist[i] = players[i].gkDistributing;
      preAction[i] = players[i].action.type;
    }
  };
  snapBodies();
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  const openLaunches: Launch[] = [];
  const chains: Chain[] = [];
  interface ReplayProbe {
    s0: FlightState; startTick: number; kickerGid: number; live: FlightSample[]; open: boolean;
  }
  const replayProbes: ReplayProbe[] = [];
  let replayKicksTaken = 0;

  while (!m.finished) {
    const prePos = players.map((p) => ({ x: p.pos.x, y: p.pos.y }));
    const preVel = players.map((p) => ({ x: p.vel.x, y: p.vel.y }));
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    const ball = m.ball;
    const ownerGid = ball.owner?.gid ?? null;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const ballIsLive = playing || m.phase === 'restart';

    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ===== RELEASE DETECTION — BK-C1's / R9's ladder, reused ===== */
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

    for (const rel of releasesThisTick) {
      const p = players[rel.gid];
      const isGk = p.role === 'GK';
      if (rel.klass === 'shot' || rel.klass === 'headerShot' || rel.klass === 'headerKnockdown'
        || rel.klass === 'headerClearance') continue;
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0raw = grounded ? 0 : ball.vz + GRAVITY * DT;
      if (hSpeedNow < 1e-6) continue;
      const delivery = deliveryOf(p.action.type, isGk, preGkDist[rel.gid], vz0raw);
      const vz0 = vz0raw;
      const ox = ball.pos.x - ball.vel.x * DT;
      const oy = ball.pos.y - ball.vel.y * DT;
      const dxu = ball.vel.x / hSpeedNow;
      const dyu = ball.vel.y / hSpeedNow;
      const rep = replayFlight(
        { x: ox, y: oy, vx: ball.vel.x, vy: ball.vel.y, z: 0, vz: vz0, spin: ball.spin },
        CHAIN_RETIRE_TICKS,
      );
      const dLand = Math.hypot(rep.landedX - ox, rep.landedY - oy);
      const opp = m.teams[1 - p.side];
      const own = m.teams[p.side];
      let nearest = Number.POSITIVE_INFINITY;
      for (const o of opp.players) {
        if (o.sentOff) continue;
        const dd = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
        if (dd < nearest) nearest = dd;
      }
      const di = D[delivery];
      row.launches[di]++;
      const pb = pressBin(Number.isFinite(nearest) ? nearest : PRESS_BINS * PRESS_BIN_M);
      if (isGk) row.gkLaunchesByPressBin[pb]++; else row.outLaunchesByPressBin[pb]++;
      const targetGid = (mm.pendingPass !== null && mm.pendingPass.passerGid === rel.gid)
        ? mm.pendingPass.targetGid : null;

      /* ===== THE PRICE ON THE LAUNCHES ACTUALLY PLAYED (reported) ===== */
      const famKey = FAMILY_OF[delivery];
      const seat = deliveryValueSeatOf(m.teams[p.side].effGenome);
      if (famKey !== undefined && vz0 > 0 && targetGid !== null) {
        const from = prePos[rel.gid];
        const fam = BK_CORRIDOR_FAMILIES[famKey];
        /** ⭐ the LED aim for the three led choosers, the point itself for the dink */
        const target = { pos: prePos[targetGid], vel: preVel[targetGid] };
        const led = delivery !== 'throughLoft';
        const aim = led ? bkCorridorLeadAim(from, target, fam) : prePos[targetGid];
        const hazard = bkCorridorHazard(from, aim, opp.players, fam);
        const price = seat === null ? 0
          : led ? bkCorridorPriceLed(seat, from, target, opp.players, fam)
            : bkCorridorPriceOf(seat, from, aim, opp.players, fam);
        row.pricedLaunches[di]++;
        if (hazard > 0) row.priceFired[di]++;
        row.hazardSum[di] += hazard;
        row.priceSum[di] += price;
        row.priceBins[di][priceBin(hazard)]++;
      }

      /* ===== ⭐⭐ THE EVALUATION CENSUS — the CORRECTED liveness record (#334 item 4) =====
       * The gate must read whether a NON-ZERO hazard was ever COMPUTED inside an armed
       * decision, never whether the SURVIVING launches still carry one ("a chooser that has
       * learned to avoid bodies makes the second one false by succeeding"). So at every
       * release tick this evaluates the SHIPPED price over the releasing player's own
       * team-mate set × the three priced families, at the LED aim the choosers now use.
       * ⚠ DECLARED: this mate set is a SUPERSET of the chooser's own candidate set at that
       * tick (the range/state gates are not applied) — it is a LIVENESS census of the price
       * function inside the armed world, not a model of the argmax.
       */
      if (seat !== null) {
        const from = prePos[rel.gid];
        for (const mate of own.players) {
          if (mate === p || mate.sentOff) continue;
          const target = { pos: prePos[mate.gid], vel: preVel[mate.gid] };
          for (const fk of FAMILY_KEYS) {
            const fam = BK_CORRIDOR_FAMILIES[fk];
            const h = bkCorridorHazard(
              from, bkCorridorLeadAim(from, target, fam), opp.players, fam,
            );
            row.priceEvals++;
            if (h > 0) row.priceEvalsNonZero++;
            row.priceEvalHazardSum += h;
          }
        }
      }

      const targetP = targetGid === null ? null : players[targetGid];
      const teamOf = m.teams[p.side];
      const launch: Launch = {
        tick, gid: rel.gid, side: p.side as Side, isGk, delivery,
        ox, oy, dx: dxu, dy: dyu, vz0, d: dLand,
        nearestOppM: Number.isFinite(nearest) ? nearest : Number.NaN,
        targetGid, live: true, landed: false,
        firstContactGid: null, firstContactAlongM: Number.NaN,
        firstContactInFlight: false, blockedShort: false,
        gkDistributing: preGkDist[rel.gid],
        layingOff: preAction[rel.gid] === 'HoldUp',
        targetIsRunner: targetP !== null && preAction[targetP.gid] === 'MakeRun',
        targetPenetrates: targetP !== null
          && teamOf.localX(prePos[targetP.gid].x) >= teamOf.localX(prePos[rel.gid].x) + DINK_PEN_M,
        targetLane: targetP === null ? Number.NaN
          : laneOpenness(prePos[rel.gid], prePos[targetP.gid], opp.players),
      };
      openLaunches.push(launch);
      if (vz0 > 0 && replayKicksTaken < REPLAY_SAMPLE_KICKS) {
        replayKicksTaken++;
        replayProbes.push({
          s0: { x: ball.pos.x, y: ball.pos.y, vx: ball.vel.x, vy: ball.vel.y, z: ball.z, vz: ball.vz, spin: ball.spin },
          startTick: tick, kickerGid: rel.gid, live: [], open: true,
        });
      }
      if (isGk && playing) {
        row.gkReleases++;
        chains.push({
          releaseTick: tick, gid: rel.gid, resolved: false, sawTeammateOwner: false,
          sawOppOwner: false, carom: false, launch,
        });
      }
    }

    /* ===== the replay cross-check ===== */
    for (const probe of replayProbes) {
      if (!probe.open || tick === probe.startTick) continue;
      if (ball.owner !== null || lastTouchGid !== probe.kickerGid
        || (ball.z === 0 && ball.vz === 0) || probe.live.length >= 24) { probe.open = false; continue; }
      probe.live.push({ tick: probe.live.length + 1, x: ball.pos.x, y: ball.pos.y, z: ball.z });
    }

    /* ===== live flight tracking — the block ledger ===== */
    for (const L of openLaunches) {
      if (!L.live) continue;
      if (L.tick === tick) continue;
      const contactGid = (lastTouchGid !== null && lastTouchGid !== prevLastTouchGid)
        ? lastTouchGid
        : (ownerGid !== null && ownerGid !== prevOwnerGid && ownerGid !== L.gid ? ownerGid : null);
      if (!(ball.z > 0 || ball.vz !== 0)) L.landed = true;
      if (contactGid !== null && contactGid !== L.gid && L.firstContactGid === null) {
        L.firstContactGid = contactGid;
        const bp = players[contactGid].pos;
        L.firstContactAlongM = (bp.x - L.ox) * L.dx + (bp.y - L.oy) * L.dy;
        L.firstContactInFlight = !L.landed;
        L.blockedShort = blockedShortOf(
          L.firstContactInFlight, contactGid, L.targetGid, L.firstContactAlongM, L.d,
        );
        L.live = false;
        const di = D[L.delivery];
        if (L.firstContactInFlight) row.interrupted[di]++;
        if (L.blockedShort) {
          row.blocked[di]++;
          const pb = pressBin(Number.isFinite(L.nearestOppM) ? L.nearestOppM : PRESS_BINS * PRESS_BIN_M);
          if (L.isGk) row.gkBlockedByPressBin[pb]++; else row.outBlockedByPressBin[pb]++;
          /* ===== PER-FAMILY REACHABILITY, at EVERY rung ===== */
          if (L.isGk && L.vz0 > 0) {
            row.reachBlocked++;
            const s = Math.max(0, L.firstContactAlongM);
            const origin = { x: L.ox, y: L.oy };
            const dir = { x: L.dx, y: L.dy };
            let anyClear = false;
            let anyBoth = false;
            for (let fi = 0; fi < FAMILY_KEYS.length; fi++) {
              const fam = BK_CORRIDOR_FAMILIES[FAMILY_KEYS[fi]];
              const T = bkCorridorFlightOf(fam, L.d).T;
              const clears = clearsBody(origin, dir, L.d, T, s, STRIKE_SHELL_M);
              const instantiable = instantiableOf(FAMILY_KEYS[fi], L);
              if (clears) { row.reachClears[fi]++; anyClear = true; }
              if (instantiable) row.reachInstantiable[fi]++;
              if (clears && instantiable) { row.reachBoth[fi]++; anyBoth = true; }
            }
            if (anyClear) row.reachAnyClear++;
            if (anyBoth) row.reachAnyBoth++;
          }
        }
      }
    }

    /* ===== R9's chain resolution, through the PURE stepper ===== */
    for (let ci = 0; ci < chains.length; ci++) {
      const c = chains[ci];
      if (c.resolved) continue;
      const ev: ChainEvent = {
        tick, ownerGid, prevOwnerGid,
        ownerSameSide: ownerGid !== null && players[ownerGid].side === players[c.gid].side,
      };
      const next = stepChain(c, ev) as Chain;
      next.launch = c.launch;
      chains[ci] = next;
      if (next.carom && !c.carom) {
        row.caromWithin240++;
        if (next.launch !== null && next.launch.firstContactInFlight) row.caromInFlight++;
      }
    }

    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
    snapBodies();
  }

  for (const probe of replayProbes) {
    const rep = replayFlight(probe.s0, 64);
    for (const lv of probe.live) {
      const sim = rep.samples[lv.tick - 1];
      if (sim === undefined) break;
      row.replaySamples++;
      const diff = Math.max(Math.abs(sim.x - lv.x), Math.abs(sim.y - lv.y), Math.abs(sim.z - lv.z));
      if (diff > row.replayMaxAbsDiff) row.replayMaxAbsDiff = diff;
    }
  }
  row.enginePasses = m.teams[0].stats.passes + m.teams[1].stats.passes;
  row.enginePassesCompleted = m.teams[0].stats.passesCompleted + m.teams[1].stats.passesCompleted;
  return row;
};

/* ========================================================================== */
/* §7 THE BATTERY                                                             */
/* ========================================================================== */
const BLOCK_BASE = 12_520_000;
const N_SEEDS = N_ENV ?? (MODE === 'smoke' ? 2 : 60);
const SMOKE_PREFIX = [12_520_800, 12_520_801, 12_520_802];
const RECEIPT_SEED = 12_520_999;
const BATTERY_SEEDS = MODE === 'smoke'
  ? SMOKE_PREFIX.slice(0, N_SEEDS)
  : Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i);
const rows: Row[] = [];
for (const seed of BATTERY_SEEDS) {
  for (const rung of RUNGS) rows.push(walk(seed, rung));
}
const receiptConjuncts = Object.fromEntries(RUNGS.map((rung) => [
  String(rung), worldConjuncts(buildMatch(RECEIPT_SEED, rung), rung),
]));
const batteryWallSec = round((Date.now() - t0Wall) / 1000, 3);

/* ========================================================================== */
/* §8 THE FACES — every one re-derived from the per-seed cells                 */
/* ========================================================================== */
const rungRows = (rung: number): Row[] => rows.filter((r) => r.rung === rung);
interface FaceDef {
  num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string;
}
const FACES: Record<string, FaceDef> = {};
const addFace = (key: string, def: FaceDef): void => { FACES[key] = def; };
/** ⭐ THE GATED FACES of H-BK.3, named at §P before the battery */
const FACE_CAROM = 'caromInFlightPerGkRelease';
const FACE_VOLUME_POOLED = 'loftedLaunchesPerMatch_pooled';
const controlFaceOf = (dv: Delivery): string => `blockedShortShare_${dv}`;
const volumeFaceOf = (dv: Delivery): string => `loftedLaunchesPerMatch_${dv}`;

for (let i = 0; i < DELIVERIES.length; i++) {
  const dv = DELIVERIES[i];
  addFace(controlFaceOf(dv), {
    num: (r) => r.blocked[i], den: (r) => r.launches[i],
    unit: 'share of launches blocked short of target',
    what: `blocked-short share for ${dv} (BK-C1 §4(ii)'s face of record)`
      + `${CONTROLS.includes(dv) ? ' — ⛔ AN UNPRICED CONTROL of H-BK.3(a)' : ''}`,
  });
  if (PRICED.includes(dv)) {
    addFace(volumeFaceOf(dv), {
      num: (r) => r.launches[i], den: (r) => r.matches,
      unit: 'launches per match (the engine\'s own 240 s match clock)',
      what: `⭐ H-BK.3(b) — ${dv} VOLUME: does the chooser still play this delivery`,
    });
    addFace(`priceFiredShare_${dv}`, {
      num: (r) => r.priceFired[i], den: (r) => r.pricedLaunches[i],
      unit: 'share of played lofted launches whose corridor hazard was non-zero',
      what: `REPORTED — the residual hazard on ${dv}'s PLAYED launches (⚠ NOT a liveness gate: #334 item 4)`,
    });
    addFace(`meanHazard_${dv}`, {
      num: (r) => r.hazardSum[i], den: (r) => r.pricedLaunches[i],
      unit: 'mean corridor hazard in [0,1] per played lofted launch',
      what: `REPORTED — the hazard's mean on ${dv} (the price is this rung's weight × this)`,
    });
    addFace(`meanPrice_${dv}`, {
      num: (r) => r.priceSum[i], den: (r) => r.pricedLaunches[i],
      unit: 'mean subtracted score units per played lofted launch',
      what: `REPORTED — the PRICE actually subtracted on ${dv} at this rung`,
    });
  }
}
addFace(FACE_VOLUME_POOLED, {
  num: (r) => sum(PRICED.map((dv) => r.launches[D[dv]])), den: (r) => r.matches,
  unit: 'lofted launches per match, pooled over the four priced deliveries',
  what: '⭐⭐ H-BK.3(b)\'s POOLED VOLUME — re-aim (volume holds) vs suppress (volume collapses)',
});
addFace('caromWithin240PerGkRelease', {
  num: (r) => r.caromWithin240, den: (r) => r.gkReleases,
  unit: 'returns to the releasing keeper per GK release',
  what: 'R9\'s distribution family, window and class reused',
});
addFace(FACE_CAROM, {
  num: (r) => r.caromInFlight, den: (r) => r.gkReleases,
  unit: 'in-flight-contact caroms per GK release',
  what: '⭐⭐ H-BK.3(a)\'s FACE — the user\'s exact #328 pattern (R9\'s chain family, '
    + 'BK-C1/BK-T3\'s face, reused verbatim)',
});
addFace('q06PassCompletion', {
  num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
  unit: 'share of passes completed',
  what: 'REPORTED — Q06, BK-T2\'s own definition: Σ passesCompleted / Σ passes, both teams',
});
addFace('priceEvalNonZeroShare', {
  num: (r) => r.priceEvalsNonZero, den: (r) => r.priceEvals,
  unit: 'share of the price\'s EVALUATIONS inside armed decisions that were non-zero',
  what: '⭐⭐ the CORRECTED liveness record (#334 item 4) — gated by gPriceFires',
});
addFace('priceEvalMeanHazard', {
  num: (r) => r.priceEvalHazardSum, den: (r) => r.priceEvals,
  unit: 'mean corridor hazard in [0,1] per evaluation inside an armed decision',
  what: 'REPORTED — the hazard the armed chooser SEES across its own mate set',
});
addFace('reachAnyClearShare', {
  num: (r) => r.reachAnyClear, den: (r) => r.reachBlocked,
  unit: 'share of blocked GK lofted launches with ≥1 CLEARING family',
  what: 'REPORTED — BK-C1\'s EXISTENTIAL availability, recomputed per rung',
});
addFace('reachAnyReachableShare', {
  num: (r) => r.reachAnyBoth, den: (r) => r.reachBlocked,
  unit: 'share of blocked GK lofted launches with ≥1 clearing AND INSTANTIABLE family',
  what: '⭐ REPORTED — the CHOOSER-AGENCY grain BK-C1 §CORR 1 ordered, per rung',
});
for (let fi = 0; fi < FAMILY_KEYS.length; fi++) {
  addFace(`reachClearShare_${FAMILY_KEYS[fi]}`, {
    num: (r) => r.reachClears[fi], den: (r) => r.reachBlocked,
    unit: 'share of blocked GK lofted launches this family would have cleared',
    what: `REPORTED — per-family CLEARING share (${FAMILY_KEYS[fi]})`,
  });
  addFace(`reachInstantiableShare_${FAMILY_KEYS[fi]}`, {
    num: (r) => r.reachInstantiable[fi], den: (r) => r.reachBlocked,
    unit: 'share of blocked GK lofted launches at which this family was instantiable',
    what: `REPORTED — per-family INSTANTIABILITY share (${FAMILY_KEYS[fi]})`,
  });
  addFace(`reachBothShare_${FAMILY_KEYS[fi]}`, {
    num: (r) => r.reachBoth[fi], den: (r) => r.reachBlocked,
    unit: 'share of blocked GK lofted launches this family both cleared and could be played',
    what: `⭐ REPORTED — per-family REACHABILITY (${FAMILY_KEYS[fi]})`,
  });
}
const FACE_KEYS = Object.keys(FACES).sort();

/** the percentile bootstrap over WALKED seeds (consumes NO registry statistic) */
const BOOT_DRAWS = 2000;
const BOOT_SEED = RECEIPT_SEED;
const bootCi = (rs: Row[], def: FaceDef): [number, number] => {
  if (rs.length === 0) return [Number.NaN, Number.NaN];
  const rng = new Rng(BOOT_SEED);
  const vals: number[] = [];
  for (let b = 0; b < BOOT_DRAWS; b++) {
    let n = 0;
    let d0 = 0;
    for (let i = 0; i < rs.length; i++) {
      const r = rs[Math.floor(rng.next() * rs.length) % rs.length];
      n += def.num(r);
      d0 += def.den(r);
    }
    vals.push(ratio(n, d0));
  }
  const ok = vals.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  if (ok.length === 0) return [Number.NaN, Number.NaN];
  const at = (q: number): number => ok[Math.min(ok.length - 1, Math.max(0, Math.floor(q * ok.length)))];
  return [round(at(0.025), 6), round(at(0.975), 6)];
};
/**
 * ⭐⭐ THE PAIRED Δ INTERVAL — the SAME seed at two rungs is one pair, so the bootstrap
 * resamples SEEDS (not walks) and re-derives the ratio at both rungs inside each draw.
 * A rung "FALLS RESOLVEDLY" ⇔ this interval lies ENTIRELY BELOW ZERO.
 */
const bootPairedDelta = (
  rung: number, def: FaceDef,
): { delta: number; ci95: [number, number]; halfWidth: number; absDeltaOverHalfWidth: number } => {
  const seeds = BATTERY_SEEDS;
  const at = (s: number, rr: number): Row | undefined =>
    rows.find((r) => r.seed === s && r.rung === rr);
  const point = (rr: number): number => {
    const rs = rungRows(rr);
    return ratio(sum(rs.map((r) => def.num(r))), sum(rs.map((r) => def.den(r))));
  };
  const delta = point(rung) - point(CONTROL_RUNG);
  const rng = new Rng(BOOT_SEED + 1);
  const vals: number[] = [];
  for (let b = 0; b < BOOT_DRAWS; b++) {
    let n0 = 0; let d0 = 0; let n1 = 0; let d1 = 0;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[Math.floor(rng.next() * seeds.length) % seeds.length];
      const a = at(s, CONTROL_RUNG);
      const c = at(s, rung);
      if (a === undefined || c === undefined) continue;
      n0 += def.num(a); d0 += def.den(a);
      n1 += def.num(c); d1 += def.den(c);
    }
    vals.push(ratio(n1, d1) - ratio(n0, d0));
  }
  const ok = vals.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  const q = (p: number): number => ok[Math.min(ok.length - 1, Math.max(0, Math.floor(p * ok.length)))];
  const lo = ok.length === 0 ? Number.NaN : q(0.025);
  const hi = ok.length === 0 ? Number.NaN : q(0.975);
  const hw = (hi - lo) / 2;
  return {
    delta: round(delta, 8), ci95: [round(lo, 8), round(hi, 8)], halfWidth: round(hw, 8),
    absDeltaOverHalfWidth: round(Math.abs(delta) / hw, 4),
  };
};
const pub = (v: number): number | null => (Number.isFinite(v) ? round(v, 8) : null);
const faceRow = (key: string, rung: number): Record<string, unknown> => {
  const def = FACES[key];
  const rs = rungRows(rung);
  const n = sum(rs.map((r) => def.num(r)));
  const d0 = sum(rs.map((r) => def.den(r)));
  const ci = bootCi(rs, def);
  return {
    face: key, rung, numerator: n, denominator: d0, value: pub(ratio(n, d0)),
    ci95: [pub(ci[0]), pub(ci[1])], unit: def.unit, what: def.what,
  };
};
const faces = FACE_KEYS.flatMap((k) => RUNGS.map((r) => faceRow(k, r)));
const faceAt = (key: string, rung: number): { value: number | null; ci95: (number | null)[] } => {
  const f = faces.find((x) => x.face === key && x.rung === rung) as {
    value: number | null; ci95: (number | null)[] } | undefined;
  return f ?? { value: null, ci95: [null, null] };
};

/* ========================================================================== */
/* §9 THE FROZEN VERDICTS — H-BK.3(a) and H-BK.3(b)                           */
/* ========================================================================== */
/**
 * THE RULES, FROZEN AT §P (a red rule is never re-cut after sight):
 *  (a) at rung r > 0: the paired Δ of `caromInFlightPerGkRelease` vs rung 0 has its 95 %
 *      interval ENTIRELY BELOW ZERO, AND each unpriced control's POINT at rung r lies
 *      INSIDE that control's own rung-0 95 % interval.
 *  (b) at the LOWEST rung passing (a): the pooled lofted VOLUME's point AND every priced
 *      delivery's own volume point sit at or above their own rung-0 interval's LOWER EDGE.
 */
interface RungVerdict {
  rung: number;
  caromDelta: ReturnType<typeof bootPairedDelta>;
  caromFallsResolved: boolean;
  controls: { face: string; point: number | null; rung0Ci95: (number | null)[]; inside: boolean }[];
  controlsFlat: boolean;
  aPasses: boolean;
  volume: { face: string; point: number | null; rung0Ci95Lower: number | null; nonInferior: boolean }[];
  volumeNonInferior: boolean;
}
const rungVerdicts: RungVerdict[] = RUNGS.filter((r) => r > CONTROL_RUNG).map((rung) => {
  const caromDelta = bootPairedDelta(rung, FACES[FACE_CAROM]);
  const caromFallsResolved = Number.isFinite(caromDelta.ci95[1]) && caromDelta.ci95[1] < 0;
  const controls = CONTROLS.map((dv) => {
    const key = controlFaceOf(dv);
    const here = faceAt(key, rung);
    const base = faceAt(key, CONTROL_RUNG);
    const lo = base.ci95[0];
    const hi = base.ci95[1];
    const inside = here.value !== null && lo !== null && hi !== null
      && here.value >= lo && here.value <= hi;
    return { face: key, point: here.value, rung0Ci95: base.ci95, inside };
  });
  const controlsFlat = controls.every((c) => c.inside);
  const volume = [FACE_VOLUME_POOLED, ...PRICED.map(volumeFaceOf)].map((key) => {
    const here = faceAt(key, rung);
    const lower = faceAt(key, CONTROL_RUNG).ci95[0];
    return {
      face: key, point: here.value, rung0Ci95Lower: lower,
      nonInferior: here.value !== null && lower !== null && here.value >= lower,
    };
  });
  return {
    rung, caromDelta, caromFallsResolved, controls, controlsFlat,
    aPasses: caromFallsResolved && controlsFlat,
    volume, volumeNonInferior: volume.every((v) => v.nonInferior),
  };
});
const passingRungs = rungVerdicts.filter((v) => v.aPasses).map((v) => v.rung);
const lowestPassingRung = passingRungs.length === 0 ? null : Math.min(...passingRungs);
const hBk3a = passingRungs.length > 0;
const hBk3b = lowestPassingRung === null
  ? false
  : rungVerdicts.find((v) => v.rung === lowestPassingRung)!.volumeNonInferior;

/* the presser signature and the price histogram, per rung, from the stored bins */
const pressureSignature = Object.fromEntries(RUNGS.map((rung) => {
  const rs = rungRows(rung);
  const gkL = zeros(PRESS_BINS);
  const gkB = zeros(PRESS_BINS);
  const oL = zeros(PRESS_BINS);
  const oB = zeros(PRESS_BINS);
  for (const r of rs) {
    addInto(gkL, r.gkLaunchesByPressBin);
    addInto(gkB, r.gkBlockedByPressBin);
    addInto(oL, r.outLaunchesByPressBin);
    addInto(oB, r.outBlockedByPressBin);
  }
  return [String(rung), {
    binWidthMetres: PRESS_BIN_M,
    gk: gkL.map((l, b) => ({ bin: b, launches: l, blocked: gkB[b], rate: round(ratio(gkB[b], l), 6) })),
    outfield: oL.map((l, b) => ({ bin: b, launches: l, blocked: oB[b], rate: round(ratio(oB[b], l), 6) })),
  }];
}));
const priceDistribution = Object.fromEntries(RUNGS.map((rung) => {
  const rs = rungRows(rung);
  return [String(rung), Object.fromEntries(PRICED.map((dv) => {
    const i = D[dv];
    const bins = zeros(PRICE_BINS);
    for (const r of rs) addInto(bins, r.priceBins[i]);
    return [dv, { binWidth: 0.1, hazardBins: bins, playedLaunches: sum(bins) }];
  }))];
}));

/* ========================================================================== */
/* §10 ⭐ THE SEASON LADDER — EVOLUTION FINDS THE WEIGHT                       */
/* ========================================================================== */
/**
 * TWO ARMS, one ecology, ONE difference: whether SELECTION MAY TOUCH THE GENE.
 *   · `geneAbsent`  — `evolveDeliveryValue` FALSE: the gene stays STRUCTURALLY ABSENT for
 *     every generation (mutation and crossover draw no value for it), so every club prices
 *     the corridor at nothing. THE CONTROL.
 *   · `geneEvolvable` — `evolveDeliveryValue` TRUE: the gene may enter the population
 *     through the SHIPPED `mutateGenome` / `crossoverGenomes` opt-in path. NOTHING IS
 *     PRE-SEEDED and NO WEIGHT IS EVER SET BY HAND in this ladder.
 * BOTH arms arm `bkCorridorPrice`, so the DOOR is open in both worlds and the only question
 * is whether a coach who values the corridor can spread.
 *
 * THE SELECTION LAW is `evolveGroup`'s own, mirrored: elite 2 · reborn 2 · mutated 6 with
 * `{rate: 0.4, scale: 0.08}` and reborn `{rate: 0.5, scale: 0.15}` — both anchored above.
 * (The shipped `League.finishSeason` calls `mutateGenome`/`crossoverGenomes` with
 * HARD-CODED options, so arming the opt-in requires the probe-side ecology; the MT-T2
 * precedent.) HORIZON: 20 generations — the house ladder horizon the goals-warming
 * reference line is itself defined on (DF-C0 §R4's early(1–5)→late(16–20) slope).
 * ⚠ THE NEUTRAL-DRIFT SHADOW rides the control arm: inert passengers mutated by the SAME
 * law in their OWN rng namespace, inherited through the SAME elite/mutate/reborn
 * assignments. They touch no match, so they are what the gene level looks like with ZERO
 * selection on it — the honest null for "did selection ADOPT it".
 */
const LADDER_ARMS = ['geneAbsent', 'geneEvolvable'] as const;
type LadderArm = (typeof LADDER_ARMS)[number];
const LADDER_TEAMS = 10;
const LADDER_GENS = MODE === 'smoke' ? 2 : 20;
const LADDER_SEEDS = MODE === 'smoke' ? [12_520_900] : [12_520_900, 12_520_901, 12_520_902, 12_520_903];
const LADDER_ELITE_N = 2;
const LADDER_REBORN_N = 2;
const MUT_RATE = 0.4;
const MUT_SCALE = 0.08;
const REBORN_RATE = 0.5;
const REBORN_SCALE = 0.15;
const EARLY_GENS = 5;
const LATE_FROM = LADDER_GENS - 4;
/** DF-C0 §R4's published atkFrozen floor, QUOTED (not re-run) — the house idiom */
const ATK_FROZEN_FLOOR = 0.2211;
const ATK_FROZEN_FLOOR_SOURCE = 'DF-C0-DEFENSIVE-BRAIN.md §R4 (ruling #320 item 3 / #321 '
  + 'item 3): the atkFrozen arm\'s goals/match early(1–5)→late(16–20) delta +0.2211 '
  + '(half-width 0.1423, |Δ|÷hw 1.55). QUOTED, never re-run here.';

interface LadderTeam { slot: number; genome: TacticalGenome }
interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; passes: number; passesCompleted: number;
  interceptions: number; longBalls: number;
  gkReleases: number; caromInFlight: number;
  geneMean: number; geneSd: number; geneMax: number;
  genePresentShare: number; geneAboveZeroShare: number;
  driftMean: number | null; driftSd: number | null;
  fitnessGeneCorrelation: number;
  doorChecked: number; doorWrong: number;
  wallSeconds: number;
}
const pearson = (a: readonly number[], b: readonly number[]): number => {
  const n = Math.min(a.length, b.length);
  if (n < 3) return Number.NaN;
  const ma = mean(a.slice(0, n));
  const mb = mean(b.slice(0, n));
  let sab = 0; let saa = 0; let sbb = 0;
  for (let i = 0; i < n; i++) {
    const da = a[i] - ma;
    const db = b[i] - mb;
    sab += da * db; saa += da * da; sbb += db * db;
  }
  return (saa === 0 || sbb === 0) ? Number.NaN : sab / Math.sqrt(saa * sbb);
};
const clamp01 = (x: number): number => (x < 0 ? 0 : x > 1 ? 1 : x);
/** the ladder's own match: the exam's world, ARMED in both arms, genomes handed in */
const ladderMatch = (seed: number, ga: TacticalGenome, gb: TacticalGenome): Match => {
  const ta = team('A', seed * 2 + 1);
  const tb = team('B', seed * 2 + 2);
  const m = new Match({
    seed,
    teamA: { ...ta, genome: ga },
    teamB: { ...tb, genome: gb },
    ...a4MatchFlags(PC_WORLD),
    bkFacingLaw: true,
    bkContactLaw: true,
    bkCorridorPrice: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  return m;
};
/**
 * ⭐ THE LADDER'S OWN WALK — runs the match to completion while tracking R9's DISTRIBUTION
 * FAMILY at ladder grain: the SAME release ladder, the SAME `stepChain` and the SAME
 * in-flight-contact rule the battery uses (the pure predicates of §3a, shared — not a
 * second transcription). The battery's reachability replay and price census are NOT run
 * here (they are not ladder faces), which is the only difference.
 */
interface LadderWalkOut {
  goals: number; shots: number; passes: number; passesCompleted: number;
  interceptions: number; longBalls: number;
  gkReleases: number; caromInFlight: number;
  goalsA: number; goalsB: number;
}
const ladderWalk = (m: Match): LadderWalkOut => {
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
  };
  const players = m.allPlayers;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  interface LiteLaunch { gid: number; live: boolean; landed: boolean; inFlightContact: boolean | null }
  const open: LiteLaunch[] = [];
  const chains: { st: ChainState; launch: LiteLaunch | null }[] = [];
  let gkReleases = 0;
  let caromInFlight = 0;
  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    const ball = m.ball;
    const ownerGid = ball.owner?.gid ?? null;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
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
        if (klass === 'shot' || klass === 'headerShot' || klass === 'headerKnockdown'
          || klass === 'headerClearance') continue;
        const L: LiteLaunch = { gid, live: true, landed: false, inFlightContact: null };
        open.push(L);
        if (players[gid].role === 'GK' && playing) {
          gkReleases += 1;
          chains.push({
            st: {
              releaseTick: tick, gid, resolved: false, sawTeammateOwner: false,
              sawOppOwner: false, carom: false,
            },
            launch: L,
          });
        }
      }
    }
    for (const L of open) {
      if (!L.live) continue;
      if (!(ball.z > 0 || ball.vz !== 0)) L.landed = true;
      const contactGid = (lastTouchGid !== null && lastTouchGid !== prevLastTouchGid)
        ? lastTouchGid
        : (ownerGid !== null && ownerGid !== prevOwnerGid && ownerGid !== L.gid ? ownerGid : null);
      if (contactGid !== null && contactGid !== L.gid) {
        L.inFlightContact = !L.landed;
        L.live = false;
      }
    }
    for (const c of chains) {
      if (c.st.resolved) continue;
      const before = c.st.carom;
      c.st = stepChain(c.st, {
        tick, ownerGid, prevOwnerGid,
        ownerSameSide: ownerGid !== null && players[ownerGid].side === players[c.st.gid].side,
      });
      if (c.st.carom && !before && c.launch !== null && c.launch.inFlightContact === true) {
        caromInFlight += 1;
      }
    }
    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
  }
  const st = m.getResult().stats;
  return {
    goals: st[0].goals + st[1].goals,
    shots: st[0].shots + st[1].shots,
    passes: st[0].passes + st[1].passes,
    passesCompleted: st[0].passesCompleted + st[1].passesCompleted,
    interceptions: st[0].interceptions + st[1].interceptions,
    longBalls: st[0].longBalls + st[1].longBalls,
    gkReleases, caromInFlight,
    goalsA: st[0].goals, goalsB: st[1].goals,
  };
};
const runLadderArm = (arm: LadderArm, leagueSeed: number): LadderCell[] => {
  const opts = { evolveDeliveryValue: arm === 'geneEvolvable' };
  const evoRng = new Rng(hashSeed(leagueSeed, 0xe0));
  const driftRng = new Rng(hashSeed(leagueSeed, 0xd7));
  const initRng = new Rng(leagueSeed);
  let pop: LadderTeam[] = Array.from({ length: LADDER_TEAMS }, (_, slot) => ({
    slot, genome: randomGenome(initRng),
  }));
  let shadow: number[] | null = arm === 'geneAbsent'
    ? new Array<number>(LADDER_TEAMS).fill(0) : null;
  const cells: LadderCell[] = [];
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const tGen = Date.now();
    const points = new Array<number>(LADDER_TEAMS).fill(0);
    const gd = new Array<number>(LADDER_TEAMS).fill(0);
    const acc = {
      goals: 0, shots: 0, passes: 0, passesCompleted: 0, interceptions: 0, longBalls: 0,
    };
    let matches = 0;
    let doorChecked = 0;
    let doorWrong = 0;
    const car = { gkReleases: 0, caromInFlight: 0 };
    let idx = 0;
    for (let a = 0; a < LADDER_TEAMS; a++) {
      for (let b = a + 1; b < LADDER_TEAMS; b++) {
        /** the per-match seed is DERIVED through the SHIPPED `hashSeed`, exactly as
         *  `League.createMatch` derives its fixture seeds from the league's own seed */
        const seed = hashSeed(leagueSeed, gen, idx, 0xbc);
        idx += 1;
        const m = ladderMatch(seed, pop[a].genome, pop[b].genome);
        doorChecked += 1;
        if (m.bkCorridorPrice !== true || m.bkFacingLaw !== true || m.bkContactLaw !== true) {
          doorWrong += 1;
        }
        const w = ladderWalk(m);
        matches += 1;
        acc.goals += w.goals;
        acc.shots += w.shots;
        acc.passes += w.passes;
        acc.passesCompleted += w.passesCompleted;
        acc.interceptions += w.interceptions;
        acc.longBalls += w.longBalls;
        car.gkReleases += w.gkReleases;
        car.caromInFlight += w.caromInFlight;
        const ga = w.goalsA;
        const gb = w.goalsB;
        gd[a] += ga - gb; gd[b] += gb - ga;
        if (ga > gb) points[a] += 3; else if (gb > ga) points[b] += 3;
        else { points[a] += 1; points[b] += 1; }
      }
    }
    const fitness = pop.map((t) => points[t.slot] * 100 + gd[t.slot]);
    const vals = pop.map((t) => t.genome.dvExposureWeight ?? 0);
    cells.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, passes: acc.passes,
      passesCompleted: acc.passesCompleted, interceptions: acc.interceptions,
      longBalls: acc.longBalls,
      gkReleases: car.gkReleases, caromInFlight: car.caromInFlight,
      geneMean: round(mean(vals), 8), geneSd: round(sd(vals), 8),
      geneMax: round(Math.max(0, ...vals), 8),
      genePresentShare: round(pop.filter((t) => t.genome.dvExposureWeight !== undefined).length
        / LADDER_TEAMS, 6),
      geneAboveZeroShare: round(vals.filter((v) => v > 0).length / LADDER_TEAMS, 6),
      driftMean: shadow === null ? null : round(mean(shadow), 8),
      driftSd: shadow === null ? null : round(sd(shadow), 8),
      fitnessGeneCorrelation: round(pearson(vals, fitness), 6),
      doorChecked, doorWrong,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    if (gen === LADDER_GENS) break;

    /* selection: evolveGroup's band law, mirrored (both anchors above) */
    const order = [...pop].sort((x, y) => fitness[y.slot] - fitness[x.slot] || x.slot - y.slot);
    const pool = order.slice(0, 4);
    const pickParent = (exclude?: LadderTeam): LadderTeam => {
      const cands = pool.filter((f) => f !== exclude);
      const weights = cands.map((f) => 4 - pool.indexOf(f));
      const totalW = weights.reduce((a, b) => a + b, 0);
      let r = evoRng.next() * totalW;
      for (let i = 0; i < cands.length; i++) { r -= weights[i]; if (r <= 0) return cands[i]; }
      return cands[cands.length - 1];
    };
    const rebornFrom = order.length - LADDER_REBORN_N;
    const nextShadowBySlot = new Map<number, number>();
    const next: LadderTeam[] = [];
    order.forEach((f, rank) => {
      const sh = shadow === null ? null : shadow[f.slot];
      if (rank < LADDER_ELITE_N) {
        next.push({ slot: f.slot, genome: f.genome });
        if (sh !== null) nextShadowBySlot.set(f.slot, sh);
        return;
      }
      if (rank < rebornFrom) {
        next.push({
          slot: f.slot,
          genome: mutateGenome(f.genome, evoRng, { rate: MUT_RATE, scale: MUT_SCALE, ...opts }),
        });
        if (sh !== null) {
          nextShadowBySlot.set(f.slot, driftRng.chance(MUT_RATE)
            ? clamp01(sh + driftRng.gaussian() * MUT_SCALE) : sh);
        }
        return;
      }
      const pa = pickParent();
      const pb = pickParent(pa);
      next.push({
        slot: f.slot,
        genome: mutateGenome(
          crossoverGenomes(
            pa.genome, pb.genome, evoRng, false, false, false, false, false, false, false,
            arm === 'geneEvolvable',
          ),
          evoRng, { rate: REBORN_RATE, scale: REBORN_SCALE, ...opts },
        ),
      });
      if (shadow !== null) {
        const sa = shadow[pa.slot];
        const sb = shadow[pb.slot];
        const r = driftRng.next();
        const child = r < 0.4 ? sa : r < 0.8 ? sb : (sa + sb) / 2;
        nextShadowBySlot.set(f.slot, driftRng.chance(REBORN_RATE)
          ? clamp01(child + driftRng.gaussian() * REBORN_SCALE) : child);
      }
    });
    pop = next.sort((x, y) => x.slot - y.slot);
    shadow = shadow === null ? null : pop.map((t) => nextShadowBySlot.get(t.slot) ?? 0);
  }
  return cells;
};

const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
if (RUN_LADDER) {
  for (const arm of LADDER_ARMS) {
    for (const ls of LADDER_SEEDS) {
      ladderCells.push(...runLadderArm(arm, ls));
      banner(`  … ladder ${arm} league ${ls} done (${((Date.now() - tLadder0) / 1000).toFixed(0)} s)`);
    }
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
/** the ladder's per-generation faces, pooled over league seeds */
const ladderFaces = RUN_LADDER ? LADDER_ARMS.flatMap((arm) => {
  const gens = Array.from({ length: LADDER_GENS }, (_, i) => i + 1);
  return gens.map((gen) => {
    const cs = ladderCells.filter((c) => c.arm === arm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    return {
      arm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt), 6),
      shotsPerMatch: round(ratio(sum(cs.map((c) => c.shots)), mt), 6),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)),
        sum(cs.map((c) => c.passes))), 6),
      interceptionsPerMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt), 6),
      longBallsPerMatch: round(ratio(sum(cs.map((c) => c.longBalls)), mt), 6),
      gkReleases: sum(cs.map((c) => c.gkReleases)),
      caromInFlightPerGkRelease: round(ratio(sum(cs.map((c) => c.caromInFlight)),
        sum(cs.map((c) => c.gkReleases))), 6),
      geneMean: round(mean(cs.map((c) => c.geneMean)), 8),
      geneMax: round(Math.max(0, ...cs.map((c) => c.geneMax)), 8),
      genePresentShare: round(mean(cs.map((c) => c.genePresentShare)), 6),
      geneAboveZeroShare: round(mean(cs.map((c) => c.geneAboveZeroShare)), 6),
      driftMean: cs.every((c) => c.driftMean === null) ? null
        : round(mean(cs.map((c) => c.driftMean ?? 0)), 8),
      fitnessGeneCorrelation: round(mean(cs.map((c) => c.fitnessGeneCorrelation)
        .filter(Number.isFinite)), 6),
      unit: 'per-generation league aggregate (goals/shots per match on the 240 s match clock; '
        + 'gene levels are league-mean dvExposureWeight in [0,1])',
    };
  });
}) : [];
/** the goals slope, per arm: early(1–5) → late(LADDER_GENS−4 … LADDER_GENS), per league */
const ladderSlopes = RUN_LADDER ? LADDER_ARMS.map((arm) => {
  const perLeague = LADDER_SEEDS.map((ls) => {
    const cs = ladderCells.filter((c) => c.arm === arm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    const gpm = (xs: LadderCell[]): number =>
      ratio(sum(xs.map((c) => c.goals)), sum(xs.map((c) => c.matches)));
    return { leagueSeed: ls, early: round(gpm(early), 6), late: round(gpm(late), 6),
      delta: round(gpm(late) - gpm(early), 6) };
  });
  const deltas = perLeague.map((p) => p.delta);
  return {
    arm, perLeague,
    goalsSlopeMean: round(mean(deltas), 6),
    goalsSlopeSd: round(sd(deltas), 6),
    unit: 'goals per match, late minus early (the house early(1–5)→late idiom)',
    geneMeanFinal: round(mean(ladderCells.filter((c) => c.arm === arm
      && c.generation === LADDER_GENS).map((c) => c.geneMean)), 8),
    driftMeanFinal: (() => {
      const xs = ladderCells.filter((c) => c.arm === arm && c.generation === LADDER_GENS)
        .map((c) => c.driftMean).filter((v): v is number => v !== null);
      return xs.length === 0 ? null : round(mean(xs), 8);
    })(),
  };
}) : [];

/* ========================================================================== */
/* §11 THE GATES (frozen; a red gate is REPORTED, never patched)              */
/* ========================================================================== */
const gates: Record<string, boolean> = {};
gates.gWorld = rows.every((r) => r.worldOk)
  && RUNGS.every((r) => Object.values(receiptConjuncts[String(r)]).every(Boolean));
gates.gWeightSources = SOURCES_OK && RUNGS_OK && L3_BYTES_SHA.length === 64
  && PC_BYTES_SHA.length === 64 && BKT3_BYTES_SHA.length === 64;
gates.gAnchoredParams = FAMILY_ANCHORED_OK;
gates.gStrikeSurfaceAnchored = SURFACE_OK;
gates.gLeadAnchored = LEAD_ANCHORED_OK;
gates.gSeamSitesAnchored = SITES_OK;
gates.gWalkPredicatesPinned = PREDICATES_OK
  && [THROW_MIN_M, THROW_MAX_M, PUNT_MIN_M, SWITCH_MIN_M, DINK_PEN_M, DINK_LANE_MAX]
    .every((v) => Number.isFinite(v));
gates.gWalkFixtures = FIXTURES_OK && FIXTURES.length >= 30;
gates.gReplayMatchesLive = rows.every((r) => r.replayMaxAbsDiff < 1e-9)
  && sum(rows.map((r) => r.replaySamples)) > 0;
/**
 * ⭐ THE ARMING LIVENESS GATE: every ARMED rung's own delivery ledger must differ from the
 * CONTROL's. (It deliberately does NOT demand that the armed rungs differ from EACH OTHER —
 * two neighbouring weights behaving identically would be a FINDING about the world, not an
 * instrument fault, and a gate must not turn a result into a red.)
 */
gates.gArmedRungsDifferFromControl = (() => {
  const key = (rung: number): string => JSON.stringify(
    rungRows(rung).map((r) => [r.launches, r.blocked, r.enginePasses]),
  );
  const control = key(CONTROL_RUNG);
  return RUNGS.filter((r) => r > CONTROL_RUNG).every((r) => key(r) !== control);
})();
gates.gPriceIsZeroInControlRung = rungRows(CONTROL_RUNG)
  .every((r) => sum(r.priceSum) === 0 && r.priceEvals === 0);
/**
 * ⭐⭐ THE CORRECTED FORM (#334 item 4): the price's EVALUATION count inside armed
 * decisions, never the chosen launches' residual hazard. This gate CAN fail — it fails if
 * an armed rung never evaluates the price, or never sees a body on any line it prices.
 */
gates.gPriceFires = RUNGS.filter((r) => r > CONTROL_RUNG).every((rung) => {
  const rs = rungRows(rung);
  return sum(rs.map((r) => r.priceEvals)) > 0 && sum(rs.map((r) => r.priceEvalsNonZero)) > 0;
});
gates.gPriceScalesWithTheRung = (() => {
  // the price a rung actually subtracts must be that rung's weight × the hazard it saw
  const per = RUNGS.filter((r) => r > CONTROL_RUNG).map((rung) => {
    const rs = rungRows(rung);
    const h = sum(rs.map((r) => sum(r.hazardSum)));
    const p = sum(rs.map((r) => sum(r.priceSum)));
    return h === 0 ? true : Math.abs(p - rung * h) <= 1e-6 * Math.max(1, Math.abs(p));
  });
  return per.every(Boolean);
})();
gates.gDeliveryPartition = rows.every((r) => sum(r.launches) >= sum(r.blocked));
gates.gReachabilityNested = rows.every((r) => FAMILY_KEYS.every((_, fi) =>
  r.reachBoth[fi] <= Math.min(r.reachClears[fi], r.reachInstantiable[fi])))
  && rows.every((r) => r.reachAnyBoth <= r.reachAnyClear && r.reachAnyClear <= r.reachBlocked);
gates.gNonVacuous = sum(rungRows(CONTROL_RUNG).map((r) => r.reachBlocked)) > 0
  && sum(rows.map((r) => r.gkReleases)) > 0
  && rows.every((r) => r.ticks > 0);
gates.gGenomeClean = RUNGS.every((rung) => receiptConjuncts[String(rung)]
  .infoGenomeCleanOfTheWeight)
  && rows.every((r) => r.worldOk);
/** ⭐ BOOKED = WALKED, from the CELLS' own distinct-seed set (#335 item 4) */
const CELL_SEEDS = [...new Set(rows.map((r) => r.seed))].sort((a, b) => a - b);
const BOOKED_SEEDS = [...BATTERY_SEEDS].sort((a, b) => a - b);
gates.gSeedsBookedEqualWalked =
  JSON.stringify(CELL_SEEDS) === JSON.stringify(BOOKED_SEEDS)
  && rows.length === BATTERY_SEEDS.length * RUNGS.length
  && CELL_SEEDS.every((s) => s >= BLOCK_BASE && s <= BLOCK_BASE + 999);
gates.gLadderDoors = !RUN_LADDER
  ? true
  : ladderCells.length === LADDER_ARMS.length * LADDER_SEEDS.length * LADDER_GENS
  && ladderCells.every((c) => c.doorWrong === 0 && c.matches
    === (LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2)
  && ladderCells.filter((c) => c.arm === 'geneAbsent')
    .every((c) => c.genePresentShare === 0 && c.geneMean === 0)
  && ladderCells.filter((c) => c.generation === 1).every((c) => c.geneMean === 0);

/* ========================================================================== */
/* §12 THE ARTIFACT                                                           */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'authorizedBy', 'mode', 'world', 'rungs', 'weightSetting',
  'anchors', 'fixtures', 'sources', 'seeds', 'hypotheses', 'faces', 'rungVerdicts',
  'pressureSignature', 'priceDistribution', 'ladder', 'cells', 'gates',
  'faceCoverage'] as const;
const artifact: Record<string, unknown> = {
  stage: 'BK-T4 — THE CORRIDOR EXAM',
  authorizedBy: 'ruling #335 item 5 (the #334 ladder; USER MANDATE #328/#330)',
  kind: 'AN EXAM — two pre-registered hypotheses (H-BK.3(a), H-BK.3(b)) + a season ladder '
    + 'that lets EVOLUTION find the weight. The rules were frozen at the freeze commit.',
  mode: MODE,
  instrument: {
    file: 'scripts/probes/bk-t4-corridor-exam.ts',
    headCommit: gitOut('git rev-parse HEAD'),
    srcSha256: {
      'src/ai/deliveryValueSeat.ts': SEAT_SHA,
      'src/ai/PlayerBrain.ts': BRAIN_SHA,
      'src/sim/Match.ts': MATCH_SHA,
      'src/sim/mechanics.ts': MECH_SHA,
      'src/evolution/genome.ts': GENOME_SHA,
      'src/evolution/evolve.ts': EVOLVE_SHA,
    },
    note: 'the six srcSha256 fields — NOT the hashed body — bind instrument/src identity '
      + '(#334 item 3\'s third LOW).',
  },
  world: {
    stack: 'world-9 = a4MatchFlags(8) + armA4World(matured L3/PC doses) + bkFacingLaw + bkContactLaw',
    receiptSeed: RECEIPT_SEED,
    conjuncts: receiptConjuncts,
    matchClockSeconds: 240,
  },
  rungs: {
    gene: 'dvExposureWeight',
    values: RUNGS,
    controlRung: CONTROL_RUNG,
    derivation: 'the gene\'s OWN domain is [0,1] (`dvExposureWeightOf` clamps with '
      + '`clamp01`, anchored, file bytes hashed); the rungs are that domain\'s OWN QUARTERS, '
      + 'ALL of them. No taste constant, no argued subset. Rung 0 = the CONTROL (flag '
      + 'absent, gene born absent — BK-T3\'s shut world of record).',
    anchors: [A_GENE_CLAMP, A_GENE_DOMAIN, A_GENE_MUTATION, A_EVOLVE_OPT_IN],
  },
  weightSetting: {
    idiom: 'MATCH-LOCAL COPIES (bu-t1\'s setMtDoseLocal shape): baseGenome/effGenome are '
      + 'replaced by copies carrying the weight; `info.genome` is NEVER written. The '
      + 'ratified post-#270.2 form ORDERED at #334 item 1, with the info.genome-CLEANLINESS '
      + 'world conjunct (`infoGenomeCleanOfTheWeight`) measured at every rung and gated by '
      + 'gGenomeClean.',
    sourceBytesSha256: {
      'src/evolution/genome.ts': GENOME_SHA, 'src/ai/deliveryValueSeat.ts': SEAT_SHA,
    },
  },
  anchors: {
    loftFamilies: {
      loft: { ...SITE_LOFT, site: 'performLoftedPass' },
      keeperThrow: { ...SITE_THROW, site: 'performKeeperThrow' },
      dink: { ...SITE_DINK, site: 'performThroughBall' },
      loftKickNeedleOccurrences: countOf(MECH_SRC, 'loftKick('),
      crossExcluded: 'performCross is NOT priced by this seam (BK-C1 §R8 honest exclusion)',
    },
    strikeLead: {
      anchor: A_STRIKE_LEAD, fractionOffTheLine: leadFractionOffTheLine,
      seamConstant: BK_CORRIDOR_LEAD_FLIGHT_FRACTION,
      what: 'BK-T4 §RIDER: the priced aim is the strike\'s OWN lead — `mate.pos + '
        + 'mate.vel · flight0 · 0.7` — at performLoftedPass and performKeeperThrow. The '
        + 'DINK is NOT led (its strike leads through runBurstPoint at 0.85·T, a different '
        + 'machine) — declared, not closed.',
    },
    strikeSurface: {
      shell: A_SHELL, edge: A_EDGE, shellMetres: STRIKE_SHELL_M, edgeMetres: HEADER_MIN_HEIGHT,
    },
    seamSites: {
      fork: A_FORK, loftSwitch: A_SITE_SWITCH, dink: A_SITE_DINK, keeperThrow: A_SITE_THROW,
      punt: A_SITE_PUNT,
    },
    selectionLaw: { mutated: A_EVOLVE_MUTATED_LAW, reborn: A_EVOLVE_REBORN_LAW },
    walkSidePredicates: {
      note: 'canon REFINED at #334 item 2: "anchored extraction protects the source line; a '
        + 'headline-bearing walk-side predicate ALSO needs a composition fixture". The '
        + 'anchors are here; the FIXTURES are the `fixtures` block.',
      gkBlock: A_GK_BLOCK, throwRange: A_THROW_RANGE, puntRange: A_PUNT_RANGE,
      switchRange: A_SWITCH_RANGE, dinkRunner: A_DINK_RUNNER, dinkPenetration: A_DINK_PEN,
      dinkLane: A_DINK_LANE, layingOff: A_LAYOFF,
      valuesReadOffTheLines: {
        throwMinM: THROW_MIN_M, throwMaxM: THROW_MAX_M, puntMinM: PUNT_MIN_M,
        switchMinM: SWITCH_MIN_M, dinkPenetrationM: DINK_PEN_M, dinkLaneMax: DINK_LANE_MAX,
      },
      declaredLimits: 'instantiability asks whether the OPTION EXISTED, never whether it '
        + 'would have won the argmax; the offside gate and the aerial outcome are not modelled.',
    },
  },
  fixtures: {
    count: FIXTURES.length, allPass: FIXTURES_OK, failures: FIXTURE_FAILURES,
    cases: FIXTURES.map((f) => ({ name: f.name, got: f.got, want: f.want })),
  },
  sources: {
    l3Dose: { file: L3_T1_PATH, sha256: L3_BYTES_SHA, cells: L3_DOSE.length },
    pcDose: { file: PC_T1_PATH, sha256: PC_BYTES_SHA, rosterRows: PC_DOSE.length },
    q06FromBkT2: { file: BKT2_PATH, sha256: BKT2_BYTES_SHA, face: q06BkT2 },
    availabilityFromBkC1: { file: BKC1_PATH, sha256: BKC1_BYTES_SHA, face: BKC1_AVAIL },
    bkT3Receipts: {
      file: BKT3_PATH, sha256: BKT3_BYTES_SHA,
      hashedBodySha256: BKT3_JSON.hashedBodySha256 ?? null,
      caromInFlightShut: bkt3Face('caromInFlightPerGkRelease', 'shut'),
      caromInFlightDosed: bkt3Face('caromInFlightPerGkRelease', 'dosed'),
      puntVolumeShut: null,
      note: 'BK-T3\'s numbers are quoted as the PARENT stage\'s, never as this exam\'s.',
    },
    atkFrozenFloor: { value: ATK_FROZEN_FLOOR, source: ATK_FROZEN_FLOOR_SOURCE },
  },
  seeds: {
    block: '12,520,000–999',
    battery: BATTERY_SEEDS,
    rungsPerSeed: RUNGS.length,
    receipt: RECEIPT_SEED,
    smokePrefixInBand: SMOKE_PREFIX,
    ladderLeagueSeeds: LADDER_SEEDS,
    ladderMatchSeedDerivation: 'hashSeed(leagueSeed, generation, fixtureIndex, 0xbc) — the '
      + 'SHIPPED hashSeed, the same mechanism League.createMatch uses to derive fixture '
      + 'seeds from the league\'s own seed. The BOOKED seeds are the league seeds.',
    bookedFromCells: CELL_SEEDS.length,
    walkedRows: rows.length,
    statsConsumed: 0,
    statsNote: 'ZERO registry statistics are drawn: every interval is a percentile '
      + 'bootstrap over the WALKED seeds (the IN-T0 / DF-T2 / BK-C1 / BK-T3 precedent). '
      + 'There is deliberately NO gStatsZero gate — a hardcoded true is not a gate '
      + '(#334 item 3). Next stats base remains ≥ 116,800 (registry of record 69).',
  },
  hypotheses: {
    'H-BK.3(a)': {
      statement: 'THE DEFLECTION FALLS WITH THE CONTROLS FLAT — at SOME rung, '
        + 'caromInFlightPerGkRelease falls RESOLVEDLY vs rung 0 (the paired per-seed '
        + 'bootstrap Δ\'s 95 % interval lies ENTIRELY BELOW ZERO) while BOTH unpriced '
        + 'controls (cross and driven-pass blocked-short shares) stay INSIDE their own '
        + 'rung-0 95 % intervals.',
      face: FACE_CAROM,
      controlFaces: CONTROLS.map(controlFaceOf),
      verdict: hBk3a,
      passingRungs,
      lowestPassingRung,
    },
    'H-BK.3(b)': {
      statement: 'RE-AIM, NOT SUPPRESS — at the LOWEST rung where (a) passes, the pooled '
        + 'lofted VOLUME (launches per match over the four priced deliveries) AND every '
        + 'priced delivery\'s own volume sit AT OR ABOVE their own rung-0 95 % interval\'s '
        + 'LOWER EDGE (a non-inferiority band derived from the control arm\'s own interval — '
        + 'no taste constant). If (a) passes only where volume collapses, (b) FAILS and '
        + 'that is the result.',
      faces: [FACE_VOLUME_POOLED, ...PRICED.map(volumeFaceOf)],
      verdict: hBk3b,
      evaluatedAtRung: lowestPassingRung,
    },
    reportedNeverGated: ['q06PassCompletion by rung', 'the presser signature by rung',
      'blocked-short by delivery by rung', 'the price distribution by rung',
      'per-family reachability by rung', 'THE SEASON LADDER (all of it)'],
  },
  faces,
  rungVerdicts,
  pressureSignature,
  priceDistribution,
  ladder: {
    ran: RUN_LADDER,
    arms: {
      geneAbsent: '`evolveDeliveryValue` FALSE — the gene stays STRUCTURALLY ABSENT for '
        + 'every generation. THE CONTROL. Carries the NEUTRAL-DRIFT SHADOW (inert '
        + 'passengers mutated by the same law in their own rng namespace).',
      geneEvolvable: '`evolveDeliveryValue` TRUE — the gene may enter through the SHIPPED '
        + 'mutateGenome/crossoverGenomes opt-in path. NOTHING pre-seeded, NO manual weight.',
      common: 'BOTH arms arm bkCorridorPrice + bkFacingLaw + bkContactLaw on the world-9 '
        + 'stack, identical founders per league seed, identical fitness.',
    },
    ecology: {
      teams: LADDER_TEAMS, generations: LADDER_GENS,
      matchesPerGeneration: (LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2,
      eliteN: LADDER_ELITE_N, rebornN: LADDER_REBORN_N,
      mutatedLaw: { rate: MUT_RATE, scale: MUT_SCALE },
      rebornLaw: { rate: REBORN_RATE, scale: REBORN_SCALE },
      horizonNote: '20 generations — the horizon the goals-warming reference line is itself '
        + 'defined on (DF-C0 §R4\'s early(1–5)→late(16–20) slope). The probe-side ecology is '
        + 'the MT-T2 precedent: League.finishSeason calls mutateGenome/crossoverGenomes with '
        + 'HARD-CODED options, so an evolution opt-in cannot be armed through the shipped '
        + 'League. ⚠ THIS ECOLOGY IS THE EXAM\'S, NOT THE SHIPPED LEAGUE\'S — no shipped '
        + 'League number is quoted as this ladder\'s and vice versa.',
    },
    cells: ladderCells,
    faces: ladderFaces,
    slopes: ladderSlopes,
    wallSeconds: ladderWallSec,
  },
  cells: rows,
  batteryWallSeconds: batteryWallSec,
  wallSeconds: 0,
};

/* ---- gFaces: EVERY published face re-derived from the SERIALIZED artifact --- */
const ALL_GREEN_PRE = Object.values(gates).every(Boolean);
const OUT_PATH_PRE = ALL_GREEN_PRE || IS_OVERRIDE ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as Record<string, unknown>;
const diskCells = disk.cells as Row[];
const diskFaces = disk.faces as { face: string; rung: number; numerator: number; denominator: number; value: number | null }[];
const eq = (a: number, b: number | null): boolean => pub(a) === b;
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const df of diskFaces) {
  const def = FACES[df.face];
  faceChecks++;
  if (def === undefined) { faceFailures.push(`${df.face}: no definition`); continue; }
  const rs = diskCells.filter((r) => r.rung === df.rung);
  const n = sum(rs.map((r) => def.num(r)));
  const d0 = sum(rs.map((r) => def.den(r)));
  if (n === df.numerator && d0 === df.denominator && eq(ratio(n, d0), df.value)) faceOk++;
  else faceFailures.push(`${df.face}/${df.rung}: ${n}/${d0} vs ${df.numerator}/${df.denominator}`);
}
const binChecks: [string, boolean][] = [];
for (const rung of RUNGS) {
  const rs = diskCells.filter((r) => r.rung === rung);
  const ps = (disk.pressureSignature as Record<string, { gk: { launches: number; blocked: number }[]; outfield: { launches: number; blocked: number }[] }>)[String(rung)];
  for (let b = 0; b < PRESS_BINS; b++) {
    binChecks.push([`press.${rung}.gk.${b}`,
      ps.gk[b].launches === sum(rs.map((r) => r.gkLaunchesByPressBin[b]))
      && ps.gk[b].blocked === sum(rs.map((r) => r.gkBlockedByPressBin[b]))]);
    binChecks.push([`press.${rung}.out.${b}`,
      ps.outfield[b].launches === sum(rs.map((r) => r.outLaunchesByPressBin[b]))
      && ps.outfield[b].blocked === sum(rs.map((r) => r.outBlockedByPressBin[b]))]);
  }
  const pd = (disk.priceDistribution as Record<string, Record<string, { hazardBins: number[]; playedLaunches: number }>>)[String(rung)];
  for (const dv of PRICED) {
    const i = D[dv];
    const acc = zeros(PRICE_BINS);
    for (const r of rs) addInto(acc, r.priceBins[i]);
    binChecks.push([`price.${rung}.${dv}`, JSON.stringify(acc) === JSON.stringify(pd[dv].hazardBins)
      && pd[dv].playedLaunches === sum(acc)]);
  }
}
/** the LADDER's own published faces re-derived from its serialized cells */
const ladderChecks: [string, boolean][] = [];
if (RUN_LADDER) {
  const dl = disk.ladder as { cells: LadderCell[]; faces: { arm: LadderArm; generation: number; matches: number; goalsPerMatch: number; geneMean: number; gkReleases: number; caromInFlightPerGkRelease: number }[] };
  for (const lf of dl.faces) {
    const cs = dl.cells.filter((c) => c.arm === lf.arm && c.generation === lf.generation);
    const mt = sum(cs.map((c) => c.matches));
    ladderChecks.push([`ladder.${lf.arm}.${lf.generation}`,
      mt === lf.matches
      && round(ratio(sum(cs.map((c) => c.goals)), mt), 6) === lf.goalsPerMatch
      && round(mean(cs.map((c) => c.geneMean)), 8) === lf.geneMean
      && sum(cs.map((c) => c.gkReleases)) === lf.gkReleases
      && round(ratio(sum(cs.map((c) => c.caromInFlight)),
        sum(cs.map((c) => c.gkReleases))), 6) === lf.caromInFlightPerGkRelease]);
  }
}
const binFailures = binChecks.filter(([, v]) => !v).map(([k]) => k);
const ladderFailures = ladderChecks.filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && faceFailures.length === 0
  && binFailures.length === 0 && ladderFailures.length === 0;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: diskFaces.length, checksRun: faceChecks, checksPassed: faceOk,
  binChecksRun: binChecks.length, binFailures,
  ladderChecksRun: ladderChecks.length, ladderFailures,
  failures: faceFailures,
};
(artifact as { wallSeconds: number }).wallSeconds = round((Date.now() - t0Wall) / 1000, 3);
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonical(body));

/** ⭐ THE RED-ROUTING IDIOM (#334 item 5, a REQUIRED clause) */
const ALL_GREEN = Object.values(gates).every(Boolean);
const OUT_PATH = ALL_GREEN || IS_OVERRIDE ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

banner('');
banner('=== BK-T4 — THE CORRIDOR EXAM ===');
banner(`mode=${MODE} seeds=${BATTERY_SEEDS.length} rungs=${RUNGS.join(',')} `
  + `ladder=${RUN_LADDER ? `${LADDER_ARMS.length}×${LADDER_SEEDS.length}×${LADDER_GENS}` : 'OFF'} `
  + `wall=${(artifact as { wallSeconds: number }).wallSeconds}s`);
for (const [k, v] of Object.entries(gates)) banner(`${v ? 'GREEN' : 'RED  '} ${k}`);
banner(`H-BK.3(a) ${hBk3a ? 'PASS' : 'FAIL'} (passing rungs: ${passingRungs.join(',') || 'none'})`);
banner(`H-BK.3(b) ${hBk3b ? 'PASS' : 'FAIL'} (at rung ${lowestPassingRung ?? 'n/a'})`);
banner(`faces re-derived ${faceOk}/${faceChecks}; bins ${binChecks.length - binFailures.length}/${binChecks.length}; ladder ${ladderChecks.length - ladderFailures.length}/${ladderChecks.length}`);
banner(`out=${OUT_PATH}`);
if (!ALL_GREEN) banner('⚠ AT LEAST ONE GATE IS RED — reported, never patched; artifact at the SIDE PATH');
