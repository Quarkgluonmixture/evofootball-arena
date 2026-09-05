/**
 * ⭐⭐ LN-T1 — 「让眼睛来站位」 THE LANE EXAM
 * (docs/world-model/LN-T1-LANE-EXAM.md).
 *
 * Authorized by COMMANDER RULING #389 item 4 (step ② of the ratified order, #366 item 1).
 * Lineage: LN-C0 (#388 item 2 — the walker, the corridor test, the `ball.lastTouch` first-body
 * channel, the crowd limbs, the cause classes, the estimator and the hash order, REUSED byte
 * for byte and anchored) → OBM-T1 (#230 — the arm construction, the `armMatrix` idiom, the
 * three dose matrices BYTE-COPIED, the guard tolerance form, FLAG-HYGIENE / G-ARM /
 * G-BLIND-WORLD, REUSED) → this exam, on WORLD 13's EMPTY-BOOK composition.
 *
 * THE QUESTION (#389 items 2–3, not re-argued here): does the PERCEPT OFF-BALL POLICY
 * (`obmMovement` ALONE — `ctbSupportPlane` is NEVER passed) move the USER'S OWN TWO FACES on
 * world 13 — 撞车 (`crowd.crashShare`) and the non-target teammate first on the ball
 * (`firstBody.ownNonTarget`) — DOWN, resolvedly, with every guard held?
 *
 * ⛔ THIS IS AN EXAM. It scores PRE-REGISTERED rules and prints FROZEN READ SENTENCES selected
 * by STORED booleans. It arms nothing for the user and ships nothing.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The seam, the
 * `obmMovement` MatchConfig flag and the genome door `offballMovementWeights` ALL EXIST; this
 * probe ARMS them from outside. THERE IS NO WRAPPER.
 * ⛔ WORLD 13's BYTES ARE UNTOUCHED and every flag default stays OFF.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion, BQ_WORLD_VERSION,
} from '../../src/game/a4World';
import { DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { formationSpot, supportSpot, emergentPosOn } from '../../src/ai/formations';
import {
  OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS,
  offballMovementWeightVector, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { obmOffballPolicy } from '../../src/ai/offballEyes';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass without a STORED override reason (LN-C0 §1) */
/* ========================================================================== */
const ENV_WHITELIST = ['LNT1_MODE', 'LNT1_N', 'LNT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('LNT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`LN-T1 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.LNT1_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('LN-T1 FATAL — LNT1_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.LNT1_N !== undefined ? Number(process.env.LNT1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('LN-T1 FATAL — LNT1_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.LNT1_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`LNT1_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`LNT1_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`LNT1_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ln-t1-lane-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ln-t1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('LN-T1 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (LN-C0's house set, COPIED)                                */
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
const meanOf = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((a, b) => a + b, 0) / xs.length);
const sdOf = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = meanOf(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const pctlSorted = (s: readonly number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]);
const quantileOf = (xs: readonly number[], q: number): number =>
  pctlSorted([...xs].sort((a, b) => a - b), q);
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const signedBinOf = (v: number, width: number, n: number): number => {
  const half = Math.floor(n / 2);
  const i = half + Math.round(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const binMedian = (bins: readonly number[], width: number, signed: boolean): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  const half = signed ? Math.floor(bins.length / 2) : 0;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return (i - half) * width;
  }
  return (bins.length - 1 - half) * width;
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
/* §3 THE ANCHORED SITES — anchored needle + want-count + line receipt, NEVER
   first-occurrence.  canon, VERBATIM: "a src-extracted constant pins its extraction to the
   NAMED call site — anchored match + line receipt — never first-occurrence" (home:
   BK-C0-BODYBALL-CENSUS.md §COMMANDER CORRECTIONS item 1, ruling #306 item 4).             */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const TYPES_PATH = 'src/sim/types.ts';
const TEAM_PATH = 'src/sim/Team.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const A4_PATH = 'src/game/a4World.ts';
const DV_PATH = 'src/ai/deliveryValueSeat.ts';
const VEC_PATH = 'src/utils/vec.ts';
const FORM_PATH = 'src/ai/formations.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const PTC0_PATH = 'scripts/probes/pt-c0-playtest-forensic-census.ts';
const BNC0_PATH = 'scripts/probes/bn-c0-bounce-census.ts';
const LNC0_PATH = 'scripts/probes/ln-c0-lane-census.ts';
const OBMT1_PATH = 'scripts/probes/obm-t1-policy-exam.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, CONST_PATH, TYPES_PATH, TEAM_PATH, PLAYER_PATH, MECH_PATH,
  A4_PATH, DV_PATH, VEC_PATH, FORM_PATH, BRAIN_PATH, EXEC_PATH, GENOME_PATH, A4P1C_PATH,
  PTC0_PATH, BNC0_PATH, LNC0_PATH, OBMT1_PATH]) {
  SRC_OF[p] = readFileSync(p, 'utf8');
}
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};
interface Anchor {
  what: string; file: string; needle: string; want: number;
  occurrences: { line: number }[]; extracted?: unknown;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, want: number, extracted?: unknown,
): { line: number }[] => {
  const hits = occurrences(SRC_OF[file], needle);
  ANCHORS.push({ what, file, needle, want, occurrences: hits, extracted });
  return hits;
};

/* ---- LN-C0's OWN anchored sites, INHERITED (the walk this exam reuses) ---- */
anchor('⭐⭐ `DV_CORRIDOR_SCALE` — laneOpenness\'s own metre normalizer', DV_PATH,
  'export const DV_CORRIDOR_SCALE = 4;', 1, 4);
anchor('⭐⭐ `DV_CLEAR_RADIUS` — laneOpenness\'s own clear-the-kicker guard', DV_PATH,
  'export const DV_CLEAR_RADIUS = 1.5;', 1, 1.5);
anchor('⭐ laneOpenness\'s OWN clear-the-kicker line (the guard this test reuses)', DV_PATH,
  '    if (dist(cp, from as V2) < DV_CLEAR_RADIUS) continue;', 1);
anchor('⭐ laneOpenness\'s OWN scale line', DV_PATH,
  '    const e = 1 - clamp01(lack / DV_CORRIDOR_SCALE);', 1);
anchor('⭐ `CONTROL_RADIUS` — the BK shell\'s own reach (the TIGHT bin\'s half-width)', CONST_PATH,
  'export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;', 1);
anchor('⭐⭐ `closestPointOnSegment` — CALLED, never re-implemented', VEC_PATH,
  'export const closestPointOnSegment = (a: V2, b: V2, p: V2): V2 => {', 1);
anchor('⭐⭐ BN-C0\'s OWN corridor membership test — the code LN-C0 copied and this exam reuses',
  BNC0_PATH, 'const inCorridorOf = (', 1);
anchor('⭐⭐ LN-C0\'s OWN corridor membership test — the byte-for-byte source of this copy',
  LNC0_PATH, 'const inCorridorOf = (\n  fromX: number, fromY: number, aimX: number, aimY: number,\n  px: number, py: number, halfWidth: number,\n): boolean => {', 1);
anchor('⭐⭐ `DUP_RUN_M` — the A4 battery I6 duplicate-run bucket (NO new constant)', A4P1C_PATH,
  'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)', 1, 4);
anchor('⭐⭐ `SAMPLE_EVERY` — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);
anchor('⭐⭐ the A4 limb\'s OUTFIELDER FILTER, verbatim', A4P1C_PATH,
  "const outs = mine.players.filter((q) => q.role !== 'GK' && !q.sentOff);", 1);
anchor('⭐⭐ PT-C0\'s 撞车 line — the min-pairwise face R1 IS', PTC0_PATH,
  '          if (mp < DUP_RUN_M) row.crashHits += 1;', 1);
anchor('⭐⭐ PT-C0\'s dup-run accumulation line', PTC0_PATH,
  '        row.dupRunSum += dupRunPairsOf(xs, ys);', 1);
anchor('⭐⭐ PT-C0\'s sample cadence line', PTC0_PATH,
  '    if (tick % SAMPLE_EVERY === 0 && playing) {', 1);
anchor('⭐⭐ PT-C0\'s `isMeasurableGroundPass`, the population of record (TWO occurrences in its '
  + 'instrument — the definition and its own gAnchoredConstants pin — both enumerated)',
  PTC0_PATH,
  'const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>', 2);
anchor('⭐⭐ PT-C0\'s ground-launch predicate (TWO occurrences, both enumerated)', PTC0_PATH,
  'const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>', 2);
anchor('⭐⭐ PT-C0\'s FIRST-BODY class ladder — R2\'s channel', PTC0_PATH,
  'const contactClassOf = (', 1);
anchor('⭐⭐ `pendingPassWindup` — the ARM record this exam reads', MATCH_PATH,
  '  pendingPassWindup:', 1);
anchor('⭐ `pendingPass` — the target and the strike registration', MATCH_PATH,
  '  pendingPass: PendingPass | null = null;', 1);
anchor('⭐ `possessionSide` — the attacking side of record', MATCH_PATH,
  '  possessionSide: Side | -1 = -1;', 1);
anchor('⭐⭐ `team.runners` — the engine\'s own set, DECLARED', TEAM_PATH,
  '  runners = new Set<number>();', 1);
anchor('⭐⭐ `team.arriver` — the engine\'s own designation, DECLARED', TEAM_PATH,
  '  arriver: number | null = null;', 1);
anchor('⭐⭐ `team.overlapper` — the engine\'s own designation, DECLARED', TEAM_PATH,
  '  overlapper: number | null = null;', 1);
anchor('⭐⭐ `team.chasers` — the engine\'s own set, DECLARED', TEAM_PATH,
  '  chasers = new Set<number>();', 1);
anchor('⭐⭐ `formationSpot`\'s SIGNATURE (this exam CALLS it, as LN-C0 did)', FORM_PATH,
  'export function formationSpot(\n  p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team, abandonRest = false,\n  pmMover = false,\n): V2 {',
  1);
anchor('⭐⭐ THE `emergentPosOn()` TOGGLE AT THE HEAD of formationSpot', FORM_PATH,
  '  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp, abandonRest, pmMover);',
  1);
anchor('⭐⭐ the toggle\'s DEFAULT is ON (null = use the default)', FORM_PATH,
  '  return true; // DEFAULT ON', 1);
anchor('⭐⭐ `supportSpot`\'s SIGNATURE (CALLED)', FORM_PATH,
  'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {', 1);
anchor('⭐⭐ the CTB fork inside supportSpot — the seam this exam keeps SHUT', FORM_PATH,
  '  if (ctbPlane) {', 1);
anchor('⭐⭐ the executor\'s MoveToFormationSpot walk target — the production call', EXEC_PATH,
  '      target = formationSpot(p, team, ball, hasBall, opp, abandonRest, pmMover);', 2);
anchor('⭐⭐ the executor\'s SupportBallCarrier target — the production call', EXEC_PATH,
  '      target = supportSpot(p, team, ball, match.ctbSupportPlane);', 1);
anchor('⭐ production `abandonRest`', EXEC_PATH,
  '  const abandonRest = match.abandonRestDesignation === team.side;', 1);
anchor('⭐ production `pmMover`', EXEC_PATH,
  "  const pmMover = match.pmLaneConvergence && match.phase === 'playing';", 1);
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door, the composer CALLING world 12', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `bqArmedVersion` — the world gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);

/* ---- ⭐⭐ G-ANCHORS, THE NEW SITES THIS EXAM ARMS AND READS ---- */
/* the `obmMovement` FORK — the THREE read sites (#389 item 4(v)) */
anchor('⭐⭐ THE `obmMovement` FORK, SCORE SITES: the ONE brain fork that computes the policy '
  + 'and writes it to the match cache (`PlayerBrain.decideOffBall`)', BRAIN_PATH,
  '    if (match.obmMovement) {', 1);
anchor('⭐⭐ SCORE SITE 1 of 2 — the `SupportBallCarrier` candidate multiplier', BRAIN_PATH,
  '      s *= obmSupportMul;', 1);
anchor('⭐⭐ SCORE SITE 2 of 2 — the ALREADY-LICENSED `MakeRun` candidate multiplier', BRAIN_PATH,
  '      s *= obmRunMul;', 1);
anchor('⭐⭐ THE TARGET SITE — actionExecutor\'s `SupportBallCarrier` plane READ', EXEC_PATH,
  '      const obmPlane = match.obmMovement ? match.obmPlaneFor(p) : null;', 1);
anchor('⭐⭐ THE TARGET SITE — actionExecutor\'s `SupportBallCarrier` plane APPLY', EXEC_PATH,
  '      if (obmPlane !== null) target = supportSpotOnObmPlane(p, team, ball, obmPlane);', 1);
anchor('⭐ the match\'s own policy CACHE — the G-ARM counter\'s home, WRITTEN only by the '
  + 'single brain fork above', MATCH_PATH,
  '  private readonly obmPolicies = new Map<number, { plane: ObmPlane; tick: number }>();', 1);
anchor('⭐ `setObmPolicy` — the ONE writer of that cache', MATCH_PATH,
  '  setObmPolicy(gid: number, plane: ObmPlane): void {', 1);
anchor('⭐ the `obmMovement` MatchConfig flag DEFAULTS FALSE', MATCH_PATH,
  '    this.obmMovement = cfg.obmMovement ?? false;', 1);
/* the FOUR `MakeRun` push sites (#389 item 4(v)) — the fourth-licence audit */
anchor('⭐⭐ MakeRun PUSH 1 of 4 — THE LICENSED RUN (`team.runners` / arriver), the site the '
  + 'OBM run multiplier reaches', BRAIN_PATH, "        action: 'MakeRun',", 1);
anchor('⭐⭐ MakeRun PUSH 2 of 4 — THE ONE-TWO BURST, gated on `p.wallRun` and needing NO '
  + 'team-set licence (LN-C0 §COMMANDER CORRECTIONS item 1 — the fourth designation)',
  BRAIN_PATH,
  "      cands.push({ action: 'MakeRun', score: s, why: 'bursting for the one-two return' });", 1);
anchor('⭐⭐ MakeRun PUSH 3 of 4 — THE OVERLAP (`team.overlapper`)', BRAIN_PATH,
  "      cands.push({ action: 'MakeRun', score: s, why: 'overlapping outside the carrier' });", 1);
anchor('⭐⭐ MakeRun PUSH 4 of 4 — THE KEEPER-UP CORNER (an ASSIGNED action, not a candidate)',
  BRAIN_PATH, "      type: 'MakeRun',", 1);
anchor('⭐⭐ THE `p.wallRun` GATE the one-two burst reads — the L1w predicate\'s own site',
  BRAIN_PATH,
  '    if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {', 1);
anchor('⭐⭐ THE `p.wallRun` WRITE — `src/sim/mechanics.ts`, the ONE place the licence is granted',
  MECH_PATH, '    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };', 1);
anchor('⭐ `Player.wallRun`\'s DECLARATION (the field L1w reads)', PLAYER_PATH,
  '  wallRun: { until: number; partnerGid: number } | null = null;', 1);
/* world 13 IS PERCEPT-ARMED */
anchor('⭐⭐ `A4_WORLD_FLAGS` — the world-13 flag set the composer spreads', A4_PATH,
  'export const A4_WORLD_FLAGS = {', 1);
anchor('⭐⭐ `edsPerceivedChoice: true` — TWO occurrences in a4World.ts, BOTH enumerated: '
  + '`A4_WORLD_FLAGS` (line 300) and the arming echo below it. World 13 is PERCEPT-ARMED, so '
  + 'the seat\'s eyes actually see (G-BLIND-WORLD)', A4_PATH, '  edsPerceivedChoice: true,', 2);
/* the GENOME DOOR */
anchor('⭐⭐ `offballMovementWeights` — the genome door, OPTIONAL and DEFAULT-ABSENT', GENOME_PATH,
  '  offballMovementWeights?: number[];', 1);
anchor('⭐⭐ `OBM_WEIGHT_SLOTS` — the 16 slots, DERIVED from the two key lists', GENOME_PATH,
  'export const OBM_WEIGHT_SLOTS = OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length;', 1);
anchor('⭐⭐ `OBM_WEIGHT_MIN` — IMPORTED, never typed', GENOME_PATH,
  'export const OBM_WEIGHT_MIN = CTB_GENE_MIN;', 1);
anchor('⭐⭐ `OBM_WEIGHT_MAX` — IMPORTED, never typed', GENOME_PATH,
  'export const OBM_WEIGHT_MAX = CTB_GENE_MAX;', 1);
/* ---- ⭐⭐ G-DOSE-COPY's ANCHORS: the OBM-T1 lines this instrument BYTE-COPIES ---- */
anchor('⭐⭐ DOSE COPY — OBM-T1\'s `IDX` slot convention', OBMT1_PATH,
  'const IDX = (output: number, feature: number): number => output * OBM_FEATURE_KEYS.length + feature;', 1);
anchor('⭐⭐ DOSE COPY — OBM-T1\'s FEATURE indices', OBMT1_PATH,
  'const F1 = 0; const F2 = 1; const F3 = 2; const F4 = 3;', 1);
anchor('⭐⭐ DOSE COPY — OBM-T1\'s OUTPUT indices', OBMT1_PATH,
  'const O_DEPTH = 0; const O_WIDTH = 1; const O_SUPPORT = 2; const O_RUN = 3;', 1);
anchor('⭐⭐ DOSE COPY — OBM-T1\'s `ZERO_MATRIX`', OBMT1_PATH,
  'const ZERO_MATRIX = (): number[] => new Array<number>(OBM_WEIGHT_SLOTS).fill(0);', 1);
anchor('⭐⭐ DOSE COPY — OBM-T1\'s `matrix()` builder', OBMT1_PATH,
  'const matrix = (...entries: readonly [number, number, number][]): number[] => {', 1);
anchor('⭐⭐ DOSE COPY — OBM-T1\'s MIN/MAX aliases', OBMT1_PATH,
  'const MIN = OBM_WEIGHT_MIN; const MAX = OBM_WEIGHT_MAX;', 1);
anchor('⭐⭐ DOSE COPY — MARKER-ESCAPE, byte for byte', OBMT1_PATH,
  '  markerEscape: matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX]),', 1);
anchor('⭐⭐ DOSE COPY — SPACE-SEEK, byte for byte', OBMT1_PATH,
  '  spaceSeek: matrix([O_WIDTH, F3, MAX], [O_DEPTH, F3, MIN]),', 1);
anchor('⭐⭐ DOSE COPY — KITCHEN-SINK, byte for byte (the whole IIFE)', OBMT1_PATH,
  '  kitchenSink: ((): number[] => {\n    const w = ZERO_MATRIX();\n    for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) {\n      w[IDX(O_DEPTH, f)] = MIN;\n      w[IDX(O_WIDTH, f)] = MAX;\n      w[IDX(O_SUPPORT, f)] = MAX;\n      w[IDX(O_RUN, f)] = MIN;\n    }\n    return w;\n  })(),', 1);
anchor('⭐⭐ ARM COPY — OBM-T1\'s `armMatrix` idiom (all THREE genome views of BOTH teams)',
  OBMT1_PATH, 'const armMatrix = (m: Match, w: readonly number[] | null): void => {', 1);
anchor('⭐⭐ ARM COPY — OBM-T1\'s `genesOnAllViews` G-ARM receipt', OBMT1_PATH,
  'const genesOnAllViews = (m: Match): boolean => m.teams.every((t) => (', 1);
anchor('⭐⭐ ARM COPY — OBM-T1\'s policy-cache counter, the G-ARM counter this exam reads',
  OBMT1_PATH,
  '  r.policyCacheEntries = (m as unknown as { obmPolicies: Map<number, unknown> }).obmPolicies.size;', 1);
/* ---- ⭐⭐ THE GUARD FORM, INHERITED FROM OBM-T1's PROBE ---- */
anchor('⭐⭐ GUARD COPY — `NI_FRACTION`, the tolerance FRACTION as an EXPRESSION (never a '
  + 'decimal): PM-T1 §5, inherited from A4-S2P1-VECTOR-CENSUS §4', OBMT1_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `SAMPLE_EVERY`', OBMT1_PATH, 'const SAMPLE_EVERY = 10;', 1, 10);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `PAIR_SUBSAMPLE`', OBMT1_PATH,
  'const PAIR_SUBSAMPLE = 6;', 1, 6);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `CLOSE_PAIR_M`', OBMT1_PATH, 'const CLOSE_PAIR_M = 4;', 1, 4);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s spread-Y sample line', OBMT1_PATH,
  '      (hasBall ? spreadIn : spreadOut)[side].push(sd(outfield.map((p) => p.pos.y)));', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s pair-distance subsample line', OBMT1_PATH,
  '        for (let j = i + 1; j < outfield.length; j++) pairs[side].push(dist(outfield[i].pos, outfield[j].pos));', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `spreadYOut` fold', OBMT1_PATH,
  '  r.spreadYOut = mean([...spreadOut[0], ...spreadOut[1]]);', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `spacingMedian` fold', OBMT1_PATH,
  '  r.spacingMedian = quantile(bothPairs, 0.5);', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `spacingUnder4` fold (the face beside R1)', OBMT1_PATH,
  '  r.spacingUnder4 = bothPairs.length === 0 ? Number.NaN\n    : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length;', 1);
anchor('⭐⭐ X-FP-PROD — the PRODUCTION FINGERPRINT BASELINE, inherited from OBM-T1\'s probe',
  OBMT1_PATH,
  "const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';", 1);

/** THE ACTION VOCABULARY — read off `ActionType`'s OWN union, never re-typed. */
const AT_START = 'export type ActionType =';
const atIdx = SRC_OF[TYPES_PATH].indexOf(AT_START);
const ACTIONS = (SRC_OF[TYPES_PATH].slice(atIdx, SRC_OF[TYPES_PATH].indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;

/** ⭐⭐ THE CROWD CONSTANTS — ANCHORED above from the A4 battery. NO new constant. */
const DUP_RUN_M = 4;
const SAMPLE_EVERY = 10;
/** ⭐⭐ THE GUARD CONSTANTS — ANCHORED above from OBM-T1's probe. NO new constant. */
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
/** ⭐⭐ THE TOLERANCE FRACTION — the EXPRESSION, copied from OBM-T1's probe line (anchored
 *  above), never a typed decimal. PM-T1 §5, inherited from A4-S2P1-VECTOR-CENSUS §4. */
const NI_FRACTION = 1 - 0.275 / 0.380;
/** ⭐⭐ X-FP-PROD's pins, inherited from OBM-T1's probe (anchored above). */
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/** the fingerprint pin is EXTRACTED from OBM-T1's own anchored line, never re-typed. */
const FP_FROM_OBMT1 = (SRC_OF[OBMT1_PATH]
  .match(/const FINGERPRINT_BASELINE = '([0-9a-f]{64})';/) ?? ['', ''])[1];
const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && ACTIONS.length === 23
  && ACTIONS[0] === 'MoveToFormationSpot'
  && ACTIONS.includes('SupportBallCarrier') && ACTIONS.includes('MakeRun')
  && DUP_RUN_M === (ANCHORS.find((a) => a.needle.startsWith('const DUP_RUN_M'))!
    .extracted as number)
  && SAMPLE_EVERY === (ANCHORS.find((a) => a.needle.startsWith("const SAMPLE_EVERY = 10; //"))!
    .extracted as number)
  && PAIR_SUBSAMPLE === (ANCHORS.find((a) => a.needle === 'const PAIR_SUBSAMPLE = 6;')!
    .extracted as number)
  && CLOSE_PAIR_M === (ANCHORS.find((a) => a.needle === 'const CLOSE_PAIR_M = 4;')!
    .extracted as number)
  && FINGERPRINT_BASELINE === FP_FROM_OBMT1
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5
  && BQ_WORLD_VERSION === 13 && GRAVITY === 9.81
  && OBM_WEIGHT_SLOTS === OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length
  && OBM_WEIGHT_MIN < 0 && OBM_WEIGHT_MAX > 0 && OBM_WEIGHT_MAX === -OBM_WEIGHT_MIN;

/** ⭐⭐ WHICH PATH THE TOGGLE TAKES — determined, not assumed (LN-C0's read). */
const EMERGENT_POS_ON = emergentPosOn();
const FORMATION_SPOT_PATH = EMERGENT_POS_ON
  ? 'emergentStation (the DEFAULT-ON emergent positioning field) — world 13 takes THIS path'
  : 'the legacy fixed-table path (ATTACK_FORMATIONS / DEFEND_FORMATIONS)';

/* ========================================================================== */
/* §4 SEEDS — block 12,545,000–999 (#389 item 4(vi) / item 7)                  */
/* ========================================================================== */
const BLOCK_BASE = 12_545_000;
const BLOCK_TOP = 12_545_999;
/** ⭐⭐ N_FROZEN = 998 — the LARGEST N the block affords after the construction receipt at
 *  12,545,999, sized by the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE before the FREEZE commit
 *  and before any battery seed. The smoke's required N per ruler is published in `sizing`, as
 *  is MDE(N) at the frozen N. */
const N_FROZEN = 998;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_003_500;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const DOSE_READ_SEED = SCRATCH_BASE + 40;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
/** ⭐⭐ G-REPRO-LNC0 — LN-C0's OWN first twelve battery seeds, RE-WALKED on the ABSENT arm.
 *  ⛔ RE-WALKS, NOT CONSUMPTION: block 12,544,000–999 is LN-C0's, consumed whole of record. */
const REPRO_LNC0_BASE = 12_544_000;
const REPRO_LNC0_N = 12;
const REPRO_LNC0_SEEDS = Array.from({ length: REPRO_LNC0_N }, (_, i) => REPRO_LNC0_BASE + i);
const LNC0_ARTIFACT = 'docs/world-model/data/ln-c0-lane-census.json';

/* ========================================================================== */
/* §5 THE ARMS — FIVE, PAIRED on shared seeds, all on WORLD 13's EMPTY-BOOK
   composition (LN-C0's E13). The composer is CALLED, never copied.            */
/* ========================================================================== */
const ARMS = ['ABSENT', 'ARMED-ZERO', 'MARKER-ESCAPE', 'SPACE-SEEK', 'KITCHEN-SINK'] as const;
type Arm = (typeof ARMS)[number];
const CONTROL_ARM: Arm = 'ABSENT';
const DOSE_ARMS = ARMS.filter((a) => a !== CONTROL_ARM) as readonly Arm[];
const ARM_LABEL: Record<Arm, string> = {
  ABSENT: 'world 13 EMPTY-BOOK exactly as LN-C0 walked it (E13) — the control',
  'ARMED-ZERO': '`obmMovement` armed + the ALL-ZERO 16-weight matrix on all three genome '
    + 'views of both teams — the IDENTITY arm (FLAG-HYGIENE)',
  'MARKER-ESCAPE': 'OBM-T1\'s f2-driven corner, byte-copied',
  'SPACE-SEEK': 'OBM-T1\'s f3-driven corner, byte-copied',
  'KITCHEN-SINK': 'OBM-T1\'s CEILING PROBE, all sixteen slots at a domain corner, byte-copied',
};

/** ⭐⭐ THE DOSE IDIOM, BYTE-COPIED FROM `scripts/probes/obm-t1-policy-exam.ts` (every line
 *  ANCHORED at §3, and G-DOSE-COPY re-derives every matrix from the OBM_* exports slot for
 *  slot). row-major slot index, the seat's own convention: `output * featureCount + feature`. */
const IDX = (output: number, feature: number): number => output * OBM_FEATURE_KEYS.length + feature;
/** the four features, by index: 0 carrierPlight · 1 ownMarker · 2 targetCongestion · 3 readingAge */
const F1 = 0; const F2 = 1; const F3 = 2; const F4 = 3;
/** the four outputs, by index: 0 planeDepth · 1 planeWidth · 2 supportScore · 3 runScore */
const O_DEPTH = 0; const O_WIDTH = 1; const O_SUPPORT = 2; const O_RUN = 3;
const ZERO_MATRIX = (): number[] => new Array<number>(OBM_WEIGHT_SLOTS).fill(0);
const matrix = (...entries: readonly [number, number, number][]): number[] => {
  const w = ZERO_MATRIX();
  for (const [o, f, v] of entries) w[IDX(o, f)] = v;
  return w;
};
const MIN = OBM_WEIGHT_MIN; const MAX = OBM_WEIGHT_MAX;
const DOSE: Record<Arm, number[] | null> = {
  ABSENT: null,
  'ARMED-ZERO': ZERO_MATRIX(),
  'MARKER-ESCAPE': matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX]),
  'SPACE-SEEK': matrix([O_WIDTH, F3, MAX], [O_DEPTH, F3, MIN]),
  'KITCHEN-SINK': ((): number[] => {
    const w = ZERO_MATRIX();
    for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) {
      w[IDX(O_DEPTH, f)] = MIN;
      w[IDX(O_WIDTH, f)] = MAX;
      w[IDX(O_SUPPORT, f)] = MAX;
      w[IDX(O_RUN, f)] = MIN;
    }
    return w;
  })(),
};
/** ⭐⭐ G-DOSE-COPY's SECOND, INDEPENDENTLY SHAPED DERIVATION, straight off the OBM_* exports:
 *  a full (output × feature) sweep that fills each slot from a per-arm rule, compared slot for
 *  slot against the byte-copied matrices above. A different shape over the same convention. */
const doseFromExports = (arm: Arm): number[] | null => {
  const nF = OBM_FEATURE_KEYS.length;
  const nO = OBM_OUTPUT_KEYS.length;
  if (arm === 'ABSENT') return null;
  const w = new Array<number>(nO * nF).fill(0);
  for (let o = 0; o < nO; o++) {
    for (let f = 0; f < nF; f++) {
      const slot = o * nF + f;
      if (arm === 'ARMED-ZERO') w[slot] = 0;
      else if (arm === 'MARKER-ESCAPE') {
        w[slot] = (f === 1 && (o === 0 || o === 1)) ? OBM_WEIGHT_MAX : 0;
      } else if (arm === 'SPACE-SEEK') {
        w[slot] = f !== 2 ? 0 : o === 1 ? OBM_WEIGHT_MAX : o === 0 ? OBM_WEIGHT_MIN : 0;
      } else {
        w[slot] = (o === 0 || o === 3) ? OBM_WEIGHT_MIN : OBM_WEIGHT_MAX;
      }
    }
  }
  return w;
};
const DOSE_COPY_ROWS = ARMS.map((a) => {
  const got = DOSE[a];
  const want = doseFromExports(a);
  const slots = got === null || want === null ? [] : got.map((v, i) => ({
    slot: i, output: OBM_OUTPUT_KEYS[Math.floor(i / OBM_FEATURE_KEYS.length)],
    feature: OBM_FEATURE_KEYS[i % OBM_FEATURE_KEYS.length],
    copied: v, rederived: want[i], same: v === want[i],
  }));
  return {
    arm: a, copiedMatrix: got, rederivedFromExports: want,
    lengthOk: got === null ? want === null : got.length === OBM_WEIGHT_SLOTS,
    slotForSlot: got === null ? want === null : slots.every((s) => s.same),
    slots,
    cornersOnly: got === null ? true
      : got.every((v) => v === 0 || v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX),
    nonZeroSlots: got === null ? 0 : got.filter((v) => v !== 0).length,
  };
});
const DOSE_COPY_OK = DOSE_COPY_ROWS.every((r) => r.lengthOk && r.slotForSlot && r.cornersOnly);

/** ⭐⭐ OBM-T1's ARMING CHECKLIST, COPIED: the 16-weight MATRIX on ALL THREE genome views of
 *  BOTH teams (#196.3-D6; re-authorized for this exam by #389 item 4(i), which names "ALL
 *  THREE genome views of BOTH teams" in terms). */
const armMatrix = (m: Match, w: readonly number[] | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (w === null) delete g.offballMovementWeights;
      else g.offballMovementWeights = [...w];
    }
  }
};
/** G-ARM's gene-channel receipt: is the matrix present, full-length, on all six views? */
const genesOnAllViews = (m: Match): boolean => m.teams.every((t) => (
  [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => Array.isArray(g.offballMovementWeights)
  && g.offballMovementWeights.length === OBM_WEIGHT_SLOTS));

/** LN-C0's own team construction, BYTE FOR BYTE (G-REPRO-LNC0 depends on it). */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐⭐ THE ARM CONSTRUCTION. The ABSENT arm is LN-C0's `buildMatch(seed, 'E13')` BYTE FOR
 *  BYTE — the composer CALLED, the flag set NEVER copied. Every other arm is that same
 *  construction PLUS the `obmMovement` MatchConfig flag and the matrix written afterwards.
 *  ⭐ THE TWO-DOORS DECLARATION, IN CODE: `ctbSupportPlane` is NEVER passed in ANY arm, so the
 *  policy's INTERCEPT is a hard 0 and what is dosed is the DYNAMIC term ALONE. Asserted per
 *  arm in the construction receipt (FLAG-HYGIENE), never merely stated. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const base = {
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
  };
  const d = DOSE[arm];
  const m = d === null
    ? new Match(base as ConstructorParameters<typeof Match>[0])
    : new Match({ ...base, obmMovement: true } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, BQ_WORLD_VERSION);
  if (d !== null) armMatrix(m, d);
  return m;
};

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — LN-C0's, COPIED byte for byte, PURE           */
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
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
const inCorridorOf = (
  fromX: number, fromY: number, aimX: number, aimY: number,
  px: number, py: number, halfWidth: number,
): boolean => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  if (Math.hypot(cp.x - fromX, cp.y - fromY) < DV_CLEAR_RADIUS) return false;
  return Math.hypot(cp.x - px, cp.y - py) < halfWidth;
};
const centreLineDistOf = (
  fromX: number, fromY: number, aimX: number, aimY: number, px: number, py: number,
): number => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  return Math.hypot(cp.x - px, cp.y - py);
};
const DESIGNATIONS = ['runner', 'arriver', 'overlapper', 'chaser', 'none'] as const;
type Designation = (typeof DESIGNATIONS)[number];
const DGI = (d: Designation): number => DESIGNATIONS.indexOf(d);
interface DesigSets {
  runners: ReadonlySet<number>; arriver: number | null; overlapper: number | null;
  chasers: ReadonlySet<number>;
}
const designationOf = (index: number, s: DesigSets): Designation =>
  (s.runners.has(index) ? 'runner'
    : s.arriver === index ? 'arriver'
      : s.overlapper === index ? 'overlapper'
        : s.chasers.has(index) ? 'chaser' : 'none');
const isDesignated = (d: Designation): boolean =>
  d === 'runner' || d === 'arriver' || d === 'overlapper';
/** ⭐⭐ LN-C0's FIVE CAUSE CLASSES in the FROZEN precedence L1 > L2 > L3a > L3b > L4 —
 *  UNCHANGED, so that G-REPRO-LNC0 compares like with like. */
const CAUSES = ['L1', 'L2', 'L3a', 'L3b', 'L4'] as const;
type Cause = (typeof CAUSES)[number];
const LCI = (c: Cause): number => CAUSES.indexOf(c);
interface CauseInput { designation: Designation; action: string; spotInLane: boolean }
const causeOf = (i: CauseInput): Cause => {
  if (isDesignated(i.designation)) return 'L1';
  if (i.action === 'SupportBallCarrier') return 'L2';
  if (i.action === 'MoveToFormationSpot') return i.spotInLane ? 'L3a' : 'L3b';
  return 'L4';
};
/** ⭐⭐ THE FOURTH LICENCE, #389 item 4(ii) — `p.wallRun` LIVE at the tick.
 *  WHERE L1w SITS: in a SECOND, PARALLEL precedence `L1 > L1w > L2 > L3a > L3b > L4`, stored
 *  BESIDE the five-class composition and never folded into L1. A body already carrying a
 *  TEAM-SET designation stays L1 (the engine's own ledger is still read first); an
 *  UNDESIGNATED body whose `p.wallRun` licence is live becomes L1w; everything else falls
 *  through the five-class ladder unchanged. ⛔ Both compositions are stored in full, on the
 *  same denominator, so neither is a second copy of the other.
 *  THE PREDICATE: `p.wallRun !== null && simTime < p.wallRun.until` (the LICENCE window; the
 *  brain's own burst gate is the narrower `simTime < until − 1.1`, anchored at §3 — this class
 *  reads the LICENCE, and says so). */
const CAUSES_W = ['L1', 'L1w', 'L2', 'L3a', 'L3b', 'L4'] as const;
type CauseW = (typeof CAUSES_W)[number];
const LWI = (c: CauseW): number => CAUSES_W.indexOf(c);
const wallRunLiveOf = (until: number | null, simTime: number): boolean =>
  until !== null && simTime < until;
const causeWOf = (i: CauseInput, wallRunLive: boolean): CauseW => {
  if (isDesignated(i.designation)) return 'L1';
  if (wallRunLive) return 'L1w';
  if (i.action === 'SupportBallCarrier') return 'L2';
  if (i.action === 'MoveToFormationSpot') return i.spotInLane ? 'L3a' : 'L3b';
  return 'L4';
};
const PAIRS = ['P1', 'P2', 'P3', 'P4', 'P5'] as const;
type PairClass = (typeof PAIRS)[number];
const PCI = (c: PairClass): number => PAIRS.indexOf(c);
interface PairInput {
  dA: Designation; dB: Designation; aA: string; aB: string; spotsWithin: boolean;
}
const pairClassOf = (i: PairInput): PairClass => {
  if (isDesignated(i.dA) || isDesignated(i.dB)) return 'P2';
  if (i.aA === 'SupportBallCarrier' || i.aB === 'SupportBallCarrier') return 'P3';
  if (i.aA === 'MoveToFormationSpot' && i.aB === 'MoveToFormationSpot') {
    return i.spotsWithin ? 'P1' : 'P4';
  }
  return 'P5';
};
const PRESENCE = ['present', 'arrived', 'noWindup'] as const;
type Presence = (typeof PRESENCE)[number];
const PRI = (p: Presence): number => PRESENCE.indexOf(p);
const presenceOf = (hasArm: boolean, inLaneAtArm: boolean): Presence =>
  (!hasArm ? 'noWindup' : inLaneAtArm ? 'present' : 'arrived');
/** ⭐⭐ PT-C0's CROWD LIMBS, COPIED byte for byte (LN-C0's copy). */
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
const dupRunPairsAltOf = (xs: readonly number[], ys: readonly number[]): number => {
  const ds: number[] = [];
  for (let a = 0; a < xs.length; a++) {
    for (let b = 0; b < xs.length; b++) {
      if (b > a) ds.push(Math.hypot(xs[a] - xs[b], ys[a] - ys[b]));
    }
  }
  return ds.filter((d) => d < DUP_RUN_M).length;
};
const crashAltOf = (xs: readonly number[], ys: readonly number[]): boolean => {
  const ds: number[] = [];
  for (let a = 0; a < xs.length; a++) {
    for (let b = 0; b < xs.length; b++) {
      if (b > a) ds.push(Math.hypot(xs[a] - xs[b], ys[a] - ys[b]));
    }
  }
  return ds.length > 0 && Math.min(...ds) < DUP_RUN_M;
};

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.throughBall', klassOf({ ...D0, passes: 1, throughBalls: 1 }, false), 'throughBall');
fx('klassOf.cutback', klassOf({ ...D0, passes: 1, cutbacks: 1 }, false), 'cutback');
fx('klassOf.crossIsNotMeasured', klassOf({ ...D0, passes: 1, crosses: 1 }, false), 'cross');
fx('klassOf.shotWins', klassOf({ ...D0, passes: 1, shots: 1 }, false), 'shot');
fx('klassOf.nothingIsNull', klassOf({ ...D0 }, false), null);
fx('population.shortPassGroundWithTarget', isMeasurableGroundPass('shortPass', true, true), true);
fx('population.noTargetIsOut', isMeasurableGroundPass('shortPass', true, false), false);
fx('population.airborneIsOut', isMeasurableGroundPass('shortPass', false, true), false);
fx('population.crossIsOut', isMeasurableGroundPass('cross', true, true), false);
fx('groundLaunch.groundedIsGround', isGroundLaunch(true, 5), true);
fx('groundLaunch.risingIsNot', isGroundLaunch(false, 5), false);
fx('groundLaunch.fallingIsGround', isGroundLaunch(false, -1), true);
fx('delivery.shotIsNotADelivery', isDelivery('shot'), false);
fx('firstBody.target', contactClassOf(7, 7, 0, 0), 'ownTarget');
fx('firstBody.ownNonTarget', contactClassOf(5, 7, 0, 0), 'ownNonTarget');
fx('firstBody.opponent', contactClassOf(9, 7, 1, 0), 'opponent');
fx('firstBody.none', contactClassOf(null, 7, null, 0), 'none');
fx('corridor.onTheLineIsInside', inCorridorOf(0, 0, 20, 0, 10, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.threeMetresOffIsInside', inCorridorOf(0, 0, 20, 0, 10, 3, DV_CORRIDOR_SCALE), true);
fx('corridor.fourMetresOffIsOutside', inCorridorOf(0, 0, 20, 0, 10, 4, DV_CORRIDOR_SCALE), false);
fx('corridor.beyondTheAimIsClamped', inCorridorOf(0, 0, 20, 0, 30, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.atThePassersFeetIsExcluded', inCorridorOf(0, 0, 20, 0, 1, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.clearGuardIsTheEngineConstant',
  inCorridorOf(0, 0, 20, 0, DV_CLEAR_RADIUS + 0.01, 0, DV_CORRIDOR_SCALE), true);
fx('corridor.clearGuardExcludesInsideIt',
  inCorridorOf(0, 0, 20, 0, DV_CLEAR_RADIUS - 0.01, 0, DV_CORRIDOR_SCALE), false);
fx('corridor.tightVariantExcludesThreeMetres',
  inCorridorOf(0, 0, 20, 0, 10, 3, CONTROL_RADIUS), false);
fx('corridor.tightVariantKeepsTheLine', inCorridorOf(0, 0, 20, 0, 10, 0, CONTROL_RADIUS), true);
fx('corridor.centreLineDistance', near(centreLineDistOf(0, 0, 20, 0, 10, 3), 3), true);
fx('spotInLane.spotOnTheLineIsInside', inCorridorOf(0, 0, 20, 0, 12, 1, DV_CORRIDOR_SCALE), true);
fx('spotInLane.spotFiveMetresOffIsOutside',
  inCorridorOf(0, 0, 20, 0, 12, 5, DV_CORRIDOR_SCALE), false);
const setsFx = (runners: number[], arriver: number | null, overlapper: number | null,
  chasers: number[]): DesigSets => ({
  runners: new Set(runners), arriver, overlapper, chasers: new Set(chasers),
});
fx('ledger.noneWhenEverySetIsEmpty', designationOf(2, setsFx([], null, null, [])), 'none');
fx('ledger.runnerWhenTheSetSaysSo', designationOf(2, setsFx([2], null, null, [])), 'runner');
fx('ledger.editingTheSetMovesTheClassOut', designationOf(2, setsFx([3], null, null, [])), 'none');
fx('ledger.arriver', designationOf(4, setsFx([], 4, null, [])), 'arriver');
fx('ledger.overlapper', designationOf(5, setsFx([], null, 5, [])), 'overlapper');
fx('ledger.chaser', designationOf(1, setsFx([], null, null, [1])), 'chaser');
fx('ledger.runnerBeatsArriver', designationOf(2, setsFx([2], 2, null, [])), 'runner');
fx('ledger.arriverBeatsOverlapper', designationOf(2, setsFx([], 2, 2, [])), 'arriver');
fx('ledger.overlapperBeatsChaser', designationOf(2, setsFx([], null, 2, [2])), 'overlapper');
fx('ledger.chaserIsNotDesignatedForL1', isDesignated('chaser'), false);
fx('ledger.runnerIsDesignated', isDesignated('runner'), true);
fx('ledger.noneIsNotDesignated', isDesignated('none'), false);
const CU = (d: Designation, a: string, s: boolean): CauseInput =>
  ({ designation: d, action: a, spotInLane: s });
fx('cause.L1.runnerWhateverHisAction', causeOf(CU('runner', 'MakeRun', false)), 'L1');
fx('cause.L1.runnerEvenWhileSupporting', causeOf(CU('runner', 'SupportBallCarrier', false)), 'L1');
fx('cause.L1.arriver', causeOf(CU('arriver', 'MakeRun', false)), 'L1');
fx('cause.L1.overlapper', causeOf(CU('overlapper', 'MakeRun', false)), 'L1');
fx('cause.L2.undesignatedSupport', causeOf(CU('none', 'SupportBallCarrier', false)), 'L2');
fx('cause.L2.chaserSupportIsStillL2', causeOf(CU('chaser', 'SupportBallCarrier', false)), 'L2');
fx('cause.L3a.spotInLane', causeOf(CU('none', 'MoveToFormationSpot', true)), 'L3a');
fx('cause.L3b.spotOutside', causeOf(CU('none', 'MoveToFormationSpot', false)), 'L3b');
fx('cause.L4.chaseBall', causeOf(CU('none', 'ChaseBall', false)), 'L4');
fx('cause.L4.makeRunWithoutALicenceIsOther', causeOf(CU('none', 'MakeRun', false)), 'L4');
/* ⭐⭐ THE FOURTH LICENCE, L1w — its predicate and its place in the parallel precedence */
fx('wallRun.nullIsNotLive', wallRunLiveOf(null, 10), false);
fx('wallRun.futureUntilIsLive', wallRunLiveOf(12.3, 10), true);
fx('wallRun.pastUntilIsNotLive', wallRunLiveOf(9.9, 10), false);
fx('wallRun.expiryIsStrict', wallRunLiveOf(10, 10), false);
fx('causeW.L1BeatsL1w', causeWOf(CU('runner', 'MakeRun', false), true), 'L1');
fx('causeW.arriverBeatsL1w', causeWOf(CU('arriver', 'MakeRun', false), true), 'L1');
fx('causeW.L1wWhenUndesignatedAndLive', causeWOf(CU('none', 'MakeRun', false), true), 'L1w');
fx('causeW.L1wBeatsL2', causeWOf(CU('none', 'SupportBallCarrier', false), true), 'L1w');
fx('causeW.L1wBeatsL3a', causeWOf(CU('none', 'MoveToFormationSpot', true), true), 'L1w');
fx('causeW.deadLicenceFallsThroughToL4', causeWOf(CU('none', 'MakeRun', false), false), 'L4');
fx('causeW.deadLicenceFallsThroughToL2',
  causeWOf(CU('none', 'SupportBallCarrier', false), false), 'L2');
fx('causeW.agreesWithTheFiveClassLadderWhenNoLicence',
  CAUSES.every((c) => true) && (['MakeRun', 'SupportBallCarrier', 'MoveToFormationSpot',
    'ChaseBall'] as const).every((a) => ([true, false] as const).every((s) =>
    (['runner', 'none', 'chaser'] as const).every((d) =>
      causeWOf(CU(d, a, s), false) === causeOf(CU(d, a, s))))), true);
const PU = (dA: Designation, dB: Designation, aA: string, aB: string,
  w: boolean): PairInput => ({ dA, dB, aA, aB, spotsWithin: w });
fx('pair.P1.bothShapeSpotsWithin',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)), 'P1');
fx('pair.P4.bothShapeSpotsApart',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', false)), 'P4');
fx('pair.P2.oneDesignated',
  pairClassOf(PU('runner', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)), 'P2');
fx('pair.P3.oneSupporterNoneDesignated',
  pairClassOf(PU('none', 'none', 'SupportBallCarrier', 'ChaseBall', false)), 'P3');
fx('pair.P5.other', pairClassOf(PU('none', 'none', 'ChaseBall', 'MarkOpponent', true)), 'P5');
fx('presence.present', presenceOf(true, true), 'present');
fx('presence.arrived', presenceOf(true, false), 'arrived');
fx('presence.noWindup', presenceOf(false, false), 'noWindup');
fx('presence.noWindupBeatsInLane', presenceOf(false, true), 'noWindup');
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.singletonIsInfinite', !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.countsEachPairOnce', dupRunPairsOf([0, 1, 2], [0, 0, 0]), 3);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('crowd.altAgreesOnPairs', dupRunPairsAltOf([0, 1, 2, 9], [0, 0, 0, 0]),
  dupRunPairsOf([0, 1, 2, 9], [0, 0, 0, 0]));
fx('crowd.altAgreesOnCrash', crashAltOf([0, 1, 9], [0, 0, 0]),
  minPairwiseOf([0, 1, 9], [0, 0, 0]) < DUP_RUN_M);
fx('crowd.altAgreesOnNoCrash', crashAltOf([0, 9], [0, 0]),
  minPairwiseOf([0, 9], [0, 0]) < DUP_RUN_M);
/* ⭐⭐ THE GUARD LIMBS — OBM-T1's own three folds, on constructed samples */
fx('guard.spacingMedianIsTheMedianPairDistance', quantileOf([1, 2, 3, 4, 5], 0.5), 3);
fx('guard.spacingUnder4CountsStrictlyBelowFour',
  [1, 3.99, 4, 5].filter((v) => v < CLOSE_PAIR_M).length / 4, 0.5);
fx('guard.spreadYIsTheSampleSd', near(sdOf([0, 2]), 1), true);
fx('guard.pairSubsampleIsSix', PAIR_SUBSAMPLE, 6);
fx('guard.closePairIsFourMetres', CLOSE_PAIR_M, 4);
/* ⭐⭐ THE DOSE COPY — the three matrices re-derived from the exports, slot for slot */
fx('dose.armedZeroIsAllZero', (DOSE['ARMED-ZERO'] as number[]).every((v) => v === 0), true);
fx('dose.absentIsNull', DOSE.ABSENT, null);
fx('dose.markerEscapeSlots',
  (DOSE['MARKER-ESCAPE'] as number[]).map((v, i) => (v !== 0 ? i : -1)).filter((i) => i >= 0),
  [IDX(O_DEPTH, F2), IDX(O_WIDTH, F2)]);
fx('dose.spaceSeekSlots',
  (DOSE['SPACE-SEEK'] as number[]).map((v, i) => (v !== 0 ? i : -1)).filter((i) => i >= 0),
  [IDX(O_DEPTH, F3), IDX(O_WIDTH, F3)]);
fx('dose.kitchenSinkFillsEverySlot',
  (DOSE['KITCHEN-SINK'] as number[]).filter((v) => v !== 0).length, OBM_WEIGHT_SLOTS);
fx('dose.everyNonZeroIsADomainCorner', DOSE_COPY_ROWS.every((r) => r.cornersOnly), true);
fx('dose.slotForSlotAgainstTheExports', DOSE_COPY_ROWS.every((r) => r.slotForSlot), true);
/* the bin helpers */
fx('binOf.first', binOf(0.4, 2, 13), 0);
fx('binOf.overflow', binOf(999, 2, 13), 12);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 13), 6);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
fx('actions.vocabularyIsTheUnions', ACTIONS.length, 23);
fx('actions.firstIsTheDefault', ACTIONS[0], 'MoveToFormationSpot');
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 THE FROZEN BINS — LN-C0's, INHERITED. ⚠ Every width/count is a STORED BIN EDGE of a
   histogram: never a rule, never a threshold; no read word depends on one.                  */
/* ========================================================================== */
const NEAR_BIN_M = 0.5; const NEAR_BINS = 61;
const MINPAIR_BIN_M = 0.5; const MINPAIR_BINS = 61;
const OCC_BINS = 7;
const DCARR_BIN_M = 2; const DCARR_BINS = 16;
const DCENT_BIN_M = 0.5; const DCENT_BINS = 12;
const DTGT_BIN_M = 5; const DTGT_BINS = 13;
const VACROSS_BIN_MS = 1; const VACROSS_BINS = 13;
const VALONG_BIN_MS = 1; const VALONG_BINS = 13;
const PAIRMID_BIN_M = 2; const PAIRMID_BINS = 16;
const FLIGHT_RETIRE_TICKS = 720;

/* ========================================================================== */
/* §8 THE PER-SEED ROW — LN-C0's, INHERITED FIELD FOR FIELD, plus this exam's own */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots',
  'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls', 'headersWon'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  ticks: number; wallMs: number; armedVersion: number;
  worldOk: boolean; cushionOk: boolean; seamsAbsent: boolean; rcBfAbsent: boolean;
  genomeClean: boolean; ctbPlaneShut: boolean; emergentOn: boolean;
  /* --- POPULATION A: THE LANE --- */
  gpFlights: number; gpWithLine: number; gpWithArm: number; gpNoArm: number;
  occPerPassBins: number[];
  occN: number; occNTight: number; passesWithOcc: number; passesWithOccTight: number;
  eligibleBodies: number; spotInLaneAll: number; supportSpotInLaneAll: number;
  hasBallRecipeAgrees: number; armBodyMissing: number;
  causeN: number[]; causeSpotInLane: number[]; causeSupportSpotInLane: number[];
  causePresence: number[][]; caromHits: number[];
  occDesig: number[]; occAction: number[]; l4Action: number[];
  distCarrierBins: number[]; distCentreBins: number[]; distTargetBins: number[];
  vAcrossBins: number[]; vAlongBins: number[];
  firstBody: number[];
  oppN: number; oppPresence: number[]; oppNTight: number; oppPresenceTight: number[];
  passesWithOpp: number; passesWithOppTight: number; passesWithLiveDesignation: number;
  /* --- POPULATION B: THE CROWD (PT-C0's limbs) --- */
  crowdSampleTicks: number; crowdUnattributed: number; crowdSamples: number;
  spacingSum: number; spacingSamples: number; nearBins: number[];
  dupRunSum: number; minPairBins: number[]; crashHits: number;
  dupRunSumAlt: number; crashHitsAlt: number;
  pairsTotal: number; pairN: number[]; pairSpotsWithin: number;
  pairEitherSupport: number; pairEitherRunner: number; pairCarrierDistBins: number[];
  pairNoCarrier: number; ownedSamples: number;
  /* --- THE DESIGNATION LEDGER --- */
  runnersSampleSum: number; chasersSampleSum: number;
  arriverLiveSamples: number; overlapperLiveSamples: number;
  runnersDistinct: number; arriverDistinct: number; overlapperDistinct: number;
  chasersDistinct: number;
  /* --- CONTEXT --- */
  goals: number; passes: number; passesCompleted: number; interceptions: number; shots: number;
  /* --- ⭐⭐ LN-T1's OWN ADDITIONS (never compared by G-REPRO-LNC0) --- */
  obmFlag: boolean; matrixOnAllViews: boolean; perceptArmed: boolean;
  policyCacheEntries: number;
  causeNW: number[]; caromHitsW: number[]; occWallRunLive: number;
  offsides: number;
  guardSamples: number; guardPairSamples: number;
  guardSpreadYOutSum: number; guardSpreadYOutN: number;
  guardSpreadYInSum: number; guardSpreadYInN: number;
  guardSpacingMedianSum: number; guardSpacingMedianN: number;
  guardU4Sum: number; guardU4N: number;
  guardPairsTotal: number; guardPairsUnder4: number;
  signature: string;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, armedVersion: 0,
  worldOk: false, cushionOk: false, seamsAbsent: false, rcBfAbsent: false,
  genomeClean: false, ctbPlaneShut: false, emergentOn: false,
  gpFlights: 0, gpWithLine: 0, gpWithArm: 0, gpNoArm: 0,
  occPerPassBins: zeros(OCC_BINS),
  occN: 0, occNTight: 0, passesWithOcc: 0, passesWithOccTight: 0,
  eligibleBodies: 0, spotInLaneAll: 0, supportSpotInLaneAll: 0,
  hasBallRecipeAgrees: 0, armBodyMissing: 0,
  causeN: zeros(CAUSES.length), causeSpotInLane: zeros(CAUSES.length),
  causeSupportSpotInLane: zeros(CAUSES.length),
  causePresence: zeros2(CAUSES.length, PRESENCE.length), caromHits: zeros(CAUSES.length),
  occDesig: zeros(DESIGNATIONS.length), occAction: zeros(ACTION_CELLS.length),
  l4Action: zeros(ACTION_CELLS.length),
  distCarrierBins: zeros(DCARR_BINS), distCentreBins: zeros(DCENT_BINS),
  distTargetBins: zeros(DTGT_BINS),
  vAcrossBins: zeros(VACROSS_BINS), vAlongBins: zeros(VALONG_BINS),
  firstBody: zeros(CONTACTS.length),
  oppN: 0, oppPresence: zeros(PRESENCE.length), oppNTight: 0,
  oppPresenceTight: zeros(PRESENCE.length),
  passesWithOpp: 0, passesWithOppTight: 0, passesWithLiveDesignation: 0,
  crowdSampleTicks: 0, crowdUnattributed: 0, crowdSamples: 0,
  spacingSum: 0, spacingSamples: 0, nearBins: zeros(NEAR_BINS),
  dupRunSum: 0, minPairBins: zeros(MINPAIR_BINS), crashHits: 0,
  dupRunSumAlt: 0, crashHitsAlt: 0,
  pairsTotal: 0, pairN: zeros(PAIRS.length), pairSpotsWithin: 0,
  pairEitherSupport: 0, pairEitherRunner: 0, pairCarrierDistBins: zeros(PAIRMID_BINS),
  pairNoCarrier: 0, ownedSamples: 0,
  runnersSampleSum: 0, chasersSampleSum: 0, arriverLiveSamples: 0, overlapperLiveSamples: 0,
  runnersDistinct: 0, arriverDistinct: 0, overlapperDistinct: 0, chasersDistinct: 0,
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0,
  obmFlag: false, matrixOnAllViews: false, perceptArmed: false,
  policyCacheEntries: 0,
  causeNW: zeros(CAUSES_W.length), caromHitsW: zeros(CAUSES_W.length), occWallRunLive: 0,
  offsides: 0,
  guardSamples: 0, guardPairSamples: 0,
  guardSpreadYOutSum: 0, guardSpreadYOutN: 0,
  guardSpreadYInSum: 0, guardSpreadYInN: 0,
  guardSpacingMedianSum: 0, guardSpacingMedianN: 0,
  guardU4Sum: 0, guardU4N: 0,
  guardPairsTotal: 0, guardPairsUnder4: 0,
  signature: '',
});

interface ArmBody { inWide: boolean; inTight: boolean; desig: Designation; action: string }
interface Windup {
  key: string; gid: number; targetGid: number; eX: number; eY: number; carried: boolean;
  armTick: number; bodies: Map<number, ArmBody>;
}
interface Occ {
  gid: number; desig: Designation; action: string; spotInLane: boolean;
  supportSpotInLane: boolean; presence: Presence; cause: Cause;
  wallRunLive: boolean; causeW: CauseW;
  distCarrier: number; distCentre: number; distTarget: number;
  vAcross: number; vAlong: number; tight: boolean;
}
interface OppOcc { gid: number; presence: Presence; tight: boolean }
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  hasLine: boolean; contactSeen: boolean; firstBodyGid: number | null;
  firstBodyClass: ContactClass; occupants: Occ[]; oppOccupants: OppOcc[];
  occTight: number; oppTight: number; hasArm: boolean;
}
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: { x: number; y: number }; targetGid: number;
      aimLead: { x: number; y: number } | null;
    } | null;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    obmMovement?: boolean; ctbSupportPlane?: boolean; bqCushion?: boolean;
    pmLaneConvergence?: boolean; abandonRestDesignation?: Side | null;
  };
  row.armedVersion = bqArmedVersion(m);
  row.obmFlag = mm.obmMovement === true;
  row.matrixOnAllViews = genesOnAllViews(m);
  row.perceptArmed = (m as unknown as { edsPerceivedChoice: boolean }).edsPerceivedChoice === true;
  row.worldOk = row.armedVersion === BQ_WORLD_VERSION;
  row.cushionOk = mm.bqCushion === true;
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true;
  row.rcBfAbsent = mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.ctbPlaneShut = mm.ctbSupportPlane !== true;
  row.emergentOn = emergentPosOn();
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      raAccessWeight?: number; passLeadSupport?: number; dvExposureWeight?: number;
      rcReadyWeight?: number; ctbSupportDepth?: number; obmSupportWeight?: number;
    };
    return g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined && g.rcReadyWeight === undefined
      && g.ctbSupportDepth === undefined && g.obmSupportWeight === undefined;
  });
  const players = m.allPlayers;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let wu: Windup | null = null;
  let endedWindup: Windup | null = null;
  let flight: GpFlight | null = null;
  /** ⭐⭐ OBM-T1's GUARD LIMBS, COPIED (its own `spreadOut`/`spreadIn`/`pairs` shape), read at
   *  LN-C0's OWN already-anchored sample site (`tick % SAMPLE_EVERY === 0 && playing`). */
  const gPairs: [number[], number[]] = [[], []];
  const gSpreadOut: [number[], number[]] = [[], []];
  const gSpreadIn: [number[], number[]] = [[], []];
  const runnersEver = new Set<number>();
  const arriverEver = new Set<number>();
  const overlapperEver = new Set<number>();
  const chasersEver = new Set<number>();

  /** the team's OWN sets at THIS tick — read, never inferred */
  const setsOf = (side: Side): DesigSets => {
    const t = m.teams[side];
    return { runners: t.runners, arriver: t.arriver, overlapper: t.overlapper,
      chasers: t.chasers };
  };
  /** ⭐⭐ THE TWO CALLED RECONSTRUCTIONS, with the PRODUCTION ARGUMENT RECIPE (anchored) and
   *  the census's own declared `hasBall = true` for the side in possession (#388 item 2(ii)). */
  const spotOf = (idx: number, side: Side): { x: number; y: number } => formationSpot(
    m.teams[side].players[idx], m.teams[side], m.ball, true, m.teams[1 - side],
    mm.abandonRestDesignation === side,
    mm.pmLaneConvergence === true && m.phase === 'playing',
  );
  const supportOf = (idx: number, side: Side): { x: number; y: number } => supportSpot(
    m.teams[side].players[idx], m.teams[side], m.ball, mm.ctbSupportPlane === true,
  );

  const bookFlight = (f: GpFlight): void => {
    row.firstBody[CTI(f.firstBodyClass)] += 1;
    row.occPerPassBins[Math.min(OCC_BINS - 1, f.occupants.length)] += 1;
    row.occN += f.occupants.length;
    row.occNTight += f.occTight;
    if (f.occupants.length > 0) row.passesWithOcc += 1;
    if (f.occTight > 0) row.passesWithOccTight += 1;
    row.oppN += f.oppOccupants.length;
    row.oppNTight += f.oppTight;
    if (f.oppOccupants.length > 0) row.passesWithOpp += 1;
    if (f.oppTight > 0) row.passesWithOppTight += 1;
    for (const o of f.occupants) {
      const ci = LCI(o.cause);
      row.causeN[ci] += 1;
      row.causePresence[ci][PRI(o.presence)] += 1;
      if (o.spotInLane) row.causeSpotInLane[ci] += 1;
      if (o.supportSpotInLane) row.causeSupportSpotInLane[ci] += 1;
      if (f.firstBodyGid !== null && f.firstBodyGid === o.gid) row.caromHits[ci] += 1;
      const wi = LWI(o.causeW);
      row.causeNW[wi] += 1;
      if (o.wallRunLive) row.occWallRunLive += 1;
      if (f.firstBodyGid !== null && f.firstBodyGid === o.gid) row.caromHitsW[wi] += 1;
      row.occDesig[DGI(o.desig)] += 1;
      row.occAction[AI(o.action)] += 1;
      if (o.cause === 'L4') row.l4Action[AI(o.action)] += 1;
      row.distCarrierBins[binOf(o.distCarrier, DCARR_BIN_M, DCARR_BINS)] += 1;
      row.distCentreBins[binOf(o.distCentre, DCENT_BIN_M, DCENT_BINS)] += 1;
      row.distTargetBins[binOf(o.distTarget, DTGT_BIN_M, DTGT_BINS)] += 1;
      row.vAcrossBins[signedBinOf(o.vAcross, VACROSS_BIN_MS, VACROSS_BINS)] += 1;
      row.vAlongBins[signedBinOf(o.vAlong, VALONG_BIN_MS, VALONG_BINS)] += 1;
    }
    for (const o of f.oppOccupants) {
      row.oppPresence[PRI(o.presence)] += 1;
      if (o.tight) row.oppPresenceTight[PRI(o.presence)] += 1;
    }
  };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
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

    /* ---------- THE DESIGNATION LEDGER, READ EVERY TICK ---------- */
    for (const side of [0, 1] as const) {
      const t = m.teams[side];
      for (const idx of t.runners) runnersEver.add(t.players[idx].gid);
      if (t.arriver !== null) arriverEver.add(t.players[t.arriver].gid);
      if (t.overlapper !== null) overlapperEver.add(t.players[t.overlapper].gid);
      for (const idx of t.chasers) chasersEver.add(t.players[idx].gid);
    }

    /* ---------- THE WIND-UP RECORD: THE ARM TICK, SNAPSHOTTED ---------- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    endedWindup = null;
    if (wu !== null && key !== wu.key) { endedWindup = wu; wu = null; }
    if (rec !== null && (wu === null || key !== wu.key)) {
      const lead = rec.aimLead;
      const eX = rec.aim.x + (lead?.x ?? 0);
      const eY = rec.aim.y + (lead?.y ?? 0);
      const passer = players[rec.gid];
      const px = passer.pos.x; const py = passer.pos.y;
      const bodies = new Map<number, ArmBody>();
      const armHasLine = Math.hypot(eX - px, eY - py) > 1e-6;
      for (const q of players) {
        if (q.gid === rec.gid || q.role === 'GK' || q.sentOff) continue;
        bodies.set(q.gid, {
          inWide: armHasLine
            && inCorridorOf(px, py, eX, eY, q.pos.x, q.pos.y, DV_CORRIDOR_SCALE),
          inTight: armHasLine
            && inCorridorOf(px, py, eX, eY, q.pos.x, q.pos.y, CONTROL_RADIUS),
          desig: designationOf(q.index, setsOf(q.side as Side)),
          action: q.action.type as string,
        });
      }
      wu = {
        key: key as string, gid: rec.gid, targetGid: rec.targetGid, eX, eY,
        carried: lead !== null && (lead.x !== 0 || lead.y !== 0),
        armTick: tick, bodies,
      };
    }

    /* ---------- THE GROUND-PASS RELEASE (PT-C0's own detection, reused) ---------- */
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
      if (flight !== null) { bookFlight(flight); flight = null; }
      row.gpFlights += 1;
      const tGid = targetGid as number;
      const viaWindup = endedWindup !== null && endedWindup.gid === rel.gid
        && endedWindup.targetGid === tGid;
      const armRec = viaWindup ? (endedWindup as Windup) : null;
      const eX = armRec !== null ? armRec.eX : players[tGid].pos.x;
      const eY = armRec !== null ? armRec.eY : players[tGid].pos.y;
      const lx = ball.pos.x - ball.vel.x * DT;
      const ly = ball.pos.y - ball.vel.y * DT;
      const dxE = eX - lx; const dyE = eY - ly;
      const L = Math.hypot(dxE, dyE);
      const hasLine = L > 1e-6;
      const ux = hasLine ? dxE / L : 0;
      const uy = hasLine ? dyE / L : 0;
      const passer = players[rel.gid];
      const passerSide = passer.side as Side;
      if (hasLine) row.gpWithLine += 1;
      if (armRec !== null) row.gpWithArm += 1; else row.gpNoArm += 1;
      if (m.possessionSide === passerSide) row.hasBallRecipeAgrees += 1;
      const sets = setsOf(passerSide);
      if (sets.runners.size > 0 || sets.arriver !== null || sets.overlapper !== null) {
        row.passesWithLiveDesignation += 1;
      }
      const f: GpFlight = {
        passerGid: rel.gid, passerSide, targetGid: tGid, releaseTick: tick, hasLine,
        contactSeen: false, firstBodyGid: null, firstBodyClass: 'none',
        occupants: [], oppOccupants: [], occTight: 0, oppTight: 0, hasArm: armRec !== null,
      };
      if (hasLine) {
        /* ⭐ OWN OUTFIELD BODIES — neither the passer nor the target */
        for (const q of m.teams[passerSide].players) {
          if (q.role === 'GK' || q.sentOff || q.gid === rel.gid || q.gid === tGid) continue;
          const sp = spotOf(q.index, passerSide);
          const ss = supportOf(q.index, passerSide);
          const spotInLane = inCorridorOf(lx, ly, eX, eY, sp.x, sp.y, DV_CORRIDOR_SCALE);
          const supportSpotInLane = inCorridorOf(lx, ly, eX, eY, ss.x, ss.y, DV_CORRIDOR_SCALE);
          row.eligibleBodies += 1;
          if (spotInLane) row.spotInLaneAll += 1;
          if (supportSpotInLane) row.supportSpotInLaneAll += 1;
          if (!inCorridorOf(lx, ly, eX, eY, q.pos.x, q.pos.y, DV_CORRIDOR_SCALE)) continue;
          const tight = inCorridorOf(lx, ly, eX, eY, q.pos.x, q.pos.y, CONTROL_RADIUS);
          if (tight) f.occTight += 1;
          const desig = designationOf(q.index, sets);
          const action = q.action.type as string;
          const armBody = armRec === null ? undefined : armRec.bodies.get(q.gid);
          if (armRec !== null && armBody === undefined) row.armBodyMissing += 1;
          const presence = presenceOf(
            armRec !== null && armBody !== undefined, armBody?.inWide === true,
          );
          const wrLive = wallRunLiveOf(
            (q as unknown as { wallRun: { until: number } | null }).wallRun?.until ?? null,
            m.simTime,
          );
          f.occupants.push({
            gid: q.gid, desig, action, spotInLane, supportSpotInLane, presence,
            cause: causeOf({ designation: desig, action, spotInLane }),
            wallRunLive: wrLive,
            causeW: causeWOf({ designation: desig, action, spotInLane }, wrLive),
            distCarrier: Math.hypot(q.pos.x - passer.pos.x, q.pos.y - passer.pos.y),
            distCentre: centreLineDistOf(lx, ly, eX, eY, q.pos.x, q.pos.y),
            distTarget: Math.hypot(q.pos.x - players[tGid].pos.x,
              q.pos.y - players[tGid].pos.y),
            vAcross: q.vel.x * -uy + q.vel.y * ux,
            vAlong: q.vel.x * ux + q.vel.y * uy,
            tight,
          });
        }
        /* ⭐ THE OPPONENTS IN THE LANE — published BESIDE, never read */
        for (const o of m.teams[1 - passerSide].players) {
          if (o.role === 'GK' || o.sentOff) continue;
          if (!inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, DV_CORRIDOR_SCALE)) continue;
          const tight = inCorridorOf(lx, ly, eX, eY, o.pos.x, o.pos.y, CONTROL_RADIUS);
          if (tight) f.oppTight += 1;
          const armBody = armRec === null ? undefined : armRec.bodies.get(o.gid);
          f.oppOccupants.push({
            gid: o.gid,
            presence: presenceOf(armRec !== null && armBody !== undefined,
              armBody?.inWide === true),
            tight,
          });
        }
      }
      flight = f;
    }

    /* ---------- FOLLOW THE FLIGHT AND BOOK THE FIRST BODY ---------- */
    if (flight !== null) {
      const f = flight;
      if (!f.contactSeen && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactSeen = true;
        f.firstBodyGid = lastTouch.gid;
        f.firstBodyClass = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
      }
      if (f.contactSeen) { bookFlight(f); flight = null; }
      else if (ball.owner !== null && ball.owner.gid !== f.passerGid) { bookFlight(f); flight = null; }
      else if (!ballIsLive) { bookFlight(f); flight = null; }
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) { bookFlight(f); flight = null; }
    }

    /* ---------- POPULATION B — 挤人, at the A4 battery's OWN cadence ---------- */
    if (tick % SAMPLE_EVERY === 0 && playing) {
      row.crowdSampleTicks += 1;
      /* ---- ⭐⭐ THE GUARDS (OBM-T1's arithmetic, BOTH sides, ungated by possession) ---- */
      row.guardSamples += 1;
      const takePairs = row.guardSamples % PAIR_SUBSAMPLE === 0;
      if (takePairs) row.guardPairSamples += 1;
      for (const t of m.teams) {
        const gside = t.side as 0 | 1;
        const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
        if (outfield.length === 0) continue;
        const gHasBall = m.possessionSide === gside;
        (gHasBall ? gSpreadIn : gSpreadOut)[gside].push(sdOf(outfield.map((p) => p.pos.y)));
        if (takePairs) {
          for (let i = 0; i < outfield.length; i++) {
            for (let j = i + 1; j < outfield.length; j++) {
              gPairs[gside].push(Math.hypot(outfield[i].pos.x - outfield[j].pos.x,
                outfield[i].pos.y - outfield[j].pos.y));
            }
          }
        }
      }
      const owner = ball.owner;
      if (owner !== null) row.ownedSamples += 1;
      const possSide: Side | null = owner !== null ? owner.side as Side
        : (flight !== null ? flight.passerSide : null);
      if (possSide === null) row.crowdUnattributed += 1;
      else {
        const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
        const xs = outs.map((q) => q.pos.x);
        const ys = outs.map((q) => q.pos.y);
        row.crowdSamples += 1;
        const sets = setsOf(possSide);
        for (let a = 0; a < xs.length; a++) {
          const nearest = nearestMateOf(xs, ys, a);
          if (Number.isFinite(nearest)) {
            row.spacingSum += nearest;
            row.spacingSamples += 1;
            row.nearBins[binOf(nearest, NEAR_BIN_M, NEAR_BINS)] += 1;
          }
        }
        row.dupRunSum += dupRunPairsOf(xs, ys);
        row.dupRunSumAlt += dupRunPairsAltOf(xs, ys);
        const mp = minPairwiseOf(xs, ys);
        if (Number.isFinite(mp)) {
          row.minPairBins[binOf(mp, MINPAIR_BIN_M, MINPAIR_BINS)] += 1;
          if (mp < DUP_RUN_M) row.crashHits += 1;
        }
        if (crashAltOf(xs, ys)) row.crashHitsAlt += 1;
        row.runnersSampleSum += sets.runners.size;
        row.chasersSampleSum += sets.chasers.size;
        if (sets.arriver !== null) row.arriverLiveSamples += 1;
        if (sets.overlapper !== null) row.overlapperLiveSamples += 1;
        /* ⭐⭐ THE DUP-RUN PAIRS, CLASSED */
        const spotCache = new Map<number, { x: number; y: number }>();
        const spotFor = (idx: number): { x: number; y: number } => {
          const hit = spotCache.get(idx);
          if (hit !== undefined) return hit;
          const v = spotOf(idx, possSide);
          spotCache.set(idx, v);
          return v;
        };
        for (let a = 0; a < outs.length; a++) {
          for (let b = a + 1; b < outs.length; b++) {
            if (Math.hypot(xs[a] - xs[b], ys[a] - ys[b]) >= DUP_RUN_M) continue;
            const pA = outs[a]; const pB = outs[b];
            const sA = spotFor(pA.index); const sB = spotFor(pB.index);
            const spotsWithin = Math.hypot(sA.x - sB.x, sA.y - sB.y) < DUP_RUN_M;
            const dA = designationOf(pA.index, sets);
            const dB = designationOf(pB.index, sets);
            const aA = pA.action.type as string;
            const aB = pB.action.type as string;
            row.pairsTotal += 1;
            row.pairN[PCI(pairClassOf({ dA, dB, aA, aB, spotsWithin }))] += 1;
            if (spotsWithin) row.pairSpotsWithin += 1;
            if (aA === 'SupportBallCarrier' || aB === 'SupportBallCarrier') {
              row.pairEitherSupport += 1;
            }
            if (dA === 'runner' || dB === 'runner') row.pairEitherRunner += 1;
            if (owner === null) row.pairNoCarrier += 1;
            else {
              row.pairCarrierDistBins[binOf(Math.hypot(
                owner.pos.x - (xs[a] + xs[b]) / 2, owner.pos.y - (ys[a] + ys[b]) / 2,
              ), PAIRMID_BIN_M, PAIRMID_BINS)] += 1;
            }
          }
        }
      }
    }
  }
  if (flight !== null && observe) { bookFlight(flight); flight = null; }
  row.runnersDistinct = runnersEver.size;
  row.arriverDistinct = arriverEver.size;
  row.overlapperDistinct = overlapperEver.size;
  row.chasersDistinct = chasersEver.size;
  /* ---- ⭐⭐ THE GUARD FOLD — OBM-T1's own three lines, COPIED (anchored at §3) ---- */
  const bothPairs = [...gPairs[0], ...gPairs[1]];
  const gOut = [...gSpreadOut[0], ...gSpreadOut[1]];
  const gIn = [...gSpreadIn[0], ...gSpreadIn[1]];
  row.guardSpreadYOutN = gOut.length > 0 ? 1 : 0;
  row.guardSpreadYOutSum = gOut.length > 0 ? meanOf(gOut) : 0;
  row.guardSpreadYInN = gIn.length > 0 ? 1 : 0;
  row.guardSpreadYInSum = gIn.length > 0 ? meanOf(gIn) : 0;
  row.guardSpacingMedianN = bothPairs.length > 0 ? 1 : 0;
  row.guardSpacingMedianSum = bothPairs.length > 0 ? quantileOf(bothPairs, 0.5) : 0;
  row.guardU4N = bothPairs.length > 0 ? 1 : 0;
  row.guardU4Sum = bothPairs.length === 0 ? 0
    : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length;
  row.guardPairsTotal = bothPairs.length;
  row.guardPairsUnder4 = bothPairs.filter((v) => v < CLOSE_PAIR_M).length;
  row.policyCacheEntries = (m as unknown as { obmPolicies: Map<number, unknown> }).obmPolicies.size;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.shots = st[0].shots + st[1].shots;
  row.offsides = (m.teams[0].stats.offsides as number) + (m.teams[1].stats.offsides as number);
  row.signature = signatureOf(m);
  row.wallMs = Date.now() - tStart;
  return row;
};


/* ========================================================================== */
/* §10 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT             */
/* ========================================================================== */
const banner2 = banner;
banner2('LN-T1 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner2(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm × scratch-seed walks)`);

/* ========================================================================== */
/* §11 THE CONSTRUCTION RECEIPT — a CONSTRUCTED match of EACH arm, read off the
   REAL object (never off the intent that built it)                            */
/* ========================================================================== */
const armWorlds = Object.fromEntries(ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as {
    bqCushion?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
    edsPerceivedChoice?: boolean; edsPerceivedDefence?: boolean;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
  };
  const w = DOSE[armK];
  return [armK, {
    seed: WORLD_PIN_SEED,
    bqArmedVersion: bqArmedVersion(m),
    bqCushion: mm.bqCushion === true,
    obmMovement: mm.obmMovement === true,
    /** ⭐⭐ THE TWO-DOORS DECLARATION, ASSERTED PER ARM: never passed, so always false. */
    ctbSupportPlane: mm.ctbSupportPlane === true,
    edsPerceivedChoice: mm.edsPerceivedChoice === true,
    edsPerceivedDefence: mm.edsPerceivedDefence === true,
    rcBfAbsent: mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
    matrixPresentOnAllViews: genesOnAllViews(m),
    matrixNonZeroSlots: w === null ? 0 : w.filter((v) => v !== 0).length,
    matrixReadBackTeamA: offballMovementWeightVector(m.teams[0].genome),
    matrixReadBackTeamB: offballMovementWeightVector(m.teams[1].genome),
    emergentPosOn: emergentPosOn(),
  }];
})) as Record<Arm, {
  seed: number; bqArmedVersion: number; bqCushion: boolean; obmMovement: boolean;
  ctbSupportPlane: boolean; edsPerceivedChoice: boolean; edsPerceivedDefence: boolean;
  rcBfAbsent: boolean; matrixPresentOnAllViews: boolean; matrixNonZeroSlots: number;
  matrixReadBackTeamA: number[]; matrixReadBackTeamB: number[]; emergentPosOn: boolean;
}>;
const TWO_DOORS = {
  ctbSupportPlaneFalseInEveryArm: ARMS.every((a) => armWorlds[a].ctbSupportPlane === false),
  perceptArmedInEveryArm: ARMS.every((a) => armWorlds[a].edsPerceivedChoice === true),
  obmFlagMatchesMatrix: ARMS.every((a) => armWorlds[a].obmMovement === (DOSE[a] !== null)),
  matrixOnAllViewsWhereArmed: ARMS.every((a) => armWorlds[a].matrixPresentOnAllViews
    === (DOSE[a] !== null)),
  matrixReadsBackWhereArmed: ARMS.every((a) => (DOSE[a] === null
    ? true
    : JSON.stringify(armWorlds[a].matrixReadBackTeamA) === JSON.stringify(DOSE[a])
      && JSON.stringify(armWorlds[a].matrixReadBackTeamB) === JSON.stringify(DOSE[a]))),
  worldIs13InEveryArm: ARMS.every((a) => armWorlds[a].bqArmedVersion === BQ_WORLD_VERSION
    && armWorlds[a].bqCushion && armWorlds[a].rcBfAbsent),
  declaration: '⭐⭐ ONE DOOR, NOT TWO (#389 item 3): `ctbSupportPlane` is NEVER passed in ANY '
    + 'arm, so the policy\'s INTERCEPT is a hard 0 and what is dosed is the DYNAMIC term ALONE '
    + 'on the incumbent `supportSpot` geometry as its zero point. Read off the CONSTRUCTED '
    + 'match object, per arm, never off the intent that built it.',
};
const WORLD_PIN_OK = TWO_DOORS.ctbSupportPlaneFalseInEveryArm && TWO_DOORS.perceptArmedInEveryArm
  && TWO_DOORS.obmFlagMatchesMatrix && TWO_DOORS.matrixOnAllViewsWhereArmed
  && TWO_DOORS.matrixReadsBackWhereArmed && TWO_DOORS.worldIs13InEveryArm && EMERGENT_POS_ON;

/* ---- ⭐⭐ THE DELIVERED-DOSE READ (OBM-T1 §6c's form, its own DECLARED seed) ---- */
/** ⚠ WHY IT IS NOT IN THE EXAM WALK, declared: asking the seat again calls
 *  `match.perceivedSnapshot(p)`, which ADVANCES that body's percept memory. Inside an exam arm
 *  that is an intervention wearing an instrument's clothes. So this read runs on its own
 *  DECLARED out-of-band scratch seed, ONE match per arm, and its numbers are DESCRIPTIVE ONLY:
 *  no exam row, no CI and no gate LEVEL comes from it. The gate that reads it is
 *  G-BLIND-WORLD, and only for the NON-DEGENERACY of the percept trunk. */
const SAMPLE_EVERY_DOSE = 15;
const doseRead = (armK: Arm) => {
  const m = buildMatch(DOSE_READ_SEED, armK);
  const nF = OBM_FEATURE_KEYS.length;
  const nO = OBM_OUTPUT_KEYS.length;
  const featureSums = new Array<number>(nF).fill(0);
  const outputSums = new Array<number>(nO).fill(0);
  let samples = 0;
  let sawSnapshot = 0;
  let someFeatureNonZero = 0;
  let i = 0;
  const mm = m as unknown as { ctbSupportPlane: boolean };
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % SAMPLE_EVERY_DOSE !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff || p.role === 'GK') continue;
        const anchorPt = supportSpot(p, t, m.ball, mm.ctbSupportPlane);
        const policy = obmOffballPolicy(p, m, t.genome, anchorPt, mm.ctbSupportPlane);
        samples += 1;
        if (policy.sawSnapshot) sawSnapshot += 1;
        if (policy.features.some((f) => f !== 0)) someFeatureNonZero += 1;
        for (let k = 0; k < nF; k++) featureSums[k] += policy.features[k];
        for (let o = 0; o < nO; o++) outputSums[o] += policy.outputs[o];
      }
    }
  }
  const n = Math.max(1, samples);
  return {
    arm: armK, seed: DOSE_READ_SEED, samples,
    sampleLaw: `every ${SAMPLE_EVERY_DOSE} playing ticks, every outfielder of BOTH teams`,
    featureKeys: OBM_FEATURE_KEYS, outputKeys: OBM_OUTPUT_KEYS,
    featureMeans: featureSums.map((v) => v / n),
    outputMeans: outputSums.map((v) => v / n),
    sawSnapshotShare: sawSnapshot / n,
    someFeatureNonZeroShare: someFeatureNonZero / n,
    allFeaturesZeroShare: (samples - someFeatureNonZero) / n,
  };
};
banner2('LN-T1 — the delivered-dose read (G-BLIND-WORLD), one match per arm...');
const DOSE_READS = Object.fromEntries(ARMS.map((a) => [a, doseRead(a)])) as
  Record<Arm, ReturnType<typeof doseRead>>;
const G_BLIND_WORLD = {
  predicate: '`edsPerceivedChoice` TRUE in EVERY arm\'s CONSTRUCTED world (world 13 is '
    + 'percept-armed by `A4_WORLD_FLAGS`, anchored) · `sawSnapshotShare` > 0 · '
    + '`someFeatureNonZeroShare` > 0 · all four feature MEANS strictly positive. ⚠ NOT a claim '
    + 'that opponents were perceived on any particular sample: `allFeaturesZeroShare` bounds '
    + 'genuine blindness from ABOVE, because four zero features also occur with opponents '
    + 'present beyond the feature radii.',
  why: '⭐ A BLIND BODY HAS NO POLICY, so a blind world would silently UNDELIVER the treatment '
    + 'and every arm would read as ABSENT. This gate refuses to let that pass as a null result.',
  perArm: Object.fromEntries(ARMS.map((a) => [a, {
    edsPerceivedChoice: armWorlds[a].edsPerceivedChoice,
    sawSnapshotShare: DOSE_READS[a].sawSnapshotShare,
    someFeatureNonZeroShare: DOSE_READS[a].someFeatureNonZeroShare,
    allFeaturesZeroShare: DOSE_READS[a].allFeaturesZeroShare,
    featureMeans: DOSE_READS[a].featureMeans,
    outputMeans: DOSE_READS[a].outputMeans,
    featureKeys: OBM_FEATURE_KEYS, outputKeys: OBM_OUTPUT_KEYS,
    samples: DOSE_READS[a].samples,
  }])),
  pass: ARMS.every((a) => armWorlds[a].edsPerceivedChoice === true
    && DOSE_READS[a].sawSnapshotShare > 0
    && DOSE_READS[a].someFeatureNonZeroShare > 0
    && DOSE_READS[a].featureMeans.every((v) => v > 0)),
};

/* ========================================================================== */
/* §12 THE CORE — the whole battery, run TWICE (X-DET)                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const CHUNK = 25;
const runCore = (pass: number): { cells: Cell[]; receipt: Record<Arm, Row> } => {
  const out: Cell[] = [];
  banner2(`LN-T1 — pass ${pass}: ${N} seeds × ${ARMS.length} arms, seeds `
    + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
  for (let start = 0; start < batterySeeds.length; start += CHUNK) {
    for (const seed of batterySeeds.slice(start, start + CHUNK)) {
      const rows = {} as Record<Arm, Row>;
      for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
      out.push({ seed, rows });
    }
    banner2(`  … pass ${pass} ${Math.min(start + CHUNK, batterySeeds.length)}/`
      + `${batterySeeds.length} seeds ×${ARMS.length} arms `
      + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
  }
  const receipt = {} as Record<Arm, Row>;
  for (const armK of ARMS) receipt[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
  return { cells: out, receipt };
};
/** the X-DET digest EXCLUDES `wallMs` — a machine timing, not a world quantity. */
const coreDigest = (c: { cells: Cell[]; receipt: Record<Arm, Row> }): string => {
  const strip = (r: Row): Record<string, unknown> => {
    const o = { ...r } as Record<string, unknown>;
    delete o.wallMs;
    return o;
  };
  return sha(canonicalJson({
    cells: c.cells.map((x) => ({ seed: x.seed,
      rows: Object.fromEntries(ARMS.map((a) => [a, strip(x.rows[a])])) })),
    receipt: Object.fromEntries(ARMS.map((a) => [a, strip(c.receipt[a])])),
  }));
};
const coreA = runCore(1);
const digestA = coreDigest(coreA);
banner2(`  [ln-t1] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = runCore(2);
const digestB = coreDigest(coreB);
const X_DET = digestA === digestB;
banner2(`  [ln-t1] pass 2 digest ${digestB} — X-DET ${X_DET ? 'PASS' : 'FAIL'}`);
const cells = coreA.cells;
const receiptRows = coreA.receipt;
const walksBooked = (cells.length + 1) * ARMS.length * 2;

/* --- X-FP-PROD, recomputed in-probe (#181.2), inherited from OBM-T1's probe --- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return sha(JSON.stringify(out.league));
};
const fpObserved = leagueHash(FINGERPRINT_SEED);
const X_FP_PROD = fpObserved === FINGERPRINT_BASELINE;
banner2(`  [ln-t1] X-FP-PROD ${X_FP_PROD ? 'PASS' : 'FAIL'} (${fpObserved.slice(0, 16)}…)`);

/* ========================================================================== */
/* §12b ⭐ G-REPRO-LNC0 — LN-C0's OWN SEEDS 12,544,000–011, RE-WALKED ON THE
   ABSENT ARM and matched FIELD FOR FIELD against the COMMITTED artifact.
   ⛔ RE-WALKS, NOT CONSUMPTION.                                                */
/* ========================================================================== */
const lnc0Disk = JSON.parse(readFileSync(LNC0_ARTIFACT, 'utf8')) as {
  perSeedCells: (Record<string, unknown> & { seed: number })[];
  hashedBodySha256: string;
};
const LNC0_FILE_SHA = sha(readFileSync(LNC0_ARTIFACT, 'utf8'));
/** ⚠ `wallMs` is a MACHINE TIMING, not a world quantity — the ONE field excluded, DECLARED. */
const REPRO_EXCLUDED_FIELDS = ['wallMs'] as const;
banner2(`LN-T1 — G-REPRO-LNC0: re-walking LN-C0 seeds ${REPRO_LNC0_SEEDS[0]}–`
  + `${REPRO_LNC0_SEEDS[REPRO_LNC0_SEEDS.length - 1]} on the ABSENT arm...`);
const reproRows = REPRO_LNC0_SEEDS.map((seed) => {
  const got = walkMatch(buildMatch(seed, CONTROL_ARM), CONTROL_ARM, true) as unknown as
    Record<string, unknown>;
  const want = (lnc0Disk.perSeedCells.find((c) => c.seed === seed)?.E13 ?? null) as
    Record<string, unknown> | null;
  const fields = want === null ? [] : Object.keys(want)
    .filter((k) => !(REPRO_EXCLUDED_FIELDS as readonly string[]).includes(k));
  const mismatches = fields.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want![k]));
  return { seed, found: want !== null, fieldsCompared: fields.length, mismatches };
});
const REPRO_FIELDS_COMPARED = reproRows.reduce((a, r) => a + r.fieldsCompared, 0);
const REPRO_MISMATCHES = reproRows.reduce((a, r) => a + r.mismatches.length, 0);
const REPRO_OK_LNC0 = reproRows.length === REPRO_LNC0_N
  && reproRows.every((r) => r.found && r.fieldsCompared > 0 && r.mismatches.length === 0);
banner2(`  G-REPRO-LNC0 ${REPRO_OK_LNC0 ? 'GREEN' : 'RED'} — ${REPRO_FIELDS_COMPARED} field `
  + `comparisons, ${REPRO_MISMATCHES} mismatches`);

/* --- ⭐⭐ FLAG-HYGIENE: ARMED-ZERO ≡ ABSENT on EVERY seed --------------------- */
/** ⚠ The excluded fields ARE the arm definition or its code-path receipt — whether the flag is
 *  on, whether the matrix is on the genome views, how many entries the policy cache holds, and
 *  LN-C0's own `seamsAbsent` config echo. They are config echoes and code-path receipts, not
 *  world quantities. EVERYTHING the world produced — every ruler, every guard, every geometric
 *  quantity AND the whole-match signature INCLUDING the rng stream state — is compared.
 *  `wallMs` is excluded as a machine timing. Excluded and STATED, never quietly dropped. */
const HYGIENE_EXCLUDED_FIELDS = ['obmFlag', 'matrixOnAllViews', 'policyCacheEntries',
  'seamsAbsent', 'wallMs'] as const;
const hygieneRows = cells.map((c) => {
  const r = c.rows[CONTROL_ARM] as unknown as Record<string, unknown>;
  const z = c.rows['ARMED-ZERO'] as unknown as Record<string, unknown>;
  const keys = Object.keys(r)
    .filter((k) => !(HYGIENE_EXCLUDED_FIELDS as readonly string[]).includes(k));
  const diffs = keys.filter((k) => JSON.stringify(r[k]) !== JSON.stringify(z[k]));
  return { seed: c.seed, fieldsCompared: keys.length, differingFields: diffs };
});
const HYGIENE_DIFFERING = hygieneRows.reduce((a, r) => a + r.differingFields.length, 0);
const HYGIENE_SIGNATURES_IDENTICAL = cells
  .filter((c) => c.rows[CONTROL_ARM].signature === c.rows['ARMED-ZERO'].signature).length;
const FLAG_HYGIENE_OK = hygieneRows.every((r) => r.differingFields.length === 0)
  && HYGIENE_SIGNATURES_IDENTICAL === cells.length
  && DOSE[CONTROL_ARM] === null
  && DOSE_ARMS.every((a) => DOSE[a] !== null)
  && (DOSE['ARMED-ZERO'] as number[]).every((v) => v === 0)
  && DOSE_ARMS.filter((a) => a !== 'ARMED-ZERO')
    .every((a) => (DOSE[a] as number[]).some((v) => v !== 0));

/* --- ⭐⭐ G-ARM: the matrix on 3 views × 2 teams, the seat REACHED ------------- */
const gArmRows = Object.fromEntries(ARMS.map((armK) => {
  const rows = cells.map((c) => c.rows[armK]);
  const armed = DOSE[armK] !== null;
  const dosed = armed && (DOSE[armK] as number[]).some((v) => v !== 0);
  return [armK, {
    armed, dosed,
    seedsWithMatrixOnAllViews: rows.filter((r) => r.matrixOnAllViews).length,
    seedsWithFlagOn: rows.filter((r) => r.obmFlag).length,
    seedsWithPolicyWrites: rows.filter((r) => r.policyCacheEntries > 0).length,
    policyCacheEntriesTotal: sum(rows.map((r) => r.policyCacheEntries)),
    seedsPerceptArmed: rows.filter((r) => r.perceptArmed).length,
    seeds: rows.length,
  }];
})) as Record<Arm, { armed: boolean; dosed: boolean; seedsWithMatrixOnAllViews: number;
  seedsWithFlagOn: number; seedsWithPolicyWrites: number; policyCacheEntriesTotal: number;
  seedsPerceptArmed: number; seeds: number }>;
const G_ARM_OK = ARMS.every((a) => {
  const g = gArmRows[a];
  if (g.seedsPerceptArmed !== g.seeds) return false;
  if (!g.armed) {
    return g.seedsWithMatrixOnAllViews === 0 && g.seedsWithFlagOn === 0
      && g.policyCacheEntriesTotal === 0;
  }
  if (g.seedsWithMatrixOnAllViews !== g.seeds || g.seedsWithFlagOn !== g.seeds) return false;
  /** ⭐ THE SEAT REACHED, read at the SOURCE: `Match`'s own policy cache, whose ONLY writer is
   *  the single `obmMovement` fork in `PlayerBrain.decideOffBall` (anchored). Non-zero on
   *  EVERY DOSED seed. ARMED-ZERO also writes (it is armed), which is why it is required of
   *  every ARMED arm, not only the dosed ones. */
  return g.seedsWithPolicyWrites === g.seeds;
});

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
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
const ONE = (): number => 1;

/* ---- ⭐⭐ THE TWO PRIMARY RULERS ---- */
defFace('crowd.crashShare', 'share',
  '⭐⭐ R1 撞车 — LN-C0\'s own face (PT-C0\'s limb byte for byte): the share of sampled '
  + 'attacking ticks whose MINIMUM PAIRWISE outfield distance is below DUP_RUN_M = 4 m',
  'sampled ticks with an attributable possession side', (r) => r.crashHits, (r) => r.crowdSamples);
defFace('firstBody.ownNonTarget', 'share',
  '⭐⭐ R2 THE CAROM — LN-C0\'s own face: the share of measured ground passes whose FIRST BODY '
  + '(the `ball.lastTouch` channel) is an own outfielder who is NOT the target',
  'measured ground passes', (r) => r.firstBody[CTI('ownNonTarget')], (r) => r.gpFlights);
/* ---- SECONDARY, PUBLISHED, NEVER GATING ---- */
for (const c of CONTACTS) {
  if (c === 'ownNonTarget') continue;
  defFace(`firstBody.${c}`, 'share', `the first-body class ${c}`, 'measured ground passes',
    (r) => r.firstBody[CTI(c)], (r) => r.gpFlights);
}
defFace('lane.passesWithOccupantShare', 'share',
  'the share of measured ground passes with AT LEAST ONE own lane occupant at release',
  'measured ground passes', (r) => r.passesWithOcc, (r) => r.gpFlights);
defFace('lane.tight.passesWithOccupantShare', 'share',
  'the same share at the TIGHT (CONTROL_RADIUS) half-width — a robustness BIN',
  'measured ground passes', (r) => r.passesWithOccTight, (r) => r.gpFlights);
defFace('lane.occupantsPerPass', 'own occupants per measured ground pass',
  'the MEAN number of own OUTFIELD bodies (neither passer nor target) inside the WIDE corridor '
  + 'at the release tick, per measured ground pass', 'measured ground passes',
  (r) => r.occN, (r) => r.gpFlights);
defFace('lane.tight.occupantsPerPass', 'own occupants per measured ground pass',
  'the same count at the TIGHT half-width (bin)', 'measured ground passes',
  (r) => r.occNTight, (r) => r.gpFlights);
defFace('lane.armRecordShare', 'share',
  'the share of measured ground passes whose strike resolved a TRACKED wind-up record',
  'measured ground passes', (r) => r.gpWithArm, (r) => r.gpFlights);
defFace('lane.noWindupShare', 'share', 'the share with NO wind-up record',
  'measured ground passes', (r) => r.gpNoArm, (r) => r.gpFlights);
defFace('lane.passesWithLiveDesignationShare', 'share',
  'the share of measured ground passes struck while AT LEAST ONE designation was live',
  'measured ground passes', (r) => r.passesWithLiveDesignation, (r) => r.gpFlights);
defFace('crowd.dupRunPairsPerSample', 'pairs per sampled tick',
  'attacking outfield PAIRS closer than DUP_RUN_M = 4 m, per attributable sample',
  'sampled ticks with an attributable possession side', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres',
  'the mean nearest same-side outfielder distance', '(sampled tick, outfielder) pairs',
  (r) => r.spacingSum, (r) => r.spacingSamples);
defFace('crowd.unattributedSampleShare', 'share',
  'sampled open-play ticks with NO attributable possession side (excluded from every crowd face)',
  'sampled open-play ticks', (r) => r.crowdUnattributed, (r) => r.crowdSampleTicks);
defFace('crowd.samplesPerMatch', 'attributable samples per match',
  'attributable crowd samples per 240 s match', 'matches', (r) => r.crowdSamples, ONE);
defFace('crowd.pairsPerSample', 'classed pairs per sampled tick',
  'dup-run pairs entering the pair composition, per attributable sample', 'attributable samples',
  (r) => r.pairsTotal, (r) => r.crowdSamples);
/* the FIVE-class composition and carom (LN-C0's, UNCHANGED) */
for (const c of CAUSES) {
  defFace(`composition.${c}`, 'share',
    `THE OCCUPANT COMPOSITION — the ${c} share of own lane occupants (LN-C0's FROZEN precedence `
    + 'L1 > L2 > L3a > L3b > L4)', 'own lane occupants at release',
    (r) => r.causeN[LCI(c)], (r) => sum(r.causeN));
  defFace(`carom.${c}`, 'share',
    `P(first body = THIS occupant | ${c}) — the visible carom by cause`,
    `${c} occupants`, (r) => r.caromHits[LCI(c)], (r) => r.causeN[LCI(c)]);
  defFace(`spot.inLane.${c}`, 'share',
    `the share of ${c} occupants whose own FORMATION SPOT lies inside the release corridor`,
    `${c} occupants`, (r) => r.causeSpotInLane[LCI(c)], (r) => r.causeN[LCI(c)]);
  for (const p of PRESENCE) {
    defFace(`presence.${c}.${p}`, 'share', `PRESENT vs ARRIVED for ${c}: ${p}`, `${c} occupants`,
      (r) => r.causePresence[LCI(c)][PRI(p)], (r) => r.causeN[LCI(c)]);
  }
}
/* ⭐⭐ the SIX-class composition and carom WITH the fourth licence L1w, on the SAME denominator */
for (const c of CAUSES_W) {
  defFace(`compositionW.${c}`, 'share',
    `⭐⭐ THE OCCUPANT COMPOSITION WITH THE FOURTH LICENCE — the ${c} share of own lane occupants `
    + 'under the PARALLEL precedence L1 > L1w > L2 > L3a > L3b > L4 (#389 item 4(ii)). ⛔ Stored '
    + 'BESIDE the five-class composition, never folded into L1', 'own lane occupants at release',
    (r) => r.causeNW[LWI(c)], (r) => sum(r.causeNW));
  defFace(`caromW.${c}`, 'share',
    `⭐⭐ P(first body = THIS occupant | ${c}) under the L1w precedence`, `${c} occupants`,
    (r) => r.caromHitsW[LWI(c)], (r) => r.causeNW[LWI(c)]);
}
defFace('lane.wallRunLiveOccupantShare', 'share',
  '⭐ the share of own lane occupants carrying a LIVE `p.wallRun` licence at the release tick '
  + '(the raw fourth-licence incidence, BEFORE any precedence)', 'own lane occupants at release',
  (r) => r.occWallRunLive, (r) => sum(r.causeN));
for (const p of PRESENCE) {
  defFace(`presence.all.${p}`, 'share', `PRESENT vs ARRIVED, all own occupants: ${p}`,
    'own lane occupants', (r) => sum(r.causePresence.map((x) => x[PRI(p)])), (r) => sum(r.causeN));
}
defFace('carom.all', 'share', 'P(first body = THIS occupant) over ALL own lane occupants',
  'own lane occupants', (r) => sum(r.caromHits), (r) => sum(r.causeN));
for (const dg of DESIGNATIONS) {
  defFace(`occupantDesignation.${dg}`, 'share',
    `the designation cell ${dg}, READ off the team's own sets, over own lane occupants`,
    'own lane occupants', (r) => r.occDesig[DGI(dg)], (r) => sum(r.occDesig));
}
defFace('spot.inLaneShareAllBodies', 'share',
  'the share of ALL eligible own outfield bodies whose CALLED formation spot lies inside the '
  + 'release corridor', 'eligible own outfield bodies at release',
  (r) => r.spotInLaneAll, (r) => r.eligibleBodies);
defFace('spot.supportSpotInLaneShareAllBodies', 'share',
  'the same for the CALLED support spot (`supportSpot`, ctbPlane = false)',
  'eligible own outfield bodies at release', (r) => r.supportSpotInLaneAll, (r) => r.eligibleBodies);
for (const p of PAIRS) {
  defFace(`pair.${p}`, 'share',
    `THE PAIR COMPOSITION — the ${p} share of dup-run pairs (FROZEN precedence P2 > P3 > P1 > `
    + 'P4 > P5)', 'dup-run pairs', (r) => r.pairN[PCI(p)], (r) => r.pairsTotal);
}
defFace('pair.spotsWithinShare', 'share',
  'the share of dup-run pairs whose two CALLED formation spots are themselves within 4 m',
  'dup-run pairs', (r) => r.pairSpotsWithin, (r) => r.pairsTotal);
defFace('opponent.inLanePerPass', 'opponent occupants per measured ground pass',
  'opponents inside the WIDE corridor at release, per measured ground pass',
  'measured ground passes', (r) => r.oppN, (r) => r.gpFlights);
defFace('opponent.passesWithInLaneShare', 'share',
  'the share of measured ground passes with at least one opponent in the corridor at release',
  'measured ground passes', (r) => r.passesWithOpp, (r) => r.gpFlights);
defFace('designation.runnersPerSampledTick', 'runners per sampled tick',
  'the mean size of `team.runners` on the attacking side, per attributable sample',
  'attributable samples', (r) => r.runnersSampleSum, (r) => r.crowdSamples);
defFace('designation.runnersDistinctBodiesPerMatch', 'distinct bodies per match',
  'DISTINCT bodies licensed into `team.runners` at any tick (both sides pooled)', 'matches',
  (r) => r.runnersDistinct, ONE);
/* ---- ⭐⭐ THE GUARDS (F-LN-b, OBM-T1's forms) ---- */
defFace('guard.interceptionsPerMatch', 'interceptions per match',
  '⭐⭐ GUARD (CEILING): both sides\' `interceptions` on the 240 s match clock', 'matches',
  (r) => r.interceptions, ONE);
defFace('guard.spacingMedian', 'metres (mean of per-match medians)',
  '⭐⭐ GUARD (FLOOR): OBM-T1\'s `spacingMedian` — the MEDIAN same-side outfield PAIR distance '
  + 'over the match\'s subsampled pairs, then MEANED over matches (OBM-T1\'s own fold)',
  'matches with at least one sampled pair',
  (r) => r.guardSpacingMedianSum, (r) => r.guardSpacingMedianN);
defFace('guard.spreadYOut', 'metres (mean of per-match means)',
  '⭐⭐ GUARD (FLOOR): OBM-T1\'s `spreadYOut` — the sd of outfield y positions for the side NOT '
  + 'in possession, meaned within the match and then over matches',
  'matches with at least one out-of-possession sample',
  (r) => r.guardSpreadYOutSum, (r) => r.guardSpreadYOutN);
defFace('guard.offsidesPerMatch', 'offsides per match',
  '⭐ THE OFFSIDE LIMB in the #157 FLAG form — a resolved INCREASE raises a FLAG and flips NO '
  + 'gate', 'matches', (r) => r.offsides, ONE);
defFace('guard.spacingUnder4', 'mean per-match share',
  '⭐ SECONDARY BESIDE R1, NEVER GATING HERE (#389 item 4(ii)): OBM-T1\'s own `spacingUnder4` '
  + 'fold — the share of the match\'s subsampled same-side outfield PAIRS closer than '
  + 'CLOSE_PAIR_M = 4 m, meaned over matches. ⚠ A PAIR share per match, NOT a per-tick share: '
  + 'it is a different unit from R1 撞车 and the two are never added',
  'matches with at least one sampled pair', (r) => r.guardU4Sum, (r) => r.guardU4N);
defFace('guard.spacingUnder4Pooled', 'share',
  'the same quantity POOLED over pairs instead of meaned over matches (a denominator-stable '
  + 'companion; published, never gating)', 'subsampled same-side outfield pairs',
  (r) => r.guardPairsUnder4, (r) => r.guardPairsTotal);
defFace('guard.spreadYIn', 'metres (mean of per-match means)',
  'the in-possession companion to `spreadYOut` (published, never gating)',
  'matches with at least one in-possession sample',
  (r) => r.guardSpreadYInSum, (r) => r.guardSpreadYInN);
/* ---- ⭐⭐ THE WORLD-13 DO-NO-HARM BAND (LN-C0's own context faces) ---- */
defFace('context.goalsPerMatch', 'goals per match', '⭐⭐ BAND (BOTH directions): both sides, '
  + '240 s clock', 'matches', (r) => r.goals, ONE);
defFace('context.shotsPerMatch', 'shots per match', '⭐⭐ BAND (BOTH directions): both sides',
  'matches', (r) => r.shots, ONE);
defFace('context.passCompletion', 'share',
  '⭐⭐ BAND (DOWN is harmful): ALL deliveries, the engine\'s own stats', 'engine passes',
  (r) => r.passesCompleted, (r) => r.passes);
defFace('context.ownedBallSampleShare', 'share',
  '⭐⭐ BAND (DOWN is harmful): the share of sampled open-play ticks on which a body OWNS the '
  + 'ball', 'sampled open-play ticks', (r) => r.ownedSamples, (r) => r.crowdSampleTicks);
defFace('context.groundPassesPerMatch', 'measured ground passes per match',
  'the volume face on the 240 s match clock', 'matches', (r) => r.gpFlights, ONE);
/* ---- RECEIPTS (⚠ never football effect sizes) ---- */
defFace('receipt.hasBallRecipeAgreesShare', 'share',
  '⚠ A RECEIPT: the share of measured releases at which the PRODUCTION `hasBall` recipe agrees '
  + 'with the exam\'s declared `hasBall = true` reconstruction argument', 'measured ground passes',
  (r) => r.hasBallRecipeAgrees, (r) => r.gpFlights);
defFace('receipt.policyCacheEntriesPerMatch', 'policy-cache entries per match',
  '⚠ A RECEIPT, NEVER A FOOTBALL EFFECT SIZE: the size of the match\'s own `obmPolicies` cache '
  + 'at full time — the G-ARM counter, written ONLY by the single `obmMovement` fork in '
  + '`PlayerBrain.decideOffBall`', 'matches', (r) => r.policyCacheEntries, ONE);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const armRows = (armK: Arm): Row[] => cells.map((c) => c.rows[armK]);
const faces: FaceRow[] = [];
for (const armK of ARMS) {
  const rows = armRows(armK);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
    const draws: number[] = [];
    for (const idx of resampleIndex) {
      let n = 0; let dd = 0;
      for (const i of idx) { n += nu[i]; dd += de[i]; }
      const v = ratio(n, dd);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    faces.push({
      face: key, arm: armK, unit: f.unit, what: f.what, denNote: f.den,
      value: ratio(sum(nu), sum(de)), numerator: sum(nu), denominator: sum(de),
      ciLo: pctl(draws, 0.025), ciHi: pctl(draws, 0.975),
      halfWidth: (pctl(draws, 0.975) - pctl(draws, 0.025)) / 2,
    });
  }
}
const face = (k: string, armK: Arm): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === armK);
  if (f === undefined) { banner(`LN-T1 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ (dose arm − ABSENT). The arms share seeds, so the interval is PAIRED by
 *  construction: both arms of a seed move together inside every bootstrap draw.
 *  ⭐ LOO sensitivity in the CONSERVATIVE POINT-SHIFT form (BQ-T1's, #346/#348), STATED. */
interface DeltaRow {
  key: string; face: string; arm: Arm; control: Arm;
  controlValue: number; armValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  down: boolean; up: boolean; resolved: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlipsDown: number; looFlipsUp: number;
}
const pairedDelta = (faceKey: string, armK: Arm): DeltaRow => {
  const f = FACES[faceKey];
  const nA = cells.map((c) => f.num(c.rows[armK]));
  const dA = cells.map((c) => f.dn(c.rows[armK]));
  const nC = cells.map((c) => f.num(c.rows[CONTROL_ARM]));
  const dC = cells.map((c) => f.dn(c.rows[CONTROL_ARM]));
  const pA = ratio(sum(nA), sum(dA));
  const pC = ratio(sum(nC), sum(dC));
  const point = pA - pC;
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nA[i]; d1 += dA[i]; n2 += nC[i]; d2 += dC[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  const tNA = sum(nA); const tDA = sum(dA); const tNC = sum(nC); const tDC = sum(dC);
  let maxInf = 0; let flipsDown = 0; let flipsUp = 0;
  for (let i = 0; i < cells.length; i++) {
    const dLoo = ratio(tNA - nA[i], tDA - dA[i]) - ratio(tNC - nC[i], tDC - dC[i]);
    if (!Number.isFinite(dLoo)) continue;
    const inf = Math.abs(dLoo - point) / Math.max(Math.abs(point), 1e-12);
    if (inf > maxInf) maxInf = inf;
    const shift = dLoo - point;
    if ((hi < 0) !== (hi + shift < 0)) flipsDown += 1;
    if ((lo > 0) !== (lo + shift > 0)) flipsUp += 1;
  }
  return {
    key: `${faceKey}@${armK}`, face: faceKey, arm: armK, control: CONTROL_ARM,
    controlValue: pC, armValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    down: hi < 0, up: lo > 0, resolved: hi < 0 || lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlipsDown: flipsDown, looFlipsUp: flipsUp,
  };
};
const deltas: DeltaRow[] = DOSE_ARMS.flatMap((a) => FACE_KEYS.map((k) => pairedDelta(k, a)));
const delta = (faceKey: string, armK: Arm): DeltaRow => {
  const dd = deltas.find((x) => x.face === faceKey && x.arm === armK);
  if (dd === undefined) { banner(`LN-T1 FATAL — unknown Δ ${faceKey}@${armK}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 THE GUARDS, THE BAND, THE SELECTORS AND THE FROZEN READS                 */
/* ========================================================================== */
/** ⭐⭐ THE GUARD ROWS — OBM-T1's form: tolerance = NI_FRACTION · |control level|, with
 *  NI_FRACTION INHERITED as an EXPRESSION from OBM-T1's probe (anchored at §3), never typed as
 *  a decimal. BREACH = resolved AND beyond tolerance IN THE HARMFUL DIRECTION. */
type GuardDir = 'ceiling' | 'floor';
const GUARD_LIMBS: readonly { key: string; direction: GuardDir; family: string }[] = [
  { key: 'guard.interceptionsPerMatch', direction: 'ceiling', family: 'F-LN-b interception' },
  { key: 'guard.spacingMedian', direction: 'floor', family: 'F-LN-b clump' },
  { key: 'guard.spreadYOut', direction: 'floor', family: 'F-LN-b clump' },
];
const guardRows = GUARD_LIMBS.map((l) => {
  const control = face(l.key, CONTROL_ARM).value;
  const tol = NI_FRACTION * Math.abs(control);
  return {
    key: l.key, family: l.family, direction: l.direction, gating: true,
    controlLevel: control, toleranceAbs: tol,
    toleranceForm: 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
      + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — INHERITED from OBM-T1\'s probe line as an '
      + 'EXPRESSION and anchored, never typed as a decimal; frozen ex ante at §P',
    arms: Object.fromEntries(DOSE_ARMS.map((a) => {
      const d = delta(l.key, a);
      const beyond = l.direction === 'ceiling' ? d.delta > tol : d.delta < -tol;
      return [a, {
        delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
        resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,
      }];
    })) as Record<Arm, { delta: number; ci: number[]; halfWidth: number; resolved: boolean;
      beyondTolerance: boolean; breach: boolean }>,
  };
});
/** ⭐ THE OFFSIDE LIMB in the #157 FLAG form: a RESOLVED INCREASE raises a FLAG and flips NO
 *  gate. Stored per arm; it enters neither `breach` nor `disqualified`. */
const offsideRows = Object.fromEntries(DOSE_ARMS.map((a) => {
  const d = delta('guard.offsidesPerMatch', a);
  return [a, {
    delta: d.delta, ci: [d.ciLo, d.ciHi], resolved: d.resolved,
    flag: d.resolved && d.delta > 0, gating: false,
  }];
})) as Record<Arm, { delta: number; ci: number[]; resolved: boolean; flag: boolean;
  gating: boolean }>;
/** ⭐⭐ THE WORLD-13 DO-NO-HARM BAND on LN-C0's own context faces, the SAME tolerance form.
 *  HARMFUL DIRECTION PER FACE, frozen at §P: `passCompletion` DOWN · `ownedBallSampleShare`
 *  DOWN · goals BOTH · shots BOTH (the exam claims NO effect on them, so either direction
 *  beyond tolerance is a band violation). */
type BandDir = 'down' | 'both';
const BAND_LIMBS: readonly { key: string; harmful: BandDir }[] = [
  { key: 'context.goalsPerMatch', harmful: 'both' },
  { key: 'context.shotsPerMatch', harmful: 'both' },
  { key: 'context.passCompletion', harmful: 'down' },
  { key: 'context.ownedBallSampleShare', harmful: 'down' },
];
const bandRows = BAND_LIMBS.map((l) => {
  const control = face(l.key, CONTROL_ARM).value;
  const tol = NI_FRACTION * Math.abs(control);
  return {
    key: l.key, harmfulDirection: l.harmful, gating: true,
    controlLevel: control, toleranceAbs: tol,
    toleranceForm: 'NI_FRACTION · |controlLevel| — the SAME form as the guards',
    arms: Object.fromEntries(DOSE_ARMS.map((a) => {
      const d = delta(l.key, a);
      const beyond = l.harmful === 'down' ? d.delta < -tol : Math.abs(d.delta) > tol;
      return [a, {
        delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
        resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,
      }];
    })) as Record<Arm, { delta: number; ci: number[]; halfWidth: number; resolved: boolean;
      beyondTolerance: boolean; breach: boolean }>,
  };
});
/** ⚠ THE A4-S2P3 EQUILIBRIUM BAND IS NOT PUBLISHED HERE — #389 item 4(iii) permits either
 *  publishing it as context with its exclusion rule OR omitting it. THIS EXAM OMITS IT, and
 *  says so: world 13's ABSENT arm sits outside its goals row by construction, so every row
 *  would carry an exclusion note and no reader could use it. The world-13 do-no-harm band
 *  above, built on THIS exam's own control levels, is the band of record. */
const A4_S2P3_BAND_CHOICE = 'OMITTED, and the omission stated: #389 item 4(iii) allows either; '
  + 'world 13\'s ABSENT arm sits outside its goals row BY CONSTRUCTION, so every row would '
  + 'carry an exclusion note. The WORLD-13 DO-NO-HARM BAND above is the band of record.';

/** ⭐⭐ THE SELECTOR BOOLEANS, STORED PER DOSE ARM. */
/** ⛔ THE READ SELECTOR RANGES OVER THE THREE DOSED CORNERS ONLY. ARMED-ZERO is the IDENTITY
 *  arm — FLAG-HYGIENE requires it to be byte-identical to the control, so its every Δ is
 *  exactly 0 and it can never be an arm of record. Its selector booleans are STORED anyway,
 *  for the record. Frozen at §P, before any battery seed. */
const DOSED_CORNERS = ['MARKER-ESCAPE', 'SPACE-SEEK', 'KITCHEN-SINK'] as const;
type DosedCorner = (typeof DOSED_CORNERS)[number];
const selectorFor = (a: Arm) => {
  const r1 = delta('crowd.crashShare', a);
  const r2 = delta('firstBody.ownNonTarget', a);
  const guardBreaches = guardRows.filter((g) => g.arms[a].breach).map((g) => g.key);
  const bandBreaches = bandRows.filter((b) => b.arms[a].breach).map((b) => b.key);
  const breach = guardBreaches.length > 0 || bandBreaches.length > 0;
  const r1Down = r1.down; const r2Down = r2.down;
  const r1Up = r1.up; const r2Up = r2.up;
  return {
    arm: a,
    r1Delta: r1.delta, r1Ci: [r1.ciLo, r1.ciHi], r1Resolved: r1.resolved,
    r2Delta: r2.delta, r2Ci: [r2.ciLo, r2.ciHi], r2Resolved: r2.resolved,
    r1Down, r2Down, r1Up, r2Up, breach,
    disqualified: r1Up || r2Up || breach,
    disqualifyingFaces: [
      ...(r1Up ? ['crowd.crashShare (R1 resolved INCREASE)'] : []),
      ...(r2Up ? ['firstBody.ownNonTarget (R2 resolved INCREASE)'] : []),
      ...guardBreaches.map((k) => `${k} (guard breach)`),
      ...bandBreaches.map((k) => `${k} (band breach)`),
    ],
    guardBreaches, bandBreaches,
    offsideFlag: offsideRows[a].flag,
  };
};
const SELECTORS = Object.fromEntries(DOSE_ARMS.map((a) => [a, selectorFor(a)])) as
  Record<Arm, ReturnType<typeof selectorFor>>;

/** ⭐⭐ THE FIVE FROZEN READ LITERALS — copied VERBATIM from #389 item 4(iv). */
const READ_LITERALS = {
  read1: (armName: string): string => `THE EYES CLEAR THE CROWD AND THE LANE AT ${armName} — `
    + 'the entry rung LN-ENTRY is named with that dose.',
  read2: 'THE EYES THIN THE CROWD BUT THE CAROM STANDS — the commander decides with the table; '
    + '⑤ (the passer\'s eyes) is named beside.',
  read3: 'THE EYES CLEAR THE LANE BUT THE CROWD STANDS — the commander decides with the table.',
  read4: 'THE EYES MOVE NEITHER FACE — step ③ (retire the hand-written designations) is named '
    + 'next; this exam\'s ABSENT arm is its control.',
  read5: 'THE EYES HARM — the seat stays dormant; step ③ is named next.',
} as const;
const qualifying = DOSED_CORNERS.filter((a) => !SELECTORS[a].disqualified);
const ALL_DOSED_DISQUALIFIED = qualifying.length === 0;
const anyR1Down = qualifying.some((a) => SELECTORS[a].r1Down);
const anyR2Down = qualifying.some((a) => SELECTORS[a].r2Down);
const bothArms = qualifying.filter((a) => SELECTORS[a].r1Down && SELECTORS[a].r2Down);
const anyBoth = bothArms.length > 0;
/** ⭐ THE ARM OF RECORD (READ 1 only) — the LARGEST R1 DECREASE among qualifying arms, i.e.
 *  the most negative stored Δ. The comparison is STORED, never asserted in prose. */
const armOfRecordComparison = bothArms.map((a) => ({ arm: a, r1Delta: SELECTORS[a].r1Delta }))
  .sort((x, y) => x.r1Delta - y.r1Delta);
const ARM_OF_RECORD: string | null = armOfRecordComparison.length > 0
  ? armOfRecordComparison[0].arm : null;
const READ_SELECTED = ALL_DOSED_DISQUALIFIED ? 'read5'
  : anyBoth ? 'read1'
    : anyR1Down && !anyR2Down ? 'read2'
      : anyR2Down && !anyR1Down ? 'read3'
        : (!anyR1Down && !anyR2Down) ? 'read4'
          : 'read1';
const READ_SENTENCE = READ_SELECTED === 'read1'
  ? READ_LITERALS.read1(ARM_OF_RECORD ?? 'NONE')
  : READ_LITERALS[READ_SELECTED as 'read2' | 'read3' | 'read4' | 'read5'];
/** ⭐⭐ THE COUNTERFACTUAL WORDS — canon, VERBATIM: "a counterfactual verdict sentence ('had X
 *  been scored, the rule would read W') quotes a word the instrument STORED by applying the
 *  frozen rule to X's stored interval". For EVERY reported dose arm: what the read would be if
 *  THAT arm alone were the whole table. */
const counterfactualWords = Object.fromEntries(DOSE_ARMS.map((a) => {
  const s = SELECTORS[a];
  const word = s.disqualified ? 'read5'
    : (s.r1Down && s.r2Down) ? 'read1'
      : s.r1Down ? 'read2'
        : s.r2Down ? 'read3' : 'read4';
  return [a, {
    arm: a, word,
    sentence: word === 'read1' ? READ_LITERALS.read1(a)
      : READ_LITERALS[word as 'read2' | 'read3' | 'read4' | 'read5'],
    note: 'the frozen rule APPLIED to THIS arm\'s stored intervals alone — what the exam would '
      + 'read if this row were the whole table',
  }];
})) as Record<Arm, { arm: Arm; word: string; sentence: string; note: string }>;
/** ⭐⭐ THE UNIVERSAL SENTENCES, STORED AS BOOLEANS (canon: a universal sentence about a table
 *  is a stored boolean or is not written). */
const UNIVERSALS = {
  everyDosedCornerDisqualified: ALL_DOSED_DISQUALIFIED,
  noDosedCornerHasR1Down: !DOSED_CORNERS.some((a) => SELECTORS[a].r1Down),
  noDosedCornerHasR2Down: !DOSED_CORNERS.some((a) => SELECTORS[a].r2Down),
  noQualifyingArmHasR1Down: !anyR1Down,
  noQualifyingArmHasR2Down: !anyR2Down,
  everyDosedCornerHasR1Down: DOSED_CORNERS.every((a) => SELECTORS[a].r1Down),
  everyDosedCornerHasR2Down: DOSED_CORNERS.every((a) => SELECTORS[a].r2Down),
  everyGuardHeldOnEveryDoseArm: guardRows.every((g) => DOSE_ARMS.every((a) => !g.arms[a].breach)),
  everyBandFaceHeldOnEveryDoseArm: bandRows.every((b) => DOSE_ARMS.every((a) => !b.arms[a].breach)),
  noOffsideFlagOnAnyDoseArm: DOSE_ARMS.every((a) => !offsideRows[a].flag),
  armedZeroIsIdenticalOnEverySeed: FLAG_HYGIENE_OK,
  everyArmIsPerceptArmed: ARMS.every((a) => armWorlds[a].edsPerceivedChoice),
  ctbSupportPlaneShutInEveryArm: TWO_DOORS.ctbSupportPlaneFalseInEveryArm,
};
const READS = {
  note: '⭐⭐ #389 item 4(iv)\'s FIVE SENTENCES are FROZEN LITERALS, copied VERBATIM into the '
    + 'instrument BEFORE any battery seed. The selector is the STORED boolean set per DOSE '
    + 'ARM; the selector ranges over the THREE DOSED CORNERS only (ARMED-ZERO is the identity '
    + 'arm — see `armedZeroExcludedWhy`).',
  literals: {
    read1Template: READ_LITERALS.read1('<ARM>'),
    read2: READ_LITERALS.read2, read3: READ_LITERALS.read3,
    read4: READ_LITERALS.read4, read5: READ_LITERALS.read5,
  },
  armedZeroExcludedWhy: 'FLAG-HYGIENE requires ARMED-ZERO to be byte-identical to ABSENT, so '
    + 'its every Δ is exactly 0 and it can never be an arm of record. Its selector booleans '
    + 'are STORED anyway.',
  dosedCorners: DOSED_CORNERS,
  selectors: SELECTORS,
  qualifyingArms: qualifying,
  disqualifiedArms: DOSED_CORNERS.filter((a) => SELECTORS[a].disqualified)
    .map((a) => ({ arm: a, faces: SELECTORS[a].disqualifyingFaces })),
  anyQualifyingR1Down: anyR1Down,
  anyQualifyingR2Down: anyR2Down,
  anyQualifyingBoth: anyBoth,
  allDosedDisqualified: ALL_DOSED_DISQUALIFIED,
  armOfRecordComparison,
  armOfRecord: ARM_OF_RECORD,
  selectedRead: READ_SELECTED,
  sentence: READ_SENTENCE,
  counterfactualWords,
  universals: UNIVERSALS,
};

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form LN-C0 used                           */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** ⭐⭐ THE SMOKE'S OWN REALISED PAIRED-Δ HALF-WIDTHS, read out of the §DEV-PREFLIGHT scratch
 *  smoke artifact's own `deltas[].halfWidth` fields (12 clusters, seeds 900,003,500–511) and
 *  written here BEFORE the FREEZE commit and BEFORE any battery seed. ⛔ Never re-typed from
 *  the console's rounded print. */
const SMOKE_HW_R1 = 0.02893749919645197;
const SMOKE_HW_R2 = 0.01753664982651569;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised paired-Δ half-widths (seeds
 *  900,003,500–511), read out of the smoke artifact's own `deltas[].halfWidth` fields — never
 *  re-typed from the console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'crowd.crashShare@KITCHEN-SINK',
    group: '⭐⭐ R1 撞车 — the paired Δ against ABSENT at the CEILING arm',
    hwSmoke: SMOKE_HW_R1, target: 0.02 },
  { face: 'firstBody.ownNonTarget@KITCHEN-SINK',
    group: '⭐⭐ R2 THE CAROM — the paired Δ against ABSENT at the CEILING arm',
    hwSmoke: SMOKE_HW_R2, target: 0.01 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, blockAffords: N_FROZEN,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);

/* ========================================================================== */
/* §16 THE GATES (all liveness / receipt — NEVER direction)                    */
/* ========================================================================== */
type Pooled = {
  occPerPassBins: number[]; causeN: number[]; causeNW: number[];
  causePresence: number[][]; caromHits: number[]; caromHitsW: number[];
  causeSpotInLane: number[]; causeSupportSpotInLane: number[];
  occDesig: number[]; occAction: number[]; l4Action: number[];
  distCarrierBins: number[]; distCentreBins: number[]; distTargetBins: number[];
  vAcrossBins: number[]; vAlongBins: number[]; firstBody: number[];
  oppPresence: number[]; oppPresenceTight: number[];
  nearBins: number[]; minPairBins: number[]; pairN: number[]; pairCarrierDistBins: number[];
};
const emptyPooled = (): Pooled => ({
  occPerPassBins: zeros(OCC_BINS), causeN: zeros(CAUSES.length), causeNW: zeros(CAUSES_W.length),
  causePresence: zeros2(CAUSES.length, PRESENCE.length), caromHits: zeros(CAUSES.length),
  caromHitsW: zeros(CAUSES_W.length),
  causeSpotInLane: zeros(CAUSES.length), causeSupportSpotInLane: zeros(CAUSES.length),
  occDesig: zeros(DESIGNATIONS.length), occAction: zeros(ACTION_CELLS.length),
  l4Action: zeros(ACTION_CELLS.length),
  distCarrierBins: zeros(DCARR_BINS), distCentreBins: zeros(DCENT_BINS),
  distTargetBins: zeros(DTGT_BINS), vAcrossBins: zeros(VACROSS_BINS),
  vAlongBins: zeros(VALONG_BINS), firstBody: zeros(CONTACTS.length),
  oppPresence: zeros(PRESENCE.length), oppPresenceTight: zeros(PRESENCE.length),
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS), pairN: zeros(PAIRS.length),
  pairCarrierDistBins: zeros(PAIRMID_BINS),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.occPerPassBins, r.occPerPassBins); addInto(p.causeN, r.causeN);
    addInto(p.causeNW, r.causeNW); addInto(p.caromHitsW, r.caromHitsW);
    addInto2(p.causePresence, r.causePresence); addInto(p.caromHits, r.caromHits);
    addInto(p.causeSpotInLane, r.causeSpotInLane);
    addInto(p.causeSupportSpotInLane, r.causeSupportSpotInLane);
    addInto(p.occDesig, r.occDesig); addInto(p.occAction, r.occAction);
    addInto(p.l4Action, r.l4Action);
    addInto(p.distCarrierBins, r.distCarrierBins); addInto(p.distCentreBins, r.distCentreBins);
    addInto(p.distTargetBins, r.distTargetBins); addInto(p.vAcrossBins, r.vAcrossBins);
    addInto(p.vAlongBins, r.vAlongBins); addInto(p.firstBody, r.firstBody);
    addInto(p.oppPresence, r.oppPresence); addInto(p.oppPresenceTight, r.oppPresenceTight);
    addInto(p.nearBins, r.nearBins); addInto(p.minPairBins, r.minPairBins);
    addInto(p.pairN, r.pairN); addInto(p.pairCarrierDistBins, r.pairCarrierDistBins);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  nearestMateMetres: binMedian(p.nearBins, NEAR_BIN_M, false),
  minPairwiseMetres: binMedian(p.minPairBins, MINPAIR_BIN_M, false),
  occupantDistanceToCarrierMetres: binMedian(p.distCarrierBins, DCARR_BIN_M, false),
  occupantDistanceToCentreLineMetres: binMedian(p.distCentreBins, DCENT_BIN_M, false),
  occupantDistanceToTargetMetres: binMedian(p.distTargetBins, DTGT_BIN_M, false),
  occupantVelocityAcrossLaneMs: binMedian(p.vAcrossBins, VACROSS_BIN_MS, true),
  occupantVelocityAlongLaneMs: binMedian(p.vAlongBins, VALONG_BIN_MS, true),
  carrierToPairMidpointMetres: binMedian(p.pairCarrierDistBins, PAIRMID_BIN_M, false),
});
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const armK of ARMS) {
  pooled[armK] = poolFrom(armRows(armK));
  medians[armK] = mediansFrom(pooled[armK]);
}
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const tot = (armK: Arm, pick: (r: Row) => number): number =>
  armRows(armK).reduce((a, r) => a + pick(r), 0);
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED, DOSE_READ_SEED];
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const CROWD_REPRO_OK = ARMS.every((armK) => allRows(armK).every(
  (r) => r.crashHits === r.crashHitsAlt && r.dupRunSum === r.dupRunSumAlt,
));
/** THE PUBLISHED SEED LEDGER this exam is disjoint from (quoted, not invented): the two
 *  immediately preceding stages' consumed blocks and the frontier of record at #389 item 7. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'BQ-T1 battery block (#385 item 5)', range: [12_543_000, 12_543_999] },
  { name: 'LN-C0 battery block (#388 item 2)', range: [12_544_000, 12_544_999] },
];
const PUBLISHED_FRONTIER_AT_389 = 12_545_000;
const SEED_DISJOINT = BLOCK_BASE === PUBLISHED_FRONTIER_AT_389
  && CONSUMED.every((c) => BLOCK_TOP < c.range[0] || BLOCK_BASE > c.range[1])
  && (IS_OVERRIDE
    ? walkedSeeds.every((s) => s >= 900_000_000) && RECEIPT_SEED >= 900_000_000
    : walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED))
  && ALL_SCRATCH.every((s) => s >= 900_000_000)
  && REPRO_LNC0_SEEDS.every((s) => s >= 12_544_000 && s <= 12_544_999);
const shareFaces = faces.filter((f) => f.unit === 'share');
const TWO_FRACTIONS_OK = faces.every((f) => Number.isFinite(f.numerator)
  && Number.isFinite(f.denominator)
  && (f.denominator === 0 ? Number.isNaN(f.value) : f.value === f.numerator / f.denominator));
const LOO_ROWS_OK = DOSE_ARMS.every((a) => ['crowd.crashShare', 'firstBody.ownNonTarget']
  .every((k) => {
    const d = delta(k, a);
    return Number.isFinite(d.looMaxInfluenceShare)
      && Number.isInteger(d.looFlipsDown) && Number.isInteger(d.looFlipsUp);
  }));

const gates: Record<string, { ok: boolean; note: string }> = {
  xDet: {
    ok: X_DET,
    note: `⭐⭐ THE WHOLE CORE RUN TWICE: ${N} seeds × ${ARMS.length} arms + the construction `
      + 'receipt, walked from scratch a second time, and the two digests over every per-seed '
      + 'row are BYTE-IDENTICAL (`wallMs`, a machine timing, is the ONE field excluded from '
      + `the digest and it is named here). digestA ${digestA.slice(0, 16)}… digestB `
      + `${digestB.slice(0, 16)}…`,
  },
  xFpProd: {
    ok: X_FP_PROD,
    note: '⭐⭐ THE PRODUCTION FINGERPRINT, RECOMPUTED IN-PROBE (#181.2): '
      + `${FINGERPRINT_SEASONS} seasons at seed ${FINGERPRINT_SEED} through the SHIPPED `
      + '`League` / `runHeadless` path, hashed. The baseline is EXTRACTED from OBM-T1\'s own '
      + `probe line (anchored at §3), never re-typed. observed ${fpObserved} · baseline `
      + `${FINGERPRINT_BASELINE}`,
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === ''
      && gitOut('git diff --stat HEAD -- tests') === ''
      && gitOut('git status --porcelain -- tests') === '',
    note: 'worktree-vs-HEAD over `src/` AND `tests/`: `git diff --stat HEAD -- <dir>` AND '
      + '`git status --porcelain -- <dir>` all EMPTY (canon: xSrcUntouched) — X-SRC-ZERO. The '
      + 'seam, the `obmMovement` MatchConfig flag and the genome door '
      + '`offballMovementWeights` ALL EXIST; this probe arms them from outside',
  },
  gSeedDisjoint: {
    ok: SEED_DISJOINT,
    note: `SEED-DISJOINT against the PUBLISHED ledger: the block base equals the frontier of `
      + `record at #389 item 7 (${PUBLISHED_FRONTIER_AT_389}); the block `
      + `${BLOCK_BASE}–${BLOCK_TOP} is disjoint from every quoted consumed interval `
      + `(${CONSUMED.map((c) => `${c.name} ${c.range[0]}–${c.range[1]}`).join(' · ')}); every `
      + 'battery seed and the construction receipt lie inside the block; every scratch seed '
      + 'this instrument walks is ≥ 900,000,000 — canon, VERBATIM: "verifier scratch walks use '
      + 'the stage\'s own consumed band or the out-of-band scratch range (≥ 900,000,000) — '
      + 'never the next virgin block" (an OVERRIDE run walks the scratch band instead of the '
      + 'block, and this gate demands exactly that); and ⭐ the G-REPRO-LNC0 seeds lie inside '
      + 'LN-C0\'s OWN '
      + 'already-consumed block and are DECLARED RE-WALKS, not consumption',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length * 2)
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length * 2),
    note: `BOOKED = WALKED, derived from the CELLS' OWN distinct seeds: ${walkedSeeds.length} `
      + `battery seeds + the construction receipt, each walked ONCE PER ARM (${ARMS.length} `
      + `arms) in EACH of the TWO X-DET passes ⇒ ${walksBooked} exam walks booked. The `
      + 'unwalked tail is DECLARED in the `seeds` block, and every scratch and re-walk seed is '
      + 'STORED there',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, '
        + 'and the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms in each pass`,
  },
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.cushionOk
      && r.rcBfAbsent && r.genomeClean && r.ctbPlaneShut && r.emergentOn && r.perceptArmed))
      && WORLD_PIN_OK && EMERGENT_POS_ON,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\` · \`bqCushion\` TRUE · \`ctbSupportPlane\` `
      + 'FALSE (the two-doors declaration, ASSERTED) · every RC/BF flag ABSENT · '
      + '`edsPerceivedChoice` TRUE · `info.genome` clean of the RA / corridor / RC / CTB / OBM '
      + 'SCALAR genes (canon: dose placement, #270.2 / #334 item 1) · `emergentPosOn()` TRUE so '
      + `\`formationSpot\` takes the ${FORMATION_SPOT_PATH}. ⚠ DECLARED, NOT HIDDEN: the 16-slot `
      + '`offballMovementWeights` MATRIX **is** written on `info.genome` as well as the two '
      + 'engine views — that is OBM-T1\'s `armMatrix` idiom, re-authorized in terms by #389 '
      + 'item 4(i) ("ALL THREE genome views of BOTH teams"), and it is the ONE gene channel '
      + 'this exam writes. Pinned again on a CONSTRUCTED match of each arm at scratch seed '
      + `${WORLD_PIN_SEED}. The composer is CALLED, never copied`,
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `⭐⭐ anchored extraction with want-counts and line receipts, ${ANCHORS.length} sites: `
      + 'LN-C0\'s OWN inherited sites (the corridor — `DV_CORRIDOR_SCALE` = 4, '
      + '`DV_CLEAR_RADIUS` = 1.5, `CONTROL_RADIUS`, `closestPointOnSegment`, BN-C0\'s and '
      + 'LN-C0\'s `inCorridorOf`; PT-C0\'s crowd limbs and the A4 battery\'s own `DUP_RUN_M` = '
      + '4 and `SAMPLE_EVERY` = 10 AT THEIR OWN LINES; PT-C0\'s population, ground-launch and '
      + 'first-body ladders; the wind-up record; the four designation sets; both spot '
      + 'functions and the `emergentPosOn()` toggle; the executor\'s production argument '
      + 'recipe; world 13\'s own composition) — PLUS ⭐ THE NEW SITES THIS EXAM ARMS: the '
      + '`obmMovement` fork\'s THREE READ SITES (the ONE brain fork + its two score sites; the '
      + 'executor\'s plane READ and APPLY), the match\'s own policy CACHE and its ONE writer, '
      + 'the flag\'s DEFAULT-FALSE line, THE FOUR `MakeRun` PUSH SITES (the licensed run · the '
      + 'one-two burst · the overlap · the keeper-up corner), the `p.wallRun` GATE and its ONE '
      + 'WRITE in `src/sim/mechanics.ts`, `A4_WORLD_FLAGS` and BOTH `edsPerceivedChoice: true` '
      + 'occurrences, the genome door and the three OBM_* exports — and ⭐⭐ EVERY LINE OF '
      + 'OBM-T1\'s PROBE THIS INSTRUMENT COPIES (the `IDX` / `F1..F4` / `O_DEPTH..O_RUN` / '
      + '`matrix()` / `ZERO_MATRIX` idiom, the three dose matrices, `armMatrix`, '
      + '`genesOnAllViews`, the policy-cache counter, `NI_FRACTION`, `PAIR_SUBSAMPLE`, '
      + '`CLOSE_PAIR_M`, the three guard folds and the fingerprint baseline). The ACTION '
      + `vocabulary (${ACTIONS.length}) is READ OFF \`ActionType\`'s OWN union`,
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — PT-C0\'s population and first-body ladders, the corridor test on '
      + 'constructed geometry, the designation read, the FIVE-class cause precedence, ⭐ the '
      + 'SIX-class L1w precedence INCLUDING its agreement with the five-class ladder wherever '
      + 'no licence is live, the `p.wallRun` liveness predicate on both sides of its expiry, '
      + 'the pair classes, the present/arrived split, PT-C0\'s crowd limbs and their second '
      + 'implementations, ⭐ OBM-T1\'s three GUARD folds, ⭐ the DOSE COPY slot lists, and every '
      + 'bin helper are PURE functions called by BOTH the walk and this table',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.gpFlights) > 0
      && tot(armK, (r) => sum(r.causeN)) > 0
      && tot(armK, (r) => r.causeN[LCI('L1')]) > 0
      && tot(armK, (r) => r.pairsTotal) > 0
      && tot(armK, (r) => r.crashHits) > 0
      && tot(armK, (r) => r.guardPairsTotal) > 0
      && tot(armK, (r) => r.firstBody[CTI('ownNonTarget')]) > 0),
    note: '⛔ no face is computed on an empty class: EVERY arm has measured ground passes, own '
      + 'lane occupants, DESIGNATED occupants, dup-run pairs, 撞车 ticks, subsampled guard '
      + `pairs and own-non-target first bodies (ABSENT: ${tot('ABSENT', (r) => r.gpFlights)} `
      + `passes · ${tot('ABSENT', (r) => sum(r.causeN))} occupants · `
      + `${tot('ABSENT', (r) => r.crashHits)} 撞车 ticks · `
      + `${tot('ABSENT', (r) => r.firstBody[CTI('ownNonTarget')])} own-non-target caroms). `
      + '⚠ LIVENESS only — never a direction, never a magnitude',
  },
  gCrowdArithmeticReproduces: {
    ok: CROWD_REPRO_OK,
    note: 'LN-C0\'s SECOND, independently shaped implementation of the two crowd quantities '
      + '(`dupRunPairsAltOf` / `crashAltOf`) is recomputed on EVERY sampled tick of EVERY '
      + `walked match and the receipt, in all ${ARMS.length} arms, and agrees cell for cell`,
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER: observation is pure per-tick reads of public '
      + '`Match` / `Team` state after `m.step(DT)`, and every shipped function it calls is a '
      + 'PURE query. Proven anyway — the same scratch seed walked OBSERVED and UNOBSERVED '
      + `yields a BYTE-IDENTICAL whole-match signature on all ${lockstepRows.length} arm × `
      + 'out-of-band-scratch-seed walks',
  },
  gFlagHygiene: {
    ok: FLAG_HYGIENE_OK,
    note: '⭐⭐ ARMED-ZERO ≡ ABSENT ON EVERY SEED. The `obmMovement` flag is ON and the all-zero '
      + '16-weight matrix is written on all three genome views of both teams, and the world '
      + `still produces the IDENTICAL match: ${HYGIENE_DIFFERING} differing fields across `
      + `${hygieneRows.length} seeds × ${hygieneRows[0]?.fieldsCompared ?? 0} compared fields, `
      + `and the WHOLE-MATCH SIGNATURE INCLUDING THE RNG STREAM STATE is identical on `
      + `${HYGIENE_SIGNATURES_IDENTICAL}/${cells.length} seeds. ⚠ The excluded fields are `
      + `${HYGIENE_EXCLUDED_FIELDS.join(', ')} — the arm's own definition, its code-path `
      + 'receipts and a machine timing; excluded and STATED, never quietly dropped',
  },
  gArm: {
    ok: G_ARM_OK,
    note: '⭐⭐ THE TREATMENT IS DELIVERED. On EVERY seed of EVERY ARMED arm the 16-weight '
      + 'matrix is present and full-length on ALL THREE genome views of BOTH teams (3 × 2 = 6 '
      + 'views) and the `obmMovement` flag is on; and ⭐ THE SEAT IS REACHED — the match\'s own '
      + '`obmPolicies` cache, whose ONLY writer is the single `obmMovement` fork in '
      + '`PlayerBrain.decideOffBall` (anchored at §3, read via `Match`\'s private field at full '
      + 'time exactly as OBM-T1 reads it), holds entries on EVERY armed seed: '
      + `${DOSE_ARMS.map((a) => `${a} ${gArmRows[a].seedsWithPolicyWrites}/${gArmRows[a].seeds}`)
        .join(' · ')}. On the ABSENT arm the flag is off, no matrix is on any view and the `
      + 'cache is EMPTY on every seed',
  },
  gBlindWorld: {
    ok: G_BLIND_WORLD.pass,
    note: '⭐⭐ WORLD 13 IS PERCEPT-ARMED — `edsPerceivedChoice` is in `A4_WORLD_FLAGS` '
      + '(anchored), asserted TRUE on every CONSTRUCTED match of every arm and on every walked '
      + 'match. A blind body has no policy, so a blind world would silently UNDELIVER the '
      + 'treatment; the delivered-dose read shows the trunk is non-degenerate — '
      + `sawSnapshotShare ${G_BLIND_WORLD.perArm.ABSENT.sawSnapshotShare.toFixed(5)} on the `
      + 'control arm and all four feature MEANS strictly positive in every arm. ⚠ The read is '
      + 'DESCRIPTIVE ONLY, on its own DECLARED out-of-band seed; no exam row, no CI and no '
      + 'gate LEVEL comes from it',
  },
  gDoseCopy: {
    ok: DOSE_COPY_OK,
    note: '⭐⭐ THE THREE MATRICES AND THE ZERO ARE BYTE-COPIED FROM '
      + '`scripts/probes/obm-t1-policy-exam.ts` (every copied line ANCHORED at §3 with a '
      + 'want-count) AND RE-DERIVED HERE FROM THE `OBM_*` EXPORTS BY A SECOND, INDEPENDENTLY '
      + 'SHAPED SWEEP (a full output × feature fill from a per-arm rule) and compared SLOT FOR '
      + `SLOT: ${DOSE_COPY_ROWS.filter((r) => r.slotForSlot).length}/${DOSE_COPY_ROWS.length} `
      + 'arms agree on all sixteen slots, every non-zero entry is a DOMAIN CORNER '
      + '(`OBM_WEIGHT_MIN` / `OBM_WEIGHT_MAX`, IMPORTED, never typed) and every matrix is '
      + '`OBM_WEIGHT_SLOTS` long',
  },
  gReproLnc0: {
    ok: REPRO_OK_LNC0,
    note: `⭐⭐ G-REPRO-LNC0 — LN-C0's OWN seeds ${REPRO_LNC0_SEEDS[0]}–`
      + `${REPRO_LNC0_SEEDS[REPRO_LNC0_SEEDS.length - 1]} RE-WALKED on this exam's ABSENT arm `
      + 'and matched FIELD FOR FIELD against the COMMITTED `perSeedCells[].E13` rows of '
      + `${LNC0_ARTIFACT} (file sha256 ${LNC0_FILE_SHA}): ${REPRO_FIELDS_COMPARED} field `
      + `comparisons over ${reproRows.length} seeds × `
      + `${reproRows[0]?.fieldsCompared ?? 0} fields, ${REPRO_MISMATCHES} mismatches. ⚠ The ONE `
      + `excluded field is ${REPRO_EXCLUDED_FIELDS.join(', ')} — a machine timing, not a world `
      + 'quantity. ⛔ DECLARED RE-WALKS, NOT CONSUMPTION: block 12,544,000–999 is LN-C0\'s, '
      + 'consumed whole of record. This is the inheritance receipt for EVERY lane and crowd '
      + 'face in this exam',
  },
  gTwoFractions: {
    ok: TWO_FRACTIONS_OK,
    note: `EVERY published face carries its own NUMERATOR and DENOMINATOR and its value is `
      + `exactly their ratio (or NaN on an empty denominator): ${faces.length} face rows, of `
      + `which ${shareFaces.length} are shares. The doc's tables print both`,
  },
  gLoo: {
    ok: LOO_ROWS_OK,
    note: '⭐ LEAVE-ONE-OUT sensitivity in the CONSERVATIVE POINT-SHIFT form (BQ-T1\'s, '
      + '#346/#348), computed for EVERY paired Δ and REPORTED for R1 and R2 on every dose arm: '
      + 'drop each seed, re-derive the POINT Δ, and count a FLIP when the frozen DOWN (or UP) '
      + 'verdict changes with the interval SHIFTED by that seed\'s influence. ⚠ A RECEIPT — it '
      + 'gates no direction',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon: "an artifact is written as compact JSON")           */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'reads', 'guards', 'band', 'offside',
  'medians', 'bins', 'definitions', 'arms', 'doseCopy', 'causes', 'causesWithLicence',
  'pairClasses', 'designations', 'presence', 'contactClasses', 'actions',
  'constructionReceipt', 'flagHygiene', 'gArm', 'gBlindWorld', 'reproLnc0',
  'seeds', 'stats', 'anchoredSites', 'fixtures', 'lockstep', 'xDet', 'xFpProd',
  'perf', 'sizing', 'perSeedCells', 'receiptRows',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'LN-T1',
    title: '「让眼睛来站位」 THE LANE EXAM — does the PERCEPT OFF-BALL POLICY (`obmMovement` '
      + 'ALONE) move the user\'s own two faces on world 13\'s empty-book composition: 撞车 '
      + '(`crowd.crashShare`) and the non-target teammate first on the ball '
      + '(`firstBody.ownNonTarget`), DOWN, resolvedly, with every guard held?',
    doc: 'docs/world-model/LN-T1-LANE-EXAM.md',
    lineage: 'LN-C0 (#388 item 2 — the walker, the corridor test, the first-body channel, the '
      + 'crowd limbs, the cause classes, the estimator and the hash order, REUSED byte for '
      + 'byte and anchored; its seeds RE-WALKED as the inheritance receipt) → OBM-T1 (#230 — '
      + 'the arm construction, the `armMatrix` idiom, the three dose matrices BYTE-COPIED, the '
      + 'guard tolerance form, FLAG-HYGIENE / G-ARM / G-BLIND-WORLD, REUSED) → this exam',
    authorizedBy: 'COMMANDER RULING #389 item 4 (step ② of the ratified order, #366 item 1)',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    kind: 'EXAM — it scores PRE-REGISTERED rules and prints FROZEN READ SENTENCES selected by '
      + 'STORED booleans. ⛔ It arms nothing for the user and ships nothing; the flag stays '
      + 'default OFF and world 13\'s bytes are untouched. The commander rules.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited (gSrcUntouched). The '
      + 'seam, the `obmMovement` MatchConfig flag and the genome door '
      + '`offballMovementWeights` ALL EXIST; a probe arms them. THERE IS NO WRAPPER — '
      + '`gLockstep` proves observed ≡ unobserved byte for byte PER ARM.',
    oneDoorNotTwo: TWO_DOORS.declaration,
    d13NotWalked: '⛔ D13 (the DOSED form the user plays) is NOT walked (#389 item 4(i)): the '
      + 'ENTRY RUNG, if one is named, walks the chosen dose on the form the user plays as its '
      + 'OWN pin. This exam\'s question is whether the policy moves the two faces AT ALL, and '
      + 'the answer must be read against ONE composition — LN-C0\'s E13, the read of record.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/ln-t1-lane-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/ln-t1-lane-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((armK) => ({
    arm: armK, label: ARM_LABEL[armK],
    composition: 'a4MatchFlags(13) as construction flags + armA4World(m, null, 13) — LN-C0\'s '
      + 'E13 EMPTY-BOOK form, the composer CALLED, the flag set NEVER copied'
      + (DOSE[armK] === null ? '' : ' — PLUS the `obmMovement` MatchConfig flag and the '
        + '16-weight matrix written afterwards on all three genome views of both teams'),
    obmMovement: DOSE[armK] !== null,
    ctbSupportPlane: false,
    matrix: DOSE[armK],
    gate: `bqArmedVersion(m) === ${BQ_WORLD_VERSION}`,
  })),
  doseCopy: {
    source: OBMT1_PATH,
    sourceSha256: sha(SRC_OF[OBMT1_PATH]),
    what: '⭐⭐ the three matrices and the ZERO are BYTE-COPIED from OBM-T1\'s probe (anchored) '
      + 'and RE-DERIVED from the `OBM_*` exports by a second, independently shaped sweep; the '
      + 'comparison below is SLOT FOR SLOT',
    featureKeys: OBM_FEATURE_KEYS, outputKeys: OBM_OUTPUT_KEYS,
    weightSlots: OBM_WEIGHT_SLOTS, weightMin: OBM_WEIGHT_MIN, weightMax: OBM_WEIGHT_MAX,
    slotConvention: 'row-major, `output * OBM_FEATURE_KEYS.length + feature` — the seat\'s own',
    rows: DOSE_COPY_ROWS, pass: DOSE_COPY_OK,
  },
  causes: {
    vocabulary: CAUSES,
    labels: {
      L1: 'DESIGNATED — a runner / arriver / overlapper at release, whatever his action',
      L2: 'SUPPORT — `SupportBallCarrier`, undesignated',
      L3a: 'SHAPE, SPOT IN LANE — `MoveToFormationSpot`, undesignated, his CALLED formation '
        + 'spot lies inside the release corridor',
      L3b: 'SHAPE, PATH ACROSS — `MoveToFormationSpot`, undesignated, spot outside',
      L4: 'OTHER — every other action',
    },
    precedence: 'L1 > L2 > L3a > L3b > L4 — LN-C0\'s, UNCHANGED, so G-REPRO-LNC0 compares like '
      + 'with like.',
  },
  causesWithLicence: {
    vocabulary: CAUSES_W,
    predicate: '⭐⭐ THE FOURTH LICENCE (#389 item 4(ii); LN-C0 §COMMANDER CORRECTIONS item 1\'s '
      + 'promise): `p.wallRun !== null && simTime < p.wallRun.until` — the LICENCE WINDOW, read '
      + 'off `Player.wallRun`, whose ONE write is `src/sim/mechanics.ts` (anchored). ⚠ The '
      + 'brain\'s own one-two BURST gate is the NARROWER `simTime < until − 1.1` (anchored): '
      + 'this class reads the LICENCE, not the burst, and says so — so L1w is an UPPER BOUND '
      + 'on bodies actually bursting.',
    precedence: '⭐⭐ WHERE L1w SITS: in a SECOND, PARALLEL precedence L1 > L1w > L2 > L3a > L3b '
      + '> L4, stored BESIDE the five-class composition on the SAME denominator and NEVER '
      + 'folded into L1. A body already carrying a TEAM-SET designation stays L1 (the engine\'s '
      + 'own ledger is still read first); an UNDESIGNATED body whose licence is live becomes '
      + 'L1w; everything else falls through unchanged — `gWalkFixtures` proves the two ladders '
      + 'agree exactly wherever no licence is live.',
  },
  pairClasses: {
    vocabulary: PAIRS,
    labels: {
      P1: 'TABLE — both `MoveToFormationSpot`, undesignated, their two CALLED spots within 4 m',
      P2: 'DESIGNATED — at least one runner / arriver / overlapper',
      P3: 'SUPPORT — at least one `SupportBallCarrier`, none designated',
      P4: 'SHAPE-PATHS — both `MoveToFormationSpot`, undesignated, spots APART',
      P5: 'OTHER',
    },
    precedence: 'P2 > P3 > P1 > P4 > P5 — LN-C0\'s, UNCHANGED.',
  },
  designations: { vocabulary: DESIGNATIONS,
    read: 'READ OFF THE TEAM\'S OWN SETS at the tick — never inferred from movement.' },
  presence: { vocabulary: PRESENCE,
    what: 'PRESENT = also inside the ARM-tick corridor · ARRIVED = outside at arm · `noWindup` '
      + '= the strike resolved NO tracked record — COUNTED, never imputed.' },
  contactClasses: CONTACTS, actions: ACTION_CELLS,
  definitions: {
    population: 'PT-C0\'s, BYTE FOR BYTE, via LN-C0: every MEASURED GROUND PASS '
      + '(`isMeasurableGroundPass`), registered at the strike via `pendingPass`; ONE flight '
      + 'tracked at a time, a new release RETIRES and BOOKS the previous one.',
    laneOccupant: 'an attacking-side OUTFIELD body that is NEITHER the passer NOR the target '
      + 'and is inside the WIDE corridor at the RELEASE tick.',
    theCorridor: 'BN-C0\'s / LN-C0\'s membership test, REUSED: `closestPointOnSegment` CALLED at '
      + '`DV_CORRIDOR_SCALE` = 4 m with the `DV_CLEAR_RADIUS` = 1.5 m guard; `CONTROL_RADIUS` '
      + 'is a TIGHT robustness BIN beside, never a second definition.',
    theCrowd: 'PT-C0\'s limbs at the A4 battery\'s own cadence (`SAMPLE_EVERY` = 10 ticks, open '
      + 'play, attributable side), `DUP_RUN_M` = 4 m; a 撞车 tick is one whose MINIMUM PAIRWISE '
      + 'outfield distance is below 4 m.',
    theGuards: '⭐⭐ OBM-T1\'s ARITHMETIC, COPIED (every fold anchored), read at LN-C0\'s OWN '
      + 'already-anchored sample site (`tick % SAMPLE_EVERY === 0 && playing`) and — unlike '
      + 'the crowd limbs — UNGATED by possession, on BOTH teams: `spreadYOut` = the sd of '
      + 'outfield y for the side NOT in possession, meaned within a match; `spacingMedian` = '
      + 'the median same-side outfield PAIR distance over the match\'s pairs, subsampled every '
      + '`PAIR_SUBSAMPLE` = 6 guard samples; `spacingUnder4` = the share of those pairs under '
      + '`CLOSE_PAIR_M` = 4 m. Each is a PER-MATCH value, then MEANED over matches (OBM-T1\'s '
      + 'own fold) — the denominator is MATCHES, and the unit says so.',
    theTolerance: 'tolerance = NI_FRACTION · |control level|, NI_FRACTION = 1 − 0.275/0.380 '
      + '(PM-T1 §5, inherited from A4-S2P1-VECTOR-CENSUS §4). INHERITED from OBM-T1\'s probe '
      + 'line as an EXPRESSION and anchored — never typed as a decimal. BREACH = resolved AND '
      + 'beyond tolerance in the HARMFUL direction.',
    resolved: 'the 95% cluster-bootstrap interval of the PAIRED Δ excludes zero. DOWN resolved '
      + '(ciHi < 0) = helpful on both primary rulers.',
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold: no read word and no stored boolean depends on one.',
      nearestMateM: { width: NEAR_BIN_M, bins: NEAR_BINS },
      minPairwiseM: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS },
      occupantsPerPass: { width: 1, bins: OCC_BINS },
      distanceToCarrierM: { width: DCARR_BIN_M, bins: DCARR_BINS },
      distanceToCentreLineM: { width: DCENT_BIN_M, bins: DCENT_BINS },
      distanceToTargetM: { width: DTGT_BIN_M, bins: DTGT_BINS },
      velocityAcrossLaneMs: { width: VACROSS_BIN_MS, bins: VACROSS_BINS, centreHoldsZero: true },
      velocityAlongLaneMs: { width: VALONG_BIN_MS, bins: VALONG_BINS, centreHoldsZero: true },
      carrierToPairMidpointM: { width: PAIRMID_BIN_M, bins: PAIRMID_BINS },
      flightRetireTicks: FLIGHT_RETIRE_TICKS,
    },
    engineConstants: {
      DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS, CONTROL_RADIUS, DUP_RUN_M, SAMPLE_EVERY,
      PAIR_SUBSAMPLE, CLOSE_PAIR_M, NI_FRACTION, DT, GRAVITY,
      OBM_WEIGHT_SLOTS, OBM_WEIGHT_MIN, OBM_WEIGHT_MAX,
    },
  },
  constructionReceipt: { seed: WORLD_PIN_SEED, rows: armWorlds, twoDoors: TWO_DOORS,
    ok: WORLD_PIN_OK, emergentPosOn: EMERGENT_POS_ON, formationSpotPath: FORMATION_SPOT_PATH },
  flagHygiene: {
    pass: FLAG_HYGIENE_OK, differingFieldsTotal: HYGIENE_DIFFERING,
    signaturesIdentical: HYGIENE_SIGNATURES_IDENTICAL, seeds: cells.length,
    fieldsComparedPerSeed: hygieneRows[0]?.fieldsCompared ?? 0,
    excludedFields: HYGIENE_EXCLUDED_FIELDS,
    excludedWhy: 'the arm\'s own definition (`obmFlag`, `matrixOnAllViews`, LN-C0\'s '
      + '`seamsAbsent` config echo), its code-path receipt (`policyCacheEntries`) and a machine '
      + 'timing (`wallMs`). EVERYTHING the world produced — every ruler, every guard, every '
      + 'geometric quantity AND the whole-match signature INCLUDING the rng stream state — is '
      + 'compared. Excluded and STATED, never quietly dropped.',
    rows: hygieneRows.filter((r) => r.differingFields.length > 0).slice(0, 25),
  },
  gArm: { pass: G_ARM_OK, rows: gArmRows,
    counter: '`(match as { obmPolicies: Map }).obmPolicies.size` at full time — the match\'s own '
      + 'policy cache, whose ONLY writer is the single `obmMovement` fork in '
      + '`PlayerBrain.decideOffBall` (both anchored). Read exactly as OBM-T1 reads it.' },
  gBlindWorld: G_BLIND_WORLD,
  reproLnc0: {
    pass: REPRO_OK_LNC0, artifact: LNC0_ARTIFACT, artifactFileSha256: LNC0_FILE_SHA,
    seeds: REPRO_LNC0_SEEDS, arm: CONTROL_ARM,
    fieldsComparedPerSeed: reproRows[0]?.fieldsCompared ?? 0,
    fieldComparisonsTotal: REPRO_FIELDS_COMPARED, mismatches: REPRO_MISMATCHES,
    excludedFields: REPRO_EXCLUDED_FIELDS,
    declaredAs: 'RE-WALKS, NOT CONSUMPTION — block 12,544,000–999 is LN-C0\'s, consumed whole '
      + 'of record',
    rows: reproRows,
  },
  xDet: { pass: X_DET, digestA, digestB,
    what: 'the whole core (battery + construction receipt) walked TWICE from scratch; the '
      + 'digest excludes `wallMs`, a machine timing' },
  xFpProd: { pass: X_FP_PROD, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
    baselineSource: `${OBMT1_PATH} (anchored; the value is EXTRACTED, never re-typed)` },
  anchoredSites: ANCHORS, fixtures: FIXTURES, lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-cluster SCRATCH SMOKE (seeds 900,003,500–511), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. N_FROZEN is the LARGEST N the block affords after the construction receipt '
      + 'at 12,545,999; the required N per ruler and MDE(N_FROZEN) are both published.',
    targets: { R1: 0.02, R2: 0.01 },
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
    whichHappened: sizingRows.every((r) => r.resolvableAtNFrozen)
      ? 'the required N was WITHIN what the block affords on every sized ruler; N_FROZEN is the '
        + 'block\'s affordance (the house form LN-C0 used) and MDE(N_FROZEN) is published'
      : 'the required N EXCEEDED what the block affords on at least one sized ruler ⇒ N = the '
        + 'block\'s affordance and the MDE at N is published',
  },
  guards: { limbs: GUARD_LIMBS, rows: guardRows,
    what: 'F-LN-b, OBM-T1\'s guard form. BREACH = resolved AND beyond tolerance in the harmful '
      + 'direction; a breach DISQUALIFIES the arm.' },
  band: { limbs: BAND_LIMBS, rows: bandRows, a4s2p3: A4_S2P3_BAND_CHOICE,
    what: 'THE WORLD-13 DO-NO-HARM BAND on LN-C0\'s own context faces, the SAME tolerance form. '
      + 'For `passCompletion` and `ownedBallSampleShare` DOWN is harmful; for goals and shots '
      + 'BOTH directions are band violations, since the exam claims NO effect on them.' },
  offside: { rows: offsideRows,
    what: '⭐ THE OFFSIDE LIMB in the #157 FLAG form — a resolved INCREASE raises a FLAG and '
      + 'flips NO gate. It enters neither `breach` nor `disqualified`.' },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces, deltas, reads: READS,
  medians: { note: '⭐ every median below is BIN-DERIVED from the stored bins, so `gFaces` '
    + 're-derives each one off the SERIALIZED artifact', values: medians },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
    occupantsPerPass: { width: 1, bins: OCC_BINS, pooled: pooled[armK].occPerPassBins },
    occupantCause: { vocabulary: CAUSES, pooled: pooled[armK].causeN },
    occupantCauseWithLicence: { vocabulary: CAUSES_W, pooled: pooled[armK].causeNW },
    occupantCausePresence: { vocabulary: PRESENCE, groups: CAUSES,
      pooled: pooled[armK].causePresence },
    occupantCauseCarom: { vocabulary: CAUSES, pooled: pooled[armK].caromHits },
    occupantCauseCaromWithLicence: { vocabulary: CAUSES_W, pooled: pooled[armK].caromHitsW },
    occupantCauseSpotInLane: { vocabulary: CAUSES, pooled: pooled[armK].causeSpotInLane },
    occupantCauseSupportSpotInLane: { vocabulary: CAUSES,
      pooled: pooled[armK].causeSupportSpotInLane },
    occupantDesignation: { vocabulary: DESIGNATIONS, pooled: pooled[armK].occDesig },
    occupantAction: { vocabulary: ACTION_CELLS, pooled: pooled[armK].occAction },
    l4Action: { vocabulary: ACTION_CELLS, pooled: pooled[armK].l4Action },
    occupantDistanceToCarrierM: { width: DCARR_BIN_M, bins: DCARR_BINS,
      pooled: pooled[armK].distCarrierBins },
    occupantDistanceToCentreLineM: { width: DCENT_BIN_M, bins: DCENT_BINS,
      pooled: pooled[armK].distCentreBins },
    occupantDistanceToTargetM: { width: DTGT_BIN_M, bins: DTGT_BINS,
      pooled: pooled[armK].distTargetBins },
    occupantVelocityAcrossLaneMs: { width: VACROSS_BIN_MS, bins: VACROSS_BINS,
      centreHoldsZero: true, pooled: pooled[armK].vAcrossBins },
    occupantVelocityAlongLaneMs: { width: VALONG_BIN_MS, bins: VALONG_BINS,
      centreHoldsZero: true, pooled: pooled[armK].vAlongBins },
    firstBodyClass: { vocabulary: CONTACTS, pooled: pooled[armK].firstBody },
    opponentPresence: { vocabulary: PRESENCE, pooled: pooled[armK].oppPresence },
    opponentPresenceTight: { vocabulary: PRESENCE, pooled: pooled[armK].oppPresenceTight },
    nearestMateM: { width: NEAR_BIN_M, bins: NEAR_BINS, pooled: pooled[armK].nearBins },
    minPairwiseM: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, pooled: pooled[armK].minPairBins },
    pairClass: { vocabulary: PAIRS, pooled: pooled[armK].pairN },
    carrierToPairMidpointM: { width: PAIRMID_BIN_M, bins: PAIRMID_BINS,
      pooled: pooled[armK].pairCarrierDistBins },
  }])),
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length, xDetPasses: 2,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    doseReadScratchSeedWalked: DOSE_READ_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    reproLnc0SeedsRewalked: REPRO_LNC0_SEEDS,
    reproDeclaredAs: 'RE-WALKS of LN-C0\'s own consumed block — NOT consumption',
    consumedLedgerQuoted: CONSUMED,
    publishedFrontierAt389: PUBLISHED_FRONTIER_AT_389,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 74 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE, pass 1 only. Never the game\'s frame cost.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
    + 'the artifact stores that list verbatim or stores none" (home: '
    + 'RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). THIS '
    + 'ARTIFACT STORES NONE. The list of record is '
    + 'docs/world-model/LN-T1-LANE-EXAM.md §HONEST LIMITS.',
  perSeedCells, receiptRows,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE, Δ, BOOLEAN AND READ WORD OFF THE
   SERIALIZED ARTIFACT ON DISK                                                 */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: (Record<Arm, Row> & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<Arm, Record<string, { pooled?: unknown }>>;
  medians: { values: Record<Arm, Record<string, unknown>> };
  reads: Record<string, unknown>;
  guards: { rows: typeof guardRows };
  band: { rows: typeof bandRows };
  offside: { rows: Record<string, { delta: number; resolved: boolean; flag: boolean }> };
  sizing: { rows: typeof sizingRows };
  doseCopy: { rows: typeof DOSE_COPY_ROWS };
};
/** ⭐ JSON HAS NO NaN LITERAL: a face on an EMPTY class is NaN and `JSON.stringify` writes it
 *  as `null`. The gate recognises `null` as the SERIALIZATION of NaN — and nothing else. */
const sameNum = (got: number, stored: number | null): boolean => (Number.isNaN(got)
  ? (stored === null || Number.isNaN(stored)) : got === stored);
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = disk.perSeedCells.map((c) => c[f.arm]);
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  faceChecks.push({
    face: `${f.face}@${f.arm}`,
    ok: nu === f.numerator && de === f.denominator && sameNum(ratio(nu, de), f.value),
  });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.face];
  const l = disk.perSeedCells.map((c) => c[dd.arm]);
  const r = disk.perSeedCells.map((c) => c[dd.control]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.armValue) && sameNum(pr, dd.controlValue) && sameNum(pl - pr, dd.delta)
      && dd.down === (dd.ciHi < 0) && dd.up === (dd.ciLo > 0)
      && dd.resolved === (dd.ciHi < 0 || dd.ciLo > 0),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const got = poolFrom(rows);
  const b = disk.bins[armK];
  const cmp = (key: string, want: unknown): void => {
    binChecks.push({ bin: `${armK}.${key}`,
      ok: JSON.stringify(want) === JSON.stringify(b[key]?.pooled ?? []) });
  };
  cmp('occupantsPerPass', got.occPerPassBins);
  cmp('occupantCause', got.causeN);
  cmp('occupantCauseWithLicence', got.causeNW);
  cmp('occupantCausePresence', got.causePresence);
  cmp('occupantCauseCarom', got.caromHits);
  cmp('occupantCauseCaromWithLicence', got.caromHitsW);
  cmp('occupantCauseSpotInLane', got.causeSpotInLane);
  cmp('occupantCauseSupportSpotInLane', got.causeSupportSpotInLane);
  cmp('occupantDesignation', got.occDesig);
  cmp('occupantAction', got.occAction);
  cmp('l4Action', got.l4Action);
  cmp('occupantDistanceToCarrierM', got.distCarrierBins);
  cmp('occupantDistanceToCentreLineM', got.distCentreBins);
  cmp('occupantDistanceToTargetM', got.distTargetBins);
  cmp('occupantVelocityAcrossLaneMs', got.vAcrossBins);
  cmp('occupantVelocityAlongLaneMs', got.vAlongBins);
  cmp('firstBodyClass', got.firstBody);
  cmp('opponentPresence', got.oppPresence);
  cmp('opponentPresenceTight', got.oppPresenceTight);
  cmp('nearestMateM', got.nearBins);
  cmp('minPairwiseM', got.minPairBins);
  cmp('pairClass', got.pairN);
  cmp('carrierToPairMidpointM', got.pairCarrierDistBins);
  binChecks.push({ bin: `${armK}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[armK]) });
  binChecks.push({ bin: `${armK}.partition.occupantsPerPassSumsToFlights`,
    ok: sum(got.occPerPassBins) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${armK}.partition.firstBodySumsToFlights`,
    ok: sum(got.firstBody) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${armK}.partition.causeSumsToOccupants`,
    ok: sum(got.causeN) === sum(rows.map((r) => r.occN))
      && sum(got.occDesig) === sum(rows.map((r) => r.occN))
      && sum(got.occAction) === sum(rows.map((r) => r.occN)) });
  binChecks.push({ bin: `${armK}.partition.licenceLadderSumsToTheSameOccupants`,
    ok: sum(got.causeNW) === sum(got.causeN) });
  binChecks.push({ bin: `${armK}.partition.licenceLadderCaromSumsToTheFiveClassCarom`,
    ok: sum(got.caromHitsW) === sum(got.caromHits) });
  binChecks.push({ bin: `${armK}.partition.L1IsIdenticalInBothLadders`,
    ok: got.causeNW[LWI('L1')] === got.causeN[LCI('L1')] });
  binChecks.push({ bin: `${armK}.partition.L1wIsInsideTheWallRunIncidence`,
    ok: got.causeNW[LWI('L1w')] <= sum(rows.map((r) => r.occWallRunLive)) });
  binChecks.push({ bin: `${armK}.partition.presenceSumsToItsCause`,
    ok: CAUSES.every((c) => sum(got.causePresence[LCI(c)]) === got.causeN[LCI(c)]) });
  binChecks.push({ bin: `${armK}.partition.l4ActionSumsToL4`,
    ok: sum(got.l4Action) === got.causeN[LCI('L4')] });
  binChecks.push({ bin: `${armK}.partition.caromIsInsideItsCause`,
    ok: CAUSES.every((c) => got.caromHits[LCI(c)] <= got.causeN[LCI(c)])
      && CAUSES_W.every((c) => got.caromHitsW[LWI(c)] <= got.causeNW[LWI(c)]) });
  binChecks.push({ bin: `${armK}.partition.pairClassSumsToPairs`,
    ok: sum(got.pairN) === sum(rows.map((r) => r.pairsTotal)) });
  binChecks.push({ bin: `${armK}.partition.crowdArithmeticReproduces`,
    ok: rows.every((r) => r.crashHits === r.crashHitsAlt && r.dupRunSum === r.dupRunSumAlt) });
  binChecks.push({ bin: `${armK}.partition.guardPairsUnder4IsInsideGuardPairs`,
    ok: sum(rows.map((r) => r.guardPairsUnder4)) <= sum(rows.map((r) => r.guardPairsTotal)) });
  binChecks.push({ bin: `${armK}.partition.spotInLaneIsInsideEligibleBodies`,
    ok: sum(rows.map((r) => r.spotInLaneAll)) <= sum(rows.map((r) => r.eligibleBodies))
      && sum(rows.map((r) => r.occN)) <= sum(rows.map((r) => r.eligibleBodies)) });
}
/** ⭐⭐ THE GUARD, BAND, OFFSIDE AND SELECTOR BOOLEANS, RE-DERIVED OFF DISK. */
const diskDelta = (k: string, a: Arm): DeltaRow =>
  disk.deltas.find((x) => x.face === k && x.arm === a) as DeltaRow;
for (const g of disk.guards.rows) {
  const control = disk.faces.find((f) => f.face === g.key && f.arm === CONTROL_ARM) as FaceRow;
  const tol = NI_FRACTION * Math.abs(control.value);
  binChecks.push({ bin: `guard.${g.key}.tolerance`,
    ok: control.value === g.controlLevel && tol === g.toleranceAbs });
  for (const a of DOSE_ARMS) {
    const d = diskDelta(g.key, a);
    const beyond = g.direction === 'ceiling' ? d.delta > tol : d.delta < -tol;
    binChecks.push({ bin: `guard.${g.key}@${a}`,
      ok: d.delta === g.arms[a].delta && d.resolved === g.arms[a].resolved
        && beyond === g.arms[a].beyondTolerance
        && (d.resolved && beyond) === g.arms[a].breach });
  }
}
for (const bd of disk.band.rows) {
  const control = disk.faces.find((f) => f.face === bd.key && f.arm === CONTROL_ARM) as FaceRow;
  const tol = NI_FRACTION * Math.abs(control.value);
  binChecks.push({ bin: `band.${bd.key}.tolerance`,
    ok: control.value === bd.controlLevel && tol === bd.toleranceAbs });
  for (const a of DOSE_ARMS) {
    const d = diskDelta(bd.key, a);
    const beyond = bd.harmfulDirection === 'down' ? d.delta < -tol : Math.abs(d.delta) > tol;
    binChecks.push({ bin: `band.${bd.key}@${a}`,
      ok: d.delta === bd.arms[a].delta && d.resolved === bd.arms[a].resolved
        && beyond === bd.arms[a].beyondTolerance
        && (d.resolved && beyond) === bd.arms[a].breach });
  }
}
for (const a of DOSE_ARMS) {
  const o = disk.offside.rows[a];
  const d = diskDelta('guard.offsidesPerMatch', a);
  binChecks.push({ bin: `offside.${a}`,
    ok: d.delta === o.delta && d.resolved === o.resolved
      && (d.resolved && d.delta > 0) === o.flag });
}
const diskReads = disk.reads as unknown as typeof READS;
for (const a of DOSE_ARMS) {
  const s = diskReads.selectors[a];
  const r1 = diskDelta('crowd.crashShare', a);
  const r2 = diskDelta('firstBody.ownNonTarget', a);
  const gB = disk.guards.rows.filter((g) => g.arms[a].breach).map((g) => g.key);
  const bB = disk.band.rows.filter((x) => x.arms[a].breach).map((x) => x.key);
  const breach = gB.length > 0 || bB.length > 0;
  binChecks.push({ bin: `reads.selectors.${a}`,
    ok: s.r1Down === (r1.ciHi < 0) && s.r1Up === (r1.ciLo > 0)
      && s.r2Down === (r2.ciHi < 0) && s.r2Up === (r2.ciLo > 0)
      && s.r1Delta === r1.delta && s.r2Delta === r2.delta
      && s.breach === breach
      && s.disqualified === ((r1.ciLo > 0) || (r2.ciLo > 0) || breach)
      && JSON.stringify(s.guardBreaches) === JSON.stringify(gB)
      && JSON.stringify(s.bandBreaches) === JSON.stringify(bB) });
  const cf = diskReads.counterfactualWords[a];
  const word = s.disqualified ? 'read5'
    : (s.r1Down && s.r2Down) ? 'read1' : s.r1Down ? 'read2' : s.r2Down ? 'read3' : 'read4';
  binChecks.push({ bin: `reads.counterfactual.${a}`,
    ok: cf.word === word
      && cf.sentence === (word === 'read1' ? READ_LITERALS.read1(a)
        : READ_LITERALS[word as 'read2' | 'read3' | 'read4' | 'read5']) });
}
{
  const q = DOSED_CORNERS.filter((a) => !diskReads.selectors[a].disqualified);
  const allDq = q.length === 0;
  const r1d = q.some((a) => diskReads.selectors[a].r1Down);
  const r2d = q.some((a) => diskReads.selectors[a].r2Down);
  const both = q.filter((a) => diskReads.selectors[a].r1Down && diskReads.selectors[a].r2Down);
  const sel = allDq ? 'read5' : both.length > 0 ? 'read1'
    : r1d && !r2d ? 'read2' : r2d && !r1d ? 'read3' : (!r1d && !r2d) ? 'read4' : 'read1';
  const aor = both.map((a) => ({ arm: a, r1Delta: diskReads.selectors[a].r1Delta }))
    .sort((x, y) => x.r1Delta - y.r1Delta);
  const armRec = aor.length > 0 ? aor[0].arm : null;
  const sentence = sel === 'read1' ? READ_LITERALS.read1(armRec ?? 'NONE')
    : READ_LITERALS[sel as 'read2' | 'read3' | 'read4' | 'read5'];
  binChecks.push({ bin: 'reads.selectedReadRederives',
    ok: sel === diskReads.selectedRead && sentence === diskReads.sentence
      && armRec === diskReads.armOfRecord
      && JSON.stringify(q) === JSON.stringify(diskReads.qualifyingArms)
      && allDq === diskReads.allDosedDisqualified
      && r1d === diskReads.anyQualifyingR1Down && r2d === diskReads.anyQualifyingR2Down
      && (both.length > 0) === diskReads.anyQualifyingBoth
      && JSON.stringify(aor) === JSON.stringify(diskReads.armOfRecordComparison) });
  binChecks.push({ bin: 'reads.sentenceIsOneOfTheFrozenLiterals',
    ok: [READ_LITERALS.read2, READ_LITERALS.read3, READ_LITERALS.read4, READ_LITERALS.read5,
      ...ARMS.map((a) => READ_LITERALS.read1(a)), READ_LITERALS.read1('NONE')]
      .includes(diskReads.sentence) });
  const u = diskReads.universals;
  binChecks.push({ bin: 'reads.universalsRederive',
    ok: u.everyDosedCornerDisqualified === allDq
      && u.noQualifyingArmHasR1Down === !r1d && u.noQualifyingArmHasR2Down === !r2d
      && u.noDosedCornerHasR1Down
        === !DOSED_CORNERS.some((a) => diskReads.selectors[a].r1Down)
      && u.everyDosedCornerHasR1Down
        === DOSED_CORNERS.every((a) => diskReads.selectors[a].r1Down)
      && u.everyDosedCornerHasR2Down
        === DOSED_CORNERS.every((a) => diskReads.selectors[a].r2Down)
      && u.everyGuardHeldOnEveryDoseArm
        === disk.guards.rows.every((g) => DOSE_ARMS.every((a) => !g.arms[a].breach))
      && u.everyBandFaceHeldOnEveryDoseArm
        === disk.band.rows.every((x) => DOSE_ARMS.every((a) => !x.arms[a].breach))
      && u.noOffsideFlagOnAnyDoseArm === DOSE_ARMS.every((a) => !disk.offside.rows[a].flag) });
}
/** ⭐ THE DOSE COPY re-derives off disk too. */
for (const r of disk.doseCopy.rows) {
  const want = doseFromExports(r.arm);
  binChecks.push({ bin: `doseCopy.${r.arm}`,
    ok: JSON.stringify(want) === JSON.stringify(r.rederivedFromExports)
      && (r.copiedMatrix === null ? want === null
        : (r.copiedMatrix as number[]).every((v, i) => v === (want as number[])[i]))
      && r.slotForSlot === true });
}
/** ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step. */
for (const r of disk.sizing.rows) {
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
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'partition / GUARD / BAND / OFFSIDE / SELECTOR / READ-WORD / DOSE-COPY / sizing checks '
    + 're-derived from the SERIALIZED artifact off disk — canon, VERBATIM: "the re-derivation '
    + 'gate covers EVERY published face; a percentile face requires stored bins". EVERY stored '
    + 'boolean and EVERY read word is INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: every selector boolean, every '
    + 'disqualification, the arm-of-record COMPARISON, the selected read, the printed sentence, '
    + 'every counterfactual word and every UNIVERSAL are RE-DERIVED by applying the FROZEN '
    + 'rules to the SERIALIZED artifact off disk, and the printed sentence must be one of the '
    + 'frozen literals. canon, VERBATIM: "a universal sentence about a table (\'every bin\', '
    + '\'the one bin\') is a stored boolean or is not written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
const SCHEMA_COMPLETE = BODY_SCHEMA.every((k) => artifact[k] !== undefined)
  && (BODY_SCHEMA as readonly string[]).includes('allGreen')
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail')
  && !(BODY_SCHEMA as readonly string[]).includes('receipts');
gates.gHashOrder = {
  ok: SCHEMA_COMPLETE,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
    + `${BODY_SCHEMA.length}-key schema is complete, covers the per-seed cells, the `
    + 'construction receipt AND `allGreen` (the gate verdict is INSIDE the allowlist), and '
    + 'EXCLUDES `hashedBodySha256`, `gFacesDetail` and `receipts`; the body hash is computed '
    + 'LAST — after every body key is assigned — and a NON-body '
    + '`receipts.hashReproducesFromFile` records that it reproduces from the written file',
};
artifact.gates = gates;
const ALL_GREEN_FINAL = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN_FINAL;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after every gate */
const OUT_PATH = ALL_GREEN_FINAL ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
const HASH_REPRODUCES_FROM_FILE = (() => {
  const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();
artifact.receipts = {
  what: '⭐⭐ canon, VERBATIM: "the body hash is computed after every body key is assigned, and '
    + 'a NON-body receipt field records that the hash reproduces from the written file" (home: '
    + 'RC-T1A-PRECUE-EXAM.md §COMMANDER CORRECTIONS item 3, ruling #372 item 3). This block is '
    + 'OUTSIDE `BODY_SCHEMA` by construction.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential. The FINAL file byte-hash and byte count are recomputed after the '
    + 'final write and PUBLISHED IN THE DOC\'s §GATES.',
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
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`LN-T1 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE TWO RULERS (paired Δ vs ABSENT) ---');
banner(`  ABSENT levels: R1 撞车 ${f6(face('crowd.crashShare', 'ABSENT').value)} `
  + `(${face('crowd.crashShare', 'ABSENT').numerator}/`
  + `${face('crowd.crashShare', 'ABSENT').denominator}) · R2 ownNonTarget `
  + `${f6(face('firstBody.ownNonTarget', 'ABSENT').value)} `
  + `(${face('firstBody.ownNonTarget', 'ABSENT').numerator}/`
  + `${face('firstBody.ownNonTarget', 'ABSENT').denominator})`);
for (const a of DOSE_ARMS) {
  const r1 = delta('crowd.crashShare', a);
  const r2 = delta('firstBody.ownNonTarget', a);
  banner(`  ${a.padEnd(14)} R1 Δ ${f6(r1.delta)} [${f6(r1.ciLo)}, ${f6(r1.ciHi)}] `
    + `${r1.down ? 'DOWN' : r1.up ? 'UP' : '—'} · R2 Δ ${f6(r2.delta)} `
    + `[${f6(r2.ciLo)}, ${f6(r2.ciHi)}] ${r2.down ? 'DOWN' : r2.up ? 'UP' : '—'} · `
    + `breach ${SELECTORS[a].breach} · disqualified ${SELECTORS[a].disqualified}`);
}
banner('');
banner('--- §R2 THE GUARDS AND THE BAND ---');
for (const g of guardRows) {
  banner(`  ${g.key} [${g.direction}] control ${f6(g.controlLevel)} · tol ±${f6(g.toleranceAbs)}`);
  for (const a of DOSE_ARMS) {
    banner(`    ${a.padEnd(14)} Δ ${f6(g.arms[a].delta)} [${f6(g.arms[a].ci[0])}, `
      + `${f6(g.arms[a].ci[1])}] resolved ${g.arms[a].resolved} breach ${g.arms[a].breach}`);
  }
}
for (const b of bandRows) {
  banner(`  BAND ${b.key} [${b.harmfulDirection}] control ${f6(b.controlLevel)} · tol `
    + `±${f6(b.toleranceAbs)}`);
  for (const a of DOSE_ARMS) {
    banner(`    ${a.padEnd(14)} Δ ${f6(b.arms[a].delta)} [${f6(b.arms[a].ci[0])}, `
      + `${f6(b.arms[a].ci[1])}] resolved ${b.arms[a].resolved} breach ${b.arms[a].breach}`);
  }
}
banner('');
banner('--- §R3 THE COMPOSITION WITH THE FOURTH LICENCE ---');
for (const a of ARMS) {
  banner(`  ${a.padEnd(14)} ${CAUSES_W.map((c) => `${c} ${f6(face(`compositionW.${c}`, a).value)}`)
    .join(' · ')}  n=${face('compositionW.L1', a).denominator}`);
  banner(`  ${''.padEnd(14)} carom ${CAUSES_W.map((c) => `${c} ${f6(face(`caromW.${c}`, a).value)}`)
    .join(' · ')}`);
}
banner('');
banner('--- §R4 THE READ ---');
banner(`  ${READS.sentence}`);
banner(`  (selected ${READS.selectedRead} · arm of record ${READS.armOfRecord ?? 'none'} · `
  + `qualifying [${READS.qualifyingArms.join(', ')}])`);
for (const a of DOSE_ARMS) {
  banner(`  counterfactual ${a.padEnd(14)} ${READS.counterfactualWords[a].word}`);
}
banner('');
banner(`spacingUnder4 (OBM-T1 form) ABSENT ${f6(face('guard.spacingUnder4', 'ABSENT').value)}`);
banner(`formationSpot path: ${FORMATION_SPOT_PATH}`);
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch).toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
