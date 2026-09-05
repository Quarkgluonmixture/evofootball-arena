/**
 * ⭐⭐ LN-C2 — 「谁选的接球人，他看见了谁」 THE CHOOSER-PATH CENSUS
 * (docs/world-model/LN-C2-CHOOSER-PATH-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #391 item 4 (the lane arc's fourth stage, on the CHOOSER's
 * side). Lineage: PT-C0 (the population and the `ball.lastTouch` FIRST-BODY channel, byte for
 * byte) -> BN-C0 (the corridor membership test) -> LN-C0 (the walker, the wind-up ARM-tick
 * channel, the cause classes, the estimator, the hash order) -> LN-T1 (X-DET, X-FP-PROD, the
 * LOO receipt) -> LN-C1 (#390 item 4: the choice-tick rule, the own-openness CALLED
 * reconstruction, the menu geometry, the first-body channel — REUSED and anchored) -> this
 * census, on WORLD 13's EMPTY-BOOK (E13) and DOSED (D13) arms.
 *
 * THE QUESTION (#391 items 2-3, NOT re-argued here): the mechanism of record has TWO pricers
 * and ONE own-body price. (i) the lane argmax's `groundCandidate` — a GRADED lane test that is
 * opponent-only, PLUS a BINARY ground-corridor SHELL price (`groundShellHazard` over
 * `[team.players, opp.players]`, shell = `coreRadius + BALL_RADIUS`, weight =
 * `dvExposureWeight` pinned 0.5 by world 13 via `bkGroundCorridor`); (ii) the PERCEIVED
 * CHOOSER (`edsPerceivedChoice`, TRUE in every a4 world) which, after the ladder decides to
 * pass, REPLACES the target with `choosePerceivedPassTarget`'s winner — a pricer scoped to
 * passer + candidates + opponents with neither a lane nor an own-body term. THE MEASUREMENT:
 * BY WHICH PATH was each struck pass's target chosen (the engine's own `passChoiceTrace`
 * ledger), HAD THE SHELL FIRED on the struck lane at the choice (`groundShellHazard` CALLED),
 * and WHERE did our own body stand (LN-C1's own-openness reconstruction, inherited).
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS, scores no hypothesis and ARMS NOTHING — it
 * prints FROZEN read literals that NAME where a seam belongs. Nothing ships.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe CALLS the
 * shipped exports (`laneOpenness`, `groundShellHazard`, `formationSpot`, `supportSpot`,
 * `closestPointOnSegment`, `a4MatchFlags`, `armA4World`) and reads public `Match` / `Team`
 * state per tick. THERE IS NO WRAPPER — `gLockstep` proves observed = unobserved byte for
 * byte, PER ARM, and `gLockstepTrace` proves the TRACE ITSELF is byte-inert (traced ≡
 * untraced whole-match signature, rng stream state included).
 * ⛔ WORLD 12 AND WORLD 13 BYTES ARE UNTOUCHED; every flag default stays OFF, and
 * `traceChoice` is passed EXPLICITLY on the construction, never through the `EDS_TRACE_CHOICE`
 * env (which this instrument's §1 envelope REFUSES).
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 * ⇒ THE PATH CLASS is read off the ENGINE's own `passChoiceTrace` row (`chosenGid` /
 * `legacyGid`), THE CHOICE TICK and THE AIM off the `pendingPassWindup` record and (for the
 * synchronous class) `match.dxStrikeAim`; the OWN-OPENNESS is the SHIPPED `laneOpenness`
 * CALLED with the OWN population — a DECLARED RECONSTRUCTION, never a re-implementation.
 *
 * ⭐⭐ THE LESSON OF #391 item 3(v), OBEYED: a code-fact boolean is derived from the WHOLE
 * function's text — this instrument stores a sha256 of the exact source text of
 * `groundCandidate`, `pricePassOption`, `choosePerceivedPassTarget` and `groundShellHazard`,
 * extracted by anchored start/end needles, BESIDE the named-site anchors.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { BALL_RADIUS, CONTROL_RADIUS, DT, GRAVITY, PLAYER_CORE_RADIUS } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  BQ_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import {
  DV_CORRIDOR_SCALE, DV_CLEAR_RADIUS, groundShellHazard,
} from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment } from '../../src/utils/vec';
import { formationSpot, supportSpot, emergentPosOn } from '../../src/ai/formations';
import { laneOpenness } from '../../src/ai/perception';
import {
  PASS_CHOICE_MAX_METRES, PASS_CHOICE_MIN_METRES,
} from '../../src/ai/perceivedPassChoice';
import type { Player } from '../../src/sim/Player';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the PT-C0 / BN-C0 §1 form)                  */
/* ========================================================================== */
const ENV_WHITELIST = ['LNC2_MODE', 'LNC2_N', 'LNC2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('LNC2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`LN-C2 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.LNC2_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('LN-C2 FATAL — LNC2_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.LNC2_N !== undefined ? Number(process.env.LNC2_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('LN-C2 FATAL — LNC2_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.LNC2_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`LNC2_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`LNC2_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`LNC2_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ln-c2-chooser-path-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ln-c2-chooser-path-census-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('LN-C2 FATAL — an override run may never write the canonical artifact path');
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
const PERC_PATH = 'src/ai/perception.ts';
const OBMT1_PATH = 'scripts/probes/obm-t1-policy-exam.ts';
const LNC0_PROBE_PATH = 'scripts/probes/ln-c0-lane-census.ts';
const LNC1_PROBE_PATH = 'scripts/probes/ln-c1-passer-lane-census.ts';
const PPC_PATH = 'src/ai/perceivedPassChoice.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, CONST_PATH, TYPES_PATH, TEAM_PATH, A4_PATH, DV_PATH, VEC_PATH,
  FORM_PATH, BRAIN_PATH, TEAMBRAIN_PATH, EXEC_PATH, A4P1C_PATH, PTC0_PATH, BNC0_PATH,
  RAT1B_PATH, PERC_PATH, OBMT1_PATH, LNC0_PROBE_PATH, LNC1_PROBE_PATH, PPC_PATH,
  PLAYER_PATH]) {
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


/* ========================================================================== */
/* ⭐⭐ G-ANCHORS — LN-C1's OWN SITES: THE CODE FACT, THE CHOICE TICK, THE AIM   */
/* ========================================================================== */
/* (a) THE CODE FACT — the chooser's lane test counts OPPONENTS AND ONLY OPPONENTS */
anchor('⭐⭐ CODE FACT (1/8) — `laneOpenness`\'s DECLARATION and its `opponents` PARAMETER '
  + '(the third parameter is named `opponents`; there is no own-side parameter at all)',
  PERC_PATH, 'export function laneOpenness(from: V2, to: V2, opponents: Player[]): number {', 1);
anchor('⭐⭐ CODE FACT (2/8) — the function ITERATES that argument and nothing else: its own '
  + 'closest-point line', PERC_PATH, '    const cp = closestPointOnSegment(from, to, o.pos);', 1);
anchor('⭐ CODE FACT — `laneOpenness`\'s own clear-the-kicker guard line', PERC_PATH,
  '    if (dist(cp, from) < 1.5) continue;', 1);
anchor('⭐ CODE FACT — `laneOpenness`\'s own 4 m aggregation line (`worst = min`)', PERC_PATH,
  '    worst = Math.min(worst, clamp01(d / 4));', 1);
anchor('⭐⭐ CODE FACT (3/8) — PASS-SCORING CALL SITE 1 of 4: `groundCandidate`\'s lane read, '
  + 'the ONE the measured ground pass is chosen by (PlayerBrain l.611)', BRAIN_PATH,
  "        laneOpenness(p.pos, aim, opp.players) * (p.traits.includes('playmaker') ? 1.15 : 1),", 1);
anchor('⭐⭐ CODE FACT (4/8) — PASS-SCORING CALL SITE 2 of 4: the through-ball lane read '
  + '(PlayerBrain l.916)', BRAIN_PATH, '      const lane = laneOpenness(p.pos, point, opp.players);', 1);
anchor('⭐⭐ CODE FACT (5/8) — PASS-SCORING CALL SITE 3 of 4: the arriver lane read '
  + '(PlayerBrain l.1036)', BRAIN_PATH, '      const lane = laneOpenness(p.pos, arr.pos, opp.players);', 1);
anchor('⭐⭐ CODE FACT (6/8) — PASS-SCORING CALL SITE 4 of 4: the safe-outlet lane read '
  + '(PlayerBrain l.1201)', BRAIN_PATH,
  '      sT *= 0.3 + laneOpenness(p.pos, mate.pos, opp.players) * 0.7;', 1);
anchor('⭐⭐ CODE FACT (7/8) — `opennessAt`\'s DECLARATION: the SECOND percept the ground '
  + 'candidate scores with, and its parameter is `opponents` too', PERC_PATH,
  'export function opennessAt(pos: V2, opponents: Player[]): number {', 1);
anchor('⭐⭐ CODE FACT (8/8) — `opennessAt(aim, opp.players)` INSIDE `groundCandidate`',
  BRAIN_PATH, '      const open = opennessAt(aim, opp.players);', 1);
anchor('⭐⭐ THE GROUND CANDIDATE\'S SCORE LINE — `s = passBase + lane·passLaneW + '
  + 'open·passOpenW`: the two percepts it composes are BOTH opponent-only, and NO own-body '
  + 'term appears', BRAIN_PATH,
  '      let s = W.passBase + lane * W.passLaneW + open * W.passOpenW;', 1);
anchor('⭐⭐ THE CHOOSER\'S OWN RISK GATE at 0.4 — the FIRST binning EDGE (PlayerBrain l.628)',
  BRAIN_PATH, '      if (gain > 0.15 && lane < 0.4) {', 1, 0.4);
anchor('⭐⭐ THE CHOOSER\'S OWN SECOND GATE at 0.45 — the SECOND binning EDGE (l.943)',
  BRAIN_PATH, '      if (lane < 0.45) {', 1, 0.45);
anchor('⭐⭐ HOW `opp` IS COMPOSED for every one of those calls — the truth team unless the '
  + 'snapshot law is armed (`inSnapshotLaw` is OFF in world 13, asserted by `gWorld`): the '
  + 'population is the WHOLE opponent `players` array, keeper included, and `laneOpenness` '
  + 'skips `sentOff` INSIDE the function', BRAIN_PATH,
  '  const opp = inView === null ? oppTruth : snapshotTeamView(oppTruth, inView.opps);', 1);
anchor('⭐ the snapshot law\'s DEFAULT-OFF line (why the census\'s opponent population IS the '
  + 'chooser\'s in world 13)', MATCH_PATH, '    this.inSnapshotLaw = cfg.inSnapshotLaw ?? false;', 1);
anchor('⭐⭐ THE FORWARD-GAIN FORM at `groundCandidate` — `team.localX(aim.x) − localX`, the '
  + 'form the menu\'s gain SIGN is read in', BRAIN_PATH,
  '      const gain = clamp01((team.localX(aim.x) - localX + 30) / 60) * 2 - 1;', 1);
anchor('⭐ `localX` — the passer\'s own forward coordinate', BRAIN_PATH,
  '  const localX = team.localX(p.pos.x);', 1);
anchor('⭐ the ground candidate is priced TO FEET first (the incumbent aim)', BRAIN_PATH,
  '      const feet = groundCandidate(mate, aim, d);', 1);
anchor('⭐ the DLC LED candidate enters the SAME argmax (the aim may be led — never recomputed '
  + 'by this census)', BRAIN_PATH, '        const ledCand = groundCandidate(mate, ledBall.aim, d);', 1);
/* (b) THE CHOICE TICK — the engine's OWN rule for when a pass is struck relative to the choice */
anchor('⭐⭐ CHOICE TICK (ARM class) — the ONE arm site: the brain, having chosen `Pass`, calls '
  + '`armPendingPass` SYNCHRONOUSLY at its decision tick when `o1PassWindup` is on',
  BRAIN_PATH, '        if (match.o1PassWindup && !mustKick && p.firstTouchWindow <= 0) {', 1);
anchor('⭐⭐ CHOICE TICK (ARM class) — the arm call itself', BRAIN_PATH,
  '          match.armPendingPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐⭐ CHOICE TICK (RELEASE class) — the synchronous release: the brain calls '
  + '`performPass` AT ITS OWN DECISION TICK, so the strike IS on the decision tick',
  BRAIN_PATH, '        } else match.performPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐⭐ CHOICE TICK (RELEASE class) — the led synchronous release, the same tick',
  BRAIN_PATH,
  '          match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));', 1);
anchor('⭐ CHOICE TICK (RELEASE class) — the CUTBACK release, also synchronous', BRAIN_PATH,
  '        match.performCutback(p, cutbackMate!);', 1);
anchor('⭐⭐ WHICH DOOR CREATES WIND-UP RECORDS IN WORLD 13: `o1PassWindup` is set by '
  + '`a4MatchFlags(3)`…', A4_PATH, '  if (version === 3) flags.o1PassWindup = true;', 1);
anchor('⭐⭐ …and world 13 INHERITS it, because the CB world composes on `a4MatchFlags(3)` and '
  + 'every later world CALLS its predecessor (world 13 -> 12 -> 11 -> 10 -> 9 -> 8 -> 7 -> 6 '
  + '-> a4MatchFlags(3)) — this is WHY LN-C0 found an arm record on more than half of the '
  + 'measured passes', A4_PATH,
  '  if (version === CB_WORLD_VERSION) return { ...a4MatchFlags(3), ...CB_WORLD_DOORS };', 1);
anchor('⭐⭐ THE WIND-UP RECORD IS ARMED AT THE DECISION TICK — `armPendingPass`\'s signature',
  MATCH_PATH, '  armPendingPass(passer: Player, mate: Player, offsideExempt = false): void {', 1);
anchor('⭐⭐ THE AIM OF RECORD (ARM class) — the record\'s OWN `aim`, the mate\'s ARM-TIME '
  + 'position, written by `armPendingPass`. ⛔ NEVER recomputed by this census', MATCH_PATH,
  '      aim: { x: mate.pos.x, y: mate.pos.y },', 1);
anchor('⭐ the record\'s `readyTick` — the strike is LATER than the choice for this class',
  MATCH_PATH, '      readyTick: this.stepCount + wTicks + bkTicks,', 1);
anchor('⭐⭐ the wind-up RESOLVE, called from the step', MATCH_PATH,
  '    if (this.pendingPassWindup !== null) this.resolvePendingPassWindup();', 1);
anchor('⭐ the resolve\'s own strike statement (the record\'s captured mate and aimLead)',
  MATCH_PATH, '    this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);', 1);
anchor('⭐ `resolvePendingPassWindup`\'s declaration', MATCH_PATH,
  '  private resolvePendingPassWindup(): void {', 1);
/* (c) X-FP-PROD's baseline, inherited from OBM-T1's probe (LN-T1's idiom) */
anchor('⭐⭐ X-FP-PROD — the PRODUCTION FINGERPRINT BASELINE, inherited from OBM-T1\'s probe',
  OBMT1_PATH,
  "const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';", 1);
/* (d) G-REPRO-LNC1 — the inherited walker's own lines, in LN-C0's own instrument */
anchor('⭐⭐ G-REPRO-LNC1 — LN-C0\'s OWN corridor membership test, the code this census '
  + 'inherits UNCHANGED (TWO occurrences in its instrument — the definition and its own '
  + 'anchor pin on BN-C0 — both enumerated)', LNC0_PROBE_PATH, 'const inCorridorOf = (', 2);
anchor('⭐⭐ G-REPRO-LNC1 — LN-C0\'s OWN wind-up ARM-tick key (the channel this census reads '
  + 'the choice tick from)', LNC0_PROBE_PATH,
  '      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;', 1);
anchor('⭐⭐ G-REPRO-LNC1 — LN-C0\'s OWN E rule (the aim of record where a record exists, the '
  + 'target\'s own position where none does)', LNC0_PROBE_PATH,
  '      const eX = armRec !== null ? armRec.eX : players[tGid].pos.x;', 1);


/* ==========================================================================
   ⭐⭐ LN-C2's OWN SITES — THE TWO PRICERS, THE SHELL, THE LEDGER, THE STRIKES
   ========================================================================== */
/* (a) THE LANE ARGMAX'S PRICER — the GC shell price, and WHOSE bodies it reads */
anchor('⭐⭐ CODE FACT (GC 1/4) — the GROUND-CORRIDOR SEAT, the ONE `bkGroundCorridor` fork: '
  + '`gcSeat` is formed from the genome when the door is open', BRAIN_PATH,
  '  const gcSeat = match.bkGroundCorridor ? deliveryValueSeatOf(g) : null;', 1);
anchor('⭐⭐ CODE FACT (GC 2/4) — `gcBodies` COMPOSITION: BOTH TEAMS. `[team.players, '
  + 'opp.players]` — OUR OWN BODIES ARE IN THE SHELL\'S POPULATION', BRAIN_PATH,
  '    gcSeat === null ? [] : [team.players, opp.players];', 1);
anchor('⭐⭐ CODE FACT (GC 3/4) — THE SUBTRACTION ITSELF, inside `groundCandidate`: '
  + '`sGc = sDv − gcSeat.exposureWeight · groundShellHazard(p.pos, aim, gcBodies, p.gid, '
  + 'mate.gid)`', BRAIN_PATH,
  '        : sDv - gcSeat.exposureWeight * groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid);',
  1);
anchor('⭐ CODE FACT (GC 4/4) — the DV risk price line ABOVE it (`sDv`), whose population is '
  + '`opp.players` alone — the contrast the census publishes', BRAIN_PATH,
  '        : s - deliveryRiskPrice(dvSeat, p.pos, aim, opp.players, team.localX(aim.x), W.passBase);',
  1);
anchor('⭐ CODE FACT — the RA access price line (`sRa`), the last subtraction, so the '
  + 'candidate\'s returned score is `sRa`', BRAIN_PATH,
  '        : sGc - raSeat.weight * receiverAccessDeficit(p.pos, aim, mate, p.gid) * W.passBase;', 1);
anchor('⭐⭐ CODE FACT — `groundShellHazard`\'s OWN SHELL: `coreRadius + BALL_RADIUS`', DV_PATH,
  '      const shell = o.coreRadius + BALL_RADIUS;', 1);
anchor('⭐⭐ CODE FACT — `groundShellHazard`\'s OWN FIRE TEST (on the segment AND short of the '
  + 'aim by a shell)', DV_PATH,
  '      if (dist(cp, o.pos) < shell && dist(from as V2, cp) < d - shell) return 1;', 1);
anchor('⭐⭐ CODE FACT — `groundShellHazard`\'s DECLARATION (the census CALLS it)', DV_PATH,
  'export function groundShellHazard(', 1);
anchor('⭐ `groundShellHazard`\'s KICKER exclusion', DV_PATH, '      if (o.gid === kickerGid) continue;', 1);
anchor('⭐ `groundShellHazard`\'s RECEIVER exclusion', DV_PATH,
  '      if (o.gid === receiverGid) continue;', 1);
anchor('⭐⭐ `BALL_RADIUS` — the shell\'s own ball half-width', CONST_PATH,
  'export const BALL_RADIUS = 0.11;', 1, 0.11);
anchor('⭐⭐ `PLAYER_CORE_RADIUS` — what the `coreRadius` getter returns', CONST_PATH,
  'export const PLAYER_CORE_RADIUS = PLAYER_MIN_DIST / 2;', 1);
anchor('⭐⭐ the `coreRadius` GETTER itself, quoted in the doc', PLAYER_PATH,
  '  get coreRadius(): number {\n    return PLAYER_CORE_RADIUS;\n  }', 1);
anchor('⭐⭐ `bkGroundCorridor` — world 12\'s own door, ARMED (so the shell price is live in '
  + 'world 13)', A4_PATH, '  bkGroundCorridor: true,', 1);
anchor('⭐ `dxWindupAim` — world 12\'s wind-up-aim door (why `dxStrikeAim` is written at all)',
  A4_PATH, '  dxWindupAim: true,', 1);
anchor('⭐⭐ `CORRIDOR_WORLD_WEIGHT` = the `dvExposureWeight` the WORLD pins (read again off the '
  + 'constructed match\'s effGenome as a receipt)', A4_PATH,
  'export const CORRIDOR_WORLD_WEIGHT = 0.5;', 1, 0.5);
/* (b) THE PERCEIVED CHOOSER — the substitution, its scope, its band */
anchor('⭐⭐ CODE FACT (EDS 1/6) — `edsPerceivedChoice` in `A4_WORLD_FLAGS` (TWO occurrences in '
  + 'this module — the A4 census flags and the MT world\'s — both enumerated)', A4_PATH,
  '  edsPerceivedChoice: true,', 2);
anchor('⭐⭐ CODE FACT (EDS 2/6) — THE CANDIDATE ENUMERATION: `passChoiceCandidateGids(p, '
  + 'team.players)`', BRAIN_PATH,
  '    const candidateGids = passChoiceCandidateGids(p, team.players);', 1);
anchor('⭐⭐ CODE FACT (EDS 3/6) — THE SCOPE: passer + candidates (+ the opponents added on the '
  + 'next line) — NON-CANDIDATE TEAMMATES ARE NOT IN IT', BRAIN_PATH,
  '    const scope = new Set<number>([p.gid, ...candidateGids]);', 1);
anchor('⭐ CODE FACT (EDS) — the opponents added to that scope', BRAIN_PATH,
  '    for (const other of opp.players) if (!other.sentOff) scope.add(other.gid);', 1);
anchor('⭐⭐ CODE FACT (EDS 4/6) — THE SUBSTITUTION LINE: `if (chosen) passMate = chosen;`',
  BRAIN_PATH, '    if (chosen) passMate = chosen;', 1);
anchor('⭐⭐ CODE FACT (EDS 5/6) — the GATE on the whole block (Pass, not the cutback, not a '
  + 'keeper, a legacy argmax exists)', BRAIN_PATH,
  "    match.edsPerceivedChoice && top.action === 'Pass' && top !== cutbackCand\n"
  + "    && p.role !== 'GK' && bestMate !== null", 1);
anchor('⭐ CODE FACT (EDS) — the FORCED-target branch ABOVE it (null in every production path; '
  + 'the cutback keeps its own machinery)', BRAIN_PATH,
  "  if (match.forcedPassTarget !== null && top.action === 'Pass' && top !== cutbackCand) {", 1);
anchor('⭐⭐ CODE FACT (EDS 6/6) — `passChoiceCandidateGids`\'s DISTANCE BAND', PPC_PATH,
  '    if (d < PASS_CHOICE_MIN_METRES || d > PASS_CHOICE_MAX_METRES) continue;', 1);
anchor('⭐⭐ the band\'s own constants — MIN', PPC_PATH,
  'export const PASS_CHOICE_MIN_METRES = 6;', 1, 6);
anchor('⭐⭐ the band\'s own constants — MAX', PPC_PATH,
  'export const PASS_CHOICE_MAX_METRES = 30;', 1, 30);
anchor('⭐ `passChoiceCandidateGids` skips the passer, the sent-off and the KEEPER', PPC_PATH,
  "    if (mate.gid === passer.gid || mate.sentOff || mate.role === 'GK') continue;", 1);
anchor('⭐⭐ `pricePassOption`\'s DECLARATION (the pricer the census hashes whole)', PPC_PATH,
  'export function pricePassOption(input: {', 1);
anchor('⭐⭐ `choosePerceivedPassTarget`\'s DECLARATION (the argmax the census hashes whole)',
  PPC_PATH, 'export function choosePerceivedPassTarget(', 1);
anchor('⭐ `choosePerceivedPassTarget`\'s own argmax (best EXECUTABLE price; ties to the lower '
  + 'gid)', PPC_PATH, '  const executable = options.filter((option) => option.executable);', 1);
/* (c) THE ENGINE'S OWN CHOICE LEDGER — the SIDECAR this census joins to */
anchor('⭐⭐ THE LEDGER — `match.passChoiceTrace.push({ … })`, the ONE write site', BRAIN_PATH,
  '      match.passChoiceTrace.push({', 1);
anchor('⭐⭐ the ledger row\'s `chosenGid` (−1 = no executable option)', BRAIN_PATH,
  '        chosenGid: choice?.targetGid ?? -1,', 1);
anchor('⭐⭐ the ledger row\'s `legacyGid` — the LANE ARGMAX\'s own pick (`bestMate.gid`)',
  BRAIN_PATH, '        legacyGid: bestMate.gid,', 1);
anchor('⭐ the ledger row\'s `tick` — `match.simTick`, the DECISION tick', BRAIN_PATH,
  '        tick: match.simTick,', 1);
anchor('⭐ the ledger row\'s menu `options[]` with `infoClass` (E5g)', BRAIN_PATH,
  '        options: (choice?.options ?? []).map((option) => ({', 1);
anchor('⭐⭐ the ledger ARRAY on the match — appended to ONLY when `traceChoice` is on',
  MATCH_PATH, '  readonly passChoiceTrace: PassChoiceTraceEntry[] = [];', 1);
anchor('⭐⭐ the SIDECAR docblock — "read by nothing in the sim" (the claim `gLockstepTrace` '
  + 'PROVES)', MATCH_PATH,
  '   * why a particular man was or was not taken instead of re-deriving the answer\n'
  + '   * outside the seam. A SIDECAR — written only when `traceChoice` is armed, read\n'
  + '   * by nothing in the sim', 1);
anchor('⭐⭐ `traceChoice`\'s DEFAULT — it falls back to the `EDS_TRACE_CHOICE` ENV, which is '
  + 'why this census passes the flag EXPLICITLY and REFUSES that env at §1', MATCH_PATH,
  '    this.traceChoice = cfg.traceChoice ?? EDS_TRACE_ARMED;', 1);
anchor('⭐⭐ …and the env door itself', MATCH_PATH,
  "const EDS_TRACE_ARMED = envArmed('EDS_TRACE_CHOICE');", 1);
anchor('⭐ the `traceChoice` config field\'s declaration', MATCH_PATH, '  traceChoice?: boolean;', 1);
/* (d) EVERY STRIKE SITE OF THE POPULATION (#391's §CORR 7 debt, paid) */
anchor('⭐⭐ STRIKE SITE 1/5 — the Pass branch\'s ARM (`armPendingPass`)', BRAIN_PATH,
  '          match.armPendingPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐⭐ STRIKE SITE 2/5 — the Pass branch\'s LED synchronous release, which carries the '
  + 'DLC lead the census reads off `match.dxStrikeAim`', BRAIN_PATH,
  '          match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));', 1);
anchor('⭐⭐ STRIKE SITE 3/5 — the Pass branch\'s TO-FEET synchronous release', BRAIN_PATH,
  '        } else match.performPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐⭐ STRIKE SITE 4/5 — the CUTBACK (its own machinery; never substituted)', BRAIN_PATH,
  '        match.performCutback(p, cutbackMate!);', 1);
anchor('⭐⭐ STRIKE SITE 5/5 — the THROUGH BALL', BRAIN_PATH,
  '      match.performThroughBall(p, bestRunner!, bestThroughChip, offsideExemptKick);', 1);
anchor('⭐⭐ STRIKE SITE (restart) — the KICKOFF PLAY-BACK, a direct `performPass` with no EDS '
  + 'block at all (an UNTRACED pass by construction)', BRAIN_PATH,
  '      match.performPass(p, back);', 1);
anchor('⭐⭐ THE STRIKE\'S OWN AIM RECORD for the SYNCHRONOUS class — the `dxStrikeAim` deposit '
  + '(gid + lead + tick), written at the decision tick when the argmax elected a displaced '
  + 'candidate', BRAIN_PATH,
  '        if (match.dxWindupAim && passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)) {',
  1);
anchor('⭐ the deposit\'s own field', MATCH_PATH,
  '  dxStrikeAim: { gid: number; lead: V2; tick: number } | null = null;', 1);
/* (e) LN-C1's OWN inherited machinery — the reproduction target */
anchor('⭐⭐ G-REPRO-LNC1 — LN-C1\'s OWN choice-tick class rule, INHERITED', LNC1_PROBE_PATH,
  'const choiceClassOf = (hasArmRecord: boolean): ChoiceClass =>', 1);
anchor('⭐⭐ G-REPRO-LNC1 — LN-C1\'s OWN own-openness reconstruction line, INHERITED',
  LNC1_PROBE_PATH, '  const ownOpen = laneOpenness(passer.pos, aim, ownPop);', 1);
anchor('⭐⭐ G-REPRO-LNC1 — LN-C1\'s OWN population rule (own outfield minus passer minus '
  + 'target), INHERITED', LNC1_PROBE_PATH,
  '  const ownPop = outfield.filter((q) => q.gid !== targetGid);', 1);

/* ==========================================================================
   ⭐⭐ THE FOUR WHOLE-FUNCTION TEXT HASHES (#391 item 3(v)'s LESSON OF RECORD:
   "a code read anchored at the sites one already believes in is a confirmation,
   not a census … Future code-fact booleans are derived from the WHOLE function
   body (a hash of the function's text, anchored) beside the named sites").
   Each function's EXACT source text is extracted by an ANCHORED START NEEDLE and
   an ANCHORED END NEEDLE, hashed, and stored with its line span; the booleans
   below say what each function's WHOLE TEXT does and does NOT contain.
   ========================================================================== */
interface FnText {
  name: string; file: string; startNeedle: string; endNeedle: string;
  found: boolean; startLine: number; endLine: number; chars: number; lines: number;
  sha256: string; contains: Record<string, boolean>;
}
const FN_TEXTS: FnText[] = [];
const fnText = (
  name: string, file: string, startNeedle: string, endNeedle: string,
  probes: readonly string[],
): FnText => {
  const src = SRC_OF[file];
  const i = src.indexOf(startNeedle);
  const j = i < 0 ? -1 : src.indexOf(endNeedle, i);
  const found = i >= 0 && j >= 0 && src.indexOf(startNeedle, i + 1) < 0;
  const text = found ? src.slice(i, j + endNeedle.length) : '';
  const row: FnText = {
    name, file, startNeedle, endNeedle, found,
    startLine: found ? lineOf(src, i) : -1,
    endLine: found ? lineOf(src, j + endNeedle.length) : -1,
    chars: text.length, lines: found ? text.split('\n').length : 0,
    sha256: found ? sha(text) : '',
    contains: Object.fromEntries(probes.map((q) => [q, text.includes(q)])),
  };
  FN_TEXTS.push(row);
  return row;
};
const FN_GROUND_CANDIDATE = fnText(
  'groundCandidate', BRAIN_PATH,
  '    const groundCandidate = (mate: Player, aim: Readonly<V2>, d: number): {',
  '      return { s: sRa, lane, open, gain, mul };\n    };',
  ['laneOpenness(p.pos, aim, opp.players)', 'opennessAt(aim, opp.players)',
    'W.passBase + lane * W.passLaneW + open * W.passOpenW', 'const sDv =', 'const sGc =',
    'const sRa =', 'groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid)',
    'team.players'],
);
const FN_PRICE_PASS_OPTION = fnText(
  'pricePassOption', PPC_PATH, 'export function pricePassOption(input: {', '\n}\n',
  ['laneOpenness', 'groundShellHazard', 'closestPointOnSegment', 'teammates',
    'threatQuintilePrice', 'attemptValueAt', 'infoClass'],
);
const FN_CHOOSE_PERCEIVED = fnText(
  'choosePerceivedPassTarget', PPC_PATH, 'export function choosePerceivedPassTarget(', '\n}\n',
  ['laneOpenness', 'groundShellHazard', 'pricePassOption', 'executable', 'teammates'],
);
const FN_GROUND_SHELL = fnText(
  'groundShellHazard', DV_PATH, 'export function groundShellHazard(', '\n}\n',
  ['o.coreRadius + BALL_RADIUS', 'kickerGid', 'receiverGid', 'sentOff',
    'closestPointOnSegment', 'side'],
);
/** ⭐⭐ THE STORED CODE-FACT BOOLEANS — every one DERIVED from a whole-function text. */
const FN_FACTS = {
  groundCandidateReadsOwnBodiesThroughTheShell:
    FN_GROUND_CANDIDATE.contains['groundShellHazard(p.pos, aim, gcBodies, p.gid, mate.gid)'],
  groundCandidateGradedLaneTestIsOpponentOnly:
    FN_GROUND_CANDIDATE.contains['laneOpenness(p.pos, aim, opp.players)'],
  groundShellHazardIteratesEverySideItIsHanded: FN_GROUND_SHELL.contains['side'],
  groundShellHazardShellIsCoreRadiusPlusBallRadius:
    FN_GROUND_SHELL.contains['o.coreRadius + BALL_RADIUS'],
  pricePassOptionHasNoLaneTerm: !FN_PRICE_PASS_OPTION.contains['laneOpenness'],
  pricePassOptionHasNoOwnBodyTerm: !FN_PRICE_PASS_OPTION.contains['groundShellHazard']
    && !FN_PRICE_PASS_OPTION.contains['teammates'],
  choosePerceivedPassTargetHasNoLaneTerm: !FN_CHOOSE_PERCEIVED.contains['laneOpenness'],
  choosePerceivedPassTargetHasNoOwnBodyTerm:
    !FN_CHOOSE_PERCEIVED.contains['groundShellHazard']
    && !FN_CHOOSE_PERCEIVED.contains['teammates'],
};
const FN_TEXTS_OK = FN_TEXTS.every((f) => f.found && f.chars > 0 && f.sha256.length === 64);

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

/** ⭐⭐ THE TWO BINNING EDGES ARE THE CHOOSER'S OWN GATES, EXTRACTED from the anchored lines
 *  by regex — never re-typed as decimals (canon: anchored extraction). */
const GATE_040 = Number((SRC_OF[BRAIN_PATH]
  .match(/if \(gain > 0\.15 && lane < (0\.\d+)\) \{/) ?? ['', 'NaN'])[1]);
const GATE_045 = Number((SRC_OF[BRAIN_PATH]
  .match(/\n      if \(lane < (0\.\d+)\) \{\n/) ?? ['', 'NaN'])[1]);
/** ⭐⭐ X-FP-PROD's pins, inherited from OBM-T1's probe (anchored above), never re-typed. */
const FINGERPRINT_BASELINE = (SRC_OF[OBMT1_PATH]
  .match(/const FINGERPRINT_BASELINE = '([0-9a-f]{64})';/) ?? ['', ''])[1];
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && GATE_040 === 0.4 && GATE_045 === 0.45
  && GATE_040 === (ANCHORS.find((a) => a.needle === '      if (gain > 0.15 && lane < 0.4) {')!
    .extracted as number)
  && GATE_045 === (ANCHORS.find((a) => a.needle === '      if (lane < 0.45) {')!
    .extracted as number)
  && /^[0-9a-f]{64}$/.test(FINGERPRINT_BASELINE)
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
  && BQ_WORLD_VERSION === 13 && GRAVITY === 9.81
  /* ⭐⭐ LN-C2's own extracted constants, each equal to its ANCHORED site's `extracted` value */
  && BALL_RADIUS === (ANCHORS.find((a) => a.needle === 'export const BALL_RADIUS = 0.11;')!
    .extracted as number)
  && PLAYER_CORE_RADIUS > 0
  && CORRIDOR_WORLD_WEIGHT === (ANCHORS.find(
    (a) => a.needle === 'export const CORRIDOR_WORLD_WEIGHT = 0.5;')!.extracted as number)
  && PASS_CHOICE_MIN_METRES === (ANCHORS.find(
    (a) => a.needle === 'export const PASS_CHOICE_MIN_METRES = 6;')!.extracted as number)
  && PASS_CHOICE_MAX_METRES === (ANCHORS.find(
    (a) => a.needle === 'export const PASS_CHOICE_MAX_METRES = 30;')!.extracted as number);

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
const BLOCK_BASE = 12_547_000;
const BLOCK_TOP = 12_547_999;
/** ⭐⭐ N_FROZEN — SIZED, not chosen: N = min(the largest `nRequired` over the two SIZED read
 *  rows, the block's own affordance after the construction receipt at 12,546,999 = 999). The
 *  variance source is the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE, run BEFORE the freeze commit
 *  and BEFORE any battery seed; its realised half-widths are transcribed into `SIZING_INPUTS`
 *  (§15) and the arithmetic below is the house form, recomputed by the instrument itself.
 *  ⚠ WHICH BRANCH BOUND IT is STORED (`sizing.boundBy`) and stated in the doc. */
const BLOCK_AFFORDS = BLOCK_TOP - BLOCK_BASE; // 999 seeds after the construction receipt
const N_FROZEN = 485;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_003_700;
/** ⭐⭐ G-REPRO-LNC1 — LN-C1's OWN first twelve battery seeds, RE-WALKED on the E13 arm.
 *  ⛔ RE-WALKS, NOT CONSUMPTION: block 12,546,000–999 is LN-C1's, consumed whole of record. */
const REPRO_LNC1_BASE = 12_546_000;
const REPRO_LNC1_N = 12;
const REPRO_LNC1_SEEDS = Array.from({ length: REPRO_LNC1_N }, (_, i) => REPRO_LNC1_BASE + i);
const LNC1_ARTIFACT = 'docs/world-model/data/ln-c1-passer-lane-census.json';
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
  banner('LN-C2 FATAL — a dose file\'s BYTES do not match the pinned value (#388 item 2(i))');
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
  banner(`LN-C2 FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
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
const buildMatch = (seed: number, arm: Arm, traced = true): Match => {
  /** ⭐⭐ `traceChoice` IS PASSED EXPLICITLY, NEVER THROUGH THE ENV. `Match` defaults the flag
   *  from `EDS_TRACE_ARMED` (the `EDS_TRACE_CHOICE` env door, anchored at §3) — this
   *  instrument's §1 envelope REFUSES that env outright, and the construction below states the
   *  boolean itself, so the arms' ledger is armed by CONSTRUCTION and the `gLockstepTrace`
   *  twin is un-armed the same way. */
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION), traceChoice: traced,
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

/* ========================================================================== */
/* ⭐⭐ LN-C1 §6b — THE CHOICE TICK, THE TWO OPENNESSES AND THE MENU            */
/* ========================================================================== */
/** ⭐⭐ THE CHOICE-TICK CLASSES, FROZEN with the ENGINE'S OWN RULE (anchored at §3):
 *  - `arm`     — a wind-up record was resolved for THIS passer and THIS target. The brain
 *                calls `armPendingPass` SYNCHRONOUSLY at the tick it chose `Pass`
 *                (`PlayerBrain` l.1683–1684), so THE ARM TICK IS THE CHOICE TICK, and the
 *                record's own `aim` (+ `aimLead`) is the AIM OF RECORD.
 *  - `release` — no wind-up record. Every remaining strike path is called SYNCHRONOUSLY from
 *                the same brain decision (`performPass` at l.1686/1687, `performCutback` at
 *                l.1628), so THE STRIKE IS ON THE DECISION TICK and THE RELEASE TICK IS THE
 *                CHOICE TICK, read as such. The aim of record is PT-C0's own: the target's
 *                position at the strike tick — the flight's launch-to-target line.
 *  - `none`    — a measured ground pass whose choice tick is NOT establishable by either rule.
 *                COUNTED, never imputed (LN-C0's `noWindup` precedent). By the engine's rule
 *                above the class is expected EMPTY; whatever it reads is published beside
 *                every read sentence. */
const CHOICE_CLASSES = ['arm', 'release', 'none'] as const;
type ChoiceClass = (typeof CHOICE_CLASSES)[number];
const CCI = (c: ChoiceClass): number => CHOICE_CLASSES.indexOf(c);
/** the ESTABLISHED classes — the reads are stated on these, the counted class beside. */
const ESTABLISHED: readonly ChoiceClass[] = ['arm', 'release'];
const choiceClassOf = (hasArmRecord: boolean): ChoiceClass =>
  (hasArmRecord ? 'arm' : 'release');

/** ⭐ the openness grid: a FINE 0.1 grid, DECLARED AS BINS (never a rule). The two RULE edges
 *  are the chooser's OWN gates, extracted at §3: `GATE_040` (l.628) and `GATE_045` (l.943). */
const OPEN_BIN_W = 0.1; const OPEN_BINS = 10;

/** ⭐⭐ THE FIRST BODY'S PRESENCE AT THE CHOICE — LN-C0's present/arrived split, RE-EXPRESSED
 *  on the CHOICE tick. `presentAtChoice` = he was inside the release corridor AND (for the
 *  `arm` class) inside the ARM-tick corridor too; `arrivedAfterChoice` = inside at release,
 *  outside at the arm tick (⚠ STRUCTURALLY EMPTY for the `release` class, whose choice tick IS
 *  the release tick — declared, and fixture-pinned); `notInReleaseCorridor` = the first body
 *  was never a lane occupant at all (the ball's struck line is not the aim line). */
const CAROM_PRESENCE = ['presentAtChoice', 'arrivedAfterChoice', 'notInReleaseCorridor'] as const;
type CaromPresence = (typeof CAROM_PRESENCE)[number];
const CPI = (c: CaromPresence): number => CAROM_PRESENCE.indexOf(c);
const caromPresenceOf = (
  wasOccupant: boolean, occPresence: Presence | null,
): CaromPresence => (!wasOccupant ? 'notInReleaseCorridor'
  : occPresence === 'arrived' ? 'arrivedAfterChoice' : 'presentAtChoice');

/** the forward-gain SIGN cells of the best alternative (published beside, NEVER gating). */
const GAIN_SIGNS = ['backward', 'level', 'forward'] as const;
const GSI = (g: number): number => (g < 0 ? 0 : g > 0 ? 2 : 1);

/** ⭐⭐ THE PATH CLASSES, off the ENGINE'S OWN LEDGER (`match.passChoiceTrace`), FROZEN:
 *   · `legacyChosen`   — a trace row joined AND `chosenGid === legacyGid`: the perceived
 *                        chooser priced the menu and landed on the lane argmax's own man.
 *   · `legacyNoOption` — a trace row joined AND `chosenGid === -1`: no EXECUTABLE option, so
 *                        the seam left the legacy target in place (the sub-class of LEGACY the
 *                        ruling asks to be stored separately).
 *   · `substituted`    — a trace row joined, `chosenGid >= 0` AND `chosenGid !== legacyGid`:
 *                        the perceived pricer REPLACED the target.
 *   · `untraced`       — NO trace row for (decision tick, passerGid). COUNTED, never imputed:
 *                        the cutback keeps its own machinery, the keeper is excluded from the
 *                        perceived chooser, a forced target is a different branch, and a pass
 *                        whose decision did not run the EDS block at all (the kickoff
 *                        play-back, the through ball) has no row by construction. */
const PATHS = ['legacyChosen', 'legacyNoOption', 'substituted', 'untraced'] as const;
type PathClass = (typeof PATHS)[number];
const PTI = (c: PathClass): number => PATHS.indexOf(c);
const pathClassOf = (
  traced: boolean, chosenGid: number, legacyGid: number,
): PathClass => (!traced ? 'untraced'
  : chosenGid === -1 ? 'legacyNoOption'
    : chosenGid === legacyGid ? 'legacyChosen' : 'substituted');
/** the LEGACY class of the ruling = both legacy sub-classes; TRACED = everything but untraced */
const LEGACY_PATHS: readonly PathClass[] = ['legacyChosen', 'legacyNoOption'];
const TRACED_PATHS: readonly PathClass[] = ['legacyChosen', 'legacyNoOption', 'substituted'];

/** ⭐⭐ LN-C2's CROSS CELL: choice-tick class × path class, flattened.
 *  `k = CCI(choiceClass) * PATHS.length + PTI(pathClass)` — every path face is therefore
 *  readable inside a choice class OR pooled over the established classes, with no second copy
 *  of any count. */
const CP_CELLS = CHOICE_CLASSES.length * PATHS.length;
const CPK = (c: ChoiceClass, pth: PathClass): number => CCI(c) * PATHS.length + PTI(pth);
const cpIdx = (
  classes: readonly ChoiceClass[], paths: readonly PathClass[],
): number[] => classes.flatMap((c) => paths.map((pth) => CPK(c, pth)));

/** ⭐⭐ THE SUBSTITUTION'S DIRECTION — did the perceived chooser move the ball INTO a lane with
 *  one of ours in it, or OUT OF one? Read on the STRUCK lane's own-openness against the LANE
 *  ARGMAX'S OWN candidate's (a DECLARED reconstruction: the argmax's aim is NOT recorded, so
 *  the legacy lane is `passer.pos → legacyGid's body position at the choice`). */
const SUB_DIRS = ['into', 'outOf', 'neither', 'noLegacyLane'] as const;
type SubDir = (typeof SUB_DIRS)[number];
const SDI = (d: SubDir): number => SUB_DIRS.indexOf(d);
const subDirOf = (
  struckOwnOpen: number, legacyOwnOpen: number, gate: number,
): SubDir => {
  if (!Number.isFinite(legacyOwnOpen) || !Number.isFinite(struckOwnOpen)) return 'noLegacyLane';
  const struckBlocked = struckOwnOpen < gate;
  const legacyBlocked = legacyOwnOpen < gate;
  return struckBlocked && !legacyBlocked ? 'into'
    : !struckBlocked && legacyBlocked ? 'outOf' : 'neither';
};

/** ⭐⭐ THE SHELL, CALLED — `groundShellHazard` is the SHIPPED function, handed the SAME body
 *  collections the pricer hands it (`[team.players, opp.players]`), the SAME kicker gid and the
 *  SAME receiver gid. ⛔ Never re-implemented. The own-only and opponent-only calls are the
 *  same shipped function on a NARROWED population, so the doc can say WHOSE body fired it. */
const shellOf = (
  from: Readonly<{ x: number; y: number }>, aimX: number, aimY: number,
  own: readonly Player[], opp: readonly Player[], kickerGid: number, receiverGid: number,
): { both: number; ownOnly: number; oppOnly: number } => ({
  both: groundShellHazard(from, { x: aimX, y: aimY }, [own, opp], kickerGid, receiverGid),
  ownOnly: groundShellHazard(from, { x: aimX, y: aimY }, [own], kickerGid, receiverGid),
  oppOnly: groundShellHazard(from, { x: aimX, y: aimY }, [opp], kickerGid, receiverGid),
});

/** ⭐⭐ THE CHOICE READ — a DECLARED RECONSTRUCTION built ONLY from the SHIPPED `laneOpenness`
 *  and the SHIPPED `groundShellHazard`, both CALLED (never re-implemented) at the passer's OWN
 *  position at the choice tick, toward the AIM OF RECORD:
 *   · `oppOpen` = `laneOpenness(passer.pos, aim, opp.players)` — WHAT THE GRADED LANE TEST SAW:
 *     the SAME population predicate the chooser's own call uses (the whole opponent `players`
 *     array, keeper INCLUDED; `sentOff` is skipped INSIDE the shipped function).
 *   · `ownOpen` = the same function with the OWN population — own OUTFIELD bodies minus the
 *     passer minus the target. THE CENSUS'S OWN DECLARED POPULATION (LN-C1's, inherited).
 *   · `shell` / `shellOwnOnly` / `shellOppOnly` = `groundShellHazard` CALLED on the STRUCK lane
 *     with `[team.players, opp.players]` / `[team.players]` / `[opp.players]`, kicker and
 *     receiver excluded by the shipped function itself. ⭐ THE SHIPPED PRICE, at the shipped
 *     shell (`coreRadius + BALL_RADIUS`).
 *   · `shellLegacy` / `legacyOwnOpen` / `legacyOppOpen` = the same two reads on the LANE
 *     ARGMAX'S OWN candidate's lane (`passer.pos → legacyGid's body position at the choice`) —
 *     a DECLARED RECONSTRUCTION, because the argmax's own aim is NOT recorded anywhere.
 *   · `occ` / `occTight` = LN-C0's 4 m corridor membership (BN-C0's test), the SECOND
 *     membership face for the same bodies, at the CHOICE tick's geometry.
 *   · THE MENU (a declared reconstruction, ⛔ NOT the chooser's score): for every OTHER own
 *     outfield mate, the own- and opponent-openness of `passer.pos → mate.pos` (own population
 *     = own outfield minus passer minus THAT mate). `alt` = an alternative exists with
 *     own-openness ≥ GATE_040 AND opponent-openness ≥ the chosen lane's opponent-openness.
 *     THE BEST such alternative is the one with the HIGHEST opponent-openness (ties resolved
 *     by the earlier player index — a frozen, stated tie-break), and only its forward-gain
 *     SIGN is published. */
interface ChoiceRead {
  ownOpen: number; oppOpen: number; occ: boolean; occTight: boolean;
  alt: boolean; altGainSign: number; mates: number; altCount: number;
  /** ⭐⭐ LN-C2's own additions — 0/1 from the SHIPPED `groundShellHazard`, NaN with no lane. */
  shell: number; shellOwnOnly: number; shellOppOnly: number;
  /** the LANE ARGMAX'S OWN candidate beside (NaN / −1 when there is no legacy body to read). */
  shellLegacy: number; legacyOwnOpen: number; legacyOppOpen: number;
}
const EMPTY_CHOICE: ChoiceRead = {
  ownOpen: Number.NaN, oppOpen: Number.NaN, occ: false, occTight: false,
  alt: false, altGainSign: 0, mates: 0, altCount: 0,
  shell: Number.NaN, shellOwnOnly: Number.NaN, shellOppOnly: Number.NaN,
  shellLegacy: Number.NaN, legacyOwnOpen: Number.NaN, legacyOppOpen: Number.NaN,
};
const choiceReadOf = (
  m: Match, passer: Player, targetGid: number, eX: number, eY: number,
  legacyGid: number | null,
): ChoiceRead => {
  const side = passer.side as Side;
  const ownAll = m.teams[side].players;
  const oppPlayers = m.teams[1 - side].players;
  const aim = { x: eX, y: eY };
  const outfield = ownAll.filter((q) => q.role !== 'GK' && !q.sentOff && q.gid !== passer.gid);
  const ownPop = outfield.filter((q) => q.gid !== targetGid);
  const ownOpen = laneOpenness(passer.pos, aim, ownPop);
  const oppOpen = laneOpenness(passer.pos, aim, oppPlayers);
  /* ⭐⭐ THE SHELL ON THE STRUCK LANE — the shipped function, the pricer's own populations. */
  const sh = shellOf(passer.pos, eX, eY, ownAll, oppPlayers, passer.gid, targetGid);
  /* ⭐ THE LANE ARGMAX'S OWN CANDIDATE beside — a DECLARED reconstruction of its lane. */
  const legacyBody = legacyGid === null ? undefined
    : m.allPlayers.find((q) => q.gid === legacyGid);
  let shellLegacy = Number.NaN;
  let legacyOwnOpen = Number.NaN;
  let legacyOppOpen = Number.NaN;
  if (legacyBody !== undefined && legacyBody.gid !== passer.gid
    && Math.hypot(legacyBody.pos.x - passer.pos.x, legacyBody.pos.y - passer.pos.y) > 1e-6) {
    const lPop = outfield.filter((q) => q.gid !== legacyBody.gid);
    legacyOwnOpen = laneOpenness(passer.pos, legacyBody.pos, lPop);
    legacyOppOpen = laneOpenness(passer.pos, legacyBody.pos, oppPlayers);
    shellLegacy = groundShellHazard(
      passer.pos, legacyBody.pos, [ownAll, oppPlayers], passer.gid, legacyBody.gid,
    );
  }
  let occ = false; let occTight = false;
  for (const q of ownPop) {
    if (inCorridorOf(passer.pos.x, passer.pos.y, eX, eY, q.pos.x, q.pos.y, DV_CORRIDOR_SCALE)) {
      occ = true;
    }
    if (inCorridorOf(passer.pos.x, passer.pos.y, eX, eY, q.pos.x, q.pos.y, CONTROL_RADIUS)) {
      occTight = true;
    }
  }
  let alt = false; let altCount = 0; let bestOpp = Number.NEGATIVE_INFINITY; let bestGain = 0;
  let mates = 0;
  const localXPasser = m.teams[side].localX(passer.pos.x);
  for (const mate of ownPop) {
    mates += 1;
    const altOwnPop = outfield.filter((q) => q.gid !== mate.gid);
    const aOwn = laneOpenness(passer.pos, mate.pos, altOwnPop);
    const aOpp = laneOpenness(passer.pos, mate.pos, oppPlayers);
    if (aOwn >= GATE_040 && aOpp >= oppOpen) {
      alt = true; altCount += 1;
      if (aOpp > bestOpp) {
        bestOpp = aOpp;
        bestGain = m.teams[side].localX(mate.pos.x) - localXPasser;
      }
    }
  }
  return { ownOpen, oppOpen, occ, occTight, alt, altGainSign: alt ? Math.sign(bestGain) : 0,
    mates, altCount,
    shell: sh.both, shellOwnOnly: sh.ownOnly, shellOppOnly: sh.oppOnly,
    shellLegacy, legacyOwnOpen, legacyOppOpen };
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

/* ⭐⭐ gWalkFixtures — LN-C1's OWN: the SHIPPED `laneOpenness` CALLED on hand-built geometries
   with the census's OWN population, so the reconstruction's population rule is PINNED and not
   merely described (canon: a headline-bearing walk-side predicate needs a composition fixture). */
const fxBody = (gid: number, x: number, y: number, extra: Record<string, unknown> = {}):
  Player => ({ gid, pos: { x, y }, sentOff: false, role: 'MF',
    coreRadius: PLAYER_CORE_RADIUS, ...extra } as unknown as Player);
const LANE_FROM = { x: 0, y: 0 };
const LANE_TO = { x: 20, y: 0 };
fx('ownOpenness.emptyLaneIsOne', laneOpenness(LANE_FROM, LANE_TO, []), 1);
fx('ownOpenness.bodyOnTheSegmentIsZero',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 0)]), 0);
fx('ownOpenness.bodyFourMetresOffIsOpen',
  near(laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 4)]), 1), true);
fx('ownOpenness.bodyTwoMetresOffIsHalf',
  near(laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 2)]), 0.5), true);
fx('ownOpenness.bodyInsideTheClearRadiusIsIgnored',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, DV_CLEAR_RADIUS - 0.01, 0)]), 1);
fx('ownOpenness.bodyJustOutsideTheClearRadiusCounts',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, DV_CLEAR_RADIUS + 0.01, 0)]), 0);
fx('ownOpenness.sentOffIsSkippedByTheShippedFunction',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 0, { sentOff: true })]), 1);
fx('ownOpenness.theWorstBodyWins',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 10, 3), fxBody(2, 12, 1)]), 0.25);
fx('ownOpenness.beyondTheAimIsClampedToTheEnd — the closest point is the AIM, ten metres away',
  laneOpenness(LANE_FROM, LANE_TO, [fxBody(1, 30, 0)]), 1);
/* the POPULATION rule itself — the passer and the target are excluded BEFORE the call */
{
  const passer = fxBody(7, 0, 0);
  const target = fxBody(8, 20, 0);
  const mate = fxBody(9, 10, 0);
  const pop = [passer, target, mate].filter((q) => q.gid !== 7 && q.gid !== 8);
  fx('ownOpenness.populationExcludesPasserAndTarget', pop.map((q) => q.gid), [9]);
  fx('ownOpenness.populationOfOneBlockedMateIsZero', laneOpenness(LANE_FROM, LANE_TO, pop), 0);
  const empty = [passer, target].filter((q) => q.gid !== 7 && q.gid !== 8);
  fx('ownOpenness.withOnlyPasserAndTargetTheLaneIsWideOpen',
    laneOpenness(LANE_FROM, LANE_TO, empty), 1);
}
/* the CHOICE-TICK class rule and the carom presence rule */
fx('choiceClass.withAnArmRecordIsArm', choiceClassOf(true), 'arm');
fx('choiceClass.withoutOneIsRelease', choiceClassOf(false), 'release');
fx('caromPresence.notAnOccupant', caromPresenceOf(false, null), 'notInReleaseCorridor');
fx('caromPresence.presentAtArm', caromPresenceOf(true, 'present'), 'presentAtChoice');
fx('caromPresence.arrivedAfterArm', caromPresenceOf(true, 'arrived'), 'arrivedAfterChoice');
fx('caromPresence.releaseClassIsPresentByConstruction',
  caromPresenceOf(true, 'noWindup'), 'presentAtChoice');
/* the binning helpers on the openness grid, and the two ANCHORED gate edges */
fx('openBins.zeroIsTheFirstCell', binOf(0, OPEN_BIN_W, OPEN_BINS), 0);
fx('openBins.oneIsTheLastCell', binOf(1, OPEN_BIN_W, OPEN_BINS), OPEN_BINS - 1);
fx('openBins.pointThreeNine', binOf(0.39, OPEN_BIN_W, OPEN_BINS), 3);
fx('gates.the040EdgeIsTheChoosersOwn', GATE_040, 0.4);
fx('gates.the045EdgeIsTheChoosersOwn', GATE_045, 0.45);
fx('gainSign.backward', GSI(-1), 0);
fx('gainSign.level', GSI(0), 1);
fx('gainSign.forward', GSI(1), 2);
/* ⭐⭐ gShellFixtures — THE SHIPPED `groundShellHazard` CALLED on hand-built geometries, so the
   census's shell reading is PINNED and not merely described. SHELL = coreRadius + BALL_RADIUS,
   both read from the shipped constants (anchored at §3). */
const SHELL_M = PLAYER_CORE_RADIUS + BALL_RADIUS;
{
  const K = 7; const R = 8;      // the kicker's gid and the receiver's gid
  const own = (b: Player[]): readonly Player[][] => [b];
  fx('shell.emptyPitchDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, [], K, R), 0);
  fx('shell.bodyExactlyOnTheSegmentFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, 0)]), K, R), 1);
  fx('shell.bodyAShellWidthOffDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, SHELL_M)]), K, R), 0);
  fx('shell.bodyJustInsideTheShellFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, SHELL_M - 0.01)]), K, R), 1);
  fx('shell.theKickerNeverFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(K, 10, 0)]), K, R), 0);
  fx('shell.theReceiverNeverFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(R, 10, 0)]), K, R), 0);
  fx('shell.aBodyBEYONDTheAimDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 30, 0)]), K, R), 0);
  fx('shell.aBodyATTheAimDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 20, 0)]), K, R), 0);
  fx('shell.aBodyJustSHORTOfTheAimStillFires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 20 - SHELL_M - 0.05, 0)]), K, R), 1);
  fx('shell.aBodyINSIDEAShellOfTheAimDoesNotFire',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 20 - SHELL_M + 0.05, 0)]), K, R), 0);
  fx('shell.sentOffIsSkippedByTheShippedFunction',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 10, 0, { sentOff: true })]), K, R), 0);
  fx('shell.thereIsNO15mClearGuard — a body at the kicker\'s feet still fires',
    groundShellHazard(LANE_FROM, LANE_TO, own([fxBody(1, 0.5, 0)]), K, R), 1);
  /* ⭐⭐ OWN-ONLY vs OPPONENT-ONLY POPULATIONS — the calls the doc reads WHOSE body fired from */
  const ours = [fxBody(1, 10, 0)];
  const theirs = [fxBody(21, 15, 0)];
  fx('shell.bothPopulationsFireWhenOursIsOnTheLine',
    groundShellHazard(LANE_FROM, LANE_TO, [ours, theirs], K, R), 1);
  fx('shell.ownOnlyFiresOnOurOwnBody',
    groundShellHazard(LANE_FROM, LANE_TO, [ours], K, R), 1);
  fx('shell.oppOnlyIsClearWhenOnlyOursIsOnTheLine',
    groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 0)].slice(0, 0)], K, R), 0);
  fx('shell.oppOnlyFiresOnTheirBody',
    groundShellHazard(LANE_FROM, LANE_TO, [theirs], K, R), 1);
  fx('shell.ownOnlyIsClearWhenOnlyTheirsIsOnTheLine',
    groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 8)]], K, R), 0);
  fx('shell.theCombinedCallIsTheUnionOfTheTwo',
    groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 8)], theirs], K, R),
    Math.max(groundShellHazard(LANE_FROM, LANE_TO, [[fxBody(1, 10, 8)]], K, R),
      groundShellHazard(LANE_FROM, LANE_TO, [theirs], K, R)));
  /* the shell's own constants are the shipped ones */
  fx('shell.constantsAreTheShippedOnes', [BALL_RADIUS, PLAYER_CORE_RADIUS > 0], [0.11, true]);
}
/* ⭐⭐ THE PATH CLASSES on constructed ledger rows */
fx('path.untracedWhenNoRow', pathClassOf(false, 5, 5), 'untraced');
fx('path.untracedEvenIfTheGidsWouldAgree', pathClassOf(false, -1, 3), 'untraced');
fx('path.legacyChosenWhenChosenEqualsLegacy', pathClassOf(true, 4, 4), 'legacyChosen');
fx('path.legacyNoOptionWhenChosenIsMinusOne', pathClassOf(true, -1, 4), 'legacyNoOption');
fx('path.substitutedWhenTheyDiffer', pathClassOf(true, 6, 4), 'substituted');
fx('path.legacyIsTheTwoSubClasses', LEGACY_PATHS.map((c) => PTI(c)), [0, 1]);
fx('path.tracedIsEverythingButUntraced', TRACED_PATHS.map((c) => PTI(c)), [0, 1, 2]);
/* ⭐⭐ THE SUBSTITUTION'S DIRECTION on constructed openness pairs (the 0.4 gate ANCHORED) */
fx('subDir.intoOurOwnBodysLane', subDirOf(0.1, 0.9, GATE_040), 'into');
fx('subDir.outOfOne', subDirOf(0.9, 0.1, GATE_040), 'outOf');
fx('subDir.neitherWhenBothClear', subDirOf(0.9, 0.9, GATE_040), 'neither');
fx('subDir.neitherWhenBothBlocked', subDirOf(0.1, 0.1, GATE_040), 'neither');
fx('subDir.gateIsExclusiveBelow', subDirOf(GATE_040, 0.1, GATE_040), 'outOf');
fx('subDir.noLegacyLaneWhenTheArgmaxsBodyIsUnreadable',
  subDirOf(0.1, Number.NaN, GATE_040), 'noLegacyLane');
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
  snapshotLawAbsent: boolean; perceivedChoiceOn: boolean;
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
  /* --- ⭐⭐ LN-C1's OWN ADDITIONS: THE CHOICE TICK (never compared by G-REPRO-LNC1) --- */
  chClass: number[];
  chOwnOpenSum: number[]; chOppOpenSum: number[];
  chOwnOpenBins: number[][]; chOppOpenBins: number[][];
  chOwnBelow40: number[]; chOwnBelow45: number[];
  chOppBelow40: number[]; chOppBelow45: number[];
  chCorridorOcc: number[]; chCorridorOccTight: number[];
  chAlt: number[]; chAltCount: number[]; chAltGain: number[][]; chMates: number[];
  chFirstBody: number[][];
  chCaromByOwnBin: number[][]; chOppFirstByOppBin: number[][];
  chCarom: number[]; chCaromGeom: number[]; chCaromBlocked: number[];
  chCaromBlockedAlt: number[]; chCaromAlt: number[];
  chCaromPresence: number[][]; chOppBelow40First: number[]; chOppFirst: number[];
  /* --- ⭐⭐ LN-C2's OWN ADDITIONS: THE PATH, THE SHELL, THE LEDGER (indexed by the flat cell
     `k = CCI(choiceClass) * PATHS.length + PTI(pathClass)`) --- */
  cpPass: number[]; cpGeom: number[]; cpCarom: number[]; cpCaromGeom: number[];
  cpShellPass: number[]; cpShellCarom: number[]; cpShellOwn: number[]; cpShellOpp: number[];
  cpOwnOpenSum: number[]; cpOwnBelow40: number[];
  cpOwnBinShell: number[][]; cpCaromOwnBinShell: number[][]; cpFirstBody: number[][];
  cpSubDir: number[][]; cpShellLegacy: number[]; cpLegacyLane: number[]; cpLegacyBelow40: number[];
  cpCandidates: number[]; cpRead: number[]; cpSeenUnread: number[]; cpUnseen: number[];
  cpBlindRead: number[]; cpTargetAgrees: number[];
  cpAimRecord: number[]; cpAimFallback: number[];
  traceRowsWritten: number; traceOn: boolean;
  /* --- CONTEXT --- */
  goals: number; passes: number; passesCompleted: number; interceptions: number; shots: number;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, armedVersion: 0,
  worldOk: false, cushionOk: false, seamsAbsent: false, rcBfAbsent: false,
  genomeClean: false, ctbPlaneShut: false, emergentOn: false,
  snapshotLawAbsent: false, perceivedChoiceOn: false,
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
  chClass: zeros(CHOICE_CLASSES.length),
  chOwnOpenSum: zeros(CHOICE_CLASSES.length), chOppOpenSum: zeros(CHOICE_CLASSES.length),
  chOwnOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOwnBelow40: zeros(CHOICE_CLASSES.length), chOwnBelow45: zeros(CHOICE_CLASSES.length),
  chOppBelow40: zeros(CHOICE_CLASSES.length), chOppBelow45: zeros(CHOICE_CLASSES.length),
  chCorridorOcc: zeros(CHOICE_CLASSES.length),
  chCorridorOccTight: zeros(CHOICE_CLASSES.length),
  chAlt: zeros(CHOICE_CLASSES.length), chAltCount: zeros(CHOICE_CLASSES.length),
  chAltGain: zeros2(CHOICE_CLASSES.length, GAIN_SIGNS.length),
  chMates: zeros(CHOICE_CLASSES.length),
  chFirstBody: zeros2(CHOICE_CLASSES.length, CONTACTS.length),
  chCaromByOwnBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppFirstByOppBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chCarom: zeros(CHOICE_CLASSES.length), chCaromGeom: zeros(CHOICE_CLASSES.length),
  chCaromBlocked: zeros(CHOICE_CLASSES.length),
  chCaromBlockedAlt: zeros(CHOICE_CLASSES.length), chCaromAlt: zeros(CHOICE_CLASSES.length),
  chCaromPresence: zeros2(CHOICE_CLASSES.length, CAROM_PRESENCE.length),
  chOppBelow40First: zeros(CHOICE_CLASSES.length), chOppFirst: zeros(CHOICE_CLASSES.length),
  cpPass: zeros(CP_CELLS), cpGeom: zeros(CP_CELLS), cpCarom: zeros(CP_CELLS),
  cpCaromGeom: zeros(CP_CELLS),
  cpShellPass: zeros(CP_CELLS), cpShellCarom: zeros(CP_CELLS), cpShellOwn: zeros(CP_CELLS),
  cpShellOpp: zeros(CP_CELLS),
  cpOwnOpenSum: zeros(CP_CELLS), cpOwnBelow40: zeros(CP_CELLS),
  cpOwnBinShell: zeros2(CP_CELLS, OPEN_BINS * 2),
  cpCaromOwnBinShell: zeros2(CP_CELLS, OPEN_BINS * 2),
  cpFirstBody: zeros2(CP_CELLS, CONTACTS.length),
  cpSubDir: zeros2(CP_CELLS, SUB_DIRS.length), cpShellLegacy: zeros(CP_CELLS),
  cpLegacyLane: zeros(CP_CELLS), cpLegacyBelow40: zeros(CP_CELLS),
  cpCandidates: zeros(CP_CELLS), cpRead: zeros(CP_CELLS), cpSeenUnread: zeros(CP_CELLS),
  cpUnseen: zeros(CP_CELLS), cpBlindRead: zeros(CP_CELLS), cpTargetAgrees: zeros(CP_CELLS),
  cpAimRecord: zeros(CP_CELLS), cpAimFallback: zeros(CP_CELLS),
  traceRowsWritten: 0, traceOn: false,
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0,
});

/* ========================================================================== */
/* §9 THE WALK — public state per tick; NO WRAPPER                             */
/* ========================================================================== */
interface ArmBody { inWide: boolean; inTight: boolean; desig: Designation; action: string }
/** ⭐⭐ ONE ROW OF THE ENGINE'S OWN CHOICE LEDGER (`match.passChoiceTrace`), READ, never built. */
interface TraceRow {
  tick: number; passerGid: number; chosenGid: number; legacyGid: number;
  candidates: number; read: number; seenUnread: number; unseen: number;
  blindOutpricesRead: boolean;
}
interface Windup {
  key: string; gid: number; targetGid: number; eX: number; eY: number; carried: boolean;
  armTick: number; bodies: Map<number, ArmBody>;
  /** ⭐⭐ LN-C1: the CHOICE READ, taken AT THE ARM TICK — the choice tick for this class. */
  choice: ChoiceRead;
  /** ⭐⭐ LN-C2: the ledger row joined at THAT tick (the arm tick IS the decision tick). */
  trace: TraceRow | null;
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
  /** ⭐⭐ LN-C1: the choice-tick class and the choice read of record for this pass. */
  choiceClass: ChoiceClass; choice: ChoiceRead;
  /** ⭐⭐ LN-C2: the PATH class off the ledger, the choice read at THE STRIKE'S OWN AIM, the
   *  join receipts and the aim-record class. `choiceRec` is IDENTICAL to `choice` except on a
   *  RELEASE-class strike that carried a DLC lead record (`match.dxStrikeAim`), where LN-C1's
   *  inherited rule reads the target's BODY and this census reads the STRIKE'S OWN AIM. */
  pathClass: PathClass; choiceRec: ChoiceRead; trace: TraceRow | null;
  traced: boolean; targetAgrees: boolean; aimHasRecord: boolean;
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
    inSnapshotLaw?: boolean; edsPerceivedChoice?: boolean;
    traceChoice?: boolean;
    passChoiceTrace: readonly TraceRow[];
    dxStrikeAim: { gid: number; lead: { x: number; y: number }; tick: number } | null;
  };
  row.armedVersion = bqArmedVersion(m);
  row.traceOn = mm.traceChoice === true;
  row.worldOk = row.armedVersion === BQ_WORLD_VERSION;
  row.cushionOk = mm.bqCushion === true;
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true;
  row.rcBfAbsent = mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.ctbPlaneShut = mm.ctbSupportPlane !== true;
  row.emergentOn = emergentPosOn();
  /* ⭐⭐ LN-C1's OWN world conjuncts: the pass chooser reads the TRUTH team objects. */
  row.snapshotLawAbsent = mm.inSnapshotLaw !== true;
  row.perceivedChoiceOn = mm.edsPerceivedChoice === true;
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
  /** ⭐⭐ THE ENGINE'S OWN LEDGER, DRAINED PER TICK and indexed by (decision tick, passerGid) —
   *  the join key of record. ⛔ Nothing is written back; the sidecar is read only. */
  const traceByKey = new Map<string, TraceRow>();
  let traceSeen = 0;
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
    /* ⭐⭐ LN-C1 — THE CHOICE-TICK FACES, booked with the flight's own outcome. A pass with no
       launch line (LN-C0's `hasLine` false) carries NO choice geometry and enters no openness
       face; it is still counted in its class's pass count and in `chFirstBody`. */
    const ci = CCI(f.choiceClass);
    row.chClass[ci] += 1;
    row.chFirstBody[ci][CTI(f.firstBodyClass)] += 1;
    const ch = f.choice;
    const isCarom = f.firstBodyClass === 'ownNonTarget';
    const isOppFirst = f.firstBodyClass === 'opponent';
    if (isCarom) row.chCarom[ci] += 1;
    if (isOppFirst) row.chOppFirst[ci] += 1;
    if (Number.isFinite(ch.ownOpen) && Number.isFinite(ch.oppOpen)) {
      const ob = binOf(ch.ownOpen, OPEN_BIN_W, OPEN_BINS);
      const pb = binOf(ch.oppOpen, OPEN_BIN_W, OPEN_BINS);
      row.chOwnOpenSum[ci] += ch.ownOpen;
      row.chOppOpenSum[ci] += ch.oppOpen;
      row.chOwnOpenBins[ci][ob] += 1;
      row.chOppOpenBins[ci][pb] += 1;
      const blocked = ch.ownOpen < GATE_040;
      if (blocked) row.chOwnBelow40[ci] += 1;
      if (ch.ownOpen < GATE_045) row.chOwnBelow45[ci] += 1;
      if (ch.oppOpen < GATE_040) {
        row.chOppBelow40[ci] += 1;
        if (isOppFirst) row.chOppBelow40First[ci] += 1;
      }
      if (ch.oppOpen < GATE_045) row.chOppBelow45[ci] += 1;
      if (ch.occ) row.chCorridorOcc[ci] += 1;
      if (ch.occTight) row.chCorridorOccTight[ci] += 1;
      if (ch.alt) {
        row.chAlt[ci] += 1;
        row.chAltGain[ci][GSI(ch.altGainSign)] += 1;
      }
      row.chAltCount[ci] += ch.altCount;
      row.chMates[ci] += ch.mates;
      if (isCarom) {
        row.chCaromGeom[ci] += 1;
        row.chCaromByOwnBin[ci][ob] += 1;
        if (blocked) {
          row.chCaromBlocked[ci] += 1;
          if (ch.alt) row.chCaromBlockedAlt[ci] += 1;
        }
        if (ch.alt) row.chCaromAlt[ci] += 1;
        /* ⭐ the FIRST BODY's presence at the choice — LN-C0's split on the SAME body */
        const occ = f.occupants.find((o) => o.gid === f.firstBodyGid);
        row.chCaromPresence[ci][CPI(caromPresenceOf(
          occ !== undefined, occ === undefined ? null : occ.presence,
        ))] += 1;
      }
      if (isOppFirst) row.chOppFirstByOppBin[ci][pb] += 1;
    }
    /* ⭐⭐ LN-C2 — THE PATH × CHOICE-CLASS CELL, booked with the flight's own outcome. Every
       count below lives in exactly ONE cell `k`, so every published path face is a sum over a
       cell set and no count is copied. */
    const k = CPK(f.choiceClass, f.pathClass);
    const rec = f.choiceRec;
    row.cpPass[k] += 1;
    row.cpFirstBody[k][CTI(f.firstBodyClass)] += 1;
    if (isCarom) row.cpCarom[k] += 1;
    if (f.traced) {
      const t = f.trace as TraceRow;
      row.cpCandidates[k] += t.candidates;
      row.cpRead[k] += t.read;
      row.cpSeenUnread[k] += t.seenUnread;
      row.cpUnseen[k] += t.unseen;
      if (t.blindOutpricesRead) row.cpBlindRead[k] += 1;
      if (f.targetAgrees) row.cpTargetAgrees[k] += 1;
    }
    if (f.aimHasRecord) row.cpAimRecord[k] += 1; else row.cpAimFallback[k] += 1;
    if (Number.isFinite(rec.ownOpen) && Number.isFinite(rec.shell)) {
      row.cpGeom[k] += 1;
      const ob = binOf(rec.ownOpen, OPEN_BIN_W, OPEN_BINS);
      const sh = rec.shell > 0 ? 1 : 0;
      row.cpOwnOpenSum[k] += rec.ownOpen;
      row.cpOwnBinShell[k][ob * 2 + sh] += 1;
      if (rec.ownOpen < GATE_040) row.cpOwnBelow40[k] += 1;
      if (sh === 1) row.cpShellPass[k] += 1;
      if (rec.shellOwnOnly > 0) row.cpShellOwn[k] += 1;
      if (rec.shellOppOnly > 0) row.cpShellOpp[k] += 1;
      if (isCarom) {
        row.cpCaromGeom[k] += 1;
        row.cpCaromOwnBinShell[k][ob * 2 + sh] += 1;
        if (sh === 1) row.cpShellCarom[k] += 1;
      }
      /* ⭐⭐ THE SUBSTITUTION'S DIRECTION, and the LANE ARGMAX'S OWN candidate beside. */
      if (f.pathClass === 'substituted') {
        row.cpSubDir[k][SDI(subDirOf(rec.ownOpen, rec.legacyOwnOpen, GATE_040))] += 1;
        if (Number.isFinite(rec.legacyOwnOpen)) {
          row.cpLegacyLane[k] += 1;
          if (rec.shellLegacy > 0) row.cpShellLegacy[k] += 1;
          if (rec.legacyOwnOpen < GATE_040) row.cpLegacyBelow40[k] += 1;
        }
      }
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

    /* ---------- ⭐⭐ THE ENGINE'S CHOICE LEDGER, DRAINED (read-only) ---------- */
    {
      const tr = mm.passChoiceTrace;
      for (let i = traceSeen; i < tr.length; i++) {
        const e = tr[i];
        traceByKey.set(`${e.tick}:${e.passerGid}`, e);
      }
      traceSeen = tr.length;
      row.traceRowsWritten = tr.length;
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
      /* ⭐⭐ THE JOIN, AT THE ARM TICK — which is the DECISION tick for this class. */
      const armTrace = traceByKey.get(`${tick}:${rec.gid}`) ?? null;
      const armLegacyGid = armTrace === null ? null : armTrace.legacyGid;
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
        /* ⭐⭐ LN-C1 — THE CHOICE READ AT THE ARM TICK: the passer's OWN position at the tick
           he chose, toward the RECORD'S OWN AIM (never recomputed). */
        choice: armHasLine
          ? choiceReadOf(m, passer, rec.targetGid, eX, eY, armLegacyGid)
          : EMPTY_CHOICE,
        trace: armTrace,
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
      /* ⭐⭐ LN-C1 — THE CHOICE TICK, by the ENGINE'S OWN RULE (anchored at §3). `arm`: the
         record's own arm tick, whose read was taken THERE. `release`: the strike is on the
         decision tick, so the RELEASE TICK IS THE CHOICE TICK and the read is taken HERE, from
         the passer's own position toward the aim of record (PT-C0's E). */
      /* ⭐⭐ THE JOIN — (decision tick, passerGid). For the ARM class the row was joined at the
         ARM tick and travels on the wind-up record; for the RELEASE class the decision tick IS
         this tick. A pass with NO row is class UNTRACED — COUNTED, never imputed. */
      const relTrace = armRec !== null ? armRec.trace
        : (traceByKey.get(`${tick}:${rel.gid}`) ?? null);
      const relLegacyGid = relTrace === null ? null : relTrace.legacyGid;
      const pathClass = pathClassOf(
        relTrace !== null, relTrace?.chosenGid ?? -1, relTrace?.legacyGid ?? -1,
      );
      /* ⭐⭐ THE RECEIPT: the struck target must BE the ledger's own outcome. */
      const targetAgrees = relTrace !== null && (relTrace.chosenGid >= 0
        ? tGid === relTrace.chosenGid : tGid === relTrace.legacyGid);
      /* ⭐⭐ THE STRIKE'S OWN AIM RECORD (§CORR 3). ARM class: the wind-up record's own `aim` +
         `aimLead`, already read above. RELEASE class: the engine's `dxStrikeAim` deposit for
         THIS body at THIS tick (written by the ONE `dxWindupAim` fork when the argmax elected a
         displaced candidate and the strike carried it). ⛔ NEVER recomputed; where no record
         exists the class is COUNTED as `aim.bodyFallback` and the target's own position is
         used — LN-C1's inherited rule, declared. */
      const dxRec = mm.dxStrikeAim;
      const strikeLead = (armRec === null && dxRec !== null && dxRec.gid === rel.gid
        && dxRec.tick === tick) ? dxRec.lead : null;
      const aimHasRecord = armRec !== null || strikeLead !== null;
      const chClass = choiceClassOf(armRec !== null);
      const chRead: ChoiceRead = armRec !== null ? armRec.choice
        : (hasLine ? choiceReadOf(m, passer, tGid, eX, eY, relLegacyGid) : EMPTY_CHOICE);
      /* ⭐⭐ LN-C2's OWN read, at THE STRIKE'S OWN AIM. Identical to `chRead` unless a RELEASE
         strike carried a lead record, in which case the aim is the target's body PLUS the
         engine's own recorded displacement. LN-C1's `chRead` is kept UNCHANGED beside it so
         G-REPRO-LNC1 compares like with like, field for field. */
      const chReadRec: ChoiceRead = strikeLead === null ? chRead
        : (hasLine ? choiceReadOf(m, passer, tGid, eX + strikeLead.x, eY + strikeLead.y,
          relLegacyGid) : EMPTY_CHOICE);
      const f: GpFlight = {
        passerGid: rel.gid, passerSide, targetGid: tGid, releaseTick: tick, hasLine,
        contactSeen: false, firstBodyGid: null, firstBodyClass: 'none',
        occupants: [], oppOccupants: [], occTight: 0, oppTight: 0, hasArm: armRec !== null,
        choiceClass: chClass, choice: chRead,
        pathClass, choiceRec: chReadRec, trace: relTrace,
        traced: relTrace !== null, targetAgrees, aimHasRecord,
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
banner('LN-C2 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm × scratch-seed walks)`);

/* ==========================================================================
   ⭐⭐ gLockstep-TRACE — THE LEDGER IS BYTE-INERT, PROVED, NOT ASSUMED.
   `passChoiceTrace`'s own docblock says the sidecar is "read by nothing in the
   sim" (anchored at §3). This gate PROVES it: the SAME arm at the SAME scratch
   seed, once with `traceChoice: true` and once with `traceChoice: false`,
   produces an IDENTICAL whole-match signature — score, phase, ball, EVERY
   body's position / velocity / heading / stamina AND THE RNG STREAM STATE.
   ⛔ If it did not, the ledger would be a heuristic, not a ledger, and this
   census would be BLOCKED.
   ========================================================================== */
banner('LN-C2 — the TRACE-INERTNESS receipt (traced vs untraced, PER ARM)');
const lockstepTraceRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const traced = runOut(buildMatch(seed, armK, true));
  const untraced = runOut(buildMatch(seed, armK, false));
  const tracedRows = (traced as unknown as { passChoiceTrace: unknown[] }).passChoiceTrace.length;
  const untracedRows = (untraced as unknown as { passChoiceTrace: unknown[] })
    .passChoiceTrace.length;
  return {
    seed, arm: armK,
    tracedSignature: signatureOf(traced), untracedSignature: signatureOf(untraced),
    identical: signatureOf(traced) === signatureOf(untraced),
    tracedLedgerRows: tracedRows, untracedLedgerRows: untracedRows,
  };
}));
const LOCKSTEP_TRACE_OK = lockstepTraceRows.every((r) => r.identical)
  && lockstepTraceRows.every((r) => r.tracedLedgerRows > 0 && r.untracedLedgerRows === 0);
banner(`  gLockstepTrace ${LOCKSTEP_TRACE_OK ? 'GREEN' : 'RED'} `
  + `(${lockstepTraceRows.length} arm × scratch-seed traced/untraced pairs; ledger rows `
  + `${lockstepTraceRows.map((r) => r.tracedLedgerRows).join('/')} vs `
  + `${lockstepTraceRows.map((r) => r.untracedLedgerRows).join('/')})`);
if (!LOCKSTEP_TRACE_OK) {
  banner('LN-C2 FATAL — the choice ledger is NOT byte-inert: the census is BLOCKED (#391 item '
    + '4(i)). No battery seed is walked.');
  process.exit(4);
}

/* ========================================================================== */
/* §11 THE WORLD PIN — a constructed match of EACH arm at scratch 900,003,470   */
/* ========================================================================== */
const worldPin = ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as {
    bqCushion?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    inSnapshotLaw?: boolean; edsPerceivedChoice?: boolean; traceChoice?: boolean;
    bkGroundCorridor?: boolean; dxWindupAim?: boolean;
  };
  const untraced = buildMatch(WORLD_PIN_SEED, armK, false);
  const dvw = ([0, 1] as const).map((side) => (m.teams[side].effGenome as TacticalGenome & {
    dvExposureWeight?: number }).dvExposureWeight);
  return {
    seed: WORLD_PIN_SEED, arm: armK, bqArmedVersion: bqArmedVersion(m),
    traceChoiceOn: mm.traceChoice === true,
    traceChoiceOffOnTheUntracedTwin:
      (untraced as unknown as { traceChoice: boolean }).traceChoice === false,
    bkGroundCorridor: mm.bkGroundCorridor === true,
    dxWindupAim: mm.dxWindupAim === true,
    dvExposureWeightRead: dvw,
    bqCushion: mm.bqCushion === true,
    obmMovementAbsent: mm.obmMovement !== true,
    ctbSupportPlaneAbsent: mm.ctbSupportPlane !== true,
    rcBfAbsent: mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true,
    emergentPosOn: emergentPosOn(),
    snapshotLawAbsent: mm.inSnapshotLaw !== true,
    perceivedChoiceOn: mm.edsPerceivedChoice === true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.bqArmedVersion === BQ_WORLD_VERSION && w.bqCushion
  && w.obmMovementAbsent && w.ctbSupportPlaneAbsent && w.rcBfAbsent
  && w.snapshotLawAbsent && w.perceivedChoiceOn
  /* ⭐⭐ LN-C2's OWN world conjuncts: the ledger ARMED by construction (and OFF on the untraced
     twin), the SHELL's door open, and the world's `dvExposureWeight` READ off the effective
     genome as a RECEIPT — whatever it reads is what is stored. */
  && w.traceChoiceOn && w.traceChoiceOffOnTheUntracedTwin
  && w.bkGroundCorridor && w.dxWindupAim
  && w.dvExposureWeightRead.every((v) => v === CORRIDOR_WORLD_WEIGHT));
/** ⭐⭐ THE WEIGHT AS READ (never re-typed): the shell's price is `dvExposureWeight · hazard`. */
const DV_EXPOSURE_WEIGHT_READ = worldPin[0].dvExposureWeightRead[0];

/* ========================================================================== */
/* §12 THE BATTERY — the two arms PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const CHUNK = 25;
const runCore = (pass: number): { cells: Cell[]; receipt: Record<Arm, Row> } => {
  const out: Cell[] = [];
  banner(`LN-C2 — pass ${pass}: ${N} seeds × ${ARMS.length} arms, seeds `
    + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
  for (let start = 0; start < batterySeeds.length; start += CHUNK) {
    for (const seed of batterySeeds.slice(start, start + CHUNK)) {
      const rows = {} as Record<Arm, Row>;
      for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
      out.push({ seed, rows });
    }
    banner(`  … pass ${pass} ${Math.min(start + CHUNK, batterySeeds.length)}/`
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
banner(`  [ln-c2] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = runCore(2);
const digestB = coreDigest(coreB);
const X_DET = digestA === digestB;
banner(`  [ln-c2] pass 2 digest ${digestB} — X-DET ${X_DET ? 'PASS' : 'FAIL'}`);
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
banner(`  [ln-c2] X-FP-PROD ${X_FP_PROD ? 'PASS' : 'FAIL'} (${fpObserved.slice(0, 16)}…)`);

/* ==========================================================================
   ⭐ G-REPRO-LNC1 — LN-C0's OWN SEEDS 12,546,000–011, RE-WALKED ON THE E13 ARM
   and matched FIELD FOR FIELD against the COMMITTED artifact, over EVERY field
   the two instruments SHARE. ⛔ RE-WALKS, NOT CONSUMPTION.
   ========================================================================== */
const lnc1Disk = JSON.parse(readFileSync(LNC1_ARTIFACT, 'utf8')) as {
  perSeedCells: (Record<string, unknown> & { seed: number })[];
  hashedBodySha256: string;
};
const LNC1_FILE_SHA = sha(readFileSync(LNC1_ARTIFACT, 'utf8'));
/** ⚠ `wallMs` is a MACHINE TIMING, not a world quantity — the ONE shared field excluded,
 *  DECLARED. Every OTHER field LN-C0 stored that this census also computes is compared; the
 *  LN-C0 fields this census does NOT compute are LISTED in the artifact, never silently
 *  dropped. */
const REPRO_EXCLUDED_FIELDS = ['wallMs'] as const;
banner(`LN-C2 — G-REPRO-LNC1: re-walking LN-C0 seeds ${REPRO_LNC1_SEEDS[0]}–`
  + `${REPRO_LNC1_SEEDS[REPRO_LNC1_SEEDS.length - 1]} on the E13 arm...`);
const MY_ROW_KEYS = Object.keys(emptyRow());
const reproRows = REPRO_LNC1_SEEDS.map((seed) => {
  /* ⭐⭐ THE TRACE IS OFF FOR THE RE-WALK, so the world is LN-C1's BYTE FOR BYTE (#391 item
     4(viii)). `gLockstepTrace` proves the flag is inert anyway; this makes the comparison
     unconditional. */
  const got = walkMatch(buildMatch(seed, 'E13', false), 'E13', true) as unknown as
    Record<string, unknown>;
  const want = (lnc1Disk.perSeedCells.find((c) => c.seed === seed)?.E13 ?? null) as
    Record<string, unknown> | null;
  const shared = want === null ? [] : Object.keys(want)
    .filter((k) => MY_ROW_KEYS.includes(k))
    .filter((k) => !(REPRO_EXCLUDED_FIELDS as readonly string[]).includes(k));
  const notComputed = want === null ? [] : Object.keys(want).filter(
    (k) => !MY_ROW_KEYS.includes(k),
  );
  const mismatches = shared.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want![k]));
  return { seed, found: want !== null, fieldsCompared: shared.length, notComputed, mismatches };
});
const REPRO_FIELDS_COMPARED = reproRows.reduce((a, r) => a + r.fieldsCompared, 0);
const REPRO_MISMATCHES = reproRows.reduce((a, r) => a + r.mismatches.length, 0);
const REPRO_MIN_FIELDS = ['gpFlights', 'gpWithArm', 'gpNoArm', 'firstBody', 'occN',
  'passesWithOcc', 'causeN', 'causePresence', 'oppN', 'oppPresence'];
const REPRO_OK_LNC1 = reproRows.length === REPRO_LNC1_N
  && reproRows.every((r) => r.found && r.fieldsCompared > 0 && r.mismatches.length === 0)
  && REPRO_MIN_FIELDS.every((k) => MY_ROW_KEYS.includes(k));
banner(`  G-REPRO-LNC1 ${REPRO_OK_LNC1 ? 'GREEN' : 'RED'} — ${REPRO_FIELDS_COMPARED} field `
  + `comparisons, ${REPRO_MISMATCHES} mismatches`);

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


/* ========================================================================== */
/* ⭐⭐ LN-C1's OWN FACES — THE CHOICE TICK, THE TWO OPENNESSES, THE CAROM
   CONDITIONAL, THE MENU, AND THE OPPONENTS BESIDE                             */
/* ========================================================================== */
interface ClassView { key: string; idx: number[]; label: string }
const CLASS_VIEWS: ClassView[] = [
  { key: 'arm', idx: [CCI('arm')],
    label: 'the ARM class — a wind-up record exists; the ARM TICK IS THE CHOICE TICK' },
  { key: 'release', idx: [CCI('release')],
    label: 'the RELEASE class — no wind-up record; the strike is on the decision tick, so the '
      + 'RELEASE TICK IS THE CHOICE TICK' },
  { key: 'established', idx: [CCI('arm'), CCI('release')],
    label: 'BOTH ESTABLISHED classes pooled — the reads of record are stated here' },
  { key: 'none', idx: [CCI('none')],
    label: '⛔ THE COUNTED CLASS — no establishable choice tick (never imputed)' },
];
const sumIdx = (xs: readonly number[], idx: readonly number[]): number =>
  idx.reduce((a, i) => a + xs[i], 0);
const sumIdx2 = (xs: readonly (readonly number[])[], idx: readonly number[]): number =>
  idx.reduce((a, i) => a + sum(xs[i]), 0);
const sumIdxCell = (
  xs: readonly (readonly number[])[], idx: readonly number[], j: number,
): number => idx.reduce((a, i) => a + xs[i][j], 0);
/** the passes of a class that carry a CHOICE GEOMETRY (a launch line existed) — every
 *  openness face's own denominator, published as its own receipt face. */
const withGeom = (r: Row, idx: readonly number[]): number => sumIdx2(r.chOwnOpenBins, idx);

for (const v of CLASS_VIEWS) {
  defFace(`choice.${v.key}.passShare`, 'share',
    `⭐⭐ THE CHOICE-TICK CLASSES — the share of measured ground passes in ${v.label}`,
    'measured ground passes', (r) => sumIdx(r.chClass, v.idx), (r) => r.gpFlights);
  defFace(`choice.${v.key}.caromShare`, 'share',
    `P(first body = own NON-TARGET) inside ${v.key} — the visible carom, per class`,
    `${v.key}-class measured ground passes`,
    (r) => sumIdx(r.chCarom, v.idx), (r) => sumIdx(r.chClass, v.idx));
  defFace(`choice.${v.key}.opponentFirstShare`, 'share',
    `P(first body = OPPONENT) inside ${v.key} — published BESIDE, never read`,
    `${v.key}-class measured ground passes`,
    (r) => sumIdx(r.chOppFirst, v.idx), (r) => sumIdx(r.chClass, v.idx));
  defFace(`choice.${v.key}.geometryShare`, 'share',
    `⚠ A RECEIPT: the share of ${v.key}-class passes that carry a choice GEOMETRY (a launch `
    + 'line existed at the choice); the openness faces are stated on these',
    `${v.key}-class measured ground passes`,
    (r) => withGeom(r, v.idx), (r) => sumIdx(r.chClass, v.idx));
  if (v.key === 'none') continue;
  defFace(`choice.${v.key}.ownOpennessMean`, 'openness (0 = a body on the line, 1 = clear)',
    `⭐⭐ THE CHOSEN LANE'S OWN-OPENNESS at the choice tick — the SHIPPED \`laneOpenness\` `
    + 'CALLED with the OWN population (own outfield minus passer minus target), a DECLARED '
    + `RECONSTRUCTION, in ${v.key}`, `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chOwnOpenSum, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.opponentOpennessMean`,
    'openness (0 = a body on the line, 1 = clear)',
    `⭐⭐ THE SAME LANE'S OPPONENT-OPENNESS — WHAT THE CHOOSER SAW (the same population `
    + `predicate the chooser's own call uses), in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chOppOpenSum, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.ownOpenBelow40Share`, 'share',
    `⭐⭐ THE SHARE OF PASSES STRUCK WITH OWN-OPENNESS BELOW THE CHOOSER'S OWN 0.4 GATE at the `
    + `choice, in ${v.key}`, `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chOwnBelow40, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.ownOpenBelow45Share`, 'share',
    `the same at the chooser's SECOND anchored edge 0.45, in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chOwnBelow45, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.opponentOpenBelow40Share`, 'share',
    `⭐ THE CHOOSER'S OWN RISK GATE, MEASURED: the share struck with OPPONENT-openness below `
    + `0.4 at the choice, in ${v.key} (published BESIDE, never read)`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chOppBelow40, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.opponentOpenBelow45Share`, 'share',
    `the same at 0.45, in ${v.key}`, `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chOppBelow45, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.corridorOccupiedShare`, 'share',
    `⭐ THE SECOND MEMBERSHIP FACE for the same bodies: LN-C0's 4 m corridor (BN-C0's test) `
    + `occupied by an own outfield body at the CHOICE tick, in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chCorridorOcc, v.idx), (r) => withGeom(r, v.idx));
  defFace(`choice.${v.key}.corridorOccupiedTightShare`, 'share',
    `the same at the TIGHT (CONTROL_RADIUS) half-width — a BIN, in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chCorridorOccTight, v.idx), (r) => withGeom(r, v.idx));
  defFace(`menu.${v.key}.ownClearAlternativeShare`, 'share',
    `⭐⭐ THE MENU'S GEOMETRY (a DECLARED RECONSTRUCTION, ⛔ NOT the chooser's score): the `
    + 'share of passes at which SOME other own outfield mate carried a lane with own-openness '
    + `≥ 0.4 AND opponent-openness ≥ the chosen lane's, in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chAlt, v.idx), (r) => withGeom(r, v.idx));
  for (const gsn of GAIN_SIGNS) {
    defFace(`menu.${v.key}.bestAlternativeGain.${gsn}`, 'share',
      `the FORWARD-GAIN SIGN of the BEST such alternative (highest opponent-openness; ties to `
      + `the earlier index): ${gsn}. ⛔ PUBLISHED BESIDE, NEVER GATING`,
      `${v.key}-class passes with an alternative`,
      (r) => sumIdxCell(r.chAltGain, v.idx, GAIN_SIGNS.indexOf(gsn)),
      (r) => sumIdx(r.chAlt, v.idx));
  }
  defFace(`read.${v.key}.cBlockedShare`, 'share',
    `⭐⭐ THE READ-BEARING SHARE: of the CAROMS (first body = own non-target) with an `
    + `established choice tick in ${v.key}, the share whose chosen lane had own-openness < 0.4 `
    + 'AT THE CHOICE', `${v.key}-class caroms with a choice geometry`,
    (r) => sumIdx(r.chCaromBlocked, v.idx), (r) => sumIdx(r.chCaromGeom, v.idx));
  defFace(`read.${v.key}.aShare`, 'share',
    `⭐⭐ THE SECOND READ-BEARING SHARE: of those C-BLOCKED caroms, the share with `
    + `\`ownClearAlternativeAtLeastAsOpen\`, in ${v.key}`, `${v.key}-class C-blocked caroms`,
    (r) => sumIdx(r.chCaromBlockedAlt, v.idx), (r) => sumIdx(r.chCaromBlocked, v.idx));
  defFace(`carom.${v.key}.alternativeShare`, 'share',
    `beside: the share of ALL ${v.key} caroms with an own-clear alternative`,
    `${v.key}-class caroms with a choice geometry`,
    (r) => sumIdx(r.chCaromAlt, v.idx), (r) => sumIdx(r.chCaromGeom, v.idx));
  for (const cp of CAROM_PRESENCE) {
    defFace(`carom.${v.key}.presence.${cp}`, 'share',
      `⭐ LN-C0's present/arrived split for the FIRST BODY: ${cp}, in ${v.key}`,
      `${v.key}-class caroms with a choice geometry`,
      (r) => sumIdxCell(r.chCaromPresence, v.idx, CPI(cp)),
      (r) => sumIdx(r.chCaromGeom, v.idx));
  }
  defFace(`opponent.${v.key}.below40FirstShare`, 'share',
    `⭐ OPPONENTS BESIDE: P(first body = opponent | opponent-openness < 0.4 at the choice), `
    + `in ${v.key} — the starting table for the 「传到对面身上」 census`,
    `${v.key}-class passes struck with opponent-openness < 0.4`,
    (r) => sumIdx(r.chOppBelow40First, v.idx), (r) => sumIdx(r.chOppBelow40, v.idx));
  defFace(`receipt.${v.key}.matesExaminedPerPass`, 'own outfield mates per pass',
    `⚠ A RECEIPT: how many other own outfield mates the MENU examined per pass, in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chMates, v.idx), (r) => withGeom(r, v.idx));
  defFace(`receipt.${v.key}.alternativesPerPass`, 'qualifying alternatives per pass',
    `⚠ A RECEIPT: how many mates QUALIFIED as own-clear alternatives per pass, in ${v.key}`,
    `${v.key}-class passes with a choice geometry`,
    (r) => sumIdx(r.chAltCount, v.idx), (r) => withGeom(r, v.idx));
}
/** ⭐⭐ THE CAROM CONDITIONAL — P(first body = own non-target | own-openness BIN at the choice),
 *  on the ESTABLISHED classes, over the fine 0.1 grid. */
const EST_IDX = [CCI('arm'), CCI('release')];
for (let i = 0; i < OPEN_BINS; i++) {
  const lo = (i * OPEN_BIN_W).toFixed(1);
  const hi = ((i + 1) * OPEN_BIN_W).toFixed(1);
  defFace(`caromByOwnOpenness.bin${i}`, 'share',
    `⭐⭐ THE CAROM CONDITIONAL: P(first body = own non-target | own-openness at the choice in `
    + `[${lo}, ${hi})) — the last cell holds 1.0`,
    `passes with a choice geometry in own-openness bin ${i}`,
    (r) => sumIdxCell(r.chCaromByOwnBin, EST_IDX, i),
    (r) => sumIdxCell(r.chOwnOpenBins, EST_IDX, i));
  defFace(`opponentFirstByOpponentOpenness.bin${i}`, 'share',
    `⭐ OPPONENTS BESIDE: P(first body = opponent | opponent-openness at the choice in `
    + `[${lo}, ${hi}))`, `passes with a choice geometry in opponent-openness bin ${i}`,
    (r) => sumIdxCell(r.chOppFirstByOppBin, EST_IDX, i),
    (r) => sumIdxCell(r.chOppOpenBins, EST_IDX, i));
}
defFace('choice.noneShareOfCaroms', 'share',
  '⛔ THE COUNTED CLASS, PUBLISHED BESIDE EVERY READ: the share of ALL caroms whose pass had '
  + 'NO establishable choice tick', 'all caroms',
  (r) => r.chCarom[CCI('none')], (r) => sum(r.chCarom));
defFace('choice.establishedShareOfCaroms', 'share',
  'the complement: the share of all caroms WITH an established choice tick', 'all caroms',
  (r) => sumIdx(r.chCarom, EST_IDX), (r) => sum(r.chCarom));

/* ==========================================================================
   ⭐⭐ LN-C2's OWN FACES — THE PATH, THE SHELL, THE OWN-OPENNESS CELLS, THE
   SUBSTITUTION'S DIRECTION, THE MENU AND THE LEDGER RECEIPTS. Every one is a
   sum over a CELL SET of the flat `k = choiceClass × pathClass` grid, so no
   count is copied and every face carries its own numerator and denominator.
   ========================================================================== */
interface PathView { key: string; paths: readonly PathClass[]; label: string }
const PATH_VIEWS: PathView[] = [
  { key: 'legacy', paths: LEGACY_PATHS,
    label: '⭐⭐ LEGACY — the ledger says `chosenGid === -1` OR `chosenGid === legacyGid`: the '
      + 'target IS the lane argmax\'s (the pricer that carries the SHELL)' },
  { key: 'legacyChosen', paths: ['legacyChosen'],
    label: 'LEGACY, the perceived chooser AGREED (`chosenGid === legacyGid`)' },
  { key: 'legacyNoOption', paths: ['legacyNoOption'],
    label: 'LEGACY-NO-OPTION — `chosenGid === -1`: no EXECUTABLE option, the legacy target '
      + 'stands (a sub-class of LEGACY, stored separately)' },
  { key: 'substituted', paths: ['substituted'],
    label: '⭐⭐ SUBSTITUTED — `chosenGid >= 0 AND !== legacyGid`: the PERCEIVED pricer replaced '
      + 'the target (a pricer with neither a lane nor an own-body term)' },
  { key: 'untraced', paths: ['untraced'],
    label: '⛔ UNTRACED — no ledger row for (decision tick, passerGid). COUNTED, never imputed' },
  { key: 'traced', paths: TRACED_PATHS,
    label: 'TRACED — every pass with a joined ledger row' },
  { key: 'all', paths: PATHS, label: 'ALL measured ground passes of the class' },
];
const TRACED_VIEW_KEYS = ['legacy', 'legacyChosen', 'legacyNoOption', 'substituted', 'traced'];
interface ScopeView { key: string; classes: readonly ChoiceClass[] }
const SCOPE_VIEWS: ScopeView[] = [
  { key: 'established', classes: ESTABLISHED },
  { key: 'arm', classes: ['arm'] },
  { key: 'release', classes: ['release'] },
];
/** the COARSE own-openness cells — the anchored 0.4 gate, on the fine 0.1 grid's own edges. */
const OPEN_CELLS = [
  { key: 'b00to01', bins: [0], label: '[0.0, 0.1) — a body ON the line' },
  { key: 'b01to04', bins: [1, 2, 3], label: '[0.1, 0.4) — inside the chooser\'s own 0.4 gate' },
  { key: 'b04to10', bins: [4, 5, 6, 7, 8, 9], label: '[0.4, 1.0] — at or above the gate' },
];
const cpNum = (xs: readonly number[], idx: readonly number[]): number => sumIdx(xs, idx);
const cpCells = (
  xs: readonly (readonly number[])[], idx: readonly number[], js: readonly number[],
): number => js.reduce((a, j) => a + sumIdxCell(xs, idx, j), 0);

for (const sv of SCOPE_VIEWS) {
  const allIdx = cpIdx(sv.classes, PATHS);
  const subIdx = cpIdx(sv.classes, ['substituted']);
  const tracedIdx = cpIdx(sv.classes, TRACED_PATHS);
  for (const pv of PATH_VIEWS) {
    const idx = cpIdx(sv.classes, pv.paths);
    defFace(`path.${sv.key}.${pv.key}.passShare`, 'share',
      `⭐⭐ THE PATH CLASS, off the ENGINE'S OWN LEDGER — the share of ${sv.key}-class measured `
      + `ground passes whose target was chosen by: ${pv.label}`,
      `${sv.key}-class measured ground passes`,
      (r) => cpNum(r.cpPass, idx), (r) => cpNum(r.cpPass, allIdx));
    defFace(`path.${sv.key}.${pv.key}.caromShareOfCaroms`, 'share',
      `⭐⭐ THE SAME PATH'S SHARE OF THE CAROMS (first body = own non-target), in ${sv.key}`,
      `${sv.key}-class caroms`,
      (r) => cpNum(r.cpCarom, idx), (r) => cpNum(r.cpCarom, allIdx));
    defFace(`path.${sv.key}.${pv.key}.caromRate`, 'share',
      `⭐⭐ P(first body = own non-target | path) — the carom rate INSIDE this path, in ${sv.key}`,
      `${sv.key}-class passes on this path`,
      (r) => cpNum(r.cpCarom, idx), (r) => cpNum(r.cpPass, idx));
    defFace(`path.${sv.key}.${pv.key}.geometryShare`, 'share',
      `⚠ A RECEIPT: the share of this path's ${sv.key}-class passes carrying a choice GEOMETRY `
      + '(a launch line at the choice); every shell and openness face is stated on these',
      `${sv.key}-class passes on this path`,
      (r) => cpNum(r.cpGeom, idx), (r) => cpNum(r.cpPass, idx));
    defFace(`shell.${sv.key}.${pv.key}.firedShare`, 'share',
      `⭐⭐ THE SHELL AT THE CHOICE — \`groundShellHazard(passer.pos, aim, [team.players, `
      + `opp.players], passer.gid, target.gid)\` CALLED on the STRUCK lane: the share that FIRED, `
      + `in ${sv.key} on this path`, `${sv.key}-class passes on this path with a choice geometry`,
      (r) => cpNum(r.cpShellPass, idx), (r) => cpNum(r.cpGeom, idx));
    defFace(`shell.${sv.key}.${pv.key}.ownOnlyShare`, 'share',
      `⭐⭐ THE SAME SHELL CALL WITH \`[team.players]\` ALONE — OUR OWN body fired it, in `
      + `${sv.key} on this path`, `${sv.key}-class passes on this path with a choice geometry`,
      (r) => cpNum(r.cpShellOwn, idx), (r) => cpNum(r.cpGeom, idx));
    defFace(`shell.${sv.key}.${pv.key}.oppOnlyShare`, 'share',
      `the same call with \`[opp.players]\` alone — THEIR body fired it, in ${sv.key} on this `
      + 'path', `${sv.key}-class passes on this path with a choice geometry`,
      (r) => cpNum(r.cpShellOpp, idx), (r) => cpNum(r.cpGeom, idx));
    defFace(`shell.${sv.key}.${pv.key}.caromGivenShellFired`, 'share',
      `⭐⭐ P(carom | the shell FIRED at the choice, path) in ${sv.key}`,
      `${sv.key}-class passes on this path whose shell fired`,
      (r) => cpNum(r.cpShellCarom, idx), (r) => cpNum(r.cpShellPass, idx));
    defFace(`shell.${sv.key}.${pv.key}.caromGivenShellClear`, 'share',
      `P(carom | the shell was CLEAR at the choice, path) in ${sv.key} — beside it`,
      `${sv.key}-class passes on this path whose shell was clear`,
      (r) => cpNum(r.cpCaromGeom, idx) - cpNum(r.cpShellCarom, idx),
      (r) => cpNum(r.cpGeom, idx) - cpNum(r.cpShellPass, idx));
    defFace(`shell.${sv.key}.${pv.key}.firedShareOnCaroms`, 'share',
      `⭐⭐ THE READ-BEARING FORM: of THIS PATH'S CAROMS, the share whose struck lane had the `
      + `shell FIRING at the choice, in ${sv.key}`,
      `${sv.key}-class caroms on this path with a choice geometry`,
      (r) => cpNum(r.cpShellCarom, idx), (r) => cpNum(r.cpCaromGeom, idx));
    defFace(`open.${sv.key}.${pv.key}.ownOpennessMean`,
      'openness (0 = a body on the line, 1 = clear)',
      `⭐ THE STRUCK LANE'S OWN-OPENNESS at the choice (LN-C1's CALLED reconstruction, `
      + `inherited), meaned over this path in ${sv.key}`,
      `${sv.key}-class passes on this path with a choice geometry`,
      (r) => cpNum(r.cpOwnOpenSum, idx), (r) => cpNum(r.cpGeom, idx));
    defFace(`open.${sv.key}.${pv.key}.ownOpenBelow40Share`, 'share',
      `⭐ the share below the chooser's OWN anchored 0.4 gate, on this path in ${sv.key}`,
      `${sv.key}-class passes on this path with a choice geometry`,
      (r) => cpNum(r.cpOwnBelow40, idx), (r) => cpNum(r.cpGeom, idx));
    if (TRACED_VIEW_KEYS.includes(pv.key)) {
      defFace(`menu.${sv.key}.${pv.key}.candidatesPerPass`, 'candidates per traced pass',
        `⭐ THE MENU THE PERCEIVED CHOOSER SAW: \`candidates\` per pass, on this path in `
        + `${sv.key}`, `${sv.key}-class traced passes on this path`,
        (r) => cpNum(r.cpCandidates, idx), (r) => cpNum(r.cpPass, idx));
      for (const [fieldKey, pick] of [
        ['read', (r: Row) => cpNum(r.cpRead, idx)],
        ['seenUnread', (r: Row) => cpNum(r.cpSeenUnread, idx)],
        ['unseen', (r: Row) => cpNum(r.cpUnseen, idx)],
      ] as const) {
        defFace(`menu.${sv.key}.${pv.key}.${fieldKey}PerPass`, 'options per traced pass',
          `the menu's \`${fieldKey}\` option count per pass (the ledger's own \`infoClass\` `
          + `composition), on this path in ${sv.key}`,
          `${sv.key}-class traced passes on this path`,
          pick, (r) => cpNum(r.cpPass, idx));
      }
      defFace(`menu.${sv.key}.${pv.key}.blindOutpricesReadShare`, 'share',
        `the ledger's own \`blindOutpricesRead\` rate on this path in ${sv.key}`,
        `${sv.key}-class traced passes on this path`,
        (r) => cpNum(r.cpBlindRead, idx), (r) => cpNum(r.cpPass, idx));
    }
  }
  /* ⭐⭐ THE LEDGER RECEIPTS */
  defFace(`trace.${sv.key}.joinShare`, 'share',
    `⭐⭐ THE JOIN RATE — the share of ${sv.key}-class measured ground passes joined to a ledger `
    + 'row by (decision tick, passerGid)', `${sv.key}-class measured ground passes`,
    (r) => cpNum(r.cpPass, tracedIdx), (r) => cpNum(r.cpPass, allIdx));
  defFace(`trace.${sv.key}.targetAgreesShare`, 'share',
    `⭐⭐ THE GATED RECEIPT — of the joined ${sv.key}-class passes, the share whose STRUCK target `
    + 'gid equals the ledger\'s own outcome (`chosenGid` when ≥ 0, else `legacyGid`)',
    `${sv.key}-class traced passes`,
    (r) => cpNum(r.cpTargetAgrees, tracedIdx), (r) => cpNum(r.cpPass, tracedIdx));
  defFace(`trace.${sv.key}.noOptionShare`, 'share',
    `the ledger's \`chosenGid === -1\` rate over ${sv.key}-class TRACED passes`,
    `${sv.key}-class traced passes`,
    (r) => cpNum(r.cpPass, cpIdx(sv.classes, ['legacyNoOption'])),
    (r) => cpNum(r.cpPass, tracedIdx));
  defFace(`aim.${sv.key}.recordShare`, 'share',
    `⭐⭐ THE AIM OF RECORD — the share of ${sv.key}-class passes whose aim came from the `
    + 'ENGINE\'S OWN record (the wind-up record\'s `aim` + `aimLead`, or `match.dxStrikeAim`\'s '
    + 'lead on a synchronous strike)', `${sv.key}-class measured ground passes`,
    (r) => cpNum(r.cpAimRecord, allIdx), (r) => cpNum(r.cpPass, allIdx));
  defFace(`aim.${sv.key}.bodyFallbackShare`, 'share',
    `⛔ THE DECLARED FALLBACK, COUNTED: the share of ${sv.key}-class passes with NO strike-aim `
    + 'record, whose aim is the target\'s own position (LN-C1\'s inherited rule)',
    `${sv.key}-class measured ground passes`,
    (r) => cpNum(r.cpAimFallback, allIdx), (r) => cpNum(r.cpPass, allIdx));
  /* ⭐⭐ THE SUBSTITUTION'S DIRECTION */
  for (const d of SUB_DIRS) {
    defFace(`substitution.${sv.key}.${d}Share`, 'share',
      `⭐⭐ DID THE SUBSTITUTION MOVE THE BALL INTO OUR OWN BODY'S LANE OR OUT OF ONE — \`${d}\` `
      + `(\`into\` = struck own-openness < 0.4 AND the lane argmax's candidate's ≥ 0.4; `
      + `\`outOf\` = the reverse; \`neither\` = both sides of the gate agree; \`noLegacyLane\` = `
      + `the argmax's own body carried no readable lane), in ${sv.key}`,
      `${sv.key}-class SUBSTITUTED passes with a choice geometry`,
      (r) => cpCells(r.cpSubDir, subIdx, [SDI(d)]), (r) => cpNum(r.cpGeom, subIdx));
  }
  defFace(`substitution.${sv.key}.legacyLaneReadableShare`, 'share',
    `⚠ A RECEIPT: the share of ${sv.key}-class SUBSTITUTED passes whose lane argmax's own `
    + 'candidate carried a readable lane (a DECLARED reconstruction — the argmax\'s aim is not '
    + 'recorded, so the legacy lane is `passer.pos → legacyGid\'s body at the choice`)',
    `${sv.key}-class SUBSTITUTED passes with a choice geometry`,
    (r) => cpNum(r.cpLegacyLane, subIdx), (r) => cpNum(r.cpGeom, subIdx));
  defFace(`substitution.${sv.key}.shellFiredLegacyShare`, 'share',
    `⭐⭐ \`shellFiredLegacy\` — the SAME shipped shell CALLED on the LANE ARGMAX'S OWN `
    + `candidate's lane at the choice, in ${sv.key}`,
    `${sv.key}-class SUBSTITUTED passes with a readable legacy lane`,
    (r) => cpNum(r.cpShellLegacy, subIdx), (r) => cpNum(r.cpLegacyLane, subIdx));
  defFace(`substitution.${sv.key}.legacyOwnOpenBelow40Share`, 'share',
    `the lane argmax's candidate's OWN-OPENNESS below the 0.4 gate, in ${sv.key}`,
    `${sv.key}-class SUBSTITUTED passes with a readable legacy lane`,
    (r) => cpNum(r.cpLegacyBelow40, subIdx), (r) => cpNum(r.cpLegacyLane, subIdx));
}
/* ⭐⭐ THE CROSS TABLE — own-openness CELL × shellFired × path, on the ESTABLISHED classes. */
for (const pv of PATH_VIEWS) {
  const idx = cpIdx(ESTABLISHED, pv.paths);
  for (const cell of OPEN_CELLS) {
    for (const shf of [0, 1] as const) {
      const js = cell.bins.map((b) => b * 2 + shf);
      defFace(`cell.${pv.key}.${cell.key}.shell${shf}.share`, 'share',
        `⭐⭐ THE CROSS TABLE — the share of this path's passes whose struck lane had `
        + `own-openness in ${cell.label} AND the shell ${shf === 1 ? 'FIRING' : 'CLEAR'} at the `
        + 'choice (established classes)',
        'established-class passes on this path with a choice geometry',
        (r) => cpCells(r.cpOwnBinShell, idx, js), (r) => cpNum(r.cpGeom, idx));
      defFace(`cell.${pv.key}.${cell.key}.shell${shf}.caromRate`, 'share',
        `P(carom | own-openness ${cell.label}, shell ${shf}, path) — established classes`,
        'established-class passes on this path in this cell',
        (r) => cpCells(r.cpCaromOwnBinShell, idx, js),
        (r) => cpCells(r.cpOwnBinShell, idx, js));
    }
  }
}
/* ⭐⭐ THE READ-BEARING SHARES — S and F, and the UNTRACED class beside them. */
for (const sv of SCOPE_VIEWS) {
  const tracedCaromIdx = cpIdx(sv.classes, TRACED_PATHS);
  const legacyIdx = cpIdx(sv.classes, LEGACY_PATHS);
  const subIdx = cpIdx(sv.classes, ['substituted']);
  defFace(`read.${sv.key}.sShare`, 'share',
    '⭐⭐ S — of C (the TRACED caroms with a choice geometry: first body = own non-target, a '
    + `ledger row joined), the share whose target was chosen by the SUBSTITUTED path, in `
    + `${sv.key}`, `${sv.key}-class traced caroms with a choice geometry`,
    (r) => cpNum(r.cpCaromGeom, subIdx), (r) => cpNum(r.cpCaromGeom, tracedCaromIdx));
  defFace(`read.${sv.key}.fShare`, 'share',
    '⭐⭐ F — of the LEGACY-path caroms, the share whose struck lane had `shellFired` = 1 at the '
    + `choice, in ${sv.key}`, `${sv.key}-class LEGACY-path caroms with a choice geometry`,
    (r) => cpNum(r.cpShellCarom, legacyIdx), (r) => cpNum(r.cpCaromGeom, legacyIdx));
  defFace(`read.${sv.key}.untracedShareOfAllCaroms`, 'share',
    '⛔ THE UNTRACED CLASS, PRINTED BESIDE EVERY READ SENTENCE: its share of ALL caroms of the '
    + `class, in ${sv.key}`, `${sv.key}-class caroms`,
    (r) => cpNum(r.cpCarom, cpIdx(sv.classes, ['untraced'])),
    (r) => cpNum(r.cpCarom, cpIdx(sv.classes, PATHS)));
  defFace(`read.${sv.key}.untracedShareOfAllPasses`, 'share',
    `the same class's share of ALL measured ground passes, in ${sv.key}`,
    `${sv.key}-class measured ground passes`,
    (r) => cpNum(r.cpPass, cpIdx(sv.classes, ['untraced'])),
    (r) => cpNum(r.cpPass, cpIdx(sv.classes, PATHS)));
}
defFace('trace.rowsWrittenPerMatch', 'ledger rows per match',
  '⚠ A RECEIPT: how many rows the engine\'s own `passChoiceTrace` held at the end of the match '
  + '(EVERY perceived-choice decision, not only the ones that became a measured ground pass)',
  'matches', (r) => r.traceRowsWritten, ONE);

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
  if (f === undefined) { banner(`LN-C2 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
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
  if (dd === undefined) { banner(`LN-C2 FATAL — unknown Δ ${faceKey}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 THE PRE-REGISTERED READS — #390 item 4(v)'s SENTENCES, VERBATIM.
   Let C = the CAROMS (first body = own non-target) with an ESTABLISHED choice tick.
   `cBlockedShare` = the share of C whose chosen lane had own-openness < 0.4 AT THE CHOICE;
   `aShare` = the share of the C-BLOCKED caroms carrying `ownClearAlternativeAtLeastAsOpen`.
   The SELECTORS are STORED booleans (`> 0.5`). The READ OF RECORD is selected on the E13 arm;
   D13's own selection is printed BESIDE with an AGREEMENT boolean, and the frozen rule is
   ALSO applied to each ESTABLISHED CLASS TAKEN ALONE (the counterfactual words). canon,
   VERBATIM: "a counterfactual verdict sentence ('had X been scored, the rule would read W')
   quotes a word the instrument STORED by applying the frozen rule to X's stored interval; a
   universal sentence about a table ('every bin', 'the one bin') is a stored boolean or is not
   written".                                                                                  */
/* ========================================================================== */
const READ_WORDS = {
  perceivedChooser: 'THE CAROM COMES THROUGH THE PERCEIVED CHOOSER — the own-body seam belongs '
    + 'in the perceived pricer; LN-T2 is re-formed there.',
  shellOverridden: 'THE SHELL FIRED AND WAS OVERRIDDEN — the price exists and is too small; '
    + 'LN-T2 is the shell\'s WEIGHT, not a new term.',
  bodyOutsideTheShell: 'THE BODY STOOD OUTSIDE THE SHELL — a GRADED own-body term in the lane '
    + 'weight is named; LN-T2 as first formed.',
} as const;
type ReadKey = keyof typeof READ_WORDS;
const AGREE_SENTENCE = {
  agrees: 'THE DOSED WORLD AGREES ON THE READ',
  disagrees: 'THE DOSED WORLD DISAGREES ON THE READ',
};
/** ⭐⭐ THE FROZEN RULE, in ONE place, applied to every arm and every scope (#391 item 4(vii)). */
const readKeyOf = (sShare: number, fShare: number): ReadKey => {
  if (sShare > 0.5) return 'perceivedChooser';
  return fShare > 0.5 ? 'shellOverridden' : 'bodyOutsideTheShell';
};
interface ReadCell {
  arm: Arm; armLabel: string; scope: string;
  sShare: number; sNumerator: number; sDenominator: number;
  fShare: number; fNumerator: number; fDenominator: number;
  sGreaterThanHalf: boolean; fGreaterThanHalf: boolean;
  readKey: ReadKey; sentence: string;
  untracedShareOfAllCaroms: number;
}
const readCell = (armK: Arm, scope: string): ReadCell => {
  const sf = face(`read.${scope}.sShare`, armK);
  const ff = face(`read.${scope}.fShare`, armK);
  const key = readKeyOf(sf.value, ff.value);
  return {
    arm: armK, armLabel: ARM_LABEL[armK], scope,
    sShare: sf.value, sNumerator: sf.numerator, sDenominator: sf.denominator,
    fShare: ff.value, fNumerator: ff.numerator, fDenominator: ff.denominator,
    sGreaterThanHalf: sf.value > 0.5, fGreaterThanHalf: ff.value > 0.5,
    readKey: key, sentence: READ_WORDS[key],
    untracedShareOfAllCaroms: face(`read.${scope}.untracedShareOfAllCaroms`, armK).value,
  };
};
const READ_SCOPES = ['established', 'arm', 'release'] as const;
const READS: Record<string, ReadCell> = {};
for (const armK of ARMS) {
  for (const scope of READ_SCOPES) READS[`${armK}.${scope}`] = readCell(armK, scope);
}
const READ_OF_RECORD = READS['E13.established'];
const DOSED_READ = READS['D13.established'];
const DOSED_AGREES = READ_OF_RECORD.readKey === DOSED_READ.readKey;
const AGREE_WORD = DOSED_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees;
const READ_LIST = [READ_OF_RECORD.sentence, AGREE_WORD];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form                                      */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised half-widths on the E13 arm, read
 *  out of the smoke artifact's own `faces[].halfWidth` fields — never re-typed from the
 *  console's rounded print. ⚠ TRANSCRIBED BEFORE THE FREEZE; the arithmetic below is the
 *  instrument's own. */
const SMOKE_HW_S = 0.09452201933404941;
const SMOKE_HW_F = 0.2222222222222222;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised half-widths (seeds
 *  900,003,400–411), read out of the smoke artifact's own `faces[].halfWidth` fields on the
 *  E13 arm — never re-typed from the console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'read.established.sShare@E13',
    group: '⭐⭐ THE FIRST READ-BEARING SHARE — S (the SUBSTITUTED share of the traced caroms) '
      + 'on the ESTABLISHED classes, arm E13',
    hwSmoke: SMOKE_HW_S, target: 0.05 },
  { face: 'read.established.fShare@D13 (⚠ E13\'s realised half-width is DEGENERATE at 12 '
      + 'clusters — 0 of 11 legacy caroms, so every bootstrap draw is 0 and no variance can be '
      + 'read from it; the CONSERVATIVE, LARGER D13 half-width is used instead and the '
      + 'substitution is a declared §DEVIATION)',
    group: '⭐⭐ THE SECOND READ-BEARING SHARE — F (the LEGACY-path caroms whose shell fired) '
      + 'on the ESTABLISHED classes, arm E13',
    hwSmoke: SMOKE_HW_F, target: 0.05 },
];
/** ⭐⭐ N = min(the largest `nRequired`, the block's affordance) — WHICH BRANCH BOUND IT is
 *  STORED, never left to a reader. */
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, nFrozen: N_FROZEN,
  };
});
const N_REQUIRED_MAX = Math.max(...sizingRows.map((r) => r.nRequired));
const N_BOUND_BY = N_FROZEN === Math.min(N_REQUIRED_MAX, BLOCK_AFFORDS)
  ? (N_REQUIRED_MAX <= BLOCK_AFFORDS ? 'the SIZING (N = max nRequired)'
    : 'the BLOCK\'s affordance (the sizing asked for more than the block holds)')
  : 'MISMATCH — the frozen N is not min(required, affordance)';
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0)
  && N_FROZEN === Math.min(N_REQUIRED_MAX, BLOCK_AFFORDS);

/* ==========================================================================
   ⭐⭐ THE CODE FACTS — ANCHORED SITES *AND* WHOLE-FUNCTION TEXT HASHES.
   #391 item 3(v), the LESSON OF RECORD: "a code read anchored at the sites one
   already believes in is a confirmation, not a census — LN-C1's `gCodeFact`
   proved eleven true anchors and missed the twelfth line of the same function.
   Future code-fact booleans are derived from the WHOLE function body (a hash of
   the function's text, anchored) beside the named sites."
   ⇒ A CODE FACT IS WRITTEN ONLY IF THE ANCHORS *AND* THE FOUR FUNCTION HASHES
   ARE GREEN. ⚠ THESE ARE CODE READS, NOT MEASUREMENTS.
   ========================================================================== */
const CODE_FACT_ANCHORS = ANCHORS.filter((a) => a.what.includes('CODE FACT')
  || a.what.startsWith('⭐⭐ THE GROUND CANDIDATE')
  || a.what.includes('THE LEDGER') || a.what.startsWith('⭐⭐ STRIKE SITE'));
const CODE_FACT_ANCHORS_OK = CODE_FACT_ANCHORS.length >= 11
  && CODE_FACT_ANCHORS.every((a) => a.occurrences.length === a.want);
const FN_HASHES_DISTINCT = new Set(FN_TEXTS.map((f) => f.sha256)).size === FN_TEXTS.length;
const CODE_FACT_OK = CODE_FACT_ANCHORS_OK && FN_TEXTS_OK && FN_HASHES_DISTINCT
  && FN_TEXTS.length === 4;

/* ==========================================================================
   ⭐ THE LOO RECEIPT — LEAVE-ONE-OUT on EVERY READ-BEARING SHARE (BQ-T1's
   conservative point-shift form, #346/#348, applied to a THRESHOLD instead of an
   interval): drop each seed, re-derive the POINT share, and count a FLIP when the
   frozen `> 0.5` selector changes. ⚠ A RECEIPT — it gates no direction.
   ========================================================================== */
interface LooRow {
  face: string; arm: Arm; scope: string; value: number; threshold: number;
  looMaxInfluenceShare: number; looFlips: number; looMinValue: number; looMaxValue: number;
  seedsDropped: number;
}
const looFor = (faceKey: string, armK: Arm, scope: string): LooRow => {
  const f = FACES[faceKey];
  const nu = cells.map((c) => f.num(c.rows[armK]));
  const de = cells.map((c) => f.dn(c.rows[armK]));
  const tN = sum(nu); const tD = sum(de);
  const point = ratio(tN, tD);
  let maxInf = 0; let flips = 0;
  let lo = Number.POSITIVE_INFINITY; let hi = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < cells.length; i++) {
    const v = ratio(tN - nu[i], tD - de[i]);
    if (!Number.isFinite(v)) continue;
    if (v < lo) lo = v;
    if (v > hi) hi = v;
    const inf = Math.abs(v - point) / Math.max(Math.abs(point), 1e-12);
    if (inf > maxInf) maxInf = inf;
    if ((point > 0.5) !== (v > 0.5)) flips += 1;
  }
  return { face: faceKey, arm: armK, scope, value: point, threshold: 0.5,
    looMaxInfluenceShare: maxInf, looFlips: flips, looMinValue: lo, looMaxValue: hi,
    seedsDropped: cells.length };
};
const LOO_ROWS: LooRow[] = ARMS.flatMap((armK) => READ_SCOPES.flatMap((scope) => [
  looFor(`read.${scope}.sShare`, armK, scope),
  looFor(`read.${scope}.fShare`, armK, scope),
]));
const LOO_OK = LOO_ROWS.every((r) => Number.isFinite(r.looMaxInfluenceShare)
  && Number.isInteger(r.looFlips)) && LOO_ROWS.length === ARMS.length * READ_SCOPES.length * 2;

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
  chClass: number[]; chOwnOpenBins: number[][]; chOppOpenBins: number[][];
  chCaromByOwnBin: number[][]; chOppFirstByOppBin: number[][];
  chCaromPresence: number[][]; chAltGain: number[][]; chFirstBody: number[][];
  cpPass: number[]; cpCarom: number[]; cpGeom: number[]; cpCaromGeom: number[];
  cpShellPass: number[]; cpShellCarom: number[];
  cpOwnBinShell: number[][]; cpCaromOwnBinShell: number[][]; cpFirstBody: number[][];
  cpSubDir: number[][];
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
  chClass: zeros(CHOICE_CLASSES.length),
  chOwnOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppOpenBins: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chCaromByOwnBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chOppFirstByOppBin: zeros2(CHOICE_CLASSES.length, OPEN_BINS),
  chCaromPresence: zeros2(CHOICE_CLASSES.length, CAROM_PRESENCE.length),
  chAltGain: zeros2(CHOICE_CLASSES.length, GAIN_SIGNS.length),
  chFirstBody: zeros2(CHOICE_CLASSES.length, CONTACTS.length),
  cpPass: zeros(CP_CELLS), cpCarom: zeros(CP_CELLS), cpGeom: zeros(CP_CELLS),
  cpCaromGeom: zeros(CP_CELLS), cpShellPass: zeros(CP_CELLS), cpShellCarom: zeros(CP_CELLS),
  cpOwnBinShell: zeros2(CP_CELLS, OPEN_BINS * 2),
  cpCaromOwnBinShell: zeros2(CP_CELLS, OPEN_BINS * 2),
  cpFirstBody: zeros2(CP_CELLS, CONTACTS.length), cpSubDir: zeros2(CP_CELLS, SUB_DIRS.length),
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
    addInto(p.chClass, r.chClass);
    addInto2(p.chOwnOpenBins, r.chOwnOpenBins); addInto2(p.chOppOpenBins, r.chOppOpenBins);
    addInto2(p.chCaromByOwnBin, r.chCaromByOwnBin);
    addInto2(p.chOppFirstByOppBin, r.chOppFirstByOppBin);
    addInto2(p.chCaromPresence, r.chCaromPresence); addInto2(p.chAltGain, r.chAltGain);
    addInto2(p.chFirstBody, r.chFirstBody);
    addInto(p.cpPass, r.cpPass); addInto(p.cpCarom, r.cpCarom); addInto(p.cpGeom, r.cpGeom);
    addInto(p.cpCaromGeom, r.cpCaromGeom); addInto(p.cpShellPass, r.cpShellPass);
    addInto(p.cpShellCarom, r.cpShellCarom);
    addInto2(p.cpOwnBinShell, r.cpOwnBinShell);
    addInto2(p.cpCaromOwnBinShell, r.cpCaromOwnBinShell);
    addInto2(p.cpFirstBody, r.cpFirstBody); addInto2(p.cpSubDir, r.cpSubDir);
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

/** ⭐ THE PUBLISHED LEDGER, QUOTED (#390 item 7) — the frontier and the consumed intervals. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'LN-C0 battery block (#388 item 2)', range: [12_544_000, 12_544_999] },
  { name: 'LN-T1 battery block (#389 item 4)', range: [12_545_000, 12_545_999] },
  { name: 'LN-C1 battery block (#390 item 4)', range: [12_546_000, 12_546_999] },
];
const PUBLISHED_FRONTIER_AT_391 = 12_547_000;
const SEED_DISJOINT = BLOCK_BASE === PUBLISHED_FRONTIER_AT_391
  && CONSUMED.every((c) => BLOCK_TOP < c.range[0] || BLOCK_BASE > c.range[1])
  && (IS_OVERRIDE
    ? walkedSeeds.every((s) => s >= 900_000_000) && RECEIPT_SEED >= 900_000_000
    : walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED))
  && ALL_SCRATCH.every((s) => s >= 900_000_000)
  && REPRO_LNC1_SEEDS.every((s) => s >= 12_546_000 && s <= 12_546_999);
const TWO_FRACTIONS_OK = faces.every((f) => Number.isFinite(f.numerator)
  && Number.isFinite(f.denominator)
  && (f.denominator === 0 ? Number.isNaN(f.value) : f.value === f.numerator / f.denominator));

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.cushionOk
      && r.seamsAbsent && r.rcBfAbsent && r.genomeClean && r.ctbPlaneShut && r.emergentOn
      && r.snapshotLawAbsent && r.perceivedChoiceOn && r.traceOn))
      && WORLD_PIN_OK && EMERGENT_POS_ON,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\` (which itself asserts world 12's five `
      + 'doors, world 11\'s corridor price and the RA gene PINS on both effective genomes — '
      + 'the gene set as world 13 pins it); `bqCushion` TRUE; the two step-② seams ABSENT '
      + '(`obmMovement` and `ctbSupportPlane` both !== true — this is the census of the lane '
      + 'AS IT STANDS); every RC/BF flag ABSENT (`rcAnticipate`, `rcReady`, `bfFacingCost`); '
      + '`info.genome` clean of the RA / corridor / RC / CTB / OBM genes (canon: dose '
      + 'placement, #270.2 / #334 item 1); and `emergentPosOn()` TRUE, so `formationSpot` '
      + `takes the ${FORMATION_SPOT_PATH}. `
      + '⭐⭐ AND — LN-C1\'s OWN CONJUNCT — `inSnapshotLaw` is ABSENT (its default-off line is anchored) while `edsPerceivedChoice` is TRUE, so '
      + 'the pass chooser reads the TRUTH team objects: the census\'s opponent population IS '
      + 'the chooser\'s own `opp.players`, and the audit\'s ⑤ (the truth reads) is untouched '
      + `by this census. Pinned again on a CONSTRUCTED match of each arm at scratch seed `
      + `${WORLD_PIN_SEED}. The composer is CALLED, never copied. `
      + '⭐⭐ AND — LN-C2\'s OWN CONJUNCTS — `traceChoice` is TRUE on every walked match (passed '
      + 'EXPLICITLY on the construction, never through the `EDS_TRACE_CHOICE` env, which §1 '
      + 'REFUSES) and FALSE on the untraced lockstep twin; `bkGroundCorridor` and `dxWindupAim` '
      + 'are OPEN (world 12\'s own doors, so the SHELL price is live and the strike-aim record '
      + `is written); and the world's \`dvExposureWeight\` is READ off the constructed match's `
      + `EFFECTIVE genome as a RECEIPT — it reads ${DV_EXPOSURE_WEIGHT_READ} on both sides of `
      + 'both arms',
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
      && tot(armK, (r) => r.oppN) > 0
      && tot(armK, (r) => r.chClass[CCI('arm')]) > 0
      && tot(armK, (r) => r.chClass[CCI('release')]) > 0
      && tot(armK, (r) => sumIdx(r.chCaromGeom, EST_IDX)) > 0
      && tot(armK, (r) => sumIdx(r.chCaromBlocked, EST_IDX)) > 0
      && tot(armK, (r) => sumIdx(r.chAlt, EST_IDX)) > 0
      && tot(armK, (r) => sumIdx(r.chOppBelow40, EST_IDX)) > 0
      /* ⭐⭐ LN-C2's OWN classes */
      && tot(armK, (r) => cpNum(r.cpPass, cpIdx(ESTABLISHED, LEGACY_PATHS))) > 0
      && tot(armK, (r) => cpNum(r.cpPass, cpIdx(ESTABLISHED, ['substituted']))) > 0
      && tot(armK, (r) => cpNum(r.cpPass, cpIdx(ESTABLISHED, ['untraced']))) > 0
      && tot(armK, (r) => cpNum(r.cpCaromGeom, cpIdx(ESTABLISHED, TRACED_PATHS))) > 0
      && tot(armK, (r) => cpNum(r.cpCaromGeom, cpIdx(ESTABLISHED, LEGACY_PATHS))) > 0
      && tot(armK, (r) => cpNum(r.cpShellPass, cpIdx(ESTABLISHED, PATHS))) > 0
      && tot(armK, (r) => cpNum(r.cpGeom, cpIdx(ESTABLISHED, PATHS))
        - cpNum(r.cpShellPass, cpIdx(ESTABLISHED, PATHS))) > 0
      && tot(armK, (r) => cpNum(r.cpLegacyLane, cpIdx(ESTABLISHED, ['substituted']))) > 0),
    note: '⛔ no face is computed on an empty class: EVERY arm has measured ground passes (E13 '
      + `${tot('E13', (r) => r.gpFlights)}, D13 ${tot('D13', (r) => r.gpFlights)}), own lane `
      + `occupants (E13 ${tot('E13', (r) => sum(r.causeN))}, D13 `
      + `${tot('D13', (r) => sum(r.causeN))}), DESIGNATED occupants (E13 `
      + `${tot('E13', (r) => r.causeN[LCI('L1')])}, D13 `
      + `${tot('D13', (r) => r.causeN[LCI('L1')])}), dup-run PAIRS (E13 `
      + `${tot('E13', (r) => r.pairsTotal)}, D13 ${tot('D13', (r) => r.pairsTotal)}), 撞车 `
      + `ticks (E13 ${tot('E13', (r) => r.crashHits)}, D13 ${tot('D13', (r) => r.crashHits)}) `
      + `and OPPONENTS in the lane (E13 ${tot('E13', (r) => r.oppN)}, D13 `
      + `${tot('D13', (r) => r.oppN)}); ⭐⭐ AND LN-C1's OWN classes are all non-empty on both `
      + `arms — ARM-class passes (E13 ${tot('E13', (r) => r.chClass[CCI('arm')])}), `
      + `RELEASE-class passes (E13 ${tot('E13', (r) => r.chClass[CCI('release')])}), CAROMS `
      + `with an established choice tick (E13 `
      + `${tot('E13', (r) => sumIdx(r.chCaromGeom, EST_IDX))}), C-BLOCKED caroms (E13 `
      + `${tot('E13', (r) => sumIdx(r.chCaromBlocked, EST_IDX))}), passes with an own-clear `
      + `ALTERNATIVE (E13 ${tot('E13', (r) => sumIdx(r.chAlt, EST_IDX))}) and passes struck `
      + `with opponent-openness < 0.4 (E13 `
      + `${tot('E13', (r) => sumIdx(r.chOppBelow40, EST_IDX))}). `
      + '⚠ LIVENESS only — never a direction, never a magnitude. ⭐⭐ AND LN-C2\'s OWN classes '
      + `are all non-empty on both arms: LEGACY-path passes (E13 ${
        tot('E13', (r) => cpNum(r.cpPass, cpIdx(ESTABLISHED, LEGACY_PATHS)))}), SUBSTITUTED (E13 `
      + `${tot('E13', (r) => cpNum(r.cpPass, cpIdx(ESTABLISHED, ['substituted'])))}), UNTRACED `
      + `(E13 ${tot('E13', (r) => cpNum(r.cpPass, cpIdx(ESTABLISHED, ['untraced'])))}), TRACED `
      + `CAROMS (E13 ${tot('E13', (r) => cpNum(r.cpCaromGeom, cpIdx(ESTABLISHED, TRACED_PATHS)))}`
      + `), LEGACY-path caroms (E13 ${
        tot('E13', (r) => cpNum(r.cpCaromGeom, cpIdx(ESTABLISHED, LEGACY_PATHS)))}), passes whose `
      + `SHELL FIRED (E13 ${tot('E13', (r) => cpNum(r.cpShellPass, cpIdx(ESTABLISHED, PATHS)))}) `
      + `and SUBSTITUTED passes with a readable legacy lane (E13 ${
        tot('E13', (r) => cpNum(r.cpLegacyLane, cpIdx(ESTABLISHED, ['substituted'])))})`,
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
        && walksBooked === (N_FROZEN + 1) * ARMS.length * 2
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length * 2
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + `the construction receipt lie inside block ${BLOCK_BASE}–${BLOCK_TOP}, each seed is `
      + `walked ONCE PER ARM (${ARMS.length} arms) in EACH of the TWO X-DET passes ⇒ `
      + `${walksBooked} walks booked, the unwalked tail is `
      + 'DECLARED in the `seeds` block, and EVERY scratch seed this instrument walks (the '
      + 'lockstep pair and the world pin) is out-of-band and STORED there — canon, VERBATIM: '
      + '"verifier scratch walks use the stage\'s own consumed band or the out-of-band scratch '
      + 'range (≥ 900,000,000) — never the next virgin block"',
  },
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
  gCodeFact: {
    ok: CODE_FACT_OK,
    note: '⭐⭐ THE CODE FACTS — ANCHORED SITES *AND* WHOLE-FUNCTION TEXT HASHES (#391 item '
      + `3(v)'s lesson of record). ${CODE_FACT_ANCHORS.length} code-fact anchors were found at `
      + 'their pinned occurrence counts — the GC seat and its `gcBodies = [team.players, '
      + 'opp.players]`, the `sGc` subtraction itself, `groundShellHazard`\'s shell / fire test / '
      + 'kicker / receiver lines, the perceived chooser\'s candidate enumeration, its `scope` '
      + 'construction, its substitution line `if (chosen) passMate = chosen;` and its distance '
      + 'band, the ledger\'s ONE write site with `chosenGid` / `legacyGid` / `tick`, and EVERY '
      + 'STRIKE SITE OF THE POPULATION (the arm, the led synchronous release, the to-feet '
      + `release, the cutback, the through ball and the kickoff play-back). AND the ${
        FN_TEXTS.length} WHOLE-FUNCTION TEXTS were extracted by anchored start/end needles and `
      + `hashed: ${FN_TEXTS.map((f) => `${f.name} ${f.lines} lines ${f.sha256.slice(0, 12)}…`)
        .join(' · ')}. The code-fact BOOLEANS are DERIVED FROM THOSE WHOLE TEXTS and STORED `
      + '(`codeFact.facts`); the doc QUOTES each function so a reader can see every term. ⛔ If '
      + 'any anchor or any extraction had failed, this gate would be RED and no code fact would '
      + 'be written',
  },
  gChoiceTickRule: {
    ok: ARMS.every((armK) => allRows(armK).every(
      (r) => sum(r.chClass) === r.gpFlights
        && r.chClass[CCI('arm')] === r.gpWithArm
        && r.chClass[CCI('release')] === r.gpNoArm
        && r.chClass[CCI('none')] === 0
        && CHOICE_CLASSES.every((_, i) => sum(r.chFirstBody[i]) === r.chClass[i])
        && r.chCaromPresence.every((x, i) => sum(x) === r.chCaromGeom[i])
        && r.chClass.every((_, i) => r.chCaromGeom[i] <= r.chCarom[i])
        && r.chCaromBlocked.every((v, i) => v <= r.chCaromGeom[i])
        && r.chCaromBlockedAlt.every((v, i) => v <= r.chCaromBlocked[i])
        /* ⭐⭐ LN-C2: the PATH × CLASS grid is a PARTITION of the same passes */
        && sum(r.cpPass) === r.gpFlights
        && CHOICE_CLASSES.every((c) => cpNum(r.cpPass, cpIdx([c], PATHS)) === r.chClass[CCI(c)])
        && CONTACTS.every((_, j) => sumIdxCell(r.cpFirstBody, cpIdx(CHOICE_CLASSES, PATHS), j)
          === r.firstBody[j])
        && r.cpGeom.every((v, k) => v <= r.cpPass[k])
        && r.cpCaromGeom.every((v, k) => v <= r.cpCarom[k])
        && r.cpShellCarom.every((v, k) => v <= r.cpCaromGeom[k] && v <= r.cpShellPass[k])
        && r.cpShellPass.every((v, k) => v <= r.cpGeom[k])
        && r.cpLegacyLane.every((v, k) => v <= r.cpGeom[k])
        && r.cpShellLegacy.every((v, k) => v <= r.cpLegacyLane[k])
        && r.cpTargetAgrees.every((v, k) => v <= r.cpPass[k])
        && r.cpPass.every((v, k) => r.cpAimRecord[k] + r.cpAimFallback[k] === v)
        && r.cpSubDir.every((x, k) => sum(x) === r.cpGeom[k]
          || PATHS[k % PATHS.length] !== 'substituted')
        && r.cpOwnBinShell.every((x, k) => sum(x) === r.cpGeom[k]),
    )),
    note: '⭐⭐ THE CHOICE TICK IS THE ENGINE\'S OWN RULE, ASSERTED PER WALKED MATCH: every '
      + 'measured ground pass is classified exactly once; the ARM class is EXACTLY LN-C0\'s '
      + '`gpWithArm` (a wind-up record was resolved for this passer and target — and the brain '
      + 'calls `armPendingPass` synchronously at its own decision tick, anchored) and the '
      + 'RELEASE class is EXACTLY LN-C0\'s `gpNoArm` (every remaining strike path is a '
      + 'SYNCHRONOUS call from the same brain decision — `performPass` at PlayerBrain l.1686 / '
      + 'l.1687 and `performCutback` at l.1628, all anchored — so the strike is ON the '
      + 'decision tick and the RELEASE TICK IS THE CHOICE TICK). ⛔ The COUNTED class '
      + '(`none`) is stored on every row and is empty BY THE ENGINE\'S RULE, never by '
      + 'imputation. Every carom partition is inside its own class',
  },
  gSeedDisjoint: {
    ok: SEED_DISJOINT,
    note: 'SEED-DISJOINT against the PUBLISHED ledger: the block base equals the frontier of '
      + `record at #391 item 7 (${PUBLISHED_FRONTIER_AT_391}); the block `
      + `${BLOCK_BASE}–${BLOCK_TOP} is disjoint from every quoted consumed interval `
      + `(${CONSUMED.map((c) => `${c.name} ${c.range[0]}–${c.range[1]}`).join(' · ')}); every `
      + 'battery seed and the construction receipt lie inside the block; every scratch seed '
      + 'this instrument walks is ≥ 900,000,000 — canon, VERBATIM: "verifier scratch walks use '
      + 'the stage\'s own consumed band or the out-of-band scratch range (≥ 900,000,000) — '
      + 'never the next virgin block" (an OVERRIDE run walks the scratch band instead of the '
      + 'block, and this gate demands exactly that); and ⭐ the G-REPRO-LNC1 seeds lie inside '
      + 'LN-C0\'s OWN already-consumed block and are DECLARED RE-WALKS, not consumption',
  },
  gReproLnc1: {
    ok: REPRO_OK_LNC1,
    note: `⭐⭐ G-REPRO-LNC1 — LN-C0's OWN seeds ${REPRO_LNC1_SEEDS[0]}–`
      + `${REPRO_LNC1_SEEDS[REPRO_LNC1_N - 1]} RE-WALKED on the E13 arm and matched FIELD FOR `
      + `FIELD against the COMMITTED artifact (${LNC1_ARTIFACT}, file byte-hash `
      + `${LNC1_FILE_SHA}): ${REPRO_FIELDS_COMPARED} field comparisons over every field the `
      + `two instruments SHARE, ${REPRO_MISMATCHES} mismatches. The first-body channel, the `
      + 'pass counts (`gpFlights` / `gpWithArm` / `gpNoArm`), the corridor occupancy and the '
      + 'presence split are all inside that set, and the ONE excluded shared field is '
      + `\`${REPRO_EXCLUDED_FIELDS.join('`, `')}\` (a machine timing). ⛔ RE-WALKS, NOT `
      + 'CONSUMPTION',
  },
  gTwoFractions: {
    ok: TWO_FRACTIONS_OK,
    note: 'EVERY published face carries its own NUMERATOR and DENOMINATOR and its value is '
      + `exactly their ratio (or NaN on an empty denominator): ${faces.length} face rows, of `
      + `which ${faces.filter((f) => f.unit === 'share').length} are shares. The doc's tables `
      + 'print both',
  },
  gLoo: {
    ok: LOO_OK,
    note: '⭐ LEAVE-ONE-OUT on EVERY READ-BEARING SHARE (both `cBlockedShare` and `aShare`, on '
      + `both arms and all ${READ_SCOPES.length} scopes ⇒ ${LOO_ROWS.length} rows): drop each `
      + 'seed, re-derive the POINT share, and count a FLIP when the frozen `> 0.5` selector '
      + 'changes. The rows are STORED with their min/max leave-one-out values. ⚠ A RECEIPT — '
      + 'it gates no direction, and the doc\'s LOO sentence is scoped to the rows it covers',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms × 2 X-DET passes. N was SIZED: `
        + `max(nRequired) = ${N_REQUIRED_MAX}, the block affords ${BLOCK_AFFORDS}, and `
        + `N = min(the two) = ${N_FROZEN} — BOUND BY ${N_BOUND_BY}`,
  },
  gLockstepTrace: {
    ok: LOCKSTEP_TRACE_OK,
    note: '⭐⭐ THE LEDGER IS BYTE-INERT, PROVED. `passChoiceTrace`\'s own docblock says the '
      + 'sidecar is "read by nothing in the sim" (anchored at §3); this gate walks the SAME arm '
      + 'at the SAME out-of-band scratch seed TWICE — once with `traceChoice: true` and once '
      + 'with `traceChoice: false` — and the whole-match signatures (score, phase, ball, every '
      + 'body\'s position / velocity / heading / stamina AND THE RNG STREAM STATE) are '
      + `IDENTICAL on all ${lockstepTraceRows.length} arm × seed pairs, while the ledger itself `
      + `held ${lockstepTraceRows.map((r) => r.tracedLedgerRows).join(' / ')} rows on the traced `
      + `walks and ${lockstepTraceRows.map((r) => r.untracedLedgerRows).join(' / ')} on the `
      + 'untraced ones. ⛔ Had they differed the census would have STOPPED before any battery '
      + 'seed: the ledger would be a heuristic, not a ledger',
  },
  gTraceJoin: {
    ok: ARMS.every((armK) => {
      const j = face('trace.established.joinShare', armK);
      const a = face('trace.established.targetAgreesShare', armK);
      return j.numerator > 0 && a.denominator > 0 && a.numerator === a.denominator;
    }),
    note: '⭐⭐ THE JOIN AND ITS RECEIPT: every measured ground pass is joined to the engine\'s '
      + 'own ledger row by (DECISION TICK, passerGid) — the arm tick for the ARM class, the '
      + 'release tick for the RELEASE class. THE JOIN RATE IS A RECEIPT, never a filter: a pass '
      + 'with no row is class UNTRACED and is COUNTED (its share of all passes and of all '
      + `caroms is published). joinShare E13 ${
        face('trace.established.joinShare', 'E13').value.toFixed(6)} (${
        face('trace.established.joinShare', 'E13').numerator}/${
        face('trace.established.joinShare', 'E13').denominator}) · D13 ${
        face('trace.established.joinShare', 'D13').value.toFixed(6)}. ⭐⭐ AND THE GATED `
      + 'RECEIPT: the STRUCK target gid EQUALS the ledger\'s own outcome (`chosenGid` when ≥ 0, '
      + `else \`legacyGid\`) on ${face('trace.established.targetAgreesShare', 'E13').numerator}/${
        face('trace.established.targetAgreesShare', 'E13').denominator} joined E13 passes and ${
        face('trace.established.targetAgreesShare', 'D13').numerator}/${
        face('trace.established.targetAgreesShare', 'D13').denominator} on D13`,
  },
  gShellFixtures: {
    ok: FIXTURES.filter((f) => f.name.startsWith('shell.') || f.name.startsWith('path.')
      || f.name.startsWith('subDir.')).every((f) => f.ok),
    note: `⭐⭐ THE SHIPPED \`groundShellHazard\` CALLED ON HAND-BUILT GEOMETRIES — ${
      FIXTURES.filter((f) => f.name.startsWith('shell.')).length} shell fixtures: a body EXACTLY `
      + 'on the segment inside the shell FIRES; a body a SHELL-WIDTH off does NOT (and one just '
      + 'inside it does); the KICKER and the RECEIVER never fire; a body BEYOND the aim, AT the '
      + 'aim and a shell SHORT of it do not; a `sentOff` body is skipped INSIDE the shipped '
      + 'function; there is NO 1.5 m clear-the-kicker guard (a body at the kicker\'s feet still '
      + 'fires — the shell is not `laneOpenness`); and the OWN-ONLY and OPPONENT-ONLY '
      + 'populations fire independently, their union being the combined call. The shell is '
      + `\`coreRadius + BALL_RADIUS\` = ${SHELL_M} m from the shipped constants. Beside them, ${
        FIXTURES.filter((f) => f.name.startsWith('path.')
          || f.name.startsWith('subDir.')).length} fixtures pin the PATH classes and the `
      + 'SUBSTITUTION DIRECTION rule branch by branch',
  },
  gFnTexts: {
    ok: FN_TEXTS_OK && FN_HASHES_DISTINCT,
    note: `⭐⭐ THE FOUR WHOLE-FUNCTION TEXTS, EXTRACTED AND HASHED (#391 item 3(v)): ${
      FN_TEXTS.map((f) => `\`${f.name}\` (${f.file} l.${f.startLine}–${f.endLine}, ${f.chars} `
        + `chars, sha256 ${f.sha256})`).join(' · ')}. Each is taken from an ANCHORED START `
      + 'NEEDLE to an ANCHORED END NEEDLE, the start needle occurring exactly ONCE in its file; '
      + 'the `contains` probes stored beside each hash are what the doc\'s "what it reads and '
      + 'does NOT read" sentences quote',
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
  'codeFact', 'choiceTick', 'menu', 'loo', 'reproLnc1', 'xDet', 'xFpProd',
  'pathClasses', 'theShell', 'theLedger', 'lockstepTrace', 'functionTexts',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'LN-C2',
    titleLnC1Inherited: '「传球者看得见自己人吗」 THE PASSER\'S-SIDE LANE CENSUS — at the moment the '
      + 'passer CHOSE, how often was one of his own men already in the lane he picked '
      + '(`laneOpenness` CALLED with the OWN population, a declared reconstruction), beside '
      + 'what the chooser actually saw (the same lane\'s OPPONENT-openness), and how often an '
      + 'own-clear lane at least as open to opponents existed instead; on world 13 EMPTY-BOOK '
      + '(E13, the read of record) and DOSED (D13) arms paired on shared seeds',
    title: '「谁选的接球人，他看见了谁」 THE CHOOSER-PATH CENSUS — BY WHICH PATH was each '
      + 'struck pass\'s target chosen (the engine\'s own `passChoiceTrace` ledger: LEGACY / '
      + 'LEGACY-NO-OPTION / SUBSTITUTED / UNTRACED), HAD THE SHELL FIRED on the struck lane at '
      + 'the choice (`groundShellHazard` CALLED, the shipped function), and WHERE did our own '
      + 'body stand (LN-C1\'s own-openness CALLED reconstruction, inherited); on world 13 '
      + 'EMPTY-BOOK (E13, the read of record) and DOSED (D13) arms paired on shared seeds',
    doc: 'docs/world-model/LN-C2-CHOOSER-PATH-CENSUS.md',
    lnC1Doc: 'docs/world-model/LN-C1-PASSER-LANE-CENSUS.md',
    lineage: 'PT-C0 (the population and the `ball.lastTouch` FIRST-BODY channel, byte for '
      + 'byte) → BN-C0 (the corridor membership test) → LN-C0 (#388 item 2: the walker, the '
      + 'wind-up ARM-tick channel, the cause classes, the estimator and the hash order) → LN-T1 '
      + '(#389 item 4: X-DET, X-FP-PROD and the LOO receipt) → LN-C1 (#390 item 4: the '
      + 'choice-tick rule, the own-openness CALLED reconstruction, the menu geometry and the '
      + 'first-body channel, REUSED and anchored) → #391 item 4 (this census)',
    censusFormOfRecord: 'docs/world-model/LN-C0-LANE-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #391 item 4 (the lane arc\'s fourth stage, the chooser\'s '
      + 'side; step ② of the ratified order, #366 item 1)',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    theMechanismFactLnC1: '⚠ #390 item 3(iii), RECORDED AS WRONG at #391 item 3 — quoted here only because LN-C1 measured against it: '
      + '`laneOpenness(from, to, opponents)` (`src/ai/perception.ts` l.143) iterates ITS '
      + '`opponents` ARGUMENT, and every pass-scoring call passes `opp.players` '
      + '(`PlayerBrain.ts` l.611 / 916 / 1036 / 1201); `opennessAt(aim, opp.players)` beside; '
      + 'the ground candidate\'s score `s = passBase + lane·passLaneW + open·passOpenW` then '
      + 'the gain / risk chain carries NO own-body term ⇒ A BODY OF OURS IN THE LANE IS '
      + 'INVISIBLE TO THE CHOICE BY CONSTRUCTION.',
    theMechanismOfRecord: '⭐⭐ #391 item 3, the CORRECTED mechanism this census measures: TWO '
      + 'PRICERS AND ONE OWN-BODY PRICE. (i) the lane argmax\'s `groundCandidate` — the GRADED '
      + 'lane test `laneOpenness(p.pos, aim, opp.players)` is opponent-only (TRUE), but the SAME '
      + 'function subtracts `gcSeat.exposureWeight · groundShellHazard(p.pos, aim, gcBodies, '
      + 'p.gid, mate.gid)` with `gcBodies = [team.players, opp.players]` — a BINARY shell of '
      + '`coreRadius + BALL_RADIUS` on the segment before the aim, minus kicker and receiver, '
      + 'ARMED in world 13 (`bkGroundCorridor`) at the world\'s pinned `dvExposureWeight`. (ii) '
      + 'the PERCEIVED CHOOSER (`edsPerceivedChoice`, TRUE in every a4 world): after the ladder '
      + 'decides to pass, `passMate` is REPLACED by `choosePerceivedPassTarget`\'s winner, '
      + 'priced by `pricePassOption` on a snapshot SCOPED to passer + candidates + opponents — '
      + 'no lane term, no own-body term, non-candidate teammates out of scope. ⇒ the GC shell '
      + 'price reaches WHO RECEIVES only on the decisions the perceived chooser leaves alone.',
    whatThisIsNot: '⛔ #390 item 3(v): this is NOT the audit\'s ⑤ (出球人感知诚实 — the '
      + 'truth-vs-snapshot cut, `inSnapshotLaw`). It asks WHICH BODIES THE EYES COUNT, not '
      + 'whether the reads are honest; `inSnapshotLaw` is OFF here (asserted by `gWorld`) so '
      + 'no baseline is touched.',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis and ARMS NOTHING: it '
      + 'prints FROZEN read literals that NAME a lever. The commander rules. Nothing ships.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. The probe CALLS shipped '
      + 'exports (`laneOpenness`, `formationSpot`, `supportSpot`, `closestPointOnSegment`, '
      + '`a4MatchFlags`, `armA4World`) and reads public `Match` / `Team` state per tick. THERE '
      + 'IS NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte PER ARM.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a '
      + 'heuristic is written only where no record exists, and says so". WHAT IS READ FROM THE '
      + 'ENGINE: the CHOICE TICK and the AIM (the `pendingPassWindup` record\'s own `aim` / '
      + '`aimLead` / `targetGid` / `readyTick` where one exists; PT-C0\'s release rule where '
      + 'none does), `ball.lastTouch`, `pendingPass`, the designation sets, every '
      + 'position/velocity. WHAT IS A DECLARED RECONSTRUCTION: the OWN-openness and the MENU '
      + '(the SHIPPED `laneOpenness` CALLED with the census\'s own populations), the CORRIDOR '
      + '(BN-C0\'s construction) and the two SPOTS (LN-C0\'s).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/ln-c2-chooser-path-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/ln-c2-chooser-path-census.ts', 'utf8')),
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
    varianceSource: `THIS census's own 12-cluster SCRATCH SMOKE (seeds ${SCRATCH_BASE}–`
      + `${SCRATCH_BASE + 11}), DISCLOSED IN FULL at the doc's §DEV-PREFLIGHT. ⚠ 12 clusters `
      + 'is a NOISY variance estimate. N_FROZEN = min(max(nRequired), the block\'s affordance '
      + 'after the construction receipt) at a DECLARED 0.05 half-width target on the two '
      + 'READ-BEARING shares (`cBlockedShare` and `aShare`, arm E13).',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: BLOCK_AFFORDS,
    nRequiredMax: N_REQUIRED_MAX, boundBy: N_BOUND_BY,
    declaredHalfWidthTarget: 0.05, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces, deltas,
  reads: {
    note: '⭐⭐ #391 item 4(vii)\'s SENTENCES are FROZEN LITERALS, copied VERBATIM. C = THE '
      + 'TRACED CAROMS (first body = own non-target, an established choice tick, a choice '
      + 'geometry and a LEDGER ROW JOINED); S = the share of C whose target was chosen by the '
      + 'SUBSTITUTED path; F = the share of the LEGACY-path caroms whose struck lane had '
      + '`shellFired` = 1 at the choice. THE RULE: S > 0.5 ⇒ the perceived chooser; S ≤ 0.5 ∧ '
      + 'F > 0.5 ⇒ the shell\'s WEIGHT; else ⇒ a GRADED own-body term. The SELECTORS are '
      + 'STORED booleans (> 0.5). THE READ OF RECORD is the E13 arm\'s `established` cell; '
      + 'D13\'s is printed BESIDE with an AGREEMENT boolean, and the SAME frozen rule is '
      + 'applied to each ESTABLISHED CLASS TAKEN ALONE (the counterfactual words). The UNTRACED '
      + 'class\'s share of ALL caroms is stored on every cell as `untracedShareOfAllCaroms` and '
      + 'printed BESIDE EVERY SENTENCE.',
    frozenLiterals: READ_WORDS, agreementSentences: AGREE_SENTENCE,
    scopes: READ_SCOPES, cells: READS,
    readOfRecord: READ_OF_RECORD.sentence,
    readOfRecordKey: READ_OF_RECORD.readKey,
    dosedReadKey: DOSED_READ.readKey,
    dosedAgreesOnTheRead: DOSED_AGREES,
    agreementSentencePrinted: AGREE_WORD,
    counterfactualWordsByClass: Object.fromEntries(ARMS.flatMap((armK) => READ_SCOPES
      .map((s) => [`${armK}.${s}`, READS[`${armK}.${s}`].readKey]))),
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
    choiceClass: { vocabulary: CHOICE_CLASSES, pooled: pooled[armK].chClass },
    choiceOwnOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chOwnOpenBins },
    choiceOpponentOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chOppOpenBins },
    caromByOwnOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chCaromByOwnBin },
    opponentFirstByOpponentOpenness: { width: OPEN_BIN_W, bins: OPEN_BINS,
      groups: CHOICE_CLASSES, pooled: pooled[armK].chOppFirstByOppBin },
    caromPresenceAtChoice: { vocabulary: CAROM_PRESENCE, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chCaromPresence },
    bestAlternativeGainSign: { vocabulary: GAIN_SIGNS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chAltGain },
    firstBodyByChoiceClass: { vocabulary: CONTACTS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].chFirstBody },
    /* ⭐⭐ LN-C2's own grid: `k = CCI(choiceClass) * PATHS.length + PTI(pathClass)` */
    pathByChoiceClass: { vocabulary: PATHS, groups: CHOICE_CLASSES, pooled: pooled[armK].cpPass },
    pathCaroms: { vocabulary: PATHS, groups: CHOICE_CLASSES, pooled: pooled[armK].cpCarom },
    pathPassesWithGeometry: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpGeom },
    pathCaromsWithGeometry: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpCaromGeom },
    pathShellFired: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpShellPass },
    pathShellFiredCaroms: { vocabulary: PATHS, groups: CHOICE_CLASSES,
      pooled: pooled[armK].cpShellCarom },
    ownOpennessByShellAndPath: { width: OPEN_BIN_W, bins: OPEN_BINS,
      layout: 'bin * 2 + shellFired', groups: 'choiceClass × path (the flat k grid)',
      pooled: pooled[armK].cpOwnBinShell },
    caromByOwnOpennessAndShellAndPath: { width: OPEN_BIN_W, bins: OPEN_BINS,
      layout: 'bin * 2 + shellFired', groups: 'choiceClass × path (the flat k grid)',
      pooled: pooled[armK].cpCaromOwnBinShell },
    firstBodyByPath: { vocabulary: CONTACTS, groups: 'choiceClass × path (the flat k grid)',
      pooled: pooled[armK].cpFirstBody },
    substitutionDirection: { vocabulary: SUB_DIRS,
      groups: 'choiceClass × path (the flat k grid)', pooled: pooled[armK].cpSubDir },
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
    reproLnc1SeedsRewalked: REPRO_LNC1_SEEDS,
    reproLnc1IsARewalkNotConsumption: true,
    publishedFrontierAt391: PUBLISHED_FRONTIER_AT_391,
    consumedLedgerQuoted: CONSUMED,
    blockAffordsAfterTheConstructionReceipt: BLOCK_AFFORDS,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 76 },
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
    + 'ARTIFACT STORES NONE. The list of record is THIS census\'s own doc, '
    + 'docs/world-model/LN-C2-CHOOSER-PATH-CENSUS.md §HONEST LIMITS (⚠ LN-C1 §COMMANDER '
    + 'CORRECTIONS item 5 struck an artifact that pointed at its ANCESTOR\'s list; this one '
    + 'points at its own).',
  codeFact: {
    what: '⭐⭐ THE CODE FACTS — ANCHORED SITES *AND* WHOLE-FUNCTION TEXT HASHES. ⚠ CODE READS, '
      + 'NOT MEASUREMENTS.',
    lessonOfRecord: '#391 item 3(v), VERBATIM: "a code read anchored at the sites one already '
      + 'believes in is a confirmation, not a census — LN-C1\'s `gCodeFact` proved eleven true '
      + 'anchors and missed the twelfth line of the same function. Future code-fact booleans are '
      + 'derived from the WHOLE function body (a hash of the function\'s text, anchored) beside '
      + 'the named sites."',
    derivedFrom: 'the ANCHOR GATE *AND* the four whole-function extractions: a fact below is '
      + 'written only because `gCodeFact` and `gFnTexts` are both GREEN. Each boolean is '
      + 'computed from the FULL text of its function, not from a named line.',
    facts: FN_FACTS,
    functions: FN_TEXTS,
    anchorsUsed: CODE_FACT_ANCHORS.map((a) => ({ what: a.what, file: a.file,
      want: a.want, lines: a.occurrences.map((o) => o.line) })),
    theOpponentPopulationIsTheChoosers: '⭐ `opp` is the TRUTH opponent team here — '
      + '`inSnapshotLaw` is OFF (anchored default-off line; asserted per walked match as '
      + '`snapshotLawAbsent`), so `opp.players` is the whole opponent array, keeper INCLUDED, '
      + 'and `laneOpenness` skips `sentOff` INSIDE the shipped function.',
  },
  functionTexts: {
    what: '⭐⭐ THE FOUR WHOLE-FUNCTION TEXTS, extracted by ANCHORED start/end needles and '
      + 'hashed. The doc QUOTES each function in full so a reader can see every term.',
    rows: FN_TEXTS,
    hashesDistinct: FN_HASHES_DISTINCT,
  },
  pathClasses: {
    vocabulary: PATHS,
    labels: {
      legacyChosen: 'LEGACY — a ledger row joined AND `chosenGid === legacyGid`: the perceived '
        + 'chooser priced the menu and landed on the lane argmax\'s own man.',
      legacyNoOption: 'LEGACY-NO-OPTION — a ledger row joined AND `chosenGid === -1`: no '
        + 'EXECUTABLE option, so the seam left the legacy target in place (a SUB-CLASS of '
        + 'LEGACY, stored separately as #391 item 4 requires).',
      substituted: 'SUBSTITUTED — a ledger row joined, `chosenGid >= 0` AND `chosenGid !== '
        + 'legacyGid`: the PERCEIVED pricer replaced the target.',
      untraced: '⛔ UNTRACED — NO ledger row for (decision tick, passerGid). COUNTED, never '
        + 'imputed: the cutback keeps its own machinery and is never substituted, the keeper is '
        + 'excluded from the perceived chooser, a forced target is a different branch, and a '
        + 'pass whose decision never ran the EDS block (the kickoff play-back, the through '
        + 'ball) has no row by construction.',
    },
    legacyIsBothSubClasses: LEGACY_PATHS, tracedIsEverythingElse: TRACED_PATHS,
    theJoin: '⭐⭐ (DECISION TICK, passerGid). The DECISION TICK is LN-C1\'s choice tick, '
      + 'inherited: the ARM tick where a wind-up record exists, the RELEASE tick for a '
      + 'synchronous strike (both calls happen at the tick the brain chose — every strike site '
      + 'of the population is anchored). The join rate and the target-agreement share are '
      + 'RECEIPTS (`trace.*.joinShare` / `trace.*.targetAgreesShare`), never filters.',
    theCrossCell: 'every path count lives in exactly ONE cell of the flat grid `k = '
      + 'CCI(choiceClass) * PATHS.length + PTI(pathClass)`, so a face is a sum over a cell set '
      + 'and no count is copied.',
    substitutionDirection: {
      vocabulary: SUB_DIRS,
      rule: '⭐⭐ `into` = the STRUCK lane\'s own-openness < 0.4 AND the LANE ARGMAX\'s '
        + 'candidate\'s ≥ 0.4 (the substitution moved the ball INTO a lane with one of ours in '
        + 'it); `outOf` = the reverse; `neither` = both sides of the gate agree; `noLegacyLane` '
        + '= the argmax\'s own body carried no readable lane. ⚠ THE LEGACY LANE IS A DECLARED '
        + 'RECONSTRUCTION — the argmax\'s own aim is NOT recorded anywhere, so it is read as '
        + '`passer.pos → legacyGid\'s body position at the choice`.',
      gate: GATE_040,
    },
  },
  theShell: {
    what: '⭐⭐ `groundShellHazard(passer.pos, aim, [team.players, opp.players], passer.gid, '
      + 'target.gid)` — THE SHIPPED FUNCTION, CALLED, on the STRUCK lane at the CHOICE TICK. '
      + '⛔ Never re-implemented.',
    shellMetres: SHELL_M,
    ballRadius: BALL_RADIUS, playerCoreRadius: PLAYER_CORE_RADIUS,
    dvExposureWeightRead: DV_EXPOSURE_WEIGHT_READ,
    dvExposureWeightPinnedByTheWorld: CORRIDOR_WORLD_WEIGHT,
    ownOnlyAndOppOnly: 'the SAME shipped function on a NARROWED population — `[team.players]` '
      + 'alone and `[opp.players]` alone — so the doc can say WHOSE body fired the shell. The '
      + 'combined call is the union of the two (fixture-pinned).',
    onTheLaneArgmaxsOwnCandidate: '⭐ `shellFiredLegacy` — the same call on `passer.pos → '
      + 'legacyGid\'s body position at the choice`, a DECLARED RECONSTRUCTION (the argmax\'s aim '
      + 'is not recorded).',
    noClearGuard: '⛔ `groundShellHazard` carries NO 1.5 m clear-the-kicker guard (unlike '
      + '`laneOpenness`) — fixture-pinned, and it is the shipped behaviour.',
  },
  theLedger: {
    what: '⭐⭐ `match.passChoiceTrace` — the ENGINE\'S OWN choice ledger, a SIDECAR its own '
      + 'docblock calls "read by nothing in the sim". This census ARMS it by construction '
      + '(`traceChoice: true`, EXPLICIT — never through the `EDS_TRACE_CHOICE` env, which §1 '
      + 'REFUSES) and READS it; nothing is written back.',
    fieldsRead: ['tick', 'passerGid', 'chosenGid', 'legacyGid', 'candidates', 'read',
      'seenUnread', 'unseen', 'blindOutpricesRead'],
    chosenGidMinusOne: '−1 = the perceived chooser had NO executable option; v1 keeps the '
      + 'legacy choice rather than suppressing a pass the action layer already committed to.',
    byteInertness: '⭐⭐ PROVED, not assumed — `gLockstepTrace`: traced ≡ untraced whole-match '
      + 'signature (rng stream state included) on every scratch lockstep seed of both arms.',
  },
  lockstepTrace: { rows: lockstepTraceRows, ok: LOCKSTEP_TRACE_OK,
    what: 'traced vs untraced whole-match signatures at the out-of-band scratch seeds' },
  choiceTick: {
    vocabulary: CHOICE_CLASSES, established: ESTABLISHED,
    labels: Object.fromEntries(CLASS_VIEWS.map((v) => [v.key, v.label])),
    theEnginesRule: '⭐⭐ THE ENGINE\'S OWN RULE, ANCHORED. (1) The brain\'s `Pass` branch '
      + 'either ARMS a wind-up (`match.armPendingPass(p, passMate!, offsideExemptKick)` at '
      + '`PlayerBrain.ts` l.1684, gated on `match.o1PassWindup && !mustKick && '
      + 'p.firstTouchWindow <= 0` at l.1683) or STRIKES SYNCHRONOUSLY (`match.performPass` at '
      + 'l.1686 / l.1687; `match.performCutback` at l.1628). Both calls happen AT THE TICK THE '
      + 'BRAIN CHOSE. ⇒ where a wind-up record exists the ARM TICK IS THE CHOICE TICK; where '
      + 'none does THE STRIKE IS ON THE DECISION TICK, so the RELEASE TICK IS THE CHOICE TICK '
      + 'and is read as such. (2) `o1PassWindup` is ON in world 13 because the CB world '
      + 'composes on `a4MatchFlags(3)` (anchored) and every later world CALLS its predecessor '
      + '— which is why LN-C0 found an arm record on `lane.armRecordShare` of measured passes. '
      + '(3) A class with NO establishable choice tick would be COUNTED, never imputed '
      + '(LN-C0\'s `noWindup` precedent); by the rule above that class is EMPTY, and its size '
      + 'is published beside every read sentence as `choice.noneShareOfCaroms`.',
    theAimOfRecord: '⭐⭐ NEVER RECOMPUTED. ARM class: the wind-up record\'s OWN `aim` (the '
      + 'mate\'s arm-time position, written by `armPendingPass`) plus its own `aimLead` — '
      + 'LN-C0\'s E, byte for byte. RELEASE class: PT-C0\'s own rule — the target\'s position '
      + 'at the strike tick, i.e. the flight\'s launch-to-target line. ⭐ The DLC door '
      + '`dlcDeliveryChoice` is open in world 13, so the aim MAY be led; whatever the engine '
      + 'recorded is what is read.',
    theTwoOpennesses: '⭐⭐ `laneOpenness(passer.pos, aim, POPULATION)` — the SHIPPED function '
      + 'CALLED, at the passer\'s OWN position AT THE CHOICE TICK. OWN-openness: the own '
      + 'OUTFIELD bodies minus the passer minus the target (the census\'s DECLARED population, '
      + '#390 item 4(iv)(b)). OPPONENT-openness: `opp.players` — the chooser\'s own. Both are '
      + 'binned on a FINE 0.1 grid (declared as BINS) and cut at the chooser\'s OWN anchored '
      + `gates ${GATE_040} (PlayerBrain l.628) and ${GATE_045} (l.943).`,
    theSecondMembershipFace: '⭐ LN-C0\'s 4 m corridor (BN-C0\'s test) is published BESIDE the '
      + 'openness for the SAME bodies, evaluated at the CHOICE tick\'s geometry (passer\'s '
      + 'position → the aim of record), with the CONTROL_RADIUS variant as a tight BIN.',
    caromPresenceVocabulary: CAROM_PRESENCE,
    caromPresenceNote: '⭐ LN-C0\'s present/arrived split for the FIRST BODY. '
      + '`arrivedAfterChoice` is STRUCTURALLY EMPTY in the RELEASE class (its choice tick IS '
      + 'the release tick) — declared, and fixture-pinned.',
  },
  menu: {
    what: '⭐⭐ THE MENU\'S GEOMETRY — a DECLARED RECONSTRUCTION, ⛔ NOT the chooser\'s score '
      + '(no weight, no gene, no style multiplier and no candidate ordering is reproduced).',
    rule: 'for every OTHER own outfield mate at the choice tick (not the passer, not the '
      + 'chosen target, not sent off): the OPPONENT-openness and the OWN-openness of the lane '
      + '`passer.pos → mate.pos`, the own population being own outfield minus the passer minus '
      + 'THAT mate. `ownClearAlternativeAtLeastAsOpen` = there EXISTS such a mate with '
      + `own-openness ≥ ${GATE_040} AND opponent-openness ≥ the chosen lane's opponent-openness.`,
    bestAlternative: 'the qualifying mate with the HIGHEST opponent-openness; ties resolved by '
      + 'the EARLIER player index (a frozen, stated tie-break). Only his FORWARD-GAIN SIGN is '
      + 'published — `team.localX(mate.pos.x) − team.localX(passer.pos.x)`, the form '
      + '`groundCandidate`\'s own gain is written in (anchored) — and ⛔ IT NEVER GATES.',
    gainSigns: GAIN_SIGNS,
  },
  loo: { rows: LOO_ROWS,
    what: '⭐ LEAVE-ONE-OUT on every read-bearing share, against the frozen `> 0.5` selector. '
      + '⚠ A RECEIPT — it gates no direction.' },
  reproLnc1: {
    seeds: REPRO_LNC1_SEEDS, rows: reproRows,
    artifact: LNC1_ARTIFACT, artifactFileSha256: LNC1_FILE_SHA,
    artifactHashedBodySha256: lnc1Disk.hashedBodySha256,
    fieldsCompared: REPRO_FIELDS_COMPARED, mismatches: REPRO_MISMATCHES,
    excludedSharedFields: REPRO_EXCLUDED_FIELDS,
    minimumFieldsRequired: REPRO_MIN_FIELDS,
    ok: REPRO_OK_LNC1,
    note: '⛔ RE-WALKS, NOT CONSUMPTION: block 12,544,000–999 is LN-C0\'s, consumed whole of '
      + 'record.',
  },
  xDet: { pass: X_DET, digestA, digestB,
    excludedFields: ['wallMs'],
    what: 'the whole core run TWICE from scratch; the digests over every per-seed row must be '
      + 'byte-identical' },
  xFpProd: { pass: X_FP_PROD, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
    what: 'the PRODUCTION fingerprint recomputed in-probe through the SHIPPED `League` / '
      + '`runHeadless` path; the baseline is EXTRACTED from OBM-T1\'s own probe line' },
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
  cmp('choiceClass', got.chClass);
  cmp('choiceOwnOpenness', got.chOwnOpenBins);
  cmp('choiceOpponentOpenness', got.chOppOpenBins);
  cmp('caromByOwnOpenness', got.chCaromByOwnBin);
  cmp('opponentFirstByOpponentOpenness', got.chOppFirstByOppBin);
  cmp('caromPresenceAtChoice', got.chCaromPresence);
  cmp('bestAlternativeGainSign', got.chAltGain);
  cmp('firstBodyByChoiceClass', got.chFirstBody);
  cmp('pathByChoiceClass', got.cpPass);
  cmp('pathCaroms', got.cpCarom);
  cmp('pathPassesWithGeometry', got.cpGeom);
  cmp('pathCaromsWithGeometry', got.cpCaromGeom);
  cmp('pathShellFired', got.cpShellPass);
  cmp('pathShellFiredCaroms', got.cpShellCarom);
  cmp('ownOpennessByShellAndPath', got.cpOwnBinShell);
  cmp('caromByOwnOpennessAndShellAndPath', got.cpCaromOwnBinShell);
  cmp('firstBodyByPath', got.cpFirstBody);
  cmp('substitutionDirection', got.cpSubDir);
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
  binChecks.push({ bin: `${armK}.partition.choiceClassSumsToFlights`,
    ok: sum(got.chClass) === sum(rows.map((r) => r.gpFlights))
      && got.chClass[CCI('arm')] === sum(rows.map((r) => r.gpWithArm))
      && got.chClass[CCI('release')] === sum(rows.map((r) => r.gpNoArm))
      && got.chClass[CCI('none')] === 0 });
  binChecks.push({ bin: `${armK}.partition.firstBodyByChoiceClassSumsToItsClass`,
    ok: CHOICE_CLASSES.every((_, i) => sum(got.chFirstBody[i]) === got.chClass[i])
      && CONTACTS.every((_, j) => sumIdxCell(got.chFirstBody, [0, 1, 2], j)
        === got.firstBody[j]) });
  binChecks.push({ bin: `${armK}.partition.opennessBinsAreInsideTheirClass`,
    ok: CHOICE_CLASSES.every((_, i) => sum(got.chOwnOpenBins[i]) <= got.chClass[i]
      && sum(got.chOppOpenBins[i]) === sum(got.chOwnOpenBins[i])) });
  binChecks.push({ bin: `${armK}.partition.caromBinsAreInsideTheOpennessBins`,
    ok: CHOICE_CLASSES.every((_, i) => got.chCaromByOwnBin[i]
      .every((v, j) => v <= got.chOwnOpenBins[i][j])
      && got.chOppFirstByOppBin[i].every((v, j) => v <= got.chOppOpenBins[i][j])) });
  binChecks.push({ bin: `${armK}.partition.caromPresenceSumsToCaromsWithGeometry`,
    ok: CHOICE_CLASSES.every((_, i) => sum(got.chCaromPresence[i])
      === sum(rows.map((r) => r.chCaromGeom[i]))
      && sum(got.chCaromByOwnBin[i]) === sum(rows.map((r) => r.chCaromGeom[i]))) });
  /* ⭐⭐ LN-C2's OWN PARTITIONS, off disk */
  binChecks.push({ bin: `${armK}.partition.pathGridSumsToFlights`,
    ok: sum(got.cpPass) === sum(rows.map((r) => r.gpFlights))
      && CHOICE_CLASSES.every((c) => cpNum(got.cpPass, cpIdx([c], PATHS))
        === got.chClass[CCI(c)]) });
  binChecks.push({ bin: `${armK}.partition.pathFirstBodySumsToTheFirstBodyLadder`,
    ok: CONTACTS.every((_, j) => sumIdxCell(got.cpFirstBody, cpIdx(CHOICE_CLASSES, PATHS), j)
      === got.firstBody[j])
      && cpNum(got.cpCarom, cpIdx(CHOICE_CLASSES, PATHS)) === got.firstBody[CTI('ownNonTarget')] });
  binChecks.push({ bin: `${armK}.partition.shellCellsAreInsideTheirPath`,
    ok: got.cpShellPass.every((v, k) => v <= got.cpGeom[k] && got.cpGeom[k] <= got.cpPass[k])
      && got.cpShellCarom.every((v, k) => v <= got.cpCaromGeom[k] && v <= got.cpShellPass[k])
      && got.cpCaromGeom.every((v, k) => v <= got.cpCarom[k]) });
  binChecks.push({ bin: `${armK}.partition.ownOpennessShellGridSumsToGeometry`,
    ok: got.cpOwnBinShell.every((x, k) => sum(x) === got.cpGeom[k])
      && got.cpCaromOwnBinShell.every((x, k) => sum(x) === got.cpCaromGeom[k])
      && got.cpOwnBinShell.every((x, k) => x.every((v, j) => got.cpCaromOwnBinShell[k][j] <= v)) });
  binChecks.push({ bin: `${armK}.partition.shellFiredEqualsItsGridColumn`,
    ok: got.cpShellPass.every((v, k) => v === Array.from({ length: OPEN_BINS },
      (_, b) => got.cpOwnBinShell[k][b * 2 + 1]).reduce((a, x) => a + x, 0))
      && got.cpShellCarom.every((v, k) => v === Array.from({ length: OPEN_BINS },
        (_, b) => got.cpCaromOwnBinShell[k][b * 2 + 1]).reduce((a, x) => a + x, 0)) });
  binChecks.push({ bin: `${armK}.partition.substitutionDirectionSumsToSubstitutedGeometry`,
    ok: PATHS.map((pth, i) => ({ pth, i })).every(({ pth }) => CHOICE_CLASSES.every((c) => {
      const k = CPK(c, pth);
      return pth === 'substituted' ? sum(got.cpSubDir[k]) === got.cpGeom[k]
        : sum(got.cpSubDir[k]) === 0;
    })) });
  binChecks.push({ bin: `${armK}.partition.spotInLaneIsInsideEligibleBodies`,
    ok: sum(rows.map((r) => r.spotInLaneAll)) <= sum(rows.map((r) => r.eligibleBodies))
      && sum(rows.map((r) => r.occN)) <= sum(rows.map((r) => r.eligibleBodies)) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells off disk: every stored
 *  share with its numerator and denominator, every selector boolean, every read key, every
 *  printed sentence (which must be one of the frozen literals), the agreement boolean and the
 *  counted class's own share. */
{
  const diskReads = disk.reads as unknown as {
    cells: Record<string, ReadCell>; readOfRecord: string; readOfRecordKey: string;
    dosedReadKey: string; dosedAgreesOnTheRead: boolean; agreementSentencePrinted: string;
    counterfactualWordsByClass: Record<string, string>; readListPrinted: string[];
  };
  for (const armK of ARMS) {
    const rows = disk.perSeedCells.map((c) => c[armK]);
    for (const scope of READ_SCOPES) {
      const classes = (SCOPE_VIEWS.find((v) => v.key === scope) as ScopeView).classes;
      const tracedIdx = cpIdx(classes, TRACED_PATHS);
      const legacyIdx = cpIdx(classes, LEGACY_PATHS);
      const subIdx = cpIdx(classes, ['substituted']);
      const sN = sum(rows.map((r) => cpNum(r.cpCaromGeom, subIdx)));
      const sD = sum(rows.map((r) => cpNum(r.cpCaromGeom, tracedIdx)));
      const fN = sum(rows.map((r) => cpNum(r.cpShellCarom, legacyIdx)));
      const fD = sum(rows.map((r) => cpNum(r.cpCaromGeom, legacyIdx)));
      const sv = ratio(sN, sD);
      const fv = ratio(fN, fD);
      const key = readKeyOf(sv, fv);
      const unN = sum(rows.map((r) => cpNum(r.cpCarom, cpIdx(classes, ['untraced']))));
      const unD = sum(rows.map((r) => cpNum(r.cpCarom, cpIdx(classes, PATHS))));
      const cell = diskReads.cells[`${armK}.${scope}`];
      binChecks.push({ bin: `reads.${armK}.${scope}.sharesRederive`,
        ok: sN === cell.sNumerator && sD === cell.sDenominator
          && fN === cell.fNumerator && fD === cell.fDenominator
          && sameNum(sv, cell.sShare) && sameNum(fv, cell.fShare)
          && sameNum(ratio(unN, unD), cell.untracedShareOfAllCaroms) });
      binChecks.push({ bin: `reads.${armK}.${scope}.selectorBooleansRederive`,
        ok: (sv > 0.5) === cell.sGreaterThanHalf
          && (fv > 0.5) === cell.fGreaterThanHalf
          && key === cell.readKey
          && diskReads.counterfactualWordsByClass[`${armK}.${scope}`] === key });
      binChecks.push({ bin: `reads.${armK}.${scope}.sentenceIsTheFrozenLiteral`,
        ok: READ_WORDS[key] === cell.sentence
          && (Object.values(READ_WORDS) as string[]).includes(cell.sentence) });
    }
  }
  const eKey = diskReads.cells['E13.established'].readKey;
  const dKey = diskReads.cells['D13.established'].readKey;
  binChecks.push({ bin: 'reads.recordAndAgreementAreStored',
    ok: diskReads.readOfRecordKey === eKey && diskReads.dosedReadKey === dKey
      && diskReads.dosedAgreesOnTheRead === (eKey === dKey)
      && diskReads.agreementSentencePrinted
        === (eKey === dKey ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && diskReads.readOfRecord === READ_WORDS[eKey as ReadKey]
      && diskReads.readListPrinted.length === 2
      && diskReads.readListPrinted[0] === READ_WORDS[eKey as ReadKey] });
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
banner(`LN-C2 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE CODE FACTS AND THE LEDGER RECEIPTS ---');
for (const f of FN_TEXTS) {
  banner(`  ${f.name} — ${f.file} l.${f.startLine}–${f.endLine} · ${f.chars} chars · `
    + `sha256 ${f.sha256}`);
}
banner(`  facts: ${JSON.stringify(FN_FACTS)}`);
for (const armK of ARMS) {
  banner(`  ${armK} join ${f6(face('trace.established.joinShare', armK).value)} `
    + `(${face('trace.established.joinShare', armK).numerator}/`
    + `${face('trace.established.joinShare', armK).denominator}) · targetAgrees `
    + `${f6(face('trace.established.targetAgreesShare', armK).value)} · aim record `
    + `${f6(face('aim.established.recordShare', armK).value)} · bodyFallback `
    + `${f6(face('aim.established.bodyFallbackShare', armK).value)}`);
}
banner('');
banner('--- §R2 THE PATH CLASSES ---');
for (const armK of ARMS) {
  for (const pv of ['legacy', 'legacyNoOption', 'substituted', 'untraced']) {
    const ps = face(`path.established.${pv}.passShare`, armK);
    const cs = face(`path.established.${pv}.caromShareOfCaroms`, armK);
    banner(`  ${armK} ${pv.padEnd(15)} passes ${f6(ps.value)} (${ps.numerator}/`
      + `${ps.denominator}) · of caroms ${f6(cs.value)} (${cs.numerator}/${cs.denominator}) · `
      + `P(carom|path) ${f6(face(`path.established.${pv}.caromRate`, armK).value)}`);
  }
}
banner('');
banner('--- §R3 THE SHELL BY PATH ---');
for (const armK of ARMS) {
  for (const pv of ['legacy', 'substituted', 'untraced']) {
    banner(`  ${armK} ${pv.padEnd(12)} fired ${f6(face(`shell.established.${pv}.firedShare`, armK).value)}`
      + ` · own-only ${f6(face(`shell.established.${pv}.ownOnlyShare`, armK).value)}`
      + ` · opp-only ${f6(face(`shell.established.${pv}.oppOnlyShare`, armK).value)}`
      + ` · P(carom|fired) ${f6(face(`shell.established.${pv}.caromGivenShellFired`, armK).value)}`
      + ` · P(carom|clear) ${f6(face(`shell.established.${pv}.caromGivenShellClear`, armK).value)}`
      + ` · on caroms ${f6(face(`shell.established.${pv}.firedShareOnCaroms`, armK).value)}`);
  }
  banner(`      substitution: into ${f6(face('substitution.established.intoShare', armK).value)}`
    + ` · outOf ${f6(face('substitution.established.outOfShare', armK).value)}`
    + ` · neither ${f6(face('substitution.established.neitherShare', armK).value)}`
    + ` · noLegacyLane ${f6(face('substitution.established.noLegacyLaneShare', armK).value)}`
    + ` · shellFiredLegacy ${f6(face('substitution.established.shellFiredLegacyShare', armK).value)}`);
}
banner('');
banner('--- §R1b THE CHOICE TICK (LN-C1, inherited) ---');
for (const armK of ARMS) {
  banner(`  ${armK} arm ${f6(face('choice.arm.passShare', armK).value)} · release `
    + `${f6(face('choice.release.passShare', armK).value)} · none `
    + `${f6(face('choice.none.passShare', armK).value)}  n=`
    + `${face('choice.arm.passShare', armK).denominator}`);
}
banner('');
banner('--- §R2 THE CHOSEN LANE: OWN-openness vs OPPONENT-openness at the choice ---');
for (const armK of ARMS) {
  for (const scope of READ_SCOPES) {
    banner(`  ${armK} [${scope}] own ${f6(face(`choice.${scope}.ownOpennessMean`, armK).value)}`
      + ` · opp ${f6(face(`choice.${scope}.opponentOpennessMean`, armK).value)}`
      + ` · own<0.4 ${f6(face(`choice.${scope}.ownOpenBelow40Share`, armK).value)}`
      + ` · opp<0.4 ${f6(face(`choice.${scope}.opponentOpenBelow40Share`, armK).value)}`
      + ` · corridor ${f6(face(`choice.${scope}.corridorOccupiedShare`, armK).value)}`
      + `  n=${face(`choice.${scope}.ownOpenBelow40Share`, armK).denominator}`);
  }
}
banner('');
banner('--- §R3/§R4 THE CAROM CONDITIONAL AND THE MENU ---');
for (const armK of ARMS) {
  for (const scope of READ_SCOPES) {
    const cb = face(`read.${scope}.cBlockedShare`, armK);
    const av = face(`read.${scope}.aShare`, armK);
    banner(`  ${armK} [${scope}] carom ${f6(face(`choice.${scope}.caromShare`, armK).value)}`
      + ` · cBlocked ${f6(cb.value)} (${cb.numerator}/${cb.denominator})`
      + ` · aShare ${f6(av.value)} (${av.numerator}/${av.denominator})`
      + ` · alt ${f6(face(`menu.${scope}.ownClearAlternativeShare`, armK).value)}`);
    banner(`      presence: present `
      + `${f6(face(`carom.${scope}.presence.presentAtChoice`, armK).value)} · arrived `
      + `${f6(face(`carom.${scope}.presence.arrivedAfterChoice`, armK).value)} · not-in-corridor `
      + `${f6(face(`carom.${scope}.presence.notInReleaseCorridor`, armK).value)}`);
  }
}
banner('');
banner('--- §R5 THE OPPONENTS BESIDE ---');
for (const armK of ARMS) {
  banner(`  ${armK} opp<0.4 share `
    + `${f6(face('choice.established.opponentOpenBelow40Share', armK).value)} · their `
    + `opponent-first rate ${f6(face('opponent.established.below40FirstShare', armK).value)}`
    + ` · opponent-first overall `
    + `${f6(face('choice.established.opponentFirstShare', armK).value)}`);
}
banner('');
banner('--- §R6 THE READS, PRINTED ---');
for (const s of READ_LIST) banner(`  ${s}`);
for (const armK of ARMS) {
  const c = READS[`${armK}.established`];
  banner(`  ${armK} S ${f6(c.sShare)} (${c.sNumerator}/${c.sDenominator}) · F ${f6(c.fShare)} `
    + `(${c.fNumerator}/${c.fDenominator}) · UNTRACED share of ALL caroms `
    + `${f6(c.untracedShareOfAllCaroms)} ⇒ ${c.readKey}`);
}
banner(`  (counted no-choice-tick class, share of ALL caroms: E13 `
  + `${f6(face('choice.noneShareOfCaroms', 'E13').value)} · D13 `
  + `${f6(face('choice.noneShareOfCaroms', 'D13').value)})`);
banner(`  (E13 established ${READ_OF_RECORD.readKey} · D13 established ${DOSED_READ.readKey} · `
  + `E13 arm ${READS['E13.arm'].readKey} · E13 release ${READS['E13.release'].readKey})`);
banner(`  dvExposureWeight as READ off the constructed match = ${DV_EXPOSURE_WEIGHT_READ}`);
banner('');
banner(`formationSpot path: ${FORMATION_SPOT_PATH}`);
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch).toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
