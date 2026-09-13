/**
 * ⭐⭐⭐ IF-C0 — 「球在飞时的前插 · 普查」 THE CENSUS OF THE RUN ONTO A BALL IN FLIGHT
 * (docs/world-model/IF-C0-FLIGHT-RUN-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #415 item 6. Lineage: DS-C0 (the census FORM and the walker's
 * populations A–D) → DS-T0/T0b/T0c (the own-run seam and M-DS.7's perceived state guard) →
 * DS-T1 (the per-state faces: the hats' 0.518517 / 0.080620 / 0.397269) → DS-T1c → DS-T1d (THE
 * INSTRUMENT THIS FILE COPIES BY RECIPE — buildMatch, `signatureOf`, the four-state classifier,
 * the walker, the gate idioms, the hash/allowlist/RED-routing idiom; ⛔ NEVER IMPORTED) →
 * DS-ENTRY-2 (world 17).
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS as STORED PARTITIONS. It arms NOTHING, ships
 * NOTHING, scores no hypothesis and prints NO VERDICT WORD on any face. ⛔ NO READ SENTENCE IS
 * FROZEN FOR A CENSUS (#415 item 6): the four PRE-REGISTERED QUESTIONS are answered as stored
 * partitions and the commander drafts the IF contract on the table.
 *
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe reads public
 * `Match` / `Team` / `Player` / `Ball` state and the engine's own decision record
 * (`p.action.scores`) before and after `match.step(DT)`.
 *
 * ⚠ THE ONE ADDED READ, DECLARED: on the arms carrying `dsOwnRun` this instrument takes ONE
 * `match.perceivedSnapshot(p)` PER STAMPED RUN-START TICK, INSIDE the arm's own flag, to publish
 * the runner's PERCEIVED ball beside the TRUTH state (#415 item 6(2)). The pull count is STORED
 * per row and `gPullCount` asserts that the OBSERVED walk's pull count exceeds the UNOBSERVED
 * walk's by EXACTLY that number, on every arm — and `gLockstep` asserts the whole-match signature
 * is BYTE-IDENTICAL either way, i.e. the added pull is INERT (`perceivedSnapshot` reconstructs
 * this body's memory from its own recorded scan frames; a second, later pull is idempotent —
 * the seam doc's §DEVIATIONS-B 1 idiom, MEASURED here rather than asserted).
 *
 * ⛔ NO DOSE OF THE OBM SEAT: `obmMovement` is never set on any arm and no 16-slot matrix is
 * written anywhere; the `D13` arm takes the SHIPPED loaders' L3 / PC doses through `armA4World`
 * exactly as DS-C0's D13 arm did — that is the played book, not a seat dose, and `gDoseSource`
 * hashes the bytes it reads.
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
import { RUN_ROLE_W, RUN_DEPTH_DIV, RUN_PRIOR_MAX, runnerCount, runRank } from '../../src/ai/TeamBrain';
import { OBM_SCORE_SPAN } from '../../src/ai/offballEyes';
import {
  randomGenome, OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS, OBM_WEIGHT_SLOTS, type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo, type Role } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the DS-C0 / DS-T1d §1 form)                */
/* ========================================================================== */
const ENV_WHITELIST = ['IFC0_MODE', 'IFC0_N', 'IFC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('IFC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`IF-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.IFC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('IF-C0 FATAL — IFC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.IFC0_N !== undefined ? Number(process.env.IFC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('IF-C0 FATAL — IFC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.IFC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`IFC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`IFC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`IFC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/if-c0-flight-run-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/if-c0/override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('IF-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
const INSTRUMENT_PATH = 'scripts/probes/if-c0-flight-run-census.ts';

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set, copied by recipe)                          */
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
const topBinShare = (bins: readonly number[]): number => ratio(bins[bins.length - 1], sum(bins));
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
const SNAP_PATH = 'src/ai/perceptionSnapshot.ts';
const TYPES_PATH = 'src/sim/types.ts';
const OBMT1_PATH = 'scripts/probes/obm-t1-policy-exam.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const PTC0_PATH = 'scripts/probes/pt-c0-playtest-forensic-census.ts';
const ANCHOR_FILES = [TEAMBRAIN_PATH, MECH_PATH, BRAIN_PATH, EXEC_PATH, MATCH_PATH, CONST_PATH,
  EYES_PATH, GENOME_PATH, A4_PATH, TEAM_PATH, PLAYER_PATH, SNAP_PATH, TYPES_PATH,
  OBMT1_PATH, A4P1C_PATH, PTC0_PATH];
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
const nums = (s: string): number[] => (s.match(/-?[0-9]+\.?[0-9]*/g) ?? []).map(Number);
const firstQuoted = (s: string): string => {
  const m = /'([^']*)'/.exec(s);
  return m === null ? '' : m[1];
};

/* ---- ⭐⭐⭐ THE SHIPPED LICENCE'S STATE CLAUSE — THE CODE MAP'S FIRST SUBJECT ---- */
const LICENCE_CLAUSE_LINE = "    if ((team.runners.has(p.index) || arriving) && (carrier ? "
  + "carrier !== p : match.phase === 'restart' || crashLive || crossLive)) {";
anchor('⭐⭐⭐ THE SHIPPED LICENCE\'S STATE CLAUSE — `carrier ? carrier !== p : phase === '
  + '\'restart\' || crashLive || crossLive`: THE THREE IN-FLIGHT LICENCES THAT EXIST TODAY',
  BRAIN_PATH, LICENCE_CLAUSE_LINE, 1);
const CRASH_LIVE_LINE = '    const crashLive = team.cornerCrash !== null && match.simTime < '
  + 'team.cornerCrash.until;';
anchor('⭐⭐⭐ IN-FLIGHT LICENCE 1 of 3 — THE CORNER CRASH, off `team.cornerCrash`', BRAIN_PATH,
  CRASH_LIVE_LINE, 1);
const CROSS_LIVE_LINE = '    const crossLive = match.c4Arrival && team.crossFlight !== null';
anchor('⭐⭐⭐ IN-FLIGHT LICENCE 2 of 3 — THE OPEN-PLAY CROSS FLIGHT, off `team.crossFlight` AND '
  + '`match.c4Arrival`', BRAIN_PATH, CROSS_LIVE_LINE, 1);
anchor('⭐⭐⭐ IN-FLIGHT LICENCE 3 of 3 — THE RESTART, off `match.phase` (inside the clause above)',
  BRAIN_PATH, "match.phase === 'restart' || crashLive || crossLive", 1);
anchor('⭐⭐ `team.cornerCrash` — the crash licence\'s own field (routine · y · until · the '
  + 'personnel LOCKED at the hand-off)', TEAM_PATH, '  cornerCrash: {', 1);
anchor('⭐⭐ `team.crossFlight` — the cross licence\'s own field (until · runners · arriver)',
  TEAM_PATH, '  crossFlight: {', 1);
anchor('⭐⭐ `match.c4Arrival` — the door the cross licence hangs on', MATCH_PATH,
  '  readonly c4Arrival: boolean;', 1);
anchor('⭐⭐ THE CROSS FLIGHT\'S ONE WRITER — `team.crossFlight = {` in `mechanics.ts`', MECH_PATH,
  '    team.crossFlight = {', 1);
/* ---- ⭐⭐⭐ THE OWN-RUN FORK AND M-DS.7's GUARD — WHAT IT READS AND WHAT IT DOES NOT ---- */
anchor('⭐⭐⭐ THE OWN-RUN GATE — the ONE `match.dsOwnRun` READ FORK in `src/**`', BRAIN_PATH,
  '    if (match.dsOwnRun) {', 1);
anchor('⭐⭐⭐ THE PERCEPT PULL — the ONE `perceivedSnapshot` INSIDE the fork', BRAIN_PATH,
  '        const snapshot = match.perceivedSnapshot(p);', 1);
anchor('⭐⭐⭐ M-DS.7 — THE PERCEIVED-OWNER GUARD: the candidate exists ONLY when the eyes hold a '
  + 'MATE on the ball', BRAIN_PATH, '        if (snapshot !== null && carrierIsMate) {', 1);
anchor('⭐⭐⭐ M-DS.7 — THE OWNER READ ITSELF (`seenBall.ownerGid`)', BRAIN_PATH,
  '        const ownerGid = seenBall === null ? null : seenBall.ownerGid;', 1);
anchor('⭐⭐⭐ ⛔ THE GUARD DOES NOT READ `ageTicks` — the count over the WHOLE fork\'s file is '
  + 'ZERO (the code map\'s negative)', BRAIN_PATH, 'ageTicks', 0);
anchor('⭐⭐⭐ ⛔ THE FORK DOES NOT READ `pendingPass` — `PlayerBrain.ts`\'s FIVE `match.pendingPass` '
  + 'occurrences are ENUMERATED here and the CODE FACT below proves none lies inside the fork\'s '
  + 'own span', BRAIN_PATH, 'match.pendingPass', 5);
const WHY_OWN_LINE = "          cands.push({ action: 'MakeRun', score: s, "
  + "why: 'own run in behind' });";
anchor('⭐⭐⭐ THE SEVENTH `why` LITERAL — the own run\'s own name on the decision record',
  BRAIN_PATH, WHY_OWN_LINE, 1);
/* ---- ⭐⭐⭐ `ObservedBall` — A PERCEIVED FLIGHT IS REPRESENTABLE TODAY ---- */
const OBSERVED_BALL_HEAD = 'export interface ObservedBall {';
anchor('⭐⭐⭐ `ObservedBall` — pos · vel · ownerGid · observedTick · ageTicks: a PERCEIVED FLIGHT '
  + 'IS REPRESENTABLE TODAY (ownerGid null with a non-zero vel)', SNAP_PATH, OBSERVED_BALL_HEAD, 1);
anchor('⭐⭐ `ObservedBall.ownerGid`', SNAP_PATH, '  readonly ownerGid: number | null;', 2);
anchor('⭐⭐ `ObservedBall.ageTicks`', SNAP_PATH, '  readonly ageTicks: number;', 2);
anchor('⭐⭐ `ObservedBall.observedTick`', SNAP_PATH, '  readonly observedTick: number;', 2);
/* ---- ⭐⭐⭐ `pendingPass` — ITS SHAPE AND THE ENGINE'S OWN RECEIVER FIELD ---- */
anchor('⭐⭐⭐ `PendingPass` — THE AIM LEDGER\'S OWN INTERFACE', MATCH_PATH,
  'export interface PendingPass {', 1);
anchor('⭐⭐⭐ THE ENGINE\'S OWN INTENDED-RECEIVER FIELD — `targetGid` (so NO heuristic is written '
  + 'for the intended-receiver test; canon: engine ledgers before heuristics)', MATCH_PATH,
  '  targetGid: number;', 2);
anchor('⭐⭐ `PendingPass.passerGid`', MATCH_PATH, '  passerGid: number;', 1);
anchor('⭐⭐ `PendingPass.t` — the release clock Δt is measured against', MATCH_PATH,
  '  t: number;\n  /**\n   * Offside, judged AT KICK TIME', 1);
anchor('⭐⭐ `pendingPass` — the field itself', MATCH_PATH,
  '  pendingPass: PendingPass | null = null;', 1);
anchor('⭐⭐ `pendingPass` WRITTEN by `registerPass` — the aim ledger', MECH_PATH,
  '  match.pendingPass = {', 1);
anchor('⭐⭐ THE FLIGHT\'S OWN EXPIRY — 3.5 s and the ledger clears', MATCH_PATH,
  '    if (this.pendingPass && this.simTime - this.pendingPass.t > 3.5) this.pendingPass = null;',
  1);
anchor('⭐⭐ THE COMPLETION RECORD — `lastCompletedPass`', MATCH_PATH,
  '  lastCompletedPass: { passerGid: number; receiverGid: number; t: number } | null = null;', 1);
anchor('⭐⭐ THE COMPLETION\'S OWN WRITE SITE (the receiver takes it)', MATCH_PATH,
  '        this.lastCompletedPass = { passerGid: pass.passerGid, receiverGid: p.gid, '
  + 't: this.simTime };', 1);
anchor('⭐⭐ THE INTERCEPTION\'S OWN LEDGER LINE (an opponent takes it)', MATCH_PATH,
  '        team.stats.interceptions++;', 1);
/* ---- ⭐⭐⭐ THE THROUGH-BALL CHOOSER'S RUNNER SCAN (DS-C0 §0.6's `thirdMan` action-type read) -- */
anchor('⭐⭐⭐ THE THROUGH-BALL CHOOSER\'S RUNNER SCAN — the passer looks for a body ALREADY '
  + 'RUNNING, by ACTION TYPE', BRAIN_PATH,
  "      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;", 1);
anchor('⭐⭐ THE THIRD-MAN BONUS — the SECOND action-type read', BRAIN_PATH,
  "        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15", 1);
anchor('⭐⭐ `registerPass`\'s BOUNCE CLASSIFICATION — the THIRD action-type read', MECH_PATH,
  "    target.action.type === 'MakeRun' &&", 1);
/* ---- THE SEVEN `why` LITERALS, EXTRACTED (DS-C0's six + the seam's seventh) ---- */
const WHY_ARRIVING_LINE = "          ? 'arriving late at the cutback arc'";
const WHY_BOX_LINE = "          : match.phase === 'restart' || crashLive ? "
  + "'attacking the box for the delivery' : 'licensed run in behind',";
anchor('⭐⭐ THE WINNER\'S `why` — ARRIVING LATE', BRAIN_PATH, WHY_ARRIVING_LINE, 1);
anchor('⭐⭐ THE WINNER\'S `why` — ATTACKING THE BOX / LICENSED RUN IN BEHIND', BRAIN_PATH,
  WHY_BOX_LINE, 1);
const WHY_BURST_LINE = "      cands.push({ action: 'MakeRun', score: s, "
  + "why: 'bursting for the one-two return' });";
anchor('⭐⭐ THE ONE-TWO BURST PUSH and its `why`', BRAIN_PATH, WHY_BURST_LINE, 1);
const WHY_OVERLAP_LINE = "      cands.push({ action: 'MakeRun', score: s, "
  + "why: 'overlapping outside the carrier' });";
anchor('⭐⭐ THE OVERLAP PUSH and its `why`', BRAIN_PATH, WHY_OVERLAP_LINE, 1);
const WHY_KEEPERUP_LINE = "      scores: [{ action: 'MakeRun', score: 1, "
  + "why: 'keeper UP for the corner — nothing left to lose' }],";
anchor('⭐⭐ THE KEEPER-UP CORNER RUN — the one `MakeRun` outside `decideOffBall`', BRAIN_PATH,
  WHY_KEEPERUP_LINE, 1);
anchor('⭐⭐ THE DECISION RECORD — the winner FIRST (TWO occurrences, both ENUMERATED)',
  BRAIN_PATH, '  cands.sort((a, b) => b.score - a.score);', 2);
anchor('⭐⭐ the record\'s own `scores` slice — the top FOUR candidates', BRAIN_PATH,
  '    scores: cands.slice(0, 4),', 1);
/* ---- THE DESIGNATION WRITER AND THE TWO COOPERATION GATES (world 17's doors) ---- */
anchor('⭐⭐ `assignRunners` — THE DESIGNATION WRITER (hashed WHOLE below, rule (m) form)',
  TEAMBRAIN_PATH, 'function assignRunners(team: Team, match: Match): void {', 1);
anchor('⭐⭐ THE POSSESSION EARLY RETURN — every tick below is an IN-POSSESSION tick',
  TEAMBRAIN_PATH, '  if (match.possessionSide !== team.side) return;', 1);
const LIVE_CORNER_LINE = "  const liveCorner = match.phase === 'restart' && "
  + "match.restart?.kind === 'corner' && match.restart.side === team.side;";
anchor('⭐⭐ THE `liveCorner` BRANCH PREDICATE', TEAMBRAIN_PATH, LIVE_CORNER_LINE, 1);
const HELD_CRASH_LINE = '  const heldCrash = !liveCorner && team.cornerCrash !== null '
  + '&& match.simTime < team.cornerCrash.until;';
anchor('⭐⭐ THE `heldCrash` BRANCH PREDICATE', TEAMBRAIN_PATH, HELD_CRASH_LINE, 1);
anchor('⭐⭐ THE CROSS-FLIGHT BRANCH — the open-play cross\'s held licence', TEAMBRAIN_PATH,
  '  else if (cf !== null && match.ball.owner === null) {', 1);
const COOP_GATE_LINE = '  if (!match.dsCoopHatsOff) {';
anchor('⭐⭐⭐ WORLD 17 GATE 1 — `assignRunners`\' 套边 block wrapped', TEAMBRAIN_PATH,
  COOP_GATE_LINE, 1);
anchor('⭐⭐⭐ WORLD 17 GATE 2 — `performPass`\'s 2过1 trigger wrapped', MECH_PATH,
  COOP_GATE_LINE, 1);
anchor('⭐⭐⭐ THE HATS-OFF GATES — `if (!match.dsHatsOff) {`, EXACTLY TWO', TEAMBRAIN_PATH,
  '  if (!match.dsHatsOff) {', 2);
anchor('⭐⭐ the `dsOwnRun` FLAG INIT — a hard `false`', MATCH_PATH,
  '    this.dsOwnRun = cfg.dsOwnRun ?? false;', 1);
anchor('⭐⭐ the `dsHatsOff` FLAG INIT — a hard `false`', MATCH_PATH,
  '    this.dsHatsOff = cfg.dsHatsOff ?? false;', 1);
anchor('⭐⭐ the `dsCoopHatsOff` FLAG INIT — a hard `false`', MATCH_PATH,
  '    this.dsCoopHatsOff = cfg.dsCoopHatsOff ?? false;', 1);
const COUNT_LINE_A = "  return (mode === 'CounterAttack' || tempo > 0.65 ? 2 : 1)";
const COUNT_LINE_B = '    + (urgency > 0.65 ? 1 : 0);';
anchor('⭐⭐ THE RUNNER COUNT, line 1', TEAMBRAIN_PATH, COUNT_LINE_A, 1, nums(COUNT_LINE_A));
anchor('⭐⭐ THE RUNNER COUNT, line 2', TEAMBRAIN_PATH, COUNT_LINE_B, 1, nums(COUNT_LINE_B));
const ROLE_W_LINE = 'export const RUN_ROLE_W: Record<Role, number> = '
  + '{ GK: 0, DF: 0.4, MF: 1.2, WG: 1.8, ST: 2.2 };';
anchor('⭐⭐ `RUN_ROLE_W` — the coach\'s own ranking, EXPORTED', TEAMBRAIN_PATH, ROLE_W_LINE, 1,
  nums(ROLE_W_LINE));
const DEPTH_DIV_LINE = 'export const RUN_DEPTH_DIV = 45;';
anchor('⭐⭐ `RUN_DEPTH_DIV`', TEAMBRAIN_PATH, DEPTH_DIV_LINE, 1, nums(DEPTH_DIV_LINE));
anchor('⭐⭐ `RUN_PRIOR_MAX` — DERIVED IN CODE, never typed', TEAMBRAIN_PATH,
  'export const RUN_PRIOR_MAX = Math.max(...Object.values(RUN_ROLE_W)) + HALF_L / '
  + 'RUN_DEPTH_DIV;', 1);
const TIRED_LINE = '  const tired = p.stamina < 0.4 && g.staminaConservation > 0.5;';
anchor('⭐⭐ THE `tired` PREDICATE', BRAIN_PATH, TIRED_LINE, 1, nums(TIRED_LINE));
const TIRED_MUL_LINE = 'export const OFFBALL_TIRED_MUL = 0.6;';
anchor('⭐⭐ `OFFBALL_TIRED_MUL`', CONST_PATH, TIRED_MUL_LINE, 1, nums(TIRED_MUL_LINE));
const WALL_SET = '    passer.wallRun = { until: match.simTime + 2.3, partnerGid: mate.gid };';
anchor('⭐⭐ THE 2过1 WRITE — the 2.3 s licence (the episode bins derive their ceiling from it)',
  MECH_PATH, WALL_SET, 1, nums(WALL_SET));
/* ---- THE LEDGERS AND THE CADENCE ---- */
anchor('⭐⭐ `shotLog` — the shot ledger', MATCH_PATH, '  shotLog: ShotLogEntry[] = [];', 1);
anchor('⭐⭐ `pendingShot` — the shooter join debt (b) banks AT THE PUSH', MATCH_PATH,
  '  pendingShot: PendingShot | null = null;', 1);
anchor('⭐⭐ `possessionSide`', MATCH_PATH, '  possessionSide: Side | -1 = -1;', 1);
anchor('⭐⭐ THE COACH TICK — `updateTeamBrain` under the 0.4 s timer', MATCH_PATH,
  '        updateTeamBrain(team, this);', 1);
anchor('⭐⭐ the coach timer\'s own decrement', MATCH_PATH, '      team.brainTimer -= dt;', 1);
anchor('⭐⭐⭐ THE PLAYER DECISION GATE — `decisionTimer <= 0 && !pcHeld`', MATCH_PATH,
  '      if (p.decisionTimer <= 0 && !pcHeld) {', 1);
anchor('⭐⭐⭐ DEBT (a) — `pcHeld` READS `holdFor(p.gid, this.stepCount)` INSIDE the decide loop',
  MATCH_PATH, '      const pcHeld = p.decisionTimer <= 0 && this.pcLatency !== null\n'
  + '        && this.pcLatency.holdFor(p.gid, this.stepCount) !== null;', 1);
anchor('⭐⭐⭐ DEBT (a) — THE ENGINE\'S OWN LEDGER of held decisions', MATCH_PATH,
  '      if (pcHeld) (this.pcLatency as PcLatencySeat).ledger.decisionsHeld++;', 1);
anchor('⭐⭐ its re-arm at `AI_INTERVAL`', MATCH_PATH, '        p.decisionTimer = AI_INTERVAL;', 1);
anchor('⭐ the decision timer\'s own decrement — inside `physicsStep`', PLAYER_PATH,
  '    this.decisionTimer -= dt;', 1);
anchor('⭐ `wallRun` — the per-player licence field', PLAYER_PATH,
  '  wallRun: { until: number; partnerGid: number } | null = null;', 1);
anchor('⭐ `team.runners`', TEAM_PATH, '  runners = new Set<number>();', 1);
anchor('⭐ `team.arriver`', TEAM_PATH, '  arriver: number | null = null;', 1);
anchor('⭐ `team.overlapper`', TEAM_PATH, '  overlapper: number | null = null;', 1);
anchor('⭐⭐ `TEAM_AI_INTERVAL` = 0.4', CONST_PATH, 'export const TEAM_AI_INTERVAL = 0.4;', 1, 0.4);
anchor('⭐⭐ `AI_INTERVAL` = 0.15', CONST_PATH, 'export const AI_INTERVAL = 0.15;', 1, 0.15);
anchor('`DT`', CONST_PATH, 'export const DT = 1 / 60;', 1, 1 / 60);
anchor('⭐⭐ `OBM_SCORE_SPAN` — DERIVED IN CODE', EYES_PATH,
  'export const OBM_SCORE_SPAN = 1 - OFFBALL_TIRED_MUL;', 1);
anchor('⭐⭐ `OBM_FEATURE_KEYS`', GENOME_PATH, 'export const OBM_FEATURE_KEYS = [', 1);
anchor('⭐⭐ `OBM_OUTPUT_KEYS`', GENOME_PATH, 'export const OBM_OUTPUT_KEYS = [', 1);
anchor('⭐⭐ world 13 = world 12 + the ONE cushion door', A4_PATH,
  '    return { ...a4MatchFlags(RA_WORLD_VERSION), ...BQ_WORLD_DOORS };', 1);
anchor('⭐⭐ `bqArmedVersion` — the world-13 gate of record', A4_PATH,
  'export function bqArmedVersion(match: Match): 0 | BqWorldVersion {', 1);
/* ---- ⭐⭐ THE CROWDING FAMILY — inherited BY ANCHOR (OBM-T1 / PT-C0 / the A4 battery) ---- */
anchor('⭐⭐ `DUP_RUN_M` — the A4 battery I6 duplicate-run bucket', A4P1C_PATH,
  'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)', 1, 4);
anchor('⭐⭐ `SAMPLE_EVERY` — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);
anchor('⭐⭐ PT-C0\'s 撞车 line — the face `crowd.crashShare` IS', PTC0_PATH,
  '          if (mp < DUP_RUN_M) row.crashHits += 1;', 1);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `PAIR_SUBSAMPLE`', OBMT1_PATH, 'const PAIR_SUBSAMPLE = 6;', 1, 6);
anchor('⭐⭐ GUARD COPY — OBM-T1\'s `CLOSE_PAIR_M`', OBMT1_PATH, 'const CLOSE_PAIR_M = 4;', 1, 4);
anchor('⭐⭐ X-FP-PROD — the PRODUCTION FINGERPRINT BASELINE, inherited from OBM-T1\'s probe',
  OBMT1_PATH,
  "const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';",
  1);

/* ========================================================================== */
/* §4 THE EXTRACTED LITERALS — every constant below is PARSED from an anchored line */
/* ========================================================================== */
const RRW = nums(ROLE_W_LINE);
const DEPTH_DIV_EXTRACTED = nums(DEPTH_DIV_LINE)[0];
const TIRED_STAMINA = nums(TIRED_LINE)[0];
const TIRED_CONSERVATION = nums(TIRED_LINE)[1];
const TIRED_MUL_EXTRACTED = nums(TIRED_MUL_LINE)[0];
const TEMPO_HIGH = nums(COUNT_LINE_A)[0];
const COUNT_HIGH = nums(COUNT_LINE_A)[1];
const COUNT_BASE = nums(COUNT_LINE_A)[2];
const URGENCY_HIGH = nums(COUNT_LINE_B)[0];
const WALL_WINDOW = nums(WALL_SET)[0];
const WHY_ARRIVING = firstQuoted(WHY_ARRIVING_LINE);
const WHY_BOX = firstQuoted(WHY_BOX_LINE.slice(WHY_BOX_LINE.indexOf('? ')));
const WHY_LICENSED = firstQuoted(WHY_BOX_LINE.slice(WHY_BOX_LINE.lastIndexOf(': ')));
const WHY_BURST = firstQuoted(WHY_BURST_LINE.slice(WHY_BURST_LINE.indexOf('why: ')));
const WHY_OVERLAP = firstQuoted(WHY_OVERLAP_LINE.slice(WHY_OVERLAP_LINE.indexOf('why: ')));
const WHY_KEEPERUP = firstQuoted(WHY_KEEPERUP_LINE.slice(WHY_KEEPERUP_LINE.indexOf('why: ')));
const WHY_OWN = firstQuoted(WHY_OWN_LINE.slice(WHY_OWN_LINE.indexOf('why: ')));
const DUP_RUN_M = 4;
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
const FP_PROD_PIN = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const YIELD_WINDOW_SECONDS = 6;
const WALL_LICENCE_TICKS = Math.round(WALL_WINDOW / DT);
const AT_START = 'export type ActionType =';
const atIdx = SRC_OF[TYPES_PATH].indexOf(AT_START);
const ACTIONS = (SRC_OF[TYPES_PATH].slice(atIdx, SRC_OF[TYPES_PATH].indexOf(';', atIdx))
  .match(/'([A-Za-z]+)'/g) ?? []).map((s) => s.slice(1, -1));
const ACTION_CELLS = [...ACTIONS, 'unknown'] as const;
const AI = (a: string): number => {
  const i = ACTIONS.indexOf(a);
  return i < 0 ? ACTIONS.length : i;
};
const LITERALS_OK = RRW[0] === 0 && RRW[1] === 0.4 && RRW[2] === 1.2 && RRW[3] === 1.8
  && RRW[4] === 2.2
  && RUN_ROLE_W.GK === RRW[0] && RUN_ROLE_W.ST === RRW[4]
  && DEPTH_DIV_EXTRACTED === RUN_DEPTH_DIV
  && RUN_PRIOR_MAX === Math.max(...RRW) + HALF_L / DEPTH_DIV_EXTRACTED
  && TIRED_STAMINA === 0.4 && TIRED_CONSERVATION === 0.5
  && TIRED_MUL_EXTRACTED === OFFBALL_TIRED_MUL
  && OBM_SCORE_SPAN === 1 - OFFBALL_TIRED_MUL
  && TEMPO_HIGH === 0.65 && COUNT_HIGH === 2 && COUNT_BASE === 1 && URGENCY_HIGH === 0.65
  && runnerCount('BuildUp', 0, 0) === COUNT_BASE
  && runnerCount('CounterAttack', 0, 0) === COUNT_HIGH
  && WALL_WINDOW === 2.3
  && WHY_ARRIVING === 'arriving late at the cutback arc'
  && WHY_BOX === 'attacking the box for the delivery'
  && WHY_LICENSED === 'licensed run in behind'
  && WHY_BURST === 'bursting for the one-two return'
  && WHY_OVERLAP === 'overlapping outside the carrier'
  && WHY_KEEPERUP.startsWith('keeper UP for the corner')
  && WHY_OWN === 'own run in behind'
  && TEAM_AI_INTERVAL === 0.4 && AI_INTERVAL === 0.15 && DT === 1 / 60
  && ACTIONS.includes('MakeRun') && ACTIONS.includes('MoveToFormationSpot');

/* ========================================================================== */
/* §5 SEEDS — block 12,558,000–999 (#415 item 6)                               */
/* ========================================================================== */
const BLOCK_BASE = 12_558_000;
const BLOCK_TOP = 12_558_999;
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_008_000;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const XDET_SEEDS = LOCKSTEP_SEEDS;
const FIXTURE_SEED = SCRATCH_BASE + 99;
/** ⭐⭐⭐ G-REPRO's RE-WALK band — DS-T1d's OWN CONSUMED block. NOT a consumption. */
const REPRO_SEEDS = [12_557_000, 12_557_001, 12_557_002];
const DST1D_ARTIFACT = 'docs/world-model/data/ds-t1d-coop-hats-exam.json.RED.json';

/* ========================================================================== */
/* §6 THE ARMS — world 13 compositions, THE OBM SEAT ABSENT THROUGHOUT          */
/* ========================================================================== */
const ARMS = ['HATS-E13', 'OWN-E13', 'OWNCOOP-E13', 'D13'] as const;
type Arm = (typeof ARMS)[number];
const ARM_OF_RECORD: Arm = 'OWNCOOP-E13';
const ARM_LABEL: Record<Arm, string> = {
  'HATS-E13': 'world 13 EMPTY-BOOK, NO DS flag, the OBM seat ABSENT — THE SHIPPED PATH (and '
    + 'DS-T1d\'s own `HATS-E13`, which is what makes G-REPRO possible)',
  'OWN-E13': '⭐⭐ world 13 EMPTY-BOOK + `dsOwnRun` + `dsHatsOff` — WORLD 16\'s door set',
  'OWNCOOP-E13': '⭐⭐⭐ the same + `dsCoopHatsOff` — WORLD 17\'s door set. THE ARM OF RECORD.',
  D13: 'world 13 DOSED (the SHIPPED loaders\' L3 / PC doses) — the played form, BESIDE',
};
type ArmFlagKind = 'HATS' | 'OWN' | 'OWNCOOP';
const ARM_KIND: Record<Arm, ArmFlagKind> = {
  'HATS-E13': 'HATS', 'OWN-E13': 'OWN', 'OWNCOOP-E13': 'OWNCOOP', D13: 'HATS',
};
const ARM_BOOK: Record<Arm, 'E13' | 'D13'> = {
  'HATS-E13': 'E13', 'OWN-E13': 'E13', 'OWNCOOP-E13': 'E13', D13: 'D13',
};
const E13_ARMS = ARMS.filter((a) => ARM_BOOK[a] === 'E13');
const OWNRUN_ARMS = ARMS.filter((a) => ARM_KIND[a] !== 'HATS');
const OBM_SEAT_ABSENT_ON_EVERY_ARM = true;
const ARMS_OK = ARMS.length === 4 && E13_ARMS.length === 3 && OWNRUN_ARMS.length === 2
  && ARM_KIND[ARM_OF_RECORD] === 'OWNCOOP';

/* ---- THE SHIPPED DOSE LOADERS (the D13 arm), the DS-C0 form ---- */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('IF-C0 FATAL — a dose file\'s BYTES do not match the pinned value');
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
  banner(`IF-C0 FATAL — the D13 arm is not reachable: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}
const matrixOnBaseAndEff = (m: Match): boolean => m.teams.every((t) => (
  [t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => Array.isArray(g.offballMovementWeights)
  && g.offballMovementWeights.length === OBM_WEIGHT_SLOTS));
const infoGenomeCleanOfMatrix = (m: Match): boolean => m.teams.every((t) =>
  (t.info.genome as TacticalGenome).offballMovementWeights === undefined);
/** DS-C0's team construction, BYTE FOR BYTE (G-REPRO depends on it). */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐⭐ THE ARM CONSTRUCTION — DS-T1d's `buildMatch` BY RECIPE (never imported). */
const buildMatch = (seed: number, arm: Arm): Match => {
  const kind = ARM_KIND[arm];
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...(kind !== 'HATS' ? { dsOwnRun: true, dsHatsOff: true } : {}),
    ...(kind === 'OWNCOOP' ? { dsCoopHatsOff: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (ARM_BOOK[arm] === 'D13') armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, BQ_WORLD_VERSION);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed, each able to FIRE        */
/* ========================================================================== */
const coachTickFired = (brainTimerBefore: number): boolean => brainTimerBefore - DT <= 0;
const decisionTickFired = (decisionTimerBefore: number, notHeld: boolean): boolean =>
  decisionTimerBefore <= 0 && notHeld;
const pcHeldRecon = (h: { untilTick: number } | undefined, simTick: number): boolean =>
  h !== undefined && simTick < h.untilTick;
const DECISION_TICK_FORMS = ['postStep', 'preStep'] as const;
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
/** ⭐⭐⭐ THE SEVEN `why` CLASSES — DS-T1d's NINE-CELL classifier, copied BY RECIPE. */
const RUN_CLASSES = ['licensedRunInBehind', 'arrivingLate', 'attackingTheBox', 'oneTwoBurst',
  'overlapping', 'keeperUp', 'ownRunInBehind', 'noWhyRecorded', 'OTHER'] as const;
type RunClass = (typeof RUN_CLASSES)[number];
const RCI = (c: RunClass): number => RUN_CLASSES.indexOf(c);
const RUN_CLASSES_NAMED: readonly RunClass[] = ['licensedRunInBehind', 'arrivingLate',
  'attackingTheBox', 'oneTwoBurst', 'overlapping', 'keeperUp', 'ownRunInBehind'];
const HAT_CLASSES_SIX: readonly RunClass[] = ['licensedRunInBehind', 'arrivingLate',
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
/** ⭐⭐⭐ DS-T1d's FOUR-STATE TRUTH CLASSIFIER, COPIED BY RECIPE (its lines ~999–1010). */
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
/** ⭐⭐⭐ THE FLIGHT'S PROVENANCE — off `match.pendingPass`, the ENGINE'S OWN AIM LEDGER. */
const PROVENANCES = ['hisSidesPass', 'theOtherSidesPass', 'noPendingPass'] as const;
type Provenance = (typeof PROVENANCES)[number];
const PVI = (p: Provenance): number => PROVENANCES.indexOf(p);
const provenanceOf = (pendingSide: Side | null, hisSide: Side): Provenance => {
  if (pendingSide === null) return 'noPendingPass';
  return pendingSide === hisSide ? 'hisSidesPass' : 'theOtherSidesPass';
};
/** ⭐⭐⭐ THE PERCEIVED OWNER'S CLASS — the runner's OWN `perceivedSnapshot(p).ball.ownerGid`. */
const PERCEIVED = ['noSnapshot', 'noBallSeen', 'ownerNull', 'ownerIsSelf', 'ownerIsMate',
  'ownerIsOpponent'] as const;
type PerceivedK = (typeof PERCEIVED)[number];
const PCI = (k: PerceivedK): number => PERCEIVED.indexOf(k);
interface PerceivedInputs {
  snapshotNull: boolean; ballNull: boolean; ownerGid: number | null;
  selfGid: number; mateGids: readonly number[];
}
const perceivedOwnerOf = (i: PerceivedInputs): PerceivedK => {
  if (i.snapshotNull) return 'noSnapshot';
  if (i.ballNull) return 'noBallSeen';
  if (i.ownerGid === null) return 'ownerNull';
  if (i.ownerGid === i.selfGid) return 'ownerIsSelf';
  if (i.mateGids.includes(i.ownerGid)) return 'ownerIsMate';
  return 'ownerIsOpponent';
};
/** ⭐⭐⭐ THE STALE-OWNER TEST — the perceived owner NAMES a body the TRUTH no longer credits
 *  with the ball. ⛔ It fires ONLY when the eyes hold an owner: a perceived `null` owner is not
 *  a stale read, it is a perceived flight. */
const staleOwnerOf = (perceivedOwnerGid: number | null, truthOwnerGid: number | null): boolean =>
  perceivedOwnerGid !== null && perceivedOwnerGid !== truthOwnerGid;
/** ⭐⭐⭐ THE Δt BINS — FROZEN EX ANTE (#415 item 6(5)). Δt = (the release this run is attached
 *  to) − (the run's start), in sim-s. NEGATIVE ⇒ the release came FIRST and the run started onto
 *  a ball ALREADY TRAVELLING; POSITIVE ⇒ the run started BEFORE the pass (the shipped form).
 *  THE ATTACHMENT RULE, frozen: a same-side `pendingPass` ALREADY LIVE at the run-start tick IS
 *  the attached release (⇒ Δt < 0); otherwise the NEXT release by his side (⇒ Δt > 0); a run with
 *  neither is counted in its own cell `noAttachedRelease` and is NOT binned. */
const DT_BINS = ['ltMinus1.0', 'minus1.0toMinus0.5', 'minus0.5to0', '0to0.5', '0.5to1.0',
  '1.0to2.0', 'ge2.0'] as const;
const DT_BIN_EDGES = [-1.0, -0.5, 0, 0.5, 1.0, 2.0] as const;
const dtBin = (v: number): number => {
  for (let i = 0; i < DT_BIN_EDGES.length; i++) if (v < DT_BIN_EDGES[i]) return i;
  return DT_BIN_EDGES.length;
};
/** ⭐⭐⭐ THE FLIGHT'S OUTCOME — off the ENGINE'S OWN records where they exist. */
const OUTCOMES = ['receivedByAMate', 'intercepted', 'outOrDeadBall', 'looseOrExpired',
  'liveAtFullTime'] as const;
type Outcome = (typeof OUTCOMES)[number];
const OCI = (o: Outcome): number => OUTCOMES.indexOf(o);
interface OutcomeInputs { completedBySide: boolean; interceptedByOther: boolean; dead: boolean }
const outcomeOf = (i: OutcomeInputs): Outcome => {
  if (i.completedBySide) return 'receivedByAMate';
  if (i.interceptedByOther) return 'intercepted';
  if (i.dead) return 'outOrDeadBall';
  return 'looseOrExpired';
};
/** ⭐⭐ TOWARD HIM — the CLOSING-SPEED SIGN along runner→ball: the ball's own velocity projected
 *  on the unit vector from the ball to the runner. > 0 ⇒ the flight is coming toward him. */
const towardHim = (bvx: number, bvy: number, dx: number, dy: number): boolean => {
  const d = Math.hypot(dx, dy);
  if (d === 0) return false;
  return (bvx * dx + bvy * dy) / d > 0;
};
/** ⭐⭐ THE RECEIVER'S OWN CLASS at a completed pass (population F / Q4). */
const RECEIVER_CLASSES = ['runningAtRelease', 'startedDuringTheFlight', 'neither'] as const;
type ReceiverClass = (typeof RECEIVER_CLASSES)[number];
const RVI = (c: ReceiverClass): number => RECEIVER_CLASSES.indexOf(c);
const receiverClassOf = (atRelease: boolean, duringFlight: boolean): ReceiverClass => {
  if (atRelease) return 'runningAtRelease';
  if (duringFlight) return 'startedDuringTheFlight';
  return 'neither';
};
/** ⭐⭐ THE LEAK'S OWN PARTITION (population L). */
const LEAK_CELLS = ['stalePasserStillCredited', 'aFreshMateWhoIsNotThePasser', 'anythingElse',
] as const;
type LeakCell = (typeof LEAK_CELLS)[number];
const LKI = (c: LeakCell): number => LEAK_CELLS.indexOf(c);
const leakCellOf = (perceived: PerceivedK, ownerGid: number | null,
  passerGid: number | null): LeakCell => {
  if (perceived !== 'ownerIsMate') return 'anythingElse';
  if (passerGid !== null && ownerGid === passerGid) return 'stalePasserStillCredited';
  return 'aFreshMateWhoIsNotThePasser';
};
const runnerCountRecon = (counter: boolean, tempo: number, urgency: number): number =>
  (counter || tempo > TEMPO_HIGH ? COUNT_HIGH : COUNT_BASE)
  + (urgency > URGENCY_HIGH ? 1 : 0);
const priorOf = (role: Role, localX: number): number =>
  Math.max(0, Math.min(1, (RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV) / RUN_PRIOR_MAX));
const tiredOf = (stamina: number, staminaConservation: number): boolean =>
  stamina < TIRED_STAMINA && staminaConservation > TIRED_CONSERVATION;
const hattedRecon = (inRunners: boolean, isArriver: boolean, isOverlapper: boolean): boolean =>
  inRunners || isArriver || isOverlapper;
const inYieldWindow = (active: boolean, now: number, windowEnd: number): boolean =>
  active || now <= windowEnd;
const episodeSets = (series: readonly boolean[]): number => {
  let n = 0;
  for (let i = 0; i < series.length; i++) if (series[i] && !(i > 0 && series[i - 1])) n += 1;
  return n;
};

/* --- THE FIXTURES (every predicate with a FIRING and a NON-FIRING case) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
fx('coachTick.aTimerAtZeroFires', coachTickFired(0), true);
fx('coachTick.aFullIntervalDoesNOTFire', coachTickFired(TEAM_AI_INTERVAL), false);
fx('decisionTick.zeroFires', decisionTickFired(0, true), true);
fx('decisionTick.aFullIntervalDoesNOT', decisionTickFired(AI_INTERVAL, true), false);
fx('decisionTick.aHELDBodyDoesNOTDecide', decisionTickFired(0, false), false);
fx('pcHold.liveHoldIsHeld', pcHeldRecon({ untilTick: 100 }, 99), true);
fx('pcHold.exactlyAtTheExpiryIsNOTHeld', pcHeldRecon({ untilTick: 100 }, 100), false);
fx('pcHold.noEntryIsNOTHeld', pcHeldRecon(undefined, 0), false);
fx('debtA.bothFormsAreNamed', [...DECISION_TICK_FORMS], ['postStep', 'preStep']);
{
  const pre = new Map<number, { untilTick: number }>();
  const post = new Map<number, { untilTick: number }>([[7, { untilTick: 106 }]]);
  fx('debtA.preStepFormSaysHeDECIDED', decisionTickFired(0, !pcHeldRecon(pre.get(7), 104)), true);
  fx('debtA.postStepFormSaysHeWasHELD',
    decisionTickFired(0, !pcHeldRecon(post.get(7), 104)), false);
}
const BS = (o: Partial<BranchState>): BranchState => ({
  liveCorner: false, crashHeld: false, crossHeld: false, ...o,
});
fx('branch.openPlayIsTheDefault', branchOf(BS({})), 'openPlay');
fx('branch.heldCrashWinsOverCrossFlight',
  branchOf(BS({ crashHeld: true, crossHeld: true })), 'cornerCrashHeld');
fx('branch.aLiveCornerSUPPRESSESTheHeldCrash',
  branchOf(BS({ liveCorner: true, crashHeld: true })), 'liveCorner');
fx('branch.crossFlightFiresAlone', branchOf(BS({ crossHeld: true })), 'crossFlight');
fx('runClass.licensedRunInBehind', runClassOf(WHY_LICENSED), 'licensedRunInBehind');
fx('runClass.arrivingLate', runClassOf(WHY_ARRIVING), 'arrivingLate');
fx('runClass.attackingTheBox', runClassOf(WHY_BOX), 'attackingTheBox');
fx('runClass.oneTwoBurst', runClassOf(WHY_BURST), 'oneTwoBurst');
fx('runClass.overlapping', runClassOf(WHY_OVERLAP), 'overlapping');
fx('runClass.keeperUp', runClassOf(WHY_KEEPERUP), 'keeperUp');
fx('runClass.ownRunInBehindIsITSOWNCLASS', runClassOf(WHY_OWN), 'ownRunInBehind');
fx('runClass.noWhyRecordedCanFire', runClassOf(null), 'noWhyRecorded');
fx('runClass.OTHER_CAN_FIRE', runClassOf('a run nobody wrote'), 'OTHER');
fx('runClass.aNearMissIsNotTheClass', runClassOf(`${WHY_OWN} `), 'OTHER');
fx('runClass.everyNamedClassIsDistinct',
  new Set(RUN_CLASSES_NAMED.map((c) => c as string)).size, RUN_CLASSES_NAMED.length);
/* THE FOUR STATES — every one with a firing and a non-firing case */
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
fx('state.hisOwnRestart', stateOf(ST({ phase: 'restart', restartIsHisSide: true })), 'ownRestart');
fx('state.THEIRRestartIsOther', stateOf(ST({ phase: 'restart' })), 'other');
fx('state.aMateOnTheBallWINSOverEverything',
  stateOf(ST({ ownerIsMate: true, phase: 'restart', restartIsHisSide: true })), 'mateOwnsTheBall');
fx('state.everyStateIsDistinct', new Set(STATES.map((s) => s as string)).size, STATES.length);
/* THE FLIGHT PROVENANCE — each cell fires, each has a negative */
fx('provenance.hisSidesPass', provenanceOf(0 as Side, 0 as Side), 'hisSidesPass');
fx('provenance.theOtherSidesPass', provenanceOf(1 as Side, 0 as Side), 'theOtherSidesPass');
fx('provenance.noPendingPassIsALOOSEBall', provenanceOf(null, 0 as Side), 'noPendingPass');
fx('provenance.hisSideIsNOTTheOtherSides',
  provenanceOf(1 as Side, 1 as Side) === 'theOtherSidesPass', false);
/* THE PERCEIVED-OWNER CLASSIFIER */
const PV = (o: Partial<PerceivedInputs>): PerceivedInputs => ({
  snapshotNull: false, ballNull: false, ownerGid: null, selfGid: 7, mateGids: [8, 9], ...o,
});
fx('perceived.noSnapshot', perceivedOwnerOf(PV({ snapshotNull: true })), 'noSnapshot');
fx('perceived.noBallSeen', perceivedOwnerOf(PV({ ballNull: true })), 'noBallSeen');
fx('perceived.ownerNullISAPerceivedFlight', perceivedOwnerOf(PV({})), 'ownerNull');
fx('perceived.ownerIsSelf', perceivedOwnerOf(PV({ ownerGid: 7 })), 'ownerIsSelf');
fx('perceived.ownerIsMate', perceivedOwnerOf(PV({ ownerGid: 8 })), 'ownerIsMate');
fx('perceived.ownerIsOpponent', perceivedOwnerOf(PV({ ownerGid: 44 })), 'ownerIsOpponent');
fx('perceived.everyCellIsDistinct', new Set(PERCEIVED.map((c) => c as string)).size,
  PERCEIVED.length);
/* THE STALE-OWNER TEST */
fx('stale.aMATEStillCreditedWhileTheTruthHasNoOwnerISSTALE', staleOwnerOf(8, null), true);
fx('stale.aMATEStillCreditedWhileANOTHERBodyHasItISSTALE', staleOwnerOf(8, 9), true);
fx('stale.anAGREEINGReadIsNOTStale', staleOwnerOf(8, 8), false);
fx('stale.aPERCEIVEDFLIGHT_ownerNull_isNOTStale', staleOwnerOf(null, 9), false);
fx('stale.bothNullIsNOTStale', staleOwnerOf(null, null), false);
/* THE Δt BINS — every boundary, from both sides */
fx('dt.wellBeforeTheRunIsTheFIRSTBin', dtBin(-4), 0);
fx('dt.exactlyMinus1IsTheSECONDBin', dtBin(-1.0), 1);
fx('dt.exactlyMinus0point5IsTheTHIRDBin', dtBin(-0.5), 2);
fx('dt.exactlyZEROIsThePOSITIVESide', dtBin(0), 3);
fx('dt.aHairBELOWZeroIsTheNEGATIVESide', dtBin(-1e-9), 2);
fx('dt.exactly0point5', dtBin(0.5), 4);
fx('dt.exactly1point0', dtBin(1.0), 5);
fx('dt.exactly2point0IsTheOPENTopBin', dtBin(2.0), 6);
fx('dt.wellAfterIsTheOPENTopBin', dtBin(99), 6);
fx('dt.thereAreSEVENBins', DT_BINS.length, 7);
fx('dt.theBinsPartitionTheLine',
  [-2, -0.75, -0.25, 0.25, 0.75, 1.5, 5].map(dtBin), [0, 1, 2, 3, 4, 5, 6]);
/* THE FLIGHT OUTCOME */
const OI = (o: Partial<OutcomeInputs>): OutcomeInputs => ({
  completedBySide: false, interceptedByOther: false, dead: false, ...o,
});
fx('outcome.receivedByAMate', outcomeOf(OI({ completedBySide: true })), 'receivedByAMate');
fx('outcome.intercepted', outcomeOf(OI({ interceptedByOther: true })), 'intercepted');
fx('outcome.outOrDeadBall', outcomeOf(OI({ dead: true })), 'outOrDeadBall');
fx('outcome.looseOrExpiredIsTheRESIDUAL', outcomeOf(OI({})), 'looseOrExpired');
fx('outcome.aCOMPLETIONBeatsADeadBall',
  outcomeOf(OI({ completedBySide: true, dead: true })), 'receivedByAMate');
/* TOWARD HIM */
fx('toward.aBallFlyingATHimIsTOWARD', towardHim(1, 0, 5, 0), true);
fx('toward.aBallFlyingAWAYIsNOT', towardHim(-1, 0, 5, 0), false);
fx('toward.aBallFLYINGACROSSIsNOT', towardHim(0, 1, 5, 0), false);
fx('toward.aZeroSeparationIsNOT', towardHim(1, 0, 0, 0), false);
/* THE RECEIVER'S CLASS */
fx('receiver.runningAtRelease', receiverClassOf(true, false), 'runningAtRelease');
fx('receiver.startedDuringTheFlight', receiverClassOf(false, true), 'startedDuringTheFlight');
fx('receiver.neither', receiverClassOf(false, false), 'neither');
fx('receiver.atReleaseWINSOverDuringFlight', receiverClassOf(true, true), 'runningAtRelease');
/* THE LEAK PARTITION */
fx('leak.theSTALEPasserStillCredited', leakCellOf('ownerIsMate', 8, 8),
  'stalePasserStillCredited');
fx('leak.aFRESHMateWhoIsNotThePasser', leakCellOf('ownerIsMate', 9, 8),
  'aFreshMateWhoIsNotThePasser');
fx('leak.noPendingPassAtAllIsFRESHMate', leakCellOf('ownerIsMate', 9, null),
  'aFreshMateWhoIsNotThePasser');
fx('leak.aPerceivedFLIGHTIsANYTHINGELSE', leakCellOf('ownerNull', null, 8), 'anythingElse');
fx('leak.anOPPONENTReadIsANYTHINGELSE', leakCellOf('ownerIsOpponent', 44, 8), 'anythingElse');
fx('leak.theCellsPartition', new Set(LEAK_CELLS.map((c) => c as string)).size, LEAK_CELLS.length);
/* THE INHERITED HELPERS */
fx('count.baseIsOne', runnerCountRecon(false, 0.5, 0.5), 1);
fx('count.counterAttackMakesTwo', runnerCountRecon(true, 0.5, 0.5), 2);
fx('count.tempoExactlyAtTheGateDoesNOT', runnerCountRecon(false, 0.65, 0.5), 1);
fx('count.theReconstructionAGREESWithTheEnginesOwnFunction', (() => {
  let ok = true;
  for (const md of ['BuildUp', 'Attack', 'Defend', 'Press', 'CounterAttack',
    'ResetShape'] as const) {
    for (const tp of [0, 0.65, 0.66, 1]) {
      for (const ug of [0, 0.65, 0.66, 1]) {
        if (runnerCount(md, tp, ug) !== runnerCountRecon(md === 'CounterAttack', tp, ug)) ok = false;
      }
    }
  }
  return ok;
})(), true);
fx('prior.aStrikerOnTheGoalLineIsExactlyOne', priorOf('ST', HALF_L), 1);
fx('prior.aDeepDFIsClampedToZero', priorOf('DF', -31.5), 0);
fx('prior.aDFJustInsideTheBiteIsNotZero', priorOf('DF', -17) > 0, true);
fx('tired.aFreshBodyIsNotTired', tiredOf(0.9, 0.9), false);
fx('tired.aSpentBodyWithAConservingCoachIs', tiredOf(0.3, 0.9), true);
fx('tired.aSpentBodyWithoutTheGeneIsNOT', tiredOf(0.3, 0.4), false);
fx('guard.aRunnerIsHATTED', hattedRecon(true, false, false), true);
fx('guard.anUNHATTEDBodyIsNOT', hattedRecon(false, false, false), false);
fx('episode.setThenClearIsONEEpisode', episodeSets([false, true, true, true, false]), 1);
fx('episode.twoSeparateSetsAreTWO', episodeSets([true, false, true, false]), 2);
fx('episode.aHeldRunIsONEEpisode', episodeSets([true, true, true, true]), 1);
fx('episode.neverSetIsZero', episodeSets([false, false]), 0);
fx('episode.windowIsOpenWhileActive', inYieldWindow(true, 100, -1), true);
fx('episode.windowIsOpenAfterTheClear', inYieldWindow(false, 100, 105), true);
fx('episode.windowIsSHUTBeyondTheClear', inYieldWindow(false, 106, 105), false);
fx('episode.theWindowIsTheStoredConstant', YIELD_WINDOW_SECONDS, 6);
fx('literals.allExtractedFromTheAnchoredLines', LITERALS_OK, true);
fx('arms.theFourArmsAndTheirFlagKinds', ARMS.map((a) => ARM_KIND[a]),
  ['HATS', 'OWN', 'OWNCOOP', 'HATS']);
fx('arms.theTableIsWELLFORMED', ARMS_OK, true);
fx('noDose.theSeatIsABSENTOnEVERYArm', OBM_SEAT_ABSENT_ON_EVERY_ARM, true);

/* ========================================================================== */
/* §8 THE FROZEN BINS AND THE PER-SEED ROW                                     */
/* ========================================================================== */
const RUN_COUNT_BINS = 5;
const EPW_BIN = 6;
const EPW_BINS = Math.ceil(WALL_LICENCE_TICKS / EPW_BIN) + 2;
const EPW_TOP_EDGE = (EPW_BINS - 1) * EPW_BIN;
const R1_BINS = 7;
const R1_FLOOD_AT = 3;
const AGE_BIN = 3; const AGE_BINS = 21;          /* perceived `ageTicks`, 3-tick cells, 60+ open */
const FLIGHT_AGE_BIN = 0.1; const FLIGHT_AGE_BINS = 36; /* truth flight age, 0.1 s cells, 3.5+ */
const REL_RUNNER_BINS = 5;                        /* mates already running at a release: 0…4+ */
const ROLES4 = ['DF', 'MF', 'WG', 'ST'] as const;
const RI = (r: string): number => {
  const i = (ROLES4 as readonly string[]).indexOf(r);
  return i < 0 ? -1 : i;
};
const NC = RUN_CLASSES.length;
const NS = STATES.length;

interface Row {
  ticks: number; wallMs: number; signature: string;
  /* --- WORLD / ARM RECEIPTS (DS-T1d's, by recipe) --- */
  bqVersion: number; lnVersion: number; gkVersion: number;
  worldOk: boolean; edsChoiceOn: boolean; seamsAbsent: boolean; genomeClean: boolean;
  pcSeatPresent: boolean; pcHoldsReadable: boolean;
  otherSeamsAbsent: boolean; dsOwnRunFlag: boolean; dsHatsOffFlag: boolean;
  dsCoopHatsOffFlag: boolean; obmFlag: boolean;
  matrixOnBaseEff: boolean; infoGenomeCleanOfMatrix: boolean; policyCacheEntries: number;
  /* --- THE INHERITED CORE (the G-REPRO field set) --- */
  coachTicks: number; coachTicksInPossession: number; branchTicks: number[];
  runCountBins: number[]; runnerCountSum: number; runnerDesignations: number;
  runnersByRole: number[];
  openPlayCoachTicks: number; openPlayBoardEmptyTicks: number;
  offBallDecisionTicksPost: number; offBallActionTicksPost: number[]; makeRunTicksPost: number;
  runClassTicks: number[]; keeperRunClassTicks: number[]; runClassTicksKeeper: number;
  keeperDecisionTicksPost: number;
  heldBodyTicksPre: number; heldBodyTicksPost: number; ledgerDecisionsHeld: number;
  decidedBodyTicksPre: number; decidedBodyTicksPost: number;
  r1TeamTicks: number; r1Bins: number[]; r1RunnerSum: number; r1FloodTicks: number;
  r1RunnersByRole: number[];
  stateRunDecisions: number[]; stateAllDecisions: number[];
  wallEligiblePasses: number; wallFires: number; wallOneTwosStat: number;
  overlapSets: number; overlapArrivedStat: number; arriverSets: number;
  goalRowsJoinedAtThePush: number; goalRowsUnjoinable: number;
  carrierDecisionTicks: number;
  crowdSampleTicks: number; crowdSamples: number; crashHits: number;
  guardPairsTotal: number; guardPairsUnder4: number; guardU4Sum: number; guardU4N: number;
  goals: number; shots: number; passes: number; passesCompleted: number;
  interceptions: number; offsides: number; throughBallsStat: number; xgSum: number;
  possessionTimeOwn: number[]; thirdManStat: number;
  shotLogRows: number; shotsJoinedToAShooter: number;
  /* --- ⭐⭐⭐ POPULATION R — EVERY RUN EPISODE, STAMPED AT ITS START --- */
  epStarts: number[];            /* [state][why] */
  epStartsAll: number;
  epTicksTotal: number; runEpTickBins: number[]; runEpActiveAtFullTime: number;
  epAimed: number[]; epCompleted: number[]; runEpShots: number[]; runEpGoals: number[];
  epStartsInFlightProvenance: number[];      /* [prov][why] */
  epFlightAgeBins: number[];                 /* truth flight age at an in-flight start */
  epInFlightIntended: number[];              /* [why] — he IS `pendingPass.targetGid` */
  epInFlightToward: number[];                /* [why] — the flight closes on him */
  epInFlightOwnSidePass: number[];           /* [why] — the denominator of the two above */
  epInFlightOutcome: number[];               /* [outcome][why] */
  epInFlightOutcomeIntended: number[];       /* [outcome] on the INTENDED-receiver subset */
  /* --- THE PERCEIVED STAMP (arms carrying `dsOwnRun` only) --- */
  instrumentPulls: number;
  epPerceived: number[];                     /* [perceivedCell][why] */
  epPerceivedByState: number[];              /* [state][perceivedCell] */
  epPerceivedAgeBins: number[];              /* perceived `ageTicks` at a stamped start */
  epPerceivedStale: number[];                /* [why] — THE STALE-OWNER LEAK, counted */
  epPerceivedStamped: number[];              /* [why] — the pull's own denominator */
  epPerceivedStaleByState: number[];         /* [state] */
  epPerceivedStampedByState: number[];       /* [state] */
  /* --- ⭐⭐⭐ THE TIMING FACT Δt --- */
  epDtBins: number[];                        /* [bin][why] */
  epDtAttachedLive: number[];                /* [why] — attached to a LIVE same-side flight */
  epDtAttachedNext: number[];                /* [why] — attached to the NEXT release */
  epDtNoAttachedRelease: number[];           /* [why] — never binned, COUNTED */
  epDtBinsByState: number[];                 /* [bin][state] */
  /* --- ⭐⭐⭐ POPULATION L — THE LEAK ANATOMY --- */
  leakCells: number[];                       /* [leakCell] on own runs starting in flight */
  leakAgeBins: number[];                     /* perceived ageTicks on those same runs */
  leakFlightAgeBins: number[];               /* the TRUTH flight age on those same runs */
  leakOwnRunsInFlight: number;
  /* --- ⭐⭐⭐ POPULATION F — EVERY PASS RELEASE BY THE SIDE IN POSSESSION --- */
  releases: number; releaseRunnerBins: number[]; releaseRunnerSum: number;
  releaseStartsDuringFlight: number[];       /* [why] */
  releaseFlightTicks: number;
  releasesResolved: number[];                /* [outcome] */
  receiverClass: number[];                   /* [receiverClass] on a completed release */
  receiverIsIntended: number;
  receiverClassIntended: number[];           /* [receiverClass] on the INTENDED receiver only */
}
const emptyRow = (): Row => ({
  ticks: 0, wallMs: 0, signature: '',
  bqVersion: 0, lnVersion: 0, gkVersion: 0,
  worldOk: false, edsChoiceOn: false, seamsAbsent: false, genomeClean: false,
  pcSeatPresent: false, pcHoldsReadable: false,
  otherSeamsAbsent: false, dsOwnRunFlag: false, dsHatsOffFlag: false,
  dsCoopHatsOffFlag: false, obmFlag: false,
  matrixOnBaseEff: false, infoGenomeCleanOfMatrix: false, policyCacheEntries: 0,
  coachTicks: 0, coachTicksInPossession: 0, branchTicks: zeros(BRANCHES.length),
  runCountBins: zeros(RUN_COUNT_BINS), runnerCountSum: 0, runnerDesignations: 0,
  runnersByRole: zeros(ROLES4.length),
  openPlayCoachTicks: 0, openPlayBoardEmptyTicks: 0,
  offBallDecisionTicksPost: 0, offBallActionTicksPost: zeros(ACTION_CELLS.length),
  makeRunTicksPost: 0, runClassTicks: zeros(NC), keeperRunClassTicks: zeros(NC),
  runClassTicksKeeper: 0, keeperDecisionTicksPost: 0,
  heldBodyTicksPre: 0, heldBodyTicksPost: 0, ledgerDecisionsHeld: 0,
  decidedBodyTicksPre: 0, decidedBodyTicksPost: 0,
  r1TeamTicks: 0, r1Bins: zeros(R1_BINS), r1RunnerSum: 0, r1FloodTicks: 0,
  r1RunnersByRole: zeros(ROLES4.length),
  stateRunDecisions: zeros(2 * NS), stateAllDecisions: zeros(NS),
  wallEligiblePasses: 0, wallFires: 0, wallOneTwosStat: 0,
  overlapSets: 0, overlapArrivedStat: 0, arriverSets: 0,
  goalRowsJoinedAtThePush: 0, goalRowsUnjoinable: 0, carrierDecisionTicks: 0,
  crowdSampleTicks: 0, crowdSamples: 0, crashHits: 0,
  guardPairsTotal: 0, guardPairsUnder4: 0, guardU4Sum: 0, guardU4N: 0,
  goals: 0, shots: 0, passes: 0, passesCompleted: 0,
  interceptions: 0, offsides: 0, throughBallsStat: 0, xgSum: 0,
  possessionTimeOwn: [0, 0], thirdManStat: 0, shotLogRows: 0, shotsJoinedToAShooter: 0,
  epStarts: zeros(NS * NC), epStartsAll: 0,
  epTicksTotal: 0, runEpTickBins: zeros(EPW_BINS), runEpActiveAtFullTime: 0,
  epAimed: zeros(NS * NC), epCompleted: zeros(NS * NC), runEpShots: zeros(NS * NC),
  runEpGoals: zeros(NS * NC),
  epStartsInFlightProvenance: zeros(PROVENANCES.length * NC),
  epFlightAgeBins: zeros(FLIGHT_AGE_BINS),
  epInFlightIntended: zeros(NC), epInFlightToward: zeros(NC), epInFlightOwnSidePass: zeros(NC),
  epInFlightOutcome: zeros(OUTCOMES.length * NC),
  epInFlightOutcomeIntended: zeros(OUTCOMES.length),
  instrumentPulls: 0,
  epPerceived: zeros(PERCEIVED.length * NC), epPerceivedByState: zeros(NS * PERCEIVED.length),
  epPerceivedAgeBins: zeros(AGE_BINS), epPerceivedStale: zeros(NC),
  epPerceivedStamped: zeros(NC), epPerceivedStaleByState: zeros(NS),
  epPerceivedStampedByState: zeros(NS),
  epDtBins: zeros(DT_BINS.length * NC), epDtAttachedLive: zeros(NC),
  epDtAttachedNext: zeros(NC), epDtNoAttachedRelease: zeros(NC),
  epDtBinsByState: zeros(DT_BINS.length * NS),
  leakCells: zeros(LEAK_CELLS.length), leakAgeBins: zeros(AGE_BINS),
  leakFlightAgeBins: zeros(FLIGHT_AGE_BINS), leakOwnRunsInFlight: 0,
  releases: 0, releaseRunnerBins: zeros(REL_RUNNER_BINS), releaseRunnerSum: 0,
  releaseStartsDuringFlight: zeros(NC), releaseFlightTicks: 0,
  releasesResolved: zeros(OUTCOMES.length), receiverClass: zeros(RECEIVER_CLASSES.length),
  receiverIsIntended: 0, receiverClassIntended: zeros(RECEIVER_CLASSES.length),
});

/* ========================================================================== */
/* §9 THE WALK — public state and the engine's own decision record, read BEFORE and AFTER
   `match.step(DT)`. THE ONE ADDED READ is the declared percept pull inside the arm's flag.   */
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
interface MatchView {
  bqCushion?: boolean; lnOwnLanePrice?: boolean; gkDiveBody?: boolean;
  edsPerceivedChoice?: boolean; obmMovement?: boolean; ctbSupportPlane?: boolean;
  rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
  dsOwnRun?: boolean; dsHatsOff?: boolean; dsCoopHatsOff?: boolean;
  obmPolicies?: Map<number, unknown>;
  pcLatency: {
    holds?: Map<number, { untilTick: number }>;
    ledger?: { decisionsHeld: number };
  } | null;
}
interface LiveFlight {
  key: string; side: Side; passerGid: number; targetGid: number; t: number;
  atRelease: Set<number>; during: Set<number>;
}
interface AwaitingRun { side: Side; t: number; why: number; state: number }
interface AwaitingOutcome { key: string; why: number; intended: boolean }

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as MatchView;
  const kind = ARM_KIND[arm];
  const armPulls = mm.dsOwnRun === true;
  row.bqVersion = bqArmedVersion(m);
  row.lnVersion = lnArmedVersion(m);
  row.gkVersion = gkArmedVersion(m);
  row.edsChoiceOn = mm.edsPerceivedChoice === true;
  row.seamsAbsent = mm.obmMovement !== true && mm.ctbSupportPlane !== true
    && mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.otherSeamsAbsent = mm.ctbSupportPlane !== true && mm.rcAnticipate !== true
    && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.dsOwnRunFlag = mm.dsOwnRun === true;
  row.dsHatsOffFlag = mm.dsHatsOff === true;
  row.dsCoopHatsOffFlag = mm.dsCoopHatsOff === true;
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
  const mateGids: number[][] = [[], []];
  for (const p of players) mateGids[p.side as Side].push(p.gid);
  /* ---- POPULATION R's per-body episode state ---- */
  const runActive = new Array<boolean>(n).fill(false);
  const epState = zeros(n); const epWhy = zeros(n);
  const epWindowEnd = new Array<number>(n).fill(-1);
  const epRunTicks = zeros(n);
  /* the yield window keeps the LAST episode's (state, why) after the clear */
  const epLastState = zeros(n); const epLastWhy = zeros(n);
  /* ---- DEBT (b): the shooter gid banked AT THE SHOT'S PUSH ---- */
  const shooterByLogIndex = new Map<number, number>();
  /* ---- pre-step scratch ---- */
  const preDecision = zeros(n);
  const preX = zeros(n); const preY = zeros(n);
  const preAction = new Array<string>(n).fill('');
  const notHeldPre = new Array<boolean>(n).fill(true);
  const notHeldPost = new Array<boolean>(n).fill(true);
  const preState = new Array<number>(n).fill(SI('other'));
  let prevPassKey = '';
  let prevCompletedKey = '';
  let prevShotRows = 0;
  const seenOutcome: string[] = [];
  let prevOneTwos = 0; let prevOverlaps = 0; let prevThirdMan = 0;
  let prevOverlapper: (number | null)[] = [null, null];
  let prevArriver: (number | null)[] = [null, null];
  let prevLedgerHeld = pcLedger === null ? 0 : pcLedger.decisionsHeld;
  let prevInterceptions: number[] = [0, 0];
  let liveFlight: LiveFlight | null = null;
  const awaitingRuns: AwaitingRun[] = [];
  const awaitingOutcomes: AwaitingOutcome[] = [];
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
    const ballXBefore = m.ball.pos.x; const ballYBefore = m.ball.pos.y;
    const ballVxBefore = m.ball.vel.x; const ballVyBefore = m.ball.vel.y;
    const brainBefore: number[] = [m.teams[0].brainTimer, m.teams[1].brainTimer];
    const crashHeldBefore: boolean[] = [false, false];
    const crossHeldBefore: boolean[] = [false, false];
    const liveCornerBefore: boolean[] = [false, false];
    for (const s of [0, 1] as const) {
      const t = m.teams[s];
      const clock = simTimeBefore + DT;
      liveCornerBefore[s] = m.phase === 'restart' && m.restart !== null
        && m.restart.kind === 'corner' && m.restart.side === s;
      crashHeldBefore[s] = !liveCornerBefore[s] && t.cornerCrash !== null
        && clock < t.cornerCrash.until;
      crossHeldBefore[s] = t.crossFlight !== null && clock < t.crossFlight.until
        && ownerBefore === null;
    }
    const ppB = m.pendingPass;
    const ppBefore = ppB === null ? null : {
      side: ppB.side as Side, passerGid: ppB.passerGid, targetGid: ppB.targetGid, t: ppB.t,
    };
    for (let i = 0; i < n; i++) {
      const p = players[i];
      preDecision[i] = p.decisionTimer;
      preX[i] = p.pos.x; preY[i] = p.pos.y;
      preAction[i] = p.action.type as string;
      notHeldPre[i] = pcHolds === null || !pcHeldRecon(pcHolds.get(p.gid), simTickBefore + 1);
      preState[i] = SI(stateOf({
        ownerIsMate: ownerBefore !== null && ownerBefore !== p && ownerBefore.side === p.side,
        ownerIsNull: ownerBefore === null,
        phase: phaseBefore as string,
        possessionIsHisSide: possBefore === p.side,
        restartIsHisSide: restartBefore !== null && restartBefore.side === p.side,
      }));
    }
    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      if (ownerBefore !== p) continue;
      if (!decisionTickFired(preDecision[i], notHeldPre[i])) continue;
      row.carrierDecisionTicks += 1;
    }
    prevPassKey = ppB === null ? '' : `${ppB.t}|${ppB.passerGid}|${ppB.targetGid}`;
    prevCompletedKey = m.lastCompletedPass === null ? ''
      : `${m.lastCompletedPass.t}|${m.lastCompletedPass.passerGid}|`
        + `${m.lastCompletedPass.receiverGid}`;
    prevShotRows = m.shotLog.length;
    for (let j = 0; j < prevShotRows; j++) seenOutcome[j] = m.shotLog[j].outcome;
    prevOneTwos = m.teams[0].stats.oneTwos + m.teams[1].stats.oneTwos;
    prevOverlaps = m.teams[0].stats.overlaps + m.teams[1].stats.overlaps;
    prevThirdMan = m.teams[0].stats.thirdMan + m.teams[1].stats.thirdMan;
    prevOverlapper = [m.teams[0].overlapper, m.teams[1].overlapper];
    prevArriver = [m.teams[0].arriver, m.teams[1].arriver];
    prevLedgerHeld = pcLedger === null ? 0 : pcLedger.decisionsHeld;
    prevInterceptions = [m.teams[0].stats.interceptions, m.teams[1].stats.interceptions];

    m.step(DT);
    row.ticks += 1;

    /* ---------- AFTER THE STEP ---------- */
    const simTime = m.simTime;
    const simTick = m.simTick;
    const phaseAfter = m.phase;
    const truthOwnerGid = m.ball.owner === null ? null : m.ball.owner.gid;
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

    /* --- POPULATION A — the board (DS-C0's, re-walked) --- */
    for (const s of [0, 1] as const) {
      if (!coachTickFired(brainBefore[s])) continue;
      const team = m.teams[s];
      row.coachTicks += 1;
      if (possBefore !== s) continue;
      row.coachTicksInPossession += 1;
      const br = branchOf({
        liveCorner: liveCornerBefore[s], crashHeld: crashHeldBefore[s],
        crossHeld: crossHeldBefore[s],
      });
      row.branchTicks[BRI(br)] += 1;
      const rc = team.runners.size;
      row.runCountBins[rc >= RUN_COUNT_BINS ? RUN_COUNT_BINS - 1 : rc] += 1;
      row.runnerCountSum += rc;
      row.runnerDesignations += rc;
      for (const ri of team.runners) {
        const k = RI(team.players[ri].role as string);
        if (k >= 0) row.runnersByRole[k] += 1;
      }
      if (br === 'openPlay') {
        row.openPlayCoachTicks += 1;
        if (rc === 0 && team.arriver === null) row.openPlayBoardEmptyTicks += 1;
      }
    }

    /* --- POPULATION B — the attacking off-ball decision ticks (POST-STEP holds) --- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      if (p.sentOff) continue;
      if (possBefore !== p.side) continue;
      if (!decisionTickFired(preDecision[i], notHeldPost[i])) continue;
      const why = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      const type = p.action.type as string;
      if (p.role === 'GK') {
        row.keeperDecisionTicksPost += 1;
        if (type === 'MakeRun') {
          row.runClassTicksKeeper += 1;
          row.keeperRunClassTicks[RCI(runClassOf(why))] += 1;
        }
        continue;
      }
      if (ownerBefore === p) continue;
      row.offBallDecisionTicksPost += 1;
      row.offBallActionTicksPost[AI(type)] += 1;
      row.stateAllDecisions[preState[i]] += 1;
      if (type !== 'MakeRun') continue;
      row.makeRunTicksPost += 1;
      const rcls = runClassOf(why);
      row.runClassTicks[RCI(rcls)] += 1;
      const isOwn = rcls === 'ownRunInBehind';
      const isHat = (HAT_CLASSES_SIX as readonly string[]).includes(rcls as string);
      if (isOwn || isHat) row.stateRunDecisions[(isOwn ? 1 : 0) * NS + preState[i]] += 1;
    }

    /* --- R1 — EXECUTED runs per in-possession OPEN-PLAY team-tick --- */
    for (const s of [0, 1] as const) {
      if (m.possessionSide !== s) continue;
      if (m.phase !== 'playing') continue;
      const team = m.teams[s];
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

    /* --- ⭐⭐⭐ POPULATION R — EVERY RUN EPISODE, STAMPED AT ITS START TICK --- */
    for (let i = 0; i < n; i++) {
      const p = players[i];
      const side = p.side as Side;
      const runNow = (p.action.type as string) === 'MakeRun';
      const why = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      const whyIdx = RCI(runClassOf(why));
      if (runNow && !runActive[i]) {
        /* ---- THE STAMP ---- */
        const st = preState[i];
        row.epStartsAll += 1;
        row.epStarts[st * NC + whyIdx] += 1;
        epState[i] = st; epWhy[i] = whyIdx; epRunTicks[i] = 0;
        epLastState[i] = st; epLastWhy[i] = whyIdx;
        /* (1) the TRUTH state, and inside `ballInFlight` the flight's PROVENANCE and AGE */
        if (st === SI('ballInFlight')) {
          const prov = provenanceOf(ppBefore === null ? null : ppBefore.side, side);
          row.epStartsInFlightProvenance[PVI(prov) * NC + whyIdx] += 1;
          if (ppBefore !== null) {
            row.epFlightAgeBins[binOf(simTimeBefore - ppBefore.t, FLIGHT_AGE_BIN,
              FLIGHT_AGE_BINS)] += 1;
          }
          if (prov === 'hisSidesPass' && ppBefore !== null) {
            row.epInFlightOwnSidePass[whyIdx] += 1;
            const intended = ppBefore.targetGid === p.gid;
            if (intended) row.epInFlightIntended[whyIdx] += 1;
            if (towardHim(ballVxBefore, ballVyBefore, preX[i] - ballXBefore,
              preY[i] - ballYBefore)) row.epInFlightToward[whyIdx] += 1;
            awaitingOutcomes.push({
              key: `${ppBefore.t}|${ppBefore.passerGid}|${ppBefore.targetGid}`,
              why: whyIdx, intended,
            });
          }
        }
        /* (5) THE TIMING FACT — the ATTACHMENT RULE, frozen at §P */
        if (ppBefore !== null && ppBefore.side === side) {
          const dt = ppBefore.t - simTimeBefore;
          row.epDtBins[dtBin(dt) * NC + whyIdx] += 1;
          row.epDtBinsByState[dtBin(dt) * NS + st] += 1;
          row.epDtAttachedLive[whyIdx] += 1;
        } else {
          awaitingRuns.push({ side, t: simTimeBefore, why: whyIdx, state: st });
        }
        /* population F — a run STARTED during a live flight of his own side */
        if (liveFlight !== null && liveFlight.side === side) {
          liveFlight.during.add(p.gid);
          row.releaseStartsDuringFlight[whyIdx] += 1;
        }
        /* (2) THE PERCEIVED STAMP — ONE pull, INSIDE the arm's own flag */
        if (armPulls) {
          const snap = m.perceivedSnapshot(p);
          row.instrumentPulls += 1;
          const seenBall = snap === null ? null : snap.ball;
          const ownerGid = seenBall === null ? null : seenBall.ownerGid;
          const cell = perceivedOwnerOf({
            snapshotNull: snap === null, ballNull: snap !== null && seenBall === null,
            ownerGid, selfGid: p.gid, mateGids: mateGids[side],
          });
          row.epPerceived[PCI(cell) * NC + whyIdx] += 1;
          row.epPerceivedByState[st * PERCEIVED.length + PCI(cell)] += 1;
          row.epPerceivedStamped[whyIdx] += 1;
          row.epPerceivedStampedByState[st] += 1;
          if (seenBall !== null) {
            row.epPerceivedAgeBins[binOf(seenBall.ageTicks, AGE_BIN, AGE_BINS)] += 1;
          }
          const stale = staleOwnerOf(ownerGid, truthOwnerGid);
          if (stale) {
            row.epPerceivedStale[whyIdx] += 1;
            row.epPerceivedStaleByState[st] += 1;
          }
          /* ---- POPULATION L — THE LEAK ANATOMY ---- */
          if (whyIdx === RCI('ownRunInBehind') && st === SI('ballInFlight')) {
            row.leakOwnRunsInFlight += 1;
            row.leakCells[LKI(leakCellOf(cell, ownerGid,
              ppBefore === null ? null : ppBefore.passerGid))] += 1;
            if (seenBall !== null) {
              row.leakAgeBins[binOf(seenBall.ageTicks, AGE_BIN, AGE_BINS)] += 1;
            }
            if (ppBefore !== null) {
              row.leakFlightAgeBins[binOf(simTimeBefore - ppBefore.t, FLIGHT_AGE_BIN,
                FLIGHT_AGE_BINS)] += 1;
            }
          }
        }
      }
      if (runNow) { row.epTicksTotal += 1; epRunTicks[i] += 1; }
      if (!runNow && runActive[i]) {
        epWindowEnd[i] = simTime + YIELD_WINDOW_SECONDS;
        row.runEpTickBins[binOf(epRunTicks[i], EPW_BIN, EPW_BINS)] += 1;
      }
      runActive[i] = runNow;
    }

    /* --- THE OVERLAP / ARRIVER SETS, off the fields' own transitions --- */
    for (const s of [0, 1] as const) {
      const t = m.teams[s];
      if (t.overlapper !== null && t.overlapper !== prevOverlapper[s]) row.overlapSets += 1;
      if (t.arriver !== null && t.arriver !== prevArriver[s]) row.arriverSets += 1;
    }

    /* --- THE AIM LEDGER: a RELEASE, the episode-yield join, and the wall trigger --- */
    const pp = m.pendingPass;
    const passKey = pp === null ? '' : `${pp.t}|${pp.passerGid}|${pp.targetGid}`;
    /* (a) a flight RESOLVES when its key leaves the ledger */
    if (liveFlight !== null && passKey !== liveFlight.key) {
      const lc = m.lastCompletedPass;
      const completedKey = lc === null ? ''
        : `${lc.t}|${lc.passerGid}|${lc.receiverGid}`;
      const completedNow = lc !== null && completedKey !== prevCompletedKey
        && lc.passerGid === liveFlight.passerGid;
      const other = 1 - liveFlight.side;
      const interceptedNow = m.teams[other].stats.interceptions > prevInterceptions[other];
      const oc = outcomeOf({
        completedBySide: completedNow, interceptedByOther: interceptedNow,
        dead: phaseAfter !== 'playing',
      });
      row.releasesResolved[OCI(oc)] += 1;
      for (const aw of awaitingOutcomes) {
        if (aw.key !== liveFlight.key) continue;
        row.epInFlightOutcome[OCI(oc) * NC + aw.why] += 1;
        if (aw.intended) row.epInFlightOutcomeIntended[OCI(oc)] += 1;
      }
      /* ⭐ a run can only await the flight that is live; once it resolves, NOTHING can
       * still be awaiting, so the list is emptied rather than filtered (a stale entry would
       * otherwise be credited to a LATER flight). */
      awaitingOutcomes.length = 0;
      if (completedNow && lc !== null) {
        const cls = receiverClassOf(liveFlight.atRelease.has(lc.receiverGid),
          liveFlight.during.has(lc.receiverGid));
        row.receiverClass[RVI(cls)] += 1;
        if (lc.receiverGid === liveFlight.targetGid) {
          row.receiverIsIntended += 1;
          row.receiverClassIntended[RVI(cls)] += 1;
        }
      }
      liveFlight = null;
    }
    if (liveFlight !== null) row.releaseFlightTicks += 1;
    /* (b) a NEW release ENTERS the ledger */
    if (pp !== null && passKey !== prevPassKey) {
      row.releases += 1;
      const side = pp.side as Side;
      const atRelease = new Set<number>();
      for (const q of m.teams[side].players) {
        if (q.sentOff || q.role === 'GK') continue;
        const qi = idxOfGid.get(q.gid) ?? -1;
        if (qi >= 0 && runActive[qi]) atRelease.add(q.gid);
      }
      row.releaseRunnerBins[atRelease.size >= REL_RUNNER_BINS ? REL_RUNNER_BINS - 1
        : atRelease.size] += 1;
      row.releaseRunnerSum += atRelease.size;
      liveFlight = { key: passKey, side, passerGid: pp.passerGid, targetGid: pp.targetGid,
        t: pp.t, atRelease, during: new Set<number>() };
      /* the Δt RESOLUTION — every awaiting run of THIS side attaches to THIS release */
      for (let q = awaitingRuns.length - 1; q >= 0; q--) {
        const aw = awaitingRuns[q];
        if (aw.side !== side) continue;
        const dt = pp.t - aw.t;
        row.epDtBins[dtBin(dt) * NC + aw.why] += 1;
        row.epDtBinsByState[dtBin(dt) * NS + aw.state] += 1;
        row.epDtAttachedNext[aw.why] += 1;
        awaitingRuns.splice(q, 1);
      }
      /* the EPISODE-YIELD join: a pass AIMED at a body inside his run window */
      const ti = idxOfGid.get(pp.targetGid) ?? -1;
      if (ti >= 0 && inYieldWindow(runActive[ti], simTime, epWindowEnd[ti])) {
        const st = runActive[ti] ? epState[ti] : epLastState[ti];
        const wy = runActive[ti] ? epWhy[ti] : epLastWhy[ti];
        row.epAimed[st * NC + wy] += 1;
      }
      /* the WALL trigger's own denominator and the engine's own fire */
      const pi = idxOfGid.get(pp.passerGid) ?? -1;
      const ground = m.lastPassKind !== null && m.lastPassKind.kind === 'pass'
        && m.lastPassKind.t === simTime;
      if (ground && pi >= 0 && ti >= 0 && players[pi].role !== 'GK') {
        row.wallEligiblePasses += 1;
        const wr = players[pi].wallRun;
        if (wr !== null && wr.partnerGid === players[ti].gid
          && Math.abs(wr.until - (simTime + WALL_WINDOW)) < 1e-9) row.wallFires += 1;
      }
    }
    /* --- THE COMPLETION RECORD (the episode-yield join's second half) --- */
    const lcNow = m.lastCompletedPass;
    const completedKeyNow = lcNow === null ? ''
      : `${lcNow.t}|${lcNow.passerGid}|${lcNow.receiverGid}`;
    if (lcNow !== null && completedKeyNow !== prevCompletedKey) {
      const ri2 = idxOfGid.get(lcNow.receiverGid) ?? -1;
      if (ri2 >= 0 && inYieldWindow(runActive[ri2], simTime, epWindowEnd[ri2])) {
        const st = runActive[ri2] ? epState[ri2] : epLastState[ri2];
        const wy = runActive[ri2] ? epWhy[ri2] : epLastWhy[ri2];
        row.epCompleted[st * NC + wy] += 1;
      }
    }
    /* --- THE SHOT LEDGER: new rows joined to `pendingShot.shooterGid` AT THE PUSH --- */
    if (m.shotLog.length > prevShotRows) {
      for (let j = prevShotRows; j < m.shotLog.length; j++) {
        row.shotLogRows += 1;
        const ps = m.pendingShot;
        const shooterGid = ps !== null && ps.logIndex === j ? ps.shooterGid : -1;
        if (shooterGid < 0) continue;
        row.shotsJoinedToAShooter += 1;
        shooterByLogIndex.set(j, shooterGid);
        const si = idxOfGid.get(shooterGid) ?? -1;
        if (si < 0) continue;
        if (inYieldWindow(runActive[si], simTime, epWindowEnd[si])) {
          const st = runActive[si] ? epState[si] : epLastState[si];
          const wy = runActive[si] ? epWhy[si] : epLastWhy[si];
          row.runEpShots[st * NC + wy] += 1;
        }
      }
    }
    /* --- GOALS: the outcome flip on a row we joined to a shooter AT THE PUSH --- */
    for (let j = 0; j < m.shotLog.length; j++) {
      const before = j < prevShotRows ? seenOutcome[j] : 'pending';
      if (before !== 'pending' || m.shotLog[j].outcome !== 'goal') continue;
      const gidFixed = shooterByLogIndex.get(j) ?? -1;
      const gfi = gidFixed < 0 ? -1 : (idxOfGid.get(gidFixed) ?? -1);
      if (gfi >= 0) {
        row.goalRowsJoinedAtThePush += 1;
        if (inYieldWindow(runActive[gfi], simTime, epWindowEnd[gfi])) {
          const st = runActive[gfi] ? epState[gfi] : epLastState[gfi];
          const wy = runActive[gfi] ? epWhy[gfi] : epLastWhy[gfi];
          row.runEpGoals[st * NC + wy] += 1;
        }
      } else {
        row.goalRowsUnjoinable += 1;
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
        const outfield = t.players.filter((q) => q.role !== 'GK' && !q.sentOff);
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
  /* ---- the episodes STILL ACTIVE at full time — COUNTED, never binned (debt (c)) ---- */
  for (let i = 0; i < n; i++) if (runActive[i]) row.runEpActiveAtFullTime += 1;
  /* ---- the runs with NO attached release, COUNTED and never binned ---- */
  for (const aw of awaitingRuns) row.epDtNoAttachedRelease[aw.why] += 1;
  /* ---- the GUARD FOLD — OBM-T1's own three lines, COPIED ---- */
  row.guardPairsTotal = gPairs.length;
  row.guardPairsUnder4 = gPairs.filter((v) => v < CLOSE_PAIR_M).length;
  row.guardU4N = gPairs.length > 0 ? 1 : 0;
  row.guardU4Sum = gPairs.length === 0 ? 0
    : gPairs.filter((v) => v < CLOSE_PAIR_M).length / gPairs.length;
  /* ---- the WORLD receipt, per arm ---- */
  const flagsAsDue = row.dsOwnRunFlag === (kind !== 'HATS')
    && row.dsHatsOffFlag === (kind !== 'HATS')
    && row.dsCoopHatsOffFlag === (kind === 'OWNCOOP')
    && row.obmFlag === false && !row.matrixOnBaseEff
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
  row.signature = signatureOf(m);
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 THE CODE MAP — canon code facts over the EXTRACTED call graph
   VERBATIM: "a code-fact boolean about what a function reads or does not read is derived from
   the function's WHOLE text and from every callee whose return enters the read, each pinned by
   an anchored text hash — the call graph it was checked over is stored beside the boolean; a
   hash pins a body, it cannot see through a call; … the callee list is EXTRACTED from the
   hashed text — every identifier called within the span, resolved to its definition and hashed
   — never typed".  ⛔ THE MAP DESCRIBES; IT DESIGNS NOTHING.                                  */
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
interface Span { file: string; name: string; start: number; end: number; text: string; sha: string }
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
const SPAN_DECIDE_OFFBALL = findSpan(BRAIN_PATH, 'decideOffBall',
  'function decideOffBall(p: Player, team: Team, opp: Team, match: Match): void {');
const SPAN_DECIDE_CARRIER = findSpan(BRAIN_PATH, 'decideCarrier',
  'function decideCarrier(p: Player, teamTruth: Team, oppTruth: Team, match: Match): void {');
const SPAN_ASSIGN_RUNNERS = findSpan(TEAMBRAIN_PATH, 'assignRunners',
  'function assignRunners(team: Team, match: Match): void {');
const SPAN_REGISTER_PASS = findSpan(MECH_PATH, 'registerPass',
  'function registerPass(match: Match, passer: Player, target: Player, exempt: boolean): void {');
const SPAN_PERFORM_PASS = findSpan(MECH_PATH, 'performPass', 'export function performPass(');
const SPAN_EXECUTE_ACTION = findSpan(EXEC_PATH, 'executeAction',
  'export function executeAction(p: Player, match: Match, dt: number): void {');
const HASHED_ROOTS = [SPAN_DECIDE_OFFBALL, SPAN_DECIDE_CARRIER, SPAN_ASSIGN_RUNNERS,
  SPAN_REGISTER_PASS, SPAN_PERFORM_PASS, SPAN_EXECUTE_ACTION].filter((s): s is Span => s !== null);
const ROOTS_COMPLETE = HASHED_ROOTS.length === 6;
const ROOT_GRAPH = HASHED_ROOTS.map((s) => ({
  root: spanKey(s), sha: s.sha,
  callees: calleesOf(s).resolved.map((c) => ({ span: spanKey(c), sha: c.sha }))
    .sort((a, b) => (a.span < b.span ? -1 : 1)),
  externals: calleesOf(s).external.slice().sort(),
}));
const MAP_CLOSURE = closureOf(HASHED_ROOTS);
/** ⭐⭐⭐ THE OWN-RUN FORK'S OWN SPAN — the `if (match.dsOwnRun) {` block, delimited by its own
 *  brace indentation inside `decideOffBall`. Its READ SET is enumerated from its WHOLE TEXT. */
const OWN_FORK = (() => {
  const lines = GRAPH_SRC[BRAIN_PATH];
  let start = -1;
  for (let i = 0; i < lines.length; i++) if (lines[i] === '    if (match.dsOwnRun) {') start = i;
  if (start < 0) return null;
  let end = -1;
  for (let j = start + 1; j < lines.length; j++) if (lines[j] === '    }') { end = j; break; }
  if (end < 0) return null;
  const text = lines.slice(start, end + 1).join('\n');
  const members = [...new Set((text.match(/match\.[A-Za-z_$][\w$]*/g) ?? []))].sort();
  return {
    startLine: start + 1, endLine: end + 1, sha: sha(text),
    matchMembers: members,
    readsOwnerGid: text.includes('seenBall.ownerGid'),
    readsAgeTicks: text.includes('ageTicks'),
    readsVel: text.includes('.vel'),
    readsPendingPass: text.includes('pendingPass'),
    readsPerceivedSnapshot: text.includes('perceivedSnapshot'),
  };
})();
/** ⭐⭐⭐ THE THREE IN-FLIGHT LICENCES THAT EXIST TODAY — enumerated with their SOURCES. */
const IN_FLIGHT_LICENCES = [
  { id: 'cornerCrash', clauseTerm: 'crashLive',
    source: 'team.cornerCrash',
    definedAt: occurrences(SRC_OF[BRAIN_PATH], CRASH_LIVE_LINE).map((h) => h.line),
    fieldDeclaredAt: occurrences(SRC_OF[TEAM_PATH], '  cornerCrash: {').map((h) => h.line),
    doorFlag: null as string | null },
  { id: 'crossFlight', clauseTerm: 'crossLive',
    source: 'team.crossFlight',
    definedAt: occurrences(SRC_OF[BRAIN_PATH], CROSS_LIVE_LINE).map((h) => h.line),
    fieldDeclaredAt: occurrences(SRC_OF[TEAM_PATH], '  crossFlight: {').map((h) => h.line),
    doorFlag: 'match.c4Arrival' },
  { id: 'restart', clauseTerm: "match.phase === 'restart'",
    source: 'match.phase',
    definedAt: occurrences(SRC_OF[BRAIN_PATH], LICENCE_CLAUSE_LINE).map((h) => h.line),
    fieldDeclaredAt: occurrences(SRC_OF[MATCH_PATH], '  phase: MatchPhase = ').map((h) => h.line),
    doorFlag: null as string | null },
];
const LICENCE_CLAUSE_SITE = occurrences(SRC_OF[BRAIN_PATH], LICENCE_CLAUSE_LINE);
const LICENCE_CLAUSE_ENCLOSING = LICENCE_CLAUSE_SITE.length === 1
  ? enclosingOf(BRAIN_PATH, LICENCE_CLAUSE_SITE[0].line) : null;
/** ⭐⭐⭐ `pendingPass`'s SHAPE and the ENGINE'S OWN RECEIVER FIELD — read off the interface. */
const PENDING_PASS_SHAPE = (() => {
  const src = SRC_OF[MATCH_PATH];
  const i = src.indexOf('export interface PendingPass {');
  const j = src.indexOf('\n}', i);
  const text = src.slice(i, j + 2);
  const fields = [...new Set((text.match(/^\s{2}([A-Za-z_$][\w$]*)\??:/gm) ?? [])
    .map((x) => x.trim().replace(/\??:$/, '')))];
  return {
    startLine: lineOf(src, i), sha: sha(text), fields,
    theEnginesOwnReceiverField: fields.includes('targetGid') ? 'targetGid' : null,
    note: '⭐⭐⭐ THE ENGINE HAS A RECEIVER FIELD (`targetGid`), so the INTENDED-RECEIVER TEST IS '
      + 'AN ENGINE-RECORD READ AND NOT A HEURISTIC — the first-touch fallback #415 item 6(3) '
      + 'permits is NOT implemented and would be dead code (canon: engine ledgers before '
      + 'heuristics).',
  };
})();
/** ⭐⭐ `ObservedBall`'s OWN FIELDS — a perceived FLIGHT is representable today. */
const OBSERVED_BALL_SHAPE = (() => {
  const src = SRC_OF[SNAP_PATH];
  const i = src.indexOf(OBSERVED_BALL_HEAD);
  const j = src.indexOf('\n}', i);
  const text = src.slice(i, j + 2);
  const fields = (text.match(/readonly ([A-Za-z_$][\w$]*)/g) ?? []).map((x) => x.split(' ')[1]);
  return {
    startLine: lineOf(src, i), endLine: lineOf(src, j), sha: sha(text), fields,
    aPerceivedFlightIsRepresentable: fields.includes('ownerGid') && fields.includes('vel'),
    note: '⛔ DESCRIPTIVE ONLY: `ownerGid` null WITH a non-zero `vel` is a perceived flight, and '
      + 'the type can already carry it. NOTHING is designed here.',
  };
})();
/** ⭐⭐⭐ THE THROUGH-BALL CHOOSER'S RUNNER SCAN and the other ACTION-TYPE reads. */
const ACTION_TYPE_READS = [
  { id: 'throughBallRunnerScan', file: BRAIN_PATH,
    text: "      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;" },
  { id: 'thirdManBonus', file: BRAIN_PATH,
    text: "        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15" },
  { id: 'registerPassBounce', file: MECH_PATH, text: "    target.action.type === 'MakeRun' &&" },
].map((r) => {
  const hits = occurrences(SRC_OF[r.file], r.text);
  const enc = hits.length === 1 ? enclosingOf(r.file, hits[0].line) : null;
  return {
    ...r, lines: hits.map((h) => h.line), resolves: hits.length === 1 && enc !== null,
    enclosingFn: enc === null ? null : enc.name, enclosingSpan: enc === null ? null : spanKey(enc),
    enclosingSha: enc === null ? null : enc.sha,
  };
});
const CODE_MAP_OK = ROOTS_COMPLETE && OWN_FORK !== null
  && OWN_FORK.readsOwnerGid && !OWN_FORK.readsAgeTicks && !OWN_FORK.readsVel
  && !OWN_FORK.readsPendingPass && OWN_FORK.readsPerceivedSnapshot
  && LICENCE_CLAUSE_ENCLOSING !== null
  && SPAN_DECIDE_OFFBALL !== null
  && spanKey(LICENCE_CLAUSE_ENCLOSING) === spanKey(SPAN_DECIDE_OFFBALL)
  && IN_FLIGHT_LICENCES.every((l) => l.definedAt.length === 1 && l.fieldDeclaredAt.length === 1)
  && PENDING_PASS_SHAPE.theEnginesOwnReceiverField === 'targetGid'
  && OBSERVED_BALL_SHAPE.aPerceivedFlightIsRepresentable
  && ACTION_TYPE_READS.every((r) => r.resolves)
  && !MAP_CLOSURE.capped;
fx('codeMap.theOwnRunForkREADSTheOwnerGid', OWN_FORK === null ? null : OWN_FORK.readsOwnerGid,
  true);
fx('codeMap.theOwnRunForkDoesNOTReadAgeTicks',
  OWN_FORK === null ? null : OWN_FORK.readsAgeTicks, false);
fx('codeMap.theOwnRunForkDoesNOTReadVel', OWN_FORK === null ? null : OWN_FORK.readsVel, false);
fx('codeMap.theOwnRunForkDoesNOTReadPendingPass',
  OWN_FORK === null ? null : OWN_FORK.readsPendingPass, false);
fx('codeMap.theLicenceClauseSitsInDecideOffBall',
  LICENCE_CLAUSE_ENCLOSING === null ? null : LICENCE_CLAUSE_ENCLOSING.name, 'decideOffBall');
fx('codeMap.thereAreEXACTLYTHREEInFlightLicencesToday', IN_FLIGHT_LICENCES.length, 3);
fx('codeMap.theEngineHASAReceiverField', PENDING_PASS_SHAPE.theEnginesOwnReceiverField,
  'targetGid');
fx('codeMap.aPerceivedFlightIsRepresentableToday',
  OBSERVED_BALL_SHAPE.aPerceivedFlightIsRepresentable, true);
fx('codeMap.everyActionTypeReadResolvesToExactlyOneSpan',
  ACTION_TYPE_READS.map((r) => r.resolves), [true, true, true]);

/* ========================================================================== */
/* §11 THE RECEIPT WALKS — gLockstep, gPullCount, X-DET, the world pin, X-FP-PROD */
/* ========================================================================== */
banner('IF-C0 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const observed = buildMatch(seed, armK);
  const obsRow = walkMatch(observed, armK, true);
  const unobserved = buildMatch(seed, armK);
  walkMatch(unobserved, armK, false);
  return {
    seed, arm: armK, observed: signatureOf(observed), unobserved: signatureOf(unobserved),
    instrumentPulls: obsRow.instrumentPulls,
  };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);
/** ⭐⭐⭐ gPullCount — THE DECLARED ADDED READ, COUNTED. The MATCH INSTANCE's
 *  `perceivedSnapshot` is wrapped on a THROWAWAY match (never on a battery walk) by a counter
 *  that DELEGATES to the real bound method. THE ASSERTION: observed − unobserved EQUALS the
 *  instrument's OWN stored pull count on every arm (zero on the arms without `dsOwnRun`), the
 *  whole-match signatures are EQUAL, and the wrapped observed signature equals the UNWRAPPED
 *  lockstep walk's — which is what proves the wrapper itself transparent. */
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
  const obsRow = walkMatch(obs, armK, true);
  const un = buildMatch(seed, armK);
  const unCount = spyPulls(un);
  walkMatch(un, armK, false);
  const plain = lockstepRows.find((r) => r.seed === seed && r.arm === armK);
  const sObs = signatureOf(obs);
  const sUn = signatureOf(un);
  return {
    seed, arm: armK, pullsObserved: obsCount(), pullsUnobserved: unCount(),
    instrumentPullsStored: obsRow.instrumentPulls,
    addedPulls: obsCount() - unCount(),
    addedEqualsStored: obsCount() - unCount() === obsRow.instrumentPulls,
    signatureObserved: sObs, signatureUnobserved: sUn,
    signatureUnwrapped: plain === undefined ? '' : plain.observed,
    signaturesEqual: sObs === sUn,
    wrapperIsTransparent: plain !== undefined && sObs === plain.observed,
  };
}));
const PULL_COUNTER_LIVE = pullRows.some((r) => r.pullsObserved > 0);
const PULL_ADDED_LIVE = pullRows.some((r) => r.addedPulls > 0);
const PULLCOUNT_OK = pullRows.length === LOCKSTEP_SEEDS.length * ARMS.length
  && PULL_COUNTER_LIVE && PULL_ADDED_LIVE
  && pullRows.every((r) => r.addedEqualsStored && r.signaturesEqual && r.wrapperIsTransparent)
  && pullRows.filter((r) => ARM_KIND[r.arm] === 'HATS').every((r) => r.addedPulls === 0)
  && pullRows.filter((r) => ARM_KIND[r.arm] !== 'HATS').every((r) => r.addedPulls > 0);
banner(`  gPullCount ${PULLCOUNT_OK ? 'GREEN' : 'RED'} (${pullRows.length} spied pairs; added `
  + `${pullRows.map((r) => r.addedPulls).join('/')})`);
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
  const mv = m as unknown as MatchView;
  const kind = ARM_KIND[armK];
  return {
    seed: WORLD_PIN_SEED, arm: armK,
    bqArmedVersion: bqArmedVersion(m), lnArmedVersion: lnArmedVersion(m),
    gkArmedVersion: gkArmedVersion(m),
    bqCushion: mv.bqCushion === true,
    lnOwnLanePrice: mv.lnOwnLanePrice === true, gkDiveBody: mv.gkDiveBody === true,
    edsPerceivedChoice: mv.edsPerceivedChoice === true,
    dsOwnRun: mv.dsOwnRun === true, dsHatsOff: mv.dsHatsOff === true,
    dsCoopHatsOff: mv.dsCoopHatsOff === true, obmMovement: mv.obmMovement === true,
    dsOwnRunDue: kind !== 'HATS', dsHatsOffDue: kind !== 'HATS',
    dsCoopHatsOffDue: kind === 'OWNCOOP', obmDue: false,
    matrixOnBaseEff: matrixOnBaseAndEff(m),
    infoGenomeCleanOfMatrix: infoGenomeCleanOfMatrix(m),
    pcHoldsReadable: mv.pcLatency === null || (mv.pcLatency.holds instanceof Map),
    otherSeamsAbsent: mv.ctbSupportPlane !== true && mv.rcAnticipate !== true
      && mv.rcReady !== true && mv.bfFacingCost !== true,
  };
});
const WORLD_PIN_OK = worldPin.every((w) => w.edsPerceivedChoice && w.otherSeamsAbsent
  && w.bqCushion && w.pcHoldsReadable && w.infoGenomeCleanOfMatrix
  && w.bqArmedVersion === BQ_WORLD_VERSION && w.lnArmedVersion !== LN_WORLD_VERSION
  && w.gkArmedVersion !== GK_WORLD_VERSION && !w.lnOwnLanePrice && !w.gkDiveBody
  && w.dsOwnRun === w.dsOwnRunDue && w.dsHatsOff === w.dsHatsOffDue
  && w.dsCoopHatsOff === w.dsCoopHatsOffDue
  && w.obmMovement === w.obmDue && w.matrixOnBaseEff === w.obmDue);
banner(`  world pin ${WORLD_PIN_OK ? 'GREEN' : 'RED'} (${worldPin.length} arms)`);

/* ========================================================================== */
/* §12 THE BATTERY — the FOUR arms PAIRED on every seed                        */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`IF-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
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
for (const armK of ARMS) receiptRows[armK] = walkMatch(buildMatch(RECEIPT_SEED, armK), armK, true);
const walksBooked = (cells.length + 1) * ARMS.length;
const armRows = (armK: Arm): Row[] => cells.map((c) => c.rows[armK]);
const allRows = (armK: Arm): Row[] => [...armRows(armK), receiptRows[armK]];
const tot = (armK: Arm, pick: (r: Row) => number): number =>
  armRows(armK).reduce((a, r) => a + pick(r), 0);

/* ========================================================================== */
/* §12b G-REPRO — RE-WALK DS-T1d's OWN BAND ON THE THREE E13 ARMS               */
/* ========================================================================== */
/** ⭐⭐⭐ G-REPRO (#415 item 6): DS-T1d's own CONSUMED band 12,557,000–011 (canon: NOT a
 *  consumption) re-walked on `HATS-E13`, `OWN-E13` and `OWNCOOP-E13` and compared FIELD FOR
 *  FIELD against its stored `perSeedCells[]` — the INTERSECTION of this row's key set with its
 *  own, `wallMs` excluded. A MISMATCH IS RED. The whole-match SIGNATURE is one of the compared
 *  fields, so this is also the proof that THIS instrument's arms ARE DS-T1d's arms. */
const REPRO_ARMS: readonly Arm[] = ['HATS-E13', 'OWN-E13', 'OWNCOOP-E13'];
const reproDetail = (() => {
  if (!existsSync(DST1D_ARTIFACT)) {
    return { ran: false, ok: false, seeds: REPRO_SEEDS, comparedFields: [] as string[],
      rows: [] as { seed: number; arm: string; mismatches: string[] }[],
      note: `the DS-T1d artifact is absent at ${DST1D_ARTIFACT}` };
  }
  const raw = JSON.parse(readFileSync(DST1D_ARTIFACT, 'utf8')) as {
    perSeedCells: (Record<string, unknown> & { seed: number })[];
  };
  const wanted = new Map<number, Record<string, Record<string, unknown>>>();
  for (const c of raw.perSeedCells) {
    if (!REPRO_SEEDS.includes(c.seed)) continue;
    const byArm: Record<string, Record<string, unknown>> = {};
    for (const a of REPRO_ARMS) {
      byArm[a] = JSON.parse(JSON.stringify(c[a])) as Record<string, unknown>;
    }
    wanted.set(c.seed, byArm);
  }
  const mineKeys = Object.keys(emptyRow());
  const first = wanted.get(REPRO_SEEDS[0]);
  const fields = first === undefined ? [] : mineKeys.filter((k) => k !== 'wallMs'
    && Object.prototype.hasOwnProperty.call(first[REPRO_ARMS[0]], k));
  const rows: { seed: number; arm: string; mismatches: string[] }[] = [];
  for (const armK of REPRO_ARMS) {
    for (const seed of REPRO_SEEDS) {
      const theirs = wanted.get(seed);
      if (theirs === undefined) {
        rows.push({ seed, arm: armK, mismatches: ['ABSENT FROM DS-T1d'] });
        continue;
      }
      const mine = walkMatch(buildMatch(seed, armK), armK, true) as unknown as
        Record<string, unknown>;
      const bad = fields.filter((k) => JSON.stringify(mine[k])
        !== JSON.stringify(theirs[armK][k]));
      rows.push({ seed, arm: armK, mismatches: bad });
    }
  }
  return {
    ran: true,
    ok: fields.length > 0 && rows.length === REPRO_ARMS.length * REPRO_SEEDS.length
      && rows.every((r) => r.mismatches.length === 0),
    seeds: REPRO_SEEDS, arms: REPRO_ARMS, comparedFields: fields, rows,
    note: '⭐⭐⭐ G-REPRO: DS-T1d\'s OWN CONSUMED BAND (12,557,000–002 — canon: "verifier scratch '
      + 'walks use the stage\'s own consumed band"; NOT a consumption) re-walked on ALL THREE '
      + 'E13 arms and compared field for field against its stored `perSeedCells[]` at the '
      + '`.RED.json` path it was routed to, READ IN PLACE. Only `wallMs` (a machine timing) is '
      + 'excluded; a field this row carries that DS-T1d does not is not compared and is absent '
      + 'from `comparedFields`. THE WHOLE-MATCH SIGNATURE IS ONE OF THE COMPARED FIELDS.',
  };
})();
const REPRO_OK = reproDetail.ok;
banner(`  G-REPRO ${REPRO_OK ? 'GREEN' : 'RED'} `
  + `(${reproDetail.comparedFields.length} fields × ${reproDetail.rows.length} arm-seed rows)`);

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
const sliceSum = (a: readonly number[], from: number, len: number): number => {
  let t = 0;
  for (let i = 0; i < len; i++) t += a[from + i];
  return t;
};
const strideSum = (a: readonly number[], offset: number, stride: number, count: number): number => {
  let t = 0;
  for (let i = 0; i < count; i++) t += a[offset + i * stride];
  return t;
};

/* ---- ⭐⭐⭐ POPULATION R — THE RUN EPISODES AND THEIR START STATE ---- */
defFace('run.episodesPerMatch', 'run episodes per match',
  '⭐⭐⭐ POPULATION R — every RUN EPISODE: a body\'s `p.action.type` becoming `MakeRun` from a '
  + 'non-`MakeRun` tick (the episode ends when the type changes), stamped at its START tick',
  'matches', (r) => r.epStartsAll, ONE);
defFace('run.meanTicksPerEpisode', 'ticks per episode', 'the mean length of a run episode',
  'run episodes', (r) => r.epTicksTotal, (r) => r.epStartsAll);
defFace('run.episodesActiveAtFullTime', 'episodes open at full time',
  '⭐ DEBT (c): episodes still ACTIVE at the whistle — COUNTED, never binned', 'matches',
  (r) => r.runEpActiveAtFullTime, ONE);
for (const st of STATES) {
  defFace(`run.startStateShare.${st}`, 'share',
    `⭐⭐⭐ THE RUN-START STATE PARTITION — the ${st} share of ALL run episodes`, 'run episodes',
    (r) => sliceSum(r.epStarts, SI(st) * NC, NC), (r) => r.epStartsAll);
  defFace(`run.startsPerMatch.${st}`, `${st} run starts per match`,
    'the same cell, per match (the two-fractions companion)', 'matches',
    (r) => sliceSum(r.epStarts, SI(st) * NC, NC), ONE);
}
for (const c of RUN_CLASSES) {
  defFace(`run.startsPerMatch.${c}`, `${c} run starts per match`,
    `run episodes of class ${c} per match`, 'matches',
    (r) => strideSum(r.epStarts, RCI(c), NC, NS), ONE);
  defFace(`run.classShare.${c}`, 'share', `the ${c} share of all run episodes`, 'run episodes',
    (r) => strideSum(r.epStarts, RCI(c), NC, NS), (r) => r.epStartsAll);
  for (const st of STATES) {
    defFace(`run.startStateShare.${c}.${st}`, 'share',
      `⭐⭐ THE PARTITION PER \`why\` CLASS — the ${st} share of ${c} run episodes`,
      `${c} run episodes`,
      (r) => r.epStarts[SI(st) * NC + RCI(c)], (r) => strideSum(r.epStarts, RCI(c), NC, NS));
  }
}
defFace('run.inFlightShare', 'share',
  '⭐⭐⭐ Q1 — THE IN-FLIGHT SHARE OF ALL RUN EPISODES on this arm (the SIZED face)',
  'run episodes', (r) => sliceSum(r.epStarts, SI('ballInFlight') * NC, NC), (r) => r.epStartsAll);
defFace('run.inFlightShareOfTheCoachsHats', 'share',
  '⭐⭐⭐ Q1 — the in-flight share of the SIX COACH-HAT classes (the three existing in-flight '
  + 'licences live here: corner crash · cross flight · restart)', 'coach-hat run episodes',
  (r) => HAT_CLASSES_SIX.reduce((a, c) => a + r.epStarts[SI('ballInFlight') * NC + RCI(c)], 0),
  (r) => HAT_CLASSES_SIX.reduce((a, c) => a + strideSum(r.epStarts, RCI(c), NC, NS), 0));
defFace('run.inFlightShareOfTheOwnRun', 'share',
  '⭐⭐⭐ Q1 — the in-flight share of the OWN RUN (`own run in behind`): THE LEAK, since M-DS.7 '
  + 'licenses the own run ONLY with the PERCEIVED ball at a mate\'s feet', 'own-run episodes',
  (r) => r.epStarts[SI('ballInFlight') * NC + RCI('ownRunInBehind')],
  (r) => strideSum(r.epStarts, RCI('ownRunInBehind'), NC, NS));
defFace('run.inFlightStartsPerMatch', 'in-flight run starts per match',
  'the numerator of `run.inFlightShare`, per match', 'matches',
  (r) => sliceSum(r.epStarts, SI('ballInFlight') * NC, NC), ONE);
/* ---- THE FLIGHT'S PROVENANCE AND AGE ---- */
for (const pv of PROVENANCES) {
  defFace(`flight.provenanceShare.${pv}`, 'share',
    `⭐⭐⭐ THE IN-FLIGHT PROVENANCE PARTITION, off \`match.pendingPass\` — the ${pv} share of `
    + 'in-flight run starts', 'in-flight run starts',
    (r) => sliceSum(r.epStartsInFlightProvenance, PVI(pv) * NC, NC),
    (r) => sum(r.epStartsInFlightProvenance));
  defFace(`flight.provenancePerMatch.${pv}`, `${pv} in-flight run starts per match`,
    'the same cell, per match', 'matches',
    (r) => sliceSum(r.epStartsInFlightProvenance, PVI(pv) * NC, NC), ONE);
  defFace(`flight.provenanceShare.ownRun.${pv}`, 'share',
    `the ${pv} share of the OWN RUN's in-flight starts`, 'own-run in-flight starts',
    (r) => r.epStartsInFlightProvenance[PVI(pv) * NC + RCI('ownRunInBehind')],
    (r) => strideSum(r.epStartsInFlightProvenance, RCI('ownRunInBehind'), NC,
      PROVENANCES.length));
}
defFace('flight.intendedReceiverShare', 'share',
  '⭐⭐⭐ Q3 — THE INTENDED-RECEIVER SHARE among in-flight starts on HIS SIDE\'S OWN PASS, read '
  + 'off the ENGINE\'S OWN `pendingPass.targetGid` (a RECORD, not a heuristic)',
  'in-flight starts on his side\'s pass', (r) => sum(r.epInFlightIntended),
  (r) => sum(r.epInFlightOwnSidePass));
defFace('flight.intendedReceiverShare.ownRun', 'share',
  'the same, on the OWN RUN only', 'own-run in-flight starts on his side\'s pass',
  (r) => r.epInFlightIntended[RCI('ownRunInBehind')],
  (r) => r.epInFlightOwnSidePass[RCI('ownRunInBehind')]);
defFace('flight.intendedReceiverShare.coachHats', 'share',
  'the same, on the SIX coach-hat classes', 'coach-hat in-flight starts on his side\'s pass',
  (r) => HAT_CLASSES_SIX.reduce((a, c) => a + r.epInFlightIntended[RCI(c)], 0),
  (r) => HAT_CLASSES_SIX.reduce((a, c) => a + r.epInFlightOwnSidePass[RCI(c)], 0));
defFace('flight.towardHimShare', 'share',
  '⭐⭐ THE CLOSING-SPEED SIGN along runner→ball at the start tick: the flight is coming TOWARD '
  + 'him', 'in-flight starts on his side\'s pass', (r) => sum(r.epInFlightToward),
  (r) => sum(r.epInFlightOwnSidePass));
defFace('flight.startsOnHisSidesPassPerMatch', 'in-flight starts on his side\'s pass per match',
  'the denominator of the three faces above, per match', 'matches',
  (r) => sum(r.epInFlightOwnSidePass), ONE);
for (const oc of OUTCOMES) {
  defFace(`flight.outcomeShare.${oc}`, 'share',
    `⭐⭐ THAT FLIGHT'S OWN OUTCOME (off the engine's pass ledger) — the ${oc} share`,
    'resolved in-flight starts',
    (r) => sliceSum(r.epInFlightOutcome, OCI(oc) * NC, NC), (r) => sum(r.epInFlightOutcome));
  defFace(`flight.outcomeShareIntended.${oc}`, 'share',
    `the same on the INTENDED-receiver subset`, 'resolved intended-receiver in-flight starts',
    (r) => r.epInFlightOutcomeIntended[OCI(oc)], (r) => sum(r.epInFlightOutcomeIntended));
}
/* ---- THE YIELD BY START STATE (both fractions, ⛔ printed beside each other) ---- */
for (const st of STATES) {
  defFace(`yield.aimedPerEpisode.${st}`, 'passes aimed per episode',
    `⭐⭐⭐ THE YIELD BY START STATE — passes AIMED at him inside a run episode stamped ${st}, or `
    + `within ${YIELD_WINDOW_SECONDS} s of its clear`, `${st} run episodes`,
    (r) => sliceSum(r.epAimed, SI(st) * NC, NC), (r) => sliceSum(r.epStarts, SI(st) * NC, NC));
  defFace(`yield.completedPerEpisode.${st}`, 'completions per episode',
    'passes COMPLETED to him in the same window', `${st} run episodes`,
    (r) => sliceSum(r.epCompleted, SI(st) * NC, NC),
    (r) => sliceSum(r.epStarts, SI(st) * NC, NC));
  defFace(`yield.shotsPerEpisode.${st}`, 'shots per episode',
    'shots BY HIM in the same window (the `shotLog` row joined to the shooter gid BANKED AT THE '
    + 'PUSH — debt (b) kept paid)', `${st} run episodes`,
    (r) => sliceSum(r.runEpShots, SI(st) * NC, NC), (r) => sliceSum(r.epStarts, SI(st) * NC, NC));
  defFace(`yield.goalsPerEpisode.${st}`, 'goals per episode',
    'goals BY HIM in the same window, joined through the gid banked at the push',
    `${st} run episodes`,
    (r) => sliceSum(r.runEpGoals, SI(st) * NC, NC), (r) => sliceSum(r.epStarts, SI(st) * NC, NC));
  defFace(`yield.shotsPerMatch.${st}`, `${st}-start shots per match`,
    'the numerator above, per match (the two-fractions companion)', 'matches',
    (r) => sliceSum(r.runEpShots, SI(st) * NC, NC), ONE);
  defFace(`yield.aimedPerMatch.${st}`, `${st}-start aims per match`,
    'the aim numerator, per match', 'matches',
    (r) => sliceSum(r.epAimed, SI(st) * NC, NC), ONE);
}
for (const c of ['ownRunInBehind', 'licensedRunInBehind', 'attackingTheBox'] as const) {
  for (const st of ['mateOwnsTheBall', 'ballInFlight'] as const) {
    defFace(`yield.shotsPerEpisode.${c}.${st}`, 'shots per episode',
      `⭐⭐ Q3 — the yield of a ${c} episode started ${st}`, `${c}/${st} run episodes`,
      (r) => r.runEpShots[SI(st) * NC + RCI(c)], (r) => r.epStarts[SI(st) * NC + RCI(c)]);
    defFace(`yield.aimedPerEpisode.${c}.${st}`, 'passes aimed per episode',
      `the aims of a ${c} episode started ${st}`, `${c}/${st} run episodes`,
      (r) => r.epAimed[SI(st) * NC + RCI(c)], (r) => r.epStarts[SI(st) * NC + RCI(c)]);
  }
}
/* ---- ⭐⭐⭐ THE TIMING FACT Δt ---- */
for (let k = 0; k < DT_BINS.length; k++) {
  defFace(`dt.binShare.${DT_BINS[k]}`, 'share',
    `⭐⭐⭐ THE TIMING HISTOGRAM — Δt = (the attached release) − (the run's start) in the `
    + `${DT_BINS[k]} bin. NEGATIVE = the run started onto a ball ALREADY TRAVELLING`,
    'binned run episodes', (r) => sliceSum(r.epDtBins, k * NC, NC), (r) => sum(r.epDtBins));
  for (const c of ['ownRunInBehind', 'licensedRunInBehind', 'attackingTheBox', 'arrivingLate',
  ] as const) {
    defFace(`dt.binShare.${c}.${DT_BINS[k]}`, 'share',
      `the same bin for the ${c} class`, `binned ${c} episodes`,
      (r) => r.epDtBins[k * NC + RCI(c)], (r) => strideSum(r.epDtBins, RCI(c), NC,
        DT_BINS.length));
  }
  for (const st of STATES) {
    defFace(`dt.binShareByState.${st}.${DT_BINS[k]}`, 'share',
      `the same bin for run episodes stamped ${st}`, `binned ${st} episodes`,
      (r) => r.epDtBinsByState[k * NS + SI(st)],
      (r) => strideSum(r.epDtBinsByState, SI(st), NS, DT_BINS.length));
  }
}
defFace('dt.negativeShare', 'share',
  '⭐⭐⭐ Q4 — the share of BINNED run episodes whose Δt is NEGATIVE: the run started AFTER the '
  + 'release, onto a ball already travelling', 'binned run episodes',
  (r) => sliceSum(r.epDtBins, 0, 3 * NC), (r) => sum(r.epDtBins));
defFace('dt.attachedLiveShare', 'share',
  'the share of run episodes attached to a same-side flight ALREADY LIVE at the start tick (the '
  + 'frozen attachment rule\'s first arm)', 'run episodes',
  (r) => sum(r.epDtAttachedLive), (r) => r.epStartsAll);
defFace('dt.attachedNextShare', 'share',
  'the share attached to the NEXT release by his side (the second arm)', 'run episodes',
  (r) => sum(r.epDtAttachedNext), (r) => r.epStartsAll);
defFace('dt.noAttachedReleaseShare', 'share',
  '⛔ COUNTED, NEVER BINNED: run episodes whose side never released again before full time',
  'run episodes', (r) => sum(r.epDtNoAttachedRelease), (r) => r.epStartsAll);
defFace('dt.binnedEpisodesPerMatch', 'binned run episodes per match',
  'the histogram\'s own denominator, per match', 'matches', (r) => sum(r.epDtBins), ONE);
/* ---- ⭐⭐⭐ THE PERCEIVED STAMP AND THE STALE-OWNER LEAK ---- */
defFace('perceived.pullsPerMatch', 'instrument percept pulls per match',
  '⭐⭐⭐ THE PULL RECEIPT — ONE `perceivedSnapshot` per STAMPED run-start tick, INSIDE the arm\'s '
  + 'own flag. ZERO on an arm without `dsOwnRun`', 'matches', (r) => r.instrumentPulls, ONE);
defFace('perceived.stampedPerMatch', 'stamped run starts per match',
  'the stamped population itself, per match', 'matches',
  (r) => sum(r.epPerceivedStamped), ONE);
for (const pk of PERCEIVED) {
  defFace(`perceived.cellShare.${pk}`, 'share',
    `⭐⭐ THE PERCEIVED BALL AT THE RUN START — the ${pk} share of stamped run starts`,
    'stamped run starts',
    (r) => sliceSum(r.epPerceived, PCI(pk) * NC, NC), (r) => sum(r.epPerceived));
  defFace(`perceived.cellShare.ownRun.${pk}`, 'share',
    `the same on the OWN RUN only`, 'stamped own-run starts',
    (r) => r.epPerceived[PCI(pk) * NC + RCI('ownRunInBehind')],
    (r) => strideSum(r.epPerceived, RCI('ownRunInBehind'), NC, PERCEIVED.length));
}
defFace('perceived.staleOwnerShare', 'share',
  '⭐⭐⭐ THE STALE-OWNER LEAK, COUNTED — the perceived `ownerGid` NAMES a body the TRUTH no '
  + 'longer credits with the ball, at the stamped run-start tick', 'stamped run starts',
  (r) => sum(r.epPerceivedStale), (r) => sum(r.epPerceivedStamped));
defFace('perceived.staleOwnerShare.ownRun', 'share',
  'the same on the OWN RUN only', 'stamped own-run starts',
  (r) => r.epPerceivedStale[RCI('ownRunInBehind')],
  (r) => r.epPerceivedStamped[RCI('ownRunInBehind')]);
for (const st of STATES) {
  defFace(`perceived.staleOwnerShare.${st}`, 'share',
    `⭐⭐⭐ Q2 — the stale-owner share among run starts stamped ${st}`, `stamped ${st} starts`,
    (r) => r.epPerceivedStaleByState[SI(st)], (r) => r.epPerceivedStampedByState[SI(st)]);
  defFace(`perceived.stampedPerMatch.${st}`, `stamped ${st} starts per match`,
    'the denominator above, per match', 'matches', (r) => r.epPerceivedStampedByState[SI(st)],
    ONE);
}
defFace('perceived.staleOwnersPerMatch', 'stale-owner run starts per match',
  'the numerator of the leak, per match', 'matches', (r) => sum(r.epPerceivedStale), ONE);
/* ---- ⭐⭐⭐ POPULATION L — THE LEAK'S ANATOMY AS A PARTITION ---- */
for (const lc of LEAK_CELLS) {
  defFace(`leak.cellShare.${lc}`, 'share',
    `⭐⭐⭐ Q2 — THE LEAK'S OWN PARTITION: the ${lc} share of OWN RUNS whose TRUTH state is `
    + '`ballInFlight`. ⛔ A PARTITION, NEVER A STORY', 'own runs started in flight',
    (r) => r.leakCells[LKI(lc)], (r) => sum(r.leakCells));
  defFace(`leak.cellPerMatch.${lc}`, `${lc} own runs per match`,
    'the same cell, per match', 'matches', (r) => r.leakCells[LKI(lc)], ONE);
}
defFace('leak.ownRunsInFlightPerMatch', 'own runs started in flight per match',
  'the leak\'s own denominator, per match', 'matches', (r) => r.leakOwnRunsInFlight, ONE);
/* ---- ⭐⭐⭐ POPULATION F — EVERY PASS RELEASE ---- */
defFace('release.perMatch', 'pass releases per match',
  '⭐⭐⭐ POPULATION F — every PASS RELEASE by the side in possession, off `pendingPass`\'s own '
  + 'transitions', 'matches', (r) => r.releases, ONE);
defFace('release.runnersAtReleaseMean', 'same-side outfield bodies already running per release',
  '⭐⭐ how many same-side outfield bodies are ALREADY in a `MakeRun` episode at the release',
  'pass releases', (r) => r.releaseRunnerSum, (r) => r.releases);
for (let k = 0; k < REL_RUNNER_BINS; k++) {
  defFace(`release.runnerBinShare.${k === REL_RUNNER_BINS - 1 ? `${k}plus` : k}`, 'share',
    `the share of releases with ${k}${k === REL_RUNNER_BINS - 1 ? '+' : ''} same-side bodies `
    + 'already running', 'pass releases', (r) => r.releaseRunnerBins[k], (r) => r.releases);
}
defFace('release.startsDuringFlightPerRelease', 'run starts during the flight per release',
  '⭐⭐ how many same-side run episodes START while the ball is travelling', 'pass releases',
  (r) => sum(r.releaseStartsDuringFlight), (r) => r.releases);
for (const c of RUN_CLASSES_NAMED) {
  defFace(`release.startsDuringFlightPerRelease.${c}`, 'run starts during the flight per release',
    `the same, restricted to the ${c} class`, 'pass releases',
    (r) => r.releaseStartsDuringFlight[RCI(c)], (r) => r.releases);
}
defFace('release.flightTicksPerRelease', 'ticks in flight per release',
  'the ledger\'s own flight duration in stepped ticks', 'pass releases',
  (r) => r.releaseFlightTicks, (r) => r.releases);
for (const oc of OUTCOMES) {
  defFace(`release.outcomeShare.${oc}`, 'share',
    `the ${oc} share of RESOLVED releases (off the engine's own records)`, 'resolved releases',
    (r) => r.releasesResolved[OCI(oc)], (r) => sum(r.releasesResolved));
}
for (const rc of RECEIVER_CLASSES) {
  defFace(`receiver.classShare.${rc}`, 'share',
    `⭐⭐⭐ Q4 — THE EVENTUAL RECEIVER'S OWN CLASS: the ${rc} share of completed releases`,
    'completed releases', (r) => r.receiverClass[RVI(rc)], (r) => sum(r.receiverClass));
  defFace(`receiver.classSharePerMatch.${rc}`, `${rc} receivers per match`,
    'the same cell, per match', 'matches', (r) => r.receiverClass[RVI(rc)], ONE);
  defFace(`receiver.classShareIntended.${rc}`, 'share',
    'the same on the INTENDED receiver only (the engine\'s own `targetGid` took it)',
    'completed releases to the intended receiver',
    (r) => r.receiverClassIntended[RVI(rc)], (r) => sum(r.receiverClassIntended));
}
defFace('receiver.intendedShare', 'share',
  'the share of completed releases taken by the ENGINE\'S OWN `targetGid`', 'completed releases',
  (r) => r.receiverIsIntended, (r) => sum(r.receiverClass));
defFace('receiver.completedReleasesPerMatch', 'completed releases per match',
  'the denominator of the receiver family, per match', 'matches',
  (r) => sum(r.receiverClass), ONE);
/* ---- THE CONTEXT FAMILIES (R1, the board, the decisions, the crowding) ---- */
defFace('r1.runsPerInPossessionTick', 'executed runs per in-possession open-play team-tick',
  'R1 — DS-T1d\'s flood face, re-measured on this block for continuity',
  'in-possession open-play team-ticks', (r) => r.r1RunnerSum, (r) => r.r1TeamTicks);
defFace('r1.teamTicksPerMatch', 'in-possession open-play team-ticks per match',
  'R1\'s own denominator, per match', 'matches', (r) => r.r1TeamTicks, ONE);
for (let k = 0; k < R1_BINS; k++) {
  defFace(`r1.binShare.${k === R1_BINS - 1 ? `${k}plus` : k}`, 'share',
    `the share of in-possession open-play team-ticks with ${k}`
    + `${k === R1_BINS - 1 ? '+' : ''} bodies executing a run`,
    'in-possession open-play team-ticks', (r) => r.r1Bins[k], (r) => r.r1TeamTicks);
}
defFace('r1.floodShareAtLeastThree', 'share',
  `the share of in-possession open-play team-ticks with ${R1_FLOOD_AT} OR MORE runners`,
  'in-possession open-play team-ticks', (r) => r.r1FloodTicks, (r) => r.r1TeamTicks);
for (const rr of ROLES4) {
  defFace(`runsByRole.share.${rr}`, 'share', `the ${rr} share of EXECUTED runs`,
    'executed-run body-ticks', (r) => r.r1RunnersByRole[RI(rr)], (r) => sum(r.r1RunnersByRole));
}
defFace('coach.ticksPerMatch', 'coach ticks per match', 'every `updateTeamBrain` execution',
  'matches', (r) => r.coachTicks, ONE);
defFace('coach.inPossessionTicksPerMatch', 'in-possession coach ticks per match',
  'POPULATION A\'s own denominator', 'matches', (r) => r.coachTicksInPossession, ONE);
defFace('runCount.mean', 'designated runners per in-possession coach tick', 'THE BOARD',
  'in-possession coach ticks', (r) => r.runnerCountSum, (r) => r.coachTicksInPossession);
defFace('runCount.designationsPerMatch', 'runner designations per match',
  'the numerator above, per match', 'matches', (r) => r.runnerDesignations, ONE);
defFace('board.openPlayEmptyShare', 'share',
  'open-play in-possession coach ticks with an EMPTY board', 'open-play in-possession coach ticks',
  (r) => r.openPlayBoardEmptyTicks, (r) => r.openPlayCoachTicks);
defFace('board.openPlayCoachTicksPerMatch', 'open-play in-possession coach ticks per match',
  'the denominator above, per match', 'matches', (r) => r.openPlayCoachTicks, ONE);
defFace('offBall.decisionTicksPerMatch', 'off-ball decision ticks per match',
  'POPULATION B (the POST-STEP holds form of record — DS-T1 debt (a))', 'matches',
  (r) => r.offBallDecisionTicksPost, ONE);
defFace('offBall.makeRunShare', 'share', 'the `MakeRun` share of attacking off-ball decisions',
  'off-ball decision ticks', (r) => r.makeRunTicksPost, (r) => r.offBallDecisionTicksPost);
for (const c of RUN_CLASSES) {
  defFace(`runClass.shareOfMakeRun.${c}`, 'share',
    `the ${c} share of ALL attacking \`MakeRun\` DECISIONS (off-ball bodies AND the keeper)`,
    'attacking `MakeRun` decisions', (r) => r.runClassTicks[RCI(c)] + r.keeperRunClassTicks[RCI(c)],
    (r) => sum(r.runClassTicks) + sum(r.keeperRunClassTicks));
}
for (const st of STATES) {
  defFace(`state.decisionShare.${st}`, 'share',
    `the ${st} share of ALL attacking off-ball decision ticks — the STATE MIX itself`,
    'off-ball decision ticks', (r) => r.stateAllDecisions[SI(st)],
    (r) => r.offBallDecisionTicksPost);
  defFace(`state.hatRunsPerMatch.${st}`, 'coach-hat run decisions per match',
    `DS-T1's own per-state face, re-measured: hat runs won at a ${st} tick`, 'matches',
    (r) => r.stateRunDecisions[0 * NS + SI(st)], ONE);
  defFace(`state.ownRunsPerMatch.${st}`, 'own-run decisions per match',
    `DS-T1's own per-state face, re-measured: own runs won at a ${st} tick`, 'matches',
    (r) => r.stateRunDecisions[1 * NS + SI(st)], ONE);
  defFace(`state.hatRunShare.${st}`, 'share', `the ${st} share of all HAT run decisions`,
    'hat run decisions', (r) => r.stateRunDecisions[0 * NS + SI(st)],
    (r) => sliceSum(r.stateRunDecisions, 0, NS));
  defFace(`state.ownRunShare.${st}`, 'share', `the ${st} share of all OWN run decisions`,
    'own run decisions', (r) => r.stateRunDecisions[1 * NS + SI(st)],
    (r) => sliceSum(r.stateRunDecisions, NS, NS));
}
defFace('crowd.crashShare', 'share',
  'OBM-T1 / PT-C0\'s 撞车 face, BESIDE for continuity', 'sampled in-play ticks',
  (r) => r.crashHits, (r) => r.crowdSamples);
defFace('crowd.sampledTicksPerMatch', 'sampled in-play ticks per match',
  'the denominator above, per match', 'matches', (r) => r.crowdSamples, ONE);
defFace('guard.spacingUnder4', 'share', 'OBM-T1\'s per-match mean of the under-4 m pair share',
  'matches with a sampled pair', (r) => r.guardU4Sum, (r) => r.guardU4N);
defFace('guard.spacingUnder4Pooled', 'share', 'the POOLED under-4 m pair share',
  'sampled pairs', (r) => r.guardPairsUnder4, (r) => r.guardPairsTotal);
defFace('coupling.overlapSetsPerMatch', 'overlap designations per match',
  'DS-C0\'s field name, BESIDE (gBite\'s eligibility reads it)', 'matches',
  (r) => r.overlapSets, ONE);
defFace('coupling.wallFiresPerMatch', 'wall-pass licences per match', 'DS-C0\'s field name',
  'matches', (r) => r.wallFires, ONE);
defFace('coupling.overlapArrivalsPerMatch', 'overlap arrivals per match',
  'the engine\'s own `stats.overlaps`', 'matches', (r) => r.overlapArrivedStat, ONE);
defFace('coupling.oneTwosPerMatch', 'one-twos per match', 'the engine\'s own `stats.oneTwos`',
  'matches', (r) => r.wallOneTwosStat, ONE);
defFace('guard.goalsPerMatch', 'goals per match', 'context only — this is a CENSUS', 'matches',
  (r) => r.goals, ONE);
defFace('guard.shotsPerMatch', 'shots per match', 'context only', 'matches', (r) => r.shots, ONE);
defFace('guard.passesPerMatch', 'passes per match', 'context only', 'matches', (r) => r.passes,
  ONE);
defFace('guard.passCompletion', 'share', 'context only', 'engine passes',
  (r) => r.passesCompleted, (r) => r.passes);
defFace('guard.throughBallsPerMatch', 'through balls per match', 'the engine\'s own counter',
  'matches', (r) => r.throughBallsStat, ONE);
defFace('context.shotJoinShare', 'share',
  'a RECEIPT: `shotLog` rows joined to a shooter AT THE PUSH', '`shotLog` rows',
  (r) => r.shotsJoinedToAShooter, (r) => r.shotLogRows);
defFace('context.goalRowJoinShare', 'share',
  'a RECEIPT: goal rows whose shooter was recoverable from the gid banked at the push',
  'goal rows', (r) => r.goalRowsJoinedAtThePush,
  (r) => r.goalRowsJoinedAtThePush + r.goalRowsUnjoinable);
defFace('context.ticksPerMatch', 'stepped ticks per match', 'the match clock itself', 'matches',
  (r) => r.ticks, ONE);
defFace('calib.postStepOverLedger', 'ratio',
  'DEBT (a)\'s receipt: the POST-STEP reconstruction over the ENGINE\'S OWN `decisionsHeld`',
  'ledger-held decisions', (r) => r.heldBodyTicksPost, (r) => r.ledgerDecisionsHeld);
defFace('calib.preStepOverLedger', 'ratio', 'the same for DS-C0\'s PRE-STEP form',
  'ledger-held decisions', (r) => r.heldBodyTicksPre, (r) => r.ledgerDecisionsHeld);
defFace('calib.ledgerDecisionsHeldPerMatch', 'held decisions per match',
  'the engine\'s own ledger, per match', 'matches', (r) => r.ledgerDecisionsHeld, ONE);

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
  if (f === undefined) { banner(`IF-C0 FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};

/* ========================================================================== */
/* §14 THE FACE BLOCKS — the four PRE-REGISTERED QUESTIONS, as STORED PARTITIONS
   ⛔ NO READ SENTENCE IS FROZEN FOR A CENSUS (#415 item 6). The blocks below are TABLES; the
   commander drafts the IF contract on them.                                                  */
/* ========================================================================== */
const val = (k: string, armK: Arm): number => face(k, armK).value;
const pair = (k: string, armK: Arm) => ({
  value: face(k, armK).value, numerator: face(k, armK).numerator,
  denominator: face(k, armK).denominator,
  ci: [face(k, armK).ciLo, face(k, armK).ciHi], halfWidth: face(k, armK).halfWidth,
});
const Q1 = Object.fromEntries(ARMS.map((a) => [a, {
  arm: a,
  inFlightShareOfAllRunEpisodes: pair('run.inFlightShare', a),
  inFlightStartsPerMatch: pair('run.inFlightStartsPerMatch', a),
  runEpisodesPerMatch: pair('run.episodesPerMatch', a),
  theCoachsThreeExistingLicences: pair('run.inFlightShareOfTheCoachsHats', a),
  theOwnRunsLeak: pair('run.inFlightShareOfTheOwnRun', a),
  byWhyClass: Object.fromEntries(RUN_CLASSES_NAMED.map((c) => [c, {
    startsPerMatch: val(`run.startsPerMatch.${c}`, a),
    stateShares: Object.fromEntries(STATES.map((st) => [st,
      val(`run.startStateShare.${c}.${st}`, a)])),
  }])),
  theStatePartition: Object.fromEntries(STATES.map((st) => [st, {
    share: val(`run.startStateShare.${st}`, a), perMatch: val(`run.startsPerMatch.${st}`, a),
  }])),
  theInFlightProvenance: Object.fromEntries(PROVENANCES.map((pv) => [pv, {
    share: val(`flight.provenanceShare.${pv}`, a),
    perMatch: val(`flight.provenancePerMatch.${pv}`, a),
    ownRunShare: val(`flight.provenanceShare.ownRun.${pv}`, a),
  }])),
  note: '⛔ A PARTITION. The three in-flight licences that exist today (corner crash · cross '
    + 'flight · restart) live inside the SIX coach-hat classes; the own run\'s own in-flight '
    + 'share is the stale-eyes LEAK M-DS.7 does not close. ⛔ NO VERDICT WORD.',
}]));
const Q2 = Object.fromEntries(OWNRUN_ARMS.map((a) => [a, {
  arm: a,
  ownRunsStartedInFlightPerMatch: pair('leak.ownRunsInFlightPerMatch', a),
  thePartition: Object.fromEntries(LEAK_CELLS.map((lc) => [lc, {
    share: val(`leak.cellShare.${lc}`, a), perMatch: val(`leak.cellPerMatch.${lc}`, a),
  }])),
  staleOwnerShareAtEveryRunStart: pair('perceived.staleOwnerShare', a),
  staleOwnerShareOnTheOwnRun: pair('perceived.staleOwnerShare.ownRun', a),
  staleOwnerShareByTruthState: Object.fromEntries(STATES.map((st) => [st, {
    share: val(`perceived.staleOwnerShare.${st}`, a),
    stampedPerMatch: val(`perceived.stampedPerMatch.${st}`, a),
  }])),
  perceivedCellsOnTheOwnRun: Object.fromEntries(PERCEIVED.map((pk) => [pk,
    val(`perceived.cellShare.ownRun.${pk}`, a)])),
  note: '⛔ A PARTITION, NEVER A STORY (#415 item 6): `stalePasserStillCredited` is an EYES '
    + 'reading (the passer is still credited with a ball he has struck); '
    + '`aFreshMateWhoIsNotThePasser` is a CLASSIFIER-BOUNDARY reading (the eyes hold a '
    + 'different mate on the ball while the TRUTH classifier says the ball is in flight). ⛔ '
    + 'The instrument does NOT name which one the leak "is" — the cells are stored and the '
    + 'commander reads them.',
}]));
const Q3 = Object.fromEntries(ARMS.map((a) => [a, {
  arm: a,
  yieldByStartState: Object.fromEntries(STATES.map((st) => [st, {
    episodesPerMatch: val(`run.startsPerMatch.${st}`, a),
    aimedPerEpisode: val(`yield.aimedPerEpisode.${st}`, a),
    completedPerEpisode: val(`yield.completedPerEpisode.${st}`, a),
    shotsPerEpisode: val(`yield.shotsPerEpisode.${st}`, a),
    goalsPerEpisode: val(`yield.goalsPerEpisode.${st}`, a),
    shotsPerMatch: val(`yield.shotsPerMatch.${st}`, a),
    aimsPerMatch: val(`yield.aimedPerMatch.${st}`, a),
  }])),
  yieldByClassAndStartState: Object.fromEntries(
    (['ownRunInBehind', 'licensedRunInBehind', 'attackingTheBox'] as const).map((c) => [c,
      Object.fromEntries((['mateOwnsTheBall', 'ballInFlight'] as const).map((st) => [st, {
        shotsPerEpisode: val(`yield.shotsPerEpisode.${c}.${st}`, a),
        aimedPerEpisode: val(`yield.aimedPerEpisode.${c}.${st}`, a),
        episodes: face(`yield.shotsPerEpisode.${c}.${st}`, a).denominator,
      }]))])),
  intendedReceiverShares: {
    all: pair('flight.intendedReceiverShare', a),
    ownRun: pair('flight.intendedReceiverShare.ownRun', a),
    coachHats: pair('flight.intendedReceiverShare.coachHats', a),
    towardHim: pair('flight.towardHimShare', a),
    denominatorPerMatch: val('flight.startsOnHisSidesPassPerMatch', a),
  },
  thatFlightsOwnOutcome: Object.fromEntries(OUTCOMES.map((oc) => [oc, {
    share: val(`flight.outcomeShare.${oc}`, a),
    shareOnTheIntendedReceiver: val(`flight.outcomeShareIntended.${oc}`, a),
  }])),
  note: '⛔ PRINTED BESIDE EACH OTHER, NO VERDICT WORD. The two populations differ in far more '
    + 'than the start state.',
}]));
const Q4 = Object.fromEntries(ARMS.map((a) => [a, {
  arm: a,
  theTimingHistogram: Object.fromEntries(DT_BINS.map((b) => [b, {
    share: val(`dt.binShare.${b}`, a),
    byClass: Object.fromEntries((['ownRunInBehind', 'licensedRunInBehind', 'attackingTheBox',
      'arrivingLate'] as const).map((c) => [c, val(`dt.binShare.${c}.${b}`, a)])),
    byStartState: Object.fromEntries(STATES.map((st) => [st,
      val(`dt.binShareByState.${st}.${b}`, a)])),
  }])),
  negativeShare: pair('dt.negativeShare', a),
  attachment: {
    liveFlightShare: val('dt.attachedLiveShare', a),
    nextReleaseShare: val('dt.attachedNextShare', a),
    noAttachedReleaseShare: val('dt.noAttachedReleaseShare', a),
    binnedEpisodesPerMatch: val('dt.binnedEpisodesPerMatch', a),
  },
  theEventualReceiver: {
    completedReleasesPerMatch: val('receiver.completedReleasesPerMatch', a),
    classShares: Object.fromEntries(RECEIVER_CLASSES.map((rc) => [rc, {
      share: val(`receiver.classShare.${rc}`, a),
      perMatch: val(`receiver.classSharePerMatch.${rc}`, a),
      onTheIntendedReceiver: val(`receiver.classShareIntended.${rc}`, a),
    }])),
    intendedShare: val('receiver.intendedShare', a),
  },
  theReleaseItself: {
    releasesPerMatch: val('release.perMatch', a),
    runnersAlreadyRunningAtRelease: val('release.runnersAtReleaseMean', a),
    runnerBins: Object.fromEntries(Array.from({ length: REL_RUNNER_BINS }, (_, k) => [
      k === REL_RUNNER_BINS - 1 ? `${k}plus` : `${k}`,
      val(`release.runnerBinShare.${k === REL_RUNNER_BINS - 1 ? `${k}plus` : k}`, a)])),
    startsDuringFlightPerRelease: val('release.startsDuringFlightPerRelease', a),
    startsDuringFlightPerReleaseByClass: Object.fromEntries(RUN_CLASSES_NAMED.map((c) => [c,
      val(`release.startsDuringFlightPerRelease.${c}`, a)])),
    flightTicksPerRelease: val('release.flightTicksPerRelease', a),
    outcomeShares: Object.fromEntries(OUTCOMES.map((oc) => [oc,
      val(`release.outcomeShare.${oc}`, a)])),
  },
  note: '⭐⭐⭐ THE HISTOGRAM THE IF CONTRACT\'S REALITY AUDIT WILL BE WRITTEN AGAINST. ⛔ It is a '
    + 'table; no sentence is frozen on it here.',
}]));
const CROWDING = Object.fromEntries(ARMS.map((a) => [a, {
  crashShare: val('crowd.crashShare', a),
  sampledTicksPerMatch: val('crowd.sampledTicksPerMatch', a),
  spacingUnder4: val('guard.spacingUnder4', a),
  spacingUnder4Pooled: val('guard.spacingUnder4Pooled', a),
}]));
const PULL_RECEIPT = Object.fromEntries(ARMS.map((a) => [a, {
  arm: a, armCarriesDsOwnRun: ARM_KIND[a] !== 'HATS',
  pullsPerMatch: val('perceived.pullsPerMatch', a),
  pullsTotal: face('perceived.pullsPerMatch', a).numerator,
  stampedRunStartsTotal: face('perceived.stampedPerMatch', a).numerator,
  pullsEqualStampedStarts: face('perceived.pullsPerMatch', a).numerator
    === face('perceived.stampedPerMatch', a).numerator,
}]));

/* ========================================================================== */
/* §15 gBite (the #414 FAMILY-NOTE ROW FORM), THE POOLED BINS, THE MEDIANS AND THE SIZING */
/* ========================================================================== */
/** ⭐⭐⭐ gBite in the #414 FAMILY-NOTE form, VERBATIM: "a liveness receipt for a switch whose
 *  effect is a RARE EVENT compares the per-seed ROW (any stored field), not the full-time
 *  signature — a full-time state snapshot is not a trajectory hash and a hat's whole effect can
 *  be absorbed before the whistle. The next exam that inherits `gBite` states its liveness on
 *  the row and keeps the signature comparison as a printed face."  ⚠ LIVENESS ONLY. */
const BITE_TREAT: Arm = 'OWNCOOP-E13';
const BITE_CTRL: Arm = 'OWN-E13';
const ROW_KEYS_FOR_BITE = Object.keys(emptyRow()).filter((k) => k !== 'wallMs');
const biteRow = (() => {
  const eligible = cells.filter((c) => c.rows[BITE_CTRL].overlapSets
    + c.rows[BITE_CTRL].wallFires > 0);
  const rowDiffering: number[] = [];
  const rowIdentical: number[] = [];
  const sigIdentical: number[] = [];
  for (const c of eligible) {
    const a = c.rows[BITE_TREAT] as unknown as Record<string, unknown>;
    const b = c.rows[BITE_CTRL] as unknown as Record<string, unknown>;
    const differs = ROW_KEYS_FOR_BITE.some((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
    if (differs) rowDiffering.push(c.seed); else rowIdentical.push(c.seed);
    if (c.rows[BITE_TREAT].signature === c.rows[BITE_CTRL].signature) sigIdentical.push(c.seed);
  }
  return {
    treatmentArm: BITE_TREAT, controlArm: BITE_CTRL,
    eligibilityPredicate: 'the CONTROL arm issued at least one cooperation hat on this seed '
      + '(`overlapSets + wallFires > 0`)',
    seeds: cells.length, eligibleSeeds: eligible.length,
    exemptSeeds: cells.length - eligible.length,
    comparedFields: ROW_KEYS_FOR_BITE.length,
    rowDiffering: rowDiffering.length,
    rowIdenticalSeeds: rowIdentical,
    allRowsDiffer: eligible.length > 0 && rowIdentical.length === 0,
    /** ⭐ THE PRINTED FACE the family note keeps beside the row form */
    fullTimeSignatureIdenticalSeeds: sigIdentical.length,
    fullTimeSignatureIdenticalSample: sigIdentical.slice(0, 20),
    fullTimeSignatureDiffering: eligible.length - sigIdentical.length,
    note: '⭐⭐⭐ THE ROW FORM (#414 §CORR 8\'s FAMILY NOTE): liveness is asserted on the PER-SEED '
      + 'ROW — ANY stored field differing between the two arms on a seed where the control '
      + 'issued a cooperation hat. The FULL-TIME SIGNATURE comparison is kept as a PRINTED '
      + 'FACE beside it and gates NOTHING. ⚠ LIVENESS ONLY: a differing row says the flag '
      + 'fired, never that it helped.',
  };
})();
const BITE_OK = biteRow.allRowsDiffer;
/** the POOLED bins, and every bin-derived median WITH ITS TOP BIN'S SHARE (debt (c)) */
const POOL_KEYS = ['epStarts', 'runEpTickBins', 'epStartsInFlightProvenance', 'epFlightAgeBins',
  'epInFlightOutcome', 'epPerceived', 'epPerceivedByState', 'epPerceivedAgeBins',
  'epDtBins', 'epDtBinsByState', 'leakCells', 'leakAgeBins', 'leakFlightAgeBins',
  'releaseRunnerBins', 'releaseStartsDuringFlight', 'releasesResolved', 'receiverClass',
  'receiverClassIntended', 'r1Bins', 'r1RunnersByRole', 'runCountBins', 'runnersByRole',
  'branchTicks', 'offBallActionTicksPost', 'runClassTicks', 'keeperRunClassTicks',
  'stateRunDecisions', 'stateAllDecisions', 'epAimed', 'epCompleted', 'runEpShots', 'runEpGoals',
  'epInFlightIntended', 'epInFlightToward', 'epInFlightOwnSidePass', 'epInFlightOutcomeIntended',
  'epPerceivedStale', 'epPerceivedStamped', 'epPerceivedStaleByState',
  'epPerceivedStampedByState', 'epDtAttachedLive', 'epDtAttachedNext', 'epDtNoAttachedRelease',
] as const;
const poolFrom = (rows: readonly Row[]): Record<string, number[]> => {
  const empty = emptyRow() as unknown as Record<string, number[]>;
  const p: Record<string, number[]> = {};
  for (const k of POOL_KEYS) p[k] = zeros(empty[k].length);
  for (const r of rows) {
    const rr = r as unknown as Record<string, number[]>;
    for (const k of POOL_KEYS) addInto(p[k], rr[k]);
  }
  return p;
};
const mediansFrom = (p: Record<string, number[]>): Record<string, unknown> => ({
  runEpisodeTicksMedian: binMedian(p.runEpTickBins, EPW_BIN),
  runEpisodeTicksTopBinShare: topBinShare(p.runEpTickBins),
  perceivedAgeTicksMedian: binMedian(p.epPerceivedAgeBins, AGE_BIN),
  perceivedAgeTicksTopBinShare: topBinShare(p.epPerceivedAgeBins),
  leakPerceivedAgeTicksMedian: binMedian(p.leakAgeBins, AGE_BIN),
  leakPerceivedAgeTicksTopBinShare: topBinShare(p.leakAgeBins),
  truthFlightAgeSecondsMedian: binMedian(p.epFlightAgeBins, FLIGHT_AGE_BIN),
  truthFlightAgeSecondsTopBinShare: topBinShare(p.epFlightAgeBins),
  leakTruthFlightAgeSecondsMedian: binMedian(p.leakFlightAgeBins, FLIGHT_AGE_BIN),
  leakTruthFlightAgeSecondsTopBinShare: topBinShare(p.leakFlightAgeBins),
});
const pooled = Object.fromEntries(ARMS.map((a) => [a, poolFrom(armRows(a))]));
const medians = Object.fromEntries(ARMS.map((a) => [a, mediansFrom(pooled[a])]));
/** THE SIZING — the house form, on the DISCLOSED 12-seed smoke (§DEV-PREFLIGHT) */
const Z975 = 1.959963984540054;
const ZSUM = 1.959963984540054 + 0.8416212335729143;
const SMOKE_N = 12;
/** ⭐⭐ THE SIZING INPUTS — the half-widths MEASURED by the DISCLOSED 12-seed scratch smoke on
 *  900,008,000–011 (FOUR walks per seed), TRANSCRIBED here from the doc's §DEV-PREFLIGHT table
 *  and re-derived off the artifact by `gFaces`. The declared target is a 0.05 HALF-WIDTH on the
 *  ARM OF RECORD's in-flight run share and on THE HATS'. */
const SMOKE_HW_INFLIGHT_OWNCOOP = 0.017440485729238224;
const SMOKE_HW_INFLIGHT_HATS = 0.008186650915534555;
const SIZING_INPUTS = [
  { face: 'run.inFlightShare@OWNCOOP-E13', key: 'run.inFlightShare', arm: 'OWNCOOP-E13' as Arm,
    hwSmoke: SMOKE_HW_INFLIGHT_OWNCOOP, target: 0.05 },
  { face: 'run.inFlightShare@HATS-E13', key: 'run.inFlightShare', arm: 'HATS-E13' as Arm,
    hwSmoke: SMOKE_HW_INFLIGHT_HATS, target: 0.05 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    face: r.face, hwSmoke: r.hwSmoke, target: r.target, smokeClusters: SMOKE_N,
    seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, blockAffords: N_FROZEN,
    degenerate: r.hwSmoke === 0,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);
const REALISED_HALF_WIDTHS = SIZING_INPUTS.map((r) => ({
  face: r.face, realisedHalfWidth: face(r.key, r.arm).halfWidth, value: face(r.key, r.arm).value,
  ci: [face(r.key, r.arm).ciLo, face(r.key, r.arm).ciHi], target: r.target,
}));

/* ========================================================================== */
/* §16 THE GATES (all liveness / receipt — ⛔ NEVER a direction)                */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED, FIXTURE_SEED];
const SCRATCH_BAND: [number, number] = [SCRATCH_BASE, SCRATCH_BASE + 99];
const SCRATCH_SEEDS_WALKED = [
  { what: 'the sizing smoke (§DEV-PREFLIGHT, twelve seeds)',
    seeds: Array.from({ length: 12 }, (_, i) => SCRATCH_BASE + i) },
  { what: 'the smoke receipt', seeds: [SCRATCH_BASE + 20] },
  { what: 'the world pin', seeds: [WORLD_PIN_SEED] },
  { what: 'the lockstep pair (X-DET and gPullCount re-use it)', seeds: LOCKSTEP_SEEDS },
  { what: 'the fixtures\' attribute draw', seeds: [FIXTURE_SEED] },
];
const SCRATCH_SEEDS_FLAT = [...new Set(SCRATCH_SEEDS_WALKED.flatMap((r) => r.seeds))]
  .sort((a, b) => a - b);
const SCRATCH_OUT_OF_BAND = SCRATCH_SEEDS_FLAT
  .filter((x) => x < SCRATCH_BAND[0] || x > SCRATCH_BAND[1]);
const VERIFIER_BAND: [number, number] = [900_008_100, 900_008_199];
const SCRATCH_BAND_OK = SCRATCH_BAND[0] >= 900_000_000
  && SCRATCH_OUT_OF_BAND.length === 0
  && SCRATCH_SEEDS_FLAT.every((x) => x >= 900_000_000)
  && SCRATCH_SEEDS_FLAT.every((x) => x < BLOCK_BASE || x > BLOCK_TOP)
  && ALL_SCRATCH.every((x) => x >= SCRATCH_BAND[0] && x <= SCRATCH_BAND[1])
  && SCRATCH_SEEDS_FLAT.every((x) => x < VERIFIER_BAND[0] || x > VERIFIER_BAND[1])
  && (BLOCK_TOP < SCRATCH_BAND[0] || BLOCK_BASE > SCRATCH_BAND[1]);
fx('scratch.everySeedIsDERIVEDFromTheONEDeclaredBase',
  SCRATCH_SEEDS_FLAT.every((x) => x - SCRATCH_BASE >= 0 && x - SCRATCH_BASE <= 99), true);
fx('scratch.aSeedONEPastTheBandWouldBeCAUGHT',
  [SCRATCH_BASE + 100].filter((x) => x < SCRATCH_BAND[0] || x > SCRATCH_BAND[1]).length, 1);
fx('scratch.theVERIFIERSBandIsNOTTheExecutors',
  SCRATCH_SEEDS_FLAT.some((x) => x >= VERIFIER_BAND[0] && x <= VERIFIER_BAND[1]), false);
fx('scratch.theBatteryBandAndTheScratchBandAreDISJOINT',
  SCRATCH_SEEDS_FLAT.some((x) => x >= BLOCK_BASE && x <= BLOCK_TOP), false);
/** ⭐⭐⭐ #415 item 6's HARD FLOOR: ⛔ NEVER A SIM SEED ≥ 12,559,000. The scratch band lives on
 *  the OUT-OF-BAND lattice (≥ 900,000,000) and is NOT a sim seed, so the invariant is stated
 *  over the sim-seed lattice and the scratch seeds are excluded BY NAME. */
const SIM_SEEDS_TOUCHED = [...walkedSeeds, RECEIPT_SEED, ...REPRO_SEEDS]
  .filter((s) => s < 900_000_000);
fx('seeds.noSIMSeedIsEverAtOrAbove12559000',
  SIM_SEEDS_TOUCHED.some((s) => s >= 12_559_000), false);
fx('seeds.aSIMSeedONEPastTheCeilingWouldBeCAUGHT',
  [...SIM_SEEDS_TOUCHED, 12_559_000].some((s) => s >= 12_559_000), true);
fx('seeds.theScratchBandIsNOTOnTheSimLattice',
  SCRATCH_SEEDS_FLAT.every((s) => s >= 900_000_000), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000, 12_553_000, 12_554_000, 12_555_000,
  12_556_000, 12_557_000];
/** ⭐⭐⭐ THE EMPTINESS TABLES — ENUMERATED, never gated (⛔ NO FALSE UNIVERSAL). */
const EMPTY_RUN_CLASSES = ARMS.flatMap((a) => RUN_CLASSES_NAMED
  .filter((c) => tot(a, (r) => strideSum(r.epStarts, RCI(c), NC, NS)) === 0)
  .map((c) => `${a}.${c}`));
const EMPTY_START_STATES = ARMS.flatMap((a) => STATES
  .filter((st) => tot(a, (r) => sliceSum(r.epStarts, SI(st) * NC, NC)) === 0)
  .map((st) => `${a}.${st}`));
const EMPTY_PROVENANCES = ARMS.flatMap((a) => PROVENANCES
  .filter((pv) => tot(a, (r) => sliceSum(r.epStartsInFlightProvenance, PVI(pv) * NC, NC)) === 0)
  .map((pv) => `${a}.${pv}`));
const EMPTY_DT_BINS = ARMS.flatMap((a) => DT_BINS
  .filter((_, k) => tot(a, (r) => sliceSum(r.epDtBins, k * NC, NC)) === 0)
  .map((b) => `${a}.${b}`));
const EMPTY_PERCEIVED_CELLS = OWNRUN_ARMS.flatMap((a) => PERCEIVED
  .filter((pk) => tot(a, (r) => sliceSum(r.epPerceived, PCI(pk) * NC, NC)) === 0)
  .map((pk) => `${a}.${pk}`));
const EMPTY_LEAK_CELLS = OWNRUN_ARMS.flatMap((a) => LEAK_CELLS
  .filter((lc) => tot(a, (r) => r.leakCells[LKI(lc)]) === 0).map((lc) => `${a}.${lc}`));
const EMPTY_OUTCOMES = ARMS.flatMap((a) => OUTCOMES
  .filter((oc) => tot(a, (r) => r.releasesResolved[OCI(oc)]) === 0).map((oc) => `${a}.${oc}`));
const EMPTY_RECEIVER_CLASSES = ARMS.flatMap((a) => RECEIVER_CLASSES
  .filter((rc) => tot(a, (r) => r.receiverClass[RVI(rc)]) === 0).map((rc) => `${a}.${rc}`));
/** the gate asserts LIVENESS only on the classes a PARTITION STANDS ON */
/** ⭐⭐⭐ THE EMPTINESS THE GATE MUST NOT TOUCH (the §DEV-PREFLIGHT lesson, DISCLOSED):
 *  `epInFlightOwnSidePass` and the NEGATIVE half of the Δt histogram are RARE — and on the
 *  SHIPPED arms they may be STRUCTURALLY zero, because with no carrier the shipped licence
 *  fires ONLY at a RESTART, a live CORNER CRASH or a live CROSS FLIGHT, so a run started inside
 *  the flight of an ordinary pass has no candidate to attach to at all. GATING ON THEM WOULD
 *  GATE A DIRECTION ON THIS CENSUS'S OWN FINDING, so they are ENUMERATED per arm and the
 *  LIVENESS is required only where a PARTITION STANDS ON THEM — the arms carrying `dsOwnRun`,
 *  where the leak and its anatomy live. */
const EMPTY_IN_FLIGHT_OWN_SIDE_PASS = ARMS
  .filter((a) => tot(a, (r) => sum(r.epInFlightOwnSidePass)) === 0)
  .map((a) => `${a}.inFlightStartsOnHisSidesPass`);
const EMPTY_NEGATIVE_DT = ARMS
  .filter((a) => tot(a, (r) => sliceSum(r.epDtBins, 0, 3 * NC)) === 0)
  .map((a) => `${a}.negativeDeltaT`);
const CLASSES_LIVE = ARMS.every((a) => tot(a, (r) => r.epStartsAll) > 0
    && tot(a, (r) => sliceSum(r.epStarts, SI('ballInFlight') * NC, NC)) > 0
    && tot(a, (r) => sliceSum(r.epStarts, SI('mateOwnsTheBall') * NC, NC)) > 0
    && tot(a, (r) => sum(r.epStartsInFlightProvenance)) > 0
    && tot(a, (r) => sum(r.epDtBins)) > 0
    && tot(a, (r) => sliceSum(r.epDtBins, 3 * NC, 4 * NC)) > 0
    && tot(a, (r) => r.releases) > 0
    && tot(a, (r) => sum(r.receiverClass)) > 0
    && tot(a, (r) => sum(r.releasesResolved)) > 0
    && tot(a, (r) => r.shotLogRows) > 0
    && tot(a, (r) => r.r1TeamTicks) > 0
    && tot(a, (r) => r.offBallDecisionTicksPost) > 0)
  && OWNRUN_ARMS.every((a) => tot(a, (r) => r.instrumentPulls) > 0
    && tot(a, (r) => sum(r.epPerceivedStamped)) > 0
    && tot(a, (r) => r.leakOwnRunsInFlight) > 0
    && tot(a, (r) => sum(r.leakCells)) > 0
    && tot(a, (r) => sum(r.epInFlightOwnSidePass)) > 0
    && tot(a, (r) => sliceSum(r.epDtBins, 0, 3 * NC)) > 0
    && tot(a, (r) => strideSum(r.epStarts, RCI('ownRunInBehind'), NC, NS)) > 0)
  && ARMS.filter((a) => ARM_KIND[a] === 'HATS').every((a) =>
    tot(a, (r) => r.instrumentPulls) === 0
    && tot(a, (r) => strideSum(r.epStarts, RCI('ownRunInBehind'), NC, NS)) === 0);
const TWO_FRACTION_PAIRS = [
  ['run.inFlightShare', 'run.inFlightStartsPerMatch'],
  ['run.startStateShare.ballInFlight', 'run.startsPerMatch.ballInFlight'],
  ['run.startStateShare.mateOwnsTheBall', 'run.startsPerMatch.mateOwnsTheBall'],
  ['run.startStateShare.ownRestart', 'run.startsPerMatch.ownRestart'],
  ['flight.provenanceShare.hisSidesPass', 'flight.provenancePerMatch.hisSidesPass'],
  ['flight.intendedReceiverShare', 'flight.startsOnHisSidesPassPerMatch'],
  ['yield.shotsPerEpisode.ballInFlight', 'yield.shotsPerMatch.ballInFlight'],
  ['yield.aimedPerEpisode.ballInFlight', 'yield.aimedPerMatch.ballInFlight'],
  ['dt.negativeShare', 'dt.binnedEpisodesPerMatch'],
  ['perceived.staleOwnerShare', 'perceived.staleOwnersPerMatch'],
  ['perceived.staleOwnerShare.ballInFlight', 'perceived.stampedPerMatch.ballInFlight'],
  ['leak.cellShare.stalePasserStillCredited', 'leak.cellPerMatch.stalePasserStillCredited'],
  ['leak.cellShare.aFreshMateWhoIsNotThePasser',
    'leak.cellPerMatch.aFreshMateWhoIsNotThePasser'],
  ['receiver.classShare.startedDuringTheFlight',
    'receiver.classSharePerMatch.startedDuringTheFlight'],
  ['receiver.classShare.runningAtRelease', 'receiver.classSharePerMatch.runningAtRelease'],
  ['release.runnerBinShare.0', 'release.perMatch'],
  ['r1.runsPerInPossessionTick', 'r1.teamTicksPerMatch'],
  ['board.openPlayEmptyShare', 'board.openPlayCoachTicksPerMatch'],
  ['crowd.crashShare', 'crowd.sampledTicksPerMatch'],
  ['runCount.mean', 'runCount.designationsPerMatch'],
  ['offBall.makeRunShare', 'offBall.decisionTicksPerMatch'],
];
/** ⭐⭐ gLedgerRead — WHICH FACE READS AN ENGINE RECORD AND WHICH IS A DECLARED HEURISTIC. */
const LEDGER_TABLE = [
  { face: 'the run class', source: 'RECORD', what: 'the WINNER\'S own `why` in '
    + '`p.action.scores[0]` — the seven literals EXTRACTED from their own anchored lines' },
  { face: 'the flight\'s PROVENANCE and AGE', source: 'RECORD',
    what: '`match.pendingPass`\'s own `side` and `t`' },
  { face: 'the INTENDED RECEIVER', source: 'RECORD',
    what: '`match.pendingPass.targetGid` — THE ENGINE HAS THE FIELD, so #415 item 6(3)\'s '
      + 'first-touch fallback is NOT implemented and would be dead code' },
  { face: 'the flight\'s OUTCOME — `receivedByAMate`', source: 'RECORD',
    what: 'a NEW `match.lastCompletedPass` with the flight\'s own `passerGid`' },
  { face: 'the flight\'s OUTCOME — `intercepted`', source: 'RECORD',
    what: 'the OTHER side\'s `stats.interceptions` rising on the resolving tick' },
  { face: 'the flight\'s OUTCOME — `outOrDeadBall`', source: 'RECORD',
    what: '`match.phase` leaving `playing` on the resolving tick' },
  { face: 'the flight\'s OUTCOME — `looseOrExpired`', source: 'DECLARED RESIDUAL',
    what: '⚠ THE ENGINE KEEPS NO RECORD that separates a ball running loose from the ledger\'s '
      + 'own 3.5 s expiry, so this cell is the RESIDUAL of the three above and SAYS SO' },
  { face: 'the PERCEIVED ball', source: 'RECORD',
    what: 'the runner\'s OWN `match.perceivedSnapshot(p).ball` — `ownerGid` and `ageTicks`' },
  { face: 'the STALE-OWNER test', source: 'RECORD vs RECORD',
    what: 'the perceived `ownerGid` against `match.ball.owner`\'s own gid AT THE SAME '
      + 'POST-STEP TICK the snapshot was materialised from' },
  { face: 'the run\'s YIELD', source: 'RECORD',
    what: '`pendingPass` (aimed) · `lastCompletedPass` (completed) · a NEW `shotLog` row joined '
      + 'to `pendingShot.shooterGid` through its own `logIndex` WITH THE GID BANKED AT THE PUSH '
      + '(debt (b)) · that row\'s outcome flip (goals)' },
  { face: 'Δt', source: 'RECORD', what: '`match.pendingPass.t` — the release clock itself' },
  { face: 'the CROWDING family', source: 'HEURISTIC (inherited, DECLARED)',
    what: 'OBM-T1 / PT-C0\'s own spacing fold — no engine record exists for it' },
  { face: 'the wall FIRE', source: 'RECORD', what: '`passer.wallRun`\'s own transition' },
  { face: 'the overlap ARRIVAL and the ONE-TWO', source: 'RECORD',
    what: 'the engine\'s own `stats.overlaps` / `stats.oneTwos`' },
];
const LEDGER_OK = ARMS.every((a) => tot(a, (r) => r.shotLogRows) > 0
  && tot(a, (r) => r.shotsJoinedToAShooter) > 0
  && tot(a, (r) => r.goalRowsJoinedAtThePush) > 0
  && tot(a, (r) => r.ledgerDecisionsHeld) > 0
  && tot(a, (r) => sum(r.releasesResolved)) > 0)
  && LEDGER_TABLE.some((t) => t.source === 'DECLARED RESIDUAL')
  && LEDGER_TABLE.some((t) => t.source.startsWith('HEURISTIC'));
const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((a) => allRows(a).every((r) => r.worldOk && r.edsChoiceOn && r.genomeClean
      && r.pcHoldsReadable && r.infoGenomeCleanOfMatrix
      && r.dsOwnRunFlag === (ARM_KIND[a] !== 'HATS')
      && r.dsHatsOffFlag === (ARM_KIND[a] !== 'HATS')
      && r.dsCoopHatsOffFlag === (ARM_KIND[a] === 'OWNCOOP')
      && r.obmFlag === false && r.matrixOnBaseEff === false)) && WORLD_PIN_OK,
    note: `⭐⭐ PER ARM, on EVERY walked match AND the construction receipt: \`bqArmedVersion(m) `
      + `=== ${BQ_WORLD_VERSION}\` with \`bqCushion\` TRUE, \`lnArmedVersion(m) !== `
      + `${LN_WORLD_VERSION}\` and \`gkArmedVersion(m) !== ${GK_WORLD_VERSION}\` with both `
      + 'doors ABSENT; `edsPerceivedChoice` TRUE; every CTB / RC / BF seam ABSENT; THE THREE DS '
      + 'FLAGS EXACTLY AS DUE per arm (three-flag arming: `dsOwnRun` + `dsHatsOff` on the OWN '
      + 'and OWNCOOP arms, `dsCoopHatsOff` on OWNCOOP only, NONE on HATS-E13 or D13); ⛔ NO '
      + 'DOSE of the OBM seat — `obmMovement` FALSE and NO 16-slot matrix on `baseGenome` or '
      + '`effGenome` of either team on ANY arm; and ⛔ `info.genome` CLEAN. Pinned again on a '
      + `CONSTRUCTED match of each arm at scratch seed ${WORLD_PIN_SEED}`,
  },
  gRepro: {
    ok: REPRO_OK,
    note: `⭐⭐⭐ G-REPRO: ${reproDetail.comparedFields.length} fields × ${reproDetail.rows.length} `
      + `arm-seed rows (${REPRO_ARMS.length} E13 arms × ${REPRO_SEEDS.length} seeds) — `
      + `${reproDetail.rows.every((r) => r.mismatches.length === 0) ? 'ZERO mismatches'
        : `MISMATCHES on ${reproDetail.rows.filter((r) => r.mismatches.length > 0)
          .map((r) => `${r.arm}@${r.seed}: ${r.mismatches.join(', ')}`).join(' · ')}`}. `
      + reproDetail.note,
  },
  gPullCount: {
    ok: PULLCOUNT_OK,
    note: '⭐⭐⭐ THE DECLARED ADDED READ, COUNTED. This instrument takes ONE '
      + '`perceivedSnapshot` per STAMPED run-start tick INSIDE the arm\'s own flag; the gate '
      + 'asserts that OBSERVED − UNOBSERVED equals the row\'s OWN stored `instrumentPulls` on '
      + `every spied pair (${pullRows.length} pairs: `
      + `${pullRows.map((r) => `${r.arm}@${r.seed} +${r.addedPulls}`).join(' · ')}), that the `
      + 'added count is ZERO on every arm WITHOUT `dsOwnRun` and POSITIVE on every arm with it '
      + '(a dead counter would prove nothing), that the whole-match SIGNATURES are equal '
      + 'either way, and that the wrapped observed signature equals the UNWRAPPED lockstep '
      + 'walk\'s — which is what proves the wrapper itself transparent',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐⭐⭐ THE ADDED PULL IS INERT, PROVEN NOT ASSERTED: the same scratch seed walked '
      + 'OBSERVED (with the pull) and UNOBSERVED (without it) yields a BYTE-IDENTICAL '
      + `whole-match signature on all ${lockstepRows.length} arm × out-of-band-scratch walks. `
      + '`perceivedSnapshot` reconstructs THIS body\'s memory from its own recorded scan '
      + 'frames, so a second, later pull is idempotent — the seam doc\'s §DEVIATIONS-B 1 idiom, '
      + 'MEASURED here. Everything else the instrument reads is a pure read of public state '
      + 'and of the engine\'s own decision record',
  },
  gDeterminism: {
    ok: XDET_OK,
    note: `⭐ X-DET, TWICE: each of the two out-of-band scratch seeds walked TWICE PER ARM, `
      + 'OBSERVED both times; both the whole-match signature AND this instrument\'s own '
      + `per-seed row bytes are identical on all ${xDetRows.length} pairs`,
  },
  gFingerprintProd: {
    ok: FP_PROD_OK,
    note: `⭐⭐ X-FP-PROD recomputed IN THIS PROCESS by the shipped recipe and equal to the `
      + `literal of record ${FP_PROD_PIN}. A census cannot move it — and this gate proves the `
      + 'tree it ran on did not',
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
      + 'the construction receipt lie inside block 12,558,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is DECLARED `
      + 'in the `seeds` block, and EVERY scratch seed this instrument walks is out-of-band and '
      + 'STORED there. ⭐ THE RE-WALKS on 12,557,000–002 are DS-T1d\'s OWN CONSUMED BAND and '
      + 'are NOT a consumption — canon, VERBATIM: "verifier scratch walks use the stage\'s own '
      + 'consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next virgin '
      + 'block"',
  },
  gSeedDisjoint: {
    ok: walkedSeeds.every((s) => s >= BLOCK_BASE) && ALL_SCRATCH.every((s) => s >= 900_000_000)
      && (IS_OVERRIDE || (walkedSeeds[0] === BLOCK_BASE && RECEIPT_SEED === BLOCK_TOP))
      && CONSUMED_BLOCKS.every((b) => b + 999 < BLOCK_BASE)
      && REPRO_SEEDS.every((s) => s >= 12_557_000 && s <= 12_557_999)
      && SIM_SEEDS_TOUCHED.every((s) => s < 12_559_000),
    note: 'SEED-DISJOINT at the frontier of #415 item 9 (next sim ≥ 12,558,000): every battery '
      + 'seed is ≥ 12,558,000 and inside THIS block, every one of the FOURTEEN consumed blocks '
      + 'of record (LN-C0 12,544,000–999 … DS-T1c 12,556,000–999 · DS-T1d 12,557,000–999) is '
      + 'checked to END BELOW this block\'s base, the G-REPRO re-walks lie INSIDE DS-T1d\'s own '
      + 'consumed block, and ⛔ NO SEED THIS INSTRUMENT TOUCHES IS ≥ 12,559,000. ZERO stats '
      + 'consumed',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms. ⭐ N = min(nRequired, the block's affordance) IS `
        + 'TAKEN AS THE AFFORDANCE — the #414 §CORR 8 FLOOR READING, said plainly in the '
        + '`sizing.whichNWasTaken` field; each sizing row states its own `resolvableAtNFrozen` '
        + 'and the REALISED half-width at N is published beside the projection',
  },
  gScratchBand: {
    ok: SCRATCH_BAND_OK,
    note: `⭐⭐ EVERY scratch seed this instrument walks — ${SCRATCH_SEEDS_FLAT.length} of them, `
      + `${SCRATCH_SEEDS_WALKED.map((r) => `${r.seeds.length} for ${r.what}`).join(' · ')} — is `
      + `DERIVED from the ONE declared base ${SCRATCH_BASE} and lies INSIDE the DECLARED BAND `
      + `[${SCRATCH_BAND[0]}, ${SCRATCH_BAND[1]}]; the out-of-band list is `
      + `[${SCRATCH_OUT_OF_BAND.join(', ') || 'empty'}]. ⛔ THE VERIFIER'S BAND `
      + `[${VERIFIER_BAND[0]}, ${VERIFIER_BAND[1]}] IS NOT THIS EXECUTOR'S and is asserted `
      + 'DISJOINT from every seed walked here. The band sits above canon\'s own scratch floor '
      + 'and is DISJOINT from the battery block both ways',
  },
  gTwoFractions: {
    ok: TWO_FRACTION_PAIRS.every(([a, b]) => FACE_KEYS.includes(a) && FACE_KEYS.includes(b)),
    note: `⭐ TWO FRACTIONS: each of the ${TWO_FRACTION_PAIRS.length} read-bearing quantities is `
      + 'published BOTH per its own denominator AND per match (or per a denominator-stable '
      + 'companion), so no share can hide a moving denominator. The pairs are stored in '
      + '`twoFractionPairs`',
  },
  gAnchoredConstants: {
    ok: ANCHORS.every((a) => a.occurrences.length === a.want) && LITERALS_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites, EVERY one at its `
      + 'declared occurrence count: ⭐⭐⭐ THE SHIPPED LICENCE\'S STATE CLAUSE and its THREE '
      + 'IN-FLIGHT LICENCES (`crashLive` off `team.cornerCrash` · `crossLive` off '
      + '`team.crossFlight` AND `match.c4Arrival` · the restart off `match.phase`) · M-DS.7\'s '
      + 'GUARD with its OWNER READ and the ZERO-COUNT negatives (`ageTicks` appears ZERO times '
      + 'in the whole of `PlayerBrain.ts`) · `ObservedBall`\'s five fields · `PendingPass`\'s '
      + 'own interface with the ENGINE\'S OWN `targetGid` · the completion and interception '
      + 'ledger lines · the THROUGH-BALL CHOOSER\'S RUNNER SCAN and the other two ACTION-TYPE '
      + 'reads · the SEVEN `why` literals · the two world-17 gate lines · the cadence '
      + 'constants · the crowding family · X-FP-PROD\'s baseline. Every numeric constant and '
      + 'all seven `why` literals are PARSED out of their own anchored lines, never typed',
  },
  gPredicateFixtures: {
    ok: FIXTURES_OK,
    note: `⭐⭐ ${FIXTURES.length} FIXTURES — EVERY walk-side predicate with a case where it `
      + 'FIRES and one where it does NOT: the coach and decision ticks on the engine\'s own '
      + 'guard arithmetic and DEBT (a)\'s two forms; the branch ladder; the NINE-cell `why` '
      + 'classifier (OTHER firing on a hand-written run and on a near miss); ⭐⭐⭐ THE FOUR '
      + 'TRUTH STATES, each firing and each with a negative (an in-flight ball during a RESTART '
      + 'is not `ballInFlight`; the OPPONENT\'s restart is `other`; a mate on the ball WINS); '
      + '⭐⭐⭐ THE FLIGHT PROVENANCE (his side · theirs · no pending pass); ⭐⭐⭐ THE '
      + 'PERCEIVED-OWNER classifier, all six cells; ⭐⭐⭐ THE STALE-OWNER TEST both ways, '
      + 'including the case that must NOT fire (a perceived `ownerGid` of null is a perceived '
      + 'FLIGHT, not a stale read); ⭐⭐⭐ THE Δt BINS at EVERY BOUNDARY from both sides (exactly '
      + '−1.0, exactly −0.5, exactly 0 landing on the POSITIVE side, a hair below zero landing '
      + 'on the NEGATIVE side, exactly 0.5 / 1.0 / 2.0) and the whole line partitioned; ⭐⭐⭐ THE '
      + 'INTENDED-RECEIVER and TOWARD-HIM tests; the FLIGHT-OUTCOME ladder with its precedence; '
      + 'the RECEIVER classifier; ⭐⭐⭐ THE LEAK PARTITION\'s three cells; the prior at the DF '
      + 'clamp and the ST goal line; the episode set/clear and the yield window on both sides; '
      + 'the scratch-band arithmetic including the VERIFIER\'S band; and the CODE MAP\'s own '
      + 'negatives. ⛔ NO fixture asserts a direction',
  },
  gLedgerRead: {
    ok: LEDGER_OK,
    note: '⭐⭐ canon, VERBATIM: "an event attribution reads the engine\'s own record when one '
      + 'exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only '
      + 'where no record exists, and says so". THE TABLE IS STORED at `ledgerRead.table`: '
      + `${LEDGER_TABLE.filter((t) => t.source.startsWith('RECORD')).length} faces read an `
      + `ENGINE RECORD, ${LEDGER_TABLE.filter((t) => !t.source.startsWith('RECORD')).length} `
      + 'are DECLARED (the `looseOrExpired` outcome cell is a stated RESIDUAL — the engine '
      + 'keeps no record separating a loose ball from the ledger\'s own 3.5 s expiry — and the '
      + 'crowding family is an inherited heuristic). ⭐⭐⭐ THE INTENDED-RECEIVER TEST IS A '
      + 'RECORD: `pendingPass.targetGid` EXISTS, so #415 item 6(3)\'s first-touch fallback is '
      + 'NOT implemented',
  },
  gClassesNonVacuous: {
    ok: CLASSES_LIVE,
    note: '⛔ NO FALSE UNIVERSAL — the EMPTY cells are ENUMERATED as stored lists, never gated: '
      + `run classes [${EMPTY_RUN_CLASSES.join(', ') || 'none'}]; start states `
      + `[${EMPTY_START_STATES.join(', ') || 'none'}]; provenances `
      + `[${EMPTY_PROVENANCES.join(', ') || 'none'}]; Δt bins `
      + `[${EMPTY_DT_BINS.join(', ') || 'none'}]; perceived cells `
      + `[${EMPTY_PERCEIVED_CELLS.join(', ') || 'none'}]; leak cells `
      + `[${EMPTY_LEAK_CELLS.join(', ') || 'none'}]; flight outcomes `
      + `[${EMPTY_OUTCOMES.join(', ') || 'none'}]; receiver classes `
      + `[${EMPTY_RECEIVER_CLASSES.join(', ') || 'none'}]; ⭐ arms with NO in-flight start on `
      + `their own side's pass [${EMPTY_IN_FLIGHT_OWN_SIDE_PASS.join(', ') || 'none'}]; ⭐ arms `
      + `with an EMPTY NEGATIVE half of the Δt histogram `
      + `[${EMPTY_NEGATIVE_DT.join(', ') || 'none'}]. The gate asserts LIVENESS only on `
      + 'the classes a PARTITION STANDS ON — on EVERY arm: the run-episode population, the '
      + 'in-flight and at-feet start states, the provenance family, the POSITIVE half of the Δt '
      + 'histogram and the release / receiver families; on every arm carrying `dsOwnRun`: the '
      + 'percept pull, the stamped population, the own-run class, the leak family, the '
      + 'in-flight starts on his side\'s own pass AND the NEGATIVE half of the Δt histogram; '
      + 'and POSITIVELY ZERO pulls and ZERO own runs on the arms without the flag. ⛔ THE LAST '
      + 'TWO ARE NOT GATED ON THE SHIPPED ARMS: with no carrier the shipped licence fires only '
      + 'at a restart / corner crash / cross flight, so a zero there is THIS CENSUS\'S OWN '
      + 'FINDING and gating on it would gate a direction (the §DEV-PREFLIGHT lesson, '
      + 'disclosed). ⚠ LIVENESS only — never a direction',
  },
  gCodeFactGraph: {
    ok: CODE_MAP_OK,
    note: '⭐⭐ canon, VERBATIM: "a code-fact boolean about what a function reads or does not '
      + 'read is derived from the function\'s WHOLE text and from every callee whose return '
      + 'enters the read … the callee list is EXTRACTED from the hashed text". THE CORPUS: '
      + `${GRAPH_FILES.length} files under \`src/sim\` + \`src/ai\`, ${SPANS.length} extracted `
      + `function spans. THE SIX HASHED ROOTS (\`decideOffBall\` · \`decideCarrier\` · `
      + '`assignRunners` · `registerPass` · `performPass` · `executeAction`) are hashed WHOLE '
      + 'with their EXTRACTED callees, and their HASHES ARE STATED AT THIS HEAD AND COMPARED TO '
      + `NOTHING BANKED; the closure holds ${MAP_CLOSURE.nodes.length} spans at depth `
      + `${MAP_CLOSURE.depth}, uncapped. THE MAP'S OWN BOOLEANS: the own-run fork READS `
      + '`snapshot.ball.ownerGid` and does NOT read `ageTicks`, `.vel` or `pendingPass` '
      + '(DERIVED from the fork\'s WHOLE TEXT, hashed); the licence clause resolves to '
      + '`decideOffBall`; the THREE in-flight licences each resolve to exactly one definition '
      + 'site and one field declaration; `PendingPass` carries `targetGid`; `ObservedBall` can '
      + 'already represent a perceived flight; all three ACTION-TYPE reads resolve to exactly '
      + 'one span. ⛔ THE MAP DESCRIBES; IT DESIGNS NOTHING',
  },
  gBite: {
    ok: BITE_OK,
    note: `⭐⭐⭐ gBite IN THE #414 FAMILY-NOTE ROW FORM: on ${biteRow.eligibleSeeds} of `
      + `${biteRow.seeds} seeds the CONTROL (\`${BITE_CTRL}\`) issued at least one cooperation `
      + `hat, and on ${biteRow.rowDiffering} of them the two arms' PER-SEED ROWS differ in at `
      + `least one of ${biteRow.comparedFields} stored fields. THE PRINTED FACE beside it: the `
      + `FULL-TIME SIGNATURE coincides on ${biteRow.fullTimeSignatureIdenticalSeeds} of the `
      + 'same eligible seeds — a full-time state snapshot is NOT a trajectory hash, which is '
      + 'exactly why the liveness is stated on the ROW. ⚠ LIVENESS ONLY: it gates no direction '
      + 'and no partition',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon: "an artifact is written as compact JSON")           */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((a) => [a, c.rows[a]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'allGreen', 'faces', 'questions', 'crowding', 'pullReceipt', 'medians',
  'bins', 'definitions', 'arms', 'runClasses', 'states', 'provenances', 'perceivedCells',
  'flightOutcomes', 'receiverClasses', 'leakCells', 'dtBins', 'branches', 'actions',
  'codeMap', 'ledgerRead', 'noDose', 'doseSource', 'twoFractionPairs', 'worldPin', 'seeds',
  'stats', 'anchoredSites', 'fixtures', 'lockstep', 'pullCount', 'determinism',
  'fingerprintProd', 'bite', 'repro', 'emptiness', 'perf', 'sizing', 'perSeedCells',
  'constructionReceipt',
] as const;
const artifact: Record<string, unknown> = {
  stage: {
    id: 'IF-C0',
    title: '「球在飞时的前插 · 普查」 THE CENSUS OF THE RUN ONTO A BALL IN FLIGHT — what the '
      + 'engine does TODAY with a ball in flight, what the leak is made of, and what a real '
      + 'run onto a flight would have to read. FOUR arms on world 13 with the OBM seat ABSENT: '
      + 'HATS-E13 (the shipped path) · OWN-E13 (world 16\'s doors) · OWNCOOP-E13 (world 17\'s '
      + 'doors, THE ARM OF RECORD) · D13 (the shipped loaders\' doses) beside.',
    doc: 'docs/world-model/IF-C0-FLIGHT-RUN-CENSUS.md',
    instrument: INSTRUMENT_PATH,
    instrumentSha256: sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
    recipesCopiedFrom: 'scripts/probes/ds-t1d-coop-hats-exam.ts (BY RECIPE, NEVER IMPORTED)',
    censusFormOfRecord: 'docs/world-model/DS-C0-DESIGNATION-CENSUS.md',
    perStateFacesInheritedFrom: 'docs/world-model/DS-T1-OWN-RUN-EXAM.md §R',
    contract: 'docs/world-model/DS-DESIGNATION-CONTRACT.md',
    authorizedBy: 'COMMANDER RULING #415 item 6',
    kind: '⛔ CENSUS — it publishes MEASUREMENTS as STORED PARTITIONS. IT SHIPS NOTHING, arms '
      + 'nothing and scores no hypothesis. ⛔ NO READ SENTENCE IS FROZEN and NO VERDICT WORD is '
      + 'printed on any face; the four PRE-REGISTERED QUESTIONS are answered as stored '
      + 'partitions and THE COMMANDER DRAFTS THE IF CONTRACT ON THE TABLE.',
    whyThisCensusExists: 'The contract §4\'s named next slice — THE RUN ONTO A BALL IN FLIGHT — '
      + 'has been WITHDRAWN TWICE and MEASURED TWICE and NEVER DESIGNED. Two facts of record '
      + 'frame it: the coach\'s own hat runs start with the ball in flight 0.080620 of the time '
      + 'and at his side\'s own restart 0.397269 (DS-T1, the shipped path — the corner-crash / '
      + 'cross-flight / restart clauses of the shipped licence); and 0.120532 of world 17\'s '
      + 'own runs start with the TRUTH ball in flight although the guard read a perceived OWNER '
      + '(DS-T1d §HONEST LIMITS 4) — stale eyes, not a design. THE FAMILY MEASURES BEFORE IT '
      + 'DESIGNS.',
    xSrcZero: 'no file under `src/` or `tests/` is created or edited. ⚠ THE ONE ADDED READ is '
      + 'the declared percept pull (ONE per stamped run-start tick, inside the arm\'s own '
      + 'flag); `gPullCount` counts it and `gLockstep` proves it INERT.',
    honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
      + 'the artifact stores that list verbatim or stores none". THIS ARTIFACT STORES NONE. '
      + 'The ONE home is docs/world-model/IF-C0-FLIGHT-RUN-CENSUS.md §HONEST LIMITS.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((pp) => [pp, sha(SRC_OF[pp])])),
    startedAt: new Date(t0Wall).toISOString(),
  },
  arms: Object.fromEntries(ARMS.map((a) => [a, {
    label: ARM_LABEL[a], book: ARM_BOOK[a], flagKind: ARM_KIND[a],
    dsOwnRun: ARM_KIND[a] !== 'HATS', dsHatsOff: ARM_KIND[a] !== 'HATS',
    dsCoopHatsOff: ARM_KIND[a] === 'OWNCOOP',
    obmSeatDosed: false, seatDose: 'ABSENT',
    isArmOfRecord: a === ARM_OF_RECORD,
    carriesThePerceivedStamp: ARM_KIND[a] !== 'HATS',
  }])),
  questions: {
    what: '⭐⭐⭐ THE FOUR PRE-REGISTERED QUESTIONS, FROZEN BEFORE THE BATTERY AND ANSWERED AS '
      + 'STORED PARTITIONS. ⛔ NO READ SENTENCE IS FROZEN FOR A CENSUS: every block below is a '
      + 'TABLE and the commander drafts the IF contract on it.',
    q1: {
      question: 'What share of each arm\'s runs start with the ball in flight, and of those how '
        + 'many are the coach\'s three existing in-flight licences vs the own run\'s leak?',
      rows: Q1,
    },
    q2: {
      question: 'Of the leaked own runs, what share have a STALE OWNER read (the passer still '
        + 'credited) vs a FRESH read of a mate who is not the passer — i.e. is the leak an EYES '
        + 'problem or a CLASSIFIER-BOUNDARY problem?',
      rows: Q2,
    },
    q3: {
      question: 'Do in-flight starts yield more or less than at-feet starts, per `why`, and do '
        + 'their intended-receiver shares differ?',
      rows: Q3,
    },
    q4: {
      question: 'THE TIMING FACT: in the shipped world, how often does the eventual receiver of '
        + 'a pass START his run after the release (a run onto a travelling ball) vs before (the '
        + 'pass played into an existing run) vs never — the histogram the IF contract\'s REALITY '
        + 'audit will be written against.',
      rows: Q4,
    },
  },
  crowding: { what: 'OBM-T1\'s crowding family, BESIDE for continuity. ⛔ Not this census\'s '
    + 'subject and not judged.', rows: CROWDING },
  pullReceipt: { what: '⭐⭐⭐ THE PULL COUNT RECEIPT, per arm: ONE pull per STAMPED run-start '
    + 'tick, inside the arm\'s own flag, and the count EQUALS the arm\'s own stamped count.',
  rows: PULL_RECEIPT },
  runClasses: {
    vocabulary: RUN_CLASSES, namedClasses: RUN_CLASSES_NAMED, theSixCoachHats: HAT_CLASSES_SIX,
    read: '⭐⭐ READ OFF THE ENGINE\'S OWN DECISION RECORD — the WINNER\'S `why` in '
      + '`p.action.scores[0]`. The SEVEN literals are EXTRACTED from their own anchored source '
      + 'lines, never typed.',
    literals: {
      licensedRunInBehind: WHY_LICENSED, arrivingLate: WHY_ARRIVING, attackingTheBox: WHY_BOX,
      oneTwoBurst: WHY_BURST, overlapping: WHY_OVERLAP, keeperUp: WHY_KEEPERUP,
      ownRunInBehind: WHY_OWN,
    },
  },
  states: {
    vocabulary: STATES,
    definition: '⭐⭐⭐ DS-T1d\'s FOUR-STATE TRUTH CLASSIFIER, COPIED BY RECIPE, read PRE-STEP off '
      + 'the engine\'s own state in the classifier\'s own order: a MATE owns the ball · the ball '
      + 'is in flight (`ball.owner === null`) with `phase === \'playing\'` and possession his '
      + 'side · his side\'s OWN restart · everything else, COUNTED as `other`.',
  },
  provenances: {
    vocabulary: PROVENANCES,
    definition: '⭐⭐⭐ THE FLIGHT\'S PROVENANCE, off `match.pendingPass` read PRE-STEP: a pass by '
      + 'HIS side · a pass by the OTHER side · NO pending pass (a loose or cleared ball). The '
      + 'flight\'s AGE is `simTime − pendingPass.t` at the same tick.',
  },
  perceivedCells: {
    vocabulary: PERCEIVED,
    definition: '⭐⭐⭐ THE RUNNER\'S OWN PERCEIVED BALL at the stamped tick — ONE '
      + '`match.perceivedSnapshot(p)` pull INSIDE the arm\'s own flag. `ownerNull` WITH a '
      + 'non-zero perceived `vel` is a PERCEIVED FLIGHT, which `ObservedBall` can already '
      + 'represent (see `codeMap.observedBall`).',
    staleOwnerTest: '⭐⭐⭐ THE STALE-OWNER LEAK: the perceived `ownerGid` NAMES a body the TRUTH '
      + 'no longer credits with the ball. ⚠ COMPARED AT THE SAME POST-STEP TICK the snapshot '
      + 'was materialised from; the TRUTH STATE beside it is the PRE-STEP one the brain read. '
      + 'DECLARED at the doc\'s §HONEST LIMITS.',
  },
  flightOutcomes: { vocabulary: OUTCOMES,
    definition: '⭐⭐ THAT FLIGHT\'S OWN OUTCOME, off the engine\'s own records where they exist '
      + '(see `ledgerRead.table`); `looseOrExpired` is a DECLARED RESIDUAL.' },
  receiverClasses: { vocabulary: RECEIVER_CLASSES,
    definition: '⭐⭐⭐ Q4\'s own classifier: the EVENTUAL receiver of a completed release was '
      + 'ALREADY RUNNING at the release · STARTED a run DURING the flight · NEITHER.' },
  leakCells: { vocabulary: LEAK_CELLS,
    definition: '⭐⭐⭐ POPULATION L — for every OWN RUN whose TRUTH state is `ballInFlight`: the '
      + 'perceived owner is THE PASSER (still credited — an EYES reading) · a mate who is NOT '
      + 'the passer (a CLASSIFIER-BOUNDARY reading) · anything else. ⛔ A PARTITION, NEVER A '
      + 'STORY.' },
  dtBins: {
    vocabulary: DT_BINS, edges: DT_BIN_EDGES,
    definition: '⭐⭐⭐ Δt = (the attached release) − (the run\'s start) in sim-s. NEGATIVE = the '
      + 'run started AFTER the release, onto a ball ALREADY TRAVELLING; POSITIVE = the run '
      + 'started BEFORE the pass (the shipped / normal form). THE ATTACHMENT RULE, FROZEN AT '
      + '§P: a same-side `pendingPass` ALREADY LIVE at the run-start tick IS the attached '
      + 'release; otherwise the NEXT release by his side; a run with neither is COUNTED in '
      + '`dt.noAttachedReleaseShare` and is NEVER BINNED.',
  },
  branches: { vocabulary: BRANCHES,
    precedence: 'cornerCrashHeld (itself `!liveCorner`) > liveCorner > crossFlight > openPlay '
      + '— THE SOURCE\'S OWN ORDER' },
  actions: ACTION_CELLS,
  twoFractionPairs: TWO_FRACTION_PAIRS,
  definitions: {
    runEpisode: '⭐⭐⭐ A RUN EPISODE is one body\'s `p.action.type` becoming `MakeRun` from a '
      + 'non-`MakeRun` tick; it ends when the type changes. It is STAMPED AT ITS START TICK '
      + 'with the PRE-STEP truth state, the flight\'s provenance and age, the perceived ball '
      + '(on the arms carrying `dsOwnRun`), the intended-receiver and toward-him tests, that '
      + 'flight\'s outcome, its own yield and its Δt.',
    yieldWindowSeconds: YIELD_WINDOW_SECONDS,
    theRelease: '⭐⭐⭐ POPULATION F — a RELEASE is a NEW `match.pendingPass` key '
      + '(`t|passerGid|targetGid`). "Already running at the release" is read on the CURRENT '
      + 'run state at the release tick, so a body whose run STARTS on the release tick counts '
      + 'as ALREADY RUNNING (declared at the doc\'s §HONEST LIMITS).',
    theDecisionTick: '`if (p.decisionTimer <= 0 && !pcHeld)` (anchored), with the holds map '
      + 'read AFTER the step at the tick the decide loop used (DS-T1 debt (a)); DS-C0\'s '
      + 'PRE-STEP form is computed beside it and both are calibrated against the ENGINE\'S OWN '
      + '`pcLatency.ledger.decisionsHeld`.',
    debtsKeptPaid: {
      a: 'the post-step holds form of record with the engine\'s own ledger as its receipt',
      b: 'the shooter gid banked AT THE SHOT\'S PUSH into a per-`logIndex` map; the goal join '
        + 'reads that map at the outcome flip',
      c: `the episode-tick bins run PAST one full wallRun licence — ${WALL_LICENCE_TICKS} ticks `
        + `DERIVED from the licence's own ${WALL_WINDOW} s — and every bin-derived median is `
        + 'published WITH ITS TOP BIN\'S SHARE beside it',
    },
    binEdges: {
      note: '⚠ every width/count here is a STORED BIN EDGE of a histogram — never a rule and '
        + 'never a threshold.',
      runEpisodeTicks: { width: EPW_BIN, bins: EPW_BINS, topBinLowerEdge: EPW_TOP_EDGE },
      perceivedAgeTicks: { width: AGE_BIN, bins: AGE_BINS },
      truthFlightAgeSeconds: { width: FLIGHT_AGE_BIN, bins: FLIGHT_AGE_BINS },
      releaseRunners: { bins: REL_RUNNER_BINS },
      r1: { bins: R1_BINS, floodAtLeast: R1_FLOOD_AT },
      runnerCountBins: RUN_COUNT_BINS,
    },
    engineConstants: {
      DT, HALF_L, AI_INTERVAL, TEAM_AI_INTERVAL, OFFBALL_TIRED_MUL, OBM_SCORE_SPAN,
      roleWeights: { GK: RRW[0], DF: RRW[1], MF: RRW[2], WG: RRW[3], ST: RRW[4] },
      runDepthDiv: RUN_DEPTH_DIV, runPriorMax: RUN_PRIOR_MAX,
      tired: { staminaBelow: TIRED_STAMINA, conservationAbove: TIRED_CONSERVATION },
      tempoGate: TEMPO_HIGH, urgencyGate: URGENCY_HIGH,
      countHigh: COUNT_HIGH, countBase: COUNT_BASE,
      wallWindowSeconds: WALL_WINDOW, wallLicenceTicks: WALL_LICENCE_TICKS,
      crowd: { dupRunM: DUP_RUN_M, sampleEvery: SAMPLE_EVERY, pairSubsample: PAIR_SUBSAMPLE,
        closePairM: CLOSE_PAIR_M },
      obmFeatureKeys: [...OBM_FEATURE_KEYS], obmOutputKeys: [...OBM_OUTPUT_KEYS],
      yieldWindowSeconds: YIELD_WINDOW_SECONDS,
    },
  },
  codeMap: {
    what: '⭐⭐⭐ THE CODE MAP (#415 item 6) — canon code facts over the call graph, in the '
      + 'WHOLE-FUNCTION form, with the hashes STATED AT THIS HEAD AND COMPARED TO NOTHING '
      + 'BANKED and the callees EXTRACTED from the hashed text. ⛔ THE MAP DESCRIBES; IT '
      + 'DESIGNS NOTHING.',
    corpus: { dirs: GRAPH_DIRS, files: GRAPH_FILES.length, spans: SPANS.length },
    hashedRootsStatedAtThisHead: HASHED_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
    comparedToAnyBankedLiteral: false,
    rootGraph: ROOT_GRAPH, rootsComplete: ROOTS_COMPLETE,
    closure: {
      nodes: MAP_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      depth: MAP_CLOSURE.depth, capped: MAP_CLOSURE.capped, externals: MAP_CLOSURE.externals,
    },
    theShippedLicencesStateClause: {
      line: LICENCE_CLAUSE_LINE,
      sites: LICENCE_CLAUSE_SITE.map((h) => h.line),
      enclosingSpan: LICENCE_CLAUSE_ENCLOSING === null ? null
        : spanKey(LICENCE_CLAUSE_ENCLOSING),
      enclosingSha: LICENCE_CLAUSE_ENCLOSING === null ? null : LICENCE_CLAUSE_ENCLOSING.sha,
      theThreeInFlightLicencesThatExistToday: IN_FLIGHT_LICENCES,
      note: '⭐⭐⭐ `carrier ? carrier !== p : match.phase === \'restart\' || crashLive || '
        + 'crossLive` — with NO carrier the licence still fires in exactly THREE shapes: the '
        + 'side\'s own RESTART, a live CORNER CRASH (`team.cornerCrash`) and a live CROSS '
        + 'FLIGHT (`team.crossFlight`, itself gated on `match.c4Arrival`). THOSE ARE THE THREE '
        + 'IN-FLIGHT LICENCES THE ENGINE HAS TODAY.',
    },
    theOwnRunForksGuard: {
      ...(OWN_FORK ?? {}),
      note: '⭐⭐⭐ M-DS.7 — WHAT IT READS AND WHAT IT DOES NOT, DERIVED from the fork\'s WHOLE '
        + 'TEXT (hashed): it READS `snapshot.ball.ownerGid`; it does NOT read `ageTicks`, it '
        + 'does NOT read any `.vel`, and it does NOT read `pendingPass`. ⛔ A DESCRIPTION.',
    },
    pendingPass: PENDING_PASS_SHAPE,
    observedBall: OBSERVED_BALL_SHAPE,
    theActionTypeReads: {
      rows: ACTION_TYPE_READS,
      note: '⭐⭐⭐ THE THROUGH-BALL CHOOSER\'S RUNNER SCAN is where the PASSER looks for a body '
        + 'ALREADY RUNNING — by ACTION TYPE, not by a label (DS-C0 §0.6\'s `thirdMan` read is '
        + 'the second of the three). ⛔ STATED, NOT JUDGED.',
    },
  },
  ledgerRead: {
    what: '⭐⭐ WHICH FACE READS AN ENGINE RECORD AND WHICH IS A DECLARED HEURISTIC.',
    table: LEDGER_TABLE,
    recordFaces: LEDGER_TABLE.filter((t) => t.source.startsWith('RECORD')).length,
    declaredFaces: LEDGER_TABLE.filter((t) => !t.source.startsWith('RECORD')).length,
  },
  noDose: {
    what: '⛔ THE OBM SEAT IS ABSENT ON EVERY ARM: `obmMovement` is never set and no 16-slot '
      + 'matrix is written anywhere. The D13 arm takes the SHIPPED loaders\' L3 / PC doses — '
      + 'the PLAYED BOOK, not a seat dose.',
    obmSeatAbsentOnEveryArm: OBM_SEAT_ABSENT_ON_EVERY_ARM,
    obmMovementSetOnAnyArm: false,
    assertedOnEveryWalkedMatch: '`gWorld`: `obmFlag === false` AND `matrixOnBaseEff === false` '
      + 'AND `infoGenomeCleanOfMatrix` on every walked match and on the construction receipt.',
  },
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: D13_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  worldPin: { seed: WORLD_PIN_SEED, rows: worldPin, ok: WORLD_PIN_OK },
  anchoredSites: ANCHORS, fixtures: FIXTURES,
  lockstep: lockstepRows, pullCount: { ok: PULLCOUNT_OK, rows: pullRows },
  determinism: xDetRows,
  fingerprintProd: { pinned: FP_PROD_PIN, computed: FP_PROD_GOT, ok: FP_PROD_OK,
    matches: fpOut.matches },
  bite: biteRow,
  repro: reproDetail,
  emptiness: {
    what: '⛔ NO FALSE UNIVERSAL — the empty cells are ENUMERATED, never gated.',
    runClasses: EMPTY_RUN_CLASSES, startStates: EMPTY_START_STATES,
    provenances: EMPTY_PROVENANCES, dtBins: EMPTY_DT_BINS,
    perceivedCells: EMPTY_PERCEIVED_CELLS, leakCells: EMPTY_LEAK_CELLS,
    flightOutcomes: EMPTY_OUTCOMES, receiverClasses: EMPTY_RECEIVER_CLASSES,
    inFlightStartsOnHisSidesPass: EMPTY_IN_FLIGHT_OWN_SIDE_PASS,
    negativeDeltaT: EMPTY_NEGATIVE_DT,
  },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, armK) => a + armRows(armK).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / Math.max(1, cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE, on a host carrying other work.',
  },
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,008,000–011, FOUR '
      + 'walks per seed), DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a '
      + 'NOISY variance estimate.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
    whichNWasTaken: '⭐⭐⭐ SAID PLAINLY (#415 item 6: "N sized by a DISCLOSED 12-seed smoke at a '
      + 'declared 0.05 half-width on the arm of record\'s in-flight run share and on the hats\' '
      + '— walk the affordance and say so (the #414 floor reading)"): both sizing rows resolve '
      + `far below the affordance (${sizingRows.map((r) => `${r.face} ${r.nRequired}`)
        .join(' · ')}), and THIS STAGE WALKS THE AFFORDANCE, N_FROZEN = ${N_FROZEN} — the `
      + 'FLOOR #414 §CORR 8 ratified for this family. It can only NARROW an interval, never '
      + 'widen one, and it consumes the block booked to this stage either way.',
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
    scratchBandDeclared: SCRATCH_BAND,
    verifierBandNotThisExecutors: VERIFIER_BAND,
    scratchSeedsWalked: SCRATCH_SEEDS_WALKED,
    scratchSeedsWalkedFlat: SCRATCH_SEEDS_FLAT,
    scratchSeedsOutOfBand: SCRATCH_OUT_OF_BAND,
    scratchBandOk: SCRATCH_BAND_OK,
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    xDetScratchSeedsWalked: XDET_SEEDS,
    worldPinScratchSeedWalked: WORLD_PIN_SEED,
    fixtureScratchSeed: FIXTURE_SEED,
    reWalkSeedsNotAConsumption: REPRO_SEEDS,
    consumedBlocksOfRecord: CONSUMED_BLOCKS,
    neverASeedAtOrAbove: 12_559_000,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 86 },
  medians: {
    note: '⭐⭐⭐ every median below is BIN-DERIVED from the stored bins and carries its TOP '
      + 'BIN\'S SHARE beside it (debt (c)); `gFaces` re-derives each pair off the SERIALIZED '
      + 'artifact.',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((a) => [a, {
    runStartsByStateAndWhy: { states: STATES, whyClasses: RUN_CLASSES,
      pooled: pooled[a].epStarts },
    runEpisodeTicks: { width: EPW_BIN, bins: EPW_BINS, pooled: pooled[a].runEpTickBins },
    inFlightProvenance: { provenances: PROVENANCES, whyClasses: RUN_CLASSES,
      pooled: pooled[a].epStartsInFlightProvenance },
    truthFlightAgeSeconds: { width: FLIGHT_AGE_BIN, bins: FLIGHT_AGE_BINS,
      pooled: pooled[a].epFlightAgeBins },
    inFlightOutcome: { outcomes: OUTCOMES, whyClasses: RUN_CLASSES,
      pooled: pooled[a].epInFlightOutcome },
    perceivedCells: { cells: PERCEIVED, whyClasses: RUN_CLASSES, pooled: pooled[a].epPerceived },
    perceivedByState: { states: STATES, cells: PERCEIVED,
      pooled: pooled[a].epPerceivedByState },
    perceivedAgeTicks: { width: AGE_BIN, bins: AGE_BINS, pooled: pooled[a].epPerceivedAgeBins },
    dtBins: { vocabulary: DT_BINS, whyClasses: RUN_CLASSES, pooled: pooled[a].epDtBins },
    dtBinsByState: { vocabulary: DT_BINS, states: STATES, pooled: pooled[a].epDtBinsByState },
    leakCells: { vocabulary: LEAK_CELLS, pooled: pooled[a].leakCells },
    leakAgeTicks: { width: AGE_BIN, bins: AGE_BINS, pooled: pooled[a].leakAgeBins },
    leakTruthFlightAge: { width: FLIGHT_AGE_BIN, bins: FLIGHT_AGE_BINS,
      pooled: pooled[a].leakFlightAgeBins },
    releaseRunners: { bins: REL_RUNNER_BINS, pooled: pooled[a].releaseRunnerBins },
    releaseStartsDuringFlight: { whyClasses: RUN_CLASSES,
      pooled: pooled[a].releaseStartsDuringFlight },
    releasesResolved: { vocabulary: OUTCOMES, pooled: pooled[a].releasesResolved },
    receiverClass: { vocabulary: RECEIVER_CLASSES, pooled: pooled[a].receiverClass },
    receiverClassIntended: { vocabulary: RECEIVER_CLASSES,
      pooled: pooled[a].receiverClassIntended },
    epAimed: { states: STATES, whyClasses: RUN_CLASSES, pooled: pooled[a].epAimed },
    epCompleted: { states: STATES, whyClasses: RUN_CLASSES, pooled: pooled[a].epCompleted },
    runEpShots: { states: STATES, whyClasses: RUN_CLASSES, pooled: pooled[a].runEpShots },
    runEpGoals: { states: STATES, whyClasses: RUN_CLASSES, pooled: pooled[a].runEpGoals },
    r1Bins: { bins: R1_BINS, pooled: pooled[a].r1Bins },
    runCountBins: { bins: RUN_COUNT_BINS, pooled: pooled[a].runCountBins },
    runClassTicks: { vocabulary: RUN_CLASSES, pooled: pooled[a].runClassTicks },
    stateAllDecisions: { vocabulary: STATES, pooled: pooled[a].stateAllDecisions },
    stateRunDecisions: { kinds: ['hat', 'own'], states: STATES,
      pooled: pooled[a].stateRunDecisions },
  }])),
  faces,
  perSeedCells,
  constructionReceipt: Object.fromEntries(ARMS.map((a) => [a, receiptRows[a]])),
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: (Record<Arm, Row> & { seed: number })[];
  faces: FaceRow[];
  bins: Record<Arm, Record<string, { pooled?: number[] }>>;
  medians: { values: Record<Arm, Record<string, unknown>> };
  questions: Record<string, { rows: Record<string, Record<string, unknown>> }>;
  sizing: { rows: typeof sizingRows };
  bite: typeof biteRow;
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
const binChecks: { bin: string; ok: boolean }[] = [];
const BIN_KEY_OF: Record<string, string> = {
  runStartsByStateAndWhy: 'epStarts', runEpisodeTicks: 'runEpTickBins',
  inFlightProvenance: 'epStartsInFlightProvenance', truthFlightAgeSeconds: 'epFlightAgeBins',
  inFlightOutcome: 'epInFlightOutcome', perceivedCells: 'epPerceived',
  perceivedByState: 'epPerceivedByState', perceivedAgeTicks: 'epPerceivedAgeBins',
  dtBins: 'epDtBins', dtBinsByState: 'epDtBinsByState', leakCells: 'leakCells',
  leakAgeTicks: 'leakAgeBins', leakTruthFlightAge: 'leakFlightAgeBins',
  releaseRunners: 'releaseRunnerBins', releaseStartsDuringFlight: 'releaseStartsDuringFlight',
  releasesResolved: 'releasesResolved', receiverClass: 'receiverClass',
  receiverClassIntended: 'receiverClassIntended', epAimed: 'epAimed', epCompleted: 'epCompleted',
  runEpShots: 'runEpShots', runEpGoals: 'runEpGoals', r1Bins: 'r1Bins', runCountBins: 'runCountBins',
  runClassTicks: 'runClassTicks', stateAllDecisions: 'stateAllDecisions',
  stateRunDecisions: 'stateRunDecisions',
};
for (const armK of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[armK]);
  const got = poolFrom(rows);
  for (const [binName, rowKey] of Object.entries(BIN_KEY_OF)) {
    binChecks.push({ bin: `${armK}.${binName}`,
      ok: JSON.stringify(got[rowKey]) === JSON.stringify(disk.bins[armK][binName]?.pooled ?? []) });
  }
  binChecks.push({ bin: `${armK}.medians.allBinDerivedWithTopBinShares`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[armK]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${armK}.partition.startCellsSumToTheEpisodes`,
    ok: sum(got.epStarts) === sum(rows.map((r) => r.epStartsAll)) });
  binChecks.push({ bin: `${armK}.partition.inFlightProvenanceSumsToTheInFlightStarts`,
    ok: sum(got.epStartsInFlightProvenance)
      === sum(rows.map((r) => sliceSum(r.epStarts, SI('ballInFlight') * NC, NC))) });
  binChecks.push({ bin: `${armK}.partition.theDtAttachmentCellsSumToTheEpisodes`,
    ok: sum(rows.map((r) => sum(r.epDtAttachedLive) + sum(r.epDtAttachedNext)
      + sum(r.epDtNoAttachedRelease))) === sum(rows.map((r) => r.epStartsAll)) });
  binChecks.push({ bin: `${armK}.partition.theDtBinsSumToTheAttachedEpisodes`,
    ok: sum(got.epDtBins) === sum(rows.map((r) => sum(r.epDtAttachedLive)
      + sum(r.epDtAttachedNext))) });
  binChecks.push({ bin: `${armK}.partition.theDtByStateBinsSumToTheSameTotal`,
    ok: sum(got.epDtBinsByState) === sum(got.epDtBins) });
  binChecks.push({ bin: `${armK}.partition.perceivedCellsSumToTheStampedStarts`,
    ok: sum(got.epPerceived) === sum(rows.map((r) => sum(r.epPerceivedStamped)))
      && sum(got.epPerceivedByState) === sum(got.epPerceived) });
  binChecks.push({ bin: `${armK}.partition.thePullsEQUALTheStampedStarts`,
    ok: sum(rows.map((r) => r.instrumentPulls))
      === sum(rows.map((r) => sum(r.epPerceivedStamped))) });
  binChecks.push({ bin: `${armK}.partition.theLeakCellsSumToTheOwnRunsInFlight`,
    ok: sum(got.leakCells) === sum(rows.map((r) => r.leakOwnRunsInFlight)) });
  binChecks.push({ bin: `${armK}.partition.theReceiverClassesSumToTheCompletedReleases`,
    ok: sum(got.receiverClass) === sum(rows.map((r) => sum(r.receiverClass)))
      && sum(got.receiverClassIntended) <= sum(got.receiverClass) });
  binChecks.push({ bin: `${armK}.partition.theReleaseRunnerBinsSumToTheReleases`,
    ok: sum(got.releaseRunnerBins) === sum(rows.map((r) => r.releases)) });
  binChecks.push({ bin: `${armK}.partition.r1BinsSumToTeamTicks`,
    ok: sum(got.r1Bins) === sum(rows.map((r) => r.r1TeamTicks)) });
  binChecks.push({ bin: `${armK}.partition.runClassesSumToMakeRunDecisions`,
    ok: sum(got.runClassTicks) === sum(rows.map((r) => r.makeRunTicksPost)) });
  binChecks.push({ bin: `${armK}.partition.stateDecisionsSumToOffBallTicks`,
    ok: sum(got.stateAllDecisions) === sum(rows.map((r) => r.offBallDecisionTicksPost)) });
  binChecks.push({ bin: `${armK}.partition.episodeTickBinsPlusOpenEqualTheStarts`,
    ok: sum(got.runEpTickBins) + sum(rows.map((r) => r.runEpActiveAtFullTime))
      === sum(rows.map((r) => r.epStartsAll)) });
  binChecks.push({ bin: `${armK}.partition.countsAreInsideTheirDenominators`,
    ok: rows.every((r) => sum(r.epInFlightIntended) <= sum(r.epInFlightOwnSidePass)
      && sum(r.epInFlightToward) <= sum(r.epInFlightOwnSidePass)
      && sum(r.epPerceivedStale) <= sum(r.epPerceivedStamped)
      && r.leakOwnRunsInFlight <= r.epStarts[SI('ballInFlight') * NC + RCI('ownRunInBehind')]
      && r.receiverIsIntended <= sum(r.receiverClass)
      && r.makeRunTicksPost <= r.offBallDecisionTicksPost
      && r.r1FloodTicks <= r.r1TeamTicks
      && sum(r.releasesResolved) <= r.releases) });
}
/* ⭐⭐⭐ THE FOUR QUESTION BLOCKS re-derive off the SERIALIZED faces */
for (const armK of ARMS) {
  const q1 = disk.questions.q1.rows[armK] as unknown as {
    inFlightShareOfAllRunEpisodes: { value: number };
    theStatePartition: Record<string, { share: number }>;
  };
  binChecks.push({ bin: `questions.q1.${armK}.rederives`,
    ok: sameNum(face('run.inFlightShare', armK).value, q1.inFlightShareOfAllRunEpisodes.value)
      && STATES.every((st) => sameNum(face(`run.startStateShare.${st}`, armK).value,
        q1.theStatePartition[st].share)) });
  const q4 = disk.questions.q4.rows[armK] as unknown as {
    negativeShare: { value: number };
    theTimingHistogram: Record<string, { share: number }>;
    theEventualReceiver: { classShares: Record<string, { share: number }> };
  };
  binChecks.push({ bin: `questions.q4.${armK}.rederives`,
    ok: sameNum(face('dt.negativeShare', armK).value, q4.negativeShare.value)
      && DT_BINS.every((b) => sameNum(face(`dt.binShare.${b}`, armK).value,
        q4.theTimingHistogram[b].share))
      && RECEIVER_CLASSES.every((rc) => sameNum(face(`receiver.classShare.${rc}`, armK).value,
        q4.theEventualReceiver.classShares[rc].share)) });
}
for (const armK of OWNRUN_ARMS) {
  const q2 = disk.questions.q2.rows[armK] as unknown as {
    thePartition: Record<string, { share: number }>;
    staleOwnerShareAtEveryRunStart: { value: number };
  };
  binChecks.push({ bin: `questions.q2.${armK}.rederives`,
    ok: LEAK_CELLS.every((lc) => sameNum(face(`leak.cellShare.${lc}`, armK).value,
      q2.thePartition[lc].share))
      && sameNum(face('perceived.staleOwnerShare', armK).value,
        q2.staleOwnerShareAtEveryRunStart.value) });
}
/* the SIZING rows re-derive off disk */
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
/* gBite's ROW form re-derives off the SERIALIZED cells */
binChecks.push({
  bin: 'bite.theROWFormRederivesOffDisk',
  ok: (() => {
    const eligible = disk.perSeedCells.filter((c) => c[BITE_CTRL].overlapSets
      + c[BITE_CTRL].wallFires > 0);
    const identical = eligible.filter((c) => {
      const a = c[BITE_TREAT] as unknown as Record<string, unknown>;
      const b = c[BITE_CTRL] as unknown as Record<string, unknown>;
      return ROW_KEYS_FOR_BITE.every((k) => JSON.stringify(a[k]) === JSON.stringify(b[k]));
    });
    const sigSame = eligible.filter((c) => c[BITE_TREAT].signature === c[BITE_CTRL].signature);
    return eligible.length === disk.bite.eligibleSeeds
      && identical.length === disk.bite.rowIdenticalSeeds.length
      && sigSame.length === disk.bite.fullTimeSignatureIdenticalSeeds
      && disk.bite.allRowsDiffer === (eligible.length > 0 && identical.length === 0);
  })(),
});
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'top-bin-share / PARTITION / QUESTION-BLOCK / sizing / gBite checks re-derived from the '
    + 'SERIALIZED artifact off disk — canon: "the re-derivation gate covers EVERY published '
    + 'face; a percentile face requires stored bins". ⭐ THE FOUR QUESTION BLOCKS are '
    + 'INCLUDED: every partition they print is re-derived from the stored cells',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
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
    + 'construction receipt, the four QUESTION blocks, the code map, the seeds AND `allGreen`, '
    + 'and EXCLUDES `hashedBodySha256`, `gFacesDetail` and `receipts`; the body hash is '
    + 'computed LAST — after every body key is assigned — and a NON-body '
    + '`receipts.hashReproducesFromFile` records that it reproduces from the file',
};
gates.gStage = {
  ok: (artifact.stage as { instrument: string }).instrument === INSTRUMENT_PATH
    && (artifact.stage as { instrumentSha256: string }).instrumentSha256
      === sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
  note: '⭐⭐ the artifact\'s `stage.instrument` is THIS instrument\'s own path '
    + `(${INSTRUMENT_PATH}) and \`stage.instrumentSha256\` is the sha256 of the RUNNING FILE `
    + 're-read from disk at this line — never an inherited string',
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
/* §19 THE CONSOLE READ (⛔ no verdict word)                                    */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`IF-C0 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to .RED'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- Q1 THE RUN-START STATE PARTITION ---');
for (const a of ARMS) {
  banner(`  ${a} episodes/match ${f6(val('run.episodesPerMatch', a))} · states `
    + `${STATES.map((st) => `${st} ${f6(val(`run.startStateShare.${st}`, a))}`).join(' · ')}`);
  banner(`    in flight: all ${f6(val('run.inFlightShare', a))} · coach hats `
    + `${f6(val('run.inFlightShareOfTheCoachsHats', a))} · own run `
    + `${f6(val('run.inFlightShareOfTheOwnRun', a))}`);
  banner(`    provenance ${PROVENANCES.map((pv) =>
    `${pv} ${f6(val(`flight.provenanceShare.${pv}`, a))}`).join(' · ')}`);
}
banner('');
banner('--- Q2 THE LEAK ANATOMY (arms carrying `dsOwnRun`) ---');
for (const a of OWNRUN_ARMS) {
  banner(`  ${a} own runs in flight/match ${f6(val('leak.ownRunsInFlightPerMatch', a))} · `
    + `${LEAK_CELLS.map((lc) => `${lc} ${f6(val(`leak.cellShare.${lc}`, a))}`).join(' · ')}`);
  banner(`    stale-owner share: all starts ${f6(val('perceived.staleOwnerShare', a))} · own run `
    + `${f6(val('perceived.staleOwnerShare.ownRun', a))} · by state `
    + `${STATES.map((st) => `${st} ${f6(val(`perceived.staleOwnerShare.${st}`, a))}`)
      .join(' · ')}`);
}
banner('');
banner('--- Q3 THE YIELD BY START STATE, and the intended-receiver share ---');
for (const a of ARMS) {
  banner(`  ${a} shots/episode ${STATES.map((st) =>
    `${st} ${f6(val(`yield.shotsPerEpisode.${st}`, a))}`).join(' · ')}`);
  banner(`    aimed/episode ${STATES.map((st) =>
    `${st} ${f6(val(`yield.aimedPerEpisode.${st}`, a))}`).join(' · ')}`);
  banner(`    intended receiver: all ${f6(val('flight.intendedReceiverShare', a))} · own run `
    + `${f6(val('flight.intendedReceiverShare.ownRun', a))} · coach hats `
    + `${f6(val('flight.intendedReceiverShare.coachHats', a))} · toward him `
    + `${f6(val('flight.towardHimShare', a))}`);
  banner(`    that flight's outcome ${OUTCOMES.map((oc) =>
    `${oc} ${f6(val(`flight.outcomeShare.${oc}`, a))}`).join(' · ')}`);
}
banner('');
banner('--- Q4 THE TIMING FACT Δt (negative = the run started onto a travelling ball) ---');
for (const a of ARMS) {
  banner(`  ${a} ${DT_BINS.map((b) => `${b} ${f6(val(`dt.binShare.${b}`, a))}`).join(' · ')}`);
  banner(`    negative ${f6(val('dt.negativeShare', a))} · attached live `
    + `${f6(val('dt.attachedLiveShare', a))} · attached next `
    + `${f6(val('dt.attachedNextShare', a))} · none ${f6(val('dt.noAttachedReleaseShare', a))}`);
  banner(`    the eventual receiver ${RECEIVER_CLASSES.map((rc) =>
    `${rc} ${f6(val(`receiver.classShare.${rc}`, a))}`).join(' · ')} · intended `
    + `${f6(val('receiver.intendedShare', a))}`);
  banner(`    releases/match ${f6(val('release.perMatch', a))} · already running at release `
    + `${f6(val('release.runnersAtReleaseMean', a))} · starts during flight/release `
    + `${f6(val('release.startsDuringFlightPerRelease', a))}`);
}
banner('');
banner('--- THE PULL RECEIPT AND THE CROWDING FAMILY ---');
for (const a of ARMS) {
  banner(`  ${a} pulls/match ${f6(val('perceived.pullsPerMatch', a))} · stamped/match `
    + `${f6(val('perceived.stampedPerMatch', a))} · crashShare ${f6(val('crowd.crashShare', a))} `
    + `· spacingUnder4 ${f6(val('guard.spacingUnder4', a))}`);
}
banner('');
banner(`  gBite ROW form: ${biteRow.rowDiffering}/${biteRow.eligibleSeeds} eligible seeds differ `
  + `on the ROW; the FULL-TIME SIGNATURE coincides on `
  + `${biteRow.fullTimeSignatureIdenticalSeeds} (a PRINTED face)`);
banner(`  G-REPRO: ${reproDetail.comparedFields.length} fields × ${reproDetail.rows.length} rows`);
banner('');
banner(`ARTIFACT ${OUT_PATH}`);
banner(`  bytes ${FINAL_ARTIFACT_BYTES} · fileSha256 ${FINAL_FILE_SHA}`);
banner(`  hashedBodySha256 ${artifact.hashedBodySha256 as string}`);
banner(`  instrumentSha256 ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`  hashReproducesFromFile ${HASH_REPRODUCES_FROM_FILE}`);
banner(`  wall ${((Date.now() - t0Wall) / 1000).toFixed(3)} s`);
if (!ALL_GREEN_FINAL) process.exitCode = 1;
