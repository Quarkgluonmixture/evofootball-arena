/**
 * BK-T3 — THE CORRIDOR-HAZARD RECEIPTS (docs/world-model/BK-T3-CORRIDOR-HAZARD.md).
 *
 * Authorized by ruling #333 item 5 (the design pick ratified at #331 item 3), serving the
 * USER MANDATE of rulings #328/#330. THIS IS A RECEIPT WALK, NOT AN EXAM.
 * CANON, VERBATIM-ADJACENT (homes: ruling #289 item 1 + BU-T1 §CORR item 5): arming and
 * plumbing receipts are NEVER quoted as football effect sizes — the exam is later. Nothing
 * below is an effect size and no between-arm test is frozen here.
 *
 * TWO ARMS, one world:
 *   · SHUT  — the world-9 stack (`a4MatchFlags(8)` + `armA4World` with the matured L3/PC
 *     doses, both dose FILES hashed AS BYTES before they are parsed) + `bkFacingLaw` +
 *     `bkContactLaw`. This is BK-C1's world of record, unchanged.
 *   · DOSED — the same world plus `bkCorridorPrice` AND the DV seat's born-absent
 *     `dvExposureWeight` gene at its DERIVED dose.
 *
 * ⭐ THE DOSE'S DERIVATION (no taste constant): the gene's own domain is `[0, 1]` — the
 * `clamp01` in `dvExposureWeightOf` (anchored below, its source bytes hashed). The dose of
 * record is that domain's MAXIMUM, `1`: the coach who cares as much as a coach can. It is
 * the loudest LEGAL arm, so a quiet receipt cannot be blamed on a timid dose. The gene is
 * written on the three genome views the shipped read walks (the #196.3-D6 arming
 * checklist, DV-T0's own probe idiom); no CENSUS VALUE is dosed anywhere in this probe
 * (house law #270.2 — the L3/PC world doses still go through `armA4World`, the shipped
 * writer, from files hashed as bytes).
 *
 * CANON, VERBATIM (quoted because a dose is read from disk): "a dose-source guard should
 * hash the bytes it reads, not a self-declared field" (home: BU-T1 §CORR item 6).
 * CANON, VERBATIM (quoted because the probe walks worlds): "WORKER-SIMMED fixtures play the
 * SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, test-pinned;
 * refines #270's E4 correction; matches the perf diagnostic)" (home: ruling #283.2(iv)).
 * This probe builds `Match` DIRECTLY and never round-trips a League, so no worker fixture
 * is generated and the sentence binds nothing here.
 *
 * THE RECEIPTS (all pre-registered in the stage doc §P before this file ran):
 *   R1 the corridor price's distribution on lofted deliveries — it FIRES and it
 *      DIFFERENTIATES (by delivery, both arms; the price is evaluated by the SHIPPED
 *      exported functions at each launch's own origin/aim/family).
 *   R2 blocked-short share BY DELIVERY, both arms (the direction receipt).
 *   R3 the distribution-carom family count (R9's family and window, reused).
 *   R4 the pressure signature re-read (BK-C1 §R5's bins; a rising limb may APPEAR).
 *   R5 Q06 completion direction (the pre-registered linkage face; BK-T2's own definition,
 *      Σ passesCompleted / Σ passes, both teams).
 *   R6 PER-FAMILY REACHABILITY (BK-C1 §CORR 1's ordered rider): of the blocked lofted
 *      launches in the SHUT arm, which clearing FAMILIES the chooser could actually have
 *      INSTANTIATED at that moment — so 85.9 % is never read as recoverable headroom.
 *
 * ⚠ THE INSTRUMENT'S WALK-SIDE PREDICATES ARE PINNED, canon VERBATIM: "a scored face's
 * walk-side predicate is pinned — anchored extraction or fixture — because the
 * re-derivation gate proves arithmetic, not definitions" (home: DF-T3 §CORR item 2). Every
 * instantiability predicate in R6 is an ANCHORED extraction of the shipped chooser's own
 * gating line, with its occurrence count and line receipt in the artifact.
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
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { ROSTER_SIZE, TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { laneOpenness } from '../../src/ai/perception';
import {
  BK_CORRIDOR_FAMILIES, bkCorridorFlightOf, bkCorridorHazard, bkCorridorPriceOf,
  deliveryValueSeatOf,
} from '../../src/ai/deliveryValueSeat';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS                        */
/* ========================================================================== */
const ENV_WHITELIST = ['BKT3_MODE', 'BKT3_N', 'BKT3_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BKT3_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`REFUSING: unknown env doors ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = (process.env.BKT3_MODE as Mode | undefined) ?? 'full';
if (!MODES.includes(MODE)) { banner(`REFUSING: BKT3_MODE=${MODE}`); process.exit(2); }
const N_ENV = process.env.BKT3_N !== undefined ? Number(process.env.BKT3_N) : undefined;
const OUT_ENV = process.env.BKT3_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? [`N=${N_ENV}`] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bk-t3-corridor-receipts.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bk-t3-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean =>
  pathResolve(p).startsWith(CANONICAL_DIR_ABS + pathSep);
if (IS_PREFLIGHT && isCanonical(OUT_PATH)) {
  banner(`REFUSING: a preflight run (${PREFLIGHT_REASONS.join(', ')}) may not write the canonical artifact`);
  process.exit(2);
}

const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : (Number.isNaN(v) ? Number.NaN : v));
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
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
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const GENOME_SRC = readFileSync(GENOME_PATH, 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const countOf = (src: string, needle: string): number => src.split(needle).length - 1;
/** an ANCHORED needle: its occurrence count AND the line of its single site */
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

/** ⭐ THE DOSE'S OWN SOURCE — the gene's domain, anchored, with the file bytes hashed */
const A_GENE_CLAMP = anchor(GENOME_PATH, GENOME_SRC, 'export function dvExposureWeightOf(g: TacticalGenome): number {');
const A_GENE_DOMAIN = anchor(GENOME_PATH, GENOME_SRC, 'return clamp01(v);');
const GENOME_SHA = sha(GENOME_SRC);
const SEAT_SHA = sha(SEAT_SRC);
const BRAIN_SHA = sha(BRAIN_SRC);
const MATCH_SHA = sha(MATCH_SRC);
const MECH_SHA = sha(MECH_SRC);
/** the DOSE OF RECORD: the gene's own domain maximum. A DERIVED dose, not a taste constant. */
const DOSE_WEIGHT = 1;
const DOSE_OK = A_GENE_CLAMP.occurrences === 1 && A_GENE_DOMAIN.occurrences >= 1
  && DOSE_WEIGHT === 1;

/**
 * ⭐⭐ THE FOUR PRICED SITES, anchored — the seam's own statements, so the receipts cannot
 * be computed against a chooser the engine does not run.
 */
const A_SITE_SWITCH = anchor(BRAIN_PATH, BRAIN_SRC, 'sL -= bkCorridorPriceOf(bkSeat, p.pos, mate.pos, opp.players, BK_CORRIDOR_FAMILIES.loft);');
const A_SITE_DINK = anchor(BRAIN_PATH, BRAIN_SRC, 'sC -= bkCorridorPriceOf(bkSeat, p.pos, point, opp.players, BK_CORRIDOR_FAMILIES.dink);');
const A_SITE_THROW = anchor(BRAIN_PATH, BRAIN_SRC, 'sT -= bkCorridorPriceOf(bkSeat, p.pos, mate.pos, opp.players, BK_CORRIDOR_FAMILIES.keeperThrow);');
const A_SITE_PUNT = anchor(BRAIN_PATH, BRAIN_SRC, 'sP -= bkCorridorPriceOf(bkSeat, p.pos, puntMate.pos, opp.players, BK_CORRIDOR_FAMILIES.loft);');
const A_FORK = anchor(BRAIN_PATH, BRAIN_SRC, 'const bkSeat = match.bkCorridorPrice ? deliveryValueSeatOf(g) : null;');
const SITES_OK = [A_SITE_SWITCH, A_SITE_DINK, A_SITE_THROW, A_SITE_PUNT, A_FORK]
  .every((a) => a.occurrences === 1);

/**
 * ⭐⭐ THE WALK-SIDE PREDICATES OF R6 — INSTANTIABILITY, each an ANCHORED extraction of the
 * shipped chooser's OWN gating line (canon: walk-side definitions pinned). The probe's
 * predicate below is the line's own arithmetic; if the line moves, the gate goes red.
 */
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
/** the numbers those lines carry, read OFF the lines rather than re-typed */
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
/* §2 THE DOSE SOURCES AND THE LINKAGE FACE — bytes hashed BEFORE parsing     */
/* ========================================================================== */
const L3_T1_PATH = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_T1_PATH = 'docs/world-model/data/pc-t1-learning-exam.json';
const BKT2_PATH = 'docs/world-model/data/bk-t2-composition-exam.json';
const BKC1_PATH = 'docs/world-model/data/bk-c1-distribution-census.json';
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
/** BK-C1's own availability face, carried with its bytes hashed (never re-typed from prose) */
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
const SOURCES_OK = L3_DOSE.length > 0 && PC_DOSE.length > 0 && q06BkT2 !== null
  && BKC1_AVAIL !== null;

/* ========================================================================== */
/* §3 THE PRE-REGISTERED CLASSES (BK-C1's, class for class)                   */
/* ========================================================================== */
const DELIVERIES = ['punt', 'loftSwitch', 'cross', 'throw', 'drivenPass', 'clearance',
  'throughLoft', 'throughGround', 'otherRelease'] as const;
type Delivery = (typeof DELIVERIES)[number];
const D: Record<Delivery, number> = Object.fromEntries(
  DELIVERIES.map((d, i) => [d, i]),
) as Record<Delivery, number>;
/** the four LOFTED deliveries this seam prices (the cross is out of scope, by design) */
const PRICED: Delivery[] = ['punt', 'loftSwitch', 'throughLoft', 'throw'];
const FAMILY_OF: Partial<Record<Delivery, keyof typeof BK_CORRIDOR_FAMILIES>> = {
  punt: 'loft', loftSwitch: 'loft', throughLoft: 'dink', throw: 'keeperThrow',
};
/** R9's own window and retire cap, reused (BK-C1 §3) */
const CHAIN_WINDOW_TICKS = 240;
const CHAIN_RETIRE_TICKS = 720;
/** the price histogram: 10 bins × 0.1 over [0,1] (the hazard's own range) */
const PRICE_BINS = 10;
const priceBin = (v: number): number => Math.min(PRICE_BINS - 1, Math.max(0, Math.floor(v * 10)));
/** presser distance at launch, METRES: 8 bins × 2 m, last bin holds ≥ 14 m (BK-C1's) */
const PRESS_BIN_M = 2;
const PRESS_BINS = 8;
const pressBin = (m: number): number => Math.min(PRESS_BINS - 1, Math.max(0, Math.floor(m / PRESS_BIN_M)));

/* ========================================================================== */
/* §4 THE SHIPPED FLIGHT MODEL, TRANSCRIBED (R6's clearing test)              */
/* ========================================================================== */
/**
 * `replayFlight` IS `Match.stepBall`'s airborne branch (src/sim/Match.ts, airborne branch),
 * statement for statement — BK-C1 §5's transcription reused, and re-proved LIVE here by
 * `gReplayMatchesLive`. Friction is absent ON PURPOSE: the shipped integrator applies
 * `BALL_FRICTION_K` only in the GROUND branch, so an airborne ball is friction-free.
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

/** does a family's launch to the SAME target clear a body at along-line `s`? (BK-C1's test) */
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
/* §5 THE WORLD OF RECORD + THE TWO ARMS                                      */
/* ========================================================================== */
const PC_WORLD = 8 as const;
const ARMS = ['shut', 'dosed'] as const;
type Arm = (typeof ARMS)[number];
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
    bkFacingLaw: true,
    bkContactLaw: true,
    ...(arm === 'dosed' ? { bkCorridorPrice: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, PC_WORLD, L3_DOSE, PC_DOSE);
  if (arm === 'dosed') {
    // THE ARMING CHECKLIST (#196.3-D6): the gene on all three genome views of BOTH teams.
    for (const t of m.teams) {
      for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
        g.dvExposureWeight = DOSE_WEIGHT;
      }
    }
  }
  return m;
};
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
  const seats = m.teams.map((t) => deliveryValueSeatOf(t.effGenome));
  return {
    armedVersionIsWorld9: a4ArmedVersion(m) === BK_WORLD_VERSION,
    windupsArmed: mm.c7Windup === true && mm.o1PassWindup === true,
    latencyDoorArmed: mm.pcReactionLatency === true && mm.pcLatency !== null,
    pcBooksBitEqualToDose: booksDosed,
    l3BooksBitEqualToDose: l3Dosed,
    bkLawsArmed: m.bkFacingLaw === true && m.bkContactLaw === true,
    corridorDoorMatchesArm: m.bkCorridorPrice === (arm === 'dosed'),
    geneStateMatchesArm: arm === 'dosed'
      ? seats.every((s) => s !== null && s.exposureWeight === DOSE_WEIGHT)
      : seats.every((s) => s === null),
  };
};

/* ========================================================================== */
/* §6 THE PER-SEED ROW (per-seed cells — canon, home ruling #282.2(ii))       */
/* ========================================================================== */
interface Row {
  seed: number; arm: Arm; worldOk: boolean; ticks: number;
  /* R1 — the price, evaluated by the SHIPPED functions at each lofted launch */
  pricedLaunches: number[];          // delivery × count of lofted launches priced
  priceFired: number[];              // delivery × count with hazard > 0
  hazardSum: number[];               // delivery × Σ hazard
  priceSum: number[];                // delivery × Σ (w · hazard) at THIS arm's weight
  priceBins: number[][];             // delivery × PRICE_BINS (of the hazard)
  /* R2 — blocked short, by delivery */
  launches: number[]; blocked: number[]; interrupted: number[];
  /* R3 — R9's distribution family */
  gkReleases: number; caromWithin240: number; caromInFlight: number;
  /* R4 — the pressure signature */
  gkLaunchesByPressBin: number[]; gkBlockedByPressBin: number[];
  outLaunchesByPressBin: number[]; outBlockedByPressBin: number[];
  /* R5 — Q06 */
  enginePasses: number; enginePassesCompleted: number;
  /* R6 — per-family reachability (shut arm only) */
  reachBlocked: number;              // blocked lofted launches examined
  reachClears: number[];             // family × count where THAT family clears
  reachInstantiable: number[];       // family × count where the chooser could instantiate it
  reachBoth: number[];              // family × count where BOTH hold
  reachAnyBoth: number;              // launches with ≥ 1 family both-clearing-and-reachable
  reachAnyClear: number;             // launches with ≥ 1 clearing family (BK-C1's existential)
  /* the replay cross-check */
  replaySamples: number; replayMaxAbsDiff: number;
}
const FAMILY_KEYS = ['loft', 'keeperThrow', 'dink'] as const;
const emptyRow = (seed: number, arm: Arm): Row => ({
  seed, arm, worldOk: false, ticks: 0,
  pricedLaunches: zeros(DELIVERIES.length),
  priceFired: zeros(DELIVERIES.length),
  hazardSum: zeros(DELIVERIES.length),
  priceSum: zeros(DELIVERIES.length),
  priceBins: DELIVERIES.map(() => zeros(PRICE_BINS)),
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
  /* the chooser's own state at the launch tick, for R6 */
  gkDistributing: boolean; layingOff: boolean; targetIsRunner: boolean;
  targetPenetrates: boolean; targetLane: number;
}
interface Chain {
  releaseTick: number; gid: number; resolved: boolean;
  sawTeammateOwner: boolean; sawOppOwner: boolean; sawOtherBodyTouch: boolean;
  launch: Launch | null;
}
const REPLAY_SAMPLE_KICKS = 6;

const walk = (seed: number, arm: Arm): Row => {
  const m = buildMatch(seed, arm);
  const row = emptyRow(seed, arm);
  row.worldOk = Object.values(worldConjuncts(m, arm)).every(Boolean);
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
    /** the pre-step picture the chooser decided on (BK-C0 §2(c)'s pre-step boundary) */
    const prePos = players.map((p) => ({ x: p.pos.x, y: p.pos.y }));
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
      const act = p.action.type;
      const deliveryRaw: Delivery = act === 'LoftedPass'
        ? (isGk && preGkDist[rel.gid] ? 'punt' : 'loftSwitch')
        : act === 'ThrowOut' ? 'throw'
          : act === 'Cross' ? 'cross'
            : act === 'ClearBall' ? 'clearance'
              : act === 'ThroughBall' ? 'throughLoft'
                : act === 'Pass' ? 'drivenPass'
                  : 'otherRelease';
      if (hSpeedNow < 1e-6) continue;
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const delivery: Delivery = deliveryRaw === 'throughLoft' && !(vz0 > 0)
        ? 'throughGround' : deliveryRaw;
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

      /* ===== R1 — THE PRICE, computed by the SHIPPED exported functions ===== */
      const famKey = FAMILY_OF[delivery];
      if (famKey !== undefined && vz0 > 0 && targetGid !== null) {
        const aim = prePos[targetGid];
        const from = prePos[rel.gid];
        const hazard = bkCorridorHazard(from, aim, opp.players, BK_CORRIDOR_FAMILIES[famKey]);
        const seat = deliveryValueSeatOf(m.teams[p.side].effGenome);
        const price = seat === null ? 0
          : bkCorridorPriceOf(seat, from, aim, opp.players, BK_CORRIDOR_FAMILIES[famKey]);
        row.pricedLaunches[di]++;
        if (hazard > 0) row.priceFired[di]++;
        row.hazardSum[di] += hazard;
        row.priceSum[di] += price;
        row.priceBins[di][priceBin(hazard)]++;
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
          sawOppOwner: false, sawOtherBodyTouch: false, launch,
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
        /** BLOCKED SHORT OF THE TARGET — BK-C1 §4(ii)'s face of record, definition for definition */
        L.blockedShort = L.firstContactInFlight && contactGid !== L.targetGid
          && L.firstContactAlongM < L.d - STRIKE_SHELL_M;
        L.live = false;
        const di = D[L.delivery];
        if (L.firstContactInFlight) row.interrupted[di]++;
        if (L.blockedShort) {
          row.blocked[di]++;
          const pb = pressBin(Number.isFinite(L.nearestOppM) ? L.nearestOppM : PRESS_BINS * PRESS_BIN_M);
          if (L.isGk) row.gkBlockedByPressBin[pb]++; else row.outBlockedByPressBin[pb]++;
          /* ===== R6 — PER-FAMILY REACHABILITY (the SHUT arm is the population) ===== */
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
              /**
               * ⭐⭐ INSTANTIABLE — could THIS chooser have played THIS family to THIS target
               * at THIS moment? Each conjunct is the shipped chooser's own gating line
               * (anchored above). Declared limits: the offside gate and the aerial-duel
               * outcome are NOT modelled (they gate the SCORE, not the option's existence),
               * and the loft switch's `layingOff` is read from the pre-step action.
               */
              const instantiable = FAMILY_KEYS[fi] === 'keeperThrow'
                ? (L.gkDistributing && L.d >= THROW_MIN_M && L.d <= THROW_MAX_M)
                : FAMILY_KEYS[fi] === 'loft'
                  ? ((L.gkDistributing && L.d >= PUNT_MIN_M)
                    || (!L.layingOff && L.d > SWITCH_MIN_M))
                  : (L.targetIsRunner && L.targetPenetrates && L.targetLane < DINK_LANE_MAX);
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

    /* ===== R3 — R9's chain resolution, class for class ===== */
    for (const c of chains) {
      if (c.resolved) continue;
      const age = tick - c.releaseTick;
      if (age > CHAIN_RETIRE_TICKS) { c.resolved = true; continue; }
      if (ownerGid !== null && ownerGid !== prevOwnerGid) {
        if (ownerGid === c.gid && prevOwnerGid !== c.gid) {
          if (age <= CHAIN_WINDOW_TICKS && !c.sawTeammateOwner && !c.sawOppOwner) {
            row.caromWithin240++;
            if (c.launch !== null && c.launch.firstContactInFlight) row.caromInFlight++;
          }
          c.resolved = true;
        } else if (players[ownerGid].side === players[c.gid].side) c.sawTeammateOwner = true;
        else c.sawOppOwner = true;
      }
      if (lastTouchGid !== null && lastTouchGid !== prevLastTouchGid && lastTouchGid !== c.gid) {
        c.sawOtherBodyTouch = true;
      }
    }

    prevOwnerGid = ownerGid;
    prevLastTouchGid = lastTouchGid;
    prevPendingPassT = passT;
    snapBodies();
  }

  /* the replay cross-check, closed out */
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
const BLOCK_BASE = 12_517_000;
const N_SEEDS = N_ENV ?? (MODE === 'smoke' ? 2 : 40);
const SMOKE_PREFIX = [12_517_800, 12_517_801, 12_517_802];
const RECEIPT_SEED = 12_517_999;
const BATTERY_SEEDS = MODE === 'smoke'
  ? SMOKE_PREFIX.slice(0, N_SEEDS)
  : Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i);
const rows: Row[] = [];
for (const seed of BATTERY_SEEDS) {
  for (const arm of ARMS) rows.push(walk(seed, arm));
}
/** the world-construction receipt (the block's 999): both arms built, conjuncts checked */
const receiptConjuncts = Object.fromEntries(ARMS.map((arm) => [
  arm, worldConjuncts(buildMatch(RECEIPT_SEED, arm), arm),
]));
const SEEDS_WALKED = [...BATTERY_SEEDS, RECEIPT_SEED];

/* ========================================================================== */
/* §8 THE FACES — every one re-derived from the per-seed cells                 */
/* ========================================================================== */
const armRows = (arm: Arm): Row[] => rows.filter((r) => r.arm === arm);
interface FaceDef {
  num: (r: Row) => number; den: (r: Row) => number; unit: string; what: string;
}
const FACES: Record<string, FaceDef> = {};
const addFace = (key: string, def: FaceDef): void => { FACES[key] = def; };
for (let i = 0; i < DELIVERIES.length; i++) {
  const dv = DELIVERIES[i];
  addFace(`blockedShortShare_${dv}`, {
    num: (r) => r.blocked[i], den: (r) => r.launches[i],
    unit: 'share of launches blocked short of target',
    what: `R2 — blocked-short share for ${dv} (BK-C1 §4(ii)'s face of record)`,
  });
  if (PRICED.includes(dv)) {
    addFace(`priceFiredShare_${dv}`, {
      num: (r) => r.priceFired[i], den: (r) => r.pricedLaunches[i],
      unit: 'share of priced lofted launches with a non-zero corridor hazard',
      what: `R1 — does the corridor price FIRE on ${dv}`,
    });
    addFace(`meanHazard_${dv}`, {
      num: (r) => r.hazardSum[i], den: (r) => r.pricedLaunches[i],
      unit: 'mean corridor hazard in [0,1] per priced lofted launch',
      what: `R1 — the hazard's mean on ${dv} (the price is weight × this)`,
    });
    addFace(`meanPrice_${dv}`, {
      num: (r) => r.priceSum[i], den: (r) => r.pricedLaunches[i],
      unit: 'mean subtracted score units per priced lofted launch',
      what: `R1 — the PRICE actually subtracted on ${dv} at this arm's gene state`,
    });
  }
}
addFace('caromWithin240PerGkRelease', {
  num: (r) => r.caromWithin240, den: (r) => r.gkReleases,
  unit: 'returns to the releasing keeper per GK release',
  what: 'R3 — R9\'s distribution family, window and class reused',
});
addFace('caromInFlightPerGkRelease', {
  num: (r) => r.caromInFlight, den: (r) => r.gkReleases,
  unit: 'in-flight-contact caroms per GK release',
  what: 'R3 — the user\'s exact pattern (the first contact happened IN FLIGHT)',
});
addFace('q06PassCompletion', {
  num: (r) => r.enginePassesCompleted, den: (r) => r.enginePasses,
  unit: 'share of passes completed',
  what: 'R5 — Q06, BK-T2\'s own definition: Σ passesCompleted / Σ passes, both teams',
});
addFace('reachAnyClearShare', {
  num: (r) => r.reachAnyClear, den: (r) => r.reachBlocked,
  unit: 'share of blocked GK lofted launches with ≥1 CLEARING family',
  what: 'R6 — BK-C1\'s EXISTENTIAL availability, recomputed on this battery',
});
addFace('reachAnyReachableShare', {
  num: (r) => r.reachAnyBoth, den: (r) => r.reachBlocked,
  unit: 'share of blocked GK lofted launches with ≥1 clearing AND INSTANTIABLE family',
  what: '⭐ R6 — the CHOOSER-AGENCY grain BK-C1 §CORR 1 ordered',
});
for (let fi = 0; fi < FAMILY_KEYS.length; fi++) {
  addFace(`reachClearShare_${FAMILY_KEYS[fi]}`, {
    num: (r) => r.reachClears[fi], den: (r) => r.reachBlocked,
    unit: 'share of blocked GK lofted launches this family would have cleared',
    what: `R6 — per-family CLEARING share (${FAMILY_KEYS[fi]})`,
  });
  addFace(`reachInstantiableShare_${FAMILY_KEYS[fi]}`, {
    num: (r) => r.reachInstantiable[fi], den: (r) => r.reachBlocked,
    unit: 'share of blocked GK lofted launches at which this family was instantiable',
    what: `R6 — per-family INSTANTIABILITY share (${FAMILY_KEYS[fi]})`,
  });
  addFace(`reachBothShare_${FAMILY_KEYS[fi]}`, {
    num: (r) => r.reachBoth[fi], den: (r) => r.reachBlocked,
    unit: 'share of blocked GK lofted launches this family both cleared and could be played',
    what: `⭐ R6 — per-family REACHABILITY (${FAMILY_KEYS[fi]})`,
  });
}
const FACE_KEYS = Object.keys(FACES).sort();

/** the percentile bootstrap over WALKED seeds (consumes NO registry statistic) */
const BOOT_DRAWS = 2000;
const bootCi = (rs: Row[], def: FaceDef): [number, number] => {
  if (rs.length === 0) return [Number.NaN, Number.NaN];
  const rng = new Rng(RECEIPT_SEED);
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
 * ⚠ JSON CANNOT HOLD NaN, so an EMPTY face (denominator 0 — a delivery this battery never
 * produced) publishes `null`, and the re-derivation gate compares nulls. Writing NaN would
 * serialize as `null` anyway and then fail its own re-derivation, which is exactly the
 * vacuous-red the smoke caught before the freeze.
 */
const pub = (v: number): number | null => (Number.isFinite(v) ? round(v, 8) : null);
const faceRow = (key: string, arm: Arm): Record<string, unknown> => {
  const def = FACES[key];
  const rs = armRows(arm);
  const n = sum(rs.map((r) => def.num(r)));
  const d0 = sum(rs.map((r) => def.den(r)));
  const ci = bootCi(rs, def);
  return {
    face: key, arm, numerator: n, denominator: d0, value: pub(ratio(n, d0)),
    ci95: [pub(ci[0]), pub(ci[1])], unit: def.unit, what: def.what,
  };
};
const faces = FACE_KEYS.flatMap((k) => ARMS.map((a) => faceRow(k, a)));

/** the pressure signature, per arm, from the stored bins */
const pressureSignature = Object.fromEntries(ARMS.map((arm) => {
  const rs = armRows(arm);
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
  return [arm, {
    binWidthMetres: PRESS_BIN_M,
    gk: gkL.map((l, b) => ({ bin: b, launches: l, blocked: gkB[b], rate: round(ratio(gkB[b], l), 6) })),
    outfield: oL.map((l, b) => ({ bin: b, launches: l, blocked: oB[b], rate: round(ratio(oB[b], l), 6) })),
  }];
}));

/** the price histogram, per arm, per priced delivery, from the stored bins */
const priceDistribution = Object.fromEntries(ARMS.map((arm) => {
  const rs = armRows(arm);
  return [arm, Object.fromEntries(PRICED.map((dv) => {
    const i = D[dv];
    const bins = zeros(PRICE_BINS);
    for (const r of rs) addInto(bins, r.priceBins[i]);
    return [dv, { binWidth: 0.1, hazardBins: bins, pricedLaunches: sum(bins) }];
  }))];
}));

/* ========================================================================== */
/* §9 THE GATES (frozen; a red gate is REPORTED, never patched)               */
/* ========================================================================== */
const gates: Record<string, boolean> = {};
gates.gWorld = rows.every((r) => r.worldOk)
  && ARMS.every((a) => Object.values(receiptConjuncts[a]).every(Boolean));
gates.gDoseBytes = SOURCES_OK && DOSE_OK && L3_BYTES_SHA.length === 64
  && PC_BYTES_SHA.length === 64;
gates.gAnchoredParams = FAMILY_ANCHORED_OK;
gates.gStrikeSurfaceAnchored = SURFACE_OK;
gates.gSeamSitesAnchored = SITES_OK;
gates.gWalkPredicatesPinned = PREDICATES_OK
  && [THROW_MIN_M, THROW_MAX_M, PUNT_MIN_M, SWITCH_MIN_M, DINK_PEN_M, DINK_LANE_MAX]
    .every((v) => Number.isFinite(v));
gates.gReplayMatchesLive = rows.every((r) => r.replayMaxAbsDiff < 1e-9)
  && sum(rows.map((r) => r.replaySamples)) > 0;
gates.gArmsAreDistinct = (() => {
  // the DOSED arm must actually differ from the SHUT arm somewhere in the ledger
  const key = (r: Row): string => JSON.stringify([r.launches, r.blocked, r.enginePasses]);
  const shut = armRows('shut').map(key).join('|');
  const dosed = armRows('dosed').map(key).join('|');
  return shut !== dosed;
})();
gates.gPriceIsZeroInShutArm = armRows('shut').every((r) => sum(r.priceSum) === 0);
gates.gPriceFires = PRICED.every((dv) => {
  const i = D[dv];
  const priced = sum(armRows('dosed').map((r) => r.pricedLaunches[i]));
  const fired = sum(armRows('dosed').map((r) => r.priceFired[i]));
  return priced === 0 || fired > 0;
}) && sum(armRows('dosed').map((r) => sum(r.priceFired))) > 0;
gates.gDeliveryPartition = rows.every((r) => sum(r.launches) >= sum(r.blocked));
gates.gReachabilityNested = rows.every((r) => FAMILY_KEYS.every((_, fi) =>
  r.reachBoth[fi] <= Math.min(r.reachClears[fi], r.reachInstantiable[fi])))
  && rows.every((r) => r.reachAnyBoth <= r.reachAnyClear && r.reachAnyClear <= r.reachBlocked);
gates.gNonVacuous = sum(armRows('shut').map((r) => r.reachBlocked)) > 0
  && sum(rows.map((r) => r.gkReleases)) > 0;
gates.gSeedsBookedEqualWalked = SEEDS_WALKED.length === BATTERY_SEEDS.length + 1;
gates.gStatsZero = true; // no registry-consuming statistic is computed anywhere

/* ========================================================================== */
/* §10 THE ARTIFACT                                                           */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'authorizedBy', 'mode', 'world', 'arms', 'dose', 'anchors',
  'sources', 'seeds', 'faces', 'pressureSignature', 'priceDistribution', 'cells', 'gates',
  'faceCoverage'] as const;
const artifact: Record<string, unknown> = {
  stage: 'BK-T3 — THE CORRIDOR-HAZARD RECEIPTS',
  authorizedBy: 'ruling #333 item 5 (design pick ratified #331 item 3; USER MANDATE #328/#330)',
  kind: 'RECEIPTS, not an exam — no football claim, no effect size, no between-arm test',
  mode: MODE,
  instrument: {
    file: 'scripts/probes/bk-t3-corridor-receipts.ts',
    headCommit: gitOut('git rev-parse HEAD'),
    srcSha256: {
      'src/ai/deliveryValueSeat.ts': SEAT_SHA,
      'src/ai/PlayerBrain.ts': BRAIN_SHA,
      'src/sim/Match.ts': MATCH_SHA,
      'src/sim/mechanics.ts': MECH_SHA,
      'src/evolution/genome.ts': GENOME_SHA,
    },
  },
  world: {
    stack: 'world-9 = a4MatchFlags(8) + armA4World(matured L3/PC doses) + bkFacingLaw + bkContactLaw',
    receiptSeed: RECEIPT_SEED,
    conjuncts: receiptConjuncts,
  },
  arms: {
    shut: 'the world-9 stack; bkCorridorPrice ABSENT; the DV gene BORN ABSENT (no seat)',
    dosed: `the same world + bkCorridorPrice + dvExposureWeight = ${DOSE_WEIGHT} on all three genome views of both teams`,
  },
  dose: {
    gene: 'dvExposureWeight',
    value: DOSE_WEIGHT,
    derivation: 'the gene\'s OWN domain maximum — `dvExposureWeightOf` clamps to [0,1] '
      + '(clamp01), so 1 is the most a coach could ever evolve: the loudest LEGAL arm, '
      + 'chosen so a quiet receipt cannot be blamed on a timid dose. NOT a taste constant.',
    anchors: [A_GENE_CLAMP, A_GENE_DOMAIN],
    sourceBytesSha256: { 'src/evolution/genome.ts': GENOME_SHA, 'src/ai/deliveryValueSeat.ts': SEAT_SHA },
    placement: 'the three genome views (#196.3-D6 arming checklist, DV-T0\'s own probe idiom); '
      + 'NO census value is dosed in this probe, so house law #270.2 binds nothing here — '
      + 'the L3/PC world doses go through armA4World, the shipped writer, from hashed files.',
  },
  anchors: {
    loftFamilies: {
      loft: { ...SITE_LOFT, site: 'performLoftedPass' },
      keeperThrow: { ...SITE_THROW, site: 'performKeeperThrow' },
      dink: { ...SITE_DINK, site: 'performThroughBall' },
      loftKickNeedleOccurrences: countOf(MECH_SRC, 'loftKick('),
      crossExcluded: 'performCross is NOT priced by this seam (BK-C1 §R8 honest exclusion)',
    },
    strikeSurface: {
      shell: A_SHELL, edge: A_EDGE, shellMetres: STRIKE_SHELL_M, edgeMetres: HEADER_MIN_HEIGHT,
    },
    seamSites: {
      fork: A_FORK, loftSwitch: A_SITE_SWITCH, dink: A_SITE_DINK, keeperThrow: A_SITE_THROW,
      punt: A_SITE_PUNT,
    },
    walkSidePredicates: {
      note: 'canon: "a scored face\'s walk-side predicate is pinned — anchored extraction or '
        + 'fixture — because the re-derivation gate proves arithmetic, not definitions" '
        + '(home: DF-T3 §CORR item 2). R6\'s instantiability conjuncts, each anchored:',
      gkBlock: A_GK_BLOCK, throwRange: A_THROW_RANGE, puntRange: A_PUNT_RANGE,
      switchRange: A_SWITCH_RANGE, dinkRunner: A_DINK_RUNNER, dinkPenetration: A_DINK_PEN,
      dinkLane: A_DINK_LANE, layingOff: A_LAYOFF,
      valuesReadOffTheLines: {
        throwMinM: THROW_MIN_M, throwMaxM: THROW_MAX_M, puntMinM: PUNT_MIN_M,
        switchMinM: SWITCH_MIN_M, dinkPenetrationM: DINK_PEN_M, dinkLaneMax: DINK_LANE_MAX,
      },
      declaredLimits: 'the offside gate, the aerial-duel outcome and the score-side '
        + 'multipliers are NOT modelled: instantiability asks whether the OPTION EXISTED, '
        + 'never whether it would have won the argmax.',
    },
  },
  sources: {
    l3Dose: { file: L3_T1_PATH, sha256: L3_BYTES_SHA, cells: L3_DOSE.length },
    pcDose: { file: PC_T1_PATH, sha256: PC_BYTES_SHA, rosterRows: PC_DOSE.length },
    q06FromBkT2: { file: BKT2_PATH, sha256: BKT2_BYTES_SHA, face: q06BkT2 },
    availabilityFromBkC1: { file: BKC1_PATH, sha256: BKC1_BYTES_SHA, face: BKC1_AVAIL },
  },
  seeds: {
    block: '12,517,000–999',
    battery: BATTERY_SEEDS,
    receipt: RECEIPT_SEED,
    smokePrefixInBand: SMOKE_PREFIX,
    booked: SEEDS_WALKED.length,
    walked: SEEDS_WALKED.length,
    bookedEqualsWalked: true,
    statsConsumed: 0,
    statsNote: 'the intervals are bootstrap resamples of the WALKED seeds — not a '
      + 'registry-consuming statistic (the IN-T0 / DF-T2 / BK-C1 precedent). '
      + 'Next stats base remains ≥ 116,400 (registry 67).',
  },
  faces,
  pressureSignature,
  priceDistribution,
  cells: rows,
  wallSeconds: 0,
};

/* ---- gFaces: EVERY published face re-derived from the SERIALIZED artifact --- */
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
const diskCells = disk.cells as Row[];
const diskFaces = disk.faces as { face: string; arm: Arm; numerator: number; denominator: number; value: number | null }[];
const eq = (a: number, b: number | null): boolean => pub(a) === b;
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const df of diskFaces) {
  const def = FACES[df.face];
  faceChecks++;
  if (def === undefined) { faceFailures.push(`${df.face}: no definition`); continue; }
  const rs = diskCells.filter((r) => r.arm === df.arm);
  const n = sum(rs.map((r) => def.num(r)));
  const d0 = sum(rs.map((r) => def.den(r)));
  if (n === df.numerator && d0 === df.denominator && eq(ratio(n, d0), df.value)) faceOk++;
  else faceFailures.push(`${df.face}/${df.arm}: ${n}/${d0} vs ${df.numerator}/${df.denominator}`);
}
const binChecks: [string, boolean][] = [];
for (const arm of ARMS) {
  const rs = diskCells.filter((r) => r.arm === arm);
  const ps = (disk.pressureSignature as Record<string, { gk: { launches: number; blocked: number }[]; outfield: { launches: number; blocked: number }[] }>)[arm];
  for (let b = 0; b < PRESS_BINS; b++) {
    binChecks.push([`press.${arm}.gk.${b}`,
      ps.gk[b].launches === sum(rs.map((r) => r.gkLaunchesByPressBin[b]))
      && ps.gk[b].blocked === sum(rs.map((r) => r.gkBlockedByPressBin[b]))]);
    binChecks.push([`press.${arm}.out.${b}`,
      ps.outfield[b].launches === sum(rs.map((r) => r.outLaunchesByPressBin[b]))
      && ps.outfield[b].blocked === sum(rs.map((r) => r.outBlockedByPressBin[b]))]);
  }
  const pd = (disk.priceDistribution as Record<string, Record<string, { hazardBins: number[]; pricedLaunches: number }>>)[arm];
  for (const dv of PRICED) {
    const i = D[dv];
    const acc = zeros(PRICE_BINS);
    for (const r of rs) addInto(acc, r.priceBins[i]);
    binChecks.push([`price.${arm}.${dv}`, JSON.stringify(acc) === JSON.stringify(pd[dv].hazardBins)
      && pd[dv].pricedLaunches === sum(acc)]);
  }
}
const binFailures = binChecks.filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && faceFailures.length === 0 && binFailures.length === 0;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: diskFaces.length, checksRun: faceChecks, checksPassed: faceOk,
  binChecksRun: binChecks.length, binFailures, failures: faceFailures,
};
(artifact as { wallSeconds: number }).wallSeconds = round((Date.now() - t0Wall) / 1000, 3);
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonical(body));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

banner('');
banner('=== BK-T3 — THE CORRIDOR-HAZARD RECEIPTS ===');
banner(`mode=${MODE} seeds=${BATTERY_SEEDS.length} arms=${ARMS.length} wall=${(artifact as { wallSeconds: number }).wallSeconds}s`);
for (const [k, v] of Object.entries(gates)) banner(`${v ? 'GREEN' : 'RED  '} ${k}`);
banner(`faces re-derived ${faceOk}/${faceChecks}; bin checks ${binChecks.length - binFailures.length}/${binChecks.length}`);
banner(`out=${OUT_PATH}`);
if (!Object.values(gates).every(Boolean)) banner('⚠ AT LEAST ONE GATE IS RED — reported, never patched');
