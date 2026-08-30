/**
 * ⭐⭐ RA-T1B — THE PRUNING-DOOR RE-EXAM (docs/world-model/RA-T1B-ACCESS-EXAM.md).
 *
 * Authorized by COMMANDER RULING #361 item 3, on the seat RA-T0 landed (`3f2ed9f`) under
 * #360 item 3's dispatch — the arc the user's fork election 「①′ 接应时间入价」 opened.
 * Contract frame: docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md.
 * Instrument family: scripts/probes/dx-c2-meetability-census.ts (the walk, the account
 * re-read, the classifiers and the outcome ladder are ITS, byte for byte in substance —
 * this exam runs that census's eye over TWO ARMS).
 *
 * ⭐ THE QUESTION: does the receiver-access price actually move the argmax — does the
 * world stop electing balls its own account calls unreachable, WITHOUT the price
 * over-charging the ground game?
 *
 * THE ARMS (paired on seed):
 *   SHUT  = the DX-T1 walked composition — a4MatchFlags(11) + `dlcDeliveryChoice` +
 *           `dlcStrikePlane` + `bkGroundCorridor` + `dxWindupAim` +
 *           armA4World(m, null, 11) + `passLeadSupport` = 1 MATCH-LOCAL.
 *   ARMED = SHUT + `raAccessPrice: true` + `raAccessWeight` = 1 MATCH-LOCAL (the
 *           exam-pinned maximum — the DX-T1 idiom: measure the mechanism at full
 *           expression; the season ladder is where selection speaks).
 *
 * H-RA.1 (frozen at §P.C before any battery seed):
 *   (a) THE PRIMARY FACE `unmeetableCarriedPerMatch` (the count of carried elections
 *       UNMEETABLE at the election instant, per match — DX-C2's own account re-read)
 *       FALLS resolvedly: the paired Δ (armed − shut) 95 % interval ENTIRELY BELOW ZERO.
 *       ⚠ DEVIATION FROM #361's WORDING, STATED AND FLAGGED FOR RATIFICATION: the ruling
 *       says "share"; the SHARE (unmeetable/carried) is REPORTED beside, but it is
 *       undefined exactly when the door works hardest (carried volume → 0), so the COUNT
 *       — the quantity the door exists to reduce, defined in both regimes — is primary.
 *   (b) THE GROUND GAME HOLDS (the H-DX.2(b) form, verbatim):
 *       b1 — the armed `groundPassesPerMatch` POINT estimate sits ABOVE the SHUT arm's
 *            OWN 95 % interval LOWER EDGE (DX-T2 §R3's band construction of record);
 *       b2 — `passCompletion` (the engine's own whole-match completion, the H-DX.2(b)
 *            face) does NOT fall resolvedly: the paired Δ's 95 % interval is NOT
 *            entirely below zero (⚠ a non-fall form at its declared MDE, never
 *            "restored").
 *
 * ⛔ X-SRC-ZERO for this instrument (the seat itself landed at RA-T0 with its own pin
 * suite; the EXAM edits nothing). ⛔ A CENSUS-GRADE READ SCORES THE RULES AND NOTHING
 * ELSE: every other face is REPORTED, gated by nothing.
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
import { PTP_FLIGHT_SPEED } from '../../src/ai/passLeadSeat';
import {
  RA_CHASE_MIN_SPEED, RA_CHASE_REACTION, RA_FLIGHT_SPEED, receiverAccessSeatOf,
} from '../../src/ai/receiverAccessSeat';
import { dist, type V2 } from '../../src/utils/vec';
import {
  passLeadSupportWeight, raAccessWeightOf, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the DX-C2 §1 form                          */
/* ========================================================================== */
const ENV_WHITELIST = ['RAT1B_MODE', 'RAT1B_N', 'RAT1B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('RAT1B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`RA-T1B FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.RAT1B_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('RA-T1B FATAL — RAT1B_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.RAT1B_N !== undefined ? Number(process.env.RAT1B_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('RA-T1B FATAL — RAT1B_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.RAT1B_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`RAT1B_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`RAT1B_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`RAT1B_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ra-t1b-access-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ra-t1b-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('RA-T1B FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the DX-C2 §2 set, unchanged)                              */
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
/* §3 THE ANCHORED SITES — the DX-C2 set + the RA seam's own                   */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const SEAT_PATH = 'src/ai/passLeadSeat.ts';
const RA_PATH = 'src/ai/receiverAccessSeat.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PERC_PATH = 'src/ai/perception.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const RA_SRC = readFileSync(RA_PATH, 'utf8');
const CONST_SRC = readFileSync(CONST_PATH, 'utf8');
const PERC_SRC = readFileSync(PERC_PATH, 'utf8');
const A4_SRC = readFileSync('src/game/a4World.ts', 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};

const TS_CLAMP_NEEDLE = '  const ts = Math.max(p.topSpeed, 0.1);';
const TS_CLAMP_HITS = occurrences(PERC_SRC, TS_CLAMP_NEEDLE);
const TME_NEEDLE = 'const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;';
const TME_HITS = occurrences(PERC_SRC, TME_NEEDLE);
const STRUCK_LEAD_NEEDLE = '  const struckLead = add(mate.pos, scale(mate.vel, flight * 0.8));';
const STRUCK_LEAD_HITS = occurrences(MECH_SRC, STRUCK_LEAD_NEEDLE);
const PTP_SPEED_NEEDLE = 'export const PTP_FLIGHT_SPEED = ';
const PTP_SPEED_HITS = occurrences(SEAT_SRC, PTP_SPEED_NEEDLE);
const CONTROL_R_NEEDLE = 'export const CONTROL_RADIUS = ';
const CONTROL_R_HITS = occurrences(CONST_SRC, CONTROL_R_NEEDLE);
const DX_FORK_NEEDLE = '        if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {';
const DX_FORK_HITS = occurrences(BRAIN_SRC, DX_FORK_NEEDLE);
const RA_FORK_NEEDLE = '  const raSeat = match.raAccessPrice ? receiverAccessSeatOf(g) : null;';
const RA_FORK_HITS = occurrences(BRAIN_SRC, RA_FORK_NEEDLE);
const RA_TERM_NEEDLE = '        : sGc - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;';
const RA_TERM_HITS = occurrences(BRAIN_SRC, RA_TERM_NEEDLE);
const RA_GATE_NEEDLE = '  if (mate.gid === kickerGid) return 0;';
const RA_GATE_HITS = occurrences(RA_SRC, RA_GATE_NEEDLE);
const GC_FORK_NEEDLE = '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;';
const GC_FORK_HITS = occurrences(BRAIN_SRC, GC_FORK_NEEDLE);
const DLC_FORK_NEEDLE = '  const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const DLC_FORK_HITS = occurrences(BRAIN_SRC, DLC_FORK_NEEDLE);
const SP_FORK_NEEDLE = '  const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const SP_FORK_HITS = occurrences(BRAIN_SRC, SP_FORK_NEEDLE);
const DOORS_ABSENT_FROM_A4 = !A4_SRC.includes('dxWindupAim') && !A4_SRC.includes('raAccessPrice')
  && !A4_SRC.includes('raAccessWeight') && !A4_SRC.includes('bkGroundCorridor')
  && !A4_SRC.includes('dlcDeliveryChoice') && !A4_SRC.includes('dlcStrikePlane');

const SEAM_OK = DX_FORK_HITS.length === 1 && RA_FORK_HITS.length === 1
  && RA_TERM_HITS.length === 1 && RA_GATE_HITS.length === 1
  && GC_FORK_HITS.length === 1 && DLC_FORK_HITS.length === 1 && SP_FORK_HITS.length === 1
  && DOORS_ABSENT_FROM_A4;
const ANCHORS_OK = TS_CLAMP_HITS.length === 1 && TME_HITS.length === 2
  && STRUCK_LEAD_HITS.length === 1 && PTP_SPEED_HITS.length === 1
  && CONTROL_R_HITS.length === 1 && PTP_FLIGHT_SPEED === 18
  && RA_FLIGHT_SPEED === PTP_FLIGHT_SPEED && RA_CHASE_REACTION === 0.15
  && RA_CHASE_MIN_SPEED === 0.1;

/* ========================================================================== */
/* §4 THE PREDECESSOR'S BYTES — hashed BEFORE parsing (canon: dose-source guard) */
/* ========================================================================== */
const DXC2_PATH = 'docs/world-model/data/dx-c2-meetability-census.json';
const DXC2_BYTES = readFileSync(DXC2_PATH, 'utf8');
const DXC2_SHA = sha(DXC2_BYTES);
const DXC2 = JSON.parse(DXC2_BYTES) as {
  hashedBodySha256: string;
  faces: { face: string; value: number; numerator: number; denominator: number }[];
  perSeedCells: { matches: number }[];
};
const dxc2Face = (k: string): { value: number; numerator: number; denominator: number } => {
  const f = DXC2.faces.find((x) => x.face === k);
  if (f === undefined) { banner(`RA-T1B FATAL — DX-C2 face missing: ${k}`); process.exit(3); }
  return f!;
};
/** THE NAMED PRIOR for (a)'s magnitude: the census's own unmeetable carried volume. */
const DXC2_MATCHES = DXC2.perSeedCells.length;
const DXC2_UNMEETABLE_CARRIED = dxc2Face('meet.volumeShare.unmeetable').numerator;
const DXC2_UNMEETABLE_PER_MATCH = DXC2_UNMEETABLE_CARRIED / DXC2_MATCHES;
const DXC2_QUOTED_OK = DXC2_SHA.length === 64 && DXC2.hashedBodySha256.length === 64
  && DXC2_MATCHES === 900 && DXC2_UNMEETABLE_CARRIED > 0;
/** the predecessor exam, hashed before parsing — lineage context only, never re-adjudicated */
const RAT1_PATH = 'docs/world-model/data/ra-t1-access-exam.json';
const RAT1_BYTES = readFileSync(RAT1_PATH, 'utf8');
const RAT1_SHA = sha(RAT1_BYTES);
const RAT1 = JSON.parse(RAT1_BYTES) as {
  hashedBodySha256: string; hRA1: { verdict: string };
};
const RAT1_QUOTED_OK = RAT1_SHA.length === 64 && RAT1.hashedBodySha256.length === 64
  && RAT1.hRA1.verdict === 'FAIL';

/* ========================================================================== */
/* §5 SEEDS — block 12,531,000–999 (#361 item 3(iv)); PAIRED on seed           */
/* ========================================================================== */
const BLOCK_BASE = 12_532_000;
const BLOCK_TOP = 12_532_999;
/** 495 pairs = 990 walks + the receipt pair, sized at §DEV-PREFLIGHT (the block's cap). */
const N_FROZEN = 495;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_001_600;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + 100 + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 90 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE, SCRATCH_BASE + 1, SCRATCH_BASE + 2];

/* ========================================================================== */
/* §6 THE ARMS — the world's own composer CALLED; the dose idiom byte for byte */
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
/** the exam-pinned maximum (the DX-T1 idiom): full expression; selection speaks later */
const RA_GENE_VALUE = 1;
const setGenesLocal = (match: Match, side: Side, armed: boolean): void => {
  const team = match.teams[side];
  const view = {
    ...team.baseGenome,
    passLeadSupport: DLC_GENE_VALUE,
    ...(armed ? { raAccessWeight: RA_GENE_VALUE } : {}),
  } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
};
const buildMatch = (seed: number, armed: boolean): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(CORRIDOR_WORLD_VERSION),
    dlcDeliveryChoice: true, dlcStrikePlane: true,
    bkGroundCorridor: true, dxWindupAim: true,
    ...(armed ? { raAccessPrice: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, CORRIDOR_WORLD_VERSION);
  for (const side of [0, 1] as const) setGenesLocal(m, side, armed);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — DX-C2's own, byte for byte in substance       */
/* ========================================================================== */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
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

const CARRY_CLASSES = ['carried', 'windupToFeet', 'syncLed', 'syncToFeet', 'otherGround'] as const;
type CarryClass = (typeof CARRY_CLASSES)[number];
const carryClassOf = (
  viaPerformPass: boolean, fromWindup: boolean, leadMetres: number,
): CarryClass => {
  if (!viaPerformPass) return 'otherGround';
  if (fromWindup) return leadMetres > 0 ? 'carried' : 'windupToFeet';
  return leadMetres > 0 ? 'syncLed' : 'syncToFeet';
};
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');

/** DX-C2 §P.A's frozen account — the SAME arithmetic, re-typed here as the OBSERVER's
 *  copy and fixture-pinned against the seat's exported constants (G-TRACE below). */
const marginOf = (dBallPath: number, dMate: number, topSpeed: number): number =>
  dBallPath / PTP_FLIGHT_SPEED - (dMate / Math.max(topSpeed, 0.1) + 0.15);
const meetableOf = (dMate: number, margin: number): boolean =>
  dMate <= CONTROL_RADIUS || margin >= 0;

interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.shotBeatsPass', klassOf({ ...D0, shots: 1, passes: 1 }, false), 'shot');
fx('klassOf.null', klassOf(D0, false), null);
fx('carryClassOf.carried', carryClassOf(true, true, 3.2), 'carried');
fx('carryClassOf.windupToFeetNull', carryClassOf(true, true, 0), 'windupToFeet');
fx('carryClassOf.syncLed', carryClassOf(true, false, 1.1), 'syncLed');
fx('carryClassOf.otherGround', carryClassOf(false, false, 0), 'otherGround');
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');
fx('marginOf.toFeet10m', marginOf(10, 0, 8), 10 / 18 - 0.15);
fx('marginOf.lead7mSlow', marginOf(15, 7, 7) < 0, true);
fx('meetable.presence', meetableOf(CONTROL_RADIUS * 0.5, -9), true);
fx('meetable.zeroMargin', meetableOf(5, 0), true);
fx('meetable.unmeetable', meetableOf(5, -0.01), false);
/* G-TRACE: the observer's account constants ARE the seat's exported ones */
fx('trace.flightSpeed', RA_FLIGHT_SPEED === PTP_FLIGHT_SPEED && PTP_FLIGHT_SPEED === 18, true);
fx('trace.reaction', RA_CHASE_REACTION, 0.15);
fx('trace.minSpeed', RA_CHASE_MIN_SPEED, 0.1);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 THE FROZEN BINS                                                          */
/* ========================================================================== */
const MARGIN_BIN_S = 0.1;
const MARGIN_BINS = 21;
const LEAD_BIN_M = 0.5;
const LEAD_BINS = 13;
const FLIGHT_RETIRE_TICKS = 720;

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — DX-C2's own, trimmed to this exam's faces            */
/* ========================================================================== */
const CI = (c: CarryClass): number => CARRY_CLASSES.indexOf(c);
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);

interface Row {
  worldOk: boolean; armedVersion: number; flagsOk: boolean; geneOk: boolean; genomeClean: boolean;
  raFlagState: boolean;
  ticks: number; matches: number; wallMs: number;
  depCaptures: number; depCarriedOk: number; depNullOk: number; depMismatch: number;
  depResolves: number; depResolveOk: number; depResolveMismatch: number;
  deliveries: number; gpMeasured: number;
  byClass: number[];
  byClassOutcome: number[][];
  /* the account at the election instant, carried class */
  carriedMarginN: number; carriedUnmeetableN: number; carriedMarginSum: number;
  carriedMarginBins: number[];
  leadSum: number; leadN: number; leadBins: number[];
  goals: number; shots: number; passes: number; passesCompleted: number; interceptions: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, flagsOk: false, geneOk: false, genomeClean: false,
  raFlagState: false,
  ticks: 0, matches: 1, wallMs: 0,
  depCaptures: 0, depCarriedOk: 0, depNullOk: 0, depMismatch: 0,
  depResolves: 0, depResolveOk: 0, depResolveMismatch: 0,
  deliveries: 0, gpMeasured: 0,
  byClass: zeros(CARRY_CLASSES.length),
  byClassOutcome: zeros2(CARRY_CLASSES.length, OUTCOMES.length),
  carriedMarginN: 0, carriedUnmeetableN: 0, carriedMarginSum: 0,
  carriedMarginBins: zeros(MARGIN_BINS),
  leadSum: 0, leadN: 0, leadBins: zeros(LEAD_BINS),
  goals: 0, shots: 0, passes: 0, passesCompleted: 0, interceptions: 0,
});

/* ========================================================================== */
/* §10 THE WALK — DX-C2 §10, byte for byte in substance (trimmed reads)        */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'longBalls', 'crosses', 'throughBalls',
  'cutbacks', 'clearances', 'shots', 'headersWon', 'interceptions', 'tackles', 'goals'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface ArmState {
  tick: number; targetGid: number; readyTick: number;
  aimX: number; aimY: number; matePosX: number; matePosY: number;
  passerX: number; passerY: number; mateTopSpeed: number;
}
interface StrikeState {
  gid: number; tick: number; fromWindup: boolean; leadMetres: number;
  leadX: number; leadY: number; targetGid: number;
  arm: ArmState | null;
  electX: number; electY: number;
  dMateElect: number; marginElect: number; meetableElect: boolean;
}
interface Flight {
  tick: number; gid: number; side: Side; ground: boolean;
  live: boolean; measured: boolean;
  klass: CarryClass; strike: StrikeState | null;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
}

const walkMatch = (m: Match, trace: boolean, expectArmed: boolean): Row => {
  const t0 = Date.now();
  const row = emptyRow();
  row.armedVersion = corridorArmedVersion(m);
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: V2; targetGid: number; aimLead: V2 | null;
    } | null;
    dxStrikeAim: { gid: number; lead: V2; tick: number } | null;
    dxWindupAim: boolean; o1PassWindup: boolean;
    dlcDeliveryChoice: boolean; dlcStrikePlane: boolean; raAccessPrice: boolean;
    armPendingPass: (passer: Player, mate: Player, offsideExempt?: boolean) => void;
    resolvePendingPassWindup: () => void;
  };
  row.raFlagState = mm.raAccessPrice;
  row.flagsOk = mm.dxWindupAim === true && m.bkGroundCorridor === true
    && mm.dlcDeliveryChoice === true && mm.dlcStrikePlane === true && mm.o1PassWindup === true
    && mm.raAccessPrice === expectArmed;
  row.worldOk = row.armedVersion === CORRIDOR_WORLD_VERSION && row.flagsOk;
  row.geneOk = ([0, 1] as const).every((s) => {
    const eff = m.teams[s].effGenome as TacticalGenome;
    const bas = m.teams[s].baseGenome as TacticalGenome;
    const dlcOk = eff.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && bas.dvExposureWeight === CORRIDOR_WORLD_WEIGHT
      && eff.passLeadSupport === DLC_GENE_VALUE && bas.passLeadSupport === DLC_GENE_VALUE
      && passLeadSupportWeight(eff) === DLC_GENE_VALUE;
    const raOk = expectArmed
      ? (eff.raAccessWeight === RA_GENE_VALUE && bas.raAccessWeight === RA_GENE_VALUE
        && raAccessWeightOf(eff) === RA_GENE_VALUE
        && receiverAccessSeatOf(eff) !== null)
      : (eff.raAccessWeight === undefined && bas.raAccessWeight === undefined
        && receiverAccessSeatOf(eff) === null);
    return dlcOk && raOk;
  });
  row.genomeClean = ([0, 1] as const).every((s) => {
    const f = m.teams[s].info.genome as TacticalGenome;
    return f.dvExposureWeight === undefined && f.passLeadSupport === undefined
      && f.raAccessWeight === undefined;
  });

  const players = m.allPlayers;
  const armState = new Map<number, ArmState>();
  const strikes: StrikeState[] = [];
  let inResolveLead: V2 | null | undefined;

  if (trace) {
    const origArm = mm.armPendingPass.bind(m);
    mm.armPendingPass = (passer: Player, mate: Player, offsideExempt = false): void => {
      const dep = mm.dxStrikeAim;
      const eligible = dep !== null && dep.gid === passer.gid && dep.tick === m.simTick;
      const want: V2 | null = (mm.dxWindupAim === true && eligible)
        ? { x: dep!.lead.x, y: dep!.lead.y } : null;
      const snap: Omit<ArmState, 'readyTick'> = {
        tick: m.simTick, targetGid: mate.gid,
        aimX: mate.pos.x, aimY: mate.pos.y, matePosX: mate.pos.x, matePosY: mate.pos.y,
        passerX: passer.pos.x, passerY: passer.pos.y,
        mateTopSpeed: mate.topSpeed,
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
    const origResolve = mm.resolvePendingPassWindup.bind(m);
    mm.resolvePendingPassWindup = (): void => {
      const rec = mm.pendingPassWindup;
      inResolveLead = rec === null ? undefined : rec.aimLead;
      origResolve();
      inResolveLead = undefined;
    };
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
      const electX = (arm !== null ? arm.aimX : mate.pos.x) + lx;
      const electY = (arm !== null ? arm.aimY : mate.pos.y) + ly;
      const elect: V2 = { x: electX, y: electY };
      const matePosE: V2 = arm !== null
        ? { x: arm.matePosX, y: arm.matePosY } : { x: mate.pos.x, y: mate.pos.y };
      const passerPosE: V2 = arm !== null
        ? { x: arm.passerX, y: arm.passerY } : { x: pp.pos.x, y: pp.pos.y };
      const tsE = arm !== null ? arm.mateTopSpeed : mate.topSpeed;
      const dMateElect = dist(matePosE, elect);
      const marginElect = marginOf(dist(passerPosE, elect), dMateElect, tsE);
      strikes.push({
        gid: pp.gid, tick: m.simTick, fromWindup, leadMetres, leadX: lx, leadY: ly,
        targetGid: mate.gid, arm, electX, electY,
        dMateElect, marginElect, meetableElect: meetableOf(dMateElect, marginElect),
      });
      origPerformPass(pp, mate, offsideExempt, powerChoice, ptpLead);
    };
  }

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let flight: Flight | null = null;

  const bookFlight = (f: Flight): void => {
    if (!f.measured) return;
    row.gpMeasured += 1;
    const outcome = outcomeOf(f.completedHere, f.interceptedHere, f.wentDead);
    const ci = CI(f.klass);
    row.byClass[ci] += 1;
    row.byClassOutcome[ci][OI(outcome)] += 1;
    const s = f.strike;
    if (s !== null && f.klass === 'carried') {
      row.carriedMarginN += 1;
      row.carriedMarginSum += s.marginElect;
      row.carriedMarginBins[signedBinOf(s.marginElect, MARGIN_BIN_S, MARGIN_BINS)] += 1;
      if (!s.meetableElect) row.carriedUnmeetableN += 1;
      row.leadSum += s.leadMetres;
      row.leadN += 1;
      row.leadBins[binOf(s.leadMetres, LEAD_BIN_M, LEAD_BINS)] += 1;
    }
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
      let st: StrikeState | null = null;
      for (let i = strikes.length - 1; i >= 0; i--) {
        if (strikes[i].gid === rel.gid && strikes[i].tick === tick) { st = strikes[i]; break; }
        if (strikes[i].tick < tick - 1) break;
      }
      if (st !== null && targetGid !== null && st.targetGid !== targetGid) st = null;
      const klass = carryClassOf(st !== null, st?.fromWindup ?? false, st?.leadMetres ?? 0);
      flight = {
        tick, gid: rel.gid, side: p.side as Side, ground,
        live: true, measured: measurable, klass, strike: st,
        completedHere: false, interceptedHere: false, wentDead: false,
      };
      strikes.length = 0;
    }

    if (flight !== null && flight.live) {
      const mySide = flight.side;
      if (d.passesCompleted[mySide] > 0) flight.completedHere = true;
      if (d.interceptions[1 - mySide] > 0) flight.interceptedHere = true;
      if (!ballIsLive) flight.wentDead = true;
    }
    if (flight !== null) {
      if (ball.owner !== null && ball.owner.gid !== flight.gid) retire();
      else if (flight.completedHere || flight.interceptedHere || flight.wentDead) retire();
      else if (tick - flight.tick > FLIGHT_RETIRE_TICKS) retire();
    }
  }
  retire();
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.shots = st[0].shots + st[1].shots;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.wallMs = Date.now() - t0;
  return row;
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — wrappers byte-inert, PER ARM                     */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
banner('RA-T1B — the lockstep receipt (the observation wrappers, traced vs untraced, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ([false, true] as const).map((armed) => {
  const traced = buildMatch(seed, armed);
  walkMatch(traced, true, armed);
  const untraced = buildMatch(seed, armed);
  walkMatch(untraced, false, armed);
  return { seed, armed, traced: signatureOf(traced), untraced: signatureOf(untraced) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.traced === r.untraced);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm-walks)`);
/** ⭐ G-ARMS-DIVERGE receipt: the door demonstrably bites — at least ONE scratch seed's two
 *  arms are different worlds. ⚠ SOME, not EVERY (amended pre-freeze on this exam's own
 *  smoke): a match where no argmax ever flips walks byte-identically in both arms, and that
 *  is LEGAL — the term only reprices, it never forces; seed 900,001,600 is exactly such a
 *  match. Requiring every seed to diverge would conflate "the door can bite" with "the door
 *  bites every match". */
const ARMS_DIVERGE = LOCKSTEP_SEEDS.some((seed) => {
  const shut = lockstepRows.find((r) => r.seed === seed && !r.armed)!;
  const armed = lockstepRows.find((r) => r.seed === seed && r.armed)!;
  return shut.traced !== armed.traced;
});

/* ========================================================================== */
/* §12 THE BATTERY — PAIRED on seed                                            */
/* ========================================================================== */
interface Pair { seed: number; shut: Row; armed: Row }
const pairs: Pair[] = [];
banner(`RA-T1B — the battery: ${N} PAIRS (${N * 2} walks), seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 50;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  const slice = batterySeeds.slice(start, start + CHUNK);
  for (const seed of slice) {
    const shut = walkMatch(buildMatch(seed, false), true, false);
    const armed = walkMatch(buildMatch(seed, true), true, true);
    pairs.push({ seed, shut, armed });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} pairs `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptShut = walkMatch(buildMatch(RECEIPT_SEED, false), true, false);
const receiptArmed = walkMatch(buildMatch(RECEIPT_SEED, true), true, true);
const walksBooked = pairs.length * 2 + 2;

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over pairs (consumes NO stats)        */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: pairs.length }, () => Math.floor(rngBoot.next() * pairs.length) % pairs.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef { unit: string; what: string; num: (r: Row) => number; dn: (r: Row) => number }
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, num, dn }; };

defFace('unmeetableCarriedPerMatch', 'flights per match (240 s match clock)',
  '⭐⭐ (a) THE PRIMARY FACE — carried elections UNMEETABLE at the election instant, per match',
  (r) => r.carriedUnmeetableN, (r) => r.matches);
defFace('unmeetableShareCarried', 'share',
  '(a-reported) the DX-C2 (a) share — unmeetable / carried (⚠ undefined at zero carried volume)',
  (r) => r.carriedUnmeetableN, (r) => r.carriedMarginN);
defFace('carriedPerMatch', 'flights per match (240 s match clock)',
  'the carried class volume', (r) => r.byClass[CI('carried')], (r) => r.matches);
defFace('groundPassesPerMatch', 'passes per match (240 s match clock)',
  'REPORTED (demoted from scoring at #363) — measured ground passes per match',
  (r) => r.gpMeasured, (r) => r.matches);
defFace('passCompletion', 'share',
  'REPORTED (demoted from scoring at #363) — the engine\'s own whole-match completion',
  (r) => r.passesCompleted, (r) => r.passes);
defFace('completionCarried', 'share', 'completion of the carried class',
  (r) => r.byClassOutcome[CI('carried')][OI('completed')], (r) => r.byClass[CI('carried')]);
defFace('unresolvedShareCarried', 'share', 'unresolved share of the carried class',
  (r) => r.byClassOutcome[CI('carried')][OI('unresolved')], (r) => r.byClass[CI('carried')]);
defFace('meanCarriedLeadMetres', 'metres', 'mean carried lead magnitude',
  (r) => r.leadSum, (r) => r.leadN);
defFace('meanCarriedMarginSeconds', 'seconds', 'mean carried access margin at election',
  (r) => r.carriedMarginSum, (r) => r.carriedMarginN);
defFace('goalsPerMatch', 'goals per match (240 s match clock)', '⭐ (b1′) THE CREATION FACE — goals',
  (r) => r.goals, (r) => r.matches);
defFace('interceptionsPerMatch', 'per match (240 s match clock)',
  '⭐ (b2′) THE TURNOVER FACE — interceptions conceded',
  (r) => r.interceptions, (r) => r.matches);
defFace('shotsPerMatch', 'per match (240 s match clock)', 'REPORTED — a second creation eye',
  (r) => r.shots, (r) => r.matches);
defFace('measuredCompletionAll', 'share',
  'REPORTED — completion of the measured ground-pass population',
  (r) => CARRY_CLASSES.reduce((a, _, i) => a + r.byClassOutcome[i][OI('completed')], 0),
  (r) => r.gpMeasured);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: 'shut' | 'armed'; unit: string; what: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const armRows = (arm: 'shut' | 'armed'): Row[] => pairs.map((p) => p[arm]);
const faces: FaceRow[] = [];
for (const arm of ['shut', 'armed'] as const) {
  const rows = armRows(arm);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
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
    faces.push({
      face: key, arm, unit: f.unit, what: f.what,
      value: point, numerator: sum(nu), denominator: sum(de),
      ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    });
  }
}
const face = (arm: 'shut' | 'armed', k: string): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === arm);
  if (f === undefined) { banner(`RA-T1B FATAL — unknown face ${arm}.${k}`); process.exit(3); }
  return f!;
};
/** THE PAIRED Δ — armed − shut inside the SAME resampled pair set */
interface DeltaRow {
  key: string; shutValue: number; armedValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
  looMaxInfluenceShare: number; looFlips: number;
}
const pairedDelta = (key: string, frozenRule: ((d: { ciLo: number; ciHi: number }) => boolean) | null): DeltaRow => {
  const f = FACES[key];
  const nuS = pairs.map((p) => f.num(p.shut));
  const deS = pairs.map((p) => f.dn(p.shut));
  const nuA = pairs.map((p) => f.num(p.armed));
  const deA = pairs.map((p) => f.dn(p.armed));
  const pS = ratio(sum(nuS), sum(deS));
  const pA = ratio(sum(nuA), sum(deA));
  const point = pA - pS;
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nuA[i]; d1 += deA[i]; n2 += nuS[i]; d2 += deS[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  /* ⭐ LOO sensitivity (the #346/#348 orders): drop each pair, re-derive the POINT Δ;
     influence = |Δ_loo − Δ| / |Δ|; a FLIP = the frozen rule's verdict changing when the
     interval is SHIFTED by the influence (conservative point-shift form, stated). */
  const totNuS = sum(nuS); const totDeS = sum(deS);
  const totNuA = sum(nuA); const totDeA = sum(deA);
  let maxInf = 0; let flips = 0;
  for (let i = 0; i < pairs.length; i++) {
    const dLoo = ratio(totNuA - nuA[i], totDeA - deA[i]) - ratio(totNuS - nuS[i], totDeS - deS[i]);
    const inf = Math.abs(dLoo - point);
    if (inf / Math.max(Math.abs(point), 1e-12) > maxInf) {
      maxInf = inf / Math.max(Math.abs(point), 1e-12);
    }
    if (frozenRule !== null) {
      const shift = dLoo - point;
      if (frozenRule({ ciLo: lo, ciHi: hi }) !== frozenRule({ ciLo: lo + shift, ciHi: hi + shift })) {
        flips += 1;
      }
    }
  }
  return {
    key, shutValue: pS, armedValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
    looMaxInfluenceShare: maxInf, looFlips: flips,
  };
};
const RULE_A = (d: { ciLo: number; ciHi: number }): boolean => d.ciHi < 0;
/** (b1′) CREATION does not fall: the goals Δ interval is NOT entirely below zero */
const RULE_B1P = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciHi < 0);
/** (b2′) TURNOVERS do not rise: the interceptions Δ interval is NOT entirely above zero */
const RULE_B2P = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciLo > 0);
const deltas: DeltaRow[] = [
  pairedDelta('unmeetableCarriedPerMatch', RULE_A),
  pairedDelta('unmeetableShareCarried', null),
  pairedDelta('carriedPerMatch', null),
  pairedDelta('groundPassesPerMatch', null),
  pairedDelta('passCompletion', null),
  pairedDelta('completionCarried', null),
  pairedDelta('unresolvedShareCarried', null),
  pairedDelta('meanCarriedLeadMetres', null),
  pairedDelta('meanCarriedMarginSeconds', null),
  pairedDelta('goalsPerMatch', RULE_B1P),
  pairedDelta('interceptionsPerMatch', RULE_B2P),
  pairedDelta('shotsPerMatch', null),
  pairedDelta('measuredCompletionAll', null),
];
const delta = (k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k);
  if (d === undefined) { banner(`RA-T1B FATAL — unknown delta ${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 H-RA.1B — THE FROZEN RULES APPLIED                                     */
/* ========================================================================== */
const dA = delta('unmeetableCarriedPerMatch');
const A_VERDICT: 'FALLS' | 'DOES-NOT-FALL' = RULE_A(dA) ? 'FALLS' : 'DOES-NOT-FALL';
const dB1 = delta('goalsPerMatch');
const B1_VERDICT: 'DOES-NOT-FALL' | 'FALLS' = RULE_B1P(dB1) ? 'DOES-NOT-FALL' : 'FALLS';
const dB2 = delta('interceptionsPerMatch');
const B2_VERDICT: 'DOES-NOT-RISE' | 'RISES' = RULE_B2P(dB2) ? 'DOES-NOT-RISE' : 'RISES';
const H_RA1B: 'PASS' | 'FAIL' =
  A_VERDICT === 'FALLS' && B1_VERDICT === 'DOES-NOT-FALL' && B2_VERDICT === 'DOES-NOT-RISE'
    ? 'PASS' : 'FAIL';

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form, from THIS exam's own scratch smoke  */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised paired-Δ half-widths (seeds 900,001,500–511;
 *  §DEV-PREFLIGHT), read out of the smoke artifact's own `deltas[].halfWidth` fields */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'unmeetableCarriedPerMatch', group: '(a)',
    hwSmoke: 0.8333333333333336, target: -DXC2_UNMEETABLE_PER_MATCH / 4 },
  { face: 'goalsPerMatch', group: "(b1')", hwSmoke: 1.25, target: 0.25 },
  { face: 'goalsPerMatch@0.3', group: "(b1')", hwSmoke: 1.25, target: 0.3 },
  { face: 'interceptionsPerMatch', group: "(b2')", hwSmoke: 2.791666666666666, target: 1 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);

/* ========================================================================== */
/* §16 THE GATES                                                               */
/* ========================================================================== */
const allRows = [...armRows('shut'), ...armRows('armed'), receiptShut, receiptArmed];
const totalGpShut = sum(armRows('shut').map((r) => r.gpMeasured));
const totalGpArmed = sum(armRows('armed').map((r) => r.gpMeasured));
const partitionOk = (rows: Row[]): boolean => rows.every((r) =>
  sum(r.byClass) === r.gpMeasured
  && CARRY_CLASSES.every((_, i) => sum(r.byClassOutcome[i]) === r.byClass[i]));
const walkedSeeds = [...new Set(pairs.map((p) => p.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: allRows.every((r) => r.worldOk),
    note: 'every walked match is world 11 with the DX-T1 stack ALL TRUE, and the RA flag '
      + 'matches its own arm — asserted off the REAL constructed match, both arms',
  },
  gGeneValuePinned: {
    ok: allRows.every((r) => r.geneOk),
    note: 'the DLC gene at 1 by VALUE on both views of both teams in BOTH arms; '
      + '`raAccessWeight` = 1 by VALUE (read back through `raAccessWeightOf`, seat non-null) '
      + 'in the ARMED arm and ABSENT (seat null) in the SHUT arm, every walked match',
  },
  gGenomeClean: {
    ok: allRows.every((r) => r.genomeClean),
    note: 'the FRANCHISE genome carries none of the three genes (canon: dose placement)',
  },
  gSeamSitesPinned: {
    ok: SEAM_OK,
    note: 'ONE `dxWindupAim` fork · ONE `raAccessPrice` fork · ONE RA term statement · ONE '
      + 'self-delivery gate in the seat · ONE GC fork · ONE DLC fork · ONE strike-plane fork · '
      + 'ZERO of the doors (RA included) in `a4World.ts`',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: 'the account\'s trace intact (ts-clamp ×1 · time-to-point ×2 · struckLead ×1 · '
      + 'PTP_FLIGHT_SPEED · CONTROL_RADIUS) and the seat\'s exported constants ARE the traced '
      + 'family (G-TRACE fixtures)',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — classifiers, outcome ladder, the account arithmetic and the trace pins',
  },
  gCarryPartition: {
    ok: partitionOk(allRows) && totalGpShut > 0 && totalGpArmed > 0,
    note: 'every measured ground pass lands in EXACTLY ONE carry class and outcomes sum, '
      + 'row by row, BOTH arms',
  },
  gClassesNonVacuous: {
    ok: sum(armRows('shut').map((r) => r.carriedMarginN)) > 0
      && sum(armRows('armed').map((r) => r.carriedMarginN)) > 0
      && sum(armRows('shut').map((r) => r.carriedUnmeetableN)) > 0,
    note: '⛔ no face on an empty cell: the carried class is live in BOTH arms and the shut '
      + 'arm\'s unmeetable bucket is populated (the quantity (a) must reduce EXISTS). '
      + '⚠ LIVENESS only — the ARMED arm\'s unmeetable count is (a)\'s own question and is '
      + 'NOT gated',
  },
  gDepositCarriesElection: {
    ok: allRows.every((r) => r.depMismatch === 0 && r.depResolveMismatch === 0)
      && sum(allRows.map((r) => r.depCarriedOk)) > 0,
    note: 'DX-T1 §R6\'s pin RE-RUN on this block, both arms: ZERO mismatches',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ the THREE observation wrappers are BYTE-INERT in BOTH arms (6 arm-walks, '
      + 'traced vs untraced byte-identical)',
  },
  gArmsDiverge: {
    ok: ARMS_DIVERGE,
    note: '⭐ the RECEIPT that the door demonstrably bites: AT LEAST ONE scratch seed\'s two '
      + 'arms are different worlds (⚠ SOME, not EVERY — a match where no argmax ever flips '
      + 'legally walks byte-identically in both arms; amended pre-freeze on this exam\'s own '
      + 'smoke, where seed 900,001,600 was such a match). An INSTRUMENT receipt, never a '
      + 'finding',
  },
  gQuotedSourceIntact: {
    ok: DXC2_QUOTED_OK && RAT1_QUOTED_OK,
    note: 'DX-C2\'s artifact bytes HASHED BEFORE PARSING; the (a) target magnitude READ from '
      + 'its own fields, never re-typed from prose',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: 'worktree-vs-HEAD over `src/` EMPTY both ways (canon: xSrcUntouched)',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === N_FROZEN * 2 + 2
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === N * 2 + 2
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED: every pair seed and the receipt seed lie inside block '
      + '12,531,000–999; each seed walked EXACTLY TWICE (once per arm) + the receipt pair; '
      + 'lockstep on out-of-band scratch',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (pairs.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (pairs.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: declared, n as declared, artifact off every canonical path'
      : 'THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = '
        + '495 pairs',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedPairs = pairs.map((p) => ({ seed: p.seed, shut: p.shut, armed: p.armed }));
const pooledMarginShut = zeros(MARGIN_BINS);
const pooledMarginArmed = zeros(MARGIN_BINS);
const pooledLeadShut = zeros(LEAD_BINS);
const pooledLeadArmed = zeros(LEAD_BINS);
for (const p of pairs) {
  addInto(pooledMarginShut, p.shut.carriedMarginBins);
  addInto(pooledMarginArmed, p.armed.carriedMarginBins);
  addInto(pooledLeadShut, p.shut.leadBins);
  addInto(pooledLeadArmed, p.armed.leadBins);
}

const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'hRA1B', 'bins', 'arms',
  'carryClasses', 'outcomes', 'seeds', 'stats',
  'quotedContext', 'anchoredSites', 'fixtures', 'lockstep', 'perf', 'honestLimits', 'sizing',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'RA-T1B',
    title: 'THE ACCESS-PRICE EXAM — does the argmax stop electing balls its own account calls '
      + 'unreachable, without the price over-charging the ground game',
    doc: 'docs/world-model/RA-T1B-ACCESS-EXAM.md',
    contract: 'docs/world-model/DX-DELIVERY-EXECUTION-CONTRACT.md',
    seam: 'docs/world-model/RA-T0-DORMANT-SEAM.md (seam commit 3f2ed9f)',
    predecessor: 'docs/world-model/DX-C2-MEETABILITY-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #363 item 3 (the user\'s ①′ re-election at the #362 fork, after the numbers-first correction of the completed-passes ruler)',
    kind: 'EXAM — H-RA.1 is scored by the frozen §P.C rules; every other face is REPORTED, '
      + 'gated by nothing.',
    arms: 'PAIRED on seed. SHUT = the DX-T1 walked composition (world 11 + DLC pair + GC + '
      + 'dxWindupAim + passLeadSupport=1 match-local). ARMED = SHUT + raAccessPrice + '
      + 'raAccessWeight=1 match-local (the exam-pinned maximum).',
    xSrcZero: 'the exam instrument edits nothing under `src/`; the seat under test landed at '
      + 'RA-T0 with its own pin suite. Three byte-inert observation wrappers (lockstep-proven '
      + 'per arm).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/ra-t1b-access-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/ra-t1b-access-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: {
      [MATCH_PATH]: sha(MATCH_SRC), [BRAIN_PATH]: sha(BRAIN_SRC), [MECH_PATH]: sha(MECH_SRC),
      [SEAT_PATH]: sha(SEAT_SRC), [RA_PATH]: sha(RA_SRC), [CONST_PATH]: sha(CONST_SRC),
      [PERC_PATH]: sha(PERC_SRC),
    },
  },
  arms: {
    shut: 'a4MatchFlags(11) + dlcDeliveryChoice + dlcStrikePlane + bkGroundCorridor + '
      + 'dxWindupAim + armA4World(m, null, 11) + passLeadSupport = 1 MATCH-LOCAL',
    armed: 'SHUT + raAccessPrice: true + raAccessWeight = 1 MATCH-LOCAL (the exam-pinned '
      + 'maximum — the DX-T1 idiom; the season ladder is where selection speaks, later)',
  },
  hRA1B: {
    frozenRules: {
      a: '(a) Δ(armed − shut) on unmeetableCarriedPerMatch: 95 % interval ENTIRELY BELOW '
        + 'ZERO ⇒ FALLS (the RA-T1 form, unchanged; the count-primary deviation RATIFIED at '
        + '#362 item 3 — the share is REPORTED beside).',
      b1p: '(b1′) CREATION — Δ(armed − shut) on goalsPerMatch: the 95 % interval is NOT '
        + 'entirely below zero ⇒ DOES-NOT-FALL (declared target 0.25 goals/match; a non-fall '
        + 'form at its declared MDE, never "restored"). Re-cut at #363 on the user\'s ①′ '
        + 'election; RA-T1\'s battery never re-adjudicated.',
      b2p: '(b2′) TURNOVERS — Δ(armed − shut) on interceptionsPerMatch: the 95 % interval is '
        + 'NOT entirely above zero ⇒ DOES-NOT-RISE (declared target 1.0/match).',
    },
    aVerdict: A_VERDICT,
    b1Verdict: B1_VERDICT,
    b2Verdict: B2_VERDICT,
    verdict: H_RA1B,
    aDelta: dA,
    b1Delta: dB1,
    b2Delta: dB2,
  },
  anchoredSites: [
    { what: 'THE ONE `raAccessPrice` FORK', file: BRAIN_PATH, needle: RA_FORK_NEEDLE,
      occurrences: RA_FORK_HITS },
    { what: 'THE ONE RA TERM STATEMENT', file: BRAIN_PATH, needle: RA_TERM_NEEDLE,
      occurrences: RA_TERM_HITS },
    { what: 'THE SELF-DELIVERY GATE', file: RA_PATH, needle: RA_GATE_NEEDLE,
      occurrences: RA_GATE_HITS },
    { what: 'THE ONE `dxWindupAim` FORK', file: BRAIN_PATH, needle: DX_FORK_NEEDLE,
      occurrences: DX_FORK_HITS },
    { what: 'interceptBall\'s ts clamp', file: PERC_PATH, needle: TS_CLAMP_NEEDLE,
      occurrences: TS_CLAMP_HITS },
    { what: 'interceptBall\'s time-to-point form (2 honest occurrences)', file: PERC_PATH,
      needle: TME_NEEDLE, occurrences: TME_HITS },
    { what: 'the strike-time composition pin', file: MECH_PATH, needle: STRUCK_LEAD_NEEDLE,
      occurrences: STRUCK_LEAD_HITS },
    { what: 'PTP_FLIGHT_SPEED', file: SEAT_PATH, needle: PTP_SPEED_NEEDLE,
      occurrences: PTP_SPEED_HITS, extracted: PTP_FLIGHT_SPEED },
    { what: 'CONTROL_RADIUS', file: CONST_PATH, needle: CONTROL_R_NEEDLE,
      occurrences: CONTROL_R_HITS, extracted: CONTROL_RADIUS },
  ],
  fixtures: FIXTURES,
  lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-pair SCRATCH SMOKE (seeds 900,001,500–511), '
      + 'DISCLOSED at the doc\'s §DEV-PREFLIGHT. (a)\'s target = −25 % of DX-C2\'s own '
      + 'unmeetable-carried volume (READ from its artifact: '
      + `${DXC2_UNMEETABLE_CARRIED}/${DXC2_MATCHES} per match); (b2)\'s target = 0.01 `
      + '(the DX-T1 completion-fall magnitude\'s order).',
    nFrozen: N_FROZEN,
    aTargetPerMatch: -DXC2_UNMEETABLE_PER_MATCH / 4,
    rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  carryClasses: CARRY_CLASSES,
  outcomes: OUTCOMES,
  bins: {
    carriedMarginSeconds: { width: MARGIN_BIN_S, bins: MARGIN_BINS, centreHoldsZero: true,
      pooledShut: pooledMarginShut, pooledArmed: pooledMarginArmed },
    carriedLeadMetres: { width: LEAD_BIN_M, bins: LEAD_BINS, overflowIsLast: true,
      pooledShut: pooledLeadShut, pooledArmed: pooledLeadArmed },
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
    raT1: {
      role: '⚠ THE PREDECESSOR EXAM (block 12,531,000–999). Its (b) volume band was re-cut '
        + 'at #363 on the user\'s ①′ election; its battery is NEVER re-adjudicated and no Δ '
        + 'is computed across batteries. Quoted so the re-cut\'s lineage is auditable.',
      source: { path: RAT1_PATH, sha256: RAT1_SHA },
      hashedBodySha256: RAT1.hashedBodySha256,
      hRA1VerdictOfRecord: RAT1.hRA1.verdict,
    },
    dxC2: {
      role: '⚠ DIFFERENT-BATTERY CONTEXT (block 12,530,000–999, ONE arm). Quoted for (a)\'s '
        + 'sizing target only. ⛔ NO Δ IS COMPUTED ACROSS BATTERIES.',
      source: { path: DXC2_PATH, sha256: DXC2_SHA },
      hashedBodySha256: DXC2.hashedBodySha256,
      unmeetableCarried: DXC2_UNMEETABLE_CARRIED,
      matches: DXC2_MATCHES,
    },
  },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerWalk: sum(allRows.map((r) => r.wallMs)) / 1000 / allRows.length,
    note: '⚠ A MACHINE READING ON ONE MACHINE.',
  },
  honestLimits: [
    '⭐ THE PIN IS THE MAXIMUM (raAccessWeight = 1): this exam measures the mechanism at full '
    + 'expression, the DX-T1 idiom. What weight selection actually adopts is the season '
    + 'ladder\'s question (REPORTED separately when run), and the dose-response middle is '
    + 'unmeasured here — a future rung if the user orders one.',
    '⭐ (a)\'s PRIMARY IS THE COUNT, the ruling said SHARE — deviation stated at §P.C and in '
    + 'the artifact\'s own frozenRules; the share is published beside. FLAGGED FOR '
    + 'RATIFICATION at the results ruling.',
    '⚠ THE LOO FLIP READ USES A CONSERVATIVE POINT-SHIFT FORM (the interval translated by '
    + 'each pair\'s influence) — stated, never hidden.',
    '⚠ THE ARMS SHARE SEEDS, NOT TRAJECTORIES: the paired design removes seed-level variance; '
    + 'nothing about a pair\'s two walks is otherwise coupled.',
    '⚠ THE OBSERVER\'S ACCOUNT COPY is fixture-pinned against the seat\'s exported constants '
    + '(G-TRACE) — one law, two readers, drift-checked.',
    '⚠ CLOCK. 1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds.',
  ],
  perSeedPairs,
  constructionReceipt: { shut: receiptShut, armed: receiptArmed },
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
  perSeedPairs: { seed: number; shut: Row; armed: Row }[];
  faces: FaceRow[]; deltas: DeltaRow[];
  hRA1B: { verdict: string; aVerdict: string; b1Verdict: string; b2Verdict: string;
    aDelta: DeltaRow; b1Delta: DeltaRow; b2Delta: DeltaRow };
};
const dpairs = disk.perSeedPairs;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = dpairs.map((p) => (f.arm === 'shut' ? p.shut : p.armed));
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  const v = ratio(nu, de);
  const ok = nu === f.numerator && de === f.denominator
    && (Number.isNaN(v) ? Number.isNaN(f.value) : v === f.value);
  faceChecks.push({ face: `${f.arm}.${f.face}`, ok });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.key];
  const pS = ratio(sum(dpairs.map((p) => def.num(p.shut))), sum(dpairs.map((p) => def.dn(p.shut))));
  const pA = ratio(sum(dpairs.map((p) => def.num(p.armed))), sum(dpairs.map((p) => def.dn(p.armed))));
  const ok = pS === dd.shutValue && pA === dd.armedValue
    && (Number.isNaN(pA - pS) ? Number.isNaN(dd.delta) : pA - pS === dd.delta);
  faceChecks.push({ face: `delta.${dd.key}`, ok });
}
const binChecks: { bin: string; ok: boolean }[] = [];
/** the verdicts re-derive from the serialized rows */
{
  const dsa = disk.hRA1B.aDelta;
  const reA = dsa.ciHi < 0 ? 'FALLS' : 'DOES-NOT-FALL';
  binChecks.push({ bin: 'hRA1B.aVerdict', ok: reA === disk.hRA1B.aVerdict });
  const dsb1 = disk.hRA1B.b1Delta;
  const reB1 = !(dsb1.ciHi < 0) ? 'DOES-NOT-FALL' : 'FALLS';
  binChecks.push({ bin: 'hRA1B.b1Verdict', ok: reB1 === disk.hRA1B.b1Verdict });
  const dsb2 = disk.hRA1B.b2Delta;
  const reB2 = !(dsb2.ciLo > 0) ? 'DOES-NOT-RISE' : 'RISES';
  binChecks.push({ bin: 'hRA1B.b2Verdict', ok: reB2 === disk.hRA1B.b2Verdict });
  const reAll = (reA === 'FALLS' && reB1 === 'DOES-NOT-FALL' && reB2 === 'DOES-NOT-RISE')
    ? 'PASS' : 'FAIL';
  binChecks.push({ bin: 'hRA1B.verdict', ok: reAll === disk.hRA1B.verdict });
}
{
  const got = zeros(MARGIN_BINS);
  for (const p of dpairs) addInto(got, p.shut.carriedMarginBins);
  binChecks.push({ bin: 'bins.marginShut',
    ok: JSON.stringify(got) === JSON.stringify((disk.bins as Record<string, { pooledShut: number[] }>).carriedMarginSeconds.pooledShut) });
  const got2 = zeros(MARGIN_BINS);
  for (const p of dpairs) addInto(got2, p.armed.carriedMarginBins);
  binChecks.push({ bin: 'bins.marginArmed',
    ok: JSON.stringify(got2) === JSON.stringify((disk.bins as Record<string, { pooledArmed: number[] }>).carriedMarginSeconds.pooledArmed) });
}
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
        && (nReq <= N_FROZEN) === r.resolvableAtNFrozen,
    });
  }
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} verdict / bin / sizing `
    + 'checks re-derived from the SERIALIZED artifact off disk (H-RA.1\'s own verdict '
    + 'INCLUDED)',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = ALL_GREEN_PRE && FACES_OK;
artifact.allGreen = ALL_GREEN;
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
banner('');
banner(`RA-T1B — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- H-RA.1B ---');
banner(`  (a) unmeetableCarriedPerMatch shut ${face('shut', 'unmeetableCarriedPerMatch').value
  .toFixed(6)} → armed ${face('armed', 'unmeetableCarriedPerMatch').value.toFixed(6)}  Δ `
  + `${dA.delta.toFixed(6)} [${dA.ciLo.toFixed(6)}, ${dA.ciHi.toFixed(6)}] `
  + `(${dA.absDeltaOverHalfWidth.toFixed(3)} hw, LOO flips ${dA.looFlips})  ⇒ ${A_VERDICT}`);
banner(`  (b1′) goalsPerMatch Δ ${dB1.delta.toFixed(6)} [${dB1.ciLo.toFixed(6)}, `
  + `${dB1.ciHi.toFixed(6)}] (LOO flips ${dB1.looFlips})  ⇒ ${B1_VERDICT}`);
banner(`  (b2′) interceptionsPerMatch Δ ${dB2.delta.toFixed(6)} [${dB2.ciLo.toFixed(6)}, `
  + `${dB2.ciHi.toFixed(6)}] (LOO flips ${dB2.looFlips})  ⇒ ${B2_VERDICT}`);
banner(`  ⭐ H-RA.1B = ${H_RA1B}`);
banner('');
banner('--- REPORTED ---');
for (const k of ['unmeetableShareCarried', 'carriedPerMatch', 'completionCarried',
  'unresolvedShareCarried', 'meanCarriedLeadMetres', 'meanCarriedMarginSeconds',
  'goalsPerMatch', 'interceptionsPerMatch', 'measuredCompletionAll', 'groundPassesPerMatch']) {
  const dd = delta(k);
  banner(`  ${k.padEnd(26)} shut ${dd.shutValue.toFixed(6)} → armed ${dd.armedValue.toFixed(6)}`
    + `  Δ ${dd.delta.toFixed(6)} [${dd.ciLo.toFixed(6)}, ${dd.ciHi.toFixed(6)}]`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
