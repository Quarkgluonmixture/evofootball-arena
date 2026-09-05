/**
 * ⭐⭐ LN-C0 — 「谁站在传球线上」 THE LANE CENSUS
 * (docs/world-model/LN-C0-LANE-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #388 item 2 (step ② of the ratified order, #366 item 1).
 * Lineage: PT-C0 (the population, the `ball.lastTouch` first-body channel and the CROWD limbs,
 * REUSED byte for byte) → BN-C0 (the CORRIDOR membership test and its present/arrived split,
 * REUSED and anchored) → BQ-T1 (every lane face UNMOVED by the cushion ⇒ world 12 is not
 * walked) → this census, on WORLD 13's composition.
 *
 * THE QUESTION: when a ground pass is struck, WHO is standing in its corridor who was not meant
 * to receive it, and WHAT put him there — a coach's designation (read off `team.runners` /
 * `team.arriver` / `team.overlapper` — the engine's OWN sets), the support seat's target, his
 * FORMATION SPOT itself sitting in the lane, or his PATH across the lane to reach that spot?
 * And for every pair of attackers within four metres: two spots too close on the formation
 * table, or two bodies whose spots are apart but who crossed?
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis and arms no
 * mechanism — it NAMES a lever, it does not pull one. The READ SENTENCES are FROZEN LITERALS
 * selected by STORED majority booleans.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe CALLS shipped
 * exports (`formationSpot`, `supportSpot`, `closestPointOnSegment`, `a4MatchFlags`,
 * `armA4World`) and reads public `Match` / `Team` state per tick. THERE IS NO WRAPPER.
 * ⛔ WORLD 13 IS THE BASE, UNTOUCHED; world 12 is not walked.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 * ⇒ THE DESIGNATION IS READ OFF THE TEAM'S OWN SETS at the tick; `formationSpot` and
 * `supportSpot` are CALLED and are DECLARED RECONSTRUCTIONS at the census's instant.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  BQ_WORLD_VERSION, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { formationSpot, supportSpot, emergentPosOn } from '../../src/ai/formations';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the PT-C0 / BN-C0 §1 form)                  */
/* ========================================================================== */
const ENV_WHITELIST = ['LNC0_MODE', 'LNC0_N', 'LNC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('LNC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`LN-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.LNC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('LN-C0 FATAL — LNC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.LNC0_N !== undefined ? Number(process.env.LNC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('LN-C0 FATAL — LNC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.LNC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`LNC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`LNC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`LNC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ln-c0-lane-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ln-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('LN-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set, copied)                                    */
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
/* §3 THE ANCHORED SITES — anchored needle + line receipt, never first-occurrence
   canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4)                                        */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const TYPES_PATH = 'src/sim/types.ts';
const TEAM_PATH = 'src/sim/Team.ts';
const A4_PATH = 'src/game/a4World.ts';
const DV_PATH = 'src/ai/deliveryValueSeat.ts';
const VEC_PATH = 'src/utils/vec.ts';
const FORM_PATH = 'src/ai/formations.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const TEAMBRAIN_PATH = 'src/ai/TeamBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const PTC0_PATH = 'scripts/probes/pt-c0-playtest-forensic-census.ts';
const BNC0_PATH = 'scripts/probes/bn-c0-bounce-census.ts';
const RAT1B_PATH = 'scripts/probes/ra-t1b-access-exam.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, CONST_PATH, TYPES_PATH, TEAM_PATH, A4_PATH, DV_PATH, VEC_PATH,
  FORM_PATH, BRAIN_PATH, TEAMBRAIN_PATH, EXEC_PATH, A4P1C_PATH, PTC0_PATH, BNC0_PATH,
  RAT1B_PATH]) {
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

/* ⭐⭐ THE FOUR DESIGNATION SETS — the engine's OWN ledger, declared in Team.ts */
anchor('⭐⭐ `team.chasers` — the engine\'s own set, DECLARED', TEAM_PATH,
  '  chasers = new Set<number>();', 1);
anchor('⭐⭐ `team.runners` — the engine\'s own set, DECLARED', TEAM_PATH,
  '  runners = new Set<number>();', 1);
anchor('⭐⭐ `team.arriver` — the engine\'s own designation, DECLARED', TEAM_PATH,
  '  arriver: number | null = null;', 1);
anchor('⭐⭐ `team.overlapper` — the engine\'s own designation, DECLARED', TEAM_PATH,
  '  overlapper: number | null = null;', 1);
anchor('⭐ the sets are PLAYER INDICES (`team.marks` maps the same space)', TEAM_PATH,
  '  marks = new Map<number, number>();', 1);
/* ⭐⭐ WHO WRITES THEM — TeamBrain's own assignment, so the read is of a REAL ledger */
anchor('⭐⭐ `assignRunners` — the ONE writer of runners/arriver/overlapper', TEAMBRAIN_PATH,
  'function assignRunners(team: Team, match: Match): void {', 1);
anchor('⭐⭐ the runner ROLE WEIGHTS — `RUN_ROLE_W`, the coach\'s own table', TEAMBRAIN_PATH,
  "const RUN_ROLE_W: Record<Role, number> = { GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };", 1);
anchor('⭐ the runner COUNT rule (mode/tempo/urgency)', TEAMBRAIN_PATH,
  "    (team.mode === 'CounterAttack' || team.genome.tempo > 0.65 ? 2 : 1) +", 1);
anchor('⭐ the runners are SCORED on `RUN_ROLE_W` + `localX`', TEAMBRAIN_PATH,
  '    .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))', 1);
anchor('⭐ the ARRIVER\'s edge-of-box arc trigger', TEAMBRAIN_PATH,
  '  if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {', 1);
anchor('⭐ 套边 — the OVERLAPPER\'s width × overlapW gate', TEAMBRAIN_PATH,
  '    team.genome.attackingWidth * team.policy.overlapW > 0.3', 1);
anchor('⭐ the licensing runs only for the side IN POSSESSION', TEAMBRAIN_PATH,
  '  if (match.possessionSide !== team.side) return;', 1);
/* ⭐⭐ THE DECISION SURFACE — the action vocabulary the L classes read */
anchor('⭐⭐ the MakeRun LICENSING line — a designation licenses the run over the fan',
  BRAIN_PATH,
  "    if ((team.runners.has(p.index) || arriving) && (carrier ? carrier !== p : match.phase === 'restart' || crashLive || crossLive)) {",
  1);
anchor('⭐⭐ the ARRIVER licence read', BRAIN_PATH, '    const arriving = team.arriver === p.index;', 1);
anchor('⭐⭐ the OVERLAPPER licence read', BRAIN_PATH,
  '    if (team.overlapper === p.index && carrier && carrier !== p) {', 1);
anchor('⭐⭐ the SupportBallCarrier PUSH SITE — the support fan\'s own candidate', BRAIN_PATH,
  "      cands.push({ action: 'SupportBallCarrier', score: s, why: `dist ${d.toFixed(0)}m · mode ${team.mode}` });",
  1);
anchor('⭐⭐ `W.supportBase` — the fan\'s own base score', BRAIN_PATH,
  '      let s = (W.supportBase + clamp01(1 - d / 30) * W.supportProxW + roleBonus) * modeMul;', 1);
anchor('⭐⭐ the MoveToFormationSpot PUSH SITES — TWO, ENUMERATED with their line receipts: the '
  + 'IN-POSSESSION default (its own `W.formationBase` score line is anchored separately below) '
  + 'and the out-of-possession block-holding one', BRAIN_PATH,
  "      action: 'MoveToFormationSpot',", 2);
anchor('⭐⭐ `W.formationBase` — the shape-keeper\'s own base score', BRAIN_PATH,
  '      score: W.formationBase + (tired ? 0.2 : 0),', 1);
anchor('⭐ the DECIDED action is written with its own top-4 `scores`', BRAIN_PATH,
  '    scores: cands.slice(0, 4),', 1);
/* ⭐⭐ THE TWO SPOT FUNCTIONS — CALLED, with their signatures and the toggle pinned */
anchor('⭐⭐ `formationSpot`\'s SIGNATURE (the census CALLS it)', FORM_PATH,
  'export function formationSpot(\n  p: Player, team: Team, ball: Ball, hasBall: boolean, opp?: Team, abandonRest = false,\n  pmMover = false,\n): V2 {',
  1);
anchor('⭐⭐ THE `emergentPosOn()` TOGGLE AT THE HEAD of formationSpot — which path world 13 takes',
  FORM_PATH,
  '  if (emergentPosOn()) return emergentStation(p, team, ball, hasBall, opp, abandonRest, pmMover);',
  1);
anchor('⭐⭐ the toggle\'s DEFAULT is ON (null = use the default)', FORM_PATH,
  '  return true; // DEFAULT ON', 1);
anchor('⭐ the toggle\'s ONLY env door (this census REFUSES that env at §1)', FORM_PATH,
  "  if (typeof process !== 'undefined' && process.env && process.env.EMERGENT_POS === '0') return false;",
  1);
anchor('⭐⭐ `supportSpot`\'s SIGNATURE (the census CALLS it)', FORM_PATH,
  'export function supportSpot(p: Player, team: Team, ball: Ball, ctbPlane = false): V2 {', 1);
anchor('⭐⭐ the CTB fork inside supportSpot — the seam that is SHUT here', FORM_PATH,
  '  if (ctbPlane) {', 1);
/* ⭐⭐ THE PRODUCTION ARGUMENT RECIPE — what the executor hands the two functions */
anchor('⭐⭐ the executor\'s MoveToFormationSpot walk target — the production call', EXEC_PATH,
  '      target = formationSpot(p, team, ball, hasBall, opp, abandonRest, pmMover);', 2);
anchor('⭐⭐ the executor\'s SupportBallCarrier target — the production call', EXEC_PATH,
  '      target = supportSpot(p, team, ball, match.ctbSupportPlane);', 1);
anchor('⭐ production `hasBall`', EXEC_PATH, '  const hasBall = match.possessionSide === team.side;', 1);
anchor('⭐ production `abandonRest`', EXEC_PATH,
  '  const abandonRest = match.abandonRestDesignation === team.side;', 1);
anchor('⭐ production `pmMover`', EXEC_PATH,
  "  const pmMover = match.pmLaneConvergence && match.phase === 'playing';", 1);
/* ⭐⭐ THE CORRIDOR — BN-C0's construction, from the engine's own two constants */
anchor('⭐⭐ `DV_CORRIDOR_SCALE` — laneOpenness\'s own metre normalizer', DV_PATH,
  'export const DV_CORRIDOR_SCALE = 4;', 1, 4);
anchor('⭐⭐ `DV_CLEAR_RADIUS` — laneOpenness\'s own clear-the-kicker guard', DV_PATH,
  'export const DV_CLEAR_RADIUS = 1.5;', 1, 1.5);
anchor('⭐ laneOpenness\'s OWN clear-the-kicker line (the guard this test reuses)', DV_PATH,
  '    if (dist(cp, from as V2) < DV_CLEAR_RADIUS) continue;', 1);
anchor('⭐ laneOpenness\'s OWN scale line', DV_PATH,
  '    const e = 1 - clamp01(lack / DV_CORRIDOR_SCALE);', 1);
anchor('⭐⭐ `closestPointOnSegment` — CALLED, never re-implemented', VEC_PATH,
  'export const closestPointOnSegment = (a: V2, b: V2, p: V2): V2 => {', 1);
anchor('⭐ `CONTROL_RADIUS` — the BK shell\'s own reach (the TIGHT bin\'s half-width)', CONST_PATH,
  'export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;', 1);
anchor('⭐⭐ BN-C0\'s OWN corridor membership test — the code this census COPIES', BNC0_PATH,
  'const inCorridorOf = (', 1);
/* ⭐⭐ PT-C0's CROWD LIMBS and their constants (the A4 battery's own) */
anchor('⭐⭐ `DUP_RUN_M` — the A4 battery I6 duplicate-run bucket (NO new constant)', A4P1C_PATH,
  'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)', 1, 4);
anchor('⭐⭐ `SAMPLE_EVERY` — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);
anchor('⭐⭐ the A4 limb\'s OUTFIELDER FILTER, verbatim', A4P1C_PATH,
  "const outs = mine.players.filter((q) => q.role !== 'GK' && !q.sentOff);", 1);
anchor('⭐⭐ the A4 limb\'s DUP-RUN PAIR TEST, verbatim', A4P1C_PATH,
  'if (b > a && dd < DUP_RUN_M) dupRunSum += 1;', 1);
anchor('⭐⭐ PT-C0\'s 撞车 line — the min-pairwise face this census REPRODUCES on world 13',
  PTC0_PATH, '          if (mp < DUP_RUN_M) row.crashHits += 1;', 1);
anchor('⭐⭐ PT-C0\'s dup-run accumulation line', PTC0_PATH,
  '        row.dupRunSum += dupRunPairsOf(xs, ys);', 1);
anchor('⭐⭐ PT-C0\'s nearest-mate accumulation line', PTC0_PATH,
  '            row.spacingSum += nearest;', 1);
anchor('⭐⭐ PT-C0\'s sample cadence line', PTC0_PATH,
  '    if (tick % SAMPLE_EVERY === 0 && playing) {', 1);
/* ⭐⭐ PT-C0's POPULATION and FIRST-BODY channel (RA-T1B's predicates) */
anchor('⭐⭐ PT-C0\'s `isMeasurableGroundPass`, the population of record (TWO occurrences in its '
  + 'instrument — the definition and its own gAnchoredConstants pin — both enumerated)',
  PTC0_PATH,
  'const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>', 2);
anchor('⭐⭐ PT-C0\'s ground-launch predicate (TWO occurrences, both enumerated)', PTC0_PATH,
  'const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>', 2);
anchor('⭐⭐ PT-C0\'s FIRST-BODY class ladder', PTC0_PATH, 'const contactClassOf = (', 1);
anchor('⭐ RA-T1B\'s own `isMeasurableGroundPass` — the ancestor line', RAT1B_PATH,
  'const isMeasurableGroundPass = (', 1);
/* ⭐⭐ THE WIND-UP RECORD — the census's right to read the ARM tick */
anchor('⭐⭐ `pendingPassWindup` — the ARM record this census reads', MATCH_PATH,
  '  pendingPassWindup:', 1);
anchor('⭐⭐ the record\'s own fields (gid / readyTick / aim / targetGid / aimLead)', MATCH_PATH,
  '      gid: number; readyTick: number; aim: V2;', 1);
anchor('⭐ the record\'s `aimLead` field — the pass class toFeet/carried channel', MATCH_PATH,
  '      aimLead: V2 | null;', 1);
anchor('⭐ `pendingPass` — the target and the strike registration', MATCH_PATH,
  '  pendingPass: PendingPass | null = null;', 1);
anchor('⭐ `possessionSide` — the attacking side of record', MATCH_PATH,
  '  possessionSide: Side | -1 = -1;', 1);
/* ⭐ WORLD 13's own composition */
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door, the composer CALLING world 12', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `BQ_WORLD_DOORS` — the cushion, a body law', A4_PATH,
  'export const BQ_WORLD_DOORS = { bqCushion: true } as const;', 1);
anchor('⭐⭐ `armBqWorld` = world 12\'s arming, CALLED (TWO occurrences of the call line — '
  + '`armBqWorld`\'s body and `armA4World`\'s RA branch — both enumerated)', A4_PATH,
  '  armRaWorld(match, l3Dose, pcDose);', 2);
anchor('⭐⭐ `bqArmedVersion` — the world gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);
anchor('⭐ `armA4World`\'s BQ branch RETURNS before the tables refusal', A4_PATH,
  '  if (isBqWorld(version)) {\n    armBqWorld(match, l3Dose, pcDose);\n    return;\n  }', 1);

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

/** ⭐⭐ THE TWO CROWD CONSTANTS — ANCHORED above from the A4 battery, NO new constant. */
const DUP_RUN_M = 4;
const SAMPLE_EVERY = 10;

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && ACTIONS.length === 23
  && ACTIONS[0] === 'MoveToFormationSpot'
  && ACTIONS.includes('SupportBallCarrier') && ACTIONS.includes('MakeRun')
  && ACTIONS.includes('ChaseBall') && ACTIONS.includes('InterceptPass')
  && ACTIONS.includes('MarkOpponent') && ACTIONS.includes('Dribble')
  && ACTIONS.includes('ReceivePass')
  && DUP_RUN_M === (ANCHORS.find((a) => a.needle.startsWith('const DUP_RUN_M'))!
    .extracted as number)
  && SAMPLE_EVERY === (ANCHORS.find((a) => a.needle.startsWith('const SAMPLE_EVERY'))!
    .extracted as number)
  && DV_CORRIDOR_SCALE === 4 && DV_CLEAR_RADIUS === 1.5
  && BQ_WORLD_VERSION === 13 && GRAVITY === 9.81;

/** ⭐⭐ WHICH PATH THE TOGGLE TAKES IN WORLD 13 — determined, not assumed. The env door is
 *  REFUSED at §1, and `setEmergentPos` is never called by this instrument, so the toggle is at
 *  its DEFAULT. The value is READ from the shipped function and STORED. */
const EMERGENT_POS_ON = emergentPosOn();
const FORMATION_SPOT_PATH = EMERGENT_POS_ON
  ? 'emergentStation (the DEFAULT-ON emergent positioning field) — world 13 takes THIS path'
  : 'the legacy fixed-table path (ATTACK_FORMATIONS / DEFEND_FORMATIONS)';

/* ========================================================================== */
/* §4 SEEDS — block 12,544,000–999 (#388 item 2(vi))                           */
/* ========================================================================== */
const BLOCK_BASE = 12_544_000;
const BLOCK_TOP = 12_544_999;
/** ⭐⭐ N_FROZEN = 998 — the LARGEST N the block affords under #388 item 2(vi)'s own cap
 *  (N ≤ 998) after the construction receipt at 12,544,999. Sized by the §DEV-PREFLIGHT
 *  12-cluster scratch smoke BEFORE the freeze commit and BEFORE any battery seed. */
const N_FROZEN = 998;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_003_400;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

/* ========================================================================== */
/* §5 THE ARMS — TWO, PAIRED on shared seeds; the composer CALLED, never copied */
/* ========================================================================== */
const ARMS = ['E13', 'D13'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E13: 'world 13 EMPTY-BOOK — the new base',
  D13: 'world 13 DOSED — THE FORM THE USER PLAYS',
};
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('LN-C0 FATAL — a dose file\'s BYTES do not match the pinned value (#388 item 2(i))');
  banner(`  l3 got ${L3_DOSE_BYTES_SHA} want ${L3_DOSE_PIN}`);
  banner(`  pc got ${PC_DOSE_BYTES_SHA} want ${PC_DOSE_PIN}`);
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
  banner(`LN-C0 FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** PT-C0's own population construction per seed, so the two arms differ ONLY in the doses. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'E13') armA4World(m, null, BQ_WORLD_VERSION);
  else armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed                          */
/* ========================================================================== */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
/** ⭐⭐ PT-C0's population ladder, BYTE FOR BYTE. */
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
/** ⭐⭐ PT-C0's FIRST-BODY CLASSES, reused byte for byte. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');

/** ⭐⭐ THE CORRIDOR MEMBERSHIP — BN-C0's test, COPIED and anchored: `laneOpenness`'s own
 *  geometry through `closestPointOnSegment` (CALLED), at its own scale `DV_CORRIDOR_SCALE`
 *  with its own clear-the-kicker guard `DV_CLEAR_RADIUS`. The `CONTROL_RADIUS` half-width is
 *  the TIGHT robustness BIN beside — a bin, never a second definition. */
const inCorridorOf = (
  fromX: number, fromY: number, aimX: number, aimY: number,
  px: number, py: number, halfWidth: number,
): boolean => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  if (Math.hypot(cp.x - fromX, cp.y - fromY) < DV_CLEAR_RADIUS) return false;
  return Math.hypot(cp.x - px, cp.y - py) < halfWidth;
};
/** the distance from a body to the corridor's CENTRE LINE (the same closest point). */
const centreLineDistOf = (
  fromX: number, fromY: number, aimX: number, aimY: number, px: number, py: number,
): number => {
  const cp = closestPointOnSegment({ x: fromX, y: fromY }, { x: aimX, y: aimY }, { x: px, y: py });
  return Math.hypot(cp.x - px, cp.y - py);
};

/** ⭐⭐ THE DESIGNATION — READ OFF THE TEAM'S OWN SETS (the engine's ledger). Never inferred
 *  from movement. `runner` / `arriver` / `overlapper` / `chaser` / `none`, in that FROZEN
 *  precedence: the three IN-POSSESSION licences first (they are what license `MakeRun` over the
 *  fan), then the loose-ball chase assignment, then nobody. */
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

/** ⭐⭐ THE OCCUPANT CAUSE CLASSES, in the FROZEN PRECEDENCE L1 > L2 > L3a > L3b > L4.
 *  WHY THIS ORDER, from the decision surface itself (anchored): a DESIGNATION is a top-down
 *  licence written by `assignRunners` into the team's own sets, and the `MakeRun` candidate
 *  exists at all ONLY for an already-licensed body — the licence therefore describes what put
 *  him in motion whatever score won, so it is read FIRST, off the engine's ledger. Only then
 *  is the action the body actually CHOSE read; and inside the shape-keeping action the SPOT
 *  itself is asked before his path to it, because a spot in the lane needs no movement story. */
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

/** ⭐⭐ THE PAIR CLASSES, in the FROZEN PRECEDENCE P2 > P3 > P1 > P4 > P5 — the SAME reading
 *  order as the occupant classes (the engine's own ledger first, then the chosen action, then
 *  the table's geometry). ⭐ The five are DISJOINT BY CONSTRUCTION (P1/P4 require BOTH bodies
 *  undesignated and shape-keeping, and differ only in the spot distance; P3 requires nobody
 *  designated and at least one supporter, which no shape-keeping pair can be), so the
 *  precedence does no work — `gWalkFixtures` proves that on constructed pairs. */
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

/** ⭐⭐ THE PRESENT / ARRIVED SPLIT — BN-C0's corridor split, MIRRORED for the occupant.
 *  Every occupant is inside the corridor AT RELEASE by definition; PRESENT = also inside the
 *  ARM-tick corridor (the record's own aim, from the passer's ARM-tick position); ARRIVED =
 *  outside at arm. A pass with NO wind-up record has no arm tick at all: `noWindup`. */
const PRESENCE = ['present', 'arrived', 'noWindup'] as const;
type Presence = (typeof PRESENCE)[number];
const PRI = (p: Presence): number => PRESENCE.indexOf(p);
const presenceOf = (hasArm: boolean, inLaneAtArm: boolean): Presence =>
  (!hasArm ? 'noWindup' : inLaneAtArm ? 'present' : 'arrived');

/** ⭐⭐ PT-C0's CROWD LIMBS — the A4 battery's own arithmetic, COPIED. */
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
/** ⭐ gReproducePTC0's SECOND, INDEPENDENT implementation of the same two quantities — a
 *  different loop shape over the same sample, compared cell for cell on a scratch seed. */
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
/* PT-C0's population ladder */
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
/* ⭐⭐ THE CORRIDOR TEST — BN-C0's, on constructed geometry */
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
/* ⭐⭐ THE SPOT-IN-LANE TEST is THE SAME MEMBERSHIP TEST, applied to a SPOT */
fx('spotInLane.spotOnTheLineIsInside', inCorridorOf(0, 0, 20, 0, 12, 1, DV_CORRIDOR_SCALE), true);
fx('spotInLane.spotFiveMetresOffIsOutside',
  inCorridorOf(0, 0, 20, 0, 12, 5, DV_CORRIDOR_SCALE), false);
/* ⭐⭐ gLedgerRead — THE DESIGNATION FOLLOWS THE TEAM'S OWN SET, AND NOTHING ELSE */
const setsFx = (runners: number[], arriver: number | null, overlapper: number | null,
  chasers: number[]): DesigSets => ({
  runners: new Set(runners), arriver, overlapper, chasers: new Set(chasers),
});
fx('ledger.noneWhenEverySetIsEmpty', designationOf(2, setsFx([], null, null, [])), 'none');
fx('ledger.runnerWhenTheSetSaysSo', designationOf(2, setsFx([2], null, null, [])), 'runner');
fx('ledger.editingTheSetMovesTheClassIn', designationOf(2, setsFx([2], null, null, [])), 'runner');
fx('ledger.editingTheSetMovesTheClassOut', designationOf(2, setsFx([3], null, null, [])), 'none');
fx('ledger.arriver', designationOf(4, setsFx([], 4, null, [])), 'arriver');
fx('ledger.overlapper', designationOf(5, setsFx([], null, 5, [])), 'overlapper');
fx('ledger.chaser', designationOf(1, setsFx([], null, null, [1])), 'chaser');
fx('ledger.runnerBeatsArriver', designationOf(2, setsFx([2], 2, null, [])), 'runner');
fx('ledger.arriverBeatsOverlapper', designationOf(2, setsFx([], 2, 2, [])), 'arriver');
fx('ledger.overlapperBeatsChaser', designationOf(2, setsFx([], null, 2, [2])), 'overlapper');
fx('ledger.chaserIsNotDesignatedForL1', isDesignated('chaser'), false);
fx('ledger.runnerIsDesignated', isDesignated('runner'), true);
fx('ledger.arriverIsDesignated', isDesignated('arriver'), true);
fx('ledger.overlapperIsDesignated', isDesignated('overlapper'), true);
fx('ledger.noneIsNotDesignated', isDesignated('none'), false);
/* ⭐⭐ THE OCCUPANT CAUSE PRECEDENCE on constructed occupants */
const CU = (d: Designation, a: string, s: boolean): CauseInput =>
  ({ designation: d, action: a, spotInLane: s });
fx('cause.L1.runnerWhateverHisAction', causeOf(CU('runner', 'MakeRun', false)), 'L1');
fx('cause.L1.runnerEvenWhileSupporting', causeOf(CU('runner', 'SupportBallCarrier', false)), 'L1');
fx('cause.L1.runnerEvenWhileShapeKeeping',
  causeOf(CU('runner', 'MoveToFormationSpot', true)), 'L1');
fx('cause.L1.arriver', causeOf(CU('arriver', 'MakeRun', false)), 'L1');
fx('cause.L1.overlapper', causeOf(CU('overlapper', 'MakeRun', false)), 'L1');
fx('cause.L2.undesignatedSupport', causeOf(CU('none', 'SupportBallCarrier', false)), 'L2');
fx('cause.L2.chaserSupportIsStillL2', causeOf(CU('chaser', 'SupportBallCarrier', false)), 'L2');
fx('cause.L3a.spotInLane', causeOf(CU('none', 'MoveToFormationSpot', true)), 'L3a');
fx('cause.L3b.spotOutside', causeOf(CU('none', 'MoveToFormationSpot', false)), 'L3b');
fx('cause.L4.chaseBall', causeOf(CU('none', 'ChaseBall', false)), 'L4');
fx('cause.L4.receivePass', causeOf(CU('none', 'ReceivePass', true)), 'L4');
fx('cause.L4.interceptPass', causeOf(CU('none', 'InterceptPass', false)), 'L4');
fx('cause.L4.markOpponent', causeOf(CU('none', 'MarkOpponent', false)), 'L4');
fx('cause.L4.dribble', causeOf(CU('none', 'Dribble', false)), 'L4');
fx('cause.L4.makeRunWithoutALicenceIsOther', causeOf(CU('none', 'MakeRun', false)), 'L4');
/* ⭐⭐ THE PAIR CLASSES on constructed pairs */
const PU = (dA: Designation, dB: Designation, aA: string, aB: string,
  w: boolean): PairInput => ({ dA, dB, aA, aB, spotsWithin: w });
fx('pair.P1.bothShapeSpotsWithin',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)), 'P1');
fx('pair.P4.bothShapeSpotsApart',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', false)), 'P4');
fx('pair.P2.oneDesignated',
  pairClassOf(PU('runner', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)), 'P2');
fx('pair.P2.designationBeatsEverything',
  pairClassOf(PU('none', 'arriver', 'SupportBallCarrier', 'SupportBallCarrier', true)), 'P2');
fx('pair.P3.oneSupporterNoneDesignated',
  pairClassOf(PU('none', 'none', 'SupportBallCarrier', 'ChaseBall', false)), 'P3');
fx('pair.P3.bothSupporters',
  pairClassOf(PU('chaser', 'none', 'SupportBallCarrier', 'SupportBallCarrier', true)), 'P3');
fx('pair.P5.other', pairClassOf(PU('none', 'none', 'ChaseBall', 'MarkOpponent', true)), 'P5');
fx('pair.P5.mixedShapeAndOther',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'ChaseBall', true)), 'P5');
/* ⭐ the five pair classes are DISJOINT BY CONSTRUCTION — the precedence does no work */
fx('pair.disjoint.P1CannotAlsoBeP3',
  pairClassOf(PU('none', 'none', 'MoveToFormationSpot', 'MoveToFormationSpot', true)) === 'P1'
  && !['SupportBallCarrier'].includes('MoveToFormationSpot'), true);
/* ⭐⭐ THE PRESENT / ARRIVED SPLIT */
fx('presence.present', presenceOf(true, true), 'present');
fx('presence.arrived', presenceOf(true, false), 'arrived');
fx('presence.noWindup', presenceOf(false, false), 'noWindup');
fx('presence.noWindupBeatsInLane', presenceOf(false, true), 'noWindup');
/* ⭐⭐ PT-C0's CROWD LIMBS */
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.symmetric',
  near(nearestMateOf([0, 3], [0, 4], 0), nearestMateOf([0, 3], [0, 4], 1)), true);
fx('spacing.singletonIsInfinite', !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.countsEachPairOnce', dupRunPairsOf([0, 1, 2], [0, 0, 0]), 3);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('minPairwise.singleton', !Number.isFinite(minPairwiseOf([1], [1])), true);
fx('crowd.altAgreesOnPairs', dupRunPairsAltOf([0, 1, 2, 9], [0, 0, 0, 0]),
  dupRunPairsOf([0, 1, 2, 9], [0, 0, 0, 0]));
fx('crowd.altAgreesOnCrash', crashAltOf([0, 1, 9], [0, 0, 0]),
  minPairwiseOf([0, 1, 9], [0, 0, 0]) < DUP_RUN_M);
fx('crowd.altAgreesOnNoCrash', crashAltOf([0, 9], [0, 0]),
  minPairwiseOf([0, 9], [0, 0]) < DUP_RUN_M);
/* the bin helpers */
fx('binOf.first', binOf(0.4, 2, 13), 0);
fx('binOf.overflow', binOf(999, 2, 13), 12);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 13), 6);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 13), 0);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
/* the action vocabulary is the union's own */
fx('actions.vocabularyIsTheUnions', ACTIONS.length, 23);
fx('actions.firstIsTheDefault', ACTIONS[0], 'MoveToFormationSpot');
fx('actions.unknownCellIsLast', AI('NotAnAction'), ACTIONS.length);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed).
   ⚠ Every width/count below is a STORED BIN EDGE of a histogram — never a rule and never a
   threshold: no read word and no majority boolean depends on one.                            */
/* ========================================================================== */
const NEAR_BIN_M = 0.5; const NEAR_BINS = 61;        // PT-C0's own nearest-mate grid
const MINPAIR_BIN_M = 0.5; const MINPAIR_BINS = 61;  // PT-C0's own min-pairwise grid
const OCC_BINS = 7;                                   // own occupants per pass, last = overflow
const DCARR_BIN_M = 2; const DCARR_BINS = 16;         // occupant → carrier
const DCENT_BIN_M = 0.5; const DCENT_BINS = 12;       // occupant → corridor centre line
const DTGT_BIN_M = 5; const DTGT_BINS = 13;           // occupant → target
const VACROSS_BIN_MS = 1; const VACROSS_BINS = 13;    // signed, across the lane
const VALONG_BIN_MS = 1; const VALONG_BINS = 13;      // signed, along the lane
const PAIRMID_BIN_M = 2; const PAIRMID_BINS = 16;     // carrier → pair midpoint
const FLIGHT_RETIRE_TICKS = 720;                      // PT-C0's own retire cap, inherited

/* ========================================================================== */
/* §8 THE PER-SEED ROW                                                         */
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
});

/* ========================================================================== */
/* §9 THE WALK — public state per tick; NO WRAPPER                             */
/* ========================================================================== */
interface ArmBody { inWide: boolean; inTight: boolean; desig: Designation; action: string }
interface Windup {
  key: string; gid: number; targetGid: number; eX: number; eY: number; carried: boolean;
  armTick: number; bodies: Map<number, ArmBody>;
}
interface Occ {
  gid: number; desig: Designation; action: string; spotInLane: boolean;
  supportSpotInLane: boolean; presence: Presence; cause: Cause;
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
          f.occupants.push({
            gid: q.gid, desig, action, spotInLane, supportSpotInLane, presence,
            cause: causeOf({ designation: desig, action, spotInLane }),
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
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.shots = st[0].shots + st[1].shots;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT             */
/* ========================================================================== */
const runOut = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };
banner('LN-C0 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm × scratch-seed walks)`);

/* ========================================================================== */
/* §11 THE WORLD PIN — a constructed match of EACH arm at scratch 900,003,470   */
/* ========================================================================== */
const worldPin = ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as {
    bqCushion?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
  };
  return {
    seed: WORLD_PIN_SEED, arm: armK, bqArmedVersion: bqArmedVersion(m),
    bqCushion: mm.bqCushion === true,
    obmMovementAbsent: mm.obmMovement !== true,
    ctbSupportPlaneAbsent: mm.ctbSupportPlane !== true,
    rcBfAbsent: mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
    emergentPosOn: emergentPosOn(),
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.bqArmedVersion === BQ_WORLD_VERSION && w.bqCushion
  && w.obmMovementAbsent && w.ctbSupportPlaneAbsent && w.rcBfAbsent);

/* ========================================================================== */
/* §12 THE BATTERY — the two arms PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`LN-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `walked ×${ARMS.length} arms (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const armK of ARMS) receiptRows[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
const walksBooked = (cells.length + 1) * ARMS.length;

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

/* ---- POPULATION A: THE LANE ---- */
defFace('lane.occupantsPerPass', 'own occupants per measured ground pass',
  '⭐⭐ the MEAN number of own OUTFIELD bodies (neither passer nor target) inside the WIDE '
  + 'corridor at the release tick, per measured ground pass',
  'measured ground passes', (r) => r.occN, (r) => r.gpFlights);
defFace('lane.tight.occupantsPerPass', 'own occupants per measured ground pass',
  'the same count at the TIGHT (CONTROL_RADIUS) half-width — a robustness BIN, never a second '
  + 'definition', 'measured ground passes', (r) => r.occNTight, (r) => r.gpFlights);
defFace('lane.passesWithOccupantShare', 'share',
  '⭐⭐ the share of measured ground passes with AT LEAST ONE own lane occupant at release',
  'measured ground passes', (r) => r.passesWithOcc, (r) => r.gpFlights);
defFace('lane.tight.passesWithOccupantShare', 'share',
  'the same share at the TIGHT half-width (bin)', 'measured ground passes',
  (r) => r.passesWithOccTight, (r) => r.gpFlights);
defFace('lane.armRecordShare', 'share',
  'the share of measured ground passes whose strike resolved a TRACKED wind-up record (an ARM '
  + 'tick exists)', 'measured ground passes', (r) => r.gpWithArm, (r) => r.gpFlights);
defFace('lane.noWindupShare', 'share',
  'the share with NO wind-up record (a restart or a first-time strike) — release-only reads',
  'measured ground passes', (r) => r.gpNoArm, (r) => r.gpFlights);
defFace('lane.passesWithLiveDesignationShare', 'share',
  'the share of measured ground passes struck while AT LEAST ONE designation (runner / arriver '
  + '/ overlapper) was live on the passing side', 'measured ground passes',
  (r) => r.passesWithLiveDesignation, (r) => r.gpFlights);
for (const c of CAUSES) {
  defFace(`composition.${c}`, 'share',
    `⭐⭐ THE OCCUPANT COMPOSITION — the ${c} share of own lane occupants (FROZEN precedence `
    + 'L1 > L2 > L3a > L3b > L4)', 'own lane occupants at release',
    (r) => r.causeN[LCI(c)], (r) => sum(r.causeN));
  for (const p of PRESENCE) {
    defFace(`presence.${c}.${p}`, 'share',
      `PRESENT vs ARRIVED for ${c}: ${p}`, `${c} occupants`,
      (r) => r.causePresence[LCI(c)][PRI(p)], (r) => r.causeN[LCI(c)]);
  }
  defFace(`carom.${c}`, 'share',
    `⭐⭐ P(first body = THIS occupant | ${c}) — the visible carom by cause`,
    `${c} occupants`, (r) => r.caromHits[LCI(c)], (r) => r.causeN[LCI(c)]);
  defFace(`spot.inLane.${c}`, 'share',
    `the share of ${c} occupants whose own FORMATION SPOT lies inside the release corridor`,
    `${c} occupants`, (r) => r.causeSpotInLane[LCI(c)], (r) => r.causeN[LCI(c)]);
}
for (const p of PRESENCE) {
  defFace(`presence.all.${p}`, 'share', `PRESENT vs ARRIVED, all own occupants: ${p}`,
    'own lane occupants', (r) => sum(r.causePresence.map((x) => x[PRI(p)])),
    (r) => sum(r.causeN));
}
defFace('carom.all', 'share',
  'P(first body = THIS occupant) over ALL own lane occupants', 'own lane occupants',
  (r) => sum(r.caromHits), (r) => sum(r.causeN));
for (const c of CONTACTS) {
  defFace(`firstBody.${c}`, 'share',
    `⭐ PT-C0 / BN-C0's FIRST-BODY class ${c}, REPRODUCED on world 13 (the ownNonTarget cell is `
    + 'BN-C0\'s own-non-target first-contact share)', 'measured ground passes',
    (r) => r.firstBody[CTI(c)], (r) => r.gpFlights);
}
defFace('spot.inLaneShareAllBodies', 'share',
  '⭐⭐ THE TABLE\'S OWN GEOMETRY: the share of ALL eligible own outfield bodies (neither passer '
  + 'nor target, at every measured release with a launch line) whose CALLED formation spot lies '
  + 'inside the release corridor', 'eligible own outfield bodies at release',
  (r) => r.spotInLaneAll, (r) => r.eligibleBodies);
defFace('spot.supportSpotInLaneShareAllBodies', 'share',
  'the same for the CALLED support spot (`supportSpot`, ctbPlane = false)',
  'eligible own outfield bodies at release',
  (r) => r.supportSpotInLaneAll, (r) => r.eligibleBodies);
defFace('spot.occupantSpotInLaneShare', 'share',
  'the share of own lane OCCUPANTS whose formation spot is itself inside the corridor',
  'own lane occupants', (r) => sum(r.causeSpotInLane), (r) => sum(r.causeN));
defFace('spot.occupantSupportSpotInLaneShare', 'share',
  'the share of own lane occupants whose SUPPORT spot is inside the corridor',
  'own lane occupants', (r) => sum(r.causeSupportSpotInLane), (r) => sum(r.causeN));
for (const dg of DESIGNATIONS) {
  defFace(`occupantDesignation.${dg}`, 'share',
    `the designation cell ${dg}, READ off the team's own sets, over own lane occupants`,
    'own lane occupants', (r) => r.occDesig[DGI(dg)], (r) => sum(r.occDesig));
}
/* ---- THE OPPONENTS IN THE LANE (published BESIDE, never read) ---- */
defFace('opponent.inLanePerPass', 'opponent occupants per measured ground pass',
  'opponents inside the WIDE corridor at release, per measured ground pass',
  'measured ground passes', (r) => r.oppN, (r) => r.gpFlights);
defFace('opponent.passesWithInLaneShare', 'share',
  'the share of measured ground passes with at least one opponent in the corridor at release',
  'measured ground passes', (r) => r.passesWithOpp, (r) => r.gpFlights);
defFace('opponent.tight.passesWithInLaneShare', 'share',
  'the same at the TIGHT half-width (bin)', 'measured ground passes',
  (r) => r.passesWithOppTight, (r) => r.gpFlights);
for (const p of PRESENCE) {
  defFace(`opponent.presence.${p}`, 'share', `opponents in the lane: ${p}`,
    'opponent lane occupants', (r) => r.oppPresence[PRI(p)], (r) => r.oppN);
  defFace(`opponent.tight.presence.${p}`, 'share',
    `opponents in the TIGHT lane: ${p} (bin)`, 'tight opponent lane occupants',
    (r) => r.oppPresenceTight[PRI(p)], (r) => r.oppNTight);
}
/* ---- POPULATION B: THE CROWD (PT-C0's limbs, reproduced on world 13) ---- */
defFace('crowd.crashShare', 'share',
  '⭐⭐ PT-C0\'s 撞车 FACE, REPRODUCED on world 13: the share of sampled attacking ticks whose '
  + 'MINIMUM PAIRWISE outfield distance is below DUP_RUN_M = 4 m',
  'sampled ticks with an attributable possession side', (r) => r.crashHits, (r) => r.crowdSamples);
defFace('crowd.dupRunPairsPerSample', 'pairs per sampled tick',
  '⭐ PT-C0\'s DUP-RUN limb: attacking outfield PAIRS closer than DUP_RUN_M = 4 m, per sample',
  'sampled ticks with an attributable possession side', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres',
  '⭐ PT-C0\'s SPACING limb: the mean nearest same-side outfielder distance',
  '(sampled tick, outfielder) pairs', (r) => r.spacingSum, (r) => r.spacingSamples);
defFace('crowd.unattributedSampleShare', 'share',
  'sampled open-play ticks with NO attributable possession side (excluded from every crowd face)',
  'sampled open-play ticks', (r) => r.crowdUnattributed, (r) => r.crowdSampleTicks);
defFace('crowd.samplesPerMatch', 'attributable samples per match',
  'attributable crowd samples per 240 s match', 'matches', (r) => r.crowdSamples, ONE);
defFace('crowd.pairsPerSample', 'classed pairs per sampled tick',
  'dup-run pairs entering the pair composition, per attributable sample',
  'attributable samples', (r) => r.pairsTotal, (r) => r.crowdSamples);
for (const p of PAIRS) {
  defFace(`pair.${p}`, 'share',
    `⭐⭐ THE PAIR COMPOSITION — the ${p} share of dup-run pairs (FROZEN precedence `
    + 'P2 > P3 > P1 > P4 > P5; the classes are disjoint by construction)',
    'dup-run pairs', (r) => r.pairN[PCI(p)], (r) => r.pairsTotal);
}
defFace('pair.spotsWithinShare', 'share',
  '⭐ the share of dup-run pairs whose two CALLED formation spots are themselves within '
  + 'DUP_RUN_M = 4 m', 'dup-run pairs', (r) => r.pairSpotsWithin, (r) => r.pairsTotal);
defFace('pair.eitherSupportShare', 'share',
  'dup-run pairs with at least one `SupportBallCarrier`', 'dup-run pairs',
  (r) => r.pairEitherSupport, (r) => r.pairsTotal);
defFace('pair.eitherRunnerShare', 'share',
  'dup-run pairs with at least one body in `team.runners`', 'dup-run pairs',
  (r) => r.pairEitherRunner, (r) => r.pairsTotal);
defFace('pair.noCarrierShare', 'share',
  'dup-run pairs sampled while NO body owned the ball (they enter no carrier-distance bin)',
  'dup-run pairs', (r) => r.pairNoCarrier, (r) => r.pairsTotal);
/* ---- THE DESIGNATION LEDGER ---- */
defFace('designation.runnersPerSampledTick', 'runners per sampled tick',
  'the mean size of `team.runners` on the attacking side, per attributable sample',
  'attributable samples', (r) => r.runnersSampleSum, (r) => r.crowdSamples);
defFace('designation.chasersPerSampledTick', 'chasers per sampled tick',
  'the mean size of `team.chasers` on the attacking side, per attributable sample',
  'attributable samples', (r) => r.chasersSampleSum, (r) => r.crowdSamples);
defFace('designation.arriverLiveShare', 'share',
  'the share of attributable samples with `team.arriver !== null` on the attacking side',
  'attributable samples', (r) => r.arriverLiveSamples, (r) => r.crowdSamples);
defFace('designation.overlapperLiveShare', 'share',
  'the share of attributable samples with `team.overlapper !== null`', 'attributable samples',
  (r) => r.overlapperLiveSamples, (r) => r.crowdSamples);
defFace('designation.runnersDistinctBodiesPerMatch', 'distinct bodies per match',
  'DISTINCT bodies licensed into `team.runners` at any tick of the match (both sides pooled)',
  'matches', (r) => r.runnersDistinct, ONE);
defFace('designation.arriverDistinctBodiesPerMatch', 'distinct bodies per match',
  'DISTINCT bodies licensed as `team.arriver` at any tick (both sides pooled)', 'matches',
  (r) => r.arriverDistinct, ONE);
defFace('designation.overlapperDistinctBodiesPerMatch', 'distinct bodies per match',
  'DISTINCT bodies licensed as `team.overlapper` at any tick (both sides pooled)', 'matches',
  (r) => r.overlapperDistinct, ONE);
defFace('designation.chasersDistinctBodiesPerMatch', 'distinct bodies per match',
  'DISTINCT bodies licensed into `team.chasers` at any tick (both sides pooled)', 'matches',
  (r) => r.chasersDistinct, ONE);
/* ---- CONTEXT AND RECEIPTS ---- */
defFace('context.groundPassesPerMatch', 'measured ground passes per match',
  'PT-C0\'s own volume face on the 240 s match clock', 'matches', (r) => r.gpFlights, ONE);
defFace('context.ownedBallSampleShare', 'share',
  'THE POSSESSION FACE OF THIS CENSUS: the share of sampled open-play ticks on which a body '
  + 'OWNS the ball', 'sampled open-play ticks', (r) => r.ownedSamples, (r) => r.crowdSampleTicks);
defFace('context.passCompletion', 'share', 'ALL deliveries, the engine\'s own stats',
  'engine passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('context.goalsPerMatch', 'goals per match', 'both sides, 240 s clock', 'matches',
  (r) => r.goals, ONE);
defFace('context.interceptionsPerMatch', 'interceptions per match', 'both sides', 'matches',
  (r) => r.interceptions, ONE);
defFace('context.shotsPerMatch', 'shots per match', 'both sides', 'matches', (r) => r.shots, ONE);
defFace('receipt.hasBallRecipeAgreesShare', 'share',
  '⚠ A RECEIPT, NEVER A FOOTBALL EFFECT SIZE: the share of measured releases at which the '
  + 'PRODUCTION `hasBall` recipe (`match.possessionSide === team.side`) agrees with the '
  + 'census\'s declared `hasBall = true` reconstruction argument', 'measured ground passes',
  (r) => r.hasBallRecipeAgrees, (r) => r.gpFlights);
defFace('receipt.armBodyMissingPerPass', 'missing arm-snapshot bodies per measured pass',
  '⚠ A RECEIPT: occupants absent from their flight\'s ARM snapshot (sent off or a keeper at the '
  + 'arm tick) — they are counted `noWindup`, never imputed', 'measured ground passes',
  (r) => r.armBodyMissing, (r) => r.gpFlights);

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
  if (f === undefined) { banner(`LN-C0 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ (D13 − E13) — the arms share seeds, so the interval is PAIRED. */
interface DeltaRow {
  key: string; face: string; pair: string; armL: Arm; armR: Arm;
  leftValue: number; rightValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
}
const pairedDelta = (faceKey: string, armL: Arm, armR: Arm): DeltaRow => {
  const f = FACES[faceKey];
  const nl = cells.map((c) => f.num(c.rows[armL]));
  const dl = cells.map((c) => f.dn(c.rows[armL]));
  const nr = cells.map((c) => f.num(c.rows[armR]));
  const dr = cells.map((c) => f.dn(c.rows[armR]));
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
    key: `${faceKey}@${armL}-${armR}`, face: faceKey, pair: `${armL}−${armR}`, armL, armR,
    leftValue: pl, rightValue: pr, delta: pl - pr,
    ciLo: lo, ciHi: hi, halfWidth: hw,
    absDeltaOverHalfWidth: ratio(Math.abs(pl - pr), hw),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
  };
};
const deltas: DeltaRow[] = FACE_KEYS.map((k) => pairedDelta(k, 'D13', 'E13'));
const delta = (faceKey: string): DeltaRow => {
  const dd = deltas.find((x) => x.face === faceKey);
  if (dd === undefined) { banner(`LN-C0 FATAL — unknown Δ ${faceKey}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 THE PRE-REGISTERED READS — #388 item 2(v)'s SENTENCES, VERBATIM.
   The SELECTOR is a STORED majority BOOLEAN per class (majority = share > 0.5); if none holds
   a majority, `mixed` is true and the no-majority sentence prints. canon, VERBATIM: "a
   counterfactual verdict sentence ('had X been scored, the rule would read W') quotes a word
   the instrument STORED by applying the frozen rule to X's stored interval; a universal
   sentence about a table ('every bin', 'the one bin') is a stored boolean or is not written". */
/* ========================================================================== */
const LANE_SENTENCES: Record<Cause | 'mixed', string> = {
  L1: 'THE LANE IS THE COACH\'S — step ③ (retire the hand-written designations) is named '
    + 'first, and ② gives it the control arm.',
  L2: 'THE LANE IS THE SUPPORT SEAT\'S — step ② (arm obmMovement + ctbSupportPlane: the '
    + 'percept-driven support choice) is named first.',
  L3a: 'THE LANE IS THE FORMATION TABLE\'S — the spots themselves stand in the passing lane; '
    + 'the table, not a decision, is named.',
  L3b: 'THE LANE IS THE SHAPE-KEEPER\'S PATH — he crosses the lane on his way to his spot; '
    + 'step ② (movement) is named.',
  L4: 'THE LANE IS MIXED — the commander decides with the table.',
  mixed: 'THE LANE IS MIXED — the commander decides with the table.',
};
const CROWD_SENTENCES: Record<PairClass | 'mixed', string> = {
  P1: 'THE CROWD IS THE FORMATION TABLE\'S — two spots within four metres.',
  P2: 'THE CROWD IS THE COACH\'S.',
  P3: 'THE CROWD IS THE SUPPORT SEAT\'S.',
  P4: 'THE CROWD IS MOVEMENT — shape-keepers crossing.',
  P5: 'THE CROWD IS MIXED — the commander decides with the table.',
  mixed: 'THE CROWD IS MIXED — the commander decides with the table.',
};
const AGREE_SENTENCE = {
  laneAgrees: 'THE DOSED WORLD AGREES ON THE LANE MAJORITY',
  laneDisagrees: 'THE DOSED WORLD DISAGREES ON THE LANE MAJORITY',
  crowdAgrees: 'THE DOSED WORLD AGREES ON THE CROWD MAJORITY',
  crowdDisagrees: 'THE DOSED WORLD DISAGREES ON THE CROWD MAJORITY',
};
const laneReadFor = (armK: Arm): Record<string, unknown> => {
  const shares: Record<string, number> = {};
  const majority: Record<string, boolean> = {};
  for (const c of CAUSES) {
    const v = face(`composition.${c}`, armK).value;
    shares[c] = v;
    majority[c] = Number.isFinite(v) && v > 0.5;
  }
  const winners = CAUSES.filter((c) => majority[c]);
  const mixed = winners.length !== 1;
  const majorityClass: Cause | 'mixed' = mixed ? 'mixed' : winners[0];
  return {
    arm: armK, armLabel: ARM_LABEL[armK], shares, majority, mixed, majorityClass,
    /** ⭐ L4 is the OTHER class: an L4 majority names no lever, so the frozen form prints the
     *  no-majority sentence for it — #388 item 2(v)'s own wording ("L4 majority or no
     *  majority ⇒ THE LANE IS MIXED"), stated before any battery seed. */
    sentence: LANE_SENTENCES[majorityClass],
    occupants: face('composition.L1', armK).denominator,
  };
};
const crowdReadFor = (armK: Arm): Record<string, unknown> => {
  const shares: Record<string, number> = {};
  const majority: Record<string, boolean> = {};
  for (const p of PAIRS) {
    const v = face(`pair.${p}`, armK).value;
    shares[p] = v;
    majority[p] = Number.isFinite(v) && v > 0.5;
  }
  const winners = PAIRS.filter((p) => majority[p]);
  const mixed = winners.length !== 1;
  const majorityClass: PairClass | 'mixed' = mixed ? 'mixed' : winners[0];
  return {
    arm: armK, armLabel: ARM_LABEL[armK], shares, majority, mixed, majorityClass,
    sentence: CROWD_SENTENCES[majorityClass],
    pairs: face('pair.P1', armK).denominator,
  };
};
const LANE_READS = { E13: laneReadFor('E13'), D13: laneReadFor('D13') };
const CROWD_READS = { E13: crowdReadFor('E13'), D13: crowdReadFor('D13') };
const LANE_E = (LANE_READS.E13 as { majorityClass: string }).majorityClass;
const LANE_D = (LANE_READS.D13 as { majorityClass: string }).majorityClass;
const CROWD_E = (CROWD_READS.E13 as { majorityClass: string }).majorityClass;
const CROWD_D = (CROWD_READS.D13 as { majorityClass: string }).majorityClass;
const LANE_AGREES = LANE_E === LANE_D;
const CROWD_AGREES = CROWD_E === CROWD_D;
const LANE_AGREE_WORD = LANE_AGREES ? AGREE_SENTENCE.laneAgrees : AGREE_SENTENCE.laneDisagrees;
const CROWD_AGREE_WORD = CROWD_AGREES ? AGREE_SENTENCE.crowdAgrees
  : AGREE_SENTENCE.crowdDisagrees;
/** ⭐ THE READS OF RECORD are selected on the E13 arm's stored booleans; D13's beside. */
const LANE_READ_OF_RECORD = (LANE_READS.E13 as { sentence: string }).sentence;
const CROWD_READ_OF_RECORD = (CROWD_READS.E13 as { sentence: string }).sentence;
const READ_LIST = [LANE_READ_OF_RECORD, CROWD_READ_OF_RECORD, LANE_AGREE_WORD,
  CROWD_AGREE_WORD];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form                                      */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised half-widths (seeds
 *  900,003,400–411), read out of the smoke artifact's own `faces[].halfWidth` fields on the
 *  E13 arm — never re-typed from the console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'composition.L1@E13', group: '⭐⭐ THE OCCUPANT COMPOSITION — L1 DESIGNATED share, arm E13',
    hwSmoke: 0.050630517023959654, target: 0.05 },
  { face: 'composition.L2@E13', group: '⭐⭐ THE OCCUPANT COMPOSITION — L2 SUPPORT share, arm E13',
    hwSmoke: 0.04984116551648593, target: 0.05 },
  { face: 'composition.L3a@E13', group: '⭐⭐ THE OCCUPANT COMPOSITION — L3a SHAPE/SPOT-IN-LANE share, arm E13',
    hwSmoke: 0.05124117136838627, target: 0.05 },
  { face: 'composition.L3b@E13', group: '⭐⭐ THE OCCUPANT COMPOSITION — L3b SHAPE/PATH-ACROSS share, arm E13',
    hwSmoke: 0.018855882121188244, target: 0.05 },
  { face: 'composition.L4@E13', group: '⭐ THE OCCUPANT COMPOSITION — L4 OTHER share, arm E13',
    hwSmoke: 0.01779529522595661, target: 0.05 },
  { face: 'pair.P1@E13', group: '⭐⭐ THE PAIR COMPOSITION — P1 TABLE share, arm E13 (⚠ EMPTY in the smoke)',
    hwSmoke: 0, target: 0.05 },
  { face: 'pair.P2@E13', group: '⭐⭐ THE PAIR COMPOSITION — P2 DESIGNATED share, arm E13',
    hwSmoke: 0.06808052834571476, target: 0.05 },
  { face: 'pair.P3@E13', group: '⭐⭐ THE PAIR COMPOSITION — P3 SUPPORT share, arm E13',
    hwSmoke: 0.0737102451872949, target: 0.05 },
  { face: 'pair.P4@E13', group: '⭐ THE PAIR COMPOSITION — P4 SHAPE-PATHS share, arm E13',
    hwSmoke: 0.011595668837312653, target: 0.05 },
  { face: 'pair.P5@E13', group: '⭐ THE PAIR COMPOSITION — P5 OTHER share, arm E13',
    hwSmoke: 0.011717005608504277, target: 0.05 },
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
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
type Pooled = {
  occPerPassBins: number[]; causeN: number[]; causePresence: number[][]; caromHits: number[];
  causeSpotInLane: number[]; causeSupportSpotInLane: number[];
  occDesig: number[]; occAction: number[]; l4Action: number[];
  distCarrierBins: number[]; distCentreBins: number[]; distTargetBins: number[];
  vAcrossBins: number[]; vAlongBins: number[]; firstBody: number[];
  oppPresence: number[]; oppPresenceTight: number[];
  nearBins: number[]; minPairBins: number[]; pairN: number[]; pairCarrierDistBins: number[];
};
const emptyPooled = (): Pooled => ({
  occPerPassBins: zeros(OCC_BINS), causeN: zeros(CAUSES.length),
  causePresence: zeros2(CAUSES.length, PRESENCE.length), caromHits: zeros(CAUSES.length),
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
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED];
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const LEDGER_FX_OK = FIXTURES.filter((f) => f.name.startsWith('ledger.')).every((f) => f.ok);
const REPRO_OK = ARMS.every((armK) => allRows(armK).every(
  (r) => r.crashHits === r.crashHitsAlt && r.dupRunSum === r.dupRunSumAlt,
));

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.cushionOk
      && r.seamsAbsent && r.rcBfAbsent && r.genomeClean && r.ctbPlaneShut && r.emergentOn))
      && WORLD_PIN_OK && EMERGENT_POS_ON,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\` (which itself asserts world 12's five `
      + 'doors, world 11\'s corridor price and the RA gene PINS on both effective genomes — '
      + 'the gene set as world 13 pins it); `bqCushion` TRUE; the two step-② seams ABSENT '
      + '(`obmMovement` and `ctbSupportPlane` both !== true — this is the census of the lane '
      + 'AS IT STANDS); every RC/BF flag ABSENT (`rcAnticipate`, `rcReady`, `bfFacingCost`); '
      + '`info.genome` clean of the RA / corridor / RC / CTB / OBM genes (canon: dose '
      + 'placement, #270.2 / #334 item 1); and `emergentPosOn()` TRUE, so `formationSpot` '
      + `takes the ${FORMATION_SPOT_PATH}. Pinned again on a CONSTRUCTED match of each arm at `
      + `scratch seed ${WORLD_PIN_SEED}. The composer is CALLED, never copied`,
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The D13 arm takes its doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`, CALLED); this gate hashes the FILE BYTES this process '
      + `read from ${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them to the values PINNED `
      + `in #388 item 2(i) — a mismatch is \`process.exit(3)\` BEFORE any seed is walked. `
      + `⚠ \`pcDoseGuard.bytesChecked\` is ${pcDoseGuard.bytesChecked} under bare node (the `
      + 'loader says so itself), which is exactly why this gate hashes the bytes independently',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites: THE FOUR `
      + 'DESIGNATION SETS as `Team.ts` DECLARES them (`chasers` · `runners` · `arriver` · '
      + '`overlapper`) and `assignRunners`, their ONE writer, with `RUN_ROLE_W`, the count '
      + 'rule, the scoring line, the arriver\'s arc trigger, 套边\'s width×overlapW gate and '
      + 'the possession-side early return · the DECISION SURFACE (`MakeRun`\'s licensing line, '
      + 'the arriver and overlapper licence reads, the `SupportBallCarrier` push site and '
      + '`W.supportBase`, the `MoveToFormationSpot` push site and `W.formationBase`, the '
      + 'stored top-4 `scores`) · `formationSpot`\'s and `supportSpot`\'s SIGNATURES, the '
      + '`emergentPosOn()` TOGGLE at formationSpot\'s head, its DEFAULT-ON line and its only '
      + 'env door (REFUSED at §1) · the executor\'s PRODUCTION argument recipe for both '
      + 'functions (`hasBall`, `abandonRest`, `pmMover`) · THE CORRIDOR (`DV_CORRIDOR_SCALE` '
      + '= 4, `DV_CLEAR_RADIUS` = 1.5, laneOpenness\'s own two lines, `closestPointOnSegment`, '
      + '`CONTROL_RADIUS`, and BN-C0\'s own `inCorridorOf` — the code this census COPIES) · '
      + 'PT-C0\'s CROWD limbs and the A4 battery\'s own `DUP_RUN_M` = 4 and `SAMPLE_EVERY` = 10 '
      + 'AT THEIR OWN LINES · PT-C0\'s population, ground-launch and first-body ladders and '
      + 'RA-T1B\'s ancestor line · THE WIND-UP RECORD\'s fields (`gid` / `readyTick` / `aim` / '
      + '`targetGid` / `aimLead`), `pendingPass` and `possessionSide` · world 13\'s own '
      + 'composition (the cushion door, `armBqWorld` calling world 12\'s arming, '
      + '`bqArmedVersion`, and the BQ branch that returns before the tables refusal). The '
      + `ACTION vocabulary (${ACTIONS.length}) is READ OFF \`ActionType\`'s OWN union`,
  },
  gLedgerRead: {
    ok: LEDGER_FX_OK
      && ARMS.every((armK) => tot(armK, (r) => r.occDesig[DGI('runner')]) > 0
        && tot(armK, (r) => r.occDesig[DGI('none')]) > 0),
    note: '⭐⭐ canon, VERBATIM: "an event attribution reads the engine\'s own record when one '
      + 'exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only '
      + 'where no record exists, and says so". EVERY designation cell in this census is READ '
      + 'off `team.runners` / `team.arriver` / `team.overlapper` / `team.chasers` at the tick — '
      + 'never inferred from movement. `designationOf` is a PURE function of those four sets, '
      + 'and the fixtures show the class FOLLOWING an EDITED set (index 2 in `runners` reads '
      + '`runner`; the same index with the set holding 3 instead reads `none`), with the '
      + 'precedence runner > arriver > overlapper > chaser > none pinned branch by branch. '
      + 'LIVENESS beside: both arms carry occupants read as `runner` (E13 '
      + `${tot('E13', (r) => r.occDesig[DGI('runner')])}, D13 `
      + `${tot('D13', (r) => r.occDesig[DGI('runner')])}) and as \`none\``,
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — PT-C0\'s population and first-body ladders, THE CORRIDOR TEST on '
      + 'constructed geometry (both half-widths, the clear-the-kicker guard on BOTH sides of '
      + 'its own radius, the beyond-the-aim clamp), THE SPOT-IN-LANE test (the SAME membership '
      + 'function applied to a spot), THE DESIGNATION READ, THE OCCUPANT CAUSE PRECEDENCE '
      + '(every L1–L4 branch), THE PAIR CLASSES on constructed pairs (every P1–P5 branch and '
      + 'the disjointness), THE PRESENT/ARRIVED split, PT-C0\'s three CROWD limbs and their '
      + 'second implementations, and every bin helper are PURE functions called by BOTH the '
      + 'walk and this table',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.gpFlights) > 0
      && tot(armK, (r) => sum(r.causeN)) > 0
      && tot(armK, (r) => r.causeN[LCI('L1')]) > 0
      && tot(armK, (r) => r.pairsTotal) > 0
      && tot(armK, (r) => r.crashHits) > 0
      && tot(armK, (r) => r.oppN) > 0),
    note: '⛔ no face is computed on an empty class: EVERY arm has measured ground passes (E13 '
      + `${tot('E13', (r) => r.gpFlights)}, D13 ${tot('D13', (r) => r.gpFlights)}), own lane `
      + `occupants (E13 ${tot('E13', (r) => sum(r.causeN))}, D13 `
      + `${tot('D13', (r) => sum(r.causeN))}), DESIGNATED occupants (E13 `
      + `${tot('E13', (r) => r.causeN[LCI('L1')])}, D13 `
      + `${tot('D13', (r) => r.causeN[LCI('L1')])}), dup-run PAIRS (E13 `
      + `${tot('E13', (r) => r.pairsTotal)}, D13 ${tot('D13', (r) => r.pairsTotal)}), 撞车 `
      + `ticks (E13 ${tot('E13', (r) => r.crashHits)}, D13 ${tot('D13', (r) => r.crashHits)}) `
      + `and OPPONENTS in the lane (E13 ${tot('E13', (r) => r.oppN)}, D13 `
      + `${tot('D13', (r) => r.oppN)}). ⚠ LIVENESS only — never a direction, never a magnitude`,
  },
  gReproducePTC0: {
    ok: REPRO_OK,
    note: '⭐⭐ PT-C0\'s CROWD ARITHMETIC REPRODUCES on world 13. PT-C0\'s own three limb lines '
      + 'are ANCHORED in its instrument (the 撞车 line, the dup-run accumulation, the '
      + 'nearest-mate accumulation and the sample cadence), its `nearestMateOf` / '
      + '`dupRunPairsOf` / `minPairwiseOf` are COPIED here byte for byte, and the two '
      + 'quantities the reads and the 撞车 face rest on are recomputed by a SECOND, '
      + 'independently shaped implementation (`dupRunPairsAltOf` / `crashAltOf`) on EVERY '
      + 'sampled tick of EVERY walked match and the receipt: the two agree cell for cell on '
      + `all ${ARMS.length} × ${cells.length + 1} walks. ⚠ What is reproduced is the `
      + 'ARITHMETIC, not PT-C0\'s NUMBERS — PT-C0 walked worlds 12/11/shipped and this census '
      + 'walks world 13, so the values are expected to differ and no equality of values is '
      + 'asserted anywhere',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + 'public `Match` / `Team` state after `m.step(DT)`, and every shipped function it calls '
      + '(`formationSpot`, `supportSpot`, `closestPointOnSegment`) is a PURE query that writes '
      + 'nothing. Proven anyway — the same scratch seed walked OBSERVED and UNOBSERVED yields '
      + `a BYTE-IDENTICAL whole-match signature on all ${lockstepRows.length} arm × `
      + 'out-of-band-scratch-seed walks',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === ''
      && gitOut('git diff --stat HEAD -- tests') === ''
      && gitOut('git status --porcelain -- tests') === '',
    note: 'worktree-vs-HEAD over `src/` AND `tests/`: `git diff --stat HEAD -- <dir>` AND '
      + '`git status --porcelain -- <dir>` all EMPTY (canon: xSrcUntouched) — X-SRC-ZERO',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + 'the construction receipt lie inside block 12,544,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is `
      + 'DECLARED in the `seeds` block, and EVERY scratch seed this instrument walks (the '
      + 'lockstep pair and the world pin) is out-of-band and STORED there — canon, VERBATIM: '
      + '"verifier scratch walks use the stage\'s own consumed band or the out-of-band scratch '
      + 'range (≥ 900,000,000) — never the next virgin block"',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms`,
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon, VERBATIM: "an artifact is written as compact JSON
   — no indentation; the hash is over the canonical body regardless; pretty-printing is a
   reader's tool, not a storage form")                                                       */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'reads', 'medians', 'bins', 'definitions',
  'arms', 'causes', 'pairClasses', 'designations', 'presence', 'contactClasses', 'actions',
  'doseSource', 'worldPin', 'seeds', 'stats', 'anchoredSites', 'fixtures', 'lockstep',
  'perf', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'LN-C0',
    title: '「谁站在传球线上」 THE LANE CENSUS — who is standing in the corridor when a ground '
      + 'pass is struck and what put him there (a designation read off the team\'s own sets · '
      + 'the support seat · his formation spot itself in the lane · his path across it), and '
      + 'the same partition for the dup-run pairs and 撞车 ticks, on world 13 EMPTY-BOOK and '
      + 'DOSED arms paired on shared seeds',
    doc: 'docs/world-model/LN-C0-LANE-CENSUS.md',
    lineage: 'PT-C0 (the population, the `ball.lastTouch` first-body channel and the CROWD '
      + 'limbs, REUSED) → BN-C0 (the CORRIDOR membership test and its present/arrived split, '
      + 'REUSED) → BQ-T1 (every lane face UNMOVED by the cushion ⇒ world 12 is not walked) → '
      + '#388 item 2 (this census)',
    censusFormOfRecord: 'docs/world-model/BN-C0-BOUNCE-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #388 item 2 (step ② of the ratified order, #366 item 1)',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis and ARMS NO MECHANISM: '
      + 'it NAMES a lever, it does not pull one. The READ SENTENCES of #388 item 2(v) are '
      + 'FROZEN LITERALS selected by STORED majority booleans. The commander rules.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. The probe CALLS shipped '
      + 'exports (`formationSpot`, `supportSpot`, `closestPointOnSegment`, `a4MatchFlags`, '
      + '`armA4World`) and reads public `Match` / `Team` state per tick. THERE IS NO WRAPPER — '
      + '`gLockstep` proves observed ≡ unobserved byte for byte PER ARM.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3). WHAT IS READ FROM THE ENGINE: the '
      + 'DESIGNATION (`team.runners` / `team.arriver` / `team.overlapper` / `team.chasers` at '
      + 'the tick), the body\'s own `action.type`, `ball.lastTouch`, `pendingPass`, the pass '
      + 'wind-up record, and every position/velocity. WHAT IS A DECLARED RECONSTRUCTION: the '
      + 'FORMATION SPOT and the SUPPORT SPOT (`formationSpot` / `supportSpot` CALLED at the '
      + 'census\'s instant with the arguments named in `definitions.spotArguments`) and the '
      + 'CORRIDOR itself (the engine ships no boolean corridor width — BN-C0\'s construction '
      + 'from the engine\'s own two constants).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/ln-c0-lane-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/ln-c0-lane-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((armK) => ({
    arm: armK, label: ARM_LABEL[armK],
    composition: armK === 'E13'
      ? 'a4MatchFlags(13) as construction flags + armA4World(m, null, 13) — the EMPTY-BOOK '
        + 'form, world 13\'s own composition CALLED. `null` L3 dose ⇒ the defence books stay '
        + 'as the season left them; `null` PC dose ⇒ the recognition books are born absent.'
      : 'a4MatchFlags(13) + armA4World(m, null, 13, l3Dose, pcDose) via the SHIPPED LOADERS — '
        + 'THE FORM THE USER PLAYS. PT-C0 §P.D traced that the tables argument cannot reach '
        + 'these worlds at all, so the two arms differ ONLY in the two DOSES.',
    gate: `bqArmedVersion(m) === ${BQ_WORLD_VERSION}`,
  })),
  worldTwelveNotWalked: '⛔ WORLD 12 IS NOT WALKED. BQ-T1 §R4 measured every lane face across '
    + 'the cushion door and each interval CONTAINS ZERO: `contact.ownTargetSideBackShare` '
    + '+0.003593 [-0.001268, +0.008158], `crowd.crashShare` -0.001125 [-0.006531, +0.004672] '
    + 'and `bounce.ownNonTargetFirstShare` -0.001005 [-0.004069, +0.002121] on the SCORED pair. '
    + 'World 13 is therefore the base this census walks.',
  causes: {
    vocabulary: CAUSES,
    labels: {
      L1: 'DESIGNATED — a runner / arriver / overlapper at release, whatever his action',
      L2: 'SUPPORT — `SupportBallCarrier`, undesignated',
      L3a: 'SHAPE, SPOT IN LANE — `MoveToFormationSpot`, undesignated, his CALLED formation '
        + 'spot lies inside the release corridor',
      L3b: 'SHAPE, PATH ACROSS — `MoveToFormationSpot`, undesignated, his spot lies outside: '
        + 'he is crossing the lane to reach it',
      L4: 'OTHER — every other action, each NAMED with its count in `bins.l4Action`, none '
        + 'pooled',
    },
    precedence: 'L1 > L2 > L3a > L3b > L4, FROZEN before any battery seed and justified from '
      + 'the decision surface itself: a DESIGNATION is a top-down licence written by '
      + '`assignRunners` into the team\'s own sets, and the `MakeRun` candidate exists at all '
      + 'ONLY for an already-licensed body — the licence therefore describes what put him in '
      + 'motion whatever score won, so it is read FIRST, off the engine\'s ledger. Only then '
      + 'is the action he CHOSE read; and inside the shape-keeping action the SPOT is asked '
      + 'before his path to it, because a spot in the lane needs no movement story.',
  },
  pairClasses: {
    vocabulary: PAIRS,
    labels: {
      P1: 'TABLE — both `MoveToFormationSpot`, undesignated, their two CALLED spots within '
        + 'DUP_RUN_M = 4 m',
      P2: 'DESIGNATED — at least one runner / arriver / overlapper',
      P3: 'SUPPORT — at least one `SupportBallCarrier`, none designated',
      P4: 'SHAPE-PATHS — both `MoveToFormationSpot`, undesignated, spots APART',
      P5: 'OTHER',
    },
    precedence: 'P2 > P3 > P1 > P4 > P5 — the SAME reading order as the occupant classes. ⭐ '
      + 'The five are DISJOINT BY CONSTRUCTION (P1 and P4 require BOTH bodies undesignated and '
      + 'shape-keeping and differ only in the spot distance; P3 requires nobody designated and '
      + 'at least one supporter, which no both-shape-keeping pair can be), so the precedence '
      + 'does no work — `gWalkFixtures` proves that on constructed pairs.',
  },
  designations: {
    vocabulary: DESIGNATIONS,
    read: '⭐⭐ READ OFF THE TEAM\'S OWN SETS at the tick — `team.runners` (a Set of player '
      + 'indices) · `team.arriver` · `team.overlapper` · `team.chasers` — never inferred from '
      + 'movement. Precedence runner > arriver > overlapper > chaser > none. ⛔ Only the first '
      + 'THREE are "designated" for L1 / P2: a chaser is a loose-ball assignment, not an '
      + 'in-possession licence, and he lands in L4 under his own action\'s name.',
  },
  presence: {
    vocabulary: PRESENCE,
    what: '⭐⭐ BN-C0\'s corridor split, MIRRORED. Every occupant is inside the corridor AT '
      + 'RELEASE by definition. PRESENT = also inside the ARM-tick corridor (the wind-up '
      + 'record\'s own aim + `aimLead`, from the passer\'s ARM-tick position); ARRIVED = '
      + 'outside it at the arm tick; `noWindup` = the strike resolved NO tracked wind-up '
      + 'record (a restart or a first-time strike) and there is no arm tick at all — COUNTED, '
      + 'never imputed into either.',
  },
  contactClasses: CONTACTS, actions: ACTION_CELLS,
  definitions: {
    population: '⭐⭐ PT-C0\'s own, BYTE FOR BYTE: every MEASURED GROUND PASS '
      + '(`isMeasurableGroundPass`: shortPass | throughBall | cutback, ground launch, with a '
      + 'pending-pass target), registered at the strike via `pendingPass`; ONE flight tracked '
      + 'at a time, a new release RETIRES the previous one (and the retired flight is BOOKED).',
    laneOccupant: '⭐⭐ an attacking-side OUTFIELD body that is NEITHER the passer NOR the '
      + 'target and is inside the WIDE corridor at the RELEASE tick.',
    theCorridor: '⭐⭐ BN-C0\'s membership test, REUSED: `laneOpenness`\'s own geometry — '
      + '`closestPointOnSegment(launch, E, body)` CALLED — at its OWN scale '
      + '`DV_CORRIDOR_SCALE` = 4 m with its OWN clear-the-kicker guard `DV_CLEAR_RADIUS` = '
      + '1.5 m. ⚠ The engine ships NO boolean corridor WIDTH, so the test is this family\'s '
      + 'construction from the engine\'s own two constants and SAYS SO; the `CONTROL_RADIUS` '
      + 'half-width is published beside as a TIGHT robustness BIN, never a second definition. '
      + 'E = the wind-up record\'s `aim + (aimLead ?? 0)` where the strike resolved a tracked '
      + 'record, else the target\'s own position at the strike tick (PT-C0\'s own rule); '
      + 'LAUNCH = `ball.pos − ball.vel · DT`.',
    spotArguments: '⭐⭐ THE TWO CALLED RECONSTRUCTIONS, with every argument stated. '
      + '`formationSpot(p, team, ball, hasBall = TRUE, opp = the other team, abandonRest = '
      + '`match.abandonRestDesignation === team.side`, pmMover = `match.pmLaneConvergence && '
      + 'match.phase === "playing"`)` — the last two are the PRODUCTION recipe read off the '
      + 'match (anchored at `actionExecutor.ts`), and `hasBall = TRUE` is the census\'s own '
      + 'declared argument for the side IN POSSESSION (#388 item 2(ii)); the receipt '
      + '`receipt.hasBallRecipeAgreesShare` publishes how often the production recipe agrees '
      + 'at the census\'s instant. `supportSpot(p, team, ball, ctbPlane = '
      + '`match.ctbSupportPlane`)` — FALSE in world 13, asserted by `gWorld`. ⚠ Both are '
      + 'evaluated at the CENSUS\'S INSTANT (the release tick, or the sampled tick), which is '
      + 'not necessarily the instant the body last decided.',
    theToggle: `⭐⭐ \`formationSpot\` opens with \`if (emergentPosOn()) return emergentStation(…)\`. `
      + `The toggle DEFAULTS ON, its only env door (\`EMERGENT_POS=0\`) is REFUSED by this `
      + `instrument's §1 envelope, and \`setEmergentPos\` is never called here ⇒ WORLD 13 TAKES `
      + `THE ${FORMATION_SPOT_PATH}. The value is READ from the shipped function and STORED `
      + `per walked match (\`emergentOn\`), and \`gWorld\` asserts it.`,
    theCrowd: '⭐⭐ PT-C0\'s limbs, REPRODUCED on world 13 with the A4 battery\'s own constants: '
      + 'sampled every SAMPLE_EVERY = 10 ticks in open play, on the side with an attributable '
      + 'possession (the owner, else a live tracked ground-pass flight, else EXCLUDED and '
      + 'counted); the population is the A4 filter (`role !== "GK" && !sentOff`); a DUP-RUN '
      + 'PAIR is `b > a` with `hypot < DUP_RUN_M` = 4 m; a 撞车 tick is one whose MINIMUM '
      + 'PAIRWISE outfield distance is below 4 m.',
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold: no read word and no majority boolean depends on one.',
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
      DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS, CONTROL_RADIUS, DUP_RUN_M, SAMPLE_EVERY, DT, GRAVITY,
    },
  },
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    l3NonEmpty: (L3_DOSE ?? []).some((c) => c.lunges > 0),
    pcNonEmpty: (PC_DOSE ?? []).some((r) => r.some((v) => v > 0)),
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK,
    emergentPosOn: EMERGENT_POS_ON, formationSpotPath: FORMATION_SPOT_PATH },
  anchoredSites: ANCHORS, fixtures: FIXTURES, lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,003,400–411), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. N_FROZEN takes #388 item 2(vi)\'s own cap (N ≤ 998) — the largest the block '
      + 'affords after the construction receipt at 12,544,999.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces, deltas,
  reads: {
    note: '⭐⭐ #388 item 2(v)\'s SENTENCES are FROZEN LITERALS. The selector is the STORED '
      + 'majority boolean per class (majority = share > 0.5); if no class holds a majority, '
      + '`mixed` is true and the no-majority sentence prints. The READS OF RECORD are selected '
      + 'on the E13 arm\'s booleans; D13\'s are printed BESIDE at the same precision.',
    laneSentences: LANE_SENTENCES, crowdSentences: CROWD_SENTENCES,
    agreementSentences: AGREE_SENTENCE,
    lane: LANE_READS, crowd: CROWD_READS,
    dosedAgreesOnLaneMajority: LANE_AGREES,
    dosedAgreesOnCrowdMajority: CROWD_AGREES,
    laneAgreementSentencePrinted: LANE_AGREE_WORD,
    crowdAgreementSentencePrinted: CROWD_AGREE_WORD,
    laneReadOfRecord: LANE_READ_OF_RECORD,
    crowdReadOfRecord: CROWD_READ_OF_RECORD,
    readListPrinted: READ_LIST,
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off the '
      + 'SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY published '
      + 'face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
    occupantsPerPass: { width: 1, bins: OCC_BINS, pooled: pooled[armK].occPerPassBins },
    occupantCause: { vocabulary: CAUSES, pooled: pooled[armK].causeN },
    occupantCausePresence: { vocabulary: PRESENCE, groups: CAUSES,
      pooled: pooled[armK].causePresence },
    occupantCauseCarom: { vocabulary: CAUSES, pooled: pooled[armK].caromHits },
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
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'and the two CALLED spot reconstructions included — never the game\'s frame cost.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
    + 'the artifact stores that list verbatim or stores none" (home: '
    + 'RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). THIS '
    + 'ARTIFACT STORES NONE. The list of record is '
    + 'docs/world-model/LN-C0-LANE-CENSUS.md §HONEST LIMITS.',
  perSeedCells, constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: (Record<Arm, Row> & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<Arm, Record<string, { pooled?: unknown }>>;
  medians: { values: Record<Arm, Record<string, unknown>> };
  reads: Record<string, unknown>;
  sizing: { rows: typeof sizingRows };
};
/** ⭐ JSON HAS NO NaN LITERAL: a face computed on an EMPTY class is NaN and `JSON.stringify`
 *  writes it as `null`. The gate recognises `null` as the SERIALIZATION of NaN — and nothing
 *  else: any other value must match BIT FOR BIT. */
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
  const l = disk.perSeedCells.map((c) => c[dd.armL]);
  const r = disk.perSeedCells.map((c) => c[dd.armR]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.leftValue) && sameNum(pr, dd.rightValue) && sameNum(pl - pr, dd.delta),
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
  cmp('occupantCausePresence', got.causePresence);
  cmp('occupantCauseCarom', got.caromHits);
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
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.occupantsPerPassSumsToFlights`,
    ok: sum(got.occPerPassBins) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${armK}.partition.firstBodySumsToFlights`,
    ok: sum(got.firstBody) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${armK}.partition.causeSumsToOccupants`,
    ok: sum(got.causeN) === sum(rows.map((r) => r.occN))
      && sum(got.occDesig) === sum(rows.map((r) => r.occN))
      && sum(got.occAction) === sum(rows.map((r) => r.occN)) });
  binChecks.push({ bin: `${armK}.partition.presenceSumsToItsCause`,
    ok: CAUSES.every((c) => sum(got.causePresence[LCI(c)]) === got.causeN[LCI(c)]) });
  binChecks.push({ bin: `${armK}.partition.l4ActionSumsToL4`,
    ok: sum(got.l4Action) === got.causeN[LCI('L4')] });
  binChecks.push({ bin: `${armK}.partition.caromIsInsideItsCause`,
    ok: CAUSES.every((c) => got.caromHits[LCI(c)] <= got.causeN[LCI(c)]) });
  binChecks.push({ bin: `${armK}.partition.pairClassSumsToPairs`,
    ok: sum(got.pairN) === sum(rows.map((r) => r.pairsTotal)) });
  binChecks.push({ bin: `${armK}.partition.opponentPresenceSumsToOpponents`,
    ok: sum(got.oppPresence) === sum(rows.map((r) => r.oppN)) });
  binChecks.push({ bin: `${armK}.partition.minPairBinsSumToAttributableSamples`,
    ok: sum(got.minPairBins) <= sum(rows.map((r) => r.crowdSamples)) });
  binChecks.push({ bin: `${armK}.partition.crowdArithmeticReproduces`,
    ok: rows.every((r) => r.crashHits === r.crashHitsAlt && r.dupRunSum === r.dupRunSumAlt) });
  binChecks.push({ bin: `${armK}.partition.spotInLaneIsInsideEligibleBodies`,
    ok: sum(rows.map((r) => r.spotInLaneAll)) <= sum(rows.map((r) => r.eligibleBodies))
      && sum(rows.map((r) => r.occN)) <= sum(rows.map((r) => r.eligibleBodies)) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells */
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const lane = (disk.reads.lane as Record<string, unknown>)[armK] as {
    shares: Record<string, number | null>; majority: Record<string, boolean>;
    mixed: boolean; majorityClass: string; sentence: string; occupants: number;
  };
  const lDen = sum(rows.map((r) => sum(r.causeN)));
  const lShares = Object.fromEntries(CAUSES.map(
    (c) => [c, ratio(sum(rows.map((r) => r.causeN[LCI(c)])), lDen)],
  ));
  const lMaj = Object.fromEntries(CAUSES.map(
    (c) => [c, Number.isFinite(lShares[c]) && lShares[c] > 0.5],
  ));
  const lWin = CAUSES.filter((c) => lMaj[c]);
  const lMixed = lWin.length !== 1;
  const lClass = lMixed ? 'mixed' : lWin[0];
  binChecks.push({ bin: `reads.lane.${armK}.sharesRederive`,
    ok: CAUSES.every((c) => sameNum(lShares[c], lane.shares[c])) && lDen === lane.occupants });
  binChecks.push({ bin: `reads.lane.${armK}.majorityBooleansRederive`,
    ok: CAUSES.every((c) => lMaj[c] === lane.majority[c])
      && lMixed === lane.mixed && lClass === lane.majorityClass });
  binChecks.push({ bin: `reads.lane.${armK}.sentenceIsTheFrozenLiteral`,
    ok: LANE_SENTENCES[lClass as Cause | 'mixed'] === lane.sentence
      && (Object.values(LANE_SENTENCES) as string[]).includes(lane.sentence) });
  const crowd = (disk.reads.crowd as Record<string, unknown>)[armK] as {
    shares: Record<string, number | null>; majority: Record<string, boolean>;
    mixed: boolean; majorityClass: string; sentence: string; pairs: number;
  };
  const cDen = sum(rows.map((r) => r.pairsTotal));
  const cShares = Object.fromEntries(PAIRS.map(
    (p) => [p, ratio(sum(rows.map((r) => r.pairN[PCI(p)])), cDen)],
  ));
  const cMaj = Object.fromEntries(PAIRS.map(
    (p) => [p, Number.isFinite(cShares[p]) && cShares[p] > 0.5],
  ));
  const cWin = PAIRS.filter((p) => cMaj[p]);
  const cMixed = cWin.length !== 1;
  const cClass = cMixed ? 'mixed' : cWin[0];
  binChecks.push({ bin: `reads.crowd.${armK}.sharesRederive`,
    ok: PAIRS.every((p) => sameNum(cShares[p], crowd.shares[p])) && cDen === crowd.pairs });
  binChecks.push({ bin: `reads.crowd.${armK}.majorityBooleansRederive`,
    ok: PAIRS.every((p) => cMaj[p] === crowd.majority[p])
      && cMixed === crowd.mixed && cClass === crowd.majorityClass });
  binChecks.push({ bin: `reads.crowd.${armK}.sentenceIsTheFrozenLiteral`,
    ok: CROWD_SENTENCES[cClass as PairClass | 'mixed'] === crowd.sentence
      && (Object.values(CROWD_SENTENCES) as string[]).includes(crowd.sentence) });
}
{
  const lane = disk.reads.lane as Record<string, { majorityClass: string; sentence: string }>;
  const crowd = disk.reads.crowd as Record<string, { majorityClass: string; sentence: string }>;
  const lAgree = lane.E13.majorityClass === lane.D13.majorityClass;
  const cAgree = crowd.E13.majorityClass === crowd.D13.majorityClass;
  binChecks.push({ bin: 'reads.dosedAgreementIsStored',
    ok: lAgree === (disk.reads.dosedAgreesOnLaneMajority as boolean)
      && cAgree === (disk.reads.dosedAgreesOnCrowdMajority as boolean)
      && (disk.reads.laneAgreementSentencePrinted as string)
        === (lAgree ? AGREE_SENTENCE.laneAgrees : AGREE_SENTENCE.laneDisagrees)
      && (disk.reads.crowdAgreementSentencePrinted as string)
        === (cAgree ? AGREE_SENTENCE.crowdAgrees : AGREE_SENTENCE.crowdDisagrees)
      && (disk.reads.laneReadOfRecord as string) === lane.E13.sentence
      && (disk.reads.crowdReadOfRecord as string) === crowd.E13.sentence });
}
/** ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step */
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
    + 'partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk — '
    + 'canon, VERBATIM: "the re-derivation gate covers EVERY published face; a percentile face '
    + 'requires stored bins". The FOUR read sentences, EVERY majority boolean and both dosed '
    + 'agreement words are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: every majority boolean, both `mixed` flags, '
    + 'both majority classes, all four printed sentences and both dosed-agreement words are '
    + 'RE-DERIVED by applying the FROZEN rules to the SERIALIZED per-seed cells off disk, and '
    + 'every printed sentence must be one of the frozen literals. canon, VERBATIM: "a '
    + 'universal sentence about a table (\'every bin\', \'the one bin\') is a stored boolean or '
    + 'is not written"',
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
    + 'construction receipt AND `allGreen` (BQ-T1 §CORR 4: the gate verdict is INSIDE the '
    + 'allowlist), and EXCLUDES `hashedBodySha256`, `gFacesDetail` and `receipts`; the body '
    + 'hash is computed LAST — after every body key is assigned — and a NON-body '
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
    + 'self-referential. The FINAL file byte-hash and byte count are recomputed after the final '
    + 'write and PUBLISHED IN THE DOC\'s §R.',
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
banner(`LN-C0 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE LANE — occupants per pass and the composition ---');
for (const armK of ARMS) {
  banner(`  ${armK} occupants/pass ${f6(face('lane.occupantsPerPass', armK).value)} · `
    + `passes with ≥1 ${f6(face('lane.passesWithOccupantShare', armK).value)} (tight `
    + `${f6(face('lane.tight.passesWithOccupantShare', armK).value)})  n=`
    + `${face('lane.passesWithOccupantShare', armK).denominator}`);
  banner(`    ${CAUSES.map((c) => `${c} ${f6(face(`composition.${c}`, armK).value)}`).join(' · ')}`
    + `  n=${face('composition.L1', armK).denominator}  majority=`
    + `${(LANE_READS[armK] as { majorityClass: string }).majorityClass}`);
  banner(`    carom by cause: ${CAUSES.map((c) => `${c} ${f6(face(`carom.${c}`, armK).value)}`).join(' · ')}`
    + `  all ${f6(face('carom.all', armK).value)}`);
  banner(`    present ${f6(face('presence.all.present', armK).value)} · arrived `
    + `${f6(face('presence.all.arrived', armK).value)} · noWindup `
    + `${f6(face('presence.all.noWindup', armK).value)}`);
  banner(`    spot-in-lane (ALL own bodies) ${f6(face('spot.inLaneShareAllBodies', armK).value)}`
    + `  n=${face('spot.inLaneShareAllBodies', armK).denominator}`);
}
banner('');
banner('--- §R4 THE CROWD ---');
for (const armK of ARMS) {
  banner(`  ${armK} 撞车 ${f6(face('crowd.crashShare', armK).value)} · dup-run/sample `
    + `${f6(face('crowd.dupRunPairsPerSample', armK).value)} · nearest-mate `
    + `${f6(face('crowd.nearestMateMeanMetres', armK).value)} m`);
  banner(`    ${PAIRS.map((p) => `${p} ${f6(face(`pair.${p}`, armK).value)}`).join(' · ')}`
    + `  n=${face('pair.P1', armK).denominator}  majority=`
    + `${(CROWD_READS[armK] as { majorityClass: string }).majorityClass}`);
}
banner('');
banner('--- §R6 THE OPPONENTS IN THE LANE (beside) ---');
for (const armK of ARMS) {
  banner(`  ${armK} in-lane/pass ${f6(face('opponent.inLanePerPass', armK).value)} · passes with `
    + `≥1 ${f6(face('opponent.passesWithInLaneShare', armK).value)} · present `
    + `${f6(face('opponent.presence.present', armK).value)} · arrived `
    + `${f6(face('opponent.presence.arrived', armK).value)} · noWindup `
    + `${f6(face('opponent.presence.noWindup', armK).value)}`);
}
banner('');
banner('--- §R8 THE READS, PRINTED ---');
for (const s of READ_LIST) banner(`  ${s}`);
banner(`  (lane E13 ${LANE_E} · D13 ${LANE_D} · crowd E13 ${CROWD_E} · D13 ${CROWD_D})`);
banner('');
banner(`formationSpot path: ${FORMATION_SPOT_PATH}`);
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch).toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
