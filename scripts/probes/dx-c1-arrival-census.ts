/**
 * ⭐⭐ DX-C1 — THE ARRIVAL CENSUS (docs/world-model/DX-C1-ARRIVAL-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #355 item 2 (#354 item 4's NAMED UNBUILT PROBE), bound by
 * docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md. Predecessor:
 * docs/world-model/DX-T1-EXPRESSION-EXAM.md (freeze 324c9c2 → results c68a35f → rider bd6384e;
 * artifact docs/world-model/data/dx-t1-expression-exam.json) — THIS CENSUS DISSECTS ITS ARMED
 * ARM. Form of record: docs/world-model/BK-C2-CAROM-CENSUS.md.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis, arms no mechanism
 * and adjudicates nothing — it PICKS the fix by measuring, and the commander rules.
 *
 * ONE ARM ONLY — the DX-T1 ARMED composition:
 *   a4MatchFlags(11) + `dlcDeliveryChoice` + `dlcStrikePlane` + `bkGroundCorridor`
 *   + `dxWindupAim` + armA4World(m, null, 11) + `passLeadSupport` = 1 MATCH-LOCAL
 * DX-T1's SHUT arm is NOT re-walked; its published faces are DIFFERENT-BATTERY CONTEXT and are
 * labelled so wherever they appear.
 *
 * THE FOUR FROZEN QUESTION GROUPS (#355 item 2, verbatim scope):
 *   (a) COMPLETION BY CARRY CLASS — carried-election wind-up vs to-feet wind-up vs
 *       synchronous (led / to-feet), each with completion rate, interval and volume share.
 *   (b) ARRIVAL ANATOMY AT THE LED POINT — per carried pass: the receiver's distance to the
 *       elected point at BALL ARRIVAL, reached/arriving/abandoned, the lane's state re-derived
 *       at BOTH instants (election tick vs strike tick), and the outcome.
 *   (c) THE STALENESS–OUTCOME LINK — completion binned by world-motion-during-windup, the
 *       DISCRIMINATING FACE, with its rule stated IN THE FREEZE and the wind-up-length
 *       confound handled BK-C2 §P.5's way (motion-within-length strata).
 *   (d) THE COUNTERFACTUAL RE-ASK READ — offline, from stored state: would the strike-time
 *       world elect a DIFFERENT displacement. ⚠ SCOPED AND SAID SO (§P.D): the argmax is NOT
 *       re-run and the PERCEPT motion source is NOT re-derivable offline.
 *
 * ⛔ X-SRC-ZERO. No file under `src/` is edited. The probe CALLS the shipped exports —
 * `laneOpenness`, `groundShellHazard`, `passLeadOffset` (the PTP law itself, with a TRUTH seat),
 * `closestPointOnSegment`, `a4MatchFlags` / `armA4World`, `passLeadSupportWeight` — and reads
 * Match state and `bkContactLedger` per tick. Observation wrappers follow the DX-T1 §DEV 3
 * precedent: they delegate unchanged and `gLockstep` proves them byte-inert.
 * `gSrcUntouched` proves it against `git diff --stat HEAD -- src` AND
 * `git status --porcelain -- src`.
 *
 * ⭐ CANON, COPIED FROM docs/world-model/CANON.md beside its ACTUAL HOME (#301) — see the doc's
 * §CORRECTIONS-READ table, which is the authority for what binds here.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, corridorArmedVersion,
  CORRIDOR_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT,
} from '../../src/game/a4World';
import { laneOpenness } from '../../src/ai/perception';
import { groundShellHazard } from '../../src/ai/deliveryValueSeat';
import {
  passLeadOffset, PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL,
  type PassLeadSeat,
} from '../../src/ai/passLeadSeat';
import { dist, type V2 } from '../../src/utils/vec';
import {
  passLeadSupportWeight, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the DX-T1 §P8 item 3 form                  */
/* ========================================================================== */
const ENV_WHITELIST = ['DXC1_MODE', 'DXC1_N', 'DXC1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('DXC1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`DX-C1 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.DXC1_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('DX-C1 FATAL — DXC1_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.DXC1_N !== undefined ? Number(process.env.DXC1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('DX-C1 FATAL — DXC1_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.DXC1_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`DXC1_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`DXC1_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`DXC1_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/dx-c1-arrival-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/dx-c1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
/** ⛔ AN OVERRIDE RUN CAN NEVER WRITE A CANONICAL PATH (the #348 §CORR 2 order, DX-T1's form) */
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('DX-C1 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS                                                            */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'ERROR'; }
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
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
/** signed bin: index 0 = ≤ −half, index n−1 = ≥ +half; centre bin holds 0 */
const signedBinOf = (v: number, width: number, n: number): number => {
  const half = Math.floor(n / 2);
  const i = half + Math.round(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const canonicalJson = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      return Object.keys(o).sort().reduce<Record<string, unknown>>(
        (acc, k) => { acc[k] = walk(o[k]); return acc; }, {},
      );
    }
    return x;
  };
  return JSON.stringify(walk(v));
};

/* ========================================================================== */
/* §3 THE ANCHORED SITES — anchored match + line receipt, never first-occurrence */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const SEAT_PATH = 'src/ai/passLeadSeat.ts';
const CONST_PATH = 'src/sim/constants.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const CONST_SRC = readFileSync(CONST_PATH, 'utf8');
const A4_SRC = readFileSync('src/game/a4World.ts', 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};

/** ⭐⭐ THE STRUCTURAL FACT THIS CENSUS IS BUILT AROUND — pinned character-for-character.
 *  `performPass` re-reads the receiver's position AT STRIKE TIME and adds the carried lead to
 *  it. So the ANCHOR of a wound-up led pass is FRESH; only the DISPLACEMENT VECTOR is
 *  arm-time. Every staleness statement below is a statement about the LEAD VECTOR alone. */
const STRUCK_LEAD_NEEDLE = '  const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));';
const STRUCK_LEAD_HITS = occurrences(MECH_SRC, STRUCK_LEAD_NEEDLE);
const STRUCK_AIM_NEEDLE = '  const lead = ptpLead === null ? struckLead\n'
  + '    : v2(struckLead.x + ptpLead.x, struckLead.y + ptpLead.y);';
const STRUCK_AIM_HITS = occurrences(MECH_SRC, STRUCK_AIM_NEEDLE);

/** the chooser's own open-lane dividing line — BK-C2 §P.4's anchored extraction, inherited */
const LANE_GATE_NEEDLE = 'if (gain > 0.15 && lane < 0.4) {';
const LANE_GATE_HITS = occurrences(BRAIN_SRC, LANE_GATE_NEEDLE);
const LANE_GATE_RE = /if \(gain > [0-9.]+ && lane < ([0-9.]+)\) \{/;
const LANE_GATE_MATCH = LANE_GATE_RE.exec(BRAIN_SRC);
const OPEN_LANE_THRESHOLD = LANE_GATE_MATCH === null ? Number.NaN : Number(LANE_GATE_MATCH[1]);

/** the PTP law's own two constants — the seat this census re-derives (d) with */
const PTP_SPEED_NEEDLE = 'export const PTP_FLIGHT_SPEED = ';
const PTP_SPEED_HITS = occurrences(SEAT_SRC, PTP_SPEED_NEEDLE);
const PTP_MUL_NEEDLE = 'export const PTP_LEAD_FLIGHT_MUL = ';
const PTP_MUL_HITS = occurrences(SEAT_SRC, PTP_MUL_NEEDLE);
/** the reach anchor the arrival classes are cut on */
const CONTROL_R_NEEDLE = 'export const CONTROL_RADIUS = ';
const CONTROL_R_HITS = occurrences(CONST_SRC, CONTROL_R_NEEDLE);

/** the DX seam sites — DX-T1 §P8's `gSeamSitesPinned`, re-asserted at battery time */
const DX_FORK_NEEDLE = '        if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {';
const DX_FORK_HITS = occurrences(BRAIN_SRC, DX_FORK_NEEDLE);
const DX_ARM_NEEDLE = '      this.dxWindupAim && dxDeposit !== null';
const DX_ARM_HITS = occurrences(MATCH_SRC, DX_ARM_NEEDLE);
const DX_RESOLVE_NEEDLE = '    this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);';
const DX_RESOLVE_HITS = occurrences(MATCH_SRC, DX_RESOLVE_NEEDLE);
const DX_DEPOSIT_WRITES = (BRAIN_SRC.match(/match\.dxStrikeAim = \{/g) ?? []).length;
const ARM_DEFS = (MATCH_SRC.match(/armPendingPass\(/g) ?? []).length; // the ONE definition
const BRAIN_ARM_CALLS = (BRAIN_SRC.match(/match\.armPendingPass\(/g) ?? []).length;
const GC_FORK_NEEDLE = '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;';
const GC_FORK_HITS = occurrences(BRAIN_SRC, GC_FORK_NEEDLE);
const DLC_FORK_NEEDLE = '  const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const DLC_FORK_HITS = occurrences(BRAIN_SRC, DLC_FORK_NEEDLE);
const SP_FORK_NEEDLE = '  const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const SP_FORK_HITS = occurrences(BRAIN_SRC, SP_FORK_NEEDLE);
const DOORS_ABSENT_FROM_A4 = !A4_SRC.includes('dxWindupAim') && !A4_SRC.includes('dxStrikeAim')
  && !A4_SRC.includes('bkGroundCorridor') && !A4_SRC.includes('dlcDeliveryChoice')
  && !A4_SRC.includes('dlcStrikePlane');

const SEAM_OK = DX_FORK_HITS.length === 1 && DX_ARM_HITS.length === 1
  && DX_RESOLVE_HITS.length === 1 && DX_DEPOSIT_WRITES === 1 && ARM_DEFS === 1
  && BRAIN_ARM_CALLS === 1 && GC_FORK_HITS.length === 1 && DLC_FORK_HITS.length === 1
  && SP_FORK_HITS.length === 1 && DOORS_ABSENT_FROM_A4;
const ANCHORS_OK = STRUCK_LEAD_HITS.length === 1 && STRUCK_AIM_HITS.length === 1
  && LANE_GATE_HITS.length === 1 && OPEN_LANE_THRESHOLD === 0.4
  && PTP_SPEED_HITS.length === 1 && PTP_MUL_HITS.length === 1 && CONTROL_R_HITS.length === 1
  && PTP_FLIGHT_SPEED === 18 && PTP_LEAD_FLIGHT_MUL === 1.6;

/* ========================================================================== */
/* §4 THE PREDECESSOR'S BYTES — hashed BEFORE parsing (canon: dose-source guard) */
/* ========================================================================== */
const DXT1_PATH = 'docs/world-model/data/dx-t1-expression-exam.json';
const DXT1_BYTES = readFileSync(DXT1_PATH, 'utf8');
const DXT1_SHA = sha(DXT1_BYTES);
const DXT1 = JSON.parse(DXT1_BYTES) as {
  stage: { instrumentSha256: string; headAtRun: string };
  hashedBodySha256: string;
  faces: { face: string; value: number; ci95?: [number, number];
    ciLo?: number; ciHi?: number; numerator: number; denominator: number }[];
};
const dxt1Face = (k: string): { value: number; numerator: number; denominator: number } => {
  const f = DXT1.faces.find((x) => x.face === k);
  if (f === undefined) { banner(`DX-C1 FATAL — DX-T1 face missing: ${k}`); process.exit(3); }
  return f!;
};
/** ⭐ THE SIZING SOURCE, READ OUT OF THE ARTIFACT'S OWN FIELDS — never re-typed from prose */
const DXT1_CARRIED = dxt1Face('armed.altCarriedShare');
const DXT1_CARRIED_NUM = DXT1_CARRIED.numerator;      // 4504 carried flights
const DXT1_CARRIED_DEN = DXT1_CARRIED.denominator;    // 34609 wind-up-seat measured ground passes
const DXT1_COMPLETION = dxt1Face('armed.passCompletion');
const DXT1_QUOTED_OK = DXT1_SHA.length === 64 && DXT1.hashedBodySha256.length === 64
  && DXT1_CARRIED_NUM > 0 && DXT1_CARRIED_DEN > 0
  && Number.isFinite(DXT1_COMPLETION.value);

/* ========================================================================== */
/* §5 SEEDS — block 12,528,000–999, sub-bands declared at §P                    */
/* ========================================================================== */
const BLOCK_BASE = 12_528_000;
const BLOCK_TOP = 12_528_999;
const N_FROZEN = 800;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_000_700;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + 100 + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 90 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE, SCRATCH_BASE + 1, SCRATCH_BASE + 2];

/* ========================================================================== */
/* §6 THE ARM — the DX-T1 ARMED composition, the world's own composer CALLED    */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const DLC_GENE_VALUE = 1;
/** DX-T1 §4's own MATCH-LOCAL dose idiom, byte for byte (canon: dose placement, #270.2) */
const setPassLeadLocal = (match: Match, side: Side, value: number): void => {
  const team = match.teams[side];
  const view = { ...team.baseGenome, passLeadSupport: value } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
};
const buildMatch = (seed: number): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(CORRIDOR_WORLD_VERSION),
    dlcDeliveryChoice: true, dlcStrikePlane: true,
    bkGroundCorridor: true, dxWindupAim: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, CORRIDOR_WORLD_VERSION);
  for (const side of [0, 1] as const) setPassLeadLocal(m, side, DLC_GENE_VALUE);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed (canon, #334 item 2)      */
/* ========================================================================== */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
/** DX-T1 / BK-C2's release classifier, byte for byte in substance */
const klassOf = (d: StatDelta, pendingChangedHere: boolean): Klass | null => {
  let klass: Klass | null = null;
  if (d.shots > 0) klass = d.headersWon > 0 ? 'headerShot' : 'shot';
  if (d.clearances > 0 && klass === null) {
    klass = d.headersWon > 0 ? 'headerClearance' : 'clearance';
  }
  if (d.passes > 0 && klass === null) {
    klass = d.crosses > 0 ? 'cross'
      : d.cutbacks > 0 ? 'cutback'
        : d.throughBalls > 0 ? 'throughBall'
          : d.longBalls > 0 ? 'loftedPass' : 'shortPass';
  }
  if (d.headersWon > 0 && klass === null) klass = 'headerKnockdown';
  if (klass === null && pendingChangedHere) klass = 'other';
  return klass;
};
const isDelivery = (k: Klass): boolean =>
  k !== 'shot' && k !== 'headerShot' && k !== 'headerKnockdown' && k !== 'headerClearance';
const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>
  grounded || !(vzAfterGravity > 0);
const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>
  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');

/** ⭐⭐ (a)'s FROZEN CARRY CLASSES — the partition every (a) face is defined on. */
const CARRY_CLASSES = ['carried', 'windupToFeet', 'syncLed', 'syncToFeet', 'otherGround'] as const;
type CarryClass = (typeof CARRY_CLASSES)[number];
/**
 * `viaPerformPass` — the release ran through `performPass` (shortPass; the ONE call site the
 * wind-up resolves through and the ONE synchronous led-strike statement both land here).
 * `fromWindup`  — the call came from inside `resolvePendingPassWindup` (a WIND-UP SEAT).
 * `leadMetres`  — the `ptpLead` argument's magnitude (0 when null).
 * ⛔ A measured ground pass that is NOT a `performPass` release (throughBall / cutback) is
 * `otherGround`: it has no wind-up seat and this door can never carry for it. Published, never
 * folded into a wind-up class.
 */
const carryClassOf = (
  viaPerformPass: boolean, fromWindup: boolean, leadMetres: number,
): CarryClass => {
  if (!viaPerformPass) return 'otherGround';
  if (fromWindup) return leadMetres > 0 ? 'carried' : 'windupToFeet';
  return leadMetres > 0 ? 'syncLed' : 'syncToFeet';
};

/** ⭐ THE FROZEN OUTCOME LADDER — first terminal event wins; `caromed` is ORTHOGONAL (§P.B). */
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');

/** ⭐ (b)'s FROZEN ARRIVAL CLASSES, cut on the ANCHORED `CONTROL_RADIUS` */
const REACH_M = CONTROL_RADIUS;
const ARRIVING_M = 3 * CONTROL_RADIUS;
const ARRIVAL_CLASSES = ['reached', 'arriving', 'abandoned', 'neverReached'] as const;
type ArrivalClass = (typeof ARRIVAL_CLASSES)[number];
/**
 * `reached`     — the receiver is inside the engine's own control radius of the elected point
 *                 when the ball gets there;
 * `arriving`    — outside it but INSIDE 3× it AND CLOSING (nearer than he was at the strike);
 * `abandoned`   — anything else the ball reached;
 * `neverReached`— the flight died before the ball travelled as far as the elected point.
 * ⚠ THE CUTS ARE BIN EDGES ON AN ANCHORED CONSTANT, NOT MEASUREMENT THRESHOLDS: the FULL
 * distance histogram is stored per seed, so any other cut re-derives off disk.
 */
const arrivalClassOf = (
  reachedPoint: boolean, distAtArrival: number, distAtStrike: number,
): ArrivalClass => {
  if (!reachedPoint) return 'neverReached';
  if (distAtArrival < REACH_M) return 'reached';
  if (distAtArrival < ARRIVING_M && distAtArrival < distAtStrike) return 'arriving';
  return 'abandoned';
};

/** ⭐ (d)'s FROZEN AGREEMENT CLASSES on the re-ask delta, in metres */
const AGREE_CLASSES = ['agree', 'minor', 'disagree'] as const;
type AgreeClass = (typeof AGREE_CLASSES)[number];
const agreeClassOf = (deltaMetres: number): AgreeClass =>
  (deltaMetres < 0.5 ? 'agree' : deltaMetres < 1.5 ? 'minor' : 'disagree');

/* --- THE COMPOSITION FIXTURES (canon: a headline-bearing predicate needs one) --- */
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.cutback', klassOf({ ...D0, passes: 1, cutbacks: 1 }, false), 'cutback');
fx('klassOf.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klassOf.loftedPass', klassOf({ ...D0, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klassOf.cross', klassOf({ ...D0, passes: 1, crosses: 1 }, false), 'cross');
fx('klassOf.shotBeatsPass', klassOf({ ...D0, shots: 1, passes: 1 }, false), 'shot');
fx('klassOf.headerKnockdown', klassOf({ ...D0, headersWon: 1 }, false), 'headerKnockdown');
fx('klassOf.other', klassOf(D0, true), 'other');
fx('klassOf.null', klassOf(D0, false), null);
fx('isDelivery.shot', isDelivery('shot'), false);
fx('isDelivery.shortPass', isDelivery('shortPass'), true);
fx('isGroundLaunch.grounded', isGroundLaunch(true, 5), true);
fx('isGroundLaunch.rising', isGroundLaunch(false, 0.5), false);
fx('isGroundLaunch.falling', isGroundLaunch(false, -0.5), true);
fx('measurable.shortPass', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.cutback', isMeasurableGroundPass('cutback', true, true), true);
fx('measurable.crossExcluded', isMeasurableGroundPass('cross', true, true), false);
fx('measurable.noTarget', isMeasurableGroundPass('shortPass', true, false), false);
fx('carryClassOf.carried', carryClassOf(true, true, 3.2), 'carried');
fx('carryClassOf.windupToFeetNull', carryClassOf(true, true, 0), 'windupToFeet');
fx('carryClassOf.syncLed', carryClassOf(true, false, 1.1), 'syncLed');
fx('carryClassOf.syncToFeet', carryClassOf(true, false, 0), 'syncToFeet');
fx('carryClassOf.otherGround', carryClassOf(false, false, 0), 'otherGround');
fx('carryClassOf.otherGroundNeverWindup', carryClassOf(false, true, 4), 'otherGround');
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.intercepted', outcomeOf(false, true, true), 'intercepted');
fx('outcomeOf.out', outcomeOf(false, false, true), 'out');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');
fx('arrivalClassOf.never', arrivalClassOf(false, 0, 0), 'neverReached');
fx('arrivalClassOf.reached', arrivalClassOf(true, REACH_M * 0.5, 9), 'reached');
fx('arrivalClassOf.arriving', arrivalClassOf(true, REACH_M * 1.5, 9), 'arriving');
fx('arrivalClassOf.abandonedFar', arrivalClassOf(true, ARRIVING_M + 1, 99), 'abandoned');
fx('arrivalClassOf.abandonedNotClosing', arrivalClassOf(true, REACH_M * 1.5, 1), 'abandoned');
fx('agreeClassOf.agree', agreeClassOf(0.49), 'agree');
fx('agreeClassOf.minor', agreeClassOf(0.5), 'minor');
fx('agreeClassOf.disagree', agreeClassOf(1.5), 'disagree');
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed)   */
/* ========================================================================== */
/** (b) receiver-to-elected-point distance at ball arrival: 1 m bins, last = ≥ 9 m overflow */
const ARR_BIN_M = 1;
const ARR_BINS = 10;
/** (c) THE MOTION METRIC's bins: 0.25 m bins, last = ≥ 2.75 m overflow */
const MOTION_BIN_M = 0.25;
const MOTION_BINS = 12;
/** (c) the wind-up-LENGTH strata the motion face is answered WITHIN: 3-tick bins, ≥ 27 overflow */
const WTICK_BIN = 3;
const WTICK_BINS = 10;
/** (d) the re-ask delta: 0.5 m bins, last = ≥ 6 m overflow */
const REASK_BIN_M = 0.5;
const REASK_BINS = 13;
/** the carried lead's own magnitude: DX-T1's own histogram bins, inherited */
const LEAD_BIN_M = 0.5;
const LEAD_BINS = 13;
/** signed lane / hazard deltas (strike − election): 0.1 wide, 11 bins, centre holds 0 */
const DELTA_BIN = 0.1;
const DELTA_BINS = 11;
const FLIGHT_RETIRE_TICKS = 720; // R9's own retire cap, inherited (BK-C1 §3)

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon, home ruling #282.2(ii))        */
/* ========================================================================== */
const CI = (c: CarryClass): number => CARRY_CLASSES.indexOf(c);
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);
const AI = (a: ArrivalClass): number => ARRIVAL_CLASSES.indexOf(a);
const GI = (a: AgreeClass): number => AGREE_CLASSES.indexOf(a);

interface Row {
  worldOk: boolean; armedVersion: number; flagsOk: boolean; geneOk: boolean; genomeClean: boolean;
  ticks: number; matches: number; wallMs: number;
  /* engine receipts (never football findings) */
  ledStrikesApplied: number; strikes: number; strikesUnattributed: number;
  depCaptures: number; depCarriedOk: number; depNullOk: number; depMismatch: number;
  depResolves: number; depResolveOk: number; depResolveMismatch: number;
  /* the population */
  deliveries: number; gpMeasured: number;
  /* (a) carry class × outcome */
  byClass: number[];                       // [CARRY_CLASSES]
  byClassOutcome: number[][];              // [CARRY_CLASSES][OUTCOMES]
  byClassCaromed: number[];                // caromed flights per class (ORTHOGONAL)
  byClassToIntended: number[];             // completed BY THE INTENDED RECEIVER
  /* (b) arrival anatomy — CARRIED passes only */
  carriedWithAnatomy: number;
  arrDistBins: number[];                   // receiver→elected point at ball arrival
  arrClass: number[];                      // [ARRIVAL_CLASSES]
  arrClassOutcome: number[][];             // [ARRIVAL_CLASSES][OUTCOMES]
  arrDistSum: number; arrDistN: number;
  leadBins: number[]; leadSum: number;
  /* the lane re-derived at BOTH instants */
  laneElectSum: number; laneStrikeSum: number; laneDeltaBins: number[];
  shellBlockedElect: number; shellBlockedStrike: number;
  shellDeltaBins: number[];                // −1 / 0 / +1 mapped through signedBinOf
  recvDispSum: number; defDispSum: number; windupTicksSum: number;
  /* (c) the staleness–outcome link */
  motionBins: number[];                    // carried flights by motion bin
  motionCompleted: number[];               // completed among them
  motionJoint: number[][];                 // [WTICK][MOTION] flights
  motionJointCompleted: number[][];
  motionUpperN: number; motionUpperC: number;   // within-strata split (frozen indices)
  motionLowerN: number; motionLowerC: number;
  motionRawUpperN: number; motionRawUpperC: number;
  motionRawLowerN: number; motionRawLowerC: number;
  /* (d) the counterfactual re-ask */
  reAskN: number; reAskBins: number[]; reAskSum: number;
  agreeClass: number[]; agreeCompleted: number[];
  perceptGapN: number; perceptGapSum: number; perceptGapBins: number[];
  reAskGrewN: number; reAskShrankN: number;
  /* the game faces (context, per match) */
  goals: number; passes: number; passesCompleted: number; interceptions: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, flagsOk: false, geneOk: false, genomeClean: false,
  ticks: 0, matches: 1, wallMs: 0,
  ledStrikesApplied: 0, strikes: 0, strikesUnattributed: 0,
  depCaptures: 0, depCarriedOk: 0, depNullOk: 0, depMismatch: 0,
  depResolves: 0, depResolveOk: 0, depResolveMismatch: 0,
  deliveries: 0, gpMeasured: 0,
  byClass: zeros(CARRY_CLASSES.length),
  byClassOutcome: zeros2(CARRY_CLASSES.length, OUTCOMES.length),
  byClassCaromed: zeros(CARRY_CLASSES.length),
  byClassToIntended: zeros(CARRY_CLASSES.length),
  carriedWithAnatomy: 0,
  arrDistBins: zeros(ARR_BINS), arrClass: zeros(ARRIVAL_CLASSES.length),
  arrClassOutcome: zeros2(ARRIVAL_CLASSES.length, OUTCOMES.length),
  arrDistSum: 0, arrDistN: 0,
  leadBins: zeros(LEAD_BINS), leadSum: 0,
  laneElectSum: 0, laneStrikeSum: 0, laneDeltaBins: zeros(DELTA_BINS),
  shellBlockedElect: 0, shellBlockedStrike: 0, shellDeltaBins: zeros(3),
  recvDispSum: 0, defDispSum: 0, windupTicksSum: 0,
  motionBins: zeros(MOTION_BINS), motionCompleted: zeros(MOTION_BINS),
  motionJoint: zeros2(WTICK_BINS, MOTION_BINS),
  motionJointCompleted: zeros2(WTICK_BINS, MOTION_BINS),
  motionUpperN: 0, motionUpperC: 0, motionLowerN: 0, motionLowerC: 0,
  motionRawUpperN: 0, motionRawUpperC: 0, motionRawLowerN: 0, motionRawLowerC: 0,
  reAskN: 0, reAskBins: zeros(REASK_BINS), reAskSum: 0,
  agreeClass: zeros(AGREE_CLASSES.length), agreeCompleted: zeros(AGREE_CLASSES.length),
  perceptGapN: 0, perceptGapSum: 0, perceptGapBins: zeros(REASK_BINS),
  reAskGrewN: 0, reAskShrankN: 0,
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0,
});

/** ⭐ THE PER-FLIGHT RECORDS a walk yields — kept per match so the (c) strata can be applied
 *  in a SECOND pass, after the pooled split indices are frozen from the pooled table. */
interface Booked {
  klass: CarryClass; outcome: Outcome; caromed: boolean; toIntended: boolean;
  /* carried-only anatomy (null on every other class) */
  arrival: ArrivalClass | null; arrDist: number; leadMetres: number;
  laneElect: number; laneStrike: number; shellElect: boolean; shellStrike: boolean;
  recvDisp: number; defDisp: number; windupTicks: number;
  reAskDelta: number | null; perceptGap: number | null;
  reAskArmMag: number; reAskStrikeMag: number;
}

/* ========================================================================== */
/* §10 THE WALK — one match; pure reads + the shipped exports CALLED            */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'longBalls', 'crosses', 'throughBalls',
  'cutbacks', 'clearances', 'shots', 'headersWon', 'interceptions', 'tackles', 'goals'] as const;
type StatKey = (typeof STAT_KEYS)[number];

/** the TRUTH seat — `perceived:false`, so `passLeadOffset` reads `mate.vel` and NOTHING is
 *  pulled off the match (⛔ `perceivedSnapshot` RECONSTRUCTS memory in place: §P.D). */
const TRUTH_SEAT: PassLeadSeat = { weight: DLC_GENE_VALUE, perceived: false, snapshot: null };

interface ArmState {
  tick: number; targetGid: number; readyTick: number;
  aimX: number; aimY: number;               // the record's own arm-time aim (= mate.pos)
  matePosX: number; matePosY: number;
  truthLeadX: number; truthLeadY: number;   // passLeadOffset at the ELECTION instant, truth motion
  nearestDefGid: number; nearestDefX: number; nearestDefY: number;
}
interface StrikeState {
  gid: number; tick: number; fromWindup: boolean; leadMetres: number;
  leadX: number; leadY: number; targetGid: number;
  arm: ArmState | null;
  electX: number; electY: number;           // the ELECTED POINT: record.aim + aimLead
  laneElect: number; shellElect: boolean;
  laneStrike: number; shellStrike: boolean;
  recvDisp: number; defDisp: number; windupTicks: number;
  truthStrikeX: number; truthStrikeY: number;
  passerX: number; passerY: number;
}
interface Flight {
  tick: number; gid: number; side: Side; ground: boolean;
  live: boolean; struck: boolean; measured: boolean;
  klass: CarryClass; strike: StrikeState | null;
  launchX: number; launchY: number;
  reachedPoint: boolean; arrDist: number; distAtStrike: number;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean; toIntended: boolean;
}

const walkMatch = (m: Match, trace: boolean): { row: Row; booked: Booked[] } => {
  const t0 = Date.now();
  const row = emptyRow();
  const booked: Booked[] = [];
  row.armedVersion = corridorArmedVersion(m);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: V2; targetGid: number; aimLead: V2 | null;
    } | null;
    possessionSide: Side;
    dxStrikeAim: { gid: number; lead: V2; tick: number } | null;
    dxWindupAim: boolean; o1PassWindup: boolean;
    dlcDeliveryChoice: boolean; dlcStrikePlane: boolean;
    armPendingPass: (passer: Player, mate: Player, offsideExempt?: boolean) => void;
    resolvePendingPassWindup: () => void;
  };
  row.flagsOk = mm.dxWindupAim === true && m.bkGroundCorridor === true
    && mm.dlcDeliveryChoice === true && mm.dlcStrikePlane === true && mm.o1PassWindup === true;
  row.worldOk = row.armedVersion === CORRIDOR_WORLD_VERSION && row.flagsOk;
  row.geneOk = ([0, 1] as const).every((s) => {
    const eff = m.teams[s].effGenome as TacticalGenome;
    const bas = m.teams[s].baseGenome as TacticalGenome;
    return eff.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && bas.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && eff.passLeadSupport === DLC_GENE_VALUE && bas.passLeadSupport === DLC_GENE_VALUE
      && passLeadSupportWeight(eff) === DLC_GENE_VALUE
      && passLeadSupportWeight(m.teams[s].genome as TacticalGenome) === DLC_GENE_VALUE;
  });
  row.genomeClean = ([0, 1] as const).every((s) => {
    const f = m.teams[s].info.genome as TacticalGenome;
    return f.dvExposureWeight === undefined && f.passLeadSupport === undefined;
  });

  const players = m.allPlayers;
  const NP = players.length;
  const armState = new Map<number, ArmState>();
  const strikes: StrikeState[] = [];
  let inResolveLead: V2 | null | undefined;

  /** the two observer reads, both the SHIPPED functions CALLED (X-REIMPL-ZERO) */
  const laneAt = (p: Player, aim: V2): number => {
    const opp = m.teams[(1 - p.side) as Side];
    return Math.min(1, laneOpenness(p.pos, aim, opp.players)
      * (p.traits.includes('playmaker') ? 1.15 : 1));
  };
  const shellAt = (p: Player, aim: V2, targetGid: number): boolean => {
    const team = m.teams[p.side as Side];
    const opp = m.teams[(1 - p.side) as Side];
    return groundShellHazard(p.pos, aim, [team.players, opp.players], p.gid, targetGid) > 0;
  };
  const nearestDefenderTo = (side: Side, point: V2): Player | null => {
    const opp = m.teams[(1 - side) as Side];
    let best: Player | null = null;
    let bd = Infinity;
    for (const o of opp.players) {
      if (o.sentOff) continue;
      const d = dist(o.pos, point);
      if (d < bd) { bd = d; best = o; }
    }
    return best;
  };

  if (trace) {
    /* ⭐⭐ WRAPPER 1 — the ARM. DX-T1 §R6's deposit pin, RE-RUN, plus this census's own
       ELECTION-INSTANT capture. Delegates with the IDENTICAL arguments. */
    const origArm = mm.armPendingPass.bind(m);
    mm.armPendingPass = (passer: Player, mate: Player, offsideExempt = false): void => {
      const dep = mm.dxStrikeAim;
      const eligible = dep !== null && dep.gid === passer.gid && dep.tick === m.simTick;
      const want: V2 | null = (mm.dxWindupAim === true && eligible)
        ? { x: dep!.lead.x, y: dep!.lead.y } : null;
      /* the ELECTION instant, read BEFORE the call so nothing the arm does can colour it */
      const tLead = passLeadOffset(TRUTH_SEAT, passer.pos, mate);
      const provisionalPoint: V2 = {
        x: mate.pos.x + (want?.x ?? 0), y: mate.pos.y + (want?.y ?? 0),
      };
      const nd = nearestDefenderTo(passer.side as Side, provisionalPoint);
      const snap: Omit<ArmState, 'readyTick'> = {
        tick: m.simTick, targetGid: mate.gid,
        aimX: mate.pos.x, aimY: mate.pos.y, matePosX: mate.pos.x, matePosY: mate.pos.y,
        truthLeadX: tLead.x, truthLeadY: tLead.y,
        nearestDefGid: nd === null ? -1 : nd.gid,
        nearestDefX: nd === null ? 0 : nd.pos.x, nearestDefY: nd === null ? 0 : nd.pos.y,
      };
      origArm(passer, mate, offsideExempt);
      const rec = mm.pendingPassWindup;
      const got = rec?.aimLead ?? null;
      row.depCaptures += 1;
      if (want === null) {
        if (got === null) row.depNullOk += 1; else row.depMismatch += 1;
      } else if (got !== null && got.x === want.x && got.y === want.y) {
        row.depCarriedOk += 1;
      } else row.depMismatch += 1;
      if (rec !== null && rec.gid === passer.gid) {
        armState.set(passer.gid, { ...snap, readyTick: rec.readyTick });
      }
    };
    /* ⭐ WRAPPER 2 — the RESOLVE. Marks the wind-up channel and carries the record's lead. */
    const origResolve = mm.resolvePendingPassWindup.bind(m);
    mm.resolvePendingPassWindup = (): void => {
      const rec = mm.pendingPassWindup;
      inResolveLead = rec === null ? undefined : rec.aimLead;
      origResolve();
      inResolveLead = undefined;
    };
    /* ⭐⭐ WRAPPER 3 — the STRIKE. The class, the elected point, and the STRIKE-INSTANT reads. */
    const origPerformPass = m.performPass.bind(m);
    (m as unknown as { performPass: unknown }).performPass = (
      pp: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<V2> | null = null,
    ): void => {
      const fromWindup = inResolveLead !== undefined;
      if (fromWindup) {
        row.depResolves += 1;
        const want = inResolveLead!;
        const ok = want === null ? ptpLead === null
          : ptpLead !== null && ptpLead.x === want.x && ptpLead.y === want.y;
        if (ok) row.depResolveOk += 1; else row.depResolveMismatch += 1;
      }
      const lx = ptpLead?.x ?? 0;
      const ly = ptpLead?.y ?? 0;
      const leadMetres = Math.hypot(lx, ly);
      const arm0 = fromWindup ? (armState.get(pp.gid) ?? null) : null;
      const arm = (arm0 !== null && arm0.targetGid === mate.gid) ? arm0 : null;
      /* ⭐ THE ELECTED POINT (§P.B): the arm-time record's own aim PLUS the carried lead —
         exactly `mate.pos(arm) + lead`, the point `groundCandidate` scored. */
      const electX = (arm !== null ? arm.aimX : mate.pos.x) + lx;
      const electY = (arm !== null ? arm.aimY : mate.pos.y) + ly;
      const elect: V2 = { x: electX, y: electY };
      const tStrike = passLeadOffset(TRUTH_SEAT, pp.pos, mate);
      const nd = arm !== null && arm.nearestDefGid >= 0 ? players[arm.nearestDefGid] : null;
      const st: StrikeState = {
        gid: pp.gid, tick: m.simTick, fromWindup, leadMetres, leadX: lx, leadY: ly,
        targetGid: mate.gid, arm,
        electX, electY,
        laneElect: Number.NaN, shellElect: false,
        laneStrike: laneAt(pp, elect), shellStrike: shellAt(pp, elect, mate.gid),
        recvDisp: arm === null ? Number.NaN
          : dist(mate.pos, { x: arm.matePosX, y: arm.matePosY }),
        defDisp: (arm === null || nd === null) ? Number.NaN
          : dist(nd.pos, { x: arm.nearestDefX, y: arm.nearestDefY }),
        windupTicks: arm === null ? Number.NaN : m.simTick - arm.tick,
        truthStrikeX: tStrike.x, truthStrikeY: tStrike.y,
        passerX: pp.pos.x, passerY: pp.pos.y,
      };
      strikes.push(st);
      origPerformPass(pp, mate, offsideExempt, powerChoice, ptpLead);
    };
  }

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevWindupGid: number | null = null;
  let prevWindupReady = -1;
  let prevStrikes = 0;
  let prevStrikesCool = 0;
  let flight: Flight | null = null;
  /** the ELECTION-instant lane / shell reads, taken at the tick the wind-up record appears */
  const electRead = new Map<number, { lane: number; shell: boolean; ready: number }>();

  const bookFlight = (f: Flight): void => {
    if (!f.measured) return;
    row.gpMeasured += 1;
    const outcome = outcomeOf(f.completedHere, f.interceptedHere, f.wentDead);
    const ci = CI(f.klass);
    row.byClass[ci] += 1;
    row.byClassOutcome[ci][OI(outcome)] += 1;
    if (f.struck) row.byClassCaromed[ci] += 1;
    if (f.toIntended) row.byClassToIntended[ci] += 1;
    const s = f.strike;
    let arrival: ArrivalClass | null = null;
    if (f.klass === 'carried' && s !== null && s.arm !== null) {
      arrival = arrivalClassOf(f.reachedPoint, f.arrDist, f.distAtStrike);
      row.carriedWithAnatomy += 1;
      row.arrClass[AI(arrival)] += 1;
      row.arrClassOutcome[AI(arrival)][OI(outcome)] += 1;
      if (f.reachedPoint) {
        row.arrDistBins[binOf(f.arrDist, ARR_BIN_M, ARR_BINS)] += 1;
        row.arrDistSum += f.arrDist;
        row.arrDistN += 1;
      }
      row.leadBins[binOf(s.leadMetres, LEAD_BIN_M, LEAD_BINS)] += 1;
      row.leadSum += s.leadMetres;
      row.laneElectSum += s.laneElect;
      row.laneStrikeSum += s.laneStrike;
      row.laneDeltaBins[signedBinOf(s.laneStrike - s.laneElect, DELTA_BIN, DELTA_BINS)] += 1;
      if (s.shellElect) row.shellBlockedElect += 1;
      if (s.shellStrike) row.shellBlockedStrike += 1;
      const sd = (s.shellStrike ? 1 : 0) - (s.shellElect ? 1 : 0);
      row.shellDeltaBins[sd + 1] += 1;
      row.recvDispSum += s.recvDisp;
      row.defDispSum += Number.isFinite(s.defDisp) ? s.defDisp : 0;
      row.windupTicksSum += s.windupTicks;
      /* (c) THE MOTION METRIC = the RECEIVER's displacement during the wind-up */
      const mb = binOf(s.recvDisp, MOTION_BIN_M, MOTION_BINS);
      const wb = binOf(s.windupTicks, WTICK_BIN, WTICK_BINS);
      row.motionBins[mb] += 1;
      row.motionJoint[wb][mb] += 1;
      if (outcome === 'completed') {
        row.motionCompleted[mb] += 1;
        row.motionJointCompleted[wb][mb] += 1;
      }
      /* (d) THE COUNTERFACTUAL RE-ASK — TRUTH motion at BOTH instants (§P.D's declared scope) */
      const armMag = Math.hypot(s.arm.truthLeadX, s.arm.truthLeadY);
      const strMag = Math.hypot(s.truthStrikeX, s.truthStrikeY);
      const reAsk = Math.hypot(s.truthStrikeX - s.arm.truthLeadX, s.truthStrikeY - s.arm.truthLeadY);
      row.reAskN += 1;
      row.reAskSum += reAsk;
      row.reAskBins[binOf(reAsk, REASK_BIN_M, REASK_BINS)] += 1;
      const ac = agreeClassOf(reAsk);
      row.agreeClass[GI(ac)] += 1;
      if (outcome === 'completed') row.agreeCompleted[GI(ac)] += 1;
      if (strMag > armMag) row.reAskGrewN += 1; else if (strMag < armMag) row.reAskShrankN += 1;
      /* the instrument's OWN honesty face: how far the TRUTH-motion election at the ARM instant
         sits from the lead the LIVE (percept) chooser actually carried. It sizes the part of any
         disagreement that is PERCEPT rather than TIME. */
      const gap = Math.hypot(s.leadX - s.arm.truthLeadX, s.leadY - s.arm.truthLeadY);
      row.perceptGapN += 1;
      row.perceptGapSum += gap;
      row.perceptGapBins[binOf(gap, REASK_BIN_M, REASK_BINS)] += 1;
    }
    booked.push({
      klass: f.klass, outcome, caromed: f.struck, toIntended: f.toIntended,
      arrival, arrDist: f.arrDist, leadMetres: s?.leadMetres ?? 0,
      laneElect: s?.laneElect ?? Number.NaN, laneStrike: s?.laneStrike ?? Number.NaN,
      shellElect: s?.shellElect ?? false, shellStrike: s?.shellStrike ?? false,
      recvDisp: s?.recvDisp ?? Number.NaN, defDisp: s?.defDisp ?? Number.NaN,
      windupTicks: s?.windupTicks ?? Number.NaN,
      reAskDelta: (s !== null && s.arm !== null)
        ? Math.hypot(s.truthStrikeX - s.arm.truthLeadX, s.truthStrikeY - s.arm.truthLeadY) : null,
      perceptGap: (s !== null && s.arm !== null)
        ? Math.hypot(s.leadX - s.arm.truthLeadX, s.leadY - s.arm.truthLeadY) : null,
      reAskArmMag: (s !== null && s.arm !== null)
        ? Math.hypot(s.arm.truthLeadX, s.arm.truthLeadY) : 0,
      reAskStrikeMag: s === null ? 0 : Math.hypot(s.truthStrikeX, s.truthStrikeY),
    });
  };
  const retire = (): void => { if (flight !== null) { bookFlight(flight); flight = null; } };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    const ball = m.ball;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';
    const lastTouchGid = ball.lastTouch?.gid ?? null;

    const led = m.bkContactLedger;
    const dStrikes = led.strikesApplied - prevStrikes;
    const dStrikesCool = led.strikesAppliedCooldown - prevStrikesCool;
    prevStrikes = led.strikesApplied;
    prevStrikesCool = led.strikesAppliedCooldown;

    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* the strike attribution — BK-C2 §P.1's gated rule, inherited */
    if (dStrikes > 0) {
      const striker = lastTouchGid !== null ? players[lastTouchGid] : null;
      const cooling = striker !== null && striker.kickCooldown > 0;
      const stunned = striker !== null && striker.stunTimer > 0;
      const classAgrees = striker !== null
        && ((dStrikesCool === dStrikes && cooling) || (dStrikesCool === 0 && !cooling && stunned));
      if (striker === null || !classAgrees || dStrikes !== 1) {
        row.strikesUnattributed += dStrikes;
      } else {
        row.strikes += 1;
        if (flight !== null && flight.live) flight.struck = true;
      }
    }

    /* ⭐ THE ELECTION-INSTANT LANE READ — taken at the tick a NEW wind-up record appears, on
       the ELECTED point (record.aim + aimLead), with the world as it stood THEN. */
    const wu = mm.pendingPassWindup;
    if (wu !== null && (wu.gid !== prevWindupGid || wu.readyTick !== prevWindupReady)) {
      const p = players[wu.gid];
      const pt: V2 = {
        x: wu.aim.x + (wu.aimLead?.x ?? 0), y: wu.aim.y + (wu.aimLead?.y ?? 0),
      };
      if (dist(p.pos, pt) > 1e-6) {
        electRead.set(wu.gid,
          { lane: laneAt(p, pt), shell: shellAt(p, pt, wu.targetGid), ready: wu.readyTick });
      }
    }
    prevWindupGid = wu?.gid ?? null;
    prevWindupReady = wu?.readyTick ?? -1;

    /* release detection — DX-T1 §8's ladder, inherited */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    prevPendingPassT = passT;
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const k0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side],
          throughBalls: d.throughBalls[side], longBalls: d.longBalls[side],
          headersWon: d.headersWon[side],
        }, passChangedSide === side);
        if (k0 === null) continue;
        let klass = k0;
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releases.push({ gid, klass });
      }
    }

    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass) || hSpeedNow < 1e-6) continue;
      const p = players[rel.gid];
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (mm.pendingPass !== null && mm.pendingPass.passerGid === rel.gid)
        ? mm.pendingPass.targetGid : null;
      retire();
      row.deliveries += 1;
      const measurable = isMeasurableGroundPass(rel.klass, ground, targetGid !== null);
      /* the strike this release came from — this tick, this body (the wrapper's own record) */
      let st: StrikeState | null = null;
      for (let i = strikes.length - 1; i >= 0; i--) {
        if (strikes[i].gid === rel.gid && strikes[i].tick === tick) { st = strikes[i]; break; }
        if (strikes[i].tick < tick - 1) break;
      }
      if (st !== null && targetGid !== null && st.targetGid !== targetGid) st = null;
      if (st !== null && st.arm !== null) {
        const er = electRead.get(rel.gid);
        if (er !== undefined && er.ready === st.arm.readyTick) {
          st.laneElect = er.lane; st.shellElect = er.shell;
        }
      }
      const klass = carryClassOf(st !== null, st?.fromWindup ?? false, st?.leadMetres ?? 0);
      const ox = ball.pos.x - ball.vel.x * DT;
      const oy = ball.pos.y - ball.vel.y * DT;
      const usable = st !== null && st.arm !== null && Number.isFinite(st.laneElect);
      flight = {
        tick, gid: rel.gid, side: p.side as Side, ground,
        live: true, struck: false,
        measured: measurable,
        klass, strike: usable ? st : (st !== null ? { ...st, arm: null } : null),
        launchX: ox, launchY: oy,
        reachedPoint: false, arrDist: Number.NaN,
        distAtStrike: (st !== null && targetGid !== null)
          ? dist(players[targetGid].pos, { x: st.electX, y: st.electY }) : Number.NaN,
        completedHere: false, interceptedHere: false, wentDead: false, toIntended: false,
      };
      if (klass !== 'carried' || !usable) {
        // non-carried flights carry no anatomy; the class still books
      }
      strikes.length = 0;
    }

    /* ⭐ THE ARRIVAL READ — the ball has travelled as far along its own launch→elected-point
       line as the elected point itself. Frozen, and it needs NO physics re-derivation. */
    if (flight !== null && flight.live && !flight.reachedPoint
      && flight.strike !== null && flight.strike.arm !== null) {
      const s = flight.strike;
      const ux = s.electX - flight.launchX;
      const uy = s.electY - flight.launchY;
      const L = Math.hypot(ux, uy);
      if (L > 1e-6) {
        const proj = ((ball.pos.x - flight.launchX) * ux + (ball.pos.y - flight.launchY) * uy) / L;
        if (proj >= L) {
          flight.reachedPoint = true;
          flight.arrDist = dist(players[s.targetGid].pos, { x: s.electX, y: s.electY });
        }
      }
    }

    /* the flight's own outcome — the ENGINE's counters, attributed temporally */
    if (flight !== null && flight.live) {
      const mySide = flight.side;
      if (d.passesCompleted[mySide] > 0) {
        flight.completedHere = true;
        const lp = m.lastCompletedPass;
        if (lp !== null && lp.passerGid === flight.gid
          && flight.strike !== null && lp.receiverGid === flight.strike.targetGid) {
          flight.toIntended = true;
        }
      }
      if (d.interceptions[1 - mySide] > 0) flight.interceptedHere = true;
      if (!ballIsLive) flight.wentDead = true;
    }

    if (flight !== null) {
      if (ball.owner !== null && ball.owner.gid !== flight.gid) retire();
      else if (flight.completedHere || flight.interceptedHere || flight.wentDead) retire();
      else if (tick - flight.tick > FLIGHT_RETIRE_TICKS) retire();
    }
    prevLastTouchGid = lastTouchGid;
    if (strikes.length > 64) strikes.length = 0;
  }
  retire();
  void prevLastTouchGid;
  void NP;
  row.ledStrikesApplied = m.bkContactLedger.strikesApplied;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.wallMs = Date.now() - t0;
  return { row, booked };
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — the wrappers are BYTE-INERT (DX-T1 §DEV 3's form) */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
banner('DX-C1 — the lockstep receipt (the observation wrappers, traced vs untraced)');
const lockstepRows = LOCKSTEP_SEEDS.map((seed) => {
  const traced = buildMatch(seed);
  walkMatch(traced, true);
  const untraced = buildMatch(seed);
  walkMatch(untraced, false);
  return { seed, traced: signatureOf(traced), untraced: signatureOf(untraced) };
});
const LOCKSTEP_OK = lockstepRows.every((r) => r.traced === r.untraced);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} scratch seeds)`);

/* ========================================================================== */
/* §12 THE BATTERY                                                             */
/* ========================================================================== */
interface Cell { seed: number; row: Row; booked: Booked[] }
const cells: Cell[] = [];
banner(`DX-C1 — the battery: ${N} walks of the DX-T1 ARMED composition, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 100;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  const slice = batterySeeds.slice(start, start + CHUNK);
  for (const seed of slice) {
    const m = buildMatch(seed);
    const { row, booked } = walkMatch(m, true);
    cells.push({ seed, row, booked });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} walked `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
/** the world-construction receipt, one walk, its own seed (booked = walked) */
const receiptMatch = buildMatch(RECEIPT_SEED);
const receiptRow = walkMatch(receiptMatch, true).row;
const walksBooked = cells.length + 1;

/* ========================================================================== */
/* §13 THE (c) STRATIFICATION — the split indices FROZEN from the POOLED table  */
/* ========================================================================== */
/** BK-C2 §P.5's own form: within each wind-up-LENGTH stratum, split at THAT stratum's own
 *  median motion bin, then pool the upper and lower halves ACROSS strata. The raw marginal
 *  split is published beside it, labelled ⚠ NOT the answer. */
const pooledJoint = zeros2(WTICK_BINS, MOTION_BINS);
for (const c of cells) addInto2(pooledJoint, c.row.motionJoint);
const pooledMotion = zeros(MOTION_BINS);
for (const c of cells) addInto(pooledMotion, c.row.motionBins);
const medianSplitIndex = (bins: readonly number[]): number => {
  const tot = sum(bins);
  if (tot === 0) return -1;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= tot) return i;
  }
  return bins.length - 1;
};
const splitByWtickBin = pooledJoint.map((r) => medianSplitIndex(r));
const rawSplit = medianSplitIndex(pooledMotion);
/** SECOND PASS: apply the frozen split indices to every cell's own booked flights. */
for (const c of cells) {
  for (const b of c.booked) {
    if (b.klass !== 'carried' || b.arrival === null || !Number.isFinite(b.recvDisp)) continue;
    const mb = binOf(b.recvDisp, MOTION_BIN_M, MOTION_BINS);
    const wb = binOf(b.windupTicks, WTICK_BIN, WTICK_BINS);
    const sp = splitByWtickBin[wb];
    const done = b.outcome === 'completed' ? 1 : 0;
    if (sp >= 0) {
      if (mb > sp) { c.row.motionUpperN += 1; c.row.motionUpperC += done; }
      else { c.row.motionLowerN += 1; c.row.motionLowerC += done; }
    }
    if (rawSplit >= 0) {
      if (mb > rawSplit) { c.row.motionRawUpperN += 1; c.row.motionRawUpperC += done; }
      else { c.row.motionRawLowerN += 1; c.row.motionRawLowerC += done; }
    }
  }
}
const STRATIFICATION_NONVACUOUS = splitByWtickBin.some((s) => s >= 0)
  && cells.reduce((a, c) => a + c.row.motionUpperN, 0) > 0
  && cells.reduce((a, c) => a + c.row.motionLowerN, 0) > 0;

/* ========================================================================== */
/* §14 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef { unit: string; what: string; den: string;
  num: (r: Row) => number; dn: (r: Row) => number }
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };

for (const k of CARRY_CLASSES) {
  const i = CI(k);
  defFace(`completion.${k}`, 'share', `(a) completion rate of the ${k} class`,
    'flights of that class', (r) => r.byClassOutcome[i][OI('completed')], (r) => r.byClass[i]);
  defFace(`volumeShare.${k}`, 'share', `(a) volume share of the ${k} class`,
    'measured ground passes', (r) => r.byClass[i], (r) => r.gpMeasured);
  defFace(`interceptedShare.${k}`, 'share', `(a) intercepted share of the ${k} class`,
    'flights of that class', (r) => r.byClassOutcome[i][OI('intercepted')], (r) => r.byClass[i]);
  defFace(`caromShare.${k}`, 'share', `(a) share of ${k} flights a body struck (ORTHOGONAL)`,
    'flights of that class', (r) => r.byClassCaromed[i], (r) => r.byClass[i]);
  defFace(`toIntendedShare.${k}`, 'share',
    `(a) share of ${k} flights completed BY THE INTENDED RECEIVER`,
    'flights of that class', (r) => r.byClassToIntended[i], (r) => r.byClass[i]);
  defFace(`perMatch.${k}`, 'flights per match (240 s match clock)',
    `(a) ${k} flights per match`, 'matches walked', (r) => r.byClass[i], (r) => r.matches);
}
for (const a of ARRIVAL_CLASSES) {
  const i = AI(a);
  defFace(`arrivalShare.${a}`, 'share', `(b) share of carried passes classed ${a}`,
    'carried passes with anatomy', (r) => r.arrClass[i], (r) => r.carriedWithAnatomy);
  defFace(`arrivalCompletion.${a}`, 'share', `(b) completion of carried passes classed ${a}`,
    'carried passes of that arrival class', (r) => r.arrClassOutcome[i][OI('completed')],
    (r) => r.arrClass[i]);
}
defFace('arrival.meanReceiverDistanceMetres', 'metres',
  '(b) mean receiver→elected-point distance AT BALL ARRIVAL',
  'carried passes whose ball reached the elected point', (r) => r.arrDistSum, (r) => r.arrDistN);
defFace('arrival.meanCarriedLeadMetres', 'metres', '(b) mean carried lead magnitude',
  'carried passes with anatomy', (r) => r.leadSum, (r) => r.carriedWithAnatomy);
defFace('lane.meanAtElection', 'laneOpenness (0–1)',
  '(b) laneOpenness on the elected line AT THE ELECTION TICK',
  'carried passes with anatomy', (r) => r.laneElectSum, (r) => r.carriedWithAnatomy);
defFace('lane.meanAtStrike', 'laneOpenness (0–1)',
  '(b) laneOpenness on the elected line AT THE STRIKE TICK',
  'carried passes with anatomy', (r) => r.laneStrikeSum, (r) => r.carriedWithAnatomy);
defFace('shell.blockedShareAtElection', 'share',
  '(b) share shell-BLOCKED at the election tick', 'carried passes with anatomy',
  (r) => r.shellBlockedElect, (r) => r.carriedWithAnatomy);
defFace('shell.blockedShareAtStrike', 'share',
  '(b) share shell-BLOCKED at the strike tick', 'carried passes with anatomy',
  (r) => r.shellBlockedStrike, (r) => r.carriedWithAnatomy);
defFace('motion.meanReceiverDisplacementMetres', 'metres',
  '(c) THE MOTION METRIC — receiver displacement during the wind-up',
  'carried passes with anatomy', (r) => r.recvDispSum, (r) => r.carriedWithAnatomy);
defFace('motion.meanNearestDefenderDisplacementMetres', 'metres',
  '(c) nearest-defender (identity fixed at the election) displacement during the wind-up',
  'carried passes with anatomy', (r) => r.defDispSum, (r) => r.carriedWithAnatomy);
defFace('motion.meanWindupTicks', 'ticks (1 tick = 1/60 sim-s)',
  '(c) wind-up length', 'carried passes with anatomy',
  (r) => r.windupTicksSum, (r) => r.carriedWithAnatomy);
defFace('staleness.completionMotionUpperHalfWithinWindupLength', 'share',
  '⭐⭐ (c) THE ANSWER OF RECORD — completion in the UPPER motion half, WITHIN wind-up-length '
  + 'strata', 'carried passes in the upper half', (r) => r.motionUpperC, (r) => r.motionUpperN);
defFace('staleness.completionMotionLowerHalfWithinWindupLength', 'share',
  '⭐⭐ (c) THE ANSWER OF RECORD — completion in the LOWER motion half, WITHIN wind-up-length '
  + 'strata', 'carried passes in the lower half', (r) => r.motionLowerC, (r) => r.motionLowerN);
defFace('staleness.completionMotionUpperHalfRaw', 'share',
  '⚠ (c) THE RAW MARGINAL — NOT the answer; published so the confound size is visible',
  'carried passes in the raw upper half', (r) => r.motionRawUpperC, (r) => r.motionRawUpperN);
defFace('staleness.completionMotionLowerHalfRaw', 'share',
  '⚠ (c) THE RAW MARGINAL — NOT the answer', 'carried passes in the raw lower half',
  (r) => r.motionRawLowerC, (r) => r.motionRawLowerN);
for (const a of AGREE_CLASSES) {
  const i = GI(a);
  defFace(`reAsk.share.${a}`, 'share', `(d) share of carried passes whose re-ask reads ${a}`,
    'carried passes with a re-ask read', (r) => r.agreeClass[i], (r) => r.reAskN);
  defFace(`reAsk.completion.${a}`, 'share', `(d) completion where the re-ask reads ${a}`,
    'carried passes of that agreement class', (r) => r.agreeCompleted[i], (r) => r.agreeClass[i]);
}
defFace('reAsk.meanDeltaMetres', 'metres',
  '(d) mean |lead(strike) − lead(election)| on ONE motion source (truth)',
  'carried passes with a re-ask read', (r) => r.reAskSum, (r) => r.reAskN);
defFace('reAsk.grewShare', 'share', '(d) share where the strike-time lead is LONGER',
  'carried passes with a re-ask read', (r) => r.reAskGrewN, (r) => r.reAskN);
defFace('honesty.meanPerceptGapMetres', 'metres',
  '⚠ (d) THE INSTRUMENT\'S OWN HONESTY FACE — |carried lead − TRUTH-motion lead at the SAME '
  + 'election instant|; the part of any disagreement that is PERCEPT, not TIME',
  'carried passes with a re-ask read', (r) => r.perceptGapSum, (r) => r.perceptGapN);
defFace('context.passCompletion', 'share',
  'context — the engine\'s own whole-match pass completion (⚠ ALL deliveries, not this census\'s '
  + 'population)', 'passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('context.goalsPerMatch', 'goals per match (240 s match clock)', 'context — goals',
  'matches walked', (r) => r.goals, (r) => r.matches);
defFace('context.measuredGroundPassesPerMatch', 'passes per match (240 s match clock)',
  'context — the census population\'s own volume', 'matches walked',
  (r) => r.gpMeasured, (r) => r.matches);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = cells.map((c) => f.num(c.row));
  const de = cells.map((c) => f.dn(c.row));
  const point = ratio(sum(nu), sum(de));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0; let dd = 0;
    for (const i of idx) { n += nu[i]; dd += de[i]; }
    const v = ratio(n, dd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  return {
    face: key, unit: f.unit, what: f.what, denNote: f.den,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`DX-C1 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};
/** ⭐ THE WITHIN-ARM CONTRAST — the SAME resampled cells re-derive BOTH sides inside a draw */
interface DeltaRow {
  key: string; left: string; right: string;
  leftValue: number; rightValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
}
const contrast = (key: string, left: string, right: string): DeltaRow => {
  const fl = FACES[left];
  const fr = FACES[right];
  const nl = cells.map((c) => fl.num(c.row));
  const dl = cells.map((c) => fl.dn(c.row));
  const nr = cells.map((c) => fr.num(c.row));
  const dr = cells.map((c) => fr.dn(c.row));
  const pl = ratio(sum(nl), sum(dl));
  const pr = ratio(sum(nr), sum(dr));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nl[i]; d1 += dl[i]; n2 += nr[i]; d2 += dr[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  const hw = (hi - lo) / 2;
  return {
    key, left, right, leftValue: pl, rightValue: pr, delta: pl - pr,
    ciLo: lo, ciHi: hi, halfWidth: hw,
    absDeltaOverHalfWidth: ratio(Math.abs(pl - pr), hw),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
  };
};
const CONTRASTS: [string, string, string][] = [
  ['carriedVsWindupToFeet', 'completion.carried', 'completion.windupToFeet'],
  ['carriedVsSyncToFeet', 'completion.carried', 'completion.syncToFeet'],
  ['carriedVsSyncLed', 'completion.carried', 'completion.syncLed'],
  ['windupToFeetVsSyncToFeet', 'completion.windupToFeet', 'completion.syncToFeet'],
  ['stalenessWithinStrata', 'staleness.completionMotionUpperHalfWithinWindupLength',
    'staleness.completionMotionLowerHalfWithinWindupLength'],
  ['stalenessRawMarginal', 'staleness.completionMotionUpperHalfRaw',
    'staleness.completionMotionLowerHalfRaw'],
  ['reAskDisagreeVsAgree', 'reAsk.completion.disagree', 'reAsk.completion.agree'],
  ['arrivalAbandonedVsReached', 'arrivalCompletion.abandoned', 'arrivalCompletion.reached'],
  ['laneStrikeVsElection', 'lane.meanAtStrike', 'lane.meanAtElection'],
  ['shellStrikeVsElection', 'shell.blockedShareAtStrike', 'shell.blockedShareAtElection'],
];
const deltas = CONTRASTS.map(([k, l, r]) => contrast(k, l, r));
const delta = (k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k);
  if (d === undefined) { banner(`DX-C1 FATAL — unknown contrast ${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §15 THE (c) DISCRIMINATION — the FROZEN rule applied to the frozen numbers   */
/* ========================================================================== */
/**
 * ⭐⭐ THE RULE, FROZEN AT §P BEFORE ANY BATTERY SEED (doc §P.C):
 *   FALLING-WITH-MOTION ⇒ the paired contrast (upper motion half − lower motion half, WITHIN
 *     wind-up-length strata) has its 95 % interval ENTIRELY BELOW ZERO. Reading: a stale
 *     election fails more ⇒ THE RE-ASK DOOR IS THE FIX.
 *   FLAT-ACROSS-BINS ⇒ the interval CONTAINS ZERO. Reading: staleness is EXONERATED and the
 *     ARRIVAL CONTEXT owns the loss.
 *   RISING ⇒ the interval lies ENTIRELY ABOVE ZERO. Reported as-is; the census adjudicates
 *     nothing and a rising read is a finding, not an error.
 */
const stale = delta('stalenessWithinStrata');
const DISCRIMINATION: 'FALLING' | 'FLAT' | 'RISING' =
  stale.excludesZeroBelow ? 'FALLING' : stale.excludesZeroAbove ? 'RISING' : 'FLAT';
const DISCRIMINATION_READING = DISCRIMINATION === 'FALLING'
  ? 'FALLING WITH MOTION — a stale election fails more; the RE-ASK DOOR is the fix the census '
    + 'points at (the commander rules; this census adjudicates nothing).'
  : DISCRIMINATION === 'FLAT'
    ? 'FLAT ACROSS MOTION BINS — staleness is EXONERATED at this power; the ARRIVAL CONTEXT '
      + 'owns the loss (the commander rules; this census adjudicates nothing).'
    : 'RISING WITH MOTION — completion is HIGHER where the world moved more. Reported exactly '
      + 'as frozen; neither door is pointed at by this face.';

/* ========================================================================== */
/* §15B THE SIZING, SHOWN — the house form, from THIS census's own scratch smoke */
/* ========================================================================== */
/**
 * ⭐ THE HOUSE FORM (DV-T1B §N / GC-T2 §N / DX-T1 §N), applied to a census whose variance
 * source is a SCRATCH SMOKE rather than a published battery — BK-C2 §P.6's own situation, and
 * the smoke is DISCLOSED IN FULL at the doc's §DEV-PREFLIGHT.
 *   1  se(n)      = half-width(n) / z.975
 *   2  se(needed) = |target| / (z.975 + z.80)
 *   3  N          = ceil( n · (se(n) / se(needed))² )
 *   4  MDE(N)     = half-width(n) · sqrt(n/N) · (z.975 + z.80) / z.975
 * ⚠ IT ASSUMES the battery's per-seed cluster variance is the smoke's. SAME composition, SAME
 * estimator, SAME walk-side predicates — but 12 scratch clusters is a NOISY variance estimate,
 * and that is a strictly weaker assumption than DX-T1's was. Said here, before the battery.
 */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised Δ half-widths (seeds 900,000,800–811; §DEV-PREFLIGHT) */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'carriedVsWindupToFeet', group: '(a)', hwSmoke: 0.1591075, target: 0.0949 },
  { face: 'stalenessWithinStrata', group: '(c)', hwSmoke: 0.2029125, target: 0.05 },
  { face: 'stalenessWithinStrata@0.03', group: '(c)', hwSmoke: 0.2029125, target: 0.03 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAt800: nRequired <= N_FROZEN,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);

/* ========================================================================== */
/* §16 THE GATES                                                               */
/* ========================================================================== */
const totalGp = cells.reduce((a, c) => a + c.row.gpMeasured, 0);
const totalByClass = zeros(CARRY_CLASSES.length);
for (const c of cells) addInto(totalByClass, c.row.byClass);
const totalOutcome = zeros2(CARRY_CLASSES.length, OUTCOMES.length);
for (const c of cells) addInto2(totalOutcome, c.row.byClassOutcome);
const totalArr = zeros(ARRIVAL_CLASSES.length);
for (const c of cells) addInto(totalArr, c.row.arrClass);
const totalCarriedAnat = cells.reduce((a, c) => a + c.row.carriedWithAnatomy, 0);

const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: cells.every((c) => c.row.worldOk) && receiptRow.worldOk,
    note: 'every walked match is world 11 with `dxWindupAim`, `bkGroundCorridor`, both DLC '
      + 'doors and `o1PassWindup` ALL TRUE — asserted off the REAL constructed match',
  },
  gGeneValuePinned: {
    ok: cells.every((c) => c.row.geneOk) && receiptRow.geneOk,
    note: 'BOTH genes checked BY VALUE on BOTH match-local views of BOTH teams, every walked '
      + 'match; the DLC gene read back through the SHIPPED `passLeadSupportWeight` map',
  },
  gGenomeClean: {
    ok: cells.every((c) => c.row.genomeClean) && receiptRow.genomeClean,
    note: 'the FRANCHISE genome carries NEITHER gene (canon: dose placement, #270.2 / #334.1)',
  },
  gSeamSitesPinned: {
    ok: SEAM_OK,
    note: 'ONE `dxWindupAim` fork · ONE arm-time consumption gate · ONE plumb-through · ONE '
      + 'deposit write · ONE `armPendingPass` definition + ONE brain call site · ONE GC fork · '
      + 'ONE `dlcDeliveryChoice` fork · ONE `dlcStrikePlane` fork · ZERO of the four doors in '
      + '`a4World.ts`',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ the STRUCTURAL PIN — `struckLead` (the receiver\'s position is RE-READ AT STRIKE '
      + 'TIME) and the aim composition (`struckLead + ptpLead`), each ONE occurrence with a '
      + 'line receipt; plus the open-lane 0.4 line, `PTP_FLIGHT_SPEED`, `PTP_LEAD_FLIGHT_MUL` '
      + 'and `CONTROL_RADIUS`',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — every headline-bearing predicate is a PURE function called by BOTH the walk '
      + 'and this table (canon: walk-side definitions pinned)',
  },
  gStrikeLedgerAgrees: {
    ok: cells.every((c) => c.row.strikes + c.row.strikesUnattributed === c.row.ledStrikesApplied),
    note: 'strikes + unattributed === the engine\'s own `strikesApplied`, match by match',
  },
  gStrikeAttributionComplete: {
    ok: (() => {
      const s = cells.reduce((a, c) => a + c.row.strikes, 0);
      const u = cells.reduce((a, c) => a + c.row.strikesUnattributed, 0);
      return s + u > 0 && s / (s + u) >= 0.99;
    })(),
    note: 'the walk names ≥ 99 % of applied strikes (⚠ an INSTRUMENT RECEIPT, never a football '
      + 'finding)',
  },
  gCarryPartition: {
    ok: sum(totalByClass) === totalGp && totalGp > 0
      && CARRY_CLASSES.every((_, i) => sum(totalOutcome[i]) === totalByClass[i]),
    note: 'every measured ground pass lands in EXACTLY ONE carry class, and every class row\'s '
      + 'outcomes sum to its own count',
  },
  gArrivalPartition: {
    ok: sum(totalArr) === totalCarriedAnat && totalCarriedAnat > 0,
    note: 'every carried pass with anatomy lands in EXACTLY ONE arrival class',
  },
  gClassesNonVacuous: {
    ok: totalByClass[CI('carried')] > 0 && totalByClass[CI('windupToFeet')] > 0
      && totalByClass[CI('syncToFeet')] > 0 && totalCarriedAnat > 0
      && cells.reduce((a, c) => a + c.row.reAskN, 0) > 0,
    note: '⛔ no face is computed on an empty cell: the carried, wind-up-to-feet and '
      + 'synchronous-to-feet classes are all populated and the (d) read has a denominator. '
      + '⚠ this gate reads LIVENESS, never a direction and never a magnitude',
  },
  gDepositCarriesElection: {
    ok: cells.every((c) => c.row.depMismatch === 0 && c.row.depResolveMismatch === 0)
      && receiptRow.depMismatch === 0
      && cells.reduce((a, c) => a + c.row.depCarriedOk, 0) > 0,
    note: 'DX-T1 §R6\'s pin RE-RUN on this block: an eligible deposit ⇒ `aimLead` EQUALS it '
      + 'component for component; otherwise EXACTLY `null`; the release hands `performPass` that '
      + 'same record value. ZERO mismatches',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ the THREE observation wrappers are BYTE-INERT (DX-T1 §DEV 3\'s precedent): the '
      + 'same scratch seed walked traced and untraced yields a BYTE-IDENTICAL whole-match '
      + 'signature',
  },
  gStratificationNonVacuous: {
    ok: STRATIFICATION_NONVACUOUS,
    note: '(c)\'s wind-up-length strata split at least one stratum and BOTH pooled halves carry '
      + 'flights — the split indices are FROZEN from the pooled table and then treated as '
      + 'constants by the per-seed face functions (the bootstrap is CONDITIONAL on the split; '
      + 'stated, not hidden)',
  },
  gQuotedSourceIntact: {
    ok: DXT1_QUOTED_OK,
    note: 'DX-T1\'s artifact bytes are HASHED BEFORE PARSING and its sizing fields are READ, '
      + 'never re-typed from prose (canon: dose-source guards)',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: 'worktree-vs-HEAD over `src/`: `git diff --stat HEAD -- src` AND '
      + '`git status --porcelain -- src` both EMPTY (canon: xSrcUntouched)',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === N_FROZEN + 1
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === N + 1
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds; every battery seed and '
      + 'the construction receipt lie inside block 12,528,000–999; every lockstep seed is '
      + 'out-of-band scratch (≥ 900,000,000)',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : 'THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = 800',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({ seed: c.seed, ...c.row }));
const pooledLeadBins = zeros(LEAD_BINS);
const pooledArrBins = zeros(ARR_BINS);
const pooledReAsk = zeros(REASK_BINS);
const pooledPercept = zeros(REASK_BINS);
const pooledLaneDelta = zeros(DELTA_BINS);
const pooledShellDelta = zeros(3);
const pooledMotionCompleted = zeros(MOTION_BINS);
const pooledJointCompleted = zeros2(WTICK_BINS, MOTION_BINS);
for (const c of cells) {
  addInto(pooledLeadBins, c.row.leadBins);
  addInto(pooledArrBins, c.row.arrDistBins);
  addInto(pooledReAsk, c.row.reAskBins);
  addInto(pooledPercept, c.row.perceptGapBins);
  addInto(pooledLaneDelta, c.row.laneDeltaBins);
  addInto(pooledShellDelta, c.row.shellDeltaBins);
  addInto(pooledMotionCompleted, c.row.motionCompleted);
  addInto2(pooledJointCompleted, c.row.motionJointCompleted);
}

const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'discrimination', 'bins', 'stratification',
  'carryClasses', 'arrivalClasses', 'agreementClasses', 'outcomes', 'seeds', 'stats',
  'quotedContext', 'anchoredSites', 'fixtures', 'lockstep', 'perf', 'honestLimits', 'sizing',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'DX-C1',
    title: 'THE ARRIVAL CENSUS — completion by carry class · arrival anatomy at the led point · '
      + 'the staleness–outcome link · the counterfactual re-ask read',
    doc: 'docs/world-model/DX-C1-ARRIVAL-CENSUS.md',
    contract: 'docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md',
    predecessor: 'docs/world-model/DX-T1-EXPRESSION-EXAM.md',
    censusFormOfRecord: 'docs/world-model/BK-C2-CAROM-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #355 item 2 (#354 item 4\'s named unbuilt probe)',
    kind: 'CENSUS — it publishes MEASUREMENTS; it scores no hypothesis, arms no mechanism and '
      + 'ADJUDICATES NOTHING',
    arm: 'ONE ARM — the DX-T1 ARMED composition: a4MatchFlags(11) + `dlcDeliveryChoice` + '
      + '`dlcStrikePlane` + `bkGroundCorridor` + `dxWindupAim` + armA4World(m, null, 11) + '
      + '`passLeadSupport` = 1 written MATCH-LOCAL. DX-T1\'s SHUT arm is NOT re-walked.',
    xSrcZero: 'no file under `src/` is edited. The probe CALLS the shipped exports — '
      + '`laneOpenness`, `groundShellHazard`, `passLeadOffset`, `a4MatchFlags` / `armA4World`, '
      + '`passLeadSupportWeight` — and reads Match state per tick. Three observation wrappers '
      + '(`armPendingPass`, `resolvePendingPassWindup`, `performPass`) delegate unchanged and '
      + 'are proven byte-inert by `gLockstep` (the DX-T1 §DEV 3 precedent).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/dx-c1-arrival-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/dx-c1-arrival-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: {
      [MATCH_PATH]: sha(MATCH_SRC), [BRAIN_PATH]: sha(BRAIN_SRC),
      [MECH_PATH]: sha(MECH_SRC), [SEAT_PATH]: sha(SEAT_SRC), [CONST_PATH]: sha(CONST_SRC),
    },
  },
  anchoredSites: [
    { what: '⭐⭐ THE STRUCTURAL PIN — the receiver\'s position is RE-READ AT STRIKE TIME',
      file: MECH_PATH, needle: STRUCK_LEAD_NEEDLE, occurrences: STRUCK_LEAD_HITS },
    { what: '⭐⭐ THE AIM COMPOSITION — `struckLead + ptpLead` (only the DISPLACEMENT is stale)',
      file: MECH_PATH, needle: STRUCK_AIM_NEEDLE, occurrences: STRUCK_AIM_HITS },
    { what: 'the chooser\'s own open-lane dividing line', file: BRAIN_PATH,
      needle: LANE_GATE_NEEDLE, occurrences: LANE_GATE_HITS, extracted: OPEN_LANE_THRESHOLD },
    { what: 'PTP_FLIGHT_SPEED', file: SEAT_PATH, needle: PTP_SPEED_NEEDLE,
      occurrences: PTP_SPEED_HITS, extracted: PTP_FLIGHT_SPEED },
    { what: 'PTP_LEAD_FLIGHT_MUL', file: SEAT_PATH, needle: PTP_MUL_NEEDLE,
      occurrences: PTP_MUL_HITS, extracted: PTP_LEAD_FLIGHT_MUL },
    { what: 'CONTROL_RADIUS — the arrival classes\' own anchored cut', file: CONST_PATH,
      needle: CONTROL_R_NEEDLE, occurrences: CONTROL_R_HITS, extracted: CONTROL_RADIUS },
    { what: 'THE ONE `dxWindupAim` FORK', file: BRAIN_PATH, needle: DX_FORK_NEEDLE,
      occurrences: DX_FORK_HITS },
    { what: 'THE ONE ARM-TIME CONSUMPTION GATE', file: MATCH_PATH, needle: DX_ARM_NEEDLE,
      occurrences: DX_ARM_HITS },
    { what: 'THE ONE PLUMB-THROUGH', file: MATCH_PATH, needle: DX_RESOLVE_NEEDLE,
      occurrences: DX_RESOLVE_HITS },
  ],
  fixtures: FIXTURES,
  lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,000,800–811), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate — a strictly weaker assumption than sizing off a published battery.',
    nFrozen: N_FROZEN,
    capBinds: 'the block holds 1,000 seeds and the sub-band split caps the battery at 800',
    rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  discrimination: {
    face: 'stalenessWithinStrata',
    frozenRule: 'FALLING ⇒ the (upper − lower) motion-half contrast\'s 95 % interval lies '
      + 'ENTIRELY BELOW ZERO ⇒ the re-ask door is the fix. FLAT ⇒ the interval CONTAINS ZERO ⇒ '
      + 'staleness is exonerated and the arrival context owns the loss. RISING ⇒ entirely above '
      + 'zero, reported as-is. FROZEN AT §P BEFORE ANY BATTERY SEED.',
    verdict: DISCRIMINATION,
    reading: DISCRIMINATION_READING,
    delta: stale,
    rawMarginal: delta('stalenessRawMarginal'),
  },
  carryClasses: CARRY_CLASSES,
  arrivalClasses: ARRIVAL_CLASSES,
  agreementClasses: AGREE_CLASSES,
  outcomes: OUTCOMES,
  bins: {
    arrivalDistanceMetres: { width: ARR_BIN_M, bins: ARR_BINS, overflowIsLast: true,
      pooled: pooledArrBins },
    carriedLeadMetres: { width: LEAD_BIN_M, bins: LEAD_BINS, overflowIsLast: true,
      pooled: pooledLeadBins },
    motionMetres: { width: MOTION_BIN_M, bins: MOTION_BINS, overflowIsLast: true,
      pooled: pooledMotion, completed: pooledMotionCompleted },
    windupTicks: { width: WTICK_BIN, bins: WTICK_BINS, overflowIsLast: true },
    reAskDeltaMetres: { width: REASK_BIN_M, bins: REASK_BINS, overflowIsLast: true,
      pooled: pooledReAsk },
    perceptGapMetres: { width: REASK_BIN_M, bins: REASK_BINS, overflowIsLast: true,
      pooled: pooledPercept },
    laneDeltaSigned: { width: DELTA_BIN, bins: DELTA_BINS, centreHoldsZero: true,
      pooled: pooledLaneDelta },
    shellDeltaSigned: { order: ['-1 (blocked→clear)', '0', '+1 (clear→blocked)'],
      pooled: pooledShellDelta },
  },
  stratification: {
    form: 'BK-C2 §P.5\'s own: within each wind-up-LENGTH stratum, split at THAT stratum\'s own '
      + 'median motion bin, then pool the upper and lower halves ACROSS strata. The split '
      + 'indices are frozen from the POOLED table and then treated as constants by the per-seed '
      + 'face functions, so the bootstrap is CONDITIONAL on the split. Stated, not hidden.',
    splitByWindupTickBin: splitByWtickBin,
    rawMarginalSplit: rawSplit,
    pooledJoint,
    pooledJointCompleted,
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    constructionReceiptSeed: RECEIPT_SEED,
    walksBooked,
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    bootstrapRngSeededFrom: BLOCK_BASE,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  quotedContext: {
    dxT1: {
      role: '⚠ DIFFERENT-BATTERY CONTEXT (block 12,527,000–999, TWO arms). Quoted for the '
        + 'carried-flight volume this census is sized against and for the completion level its '
        + 'own §R3 published. ⛔ NO Δ IS COMPUTED ACROSS BATTERIES.',
      source: { path: DXT1_PATH, sha256: DXT1_SHA },
      hashedBodySha256: DXT1.hashedBodySha256,
      armedAltCarriedShare: DXT1_CARRIED,
      armedPassCompletion: DXT1_COMPLETION,
    },
  },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: cells.reduce((a, c) => a + c.row.wallMs, 0) / 1000 / cells.length,
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads and '
      + 'the three wrappers included — never the game\'s frame cost.',
  },
  honestLimits: [
    '⭐⭐ ONLY THE DISPLACEMENT IS STALE. `performPass` RE-READS the receiver\'s position at '
    + 'strike time and ADDS the carried lead to it (anchored pin, `struckLead` + the aim '
    + 'composition). Every staleness statement here is about the LEAD VECTOR alone; a re-ask '
    + 'door could only change that vector.',
    '⚠⚠ (d) IS SCOPED AND SAYS SO. The argmax is NOT re-run: `groundCandidate` is a closure '
    + 'over the whole scoring chain and is not exported; re-implementing it would be a second, '
    + 'drifting copy of the pricing — REFUSED. So (d) answers "would the door aim at a '
    + 'DIFFERENT POINT for the SAME target", never "would the chooser pick a different man".',
    '⚠⚠ (d) RUNS ON TRUTH MOTION AT BOTH INSTANTS. The live chooser reads the REMEMBERED '
    + 'percept velocity (`edsPerceivedChoice` is TRUE in world 11), and `perceivedSnapshot` '
    + 'RECONSTRUCTS a body\'s memory IN PLACE — an observer pull could perturb the very walk it '
    + 'measures. The percept-vs-truth gap at the ELECTION instant is published as its own face '
    + '(`honesty.meanPerceptGapMetres`) rather than hidden.',
    '⚠ THE OUTCOME LADDER IS TEMPORAL, NOT CAUSAL (BK-C2 §P.7\'s own warning), and `caromed` is '
    + 'ORTHOGONAL to it: a ball may carom and still be recovered by the passing side.',
    '⚠ THE ARRIVAL READ IS A GEOMETRIC ONE: "the ball has travelled as far along its own '
    + 'launch→elected-point line as the elected point". It is not a claim about when a receiver '
    + 'could have taken it.',
    '⚠ THE ARRIVAL CLASSES ARE CUT ON AN ANCHORED CONSTANT (`CONTROL_RADIUS` and 3×), and the '
    + 'FULL distance histogram is stored so any other cut re-derives off disk.',
    '⚠ (c) IS CONDITIONAL ON THE FROZEN SPLIT (the stratification block says so), and the raw '
    + 'marginal is published ONLY so the confound\'s size is visible — it is NOT the answer.',
    '⚠ ONE ARM. No between-arm effect size exists here; DX-T1\'s shut arm is DIFFERENT-BATTERY '
    + 'CONTEXT and no Δ is computed across batteries.',
    '⚠ CLOCK. 1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every per-match '
    + 'COUNT face carries the clock in its unit string; every SHARE face is clock-invariant.',
  ],
  perSeedCells,
  constructionReceipt: receiptRow,
};
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const ALL_GREEN_PRE = Object.values(gates).every((g) => g.ok);
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as typeof artifact & {
  perSeedCells: (Row & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<string, { pooled?: number[]; completed?: number[] }>;
  stratification: { pooledJoint: number[][]; pooledJointCompleted: number[][] };
  discrimination: { verdict: string; delta: DeltaRow };
};
const dcells = disk.perSeedCells;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const nu = sum(dcells.map((c) => def.num(c)));
  const de = sum(dcells.map((c) => def.dn(c)));
  const v = ratio(nu, de);
  const ok = nu === f.numerator && de === f.denominator
    && (Number.isNaN(v) ? Number.isNaN(f.value) : v === f.value);
  faceChecks.push({ face: f.face, ok });
}
for (const dd of disk.deltas) {
  const fl = FACES[dd.left];
  const fr = FACES[dd.right];
  const pl = ratio(sum(dcells.map((c) => fl.num(c))), sum(dcells.map((c) => fl.dn(c))));
  const pr = ratio(sum(dcells.map((c) => fr.num(c))), sum(dcells.map((c) => fr.dn(c))));
  const ok = (Number.isNaN(pl) ? Number.isNaN(dd.leftValue) : pl === dd.leftValue)
    && (Number.isNaN(pr) ? Number.isNaN(dd.rightValue) : pr === dd.rightValue)
    && (Number.isNaN(pl - pr) ? Number.isNaN(dd.delta) : pl - pr === dd.delta);
  faceChecks.push({ face: `delta.${dd.key}`, ok });
}
const binChecks: { bin: string; ok: boolean }[] = [];
const reBin = (key: string, pick: (r: Row) => number[]): void => {
  const got = zeros(pick(dcells[0]).length);
  for (const c of dcells) addInto(got, pick(c));
  const want = (disk.bins[key]?.pooled ?? []) as number[];
  binChecks.push({ bin: key, ok: JSON.stringify(got) === JSON.stringify(want) });
};
reBin('arrivalDistanceMetres', (r) => r.arrDistBins);
reBin('carriedLeadMetres', (r) => r.leadBins);
reBin('motionMetres', (r) => r.motionBins);
reBin('reAskDeltaMetres', (r) => r.reAskBins);
reBin('perceptGapMetres', (r) => r.perceptGapBins);
reBin('laneDeltaSigned', (r) => r.laneDeltaBins);
reBin('shellDeltaSigned', (r) => r.shellDeltaBins);
{
  const got = zeros2(WTICK_BINS, MOTION_BINS);
  for (const c of dcells) addInto2(got, c.motionJoint);
  binChecks.push({ bin: 'stratification.pooledJoint',
    ok: JSON.stringify(got) === JSON.stringify(disk.stratification.pooledJoint) });
  const got2 = zeros2(WTICK_BINS, MOTION_BINS);
  for (const c of dcells) addInto2(got2, c.motionJointCompleted);
  binChecks.push({ bin: 'stratification.pooledJointCompleted',
    ok: JSON.stringify(got2) === JSON.stringify(disk.stratification.pooledJointCompleted) });
}
/** ⭐ THE VERDICT ITSELF is re-derived from the serialized delta */
const dsd = disk.discrimination.delta;
const reVerdict = dsd.ciHi < 0 ? 'FALLING' : dsd.ciLo > 0 ? 'RISING' : 'FLAT';
binChecks.push({ bin: 'discrimination.verdict', ok: reVerdict === disk.discrimination.verdict });
/** ⭐ THE PARTITIONS re-derive off disk too */
{
  const bc = zeros(CARRY_CLASSES.length);
  for (const c of dcells) addInto(bc, c.byClass);
  const gp = dcells.reduce((a, c) => a + c.gpMeasured, 0);
  binChecks.push({ bin: 'partition.carry', ok: sum(bc) === gp });
  const ac = zeros(ARRIVAL_CLASSES.length);
  for (const c of dcells) addInto(ac, c.arrClass);
  binChecks.push({ bin: 'partition.arrival',
    ok: sum(ac) === dcells.reduce((a, c) => a + c.carriedWithAnatomy, 0) });
}
/** ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step */
{
  const sz = (disk as unknown as { sizing: { rows: typeof sizingRows } }).sizing.rows;
  for (const r of sz) {
    const seSmoke = r.hwSmoke / Z975;
    const seNeeded = Math.abs(r.target) / ZSUM;
    const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
    const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
    binChecks.push({
      bin: `sizing.${r.face}@${r.target}`,
      ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded && nReq === r.nRequired
        && hwAtN === r.expectedHalfWidthAtNFrozen
        && hwAtN * ZSUM / Z975 === r.mdeAtNFrozen
        && (nReq <= N_FROZEN) === r.resolvableAt800,
    });
  }
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / partition / `
    + 'VERDICT checks re-derived from the SERIALIZED artifact off disk',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = ALL_GREEN_PRE && FACES_OK;
artifact.allGreen = ALL_GREEN;
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after `gFaces` */
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
banner('');
banner(`DX-C1 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- (a) COMPLETION BY CARRY CLASS ---');
for (const k of CARRY_CLASSES) {
  const f = face(`completion.${k}`);
  const v = face(`volumeShare.${k}`);
  banner(`  ${k.padEnd(14)} completion ${f.value.toFixed(6)} [${f.ciLo.toFixed(6)}, `
    + `${f.ciHi.toFixed(6)}]  n=${f.denominator}  volumeShare ${v.value.toFixed(6)}`);
}
for (const k of ['carriedVsWindupToFeet', 'carriedVsSyncToFeet', 'carriedVsSyncLed']) {
  const d = delta(k);
  banner(`  Δ ${k}: ${d.delta.toFixed(6)} [${d.ciLo.toFixed(6)}, ${d.ciHi.toFixed(6)}] `
    + `(${d.absDeltaOverHalfWidth.toFixed(3)} hw)`);
}
banner('');
banner('--- (b) ARRIVAL ANATOMY ---');
for (const a of ARRIVAL_CLASSES) {
  const s = face(`arrivalShare.${a}`);
  const c = face(`arrivalCompletion.${a}`);
  banner(`  ${a.padEnd(13)} share ${s.value.toFixed(6)} (n=${s.numerator})  completion `
    + `${c.value.toFixed(6)} [${c.ciLo.toFixed(6)}, ${c.ciHi.toFixed(6)}]`);
}
banner(`  mean receiver→point at arrival ${face('arrival.meanReceiverDistanceMetres').value
  .toFixed(6)} m; mean carried lead ${face('arrival.meanCarriedLeadMetres').value.toFixed(6)} m`);
banner(`  lane election ${face('lane.meanAtElection').value.toFixed(6)} → strike `
  + `${face('lane.meanAtStrike').value.toFixed(6)}; shell-blocked `
  + `${face('shell.blockedShareAtElection').value.toFixed(6)} → `
  + `${face('shell.blockedShareAtStrike').value.toFixed(6)}`);
banner(`  receiver disp ${face('motion.meanReceiverDisplacementMetres').value.toFixed(6)} m; `
  + `nearest-def disp ${face('motion.meanNearestDefenderDisplacementMetres').value.toFixed(6)} m; `
  + `windup ${face('motion.meanWindupTicks').value.toFixed(4)} ticks`);
banner('');
banner('--- (c) THE STALENESS–OUTCOME LINK ---');
banner(`  upper ${face('staleness.completionMotionUpperHalfWithinWindupLength').value.toFixed(6)}`
  + ` (n=${face('staleness.completionMotionUpperHalfWithinWindupLength').denominator})  lower `
  + `${face('staleness.completionMotionLowerHalfWithinWindupLength').value.toFixed(6)} `
  + `(n=${face('staleness.completionMotionLowerHalfWithinWindupLength').denominator})`);
banner(`  Δ ${stale.delta.toFixed(6)} [${stale.ciLo.toFixed(6)}, ${stale.ciHi.toFixed(6)}] `
  + `(${stale.absDeltaOverHalfWidth.toFixed(3)} hw)  ⇒ ${DISCRIMINATION}`);
banner(`  ⚠ raw marginal Δ ${delta('stalenessRawMarginal').delta.toFixed(6)} `
  + `[${delta('stalenessRawMarginal').ciLo.toFixed(6)}, `
  + `${delta('stalenessRawMarginal').ciHi.toFixed(6)}]`);
banner('');
banner('--- (d) THE COUNTERFACTUAL RE-ASK ---');
for (const a of AGREE_CLASSES) {
  const s = face(`reAsk.share.${a}`);
  const c = face(`reAsk.completion.${a}`);
  banner(`  ${a.padEnd(9)} share ${s.value.toFixed(6)} (n=${s.numerator})  completion `
    + `${c.value.toFixed(6)} [${c.ciLo.toFixed(6)}, ${c.ciHi.toFixed(6)}]`);
}
banner(`  mean re-ask delta ${face('reAsk.meanDeltaMetres').value.toFixed(6)} m; grew share `
  + `${face('reAsk.grewShare').value.toFixed(6)}`);
banner(`  ⚠ percept gap at the SAME instant ${face('honesty.meanPerceptGapMetres').value
  .toFixed(6)} m`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
