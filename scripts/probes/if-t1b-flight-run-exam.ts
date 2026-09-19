/**
 * ⭐⭐⭐ IF-T1b — 「球在飞时的前插 · 复考」 THE FLIGHT RUN'S RE-EXAM
 * (docs/world-model/IF-T1B-FLIGHT-RUN-EXAM-RERUN.md).
 *
 * Authorized by COMMANDER RULING #423 item 3 (binding, with #422 item 4), in the IF-T1 form of
 * #420 item 2. Lineage: DS-C0 (the WALKER) → DS-T0/T0b/T0c (the own-run seam) → DS-T1/T1b/T1c →
 * DS-ENTRY (world 16) → DS-T0d + DS-T1d → DS-ENTRY-2 (world 17) → IF-C0 (THE CENSUS whose Q4
 * FACES this exam copies BY FIELD NAME) → IF-T0 + IF-T0-FIX → ⭐ IF-T1 (THE INSTRUMENT THIS FILE
 * COPIES BY RECIPE, and THE EXACT PRIOR TWIN — #421, read 2) → ⭐ IF-T0b + IF-T0b-FIX (THE
 * AMENDED SEAM UNDER EXAM: the same dormant flag `ifFlightRun`, the belief now a RECORD
 * `{ ownerGid, look }`, the per-body LOOK COUNTER `ifLook`, M-IF.5 the whistle and M-IF.6 the
 * two-look freshness — banked-dormant at #423 item 1).
 *
 * THE QUESTION (#423 item 3, not re-argued here): IF-T1 read READ 2 — the flight run CARRIES A
 * FACE (G9 through balls, UP) — on a state looser than the user's own sentence. #422 narrowed
 * that state: he starts ONLY when he SAW THE PASS LEAVE and the game is LIVE. WITH THE NARROWED
 * SEAM, what does the RUN ONTO A BALL ALREADY TRAVELLING produce that R1 and the band can see?
 * The reads, their precedence and the liveness precondition are UNCHANGED.
 *
 * ⭐⭐⭐ WHAT CHANGED FROM IF-T1, each an ⭐ AMENDMENT (#423 item 3): (a) the SAME five arms, the
 * SAME faces, the SAME R1 and band, the SAME three reads + fallback + precedence + liveness
 * precondition, the SAME `gBiteIF` / `gArmIF` / arch-keyed X-FP-PROD; (b) NEW STORED partitions
 * of the eighth class's start state — BY PHASE (a receipt of M-IF.5) and BY LOOK DISTANCE (a
 * receipt of M-IF.6), the MEMORY partition kept; (c) THE EIGHT CORRECTIONS OF #421 item 4
 * APPLIED AT THE FREEZE — every inherited prose string inside the hashed body re-read and
 * re-written for THIS exam — plus a NEW gate `gInheritedProse`; (d) IF-T1's own x64 numbers
 * beside every face as `prior.ifT1` (EXACT — same host, same architecture; ⛔ no paired Δ across
 * the two blocks is claimed) and IF-C0's arm64 as `approx.ifC0` (≈); (e) `gRepro` also re-walks
 * IF-T1's 12,559,000–002 on THIS architecture, GATING the control arms field for field and
 * STORING the candidate arm's differences ("the seam changed, not the host"); (f)
 * `gLedgerRead` registers `match.ifLook` (registry 87 → 88); (g) block 12,560,000–999.
 *
 * ⛔ THIS IS AN EXAM. It arms NOTHING in the game; NOTHING ships. The READ SENTENCES are #420
 * item 2(iii)'s literals, frozen ex ante and copied CHARACTER FOR CHARACTER, selected by STORED
 * booleans with the ruling's own precedence (a breach first, then floods, then read 1), and
 * ⭐ LIVENESS IS A PRECONDITION OF EVERY READ: if `gBiteIF` is RED no read is selected and the
 * string "THE SEAM DID NOT FIRE — no read" is stored instead. ⛔ NO VERDICT WORD is printed on
 * any face. ⭐ "nothing the band can see" is NOT "nothing the eye can see" — that line is
 * printed beside every read; the user's gate at world 18 judges the eye.
 *
 * ⭐⭐⭐ THE HOST FACT (#418 items 1–2): every digest, census and exam number banked before this
 * round is an **arm64** number and this host is **x64**. So: (a) every face this exam publishes
 * is an x64 number and the exam's OWN CONTROL ARM on this host is the EXACT comparator;
 * (b) beside each face IF-C0 also published, IF-C0's arm64 value is stored under `approx.ifC0`
 * with the stamp "≈ cross-architecture" — PRINTED, NEVER SELECTING; (c) `gRepro` is
 * ARCHITECTURE-AWARE: the re-walk of IF-C0's 12,558,000–002 GATES only on arm64 and on x64
 * STORES the rows beside IF-C0's at `repro.rows` (⭐ #421 item 4(iv): the name ruling #420
 * used was never a path, and is used nowhere here), with `gDeterminism` and `gLockstep` carrying the
 * reproduction burden; ⭐ AMENDMENT (e): `gRepro` ALSO re-walks IF-T1's 12,559,000–002 on THIS
 * architecture at `repro.ifT1SameArchitecture`, which GATES the two control arms field for
 * field and STORES the candidate arm's differing fields; (d) X-FP-PROD is ARCH-KEYED.
 *
 * ⛔ NO DOSE. The OBM seat is ABSENT on every one of the FIVE arms (#420 item 2(i)).
 * `info.genome` is untouched and asserted clean on every walked match. The D13 arms take the
 * SHIPPED loaders' L3 / PC doses through `armA4World`, exactly as DS-C0's D13 arm did.
 *
 * ⛔ X-SRC-ZERO: no file under `src/` or `tests/` is created or edited. The probe reads public
 * `Match` / `Team` / `Player` / `Ball` state and the engine's own decision record
 * (`p.action.scores`) before and after `match.step(DT)`. THERE IS NO WRAPPER on any walked match
 * — `gLockstep` proves observed ≡ unobserved byte for byte PER ARM.
 * ⚠ THE ONE DECLARED ADDED READ (IF-C0's own form, inherited): at an OWN-RUN decision tick on an
 * arm carrying `dsOwnRun` the instrument pulls `match.perceivedSnapshot(p)` ONCE to publish the
 * eighth class's START-STATE partition and IF-C0's leak partition. The pull is INERT (the
 * snapshot is reconstructed from truth, draws no rng and mutates nothing) and `gLockstep` +
 * `gPullCount` prove it: the whole-match signature is byte-identical either way and the counted
 * added pulls EQUAL the instrument's own stored count.
 * ⭐⭐⭐ THE TWO REGISTERED LEDGER READS: `match.ifLastSeenOwnerGid` — the seam's OWN belief,
 * registered at IF-T1 (registry 86 → 87) and read here for the eighth class's MEMORY partition
 * — and ⭐ AMENDMENT `match.ifLook`, the LOOK COUNTER, REGISTERED HERE (registry 87 → 88) and
 * read for the LOOK-DISTANCE partition. BOTH are READ, NEVER WRITTEN.
 *
 * ⭐⭐ THE SEAM'S FACES ARE BACKED OUT, NEVER RECOMPUTED (DS-T1c's note, inherited):
 * `score = W.runScore · prior · restraint · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul`
 * (§LAW-C, anchored, `obmRunMul` LAST), so the stored score over `W.runScore · prior · tiredMul`
 * is EXACTLY `restraint · obmRunMul`; the seat is ABSENT on every arm here, so that IS the
 * restraint. ⭐ The EIGHTH state's candidate carries the EIGHTH `why`, so the same back-out taken
 * on THAT candidate is the eighth class's OWN restraint partition (#419 item 3's face).
 *
 * ⭐⭐ THE THREE DS-T1 DEBT PAYMENTS ARE INHERITED UNCHANGED: (a) the post-step holds predicate of
 * record with DS-C0's pre-step form and the engine's own ledger receipt beside; (b) the shooter
 * gid banked AT THE SHOT'S PUSH; (c) the wide episode bins past one full `wallRun` licence with
 * the top bin's share beside every bin-derived median.
 *
 * ⭐⭐⭐ RULE (m), INHERITED: `assignRunners` and `performPass` carry `dsCoopHatsOff` gates and
 * `decideOffBall` carries the IF-T0b insertion, so all three WHOLE-TEXT hashes are STATED AT
 * THIS HEAD and COMPARED TO NOTHING BANKED.
 *
 * ⭐⭐⭐ THE LESSON OF #421 item 4, EXECUTED HERE: every inherited prose string inside the hashed
 * body is a CLAIM and is re-read at the freeze. `gInheritedProse` enumerates every prose field
 * in the hashed body with its source and a re-read boolean, and is RED if any is false.
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
import { RUN_ROLE_W, RUN_DEPTH_DIV, RUN_PRIOR_MAX, runnerCount, runRank } from '../../src/ai/TeamBrain';
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
const ENV_WHITELIST = ['IFT1B_MODE', 'IFT1B_N', 'IFT1B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('IFT1B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`IF-T1b FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.IFT1B_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('IF-T1b FATAL — IFT1B_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.IFT1B_N !== undefined ? Number(process.env.IFT1B_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('IF-T1b FATAL — IFT1B_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.IFT1B_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`IFT1B_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`IFT1B_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`IFT1B_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/if-t1b-flight-run-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/if-t1b-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('IF-T1b FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}
/** ⭐⭐ THE INSTRUMENT OF RECORD — this file's own path, for the stage block's hash. */
const INSTRUMENT_PATH = 'scripts/probes/if-t1b-flight-run-exam.ts';

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
const IFT0_TEST_PATH = 'tests/ifFlightRun.test.ts';
/** ⭐⭐⭐ IF-T0's OWN INTENDED-RECEIVER FIXTURE, CITED BY TEST TITLE (#416 item 3(i), the fifth
 *  walk-side strike DISCHARGED at #419 item 1(h)). Both titles are ANCHORED below. */
const IFT0_INTENDED_FIRING_TITLE = 'FIRING — the pass is aimed AT HIM, his eyes say the ball '
  + 'is loose and the last body he saw with it was a mate ⇒ the EIGHTH `why`';
const IFT0_INTENDED_NONFIRING_TITLE = 'NON-FIRING — the SAME pass aimed at the SAME body, but '
  + 'the last body he saw with the ball was an OPPONENT ⇒ no candidate at all';
const DSC0_ARTIFACT = 'docs/world-model/data/ds-c0-designation-census.json';
const ANCHOR_FILES = [TEAMBRAIN_PATH, MECH_PATH, BRAIN_PATH, EXEC_PATH, MATCH_PATH, CONST_PATH,
  EYES_PATH, GENOME_PATH, A4_PATH, TEAM_PATH, PLAYER_PATH, LEAGUE_PATH, TYPES_PATH,
  OBMT1_PATH, CTBT1_PATH, DLCT1_PATH, LNT1PB_PATH, A4P1C_PATH, PTC0_PATH, SEAM_DOC_PATH,
  IFT0_TEST_PATH];
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

/** ⭐⭐⭐ THE COUNTS AT **THIS** HEAD, MEASURED (never copied): `a4World.ts` names the two
 *  own-run doors because DS-ENTRY cut world 16 out of them. They are measured here and then
 *  ANCHORED to their measured value, so the anchor still fails if the entry layer changes
 *  SHAPE — what it can no longer do is fail merely because a later rung exists. */
const A4_OWN_COUNT_AT_THIS_HEAD = occurrences(SRC_OF[A4_PATH], 'dsOwnRun').length;
const A4_HATS_COUNT_AT_THIS_HEAD = occurrences(SRC_OF[A4_PATH], 'dsHatsOff').length;
const A4_COOP_COUNT_AT_THIS_HEAD = occurrences(SRC_OF[A4_PATH], 'dsCoopHatsOff').length;
/** ⭐⭐⭐ THE FLIGHT DOOR AND ITS BELIEF REACH **NO** WORLD — and THAT count (zero) is still a
 *  CLAIM at this head, so it is anchored as a literal zero. `dsCoopHatsOff`'s zero is NOT: the
 *  entry layer named it at DS-ENTRY-2 (#415 errata), so its count is STATED at this head. */
const A4_IF_COUNT_AT_THIS_HEAD = occurrences(SRC_OF[A4_PATH], 'ifFlightRun').length;
const A4_IF_BELIEF_COUNT_AT_THIS_HEAD = occurrences(SRC_OF[A4_PATH],
  'ifLastSeenOwnerGid').length;
/** ⭐ AMENDMENT (#423 item 3(i)): the LOOK COUNTER is the amended seam's second map and it too
 *  reaches NO world, preset or bundle at this head — a literal-zero anchor like the other two. */
const A4_IF_LOOK_COUNT_AT_THIS_HEAD = occurrences(SRC_OF[A4_PATH], 'ifLook').length;
/** ⭐⭐⭐ THE SEAM UNDER EXAM — IF-T0b's own lines (READ, NEVER TOUCHED), at §LAW-B's placement.
 *  ⭐ AMENDMENT vs IF-T1 (#423 item 3(i)): the fork's FIRST statements are now FOUR, the belief
 *  is a RECORD { ownerGid, look }, the look counter and the whistle are aliased, and the eighth
 *  state carries M-IF.5 (the whistle) and M-IF.6 (the index equality). Every line below is
 *  RE-READ from THIS head; not one is inherited as text from IF-T1. */
const IF_DOOR_ALIAS_LINE = '      const ifFlightRun = match.ifFlightRun;';
const IF_BELIEF_ALIAS_LINE = '      const ifLastSeenOwner = match.ifLastSeenOwnerGid;';
const IF_LOOK_ALIAS_LINE = '      const ifLookMap = match.ifLook;';
const IF_PHASE_ALIAS_LINE = '      const ifPhase = match.phase;';
const IF_LOOK_INCREMENT_LINE = '        const ifThisLook = ifFlightRun '
  + '? (ifLookMap.get(p.gid) ?? 0) + 1 : 0;';
const IF_PREV_READ_LINE = '          ? (ifLookMap.set(p.gid, ifThisLook), '
  + 'ifLastSeenOwner.get(p.gid) ?? null)';
const IF_BELIEF_RW_LINE = '          ? (ifLastSeenOwner.set(p.gid, '
  + '{ ownerGid, look: ifThisLook }), null)';
const IF_FRESHNESS_LINE = '          : (ifPrev !== null && ifPrev.look === ifThisLook - 1 '
  + '? ifPrev.ownerGid : null);';
const IF_STATE_LINE = "        const ifOntoFlight = ifFlightRun && ifPhase === 'playing'";
const IF_STATE_LINE_B = '          && seenBall !== null && ownerGid === null';
const IF_WHY_LINE = "          ifCand.why = ifOntoFlight ? 'own run onto the flight' "
  + ': ifCand.why;';
const IF_FLAG_INIT_LINE = '    this.ifFlightRun = cfg.ifFlightRun ?? false;';
const IF_BELIEF_INIT_LINE = '    this.ifLastSeenOwnerGid = new Map();';
const IF_LOOK_INIT_LINE = '    this.ifLook = new Map();';
const IF_BELIEF_FIELD_LINE = '  readonly ifLastSeenOwnerGid: '
  + 'Map<number, { ownerGid: number; look: number }>;';
const IF_LOOK_FIELD_LINE = '  readonly ifLook: Map<number, number>;';
const IF_LEAGUE_KEY_LINE = "    | 'ifFlightRun'";
/** ⭐⭐⭐ THE SWITCH'S TWO GATE LINES — the SAME literal in two files (§SWITCH-D, VERBATIM). */
const COOP_GATE_LINE = '  if (!match.dsCoopHatsOff) {';
const PERFORM_PASS_HEAD = 'export function performPass(';

/* ---- ⭐⭐⭐ THE SEAM THIS EXAM EXAMINES (DS-T0; READ, NEVER TOUCHED) ---- */
anchor('⭐⭐⭐ THE OWN-RUN GATE — the ONE `match.dsOwnRun` READ FORK in `src/**`', BRAIN_PATH,
  '    if (match.dsOwnRun) {', 1);
anchor('⭐⭐⭐ THE OWN-RUN GUARD — the hat board read', BRAIN_PATH,
  '      const hatted = team.runners.has(p.index) || team.arriver === p.index', 1);
anchor('⭐⭐⭐ THE OWN-RUN GUARD — the 2过1 licence\'s OWN clock liveness', BRAIN_PATH,
  '      const wallLive = p.wallRun !== null && match.simTime < p.wallRun.until;', 1);
const PRIOR_LINE = '          const prior = clamp01(mine / RUN_PRIOR_MAX);';
anchor('⭐⭐⭐ THE PRIOR (DS-T0c) — the SAME ranking `mine`, normalised by its own derived maximum',
  BRAIN_PATH, PRIOR_LINE, 1);
anchor('⭐⭐⭐ THE SCORE — `W.runScore · prior · restraint`, the THREE-FACTOR product whose LAST '
  + 'factor this exam BACKS OUT (§LAW-C; byte-unchanged from DS-T0b)', BRAIN_PATH,
  '          let s = W.runScore * prior * restraint;', 1);
anchor('⭐⭐⭐ THE TIRED LIMB, then the EYES — the multiplier ORDER this exam backs out',
  BRAIN_PATH, '          if (tired) s *= OFFBALL_TIRED_MUL;\n          s *= obmRunMul;', 1);
/* ---- ⭐⭐⭐ DS-T0c's AMENDMENT — the RANK LAW's own lines (#410 item 2) ---- */
anchor('⭐⭐⭐ THE RESTRAINT (M-DS.6″(c)) — `clamp01(runnerCount(` … `) - rankAbove)`, the coach\'s '
  + '`slice(0, count)` as a CAP, and the SECOND `runnerCount` call site', BRAIN_PATH,
  '          const restraint = clamp01(runnerCount(', 1);
anchor('⭐⭐⭐ THE CAP\'S RIGHT OPERAND — `) - rankAbove);`, the step\'s own closing line',
  BRAIN_PATH, '          ) - rankAbove);', 1);
anchor('⭐⭐⭐ THE COUNT\'S THREE INPUTS at the player\'s call site — mode · tempo · urgency',
  BRAIN_PATH, '            team.mode, team.genome.tempo, team.mentality.urgency,', 1);
anchor('⭐⭐⭐ THE PERCEPT PULL — the ONE `perceivedSnapshot` INSIDE the gate and the guard '
  + '(`gPullCount` measures that this instrument adds none)', BRAIN_PATH,
  '        const snapshot = match.perceivedSnapshot(p);', 1);
anchor('⭐⭐⭐ THE PERCEIVED-OWNER GUARD (M-DS.7, byte-unchanged) — the candidate exists ONLY when '
  + 'the eyes hold a MATE on the ball', BRAIN_PATH,
  '        if (snapshot !== null && carrierIsMate) {', 1);
anchor('⭐⭐⭐ HIS OWN RANKING (M-DS.6″(b)) — `runRank` over his OWN pos and role', BRAIN_PATH,
  '          const mine = runRank(p.role, team.localX(p.pos.x));', 1);
anchor('⭐⭐⭐ EACH PERCEIVED MATE\'S RANKING — the ROLE off the ROSTER, the POSITION off the '
  + 'SNAPSHOT\'S COPY (never the mate\'s truth `pos`)', BRAIN_PATH,
  '              const theirs = runRank(mate.role, team.localX(body.pos.x));', 1);
anchor('⭐⭐⭐ THE COACH\'S OWN COMPARATOR, APPLIED BY THE PLAYER — `theirs > mine || (theirs === '
  + 'mine && mate.index < p.index)`; ties by the LOWER roster index, exactly as `assignRunners` '
  + 'sorts', BRAIN_PATH,
  '              if (theirs > mine || (theirs === mine && mate.index < p.index)) rankAbove++;',
  1);
anchor('⭐⭐ the rank-count EXCLUSIONS — himself and the perceived carrier', BRAIN_PATH,
  '            if (mate.gid === p.gid || mate.gid === ownerGid) continue;', 1);
anchor('⭐⭐ the rank-count EXCLUSIONS — the keeper and a sent-off mate (the ROSTER read)',
  BRAIN_PATH, "            if (mate.role === 'GK' || mate.sentOff) continue;", 1);
anchor('⭐⭐ the rank-count\'s SNAPSHOT loop and its gid + side match — the eyes rule',
  BRAIN_PATH, '              if (body.gid !== mate.gid || body.side !== p.side) continue;', 1);
const WHY_OWN_LINE = "          cands.push({ action: 'MakeRun', score: s, "
  + "why: 'own run in behind' });";
anchor('⭐⭐⭐ THE SEVENTH `why` LITERAL — the own run\'s own name on the decision record',
  BRAIN_PATH, WHY_OWN_LINE, 1);
/* ---- ⭐⭐⭐ THE SEAM UNDER EXAM (IF-T0 + IF-T0-FIX; READ, NEVER TOUCHED) ---- */
anchor('⭐⭐⭐ IF-T0b — THE FLIGHT DOOR\'S ALIAS, the FIRST executable statement INSIDE the '
  + 'own-run fork (§LAW-B\'s placement)', BRAIN_PATH, IF_DOOR_ALIAS_LINE, 1);
anchor('⭐⭐⭐ IF-T0b — THE BELIEF\'S ALIAS, the SECOND statement inside the fork',
  BRAIN_PATH, IF_BELIEF_ALIAS_LINE, 1);
anchor('⭐⭐⭐ IF-T0b — THE LOOK COUNTER\'S ALIAS, the THIRD statement inside the fork (M-IF.6)',
  BRAIN_PATH, IF_LOOK_ALIAS_LINE, 1);
anchor('⭐⭐⭐ IF-T0b — THE WHISTLE\'S ALIAS, the FOURTH statement inside the fork (M-IF.5)',
  BRAIN_PATH, IF_PHASE_ALIAS_LINE, 1);
anchor('⭐⭐⭐ M-IF.6 — THE LOOK COUNTER\'S ONE INCREMENT per own-run evaluation, under the door',
  BRAIN_PATH, IF_LOOK_INCREMENT_LINE, 1);
anchor('⭐⭐⭐ M-IF.6 — THE BELIEF AS IT STOOD BEFORE THIS LOOK, read BEFORE the write below',
  BRAIN_PATH, IF_PREV_READ_LINE, 1);
anchor('⭐⭐⭐ M-IF.2 — THE BELIEF\'S ONE WRITE SITE, his OWN entry by his own gid, now carrying '
  + 'THE LOOK INDEX with it (M-IF.6)', BRAIN_PATH, IF_BELIEF_RW_LINE, 1);
anchor('⭐⭐⭐ M-IF.6 — THE TWO-LOOK FRESHNESS: the INDEX EQUALITY of the `cands.length - 1` '
  + 'kind. ⛔ NOT a tick bound, ⛔ NOT an age bound', BRAIN_PATH, IF_FRESHNESS_LINE, 1);
anchor('⭐⭐⭐ M-IF.5 — THE EIGHTH STATE\'S FIRST LINE: the door AND THE WHISTLE (an identity '
  + 'test on a state every body on the pitch shares)', BRAIN_PATH, IF_STATE_LINE, 1);
anchor('⭐⭐⭐ M-IF.1 — THE EIGHTH STATE\'S SECOND LINE: a ball SEEN with NO owner. IDENTITY '
  + 'TESTS ONLY', BRAIN_PATH, IF_STATE_LINE_B, 1);
anchor('⭐⭐ M-IF.1 — the state widened THROUGH THE GUARD\'S OWN VARIABLE (a pure insertion)',
  BRAIN_PATH, '        carrierIsMate = carrierIsMate || ifOntoFlight;', 1);
anchor('⭐⭐⭐ THE EIGHTH `why` LITERAL — a RELABEL of the SAME candidate at the SAME score (M-IF.3)',
  BRAIN_PATH, IF_WHY_LINE, 1);
anchor('⭐⭐ the `ifFlightRun` FLAG INIT — a hard `false`, never env-armed, never bundled', MATCH_PATH,
  IF_FLAG_INIT_LINE, 1);
anchor('⭐⭐ the belief CREATED EMPTY on `Match`', MATCH_PATH, IF_BELIEF_INIT_LINE, 1);
anchor('⭐⭐ the belief\'s readonly field — now a RECORD carrying THE LOOK INDEX (M-IF.6)',
  MATCH_PATH, IF_BELIEF_FIELD_LINE, 1);
anchor('⭐⭐ IF-T0b — the LOOK COUNTER map CREATED EMPTY on `Match`', MATCH_PATH,
  IF_LOOK_INIT_LINE, 1);
anchor('⭐⭐ IF-T0b — the LOOK COUNTER\'s readonly field', MATCH_PATH, IF_LOOK_FIELD_LINE, 1);
anchor('⭐⭐ ⛔ THE LOOK COUNTER APPEARS NOWHERE IN THE ENTRY LAYER (the count is ZERO)', A4_PATH,
  'ifLook', 0);
anchor('⭐⭐ ⛔ THE LOOK COUNTER APPEARS NOWHERE IN THE EXECUTOR (the count is ZERO)', EXEC_PATH,
  'ifLook', 0);
anchor('⭐⭐ the `ifFlightRun` League union key', LEAGUE_PATH, IF_LEAGUE_KEY_LINE, 1);
anchor('⭐⭐ ⛔ THE FLIGHT DOOR APPEARS NOWHERE IN THE EXECUTOR (the count is ZERO)', EXEC_PATH,
  'ifFlightRun', 0);
anchor('⭐⭐⭐ THE HATS-OFF GATES — `if (!match.dsHatsOff) {`, EXACTLY TWO, both ENUMERATED',
  TEAMBRAIN_PATH, '  if (!match.dsHatsOff) {', 2);
anchor('⭐⭐ the `dsOwnRun` FLAG INIT — a hard `false`, never env-armed', MATCH_PATH,
  '    this.dsOwnRun = cfg.dsOwnRun ?? false;', 1);
anchor('⭐⭐ the `dsHatsOff` FLAG INIT — a hard `false`', MATCH_PATH,
  '    this.dsHatsOff = cfg.dsHatsOff ?? false;', 1);
/** ⭐⭐⭐ ERRATA 6 OF DS-T1c (#412 item 3, FAMILY NOTE): its two `a4World.ts` ZERO-COUNT anchors
 *  read RED from 32723c5, because the ENTRY LAYER now NAMES `dsOwnRun` and `dsHatsOff` (world 16
 *  = 15 + the two doors). A stage's zero-count anchor over the entry layer is a statement DATED
 *  TO ITS HEAD; this exam STATES THE COUNTS AT **THIS** HEAD and never copies DS-T1c's. */
anchor('⭐⭐⭐ `a4World.ts` NAMES `dsOwnRun` — the COUNT AT THIS HEAD, stated (DS-ENTRY\'s '
  + '`DS_WORLD_DOORS` and its containment read), NEVER copied from DS-T1c\'s zero',
  A4_PATH, 'dsOwnRun', A4_OWN_COUNT_AT_THIS_HEAD);
anchor('⭐⭐⭐ `a4World.ts` NAMES `dsHatsOff` — the COUNT AT THIS HEAD, stated', A4_PATH,
  'dsHatsOff', A4_HATS_COUNT_AT_THIS_HEAD);
anchor('⭐⭐⭐ `a4World.ts` NAMES `dsCoopHatsOff` — the COUNT AT THIS HEAD, STATED (DS-ENTRY-2 cut '
  + 'world 17 out of it; #415 errata retired DS-T1d\'s zero-count anchor here), never copied',
  A4_PATH, 'dsCoopHatsOff', A4_COOP_COUNT_AT_THIS_HEAD);
anchor('⭐⭐⭐ ⛔ `a4World.ts` NAMES `ifFlightRun` **ZERO** times — THE FLIGHT DOOR REACHES NO WORLD, '
  + 'preset or bundle (the count is ZERO, and that IS the anchor)', A4_PATH, 'ifFlightRun', 0);
anchor('⭐⭐⭐ ⛔ `a4World.ts` NAMES `ifLastSeenOwnerGid` **ZERO** times — the belief reaches no world',
  A4_PATH, 'ifLastSeenOwnerGid', 0);
/* ---- ⭐⭐⭐ THE SWITCH UNDER EXAM (DS-T0d; READ, NEVER TOUCHED) ---- */
anchor('⭐⭐⭐ GATE 1 — `assignRunners`\' 套边 block wrapped, VERBATIM (§SWITCH-D)',
  TEAMBRAIN_PATH, COOP_GATE_LINE, 1);
anchor('⭐⭐⭐ GATE 2 — `performPass`\'s 2过1 trigger wrapped, VERBATIM (§SWITCH-D)',
  MECH_PATH, COOP_GATE_LINE, 1);
anchor('⭐⭐ the `dsCoopHatsOff` FLAG INIT — a hard `false`, never env-armed, never bundled',
  MATCH_PATH, '    this.dsCoopHatsOff = cfg.dsCoopHatsOff ?? false;', 1);
anchor('⭐⭐ the `dsCoopHatsOff` MatchConfig key', MATCH_PATH, '  dsCoopHatsOff?: boolean;', 1);
anchor('⭐⭐ the `dsCoopHatsOff` readonly field', MATCH_PATH,
  '  readonly dsCoopHatsOff: boolean;', 1);
anchor('⭐⭐ the THREE flags\' League union keys, on ONE line', LEAGUE_PATH,
  "  | 'dsOwnRun' | 'dsHatsOff' | 'dsCoopHatsOff'", 1);
anchor('⭐⭐⭐ THE FLIGHT-PRESERVING STATEMENT — `if (!keepOverlap) team.overlapper = null;` sits '
  + 'OUTSIDE and ABOVE gate 1, byte-untouched (§SWITCH-D)', TEAMBRAIN_PATH,
  '  if (!keepOverlap) team.overlapper = null;', 1);
anchor('⭐⭐⭐ `performPass` — the 2过1 trigger\'s OWN enclosing function (hashed WHOLE below)',
  MECH_PATH, PERFORM_PASS_HEAD, 1);
const RUNNER_COUNT_HEAD = 'export function runnerCount(mode: TeamMode, tempo: number, '
  + 'urgency: number): number {';
anchor('⭐⭐⭐ `runnerCount` — THE COACH\'S OWN COUNT, CODE-MOVED and EXPORTED (DS-T0b M-DS.6(a); '
  + 'the expression exists ONCE in `src/**`)', TEAMBRAIN_PATH, RUNNER_COUNT_HEAD, 1);
anchor('⭐⭐ `runnerCount` CALL SITE 1 of 2 — the SHIPPED designation inside `assignRunners`, '
  + 'arithmetic unchanged', TEAMBRAIN_PATH,
  '    const count = runnerCount(team.mode, team.genome.tempo, team.mentality.urgency);', 1);
const RUN_RANK_HEAD = 'export function runRank(role: Role, localX: number): number {';
const RUN_RANK_RETURN = '  return RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV;';
anchor('⭐⭐⭐ `runRank` — THE COACH\'S OWN RANKING, CODE-MOVED and EXPORTED (DS-T0c M-DS.6″(a); '
  + 'the expression exists ONCE in `src/**`)', TEAMBRAIN_PATH, RUN_RANK_HEAD, 1);
anchor('⭐⭐⭐ `runRank`\'s OWN `return` — `RUN_ROLE_W[role] + localX / RUN_DEPTH_DIV`, the '
  + 'summand pattern that occurs EXACTLY ONCE (#410 §CORR-C 2)', TEAMBRAIN_PATH,
  RUN_RANK_RETURN, 1);
anchor('⭐⭐ THE SUMMAND PATTERN `RUN_ROLE_W[` in `TeamBrain.ts` — TWO occurrences, BOTH '
  + 'ENUMERATED: `runRank`\'s own `return` and ⚠ the code-move\'s DOCBLOCK, which quotes the '
  + 'retired inline expression. The EXECUTABLE census is a CODE FACT (comment-stripped), not '
  + 'this anchor (#410 §CORR-C 2 qualified the claim to the summand pattern)',
  TEAMBRAIN_PATH, 'RUN_ROLE_W[', 2);
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
anchor('⭐⭐⭐ THE OPEN-PLAY SCORING — the shipped `.map` CALLING the code-moved `runRank` '
  + '(DS-T0c\'s ONE changed shipped line; the ranking exists ONCE in `src/**`)',
  TEAMBRAIN_PATH, '      .map((p) => ({ p, s: runRank(p.role, team.localX(p.pos.x)) }))', 1);
anchor('⭐⭐⭐ THE COACH\'S OWN SORT — `b.s - a.s || a.p.index - b.p.index`, BYTE-UNCHANGED (the '
  + 'comparator the player copies). TWO occurrences, BOTH ENUMERATED: the corner-flag arriver '
  + 'scoring and the open-play runner scoring', TEAMBRAIN_PATH,
  '      .sort((a, b) => b.s - a.s || a.p.index - b.p.index);', 2);
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
anchor('⭐⭐ X-FP-PROD — the arm64 PRODUCTION FINGERPRINT OF RECORD, inherited BY ANCHOR from '
  + 'OBM-T1\'s probe', OBMT1_PATH,
  "const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';",
  1);
/** ⭐⭐⭐ X-FP-PROD IS **ARCH-KEYED** (#418 item 2(ii), #420 item 2(iv)). BOTH columns are read
 *  BY ANCHOR out of IF-T0's own pin suite, which carries them side by side — ⛔ neither is
 *  typed here. arm64 is the value OF RECORD; x64 is the SECOND COLUMN opened at #418 item 1. */
const FP_ARM64_LINE = "  arm64: '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673',";
const FP_X64_LINE = "  x64: '59f42aa7f9b3538a9660b21e1506deb368a4c2ae280860ad27df63e7f14a072d',";
anchor('⭐⭐⭐ X-FP-PROD, ARCH-KEYED — the arm64 column in IF-T0\'s own suite', IFT0_TEST_PATH,
  FP_ARM64_LINE, 1);
anchor('⭐⭐⭐ THE INTENDED-RECEIVER FIXTURE, FIRING — IF-T0\'s own `it()`, cited BY TITLE',
  IFT0_TEST_PATH, IFT0_INTENDED_FIRING_TITLE, 1);
anchor('⭐⭐⭐ THE INTENDED-RECEIVER FIXTURE, NON-FIRING — IF-T0\'s own `it()`, cited BY TITLE',
  IFT0_TEST_PATH, IFT0_INTENDED_NONFIRING_TITLE, 1);
anchor('⭐⭐⭐ X-FP-PROD, ARCH-KEYED — the x64 column (#418 item 1\'s value of record)',
  IFT0_TEST_PATH, FP_X64_LINE, 1);

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
/** ⭐⭐⭐ THE EIGHTH LITERAL — EXTRACTED from the seam's own RELABEL line, never typed. */
const WHY_IF = firstQuoted(IF_WHY_LINE);
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
const FP_PROD_TABLE: Record<string, string> = {
  arm64: firstQuoted(FP_ARM64_LINE), x64: firstQuoted(FP_X64_LINE),
};
const FP_PROD_ARCH = process.arch;
const FP_PROD_PIN = FP_PROD_TABLE[FP_PROD_ARCH] ?? '';
const FP_PROD_ARCH_KNOWN = FP_PROD_PIN !== '';
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
  && WHY_IF === 'own run onto the flight'
  && SRC_OF[BRAIN_PATH].includes(CUTBACK_WHY_LINE)
  && TEAM_AI_INTERVAL === 0.4 && AI_INTERVAL === 0.15 && DT === 1 / 60
  && NI_OK && ACTIONS.includes('MakeRun') && ACTIONS.includes('MoveToFormationSpot');

/* ========================================================================== */
/* §5 SEEDS — block 12,560,000–999 (#423 item 3(vi); frontier #423 item 4)     */
/* ========================================================================== */
const BLOCK_BASE = 12_560_000;
const BLOCK_TOP = 12_560_999;
/** ⭐⭐ N_FROZEN = 999 — the block's OWN AFFORDANCE after the construction receipt at
 *  12,560,999 (battery seeds 12,560,000–12,560,998). §DEV-PREFLIGHT's sizing rows are computed
 *  and stored; N = min(nRequired, the affordance) is taken as the AFFORDANCE, and each row says
 *  whether it is resolvable at N_FROZEN. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_008_800;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const WORLD_PIN_SEED = SCRATCH_BASE + 70;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const XDET_SEEDS = LOCKSTEP_SEEDS;
const FIXTURE_SEED = SCRATCH_BASE + 99;
/** ⭐⭐⭐ G-ARM-COOP's NON-VACUITY SPY seeds — inside the SAME declared band. */
const IF_SCRATCH_SEEDS = [SCRATCH_BASE + 40, SCRATCH_BASE + 41];
/** ⭐⭐⭐ G-REPRO-DST1c's RE-WALK band — DS-T1c's OWN CONSUMED block. NOT a consumption. */
const REPRO_SEEDS = [12_558_000, 12_558_001, 12_558_002];
/** ⭐⭐⭐ THE PRIOR ARTIFACTS. DS-T1c's is what G-REPRO-DST1c re-walks against and what the arc's
 *  readings are QUOTED BY FIELD from. ⛔ NOT ONE of their numbers is typed in this file. */
const DST1C_ARTIFACT = 'docs/world-model/data/ds-t1c-own-run-exam.json';
/** ⭐⭐⭐ ⭐ AMENDMENT (#423 item 3(iii)) — THE **EXACT** PRIOR TWIN. IF-T1 walked the same five
 *  arms, the same faces and the same instrument recipe ON THIS HOST AND THIS ARCHITECTURE
 *  (x64), on the block BEFORE this one. Its numbers are therefore an EXACT twin in KIND — same
 *  host, same architecture, same construction — and they are printed beside every face as
 *  `prior.ifT1`. ⛔ NO PAIRED Δ ACROSS THE TWO BLOCKS IS CLAIMED: the seeds differ, so the two
 *  numbers are two independent samples, never a difference. PRINTED, NEVER SELECTING. */
const IFT1_ARTIFACT = 'docs/world-model/data/if-t1-flight-run-exam.json';
const DST1D_ARTIFACT = 'docs/world-model/data/ds-t1d-coop-hats-exam.json.RED.json';
const IFC0_ARTIFACT = 'docs/world-model/data/if-c0-flight-run-census.json';

/* ========================================================================== */
/* §6 THE ARMS — SIX, PAIRED on shared seeds, THE OBM SEAT ABSENT THROUGHOUT   */
/* ========================================================================== */
const ARMS = [
  'HATS-E13', 'OWNCOOP-E13', 'OWNCOOP+IF-E13',
  'OWNCOOP-D13', 'OWNCOOP+IF-D13',
] as const;
type Arm = (typeof ARMS)[number];
/** ⭐⭐⭐ THE ARM OF RECORD for the reads (#413 item 5(i)) and ITS CONTROL. */
const ARM_OF_RECORD: Arm = 'OWNCOOP+IF-E13';
const CONTROL_OF_RECORD: Arm = 'OWNCOOP-E13';
const ARM_LABEL: Record<Arm, string> = {
  'HATS-E13': 'world 13 EMPTY-BOOK, NO DS flag, OBM seat ABSENT — THE SHIPPED PATH of world 13 '
    + 'and IF-C0\'s own `HATS-E13` arm, re-walked on THIS block and THIS architecture',
  'OWNCOOP-E13': '⭐⭐⭐ world 13 EMPTY-BOOK + `dsOwnRun` + `dsHatsOff` + `dsCoopHatsOff` — '
    + 'WORLD 17\'S OWN DOOR SET. ⭐ THE CONTROL OF THE COMPARISON OF RECORD, and the EXACT '
    + 'comparator on this x64 host.',
  'OWNCOOP+IF-E13': '⭐⭐⭐ the same + `ifFlightRun` — the WORLD-18 CANDIDATE: world 17 plus the '
    + 'run onto a ball already travelling. THE ARM OF RECORD.',
  'OWNCOOP-D13': 'world 17\'s door set on the played form D13 (the shipped loaders\' L3 / PC '
    + 'doses) — the D13 control, BESIDE',
  'OWNCOOP+IF-D13': 'the played form + `ifFlightRun` — the D13 candidate, BESIDE',
};
type ArmFlagKind = 'HATS' | 'OWNCOOP' | 'OWNCOOP+IF';
const ARM_KIND: Record<Arm, ArmFlagKind> = Object.fromEntries(ARMS.map((a) => [a,
  a.startsWith('OWNCOOP+IF') ? 'OWNCOOP+IF' : a.startsWith('OWNCOOP') ? 'OWNCOOP' : 'HATS',
])) as Record<Arm, ArmFlagKind>;
/** ⭐⭐⭐ THE FLIGHT DOOR is carried by the two `OWNCOOP+IF` arms and by NOTHING else. */
const ARM_CARRIES_IF: Record<Arm, boolean> = Object.fromEntries(ARMS.map((a) => [a,
  ARM_KIND[a] === 'OWNCOOP+IF'])) as Record<Arm, boolean>;
const IF_ARMS = ARMS.filter((a) => ARM_CARRIES_IF[a]);
const NON_IF_ARMS = ARMS.filter((a) => !ARM_CARRIES_IF[a]);
const ARM_BOOK: Record<Arm, 'E13' | 'D13'> = Object.fromEntries(ARMS.map((a) => [a,
  a.endsWith('-D13') ? 'D13' : 'E13'])) as Record<Arm, 'E13' | 'D13'>;
const E13_ARMS = ARMS.filter((a) => ARM_BOOK[a] === 'E13');
/** ⭐⭐⭐ NO DOSE ANYWHERE (#413 item 5(i), rule (h) of the dispatch): the OBM seat is ABSENT on
 *  EVERY arm, `obmMovement` is never set, DS-T1c's RUN-CAUTION / KITCHEN-SINK matrices,
 *  `armMatrixLocal`, `doseFromExports` and G-DOSE-COPY are REMOVED — not left dormant — and
 *  `info.genome` is untouched (asserted clean on every walked match by `gWorld`). The D13 arms'
 *  L3 / PC doses are the SHIPPED BOOK, taken through `armA4World` exactly as DS-C0's D13 arm
 *  took them; `gDoseSource` still hashes the bytes it reads. */
const OBM_SEAT_ABSENT_ON_EVERY_ARM = true;
const ARM_DOSED: Record<Arm, boolean> = Object.fromEntries(
  ARMS.map((a) => [a, false])) as Record<Arm, boolean>;

/** ⭐⭐⭐ THE CONTRASTS — RE-READ AT THIS FREEZE. The COMPARISON OF RECORD is
 *  `OWNCOOP+IF-E13` vs `OWNCOOP-E13` (CONTROL = world 17's own door set);
 *  `OWNCOOP+IF-E13 vs HATS-E13` is printed BESIDE with HATS as its control (world 13 as
 *  shipped against the world-18 candidate); `OWNCOOP-E13 vs HATS-E13` re-states DS-T1d's own
 *  comparison on THIS block and THIS architecture; the D13 pair sits beside. A contrast is a
 *  PAIR, not an arm. */
const CONTRASTS = [
  'OWNCOOP+IF-E13|OWNCOOP-E13', 'OWNCOOP+IF-E13|HATS-E13', 'OWNCOOP-E13|HATS-E13',
  'OWNCOOP+IF-D13|OWNCOOP-D13',
] as const;
type Cid = (typeof CONTRASTS)[number];
const CONTRAST_OF_RECORD: Cid = 'OWNCOOP+IF-E13|OWNCOOP-E13';
/** the BESIDE table: the world-18 CANDIDATE against HATS, HATS as its control. */
const CONTRAST_HATS_VS_CANDIDATE: Cid = 'OWNCOOP+IF-E13|HATS-E13';
const CONTRAST_D13: Cid = 'OWNCOOP+IF-D13|OWNCOOP-D13';
const TREAT_OF = Object.fromEntries(CONTRASTS.map((c) => [c, c.split('|')[0] as Arm])) as
  Record<Cid, Arm>;
const CTRL_OF = Object.fromEntries(CONTRASTS.map((c) => [c, c.split('|')[1] as Arm])) as
  Record<Cid, Arm>;
const CID_LABEL = Object.fromEntries(CONTRASTS.map((c) => [c,
  `${TREAT_OF[c]} vs ${CTRL_OF[c]} (control = ${CTRL_OF[c]})`])) as Record<Cid, string>;
const ARMS_KIND_OK = ARM_KIND['HATS-E13'] === 'HATS'
  && ARM_KIND['OWNCOOP-E13'] === 'OWNCOOP'
  && ARM_KIND['OWNCOOP+IF-E13'] === 'OWNCOOP+IF'
  && ARM_KIND['OWNCOOP+IF-D13'] === 'OWNCOOP+IF'
  && IF_ARMS.length === 2 && NON_IF_ARMS.length === 3
  && ARMS.length === 5 && CONTRASTS.length === 4
  && CONTRASTS.every((c) => (ARMS as readonly string[]).includes(TREAT_OF[c])
    && (ARMS as readonly string[]).includes(CTRL_OF[c]) && TREAT_OF[c] !== CTRL_OF[c])
  && TREAT_OF[CONTRAST_OF_RECORD] === ARM_OF_RECORD
  && CTRL_OF[CONTRAST_OF_RECORD] === CONTROL_OF_RECORD
  && E13_ARMS.length === 3;

/* ---- THE SHIPPED DOSE LOADERS (the D13 arms), the DS-C0 form ---- */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('IF-T1b FATAL — a dose file\'s BYTES do not match the pinned value');
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
  banner(`IF-T1b FATAL — the D13 arms are not reachable: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}

/** ⭐⭐ THE MATRIX RECEIPTS, KEPT AS NEGATIVES: with the seat absent on every arm NO 16-slot
 *  matrix exists anywhere, and `info.genome` carries none either. Both are asserted FALSE /
 *  CLEAN on every walked match — the positive form of "no dose". */
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
/** ⭐⭐ THE ARM CONSTRUCTION. `HATS-E13` is DS-C0's `buildMatch(seed, 'E13')` BYTE FOR BYTE — the
 *  composer CALLED, the flag set NEVER copied — and it is DS-T1c's `HATS-E13-ABSENT` too, which
 *  is what makes the cross-stage re-walks possible. `OWNCOOP-E13` is world 17's own door set
 *  and IF-C0's and IF-T1's arm of that name; `OWNCOOP+IF-E13` adds the flight door. On D13 the
 *  SHIPPED loaders'
 *  dose rides through `armA4World` exactly as DS-C0's D13 arm took it. ⛔ NO `obmMovement`. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const kind = ARM_KIND[arm];
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(BQ_WORLD_VERSION),
    ...(kind !== 'HATS' ? { dsOwnRun: true, dsHatsOff: true, dsCoopHatsOff: true } : {}),
    ...(kind === 'OWNCOOP+IF' ? { ifFlightRun: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (ARM_BOOK[arm] === 'D13') armA4World(m, null, BQ_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, BQ_WORLD_VERSION);
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
  'overlapping', 'keeperUp', 'ownRunInBehind', 'ownRunOntoFlight', 'noWhyRecorded',
  'OTHER'] as const;
type RunClass = (typeof RUN_CLASSES)[number];
const RCI = (c: RunClass): number => RUN_CLASSES.indexOf(c);
const RUN_CLASSES_NAMED: readonly RunClass[] = ['licensedRunInBehind', 'arrivingLate',
  'attackingTheBox', 'oneTwoBurst', 'overlapping', 'keeperUp', 'ownRunInBehind',
  'ownRunOntoFlight'];
/** ⭐⭐⭐ THE TENTH CELL — the EIGHTH `why`, its own class (#420 item 2(ii)). */
const IF_CLASS: RunClass = 'ownRunOntoFlight';
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
  if (why === WHY_IF) return 'ownRunOntoFlight';
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
/** ⭐⭐⭐ THE EIGHTH CLASS'S START-STATE PARTITION (#420 item 2(ii)) — read off the runner's OWN
 *  perceived ball at the tick his eighth-`why` run STARTS. The ball he SEES has no owner by
 *  construction; this partition says whether it is STILL (a loose ball) or MOVING (a ball in the
 *  air). ⚠ `|vel| > 0` IS A STORED PARTITION, NEVER A GATE — no read word depends on it. */
const BALL_MOTION = ['noBallSeen', 'loose', 'inTheAir'] as const;
type BallMotion = (typeof BALL_MOTION)[number];
const BMI = (c: BallMotion): number => BALL_MOTION.indexOf(c);
const ballMotionOf = (seen: boolean, speed: number): BallMotion => {
  if (!seen) return 'noBallSeen';
  return speed > 0 ? 'inTheAir' : 'loose';
};
/** ⭐⭐⭐ THE MEMORY PARTITION — whose gid `match.ifLastSeenOwnerGid` holds for this body at the
 *  eighth state's own start tick: the LAST PASSER (the body the engine's aim ledger names) or
 *  ANOTHER MATE. A REGISTERED LEDGER READ (registered at IF-T1; registry 87 of record here). */
const MEMORY_CELLS = ['noMemory', 'theLastPasser', 'anotherMate'] as const;
type MemoryCell = (typeof MEMORY_CELLS)[number];
const MMI = (c: MemoryCell): number => MEMORY_CELLS.indexOf(c);
const memoryCellOf = (remembered: number | null, passerGid: number | null): MemoryCell => {
  if (remembered === null) return 'noMemory';
  if (passerGid !== null && remembered === passerGid) return 'theLastPasser';
  return 'anotherMate';
};
/** ⭐⭐⭐ ⭐ AMENDMENT (#423 item 3(i)) — THE EIGHTH CLASS'S START STATE **BY PHASE**: M-IF.5
 *  requires `match.phase === 'playing'`, so this partition is expected to read 1.000000
 *  `playing` BY CONSTRUCTION. It is STORED AND ENUMERATED as a receipt of M-IF.5 and is
 *  ⛔ NEVER NARRATED as a finding and NEVER a gate — a partition, like `|vel| > 0`. */
const PHASE_CELLS = ['playing', 'notPlaying'] as const;
type PhaseCell = (typeof PHASE_CELLS)[number];
const PHI = (c: PhaseCell): number => PHASE_CELLS.indexOf(c);
const phaseCellOf = (phase: string): PhaseCell => (phase === 'playing' ? 'playing'
  : 'notPlaying');
/** ⭐⭐⭐ ⭐ AMENDMENT (#423 item 3(i)) — THE EIGHTH CLASS'S START STATE **BY LOOK DISTANCE**:
 *  the distance between the look that WROTE his belief and the look he is taking NOW
 *  (`thisLook − belief.look`). M-IF.6 admits the eighth state ONLY at distance 1, so this
 *  partition is expected to read 1 BY CONSTRUCTION — A STORED RECEIPT OF M-IF.6, ⛔ never
 *  narrated, ⛔ never a gate. `noMemory` covers a body with no belief entry at all. */
const LOOK_DISTANCE_CELLS = ['noMemory', 'distance1', 'distanceOther'] as const;
type LookDistanceCell = (typeof LOOK_DISTANCE_CELLS)[number];
const LDI = (c: LookDistanceCell): number => LOOK_DISTANCE_CELLS.indexOf(c);
const lookDistanceOf = (thisLook: number | null, beliefLook: number | null):
LookDistanceCell => {
  if (thisLook === null || beliefLook === null) return 'noMemory';
  return thisLook - beliefLook === 1 ? 'distance1' : 'distanceOther';
};
/** ⭐⭐ IF-C0's Δt BINS, FROZEN EX ANTE and copied BY FIELD NAME. Δt = (the release this run is
 *  attached to) − (the run's start). NEGATIVE ⇒ the release came FIRST — a run onto a ball
 *  ALREADY TRAVELLING. THE ATTACHMENT RULE, IF-C0's own: a same-side `pendingPass` ALREADY LIVE
 *  at the run-start tick IS the attached release (⇒ Δt < 0); otherwise the NEXT release by his
 *  side (⇒ Δt > 0); a run with neither is counted in `noAttachedRelease` and is NOT binned. */
const DT_BINS = ['ltMinus1.0', 'minus1.0toMinus0.5', 'minus0.5to0', '0to0.5', '0.5to1.0',
  '1.0to2.0', 'ge2.0'] as const;
const DT_BIN_EDGES = [-1.0, -0.5, 0, 0.5, 1.0, 2.0] as const;
const dtBin = (v: number): number => {
  for (let i = 0; i < DT_BIN_EDGES.length; i++) if (v < DT_BIN_EDGES[i]) return i;
  return DT_BIN_EDGES.length;
};
const DT_NEGATIVE_BINS = 3;
/** ⭐⭐ IF-C0's RECEIVER CLASS at a completed pass (its population F / Q4). */
const RECEIVER_CLASSES = ['runningAtRelease', 'startedDuringTheFlight', 'neither'] as const;
type ReceiverClass = (typeof RECEIVER_CLASSES)[number];
const RVI = (c: ReceiverClass): number => RECEIVER_CLASSES.indexOf(c);
const receiverClassOf = (atRelease: boolean, duringFlight: boolean): ReceiverClass => {
  if (atRelease) return 'runningAtRelease';
  if (duringFlight) return 'startedDuringTheFlight';
  return 'neither';
};
/** ⭐⭐ IF-C0's PERCEIVED-OWNER CELLS and its LEAK partition, copied BY FIELD NAME. */
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
const LEAK_CELLS = ['stalePasserStillCredited', 'aFreshMateWhoIsNotThePasser',
  'anythingElse'] as const;
type LeakCell = (typeof LEAK_CELLS)[number];
const LKI = (c: LeakCell): number => LEAK_CELLS.indexOf(c);
const leakCellOf = (perceived: PerceivedK, ownerGid: number | null,
  passerGid: number | null): LeakCell => {
  if (perceived !== 'ownerIsMate') return 'anythingElse';
  if (passerGid !== null && ownerGid === passerGid) return 'stalePasserStillCredited';
  return 'aFreshMateWhoIsNotThePasser';
};
/** ⭐⭐ IF-C0's TOWARD-HIM test — the closing-speed sign along ball→runner. */
const towardHim = (bvx: number, bvy: number, dx: number, dy: number): boolean => {
  const d = Math.hypot(dx, dy);
  if (d === 0) return false;
  return (bvx * dx + bvy * dy) / d > 0;
};
const REL_RUNNER_BINS = 5;
/** ⭐⭐⭐ THE INTENDED-RECEIVER PREDICATE — IF-C0's own, and the ONE its census could not
 *  fixture (#416 item 3(i)). IT IS FIXTURED HERE, and the fixture is not this instrument's
 *  invention: `tests/ifFlightRun.test.ts` carries a FIRING and a NON-FIRING case written at
 *  IF-T0, and both titles are ANCHORED in this file so the citation cannot drift. The walk-side
 *  form is an IDENTITY TEST on the engine's OWN aim ledger: the live `pendingPass` names HIM. */
const intendedReceiverOf = (targetGid: number | null, hisGid: number): boolean =>
  targetGid !== null && targetGid === hisGid;

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
/** ⭐⭐⭐ DS-T1c — THE OWN-RUN CANDIDATE'S BACK-OUT. DS-T0c's arithmetic is
 *  `s = ((W.runScore · prior) · restraint) · (tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul`
 *  (§LAW-B, anchored), with `obmRunMul` applied LAST — so the STORED SCORE over
 *  `W.runScore · prior · tiredMul` is EXACTLY `restraint · obmRunMul`.
 *  ⭐ On a seat-ABSENT arm `obmRunMul` is EXACTLY 1 by construction, and THERE this back-out IS
 *  the restraint. On a DOSED arm it is the PRODUCT, and the field name says so (canon:
 *  unit-name truth) — §DEVIATIONS and §HONEST LIMITS carry the consequence. */
const ownScoreBackOut = (
  score: number, runScoreW: number, prior: number, tired: boolean,
): number => ratio(score, runScoreW * prior * (tired ? OFFBALL_TIRED_MUL : 1));
/** ⭐⭐⭐ DS-T0c'S RANK RESTRAINT, RECONSTRUCTED WALK-SIDE (canon: *walk-side definitions pinned*
 *  — a headline-bearing predicate needs a composition fixture as well as an anchored source
 *  line). `restraint = clamp01(count − rankAbove) ∈ {0, 1}`: 1 for the top `count` bodies he can
 *  SEE, 0 for the rest. ⛔ This is NOT used to observe anything — `rankAbove` needs the snapshot
 *  and the snapshot cannot be read byte-inertly. It exists so the law's SHAPE is fixtured, and
 *  so the {0, 1} claim the seam faces stand on is a pinned definition rather than a sentence. */
const restraintFromRank = (count: number, rankAbove: number): number =>
  clamp01(count - rankAbove);
/** ⭐⭐⭐ THE COACH'S OWN COMPARATOR, RECONSTRUCTED — `b.s - a.s || a.p.index - b.p.index` with
 *  himself as one side: a mate outranks him when his ranking is HIGHER, or EQUAL with a LOWER
 *  roster index. Fixtured both ways and in both tie directions. */
const outranksRecon = (theirs: number, mine: number, mateIndex: number,
  myIndex: number): boolean => theirs > mine || (theirs === mine && mateIndex < myIndex);
/** ⭐⭐⭐ THE OBSERVABLE THE RANK LAW LEAVES: `restraint === 1` ⇔ `rankAbove < count`. The EXACT
 *  rank is NOT recoverable from a score (every non-zero score carries restraint 1, and every
 *  zero score is either restraint 0 or a zero prior), so this equivalence — and NOT a rank
 *  distribution — is what the artifact publishes, DECLARED as such. */
const RANK_BELOW_COUNT_EQUIVALENCE = '`restraint === 1` ⇔ `rankAbove < count` (M-DS.6″(c): '
  + '`clamp01(count − rankAbove)` is 1 exactly when `count − rankAbove ≥ 1`). ⛔ THE EXACT '
  + '`rankAbove` IS NOT RECOVERABLE FROM A SCORE — the back-out yields the restraint, which is a '
  + 'STEP, so this instrument publishes the OBSERVABLE `rankBelowCount` share and NO rank '
  + 'distribution.';
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
fx('hatClass.theEIGHTHAlsoLandsInOTHERInTheMIRROR', hatClassOf(WHY_IF), 'OTHER');
fx('hatClass.noWhyRecordedCanFire', hatClassOf(null), 'noWhyRecorded');
/* ⭐⭐⭐ THIS EXAM'S NINE-CELL classifier — every class, each with a negative */
fx('runClass.licensedRunInBehind', runClassOf(WHY_LICENSED), 'licensedRunInBehind');
fx('runClass.arrivingLate', runClassOf(WHY_ARRIVING), 'arrivingLate');
fx('runClass.attackingTheBox', runClassOf(WHY_BOX), 'attackingTheBox');
fx('runClass.oneTwoBurst', runClassOf(WHY_BURST), 'oneTwoBurst');
fx('runClass.overlapping', runClassOf(WHY_OVERLAP), 'overlapping');
fx('runClass.keeperUp', runClassOf(WHY_KEEPERUP), 'keeperUp');
fx('runClass.ownRunInBehindIsITSOWNCLASS', runClassOf(WHY_OWN), 'ownRunInBehind');
fx('runClass.ownRunOntoFlightIsTheTENTHCELL', runClassOf(WHY_IF), 'ownRunOntoFlight');
fx('runClass.theEIGHTHLiteralIsEXTRACTEDNotTyped', WHY_IF, 'own run onto the flight');
fx('runClass.theSEVENTHAndTheEIGHTHAreDIFFERENTCells',
  runClassOf(WHY_OWN) === runClassOf(WHY_IF), false);
fx('runClass.anEDITEDEighthLiteralIsOTHER', runClassOf(WHY_IF.replace('onto', 'into')), 'OTHER');
fx('runClass.thereAreTENCells', RUN_CLASSES.length, 10);
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
/* ⭐⭐⭐ THE EIGHTH CLASS'S START-STATE PARTITION — every cell, each with a negative */
fx('ballMotion.aBallHeSEESSTANDINGStillIsLOOSE', ballMotionOf(true, 0), 'loose');
fx('ballMotion.aBallHeSEESMOVINGIsINTHEAIR', ballMotionOf(true, 1e-9), 'inTheAir');
fx('ballMotion.noBallSeenIsITSOWNCell', ballMotionOf(false, 5), 'noBallSeen');
fx('ballMotion.theCellsPartition', new Set(BALL_MOTION.map((c) => c as string)).size,
  BALL_MOTION.length);
fx('memory.anEMPTYMemoryIsNOMEMORY', memoryCellOf(null, 8), 'noMemory');
fx('memory.theREMEMBEREDPasserIsTHELASTPASSER', memoryCellOf(8, 8), 'theLastPasser');
fx('memory.aDIFFERENTMateIsANOTHERMATE', memoryCellOf(9, 8), 'anotherMate');
fx('memory.noPasserAtAllMakesAnyMemoryANOTHERMATE', memoryCellOf(9, null), 'anotherMate');
fx('memory.theCellsPartition', new Set(MEMORY_CELLS.map((c) => c as string)).size,
  MEMORY_CELLS.length);
/* ⭐ AMENDMENT — THE TWO NEW PARTITIONS' OWN FIXTURES (each with a firing and a non-firing) */
fx('phasePartition.aLIVEGameIsPLAYING', phaseCellOf('playing'), 'playing');
fx('phasePartition.aRESTARTIsNOTPLAYING', phaseCellOf('restart'), 'notPlaying');
fx('phasePartition.aKICKOFFIsNOTPLAYING', phaseCellOf('kickoff'), 'notPlaying');
fx('phasePartition.theCellsPartition', new Set(PHASE_CELLS.map((c) => c as string)).size,
  PHASE_CELLS.length);
fx('lookDistance.theIMMEDIATELYPreviousLookIsDISTANCE1', lookDistanceOf(7, 6), 'distance1');
fx('lookDistance.TWOLooksAgoIsDISTANCEOTHER', lookDistanceOf(7, 5), 'distanceOther');
fx('lookDistance.THISLooksOwnWriteIsDISTANCEOTHER', lookDistanceOf(7, 7), 'distanceOther');
fx('lookDistance.anEMPTYBeliefIsNOMEMORY', lookDistanceOf(7, null), 'noMemory');
fx('lookDistance.anABSENTCounterIsNOMEMORY', lookDistanceOf(null, 6), 'noMemory');
fx('lookDistance.theCellsPartition',
  new Set(LOOK_DISTANCE_CELLS.map((c) => c as string)).size, LOOK_DISTANCE_CELLS.length);
/* ⭐⭐ IF-C0's Δt BINS — every boundary, from both sides */
fx('dt.wellBeforeTheRunIsTheFIRSTBin', dtBin(-4), 0);
fx('dt.exactlyMinus1IsTheSECONDBin', dtBin(-1.0), 1);
fx('dt.exactlyMinus0point5IsTheTHIRDBin', dtBin(-0.5), 2);
fx('dt.exactlyZEROIsThePOSITIVESide', dtBin(0), 3);
fx('dt.aHairBELOWZeroIsTheNEGATIVESide', dtBin(-1e-9), 2);
fx('dt.exactly2point0IsTheOPENTopBin', dtBin(2.0), 6);
fx('dt.thereAreSEVENBins', DT_BINS.length, 7);
fx('dt.theNEGATIVEHalfIsTheFIRSTTHREEBins', DT_NEGATIVE_BINS, 3);
fx('dt.theBinsPartitionTheLine',
  [-2, -0.75, -0.25, 0.25, 0.75, 1.5, 5].map(dtBin), [0, 1, 2, 3, 4, 5, 6]);
/* ⭐⭐ IF-C0's RECEIVER CLASS */
fx('receiver.runningAtRelease', receiverClassOf(true, false), 'runningAtRelease');
fx('receiver.startedDuringTheFlight', receiverClassOf(false, true), 'startedDuringTheFlight');
fx('receiver.neither', receiverClassOf(false, false), 'neither');
fx('receiver.atReleaseWINSOverDuringFlight', receiverClassOf(true, true), 'runningAtRelease');
/* ⭐⭐ IF-C0's PERCEIVED-OWNER CELLS and LEAK partition */
const PV = (o: Partial<PerceivedInputs>): PerceivedInputs => ({
  snapshotNull: false, ballNull: false, ownerGid: null, selfGid: 7, mateGids: [8, 9], ...o,
});
fx('perceived.noSnapshot', perceivedOwnerOf(PV({ snapshotNull: true })), 'noSnapshot');
fx('perceived.noBallSeen', perceivedOwnerOf(PV({ ballNull: true })), 'noBallSeen');
fx('perceived.ownerNullISAPerceivedFlight', perceivedOwnerOf(PV({})), 'ownerNull');
fx('perceived.ownerIsSelf', perceivedOwnerOf(PV({ ownerGid: 7 })), 'ownerIsSelf');
fx('perceived.ownerIsMate', perceivedOwnerOf(PV({ ownerGid: 8 })), 'ownerIsMate');
fx('perceived.ownerIsOpponent', perceivedOwnerOf(PV({ ownerGid: 44 })), 'ownerIsOpponent');
fx('leak.theSTALEPasserStillCredited', leakCellOf('ownerIsMate', 8, 8),
  'stalePasserStillCredited');
fx('leak.aFRESHMateWhoIsNotThePasser', leakCellOf('ownerIsMate', 9, 8),
  'aFreshMateWhoIsNotThePasser');
fx('leak.aPerceivedFLIGHTIsANYTHINGELSE', leakCellOf('ownerNull', null, 8), 'anythingElse');
fx('leak.anOPPONENTReadIsANYTHINGELSE', leakCellOf('ownerIsOpponent', 44, 8), 'anythingElse');
/* ⭐⭐ TOWARD HIM */
fx('toward.aBallFlyingATHimIsTOWARD', towardHim(1, 0, 5, 0), true);
fx('toward.aBallFlyingAWAYIsNOT', towardHim(-1, 0, 5, 0), false);
fx('toward.aZeroSeparationIsNOT', towardHim(1, 0, 0, 0), false);
/* ⭐⭐⭐ THE INTENDED-RECEIVER PREDICATE — FIXTURED (#416 item 3(i), discharged at IF-T0) */
fx('intendedReceiver.theAimNAMESHim', intendedReceiverOf(7, 7), true);
fx('intendedReceiver.theAimNAMESAMate_notHim', intendedReceiverOf(8, 7), false);
fx('intendedReceiver.noAimAtAllIsNOT', intendedReceiverOf(null, 7), false);
fx('intendedReceiver.theSUITESFiringCaseIsCITEDByTitle',
  SRC_OF[IFT0_TEST_PATH].includes(IFT0_INTENDED_FIRING_TITLE), true);
fx('intendedReceiver.theSUITESNonFiringCaseIsCITEDByTitle',
  SRC_OF[IFT0_TEST_PATH].includes(IFT0_INTENDED_NONFIRING_TITLE), true);
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
/* ⭐⭐⭐ NO DOSE — the negative, stated as a FIXTURE that can FIRE both ways */
fx('noDose.theSeatIsABSENTOnEVERYArm',
  ARMS.map((a) => ARM_DOSED[a]), [false, false, false, false, false]);
fx('noDose.theDeclarationAgreesWithTheArmTable',
  OBM_SEAT_ABSENT_ON_EVERY_ARM && ARMS.every((a) => !ARM_DOSED[a]), true);
fx('noDose.aDOSEDArmWouldBeCAUGHTByTheSameConjunct',
  [...ARMS.map((a) => ARM_DOSED[a]), true].every((d) => !d), false);
/* ⭐⭐⭐ THE ARM TABLE and THE CONTRAST TABLE — each able to fail */
fx('arms.theFIVEArmsAndTheirFlagKinds',
  ARMS.map((a) => ARM_KIND[a]),
  ['HATS', 'OWNCOOP', 'OWNCOOP+IF', 'OWNCOOP', 'OWNCOOP+IF']);
fx('arms.theFLIGHTDoorIsCarriedByEXACTLYTwoArms', IF_ARMS.length, 2);
fx('arms.theCONTROLOfRecordDoesNOTCarryTheFlightDoor',
  ARM_CARRIES_IF[CONTROL_OF_RECORD], false);
fx('arms.theARMOfRecordDOESCarryIt', ARM_CARRIES_IF[ARM_OF_RECORD], true);
fx('arms.theTableIsWELLFORMED', ARMS_KIND_OK, true);
fx('contrast.theCOMPARISONOFRECORDIsTheCANDIDATEvsWORLD17OnE13',
  [TREAT_OF[CONTRAST_OF_RECORD], CTRL_OF[CONTRAST_OF_RECORD]],
  ['OWNCOOP+IF-E13', 'OWNCOOP-E13']);
fx('contrast.theBESIDETableIsHATSAsITSOWNControl',
  [TREAT_OF[CONTRAST_HATS_VS_CANDIDATE], CTRL_OF[CONTRAST_HATS_VS_CANDIDATE]],
  ['OWNCOOP+IF-E13', 'HATS-E13']);
fx('contrast.aSELFContrastWouldBeCAUGHT',
  ['X|X'].every((c) => c.split('|')[0] !== c.split('|')[1]), false);
/* ⭐⭐⭐ THE RESTRAINT BACK-OUT — both ways, and the DOSED case named for what it is */
fx('restraint.identityWhenNOBODYRuns',
  near(ownScoreBackOut(0.7 * 0.5 * 1, 0.7, 0.5, false), 1), true);
fx('restraint.theBackOutsALGEBRARecoversANYFactor_evenOneTheRANKLawCannotProduce',
  near(ownScoreBackOut(0.7 * 0.5 * 0.5, 0.7, 0.5, false), 0.5), true);
fx('restraint.underTheRANKLawTheOnlyTwoValuesAreZEROandONE_aStoredRECEIPT',
  [ownScoreBackOut(0.7 * 0.5 * restraintFromRank(2, 0), 0.7, 0.5, false),
    ownScoreBackOut(0.7 * 0.5 * restraintFromRank(2, 2), 0.7, 0.5, false)], [1, 0]);
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
/* ⭐⭐⭐ DS-T0c's RANK RESTRAINT — the STEP, stated both ways, and the CAP's two arms */
fx('rank.nobodyOutranksHimSoHeIsLICENSED', restraintFromRank(1, 0), 1);
fx('rank.theCOUNTthBodyIsSTILLLicensed', restraintFromRank(3, 2), 1);
fx('rank.oneTOOMANYAboveHimIsZERO', restraintFromRank(1, 1), 0);
fx('rank.theCOUNTPLUSONEthBodyIsZERO', restraintFromRank(3, 3), 0);
fx('rank.wellOutsideTheCutIsSTILLExactlyZERO_theClampsLOWERArm',
  restraintFromRank(2, 5), 0);
fx('rank.theRestraintIsAlwaysEXACTLYZEROorONE_neverBetween', (() => {
  const vals = new Set<number>();
  for (let c = 1; c <= 3; c++) for (let ra = 0; ra <= 5; ra++) vals.add(restraintFromRank(c, ra));
  return [...vals].sort();
})(), [0, 1]);
fx('rank.aLICENSEDBodyScoresEXACTLYDST1sNumber_becauseXTIMES1IsX',
  0.7 * 0.5 * restraintFromRank(2, 0) === 0.7 * 0.5, true);
fx('rank.comparator.aHIGHERRankingOutranksHim', outranksRecon(1.9, 1.2, 4, 1), true);
fx('rank.comparator.aLOWERRankingDoesNOT', outranksRecon(0.9, 1.2, 0, 5), false);
fx('rank.comparator.anEQUALRankingWithALOWERIndexDOES',
  outranksRecon(1.2, 1.2, 1, 4), true);
fx('rank.comparator.anEQUALRankingWithAHIGHERIndexDoesNOT',
  outranksRecon(1.2, 1.2, 4, 1), false);
fx('rank.comparator.anEQUALRankingWithTHESAMEIndexDoesNOT_heIsNeverHisOwnRival',
  outranksRecon(1.2, 1.2, 3, 3), false);
fx('rank.comparator.itIsTheCOACHSOWNSortPredicateOnAGrid', (() => {
  const rows = [{ s: 2.2, i: 0 }, { s: 1.8, i: 3 }, { s: 1.2, i: 1 }, { s: 1.2, i: 4 },
    { s: 0.4, i: 2 }];
  const sorted = [...rows].sort((a, b) => b.s - a.s || a.i - b.i);
  return rows.map((me) => sorted.findIndex((x) => x.i === me.i)
    === rows.filter((o) => o.i !== me.i && outranksRecon(o.s, me.s, o.i, me.i)).length);
})(), [true, true, true, true, true]);
fx('rank.theRankIsNOTRecoverableFromAScore_soNoRankDistributionIsPublished',
  RANK_BELOW_COUNT_EQUIVALENCE.includes('NOT RECOVERABLE FROM A SCORE'), true);
/* ⭐⭐⭐ THE ZERO-SCORE AMBIGUITY THE RANK LAW CREATES — restraint 0 OR a ZERO PRIOR (the DF
   clamp), separated by RECOMPUTING the prior from his own pos and role (no snapshot read) */
fx('priorZero.aDEEPDFPricesHisOwnRunAtEXACTLYZERO_theCLAMPSLowerArm',
  priorOf('DF', -31.5), 0);
fx('priorZero.aDFJUSTInsideTheClampIsABOVEZero', priorOf('DF', -17) > 0, true);
fx('priorZero.anSTOnTheOPPONENTSGoalLineIsEXACTLYONE', priorOf('ST', HALF_L), 1);
fx('priorZero.anMFAtTheHalfwayLineIsABOVEZero', priorOf('MF', 0) > 0, true);
fx('priorZero.aZEROPriorMakesTheBackOutUNDEFINED_notZero',
  Number.isFinite(ownScoreBackOut(0, 0.7, 0, false)), false);
fx('priorZero.aZEROPriorScoresZEROWhateverTheRestraintWas',
  [0.7 * 0 * 1, 0.7 * 0 * 0], [0, 0]);
fx('priorZero.withAPOSITIVEPriorAZeroScoreISRestraintZERO',
  ownScoreBackOut(0, 0.7, 0.5, false), 0);
fx('priorZero.withAPOSITIVEPriorAFullScoreISRestraintONE',
  ownScoreBackOut(0.7 * 0.5, 0.7, 0.5, false), 1);
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
/** ⭐⭐⭐ DS-T1c — THE SEAM'S OWN FROZEN BINS.
 *  `restraint` over [0, 1] in TEN equal cells (the law's own interval, §LAW-B), with the shares
 *  EXACTLY 0 and EXACTLY 1 stored SEPARATELY (the `x · 1 === x` identity makes the upper one
 *  IEEE-exact and the `clamp01` lower arm makes the lower one exact too).
 *  the OWN-candidate BACK-OUT over [0, 1 + OBM_SCORE_SPAN] — the restraint's own ceiling times
 *  the seat's own ceiling, the range DERIVED from the seat's span and never typed.
 *  ⭐ DS-T1c: the `runningMates` family is GONE with the velocity mass it inverted (§LAW-C); the
 *  restraint's TEN cells stay, and under the rank law only the FIRST and the LAST can fill
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
const COUNT_CELLS = 3;
const countCell = (c: number): number => (c <= 1 ? 0 : c >= COUNT_CELLS ? COUNT_CELLS - 1 : c - 1);
const ROLES4 = ['DF', 'MF', 'WG', 'ST'] as const;
const RI = (r: string): number => {
  const i = (ROLES4 as readonly string[]).indexOf(r);
  return i < 0 ? -1 : i;
};
const RUNKINDS = ['hat', 'own', 'ifFlight'] as const;
type RunKind = (typeof RUNKINDS)[number];
const RKI = (k: RunKind): number => RUNKINDS.indexOf(k);

interface Row {
  ticks: number; wallMs: number; signature: string;
  /* --- WORLD / ARM RECEIPTS --- */
  bqVersion: number; lnVersion: number; gkVersion: number;
  worldOk: boolean; edsChoiceOn: boolean; seamsAbsent: boolean; genomeClean: boolean;
  pcSeatPresent: boolean; pcHoldsReadable: boolean; pcHeldDecisionTicks: number;
  otherSeamsAbsent: boolean; dsOwnRunFlag: boolean; dsHatsOffFlag: boolean;
  dsCoopHatsOffFlag: boolean; ifFlightRunFlag: boolean; obmFlag: boolean;
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
  /* --- ⭐⭐⭐ THE EIGHTH CLASS: its own episode family, mirroring the seventh's --- */
  ifEpSets: number; ifEpTicks: number; ifEpTickBins: number[];
  ifEpPassAimed: number; ifEpPassCompleted: number; ifEpPassThrough: number;
  ifEpShots: number; ifEpGoals: number; ifEpActiveAtFullTime: number;
  /* --- ⭐⭐⭐ THE EIGHTH CLASS: the THREE PARTITIONS (#420 item 2(ii)) --- */
  ifStartBallMotion: number[]; ifStartMemoryCells: number[]; ifStartStateBins: number[];
  ifStartPhaseCells: number[]; ifStartLookDistanceCells: number[];
  ifCandidateVisible: number; ifRestraintN: number; ifRestraintSum: number;
  ifRestraintExactZero: number; ifRestraintExactOne: number; ifRestraintNeither: number;
  ifWhyDecisions: number; beliefEntriesAtFullTime: number; instrumentPulls: number;
  lookEntriesAtFullTime: number;
  /* --- ⭐⭐ IF-C0's Q4 FACES, copied BY FIELD NAME --- */
  runStartsAll: number; runStartsByClass: number[];
  runStartsInFlight: number; runStartsInFlightByClass: number[];
  runStartsInFlightOwnSidePass: number; runStartsInFlightIntended: number;
  runStartsInFlightToward: number;
  dtBinsByClass: number[]; dtAttachedLive: number; dtAttachedNext: number;
  dtNoAttachedRelease: number;
  releases: number; releaseRunnerBins: number[]; releaseRunnerSum: number;
  receiverClass: number[]; receiverIsIntended: number; receiverClassIntended: number[];
  completionsJoinedToAFlight: number;
  leakOwnRunsInFlight: number; leakCells: number[];
  perceivedCells: number[]; perceivedStamped: number; perceivedStale: number;
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
  /* --- ⭐⭐⭐ THE SEAM'S FACES (DS-T1c, the RANK LAW) — the guard population, the PRIOR SPLIT
     and the BACK-OUT --- */
  unhattedOffBallTicksPost: number; unhattedOffBallTicksPre: number;
  ownCandidateVisible: number; ownCandidateOutsidePostGuard: number;
  countSum: number; countBins: number[];
  ownBackOutN: number; ownBackOutSum: number; ownBackOutBins: number[];
  ownBackOutBelowOne: number; ownBackOutAboveOne: number; ownBackOutAtOne: number;
  restraintN: number; restraintSum: number; restraintBins: number[];
  restraintExactZero: number; restraintExactOne: number; restraintNeitherZeroNorOne: number;
  ownCandidatePriorZero: number; ownCandidatePriorAbove: number;
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
  otherSeamsAbsent: false, dsOwnRunFlag: false, dsHatsOffFlag: false,
  dsCoopHatsOffFlag: false, ifFlightRunFlag: false, obmFlag: false,
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
  ifEpSets: 0, ifEpTicks: 0, ifEpTickBins: zeros(EPW_BINS),
  ifEpPassAimed: 0, ifEpPassCompleted: 0, ifEpPassThrough: 0,
  ifEpShots: 0, ifEpGoals: 0, ifEpActiveAtFullTime: 0,
  ifStartBallMotion: zeros(BALL_MOTION.length), ifStartMemoryCells: zeros(MEMORY_CELLS.length),
  ifStartStateBins: zeros(STATES.length),
  ifStartPhaseCells: zeros(PHASE_CELLS.length),
  ifStartLookDistanceCells: zeros(LOOK_DISTANCE_CELLS.length),
  ifCandidateVisible: 0, ifRestraintN: 0, ifRestraintSum: 0,
  ifRestraintExactZero: 0, ifRestraintExactOne: 0, ifRestraintNeither: 0,
  ifWhyDecisions: 0, beliefEntriesAtFullTime: 0, instrumentPulls: 0,
  lookEntriesAtFullTime: 0,
  runStartsAll: 0, runStartsByClass: zeros(RUN_CLASSES.length),
  runStartsInFlight: 0, runStartsInFlightByClass: zeros(RUN_CLASSES.length),
  runStartsInFlightOwnSidePass: 0, runStartsInFlightIntended: 0, runStartsInFlightToward: 0,
  dtBinsByClass: zeros(DT_BINS.length * RUN_CLASSES.length),
  dtAttachedLive: 0, dtAttachedNext: 0, dtNoAttachedRelease: 0,
  releases: 0, releaseRunnerBins: zeros(REL_RUNNER_BINS), releaseRunnerSum: 0,
  receiverClass: zeros(RECEIVER_CLASSES.length), receiverIsIntended: 0,
  receiverClassIntended: zeros(RECEIVER_CLASSES.length),
  completionsJoinedToAFlight: 0,
  leakOwnRunsInFlight: 0, leakCells: zeros(LEAK_CELLS.length),
  perceivedCells: zeros(PERCEIVED.length), perceivedStamped: 0, perceivedStale: 0,
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
  restraintExactZero: 0, restraintExactOne: 0, restraintNeitherZeroNorOne: 0,
  ownCandidatePriorZero: 0, ownCandidatePriorAbove: 0,
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
  dsOwnRun?: boolean; dsHatsOff?: boolean; dsCoopHatsOff?: boolean;
  ifFlightRun?: boolean;
  /** ⭐ AMENDMENT (M-IF.6): the belief is now a RECORD carrying the LOOK INDEX that wrote it. */
  ifLastSeenOwnerGid?: Map<number, { ownerGid: number; look: number }>;
  /** ⭐ AMENDMENT (M-IF.6): the per-body LOOK COUNTER. READ, never written, by this probe. */
  ifLook?: Map<number, number>;
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
  row.dsCoopHatsOffFlag = mm.dsCoopHatsOff === true;
  row.ifFlightRunFlag = mm.ifFlightRun === true;
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
  /* ⭐⭐⭐ THE EIGHTH CLASS'S OWN EPISODE state */
  const ifActive = new Array<boolean>(n).fill(false);
  const ifWindowEnd = new Array<number>(n).fill(-1);
  const ifRunTicks = zeros(n);
  /* ⭐⭐ IF-C0's POPULATION R — EVERY run episode, stamped at its START tick */
  const runActiveAll = new Array<boolean>(n).fill(false);
  const mateGids: number[][] = [
    m.teams[0].players.map((q) => q.gid), m.teams[1].players.map((q) => q.gid)];
  const armPulls = ARM_KIND[arm] !== 'HATS';
  const beliefMap = mm.ifLastSeenOwnerGid ?? null;
  /** ⭐ AMENDMENT — THE LOOK COUNTER, READ (never written) for the LOOK-DISTANCE partition.
   *  Registry 87 → 88 (`gLedgerRead`). */
  const lookMap = mm.ifLook ?? null;
  interface LiveFlight {
    key: string; side: Side; passerGid: number; targetGid: number;
    atRelease: Set<number>; during: Set<number>;
  }
  let liveFlight: LiveFlight | null = null;
  const awaitingRuns: { side: Side; t: number; why: number }[] = [];
  let prevInterceptions: number[] = [0, 0];
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
    prevInterceptions = [m.teams[0].stats.interceptions, m.teams[1].stats.interceptions];
    /* ⭐⭐ IF-C0's own PRE-STEP flight reads: the aim ledger and the ball's truth motion */
    const ppBefore = m.pendingPass;
    const ballXBefore = m.ball.pos.x; const ballYBefore = m.ball.pos.y;
    const ballVxBefore = m.ball.vel.x; const ballVyBefore = m.ball.vel.y;

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
      /* ⭐⭐⭐ DS-T1c — THE SEAM'S OWN GUARD POPULATION AND THE BACK-OUTS, on EVERY attacking
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
          /* ⭐⭐⭐ THE PRIOR, RECOMPUTED FROM HIS OWN POS AND ROLE — reads NO snapshot, so it
           * stays byte-inert. It is what SEPARATES the rank law's two ways to score zero: a
           * restraint of 0 (he is outside the coach's cut) and a ZERO PRIOR (the DF clamp — a
           * defender deep in his own half). At a zero prior the back-out's denominator is zero
           * and the restraint is NOT RECOVERABLE; that population is counted, never imputed. */
          const pr = priorOf(p.role as Role, teamP.localX(preX[i]));
          if (pr === 0) row.ownCandidatePriorZero += 1;
          else row.ownCandidatePriorAbove += 1;
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
            {
              /* ⭐ the seat is ABSENT on every arm, so `obmRunMul` is EXACTLY 1 and this
               * back-out IS the restraint on every arm (rule (h)). */
              row.restraintN += 1; row.restraintSum += prod;
              row.restraintBins[unitBin(prod)] += 1;
              if (prod === 0) row.restraintExactZero += 1;
              else if (prod === 1) row.restraintExactOne += 1;
              else row.restraintNeitherZeroNorOne += 1;
            }
          }
        }
        /* ⭐⭐⭐ THE EIGHTH CLASS'S OWN RESTRAINT PARTITION (#419 item 3's face): the SAME
         * back-out taken on the candidate carrying the EIGHTH `why`. In that state nobody is
         * skipped by the rank loop, so the body he REMEMBERS with the ball is ranked like any
         * mate — that is the law, and THIS partition is its consequence. */
        let ifScore = Number.NaN;
        for (const sc of p.action.scores) {
          if (sc.action === 'MakeRun' && sc.why === WHY_IF) { ifScore = sc.score; break; }
        }
        if (Number.isFinite(ifScore)) {
          row.ifCandidateVisible += 1;
          const prIf = priorOf(p.role as Role, teamP.localX(preX[i]));
          const prodIf = ownScoreBackOut(ifScore, WP.runScore, prIf, isTiredP);
          if (Number.isFinite(prodIf)) {
            row.ifRestraintN += 1; row.ifRestraintSum += prodIf;
            if (prodIf === 0) row.ifRestraintExactZero += 1;
            else if (prodIf === 1) row.ifRestraintExactOne += 1;
            else row.ifRestraintNeither += 1;
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
      const isIf = rcls === IF_CLASS;
      const isHat = (HAT_CLASSES_NAMED_9 as readonly string[]).includes(rcls as string);
      if (isOwn || isIf || isHat) {
        const rk: RunKind = isIf ? 'ifFlight' : isOwn ? 'own' : 'hat';
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
          if (sc.why === WHY_OWN || sc.why === WHY_IF) {
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

    /* --- ⭐⭐⭐ POPULATION R (IF-C0's, copied BY FIELD NAME) — EVERY RUN EPISODE, STAMPED AT
       ITS START TICK: the truth state, the flight's provenance, Δt's attachment, and — on the
       arms carrying `dsOwnRun` — THE ONE DECLARED ADDED PERCEIVED READ. --- */
    const truthOwnerGid = m.ball.owner === null ? null : m.ball.owner.gid;
    for (let i = 0; i < n; i++) {
      const p = players[i];
      const side = p.side as Side;
      const runNow = (p.action.type as string) === 'MakeRun';
      const whyR = p.action.scores.length > 0 ? p.action.scores[0].why : null;
      const cls = runClassOf(whyR);
      const whyIdx = RCI(cls);
      if (runNow && !runActiveAll[i]) {
        const st = preState[i];
        row.runStartsAll += 1;
        row.runStartsByClass[whyIdx] += 1;
        const inFlightTruth = st === SI('ballInFlight');
        if (inFlightTruth) {
          row.runStartsInFlight += 1;
          row.runStartsInFlightByClass[whyIdx] += 1;
          if (ppBefore !== null && (ppBefore.side as Side) === side) {
            row.runStartsInFlightOwnSidePass += 1;
            if (intendedReceiverOf(ppBefore.targetGid, p.gid)) {
              row.runStartsInFlightIntended += 1;
            }
            if (towardHim(ballVxBefore, ballVyBefore, preX[i] - ballXBefore,
              preY[i] - ballYBefore)) row.runStartsInFlightToward += 1;
          }
        }
        /* ⭐⭐ Δt — IF-C0's ATTACHMENT RULE, frozen: a same-side `pendingPass` ALREADY LIVE
         * at the start tick IS the attached release (⇒ Δt < 0); otherwise the NEXT one. */
        if (ppBefore !== null && (ppBefore.side as Side) === side) {
          row.dtBinsByClass[dtBin(ppBefore.t - simTimeBefore) * RUN_CLASSES.length + whyIdx] += 1;
          row.dtAttachedLive += 1;
        } else {
          awaitingRuns.push({ side, t: simTimeBefore, why: whyIdx });
        }
        if (liveFlight !== null && liveFlight.side === side) liveFlight.during.add(p.gid);
        /* ⭐⭐⭐ THE ONE DECLARED ADDED READ — one `perceivedSnapshot` per OWN-RUN start tick on
         * an arm carrying `dsOwnRun`. It feeds IF-C0's LEAK PARTITION (the seventh class in
         * flight) and THE EIGHTH CLASS'S START-STATE PARTITION. ⚠ INERT: the snapshot draws no
         * rng and mutates nothing; `gLockstep` and `gPullCount` prove it. */
        if (armPulls && (cls === 'ownRunInBehind' || cls === IF_CLASS)) {
          const snap = m.perceivedSnapshot(p);
          row.instrumentPulls += 1;
          row.perceivedStamped += 1;
          const seenBall = snap === null ? null : snap.ball;
          const seenOwnerGid = seenBall === null ? null : seenBall.ownerGid;
          const cell = perceivedOwnerOf({
            snapshotNull: snap === null, ballNull: snap !== null && seenBall === null,
            ownerGid: seenOwnerGid, selfGid: p.gid, mateGids: mateGids[side],
          });
          row.perceivedCells[PCI(cell)] += 1;
          if (seenOwnerGid !== null && seenOwnerGid !== truthOwnerGid) row.perceivedStale += 1;
          /* IF-C0's LEAK PARTITION — the SEVENTH class started with the TRUTH ball in flight */
          if (cls === 'ownRunInBehind' && inFlightTruth) {
            row.leakOwnRunsInFlight += 1;
            row.leakCells[LKI(leakCellOf(cell, seenOwnerGid,
              ppBefore === null ? null : ppBefore.passerGid))] += 1;
          }
          /* ⭐⭐⭐ THE EIGHTH CLASS'S START-STATE PARTITION */
          if (cls === IF_CLASS) {
            const speed = seenBall === null ? 0
              : Math.hypot(seenBall.vel.x, seenBall.vel.y);
            row.ifStartBallMotion[BMI(ballMotionOf(seenBall !== null, speed))] += 1;
            row.ifStartStateBins[st] += 1;
            const belief = beliefMap === null ? null : (beliefMap.get(p.gid) ?? null);
            const remembered = belief === null ? null : belief.ownerGid;
            row.ifStartMemoryCells[MMI(memoryCellOf(remembered,
              ppBefore === null ? null : ppBefore.passerGid))] += 1;
            /* ⭐ AMENDMENT — BY PHASE (a receipt of M-IF.5) and BY LOOK DISTANCE (a receipt of
             * M-IF.6). Both are STORED PARTITIONS: no gate and no read word reads them. */
            row.ifStartPhaseCells[PHI(phaseCellOf(phaseBefore as string))] += 1;
            const thisLook = lookMap === null ? null : (lookMap.get(p.gid) ?? null);
            row.ifStartLookDistanceCells[LDI(lookDistanceOf(thisLook,
              belief === null ? null : belief.look))] += 1;
          }
        }
      }
      runActiveAll[i] = runNow;
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
      /* ⭐⭐⭐ THE EIGHTH CLASS'S OWN EPISODE — the same definition, the EIGHTH literal */
      const ifNow = (p.action.type as string) === 'MakeRun' && why === WHY_IF;
      if (ifNow && !ifActive[i]) { row.ifEpSets += 1; ifRunTicks[i] = 0; }
      if (ifNow) { row.ifEpTicks += 1; ifRunTicks[i] += 1; }
      if (!ifNow && ifActive[i]) {
        ifWindowEnd[i] = simTime + YIELD_WINDOW_SECONDS;
        row.ifEpTickBins[binOf(ifRunTicks[i], EPW_BIN, EPW_BINS)] += 1;
      }
      ifActive[i] = ifNow;
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
    /* ⭐⭐⭐ (a) A FLIGHT RESOLVES when its key leaves the aim ledger (IF-C0's own rule) — the
     * EVENTUAL RECEIVER'S CLASS is read here, off the two sets the flight carried. */
    if (liveFlight !== null && passKey !== liveFlight.key) {
      const lcR = m.lastCompletedPass;
      const completedKeyR = lcR === null ? ''
        : `${lcR.t}|${lcR.passerGid}|${lcR.receiverGid}`;
      const completedNow = lcR !== null && completedKeyR !== prevCompletedKey
        && lcR.passerGid === liveFlight.passerGid;
      if (completedNow && lcR !== null) {
        row.completionsJoinedToAFlight += 1;
        const rc2 = receiverClassOf(liveFlight.atRelease.has(lcR.receiverGid),
          liveFlight.during.has(lcR.receiverGid));
        row.receiverClass[RVI(rc2)] += 1;
        if (lcR.receiverGid === liveFlight.targetGid) {
          row.receiverIsIntended += 1;
          row.receiverClassIntended[RVI(rc2)] += 1;
        }
      }
      liveFlight = null;
    }
    if (pp !== null && passKey !== prevPassKey) {
      /* ⭐⭐ (b) A NEW RELEASE ENTERS THE LEDGER: the SAME-SIDE BODIES ALREADY RUNNING at it,
       * and the Δt RESOLUTION of every awaiting run of that side. */
      {
        const rside = pp.side as Side;
        const atRelease = new Set<number>();
        for (const q of m.teams[rside].players) {
          if (q.sentOff || q.role === 'GK') continue;
          const qi = idxOfGid.get(q.gid) ?? -1;
          if (qi >= 0 && runActiveAll[qi]) atRelease.add(q.gid);
        }
        row.releases += 1;
        row.releaseRunnerSum += atRelease.size;
        row.releaseRunnerBins[atRelease.size >= REL_RUNNER_BINS ? REL_RUNNER_BINS - 1
          : atRelease.size] += 1;
        liveFlight = { key: passKey, side: rside, passerGid: pp.passerGid,
          targetGid: pp.targetGid, atRelease, during: new Set<number>() };
        for (let q = awaitingRuns.length - 1; q >= 0; q--) {
          const aw = awaitingRuns[q];
          if (aw.side !== rside) continue;
          row.dtBinsByClass[dtBin(pp.t - aw.t) * RUN_CLASSES.length + aw.why] += 1;
          row.dtAttachedNext += 1;
          awaitingRuns.splice(q, 1);
        }
      }
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
        if (inYieldWindow(ifActive[ti], simTime, ifWindowEnd[ti])) {
          row.ifEpPassAimed += 1;
          if (throughNow) row.ifEpPassThrough += 1;
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
        if (inYieldWindow(ifActive[ri2], simTime, ifWindowEnd[ri2])) {
          row.ifEpPassCompleted += 1;
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
        if (inYieldWindow(ifActive[si], simTime, ifWindowEnd[si])) row.ifEpShots += 1;
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
        if (inYieldWindow(ifActive[gfi], simTime, ifWindowEnd[gfi])) row.ifEpGoals += 1;
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
  /* ---- ⭐⭐ the runs that never found a release, and the seam's own belief at full time ---- */
  row.dtNoAttachedRelease = awaitingRuns.length;
  row.beliefEntriesAtFullTime = beliefMap === null ? 0 : beliefMap.size;
  /* ⭐ AMENDMENT — THE LOOK COUNTER'S OWN SIZE AT FULL TIME (registry 88): live on the arms
   * carrying the door, EMPTY on every arm without it (`gArmIF`). */
  row.lookEntriesAtFullTime = lookMap === null ? 0 : lookMap.size;
  row.ifWhyDecisions = row.runClassTicks[RCI(IF_CLASS)]
    + row.keeperRunClassTicks[RCI(IF_CLASS)];
  /* ---- the EPISODES still ACTIVE at full time (DEBT (c)) ---- */
  for (let i = 0; i < n; i++) {
    for (let c = 0; c < EP_CLASSES.length; c++) if (hatActive[c][i]) row.epActiveAtFullTime[c] += 1;
    if (ownActive[i]) row.ownEpActiveAtFullTime += 1;
    if (ifActive[i]) row.ifEpActiveAtFullTime += 1;
  }
  /* ---- the GUARD FOLD — OBM-T1's own three lines, COPIED (anchored at §3) ---- */
  row.guardPairsTotal = gPairs.length;
  row.guardPairsUnder4 = gPairs.filter((v) => v < CLOSE_PAIR_M).length;
  row.guardU4N = gPairs.length > 0 ? 1 : 0;
  row.guardU4Sum = gPairs.length === 0 ? 0
    : gPairs.filter((v) => v < CLOSE_PAIR_M).length / gPairs.length;
  /* ---- the WORLD receipt, per arm ---- */
  const flagsAsDue = row.dsOwnRunFlag === (kind !== 'HATS')
    && row.dsHatsOffFlag === (kind !== 'HATS')
    && row.dsCoopHatsOffFlag === (kind !== 'HATS')
    && row.ifFlightRunFlag === ARM_CARRIES_IF[arm]
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
/** ⭐⭐⭐ `performPass` — GATE 2's OWN enclosing function (the 2过1 trigger lives in it), hashed
 *  WHOLE with its EXTRACTED callees, exactly as the other roots are (#413 item 5's code facts). */
const SPAN_PERFORM_PASS = findSpan(MECH_PATH, 'performPass', PERFORM_PASS_HEAD);
const HASHED_ROOTS = [SPAN_ASSIGN_RUNNERS, SPAN_DECIDE_OFFBALL, SPAN_EXECUTE_ACTION,
  SPAN_PERFORM_PASS,
  SPAN_OBM_POLICY].filter((s): s is Span => s !== null);
const ROOTS_COMPLETE = HASHED_ROOTS.length === 5;
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
interface FlagCount { file: string; own: number; hats: number; coop: number }
const FLAG_COUNTS: FlagCount[] = [];
for (const f of SRC_ALL_FILES) {
  const t = codeLinesOf(readFileSync(f, 'utf8')).join('\n');
  const own = (t.match(/dsOwnRun/g) ?? []).length;
  const hats = (t.match(/dsHatsOff/g) ?? []).length;
  const coop = (t.match(/dsCoopHatsOff/g) ?? []).length;
  if (own > 0 || hats > 0 || coop > 0) FLAG_COUNTS.push({ file: f, own, hats, coop });
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
    if (/^if\s*\(\s*!match\.dsCoopHatsOff\s*\)\s*\{/.test(t)) {
      READ_FORKS.push({ file: f, line: i + 1, text: t, flag: 'dsCoopHatsOff' });
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
/** ⭐⭐⭐ THE SEAM DOC'S §SEAM-C INVENTORY, PARSED OUT OF ITS OWN SECTION — the table the
 *  commander REFRESHED WITH MEASURED LINE NUMBERS at #410. ⭐ Unlike DS-T1b (whose §SEAM-B table
 *  carried no lines, so the gate compared text + file + class + count only), this inventory pins
 *  TEXT + FILE + **LINE**, so the gate compares ALL THREE and a difference is RED (#410 item
 *  3(iv)). The section is SLICED by its own heading so §SEAM's and §SEAM-B's older tables cannot
 *  contaminate the parse, and the slice's own row count is asserted. */
const SEAM_C_SECTION = (() => {
  const head = '### ⭐ The READ-FORK INVENTORY, REFRESHED WITH MEASURED LINE NUMBERS';
  const i = SEAM_DOC.indexOf(head);
  if (i < 0) return '';
  const j = SEAM_DOC.indexOf('\n### ', i + head.length);
  return SEAM_DOC.slice(i, j < 0 ? SEAM_DOC.length : j);
})();
const DOC_C_ROW_RE = new RegExp('\\|\\s*\\*{0,2}(1[a-f]?|2|3)\\*{0,2}\\s*\\|\\s*'
  + '`([^`]+)`\\s*\\|\\s*`(src/[^:`]+):(\\d+)`[^|]*\\|\\s*\\*{0,2}'
  + '([A-Z][A-Z\\- ]+?)\\*{0,2}\\s*(?:\\(new\\))?\\s*\\|', 'g');
interface DocCRow { site: string; text: string; file: string; line: number; cls: string }
const DOC_SEAM_C_SITES: DocCRow[] = [];
{
  let mDoc: RegExpExecArray | null = null;
  DOC_C_ROW_RE.lastIndex = 0;
  while ((mDoc = DOC_C_ROW_RE.exec(SEAM_C_SECTION)) !== null) {
    DOC_SEAM_C_SITES.push({ site: mDoc[1], text: mDoc[2], file: mDoc[3],
      line: Number(mDoc[4]), cls: mDoc[5].trim() });
  }
}
const docSite = (k: string): DocCRow | null =>
  DOC_SEAM_C_SITES.find((r) => r.site === k) ?? null;
/** ⭐⭐⭐ THE SEAM DOC'S §SWITCH-D INVENTORY, REFRESHED AT DS-T0d'S HEAD (#413 item 5(iv)) —
 *  the FIVE read forks of the THREE flags, PARSED out of that section alone so §SEAM's,
 *  §SEAM-B's and §SEAM-C's older tables cannot contaminate the comparison. TEXT + FILE +
 *  **LINE** on every row; a difference is RED. ⭐ §SEAM-C is still parsed above for the SIX
 *  CODE-MOVE / PERCEPT-PULL rows (1a–1f), which this switch did not touch. */
const SWITCH_D_SECTION = (() => {
  const head = '### ⭐ The READ-FORK INVENTORY, REFRESHED (measured at THIS head)';
  const i = SEAM_DOC.indexOf(head);
  if (i < 0) return '';
  const j = SEAM_DOC.indexOf('\n### ', i + head.length);
  return SEAM_DOC.slice(i, j < 0 ? SEAM_DOC.length : j);
})();
const DOC_D_ROW_RE = new RegExp('\\|\\s*\\*{0,2}([1-5])\\*{0,2}\\s*\\|\\s*'
  + '`([^`]+)`\\s*\\|\\s*`(src/[^:`]+):(\\d+)`[^|]*\\|\\s*\\*{0,2}'
  + '([A-Z][A-Z\\- ]+?)\\s*(?:\\(new\\))?\\*{0,2}\\s*\\|', 'g');
const DOC_SWITCH_D_SITES: DocCRow[] = [];
{
  let mDoc: RegExpExecArray | null = null;
  DOC_D_ROW_RE.lastIndex = 0;
  while ((mDoc = DOC_D_ROW_RE.exec(SWITCH_D_SECTION)) !== null) {
    DOC_SWITCH_D_SITES.push({ site: mDoc[1], text: mDoc[2], file: mDoc[3],
      line: Number(mDoc[4]), cls: mDoc[5].trim() });
  }
}
const docForkSite = (k: string): DocCRow | null =>
  DOC_SWITCH_D_SITES.find((r) => r.site === k) ?? null;
/** the FIVE READ-FORK rows of §SWITCH-D, with the LINES the commander MEASURED at DS-T0d */
const DOC_READ_FORKS = DOC_SWITCH_D_SITES.filter((r) => r.cls === 'READ FORK')
  .map((r) => ({ n: r.site, text: r.text, file: r.file, line: r.line }));
/** ⭐⭐ §SWITCH-D's per-file, THREE-FLAG executable-line occurrence counts, PARSED (never
 *  typed): the paragraph writes `own N / hats N / coop N` for the three code files and a bare
 *  `N / N / N` for the declaration files. Both forms are read by ONE regex. */
const DOC_D_COUNT_RE = new RegExp('`([A-Za-z0-9]+\\.ts)` (?:own )?\\*{0,2}(\\d+)\\*{0,2} / '
  + '(?:hats )?\\*{0,2}(\\d+)\\*{0,2} / \\*{0,2}(?:coop )?(\\d+)\\*{0,2}', 'g');
const DOC_THREE_FLAG_COUNTS: { file: string; own: number; hats: number; coop: number }[] = [];
{
  const flatD = SWITCH_D_SECTION.replace(/\s+/g, ' ');
  let mDoc: RegExpExecArray | null = null;
  DOC_D_COUNT_RE.lastIndex = 0;
  while ((mDoc = DOC_D_COUNT_RE.exec(flatD)) !== null) {
    DOC_THREE_FLAG_COUNTS.push({ file: mDoc[1], own: Number(mDoc[2]),
      hats: Number(mDoc[3]), coop: Number(mDoc[4]) });
  }
}
/** the doc's OWN definition lines for the four exported names, parsed from §SEAM-C's own text */
const DOC_DEFINITION_LINES = (() => {
  const flat = SEAM_C_SECTION.replace(/\s+/g, ' ');
  const g = (name: string): number => {
    const m2 = new RegExp('`' + name + '` at `TeamBrain\\.ts:(\\d+)`').exec(flat)
      ?? new RegExp('`' + name + '` at `:(\\d+)`').exec(flat);
    return m2 === null ? -1 : Number(m2[1]);
  };
  return { runRank: g('runRank'), runnerCount: g('runnerCount'), RUN_ROLE_W: g('RUN_ROLE_W'),
    RUN_DEPTH_DIV: g('RUN_DEPTH_DIV'), RUN_PRIOR_MAX: g('RUN_PRIOR_MAX') };
})();
const MEASURED_DEFINITION_LINES = {
  runRank: occurrences(SRC_OF[TEAMBRAIN_PATH], RUN_RANK_HEAD)[0]?.line ?? -1,
  runnerCount: occurrences(SRC_OF[TEAMBRAIN_PATH], RUNNER_COUNT_HEAD)[0]?.line ?? -1,
  RUN_ROLE_W: occurrences(SRC_OF[TEAMBRAIN_PATH], ROLE_W_LINE)[0]?.line ?? -1,
  RUN_DEPTH_DIV: occurrences(SRC_OF[TEAMBRAIN_PATH], DEPTH_DIV_LINE)[0]?.line ?? -1,
  RUN_PRIOR_MAX: occurrences(SRC_OF[TEAMBRAIN_PATH],
    'export const RUN_PRIOR_MAX = Math.max(...Object.values(RUN_ROLE_W)) + HALF_L / ')[0]
    ?.line ?? -1,
};
const DEFINITION_LINES_AGREE = JSON.stringify(DOC_DEFINITION_LINES)
  === JSON.stringify(MEASURED_DEFINITION_LINES);
/** the doc's own claim about how many times the PULL occurs in `PlayerBrain.ts` */
const DOC_PULL_COUNT = (() => {
  const m2 = /`match\.perceivedSnapshot` still occurs \*\*(\d+)\*\* times/.exec(SEAM_DOC);
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
  { what: 'the PLAYER\'s own restraint (the CAP\'s left operand)', file: BRAIN_PATH,
    text: '          const restraint = clamp01(runnerCount(' },
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
/** ⭐⭐⭐ DS-T0c — `runRank`, THE CODE-MOVED RANKING: its span hashed WHOLE, and ALL THREE call
 *  sites hashed (the shipped `.map` and the player's two), each with the enclosing span it sits
 *  in. #410 item 2: the ranking — and DS-T0's `/ 45` — now exists ONCE in `src/**`. */
const SPAN_RUN_RANK = findSpan(TEAMBRAIN_PATH, 'runRank', RUN_RANK_HEAD);
const RUN_RANK_CALL_SITE_LINES = [
  { what: 'the SHIPPED runner scoring (the ONE shipped line DS-T0c changed)',
    file: TEAMBRAIN_PATH,
    text: '      .map((p) => ({ p, s: runRank(p.role, team.localX(p.pos.x)) }))' },
  { what: 'the PLAYER\'s OWN ranking (`mine`, which the prior also divides)', file: BRAIN_PATH,
    text: '          const mine = runRank(p.role, team.localX(p.pos.x));' },
  { what: 'EACH PERCEIVED MATE\'s ranking (`theirs`, the position off the SNAPSHOT)',
    file: BRAIN_PATH,
    text: '              const theirs = runRank(mate.role, team.localX(body.pos.x));' },
];
const RUN_RANK_CALL_SITES = RUN_RANK_CALL_SITE_LINES.map((c) => {
  const hits = occurrences(SRC_OF[c.file], c.text);
  const enc = hits.length === 1 ? enclosingOf(c.file, hits[0].line) : null;
  return {
    what: c.what, file: c.file, occurrences: hits.length,
    line: hits.length === 1 ? hits[0].line : -1,
    lineSha: sha(c.text), enclosingSpan: enc === null ? null : spanKey(enc),
    enclosingSha: enc === null ? null : enc.sha,
  };
});
const RUN_RANK_OCCURRENCES = SRC_ALL_FILES.map((f) => ({
  file: f,
  calls: (codeLinesOf(readFileSync(f, 'utf8')).join('\n').match(/runRank\(/g) ?? []).length,
})).filter((r) => r.calls > 0);
/** ⭐⭐ THE SUMMAND PATTERN'S EXECUTABLE CENSUS (#410 §CORR-C 2 narrowed the claim to this):
 *  `RUN_ROLE_W[` occurs in the COMMENT-STRIPPED text of `src/**` exactly ONCE — `runRank`'s
 *  own `return`. The doc's own qualified sentence is parsed and compared. */
const ROLE_W_SUMMAND_SITES = SRC_ALL_FILES.map((f) => ({
  file: f,
  hits: (codeLinesOf(readFileSync(f, 'utf8')).join('\n').match(/RUN_ROLE_W\[/g) ?? []).length,
})).filter((r) => r.hits > 0);
const DOC_SUMMAND_CLAIM = /the summand pattern `RUN_ROLE_W\[…\] \+` occurs exactly once/
  .test(SEAM_DOC.replace(/\s+/g, ' '));
const RUN_RANK_FACTS_OK = SPAN_RUN_RANK !== null
  && RUN_RANK_CALL_SITES.every((r) => r.occurrences === 1 && r.enclosingSpan !== null)
  && RUN_RANK_CALL_SITES[0].enclosingSpan === (SPAN_ASSIGN_RUNNERS === null ? 'x'
    : spanKey(SPAN_ASSIGN_RUNNERS))
  && RUN_RANK_CALL_SITES.slice(1).every((r) => r.enclosingSpan
    === (SPAN_DECIDE_OFFBALL === null ? 'x' : spanKey(SPAN_DECIDE_OFFBALL)))
  && RUN_RANK_OCCURRENCES.length === 2
  && ROLE_W_SUMMAND_SITES.length === 1
  && ROLE_W_SUMMAND_SITES[0].hits === 1
  && ROLE_W_SUMMAND_SITES[0].file === TEAMBRAIN_PATH
  && DOC_SUMMAND_CLAIM;
fx('runRank.itsSpanIsFOUND', SPAN_RUN_RANK !== null, true);
fx('runRank.allTHREECallSitesFoundExactlyOnce',
  RUN_RANK_CALL_SITES.map((r) => r.occurrences), [1, 1, 1]);
fx('runRank.theyLiveInTheTWONAMEDFunctions',
  RUN_RANK_CALL_SITES.map((r) => (r.enclosingSpan ?? '').split(':').pop()),
  ['assignRunners', 'decideOffBall', 'decideOffBall']);
fx('runRank.itLivesInEXACTLYTWOFilesOfSrc', RUN_RANK_OCCURRENCES.length, 2);
fx('runRank.theSHIPPEDMapCALLSIt',
  SRC_OF[TEAMBRAIN_PATH].includes(RUN_RANK_CALL_SITE_LINES[0].text), true);
fx('runRank.theRETIREDInlineExpressionIsGONEFromTheShippedMap',
  SRC_OF[TEAMBRAIN_PATH].includes(
    '      .map((p) => ({ p, s: RUN_ROLE_W[p.role] + team.localX(p.pos.x) / 45 }))'), false);
fx('runRank.theSUMMANDPatternIsEXECUTABLYUniqueInSrc',
  ROLE_W_SUMMAND_SITES.map((r) => [r.file, r.hits]), [[TEAMBRAIN_PATH, 1]]);
fx('runRank.theDOCMakesTHATNarrowedClaim', DOC_SUMMAND_CLAIM, true);
fx('runRank.thisInstrumentsPriorUSESTheEnginesOwnRunRank', (() => {
  let ok = true;
  for (const r of ['GK', 'DF', 'MF', 'WG', 'ST'] as Role[]) {
    for (let x = -HALF_L; x <= HALF_L; x += 0.25) {
      if (priorOf(r, x) !== clamp01(runRank(r, x) / RUN_PRIOR_MAX)) ok = false;
    }
  }
  return ok;
})(), true);
fx('runRank.aTYPEDDivisorWouldBreakTheAgreement',
  clamp01(runRank('ST', 10) / RUN_PRIOR_MAX)
    === clamp01((RUN_ROLE_W.ST + 10 / 44) / RUN_PRIOR_MAX), false);
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
const DOC_READ_SET_THREE = (() => {
  const flat = SEAM_DOC.replace(/\s+/g, ' ');
  const m2 = /only `match` members named are `(\w+)`, `(\w+)` and `(\w+)`/.exec(flat);
  return m2 === null ? [] : [m2[1], m2[2], m2[3]].map((x) => `match.${x}`).sort();
})();
/** ⭐⭐⭐ ⭐ AMENDMENT — THE **SEVEN**-MEMBER READ SET (#422 item 2's narrow, #423 item 1(b)).
 *  IF-T1 compared the block's member set to the UNION of DS-T0's THREE and IF-T0 §LAW 2's TWO;
 *  the amended seam reads SEVEN, and IF-T0b's §LAW-B 2 names all seven in one sentence. THIS
 *  exam PARSES THAT SENTENCE and compares it to the block's own extracted member set, with
 *  DS-T0's three still parsed and asserted to be a SUBSET (neither sentence edited; a
 *  difference is RED). */
const IF_SEAM_DOC_PATH = 'docs/world-model/IF-T0-FLIGHT-RUN-SEAM.md';
const IF_SEAM_DOC = readFileSync(IF_SEAM_DOC_PATH, 'utf8');
const DOC_READ_SET_SEVEN = (() => {
  const flat = IF_SEAM_DOC.replace(/\s+/g, ' ');
  const i = flat.indexOf('THE COMPLETE READ SET of the narrowed fork');
  if (i < 0) return [];
  const j = flat.indexOf('the pin’s own sorted order', i) < 0
    ? flat.indexOf('the pin\'s own sorted order', i) : flat.indexOf('the pin’s own sorted order', i);
  if (j < 0) return [];
  const seg = flat.slice(i, j);
  return [...new Set(seg.match(/match\.[A-Za-z_$][\w$]*/g) ?? [])].sort();
})();
const DOC_READ_SET = DOC_READ_SET_SEVEN;
const DOC_READ_SET_THREE_IS_A_SUBSET = DOC_READ_SET_THREE.length === 3
  && DOC_READ_SET_THREE.every((m) => DOC_READ_SET_SEVEN.includes(m));
/** ⭐⭐⭐ ⭐ AMENDMENT — THE PLACEMENT IS NOW **FOUR** (§LAW-B): the door, the belief, the LOOK
 *  COUNTER and the WHISTLE are the FIRST FOUR EXECUTABLE STATEMENTS inside
 *  `if (match.dsOwnRun) {`. */
const IF_ALIAS_LINES = {
  door: occurrences(SRC_OF[BRAIN_PATH], IF_DOOR_ALIAS_LINE)[0]?.line ?? -1,
  belief: occurrences(SRC_OF[BRAIN_PATH], IF_BELIEF_ALIAS_LINE)[0]?.line ?? -1,
  look: occurrences(SRC_OF[BRAIN_PATH], IF_LOOK_ALIAS_LINE)[0]?.line ?? -1,
  phase: occurrences(SRC_OF[BRAIN_PATH], IF_PHASE_ALIAS_LINE)[0]?.line ?? -1,
  fork: occurrences(SRC_OF[BRAIN_PATH], '    if (match.dsOwnRun) {')[0]?.line ?? -1,
};
const IF_ALIASES_ARE_THE_FIRST_FOUR_STATEMENTS = (() => {
  const lines = SRC_OF[BRAIN_PATH].split('\n');
  const head = IF_ALIAS_LINES.fork;
  if (head < 1) return false;
  const body: string[] = [];
  for (let k = head; k < lines.length && body.length < 4; k++) {
    const t = lines[k].trim();
    if (t === '' || t.startsWith('//') || t.startsWith('/*') || t.startsWith('*')) continue;
    body.push(t);
  }
  return body[0] === IF_DOOR_ALIAS_LINE.trim() && body[1] === IF_BELIEF_ALIAS_LINE.trim()
    && body[2] === IF_LOOK_ALIAS_LINE.trim() && body[3] === IF_PHASE_ALIAS_LINE.trim();
})();
const IF_ALIASES_ARE_THE_FIRST_TWO_STATEMENTS = IF_ALIASES_ARE_THE_FIRST_FOUR_STATEMENTS;
/** ⭐⭐⭐ THE BELIEF'S WHOLE FOOTPRINT in `src/**`: ONE read site and ONE write site, both on
 *  the SAME expression, both his OWN entry by his OWN gid — and ⭐ AMENDMENT: THE LOOK
 *  COUNTER'S OWN footprint beside it, ONE `.get(` and ONE `.set(`, also by his own gid. */
const IF_BELIEF_SITES = SRC_ALL_FILES.map((f) => ({
  file: f,
  get: (readFileSync(f, 'utf8').match(/ifLastSeenOwner\.get\(p\.gid\)/g) ?? []).length,
  set: (readFileSync(f, 'utf8').match(/ifLastSeenOwner\.set\(p\.gid,/g) ?? []).length,
  name: (readFileSync(f, 'utf8').match(/ifLastSeenOwnerGid/g) ?? []).length,
})).filter((r) => r.name > 0);
const IF_LOOK_SITES = SRC_ALL_FILES.map((f) => ({
  file: f,
  get: (readFileSync(f, 'utf8').match(/ifLookMap\.get\(p\.gid\)/g) ?? []).length,
  set: (readFileSync(f, 'utf8').match(/ifLookMap\.set\(p\.gid,/g) ?? []).length,
  name: (readFileSync(f, 'utf8').match(/ifLook\b/g) ?? []).length,
})).filter((r) => r.name > 0);
const IF_LOOK_FOOTPRINT_OK = IF_LOOK_SITES.length === 2
  && IF_LOOK_SITES.filter((r) => r.file === BRAIN_PATH)
    .every((r) => r.get === 1 && r.set === 1);
/** ⭐⭐⭐ DS-T0c §LAW-C 4's OTHER THREE POSITIVE SETS, PARSED out of the same sentence and
 *  compared to the block's WHOLE TEXT: the `.pos` reads, the `mate.` set and the `body.` set —
 *  plus the two REMOVED reads (`vel` and `topSpeed`) as a NEGATIVE, and `runningMates` as a
 *  third. EQUAL or RED (#410 item 3, code facts). */
const DOC_BLOCK_SETS = (() => {
  const flat = SEAM_DOC.replace(/\s+/g, ' ');
  const g = (re: RegExp): string[] => {
    const m2 = re.exec(flat);
    return m2 === null ? [] : m2[1].split(',').map((x) => x.trim()).sort();
  };
  return {
    pos: g(/the `\.pos` read set is exactly `\{([^}]+)\}`/),
    mate: g(/the `mate\.` set is exactly `\{([^}]+)\}`/),
    body: g(/the `body\.` set is exactly `\{([^}]+)\}`/),
    velIsEmpty: /the `\.vel` read set is EMPTY/.test(flat),
  };
})();
const BLOCK_SETS = OWN_BLOCK === null ? null : {
  pos: [...new Set(OWN_BLOCK.text.match(/[A-Za-z_$][\w$]*\.pos\.[xy]/g) ?? [])].sort(),
  mate: [...new Set((OWN_BLOCK.text.match(/\bmate\.[A-Za-z_$][\w$]*/g) ?? [])
    .map((x) => x.slice(5)))].sort(),
  body: [...new Set((OWN_BLOCK.text.match(/\bbody\.[A-Za-z_$][\w$]*/g) ?? [])
    .map((x) => x.slice(5)))].sort(),
  vel: [...new Set(OWN_BLOCK.text.match(/[A-Za-z_$][\w$]*\.vel\b/g) ?? [])].sort(),
  topSpeed: (OWN_BLOCK.text.match(/topSpeed/g) ?? []).length,
  runningMates: (OWN_BLOCK.text.match(/runningMates/g) ?? []).length,
};
/** ⭐⭐⭐ #410 item 3's STORED BOOLEAN: the block reads NO `.vel`, NO `topSpeed` and carries NO
 *  `runningMates` — the velocity mass is GONE, derived from the block's WHOLE TEXT. */
const blockReadsNoVelocityNoTopSpeed = BLOCK_SETS !== null
  && BLOCK_SETS.vel.length === 0 && BLOCK_SETS.topSpeed === 0
  && BLOCK_SETS.runningMates === 0 && DOC_BLOCK_SETS.velIsEmpty;
const BLOCK_SETS_AGREE = BLOCK_SETS !== null
  && JSON.stringify(BLOCK_SETS.pos) === JSON.stringify(DOC_BLOCK_SETS.pos)
  && JSON.stringify(BLOCK_SETS.mate) === JSON.stringify(DOC_BLOCK_SETS.mate)
  && JSON.stringify(BLOCK_SETS.body) === JSON.stringify(DOC_BLOCK_SETS.body)
  && blockReadsNoVelocityNoTopSpeed;
const BLOCK_MEMBERS_AGREE = OWN_BLOCK !== null && DOC_READ_SET.length === 7
  && DOC_READ_SET_THREE_IS_A_SUBSET
  && JSON.stringify(OWN_BLOCK.members) === JSON.stringify(DOC_READ_SET)
  && IF_ALIASES_ARE_THE_FIRST_FOUR_STATEMENTS
  && IF_BELIEF_SITES.length === 2
  && IF_BELIEF_SITES.filter((r) => r.file === BRAIN_PATH)
    .every((r) => r.get === 1 && r.set === 1)
  && IF_LOOK_FOOTPRINT_OK
  && BLOCK_SETS_AGREE;
const norm = (a: { file: string; text: string }[]): string => JSON.stringify(
  a.map((x) => `${x.file}||${x.text}`).sort(),
);
/** ⭐⭐⭐ THE MEASURED SITES for every §SEAM-C row, so the comparison is TEXT + FILE + LINE. */
const MEASURED_C_SITES: Record<string, { file: string; line: number } | null> = {
  '1a': { file: BRAIN_PATH,
    line: occurrences(SRC_OF[BRAIN_PATH],
      '        const snapshot = match.perceivedSnapshot(p);')[0]?.line ?? -1 },
  '1b': { file: BRAIN_PATH, line: RUNNER_COUNT_CALL_SITES[1].line },
  '1c': { file: TEAMBRAIN_PATH, line: RUNNER_COUNT_CALL_SITES[0].line },
  '1d': { file: BRAIN_PATH, line: RUN_RANK_CALL_SITES[1].line },
  '1e': { file: BRAIN_PATH, line: RUN_RANK_CALL_SITES[2].line },
  '1f': { file: TEAMBRAIN_PATH, line: RUN_RANK_CALL_SITES[0].line },
};
const C_SITE_ROWS = Object.entries(MEASURED_C_SITES).map(([k, m]) => {
  const d = docSite(k);
  return { site: k, docFile: d?.file ?? null, docLine: d?.line ?? -1, docClass: d?.cls ?? null,
    docText: d?.text ?? null, measuredFile: m?.file ?? null, measuredLine: m?.line ?? -1,
    agrees: d !== null && m !== null && d.file === m.file && d.line === m.line };
});
/** ⭐⭐⭐ THE LINE SHIFT, DECLARED (canon: *a stage's source-text anchor is a statement dated to
 *  ITS head*). §SEAM-C's table records the lines DS-T0c MEASURED; IF-T0 then INSERTED eight
 *  executable lines into `decideOffBall` ABOVE four of them, so those four sit LOWER at this
 *  head. The gate therefore compares TEXT + FILE + CLASS exactly and, on the line, asserts
 *  (a) no row moved UP and (b) every PlayerBrain row moved by the SAME shift — the signature of
 *  a PURE INSERTION above them. The measured lines are STORED. ⚠ DECLARED at §DEVIATIONS. */
const C_SITE_SHIFTS = C_SITE_ROWS
  .filter((r) => r.measuredFile === BRAIN_PATH && r.docLine > 0 && r.measuredLine > 0)
  .map((r) => r.measuredLine - r.docLine);
const C_SITE_SHIFT = C_SITE_SHIFTS.length === 0 ? 0 : Math.max(...C_SITE_SHIFTS);
const C_SITE_SHIFTS_DISTINCT = [...new Set(C_SITE_SHIFTS)].sort((a, b) => a - b);
/** the FORK ITSELF is UNMOVED — nothing was inserted ABOVE it, which is what makes every
 *  shift below it a PURE INSERTION INSIDE the fork rather than a moved seam. */
const FORK_LINE_UNMOVED = (docForkSite('1')?.line ?? -1) === IF_ALIAS_LINES.fork;
const C_SITES_LINE_SHIFT_IS_A_PURE_INSERTION = C_SITE_SHIFTS.every((d) => d >= 0)
  && C_SITE_SHIFTS.some((d) => d > 0)
  && FORK_LINE_UNMOVED
  && C_SITE_ROWS.filter((r) => r.measuredFile !== BRAIN_PATH)
    .every((r) => r.docLine === r.measuredLine);
const C_SITES_AGREE = C_SITE_ROWS.every((r) => r.docFile === r.measuredFile
  && r.docFile !== null && r.measuredLine > 0)
  && C_SITES_LINE_SHIFT_IS_A_PURE_INSERTION
  && docSite('1a')?.cls === 'PERCEPT PULL'
  && docSite('1a')?.text === 'match.perceivedSnapshot(p)'
  && ['1b', '1c', '1d', '1e', '1f'].every((k) => docSite(k)?.cls === 'CODE-MOVE CALL');
/** ⭐⭐⭐ #410 item 3(iv): §SEAM-C pins TEXT + FILE + **LINE**, so ALL THREE are compared and a
 *  difference is RED — DS-T1b's declared line disagreement is RETIRED positively. */
const FORK_LINES_MEASURED = READ_FORKS.map((r) => `${r.file}:${r.line}`).sort();
const FORK_LINES_IN_DOC = DOC_READ_FORKS.map((r) => `${r.file}:${r.line}`).sort();
const FORK_LINE_NUMBERS_AGREE = JSON.stringify(FORK_LINES_MEASURED)
  === JSON.stringify(FORK_LINES_IN_DOC);
const FORK_INVENTORY_AGREES = DOC_READ_FORKS.length === 5 && READ_FORKS.length === 5
  && norm(DOC_READ_FORKS) === norm(READ_FORKS)
  && FORK_LINE_NUMBERS_AGREE
  && DOC_SEAM_C_SITES.length === 9
  && DOC_SWITCH_D_SITES.length === 5
  && docForkSite('1') !== null && docForkSite('1')?.cls === 'READ FORK'
  && docForkSite('1')?.text === 'if (match.dsOwnRun) {'
  && docForkSite('1')?.file === BRAIN_PATH
  && docForkSite('4')?.text === COOP_GATE_LINE.trim()
  && docForkSite('4')?.file === TEAMBRAIN_PATH
  && docForkSite('5')?.text === COOP_GATE_LINE.trim()
  && docForkSite('5')?.file === MECH_PATH
  && C_SITES_AGREE
  && DEFINITION_LINES_AGREE
  && DOC_PULL_COUNT === PULL_SITES_IN_BRAIN
  && BLOCK_MEMBERS_AGREE && RUNNER_COUNT_FACTS_OK && RUN_RANK_FACTS_OK;
/** ⚠ `a4World.ts` IS EXCLUDED FROM THIS COMPARISON AND STATED SEPARATELY. §SWITCH-D's row
 *  (`a4World.ts` 2 / 2 / 0) is a statement dated to DS-T0d's head; DS-ENTRY-2 then cut world 17
 *  out of `dsCoopHatsOff` (#415 errata), so the coop count is 2 here. This exam STATES the
 *  counts at ITS OWN head and keeps only the zeros that are STILL claims — `ifFlightRun` and
 *  `ifLastSeenOwnerGid`, which reach no world at all. DECLARED at §DEVIATIONS. */
const EXCLUDED_FROM_DOC_COUNTS = 'a4World.ts';
const byFileName3 = (rows: { file: string; own: number; hats: number; coop: number }[]) =>
  JSON.stringify([...new Set(rows
    .filter((r) => r.file.split('/').pop() !== EXCLUDED_FROM_DOC_COUNTS)
    .map((r) => JSON.stringify([r.file.split('/').pop(), r.own, r.hats, r.coop])))].sort());
const DOC_FLAG_COUNTS_DEDUPED = [...new Set(DOC_THREE_FLAG_COUNTS.map((r) =>
  JSON.stringify(r)))].map((x) => JSON.parse(x) as
    { file: string; own: number; hats: number; coop: number });
const FLAG_COUNTS_AGREE = DOC_FLAG_COUNTS_DEDUPED.length === 6
  && byFileName3(FLAG_COUNTS) === byFileName3(DOC_FLAG_COUNTS_DEDUPED);
/** ⭐⭐⭐ ERRATA 6 (#412 item 3): the entry layer NAMES the two own-run doors, so the inherited
 *  "a4World is clean of both flags" boolean is RETIRED and replaced by the STATED COUNTS at
 *  THIS head plus the ONE zero that is still true — the SWITCH reaches no world. */
const A4_COUNTS_AT_THIS_HEAD = { dsOwnRun: A4_OWN_COUNT_AT_THIS_HEAD,
  dsHatsOff: A4_HATS_COUNT_AT_THIS_HEAD, dsCoopHatsOff: A4_COOP_COUNT_AT_THIS_HEAD,
  ifFlightRun: A4_IF_COUNT_AT_THIS_HEAD,
  ifLastSeenOwnerGid: A4_IF_BELIEF_COUNT_AT_THIS_HEAD };
const A4_CLEAN_OF_THE_FLIGHT_DOOR = A4_IF_COUNT_AT_THIS_HEAD === 0
  && A4_IF_BELIEF_COUNT_AT_THIS_HEAD === 0
  && A4_IF_LOOK_COUNT_AT_THIS_HEAD === 0;
fx('readForks.exactlyFIVEInSrc', READ_FORKS.length, 5);
fx('readForks.oneOwnRunTwoHatsOffTwoCoopHatsOff', [
  READ_FORKS.filter((r) => r.flag === 'dsOwnRun').length,
  READ_FORKS.filter((r) => r.flag === 'dsHatsOff').length,
  READ_FORKS.filter((r) => r.flag === 'dsCoopHatsOff').length,
], [1, 2, 2]);
fx('readForks.theSeamDocInventoryPARSED', DOC_READ_FORKS.length, 5);
fx('readForks.a4WorldNamesTheTwoOwnRunDoorsAtTHISHead',
  [A4_OWN_COUNT_AT_THIS_HEAD, A4_HATS_COUNT_AT_THIS_HEAD], [2, 2]);
fx('readForks.a4WorldNamesTheCOOPFlagAtTHISHead_theEntryLayerCutWorld17',
  A4_COOP_COUNT_AT_THIS_HEAD, 2);
fx('readForks.a4WorldNamesTheFLIGHTDoorZEROTimes', A4_IF_COUNT_AT_THIS_HEAD, 0);
fx('readForks.a4WorldNamesTheBELIEFZEROTimes', A4_IF_BELIEF_COUNT_AT_THIS_HEAD, 0);
fx('readForks.aNONZEROFlightCountWouldBeCAUGHT', [1].every((v) => v === 0), false);
fx('readForks.theSeamDocSEAMCInventoryPARSED_NINERows', DOC_SEAM_C_SITES.length, 9);
fx('readForks.theSeamDocSWITCHDInventoryPARSED_FIVERows', DOC_SWITCH_D_SITES.length, 5);
fx('readForks.theSWITCHDPerFileCountsPARSED_SIXFiles',
  DOC_FLAG_COUNTS_DEDUPED.length, 6);
fx('readForks.theSEAMCRowsAgreeOnFILEandTEXT',
  C_SITE_ROWS.map((r) => r.docFile === r.measuredFile && r.measuredLine > 0),
  [true, true, true, true, true, true]);
fx('readForks.theirLINESHIFTIsThatOfAPUREINSERTIONAboveThem',
  C_SITES_LINE_SHIFT_IS_A_PURE_INSERTION, true);
fx('readForks.theFORKItselfIsUNMOVED_soEverythingBelowItIsAnINSERTIONInsideIt',
  FORK_LINE_UNMOVED, true);
fx('readForks.everyPlayerBrainRowMovedDOWNByASTOREDShift',
  C_SITE_SHIFTS.every((d) => d > 0), true);
fx('readForks.theDISTINCTShiftsAreENUMERATED', C_SITE_SHIFTS_DISTINCT.length > 0, true);
fx('readForks.aROWMovingUPWouldBeCAUGHT', [-1].every((d) => d >= 0), false);
fx('readForks.theFIVEDefinitionLinesAGREE', DEFINITION_LINES_AGREE, true);
fx('readForks.theSWITCHDPerFileCountsPARSEDAndDEDUPED', DOC_FLAG_COUNTS_DEDUPED.length, 6);
/** ⚠ §SWITCH-D writes SIX per-file rows in TWO textual forms (`own N / hats N / coop N` for the
 *  three code files, a bare `N / N / N` for the declaration files); ONE regex reads both, and
 *  the DEDUPED set is what the gate compares to the measured one, so a doc copy that DRIFTED
 *  would break the dedupe. */
fx('readForks.theSWITCHDCountsParseInBOTHTextualForms', [
  DOC_FLAG_COUNTS_DEDUPED.filter((r) => r.file === 'TeamBrain.ts').length,
  DOC_FLAG_COUNTS_DEDUPED.filter((r) => r.file === 'Match.ts').length,
], [1, 1]);
fx('readForks.theSWITCHDCountsDEDUPEToSIX_whichIsWhatADRIFTEDCopyWouldBreak',
  DOC_FLAG_COUNTS_DEDUPED.length, 6);
fx('readForks.theyAGREEOnFileTextClassAndCount',
  FORK_INVENTORY_AGREES && FLAG_COUNTS_AGREE, true);
fx('readForks.theDOCSLINENUMBERSNOWAgree_andTHATISGATED',
  FORK_LINE_NUMBERS_AGREE, true);
fx('block.theBLOCKREADSNoVelocityAndNoTopSpeed', blockReadsNoVelocityNoTopSpeed, true);
fx('block.theTHREEPositiveSetsAGREEWithTheDoc', BLOCK_SETS_AGREE, true);
fx('block.aVELOCITYReadWouldBreakTheBoolean',
  BLOCK_SETS === null ? true
    : [...BLOCK_SETS.vel, 'body.vel'].length === BLOCK_SETS.vel.length, false);
fx('block.theMATESetIsTheROSTERSFourFields',
  BLOCK_SETS === null ? [] : BLOCK_SETS.mate, ['gid', 'index', 'role', 'sentOff']);
fx('block.theBODYSetIsTheSNAPSHOTSThreeFields',
  BLOCK_SETS === null ? [] : BLOCK_SETS.body, ['gid', 'pos', 'side']);
fx('block.thePOSReadsAreEXACTLYTheTwoNamed',
  BLOCK_SETS === null ? [] : BLOCK_SETS.pos, ['body.pos.x', 'p.pos.x']);
fx('readForks.a4WorldIsCLEAN_OF_THE_SWITCH', A4_CLEAN_OF_THE_FLIGHT_DOOR, true);
fx('readForks.aNONZEROCoopCountWouldBeCAUGHT', [1].every((v) => v === 0), false);
fx('block.theMemberSetIsEXACTLYTheTWODocsUnionReadSet',
  OWN_BLOCK === null ? [] : OWN_BLOCK.members, DOC_READ_SET);
fx('block.theMemberSetIsSEVENMembers', OWN_BLOCK === null ? 0 : OWN_BLOCK.members.length, 7);
fx('block.theTHREEInheritedMembersAreDSTs',
  DOC_READ_SET_THREE, ['match.dsOwnRun', 'match.perceivedSnapshot', 'match.simTime']);
fx('block.theTHREEInheritedMembersAreASUBSETOfTheSEVEN', DOC_READ_SET_THREE_IS_A_SUBSET, true);
fx('block.theSEVENAreTheONESLAWBNames', DOC_READ_SET_SEVEN,
  ['match.dsOwnRun', 'match.ifFlightRun', 'match.ifLastSeenOwnerGid', 'match.ifLook',
    'match.perceivedSnapshot', 'match.phase', 'match.simTime']);
fx('block.theFOURAliasesAreTheFIRSTFOURStatementsINSIDETheFork',
  IF_ALIASES_ARE_THE_FIRST_FOUR_STATEMENTS, true);
fx('block.aTHREEALIASReadingWouldNOTSatisfyTheFOURStatementForm',
  [IF_ALIAS_LINES.door, IF_ALIAS_LINES.belief, IF_ALIAS_LINES.look, IF_ALIAS_LINES.phase]
    .every((l) => l > 0), true);
fx('block.theFOURALIASLINESAreCONSECUTIVE',
  [IF_ALIAS_LINES.belief - IF_ALIAS_LINES.door, IF_ALIAS_LINES.look - IF_ALIAS_LINES.belief,
    IF_ALIAS_LINES.phase - IF_ALIAS_LINES.look], [1, 1, 1]);
fx('block.theBELIEFHasONEReadSiteAndONEWriteSiteInAllOfSrc',
  IF_BELIEF_SITES.filter((r) => r.get + r.set > 0).map((r) => [r.get, r.set]), [[1, 1]]);
fx('block.theLOOKCOUNTERHasONEReadSiteAndONEWriteSiteInAllOfSrc',
  IF_LOOK_SITES.filter((r) => r.get + r.set > 0).map((r) => [r.get, r.set]), [[1, 1]]);
fx('block.theLOOKCOUNTERSFootprintIsOK', IF_LOOK_FOOTPRINT_OK, true);
fx('block.aTRUTHREADWouldBreakTheSet',
  JSON.stringify([...(OWN_BLOCK === null ? [] : OWN_BLOCK.members), 'match.ball'].sort())
    === JSON.stringify(DOC_READ_SET), false);
fx('runnerCount.bothCallSitesFoundExactlyOnce',
  RUNNER_COUNT_CALL_SITES.map((r) => r.occurrences), [1, 1]);
fx('runnerCount.theTwoCallSitesSitInTheTwoNAMEDFunctions',
  RUNNER_COUNT_CALL_SITES.map((r) => (r.enclosingSpan ?? '').split(':').pop()),
  ['assignRunners', 'decideOffBall']);
fx('runnerCount.itLivesInEXACTLYTWOFilesOfSrc', RUNNER_COUNT_OCCURRENCES.length, 2);

/** ⭐⭐⭐ THE PASSER'S HAT-READ SITES — DS-C0's OWN LIST, copied BY FIELD NAME (#413 STEP 0(4))
 *  and RESOLVED to its enclosing function at THIS head. It states the ⑤ BOUNDARY (读心标签) as a
 *  BOUNDARY: does the read consume a LABEL a designation wrote, or a mate's ACTION TYPE? ⛔ NOT
 *  FIXED, NOT JUDGED. ⚠ Two of the six sites (`PlayerBrain.ts:666`'s wall-return bonus and
 *  `:690`'s 套边 release bonus) are the branches DS-T0d measured UNREACHABLE with the switch
 *  armed — a MEASURED consequence of their inputs never being set, never an edit; the spy
 *  counters on the COOP-OFF arms are stored beside in `armCoop.spy`, and NO TEXT CLAIM is made
 *  here about reachability. */
const PASSER_READ_SITES = [
  { read: 'wallReturn', consumes: 'LABEL — `mate.wallRun.partnerGid`',
    needle: '        mate.wallRun.partnerGid === p.gid &&',
    unreachableWhen: 'dsCoopHatsOff (MEASURED — DS-T0d; the spy counters are stored beside)' },
  { read: 'thirdMan', consumes: 'ACTION TYPE — `mate.action.type === \'MakeRun\'`',
    needle: "        lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > 0.15",
    unreachableWhen: null },
  { read: 'overlapRelease', consumes: 'LABEL — `team.overlapper`',
    needle: '        team.overlapper === mate.index &&',
    unreachableWhen: 'dsCoopHatsOff (MEASURED — DS-T0d; the spy counters are stored beside)' },
  { read: 'arriverCutback', consumes: 'LABEL — `team.arriver`',
    needle: '    p.kickCooldown <= 0 && (!mustKick || cornerCutback) && team.arriver !== null &&',
    unreachableWhen: null },
  { read: 'throughBallRunnerScan (a FIFTH site; #404 item 1 names four)',
    consumes: 'ACTION TYPE — `mate.action.type !== \'MakeRun\'`',
    needle: "      if (mate === p || mate.sentOff || mate.action.type !== 'MakeRun') continue;",
    unreachableWhen: null },
  { read: 'registerPassBounce', consumes: 'ACTION TYPE — `target.action.type === \'MakeRun\'`',
    needle: "    target.action.type === 'MakeRun' &&", unreachableWhen: null },
].map((r) => {
  const file = r.needle.includes('target.action.type') ? MECH_PATH : BRAIN_PATH;
  const hits = occurrences(SRC_OF[file], r.needle);
  const enc = hits.length === 1 ? enclosingOf(file, hits[0].line) : null;
  return {
    ...r, file, occurrences: hits.length, line: hits.length === 1 ? hits[0].line : null,
    enclosingFn: enc === null ? null : enc.name,
    enclosingSpan: enc === null ? null : spanKey(enc),
    enclosingSha: enc === null ? null : enc.sha,
  };
});
const PASSER_READS_RESOLVED = PASSER_READ_SITES.every((r) => r.enclosingSpan !== null)
  && PASSER_READ_SITES.every((r) => r.occurrences === 1);
fx('passerReads.allSIXSitesResolveToAnEnclosingSpan', PASSER_READS_RESOLVED, true);
fx('passerReads.eachNeedleOccursEXACTLYOnce',
  PASSER_READ_SITES.map((r) => r.occurrences), [1, 1, 1, 1, 1, 1]);
fx('passerReads.theTWOSitesTheSWITCHStarvesAreNAMED',
  PASSER_READ_SITES.filter((r) => r.unreachableWhen !== null).map((r) => r.read),
  ['wallReturn', 'overlapRelease']);

/** ⭐⭐ THE OBM SEAT's own closure — the `runMul` this exam observes comes from here. */
const OBM_ROOTS = SPANS.filter((s) => s.file === EYES_PATH);
const OBM_CLOSURE = closureOf(OBM_ROOTS);
const OBM_HITS = OBM_CLOSURE.nodes.filter((s) => DESIGNATION_NEEDLE_RE.test(s.text))
  .map(spanKey);
const obmSeatReadsNoDesignation = OBM_ROOTS.length > 0 && OBM_HITS.length === 0
  && EVERY_FIELD_NEEDLE_LIVE;
const CODE_FACT_GRAPH_OK = SPAN_RUNNER_COUNT !== null && RUNNER_COUNT_FACTS_OK
  && SPAN_RUN_RANK !== null && RUN_RANK_FACTS_OK && BLOCK_SETS_AGREE
  && blockReadsNoVelocityNoTopSpeed
  && BLOCK_MEMBERS_AGREE && ROOTS_COMPLETE && EVERY_FIELD_SITE_RESOLVED
  && EVERY_FIELD_NEEDLE_LIVE && MAKERUN_CASE_IN_EXECUTE_ACTION && MAKERUN_PUSHES.length > 0
  && !DESIGNATION_CLOSURE.capped && !OBM_CLOSURE.capped && OBM_ROOTS.length > 0
  && FORK_INVENTORY_AGREES && FLAG_COUNTS_AGREE && A4_CLEAN_OF_THE_FLIGHT_DOOR
  && IF_ALIASES_ARE_THE_FIRST_FOUR_STATEMENTS && IF_LOOK_FOOTPRINT_OK
  && PASSER_READS_RESOLVED
  && SPAN_PERFORM_PASS !== null
  && makeRunCandidatesAllHatGuardedOnShippedPath
  && SPAN_OBM_POLICY !== null;

/* ========================================================================== */
/* §11 THE RECEIPT WALKS — gLockstep, X-DET (twice), the world pin, X-FP-PROD  */
/* ========================================================================== */
banner('IF-T1b — the lockstep receipt (observed vs unobserved, PER ARM)');
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
/** ⭐⭐⭐ THE ASSERTION (IF-C0's own form, inherited): observed − unobserved EQUALS the
 *  instrument's OWN stored pull count on every arm — ZERO on the arms without `dsOwnRun` and
 *  POSITIVE on the arms that carry it — the whole-match SIGNATURES are equal, and the wrapped
 *  observed signature equals the UNWRAPPED lockstep walk's. */
const PULLCOUNT_OK = pullRows.length === LOCKSTEP_SEEDS.length * ARMS.length
  && PULL_COUNTER_LIVE && PULL_ADDED_LIVE
  && pullRows.every((r) => r.addedEqualsStored && r.signaturesEqual && r.wrapperIsTransparent)
  && pullRows.filter((r) => ARM_KIND[r.arm] === 'HATS').every((r) => r.addedPulls === 0)
  && pullRows.filter((r) => ARM_KIND[r.arm] !== 'HATS').every((r) => r.addedPulls > 0);
banner(`  gPullCount ${PULLCOUNT_OK ? 'GREEN' : 'RED'} (${pullRows.length} spied pairs; added `
  + `${pullRows.map((r) => r.addedPulls).join('/')})`);
/* ---- ⭐⭐⭐ §11b gArmIF — THE FLIGHT DOOR'S CONSTRUCTION, PROVED ON A CONSTRUCTED MATCH ----
   ⭐⭐⭐ #420 item 2(iv): the eighth `why` count is EXACTLY 0 on every arm NOT carrying
   `ifFlightRun` and the belief map is EMPTY there. Its battery half is computed over the walked
   cells (§14); this pair of throwaway walks at the DECLARED scratch seeds is its construction
   half: a whole match per arm, the door's own two consequences read off the match itself.
   ⛔ A STORED BOOLEAN OF CONSTRUCTION, NEVER NARRATED AS A FINDING — it is what the flag MEANS. */
const armIfScratchRows = IF_SCRATCH_SEEDS.flatMap((seed) => ARMS.map((armK) => {
  const mArm = buildMatch(seed, armK);
  const rowArm = walkMatch(mArm, armK, true);
  return {
    seed, arm: armK, carriesFlightDoor: ARM_CARRIES_IF[armK],
    eighthWhyDecisions: rowArm.ifWhyDecisions,
    eighthWhyEpisodes: rowArm.ifEpSets,
    beliefEntriesAtFullTime: rowArm.beliefEntriesAtFullTime,
    lookEntriesAtFullTime: rowArm.lookEntriesAtFullTime,
    asDue: ARM_CARRIES_IF[armK]
      ? true
      : rowArm.ifWhyDecisions === 0 && rowArm.ifEpSets === 0
        && rowArm.beliefEntriesAtFullTime === 0 && rowArm.lookEntriesAtFullTime === 0,
  };
}));
const ARM_IF_SCRATCH_OK = armIfScratchRows.every((r) => r.asDue);
banner(`  gArmIF (construction) ${ARM_IF_SCRATCH_OK ? 'GREEN' : 'RED'} `
  + `(${armIfScratchRows.map((r) => `${r.arm} ${r.eighthWhyDecisions}/`
    + `${r.beliefEntriesAtFullTime}`).join(' · ')})`);
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
const FP_PROD_OK = FP_PROD_ARCH_KNOWN && FP_PROD_GOT === FP_PROD_PIN;
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
    dsCoopHatsOff: mm.dsCoopHatsOff === true,
    ifFlightRun: mm.ifFlightRun === true,
    beliefMapPresentAndEmpty: mm.ifLastSeenOwnerGid instanceof Map
      && mm.ifLastSeenOwnerGid.size === 0,
    obmMovement: mm.obmMovement === true,
    dsOwnRunDue: kind !== 'HATS', dsHatsOffDue: kind !== 'HATS',
    dsCoopHatsOffDue: kind !== 'HATS', ifFlightRunDue: ARM_CARRIES_IF[armK],
    obmDue: false,
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
  && w.dsCoopHatsOff === w.dsCoopHatsOffDue
  && w.ifFlightRun === w.ifFlightRunDue && w.beliefMapPresentAndEmpty
  && w.obmMovement === w.obmDue && w.matrixOnBaseEff === w.obmDue);
banner(`  world pin ${WORLD_PIN_OK ? 'GREEN' : 'RED'} (${worldPin.length} arms)`);

/* ========================================================================== */
/* §12 THE BATTERY — the NINE arms PAIRED on every seed                        */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`IF-T1b — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
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
/* §12b G-REPRO-DST1c — RE-WALK DS-T1c's OWN BAND ON **TWO** ARMS               */
/*      + THE ARC'S NUMBERS, QUOTED BY FIELD                                    */
/* ========================================================================== */
/** ⭐⭐⭐ THE ARC'S NUMBERS, QUOTED **BY FIELD** out of their own artifacts and NEVER typed in
 *  this instrument (canon: *doc-prose fidelity*, applied to an instrument). ⭐⭐⭐ EVERY ONE OF
 *  THEM IS AN **arm64** NUMBER (#418 items 1–2); this exam runs on x64, so each is stamped
 *  ≈ CROSS-ARCHITECTURE and is PRINTED, NEVER SELECTING. */
const APPROX_STAMP = '≈ cross-architecture (an arm64 number read on an x64 host; PRINTED, '
  + 'NEVER SELECTING — the exact comparator is this exam\'s OWN control arm)';
interface RawFace { face: string; arm: string; value: number; numerator: number;
  denominator: number; ciLo: number; ciHi: number }
/** ⭐⭐⭐ IF-C0's OWN FACES, read BY FIELD NAME and BY ARM out of its artifact. */
const pickIfC0 = (): null | {
  source: string; stageId: string;
  faceOf: (k: string, armK: string) => { value: number; numerator: number;
    denominator: number; ci: number[] } | null;
} => {
  if (!existsSync(IFC0_ARTIFACT)) return null;
  const raw = JSON.parse(readFileSync(IFC0_ARTIFACT, 'utf8')) as {
    faces: RawFace[]; stage: { id: string };
  };
  const byKey = new Map<string, RawFace>();
  for (const f of raw.faces) byKey.set(`${f.face}@${f.arm}`, f);
  return {
    source: IFC0_ARTIFACT, stageId: raw.stage.id,
    faceOf: (k: string, armK: string) => {
      const f = byKey.get(`${k}@${armK}`);
      return f === undefined ? null
        : { value: f.value, numerator: f.numerator, denominator: f.denominator,
          ci: [f.ciLo, f.ciHi] };
    },
  };
};
const IFC0 = pickIfC0();
/** ⭐⭐ THE ≈ TWIN of a face this exam publishes and IF-C0 also published. */
const approxIfC0 = (k: string, armK: string) => {
  const v = IFC0 === null ? null : IFC0.faceOf(k, armK);
  return v === null || IFC0 === null ? null : { ...v, arm: armK, face: k,
    stamp: APPROX_STAMP, architecture: 'arm64', source: IFC0.source };
};
/** ⭐⭐⭐ ⭐ AMENDMENT — IF-T1's OWN FACES, read BY FIELD NAME and BY ARM out of its artifact.
 *  SAME HOST, SAME ARCHITECTURE, SAME ARM NAMES: an EXACT twin, not an ≈ one. */
const PRIOR_STAMP = 'EXACT prior twin — IF-T1\'s own x64 number for the SAME face on the SAME '
  + 'arm, measured on THIS host and THIS architecture with the same instrument recipe, on the '
  + 'block BEFORE this one (12,559,000–999). ⛔ NO PAIRED Δ ACROSS THE TWO BLOCKS IS CLAIMED — '
  + 'the seeds differ, so these are two independent samples and never a difference. PRINTED, '
  + 'NEVER SELECTING.';
const pickIfT1 = (): null | {
  source: string; stageId: string; hostArchitecture: string | null;
  faceOf: (k: string, armK: string) => { value: number; numerator: number;
    denominator: number; ci: number[] } | null;
} => {
  if (!existsSync(IFT1_ARTIFACT)) return null;
  const raw = JSON.parse(readFileSync(IFT1_ARTIFACT, 'utf8')) as {
    faces: RawFace[]; stage: { id: string; hostArchitecture?: string };
  };
  const byKey = new Map<string, RawFace>();
  for (const f of raw.faces) byKey.set(`${f.face}@${f.arm}`, f);
  return {
    source: IFT1_ARTIFACT, stageId: raw.stage.id,
    hostArchitecture: raw.stage.hostArchitecture ?? null,
    faceOf: (k: string, armK: string) => {
      const f = byKey.get(`${k}@${armK}`);
      return f === undefined ? null
        : { value: f.value, numerator: f.numerator, denominator: f.denominator,
          ci: [f.ciLo, f.ciHi] };
    },
  };
};
const IFT1 = pickIfT1();
/** ⭐⭐ THE EXACT PRIOR TWIN of a face IF-T1 also published, ON THE SAME ARM. */
const priorIfT1 = (k: string, armK: string) => {
  const v = IFT1 === null ? null : IFT1.faceOf(k, armK);
  return v === null || IFT1 === null ? null : { ...v, arm: armK, face: k,
    stamp: PRIOR_STAMP, architecture: IFT1.hostArchitecture, block: [12_559_000, 12_559_999],
    source: IFT1.source };
};
/** ⭐⭐ THE PRIOR EXAMS' READS OF RECORD, quoted BY FIELD (never typed). */
const pickRead = (path: string) => {
  if (!existsSync(path)) return null;
  const raw = JSON.parse(readFileSync(path, 'utf8')) as {
    reads?: { selected?: string; sentence?: string };
    r1?: { levels?: Record<string, { mean?: number }> };
    stage: { id: string };
  };
  return {
    source: path, stageId: raw.stage.id,
    readOfRecord: { word: raw.reads?.selected ?? null, sentence: raw.reads?.sentence ?? null },
    r1Levels: raw.r1?.levels === undefined ? null
      : Object.fromEntries(Object.entries(raw.r1.levels)
        .map(([k, v]) => [k, (v as { mean?: number }).mean ?? null])),
  };
};
const DST1C_QUOTED = pickRead(DST1C_ARTIFACT);
const DST1D_QUOTED = pickRead(DST1D_ARTIFACT);
/** ⭐⭐⭐ ⭐ AMENDMENT — IF-T1's OWN READ OF RECORD, quoted BY FIELD (#423 item 3(vii): §0 quotes
 *  IF-T1's read of record and its table BY FIELD). */
const IFT1_QUOTED = pickRead(IFT1_ARTIFACT);

/** ⭐⭐⭐ gRepro, ARCHITECTURE-AWARE (#420 item 2(iv), standing on #418 item 2(v)) — the RE-WALK
 *  of IF-C0's `12,558,000–002` on `OWNCOOP-E13` and `HATS-E13` (IF-C0's OWN arm names, the same
 *  construction) against its stored `perSeedCells[]`.
 *  ⭐ IT GATES **ONLY ON arm64**. On x64 — this host — every recorded IF-C0 number is an arm64
 *  number that this architecture does not reproduce (#418 item 1, MEASURED on five machines), so
 *  the re-walked rows are STORED BESIDE IF-C0's at `repro.rows` with EVERY differing field
 *  enumerated, and `gRepro` reads '≈ cross-architecture (stored, not gated)'. The instrument's
 *  OWN determinism (`gDeterminism`) and `gLockstep` carry the reproduction burden here.
 *  ⚠ FIELDS WHOSE SHAPE CHANGED are excluded and NAMED: this exam's classifier has TEN cells
 *  where IF-C0's had NINE, so every array keyed by the run class is a different length. */
const HOST_ARCH = process.arch;
const REPRO_GATES_HERE = HOST_ARCH === 'arm64';
const REPRO_ARM_PAIRS: readonly { mine: Arm; theirs: string }[] = [
  { mine: 'HATS-E13', theirs: 'HATS-E13' },
  { mine: 'OWNCOOP-E13', theirs: 'OWNCOOP-E13' },
];
const reproDetail = (() => {
  const base = {
    architecture: HOST_ARCH, gatesOnThisArchitecture: REPRO_GATES_HERE,
    seeds: REPRO_SEEDS, armPairs: REPRO_ARM_PAIRS,
    against: IFC0_ARTIFACT,
    verdictWord: REPRO_GATES_HERE ? 'GATED (arm64, the architecture of record)'
      : '≈ cross-architecture (stored, not gated)',
  };
  if (!existsSync(IFC0_ARTIFACT)) {
    return { ...base, ran: false, ok: false, comparedFields: [] as string[],
      shapeChangedFields: [] as string[],
      rows: [] as { seed: number; arm: string; mismatches: string[];
        delta: Record<string, [unknown, unknown]> }[],
      note: `the IF-C0 artifact is absent at ${IFC0_ARTIFACT}` };
  }
  const raw = JSON.parse(readFileSync(IFC0_ARTIFACT, 'utf8')) as {
    perSeedCells: (Record<string, unknown> & { seed: number })[];
  };
  const mineKeys = Object.keys(emptyRow());
  const mineSample = emptyRow() as unknown as Record<string, unknown>;
  let fields: string[] = [];
  let shapeChanged: string[] = [];
  const rows: { seed: number; arm: string; mismatches: string[];
    delta: Record<string, [unknown, unknown]> }[] = [];
  for (const pair of REPRO_ARM_PAIRS) {
    const bySeed = new Map(raw.perSeedCells
      .filter((c) => REPRO_SEEDS.includes(c.seed))
      .map((c) => [c.seed, JSON.parse(JSON.stringify(c[pair.theirs])) as
        Record<string, unknown>]));
    const first = bySeed.get(REPRO_SEEDS[0]);
    const shared = first === undefined ? [] : mineKeys.filter((k) => k !== 'wallMs'
      && Object.prototype.hasOwnProperty.call(first, k));
    const bad = shared.filter((k) => Array.isArray(mineSample[k])
      && Array.isArray(first?.[k])
      && (mineSample[k] as unknown[]).length !== (first?.[k] as unknown[]).length);
    const f = shared.filter((k) => !bad.includes(k));
    if (f.length > fields.length) { fields = f; shapeChanged = bad; }
    for (const seed of REPRO_SEEDS) {
      const theirs = bySeed.get(seed);
      if (theirs === undefined) {
        rows.push({ seed, arm: pair.theirs, mismatches: ['ABSENT FROM IF-C0'], delta: {} });
        continue;
      }
      const mine = walkMatch(buildMatch(seed, pair.mine), pair.mine, true) as
        unknown as Record<string, unknown>;
      const diff = f.filter((k) => JSON.stringify(mine[k]) !== JSON.stringify(theirs[k]));
      const d: Record<string, [unknown, unknown]> = {};
      for (const k of diff) d[k] = [mine[k], theirs[k]];
      rows.push({ seed, arm: pair.theirs, mismatches: diff, delta: d });
    }
  }
  return {
    ...base, ran: true,
    ok: REPRO_GATES_HERE
      ? (fields.length > 0 && rows.length === REPRO_ARM_PAIRS.length * REPRO_SEEDS.length
        && rows.every((r) => r.mismatches.length === 0))
      : (fields.length > 0 && rows.length === REPRO_ARM_PAIRS.length * REPRO_SEEDS.length),
    comparedFields: fields, shapeChangedFields: shapeChanged, rows,
    note: '⭐⭐⭐ gRepro, ARCHITECTURE-AWARE: `HATS-E13` and `OWNCOOP-E13` (IF-C0\'s own arm names '
      + 'and its own construction) re-walked on IF-C0\'s OWN CONSUMED BAND (12,558,000–002 — NOT '
      + 'a consumption) and compared FIELD FOR FIELD against its stored `perSeedCells[]`. ON '
      + 'arm64 a mismatch is RED. ON x64 — THIS HOST — IF-C0\'s numbers are arm64 numbers that '
      + 'this architecture does not reproduce (#418 item 1), so the rows are STORED with every '
      + 'differing field enumerated and NOTHING IS GATED on them; `gDeterminism` and `gLockstep` '
      + 'carry the reproduction burden here. ⚠ Fields whose SHAPE changed (this exam\'s '
      + 'classifier has TEN cells where IF-C0\'s had NINE) are excluded and NAMED in '
      + '`shapeChangedFields`; `wallMs` (a machine timing) is excluded as always.',
  };
})();
/** ⭐⭐⭐ ⭐ AMENDMENT (#423 item 3(iv)) — THE **SAME-ARCHITECTURE** RE-WALK: IF-T1's own
 *  `12,559,000–002` re-walked HERE, on THIS host, against `if-t1-flight-run-exam.json`'s
 *  `perSeedCells[]`, field for field.
 *  ⭐ THIS ONE **GATES** on the CONTROL ARMS — `OWNCOOP-E13` and `HATS-E13` carry NO flight
 *  door, so the amended seam is DORMANT on them and their rows CANNOT have moved; a mismatch
 *  there is RED, and it is the strongest reproduction receipt this host can give.
 *  ⭐ ON THE CANDIDATE ARM `OWNCOOP+IF-E13` the differences are **STORED AND ENUMERATED**, never
 *  gated: M-IF.5 and M-IF.6 narrowed the eighth state between the two stages, so the candidate
 *  arm's rows MUST differ BY CONSTRUCTION — *the seam changed, not the host*.
 *  ⚠ Fields this exam ADDED (the two new start-state partitions) are absent from IF-T1's rows
 *  and are excluded by the shared-key filter; `wallMs` (a machine timing) is excluded as
 *  always; any field whose ARRAY SHAPE differs is excluded and NAMED. */
const REPRO_T1_SEEDS = [12_559_000, 12_559_001, 12_559_002];
const REPRO_T1_GATED_ARMS: readonly Arm[] = ['HATS-E13', 'OWNCOOP-E13'];
const REPRO_T1_STORED_ARMS: readonly Arm[] = ['OWNCOOP+IF-E13'];
const reproIfT1Detail = (() => {
  const base = {
    architecture: HOST_ARCH, sameArchitectureAsIfT1: IFT1 !== null
      && IFT1.hostArchitecture === HOST_ARCH,
    seeds: REPRO_T1_SEEDS, gatedArms: REPRO_T1_GATED_ARMS, storedArms: REPRO_T1_STORED_ARMS,
    against: IFT1_ARTIFACT,
    verdictWord: 'GATED on the CONTROL arms (the seam is dormant there), STORED on the '
      + 'CANDIDATE arm (the seam changed, not the host)',
  };
  if (!existsSync(IFT1_ARTIFACT)) {
    return { ...base, ran: false, ok: false, comparedFields: [] as string[],
      shapeChangedFields: [] as string[],
      rows: [] as { seed: number; arm: string; gated: boolean; mismatches: string[];
        delta: Record<string, [unknown, unknown]> }[],
      note: `the IF-T1 artifact is absent at ${IFT1_ARTIFACT}` };
  }
  const raw = JSON.parse(readFileSync(IFT1_ARTIFACT, 'utf8')) as {
    perSeedCells: (Record<string, unknown> & { seed: number })[];
  };
  const mineKeys = Object.keys(emptyRow());
  const mineSample = emptyRow() as unknown as Record<string, unknown>;
  let fields: string[] = [];
  let shapeChanged: string[] = [];
  const rows: { seed: number; arm: string; gated: boolean; mismatches: string[];
    delta: Record<string, [unknown, unknown]> }[] = [];
  for (const armK of [...REPRO_T1_GATED_ARMS, ...REPRO_T1_STORED_ARMS]) {
    const gated = (REPRO_T1_GATED_ARMS as readonly string[]).includes(armK);
    const bySeed = new Map(raw.perSeedCells
      .filter((c) => REPRO_T1_SEEDS.includes(c.seed))
      .map((c) => [c.seed, JSON.parse(JSON.stringify(c[armK])) as Record<string, unknown>]));
    const first = bySeed.get(REPRO_T1_SEEDS[0]);
    const shared = first === undefined ? [] : mineKeys.filter((k) => k !== 'wallMs'
      && Object.prototype.hasOwnProperty.call(first, k));
    const bad = shared.filter((k) => Array.isArray(mineSample[k])
      && Array.isArray(first?.[k])
      && (mineSample[k] as unknown[]).length !== (first?.[k] as unknown[]).length);
    const f = shared.filter((k) => !bad.includes(k));
    if (f.length > fields.length) { fields = f; shapeChanged = bad; }
    for (const seed of REPRO_T1_SEEDS) {
      const theirs = bySeed.get(seed);
      if (theirs === undefined) {
        rows.push({ seed, arm: armK, gated, mismatches: ['ABSENT FROM IF-T1'], delta: {} });
        continue;
      }
      const mine = walkMatch(buildMatch(seed, armK), armK, true) as
        unknown as Record<string, unknown>;
      const diff = f.filter((k) => JSON.stringify(mine[k]) !== JSON.stringify(theirs[k]));
      const d: Record<string, [unknown, unknown]> = {};
      for (const k of diff) d[k] = [mine[k], theirs[k]];
      rows.push({ seed, arm: armK, gated, mismatches: diff, delta: d });
    }
  }
  const gatedRows = rows.filter((r) => r.gated);
  return {
    ...base, ran: true,
    ok: fields.length > 0
      && rows.length === (REPRO_T1_GATED_ARMS.length + REPRO_T1_STORED_ARMS.length)
        * REPRO_T1_SEEDS.length
      && gatedRows.length === REPRO_T1_GATED_ARMS.length * REPRO_T1_SEEDS.length
      && gatedRows.every((r) => r.mismatches.length === 0),
    comparedFields: fields, shapeChangedFields: shapeChanged, rows,
    candidateArmDifferingFields: [...new Set(rows.filter((r) => !r.gated)
      .flatMap((r) => r.mismatches))].sort(),
    note: '⭐⭐⭐ THE SAME-ARCHITECTURE RE-WALK (#423 item 3(iv)): IF-T1\'s OWN CONSUMED BAND '
      + '12,559,000–002 (NOT a consumption) re-walked on THIS host and compared FIELD FOR '
      + 'FIELD to `if-t1-flight-run-exam.json`\'s `perSeedCells[]`. The CONTROL ARMS '
      + '`OWNCOOP-E13` and `HATS-E13` carry no flight door, so the amended seam is DORMANT on '
      + 'them and their rows CANNOT have moved — those rows GATE, and a mismatch is RED. The '
      + 'CANDIDATE arm `OWNCOOP+IF-E13` MUST differ by construction (M-IF.5 and M-IF.6 '
      + 'narrowed the eighth state between IF-T1 and IF-T0b), so its differing fields are '
      + 'STORED AND ENUMERATED in `candidateArmDifferingFields`: ⭐ THE SEAM CHANGED, NOT THE '
      + 'HOST. Fields this exam ADDED are absent from IF-T1\'s rows and are excluded by the '
      + 'shared-key filter; `wallMs` is excluded as always; shape-changed fields are NAMED.',
  };
})();
const REPRO_IFT1_OK = reproIfT1Detail.ok;
const REPRO_OK = reproDetail.ok && REPRO_IFT1_OK;
const REPRO_FIELDS_DIFFERING = [...new Set(reproDetail.rows
  .flatMap((r) => r.mismatches))].sort();
banner(`  gRepro (same-architecture re-walk vs IF-T1) ${REPRO_IFT1_OK ? 'GREEN' : 'RED'} `
  + `(${reproIfT1Detail.comparedFields.length} fields; control rows `
  + `${reproIfT1Detail.rows.filter((r) => r.gated && r.mismatches.length === 0).length}/`
  + `${reproIfT1Detail.rows.filter((r) => r.gated).length} EXACT; candidate differing fields `
  + `${(reproIfT1Detail as { candidateArmDifferingFields?: string[] })
    .candidateArmDifferingFields?.length ?? 0})`);
banner(`  gRepro (${HOST_ARCH}, ${REPRO_GATES_HERE ? 'GATED' : 'STORED'}) `
  + `${REPRO_OK ? 'GREEN' : 'RED'} `
  + `(${reproDetail.comparedFields.length} fields × ${reproDetail.rows.length} arm-seed rows; `
  + `${REPRO_FIELDS_DIFFERING.length} fields differ)`);

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

/* ---- ⭐⭐⭐ THE COUPLING FACES DS-C0 NAMED, COMPLETED (#413 item 5(ii)) — every DS-C0 field
   name published PER MATCH so no share can hide a moving denominator, and the TWO DISAPPEARING
   FACES given their own per-match faces. ⛔ NO VERDICT WORD ON ANY OF THEM. ---- */
defFace('coupling.overlapArrivalsPerMatch', 'overlap arrivals per match',
  '⭐⭐⭐ A DISAPPEARING FACE — `overlapArrivedStat` (the ENGINE\'S OWN `stats.overlaps` ledger: '
  + 'the release LANDED wide on the overlapper) DIVIDED BY MATCHES. This is one of the two '
  + 'things world 17 would lose. ⛔ PRINTED, NEVER JUDGED.',
  'matches', (r) => r.overlapArrivedStat, ONE);
defFace('coupling.overlapConfrontedPerMatch', 'confronted 套边 preconditions per match',
  'DS-C0\'s `overlapConfronted` — the gate-passing coach ticks whose carrier was CONFRONTED — '
  + 'per match', 'matches', (r) => r.overlapConfronted, ONE);
defFace('coupling.overlapReleaseFiresPerMatch', 'exact overlap-release reads per match',
  'DS-C0\'s `overlapReleaseFires` (= `fireOverlapReleaseExact`) per match', 'matches',
  (r) => r.overlapReleaseFires, ONE);
/* the PASSER'S HAT-READ FIRES BY SITE — DS-C0's `passerReadTable`, MEASURED per arm, in BOTH
   fractions (per match and per carrier decision tick). */
defFace('passer.wallReturnFiresPerMatch', 'wall-return reads per match',
  '⚠ AN UPPER BOUND (DS-C0\'s own word): a mate\'s LIVE `wallRun` naming this carrier at his '
  + 'own decision tick — the read\'s INPUT, not its win', 'matches',
  (r) => r.fireWallReturnUpperBound, ONE);
defFace('passer.wallReturnFiresPerMatch.perCarrierTick', 'share',
  'the same, per CARRIER DECISION TICK', 'carrier decision ticks',
  (r) => r.fireWallReturnUpperBound, (r) => r.carrierDecisionTicks);
defFace('passer.thirdManFiresPerMatch', 'third-man reads per match',
  '⚠ AN UPPER BOUND: a mate RUNNING who did not play him the ball, inside 1.5 s of the '
  + 'completion — an ACTION-TYPE read, not a label', 'matches',
  (r) => r.fireThirdManUpperBound, ONE);
defFace('passer.thirdManFiresPerMatch.perCarrierTick', 'share',
  'the same, per CARRIER DECISION TICK', 'carrier decision ticks',
  (r) => r.fireThirdManUpperBound, (r) => r.carrierDecisionTicks);
defFace('passer.overlapReleaseFiresPerMatch', 'overlap-release reads per match',
  '⭐ EXACT (the three conjuncts are the source\'s own): `team.overlapper === mate.index` AND '
  + 'wide AND not far behind — a LABEL read', 'matches',
  (r) => r.fireOverlapReleaseExact, ONE);
defFace('passer.overlapReleaseFiresPerMatch.perCarrierTick', 'share',
  'the same, per CARRIER DECISION TICK', 'carrier decision ticks',
  (r) => r.fireOverlapReleaseExact, (r) => r.carrierDecisionTicks);
defFace('passer.arriverCutbackFormedPerMatch', 'cutback candidates formed per match',
  'a `cutback to …` candidate present in the carrier\'s own decision record — a LABEL read '
  + '(`team.arriver`)', 'matches', (r) => r.fireArriverCutbackFormed, ONE);
defFace('passer.arriverCutbackFormedPerMatch.perCarrierTick', 'share',
  'the same, per CARRIER DECISION TICK', 'carrier decision ticks',
  (r) => r.fireArriverCutbackFormed, (r) => r.carrierDecisionTicks);
defFace('passer.arriverCutbackTakenPerMatch', 'cutbacks taken per match',
  'the cutback candidate WON the carrier\'s decision', 'matches',
  (r) => r.fireArriverCutbackTaken, ONE);
defFace('passer.arriverCutbackTakenPerMatch.perCarrierTick', 'share',
  'the same, per CARRIER DECISION TICK', 'carrier decision ticks',
  (r) => r.fireArriverCutbackTaken, (r) => r.carrierDecisionTicks);
defFace('passer.carrierDecisionTicksPerMatch', 'carrier decision ticks per match',
  'THE PASSER-READ DENOMINATOR ITSELF, per match', 'matches',
  (r) => r.carrierDecisionTicks, ONE);

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
/* ---- ⭐⭐⭐ DS-T1c — THE SEAM'S FACES, ADAPTED TO THE RANK LAW (#410 item 3(ii)) ---- */
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
defFace('restraint.rankBelowCountShare', 'share',
  '⭐⭐⭐ THE OBSERVABLE THE RANK LAW LEAVES — the share of RECOVERABLE own-run candidates on which '
  + '`rankAbove < count`, which by M-DS.6″(c) is EXACTLY the share whose restraint is 1. ⛔ THE '
  + 'EXACT `rankAbove` IS NOT RECOVERABLE FROM A SCORE, so no rank distribution is published. '
  + '⛔ NO VERDICT WORD', 'backed-out restraint observations',
  (r) => r.restraintExactOne, (r) => r.restraintN);
defFace('restraint.neitherZeroNorOneShare', 'share',
  '⚠ A SELF-DIAGNOSING RECEIPT: the share of backed-out restraint observations that landed on '
  + 'NEITHER exactly 0 nor exactly 1. Under the rank law the restraint is a STEP, so the law '
  + 'predicts this share is 0; a non-zero value is FLOAT residue in the back-out and is '
  + 'PUBLISHED, never folded away', 'backed-out restraint observations',
  (r) => r.restraintNeitherZeroNorOne, (r) => r.restraintN);
defFace('seam.priorZeroShare', 'share',
  '⭐⭐⭐ THE DF CLAMP\'S OWN SHARE — the share of VISIBLE own-run candidates whose prior, '
  + 'RECOMPUTED from the body\'s own pos and role (no snapshot read), is EXACTLY 0. There the '
  + 'score is 0 whatever the restraint was and the back-out\'s denominator is zero, so the '
  + 'restraint is NOT RECOVERABLE — this IS the ambiguous overlap, stored as its own face. '
  + '⛔ NO VERDICT WORD', 'visible own-run candidates',
  (r) => r.ownCandidatePriorZero, (r) => r.ownCandidateVisible);
defFace('seam.priorAboveZeroShare', 'share',
  'the complement — visible own-run candidates whose recomputed prior is ABOVE zero, i.e. the '
  + 'population on which the restraint IS recoverable', 'visible own-run candidates',
  (r) => r.ownCandidatePriorAbove, (r) => r.ownCandidateVisible);
defFace('seam.priorZeroPerMatch', 'zero-prior own-run candidates per match',
  'the numerator above, per match', 'matches', (r) => r.ownCandidatePriorZero, ONE);
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

/* ---- ⭐⭐⭐ THE EIGHTH CLASS: ITS OWN EPISODE FAMILY (the seventh's, mirrored) ---- */
defFace('ifRun.decisionsPerMatch', 'eighth-`why` decisions per match',
  '⭐⭐⭐ THE EIGHTH `why` ITSELF — attacking `MakeRun` decisions (off-ball bodies AND the '
  + 'keeper) whose winning `why` is the EIGHTH LITERAL, per match. THIS IS THE COUNT `gBiteIF`\'s '
  + 'non-vacuity stands on. ⛔ NO VERDICT WORD', 'matches', (r) => r.ifWhyDecisions, ONE);
defFace('ifRun.episodesPerMatch', 'eighth-class episodes per match',
  '⭐⭐⭐ AN EIGHTH-CLASS EPISODE — one body\'s CONSECUTIVE `MakeRun` ticks whose winning `why` '
  + 'is the EIGHTH literal, read off the engine\'s own decision record', 'matches',
  (r) => r.ifEpSets, ONE);
defFace('ifRun.meanTicksPerEpisode', 'ticks per episode',
  'the mean length of an eighth-class episode', 'eighth-class episodes',
  (r) => r.ifEpTicks, (r) => r.ifEpSets);
defFace('ifRun.passAimedPerEpisode', 'passes aimed per episode',
  `passes AIMED at him inside the episode or within ${YIELD_WINDOW_SECONDS} s of its clear`,
  'eighth-class episodes', (r) => r.ifEpPassAimed, (r) => r.ifEpSets);
defFace('ifRun.passCompletedPerEpisode', 'completions per episode',
  'passes COMPLETED to him in the same window', 'eighth-class episodes',
  (r) => r.ifEpPassCompleted, (r) => r.ifEpSets);
defFace('ifRun.throughShare', 'share',
  'the engine\'s own through classification on passes aimed in the window',
  'eighth-class passes aimed', (r) => r.ifEpPassThrough, (r) => r.ifEpPassAimed);
defFace('ifRun.shotsPerEpisode', 'shots per episode',
  '⭐⭐ SHOTS BY HIM in the window — THE EIGHTH CLASS\'S OWN YIELD (#420 item 2(ii))',
  'eighth-class episodes', (r) => r.ifEpShots, (r) => r.ifEpSets);
defFace('ifRun.goalsPerEpisode', 'goals per episode',
  'goals BY HIM in the window, joined through the shooter gid recorded AT THE PUSH',
  'eighth-class episodes', (r) => r.ifEpGoals, (r) => r.ifEpSets);
defFace('ifRun.shotsPerMatch', 'eighth-class-episode shots per match',
  'the numerator above, per match (the two-fractions companion)', 'matches',
  (r) => r.ifEpShots, ONE);
defFace('ifRun.episodesActiveAtFullTime', 'eighth-class episodes open at full time',
  '⭐⭐ DEBT (c): episodes STILL ACTIVE at the whistle — COUNTED, never binned', 'matches',
  (r) => r.ifEpActiveAtFullTime, ONE);
/* ---- ⭐⭐⭐ THE EIGHTH CLASS: THE START-STATE PARTITION ---- */
for (const bm of BALL_MOTION) {
  defFace(`ifStart.ballMotionShare.${bm}`, 'share',
    `⭐⭐⭐ THE START-STATE PARTITION — the ${bm} share of eighth-class run starts, read off the `
    + 'runner\'s OWN perceived ball at the start tick. ⚠ `|vel| > 0` IS A STORED PARTITION, '
    + 'NEVER A GATE', 'stamped eighth-class run starts',
    (r) => r.ifStartBallMotion[BMI(bm)], (r) => sum(r.ifStartBallMotion));
}
for (const mc of MEMORY_CELLS) {
  defFace(`ifStart.memoryShare.${mc}`, 'share',
    `⭐⭐⭐ THE MEMORY PARTITION — the ${mc} share of eighth-class run starts, read off `
    + '`match.ifLastSeenOwnerGid` (THE ONE NEW REGISTERED LEDGER READ, registry 87)',
    'stamped eighth-class run starts',
    (r) => r.ifStartMemoryCells[MMI(mc)], (r) => sum(r.ifStartMemoryCells));
}
for (const st of STATES) {
  defFace(`ifStart.truthStateShare.${st}`, 'share',
    `the ${st} share of eighth-class run starts, by the ENGINE\'S OWN truth state`,
    'stamped eighth-class run starts',
    (r) => r.ifStartStateBins[SI(st)], (r) => sum(r.ifStartStateBins));
}
/* ---- ⭐ AMENDMENT (#423 item 3(i)) — BY PHASE and BY LOOK DISTANCE, both STORED ---- */
for (const pc of PHASE_CELLS) {
  defFace(`ifStart.phaseShare.${pc}`, 'share',
    `⭐ AMENDMENT — THE START STATE BY PHASE: the ${pc} share of eighth-class run starts. `
    + 'M-IF.5 requires the game LIVE, so `playing` is expected to read 1.000000 BY '
    + 'CONSTRUCTION. ⛔ A STORED RECEIPT, NEVER A GATE, NEVER NARRATED',
    'stamped eighth-class run starts',
    (r) => r.ifStartPhaseCells[PHI(pc)], (r) => sum(r.ifStartPhaseCells));
}
for (const ld of LOOK_DISTANCE_CELLS) {
  defFace(`ifStart.lookDistanceShare.${ld}`, 'share',
    `⭐ AMENDMENT — THE START STATE BY LOOK DISTANCE: the ${ld} share of eighth-class run `
    + 'starts (his current look MINUS the look that wrote his belief). M-IF.6 admits the '
    + 'eighth state ONLY at distance 1, so `distance1` is expected to read 1.000000 BY '
    + 'CONSTRUCTION. ⛔ A STORED RECEIPT OF M-IF.6, NEVER A GATE, NEVER NARRATED',
    'stamped eighth-class run starts',
    (r) => r.ifStartLookDistanceCells[LDI(ld)], (r) => sum(r.ifStartLookDistanceCells));
}
defFace('ifStart.stampedStartsPerMatch', 'stamped eighth-class run starts per match',
  'the denominator of the four partitions above, per match', 'matches',
  (r) => sum(r.ifStartBallMotion), ONE);
/* ---- ⭐⭐⭐ THE EIGHTH CLASS: THE RESTRAINT PARTITION (#419 item 3\'s face) ---- */
defFace('ifRestraint.mean', 'restraint (a multiplier in [0, 1])',
  '⭐⭐⭐ THE EIGHTH STATE\'S OWN RESTRAINT, backed out of the candidate carrying the EIGHTH '
  + '`why`. In that state `ownerGid === null`, so the rank loop skips NOBODY and the body he '
  + 'REMEMBERS with the ball is ranked like any mate (#419 item 3, ACCEPTED AS THE LAW). '
  + '⛔ NO VERDICT WORD', 'backed-out eighth-class observations',
  (r) => r.ifRestraintSum, (r) => r.ifRestraintN);
defFace('ifRestraint.exactlyZeroShare', 'share',
  '⭐⭐ the share at EXACTLY 0 — the count his eyes say is ALREADY running',
  'backed-out eighth-class observations', (r) => r.ifRestraintExactZero, (r) => r.ifRestraintN);
defFace('ifRestraint.exactlyOneShare', 'share',
  '⭐⭐ the share at EXACTLY 1 — nobody his eyes hold outranks him',
  'backed-out eighth-class observations', (r) => r.ifRestraintExactOne, (r) => r.ifRestraintN);
defFace('ifRestraint.betweenShare', 'share',
  '⚠ A SELF-DIAGNOSING RECEIPT: NEITHER exactly 0 nor exactly 1. Under the rank law the '
  + 'restraint is a STEP, so the law predicts 0; a non-zero value is FLOAT residue and is '
  + 'PUBLISHED', 'backed-out eighth-class observations',
  (r) => r.ifRestraintNeither, (r) => r.ifRestraintN);
defFace('ifRestraint.observationsPerMatch', 'backed-out eighth-class observations per match',
  'the denominator above, per match', 'matches', (r) => r.ifRestraintN, ONE);
defFace('ifRestraint.candidatesPerMatch', 'visible eighth-class candidates per match',
  'attacking off-ball decision ticks whose engine record CARRIES the eighth-`why` candidate. '
  + '⚠ A FLOOR — the record stores only the TOP FOUR candidates', 'matches',
  (r) => r.ifCandidateVisible, ONE);
defFace('belief.entriesPerMatch', 'belief entries at full time per match',
  '⭐⭐ `match.ifLastSeenOwnerGid`\'s SIZE at the whistle — how many bodies ever saw a ball with '
  + 'an owner under the door. ZERO by construction on every arm without the door (`gArmIF`)',
  'matches', (r) => r.beliefEntriesAtFullTime, ONE);
defFace('look.entriesPerMatch', 'look-counter entries at full time per match',
  '⭐ AMENDMENT — `match.ifLook`\'s SIZE at the whistle: how many bodies ever LOOKED under the '
  + 'door (M-IF.6\'s own cadence). ZERO by construction on every arm without the door '
  + '(`gArmIF`). THE SECOND REGISTERED READ OF THIS STAGE (registry 87 → 88)',
  'matches', (r) => r.lookEntriesAtFullTime, ONE);

/* ---- ⭐⭐⭐ IF-C0\'S Q4 FACES, COPIED BY FIELD NAME (#420 item 2(ii)) ---- */
defFace('run.startsPerMatch', 'run episodes started per match',
  'POPULATION R — every `MakeRun` episode, stamped at its START tick', 'matches',
  (r) => r.runStartsAll, ONE);
defFace('run.inFlightShare', 'share',
  '⭐⭐⭐ IF-C0\'S `run.inFlightShare` — the share of run starts taken while the TRUTH ball is '
  + 'in flight (`ball.owner === null`, `phase === \'playing\'`, possession his side)',
  'run starts', (r) => r.runStartsInFlight, (r) => r.runStartsAll);
defFace('run.inFlightStartsPerMatch', 'in-flight run starts per match',
  'the numerator above, per match', 'matches', (r) => r.runStartsInFlight, ONE);
for (const c of [IF_CLASS, 'ownRunInBehind'] as const) {
  defFace(`run.inFlightShare.${c}`, 'share',
    `the in-flight share of ${c} run starts`, `${c} run starts`,
    (r) => r.runStartsInFlightByClass[RCI(c)], (r) => r.runStartsByClass[RCI(c)]);
}
defFace('flight.startsOnHisSidesPassPerMatch', 'in-flight starts on his side\'s pass per match',
  'in-flight run starts whose live `pendingPass` belongs to HIS SIDE — the denominator of the '
  + 'intended-receiver share', 'matches', (r) => r.runStartsInFlightOwnSidePass, ONE);
defFace('flight.intendedReceiverShare', 'share',
  '⭐⭐⭐ IF-C0\'S `flight.intendedReceiverShare` — of the in-flight run starts on HIS SIDE\'S '
  + 'pass, the share where the engine\'s own aim ledger names HIM as the target. ⭐ FIXTURED '
  + 'here (the firing / non-firing pair inherited from `tests/ifFlightRun.test.ts`)',
  'in-flight starts on his side\'s pass',
  (r) => r.runStartsInFlightIntended, (r) => r.runStartsInFlightOwnSidePass);
defFace('flight.towardHimShare', 'share',
  'the share of those starts on which the flight\'s own velocity is CLOSING on him',
  'in-flight starts on his side\'s pass',
  (r) => r.runStartsInFlightToward, (r) => r.runStartsInFlightOwnSidePass);
for (let k = 0; k < DT_BINS.length; k++) {
  defFace(`dt.binShare.${DT_BINS[k]}`, 'share',
    `the ${DT_BINS[k]} share of ATTACHED run starts (Δt = the attached release − the run\'s `
    + 'start)', 'attached run starts',
    (r) => sum(r.dtBinsByClass.slice(k * RUN_CLASSES.length, (k + 1) * RUN_CLASSES.length)),
    (r) => sum(r.dtBinsByClass));
}
defFace('dt.negativeShare', 'share',
  '⭐⭐⭐ IF-C0\'S NEGATIVE-Δt HALF — the share of ATTACHED run starts whose release came FIRST: '
  + 'a run onto a ball ALREADY TRAVELLING. ⛔ NO VERDICT WORD', 'attached run starts',
  (r) => sum(r.dtBinsByClass.slice(0, DT_NEGATIVE_BINS * RUN_CLASSES.length)),
  (r) => sum(r.dtBinsByClass));
for (const c of [IF_CLASS, 'ownRunInBehind'] as const) {
  defFace(`dt.negativeShare.${c}`, 'share',
    `the negative-Δt share of ATTACHED ${c} run starts`, `attached ${c} run starts`,
    (r) => sum(Array.from({ length: DT_NEGATIVE_BINS },
      (_, k) => r.dtBinsByClass[k * RUN_CLASSES.length + RCI(c)])),
    (r) => sum(Array.from({ length: DT_BINS.length },
      (_, k) => r.dtBinsByClass[k * RUN_CLASSES.length + RCI(c)])));
}
defFace('dt.attachedStartsPerMatch', 'attached run starts per match',
  'the denominator above, per match', 'matches', (r) => sum(r.dtBinsByClass), ONE);
defFace('dt.noAttachedReleaseShare', 'share',
  '⚠ THE RESIDUAL, ENUMERATED: run starts that never found a release of their own side and are '
  + 'NOT binned', 'run starts', (r) => r.dtNoAttachedRelease, (r) => r.runStartsAll);
defFace('release.perMatch', 'releases per match',
  'every NEW `pendingPass` entering the engine\'s own aim ledger', 'matches',
  (r) => r.releases, ONE);
defFace('release.runnersAtReleaseMean', 'same-side bodies already running at the release',
  '⭐⭐⭐ IF-C0\'S OWN FACE — the count of same-side outfield bodies whose current action is '
  + '`MakeRun` at the tick the release enters the ledger. ⛔ NO VERDICT WORD', 'releases',
  (r) => r.releaseRunnerSum, (r) => r.releases);
for (let k = 0; k < REL_RUNNER_BINS; k++) {
  defFace(`release.runnerBinShare.${k === REL_RUNNER_BINS - 1 ? `${k}plus` : k}`, 'share',
    `the share of releases with ${k}${k === REL_RUNNER_BINS - 1 ? '+' : ''} same-side bodies `
    + 'already running', 'releases', (r) => r.releaseRunnerBins[k], (r) => r.releases);
}
for (const rc of RECEIVER_CLASSES) {
  defFace(`receiver.classShare.${rc}`, 'share',
    `⭐⭐⭐ IF-C0\'S \`receiver.classShare\` — the ${rc} share of the EVENTUAL RECEIVERS of `
    + 'completed passes joined to their own flight', 'completions joined to a flight',
    (r) => r.receiverClass[RVI(rc)], (r) => r.completionsJoinedToAFlight);
  defFace(`receiver.classPerMatch.${rc}`, `${rc} receivers per match`,
    'the numerator above, per match', 'matches', (r) => r.receiverClass[RVI(rc)], ONE);
  defFace(`receiver.intendedClassShare.${rc}`, 'share',
    `the ${rc} share of the INTENDED receivers alone`, 'intended receivers',
    (r) => r.receiverClassIntended[RVI(rc)], (r) => r.receiverIsIntended);
}
defFace('receiver.completionsPerMatch', 'completions joined to a flight per match',
  'the denominator above, per match', 'matches', (r) => r.completionsJoinedToAFlight, ONE);
defFace('receiver.intendedShare', 'share',
  'the share of joined completions that reached the aim ledger\'s own target',
  'completions joined to a flight',
  (r) => r.receiverIsIntended, (r) => r.completionsJoinedToAFlight);
for (const lc of LEAK_CELLS) {
  defFace(`leak.cellShare.${lc}`, 'share',
    `⭐⭐⭐ IF-C0\'S LEAK PARTITION — the ${lc} share of SEVENTH-class run starts taken with the `
    + 'TRUTH ball in flight. ⛔ UNCHANGED BY CONSTRUCTION (contract §4 does not touch the leak); '
    + 'PRINTED, NEVER JUDGED', 'seventh-class in-flight run starts',
    (r) => r.leakCells[LKI(lc)], (r) => r.leakOwnRunsInFlight);
  defFace(`leak.cellPerMatch.${lc}`, `${lc} per match`, 'the numerator above, per match',
    'matches', (r) => r.leakCells[LKI(lc)], ONE);
}
defFace('leak.inFlightSeventhStartsPerMatch', 'seventh-class in-flight run starts per match',
  'the denominator above, per match', 'matches', (r) => r.leakOwnRunsInFlight, ONE);
for (const pc of PERCEIVED) {
  defFace(`perceived.cellShare.${pc}`, 'share',
    `the ${pc} share of the runner\'s OWN perceived ball at a stamped own-run start`,
    'stamped own-run starts', (r) => r.perceivedCells[PCI(pc)], (r) => r.perceivedStamped);
}
defFace('perceived.staleShare', 'share',
  'the share of stamped own-run starts at which the eyes NAME an owner the truth no longer '
  + 'credits — honest perception (VISION §1), never a defect', 'stamped own-run starts',
  (r) => r.perceivedStale, (r) => r.perceivedStamped);
defFace('perceived.stampedStartsPerMatch', 'stamped own-run starts per match',
  'the denominator above, per match — and the instrument\'s OWN added-pull count',
  'matches', (r) => r.perceivedStamped, ONE);
defFace('context.instrumentPullsPerMatch', 'added `perceivedSnapshot` pulls per match',
  '⚠ A RECEIPT, NEVER A FOOTBALL EFFECT SIZE: THE ONE DECLARED ADDED READ, counted. '
  + '`gPullCount` asserts it EQUALS the observed−unobserved difference on every spied pair',
  'matches', (r) => r.instrumentPulls, ONE);

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
  prior: { ifT1: ReturnType<typeof priorIfT1> };
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
      /* ⭐ AMENDMENT (#423 item 3(iii)) — THE EXACT PRIOR TWIN BESIDE EVERY FACE. */
      prior: { ifT1: priorIfT1(key, armK) },
    });
  }
}
const face = (k: string, armK: Arm): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === armK);
  if (f === undefined) { banner(`IF-T1b FATAL — unknown face ${k}/${armK}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ — the CONTRAST's TREATMENT arm MINUS its CONTROL arm, on shared seeds,
 *  with the CLUSTER BOOTSTRAP seeded from the block base. LOO in the CONSERVATIVE POINT-SHIFT
 *  form. ⭐ AMENDMENT (#413 item 5(i)): a Δ is keyed by a CONTRAST (a PAIR), not by an arm —
 *  `OWNCOOP-E13` carries TWO controls (OWN of record, HATS beside), which DS-T1c's
 *  one-control-per-arm map could not express. `arm` / `controlArm` are still stored on every
 *  row, so the re-derivation gate reads them exactly as before. */
interface DeltaRow {
  key: string; contrast: Cid; face: string; arm: Arm; controlArm: Arm;
  controlValue: number; armValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  down: boolean; up: boolean; resolved: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlipsDown: number; looFlipsUp: number;
  looFlippingSeeds: number[];
}
const pairedDelta = (faceKey: string, cid: Cid): DeltaRow => {
  const f = FACES[faceKey];
  const armK = TREAT_OF[cid];
  const ctrl = CTRL_OF[cid];
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
  const flipping: number[] = [];
  for (let i = 0; i < cells.length; i++) {
    const dLoo = ratio(tNA - nA[i], tDA - dA[i]) - ratio(tNC - nC[i], tDC - dC[i]);
    if (!Number.isFinite(dLoo)) continue;
    const inf = Math.abs(dLoo - point) / Math.max(Math.abs(point), 1e-12);
    if (inf > maxInf) maxInf = inf;
    const shift = dLoo - point;
    const fD = (hi < 0) !== (hi + shift < 0);
    const fU = (lo > 0) !== (lo + shift > 0);
    if (fD) flipsDown += 1;
    if (fU) flipsUp += 1;
    if (fD || fU) flipping.push(cells[i].seed);
  }
  return {
    key: `${faceKey}@${cid}`, contrast: cid, face: faceKey, arm: armK, controlArm: ctrl,
    controlValue: pC, armValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    down: hi < 0, up: lo > 0, resolved: hi < 0 || lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlipsDown: flipsDown, looFlipsUp: flipsUp,
    looFlippingSeeds: flipping,
  };
};
const deltas: DeltaRow[] = CONTRASTS.flatMap(
  (cid) => FACE_KEYS.map((k) => pairedDelta(k, cid)),
);
const delta = (faceKey: string, cid: Cid): DeltaRow => {
  const dd = deltas.find((x) => x.face === faceKey && x.contrast === cid);
  if (dd === undefined) { banner(`IF-T1b FATAL — unknown Δ ${faceKey}@${cid}`); process.exit(3); }
  return dd as DeltaRow;
};

/* ========================================================================== */
/* §14 R1's WORD, THE GUARDS, THE SELECTORS AND THE FROZEN READS               */
/* ========================================================================== */
/** ⭐⭐ THE PAIRED RATIO — the treatment's level ÷ its control's, on shared seeds, with the SAME
 *  cluster bootstrap. ⛔ PRINTED, NO VERDICT WORD; a ratio of two rates carries no unit. */
const pairedRatio = (faceKey: string, cid: Cid) => {
  const f = FACES[faceKey];
  const armK = TREAT_OF[cid];
  const ctrl = CTRL_OF[cid];
  const nA = cells.map((c) => f.num(c.rows[armK]));
  const dA = cells.map((c) => f.dn(c.rows[armK]));
  const nC = cells.map((c) => f.num(c.rows[ctrl]));
  const dC = cells.map((c) => f.dn(c.rows[ctrl]));
  const point = ratio(ratio(sum(nA), sum(dA)), ratio(sum(nC), sum(dC)));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nA[i]; d1 += dA[i]; n2 += nC[i]; d2 += dC[i]; }
    const v = ratio(ratio(n1, d1), ratio(n2, d2));
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return {
    key: `ratio.${faceKey}@${cid}`, contrast: cid, face: faceKey, arm: armK, controlArm: ctrl,
    armLevel: ratio(sum(nA), sum(dA)), controlLevel: ratio(sum(nC), sum(dC)),
    ratio: point, ci: [pctl(draws, 0.025), pctl(draws, 0.975)],
    halfWidth: (pctl(draws, 0.975) - pctl(draws, 0.025)) / 2,
    excludesOne: pctl(draws, 0.975) < 1 || pctl(draws, 0.025) > 1,
    note: 'the treatment arm\'s level DIVIDED BY its control\'s, cluster-bootstrapped on the '
      + 'same seeds. ⛔ PRINTED, NEVER JUDGED.',
  };
};

const TOLERANCE_FORM = 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
  + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — INHERITED BY ANCHOR from '
  + '`scripts/probes/ctb-t1-supply-exam.ts`\'s own line, cross-read from '
  + '`scripts/probes/dlc-t1-choice-exam.ts`, and EVALUATED FROM ITS TWO NUMERALS; never typed '
  + 'as a decimal. Frozen ex ante at §P.4. ⭐ CORRECTION (#421 item 4(v), applied at THIS '
  + 'freeze): on the COMPARISON OF RECORD the CONTROL IS `OWNCOOP-E13` — world 17\'s own door '
  + 'set — so the tolerance is a fraction of THAT arm\'s level. Each row\'s `controlArm` names '
  + 'its own control, and every row stores `absDeltaOverTolerance` beside it.';
/** ⭐⭐⭐ `floods(cid)` — Δ of R1's MEAN vs the contrast's CONTROL, RESOLVED UP **AND** BEYOND
 *  the tolerance. Stored per contrast; the reads stand on it. */
const R1_KEY = 'r1.runsPerInPossessionTick';
const floodRowFor = (cid: Cid) => {
  const d = delta(R1_KEY, cid);
  const control = face(R1_KEY, CTRL_OF[cid]).value;
  const tol = NI_FRACTION * Math.abs(control);
  const beyond = d.delta > tol;
  return {
    contrast: cid, label: CID_LABEL[cid], arm: TREAT_OF[cid], controlArm: CTRL_OF[cid],
    controlLevel: control,
    armLevel: d.armValue, delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    toleranceAbs: tol, toleranceForm: TOLERANCE_FORM,
    /* ⭐ CORRECTION (#421 item 4(vi), applied at THIS freeze): |Δ| ÷ tolerance is STORED as a
     * FIELD on every row, so no reader has to compute it by hand and no doc has to type it. */
    absDeltaOverTolerance: ratio(Math.abs(d.delta), tol),
    /* ⭐ #409 item 5 (the FORM RULE OF RECORD, inherited): the FLOOD selector's column is named
     * `beyondToleranceUp` — it is ONE-SIDED (`Δ > tolerance`), the `floods` conjunct itself.
     * §R2's guard table keeps the two-sided name `beyondTolerance`. */
    resolved: d.resolved, up: d.up, down: d.down, beyondToleranceUp: beyond,
    absDeltaBeyondToleranceEitherWay: Math.abs(d.delta) > tol,
    floods: d.up && beyond,
    looFlipsUp: d.looFlipsUp, looFlipsDown: d.looFlipsDown,
    looFlippingSeeds: d.looFlippingSeeds,
    floodShareAtLeastThree: face('r1.floodShareAtLeastThree', TREAT_OF[cid]).value,
    floodShareAtLeastThreeControl: face('r1.floodShareAtLeastThree', CTRL_OF[cid]).value,
  };
};
const FLOOD_ROWS = Object.fromEntries(CONTRASTS.map((c) => [c, floodRowFor(c)])) as
  Record<Cid, ReturnType<typeof floodRowFor>>;
const floods = (cid: Cid): boolean => FLOOD_ROWS[cid].floods;

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
const guardRowFor = (cid: Cid) => GUARD_LIMBS.map((l) => {
  const control = face(l.key, CTRL_OF[cid]).value;
  const tol = NI_FRACTION * Math.abs(control);
  const d = delta(l.key, cid);
  const beyond = l.direction === 'ceiling' ? d.delta > tol
    : l.direction === 'floor' ? d.delta < -tol : Math.abs(d.delta) > tol;
  /** ⭐⭐ #413 item 5(ii): every breach carries ITS DIRECTION. */
  const dir = d.resolved && beyond ? (d.delta > 0 ? 'UP' : 'DOWN') : 'none';
  return {
    id: l.id, key: l.key, what: l.what, direction: l.direction, gating: true,
    contrast: cid, arm: TREAT_OF[cid], controlArm: CTRL_OF[cid],
    controlLevel: control, armLevel: d.armValue,
    toleranceAbs: tol, toleranceForm: TOLERANCE_FORM,
    /* ⭐ CORRECTION (#421 item 4(vi), applied at THIS freeze): |Δ| ÷ tolerance is STORED as a
     * FIELD on every row, so no reader has to compute it by hand and no doc has to type it. */
    absDeltaOverTolerance: ratio(Math.abs(d.delta), tol),
    delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
    resolved: d.resolved, beyondTolerance: beyond, breach: d.resolved && beyond,
    breachDirection: dir,
    looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp,
    looFlippingSeeds: d.looFlippingSeeds,
  };
});
const GUARD_TABLE = Object.fromEntries(CONTRASTS.map((c) => [c, guardRowFor(c)])) as
  Record<Cid, ReturnType<typeof guardRowFor>>;
const OFFSIDE_ROWS = Object.fromEntries(CONTRASTS.map((cid) => {
  const d = delta('guard.offsidesPerMatch', cid);
  const control = face('guard.offsidesPerMatch', CTRL_OF[cid]).value;
  return [cid, {
    id: 'G10', key: 'guard.offsidesPerMatch', contrast: cid, arm: TREAT_OF[cid],
    controlArm: CTRL_OF[cid],
    controlLevel: control, delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    resolved: d.resolved, flag: d.resolved && d.delta > 0, gating: false,
  }];
})) as Record<Cid, { id: string; key: string; contrast: Cid; arm: Arm; controlArm: Arm;
  controlLevel: number; delta: number; ci: number[]; halfWidth: number; resolved: boolean;
  flag: boolean; gating: boolean }>;
const holdsBand = (cid: Cid): boolean => GUARD_TABLE[cid].every((g) => !g.breach);
const breachingGuards = (cid: Cid): string[] =>
  GUARD_TABLE[cid].filter((g) => g.breach).map((g) => `${g.id} ${g.key}`);
const breachSetWithDirections = (cid: Cid) =>
  GUARD_TABLE[cid].filter((g) => g.breach)
    .map((g) => ({ id: g.id, key: g.key, direction: g.breachDirection, delta: g.delta,
      ci: g.ci, toleranceAbs: g.toleranceAbs }));

/** ⭐⭐⭐ THE SELECTOR BOOLEANS, STORED PER CONTRAST. */
const selectorFor = (cid: Cid) => ({
  contrast: cid, label: CID_LABEL[cid], arm: TREAT_OF[cid], controlArm: CTRL_OF[cid],
  floods: floods(cid), holdsBand: holdsBand(cid),
  breachingGuards: breachingGuards(cid),
  breachSet: breachSetWithDirections(cid),
  offsideFlag: OFFSIDE_ROWS[cid].flag,
  armMean: FLOOD_ROWS[cid].armLevel, controlMean: FLOOD_ROWS[cid].controlLevel,
  r1Delta: FLOOD_ROWS[cid].delta, r1Ci: FLOOD_ROWS[cid].ci,
  r1Tolerance: FLOOD_ROWS[cid].toleranceAbs,
  r1Resolved: FLOOD_ROWS[cid].resolved, r1Up: FLOOD_ROWS[cid].up,
  r1BeyondToleranceUp: FLOOD_ROWS[cid].beyondToleranceUp,
  r1AbsDeltaBeyondToleranceEitherWay:
    FLOOD_ROWS[cid].absDeltaBeyondToleranceEitherWay,
});
const SELECTORS = Object.fromEntries(CONTRASTS.map((c) => [c, selectorFor(c)])) as
  Record<Cid, ReturnType<typeof selectorFor>>;

/** ⭐⭐⭐ gBiteIF — THE #414 ROW FORM, VERBATIM FROM CANON (*rare-event liveness on the row*,
 *  home: DS-T1D-COOP-HATS-EXAM.md §COMMANDER CORRECTIONS 8): a liveness receipt for a switch
 *  whose effect is a RARE EVENT compares the per-seed ROW (any stored field), NOT the full-time
 *  signature — a full-time state snapshot is not a trajectory hash and a rare effect can be
 *  absorbed before the whistle. ON EVERY SEED WHERE THE CANDIDATE ARM RECORDED ≥ 1 EIGHTH-`why`
 *  DECISION, the candidate's and the control's per-seed ROWS DIFFER IN AT LEAST ONE STORED
 *  FIELD. The signature comparison is kept BESIDE as a PRINTED FACE, gating nothing.
 *  ⭐⭐⭐ ITS NON-VACUITY: the eighth-`why` count is > 0 on the candidate arm over the battery.
 *  ⚠ LIVENESS ONLY — a differing row says the seam FIRED, never that it helped. ⭐⭐⭐ AND IT IS
 *  A PRECONDITION OF EVERY READ (#420 item 2(iii)). */
const rowBytes = (r: Row): string => JSON.stringify({ ...r, wallMs: 0 });
const IF_CONTRASTS = CONTRASTS.filter((c) => ARM_CARRIES_IF[TREAT_OF[c]]
  && !ARM_CARRIES_IF[CTRL_OF[c]]);
const biteRows = IF_CONTRASTS.map((cid) => {
  const armK = TREAT_OF[cid];
  const ctrl = CTRL_OF[cid];
  const eligible = cells.filter((c) => c.rows[armK].ifWhyDecisions > 0);
  const exempt = cells.filter((c) => c.rows[armK].ifWhyDecisions === 0).map((c) => c.seed);
  const identicalRows = eligible
    .filter((c) => rowBytes(c.rows[armK]) === rowBytes(c.rows[ctrl])).map((c) => c.seed);
  const identicalSignatures = eligible
    .filter((c) => c.rows[armK].signature === c.rows[ctrl].signature).map((c) => c.seed);
  return {
    contrast: cid, arm: armK, controlArm: ctrl,
    eligibleSeeds: eligible.length,
    rowsDiffering: eligible.length - identicalRows.length,
    identicalRowSeeds: identicalRows.slice(0, 20), identicalRowCount: identicalRows.length,
    /* ⚠ PRINTED BESIDE, GATING NOTHING — the #414 FAMILY NOTE's own instruction */
    signaturesDiffering: eligible.length - identicalSignatures.length,
    identicalSignatureCount: identicalSignatures.length,
    identicalSignatureSeeds: identicalSignatures.slice(0, 20),
    exemptSeeds: exempt.length, exemptSeedsSample: exempt.slice(0, 20),
    exemptReason: 'the candidate arm recorded ZERO eighth-`why` decisions on this seed, so the '
      + 'flight door had nothing to relabel',
    eighthWhyDecisions: tot(armK, (r) => r.ifWhyDecisions),
    allRowsDiffer: eligible.length > 0 && identicalRows.length === 0,
  };
});
/** the EIGHTH-`why` COUNT PER MATCH on the candidate arm — gBiteIF's non-vacuity, stored ONCE
 *  and re-used by `gClassesNonVacuous` (#420 item 2(iv): "this IS `gBiteIF`'s non-vacuity"). */
const EIGHTH_WHY_PER_MATCH_CANDIDATE = face('ifRun.decisionsPerMatch', ARM_OF_RECORD).value;
const EIGHTH_WHY_TOTAL_CANDIDATE = tot(ARM_OF_RECORD, (r) => r.ifWhyDecisions);
const BITE_IF_OK = biteRows.length === IF_CONTRASTS.length
  && biteRows.every((r) => r.allRowsDiffer)
  && EIGHTH_WHY_TOTAL_CANDIDATE > 0;

/** ⭐⭐⭐ THE FROZEN READ LITERALS — #420 item 2(iii)'s THREE sentences plus the FALLBACK,
 *  copied CHARACTER FOR CHARACTER from the ruling and cross-checked at run time against
 *  `docs/world-model/IF-FLIGHT-RUN-CONTRACT.md` §3 — THREE HOMES (this instrument, the ruling,
 *  the contract) must agree BYTE FOR BYTE (`gReadLiterals`).
 *  ⛔ NOT INTERPOLATED: the breaching guards are a STORED FIELD printed on an ANNOTATION LINE. */
const READ_LITERALS = {
  read1: 'THE FLIGHT RUN COSTS NOTHING THE BAND CAN SEE — IF-ENTRY is named (world 18 = 17 + '
    + 'the run onto the flight).',
  read2: 'THE FLIGHT RUN CARRIES A FACE — the guard is named; the commander decides between a '
    + 'restraint slice and stop with the table.',
  read3: 'THE FLIGHT RUN FLOODS — the restraint needs the flight: a restraint slice is named '
    + 'before any entry.',
  fallback: 'THE READS DO NOT COVER THE SHAPE — the commander decides with the table.',
} as const;
type ReadWord = keyof typeof READ_LITERALS;
/** ⭐⭐⭐ THE LIVENESS PRECONDITION'S OWN STRING (#420 item 2(iii)), frozen with the literals
 *  and NEVER one of them: if `gBiteIF` is RED, NO read is selected and THIS is stored instead. */
const NO_READ_SENTENCE = 'THE SEAM DID NOT FIRE — no read';
const RULINGS_PATH = 'docs/world-model/PROGRAMME-RULINGS.md';
const CONTRACT_PATH = 'docs/world-model/IF-FLIGHT-RUN-CONTRACT.md';
const normaliseProse = (t: string): string => t
  .split(String.fromCharCode(10)).map((l) => l.replace(/^\s*>\s?/, '')).join(' ')
  .replace(/[*`]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const READ_LITERAL_HOMES = (() => {
  const homes = [
    { home: RULINGS_PATH, what: 'ruling #420 item 2(iii)',
      text: existsSync(RULINGS_PATH) ? normaliseProse(readFileSync(RULINGS_PATH, 'utf8')) : '' },
    { home: CONTRACT_PATH, what: '§3 — the three reads, the fallback and the liveness string '
      + 'are quoted CHARACTER FOR CHARACTER under the IF-T1 bullet and are INHERITED UNCHANGED '
      + 'by IF-T1b (#423 item 3(i): "the SAME three reads + fallback + precedence + liveness '
      + 'precondition")',
      text: existsSync(CONTRACT_PATH)
        ? normaliseProse(readFileSync(CONTRACT_PATH, 'utf8')) : '' },
  ];
  const rows = ([...(Object.keys(READ_LITERALS) as ReadWord[]),
    'noRead' as const]).flatMap((w) => homes.map((h) => ({
    literal: w, home: h.home, what: h.what,
    required: true,
    found: h.text.includes(normaliseProse(
      w === 'noRead' ? NO_READ_SENTENCE : READ_LITERALS[w as ReadWord])),
  })));
  return {
    what: '⭐⭐⭐ the frozen literals — THE THREE READS, THE FALLBACK **and** THE LIVENESS '
      + 'STRING — CROSS-CHECKED against BOTH homes on NORMALISED prose (blockquote prefix, '
      + 'emphasis markers, backticks and wrapping removed). #420 item 2(iii) copied all of them '
      + 'into the contract §3 this round, so THERE IS NO ASYMMETRY TO DECLARE: every literal is '
      + 'REQUIRED in every home and a miss is RED.',
    normalisation: 'strip a leading `> ` per line · join lines with a space · delete `*` and '
      + 'backticks · collapse whitespace',
    fallbackAsymmetry: 'none — all five strings are required in both homes.',
    rows,
    ok: rows.every((r) => !r.required || r.found),
  };
})();
/** ⭐⭐⭐ THE HONESTY LINE — #413 item 5(iii), printed BESIDE every read, never inside a literal. */
const HONESTY_LINE = '"nothing the band can see" is NOT "nothing the eye can see" — the '
  + 'user\'s gate at world 18 judges the eye.';
/** ⭐⭐⭐ THE FROZEN RULE, applied to STORED booleans. THE PRECEDENCE IS THE RULING'S OWN
 *  (#420 item 2(iii)): (1) a BREACH (`holdsBand` FALSE) ⇒ read 2; (2) else `floods` (R1 UP
 *  beyond tolerance, RESOLVED) ⇒ read 3; (3) else ⇒ read 1. THE FALLBACK FIRES ONLY IF A
 *  STORED BOOLEAN IS **ABSENT** — a defect, not a shape. */
const readWordFrom = (floodsHere: unknown, holdsHere: unknown): ReadWord => {
  if (typeof holdsHere !== 'boolean' || typeof floodsHere !== 'boolean') return 'fallback';
  if (!holdsHere) return 'read2';
  if (floodsHere) return 'read3';
  return 'read1';
};
const precedenceStepFrom = (floodsHere: unknown, holdsHere: unknown): string => {
  if (typeof holdsHere !== 'boolean' || typeof floodsHere !== 'boolean') {
    return 'step (F) — a stored boolean is ABSENT: THE FALLBACK (a defect, not a shape)';
  }
  if (!holdsHere) return 'step (1) — a BREACH';
  if (floodsHere) return 'step (2) — the band holds and R1 FLOODS';
  return 'step (3) — the band holds and R1 does not flood';
};
/** ⭐⭐⭐ LIVENESS IS A PRECONDITION OF EVERY READ (#420 item 2(iii)): if `gBiteIF` is RED, NO
 *  read is selected and the frozen string "THE SEAM DID NOT FIRE — no read" is stored. */
const LIVENESS_OK = BITE_IF_OK;
const READ_WORD_BY_RULE = readWordFrom(floods(CONTRAST_OF_RECORD),
  holdsBand(CONTRAST_OF_RECORD));
const READ_WORD: ReadWord | 'noRead' = LIVENESS_OK ? READ_WORD_BY_RULE : 'noRead';
const READ_SENTENCE = LIVENESS_OK ? READ_LITERALS[READ_WORD_BY_RULE] : NO_READ_SENTENCE;
const PRECEDENCE_STEP = LIVENESS_OK
  ? precedenceStepFrom(floods(CONTRAST_OF_RECORD), holdsBand(CONTRAST_OF_RECORD))
  : 'step (0) — LIVENESS: `gBiteIF` is RED, so NO READ IS SELECTED';
const BREACH_NAMED = breachingGuards(CONTRAST_OF_RECORD).join(' · ');
/** ⭐⭐ THE COUNTERFACTUAL WORDS — canon, VERBATIM: "a counterfactual verdict sentence ('had X
 *  been scored, the rule would read W') quotes a word the instrument STORED by applying the
 *  frozen rule to X's stored interval". D13's word and the HATS-vs-OWN+COOP-OFF table's word are
 *  both computed by the SAME frozen rule and STORED; NEITHER SELECTS. */
const readWordAsIfOfRecord = (cid: Cid): ReadWord =>
  readWordFrom(floods(cid), holdsBand(cid));
const READ_WORD_D13 = readWordAsIfOfRecord(CONTRAST_D13);
const READ_WORD_HATS_VS_CANDIDATE = readWordAsIfOfRecord(CONTRAST_HATS_VS_CANDIDATE);
const D13_AGREES = READ_WORD_D13 === READ_WORD_BY_RULE;
const AGREE_SENTENCE = {
  agrees: 'THIS PAIR SELECTS THE SAME READ',
  disagrees: 'THIS PAIR SELECTS A DIFFERENT READ',
};
/** ⭐⭐ THE OTHER CONTRASTS' own words (stored, never selecting). */
const wordsFor = (cid: Cid) => ({
  contrast: cid, label: CID_LABEL[cid], floods: floods(cid), holdsBand: holdsBand(cid),
  breachingGuards: breachingGuards(cid), breachSet: breachSetWithDirections(cid),
  offsideFlag: OFFSIDE_ROWS[cid].flag,
  word: readWordAsIfOfRecord(cid), sentence: READ_LITERALS[readWordAsIfOfRecord(cid)],
});
const CONTRAST_WORDS = Object.fromEntries(CONTRASTS.map((c) => [c, wordsFor(c)])) as
  Record<Cid, ReturnType<typeof wordsFor>>;
/** ⭐⭐ THE YIELD PAIR — shots per OWN-RUN episode vs per HAT episode, BOTH FRACTIONS.
 *  ⛔ NO VERDICT WORD: the numbers are printed beside each other. */
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
/** ⭐⭐⭐ THE COUPLING FACES, COPIED FROM DS-C0 **BY FIELD NAME** (#413 item 5(ii)) — per ARM
 *  (levels) and per CONTRAST (paired Δ). ⛔ NO VERDICT WORD ANYWHERE IN THIS BLOCK. */
const DSC0_COUPLING_FIELDS = ['overlapSets', 'overlapReleaseFires', 'overlapArrivedStat',
  'overlapConfronted', 'wallEligiblePasses', 'wallFires', 'wallOneTwosStat',
  'fireWallReturnUpperBound', 'fireOverlapReleaseExact'] as const;
/** ⭐⭐⭐ THE TWO DISAPPEARING FACES, PER MATCH — what world 17 would lose, printed beside
 *  EVERY read: overlap ARRIVALS per match (`overlapArrivedStat` ÷ matches, the engine's own
 *  `stats.overlaps` ledger) and ONE-TWOS per match (`wallOneTwosStat` ÷ matches, the engine's
 *  own `stats.oneTwos` ledger). ⛔ PRINTED, NEVER JUDGED. */
const disappearingPairFor = (armK: Arm) => ({
  arm: armK,
  overlapArrivalsPerMatch: face('coupling.overlapArrivalsPerMatch', armK).value,
  overlapArrivals: face('coupling.overlapArrivalsPerMatch', armK).numerator,
  oneTwosPerMatch: face('coupling.wallReturnsPerMatch', armK).value,
  oneTwos: face('coupling.wallReturnsPerMatch', armK).numerator,
  matches: face('coupling.overlapArrivalsPerMatch', armK).denominator,
  sourceFields: ['overlapArrivedStat', 'wallOneTwosStat'],
  note: 'DS-C0\'s own field names, divided by matches. ⛔ PRINTED, NEVER JUDGED.',
});
const DISAPPEARING_PAIR = Object.fromEntries(ARMS.map((a) => [a, disappearingPairFor(a)])) as
  Record<Arm, ReturnType<typeof disappearingPairFor>>;
/** ⭐⭐ THE PASSER'S HAT-READ FIRES BY SITE, per arm (DS-C0's `passerReadTable`, measured). */
const PASSER_READ_FACE = {
  wallReturn: 'passer.wallReturnFiresPerMatch',
  thirdMan: 'passer.thirdManFiresPerMatch',
  overlapRelease: 'passer.overlapReleaseFiresPerMatch',
  arriverCutbackFormed: 'passer.arriverCutbackFormedPerMatch',
  arriverCutbackTaken: 'passer.arriverCutbackTakenPerMatch',
} as const;
const passerReadTableFor = (armK: Arm) => Object.fromEntries(
  Object.entries(PASSER_READ_FACE).map(([site, key]) => [site, {
    perMatch: face(key, armK).value,
    fires: face(key, armK).numerator,
    perCarrierDecisionTick: face(`${key}.perCarrierTick`, armK).value,
    carrierDecisionTicks: face(`${key}.perCarrierTick`, armK).denominator,
  }]),
);
const PASSER_READ_TABLE = Object.fromEntries(ARMS.map((a) => [a, {
  arm: a, sites: passerReadTableFor(a),
  boundary: '⭐⭐ THE ⑤ BOUNDARY (读心标签), STATED AS A BOUNDARY — NOT FIXED, NOT JUDGED: '
    + 'DS-C0\'s own site list says which read consumes a LABEL a designation wrote and which '
    + 'consumes a mate\'s ACTION TYPE; the code-fact rows sit in `codeFacts.passerReadSites`.',
}]));
const couplingLevelsFor = (armK: Arm) => ({
  arm: armK,
  overlapSetsPerMatch: face('coupling.overlapSetsPerMatch', armK).value,
  overlapSets: face('coupling.overlapSetsPerMatch', armK).numerator,
  overlapArrivalsPerMatch: face('coupling.overlapArrivalsPerMatch', armK).value,
  overlapArrivedStat: face('coupling.overlapArrivalsPerMatch', armK).numerator,
  overlapPlayedToPerSet: face('coupling.overlapPlayedToPerSet', armK).value,
  overlapReleaseFiresPerSet: face('coupling.overlapReleaseFiresPerSet', armK).value,
  overlapReleaseFiresPerMatch: face('coupling.overlapReleaseFiresPerMatch', armK).value,
  overlapReleaseFires: face('coupling.overlapReleaseFiresPerMatch', armK).numerator,
  overlapConfrontedPerMatch: face('coupling.overlapConfrontedPerMatch', armK).value,
  overlapConfronted: face('coupling.overlapConfrontedPerMatch', armK).numerator,
  wallEligiblePassesPerMatch: face('coupling.wallEligiblePassesPerMatch', armK).value,
  wallEligiblePasses: face('coupling.wallEligiblePassesPerMatch', armK).numerator,
  wallFiresPerMatch: face('coupling.wallFiresPerMatch', armK).value,
  wallFires: face('coupling.wallFiresPerMatch', armK).numerator,
  wallFireRatePerEligiblePass: face('coupling.wallFireRatePerEligiblePass', armK).value,
  oneTwosPerMatch: face('coupling.wallReturnsPerMatch', armK).value,
  wallOneTwosStat: face('coupling.wallReturnsPerMatch', armK).numerator,
  wallReturnShareOfFires: face('coupling.wallReturnShareOfFires', armK).value,
  fireWallReturnUpperBoundPerMatch: face('passer.wallReturnFiresPerMatch', armK).value,
  fireOverlapReleaseExactPerMatch: face('passer.overlapReleaseFiresPerMatch', armK).value,
  arriverSetsPerMatch: face('coupling.arriverSetsPerMatch', armK).value,
  cutbackTakenPerMatch: face('coupling.cutbackTakenPerMatch', armK).value,
  wallReconAgreesShare: face('coupling.wallReconAgreesShare', armK).value,
});
const COUPLING_LEVELS = Object.fromEntries(ARMS.map((a) => [a, couplingLevelsFor(a)]));
const couplingFor = (cid: Cid) => {
  const ov = delta('coupling.overlapSetsPerMatch', cid);
  const wf = delta('coupling.wallFiresPerMatch', cid);
  const pt = delta('coupling.overlapPlayedToPerSet', cid);
  const rt = delta('coupling.wallReturnShareOfFires', cid);
  const ar = delta('coupling.overlapArrivalsPerMatch', cid);
  const ot = delta('coupling.wallReturnsPerMatch', cid);
  return {
    contrast: cid, arm: TREAT_OF[cid], controlArm: CTRL_OF[cid],
    overlapSetsControl: ov.controlValue, overlapSetsArm: ov.armValue,
    overlapSetsDelta: ov.delta, overlapSetsCi: [ov.ciLo, ov.ciHi],
    overlapSetsResolved: ov.resolved,
    overlapArrivalsControl: ar.controlValue, overlapArrivalsArm: ar.armValue,
    overlapArrivalsDelta: ar.delta, overlapArrivalsCi: [ar.ciLo, ar.ciHi],
    overlapPlayedToControl: pt.controlValue, overlapPlayedToArm: pt.armValue,
    overlapPlayedToDelta: pt.delta, overlapPlayedToCi: [pt.ciLo, pt.ciHi],
    wallFiresControl: wf.controlValue, wallFiresArm: wf.armValue,
    wallFiresDelta: wf.delta, wallFiresCi: [wf.ciLo, wf.ciHi], wallFiresResolved: wf.resolved,
    oneTwosControl: ot.controlValue, oneTwosArm: ot.armValue,
    oneTwosDelta: ot.delta, oneTwosCi: [ot.ciLo, ot.ciHi],
    wallReturnControl: rt.controlValue, wallReturnArm: rt.armValue,
    wallReturnDelta: rt.delta, wallReturnCi: [rt.ciLo, rt.ciHi],
  };
};
const COUPLING = Object.fromEntries(CONTRASTS.map((c) => [c, couplingFor(c)]));
/** ⭐⭐⭐ gArmIF's BATTERY HALF (#420 item 2(iv)) — on EVERY arm NOT carrying `ifFlightRun`
 *  the eighth `why` count is EXACTLY 0 and the belief map is EMPTY, on EVERY battery seed and
 *  on the construction receipt. ⛔ A STORED BOOLEAN OF CONSTRUCTION, NEVER NARRATED. */
const armIfRows = ARMS.map((armK) => {
  const bad = cells.filter((c) => c.rows[armK].ifWhyDecisions !== 0
    || c.rows[armK].beliefEntriesAtFullTime !== 0
    || c.rows[armK].lookEntriesAtFullTime !== 0);
  const receiptClean = receiptRows[armK].ifWhyDecisions === 0
    && receiptRows[armK].beliefEntriesAtFullTime === 0
    && receiptRows[armK].lookEntriesAtFullTime === 0;
  return {
    arm: armK, carriesFlightDoor: ARM_CARRIES_IF[armK], seeds: cells.length,
    eighthWhyDecisions: tot(armK, (r) => r.ifWhyDecisions) + receiptRows[armK].ifWhyDecisions,
    eighthWhyEpisodes: tot(armK, (r) => r.ifEpSets),
    beliefEntriesSum: tot(armK, (r) => r.beliefEntriesAtFullTime),
    lookEntriesSum: tot(armK, (r) => r.lookEntriesAtFullTime),
    seedsWithAnEighthWhy: cells.filter((c) => c.rows[armK].ifWhyDecisions > 0).length,
    seedsWithANonEmptyBelief:
      cells.filter((c) => c.rows[armK].beliefEntriesAtFullTime > 0).length,
    offendingSeeds: ARM_CARRIES_IF[armK] ? [] : bad.map((c) => c.seed).slice(0, 20),
    constructionReceiptClean: ARM_CARRIES_IF[armK] ? true : receiptClean,
    asDue: ARM_CARRIES_IF[armK] ? true : (bad.length === 0 && receiptClean),
  };
});
/** ⭐⭐⭐ gArmIF's VERDICT: the two negatives hold on every non-IF arm and on the construction
 *  receipt, the two construction walks agree, AND the battery is NON-VACUOUS on the candidate
 *  arms (without that the zeroes would mean nothing). */
const ARM_IF_OK = armIfRows.every((r) => r.asDue) && ARM_IF_SCRATCH_OK
  && IF_ARMS.every((a) => tot(a, (r) => r.ifWhyDecisions) > 0
    && tot(a, (r) => r.beliefEntriesAtFullTime) > 0
    && tot(a, (r) => r.lookEntriesAtFullTime) > 0);
/** ⭐⭐ THE COOPERATION COUNTERS, STORED BESIDE — `dsCoopHatsOff` is carried by every arm but
 *  `HATS-E13`, so `overlapSets` and `wallFires` are ZERO on four arms BY CONSTRUCTION. ⛔ A
 *  STORED CHECK, never a finding; it is what world 17 MEANS. */
const armCoopRows = ARMS.map((armK) => ({
  arm: armK, carriesCoopOff: ARM_KIND[armK] !== 'HATS',
  overlapSets: tot(armK, (r) => r.overlapSets),
  wallFires: tot(armK, (r) => r.wallFires),
  asDue: ARM_KIND[armK] === 'HATS'
    ? (tot(armK, (r) => r.overlapSets) > 0 && tot(armK, (r) => r.wallFires) > 0)
    : (tot(armK, (r) => r.overlapSets) === 0 && tot(armK, (r) => r.wallFires) === 0),
}));
const ARM_COOP_OK = armCoopRows.every((r) => r.asDue);

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
  ifRunsPerMatch: face(`state.runsPerMatch.ifFlight.${st}`, armK).value,
  ifRuns: face(`state.runsPerMatch.ifFlight.${st}`, armK).numerator,
  ifRunShare: face(`state.runShare.ifFlight.${st}`, armK).value,
  ifAimedPerRun: face(`state.aimedPerRun.ifFlight.${st}`, armK).value,
  ifShotsPerRun: face(`state.shotsPerRun.ifFlight.${st}`, armK).value,
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
/** ⭐⭐ LOO — SCOPED to the READ-BEARING rows only: R1 and every gating guard, per contrast.
 *  ⭐ AMENDMENT (#411 item 2's form rule): EVERY FLIPPING ROW'S SEEDS ARE STORED, so the doc's
 *  §HONEST LIMITS can NAME them off the array instead of counting them in prose. */
const LOO_ROWS = CONTRASTS.flatMap((cid) => [R1_KEY, ...GUARD_LIMBS.map((l) => l.key)]
  .map((k) => {
    const d = delta(k, cid);
    return {
      face: k, contrast: cid, arm: TREAT_OF[cid], controlArm: CTRL_OF[cid],
      delta: d.delta, ci: [d.ciLo, d.ciHi],
      looMaxInfluenceShare: d.looMaxInfluenceShare,
      looFlipsDown: d.looFlipsDown, looFlipsUp: d.looFlipsUp,
      looFlippingSeeds: d.looFlippingSeeds, seedsDropped: cells.length,
    };
  }));
const LOO_OK = LOO_ROWS.every((r) => Number.isInteger(r.looFlipsDown)
  && Number.isInteger(r.looFlipsUp)
  && r.looFlippingSeeds.length <= r.looFlipsDown + r.looFlipsUp);

/* ========================================================================== */
/* §15 G-BITE, THE POOLED BINS, THE BIN-DERIVED MEDIANS, AND THE SIZING        */
/* ========================================================================== */
interface Pooled {
  restraintBins: number[]; ownBackOutBins: number[];
  runMulLicBins: number[]; countBins: number[];
  r1Bins: number[]; r1RunnersByRole: number[];
  branchTicks: number[]; runCountBins: number[]; runnersByRole: number[];
  offBallActionTicksPost: number[]; runClassTicks: number[]; keeperRunClassTicks: number[];
  hatClassTicks: number[];
  epSets: number[]; epTickBins: number[]; epTickBinsWide: number[]; ownEpTickBins: number[];
  runMulBinsArr: number[]; stateRunDecisions: number[]; stateAllDecisions: number[];
  wallConjunctKills: number[];
}
const POOL_KEYS = ['restraintBins', 'ownBackOutBins', 'runMulLicBins', 'countBins',
  'r1Bins', 'r1RunnersByRole', 'branchTicks', 'runCountBins', 'runnersByRole',
  'offBallActionTicksPost', 'runClassTicks', 'keeperRunClassTicks', 'hatClassTicks',
  'epSets', 'epTickBins', 'epTickBinsWide', 'ownEpTickBins', 'runMulBinsArr',
  'stateRunDecisions', 'stateAllDecisions', 'wallConjunctKills'] as const;
const emptyPooled = (): Pooled => ({
  restraintBins: zeros(UNIT_BINS), ownBackOutBins: zeros(OWNB_BINS),
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
  /* ⭐⭐⭐ DS-T1c's own bin-derived medians, each with ITS TOP BIN'S SHARE beside it */
  out.restraintMedian = binMedian(p.restraintBins, UNIT_W);
  out.restraintTopBinShare = topBinShare(p.restraintBins);
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

/** ⭐⭐⭐ DS-T1c — THE SEAM'S OWN FACES, PER ARM (#410 item 3(ii)); every value a STORED face
 *  or a STORED bin, ⛔ NO VERDICT WORD anywhere in this block. */
const seamFacesFor = (armK: Arm) => ({
  arm: armK, seatDose: 'ABSENT', obmRunMulKnownToBeOne: true,
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
  rankBelowCount: {
    equivalence: RANK_BELOW_COUNT_EQUIVALENCE,
    rankAboveExactValueRecoverableFromAScore: false,
    share: face('restraint.rankBelowCountShare', armK).value,
    observations: face('restraint.rankBelowCountShare', armK).denominator,
  },
  priorZero: {
    what: 'THE DF CLAMP\'S OWN SHARE and THE AMBIGUOUS OVERLAP: at a zero prior the own-run '
      + 'candidate scores 0 whatever the restraint was, and the back-out\'s denominator is zero, '
      + 'so the restraint is NOT RECOVERABLE there. The prior is RECOMPUTED from the body\'s own '
      + 'pos and role and reads NO snapshot.',
    priorZeroShare: face('seam.priorZeroShare', armK).value,
    priorAboveZeroShare: face('seam.priorAboveZeroShare', armK).value,
    priorZeroPerMatch: face('seam.priorZeroPerMatch', armK).value,
    visibleOwnCandidates: face('seam.priorZeroShare', armK).denominator,
    ambiguousOverlapIsTheZeroPriorPopulation: true,
    restraintNeitherZeroNorOneShare: face('restraint.neitherZeroNorOneShare', armK).value,
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
/** ⭐⭐⭐ THE EIGHTH CLASS AS ITS OWN FACE FAMILY (#420 item 2(ii)) — its COUNT, its THREE
 *  PARTITIONS (start state · restraint · yield) and its episode family. ⛔ NO VERDICT WORD. */
const eighthClassFor = (armK: Arm) => ({
  arm: armK, carriesTheFlightDoor: ARM_CARRIES_IF[armK],
  theLiteral: WHY_IF, classCell: IF_CLASS,
  count: {
    decisionsPerMatch: face('ifRun.decisionsPerMatch', armK).value,
    decisions: face('ifRun.decisionsPerMatch', armK).numerator,
    shareOfMakeRun: face(`runClass.shareOfMakeRun.${IF_CLASS}`, armK).value,
    episodesPerMatch: face('ifRun.episodesPerMatch', armK).value,
    episodes: face('ifRun.episodesPerMatch', armK).numerator,
    meanTicksPerEpisode: face('ifRun.meanTicksPerEpisode', armK).value,
    episodesActiveAtFullTime: face('ifRun.episodesActiveAtFullTime', armK).value,
    visibleCandidatesPerMatch: face('ifRestraint.candidatesPerMatch', armK).value,
  },
  startStatePartition: {
    what: 'the ball he SEES at the start tick (his OWN percept: loose · in the air) and the '
      + 'owner his MEMORY holds (`match.ifLastSeenOwnerGid`: the last passer · another mate). '
      + '⚠ `|vel| > 0` IS A STORED PARTITION, NEVER A GATE.',
    stampedStartsPerMatch: face('ifStart.stampedStartsPerMatch', armK).value,
    stampedStarts: face('ifStart.stampedStartsPerMatch', armK).numerator,
    ballMotion: Object.fromEntries(BALL_MOTION.map((c) => [c,
      face(`ifStart.ballMotionShare.${c}`, armK).value])),
    memory: Object.fromEntries(MEMORY_CELLS.map((c) => [c,
      face(`ifStart.memoryShare.${c}`, armK).value])),
    byPhase: Object.fromEntries(PHASE_CELLS.map((c) => [c,
      face(`ifStart.phaseShare.${c}`, armK).value])),
    byLookDistance: Object.fromEntries(LOOK_DISTANCE_CELLS.map((c) => [c,
      face(`ifStart.lookDistanceShare.${c}`, armK).value])),
    byPhaseNote: '⭐ AMENDMENT (#423 item 3(i)) — A STORED RECEIPT OF M-IF.5. Expected '
      + '1.000000 `playing` BY CONSTRUCTION; enumerated here, ⛔ never narrated, ⛔ never gated.',
    byLookDistanceNote: '⭐ AMENDMENT (#423 item 3(i)) — A STORED RECEIPT OF M-IF.6 (the '
      + 'two-look freshness). Expected 1.000000 `distance1` BY CONSTRUCTION; enumerated here, '
      + '⛔ never narrated, ⛔ never gated.',
    truthState: Object.fromEntries(STATES.map((c) => [c,
      face(`ifStart.truthStateShare.${c}`, armK).value])),
  },
  restraintPartition: {
    what: '#419 item 3\'s OWN FACE: in the eighth state `ownerGid === null`, so the rank loop '
      + 'skips NOBODY and the body he REMEMBERS with the ball is ranked like any mate. THIS is '
      + 'the consequence, measured.',
    mean: face('ifRestraint.mean', armK).value,
    observations: face('ifRestraint.mean', armK).denominator,
    exactlyZeroShare: face('ifRestraint.exactlyZeroShare', armK).value,
    exactlyOneShare: face('ifRestraint.exactlyOneShare', armK).value,
    betweenShare: face('ifRestraint.betweenShare', armK).value,
    observationsPerMatch: face('ifRestraint.observationsPerMatch', armK).value,
  },
  yieldPartition: {
    what: 'the own-run yield family off the engine\'s own ledgers, taken on the EIGHTH '
      + 'class\'s episodes and printed BESIDE the seventh\'s.',
    shotsPerEpisode: face('ifRun.shotsPerEpisode', armK).value,
    goalsPerEpisode: face('ifRun.goalsPerEpisode', armK).value,
    passAimedPerEpisode: face('ifRun.passAimedPerEpisode', armK).value,
    passCompletedPerEpisode: face('ifRun.passCompletedPerEpisode', armK).value,
    throughShare: face('ifRun.throughShare', armK).value,
    shotsPerMatch: face('ifRun.shotsPerMatch', armK).value,
    theSeventhsOwnYieldBeside: {
      shotsPerEpisode: face('own.shotsPerEpisode', armK).value,
      goalsPerEpisode: face('own.goalsPerEpisode', armK).value,
      episodesPerMatch: face('own.episodesPerMatch', armK).value,
    },
    byState: Object.fromEntries(STATES.map((st) => [st, {
      ifRunsPerMatch: face(`state.runsPerMatch.ifFlight.${st}`, armK).value,
      ifShotsPerRun: face(`state.shotsPerRun.ifFlight.${st}`, armK).value,
      ownRunsPerMatch: face(`state.runsPerMatch.own.${st}`, armK).value,
      ownShotsPerRun: face(`state.shotsPerRun.own.${st}`, armK).value,
    }])),
  },
  belief: {
    entriesPerMatch: face('belief.entriesPerMatch', armK).value,
    lookEntriesPerMatch: face('look.entriesPerMatch', armK).value,
    theRegisteredReads: '⭐ AMENDMENT (#423 item 3(v)): `match.ifLastSeenOwnerGid` (THE '
      + 'BELIEF, registered at IF-T1 — registry 86 → 87) and `match.ifLook` (THE LOOK COUNTER, '
      + 'M-IF.6\'s own map, REGISTERED HERE — registry 87 → 88). BOTH READ, never written, by '
      + 'this instrument.',
  },
});
const EIGHTH_CLASS = Object.fromEntries(ARMS.map((a) => [a, eighthClassFor(a)]));
/** ⭐⭐⭐ IF-C0\'S Q4 FACES AS FACES, per arm, EACH WITH ITS ≈ CROSS-ARCHITECTURE TWIN under
 *  `approx.ifC0`. ⛔ THE TWIN IS PRINTED, NEVER SELECTING (#418 item 2(v)). */
const q4For = (armK: Arm) => {
  const twinArm = ARM_KIND[armK] === 'HATS' ? 'HATS-E13'
    : ARM_BOOK[armK] === 'D13' ? 'D13' : 'OWNCOOP-E13';
  const pair = (k: string) => ({
    value: face(k, armK).value,
    numerator: face(k, armK).numerator, denominator: face(k, armK).denominator,
    ci: [face(k, armK).ciLo, face(k, armK).ciHi],
    approx: { ifC0: approxIfC0(k, twinArm) },
    prior: { ifT1: priorIfT1(k, armK) },
  });
  return {
    arm: armK, approxTwinArm: twinArm, approxStamp: APPROX_STAMP,
    negativeDeltaTHalf: {
      ...pair('dt.negativeShare'),
      bins: Object.fromEntries(DT_BINS.map((b) => [b, face(`dt.binShare.${b}`, armK).value])),
      byClass: {
        ownRunInBehind: face('dt.negativeShare.ownRunInBehind', armK).value,
        ownRunOntoFlight: face(`dt.negativeShare.${IF_CLASS}`, armK).value,
      },
      attachedPerMatch: face('dt.attachedStartsPerMatch', armK).value,
      noAttachedReleaseShare: face('dt.noAttachedReleaseShare', armK).value,
    },
    receiverStartedDuringTheFlight: {
      ...pair('receiver.classShare.startedDuringTheFlight'),
      classes: Object.fromEntries(RECEIVER_CLASSES.map((c) => [c,
        face(`receiver.classShare.${c}`, armK).value])),
      intendedOnly: Object.fromEntries(RECEIVER_CLASSES.map((c) => [c,
        face(`receiver.intendedClassShare.${c}`, armK).value])),
      completionsPerMatch: face('receiver.completionsPerMatch', armK).value,
    },
    intendedReceiverShare: {
      ...pair('flight.intendedReceiverShare'),
      fixtured: true,
      towardHimShare: face('flight.towardHimShare', armK).value,
      startsOnHisSidesPassPerMatch: face('flight.startsOnHisSidesPassPerMatch', armK).value,
    },
    bodiesAlreadyRunningAtTheRelease: {
      mean: face('release.runnersAtReleaseMean', armK).value,
      releases: face('release.runnersAtReleaseMean', armK).denominator,
      releasesPerMatch: face('release.perMatch', armK).value,
      bins: Array.from({ length: REL_RUNNER_BINS }, (_, k) => face(
        `release.runnerBinShare.${k === REL_RUNNER_BINS - 1 ? `${k}plus` : k}`, armK).value),
      approx: { ifC0: approxIfC0('release.runnersAtReleaseMean', twinArm) },
      prior: { ifT1: priorIfT1('release.runnersAtReleaseMean', armK) },
    },
    runInFlightShare: {
      ...pair('run.inFlightShare'),
      byClass: {
        ownRunInBehind: face('run.inFlightShare.ownRunInBehind', armK).value,
        ownRunOntoFlight: face(`run.inFlightShare.${IF_CLASS}`, armK).value,
      },
      runStartsPerMatch: face('run.startsPerMatch', armK).value,
    },
    leakPartition: {
      what: '⛔ UNCHANGED BY CONSTRUCTION (contract §4: the stale-owner leak stays as honest '
        + 'perception and is PRINTED here, never fixed). ⛔ PRINTED, NEVER JUDGED.',
      cells: Object.fromEntries(LEAK_CELLS.map((c) => [c, {
        share: face(`leak.cellShare.${c}`, armK).value,
        perMatch: face(`leak.cellPerMatch.${c}`, armK).value,
        approx: { ifC0: approxIfC0(`leak.cellShare.${c}`, twinArm) },
        prior: { ifT1: priorIfT1(`leak.cellShare.${c}`, armK) },
      }])),
      inFlightSeventhStartsPerMatch: face('leak.inFlightSeventhStartsPerMatch', armK).value,
      perceivedCells: Object.fromEntries(PERCEIVED.map((c) => [c,
        face(`perceived.cellShare.${c}`, armK).value])),
      staleShare: face('perceived.staleShare', armK).value,
    },
    inFlightOwnRunYieldVsAtFeet: {
      what: 'the own-run yield by the ENGINE\'S OWN truth state at the decision tick — the '
        + 'ball in flight against a mate on the ball, for the SEVENTH and the EIGHTH classes.',
      seventh: {
        inFlightRunsPerMatch: face('state.runsPerMatch.own.ballInFlight', armK).value,
        inFlightShotsPerRun: face('state.shotsPerRun.own.ballInFlight', armK).value,
        atFeetRunsPerMatch: face('state.runsPerMatch.own.mateOwnsTheBall', armK).value,
        atFeetShotsPerRun: face('state.shotsPerRun.own.mateOwnsTheBall', armK).value,
      },
      eighth: {
        inFlightRunsPerMatch: face('state.runsPerMatch.ifFlight.ballInFlight', armK).value,
        inFlightShotsPerRun: face('state.shotsPerRun.ifFlight.ballInFlight', armK).value,
        atFeetRunsPerMatch: face('state.runsPerMatch.ifFlight.mateOwnsTheBall', armK).value,
        atFeetShotsPerRun: face('state.shotsPerRun.ifFlight.mateOwnsTheBall', armK).value,
      },
    },
  };
};
const Q4_FACES = Object.fromEntries(ARMS.map((a) => [a, q4For(a)]));
/** ⭐⭐⭐ THE ARC'S NUMBERS, printed BESIDE the read — DS-T1's, DS-T1b's and DS-T1c's own values
 *  are QUOTED BY FIELD out of their artifacts, never typed. ⛔ NO VERDICT WORD: this block
 *  stores numbers and stored booleans only, and NOTHING is judged. */
const hRow = (faceKey: string, cid: Cid) => {
  const d = delta(faceKey, cid);
  return {
    face: faceKey, contrast: cid, arm: d.arm, controlArm: d.controlArm,
    controlLevel: d.controlValue,
    armLevel: d.armValue, delta: d.delta, ci: [d.ciLo, d.ciHi], halfWidth: d.halfWidth,
    absDeltaOverHalfWidth: d.absDeltaOverHalfWidth, resolved: d.resolved,
  };
};
const H_NUMBERS = {
  note: '⛔ PRINTED, NEVER JUDGED: no verdict word is stored on any yield, coupling, seam or '
    + 'hypothesis face. DS-T1c\'s and DS-T1d\'s readings, and ⭐ IF-T1\'s OWN READ OF RECORD '
    + 'and its table, are read out of their own artifacts BY FIELD and never typed here.',
  theComparisonOfRecord: {
    what: '⭐ CORRECTION (#421 item 4(v), applied at THIS freeze): `OWNCOOP+IF-E13` vs '
      + '`OWNCOOP-E13` on E13, paired on shared seeds, CONTROL = `OWNCOOP-E13` — world 17\'s '
      + 'own door set. THE READS STAND ON THIS PAIR AND NO OTHER.',
    r1: hRow(R1_KEY, CONTRAST_OF_RECORD),
    r1Level: face(R1_KEY, ARM_OF_RECORD).value,
    r1ControlLevel: face(R1_KEY, CONTROL_OF_RECORD).value,
    r1ShareAtLeastThree: face('r1.floodShareAtLeastThree', ARM_OF_RECORD).value,
    r1ShareAtLeastThreeControl: face('r1.floodShareAtLeastThree', CONTROL_OF_RECORD).value,
    r1Ratio: pairedRatio(R1_KEY, CONTRAST_OF_RECORD),
    g9: hRow('guard.throughBallsPerMatch', CONTRAST_OF_RECORD),
    g9Ratio: pairedRatio('guard.throughBallsPerMatch', CONTRAST_OF_RECORD),
    holdsBand: holdsBand(CONTRAST_OF_RECORD), floods: floods(CONTRAST_OF_RECORD),
    breachSet: breachSetWithDirections(CONTRAST_OF_RECORD),
  },
  theBesideTable: {
    what: '⭐ CORRECTION (#421 item 4(v)): `OWNCOOP+IF-E13` vs `HATS-E13` — world 13 as '
      + 'shipped against the world-18 candidate, with `HATS-E13` as its control. STORED, '
      + 'COUNTERFACTUAL, NEVER SELECTING.',
    r1: hRow(R1_KEY, CONTRAST_HATS_VS_CANDIDATE),
    r1Ratio: pairedRatio(R1_KEY, CONTRAST_HATS_VS_CANDIDATE),
    g9: hRow('guard.throughBallsPerMatch', CONTRAST_HATS_VS_CANDIDATE),
    holdsBand: holdsBand(CONTRAST_HATS_VS_CANDIDATE),
    floods: floods(CONTRAST_HATS_VS_CANDIDATE),
    breachSet: breachSetWithDirections(CONTRAST_HATS_VS_CANDIDATE),
    word: READ_WORD_HATS_VS_CANDIDATE, sentence: READ_LITERALS[READ_WORD_HATS_VS_CANDIDATE],
  },
  theWorld17ArmAgainstTheHats: {
    what: 'OWN vs HATS on E13 — DS-T1c\'s OWN comparison, re-walked on THIS block. Its own '
      + 'stage\'s numbers are quoted beside, BY FIELD.',
    r1: hRow(R1_KEY, 'OWNCOOP-E13|HATS-E13'),
    g9: hRow('guard.throughBallsPerMatch', 'OWNCOOP-E13|HATS-E13'),
    holdsBand: holdsBand('OWNCOOP-E13|HATS-E13'),
    floods: floods('OWNCOOP-E13|HATS-E13'),
  },
  theArcQuotedByField: {
    dsT1c: DST1C_QUOTED, dsT1d: DST1D_QUOTED,
    /** ⭐⭐⭐ ⭐ AMENDMENT (#423 item 3(vii)) — IF-T1's OWN READ OF RECORD and its TABLE, quoted
     *  BY FIELD out of `if-t1-flight-run-exam.json`, never typed. Every number below is an
     *  EXACT prior twin (same host, same architecture); the block differs, so ⛔ no paired Δ. */
    ifT1: IFT1 === null ? null : {
      source: IFT1.source, stageId: IFT1.stageId,
      architecture: IFT1.hostArchitecture, stamp: PRIOR_STAMP,
      readOfRecord: IFT1_QUOTED === null ? null : IFT1_QUOTED.readOfRecord,
      r1Levels: IFT1_QUOTED === null ? null : IFT1_QUOTED.r1Levels,
      theTableTheCommanderDecidedWith: {
        theGuardNamed: {
          control: priorIfT1('guard.throughBallsPerMatch', 'OWNCOOP-E13'),
          candidate: priorIfT1('guard.throughBallsPerMatch', 'OWNCOOP+IF-E13'),
          hats: priorIfT1('guard.throughBallsPerMatch', 'HATS-E13'),
        },
        r1: {
          control: priorIfT1('r1.runsPerInPossessionTick', 'OWNCOOP-E13'),
          candidate: priorIfT1('r1.runsPerInPossessionTick', 'OWNCOOP+IF-E13'),
        },
        theSizeOfTheClass: {
          shareOfMakeRun: priorIfT1(`runClass.shareOfMakeRun.${IF_CLASS}`, 'OWNCOOP+IF-E13'),
          decisionsPerMatch: priorIfT1('ifRun.decisionsPerMatch', 'OWNCOOP+IF-E13'),
          episodesPerMatch: priorIfT1('ifRun.episodesPerMatch', 'OWNCOOP+IF-E13'),
          visibleCandidatesPerMatch: priorIfT1('ifRestraint.candidatesPerMatch',
            'OWNCOOP+IF-E13'),
        },
        theStartState: {
          stampedStartsPerMatch: priorIfT1('ifStart.stampedStartsPerMatch', 'OWNCOOP+IF-E13'),
          ballMotion: Object.fromEntries(BALL_MOTION.map((c) => [c,
            priorIfT1(`ifStart.ballMotionShare.${c}`, 'OWNCOOP+IF-E13')])),
          memory: Object.fromEntries(MEMORY_CELLS.map((c) => [c,
            priorIfT1(`ifStart.memoryShare.${c}`, 'OWNCOOP+IF-E13')])),
          truthState: Object.fromEntries(STATES.map((c) => [c,
            priorIfT1(`ifStart.truthStateShare.${c}`, 'OWNCOOP+IF-E13')])),
          byPhaseAndByLookDistance: '⭐ AMENDMENT: IF-T1 published NEITHER partition — the '
            + 'seam it examined had no whistle test and no look counter. Those two rows have '
            + 'NO prior twin and are stored here as null BY CONSTRUCTION.',
        },
        theRestraint: {
          exactlyZeroShare: priorIfT1('ifRestraint.exactlyZeroShare', 'OWNCOOP+IF-E13'),
          exactlyOneShare: priorIfT1('ifRestraint.exactlyOneShare', 'OWNCOOP+IF-E13'),
          betweenShare: priorIfT1('ifRestraint.betweenShare', 'OWNCOOP+IF-E13'),
        },
        theYield: {
          eighthShotsPerEpisode: priorIfT1('ifRun.shotsPerEpisode', 'OWNCOOP+IF-E13'),
          seventhShotsPerEpisode: priorIfT1('own.shotsPerEpisode', 'OWNCOOP+IF-E13'),
        },
        thePasserStillDoesNotSeeHim: {
          intendedReceiverShare: priorIfT1('flight.intendedReceiverShare', 'OWNCOOP+IF-E13'),
          receiverStartedDuringTheFlight:
            priorIfT1('receiver.classShare.startedDuringTheFlight', 'OWNCOOP+IF-E13'),
          runnersAtReleaseMean: priorIfT1('release.runnersAtReleaseMean', 'OWNCOOP+IF-E13'),
          inFlightShare: priorIfT1('run.inFlightShare', 'OWNCOOP+IF-E13'),
          negativeDeltaTHalf: priorIfT1('dt.negativeShare', 'OWNCOOP+IF-E13'),
          stalePasserStillCredited:
            priorIfT1('leak.cellShare.stalePasserStillCredited', 'OWNCOOP+IF-E13'),
        },
      },
    },
    ifC0: IFC0 === null ? null : {
      source: IFC0.source, stageId: IFC0.stageId, architecture: 'arm64', stamp: APPROX_STAMP,
      theFourNumbersOfTheContract: {
        receiverStartedDuringTheFlight: {
          armOfRecord: approxIfC0('receiver.classShare.startedDuringTheFlight', 'OWNCOOP-E13'),
          hats: approxIfC0('receiver.classShare.startedDuringTheFlight', 'HATS-E13'),
        },
        negativeDeltaTHalf: {
          armOfRecord: approxIfC0('dt.negativeShare', 'OWNCOOP-E13'),
          hats: approxIfC0('dt.negativeShare', 'HATS-E13'),
        },
        inFlightShareOfRunStarts: {
          armOfRecord: approxIfC0('run.inFlightShare', 'OWNCOOP-E13'),
          hats: approxIfC0('run.inFlightShare', 'HATS-E13'),
        },
        intendedReceiverShare: {
          armOfRecord: approxIfC0('flight.intendedReceiverShare', 'OWNCOOP-E13'),
          hats: approxIfC0('flight.intendedReceiverShare', 'HATS-E13'),
        },
      },
    },
    note: '\u26d4 NOT ONE of these numbers is typed in this instrument; each is READ BY FIELD out '
      + 'of the named artifact. \u2b50\u2b50\u2b50 EVERY ONE OF THEM IS AN arm64 NUMBER measured on a '
      + 'different host and \u2014 for IF-C0 \u2014 on a different seed block: they are \u2248 and they are '
      + 'PRINTED, NEVER SELECTING. The EXACT comparator for every face of this exam is its own '
      + 'CONTROL ARM, walked here, on this architecture, on this block.',
  },
  theHypothesesCarried: 'THIS EXAM SCORES NO HYPOTHESIS — RE-READ AT THIS FREEZE. It prices '
    + 'the AMENDED flight-run seam (M-IF.5 + M-IF.6) against R1 and the band, and the only '
    + 'verdict it takes is the frozen read at §R5.',
};

const Z975 = 1.959963984540054;
const ZSUM = 1.959963984540054 + 0.8416212335729143;
const SMOKE_N = 12;
/** ⭐⭐ THE SIZING INPUTS — the half-widths MEASURED by THIS STAGE'S OWN DISCLOSED 12-seed
 *  scratch smoke on 900,008,800–811 (FIVE walks per seed), transcribed here from
 *  §DEV-PREFLIGHT and re-derived off the artifact by `gFaces`. The declared target (#423 item
 *  3(vi)) is a 0.05 HALF-WIDTH on R1's paired Δ (the candidate vs world 17, E13) AND on the
 *  NEGATIVE-Δt HALF's paired Δ on the SAME pair. */
const SMOKE_HW_R1 = 0.02255161035621657;
const SMOKE_HW_NEGATIVE_DT = 0.027117061411352818;
const SIZING_INPUTS = [
  { face: 'r1.runsPerInPossessionTick@OWNCOOP+IF-E13|OWNCOOP-E13',
    key: R1_KEY, contrast: CONTRAST_OF_RECORD as Cid,
    hwSmoke: SMOKE_HW_R1, target: 0.05 },
  { face: 'dt.negativeShare@OWNCOOP+IF-E13|OWNCOOP-E13',
    key: 'dt.negativeShare', contrast: CONTRAST_OF_RECORD as Cid,
    hwSmoke: SMOKE_HW_NEGATIVE_DT, target: 0.05 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    face: r.face, hwSmoke: r.hwSmoke, target: r.target,
    smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, blockAffords: N_FROZEN,
    degenerate: r.hwSmoke === 0,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);
/** the REALISED half-widths at N, published beside the projection */
const REALISED_HALF_WIDTHS = SIZING_INPUTS.map((r) => {
  const d = delta(r.key, r.contrast);
  return { face: r.face, realisedHalfWidth: d.halfWidth, delta: d.delta,
    ci: [d.ciLo, d.ciHi], target: r.target };
});

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, WORLD_PIN_SEED, FIXTURE_SEED, ...IF_SCRATCH_SEEDS];
/** ⭐⭐⭐ gScratchBand (#410 item 3(iv), the FORM NOTE of §CORR-C 3): every scratch seed this
 *  instrument walks is DERIVED from ONE declared base and asserted to lie INSIDE the DECLARED
 *  BAND — the failure #410 §CORR-C 3 disposed (a pin suite's scratch bases strayed into the
 *  verifier's reserved range) made a STORED CHECK here. The battery seeds are NOT scratch and
 *  are excluded by name; the RE-WALKS are DS-T1b's own consumed band and are named separately. */
const SCRATCH_BAND: [number, number] = [SCRATCH_BASE, SCRATCH_BASE + 99];
const SCRATCH_SEEDS_WALKED = [
  { what: 'the sizing smoke (§DEV-PREFLIGHT, twelve seeds)',
    seeds: Array.from({ length: 12 }, (_, i) => SCRATCH_BASE + i) },
  { what: 'the smoke receipt', seeds: [SCRATCH_BASE + 20] },
  { what: 'the world pin', seeds: [WORLD_PIN_SEED] },
  { what: 'the lockstep pair (X-DET and gPullCount re-use it)', seeds: LOCKSTEP_SEEDS },
  { what: 'the fixtures\' attribute draw', seeds: [FIXTURE_SEED] },
  { what: 'gArmIF\'s construction walks (five arms per seed)', seeds: IF_SCRATCH_SEEDS },
];
const SCRATCH_SEEDS_FLAT = [...new Set(SCRATCH_SEEDS_WALKED.flatMap((r) => r.seeds))]
  .sort((a, b) => a - b);
const SCRATCH_OUT_OF_BAND = SCRATCH_SEEDS_FLAT
  .filter((x) => x < SCRATCH_BAND[0] || x > SCRATCH_BAND[1]);
const SCRATCH_BAND_OK = SCRATCH_BAND[0] >= 900_000_000
  && SCRATCH_OUT_OF_BAND.length === 0
  && SCRATCH_SEEDS_FLAT.every((x) => x >= 900_000_000)
  && SCRATCH_SEEDS_FLAT.every((x) => x < BLOCK_BASE || x > BLOCK_TOP)
  && ALL_SCRATCH.every((x) => x >= SCRATCH_BAND[0] && x <= SCRATCH_BAND[1])
  /* the walked battery band and the scratch band are DISJOINT, both ways */
  && (BLOCK_TOP < SCRATCH_BAND[0] || BLOCK_BASE > SCRATCH_BAND[1]);
fx('scratch.everySeedIsDERIVEDFromTheONEDeclaredBase',
  SCRATCH_SEEDS_FLAT.every((x) => x - SCRATCH_BASE >= 0 && x - SCRATCH_BASE <= 99), true);
fx('scratch.aSeedONEPastTheBandWouldBeCAUGHT',
  [SCRATCH_BASE + 100].filter((x) => x < SCRATCH_BAND[0] || x > SCRATCH_BAND[1]).length, 1);
fx('scratch.theBandIsOUTOFBANDByCanonsOwnFloor', SCRATCH_BAND[0] >= 900_000_000, true);
fx('scratch.theBatteryBandAndTheScratchBandAreDISJOINT',
  SCRATCH_SEEDS_FLAT.some((x) => x >= BLOCK_BASE && x <= BLOCK_TOP), false);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);
const CONSUMED_BLOCKS = [12_544_000, 12_545_000, 12_546_000, 12_547_000, 12_548_000,
  12_549_000, 12_550_000, 12_551_000, 12_552_000, 12_553_000, 12_554_000, 12_555_000,
  12_556_000, 12_557_000, 12_558_000, 12_559_000];
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
/** ⭐⭐⭐ THE COUPLING COUNTERS' OWN EMPTINESS TABLE, ENUMERATED per arm — ⛔ NO FALSE UNIVERSAL
 *  and ⛔ NO GATE ON A DIRECTION: the two DISAPPEARING FACES are ALLOWED to be zero on an arm
 *  (that is a MEASUREMENT, and on the COOP-OFF arms it is the arm's construction), so their
 *  zeroes are ENUMERATED here instead of gated. What IS gated is `overlapSets` and `wallFires`
 *  on the arms that carry the hats — without those two the COOP-OFF zero would mean nothing. */
const EMPTY_COUPLING_COUNTERS = ARMS.flatMap((armK) =>
  (['overlapSets', 'wallFires', 'overlapArrivedStat', 'wallOneTwosStat',
    'overlapReleaseFires', 'fireWallReturnUpperBound'] as const)
    .filter((k) => tot(armK, (r) => r[k]) === 0).map((k) => `${armK}.${k}`));
const CLASSES_LIVE = ARMS.every((armK) => tot(armK, (r) => r.r1TeamTicks) > 0
    && tot(armK, (r) => r.offBallDecisionTicksPost) > 0
    && tot(armK, (r) => r.makeRunTicksPost) > 0
    && tot(armK, (r) => r.wallEligiblePasses) > 0
    && tot(armK, (r) => r.shotLogRows) > 0
    && tot(armK, (r) => r.completedHatted + r.completedUnhatted) > 0)
  && OWN_ARMS.every((armK) => tot(armK, (r) => r.ownEpSets) > 0
    && tot(armK, (r) => r.runClassTicks[RCI('ownRunInBehind')]) > 0)
  /* ⭐⭐⭐ THE TENTH CELL IS NON-VACUOUS ON THE CANDIDATE ARMS — this IS `gBiteIF`'s
   * non-vacuity (#420 item 2(iv)), stored ONCE and read here. */
  && IF_ARMS.every((armK) => tot(armK, (r) => r.ifWhyDecisions) > 0
    && tot(armK, (r) => r.ifEpSets) > 0
    && tot(armK, (r) => r.ifCandidateVisible) > 0
    && tot(armK, (r) => r.ifRestraintN) > 0
    && sum(armRows(armK).map((r) => sum(r.ifStartBallMotion))) > 0
    && sum(armRows(armK).map((r) => sum(r.ifStartMemoryCells))) > 0)
  && NON_IF_ARMS.every((armK) => tot(armK, (r) => r.ifWhyDecisions) === 0)
  /* the Q4 populations every published face stands on */
  && ARMS.every((armK) => tot(armK, (r) => r.runStartsAll) > 0
    && tot(armK, (r) => r.releases) > 0
    && tot(armK, (r) => r.completionsJoinedToAFlight) > 0
    && sum(armRows(armK).map((r) => sum(r.dtBinsByClass))) > 0)
  && ARMS.filter((a) => ARM_KIND[a] !== 'HATS').every((armK) =>
    tot(armK, (r) => r.perceivedStamped) > 0)
  && ARMS.filter((a) => ARM_KIND[a] === 'HATS').every((armK) =>
    tot(armK, (r) => r.epSets[ECI('runner')]) > 0
    && tot(armK, (r) => r.epSets[ECI('arriver')]) > 0)
  && ARMS.every((armK) => tot(armK, (r) => r.runMulCount) > 0)
  /* ⭐⭐⭐ DS-T1c's OWN populations: the guard denominator on every arm; the own candidate and
   * both back-outs on every arm carrying `dsOwnRun`; the RESTRAINT and its inversion on the
   * seat-ABSENT own arms (where `obmRunMul` is 1 by construction) — and, positively, EMPTY on
   * every dosed arm, which is the emptiness the product face exists to name. */
  && ARMS.every((armK) => tot(armK, (r) => r.unhattedOffBallTicksPost) > 0)
  && OWN_ARMS.every((armK) => tot(armK, (r) => r.ownCandidateVisible) > 0
    && tot(armK, (r) => r.ownBackOutN) > 0)
  && OWN_ARMS.every((armK) =>
    tot(armK, (r) => r.restraintN) > 0
    && tot(armK, (r) => r.restraintExactZero) > 0
    && tot(armK, (r) => r.restraintExactOne) > 0)
  && OWN_ARMS.every((armK) => tot(armK, (r) => r.ownCandidatePriorZero) > 0
    && tot(armK, (r) => r.ownCandidatePriorAbove) > 0)
  /* ⭐⭐⭐ THE COUPLING FACES' OWN LIVENESS: on the NON-COOP arms both cooperation counters are
   * NON-ZERO (which is what makes G-ARM-COOP's zero on the COOP arms mean anything), and the
   * passer's read population (the carrier's own decision ticks) is live on EVERY arm. */
  && ARMS.filter((a) => ARM_KIND[a] === 'HATS').every((armK) =>
    tot(armK, (r) => r.overlapSets) > 0 && tot(armK, (r) => r.wallFires) > 0)
  && ARMS.every((armK) => tot(armK, (r) => r.carrierDecisionTicks) > 0);
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
  ['coupling.overlapArrivalsPerMatch', 'coupling.overlapSetsPerMatch'],
  ['coupling.wallReturnShareOfFires', 'coupling.wallFiresPerMatch'],
  ['passer.overlapReleaseFiresPerMatch.perCarrierTick', 'passer.overlapReleaseFiresPerMatch'],
  ['passer.wallReturnFiresPerMatch.perCarrierTick', 'passer.wallReturnFiresPerMatch'],
  ['passer.thirdManFiresPerMatch.perCarrierTick', 'passer.thirdManFiresPerMatch'],
  ['passer.arriverCutbackTakenPerMatch.perCarrierTick', 'passer.arriverCutbackTakenPerMatch'],
  ['ifRun.shotsPerEpisode', 'ifRun.shotsPerMatch'],
  ['ifRun.meanTicksPerEpisode', 'ifRun.episodesPerMatch'],
  ['ifRestraint.exactlyOneShare', 'ifRestraint.observationsPerMatch'],
  ['ifStart.ballMotionShare.inTheAir', 'ifStart.stampedStartsPerMatch'],
  ['ifStart.memoryShare.theLastPasser', 'ifStart.stampedStartsPerMatch'],
  ['ifStart.phaseShare.playing', 'ifStart.stampedStartsPerMatch'],
  ['ifStart.lookDistanceShare.distance1', 'ifStart.stampedStartsPerMatch'],
  ['run.inFlightShare', 'run.inFlightStartsPerMatch'],
  ['dt.negativeShare', 'dt.attachedStartsPerMatch'],
  ['flight.intendedReceiverShare', 'flight.startsOnHisSidesPassPerMatch'],
  ['receiver.classShare.startedDuringTheFlight',
    'receiver.classPerMatch.startedDuringTheFlight'],
  ['leak.cellShare.stalePasserStillCredited', 'leak.cellPerMatch.stalePasserStillCredited'],
  ['release.runnersAtReleaseMean', 'release.perMatch'],
  ['perceived.staleShare', 'perceived.stampedStartsPerMatch'],
];
const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((armK) => allRows(armK).every((r) => r.worldOk && r.edsChoiceOn
      && r.genomeClean && r.pcHoldsReadable && r.infoGenomeCleanOfMatrix
      && r.dsOwnRunFlag === (ARM_KIND[armK] !== 'HATS')
      && r.dsHatsOffFlag === (ARM_KIND[armK] !== 'HATS')
      && r.dsCoopHatsOffFlag === (ARM_KIND[armK] !== 'HATS')
      && r.ifFlightRunFlag === ARM_CARRIES_IF[armK]
      && r.obmFlag === false
      && r.matrixOnBaseEff === false)) && WORLD_PIN_OK,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`bqArmedVersion(m) === ${BQ_WORLD_VERSION}\`, \`bqCushion\` TRUE, `
      + `\`lnArmedVersion(m) !== ${LN_WORLD_VERSION}\` and \`gkArmedVersion(m) !== `
      + `${GK_WORLD_VERSION}\` with both `
      + 'doors ABSENT (`lnOwnLanePrice` and `gkDiveBody` FALSE); `edsPerceivedChoice` TRUE; '
      + 'every CTB / RC / BF seam ABSENT; ⭐⭐⭐ THE **THREE** DS FLAGS EXACTLY AS '
      + 'DUE per arm (`dsOwnRun` AND `dsHatsOff` together on the OWN and OWNCOOP arms — '
      + 'world 16\'s door set — and `dsCoopHatsOff` on the OWNCOOP arms ONLY); ⛔ '
      + '`obmMovement` **FALSE ON EVERY ARM** and NO 16-slot matrix on `baseGenome` or '
      + '`effGenome` of either team on ANY arm (rule (h): NO DOSE — the seat is absent '
      + 'throughout and the inherited dose code is REMOVED, not dormant); and ⛔ '
      + '`info.genome` CLEAN OF ANY MATRIX and of the own-lane / RC / CTB / OBM-support genes '
      + 'on EVERY arm. Pinned again on a CONSTRUCTED match of each arm at scratch seed '
      + `${WORLD_PIN_SEED}`,
  },
  gArmIF: {
    ok: ARM_IF_OK,
    note: '\u2b50\u2b50\u2b50 gArmIF (#420 item 2(iv)) \u2014 A STORED BOOLEAN OF THE ARM\'S CONSTRUCTION, '
      + '\u26d4 NEVER NARRATED AS A FINDING: it is what `ifFlightRun` MEANS. On EVERY arm NOT '
      + 'carrying the flight door the EIGHTH `why` count is EXACTLY 0 and the belief map '
      + '`match.ifLastSeenOwnerGid` is EMPTY at full time, on EVERY battery seed AND on the '
      + 'construction receipt AND on two whole construction walks at the declared scratch '
      + `seeds: ${armIfRows.map((r) => `${r.arm} eighth-why ${r.eighthWhyDecisions} \u00b7 belief `
        + `${r.beliefEntriesSum}`).join(' \u00b7 ')}. `
      + 'NON-VACUITY: on the two arms that DO carry it both counts are > 0 over the battery '
      + '\u2014 without that the zeroes would mean nothing',
  },
  gArmCoop: {
    ok: ARM_COOP_OK,
    note: '\u2b50\u2b50 THE COOPERATION COUNTERS, STORED BESIDE (world 17\'s own construction, inherited '
      + 'from DS-T1d): every arm but `HATS-E13` carries `dsCoopHatsOff`, so `overlapSets` and '
      + '`wallFires` are ZERO there and NON-ZERO on `HATS-E13`: '
      + `${armCoopRows.map((r) => `${r.arm} ${r.overlapSets}/${r.wallFires}`).join(' \u00b7 ')}`
      + '. \u26d4 A STORED CHECK OF CONSTRUCTION, never a finding',
  },
  gReadLiterals: {
    ok: READ_LITERAL_HOMES.ok,
    note: '⭐⭐⭐ THE READ SENTENCES ARE FROZEN LITERALS AND THEY LIVE IN THREE HOMES. This gate '
      + 'reads the RULINGS file and the CONTRACT off disk, normalises both, and asserts that '
      + `each required home carries each literal: ${READ_LITERAL_HOMES.rows
        .map((r) => `${r.literal}@${r.home.split('/').pop()} ${r.required ? '' : '(optional) '}`
          + `${r.found ? 'FOUND' : 'ABSENT'}`).join(' · ')}. ⚠ THE DECLARED ASYMMETRY: `
      + READ_LITERAL_HOMES.fallbackAsymmetry,
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
      + '/ MIN-MAX aliases / the KITCHEN-SINK sweep\'s own lines) · ⭐⭐⭐ DS-T0c\'s AMENDMENT '
      + '(the four-factor score line, the restraint expression and its three count inputs, the '
      + 'percept pull, the perceived-owner guard, the RANK lines — `mine`, `theirs`, the '
      + 'COACH\'S OWN COMPARATOR and the cap\'s closing line — and its three exclusion lines, '
      + '`runRank`\'s head and `return` and the shipped `.map` that CALLS it, '
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
      + 'tired limb, and refusing a zero prior; ⭐⭐⭐ THE RANK LAW — the cap\'s BOTH arms, the '
      + 'restraint\'s value set proved to be EXACTLY {0, 1} over the whole (count × rankAbove) '
      + 'grid, the COACH\'S OWN COMPARATOR in both tie directions and against his own index, '
      + 'and the comparator checked AGAINST AN ACTUAL SORT of a five-body grid; ⭐⭐⭐ THE '
      + 'ZERO-SCORE AMBIGUITY — the DF clamp at exactly 0 and just inside it, the ST on the '
      + 'goal line at exactly 1, a zero prior leaving the back-out UNDEFINED (not zero) and a '
      + 'POSITIVE prior making a zero score mean restraint 0; ⭐⭐ `runRank` — all three call '
      + 'sites, the retired inline expression absent, and this instrument\'s prior proved '
      + 'EQUAL to `clamp01(runRank(role, x) / RUN_PRIOR_MAX)` at every role × quarter-metre '
      + 'with a typed divisor breaking it; ⭐⭐ gScratchBand\'s own band arithmetic; ⭐⭐⭐ THE '
      + '`flagGated` CLASSIFIER on the seam\'s '
      + 'own push (exactly ONE flag-gated push, naming `dsOwnRun`, NOT hat-guarded) and the '
      + 'shipped-path boolean DERIVED; the READ-FORK inventory PARSED from the seam doc and '
      + 'compared. ⛔ NO fixture asserts a direction',
  },
  gLedgerRead: {
    ok: ARMS.every((armK) => tot(armK, (r) => r.wallEligiblePasses) > 0
      && tot(armK, (r) => r.shotLogRows) > 0
      && tot(armK, (r) => r.shotsJoinedToAShooter) > 0
      && tot(armK, (r) => r.goalRowsJoinedAtThePush) > 0)
      && ARMS.every((armK) => tot(armK, (r) => r.ledgerDecisionsHeld) > 0)
      && IF_ARMS.every((armK) => tot(armK, (r) => r.beliefEntriesAtFullTime) > 0)
      && NON_IF_ARMS.every((armK) => tot(armK, (r) => r.beliefEntriesAtFullTime) === 0)
      && IF_ARMS.every((armK) => tot(armK, (r) => r.lookEntriesAtFullTime) > 0)
      && NON_IF_ARMS.every((armK) => tot(armK, (r) => r.lookEntriesAtFullTime) === 0),
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
      + '`pcLatency.ledger.decisionsHeld` itself (debt (a)\'s calibration target); ⭐⭐⭐ THE TWO '
      + 'REGISTERED READS OF THE SEAM\'S OWN BOOKKEEPING: `match.ifLastSeenOwnerGid` (THE '
      + 'BELIEF, registered at IF-T1 — registry 86 → 87) and ⭐ AMENDMENT `match.ifLook` (THE '
      + 'LOOK COUNTER, M-IF.6\'s own map, REGISTERED HERE — registry 87 → 88). BOTH are READ, '
      + 'NEVER WRITTEN: the belief feeds the eighth class\'s START-STATE MEMORY partition and '
      + 'the LOOK COUNTER feeds its LOOK-DISTANCE partition, and each map\'s size at full time '
      + 'is stored (`gArmIF` asserts BOTH EMPTY on every arm without the door). WHERE NO '
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
      + `with a zero count = [${EMPTY_STATE_CLASSES.join(', ') || 'none'}]; ⭐⭐⭐ COUPLING `
      + `counters with a zero count = [${EMPTY_COUPLING_COUNTERS.join(', ') || 'none'}] (the `
      + 'two DISAPPEARING FACES are ALLOWED to be zero on an arm — that is a measurement, and '
      + 'on the COOP-OFF arms it is the arm\'s construction; what is GATED is `overlapSets` '
      + 'and `wallFires` on the arms that carry the hats); arms whose '
      + `\`runMulLic\` limb has NO observation = [${ARMS
        .filter((a) => tot(a, (r) => r.runMulLicN) === 0).join(', ') || 'none'}] (the licensed `
      + 'run is the coach\'s, and on the OWN arms the open-play board is empty BY '
      + 'CONSTRUCTION). The gate asserts '
      + 'LIVENESS on every class a READ or a beside-sentence stands on — R1\'s own denominator, '
      + 'the off-ball population, the `MakeRun` population, the eligible passes, the shot rows, '
      + 'BOTH sides of the downstream pair on EVERY arm; the OWN-RUN EPISODE and the '
      + '`ownRunInBehind` class on every arm carrying `dsOwnRun`; BOTH restraint cells (exactly '
      + '0 AND exactly 1) and BOTH prior cells (zero AND above zero) on every seat-absent own '
      + 'arm, and the restraint family EMPTY on every dosed arm; the runner and arriver '
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
      + `${SHIPPED_PATH_PUSHES.length} pushes reachable with EVERY DS flag absent. ⭐⭐ THE `
      + `THREE DS FLAGS' READ FORKS: ${READ_FORKS.length} in \`src/**\`, enumerated with file `
      + 'and line and compared FILE-AND-LINE to the SEAM DOC\'s OWN READ-FORK INVENTORY table '
      + 'PARSED out of the markdown, plus its per-file executable-line occurrence counts — '
      + 'EQUAL (a difference is RED). ⚠ `ifFlightRun` has NO `if (…) {` read fork at all — it '
      + 'is ALIASED and consumed in boolean expressions — so the fork inventory is unchanged '
      + 'by this seam, and that is STATED, not assumed. ⭐⭐⭐ ⭐ AMENDMENT: THE SEAM\'S READ SET '
      + `IS **SEVEN** \`match\` MEMBERS at this head (${(OWN_BLOCK?.members ?? []).join(' · ')}`
      + '), EXTRACTED from the fork\'s whole text and EQUAL to §LAW-B 2\'s own seven-member '
      + 'sentence PARSED out of the markdown (DS-T0 §LAW-C 4\'s three asserted a SUBSET); the '
      + 'FOUR aliases are the FIRST FOUR EXECUTABLE STATEMENTS inside the fork and their lines '
      + 'are CONSECUTIVE; the belief AND the look counter each have ONE read site and ONE '
      + 'write site in all of `src/**`; and `a4World.ts` carries none of the three IF names',
  },
  gBiteIF: {
    ok: BITE_IF_OK,
    note: '\u2b50\u2b50\u2b50 gBiteIF \u2014 THE #414 ROW FORM, VERBATIM FROM CANON (*rare-event liveness on '
      + 'the row*): on every battery seed where the CANDIDATE arm recorded \u2265 1 EIGHTH-`why` '
      + 'decision, the candidate\'s and the control\'s per-seed ROWS differ in AT LEAST ONE '
      + 'STORED FIELD. '
      + `${biteRows.map((b) => `${b.contrast} rows ${b.rowsDiffering}/${b.eligibleSeeds}`
        + `${b.exemptSeeds > 0 ? ` (${b.exemptSeeds} exempt)` : ''}`
        + ` \u00b7 signatures ${b.signaturesDiffering}/${b.eligibleSeeds}`).join(' \u00b7 ')}. `
      + 'THE FULL-TIME SIGNATURE COMPARISON IS PRINTED BESIDE AND GATES NOTHING (#414 item '
      + '4(ii)\'s FAMILY NOTE: a full-time state snapshot is not a trajectory hash and a rare '
      + 'effect can be absorbed before the whistle). THE SHAPE WHERE NOTHING CAN BITE IS '
      + 'EXEMPTED AND NAMED: a seed on which the candidate recorded ZERO eighth-`why` decisions '
      + 'gave the flight door nothing to relabel. \u2b50\u2b50\u2b50 ITS NON-VACUITY: the eighth-`why` count '
      + `on the candidate arm is ${EIGHTH_WHY_TOTAL_CANDIDATE} over the battery `
      + `(${EIGHTH_WHY_PER_MATCH_CANDIDATE} per match). \u26a0 LIVENESS ONLY \u2014 a differing row says `
      + 'the seam FIRED, never that it helped \u2014 \u2b50 AND IT IS A PRECONDITION OF EVERY READ: '
      + 'RED here means NO read is selected',
  },
  gRepro: {
    ok: REPRO_OK,
    note: `⭐⭐⭐ gRepro: ${reproDetail.comparedFields.length} fields × `
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
    note: '⭐ CORRECTION (#421 item 4(ii), applied at THIS freeze — the note now names THIS '
      + 'stage\'s own block and THIS stage\'s own re-walks). BOOKED = WALKED, derived from the '
      + `CELLS' OWN distinct seeds: every battery seed (${BLOCK_BASE}–${BLOCK_TOP - 1}) and `
      + `the construction receipt (${BLOCK_TOP}) lie inside block 12,560,000–999, each seed is `
      + `walked ONCE PER ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked `
      + 'tail is DECLARED in the `seeds` block, and EVERY scratch seed this instrument walks '
      + '(the sizing smoke band 900,008,800–811, the smoke receipt 820, `gArmIF`\'s two '
      + 'construction walks 840–841, the world pin 870, the lockstep pair 890–891 which X-DET '
      + 'and `gPullCount` re-use, and the fixture attribute draw 899) is out-of-band and '
      + 'STORED there. ⭐ THE TWO RE-WALK BANDS are OTHER STAGES\' OWN CONSUMED BANDS and are '
      + 'NOT a consumption: 12,558,000–002 is IF-C0\'s and 12,559,000–002 is IF-T1\'s — canon, '
      + 'VERBATIM: "verifier scratch walks use the stage\'s own consumed band or the '
      + 'out-of-band scratch range (≥ 900,000,000) — never the next virgin block"',
  },
  gSeedDisjoint: {
    ok: walkedSeeds.every((s) => s >= BLOCK_BASE) && ALL_SCRATCH.every((s) => s >= 900_000_000)
      && (IS_OVERRIDE || (walkedSeeds[0] === BLOCK_BASE && RECEIPT_SEED === BLOCK_TOP))
      && CONSUMED_BLOCKS.every((b) => b + 999 < BLOCK_BASE)
      && REPRO_SEEDS.every((s) => s >= 12_558_000 && s <= 12_558_999)
      && REPRO_T1_SEEDS.every((s) => s >= 12_559_000 && s <= 12_559_999),
    note: '⭐ CORRECTION (#421 item 4(ii), applied at THIS freeze — ALL SIXTEEN consumed '
      + 'blocks are named and the frontier is THIS stage\'s own). SEED-DISJOINT at the '
      + 'frontier of #423 item 4 (next sim ≥ 12,560,000): every battery seed is ≥ 12,560,000 '
      + 'and inside THIS block, disjoint from every consumed block — LN-C0 12,544,000–999 · '
      + 'LN-T1 12,545,000–999 · LN-C1 12,546,000–999 · LN-C2 12,547,000–999 · LN-C3 '
      + '12,548,000–999 · LN-T1′ 12,549,000–999 · LN-T1′b 12,550,000–999 · GK-C0 '
      + '12,551,000–999 · GK-T1 12,552,000–999 · DS-C0 12,553,000–999 · DS-T1 12,554,000–999 '
      + '· DS-T1b 12,555,000–999 · DS-T1c 12,556,000–999 · DS-T1d 12,557,000–999 · IF-C0 '
      + '12,558,000–999 · IF-T1 12,559,000–999 — SIXTEEN in all, each of which is CHECKED to '
      + 'end BELOW this block\'s base. The two re-walk bands lie INSIDE their own stages\' '
      + 'consumed blocks (IF-C0\'s 12,558,000–002 and IF-T1\'s 12,559,000–002) and are asserted '
      + 'to; ZERO stats consumed',
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
  gScratchBand: {
    ok: SCRATCH_BAND_OK,
    note: '⭐⭐⭐ gScratchBand (#410 item 3(iv); the FORM NOTE of the seam doc\'s §CORR-C 3, which '
      + 'disposed a pin suite whose scratch bases strayed into the verifier\'s reserved range): '
      + `EVERY scratch seed this instrument walks — ${SCRATCH_SEEDS_FLAT.length} of them, `
      + `${SCRATCH_SEEDS_WALKED.map((r) => `${r.seeds.length} for ${r.what}`).join(' · ')} — is `
      + `DERIVED from the ONE declared base ${SCRATCH_BASE} and lies INSIDE the DECLARED BAND `
      + `[${SCRATCH_BAND[0]}, ${SCRATCH_BAND[1]}]; the out-of-band list is `
      + `[${SCRATCH_OUT_OF_BAND.join(', ') || 'empty'}]. The band sits above canon\'s own `
      + 'scratch floor and is DISJOINT from the battery block both ways. The seed list and the '
      + 'band are STORED in `seeds`',
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
  'faceBlocks', 'medians', 'bins', 'definitions', 'arms', 'contrasts', 'branches', 'runClasses',
  'episodeClasses', 'states', 'conjuncts', 'actions', 'codeFacts', 'noDose', 'armCoop',
  'doseSource',
  'twoFractionPairs', 'worldPin', 'seeds', 'stats', 'anchoredSites', 'fixtures', 'lockstep',
  'eighthClass', 'q4', 'approx', 'prior', 'armIf',
  'determinism', 'fingerprintProd', 'loo', 'bite', 'repro', 'perf', 'sizing', 'perSeedCells',
  'constructionReceipt', 'seamFaces', 'hNumbers', 'pullCount', 'inheritedProse',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'IF-T1b',
    title: '\u300c\u7403\u5728\u98de\u65f6\u7684\u524d\u63d2 \u00b7 \u590d\u8003\u300d THE FLIGHT RUN\'S RE-EXAM \u2014 IF-T1 '
      + 're-walked BY RECIPE with the AMENDED seam (M-IF.5 the whistle + M-IF.6 the '
      + 'two-look freshness) on block 12,560,000\u2013999. With world 17\'s door set in '
      + 'place, what does the RUN ONTO A BALL ALREADY TRAVELLING produce that R1 and the band '
      + 'can see? FIVE arms, the OBM seat ABSENT throughout: on world 13 EMPTY-BOOK \u2014 HATS '
      + '(world 13 as shipped) \u00b7 OWNCOOP (world 17\'s door set, THE CONTROL) \u00b7 OWNCOOP+IF '
      + '(+ `ifFlightRun`, THE WORLD-18 CANDIDATE) \u2014 with the D13 pair beside. THE COMPARISON '
      + 'OF RECORD is OWNCOOP+IF vs OWNCOOP on E13, paired, CONTROL = OWNCOOP; HATS vs the '
      + 'candidate is printed BESIDE. R1 = EXECUTED runs per in-possession open-play tick; the '
      + 'band = ten guards with every breach\'s DIRECTION; the faces = DS-T1d\'s, PLUS THE '
      + 'EIGHTH `why` AS ITS OWN CLASS (the TENTH classifier cell `ownRunOntoFlight`) with its '
      + 'START-STATE, RESTRAINT and YIELD partitions \u2014 the START STATE now ALSO '
      + 'partitioned BY PHASE (a stored receipt of M-IF.5) and BY LOOK DISTANCE (a stored '
      + 'receipt of M-IF.6) \u2014 PLUS IF-C0\'s Q4 FACES copied BY FIELD NAME with '
      + 'their \u2248 CROSS-ARCHITECTURE twins, and \u2b50 IF-T1\'s OWN x64 numbers '
      + 'beside EVERY face as the EXACT prior twin `prior.ifT1`.',
    doc: 'docs/world-model/IF-T1B-FLIGHT-RUN-EXAM-RERUN.md',
    instrument: INSTRUMENT_PATH,
    instrumentSha256: sha(readFileSync(INSTRUMENT_PATH, 'utf8')),
    inheritedInstrument: 'scripts/probes/if-t1-flight-run-exam.ts',
    inheritedStageDoc: 'docs/world-model/IF-T1-FLIGHT-RUN-EXAM.md',
    inheritedInstrumentGrandparent: 'scripts/probes/ds-t1d-coop-hats-exam.ts',
    q4FacesCopiedFrom: 'docs/world-model/IF-C0-FLIGHT-RUN-CENSUS.md',
    q4InstrumentCopiedFrom: 'scripts/probes/if-c0-flight-run-census.ts',
    couplingFacesCopiedFrom: 'docs/world-model/DS-C0-DESIGNATION-CENSUS.md',
    examFormOfRecord: 'docs/world-model/GK-T1-DIVE-EXAM.md',
    seamUnderExam: 'docs/world-model/IF-T0-FLIGHT-RUN-SEAM.md §LAW-B (the AMENDED law — '
      + 'M-IF.5 the whistle and M-IF.6 the two-look freshness; §LAW governs where they do not '
      + 'differ)',
    switchUnderExam: 'docs/world-model/DS-T0-OWN-RUN-SEAM.md §SWITCH-D',
    contract: 'docs/world-model/IF-FLIGHT-RUN-CONTRACT.md',
    parentContract: 'docs/world-model/DS-DESIGNATION-CONTRACT.md',
    authorizedBy: 'COMMANDER RULING #423 item 3 (binding, with #422 item 4), in the IF-T1 '
      + 'form of #420 item 2; the EIGHT CORRECTIONS of #421 item 4 APPLIED AT THIS FREEZE',
    hostArchitecture: HOST_ARCH,
    theHostFact: '⭐⭐⭐ #418 items 1–2: every digest, census and exam number banked before this '
      + 'round is an arm64 number and this host is x64. Every face here is an x64 number; the '
      + 'EXACT comparator is this exam\'s OWN control arm; IF-C0\'s arm64 values are stored '
      + 'beside as ≈ under `approx.ifC0` and SELECT NOTHING; `gRepro` gates only on arm64 and '
      + 'STORES here; X-FP-PROD is arch-keyed.',
    theLivenessPrecondition: '⭐⭐⭐ #420 item 2(iii): LIVENESS IS A PRECONDITION OF EVERY READ. '
      + 'If `gBiteIF` is RED no read is selected and the frozen string "THE SEAM DID NOT FIRE '
      + '— no read" is stored instead.',
    kind: 'EXAM — it arms NOTHING in the game and SHIPS NOTHING. The READ SENTENCES are #413 '
      + 'item 5(iii)\'s literals, frozen ex ante and selected by STORED booleans with the '
      + 'ruling\'s own precedence; NO VERDICT WORD is printed on any yield, coupling, seam or '
      + 'hypothesis face — the two DISAPPEARING FACES are PRINTED BESIDE the read and never '
      + 'judged. The commander rules.',
    theHonestyLine: HONESTY_LINE,
    xSrcZero: '⭐ CORRECTION (#421 item 4(iii), applied at THIS freeze): no file under `src/` '
      + 'or `tests/` is created or edited, and ⛔ THIS INSTRUMENT NAMES NO SPY BECAUSE IT '
      + 'INSTALLS NONE. The probe reads public `Match` / `Team` / `Player` / `Ball` state and '
      + 'the engine\'s own decision record before and after `match.step(DT)`. THERE IS NO '
      + 'WRAPPER ON ANY WALKED MATCH — `gLockstep` proves observed ≡ unobserved byte for byte '
      + 'PER ARM. The ONLY wrapper anywhere is `gPullCount`\'s own pull counter, which is '
      + 'installed on THROWAWAY matches at out-of-band scratch seeds, never on a battery walk, '
      + 'and which proves its own transparency against the UNWRAPPED lockstep signature.',
    theQuestion: '⭐ AMENDMENT — THE RE-EXAM\'S OWN QUESTION (#423 item 3): IF-T1 measured the '
      + 'run onto the flight and read READ 2 — the flight run CARRIES A FACE (G9, through '
      + 'balls, UP) — and the state that licensed the run was looser than the user\'s own '
      + 'sentence. #422 narrowed it: the run starts ONLY when he SAW THE PASS LEAVE (his '
      + 'previous look had the ball at a same-side mate\'s feet and this look has it '
      + 'ownerless) AND the game is LIVE. WITH THAT NARROWED SEAM, what does the run onto a '
      + 'ball already travelling produce that R1 and the band can see? The reads, their '
      + 'precedence and the liveness precondition are UNCHANGED; only the seam under them '
      + 'moved.',
    theArcSoFarQuotedByField: '⭐⭐⭐ THE ARC\'S READINGS ARE QUOTED BY FIELD out of their own '
      + 'artifacts under `hNumbers.theArcQuotedByField`, never typed here: DS-T1c read 1, '
      + 'DS-T1d read 1, and ⭐ IF-T1\'s OWN READ OF RECORD (also at `prior.ifT1ReadOfRecord`). '
      + 'IF-T1\'s numbers themselves are printed beside EVERY face as `prior.ifT1` — an EXACT '
      + 'twin in kind (same host, same architecture, same construction) measured on the block '
      + 'BEFORE this one. ⛔ NO PAIRED Δ ACROSS THE TWO BLOCKS IS CLAIMED.',
    theSwitchsFactsOfRecord: '⭐⭐ #413 items 1–2, as FACTS this exam inherits and does not '
      + 're-derive: the flag is declared at `Match.ts:777 / :1718 / :2571` and '
      + '`League.ts:300`, the two gates at `TeamBrain.ts:398` and `mechanics.ts:430`, the '
      + 'additivity was proven WHOLE-FILE (pure insertion), G-OFF reproduced four digests at '
      + 'the commit, and ARMED the two hats were NEVER ISSUED over whole matches. THIS '
      + 'instrument re-measures the read-fork inventory and the arm construction; it does not '
      + 'restate #413\'s numbers as its own.',
    ruleM: '⭐⭐⭐ RULE (m) (#413 §CORR-D 5): `assignRunners`\' WHOLE-TEXT hash is STATED at THIS '
      + 'head and COMPARED TO NOTHING BANKED — gate 1 lives inside that function, so DS-C0\'s '
      + 'and DS-T1c\'s banked literals for it read RED BY DECLARATION. Every other inherited '
      + 'span hash is compared as before.',
    theThreeDebtsPaid: {
      a: 'THE DECISION-TICK PREDICATE reads `pcLatency`\'s own holds map AFTER `m.step(DT)` at '
        + 'the tick the decide loop used. DS-C0\'s PRE-STEP form is recomputed BESIDE it and '
        + 'both are compared to the ENGINE\'S OWN `pcLatency.ledger.decisionsHeld` per-tick '
        + 'delta — the receipt is `faceBlocks.decisionTickCalibration` and the `calib.*` faces.',
      b: 'THE SHOOTER GID is recorded AT THE SHOT\'S PUSH, while `pendingShot` is live, into a '
        + 'per-`logIndex` map; the goal join reads that map at the outcome flip.',
      c: `THE EPISODE-TICK BINS run past ONE FULL wallRun LICENCE — ${WALL_LICENCE_TICKS} ticks `
        + `at DT = 1/60, DERIVED from the licence's own ${WALL_WINDOW} s and never typed; the `
        + `top bin's LOWER EDGE is ${EPW_TOP_EDGE} ticks, and its SHARE is stored beside EVERY `
        + 'bin-derived median.',
    },
    honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
      + 'the artifact stores that list verbatim or stores none". THIS ARTIFACT STORES NONE. '
      + 'The ONE home is '
      + 'docs/world-model/IF-T1B-FLIGHT-RUN-EXAM-RERUN.md §HONEST LIMITS.',
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
    isControlOfRecord: a === CONTROL_OF_RECORD,
    obmRunMulKnownToBeExactlyOne: true,
  }])),
  contrasts: Object.fromEntries(CONTRASTS.map((c) => [c, {
    label: CID_LABEL[c], treatmentArm: TREAT_OF[c], controlArm: CTRL_OF[c],
    isComparisonOfRecord: c === CONTRAST_OF_RECORD,
    isTheBesideTable: c === CONTRAST_HATS_VS_CANDIDATE,
    isTheD13Counterfactual: c === CONTRAST_D13,
    selectsTheRead: c === CONTRAST_OF_RECORD,
  }])),
  seamFaces: SEAM_FACES,
  eighthClass: EIGHTH_CLASS,
  q4: Q4_FACES,
  approx: {
    what: '⭐⭐⭐ THE ≈ STAMP (#418 item 2(v), #420 item 2(ii)): every face of this exam is an '
      + 'x64 number; IF-C0\'s value for the same face is an arm64 number and is stored beside '
      + 'it under `approx.ifC0`. ⛔ PRINTED, NEVER SELECTING. The EXACT comparator is this '
      + 'exam\'s OWN control arm, walked here.',
    stamp: APPROX_STAMP, hostArchitecture: HOST_ARCH,
    architectureOfRecord: 'arm64', source: IFC0_ARTIFACT,
    ifC0StageId: IFC0 === null ? null : IFC0.stageId,
  },
  prior: {
    what: '⭐⭐⭐ ⭐ AMENDMENT (#423 item 3(iii)) — THE EXACT PRIOR TWIN. IF-T1 walked THE SAME '
      + 'FIVE ARMS and THE SAME FACES with the same instrument recipe ON THIS HOST AND THIS '
      + 'ARCHITECTURE, on the block BEFORE this one. Its value for each face is stored beside '
      + 'that face as `prior.ifT1`: an EXACT twin in kind (same host, same architecture, same '
      + 'construction), not an ≈ one. ⛔ NO PAIRED Δ ACROSS THE TWO BLOCKS IS CLAIMED — the '
      + 'seeds differ, so a face and its prior twin are two INDEPENDENT SAMPLES and never a '
      + 'difference; the EXACT comparator for every read remains this exam\'s OWN control arm, '
      + 'walked here on THIS block.',
    stamp: PRIOR_STAMP, hostArchitecture: HOST_ARCH,
    priorBlock: [12_559_000, 12_559_999], thisBlock: [BLOCK_BASE, BLOCK_TOP],
    source: IFT1_ARTIFACT,
    ifT1StageId: IFT1 === null ? null : IFT1.stageId,
    ifT1HostArchitecture: IFT1 === null ? null : IFT1.hostArchitecture,
    sameArchitecture: IFT1 !== null && IFT1.hostArchitecture === HOST_ARCH,
    ifT1ReadOfRecord: IFT1_QUOTED === null ? null : IFT1_QUOTED.readOfRecord,
  },
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
    theDosePlacement: '⛔ canon (dose placement): the arm\'s OWN matrix (RUN-CAUTION or '
      + 'KITCHEN-SINK) rides on the '
      + 'MATCH-LOCAL `baseGenome` and `effGenome` ONLY, both DE-ALIASED first with the '
      + 'engine\'s own idiom (`{ ...team.baseGenome, … }`, `setCbProneness`\'s shape) because '
      + 'the three views are the SAME OBJECT until something replaces them. `info.genome` is '
      + 'asserted CLEAN on every walked match by `gWorld`. The D13 arms take the L3 / PC doses '
      + 'through the SHIPPED LOADERS exactly as DS-C0\'s D13 arm did.',
    theRestraintBackOut: '⭐⭐⭐ DS-T0c\'s arithmetic is `s = ((W.runScore · prior) · restraint) · '
      + '(tired ? OFFBALL_TIRED_MUL : 1) · obmRunMul` (§LAW-C, anchored), with `obmRunMul` '
      + 'LAST, so the STORED SCORE over `W.runScore · prior · tiredMul` is EXACTLY `restraint · '
      + 'obmRunMul`. On a seat-ABSENT arm that product IS the restraint (the seat is absent ⇒ '
      + '`obmRunMul` is EXACTLY 1), and under the RANK LAW the restraint is `clamp01(count − '
      + 'rankAbove)` ∈ {0, 1} — a STEP, so the back-out is EXACTLY 0 or EXACTLY 1 and the '
      + 'third cell (`restraint.neitherZeroNorOneShare`) is a stored float receipt. ⚠ A ZERO '
      + 'SCORE HAS TWO CAUSES: restraint 0 and a ZERO PRIOR (the DF clamp — a defender deep in '
      + 'his own half prices his own run at exactly 0). At a zero prior the back-out\'s '
      + 'DENOMINATOR is zero, so the restraint is NOT RECOVERABLE; the prior is RECOMPUTED from '
      + 'the body\'s OWN pos and role (reading NO snapshot) and the two populations are '
      + 'SEPARATED: `restraint.exactlyZeroShare` over the recoverable population, '
      + '`seam.priorZeroShare` for the AMBIGUOUS overlap. ⛔ `rankAbove`\'s exact value is NOT '
      + 'recoverable from a score; the OBSERVABLE is `rankAbove < count`, published as '
      + '`rankBelowCount` with its equivalence stored. ⚠ Only a candidate that reached the '
      + 'record\'s TOP FOUR is readable, so every share over this population is a FLOOR on the '
      + 'pushed population.',
    theGuardPopulation: '⭐⭐ THE BLOCK\'S OWN NOT-HATTED GUARD, RECONSTRUCTED IN TWO FORMS (the '
      + 'hat board and the wall licence\'s clock read PRE-STEP and read AFTER the step). The '
      + 'coach tick that writes the board runs at the HEAD of the step, BEFORE the decide loop, '
      + 'so the POST-STEP form is the denominator OF RECORD; the PRE-STEP form is published '
      + 'beside it, and the number of visible own candidates whose tick FAILS the post-step '
      + 'reconstruction is stored as its own field (the engine pushed them, so its own guard '
      + 'passed — anything there is reconstruction slack).',
    theTwoDoses: '⛔ THERE ARE NO OBM DOSES IN THIS EXAM — RE-READ AND RE-WRITTEN AT THIS '
      + 'FREEZE. DS-T1c\'s two hand-set matrices (its RUN-CAUTION probe corner and OBM-T1\'s '
      + 'ceiling probe) belonged to an exam with a DOSED OBM SEAT; here the seat is ABSENT on '
      + 'all five arms, the dose machinery is REMOVED (rule (h)), no matrix is written to any '
      + 'genome view, and `gWorld` asserts that on every walked match. The only doses anywhere '
      + 'are the SHIPPED L3 / PC loaders on the two D13 arms, taken through the shipped path '
      + 'and hashed by `gDoseSource`.',
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
    assignRunnersStatedAtThisHead: {
      what: '⭐⭐⭐ RULE (m) (#413 §CORR-D 5): the WHOLE-TEXT hash of `assignRunners` AT THIS '
        + 'HEAD, STATED and COMPARED TO NOTHING BANKED. GATE 1 sits inside this function, so '
        + 'DS-C0\'s and DS-T1c\'s banked literals for it read RED BY DECLARATION — that is a '
        + 'fact about those frozen instruments, not a defect here.',
      span: SPAN_ASSIGN_RUNNERS === null ? null : spanKey(SPAN_ASSIGN_RUNNERS),
      sha: SPAN_ASSIGN_RUNNERS === null ? null : SPAN_ASSIGN_RUNNERS.sha,
      comparedToAnyBankedLiteral: false,
      calleesExtractedFromTheHashedText: SPAN_ASSIGN_RUNNERS === null ? null
        : calleesOf(SPAN_ASSIGN_RUNNERS).resolved.map((x) => spanKey(x)),
      externalsInTheHashedText: SPAN_ASSIGN_RUNNERS === null ? null
        : calleesOf(SPAN_ASSIGN_RUNNERS).external,
    },
    performPass: {
      what: '⭐⭐⭐ GATE 2\'s OWN ENCLOSING FUNCTION, hashed WHOLE with its EXTRACTED callees '
        + '(the 2过1 trigger lives in it). Like `assignRunners` it now carries a `dsCoopHatsOff` '
        + 'gate, so its hash is STATED at this head.',
      span: SPAN_PERFORM_PASS === null ? null : spanKey(SPAN_PERFORM_PASS),
      sha: SPAN_PERFORM_PASS === null ? null : SPAN_PERFORM_PASS.sha,
      calleesExtractedFromTheHashedText: SPAN_PERFORM_PASS === null ? null
        : calleesOf(SPAN_PERFORM_PASS).resolved.map((x) => spanKey(x)),
      externalsInTheHashedText: SPAN_PERFORM_PASS === null ? null
        : calleesOf(SPAN_PERFORM_PASS).external,
    },
    theTwoGateLines: {
      what: '⭐⭐⭐ THE SWITCH\'S TWO GATE LINES as ANCHORED LITERALS (§SWITCH-D, VERBATIM) — the '
        + 'SAME source line in two files.',
      literal: COOP_GATE_LINE,
      sites: READ_FORKS.filter((r) => r.flag === 'dsCoopHatsOff')
        .map((r) => ({ file: r.file, line: r.line, text: r.text })),
    },
    passerReadSites: PASSER_READ_SITES,
    passerReadSitesResolved: PASSER_READS_RESOLVED,
    readForks: READ_FORKS,
    flagOccurrenceCountsPerFile: FLAG_COUNTS,
    seamDocReadForkInventory: DOC_READ_FORKS,
    forkInventoryAgrees: FORK_INVENTORY_AGREES,
    flagCountsAgree: FLAG_COUNTS_AGREE,
    a4WorldCountsAtThisHead: A4_COUNTS_AT_THIS_HEAD,
    a4WorldCleanOfTheSwitch: A4_CLEAN_OF_THE_FLIGHT_DOOR,
    a4WorldErrata: '⭐⭐⭐ ERRATA 6 of DS-T1c (#412 item 3, FAMILY NOTE): the ENTRY LAYER now '
      + 'NAMES `dsOwnRun` and `dsHatsOff` (world 16 = 15 + the two doors), so DS-T1c\'s two '
      + 'ZERO-COUNT anchors read RED from 32723c5. THIS exam STATES THE COUNTS AT ITS OWN HEAD '
      + 'and keeps only the one zero that is still a claim: the SWITCH reaches NO world.',
    seamDocSwitchDInventory: DOC_SWITCH_D_SITES,
    seamDocThreeFlagCounts: DOC_THREE_FLAG_COUNTS,
    runnerCount: {
      what: '⭐⭐⭐ THE CODE-MOVED COUNT (DS-T0b M-DS.6(a), UNCHANGED at T0c): the function '
        + 'hashed WHOLE, BOTH call '
        + 'sites hashed (their own line text and the span each sits in), and the per-file call '
        + 'census proving the expression exists in EXACTLY TWO files of `src/**`.',
      span: SPAN_RUNNER_COUNT === null ? null : spanKey(SPAN_RUNNER_COUNT),
      sha: SPAN_RUNNER_COUNT === null ? null : SPAN_RUNNER_COUNT.sha,
      callSites: RUNNER_COUNT_CALL_SITES,
      occurrencesPerFile: RUNNER_COUNT_OCCURRENCES,
      factsOk: RUNNER_COUNT_FACTS_OK,
    },
    runRank: {
      what: '⭐⭐⭐ THE CODE-MOVED RANKING (DS-T0c M-DS.6″(a)): the function hashed WHOLE, ALL '
        + 'THREE call sites hashed (the shipped `.map` and the player\'s `mine` and `theirs`), '
        + 'the per-file call census, and the EXECUTABLE census of the summand pattern '
        + '`RUN_ROLE_W[` — ONE site, which is #410 §CORR-C 2\'s narrowed claim.',
      span: SPAN_RUN_RANK === null ? null : spanKey(SPAN_RUN_RANK),
      sha: SPAN_RUN_RANK === null ? null : SPAN_RUN_RANK.sha,
      callSites: RUN_RANK_CALL_SITES,
      occurrencesPerFile: RUN_RANK_OCCURRENCES,
      summandPatternExecutableSites: ROLE_W_SUMMAND_SITES,
      theDocMakesTheNarrowedClaim: DOC_SUMMAND_CLAIM,
      factsOk: RUN_RANK_FACTS_OK,
    },
    ownRunBlock: {
      what: '⭐⭐⭐ THE OWN-RUN BLOCK\'S FOUR SETS, extracted from the block\'s WHOLE TEXT and '
        + 'compared to the seam doc\'s own §LAW-C 4 READ-SET sentence PARSED out of the '
        + 'markdown: the `match` members, the `.pos` reads, the `mate.` set and the `body.` '
        + 'set. EQUAL or RED.',
      startLine: OWN_BLOCK === null ? -1 : OWN_BLOCK.startLine,
      endLine: OWN_BLOCK === null ? -1 : OWN_BLOCK.endLine,
      sha: OWN_BLOCK === null ? null : OWN_BLOCK.sha,
      matchMembers: OWN_BLOCK === null ? [] : OWN_BLOCK.members,
      seamDocReadSet: DOC_READ_SET,
      measuredSets: BLOCK_SETS, seamDocSets: DOC_BLOCK_SETS, setsAgree: BLOCK_SETS_AGREE,
      /** ⭐⭐⭐ #410 item 3's STORED BOOLEAN — the velocity mass is GONE from the block */
      blockReadsNoVelocityNoTopSpeed,
      blockReadsNoVelocityNoTopSpeedNote: 'DERIVED from the block\'s WHOLE TEXT: the `.vel` '
        + 'read set is EMPTY, `topSpeed` occurs ZERO times and `runningMates` occurs ZERO '
        + 'times. The call graph it was checked over is `codeFacts.roots` + '
        + '`codeFacts.runRank` + `codeFacts.runnerCount` (canon: code facts over the call '
        + 'graph — a hash pins a body, it cannot see through a call).',
      agree: BLOCK_MEMBERS_AGREE,
    },
    seamDocSeamCInventory: DOC_SEAM_C_SITES,
    seamCSiteRowsMeasuredVsDoc: C_SITE_ROWS,
    seamCSitesAgree: C_SITES_AGREE,
    seamCLineShift: {
      what: '⭐⭐⭐ THE DECLARED LINE SHIFT (canon: a stage\'s source-text anchor is a statement '
        + 'dated to ITS head). §SEAM-C records the lines DS-T0c MEASURED; IF-T0 then inserted '
        + 'its seam INSIDE `if (match.dsOwnRun) {`, ABOVE four of those rows, so they sit LOWER '
        + 'here. The gate compares TEXT + FILE + CLASS exactly, asserts that NO row moved UP, '
        + 'that every non-`PlayerBrain.ts` row is UNMOVED, and that THE FORK LINE ITSELF IS '
        + 'UNMOVED — which is what makes every shift below it an insertion INSIDE the fork. '
        + 'The shifts are STORED. ⚠ DECLARED at §DEVIATIONS.',
      shifts: C_SITE_SHIFTS, distinctShifts: C_SITE_SHIFTS_DISTINCT,
      maxShift: C_SITE_SHIFT, forkLineUnmoved: FORK_LINE_UNMOVED,
      forkLineInTheDoc: docForkSite('1')?.line ?? -1, forkLineMeasured: IF_ALIAS_LINES.fork,
      aliasLines: IF_ALIAS_LINES,
    },
    seamDocDefinitionLines: DOC_DEFINITION_LINES,
    measuredDefinitionLines: MEASURED_DEFINITION_LINES,
    definitionLinesAgree: DEFINITION_LINES_AGREE,
    seamDocPullOccurrenceClaim: DOC_PULL_COUNT,
    pullOccurrencesMeasuredInPlayerBrain: PULL_SITES_IN_BRAIN,
    forkLinesMeasured: FORK_LINES_MEASURED,
    forkLinesInTheSeamDocsSEAMCTable: FORK_LINES_IN_DOC,
    forkLineNumbersAgree: FORK_LINE_NUMBERS_AGREE,
    forkLineNumbersNote: '⭐⭐ GATED FROM HERE, NOT DECLARED: §SEAM-C\'s inventory was REFRESHED '
      + 'WITH MEASURED LINE NUMBERS at #410, so this gate compares SITE TEXT + FILE + **LINE** '
      + 'on every row and a difference is RED — DS-T1b\'s declared line disagreement '
      + '(§DEVIATIONS 1 there) is retired POSITIVELY.',
    obmSeat: {
      file: EYES_PATH, roots: OBM_ROOTS.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureNodes: OBM_CLOSURE.nodes.map((s) => ({ span: spanKey(s), sha: s.sha })),
      closureDepth: OBM_CLOSURE.depth, closureCapped: OBM_CLOSURE.capped,
      designationHitsInClosure: OBM_HITS, obmSeatReadsNoDesignation,
      featureKeys: [...OBM_FEATURE_KEYS], outputKeys: [...OBM_OUTPUT_KEYS],
    },
  },
  noDose: {
    what: '⭐⭐⭐ RULE (h) OF THE DISPATCH: THE OBM SEAT IS ABSENT ON EVERY ARM. DS-T1c\'s dose '
      + 'machinery (RUN-CAUTION, KITCHEN-SINK, `armMatrixLocal`, `doseFromExports`, '
      + 'G-DOSE-COPY and their anchors) is REMOVED FROM THIS INSTRUMENT — not left dormant — '
      + 'and this block DECLARES it. `info.genome` is untouched.',
    obmSeatAbsentOnEveryArm: OBM_SEAT_ABSENT_ON_EVERY_ARM,
    armsDosed: ARMS.filter((a) => ARM_DOSED[a]),
    obmMovementSetOnAnyArm: false,
    assertedOnEveryWalkedMatch: '`gWorld`: `obmFlag === false` AND `matrixOnBaseEff === false` '
      + 'AND `infoGenomeCleanOfMatrix` on every walked match and on the construction receipt; '
      + '`worldPin` repeats it on a constructed match of each arm.',
    theD13BookIsNotAnObmDose: 'the D13 arms take the L3 / PC doses through the SHIPPED LOADERS '
      + 'into `armA4World`, exactly as DS-C0\'s D13 arm did — that is the PLAYED BOOK, not an '
      + 'OBM seat dose, and `gDoseSource` hashes the bytes it reads.',
  },
  armIf: {
    what: '\u2b50\u2b50\u2b50 gArmIF (#420 item 2(iv)) \u2014 the EIGHTH `why` count EXACTLY 0 and the belief '
      + 'map EMPTY on every arm NOT carrying `ifFlightRun`. \u26d4 A STORED BOOLEAN OF THE ARM\'S '
      + 'CONSTRUCTION, NEVER NARRATED AS A FINDING.',
    ok: ARM_IF_OK, rows: armIfRows,
    constructionWalks: { seeds: IF_SCRATCH_SEEDS, ok: ARM_IF_SCRATCH_OK,
      rows: armIfScratchRows },
  },
  armCoop: {
    what: '\u2b50\u2b50 THE COOPERATION COUNTERS BESIDE \u2014 world 17\'s own construction: `overlapSets` '
      + 'and `wallFires` are ZERO on every arm carrying `dsCoopHatsOff` and NON-ZERO on '
      + '`HATS-E13`. \u26d4 A STORED CHECK, never a finding.',
    ok: ARM_COOP_OK, rows: armCoopRows,
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
  bite: {
    what: '\u2b50\u2b50\u2b50 gBiteIF in the #414 ROW FORM \u2014 the per-seed ROW, not the full-time signature. '
      + 'The signature comparison is stored beside as a PRINTED FACE and gates nothing.',
    rows: biteRows, ok: BITE_IF_OK,
    eighthWhyTotalOnTheCandidateArm: EIGHTH_WHY_TOTAL_CANDIDATE,
    eighthWhyPerMatchOnTheCandidateArm: EIGHTH_WHY_PER_MATCH_CANDIDATE,
    livenessIsAPreconditionOfEveryRead: true,
  },
  repro: {
    ...reproDetail,
    /** ⭐ CORRECTION (#421 item 4(iv)): the cross-architecture rows are NAMED `repro.rows` —
     *  in this code, in the stage doc and in the ruling. The name used at #420 item 2(iv) and
     *  carried into IF-T1's doc was never a path in any artifact. */
    rowsAreNamedRows: '⭐ #421 item 4(iv), applied at THIS freeze: the cross-architecture rows '
      + 'live at `repro.rows[]` (each with `mismatches[]` and `delta{}`), and THIS STAGE names '
      + 'them `repro.rows` in the instrument, in the stage doc and in the ruling. The name '
      + '#420 item 2(iv) used was never a path in any artifact and is used nowhere here.',
    /** ⭐ AMENDMENT (#423 item 3(iv)): the SAME-ARCHITECTURE re-walk against IF-T1. */
    ifT1SameArchitecture: reproIfT1Detail,
  },
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-cluster SCRATCH SMOKE (seeds 900,008,800–811, FIVE '
      + 'walks per seed), DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a '
      + 'NOISY variance estimate. N takes the BLOCK\'S AFFORDANCE after the construction '
      + 'receipt at 12,560,999.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
    whichNWasTaken: '⭐⭐⭐ SAID PLAINLY (#420 item 2(v): "N = min(required, the block\'s '
      + 'affordance) TAKEN AS THE AFFORDANCE — say which"): BOTH sizing rows are '
      + 'RESOLVABLE far below the affordance, so the literal min() is the REQUIRED n '
      + `(${sizingRows.map((r) => `${r.face.split('@')[0]} ${r.nRequired}`).join(' · ')}). `
      + 'THIS STAGE WALKS THE AFFORDANCE (N_FROZEN = 999) ANYWAY, which is the inherited '
      + 'house practice of DS-T1 / DS-T1b / DS-T1c / DS-T1d / IF-T1 and is ≥ required on every '
      + 'row: a 12-cluster variance estimate is NOISY, and the faces this exam carries — the '
      + 'eighth class\'s FOUR partitions, the receiver class, the intended-receiver share — are '
      + 'RARE EVENTS whose per-seed counts are small. THE DEVIATION IS DECLARED at the doc\'s '
      + '§DEVIATIONS; it can only NARROW an interval, never widen one.',
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
    scratchBandDeclared: SCRATCH_BAND,
    scratchSeedsWalked: SCRATCH_SEEDS_WALKED,
    scratchSeedsWalkedFlat: SCRATCH_SEEDS_FLAT,
    scratchSeedsOutOfBand: SCRATCH_OUT_OF_BAND,
    scratchBandOk: SCRATCH_BAND_OK,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    armIfScratchSeedsWalked: IF_SCRATCH_SEEDS,
    smokeReceiptSeed: SCRATCH_BASE + 20,
    fixtureScratchSeed: FIXTURE_SEED,
    reWalkSeedsNotAConsumption: REPRO_SEEDS,
    reWalkSeedsIfT1NotAConsumption: REPRO_T1_SEEDS,
    consumedBlocksOfRecord: CONSUMED_BLOCKS,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 88 },
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
    what: '⭐⭐⭐ R1 — THE FLOOD FACE, per arm (LEVELS) and per CONTRAST (the paired Δ), with '
      + 'BOTH FRACTIONS. ⭐ CORRECTION (#421 item 4(v), applied at THIS freeze): THE COMPARISON '
      + 'OF RECORD IS `OWNCOOP+IF-E13|OWNCOOP-E13` — THE CONTROL IS `OWNCOOP-E13`, world 17\'s '
      + 'own door set, and every tolerance on every row is a fraction of ITS OWN control\'s '
      + 'level (each row names its `controlArm`).',
    key: R1_KEY, rows: FLOOD_ROWS, comparisonOfRecord: CONTRAST_OF_RECORD,
    ratioOfRecord: pairedRatio(R1_KEY, CONTRAST_OF_RECORD),
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
    what: '⭐⭐⭐ THE BAND (F-DS-b), PER CONTRASTED PAIR, with EVERY BREACH\'S DIRECTION. '
      + 'tolerance = ' + TOLERANCE_FORM
      + ' BREACH = RESOLVED AND beyond tolerance IN THE HARMFUL DIRECTION.',
    limbs: GUARD_LIMBS, table: GUARD_TABLE,
    holdsBand: Object.fromEntries(CONTRASTS.map((c) => [c, holdsBand(c)])),
    breachingGuards: Object.fromEntries(CONTRASTS.map((c) => [c, breachingGuards(c)])),
    breachSets: Object.fromEntries(CONTRASTS.map((c) => [c, breachSetWithDirections(c)])),
  },
  offsides: {
    what: '⭐ G10 in the #157 FLAG form — a RESOLVED INCREASE raises a flag and flips NO gate.',
    rows: OFFSIDE_ROWS,
  },
  faceBlocks: {
    openPlayBoard: OPEN_PLAY_BOARD,
    yieldPairs: YIELD_PAIRS,
    coupling: COUPLING,
    couplingLevels: COUPLING_LEVELS,
    couplingFieldNamesCopiedFromDsC0: DSC0_COUPLING_FIELDS,
    disappearingPair: DISAPPEARING_PAIR,
    passerReadTable: PASSER_READ_TABLE,
    perState: PER_STATE,
    eighthClass: EIGHTH_CLASS,
    q4: Q4_FACES,
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
      note: 'the seat is ABSENT on every arm, so this whole distribution is the BACK-OUT\'S '
        + 'OWN NOISE FLOOR — published, never assumed away.',
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
    note: '⭐⭐⭐ ⭐ CORRECTION (#421 item 4(i), applied at THIS freeze — the stale two-read text '
      + 'is GONE). THE THREE READS + THE FALLBACK are FROZEN LITERALS of ruling #420 item '
      + '2(iii), copied CHARACTER FOR CHARACTER and cross-checked at run time against BOTH '
      + 'written homes — this ruling\'s text and `IF-FLIGHT-RUN-CONTRACT.md` §3 — on '
      + 'normalised prose (`gReadLiterals`), with THIS INSTRUMENT the third home. The '
      + 'SELECTORS are STORED BOOLEANS — `floods(contrast)` and `holdsBand(contrast)` — '
      + 'evaluated on THE COMPARISON OF RECORD (`OWNCOOP+IF-E13` vs `OWNCOOP-E13` on E13, the '
      + 'OBM seat absent) by THE THREE-READ RULE: (1) a BREACH (`holdsBand` FALSE) ⇒ read 2; '
      + '(2) else `floods` ⇒ read 3; (3) else ⇒ read 1; the FALLBACK fires ONLY if a stored '
      + 'boolean is ABSENT — a defect, not a shape. ⭐ LIVENESS (`gBiteIF`) IS A PRECONDITION '
      + 'OF EVERY READ: RED ⇒ no read is selected and the frozen no-read string is stored. '
      + 'D13\'s word and the HATS-vs-candidate table\'s word are computed by the SAME rule and '
      + 'STORED as counterfactuals — NEITHER SELECTS. ⛔ The breached guards are printed on '
      + 'their OWN annotation line, never spliced into a frozen literal, and NO VERDICT WORD '
      + 'appears on any yield, coupling, seam or passer face.',
    sentences: READ_LITERALS,
    literalHomes: READ_LITERAL_HOMES,
    precedence: '⭐ CORRECTION (#421 item 4(i)) — THE THREE-READ RULE OF #420 item 2(iii), '
      + 'which is the rule this instrument\'s `selectRead` executes: (1) a breach '
      + '(`holdsBand` FALSE) ⇒ read 2 · (2) else `floods` (R1 UP beyond tolerance, RESOLVED) ⇒ '
      + 'read 3 · (3) else ⇒ read 1 · (F) the FALLBACK fires ONLY if a stored boolean is '
      + 'ABSENT. Liveness is a precondition of every one of them.',
    honestyLine: HONESTY_LINE,
    armOfRecord: ARM_OF_RECORD, controlOfRecord: CONTROL_OF_RECORD,
    contrastOfRecord: CONTRAST_OF_RECORD,
    selected: READ_WORD, sentence: READ_SENTENCE,
    selectedByTheRuleIgnoringLiveness: READ_WORD_BY_RULE,
    livenessIsAPrecondition: true, livenessOk: LIVENESS_OK,
    noReadSentence: NO_READ_SENTENCE,
    selectors: SELECTORS,
    precedenceStepThatSelected: PRECEDENCE_STEP,
    annotations: [
      HONESTY_LINE,
      `gBiteIF (LIVENESS, a PRECONDITION of every read) = ${LIVENESS_OK} \u00b7 the eighth-\`why\` `
      + `count on the candidate arm = ${EIGHTH_WHY_PER_MATCH_CANDIDATE} per match `
      + `(${EIGHTH_WHY_TOTAL_CANDIDATE} over the battery)`,
      `floods(the candidate vs world 17, E13) = ${floods(CONTRAST_OF_RECORD)} \u00b7 holdsBand = `
      + `${holdsBand(CONTRAST_OF_RECORD)} \u00b7 R1 `
      + `${FLOOD_ROWS[CONTRAST_OF_RECORD].controlLevel} `
      + `\u2192 ${FLOOD_ROWS[CONTRAST_OF_RECORD].armLevel} (\u0394 `
      + `${FLOOD_ROWS[CONTRAST_OF_RECORD].delta} [${FLOOD_ROWS[CONTRAST_OF_RECORD].ci[0]}, `
      + `${FLOOD_ROWS[CONTRAST_OF_RECORD].ci[1]}], tolerance `
      + `${FLOOD_ROWS[CONTRAST_OF_RECORD].toleranceAbs}, beyondToleranceUp `
      + `${FLOOD_ROWS[CONTRAST_OF_RECORD].beyondToleranceUp})`,
      `the breached guard(s): ${BREACH_NAMED === '' ? 'none' : BREACH_NAMED}`,
      `the R1 ratio (the candidate \u00f7 world 17): `
      + `${H_NUMBERS.theComparisonOfRecord.r1Ratio.ratio} `
      + `[${H_NUMBERS.theComparisonOfRecord.r1Ratio.ci[0]}, `
      + `${H_NUMBERS.theComparisonOfRecord.r1Ratio.ci[1]}]`,
      `THE EIGHTH CLASS'S THREE PARTITIONS on the arm of record \u2014 START STATE: `
      + `${BALL_MOTION.map((c) => `${c} `
        + `${EIGHTH_CLASS[ARM_OF_RECORD].startStatePartition.ballMotion[c]}`).join(' \u00b7 ')}`
      + `; MEMORY: ${MEMORY_CELLS.map((c) => `${c} `
        + `${EIGHTH_CLASS[ARM_OF_RECORD].startStatePartition.memory[c]}`).join(' \u00b7 ')}`
      + `; RESTRAINT: =0 ${EIGHTH_CLASS[ARM_OF_RECORD].restraintPartition.exactlyZeroShare} `
      + `\u00b7 =1 ${EIGHTH_CLASS[ARM_OF_RECORD].restraintPartition.exactlyOneShare} `
      + `\u00b7 between ${EIGHTH_CLASS[ARM_OF_RECORD].restraintPartition.betweenShare}`,
      `the yield pair (seventh \u00b7 eighth) on the arm of record: `
      + `${YIELD_PAIRS[ARM_OF_RECORD].ownShotsPerEpisode} shots per own-run episode \u00b7 `
      + `${EIGHTH_CLASS[ARM_OF_RECORD].yieldPartition.shotsPerEpisode} per eighth-class episode`,
      `THE Q4 FACES with their \u2248 TWINS (arm of record): negative-\u0394t half `
      + `${Q4_FACES[ARM_OF_RECORD].negativeDeltaTHalf.value} \u00b7 receiver started-during-flight `
      + `${Q4_FACES[ARM_OF_RECORD].receiverStartedDuringTheFlight.value} \u00b7 intended-receiver `
      + `share ${Q4_FACES[ARM_OF_RECORD].intendedReceiverShare.value} \u00b7 bodies already running `
      + `at the release ${Q4_FACES[ARM_OF_RECORD].bodiesAlreadyRunningAtTheRelease.mean} \u00b7 `
      + `in-flight share of run starts ${Q4_FACES[ARM_OF_RECORD].runInFlightShare.value} \u00b7 `
      + `the leak's stalePasserStillCredited `
      + `${Q4_FACES[ARM_OF_RECORD].leakPartition.cells.stalePasserStillCredited.share} `
      + `(\u2248 twins under faceBlocks.q4[...].approx.ifC0)`,
      `per state (eighth-class runs per match, arm of record): ${STATES.map((st) =>
        `${st} ${(PER_STATE[ARM_OF_RECORD] as Record<string, Record<string, number>>)[st]
          .ifRunsPerMatch ?? 0}`).join(' \u00b7 ')}`,
      `D13's word (stored, never selecting): ${READ_WORD_D13}`,
      `the HATS-vs-candidate guard table's own holdsBand word (stored, never selecting): `
      + `${holdsBand(CONTRAST_HATS_VS_CANDIDATE)} \u00b7 floods `
      + `${floods(CONTRAST_HATS_VS_CANDIDATE)} \u00b7 word ${READ_WORD_HATS_VS_CANDIDATE}`,
    ],
    breachNamed: BREACH_NAMED,
    breachSetOfRecord: breachSetWithDirections(CONTRAST_OF_RECORD),
    counterfactuals: {
      note: '⭐⭐ canon, VERBATIM: "a counterfactual verdict sentence (\'had X been scored, the '
        + 'rule would read W\') quotes a word the instrument STORED by applying the frozen rule '
        + 'to X\'s stored interval". ⛔ NEITHER OF THESE SELECTS.',
      d13AsIfOfRecord: {
        contrast: CONTRAST_D13,
        word: READ_WORD_D13, sentence: READ_LITERALS[READ_WORD_D13],
        floods: floods(CONTRAST_D13), holdsBand: holdsBand(CONTRAST_D13),
        breachSet: breachSetWithDirections(CONTRAST_D13),
      },
      hatsVsCandidateAsIfOfRecord: {
        contrast: CONTRAST_HATS_VS_CANDIDATE,
        word: READ_WORD_HATS_VS_CANDIDATE,
        sentence: READ_LITERALS[READ_WORD_HATS_VS_CANDIDATE],
        floods: floods(CONTRAST_HATS_VS_CANDIDATE),
        holdsBand: holdsBand(CONTRAST_HATS_VS_CANDIDATE),
        breachSet: breachSetWithDirections(CONTRAST_HATS_VS_CANDIDATE),
        guardTable: GUARD_TABLE[CONTRAST_HATS_VS_CANDIDATE],
      },
      everyContrastsWord: CONTRAST_WORDS,
    },
    d13Agrees: D13_AGREES,
    d13AgreementWordPrinted: D13_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees,
    agreementSentences: AGREE_SENTENCE,
    besideTheRead: {
      honestyLine: HONESTY_LINE,
      disappearingPairOnTheOwnArm: DISAPPEARING_PAIR[CONTROL_OF_RECORD],
      disappearingPairOnHats: DISAPPEARING_PAIR['HATS-E13'],
      disappearingPairOnTheArmOfRecord: DISAPPEARING_PAIR[ARM_OF_RECORD],
      r1Ratio: H_NUMBERS.theComparisonOfRecord.r1Ratio,
      yieldPair: YIELD_PAIRS[ARM_OF_RECORD],
      yieldPairOnTheControl: YIELD_PAIRS[CONTROL_OF_RECORD],
      coupling: COUPLING[CONTRAST_OF_RECORD],
      couplingLevels: COUPLING_LEVELS[ARM_OF_RECORD],
      passerReadTable: PASSER_READ_TABLE[ARM_OF_RECORD],
      perState: PER_STATE[ARM_OF_RECORD],
      seamFacesPointer: `seamFaces['${ARM_OF_RECORD}']`,
      arcNumbersPointer: 'hNumbers.theArcQuotedByField (printed, never judged)',
    },
    emptyRunClasses: EMPTY_RUN_CLASSES,
    emptyEpisodeClasses: EMPTY_EP_CLASSES,
    emptyStateClasses: EMPTY_STATE_CLASSES,
    emptyCouplingCounters: EMPTY_COUPLING_COUNTERS,
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
  r1: { rows: Record<Cid, { delta: number; toleranceAbs: number; floods: boolean;
    resolved: boolean; up: boolean; beyondToleranceUp: boolean;
    absDeltaBeyondToleranceEitherWay: boolean }> };
  guards: { table: Record<Cid, { id: string; key: string; direction: GuardDir;
    controlLevel: number; toleranceAbs: number; delta: number; resolved: boolean;
    beyondTolerance: boolean; breach: boolean; breachDirection: string }[]>;
    holdsBand: Record<Cid, boolean> };
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
  /* ⭐ AMENDMENT — THE EIGHTH CLASS'S **FOUR** START-STATE PARTITIONS share ONE denominator:
   * the stamped starts. Ball motion · memory · truth state · ⭐ PHASE · ⭐ LOOK DISTANCE. */
  binChecks.push({ bin: `${armK}.partition.theEighthStartPartitionsShareOneDenominator`,
    ok: (() => {
      const d = sum(rows.map((r) => sum(r.ifStartBallMotion)));
      return sum(rows.map((r) => sum(r.ifStartMemoryCells))) === d
        && sum(rows.map((r) => sum(r.ifStartStateBins))) === d
        && sum(rows.map((r) => sum(r.ifStartPhaseCells))) === d
        && sum(rows.map((r) => sum(r.ifStartLookDistanceCells))) === d;
    })() });
  /* ⭐⭐⭐ DS-T1c's OWN PARTITIONS, re-derived off the SERIALIZED rows */
  binChecks.push({ bin: `${armK}.partition.restraintBinsSumToItsObservations`,
    ok: sum(got.restraintBins) === sum(rows.map((r) => r.restraintN)) });
  binChecks.push({ bin: `${armK}.partition.theRestraintsTHREECELLSPartitionItsObservations`,
    ok: sum(rows.map((r) => r.restraintExactZero + r.restraintExactOne
      + r.restraintNeitherZeroNorOne)) === sum(rows.map((r) => r.restraintN)) });
  binChecks.push({ bin: `${armK}.partition.thePriorsTWOCELLSPartitionTheVisibleCandidates`,
    ok: sum(rows.map((r) => r.ownCandidatePriorZero + r.ownCandidatePriorAbove))
      === sum(rows.map((r) => r.ownCandidateVisible)) });
  binChecks.push({ bin: `${armK}.partition.theRECOVERABLEPopulationIsThePriorABOVEZEROOne`,
    ok: ARM_DOSED[armK] ? sum(rows.map((r) => r.restraintN)) === 0
      : sum(rows.map((r) => r.restraintN)) === sum(rows.map((r) => r.ownCandidatePriorAbove)) });
  binChecks.push({ bin: `${armK}.partition.ownBackOutBinsSumToItsObservations`,
    ok: sum(got.ownBackOutBins) === sum(rows.map((r) => r.ownBackOutN)) });
  binChecks.push({ bin: `${armK}.partition.runMulLicBinsSumToItsObservations`,
    ok: sum(got.runMulLicBins) === sum(rows.map((r) => r.runMulLicN)) });
  binChecks.push({ bin: `${armK}.partition.countBinsSumToTheVisibleOwnCandidates`,
    ok: sum(got.countBins) === sum(rows.map((r) => r.ownCandidateVisible)) });
  binChecks.push({ bin: `${armK}.partition.theRestraintIsWrittenONLYOnASeatAbsentArm`,
    ok: ARM_DOSED[armK]
      ? sum(rows.map((r) => r.restraintN)) === 0
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
for (const cid of CONTRASTS) {
  const rr = disk.r1.rows[cid];
  binChecks.push({ bin: `r1.${cid}.floodsRederives`,
    ok: rr.floods === (rr.up && rr.delta > rr.toleranceAbs)
      && rr.beyondToleranceUp === (rr.delta > rr.toleranceAbs)
      && rr.absDeltaBeyondToleranceEitherWay
        === (Math.abs(rr.delta) > rr.toleranceAbs) });
  const table = disk.guards.table[cid];
  const rederived = table.map((g) => {
    const beyond = g.direction === 'ceiling' ? g.delta > g.toleranceAbs
      : g.direction === 'floor' ? g.delta < -g.toleranceAbs
        : Math.abs(g.delta) > g.toleranceAbs;
    const dir = g.resolved && beyond ? (g.delta > 0 ? 'UP' : 'DOWN') : 'none';
    return beyond === g.beyondTolerance && g.breach === (g.resolved && beyond)
      && g.breachDirection === dir
      && sameNum(NI_FRACTION * Math.abs(g.controlLevel), g.toleranceAbs);
  });
  binChecks.push({ bin: `guards.${cid}.everyRowRederives`, ok: rederived.every((x) => x) });
  binChecks.push({ bin: `guards.${cid}.holdsBandRederives`,
    ok: disk.guards.holdsBand[cid] === table.every((g) => !g.breach) });
}
{
  const rd = disk.reads as unknown as {
    selected: ReadWord; sentence: string; armOfRecord: Arm; contrastOfRecord: Cid;
    selectors: Record<Cid, { floods: boolean; holdsBand: boolean }>;
    precedenceStepThatSelected: string; livenessOk: boolean;
    selectedByTheRuleIgnoringLiveness: ReadWord; noReadSentence: string;
    counterfactuals: { d13AsIfOfRecord: { word: ReadWord; sentence: string };
      hatsVsCandidateAsIfOfRecord: { word: ReadWord; sentence: string } };
    d13Agrees: boolean; d13AgreementWordPrinted: string; breachNamed: string;
    honestyLine: string; literalHomes: { ok: boolean };
  };
  const fa = rd.selectors[CONTRAST_OF_RECORD];
  const f13 = rd.selectors[CONTRAST_D13];
  const fh = rd.selectors[CONTRAST_HATS_VS_CANDIDATE];
  const w = readWordFrom(fa.floods, fa.holdsBand);
  const w13 = readWordFrom(f13.floods, f13.holdsBand);
  const wh = readWordFrom(fh.floods, fh.holdsBand);
  binChecks.push({ bin: 'reads.selectorRederives',
    ok: w === rd.selectedByTheRuleIgnoringLiveness
      && rd.selected === (rd.livenessOk ? w : 'noRead')
      && rd.sentence === (rd.livenessOk ? READ_LITERALS[w] : rd.noReadSentence)
      && rd.noReadSentence === NO_READ_SENTENCE
      && (rd.livenessOk
        ? (Object.values(READ_LITERALS) as string[]).includes(rd.sentence)
        : rd.sentence === NO_READ_SENTENCE)
      && rd.armOfRecord === ARM_OF_RECORD && rd.contrastOfRecord === CONTRAST_OF_RECORD });
  binChecks.push({ bin: 'reads.livenessIsAPRECONDITION',
    ok: rd.livenessOk === BITE_IF_OK });
  binChecks.push({ bin: 'reads.thePRECEDENCEStepIsStored',
    ok: rd.precedenceStepThatSelected === (rd.livenessOk
      ? precedenceStepFrom(fa.floods, fa.holdsBand)
      : 'step (0) — LIVENESS: `gBiteIF` is RED, so NO READ IS SELECTED') });
  binChecks.push({ bin: 'reads.counterfactualWordsRederive',
    ok: w13 === rd.counterfactuals.d13AsIfOfRecord.word
      && READ_LITERALS[w13] === rd.counterfactuals.d13AsIfOfRecord.sentence
      && wh === rd.counterfactuals.hatsVsCandidateAsIfOfRecord.word
      && READ_LITERALS[wh] === rd.counterfactuals.hatsVsCandidateAsIfOfRecord.sentence });
  binChecks.push({ bin: 'reads.agreementBooleanIsStored',
    ok: rd.d13Agrees === (w13 === w)
      && rd.d13AgreementWordPrinted === (w13 === w ? AGREE_SENTENCE.agrees
        : AGREE_SENTENCE.disagrees) });
  binChecks.push({ bin: 'reads.theHONESTYLineIsStoredBesideTheRead',
    ok: rd.honestyLine === HONESTY_LINE && rd.literalHomes.ok });
  binChecks.push({ bin: 'reads.breachAnnotationIsAStoredField',
    ok: rd.breachNamed === disk.guards.table[CONTRAST_OF_RECORD]
      .filter((g) => g.breach).map((g) => `${g.id} ${g.key}`).join(' · ') });
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
    + '`beyondTolerance` and `breach`, R1\'s one-sided `beyondToleranceUp` AND its two-sided '
    + 'companion, `holdsBand`, the selected read, ALL THREE counterfactual '
    + 'words and the agreement word are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.') || b.bin.startsWith('guards.')
    || b.bin.startsWith('r1.')).every((b) => b.ok),
  note: '⭐⭐⭐ THE READ WORDS ARE STORED, NOT TYPED, and ⭐ THIS NOTE IS RE-READ FOR THIS EXAM: '
    + '`floods(contrast)`, every guard row\'s harmful-direction test AND its `breachDirection`, '
    + '`holdsBand(contrast)`, THE LIVENESS PRECONDITION, the precedence step that selected, '
    + 'the selected read and its printed sentence, and BOTH counterfactual words (the D13 pair '
    + 'and the HATS-vs-candidate table, each by the SAME frozen rule on ITS OWN stored '
    + 'interval) with the agreement word beside them, are ALL RE-DERIVED by applying the '
    + 'frozen rules to the SERIALIZED rows off disk; every printed sentence must be one of the '
    + 'FOUR frozen literals or the frozen no-read string. canon, VERBATIM: "a universal '
    + 'sentence about a table (\'every bin\', \'the one bin\') is a stored boolean or is not '
    + 'written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
/** ⭐ `allGreen` is a BODY key whose value depends on `gHashOrder` itself, so it is seeded here
 *  with a placeholder and OVERWRITTEN with the real verdict below — the schema check is then
 *  honest for EVERY key, and the written value is the real one. */
artifact.allGreen = false;
/** ⭐ THE SAME IDIOM for `inheritedProse`: gInheritedProse can only walk the body AFTER every
 *  other body key is assigned, so the key is SEEDED here and OVERWRITTEN with its real rows
 *  below — the schema check is then honest for EVERY key. */
artifact.inheritedProse = null;
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
    + 'NON-body `receipts.hashReproducesFromFile` records that it reproduces from the file. '
    + '⭐ CORRECTION (#421 item 4(viii), applied at THIS freeze — STATED, not left implicit): '
    + '`gFacesDetail` (the per-face and per-bin check rows) sits OUTSIDE the hashed body BY '
    + 'SCHEMA; what IS inside the body is `gates.gFaces.ok` and its note. A reader who wants '
    + 'the individual rows reads `gFacesDetail` off the file, which is not hashed',
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

/* ========================================================================== */
/* 18c gInheritedProse - THE NEW GATE OF #423 item 3(ii)                       */
/* ========================================================================== */
/** ⭐⭐⭐ WHAT THIS GATE IS. IF-T1's verifier found that FOUR of its eight findings were
 *  DS-T1d's sentences carried into IF-T1's hashed artifact untouched — stale text inside a
 *  frozen body. This gate makes that failure mode IMPOSSIBLE TO REPEAT SILENTLY: it WALKS the
 *  hashed body, ENUMERATES every prose field it finds (with the top-level key it lives under,
 *  which is its SOURCE), and tests each one against a FROZEN LIST OF STALE TOKENS — strings
 *  that could only survive from an inherited sentence that was never re-read for THIS exam.
 *  A single false `reRead` is RED. ⛔ The tokens are frozen here, before the battery; none of
 *  them can be relaxed by a measurement. */
const STALE_TOKENS: readonly { token: string; why: string }[] = [
  { token: 'OWN-E13',
    why: '#421 item 4(v) — an arm neither IF-T1 nor this exam has; the control of record is '
      + 'the OWNCOOP arm (the token cannot match that name, which has no hyphen after OWN)' },
  { token: 'NO THIRD READ IS INVENTED',
    why: '#421 item 4(i) — the DS-T1d two-read rule; this exam executes the THREE-read rule' },
  { token: 'the rows live at repro.cross' + 'Arch',
    why: '#421 item 4(iv) — that was never a path in any artifact; the rows live at repro.rows' },
  { token: 'accessor spy',
    why: '#421 item 4(iii) — no spy of any kind exists in this instrument' },
  { token: 'next sim ' + String.fromCharCode(8805) + ' 12,557,000',
    why: '#421 item 4(ii) — DS-T1d frontier quoted as this one; this frontier is 12,560,000' },
  { token: 'inside block 12,557,000',
    why: '#421 item 4(ii) — DS-T1d block quoted as this one; this block is 12,560,000-999' },
  { token: '12,556,000' + String.fromCharCode(8211) + '011',
    why: '#421 item 4(ii) — DS-T1c re-walk band; this stage re-walks 12,558 and 12,559' },
  { token: 'THE ONE NEW REGISTERED READ OF THIS STAGE',
    why: '#423 item 3(v) — this stage registers a SECOND read (the look counter); the registry '
      + 'of record is 88, and the belief was already registered at IF-T1' },
  { token: 'OWN + COOP-OFF vs OWN',
    why: '#421 item 4(i) — the DS-T1d comparison of record, not this exam' },
];
/** ⭐⭐ THE SOURCE OF A PROSE FIELD is the top-level body key it lives under; each key's own
 *  provenance is DECLARED here, so the enumeration says not just WHAT was re-read but FROM
 *  WHERE it came. A key absent from this map is reported as `undeclared` and is RED. */
const PROSE_SOURCE: Record<string, string> = Object.fromEntries((BODY_SCHEMA as readonly
string[]).map((k) => [k, 'IF-T1 (scripts/probes/if-t1-flight-run-exam.ts), itself copied BY '
  + 'RECIPE from DS-T1d and IF-C0 — RE-READ for IF-T1b at this freeze']));
PROSE_SOURCE.stage = 'IF-T1 stage block, RE-READ and RE-WRITTEN for IF-T1b (the id, the title, '
  + 'the doc, the authority, the question, the arc, xSrcZero and the seam under exam all name '
  + 'THIS stage and THIS seam)';
PROSE_SOURCE.reads = 'ruling #420 item 2(iii) literals (unchanged by #423 item 3) with the '
  + 'note and the precedence RE-WRITTEN to the THREE-read rule — #421 item 4(i)';
PROSE_SOURCE.repro = 'IF-T1 architecture-aware gRepro, RE-WRITTEN: the rows are named '
  + 'repro.rows (#421 item 4(iv)) and the SAME-ARCHITECTURE re-walk against IF-T1 is added '
  + '(#423 item 3(iv))';
PROSE_SOURCE.prior = 'NEW at IF-T1b (#423 item 3(iii)) — the EXACT prior twin block';
PROSE_SOURCE.eighthClass = 'IF-T1 eighth-class block, RE-READ, with the TWO NEW partitions of '
  + '#423 item 3(i) added';
PROSE_SOURCE.gates = 'IF-T1 gate notes, EACH RE-READ for this exam — the seed notes, the '
  + 'code-fact note and the ledger note re-written (#421 item 4(ii), #423 item 3(i) and (v))';
PROSE_SOURCE.seeds = 'IF-T1 seeds block, RE-WRITTEN for block 12,560,000-999 and the two '
  + 're-walk bands';
PROSE_SOURCE.sizing = 'IF-T1 sizing block, RE-WRITTEN for THIS stage own smoke band '
  + '900,008,800-811';
PROSE_SOURCE.inheritedProse = 'NEW at IF-T1b (#423 item 3(ii)) — this gate own enumeration';
const PROSE_MIN_LENGTH = 40;
const proseRows: { path: string; sourceKey: string; chars: number; reRead: boolean;
  staleTokens: string[] }[] = [];
(() => {
  const seen = new Set<string>();
  const walk = (node: unknown, path: string, top: string): void => {
    if (typeof node === 'string') {
      if (node.length < PROSE_MIN_LENGTH) return;
      const key = path + '||' + node;
      if (seen.has(key)) return;
      seen.add(key);
      const hits = STALE_TOKENS.filter((t) => node.includes(t.token)).map((t) => t.token);
      proseRows.push({
        path, sourceKey: top, chars: node.length,
        reRead: hits.length === 0 && PROSE_SOURCE[top] !== undefined, staleTokens: hits,
      });
      return;
    }
    if (Array.isArray(node)) { for (const v of node) walk(v, path + '[]', top); return; }
    if (node !== null && typeof node === 'object') {
      for (const [kk, v] of Object.entries(node as Record<string, unknown>)) {
        walk(v, path + '.' + kk, top);
      }
    }
  };
  for (const k of BODY_SCHEMA) {
    if (k === 'inheritedProse') continue;
    walk(artifact[k], k, k);
  }
})();
const PROSE_OK = proseRows.length > 0 && proseRows.every((r) => r.reRead);
const PROSE_FAILING = proseRows.filter((r) => !r.reRead);
gates.gInheritedProse = {
  ok: PROSE_OK,
  note: '⭐⭐⭐ THE NEW GATE OF #423 item 3(ii), executing THE LESSON filed at #421 item 4: '
    + 'every inherited prose string inside the hashed body is a CLAIM and is RE-READ at the '
    + 'freeze. THE ENUMERATION: '
    + proseRows.length + ' distinct prose fields inside the hashed body (every string of '
    + PROSE_MIN_LENGTH + ' characters or more, at its own path), each carrying the SOURCE it '
    + 'came from and a `reRead` boolean. THE BOOLEAN IS MEASURED, NOT ASSERTED: a field counts '
    + 'as re-read only if its top-level key DECLARES a source AND the string carries NONE of '
    + 'the ' + STALE_TOKENS.length + ' FROZEN STALE TOKENS — ['
    + STALE_TOKENS.map((t) => t.token).join(' | ') + '] — each of which could only survive '
    + 'from a sentence inherited untouched (they are the four MEDIUM and four LOW findings of '
    + '#421 item 4, turned into a test). FAILING FIELDS: '
    + (PROSE_FAILING.length === 0 ? 'NONE'
      : PROSE_FAILING.map((r) => r.path + ' [' + r.staleTokens.join(',') + ']').join(' · '))
    + '. THE ENUMERATION OWN HOME is `inheritedProse`, which is INSIDE the hashed body; this '
    + 'note is inside it too and is scanned with the rest.',
};
artifact.gates = gates;
artifact.inheritedProse = {
  what: '⭐⭐⭐ gInheritedProse OWN ENUMERATION (#423 item 3(ii)) — every prose field inside the '
    + 'hashed body, at its path, with `sourceKey` naming the top-level body key it lives under '
    + '(whose provenance is spelled out ONCE in `declaredSources`, never copied per row) and '
    + 'the MEASURED `reRead` boolean beside it. A single false value is RED.',
  minimumLength: PROSE_MIN_LENGTH,
  staleTokens: STALE_TOKENS,
  declaredSources: PROSE_SOURCE,
  fields: proseRows.length,
  failing: PROSE_FAILING,
  rows: proseRows,
};
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
    + 'block is OUTSIDE `BODY_SCHEMA` by construction — and so, ⭐ CORRECTION (#421 item '
    + '4(viii)), is `gFacesDetail`: the 3,000-odd individual face and bin check rows are '
    + 'EXCLUDED FROM THE HASHED BODY BY SCHEMA and are read off the file; the body carries '
    + '`gates.gFaces.ok` and its note. This is STATED here so no reader has to discover it.',
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
banner(`IF-T1b — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to .RED'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- §R1 THE FLOOD FACE (executed runs per in-possession open-play tick) ---');
for (const armK of ARMS) {
  const lv = face(R1_KEY, armK);
  banner(`  ${armK} mean ${f6(lv.value)} · ≥3 ${f6(face('r1.floodShareAtLeastThree', armK).value)}`
    + ` · bins ${Array.from({ length: R1_BINS }, (_, k) => f6(face(
      `r1.binShare.${k === R1_BINS - 1 ? `${k}plus` : k}`, armK).value)).join(' ')}`);
}
for (const cid of CONTRASTS) {
  const fr = FLOOD_ROWS[cid];
  banner(`  ${CID_LABEL[cid]}: Δ ${f6(fr.delta)} [${f6(fr.ci[0])}, ${f6(fr.ci[1])}] · tol `
    + `${f6(fr.toleranceAbs)} · resolved ${fr.resolved} · beyondToleranceUp `
    + `${fr.beyondToleranceUp} · floods ${fr.floods}`);
}
banner(`  the R1 ratio of record (the candidate ÷ world 17): `
  + `${f6(H_NUMBERS.theComparisonOfRecord.r1Ratio.ratio)} `
  + `[${f6(H_NUMBERS.theComparisonOfRecord.r1Ratio.ci[0])}, `
  + `${f6(H_NUMBERS.theComparisonOfRecord.r1Ratio.ci[1])}]`);
banner('');
banner('--- §R2 THE BAND (per contrasted pair, with every breach\'s DIRECTION) ---');
for (const cid of CONTRASTS) {
  banner(`  ${CID_LABEL[cid]} holdsBand ${holdsBand(cid)} · breaches `
    + `[${breachSetWithDirections(cid).map((b) => `${b.id} ${b.direction}`).join(', ')
      || 'none'}] · offside flag ${OFFSIDE_ROWS[cid].flag}`);
  for (const g of GUARD_TABLE[cid]) {
    banner(`    ${g.id} ${g.key} ctrl ${f6(g.controlLevel)} Δ ${f6(g.delta)} `
      + `[${f6(g.ci[0])}, ${f6(g.ci[1])}] tol ${f6(g.toleranceAbs)} ${g.direction} `
      + `resolved ${g.resolved} beyond ${g.beyondTolerance} breach ${g.breach} `
      + `${g.breachDirection}`);
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
  banner(`    crowding: crashShare ${f6(face('crowd.crashShare', armK).value)} · spacingUnder4 `
    + `${f6(face('guard.spacingUnder4', armK).value)}`);
  banner(`    per state (own runs/match): ${STATES.map((st) =>
    `${st} ${f6(face(`state.runsPerMatch.own.${st}`, armK).value)}`).join(' · ')}`);
  banner(`    calibration: post ${f6(face('calib.heldBodyTicksPostPerMatch', armK).value)} · pre `
    + `${f6(face('calib.heldBodyTicksPrePerMatch', armK).value)} · ledger `
    + `${f6(face('calib.ledgerDecisionsHeldPerMatch', armK).value)} · post/ledger `
    + `${f6(face('calib.postStepOverLedger', armK).value)}`);
}
banner('');
banner('--- §R3b THE SEAM\'S OWN FACES ---');
for (const armK of ARMS) {
  const sf = SEAM_FACES[armK];
  banner(`  ${armK} guard-pass FLOOR ${f6(sf.guardPass.ownCandidateVisibleShareFLOOR)} · own `
    + `candidates/match ${f6(sf.guardPass.ownCandidatesPerMatch)} · outside-post-guard `
    + `${f6(sf.guardPass.outsidePostGuardShare)}`);
  banner(`    restraint mean ${f6(sf.restraint.mean)} · =0 `
    + `${f6(sf.restraint.exactlyZeroShare)} · =1 ${f6(sf.restraint.exactlyOneShare)} · n `
    + `${sf.restraint.observations}`);
  banner(`    rankBelowCount share ${f6(sf.rankBelowCount.share)} · priorZero share `
    + `${f6(sf.priorZero.priorZeroShare)} · count mean ${f6(sf.count.mean)}`);
  banner(`    own runs: in flight ${f6(sf.inFlightAndRestart.ownRunShareBallInFlight)} · own `
    + `restart ${f6(sf.inFlightAndRestart.ownRunShareOwnRestart)} · a mate on the ball `
    + `${f6(sf.inFlightAndRestart.ownRunShareMateOwnsTheBall)}`);
}
banner('');
banner('--- §R3c THE COUPLING FACES (DS-C0\'s field names) ---');
for (const armK of ARMS) {
  const cl = COUPLING_LEVELS[armK];
  banner(`  ${armK} overlapSets/match ${f6(cl.overlapSetsPerMatch)} · overlap ARRIVALS/match `
    + `${f6(cl.overlapArrivalsPerMatch)} · played-to/set ${f6(cl.overlapPlayedToPerSet)} · '`
    + `confronted/match ${f6(cl.overlapConfrontedPerMatch)}`);
  banner(`    wallEligible/match ${f6(cl.wallEligiblePassesPerMatch)} · wallFires/match `
    + `${f6(cl.wallFiresPerMatch)} · ONE-TWOS/match ${f6(cl.oneTwosPerMatch)} · return share `
    + `${f6(cl.wallReturnShareOfFires)} · recon agrees ${f6(cl.wallReconAgreesShare)}`);
  const pr = PASSER_READ_TABLE[armK].sites as Record<string, { perMatch: number }>;
  banner(`    passerReadTable (per match): ${Object.keys(pr)
    .map((k) => `${k} ${f6(pr[k].perMatch)}`).join(' · ')}`);
}
banner(`  gArmIF ${ARM_IF_OK ? 'GREEN' : 'RED'} — `
  + `${armIfRows.map((r) => `${r.arm} eighth-why ${r.eighthWhyDecisions} · belief `
    + `${r.beliefEntriesSum}`).join(' · ')}`);
banner(`  the coop counters beside ${ARM_COOP_OK ? 'GREEN' : 'RED'} — `
  + `${armCoopRows.map((r) => `${r.arm} ${r.overlapSets}/${r.wallFires}`).join(' · ')}`);
banner('');
banner('--- §R4 THE CODE FACTS ---');
banner(`  MakeRun pushes ${MAKERUN_PUSHES.length} ${JSON.stringify(PUSH_CLASS_COUNTS)}`);
banner(`  makeRunCandidatesAllHatGuardedOnShippedPath `
  + `${makeRunCandidatesAllHatGuardedOnShippedPath}`);
banner(`  read forks ${READ_FORKS.length} · inventory agrees ${FORK_INVENTORY_AGREES} · counts `
  + `agree ${FLAG_COUNTS_AGREE} · doc line numbers agree ${FORK_LINE_NUMBERS_AGREE} `
  + `(measured ${FORK_LINES_MEASURED.join(', ')}; the doc's table `
  + `${FORK_LINES_IN_DOC.join(', ')})`);
banner(`  a4World.ts at THIS head: dsOwnRun ${A4_OWN_COUNT_AT_THIS_HEAD} · dsHatsOff `
  + `${A4_HATS_COUNT_AT_THIS_HEAD} · dsCoopHatsOff ${A4_COOP_COUNT_AT_THIS_HEAD}`);
banner(`  assignRunners WHOLE-TEXT hash AT THIS HEAD (compared to NOTHING banked — rule (m)): `
  + `${SPAN_ASSIGN_RUNNERS === null ? 'MISSING' : SPAN_ASSIGN_RUNNERS.sha}`);
banner(`  performPass WHOLE-TEXT hash: `
  + `${SPAN_PERFORM_PASS === null ? 'MISSING' : SPAN_PERFORM_PASS.sha}`);
banner('');
banner('--- §R5 THE READ (OWNCOOP+IF vs OWNCOOP on E13, the seat absent) ---');
banner(`  ${READ_SENTENCE}`);
for (const a of (artifact.reads as { annotations: string[] }).annotations) banner(`    ${a}`);
banner(`  the precedence step that selected it: `
  + `${(artifact.reads as { precedenceStepThatSelected: string }).precedenceStepThatSelected}`);
banner(`  D13's word (counterfactual, never selecting): ${READ_WORD_D13} — `
  + `${D13_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees}`);
banner(`  the HATS-vs-candidate table's word (counterfactual, never selecting): `
  + `${READ_WORD_HATS_VS_CANDIDATE} (holdsBand ${holdsBand(CONTRAST_HATS_VS_CANDIDATE)} · floods `
  + `${floods(CONTRAST_HATS_VS_CANDIDATE)})`);
banner('');
banner(`ARTIFACT ${OUT_PATH}`);
banner(`  bytes ${FINAL_ARTIFACT_BYTES} · fileSha256 ${FINAL_FILE_SHA}`);
banner(`  hashedBodySha256 ${artifact.hashedBodySha256 as string}`);
banner(`  instrumentSha256 ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`  hashReproducesFromFile ${HASH_REPRODUCES_FROM_FILE}`);
banner(`  wall ${((Date.now() - t0Wall) / 1000).toFixed(3)} s`);
if (!ALL_GREEN_FINAL) process.exitCode = 1;
