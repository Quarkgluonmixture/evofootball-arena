/**
 * ⭐⭐ RC-T1b — THE READY EXAM (docs/world-model/RC-T1B-READY-EXAM.md).
 *
 * Authorized by COMMANDER RULING #380 item 6. Binding contracts:
 * docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3a / M-RC.3b (as
 * amended at #379 and banked at #380) · docs/world-model/BF-BODY-FACING-CONTRACT.md M-BF.4.
 *
 * Instrument family: scripts/probes/bf-t1-facing-cost-exam.ts (the six-arm form, the estimator,
 * the bootstrap, LOO, the compact JSON, the hash order, the faces registry, the keeper and
 * misalignment reads) + scripts/probes/rc-t1a-precue-exam.ts (THE EXAM FORM OF RECORD — the
 * match-local gene idiom, the arrival gap byte for byte, the start-delay receipt, the season
 * ladder) + scripts/probes/pt-c0-playtest-forensic-census.ts (the contact / sector / crowd
 * code) + TWO NEW READS: the READY coverage and the PER-SHOT keeper read.
 *
 * ⭐ THE QUESTION, in the user's own three sentences, on the world he played:
 *   (a) does the ball stop hitting the receiver's SIDE and BACK?
 *   (b) does it hit MORE opponents? (it must not)
 *   (c) is the world still football?
 *
 * THE SIX ARMS, PAIRED on shared seeds (arm k walks seed s with the IDENTICAL population
 * construction — RC-T1a's own `buildMatch` plumbing):
 *   E0 = world 12 EMPTY-BOOK: a4MatchFlags(12) + armA4World(m, null, 12). `bfFacingCost`,
 *        `rcAnticipate` and `rcReady` ALL ABSENT; the gene ABSENT — the world the entry IS.
 *   E1 = E0 + { bfFacingCost: true } ⇒ the SHIPPED writer `Match.setFacingDepth()` puts
 *        BF_DEPTH on every body and every substitute.
 *   E2 = E1 + { rcAnticipate: true } + `rcAnticipationWeight` = 1 MATCH-LOCAL on both teams.
 *   E3 = E2 + { rcReady: true } — THE CANDIDATE DOOR (world 13's shape).
 *   D0 / D3 = E0 / E3 DOSED: armA4World(m, null, 12, L3_DOSE, PC_DOSE) through the SHIPPED
 *        loaders, `gDoseSource` hashing the bytes against PT-C0's two PINNED values.
 *   THE SCORED PAIR = E3 − E1. REPORTED PAIRS (rule WORDS STORED beside every interval,
 *   never scored): E2 − E1 · E3 − E2 · E1 − E0 · E3 − E0 · D3 − D0.
 *
 * H-RC.2 (frozen at §P.C before any battery seed; SCORED ON E3 − E1 ONLY):
 *   (a) Δ `contact.ownTargetSideBackShare` ENTIRELY BELOW ZERO ⇒ FALLS.
 *   (b) Δ `contact.opponentFirstContactShare` NOT entirely above zero ⇒ DOES-NOT-RISE.
 *   (c1) Δ `goalsPerMatch` NOT entirely outside [−0.30, +0.30] ⇒ WITHIN-BAND.
 *   (c2) Δ `passCompletion` NOT entirely below −0.010 ⇒ DOES-NOT-FALL.
 *   (c3) Δ `interceptionsPerMatch` NOT entirely above +1.0 ⇒ DOES-NOT-RISE.
 *   H-RC.2 = PASS ⇔ (a) ∧ (b) ∧ (c1) ∧ (c2) ∧ (c3).
 *   ⚠ A non-fall / non-rise / within-band certifies NOTHING SMALLER THAN ITS DECLARED MDE.
 *   ⚠ The sector faces are SELECTION statistics — who reaches a first touch at all can change.
 *
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited — every seam is already in the tree
 * (BF-T0 +FIX, RC-T0 and RC-T0b +FIX, each with its own pin suite); this probe CALLS the
 * shipped exports and reads public `Match` / `Player` state per tick. THERE IS NO WRAPPER AND
 * NO DOSE WRITE AT ALL; `gLockstep` proves observed ≡ unobserved per arm.
 * ⛔ Receipts are receipts: the READY coverage, the 3a `preCuedArms` ledger, the BF coverage
 * and the substitution counts are ARMING PLUMBING and are NEVER quoted as football effect
 * sizes (home: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, AI_INTERVAL, GRAVITY, MATCH_DURATION } from '../../src/sim/constants';
import { TURN_RATE, ACCEL } from '../../src/sim/Player';
import { BF_OFF_HEADING_FRACTION, BF_DEPTH, facingFactor, facingCosine } from '../../src/sim/bodyFacing';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  loadL3Dose, loadPcDose,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { PTP_FLIGHT_SPEED } from '../../src/ai/passLeadSeat';
import { PC_TIER_CHOICE_TICKS } from '../../src/ai/pcLatency';
import { ballAccessGeometry, type BodySector } from '../../src/sim/physical';
import { dist } from '../../src/utils/vec';
import {
  randomGenome, rcAnticipationWeightOf, mutateGenome, crossoverGenomes,
  type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo, type Role } from '../../src/sim/types';
import { Rng, hashSeed } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the RC-T1a §1 form                         */
/* ========================================================================== */
const ENV_WHITELIST = ['RCT1B_MODE', 'RCT1B_N', 'RCT1B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('RCT1B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`RC-T1B FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.RCT1B_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('RC-T1B FATAL — RCT1B_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.RCT1B_N !== undefined ? Number(process.env.RCT1B_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('RC-T1B FATAL — RCT1B_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.RCT1B_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`RCT1B_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`RCT1B_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`RCT1B_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/rc-t1b-ready-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/rc-t1b-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('RC-T1B FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the RC-T1a §2 set)                                        */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'ERROR'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : sum(xs) / xs.length);
const round = (v: number, n: number): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** n) / 10 ** n : v);
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const addInto2 = (a: number[][], b: readonly (readonly number[])[]): void => {
  for (let i = 0; i < a.length; i++) addInto(a[i], b[i]);
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
/** unsigned bin: index 0 = [0,width), last index is OVERFLOW (and underflow) */
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
/** signed bin: index 0 = ≤ −half·width, index n−1 = ≥ +half·width; centre bin holds 0 */
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
/* §3 THE ANCHORED SITES — anchored extraction with LINE RECEIPTS
   (canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence"; home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1 (ruling #306 item 4))                                       */
/* ========================================================================== */
const PLAYER_PATH = 'src/sim/Player.ts';
const FACING_PATH = 'src/sim/bodyFacing.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const PCLAT_PATH = 'src/ai/pcLatency.ts';
const PERC_PATH = 'src/ai/perception.ts';
const SEAT_PATH = 'src/ai/passLeadSeat.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const MTL_PATH = 'scripts/probes/mt-ladder.ts';
const DFT1_PATH = 'scripts/probes/df-t1-persistence-exam.ts';
const SRC = new Map<string, string>();
const srcOf = (p: string): string => {
  const s = SRC.get(p);
  if (s !== undefined) return s;
  const v = readFileSync(p, 'utf8');
  SRC.set(p, v);
  return v;
};
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};
interface Anchor {
  what: string; file: string; needle: string; wantOccurrences: number;
  occurrences: { line: number }[]; extracted: unknown; ok: boolean;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, wantOccurrences: number,
  extracted: unknown = null,
): void => {
  const hits = occurrences(srcOf(file), needle);
  ANCHORS.push({
    what, file, needle, wantOccurrences, occurrences: hits, extracted,
    ok: hits.length === wantOccurrences,
  });
};

/* --- ⭐⭐ THE BK SECTOR CLASSIFIER — the (a) face's own classifier, CALLED never re-typed --- */
anchor('⭐⭐ the `BodySector` TYPE, read off its own union', PHYS_PATH,
  "export type BodySector = 'front' | 'side' | 'back';", 1);
anchor('⭐⭐ the BK LAW\'S OWN sector assignment (THE CLASSIFIER THIS PROBE CALLS — the (a) '
  + 'face\'s whole definition of SIDE and BACK)', PHYS_PATH,
  '  const sector: BodySector = facingCos >= Math.SQRT1_2\n'
  + "    ? 'front'\n"
  + '    : facingCos <= -Math.SQRT1_2\n'
  + "      ? 'back'\n"
  + "      : 'side';", 1);
/* --- ⭐⭐ THE READY LIMB'S OWN PUBLIC SURFACE (the coverage read's three sites) --- */
anchor('⭐⭐ THE ONE `rcReady` FORK in the brain (the READY limb\'s only branch head)',
  BRAIN_PATH, '    if (match.rcReady) {', 1);
anchor('⭐⭐ RC_S_RECEIVE — `ReceivePass`\'s OWN score literal, THE ONE HOME of 1.2',
  BRAIN_PATH, 'const RC_S_RECEIVE = 1.2;', 1, 1.2);
anchor('⭐⭐ THE OVERLAY WRITE — the two fields travel together or not at all', BRAIN_PATH,
  '  if (rcReadyCarrierGid >= 0) {\n'
  + '    p.action.readyFaceGid = rcReadyCarrierGid;\n'
  + '    p.action.readyBenefit = rcReadyBenefit;\n'
  + '  }', 1);
anchor('⭐⭐ THE FACE-WRITE SITE — the TRADE resolved every frame, the face COPIED never aliased',
  EXEC_PATH, '        p.faceTarget = { x: carrier.pos.x, y: carrier.pos.y };', 1);
anchor('⭐⭐ THE COST FORM at that site — both functions IMPORTED, no literal, STRICT `>`',
  EXEC_PATH,
  '        cost = (1 - facingFactor(cosPhi, p.facingDepth)) * p.action.scores[0].score;', 1);
anchor('⭐⭐ THE TRADE\'S OWN INEQUALITY', EXEC_PATH, '      if (readyBenefit > cost) {', 1);
anchor('⭐⭐ THE PC HOLD OVERRIDE — the gate BELOW the READY write rewrites the face last',
  EXEC_PATH,
  '      p.faceTarget = hold.face === null ? null : { x: hold.face.x, y: hold.face.y };', 1);
anchor('⭐ the `readyFaceGid` overlay field at its own home', TYPES_PATH,
  '  readyFaceGid?: number;', 1);
anchor('⭐ the `readyBenefit` overlay field at its own home', TYPES_PATH,
  '  readyBenefit?: number;', 1);
anchor('⭐ the `rcReady` config read (`?? false` — the door is shut unless asked)', MATCH_PATH,
  '    this.rcReady = cfg.rcReady ?? false;', 1);
anchor('⭐ THE HOLDS MAP the coverage read consults with a PURE `Map.get`', PCLAT_PATH,
  '  private readonly holds = new Map<number, PcHold>();', 1);
anchor('⭐⭐ THE HOLD\'S OWN LIVENESS TEST, at its home (`simTick < untilTick`) — the '
  + 'predicate the coverage read reproduces WITHOUT calling the mutating accessor', PCLAT_PATH,
  '  /** The hold is live while `simTick < untilTick`. */', 1);
/* --- ⭐⭐ THE 3a SEAM'S OWN LEDGER (the pre-cue coverage) --- */
anchor('⭐⭐ PC_TIER_CHOICE_TICKS — the certified CHOICE tier; THE KEEPER WINDOW\'S OWN LENGTH',
  PCLAT_PATH, 'export const PC_TIER_CHOICE_TICKS = Math.round(PC_TIER_CHOICE_SIM_S / DT); // 27',
  1, PC_TIER_CHOICE_TICKS);
anchor('⭐ the ledger\'s own pre-cue counter (PLUMBING, never an effect size)', PCLAT_PATH,
  '    if (preCued) this.ledger.preCuedArms++;', 1);
anchor('⭐⭐ THE ONE PRE-CUE READ\'s branch head (the 3a seam)', MATCH_PATH,
  '        if (this.rcAnticipate && w.klass === \'passRelease\' && w.rel === \'own\'', 1);
/* --- ⭐⭐ THE BF LAW: the two constants, the two pure functions, the shipped writer --- */
anchor('⭐⭐ BF_OFF_HEADING_FRACTION — the ONE ratified constant k = 0.70 (#374 item 4(ii))',
  FACING_PATH, 'export const BF_OFF_HEADING_FRACTION = 0.7;', 1, BF_OFF_HEADING_FRACTION);
anchor('⭐⭐ BF_DEPTH — DERIVED from k in one line, never typed twice (#375 item 2)',
  FACING_PATH, 'export const BF_DEPTH = 1 - BF_OFF_HEADING_FRACTION;', 1, BF_DEPTH);
anchor('⭐⭐ `facingFactor` — the law on scalars, the cosine-flat family',
  FACING_PATH, 'export function facingFactor(cosPhi: number, depth: number): number {', 1);
anchor('⭐⭐ `facingCosine` — cos φ between heading and intended direction; degenerate ⇒ 1',
  FACING_PATH,
  'export function facingCosine(headX: number, headY: number, dirX: number, dirY: number): number {',
  1);
anchor('⭐⭐ `Match.setFacingDepth()` — THE SHIPPED WRITER (`BF_DEPTH` or 0 on every body)',
  MATCH_PATH,
  '  private setFacingDepth(): void {\n'
  + '    const depth = this.bfFacingCost ? BF_DEPTH : 0;\n'
  + '    for (const t of this.teams) for (const p of t.players) p.facingDepth = depth;\n'
  + '  }', 1);
anchor('⭐ the `bfFacingCost` config read (`?? false`)', MATCH_PATH,
  '    this.bfFacingCost = cfg.bfFacingCost ?? false;', 1);
anchor('⭐⭐ THE HEADING-FOLLOW FLOOR `sp > 0.5` — the moving population cut, the ENGINE\'s own '
  + '(ANCHORED, never a taste constant; the keeper read uses the SAME floor)', PLAYER_PATH,
  '    } else if (sp > 0.5) {', 1);
anchor('⭐ TURN_RATE — the turn cap every facing decision is paid against', PLAYER_PATH,
  'export const TURN_RATE = 6.5;', 1, TURN_RATE);
anchor('⭐ ACCEL — the only rate that limits how fast the velocity may change', PLAYER_PATH,
  'export const ACCEL = 14; // m/s^2 toward desired velocity', 1, ACCEL);
anchor('⭐ THE PUBLIC DEPTH FIELD the shipped writer targets', PLAYER_PATH,
  '  facingDepth = 0;', 1);
anchor('⭐ DT — the sim step every metre and every rate on this page is measured on',
  CONST_PATH, 'export const DT = 1 / 60;', 1, DT);
anchor('AI_INTERVAL — the decision cadence (context; the exam reads every tick)', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
anchor('⭐ MATCH_DURATION — the 240 s match clock every rate on this page runs on', CONST_PATH,
  'export const MATCH_DURATION = 240;', 1, MATCH_DURATION);
/* --- ⭐⭐ RC-T1a's GAP LINES: the account, the flight law, the control cut --- */
anchor('⭐⭐ interceptBall\'s ts clamp', PERC_PATH,
  '  const ts = Math.max(p.topSpeed, 0.1);', 1);
anchor('⭐⭐ interceptBall\'s time-to-point form (2 honest occurrences — both branches)',
  PERC_PATH, 'const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;', 2);
anchor('⭐ CONTROL_RADIUS — the presence clause\'s own control cut', CONST_PATH,
  'export const CONTROL_RADIUS = ', 1, CONTROL_RADIUS);
anchor('⭐ PTP_FLIGHT_SPEED — the chooser\'s own flight law', SEAT_PATH,
  'export const PTP_FLIGHT_SPEED = ', 1, PTP_FLIGHT_SPEED);
anchor('⭐⭐ the `pass.targetGid === p.gid` STRIKE GATE (the start-delay read\'s own site)',
  BRAIN_PATH, '    if (pass && pass.side === team.side && pass.targetGid === p.gid) {', 1);
anchor('the wind-up record\'s `readyTick` composition', MATCH_PATH,
  '      readyTick: this.stepCount + wTicks + bkTicks,', 1);
anchor('the resolve\'s own guard', MATCH_PATH,
  '    if (!this.o1PassWindup || pp === null || this.stepCount < pp.readyTick) return;', 1);
/* --- WORLD 12's own composition, CALLED never copied --- */
anchor('⭐ world 12\'s flag composition', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐ world 12\'s arming line (world 11\'s arming + the two exam pins)', A4_PATH,
  '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);', 1,
  [RA_WORLD_LEAD, RA_WORLD_WEIGHT]);
/* --- THE DF 乱跑 DEFINITION LINES (DF-T1 §3 / DF-C0 §R2, REUSED VERBATIM) --- */
anchor('⭐⭐ THE 乱跑 SWITCH — DF-T1 §3\'s own line: a marker\'s assigned man CHANGES',
  DFT1_PATH,
  '        if (prev !== null && cur2 !== null && prev !== cur2) {\n'
  + '          row.markSwitches += 1;', 1);
anchor('⭐⭐ THE 乱跑 DENOMINATOR — DF-T1 §8\'s own defender-minute line', DFT1_PATH,
  'const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;', 1);
anchor('⭐⭐ THE COVERAGE FACE — DF-T1 §3\'s own held-mark tick line', DFT1_PATH,
  '        if (cur2 !== null) row.markHeldTicks += 1;', 1);
anchor('⭐ the defender population line (outfield, not sent off, side out of possession)',
  DFT1_PATH, "      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);", 1);
/* --- THE E4 WATCHABILITY DEFINITIONS: ONE anchored definition each, REUSED --- */
anchor('⭐⭐ E4 `forwardPassShare` — mt-ladder.ts\'s OWN definition, reused not re-invented',
  MTL_PATH,
  '    forwardPassShare: passes === 0 ? Number.NaN : '
  + '(st[0].passesForward + st[1].passesForward) / passes,', 1);
anchor('⭐ E4 `thirdMan` — the engine\'s own completed third-man release site', MATCH_PATH,
  '        if (pass.bounce && p.gid === pass.targetGid) team.stats.thirdMan++;', 1);
anchor('⭐ E4 `overlaps` — the engine\'s own completed overlap release site', MATCH_PATH,
  "        if (team.overlapper === p.index && Math.abs(p.pos.y) > 11) team.stats.overlaps++;", 1);
anchor('⭐⭐ E4 CHAIN LENGTH — the engine\'s OWN possession-chain ledger site', MATCH_PATH,
  '    if (n > team.stats.bestPassChain) team.stats.bestPassChain = n;', 1);
anchor('⭐ E4 CHAIN LENGTH\'s declared meaning, at its own home', TYPES_PATH,
  '  /** Longest chain of consecutive completed passes in one move (Phase 33). */', 1);
anchor('⭐ E4 `passesForward` — the engine\'s own forward-pass sites (5 honest occurrences)',
  MECH_PATH, 'team.stats.passesForward++;', 5);
anchor('⭐ THE CARRY COUNTER — the engine\'s own `dribbles` site (context: carries/match)',
  MATCH_PATH, '      if (!recollect) team.stats.dribbles++;', 1);
/* --- PT-C0's own A4 limbs --- */
anchor('⭐⭐ DUP_RUN_M — the A4 battery I6 duplicate-run bucket (NO new constant)',
  A4P1C_PATH, 'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)',
  1, 4);
anchor('⭐⭐ SAMPLE_EVERY — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);

/** ⭐ THE Role VOCABULARY — read off its own union, never re-typed */
const ROLE_NEEDLE = "export type Role = 'GK' | 'DF' | 'MF' | 'WG' | 'ST';";
const ROLES = ((srcOf(TYPES_PATH).slice(
  srcOf(TYPES_PATH).indexOf(ROLE_NEEDLE),
  srcOf(TYPES_PATH).indexOf(ROLE_NEEDLE) + ROLE_NEEDLE.length,
).match(/'([A-Z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly Role[];
anchor('⭐ the Role vocabulary, read off its own union', TYPES_PATH, ROLE_NEEDLE, 1, ROLES);
const RO_OF = (r: Role): number => ROLES.indexOf(r);
const NROLE = ROLES.length;

const DUP_RUN_M = ANCHORS.find((a) => a.needle.startsWith('const DUP_RUN_M'))!
  .extracted as number;
const SAMPLE_EVERY = ANCHORS.find((a) => a.needle.startsWith('const SAMPLE_EVERY'))!
  .extracted as number;
/** THE SECTOR VOCABULARY — read off `BodySector`'s own union, never re-typed */
const SECT_NEEDLE = "export type BodySector = 'front' | 'side' | 'back';";
const SECTORS = ((srcOf(PHYS_PATH).slice(
  srcOf(PHYS_PATH).indexOf(SECT_NEEDLE), srcOf(PHYS_PATH).indexOf(SECT_NEEDLE) + SECT_NEEDLE.length,
).match(/'([a-z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly BodySector[];

const ANCHORS_OK = ANCHORS.every((a) => a.ok)
  && BF_OFF_HEADING_FRACTION === 0.7 && BF_DEPTH === 1 - 0.7
  && TURN_RATE === 6.5 && ACCEL === 14 && DT === 1 / 60 && AI_INTERVAL === 0.15
  && MATCH_DURATION === 240 && PC_TIER_CHOICE_TICKS === 27 && PTP_FLIGHT_SPEED === 18
  && RA_WORLD_VERSION === 12 && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1
  && DUP_RUN_M === 4 && SAMPLE_EVERY === 10
  && ROLES.length === 5 && ROLES.join(',') === 'GK,DF,MF,WG,ST'
  && SECTORS.length === 3 && JSON.stringify(SECTORS) === JSON.stringify(['front', 'side', 'back']);

/* ========================================================================== */
/* §4 THE DOSES — the SHIPPED LOADERS CALLED, the BYTES HASHED AND PINNED       */
/* ========================================================================== */
/** ⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a
 *  self-declared field" (home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6).
 *  The two expected values are READ OF RECORD from PT-C0's artifact `doseSource.files`.
 *  ⛔ If either differs the instrument REFUSES TO RUN — a dose is never approximated. */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_SHA_EXPECTED = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_SHA_EXPECTED = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
const DOSE_BYTES_MATCH = L3_DOSE_BYTES_SHA === L3_DOSE_SHA_EXPECTED
  && PC_DOSE_BYTES_SHA === PC_DOSE_SHA_EXPECTED;
if (!DOSE_BYTES_MATCH) {
  banner('RC-T1B FATAL — a dose file\'s BYTES differ from the PINNED expected value:');
  banner(`  ${L3_DOSE_FILE}\n    want ${L3_DOSE_SHA_EXPECTED}\n    got  ${L3_DOSE_BYTES_SHA}`);
  banner(`  ${PC_DOSE_FILE}\n    want ${PC_DOSE_SHA_EXPECTED}\n    got  ${PC_DOSE_BYTES_SHA}`);
  banner('  ⛔ a dose is NEVER approximated (PT-C0 §CORR 2). STOPPING.');
  process.exit(3);
}
let L3_DOSE: readonly L3DoseCell[] | null = null;
let PC_DOSE: PcDoseTable | null = null;
let DOSE_LOAD_ERROR: string | null = null;
try {
  L3_DOSE = await loadL3Dose();
  PC_DOSE = await loadPcDose();
} catch (err) {
  DOSE_LOAD_ERROR = String(err);
}
const DOSED_ARM_REACHABLE = L3_DOSE !== null && PC_DOSE !== null
  && L3_DOSE.some((c) => c.lunges > 0)
  && PC_DOSE.some((row) => row.some((v) => v > 0));
if (!DOSED_ARM_REACHABLE) {
  banner(`RC-T1B FATAL — the DOSED arms are not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}
const L3_CELLS_POOLED = (L3_DOSE as readonly L3DoseCell[]).length;
const PC_ROWS_POOLED = (PC_DOSE as PcDoseTable).length;

/* ========================================================================== */
/* §5 SEEDS — block 12,539,000–999 (#380 item 6(vi)); the SIX ARMS SHARE SEEDS  */
/* ========================================================================== */
const BLOCK_BASE = 12_539_000;
const BLOCK_TOP = 12_539_999;
/** ⭐⭐ N_FROZEN — sized at §DEV-PREFLIGHT by the disclosed 12-seed scratch smoke BEFORE the
 *  freeze commit and BEFORE any battery seed. The five declared targets are (a) the smoke's
 *  own MDE · (b) the smoke's own MDE · (c1) 0.30 goals · (c2) 0.010 completion · (c3)
 *  1.0 interceptions/match; N_FROZEN is the LARGEST requirement THE BLOCK AFFORDS, and what
 *  the block cannot resolve is DECLARED in the sizing table.
 *  ⭐ THE BLOCK'S OWN PARTITION, so no seed is ever used twice: battery 12,539,000 … +N−1 ·
 *  the SEASON LADDER's two LEAGUE seeds 12,539,997–998 · the construction receipt 12,539,999. */
const N_MAX_SEEDS = 997;
const N_FROZEN = 997;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_700;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
/** the construction receipt seed: 12,539,999 — the block's top, walked in ALL SIX arms */
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [900_002_790, 900_002_791];
/** ⭐ the SEASON LADDER's own league seeds — inside THIS stage's own authorized block and
 *  DISJOINT from every battery seed; every ladder MATCH seed is DERIVED from them through the
 *  SHIPPED `hashSeed`, the `League.createMatch` idiom. */
const LADDER_SEEDS = IS_SCRATCH_RUN ? [SCRATCH_BASE + 30] : [12_539_997, 12_539_998];

/* ========================================================================== */
/* §6 THE SIX ARMS — the world's own composer CALLED; the match-local gene idiom */
/* ========================================================================== */
const ARMS = ['E0', 'E1', 'E2', 'E3', 'D0', 'D3'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E0: 'world 12 EMPTY-BOOK: `bfFacingCost` ABSENT · `rcAnticipate` ABSENT · `rcReady` ABSENT · '
    + 'the gene ABSENT — exactly the world the user\'s entry IS',
  E1: 'E0 + `bfFacingCost: true` in the CONSTRUCTOR ⇒ the SHIPPED writer '
    + '`Match.setFacingDepth()` puts BF_DEPTH on every body — THE PRICED BODY ALONE (the '
    + 'SCORED pair\'s baseline)',
  E2: 'E1 + `rcAnticipate: true` + `rcAnticipationWeight` = 1 MATCH-LOCAL on BOTH teams — 3a '
    + 'on the priced body',
  E3: 'E2 + `rcReady: true` — 3a AND 3b on the priced body: THE CANDIDATE DOOR (world 13\'s '
    + 'shape). THE SCORED ARM.',
  D0: 'E0 DOSED (PT-C0 arm A\'s composition: `armA4World(m, null, 12, L3_DOSE, PC_DOSE)`) — '
    + 'the matured-book world with nothing armed',
  D3: 'E3 DOSED — THE CANDIDATE DOOR in the form the user actually plays',
};
const PAIRS = [
  { key: 'E3E1', lo: 'E1' as Arm, hi: 'E3' as Arm, scored: true,
    form: '⭐⭐ THE SCORED PAIR — the RC door (3a + 3b) on the priced body' },
  { key: 'E2E1', lo: 'E1' as Arm, hi: 'E2' as Arm, scored: false,
    form: '3a ALONE on the priced body (REPORTED, rule words STORED)' },
  { key: 'E3E2', lo: 'E2' as Arm, hi: 'E3' as Arm, scored: false,
    form: '3b\'s MARGINAL on top of 3a (REPORTED, rule words STORED)' },
  { key: 'E1E0', lo: 'E0' as Arm, hi: 'E1' as Arm, scored: false,
    form: 'THE PRICE ALONE on a SECOND BLOCK — the goals story\'s probe (REPORTED, rule '
      + 'words STORED)' },
  { key: 'E3E0', lo: 'E0' as Arm, hi: 'E3' as Arm, scored: false,
    form: 'world 13\'s shape vs world 12 as it is (REPORTED, rule words STORED)' },
  { key: 'D3D0', lo: 'D0' as Arm, hi: 'D3' as Arm, scored: false,
    form: '⭐⭐ THE ENTRY READ — the candidate door in the form the user plays (REPORTED, '
      + 'rule words STORED)' },
] as const;
type PairKey = (typeof PAIRS)[number]['key'];
const wantsBf = (a: Arm): boolean => a === 'E1' || a === 'E2' || a === 'E3' || a === 'D3';
const wantsAnticipate = (a: Arm): boolean => a === 'E2' || a === 'E3' || a === 'D3';
const wantsReady = (a: Arm): boolean => a === 'E3' || a === 'D3';
const wantsGene = (a: Arm): boolean => wantsAnticipate(a);
const isDosed = (a: Arm): boolean => a === 'D0' || a === 'D3';
const DEPTH_OF: Record<Arm, number> = {
  E0: 0, E1: BF_DEPTH, E2: BF_DEPTH, E3: BF_DEPTH, D0: 0, D3: BF_DEPTH,
};
/** the exam-pinned MAXIMUM (the DX-T1 / RA-T1B / RC-T1a idiom): measure the mechanism at full
 *  expression; the SEASON LADDER is where selection speaks. */
const RC_GENE_VALUE = 1;

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/**
 * ⭐⭐ THE MATCH-LOCAL GENE IDIOM, RC-T1a's own (copied there from `setRaGenes`) — the
 * ratified dosing form (canon: dose placement, ruling #270.2 / #334 item 1): `baseGenome` and
 * `effGenome` are replaced by SPREAD COPIES and **`info.genome` is NEVER touched**. The spread
 * CARRIES world 12's own two pins (`passLeadSupport` = 1, `raAccessWeight` = 1) forward,
 * because it spreads the view `setRaGenes` already wrote inside `armA4World`. Called AFTER
 * `armA4World`.
 */
const setRcGeneLocal = (match: Match, side: Side): void => {
  const team = match.teams[side];
  const view = { ...team.baseGenome, rcAnticipationWeight: RC_GENE_VALUE } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
};
/**
 * ⭐⭐ RC-T1a's own population construction (the same genome/squad/side/seed plumbing and the
 * same 240 s match), so arm k walks seed s with the IDENTICAL population and the six arms
 * differ ONLY in the three flags, the gene and the dose — which is what makes every Δ PAIRED.
 */
const buildMatch = (seed: number, arm: Arm): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  const m = new Match({
    ...base,
    ...a4MatchFlags(RA_WORLD_VERSION),
    ...(wantsBf(arm) ? { bfFacingCost: true } : {}),
    ...(wantsAnticipate(arm) ? { rcAnticipate: true } : {}),
    ...(wantsReady(arm) ? { rcReady: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (isDosed(arm)) armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, RA_WORLD_VERSION);
  if (wantsGene(arm)) for (const side of [0, 1] as const) setRcGeneLocal(m, side);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   (canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"; home:
   DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2)                                      */
/* ========================================================================== */
const RAD2DEG = 180 / Math.PI;
/** ⭐⭐ φ — BF-C0 §P.A's face, REUSED: the angle between `heading` and `vel`, in DEGREES,
 *  both read at the SAME tick AFTER `m.step(DT)`. Sign-blind; a degenerate pair is NaN. */
const phiDegOf = (hx: number, hy: number, vx: number, vy: number): number => {
  const hl = Math.sqrt(hx * hx + hy * hy);
  const vl = Math.sqrt(vx * vx + vy * vy);
  if (hl < 1e-12 || vl < 1e-12) return Number.NaN;
  const c = (hx * vx + hy * vy) / (hl * vl);
  return Math.acos(c > 1 ? 1 : c < -1 ? -1 : c) * RAD2DEG;
};
/** ⭐⭐ THE MOVING FLOOR — the SHIPPED `sp > 0.5` of `physicsStep`, ANCHORED above. */
const MOVING_FLOOR = 0.5;
const PHI_BIN_DEG = 15;
const NPHI = 12;
const BIN45 = 3;
const BIN90 = 6;
/** ⭐⭐ THE KEEPER READ's own misalignment cut — the SAME 45° BF-C0 uses, on the SAME floor. */
const KEEPER_MIS_DEG = 45;
/**
 * ⭐⭐ THE LIVE COVERAGE OF THE BF PRICE (BF-T1 §P.B) — A READ, DECLARED, reused byte for byte:
 * the intent is CLAMPED to `topSpeed` exactly as `physicsStep` clamps it, and the SHIPPED
 * `facingFactor` / `facingCosine` are taken on the clamped target's direction against `heading`.
 * ⚠ THE ONE-STEP PHASE SUBTLETY, STATED: `desiredVel` read after `m.step(DT)` is the executor's
 * intent for the step JUST TAKEN and `heading` is the heading AFTER that step's rotation.
 */
const coverageFactorOf = (
  headX: number, headY: number, dvx: number, dvy: number, topSpeed: number, depth: number,
): number => {
  const dl = Math.sqrt(dvx * dvx + dvy * dvy);
  let tx = dvx;
  let ty = dvy;
  if (dl > topSpeed && dl > 1e-8) { const s = topSpeed / dl; tx = dvx * s; ty = dvy * s; }
  const tl = Math.sqrt(tx * tx + ty * ty);
  if (!(tl > 1e-8)) return 1;
  return facingFactor(facingCosine(headX, headY, tx / tl, ty / tl), depth);
};
const COVERAGE_EPS = 1e-6;
/**
 * ⭐⭐ THE READY TRADE'S RECOMPUTED COST — A READ, DECLARED, WITH ITS PHASE.
 * The executor's own form is `(1 − facingFactor(facingCosine(dir̂, bearinĝ), p.facingDepth))
 * · p.action.scores[0].score` with `dir` = that frame's `target − p.pos` AFTER both clamps.
 * ⚠ `target` is a LOCAL of `executeAction` and is NOT public. This read substitutes the body's
 * PUBLIC `desiredVel` direction (the executor's intent for the step just taken) for `dir̂`, and
 * the carrier's PRE-STEP `pos` for the bearing origin — a PROXY for the executor's own `dir`,
 * stated here and in the doc, never claimed to be the seam's own float. The depth, the score
 * and the shipped functions are the seam's own.
 * ⛔ A COVERAGE receipt, never an effect size.
 */
const readyCostOf = (
  headDvx: number, headDvy: number, bearX: number, bearY: number,
  depth: number, sMove: number,
): number => {
  const dl = Math.sqrt(headDvx * headDvx + headDvy * headDvy);
  const bl = Math.sqrt(bearX * bearX + bearY * bearY);
  if (!(dl > 1e-6) || !(bl > 1e-6)) return 0;
  const cosPhi = facingCosine(headDvx / dl, headDvy / dl, bearX / bl, bearY / bl);
  return (1 - facingFactor(cosPhi, depth)) * sMove;
};
/** ⭐⭐ THE ACCESS-TIME ACCOUNT — DX-C2 §P.A via RC-C0 §P.B, RC-T1a's own, byte for byte. */
const marginOf = (dBallPath: number, dMate: number, topSpeed: number): number =>
  dBallPath / PTP_FLIGHT_SPEED - (dMate / Math.max(topSpeed, 0.1) + 0.15);
const meetableOf = (dMate: number, margin: number): boolean =>
  dMate <= CONTROL_RADIUS || margin >= 0;
/** ⭐⭐ RC-C0 §P.D's `predictedArrDist`, REUSED — where the account says he stands at arrival. */
const predictedArrDistOf = (dBallPath: number, dMate: number, topSpeed: number): number => {
  const tBall = dBallPath / PTP_FLIGHT_SPEED;
  const chase = Math.max(0, tBall - 0.15) * Math.max(topSpeed, 0.1);
  return Math.max(0, dMate - chase);
};
/** ⭐ PT-C0 (i)'s A4 limbs, reused with their own anchored constants. */
const nearestMateOf = (xs: readonly number[], ys: readonly number[], a: number): number => {
  let nearest = Number.POSITIVE_INFINITY;
  for (let b = 0; b < xs.length; b++) {
    if (a === b) continue;
    const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
    if (dd < nearest) nearest = dd;
  }
  return nearest;
};
const dupRunPairsOf = (xs: readonly number[], ys: readonly number[]): number => {
  let n = 0;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      if (Math.hypot(xs[a] - xs[b], ys[a] - ys[b]) < DUP_RUN_M) n += 1;
    }
  }
  return n;
};
const minPairwiseOf = (xs: readonly number[], ys: readonly number[]): number => {
  let m = Number.POSITIVE_INFINITY;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
      if (dd < m) m = dd;
    }
  }
  return m;
};
/** ⭐⭐ PT-C0 (iii)'s delivery classifier and ground/measured tests, reused byte for byte. */
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
/** ⭐⭐ PT-C0 (iii)'s FIRST-CONTACT CLASSES, reused byte for byte in substance. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
/** ⭐⭐ THE (a) FACE'S OWN PREDICATE — the ball met the OWN TARGET on a SIDE or BACK sector. */
const isSideOrBack = (s: BodySector): boolean => s === 'side' || s === 'back';
/** ⭐ DX-C2's own FOUR-WAY outcome ladder, reused — first terminal wins, TEMPORAL not causal. */
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');
const FLIGHT_RETIRE_TICKS = 720;

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* ⭐⭐ THE LAW'S OWN SECTOR CLASSIFIER, CALLED on constructed geometries (the (a) face) */
const sectorFx = (
  bx: number, by: number, hx: number, hy: number, ballX: number, ballY: number,
): BodySector => ballAccessGeometry(
  { pos: { x: bx, y: by }, bodyDir: { x: hx, y: hy }, coreRadius: 0.3 },
  { pos: { x: ballX, y: ballY }, radius: 0.11 },
  CONTROL_RADIUS,
).sector;
fx('sector.frontWhenBallAhead', sectorFx(0, 0, 1, 0, 1, 0), 'front');
fx('sector.backWhenBallBehind', sectorFx(0, 0, 1, 0, -1, 0), 'back');
fx('sector.sideWhenBallAbeam', sectorFx(0, 0, 1, 0, 0, 1), 'side');
fx('sector.frontAt44Degrees', sectorFx(0, 0, 1, 0, Math.cos(0.76), Math.sin(0.76)), 'front');
fx('sector.sideAt46Degrees', sectorFx(0, 0, 1, 0, Math.cos(0.81), Math.sin(0.81)), 'side');
fx('sector.backAt136Degrees', sectorFx(0, 0, 1, 0, Math.cos(2.38), Math.sin(2.38)), 'back');
fx('sector.vocabularyIsTheUnions', SECTORS, ['front', 'side', 'back']);
fx('sideOrBack.frontIsNot', isSideOrBack('front'), false);
fx('sideOrBack.sideIs', isSideOrBack('side'), true);
fx('sideOrBack.backIs', isSideOrBack('back'), true);
/* ⭐⭐ THE FIRST-CONTACT CLASSES and the delivery / ground / measurable predicates */
const D0F: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
fx('klassOf.shortPass', klassOf({ ...D0F, passes: 1 }, false), 'shortPass');
fx('klassOf.shotBeatsPass', klassOf({ ...D0F, shots: 1, passes: 1 }, false), 'shot');
fx('klassOf.longBallIsLofted', klassOf({ ...D0F, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klassOf.null', klassOf(D0F, false), null);
fx('isDelivery.shortPass', isDelivery('shortPass'), true);
fx('isDelivery.shotIsNot', isDelivery('shot'), false);
fx('isGroundLaunch.grounded', isGroundLaunch(true, 9), true);
fx('isGroundLaunch.risingIsNot', isGroundLaunch(false, 0.1), false);
fx('isGroundLaunch.fallingIs', isGroundLaunch(false, -0.1), true);
fx('measurable.shortPassWithTarget', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.loftedIsNot', isMeasurableGroundPass('loftedPass', true, true), false);
fx('measurable.noTargetIsNot', isMeasurableGroundPass('shortPass', true, false), false);
fx('measurable.airborneIsNot', isMeasurableGroundPass('cutback', false, true), false);
fx('contact.none', contactClassOf(null, 4, null, 0), 'none');
fx('contact.ownTarget', contactClassOf(4, 4, 0, 0), 'ownTarget');
fx('contact.ownNonTarget', contactClassOf(5, 4, 0, 0), 'ownNonTarget');
fx('contact.opponent', contactClassOf(9, 4, 1, 0), 'opponent');
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.intercepted', outcomeOf(false, true, true), 'intercepted');
fx('outcomeOf.out', outcomeOf(false, false, true), 'out');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');
/* ⭐⭐ THE φ ARITHMETIC and the keeper window's own cut */
fx('phi.aheadIsZero', near(phiDegOf(1, 0, 3, 0), 0), true);
fx('phi.abeamIsNinety', near(phiDegOf(1, 0, 0, 2), 90), true);
fx('phi.behindIsOneEighty', near(phiDegOf(1, 0, -4, 0), 180), true);
fx('phi.signBlind', near(phiDegOf(1, 0, 1, 1), phiDegOf(1, 0, 1, -1)), true);
fx('phi.degenerateHeadingIsNaN', Number.isNaN(phiDegOf(0, 0, 1, 0)), true);
fx('phi.degenerateVelIsNaN', Number.isNaN(phiDegOf(1, 0, 0, 0)), true);
fx('phi.binOf44IsBelow45', binOf(44.9, PHI_BIN_DEG, NPHI) < BIN45, true);
fx('phi.binOf45IsTheCut', binOf(45, PHI_BIN_DEG, NPHI), BIN45);
fx('phi.binOf90IsTheCut', binOf(90, PHI_BIN_DEG, NPHI), BIN90);
fx('phi.binOf180IsTheLast', binOf(180, PHI_BIN_DEG, NPHI), NPHI - 1);
fx('keeperWindow.misCutIsStrictlyAbove45', phiDegOf(1, 0, 0, 2) > KEEPER_MIS_DEG, true);
fx('keeperWindow.fortyFiveIsNotMisaligned',
  phiDegOf(1, 0, Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)) > KEEPER_MIS_DEG, false);
fx('keeperWindow.lengthIsTheChoiceTier', PC_TIER_CHOICE_TICKS, 27);
/* ⭐⭐ THE BF COVERAGE RECOMPUTATION, on CONSTRUCTED states — the seam's own arithmetic */
fx('coverage.shutBodyIsAlwaysOne', coverageFactorOf(1, 0, 0, 5, 8, 0), 1);
fx('coverage.aheadIsExactlyOne', coverageFactorOf(1, 0, 5, 0, 8, BF_DEPTH), 1);
fx('coverage.abeamIsTheFloor', near(coverageFactorOf(1, 0, 0, 5, 8, BF_DEPTH),
  BF_OFF_HEADING_FRACTION), true);
fx('coverage.behindIsTheFloor', near(coverageFactorOf(1, 0, -5, 0, 8, BF_DEPTH),
  BF_OFF_HEADING_FRACTION), true);
fx('coverage.degenerateIntentIsOne', coverageFactorOf(1, 0, 0, 0, 8, BF_DEPTH), 1);
/* ⭐⭐ THE READY COST RECOMPUTATION, on CONSTRUCTED states */
fx('readyCost.shutBodyPaysNothing', readyCostOf(1, 0, 0, 1, 0, 0.9), 0);
fx('readyCost.facingTheCarrierPaysNothing', near(readyCostOf(1, 0, 3, 0, BF_DEPTH, 0.9), 0), true);
fx('readyCost.abeamPaysTheFullDepth',
  near(readyCostOf(1, 0, 0, 1, BF_DEPTH, 0.9), BF_DEPTH * 0.9), true);
fx('readyCost.behindPaysTheFullDepthToo',
  near(readyCostOf(1, 0, -1, 0, BF_DEPTH, 0.9), BF_DEPTH * 0.9), true);
fx('readyCost.degenerateIntentIsZero', readyCostOf(0, 0, 0, 1, BF_DEPTH, 0.9), 0);
fx('readyCost.degenerateBearingIsZero', readyCostOf(1, 0, 0, 0, BF_DEPTH, 0.9), 0);
fx('readyCost.scalesWithSMove',
  near(readyCostOf(1, 0, 0, 1, BF_DEPTH, 1.8), 2 * readyCostOf(1, 0, 0, 1, BF_DEPTH, 0.9)), true);
/* ⭐⭐ THE READY "APPLIED" PREDICATE on a CONSTRUCTED state (the fix's G-BITE predicate) */
{
  const applied = (
    overlayGid: number | undefined, holdUntil: number | null, simTick: number,
    face: { x: number; y: number } | null, carrierPre: { x: number; y: number },
  ): boolean => overlayGid !== undefined
    && !(holdUntil !== null && simTick < holdUntil)
    && face !== null && face.x === carrierPre.x && face.y === carrierPre.y;
  fx('readyApplied.overlayAbsentIsNotApplied',
    applied(undefined, null, 5, { x: 1, y: 2 }, { x: 1, y: 2 }), false);
  fx('readyApplied.liveHoldIsNotApplied',
    applied(3, 9, 5, { x: 1, y: 2 }, { x: 1, y: 2 }), false);
  fx('readyApplied.expiredHoldIsApplied',
    applied(3, 5, 5, { x: 1, y: 2 }, { x: 1, y: 2 }), true);
  fx('readyApplied.nullFaceIsNotApplied', applied(3, null, 5, null, { x: 1, y: 2 }), false);
  fx('readyApplied.otherFaceIsNotApplied',
    applied(3, null, 5, { x: 1.0001, y: 2 }, { x: 1, y: 2 }), false);
  fx('readyApplied.exactPreStepPosIsApplied',
    applied(3, null, 5, { x: 1, y: 2 }, { x: 1, y: 2 }), true);
}
/* ⭐⭐ THE PAIRED Δ ARITHMETIC, on a constructed two-seed table (ratio-of-sums) */
{
  const nuS = [3, 5]; const deS = [2, 3]; const nuA = [4, 5]; const deA = [2, 2];
  const pS = ratio(sum(nuS), sum(deS));
  const pA = ratio(sum(nuA), sum(deA));
  fx('pairedDelta.ratioOfSumsLo', near(pS, 8 / 5), true);
  fx('pairedDelta.ratioOfSumsHi', near(pA, 9 / 4), true);
  fx('pairedDelta.isHiMinusLo', near(pA - pS, 9 / 4 - 8 / 5), true);
  fx('pairedDelta.emptyDenominatorIsNaN', Number.isNaN(ratio(1, 0)), true);
}
/* ⭐⭐ THE PER-SHOT WINDOW ARITHMETIC, on a constructed 27-tick buffer */
{
  /** the window read: over the LAST `PC_TIER_CHOICE_TICKS` entries strictly BEFORE the shot
   *  tick, the share of the keeper's MOVING ticks that were MISALIGNED. */
  const windowShare = (movingFlags: readonly boolean[], misFlags: readonly boolean[]): number => {
    const from = Math.max(0, movingFlags.length - PC_TIER_CHOICE_TICKS);
    let mv = 0; let mis = 0;
    for (let i = from; i < movingFlags.length; i++) {
      if (!movingFlags[i]) continue;
      mv += 1;
      if (misFlags[i]) mis += 1;
    }
    return ratio(mis, mv);
  };
  const mvAll = new Array<boolean>(40).fill(true);
  const misNone = new Array<boolean>(40).fill(false);
  const misAll = new Array<boolean>(40).fill(true);
  fx('shotWindow.allAlignedIsZero', windowShare(mvAll, misNone), 0);
  fx('shotWindow.allMisalignedIsOne', windowShare(mvAll, misAll), 1);
  fx('shotWindow.noMovingTicksIsNaN',
    Number.isNaN(windowShare(new Array<boolean>(40).fill(false), misNone)), true);
  /* only the last 27 entries count: the 13 older MISALIGNED ticks are outside the window */
  const misOld = Array.from({ length: 40 }, (_, i) => i < 13);
  fx('shotWindow.onlyTheLast27Count', windowShare(mvAll, misOld), 0);
  const misHalf = Array.from({ length: 40 }, (_, i) => i >= 40 - 9);
  fx('shotWindow.nineOfTwentySeven', near(windowShare(mvAll, misHalf), 9 / 27), true);
  fx('shotWindow.shortBufferUsesWhatExists',
    windowShare(new Array<boolean>(5).fill(true), new Array<boolean>(5).fill(true)), 1);
}
/* THE A4 LIMBS (PT-C0's own, reused) */
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.nearestSingleton', !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.noneAtSixMetres', dupRunPairsOf([0, 6, 12], [0, 0, 0]), 0);
fx('dupRun.onePairInsideFour', dupRunPairsOf([0, 3, 12], [0, 0, 0]), 1);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('minPairwise.singleton', !Number.isFinite(minPairwiseOf([1], [1])), true);
/* THE GAP ACCOUNT (RC-T1a's own fixtures, re-walked) */
fx('marginOf.toFeet10m', marginOf(10, 0, 8), 10 / 18 - 0.15);
fx('marginOf.lead7mSlow', marginOf(15, 7, 7) < 0, true);
fx('marginOf.shortReachable', marginOf(9, 2, 8) > 0, true);
fx('meetable.presence', meetableOf(CONTROL_RADIUS * 0.5, -9), true);
fx('meetable.positiveMargin', meetableOf(5, 0.01), true);
fx('meetable.zeroMargin', meetableOf(5, 0), true);
fx('meetable.unmeetable', meetableOf(5, -0.01), false);
fx('predictedArrDist.standStill', predictedArrDistOf(2, 0, 8), 0);
fx('predictedArrDist.chaseCloses',
  predictedArrDistOf(18, 4, 8), Math.max(0, 4 - (1 - 0.15) * 8));
fx('predictedArrDist.floorAtZero', predictedArrDistOf(36, 1, 8), 0);
/* THE BIN HELPERS */
fx('binOf.first', binOf(0.4, 0.5, 61), 0);
fx('binOf.overflow', binOf(999, 0.5, 61), 60);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 21), 10);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 21), 0);
fx('signedBinOf.overflow', signedBinOf(999, 1, 21), 20);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 THE FROZEN BINS AND GRIDS (frozen at the FREEZE COMMIT, before any seed)  */
/* ========================================================================== */
const NEAR_BIN_M = 0.5;
const NEAR_BINS = 61;
const MINPAIR_BIN_M = 0.5;
const MINPAIR_BINS = 61;
const SD_BIN_TICKS = 1;
const SD_BINS = 41;                 // start delay 0–39 ticks, last is overflow (RC-C0's own)
const CAL_BIN_M = 0.5;
const CAL_BINS = 13;                // (measured − predicted) signed — DX-C2 / RC-C0's own grid
const BENEFIT_BIN = 0.01;
const BENEFIT_BINS = 41;            // `readyBenefit` 0–0.40, last is overflow
const COST_BIN = 0.05;
const COST_BINS = 41;               // the RECOMPUTED cost 0–2.00, last is overflow
const KSHARE_BIN = 0.1;
const KSHARE_BINS = 11;             // the per-shot keeper misaligned share, 0–1 (bin 10 = 1.0)
/** the WINDOW groups: the whole released population, the carried class, the MEETABLE carried */
const WGROUPS = ['all', 'carried', 'meetableCarried'] as const;
const NWG = WGROUPS.length;
/** the GAP groups — RC-C0 §P.D's face re-measured, meetableCarried PRIMARY */
const GGROUPS = ['carried', 'meetableCarried'] as const;
const NGG = GGROUPS.length;
const GG = (g: (typeof GGROUPS)[number]): number => GGROUPS.indexOf(g);

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots', 'saves',
  'tackles', 'dribbles', 'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls',
  'headersWon', 'passesForward', 'thirdMan', 'overlaps', 'bestPassChain'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  /* the world / flag / gene / depth receipts */
  worldOk: boolean; armedVersion: number;
  bfFlag: boolean; rcAnticipateFlag: boolean; rcReadyFlag: boolean;
  geneOk: boolean; genomeClean: boolean;
  depthAtKickoffOk: boolean; depthAlwaysOk: boolean;
  substitutions: number; subsSeenWithRightDepth: number;
  ticks: number; matches: number; wallMs: number;
  /* the movement population and φ (BF-C0's faces, reused) */
  openPlayTicks: number; bodyTicks: number; movingTicks: number; movingSpeedSum: number;
  phiBins: number[]; rolePhiBins: number[][]; roleMovingTicks: number[];
  /* the BF price's live coverage (a READ, declared) */
  covN: number; covApplied: number; covFSum: number;
  /* ⭐⭐ THE READY COVERAGE (the new read) */
  readyPopTicks: number; readyOverlayTicks: number; readyHeldTicks: number;
  readyAppliedTicks: number; readyTurnedTowardTicks: number;
  readyBenefitSum: number; readyBenefitBins: number[];
  readyCostSum: number; readyCostN: number; readyCostBins: number[];
  /* ⭐ THE 3a COVERAGE — the seat's own ledger */
  preCuedArms: number;
  /* ⭐ THE KEEPER's own row */
  gkPosSpeedSum: number; gkPosMisSpeedSum: number; gkDistance: number;
  /* ⭐⭐ THE PER-SHOT KEEPER READ */
  shotEvents: number; shotsMis: number; shotsAligned: number; shotsNoMovingTicks: number;
  goalsFromMis: number; goalsFromAligned: number;
  shotShareSum: number; shotShareN: number; shotShareBins: number[];
  /* ⭐ THE DF FACES — DF-T1 §3's instrument, REUSED VERBATIM */
  defTeamTicks: number; defenderTicks: number; markSwitches: number; markHeldTicks: number;
  /* ⭐⭐ THE USER'S FACES — PT-C0's own contact / sector / crowd code */
  gpMeasured: number; gpFlights: number;
  contactClass: number[];
  firstContactSector: number[]; firstContactSectorN: number; ownTargetSideBack: number;
  complBySector: number[]; complBySectorN: number[];   // [sector] completed / population
  recvSector: number[]; recvSectorN: number;
  crowdSamples: number; spacingSum: number; spacingSamples: number;
  dupRunSum: number; crashHits: number; minPairN: number;
  nearBins: number[]; minPairBins: number[];
  /* ⭐ THE ARRIVAL GAP + THE START-DELAY RECEIPT (RC-T1a's, byte for byte) */
  windupsArmed: number; windupsReleased: number;
  wSum: number[]; wN: number[];
  sdSum: number[]; sdN: number[]; sdBins: number[][]; sdCensored: number[];
  gapPredSum: number[]; gapMeasSum: number[]; gapN: number[]; gapDiffBins: number[][];
  agN: number[]; reachedN: number[]; outc: number[][];
  /* context (the 240 s match clock) */
  stats: Record<StatKey, number>;
}
const emptyStats = (): Record<StatKey, number> => Object.fromEntries(
  STAT_KEYS.map((k) => [k, 0]),
) as Record<StatKey, number>;
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1,
  bfFlag: false, rcAnticipateFlag: false, rcReadyFlag: false,
  geneOk: false, genomeClean: false,
  depthAtKickoffOk: false, depthAlwaysOk: true,
  substitutions: 0, subsSeenWithRightDepth: 0,
  ticks: 0, matches: 1, wallMs: 0,
  openPlayTicks: 0, bodyTicks: 0, movingTicks: 0, movingSpeedSum: 0,
  phiBins: zeros(NPHI), rolePhiBins: zeros2(NROLE, NPHI), roleMovingTicks: zeros(NROLE),
  covN: 0, covApplied: 0, covFSum: 0,
  readyPopTicks: 0, readyOverlayTicks: 0, readyHeldTicks: 0,
  readyAppliedTicks: 0, readyTurnedTowardTicks: 0,
  readyBenefitSum: 0, readyBenefitBins: zeros(BENEFIT_BINS),
  readyCostSum: 0, readyCostN: 0, readyCostBins: zeros(COST_BINS),
  preCuedArms: 0,
  gkPosSpeedSum: 0, gkPosMisSpeedSum: 0, gkDistance: 0,
  shotEvents: 0, shotsMis: 0, shotsAligned: 0, shotsNoMovingTicks: 0,
  goalsFromMis: 0, goalsFromAligned: 0,
  shotShareSum: 0, shotShareN: 0, shotShareBins: zeros(KSHARE_BINS),
  defTeamTicks: 0, defenderTicks: 0, markSwitches: 0, markHeldTicks: 0,
  gpMeasured: 0, gpFlights: 0,
  contactClass: zeros(CONTACTS.length),
  firstContactSector: zeros(SECTORS.length), firstContactSectorN: 0, ownTargetSideBack: 0,
  complBySector: zeros(SECTORS.length), complBySectorN: zeros(SECTORS.length),
  recvSector: zeros(SECTORS.length), recvSectorN: 0,
  crowdSamples: 0, spacingSum: 0, spacingSamples: 0,
  dupRunSum: 0, crashHits: 0, minPairN: 0,
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  windupsArmed: 0, windupsReleased: 0,
  wSum: zeros(NWG), wN: zeros(NWG),
  sdSum: zeros(NWG), sdN: zeros(NWG), sdBins: zeros2(NWG, SD_BINS), sdCensored: zeros(NWG),
  gapPredSum: zeros(NGG), gapMeasSum: zeros(NGG), gapN: zeros(NGG),
  gapDiffBins: zeros2(NGG, CAL_BINS),
  agN: zeros(NGG), reachedN: zeros(NGG), outc: zeros2(NGG, OUTCOMES.length),
  stats: emptyStats(),
});

/* ========================================================================== */
/* §10 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER     */
/*     ⛔ NOT ONE WRITE OF ANY KIND (no dose write; every arm is composed once)  */
/* ========================================================================== */
interface Windup {
  key: string; t0: number; gid: number; targetGid: number; readyTick: number;
  eX: number; eY: number; hasLead: boolean; meetable: boolean; predictedArrDist: number;
}
interface WuFlight {
  gid: number; targetGid: number; releaseTick: number;
  eX: number; eY: number; hasLead: boolean; meetable: boolean; predictedArrDist: number;
  launchX: number; launchY: number; L: number; ux: number; uy: number;
  wTicks: number;
  reachedPoint: boolean; arrDist: number;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  startDelayTicks: number | null;
}
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  contactGid: number | null; contactClass: ContactClass;
  firstContactSector: BodySector | null;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  recvSector: BodySector | null;
}
/** ⭐⭐ THE PER-SHOT RECORD — the goal attribution rule, FROZEN: a `goals` increment for side s
 *  is attributed to the MOST RECENT still-open shot record of side s; a shot record is CLOSED
 *  (as no-goal) when the SAME side records a later shot, or at full time. Goal increments are
 *  processed BEFORE new shots on the same tick. ⛔ No time-window constant is invented. */
interface ShotRec { side: Side; misShare: number; hasMovingTicks: boolean }

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const wantDepth = DEPTH_OF[arm];
  const wantGene = wantsGene(arm);
  row.armedVersion = raArmedVersion(m);
  const mFlags = m as unknown as {
    bfFacingCost: boolean; rcAnticipate: boolean; rcReady: boolean;
  };
  row.bfFlag = mFlags.bfFacingCost === true;
  row.rcAnticipateFlag = mFlags.rcAnticipate === true;
  row.rcReadyFlag = mFlags.rcReady === true;
  row.geneOk = ([0, 1] as const).every((s) => {
    const eff = m.teams[s].effGenome as TacticalGenome;
    const bas = m.teams[s].baseGenome as TacticalGenome;
    const raPins = eff.passLeadSupport === RA_WORLD_LEAD && eff.raAccessWeight === RA_WORLD_WEIGHT
      && bas.passLeadSupport === RA_WORLD_LEAD && bas.raAccessWeight === RA_WORLD_WEIGHT;
    const rcOk = wantGene
      ? (eff.rcAnticipationWeight === RC_GENE_VALUE && bas.rcAnticipationWeight === RC_GENE_VALUE
        && rcAnticipationWeightOf(eff) === RC_GENE_VALUE)
      : (eff.rcAnticipationWeight === undefined && bas.rcAnticipationWeight === undefined
        && rcAnticipationWeightOf(eff) === null);
    return raPins && rcOk;
  });
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      rcAnticipationWeight?: number; facingDepth?: number; bfFacingCost?: number;
      rcReady?: number; raAccessWeight?: number; passLeadSupport?: number;
      dvExposureWeight?: number;
    };
    return g.rcAnticipationWeight === undefined && g.facingDepth === undefined
      && g.bfFacingCost === undefined && g.rcReady === undefined
      && g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined;
  });
  const players = m.allPlayers;
  const depthOkNow = (): boolean => players.every((p) => p.facingDepth === wantDepth);
  row.depthAtKickoffOk = depthOkNow();
  row.worldOk = row.armedVersion === RA_WORLD_VERSION
    && row.bfFlag === wantsBf(arm) && row.rcAnticipateFlag === wantsAnticipate(arm)
    && row.rcReadyFlag === wantsReady(arm) && row.geneOk && row.depthAtKickoffOk;
  const names = players.map((p) => p.name);

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: { x: number; y: number }; targetGid: number;
      aimLead: { x: number; y: number } | null;
    } | null;
    /** ⭐ THE PRIVATE HOLDS MAP, read BYTE-INERTLY: a pure `Map.get`. ⛔ the MUTATING
     *  `holdFor` accessor (which DELETES expired holds) is NEVER called. */
    pcLatency: {
      holds: Map<number, { untilTick: number; ticks: number; armedTick: number;
        klass: string; preCued: boolean; belief: number }>;
      ledger: { preCuedArms: number };
    } | null;
  };
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let wu: Windup | null = null;
  let flight: WuFlight | null = null;
  let gp: GpFlight | null = null;
  const prevMark = new Map<string, number | null>();
  const markKey = (side: number, index: number): string => `${side}:${index}`;
  /* the per-shot keeper window's own ring buffers (one per side's KEEPER) */
  const kMoving: boolean[][] = [[], []];
  const kMis: boolean[][] = [[], []];
  const openShot: (ShotRec | null)[] = [null, null];

  const bookShot = (r: ShotRec, goal: boolean): void => {
    row.shotEvents += 1;
    if (!r.hasMovingTicks) { row.shotsNoMovingTicks += 1; return; }
    row.shotShareSum += r.misShare;
    row.shotShareN += 1;
    row.shotShareBins[binOf(r.misShare, KSHARE_BIN, KSHARE_BINS)] += 1;
    if (r.misShare > 0) { row.shotsMis += 1; if (goal) row.goalsFromMis += 1; }
    else { row.shotsAligned += 1; if (goal) row.goalsFromAligned += 1; }
  };
  const bookWuFlight = (f: WuFlight): void => {
    const wg: number[] = [0];
    const gg: number[] = [];
    if (f.hasLead) {
      wg.push(1); gg.push(0);
      if (f.meetable) { wg.push(2); gg.push(1); }
    }
    for (const gi of wg) {
      row.wSum[gi] += f.wTicks;
      row.wN[gi] += 1;
      if (f.startDelayTicks === null) row.sdCensored[gi] += 1;
      else {
        row.sdSum[gi] += f.startDelayTicks;
        row.sdN[gi] += 1;
        row.sdBins[gi][binOf(f.startDelayTicks, SD_BIN_TICKS, SD_BINS)] += 1;
      }
    }
    for (const gi of gg) {
      row.agN[gi] += 1;
      row.outc[gi][OI(outcomeOf(f.completedHere, f.interceptedHere, f.wentDead))] += 1;
      if (f.reachedPoint && Number.isFinite(f.arrDist)) {
        row.reachedN[gi] += 1;
        row.gapPredSum[gi] += f.predictedArrDist;
        row.gapMeasSum[gi] += f.arrDist;
        row.gapN[gi] += 1;
        row.gapDiffBins[gi][
          signedBinOf(f.arrDist - f.predictedArrDist, CAL_BIN_M, CAL_BINS)] += 1;
      }
    }
  };
  const retireWu = (): void => { if (flight !== null) { bookWuFlight(flight); flight = null; } };
  const bookGp = (f: GpFlight): void => {
    row.gpFlights += 1;
    row.contactClass[CTI(f.contactClass)] += 1;
    if (f.firstContactSector !== null) {
      const si = SECTORS.indexOf(f.firstContactSector);
      row.firstContactSector[si] += 1;
      row.firstContactSectorN += 1;
      if (f.contactClass === 'ownTarget') {
        if (isSideOrBack(f.firstContactSector)) row.ownTargetSideBack += 1;
        row.complBySectorN[si] += 1;
        if (f.completedHere) row.complBySector[si] += 1;
      }
    }
    if (f.recvSector !== null) {
      row.recvSector[SECTORS.indexOf(f.recvSector)] += 1;
      row.recvSectorN += 1;
    }
  };
  const retireGp = (): void => { if (gp !== null) { bookGp(gp); gp = null; } };

  while (!m.finished) {
    /* ⭐ THE PRE-STEP SNAPSHOT — the READY "applied" predicate is the fix's own G-BITE
       predicate, which compares `p.faceTarget` AFTER the step to the CARRIER'S POSITION AS IT
       STOOD BEFORE it (the executor copied the carrier's `pos` mid-step, and the carrier has
       moved since). Heading is snapshotted for the "turned toward" read. */
    const pre = observe
      ? players.map((p) => ({ x: p.pos.x, y: p.pos.y, hx: p.heading.x, hy: p.heading.y }))
      : null;
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe || pre === null) continue;
    /* the substitution receipt: a substitute IS the pitch-slot object with a NEW identity */
    for (let i = 0; i < players.length; i++) {
      if (players[i].name !== names[i]) {
        names[i] = players[i].name;
        row.substitutions += 1;
        if (players[i].facingDepth === wantDepth) row.subsSeenWithRightDepth += 1;
      }
    }
    if (!depthOkNow()) row.depthAlwaysOk = false;

    const ball = m.ball;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    const passChangedHere = passT !== null && passT !== prevPendingPassT;
    prevPendingPassT = passT;
    const lastTouch = ball.lastTouch;

    /* ---------- ⭐⭐ THE PER-SHOT KEEPER READ ----------
       Goal increments are resolved FIRST (they belong to an EARLIER shot), then this tick's
       shots are recorded against the window that stands BEFORE this tick's keeper sample is
       pushed — "the 27 ticks BEFORE the shot tick", literally. */
    for (const side of [0, 1] as const) {
      if (d.goals[side] > 0) {
        const rec = openShot[side];
        if (rec !== null) { bookShot(rec, true); openShot[side] = null; }
      }
    }
    for (const side of [0, 1] as const) {
      if (d.shots[side] <= 0) continue;
      const defSide = (1 - side) as Side;
      const mv = kMoving[defSide];
      const ms = kMis[defSide];
      const from = Math.max(0, mv.length - PC_TIER_CHOICE_TICKS);
      let moving = 0; let mis = 0;
      for (let i = from; i < mv.length; i++) {
        if (!mv[i]) continue;
        moving += 1;
        if (ms[i]) mis += 1;
      }
      for (let k = 0; k < d.shots[side]; k++) {
        const prevOpen = openShot[side];
        if (prevOpen !== null) bookShot(prevOpen, false);
        openShot[side] = {
          side, misShare: moving === 0 ? 0 : mis / moving, hasMovingTicks: moving > 0,
        };
      }
    }
    for (const side of [0, 1] as const) {
      const gk = m.teams[side].players.find((p) => p.role === 'GK');
      let moving = false;
      let mis = false;
      if (gk !== undefined && !gk.sentOff && playing) {
        const sp = Math.hypot(gk.vel.x, gk.vel.y);
        if (sp > MOVING_FLOOR) {
          const phi = phiDegOf(gk.heading.x, gk.heading.y, gk.vel.x, gk.vel.y);
          if (Number.isFinite(phi)) { moving = true; mis = phi > KEEPER_MIS_DEG; }
        }
      }
      kMoving[side].push(moving);
      kMis[side].push(mis);
      if (kMoving[side].length > PC_TIER_CHOICE_TICKS * 2) {
        kMoving[side].splice(0, PC_TIER_CHOICE_TICKS);
        kMis[side].splice(0, PC_TIER_CHOICE_TICKS);
      }
    }

    if (playing) {
      row.openPlayTicks += 1;
      const carrier = ball.owner;
      /* ---------- ⭐⭐ THE φ POPULATION, THE BF COVERAGE AND THE READY COVERAGE ---------- */
      for (const p of players) {
        if (p.sentOff) continue;
        row.bodyTicks += 1;
        /* ⭐⭐ THE READY POPULATION: a SAME-SIDE OFF-BALL body-tick — the brain's own fork
           condition, read off public state (a carrier exists, he is not me, he is my side,
           neither of us is sent off). This is the denominator of the coverage share. */
        if (carrier !== null && carrier !== p && carrier.side === p.side && !carrier.sentOff) {
          row.readyPopTicks += 1;
          const gid = p.action.readyFaceGid;
          const ben = p.action.readyBenefit;
          if (gid !== undefined && ben !== undefined) {
            row.readyOverlayTicks += 1;
            row.readyBenefitSum += ben;
            row.readyBenefitBins[binOf(ben, BENEFIT_BIN, BENEFIT_BINS)] += 1;
            /* the RECOMPUTED cost (a READ, declared; its phase is stated at §P.B) */
            const c = pre[gid];
            const cost = readyCostOf(p.desiredVel.x, p.desiredVel.y,
              c.x - pre[p.gid].x, c.y - pre[p.gid].y, p.facingDepth, p.action.scores[0].score);
            row.readyCostSum += cost;
            row.readyCostN += 1;
            row.readyCostBins[binOf(cost, COST_BIN, COST_BINS)] += 1;
            /* ⭐⭐ THE FIX'S OWN G-BITE PREDICATE: overlay present ∧ NO PC HOLD LIVE for that
               gid (a PURE `Map.get` — the hold is live while `simTick < untilTick`; the
               MUTATING `holdFor` is never called) ∧ `faceTarget` EQUALS the carrier's
               PRE-STEP `pos`. */
            const h = mm.pcLatency === null ? undefined : mm.pcLatency.holds.get(p.gid);
            const heldLive = h !== undefined && tick < h.untilTick;
            if (heldLive) row.readyHeldTicks += 1;
            else if (p.faceTarget !== null && p.faceTarget.x === c.x && p.faceTarget.y === c.y) {
              row.readyAppliedTicks += 1;
              const b = pre[p.gid];
              const wx = c.x - b.x;
              const wy = c.y - b.y;
              const wl = Math.hypot(wx, wy) || 1;
              const before = b.hx * (wx / wl) + b.hy * (wy / wl);
              const after = p.heading.x * (wx / wl) + p.heading.y * (wy / wl);
              if (after > before) row.readyTurnedTowardTicks += 1;
            }
          }
        }
        const vx = p.vel.x;
        const vy = p.vel.y;
        const sp = Math.sqrt(vx * vx + vy * vy);
        if (!(sp > MOVING_FLOOR)) continue;
        const phi = phiDegOf(p.heading.x, p.heading.y, vx, vy);
        if (!Number.isFinite(phi)) continue;
        row.movingTicks += 1;
        row.movingSpeedSum += sp;
        const b = binOf(phi, PHI_BIN_DEG, NPHI);
        const ro = RO_OF(p.role);
        row.phiBins[b] += 1;
        row.rolePhiBins[ro][b] += 1;
        row.roleMovingTicks[ro] += 1;
        if (p.role === 'GK' && (p.action.type as string) === 'GoalkeeperPosition') {
          row.gkPosSpeedSum += sp;
          if (phi > KEEPER_MIS_DEG) row.gkPosMisSpeedSum += sp;
        }
        row.covN += 1;
        const f = coverageFactorOf(p.heading.x, p.heading.y, p.desiredVel.x, p.desiredVel.y,
          p.topSpeed, p.facingDepth);
        row.covFSum += f;
        if (f < 1 - COVERAGE_EPS) row.covApplied += 1;
      }
      /* ---------- ⭐ THE DF FACES — DF-T1 §3's instrument, REUSED VERBATIM ---------- */
      for (const t of m.teams) {
        const side = t.side;
        if (m.possessionSide === side) continue;
        row.defTeamTicks += 1;
        const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
        row.defenderTicks += outfield.length;
        for (const p of outfield) {
          const k = markKey(side, p.index);
          const cur2 = t.marks.has(p.index) ? (t.marks.get(p.index) as number) : null;
          const prev = prevMark.has(k) ? (prevMark.get(k) as number | null) : null;
          if (cur2 !== null) row.markHeldTicks += 1;
          if (prev !== null && cur2 !== null && prev !== cur2) row.markSwitches += 1;
          prevMark.set(k, cur2);
        }
      }
      /* ---------- (i) 挤人 — PT-C0's A4 limbs at the A4 battery's own cadence ---------- */
      if (tick % SAMPLE_EVERY === 0) {
        const ownerGid = ball.owner?.gid ?? null;
        const possSide: Side | null = ownerGid !== null ? players[ownerGid].side as Side
          : (gp !== null ? gp.passerSide : null);
        if (possSide !== null) {
          const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
          const xs = outs.map((q) => q.pos.x);
          const ys = outs.map((q) => q.pos.y);
          row.crowdSamples += 1;
          for (let a = 0; a < xs.length; a++) {
            const nearest = nearestMateOf(xs, ys, a);
            if (Number.isFinite(nearest)) {
              row.spacingSum += nearest;
              row.spacingSamples += 1;
              row.nearBins[binOf(nearest, NEAR_BIN_M, NEAR_BINS)] += 1;
            }
          }
          row.dupRunSum += dupRunPairsOf(xs, ys);
          const mp = minPairwiseOf(xs, ys);
          if (Number.isFinite(mp)) {
            row.minPairN += 1;
            row.minPairBins[binOf(mp, MINPAIR_BIN_M, MINPAIR_BINS)] += 1;
            if (mp < DUP_RUN_M) row.crashHits += 1;
          }
        }
      }
    }

    /* ---------- THE WIND-UP RECORD: arm · release (RC-T1a's tick indexing, byte for byte) -- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    if (wu !== null && key !== wu.key) {
      const released = passChangedHere && pp !== null && pp.passerGid === wu.gid
        && pp.targetGid === wu.targetGid && tick >= wu.readyTick;
      if (released) {
        row.windupsReleased += 1;
        retireWu();
        const ox = ball.pos.x - ball.vel.x * DT;
        const oy = ball.pos.y - ball.vel.y * DT;
        const ux0 = wu.eX - ox;
        const uy0 = wu.eY - oy;
        const L = Math.sqrt(ux0 * ux0 + uy0 * uy0);
        flight = {
          gid: wu.gid, targetGid: wu.targetGid, releaseTick: tick,
          eX: wu.eX, eY: wu.eY, hasLead: wu.hasLead, meetable: wu.meetable,
          predictedArrDist: wu.predictedArrDist,
          launchX: ox, launchY: oy, L, ux: L > 1e-6 ? ux0 / L : 0, uy: L > 1e-6 ? uy0 / L : 0,
          wTicks: wu.readyTick - wu.t0,
          reachedPoint: false, arrDist: Number.NaN,
          completedHere: false, interceptedHere: false, wentDead: false,
          startDelayTicks: null,
        };
      }
      wu = null;
    }
    if (rec !== null && (wu === null || key !== wu.key)) {
      /* A NEW ARM at t0 = this tick — RC-T1a §P.B's ARM INSTANT, declared: the mate's arm
         position is the RECORD's own `aim` (so dMate = |aimLead|); the passer's position and
         the mate's `topSpeed` are read at the END of the arm tick, because with NO WRAPPER
         mid-tick is not observable. ⚠ up to one tick of drift on the passer's position only. */
      row.windupsArmed += 1;
      const passer = players[rec.gid];
      const target = players[rec.targetGid];
      const eX = rec.aim.x + (rec.aimLead?.x ?? 0);
      const eY = rec.aim.y + (rec.aimLead?.y ?? 0);
      const dMate = Math.sqrt((eX - rec.aim.x) ** 2 + (eY - rec.aim.y) ** 2);
      const dBall = Math.sqrt((eX - passer.pos.x) ** 2 + (eY - passer.pos.y) ** 2);
      const ts = target.topSpeed;
      wu = {
        key: key as string, t0: tick, gid: rec.gid, targetGid: rec.targetGid,
        readyTick: rec.readyTick, eX, eY, hasLead: rec.aimLead !== null,
        meetable: meetableOf(dMate, marginOf(dBall, dMate, ts)),
        predictedArrDist: predictedArrDistOf(dBall, dMate, ts),
      };
    }
    /* ---------- THE RELEASED WIND-UP FLIGHT: start delay · arrival · outcome ---------- */
    if (flight !== null) {
      const f = flight;
      const target = players[f.targetGid];
      /* ⭐ THE START DELAY — RC-C0 §P.D: ticks from the RELEASE tick to his first
         `ReceivePass`. CENSORED if he never enters it before the flight retires — the
         censored bucket is COUNTED, never imputed. */
      if (f.startDelayTicks === null && (target.action.type as string) === 'ReceivePass') {
        f.startDelayTicks = tick - f.releaseTick;
      }
      /* ⭐⭐ THE MEASURED ARRIVAL — RC-C0's own read: the receiver→E distance at the tick the
         ball's along-line projection first reaches E. */
      if (!f.reachedPoint && f.L > 1e-6) {
        const proj = (ball.pos.x - f.launchX) * f.ux + (ball.pos.y - f.launchY) * f.uy;
        if (proj >= f.L) {
          f.reachedPoint = true;
          f.arrDist = dist(target.pos, { x: f.eX, y: f.eY });
        }
      }
      const mySide = players[f.gid].side as Side;
      if (d.passesCompleted[mySide] > 0) f.completedHere = true;
      if (d.interceptions[1 - mySide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.gid) retireWu();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireWu();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireWu();
    }

    /* ---------- (iii) THE GROUND-PASS RELEASE (PT-C0's own; the user's faces) ---------- */
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const k0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side],
          throughBalls: d.throughBalls[side], longBalls: d.longBalls[side],
          headersWon: d.headersWon[side],
        }, passChangedHere && pp !== null && pp.side === side);
        if (k0 === null) continue;
        let klass = k0;
        let gid = -1;
        if (passChangedHere && pp !== null && pp.side === side) gid = pp.passerGid;
        else if (lastTouch !== null && lastTouch.side === side) gid = lastTouch.gid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && (players[gid].action.type as string) === 'ThrowOut') {
          klass = 'keeperThrow';
        }
        releases.push({ gid, klass });
      }
    }
    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass) || hSpeedNow < 1e-6) continue;
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (pp !== null && passChangedHere && pp.passerGid === rel.gid)
        ? pp.targetGid : null;
      if (!isMeasurableGroundPass(rel.klass, ground, targetGid !== null)) continue;
      retireGp();
      row.gpMeasured += 1;
      gp = {
        passerGid: rel.gid, passerSide: players[rel.gid].side as Side,
        targetGid: targetGid as number, releaseTick: tick,
        contactGid: null, contactClass: 'none', firstContactSector: null,
        completedHere: false, interceptedHere: false, wentDead: false, recvSector: null,
      };
    }
    /* ---------- (iii) FOLLOW THE GROUND PASS — THE (a) FACE'S OWN READ ---------- */
    if (gp !== null) {
      const f = gp;
      if (f.contactGid === null && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactGid = lastTouch.gid;
        f.contactClass = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
        /* ⭐⭐ (a)'s WHOLE DEFINITION: when the FIRST body the ball meets is the OWN TARGET,
           the BK `BodySector` classifier is CALLED with the ball→body approach AT THAT TICK. */
        if (f.contactClass === 'ownTarget') {
          f.firstContactSector = ballAccessGeometry(
            players[f.targetGid], ball, CONTROL_RADIUS,
          ).sector;
        }
      }
      if (d.passesCompleted[f.passerSide] > 0 && !f.completedHere) {
        f.completedHere = true;
        /* PT-C0's own face: the receiver's facing SECTOR at his FIRST TOUCH on a COMPLETED
           pass — the same classifier, at the completion tick. */
        f.recvSector = ballAccessGeometry(players[f.targetGid], ball, CONTROL_RADIUS).sector;
      }
      if (d.interceptions[1 - f.passerSide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.passerGid) retireGp();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireGp();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireGp();
    }
  }
  retireWu();
  retireGp();
  if (observe) {
    for (const side of [0, 1] as const) {
      const r = openShot[side];
      if (r !== null) bookShot(r, false);
    }
    if (mm.pcLatency !== null) row.preCuedArms = mm.pcLatency.ledger.preCuedArms;
    for (const t of m.teams) for (const p of t.players) if (p.role === 'GK') row.gkDistance += p.distance;
    const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
    for (const k of STAT_KEYS) row.stats[k] = st[0][k] + st[1][k];
  }
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — NO WRAPPER; the observation reads are BYTE-INERT  */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
banner('RC-T1B — the lockstep receipt (observed vs unobserved, PER ARM; NO wrapper installed)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm-walks)`);
/**
 * ⭐ gArmsDiverge — the RECEIPT that the door demonstrably bites, PER PAIR. ⚠ SOME, not EVERY
 * (#364 item 1's ratified reading): a match in which nothing ever fires may legally walk
 * BYTE-IDENTICALLY in both arms. THE GATE IS ON THE SCORED PAIR (E3 − E1) ONLY; the other
 * five pairs' counts are REPORTED whatever they are.
 */
const divergeByPair = PAIRS.map((p) => ({
  pair: p.key,
  diverged: LOCKSTEP_SEEDS.filter((seed) => {
    const lo = lockstepRows.find((r) => r.seed === seed && r.arm === p.lo)!;
    const hi = lockstepRows.find((r) => r.seed === seed && r.arm === p.hi)!;
    return lo.observed !== hi.observed;
  }),
}));
const ARMS_DIVERGE = (divergeByPair.find((r) => r.pair === 'E3E1') as { diverged: number[] })
  .diverged.length > 0;

/* ========================================================================== */
/* §12 THE BATTERY — the SIX ARMS PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`RC-T1B — the battery: ${N} SHARED SEEDS × ${ARMS.length} arms (${N * ARMS.length} walks), `
  + `seeds ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const arm of ARMS) rows[arm] = walkMatch(buildMatch(seed, arm), arm, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const arm of ARMS) receiptRows[arm] = walkMatch(buildMatch(RECEIPT_SEED, arm), arm, true);
const walksBooked = cells.length * ARMS.length + ARMS.length;
const armRows = (arm: Arm): Row[] => cells.map((c) => c.rows[arm]);

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over the SHARED seeds (consumes NO stats) */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);

interface FaceDef {
  unit: string; what: string; group: string;
  num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, group: string, what: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, group, num, dn }; };

/* ---- (a) THE SCORED FACE — the user's THIRD sentence ---- */
defFace('contact.ownTargetSideBackShare', 'share of measured ground passes', 'SCORED (a)',
  '⭐⭐ (a) 「球还打在他侧身上吗」 — of every MEASURED GROUND PASS, the share whose FIRST body '
  + 'contact after the release is the OWN TARGET with the ball meeting a SIDE or BACK sector '
  + '(PT-C0\'s H2 face; the BK `BodySector` classifier CALLED with the ball→body approach at '
  + 'that contact tick). ⚠ A SELECTION statistic — who reaches a first touch at all can change',
  (r) => r.ownTargetSideBack, (r) => r.gpFlights);
/* ---- (b) THE SCORED FACE — the user's SECOND sentence ---- */
defFace('contact.opponentFirstContactShare', 'share of measured ground passes', 'SCORED (b)',
  '⭐⭐ (b) 「传到对面身上」 — of every MEASURED GROUND PASS, the share whose FIRST body '
  + 'contact after the release is an OPPONENT (PT-C0 (iii)\'s classes, reused byte for byte)',
  (r) => r.contactClass[CTI('opponent')], (r) => r.gpFlights);
/* ---- (c1)/(c2)/(c3) THE SCORED DO-NO-HARM FACES (BF-T1's bands verbatim) ---- */
defFace('goalsPerMatch', 'goals per match (240 s match clock)', 'SCORED (c1)',
  '⭐ (c1) GOALS — both sides, the engine\'s own counter; a BAND rule [−0.30, +0.30]',
  (r) => r.stats.goals, (r) => r.matches);
defFace('passCompletion', 'share', 'SCORED (c2)',
  '⭐ (c2) COMPLETION — the ENGINE\'s own whole-match completion over ALL deliveries',
  (r) => r.stats.passesCompleted, (r) => r.stats.passes);
defFace('interceptionsPerMatch', 'interceptions per match (240 s match clock)', 'SCORED (c3)',
  '⭐ (c3) INTERCEPTIONS — the MATCH TOTAL (⚠ BOTH sides carry every armed door, so every '
  + 'interception is conceded by a side whose bodies are priced and armed). STATED',
  (r) => r.stats.interceptions, (r) => r.matches);
/* ---- ⭐⭐ THE MECHANISM FACE BESIDE (a): the first-contact sector shares ---- */
for (const s of SECTORS) {
  const S = `${s[0].toUpperCase()}${s.slice(1)}`;
  defFace(`contact.ownTargetFirstContact${S}Share`, 'share of measured ground passes',
    'REPORTED sector',
    `the share of measured ground passes whose FIRST body contact is the OWN TARGET with the `
    + `ball meeting the \`${s}\` sector — (a)'s own three-way decomposition`,
    (r) => r.firstContactSector[SECTORS.indexOf(s)], (r) => r.gpFlights);
  defFace(`contact.receiver${S}ShareCompleted`, 'share of completed measured ground passes',
    'REPORTED sector',
    `⭐⭐ PT-C0's own face: the receiver's facing SECTOR at his FIRST TOUCH on COMPLETED `
    + `passes — \`${s}\` (the BK \`BodySector\` classifier CALLED at the completion tick)`,
    (r) => r.recvSector[SECTORS.indexOf(s)], (r) => r.recvSectorN);
}
/* ---- ⭐⭐ COMPLETION BY SECTOR — the reality read ---- */
defFace('completionBySector.front', 'share of own-target front-contact passes',
  'REPORTED completion-by-sector',
  '⭐⭐ P(the pass COMPLETED | the target\'s FIRST-CONTACT sector is FRONT) — of the measured '
  + 'ground passes whose first body contact was the own target on the `front` sector, the '
  + 'share that completed. ⚠ NOT causal: a front-on body is not randomly assigned',
  (r) => r.complBySector[SECTORS.indexOf('front')],
  (r) => r.complBySectorN[SECTORS.indexOf('front')]);
defFace('completionBySector.sideOrBack', 'share of own-target side/back-contact passes',
  'REPORTED completion-by-sector',
  '⭐⭐ P(the pass COMPLETED | the target\'s FIRST-CONTACT sector is SIDE or BACK) — the same '
  + 'read on the other two sectors pooled. ⚠ NOT causal',
  (r) => r.complBySector[SECTORS.indexOf('side')] + r.complBySector[SECTORS.indexOf('back')],
  (r) => r.complBySectorN[SECTORS.indexOf('side')] + r.complBySectorN[SECTORS.indexOf('back')]);
/* ---- ⭐⭐ THE READY COVERAGE (⛔ PLUMBING, never an effect size) ---- */
defFace('ready.overlayShare', 'share of same-side off-ball open-play body-ticks',
  'REPORTED READY coverage',
  '⭐⭐ THE READY COVERAGE: the share of SAME-SIDE OFF-BALL open-play body-ticks carrying the '
  + 'overlay (`p.action.readyFaceGid` set). ⛔ PLUMBING, never an effect size',
  (r) => r.readyOverlayTicks, (r) => r.readyPopTicks);
defFace('ready.appliedShare', 'share of same-side off-ball open-play body-ticks',
  'REPORTED READY coverage',
  '⭐⭐ THE FACE APPLIED — the fix\'s own G-BITE predicate: overlay present ∧ NO PC hold live '
  + 'for that gid (a PURE `Map.get`; live while `simTick < untilTick`) ∧ `p.faceTarget` EQUALS '
  + 'the carrier\'s PRE-STEP `pos`. ⛔ PLUMBING',
  (r) => r.readyAppliedTicks, (r) => r.readyPopTicks);
defFace('ready.appliedShareOfOverlay', 'share of overlay ticks', 'REPORTED READY coverage',
  '⭐ the same count over the OVERLAY ticks alone — how often a believing body actually won '
  + 'the trade. ⛔ PLUMBING',
  (r) => r.readyAppliedTicks, (r) => r.readyOverlayTicks);
defFace('ready.pcHeldShareOfOverlay', 'share of overlay ticks', 'REPORTED READY coverage',
  '⭐ the share of overlay ticks on which a LIVE PC reaction hold owned the face instead '
  + '(RC-T0b\'s G-HOLD case, in the wild). ⛔ PLUMBING',
  (r) => r.readyHeldTicks, (r) => r.readyOverlayTicks);
defFace('ready.turnedTowardShareOfApplied', 'share of applied ticks', 'REPORTED READY coverage',
  '⭐⭐ of the ticks on which the face was applied, the share on which the body\'s HEADING '
  + 'really rotated TOWARD the carrier that step (the pre-step heading\'s projection on the '
  + 'bearing rose). ⛔ PLUMBING',
  (r) => r.readyTurnedTowardTicks, (r) => r.readyAppliedTicks);
defFace('ready.meanBenefit', 'priority (the menu\'s own dimensionless currency)',
  'REPORTED READY coverage',
  '⭐ the MEAN `readyBenefit` = w · belief · `RC_S_RECEIVE` over the overlay ticks (bins '
  + 'stored). ⛔ PLUMBING', (r) => r.readyBenefitSum, (r) => r.readyOverlayTicks);
defFace('ready.meanRecomputedCost', 'priority (the menu\'s own dimensionless currency)',
  'REPORTED READY coverage',
  '⭐⭐ the MEAN RECOMPUTED COST over the same ticks — A READ, DECLARED (§P.B): the seam\'s '
  + 'own form with the body\'s PUBLIC `desiredVel` direction substituted for the executor\'s '
  + 'private `dir`, and the carrier\'s PRE-STEP `pos` for the bearing. ⛔ PLUMBING, a PROXY',
  (r) => r.readyCostSum, (r) => r.readyCostN);
/* ---- ⭐ THE 3a COVERAGE ---- */
defFace('receipt.preCuedArmsPerMatch', 'pre-cued arms per match (240 s match clock)',
  'REPORTED 3a coverage',
  '⭐ THE 3a SEAT\'S OWN LEDGER counter `preCuedArms` — arms whose hold ticks came from the '
  + 'pre-cue interpolation. ⛔ PLUMBING, never an effect size',
  (r) => r.preCuedArms, (r) => r.matches);
/* ---- ⭐⭐ THE ARRIVAL GAP + THE START-DELAY RECEIPT (RC-T1a's faces, byte for byte) ---- */
defFace('gap.meanDiffMetres.meetableCarried', 'metres', 'REPORTED gap',
  '⭐⭐ RC-C0 §P.D\'s FACE, RE-MEASURED BYTE FOR BYTE: on LED balls the access account calls '
  + 'MEETABLE and whose along-line projection reached the elected point, the mean of '
  + '(MEASURED receiver→E distance at arrival) − (the account\'s PREDICTED distance). A '
  + 'front-on body is not a faster body, so this face asks whether facing changed what the '
  + 'meetable receiver needed',
  (r) => r.gapMeasSum[GG('meetableCarried')] - r.gapPredSum[GG('meetableCarried')],
  (r) => r.gapN[GG('meetableCarried')]);
defFace('gap.meanDiffMetres.carried', 'metres', 'REPORTED gap',
  'the same face on ALL LED balls (the wider class)',
  (r) => r.gapMeasSum[GG('carried')] - r.gapPredSum[GG('carried')],
  (r) => r.gapN[GG('carried')]);
defFace('gap.predictedMetres.meetableCarried', 'metres', 'REPORTED gap',
  'the account\'s PREDICTED arrival distance alone (the gap\'s subtrahend)',
  (r) => r.gapPredSum[GG('meetableCarried')], (r) => r.gapN[GG('meetableCarried')]);
defFace('gap.measuredMetres.meetableCarried', 'metres', 'REPORTED gap',
  'the MEASURED arrival distance alone (the gap\'s minuend)',
  (r) => r.gapMeasSum[GG('meetableCarried')], (r) => r.gapN[GG('meetableCarried')]);
for (const g of WGROUPS) {
  const gi = WGROUPS.indexOf(g);
  defFace(`window.startDelayMeanTicks.${g}`, 'ticks', 'REPORTED start delay',
    `⭐ RC-C0 §P.D's START-DELAY RECEIPT on the \`${g}\` class: ticks from the RELEASE tick to `
    + 'the target\'s first `ReceivePass`, over the UNCENSORED flights only',
    (r) => r.sdSum[gi], (r) => r.sdN[gi]);
  defFace(`window.startDelayCensoredShare.${g}`, 'share of that class\'s released flights',
    'REPORTED start delay',
    `⭐⭐ THE CENSORED BUCKET, COUNTED NEVER IMPUTED: the share of \`${g}\` flights on which `
    + 'the target never entered `ReceivePass` before the flight retired',
    (r) => r.sdCensored[gi], (r) => r.wN[gi]);
  defFace(`window.windupMeanTicks.${g}`, 'ticks', 'REPORTED start delay',
    `the wind-up length itself on the \`${g}\` class (context)`,
    (r) => r.wSum[gi], (r) => r.wN[gi]);
}
for (const o of OUTCOMES) {
  defFace(`arrival.outcome.meetableCarried.${o}`, 'share', 'REPORTED gap',
    `DX-C2's own four-way ladder (TEMPORAL, not causal) on meetable carried: \`${o}\``,
    (r) => r.outc[GG('meetableCarried')][OI(o)], (r) => r.agN[GG('meetableCarried')]);
}
/* ---- ⭐⭐ THE PER-SHOT KEEPER READ (the goals story's probe) ---- */
defFace('keeper.shotMisalignedShare', 'share of shots with a keeper-moving window',
  'REPORTED keeper per-shot',
  '⭐⭐ THE SHARE OF SHOTS whose DEFENDING keeper was misaligned on at least one of his MOVING '
  + `ticks in the ${PC_TIER_CHOICE_TICKS} ticks BEFORE the shot tick (φ > 45°, |vel| > the `
  + 'shipped 0.5 m/s floor). Shots on which the keeper never moved in the window are their OWN '
  + 'class and are EXCLUDED from this denominator, never imputed',
  (r) => r.shotsMis, (r) => r.shotsMis + r.shotsAligned);
defFace('keeper.meanShotMisalignedShare', 'share of the keeper\'s moving ticks in the window',
  'REPORTED keeper per-shot',
  '⭐ the MEAN of the per-shot misaligned share itself (bins stored), over the shots with at '
  + 'least one keeper-moving tick in the window',
  (r) => r.shotShareSum, (r) => r.shotShareN);
defFace('keeper.pGoalGivenMisaligned', 'share of those shots', 'REPORTED keeper per-shot',
  '⭐⭐ P(GOAL | the defending keeper\'s misaligned share in the window > 0). The goal '
  + 'attribution is FROZEN: a `goals` increment for side s is attributed to the MOST RECENT '
  + 'still-open shot of side s; a shot closes as no-goal when the same side shoots again or at '
  + 'full time. ⚠ AN ASSOCIATION, not a causal claim',
  (r) => r.goalsFromMis, (r) => r.shotsMis);
defFace('keeper.pGoalGivenAligned', 'share of those shots', 'REPORTED keeper per-shot',
  '⭐⭐ P(GOAL | that share = 0) — the same read on the shots whose defending keeper moved in '
  + 'the window and was never misaligned. ⚠ AN ASSOCIATION',
  (r) => r.goalsFromAligned, (r) => r.shotsAligned);
defFace('keeper.shotsWithNoKeeperMovingTicksShare', 'share of shot events',
  'REPORTED keeper per-shot',
  '⭐ THE THIRD CLASS, PUBLISHED: the share of shot events whose defending keeper had ZERO '
  + 'moving ticks in the window — no share is defined for them and none is imputed',
  (r) => r.shotsNoMovingTicks, (r) => r.shotEvents);
defFace('keeper.shotEventsPerMatch', 'shot events per match (240 s match clock)',
  'REPORTED keeper per-shot',
  'the per-shot read\'s own population size (⚠ the engine\'s `shots` counter increments; this '
  + 'is the same count seen event by event)', (r) => r.shotEvents, (r) => r.matches);
/* ---- ⭐ THE KEEPER'S STANDING FACES (BF-T1's, reused) ---- */
defFace('keeper.savesPerMatch', 'saves per match (240 s match clock)', 'REPORTED keeper',
  'the engine\'s own `saves` counter, BOTH teams', (r) => r.stats.saves, (r) => r.matches);
defFace('keeper.gkMetresPerKeeperPerMatch', 'metres per keeper per match (240 s match clock)',
  'REPORTED keeper',
  '⭐ the GK\'s own `distance` at full time, summed over the TWO keepers and divided by TWO '
  + 'keeper-matches', (r) => r.gkDistance, (r) => r.matches * 2);
defFace('keeper.gkPositionMisalignedMetresPerMatch', 'metres per match (240 s match clock)',
  'REPORTED keeper',
  '⭐⭐ `GoalkeeperPosition` × GK\'s MISALIGNED metres — Σ|vel| over that row\'s moving ticks '
  + 'with φ > 45°, × DT (BF-C0 §R2\'s biggest exposure row, re-measured)',
  (r) => r.gkPosMisSpeedSum * DT, (r) => r.matches);
defFace('keeper.gkPositionMetresPerMatch', 'metres per match (240 s match clock)',
  'REPORTED keeper', 'the same row\'s TOTAL moving metres (the denominator beside it)',
  (r) => r.gkPosSpeedSum * DT, (r) => r.matches);
/* ---- ⭐ THE MISALIGNMENT SHARES BY ROLE + THE BF PRICE'S LIVE COVERAGE ---- */
const phiAtOrAbove = (r: Row, b: number): number => sum(r.phiBins.slice(b));
const rolePhiAtOrAbove = (r: Row, ro: number, b: number): number => sum(r.rolePhiBins[ro].slice(b));
defFace('misalign.share45', 'share of moving open-play body-ticks', 'REPORTED misalignment',
  '⭐ φ > 45° — BF-C0 §P.B\'s headline, re-measured (45° is the LOWER EDGE of stored φ bin 3)',
  (r) => phiAtOrAbove(r, BIN45), (r) => r.movingTicks);
defFace('misalign.share90', 'share of moving open-play body-ticks', 'REPORTED misalignment',
  '⭐ φ > 90° — BF-C0\'s BACKPEDAL SHARE, re-measured (90° is the LOWER EDGE of stored bin 6)',
  (r) => phiAtOrAbove(r, BIN90), (r) => r.movingTicks);
for (let ro = 0; ro < NROLE; ro++) {
  const R = ROLES[ro];
  defFace(`misalign.role.${R}.share45`, 'share of that role\'s moving ticks',
    'REPORTED misalignment', `φ > 45° for role ${R} (BF-C0 §R1's by-role table, reused)`,
    (r) => rolePhiAtOrAbove(r, ro, BIN45), (r) => r.roleMovingTicks[ro]);
  defFace(`misalign.role.${R}.share90`, 'share of that role\'s moving ticks',
    'REPORTED misalignment', `φ > 90° for role ${R} (BF-C0 §R1's by-role table, reused)`,
    (r) => rolePhiAtOrAbove(r, ro, BIN90), (r) => r.roleMovingTicks[ro]);
}
defFace('coverage.appliedShare', 'share of moving open-play body-ticks', 'REPORTED BF coverage',
  '⭐⭐ BF-T1\'s LIVE COVERAGE face, reused: the share of MOVING ticks on which the factor '
  + 'recomputed from `heading` and the CLAMPED intent is < 1 − 1e-6. ⛔ PLUMBING',
  (r) => r.covApplied, (r) => r.covN);
defFace('coverage.meanFactor', 'factor (1 = no price)', 'REPORTED BF coverage',
  '⭐⭐ THE MEAN FACTOR APPLIED over the same moving ticks. ⛔ PLUMBING',
  (r) => r.covFSum, (r) => r.covN);
/* ---- ⭐ THE DF FACES — DF-T1 §3 / DF-C0 §R2's definitions, REUSED VERBATIM ---- */
defFace('df.markSwitchesPerDefenderMinute', 'switches per defender-minute (60 sim-s a body '
  + 'spent out of possession)', 'REPORTED defence',
  '⭐⭐ 乱跑 ITSELF — a marker\'s assigned man CHANGES (DF-C0 §R2\'s definition, DF-T1 §3\'s '
  + 'instrument, REUSED VERBATIM and anchored)',
  (r) => r.markSwitches, (r) => (r.defenderTicks * DT) / 60);
defFace('df.markHeldShare', 'share of defender body-ticks', 'REPORTED defence',
  '⭐ MARKING COVERAGE — how much of his defending life a body actually HAS a mark',
  (r) => r.markHeldTicks, (r) => r.defenderTicks);
defFace('df.tacklesPerMatch', 'tackles per match (240 s match clock)', 'REPORTED defence',
  'the engine\'s own `tackles` counter, both sides — the CONTACT half of the defensive pair',
  (r) => r.stats.tackles, (r) => r.matches);
/* ---- ⭐⭐ 撞车 AND THE OTHER CROWD LIMBS (PT-C0's own) ---- */
defFace('crowd.crashShare', 'share of sampled open-play ticks with an attributable side',
  'REPORTED user face',
  '⭐⭐ 「挤人」 — the share of samples whose MINIMUM PAIRWISE attacking-outfield distance is '
  + `below DUP_RUN_M = ${DUP_RUN_M} m (PT-C0 (i)'s A4 limb, anchored constants)`,
  (r) => r.crashHits, (r) => r.minPairN);
defFace('crowd.dupRunPairsPerSample', 'duplicate-run pairs per sample', 'REPORTED user face',
  'the A4 dup-run limb beside it', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres', 'REPORTED user face',
  'the A4 nearest-mate spacing limb beside it', (r) => r.spacingSum, (r) => r.spacingSamples);
/* ---- ⭐ E4 (RC-T1a's anchored definitions, reused) + shots ---- */
defFace('e4.forwardPassShare', 'share', 'REPORTED E4',
  '⭐ E4 — `mt-ladder.ts`\'s OWN definition, anchored and reused: passesForward / passes',
  (r) => r.stats.passesForward, (r) => r.stats.passes);
defFace('e4.thirdManPerMatch', 'releases per match (240 s match clock)', 'REPORTED E4',
  'the engine\'s own completed third-man release counter (anchored)',
  (r) => r.stats.thirdMan, (r) => r.matches);
defFace('e4.overlapsPerMatch', 'releases per match (240 s match clock)', 'REPORTED E4',
  'the engine\'s own completed overlap release counter (anchored)',
  (r) => r.stats.overlaps, (r) => r.matches);
defFace('e4.bestPassChainMeanPerTeam', 'passes (longest completed-pass chain in one move)',
  'REPORTED E4',
  '⭐ the engine\'s OWN possession-chain ledger `bestPassChain`, over TWO team-matches',
  (r) => r.stats.bestPassChain, (r) => r.matches * 2);
defFace('shotsPerMatch', 'shots per match (240 s match clock)', 'REPORTED E4',
  'the engine\'s own `shots` counter, both sides', (r) => r.stats.shots, (r) => r.matches);
/* ---- CONTEXT (rates on the 240 s match clock) ---- */
defFace('context.groundPassesPerMatch', 'measured ground passes per match (240 s match clock)',
  'REPORTED context', 'PT-C0\'s own measured-ground-pass population',
  (r) => r.gpMeasured, (r) => r.matches);
defFace('context.carriesPerMatch', 'carries per match (240 s match clock)', 'REPORTED context',
  'the engine\'s own `dribbles` counter (a CARRY push), both sides',
  (r) => r.stats.dribbles, (r) => r.matches);
defFace('context.movingTicksPerMatch', 'moving body-ticks per match (240 s match clock)',
  'REPORTED context', 'the movement population\'s own size',
  (r) => r.movingTicks, (r) => r.matches);
defFace('context.metresPerMatch', 'metres per match (240 s match clock)', 'REPORTED context',
  'Σ|vel| over moving ticks × DT — the ground the world covers while moving',
  (r) => r.movingSpeedSum * DT, (r) => r.matches);
defFace('context.meanSpeedMps', 'm/s', 'REPORTED context',
  'the mean speed over every moving tick', (r) => r.movingSpeedSum, (r) => r.movingTicks);
defFace('context.movingShareOfBodyTicks', 'share of open-play body-ticks', 'REPORTED context',
  'how much of open play is above the shipped 0.5 m/s floor',
  (r) => r.movingTicks, (r) => r.bodyTicks);
defFace('context.openPlayTicksPerMatch', 'open-play ticks per match (240 s match clock)',
  'REPORTED context', 'the open-play clock itself', (r) => r.openPlayTicks, (r) => r.matches);
defFace('context.readyPopTicksPerMatch', 'same-side off-ball body-ticks per match',
  'REPORTED context', 'the READY coverage\'s own denominator, per match',
  (r) => r.readyPopTicks, (r) => r.matches);
defFace('context.windupsReleasedPerMatch', 'released wind-ups per match', 'REPORTED context',
  'the gap face\'s own upstream population', (r) => r.windupsReleased, (r) => r.matches);
/* ---- RECEIPTS (⛔ PLUMBING, never effect sizes) ---- */
defFace('receipt.substitutionsPerMatch', 'substitutions per match', 'RECEIPT (plumbing)',
  '⛔ PLUMBING: identity changes observed in a pitch slot (`becomeSub`)',
  (r) => r.substitutions, (r) => r.matches);
const FACE_KEYS = Object.keys(FACES);

interface FaceRow {
  face: string; arm: Arm; unit: string; group: string; what: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = [];
for (const arm of ARMS) {
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
      face: key, arm, unit: f.unit, group: f.group, what: f.what,
      value: point, numerator: sum(nu), denominator: sum(de),
      ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    });
  }
}
const face = (arm: Arm, k: string): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === arm);
  if (f === undefined) { banner(`RC-T1B FATAL — unknown face ${arm}.${k}`); process.exit(3); }
  return f!;
};

/* ⭐⭐ THE FIVE FROZEN H-RC.2 RULES (§P.C, in exact form; the DECLARED TARGETS are literals) */
const TARGET_C1_BAND = 0.30;
const TARGET_C2_COMPLETION = -0.010;
const TARGET_C3_INTERCEPTIONS = 1.0;
interface Iv { ciLo: number; ciHi: number }
const RULE_A = (d: Iv): boolean => d.ciHi < 0;
const RULE_B = (d: Iv): boolean => !(d.ciLo > 0);
const RULE_C1 = (d: Iv): boolean =>
  !(d.ciLo > TARGET_C1_BAND || d.ciHi < -TARGET_C1_BAND);
const RULE_C2 = (d: Iv): boolean => !(d.ciHi < TARGET_C2_COMPLETION);
const RULE_C3 = (d: Iv): boolean => !(d.ciLo > TARGET_C3_INTERCEPTIONS);
/** ⭐⭐ THE WORDS the five rules print — canon, VERBATIM: "a counterfactual verdict sentence
 *  ('had X been scored, the rule would read W') quotes a word the instrument STORED by
 *  applying the frozen rule to X's stored interval; a universal sentence about a table
 *  ('every bin', 'the one bin') is a stored boolean or is not written" (home:
 *  BF-T1-FACING-COST-EXAM.md §COMMANDER CORRECTIONS items 1–2, ruling #378 item 2). */
const WORD_A = (d: Iv): string => (RULE_A(d) ? 'FALLS' : 'DOES-NOT-FALL');
const WORD_B = (d: Iv): string => (RULE_B(d) ? 'DOES-NOT-RISE' : 'RISES');
const WORD_C1 = (d: Iv): string => (RULE_C1(d) ? 'WITHIN-BAND' : 'OUTSIDE-BAND');
const WORD_C2 = (d: Iv): string => (RULE_C2(d) ? 'DOES-NOT-FALL' : 'FALLS');
const WORD_C3 = (d: Iv): string => (RULE_C3(d) ? 'DOES-NOT-RISE' : 'RISES');
/** the five faces the five rules belong to — the SAME map on EVERY pair (gRuleWords) */
const RULE_OF_FACE: Record<string, { conjunct: string; rule: (d: Iv) => boolean;
  word: (d: Iv) => string }> = {
  'contact.ownTargetSideBackShare': { conjunct: 'a', rule: RULE_A, word: WORD_A },
  'contact.opponentFirstContactShare': { conjunct: 'b', rule: RULE_B, word: WORD_B },
  goalsPerMatch: { conjunct: 'c1', rule: RULE_C1, word: WORD_C1 },
  passCompletion: { conjunct: 'c2', rule: RULE_C2, word: WORD_C2 },
  interceptionsPerMatch: { conjunct: 'c3', rule: RULE_C3, word: WORD_C3 },
};
const RULED_FACES = Object.keys(RULE_OF_FACE);

/** ⭐ THE PAIRED Δ — hi − lo inside the SAME resampled seed set (the RC-T1a estimator) */
interface DeltaRow {
  key: string; pair: string; loArm: Arm; hiArm: Arm;
  loValue: number; hiValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlips: number; looScored: boolean;
  /** ⭐⭐ THE STORED RULE WORD — set on EVERY reported pair, not only the scored one */
  ruleConjunct: string | null; ruleWord: string | null;
}
const pairedDelta = (
  key: string, pairKey: PairKey, looRule: ((d: Iv) => boolean) | null,
): DeltaRow => {
  const p = PAIRS.find((x) => x.key === pairKey)!;
  const f = FACES[key];
  const nuS = cells.map((c) => f.num(c.rows[p.lo]));
  const deS = cells.map((c) => f.dn(c.rows[p.lo]));
  const nuA = cells.map((c) => f.num(c.rows[p.hi]));
  const deA = cells.map((c) => f.dn(c.rows[p.hi]));
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
  /* ⭐ LOO sensitivity (the #346/#348 orders), the CONSERVATIVE POINT-SHIFT form, STATED */
  const totNuS = sum(nuS); const totDeS = sum(deS);
  const totNuA = sum(nuA); const totDeA = sum(deA);
  let maxInf = 0; let flips = 0;
  for (let i = 0; i < cells.length; i++) {
    const dLoo = ratio(totNuA - nuA[i], totDeA - deA[i]) - ratio(totNuS - nuS[i], totDeS - deS[i]);
    const inf = Math.abs(dLoo - point);
    if (inf / Math.max(Math.abs(point), 1e-12) > maxInf) {
      maxInf = inf / Math.max(Math.abs(point), 1e-12);
    }
    if (looRule !== null && Number.isFinite(dLoo)) {
      const shift = dLoo - point;
      if (looRule({ ciLo: lo, ciHi: hi }) !== looRule({ ciLo: lo + shift, ciHi: hi + shift })) {
        flips += 1;
      }
    }
  }
  const rf = RULE_OF_FACE[key];
  return {
    key, pair: pairKey, loArm: p.lo, hiArm: p.hi,
    loValue: pS, hiValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlips: flips, looScored: looRule !== null,
    ruleConjunct: rf === undefined ? null : rf.conjunct,
    ruleWord: rf === undefined ? null : rf.word({ ciLo: lo, ciHi: hi }),
  };
};

/** ⭐ LOO is COUNTED on: every SCORED Δ (the five conjuncts of E3 − E1), the DOSED (a) Δ (the
 *  entry read is cut on it) and the E1 − E0 goals Δ (the goals story's read) — #380 item 6(v). */
const LOO_KEYS = new Set<string>([
  ...RULED_FACES.map((k) => `E3E1|${k}`),
  'D3D0|contact.ownTargetSideBackShare',
  'E1E0|goalsPerMatch',
]);
const deltas: DeltaRow[] = [];
for (const p of PAIRS) {
  for (const key of FACE_KEYS) {
    const rf = RULE_OF_FACE[key];
    const wantLoo = LOO_KEYS.has(`${p.key}|${key}`) && rf !== undefined;
    deltas.push(pairedDelta(key, p.key, wantLoo ? rf.rule : null));
  }
}
const delta = (pairKey: string, k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k && x.pair === pairKey);
  if (d === undefined) { banner(`RC-T1B FATAL — unknown delta ${pairKey}.${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 H-RC.2 — THE FROZEN RULES APPLIED; THE VERDICT WORD IS PRINTED BY THEM   */
/* ========================================================================== */
const SCORED_PAIR = 'E3E1';
const dA = delta(SCORED_PAIR, 'contact.ownTargetSideBackShare');
const dB = delta(SCORED_PAIR, 'contact.opponentFirstContactShare');
const dC1 = delta(SCORED_PAIR, 'goalsPerMatch');
const dC2 = delta(SCORED_PAIR, 'passCompletion');
const dC3 = delta(SCORED_PAIR, 'interceptionsPerMatch');
const A_VERDICT = WORD_A(dA);
const B_VERDICT = WORD_B(dB);
const C1_VERDICT = WORD_C1(dC1);
const C2_VERDICT = WORD_C2(dC2);
const C3_VERDICT = WORD_C3(dC3);
const A_OK = A_VERDICT === 'FALLS';
const B_OK = B_VERDICT === 'DOES-NOT-RISE';
const C_OK = C1_VERDICT === 'WITHIN-BAND' && C2_VERDICT === 'DOES-NOT-FALL'
  && C3_VERDICT === 'DOES-NOT-RISE';
const H_RC2: 'PASS' | 'FAIL' = A_OK && B_OK && C_OK ? 'PASS' : 'FAIL';

/* ========================================================================== */
/* §14b THE PRE-COMMITTED READS — FROZEN LITERALS, SELECTED ON STORED BOOLEANS  */
/* ========================================================================== */
/** ⭐⭐ #380 item 6(vii)'s sentences, FROZEN AS LITERALS at the freeze commit. ⛔ Selection is
 *  on stored booleans only; NO tie-break is ever invented after sight. */
const READ_PASS = 'RC-T1b BANKS; THE RC ENTRY CANDIDATE FORMS — world 13 = world 12 + '
  + 'bfFacingCost + rcAnticipate + rcReady (the gene born absent, evolvable) — gated on the '
  + 'user\'s world-12 verdict and read WITH the dosed pair.';
const READ_A_FAILS = 'THE READY LIMB DOES NOT TURN THE RECEIVER ON THE PITCH — THE FORM '
  + 'RETURNS TO THE COMMANDER WITH THE COVERAGE NUMBERS FIRST.';
const READ_BC_FAILS = 'THE DOOR COSTS FOOTBALL — THE ARC PAUSES AT THE USER\'S FORK.';
const READ_DOSED_MOVES = 'THE DOSED WORLD MOVES — the entry candidate is LIVE in the form the '
  + 'user plays.';
const READ_DOSED_STILL = 'THE DOSED WORLD DOES NOT MOVE ON THE USER\'S THIRD SENTENCE — no '
  + 'entry yet; the commander decides with numbers.';
const READ_DOSED_UNRESOLVED = 'THE DOSED READ IS UNRESOLVED — the commander decides with '
  + 'numbers.';
const READ_GOALS_UP = 'THE PRICE ADDS GOALS RESOLVEDLY ON A SECOND BLOCK — the per-shot '
  + 'keeper read is the commander\'s.';
const READ_GOALS_DOWN = 'THE PRICE REMOVES GOALS RESOLVEDLY ON A SECOND BLOCK.';
const READ_GOALS_FLAT = 'THE GOALS LEAN IS NOT RESOLVED ON A SECOND BLOCK.';

/** THE ENTRY QUESTION, on D3 − D0 (the dosed pair) */
const dDosedA = delta('D3D0', 'contact.ownTargetSideBackShare');
const dDosedC1 = delta('D3D0', 'goalsPerMatch');
const dDosedC2 = delta('D3D0', 'passCompletion');
const dDosedC3 = delta('D3D0', 'interceptionsPerMatch');
const DOSED_A_FALLS = RULE_A(dDosedA);
const DOSED_C_HOLDS = RULE_C1(dDosedC1) && RULE_C2(dDosedC2) && RULE_C3(dDosedC3);
const DOSED_A_CONTAINS_ZERO = dDosedA.containsZero;
const ENTRY_READ = DOSED_A_FALLS && DOSED_C_HOLDS ? READ_DOSED_MOVES
  : DOSED_A_CONTAINS_ZERO ? READ_DOSED_STILL : READ_DOSED_UNRESOLVED;
/** THE GOALS STORY, on E1 − E0 (the price alone, on a SECOND block) */
const dPriceGoals = delta('E1E0', 'goalsPerMatch');
const GOALS_READ = dPriceGoals.ciLo > 0 ? READ_GOALS_UP
  : dPriceGoals.ciHi < 0 ? READ_GOALS_DOWN : READ_GOALS_FLAT;

const READS_PRINTED: string[] = [
  ...(H_RC2 === 'PASS' ? [READ_PASS] : []),
  ...(!A_OK ? [READ_A_FAILS] : []),
  ...(!(B_OK && C_OK) ? [READ_BC_FAILS] : []),
  ENTRY_READ,
  GOALS_READ,
];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form, from THIS exam's own scratch smoke   */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** ⭐ THE SCRATCH SMOKE's own realised PAIRED-Δ half-widths (12 seeds, 900,002,700–711;
 *  §DEV-PREFLIGHT), read out of the smoke artifact's own `deltas[].halfWidth` fields —
 *  NEVER re-typed from the console's rounded print. HARDCODED here at the FREEZE COMMIT.
 *  ⭐ (a) and (b) have NO externally given target: their DECLARED TARGET is the MDE THE SMOKE
 *  PROJECTS AT N_FROZEN, ROUNDED UP TO 6 dp (#380 item 6(ii): "MDE declared from the
 *  smoke"; rounding UP keeps the declared target CONSERVATIVE and inside the block). N_FROZEN is
 *  therefore THE LARGEST THE BLOCK AFFORDS (997) — which is what MINIMISES those two MDEs —
 *  and the three externally-targeted rows (345 / 380 / 129 required) all sit inside it. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'contact.ownTargetSideBackShare', group: '(a)',
    hwSmoke: 0.04081893903533648, target: 0.006402 },
  { face: 'contact.opponentFirstContactShare', group: '(b)',
    hwSmoke: 0.04326319522980754, target: 0.006785 },
  { face: 'goalsPerMatch', group: '(c1)', hwSmoke: 1.125, target: TARGET_C1_BAND },
  { face: 'passCompletion', group: '(c2)',
    hwSmoke: 0.039334753021781244, target: 0.010 },
  { face: 'interceptionsPerMatch', group: '(c3)',
    hwSmoke: 2.291666666666666, target: TARGET_C3_INTERCEPTIONS },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  const hwRealised = delta(SCORED_PAIR, r.face).halfWidth;
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    mdeAtRealisedHw: hwRealised * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.mdeAtRealisedHw));

/* ========================================================================== */
/* §16 ⭐ THE SEASON LADDER — REPORTED, GATED BY NOTHING (RC-T1a §P.E's house form) */
/* ========================================================================== */
/**
 * ⭐⭐ #380 item 6(iv): the ladder's MATCH is THE E3 WORLD (world 12 + `bfFacingCost` +
 * `rcAnticipate` + `rcReady`, EMPTY-BOOK) in BOTH ladder arms, so the door is open in both and
 * the only question is whether selection CARRIES the gene when the turn has a price.
 *   · `geneAbsent`    — `evolveReceiverAnticipation` FALSE: the gene stays STRUCTURALLY ABSENT
 *     for every generation. THE CONTROL (with the neutral-drift shadow riding it).
 *   · `geneEvolvable` — TRUE: the gene may enter ONLY through the SHIPPED `mutateGenome` /
 *     `crossoverGenomes` opt-in path. ⛔ NOTHING IS PRE-SEEDED; NO VALUE IS EVER SET BY HAND.
 * ⛔ REPORTED, GATED BY NOTHING AS FOOTBALL: no H-RC.2 conjunct reads a ladder number.
 */
const LADDER_ARMS = ['geneAbsent', 'geneEvolvable'] as const;
type LadderArm = (typeof LADDER_ARMS)[number];
const LADDER_TEAMS = MODE === 'smoke' ? 4 : 8;
const LADDER_GENS = MODE === 'smoke' ? 2 : 10;
const LADDER_ELITE_N = 2;
const LADDER_REBORN_N = 2;
const MUT_RATE = 0.4;
const MUT_SCALE = 0.08;
const REBORN_RATE = 0.5;
const REBORN_SCALE = 0.15;
const EARLY_GENS = Math.min(3, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - 2);
interface LadderTeam { slot: number; genome: TacticalGenome }
interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; passes: number; passesCompleted: number; interceptions: number;
  preCuedArms: number;
  geneMean: number; geneMax: number;
  genePresentShare: number; geneAboveZeroShare: number;
  driftMean: number | null;
  doorChecked: number; doorWrong: number; franchiseDirty: number;
  wallSeconds: number;
}
const ladderMatch = (seed: number, ga: TacticalGenome, gb: TacticalGenome): Match => {
  const ta = teamInfo('A', seed * 2 + 1);
  const tb = teamInfo('B', seed * 2 + 2);
  const m = new Match({
    seed,
    teamA: { ...ta, genome: ga },
    teamB: { ...tb, genome: gb },
    ...a4MatchFlags(RA_WORLD_VERSION),
    bfFacingCost: true, rcAnticipate: true, rcReady: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, RA_WORLD_VERSION);
  return m;
};
const runLadderArm = (arm: LadderArm, leagueSeed: number): LadderCell[] => {
  const opts = { evolveReceiverAnticipation: arm === 'geneEvolvable' };
  const evoRng = new Rng(hashSeed(leagueSeed, 0xe1));
  const driftRng = new Rng(hashSeed(leagueSeed, 0xd8));
  const initRng = new Rng(leagueSeed);
  let pop: LadderTeam[] = Array.from({ length: LADDER_TEAMS }, (_, slot) => ({
    slot, genome: randomGenome(initRng),
  }));
  let shadow: number[] | null = arm === 'geneAbsent'
    ? new Array<number>(LADDER_TEAMS).fill(0) : null;
  const out: LadderCell[] = [];
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const tGen = Date.now();
    const points = new Array<number>(LADDER_TEAMS).fill(0);
    const gd = new Array<number>(LADDER_TEAMS).fill(0);
    const acc = { goals: 0, shots: 0, passes: 0, passesCompleted: 0, interceptions: 0,
      preCuedArms: 0 };
    let matches = 0; let doorChecked = 0; let doorWrong = 0; let franchiseDirty = 0;
    let idx = 0;
    for (let a = 0; a < LADDER_TEAMS; a++) {
      for (let b = a + 1; b < LADDER_TEAMS; b++) {
        /** the per-match seed is DERIVED through the SHIPPED `hashSeed`, exactly as
         *  `League.createMatch` derives its fixture seeds from the league's own seed */
        const seed = hashSeed(leagueSeed, gen, idx, 0xdc);
        idx += 1;
        const m = ladderMatch(seed, pop[a].genome, pop[b].genome);
        const mf = m as unknown as {
          bfFacingCost: boolean; rcAnticipate: boolean; rcReady: boolean;
        };
        doorChecked += 1;
        if (raArmedVersion(m) !== RA_WORLD_VERSION || mf.bfFacingCost !== true
          || mf.rcAnticipate !== true || mf.rcReady !== true) doorWrong += 1;
        for (const side of [0, 1] as const) {
          const fr = m.teams[side].info.genome as TacticalGenome;
          if (fr.raAccessWeight !== undefined || fr.passLeadSupport !== undefined
            || fr.dvExposureWeight !== undefined) franchiseDirty += 1;
          if (arm === 'geneAbsent' && fr.rcAnticipationWeight !== undefined) franchiseDirty += 1;
        }
        while (!m.finished) m.step(DT);
        const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
        matches += 1;
        acc.goals += st[0].goals + st[1].goals;
        acc.shots += st[0].shots + st[1].shots;
        acc.passes += st[0].passes + st[1].passes;
        acc.passesCompleted += st[0].passesCompleted + st[1].passesCompleted;
        acc.interceptions += st[0].interceptions + st[1].interceptions;
        const pcl = (m as unknown as { pcLatency: { ledger: { preCuedArms: number } } | null })
          .pcLatency;
        if (pcl !== null) acc.preCuedArms += pcl.ledger.preCuedArms;
        const ga = st[0].goals;
        const gb2 = st[1].goals;
        gd[a] += ga - gb2; gd[b] += gb2 - ga;
        if (ga > gb2) points[a] += 3; else if (gb2 > ga) points[b] += 3;
        else { points[a] += 1; points[b] += 1; }
      }
    }
    const fitness = pop.map((t) => points[t.slot] * 100 + gd[t.slot]);
    const vals = pop.map((t) => t.genome.rcAnticipationWeight ?? 0);
    out.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, passes: acc.passes,
      passesCompleted: acc.passesCompleted, interceptions: acc.interceptions,
      preCuedArms: acc.preCuedArms,
      geneMean: round(mean(vals), 8), geneMax: round(Math.max(0, ...vals), 8),
      genePresentShare: round(pop.filter((t) => t.genome.rcAnticipationWeight !== undefined)
        .length / LADDER_TEAMS, 6),
      geneAboveZeroShare: round(vals.filter((v) => v > 0).length / LADDER_TEAMS, 6),
      driftMean: shadow === null ? null : round(mean(shadow), 8),
      doorChecked, doorWrong, franchiseDirty,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    if (gen === LADDER_GENS) break;
    /* selection: `evolveGroup`'s band law, mirrored (the RC-T1a §16 anchors) */
    const order = [...pop].sort((x, y) => fitness[y.slot] - fitness[x.slot] || x.slot - y.slot);
    const pool = order.slice(0, 4);
    const pickParent = (exclude?: LadderTeam): LadderTeam => {
      const cands = pool.filter((f) => f !== exclude);
      const weights = cands.map((f) => 4 - pool.indexOf(f));
      const totalW = weights.reduce((x, y) => x + y, 0);
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
            pa.genome, pb.genome, evoRng,
            false, false, false, false, false, false, false, false, false, false,
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
  return out;
};
const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
banner(`RC-T1B — the SEASON LADDER: ${LADDER_ARMS.length} arms × ${LADDER_SEEDS.length} leagues `
  + `× ${LADDER_GENS} generations × ${(LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2} fixtures`);
for (const larm of LADDER_ARMS) {
  for (const ls of LADDER_SEEDS) {
    ladderCells.push(...runLadderArm(larm, ls));
    banner(`  … ladder ${larm} league ${ls} done (${round((Date.now() - tLadder0) / 1000, 1)} s)`);
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
const ladderByGeneration = LADDER_ARMS.flatMap((larm) => Array
  .from({ length: LADDER_GENS }, (_, i) => i + 1).map((gen) => {
    const cs = ladderCells.filter((c) => c.arm === larm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    return {
      arm: larm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt), 6),
      shotsPerMatch: round(ratio(sum(cs.map((c) => c.shots)), mt), 6),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)),
        sum(cs.map((c) => c.passes))), 6),
      interceptionsPerMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt), 6),
      preCuedArmsPerMatch: round(ratio(sum(cs.map((c) => c.preCuedArms)), mt), 6),
      geneMean: round(mean(cs.map((c) => c.geneMean)), 8),
      geneMax: round(Math.max(0, ...cs.map((c) => c.geneMax)), 8),
      genePresentShare: round(mean(cs.map((c) => c.genePresentShare)), 6),
      geneAboveZeroShare: round(mean(cs.map((c) => c.geneAboveZeroShare)), 6),
      driftMean: cs.every((c) => c.driftMean === null) ? null
        : round(mean(cs.map((c) => c.driftMean ?? 0)), 8),
      unit: 'per-generation league aggregate (goals/shots per match on the 240 s match clock; '
        + 'gene levels are league-mean rcAnticipationWeight in [0,1])',
    };
  }));
const ladderGeneSlopes = LADDER_ARMS.map((larm) => {
  const perLeague = LADDER_SEEDS.map((ls) => {
    const cs = ladderCells.filter((c) => c.arm === larm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    return {
      leagueSeed: ls,
      earlyGeneMean: round(mean(early.map((c) => c.geneMean)), 8),
      lateGeneMean: round(mean(late.map((c) => c.geneMean)), 8),
      earlyGoalsPerMatch: round(ratio(sum(early.map((c) => c.goals)),
        sum(early.map((c) => c.matches))), 6),
      lateGoalsPerMatch: round(ratio(sum(late.map((c) => c.goals)),
        sum(late.map((c) => c.matches))), 6),
    };
  });
  return {
    arm: larm, perLeague,
    geneDelta: round(mean(perLeague.map((p) => p.lateGeneMean - p.earlyGeneMean)), 8),
    goalsDelta: round(mean(perLeague.map((p) => p.lateGoalsPerMatch - p.earlyGoalsPerMatch)), 6),
  };
});
const LADDER_CLEAN = ladderCells.every((c) => c.doorWrong === 0 && c.franchiseDirty === 0);
const LADDER_LIVE = ladderCells.some((c) => c.arm === 'geneEvolvable' && c.genePresentShare > 0);
/** the ladder's own headline cells, for the doc's §R7 (⛔ REPORTED, never a gate) */
const ladderFinal = LADDER_ARMS.map((larm) => {
  const g = ladderByGeneration.find((x) => x.arm === larm && x.generation === LADDER_GENS)!;
  const s = ladderGeneSlopes.find((x) => x.arm === larm)!;
  return { arm: larm, genePresentFinal: g.genePresentShare, geneMeanFinal: g.geneMean,
    geneMaxFinal: g.geneMax, goalsPerMatchFinal: g.goalsPerMatch, goalsDelta: s.goalsDelta,
    geneDelta: s.geneDelta };
});
const LADDER_GOALS_SLOPE_VS_CONTROL = round(
  (ladderFinal.find((x) => x.arm === 'geneEvolvable')!.goalsDelta)
  - (ladderFinal.find((x) => x.arm === 'geneAbsent')!.goalsDelta), 6);

/* ========================================================================== */
/* §17 THE GATES — liveness / receipt ONLY, NEVER direction; all stored         */
/* ========================================================================== */
const allRows: Row[] = [...ARMS.flatMap((a) => armRows(a)), ...ARMS.map((a) => receiptRows[a])];
const rowsOf = (arm: Arm): Row[] => [...armRows(arm), receiptRows[arm]];
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const totOf = (arm: Arm, pick: (r: Row) => number): number => sum(rowsOf(arm).map(pick));
const scoredDeltas = deltas.filter((d) => d.looScored);
const LOO_OK = scoredDeltas.length === LOO_KEYS.size
  && scoredDeltas.every((d) => Number.isInteger(d.looFlips) && d.looFlips >= 0);
const RULE_WORD_ROWS = deltas.filter((d) => d.ruleWord !== null);
const RULE_WORDS_OK = RULE_WORD_ROWS.length === PAIRS.length * RULED_FACES.length
  && RULE_WORD_ROWS.every((d) => {
    const rf = RULE_OF_FACE[d.key];
    return rf !== undefined && d.ruleWord === rf.word({ ciLo: d.ciLo, ciHi: d.ciHi })
      && d.ruleConjunct === rf.conjunct;
  });
const subsTotal = (arm: Arm): number => totOf(arm, (r) => r.substitutions);
const subsRightDepth = (arm: Arm): number => totOf(arm, (r) => r.subsSeenWithRightDepth);
const READY_ARMED = ['E3', 'D3'] as const;
const READY_SHUT = ['E0', 'E1', 'E2', 'D0'] as const;
const PRECUE_ARMED = ['E2', 'E3', 'D3'] as const;
const PRECUE_SHUT = ['E0', 'E1', 'D0'] as const;
const BODY_SCHEMA = [
  'stage', 'arms', 'definitions', 'doseSource', 'anchoredSites', 'fixtures', 'lockstep',
  'armsDiverge', 'sizing', 'gates', 'faces', 'deltas', 'hRC2', 'precommittedReads',
  'ladder', 'bins', 'roles', 'contactClasses', 'sectors', 'outcomes', 'seeds', 'stats',
  'perf', 'honestLimits',
] as const;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: allRows.every((r) => r.worldOk) && allRows.every((r) => r.depthAlwaysOk),
    note: `⭐ on EVERY walked match of ALL ${ARMS.length} arms (plus the construction receipt): `
      + `\`raArmedVersion\` = ${RA_WORLD_VERSION}; the THREE construction flags match their OWN `
      + 'arm ('
      + ARMS.map((a) => `${a} bf=${wantsBf(a)}/anticipate=${wantsAnticipate(a)}/`
        + `ready=${wantsReady(a)}`).join(' · ')
      + '); the GENE is ABSENT on E0/E1/D0 and === 1 on E2/E3/D3 ON BOTH VIEWS (`effGenome` '
      + 'AND `baseGenome`) OF BOTH TEAMS, with world 12\'s own two RA pins carried forward; and '
      + 'EVERY body carries its arm\'s declared `facingDepth` AT KICKOFF and AT EVERY OBSERVED '
      + 'TICK — ' + ARMS.map((a) => `${a} = ${DEPTH_OF[a]}`).join(' · ')
      + '. Substitutions OBSERVED: '
      + ARMS.map((a) => `${a} ${subsRightDepth(a)}/${subsTotal(a)}`).join(' · ')
      + ' (identity changes in a pitch slot, each seen carrying its arm\'s depth — the SHIPPED '
      + 'writer alone holds it; this exam writes nothing). ⭐ every count in this note is '
      + 'DERIVED from the same rows the gate checks (canon: gate notes derive)',
  },
  gGenomeClean: {
    ok: allRows.every((r) => r.genomeClean),
    note: '⛔ the FRANCHISE genome (`info.genome`) carries NO exam gene and NO facing/flag key '
      + 'on any walked match — canon: dose placement (ruling #270.2 / #334 item 1). ⭐⭐ THE '
      + 'GENE IS WRITTEN ONLY ON MATCH-LOCAL SPREAD COPIES of `baseGenome` / `effGenome` '
      + '(RC-T1a\'s idiom, itself copied from the shipped `setRaGenes`), and `info.genome` is '
      + 'NEVER TOUCHED',
  },
  gDoseSource: {
    ok: DOSE_BYTES_MATCH && DOSED_ARM_REACHABLE
      && L3_DOSE_BYTES_SHA.length === 64 && PC_DOSE_BYTES_SHA.length === 64,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arms take their doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`, CALLED, exactly as PT-C0 arm A did); this gate HASHES '
      + `the bytes read from ${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them to the two `
      + 'PINNED expected values READ OF RECORD from PT-C0\'s own artifact `doseSource.files`. '
      + `Pooled: ${L3_CELLS_POOLED} L3 cells, ${PC_ROWS_POOLED} PC rows, both NON-EMPTY. `
      + '⛔ On any mismatch the instrument REFUSES TO RUN — a dose is never approximated',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} anchored sites matched at `
      + 'their EXACT expected occurrence counts with 1-based line receipts stored. Extracted '
      + `values in play: BF_OFF_HEADING_FRACTION ${BF_OFF_HEADING_FRACTION} · BF_DEPTH `
      + `${BF_DEPTH} · PC_TIER_CHOICE_TICKS ${PC_TIER_CHOICE_TICKS} · PTP_FLIGHT_SPEED `
      + `${PTP_FLIGHT_SPEED} · TURN_RATE ${TURN_RATE} · ACCEL ${ACCEL} · DT ${DT} · `
      + `AI_INTERVAL ${AI_INTERVAL} · MATCH_DURATION ${MATCH_DURATION} · CONTROL_RADIUS `
      + `${CONTROL_RADIUS} · DUP_RUN_M ${DUP_RUN_M} · SAMPLE_EVERY ${SAMPLE_EVERY} · roles `
      + `[${ROLES.join(', ')}] · sectors [${SECTORS.join(', ')}]. PINNED SITES: the BK `
      + '`BodySector` CLASSIFIER (the (a) face\'s whole definition of SIDE and BACK); the '
      + 'READY limb\'s public surface (the ONE `rcReady` fork, the overlay write, the TRADE\'s '
      + 'cost form and strict `>`, the COPIED face, the PC-hold override BELOW it, the two '
      + 'overlay fields at their own home, the holds map and its liveness comment); '
      + '`RC_S_RECEIVE` at its one home; the 3a seam\'s read and its ledger counter; the BF '
      + 'law\'s two constants, two pure functions and shipped writer; the shipped 0.5 m/s '
      + 'moving floor; RC-T1a\'s gap lines (the `interceptBall` account, the flight law, the '
      + 'wind-up tick indexing, the strike gate); the DF 乱跑 definition lines; the E4 lines; '
      + 'and PT-C0\'s two A4 constants. ⭐ every value in this note is DERIVED from the same '
      + 'pinned sites the gate checks (canon: gate notes derive)',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures: the BK sector classifier CALLED on constructed geometries (including the '
      + '44°/46°/136° boundary cases) and the SIDE-or-BACK predicate; the first-contact '
      + 'classes and the delivery / ground / measurable predicates; the outcome ladder; the φ '
      + 'arithmetic and both stored-bin cuts; THE PER-SHOT WINDOW ARITHMETIC on a constructed '
      + `${PC_TIER_CHOICE_TICKS}-tick buffer (only the last ${PC_TIER_CHOICE_TICKS} entries `
      + 'count; no moving tick ⇒ NaN, never 0); THE READY "APPLIED" PREDICATE on constructed '
      + 'states (a live hold is not applied, an expired one is, a null or shifted face is '
      + 'not); the BF coverage and the READY COST recomputations on constructed states; THE '
      + 'PAIRED Δ ARITHMETIC on a constructed two-seed table; the A4 spacing / dup-run / '
      + 'min-pairwise limbs; the gap account\'s margin / meetable / predicted-arrival '
      + 'fixtures; and the bin helpers',
  },
  gRuleWords: {
    ok: RULE_WORDS_OK,
    note: '⭐⭐ canon, VERBATIM: "a counterfactual verdict sentence (\'had X been scored, the '
      + 'rule would read W\') quotes a word the instrument STORED by applying the frozen rule '
      + 'to X\'s stored interval; a universal sentence about a table (\'every bin\', \'the one '
      + `bin') is a stored boolean or is not written". THE FIVE FROZEN RULES ARE APPLIED TO `
      + `EVERY ONE OF THE ${PAIRS.length} REPORTED PAIRS on each of the ${RULED_FACES.length} `
      + `ruled faces and the resulting WORD IS STORED beside the interval: `
      + `${RULE_WORD_ROWS.length} stored words, each RE-DERIVED here from its own stored `
      + '`ciLo`/`ciHi` by the same frozen rule. ⛔ ONLY THE SCORED PAIR IS SCORED — a stored '
      + 'word on a reported pair is a READING AID, never a verdict',
  },
  gArmsDiverge: {
    ok: ARMS_DIVERGE,
    note: '⭐ the RECEIPT that the door demonstrably bites, PER PAIR: '
      + divergeByPair.map((r) => `${r.pair} diverged on ${r.diverged.length}/`
        + `${LOCKSTEP_SEEDS.length} scratch seeds`).join(' · ')
      + '. ⚠ SOME, not EVERY (#364 item 1\'s reading) — a match in which nothing ever fires may '
      + 'walk BYTE-IDENTICALLY in both arms, which is LEGAL. ⭐ ONLY THE SCORED PAIR (E3 − E1) '
      + 'IS GATED; the other five pairs are REPORTED whatever they are. An INSTRUMENT receipt, '
      + 'never a finding',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((a) => totOf(a, (r) => r.gpFlights) > 0
      && totOf(a, (r) => r.recvSectorN) > 0
      && totOf(a, (r) => r.firstContactSectorN) > 0
      && totOf(a, (r) => r.stats.shots) > 0
      && totOf(a, (r) => r.shotEvents) > 0
      && totOf(a, (r) => r.movingTicks) > 0
      && totOf(a, (r) => r.minPairN) > 0
      && totOf(a, (r) => r.defenderTicks) > 0
      && totOf(a, (r) => r.readyPopTicks) > 0
      && totOf(a, (r) => r.gapN[GG('meetableCarried')]) > 0
      && ROLES.every((_, ro) => totOf(a, (r) => r.roleMovingTicks[ro]) > 0))
      && READY_ARMED.every((a) => totOf(a, (r) => r.readyOverlayTicks) > 0
        && totOf(a, (r) => r.readyAppliedTicks) > 0)
      && READY_SHUT.every((a) => totOf(a, (r) => r.readyOverlayTicks) === 0
        && totOf(a, (r) => r.readyAppliedTicks) === 0)
      && PRECUE_ARMED.every((a) => totOf(a, (r) => r.preCuedArms) > 0)
      && PRECUE_SHUT.every((a) => totOf(a, (r) => r.preCuedArms) === 0)
      && (['E1', 'E2', 'E3', 'D3'] as const)
        .every((a) => totOf(a, (r) => r.covApplied) > 0)
      && (['E0', 'D0'] as const).every((a) => totOf(a, (r) => r.covApplied) === 0),
    note: '⛔ no face on an empty cell: in EVERY arm the measured ground-pass population, the '
      + 'completed-pass facing sample, the OWN-TARGET first-contact sample, the shot counter '
      + 'AND the per-shot event population, the moving population, EVERY ROLE, the crowd '
      + 'sample, the defender population, the READY denominator and the meetable-carried gap '
      + 'population are all LIVE. ⭐⭐ AND THE DOORS ARE WHERE THEY ARE DECLARED: the READY '
      + 'coverage (overlay AND applied) is NON-EMPTY on E3/D3 and EXACTLY ZERO on E0/E1/E2/D0; '
      + '`preCuedArms` > 0 on E2/E3/D3 and EXACTLY 0 on E0/E1/D0; the BF coverage is non-empty '
      + 'on E1/E2/E3/D3 and EXACTLY 0 on E0/D0 (`facingDepth` 0 ⇒ the factor is identically '
      + '1). Liveness BOTH WAYS, never direction',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THERE IS NO WRAPPER AT ALL and THIS EXAM WRITES NOTHING: observation is pure '
      + `per-tick reads of Match state, and ${lockstepRows.length} observed-vs-unobserved `
      + `arm-walks on out-of-band scratch (${LOCKSTEP_SEEDS.join(', ')}) are BYTE-IDENTICAL. `
      + '⭐ the private PC holds map is read with a PURE `Map.get`; the MUTATING `holdFor` '
      + 'accessor (which DELETES expired holds) is never called — canon: verifier scratch seeds',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: '⛔ X-SRC-ZERO: worktree-vs-HEAD over `src/` EMPTY BOTH WAYS (canon: xSrcUntouched — '
      + '`git diff --stat HEAD -- src` AND `git status --porcelain -- src`). Every seam under '
      + 'exam is already in the tree with its own pin suite (BF-T0 +FIX · RC-T0 · RC-T0b +FIX)',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && !walkedSeeds.includes(RECEIPT_SEED)
        && LADDER_SEEDS.every((s) => inBlock(s) && !walkedSeeds.includes(s))
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: `BOOKED = WALKED: ${walkedSeeds.length} battery seeds, each walked EXACTLY ONCE PER `
      + `ARM (${ARMS.length} arms) plus the construction-receipt seed ${RECEIPT_SEED} in all `
      + `${ARMS.length} arms = ${walksBooked} walks. THE BLOCK'S OWN PARTITION, disjoint by `
      + `construction: battery ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]} · `
      + `ladder leagues ${LADDER_SEEDS.join(', ')} (every ladder MATCH seed DERIVED through the `
      + `SHIPPED \`hashSeed\`) · receipt ${RECEIPT_SEED}. Lockstep on OUT-OF-BAND scratch `
      + `(${LOCKSTEP_SEEDS.join(', ')}); the sizing smoke on scratch 900,002,700–711 — canon: `
      + 'verifier scratch seeds',
  },
  gN: {
    ok: SIZING_OK && N_FROZEN <= N_MAX_SEEDS && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? `THE OVERRIDE ARM: declared (${OVERRIDE_REASONS.join(', ')}), n = ${cells.length} as `
        + 'declared, artifact off every canonical path'
      : 'THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = '
        + `${N_FROZEN} shared seeds — the LARGEST the block affords once the ladder's two `
        + 'league seeds and the construction receipt are reserved. What the block CANNOT '
        + 'resolve is DECLARED in the sizing table',
  },
  gLOO: {
    ok: LOO_OK,
    note: '⭐ LOO flip counts (the #346/#348 orders) on the FIVE SCORED Δ, on the DOSED (a) Δ '
      + '(the entry read is cut on it) and on the E1 − E0 goals Δ (the goals story\'s read): '
      + scoredDeltas.map((d) => `${d.pair}.${d.key} = ${d.looFlips}`).join(' · ')
      + '. ⚠ the flip read uses the CONSERVATIVE POINT-SHIFT form (the interval translated by '
      + 'the dropped seed\'s influence on the POINT) — stated, never hidden',
  },
  gLadder: {
    ok: LADDER_CLEAN && LADDER_LIVE,
    note: '⭐ THE SEASON LADDER IS REPORTED AND GATES NOTHING AS FOOTBALL — this gate is a '
      + `PLUMBING receipt only: on all ${ladderCells.length} ladder cells the E3 WORLD was `
      + 'armed in BOTH arms (world 12 + `bfFacingCost` + `rcAnticipate` + `rcReady`; '
      + `${sum(ladderCells.map((c) => c.doorWrong))} wrong doors of `
      + `${sum(ladderCells.map((c) => c.doorChecked))} checked), the FRANCHISE genome stayed `
      + `clean (${sum(ladderCells.map((c) => c.franchiseDirty))} dirty), and the gene DID `
      + 'enter the evolvable arm through the SHIPPED mutate/crossover opt-in with NOTHING '
      + 'pre-seeded and NO value ever set by hand. ⛔ No H-RC.2 conjunct reads a ladder number',
  },
};

/* ========================================================================== */
/* §18 THE ARTIFACT — per-seed × per-arm cells, stored bins, the allowlist body */
/*     COMPACT JSON — canon, VERBATIM: "an artifact is written as compact JSON — no            */
/*     indentation; the hash is over the canonical body regardless; pretty-printing is a       */
/*     reader's tool, not a storage form" (home: ruling #372 item 5)                           */
/* ========================================================================== */
const pooled = (arm: Arm): {
  phiTicks: number[]; rolePhiTicks: number[][];
  contactClass: number[]; firstContactSector: number[]; receiverSector: number[];
  completedBySector: number[]; ownTargetContactsBySector: number[];
  readyBenefit: number[]; readyCost: number[]; keeperShotShare: number[];
  startDelayTicks: number[][]; gapDiffMetres: number[][];
  nearestMateMetres: number[]; minPairwiseMetres: number[];
} => {
  const ph = zeros(NPHI);
  const rp = zeros2(NROLE, NPHI);
  const cc = zeros(CONTACTS.length);
  const fcs = zeros(SECTORS.length);
  const rs = zeros(SECTORS.length);
  const cbs = zeros(SECTORS.length);
  const cbn = zeros(SECTORS.length);
  const rb = zeros(BENEFIT_BINS);
  const rc = zeros(COST_BINS);
  const ks = zeros(KSHARE_BINS);
  const sd = zeros2(NWG, SD_BINS);
  const gd = zeros2(NGG, CAL_BINS);
  const ne = zeros(NEAR_BINS);
  const mp = zeros(MINPAIR_BINS);
  for (const r of armRows(arm)) {
    addInto(ph, r.phiBins); addInto2(rp, r.rolePhiBins);
    addInto(cc, r.contactClass); addInto(fcs, r.firstContactSector);
    addInto(rs, r.recvSector);
    addInto(cbs, r.complBySector); addInto(cbn, r.complBySectorN);
    addInto(rb, r.readyBenefitBins); addInto(rc, r.readyCostBins);
    addInto(ks, r.shotShareBins);
    addInto2(sd, r.sdBins); addInto2(gd, r.gapDiffBins);
    addInto(ne, r.nearBins); addInto(mp, r.minPairBins);
  }
  return {
    phiTicks: ph, rolePhiTicks: rp, contactClass: cc, firstContactSector: fcs,
    receiverSector: rs, completedBySector: cbs, ownTargetContactsBySector: cbn,
    readyBenefit: rb, readyCost: rc, keeperShotShare: ks,
    startDelayTicks: sd, gapDiffMetres: gd,
    nearestMateMetres: ne, minPairwiseMetres: mp,
  };
};
const pooledByArm = Object.fromEntries(ARMS.map((a) => [a, pooled(a)])) as
  Record<Arm, ReturnType<typeof pooled>>;

/** ⭐ THE HONEST LIMITS — canon, VERBATIM: "a stage doc's HONEST LIMITS list is the ONE home;
 *  the artifact stores that list verbatim or stores none". ⇒ STORES NONE. */
const HONEST_LIMITS_NOTE = '⛔ NOT STORED HERE BY DESIGN. Canon, VERBATIM: "a stage doc\'s '
  + 'HONEST LIMITS list is the ONE home; the artifact stores that list verbatim or stores none" '
  + '(home: RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). '
  + 'THE ONE HOME: docs/world-model/RC-T1B-READY-EXAM.md §HONEST LIMITS.';

const artifact: Record<string, unknown> = {
  stage: {
    id: 'RC-T1b',
    title: 'THE READY EXAM — the user\'s own three sentences scored on the priced body',
    doc: 'docs/world-model/RC-T1B-READY-EXAM.md',
    contracts: ['docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3a / '
      + 'M-RC.3b (as amended at #379, banked at #380)',
    'docs/world-model/BF-BODY-FACING-CONTRACT.md §2 M-BF.4'],
    lineage: 'PT-C0 (the user\'s three sentences measured) → RC-T0 (3a, dormant) → RC-T1a (3a '
      + 'exam\'d) → RC-C0b (the pre-strike detector census) → BF-C0 / BF-T0 (+FIX) / BF-T1 (the '
      + 'facing price) → RC-T0b (+FIX) (3b, dormant, THE TRADE form) → this',
    authorizedBy: 'COMMANDER RULING #380 item 6',
    kind: 'EXAM — H-RC.2 is scored by the frozen §P.C rules ON THE SCORED PAIR ONLY (E3 − E1). '
      + 'The five other pairs and every other face are REPORTED, gated by nothing, each with '
      + 'the frozen rules\' WORDS STORED beside its intervals.',
    xSrcZero: '⛔ the exam instrument edits nothing under `src/`: every seam under exam landed '
      + 'with its own pin suite. THERE IS NO WRAPPER and NOT ONE WRITE OF ANY KIND — '
      + 'observation is pure per-tick reads of public Match / Player state (`gLockstep`), and '
      + 'the private PC holds map is consulted with a PURE `Map.get`.',
    shipsNothing: '⛔ THIS STAGE SHIPS NOTHING (Road B). World 12\'s composition and bytes are '
      + 'untouched; no world 13 is cut here; the user\'s play-test gate stays open.',
    receiptsAreNotEffectSizes: '⛔ the READY coverage, the recomputed cost, the 3a '
      + '`preCuedArms` ledger, the BF coverage and the substitution counts are ARMING PLUMBING '
      + 'and are NEVER quoted as football effect sizes (home: ruling #289 item 1 + '
      + 'BU-T1-MT-COMPOSITION.md §CORR item 5).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/rc-t1b-ready-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/rc-t1b-ready-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries([...SRC.entries()]
      .filter(([p]) => p.startsWith('src/')).map(([p, s]) => [p, sha(s)])),
    compactJson: '⭐ canon, VERBATIM: "an artifact is written as compact JSON — no indentation; '
      + 'the hash is over the canonical body regardless; pretty-printing is a reader\'s tool, '
      + 'not a storage form" (home: ruling #372 item 5).',
  },
  arms: Object.fromEntries(ARMS.map((a) => [a, {
    label: ARM_LABEL[a], facingDepth: DEPTH_OF[a],
    bfFacingCost: wantsBf(a), rcAnticipate: wantsAnticipate(a), rcReady: wantsReady(a),
    geneValue: wantsGene(a) ? RC_GENE_VALUE : null, dosed: isDosed(a),
  }])),
  definitions: {
    pairs: PAIRS.map((p) => ({ pair: p.key, lo: p.lo, hi: p.hi, scored: p.scored,
      form: p.form })),
    genePlacement: '⭐⭐ the gene is written MATCH-LOCAL on SPREAD COPIES of `baseGenome` and '
      + '`effGenome` (RC-T1a\'s idiom, copied from the shipped `setRaGenes`), AFTER '
      + '`armA4World`, so world 12\'s own two RA pins are carried forward. `info.genome` is '
      + 'NEVER written (canon: dose placement, ruling #270.2 / #334 item 1; `gGenomeClean`).',
    aFace: '⭐⭐ (a) 「球还打在他侧身上吗」: of every MEASURED GROUND PASS (PT-C0\'s own '
      + 'population — a `shortPass` / `throughBall` / `cutback` delivery launched on the '
      + 'ground with a named target), the share whose FIRST body contact after the release is '
      + 'the OWN TARGET with the ball meeting a SIDE or BACK sector. The sector is the BK '
      + 'law\'s OWN classifier (`ballAccessGeometry(...).sector`) CALLED with the target body '
      + 'and the ball AT THAT CONTACT TICK — never re-implemented.',
    bFace: '⭐⭐ (b) 「传到对面身上」: of the same population, the share whose FIRST body '
      + 'contact is an OPPONENT (PT-C0 (iii)\'s classes, reused byte for byte).',
    readyCoverage: '⭐⭐ THE READY COVERAGE — the population is every SAME-SIDE OFF-BALL '
      + 'open-play body-tick (a carrier exists, he is not me, he is my side, neither of us is '
      + 'sent off — the brain\'s own fork condition read off public state). OVERLAY = '
      + '`p.action.readyFaceGid` is set. APPLIED = the fix\'s own G-BITE predicate: overlay '
      + 'present ∧ NO PC hold live for that gid (a PURE `Map.get` on the private holds map; '
      + 'the hold is live while `simTick < untilTick`; the MUTATING `holdFor` is NEVER called) '
      + '∧ `p.faceTarget` EQUALS the carrier\'s PRE-STEP `pos` (the executor copied it '
      + 'mid-step, and the carrier has moved since). TURNED-TOWARD = the pre-step heading\'s '
      + 'projection on the bearing to the carrier ROSE across the step.',
    readyCostRead: '⭐⭐ THE RECOMPUTED COST IS A READ, DECLARED, WITH ITS PHASE. The '
      + 'executor\'s own form is `(1 − facingFactor(facingCosine(dir̂, bearinĝ), '
      + 'p.facingDepth)) · p.action.scores[0].score` with `dir` = that frame\'s `target − '
      + 'p.pos` AFTER both clamps. ⚠ `target` is a LOCAL of `executeAction` and is NOT public, '
      + 'so this read substitutes the body\'s PUBLIC `desiredVel` direction (the executor\'s '
      + 'intent for the step JUST TAKEN) for `dir̂`, and the carrier\'s PRE-STEP `pos` for the '
      + 'bearing origin. The depth, the priority and both shipped functions are the seam\'s '
      + 'own. ⛔ A PROXY and a receipt, never the seam\'s own float and never an effect size.',
    perShotKeeper: `⭐⭐ THE PER-SHOT KEEPER READ: a SHOT EVENT is an increment of a side's `
      + '`shots` counter. For each shot by side s, over the '
      + `${PC_TIER_CHOICE_TICKS} ticks STRICTLY BEFORE the shot tick (PC_TIER_CHOICE_TICKS, `
      + 'IMPORTED), the DEFENDING keeper\'s MISALIGNED SHARE on his MOVING ticks — moving = '
      + `|vel| > the shipped ${MOVING_FLOOR} m/s floor, misaligned = φ(heading, vel) > `
      + `${KEEPER_MIS_DEG}°. A shot whose defending keeper had ZERO moving ticks in the window `
      + 'has NO share and is its OWN published class — never imputed as 0. ⭐ THE GOAL '
      + 'ATTRIBUTION IS FROZEN AND NEEDS NO WINDOW CONSTANT: a `goals` increment for side s is '
      + 'attributed to the MOST RECENT still-open shot record of side s; a record closes as '
      + 'NO-GOAL when the same side shoots again, or at full time; goal increments are '
      + 'processed BEFORE the same tick\'s new shots. ⚠ THE PUBLISHED CONDITIONALS ARE '
      + 'ASSOCIATIONS, not causal claims — a keeper who is moving at all is in a different '
      + 'situation from one who is not.',
    gapFace: '⭐⭐ RC-T1a\'s `gap.meanDiffMetres.meetableCarried`, BYTE FOR BYTE: the wind-up '
      + 'population (a `pendingPassWindup` record observed from state), the ARM INSTANT (the '
      + 'record\'s own `aim` + `aimLead` as the elected point, so dMate = |aimLead|; the '
      + 'passer\'s position and the mate\'s `topSpeed` read at the END of the arm tick — ⚠ up '
      + 'to one tick of drift on the passer\'s position only), the MEETABLE predicate '
      + '(`interceptBall`\'s own time account, DX-C2 §P.A), and (MEASURED receiver→E distance '
      + 'at the tick the ball\'s along-line projection first reaches E) − (the account\'s '
      + 'PREDICTED distance).',
    startDelay: '⭐ RC-C0 §P.D\'s START-DELAY RECEIPT: ticks from the RELEASE tick to the '
      + 'target\'s first `ReceivePass`. THE CENSORED BUCKET IS COUNTED AND PUBLISHED, NEVER '
      + 'IMPUTED — the mean is over the uncensored flights only.',
    completionBySector: '⭐⭐ THE REALITY READ: on the measured ground passes whose FIRST body '
      + 'contact was the OWN TARGET, P(the pass completed | that contact was on the FRONT '
      + 'sector) vs P(completed | SIDE or BACK), with counts. ⚠ NOT causal — a front-on body '
      + 'is not randomly assigned.',
    phi: 'φ = the angle between a body\'s `heading` and its `vel`, in DEGREES, both read at the '
      + 'SAME tick AFTER `m.step(DT)` — BF-C0 §P.A\'s face, REUSED. Sign-blind; a degenerate '
      + 'pair names no angle and is excluded. 15° bins to 180° (12 bins), STORED.',
    movingFloor: `MOVING = |vel| > ${MOVING_FLOOR} m/s — the ENGINE's OWN heading-follow floor `
      + '(`physicsStep`\'s `} else if (sp > 0.5) {`, ANCHORED). ⛔ Not a taste constant.',
    bfCoverage: '⭐⭐ BF-T1 §P.B\'s LIVE COVERAGE read, reused: the intent is clamped to '
      + '`topSpeed` exactly as `physicsStep` clamps it and the SHIPPED `facingFactor` / '
      + '`facingCosine` are taken on the clamped target\'s direction against `heading`. ⚠ the '
      + 'same ONE-STEP PHASE SUBTLETY (intent for the step just taken, heading one rotation '
      + 'later). ⛔ PLUMBING.',
    dfFaces: '⭐ 乱跑 = assignment switches per defender-minute — DF-C0 §R2\'s definition and '
      + 'DF-T1 §3\'s instrument, REUSED VERBATIM and ANCHORED. Marking coverage = the '
      + 'held-mark share of the same defender body-ticks.',
    e4: {
      forwardPassShare: '`mt-ladder.ts`\'s OWN definition, anchored.',
      thirdMan: 'the engine\'s own completed third-man release counter (`Match.ts`, anchored).',
      overlaps: 'the engine\'s own completed overlap release counter (`Match.ts`, anchored).',
      chainLength: 'the engine\'s OWN `bestPassChain` ledger, over TWO team-matches.',
    },
    estimator: `CLUSTER BOOTSTRAP over the SHARED seeds, ${BOOTSTRAP} draws, rng seeded from `
      + `the block base ${BLOCK_BASE} — the RC-T1a estimator. Both arms of a pair move `
      + 'together inside every draw, so every interval is a PAIRED one BY CONSTRUCTION. Point '
      + 'estimates are ratio-of-sums, so every headline re-derives from the stored per-seed '
      + 'cells.',
    loo: 'LEAVE-ONE-OUT flip counting on the five SCORED Δ, the DOSED (a) Δ and the E1 − E0 '
      + 'goals Δ: drop each seed, re-derive the POINT Δ, and count a FLIP when the frozen '
      + 'rule\'s verdict changes with the interval SHIFTED by that seed\'s influence. ⚠ THE '
      + 'CONSERVATIVE POINT-SHIFT FORM — stated, never hidden.',
    clock: '⚠ every rate is on the 240 s MATCH clock; 1 sim-s = 60 ticks = 22.5 display-s.',
  },
  doseSource: {
    what: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field".',
    loadersCalled: ['loadL3Dose', 'loadPcDose'],
    files: {
      [L3_DOSE_FILE]: { expected: L3_DOSE_SHA_EXPECTED, got: L3_DOSE_BYTES_SHA,
        ok: L3_DOSE_BYTES_SHA === L3_DOSE_SHA_EXPECTED },
      [PC_DOSE_FILE]: { expected: PC_DOSE_SHA_EXPECTED, got: PC_DOSE_BYTES_SHA,
        ok: PC_DOSE_BYTES_SHA === PC_DOSE_SHA_EXPECTED },
    },
    expectedValuesReadOfRecordFrom: 'docs/world-model/data/pt-c0-playtest-forensic-census.json '
      + '`doseSource.files` (published at PT-C0, PINNED here per PT-C0 §CORR item 2)',
    l3CellsPooled: L3_CELLS_POOLED, pcRowsPooled: PC_ROWS_POOLED,
    refusalBehaviour: '⛔ on any byte mismatch the instrument exits 3 BEFORE any walk.',
  },
  anchoredSites: ANCHORS,
  fixtures: { total: FIXTURES.length, passed: FIXTURES.filter((f) => f.ok).length, rows: FIXTURES },
  lockstep: lockstepRows,
  armsDiverge: divergeByPair,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-SEED SCRATCH SMOKE (seeds 900,002,700–711), DISCLOSED '
      + 'in full at the doc\'s §DEV-PREFLIGHT; the realised paired-Δ half-widths were read out '
      + 'of the smoke artifact\'s own `deltas[].halfWidth` fields and HARDCODED into '
      + 'SIZING_INPUTS at the FREEZE COMMIT.',
    targets: '(a) and (b) carry NO externally given target — their DECLARED TARGET IS THE '
      + 'SMOKE\'S OWN MDE at 12 seeds (#380 item 6(ii): "MDE declared from the smoke"). (c1) '
      + `0.30 goals (the band's own half-width) · (c2) 0.010 completion · (c3) 1.0 `
      + 'interceptions/match.',
    nFrozen: N_FROZEN, nMaxSeeds: N_MAX_SEEDS, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  hRC2: {
    scoredOn: 'THE SCORED PAIR ONLY (E3 − E1)',
    frozenRules: {
      a: '(a) THE RECEIVER OPENS UP — Δ `contact.ownTargetSideBackShare`: the 95 % paired '
        + 'interval lies ENTIRELY BELOW ZERO ⇒ FALLS; else DOES-NOT-FALL.',
      b: '(b) THE SECOND SENTENCE DOES NOT WORSEN — Δ `contact.opponentFirstContactShare`: the '
        + 'interval is NOT entirely above zero ⇒ DOES-NOT-RISE; else RISES.',
      c1: `(c1) GOALS STAY IN THE BAND — Δ \`goalsPerMatch\`: NOT entirely outside `
        + `[−${TARGET_C1_BAND}, +${TARGET_C1_BAND}] ⇒ WITHIN-BAND.`,
      c2: `(c2) COMPLETION DOES NOT FALL — Δ whole-match \`passCompletion\`: NOT entirely `
        + `below ${TARGET_C2_COMPLETION} ⇒ DOES-NOT-FALL.`,
      c3: `(c3) INTERCEPTIONS DO NOT RISE — Δ \`interceptionsPerMatch\`: NOT entirely above `
        + `+${TARGET_C3_INTERCEPTIONS}/match ⇒ DOES-NOT-RISE. ⚠ BOTH sides carry every armed `
        + 'door, so this is the MATCH TOTAL.',
      conjunction: 'H-RC.2 = PASS ⇔ (a) FALLS ∧ (b) DOES-NOT-RISE ∧ (c1) WITHIN-BAND ∧ (c2) '
        + 'DOES-NOT-FALL ∧ (c3) DOES-NOT-RISE.',
      mdeWarning: '⚠ A NON-FALL / NON-RISE / WITHIN-BAND CERTIFIES NOTHING SMALLER THAN ITS '
        + 'DECLARED MDE. Nothing smaller than an MDE is ever read as "no effect".',
      selectionWarning: '⚠ the sector faces are SELECTION statistics — who reaches a first '
        + 'touch at all can itself change under the door. Stated at §P.C before the battery.',
    },
    targets: { c1Band: TARGET_C1_BAND, c2Completion: TARGET_C2_COMPLETION,
      c3Interceptions: TARGET_C3_INTERCEPTIONS },
    aVerdict: A_VERDICT, bVerdict: B_VERDICT, c1Verdict: C1_VERDICT,
    c2Verdict: C2_VERDICT, c3Verdict: C3_VERDICT,
    aOk: A_OK, bOk: B_OK, cOk: C_OK, verdict: H_RC2,
    aDelta: dA, bDelta: dB, c1Delta: dC1, c2Delta: dC2, c3Delta: dC3,
  },
  precommittedReads: {
    wordsOfRecord: '#380 item 6(vii), the three H-RC.2 sentences, the ENTRY QUESTION\'s three '
      + 'and the GOALS STORY\'s three, FROZEN AS LITERALS at the freeze commit and selected '
      + 'ONLY on stored booleans.',
    frozenSentences: {
      pass: READ_PASS, aFails: READ_A_FAILS, bOrCFails: READ_BC_FAILS,
      dosedMoves: READ_DOSED_MOVES, dosedStill: READ_DOSED_STILL,
      dosedUnresolved: READ_DOSED_UNRESOLVED,
      goalsUp: READ_GOALS_UP, goalsDown: READ_GOALS_DOWN, goalsFlat: READ_GOALS_FLAT,
    },
    selectors: {
      verdict: H_RC2, aOk: A_OK, bOk: B_OK, cOk: C_OK,
      dosedAFalls: DOSED_A_FALLS, dosedCHolds: DOSED_C_HOLDS,
      dosedAContainsZero: DOSED_A_CONTAINS_ZERO,
      priceGoalsCiLo: dPriceGoals.ciLo, priceGoalsCiHi: dPriceGoals.ciHi,
    },
    entryRead: ENTRY_READ, goalsRead: GOALS_READ,
    readsPrinted: READS_PRINTED,
  },
  ladder: {
    what: '⭐ THE SEASON LADDER — REPORTED, GATED BY NOTHING AS FOOTBALL (#380 item 6(iv)). '
      + 'The ladder\'s MATCH is THE E3 WORLD in BOTH arms (world 12 + `bfFacingCost` + '
      + '`rcAnticipate` + `rcReady`, EMPTY-BOOK), so the door is open in both and the only '
      + 'question is whether SELECTION CARRIES THE GENE when the turn has a price.',
    arms: {
      geneAbsent: '`evolveReceiverAnticipation` FALSE — the gene stays STRUCTURALLY ABSENT for '
        + 'every generation. THE CONTROL, with the neutral-drift shadow riding it (inert '
        + 'passengers mutated by the SAME law in their own rng namespace; they touch no match).',
      geneEvolvable: '`evolveReceiverAnticipation` TRUE — the gene may enter ONLY through the '
        + 'SHIPPED `mutateGenome` / `crossoverGenomes` opt-in. ⛔ nothing pre-seeded, no value '
        + 'ever set by hand.',
    },
    leagueSeeds: LADDER_SEEDS, teams: LADDER_TEAMS, generations: LADDER_GENS,
    matchSeedDerivation: 'every ladder MATCH seed = `hashSeed(leagueSeed, gen, idx, 0xdc)` — '
      + 'the SHIPPED `hashSeed`, the `League.createMatch` idiom.',
    cells: ladderCells, byGeneration: ladderByGeneration, geneSlopes: ladderGeneSlopes,
    final: ladderFinal, goalsSlopeVsControl: LADDER_GOALS_SLOPE_VS_CONTROL,
    wallSeconds: ladderWallSec,
  },
  bins: {
    grids: {
      phiDeg: { width: PHI_BIN_DEG, bins: NPHI, cut45AtBin: BIN45, cut90AtBin: BIN90 },
      rolePhiTicks: { roles: NROLE, bins: NPHI },
      readyBenefit: { width: BENEFIT_BIN, bins: BENEFIT_BINS, overflowIsLast: true },
      readyCost: { width: COST_BIN, bins: COST_BINS, overflowIsLast: true },
      keeperShotShare: { width: KSHARE_BIN, bins: KSHARE_BINS, overflowIsLast: true },
      startDelayTicks: { width: SD_BIN_TICKS, bins: SD_BINS, groups: WGROUPS },
      gapDiffMetres: { width: CAL_BIN_M, bins: CAL_BINS, signed: true, groups: GGROUPS },
      nearestMateMetres: { width: NEAR_BIN_M, bins: NEAR_BINS, overflowIsLast: true },
      minPairwiseMetres: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, overflowIsLast: true },
    },
    pooledByArm,
  },
  roles: ROLES, contactClasses: CONTACTS, sectors: SECTORS, outcomes: OUTCOMES,
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    ladderLeagueSeeds: LADDER_SEEDS,
    constructionReceiptSeed: RECEIPT_SEED,
    walksBooked,
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    smokeScratchBand: [900_002_700, 900_002_711],
    unwalkedTail: IS_OVERRIDE ? null
      : (batterySeeds[batterySeeds.length - 1] + 1 <= LADDER_SEEDS[0] - 1
        ? [batterySeeds[batterySeeds.length - 1] + 1, LADDER_SEEDS[0] - 1] : null),
    bootstrapRngSeededFrom: BLOCK_BASE,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  perf: {
    totalWallSeconds: (Date.now() - t0Wall) / 1000,
    batteryWalks: allRows.length,
    meanWallSecondsPerWalk: sum(allRows.map((r) => r.wallMs)) / 1000 / allRows.length,
    ladderWallSeconds: ladderWallSec,
    note: '⚠ A MACHINE READING ON ONE MACHINE.',
  },
  honestLimits: HONEST_LIMITS_NOTE,
  perSeedCells: cells.map((c) => ({ seed: c.seed, rows: c.rows })),
  constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §19 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const ALL_GREEN_PRE = Object.values(gates).every((g) => g.ok);
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: { seed: number; rows: Record<Arm, Row> }[];
  faces: FaceRow[]; deltas: DeltaRow[];
  hRC2: { verdict: string; aVerdict: string; bVerdict: string; c1Verdict: string;
    c2Verdict: string; c3Verdict: string; aOk: boolean; bOk: boolean; cOk: boolean;
    aDelta: DeltaRow; bDelta: DeltaRow; c1Delta: DeltaRow; c2Delta: DeltaRow;
    c3Delta: DeltaRow;
    targets: { c1Band: number; c2Completion: number; c3Interceptions: number } };
  precommittedReads: { readsPrinted: string[]; entryRead: string; goalsRead: string;
    selectors: { verdict: string; aOk: boolean; bOk: boolean; cOk: boolean;
      dosedAFalls: boolean; dosedCHolds: boolean; dosedAContainsZero: boolean;
      priceGoalsCiLo: number; priceGoalsCiHi: number } };
  bins: { pooledByArm: Record<Arm, ReturnType<typeof pooled>> };
  sizing: { rows: typeof sizingRows };
  ladder: { cells: LadderCell[]; byGeneration: typeof ladderByGeneration;
    final: typeof ladderFinal; goalsSlopeVsControl: number };
};
const dcells = disk.perSeedCells;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = dcells.map((c) => c.rows[f.arm]);
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  const v = ratio(nu, de);
  faceChecks.push({
    face: `${f.arm}.${f.face}`,
    ok: nu === f.numerator && de === f.denominator
      && (Number.isNaN(v) ? f.value === null || Number.isNaN(f.value) : v === f.value),
  });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.key];
  const pS = ratio(sum(dcells.map((c) => def.num(c.rows[dd.loArm]))),
    sum(dcells.map((c) => def.dn(c.rows[dd.loArm]))));
  const pA = ratio(sum(dcells.map((c) => def.num(c.rows[dd.hiArm]))),
    sum(dcells.map((c) => def.dn(c.rows[dd.hiArm]))));
  const eq = (a: number, b: number): boolean => (Number.isNaN(a)
    ? (b === null || Number.isNaN(b)) : a === b);
  const rf = RULE_OF_FACE[dd.key];
  const wordOk = rf === undefined ? (dd.ruleWord === null && dd.ruleConjunct === null)
    : (dd.ruleWord === rf.word({ ciLo: dd.ciLo, ciHi: dd.ciHi })
      && dd.ruleConjunct === rf.conjunct);
  faceChecks.push({
    face: `delta.${dd.pair}.${dd.key}`,
    ok: eq(pS, dd.loValue) && eq(pA, dd.hiValue) && eq(pA - pS, dd.delta) && wordOk,
  });
}
const binChecks: { check: string; ok: boolean }[] = [];
/* ⭐⭐ THE FIVE CONJUNCT WORDS, THE VERDICT WORD AND EVERY READ SENTENCE, off disk */
{
  const h = disk.hRC2;
  const t = h.targets;
  const reA = h.aDelta.ciHi < 0 ? 'FALLS' : 'DOES-NOT-FALL';
  const reB = !(h.bDelta.ciLo > 0) ? 'DOES-NOT-RISE' : 'RISES';
  const reC1 = !(h.c1Delta.ciLo > t.c1Band || h.c1Delta.ciHi < -t.c1Band)
    ? 'WITHIN-BAND' : 'OUTSIDE-BAND';
  const reC2 = !(h.c2Delta.ciHi < t.c2Completion) ? 'DOES-NOT-FALL' : 'FALLS';
  const reC3 = !(h.c3Delta.ciLo > t.c3Interceptions) ? 'DOES-NOT-RISE' : 'RISES';
  const reAOk = reA === 'FALLS';
  const reBOk = reB === 'DOES-NOT-RISE';
  const reCOk = reC1 === 'WITHIN-BAND' && reC2 === 'DOES-NOT-FALL' && reC3 === 'DOES-NOT-RISE';
  const reAll = reAOk && reBOk && reCOk ? 'PASS' : 'FAIL';
  binChecks.push({ check: 'hRC2.aVerdict', ok: reA === h.aVerdict });
  binChecks.push({ check: 'hRC2.bVerdict', ok: reB === h.bVerdict });
  binChecks.push({ check: 'hRC2.c1Verdict', ok: reC1 === h.c1Verdict });
  binChecks.push({ check: 'hRC2.c2Verdict', ok: reC2 === h.c2Verdict });
  binChecks.push({ check: 'hRC2.c3Verdict', ok: reC3 === h.c3Verdict });
  binChecks.push({ check: 'hRC2.limbs',
    ok: reAOk === h.aOk && reBOk === h.bOk && reCOk === h.cOk });
  binChecks.push({ check: 'hRC2.verdict', ok: reAll === h.verdict });
  /* the two other frozen reads, re-selected off the stored deltas */
  const dda = disk.deltas.find((x) => x.pair === 'D3D0'
    && x.key === 'contact.ownTargetSideBackShare')!;
  const ddc1 = disk.deltas.find((x) => x.pair === 'D3D0' && x.key === 'goalsPerMatch')!;
  const ddc2 = disk.deltas.find((x) => x.pair === 'D3D0' && x.key === 'passCompletion')!;
  const ddc3 = disk.deltas.find((x) => x.pair === 'D3D0'
    && x.key === 'interceptionsPerMatch')!;
  const reDosedA = RULE_A(dda);
  const reDosedC = RULE_C1(ddc1) && RULE_C2(ddc2) && RULE_C3(ddc3);
  const reDosedZero = !(dda.ciHi < 0) && !(dda.ciLo > 0);
  const reEntry = reDosedA && reDosedC ? READ_DOSED_MOVES
    : reDosedZero ? READ_DOSED_STILL : READ_DOSED_UNRESOLVED;
  const dpg = disk.deltas.find((x) => x.pair === 'E1E0' && x.key === 'goalsPerMatch')!;
  const reGoals = dpg.ciLo > 0 ? READ_GOALS_UP : dpg.ciHi < 0 ? READ_GOALS_DOWN
    : READ_GOALS_FLAT;
  const s = disk.precommittedReads.selectors;
  binChecks.push({ check: 'precommittedReads.selectors',
    ok: s.verdict === reAll && s.aOk === reAOk && s.bOk === reBOk && s.cOk === reCOk
      && s.dosedAFalls === reDosedA && s.dosedCHolds === reDosedC
      && s.dosedAContainsZero === reDosedZero
      && s.priceGoalsCiLo === dpg.ciLo && s.priceGoalsCiHi === dpg.ciHi });
  binChecks.push({ check: 'precommittedReads.entryRead',
    ok: reEntry === disk.precommittedReads.entryRead });
  binChecks.push({ check: 'precommittedReads.goalsRead',
    ok: reGoals === disk.precommittedReads.goalsRead });
  const reReads = [
    ...(reAll === 'PASS' ? [READ_PASS] : []),
    ...(!reAOk ? [READ_A_FAILS] : []),
    ...(!(reBOk && reCOk) ? [READ_BC_FAILS] : []),
    reEntry, reGoals,
  ];
  binChecks.push({ check: 'precommittedReads.readsPrinted',
    ok: JSON.stringify(reReads) === JSON.stringify(disk.precommittedReads.readsPrinted) });
}
/* ⭐ EVERY POOLED BIN re-derives by summing the SERIALIZED per-seed cells */
for (const arm of ARMS) {
  const p = disk.bins.pooledByArm[arm];
  const rows = dcells.map((c) => c.rows[arm]);
  const check = (name: string, got: number[] | number[][], want: number[] | number[][]): void => {
    binChecks.push({ check: `bins.${arm}.${name}`,
      ok: JSON.stringify(got) === JSON.stringify(want) });
  };
  const acc1 = (n: number, pick: (r: Row) => number[]): number[] => {
    const out = zeros(n);
    for (const r of rows) addInto(out, pick(r));
    return out;
  };
  const acc2 = (a: number, b: number, pick: (r: Row) => number[][]): number[][] => {
    const out = zeros2(a, b);
    for (const r of rows) addInto2(out, pick(r));
    return out;
  };
  check('phiTicks', acc1(NPHI, (r) => r.phiBins), p.phiTicks);
  check('rolePhiTicks', acc2(NROLE, NPHI, (r) => r.rolePhiBins), p.rolePhiTicks);
  check('contactClass', acc1(CONTACTS.length, (r) => r.contactClass), p.contactClass);
  check('firstContactSector', acc1(SECTORS.length, (r) => r.firstContactSector),
    p.firstContactSector);
  check('receiverSector', acc1(SECTORS.length, (r) => r.recvSector), p.receiverSector);
  check('completedBySector', acc1(SECTORS.length, (r) => r.complBySector), p.completedBySector);
  check('ownTargetContactsBySector', acc1(SECTORS.length, (r) => r.complBySectorN),
    p.ownTargetContactsBySector);
  check('readyBenefit', acc1(BENEFIT_BINS, (r) => r.readyBenefitBins), p.readyBenefit);
  check('readyCost', acc1(COST_BINS, (r) => r.readyCostBins), p.readyCost);
  check('keeperShotShare', acc1(KSHARE_BINS, (r) => r.shotShareBins), p.keeperShotShare);
  check('startDelayTicks', acc2(NWG, SD_BINS, (r) => r.sdBins), p.startDelayTicks);
  check('gapDiffMetres', acc2(NGG, CAL_BINS, (r) => r.gapDiffBins), p.gapDiffMetres);
  check('nearestMateMetres', acc1(NEAR_BINS, (r) => r.nearBins), p.nearestMateMetres);
  check('minPairwiseMetres', acc1(MINPAIR_BINS, (r) => r.minPairBins), p.minPairwiseMetres);
  /* ⭐ the two headline misalignment shares re-derive by an INDEPENDENT route from the φ
     histogram, and the (a) face's own three-way decomposition sums to its own population */
  const ph = p.phiTicks;
  const tot = sum(ph);
  binChecks.push({ check: `bins.${arm}.share45FromHistogram`,
    ok: ratio(sum(ph.slice(BIN45)), tot) === (disk.faces
      .find((f) => f.arm === arm && f.face === 'misalign.share45') as FaceRow).value });
  binChecks.push({ check: `bins.${arm}.share90FromHistogram`,
    ok: ratio(sum(ph.slice(BIN90)), tot) === (disk.faces
      .find((f) => f.arm === arm && f.face === 'misalign.share90') as FaceRow).value });
  const gpF = disk.faces.find((f) => f.arm === arm
    && f.face === 'contact.ownTargetSideBackShare') as FaceRow;
  binChecks.push({ check: `bins.${arm}.aFaceFromSectorBins`,
    ok: p.firstContactSector[SECTORS.indexOf('side')]
      + p.firstContactSector[SECTORS.indexOf('back')] === gpF.numerator });
  binChecks.push({ check: `bins.${arm}.ownTargetContactsEqualSectorBins`,
    ok: JSON.stringify(p.ownTargetContactsBySector) === JSON.stringify(p.firstContactSector) });
}
/* ⭐ THE SIZING ROWS re-derive off disk */
for (const r of disk.sizing.rows) {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
  const dR = disk.deltas.find((d) => d.pair === SCORED_PAIR && d.key === r.face);
  binChecks.push({
    check: `sizing.${r.face}@${r.target}`,
    ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded
      && (Number.isNaN(nReq) ? Number.isNaN(r.nRequired) || r.nRequired === null
        : nReq === r.nRequired)
      && hwAtN === r.expectedHalfWidthAtNFrozen
      && hwAtN * ZSUM / Z975 === r.mdeAtNFrozen
      && dR !== undefined && dR.halfWidth * ZSUM / Z975 === r.mdeAtRealisedHw,
  });
}
/* ⭐ THE LADDER's published aggregates re-derive from its own SERIALIZED cells */
for (const g of disk.ladder.byGeneration) {
  const cs = disk.ladder.cells.filter((c) => c.arm === g.arm && c.generation === g.generation);
  const mt = sum(cs.map((c) => c.matches));
  binChecks.push({
    check: `ladder.${g.arm}.gen${g.generation}`,
    ok: mt === g.matches
      && round(ratio(sum(cs.map((c) => c.goals)), mt), 6) === g.goalsPerMatch
      && round(mean(cs.map((c) => c.geneMean)), 8) === g.geneMean
      && round(mean(cs.map((c) => c.genePresentShare)), 6) === g.genePresentShare,
  });
}
binChecks.push({
  check: 'ladder.goalsSlopeVsControl',
  ok: round((disk.ladder.final.find((x) => x.arm === 'geneEvolvable')!.goalsDelta)
    - (disk.ladder.final.find((x) => x.arm === 'geneAbsent')!.goalsDelta), 6)
    === disk.ladder.goalsSlopeVsControl,
});
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks (every `
    + 'Δ\'s STORED RULE WORD included) and '
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} verdict-word / read-sentence `
    + '/ stored-bin / independent-route / sizing / ladder checks re-derived from the SERIALIZED '
    + 'artifact off disk — canon, VERBATIM: "the re-derivation gate covers EVERY published '
    + 'face; a percentile face requires stored bins". H-RC.2\'s FIVE conjunct words, the '
    + 'VERDICT word, the ENTRY read, the GOALS-STORY read and the full printed read list are '
    + 'INCLUDED; both headline misalignment shares AND the (a) face\'s own numerator are '
    + 're-derived by an INDEPENDENT route from the stored bins',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = ALL_GREEN_PRE && FACES_OK;
artifact.allGreen = ALL_GREEN;

/* ========================================================================== */
/* §19b THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt */
/* ========================================================================== */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after every gate */
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
/** ⭐⭐ THE NON-BODY RECEIPT (canon, #372 item 3): the body hash RECOMPUTED from the FILE
 *  JUST WRITTEN, under the DECLARED BODY_SCHEMA — persisted OUTSIDE the body. */
const HASH_REPRODUCES_FROM_FILE = (() => {
  const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();
artifact.receipts = {
  what: '⭐⭐ canon, VERBATIM: "the body hash is computed after every body key is assigned, and '
    + 'a NON-body receipt field records that the hash reproduces from the written file" '
    + '(home: RC-T1A-PRECUE-EXAM.md §COMMANDER CORRECTIONS item 3, ruling #372 item 3). This '
    + 'block is OUTSIDE `BODY_SCHEMA` by construction — a body field could not record a hash '
    + 'computed after itself.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential (writing them changes the file). The FINAL file byte-hash and byte '
    + 'count are recomputed after the final write and PUBLISHED IN THE DOC\'s §R.',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');
const HASH_REPRODUCES_FINAL = (() => {
  const onDisk = JSON.parse(FINAL_BYTES) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();

/* ========================================================================== */
/* §20 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`RC-T1B — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- H-RC.2 (SCORED on E3 − E1) ---');
const line = (tag: string, d: DeltaRow, word: string): void => {
  banner(`  ${tag.padEnd(5)} ${d.key.padEnd(36)} ${d.loArm} ${f6(d.loValue)} → ${d.hiArm} `
    + `${f6(d.hiValue)}  Δ ${f6(d.delta)} [${f6(d.ciLo)}, ${f6(d.ciHi)}] `
    + `(${f6(d.absDeltaOverHalfWidth)} hw, LOO flips ${d.looFlips})  ⇒ ${word}`);
};
line('(a)', dA, A_VERDICT);
line('(b)', dB, B_VERDICT);
line('(c1)', dC1, C1_VERDICT);
line('(c2)', dC2, C2_VERDICT);
line('(c3)', dC3, C3_VERDICT);
banner(`  ⭐⭐ H-RC.2 = ${H_RC2}`);
banner('');
banner('--- THE PRE-COMMITTED READS, PRINTED BY THE FROZEN FORM ---');
for (const s of READS_PRINTED) banner(`  ${s}`);
banner('');
banner('--- SIZING (the 12-seed scratch smoke) ---');
for (const r of sizingRows) {
  banner(`  ${r.group} ${r.face.padEnd(36)} hwSmoke ${f6(r.hwSmoke)} target ${r.target} `
    + `N ${r.nRequired} hw@N ${f6(r.expectedHalfWidthAtNFrozen)} MDE ${f6(r.mdeAtNFrozen)} `
    + `MDE@realised ${f6(r.mdeAtRealisedHw)}`);
}
banner('');
const REPORT_KEYS = [
  'contact.ownTargetSideBackShare', 'contact.opponentFirstContactShare',
  'contact.ownTargetFirstContactFrontShare', 'contact.ownTargetFirstContactSideShare',
  'contact.ownTargetFirstContactBackShare',
  'contact.receiverFrontShareCompleted', 'contact.receiverSideShareCompleted',
  'contact.receiverBackShareCompleted',
  'completionBySector.front', 'completionBySector.sideOrBack',
  'ready.overlayShare', 'ready.appliedShare', 'ready.appliedShareOfOverlay',
  'ready.pcHeldShareOfOverlay', 'ready.turnedTowardShareOfApplied',
  'ready.meanBenefit', 'ready.meanRecomputedCost',
  'receipt.preCuedArmsPerMatch',
  'gap.meanDiffMetres.meetableCarried', 'gap.meanDiffMetres.carried',
  'window.startDelayMeanTicks.meetableCarried',
  'window.startDelayCensoredShare.meetableCarried',
  'keeper.shotMisalignedShare', 'keeper.meanShotMisalignedShare',
  'keeper.pGoalGivenMisaligned', 'keeper.pGoalGivenAligned',
  'keeper.shotsWithNoKeeperMovingTicksShare', 'keeper.shotEventsPerMatch',
  'keeper.savesPerMatch', 'keeper.gkMetresPerKeeperPerMatch',
  'keeper.gkPositionMisalignedMetresPerMatch',
  'misalign.share45', 'misalign.share90',
  'misalign.role.GK.share45', 'misalign.role.DF.share90', 'misalign.role.MF.share90',
  'misalign.role.WG.share90', 'misalign.role.ST.share90',
  'coverage.appliedShare', 'coverage.meanFactor',
  'df.markSwitchesPerDefenderMinute', 'df.markHeldShare', 'df.tacklesPerMatch',
  'crowd.crashShare', 'crowd.dupRunPairsPerSample', 'crowd.nearestMateMeanMetres',
  'goalsPerMatch', 'passCompletion', 'interceptionsPerMatch', 'shotsPerMatch',
  'e4.forwardPassShare', 'e4.thirdManPerMatch', 'e4.overlapsPerMatch',
  'e4.bestPassChainMeanPerTeam',
  'context.groundPassesPerMatch', 'context.carriesPerMatch', 'context.movingTicksPerMatch',
  'context.metresPerMatch', 'context.meanSpeedMps', 'context.movingShareOfBodyTicks',
  'context.readyPopTicksPerMatch', 'context.windupsReleasedPerMatch',
  'receipt.substitutionsPerMatch',
];
banner('--- PER-ARM VALUES ---');
for (const k of REPORT_KEYS) {
  banner(`  ${k.padEnd(46)} ` + ARMS.map((a) => `${a} ${f6(face(a, k).value)}`).join(' · '));
}
banner('');
for (const p of PAIRS) {
  banner(`--- PAIR ${p.key}: ${p.form} ---`);
  for (const k of REPORT_KEYS) {
    const dd = delta(p.key, k);
    banner(`  ${k.padEnd(46)} Δ ${f6(dd.delta)} [${f6(dd.ciLo)}, ${f6(dd.ciHi)}]`
      + (dd.ruleWord === null ? '' : `  ⇒ (${dd.ruleConjunct}) ${dd.ruleWord}`));
  }
  banner('');
}
banner('--- THE SEASON LADDER (REPORTED, gated by nothing as football) ---');
for (const g of ladderByGeneration) {
  banner(`  ${g.arm.padEnd(13)} gen ${String(g.generation).padStart(2)}  present `
    + `${f6(g.genePresentShare)}  geneMean ${f6(g.geneMean)}  geneMax ${f6(g.geneMax)}  drift `
    + `${g.driftMean === null ? 'n/a' : f6(g.driftMean)}  goals/match ${f6(g.goalsPerMatch)}`);
}
banner(`  goals slope vs control = ${f6(LADDER_GOALS_SLOPE_VS_CONTROL)}`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`instrumentSha256   = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`hashedBodySha256   = ${artifact.hashedBodySha256 as string}`);
banner(`file byte-hash     = ${FINAL_FILE_SHA}`);
banner(`artifact bytes     = ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
