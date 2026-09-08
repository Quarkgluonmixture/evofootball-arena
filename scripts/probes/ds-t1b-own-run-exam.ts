/**
 * ⭐⭐⭐ DS-T1b — 「自己的前插 · 复考」 THE OWN-RUN EXAM RE-RUN
 * (docs/world-model/DS-T1B-OWN-RUN-EXAM-RERUN.md).
 *
 * Authorized by COMMANDER RULING #408 item 5. Lineage: DS-C0 (the WALKER) → DS-T0 (the seam) →
 * DS-T1 (THE INSTRUMENT THIS FILE INHERITS — #406 item 5, banked at #407; its three paid debts
 * STAY PAID and its arms / R1 / band / faces / reads / gates are carried over by anchor) →
 * DS-T0b (THE SEAM UNDER EXAM: the restraint moved into the player — `restraint = clamp01(1 −
 * runningMates ÷ runnerCount(mode, tempo, urgency))` and the own run only when the PERCEIVED
 * ball's owner is a mate) → OBM-T1 / LN-T1 (THE TWO DOSES: RUN-CAUTION, a hand-set PROBE CORNER
 * in OBM-T1's own `matrix(...)` idiom, and KITCHEN-SINK byte-copied from OBM-T1's ceiling probe,
 * both re-derived slot for slot off the `OBM_*` exports in LN-T1's G-DOSE-COPY form).
 *
 * THE QUESTION (#408 item 5, not re-argued here): with the restraint in the player, does the own
 * run hold the coach's band without the coach (H-DS-3), what did withdrawing the in-flight run
 * cost (H-DS-4), and — with a dose that ACTUALLY prices the run — do the eyes restrain the flood
 * (H-DS-2)? DS-T1's READ OF RECORD was read 3 ("THE RESTRAINT WAS THE COACH'S"); #407 item 3
 * struck the dose choice, because MARKER-ESCAPE's `runScore` row is zero and `obmRunMul ≡ 1`.
 *
 * ⛔ THIS IS AN EXAM. It arms NOTHING in the game; NOTHING ships. The READ SENTENCES are the
 * #406 item 5(v) literals RE-FROZEN VERBATIM, selected by STORED booleans with the precedence
 * unchanged and "dosed" = RUN-CAUTION; NO VERDICT WORD is printed on any yield, coupling or
 * hypothesis face — H-DS-2 / H-DS-3 / H-DS-4's numbers are PRINTED BESIDE the read, never judged.
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe reads public
 * `Match` / `Team` / `Player` / `Ball` state and the engine's own decision record
 * (`p.action.scores`) before and after `match.step(DT)`. THERE IS NO WRAPPER on any walked match
 * — `gLockstep` proves observed ≡ unobserved byte for byte PER ARM, and `gPullCount` proves the
 * observation adds NO `perceivedSnapshot` PULL (the counter idiom of the seam's own pin B6,
 * applied to a THROWAWAY match instance, never to a battery walk).
 * ⛔ WORLDS 12–15 ARE UNTOUCHED. E13 (world 13 empty-book) is ③'s control; D13 (the played form,
 * the SHIPPED loaders' dose) is published BESIDE.
 *
 * ⭐⭐ THE SEAM'S NEW FACES ARE BACKED OUT, NEVER RECOMPUTED. `restraint` and `runningMates` are
 * inverted out of the engine's own stored candidate score exactly as DS-T1 backed out `runMul`:
 * `score = W.runScore · prior · restraint · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul`, so on a
 * seat-ABSENT arm (`obmRunMul` EXACTLY 1 by construction) the back-out IS the restraint, and
 * `runningMates = (1 − restraint) · count` wherever the clamp did not bite. Recomputing them from
 * the snapshot is IMPOSSIBLE byte-inertly — `perceivedSnapshot` MUTATES perception memory.
 *
 * ⭐⭐ THE THREE DS-T1 DEBT PAYMENTS ARE INHERITED UNCHANGED: (a) the post-step holds predicate of
 * record with DS-C0's pre-step form and the engine's own ledger receipt beside; (b) the shooter
 * gid banked AT THE SHOT'S PUSH; (c) the wide episode bins past one full `wallRun` licence with
 * the top bin's share beside every bin-derived median.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, AI_INTERVAL, TEAM_AI_INTERVAL, OFFBALL_TIRED_MUL } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bqArmedVersion, lnArmedVersion, gkArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  BQ_WORLD_VERSION, LN_WORLD_VERSION, GK_WORLD_VERSION,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { pressureAt } from '../../src/ai/perception';
import { RUN_ROLE_W, RUN_DEPTH_DIV, RUN_PRIOR_MAX, runnerCount } from '../../src/ai/TeamBrain';
import { OBM_SCORE_SPAN } from '../../src/ai/offballEyes';
import {
  randomGenome, OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS, OBM_WEIGHT_SLOTS,
  OBM_WEIGHT_MIN, OBM_WEIGHT_MAX, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { clamp01 } from '../../src/utils/math';
import { TEAM_SIZE, type Side, type TeamInfo, type Role, type TeamMode } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the DS-C0 / GK-T1 §1 form)                 */
/* ========================================================================== */
const ENV_WHITELIST = ['DST1B_MODE', 'DST1B_N', 'DST1B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('DST1B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`DS-T1b FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.DST1B_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('DS-T1b FATAL — DST1B_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.DST1B_N !== undefined ? Number(process.env.DST1B_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('DS-T1b FATAL — DST1B_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.DST1B_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`DST1B_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`DST1B_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`DST1B_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/ds-t1b-own-run-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/ds-t1b-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('DS-T1b FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
/** ⭐⭐ THE INSTRUMENT OF RECORD — this file's own path, for the stage block's hash. */
const INSTRUMENT_PATH = 'scripts/probes/ds-t1b-own-run-exam.ts';

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set)                                            */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'ERROR'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const binMedian = (bins: readonly number[], width: number): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return i * width;
  }
  return (bins.length - 1) * width;
};
const topBinShare = (bins: readonly number[]): number =>
  ratio(bins[bins.length - 1], sum(bins));
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
   §COMMANDER CORRECTIONS item 1); and "a seam-map gate pins occurrence COUNTS per needle and
   enumerates EVERY occurrence's site" (home: PC-C0-REACTION-BASELINE.md §CORR item 1)        */
/* ========================================================================== */
const TEAMBRAIN_PATH = 'src/ai/TeamBrain.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const EXEC_PATH = 'src/ai/actionExecutor.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const EYES_PATH = 'src/ai/offballEyes.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const A4_PATH = 'src/game/a4World.ts';
const TEAM_PATH = 'src/sim/Team.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const LEAGUE_PATH = 'src/sim/League.ts';
const TYPES_PATH = 'src/sim/types.ts';
/* the sibling INSTRUMENTS this exam inherits BY ANCHOR (never by memory) */
const OBMT1_PATH = 'scripts/probes/obm-t1-policy-exam.ts';
const CTBT1_PATH = 'scripts/probes/ctb-t1-supply-exam.ts';
const DLCT1_PATH = 'scripts/probes/dlc-t1-choice-exam.ts';
const LNT1PB_PATH = 'scripts/probes/ln-t1pb-own-lane-exam.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const PTC0_PATH = 'scripts/probes/pt-c0-playtest-forensic-census.ts';
const SEAM_DOC_PATH = 'docs/world-model/DS-T0-OWN-RUN-SEAM.md';
const DSC0_ARTIFACT = 'docs/world-model/data/ds-c0-designation-census.json';
const ANCHOR_FILES = [TEAMBRAIN_PATH, MECH_PATH, BRAIN_PATH, EXEC_PATH, MATCH_PATH, CONST_PATH,
  EYES_PATH, GENOME_PATH, A4_PATH, TEAM_PATH, PLAYER_PATH, LEAGUE_PATH, TYPES_PATH,
  OBMT1_PATH, CTBT1_PATH, DLCT1_PATH, LNT1PB_PATH, A4P1C_PATH, PTC0_PATH, SEAM_DOC_PATH];
const SRC_OF: Record<string, string> = {};
for (const p of ANCHOR_FILES) SRC_OF[p] = readFileSync(p, 'utf8');
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
/** ⭐ backtick-bearing source lines are built by CONCATENATION so this instrument's own text
 *  never carries a template literal that could be mistaken for the source's. */
const BT = String.fromCharCode(96);
const DOLLAR = '$';
const nums = (s: string): number[] => (s.match(/-?[0-9]+\.?[0-9]*/g) ?? []).map(Number);
const firstQuoted = (s: string): string => {
  const m = /'([^']*)'/.exec(s);
  return m === null ? '' : m[1];
};

/* ---- ⭐⭐⭐ THE SEAM THIS EXAM EXAMINES (DS-T0; READ, NEVER TOUCHED) ---- */
anchor('⭐⭐⭐ THE OWN-RUN GATE — the ONE `match.dsOwnRun` READ FORK in `src/**`', BRAIN_PATH,
  '    if (match.dsOwnRun) {', 1);
anchor('⭐⭐⭐ THE OWN-RUN GUARD — the hat board read', BRAIN_PATH,
  '      const hatted = team.runners.has(p.index) || team.arriver === p.index', 1);
anchor('⭐⭐⭐ THE OWN-RUN GUARD — the 2过1 licence\'s OWN clock liveness', BRAIN_PATH,
  '      const wallLive = p.wallRun !== null && match.simTime < p.wallRun.until;', 1);
const PRIOR_LINE = '            (RUN_ROLE_W[p.role] + team.localX(p.pos.x) / RUN_DEPTH_DIV) '
  + '/ RUN_PRIOR_MAX,';
anchor('⭐⭐⭐ THE PRIOR — the coach\'s own ranking, normalised by its own derived maximum',
  BRAIN_PATH, PRIOR_LINE, 1);
anchor('⭐⭐⭐ THE SCORE — `W.runScore · prior · restraint`, the FOUR-FACTOR form DS-T0b '
  + 'amended (§LAW-B; the factor this exam BACKS OUT)', BRAIN_PATH,
  '          let s = W.runScore * prior * restraint;', 1);
anchor('⭐⭐⭐ THE TIRED LIMB, then the EYES — the multiplier ORDER this exam backs out',
  BRAIN_PATH, '          if (tired) s *= OFFBALL_TIRED_MUL;\n          s *= obmRunMul;', 1);
/* ---- ⭐⭐⭐ DS-T0b's AMENDMENT — the four lines the new faces are backed out of ---- */
anchor('⭐⭐⭐ THE RESTRAINT (M-DS.6(c)) — `clamp01(1 − runningMates / runnerCount(`, the amended '
  + 'law\'s own expression and the SECOND `runnerCount` call site', BRAIN_PATH,
  '          const restraint = clamp01(1 - runningMates / runnerCount(', 1);
anchor('⭐⭐⭐ THE COUNT\'S THREE INPUTS at the player\'s call site — mode · tempo · urgency',
  BRAIN_PATH, '            team.mode, team.genome.tempo, team.mentality.urgency,', 1);
anchor('⭐⭐⭐ THE PERCEPT PULL — the ONE `perceivedSnapshot` INSIDE the gate and the guard '
  + '(`gPullCount` measures that this instrument adds none)', BRAIN_PATH,
  '        const snapshot = match.perceivedSnapshot(p);', 1);
anchor('⭐⭐⭐ THE PERCEIVED-OWNER GUARD (M-DS.7) — the candidate exists ONLY when the eyes hold a '
  + 'MATE on the ball', BRAIN_PATH, '        if (snapshot !== null && carrierIsMate) {', 1);
anchor('⭐⭐⭐ THE RUNNING-MATES SUM (M-DS.6(b)) — clamp01(perceived forward speed ÷ his OWN top '
  + 'speed), summed over the mates his eyes hold', BRAIN_PATH,
  '              runningMates += clamp01((body.vel.x * team.attackDir) / p.topSpeed);', 1);
anchor('⭐⭐ the running-mates EXCLUSIONS — himself and the perceived carrier', BRAIN_PATH,
  '            if (mate.gid === p.gid || mate.gid === ownerGid) continue;', 1);
anchor('⭐⭐ the running-mates EXCLUSIONS — the keeper and a sent-off mate (the ROSTER read)',
  BRAIN_PATH, "            if (mate.role === 'GK' || mate.sentOff) continue;", 1);
const WHY_OWN_LINE = "          cands.push({ action: 'MakeRun', score: s, "
  + "why: 'own run in behind' });";
anchor('⭐⭐⭐ THE SEVENTH `why` LITERAL — the own run\'s own name on the decision record',
  BRAIN_PATH, WHY_OWN_LINE, 1);
anchor('⭐⭐⭐ THE HATS-OFF GATES — `if (!match.dsHatsOff) {`, EXACTLY TWO, both ENUMERATED',
  TEAMBRAIN_PATH, '  if (!match.dsHatsOff) {', 2);
anchor('⭐⭐ the `dsOwnRun` FLAG INIT — a hard `false`, never env-armed', MATCH_PATH,
  '    this.dsOwnRun = cfg.dsOwnRun ?? false;', 1);
anchor('⭐⭐ the `dsHatsOff` FLAG INIT — a hard `false`', MATCH_PATH,
  '    this.dsHatsOff = cfg.dsHatsOff ?? false;', 1);
anchor('⭐⭐ the two flags\' League union keys', LEAGUE_PATH,
  "  | 'dsOwnRun' | 'dsHatsOff'", 1);
anchor('⭐⭐ ⛔ NEITHER FLAG APPEARS IN `a4World.ts` — no world, preset or bundle can arm '
  + 'either (the count is ZERO, and that is the anchor)', A4_PATH, 'dsOwnRun', 0);
anchor('⭐⭐ ⛔ …nor `dsHatsOff` (the count is ZERO)', A4_PATH, 'dsHatsOff', 0);
const RUNNER_COUNT_HEAD = 'export function runnerCount(mode: TeamMode, tempo: number, '
  + 'urgency: number): number {';
anchor('⭐⭐⭐ `runnerCount` — THE COACH\'S OWN COUNT, CODE-MOVED and EXPORTED (DS-T0b M-DS.6(a); '
  + 'the expression exists ONCE in `src/**`)', TEAMBRAIN_PATH, RUNNER_COUNT_HEAD, 1);
anchor('⭐⭐ `runnerCount` CALL SITE 1 of 2 — the SHIPPED designation inside `assignRunners`, '
  + 'arithmetic unchanged', TEAMBRAIN_PATH,
  '    const count = runnerCount(team.mode, team.genome.tempo, team.mentality.urgency);', 1);
const ROLE_W_LINE = 'export const RUN_ROLE_W: Record<Role, number> = '
  + '{ GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };';
anchor('⭐⭐⭐ `RUN_ROLE_W` — THE COACH\'S OWN RANKING, EXPORTED (GK 0 · DF 0.4 · MF 1.2 · '
  + 'WG 1.8 · ST 2.2)', TEAMBRAIN_PATH, ROLE_W_LINE, 1, nums(ROLE_W_LINE));
const DEPTH_DIV_LINE = 'export const RUN_DEPTH_DIV = 45;';
anchor('⭐⭐⭐ `RUN_DEPTH_DIV` — the designation\'s own `/ 45`, given a home', TEAMBRAIN_PATH,
  DEPTH_DIV_LINE, 1, nums(DEPTH_DIV_LINE));
anchor('⭐⭐⭐ `RUN_PRIOR_MAX` — DERIVED IN CODE, never typed', TEAMBRAIN_PATH,
  'export const RUN_PRIOR_MAX = Math.max(...Object.values(RUN_ROLE_W)) + HALF_L / '
  + 'RUN_DEPTH_DIV;', 1);
const TIRED_LINE = '  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;';
anchor('⭐⭐ THE `tired` PREDICATE — `decideOffBall`\'s own, the limb this exam backs out',
  BRAIN_PATH, TIRED_LINE, 1, nums(TIRED_LINE));
const TIRED_MUL_LINE = 'export const OFFBALL_TIRED_MUL = 0.6;';
anchor('⭐⭐ `OFFBALL_TIRED_MUL` — the incumbent fatigue multiplier', CONST_PATH,
  TIRED_MUL_LINE, 1, nums(TIRED_MUL_LINE));
anchor('⭐⭐ `W = team.policies[p.index]` — the body\'s OWN evolved weights, the run score\'s '
  + 'own home (TWO occurrences in `PlayerBrain.ts`, both ENUMERATED)', BRAIN_PATH,
  '  const W = team.policies[p.index];', 2);

/* ---- THE DESIGNATION WRITER (DS-C0's anchors, re-taken at this head) ---- */
anchor('⭐⭐ `assignRunners` — THE DESIGNATION WRITER', TEAMBRAIN_PATH,
  'function assignRunners(team: Team, match: Match): void {', 1);
anchor('⭐⭐ `assignRunners` CALLED from `updateTeamBrain` — the 0.4 s coach tick',
  TEAMBRAIN_PATH, '  assignRunners(team, match);', 1);
anchor('⭐⭐ the runners set CLEARED at the top of `assignRunners`', TEAMBRAIN_PATH,
  '  team.runners.clear();', 2);
anchor('⭐⭐ THE POSSESSION EARLY RETURN — every tick below is an IN-POSSESSION tick',
  TEAMBRAIN_PATH, '  if (match.possessionSide !== team.side) return;', 1);
const LIVE_CORNER_LINE = "  const liveCorner = match.phase === 'restart' && "
  + "match.restart?.kind === 'corner' && match.restart.side === team.side;";
anchor('⭐⭐ THE `liveCorner` BRANCH PREDICATE — the engine\'s own restart state',
  TEAMBRAIN_PATH, LIVE_CORNER_LINE, 1);
const HELD_CRASH_LINE = '  const heldCrash = !liveCorner && team.cornerCrash !== null '
  + '&& match.simTime < team.cornerCrash.until;';
anchor('⭐⭐ THE `heldCrash` BRANCH PREDICATE', TEAMBRAIN_PATH, HELD_CRASH_LINE, 1);
anchor('⭐⭐ THE CROSS-FLIGHT BRANCH — the open-play cross\'s held licence', TEAMBRAIN_PATH,
  '  else if (cf !== null && match.ball.owner === null) {', 1);
/** ⭐⭐⭐ THE COUNT'S OWN TWO LINES — now `runnerCount`'s `return` (DS-T0b's code-move), NOT
 *  `assignRunners`' inline expression (DS-T1 anchored the inline form; it no longer exists —
 *  §DEVIATIONS). The four literals are PARSED from these two lines exactly as before. */
const COUNT_LINE_A = "  return (mode === 'CounterAttack' || tempo > 0.65 ? 2 : 1)";
const COUNT_LINE_B = '    + (urgency > 0.65 ? 1 : 0);';
anchor('⭐⭐ THE RUNNER COUNT, line 1 — CounterAttack OR tempo > 0.65 ⇒ 2 else 1 (the coach\'s '
  + 'own literals, MOVED)', TEAMBRAIN_PATH, COUNT_LINE_A, 1, nums(COUNT_LINE_A));
anchor('⭐⭐ THE RUNNER COUNT, line 2 — urgency > 0.65 ⇒ +1', TEAMBRAIN_PATH,
  COUNT_LINE_B, 1, nums(COUNT_LINE_B));
anchor('⭐⭐ THE OPEN-PLAY SCORING — the role weight plus a localX term over 45',
  TEAMBRAIN_PATH, '      .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))',
  1);
anchor('⭐⭐ the top-`count` slice ADDED to `team.runners`', TEAMBRAIN_PATH,
  '    for (const { p } of scored.slice(0, count)) team.runners.add(p.index);', 1);
const ARRIVER_TRIGGER_LINE = '    if (ballLocalX > HALF_L - 21 && Math.abs(ballPos.y) > 10) {';
anchor('⭐⭐ THE ARRIVER TRIGGER — ball deep (HALF_L − 21) AND wide (|y| > 10)', TEAMBRAIN_PATH,
  ARRIVER_TRIGGER_LINE, 1, nums(ARRIVER_TRIGGER_LINE));
anchor('⭐⭐ the arriver WRITE — TWO occurrences, both ENUMERATED (the live corner\'s routine '
  + 'pick at a deeper indent, and the open-play arriver)', TEAMBRAIN_PATH,
  '    if (pick) team.arriver = pick.index;', 2);
const OVERLAP_GATE_LINE = '    team.genome.attackingWidth * team.policy.overlapW > 0.3';
anchor('⭐⭐ THE 套边 GATE — `attackingWidth · overlapW > 0.3`', TEAMBRAIN_PATH,
  OVERLAP_GATE_LINE, 1, nums(OVERLAP_GATE_LINE));
anchor('⭐⭐ the 套边 pre-conditions — a WIDE carrier in the attacking half', TEAMBRAIN_PATH,
  '    Math.abs(carrier.pos.y) > 10 &&', 1);
const CONFRONTED_LINE = '        dist(o.pos, carrier.pos) < 5.5 &&';
anchor('⭐⭐ THE `confronted` TEST — an opponent inside 5.5 m and goal-side-ish',
  TEAMBRAIN_PATH, CONFRONTED_LINE, 1, nums(CONFRONTED_LINE));
anchor('⭐⭐ the overlapper WRITE', TEAMBRAIN_PATH,
  '      if (pick) team.overlapper = pick.index;', 1);
/* ---- THE 2过1 TRIGGER (its enclosing function is `performPass`, #405 item 1) ---- */
anchor('⭐⭐ `registerPass` — the AIM ledger writer this exam joins on', MECH_PATH,
  'function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): '
  + 'void {', 1);
anchor('⭐⭐ THE BOUNCE CLASSIFICATION — the target\'s ACTION TYPE read at the kick', MECH_PATH,
  "    target.action.type === 'MakeRun' &&", 1);
anchor('⭐⭐ `match.pendingPass` WRITTEN by `registerPass` — the aim ledger', MECH_PATH,
  '  match.pendingPass = {', 1);
const WALL_C0 = "    passer.role !== 'GK' &&";
const WALL_C1 = '    d < 15 &&';
const WALL_C2 = '    pressure > 0.2 &&';
const WALL_C3 = '    passer.stamina > 0.3 &&';
const WALL_C4 = '    team.localX(passer.pos.x) > 0 &&';
const WALL_C5 = '    ((team.genome.tempo + team.genome.passBias) / 2) * '
  + 'team.policies[passer.index].wallPassW > 0.35';
const WALL_SET = '    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };';
anchor('⭐⭐ THE 2过1 CONJUNCT 1 — the passer is not the keeper', MECH_PATH, WALL_C0, 1);
anchor('⭐⭐ THE 2过1 CONJUNCT 2 — a SHORT ball, d < 15', MECH_PATH, WALL_C1, 1, nums(WALL_C1));
anchor('⭐⭐ THE 2过1 CONJUNCT 3 — UNDER PRESSURE, > 0.2', MECH_PATH, WALL_C2, 1, nums(WALL_C2));
anchor('⭐⭐ THE 2过1 CONJUNCT 4 — FRESH LEGS, stamina > 0.3', MECH_PATH, WALL_C3, 1,
  nums(WALL_C3));
anchor('⭐⭐ THE 2过1 CONJUNCT 5 — THE ATTACKING HALF, localX > 0', MECH_PATH, WALL_C4, 1,
  nums(WALL_C4));
anchor('⭐⭐ THE 2过1 CONJUNCT 6 — THE GENE GATE, `(tempo + passBias)/2 · wallPassW > 0.35`',
  MECH_PATH, WALL_C5, 1, nums(WALL_C5));
anchor('⭐⭐⭐ THE 2过1 WRITE — THE 2.3 s LICENCE, the clock debt (c) derives its bin ceiling '
  + 'from', MECH_PATH, WALL_SET, 1, nums(WALL_SET));
anchor('⭐ the `pressure` the trigger reads — the SHIPPED `pressureAt` at the passer\'s spot '
  + '(TWO occurrences in `mechanics.ts`, both ENUMERATED)',
  MECH_PATH, '  const pressure = pressureAt(passer.pos, opp.players);', 2);
anchor('⭐ the `d` the trigger reads — passer → the LED point (THREE occurrences in '
  + '`mechanics.ts`, all ENUMERATED)', MECH_PATH, '  const d = dist(passer.pos, lead);', 3);
anchor('⭐⭐ THE ENGINE\'S OWN THROUGH-BALL COUNTER — its write site is `performThroughBall`, '
  + 'NOT `registerPass` (§DEVIATIONS 1; the #405 item 1 precedent on the wall trigger)',
  MECH_PATH, '  team.stats.throughBalls++;', 1);
anchor('⭐⭐ `performThroughBall` — the through ball\'s own enclosing function', MECH_PATH,
  'export function performThroughBall(', 1);
/* ---- THE OFF-BALL BRANCH'S `MakeRun` PUSHES ---- */
anchor('⭐⭐ `decideOffBall` — the attacking off-ball decision function', BRAIN_PATH,
  'function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {', 1);
anchor('⭐⭐ `decideOffBall` CALLED — the dispatch tail of `decidePlayer`', BRAIN_PATH,
  '  decideOffBall(p, team, opp, match);', 1);
anchor('⭐⭐ THE LICENSED-RUN PUSH\'s GUARD — `team.runners.has(p.index) || arriving`',
  BRAIN_PATH,
  "    if ((team.runners.has(p.index) || arriving) && (carrier ? carrier !== p : "
  + "match.phase === 'restart' || crashLive || crossLive)) {", 1);
const WHY_ARRIVING_LINE = "          ? 'arriving late at the cutback arc'";
const WHY_BOX_LINE = "          : match.phase === 'restart' || crashLive ? "
  + "'attacking the box for the delivery' : 'licensed run in behind',";
anchor('⭐⭐ THE WINNER\'S `why` — ARRIVING LATE', BRAIN_PATH, WHY_ARRIVING_LINE, 1);
anchor('⭐⭐ THE WINNER\'S `why` — ATTACKING THE BOX / LICENSED RUN IN BEHIND', BRAIN_PATH,
  WHY_BOX_LINE, 1);
const WHY_BURST_LINE = "      cands.push({ action: 'MakeRun', score: s, "
  + "why: 'bursting for the one-two return' });";
anchor('⭐⭐ THE ONE-TWO BURST PUSH and its `why`', BRAIN_PATH, WHY_BURST_LINE, 1);
anchor('⭐⭐ its GUARD — `p.wallRun && simTime < until − 1.1`', BRAIN_PATH,
  '    if (p.wallRun && match.simTime < p.wallRun.until - 1.1 && carrier && carrier !== p) {',
  1);
const WHY_OVERLAP_LINE = "      cands.push({ action: 'MakeRun', score: s, "
  + "why: 'overlapping outside the carrier' });";
anchor('⭐⭐ THE OVERLAP PUSH and its `why`', BRAIN_PATH, WHY_OVERLAP_LINE, 1);
anchor('⭐⭐ its GUARD — `team.overlapper === p.index`', BRAIN_PATH,
  '    if (team.overlapper === p.index && carrier && carrier !== p) {', 1);
const WHY_KEEPERUP_LINE = "      scores: [{ action: 'MakeRun', score: 1, "
  + "why: 'keeper UP for the corner — nothing left to lose' }],";
anchor('⭐⭐ THE KEEPER-UP CORNER RUN — the one `MakeRun` outside `decideOffBall`', BRAIN_PATH,
  WHY_KEEPERUP_LINE, 1);
anchor('⭐⭐ its GUARD — `team.keeperUp`', BRAIN_PATH, '  if (team.keeperUp) {', 1);
anchor('⭐⭐ THE DECISION RECORD — the winner FIRST (TWO occurrences, both ENUMERATED)',
  BRAIN_PATH, '  cands.sort((a, b) => b.score - a.score);', 2);
anchor('⭐⭐ the record\'s own `scores` slice — the top FOUR candidates (⚠ the runMul back-out '
  + 'can only see a run candidate that reached the top four)', BRAIN_PATH,
  '    scores: cands.slice(0, 4),', 1);
/* ---- THE EXECUTOR (byte-untouched by the seam) ---- */
anchor('⭐⭐ the executor\'s `MakeRun` case', EXEC_PATH, "    case 'MakeRun': {", 1);
anchor('⭐⭐ `executeAction` — its enclosing function', EXEC_PATH,
  'export function executeAction(p: Player, match: Match, dt: number): void {', 1);
anchor('⭐⭐ ⛔ NEITHER DS FLAG APPEARS IN THE EXECUTOR (the count is ZERO)', EXEC_PATH,
  'dsOwnRun', 0);
/* ---- THE LEDGERS ---- */
anchor('⭐⭐ `pendingPass` — the AIM ledger', MATCH_PATH,
  '  pendingPass: PendingPass | null = null;', 1);
anchor('⭐⭐ `lastCompletedPass` — THE COMPLETION RECORD', MATCH_PATH,
  '  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;', 1);
anchor('⭐⭐ `shotLog` — the shot ledger', MATCH_PATH, '  shotLog: ShotLogEntry[] = [];', 1);
anchor('⭐⭐⭐ THE SHOT PUSH\'s OWN JOIN — `pendingShot.logIndex` (debt (b) records the shooter '
  + 'gid HERE, while the shot is live)', MATCH_PATH, '  pendingShot: PendingShot | null = null;',
  1);
anchor('⭐⭐ `markShotOutcome` — the ONE writer of the outcome (first outcome wins)', MATCH_PATH,
  "  markShotOutcome(outcome: 'goal' | 'saved' | 'miss'): void {", 1);
anchor('⭐⭐ `possessionSide` — the possession side of record', MATCH_PATH,
  '  possessionSide: Side | -1 = -1;', 1);
anchor('⭐⭐ THE ENGINE\'S OWN ONE-TWO LEDGER — `stats.oneTwos` at the return\'s arrival',
  MATCH_PATH, '          team.stats.oneTwos++;', 1);
anchor('⭐⭐ THE ENGINE\'S OWN OVERLAP LEDGER — `stats.overlaps` when the release lands WIDE',
  MATCH_PATH,
  '        if (team.overlapper === p.index && Math.abs(p.pos.y) > 11) team.stats.overlaps++;',
  1);
anchor('⭐ THE ENGINE\'S OWN THIRD-MAN LEDGER', MATCH_PATH,
  "        if (pass.bounce && p.gid === pass.targetGid) team.stats.thirdMan++;", 1);
anchor('⭐⭐ THE COACH TICK — `updateTeamBrain` called under the 0.4 s timer', MATCH_PATH,
  '        updateTeamBrain(team, this);', 1);
anchor('⭐⭐ the coach timer\'s own decrement and guard', MATCH_PATH,
  '      team.brainTimer -= dt;', 1);
anchor('⭐⭐⭐ THE PLAYER DECISION GATE — `decisionTimer <= 0 && !pcHeld`', MATCH_PATH,
  '      if (p.decisionTimer <= 0 && !pcHeld) {', 1);
anchor('⭐⭐⭐ DEBT (a) — `pcHeld` READS `holdFor(p.gid, this.stepCount)` INSIDE the decide loop',
  MATCH_PATH, '      const pcHeld = p.decisionTimer <= 0 && this.pcLatency !== null\n'
  + '        && this.pcLatency.holdFor(p.gid, this.stepCount) !== null;', 1);
anchor('⭐⭐⭐ DEBT (a) — THE ENGINE\'S OWN LEDGER of held decisions, the calibration target',
  MATCH_PATH, '      if (pcHeld) (this.pcLatency as PcLatencySeat).ledger.decisionsHeld++;', 1);
anchor('⭐⭐⭐ DEBT (a) — `pcLatencyObserve` runs INSIDE the step and BEFORE `stepCount++`, '
  + 'which is why DS-C0\'s PRE-STEP read missed holds armed in the same step', MATCH_PATH,
  '    if (this.pcLatency !== null) this.pcLatencyObserve();\n'
  + '    // ⭐⭐ RC T0b §SEAM — THE HEADING MEMORY\'S SHIFT, the same observe-hook position and '
  + 'for', 1);
anchor('⭐⭐ its re-arm at `AI_INTERVAL`', MATCH_PATH, '        p.decisionTimer = AI_INTERVAL;', 1);
anchor('⭐ the decision timer\'s own decrement — inside `physicsStep`, AFTER the decide loop',
  PLAYER_PATH, '    this.decisionTimer -= dt;', 1);
anchor('⭐ `wallRun` — the per-player licence field', PLAYER_PATH,
  '  wallRun: { until: number; partnerGid: number } | null = null;', 1);
anchor('⭐ `team.runners` — the designation set', TEAM_PATH, '  runners = new Set<number>();', 1);
anchor('⭐ `team.arriver`', TEAM_PATH, '  arriver: number | null = null;', 1);
anchor('⭐ `team.overlapper`', TEAM_PATH, '  overlapper: number | null = null;', 1);
anchor('⭐⭐ `team.policies` — the per-body weight vectors `W` comes from', TEAM_PATH,
  '  readonly policies: PolicyParams[];', 1);
anchor('⭐⭐ THE GENOME VIEWS — `baseGenome` / `effGenome` are the franchise\'s OWN object '
  + 'until something replaces them, which is WHY the dose de-aliases before writing', TEAM_PATH,
  '    this.baseGenome = info.genome;\n    this.effGenome = info.genome;', 1);
anchor('⭐⭐ `team.genome` IS `effGenome` — the view the seat reads', TEAM_PATH,
  '  get genome(): TacticalGenome {\n    return this.effGenome;', 1);
anchor('⭐⭐ THE DE-ALIASING IDIOM this exam copies — the engine\'s own (`setCbProneness`)',
  A4_PATH, '  const view = { ...team.baseGenome, cbCarryProneness: dose } as TacticalGenome;\n'
  + '  team.baseGenome = view;\n  team.effGenome = view;', 1);
/* ---- THE CADENCE CONSTANTS ---- */
anchor('⭐⭐ `TEAM_AI_INTERVAL` = 0.4 — THE COACH\'S OWN CADENCE', CONST_PATH,
  'export const TEAM_AI_INTERVAL = 0.4;', 1, 0.4);
anchor('⭐⭐ `AI_INTERVAL` = 0.15 — the player\'s decision cadence', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, 0.15);
anchor('`DT`', CONST_PATH, 'export const DT = 1 / 60;', 1, 1 / 60);
/* ---- THE OBM SEAT ---- */
anchor('⭐⭐ the OBM seat\'s docblock claim — `perceivedSnapshot` is the seat\'s ONLY member of '
  + '`match`', EYES_PATH, '`perceivedSnapshot` is the ONLY member of', 1);
const SCORE_SPAN_LINE = 'export const OBM_SCORE_SPAN = 1 - OFFBALL_TIRED_MUL;';
anchor('⭐⭐⭐ `OBM_SCORE_SPAN` — DERIVED IN CODE as `1 − OFFBALL_TIRED_MUL`; the seat\'s '
  + 'multiplier lives in [1 − span, 1 + span] and THAT is the runMul histogram\'s frozen range',
  EYES_PATH, SCORE_SPAN_LINE, 1);
anchor('⭐⭐ `runMul = 1 + output_runScore · OBM_SCORE_SPAN` — the seat\'s own arithmetic',
  EYES_PATH, '    runMul: 1 + outputs[3] * OBM_SCORE_SPAN,', 1);
anchor('⭐⭐ THE ONE `obmMovement` BRAIN FORK — the seat\'s only percept pull', BRAIN_PATH,
  '    if (match.obmMovement) {', 1);
anchor('⭐⭐ the fork\'s own `obmRunMul` assignment', BRAIN_PATH,
  '      obmRunMul = obm.runMul;', 1);
anchor('⭐⭐ `s *= obmRunMul` — TWO occurrences as a SUBSTRING, both ENUMERATED: the LICENSED '
  + 'run\'s own score site and (at a deeper indent) the OWN RUN\'s. The multiplier is applied '
  + 'LAST at both, which is what makes the back-out exact', BRAIN_PATH,
  '      s *= obmRunMul;', 2);
anchor('⭐ the `obmMovement` MatchConfig flag DEFAULTS FALSE', MATCH_PATH,
  '    this.obmMovement = cfg.obmMovement ?? false;', 1);
anchor('⭐⭐ `OBM_FEATURE_KEYS`', GENOME_PATH, 'export const OBM_FEATURE_KEYS = [', 1);
anchor('⭐⭐ `OBM_OUTPUT_KEYS`', GENOME_PATH, 'export const OBM_OUTPUT_KEYS = [', 1);
anchor('⭐⭐ `OBM_WEIGHT_SLOTS` — DERIVED from the two key lists', GENOME_PATH,
  'export const OBM_WEIGHT_SLOTS = OBM_OUTPUT_KEYS.length * OBM_FEATURE_KEYS.length;', 1);
anchor('⭐⭐ `OBM_WEIGHT_MIN` — IMPORTED, never typed', GENOME_PATH,
  'export const OBM_WEIGHT_MIN = CTB_GENE_MIN;', 1);
anchor('⭐⭐ `OBM_WEIGHT_MAX` — IMPORTED, never typed', GENOME_PATH,
  'export const OBM_WEIGHT_MAX = CTB_GENE_MAX;', 1);
anchor('⭐⭐ `offballMovementWeights` — the genome door, OPTIONAL and DEFAULT-ABSENT',
  GENOME_PATH, '  offballMovementWeights?: number[];', 1);
/* ---- THE WORLDS ---- */
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door, the composer CALLING world 12', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `bqArmedVersion` — the world-13 gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);
anchor('⭐⭐ `lnArmedVersion` — the world-14 gate', A4_PATH,
  'export function lnArmedVersion(match: Match): 0 | LnWorldVersion {', 1);
anchor('⭐⭐ `gkArmedVersion` — the world-15 gate', A4_PATH,
  'export function gkArmedVersion(match: Match): 0 | GkWorldVersion {', 1);
/* ---- ⭐⭐ G-DOSE-COPY's ANCHORS: the OBM-T1 lines this instrument BYTE-COPIES ---- */
anchor('⭐⭐ DOSE COPY — OBM-T1\'s `IDX` slot convention', OBMT1_PATH,
  'const IDX = (output: number, feature: number): number => output * OBM_FEATURE_KEYS.length '
  + '+ feature;', 1);
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
anchor('⭐⭐ DOSE COPY — MARKER-ESCAPE, the dose DS-T1 used (read here only so the struck '
  + 'choice of #407 §CORR 6(i) is anchored, NOT walked by this exam)', OBMT1_PATH,
  '  markerEscape: matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX]),', 1);
anchor('⭐⭐⭐ DOSE COPY — KITCHEN-SINK, THE CEILING PROBE, BYTE FOR BYTE (obm-t1-policy-exam.ts '
  + 'l.500–509: the IIFE head)', OBMT1_PATH, '  kitchenSink: ((): number[] => {', 1);
anchor('⭐⭐⭐ DOSE COPY — KITCHEN-SINK\'s own sweep, BYTE FOR BYTE (its four assignment lines '
  + 'and the loop head)', OBMT1_PATH,
  '    for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) {\n'
  + '      w[IDX(O_DEPTH, f)] = MIN;\n'
  + '      w[IDX(O_WIDTH, f)] = MAX;\n'
  + '      w[IDX(O_SUPPORT, f)] = MAX;\n'
  + '      w[IDX(O_RUN, f)] = MIN;\n'
  + '    }', 1);
anchor('⭐⭐ DOSE COPY — the SPACE-SEEK line, read as the ANCHOR for OBM-T1\'s own MIN idiom '
  + '(RUN-CAUTION is a HAND-SET PROBE CORNER in this same idiom, declared as one, NOT copied '
  + 'from any dose of record)', OBMT1_PATH,
  '  spaceSeek: matrix([O_WIDTH, F3, MAX], [O_DEPTH, F3, MIN]),', 1);
/* ---- ⭐⭐ THE GUARD TOLERANCE — INHERITED BY ANCHOR, never typed as a decimal ---- */
anchor('⭐⭐⭐ GUARD TOLERANCE — `NI_FRACTION` as an EXPRESSION in CTB-T1\'s probe', CTBT1_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('⭐⭐ …and the SAME expression in DLC-T1\'s probe, read as a SECOND source', DLCT1_PATH,
  'const NI_FRACTION = 1 - 0.275 / 0.380;', 1);
anchor('⭐ LN-T1′b\'s OWN offside FLAG form (#157): a resolved INCREASE flags and gates nothing',
  LNT1PB_PATH, '    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,', 1);
/* ---- ⭐⭐ THE CROWDING FAMILY — inherited BY ANCHOR from the A4 battery / PT-C0 / OBM-T1 ---- */
anchor('⭐⭐ `DUP_RUN_M` — the A4 battery I6 duplicate-run bucket (NO new constant)', A4P1C_PATH,
  'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)', 1, 4);
anchor('⭐⭐ `SAMPLE_EVERY` — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);
anchor('⭐⭐ PT-C0\'s 撞车 line — the face `crowd.crashShare` IS', PTC0_PATH,
  '          if (mp < DUP_RUN_M) row.crashHits += 1;', 1);
anchor('⭐⭐ PT-C0\'s sample cadence line', PTC0_PATH,
  '    if (tick % SAMPLE_EVERY === 0 && playing) {', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `PAIR_SUBSAMPLE`', OBMT1_PATH,
  'const PAIR_SUBSAMPLE = 6;', 1, 6);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `CLOSE_PAIR_M`', OBMT1_PATH, 'const CLOSE_PAIR_M = 4;', 1, 4);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `spacingUnder4` fold (the face beside the crowding pair)',
  OBMT1_PATH, '  r.spacingUnder4 = bothPairs.length === 0 ? Number.NaN\n'
  + '    : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length;', 1);
anchor('⭐⭐ X-FP-PROD — the PRODUCTION FINGERPRINT BASELINE, inherited from OBM-T1\'s probe',
  OBMT1_PATH,
  "const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';",
  1);

/* ========================================================================== */
/* §4 THE EXTRACTED LITERALS — every constant below is PARSED from an anchored line          */
/* ========================================================================== */
const RRW = nums(ROLE_W_LINE);                 /* [0, 0.4, 1.2, 1.8, 2.2] */
const ROLE_W_GK = RRW[0]; const ROLE_W_DF = RRW[1]; const ROLE_W_MF = RRW[2];
const ROLE_W_WG = RRW[3]; const ROLE_W_ST = RRW[4];
const DEPTH_DIV_EXTRACTED = nums(DEPTH_DIV_LINE)[0];   /* 45 */
const TIRED_STAMINA = nums(TIRED_LINE)[0];             /* 0.4 */
const TIRED_CONSERVATION = nums(TIRED_LINE)[1];        /* 0.5 */
const TIRED_MUL_EXTRACTED = nums(TIRED_MUL_LINE)[0];   /* 0.6 */
const TEMPO_HIGH = nums(COUNT_LINE_A)[0];      /* 0.65 */
const COUNT_HIGH = nums(COUNT_LINE_A)[1];      /* 2 */
const COUNT_BASE = nums(COUNT_LINE_A)[2];      /* 1 */
const URGENCY_HIGH = nums(COUNT_LINE_B)[0];    /* 0.65 */
const ARRIVER_DEPTH = nums(ARRIVER_TRIGGER_LINE)[0]; /* 21 */
const ARRIVER_WIDE = nums(ARRIVER_TRIGGER_LINE)[1];  /* 10 */
const OVERLAP_GATE = nums(OVERLAP_GATE_LINE)[0];     /* 0.3 */
const CONFRONT_R = nums(CONFRONTED_LINE)[0];         /* 5.5 */
const WALL_D = nums(WALL_C1)[0];               /* 15 */
const WALL_PRESSURE = nums(WALL_C2)[0];        /* 0.2 */
const WALL_STAMINA = nums(WALL_C3)[0];         /* 0.3 */
const WALL_HALF = nums(WALL_C4)[0];            /* 0 */
const WALL_GENE = nums(WALL_C5)[1];            /* 0.35 (the `/ 2` divisor is nums[0]) */
const WALL_GENE_DIV = nums(WALL_C5)[0];        /* 2 */
const WALL_WINDOW = nums(WALL_SET)[0];         /* 2.3 — the licence's own clock */
const WHY_ARRIVING = firstQuoted(WHY_ARRIVING_LINE);
const WHY_BOX = firstQuoted(WHY_BOX_LINE.slice(WHY_BOX_LINE.indexOf('? ')));
const WHY_LICENSED = firstQuoted(WHY_BOX_LINE.slice(WHY_BOX_LINE.lastIndexOf(': ')));
const WHY_BURST = firstQuoted(WHY_BURST_LINE.slice(WHY_BURST_LINE.indexOf('why: ')));
const WHY_OVERLAP = firstQuoted(WHY_OVERLAP_LINE.slice(WHY_OVERLAP_LINE.indexOf('why: ')));
const WHY_KEEPERUP = firstQuoted(WHY_KEEPERUP_LINE.slice(WHY_KEEPERUP_LINE.indexOf('why: ')));
/** ⭐⭐⭐ THE SEVENTH LITERAL — EXTRACTED from the seam's own push line, never typed. */
const WHY_OWN = firstQuoted(WHY_OWN_LINE.slice(WHY_OWN_LINE.indexOf('why: ')));
const CUTBACK_PREFIX = 'cutback to ';
const CUTBACK_WHY_LINE = '        why: ' + BT + 'cutback to ' + DOLLAR + '{arr.name} at the arc '
  + '· lane ' + DOLLAR + '{lane.toFixed(2)} · open ' + DOLLAR + '{open.toFixed(2)}' + BT + ',';
anchor('⭐⭐ THE ARRIVER CUTBACK candidate\'s own `why` — the DECISION RECORD it is read off',
  BRAIN_PATH, CUTBACK_WHY_LINE, 1);
anchor('⭐⭐ READ 4 — the ARRIVER CUTBACK reads the LABEL `team.arriver`', BRAIN_PATH,
  '    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&', 1);
anchor('⭐⭐ READ 1 — the WALL-RETURN bonus reads the LABEL `wallRun.partnerGid`', BRAIN_PATH,
  '        mate.wallRun.partnerGid === p.gid &&', 1);
anchor('⭐⭐ READ 2 — the THIRD-MAN bonus reads a mate\'s ACTION TYPE', BRAIN_PATH,
  "        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15", 1);
anchor('⭐⭐ READ 3 — the 套边 RELEASE reads the LABEL `team.overlapper`', BRAIN_PATH,
  '        team.overlapper === mate.index &&', 1);
anchor('⭐⭐ READ 3\'s DEVELOPED-OVERLAP conjuncts (wide, and level or beyond)', BRAIN_PATH,
  '        Math.abs(mate.pos.y) > 9 &&', 1);
anchor('⭐⭐ THE FIFTH ACTION-TYPE READ — the THROUGH-BALL\'s runner scan', BRAIN_PATH,
  "      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;", 1);

/** ⭐⭐⭐ THE GUARD TOLERANCE FRACTION — INHERITED BY ANCHOR from CTB-T1's own probe line and
 *  EVALUATED FROM ITS TWO NUMERALS. ⛔ NEVER TYPED AS A DECIMAL anywhere in this instrument;
 *  DLC-T1's identical line is read as a SECOND source and required to agree. */
const niPair = (path: string): [number, number] => {
  const m = SRC_OF[path].match(/const NI_FRACTION = 1 - (0\.\d+) \/ (0\.\d+);/);
  return m === null ? [Number.NaN, Number.NaN] : [Number(m[1]), Number(m[2])];
};
const NI_A = niPair(CTBT1_PATH);
const NI_B = niPair(DLCT1_PATH);
const NI_FRACTION = 1 - NI_A[0] / NI_A[1];
const NI_FRACTION_SECOND_SOURCE = 1 - NI_B[0] / NI_B[1];
const NI_OK = Number.isFinite(NI_FRACTION) && NI_FRACTION > 0 && NI_FRACTION < 1
  && NI_FRACTION === NI_FRACTION_SECOND_SOURCE;
/** ⭐⭐ THE CROWDING CONSTANTS — ANCHORED, never new. */
const DUP_RUN_M = 4;
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
/** X-FP-PROD's pin, inherited from OBM-T1's probe (anchored above). */
const FP_PROD_PIN = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
/** ⭐⭐ THE FROZEN YIELD WINDOW — DS-C0's own constant, re-taken so the yields are comparable. */
const YIELD_WINDOW_SECONDS = 6;
/** ⭐⭐⭐ DEBT (c) — ONE FULL `wallRun` LICENCE IN TICKS, **DERIVED** from the licence's own
 *  2.3 s (extracted from `WALL_SET`) and `DT`. NEVER TYPED. The episode-tick histogram's top bin
 *  must open BEYOND this, so a `120+` catch-all can never swallow a full licence again. */
const WALL_LICENCE_TICKS = Math.round(WALL_WINDOW / DT);
/** THE ACTION VOCABULARY — read off `ActionType`'s OWN union, never re-typed. */
const AT_START = 'export type ActionType =';
const atIdx = SRC_OF[TYPES_PATH].indexOf(AT_START);
const ACTIONS = (SRC_OF[TYPES_PATH].slice(atIdx, SRC_OF[TYPES_PATH].indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};
const LITERALS_OK = ROLE_W_GK === 0 && ROLE_W_DF === 0.4 && ROLE_W_MF === 1.2
  && ROLE_W_WG === 1.8 && ROLE_W_ST === 2.2
  && RUN_ROLE_W.GK === ROLE_W_GK && RUN_ROLE_W.DF === ROLE_W_DF && RUN_ROLE_W.MF === ROLE_W_MF
  && RUN_ROLE_W.WG === ROLE_W_WG && RUN_ROLE_W.ST === ROLE_W_ST
  && DEPTH_DIV_EXTRACTED === RUN_DEPTH_DIV
  && RUN_PRIOR_MAX === Math.max(ROLE_W_GK, ROLE_W_DF, ROLE_W_MF, ROLE_W_WG, ROLE_W_ST)
    + HALF_L / DEPTH_DIV_EXTRACTED
  && TIRED_STAMINA === 0.4 && TIRED_CONSERVATION === 0.5
  && TIRED_MUL_EXTRACTED === OFFBALL_TIRED_MUL
  && OBM_SCORE_SPAN === 1 - OFFBALL_TIRED_MUL
  && TEMPO_HIGH === 0.65 && COUNT_HIGH === 2 && COUNT_BASE === 1 && URGENCY_HIGH === 0.65
  && runnerCount('BuildUp', 0, 0) === COUNT_BASE
  && runnerCount('CounterAttack', 0, 0) === COUNT_HIGH
  && runnerCount('CounterAttack', 1, 1) === COUNT_HIGH + 1
  && ARRIVER_DEPTH === 21 && ARRIVER_WIDE === 10 && OVERLAP_GATE === 0.3 && CONFRONT_R === 5.5
  && WALL_D === 15 && WALL_PRESSURE === 0.2 && WALL_STAMINA === 0.3 && WALL_HALF === 0
  && WALL_GENE === 0.35 && WALL_GENE_DIV === 2 && WALL_WINDOW === 2.3
  && WHY_ARRIVING === 'arriving late at the cutback arc'
  && WHY_BOX === 'attacking the box for the delivery'
  && WHY_LICENSED === 'licensed run in behind'
  && WHY_BURST === 'bursting for the one-two return'
  && WHY_OVERLAP === 'overlapping outside the carrier'
  && WHY_KEEPERUP.startsWith('keeper UP for the corner')
  && WHY_OWN === 'own run in behind'
  && SRC_OF[BRAIN_PATH].includes(CUTBACK_WHY_LINE)
  && TEAM_AI_INTERVAL === 0.4 && AI_INTERVAL === 0.15 && DT === 1 / 60
  && NI_OK && ACTIONS.includes('MakeRun') && ACTIONS.includes('MoveToFormationSpot');

/* ========================================================================== */
/* §5 SEEDS — block 12,554,000–999 (#406 items 5(vii) and 8)                   */
/* ========================================================================== */
const BLOCK_BASE = 12_555_000;
const BLOCK_TOP = 12_555_999;
/** ⭐⭐ N_FROZEN = 999 — the block's OWN AFFORDANCE after the construction receipt at
 *  12,555,999 (battery seeds 12,555,000–12,555,998). §DEV-PREFLIGHT's sizing rows are computed
 *  and stored; N = min(nRequired, the affordance) is taken as the AFFORDANCE, and each row says
 *  whether it is resolvable at N_FROZEN. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_006_600;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const XDET_SEEDS = LOCKSTEP_SEEDS;
const FIXTURE_SEED = SCRATCH_BASE + 99;
/** ⭐⭐⭐ G-REPRO-DST1's RE-WALK band — DS-T1's OWN CONSUMED block. NOT a consumption. */
const REPRO_SEEDS = Array.from({ length: 12 }, (_, i) => 12_554_000 + i);
/** ⭐⭐⭐ DS-T1's ARTIFACT — the numbers of record this exam re-walks against and quotes BY FIELD
 *  (H-DS-3's +1.248030 and H-DS-4's +2.787788 are READ OUT OF IT, never typed here). */
const DST1_ARTIFACT = 'docs/world-model/data/ds-t1-own-run-exam.json';

/* ========================================================================== */
/* §6 THE ARMS — NINE, PAIRED on shared seeds; the composer CALLED, never copied              */
/* ========================================================================== */
const ARMS = [
  'HATS-E13-ABSENT', 'HATS-E13-RUNCAUTION', 'HATS-E13-KITCHENSINK',
  'HATSOWN-E13-ABSENT', 'HATSOWN-E13-RUNCAUTION', 'HATSOWN-E13-KITCHENSINK',
  'OWN-E13-ABSENT', 'OWN-E13-RUNCAUTION', 'OWN-E13-KITCHENSINK',
  'HATS-D13', 'HATSOWN-D13', 'OWN-D13',
] as const;
type Arm = (typeof ARMS)[number];
/** ⭐⭐⭐ THE ARM OF RECORD for the reads (#408 item 5(i)). */
const ARM_OF_RECORD: Arm = 'OWN-E13-ABSENT';
/** ⭐⭐⭐ "dosed" IN THE READS = RUN-CAUTION (#408 item 5(i)) — the KITCHEN-SINK arm's own word is
 *  STORED BESIDE as a counterfactual, never as the selector. */
const DOSED_ARM_OF_RECORD: Arm = 'OWN-E13-RUNCAUTION';
const CEILING_ARM: Arm = 'OWN-E13-KITCHENSINK';
type DoseKind = 'ABSENT' | 'RUNCAUTION' | 'KITCHENSINK';
const DOSE_KINDS = ['ABSENT', 'RUNCAUTION', 'KITCHENSINK'] as const;
const ARM_DOSE: Record<Arm, DoseKind> = {
  'HATS-E13-ABSENT': 'ABSENT', 'HATS-E13-RUNCAUTION': 'RUNCAUTION',
  'HATS-E13-KITCHENSINK': 'KITCHENSINK',
  'HATSOWN-E13-ABSENT': 'ABSENT', 'HATSOWN-E13-RUNCAUTION': 'RUNCAUTION',
  'HATSOWN-E13-KITCHENSINK': 'KITCHENSINK',
  'OWN-E13-ABSENT': 'ABSENT', 'OWN-E13-RUNCAUTION': 'RUNCAUTION',
  'OWN-E13-KITCHENSINK': 'KITCHENSINK',
  'HATS-D13': 'ABSENT', 'HATSOWN-D13': 'ABSENT', 'OWN-D13': 'ABSENT',
};
const ARM_LABEL: Record<Arm, string> = {
  'HATS-E13-ABSENT': 'world 13 EMPTY-BOOK, neither DS flag, OBM seat ABSENT — THE SHIPPED PATH '
    + 'and ③\'s control (DS-T1\'s own arm of the same name, re-walked; G-REPRO-DST1 compares it '
    + 'field for field)',
  'HATS-E13-RUNCAUTION': 'the same, OBM seat DOSED at RUN-CAUTION (the PROBE CORNER)',
  'HATS-E13-KITCHENSINK': 'the same, OBM seat DOSED at KITCHEN-SINK (the CEILING PROBE)',
  'HATSOWN-E13-ABSENT': 'world 13 EMPTY-BOOK + `dsOwnRun` — THE ADDITIVE FORM, seat ABSENT',
  'HATSOWN-E13-RUNCAUTION': 'the additive form, seat DOSED at RUN-CAUTION',
  'HATSOWN-E13-KITCHENSINK': 'the additive form, seat DOSED at KITCHEN-SINK',
  'OWN-E13-ABSENT': '⭐⭐⭐ world 13 EMPTY-BOOK + `dsOwnRun` + `dsHatsOff` — OWN RUN ALONE with '
    + 'the RESTRAINT in the player, seat ABSENT. THE ARM OF RECORD (H-DS-3 · H-DS-4).',
  'OWN-E13-RUNCAUTION': '⭐⭐⭐ OWN RUN ALONE, seat DOSED at RUN-CAUTION — "dosed" in the reads; '
    + 'H-DS-2\'s arm (the first dose whose `runScore` row is NOT zero)',
  'OWN-E13-KITCHENSINK': 'OWN RUN ALONE, seat DOSED at KITCHEN-SINK — the CEILING probe, its '
    + 'word STORED BESIDE as a counterfactual',
  'HATS-D13': 'world 13 DOSED (the played form, the SHIPPED loaders) — the shipped path, BESIDE',
  'HATSOWN-D13': 'the played form + `dsOwnRun`, BESIDE',
  'OWN-D13': 'the played form + `dsOwnRun` + `dsHatsOff`, BESIDE',
};
type ArmFlagKind = 'HATS' | 'HATSOWN' | 'OWN';
const ARM_KIND: Record<Arm, ArmFlagKind> = Object.fromEntries(ARMS.map((a) => [a,
  a.startsWith('HATSOWN') ? 'HATSOWN' : a.startsWith('OWN') ? 'OWN' : 'HATS',
])) as Record<Arm, ArmFlagKind>;
const ARM_DOSED: Record<Arm, boolean> = Object.fromEntries(ARMS.map((a) => [a,
  ARM_DOSE[a] !== 'ABSENT'])) as Record<Arm, boolean>;
const ARM_BOOK: Record<Arm, 'E13' | 'D13'> = Object.fromEntries(ARMS.map((a) => [a,
  a.endsWith('-D13') ? 'D13' : 'E13'])) as Record<Arm, 'E13' | 'D13'>;
const E13_ARMS = ARMS.filter((a) => ARM_BOOK[a] === 'E13');
const DOSED_ARMS = ARMS.filter((a) => ARM_DOSED[a]);
/** the R1 / band PAIRINGS: every arm is compared to the HATS arm at the SAME seat state and the
 *  SAME book (#406 item 5(ii), inherited: "paired Δ of the mean vs HATS (same seat state)"). */
const CONTROL_OF: Record<Arm, Arm> = Object.fromEntries(ARMS.map((a) => [a,
  ARM_BOOK[a] === 'D13' ? 'HATS-D13'
    : ARM_DOSE[a] === 'ABSENT' ? 'HATS-E13-ABSENT'
      : ARM_DOSE[a] === 'RUNCAUTION' ? 'HATS-E13-RUNCAUTION' : 'HATS-E13-KITCHENSINK',
])) as Record<Arm, Arm>;
const CONTRAST_ARMS = ARMS.filter((a) => CONTROL_OF[a] !== a);
const ARMS_KIND_OK = ARMS.every((a) => (ARM_KIND[a] === 'HATS') === a.startsWith('HATS-'))
  && ARM_KIND['HATSOWN-D13'] === 'HATSOWN' && ARM_KIND['OWN-E13-ABSENT'] === 'OWN'
  && CONTRAST_ARMS.length === ARMS.length - 4;

/* ---- THE SHIPPED DOSE LOADERS (the D13 arms), the DS-C0 form ---- */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('DS-T1b FATAL — a dose file\'s BYTES do not match the pinned value');
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
const D13_REACHABLE = L3_DOSE !== null && PC_DOSE !== null
  && L3_DOSE.some((c) => c.lunges > 0) && PC_DOSE.some((row) => row.some((v) => v > 0));
if (!D13_REACHABLE) {
  banner(`DS-T1b FATAL — the D13 arms are not reachable: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}

/* ---- ⭐⭐⭐ THE OBM DOSE, BYTE-COPIED FROM OBM-T1 / LN-T1 (every line ANCHORED at §3) ---- */
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
/** ⭐⭐⭐ RUN-CAUTION — a HAND-SET PROBE CORNER in OBM-T1's own `matrix(...)` idiom (#408 item
 *  5(i)): `targetCongestion` (F3) and `ownMarker` (F2) price the RUN DOWN at the domain MINIMUM,
 *  the plane and support rows all zero. ⛔ DECLARED A PROBE, **NOT a dose of record** — the dose
 *  space belongs to selection (#390). It is the FIRST dose this exam family has walked whose
 *  `runScore` row is non-zero, which is the whole point (#407 item 3 struck MARKER-ESCAPE). */
const RUN_CAUTION = matrix([O_RUN, F3, MIN], [O_RUN, F2, MIN]);
/** ⭐⭐⭐ KITCHEN-SINK — OBM-T1's CEILING PROBE, BYTE-COPIED from its own lines (anchored at §3):
 *  all sixteen slots at a domain corner, the `runScore` row at MIN. Not a football
 *  recommendation and nothing about it is proposed for shipping. */
const KITCHEN_SINK = ((): number[] => {
  const w = ZERO_MATRIX();
  for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) {
    w[IDX(O_DEPTH, f)] = MIN;
    w[IDX(O_WIDTH, f)] = MAX;
    w[IDX(O_SUPPORT, f)] = MAX;
    w[IDX(O_RUN, f)] = MIN;
  }
  return w;
})();
const DOSE_MATRIX: Record<DoseKind, number[] | null> = {
  ABSENT: null, RUNCAUTION: RUN_CAUTION, KITCHENSINK: KITCHEN_SINK,
};
/** ⭐⭐ G-DOSE-COPY's SECOND, INDEPENDENTLY SHAPED DERIVATION, straight off the `OBM_*` exports
 *  (LN-T1's form): a full (output × feature) sweep filling each slot from a per-arm RULE, and
 *  compared slot for slot against the matrices above. A DIFFERENT SHAPE over the same
 *  convention — never a second copy of the same expression. */
const doseFromExports = (kind: DoseKind): number[] | null => {
  const nF = OBM_FEATURE_KEYS.length;
  const nO = OBM_OUTPUT_KEYS.length;
  if (kind === 'ABSENT') return null;
  const w = new Array<number>(nO * nF).fill(0);
  for (let o = 0; o < nO; o++) {
    for (let f = 0; f < nF; f++) {
      const slot = o * nF + f;
      if (kind === 'RUNCAUTION') {
        w[slot] = (o === 3 && (f === 1 || f === 2)) ? OBM_WEIGHT_MIN : 0;
      } else {
        w[slot] = (o === 0 || o === 3) ? OBM_WEIGHT_MIN : OBM_WEIGHT_MAX;
      }
    }
  }
  return w;
};
const runRowOf = (w: readonly number[]): number[] =>
  [F1, F2, F3, F4].map((f) => w[IDX(O_RUN, f)]);
const planeAndSupportOf = (w: readonly number[]): number[] =>
  [O_DEPTH, O_WIDTH, O_SUPPORT].flatMap((o) => [F1, F2, F3, F4].map((f) => w[IDX(o, f)]));
const DOSE_COPY_ROWS = (['RUNCAUTION', 'KITCHENSINK'] as DoseKind[]).map((kind) => {
  const got = DOSE_MATRIX[kind] as number[];
  const want = doseFromExports(kind) as number[];
  const slots = got.map((v, i) => ({
    slot: i, output: OBM_OUTPUT_KEYS[Math.floor(i / OBM_FEATURE_KEYS.length)],
    feature: OBM_FEATURE_KEYS[i % OBM_FEATURE_KEYS.length],
    copied: v, rederived: want[i], same: v === want[i],
  }));
  const nonZero = got.map((v, i) => (v !== 0 ? i : -1)).filter((i) => i >= 0);
  return {
    kind,
    source: kind === 'KITCHENSINK'
      ? `BYTE-COPIED from ${OBMT1_PATH} l.500–509 (the CEILING probe)`
      : `HAND-SET PROBE CORNER in ${OBMT1_PATH}'s own matrix() idiom — NOT a dose of record`,
    copiedMatrix: got, rederivedFromExports: want, slots,
    lengthOk: got.length === OBM_WEIGHT_SLOTS && want.length === OBM_WEIGHT_SLOTS,
    slotForSlot: slots.every((x) => x.same),
    cornersOnly: got.every((v) => v === 0 || v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX),
    nonZeroSlots: nonZero, nonZeroCount: nonZero.length,
    runScoreRow: runRowOf(got), planeAndSupportRows: planeAndSupportOf(got),
    /* the SHAPE ASSERTION each dose owes (#408 item 5(i)) */
    shapeOk: kind === 'RUNCAUTION'
      ? nonZero.length === 2 && nonZero.every((i) => i >= IDX(O_RUN, F1) && i <= IDX(O_RUN, F4))
        && runRowOf(got).filter((v) => v === OBM_WEIGHT_MIN).length === 2
        && planeAndSupportOf(got).every((v) => v === 0)
      : nonZero.length === OBM_WEIGHT_SLOTS
        && runRowOf(got).every((v) => v === OBM_WEIGHT_MIN)
        && got.every((v) => v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX),
  };
});
const DOSE_COPY_OK = DOSE_COPY_ROWS.every((r) => r.lengthOk && r.slotForSlot && r.cornersOnly
  && r.shapeOk) && JSON.stringify(RUN_CAUTION) !== JSON.stringify(KITCHEN_SINK);

/** ⭐⭐⭐ THE DOSE PLACEMENT — canon (dose placement): NEVER `info.genome`. The two MATCH-LOCAL
 *  views are DE-ALIASED FIRST with the engine's own idiom (`setCbProneness`, anchored at §3):
 *  `baseGenome` and `effGenome` are the franchise's OWN object until something replaces them,
 *  so writing them in place would write `info.genome` too. `applyMentality` rebuilds `effGenome`
 *  from `baseGenome` with a spread, so the matrix survives every in-match rebuild, and
 *  `gWorld`'s `infoGenomeCleanOfMatrix` conjunct asserts the cleanliness on EVERY walked match. */
const armMatrixLocal = (m: Match, w: readonly number[]): void => {
  for (const t of m.teams) {
    const view = { ...t.baseGenome, offballMovementWeights: [...w] } as TacticalGenome;
    t.baseGenome = view;
    t.effGenome = view;
  }
};
const matrixOnBaseAndEff = (m: Match): boolean => m.teams.every((t) => (
  [t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => Array.isArray(g.offballMovementWeights)
  && g.offballMovementWeights.length === OBM_WEIGHT_SLOTS));
const infoGenomeCleanOfMatrix = (m: Match): boolean => m.teams.every((t) =>
  (t.info.genome as TacticalGenome).offballMovementWeights === undefined);

/** DS-C0's team construction, BYTE FOR BYTE (G-REPRO-DSC0 depends on it). */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐⭐ THE ARM CONSTRUCTION. The HATS-E13-ABSENT arm is DS-C0's `buildMatch(seed, 'E13')` BYTE
 *  FOR BYTE — the composer CALLED, the flag set NEVER copied. Every other arm is that same
 *  construction PLUS the DS flags exactly as due, the `obmMovement` flag exactly as due, the
 *  arm's own dose matrix on the two MATCH-LOCAL genome views, and (on D13) the SHIPPED loaders'
 *  dose through `armA4World` exactly as DS-C0's D13 arm took it. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const kind = ARM_KIND[arm];
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...(kind !== 'HATS' ? { dsOwnRun: true } : {}),
    ...(kind === 'OWN' ? { dsHatsOff: true } : {}),
    ...(ARM_DOSED[arm] ? { obmMovement: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (ARM_BOOK[arm] === 'D13') armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, BQ_WORLD_VERSION);
  const dose = DOSE_MATRIX[ARM_DOSE[arm]];
  if (dose !== null) armMatrixLocal(m, dose);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed, each able to FIRE        */
/* ========================================================================== */
/** ⭐⭐ THE COACH TICK. `team.brainTimer -= dt; if (team.brainTimer <= 0)` at the HEAD of the
 *  step (anchored), so the PRE-STEP timer minus DT is the engine's own guard. */
const coachTickFired = (brainTimerBefore: number): boolean => brainTimerBefore - DT <= 0;
/** ⭐⭐ THE PLAYER DECISION TICK — `if (p.decisionTimer <= 0 && !pcHeld)` (anchored).
 *  `decisionTimer` is decremented inside `physicsStep`, AFTER the decide loop, so the PRE-STEP
 *  value is exactly the one the guard tests. `notHeld` is the half DEBT (a) pays. */
const decisionTickFired = (decisionTimerBefore: number, notHeld: boolean): boolean =>
  decisionTimerBefore <= 0 && notHeld;
/** `holdFor`'s OWN semantics, read-only (calling `holdFor` would DELETE expired entries and so
 *  would not be byte-inert): a body is HELD iff the seat has an entry for him whose `untilTick`
 *  is still in the future at the tick the decide loop runs. */
const pcHeldRecon = (h: { untilTick: number } | undefined, simTick: number): boolean =>
  h !== undefined && simTick < h.untilTick;
/** ⭐⭐⭐ DEBT (a). The decide loop runs `holdFor(gid, this.stepCount)` where `stepCount` has
 *  ALREADY been incremented, i.e. the POST-STEP `m.simTick`. `pcLatencyObserve` arms holds
 *  INSIDE the step and BEFORE that increment, so a hold armed this step is invisible to a
 *  PRE-STEP map read and visible to a POST-STEP one. Both forms are computed on every tick; the
 *  POST-STEP form is the predicate of record and the PRE-STEP form (DS-C0's) is stored beside. */
const DECISION_TICK_FORMS = ['postStep', 'preStep'] as const;

/** ⭐⭐ THE WRITING BRANCH of `assignRunners`, in the SOURCE'S OWN ORDER. */
const BRANCHES = ['openPlay', 'cornerCrashHeld', 'liveCorner', 'crossFlight'] as const;
type Branch = (typeof BRANCHES)[number];
const BRI = (b: Branch): number => BRANCHES.indexOf(b);
interface BranchState { liveCorner: boolean; crashHeld: boolean; crossHeld: boolean }
const branchOf = (s: BranchState): Branch => {
  if (!s.liveCorner && s.crashHeld) return 'cornerCrashHeld';
  if (s.liveCorner) return 'liveCorner';
  if (s.crossHeld) return 'crossFlight';
  return 'openPlay';
};
/** ⭐⭐ DS-C0's HAT CLASSIFIER, UNCHANGED (8 cells) — the MIRROR half of the walker, kept byte
 *  for byte so G-REPRO-DSC0 can compare field for field. The own run's seventh literal lands in
 *  OTHER here BY CONSTRUCTION, which is exactly what DS-C0 would have computed. */
const HAT_CLASSES = ['licensedRunInBehind', 'arrivingLate', 'attackingTheBox', 'oneTwoBurst',
  'overlapping', 'keeperUp', 'noWhyRecorded', 'OTHER'] as const;
type HatClass = (typeof HAT_CLASSES)[number];
const HCI = (c: HatClass): number => HAT_CLASSES.indexOf(c);
const hatClassOf = (why: string | null): HatClass => {
  if (why === null) return 'noWhyRecorded';
  if (why === WHY_LICENSED) return 'licensedRunInBehind';
  if (why === WHY_ARRIVING) return 'arrivingLate';
  if (why === WHY_BOX) return 'attackingTheBox';
  if (why === WHY_BURST) return 'oneTwoBurst';
  if (why === WHY_OVERLAP) return 'overlapping';
  if (why === WHY_KEEPERUP) return 'keeperUp';
  return 'OTHER';
};
/** ⭐⭐⭐ THIS EXAM'S OWN CLASSIFIER — DS-C0's SIX named hats PLUS `ownRunInBehind` as its OWN
 *  CLASS (#406 item 5(iv)), read off the SAME engine record. `OTHER` still counts and can fire. */
const RUN_CLASSES = ['licensedRunInBehind', 'arrivingLate', 'attackingTheBox', 'oneTwoBurst',
  'overlapping', 'keeperUp', 'ownRunInBehind', 'noWhyRecorded', 'OTHER'] as const;
type RunClass = (typeof RUN_CLASSES)[number];
const RCI = (c: RunClass): number => RUN_CLASSES.indexOf(c);
const RUN_CLASSES_NAMED: readonly RunClass[] = ['licensedRunInBehind', 'arrivingLate',
  'attackingTheBox', 'oneTwoBurst', 'overlapping', 'keeperUp', 'ownRunInBehind'];
const HAT_CLASSES_NAMED_9: readonly RunClass[] = ['licensedRunInBehind', 'arrivingLate',
  'attackingTheBox', 'oneTwoBurst', 'overlapping', 'keeperUp'];
const runClassOf = (why: string | null): RunClass => {
  if (why === null) return 'noWhyRecorded';
  if (why === WHY_LICENSED) return 'licensedRunInBehind';
  if (why === WHY_ARRIVING) return 'arrivingLate';
  if (why === WHY_BOX) return 'attackingTheBox';
  if (why === WHY_BURST) return 'oneTwoBurst';
  if (why === WHY_OVERLAP) return 'overlapping';
  if (why === WHY_KEEPERUP) return 'keeperUp';
  if (why === WHY_OWN) return 'ownRunInBehind';
  return 'OTHER';
};
/** ⭐⭐ DS-C0's HAT EPISODE, UNCHANGED. */
const EP_CLASSES = ['runner', 'arriver', 'overlapper', 'wallRun'] as const;
type EpClass = (typeof EP_CLASSES)[number];
const ECI = (c: EpClass): number => EP_CLASSES.indexOf(c);
const episodeSets = (series: readonly boolean[]): number => {
  let n = 0;
  for (let i = 0; i < series.length; i++) if (series[i] && !(i > 0 && series[i - 1])) n += 1;
  return n;
};
const inYieldWindow = (active: boolean, now: number, windowEnd: number): boolean =>
  active || now <= windowEnd;
/** ⭐⭐⭐ THE OWN-RUN EPISODE (#406 item 5(iv)) — ONE BODY'S CONSECUTIVE `MakeRun` TICKS WHOSE
 *  WINNER'S `why` IS THE SEVENTH LITERAL. Read off the engine's own decision record at the END
 *  of each stepped tick, exactly as the hat episodes are read off their fields' transitions.
 *  SET = it was not own-running last tick and is now; CLEAR = the converse. */
const ownRunActiveOf = (actionType: string, why: string | null): boolean =>
  actionType === 'MakeRun' && why === WHY_OWN;
/** ⭐⭐⭐ THE STATE CLASSIFIER at the decision tick (#406 item 5(iv)) — the three states the
 *  seam doc §HONESTY 8 names, read off the engine's own pre-step state, plus a counted `other`. */
const STATES = ['mateOwnsTheBall', 'ballInFlight', 'ownRestart', 'other'] as const;
type StateK = (typeof STATES)[number];
const SI = (s: StateK): number => STATES.indexOf(s);
interface StateInputs {
  ownerIsMate: boolean; ownerIsNull: boolean; phase: string;
  possessionIsHisSide: boolean; restartIsHisSide: boolean;
}
const stateOf = (s: StateInputs): StateK => {
  if (s.ownerIsMate) return 'mateOwnsTheBall';
  if (s.ownerIsNull && s.phase === 'playing' && s.possessionIsHisSide) return 'ballInFlight';
  if (s.phase === 'restart' && s.restartIsHisSide) return 'ownRestart';
  return 'other';
};
/** ⭐⭐ THE 2过1 TRIGGER, RECONSTRUCTED (DS-C0's, unchanged) — a DECLARED reconstruction whose
 *  `d` is a passer→TARGET PROXY for the engine's passer→LED-POINT distance. */
const CONJUNCTS = ['notGK', 'shortDistanceProxy', 'underPressure', 'freshLegs', 'attackingHalf',
  'geneGate'] as const;
type Conjunct = (typeof CONJUNCTS)[number];
const CJI = (c: Conjunct): number => CONJUNCTS.indexOf(c);
interface WallInputs {
  isGk: boolean; dProxy: number; pressure: number; stamina: number; localX: number;
  tempo: number; passBias: number; wallPassW: number;
}
const wallConjuncts = (w: WallInputs): boolean[] => [
  !w.isGk,
  w.dProxy < WALL_D,
  w.pressure > WALL_PRESSURE,
  w.stamina > WALL_STAMINA,
  w.localX > WALL_HALF,
  ((w.tempo + w.passBias) / WALL_GENE_DIV) * w.wallPassW > WALL_GENE,
];
const wallFiresRecon = (w: WallInputs): boolean => wallConjuncts(w).every((c) => c);
const runnerCountRecon = (counter: boolean, tempo: number, urgency: number): number =>
  (counter || tempo > TEMPO_HIGH ? COUNT_HIGH : COUNT_BASE)
  + (urgency > URGENCY_HIGH ? 1 : 0);
const overlapGeneGate = (attackingWidth: number, overlapW: number): boolean =>
  attackingWidth * overlapW > OVERLAP_GATE;
/** ⭐⭐⭐ THE OWN-RUN PRIOR, RECOMPUTED FROM THE ANCHORED CONSTANTS — never from the seam. */
const priorOf = (role: Role, localX: number): number =>
  clamp01((RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV) / RUN_PRIOR_MAX);
/** ⭐⭐⭐ THE `runMul` BACK-OUT (#406 item 5(iv), the seat's `runMul` distribution). The engine's
 *  OWN decision record stores the candidate's SCORE; the seam's arithmetic is
 *  `s = W.runScore · prior · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul` for the OWN run and
 *  `s = W.runScore · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul` for the LICENSED run, with
 *  `obmRunMul` applied LAST at both sites (anchored). So the seat's own multiplier is the
 *  recorded score over the rest — no recomputation of the policy, no percept pull, no wrapper.
 *  ⚠ It is only readable when the run candidate reached the record's TOP FOUR (anchored). */
const runMulBackOut = (score: number, runScoreW: number, prior: number, tired: boolean): number =>
  ratio(score, runScoreW * prior * (tired ? OFFBALL_TIRED_MUL : 1));
const tiredOf = (stamina: number, staminaConservation: number): boolean =>
  stamina < TIRED_STAMINA && staminaConservation > TIRED_CONSERVATION;
/** ⭐⭐⭐ DS-T1b — THE OWN-RUN CANDIDATE'S BACK-OUT. DS-T0b's amended arithmetic is
 *  `s = ((W.runScore · prior) · restraint) · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul`
 *  (§LAW-B, anchored), with `obmRunMul` applied LAST — so the STORED SCORE over
 *  `W.runScore · prior · tiredMul` is EXACTLY `restraint · obmRunMul`.
 *  ⭐ On a seat-ABSENT arm `obmRunMul` is EXACTLY 1 by construction, and THERE this back-out IS
 *  the restraint. On a DOSED arm it is the PRODUCT, and the field name says so (canon:
 *  unit-name truth) — §DEVIATIONS and §HONEST LIMITS carry the consequence. */
const ownScoreBackOut = (
  score: number, runScoreW: number, prior: number, tired: boolean,
): number => ratio(score, runScoreW * prior * (tired ? OFFBALL_TIRED_MUL : 1));
/** ⭐⭐⭐ `runningMates` INVERTED out of the restraint: `restraint = clamp01(1 − runningMates /
 *  count)`, and the LOWER arm of the clamp is the only one that can bite (`runningMates ≥ 0`
 *  ⇒ `1 − runningMates/count ≤ 1`), so the inversion is exact WHERE THE RESTRAINT IS ABOVE ZERO
 *  and CENSORED at exactly zero (all the law says there is `runningMates ≥ count`). */
const runningMatesFrom = (restraint: number, count: number): number =>
  (restraint > 0 ? (1 - restraint) * count : Number.NaN);
/** ⭐⭐ THE CLEAN `runMul` LIMB — the LICENSED run's score carries NO restraint factor
 *  (`s = W.runScore · tiredMul · obmRunMul`, anchored), so THIS back-out is the seat's own
 *  multiplier even on a DOSED OWN arm, where the own candidate's back-out is a product. */
const runMulFromLicensed = (score: number, runScoreW: number, tired: boolean): number =>
  ratio(score, runScoreW * (tired ? OFFBALL_TIRED_MUL : 1));
/** ⭐⭐ THE BLOCK'S OWN NOT-HATTED GUARD, RECONSTRUCTED (the two forms are stored). */
const hattedRecon = (inRunners: boolean, isArriver: boolean, isOverlapper: boolean): boolean =>
  inRunners || isArriver || isOverlapper;
const wallLiveRecon = (until: number, now: number): boolean => until > 0 && now < until;

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture; every
   predicate is stated with a case where it FIRES and one where it does NOT) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
/* the CADENCE predicates */
fx('coachTick.aTimerAtZeroFires', coachTickFired(0), true);
fx('coachTick.aFullIntervalDoesNOTFire', coachTickFired(TEAM_AI_INTERVAL), false);
fx('decisionTick.zeroFires', decisionTickFired(0, true), true);
fx('decisionTick.aFullIntervalDoesNOT', decisionTickFired(AI_INTERVAL, true), false);
fx('decisionTick.aHELDBodyDoesNOTDecide', decisionTickFired(0, false), false);
fx('pcHold.liveHoldIsHeld', pcHeldRecon({ untilTick: 100 }, 99), true);
fx('pcHold.exactlyAtTheExpiryIsNOTHeld', pcHeldRecon({ untilTick: 100 }, 100), false);
fx('pcHold.noEntryIsNOTHeld', pcHeldRecon(undefined, 0), false);
/* ⭐⭐⭐ DEBT (a) — THE TWO FORMS ON A HAND-BUILT HOLD ARMED *INSIDE* THE STEP. Pre-step the map
 *  has NO entry for the body (the observe hook has not run yet); post-step it carries one whose
 *  `untilTick` is beyond the decide-loop tick. The PRE-STEP form says "he decided"; the
 *  POST-STEP form says "he was held". They DISAGREE — which is the whole of the debt. */
{
  const preStepMap = new Map<number, { untilTick: number }>();
  const postStepMap = new Map<number, { untilTick: number }>([[7, { untilTick: 106 }]]);
  const decideLoopTick = 104;
  const preNotHeld = !pcHeldRecon(preStepMap.get(7), decideLoopTick);
  const postNotHeld = !pcHeldRecon(postStepMap.get(7), decideLoopTick);
  fx('debtA.preStepFormSaysHeDECIDED', decisionTickFired(0, preNotHeld), true);
  fx('debtA.postStepFormSaysHeWasHELD', decisionTickFired(0, postNotHeld), false);
  fx('debtA.theTwoFormsDISAGREEOnAHoldArmedInsideTheStep',
    decisionTickFired(0, preNotHeld) !== decisionTickFired(0, postNotHeld), true);
  const alreadyArmed = new Map<number, { untilTick: number }>([[7, { untilTick: 106 }]]);
  fx('debtA.theyAGREEWhenTheHoldPredatesTheStep',
    decisionTickFired(0, !pcHeldRecon(alreadyArmed.get(7), decideLoopTick))
      === decisionTickFired(0, !pcHeldRecon(postStepMap.get(7), decideLoopTick)), true);
  fx('debtA.bothFormsAreNamed', [...DECISION_TICK_FORMS], ['postStep', 'preStep']);
}
/* the BRANCH classifier */
const BS = (o: Partial<BranchState>): BranchState => ({
  liveCorner: false, crashHeld: false, crossHeld: false, ...o,
});
fx('branch.openPlayIsTheDefault', branchOf(BS({})), 'openPlay');
fx('branch.heldCrashWinsOverCrossFlight',
  branchOf(BS({ crashHeld: true, crossHeld: true })), 'cornerCrashHeld');
fx('branch.aLiveCornerSUPPRESSESTheHeldCrash',
  branchOf(BS({ liveCorner: true, crashHeld: true })), 'liveCorner');
fx('branch.crossFlightFiresAlone', branchOf(BS({ crossHeld: true })), 'crossFlight');
/* the MIRROR hat-class classifier (DS-C0's, 8 cells) */
fx('hatClass.licensedRunInBehind', hatClassOf(WHY_LICENSED), 'licensedRunInBehind');
fx('hatClass.keeperUp', hatClassOf(WHY_KEEPERUP), 'keeperUp');
fx('hatClass.OTHER_CAN_FIRE', hatClassOf('a run I chose for myself'), 'OTHER');
fx('hatClass.theOwnRunLandsInOTHERInTheMIRROR', hatClassOf(WHY_OWN), 'OTHER');
fx('hatClass.noWhyRecordedCanFire', hatClassOf(null), 'noWhyRecorded');
/* ⭐⭐⭐ THIS EXAM'S NINE-CELL classifier — every class, each with a negative */
fx('runClass.licensedRunInBehind', runClassOf(WHY_LICENSED), 'licensedRunInBehind');
fx('runClass.arrivingLate', runClassOf(WHY_ARRIVING), 'arrivingLate');
fx('runClass.attackingTheBox', runClassOf(WHY_BOX), 'attackingTheBox');
fx('runClass.oneTwoBurst', runClassOf(WHY_BURST), 'oneTwoBurst');
fx('runClass.overlapping', runClassOf(WHY_OVERLAP), 'overlapping');
fx('runClass.keeperUp', runClassOf(WHY_KEEPERUP), 'keeperUp');
fx('runClass.ownRunInBehindIsITSOWNCLASS', runClassOf(WHY_OWN), 'ownRunInBehind');
fx('runClass.noWhyRecordedCanFire', runClassOf(null), 'noWhyRecorded');
fx('runClass.OTHER_CAN_FIRE', runClassOf('a run nobody wrote'), 'OTHER');
fx('runClass.anEditedSeventhLiteralIsOTHER',
  runClassOf(WHY_OWN.replace('own', 'my')), 'OTHER');
fx('runClass.aNearMissIsNotTheClass', runClassOf(`${WHY_OWN} `), 'OTHER');
fx('runClass.everyNamedClassIsDistinct',
  new Set(RUN_CLASSES_NAMED.map((c) => c as string)).size, RUN_CLASSES_NAMED.length);
fx('runClass.theSeventhLiteralIsExtractedNotTyped', WHY_OWN, 'own run in behind');
/* ⭐⭐⭐ THE OWN-RUN EPISODE set/clear, on a HAND-BUILT record series */
fx('ownEpisode.aMakeRunWithTheSeventhWhyIsACTIVE', ownRunActiveOf('MakeRun', WHY_OWN), true);
fx('ownEpisode.aMakeRunWithTheLICENSEDWhyIsNOT',
  ownRunActiveOf('MakeRun', WHY_LICENSED), false);
fx('ownEpisode.aNonRunActionWithTheSeventhWhyIsNOT',
  ownRunActiveOf('SupportBallCarrier', WHY_OWN), false);
fx('ownEpisode.noWhyIsNOT', ownRunActiveOf('MakeRun', null), false);
fx('ownEpisode.setThenClearIsONEEpisode',
  episodeSets([false, true, true, true, false]), 1);
fx('ownEpisode.twoSeparateSetsAreTWO',
  episodeSets([true, false, true, false]), 2);
fx('ownEpisode.aHeldRunIsONEEpisode', episodeSets([true, true, true, true]), 1);
fx('ownEpisode.neverSetIsZero', episodeSets([false, false]), 0);
fx('ownEpisode.windowIsOpenWhileActive', inYieldWindow(true, 100, -1), true);
fx('ownEpisode.windowIsOpenAfterTheClear', inYieldWindow(false, 100, 105), true);
fx('ownEpisode.windowIsSHUTBeyondTheClear', inYieldWindow(false, 106, 105), false);
fx('ownEpisode.theWindowIsTheStoredConstant', YIELD_WINDOW_SECONDS, 6);
/* ⭐⭐⭐ THE STATE classifier — every state, each with a negative */
const ST = (o: Partial<StateInputs>): StateInputs => ({
  ownerIsMate: false, ownerIsNull: false, phase: 'playing',
  possessionIsHisSide: false, restartIsHisSide: false, ...o,
});
fx('state.aMateOnTheBall', stateOf(ST({ ownerIsMate: true })), 'mateOwnsTheBall');
fx('state.inFlightWithPossessionHisSide',
  stateOf(ST({ ownerIsNull: true, possessionIsHisSide: true })), 'ballInFlight');
fx('state.inFlightWithPossessionTHEIRSIsOther',
  stateOf(ST({ ownerIsNull: true, possessionIsHisSide: false })), 'other');
fx('state.inFlightDuringARESTARTIsNotInFlight',
  stateOf(ST({ ownerIsNull: true, possessionIsHisSide: true, phase: 'restart' })), 'other');
fx('state.hisOwnRestart',
  stateOf(ST({ phase: 'restart', restartIsHisSide: true })), 'ownRestart');
fx('state.THEIRRestartIsOther', stateOf(ST({ phase: 'restart' })), 'other');
fx('state.aMateOnTheBallWINSOverEverything',
  stateOf(ST({ ownerIsMate: true, phase: 'restart', restartIsHisSide: true })),
  'mateOwnsTheBall');
fx('state.everyStateIsDistinct', new Set(STATES.map((s) => s as string)).size, STATES.length);
/* the 2过1 trigger — ALL SIX CONJUNCTS TRUE, then EACH killed by ONE fixture */
const WALL_ALL: WallInputs = {
  isGk: false, dProxy: 10, pressure: 0.5, stamina: 0.9, localX: 5,
  tempo: 0.8, passBias: 0.8, wallPassW: 1,
};
fx('wall.allSixTrueFIRES', wallFiresRecon(WALL_ALL), true);
fx('wall.kill1_theKeeperCannot', wallFiresRecon({ ...WALL_ALL, isGk: true }), false);
fx('wall.kill2_aLongBallCannot', wallFiresRecon({ ...WALL_ALL, dProxy: 15 }), false);
fx('wall.kill3_unpressedCannot', wallFiresRecon({ ...WALL_ALL, pressure: 0.2 }), false);
fx('wall.kill4_tiredLegsCannot', wallFiresRecon({ ...WALL_ALL, stamina: 0.3 }), false);
fx('wall.kill5_theOwnHalfCannot', wallFiresRecon({ ...WALL_ALL, localX: 0 }), false);
fx('wall.kill6_theGeneGateCannot', wallFiresRecon({ ...WALL_ALL, wallPassW: 0.1 }), false);
fx('wall.eachKillIsExactlyOneConjunct', [
  wallConjuncts({ ...WALL_ALL, isGk: true }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, dProxy: 15 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, pressure: 0.2 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, stamina: 0.3 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, localX: 0 }).filter((c) => !c).length,
  wallConjuncts({ ...WALL_ALL, wallPassW: 0.1 }).filter((c) => !c).length,
], [1, 1, 1, 1, 1, 1]);
/* the RUNNER COUNT and the 套边 gene gate */
fx('count.baseIsOne', runnerCountRecon(false, 0.5, 0.5), 1);
fx('count.counterAttackMakesTwo', runnerCountRecon(true, 0.5, 0.5), 2);
fx('count.tempoExactlyAtTheGateDoesNOT', runnerCountRecon(false, 0.65, 0.5), 1);
fx('count.allThreeMakeThree', runnerCountRecon(true, 0.9, 0.9), 3);
fx('overlapGate.passes', overlapGeneGate(0.8, 0.8), true);
fx('overlapGate.exactlyAtTheGateDoesNOT', overlapGeneGate(0.6, 0.5), false);
/* ⭐⭐⭐ THE PRIOR and the `runMul` BACK-OUT */
fx('prior.aStrikerOnTheGoalLineIsExactlyOne', priorOf('ST', HALF_L), 1);
fx('prior.aDeepDFIsClampedToZero', priorOf('DF', -19), 0);
fx('prior.aDFJustInsideTheBiteIsNotZero', priorOf('DF', -17) > 0, true);
fx('prior.everyRoleAtEveryQuarterMetreIsInUnitInterval', (() => {
  let ok = true;
  for (const r of ['GK', 'DF', 'MF', 'WG', 'ST'] as const) {
    for (let x = -HALF_L; x <= HALF_L + 1e-9; x += 0.25) {
      const v = priorOf(r, x);
      if (!(v >= 0 && v <= 1)) ok = false;
    }
  }
  return ok;
})(), true);
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
fx('runMul.identityWhenTheSeatIsAbsent',
  near(runMulBackOut(0.7 * 0.5, 0.7, 0.5, false), 1), true);
fx('runMul.recoversAPricedDownRun',
  near(runMulBackOut(0.7 * 0.5 * 0.8, 0.7, 0.5, false), 0.8), true);
fx('runMul.recoversAPricedUPRunThroughTHETIREDLIMB',
  near(runMulBackOut(0.7 * 0.5 * OFFBALL_TIRED_MUL * 1.25, 0.7, 0.5, true), 1.25), true);
fx('runMul.theTIREDLIMBMattersToTheBackOut',
  near(runMulBackOut(0.7 * 0.5 * OFFBALL_TIRED_MUL * 1.25, 0.7, 0.5, false), 1.25), false);
fx('runMul.aZeroPriorIsNOTBackedOut',
  Number.isFinite(runMulBackOut(0, 0.7, 0, false)), false);
fx('runMul.theSpanIsTheSEATSOWN', OBM_SCORE_SPAN, 1 - OFFBALL_TIRED_MUL);
fx('tired.aFreshBodyIsNotTired', tiredOf(0.9, 0.9), false);
fx('tired.aSpentBodyWithAConservingCoachIs', tiredOf(0.3, 0.9), true);
fx('tired.aSpentBodyWithoutTheGeneIsNOT', tiredOf(0.3, 0.4), false);
/* ⭐⭐⭐ DEBT (c) — the licence in ticks is DERIVED, and the top bin opens BEYOND it */
fx('debtC.oneFullLicenceInTicksIsDerived', WALL_LICENCE_TICKS, Math.round(2.3 / (1 / 60)));
fx('debtC.theLicenceIsTheENGINESOWNWindow', WALL_WINDOW, 2.3);
/* the EXTRACTED literals */
fx('literals.allExtractedFromTheAnchoredLines', LITERALS_OK, true);
fx('literals.roleWeights', [ROLE_W_GK, ROLE_W_DF, ROLE_W_MF, ROLE_W_WG, ROLE_W_ST],
  [0, 0.4, 1.2, 1.8, 2.2]);
fx('literals.theToleranceFractionAgreesAcrossTWOInstruments',
  NI_FRACTION === NI_FRACTION_SECOND_SOURCE, true);
/* ⭐⭐⭐ THE TWO DOSES — the shape each one owes, stated both ways */
fx('dose.runCautionIsEXACTLYTWOSlots',
  RUN_CAUTION.map((v, i) => (v !== 0 ? i : -1)).filter((i) => i >= 0),
  [IDX(O_RUN, F2), IDX(O_RUN, F3)]);
fx('dose.runCautionsTwoSlotsAreBOTHTheDomainMIN',
  [RUN_CAUTION[IDX(O_RUN, F2)], RUN_CAUTION[IDX(O_RUN, F3)]],
  [OBM_WEIGHT_MIN, OBM_WEIGHT_MIN]);
fx('dose.runCautionsPlaneAndSupportRowsAreZERO',
  planeAndSupportOf(RUN_CAUTION), zeros(12));
fx('dose.runCautionIsNOTTheStruckMarkerEscape',
  JSON.stringify(RUN_CAUTION) === JSON.stringify(matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX])),
  false);
fx('dose.kitchenSinkFillsEVERYSlotAtACorner',
  KITCHEN_SINK.filter((v) => v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX).length,
  OBM_WEIGHT_SLOTS);
fx('dose.kitchenSinksRunScoreRowIsATTHEMIN', runRowOf(KITCHEN_SINK),
  [OBM_WEIGHT_MIN, OBM_WEIGHT_MIN, OBM_WEIGHT_MIN, OBM_WEIGHT_MIN]);
fx('dose.kitchenSinksSupportRowIsATTHEMAX',
  [F1, F2, F3, F4].map((f) => KITCHEN_SINK[IDX(O_SUPPORT, f)]),
  [OBM_WEIGHT_MAX, OBM_WEIGHT_MAX, OBM_WEIGHT_MAX, OBM_WEIGHT_MAX]);
fx('dose.theTwoMatricesDIFFER',
  JSON.stringify(RUN_CAUTION) === JSON.stringify(KITCHEN_SINK), false);
fx('dose.BOTHrunScoreRowsAreNONZERO_whichMARKERESCAPESWasNOT', [
  runRowOf(RUN_CAUTION).some((v) => v !== 0),
  runRowOf(KITCHEN_SINK).some((v) => v !== 0),
  runRowOf(matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX])).some((v) => v !== 0),
], [true, true, false]);
fx('dose.everySlotOfBothIsZeroOrADomainCorner',
  [...RUN_CAUTION, ...KITCHEN_SINK].every(
    (v) => v === 0 || v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX), true);
fx('dose.theUnusedDoseIndicesAreNAMED', [F1, F4, O_DEPTH, O_WIDTH], [0, 3, 0, 1]);
/* ⭐⭐⭐ THE RESTRAINT BACK-OUT — both ways, and the DOSED case named for what it is */
fx('restraint.identityWhenNOBODYRuns',
  near(ownScoreBackOut(0.7 * 0.5 * 1, 0.7, 0.5, false), 1), true);
fx('restraint.recoversAHALFRestraint',
  near(ownScoreBackOut(0.7 * 0.5 * 0.5, 0.7, 0.5, false), 0.5), true);
fx('restraint.recoversEXACTLYZEROWhenTheCountIsAlreadyRunning',
  ownScoreBackOut(0, 0.7, 0.5, false), 0);
fx('restraint.recoversTHROUGHTheTiredLimb',
  near(ownScoreBackOut(0.7 * 0.5 * OFFBALL_TIRED_MUL * 0.25, 0.7, 0.5, true), 0.25), true);
fx('restraint.theTiredLimbMattersToTheBackOut',
  near(ownScoreBackOut(0.7 * 0.5 * OFFBALL_TIRED_MUL * 0.25, 0.7, 0.5, false), 0.25), false);
fx('restraint.aZeroPriorIsNOTBackedOut',
  Number.isFinite(ownScoreBackOut(0, 0.7, 0, false)), false);
fx('restraint.onADOSEDArmTheBackOutIsNOTTheRestraint',
  near(ownScoreBackOut(0.7 * 0.5 * 0.5 * 0.8, 0.7, 0.5, false), 0.5), false);
fx('restraint.onADOSEDArmItIsTheRESTRAINTTIMESRUNMUL',
  near(ownScoreBackOut(0.7 * 0.5 * 0.5 * 0.8, 0.7, 0.5, false), 0.5 * 0.8), true);
fx('runningMates.zeroWhenTheRestraintIsONE', runningMatesFrom(1, 3), 0);
fx('runningMates.oneAndAHalfOfThree', near(runningMatesFrom(0.5, 3), 1.5), true);
fx('runningMates.twoOfTwo', near(runningMatesFrom(0, 2), 0), false);
fx('runningMates.isCENSOREDWhereTheClampBIT',
  Number.isFinite(runningMatesFrom(0, 3)), false);
fx('runMulLic.identityWithTheSeatABSENT',
  near(runMulFromLicensed(0.7, 0.7, false), 1), true);
fx('runMulLic.recoversAPricedDOWNRun',
  near(runMulFromLicensed(0.7 * 0.8, 0.7, false), 0.8), true);
fx('runMulLic.recoversItTHROUGHTheTiredLimb',
  near(runMulFromLicensed(0.7 * OFFBALL_TIRED_MUL * 0.8, 0.7, true), 0.8), true);
fx('runMulLic.aZeroWeightIsNOTBackedOut',
  Number.isFinite(runMulFromLicensed(0, 0, false)), false);
/* the block's own not-hatted guard, both ways */
fx('guard.aRunnerIsHATTED', hattedRecon(true, false, false), true);
fx('guard.anArriverIsHATTED', hattedRecon(false, true, false), true);
fx('guard.anOverlapperIsHATTED', hattedRecon(false, false, true), true);
fx('guard.anUNHATTEDBodyIsNOT', hattedRecon(false, false, false), false);
fx('guard.aLiveWallLicenceIsLIVE', wallLiveRecon(10, 9.5), true);
fx('guard.anEXPIREDWallLicenceIsNOT', wallLiveRecon(10, 10), false);
fx('guard.noWallLicenceAtAllIsNOT', wallLiveRecon(-1, 5), false);
/* the ENGINE'S OWN count function, and this instrument's reconstruction agreeing with it */
fx('count.theEnginesOwnFunctionGivesTheThreeValues',
  [runnerCount('BuildUp', 0, 0), runnerCount('CounterAttack', 0, 0),
    runnerCount('CounterAttack', 1, 1)], [1, 2, 3]);
fx('count.theReconstructionAGREESWithTheEnginesOwnFunctionOnEveryCorner', (() => {
  let ok = true;
  for (const md of ['BuildUp', 'Attack', 'Defend', 'Press', 'CounterAttack',
    'ResetShape'] as const) {
    for (const tp of [0, 0.65, 0.66, 1]) {
      for (const ug of [0, 0.65, 0.66, 1]) {
        if (runnerCount(md, tp, ug) !== runnerCountRecon(md === 'CounterAttack', tp, ug)) {
          ok = false;
        }
      }
    }
  }
  return ok;
})(), true);
fx('count.tempoEXACTLYAtTheGateDoesNOTLift', runnerCount('BuildUp', 0.65, 0), 1);

/* ========================================================================== */
/* §8 THE FROZEN BINS AND THE PER-SEED ROW                                     */
/* ========================================================================== */
const RUN_COUNT_BINS = 5;                              /* 0 · 1 · 2 · 3 · 4+ runners (MIRROR) */
const EP_TICK_BIN = 6; const EP_TICK_BINS = 21;        /* DS-C0's episode bins (MIRROR) */
/** ⭐⭐⭐ DEBT (c) — THE WIDE EPISODE BINS. The count is DERIVED so the TOP BIN'S LOWER EDGE lies
 *  BEYOND one full `wallRun` licence: `ceil(licenceTicks / width) + 2`. NEVER TYPED. */
const EPW_BIN = EP_TICK_BIN;
const EPW_BINS = Math.ceil(WALL_LICENCE_TICKS / EPW_BIN) + 2;
const EPW_TOP_EDGE = (EPW_BINS - 1) * EPW_BIN;
/** ⭐⭐⭐ R1's FROZEN BINS — 0 · 1 · 2 · 3 · 4 · 5 · 6+ EXECUTED runners on a team-tick. */
const R1_BINS = 7;
const R1_FLOOD_AT = 3;                                 /* the share of ticks with ≥ 3 runners */
/** ⭐⭐ THE SEAT'S `runMul` HISTOGRAM — frozen over [1 − OBM_SCORE_SPAN, 1 + OBM_SCORE_SPAN],
 *  i.e. [0.6, 1.4], in 16 equal cells. The RANGE is the seat's own derived span, never typed. */
const RUNMUL_BINS = 16;
const RUNMUL_LO = 1 - OBM_SCORE_SPAN;
const RUNMUL_HI = 1 + OBM_SCORE_SPAN;
const RUNMUL_W = (RUNMUL_HI - RUNMUL_LO) / RUNMUL_BINS;
const runMulBin = (v: number): number => {
  const i = Math.floor((v - RUNMUL_LO) / RUNMUL_W);
  return i < 0 ? 0 : i >= RUNMUL_BINS ? RUNMUL_BINS - 1 : i;
};
/** ⭐⭐⭐ DS-T1b — THE SEAM'S OWN FROZEN BINS.
 *  `restraint` over [0, 1] in TEN equal cells (the law's own interval, §LAW-B), with the shares
 *  EXACTLY 0 and EXACTLY 1 stored SEPARATELY (the `x · 1 === x` identity makes the upper one
 *  IEEE-exact and the `clamp01` lower arm makes the lower one exact too).
 *  the OWN-candidate BACK-OUT over [0, 1 + OBM_SCORE_SPAN] — the restraint's own ceiling times
 *  the seat's own ceiling, the range DERIVED from the seat's span and never typed.
 *  `runningMates` over [0, 4] in EIGHT cells — the seam doc §LAW-B's own DERIVED bound
 *  (`TEAM_SIZE` − keeper − observer − carrier, the carrier-is-the-keeper case collapsing two
 *  exclusions, §COMMANDER CORRECTIONS-B 4).
 *  `count` in THREE cells — the three values the coach's moved expression can take. */
const UNIT_BINS = 10;
const UNIT_W = 1 / UNIT_BINS;
const unitBin = (v: number): number => binOf(v, UNIT_W, UNIT_BINS);
const OWNB_HI = 1 + OBM_SCORE_SPAN;
const OWNB_BINS = 14;
const OWNB_W = OWNB_HI / OWNB_BINS;
const ownBackOutBin = (v: number): number => binOf(v, OWNB_W, OWNB_BINS);
const RM_HI = 4;
const RM_BINS = 8;
const RM_W = RM_HI / RM_BINS;
const rmBin = (v: number): number => binOf(v, RM_W, RM_BINS);
const COUNT_CELLS = 3;
const countCell = (c: number): number => (c <= 1 ? 0 : c >= COUNT_CELLS ? COUNT_CELLS - 1 : c - 1);
const ROLES4 = ['DF', 'MF', 'WG', 'ST'] as const;
const RI = (r: string): number => {
  const i = (ROLES4 as readonly string[]).indexOf(r);
  return i < 0 ? -1 : i;
};
const RUNKINDS = ['hat', 'own'] as const;
type RunKind = (typeof RUNKINDS)[number];
const RKI = (k: RunKind): number => RUNKINDS.indexOf(k);

interface Row {
  ticks: number; wallMs: number; signature: string;
  /* --- WORLD / ARM RECEIPTS --- */
  bqVersion: number; lnVersion: number; gkVersion: number;
  worldOk: boolean; edsChoiceOn: boolean; seamsAbsent: boolean; genomeClean: boolean;
  pcSeatPresent: boolean; pcHoldsReadable: boolean; pcHeldDecisionTicks: number;
  otherSeamsAbsent: boolean; dsOwnRunFlag: boolean; dsHatsOffFlag: boolean; obmFlag: boolean;
  matrixOnBaseEff: boolean; infoGenomeCleanOfMatrix: boolean; policyCacheEntries: number;
  /* --- POPULATION A — EVERY TEAM-BRAIN TICK IN POSSESSION (the DS-C0 MIRROR) --- */
  coachTicks: number; coachTicksInPossession: number;
  branchTicks: number[]; runCountBins: number[]; runCountBinsByBranch: number[];
  arriverSetByBranch: number[]; overlapperSetByBranch: number[];
  runnerCountSum: number; inputCounterAttack: number; inputTempoHigh: number;
  inputUrgencyHigh: number; countReconAgree: number; countReconChecked: number;
  runnersByRole: number[]; arriverByRole: number[]; overlapperByRole: number[];
  runnerDesignations: number;
  overlapGeneGatePass: number; overlapPreconditionTicks: number; overlapConfronted: number;
  phaseAmbiguousCoachTicks: number;
  /** ⭐⭐ #406 item 5(iv): on OWN the OPEN-PLAY BOARD IS EMPTY BY CONSTRUCTION — a STORED
   *  COUNT PAIR, never a claim. */
  openPlayCoachTicks: number; openPlayBoardEmptyTicks: number;
  /* --- POPULATION B — the DS-C0 MIRROR (PRE-STEP holds) --- */
  offBallDecisionTicks: number; offBallBranchReached: number;
  offBallActionTicks: number[]; makeRunTicks: number;
  hatClassTicks: number[]; keeperHatClassTicks: number[];
  hatClassTicksKeeper: number; keeperDecisionTicks: number;
  attackingHatted: number; attackingOutfield: number; possessionTicks: number;
  possessionFlipTicks: number;
  /* --- POPULATION B — THE FORM OF RECORD (POST-STEP holds; DEBT (a)) --- */
  offBallDecisionTicksPost: number; offBallActionTicksPost: number[]; makeRunTicksPost: number;
  runClassTicks: number[]; keeperRunClassTicks: number[];
  runClassTicksKeeper: number; keeperDecisionTicksPost: number;
  /** the CALIBRATION RECEIPT: both forms' whole-body counts and the ENGINE'S OWN ledger delta */
  heldBodyTicksPre: number; heldBodyTicksPost: number; ledgerDecisionsHeld: number;
  decidedBodyTicksPre: number; decidedBodyTicksPost: number;
  /* --- ⭐⭐⭐ R1 — THE FLOOD FACE --- */
  r1TeamTicks: number; r1Bins: number[]; r1RunnerSum: number; r1FloodTicks: number;
  r1RunnersByRole: number[];
  /* --- POPULATION C — THE HATS' YIELD (the DS-C0 MIRROR) --- */
  epSets: number[]; epTicks: number[]; epTickBins: number[];
  epPassAimed: number[]; epPassCompleted: number[]; epPassBounce: number[];
  epPassThrough: number[]; epShots: number[]; epGoals: number[];
  /* --- POPULATION C — THE DEBTS PAID --- */
  epTickBinsWide: number[]; epActiveAtFullTime: number[]; epGoalsFixed: number[];
  ownEpSets: number; ownEpTicks: number; ownEpTickBins: number[];
  ownEpPassAimed: number; ownEpPassCompleted: number; ownEpPassThrough: number;
  ownEpShots: number; ownEpGoals: number; ownEpActiveAtFullTime: number;
  goalRowsJoinedAtThePush: number; goalRowsUnjoinable: number;
  /* --- THE COUPLING FACES (DS-C0's definitions) --- */
  wallEligiblePasses: number; wallFires: number; wallConjunctKills: number[];
  wallReconAllTrue: number; wallReconAgrees: number; wallOneTwosStat: number;
  overlapSets: number; overlapReleaseFires: number; overlapArrivedStat: number;
  arriverSets: number; cutbackFormed: number; cutbackTaken: number; cutbackAssistShots: number;
  completedHatted: number; completedUnhatted: number;
  shotsAfterHatted: number; goalsAfterHatted: number;
  shotsAfterUnhatted: number; goalsAfterUnhatted: number;
  /* --- POPULATION D — THE PASSER'S HAT-READS (the DS-C0 MIRROR) --- */
  carrierDecisionTicks: number;
  fireWallReturnUpperBound: number; fireThirdManUpperBound: number;
  fireOverlapReleaseExact: number; fireArriverCutbackFormed: number;
  fireArriverCutbackTaken: number;
  /* --- RUNS AND YIELD PER STATE --- */
  stateRunDecisions: number[]; stateAimed: number[]; stateShots: number[];
  stateAllDecisions: number[];
  /* --- ⭐⭐⭐ THE SEAM'S NEW FACES (DS-T1b) — the guard population and the BACK-OUTS --- */
  unhattedOffBallTicksPost: number; unhattedOffBallTicksPre: number;
  ownCandidateVisible: number; ownCandidateOutsidePostGuard: number;
  countSum: number; countBins: number[];
  ownBackOutN: number; ownBackOutSum: number; ownBackOutBins: number[];
  ownBackOutBelowOne: number; ownBackOutAboveOne: number; ownBackOutAtOne: number;
  restraintN: number; restraintSum: number; restraintBins: number[];
  restraintExactZero: number; restraintExactOne: number;
  rmN: number; rmSum: number; rmBins: number[]; rmCensored: number;
  runMulLicN: number; runMulLicSum: number; runMulLicBins: number[];
  runMulLicBelowOne: number; runMulLicAboveOne: number; runMulLicAtOne: number;
  /* --- THE SEAT'S runMul (DS-T1's OWN back-out, INHERITED BYTE FOR BYTE) --- */
  runMulBinsArr: number[]; runMulCount: number; runMulSum: number;
  runMulBelowOne: number; runMulAboveOne: number; runMulAtOne: number;
  runMulFromOwn: number; runMulFromLicensed: number;
  /* --- THE CROWDING FAMILY --- */
  crowdSampleTicks: number; crowdSamples: number; crashHits: number;
  guardPairsTotal: number; guardPairsUnder4: number; guardU4Sum: number; guardU4N: number;
  /* --- THE BAND --- */
  goals: number; shots: number; passes: number; passesCompleted: number;
  interceptions: number; offsides: number; throughBallsStat: number; xgSum: number;
  possessionTimeOwn: number[]; aimDistSum: number; aimDistCount: number;
  thirdManStat: number; shotLogRows: number; shotsJoinedToAShooter: number;
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, signature: '',
  bqVersion: 0, lnVersion: 0, gkVersion: 0,
  worldOk: false, edsChoiceOn: false, seamsAbsent: false, genomeClean: false,
  pcSeatPresent: false, pcHoldsReadable: false, pcHeldDecisionTicks: 0,
  otherSeamsAbsent: false, dsOwnRunFlag: false, dsHatsOffFlag: false, obmFlag: false,
  matrixOnBaseEff: false, infoGenomeCleanOfMatrix: false, policyCacheEntries: 0,
  coachTicks: 0, coachTicksInPossession: 0,
  branchTicks: zeros(BRANCHES.length), runCountBins: zeros(RUN_COUNT_BINS),
  runCountBinsByBranch: zeros(BRANCHES.length * RUN_COUNT_BINS),
  arriverSetByBranch: zeros(BRANCHES.length), overlapperSetByBranch: zeros(BRANCHES.length),
  runnerCountSum: 0, inputCounterAttack: 0, inputTempoHigh: 0, inputUrgencyHigh: 0,
  countReconAgree: 0, countReconChecked: 0,
  runnersByRole: zeros(ROLES4.length), arriverByRole: zeros(ROLES4.length),
  overlapperByRole: zeros(ROLES4.length), runnerDesignations: 0,
  overlapGeneGatePass: 0, overlapPreconditionTicks: 0, overlapConfronted: 0,
  phaseAmbiguousCoachTicks: 0,
  openPlayCoachTicks: 0, openPlayBoardEmptyTicks: 0,
  offBallDecisionTicks: 0, offBallBranchReached: 0,
  offBallActionTicks: zeros(ACTION_CELLS.length), makeRunTicks: 0,
  hatClassTicks: zeros(HAT_CLASSES.length), keeperHatClassTicks: zeros(HAT_CLASSES.length),
  hatClassTicksKeeper: 0, keeperDecisionTicks: 0,
  attackingHatted: 0, attackingOutfield: 0, possessionTicks: 0, possessionFlipTicks: 0,
  offBallDecisionTicksPost: 0, offBallActionTicksPost: zeros(ACTION_CELLS.length),
  makeRunTicksPost: 0, runClassTicks: zeros(RUN_CLASSES.length),
  keeperRunClassTicks: zeros(RUN_CLASSES.length), runClassTicksKeeper: 0,
  keeperDecisionTicksPost: 0,
  heldBodyTicksPre: 0, heldBodyTicksPost: 0, ledgerDecisionsHeld: 0,
  decidedBodyTicksPre: 0, decidedBodyTicksPost: 0,
  r1TeamTicks: 0, r1Bins: zeros(R1_BINS), r1RunnerSum: 0, r1FloodTicks: 0,
  r1RunnersByRole: zeros(ROLES4.length),
  epSets: zeros(EP_CLASSES.length), epTicks: zeros(EP_CLASSES.length),
  epTickBins: zeros(EP_CLASSES.length * EP_TICK_BINS),
  epPassAimed: zeros(EP_CLASSES.length), epPassCompleted: zeros(EP_CLASSES.length),
  epPassBounce: zeros(EP_CLASSES.length), epPassThrough: zeros(EP_CLASSES.length),
  epShots: zeros(EP_CLASSES.length), epGoals: zeros(EP_CLASSES.length),
  epTickBinsWide: zeros(EP_CLASSES.length * EPW_BINS),
  epActiveAtFullTime: zeros(EP_CLASSES.length), epGoalsFixed: zeros(EP_CLASSES.length),
  ownEpSets: 0, ownEpTicks: 0, ownEpTickBins: zeros(EPW_BINS),
  ownEpPassAimed: 0, ownEpPassCompleted: 0, ownEpPassThrough: 0,
  ownEpShots: 0, ownEpGoals: 0, ownEpActiveAtFullTime: 0,
  goalRowsJoinedAtThePush: 0, goalRowsUnjoinable: 0,
  wallEligiblePasses: 0, wallFires: 0, wallConjunctKills: zeros(CONJUNCTS.length),
  wallReconAllTrue: 0, wallReconAgrees: 0, wallOneTwosStat: 0,
  overlapSets: 0, overlapReleaseFires: 0, overlapArrivedStat: 0,
  arriverSets: 0, cutbackFormed: 0, cutbackTaken: 0, cutbackAssistShots: 0,
  completedHatted: 0, completedUnhatted: 0,
  shotsAfterHatted: 0, goalsAfterHatted: 0, shotsAfterUnhatted: 0, goalsAfterUnhatted: 0,
  carrierDecisionTicks: 0,
  fireWallReturnUpperBound: 0, fireThirdManUpperBound: 0, fireOverlapReleaseExact: 0,
  fireArriverCutbackFormed: 0, fireArriverCutbackTaken: 0,
  stateRunDecisions: zeros(RUNKINDS.length * STATES.length),
  stateAimed: zeros(RUNKINDS.length * STATES.length),
  stateShots: zeros(RUNKINDS.length * STATES.length),
  stateAllDecisions: zeros(STATES.length),
  unhattedOffBallTicksPost: 0, unhattedOffBallTicksPre: 0,
  ownCandidateVisible: 0, ownCandidateOutsidePostGuard: 0,
  countSum: 0, countBins: zeros(COUNT_CELLS),
  ownBackOutN: 0, ownBackOutSum: 0, ownBackOutBins: zeros(OWNB_BINS),
  ownBackOutBelowOne: 0, ownBackOutAboveOne: 0, ownBackOutAtOne: 0,
  restraintN: 0, restraintSum: 0, restraintBins: zeros(UNIT_BINS),
  restraintExactZero: 0, restraintExactOne: 0,
  rmN: 0, rmSum: 0, rmBins: zeros(RM_BINS), rmCensored: 0,
  runMulLicN: 0, runMulLicSum: 0, runMulLicBins: zeros(RUNMUL_BINS),
  runMulLicBelowOne: 0, runMulLicAboveOne: 0, runMulLicAtOne: 0,
  runMulBinsArr: zeros(RUNMUL_BINS), runMulCount: 0, runMulSum: 0,
  runMulBelowOne: 0, runMulAboveOne: 0, runMulAtOne: 0,
  runMulFromOwn: 0, runMulFromLicensed: 0,
  crowdSampleTicks: 0, crowdSamples: 0, crashHits: 0,
  guardPairsTotal: 0, guardPairsUnder4: 0, guardU4Sum: 0, guardU4N: 0,
  goals: 0, shots: 0, passes: 0, passesCompleted: 0,
  interceptions: 0, offsides: 0, throughBallsStat: 0, xgSum: 0,
  possessionTimeOwn: [0, 0], aimDistSum: 0, aimDistCount: 0,
  thirdManStat: 0, shotLogRows: 0, shotsJoinedToAShooter: 0,
});
/** ⭐⭐ THE MIRROR FIELD SET — the field names DS-C0's own row carries. G-REPRO-DSC0 compares
 *  the INTERSECTION of this row's keys with DS-C0's stored `perSeedCells[].E13`, and SPLITS the
 *  comparison into the A/C half (a mismatch is RED) and the B/D half (the receipt). */
const DSC0_POP_AC_FIELDS = [
  'ticks', 'bqVersion', 'lnVersion', 'gkVersion', 'worldOk', 'edsChoiceOn', 'seamsAbsent',
  'genomeClean', 'pcSeatPresent', 'pcHoldsReadable',
  'coachTicks', 'coachTicksInPossession', 'branchTicks', 'runCountBins',
  'runCountBinsByBranch', 'arriverSetByBranch', 'overlapperSetByBranch', 'runnerCountSum',
  'inputCounterAttack', 'inputTempoHigh', 'inputUrgencyHigh', 'countReconAgree',
  'countReconChecked', 'runnersByRole', 'arriverByRole', 'overlapperByRole',
  'runnerDesignations', 'overlapGeneGatePass', 'overlapPreconditionTicks', 'overlapConfronted',
  'phaseAmbiguousCoachTicks',
  'epSets', 'epTicks', 'epTickBins', 'epPassAimed', 'epPassCompleted', 'epPassBounce',
  'epPassThrough', 'epShots', 'epGoals',
  'wallEligiblePasses', 'wallFires', 'wallConjunctKills', 'wallReconAllTrue', 'wallReconAgrees',
  'wallOneTwosStat', 'overlapSets', 'overlapArrivedStat', 'arriverSets', 'cutbackAssistShots',
  'completedHatted', 'completedUnhatted', 'shotsAfterHatted', 'goalsAfterHatted',
  'shotsAfterUnhatted', 'goalsAfterUnhatted',
  'attackingHatted', 'attackingOutfield', 'possessionTicks', 'possessionFlipTicks',
  'goals', 'shots', 'passes', 'thirdManStat', 'shotLogRows', 'shotsJoinedToAShooter',
] as const;
const DSC0_POP_BD_FIELDS = [
  'pcHeldDecisionTicks', 'offBallDecisionTicks', 'offBallBranchReached', 'offBallActionTicks',
  'makeRunTicks', 'hatClassTicks', 'keeperHatClassTicks', 'hatClassTicksKeeper',
  'keeperDecisionTicks', 'carrierDecisionTicks', 'fireWallReturnUpperBound',
  'fireThirdManUpperBound', 'fireOverlapReleaseExact', 'fireArriverCutbackFormed',
  'fireArriverCutbackTaken', 'cutbackFormed', 'cutbackTaken', 'overlapReleaseFires',
] as const;

/* ========================================================================== */
/* §9 THE WALK — public state and the engine's own decision record, read BEFORE and AFTER
   `match.step(DT)`; NO WRAPPER (gLockstep proves it)                                        */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
    action: pp.action.type,
  })),
}));
interface OpenWindow { until: number; side: Side; hatted: boolean }
interface MatchView {
  bqCushion?: boolean; lnOwnLanePrice?: boolean; gkDiveBody?: boolean;
  edsPerceivedChoice?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
  rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
  dsOwnRun?: boolean; dsHatsOff?: boolean;
  obmPolicies?: Map<number, unknown>;
  pcLatency: {
    holds?: Map<number, { untilTick: number }>;
    ledger?: { decisionsHeld: number };
  } | null;
}

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as MatchView;
  const kind = ARM_KIND[arm];
  row.bqVersion = bqArmedVersion(m);
  row.lnVersion = lnArmedVersion(m);
  row.gkVersion = gkArmedVersion(m);
  row.edsChoiceOn = mm.edsPerceivedChoice === true;
  /* ⭐ `seamsAbsent` is DS-C0's OWN definition, kept byte for byte for the mirror (it is FALSE
   * on a dosed arm, by construction); `otherSeamsAbsent` is this exam's own conjunct. */
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true
    && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.otherSeamsAbsent = mm.ctbSupportPlane !== true && mm.rcAnticipate !== true
    && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.dsOwnRunFlag = mm.dsOwnRun === true;
  row.dsHatsOffFlag = mm.dsHatsOff === true;
  row.obmFlag = mm.obmMovement === true;
  row.matrixOnBaseEff = matrixOnBaseAndEff(m);
  row.infoGenomeCleanOfMatrix = infoGenomeCleanOfMatrix(m);
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as unknown as Record<string, unknown>;
    return g.lnOwnLaneWeight === undefined && g.rcReadyWeight === undefined
      && g.obmSupportWeight === undefined && g.ctbSupportDepth === undefined;
  });
  const pcHolds = mm.pcLatency === null ? null : (mm.pcLatency.holds ?? null);
  const pcLedger = mm.pcLatency === null ? null : (mm.pcLatency.ledger ?? null);
  row.pcSeatPresent = mm.pcLatency !== null;
  row.pcHoldsReadable = mm.pcLatency === null || pcHolds instanceof Map;
  const players = m.allPlayers;
  const n = players.length;
  const idxOfGid = new Map<number, number>();
  for (let i = 0; i < n; i++) idxOfGid.set(players[i].gid, i);
  /* per-body, per-class hat state and yield window (the DS-C0 MIRROR) */
  const hatActive = EP_CLASSES.map(() => new Array<boolean>(n).fill(false));
  const hatWindowEnd = EP_CLASSES.map(() => new Array<number>(n).fill(-1));
  const hatRunTicks = EP_CLASSES.map(() => zeros(n));
  const anyHat = new Array<boolean>(n).fill(false);
  /* ⭐⭐⭐ THE OWN-RUN EPISODE state */
  const ownActive = new Array<boolean>(n).fill(false);
  const ownWindowEnd = new Array<number>(n).fill(-1);
  const ownRunTicks = zeros(n);
  /* ⭐⭐ PER-STATE yield windows: [kind][state][body] */
  const stateWindowEnd = RUNKINDS.map(() => STATES.map(() => new Array<number>(n).fill(-1)));
  /* ⭐⭐⭐ DEBT (b) — the shooter gid recorded AT THE SHOT'S PUSH, per `shotLog` index */
  const shooterByLogIndex = new Map<number, number>();
  /* pre-step scratch */
  const preDecision = zeros(n);
  const preX = zeros(n); const preY = zeros(n); const preStamina = zeros(n);
  const preWallUntil = zeros(n); const preWallPartner = zeros(n);
  const preAction = new Array<string>(n).fill('');
  const preHatted = new Array<boolean>(n).fill(false);
  const notHeldPre = new Array<boolean>(n).fill(true);
  const notHeldPost = new Array<boolean>(n).fill(true);
  const preState = new Array<number>(n).fill(SI('other'));
  const openWindows: OpenWindow[] = [];
  let prevPassKey = '';
  let prevCompletedKey = '';
  let prevShotRows = 0;
  const seenOutcome: string[] = [];
  let prevOneTwos = 0; let prevOverlaps = 0; let prevThirdMan = 0;
  let prevOverlapper: (number | null)[] = [null, null];
  let prevArriver: (number | null)[] = [null, null];
  let prevLedgerHeld = pcLedger === null ? 0 : pcLedger.decisionsHeld;
  /* the OBM-T1 guard limbs, copied */
  const gPairs: number[] = [];
  let guardSamples = 0;

  while (!m.finished) {
    if (!observe) { m.step(DT); row.ticks += 1; continue; }
    /* ---------- BEFORE THE STEP ---------- */
    const phaseBefore = m.phase;
    const possBefore = m.possessionSide;
    const ownerBefore = m.ball.owner;
    const simTimeBefore = m.simTime;
    const simTickBefore = m.simTick;
    const restartBefore = m.restart;
    const brainBefore: number[] = [m.teams[0].brainTimer, m.teams[1].brainTimer];
    const crashHeldBefore: boolean[] = [false, false];
    const crossHeldBefore: boolean[] = [false, false];
    const liveCornerBefore: boolean[] = [false, false];
    for (const s of [0, 1] as const) {
      const t = m.teams[s];
      const clock = simTimeBefore + DT; /* the coach runs AFTER `simTime += dt` */
      liveCornerBefore[s] = m.phase === 'restart' && m.restart !== null
        && m.restart.kind === 'corner' && m.restart.side === s;
      crashHeldBefore[s] = !liveCornerBefore[s] && t.cornerCrash !== null
        && clock < t.cornerCrash.until;
      crossHeldBefore[s] = t.crossFlight !== null && clock < t.crossFlight.until
        && ownerBefore === null;
    }
    for (let i = 0; i < n; i++) {
      const p = players[i];
      preDecision[i] = p.decisionTimer;
      preX[i] = p.pos.x; preY[i] = p.pos.y; preStamina[i] = p.stamina;
      preWallUntil[i] = p.wallRun === null ? -1 : p.wallRun.until;
      preWallPartner[i] = p.wallRun === null ? -1 : p.wallRun.partnerGid;
      preAction[i] = p.action.type as string;
      {
        const tPre = m.teams[p.side as Side];
        preHatted[i] = hattedRecon(tPre.runners.has(p.index), tPre.arriver === p.index,
          tPre.overlapper === p.index);
      }
      /* DS-C0's PRE-STEP form, kept for the mirror and for the calibration receipt */
      notHeldPre[i] = pcHolds === null || !pcHeldRecon(pcHolds.get(p.gid), simTickBefore + 1);
      if (!notHeldPre[i] && preDecision[i] <= 0) row.pcHeldDecisionTicks += 1;
      preState[i] = SI(stateOf({
        ownerIsMate: ownerBefore !== null && ownerBefore !== p
          && ownerBefore.side === p.side,
        ownerIsNull: ownerBefore === null,
        phase: phaseBefore as string,
        possessionIsHisSide: possBefore === p.side,
        restartIsHisSide: restartBefore !== null && restartBefore.side === p.side,
      }));
    }
    /* --- POPULATION D and the CUTBACK record: the carrier's own decision tick (MIRROR) --- */
    const carrierDeciding: number[] = [];
    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      if (ownerBefore !== p) continue;
      if (!decisionTickFired(preDecision[i], notHeldPre[i])) continue;
      carrierDeciding.push(i);
    }
    const passKeyBefore = m.pendingPass === null ? ''
      : `${m.pendingPass.t}|${m.pendingPass.passerGid}|${m.pendingPass.targetGid}`;
    const completedKeyBefore = m.lastCompletedPass === null ? ''
      : `${m.lastCompletedPass.t}|${m.lastCompletedPass.passerGid}|`
        + `${m.lastCompletedPass.receiverGid}`;
    prevPassKey = passKeyBefore; prevCompletedKey = completedKeyBefore;
    prevShotRows = m.shotLog.length;
    for (let j = 0; j < prevShotRows; j++) seenOutcome[j] = m.shotLog[j].outcome;
    prevOneTwos = m.teams[0].stats.oneTwos + m.teams[1].stats.oneTwos;
    prevOverlaps = m.teams[0].stats.overlaps + m.teams[1].stats.overlaps;
    prevThirdMan = m.teams[0].stats.thirdMan + m.teams[1].stats.thirdMan;
    prevOverlapper = [m.teams[0].overlapper, m.teams[1].overlapper];
    prevArriver = [m.teams[0].arriver, m.teams[1].arriver];
    prevLedgerHeld = pcLedger === null ? 0 : pcLedger.decisionsHeld;

    for (const ci of carrierDeciding) {
      const p = players[ci];
      const team = m.teams[p.side as Side];
      const lp = m.lastCompletedPass;
      row.carrierDecisionTicks += 1;
      let wallSeen = false; let thirdSeen = false; let overSeen = false;
      for (let j = 0; j < n; j++) {
        const mate = players[j];
        if (mate === p || mate.sentOff || mate.side !== p.side) continue;
        if (preWallUntil[j] > 0 && simTimeBefore < preWallUntil[j]
          && preWallPartner[j] === p.gid) wallSeen = true;
        if (lp !== null && lp.receiverGid === p.gid && simTimeBefore - lp.t < 1.5
          && lp.passerGid !== mate.gid && preAction[j] === 'MakeRun') thirdSeen = true;
        if (team.overlapper === mate.index && Math.abs(preY[j]) > 9
          && team.localX(preX[j]) > team.localX(preX[ci]) - 6) overSeen = true;
      }
      if (wallSeen) row.fireWallReturnUpperBound += 1;
      if (thirdSeen) row.fireThirdManUpperBound += 1;
      if (overSeen) row.fireOverlapReleaseExact += 1;
    }

    m.step(DT);
    row.ticks += 1;

    /* ---------- AFTER THE STEP ---------- */
    const simTime = m.simTime;
    const simTick = m.simTick;
    const phaseAfter = m.phase;
    if (possBefore !== m.possessionSide) row.possessionFlipTicks += 1;
    /* ⭐⭐⭐ DEBT (a) — the POST-STEP holds read, at the tick the decide loop ACTUALLY used
     * (`this.stepCount` AFTER its own increment, which is exactly this post-step `simTick`). */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      notHeldPost[i] = pcHolds === null || !pcHeldRecon(pcHolds.get(p.gid), simTick);
      if (p.sentOff) continue;
      if (preDecision[i] <= 0) {
        if (!notHeldPre[i]) row.heldBodyTicksPre += 1;
        if (!notHeldPost[i]) row.heldBodyTicksPost += 1;
      }
      if (decisionTickFired(preDecision[i], notHeldPre[i])) row.decidedBodyTicksPre += 1;
      if (decisionTickFired(preDecision[i], notHeldPost[i])) row.decidedBodyTicksPost += 1;
    }
    row.ledgerDecisionsHeld += pcLedger === null ? 0 : pcLedger.decisionsHeld - prevLedgerHeld;

    /* --- POPULATION A — every coach tick, and the ones in possession (the MIRROR) --- */
    for (const s of [0, 1] as const) {
      if (!coachTickFired(brainBefore[s])) continue;
      const team = m.teams[s];
      row.coachTicks += 1;
      if (phaseBefore === 'kickoff' || phaseBefore === 'goalPause'
        || phaseBefore === 'halftime' || phaseBefore !== phaseAfter) {
        row.phaseAmbiguousCoachTicks += 1;
      }
      if (possBefore !== s) continue;
      row.coachTicksInPossession += 1;
      const br = branchOf({
        liveCorner: liveCornerBefore[s], crashHeld: crashHeldBefore[s],
        crossHeld: crossHeldBefore[s],
      });
      row.branchTicks[BRI(br)] += 1;
      const rc = team.runners.size;
      const rb = rc >= RUN_COUNT_BINS ? RUN_COUNT_BINS - 1 : rc;
      row.runCountBins[rb] += 1;
      row.runCountBinsByBranch[BRI(br) * RUN_COUNT_BINS + rb] += 1;
      row.runnerCountSum += rc;
      row.runnerDesignations += rc;
      if (team.arriver !== null) row.arriverSetByBranch[BRI(br)] += 1;
      if (team.overlapper !== null) row.overlapperSetByBranch[BRI(br)] += 1;
      for (const ri of team.runners) {
        const k = RI(team.players[ri].role as string);
        if (k >= 0) row.runnersByRole[k] += 1;
      }
      if (team.arriver !== null) {
        const k = RI(team.players[team.arriver].role as string);
        if (k >= 0) row.arriverByRole[k] += 1;
      }
      if (team.overlapper !== null) {
        const k = RI(team.players[team.overlapper].role as string);
        if (k >= 0) row.overlapperByRole[k] += 1;
      }
      const counter = team.mode === 'CounterAttack';
      const tempo = team.genome.tempo;
      const urgency = team.mentality.urgency;
      if (counter) row.inputCounterAttack += 1;
      if (tempo > TEMPO_HIGH) row.inputTempoHigh += 1;
      if (urgency > URGENCY_HIGH) row.inputUrgencyHigh += 1;
      if (br === 'openPlay') {
        row.countReconChecked += 1;
        const want = Math.min(runnerCountRecon(counter, tempo, urgency),
          team.players.filter((pp) => pp.role !== 'GK' && !pp.sentOff
            && pp !== ownerBefore).length);
        if (rc === want) row.countReconAgree += 1;
        /* ⭐⭐ THE OPEN-PLAY BOARD, as a STORED COUNT PAIR (#406 item 5(iv)) */
        row.openPlayCoachTicks += 1;
        if (rc === 0 && team.arriver === null) row.openPlayBoardEmptyTicks += 1;
      }
      const gate = overlapGeneGate(team.genome.attackingWidth, team.policy.overlapW);
      if (gate) row.overlapGeneGatePass += 1;
      if (br === 'openPlay' && gate && prevOverlapper[s] === null && ownerBefore !== null
        && ownerBefore.side === s && ownerBefore.role !== 'GK') {
        const ci = idxOfGid.get(ownerBefore.gid) ?? -1;
        if (ci >= 0 && Math.abs(preY[ci]) > ARRIVER_WIDE && team.localX(preX[ci]) > 0) {
          row.overlapPreconditionTicks += 1;
          const opp = m.teams[1 - s];
          let confronted = false;
          for (let j = 0; j < n; j++) {
            const o = players[j];
            if (o.side === s || o.sentOff) continue;
            const dd = Math.hypot(preX[j] - preX[ci], preY[j] - preY[ci]);
            if (dd < CONFRONT_R && opp.localX(preX[j]) < opp.localX(preX[ci]) + 0.5) {
              confronted = true; break;
            }
          }
          if (confronted) row.overlapConfronted += 1;
        }
      }
    }

    /* --- POPULATION B — the MIRROR (PRE-STEP holds) and the FORM OF RECORD (POST-STEP) --- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      if (possBefore !== p.side) continue;
      const isKeeper = p.role === 'GK';
      const wasCarrier = ownerBefore === p;
      const why = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      const type = p.action.type as string;
      const firedPre = decisionTickFired(preDecision[i], notHeldPre[i]);
      const firedPost = decisionTickFired(preDecision[i], notHeldPost[i]);
      if (firedPre) {
        if (isKeeper) {
          row.keeperDecisionTicks += 1;
          if (type === 'MakeRun') {
            row.hatClassTicksKeeper += 1;
            row.keeperHatClassTicks[HCI(hatClassOf(why))] += 1;
          }
        } else if (!wasCarrier) {
          row.offBallDecisionTicks += 1;
          row.offBallActionTicks[AI(type)] += 1;
          /* ⭐ THE MIRROR IS BYTE-FAITHFUL: DS-C0 read `m.restart` AFTER the step here (its
           * population-B loop runs post-step), so this line reads it post-step too. The STATE
           * classifier below uses the PRE-STEP restart, which is this exam's own definition. */
          const takerHere = phaseBefore === 'restart' && m.restart !== null
            && m.restart.takerGid === p.gid;
          const deadHere = phaseBefore !== 'playing' && phaseBefore !== 'restart';
          const chaseOwnTouch = ownerBefore === null && m.dribbleTouch !== null
            && m.dribbleTouch.gid === p.gid && simTimeBefore < m.dribbleTouch.until;
          if (!takerHere && !deadHere && !chaseOwnTouch) row.offBallBranchReached += 1;
          if (type === 'MakeRun') {
            row.makeRunTicks += 1;
            row.hatClassTicks[HCI(hatClassOf(why))] += 1;
          }
        }
      }
      if (!firedPost) continue;
      if (isKeeper) {
        row.keeperDecisionTicksPost += 1;
        if (type === 'MakeRun') {
          row.runClassTicksKeeper += 1;
          row.keeperRunClassTicks[RCI(runClassOf(why))] += 1;
        }
        continue;
      }
      if (wasCarrier) continue;
      row.offBallDecisionTicksPost += 1;
      row.offBallActionTicksPost[AI(type)] += 1;
      row.stateAllDecisions[preState[i]] += 1;
      /* ⭐⭐⭐ DS-T1b — THE SEAM'S OWN GUARD POPULATION AND THE TWO BACK-OUTS, on EVERY attacking
       * off-ball decision tick (not only the ones a run WON). The block's not-hatted guard is a
       * DECLARED RECONSTRUCTION in TWO FORMS — the hat board and the wall clock read PRE-STEP,
       * and read AFTER the step at the cadence the hat episodes are read. The POST-STEP form is
       * the denominator OF RECORD (the coach tick that writes the board runs at the HEAD of the
       * same step, before the decide loop) and BOTH are stored, with the count of visible own
       * candidates falling OUTSIDE the post-step guard stored as its own field — a
       * self-diagnosing receipt, never a claim (§DEVIATIONS). */
      {
        const teamP = m.teams[p.side as Side];
        const postHat = hattedRecon(teamP.runners.has(p.index), teamP.arriver === p.index,
          teamP.overlapper === p.index);
        const postWall = wallLiveRecon(p.wallRun === null ? -1 : p.wallRun.until, simTime);
        const unhattedPost = !postHat && !postWall;
        const unhattedPre = !preHatted[i] && !wallLiveRecon(preWallUntil[i], simTimeBefore);
        if (unhattedPost) row.unhattedOffBallTicksPost += 1;
        if (unhattedPre) row.unhattedOffBallTicksPre += 1;
        let ownScore = Number.NaN;
        for (const sc of p.action.scores) {
          if (sc.action === 'MakeRun' && sc.why === WHY_OWN) { ownScore = sc.score; break; }
        }
        const isTiredP = tiredOf(preStamina[i], teamP.genome.staminaConservation);
        const WP = teamP.policies[p.index] as unknown as { runScore: number };
        if (Number.isFinite(ownScore)) {
          row.ownCandidateVisible += 1;
          if (!unhattedPost) row.ownCandidateOutsidePostGuard += 1;
          /* ⭐⭐ THE COUNT PRIOR — the ENGINE'S OWN exported pure function (`runnerCount`), read
           * off the same three shared-convention inputs the fork reads. It touches no percept,
           * mutates nothing and draws no rng, so calling it is byte-inert; the instrument's own
           * reconstruction is required to agree with it on every corner (a fixture). */
          const cnt = runnerCount(teamP.mode, teamP.genome.tempo, teamP.mentality.urgency);
          row.countSum += cnt;
          row.countBins[countCell(cnt)] += 1;
          const pr = priorOf(p.role as Role, teamP.localX(preX[i]));
          const prod = ownScoreBackOut(ownScore, WP.runScore, pr, isTiredP);
          if (Number.isFinite(prod)) {
            row.ownBackOutN += 1; row.ownBackOutSum += prod;
            row.ownBackOutBins[ownBackOutBin(prod)] += 1;
            if (prod < 1) row.ownBackOutBelowOne += 1;
            else if (prod > 1) row.ownBackOutAboveOne += 1;
            else row.ownBackOutAtOne += 1;
            /* ⭐⭐⭐ ONLY on a seat-ABSENT arm is `obmRunMul` EXACTLY 1 by construction, and only
             * there is the RESTRAINT field written at all — on a dosed arm the same number is a
             * PRODUCT and is stored under its own name. `gFaces` asserts the emptiness. */
            if (!ARM_DOSED[arm]) {
              row.restraintN += 1; row.restraintSum += prod;
              row.restraintBins[unitBin(prod)] += 1;
              if (prod === 0) row.restraintExactZero += 1;
              if (prod === 1) row.restraintExactOne += 1;
              const rm = runningMatesFrom(prod, cnt);
              if (Number.isFinite(rm)) {
                row.rmN += 1; row.rmSum += rm; row.rmBins[rmBin(rm)] += 1;
              } else row.rmCensored += 1;
            }
          }
        }
        for (const sc of p.action.scores) {
          if (sc.action !== 'MakeRun' || sc.why !== WHY_LICENSED) continue;
          const v = runMulFromLicensed(sc.score, WP.runScore, isTiredP);
          if (Number.isFinite(v)) {
            row.runMulLicN += 1; row.runMulLicSum += v;
            row.runMulLicBins[runMulBin(v)] += 1;
            if (v < 1) row.runMulLicBelowOne += 1;
            else if (v > 1) row.runMulLicAboveOne += 1;
            else row.runMulLicAtOne += 1;
          }
          break;
        }
      }
      if (type !== 'MakeRun') continue;
      row.makeRunTicksPost += 1;
      const rcls = runClassOf(why);
      row.runClassTicks[RCI(rcls)] += 1;
      /* ⭐⭐ RUNS PER STATE — a HAT run (one of the six named) or the OWN run */
      const isOwn = rcls === 'ownRunInBehind';
      const isHat = (HAT_CLASSES_NAMED_9 as readonly string[]).includes(rcls as string);
      if (isOwn || isHat) {
        const rk: RunKind = isOwn ? 'own' : 'hat';
        row.stateRunDecisions[RKI(rk) * STATES.length + preState[i]] += 1;
        stateWindowEnd[RKI(rk)][preState[i]][i] = simTime + YIELD_WINDOW_SECONDS;
      }
      /* ⭐⭐⭐ THE SEAT'S `runMul`, BACKED OUT of the engine's own record. Taken on EVERY arm:
       * on a seat-ABSENT arm `obmRunMul` is EXACTLY 1 by construction, so that arm's stored
       * distribution IS THIS BACK-OUT'S OWN NOISE FLOOR — published, never assumed away. */
      {
        const W = m.teams[p.side as Side].policies[p.index] as unknown as { runScore: number };
        const isTired = tiredOf(preStamina[i],
          m.teams[p.side as Side].genome.staminaConservation);
        let mul = Number.NaN; let fromOwn = false;
        for (const sc of p.action.scores) {
          if (sc.action !== 'MakeRun') continue;
          if (sc.why === WHY_OWN) {
            const pr = priorOf(p.role as Role, m.teams[p.side as Side].localX(preX[i]));
            const v = runMulBackOut(sc.score, W.runScore, pr, isTired);
            if (Number.isFinite(v)) { mul = v; fromOwn = true; break; }
          }
        }
        if (!Number.isFinite(mul)) {
          for (const sc of p.action.scores) {
            if (sc.action !== 'MakeRun' || sc.why !== WHY_LICENSED) continue;
            const v = runMulBackOut(sc.score, W.runScore, 1, isTired);
            if (Number.isFinite(v)) { mul = v; break; }
          }
        }
        if (Number.isFinite(mul)) {
          row.runMulCount += 1;
          row.runMulSum += mul;
          row.runMulBinsArr[runMulBin(mul)] += 1;
          if (mul < 1) row.runMulBelowOne += 1;
          else if (mul > 1) row.runMulAboveOne += 1;
          else row.runMulAtOne += 1;
          if (fromOwn) row.runMulFromOwn += 1; else row.runMulFromLicensed += 1;
        }
      }
    }
    /* the CUTBACK candidate FORMED / TAKEN, off the carrier's OWN decision record (MIRROR) */
    for (const ci of carrierDeciding) {
      const p = players[ci];
      let formed = false;
      for (const sc of p.action.scores) {
        if (typeof sc.why === 'string' && sc.why.startsWith(CUTBACK_PREFIX)) formed = true;
      }
      if (formed) { row.cutbackFormed += 1; row.fireArriverCutbackFormed += 1; }
      const w0 = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      if ((p.action.type as string) === 'Pass' && typeof w0 === 'string'
        && w0.startsWith(CUTBACK_PREFIX)) {
        row.cutbackTaken += 1; row.fireArriverCutbackTaken += 1;
      }
    }

    /* --- ⭐⭐⭐ R1 — THE FLOOD FACE: EXECUTED runs per IN-POSSESSION OPEN-PLAY tick --- */
    for (const s of [0, 1] as const) {
      if (m.possessionSide !== s) continue;
      if (m.phase !== 'playing') continue;
      const team = m.teams[s];
      /* the engine's OWN held-licence state, read at the END of the tick */
      const crashLive = team.cornerCrash !== null && simTime < team.cornerCrash.until;
      const crossLive = team.crossFlight !== null && simTime < team.crossFlight.until;
      if (crashLive || crossLive) continue;
      let running = 0;
      for (const p of team.players) {
        if (p.sentOff || p.role === 'GK') continue;
        if ((p.action.type as string) !== 'MakeRun') continue;
        running += 1;
        const k = RI(p.role as string);
        if (k >= 0) row.r1RunnersByRole[k] += 1;
      }
      row.r1TeamTicks += 1;
      row.r1Bins[running >= R1_BINS ? R1_BINS - 1 : running] += 1;
      row.r1RunnerSum += running;
      if (running >= R1_FLOOD_AT) row.r1FloodTicks += 1;
    }

    /* --- THE HAT STATE at the END of the tick, and the EPISODE transitions (MIRROR) --- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      const team = m.teams[p.side as Side];
      const nowState = [
        team.runners.has(p.index),
        team.arriver === p.index,
        team.overlapper === p.index,
        p.wallRun !== null && simTime < p.wallRun.until,
      ];
      for (let c = 0; c < EP_CLASSES.length; c++) {
        const was = hatActive[c][i];
        const now = nowState[c];
        if (now && !was) { row.epSets[c] += 1; hatRunTicks[c][i] = 0; }
        if (now) { row.epTicks[c] += 1; hatRunTicks[c][i] += 1; }
        if (!now && was) {
          hatWindowEnd[c][i] = simTime + YIELD_WINDOW_SECONDS;
          row.epTickBins[c * EP_TICK_BINS + binOf(hatRunTicks[c][i], EP_TICK_BIN, EP_TICK_BINS)]
            += 1;
          row.epTickBinsWide[c * EPW_BINS + binOf(hatRunTicks[c][i], EPW_BIN, EPW_BINS)] += 1;
        }
        hatActive[c][i] = now;
      }
      anyHat[i] = nowState[0] || nowState[1] || nowState[2] || nowState[3];
      /* ⭐⭐⭐ THE OWN-RUN EPISODE, off the engine's own decision record */
      const why = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      const ownNow = ownRunActiveOf(p.action.type as string, why);
      if (ownNow && !ownActive[i]) { row.ownEpSets += 1; ownRunTicks[i] = 0; }
      if (ownNow) { row.ownEpTicks += 1; ownRunTicks[i] += 1; }
      if (!ownNow && ownActive[i]) {
        ownWindowEnd[i] = simTime + YIELD_WINDOW_SECONDS;
        row.ownEpTickBins[binOf(ownRunTicks[i], EPW_BIN, EPW_BINS)] += 1;
      }
      ownActive[i] = ownNow;
    }
    /* the HATTED share of the attacking outfield, per stepped tick (MIRROR) */
    if (m.possessionSide !== -1) {
      row.possessionTicks += 1;
      for (let i = 0; i < n; i++) {
        const p = players[i];
        if (p.sentOff || p.role === 'GK' || p.side !== m.possessionSide) continue;
        row.attackingOutfield += 1;
        if (anyHat[i]) row.attackingHatted += 1;
      }
    }
    /* the OVERLAP / ARRIVER SETS, off the fields' own transitions (MIRROR) */
    for (const s of [0, 1] as const) {
      const t = m.teams[s];
      if (t.overlapper !== null && t.overlapper !== prevOverlapper[s]) row.overlapSets += 1;
      if (t.arriver !== null && t.arriver !== prevArriver[s]) row.arriverSets += 1;
    }

    /* --- THE PASS LEDGERS: aimed, and the wall trigger --- */
    const pp = m.pendingPass;
    const passKey = pp === null ? '' : `${pp.t}|${pp.passerGid}|${pp.targetGid}`;
    if (pp !== null && passKey !== prevPassKey) {
      const ti = idxOfGid.get(pp.targetGid) ?? -1;
      const pi = idxOfGid.get(pp.passerGid) ?? -1;
      if (ti >= 0 && pi >= 0) {
        row.aimDistCount += 1;
        row.aimDistSum += Math.hypot(players[pi].pos.x - players[ti].pos.x,
          players[pi].pos.y - players[ti].pos.y);
      }
      const throughNow = m.lastPassKind !== null && m.lastPassKind.kind === 'through'
        && m.lastPassKind.t === simTime;
      if (ti >= 0) {
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (!inYieldWindow(hatActive[c][ti], simTime, hatWindowEnd[c][ti])) continue;
          row.epPassAimed[c] += 1;
          if (pp.bounce === true) row.epPassBounce[c] += 1;
          if (throughNow) row.epPassThrough[c] += 1;
        }
        if (inYieldWindow(ownActive[ti], simTime, ownWindowEnd[ti])) {
          row.ownEpPassAimed += 1;
          if (throughNow) row.ownEpPassThrough += 1;
        }
        for (let k = 0; k < RUNKINDS.length; k++) {
          for (let st = 0; st < STATES.length; st++) {
            if (simTime <= stateWindowEnd[k][st][ti]) {
              row.stateAimed[k * STATES.length + st] += 1;
            }
          }
        }
      }
      const ground = m.lastPassKind !== null && m.lastPassKind.kind === 'pass'
        && m.lastPassKind.t === simTime;
      if (ground && pi >= 0 && ti >= 0 && players[pi].role !== 'GK') {
        const passer = players[pi];
        const target = players[ti];
        const team = m.teams[passer.side as Side];
        const opp = m.teams[1 - (passer.side as Side)];
        row.wallEligiblePasses += 1;
        const inputs: WallInputs = {
          isGk: false,
          dProxy: Math.hypot(passer.pos.x - target.pos.x, passer.pos.y - target.pos.y),
          pressure: pressureAt(passer.pos, opp.players),
          stamina: passer.stamina,
          localX: team.localX(passer.pos.x),
          tempo: team.genome.tempo, passBias: team.genome.passBias,
          wallPassW: team.policies[passer.index].wallPassW,
        };
        const cj = wallConjuncts(inputs);
        for (let c = 0; c < CONJUNCTS.length; c++) if (!cj[c]) row.wallConjunctKills[c] += 1;
        const reconFire = cj.every((x) => x);
        if (reconFire) row.wallReconAllTrue += 1;
        const wr = passer.wallRun;
        const fired = wr !== null && wr.partnerGid === target.gid
          && Math.abs(wr.until - (simTime + WALL_WINDOW)) < 1e-9;
        if (fired) row.wallFires += 1;
        if (fired === reconFire) row.wallReconAgrees += 1;
      }
    }
    /* --- THE COMPLETION RECORD, and the DOWNSTREAM windows --- */
    const lc = m.lastCompletedPass;
    const completedKey = lc === null ? ''
      : `${lc.t}|${lc.passerGid}|${lc.receiverGid}`;
    if (lc !== null && completedKey !== prevCompletedKey) {
      const ri2 = idxOfGid.get(lc.receiverGid) ?? -1;
      if (ri2 >= 0) {
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (inYieldWindow(hatActive[c][ri2], simTime, hatWindowEnd[c][ri2])) {
            row.epPassCompleted[c] += 1;
          }
        }
        if (inYieldWindow(ownActive[ri2], simTime, ownWindowEnd[ri2])) {
          row.ownEpPassCompleted += 1;
        }
        const hatted = anyHat[ri2];
        if (hatted) row.completedHatted += 1; else row.completedUnhatted += 1;
        openWindows.push({
          until: simTime + YIELD_WINDOW_SECONDS, side: players[ri2].side as Side, hatted,
        });
      }
    }
    while (openWindows.length > 0 && openWindows[0].until < simTime) openWindows.shift();
    /* --- THE SHOT LEDGER: new rows joined to `pendingShot.shooterGid` AT THE PUSH --- */
    if (m.shotLog.length > prevShotRows) {
      for (let j = prevShotRows; j < m.shotLog.length; j++) {
        row.shotLogRows += 1;
        const entry = m.shotLog[j];
        if (entry.assist === 'cutback') row.cutbackAssistShots += 1;
        const ps = m.pendingShot;
        const shooterGid = ps !== null && ps.logIndex === j ? ps.shooterGid : -1;
        if (shooterGid < 0) continue;
        row.shotsJoinedToAShooter += 1;
        /* ⭐⭐⭐ DEBT (b): the gid is BANKED HERE, at the push, while `pendingShot` is live */
        shooterByLogIndex.set(j, shooterGid);
        const si = idxOfGid.get(shooterGid) ?? -1;
        if (si < 0) continue;
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (inYieldWindow(hatActive[c][si], simTime, hatWindowEnd[c][si])) row.epShots[c] += 1;
        }
        if (inYieldWindow(ownActive[si], simTime, ownWindowEnd[si])) row.ownEpShots += 1;
        for (let k = 0; k < RUNKINDS.length; k++) {
          for (let st = 0; st < STATES.length; st++) {
            if (simTime <= stateWindowEnd[k][st][si]) {
              row.stateShots[k * STATES.length + st] += 1;
            }
          }
        }
        for (const w of openWindows) {
          if (w.side !== entry.side) continue;
          if (w.hatted) row.shotsAfterHatted += 1; else row.shotsAfterUnhatted += 1;
        }
      }
    }
    /* --- GOALS: the outcome flip on a row we joined to a shooter --- */
    for (let j = 0; j < m.shotLog.length; j++) {
      const before = j < prevShotRows ? seenOutcome[j] : 'pending';
      const after = m.shotLog[j].outcome;
      if (before !== 'pending' || after !== 'goal') continue;
      /* the DS-C0 MIRROR — `pendingShot` at the FLIP tick (VOID whenever it has been cleared) */
      const ps = m.pendingShot;
      const gid = ps !== null && ps.logIndex === j ? ps.shooterGid : -1;
      const gi = gid < 0 ? -1 : (idxOfGid.get(gid) ?? -1);
      if (gi >= 0) {
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (inYieldWindow(hatActive[c][gi], simTime, hatWindowEnd[c][gi])) row.epGoals[c] += 1;
        }
      }
      /* ⭐⭐⭐ DEBT (b) PAID — the gid BANKED AT THE PUSH */
      const gidFixed = shooterByLogIndex.get(j) ?? -1;
      const gfi = gidFixed < 0 ? -1 : (idxOfGid.get(gidFixed) ?? -1);
      if (gfi >= 0) {
        row.goalRowsJoinedAtThePush += 1;
        for (let c = 0; c < EP_CLASSES.length; c++) {
          if (inYieldWindow(hatActive[c][gfi], simTime, hatWindowEnd[c][gfi])) {
            row.epGoalsFixed[c] += 1;
          }
        }
        if (inYieldWindow(ownActive[gfi], simTime, ownWindowEnd[gfi])) row.ownEpGoals += 1;
      } else {
        row.goalRowsUnjoinable += 1;
      }
      for (const w of openWindows) {
        if (w.side !== m.shotLog[j].side) continue;
        if (w.hatted) row.goalsAfterHatted += 1; else row.goalsAfterUnhatted += 1;
      }
    }
    /* --- THE ENGINE'S OWN ONE-TWO / OVERLAP / THIRD-MAN LEDGERS --- */
    row.wallOneTwosStat += (m.teams[0].stats.oneTwos + m.teams[1].stats.oneTwos) - prevOneTwos;
    row.overlapArrivedStat += (m.teams[0].stats.overlaps + m.teams[1].stats.overlaps)
      - prevOverlaps;
    row.thirdManStat += (m.teams[0].stats.thirdMan + m.teams[1].stats.thirdMan) - prevThirdMan;
    /* --- THE CROWDING FAMILY, at the A4 battery's OWN cadence (anchored) --- */
    if (simTick % SAMPLE_EVERY === 0 && m.phase === 'playing') {
      row.crowdSampleTicks += 1;
      guardSamples += 1;
      const takePairs = guardSamples % PAIR_SUBSAMPLE === 0;
      for (const t of m.teams) {
        const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
        if (outfield.length === 0 || !takePairs) continue;
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            gPairs.push(Math.hypot(outfield[i].pos.x - outfield[j].pos.x,
              outfield[i].pos.y - outfield[j].pos.y));
          }
        }
      }
      const owner = m.ball.owner;
      const possSide: Side | null = owner !== null ? owner.side as Side
        : (m.possessionSide !== -1 ? m.possessionSide as Side : null);
      if (possSide !== null) {
        const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
        row.crowdSamples += 1;
        let mp = Infinity;
        for (let a = 0; a < outs.length; a++) {
          for (let b = a + 1; b < outs.length; b++) {
            const d = Math.hypot(outs[a].pos.x - outs[b].pos.x, outs[a].pos.y - outs[b].pos.y);
            if (d < mp) mp = d;
          }
        }
        if (Number.isFinite(mp) && mp < DUP_RUN_M) row.crashHits += 1;
      }
    }
  }
  /* ---- the EPISODES still ACTIVE at full time (DEBT (c)) ---- */
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < EP_CLASSES.length; c++) if (hatActive[c][i]) row.epActiveAtFullTime[c] += 1;
    if (ownActive[i]) row.ownEpActiveAtFullTime += 1;
  }
  /* ---- the GUARD FOLD — OBM-T1's own three lines, COPIED (anchored at §3) ---- */
  row.guardPairsTotal = gPairs.length;
  row.guardPairsUnder4 = gPairs.filter((v) => v < CLOSE_PAIR_M).length;
  row.guardU4N = gPairs.length > 0 ? 1 : 0;
  row.guardU4Sum = gPairs.length === 0 ? 0
    : gPairs.filter((v) => v < CLOSE_PAIR_M).length / gPairs.length;
  /* ---- the WORLD receipt, per arm ---- */
  const flagsAsDue = row.dsOwnRunFlag === (kind !== 'HATS')
    && row.dsHatsOffFlag === (kind === 'OWN')
    && row.obmFlag === ARM_DOSED[arm]
    && (ARM_DOSED[arm] ? row.matrixOnBaseEff : !row.matrixOnBaseEff)
    && row.infoGenomeCleanOfMatrix;
  row.worldOk = row.bqVersion === BQ_WORLD_VERSION && row.lnVersion !== LN_WORLD_VERSION
    && row.gkVersion !== GK_WORLD_VERSION && mm.bqCushion === true
    && mm.lnOwnLanePrice !== true && mm.gkDiveBody !== true
    && row.otherSeamsAbsent && flagsAsDue;
  row.policyCacheEntries = mm.obmPolicies === undefined ? 0 : mm.obmPolicies.size;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.shots = st[0].shots + st[1].shots;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.offsides = st[0].offsides + st[1].offsides;
  row.throughBallsStat = st[0].throughBalls + st[1].throughBalls;
  row.possessionTimeOwn = [st[0].possessionTime, st[1].possessionTime];
  row.xgSum = m.shotLog.reduce((a, e) => a + e.xg, 0);
  row.overlapReleaseFires = row.fireOverlapReleaseExact;
  row.signature = signatureOf(m);
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 THE CODE FACTS — the EXTRACTED call graph (canon: "the callee list is EXTRACTED from
   the hashed text — every identifier called within the span, resolved to its definition and
   hashed — never typed")                                                                    */
/* ========================================================================== */
const listTs = (dir: string): string[] => readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => (d.isDirectory() ? listTs(`${dir}/${d.name}`)
    : d.name.endsWith('.ts') ? [`${dir}/${d.name}`] : []));
const GRAPH_DIRS = ['src/sim', 'src/ai'];
const GRAPH_FILES = GRAPH_DIRS.flatMap(listTs).sort();
const GRAPH_SRC: Record<string, string[]> = {};
for (const f of GRAPH_FILES) GRAPH_SRC[f] = readFileSync(f, 'utf8').split('\n');
const KEYWORDS = new Set(['if', 'for', 'while', 'switch', 'catch', 'do', 'else', 'try',
  'return', 'case', 'typeof', 'new', 'function', 'await', 'of', 'in', 'delete', 'void',
  'yield', 'super', 'constructor']);
interface Span {
  file: string; name: string; start: number; end: number; text: string; sha: string;
}
const SPANS: Span[] = [];
const HEAD_RE = /^(\s*)(?:(?:export|private|public|protected|static|async|readonly|declare)\s+)*(?:function\s+)?(?:(?:const|let|var)\s+)?(?:(get|set)\s+)?([A-Za-z_$][\w$]*)/;
const FN_DECL = /^\s*(?:export\s+)?(?:async\s+)?function\s*\*?\s*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(/;
const METHOD_DECL = /^\s*(?:(?:private|public|protected|static|async|readonly|get|set)\s+)*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\([^)]*\)\s*(?::\s*[^;{]+)?\s*\{\s*$/;
const ARROW_DECL = /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*(?:async\s*)?(?:\([^)]*\)|[A-Za-z_$][\w$]*)\s*(?::\s*[^=]+)?=>\s*\{\s*$/;
const MULTI_OPEN_M = /^\s*(?:(?:private|public|protected|static|async|readonly|get|set)\s+)*[A-Za-z_$][\w$]*\s*(?:<[^>]*>)?\s*\(\s*$/;
const MULTI_OPEN_A = /^\s*(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*(?::[^=]+)?=\s*(?:async\s*)?\(\s*$/;
const MULTI_CLOSE = /^(\s*)\)[^;{]*\{\s*$/;
const isFnHead = (L: string, multi: boolean): boolean => (multi
  ? FN_DECL.test(L) || MULTI_OPEN_M.test(L) || MULTI_OPEN_A.test(L)
  : FN_DECL.test(L) || METHOD_DECL.test(L) || ARROW_DECL.test(L));
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    if (!L.endsWith('{')) continue;
    let headLine = i;
    let headText = L;
    const mMulti = MULTI_CLOSE.exec(L);
    if (mMulti !== null) {
      const ind = mMulti[1];
      let k = i - 1;
      while (k >= 0 && !(lines[k].startsWith(ind) && lines[k].trim().length > 0
        && lines[k].indexOf('(') >= 0 && !lines[k].endsWith('{')
        && lines[k].length - lines[k].trimStart().length === ind.length)) k -= 1;
      if (k < 0) continue;
      headLine = k; headText = lines[k];
    }
    if (headText.indexOf('(') < 0) continue;
    const t = headText.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('}')) continue;
    if (!isFnHead(headText, mMulti !== null)) continue;
    const mHead = HEAD_RE.exec(headText);
    if (mHead === null) continue;
    const name = mHead[3];
    if (KEYWORDS.has(name)) continue;
    const indent = mHead[1];
    const close = `${indent}}`;
    let end = -1;
    for (let j = i + 1; j < lines.length; j++) {
      const c = lines[j];
      if (c === close || c === `${close};` || c === `${close});`) { end = j; break; }
    }
    if (end < 0) continue;
    const text = lines.slice(headLine, end + 1).join('\n');
    SPANS.push({ file: f, name, start: headLine + 1, end: end + 1, text, sha: sha(text) });
  }
}
const spansByName = new Map<string, Span[]>();
for (const s of SPANS) {
  const arr = spansByName.get(s.name) ?? [];
  arr.push(s); spansByName.set(s.name, arr);
}
const spanKey = (s: Span): string => `${s.file}:${s.start}-${s.end}:${s.name}`;
const enclosingOf = (file: string, line: number): Span | null => {
  let best: Span | null = null;
  for (const s of SPANS) {
    if (s.file !== file || s.start > line || s.end < line) continue;
    if (best === null || s.start > best.start) best = s;
  }
  return best;
};
const CALL_RE = /([A-Za-z_$][\w$]*)\s*\(/g;
const calleesOf = (s: Span): { resolved: Span[]; external: string[] } => {
  const seen = new Set<string>();
  const resolved: Span[] = [];
  const external: string[] = [];
  let mm2: RegExpExecArray | null = null;
  CALL_RE.lastIndex = 0;
  while ((mm2 = CALL_RE.exec(s.text)) !== null) {
    const nm = mm2[1];
    if (KEYWORDS.has(nm) || seen.has(nm)) continue;
    seen.add(nm);
    const hits = spansByName.get(nm);
    if (hits === undefined) { external.push(nm); continue; }
    for (const h of hits) if (h !== s) resolved.push(h);
  }
  return { resolved, external };
};
const CLOSURE_NODE_CAP = 1200;
const closureOf = (roots: readonly Span[]): {
  nodes: Span[]; externals: string[]; depth: number; capped: boolean;
} => {
  const seen = new Map<string, Span>();
  const externals = new Set<string>();
  let frontier = [...roots];
  for (const r of roots) seen.set(spanKey(r), r);
  let depth = 0;
  let capped = false;
  while (frontier.length > 0 && depth < 12) {
    const next: Span[] = [];
    for (const nd of frontier) {
      const { resolved, external } = calleesOf(nd);
      for (const e of external) externals.add(e);
      for (const c of resolved) {
        const k = spanKey(c);
        if (seen.has(k)) continue;
        if (seen.size >= CLOSURE_NODE_CAP) { capped = true; continue; }
        seen.set(k, c); next.push(c);
      }
    }
    if (next.length === 0) break;
    frontier = next; depth += 1;
  }
  return { nodes: [...seen.values()], externals: [...externals].sort(), depth, capped };
};
const findSpan = (file: string, name: string, headNeedle: string): Span | null => {
  const hits = occurrences(SRC_OF[file], headNeedle);
  if (hits.length !== 1) return null;
  const s = enclosingOf(file, hits[0].line + 1);
  return s !== null && s.name === name ? s : null;
};
/** ⭐⭐⭐ THE FOUR FUNCTIONS #406 item 5 NAMES, hashed WHOLE with their EXTRACTED callees. */
const SPAN_ASSIGN_RUNNERS = findSpan(TEAMBRAIN_PATH, 'assignRunners',
  'function assignRunners(team: Team, match: Match): void {');
const SPAN_DECIDE_OFFBALL = findSpan(BRAIN_PATH, 'decideOffBall',
  'function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {');
const SPAN_EXECUTE_ACTION = findSpan(EXEC_PATH, 'executeAction',
  'export function executeAction(p: Player, match: Match, dt: number): void {');
const SPAN_OBM_POLICY = (() => {
  const hits = occurrences(readFileSync(EYES_PATH, 'utf8'), 'export function obmOffballPolicy(');
  if (hits.length !== 1) return null;
  const lines = readFileSync(EYES_PATH, 'utf8').split('\n');
  let end = -1;
  for (let j = hits[0].line; j < lines.length; j++) if (lines[j] === '}') { end = j; break; }
  if (end < 0) return null;
  const text = lines.slice(hits[0].line - 1, end + 1).join('\n');
  return { file: EYES_PATH, name: 'obmOffballPolicy', start: hits[0].line, end: end + 1,
    text, sha: sha(text) } as Span;
})();
const HASHED_ROOTS = [SPAN_ASSIGN_RUNNERS, SPAN_DECIDE_OFFBALL, SPAN_EXECUTE_ACTION,
  SPAN_OBM_POLICY].filter((s): s is Span => s !== null);
const ROOTS_COMPLETE = HASHED_ROOTS.length === 4;
const MAKERUN_CASE_LINE = occurrences(SRC_OF[EXEC_PATH], "    case 'MakeRun': {");
const MAKERUN_CASE_ENCLOSING = MAKERUN_CASE_LINE.length === 1
  ? enclosingOf(EXEC_PATH, MAKERUN_CASE_LINE[0].line) : null;
const MAKERUN_CASE_IN_EXECUTE_ACTION = MAKERUN_CASE_ENCLOSING !== null
  && SPAN_EXECUTE_ACTION !== null
  && spanKey(MAKERUN_CASE_ENCLOSING) === spanKey(SPAN_EXECUTE_ACTION);
const ROOT_GRAPH = HASHED_ROOTS.map((s) => ({
  root: spanKey(s), sha: s.sha,
  callees: calleesOf(s).resolved.map((c) => ({ span: spanKey(c), sha: c.sha }))
    .sort((a, b) => (a.span < b.span ? -1 : 1)),
  externals: calleesOf(s).external.slice().sort(),
}));
const DESIGNATION_CLOSURE = closureOf(HASHED_ROOTS);

/** ⭐⭐ THE SIX DESIGNATION FIELDS' write and read sites (DS-C0's census, re-taken). */
const FIELD_NEEDLES = [
  { key: 'team.runners', re: /\.runners\b/ },
  { key: 'team.arriver', re: /\.arriver\b/ },
  { key: 'team.overlapper', re: /\.overlapper\b/ },
  { key: 'team.cornerCrash', re: /\.cornerCrash\b/ },
  { key: 'team.crossFlight', re: /\.crossFlight\b/ },
  { key: 'p.wallRun', re: /\.wallRun\b/ },
] as const;
const WRITE_OPS = /\.(runners|arriver|overlapper|cornerCrash|crossFlight|wallRun)\s*(=|\+=|-=)(?!=)/;
const SET_MUTATORS = /\.runners\.(add|delete|clear)\s*\(/;
interface FieldSite {
  field: string; file: string; line: number; text: string; kind: 'write' | 'read';
  fn: string | null; fnSpan: string | null;
}
const FIELD_SITES: FieldSite[] = [];
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    const t = L.trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    for (const nd of FIELD_NEEDLES) {
      if (!nd.re.test(L)) continue;
      const enc = enclosingOf(f, i + 1);
      const isWrite = WRITE_OPS.test(L) || SET_MUTATORS.test(L);
      FIELD_SITES.push({
        field: nd.key, file: f, line: i + 1, text: t, kind: isWrite ? 'write' : 'read',
        fn: enc === null ? null : enc.name, fnSpan: enc === null ? null : spanKey(enc),
      });
    }
  }
}
const fieldCount = (field: string, kind: 'write' | 'read'): number =>
  FIELD_SITES.filter((s) => s.field === field && s.kind === kind).length;
const FIELD_COUNTS = Object.fromEntries(FIELD_NEEDLES.map((nd) => [nd.key, {
  writes: fieldCount(nd.key, 'write'), reads: fieldCount(nd.key, 'read'),
  total: FIELD_SITES.filter((s) => s.field === nd.key).length,
}]));
const EVERY_FIELD_SITE_RESOLVED = FIELD_SITES.every((s) => s.fn !== null);
const EVERY_FIELD_NEEDLE_LIVE = FIELD_NEEDLES.every((nd) =>
  FIELD_SITES.some((s) => s.field === nd.key));

/** ⭐⭐⭐ EVERY `MakeRun` CANDIDATE PUSH in the corpus, CLASSIFIED. DS-C0's extractor took the
 *  NEAREST enclosing `if` only; #406 item 3(iii) requires the class `flagGated`, whose gate on
 *  the seam's own push is the ENCLOSING `if (match.dsOwnRun)` ONE LEVEL FURTHER OUT. This
 *  classifier therefore walks the WHOLE enclosing-`if` CHAIN up to the function head and
 *  classifies on the chain:
 *    flagGated       — some enclosing guard names a DS flag (the flag is NAMED)
 *    hatGuarded      — some enclosing guard names one of the six designation fields
 *    keeperUpGuarded — some enclosing guard names the keeper-up licence
 *    unguarded       — none of the above (RED for anything on the shipped path)
 *  ⛔ `makeRunCandidatesAllHatGuardedOnShippedPath` is DERIVED over the pushes REACHABLE WITH
 *  BOTH DS FLAGS ABSENT (i.e. the NOT-flagGated ones), never typed. */
const DESIGNATION_NEEDLE_RE = /\.(runners|arriver|overlapper|cornerCrash|crossFlight|wallRun)\b/;
const KEEPER_UP_RE = /\.keeperUp\b/;
const DS_FLAG_RE = /match\.(dsOwnRun|dsHatsOff)\b/;
type PushClass = 'flagGated' | 'hatGuarded' | 'keeperUpGuarded' | 'unguarded';
interface MakeRunPush {
  file: string; line: number; text: string; fn: string | null; fnSpan: string | null;
  guardChain: { line: number; text: string }[];
  nearestGuardLine: number | null; nearestGuardText: string;
  hatGuarded: boolean; keeperUpGuarded: boolean; flagGated: boolean; flagNamed: string | null;
  pushClass: PushClass; reachableWithBothFlagsAbsent: boolean;
  inDecideOffBall: boolean; sameCandidateLiteralAsPrevious: boolean;
}
const MAKERUN_PUSHES: MakeRunPush[] = [];
for (const f of GRAPH_FILES) {
  const lines = GRAPH_SRC[f];
  for (let i = 0; i < lines.length; i++) {
    const L = lines[i];
    const t = L.trim();
    if (t.startsWith('//') || t.startsWith('*')) continue;
    if (!/(action|type):\s*'MakeRun'/.test(L)) continue;
    const enc = enclosingOf(f, i + 1);
    const chain: { line: number; text: string }[] = [];
    let ind = L.length - L.trimStart().length;
    for (let k = i - 1; k >= 0 && (enc === null || k >= enc.start - 1); k--) {
      const c = lines[k];
      if (c.trim().length === 0) continue;
      const cInd = c.length - c.trimStart().length;
      if (cInd >= ind) continue;
      if (!/^\s*(\}\s*else\s+)?if\s*\(/.test(c)) { ind = cInd; continue; }
      /* ⭐ the `if` must OPEN A BLOCK that still contains the push: its signature has to close
       * on a `) {` line at or before the push. A single-line `if (x) y;` is NOT a guard. */
      const parts: string[] = [];
      let opened = false;
      for (let q = k; q < lines.length && q <= i; q++) {
        parts.push(lines[q].trim());
        if (/\)\s*\{\s*$/.test(lines[q])) { opened = true; break; }
        if (/;\s*$/.test(lines[q])) break;
      }
      if (!opened) { ind = cInd; continue; }
      chain.push({ line: k + 1, text: parts.join(' ') });
      ind = cInd;
    }
    const chainText = chain.map((c) => c.text).join(' ');
    const hatGuarded = DESIGNATION_NEEDLE_RE.test(chainText);
    const keeperUpGuarded = KEEPER_UP_RE.test(chainText);
    const flagMatch = DS_FLAG_RE.exec(chainText);
    const flagGated = flagMatch !== null;
    const pushClass: PushClass = flagGated ? 'flagGated'
      : hatGuarded ? 'hatGuarded' : keeperUpGuarded ? 'keeperUpGuarded' : 'unguarded';
    const prev = MAKERUN_PUSHES[MAKERUN_PUSHES.length - 1];
    MAKERUN_PUSHES.push({
      file: f, line: i + 1, text: t,
      fn: enc === null ? null : enc.name, fnSpan: enc === null ? null : spanKey(enc),
      guardChain: chain,
      nearestGuardLine: chain.length > 0 ? chain[0].line : null,
      nearestGuardText: chain.length > 0 ? chain[0].text : '',
      hatGuarded, keeperUpGuarded, flagGated,
      flagNamed: flagMatch === null ? null : flagMatch[1],
      pushClass, reachableWithBothFlagsAbsent: !flagGated,
      inDecideOffBall: SPAN_DECIDE_OFFBALL !== null && f === BRAIN_PATH
        && i + 1 >= SPAN_DECIDE_OFFBALL.start && i + 1 <= SPAN_DECIDE_OFFBALL.end,
      sameCandidateLiteralAsPrevious: prev !== undefined && prev.file === f
        && i + 1 - prev.line <= 2,
    });
  }
}
const SHIPPED_PATH_PUSHES = MAKERUN_PUSHES.filter((p) => p.reachableWithBothFlagsAbsent);
const FLAG_GATED_PUSHES = MAKERUN_PUSHES.filter((p) => p.flagGated);
/** ⭐⭐⭐ THE STORED BOOLEAN, DERIVED (#406 item 5's code facts). */
const makeRunCandidatesAllHatGuardedOnShippedPath = ROOTS_COMPLETE
  && MAKERUN_PUSHES.length > 0 && SHIPPED_PATH_PUSHES.length > 0
  && SHIPPED_PATH_PUSHES.every((p) => p.hatGuarded || p.keeperUpGuarded);
const PUSH_CLASS_COUNTS = Object.fromEntries(
  (['flagGated', 'hatGuarded', 'keeperUpGuarded', 'unguarded'] as PushClass[])
    .map((c) => [c, MAKERUN_PUSHES.filter((p) => p.pushClass === c).length]),
);
/* the classifier's own FIXTURES — it must be able to say each word */
fx('pushClass.theSeamsOwnPushIsFlagGatedOnDsOwnRun',
  MAKERUN_PUSHES.filter((p) => p.flagGated).map((p) => p.flagNamed), ['dsOwnRun']);
fx('pushClass.theSeamsOwnPushIsNOTHatGuarded',
  MAKERUN_PUSHES.filter((p) => p.flagGated).map((p) => p.hatGuarded), [false]);
fx('pushClass.exactlyONEPushIsFlagGated', FLAG_GATED_PUSHES.length, 1);
fx('pushClass.theFlagGatedPushIsInsideDecideOffBall',
  FLAG_GATED_PUSHES.map((p) => p.inDecideOffBall), [true]);
fx('pushClass.everyShippedPathPushIsGuarded',
  SHIPPED_PATH_PUSHES.every((p) => p.pushClass !== 'unguarded'), true);
fx('pushClass.theShippedPathBooleanIsDerived',
  makeRunCandidatesAllHatGuardedOnShippedPath,
  SHIPPED_PATH_PUSHES.every((p) => p.hatGuarded || p.keeperUpGuarded));
fx('pushClass.everyClassWordIsInTheVocabulary',
  MAKERUN_PUSHES.every((p) => ['flagGated', 'hatGuarded', 'keeperUpGuarded', 'unguarded']
    .includes(p.pushClass)), true);

/** ⭐⭐⭐ THE TWO FLAGS' READ FORKS under `src/**`, ENUMERATED and COMPARED to the SEAM DOC's
 *  OWN READ-FORK INVENTORY (parsed out of the markdown — equal or RED). */
const codeLinesOf = (text: string): string[] => text.split('\n')
  .map((l) => l.trim())
  .filter((l) => l !== '' && !l.startsWith('//') && !l.startsWith('*') && !l.startsWith('/*'));
const SRC_ALL_FILES = listTs('src').sort();
interface FlagCount { file: string; own: number; hats: number }
const FLAG_COUNTS: FlagCount[] = [];
for (const f of SRC_ALL_FILES) {
  const t = codeLinesOf(readFileSync(f, 'utf8')).join('\n');
  const own = (t.match(/dsOwnRun/g) ?? []).length;
  const hats = (t.match(/dsHatsOff/g) ?? []).length;
  if (own > 0 || hats > 0) FLAG_COUNTS.push({ file: f, own, hats });
}
interface ReadFork { file: string; line: number; text: string; flag: string }
const READ_FORKS: ReadFork[] = [];
for (const f of SRC_ALL_FILES) {
  const lines = readFileSync(f, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) continue;
    if (/^if\s*\(\s*match\.dsOwnRun\s*\)\s*\{/.test(t)) {
      READ_FORKS.push({ file: f, line: i + 1, text: t, flag: 'dsOwnRun' });
    }
    if (/^if\s*\(\s*!match\.dsHatsOff\s*\)\s*\{/.test(t)) {
      READ_FORKS.push({ file: f, line: i + 1, text: t, flag: 'dsHatsOff' });
    }
  }
}
/** the SEAM DOC's own inventory, PARSED (never typed here) */
const SEAM_DOC = SRC_OF[SEAM_DOC_PATH];
const DOC_COUNT_RE = /`([A-Za-z]+\.ts)` own (\d+) \/ hats (\d+)/g;
const DOC_FLAG_COUNTS: { file: string; own: number; hats: number }[] = [];
{
  let mDoc: RegExpExecArray | null = null;
  DOC_COUNT_RE.lastIndex = 0;
  while ((mDoc = DOC_COUNT_RE.exec(SEAM_DOC)) !== null) {
    DOC_FLAG_COUNTS.push({ file: mDoc[1], own: Number(mDoc[2]), hats: Number(mDoc[3]) });
  }
}
const DOC_FORK_RE = /\|\s*\*\*(\d+)\*\*\s*\|\s*`([^`]+)`\s*\|\s*`(src\/[^:]+):(\d+)`\s*\|\s*\*\*READ FORK\*\*/g;
const DOC_READ_FORKS: { n: number; text: string; file: string; line: number }[] = [];
{
  let mDoc: RegExpExecArray | null = null;
  DOC_FORK_RE.lastIndex = 0;
  while ((mDoc = DOC_FORK_RE.exec(SEAM_DOC)) !== null) {
    DOC_READ_FORKS.push({ n: Number(mDoc[1]), text: mDoc[2], file: mDoc[3],
      line: Number(mDoc[4]) });
  }
}
/** ⭐⭐⭐ THE SEAM DOC'S **UPDATED** INVENTORY (§SEAM-B), PARSED: the four site rows (the READ
 *  FORK, the PERCEPT PULL and the TWO CODE-MOVE CALLS). ⚠ §SEAM-B's table carries NO line
 *  numbers — the LINES in §SEAM's older table went STALE when DS-T0b code-moved the count
 *  (PlayerBrain 2152 → the measured line; TeamBrain 295/314 → the measured lines). The gate
 *  therefore compares SITE TEXT + FILE + CLASS + COUNT, which is what the updated inventory
 *  pins, and STORES the doc's stale lines beside the measured ones as a declared, ungated
 *  disagreement (§DEVIATIONS). */
const DOC_FORK_B_RE = new RegExp('\\|\\s*\\*\\*(1|1a|1b|1c)\\*\\*\\s*\\|\\s*'
  + '`([^`]+)`\\s*\\|\\s*`([^`:]+)`[^|]*\\|\\s*\\*\\*([A-Z][A-Z\\- ]+)\\*\\*', 'g');
const DOC_SEAM_B_SITES: { site: string; text: string; file: string; cls: string }[] = [];
{
  let mDoc: RegExpExecArray | null = null;
  DOC_FORK_B_RE.lastIndex = 0;
  while ((mDoc = DOC_FORK_B_RE.exec(SEAM_DOC)) !== null) {
    DOC_SEAM_B_SITES.push({ site: mDoc[1], text: mDoc[2], file: mDoc[3], cls: mDoc[4].trim() });
  }
}
const docSite = (k: string) => DOC_SEAM_B_SITES.find((r) => r.site === k) ?? null;
/** the doc's own claim about how many times the PULL occurs in `PlayerBrain.ts` */
const DOC_PULL_COUNT = (() => {
  const m2 = /`match\.perceivedSnapshot` now occurs \*\*(\d+)\*\* times/.exec(SEAM_DOC);
  return m2 === null ? -1 : Number(m2[1]);
})();
const PULL_SITES_IN_BRAIN = codeLinesOf(SRC_OF[BRAIN_PATH]).join('\n')
  .split('match.perceivedSnapshot').length - 1;
/** ⭐⭐⭐ `runnerCount` — the CODE-MOVED count: its span hashed WHOLE, and BOTH call sites hashed
 *  (their own line text, and the enclosing span they sit in). */
const SPAN_RUNNER_COUNT = findSpan(TEAMBRAIN_PATH, 'runnerCount', RUNNER_COUNT_HEAD);
const CALL_SITE_LINES = [
  { what: 'the SHIPPED designation', file: TEAMBRAIN_PATH,
    text: '    const count = runnerCount(team.mode, team.genome.tempo, team.mentality.urgency);' },
  { what: 'the PLAYER\'s own restraint', file: BRAIN_PATH,
    text: '          const restraint = clamp01(1 - runningMates / runnerCount(' },
];
const RUNNER_COUNT_CALL_SITES = CALL_SITE_LINES.map((c) => {
  const hits = occurrences(SRC_OF[c.file], c.text);
  const enc = hits.length === 1 ? enclosingOf(c.file, hits[0].line) : null;
  return {
    what: c.what, file: c.file, occurrences: hits.length,
    line: hits.length === 1 ? hits[0].line : -1,
    lineSha: sha(c.text), enclosingSpan: enc === null ? null : spanKey(enc),
    enclosingSha: enc === null ? null : enc.sha,
  };
});
/** every OTHER `runnerCount(` occurrence in `src/**` — the definition's own head and nothing
 *  else may remain: the count exists ONCE (§SEAM-B). */
const RUNNER_COUNT_OCCURRENCES = SRC_ALL_FILES.map((f) => ({
  file: f,
  calls: (codeLinesOf(readFileSync(f, 'utf8')).join('\n').match(/runnerCount\(/g) ?? []).length,
})).filter((r) => r.calls > 0);
const RUNNER_COUNT_FACTS_OK = SPAN_RUNNER_COUNT !== null
  && RUNNER_COUNT_CALL_SITES.every((r) => r.occurrences === 1 && r.enclosingSpan !== null)
  && RUNNER_COUNT_CALL_SITES[0].enclosingSpan === (SPAN_ASSIGN_RUNNERS === null ? 'x'
    : spanKey(SPAN_ASSIGN_RUNNERS))
  && RUNNER_COUNT_CALL_SITES[1].enclosingSpan === (SPAN_DECIDE_OFFBALL === null ? 'x'
    : spanKey(SPAN_DECIDE_OFFBALL))
  && RUNNER_COUNT_OCCURRENCES.length === 2;
/** ⭐⭐⭐ THE OWN-RUN BLOCK'S `match`-MEMBER SET, extracted from the block's WHOLE TEXT and
 *  compared to the seam doc's own READ SET sentence (§LAW-B 4 / §PINS-B 5), PARSED out of the
 *  markdown. EQUAL or RED. */
const OWN_BLOCK = (() => {
  const lines = SRC_OF[BRAIN_PATH].split('\n');
  const head = lines.indexOf('    if (match.dsOwnRun) {');
  if (head < 0) return null;
  let end = -1;
  for (let j = head + 1; j < lines.length; j++) if (lines[j] === '    }') { end = j; break; }
  if (end < 0) return null;
  const text = lines.slice(head, end + 1).join('\n');
  const members = [...new Set(text.match(/match\.[A-Za-z_$][\w$]*/g) ?? [])].sort();
  return { startLine: head + 1, endLine: end + 1, text, sha: sha(text), members };
})();
const DOC_READ_SET = (() => {
  const flat = SEAM_DOC.replace(/\s+/g, ' ');
  const m2 = /only `match` members named in the block are `(\w+)`, `(\w+)` and `(\w+)`/.exec(flat);
  return m2 === null ? [] : [m2[1], m2[2], m2[3]].map((x) => `match.${x}`).sort();
})();
const BLOCK_MEMBERS_AGREE = OWN_BLOCK !== null && DOC_READ_SET.length === 3
  && JSON.stringify(OWN_BLOCK.members) === JSON.stringify(DOC_READ_SET);
const norm = (a: { file: string; text: string }[]): string => JSON.stringify(
  a.map((x) => `${x.file}||${x.text}`).sort(),
);
const FORK_INVENTORY_AGREES = DOC_READ_FORKS.length === 3 && READ_FORKS.length === 3
  && norm(DOC_READ_FORKS) === norm(READ_FORKS)
  && DOC_SEAM_B_SITES.length === 4
  && docSite('1') !== null && docSite('1')?.cls === 'READ FORK'
  && docSite('1')?.text === 'if (match.dsOwnRun) {'
  && docSite('1')?.file === BRAIN_PATH
  && docSite('1a')?.cls === 'PERCEPT PULL'
  && docSite('1a')?.text === 'match.perceivedSnapshot(p)'
  && docSite('1b')?.cls === 'CODE-MOVE CALL' && docSite('1b')?.file === BRAIN_PATH
  && docSite('1c')?.cls === 'CODE-MOVE CALL' && docSite('1c')?.file === TEAMBRAIN_PATH
  && DOC_PULL_COUNT === PULL_SITES_IN_BRAIN
  && BLOCK_MEMBERS_AGREE && RUNNER_COUNT_FACTS_OK;
/** the doc's STALE line numbers, stored beside the measured ones — DECLARED, NOT GATED */
const FORK_LINES_MEASURED = READ_FORKS.map((r) => `${r.file}:${r.line}`).sort();
const FORK_LINES_IN_DOC = DOC_READ_FORKS.map((r) => `${r.file}:${r.line}`).sort();
const FORK_LINE_NUMBERS_AGREE = JSON.stringify(FORK_LINES_MEASURED)
  === JSON.stringify(FORK_LINES_IN_DOC);
const byFileName = (rows: { file: string; own: number; hats: number }[]) => JSON.stringify(
  [...new Set(rows.map((r) => JSON.stringify([r.file.split('/').pop(), r.own, r.hats])))].sort(),
);
const DOC_FLAG_COUNTS_DEDUPED = [...new Set(DOC_FLAG_COUNTS.map((r) => JSON.stringify(r)))]
  .map((x) => JSON.parse(x) as { file: string; own: number; hats: number });
const FLAG_COUNTS_AGREE = DOC_FLAG_COUNTS_DEDUPED.length === 4
  && byFileName(FLAG_COUNTS) === byFileName(DOC_FLAG_COUNTS_DEDUPED);
const A4_CLEAN_OF_FLAGS = !readFileSync(A4_PATH, 'utf8').includes('dsOwnRun')
  && !readFileSync(A4_PATH, 'utf8').includes('dsHatsOff');
fx('readForks.exactlyThreeInSrc', READ_FORKS.length, 3);
fx('readForks.oneOwnRunTwoHatsOff', [
  READ_FORKS.filter((r) => r.flag === 'dsOwnRun').length,
  READ_FORKS.filter((r) => r.flag === 'dsHatsOff').length,
], [1, 2]);
fx('readForks.theSeamDocInventoryPARSED', DOC_READ_FORKS.length, 3);
fx('readForks.theSeamDocUPDATEDInventoryPARSED', DOC_SEAM_B_SITES.length, 4);
fx('readForks.theSeamDocPerFileCountsPARSEDAndDEDUPED', DOC_FLAG_COUNTS_DEDUPED.length, 4);
fx('readForks.theSameCountsAppearTWICEInTheDoc_seamAndSeamB', DOC_FLAG_COUNTS.length, 8);
fx('readForks.theyAGREEOnFileTextClassAndCount',
  FORK_INVENTORY_AGREES && FLAG_COUNTS_AGREE, true);
fx('readForks.theDOCSLINENUMBERSDoNOTAgree_andThatIsSTOREDNotGATED',
  FORK_LINE_NUMBERS_AGREE, false);
fx('readForks.a4WorldIsCLEAN', A4_CLEAN_OF_FLAGS, true);
fx('block.theMemberSetIsEXACTLYTheDocsReadSet',
  OWN_BLOCK === null ? [] : OWN_BLOCK.members, DOC_READ_SET);
fx('block.theMemberSetIsTHREEMembers', OWN_BLOCK === null ? 0 : OWN_BLOCK.members.length, 3);
fx('block.aTRUTHREADWouldBreakTheSet',
  JSON.stringify([...(OWN_BLOCK === null ? [] : OWN_BLOCK.members), 'match.ball'].sort())
    === JSON.stringify(DOC_READ_SET), false);
fx('runnerCount.bothCallSitesFoundExactlyOnce',
  RUNNER_COUNT_CALL_SITES.map((r) => r.occurrences), [1, 1]);
fx('runnerCount.theTwoCallSitesSitInTheTwoNAMEDFunctions',
  RUNNER_COUNT_CALL_SITES.map((r) => (r.enclosingSpan ?? '').split(':').pop()),
  ['assignRunners', 'decideOffBall']);
fx('runnerCount.itLivesInEXACTLYTWOFilesOfSrc', RUNNER_COUNT_OCCURRENCES.length, 2);

/** ⭐⭐ THE OBM SEAT's own closure — the `runMul` this exam observes comes from here. */
const OBM_ROOTS = SPANS.filter((s) => s.file === EYES_PATH);
const OBM_CLOSURE = closureOf(OBM_ROOTS);
const OBM_HITS = OBM_CLOSURE.nodes.filter((s) => DESIGNATION_NEEDLE_RE.test(s.text))
  .map(spanKey);
const obmSeatReadsNoDesignation = OBM_ROOTS.length > 0 && OBM_HITS.length === 0
  && EVERY_FIELD_NEEDLE_LIVE;
const CODE_FACT_GRAPH_OK = SPAN_RUNNER_COUNT !== null && RUNNER_COUNT_FACTS_OK
  && BLOCK_MEMBERS_AGREE && ROOTS_COMPLETE && EVERY_FIELD_SITE_RESOLVED
  && EVERY_FIELD_NEEDLE_LIVE && MAKERUN_CASE_IN_EXECUTE_ACTION && MAKERUN_PUSHES.length > 0
  && !DESIGNATION_CLOSURE.capped && !OBM_CLOSURE.capped && OBM_ROOTS.length > 0
  && FORK_INVENTORY_AGREES && FLAG_COUNTS_AGREE && A4_CLEAN_OF_FLAGS
  && makeRunCandidatesAllHatGuardedOnShippedPath
  && SPAN_OBM_POLICY !== null;

/* ========================================================================== */
/* §11 THE RECEIPT WALKS — gLockstep, X-DET (twice), the world pin, X-FP-PROD  */
/* ========================================================================== */
banner('DS-T1b — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return { seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);
/** ⭐⭐⭐ gPullCount (#408 item 5(iv)) — THE OBSERVATION ADDS NO PERCEPT PULL. The seam's own pin
 *  B6 idiom (`tests/dsOwnRun.test.ts`), applied WITHOUT touching `src/`: the MATCH INSTANCE's
 *  `perceivedSnapshot` is wrapped on a THROWAWAY match in the lockstep pair — never on a battery
 *  walk — by a counter that DELEGATES to the real bound method. Observed and unobserved must
 *  agree on BOTH the per-match pull count AND the whole-match signature, and the wrapped
 *  observed signature must equal the UNWRAPPED lockstep walk's, which is what proves the
 *  wrapper itself is transparent. The counter must also be able to FIRE (a dead counter proves
 *  nothing): the pass chooser pulls on every arm and the fork pulls on the armed ones. */
const spyPulls = (m: Match): (() => number) => {
  const mAny = m as unknown as { perceivedSnapshot: (q: unknown, scope?: unknown) => unknown };
  const real = mAny.perceivedSnapshot.bind(m);
  let calls = 0;
  mAny.perceivedSnapshot = (q: unknown, scope?: unknown) => {
    calls += 1;
    return real(q, scope ?? null);
  };
  return () => calls;
};
const pullRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const obs = buildMatch(seed, armK);
  const obsCount = spyPulls(obs);
  walkMatch(obs, armK, true);
  const un = buildMatch(seed, armK);
  const unCount = spyPulls(un);
  walkMatch(un, armK, false);
  const plain = lockstepRows.find((r) => r.seed === seed && r.arm === armK);
  const sObs = signatureOf(obs);
  const sUn = signatureOf(un);
  return {
    seed, arm: armK, pullsObserved: obsCount(), pullsUnobserved: unCount(),
    signatureObserved: sObs, signatureUnobserved: sUn,
    signatureUnwrapped: plain === undefined ? '' : plain.observed,
    countsEqual: obsCount() === unCount(), signaturesEqual: sObs === sUn,
    wrapperIsTransparent: plain !== undefined && sObs === plain.observed,
  };
}));
const PULL_COUNTER_LIVE = pullRows.some((r) => r.pullsObserved > 0);
const PULLCOUNT_OK = pullRows.length === LOCKSTEP_SEEDS.length * ARMS.length
  && PULL_COUNTER_LIVE
  && pullRows.every((r) => r.countsEqual && r.signaturesEqual && r.wrapperIsTransparent);
banner(`  gPullCount ${PULLCOUNT_OK ? 'GREEN' : 'RED'} (${pullRows.length} spied pairs; pulls `
  + `${pullRows.map((r) => r.pullsObserved).join('/')})`);
const xDetRows = XDET_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const a = buildMatch(seed, armK); const rowA = walkMatch(a, armK, true);
  const b = buildMatch(seed, armK); const rowB = walkMatch(b, armK, true);
  const strip = (r: Row): string => JSON.stringify({ ...r, wallMs: 0 });
  return {
    seed, arm: armK, sigA: signatureOf(a), sigB: signatureOf(b),
    rowsIdentical: strip(rowA) === strip(rowB),
  };
}));
const XDET_OK = xDetRows.every((r) => r.sigA === r.sigB && r.rowsIdentical);
banner(`  X-DET ${XDET_OK ? 'GREEN' : 'RED'} (${xDetRows.length} twice-walked pairs)`);
const fpLeague = new League({ seed: 1337 });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + 2,
});
const FP_PROD_GOT = sha(JSON.stringify(fpOut.league));
const FP_PROD_OK = FP_PROD_GOT === FP_PROD_PIN;
banner(`  X-FP-PROD ${FP_PROD_OK ? 'GREEN' : 'RED'} (${FP_PROD_GOT.slice(0, 8)}…)`);
const worldPin = ARMS.map((armK) => {
  const m = buildMatch(WORLD_PIN_SEED, armK);
  const mm = m as unknown as MatchView;
  const kind = ARM_KIND[armK];
  return {
    seed: WORLD_PIN_SEED, arm: armK,
    bqArmedVersion: bqArmedVersion(m), lnArmedVersion: lnArmedVersion(m),
    gkArmedVersion: gkArmedVersion(m),
    bqCushion: mm.bqCushion === true,
    lnOwnLanePrice: mm.lnOwnLanePrice === true,
    gkDiveBody: mm.gkDiveBody === true,
    edsPerceivedChoice: mm.edsPerceivedChoice === true,
    dsOwnRun: mm.dsOwnRun === true, dsHatsOff: mm.dsHatsOff === true,
    obmMovement: mm.obmMovement === true,
    dsOwnRunDue: kind !== 'HATS', dsHatsOffDue: kind === 'OWN', obmDue: ARM_DOSED[armK],
    matrixOnBaseEff: matrixOnBaseAndEff(m),
    infoGenomeCleanOfMatrix: infoGenomeCleanOfMatrix(m),
    pcHoldsReadable: mm.pcLatency === null || (mm.pcLatency.holds instanceof Map),
    otherSeamsAbsent: mm.ctbSupportPlane !== true && mm.rcAnticipate !== true
      && mm.rcReady !== true && mm.bfFacingCost !== true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.edsPerceivedChoice && w.otherSeamsAbsent
  && w.bqCushion && w.pcHoldsReadable && w.infoGenomeCleanOfMatrix
  && w.bqArmedVersion === BQ_WORLD_VERSION && w.lnArmedVersion !== LN_WORLD_VERSION
  && w.gkArmedVersion !== GK_WORLD_VERSION && !w.lnOwnLanePrice && !w.gkDiveBody
  && w.dsOwnRun === w.dsOwnRunDue && w.dsHatsOff === w.dsHatsOffDue
  && w.obmMovement === w.obmDue && w.matrixOnBaseEff === w.obmDue);
banner(`  world pin ${WORLD_PIN_OK ? 'GREEN' : 'RED'} (${worldPin.length} arms)`);

/* ========================================================================== */
/* §12 THE BATTERY — the NINE arms PAIRED on every seed                        */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`DS-T1b — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const armK of ARMS) rows[armK] = walkMatch(buildMatch(seed, armK), armK, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `×${ARMS.length} arms (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const armK of ARMS) {
  receiptRows[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
}
const walksBooked = (cells.length + 1) * ARMS.length;
const armRows = (armK: Arm): Row[] => cells.map((c) => c.rows[armK]);
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const tot = (armK: Arm, pick: (r: Row) => number): number =>
  armRows(armK).reduce((a, r) => a + pick(r), 0);

/* ========================================================================== */
/* §12b G-REPRO-DSC0 — RE-WALK DS-C0's OWN BAND ON HATS-E13-ABSENT             */
/* ========================================================================== */
const reproDetail = (() => {
  if (!existsSync(DST1_ARTIFACT)) {
    return { ran: false, ok: false, seeds: REPRO_SEEDS, comparedFields: [] as string[],
      rows: [] as { seed: number; mismatches: string[];
        delta: Record<string, [unknown, unknown]> }[],
      dsT1Quoted: null as unknown,
      note: `the DS-T1 artifact is absent at ${DST1_ARTIFACT}` };
  }
  const raw = JSON.parse(readFileSync(DST1_ARTIFACT, 'utf8')) as {
    perSeedCells: (Record<string, unknown> & { seed: number })[];
    deltas: { face: string; arm: string; delta: number; ciLo: number; ciHi: number;
      halfWidth: number; controlValue: number; armValue: number;
      absDeltaOverHalfWidth: number }[];
    r1: { levels: Record<string, unknown> };
    reads: { selected: string; sentence: string };
    guards: { table: Record<string, { id: string; key: string; breach: boolean }[]> };
    faceBlocks: { yieldPairs: Record<string, unknown>; perState: Record<string, unknown> };
    stage: { instrumentSha256: string };
  };
  const ARM_KEY = 'HATS-E13-ABSENT';
  const bySeed = new Map(raw.perSeedCells
    .filter((c) => REPRO_SEEDS.includes(c.seed))
    .map((c) => [c.seed, JSON.parse(JSON.stringify(c[ARM_KEY])) as Record<string, unknown>]));
  /** ⭐⭐⭐ H-DS-3 / H-DS-4's DS-T1 numbers, QUOTED **BY FIELD** out of DS-T1's own artifact —
   *  never typed in this instrument (canon: doc-prose fidelity, applied to an instrument). */
  const pickDelta = (faceKey: string, armKey: string) => {
    const d = raw.deltas.find((x) => x.face === faceKey && x.arm === armKey);
    return d === undefined ? null : {
      face: faceKey, arm: armKey, delta: d.delta, ci: [d.ciLo, d.ciHi],
      halfWidth: d.halfWidth, controlValue: d.controlValue, armValue: d.armValue,
      absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    };
  };
  const dsT1Quoted = {
    source: DST1_ARTIFACT,
    instrumentSha256: raw.stage.instrumentSha256,
    r1DeltaOwnAbsent: pickDelta('r1.runsPerInPossessionTick', 'OWN-E13-ABSENT'),
    g9DeltaOwnAbsent: pickDelta('guard.throughBallsPerMatch', 'OWN-E13-ABSENT'),
    r1DeltaOwnDosedMarkerEscape: pickDelta('r1.runsPerInPossessionTick', 'OWN-E13-DOSED'),
    r1LevelOwnAbsent: raw.r1.levels['OWN-E13-ABSENT'] ?? null,
    r1LevelHatsAbsent: raw.r1.levels['HATS-E13-ABSENT'] ?? null,
    breachedGuardsOwnAbsent: (raw.guards.table['OWN-E13-ABSENT'] ?? [])
      .filter((g) => g.breach).map((g) => `${g.id} ${g.key}`),
    yieldPairOwnAbsent: raw.faceBlocks.yieldPairs['OWN-E13-ABSENT'] ?? null,
    perStateOwnAbsent: raw.faceBlocks.perState['OWN-E13-ABSENT'] ?? null,
    readOfRecord: { word: raw.reads.selected, sentence: raw.reads.sentence },
  };
  const first = bySeed.get(REPRO_SEEDS[0]);
  const mineKeys = Object.keys(emptyRow());
  const fields = first === undefined ? [] : mineKeys.filter((k) => k !== 'wallMs'
    && Object.prototype.hasOwnProperty.call(first, k));
  const rows = REPRO_SEEDS.map((seed) => {
    const theirs = bySeed.get(seed);
    if (theirs === undefined) {
      return { seed, mismatches: ['ABSENT FROM DS-T1'],
        delta: {} as Record<string, [unknown, unknown]> };
    }
    const mine = walkMatch(buildMatch(seed, ARM_KEY), ARM_KEY, true) as
      unknown as Record<string, unknown>;
    const bad = fields.filter(
      (k) => JSON.stringify(mine[k]) !== JSON.stringify(theirs[k]),
    );
    const delta: Record<string, [unknown, unknown]> = {};
    for (const k of bad) delta[k] = [mine[k], theirs[k]];
    return { seed, mismatches: bad, delta };
  });
  return {
    ran: true,
    ok: fields.length > 0 && rows.every((r) => r.mismatches.length === 0),
    seeds: REPRO_SEEDS, comparedFields: fields, rows, dsT1Quoted,
    note: '⭐⭐⭐ G-REPRO-DST1: `HATS-E13-ABSENT` re-walked on DS-T1\'s OWN CONSUMED BAND '
      + '(12,554,000–011 — NOT a consumption) and compared FIELD FOR FIELD against DS-T1\'s '
      + 'stored `perSeedCells[].[HATS-E13-ABSENT]`. This is THE SEAM\'S OFF PATH: with both DS '
      + 'flags absent DS-T0b is byte-identical to DS-T0\'s head by its own G-OFF pins (five '
      + 'worlds, world 13 included, the rng draw inside the hash), so EVERY field DS-T1 stored '
      + 'must reproduce — the whole-match signature included. A MISMATCH IS RED. Only `wallMs` '
      + '(a machine timing) is excluded; the new DS-T1b fields have no counterpart in DS-T1\'s '
      + 'row and are not compared.',
  };
})();
const REPRO_OK = reproDetail.ok;
banner(`  G-REPRO-DST1 ${REPRO_OK ? 'GREEN' : 'RED'} `
  + `(${reproDetail.comparedFields.length} fields × ${reproDetail.rows.length} seeds)`);

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef {
  unit: string; what: string; den: string; num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };
const ONE = (): number => 1;

/* ---- ⭐⭐⭐ R1 — THE FLOOD FACE (#406 item 5(ii)) ---- */
defFace('r1.runsPerInPossessionTick', 'executed runs per in-possession open-play team-tick',
  '⭐⭐⭐ R1 — THE FLOOD FACE. Per team, per STEPPED tick, in OPEN PLAY (possession is his side · '
  + '`match.phase === \'playing\'` · his side carries NO live `cornerCrash` and NO live '
  + '`crossFlight`, both read off the engine\'s own held-licence clocks at the end of the tick), '
  + 'the count of OUTFIELD BODIES whose `p.action.type` is `MakeRun` — THE BODIES, not the board',
  'in-possession open-play team-ticks', (r) => r.r1RunnerSum, (r) => r.r1TeamTicks);
for (let k = 0; k < R1_BINS; k++) {
  defFace(`r1.binShare.${k === R1_BINS - 1 ? `${k}plus` : k}`, 'share',
    `the share of in-possession open-play team-ticks with ${k}${k === R1_BINS - 1 ? '+' : ''} `
    + 'bodies executing a run', 'in-possession open-play team-ticks',
    (r) => r.r1Bins[k], (r) => r.r1TeamTicks);
}
defFace('r1.floodShareAtLeastThree', 'share',
  `⭐⭐ the share of in-possession open-play team-ticks with ${R1_FLOOD_AT} OR MORE bodies `
  + 'executing a run', 'in-possession open-play team-ticks',
  (r) => r.r1FloodTicks, (r) => r.r1TeamTicks);
defFace('r1.teamTicksPerMatch', 'in-possession open-play team-ticks per match',
  'R1\'s OWN DENOMINATOR, per match (the two-fractions companion)', 'matches',
  (r) => r.r1TeamTicks, ONE);
defFace('r1.runnerTicksPerMatch', 'executed-run body-ticks per match',
  'R1\'s OWN NUMERATOR, per match (the two-fractions companion)', 'matches',
  (r) => r.r1RunnerSum, ONE);
for (const rr of ROLES4) {
  defFace(`runsByRole.share.${rr}`, 'share',
    `⭐⭐ RUNS BY ROLE — the ${rr} share of EXECUTED runs (the player-side prior's role bias `
    + 'against the coach\'s)', 'executed-run body-ticks',
    (r) => r.r1RunnersByRole[RI(rr)], (r) => sum(r.r1RunnersByRole));
}

/* ---- ⭐⭐⭐ THE BAND — THE GUARDS (F-DS-b, #406 item 5(iii)) ---- */
defFace('guard.goalsPerMatch', 'goals per match',
  'G1 — both sides, the 240 s clock (BOTH directions harmful)', 'matches', (r) => r.goals, ONE);
defFace('guard.shotsPerMatch', 'shots per match', 'G2 — both sides (BOTH)', 'matches',
  (r) => r.shots, ONE);
defFace('guard.xgConversion', 'goals per unit xG',
  'G3 — goals ÷ Σ`xg` off the engine\'s own `shotLog` (BOTH)', 'summed shotLog xg',
  (r) => r.goals, (r) => r.xgSum);
defFace('guard.passCompletion', 'share',
  'G4 — the engine\'s own completion over ALL deliveries (a FLOOR; DOWN is harmful)',
  'engine passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('guard.interceptionsPerMatch', 'interceptions per match',
  'G5 — both sides (a CEILING; UP is harmful)', 'matches', (r) => r.interceptions, ONE);
defFace('guard.possessionShareSideA', 'share',
  'G6 — side A\'s share of the engine\'s own `possessionTime` (BOTH). ⚠ The two sides\' shares '
  + 'sum to 1 by construction, so ONE of them is the whole face', 'summed possession time',
  (r) => r.possessionTimeOwn[0], (r) => r.possessionTimeOwn[0] + r.possessionTimeOwn[1]);
defFace('guard.passesPerMatch', 'passes per match',
  'G7 — the engine\'s own `passes`, both sides (BOTH)', 'matches', (r) => r.passes, ONE);
defFace('guard.meanAimDistanceMetres', 'metres',
  'G8 — MEAN PASS DISTANCE: the passer→target straight-line distance at the tick a NEW '
  + '`pendingPass` appears (BOTH). ⚠ A DECLARED RECONSTRUCTION — the engine keeps no pass-length '
  + 'ledger, and the positions are read at the END of the tick the aim was written; §DEVIATIONS',
  'registered aims', (r) => r.aimDistSum, (r) => r.aimDistCount);
defFace('guard.throughBallsPerMatch', 'through balls per match',
  'G9 — the ENGINE\'S OWN `stats.throughBalls`, both sides (BOTH). ⚠ Its write site is '
  + '`performThroughBall` (mechanics.ts), NOT `registerPass`; §DEVIATIONS', 'matches',
  (r) => r.throughBallsStat, ONE);
defFace('guard.offsidesPerMatch', 'offsides per match',
  'G10 — the engine\'s own offside counter, both sides, in the #157 FLAG form: a RESOLVED '
  + 'INCREASE raises a flag and gates NOTHING', 'matches', (r) => r.offsides, ONE);

/* ---- POPULATION A — the board (DS-C0's, re-walked) ---- */
defFace('coach.ticksPerMatch', 'coach ticks per match',
  'both teams, every `updateTeamBrain` execution (the 0.4 s cadence)', 'matches',
  (r) => r.coachTicks, ONE);
defFace('coach.inPossessionShare', 'share',
  'coach ticks whose team WAS the possession side', 'coach ticks',
  (r) => r.coachTicksInPossession, (r) => r.coachTicks);
defFace('coach.inPossessionTicksPerMatch', 'in-possession coach ticks per match',
  'the denominator of POPULATION A', 'matches', (r) => r.coachTicksInPossession, ONE);
for (const b of BRANCHES) {
  defFace(`branch.share.${b}`, 'share',
    `the share of in-possession coach ticks whose WRITING BRANCH is ${b}`,
    'in-possession coach ticks', (r) => r.branchTicks[BRI(b)], (r) => r.coachTicksInPossession);
  defFace(`branch.arriverSetShare.${b}`, 'share',
    `P(an ARRIVER is designated | branch ${b})`, `${b} coach ticks`,
    (r) => r.arriverSetByBranch[BRI(b)], (r) => r.branchTicks[BRI(b)]);
  defFace(`branch.overlapperSetShare.${b}`, 'share',
    `P(an OVERLAPPER is designated | branch ${b})`, `${b} coach ticks`,
    (r) => r.overlapperSetByBranch[BRI(b)], (r) => r.branchTicks[BRI(b)]);
}
for (let k = 0; k < RUN_COUNT_BINS; k++) {
  defFace(`runCount.binShare.${k === RUN_COUNT_BINS - 1 ? `${k}plus` : k}`, 'share',
    `the share of in-possession coach ticks with ${k}${k === RUN_COUNT_BINS - 1 ? '+' : ''} `
    + 'DESIGNATED runners (THE BOARD, not the bodies)', 'in-possession coach ticks',
    (r) => r.runCountBins[k], (r) => r.coachTicksInPossession);
}
defFace('runCount.mean', 'designated runners per in-possession coach tick',
  '⭐⭐ THE BOARD — designated runners per coach tick in possession', 'in-possession coach ticks',
  (r) => r.runnerCountSum, (r) => r.coachTicksInPossession);
defFace('runCount.designationsPerMatch', 'runner designations per match',
  'the numerator above, per match', 'matches', (r) => r.runnerDesignations, ONE);
defFace('board.openPlayEmptyShare', 'share',
  '⭐⭐⭐ THE OPEN-PLAY BOARD EMPTY — in-possession OPEN-PLAY coach ticks at which `team.runners` '
  + 'is empty AND `team.arriver` is null. On the OWN arms this is 1 BY CONSTRUCTION, and the '
  + 'read prints a STORED BOOLEAN, never a claim', 'open-play in-possession coach ticks',
  (r) => r.openPlayBoardEmptyTicks, (r) => r.openPlayCoachTicks);
defFace('board.openPlayCoachTicksPerMatch', 'open-play in-possession coach ticks per match',
  'the denominator above, per match', 'matches', (r) => r.openPlayCoachTicks, ONE);
for (const rr of ROLES4) {
  defFace(`runnersByRole.share.${rr}`, 'share',
    `the ${rr} share of DESIGNATED runners (the coach's own role bias)`,
    'runner designations', (r) => r.runnersByRole[RI(rr)], (r) => r.runnerDesignations);
}
defFace('overlap.geneGatePassRate', 'share',
  'THE 套边 GATE — `attackingWidth · overlapW > 0.3` (EXTRACTED) at the coach tick',
  'in-possession coach ticks', (r) => r.overlapGeneGatePass, (r) => r.coachTicksInPossession);
defFace('overlap.confrontedShareAmongGatePassing', 'share',
  'the `confronted` share among the ticks that reach the test', 'gate-passing coach ticks',
  (r) => r.overlapConfronted, (r) => r.overlapPreconditionTicks);

/* ---- POPULATION B — the decision ticks (THE POST-STEP FORM OF RECORD) ---- */
defFace('offBall.decisionTicksPerMatch', 'off-ball decision ticks per match',
  '⭐⭐ THE FORM OF RECORD (DEBT (a)): own side in possession · not the carrier · not the keeper '
  + '· a decision taken this tick, with the latency holds read AFTER the step',
  'matches', (r) => r.offBallDecisionTicksPost, ONE);
defFace('offBall.decisionTicksPerMatchPreStepForm', 'off-ball decision ticks per match',
  '⚠ DS-C0\'s OWN PRE-STEP FORM, recomputed beside — the calibration receipt\'s left half',
  'matches', (r) => r.offBallDecisionTicks, ONE);
for (const a of ACTION_CELLS) {
  defFace(`offBall.actionShare.${a}`, 'share',
    `the share of attacking off-ball decision ticks whose CHOSEN action is ${a}`,
    'off-ball decision ticks', (r) => r.offBallActionTicksPost[AI(a)],
    (r) => r.offBallDecisionTicksPost);
}
defFace('offBall.makeRunShare', 'share',
  '⭐⭐ THE `MakeRun` SHARE of attacking off-ball decision ticks (the post-step form)',
  'off-ball decision ticks', (r) => r.makeRunTicksPost, (r) => r.offBallDecisionTicksPost);
for (const c of RUN_CLASSES) {
  defFace(`runClass.shareOfMakeRun.${c}`, 'share',
    `⭐ the ${c} share of ALL attacking \`MakeRun\` decisions (off-ball bodies AND the keeper)`,
    'attacking `MakeRun` decisions',
    (r) => r.runClassTicks[RCI(c)] + r.keeperRunClassTicks[RCI(c)],
    (r) => sum(r.runClassTicks) + sum(r.keeperRunClassTicks));
  defFace(`runClass.perMatch.${c}`, `${c} MakeRun decisions per match`,
    `the ${c} count itself, per match`, 'matches',
    (r) => r.runClassTicks[RCI(c)] + r.keeperRunClassTicks[RCI(c)], ONE);
}
defFace('hatted.shareOfAttackingOutfield', 'share',
  'bodies carrying ANY hat (runner · arriver · overlapper · a live wallRun) over attacking '
  + 'outfield bodies, per stepped tick', 'attacking outfield body-ticks',
  (r) => r.attackingHatted, (r) => r.attackingOutfield);
defFace('hatted.attackingOutfieldBodyTicksPerMatch', 'attacking outfield body-ticks per match',
  'the denominator above, per match', 'matches', (r) => r.attackingOutfield, ONE);
/* ⭐⭐⭐ DEBT (a)'s CALIBRATION RECEIPT, published as faces */
defFace('calib.heldBodyTicksPostPerMatch', 'held body-ticks per match',
  '⭐⭐⭐ DEBT (a): bodies with `decisionTimer <= 0` whose hold is LIVE at the decide-loop tick, '
  + 'read AFTER the step — the form of record', 'matches', (r) => r.heldBodyTicksPost, ONE);
defFace('calib.heldBodyTicksPrePerMatch', 'held body-ticks per match',
  '⚠ DS-C0\'s PRE-STEP form of the same count', 'matches', (r) => r.heldBodyTicksPre, ONE);
defFace('calib.ledgerDecisionsHeldPerMatch', 'held decisions per match',
  '⭐⭐⭐ THE ENGINE\'S OWN LEDGER — `pcLatency.ledger.decisionsHeld`\'s per-tick delta summed '
  + 'over the match. canon: engine ledgers before heuristics', 'matches',
  (r) => r.ledgerDecisionsHeld, ONE);
defFace('calib.postStepOverLedger', 'ratio',
  '⭐⭐⭐ THE RECEIPT: the POST-STEP reconstruction over the ENGINE\'S OWN ledger. 1 means the '
  + 'predicate of record reproduces the engine exactly', 'ledger-held decisions',
  (r) => r.heldBodyTicksPost, (r) => r.ledgerDecisionsHeld);
defFace('calib.preStepOverLedger', 'ratio',
  '⚠ the SAME ratio for DS-C0\'s PRE-STEP form — the size of the debt that was owed',
  'ledger-held decisions', (r) => r.heldBodyTicksPre, (r) => r.ledgerDecisionsHeld);
defFace('calib.decidedBodyTicksPostPerMatch', 'deciding body-ticks per match',
  'every body (keeper and carrier included) that DECIDED this tick, post-step form',
  'matches', (r) => r.decidedBodyTicksPost, ONE);
defFace('calib.decidedBodyTicksPrePerMatch', 'deciding body-ticks per match',
  '⚠ the same count in DS-C0\'s PRE-STEP form', 'matches', (r) => r.decidedBodyTicksPre, ONE);

/* ---- POPULATION C — THE YIELD PER RUN EPISODE ---- */
for (const c of EP_CLASSES) {
  defFace(`ep.setsPerMatch.${c}`, `${c} episodes per match`,
    `HAT EPISODES of class ${c} — one designation from its SET tick to its CLEAR tick`,
    'matches', (r) => r.epSets[ECI(c)], ONE);
  defFace(`ep.meanTicks.${c}`, 'ticks per episode', `the mean length of a ${c} episode`,
    `${c} episodes`, (r) => r.epTicks[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.passAimedPerEpisode.${c}`, 'passes aimed per episode',
    `passes AIMED at him inside a ${c} episode or within the ${YIELD_WINDOW_SECONDS} s window `
    + 'after its clear', `${c} episodes`, (r) => r.epPassAimed[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.passCompletedPerEpisode.${c}`, 'completions per episode',
    'passes COMPLETED to him in the same window', `${c} episodes`,
    (r) => r.epPassCompleted[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.throughShare.${c}`, 'share',
    'the engine\'s own `lastPassKind === \'through\'` on passes aimed in the window',
    `${c} passes aimed`, (r) => r.epPassThrough[ECI(c)], (r) => r.epPassAimed[ECI(c)]);
  defFace(`ep.shotsPerEpisode.${c}`, 'shots per episode',
    'shots BY HIM (`shotLog` joined to `pendingShot.shooterGid` at the push) in the window',
    `${c} episodes`, (r) => r.epShots[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.goalsPerEpisode.${c}`, 'goals per episode',
    '⭐⭐⭐ DEBT (b) PAID — goals BY HIM, joined through the shooter gid RECORDED AT THE PUSH',
    `${c} episodes`, (r) => r.epGoalsFixed[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.goalsPerEpisodeDsC0Form.${c}`, 'goals per episode',
    '⚠ DS-C0\'s OWN join (`pendingShot` re-read at the OUTCOME FLIP) — published beside as the '
    + 'measured size of the VOID the debt closed', `${c} episodes`,
    (r) => r.epGoals[ECI(c)], (r) => r.epSets[ECI(c)]);
  defFace(`ep.activeAtFullTime.${c}`, `${c} episodes open at full time`,
    '⭐⭐ DEBT (c): episodes STILL ACTIVE when the whistle goes — never binned, COUNTED',
    'matches', (r) => r.epActiveAtFullTime[ECI(c)], ONE);
}
defFace('own.episodesPerMatch', 'own-run episodes per match',
  '⭐⭐⭐ AN OWN-RUN EPISODE — one body\'s CONSECUTIVE `MakeRun` ticks whose winning `why` is the '
  + 'seventh literal, read off the engine\'s own decision record', 'matches',
  (r) => r.ownEpSets, ONE);
defFace('own.meanTicksPerEpisode', 'ticks per episode', 'the mean length of an own-run episode',
  'own-run episodes', (r) => r.ownEpTicks, (r) => r.ownEpSets);
defFace('own.passAimedPerEpisode', 'passes aimed per episode',
  `passes AIMED at him inside the episode or within ${YIELD_WINDOW_SECONDS} s of its clear`,
  'own-run episodes', (r) => r.ownEpPassAimed, (r) => r.ownEpSets);
defFace('own.passCompletedPerEpisode', 'completions per episode',
  'passes COMPLETED to him in the same window', 'own-run episodes',
  (r) => r.ownEpPassCompleted, (r) => r.ownEpSets);
defFace('own.throughShare', 'share',
  'the engine\'s own through classification on passes aimed in the window',
  'own-run passes aimed', (r) => r.ownEpPassThrough, (r) => r.ownEpPassAimed);
defFace('own.shotsPerEpisode', 'shots per episode',
  '⭐⭐ SHOTS BY HIM in the window — the left half of the yield pair', 'own-run episodes',
  (r) => r.ownEpShots, (r) => r.ownEpSets);
defFace('own.goalsPerEpisode', 'goals per episode',
  '⭐⭐ GOALS BY HIM in the window, joined through the shooter gid recorded AT THE PUSH',
  'own-run episodes', (r) => r.ownEpGoals, (r) => r.ownEpSets);
defFace('own.shotsPerMatch', 'own-run-episode shots per match',
  'the numerator above, per match (the two-fractions companion)', 'matches',
  (r) => r.ownEpShots, ONE);
defFace('own.episodesActiveAtFullTime', 'own-run episodes open at full time',
  '⭐⭐ DEBT (c): own-run episodes STILL ACTIVE at the whistle — COUNTED, never binned',
  'matches', (r) => r.ownEpActiveAtFullTime, ONE);
defFace('own.goalRowJoinShare', 'share',
  '⭐ A RECEIPT: goal rows whose shooter was recoverable from the gid BANKED AT THE PUSH',
  'goal rows', (r) => r.goalRowsJoinedAtThePush,
  (r) => r.goalRowsJoinedAtThePush + r.goalRowsUnjoinable);

/* ---- RUNS AND YIELD PER STATE ---- */
for (const k of RUNKINDS) {
  for (const st of STATES) {
    defFace(`state.runsPerMatch.${k}.${st}`, `${k} runs per match`,
      `⭐⭐ RUNS PER STATE — ${k} runs won at a decision tick classified ${st}`, 'matches',
      (r) => r.stateRunDecisions[RKI(k) * STATES.length + SI(st)], ONE);
    defFace(`state.runShare.${k}.${st}`, 'share',
      `the ${st} share of all ${k} runs`, `${k} runs`,
      (r) => r.stateRunDecisions[RKI(k) * STATES.length + SI(st)],
      (r) => STATES.reduce(
        (a, s2) => a + r.stateRunDecisions[RKI(k) * STATES.length + SI(s2)], 0));
    defFace(`state.aimedPerRun.${k}.${st}`, 'passes aimed per run',
      `⭐ THE YIELD PER STATE — passes aimed at him within ${YIELD_WINDOW_SECONDS} s of a ${k} `
      + `run won at a ${st} tick`, `${k} runs at ${st}`,
      (r) => r.stateAimed[RKI(k) * STATES.length + SI(st)],
      (r) => r.stateRunDecisions[RKI(k) * STATES.length + SI(st)]);
    defFace(`state.shotsPerRun.${k}.${st}`, 'shots per run',
      `shots BY HIM within the same window`, `${k} runs at ${st}`,
      (r) => r.stateShots[RKI(k) * STATES.length + SI(st)],
      (r) => r.stateRunDecisions[RKI(k) * STATES.length + SI(st)]);
  }
}
for (const st of STATES) {
  defFace(`state.decisionShare.${st}`, 'share',
    `the ${st} share of ALL attacking off-ball decision ticks — the STATE MIX itself`,
    'off-ball decision ticks', (r) => r.stateAllDecisions[SI(st)],
    (r) => r.offBallDecisionTicksPost);
}

/* ---- ⭐⭐ THE COUPLING FACES (#406 item 3(i)) — DS-C0's definitions ---- */
defFace('coupling.overlapSetsPerMatch', 'overlap designations per match',
  '⭐⭐ THE COUPLING — `team.overlapper` transitions to a NEW body. ⛔ NO VERDICT WORD',
  'matches', (r) => r.overlapSets, ONE);
defFace('coupling.overlapPlayedToPerSet', 'overlap arrivals per overlap designation',
  '⭐⭐ THE BALL ACTUALLY PLAYED TO THE OVERLAPPER — the engine\'s OWN `stats.overlaps`, over '
  + 'the sets. ⛔ NO VERDICT WORD', 'overlap designations',
  (r) => r.overlapArrivedStat, (r) => r.overlapSets);
defFace('coupling.overlapReleaseFiresPerSet',
  'release-firing carrier ticks per overlap designation',
  'the developed-overlap release branch firing (EXACT: all three conjuncts are public), over '
  + 'the sets. ⚠ NOT a share — one designation can be read on many carrier ticks',
  'overlap designations', (r) => r.overlapReleaseFires, (r) => r.overlapSets);
defFace('coupling.wallFireRatePerEligiblePass', 'share',
  '⭐⭐ THE 2过1 TRIGGER\'S FIRE RATE, read off `passer.wallRun`\'s OWN transition. ⛔ NO VERDICT '
  + 'WORD', 'eligible passes', (r) => r.wallFires, (r) => r.wallEligiblePasses);
defFace('coupling.wallFiresPerMatch', 'wall-pass licences per match',
  'the numerator above, per match', 'matches', (r) => r.wallFires, ONE);
defFace('coupling.wallEligiblePassesPerMatch', 'eligible passes per match',
  'a REGISTERED GROUND pass by an OUTFIELD passer — the trigger\'s own denominator', 'matches',
  (r) => r.wallEligiblePasses, ONE);
defFace('coupling.wallReturnShareOfFires', 'share',
  '⭐⭐ THE RETURN PLAYED TO THE BURSTER — the engine\'s OWN `stats.oneTwos`, over the triggers. '
  + '⛔ NO VERDICT WORD', 'wall-pass licences', (r) => r.wallOneTwosStat, (r) => r.wallFires);
defFace('coupling.wallReturnsPerMatch', 'one-twos per match',
  'the engine\'s own `stats.oneTwos`, both sides', 'matches', (r) => r.wallOneTwosStat, ONE);
defFace('coupling.arriverSetsPerMatch', 'arriver designations per match',
  '`team.arriver` transitions to a NEW body', 'matches', (r) => r.arriverSets, ONE);
defFace('coupling.cutbackTakenPerMatch', 'cutbacks taken per match',
  'the arriver cutback WON on the carrier\'s own decision record', 'matches',
  (r) => r.cutbackTaken, ONE);
defFace('coupling.wallReconAgreesShare', 'share',
  '⭐ A RECEIPT: the wall reconstruction agrees with the ENGINE\'s own fire', 'eligible passes',
  (r) => r.wallReconAgrees, (r) => r.wallEligiblePasses);

/* ---- ⭐⭐ THE CROWDING FAMILY, copied BY ANCHOR from LN-T1 / OBM-T1 ---- */
defFace('crowd.crashShare', 'share',
  '⭐⭐ 撞车 — PT-C0\'s own limb, byte for byte: the share of sampled open-play ticks whose '
  + `MINIMUM PAIRWISE outfield distance on the possession side is below DUP_RUN_M = ${DUP_RUN_M} `
  + 'm. ⚠ THE ATTRIBUTION DIFFERS from LN-T1\'s (`ball.owner`\'s side, else '
  + '`match.possessionSide`; LN-T1 attributed a loose ball through its own ground-pass flight '
  + 'tracker, which this exam does not build) — §DEVIATIONS',
  'sampled open-play ticks with an attributable possession side',
  (r) => r.crashHits, (r) => r.crowdSamples);
defFace('crowd.sampledTicksPerMatch', 'sampled open-play ticks per match',
  'the sample cadence\'s own denominator, per match', 'matches', (r) => r.crowdSampleTicks, ONE);
defFace('guard.spacingUnder4', 'mean per-match share',
  `⭐ OBM-T1's own \`spacingUnder4\` fold — the share of the match's subsampled same-side `
  + `outfield PAIRS closer than CLOSE_PAIR_M = ${CLOSE_PAIR_M} m, meaned over matches. ⚠ A PAIR `
  + 'share per match, NOT a per-tick share: a different unit from 撞车, never added to it',
  'matches with at least one sampled pair', (r) => r.guardU4Sum, (r) => r.guardU4N);
defFace('guard.spacingUnder4Pooled', 'share',
  'the same quantity POOLED over pairs (a denominator-stable companion)',
  'subsampled same-side outfield pairs', (r) => r.guardPairsUnder4, (r) => r.guardPairsTotal);

/* ---- ⭐⭐ THE SEAT'S `runMul` DISTRIBUTION — on EVERY arm; the seat-ABSENT arms are the
   BACK-OUT'S OWN NOISE FLOOR (`obmRunMul` is EXACTLY 1 there by construction) ---- */
defFace('runMul.mean', 'multiplier',
  `⭐⭐ THE EYES' OWN PRICE ON A RUN, backed out of the engine's decision record. The seat's `
  + `span is DERIVED (\`OBM_SCORE_SPAN = 1 − OFFBALL_TIRED_MUL\`), so the multiplier lives in `
  + `[${RUNMUL_LO}, ${RUNMUL_HI}]`, 'backed-out observations',
  (r) => r.runMulSum, (r) => r.runMulCount);
defFace('runMul.belowOneShare', 'share',
  '⭐⭐ HOW OFTEN THE EYES PRICE A RUN **DOWN**', 'backed-out observations',
  (r) => r.runMulBelowOne, (r) => r.runMulCount);
defFace('runMul.aboveOneShare', 'share',
  '⭐⭐ HOW OFTEN THE EYES PRICE A RUN **UP**', 'backed-out observations',
  (r) => r.runMulAboveOne, (r) => r.runMulCount);
defFace('runMul.atOneShare', 'share', 'the seat priced the run at exactly 1',
  'backed-out observations', (r) => r.runMulAtOne, (r) => r.runMulCount);
defFace('runMul.observationsPerMatch', 'backed-out observations per match',
  'the denominator above, per match. ⚠ Only a run candidate that reached the record\'s TOP FOUR '
  + 'is readable', 'matches', (r) => r.runMulCount, ONE);
defFace('runMul.fromOwnRunShare', 'share',
  'the share of observations backed out of the OWN-RUN candidate (the rest come from the '
  + 'LICENSED run)', 'backed-out observations', (r) => r.runMulFromOwn, (r) => r.runMulCount);
for (let k = 0; k < RUNMUL_BINS; k++) {
  defFace(`runMul.binShare.${k}`, 'share',
    `the share of observations in cell ${k} of the frozen [${RUNMUL_LO}, ${RUNMUL_HI}] range`,
    'backed-out observations', (r) => r.runMulBinsArr[k], (r) => r.runMulCount);
}
/* ---- ⭐⭐⭐ DS-T1b — THE SEAM'S NEW FACES (#408 item 5(ii)) ---- */
defFace('seam.ownCandidateVisibleSharePerUnhattedTick', 'share',
  '⭐⭐⭐ THE PERCEIVED-OWNER GUARD\'S PASS SHARE, AS A FLOOR: attacking off-ball decision ticks '
  + 'whose engine record CARRIES the own-run candidate, over the ticks at which the block\'s '
  + 'not-hatted guard passes (the POST-STEP reconstruction). ⚠ A FLOOR, not the guard\'s true '
  + 'pass rate: the record stores only the TOP FOUR candidates, so a pushed candidate that lost '
  + 'badly is invisible, and the numerator folds TWO conjuncts of the law — a non-null snapshot '
  + '(eyes) AND a perceived owner who is a mate. ⛔ NO VERDICT WORD',
  'unhatted attacking off-ball decision ticks',
  (r) => r.ownCandidateVisible, (r) => r.unhattedOffBallTicksPost);
defFace('seam.ownCandidateVisibleSharePreStepGuardForm', 'share',
  '⚠ the SAME numerator over the PRE-STEP form of the not-hatted guard — the second form, '
  + 'published beside (§DEVIATIONS)', 'unhatted attacking off-ball decision ticks (pre-step)',
  (r) => r.ownCandidateVisible, (r) => r.unhattedOffBallTicksPre);
defFace('seam.unhattedTicksPerMatch', 'unhatted attacking off-ball decision ticks per match',
  'the denominator above, per match (the two-fractions companion)', 'matches',
  (r) => r.unhattedOffBallTicksPost, ONE);
defFace('seam.ownCandidatesPerMatch', 'visible own-run candidates per match',
  'the numerator above, per match', 'matches', (r) => r.ownCandidateVisible, ONE);
defFace('seam.ownCandidateOutsidePostGuardShare', 'share',
  '⭐ A SELF-DIAGNOSING RECEIPT: visible own-run candidates whose tick FAILS the post-step '
  + 'not-hatted reconstruction. The engine pushed the candidate, so its own guard passed at the '
  + 'decide moment; anything here is reconstruction slack, not a law violation',
  'visible own-run candidates',
  (r) => r.ownCandidateOutsidePostGuard, (r) => r.ownCandidateVisible);
defFace('restraint.mean', 'restraint (a multiplier in [0, 1])',
  '⭐⭐⭐ THE RESTRAINT THE PLAYER PUT ON HIMSELF, BACKED OUT of the engine\'s own decision '
  + 'record on the arms where `obmRunMul` is EXACTLY 1 by construction (seat ABSENT). On a DOSED '
  + 'arm this face has a ZERO denominator BY CONSTRUCTION and the product is published as '
  + '`ownBackOut.*` instead. ⛔ NO VERDICT WORD', 'backed-out restraint observations',
  (r) => r.restraintSum, (r) => r.restraintN);
defFace('restraint.exactlyZeroShare', 'share',
  '⭐⭐ the share of observations at EXACTLY 0 — the count his eyes say is ALREADY running '
  + '(`clamp01`\'s lower arm; exact because `0 · x === 0`)', 'backed-out restraint observations',
  (r) => r.restraintExactZero, (r) => r.restraintN);
defFace('restraint.exactlyOneShare', 'share',
  '⭐⭐ the share at EXACTLY 1 — nobody his eyes hold is running forward, and the score is '
  + 'DS-T0\'s in IEEE-754 (`x · 1 === x`)', 'backed-out restraint observations',
  (r) => r.restraintExactOne, (r) => r.restraintN);
defFace('restraint.observationsPerMatch', 'backed-out restraint observations per match',
  'the denominator above, per match', 'matches', (r) => r.restraintN, ONE);
defFace('runningMates.mean', 'running mates (a sum of clamped forward-speed shares in [0, 4])',
  '⭐⭐⭐ HOW MUCH RUNNING HIS OWN EYES SAY IS ALREADY HAPPENING, INVERTED out of the restraint: '
  + '`runningMates = (1 − restraint) · count`, exact wherever the restraint is ABOVE zero and '
  + 'CENSORED where the clamp bit. ⛔ NO VERDICT WORD', 'invertible restraint observations',
  (r) => r.rmSum, (r) => r.rmN);
defFace('runningMates.censoredShare', 'share',
  '⭐⭐ the share of restraint observations where the CLAMP BIT and the sum is only known to be '
  + '≥ `count` — published, never imputed', 'backed-out restraint observations',
  (r) => r.rmCensored, (r) => r.restraintN);
defFace('runningMates.observationsPerMatch', 'invertible observations per match',
  'the denominator above, per match', 'matches', (r) => r.rmN, ONE);
defFace('count.meanOnVisibleOwnCandidates', 'runners the shared prior licenses',
  '⭐⭐ `runnerCount(mode, tempo, urgency)` — THE COACH\'S COUNT AS A SHARED PRIOR, read off the '
  + 'ENGINE\'S OWN exported pure function at the ticks a visible own candidate exists',
  'visible own-run candidates', (r) => r.countSum, (r) => r.ownCandidateVisible);
for (const c of [1, 2, 3]) {
  defFace(`count.share.${c}`, 'share',
    `the share of visible own-run candidates whose shared prior was ${c}`,
    'visible own-run candidates', (r) => r.countBins[c - 1], (r) => r.ownCandidateVisible);
}
defFace('ownBackOut.mean', 'restraint × obmRunMul (a product of two multipliers)',
  '⭐⭐ THE OWN CANDIDATE\'S WHOLE BACK-OUT — `restraint · obmRunMul` — taken on EVERY arm. On a '
  + 'seat-ABSENT arm it EQUALS `restraint.mean` by construction (a stored partition check); on a '
  + 'DOSED arm the two factors cannot be separated from ONE recorded score, and the field name '
  + 'says so (canon: unit-name truth). ⛔ NO VERDICT WORD', 'backed-out observations',
  (r) => r.ownBackOutSum, (r) => r.ownBackOutN);
defFace('ownBackOut.belowOneShare', 'share',
  'the share of own-candidate back-outs below 1', 'backed-out observations',
  (r) => r.ownBackOutBelowOne, (r) => r.ownBackOutN);
defFace('ownBackOut.aboveOneShare', 'share',
  'the share above 1 — impossible from the restraint alone (it is capped at 1), so on a dosed '
  + 'arm this is the seat pricing a run UP and on a seat-absent arm it is back-out artefact',
  'backed-out observations', (r) => r.ownBackOutAboveOne, (r) => r.ownBackOutN);
defFace('ownBackOut.atOneShare', 'share', 'the share at exactly 1',
  'backed-out observations', (r) => r.ownBackOutAtOne, (r) => r.ownBackOutN);
defFace('ownBackOut.observationsPerMatch', 'backed-out observations per match',
  'the denominator above, per match', 'matches', (r) => r.ownBackOutN, ONE);
defFace('runMulLic.mean', 'multiplier',
  '⭐⭐⭐ THE SEAT\'S OWN PRICE ON A RUN, CLEAN: backed out of the LICENSED run\'s recorded score, '
  + 'which carries NO restraint factor (`s = W.runScore · tiredMul · obmRunMul`, anchored). THIS '
  + 'is the `runMul` limb of record on the dosed arms; the seat-ABSENT arms are ITS OWN NOISE '
  + 'FLOOR (`obmRunMul` is EXACTLY 1 there by construction)', 'licensed-run observations',
  (r) => r.runMulLicSum, (r) => r.runMulLicN);
defFace('runMulLic.belowOneShare', 'share',
  '⭐⭐ HOW OFTEN THE EYES PRICE A RUN **DOWN**, on the clean limb', 'licensed-run observations',
  (r) => r.runMulLicBelowOne, (r) => r.runMulLicN);
defFace('runMulLic.aboveOneShare', 'share',
  '⭐⭐ HOW OFTEN THE EYES PRICE A RUN **UP**, on the clean limb', 'licensed-run observations',
  (r) => r.runMulLicAboveOne, (r) => r.runMulLicN);
defFace('runMulLic.atOneShare', 'share', 'the share at exactly 1',
  'licensed-run observations', (r) => r.runMulLicAtOne, (r) => r.runMulLicN);
defFace('runMulLic.observationsPerMatch', 'licensed-run observations per match',
  'the denominator above, per match. ⚠ On the OWN arms the open-play board is empty, so the '
  + 'licensed run only appears at a restart, a corner crash or a cross flight — the denominator '
  + 'is small BY CONSTRUCTION and is published', 'matches', (r) => r.runMulLicN, ONE);

/* ---- CONTEXT / RECEIPTS ---- */
defFace('context.policyCacheEntriesPerMatch', 'policy-cache entries per match',
  '⚠ A RECEIPT, NEVER A FOOTBALL EFFECT SIZE: the size of the match\'s own `obmPolicies` cache '
  + 'at full time — written ONLY by the single `obmMovement` fork', 'matches',
  (r) => r.policyCacheEntries, ONE);
defFace('context.shotJoinShare', 'share',
  '⭐ THE SHOT JOIN — `shotLog` rows joined to a shooter through `pendingShot.logIndex`',
  '`shotLog` rows', (r) => r.shotsJoinedToAShooter, (r) => r.shotLogRows);
defFace('context.ticksPerMatch', 'stepped ticks per match', 'the match clock itself', 'matches',
  (r) => r.ticks, ONE);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = [];
for (const armK of ARMS) {
  const rows = armRows(armK);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
    const draws: number[] = [];
    for (const idx of resampleIndex) {
      let n1 = 0; let d1 = 0;
      for (const i of idx) { n1 += nu[i]; d1 += de[i]; }
      const v = ratio(n1, d1);
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
  if (f === undefined) { banner(`DS-T1b FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ — ARM − ITS CONTROL (the HATS arm at the SAME seat state and book), on
 *  shared seeds, with the CLUSTER BOOTSTRAP seeded from the block base. LOO in the CONSERVATIVE
 *  POINT-SHIFT form. */
interface DeltaRow {
  key: string; face: string; arm: Arm; controlArm: Arm;
  controlValue: number; armValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  down: boolean; up: boolean; resolved: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlipsDown: number; looFlipsUp: number;
}
const pairedDelta = (faceKey: string, armK: Arm): DeltaRow => {
  const f = FACES[faceKey];
  const ctrl = CONTROL_OF[armK];
  const nA = cells.map((c) => f.num(c.rows[armK]));
  const dA = cells.map((c) => f.dn(c.rows[armK]));
  const nC = cells.map((c) => f.num(c.rows[ctrl]));
  const dC = cells.map((c) => f.dn(c.rows[ctrl]));
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
    key: `${faceKey}@${armK}`, face: faceKey, arm: armK, controlArm: ctrl,
    controlValue: pC, armValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    down: hi < 0, up: lo > 0, resolved: hi < 0 || lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlipsDown: flipsDown, looFlipsUp: flipsUp,
  };
};
const deltas: DeltaRow[] = CONTRAST_ARMS.flatMap(
  (armK) => FACE_KEYS.map((k) => pairedDelta(k, armK)),
);
const delta = (faceKey: string, armK: Arm): DeltaRow => {
  const dd = deltas.find((x) => x.face === faceKey && x.arm === armK);
  if (dd === undefined) { banner(`DS-T1b FATAL — unknown Δ ${faceKey}@${armK}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 R1's WORD, THE GUARDS, THE SELECTORS AND THE FROZEN READS               */
/* ========================================================================== */
const TOLERANCE_FORM = 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
  + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — INHERITED BY ANCHOR from '
  + '`scripts/probes/ctb-t1-supply-exam.ts`\'s own line, cross-read from '
  + '`scripts/probes/dlc-t1-choice-exam.ts`, and EVALUATED FROM ITS TWO NUMERALS; never typed '
  + 'as a decimal. Frozen ex ante at §P.4.';
/** ⭐⭐⭐ `floods(arm)` — Δ of R1's MEAN, vs the HATS arm at the SAME seat state, RESOLVED UP
 *  **AND** BEYOND the tolerance. Stored per arm; the reads stand on it. */
const R1_KEY = 'r1.runsPerInPossessionTick';
const floodRowFor = (armK: Arm) => {
  const d = delta(R1_KEY, armK);
  const control = face(R1_KEY, CONTROL_OF[armK]).value;
  const tol = NI_FRACTION * Math.abs(control);
  const beyond = d.delta > tol;
  return {
    arm: armK, controlArm: CONTROL_OF[armK], controlLevel: control,
    armLevel: d.armValue, delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    toleranceAbs: tol, toleranceForm: TOLERANCE_FORM,
    resolved: d.resolved, up: d.up, down: d.down, beyondTolerance: beyond,
    floods: d.up && beyond,
    looFlipsUp: d.looFlipsUp, looFlipsDown: d.looFlipsDown,
    floodShareAtLeastThree: face('r1.floodShareAtLeastThree', armK).value,
    floodShareAtLeastThreeControl: face('r1.floodShareAtLeastThree', CONTROL_OF[armK]).value,
  };
};
const FLOOD_ROWS = Object.fromEntries(CONTRAST_ARMS.map((a) => [a, floodRowFor(a)])) as
  Record<Arm, ReturnType<typeof floodRowFor>>;
const floods = (armK: Arm): boolean => FLOOD_ROWS[armK].floods;

/** ⭐⭐⭐ THE GUARD ROWS (F-DS-b). BREACH = the paired Δ's interval RESOLVED **AND** beyond the
 *  tolerance IN THE HARMFUL DIRECTION. G10 is the #157 FLAG limb and gates NOTHING. */
type GuardDir = 'ceiling' | 'floor' | 'both';
const GUARD_LIMBS: readonly { id: string; key: string; direction: GuardDir; what: string }[] = [
  { id: 'G1', key: 'guard.goalsPerMatch', direction: 'both',
    what: 'GOALS per match — EITHER direction beyond tolerance is a breach.' },
  { id: 'G2', key: 'guard.shotsPerMatch', direction: 'both',
    what: 'SHOTS per match, both sides.' },
  { id: 'G3', key: 'guard.xgConversion', direction: 'both',
    what: 'xG CONVERSION — goals ÷ Σ xg off the `shotLog`.' },
  { id: 'G4', key: 'guard.passCompletion', direction: 'floor',
    what: 'PASS COMPLETION over ALL deliveries — a FLOOR; DOWN is harmful.' },
  { id: 'G5', key: 'guard.interceptionsPerMatch', direction: 'ceiling',
    what: 'INTERCEPTIONS per match — a CEILING; UP is harmful.' },
  { id: 'G6', key: 'guard.possessionShareSideA', direction: 'both',
    what: 'POSSESSION SHARE (side A) — EITHER direction is a breach.' },
  { id: 'G7', key: 'guard.passesPerMatch', direction: 'both',
    what: 'PASSES per match, both sides.' },
  { id: 'G8', key: 'guard.meanAimDistanceMetres', direction: 'both',
    what: 'MEAN PASS DISTANCE — the passer→target distance at the aim.' },
  { id: 'G9', key: 'guard.throughBallsPerMatch', direction: 'both',
    what: 'THROUGH BALLS per match — the engine\'s own counter.' },
];
const guardRowFor = (armK: Arm) => GUARD_LIMBS.map((l) => {
  const control = face(l.key, CONTROL_OF[armK]).value;
  const tol = NI_FRACTION * Math.abs(control);
  const d = delta(l.key, armK);
  const beyond = l.direction === 'ceiling' ? d.delta > tol
    : l.direction === 'floor' ? d.delta < -tol : Math.abs(d.delta) > tol;
  return {
    id: l.id, key: l.key, what: l.what, direction: l.direction, gating: true,
    controlArm: CONTROL_OF[armK], controlLevel: control, armLevel: d.armValue,
    toleranceAbs: tol, toleranceForm: TOLERANCE_FORM,
    delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,
    looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp,
  };
});
const GUARD_TABLE = Object.fromEntries(CONTRAST_ARMS.map((a) => [a, guardRowFor(a)])) as
  Record<Arm, ReturnType<typeof guardRowFor>>;
const OFFSIDE_ROWS = Object.fromEntries(CONTRAST_ARMS.map((armK) => {
  const d = delta('guard.offsidesPerMatch', armK);
  const control = face('guard.offsidesPerMatch', CONTROL_OF[armK]).value;
  return [armK, {
    id: 'G10', key: 'guard.offsidesPerMatch', controlArm: CONTROL_OF[armK],
    controlLevel: control, delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,
  }];
})) as Record<Arm, { id: string; key: string; controlArm: Arm; controlLevel: number;
  delta: number; ci: number[]; halfWidth: number; resolved: boolean; flag: boolean;
  gating: boolean }>;
const holdsBand = (armK: Arm): boolean => GUARD_TABLE[armK].every((g) => !g.breach);
const breachingGuards = (armK: Arm): string[] =>
  GUARD_TABLE[armK].filter((g) => g.breach).map((g) => `${g.id} ${g.key}`);

/** ⭐⭐⭐ THE SELECTOR BOOLEANS, STORED PER ARM. */
const selectorFor = (armK: Arm) => ({
  arm: armK, controlArm: CONTROL_OF[armK],
  floods: floods(armK), holdsBand: holdsBand(armK),
  breachingGuards: breachingGuards(armK),
  offsideFlag: OFFSIDE_ROWS[armK].flag,
  r1Delta: FLOOD_ROWS[armK].delta, r1Ci: FLOOD_ROWS[armK].ci,
  r1Tolerance: FLOOD_ROWS[armK].toleranceAbs,
  r1Resolved: FLOOD_ROWS[armK].resolved, r1Up: FLOOD_ROWS[armK].up,
  r1BeyondTolerance: FLOOD_ROWS[armK].beyondTolerance,
});
const SELECTORS = Object.fromEntries(CONTRAST_ARMS.map((a) => [a, selectorFor(a)])) as
  Record<Arm, ReturnType<typeof selectorFor>>;

/** ⭐⭐⭐ THE FROZEN READ LITERALS — the FOUR #406 item 5(v) sentences, RE-FROZEN VERBATIM by
 *  #408 item 5(iii) with the PRECEDENCE UNCHANGED and "dosed" = RUN-CAUTION. Copied character
 *  for character from `docs/world-model/PROGRAMME-RULINGS-ARCHIVE-398-407.md` (#406 item 5(v))
 *  and NOT interpolated: the breaching guards are a STORED FIELD printed on an ANNOTATION LINE,
 *  and H-DS-2 / H-DS-3 / H-DS-4's numbers are printed BESIDE, never spliced in. */
const READ_LITERALS = {
  read1: 'THE HAT CAN COME OFF — the player\'s own run holds the band without the coach and '
    + 'without eyes; DS-ENTRY is named: world 16 = world 15 + the own run with the open-play '
    + 'hats off.',
  read2: 'THE EYES ARE THE RESTRAINT — H-DS-2 holds and H-DS-1 holds without them; the entry '
    + 'needs the seat dosed: OBM-T2 (the dose space) is named before DS-ENTRY.',
  read3: 'THE RESTRAINT WAS THE COACH\'S — H-DS-1 holds with or without eyes; the law needs a '
    + 'player-side restraint term (a later slice); the seam stays dormant.',
  read4: 'A GUARD BREAKS — the guard is named; the commander decides with the table.',
} as const;
type ReadWord = keyof typeof READ_LITERALS;
/** ⭐⭐⭐ THE FROZEN RULE, applied to STORED booleans. The ORDER is the ruling's own. */
const readWordFrom = (
  floodsAbsent: boolean, holdsAbsent: boolean, floodsDosed: boolean, holdsDosed: boolean,
): ReadWord => {
  if (!floodsAbsent && holdsAbsent) return 'read1';
  if (floodsAbsent && !floodsDosed && holdsDosed) return 'read2';
  if (floodsAbsent && floodsDosed) return 'read3';
  return 'read4';
};
const READ_WORD = readWordFrom(floods(ARM_OF_RECORD), holdsBand(ARM_OF_RECORD),
  floods(DOSED_ARM_OF_RECORD), holdsBand(DOSED_ARM_OF_RECORD));
const READ_SENTENCE = READ_LITERALS[READ_WORD];
const BREACH_NAMED = [...breachingGuards(ARM_OF_RECORD),
  ...breachingGuards(DOSED_ARM_OF_RECORD)].join(' · ');
/** ⭐⭐ THE COUNTERFACTUAL WORDS — canon, VERBATIM: "a counterfactual verdict sentence ('had X
 *  been scored, the rule would read W') quotes a word the instrument STORED by applying the
 *  frozen rule to X's stored interval". The DOSED OWN arm's word (had it been the arm of
 *  record) and D13's word are both computed by the SAME frozen rule and STORED. */
const readWordAsIfOfRecord = (armK: Arm): ReadWord => readWordFrom(
  floods(armK), holdsBand(armK), floods(armK), holdsBand(armK),
);
const READ_WORD_IF_DOSED_WERE_OF_RECORD = readWordAsIfOfRecord(DOSED_ARM_OF_RECORD);
const READ_WORD_IF_CEILING_WERE_OF_RECORD = readWordAsIfOfRecord(CEILING_ARM);
const READ_WORD_D13 = readWordAsIfOfRecord('OWN-D13');
const D13_AGREES = READ_WORD_D13 === READ_WORD;
const AGREE_SENTENCE = {
  agrees: 'THIS ARM SELECTS THE SAME READ',
  disagrees: 'THIS ARM SELECTS A DIFFERENT READ',
};
/** ⭐⭐ THE ADDITIVE FORM's own words (#406 item 5(v)'s first beside-line). */
const wordsFor = (armK: Arm) => ({
  arm: armK, floods: floods(armK), holdsBand: holdsBand(armK),
  breachingGuards: breachingGuards(armK), offsideFlag: OFFSIDE_ROWS[armK].flag,
});
const HATSOWN_WORDS = {
  absent: wordsFor('HATSOWN-E13-ABSENT'),
  runCaution: wordsFor('HATSOWN-E13-RUNCAUTION'),
  kitchenSink: wordsFor('HATSOWN-E13-KITCHENSINK'),
};
/** ⭐⭐ THE YIELD PAIR — shots per OWN-RUN episode vs per HAT episode, BOTH FRACTIONS, on the
 *  ARM OF RECORD. ⛔ NO VERDICT WORD: the numbers are printed beside each other. */
const yieldPairFor = (armK: Arm) => ({
  arm: armK,
  ownShotsPerEpisode: face('own.shotsPerEpisode', armK).value,
  ownShotsNumerator: face('own.shotsPerEpisode', armK).numerator,
  ownEpisodes: face('own.shotsPerEpisode', armK).denominator,
  ownShotsPerMatch: face('own.shotsPerMatch', armK).value,
  hatShotsPerEpisode: face('ep.shotsPerEpisode.runner', armK).value,
  hatShotsNumerator: face('ep.shotsPerEpisode.runner', armK).numerator,
  hatEpisodes: face('ep.shotsPerEpisode.runner', armK).denominator,
  hatShotsPerMatchNumerator: face('ep.setsPerMatch.runner', armK).numerator,
  ownGoalsPerEpisode: face('own.goalsPerEpisode', armK).value,
  hatGoalsPerEpisode: face('ep.goalsPerEpisode.runner', armK).value,
});
const YIELD_PAIRS = Object.fromEntries(ARMS.map((a) => [a, yieldPairFor(a)]));
/** ⭐⭐ THE COUPLING SENTENCE'S OWN NUMBERS — the overlap-sets Δ and the wall-pass-fires Δ on
 *  OWN vs HATS. ⛔ NO VERDICT WORD. */
const couplingFor = (armK: Arm) => {
  const ov = delta('coupling.overlapSetsPerMatch', armK);
  const wf = delta('coupling.wallFiresPerMatch', armK);
  const pt = delta('coupling.overlapPlayedToPerSet', armK);
  const rt = delta('coupling.wallReturnShareOfFires', armK);
  return {
    arm: armK, controlArm: CONTROL_OF[armK],
    overlapSetsControl: ov.controlValue, overlapSetsArm: ov.armValue,
    overlapSetsDelta: ov.delta, overlapSetsCi: [ov.ciLo, ov.ciHi],
    overlapSetsResolved: ov.resolved,
    overlapPlayedToControl: pt.controlValue, overlapPlayedToArm: pt.armValue,
    overlapPlayedToDelta: pt.delta, overlapPlayedToCi: [pt.ciLo, pt.ciHi],
    wallFiresControl: wf.controlValue, wallFiresArm: wf.armValue,
    wallFiresDelta: wf.delta, wallFiresCi: [wf.ciLo, wf.ciHi], wallFiresResolved: wf.resolved,
    wallReturnControl: rt.controlValue, wallReturnArm: rt.armValue,
    wallReturnDelta: rt.delta, wallReturnCi: [rt.ciLo, rt.ciHi],
  };
};
const COUPLING = Object.fromEntries(CONTRAST_ARMS.map((a) => [a, couplingFor(a)]));
/** ⭐⭐ THE PER-STATE LINE — own runs won at owned / in-flight / restart ticks. */
const perStateLineFor = (armK: Arm) => Object.fromEntries(STATES.map((st) => [st, {
  ownRunsPerMatch: face(`state.runsPerMatch.own.${st}`, armK).value,
  ownRuns: face(`state.runsPerMatch.own.${st}`, armK).numerator,
  ownRunShare: face(`state.runShare.own.${st}`, armK).value,
  hatRunsPerMatch: face(`state.runsPerMatch.hat.${st}`, armK).value,
  hatRuns: face(`state.runsPerMatch.hat.${st}`, armK).numerator,
  hatRunShare: face(`state.runShare.hat.${st}`, armK).value,
  ownAimedPerRun: face(`state.aimedPerRun.own.${st}`, armK).value,
  hatAimedPerRun: face(`state.aimedPerRun.hat.${st}`, armK).value,
  ownShotsPerRun: face(`state.shotsPerRun.own.${st}`, armK).value,
  hatShotsPerRun: face(`state.shotsPerRun.hat.${st}`, armK).value,
}]));
const PER_STATE = Object.fromEntries(ARMS.map((a) => [a, perStateLineFor(a)]));
/** ⭐⭐⭐ `openPlayBoardEmpty` — A STORED BOOLEAN, per arm, never a claim. */
const OPEN_PLAY_BOARD = Object.fromEntries(ARMS.map((a) => {
  const f = face('board.openPlayEmptyShare', a);
  return [a, {
    arm: a, emptyTicks: f.numerator, openPlayTicks: f.denominator, share: f.value,
    openPlayBoardEmpty: f.denominator > 0 && f.numerator === f.denominator,
  }];
})) as Record<Arm, { arm: Arm; emptyTicks: number; openPlayTicks: number; share: number;
  openPlayBoardEmpty: boolean }>;
/** ⭐⭐ LOO — SCOPED to the READ-BEARING rows only: R1 and every gating guard, per arm. */
const LOO_ROWS = CONTRAST_ARMS.flatMap((armK) => [R1_KEY, ...GUARD_LIMBS.map((l) => l.key)]
  .map((k) => {
    const d = delta(k, armK);
    return {
      face: k, arm: armK, delta: d.delta, ci: [d.ciLo, d.ciHi],
      looMaxInfluenceShare: d.looMaxInfluenceShare,
      looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp, seedsDropped: cells.length,
    };
  }));
const LOO_OK = LOO_ROWS.every((r) => Number.isInteger(r.looFlipsDown)
  && Number.isInteger(r.looFlipsUp));

/* ========================================================================== */
/* §15 G-BITE, THE POOLED BINS, THE BIN-DERIVED MEDIANS, AND THE SIZING        */
/* ========================================================================== */
/** ⭐⭐⭐ G-BITE in the #402 item 2(iii) form: on every battery seed WHERE THE FLAG CAN BITE, the
 *  arm's and its control's whole-match signatures DIFFER. The shapes where nothing can bite are
 *  EXEMPTED AND NAMED: a seed on which the armed arm records ZERO own-run decisions has no
 *  candidate for `dsOwnRun` to push. ⚠ LIVENESS ONLY — a differing signature says the flag
 *  fired, never that it helped. */
const biteRows = CONTRAST_ARMS.map((armK) => {
  const ctrl = CONTROL_OF[armK];
  const eligible = cells.filter((c) =>
    c.rows[armK].runClassTicks[RCI('ownRunInBehind')] > 0
    || c.rows[armK].dsHatsOffFlag);
  const exempt = cells.filter((c) => !eligible.includes(c)).map((c) => c.seed);
  const differing = eligible.filter((c) => c.rows[armK].signature !== c.rows[ctrl].signature);
  const identical = eligible.filter((c) => c.rows[armK].signature === c.rows[ctrl].signature)
    .map((c) => c.seed);
  return {
    arm: armK, controlArm: ctrl, eligibleSeeds: eligible.length,
    seedsDiffering: differing.length, identicalSeeds: identical.slice(0, 20),
    exemptSeeds: exempt.length, exemptSeedsSample: exempt.slice(0, 20),
    exemptReason: 'the armed arm recorded ZERO own-run decisions on this seed, so `dsOwnRun` '
      + 'had no candidate to push (the `dsHatsOff` arms are never exempt — the bypass fires on '
      + 'every open-play coach tick)',
    allDiffer: eligible.length > 0 && identical.length === 0,
  };
});
/** ⭐⭐ THE SEAT'S OWN BITE, beside: each DOSED control against the ABSENT control. */
const seatBiteRows = (['HATS-E13-RUNCAUTION', 'HATS-E13-KITCHENSINK'] as Arm[]).map((armK) => {
  const differing = cells.filter((c) =>
    c.rows[armK].signature !== c.rows['HATS-E13-ABSENT'].signature);
  return {
    arm: armK, controlArm: 'HATS-E13-ABSENT', eligibleSeeds: cells.length,
    seedsDiffering: differing.length, allDiffer: differing.length === cells.length,
    note: `the OBM seat's own liveness: ${ARM_DOSE[armK]} against the seat-absent world`,
  };
});
const BITE_OK = biteRows.every((r) => r.allDiffer)
  && seatBiteRows.every((r) => r.seedsDiffering > 0);

interface Pooled {
  restraintBins: number[]; rmBins: number[]; ownBackOutBins: number[];
  runMulLicBins: number[]; countBins: number[];
  r1Bins: number[]; r1RunnersByRole: number[];
  branchTicks: number[]; runCountBins: number[]; runnersByRole: number[];
  offBallActionTicksPost: number[]; runClassTicks: number[]; keeperRunClassTicks: number[];
  hatClassTicks: number[];
  epSets: number[]; epTickBins: number[]; epTickBinsWide: number[]; ownEpTickBins: number[];
  runMulBinsArr: number[]; stateRunDecisions: number[]; stateAllDecisions: number[];
  wallConjunctKills: number[];
}
const POOL_KEYS = ['restraintBins', 'rmBins', 'ownBackOutBins', 'runMulLicBins', 'countBins',
  'r1Bins', 'r1RunnersByRole', 'branchTicks', 'runCountBins', 'runnersByRole',
  'offBallActionTicksPost', 'runClassTicks', 'keeperRunClassTicks', 'hatClassTicks',
  'epSets', 'epTickBins', 'epTickBinsWide', 'ownEpTickBins', 'runMulBinsArr',
  'stateRunDecisions', 'stateAllDecisions', 'wallConjunctKills'] as const;
const emptyPooled = (): Pooled => ({
  restraintBins: zeros(UNIT_BINS), rmBins: zeros(RM_BINS), ownBackOutBins: zeros(OWNB_BINS),
  runMulLicBins: zeros(RUNMUL_BINS), countBins: zeros(COUNT_CELLS),
  r1Bins: zeros(R1_BINS), r1RunnersByRole: zeros(ROLES4.length),
  branchTicks: zeros(BRANCHES.length), runCountBins: zeros(RUN_COUNT_BINS),
  runnersByRole: zeros(ROLES4.length), offBallActionTicksPost: zeros(ACTION_CELLS.length),
  runClassTicks: zeros(RUN_CLASSES.length), keeperRunClassTicks: zeros(RUN_CLASSES.length),
  hatClassTicks: zeros(HAT_CLASSES.length),
  epSets: zeros(EP_CLASSES.length), epTickBins: zeros(EP_CLASSES.length * EP_TICK_BINS),
  epTickBinsWide: zeros(EP_CLASSES.length * EPW_BINS), ownEpTickBins: zeros(EPW_BINS),
  runMulBinsArr: zeros(RUNMUL_BINS),
  stateRunDecisions: zeros(RUNKINDS.length * STATES.length),
  stateAllDecisions: zeros(STATES.length), wallConjunctKills: zeros(CONJUNCTS.length),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled() as unknown as Record<string, number[]>;
  for (const r of rows) {
    const rr = r as unknown as Record<string, number[]>;
    for (const k of POOL_KEYS) addInto(p[k], rr[k]);
  }
  return p as unknown as Pooled;
};
/** ⭐⭐⭐ DEBT (c): every bin-derived median is published WITH ITS TOP BIN'S SHARE beside it, and
 *  the top bin's LOWER EDGE lies beyond one full `wallRun` licence. */
const mediansFrom = (p: Pooled): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const c of EP_CLASSES) {
    const bins = p.epTickBinsWide.slice(ECI(c) * EPW_BINS, (ECI(c) + 1) * EPW_BINS);
    out[`${c}EpisodeTicksMedian`] = binMedian(bins, EPW_BIN);
    out[`${c}EpisodeTicksTopBinShare`] = topBinShare(bins);
    const narrow = p.epTickBins.slice(ECI(c) * EP_TICK_BINS, (ECI(c) + 1) * EP_TICK_BINS);
    out[`${c}EpisodeTicksMedianDsC0Bins`] = binMedian(narrow, EP_TICK_BIN);
    out[`${c}EpisodeTicksTopBinShareDsC0Bins`] = topBinShare(narrow);
  }
  out.ownRunEpisodeTicksMedian = binMedian(p.ownEpTickBins, EPW_BIN);
  out.ownRunEpisodeTicksTopBinShare = topBinShare(p.ownEpTickBins);
  out.runMulMedian = RUNMUL_LO + binMedian(p.runMulBinsArr, RUNMUL_W);
  out.runMulTopBinShare = topBinShare(p.runMulBinsArr);
  /* ⭐⭐⭐ DS-T1b's own bin-derived medians, each with ITS TOP BIN'S SHARE beside it */
  out.restraintMedian = binMedian(p.restraintBins, UNIT_W);
  out.restraintTopBinShare = topBinShare(p.restraintBins);
  out.runningMatesMedian = binMedian(p.rmBins, RM_W);
  out.runningMatesTopBinShare = topBinShare(p.rmBins);
  out.ownBackOutMedian = binMedian(p.ownBackOutBins, OWNB_W);
  out.ownBackOutTopBinShare = topBinShare(p.ownBackOutBins);
  out.runMulLicMedian = RUNMUL_LO + binMedian(p.runMulLicBins, RUNMUL_W);
  out.runMulLicTopBinShare = topBinShare(p.runMulLicBins);
  return out;
};
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const armK of ARMS) {
  pooled[armK] = poolFrom(armRows(armK));
  medians[armK] = mediansFrom(pooled[armK]);
}

/** ⭐⭐⭐ DS-T1b — THE SEAM'S OWN FACES, PER ARM (#408 item 5(ii)); every value a STORED face
 *  or a STORED bin, ⛔ NO VERDICT WORD anywhere in this block. */
const seamFacesFor = (armK: Arm) => ({
  arm: armK, seatDose: ARM_DOSE[armK], obmRunMulKnownToBeOne: !ARM_DOSED[armK],
  guardPass: {
    ownCandidateVisibleShareFLOOR: face('seam.ownCandidateVisibleSharePerUnhattedTick', armK)
      .value,
    ownCandidateVisibleSharePreStepForm:
      face('seam.ownCandidateVisibleSharePreStepGuardForm', armK).value,
    unhattedTicksPerMatch: face('seam.unhattedTicksPerMatch', armK).value,
    ownCandidatesPerMatch: face('seam.ownCandidatesPerMatch', armK).value,
    outsidePostGuardShare: face('seam.ownCandidateOutsidePostGuardShare', armK).value,
  },
  restraint: {
    mean: face('restraint.mean', armK).value,
    observations: face('restraint.mean', armK).denominator,
    exactlyZeroShare: face('restraint.exactlyZeroShare', armK).value,
    exactlyOneShare: face('restraint.exactlyOneShare', armK).value,
    bins: pooled[armK].restraintBins, binLo: 0, binWidth: UNIT_W, binCount: UNIT_BINS,
    median: medians[armK].restraintMedian, topBinShare: medians[armK].restraintTopBinShare,
  },
  runningMates: {
    mean: face('runningMates.mean', armK).value,
    observations: face('runningMates.mean', armK).denominator,
    censoredShare: face('runningMates.censoredShare', armK).value,
    bins: pooled[armK].rmBins, binLo: 0, binWidth: RM_W, binCount: RM_BINS, binHi: RM_HI,
    median: medians[armK].runningMatesMedian,
    topBinShare: medians[armK].runningMatesTopBinShare,
  },
  count: {
    mean: face('count.meanOnVisibleOwnCandidates', armK).value,
    shares: [1, 2, 3].map((c) => face(`count.share.${c}`, armK).value),
    bins: pooled[armK].countBins,
  },
  ownBackOut: {
    mean: face('ownBackOut.mean', armK).value,
    observations: face('ownBackOut.mean', armK).denominator,
    belowOneShare: face('ownBackOut.belowOneShare', armK).value,
    aboveOneShare: face('ownBackOut.aboveOneShare', armK).value,
    atOneShare: face('ownBackOut.atOneShare', armK).value,
    bins: pooled[armK].ownBackOutBins, binLo: 0, binWidth: OWNB_W, binCount: OWNB_BINS,
    binHi: OWNB_HI,
    median: medians[armK].ownBackOutMedian, topBinShare: medians[armK].ownBackOutTopBinShare,
  },
  runMulLicensedLimb: {
    mean: face('runMulLic.mean', armK).value,
    observations: face('runMulLic.mean', armK).denominator,
    belowOneShare: face('runMulLic.belowOneShare', armK).value,
    aboveOneShare: face('runMulLic.aboveOneShare', armK).value,
    atOneShare: face('runMulLic.atOneShare', armK).value,
    bins: pooled[armK].runMulLicBins, binLo: RUNMUL_LO, binWidth: RUNMUL_W,
    binCount: RUNMUL_BINS,
    median: medians[armK].runMulLicMedian, topBinShare: medians[armK].runMulLicTopBinShare,
  },
  inFlightAndRestart: {
    ownRunShareBallInFlight: face('state.runShare.own.ballInFlight', armK).value,
    ownRunShareOwnRestart: face('state.runShare.own.ownRestart', armK).value,
    ownRunShareMateOwnsTheBall: face('state.runShare.own.mateOwnsTheBall', armK).value,
    ownRunShareOther: face('state.runShare.own.other', armK).value,
    ownRunsPerMatchBallInFlight: face('state.runsPerMatch.own.ballInFlight', armK).value,
    ownRunsPerMatchOwnRestart: face('state.runsPerMatch.own.ownRestart', armK).value,
  },
});
const SEAM_FACES = Object.fromEntries(ARMS.map((a) => [a, seamFacesFor(a)]));
/** ⭐⭐⭐ H-DS-2 / H-DS-3 / H-DS-4's NUMBERS, printed BESIDE the read — DS-T1's own values are
 *  QUOTED BY FIELD out of its artifact (`repro.dsT1Quoted`), never typed. ⛔ NO VERDICT WORD:
 *  this block stores numbers and stored booleans only, and the hypotheses are NOT judged. */
const hRow = (faceKey: string, armK: Arm) => {
  const d = delta(faceKey, armK);
  return {
    face: faceKey, arm: armK, controlArm: d.controlArm, controlLevel: d.controlValue,
    armLevel: d.armValue, delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth, resolved: d.resolved,
  };
};
const H_NUMBERS = {
  note: '⛔ PRINTED, NEVER JUDGED (#408 item 5(iii)): no verdict word is stored on any '
    + 'hypothesis face. DS-T1\'s numbers are read out of its own artifact BY FIELD.',
  hDs3: {
    hypothesis: 'H-DS-3 — the perceived restraint holds the coach\'s count without the coach '
      + '(#408 item 4; the seam doc §HONESTY-B 1)',
    thisStage: hRow(R1_KEY, ARM_OF_RECORD),
    thisStageR1Level: face(R1_KEY, ARM_OF_RECORD).value,
    thisStageR1ControlLevel: face(R1_KEY, CONTROL_OF[ARM_OF_RECORD]).value,
    thisStageShareAtLeastThree: face('r1.floodShareAtLeastThree', ARM_OF_RECORD).value,
    thisStageShareAtLeastThreeControl:
      face('r1.floodShareAtLeastThree', CONTROL_OF[ARM_OF_RECORD]).value,
    dsT1: (reproDetail.dsT1Quoted as { r1DeltaOwnAbsent: unknown } | null)?.r1DeltaOwnAbsent
      ?? null,
    dsT1LevelsQuoted: {
      own: (reproDetail.dsT1Quoted as { r1LevelOwnAbsent: unknown } | null)?.r1LevelOwnAbsent
        ?? null,
      hats: (reproDetail.dsT1Quoted as { r1LevelHatsAbsent: unknown } | null)?.r1LevelHatsAbsent
        ?? null,
    },
  },
  hDs4: {
    hypothesis: 'H-DS-4 — withdrawing the in-flight run costs the through-ball gain (#408 item '
      + '4; the seam doc §HONESTY-B 2)',
    thisStage: hRow('guard.throughBallsPerMatch', ARM_OF_RECORD),
    dsT1: (reproDetail.dsT1Quoted as { g9DeltaOwnAbsent: unknown } | null)?.g9DeltaOwnAbsent
      ?? null,
    yieldPairThisStage: YIELD_PAIRS[ARM_OF_RECORD],
    yieldPairDsT1Quoted:
      (reproDetail.dsT1Quoted as { yieldPairOwnAbsent: unknown } | null)?.yieldPairOwnAbsent
        ?? null,
    perStateThisStage: PER_STATE[ARM_OF_RECORD],
    perStateDsT1Quoted:
      (reproDetail.dsT1Quoted as { perStateOwnAbsent: unknown } | null)?.perStateOwnAbsent
        ?? null,
  },
  hDs2: {
    hypothesis: 'H-DS-2 — the eyes price the crowded run down (#408 item 4). THE DOSE THAT CAN '
      + 'REACH IT: RUN-CAUTION and KITCHEN-SINK both carry a NON-ZERO `runScore` row; '
      + 'MARKER-ESCAPE (DS-T1\'s dose) does not, which is why #407 item 3 struck it.',
    seatAbsent: hRow(R1_KEY, ARM_OF_RECORD),
    runCaution: hRow(R1_KEY, DOSED_ARM_OF_RECORD),
    kitchenSink: hRow(R1_KEY, CEILING_ARM),
    runMulLicensedLimb: {
      seatAbsent: SEAM_FACES[ARM_OF_RECORD].runMulLicensedLimb,
      runCaution: SEAM_FACES[DOSED_ARM_OF_RECORD].runMulLicensedLimb,
      kitchenSink: SEAM_FACES[CEILING_ARM].runMulLicensedLimb,
      hatsControlRunCaution: SEAM_FACES['HATS-E13-RUNCAUTION'].runMulLicensedLimb,
      hatsControlKitchenSink: SEAM_FACES['HATS-E13-KITCHENSINK'].runMulLicensedLimb,
      noiseFloorHatsAbsent: SEAM_FACES['HATS-E13-ABSENT'].runMulLicensedLimb,
    },
    ownBackOut: {
      seatAbsent: SEAM_FACES[ARM_OF_RECORD].ownBackOut,
      runCaution: SEAM_FACES[DOSED_ARM_OF_RECORD].ownBackOut,
      kitchenSink: SEAM_FACES[CEILING_ARM].ownBackOut,
    },
    dsT1DosedAtMarkerEscape: (reproDetail.dsT1Quoted as
      { r1DeltaOwnDosedMarkerEscape: unknown } | null)?.r1DeltaOwnDosedMarkerEscape ?? null,
  },
};

const Z975 = 1.959963984540054;
const ZSUM = 1.959963984540054 + 0.8416212335729143;
const SMOKE_N = 12;
/** ⭐⭐ THE SIZING INPUTS — the half-widths measured by the DISCLOSED 12-seed scratch smoke on
 *  900,006,600–611 (TWELVE walks per seed), transcribed here and re-derived off the artifact by
 *  `gFaces`. The declared target is a 0.05 HALF-WIDTH on R1's paired Δ (OWN vs HATS, seat
 *  absent, E13) and on `passCompletion`'s paired Δ on the same pair. */
const SIZING_INPUTS = [
  { face: 'r1.runsPerInPossessionTick@OWN-E13-ABSENT',
    hwSmoke: 0.07509379863457943, target: 0.05 },
  { face: 'guard.passCompletion@OWN-E13-ABSENT',
    hwSmoke: 0.03349083590539348, target: 0.05 },
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
    degenerate: r.hwSmoke === 0,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);
/** the REALISED half-widths at N, published beside the projection */
const REALISED_HALF_WIDTHS = SIZING_INPUTS.map((r) => {
  const [k, a] = r.face.split('@');
  const d = delta(k, a as Arm);
  return { face: r.face, realisedHalfWidth: d.halfWidth, delta: d.delta,
    ci: [d.ciLo, d.ciHi], target: r.target };
});

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED, FIXTURE_SEED];
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000, 12_553_000, 12_554_000];
/** ⭐⭐ THE EMPTINESS TABLE — ENUMERATED, per arm, so no read can be written about a class that
 *  does not exist. ⛔ NO FALSE UNIVERSAL. */
const EMPTY_RUN_CLASSES = ARMS.flatMap((armK) => RUN_CLASSES_NAMED
  .filter((c) => tot(armK, (r) => r.runClassTicks[RCI(c)] + r.keeperRunClassTicks[RCI(c)]) === 0)
  .map((c) => `${armK}.${c}`));
const EMPTY_EP_CLASSES = ARMS.flatMap((armK) => EP_CLASSES
  .filter((c) => tot(armK, (r) => r.epSets[ECI(c)]) === 0).map((c) => `${armK}.${c}`));
const EMPTY_STATE_CLASSES = ARMS.flatMap((armK) => RUNKINDS.flatMap((k) => STATES
  .filter((st) => tot(armK, (r) => r.stateRunDecisions[RKI(k) * STATES.length + SI(st)]) === 0)
  .map((st) => `${armK}.${k}.${st}`)));
const OWN_ARMS = ARMS.filter((a) => ARM_KIND[a] !== 'HATS');
const CLASSES_LIVE = ARMS.every((armK) => tot(armK, (r) => r.r1TeamTicks) > 0
    && tot(armK, (r) => r.offBallDecisionTicksPost) > 0
    && tot(armK, (r) => r.makeRunTicksPost) > 0
    && tot(armK, (r) => r.wallEligiblePasses) > 0
    && tot(armK, (r) => r.shotLogRows) > 0
    && tot(armK, (r) => r.completedHatted + r.completedUnhatted) > 0)
  && OWN_ARMS.every((armK) => tot(armK, (r) => r.ownEpSets) > 0
    && tot(armK, (r) => r.runClassTicks[RCI('ownRunInBehind')]) > 0)
  && ARMS.filter((a) => ARM_KIND[a] === 'HATS').every((armK) =>
    tot(armK, (r) => r.epSets[ECI('runner')]) > 0
    && tot(armK, (r) => r.epSets[ECI('arriver')]) > 0)
  && ARMS.every((armK) => tot(armK, (r) => r.runMulCount) > 0)
  /* ⭐⭐⭐ DS-T1b's OWN populations: the guard denominator on every arm; the own candidate and
   * both back-outs on every arm carrying `dsOwnRun`; the RESTRAINT and its inversion on the
   * seat-ABSENT own arms (where `obmRunMul` is 1 by construction) — and, positively, EMPTY on
   * every dosed arm, which is the emptiness the product face exists to name. */
  && ARMS.every((armK) => tot(armK, (r) => r.unhattedOffBallTicksPost) > 0)
  && OWN_ARMS.every((armK) => tot(armK, (r) => r.ownCandidateVisible) > 0
    && tot(armK, (r) => r.ownBackOutN) > 0)
  && OWN_ARMS.filter((a) => !ARM_DOSED[a]).every((armK) =>
    tot(armK, (r) => r.restraintN) > 0 && tot(armK, (r) => r.rmN) > 0)
  && DOSED_ARMS.every((armK) => tot(armK, (r) => r.restraintN) === 0
    && tot(armK, (r) => r.rmN) === 0);
const TWO_FRACTION_PAIRS = [
  ['r1.runsPerInPossessionTick', 'r1.runnerTicksPerMatch'],
  ['r1.floodShareAtLeastThree', 'r1.teamTicksPerMatch'],
  ['own.shotsPerEpisode', 'own.shotsPerMatch'],
  ['ep.shotsPerEpisode.runner', 'ep.setsPerMatch.runner'],
  ['coupling.overlapPlayedToPerSet', 'coupling.overlapSetsPerMatch'],
  ['coupling.wallFireRatePerEligiblePass', 'coupling.wallFiresPerMatch'],
  ['coupling.wallReturnShareOfFires', 'coupling.wallReturnsPerMatch'],
  ['guard.passCompletion', 'guard.passesPerMatch'],
  ['guard.xgConversion', 'guard.goalsPerMatch'],
  ['runCount.mean', 'runCount.designationsPerMatch'],
  ['board.openPlayEmptyShare', 'board.openPlayCoachTicksPerMatch'],
  ['hatted.shareOfAttackingOutfield', 'hatted.attackingOutfieldBodyTicksPerMatch'],
  ['crowd.crashShare', 'crowd.sampledTicksPerMatch'],
  ['runMul.belowOneShare', 'runMul.observationsPerMatch'],
  ['guard.spacingUnder4Pooled', 'guard.spacingUnder4'],
];
const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.edsChoiceOn
      && r.genomeClean && r.pcHoldsReadable && r.infoGenomeCleanOfMatrix
      && r.dsOwnRunFlag === (ARM_KIND[armK] !== 'HATS')
      && r.dsHatsOffFlag === (ARM_KIND[armK] === 'OWN')
      && r.obmFlag === ARM_DOSED[armK]
      && r.matrixOnBaseEff === ARM_DOSED[armK])) && WORLD_PIN_OK,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: `bqArmedVersion(m) '
      + `=== ${BQ_WORLD_VERSION}\`, \`bqCushion\` TRUE, \`lnArmedVersion(m) !== `
      + `${LN_WORLD_VERSION}\` and \`gkArmedVersion(m) !== ${GK_WORLD_VERSION}\` with both `
      + 'doors ABSENT (`lnOwnLanePrice` and `gkDiveBody` FALSE); `edsPerceivedChoice` TRUE; '
      + 'every CTB / RC / BF seam ABSENT; the TWO DS FLAGS EXACTLY AS DUE per arm '
      + '(`dsOwnRun` on the HATSOWN and OWN arms, `dsHatsOff` on the OWN arms only); '
      + '`obmMovement` EXACTLY AS DUE, with the arm\'s OWN 16-slot matrix (RUN-CAUTION or '
      + 'KITCHEN-SINK) present on '
      + '`baseGenome` AND `effGenome` of BOTH teams on exactly the dosed arms; and '
      + '⛔ `info.genome` CLEAN OF THE MATRIX on EVERY arm (canon: dose placement — the two '
      + 'match-local views are DE-ALIASED with the engine\'s own idiom before the write), and '
      + 'clean of the own-lane / RC / CTB / OBM-support genes. Pinned again on a CONSTRUCTED '
      + `match of each arm at scratch seed ${WORLD_PIN_SEED}`,
  },
  gDoseCopy: {
    ok: DOSE_COPY_OK,
    note: '⭐⭐⭐ G-DOSE-COPY in LN-T1\'s form, on BOTH matrices: KITCHEN-SINK is BYTE-COPIED '
      + `from \`${OBMT1_PATH}\`'s own lines (anchored, l.500–509) and RUN-CAUTION is a HAND-SET `
      + 'PROBE CORNER in that same file\'s `matrix(...)` idiom (DECLARED a probe, NOT a dose of '
      + 'record); BOTH are RE-DERIVED SLOT FOR SLOT by a SECOND, INDEPENDENTLY SHAPED derivation '
      + 'straight off the `OBM_*` exports (a full output × feature sweep). '
      + `${OBM_WEIGHT_SLOTS} slots compared per matrix, `
      + `${DOSE_COPY_ROWS.map((r) => r.slots.filter((x) => x.same).length).join(' and ')} equal; `
      + `${DOSE_COPY_ROWS.map((r) => `${r.kind}: ${r.nonZeroCount} non-zero`).join(' · ')}; `
      + `RUN-CAUTION's two non-zero slots are BOTH at the domain MIN (${OBM_WEIGHT_MIN}) and `
      + `BOTH in the \`runScore\` row, its plane and support rows are ZERO; KITCHEN-SINK fills `
      + `all ${OBM_WEIGHT_SLOTS} slots at a domain corner with the \`runScore\` row at MIN; and `
      + 'the two matrices DIFFER',
  },
  gDoseSource: {
    ok: D13_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The D13 arms take their doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`) and NEVER through `info.genome`; this gate hashes the '
      + 'FILE BYTES this process read and compares them to the values pinned since #388 — a '
      + `mismatch is exit 3 BEFORE any seed is walked. \`pcDoseGuard.bytesChecked\` = `
      + `${pcDoseGuard.bytesChecked}`,
  },
  gAnchoredConstants: {
    ok: ANCHORS.every((a) => a.occurrences.length === a.want) && LITERALS_OK && NI_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites, EVERY one at `
      + 'its declared occurrence count: ⭐ THE SEAM ITSELF (the ONE `match.dsOwnRun` fork, its '
      + 'two guards, the prior line, the score line, the tired-then-eyes ORDER, the seventh '
      + '`why` literal, the TWO `!match.dsHatsOff` gates, both flag inits, the League union '
      + 'keys, and the ZERO-count anchors proving NEITHER FLAG appears in `a4World.ts` or the '
      + 'executor) · `RUN_ROLE_W` / `RUN_DEPTH_DIV` / `RUN_PRIOR_MAX` (the last DERIVED IN '
      + 'CODE) · `OFFBALL_TIRED_MUL` and the `tired` predicate · `OBM_SCORE_SPAN` and the '
      + 'seat\'s own `runMul` line · THE DESIGNATION WRITER and its branch ladder · THE 2过1\'s '
      + 'six conjuncts and its 2.3 s write (from which the licence\'s 138 ticks are DERIVED, '
      + 'never typed) · THE LEDGERS incl. the three DEBT (a) lines (`pcHeld`\'s own read, the '
      + '`decisionsHeld` ledger, and `pcLatencyObserve` sitting BEFORE `stepCount++`) · THE '
      + 'DOSE COPY (OBM-T1\'s `IDX` / `F1..F4` / `O_DEPTH..O_RUN` / `ZERO_MATRIX` / `matrix()` '
      + '/ MIN-MAX aliases / the KITCHEN-SINK sweep\'s own lines) · ⭐⭐⭐ DS-T0b\'s AMENDMENT '
      + '(the four-factor score line, the restraint expression and its three count inputs, the '
      + 'percept pull, the perceived-owner guard, the running-mates sum and its exclusions, '
      + '`runnerCount`\'s head and BOTH call sites) · THE TOLERANCE (`NI_FRACTION` as an '
      + 'EXPRESSION in CTB-T1\'s probe, cross-read from DLC-T1\'s, EVALUATED from its two '
      + 'numerals and NEVER typed as a decimal) · THE CROWDING FAMILY (`DUP_RUN_M`, '
      + '`SAMPLE_EVERY`, `PAIR_SUBSAMPLE`, `CLOSE_PAIR_M`, PT-C0\'s 撞车 line, OBM-T1\'s '
      + '`spacingUnder4` fold) · the #157 offside FLAG form from LN-T1′b · X-FP-PROD\'s '
      + `baseline. NI_FRACTION = ${NI_FRACTION} from TWO independent instrument files, equal`,
  },
  gPredicateFixtures: {
    ok: FIXTURES_OK,
    note: `⭐⭐ ${FIXTURES.length} FIXTURES, each predicate stated with a case where it FIRES `
      + 'and one where it does NOT: the COACH and DECISION ticks on the engine\'s own guard '
      + 'arithmetic; ⭐⭐⭐ DEBT (a) — a HAND-BUILT HOLD ARMED INSIDE THE STEP on which the '
      + 'PRE-STEP form says "he decided" and the POST-STEP form says "he was held", and a hold '
      + 'that PREDATES the step on which the two AGREE; the BRANCH ladder; the MIRROR '
      + 'hat-class classifier (the own run landing in OTHER, as DS-C0 would have read it); ⭐⭐⭐ '
      + 'THIS EXAM\'S NINE-CELL classifier with `ownRunInBehind` as its OWN class, OTHER firing '
      + 'on a hand-written run and on an EDITED seventh literal; ⭐⭐⭐ THE OWN-RUN EPISODE\'s '
      + 'SET and CLEAR on a hand-built record series (a `MakeRun` with the seventh why is '
      + 'ACTIVE, the same why on a non-run action is NOT, one set-then-clear is ONE episode, a '
      + 'held run is ONE, never-set is zero) and the yield window open/shut on both sides; ⭐⭐⭐ '
      + 'THE STATE classifier on hand-built states, EVERY state firing and each with a '
      + 'negative (an in-flight ball during a RESTART is not `ballInFlight`; the OPPONENT\'s '
      + 'restart is `other`; a mate on the ball WINS); the 2过1 with all six conjuncts true and '
      + 'each killed by exactly one; the PRIOR at every role and every quarter-metre of the '
      + 'pitch (the ST on the goal line EXACTLY 1, the deep DF clamped to 0); the `runMul` '
      + 'BACK-OUT recovering an identity, a priced-down and a priced-up multiplier THROUGH the '
      + 'tired limb, and refusing a zero prior; ⭐⭐⭐ THE `flagGated` CLASSIFIER on the seam\'s '
      + 'own push (exactly ONE flag-gated push, naming `dsOwnRun`, NOT hat-guarded) and the '
      + 'shipped-path boolean DERIVED; the READ-FORK inventory PARSED from the seam doc and '
      + 'compared. ⛔ NO fixture asserts a direction',
  },
  gLedgerRead: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.wallEligiblePasses) > 0
      && tot(armK, (r) => r.shotLogRows) > 0
      && tot(armK, (r) => r.shotsJoinedToAShooter) > 0
      && tot(armK, (r) => r.goalRowsJoinedAtThePush) > 0)
      && ARMS.every((armK) => tot(armK, (r) => r.ledgerDecisionsHeld) > 0),
    note: '⭐⭐ canon, VERBATIM: "an event attribution reads the engine\'s own record when one '
      + 'exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only '
      + 'where no record exists, and says so". THE ENGINE\'S OWN RECORDS THIS EXAM READS: the '
      + 'RUN CLASS off the WINNER\'S OWN `why` in `p.action.scores[0]` (the seventh literal '
      + 'included); the CANDIDATE SCORE off the same record (the `runMul` back-out); the aim '
      + 'off `pendingPass`; the completion off `lastCompletedPass`; the shot off a NEW '
      + '`shotLog` row joined to `pendingShot.shooterGid` through its own `logIndex`, WITH THE '
      + 'GID BANKED AT THE PUSH (debt (b)); the goal off that row\'s outcome flip; the through '
      + 'ball off `stats.throughBalls`; the wall FIRE off `passer.wallRun`\'s own transition; '
      + 'the RETURN off `stats.oneTwos`; the overlap ARRIVAL off `stats.overlaps`; the '
      + 'possession off `stats.possessionTime`; ⭐⭐⭐ THE HELD DECISIONS off '
      + '`pcLatency.ledger.decisionsHeld` itself (debt (a)\'s calibration target). WHERE NO '
      + 'RECORD EXISTS, AND IT SAYS SO: the wall trigger\'s per-conjunct KILL SHARES (a '
      + 'DECLARED reconstruction with a passer→target PROXY distance, calibrated by '
      + '`coupling.wallReconAgreesShare`), the passer\'s wall-return and third-man UPPER '
      + 'BOUNDS, and G8\'s MEAN AIM DISTANCE (the engine keeps no pass-length ledger)',
  },
  gClassesNonVacuous: {
    ok: CLASSES_LIVE,
    note: '⛔ NO FALSE UNIVERSAL. The EMPTY classes are ENUMERATED as stored lists, per arm: '
      + `run classes with a zero count = [${EMPTY_RUN_CLASSES.join(', ') || 'none'}]; episode `
      + `classes with a zero count = [${EMPTY_EP_CLASSES.join(', ') || 'none'}]; state cells `
      + `with a zero count = [${EMPTY_STATE_CLASSES.join(', ') || 'none'}]; arms whose `
      + `\`runMulLic\` limb has NO observation = [${ARMS
        .filter((a) => tot(a, (r) => r.runMulLicN) === 0).join(', ') || 'none'}] (the licensed `
      + 'run is the coach\'s, and on the OWN arms the open-play board is empty BY '
      + 'CONSTRUCTION). The gate asserts '
      + 'LIVENESS on every class a READ or a beside-sentence stands on — R1\'s own denominator, '
      + 'the off-ball population, the `MakeRun` population, the eligible passes, the shot rows, '
      + 'BOTH sides of the downstream pair on EVERY arm; the OWN-RUN EPISODE and the '
      + '`ownRunInBehind` class on every arm carrying `dsOwnRun`; the runner and arriver '
      + 'episodes on the HATS arms (on the OWN arms the open-play board is EMPTY BY '
      + 'CONSTRUCTION, which is the point, and `openPlayBoardEmpty` stores it); and the '
      + '`runMul` observations on EVERY arm (the seat-absent arms are the back-out\'s own '
      + 'noise floor). ⚠ LIVENESS only — never a direction',
  },
  gCodeFactGraph: {
    ok: CODE_FACT_GRAPH_OK,
    note: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not '
      + 'read is derived from the function\'s WHOLE text and from every callee whose return '
      + 'enters the read, each pinned by an anchored text hash — the call graph it was checked '
      + 'over is stored beside the boolean; … the callee list is EXTRACTED from the hashed '
      + `text". THE CORPUS: ${GRAPH_FILES.length} files under \`src/sim\` + \`src/ai\`, `
      + `${SPANS.length} extracted function spans. THE FOUR HASHED ROOTS (\`assignRunners\` · `
      + '`decideOffBall` · `executeAction` — which is where the `MakeRun` case\'s own enclosing '
      + 'span resolves — and `obmOffballPolicy`) are hashed WHOLE with their EXTRACTED callees '
      + `stored beside them; their closure holds ${DESIGNATION_CLOSURE.nodes.length} spans at `
      + `depth ${DESIGNATION_CLOSURE.depth}, uncapped. THE SIX DESIGNATION FIELDS: `
      + `${FIELD_SITES.length} sites enumerated with file, line, text, write/read class and `
      + 'enclosing span, EVERY one resolved and every needle LIVE. ⭐⭐⭐ THE SIX `MakeRun` '
      + `PUSHES CLASSIFIED over the WHOLE ENCLOSING-\`if\` CHAIN: `
      + `${JSON.stringify(PUSH_CLASS_COUNTS)} — exactly ONE \`flagGated\`, and the flag it `
      + `names is \`${FLAG_GATED_PUSHES.map((p) => p.flagNamed).join(', ')}\`. `
      + '`makeRunCandidatesAllHatGuardedOnShippedPath` = '
      + `${makeRunCandidatesAllHatGuardedOnShippedPath}, DERIVED over the `
      + `${SHIPPED_PATH_PUSHES.length} pushes reachable with BOTH DS flags absent. ⭐⭐ THE TWO `
      + `FLAGS' READ FORKS: ${READ_FORKS.length} in \`src/**\` (one \`dsOwnRun\`, two `
      + '`dsHatsOff`), enumerated with file and line and compared FILE-AND-LINE to the SEAM '
      + 'DOC\'s OWN READ-FORK INVENTORY table PARSED out of the markdown, plus its per-file '
      + 'executable-line occurrence counts — EQUAL (a difference is RED), and `a4World.ts` '
      + 'carries neither flag',
  },
  gBite: {
    ok: BITE_OK,
    note: '⭐⭐⭐ G-BITE in the #402 item 2(iii) form: on every battery seed WHERE THE FLAG CAN '
      + 'BITE, the arm and its HATS control have DIFFERENT whole-match signatures. '
      + `${biteRows.map((b) => `${b.arm} ${b.seedsDiffering}/${b.eligibleSeeds}`
        + `${b.exemptSeeds > 0 ? ` (${b.exemptSeeds} exempt)` : ''}`).join(' · ')}. THE SHAPES `
      + 'WHERE NOTHING CAN BITE ARE EXEMPTED AND NAMED: a seed on which the armed arm records '
      + 'ZERO own-run decisions gives `dsOwnRun` no candidate to push (the `dsHatsOff` arms are '
      + 'never exempt — the bypass fires on every open-play coach tick). BESIDE, the SEAT\'s '
      + `own bite: ${seatBiteRows.map((r) => `${ARM_DOSE[r.arm as Arm]} `
        + `${r.seedsDiffering}/${r.eligibleSeeds}`).join(' · ')} vs seat-absent. ⚠ LIVENESS `
      + 'only: a differing signature says the '
      + 'flag fired, never that it helped',
  },
  gRepro: {
    ok: REPRO_OK,
    note: `⭐⭐⭐ G-REPRO-DST1: ${reproDetail.comparedFields.length} fields × `
      + `${reproDetail.rows.length} seeds — `
      + `${reproDetail.rows.every((r) => r.mismatches.length === 0) ? 'ZERO mismatches'
        : `MISMATCHES on ${reproDetail.rows.filter((r) => r.mismatches.length > 0)
          .map((r) => r.seed).join(', ')}`}. ` + reproDetail.note,
  },
  gPullCount: {
    ok: PULLCOUNT_OK,
    note: '⭐⭐⭐ gPullCount (#408 item 5(iv)) — THE OBSERVATION ADDS NO PERCEPT PULL. The seam\'s '
      + 'own pin B6 counter idiom, applied WITHOUT touching `src/`: on a THROWAWAY match in the '
      + 'lockstep pair (never on a battery walk) the MATCH INSTANCE\'s `perceivedSnapshot` is '
      + 'wrapped by a counter that DELEGATES to the real bound method. '
      + `${pullRows.length} spied pairs: the per-match pull count is EQUAL observed vs `
      + 'unobserved on every one, the whole-match SIGNATURES are equal on every one, AND the '
      + 'wrapped observed signature equals the UNWRAPPED lockstep walk\'s (which is what proves '
      + `the wrapper transparent). The counter is LIVE (pulls per match by arm: `
      + `${pullRows.filter((r) => r.seed === LOCKSTEP_SEEDS[0])
        .map((r) => `${r.arm} ${r.pullsObserved}`).join(' · ')}) — a dead counter would prove `
      + 'nothing. ⭐ #408 item 3(iii): G-OFF cannot see an ungated idempotent pull; the COUNTER '
      + 'can, and this is that counter pointed at the INSTRUMENT instead of the seam',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure reads of public '
      + '`Match` / `Team` / `Player` / `Ball` state and of the engine\'s own decision record '
      + '(`p.action.scores`) before and after `m.step(DT)`. ⛔ The seat\'s `runMul` is BACKED '
      + 'OUT of the stored candidate score — the policy is NEVER recomputed and '
      + '`perceivedSnapshot` is NEVER called by this instrument. Proven anyway — the same '
      + 'scratch seed walked OBSERVED and UNOBSERVED yields a BYTE-IDENTICAL whole-match '
      + `signature on all ${lockstepRows.length} arm × out-of-band-scratch walks`,
  },
  gDeterminism: {
    ok: XDET_OK,
    note: '⭐ X-DET, TWICE: each of the two out-of-band scratch seeds is walked TWICE PER ARM, '
      + 'OBSERVED both times, and both the whole-match signature AND this instrument\'s own '
      + `per-seed row bytes are identical on all ${xDetRows.length} pairs`,
  },
  gFingerprintProd: {
    ok: FP_PROD_OK,
    note: '⭐⭐ X-FP-PROD: the production fingerprint is RECOMPUTED IN THIS PROCESS by the '
      + 'shipped recipe (`new League({ seed: 1337 })`, `runHeadless` to generation + 2, sha256 '
      + `of the save JSON) and equals the literal of record ${FP_PROD_PIN}. An exam cannot move `
      + 'it — and this gate proves the tree it ran on did not',
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
      + 'the construction receipt lie inside block 12,555,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is DECLARED `
      + 'in the `seeds` block, and EVERY scratch seed this instrument walks (the sizing smoke '
      + 'band, the world pin, the lockstep pair which the X-DET and gPullCount pairs re-use, '
      + 'and the fixture attribute draw) is out-of-band and STORED there. ⭐ THE RE-WALKS on '
      + '12,554,000–011 are DS-T1\'s OWN CONSUMED BAND and are NOT a consumption — canon, '
      + 'VERBATIM: "verifier '
      + 'scratch walks use the stage\'s own consumed band or the out-of-band scratch range '
      + '(≥ 900,000,000) — never the next virgin block"',
  },
  gSeedDisjoint: {
    ok: walkedSeeds.every((s) => s >= BLOCK_BASE) && ALL_SCRATCH.every((s) => s >= 900_000_000)
      && (IS_OVERRIDE || (walkedSeeds[0] === BLOCK_BASE && RECEIPT_SEED === BLOCK_TOP))
      && CONSUMED_BLOCKS.every((b) => b + 999 < BLOCK_BASE)
      && REPRO_SEEDS.every((s) => s >= 12_554_000 && s <= 12_554_999),
    note: 'SEED-DISJOINT at the frontier of #408 item 9 (next sim ≥ 12,555,000): every battery '
      + 'seed is ≥ 12,555,000 and inside THIS block, disjoint from every consumed block (LN-C0 '
      + '12,544,000–999 · LN-T1 …545 · LN-C1 …546 · LN-C2 …547 · LN-C3 …548 · LN-T1′ …549 · '
      + 'LN-T1′b 12,550,000–999 · GK-C0 12,551,000–999 · GK-T1 12,552,000–999 · DS-C0 '
      + '12,553,000–999 · DS-T1 12,554,000–999), each of which is checked to end BELOW this '
      + 'block\'s base; the G-REPRO-DST1 re-walks lie INSIDE DS-T1\'s own consumed block; '
      + 'ZERO stats consumed',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms. N = min(nRequired, the block's affordance) is `
        + 'the AFFORDANCE; each sizing row states its own `resolvableAtNFrozen` and the '
        + 'REALISED half-width at N is published beside the projection',
  },
  gLoo: {
    ok: LOO_OK,
    note: '⭐ LEAVE-ONE-CLUSTER-OUT, SCOPED to the READ-BEARING rows only — R1 and the NINE '
      + `gating guards, per contrasted arm (${LOO_ROWS.length} rows). Each row stores the `
      + 'maximum single-seed influence share and the number of seeds whose removal would flip '
      + 'the interval\'s resolution in each direction. ⚠ A RECEIPT: it gates no direction',
  },
  gTwoFractions: {
    ok: TWO_FRACTION_PAIRS.every(([a, b]) => FACE_KEYS.includes(a) && FACE_KEYS.includes(b)),
    note: `⭐ TWO FRACTIONS: each of the ${TWO_FRACTION_PAIRS.length} read-bearing quantities `
      + 'is published BOTH per its own denominator AND per match (or per a denominator-stable '
      + 'companion), so no share can hide a moving denominator. The pairs are stored in '
      + '`twoFractionPairs`',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon: "an artifact is written as compact JSON")          */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((armK) => [armK, c.rows[armK]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'deltas', 'r1', 'guards', 'offsides', 'reads',
  'faceBlocks', 'medians', 'bins', 'definitions', 'arms', 'branches', 'runClasses',
  'episodeClasses', 'states', 'conjuncts', 'actions', 'codeFacts', 'doseCopy', 'doseSource',
  'twoFractionPairs', 'worldPin', 'seeds', 'stats', 'anchoredSites', 'fixtures', 'lockstep',
  'determinism', 'fingerprintProd', 'loo', 'bite', 'repro', 'perf', 'sizing', 'perSeedCells',
  'constructionReceipt', 'seamFaces', 'hNumbers', 'pullCount',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'DS-T1b',
    title: '「自己的前插 · 复考」 THE OWN-RUN EXAM RE-RUN — with the RESTRAINT in the player: '
      + 'HATS · HATS + OWN · OWN ALONE × the OBM seat ABSENT / DOSED at RUN-CAUTION (a hand-set '
      + 'PROBE CORNER whose `runScore` row is NOT zero) / DOSED at KITCHEN-SINK (the ceiling '
      + 'probe) on world 13 EMPTY-BOOK — NINE arms of record — with the played form D13 beside '
      + 'in its three seat-absent arms: TWELVE walks per seed. R1 = EXECUTED runs per '
      + 'in-possession open-play tick (the flood face); the band = ten guards; the faces = '
      + 'DS-T1\'s, re-walked with its three debts still paid, PLUS the seam\'s own new faces '
      + '(the restraint distribution, the running-mates distribution, the perceived-owner '
      + 'guard\'s pass floor, the count distribution, the in-flight and restart shares, and the '
      + 'seat\'s `runMul` on a clean limb with its noise floor beside)',
    doc: 'docs/world-model/DS-T1B-OWN-RUN-EXAM-RERUN.md',
    instrument: INSTRUMENT_PATH,
    instrumentSha256: sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
    inheritedInstrument: 'scripts/probes/ds-t1-own-run-exam.ts',
    inheritedStageDoc: 'docs/world-model/DS-T1-OWN-RUN-EXAM.md',
    examFormOfRecord: 'docs/world-model/GK-T1-DIVE-EXAM.md',
    walkerOfRecord: 'docs/world-model/DS-C0-DESIGNATION-CENSUS.md',
    seamUnderExam: 'docs/world-model/DS-T0-OWN-RUN-SEAM.md',
    doseIdiomSource: 'scripts/probes/obm-t1-policy-exam.ts',
    doseCopyFormOfRecord: 'docs/world-model/LN-T1-LANE-EXAM.md',
    authorizedBy: 'COMMANDER RULING #408 item 5',
    kind: 'EXAM — it arms NOTHING in the game and SHIPS NOTHING. The READ SENTENCES are #406 '
      + 'item 5(v)\'s FOUR literals RE-FROZEN VERBATIM by #408 item 5(iii), selected by STORED '
      + 'booleans with the precedence unchanged and "dosed" = RUN-CAUTION; NO VERDICT WORD is '
      + 'printed on any yield, coupling or HYPOTHESIS face — H-DS-2 / H-DS-3 / H-DS-4\'s '
      + 'numbers are PRINTED BESIDE the read and never judged. The commander rules.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. The probe reads public '
      + '`Match` / `Team` / `Player` / `Ball` state and the engine\'s own decision record '
      + 'before and after `match.step(DT)`. THERE IS NO WRAPPER — `gLockstep` proves observed '
      + '≡ unobserved byte for byte PER ARM.',
    theQuestion: 'With the restraint in the player, does the own run hold the coach\'s band '
      + 'without the coach (H-DS-3), what did withdrawing the in-flight run cost (H-DS-4), and '
      + '— with a dose that ACTUALLY prices the run — do the eyes restrain the flood (H-DS-2)? '
      + 'The DF path (M-DF.2): the cap retires by measurement, never by deletion.',
    theDoseCorrection: '⭐⭐ #407 §CORR 6(i): #406 item 5(i) named MARKER-ESCAPE as the dose that '
      + 'would answer H-DS-2 — it CANNOT. Its two MAX weights sit on `planeDepth` / '
      + '`planeWidth` and its `runScore` row is ALL ZEROS, so `obmRunMul ≡ 1` on every walked '
      + 'tick and READ 2 was UNREACHABLE BY CONSTRUCTION. RUN-CAUTION puts the domain MINIMUM '
      + 'on `runScore × targetCongestion` and `runScore × ownMarker`; KITCHEN-SINK puts the '
      + 'whole `runScore` row at MIN. Both are stored with their `runScore` rows so the '
      + 'difference is a stored fact, not a claim.',
    theSeamsNewFacesAreBackedOut: '⭐⭐⭐ `restraint` and `runningMates` are INVERTED out of the '
      + 'engine\'s own recorded candidate score, never recomputed: recomputing them would need '
      + '`match.perceivedSnapshot`, which MUTATES the body\'s perception memory, so the '
      + 'observation would stop being byte-inert and `gLockstep` would be a lie. On a '
      + 'seat-ABSENT arm `obmRunMul` is EXACTLY 1 by construction and the back-out IS the '
      + 'restraint; on a DOSED arm the same number is the PRODUCT `restraint · obmRunMul` and is '
      + 'stored under that name, with the seat\'s own multiplier taken instead from the LICENSED '
      + 'run\'s score, which carries no restraint factor.',
    theThreeDebtsPaid: {
      a: 'THE DECISION-TICK PREDICATE reads `pcLatency`\'s own holds map AFTER `m.step(DT)` at '
        + 'the tick the decide loop used (`this.stepCount` after its own increment). DS-C0\'s '
        + 'PRE-STEP form is recomputed BESIDE it and both are compared to the ENGINE\'S OWN '
        + '`pcLatency.ledger.decisionsHeld` per-tick delta — the receipt is '
        + '`decisionTickCalibration` and the `calib.*` faces.',
      b: 'THE SHOOTER GID is recorded AT THE SHOT\'S PUSH, while `pendingShot` is live, into a '
        + 'per-`logIndex` map; the goal join reads that map at the outcome flip, so '
        + '`ep.goalsPerEpisode.*` and `own.goalsPerEpisode` are no longer VOID. DS-C0\'s own '
        + 'join is published beside as `ep.goalsPerEpisodeDsC0Form.*`.',
      c: `THE EPISODE-TICK BINS run past ONE FULL wallRun LICENCE — ${WALL_LICENCE_TICKS} ticks `
        + `at DT = 1/60, DERIVED from the licence's own ${WALL_WINDOW} s and never typed; the `
        + `top bin's LOWER EDGE is ${EPW_TOP_EDGE} ticks, and its SHARE is stored beside EVERY `
        + 'bin-derived median. Episodes still ACTIVE at full time are COUNTED in '
        + '`ep.activeAtFullTime.*` and `own.episodesActiveAtFullTime`.',
    },
    honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
      + 'the artifact stores that list verbatim or stores none". THIS ARTIFACT STORES NONE. '
      + 'The ONE home is docs/world-model/DS-T1B-OWN-RUN-EXAM-RERUN.md §HONEST LIMITS.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3).',
    startedAt: new Date(t0Wall).toISOString(),
  },
  arms: Object.fromEntries(ARMS.map((a) => [a, {
    label: ARM_LABEL[a], book: ARM_BOOK[a], flagKind: ARM_KIND[a],
    dsOwnRun: ARM_KIND[a] !== 'HATS', dsHatsOff: ARM_KIND[a] === 'OWN',
    obmSeatDosed: ARM_DOSED[a], seatDose: ARM_DOSE[a], controlArm: CONTROL_OF[a],
    isArmOfRecord: a === ARM_OF_RECORD,
    isDosedArmOfRecordForTheReads: a === DOSED_ARM_OF_RECORD,
    isCeilingProbe: a === CEILING_ARM,
    obmRunMulKnownToBeExactlyOne: !ARM_DOSED[a],
  }])),
  seamFaces: SEAM_FACES,
  hNumbers: H_NUMBERS,
  pullCount: { ok: PULLCOUNT_OK, counterIsLive: PULL_COUNTER_LIVE, rows: pullRows,
    what: '⭐⭐⭐ gPullCount\'s own rows — the per-match `perceivedSnapshot` pull count and the '
      + 'whole-match signature, OBSERVED vs UNOBSERVED, on a throwaway match per arm at the two '
      + 'out-of-band lockstep scratch seeds, plus the UNWRAPPED lockstep signature beside each '
      + 'row (the wrapper\'s own transparency receipt).' },
  branches: {
    vocabulary: BRANCHES,
    precedence: 'cornerCrashHeld (which is itself `!liveCorner`) > liveCorner > crossFlight > '
      + 'openPlay — THE SOURCE\'S OWN ORDER, frozen before any battery seed.',
  },
  runClasses: {
    vocabulary: RUN_CLASSES,
    mirrorVocabulary: HAT_CLASSES,
    read: '⭐⭐ READ OFF THE ENGINE\'S OWN DECISION RECORD — the WINNER\'S `why` in '
      + '`p.action.scores[0]`. The SEVEN literals are EXTRACTED from their own anchored source '
      + 'lines, never typed. ⭐⭐⭐ `ownRunInBehind` is ITS OWN CLASS here (#406 item 5(iv)); '
      + 'DS-C0\'s EIGHT-cell MIRROR classifier is kept beside it byte for byte (the own run '
      + 'lands in its OTHER) so G-REPRO-DSC0 can compare field for field.',
    literals: {
      licensedRunInBehind: WHY_LICENSED, arrivingLate: WHY_ARRIVING, attackingTheBox: WHY_BOX,
      oneTwoBurst: WHY_BURST, overlapping: WHY_OVERLAP, keeperUp: WHY_KEEPERUP,
      ownRunInBehind: WHY_OWN, cutbackPrefix: CUTBACK_PREFIX,
    },
  },
  episodeClasses: {
    vocabulary: EP_CLASSES,
    hatEpisode: '⭐⭐ A HAT EPISODE is one body\'s designation of one class from its SET tick to '
      + 'its CLEAR tick, read off the field\'s OWN transitions at the END of each stepped tick '
      + '(DS-C0\'s definition, unchanged).',
    ownRunEpisode: '⭐⭐⭐ AN OWN-RUN EPISODE is one body\'s CONSECUTIVE `MakeRun` ticks whose '
      + 'winning `why` is the SEVENTH LITERAL, read off the engine\'s own decision record at '
      + 'the same cadence. SET and CLEAR are fixture-pinned.',
    yieldWindowSeconds: YIELD_WINDOW_SECONDS,
    binCeiling: { licenceSeconds: WALL_WINDOW, licenceTicks: WALL_LICENCE_TICKS,
      binWidth: EPW_BIN, bins: EPW_BINS, topBinLowerEdgeTicks: EPW_TOP_EDGE },
  },
  states: {
    vocabulary: STATES,
    definition: '⭐⭐ THE STATE AT THE DECISION TICK, read PRE-STEP off the engine\'s own state '
      + 'in the classifier\'s own order: a MATE owns the ball · the ball is in flight '
      + '(`ball.owner === null`) with `phase === \'playing\'` and possession his side · his '
      + 'side\'s OWN restart (`phase === \'restart\'` and `restart.side === his side`) · '
      + 'everything else, COUNTED as `other`. The seam doc §HONESTY 8 names the first three.',
  },
  conjuncts: {
    vocabulary: CONJUNCTS,
    proxy: '⚠ `shortDistanceProxy` uses the passer→TARGET distance; the engine uses the '
      + 'passer→LED-POINT distance. `coupling.wallReconAgreesShare` publishes how often the '
      + 'whole reconstruction agrees with the engine\'s OWN fire.',
  },
  actions: ACTION_CELLS,
  twoFractionPairs: TWO_FRACTION_PAIRS,
  definitions: {
    r1: '⭐⭐⭐ R1 — EXECUTED runs per IN-POSSESSION OPEN-PLAY TEAM-TICK. Per team, per STEPPED '
      + 'tick: `match.possessionSide === team.side` · `match.phase === \'playing\'` · the '
      + 'team carries NO live `cornerCrash` and NO live `crossFlight` (both read off the '
      + 'engine\'s own held-licence clocks, `simTime < until`, at the end of the tick). THE '
      + 'COUNT is of OUTFIELD BODIES (not the keeper, not sent off) whose `p.action.type` is '
      + '`MakeRun` — THE BODIES, not the board.',
    floods: '⭐⭐⭐ `floods(arm)` = the paired Δ of R1\'s MEAN vs the HATS arm AT THE SAME SEAT '
      + 'STATE is RESOLVED (the 95 % cluster-bootstrap interval excludes zero) AND UP AND '
      + 'beyond the tolerance NI_FRACTION · |control mean|.',
    holdsBand: '⭐⭐⭐ `holdsBand(arm)` = NO BREACH among G1–G9. A BREACH is a paired Δ that is '
      + 'RESOLVED AND beyond the tolerance IN THE HARMFUL DIRECTION. G10 (offsides) is the '
      + '#157 FLAG limb: it flags and gates NOTHING.',
    theDecisionTick: '⭐⭐⭐ `if (p.decisionTimer <= 0 && !pcHeld)` (anchored). `decisionTimer` is '
      + 'decremented inside `physicsStep`, AFTER the decide loop, so the PRE-STEP value is the '
      + 'one the guard tests. `pcHeld` is `holdFor(gid, this.stepCount)` with `stepCount` '
      + 'ALREADY incremented — i.e. the POST-STEP `simTick`. DEBT (a) reads the holds map at '
      + 'exactly that tick, AFTER the step; DS-C0\'s PRE-STEP read is recomputed beside it and '
      + 'both are calibrated against the engine\'s own `ledger.decisionsHeld` delta.',
    theCoachTick: '`team.brainTimer -= dt; if (team.brainTimer <= 0)` at the HEAD of the step, '
      + 'so the PRE-STEP timer minus DT is the engine\'s own arithmetic.',
    populationA: 'EVERY `assignRunners` EXECUTION PER TEAM WHILE `possessionSide === '
      + 'team.side` — DS-C0\'s own population, re-walked byte for byte.',
    populationB: 'EVERY ATTACKING OFF-BALL DECISION TICK — own side in possession (pre-step) · '
      + 'not the carrier · not the keeper · not sent off · a decision taken this tick under '
      + 'the POST-STEP holds form. The attacking KEEPER\'s decision ticks are counted '
      + 'SEPARATELY so the keeper-up class is non-vacuous.',
    populationC: 'THE HAT EPISODES and the OWN-RUN EPISODES and their yield, off the engine\'s '
      + 'ledgers (see `episodeClasses` and `gLedgerRead`).',
    theDosePlacement: '⛔ canon (dose placement): the MARKER-ESCAPE matrix rides on the '
      + 'MATCH-LOCAL `baseGenome` and `effGenome` ONLY, both DE-ALIASED first with the '
      + 'engine\'s own idiom (`{ ...team.baseGenome, … }`, `setCbProneness`\'s shape) because '
      + 'the three views are the SAME OBJECT until something replaces them. `info.genome` is '
      + 'asserted CLEAN on every walked match by `gWorld`. The D13 arms take the L3 / PC doses '
      + 'through the SHIPPED LOADERS exactly as DS-C0\'s D13 arm did.',
    theRestraintBackOut: '⭐⭐⭐ DS-T0b\'s amended arithmetic is `s = ((W.runScore · prior) · '
      + 'restraint) · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul` (§LAW-B, anchored), with '
      + '`obmRunMul` LAST, so the STORED SCORE over `W.runScore · prior · tiredMul` is EXACTLY '
      + '`restraint · obmRunMul`. On a seat-ABSENT arm that product IS the restraint (the seat '
      + 'is absent ⇒ `obmRunMul` is EXACTLY 1) and `runningMates = (1 − restraint) · count` '
      + 'inverts the law\'s own expression wherever the restraint is ABOVE zero; at exactly '
      + 'zero the `clamp01` lower arm has bitten and all the law says is `runningMates ≥ count`, '
      + 'so the observation is CENSORED and counted as such. ⚠ Only a candidate that reached '
      + 'the record\'s TOP FOUR is readable, so every share over this population is a FLOOR on '
      + 'the pushed population.',
    theGuardPopulation: '⭐⭐ THE BLOCK\'S OWN NOT-HATTED GUARD, RECONSTRUCTED IN TWO FORMS (the '
      + 'hat board and the wall licence\'s clock read PRE-STEP and read AFTER the step). The '
      + 'coach tick that writes the board runs at the HEAD of the step, BEFORE the decide loop, '
      + 'so the POST-STEP form is the denominator OF RECORD; the PRE-STEP form is published '
      + 'beside it, and the number of visible own candidates whose tick FAILS the post-step '
      + 'reconstruction is stored as its own field (the engine pushed them, so its own guard '
      + 'passed — anything there is reconstruction slack).',
    theTwoDoses: '⭐⭐⭐ RUN-CAUTION = `matrix([O_RUN, F3, MIN], [O_RUN, F2, MIN])` — a HAND-SET '
      + 'PROBE CORNER, DECLARED as one and NOT a dose of record; KITCHEN-SINK = OBM-T1\'s '
      + 'CEILING PROBE, byte-copied. Both carry a NON-ZERO `runScore` row, which is exactly '
      + 'what MARKER-ESCAPE lacked (#407 item 3).',
    theRunMulBackOut: '⭐⭐ THE SEAT\'S `runMul` is BACKED OUT of the engine\'s own decision '
      + 'record, never recomputed: `s = W.runScore · prior · (tired ? OFFBALL_TIRED_MUL : 1) · '
      + 'obmRunMul` for the OWN run (prior = 1 for the LICENSED run), with `obmRunMul` applied '
      + 'LAST at both sites (anchored), so the multiplier is the STORED SCORE over the rest. '
      + '⚠ Only a run candidate that reached the record\'s TOP FOUR is readable, and the share '
      + 'backed out of each source is published (`runMul.fromOwnRunShare`).',
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold: no read word and no stored boolean depends on one.',
      r1: { bins: R1_BINS, floodAtLeast: R1_FLOOD_AT },
      runnerCountBins: RUN_COUNT_BINS,
      episodeTicksDsC0: { width: EP_TICK_BIN, bins: EP_TICK_BINS },
      episodeTicksWide: { width: EPW_BIN, bins: EPW_BINS, topBinLowerEdge: EPW_TOP_EDGE },
      runMul: { lo: RUNMUL_LO, hi: RUNMUL_HI, bins: RUNMUL_BINS, width: RUNMUL_W,
        rangeIsDerivedFrom: 'OBM_SCORE_SPAN = 1 − OFFBALL_TIRED_MUL' },
    },
    engineConstants: {
      DT, HALF_L, AI_INTERVAL, TEAM_AI_INTERVAL, OFFBALL_TIRED_MUL, OBM_SCORE_SPAN,
      roleWeights: { GK: ROLE_W_GK, DF: ROLE_W_DF, MF: ROLE_W_MF, WG: ROLE_W_WG, ST: ROLE_W_ST },
      runDepthDiv: RUN_DEPTH_DIV, runPriorMax: RUN_PRIOR_MAX,
      tired: { staminaBelow: TIRED_STAMINA, conservationAbove: TIRED_CONSERVATION },
      tempoGate: TEMPO_HIGH, urgencyGate: URGENCY_HIGH,
      countHigh: COUNT_HIGH, countBase: COUNT_BASE,
      arriverDepthFromHalfL: ARRIVER_DEPTH, arriverWide: ARRIVER_WIDE,
      overlapGate: OVERLAP_GATE, confrontedRadius: CONFRONT_R,
      wall: { d: WALL_D, pressure: WALL_PRESSURE, stamina: WALL_STAMINA, half: WALL_HALF,
        geneGate: WALL_GENE, geneDivisor: WALL_GENE_DIV, windowSeconds: WALL_WINDOW,
        licenceTicks: WALL_LICENCE_TICKS },
      crowd: { dupRunM: DUP_RUN_M, sampleEvery: SAMPLE_EVERY, pairSubsample: PAIR_SUBSAMPLE,
        closePairM: CLOSE_PAIR_M },
      niFraction: NI_FRACTION, niFractionSecondSource: NI_FRACTION_SECOND_SOURCE,
      yieldWindowSeconds: YIELD_WINDOW_SECONDS,
      obmWeightSlots: OBM_WEIGHT_SLOTS, obmWeightMin: OBM_WEIGHT_MIN,
      obmWeightMax: OBM_WEIGHT_MAX,
    },
  },
  codeFacts: {
    what: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not '
      + 'read is derived from the function\'s WHOLE text and from every callee whose return '
      + 'enters the read, each pinned by an anchored text hash — the call graph it was checked '
      + 'over is stored beside the boolean; … the callee list is EXTRACTED from the hashed '
      + 'text — every identifier called within the span, resolved to its definition and hashed '
      + '— never typed".',
    corpus: { dirs: GRAPH_DIRS, files: GRAPH_FILES.length, spans: SPANS.length },
    hashedRoots: HASHED_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
    rootGraph: ROOT_GRAPH,
    rootsComplete: ROOTS_COMPLETE,
    designationClosure: {
      nodes: DESIGNATION_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      depth: DESIGNATION_CLOSURE.depth, capped: DESIGNATION_CLOSURE.capped,
      externals: DESIGNATION_CLOSURE.externals,
    },
    makeRunCaseEnclosingSpan: MAKERUN_CASE_ENCLOSING === null ? null
      : spanKey(MAKERUN_CASE_ENCLOSING),
    makeRunCaseIsInExecuteAction: MAKERUN_CASE_IN_EXECUTE_ACTION,
    fieldNeedles: FIELD_NEEDLES.map((n) => ({ key: n.key, re: n.re.source })),
    fieldCounts: FIELD_COUNTS,
    fieldSites: FIELD_SITES,
    everyFieldSiteResolved: EVERY_FIELD_SITE_RESOLVED,
    everyFieldNeedleLive: EVERY_FIELD_NEEDLE_LIVE,
    pushClassifier: '⭐⭐⭐ the WHOLE ENCLOSING-`if` CHAIN up to the function head (DS-C0 took '
      + 'the NEAREST guard only, which is why its extractor would read the seam\'s push as '
      + 'unguarded — #406 item 3(iii), declared in advance). `flagGated` wins over `hatGuarded` '
      + 'over `keeperUpGuarded`; anything else is `unguarded`.',
    makeRunPushes: MAKERUN_PUSHES,
    pushClassCounts: PUSH_CLASS_COUNTS,
    flagGatedPushes: FLAG_GATED_PUSHES.map((p) => ({ file: p.file, line: p.line,
      flag: p.flagNamed, guardChain: p.guardChain })),
    shippedPathPushes: SHIPPED_PATH_PUSHES.map((p) => ({ file: p.file, line: p.line,
      pushClass: p.pushClass })),
    makeRunCandidatesAllHatGuardedOnShippedPath,
    readForks: READ_FORKS,
    flagOccurrenceCountsPerFile: FLAG_COUNTS,
    seamDocReadForkInventory: DOC_READ_FORKS,
    seamDocFlagCounts: DOC_FLAG_COUNTS,
    forkInventoryAgrees: FORK_INVENTORY_AGREES,
    flagCountsAgree: FLAG_COUNTS_AGREE,
    a4WorldCleanOfBothFlags: A4_CLEAN_OF_FLAGS,
    runnerCount: {
      what: '⭐⭐⭐ THE CODE-MOVED COUNT (DS-T0b M-DS.6(a)): the function hashed WHOLE, BOTH call '
        + 'sites hashed (their own line text and the span each sits in), and the per-file call '
        + 'census proving the expression exists in EXACTLY TWO files of `src/**`.',
      span: SPAN_RUNNER_COUNT === null ? null : spanKey(SPAN_RUNNER_COUNT),
      sha: SPAN_RUNNER_COUNT === null ? null : SPAN_RUNNER_COUNT.sha,
      callSites: RUNNER_COUNT_CALL_SITES,
      occurrencesPerFile: RUNNER_COUNT_OCCURRENCES,
      factsOk: RUNNER_COUNT_FACTS_OK,
    },
    ownRunBlock: {
      what: '⭐⭐⭐ THE OWN-RUN BLOCK\'S `match`-MEMBER SET, extracted from the block\'s WHOLE '
        + 'TEXT and compared to the seam doc\'s own READ-SET sentence PARSED out of the '
        + 'markdown (§LAW-B 4 / §PINS-B 5). EQUAL or RED.',
      startLine: OWN_BLOCK === null ? -1 : OWN_BLOCK.startLine,
      endLine: OWN_BLOCK === null ? -1 : OWN_BLOCK.endLine,
      sha: OWN_BLOCK === null ? null : OWN_BLOCK.sha,
      matchMembers: OWN_BLOCK === null ? [] : OWN_BLOCK.members,
      seamDocReadSet: DOC_READ_SET, agree: BLOCK_MEMBERS_AGREE,
    },
    seamDocUpdatedInventory: DOC_SEAM_B_SITES,
    seamDocPullOccurrenceClaim: DOC_PULL_COUNT,
    pullOccurrencesMeasuredInPlayerBrain: PULL_SITES_IN_BRAIN,
    forkLinesMeasured: FORK_LINES_MEASURED,
    forkLinesInTheSeamDocsOLDERTable: FORK_LINES_IN_DOC,
    forkLineNumbersAgree: FORK_LINE_NUMBERS_AGREE,
    forkLineNumbersNote: '⚠ DECLARED, NOT GATED: §SEAM\'s table pins file:line and its LINES '
      + 'went STALE when DS-T0b code-moved the count; §SEAM-B\'s UPDATED inventory (the one '
      + '#408 item 5 names) carries no line numbers, so the gate compares SITE TEXT + FILE + '
      + 'CLASS + COUNT and both line lists are stored here.',
    obmSeat: {
      file: EYES_PATH, roots: OBM_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureNodes: OBM_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureDepth: OBM_CLOSURE.depth, closureCapped: OBM_CLOSURE.capped,
      designationHitsInClosure: OBM_HITS, obmSeatReadsNoDesignation,
      featureKeys: [...OBM_FEATURE_KEYS], outputKeys: [...OBM_OUTPUT_KEYS],
    },
  },
  doseCopy: {
    what: '⭐⭐⭐ G-DOSE-COPY (LN-T1\'s form), on BOTH matrices: KITCHEN-SINK BYTE-COPIED from '
      + 'OBM-T1\'s own lines and RUN-CAUTION HAND-SET in that file\'s own `matrix(...)` idiom '
      + '(DECLARED a PROBE CORNER, not a dose of record — the dose space is selection\'s, #390), '
      + 'each re-derived slot for slot by a SECOND, independently shaped derivation off the '
      + '`OBM_*` exports.',
    source: OBMT1_PATH, ok: DOSE_COPY_OK,
    slotConvention: 'IDX(output, feature) = output · OBM_FEATURE_KEYS.length + feature',
    featureKeys: [...OBM_FEATURE_KEYS], outputKeys: [...OBM_OUTPUT_KEYS],
    domain: { min: OBM_WEIGHT_MIN, max: OBM_WEIGHT_MAX, slots: OBM_WEIGHT_SLOTS },
    rows: DOSE_COPY_ROWS,
    theStruckDoseForComparison: {
      name: 'MARKER-ESCAPE (DS-T1\'s dose; #407 §CORR 6(i) struck it for H-DS-2)',
      matrix: matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX]),
      runScoreRow: runRowOf(matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX])),
    },
    placement: 'baseGenome + effGenome of BOTH teams, DE-ALIASED first; NEVER `info.genome`',
  },
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: D13_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK },
  anchoredSites: ANCHORS, fixtures: FIXTURES, lockstep: lockstepRows, determinism: xDetRows,
  fingerprintProd: { pinned: FP_PROD_PIN, computed: FP_PROD_GOT, ok: FP_PROD_OK,
    recipe: 'new League({ seed: 1337 }) → runHeadless to generation + 2 → sha256 of the save '
      + 'JSON (the shipped `scripts/fingerprint.ts` recipe, recomputed in-process)',
    matches: fpOut.matches },
  loo: LOO_ROWS,
  bite: { rows: biteRows, seatBite: seatBiteRows, ok: BITE_OK },
  repro: reproDetail,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-cluster SCRATCH SMOKE (seeds 900,006,600–611, TWELVE '
      + 'walks per seed), DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a '
      + 'NOISY variance estimate. N_FROZEN takes the BLOCK\'S AFFORDANCE after the construction '
      + 'receipt at 12,555,999.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
    realised: REALISED_HALF_WIDTHS,
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    xDetScratchSeedsWalked: XDET_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    fixtureScratchSeed: FIXTURE_SEED,
    reWalkSeedsNotAConsumption: REPRO_SEEDS,
    consumedBlocksOfRecord: CONSUMED_BLOCKS,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 84 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / Math.max(1, cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, the per-tick '
      + 'observation included — never the game\'s frame cost.',
  },
  medians: {
    note: '⭐⭐⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, and DEBT (c) requires its TOP BIN\'S '
      + 'SHARE beside it — both are stored, so `gFaces` re-derives each pair off the SERIALIZED '
      + 'artifact. The wide bins\' top edge lies BEYOND one full wallRun licence; DS-C0\'s own '
      + 'narrow bins are published beside as `…DsC0Bins` so the FLOOR relabelling of #405 item '
      + '1 can be seen for what it was.',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((armK) => [armK, {
    r1Bins: { bins: R1_BINS, pooled: pooled[armK].r1Bins },
    r1RunnersByRole: { vocabulary: ROLES4, pooled: pooled[armK].r1RunnersByRole },
    branchTicks: { vocabulary: BRANCHES, pooled: pooled[armK].branchTicks },
    runCountBins: { bins: RUN_COUNT_BINS, pooled: pooled[armK].runCountBins },
    runnersByRole: { vocabulary: ROLES4, pooled: pooled[armK].runnersByRole },
    offBallActionTicksPost: { vocabulary: ACTION_CELLS,
      pooled: pooled[armK].offBallActionTicksPost },
    runClassTicks: { vocabulary: RUN_CLASSES, pooled: pooled[armK].runClassTicks },
    keeperRunClassTicks: { vocabulary: RUN_CLASSES, pooled: pooled[armK].keeperRunClassTicks },
    hatClassTicks: { vocabulary: HAT_CLASSES, pooled: pooled[armK].hatClassTicks },
    epSets: { vocabulary: EP_CLASSES, pooled: pooled[armK].epSets },
    episodeTicksDsC0: { vocabulary: EP_CLASSES, width: EP_TICK_BIN, bins: EP_TICK_BINS,
      pooled: pooled[armK].epTickBins },
    episodeTicksWide: { vocabulary: EP_CLASSES, width: EPW_BIN, bins: EPW_BINS,
      pooled: pooled[armK].epTickBinsWide },
    ownRunEpisodeTicks: { width: EPW_BIN, bins: EPW_BINS, pooled: pooled[armK].ownEpTickBins },
    runMulBins: { lo: RUNMUL_LO, width: RUNMUL_W, bins: RUNMUL_BINS,
      pooled: pooled[armK].runMulBinsArr },
    restraintBins: { lo: 0, width: UNIT_W, bins: UNIT_BINS,
      pooled: pooled[armK].restraintBins },
    runningMatesBins: { lo: 0, width: RM_W, bins: RM_BINS, hi: RM_HI,
      pooled: pooled[armK].rmBins },
    ownBackOutBins: { lo: 0, width: OWNB_W, bins: OWNB_BINS, hi: OWNB_HI,
      pooled: pooled[armK].ownBackOutBins },
    runMulLicBins: { lo: RUNMUL_LO, width: RUNMUL_W, bins: RUNMUL_BINS,
      pooled: pooled[armK].runMulLicBins },
    countBins: { vocabulary: [1, 2, 3], pooled: pooled[armK].countBins },
    stateRunDecisions: { kinds: RUNKINDS, states: STATES,
      pooled: pooled[armK].stateRunDecisions },
    stateAllDecisions: { vocabulary: STATES, pooled: pooled[armK].stateAllDecisions },
    wallConjunctKills: { vocabulary: CONJUNCTS, pooled: pooled[armK].wallConjunctKills },
  }])),
  r1: {
    what: '⭐⭐⭐ R1 — THE FLOOD FACE, per arm, with the paired Δ vs the HATS arm at the SAME '
      + 'seat state and BOTH FRACTIONS.',
    key: R1_KEY, rows: FLOOD_ROWS,
    levels: Object.fromEntries(ARMS.map((a) => [a, {
      mean: face(R1_KEY, a).value,
      numerator: face(R1_KEY, a).numerator, denominator: face(R1_KEY, a).denominator,
      ci: [face(R1_KEY, a).ciLo, face(R1_KEY, a).ciHi],
      shareAtLeastThree: face('r1.floodShareAtLeastThree', a).value,
      teamTicksPerMatch: face('r1.teamTicksPerMatch', a).value,
      runnerTicksPerMatch: face('r1.runnerTicksPerMatch', a).value,
      bins: Array.from({ length: R1_BINS }, (_, k) =>
        face(`r1.binShare.${k === R1_BINS - 1 ? `${k}plus` : k}`, a).value),
    }])),
  },
  guards: {
    what: '⭐⭐⭐ THE BAND (F-DS-b). tolerance = ' + TOLERANCE_FORM
      + ' BREACH = RESOLVED AND beyond tolerance IN THE HARMFUL DIRECTION.',
    limbs: GUARD_LIMBS, table: GUARD_TABLE,
    holdsBand: Object.fromEntries(CONTRAST_ARMS.map((a) => [a, holdsBand(a)])),
    breachingGuards: Object.fromEntries(CONTRAST_ARMS.map((a) => [a, breachingGuards(a)])),
  },
  offsides: {
    what: '⭐ G10 in the #157 FLAG form — a RESOLVED INCREASE raises a flag and flips NO gate.',
    rows: OFFSIDE_ROWS,
  },
  faceBlocks: {
    openPlayBoard: OPEN_PLAY_BOARD,
    yieldPairs: YIELD_PAIRS,
    coupling: COUPLING,
    perState: PER_STATE,
    crowding: Object.fromEntries(ARMS.map((a) => [a, {
      crashShare: face('crowd.crashShare', a).value,
      crashHits: face('crowd.crashShare', a).numerator,
      crowdSamples: face('crowd.crashShare', a).denominator,
      spacingUnder4: face('guard.spacingUnder4', a).value,
      spacingUnder4Pooled: face('guard.spacingUnder4Pooled', a).value,
    }])),
    runMul: Object.fromEntries(ARMS.map((a) => [a, {
      mean: face('runMul.mean', a).value,
      observations: face('runMul.mean', a).denominator,
      belowOneShare: face('runMul.belowOneShare', a).value,
      aboveOneShare: face('runMul.aboveOneShare', a).value,
      atOneShare: face('runMul.atOneShare', a).value,
      fromOwnRunShare: face('runMul.fromOwnRunShare', a).value,
      bins: Array.from({ length: RUNMUL_BINS }, (_, k) => face(`runMul.binShare.${k}`, a).value),
      binLo: RUNMUL_LO, binWidth: RUNMUL_W,
    }])),
    decisionTickCalibration: Object.fromEntries(ARMS.map((a) => [a, {
      postStepHeldPerMatch: face('calib.heldBodyTicksPostPerMatch', a).value,
      preStepHeldPerMatch: face('calib.heldBodyTicksPrePerMatch', a).value,
      ledgerHeldPerMatch: face('calib.ledgerDecisionsHeldPerMatch', a).value,
      postStepOverLedger: face('calib.postStepOverLedger', a).value,
      preStepOverLedger: face('calib.preStepOverLedger', a).value,
      decidedPostPerMatch: face('calib.decidedBodyTicksPostPerMatch', a).value,
      decidedPrePerMatch: face('calib.decidedBodyTicksPrePerMatch', a).value,
      offBallDecisionTicksPerMatch: face('offBall.decisionTicksPerMatch', a).value,
      offBallDecisionTicksPerMatchPreStepForm:
        face('offBall.decisionTicksPerMatchPreStepForm', a).value,
    }])),
  },
  reads: {
    note: '⭐⭐⭐ #406 item 5(v)\'s SENTENCES are FROZEN LITERALS. The SELECTORS are STORED '
      + 'BOOLEANS — `floods(arm)` and `holdsBand(arm)` — evaluated on the OWN arms on E13 by '
      + 'the frozen rule, in the ruling\'s own order. The ARM OF RECORD is OWN-seat-absent on '
      + 'E13; the DOSED OWN arm answers H-DS-1/H-DS-2; D13\'s word is computed by the SAME rule '
      + 'and stored beside as an AGREE boolean. ⛔ The breached guards are printed on their OWN '
      + 'annotation line, never spliced into a frozen literal, and NO VERDICT WORD appears on '
      + 'any yield or coupling face.',
    sentences: READ_LITERALS,
    armOfRecord: ARM_OF_RECORD,
    selected: READ_WORD, sentence: READ_SENTENCE,
    selectors: SELECTORS,
    annotations: [
      `floods(OWN, seat absent) = ${floods(ARM_OF_RECORD)} · holdsBand(OWN, seat absent) = `
      + `${holdsBand(ARM_OF_RECORD)} · floods(OWN, dosed = RUN-CAUTION) = `
      + `${floods(DOSED_ARM_OF_RECORD)} · holdsBand(OWN, dosed = RUN-CAUTION) = `
      + `${holdsBand(DOSED_ARM_OF_RECORD)}`,
      `the breached guard(s): ${BREACH_NAMED === '' ? 'none' : BREACH_NAMED}`,
      `the open-play board on the arm of record: openPlayBoardEmpty = `
      + `${OPEN_PLAY_BOARD[ARM_OF_RECORD].openPlayBoardEmpty}`,
      `H-DS-3 (printed, not judged) — R1's paired Δ on OWN vs HATS, seat absent: `
      + `${H_NUMBERS.hDs3.thisStage.delta} [${H_NUMBERS.hDs3.thisStage.ci[0]}, `
      + `${H_NUMBERS.hDs3.thisStage.ci[1]}]; DS-T1's own field: `
      + `${JSON.stringify((H_NUMBERS.hDs3.dsT1 as { delta?: number } | null)?.delta ?? null)}`,
      `H-DS-4 (printed, not judged) — G9 through balls' paired Δ: `
      + `${H_NUMBERS.hDs4.thisStage.delta} [${H_NUMBERS.hDs4.thisStage.ci[0]}, `
      + `${H_NUMBERS.hDs4.thisStage.ci[1]}]; DS-T1's own field: `
      + `${JSON.stringify((H_NUMBERS.hDs4.dsT1 as { delta?: number } | null)?.delta ?? null)}`,
      `H-DS-2 (printed, not judged) — R1's paired Δ seat absent ${H_NUMBERS.hDs2.seatAbsent
        .delta} · at RUN-CAUTION ${H_NUMBERS.hDs2.runCaution.delta} · at KITCHEN-SINK `
      + `${H_NUMBERS.hDs2.kitchenSink.delta}`,
      `the restraint on the arm of record: mean ${SEAM_FACES[ARM_OF_RECORD].restraint.mean} · `
      + `exactly 0 ${SEAM_FACES[ARM_OF_RECORD].restraint.exactlyZeroShare} · exactly 1 `
      + `${SEAM_FACES[ARM_OF_RECORD].restraint.exactlyOneShare}`,
    ],
    breachNamed: BREACH_NAMED,
    counterfactuals: {
      note: '⭐⭐ canon, VERBATIM: "a counterfactual verdict sentence (\'had X been scored, the '
        + 'rule would read W\') quotes a word the instrument STORED by applying the frozen rule '
        + 'to X\'s stored interval".',
      dosedOwnAsIfArmOfRecord: {
        arm: DOSED_ARM_OF_RECORD,
        word: READ_WORD_IF_DOSED_WERE_OF_RECORD,
        sentence: READ_LITERALS[READ_WORD_IF_DOSED_WERE_OF_RECORD],
        floods: floods(DOSED_ARM_OF_RECORD), holdsBand: holdsBand(DOSED_ARM_OF_RECORD),
      },
      kitchenSinkOwnAsIfArmOfRecord: {
        arm: CEILING_ARM,
        word: READ_WORD_IF_CEILING_WERE_OF_RECORD,
        sentence: READ_LITERALS[READ_WORD_IF_CEILING_WERE_OF_RECORD],
        floods: floods(CEILING_ARM), holdsBand: holdsBand(CEILING_ARM),
      },
      d13OwnAsIfArmOfRecord: {
        arm: 'OWN-D13',
        word: READ_WORD_D13, sentence: READ_LITERALS[READ_WORD_D13],
        floods: floods('OWN-D13'), holdsBand: holdsBand('OWN-D13'),
      },
    },
    dosedArmOfRecord: DOSED_ARM_OF_RECORD,
    ceilingArm: CEILING_ARM,
    d13Agrees: D13_AGREES,
    d13AgreementWordPrinted: D13_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees,
    agreementSentences: AGREE_SENTENCE,
    besideTheRead: {
      hatsPlusOwnWords: HATSOWN_WORDS,
      yieldPair: YIELD_PAIRS[ARM_OF_RECORD],
      coupling: COUPLING[ARM_OF_RECORD],
      perState: PER_STATE[ARM_OF_RECORD],
      hypothesisNumbersPointer: 'hNumbers (H-DS-3 · H-DS-4 · H-DS-2, printed never judged)',
      seamFacesPointer: `seamFaces['${ARM_OF_RECORD}']`,
    },
    emptyRunClasses: EMPTY_RUN_CLASSES,
    emptyEpisodeClasses: EMPTY_EP_CLASSES,
    emptyStateClasses: EMPTY_STATE_CLASSES,
  },
  faces, deltas,
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
  r1: { rows: Record<Arm, { delta: number; toleranceAbs: number; floods: boolean;
    resolved: boolean; up: boolean; beyondTolerance: boolean }> };
  guards: { table: Record<Arm, { key: string; direction: GuardDir; controlLevel: number;
    toleranceAbs: number; delta: number; resolved: boolean; beyondTolerance: boolean;
    breach: boolean }[]>; holdsBand: Record<Arm, boolean> };
  sizing: { rows: typeof sizingRows };
};
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
  const r = disk.perSeedCells.map((c) => c[dd.controlArm]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.armValue) && sameNum(pr, dd.controlValue) && sameNum(pl - pr, dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const got = poolFrom(rows) as unknown as Record<string, number[]>;
  const b = disk.bins[armK];
  const cmp = (key: string, want: unknown): void => {
    binChecks.push({ bin: `${armK}.${key}`,
      ok: JSON.stringify(want) === JSON.stringify(b[key]?.pooled ?? []) });
  };
  cmp('r1Bins', got.r1Bins);
  cmp('r1RunnersByRole', got.r1RunnersByRole);
  cmp('branchTicks', got.branchTicks);
  cmp('runCountBins', got.runCountBins);
  cmp('runnersByRole', got.runnersByRole);
  cmp('offBallActionTicksPost', got.offBallActionTicksPost);
  cmp('runClassTicks', got.runClassTicks);
  cmp('keeperRunClassTicks', got.keeperRunClassTicks);
  cmp('hatClassTicks', got.hatClassTicks);
  cmp('epSets', got.epSets);
  cmp('episodeTicksDsC0', got.epTickBins);
  cmp('episodeTicksWide', got.epTickBinsWide);
  cmp('ownRunEpisodeTicks', got.ownEpTickBins);
  cmp('runMulBins', got.runMulBinsArr);
  cmp('restraintBins', got.restraintBins);
  cmp('runningMatesBins', got.rmBins);
  cmp('ownBackOutBins', got.ownBackOutBins);
  cmp('runMulLicBins', got.runMulLicBins);
  cmp('countBins', got.countBins);
  cmp('stateRunDecisions', got.stateRunDecisions);
  cmp('stateAllDecisions', got.stateAllDecisions);
  cmp('wallConjunctKills', got.wallConjunctKills);
  binChecks.push({ bin: `${armK}.medians.allBinDerivedWithTopBinShares`,
    ok: JSON.stringify(mediansFrom(got as unknown as Pooled))
      === JSON.stringify(disk.medians.values[armK]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.r1BinsSumToTeamTicks`,
    ok: sum(got.r1Bins) === sum(rows.map((r) => r.r1TeamTicks)) });
  binChecks.push({ bin: `${armK}.partition.branchesSumToInPossessionCoachTicks`,
    ok: sum(got.branchTicks) === sum(rows.map((r) => r.coachTicksInPossession))
      && sum(got.runCountBins) === sum(rows.map((r) => r.coachTicksInPossession)) });
  binChecks.push({ bin: `${armK}.partition.actionsSumToOffBallDecisionTicks`,
    ok: sum(got.offBallActionTicksPost)
      === sum(rows.map((r) => r.offBallDecisionTicksPost)) });
  binChecks.push({ bin: `${armK}.partition.runClassesSumToMakeRunDecisions`,
    ok: sum(got.runClassTicks) === sum(rows.map((r) => r.makeRunTicksPost))
      && sum(got.keeperRunClassTicks) === sum(rows.map((r) => r.runClassTicksKeeper)) });
  binChecks.push({ bin: `${armK}.partition.runMulBinsSumToObservations`,
    ok: sum(got.runMulBinsArr) === sum(rows.map((r) => r.runMulCount)) });
  binChecks.push({ bin: `${armK}.partition.stateDecisionsSumToOffBallTicks`,
    ok: sum(got.stateAllDecisions) === sum(rows.map((r) => r.offBallDecisionTicksPost)) });
  /* ⭐⭐⭐ DS-T1b's OWN PARTITIONS, re-derived off the SERIALIZED rows */
  binChecks.push({ bin: `${armK}.partition.restraintBinsSumToItsObservations`,
    ok: sum(got.restraintBins) === sum(rows.map((r) => r.restraintN)) });
  binChecks.push({ bin: `${armK}.partition.runningMatesBinsSumToItsObservations`,
    ok: sum(got.rmBins) === sum(rows.map((r) => r.rmN)) });
  binChecks.push({ bin: `${armK}.partition.invertibleAndCensoredSumToTheRestraint`,
    ok: sum(rows.map((r) => r.rmN + r.rmCensored)) === sum(rows.map((r) => r.restraintN)) });
  binChecks.push({ bin: `${armK}.partition.ownBackOutBinsSumToItsObservations`,
    ok: sum(got.ownBackOutBins) === sum(rows.map((r) => r.ownBackOutN)) });
  binChecks.push({ bin: `${armK}.partition.runMulLicBinsSumToItsObservations`,
    ok: sum(got.runMulLicBins) === sum(rows.map((r) => r.runMulLicN)) });
  binChecks.push({ bin: `${armK}.partition.countBinsSumToTheVisibleOwnCandidates`,
    ok: sum(got.countBins) === sum(rows.map((r) => r.ownCandidateVisible)) });
  binChecks.push({ bin: `${armK}.partition.theRestraintIsWrittenONLYOnASeatAbsentArm`,
    ok: ARM_DOSED[armK]
      ? sum(rows.map((r) => r.restraintN)) === 0 && sum(rows.map((r) => r.rmN)) === 0
      : sum(rows.map((r) => r.restraintN)) === sum(rows.map((r) => r.ownBackOutN)) });
  binChecks.push({ bin: `${armK}.partition.theExactZeroAndOneSharesSitInsideTheirDenominator`,
    ok: rows.every((r) => r.restraintExactZero + r.restraintExactOne <= r.restraintN
      && r.ownBackOutN <= r.ownCandidateVisible
      && r.ownCandidateVisible - r.ownCandidateOutsidePostGuard <= r.unhattedOffBallTicksPost
      && r.unhattedOffBallTicksPost <= r.offBallDecisionTicksPost
      && r.unhattedOffBallTicksPre <= r.offBallDecisionTicksPost) });
  binChecks.push({ bin: `${armK}.partition.episodeBinsPlusOpenEqualTheirSets`,
    ok: EP_CLASSES.every((c) => sum(got.epTickBinsWide
      .slice(ECI(c) * EPW_BINS, (ECI(c) + 1) * EPW_BINS))
      + sum(rows.map((r) => r.epActiveAtFullTime[ECI(c)])) === got.epSets[ECI(c)])
      && sum(got.ownEpTickBins) + sum(rows.map((r) => r.ownEpActiveAtFullTime))
        === sum(rows.map((r) => r.ownEpSets)) });
  binChecks.push({ bin: `${armK}.partition.countsAreInsideTheirDenominators`,
    ok: rows.every((r) => r.makeRunTicksPost <= r.offBallDecisionTicksPost
      && r.wallFires <= r.wallEligiblePasses
      && r.openPlayBoardEmptyTicks <= r.openPlayCoachTicks
      && r.r1FloodTicks <= r.r1TeamTicks
      && r.runMulCount <= r.offBallDecisionTicksPost) });
}
/** ⭐⭐⭐ THE READ WORDS, THE FLOOD ROWS AND THE GUARD TABLE, re-derived off the SERIALIZED
 *  artifact by applying the FROZEN RULES to the stored intervals and levels. */
for (const armK of CONTRAST_ARMS) {
  const rr = disk.r1.rows[armK];
  binChecks.push({ bin: `r1.${armK}.floodsRederives`,
    ok: rr.floods === (rr.up && rr.delta > rr.toleranceAbs)
      && rr.beyondTolerance === (rr.delta > rr.toleranceAbs) });
  const table = disk.guards.table[armK];
  const rederived = table.map((g) => {
    const beyond = g.direction === 'ceiling' ? g.delta > g.toleranceAbs
      : g.direction === 'floor' ? g.delta < -g.toleranceAbs
        : Math.abs(g.delta) > g.toleranceAbs;
    return beyond === g.beyondTolerance && g.breach === (g.resolved && beyond)
      && sameNum(NI_FRACTION * Math.abs(g.controlLevel), g.toleranceAbs);
  });
  binChecks.push({ bin: `guards.${armK}.everyRowRederives`, ok: rederived.every((x) => x) });
  binChecks.push({ bin: `guards.${armK}.holdsBandRederives`,
    ok: disk.guards.holdsBand[armK] === table.every((g) => !g.breach) });
}
{
  const rd = disk.reads as unknown as {
    selected: ReadWord; sentence: string; armOfRecord: Arm;
    selectors: Record<Arm, { floods: boolean; holdsBand: boolean }>;
    counterfactuals: { dosedOwnAsIfArmOfRecord: { word: ReadWord; sentence: string };
      kitchenSinkOwnAsIfArmOfRecord: { word: ReadWord; sentence: string };
      d13OwnAsIfArmOfRecord: { word: ReadWord; sentence: string } };
    d13Agrees: boolean; d13AgreementWordPrinted: string; breachNamed: string;
  };
  const fa = rd.selectors[ARM_OF_RECORD];
  const fd = rd.selectors[DOSED_ARM_OF_RECORD];
  const fks = rd.selectors[CEILING_ARM];
  const f13 = rd.selectors['OWN-D13'];
  const w = readWordFrom(fa.floods, fa.holdsBand, fd.floods, fd.holdsBand);
  const wDosed = readWordFrom(fd.floods, fd.holdsBand, fd.floods, fd.holdsBand);
  const wKs = readWordFrom(fks.floods, fks.holdsBand, fks.floods, fks.holdsBand);
  const w13 = readWordFrom(f13.floods, f13.holdsBand, f13.floods, f13.holdsBand);
  binChecks.push({ bin: 'reads.selectorRederives',
    ok: w === rd.selected && READ_LITERALS[w] === rd.sentence
      && (Object.values(READ_LITERALS) as string[]).includes(rd.sentence)
      && rd.armOfRecord === ARM_OF_RECORD });
  binChecks.push({ bin: 'reads.counterfactualWordsRederive',
    ok: wDosed === rd.counterfactuals.dosedOwnAsIfArmOfRecord.word
      && READ_LITERALS[wDosed] === rd.counterfactuals.dosedOwnAsIfArmOfRecord.sentence
      && wKs === rd.counterfactuals.kitchenSinkOwnAsIfArmOfRecord.word
      && READ_LITERALS[wKs] === rd.counterfactuals.kitchenSinkOwnAsIfArmOfRecord.sentence
      && w13 === rd.counterfactuals.d13OwnAsIfArmOfRecord.word
      && READ_LITERALS[w13] === rd.counterfactuals.d13OwnAsIfArmOfRecord.sentence });
  binChecks.push({ bin: 'reads.agreementBooleanIsStored',
    ok: rd.d13Agrees === (w13 === w)
      && rd.d13AgreementWordPrinted === (w13 === w ? AGREE_SENTENCE.agrees
        : AGREE_SENTENCE.disagrees) });
  binChecks.push({ bin: 'reads.breachAnnotationIsAStoredField',
    ok: rd.breachNamed === [...disk.guards.table[ARM_OF_RECORD].filter((g) => g.breach)
      .map((g) => `${g.key}`), ...disk.guards.table[DOSED_ARM_OF_RECORD]
      .filter((g) => g.breach).map((g) => `${g.key}`)].map((k, i) => {
      const all = [...GUARD_TABLE[ARM_OF_RECORD].filter((g) => g.breach),
        ...GUARD_TABLE[DOSED_ARM_OF_RECORD].filter((g) => g.breach)];
      return `${all[i].id} ${k}`;
    }).join(' · ') });
}
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
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen
      && (r.hwSmoke === 0) === r.degenerate,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'top-bin-share / partition / R1 / GUARD / READ-WORD / sizing checks re-derived from the '
    + 'SERIALIZED artifact off disk — canon: "the re-derivation gate covers EVERY published '
    + 'face; a percentile face requires stored bins". `floods`, every guard row\'s '
    + '`beyondTolerance` and `breach`, `holdsBand`, the selected read, BOTH counterfactual '
    + 'words and the agreement word are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.') || b.bin.startsWith('guards.')
    || b.bin.startsWith('r1.')).every((b) => b.ok),
  note: '⭐⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: `floods(arm)`, every guard row\'s harmful-'
    + 'direction test, `holdsBand(arm)`, the selected read, the printed sentence, BOTH '
    + 'counterfactual words (the dosed OWN arm and D13, each by the SAME frozen rule on ITS '
    + 'OWN stored interval) and the agreement word are RE-DERIVED by applying the frozen rules '
    + 'to the SERIALIZED rows off disk, and every printed sentence must be one of the FOUR '
    + 'frozen literals. canon, VERBATIM: "a universal sentence about a table (\'every bin\', '
    + '\'the one bin\') is a stored boolean or is not written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
/** ⭐ `allGreen` is a BODY key whose value depends on `gHashOrder` itself, so it is seeded here
 *  with a placeholder and OVERWRITTEN with the real verdict below — the schema check is then
 *  honest for EVERY key, and the written value is the real one. */
artifact.allGreen = false;
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
    + 'construction receipt, R1, the guards, the reads, the face blocks, the code facts, the '
    + 'dose copy AND `allGreen`, and EXCLUDES `hashedBodySha256`, `gFacesDetail` and '
    + '`receipts`; the body hash is computed LAST — after every body key is assigned — and a '
    + 'NON-body `receipts.hashReproducesFromFile` records that it reproduces from the file',
};
gates.gStage = {
  ok: (artifact.stage as { instrument: string }).instrument === INSTRUMENT_PATH
    && (artifact.stage as { instrumentSha256: string }).instrumentSha256
      === sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
  note: '⭐⭐ LN-C3 §COMMANDER CORRECTIONS: the artifact\'s `stage.instrument` is THIS '
    + `instrument's own path (${INSTRUMENT_PATH}) and \`stage.instrumentSha256\` is the sha256 `
    + 'of the RUNNING FILE re-read from disk at this line — never an inherited string',
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
    + 'a NON-body receipt field records that the hash reproduces from the written file". This '
    + 'block is OUTSIDE `BODY_SCHEMA` by construction.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential. The FINAL file byte-hash and byte count are recomputed after the final '
    + 'write and PUBLISHED IN THE DOC\'s §GATES.',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`DS-T1b — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to .RED'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE FLOOD FACE (executed runs per in-possession open-play tick) ---');
for (const armK of ARMS) {
  const lv = face(R1_KEY, armK);
  banner(`  ${armK} mean ${f6(lv.value)} · ≥3 ${f6(face('r1.floodShareAtLeastThree', armK).value)}`
    + ` · bins ${Array.from({ length: R1_BINS }, (_, k) => f6(face(
      `r1.binShare.${k === R1_BINS - 1 ? `${k}plus` : k}`, armK).value)).join(' ')}`);
  if (CONTROL_OF[armK] !== armK) {
    const fr = FLOOD_ROWS[armK];
    banner(`    Δ vs ${fr.controlArm} ${f6(fr.delta)} [${f6(fr.ci[0])}, ${f6(fr.ci[1])}] · tol `
      + `${f6(fr.toleranceAbs)} · resolved ${fr.resolved} · floods ${fr.floods}`);
  }
}
banner('');
banner('--- §R2 THE BAND ---');
for (const armK of CONTRAST_ARMS) {
  banner(`  ${armK} holdsBand ${holdsBand(armK)} · breaches `
    + `[${breachingGuards(armK).join(', ') || 'none'}] · offside flag `
    + `${OFFSIDE_ROWS[armK].flag}`);
  for (const g of GUARD_TABLE[armK]) {
    banner(`    ${g.id} ${g.key} ctrl ${f6(g.controlLevel)} Δ ${f6(g.delta)} `
      + `[${f6(g.ci[0])}, ${f6(g.ci[1])}] tol ${f6(g.toleranceAbs)} ${g.direction} `
      + `resolved ${g.resolved} beyond ${g.beyondTolerance} breach ${g.breach}`);
  }
}
banner('');
banner('--- §R3 THE FACES ---');
for (const armK of ARMS) {
  banner(`  ${armK} board: runners/tick ${f6(face('runCount.mean', armK).value)} · open-play `
    + `board empty share ${f6(face('board.openPlayEmptyShare', armK).value)} · `
    + `openPlayBoardEmpty ${OPEN_PLAY_BOARD[armK].openPlayBoardEmpty}`);
  banner(`    MakeRun share ${f6(face('offBall.makeRunShare', armK).value)} · own-run share of `
    + `MakeRun ${f6(face('runClass.shareOfMakeRun.ownRunInBehind', armK).value)} · licensed `
    + `${f6(face('runClass.shareOfMakeRun.licensedRunInBehind', armK).value)}`);
  banner(`    own episodes/match ${f6(face('own.episodesPerMatch', armK).value)} · shots/ep `
    + `${f6(face('own.shotsPerEpisode', armK).value)} · hat runner episodes/match `
    + `${f6(face('ep.setsPerMatch.runner', armK).value)} · shots/ep `
    + `${f6(face('ep.shotsPerEpisode.runner', armK).value)}`);
  banner(`    runs by role ${ROLES4.map((rr) =>
    `${rr} ${f6(face(`runsByRole.share.${rr}`, armK).value)}`).join(' · ')}`);
  banner(`    coupling: overlap sets/match ${f6(face('coupling.overlapSetsPerMatch', armK).value)}`
    + ` · played-to/set ${f6(face('coupling.overlapPlayedToPerSet', armK).value)} · wall `
    + `fires/match ${f6(face('coupling.wallFiresPerMatch', armK).value)} · return share `
    + `${f6(face('coupling.wallReturnShareOfFires', armK).value)}`);
  banner(`    crowding: crashShare ${f6(face('crowd.crashShare', armK).value)} · spacingUnder4 `
    + `${f6(face('guard.spacingUnder4', armK).value)}`);
  banner(`    per state (own runs/match): ${STATES.map((st) =>
    `${st} ${f6(face(`state.runsPerMatch.own.${st}`, armK).value)}`).join(' · ')}`);
  banner(`    calibration: post ${f6(face('calib.heldBodyTicksPostPerMatch', armK).value)} · pre `
    + `${f6(face('calib.heldBodyTicksPrePerMatch', armK).value)} · ledger `
    + `${f6(face('calib.ledgerDecisionsHeldPerMatch', armK).value)} · post/ledger `
    + `${f6(face('calib.postStepOverLedger', armK).value)}`);
}
for (const armK of ARMS) {
  banner(`  ${armK} runMul mean ${f6(face('runMul.mean', armK).value)} · below 1 `
    + `${f6(face('runMul.belowOneShare', armK).value)} · above 1 `
    + `${f6(face('runMul.aboveOneShare', armK).value)} · n `
    + `${face('runMul.mean', armK).denominator}`);
}
banner('');
banner('--- §R3b THE SEAM\'S OWN FACES ---');
for (const armK of ARMS) {
  const sf = SEAM_FACES[armK];
  banner(`  ${armK} [${sf.seatDose}] guard-pass FLOOR `
    + `${f6(sf.guardPass.ownCandidateVisibleShareFLOOR)} · own candidates/match `
    + `${f6(sf.guardPass.ownCandidatesPerMatch)} · outside-post-guard `
    + `${f6(sf.guardPass.outsidePostGuardShare)}`);
  banner(`    restraint mean ${f6(sf.restraint.mean)} · =0 `
    + `${f6(sf.restraint.exactlyZeroShare)} · =1 ${f6(sf.restraint.exactlyOneShare)} · n `
    + `${sf.restraint.observations} · bins ${sf.restraint.bins.join(' ')}`);
  banner(`    runningMates mean ${f6(sf.runningMates.mean)} · censored `
    + `${f6(sf.runningMates.censoredShare)} · n ${sf.runningMates.observations} · bins `
    + `${sf.runningMates.bins.join(' ')}`);
  banner(`    count mean ${f6(sf.count.mean)} · shares `
    + `${sf.count.shares.map((v) => f6(v)).join(' ')}`);
  banner(`    ownBackOut mean ${f6(sf.ownBackOut.mean)} · below 1 `
    + `${f6(sf.ownBackOut.belowOneShare)} · above 1 ${f6(sf.ownBackOut.aboveOneShare)} · n `
    + `${sf.ownBackOut.observations}`);
  banner(`    runMul (licensed limb) mean ${f6(sf.runMulLicensedLimb.mean)} · below 1 `
    + `${f6(sf.runMulLicensedLimb.belowOneShare)} · above 1 `
    + `${f6(sf.runMulLicensedLimb.aboveOneShare)} · n ${sf.runMulLicensedLimb.observations}`);
  banner(`    own runs: in flight ${f6(sf.inFlightAndRestart.ownRunShareBallInFlight)} · own `
    + `restart ${f6(sf.inFlightAndRestart.ownRunShareOwnRestart)} · a mate on the ball `
    + `${f6(sf.inFlightAndRestart.ownRunShareMateOwnsTheBall)} · other `
    + `${f6(sf.inFlightAndRestart.ownRunShareOther)}`);
}
banner('');
banner('--- §R4 THE CODE FACTS ---');
banner(`  MakeRun pushes ${MAKERUN_PUSHES.length} ${JSON.stringify(PUSH_CLASS_COUNTS)}`);
banner(`  makeRunCandidatesAllHatGuardedOnShippedPath `
  + `${makeRunCandidatesAllHatGuardedOnShippedPath}`);
banner(`  read forks ${READ_FORKS.length} · inventory agrees ${FORK_INVENTORY_AGREES} · counts `
  + `agree ${FLAG_COUNTS_AGREE} · doc line numbers agree ${FORK_LINE_NUMBERS_AGREE} `
  + `(measured ${FORK_LINES_MEASURED.join(', ')}; the doc's older table `
  + `${FORK_LINES_IN_DOC.join(', ')})`);
banner(`  the block's \`match\` members ${JSON.stringify(OWN_BLOCK === null ? []
  : OWN_BLOCK.members)} · the seam doc's read set ${JSON.stringify(DOC_READ_SET)} · agree `
  + `${BLOCK_MEMBERS_AGREE}`);
banner(`  runnerCount: span ${SPAN_RUNNER_COUNT === null ? 'MISSING' : spanKey(SPAN_RUNNER_COUNT)}`
  + ` · call sites ${RUNNER_COUNT_CALL_SITES.map((r) => `${r.file}:${r.line}`).join(' · ')}`);
banner('');
banner('--- §R5 THE READS (OWN-seat-absent on E13 of record) ---');
banner(`  ${READ_SENTENCE}`);
for (const a of (artifact.reads as { annotations: string[] }).annotations) banner(`    ${a}`);
banner(`  HATS+OWN (absent): floods ${HATSOWN_WORDS.absent.floods} · holdsBand `
  + `${HATSOWN_WORDS.absent.holdsBand}; (RUN-CAUTION): floods `
  + `${HATSOWN_WORDS.runCaution.floods} · holdsBand ${HATSOWN_WORDS.runCaution.holdsBand}; `
  + `(KITCHEN-SINK): floods ${HATSOWN_WORDS.kitchenSink.floods} · holdsBand `
  + `${HATSOWN_WORDS.kitchenSink.holdsBand}`);
banner(`  the counterfactual word had the RUN-CAUTION OWN arm been of record: `
  + `${READ_WORD_IF_DOSED_WERE_OF_RECORD}; had the KITCHEN-SINK OWN arm been of record: `
  + `${READ_WORD_IF_CEILING_WERE_OF_RECORD}`);
banner(`  H-DS-3 ${f6(H_NUMBERS.hDs3.thisStage.delta)} vs DS-T1's `
  + `${JSON.stringify((H_NUMBERS.hDs3.dsT1 as { delta?: number } | null)?.delta ?? null)} · `
  + `H-DS-4 ${f6(H_NUMBERS.hDs4.thisStage.delta)} vs DS-T1's `
  + `${JSON.stringify((H_NUMBERS.hDs4.dsT1 as { delta?: number } | null)?.delta ?? null)} · `
  + `H-DS-2 absent ${f6(H_NUMBERS.hDs2.seatAbsent.delta)} / RUN-CAUTION `
  + `${f6(H_NUMBERS.hDs2.runCaution.delta)} / KITCHEN-SINK `
  + `${f6(H_NUMBERS.hDs2.kitchenSink.delta)}`);
banner(`  D13: ${D13_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees} `
  + `(${READ_WORD_D13})`);
banner('');
banner(`ARTIFACT ${OUT_PATH}`);
banner(`  bytes ${FINAL_ARTIFACT_BYTES} · fileSha256 ${FINAL_FILE_SHA}`);
banner(`  hashedBodySha256 ${artifact.hashedBodySha256 as string}`);
banner(`  instrumentSha256 ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`  hashReproducesFromFile ${HASH_REPRODUCES_FROM_FILE}`);
banner(`  wall ${((Date.now() - t0Wall) / 1000).toFixed(3)} s`);
if (!ALL_GREEN_FINAL) process.exitCode = 1;
