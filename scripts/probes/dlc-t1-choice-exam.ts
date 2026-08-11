// DLC T1 — THE CHOICE EXAM: does making delivery a PER-PASS PRICED CHOICE retain PTP-T1's
// proven supply gain WHILE dissolving its max-dose poison? The banked CONTEST seam (DLC-T0,
// 9360882/b8f5ef0) dosed on the PTP-T1 instrument set INHERITED WHOLE.
//
// Doc:      docs/world-model/DLC-T1-CHOICE-EXAM.md (§FORM/§SEEDS/§GATES frozen before sight)
// Contract: docs/world-model/DELIVERY-CHOICE-CONTRACT.md §3 DLC-T1 (+ §1 H-DLC, §2 M-DLC.1–4,
//           §4 non-claims); F-DLC-a/b/c pre-named there, and the FOUR #236 amendments binding.
// Rulings:  #235 (the lead DIAL retired; the DELIVERY-CHOICE contract drafted) · #236 (the
//           VISION re-audit: no taste term in slice one · identity gates always re-run · the
//           街机偏离 clause on slices 2/3 · a REPORTED T0 cost reading) · #237 (DLC-T0 banked —
//           the contest seam, the lockstep inertness proof, cost bounded below noise) · #234
//           (PTP-T1 adjudicated: the channel is REAL — LEAD moved trueHoldableShare +0.1307 pp
//           RESOLVED — but the uniform max dose POISONS the world) · #232.3/#231/#230 (the
//           inherited instrument's own chain) · #225.3(c) (per-dose STOP granularity) · #228.6
//           (the exam world MUST be percept-armed) · #181.2 (every HARD gate in-probe) ·
//           #197-M1/#198 (hashed body vs UNHASHED envelope) · #163 (seed/stats disjointness) ·
//           #20 (cluster = match seed) · #128 (wall is CONTEXT ONLY) · #207 (checkpoint) ·
//           #203 (PER-ARM ROWS and paired deltas ONLY — this probe fires NO branch) · #226.1
//           (the transcript form) · #229.2 (no table typed that the artifact does not carry).
//
// ⭐ INSTRUMENT-ONLY ROUND. src/** is byte-untouched (X-SRC-UNTOUCHED is a HARD gate); every
// seam this stage touches is already banked — the CONTEST at 9360882/b8f5ef0 (#237), the
// pass-lead seat at e7eb041 (#232), the eyes seat at 600ff04 (#228). Arms are built by THREE
// MatchConfig flags (`dlcDeliveryChoice`, `ptpPassLead`, `obmMovement`) plus the two gene
// channels (the scalar `passLeadSupport`, the 16-weight OBM matrix) written on ALL THREE
// genome views of BOTH teams (#196.3-D6) — no engine byte moves, `ctbSupportPlane` is FALSE in
// every arm, and NO ARM EVER OPENS `ptpPassLead` AND `dlcDeliveryChoice` TOGETHER (the
// two-doors declaration this contract froze at DLC-T0 §LAW: the banked seam keeps precedence,
// so an armed-both arm would silently BE the forced dose).
//
// ⭐⭐ THE GENE HAS NO ZERO-DOSE SEMANTICS UNDER THIS DOOR (DLC-T0 §LAW, the two-door
// gene-semantics trap): present at ANY value INCLUDING 0 the led candidate FORMS, is SCORED and
// ENTERS THE ARGMAX — it simply degenerates onto the feet candidate and loses every tie by the
// frozen strict-`>` order rule. ARMED-ZERO is therefore NOT "the mechanism disabled": it is the
// TIE RULE'S OWN EXAM-GRAIN RECEIPT, and its byte-identity to ABSENT is the strongest single
// statement in the stage. (Under `ptpPassLead` the same gene value 0 means something else
// entirely — a forced aim of zero displacement. Same gene, two doors, two meanings; both are
// declared per arm rather than inferred.)
//
// ⭐ EVERY RULER QUANTITY IS INHERITED FROM PTP-T1, each with its own G-REPRO receipt:
//   1 TRUE-holdable supply     — the O2-T1 `trueCellOf` instrument VERBATIM (#186 population)
//   2 pressed-first-reception  — the #173 tempo-census instrument VERBATIM
//   3 short-option supply      — #224.4(i)'s named debt; constants PARSED out of source
//   4 support-existence @ press— (3) restricted to (2)'s pressure test
//   5 the #218 shares          — the goal-genealogy origin classifier, LOSS-TICK semantics
//                                verbatim. Gate: G-REPRO-GGC. REPORTED; no gate hangs on them.
//   ⭐⭐ AND THE WHOLE INSTRUMENT IS PROVED TO BE PTP-T1's BY G-ANCHOR (= G-REPRO-PTPT1): the
//   LEAD-ANCHOR arm RE-WALKS the committed PTP-T1 BATTERY block's first rows in PTP-T1's own
//   world under `ptpPassLead` alone, and must reproduce every published per-match field EXACTLY
//   — signature (rng stream state inside) and the DELIVERED-LEAD columns included. It is one
//   receipt carrying three loads: the instrument is PTP-T1's; the CONTRAST anchor really is the
//   #234 poison arm and not a look-alike; and this stage's `performPass` wrapper perturbs
//   NOTHING. G-REPRO-OBMT1 / -CTBT1 / -O2T1 / -173 / -GGC ride here unchanged beneath it.
//
//   DLCT1_MODE=smoke|full    (default smoke: 12 seeds @ 12,426,030)
//   DLCT1_RESUME=1           full mode only — restore finished (pass, seed) units (#207)
//   DLCT1_CHECKPOINT=<path>  /tmp scratch; never committed, never read by a gate
//   DLCT1_N=<n> / DLCT1_SKIP_FP=1 — OVERRIDES: routed onto the EXIT-SEMANTICS GUARD BLOCK,
//                            turn G-CLEAN-INVOCATION RED and exit 1. Such a run adjudicates
//                            nothing.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import {
  appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import {
  formationSpot, supportSpot, supportSpotOnObmPlane,
  SUPPORT_LAT_CAP_FRAC, SUPPORT_LAT_PULL, CTB_DEPTH_BIAS_SPAN,
} from '../../src/ai/formations';
import { clamp } from '../../src/utils/math';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS,
  offballMovementWeightVector, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { OBM_SCORE_SPAN, obmOffballPolicy, type ObmPlane } from '../../src/ai/offballEyes';
import {
  PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL, passLeadMotion, passLeadSeatOf,
} from '../../src/ai/passLeadSeat';
import { passLeadSupportWeight } from '../../src/evolution/genome';
import { deliveryChoiceSeatOf, ledDelivery } from '../../src/ai/deliveryChoiceSeat';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import type { RecensusCostTable } from '../../src/ai/whetherEye';

const wall0 = Date.now();
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const gitSay = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'git-unavailable'; }
};
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const pctlSorted = (s: readonly number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]);
const quantile = (xs: readonly number[], q: number): number => pctlSorted([...xs].sort((a, b) => a - b), q);
const dist = (a: { x: number; y: number }, b: { x: number; y: number }): number => Math.hypot(a.x - b.x, a.y - b.y);

/* ========================================================================== */
/* §1 FROZEN PARAMETERS — every one INHERITED VERBATIM                        */
/* ========================================================================== */
/* --- ruler 1: the #186 (= #65) eligible-moment population, O2-T1 verbatim --- */
const MATCH_DURATION = 240;
const PER_MATCH_CAP = 80;
const MOMENT_SPACING = 30;
const HORIZON = 240;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
/* --- ruler 2: the #173 pressure test, tempo-census verbatim ---------------- */
/** TOUCH_CONTROL_DIST (src/sim/constants.ts) — the substrate's own "under pressure" switch. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
/* --- the guards: PM-T1 §5 constants, inherited VERBATIM -------------------- */
const NI_FRACTION = 1 - 0.275 / 0.380;
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
type BandKey = keyof typeof BAND_BASELINE;
const BAND_KEYS = Object.keys(BAND_BASELINE) as BandKey[];
/** the P3′ whole-match guard constants, PM-T1 verbatim */
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
/** the Phase 30.5 column-disease reading, REPORTED context only — never a gate. */
const PHASE305_INTERCEPTION_CONTEXT = 33;

/* --- §2 the seed ledger (stage doc §SEEDS) --------------------------------- */
const MODE = (process.env.DLCT1_MODE ?? 'smoke') === 'full' ? 'full' : 'smoke';
/** ⭐ FRESH, strictly above EVERYTHING DLC-T0 consumed (its committed ledger, read off
 *  `data/dlc-t0-contest-seam.json`'s `gates.seedDisjoint`: 12,426,000–024 receipts ·
 *  12,426,025 the REPORTED cost read · 12,426,900–906 its test-file seeds) and strictly BELOW
 *  those test seeds — proved clash-free in-probe against the COMPLETE ledger below, never
 *  asserted here. The first free seed is 12,426,026; this stage starts at 12,426,030 so the
 *  smoke block opens on a round number with four seeds of slack left visible in the ledger. */
const SMOKE_BASE = 12_426_030;
const SMOKE_N = 12;
/** ⭐ THE DELIVERED-DOSE READ's own seed (one match per arm, OBSERVATIONAL — see §6c). It is
 *  a DECLARED fourth block, not a re-use of the exam block: the read pulls percepts
 *  out-of-band, so it may never touch a match whose rows are exam data. */
const DOSE_READ_SEED = 12_426_045;
const GUARD_BLOCK: readonly [number, number] = [12_426_050, 12_426_099];
const BATTERY_BASE = 12_426_100;
/** ⭐ THE CTB-T1 PRECEDENT CAP, inherited from PTP-T1 unchanged (a ceiling, not a target): the
 *  battery may not exceed the N CTB-T1 itself ran, and PTP-T1's own battery ran exactly there.
 *  If the rule asks for more, that is a FORK for the commander — flagged in-probe
 *  (`capBinds`), never quietly re-cut. */
const N_CAP = 628;
/** the #173 sizing-smoke block — a DELIBERATE re-walk (receipt), never fresh data */
const REPRO173_BASE = 12_293_000;
const REPRO173_N = 40;
/** the O2-T1 battery block — a DELIBERATE re-walk of its first rows (receipt) */
const REPRO_O2_BASE = 12_422_100;
const REPRO_O2_N = 12;
/** ⭐ the #218 LIFT's receipt: the goal-genealogy census's OWN SMOKE block, `PROD` arm — a
 *  DELIBERATE re-walk (receipt), never fresh data (G-REPRO-GGC). */
const REPRO_GGC_BASE = 12_421_000;
const REPRO_GGC_N = 12;
/** ⭐ NEW — G-REPRO-CTBT1: the first rows of the CTB-T1 BATTERY block, re-walked in CTB-T1's
 *  OWN `absent` world (the bare production-shaped match), a DELIBERATE re-walk (receipt),
 *  never fresh data. This is what proves THIS probe IS that instrument. */
const REPRO_CTBT1_BASE = 12_423_100;
const REPRO_CTBT1_N = 8;
/** ⭐ NEW — G-REPRO-OBMT1: the first rows of the OBM-T1 BATTERY block, re-walked on TWO of its
 *  arms in OBM-T1's OWN percept-armed world — `absent` (the WORLD) and `checkAndShow` (the
 *  FROZEN MATRIX this exam re-uses verbatim as its #230 cell). A DELIBERATE re-walk (receipt),
 *  never fresh data. This is what proves THIS probe IS that instrument, and — because every
 *  walk here runs with the delivered-lead strike wrapper installed — that the wrapper perturbs
 *  nothing. */
const REPRO_OBMT1_BASE = 12_424_100;
const REPRO_OBMT1_N = 8;
/** ⭐⭐ NEW — G-ANCHOR (= G-REPRO-PTPT1), THIS STAGE'S OWN RECEIPT: the first rows of the
 *  PTP-T1 BATTERY block, re-walked on ITS LEAD ARM (`ptpPassLead` armed, `passLeadSupport` 1,
 *  no OBM) in PTP-T1's OWN percept-armed world. The LEAD-ANCHOR exam arm and this re-walk are
 *  THE SAME CONFIGURATION, which is what makes the CONTRAST anchor honest: the arm this exam
 *  sets the CHOICE against is proved — field for field, whole-match signature and the
 *  DELIVERED-LEAD columns included — to be the very arm ruling #234 called max-dose-poisoned.
 *  A DELIBERATE re-walk (receipt), never fresh data; its seed predicate is INVERTED (it MUST
 *  collide with its source's consumed interval). */
const REPRO_PTPT1_BASE = 12_425_100;
const REPRO_PTPT1_N = 8;
/** The COMPLETE consumed ledger: the ctb-t0 probe's list + CTB-T0's OWN consumption. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts + corner/smoke read (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  /** ⭐ read off the COMMITTED OBM-T0 artifact's own `gates.seedDisjoint.intervals`. */
  { name: 'OBM-T0 receipts + geometry/EPI/smoke read (#228)', range: [12_424_000, 12_424_024] },
  { name: 'OBM-T0 REPORTED cost reading (#228)', range: [12_424_025, 12_424_025] },
  /** ⭐ read off the COMMITTED OBM-T1 artifacts' own `gates.seedDisjoint.walkedBlocks`. */
  { name: 'OBM-T1 smoke (#228.6/#230)', range: [12_424_026, 12_424_037] },
  { name: 'OBM-T1 delivered-dose read (#230)', range: [12_424_040, 12_424_040] },
  { name: 'OBM-T1 guard band (#230)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#230)', range: [12_424_100, 12_424_899] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
  /** ⭐ read off the COMMITTED PTP-T0 artifact's own `gates.seedDisjoint.intervals`. */
  { name: 'PTP-T0 receipts + geometry/EPI-MOTION/smoke read (#232)', range: [12_425_000, 12_425_024] },
  { name: 'PTP-T0 REPORTED cost reading (#232)', range: [12_425_025, 12_425_025] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
  /** ⭐ read off the COMMITTED PTP-T1 artifacts' own `gates.seedDisjoint.walkedBlocks`. */
  { name: 'PTP-T1 smoke (#232.3/#233)', range: [12_425_026, 12_425_037] },
  { name: 'PTP-T1 delivered-dose read (#233)', range: [12_425_040, 12_425_040] },
  { name: 'PTP-T1 guard band (#233)', range: [12_425_050, 12_425_099] },
  /** ⭐⭐ the block G-ANCHOR RE-WALKS: PTP-T1's battery + reserve (#233/#234). */
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  /** ⭐ read off the COMMITTED DLC-T0 artifact's own `gates.seedDisjoint.intervals`. */
  { name: 'DLC-T0 receipts + contest/winner/EPI/smoke read (#237)', range: [12_426_000, 12_426_024] },
  { name: 'DLC-T0 REPORTED chooser-cost reading (#237)', range: [12_426_025, 12_426_025] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
];
/** ⭐ THE BATTERY BLOCK'S CEILING IS THE LEDGER'S, NOT A DISPATCH NUMBER (the ruled amendment):
 *  the dispatch's 500-seed cap was the DISPATCH's, never the contract's, and the N rule's own
 *  number governs. The only ceiling left is STRUCTURAL — the battery block may not run into the
 *  next consumed interval. Computed IN-PROBE from the ledger, never typed. */
const NEXT_CONSUMED_AFTER_BATTERY = Math.min(
  ...CONSUMED.map((c) => c.range[0]).filter((s) => s > BATTERY_BASE),
);
const BATTERY_ROOM = NEXT_CONSUMED_AFTER_BATTERY - BATTERY_BASE;
/** §4.2 the stats stream — a SEPARATE namespace. PTP-T1's base was 105,200 ⇒ the next legal
 *  base under the #163 200-floor is 105,400. The list is PTP-T1's COMPLETE published ledger
 *  + 105,200 (PTP-T1's own base). */
const BOOTSTRAP_SEED = 105_400;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800, 105_000, 105_200,
];

/* --- §3 the X-family pins + the committed source artifacts ----------------- */
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const O2T1_PATH = 'docs/world-model/data/o2-t1-wedge-exam.json';
const TEMPO_SMOKE_PATH = 'docs/world-model/data/tempo-census-sizing-smoke.json';
const TEMPO_PATH = 'docs/world-model/data/tempo-census.json';
/** the #218 lift's source of truth: the goal-genealogy census's OWN committed SMOKE artifact */
const GGC_SMOKE_PATH = 'docs/world-model/data/goal-genealogy-census-smoke.json';
/** ⭐ the instrument's OWN source of truth: CTB-T1's committed BATTERY artifact (#226). */
const CTBT1_PATH = 'docs/world-model/data/ctb-t1-supply-exam.json';
/** ⭐ THE DIRECT PARENT: OBM-T1's committed BATTERY artifact (#230). */
const OBMT1_PATH = 'docs/world-model/data/obm-t1-policy-exam.json';
/** ⭐⭐ THE DIRECT PARENT AND THE CONTRAST ANCHOR'S SOURCE: PTP-T1's committed BATTERY
 *  artifact (#234) — the run whose LEAD arm this exam re-walks and sets the CHOICE against. */
const PTPT1_PATH = 'docs/world-model/data/ptp-t1-full-channel.json';
const FORMATIONS_SRC = 'src/ai/formations.ts';
const BRAIN_SRC = 'src/ai/PlayerBrain.ts';
const PASSLEAD_SRC = 'src/ai/passLeadSeat.ts';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* --- §4 the invocation guard (G-CLEAN-INVOCATION) -------------------------- */
const N_ENV = process.env.DLCT1_N ? Math.max(1, Number.parseInt(process.env.DLCT1_N, 10)) : null;
const SKIP_FP = process.env.DLCT1_SKIP_FP === '1';
const OVERRIDDEN = N_ENV !== null || SKIP_FP;
const OUT_PATH = OVERRIDDEN
  ? '/tmp/dlc-t1-guard-run.json'
  : (MODE === 'smoke'
    ? 'docs/world-model/data/dlc-t1-choice-exam-smoke.json'
    : 'docs/world-model/data/dlc-t1-choice-exam.json');

/* ========================================================================== */
/* §5 THE INHERITED INSTRUMENT PIECES                                         */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/* --- the certified table, INJECTED (#65's P2 convention; O2-T1 verbatim) ---- */
const rawTableBytes = readFileSync(TABLE_PATH, 'utf8');
const rawTable = JSON.parse(rawTableBytes) as Record<string, any>;
if (rawTable.tableSha !== EXPECTED_TABLE_SHA) {
  throw new Error(`certified table SHA drift: ${String(rawTable.tableSha)} != ${EXPECTED_TABLE_SHA}`);
}
const tableParams = rawTable.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: tableParams.pressureBands,
  staleBands: tableParams.staleBands,
  supportCuts: tableParams.supportCuts,
  supportWindowM: tableParams.supportWindowM,
  cells: rawTable.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper, reachesZero: k.reachesZero,
    })),
  })),
};
const HOLDABLE_CELLS = TABLE.cells
  .filter((c) => c.costs.some((k) => k.reachesZero))
  .map((c) => `${c.pressureBand}|${c.staleBand}|${c.supportBand}`)
  .sort();
if (HOLDABLE_CELLS.length !== 1 || HOLDABLE_CELLS[0] !== '0|0|0') {
  throw new Error(`holdable-cell set drift: ${JSON.stringify(HOLDABLE_CELLS)} != ["0|0|0"]`);
}
type Band = 0 | 1 | 2;
const pressureBandOf = (v: number): Band =>
  (v < TABLE.pressureBands[0] ? 0 : v < TABLE.pressureBands[1] ? 1 : 2);
const staleBandOf = (v: number): Band =>
  (v < TABLE.staleBands[0] ? 0 : v < TABLE.staleBands[1] ? 1 : 2);
const supportBandOf = (v: number): Band =>
  (v < TABLE.supportCuts.low ? 0 : v >= TABLE.supportCuts.high ? 2 : 1);

/** A0 (untouched): one fork step to read the decided action — #186 / O2-T1 verbatim. */
const decidedActionOf = (before: Match, ownerGid: number): string => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  let action = owner.action.type;
  const startTick = fork.simTick;
  for (let t = 0; t < HORIZON; t++) {
    if (fork.finished) break;
    fork.step(DT);
    if (fork.simTick - startTick === 1) { action = owner.action.type; break; }
  }
  return action;
};
/** The TRUE-context cell (census keying) — #186 / O2-T1 VERBATIM. */
const trueCellOf = (match: Match, owner: Player): { key: string; bands: [Band, Band, Band] } => {
  const side = owner.side;
  const pB = pressureBandOf(pressureAt(owner.pos, match.teams[1 - side].players));
  const sB = staleBandOf(match.teams[side].staleTime);
  const support = match.teams[side].players.filter((p) => (
    p.gid !== owner.gid && p.role !== 'GK' && !p.sentOff
    && dist(p.pos, owner.pos) >= SUPPORT_MIN_M && dist(p.pos, owner.pos) <= SUPPORT_MAX_M
  )).length;
  return { key: `${pB}|${sB}|${supportBandOf(support)}`, bands: [pB, sB, supportBandOf(support)] };
};

/* --- ruler 3: the SHORT-OPTION radius family, PARSED OUT OF SOURCE ---------- */
/** ⭐ G-TRACE-RADIUS (#202 form): the instrument's constants are READ FROM `supportSpot`'s
 *  own line, never typed here. `radius = 10 + supportDistance·8` is the code's standing
 *  answer to "how far is support"; the short-option predicate asks that same question of
 *  the CARRIER. */
const radiusTrace = (() => {
  const src = readFileSync(FORMATIONS_SRC, 'utf8');
  const line = 'const radius = 10 + g.supportDistance * 8;';
  const m = /const radius = ([\d.]+) \+ g\.supportDistance \* ([\d.]+);/.exec(src);
  return {
    lineFound: src.includes(line),
    base: m === null ? Number.NaN : Number(m[1]),
    slope: m === null ? Number.NaN : Number(m[2]),
    line, file: FORMATIONS_SRC,
  };
})();
const supportRadiusOf = (g: { supportDistance: number }): number =>
  radiusTrace.base + g.supportDistance * radiusTrace.slope;

/* ========================================================================== */
/* §5b THE #218 LIFT — the goal-genealogy ORIGIN CLASSIFIER, ported            */
/* ========================================================================== */
/** ⭐ PORTED FROM `scripts/probes/goal-genealogy-census.ts` (#214/#215/#217), with its
 *  ⚠ LOSS-TICK semantics VERBATIM (#215.3-H1 + M2): the by-third origin classes are cut on the
 *  ball's position at the previous segment's LAST OWNED tick (the loss/release point), mirrored
 *  into the WINNER's attacking frame; the REGAIN-tick reading is carried beside it as the
 *  declared cross-cut. The limbs this exam does NOT read (pass LOCATION / own-third chains /
 *  the danger-window ladder) are not lifted — the G-REPRO-173 precedent verbatim, and
 *  G-REPRO-GGC is what proves the omission changes nothing on the columns that ARE read. */
const THIRD_LOCAL_X = HALF_L / 3;
const GG_ORIGIN_CLASSES = [
  'kickoff', 'goalKick', 'kickIn', 'restartSecondBall', 'matchOpenFallback',
  'setPieceCorner', 'setPieceFreeKick', 'setPiecePenalty',
  'scrambleLooseBall',
  'turnoverWonInOwnThird', 'turnoverWonInMiddleThird', 'turnoverWonInFinalThird',
] as const;
type OriginClass = typeof GG_ORIGIN_CLASSES[number];
const GG_SET_PIECE: readonly OriginClass[] = ['setPieceCorner', 'setPieceFreeKick', 'setPiecePenalty'];
const GG_OPEN_PLAY: readonly OriginClass[] = [
  'scrambleLooseBall', 'turnoverWonInOwnThird', 'turnoverWonInMiddleThird', 'turnoverWonInFinalThird',
];
type GgFamily = 'setPiece' | 'restart' | 'openPlay';
const ggFamilyOf = (o: OriginClass): GgFamily => (GG_SET_PIECE.includes(o) ? 'setPiece'
  : GG_OPEN_PLAY.includes(o) ? 'openPlay' : 'restart');
type Third = 'own' | 'middle' | 'final';
const ggThirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');
/** the CONSTRUCTION ladder (#214.1a) — a REPORTING GRID; no N is privileged, nothing gates. */
const CONSTRUCTED_LADDER = [3, 4, 5] as const;
interface GgSegment {
  team: Side;
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  startTick: number;
  lastOwnedTick: number;
  assignedTicks: number;
  completedPasses: number;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
  /** live-updated on every owned tick; frozen at the segment's LAST OWNED tick = the LOSS SPOT */
  lastOwnedLocalXOwnerFrame: number;
  lossLocalXLoserFrame: number | null;
  regainSpotLocalXLoserFrame: number | null;
  lossThird: Third | null;
  regainThird: Third | null;
  regainContested: boolean;
  goalScoringSide: Side | null;
}
interface GgGoalRec {
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  family: GgFamily;
  lossThird: Third | null;
  completedPasses: number;
}
type GgCounts = Record<OriginClass, number>;
const ggZeroCounts = (): GgCounts => Object.fromEntries(
  GG_ORIGIN_CLASSES.map((o) => [o, 0]),
) as GgCounts;

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = dist(o.pos, p.pos);
    if (d < best) best = d;
  }
  return best;
};

/* ========================================================================== */
/* §6 THE ARMS (stage doc §FORM)                                              */
/* ========================================================================== */
type ArmName = 'absent' | 'armedZero' | 'choice' | 'choiceXCas' | 'leadAnchor';
const ARMS: readonly ArmName[] = ['absent', 'armedZero', 'choice', 'choiceXCas', 'leadAnchor'];
const CONTROL_ARM: ArmName = 'absent';
/** ⭐ THE CHOICE CELL — the cell the stage exists for, and the cell the JOINT primary is read at. */
const CHOICE_ARM: ArmName = 'choice';

/** row-major slot index, the seat's own convention: `output * featureCount + feature`. */
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

/**
 * ⭐ THE POLICY CORNERS — PRE-REGISTERED EX ANTE, each a named 16-weight matrix, each a
 * sentence about football. NO number is invented: every non-zero entry is ±1, the frozen
 * signed domain's OWN corner (`OBM_WEIGHT_MIN/MAX`, themselves `CTB_GENE_MIN/MAX`).
 *
 * ⚠ READ THE DOSE AGAINST THE OBSERVED FEATURE DISTRIBUTION (#228.6), never against the
 * weight domain alone: the features' OBM-T0 means are f1 0.184 · f2 0.456 · f3 0.216 ·
 * f4 0.171, and an output is the MEAN of its weighted features, so a single-slot corner at
 * ±1 delivers on average about |mean(f_i)| / 4 of an axis. An f1-driven corner is therefore
 * a SMALL dose ON AVERAGE and a LARGE one exactly where f1 is large — i.e. CONCENTRATED at
 * pressed moments. That concentration IS the hypothesis, not a weakness of the dose; the
 * DELIVERED dose is published per arm (§6c) so dose ≠ delivered stays visible (the CTB-T1
 * clamp lesson).
 */
/** ⭐ THE #230 CELL'S MATRIX, RE-USED VERBATIM. CHECK-AND-SHOW is OBM-T1's own arm — the drop
 *  plus the demand: f1 (the carrier's perceived plight) drives plane depth DOWN and the
 *  `SupportBallCarrier` score UP. It is the arm the ONLY battery signal came from (#230.4), and
 *  it is re-walked against OBM-T1's committed rows by G-REPRO-OBMT1 rather than re-typed on
 *  trust. */
const CHECK_AND_SHOW_MATRIX = matrix([O_DEPTH, F1, MIN], [O_SUPPORT, F1, MAX]);

/** THE OBM SEAM's dose per arm: the 16-weight matrix, or `null` = flag off, gene absent.
 *  ⭐ ONE arm doses it — CHOICE-X-CAS, the RELATIONAL PAIR with the chooser free. */
const DOSE: Record<ArmName, number[] | null> = {
  absent: null,
  armedZero: null,
  choice: null,
  choiceXCas: CHECK_AND_SHOW_MATRIX,
  leadAnchor: null,
};

/* --- ⭐ THE SHARED SCALAR GENE `passLeadSupport`, and the TWO DOORS it is read through ----- */
/**
 * ⭐⭐ SAME GENE, TWO DOORS, TWO MEANINGS — DECLARED PER ARM, NEVER INFERRED (DLC-T0 §LAW's
 * gene-semantics trap, written into the arm table itself).
 *
 *   through `ptpPassLead` (the BANKED, RETIRED dial — the LEAD-ANCHOR arm only): the gene is a
 *     DOSE. It FORCES the aim to `mate.pos + lead` on every support-mode mate.
 *   through `dlcDeliveryChoice` (THE CONTEST — every other armed arm): the gene is TASTE, and it
 *     has NO ZERO-DOSE SEMANTICS AT ALL. Present at ANY value including 0 the led candidate
 *     FORMS, is SCORED and ENTERS the argmax; it only loses. What 0 removes is the DISTANCE, not
 *     the mechanism. The structural identity is BORN-ABSENT (no gene ⇒ no seat ⇒ no candidate).
 *
 * The domain is the seam's own (`clamp01`, PTP-T0 §LAW 2) and is PROBED off the shipped
 * `passLeadSupportWeight` map by G-TRACE-PTP at absence, both ends and beyond both ends. The
 * MIDPOINT is retained as a domain receipt only: this stage doses no half arm, because under
 * the contest the gene is not a dial to walk (#235 — that fork is retired unrun).
 */
const PTP_GENE_MIN = 0;
const PTP_GENE_MAX = 1;
const PTP_GENE_HALF = (PTP_GENE_MIN + PTP_GENE_MAX) / 2;
/** `null` = the gene ABSENT and NO delivery door open on this arm. */
const GENE: Record<ArmName, number | null> = {
  absent: null,
  armedZero: PTP_GENE_MIN,
  choice: PTP_GENE_MAX,
  choiceXCas: PTP_GENE_MAX,
  leadAnchor: PTP_GENE_MAX,
};
/** ⭐⭐ WHICH DOOR EACH ARM OPENS — and the promise that NO ARM OPENS BOTH, in code rather than
 *  in prose. Asserted off the REAL constructed matches by FLAG-HYGIENE's two-doors row. */
type Door = 'none' | 'dlc' | 'ptp';
const DOOR: Record<ArmName, Door> = {
  absent: 'none',
  armedZero: 'dlc',
  choice: 'dlc',
  choiceXCas: 'dlc',
  leadAnchor: 'ptp',
};
/** the three-seam sentence for each arm, frozen with the arm (stage doc §FORM's table). */
const ARM_SENTENCE: Record<ArmName, string> = {
  absent: 'the CONTROL — the percept-armed world with EVERY seat unreached. PTP-T1\'s own '
    + 'ABSENT arm, world for world.',
  armedZero: '⭐ THE IDENTITY ARM, AND IT IS THE TIE RULE\'S OWN EXAM-GRAIN RECEIPT: the '
    + 'contest door OPEN with the gene at 0. Under the T0 law this is NOT "the mechanism off" — '
    + 'the led candidate FORMS, is SCORED and ENTERS THE ARGMAX on every support-mode mate, with '
    + 'exactly zero displacement, and loses every tie to the incumbent by the frozen strict-`>` '
    + 'order. It must therefore be BYTE-IDENTICAL to ABSENT per seed, and that identity is the '
    + 'strongest single statement in the stage: the contest costs the world NOTHING until a '
    + 'candidate actually prices better.',
  choice: '⭐⭐ THE CELL THE STAGE EXISTS FOR (H-DLC): delivery is a PER-PASS PRICED CHOICE — '
    + 'to feet and led are scored by the SAME machinery at two aim points and the ARGMAX picks '
    + 'the winner. No threshold, no predicate, no taste multiplier (#236 amendment 1). The '
    + 'pre-registered JOINT primary is read here.',
  choiceXCas: '⭐ THE RELATIONAL PAIR WITH THE CHOOSER FREE: the receiver comes short and asks '
    + '(the OBM CHECK-AND-SHOW matrix, OBM-T1\'s own, re-walked as a receipt) AND the passer '
    + 'chooses his delivery. PTP-T1\'s COMBINED cell with the DIAL replaced by the CONTEST — the '
    + 'one cell where both halves of #231\'s relational reading are live at once.',
  leadAnchor: '⭐⭐ THE CONTRAST ANCHOR, AND THE POISON ARM ITSELF: PTP-T1\'s LEAD arm '
    + 're-walked under `ptpPassLead` ALONE at gene 1 — the FORCED uniform dose ruling #234 found '
    + 'REAL (trueHoldableShare +0.1307 pp RESOLVED, the arc\'s first resolved supply move) AND '
    + 'max-dose-POISONING (goals out of band). The contest is set against IT, not against a '
    + 'description of it, and G-ANCHOR proves the identity against PTP-T1\'s own committed '
    + 'battery rows. `dlcDeliveryChoice` is OFF here — NO EXAM ARMS BOTH DOORS.',
};
/** the receipt walks (never exam data): each runs in ITS SOURCE's own world */
type ReproArm = 'reproO2Control' | 'repro173Prod' | 'reproGgcProd' | 'reproCtbT1Absent'
  | 'reproObmT1Absent' | 'reproObmT1CheckAndShow' | 'reproPtpT1Lead';
type WalkArm = ArmName | ReproArm;
/** the O2-T1 CONTROL world, VERBATIM (CENSUS_FLAGS + o1PassWindup) */
const O2T1_CONTROL_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false, o1PassWindup: true,
} as const;

/**
 * ⭐ THE PERCEPT-ARMED BASE WORLD — IDENTICAL IN EVERY ARM (the #228.6 gate).
 *
 * `refreshPerception` runs only when `edsPerceivedDefence || edsPerceivedChoice ||
 * stationEye !== null` (`src/sim/Match.ts`), and a body's SNAPSHOT PLAYERS are
 * reconstructed from his RECORDED SCAN MOMENTS, which are recorded only when
 * `edsPerceivedChoice || stationEye !== null`. So:
 *   * `edsPerceivedDefence` ALONE gives a memory but NO scan frames ⇒ every body believes
 *     he is alone ⇒ all four features EXACTLY ZERO ⇒ the treatment is silently undelivered —
 *     the P1 failure mode wearing a percept flag;
 *   * a `stationEye` needs a whole eye configuration and is a far larger intervention;
 *   * `edsPerceivedChoice` ALONE is therefore the MINIMAL arming that makes the seat's eyes
 *     actually see: one flag, both halves of the chain (the refresh AND the scan record).
 *
 * ⚠ DECLARED, NOT HIDDEN: `edsPerceivedChoice` is not behaviour-free — it also switches the
 * CARRIER's pass choice onto the perceived-snapshot chooser (`PlayerBrain.ts`). That is a
 * REAL difference from CTB-T1's bare world, so the ABSENT level here is NOT CTB-T1's ABSENT
 * level and the two batteries' absolute numbers are not comparable. The PAIRED contrast is
 * clean regardless, because ALL FIVE ARMS SHARE THIS WORLD EXACTLY and the arms differ by
 * nothing but the two seams' flags and doses. Weighed and chosen: a smaller flag set that
 * leaves the eyes blind would be strictly worse than a slightly larger world that delivers the
 * treatment.
 *
 * ⭐⭐ AND IT IS ALSO WHY THE LEAD CHANNEL MEASURED HERE IS THE HONEST (THIN) ONE (#232.3): in a
 * percept world the passer leads only the mates his OWN EYES carry a remembered velocity for.
 * PTP-T0 measured 921/1,109 support projections EXACTLY ZERO here (remembered speed 0.717 m/s
 * vs truth 2.513) and 21.7 % of chosen passes carrying a lead vs 62.9 % bare — so the delivered
 * lead is expected around ONE THIRD of a bare world's. That degradation IS the design; the world
 * is not chosen for the lead's convenience, it is chosen because OBM's arming requires it and
 * because it is the cell the #230 signal came from.
 */
const PERCEPT_FLAGS = { edsPerceivedChoice: true } as const;

/** ⭐ THE ARMING CHECKLIST (#196.3-D6 + the OBM-T0 four limbs): the 16-weight MATRIX on ALL
 *  THREE genome views of BOTH teams. Limb 4 (a percept-armed world) is the world above. */
const armMatrix = (m: Match, w: readonly number[] | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (w === null) delete g.offballMovementWeights;
      else g.offballMovementWeights = [...w];
    }
  }
};
/** ⭐ THE SECOND SEAM's ARMING CHECKLIST (PTP-T0 §SEAM's three limbs: the flag + the opt-in or
 *  a probe-written gene + a NON-ABSENT gene): the scalar on ALL THREE genome views of BOTH
 *  teams, the same real gene channel. */
const armGene = (m: Match, v: number | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (v === null) delete g.passLeadSupport;
      else g.passLeadSupport = v;
    }
  }
};
/** G-ARM's gene-channel receipt: is the matrix present, full-length, on all six views? */
const genesOnAllViews = (m: Match): boolean => m.teams.every((t) => (
  [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => Array.isArray(g.offballMovementWeights)
  && g.offballMovementWeights.length === OBM_WEIGHT_SLOTS));
/** ⭐ the same receipt for the LEAD gene: present and finite on all six views? */
const leadGeneOnAllViews = (m: Match): boolean => m.teams.every((t) => (
  [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => typeof g.passLeadSupport === 'number' && Number.isFinite(g.passLeadSupport)));

const matchOf = (seed: number, arm: WalkArm): Match => {
  const base = { seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: MATCH_DURATION };
  if (arm === 'reproO2Control') {
    return new Match({ ...base, ...O2T1_CONTROL_FLAGS } as ConstructorParameters<typeof Match>[0]);
  }
  /** ⭐ the #173 receipt walk is the census's own `prod` arm; the #218 receipt walk is the
   *  genealogy census's own `PROD` arm; ⭐ the G-REPRO-CTBT1 walk is CTB-T1's own ABSENT
   *  arm — all three are the BARE production-shaped world (`new Match({seed, teamA, teamB,
   *  duration})`), which is NOT this exam's world. Each receipt runs in ITS SOURCE's world,
   *  and the gates are what prove the identity rather than asserting it. */
  if (arm === 'repro173Prod' || arm === 'reproGgcProd' || arm === 'reproCtbT1Absent') {
    return new Match(base as ConstructorParameters<typeof Match>[0]);
  }
  /** ⭐ THE NEW G-REPRO-OBMT1 WALKS run in OBM-T1's OWN world — percept-armed, `ptpPassLead`
   *  NEVER passed (OBM-T1 predates this seam entirely), on TWO arms: its ABSENT (the world) and
   *  its CHECK-AND-SHOW (the FROZEN MATRIX this exam re-uses verbatim). */
  if (arm === 'reproObmT1Absent') {
    return new Match({ ...base, ...PERCEPT_FLAGS } as ConstructorParameters<typeof Match>[0]);
  }
  if (arm === 'reproObmT1CheckAndShow') {
    const mm = new Match({
      ...base, ...PERCEPT_FLAGS, obmMovement: true,
    } as ConstructorParameters<typeof Match>[0]);
    armMatrix(mm, CHECK_AND_SHOW_MATRIX);
    return mm;
  }
  /** ⭐⭐ THE G-ANCHOR RE-WALK runs in PTP-T1's OWN world on ITS LEAD ARM — percept-armed,
   *  `ptpPassLead` armed, the gene at the domain max, NO OBM matrix and `dlcDeliveryChoice`
   *  NEVER passed (PTP-T1 predates the contest entirely). It is CONFIGURATION-IDENTICAL to this
   *  exam's LEAD-ANCHOR arm, which is exactly what makes the CONTRAST anchor honest. */
  if (arm === 'reproPtpT1Lead') {
    const mm = new Match({
      ...base, ...PERCEPT_FLAGS, ptpPassLead: true,
    } as ConstructorParameters<typeof Match>[0]);
    armGene(mm, PTP_GENE_MAX);
    return mm;
  }
  const d = DOSE[arm];
  const gene = GENE[arm];
  const door = DOOR[arm];
  /** ⭐ THE TWO-DOORS DECLARATION, in code: `ctbSupportPlane` is NEVER passed, in ANY arm, so
   *  it is `false` everywhere and the OBM policy's INTERCEPT is a hard 0 (the #228 fix). The
   *  banked static bank is not this exam's question and cannot leak in through EITHER door.
   *  ⭐⭐ AND THE DELIVERY DOORS ARE MUTUALLY EXCLUSIVE BY CONSTRUCTION: an arm declares
   *  EXACTLY ONE of `dlcDeliveryChoice` (the CONTEST) and `ptpPassLead` (the banked FORCED
   *  dial), never both — under DLC-T0 §LAW the banked seam keeps PRECEDENCE, so an armed-both
   *  arm would silently BE the forced dose wearing the contest's name. `obmMovement` is passed
   *  if and only if this arm has a matrix. Asserted per arm off the REAL constructed matches by
   *  FLAG-HYGIENE, never merely stated. */
  const m = new Match({
    ...base,
    ...PERCEPT_FLAGS,
    ...(d === null ? {} : { obmMovement: true }),
    ...(door === 'ptp' ? { ptpPassLead: true } : {}),
    ...(door === 'dlc' ? { dlcDeliveryChoice: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (d !== null) armMatrix(m, d);
  if (gene !== null) armGene(m, gene);
  return m;
};

/** The whole-match signature INCLUDING the rng stream state (the CTB-T0 form). */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/* ========================================================================== */
/* §7 THE WALK — one whole match, every inherited instrument at once           */
/* ========================================================================== */
interface PerMatch {
  seed: number;
  /* --- ruler 1 (#186 population, O2-T1 verbatim) --- */
  qualifying: number;
  eligible: number;
  exFirstTouch: number;
  exMustKick: number;
  exShoot: number;
  exClear: number;
  trueHoldable: number;
  /* --- ruler 2 (#173) --- */
  spellsOpenPlay: number;
  firstRecOpen: number;
  firstRecOpenPressed: number;
  /* --- rulers 3 + 4 --- */
  possTicks: number;
  possTicksShort: number;
  possTicksPressed: number;
  possTicksPressedShort: number;
  firstRecShort: number;
  firstRecPressedShort: number;
  /* --- G-ARM + the DELIVERED dose, read where the executor consumes it --- */
  supportTicks: number;
  supportTicksPlanePresent: number;
  supportTicksPlaneAbsent: number;
  supportTicksPlaneZero: number;
  supportTicksShifted: number;
  supportTicksUnshiftedClampBound: number;
  supportTicksZeroPlaneMoved: number;
  supportShiftSum: number;
  supportShiftMax: number;
  supportShiftGe1: number;
  planeDepthSum: number;
  planeWidthSum: number;
  planeDepthAbsSum: number;
  planeWidthAbsSum: number;
  supportBehindBall: number;
  clampXBound: number;
  clampYBound: number;
  genesOnAllViews: number;
  policyCacheEntries: number;
  /* --- ⭐ THE SECOND SEAM: the DELIVERED LEAD, read at the STRIKE (zero percept pulls) --- */
  leadGeneOnAllViews: number;
  passesChosen: number;
  passesToSupportTarget: number;
  /** the strike was HANDED a lead object at all — a CODE-PATH receipt (armed ⇒ always). */
  ptpLedHandled: number;
  /** the handed lead was NON-ZERO — the delivered channel, and the thin-channel row (#232.3). */
  ptpLedNonZero: number;
  ptpLeadSum: number;
  ptpLeadMax: number;
  ptpLeadShareOfDistSum: number;
  /* --- ⭐ THE SITUATIONAL PROFILE of the emergent led share (REPORTED secondary) ---
   * every chosen pass is additionally binned by whether the CARRIER was under pressure at the
   * instant he struck it (the #173 pressure test's own radius, `TOUCH_CONTROL_DIST`, asked of
   * the nearest opponent). Four counters that partition `passesChosen` exactly. */
  ledAtPressed: number;
  ledAtUnpressed: number;
  feetAtPressed: number;
  feetAtUnpressed: number;
  /* --- guards --- */
  interceptions: number;
  offsides: number;
  fouls: number;
  penalties: number;
  goals: number;
  crosses: number;
  headers: number;
  longBalls: number;
  cutbacks: number;
  spreadYOut: number;
  spreadYIn: number;
  spacingMedian: number;
  spacingUnder4: number;
  /* --- ruler 5: the #218 LIFT (goal-genealogy origin classifier, ported) --- */
  ggSegments: number;
  ggSegmentsByOrigin: GgCounts;
  ggSegmentsByOriginAtRegainSpot: GgCounts;
  ggGoals: GgGoalRec[];
  ggTotalTicks: number;
  ggDeadBallTicks: number;
  ggSegmentTicks: number;
  ggLooseGapTicks: number;
  ggAssignedTicksSum: number;
  ggSpanOrderViolations: number;
  ggGoalsFromScore: number;
  ggUnattributedGoals: number;
  ggTurnoversTotal: number;
  ggOwnThirdTurnovers: number;
  ggOwnThirdTurnoversAtRegainSpot: number;
  /* --- context --- */
  ticksWalked: number;
  playedTicks: number;
  reachedFullTime: number;
  signature: string;
}

const isExamArm = (arm: WalkArm): arm is ArmName => (ARMS as readonly string[]).includes(arm);
const walkSeed = (seed: number, arm: WalkArm): PerMatch => {
  const m = matchOf(seed, arm);
  /** ARMED = the `obmMovement` flag is on and a matrix is written (ARMED-ZERO included).
   *  ⚠ the OBM-T1 CHECK-AND-SHOW receipt walk is armed too — it IS that arm. */
  const armedFlag = (isExamArm(arm) && DOSE[arm] !== null) || arm === 'reproObmT1CheckAndShow';
  /** DOSED = the OBM matrix is armed AND at least one slot is non-zero (context only; the
   *  geometry instruments key off `armedFlag`, which is what decides whether a plane exists). */
  const dosed = armedFlag
    && (isExamArm(arm) ? (DOSE[arm] as number[] | null)?.some((v) => v !== 0) === true : true);
  void dosed;

  /* ---- ruler 1 state (#186 sampling budget) ---- */
  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;
  /* ---- ruler 2 state (the tempo-census spell/touch machinery, verbatim in the part
   *      the pressed-first-reception instrument depends on) ---- */
  type SpellOrigin = 'openPlay' | 'restart' | 'kickoff';
  let curSpellOrigin: SpellOrigin | null = null;
  let curSpellSide: Side | null = null;
  let curSpellTouches = 0;
  let prevOwnerGid: number | null = null;
  /* ---- guard accumulators (PM-T1 P3′/B1-a forms) ---- */
  const pairs: [number[], number[]] = [[], []];
  const spreadOut: [number[], number[]] = [[], []];
  const spreadIn: [number[], number[]] = [[], []];
  let samples = 0;
  let tick = 0;

  const r: PerMatch = {
    seed,
    qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
    trueHoldable: 0,
    spellsOpenPlay: 0, firstRecOpen: 0, firstRecOpenPressed: 0,
    possTicks: 0, possTicksShort: 0, possTicksPressed: 0, possTicksPressedShort: 0,
    firstRecShort: 0, firstRecPressedShort: 0,
    supportTicks: 0, supportTicksPlanePresent: 0, supportTicksPlaneAbsent: 0,
    supportTicksPlaneZero: 0, supportTicksShifted: 0, supportTicksUnshiftedClampBound: 0,
    supportTicksZeroPlaneMoved: 0,
    supportShiftSum: 0, supportShiftMax: 0, supportShiftGe1: 0,
    planeDepthSum: 0, planeWidthSum: 0, planeDepthAbsSum: 0, planeWidthAbsSum: 0,
    supportBehindBall: 0, clampXBound: 0, clampYBound: 0, genesOnAllViews: 0,
    policyCacheEntries: 0,
    leadGeneOnAllViews: 0, passesChosen: 0, passesToSupportTarget: 0,
    ptpLedHandled: 0, ptpLedNonZero: 0, ptpLeadSum: 0, ptpLeadMax: 0, ptpLeadShareOfDistSum: 0,
    ledAtPressed: 0, ledAtUnpressed: 0, feetAtPressed: 0, feetAtUnpressed: 0,
    interceptions: 0, offsides: 0, fouls: 0, penalties: 0, goals: 0,
    crosses: 0, headers: 0, longBalls: 0, cutbacks: 0,
    spreadYOut: Number.NaN, spreadYIn: Number.NaN,
    spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
    ggSegments: 0, ggSegmentsByOrigin: ggZeroCounts(),
    ggSegmentsByOriginAtRegainSpot: ggZeroCounts(), ggGoals: [],
    ggTotalTicks: 0, ggDeadBallTicks: 0, ggSegmentTicks: 0, ggLooseGapTicks: 0,
    ggAssignedTicksSum: 0, ggSpanOrderViolations: 0, ggGoalsFromScore: 0,
    ggUnattributedGoals: 0, ggTurnoversTotal: 0, ggOwnThirdTurnovers: 0,
    ggOwnThirdTurnoversAtRegainSpot: 0,
    ticksWalked: 0, playedTicks: 0, reachedFullTime: 0, signature: '',
  };
  r.genesOnAllViews = genesOnAllViews(m) ? 1 : 0;
  r.leadGeneOnAllViews = leadGeneOnAllViews(m) ? 1 : 0;

  /* ===== ⭐ THE DELIVERED LEAD, READ AT THE STRIKE — the PTP seam's own "dose ≠ delivered"
   * =====
   * `performPass` is WRAPPED on the instance (the PTP-T0 chosen-pass smoke's idiom, itself the
   * o1PassWindup test's): every chosen pass is recorded together with the FIFTH ARGUMENT the
   * brain handed the strike — the chooser's OWN priced displacement. The original is always
   * called, with its arguments untouched and in order.
   *
   * ⭐ PURE OBSERVATION, ZERO PERCEPT PULLS, BY DESIGN. This wrapper reads only the arguments of
   * a call that happens anyway plus two positions; it asks the seat NOTHING, so it cannot
   * advance any body's percept memory. That is the OBM-T1 rule kept exactly: the exam walk reads
   * only what is ALREADY computed, and every reading that needs a pull (the features, the two
   * score multipliers, and this stage's LAW CHECK on the delivered lead) lives in the separate
   * OBSERVATIONAL dose read on its own declared seed.
   *
   * ⭐ AND THE NON-PERTURBATION IS A RECEIPT, NOT A PROMISE: this wrapper is installed on EVERY
   * walked match INCLUDING the six receipt walks, so G-REPRO-OBMT1 / G-REPRO-CTBT1 / G-REPRO-O2T1
   * / G-REPRO-173 / G-REPRO-GGC reproduce their committed rows — whole-match SIGNATURE, rng
   * stream state inside — only if the wrapper changed nothing at all.
   *
   * ⚠ WHAT THE LEAD IS AND IS NOT (PTP-T0 §HONESTY 5, carried verbatim): the recorded vector is
   * the aim displacement the strike was HANDED, not the point the ball was struck at —
   * `performPass` COMPOSES it with the incumbent strike-time correction it has always applied
   * (`struck = struckLead + ptpLead`), so the struck point sits BEYOND the priced aim. */
  const origPerformPass = m.performPass.bind(m);
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    r.passesChosen += 1;
    if (mate.action.type === 'SupportBallCarrier') r.passesToSupportTarget += 1;
    /** ⭐ THE SITUATIONAL PROFILE, taken at the instant of the strike and nowhere else: was the
     *  CARRIER under pressure when he chose? The test is the #173 census's own — the nearest
     *  opponent inside `TOUCH_CONTROL_DIST` — read off truth positions that this walk already
     *  reads for rulers 2/3/4, so it costs no percept pull and cannot perturb anything. */
    const pressedNow = nearestOpponent(m, p) <= PRESSURE_R;
    if (ptpLead !== null && Math.hypot(ptpLead.x, ptpLead.y) > 0) {
      if (pressedNow) r.ledAtPressed += 1; else r.ledAtUnpressed += 1;
    } else if (pressedNow) r.feetAtPressed += 1; else r.feetAtUnpressed += 1;
    if (ptpLead !== null) {
      r.ptpLedHandled += 1;
      const mag = Math.hypot(ptpLead.x, ptpLead.y);
      if (mag > 0) {
        r.ptpLedNonZero += 1;
        r.ptpLeadSum += mag;
        if (mag > r.ptpLeadMax) r.ptpLeadMax = mag;
        const d = dist(p.pos, mate.pos);
        r.ptpLeadShareOfDistSum += d > 0 ? mag / d : 0;
      }
    }
    origPerformPass(p, mate, offsideExempt, powerChoice, ptpLead);
  };

  /** the short-option predicate (ruler 3), asked of the CARRIER */
  const shortOptionFor = (carrier: Player): boolean => {
    const t = m.teams[carrier.side];
    const radius = supportRadiusOf(t.genome);
    return t.players.some((p) => p.gid !== carrier.gid && p.role !== 'GK' && !p.sentOff
      && dist(p.pos, carrier.pos) <= radius);
  };

  /* ===== ruler 5: THE #218 LIFT — the census's segment/origin machinery, PORTED =====
   * ⚠ THE LOSS-TICK SEMANTICS ARE THE CENSUS'S OWN (#215.3-H1/M2), carried verbatim: an
   * open-play regain is classified on the ball's position at the PREVIOUS segment's LAST
   * OWNED tick, mirrored into the WINNER's frame (localX_winner = −localX_loser); the
   * REGAIN-tick reading rides beside it as the declared cross-cut. */
  const ggSegs: GgSegment[] = [];
  const ggGoalRecs: GgGoalRec[] = [];
  let ggCur: GgSegment | null = null;
  let ggPrevSeg: GgSegment | null = null;
  const ggPrevCompleted: [number, number] = [m.teams[0].stats.passesCompleted, m.teams[1].stats.passesCompleted];
  const ggPrevScore: [number, number] = [m.score[0], m.score[1]];
  let ggSinceDeadBall = true;   // the match opens from a kickoff
  let ggContestedSinceLastSeg = false;

  const ggClose = (s: GgSegment, terminator: GgSegment['terminator'], scoringSide: Side | null): void => {
    s.terminator = terminator;
    s.goalScoringSide = scoringSide;
    const last = ggSegs.length === 0 ? null : ggSegs[ggSegs.length - 1];
    if (last !== null && s.startTick <= last.startTick) r.ggSpanOrderViolations += 1;
    ggSegs.push(s);
    ggPrevSeg = s;
  };
  const ggOpenPlayClass = (contested: boolean, t: Third): OriginClass => (contested ? 'scrambleLooseBall'
    : t === 'own' ? 'turnoverWonInOwnThird'
      : t === 'final' ? 'turnoverWonInFinalThird' : 'turnoverWonInMiddleThird');
  const ggOpen = (side: Side, tick: number, ownerGid: number): GgSegment => {
    let origin: OriginClass;
    let lossThird: Third | null = null;
    let regainThird: Third | null = null;
    let regainContested = false;
    let regainSpotClass: OriginClass | null = null;
    if (m.kickoffKickGid === ownerGid) origin = 'kickoff';
    else if (m.restartKickGid === ownerGid) {
      const k = m.restartKickKind;
      origin = k === 'corner' ? 'setPieceCorner'
        : k === 'freeKick' ? 'setPieceFreeKick'
          : k === 'penalty' ? 'setPiecePenalty'
            : k === 'goalKick' ? 'goalKick'
              : k === 'kickIn' ? 'kickIn' : 'restartSecondBall';
    } else if (ggSinceDeadBall) origin = 'restartSecondBall';
    else if (ggPrevSeg === null) origin = 'matchOpenFallback';
    else {
      const lost = ggPrevSeg.lossLocalXLoserFrame;
      const regained = ggPrevSeg.regainSpotLocalXLoserFrame;
      lossThird = ggThirdOf(lost === null ? 0 : -lost);
      regainThird = ggThirdOf(regained === null ? 0 : -regained);
      regainContested = ggContestedSinceLastSeg;
      origin = ggOpenPlayClass(ggContestedSinceLastSeg, lossThird);
      regainSpotClass = ggOpenPlayClass(ggContestedSinceLastSeg, regainThird);
    }
    return {
      team: side, origin, originAtRegainSpot: regainSpotClass ?? origin,
      startTick: tick, lastOwnedTick: tick, assignedTicks: 0, completedPasses: 0,
      terminator: 'matchEnd', lastOwnedLocalXOwnerFrame: m.teams[side].localX(m.ball.pos.x),
      lossLocalXLoserFrame: null, regainSpotLocalXLoserFrame: null,
      lossThird, regainThird, regainContested, goalScoringSide: null,
    };
  };
  const ggGoalOf = (s: GgSegment): GgGoalRec => ({
    origin: s.origin, originAtRegainSpot: s.originAtRegainSpot, family: ggFamilyOf(s.origin),
    lossThird: s.lossThird, completedPasses: s.completedPasses,
  });
  /** ONE genealogy tick, run immediately after `m.step(DT)` — the census's own loop body, with
   *  its `continue`s expressed as `return` so this exam's other instruments are untouched. */
  const ggStep = (): void => {
    r.ggTotalTicks += 1;
    const tickNow = m.simTick;
    const phaseNow = m.phase;
    const ownerNow = m.ball.owner;
    let goalSide: Side | null = null;
    for (const s of [0, 1] as const) {
      if (m.score[s] > ggPrevScore[s]) {
        goalSide = s;
        r.ggGoalsFromScore += m.score[s] - ggPrevScore[s];
      }
      ggPrevScore[s] = m.score[s];
      const dCompleted = m.teams[s].stats.passesCompleted - ggPrevCompleted[s];
      if (dCompleted > 0 && ggCur !== null && ggCur.team === s) ggCur.completedPasses += dCompleted;
      ggPrevCompleted[s] = m.teams[s].stats.passesCompleted;
    }
    if (phaseNow !== 'playing') {
      r.ggDeadBallTicks += 1;
      if (ggCur !== null) {
        if (goalSide !== null) {
          ggClose(ggCur, 'goal', goalSide);
          ggGoalRecs.push(ggGoalOf(ggCur));
        } else ggClose(ggCur, 'deadBall', null);
        ggCur = null;
      } else if (goalSide !== null) r.ggUnattributedGoals += 1;
      ggSinceDeadBall = true;
      ggContestedSinceLastSeg = false;
      return;
    }
    if (m.possessionPhase.kind === 'contested') ggContestedSinceLastSeg = true;
    if (ownerNow === null) {
      if (ggCur !== null) { ggCur.assignedTicks += 1; r.ggSegmentTicks += 1; } else r.ggLooseGapTicks += 1;
      if (goalSide !== null && ggCur === null) r.ggUnattributedGoals += 1;
      return;
    }
    const side = ownerNow.side;
    if (ggCur !== null && ggCur.team !== side) {
      // ⭐ THE DEFINITIONAL LOSS SPOT: the LAST OWNED tick's ball position, loser's frame.
      const lossLocal = ggCur.lastOwnedLocalXOwnerFrame;
      const regainLocal = m.teams[ggCur.team].localX(m.ball.pos.x);
      ggCur.lossLocalXLoserFrame = lossLocal;
      ggCur.regainSpotLocalXLoserFrame = regainLocal;
      if (ggThirdOf(lossLocal) === 'own') r.ggOwnThirdTurnovers += 1;
      if (ggThirdOf(regainLocal) === 'own') r.ggOwnThirdTurnoversAtRegainSpot += 1;
      ggClose(ggCur, 'opponentControl', null);
      ggCur = null;
    }
    if (ggCur === null) {
      ggCur = ggOpen(side, tickNow, ownerNow.gid);
      ggSinceDeadBall = false;
      ggContestedSinceLastSeg = false;
    }
    const seg = ggCur;
    ggContestedSinceLastSeg = false;
    seg.assignedTicks += 1; r.ggSegmentTicks += 1;
    seg.lastOwnedTick = tickNow;
    seg.lastOwnedLocalXOwnerFrame = m.teams[side].localX(m.ball.pos.x);
  };

  while (!m.finished) {
    /* ============ ruler 1: the #186 sampling block, O2-T1 VERBATIM ============
     * ⚠ the sampling BUDGET stops at PER_MATCH_CAP; the WALK continues to full time so
     * the whole-match instruments exist. The sampled moment SET is bit-identical to the
     * O2-T1 walker's (G-REPRO-O2T1 proves it against the committed rows). */
    const owner: Player | null = m.ball.owner;
    const qualifies = inMatch < PER_MATCH_CAP && m.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      r.qualifying += 1;
      const gid = owner!.gid;
      const before = cloneSimulationState(m);
      if (owner!.firstTouchWindow > 0) {
        r.exFirstTouch += 1;
      } else if (m.restartKickGid === gid) {
        r.exMustKick += 1;
      } else {
        const decided = decidedActionOf(before, gid);
        if (decided === 'Shoot') {
          r.exShoot += 1;
        } else if (decided === 'ClearBall') {
          r.exClear += 1;
        } else {
          r.eligible += 1;
          const truth = trueCellOf(m, owner!);
          if (HOLDABLE_CELLS.includes(truth.key)) r.trueHoldable += 1;
        }
      }
      sinceLast = 0;
      inMatch += 1;
    }

    m.step(DT);
    tick += 1;
    r.ticksWalked += 1;
    sinceLast += 1;
    /* ⭐ ruler 5 runs BEFORE the full-time break, because the census's own loop processes every
     * stepped tick including the terminal one. Every other instrument below keeps its existing
     * early-break behaviour EXACTLY — this lift moves no previously measured number. */
    ggStep();
    if (m.finished) break;
    const phase = m.phase;
    const now = m.ball.owner;
    const nowGid = now === null ? null : now.gid;

    /* ============ ruler 2: the tempo-census spell/touch machinery ============ */
    if (phase !== 'playing') {
      curSpellOrigin = null; curSpellSide = null; curSpellTouches = 0;
      prevOwnerGid = null;
    } else {
      r.playedTicks += 1;
      if (now === null) {
        prevOwnerGid = null;
      } else {
        const side = now.side;
        if (curSpellSide !== null && curSpellSide !== side) {
          curSpellOrigin = null; curSpellSide = null; curSpellTouches = 0;
        }
        if (curSpellOrigin === null) {
          curSpellOrigin = m.kickoffKickGid === now.gid ? 'kickoff'
            : m.restartKickGid === now.gid ? 'restart' : 'openPlay';
          curSpellSide = side;
          curSpellTouches = 0;
          if (curSpellOrigin === 'openPlay') r.spellsOpenPlay += 1;
        }
        if (nowGid !== prevOwnerGid) {
          // a NEW ownership episode = a TOUCH (reception / re-collect / tackle-win)
          const isFirstOfSpell = curSpellTouches === 0;
          curSpellTouches += 1;
          if (isFirstOfSpell && curSpellOrigin === 'openPlay') {
            // ⭐ THE #173 POPULATION, VERBATIM: the FIRST reception of each openPlay-origin
            // spell, EVERY role included (the census's touch record excludes none). Rulers
            // 3b/4b are read on this SAME population so their shares are commensurable with
            // the inherited denominator.
            const pressed = nearestOpponent(m, now) <= PRESSURE_R;
            const short = shortOptionFor(now);
            r.firstRecOpen += 1;
            if (pressed) r.firstRecOpenPressed += 1;
            if (short) r.firstRecShort += 1;
            if (pressed && short) r.firstRecPressedShort += 1;
          }
        }
        prevOwnerGid = nowGid;

        /* ===== rulers 3 + 4 at POSSESSION-TICK grain =====
         * DECLARED: a GK carrier is excluded at THIS grain (a keeper holding the ball is
         * not the check-to-ball question, and it is the #186 eligibility's own role rule).
         * The first-reception grain above keeps EVERY role, because its denominator is the
         * inherited #173 population. Both choices are stated, neither is silent. */
        if (now.role !== 'GK' && !now.sentOff) {
          r.possTicks += 1;
          const short = shortOptionFor(now);
          const pressed = nearestOpponent(m, now) <= PRESSURE_R;
          if (short) r.possTicksShort += 1;
          if (pressed) r.possTicksPressed += 1;
          if (pressed && short) r.possTicksPressedShort += 1;
        }
      }
    }

    /* ===== G-ARM + the DELIVERED dose: the seam, read WHERE IT IS CONSUMED =====
     * ⭐ PURE READ, NO PERCEPT PULL. The executor's own two statements are replayed here:
     * the incumbent point `supportSpot(p, t, ball, match.ctbSupportPlane === false)`, then
     * `supportSpotOnObmPlane(...)` if and only if `match.obmPlaneFor(p)` is non-null. Both
     * are pure geometry over state the brain ALREADY computed, so this instrument cannot
     * perturb the world it measures — the seat's percept pull happens in the brain, at the
     * brain's cadence, exactly once, and nothing here asks for a second one. (The FEATURE
     * and SCORE-MULTIPLIER distributions need a pull and therefore live in the separate
     * OBSERVATIONAL delivered-dose read, §6c, on its own declared seed.) */
    if (phase === 'playing') {
      for (const t of m.teams) {
        for (const p of t.players) {
          if (p.action.type !== 'SupportBallCarrier' || p.sentOff) continue;
          r.supportTicks += 1;
          const base = supportSpot(p, t, m.ball);
          const plane: ObmPlane | null = armedFlag ? m.obmPlaneFor(p) : null;
          const got = plane === null ? base : supportSpotOnObmPlane(p, t, m.ball, plane);
          const shift = Math.hypot(got.x - base.x, got.y - base.y);
          const planeZero = plane !== null && plane.depth === 0 && plane.width === 0;
          if (plane === null) r.supportTicksPlaneAbsent += 1;
          else {
            r.supportTicksPlanePresent += 1;
            r.planeDepthSum += plane.depth;
            r.planeWidthSum += plane.width;
            r.planeDepthAbsSum += Math.abs(plane.depth);
            r.planeWidthAbsSum += Math.abs(plane.width);
            // ⭐ ZERO IS SILENCE (#228.6): a body whose four features ALL read zero — the
            // no-policy point, whose commonest cause is that this arm's own driving feature is
            // zero at this moment, not blindness — has a plane of exactly (0,0) and must not
            // move by one bit. Counted as its own class, never folded into "the seam did
            // nothing".
            if (planeZero) {
              r.supportTicksPlaneZero += 1;
              if (shift !== 0) r.supportTicksZeroPlaneMoved += 1;
            }
          }
          if (shift > 0) r.supportTicksShifted += 1;
          if (shift >= 1) r.supportShiftGe1 += 1;
          r.supportShiftSum += shift;
          r.supportShiftMax = Math.max(r.supportShiftMax, shift);
          if ((got.x - m.ball.pos.x) * t.attackDir < 0) r.supportBehindBall += 1;
          // ⭐ CLAMP SATURATION (#224.4(ii), inherited): the INCUMBENT pitch clamps, priced
          // by recomputing the PRE-CLAMP expression exactly as `supportSpotDeformed` builds
          // it. Saturation is part of the delivered dose, not slop.
          const g = t.genome;
          const radius = supportRadiusOf(g);
          const bias = t.mode === 'CounterAttack' || t.mode === 'Attack' ? 0.75 : 0.35;
          const depthShift = plane === null ? 0 : plane.depth * CTB_DEPTH_BIAS_SPAN;
          const widthScale = plane === null ? 1 : 1 + plane.width;
          const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;
          const lane = formationSpot(p, t, m.ball, true);
          const preX = m.ball.pos.x + t.attackDir * radius * (bias + depthShift);
          const preY = m.ball.pos.y
            + clamp((lane.y - m.ball.pos.y) * SUPPORT_LAT_PULL * widthScale, -maxLat, maxLat);
          if (Math.abs(preX) > HALF_L - 2) r.clampXBound += 1;
          if (Math.abs(preY) > HALF_W - 2) r.clampYBound += 1;
          // ⚠ THE ACCOUNTING RULE, INHERITED AND RE-CUT FOR THIS SEAT (stated, not smuggled):
          // a tick whose plane is PRESENT and NON-ZERO can fail to move only where the
          // INCUMBENT pitch clamp pins two genuinely different pre-clamp values to the SAME
          // bound. The two OTHER ways an armed tick can fail to move are counted in their own
          // classes above and are NOT clamp saturation: `planeAbsent` (this body has not
          // decided inside `OBM_POLICY_TTL_TICKS` — the cadence cap doing its job) and
          // `planeZero` (ZERO IS SILENCE — he perceived nobody, so the policy is the
          // no-policy point). The four classes partition `supportTicks` exactly, and that
          // partition is a gate row rather than a claim.
          if (shift === 0 && plane !== null && !planeZero) {
            const maxLat0 = radius * SUPPORT_LAT_CAP_FRAC;
            const preX0 = m.ball.pos.x + t.attackDir * radius * bias;
            const preY0 = m.ball.pos.y
              + clamp((lane.y - m.ball.pos.y) * SUPPORT_LAT_PULL, -maxLat0, maxLat0);
            const xGenuine = preX0 !== preX && Math.abs(preX0) > HALF_L - 2
              && Math.abs(preX) > HALF_L - 2 && Math.sign(preX0) === Math.sign(preX);
            const yGenuine = preY0 !== preY && Math.abs(preY0) > HALF_W - 2
              && Math.abs(preY) > HALF_W - 2 && Math.sign(preY0) === Math.sign(preY);
            const xPinned = preX0 === preX || xGenuine;
            const yPinned = preY0 === preY || yGenuine;
            if (xPinned && yPinned && (xGenuine || yGenuine)) {
              r.supportTicksUnshiftedClampBound += 1;
            }
          }
        }
      }
    }

    /* ============ the whole-match GUARDS (PM-T1 P3′ / B1-a forms) ============ */
    if (tick % SAMPLE_EVERY !== 0 || phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      const hasBall = m.possessionSide === side;
      (hasBall ? spreadIn : spreadOut)[side].push(sd(outfield.map((p) => p.pos.y)));
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) pairs[side].push(dist(outfield[i].pos, outfield[j].pos));
        }
      }
    }
  }

  /* --- ruler 5: close the open segment and fold the per-match genealogy rows --- */
  if (ggCur !== null) { ggClose(ggCur, 'matchEnd', null); ggCur = null; }
  r.ggSegments = ggSegs.length;
  r.ggGoals = ggGoalRecs;
  for (const s of ggSegs) {
    r.ggSegmentsByOrigin[s.origin] += 1;
    r.ggSegmentsByOriginAtRegainSpot[s.originAtRegainSpot] += 1;
    r.ggAssignedTicksSum += s.assignedTicks;
    if (s.terminator === 'opponentControl') r.ggTurnoversTotal += 1;
  }

  const bothPairs = [...pairs[0], ...pairs[1]];
  r.spreadYOut = mean([...spreadOut[0], ...spreadOut[1]]);
  r.spreadYIn = mean([...spreadIn[0], ...spreadIn[1]]);
  r.spacingMedian = quantile(bothPairs, 0.5);
  r.spacingUnder4 = bothPairs.length === 0 ? Number.NaN
    : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length;
  const st = [m.teams[0].stats, m.teams[1].stats];
  r.interceptions = st[0].interceptions + st[1].interceptions;
  r.offsides = st[0].offsides + st[1].offsides;
  r.fouls = st[0].fouls + st[1].fouls;
  r.penalties = st[0].penalties + st[1].penalties;
  r.goals = st[0].goals + st[1].goals;
  r.crosses = st[0].crosses + st[1].crosses;
  r.headers = st[0].headersWon + st[1].headersWon;
  r.longBalls = st[0].longBalls + st[1].longBalls;
  r.cutbacks = st[0].cutbacks + st[1].cutbacks;
  r.reachedFullTime = m.finished ? 1 : 0;
  /** ⭐ THE SEAT REACHED, read at the SOURCE: the size of the match's own policy cache — the
   *  map `Match.setObmPolicy` writes to, and the ONLY thing that writes to it is the single
   *  `obmMovement` fork in `PlayerBrain.decideOffBall`. Non-zero ⇒ the brain entered the
   *  fork and wrote a policy. Read-only introspection of a private field, declared here
   *  rather than hidden; it changes nothing and is used only as a G-ARM receipt. */
  r.policyCacheEntries = (m as unknown as { obmPolicies: Map<number, unknown> }).obmPolicies.size;
  r.signature = signatureOf(m);
  return r;
};

/* ========================================================================== */
/* §6c THE DELIVERED-DOSE READ — OBSERVATIONAL, on its own declared seed       */
/* ========================================================================== */
/**
 * ⭐ WHAT THE ARM ACTUALLY DELIVERS, per arm: the FEATURE distribution the bodies really
 * read, the four outputs those features produce under THIS arm's matrix, the composed plane,
 * and the two SCORE MULTIPLIERS — which exist nowhere in the match state (the brain computes
 * them, applies them and drops them), so they can only be read by asking the seat again.
 *
 * ⚠ WHY THIS IS NOT IN THE EXAM WALK, declared: asking the seat again means calling
 * `match.perceivedSnapshot(p)`, which ADVANCES that body's percept memory. Inside an exam arm
 * that would be an intervention wearing an instrument's clothes. So this read runs on its own
 * declared seed, ONE match per arm, and its numbers are DESCRIPTIVE ONLY: no gate hangs on
 * any level here, no CI is computed, and none of it enters the paired estimator. The gate
 * that DOES read it is G-BLIND-WORLD, and only for the non-degeneracy of the percept trunk
 * (are there snapshots, are there perceived opponents, are the features non-zero) — a
 * property of the WORLD, which every arm shares.
 *
 * The sampling law is the OBM-T0 policy-geometry read's, verbatim: every 15 playing ticks,
 * every outfielder of both teams, the anchor being the point the body would take with the
 * seat absent under this world's flag state (`supportSpot(p, t, ball, m.ctbSupportPlane)`).
 */
const SAMPLE_EVERY_DOSE = 15;
const doseRead = (arm: ArmName) => {
  const m = matchOf(DOSE_READ_SEED, arm);
  /* ===== ⭐ THE LEAD LAW, CHECKED ON THE PASSES ACTUALLY CHOSEN (PTP-T0 G-BITE's second half,
   * ===== lifted into THIS stage's observational block because it needs a PERCEPT PULL).
   * For every chosen pass that was handed a lead, the delivered displacement is compared to an
   * INDEPENDENT re-derivation from the frozen law — `weight · |motion| · flight · MUL`, with the
   * motion taken from the seat's own world-appropriate source and the flight from the
   * through-ball loop's own divisor — and its SIGN is required to point ALONG that motion.
   * ⚠ THE PULL IS WHY THIS LIVES HERE: `passLeadSeatOf` calls `match.perceivedSnapshot(p)` in a
   * percept world, which ADVANCES that body's percept memory. Inside an exam arm that would be
   * an intervention wearing an instrument's clothes (the OBM-T1 rule, kept). Here it perturbs
   * only THIS observational match, whose numbers are DESCRIPTIVE and enter no rate, no CI and no
   * exam row. */
  const geneHere = GENE[arm];
  let leadChecked = 0;
  let leadSignViolations = 0;
  let leadMagnitudeViolations = 0;
  let leadModuleChecked = 0;
  let leadModuleDisagreements = 0;
  const origPass = m.performPass.bind(m);
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    if (ptpLead !== null && geneHere !== null) {
      const t = m.teams[p.side];
      /** ⭐ THE SEAT IS BUILT THROUGH THIS ARM'S OWN DOOR, not through a convenient one: a
       *  CONTEST arm re-derives through `deliveryChoiceSeatOf` (this stage's arming rule —
       *  gene-absent ⇒ null ⇒ no candidate) and the ANCHOR arm through the banked
       *  `passLeadSeatOf`. Both delegate to the same projection, which is the point: the law
       *  being checked is one law, reached by two doors. */
      const seat = DOOR[arm] === 'dlc'
        ? deliveryChoiceSeatOf(p, m, t.genome, m.edsPerceivedChoice)
        : passLeadSeatOf(p, m, t.genome, m.edsPerceivedChoice);
      if (seat === null) { origPass(p, mate, offsideExempt, powerChoice, ptpLead); return; }
      leadChecked += 1;
      const motion = passLeadMotion(seat, mate);
      const flight = dist(p.pos, mate.pos) / PTP_FLIGHT_SPEED;
      const want = geneHere * Math.hypot(motion.x, motion.y) * flight * PTP_LEAD_FLIGHT_MUL
        * (mate.action.type === 'SupportBallCarrier' ? 1 : 0);
      const mag = Math.hypot(ptpLead.x, ptpLead.y);
      if (Math.abs(mag - want) > 1e-9) leadMagnitudeViolations += 1;
      if (mag > 1e-9 && (ptpLead.x * motion.x + ptpLead.y * motion.y) <= 0) leadSignViolations += 1;
      /** ⭐ REPORTED, NOT A GATE: the same displacement re-derived through THIS stage's OWN
       *  module (`ledDelivery`, the contest's led candidate) rather than through the law's
       *  algebra. It is deliberately NOT a gate predicate: re-deriving needs a percept PULL,
       *  which advances this body's memory, so an exact mismatch would be an artefact of the
       *  instrument as easily as a defect of the seam. Published as a count. */
      if (DOOR[arm] === 'dlc') {
        const viaSeam = ledDelivery(seat, p.pos, mate).lead;
        leadModuleChecked += 1;
        if (viaSeam.x !== ptpLead.x || viaSeam.y !== ptpLead.y) leadModuleDisagreements += 1;
      }
    }
    origPass(p, mate, offsideExempt, powerChoice, ptpLead);
  };
  const nF = OBM_FEATURE_KEYS.length;
  const nO = OBM_OUTPUT_KEYS.length;
  const featureSums = new Array<number>(nF).fill(0);
  const outputSums = new Array<number>(nO).fill(0);
  const supportMuls: number[] = [];
  const runMuls: number[] = [];
  const depths: number[] = [];
  const widths: number[] = [];
  let samples = 0;
  let sawSnapshot = 0;
  let someFeatureNonZero = 0;
  let allFeaturesZero = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % SAMPLE_EVERY_DOSE !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff || p.role === 'GK') continue;
        const anchor = supportSpot(p, t, m.ball, m.ctbSupportPlane);
        const policy = obmOffballPolicy(p, m, t.genome, anchor, m.ctbSupportPlane);
        samples += 1;
        if (policy.sawSnapshot) sawSnapshot += 1;
        // ⚠ NAMED FOR WHAT IT MEASURES (the pre-battery correction): this counts samples where
        // AT LEAST ONE of the four features is non-zero — it is NOT "he perceived an opponent".
        // All four features can read exactly zero WITH opponents present (every one of them
        // beyond the feature's radius, or the readings fresh enough that f4 is 0), so the
        // complement `allFeaturesZeroShare` is an UPPER BOUND on genuine blindness, never a
        // measurement of it.
        if (policy.features.some((f) => f !== 0)) someFeatureNonZero += 1;
        else allFeaturesZero += 1;
        for (let k = 0; k < nF; k++) featureSums[k] += policy.features[k];
        for (let o = 0; o < nO; o++) outputSums[o] += policy.outputs[o];
        depths.push(policy.plane.depth);
        widths.push(policy.plane.width);
        supportMuls.push(policy.supportMul);
        runMuls.push(policy.runMul);
      }
    }
  }
  const n = Math.max(1, samples);
  const dist5 = (xs: number[]) => ({
    mean: round(mean(xs), 5), p05: round(quantile(xs, 0.05), 5), p50: round(quantile(xs, 0.5), 5),
    p95: round(quantile(xs, 0.95), 5),
    min: round(xs.length === 0 ? Number.NaN : Math.min(...xs), 5),
    max: round(xs.length === 0 ? Number.NaN : Math.max(...xs), 5),
  });
  return {
    seed: DOSE_READ_SEED,
    samples,
    sampleLaw: `every ${SAMPLE_EVERY_DOSE} playing ticks, every outfielder of BOTH teams`,
    matrix: DOSE[arm],
    featureKeys: OBM_FEATURE_KEYS,
    outputKeys: OBM_OUTPUT_KEYS,
    featureMeans: featureSums.map((v) => round(v / n, 5)),
    outputMeans: outputSums.map((v) => round(v / n, 5)),
    planeDepth: dist5(depths),
    planeWidth: dist5(widths),
    supportMul: dist5(supportMuls),
    runMul: dist5(runMuls),
    sawSnapshotShare: round(sawSnapshot / n, 5),
    someFeatureNonZeroShare: round(someFeatureNonZero / n, 5),
    allFeaturesZeroShare: round(allFeaturesZero / n, 5),
    scoreSpan: OBM_SCORE_SPAN,
    /* ⭐ the SECOND seam's dose + its law check on the passes actually chosen */
    leadGene: geneHere,
    leadChecked,
    leadSignViolations,
    leadMagnitudeViolations,
    leadModuleChecked,
    leadModuleDisagreements,
    leadLawNote: '⭐ THE FROZEN LEAD LAW, RE-DERIVED INDEPENDENTLY on every chosen pass the '
      + 'strike was handed a lead for: |lead| must equal `gene · |motion| · flight · '
      + `${PTP_LEAD_FLIGHT_MUL}` + ' with `flight = dist / ' + `${PTP_FLIGHT_SPEED}` + '` (the '
      + 'through-ball loop\'s OWN divisor, PTP-T0 §LAW), it must point ALONG that motion, and it '
      + 'must be EXACTLY zero for a non-support target. The motion is taken from the seat\'s own '
      + 'world-appropriate source, so in this percept-armed world it is the REMEMBERED velocity '
      + '— which is exactly why the delivered channel is THIN (#232.3).',
    note: 'DESCRIPTIVE ONLY, on ONE observational match per arm at the DECLARED dose-read '
      + 'seed. The percept pulls here perturb THIS match and no other; no exam row, no CI and '
      + 'no gate level is computed from it. ⭐ `someFeatureNonZeroShare` counts samples where AT '
      + 'LEAST ONE of the four features is non-zero — RENAMED from `sawPerceivedOpponentShare`, '
      + 'which claimed more than it measured. Its complement `allFeaturesZeroShare` is the '
      + 'ZERO-IS-SILENCE share and is an UPPER BOUND on genuine blindness, NOT a measurement of '
      + 'it: all four features also read exactly zero with opponents PRESENT (every one of them '
      + 'beyond the feature\'s own radius, or the body\'s readings fresh enough that f4 is 0). '
      + 'What it does license is the direction the gate needs — a body whose features are all '
      + 'zero has the no-policy point, and that class is small.',
  };
};

/* ========================================================================== */
/* §8 SUMMARIES + the paired per-seed cluster bootstrap                        */
/* ========================================================================== */
const RATE_KEYS = [
  'trueHoldableShare', 'pressedFirstReceptionShare',
  'shortOptionPossShare', 'shortOptionFirstRecShare',
  'supportAtPressedPossShare', 'supportAtPressedFirstRecShare',
  'interceptionsPerMatch', 'offsidesPerMatch', 'foulsPerMatch', 'goalsPerMatch',
  'spreadYOut', 'spreadYIn', 'spacingMedian', 'spacingUnder4',
  'clampXShare', 'clampYShare', 'behindBallShare', 'meanShiftM',
  /* ⭐ the SECOND seam's delivered-channel columns (REPORTED; no gate reads a CI of them) */
  'ledPassShare', 'meanLeadMetres', 'interceptionsPerLedPass',
  /* ⭐ ruler 5 — the #218 ARC RULER's own named shares, carried into the SAME paired
   * seed-cluster bootstrap as everything else, so the battery reads them with CIs, paired
   * deltas and mechanical `resolved` flags instead of bare per-arm counts.
   * ⚠ THEY STAY REPORTED: no gate reads any of them, the pre-registered §SUCCESS set and the
   * frozen F-DLC-a/b/c STOP set are UNCHANGED, and `resolved` here is the same mechanical CI
   * flag it is everywhere else (#203) — never a verdict. Per #218 the arc-grain question is
   * whether these shares MOVE, and that is the commander's to read. */
  'constructedGe3Share', 'constructedGe4Share', 'constructedGe5Share',
  'scrambleShareOfGoals', 'setPieceShareOfGoals',
] as const;
type RateKey = typeof RATE_KEYS[number];
/** the construction ladder's numerator/denominator on the NON-SET-PIECE pool, summed over rows */
const ggPool = (rows: readonly PerMatch[], k: number): { num: number; den: number } => {
  let num = 0; let den = 0;
  for (const r of rows) {
    for (const g of r.ggGoals) {
      if (g.family === 'setPiece') continue;
      den += 1;
      if (g.completedPasses >= k) num += 1;
    }
  }
  return { num, den };
};
const rateOf = (rows: readonly PerMatch[], key: RateKey): number => {
  const s = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  const n = Math.max(1, rows.length);
  const finiteMean = (f: (r: PerMatch) => number): number => {
    const xs = rows.map(f).filter(Number.isFinite);
    return xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length;
  };
  switch (key) {
    case 'trueHoldableShare': return s((r) => r.trueHoldable) / Math.max(1, s((r) => r.eligible));
    case 'pressedFirstReceptionShare': return s((r) => r.firstRecOpenPressed) / Math.max(1, s((r) => r.firstRecOpen));
    case 'shortOptionPossShare': return s((r) => r.possTicksShort) / Math.max(1, s((r) => r.possTicks));
    case 'shortOptionFirstRecShare': return s((r) => r.firstRecShort) / Math.max(1, s((r) => r.firstRecOpen));
    case 'supportAtPressedPossShare': return s((r) => r.possTicksPressedShort) / Math.max(1, s((r) => r.possTicksPressed));
    case 'supportAtPressedFirstRecShare': return s((r) => r.firstRecPressedShort) / Math.max(1, s((r) => r.firstRecOpenPressed));
    case 'interceptionsPerMatch': return s((r) => r.interceptions) / n;
    case 'offsidesPerMatch': return s((r) => r.offsides) / n;
    case 'foulsPerMatch': return s((r) => r.fouls) / n;
    case 'goalsPerMatch': return s((r) => r.goals) / n;
    case 'spreadYOut': return finiteMean((r) => r.spreadYOut);
    case 'spreadYIn': return finiteMean((r) => r.spreadYIn);
    case 'spacingMedian': return finiteMean((r) => r.spacingMedian);
    case 'spacingUnder4': return finiteMean((r) => r.spacingUnder4);
    case 'clampXShare': return s((r) => r.clampXBound) / Math.max(1, s((r) => r.supportTicks));
    case 'clampYShare': return s((r) => r.clampYBound) / Math.max(1, s((r) => r.supportTicks));
    case 'behindBallShare': return s((r) => r.supportBehindBall) / Math.max(1, s((r) => r.supportTicks));
    case 'meanShiftM': return s((r) => r.supportShiftSum) / Math.max(1, s((r) => r.supportTicks));
    /* ⭐ the SECOND seam, ratio-of-totals like everything else */
    case 'ledPassShare': return s((r) => r.ptpLedNonZero) / Math.max(1, s((r) => r.passesChosen));
    case 'meanLeadMetres': return s((r) => r.ptpLeadSum) / Math.max(1, s((r) => r.ptpLedNonZero));
    /** ⚠ NOT max(1, ·): an arm with NO led passes has NO such ratio, and clamping the
     *  denominator would publish the arm's whole interception count as if it were a per-led-pass
     *  rate (the first smoke cut printed 350). NaN ⇒ the bootstrap's finite filter drops it, the
     *  CI is non-finite and `resolved` is false — the honest reading of "undefined here". */
    case 'interceptionsPerLedPass': {
      const led = s((r) => r.ptpLedNonZero);
      return led === 0 ? Number.NaN : s((r) => r.interceptions) / led;
    }
    /* ruler 5 — RATIO-OF-TOTALS, exactly like every other share above: the numerator and the
     * denominator are each summed over the resampled seed set, then divided. The construction
     * ladder is read on the NON-SET-PIECE pool (the census's own primary pool); the scramble
     * and set-piece shares are read on ALL goals. */
    case 'constructedGe3Share': return ggPool(rows, 3).num / Math.max(1, ggPool(rows, 3).den);
    case 'constructedGe4Share': return ggPool(rows, 4).num / Math.max(1, ggPool(rows, 4).den);
    case 'constructedGe5Share': return ggPool(rows, 5).num / Math.max(1, ggPool(rows, 5).den);
    case 'scrambleShareOfGoals':
      return s((r) => r.ggGoals.filter((g) => g.origin === 'scrambleLooseBall').length)
        / Math.max(1, s((r) => r.ggGoals.length));
    case 'setPieceShareOfGoals':
      return s((r) => r.ggGoals.filter((g) => g.family === 'setPiece').length)
        / Math.max(1, s((r) => r.ggGoals.length));
  }
};
const BAND_RATE: Record<BandKey, (r: PerMatch) => number> = {
  goals: (r) => r.goals, crosses: (r) => r.crosses, headers: (r) => r.headers,
  longBalls: (r) => r.longBalls, cutbacks: (r) => r.cutbacks,
};

/* --- ruler 5: the #218 LIFT's per-arm rows. DESCRIPTIVE (#203); NO gate reads them. ------ */
const ggShare = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 5);
const ggSummary = (rows: readonly PerMatch[]) => {
  const goals = rows.flatMap((r) => r.ggGoals);
  const n = goals.length;
  const counts = (pick: (g: GgGoalRec) => OriginClass): GgCounts => {
    const c = ggZeroCounts();
    for (const g of goals) c[pick(g)] += 1;
    return c;
  };
  const byOrigin = counts((g) => g.origin);
  const byOriginAtRegainSpot = counts((g) => g.originAtRegainSpot);
  const byFamily = {
    setPiece: goals.filter((g) => g.family === 'setPiece').length,
    restart: goals.filter((g) => g.family === 'restart').length,
    openPlay: goals.filter((g) => g.family === 'openPlay').length,
  };
  const ladderOn = (pool: readonly GgGoalRec[]) => ({
    pool: pool.length,
    ladder: Object.fromEntries(CONSTRUCTED_LADDER.map((k) => {
      const constructed = pool.filter((g) => g.completedPasses >= k).length;
      return [`ge${k}`, {
        threshold: k, constructed, transition: pool.length - constructed,
        constructedShareOfPool: ggShare(constructed, pool.length),
        constructedShareOfAllGoals: ggShare(constructed, n),
      }];
    })),
  });
  const segByOrigin = ggZeroCounts();
  const segByOriginAtRegain = ggZeroCounts();
  for (const r of rows) {
    for (const o of GG_ORIGIN_CLASSES) {
      segByOrigin[o] += r.ggSegmentsByOrigin[o];
      segByOriginAtRegain[o] += r.ggSegmentsByOriginAtRegainSpot[o];
    }
  }
  const sm = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  const matches = Math.max(1, rows.length);
  const lossThirdCells: Record<string, number> = { own: 0, middle: 0, final: 0, notARegain: 0 };
  for (const g of goals) {
    if (g.lossThird === null) lossThirdCells.notARegain += 1; else lossThirdCells[g.lossThird] += 1;
  }
  return {
    provenance: '⭐ THE #218 LIFT: the goal-genealogy census\'s ORIGIN CLASSIFIER, ported from '
      + 'scripts/probes/goal-genealogy-census.ts with its LOSS-TICK semantics VERBATIM '
      + '(#215.3-H1/M2 — the by-third classes are cut on the ball at the previous segment\'s LAST '
      + 'OWNED tick, mirrored into the WINNER\'s frame; the REGAIN-tick reading rides beside it '
      + 'as the declared cross-cut). Gate: G-REPRO-GGC, which re-walks the census\'s OWN smoke '
      + 'block and must reproduce its committed PROD rows EXACTLY. The limbs this exam does not '
      + 'read (pass LOCATION, own-third chains, the danger-window ladder) are not lifted — the '
      + 'G-REPRO-173 precedent, and the gate is what proves the omission changes nothing on the '
      + 'columns that ARE read.',
    status: 'REPORTED, at BOTH smoke and battery grain. NO GATE HANGS ON ANY SHARE BELOW in T1; '
      + 'per #218 the arc-grain reading is whether the shares MOVE, and that is the commander\'s.',
    goals: n,
    goalsPerMatch: round(n / matches, 4),
    byOrigin,
    byOriginShare: Object.fromEntries(GG_ORIGIN_CLASSES.map((o) => [o, ggShare(byOrigin[o], n)])),
    byOriginAtRegainSpot,
    byFamily,
    byFamilyShare: {
      setPiece: ggShare(byFamily.setPiece, n),
      restart: ggShare(byFamily.restart, n),
      openPlay: ggShare(byFamily.openPlay, n),
    },
    scrambleShareOfGoals: ggShare(byOrigin.scrambleLooseBall, n),
    setPieceShareOfGoals: ggShare(byFamily.setPiece, n),
    turnoverByThirdOriginShares: {
      own: ggShare(byOrigin.turnoverWonInOwnThird, n),
      middle: ggShare(byOrigin.turnoverWonInMiddleThird, n),
      final: ggShare(byOrigin.turnoverWonInFinalThird, n),
      note: 'thirds are named in the WINNING team\'s attacking frame: turnoverWonInFinalThird = a '
        + 'HIGH regain = the ball was lost in the LOSER\'s own third (exact mirror).',
    },
    byLossThird: lossThirdCells,
    constructedLadder: {
      note: 'A REPORTING GRID (#214.1a), NOT a gate and NOT a tuned N: constructed(k) = a goal '
        + 'whose segment completed ≥ k passes, at every k ∈ {3,4,5}, on TWO pools.',
      nonSetPiece: ladderOn(goals.filter((g) => g.family !== 'setPiece')),
      openPlayOriginOnly: ladderOn(goals.filter((g) => g.family === 'openPlay')),
    },
    segmentPopulation: {
      segments: sm((r) => r.ggSegments),
      segmentsPerMatch: round(sm((r) => r.ggSegments) / matches, 4),
      byOrigin: segByOrigin,
      byOriginAtRegainSpot: segByOriginAtRegain,
    },
    turnovers: {
      total: sm((r) => r.ggTurnoversTotal),
      ownThird: sm((r) => r.ggOwnThirdTurnovers),
      ownThirdAtRegainSpot: sm((r) => r.ggOwnThirdTurnoversAtRegainSpot),
      ownThirdPerMatch: round(sm((r) => r.ggOwnThirdTurnovers) / matches, 4),
      ownThirdShareOfAllTurnovers: ggShare(sm((r) => r.ggOwnThirdTurnovers), sm((r) => r.ggTurnoversTotal)),
    },
    accounting: {
      totalTicks: sm((r) => r.ggTotalTicks),
      deadBallTicks: sm((r) => r.ggDeadBallTicks),
      segmentTicks: sm((r) => r.ggSegmentTicks),
      looseGapTicks: sm((r) => r.ggLooseGapTicks),
      assignedTicksSum: sm((r) => r.ggAssignedTicksSum),
      goalsFromScore: sm((r) => r.ggGoalsFromScore),
      goalsMappedToSegments: n,
      unattributedGoals: sm((r) => r.ggUnattributedGoals),
      spanOrderViolations: sm((r) => r.ggSpanOrderViolations),
    },
  };
};

const armSummary = (rows: PerMatch[]) => {
  const s = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  return {
    matches: rows.length,
    /* ruler 1 */
    ruler1TrueHoldable: {
      qualifyingTotal: s((r) => r.qualifying),
      eligibleTotal: s((r) => r.eligible),
      exclusions: {
        firstTouch: s((r) => r.exFirstTouch), mustKick: s((r) => r.exMustKick),
        a0Shoot: s((r) => r.exShoot), a0Clear: s((r) => r.exClear),
      },
      holdableCells: HOLDABLE_CELLS,
      trueHoldableTotal: s((r) => r.trueHoldable),
      shareOfEligible: round(rateOf(rows, 'trueHoldableShare')),
    },
    /* ruler 2 */
    ruler2PressedFirstReception: {
      openPlaySpells: s((r) => r.spellsOpenPlay),
      firstReceptions: s((r) => r.firstRecOpen),
      pressed: s((r) => r.firstRecOpenPressed),
      pressedShare: round(rateOf(rows, 'pressedFirstReceptionShare'), 5),
      radiusM: PRESSURE_R,
    },
    /* rulers 3 + 4 */
    ruler3ShortOptionSupply: {
      possessionTicks: s((r) => r.possTicks),
      possessionTicksWithShortOption: s((r) => r.possTicksShort),
      shareOfPossessionTicks: round(rateOf(rows, 'shortOptionPossShare')),
      firstReceptionsWithShortOption: s((r) => r.firstRecShort),
      shareOfFirstReceptions: round(rateOf(rows, 'shortOptionFirstRecShare')),
      radiusTrace,
    },
    ruler4SupportAtPressed: {
      pressedPossessionTicks: s((r) => r.possTicksPressed),
      pressedPossessionTicksWithShortOption: s((r) => r.possTicksPressedShort),
      shareOfPressedPossessionTicks: round(rateOf(rows, 'supportAtPressedPossShare')),
      pressedFirstReceptions: s((r) => r.firstRecOpenPressed),
      pressedFirstReceptionsWithShortOption: s((r) => r.firstRecPressedShort),
      shareOfPressedFirstReceptions: round(rateOf(rows, 'supportAtPressedFirstRecShare')),
    },
    /* ruler 5 — the #218 LIFT, REPORTED (no gate reads any of it) */
    ruler5BuildUp: {
      goalsTotal: s((r) => r.goals),
      goalsPerMatch: round(rateOf(rows, 'goalsPerMatch'), 4),
      genealogy: ggSummary(rows),
    },
    /* ⭐ the seam, reached — and the DELIVERED dose, read where the executor consumes it */
    seam: {
      supportTicks: s((r) => r.supportTicks),
      policyCacheEntries: s((r) => r.policyCacheEntries),
      planePresentTicks: s((r) => r.supportTicksPlanePresent),
      planeAbsentTicks: s((r) => r.supportTicksPlaneAbsent),
      planeZeroTicks: s((r) => r.supportTicksPlaneZero),
      supportTicksShifted: s((r) => r.supportTicksShifted),
      supportTicksUnshiftedClampBound: s((r) => r.supportTicksUnshiftedClampBound),
      zeroPlaneMovedTicks: s((r) => r.supportTicksZeroPlaneMoved),
      partitionExact: s((r) => r.supportTicks) === s((r) => r.supportTicksPlaneAbsent)
        + s((r) => r.supportTicksPlaneZero) + s((r) => r.supportTicksShifted)
        + s((r) => r.supportTicksUnshiftedClampBound),
      /* ⭐ THE DELIVERED DOSE (dose ≠ delivered — the CTB-T1 clamp lesson, generalised) */
      meanShiftMetres: round(rateOf(rows, 'meanShiftM'), 4),
      maxShiftMetres: round(Math.max(...rows.map((r) => r.supportShiftMax)), 4),
      shiftedShareOfSupportTicks: round(
        s((r) => r.supportTicksShifted) / Math.max(1, s((r) => r.supportTicks)), 5,
      ),
      shiftGe1mShareOfSupportTicks: round(
        s((r) => r.supportShiftGe1) / Math.max(1, s((r) => r.supportTicks)), 5,
      ),
      meanPlaneDepthOnPresent: round(
        s((r) => r.planeDepthSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      meanPlaneWidthOnPresent: round(
        s((r) => r.planeWidthSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      meanAbsPlaneDepthOnPresent: round(
        s((r) => r.planeDepthAbsSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      meanAbsPlaneWidthOnPresent: round(
        s((r) => r.planeWidthAbsSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      behindBallTicks: s((r) => r.supportBehindBall),
      behindBallShare: round(rateOf(rows, 'behindBallShare')),
      genesOnAllViewsSeeds: s((r) => r.genesOnAllViews),
      clampXBoundTicks: s((r) => r.clampXBound),
      clampXShare: round(rateOf(rows, 'clampXShare')),
      clampYBoundTicks: s((r) => r.clampYBound),
      clampYShare: round(rateOf(rows, 'clampYShare')),
      deliveredNote: '⭐ DOSE ≠ DELIVERED, published so it cannot be assumed away. The matrix '
        + 'is the DOSE; what the executor actually consumes is the composed PLANE, whose size '
        + 'is the mean of the WEIGHTED FEATURES — and the features are small on average '
        + '(#228.6: f1 0.184 · f2 0.456 · f3 0.216 · f4 0.171). The four support-tick classes '
        + 'partition exactly: SHIFTED · PLANE-ZERO · PLANE-ABSENT (no decision inside '
        + 'OBM_POLICY_TTL_TICKS — the cadence cap) · UNSHIFTED-CLAMP-BOUND (the INCUMBENT pitch '
        + 'clamp pinned both pre-clamp values to the same bound). ⭐ READ PLANE-ZERO CAREFULLY: '
        + 'it has THREE causes, and only one of them is blindness — (i) this arm doses no plane '
        + 'row at all (a SCORE-only corner moves no geometry BY CONSTRUCTION); (ii) this arm\'s '
        + 'own driving features read zero at that moment (for an f1 corner: the carrier is not '
        + 'perceived-pressed — the CONCENTRATION the hypothesis is about); (iii) genuine '
        + 'silence — nothing this body reads is non-zero — which the delivered-dose read BOUNDS '
        + 'FROM ABOVE as `allFeaturesZeroShare` (~1 % of samples; a ceiling, not a measurement, '
        + 'because four zero features also occur with opponents PRESENT beyond the feature '
        + 'radii). None of the four classes is slop and none of them is a gate on its own.',
      clampNote: 'CLAMP SATURATION (#224.4(ii)): the INCUMBENT pitch clamps ±(HALF_L−2) / '
        + '±(HALF_W−2) bind on real ticks. Published so the dose-response reads honestly.',
    },
    /* ⭐⭐ THE SECOND SEAM, DELIVERED — the THIN-CHANNEL VISIBILITY ROW (#232.3) */
    leadSeam: {
      leadGeneOnAllViewsSeeds: s((r) => r.leadGeneOnAllViews),
      passesChosen: s((r) => r.passesChosen),
      passesToSupportTarget: s((r) => r.passesToSupportTarget),
      ledPassesHandled: s((r) => r.ptpLedHandled),
      ledPassesNonZero: s((r) => r.ptpLedNonZero),
      ledShareOfChosenPasses: round(rateOf(rows, 'ledPassShare'), 5),
      meanLeadMetres: round(
        s((r) => r.ptpLeadSum) / Math.max(1, s((r) => r.ptpLedNonZero)), 4,
      ),
      maxLeadMetres: round(Math.max(...rows.map((r) => r.ptpLeadMax)), 4),
      meanLeadShareOfPassDistance: round(
        s((r) => r.ptpLeadShareOfDistSum) / Math.max(1, s((r) => r.ptpLedNonZero)), 5,
      ),
      /** ⭐ THE F-DLC-b NAMED RISK, made visible beside the (unchanged) interception guard. */
      interceptionsTotal: s((r) => r.interceptions),
      interceptionsPerLedPass: round(rateOf(rows, 'interceptionsPerLedPass'), 5),
      /** ⭐⭐ THE EMERGENT LED SHARE'S SITUATIONAL PROFILE — the REPORTED secondary headline.
       *  Four counters that partition `passesChosen` exactly: led/feet × the carrier PRESSED or
       *  UNPRESSED at the instant he struck. The number the retired dial fixed at 1 not only
       *  EMERGES here, it emerges DIFFERENTLY BY SITUATION — or it does not, and that is the
       *  reading. REPORTED: no gate and no success condition touches any of it. */
      situationalLedShare: {
        ledAtPressed: s((r) => r.ledAtPressed),
        ledAtUnpressed: s((r) => r.ledAtUnpressed),
        feetAtPressed: s((r) => r.feetAtPressed),
        feetAtUnpressed: s((r) => r.feetAtUnpressed),
        pressedTotal: s((r) => r.ledAtPressed) + s((r) => r.feetAtPressed),
        unpressedTotal: s((r) => r.ledAtUnpressed) + s((r) => r.feetAtUnpressed),
        ledShareAtPressed: round(s((r) => r.ledAtPressed)
          / Math.max(1, s((r) => r.ledAtPressed) + s((r) => r.feetAtPressed)), 5),
        ledShareAtUnpressed: round(s((r) => r.ledAtUnpressed)
          / Math.max(1, s((r) => r.ledAtUnpressed) + s((r) => r.feetAtUnpressed)), 5),
        partitionExact: s((r) => r.ledAtPressed) + s((r) => r.ledAtUnpressed)
          + s((r) => r.feetAtPressed) + s((r) => r.feetAtUnpressed) === s((r) => r.passesChosen),
        pressureTest: `the #173 census's OWN test: the nearest opponent within `
          + `${PRESSURE_R} m (TOUCH_CONTROL_DIST) of the CARRIER at the instant of the strike`,
        note: '⭐ REPORTED, CHEAP AND HONEST ABOUT ITS GRAIN. The bin is taken off TRUTH '
          + 'positions this walk already reads for rulers 2/3/4, so it costs no percept pull and '
          + 'perturbs nothing (G-ANCHOR is the receipt). It is a DESCRIPTION of when the chooser '
          + 'picked which ball — NOT a claim that pressure CAUSED the choice, and not a '
          + 'controlled contrast: pressed and unpressed moments differ in many ways besides '
          + 'pressure. Under the ANCHOR door the same four counters describe the FORCED dial '
          + 'instead, where by construction the "choice" is no choice at all — which is exactly '
          + 'what makes the two profiles worth printing side by side.',
      },
      deliveredLeadNote: '⭐⭐ DOSE ≠ DELIVERED ON THE PASSER\'S SIDE TOO, and here the gap is '
        + 'the STAGE\'S CENTRAL FACT rather than a caveat (#232.3). `ledPassesHandled` is a '
        + 'CODE-PATH receipt — the led strike is its OWN armed-only statement behind a guard '
        + 'that fires only on a NON-ZERO priced lead (PTP-T0 §PINS 1: the incumbent strike line '
        + 'is pinned VERBATIM), so it equals `ledPassesNonZero` BY CONSTRUCTION and G-ARM '
        + 'asserts that equality. `ledPassesNonZero` is the DELIVERED CHANNEL: a carrier '
        + 'leads only the mates his OWN EYES carry a remembered velocity for, so in this '
        + 'percept-armed world the share is expected around ONE THIRD of a bare world\'s '
        + '(PTP-T0 measured 21.7 % percept vs 62.9 % bare on its forced smoke). ⚠ ZERO IS '
        + 'SILENCE, not "he is standing still": an unseen mate and a remembered-stationary mate '
        + 'both deliver exactly zero, and those are DIFFERENT FACTS. ⚠ `interceptionsPerLedPass` '
        + 'is NaN (not a number) in an arm with NO led passes — the ratio does not exist there, '
        + 'and clamping the denominator to 1 would publish the arm\'s whole interception count '
        + 'as though it were a rate. Where it does exist it '
        + 'is a RATIO OF TWO PER-ARM TOTALS — it attributes no individual interception to any '
        + 'led pass, and the interception GUARD is the inherited one, unchanged.',
    },
    /* the guards */
    guards: {
      interceptionsPerMatch: round(rateOf(rows, 'interceptionsPerMatch'), 4),
      offsidesPerMatch: round(rateOf(rows, 'offsidesPerMatch'), 4),
      foulsPerMatch: round(rateOf(rows, 'foulsPerMatch'), 4),
      spreadYOut: round(rateOf(rows, 'spreadYOut'), 4),
      spreadYIn: round(rateOf(rows, 'spreadYIn'), 4),
      spacingMedian: round(rateOf(rows, 'spacingMedian'), 4),
      spacingUnder4: round(rateOf(rows, 'spacingUnder4')),
      band: Object.fromEntries(BAND_KEYS.map((k) => {
        const lvl = mean(rows.map(BAND_RATE[k]).filter(Number.isFinite));
        return [k, {
          perMatch: round(lvl, 4), baseline: BAND_BASELINE[k], tolerance: BAND_TOLERANCE[k],
          inBand: Number.isFinite(lvl)
            && Math.abs(lvl - BAND_BASELINE[k]) <= BAND_TOLERANCE[k] * BAND_BASELINE[k],
        }];
      })),
      phase305InterceptionContext: PHASE305_INTERCEPTION_CONTEXT,
      phase305Note: 'REPORTED CONTEXT ONLY, never a gate: the Phase 30.5 column disease ran at '
        + '33 interceptions/match (the `supportSpot` doc comment). It is a historical probe '
        + 'reading in a comment, not a live assertion anywhere in tests (#224.4(i)).',
    },
    context: {
      ticksWalked: s((r) => r.ticksWalked),
      playedTicks: s((r) => r.playedTicks),
      matchesReachingFullTime: s((r) => r.reachedFullTime),
    },
  };
};

/** the paired per-seed cluster bootstrap: ONE resampled index set feeds EVERY arm. */
const bootstrapAll = (byArm: Record<ArmName, PerMatch[]>) => {
  const n = byArm[CONTROL_ARM].length;
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    draws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  const deltaDraws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    deltaDraws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx: number[] = [];
    for (let i = 0; i < n; i++) idx.push(Math.min(n - 1, Math.floor(rng.next() * n)));
    const resampled = Object.fromEntries(
      ARMS.map((a) => [a, idx.map((i) => byArm[a][i])]),
    ) as Record<ArmName, PerMatch[]>;
    for (const k of RATE_KEYS) {
      const base = rateOf(resampled[CONTROL_ARM], k);
      for (const a of ARMS) {
        const v = rateOf(resampled[a], k);
        draws[k][a].push(v);
        deltaDraws[k][a].push(v - base);
      }
    }
  }
  const ci = (xs: number[], dp: number) => {
    const s = xs.filter((v) => Number.isFinite(v)).sort((x, y) => x - y);
    return {
      lower: round(pctlSorted(s, 0.025), dp), upper: round(pctlSorted(s, 0.975), dp),
      finiteDraws: s.length, draws: xs.length,
    };
  };
  const rates: Record<string, unknown> = {};
  for (const k of RATE_KEYS) {
    const dp = 6;
    rates[k] = Object.fromEntries(ARMS.map((a) => {
      const point = rateOf(byArm[a], k);
      const d = ci(deltaDraws[k][a], dp);
      return [a, {
        point: round(point, dp), ...ci(draws[k][a], dp),
        pairedDelta: a === CONTROL_ARM ? null
          : { point: round(point - rateOf(byArm[CONTROL_ARM], k), dp), ...d },
        resolved: a !== CONTROL_ARM && Number.isFinite(d.lower) && Number.isFinite(d.upper)
          && (d.lower > 0 || d.upper < 0),
      }];
    }));
  }
  return {
    method: 'per-match (seed-clustered) PAIRED bootstrap, ratio-of-totals estimator, '
      + '2.5/97.5 percentiles; ONE resampled seed-index set feeds EVERY arm (#20 cluster = seed)',
    statsBase: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, clusters: n,
    deltaDirection: `ARM − ${CONTROL_ARM}`,
    resolvedNote: '`resolved` is a MECHANICAL CI FLAG (the paired-delta CI excludes zero), '
      + 'NEVER a verdict (#203). F-DLC-a/b/c are the commander\'s.',
    ruler5KeysNote: '⭐ the five ruler-5 keys (constructedGe3/4/5Share on the NON-SET-PIECE pool, '
      + 'scrambleShareOfGoals, setPieceShareOfGoals) ride the SAME paired bootstrap as every '
      + 'other column, so the battery reads the #218 arc ruler with CIs and paired deltas rather '
      + 'than bare counts. ⚠ THEY REMAIN GATE-FREE: no GATE reads a cell of this table, and the '
      + 'frozen F-DLC-a/b/c STOP set is unchanged by their presence. ⭐ BUT TWO OF THEM ARE THIS '
      + 'STAGE\'S TIER-2 PRE-REGISTERED PRIMARY — `constructedGe5Share` and '
      + '`scrambleShareOfGoals`, READ AT THE COMBINED CELL and nowhere else (contract §3 / '
      + '#230.5(甲) / #231.3). That is a pre-registration in §SUCCESS, not a gate, and it is '
      + 'declared here so "REPORTED" is not misread as "not primary".',
    rates,
  };
};

/* ========================================================================== */
/* §9 THE N RULE — derived IN-PROBE from the COMMITTED artifacts               */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.841621234;
const readJson = (p: string): { bytes: Buffer; j: any } | null => (existsSync(p)
  ? (() => { const bytes = readFileSync(p); return { bytes, j: JSON.parse(bytes.toString('utf8')) }; })()
  : null);
const O2T1 = readJson(O2T1_PATH);
const TEMPO_SMOKE = readJson(TEMPO_SMOKE_PATH);
const TEMPO = readJson(TEMPO_PATH);
const GGC_SMOKE = readJson(GGC_SMOKE_PATH);
const CTBT1 = readJson(CTBT1_PATH);
const OBMT1 = readJson(OBMT1_PATH);
const PTPT1 = readJson(PTPT1_PATH);
/** ⭐ THIS EXAM'S OWN COMMITTED SMOKE, when one exists: the ONLY same-stage source of p0 and
 *  of a cluster variance for THIS arm set. Null on the smoke run itself. */
const SELF_SMOKE_PATH = 'docs/world-model/data/dlc-t1-choice-exam-smoke.json';
/** ⚠ NEVER read in smoke mode: a smoke run must not size itself off a PREVIOUS smoke run
 *  (it would make the receipt depend on what happens to be lying in the tree). */
const SELF_SMOKE = MODE === 'smoke' ? null : readJson(SELF_SMOKE_PATH);

const nRule = (() => {
  if (O2T1 === null || TEMPO === null) {
    return { available: false, note: `absent: ${O2T1_PATH} / ${TEMPO_PATH}`, nStar: null as number | null };
  }
  const j = O2T1.j;
  const ctrl = j.arms.control;
  const c1 = j.contrasts.rates.trueContextShare;
  /** ⭐ TRACED MDE: the ONE paired delta this instrument has resolved in a banked battery. */
  const mdeQ1 = Math.abs(c1.pairedDelta.point as number);
  const m320 = ctrl.eligibleTotal as number;
  const p0o2 = c1.control.point as number;
  const seBoot = ((c1.pairedDelta.upper - c1.pairedDelta.lower) / 2) / Z975;
  const seIid = Math.sqrt((p0o2 * (1 - p0o2) + (c1.look.point as number)
    * (1 - (c1.look.point as number))) / m320);
  const deffInherited = (seBoot * seBoot) / (seIid * seIid);

  /* --- the #173 column's MDE, read from the committed census (no same-world source) --- */
  const arms = TEMPO.j.result.arms;
  const shareOf = (a: string): number => arms[a].pressContext.firstReceptionsOfSpell.pressedShare as number;
  const mdeQ2 = Math.min(Math.abs(shareOf('v1') - shareOf('prod')), Math.abs(shareOf('v2') - shareOf('prod')));

  /** ⭐ THE SAME-WORLD RECUT (the dispatch's instruction, and the honest half of this rule):
   *  CTB-T1's p0 / moments-per-seed / DEFF all came from worlds that are NOT this one — the
   *  bare production world and the O2-T1 control world. THIS exam runs percept-armed, whose
   *  variance may differ, so wherever this probe's OWN committed smoke exists its ABSENT arm
   *  supplies p0 and moments-per-seed, and its own paired-delta CI on the CEILING arm supplies
   *  a same-world DEFF. The MDEs stay the traced committed ones: no same-world MDE exists, and
   *  inventing one after sight is exactly what the frozen-before-sight rule forbids. */
  const smoke = SELF_SMOKE === null ? null : (() => {
    const s = SELF_SMOKE.j;
    const seeds = s.seeds as number;
    const absent = s.arms.absent;
    const rate1 = s.contrasts.rates.trueHoldableShare;
    const rate2 = s.contrasts.rates.pressedFirstReceptionShare;
    const p0q1 = rate1.absent.point as number;
    const p0q2 = rate2.absent.point as number;
    const eligPerSeed = (absent.ruler1TrueHoldable.eligibleTotal as number) / seeds;
    const frPerSeed = (absent.ruler2PressedFirstReception.firstReceptions as number) / seeds;
    /** DEFF, same-world: the CEILING arm's own paired-delta CI on ruler 2 (the column with
     *  enough moments per seed to have a usable variance at 12 clusters), against the iid SE
     *  on the same moment count. Declared: at 12 clusters this is a NOISY DEFF, which is why
     *  the rule takes the MAXIMUM of it and the inherited one — the conservative direction. */
    const mAll = (absent.ruler2PressedFirstReception.firstReceptions as number);
    const d2 = rate2.choiceXCas.pairedDelta;
    const seBoot2 = ((d2.upper - d2.lower) / 2) / Z975;
    const pK = rate2.choiceXCas.point as number;
    const seIid2 = Math.sqrt((p0q2 * (1 - p0q2) + pK * (1 - pK)) / Math.max(1, mAll));
    const deffSmoke = (seBoot2 * seBoot2) / (seIid2 * seIid2);
    return {
      path: SELF_SMOKE_PATH, sha256: sha(SELF_SMOKE.bytes.toString('utf8')),
      resultSha: s.resultSha256, seeds, p0q1, p0q2,
      eligiblePerSeed: round(eligPerSeed, 4), firstReceptionsPerSeed: round(frPerSeed, 4),
      deffSmoke: round(deffSmoke, 4),
      deffProvenance: 'the MOST-PERTURBED arm (choiceXCas — the relational pair with the '
        + 'chooser free) paired-delta CI on ruler 2, this stage, 12 clusters — NOISY by '
        + 'construction and therefore used only through a MAX with the inherited DEFF.',
    };
  })();

  const deff = smoke === null ? deffInherited
    : Math.max(deffInherited, Number.isFinite(smoke.deffSmoke) ? smoke.deffSmoke : 0);
  const p0q1 = smoke === null ? p0o2 : smoke.p0q1;
  const p0q2 = smoke === null ? shareOf('prod') : smoke.p0q2;
  const eligPerSeed = smoke === null ? (ctrl.eligibleTotal / j.seeds) : smoke.eligiblePerSeed;
  const frPerSeed = smoke === null
    ? (arms.prod.pressContext.firstReceptionsOfSpell.all.n as number) / (arms.prod.matches as number)
    : smoke.firstReceptionsPerSeed;
  const p1q1 = p0q1 + mdeQ1;
  const p1q2 = p0q2 - mdeQ2;
  const mIid = (p0: number, p1: number): number =>
    ((Z975 + Z80) ** 2 * (p0 * (1 - p0) + p1 * (1 - p1))) / ((p1 - p0) ** 2);
  const mReqQ1 = deff * mIid(p0q1, p1q1);
  const nQ1 = Math.ceil(mReqQ1 / Math.max(1e-9, eligPerSeed));
  const mReqQ2 = deff * mIid(p0q2, p1q2);
  const nQ2 = Math.ceil(mReqQ2 / Math.max(1e-9, frPerSeed));

  const nRaw = Math.max(nQ1, nQ2);
  /** ⭐ THE CAP IS A CEILING, NOT A TARGET, and it is FLAGGED when it binds: the dispatch caps
   *  the battery at the CTB-T1 precedent N (628) because an armed battery costs ≈1.4× the wall
   *  (#228.4). If the rule asks for more, that is a FORK the commander decides — this probe
   *  publishes `capBinds` and `nRaw` side by side and re-cuts NOTHING. */
  const nStar = Math.min(BATTERY_ROOM, N_CAP, nRaw);
  return {
    available: true,
    rule: 'm_iid = (z.975+z.80)^2 (p0(1−p0)+p1(1−p1)) / (p1−p0)^2 ; DEFF = MAX(inherited O2-T1 '
      + 'paired-delta DEFF, this world\'s own smoke DEFF when it exists) ; m_req = DEFF·m_iid ; '
      + 'N(q) = ceil(m_req / momentsPerSeed) ; N = max_q N(q), capped by the ledger room AND by '
      + 'the CTB-T1 precedent cap (flagged when it binds)',
    worldNote: '⚠ p0 AND moments-per-seed are WORLD-DEPENDENT and this world (percept-armed) is '
      + 'NOT CTB-T1\'s (bare production). Where this probe\'s own committed smoke exists they '
      + 'are read from ITS absent arm; where it does not, they are the inherited out-of-world '
      + 'numbers and that substitution is stated in `sourceOfP0` rather than hidden.',
    sourceOfP0: smoke === null ? 'INHERITED (out-of-world: O2-T1 control + #173 prod)'
      : 'THIS WORLD (this stage\'s OWN committed smoke, its ABSENT arm)',
    sources: {
      o2t1: { path: O2T1_PATH, sha256: sha(O2T1.bytes.toString('utf8')), resultSha: j.resultSha256 },
      tempo: { path: TEMPO_PATH, sha256: sha(TEMPO.bytes.toString('utf8')), resultSha: TEMPO.j.resultSha256 },
      selfSmoke: smoke === null ? null
        : { path: smoke.path, sha256: smoke.sha256, resultSha: smoke.resultSha, seeds: smoke.seeds },
    },
    deff: round(deff, 4),
    deffInherited: round(deffInherited, 4),
    deffSmoke: smoke === null ? null : smoke.deffSmoke,
    deffProvenance: smoke === null
      ? 'INHERITED from the O2-T1 committed paired-delta CI (no same-world source yet)'
      : `MAX(inherited ${round(deffInherited, 4)}, same-world smoke ${smoke.deffSmoke}) — ${smoke.deffProvenance}`,
    q1TrueHoldable: {
      p0: round(p0q1, 8), mde: mdeQ1, p1: round(p1q1, 8),
      mdeProvenance: 'the O2-T1 COMMITTED paired delta on trueContextShare — the ONE paired '
        + 'delta this instrument has resolved in a banked battery. INHERITED knowingly: no '
        + 'same-world MDE exists, and choosing one after sight is forbidden.',
      eligiblePerSeed: round(eligPerSeed, 4), mIid: round(mIid(p0q1, p1q1), 1),
      mReq: round(mReqQ1, 1), n: nQ1,
    },
    q2PressedFirstReception: {
      p0: round(p0q2, 8), mde: round(mdeQ2, 6), p1: round(p1q2, 8),
      mdeProvenance: 'the SMALLEST cross-arm difference the #173 census itself published on this '
        + 'column (prod vs v1/v2), read from the committed artifact',
      firstReceptionsPerSeed: round(frPerSeed, 4), mIid: round(mIid(p0q2, p1q2), 1),
      mReq: round(mReqQ2, 1), n: nQ2,
    },
    binding: nQ1 >= nQ2 ? 'q1TrueHoldable' : 'q2PressedFirstReception',
    nRaw,
    batteryRoom: BATTERY_ROOM,
    roomBinds: nRaw > BATTERY_ROOM,
    nCap: N_CAP,
    capBinds: nRaw > N_CAP,
    capForkNote: nRaw > N_CAP
      ? '⚠ THE CAP BINDS: the rule asks for more seeds than the CTB-T1 precedent cap. This is a '
        + 'FORK for the commander (spend the wall, or accept a smaller MDE than the rule asks '
        + 'for) — NOT a re-cut, and the probe does not resolve it.'
      : 'the cap does not bind at this reading',
    nStar,
    batteryBlock: `${BATTERY_BASE}..${BATTERY_BASE + nStar - 1}`,
    costNote: '⭐ BUDGET IT (#228.4): an ARMED, percept-armed battery costs ≈1.4× the wall of a '
      + 'CTB-T1-shaped one (~40–45 % overhead, all of it the percept pull).',
    primaryRulers: 'ruler 1 (TRUE-holdable supply) + ruler 2 (pressed-first-reception) — the two '
      + 'UNSATURATED quantities, and the two the N rule is cut on. Rulers 3/4 are DEMOTED to '
      + 'REPORTED with their ceilings DISCLOSED (see `saturationCeilings`).',
  };
})();

/* ========================================================================== */
/* §10 MODE / SEED ROUTING (the exit-semantics guard block)                    */
/* ========================================================================== */
const RUN_N = MODE === 'smoke' ? (N_ENV ?? SMOKE_N) : (N_ENV ?? (nRule.nStar ?? 0));
const RUN_BASE = OVERRIDDEN ? GUARD_BLOCK[0] : (MODE === 'smoke' ? SMOKE_BASE : BATTERY_BASE);
if (MODE === 'full' && RUN_N <= 0) {
  console.error(`DLC-T1 FATAL — full mode needs the committed artifacts for the N rule (${O2T1_PATH}).`);
  process.exit(2);
}

banner('');
banner('=============================================================================');
banner(`DLC-T1 CHOICE EXAM (#237, the self-drive) · mode ${MODE} · N ${RUN_N} seeds × ${ARMS.length} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1} · world = PERCEPT-ARMED (edsPerceivedChoice)`);
banner('arms differ by EXACTLY the delivery DOOR (dlc | ptp | none) + the OBM matrix');
banner(`N rule ⇒ N* ${String(nRule.nStar)} (ledger room ${BATTERY_ROOM}, cap ${N_CAP})`);
if (OVERRIDDEN) {
  banner('⚠ OVERRIDE IN FORCE (DLCT1_N / DLCT1_SKIP_FP) — routed onto the EXIT-SEMANTICS GUARD');
  banner(`  BLOCK ${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}; G-CLEAN-INVOCATION goes RED and this run`);
  banner('  adjudicates NOTHING.');
}
banner('=============================================================================');

/* ========================================================================== */
/* §11 CHECKPOINT / RESUME — RESILIENCE ONLY (#207 form)                       */
/* ========================================================================== */
const CKPT_PATH = process.env.DLCT1_CHECKPOINT ?? '/tmp/dlc-t1-checkpoint.jsonl';
const RESUME = process.env.DLCT1_RESUME === '1';
const CHECKPOINTING = MODE === 'full';
const PROBE_SELF_PATH = 'scripts/probes/dlc-t1-choice-exam.ts';
const NONFINITE_TAG = '__nonFinite__';
const encTransport = (v: unknown): unknown => {
  if (typeof v === 'number' && !Number.isFinite(v)) {
    return { [NONFINITE_TAG]: Number.isNaN(v) ? 'NaN' : v > 0 ? 'Infinity' : '-Infinity' };
  }
  if (Array.isArray(v)) return v.map(encTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o)) out[k] = encTransport(o[k]);
    return out;
  }
  return v;
};
const decTransport = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(decTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length === 1 && keys[0] === NONFINITE_TAG) {
      const t = o[NONFINITE_TAG];
      return t === 'NaN' ? Number.NaN : t === 'Infinity' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = decTransport(o[k]);
    return out;
  }
  return v;
};
interface SeedUnit { seedIdx: number; seed: number; rows: Record<ArmName, PerMatch> }
const encodeUnit = (u: SeedUnit): string => JSON.stringify(encTransport(u));
const ckptConfigEcho = {
  mode: MODE, runN: RUN_N, runBase: RUN_BASE, arms: ARMS, dose: DOSE,
  momentSpacing: MOMENT_SPACING, perMatchCap: PER_MATCH_CAP, horizon: HORIZON,
  duration: MATCH_DURATION, supportWindow: [SUPPORT_MIN_M, SUPPORT_MAX_M],
  pressureR: PRESSURE_R, tableSha: EXPECTED_TABLE_SHA, holdable: HOLDABLE_CELLS,
  radiusTrace, bootstrapSeed: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES,
  repro: [REPRO173_BASE, REPRO173_N, REPRO_O2_BASE, REPRO_O2_N, REPRO_GGC_BASE, REPRO_GGC_N],
};
const ckptHeader = {
  kind: 'header' as const,
  version: 1,
  headFull: gitSay('git rev-parse HEAD'),
  probeSha256: existsSync(PROBE_SELF_PATH) ? sha(readFileSync(PROBE_SELF_PATH, 'utf8')) : 'probe-unreadable',
  srcDiffSha256: sha(gitSay('git diff -- src')),
  mode: MODE,
  configSha256: sha(canonical(ckptConfigEcho)),
};
type CkptHeader = typeof ckptHeader;
const restoredUnits = new Map<string, SeedUnit>();
const ckptKey = (pass: number, seedIdx: number): string => `${pass}:${seedIdx}`;
const refuse = (why: string): never => {
  console.error(`OBM-T1 FATAL — REFUSING TO RESUME: ${why}`);
  console.error(`  checkpoint: ${CKPT_PATH}`);
  console.error('  Resuming across a changed world would silently mix two worlds. Delete the '
    + 'checkpoint to start a genuinely fresh run, or check out the commit it was made on.');
  process.exit(1);
};
const startCheckpoint = (): void => {
  if (!CHECKPOINTING) return;
  const exists = existsSync(CKPT_PATH);
  if (RESUME && exists) {
    const lines = readFileSync(CKPT_PATH, 'utf8').split('\n').filter((l) => l.trim() !== '');
    let hdr: CkptHeader | null = null;
    let bad = 0;
    for (const line of lines) {
      let rec: Record<string, unknown>;
      try { rec = JSON.parse(line) as Record<string, unknown>; } catch { bad += 1; continue; }
      if (rec.kind === 'header') { if (hdr === null) hdr = rec as unknown as CkptHeader; continue; }
      if (rec.kind !== 'unit' || hdr === null) { bad += 1; continue; }
      const payload = rec.payload as string;
      if (typeof payload !== 'string' || sha(payload) !== rec.sha) { bad += 1; continue; }
      let unit: SeedUnit;
      try { unit = decTransport(JSON.parse(payload)) as SeedUnit; } catch { bad += 1; continue; }
      if (encodeUnit(unit) !== payload) { bad += 1; continue; }
      if (unit.seed !== RUN_BASE + unit.seedIdx
        || ARMS.some((a) => unit.rows[a] === undefined || unit.rows[a].seed !== unit.seed)) {
        bad += 1; continue;
      }
      restoredUnits.set(ckptKey(rec.pass as number, unit.seedIdx), unit);
    }
    if (hdr === null) refuse('the checkpoint has no readable header record (corrupt or truncated).');
    const h = hdr as CkptHeader;
    const mismatches = ([
      ['git HEAD', h.headFull, ckptHeader.headFull],
      ['probe file', h.probeSha256, ckptHeader.probeSha256],
      ['src working tree', h.srcDiffSha256, ckptHeader.srcDiffSha256],
      ['mode', h.mode, ckptHeader.mode],
      ['frozen config', h.configSha256, ckptHeader.configSha256],
    ] as const).filter(([, was, now]) => was !== now);
    if (mismatches.length > 0) {
      refuse(`${mismatches.length} guard field(s) changed since the checkpoint was written — `
        + mismatches.map(([w, was, now]) => `${w}: ${String(was)} → ${String(now)}`).join(' · '));
    }
    banner(`RESUME — checkpoint ${CKPT_PATH} accepted · ${restoredUnits.size} (pass, seed) unit(s) `
      + `restored${bad > 0 ? ` · ${bad} unusable record(s) DISCARDED and will be recomputed` : ''}`);
    return;
  }
  if (RESUME && !exists) banner(`RESUME requested but no checkpoint at ${CKPT_PATH} — starting FRESH.`);
  writeFileSync(CKPT_PATH, `${JSON.stringify(ckptHeader)}\n`);
  banner(`checkpoint ARMED at ${CKPT_PATH} (one line per finished (pass, seed) unit)`);
};
const appendCheckpoint = (pass: number, u: SeedUnit): void => {
  if (!CHECKPOINTING) return;
  const payload = encodeUnit(u);
  try {
    appendFileSync(CKPT_PATH, `${JSON.stringify({
      kind: 'unit', pass, seedIdx: u.seedIdx, seed: u.seed, sha: sha(payload), payload,
    })}\n`);
  } catch (e) {
    banner(`⚠ checkpoint append FAILED (${String(e)}) — the run continues, unprotected.`);
  }
};
startCheckpoint();

/* ========================================================================== */
/* §12 THE CORE (X-DET: run TWICE)                                            */
/* ========================================================================== */
interface Core {
  byArm: Record<ArmName, PerMatch[]>;
  reproO2: PerMatch[];
  repro173: PerMatch[];
  reproGgc: PerMatch[];
  reproCtbT1: PerMatch[];
  reproObmT1Absent: PerMatch[];
  reproObmT1CheckAndShow: PerMatch[];
  reproPtpT1Lead: PerMatch[];
  dose: Record<ArmName, ReturnType<typeof doseRead>>;
  restored: string[];
  computed: string[];
}
const computeCore = (pass: number): Core => {
  const byArm = Object.fromEntries(ARMS.map((a) => [a, [] as PerMatch[]])) as Record<ArmName, PerMatch[]>;
  const restored: string[] = []; const computed: string[] = [];
  const t0 = Date.now();
  for (let i = 0; i < RUN_N; i++) {
    const seed = RUN_BASE + i;
    const already = restoredUnits.get(ckptKey(pass, i));
    let unit: SeedUnit;
    if (already !== undefined) {
      unit = already;
      restored.push(ckptKey(pass, i));
      banner(`  pass ${pass} · seed ${i + 1}/${RUN_N} (${seed}) · SKIPPED — restored from checkpoint`);
    } else {
      const rows = {} as Record<ArmName, PerMatch>;
      for (const a of ARMS) rows[a] = walkSeed(seed, a);
      unit = { seedIdx: i, seed, rows };
      computed.push(ckptKey(pass, i));
      appendCheckpoint(pass, unit);
      banner(`  pass ${pass} · seed ${i + 1}/${RUN_N} (${seed}) · ${ARMS.length} arms done · `
        + `${((Date.now() - t0) / 1000).toFixed(1)} s`);
    }
    for (const a of ARMS) byArm[a].push(unit.rows[a]);
  }
  banner(`  pass ${pass} · G-REPRO-O2T1: block ${REPRO_O2_BASE} (${REPRO_O2_N} matches, O2-T1 CONTROL world)...`);
  const reproO2: PerMatch[] = [];
  for (let i = 0; i < REPRO_O2_N; i++) reproO2.push(walkSeed(REPRO_O2_BASE + i, 'reproO2Control'));
  banner(`  pass ${pass} · G-REPRO-173: block ${REPRO173_BASE} (${REPRO173_N} matches, prod world)...`);
  const repro173: PerMatch[] = [];
  for (let i = 0; i < REPRO173_N; i++) repro173.push(walkSeed(REPRO173_BASE + i, 'repro173Prod'));
  banner(`  pass ${pass} · G-REPRO-GGC: block ${REPRO_GGC_BASE} (${REPRO_GGC_N} matches, census PROD world)...`);
  const reproGgc: PerMatch[] = [];
  for (let i = 0; i < REPRO_GGC_N; i++) reproGgc.push(walkSeed(REPRO_GGC_BASE + i, 'reproGgcProd'));
  banner(`  pass ${pass} · ⭐ G-REPRO-CTBT1: block ${REPRO_CTBT1_BASE} (${REPRO_CTBT1_N} matches, `
    + 'CTB-T1 ABSENT world)...');
  const reproCtbT1: PerMatch[] = [];
  for (let i = 0; i < REPRO_CTBT1_N; i++) {
    reproCtbT1.push(walkSeed(REPRO_CTBT1_BASE + i, 'reproCtbT1Absent'));
  }
  banner(`  pass ${pass} · ⭐ G-REPRO-OBMT1: block ${REPRO_OBMT1_BASE} (${REPRO_OBMT1_N} matches × `
    + '2 arms, OBM-T1 ABSENT + CHECK-AND-SHOW worlds)...');
  const reproObmT1Absent: PerMatch[] = [];
  const reproObmT1CheckAndShow: PerMatch[] = [];
  for (let i = 0; i < REPRO_OBMT1_N; i++) {
    reproObmT1Absent.push(walkSeed(REPRO_OBMT1_BASE + i, 'reproObmT1Absent'));
    reproObmT1CheckAndShow.push(walkSeed(REPRO_OBMT1_BASE + i, 'reproObmT1CheckAndShow'));
  }
  banner(`  pass ${pass} · delivered-dose read (seed ${DOSE_READ_SEED}, ${ARMS.length} arms)...`);
  const dose = Object.fromEntries(ARMS.map((a) => [a, doseRead(a)])) as Core['dose'];
  banner(`  pass ${pass} · ⭐⭐ G-ANCHOR (G-REPRO-PTPT1): block ${REPRO_PTPT1_BASE} `
    + `(${REPRO_PTPT1_N} matches on PTP-T1's OWN LEAD arm)`);
  const reproPtpT1Lead: PerMatch[] = [];
  for (let i = 0; i < REPRO_PTPT1_N; i++) {
    reproPtpT1Lead.push(walkSeed(REPRO_PTPT1_BASE + i, 'reproPtpT1Lead'));
  }

  return {
    byArm, reproO2, repro173, reproGgc, reproCtbT1, reproObmT1Absent, reproObmT1CheckAndShow,
    reproPtpT1Lead,
    dose, restored, computed,
  };
};

const coreBody = (core: Core) => {
  /* --- G-REPRO-O2T1: the committed rows, read from the artifact (never typed) --- */
  const committedO2 = O2T1 === null ? [] : (O2T1.j.perMatch.control as any[]);
  const rowsO2 = core.reproO2.map((r) => ({ seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable }));
  const mismatchesO2 = rowsO2.filter((row, i) => {
    const want = committedO2[i];
    return want === undefined || JSON.stringify(row) !== JSON.stringify({
      seed: want.seed, eligible: want.eligible, trueHoldable: want.trueHoldable,
    });
  });
  /* --- G-REPRO-173: the committed pooled block, read from the artifact ---------- */
  const want173 = TEMPO_SMOKE === null ? null
    : TEMPO_SMOKE.j.result.arms.prod.pressContext.firstReceptionsOfSpell;
  const got173 = {
    pressed: core.repro173.reduce((a, r) => a + r.firstRecOpenPressed, 0),
    all: core.repro173.reduce((a, r) => a + r.firstRecOpen, 0),
  };
  const share173 = got173.all === 0 ? Number.NaN : got173.pressed / got173.all;
  const identical173 = want173 !== null
    && got173.pressed === (want173.pressed.n as number)
    && got173.all === (want173.all.n as number)
    && (got173.all - got173.pressed) === (want173.unpressed.n as number)
    && Number(share173.toFixed(4)) === Number((want173.pressedShare as number).toFixed(4));

  /* --- G-REPRO-GGC: the #218 LIFT proved against the census's OWN committed rows ---------- */
  const ggcGot = ggSummary(core.reproGgc);
  const ggcWant = GGC_SMOKE === null ? null : GGC_SMOKE.j.result.perArm.PROD;
  /** ⭐ WHICH ROWS, AND WHY: the census publishes NO per-seed rows in either committed artifact,
   *  so the strongest CHEAP form available is its SMOKE arm ENTIRE — `PROD` over the whole
   *  12-seed block 12,421,000..12,421,011, which is every match that arm contains. The compared
   *  fields are the INTEGER COUNTS (never the rounded shares, which are functions of them) on
   *  every limb this lift uses: the origin classification of GOALS and of SEGMENTS, the
   *  loss-third cut, the construction ladder on both pools, the own-third turnover counts on
   *  BOTH readings (loss tick AND regain tick — the #215.3-H1 wedge), and the segmentation
   *  ACCOUNTING identity. Targets are READ from the artifact, never typed. */
  const ggcChecks: { field: string; want: number; got: number }[] = ggcWant === null ? [] : [
    { field: 'goals', want: ggcWant.goalGenealogy.goals as number, got: ggcGot.goals },
    ...GG_ORIGIN_CLASSES.map((o) => ({
      field: `goals.byOrigin.${o}`,
      want: ggcWant.goalGenealogy.byOrigin[o] as number,
      got: ggcGot.byOrigin[o],
    })),
    ...GG_ORIGIN_CLASSES.map((o) => ({
      field: `goals.byOriginAtRegainSpot.${o}`,
      want: ggcWant.goalGenealogy.byOriginAtRegainSpot[o] as number,
      got: ggcGot.byOriginAtRegainSpot[o],
    })),
    ...(['setPiece', 'restart', 'openPlay'] as const).map((f) => ({
      field: `goals.byFamily.${f}`,
      want: ggcWant.goalGenealogy.byFamily[f] as number,
      got: ggcGot.byFamily[f],
    })),
    ...(['own', 'middle', 'final', 'notARegain'] as const).map((t) => ({
      field: `goals.byLossThird.${t}`,
      want: ggcWant.goalGenealogy.byLossThird[t] as number,
      got: ggcGot.byLossThird[t],
    })),
    ...(['nonSetPiece', 'openPlayOriginOnly'] as const).flatMap((pool) => [
      {
        field: `constructedLadder.${pool}.pool`,
        want: ggcWant.goalGenealogy.constructedLadder[pool].pool as number,
        got: (ggcGot.constructedLadder as any)[pool].pool as number,
      },
      ...CONSTRUCTED_LADDER.map((k) => ({
        field: `constructedLadder.${pool}.ge${k}.constructed`,
        want: ggcWant.goalGenealogy.constructedLadder[pool].ladder[`ge${k}`].constructed as number,
        got: (ggcGot.constructedLadder as any)[pool].ladder[`ge${k}`].constructed as number,
      })),
    ]),
    ...GG_ORIGIN_CLASSES.map((o) => ({
      field: `segments.byOrigin.${o}`,
      want: ggcWant.segmentPopulation.byOrigin[o] as number,
      got: ggcGot.segmentPopulation.byOrigin[o],
    })),
    {
      field: 'turnovers.ownThird(lossTick)',
      want: ggcWant.backThirdErrors.ownThirdTurnovers as number,
      got: ggcGot.turnovers.ownThird,
    },
    {
      field: 'turnovers.ownThird(regainTick, the declared cross-cut)',
      want: ggcWant.backThirdErrors.atRegainSpot.ownThirdTurnovers as number,
      got: ggcGot.turnovers.ownThirdAtRegainSpot,
    },
    ...(['totalTicks', 'deadBallTicks', 'segmentTicks', 'looseGapTicks', 'assignedTicksSum',
      'goalsFromScore', 'goalsMappedToSegments', 'unattributedGoals', 'spanOrderViolations'] as const)
      .map((k) => ({
        field: `accounting.${k}`,
        want: ggcWant.accounting[k] as number,
        got: (ggcGot.accounting as Record<string, number>)[k],
      })),
  ];
  const ggcMismatches = ggcChecks.filter((c) => c.want !== c.got);

  /* --- ⭐ G-REPRO-CTBT1: THIS PROBE *IS* THE CTB-T1 INSTRUMENT, proved row by row -------- */
  /** The committed CTB-T1 battery artifact publishes per-match rows for its ABSENT arm. This
   *  probe re-walks the first `REPRO_CTBT1_N` of them in CTB-T1's OWN world and must reproduce
   *  every published field EXACTLY — including the whole-match SIGNATURE (which carries the
   *  rng stream state), so this is not a comparison of summaries but of worlds. Targets are
   *  READ from the artifact, never typed. */
  const ctbT1Committed = CTBT1 === null ? [] : (CTBT1.j.perMatch.absent as any[]);
  const CTBT1_FIELDS = [
    'seed', 'eligible', 'trueHoldable', 'firstRecOpen', 'firstRecOpenPressed',
    'possTicks', 'possTicksShort', 'possTicksPressed', 'possTicksPressedShort',
    'firstRecShort', 'firstRecPressedShort', 'supportTicks', 'supportTicksShifted',
    'clampXBound', 'clampYBound', 'interceptions', 'offsides', 'goals',
    'ticksWalked', 'signature',
  ] as const;
  const ctbT1Rows = core.reproCtbT1.map((r, i) => {
    const want = ctbT1Committed[i];
    const got: Record<string, unknown> = {
      seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable,
      firstRecOpen: r.firstRecOpen, firstRecOpenPressed: r.firstRecOpenPressed,
      possTicks: r.possTicks, possTicksShort: r.possTicksShort,
      possTicksPressed: r.possTicksPressed, possTicksPressedShort: r.possTicksPressedShort,
      firstRecShort: r.firstRecShort, firstRecPressedShort: r.firstRecPressedShort,
      supportTicks: r.supportTicks, supportTicksShifted: r.supportTicksShifted,
      clampXBound: r.clampXBound, clampYBound: r.clampYBound,
      interceptions: r.interceptions, offsides: r.offsides, goals: r.goals,
      ticksWalked: r.ticksWalked, signature: r.signature,
    };
    const differing = want === undefined ? [...CTBT1_FIELDS]
      : CTBT1_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
    return { seed: r.seed, differingFields: differing, got };
  });
  const ctbT1Mismatches = ctbT1Rows.filter((x) => x.differingFields.length > 0);


  /* --- ⭐⭐ G-ANCHOR (= G-REPRO-PTPT1): THE CONTRAST ANCHOR *IS* THE #234 POISON ARM ------- */
  /** The committed PTP-T1 BATTERY artifact publishes per-match rows for every arm. This probe
   *  re-walks the first `REPRO_PTPT1_N` rows of its LEAD arm — `ptpPassLead` armed alone at gene
   *  1, in PTP-T1's own percept-armed world — and must reproduce every published field EXACTLY,
   *  including the whole-match SIGNATURE (rng stream state inside) AND the DELIVERED-LEAD
   *  columns (`passesChosen` / `ptpLedHandled` / `ptpLedNonZero` / `ptpLeadSum` / `ptpLeadMax`),
   *  which no other G-REPRO in this family carries.
   *
   *  ⭐ IT CARRIES THREE LOADS AT ONCE, and that is why it is this stage's hardest gate:
   *    (1) THE INSTRUMENT IS PTP-T1's — every ruler, sampling rule, walk order and constant;
   *    (2) THE CONTRAST ANCHOR IS THE REAL POISON ARM — the LEAD-ANCHOR exam arm is
   *        CONFIGURATION-IDENTICAL to this walk, so "the contest versus the forced dose" is a
   *        comparison against ruling #234's own arm rather than against a look-alike;
   *    (3) THE STRIKE WRAPPER PERTURBS NOTHING — it is installed on this walk too, and the
   *        DELIVERED-LEAD columns it produces are themselves compared field for field.
   *  Targets are READ from the artifact, never typed. */
  const PTPT1_FIELDS = [
    'seed', 'eligible', 'trueHoldable', 'firstRecOpen', 'firstRecOpenPressed',
    'possTicks', 'possTicksShort', 'possTicksPressed', 'possTicksPressedShort',
    'firstRecShort', 'firstRecPressedShort', 'supportTicks', 'supportTicksShifted',
    'clampXBound', 'clampYBound', 'interceptions', 'offsides', 'goals',
    'spreadYOut', 'spacingMedian',
    'passesChosen', 'ptpLedHandled', 'ptpLedNonZero', 'ptpLeadSum', 'ptpLeadMax',
    'ticksWalked', 'signature',
  ] as const;
  const ptpT1RowOf = (r: PerMatch): Record<string, unknown> => ({
    seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable,
    firstRecOpen: r.firstRecOpen, firstRecOpenPressed: r.firstRecOpenPressed,
    possTicks: r.possTicks, possTicksShort: r.possTicksShort,
    possTicksPressed: r.possTicksPressed, possTicksPressedShort: r.possTicksPressedShort,
    firstRecShort: r.firstRecShort, firstRecPressedShort: r.firstRecPressedShort,
    supportTicks: r.supportTicks, supportTicksShifted: r.supportTicksShifted,
    clampXBound: r.clampXBound, clampYBound: r.clampYBound,
    interceptions: r.interceptions, offsides: r.offsides, goals: r.goals,
    spreadYOut: round(r.spreadYOut, 4), spacingMedian: round(r.spacingMedian, 4),
    passesChosen: r.passesChosen, ptpLedHandled: r.ptpLedHandled,
    ptpLedNonZero: r.ptpLedNonZero, ptpLeadSum: round(r.ptpLeadSum, 4),
    ptpLeadMax: round(r.ptpLeadMax, 4),
    ticksWalked: r.ticksWalked, signature: r.signature,
  });
  const ptpT1Committed = PTPT1 === null ? [] : ((PTPT1.j.perMatch.lead ?? []) as any[]);
  const ptpT1Rows = core.reproPtpT1Lead.map((r, i) => {
    const want = ptpT1Committed[i];
    const got = ptpT1RowOf(r);
    const differing = want === undefined ? [...PTPT1_FIELDS]
      : PTPT1_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
    return { seed: r.seed, differingFields: differing, got };
  });
  const ptpT1Mismatches = ptpT1Rows.filter((x) => x.differingFields.length > 0);

  /* --- ⭐ G-REPRO-OBMT1: THIS PROBE *IS* THE OBM-T1 INSTRUMENT, on TWO of its arms ------- */
  /** The committed OBM-T1 BATTERY artifact publishes per-match rows for every arm. This probe
   *  re-walks the first `REPRO_OBMT1_N` of them in OBM-T1's OWN percept-armed world, on its
   *  ABSENT arm (the WORLD) and on its CHECK-AND-SHOW arm (the FROZEN MATRIX this exam re-uses
   *  verbatim as its #230 cell), and must reproduce every published field EXACTLY — including
   *  the whole-match SIGNATURE, which carries the rng stream state. ⭐ It is therefore also the
   *  receipt that this stage's `performPass` wrapper perturbs NOTHING: the wrapper is installed
   *  on these walks too. Targets are READ from the artifact, never typed. */
  const OBMT1_FIELDS = [
    'seed', 'eligible', 'trueHoldable', 'firstRecOpen', 'firstRecOpenPressed',
    'possTicks', 'possTicksShort', 'possTicksPressed', 'possTicksPressedShort',
    'firstRecShort', 'firstRecPressedShort', 'supportTicks', 'supportTicksShifted',
    'clampXBound', 'clampYBound', 'interceptions', 'offsides', 'goals',
    'spreadYOut', 'spacingMedian', 'ticksWalked', 'signature',
  ] as const;
  const obmT1RowOf = (r: PerMatch): Record<string, unknown> => ({
    seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable,
    firstRecOpen: r.firstRecOpen, firstRecOpenPressed: r.firstRecOpenPressed,
    possTicks: r.possTicks, possTicksShort: r.possTicksShort,
    possTicksPressed: r.possTicksPressed, possTicksPressedShort: r.possTicksPressedShort,
    firstRecShort: r.firstRecShort, firstRecPressedShort: r.firstRecPressedShort,
    supportTicks: r.supportTicks, supportTicksShifted: r.supportTicksShifted,
    clampXBound: r.clampXBound, clampYBound: r.clampYBound,
    interceptions: r.interceptions, offsides: r.offsides, goals: r.goals,
    spreadYOut: round(r.spreadYOut, 4), spacingMedian: round(r.spacingMedian, 4),
    ticksWalked: r.ticksWalked, signature: r.signature,
  });
  const obmT1Compare = (walked: PerMatch[], sourceArm: string) => {
    const committed = OBMT1 === null ? [] : ((OBMT1.j.perMatch[sourceArm] ?? []) as any[]);
    const rows = walked.map((r, i) => {
      const want = committed[i];
      const got = obmT1RowOf(r);
      const differing = want === undefined ? [...OBMT1_FIELDS]
        : OBMT1_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
      return { seed: r.seed, differingFields: differing, got };
    });
    const mismatches = rows.filter((x) => x.differingFields.length > 0);
    return {
      sourceArm,
      rowsChecked: rows.length,
      committedRowsAvailable: committed.length,
      mismatches: mismatches.length,
      mismatchRows: mismatches,
      identical: rows.length > 0 && mismatches.length === 0 && committed.length >= rows.length,
    };
  };
  const obmT1Absent = obmT1Compare(core.reproObmT1Absent, 'absent');
  const obmT1Cas = obmT1Compare(core.reproObmT1CheckAndShow, 'checkAndShow');

  return {
    arms: Object.fromEntries(ARMS.map((a) => [a, armSummary(core.byArm[a])])),
    deliveredDose: core.dose,
    contrasts: bootstrapAll(core.byArm),
    gAnchor: {
      block: `${REPRO_PTPT1_BASE}..${REPRO_PTPT1_BASE + REPRO_PTPT1_N - 1}`,
      source: PTPT1_PATH,
      sourceArm: 'lead',
      sourceResultSha: PTPT1 === null ? null : PTPT1.j.resultSha256,
      world: 'PTP-T1\'s OWN percept-armed world (`edsPerceivedChoice: true`) with '
        + '`ptpPassLead` ARMED ALONE at `passLeadSupport` 1 — no OBM matrix and '
        + '`dlcDeliveryChoice` NEVER passed. CONFIGURATION-IDENTICAL to this exam\'s '
        + 'LEAD-ANCHOR arm, which is the whole point.',
      fieldsPerRow: PTPT1_FIELDS.length,
      rowsChecked: ptpT1Rows.length,
      committedRowsAvailable: ptpT1Committed.length,
      mismatches: ptpT1Mismatches.length,
      mismatchRows: ptpT1Mismatches,
      identical: ptpT1Rows.length > 0 && ptpT1Mismatches.length === 0
        && ptpT1Committed.length >= ptpT1Rows.length,
      note: '⭐⭐ THE ANCHOR RE-WALK — ONE RECEIPT CARRYING THREE LOADS. (1) THE INSTRUMENT IS '
        + 'PTP-T1\'s: every ruler, sampling rule, walk order and constant, proved by reproducing '
        + 'the committed battery rows field for field with the whole-match SIGNATURE (rng stream '
        + 'state inside). (2) THE CONTRAST ANCHOR IS RULING #234\'s OWN POISON ARM, not a '
        + 'look-alike: this exam\'s LEAD-ANCHOR arm is the same configuration, so every '
        + 'CHOICE-versus-FORCED-DOSE reading in this stage is against the arm that actually '
        + 'moved trueHoldableShare +0.1307 pp AND took goals out of band. (3) THE STRIKE WRAPPER '
        + 'PERTURBS NOTHING: it is installed here too, and the DELIVERED-LEAD columns it produces '
        + '(`passesChosen` · `ptpLedHandled` · `ptpLedNonZero` · `ptpLeadSum` · `ptpLeadMax`) are '
        + 'themselves compared — a load no other G-REPRO in this family carries. A single changed '
        + 'instrument constant, sampling rule, walk order or arm flag reds this gate. The block '
        + 'rides as a RECEIPT re-walk only — never fresh data for this exam.',
    },
    gReproObmT1: {
      block: `${REPRO_OBMT1_BASE}..${REPRO_OBMT1_BASE + REPRO_OBMT1_N - 1}`,
      source: OBMT1_PATH,
      sourceResultSha: OBMT1 === null ? null : OBMT1.j.resultSha256,
      world: 'OBM-T1\'s OWN percept-armed world (`edsPerceivedChoice: true`), `ptpPassLead` '
        + 'NEVER passed — OBM-T1 predates this seam entirely. TWO arms are re-walked: its '
        + 'ABSENT (which certifies the WORLD and the whole inherited walker) and its '
        + 'CHECK-AND-SHOW (which certifies the FROZEN 16-WEIGHT MATRIX this exam re-uses '
        + 'verbatim as its #230 cell).',
      fieldsPerRow: OBMT1_FIELDS.length,
      absentArm: obmT1Absent,
      checkAndShowArm: obmT1Cas,
      identical: obmT1Absent.identical && obmT1Cas.identical,
      note: '⭐ THE INHERITANCE CLAIM, PROVED — AND THE WRAPPER\'S INNOCENCE WITH IT. "the '
        + 'OBM-T1 instrument set inherited whole" is not a statement about how this file was '
        + 'written: it is a re-walk of the committed OBM-T1 battery block\'s first rows on two '
        + 'arms, field for field INCLUDING the whole-match signature (rng stream state inside). '
        + '⭐ Because THIS stage wraps `performPass` on every walked match to read the delivered '
        + 'lead, a wrapper that perturbed ANYTHING could not reproduce these signatures — so the '
        + 'non-perturbation is a RECEIPT, not a promise. A single changed instrument constant, '
        + 'sampling rule, walk order or matrix slot reds this gate. The block rides as a RECEIPT '
        + 're-walk only — never fresh data for this exam.',
    },
    gReproCtbT1: {
      block: `${REPRO_CTBT1_BASE}..${REPRO_CTBT1_BASE + REPRO_CTBT1_N - 1}`,
      source: CTBT1_PATH,
      sourceArm: 'absent',
      sourceResultSha: CTBT1 === null ? null : CTBT1.j.resultSha256,
      world: 'CTB-T1\'s OWN ABSENT world — the bare production-shaped match (no flags), which '
        + 'is NOT this exam\'s percept-armed world. The receipt walk runs in ITS SOURCE\'s '
        + 'world, exactly like the other three.',
      fieldsPerRow: CTBT1_FIELDS.length,
      rowsChecked: ctbT1Rows.length,
      committedRowsAvailable: ctbT1Committed.length,
      mismatches: ctbT1Mismatches.length,
      mismatchRows: ctbT1Mismatches,
      identical: ctbT1Rows.length > 0 && ctbT1Mismatches.length === 0
        && ctbT1Committed.length >= ctbT1Rows.length,
      note: '⭐ THE INHERITANCE CLAIM, PROVED: "the CTB-T1 instrument set inherited whole" is '
        + 'not a statement about how this file was written — it is a re-walk of the committed '
        + 'CTB-T1 battery block\'s first rows, field for field INCLUDING the whole-match '
        + 'signature (rng stream state inside). A single changed instrument constant, sampling '
        + 'rule or walk order reds this gate. The block rides as a RECEIPT re-walk only — never '
        + 'fresh data for this exam.',
    },
    gReproGgc: {
      block: `${REPRO_GGC_BASE}..${REPRO_GGC_BASE + REPRO_GGC_N - 1}`,
      source: GGC_SMOKE_PATH,
      sourceArm: 'PROD',
      world: 'the goal-genealogy census\'s OWN `PROD` arm — the shipped game, no flags (this '
        + 'exam\'s world, and the #173 census\'s `prod` world too)',
      rowsScope: 'the census publishes NO per-seed rows, so the whole 12-match PROD arm of its '
        + 'committed SMOKE artifact is the strongest cheap target: every match that arm contains, '
        + 'compared on INTEGER COUNTS across goal origins, segment origins, the loss-third cut, '
        + 'the construction ladder on both pools, own-third turnovers on BOTH readings, and the '
        + 'segmentation accounting identity.',
      fieldsChecked: ggcChecks.length,
      mismatches: ggcMismatches.length,
      mismatchRows: ggcMismatches,
      observed: ggcGot,
      identical: ggcWant !== null && ggcChecks.length > 0 && ggcMismatches.length === 0,
      note: 'THE #218 LIFT PROVED, NOT ASSERTED (#203 / the G-REPRO-173 precedent): this probe\'s '
        + 'OWN ported classifier re-walks the census\'s own block in the census\'s own world and '
        + 'must reproduce the committed counts EXACTLY, including the LOSS-TICK semantics '
        + '(#215.3-H1/M2) that separate them from the regain-tick reading. The census\'s seeds '
        + 'ride as a RECEIPT re-walk only — never fresh data for this exam.',
    },
    gReproO2T1: {
      block: `${REPRO_O2_BASE}..${REPRO_O2_BASE + REPRO_O2_N - 1}`,
      world: 'the O2-T1 CONTROL world (CENSUS_FLAGS + o1PassWindup), VERBATIM',
      rowsChecked: rowsO2.length, committedRowsAvailable: committedO2.length,
      mismatches: mismatchesO2.length, observedRows: rowsO2,
      identical: rowsO2.length > 0 && mismatchesO2.length === 0 && committedO2.length >= rowsO2.length,
      note: 'INSTRUMENT INHERITANCE PROVED, NOT ASSERTED: this probe\'s OWN walker re-walks the '
        + 'first rows of the O2-T1 battery block in the O2-T1 CONTROL world and must reproduce '
        + 'the committed perMatch.control {seed, eligible, trueHoldable} EXACTLY. Scope stated: '
        + 'the inherited limb is the #186 POPULATION + `trueCellOf`; the perceived-hold '
        + 'classifier is NOT part of this exam\'s ruler and is not walked.',
    },
    gRepro173: {
      block: `${REPRO173_BASE}..${REPRO173_BASE + REPRO173_N - 1}`,
      world: 'the #173 census `prod` arm — the SHIPPED game, no flags (this exam\'s world)',
      target: want173 === null ? null : {
        pressedShare: want173.pressedShare, pressed: want173.pressed.n,
        unpressed: want173.unpressed.n, all: want173.all.n,
      },
      observed: { pressedShare: round(share173, 5), pressed: got173.pressed, unpressed: got173.all - got173.pressed, all: got173.all },
      identical: identical173,
      note: 'the #173 pressed-first-reception instrument, re-derived by THIS probe\'s walker on '
        + 'the census\'s OWN sizing-smoke block, compared to the COMMITTED numbers field for '
        + 'field. The outcome-resolution / foul-attribution limbs of the census walker are not '
        + 'lifted (this ruler does not read them); this gate is what proves the omission changes '
        + 'nothing on the column that IS read.',
    },
    perMatch: Object.fromEntries(ARMS.map((a) => [a, core.byArm[a].map((r) => ({
      seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable,
      firstRecOpen: r.firstRecOpen, firstRecOpenPressed: r.firstRecOpenPressed,
      possTicks: r.possTicks, possTicksShort: r.possTicksShort,
      possTicksPressed: r.possTicksPressed, possTicksPressedShort: r.possTicksPressedShort,
      firstRecShort: r.firstRecShort, firstRecPressedShort: r.firstRecPressedShort,
      supportTicks: r.supportTicks, supportTicksShifted: r.supportTicksShifted,
      clampXBound: r.clampXBound, clampYBound: r.clampYBound,
      interceptions: r.interceptions, offsides: r.offsides, goals: r.goals,
      spreadYOut: round(r.spreadYOut, 4), spacingMedian: round(r.spacingMedian, 4),
      passesChosen: r.passesChosen, ptpLedHandled: r.ptpLedHandled,
      ptpLedNonZero: r.ptpLedNonZero, ptpLeadSum: round(r.ptpLeadSum, 4),
      ptpLeadMax: round(r.ptpLeadMax, 4),
      ticksWalked: r.ticksWalked, signature: r.signature,
    }))])),
  };
};

const coreA = computeCore(1);
const bodyA = coreBody(coreA);
const digestA = sha(canonical(bodyA));
banner(`  [dlc-t1] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = computeCore(2);
const bodyB = coreBody(coreB);
const digestB = sha(canonical(bodyB));
const xDet = digestA === digestB;
banner(`  [dlc-t1] pass 2 digest ${digestB} — X-DET ${xDet ? 'PASS' : 'FAIL'}`);

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (DLCT1_SKIP_FP)' : leagueHash(FINGERPRINT_SEED);
const xFpProd = !SKIP_FP && fpObserved === FINGERPRINT_BASELINE;

/* ========================================================================== */
/* §13 THE GUARD VERDICT ROWS (tolerances FROZEN ex ante, computed in-probe)   */
/* ========================================================================== */
const C = bodyA.contrasts.rates as Record<string, Record<ArmName, any>>;
type GuardDir = 'ceiling' | 'floor';
const GUARD_LIMBS: readonly { key: RateKey; direction: GuardDir; family: string }[] = [
  { key: 'interceptionsPerMatch', direction: 'ceiling', family: 'F-DLC-b interception (the NAMED risk: led passes into traffic)' },
  { key: 'spreadYOut', direction: 'floor', family: 'F-DLC-b clump' },
  { key: 'spacingMedian', direction: 'floor', family: 'F-DLC-b clump' },
  { key: 'spacingUnder4', direction: 'ceiling', family: 'F-DLC-b clump' },
];
const guardRows = GUARD_LIMBS.map((l) => {
  const control = C[l.key][CONTROL_ARM].point as number;
  const tol = NI_FRACTION * Math.abs(control);
  return {
    key: l.key, family: l.family, direction: l.direction,
    controlLevel: round(control, 6), toleranceAbs: round(tol, 6),
    toleranceForm: 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
      + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — frozen ex ante in the stage doc',
    arms: Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => {
      const d = C[l.key][a].pairedDelta;
      const resolved = C[l.key][a].resolved as boolean;
      const harmful = l.direction === 'ceiling' ? (d.point as number) > tol : (d.point as number) < -tol;
      return [a, {
        delta: d.point, ci: [d.lower, d.upper], resolved,
        beyondTolerance: harmful,
        breach: resolved && harmful,
      }];
    })),
  };
});
const offsideRows = Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => {
  const d = C.offsidesPerMatch[a].pairedDelta;
  return [a, {
    delta: d.point, ci: [d.lower, d.upper], resolved: C.offsidesPerMatch[a].resolved,
    resolvedIncrease: (C.offsidesPerMatch[a].resolved as boolean) && (d.point as number) > 0,
  }];
}));
const bandControl = (bodyA.arms as any)[CONTROL_ARM].guards.band as Record<string, any>;
const bandExcluded = BAND_KEYS.filter((k) => !bandControl[k].inBand);
const bandGated = BAND_KEYS.filter((k) => bandControl[k].inBand);
const bandRows = Object.fromEntries(ARMS.map((a) => {
  const b = (bodyA.arms as any)[a].guards.band as Record<string, any>;
  return [a, {
    perDimension: Object.fromEntries(BAND_KEYS.map((k) => [k, { perMatch: b[k].perMatch, inBand: b[k].inBand }])),
    allGatedDimensionsInBand: bandGated.every((k) => b[k].inBand),
  }];
}));

/* ========================================================================== */
/* §13b THE CEILINGS — rulers 3b/4b are NEAR-SATURATED, and by how much        */
/* ========================================================================== */
/** ⭐ PUBLISHED BECAUSE THE FORK PARAGRAPH ONCE SIZED A RULER WITHOUT COMPUTING IT: the
 *  headroom above the ABSENT arm is what a helpful move on a near-saturated share can possibly
 *  buy, and it is measured HERE, from the run's own numbers, never typed into a doc. */
const ceilingOf = (key: RateKey) => {
  const absent = C[key][CONTROL_ARM].point as number;
  const headroomPp = (1 - absent) * 100;
  return {
    absentLevel: round(absent, 6),
    absentLevelPct: round(absent * 100, 3),
    helpfulHeadroomPp: round(headroomPp, 3),
    perArm: Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => {
      const d = C[key][a].pairedDelta.point as number;
      return [a, {
        deltaPp: round(d * 100, 3),
        shareOfHeadroomConsumed: round(headroomPp === 0 ? Number.NaN : (d * 100) / headroomPp, 4),
        resolved: C[key][a].resolved as boolean,
      }];
    })),
  };
};
const saturationCeilings = {
  note: '⭐ THE CEILINGS, DISCLOSED (the ruled amendment): rulers 3b and 4b are bounded above by '
    + '100 %, and the ABSENT arm already sits just under it. The headroom below is the ENTIRE '
    + 'budget any helpful move on those two columns can spend — which is why the exam is carried '
    + 'by rulers 1 + 2 (the unsaturated pair) and 3/4 are REPORTED.',
  ruler4bSupportAtPressedFirstRec: ceilingOf('supportAtPressedFirstRecShare'),
  ruler3bShortOptionFirstRec: ceilingOf('shortOptionFirstRecShare'),
  decodeNote: '⚠ LABELLED DECODE NOTE, NOT A CONCLUSION (the commander\'s reading, recorded so it '
    + 'can be tested rather than assumed): in the BARE world the radius-family proximity '
    + 'predicate is NEAR-SATURATED — a body is almost always within the support radius — so the '
    + 'scarcity H-CTB is about does not live in RAW PROXIMITY at all; it lives in whether that '
    + 'body is a SAFE support (holdable, unpressed). That is a hypothesis about what these '
    + 'columns mean, not a measured finding of this round, and it is exactly why rulers 1 + 2 '
    + 'carry the exam.',
};

/* ========================================================================== */
/* §14 GATES — all computed IN-PROBE (#181.2)                                 */
/* ========================================================================== */
const srcDiff = gitSay('git diff --stat -- src');
const head = gitSay('git rev-parse --short HEAD');

/** ⭐ THE BATTERY BLOCK IS NOW N-DERIVED (the ruled amendment), so its clash-freedom is CHECKED
 *  rather than pinned to a typed end-seed: it must clear the guard block below and the next
 *  consumed interval above. */
const batteryN = nRule.nStar ?? 0;
const batteryLast = BATTERY_BASE + batteryN - 1;
const ledgerHits = (first: number, last: number): string[] => CONSUMED
  .filter((c) => !(last < c.range[0] || first > c.range[1])).map((c) => c.name);
/** ⭐ EVERY BLOCK THIS STAGE TOUCHES, MACHINE-CHECKED — not just the exam one (the pre-battery
 *  correction). Three kinds, each with its OWN predicate, because they are not the same claim:
 *   · `fresh`    — data this run creates and reads as evidence (the exam walk AND the DECLARED
 *                  delivered-dose read). MUST be clash-free against the complete ledger.
 *   · `reserved` — declared for this stage and walked by nothing yet (the exit-semantics guard
 *                  block, the N-derived battery block). MUST also be clash-free.
 *   · `re-walk`  — a DELIBERATE receipt walk of a SOURCE's own committed block (all FOUR of
 *                  them). Its overlap with the ledger IS THE POINT, so the predicate inverts:
 *                  it must land INSIDE a consumed interval, and a re-walk that came back
 *                  clash-free would mean it is walking fresh seeds and is NOT a receipt.
 *  The stage's own (fresh + reserved) blocks must additionally be pairwise disjoint. */
type BlockKind = 'fresh' | 'reserved' | 're-walk';
const walkedBlocksRaw: { name: string; first: number; last: number; kind: BlockKind }[] = [
  { name: 'exam', first: RUN_BASE, last: RUN_BASE + RUN_N - 1, kind: 'fresh' },
  {
    name: 'deliveredDoseRead (the DECLARED fourth block, observational)',
    first: DOSE_READ_SEED, last: DOSE_READ_SEED, kind: 'fresh',
  },
  {
    name: 'exitSemanticsGuard (reserved)',
    first: GUARD_BLOCK[0], last: GUARD_BLOCK[1], kind: 'reserved',
  },
  { name: 'battery (reserved, N-derived)', first: BATTERY_BASE, last: batteryLast, kind: 'reserved' },
  {
    name: 'reproO2 (re-walk)',
    first: REPRO_O2_BASE, last: REPRO_O2_BASE + REPRO_O2_N - 1, kind: 're-walk',
  },
  {
    name: 'repro173 (re-walk)',
    first: REPRO173_BASE, last: REPRO173_BASE + REPRO173_N - 1, kind: 're-walk',
  },
  {
    name: 'reproGgc (re-walk)',
    first: REPRO_GGC_BASE, last: REPRO_GGC_BASE + REPRO_GGC_N - 1, kind: 're-walk',
  },
  {
    name: 'reproCtbT1 (re-walk)',
    first: REPRO_CTBT1_BASE, last: REPRO_CTBT1_BASE + REPRO_CTBT1_N - 1, kind: 're-walk',
  },
  {
    name: '⭐ reproObmT1 (re-walk, TWO arms on one block: absent + checkAndShow)',
    first: REPRO_OBMT1_BASE, last: REPRO_OBMT1_BASE + REPRO_OBMT1_N - 1, kind: 're-walk',
  },
  {
    name: '⭐⭐ reproPtpT1Lead (re-walk — G-ANCHOR: PTP-T1\'s BATTERY block on its LEAD arm)',
    first: REPRO_PTPT1_BASE, last: REPRO_PTPT1_BASE + REPRO_PTPT1_N - 1, kind: 're-walk',
  },
];
const walkedBlocks = walkedBlocksRaw.map((b) => {
  const ledgerCollisions = ledgerHits(b.first, b.last);
  return {
    ...b,
    seeds: b.last - b.first + 1,
    ledgerCollisions,
    /** re-walks must HIT their source; fresh and reserved blocks must hit nothing. */
    ok: b.kind === 're-walk' ? ledgerCollisions.length > 0 : ledgerCollisions.length === 0,
  };
});
const stageOwnBlocks = walkedBlocks.filter((b) => b.kind !== 're-walk');
/** ⭐ IDENTITY IS NOT OVERLAP — the full-mode predicate correction. In FULL mode the exam walk IS
 *  the redemption of the reserved battery block: `RUN_BASE === BATTERY_BASE` and `RUN_N` is the
 *  same N-derived count, so the `exam` row and the `battery (reserved, N-derived)` row are the
 *  SAME interval under two names — a reservation and the walk that consumes it — not two blocks
 *  colliding. The earlier cut compared the block against itself and went RED in full mode only
 *  (in smoke the exam block sits at SMOKE_BASE, a genuinely different interval, so the defect was
 *  invisible). CORRECTED PREDICATE: an overlapping pair is a FAILURE unless the two intervals are
 *  EXACTLY equal, in which case they are UNIFIED (recorded, not ignored). A PARTIAL overlap — an
 *  exam block that half-covers the reservation, or a reservation the walk outgrew — is a real
 *  defect and still fails, which is the whole load the check carries. */
const stageOwnPairs = stageOwnBlocks.flatMap((a, i) => stageOwnBlocks.slice(i + 1)
  .filter((b) => !(a.last < b.first || b.last < a.first))
  .map((b) => ({
    pair: `${a.name} × ${b.name}`,
    identical: a.first === b.first && a.last === b.last,
    intervals: [`${a.first}..${a.last}`, `${b.first}..${b.last}`],
  })));
const stageOwnUnified = stageOwnPairs.filter((p) => p.identical);
const stageOwnOverlaps = stageOwnPairs.filter((p) => !p.identical).map((p) => p.pair);
const blockFailures = walkedBlocks.filter((b) => !b.ok).map((b) => b.name);
const examCollisions = ledgerHits(RUN_BASE, RUN_BASE + RUN_N - 1);
const batteryCollisions = ledgerHits(BATTERY_BASE, batteryLast);
const subBlocksOrdered = SMOKE_BASE + SMOKE_N - 1 < DOSE_READ_SEED
  && DOSE_READ_SEED < GUARD_BLOCK[0]
  && GUARD_BLOCK[1] < BATTERY_BASE
  && batteryN > 0 && batteryLast < NEXT_CONSUMED_AFTER_BATTERY
  && batteryCollisions.length === 0;
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

/* --- FLAG-HYGIENE + the in-battery identity arm ---------------------------- */
/** ⭐ THE ARM CONFIG ECHO + THE TWO-DOORS ASSERTION, taken off REAL constructed matches (not
 *  off the intent that built them): every arm must be percept-armed, must have `obmMovement`
 *  exactly where its matrix says, and must have `ctbSupportPlane` FALSE — everywhere. */
const armWorlds = Object.fromEntries(ARMS.map((a) => {
  const m = matchOf(RUN_BASE, a);
  const w = DOSE[a];
  return [a, {
    obmMovement: m.obmMovement,
    ptpPassLead: m.ptpPassLead,
    dlcDeliveryChoice: m.dlcDeliveryChoice,
    declaredDoor: DOOR[a],
    ctbSupportPlane: m.ctbSupportPlane,
    edsPerceivedChoice: m.edsPerceivedChoice,
    edsPerceivedDefence: m.edsPerceivedDefence,
    matrixPresentOnAllViews: genesOnAllViews(m),
    matrixNonZeroSlots: w === null ? 0 : w.filter((v) => v !== 0).length,
    matrixReadBack: offballMovementWeightVector(m.teams[0].genome),
    leadGenePresentOnAllViews: leadGeneOnAllViews(m),
    /** ⭐ read back THROUGH THE SHIPPED MAP, not off the object we wrote. */
    leadWeightReadBack: passLeadSupportWeight(m.teams[0].genome),
    leadWeightReadBackB: passLeadSupportWeight(m.teams[1].effGenome),
  }];
}));
const twoDoors = {
  ctbSupportPlaneFalseInEveryArm: ARMS.every((a) => (armWorlds as any)[a].ctbSupportPlane === false),
  perceptArmedInEveryArm: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true),
  obmFlagMatchesMatrix: ARMS.every((a) => (armWorlds as any)[a].obmMovement === (DOSE[a] !== null)),
  matrixOnAllViewsWhereArmed: ARMS.every((a) => (armWorlds as any)[a].matrixPresentOnAllViews
    === (DOSE[a] !== null)),
  /** ⭐⭐ THE DELIVERY DOORS, asserted the same way — and the EXCLUSIVITY with them. */
  ptpFlagMatchesDoor: ARMS.every((a) => (armWorlds as any)[a].ptpPassLead === (DOOR[a] === 'ptp')),
  dlcFlagMatchesDoor: ARMS.every((a) => (armWorlds as any)[a].dlcDeliveryChoice === (DOOR[a] === 'dlc')),
  /** ⭐⭐ NO ARM OPENS BOTH DELIVERY DOORS — measured off the constructed matches, because under
   *  DLC-T0 §LAW the banked seam keeps PRECEDENCE and an armed-both arm would silently BE the
   *  forced dose wearing the contest's name. This is the row that makes "never ptp+dlc both" a
   *  receipt instead of a promise. */
  neverBothDeliveryDoors: ARMS.every((a) => !((armWorlds as any)[a].ptpPassLead
    && (armWorlds as any)[a].dlcDeliveryChoice)),
  /** a door is open IF AND ONLY IF the gene is non-absent (the arming checklist's two limbs). */
  doorMatchesGenePresence: ARMS.every((a) => (DOOR[a] === 'none') === (GENE[a] === null)),
  ptpFlagMatchesGene: ARMS.every((a) => (armWorlds as any)[a].ptpPassLead === (DOOR[a] === 'ptp')),
  leadGeneOnAllViewsWhereArmed: ARMS.every((a) => (armWorlds as any)[a].leadGenePresentOnAllViews
    === (GENE[a] !== null)),
  leadWeightMatchesDeclaration: ARMS.every((a) => (GENE[a] === null
    ? (armWorlds as any)[a].leadWeightReadBack === 0
    : (armWorlds as any)[a].leadWeightReadBack === GENE[a]
      && (armWorlds as any)[a].leadWeightReadBackB === GENE[a])),
  declaration: '⭐ THE TWO-DOORS DECLARATION, ASSERTED NOT STATED (#228 / #232.1\'s G-CROSS): '
    + 'each seam keeps its OWN arming door, and this stage opens TWO of the three. '
    + '`ctbSupportPlane` is FALSE in every arm, so the OBM policy\'s INTERCEPT is a hard 0 and '
    + 'what the receiver-side dose moves is the DYNAMIC term ALONE on the incumbent '
    + '`supportSpot` geometry; the banked static plane (#224) is not this exam\'s question and '
    + 'cannot leak in through EITHER door — the identity PTP-T0\'s 48-cell G-CROSS certified at '
    + 'birth, and these rows are its T1 receipt. `obmMovement` is on iff the arm has a matrix, '
    + '`ptpPassLead` is on iff the arm has a gene, and the gene is read back THROUGH THE SHIPPED '
    + 'MAP (`passLeadSupportWeight`) on both teams rather than off the object the probe wrote.',
};
const armConfigEcho = Object.fromEntries(ARMS.map((a) => [a, {
  obmMovement: DOSE[a] !== null,
  ptpPassLead: DOOR[a] === 'ptp',
  dlcDeliveryChoice: DOOR[a] === 'dlc',
  declaredDoor: DOOR[a],
  geneSemanticsUnderThisDoor: DOOR[a] === 'ptp'
    ? 'DOSE — the gene FORCES the aim (the banked, retired dial)'
    : DOOR[a] === 'dlc'
      ? 'TASTE — the gene scales the PROJECTION MAGNITUDE the chooser is willing to price; it '
        + 'has NO zero-dose semantics (present at ANY value the candidate FORMS and competes)'
      : 'n/a — no delivery door open',
  ctbSupportPlane: false,
  edsPerceivedChoice: true,
  matrix: DOSE[a],
  passLeadSupportGene: GENE[a],
  sentence: ARM_SENTENCE[a],
}]));
/** ⚠ CORRECTED AFTER A GUARD-BLOCK RUN (recorded, not rewritten — the CTB-T0 §DEV form):
 *  `genesOnAllViews` is the ARM'S OWN DEFINITION (ARMED-ZERO has both genes present AT
 *  ZERO; ABSENT has none) and is excluded from the identity comparison. It is not a world
 *  quantity: it is the very fact that makes this the G-ZERO arm — the arms differ in CODE
 *  PATH and in GENE STATE, and the identity is over everything the world produced. Every
 *  other measured field, and the whole-match signature INCLUDING the rng stream, is
 *  compared. */
const IDENTITY_EXCLUDED_FIELDS = [
  'genesOnAllViews', 'policyCacheEntries',
  'supportTicksPlanePresent', 'supportTicksPlaneAbsent', 'supportTicksPlaneZero',
  /** ⭐ the SECOND seam's ONE arm-definition receipt (see `identityExcludedWhy`) */
  'leadGeneOnAllViews',
] as const;
const identityRows = coreA.byArm[CONTROL_ARM].map((r, i) => {
  const z = coreA.byArm.armedZero[i];
  const strip = (x: PerMatch): string => {
    const o2: Record<string, unknown> = { ...x };
    for (const k of IDENTITY_EXCLUDED_FIELDS) delete o2[k];
    return JSON.stringify(o2);
  };
  const diffs = (Object.keys(r) as (keyof PerMatch)[])
    .filter((k) => !(IDENTITY_EXCLUDED_FIELDS as readonly string[]).includes(k as string))
    .filter((k) => JSON.stringify(r[k]) !== JSON.stringify(z[k]));
  return {
    seed: r.seed,
    signatureIdentical: r.signature === z.signature,
    rowIdentical: strip(r) === strip(z),
    differingFields: diffs,
  };
});
/** every non-zero slot must be a DOMAIN CORNER (±1), every matrix full length, and every gene a
 *  member of the frozen `{0, ½, 1}` set (the seam's own clamp01 domain and its midpoint). */
const doseWellFormed = ARMS.filter((a) => DOSE[a] !== null).every((a) => {
  const w = DOSE[a] as number[];
  return w.length === OBM_WEIGHT_SLOTS
    && w.every((v) => v === 0 || v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX);
}) && ARMS.filter((a) => GENE[a] !== null).every((a) => {
  const v = GENE[a] as number;
  return v === PTP_GENE_MIN || v === PTP_GENE_HALF || v === PTP_GENE_MAX;
  /* the midpoint stays a LEGAL member of the frozen set even though this stage doses no half
   * arm — under the contest the gene is not a dial to walk (#235), so a half row would be a
   * dose ladder on an architecture that no longer has one. */
});
const flagHygiene = {
  pass: identityRows.every((x) => x.signatureIdentical && x.rowIdentical)
    /** the CONTROL has NEITHER seam; every other arm has at least ONE door open. */
    && DOSE[CONTROL_ARM] === null && GENE[CONTROL_ARM] === null
    && ARMS.filter((a) => a !== CONTROL_ARM)
      .every((a) => DOSE[a] !== null || GENE[a] !== null)
    /** ⭐ THE IDENTITY ARM: the CONTEST door open, the gene present AT ZERO, no OBM matrix. */
    && DOSE.armedZero === null && GENE.armedZero === PTP_GENE_MIN && DOOR.armedZero === 'dlc'
    /** every OTHER non-control arm carries the gene at the domain MAX behind its own door. */
    && ARMS.filter((a) => a !== CONTROL_ARM && a !== 'armedZero')
      .every((a) => GENE[a] === PTP_GENE_MAX && DOOR[a] !== 'none')
    /** ⭐ the #230 cell is REPRODUCED, not re-invented: the ONE OBM-dosed arm shares OBM-T1's
     *  own matrix OBJECT, the same one G-REPRO-OBMT1 re-walks. */
    && DOSE.choiceXCas === CHECK_AND_SHOW_MATRIX
    && ARMS.filter((a) => a !== 'choiceXCas').every((a) => DOSE[a] === null)
    /** ⭐⭐ the CONTRAST ANCHOR is the ONLY arm on the banked FORCED door. */
    && DOOR.leadAnchor === 'ptp'
    && ARMS.filter((a) => a !== 'leadAnchor').every((a) => DOOR[a] !== 'ptp')
    && doseWellFormed
    && twoDoors.ctbSupportPlaneFalseInEveryArm && twoDoors.perceptArmedInEveryArm
    && twoDoors.obmFlagMatchesMatrix && twoDoors.matrixOnAllViewsWhereArmed
    && twoDoors.ptpFlagMatchesDoor && twoDoors.dlcFlagMatchesDoor
    && twoDoors.neverBothDeliveryDoors && twoDoors.doorMatchesGenePresence
    && twoDoors.leadGeneOnAllViewsWhereArmed
    && twoDoors.leadWeightMatchesDeclaration,
  doseWellFormed,
  geneDomain: { min: PTP_GENE_MIN, half: PTP_GENE_HALF, max: PTP_GENE_MAX },
  twoDoors,
  armWorlds,
  armConfigEcho,
  identityRows,
  identityExcludedFields: IDENTITY_EXCLUDED_FIELDS,
  identityExcludedWhy: 'the SIX excluded fields ARE the arm definition or its code-path '
    + 'signature — whether the matrix and the lead gene are on the genome views, how many '
    + 'entries the policy cache holds, the three PLANE-PRESENCE classes (present / absent / '
    + 'zero) which exist only in the OBM-armed arms because only there is a plane ever written, '
    + 'and the LEAD GENE\'s presence on those same views. ⭐ `ptpLedHandled` is NOT excluded: '
    + 'the led strike sits behind a guard that fires only on a NON-ZERO priced lead, so an '
    + 'inert-gene arm reaches it exactly as often as ABSENT does — zero — and COMPARING it is '
    + 'strictly stronger than excluding it. EVERYTHING the '
    + 'world produced — every ruler, every guard, every geometric quantity, the metre-shift '
    + 'sums, the DELIVERED-LEAD metres (`ptpLeadSum` / `ptpLedNonZero`, which are 0 in both arms '
    + 'because a zero gene delivers exactly ±0) AND the whole-match signature including the rng '
    + 'stream state — is compared. Excluded and stated, never quietly dropped.',
  note: 'the arms differ by EXACTLY the two seams\' flags and doses (the `obmMovement` flag + '
    + 'the 16-weight matrix; the `ptpPassLead` flag + the scalar `passLeadSupport` gene — both '
    + 'written on all three genome views of both teams); everything else — world (percept-armed, '
    + 'identically), seeds, teams, duration, and `ctbSupportPlane` false throughout — is '
    + 'identical by construction. ARMED-ZERO ≡ ABSENT is proved per seed on the whole-match '
    + 'signature INCLUDING the rng stream state, AND on every measured row field: BOTH doors '
    + 'open, BOTH doses inert, and the world untouched.',
};

/* --- G-ARM: the SEAT is REACHED, and it delivers exactly what it should ----- */
/** the delivered-dose read of PASS 1 (X-DET re-derives it identically in pass 2). */
const core0Dose = coreA.dose;
/** ⭐ WHICH HALF OF THE SEAT DOES THIS ARM DOSE? The matrix has FOUR output rows: two drive
 *  the PLANE (geometry) and two drive the two candidate SCORES. An arm that doses only the
 *  score rows must move NO geometry — and an arm that doses only the plane rows must leave
 *  both multipliers at exactly 1. G-ARM checks delivery on the axes the arm doses AND
 *  silence on the axes it does not; reading "no shift" as "dead seam" without asking which
 *  rows are dosed would have been exactly the wrong inference. */
const dosesRow = (a: ArmName, o: number): boolean => {
  const w = DOSE[a];
  if (w === null) return false;
  for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) if (w[IDX(o, f)] !== 0) return true;
  return false;
};
const dosesPlaneOf = (a: ArmName): boolean => dosesRow(a, O_DEPTH) || dosesRow(a, O_WIDTH);
const dosesScoreOf = (a: ArmName): boolean => dosesRow(a, O_SUPPORT) || dosesRow(a, O_RUN);
const gArmRows = Object.fromEntries(ARMS.map((a) => {
  const rows = coreA.byArm[a];
  const armed = DOSE[a] !== null;
  const dosedNonZero = armed && (DOSE[a] as number[]).some((v) => v !== 0);
  const dosesPlane = dosesPlaneOf(a);
  const dosesScore = dosesScoreOf(a);
  const sum = (f: (r: PerMatch) => number): number => rows.reduce((s, r) => s + f(r), 0);
  const supportTicks = sum((r) => r.supportTicks);
  const shifted = sum((r) => r.supportTicksShifted);
  const planePresent = sum((r) => r.supportTicksPlanePresent);
  const planeAbsent = sum((r) => r.supportTicksPlaneAbsent);
  const planeZero = sum((r) => r.supportTicksPlaneZero);
  const unshiftedClampBound = sum((r) => r.supportTicksUnshiftedClampBound);
  const cacheEntries = sum((r) => r.policyCacheEntries);
  const dose = core0Dose[a];
  const mulNeutral = (d: { mean: number; min: number; max: number }): boolean =>
    d.mean === 1 && d.min === 1 && d.max === 1;
  /* ⭐ the SECOND seam's own arming/dosing state and its delivered channel */
  const leadArmed = GENE[a] !== null;
  const leadDosed = leadArmed && (GENE[a] as number) > 0;
  return [a, {
    armed,
    dosedNonZero,
    dosesPlane,
    dosesScore,
    /* ⭐ PTP HALF */
    leadArmed,
    leadDosed,
    leadGene: GENE[a],
    leadGeneOnAllViewsSeeds: sum((r) => r.leadGeneOnAllViews),
    passesChosen: sum((r) => r.passesChosen),
    ledPassesHandled: sum((r) => r.ptpLedHandled),
    ledPassesNonZero: sum((r) => r.ptpLedNonZero),
    leadMetresSum: round(sum((r) => r.ptpLeadSum), 4),
    leadMaxMetres: round(Math.max(...rows.map((r) => r.ptpLeadMax)), 4),
    leadChecked: dose.leadChecked,
    leadSignViolations: dose.leadSignViolations,
    leadMagnitudeViolations: dose.leadMagnitudeViolations,
    supportMulNeutral: mulNeutral(dose.supportMul),
    runMulNeutral: mulNeutral(dose.runMul),
    supportMulSpread: [dose.supportMul.min, dose.supportMul.max],
    runMulSpread: [dose.runMul.min, dose.runMul.max],
    seedsWithSupportTicks: rows.filter((r) => r.supportTicks > 0).length,
    /* ⭐ THE SEAT REACHED: the brain entered its fork and wrote policies, on every seed. */
    policyCacheEntries: cacheEntries,
    seedsWithPolicyWrites: rows.filter((r) => r.policyCacheEntries > 0).length,
    supportTicks,
    planePresent,
    planeAbsent,
    planeZero,
    supportTicksShifted: shifted,
    supportTicksUnshiftedClampBound: unshiftedClampBound,
    zeroPlaneMoved: sum((r) => r.supportTicksZeroPlaneMoved),
    /** the four classes must partition the support ticks EXACTLY — no residue, no tolerance. */
    partitionExact: supportTicks === planeAbsent + planeZero + shifted + unshiftedClampBound,
    zeroShift: shifted === 0,
    genesOnAllViewsSeeds: sum((r) => r.genesOnAllViews),
    meanShiftMetres: round(sum((r) => r.supportShiftSum) / Math.max(1, supportTicks), 4),
    /* ⭐ FEATURES NON-DEGENERATE (the delivered-dose read, same world in every arm) */
    doseSawSnapshotShare: dose.sawSnapshotShare,
    doseSomeFeatureNonZeroShare: dose.someFeatureNonZeroShare,
    doseFeatureMeans: dose.featureMeans,
    semantics: '⭐ DELIVERY ON THE AXES THIS ARM DOSES, AND SILENCE ON THE ONES IT DOES NOT. '
      + 'ARMED arms: the seat must be REACHED (policy-cache writes > 0 on every seed, the matrix '
      + 'on all six genome views) and every support tick must fall in exactly one of the four '
      + 'accounted classes — SHIFTED · PLANE-ZERO · PLANE-ABSENT (the TTL cadence cap) · '
      + 'UNSHIFTED-CLAMP-BOUND. An arm that doses a PLANE row must SHIFT geometry; an arm that '
      + 'does NOT dose a plane row must shift EXACTLY NOTHING. An arm that doses a SCORE row '
      + 'must produce a non-neutral multiplier; an arm that does not must leave both multipliers '
      + 'at EXACTLY 1. ARMED-ZERO therefore has to be silent on all four axes with its planes '
      + 'PRESENT — that is the identity, and it is the strongest statement in this table. ABSENT '
      + 'never writes a policy at all. ⚠ NOTE ON PLANE-ZERO: a plane of exactly (0,0) means the '
      + 'DOSED FEATURES read zero at that moment — for the f1 corners that is "the carrier is '
      + 'not perceived-pressed", i.e. the CONCENTRATION the hypothesis predicts, NOT blindness. '
      + 'Genuine blindness is BOUNDED ABOVE by the delivered-dose read\'s `allFeaturesZeroShare` '
      + '(~1 % of samples) — that share is every sample whose four features all read zero, which '
      + 'INCLUDES samples with opponents present beyond the feature radii, so it is a ceiling on '
      + 'blindness and not a measurement of it. ⭐⭐ AND THE SECOND SEAM, THE SAME WAY: an arm '
      + 'with `ptpPassLead` ARMED must have the gene on all six genome views; ⚠ CORRECTED AFTER '
      + 'THE FIRST GUARD RUN (Deviation 1) — the led strike is its OWN armed-only statement '
      + 'behind a STRIKE_GUARD, because the incumbent strike line is PINNED VERBATIM by the O1 '
      + 'wind-up\'s seam-singularity test (PTP-T0 §PINS 1), so a lead object is handed IF AND '
      + 'ONLY IF the priced displacement was NON-ZERO, and the predicate now asserts that '
      + 'EQUALITY (`ledPassesHandled === ledPassesNonZero`) in EVERY arm rather than the false '
      + 'inequality frozen ex ante; an arm with the gene DOSED (> 0) must deliver a NON-ZERO lead on at '
      + 'least one chosen pass; an arm with the gene ZERO or ABSENT must deliver EXACTLY ZERO '
      + 'lead metres (the arithmetic-exact zero point, PTP-T0 G-ZERO\'s T1 receipt); and on the '
      + 'observational dose read every led pass must obey the frozen law — ZERO sign violations '
      + 'and ZERO magnitude violations against an INDEPENDENT re-derivation. ⚠ NOTE ON THE '
      + 'DELIVERED SHARE: `ledPassesNonZero / passesChosen` is expected to be SMALL here and '
      + 'that is the HONEST CHANNEL, not a failure (#232.3) — a carrier leads only the mates his '
      + 'own eyes carry a remembered velocity for, so a percept world delivers roughly a third '
      + 'of a bare one. ZERO IS SILENCE, not "he is standing still".',
  }];
}));
const gArmPass = ARMS.every((a) => {
  const g = (gArmRows as any)[a];
  const featuresLive = g.doseSawSnapshotShare > 0 && g.doseSomeFeatureNonZeroShare > 0
    && (g.doseFeatureMeans as number[]).every((v) => v > 0);
  if (!featuresLive || !g.partitionExact || g.zeroPlaneMoved !== 0) return false;
  if (g.seedsWithSupportTicks !== RUN_N) return false;
  /* ===== the PTP half: delivery on the axis this arm doses, silence on the one it does not === */
  if (g.passesChosen <= 0) return false;
  if (g.leadArmed) {
    if (g.leadGeneOnAllViewsSeeds !== RUN_N) return false;
    /** ⚠ CORRECTED AFTER THE FIRST GUARD-BLOCK RUN, and made STRONGER rather than looser
     *  (recorded in the stage doc's Deviations, the OBM-T1 G-ARM precedent). The predicate
     *  frozen ex ante said an ARMED arm hands the strike a lead object on EVERY chosen pass.
     *  That is FALSE about the shipped mechanism, and the reason is PTP-T0's own §PINS 1: the
     *  incumbent `match.performPass(p, passMate!, offsideExemptKick);` line is PINNED VERBATIM
     *  by the O1 wind-up's seam-singularity test, so the led strike could never become an extra
     *  argument on it — it is its OWN armed-only statement behind a STRIKE_GUARD
     *  (`passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)`). A lead object is
     *  therefore handed IF AND ONLY IF the chooser's priced displacement was NON-ZERO. The
     *  corrected predicate asserts exactly that identity — `handed === nonZero`, an equality the
     *  original inequality could never have caught — and it is also why ARMED-ZERO can be
     *  byte-identical to ABSENT at the strike. */
    if (g.ledPassesHandled !== g.ledPassesNonZero) return false;
    // the law, on the passes actually chosen (the observational read): zero violations.
    if (g.leadSignViolations !== 0 || g.leadMagnitudeViolations !== 0) return false;
    // DOSED ⇒ a real lead is delivered; INERT (gene 0) ⇒ exactly zero metres, exactly zero passes.
    if (g.leadDosed) {
      if (!(g.ledPassesNonZero > 0) || !(g.leadMetresSum > 0)) return false;
    } else if (g.ledPassesNonZero !== 0 || g.leadMetresSum !== 0) return false;
  } else if (g.leadGeneOnAllViewsSeeds !== 0 || g.ledPassesHandled !== 0
    || g.ledPassesNonZero !== 0 || g.leadMetresSum !== 0 || g.leadChecked !== 0) return false;
  /* ⭐ AND THE STRIKE-GUARD IDENTITY HOLDS IN EVERY ARM, armed or not: the led-strike statement
   * is reached exactly when a NON-ZERO lead was priced, so `handed === nonZero` everywhere. */
  if (g.ledPassesHandled !== g.ledPassesNonZero) return false;
  /* ===== the OBM half: OBM-T1's own predicate, verbatim ===================================== */
  if (!g.armed) {
    // OBM ABSENT: no flag, no matrix, no policy anywhere, no shift anywhere, no modulation.
    return g.zeroShift && g.policyCacheEntries === 0 && g.planePresent === 0
      && g.genesOnAllViewsSeeds === 0 && g.supportMulNeutral && g.runMulNeutral;
  }
  // ARMED: the seat is reached on EVERY seed and the matrix is on all six views.
  if (g.seedsWithPolicyWrites !== RUN_N || g.genesOnAllViewsSeeds !== RUN_N) return false;
  if (g.planePresent === 0) return false;
  // the PLANE half: dosed ⇒ geometry moves; undosed ⇒ geometry is EXACTLY untouched.
  if (g.dosesPlane ? !(g.supportTicksShifted > 0) : !g.zeroShift) return false;
  // the SCORE half: dosed ⇒ at least one multiplier leaves 1; undosed ⇒ both are EXACTLY 1.
  const scoreDelivered = !g.supportMulNeutral || !g.runMulNeutral;
  return g.dosesScore ? scoreDelivered : (g.supportMulNeutral && g.runMulNeutral);
});

/* --- ⭐ G-BLIND-WORLD (the #228.6 HARD gate): the percept trunk is LIVE ------ */
/** A blind body has no policy, so a blind world would silently UNDELIVER the treatment and
 *  every arm would read as ABSENT. This gate refuses to let that pass as a null result: the
 *  trunk must be armed in EVERY arm's constructed world, and the features it feeds must be
 *  non-degenerate in the delivered-dose read — snapshots exist, opponents are perceived, and
 *  every one of the four feature means is strictly positive. */
const gBlindWorld = {
  perceptFlagsEveryArm: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true),
  minimalArmingRationale: '⭐ `edsPerceivedChoice` ALONE is the minimal arming that makes the '
    + 'seat see: `refreshPerception` runs on `edsPerceivedDefence || edsPerceivedChoice || '
    + 'stationEye`, but a body\'s snapshot PLAYERS are reconstructed from his RECORDED SCAN '
    + 'MOMENTS, which are recorded only under `edsPerceivedChoice || stationEye`. Arming the '
    + 'DEFENCE flag alone therefore yields a memory with no scan frames — every body believes '
    + 'he is alone, all four features read exactly zero, and the treatment is undelivered while '
    + 'looking armed. ⚠ DECLARED COST: the choice flag also moves the CARRIER onto the '
    + 'perceived-snapshot pass chooser, so this world is NOT CTB-T1\'s bare world and the two '
    + 'exams\' ABSOLUTE levels are not comparable. All five arms share it exactly, so the '
    + 'PAIRED contrast is unaffected.',
  perArm: Object.fromEntries(ARMS.map((a) => [a, {
    sawSnapshotShare: core0Dose[a].sawSnapshotShare,
    someFeatureNonZeroShare: core0Dose[a].someFeatureNonZeroShare,
    allFeaturesZeroShare: core0Dose[a].allFeaturesZeroShare,
    featureMeans: core0Dose[a].featureMeans,
    featureKeys: OBM_FEATURE_KEYS,
  }])),
  /** ⚠ THE PREDICATE, RE-CUT TO WHAT IT MEASURES (pre-battery correction, no level moves): the
   *  third limb was named `sawPerceivedOpponentShare > 0` and read as "opponents are perceived".
   *  It is `someFeatureNonZeroShare > 0` — at least one of the four features is non-zero on at
   *  least one sample — which is exactly the NON-DEGENERACY this gate needs and nothing more.
   *  The complement `allFeaturesZeroShare` is published as an UPPER BOUND on genuine blindness. */
  predicate: 'edsPerceivedChoice TRUE in every arm\'s CONSTRUCTED world · sawSnapshotShare > 0 · '
    + 'someFeatureNonZeroShare > 0 (at least one of the four features non-zero) · all four '
    + 'feature MEANS strictly positive. ⚠ NOT a claim that opponents were perceived on any '
    + 'particular sample: `allFeaturesZeroShare` bounds genuine blindness from ABOVE, because '
    + 'four zero features also occur with opponents present beyond the feature radii.',
  pass: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true
    && core0Dose[a].sawSnapshotShare > 0
    && core0Dose[a].someFeatureNonZeroShare > 0
    && core0Dose[a].featureMeans.every((v) => v > 0)),
};

/* --- ⭐ G-TRACE-PTP: the LEAD seam's constants are READ FROM SOURCE, never typed ------------ */
/** The #202 form, applied to the second seam: this exam doses a gene whose arithmetic is
 *  governed by two constants, and both are TRACED to the lines they were taken from (PTP-T0
 *  §LAW 1) — the through-ball loop's own flight divisor and `runBurstPoint`'s own in-stride lead
 *  factor. If either drifts, or the seat's declaration stops matching the line it quotes, this
 *  gate reds and the delivered-lead law check below is meaningless. The GENE DOMAIN is probed
 *  through the SHIPPED MAP at both ends and at absence, so the `{0, ½, 1}` dose set is the
 *  domain's own rather than three numbers this probe believes in. */
const gTracePtp = (() => {
  const seatSrc = readFileSync(PASSLEAD_SRC, 'utf8');
  const brainSrc = readFileSync(BRAIN_SRC, 'utf8');
  const formSrc = readFileSync(FORMATIONS_SRC, 'utf8');
  const lines = [
    { file: PASSLEAD_SRC, line: 'export const PTP_FLIGHT_SPEED = 18;', found: seatSrc.includes('export const PTP_FLIGHT_SPEED = 18;') },
    { file: PASSLEAD_SRC, line: 'export const PTP_LEAD_FLIGHT_MUL = 1.6;', found: seatSrc.includes('export const PTP_LEAD_FLIGHT_MUL = 1.6;') },
    { file: BRAIN_SRC, line: 'const flight = dist(p.pos, mate.pos) / 18;', found: brainSrc.includes('const flight = dist(p.pos, mate.pos) / 18;') },
    {
      file: FORMATIONS_SRC,
      line: 'return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);',
      found: formSrc.includes('return v2(p.pos.x + p.vel.x * flight * 1.6, p.pos.y + p.vel.y * flight * 1.6);'),
    },
  ];
  const geneMap = {
    atAbsent: passLeadSupportWeight({} as TacticalGenome),
    atMin: passLeadSupportWeight({ passLeadSupport: PTP_GENE_MIN } as TacticalGenome),
    atHalf: passLeadSupportWeight({ passLeadSupport: PTP_GENE_HALF } as TacticalGenome),
    atMax: passLeadSupportWeight({ passLeadSupport: PTP_GENE_MAX } as TacticalGenome),
    belowMin: passLeadSupportWeight({ passLeadSupport: -1 } as TacticalGenome),
    aboveMax: passLeadSupportWeight({ passLeadSupport: 2 } as TacticalGenome),
  };
  const constantsHold = PTP_FLIGHT_SPEED === 18 && PTP_LEAD_FLIGHT_MUL === 1.6;
  const domainHolds = geneMap.atAbsent === 0 && geneMap.atMin === PTP_GENE_MIN
    && geneMap.atHalf === PTP_GENE_HALF && geneMap.atMax === PTP_GENE_MAX
    && geneMap.belowMin === PTP_GENE_MIN && geneMap.aboveMax === PTP_GENE_MAX;
  return {
    pass: lines.every((l) => l.found) && constantsHold && domainHolds,
    lines,
    constants: { PTP_FLIGHT_SPEED, PTP_LEAD_FLIGHT_MUL },
    geneMap,
    note: '⭐ THE SECOND SEAM\'S CONSTANTS, TRACED (PTP-T0 §LAW 1, the MARK_SAG_BALL_SPEED form): '
      + '`18` is the THROUGH-BALL loop\'s OWN flight divisor and `1.6` is `runBurstPoint`\'s OWN '
      + 'in-stride lead factor — the family that ALREADY prices a led pass, taken whole and '
      + 'matched VERBATIM at the lines they come from, so neither can drift without reddening '
      + 'this gate. The gene domain is PROBED through the shipped `passLeadSupportWeight` map at '
      + 'absence, both ends and beyond both ends (clamped), which is what makes the frozen '
      + '{0, ½, 1} dose set the DOMAIN\'S own and the ½ row its arithmetic midpoint rather than '
      + 'a number chosen here.',
  };
})();

/* --- ⭐ G-FORK-TOKENS: the #228.5(b) debt PAID (instrument-side completion) --- */
/** OBM-T0's fork inventory grep missed two of the seat's own src symbols — `obmOffballPolicy`
 *  (the call site) and `OBM_POLICY_TTL_TICKS` (the cadence cap). Ruling #228.5(b) records the
 *  completion as riding OBM-T1. It is INSTRUMENT-SIDE ONLY: the token set is widened, every
 *  occurrence is enumerated and classified, and NOT ONE src byte moves. */
const srcTsFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = `${dir}/${e}`;
  return statSync(full).isDirectory() ? srcTsFiles(full) : full.endsWith('.ts') ? [full] : [];
});
const OBM_TOKENS = /obmMovement|obmPlane|offballMovementWeights|ObmPlane|obmPolicies|setObmPolicy|obmSupportMul|obmRunMul|obmOffballPolicy|OBM_POLICY_TTL_TICKS/;
const forkSites = (() => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcTsFiles('src')) {
    readFileSync(f, 'utf8').split('\n').forEach((raw, i) => {
      const t = raw.trim();
      if (!OBM_TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = /^if \(match\.obmMovement\) \{$/.test(t) ? 'FLAG_FORK_SCORE'
        : /^const obmPlane = match\.obmMovement \? match\.obmPlaneFor\(p\) : null;$/.test(t)
          ? 'FLAG_FORK_PLANE'
          : /^if \(obmPlane !== null\) target = supportSpotOnObmPlane/.test(t) ? 'PLANE_APPLY'
            : /^readonly obmMovement: boolean;$/.test(t) ? 'FIELD'
              : /^obmMovement\?: boolean;$/.test(t) ? 'CONFIG'
                : /this\.obmMovement = cfg\.obmMovement \?\? false;/.test(t) ? 'INIT'
                  : /'obmMovement'/.test(t) ? 'UNION_KEY'
                    : /^offballMovementWeights\?: number\[\];$/.test(t) ? 'GENE_DECL'
                      : /OBM_POLICY_TTL_TICKS/.test(t) ? 'CADENCE_CAP'
                        : /obmOffballPolicy/.test(t) ? 'SEAT_CALL'
                          : /obmPolicies/.test(t) ? 'POLICY_CACHE'
                            : /^match\.setObmPolicy\(p\.gid, obm\.plane\);$/.test(t) ? 'POLICY_WRITE'
                              : /^setObmPolicy|^obmPlaneFor/.test(t) ? 'ACCESSOR'
                                : /^let obm(Support|Run)Mul = 1;$/.test(t) ? 'SCORE_MUL_NEUTRAL'
                                  : /^obm(Support|Run)Mul = obm\.(support|run)Mul;$/.test(t) ? 'SCORE_MUL_SET'
                                    : /^s \*= obm(Support|Run)Mul;$/.test(t) ? 'SCORE_APPLY'
                                      : /offballMovementWeights/.test(t) ? 'GENE_RW'
                                        : /ObmPlane/.test(t) ? 'TYPE'
                                          : /obmPlane/.test(t) ? 'PLANE_PARAM' : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  return sites;
})();
const kindCount = (k: string): number => forkSites.filter((s) => s.kind === k).length;

/* --- ⭐ THE SECOND TOKEN FAMILY: the PTP seam's own inventory (PTP-T0's G-FORK, lifted) ----- */
/** The same discipline applied to the seam this stage newly doses: every `src/**` occurrence of
 *  the pass-lead family enumerated and classified, ZERO unclassified, and the named sites
 *  counted EXACTLY — one flag fork, three aim-priced scoring inputs, one led-strike statement.
 *  ⚠ SCOPE STATED: PTP-T0's own G-FORK additionally pins the CONSUMER half (the ten BONUS_GATE
 *  rows, the eight LOFT_BODY rows, the two MUL_FACTOR rows). That inventory is banked at #232
 *  and is not re-lifted here; what this exam needs is that the seam it doses still has exactly
 *  ONE door and ONE strike. */
const PTP_FORK_LINE = 'const ptpSeat = match.ptpPassLead ? passLeadSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
/** PTP-T0's OWN token set, VERBATIM (its G-FORK line) — the aim-composition and the three
 *  aim-priced reads are part of it, so dropping them would silently un-count the sites this
 *  gate exists to pin. */
const PTP_TOKENS = /ptpPassLead|ptpSeat|ptpLead|passLead|PassLead|PTP_FLIGHT_SPEED|PTP_LEAD_FLIGHT_MUL|bestLead|struckLead|const aim = lead|laneOpenness\(p\.pos, aim|opennessAt\(aim|team\.localX\(aim\.x\)/;
const ptpForkSites = (() => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcTsFiles('src')) {
    readFileSync(f, 'utf8').split('\n').forEach((raw, i) => {
      const t = raw.trim();
      if (!PTP_TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === PTP_FORK_LINE ? 'FLAG_FORK'
        /* ⚠ THE THREE CONTEST-ERA CLASSES — the completion declared in this stage's Deviations,
         * the #228.5(b) form. PTP-T1 froze this classifier BEFORE the contest seam was banked
         * (#237), so six `src/**` lines that carry PTP tokens have no name in it: the contest's
         * own TWO led captures (`bestLeadX/Y = ledBall.lead.x/y;`) and FOUR lines inside the
         * banked `deliveryChoiceSeat.ts` module. INSTRUMENT-SIDE ONLY — the token set and the
         * FROZEN COUNTS below are untouched, not one src byte moves, and the gate is made
         * COMPLETE rather than looser. */
        : /^bestLead[XY] = ledBall\.lead\.[xy];$/.test(t) ? 'DLC_LED_CAPTURE'
        : /^const lead = ptpSeat === null \? null : passLeadOffset\(ptpSeat, p\.pos, mate\);$/.test(t)
          ? 'LEAD_COMPUTE'
          : /^const aim = lead === null \? mate\.pos :/.test(t) ? 'AIM_COMPOSE'
            : /laneOpenness\(p\.pos, aim, opp\.players\)/.test(t) ? 'AIM_APPLY_LANE'
              : /^const open = opennessAt\(aim, opp\.players\);$/.test(t) ? 'AIM_APPLY_OPEN'
                : /team\.localX\(aim\.x\)/.test(t) ? 'AIM_APPLY_GAIN'
                  : /^bestLead[XY] = lead === null \? 0 : lead\.[xy];$/.test(t) ? 'LEAD_CAPTURE'
                    : /^let bestLead[XY] = 0;$/.test(t) ? 'LEAD_NEUTRAL'
                      : /^\} else if \(passMate === bestMate && \(bestLeadX !== 0/.test(t)
                        ? 'STRIKE_GUARD'
                        : /^match\.performPass\(p, passMate!, offsideExemptKick, 1, v2\(bestLeadX, bestLeadY\)\);$/.test(t)
                          ? 'STRIKE_LED'
                          : /^readonly ptpPassLead: boolean;$/.test(t) ? 'FIELD'
                            : /^ptpPassLead\?: boolean;$/.test(t) ? 'CONFIG'
                              : /this\.ptpPassLead = cfg\.ptpPassLead \?\? false;/.test(t) ? 'INIT'
                                : /'ptpPassLead'/.test(t) ? 'UNION_KEY'
                                  : /^passLeadSupport\?: number;$/.test(t) ? 'GENE_DECL'
                                    : /^evolvePassLeadSupport\?: boolean;$/.test(t) ? 'OPTIN_DECL'
                                      : /evolvePassLeadSupport/.test(t) ? 'OPTIN_RW'
                                        : /passLeadSupport/.test(t) ? 'GENE_RW'
                                          : /^import |^\} from |from '\.\/passLeadSeat'/.test(t) ? 'IMPORT'
                                            : /^export (const|function|interface) /.test(t) ? 'SEAT_DECL'
                                              : f.endsWith('passLeadSeat.ts') ? 'SEAT_BODY'
                                                : /struckLead|ptpLead/.test(t) ? 'STRIKE_MACHINERY'
                                                  : f.endsWith('deliveryChoiceSeat.ts')
                                                    ? 'DLC_SEAT_BODY'
                                                    : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  return sites;
})();
const ptpKindCount = (k: string): number => ptpForkSites.filter((s) => s.kind === k).length;
const gForkTokensPtp = {
  tokenSet: PTP_TOKENS.source,
  occurrences: ptpForkSites.length,
  byKind: Object.fromEntries([...new Set(ptpForkSites.map((s) => s.kind))].sort()
    .map((k) => [k, ptpKindCount(k)])),
  sites: ptpForkSites,
  unclassified: ptpForkSites.filter((s) => s.kind === 'OTHER'),
  aimApplySites: ptpForkSites.filter((s) => s.kind.startsWith('AIM_APPLY')).length,
  pass: ptpKindCount('FLAG_FORK') === 1
    && ptpKindCount('LEAD_COMPUTE') === 1 && ptpKindCount('AIM_COMPOSE') === 1
    && ptpForkSites.filter((s) => s.kind.startsWith('AIM_APPLY')).length === 3
    && ptpKindCount('LEAD_CAPTURE') === 2 && ptpKindCount('STRIKE_LED') === 1
    && ptpKindCount('STRIKE_GUARD') === 1
    && ptpKindCount('OTHER') === 0
    && ptpForkSites.some((s) => s.kind === 'FLAG_FORK' && s.file.endsWith('PlayerBrain.ts')),
  contestEraClasses: ['DLC_LED_CAPTURE', 'DLC_SEAT_BODY'],
  contestEraNote: '⚠ DECLARED COMPLETION (this stage\'s Deviation 1, the #228.5(b) form). '
    + 'PTP-T1 froze this classifier BEFORE the CONTEST seam was banked (#237), so six `src/**` '
    + 'lines that carry PTP tokens had no name in it — the contest\'s TWO led captures '
    + '(`bestLeadX/Y = ledBall.lead.x/y;`) and FOUR lines inside the banked '
    + '`deliveryChoiceSeat.ts` module (which imports the projection rather than re-deriving it). '
    + 'The first run of this probe reported them as `OTHER` and RED, correctly. The fix is '
    + 'INSTRUMENT-SIDE ONLY and STRICTLY ADDITIVE: two new classes, the SAME token set, and '
    + 'every frozen count below asserted UNCHANGED (1 flag fork · 1 lead computation · 1 aim '
    + 'composition · 3 aim-priced inputs · 2 PTP lead captures · 1 strike guard · 1 led strike). '
    + 'No src byte moves (X-SRC-UNTOUCHED is a separate HARD gate) and no predicate is loosened.',
  scopeNote: '⭐ PTP-T0\'s READ-FORK INVENTORY, re-run at T1: exactly ONE `match.ptpPassLead` '
    + 'fork in src/**, ONE lead computation, ONE aim composition, THREE aim-priced scoring '
    + 'inputs (lane · open · gain — exactly the three the contract names), TWO lead captures, '
    + 'ONE strike guard and ONE led-strike statement, with ZERO unclassified occurrences. ⚠ The '
    + 'CONSUMER half of PTP-T0\'s inventory (10 BONUS_GATE · 8 LOFT_BODY · 2 MUL_FACTOR) is '
    + 'banked at #232 and is NOT re-lifted here — this exam needs the seam it doses to still '
    + 'have one door and one strike, and that is what is checked.',
};

const gForkTokens = {
  tokenSet: OBM_TOKENS.source,
  tokensAddedHere: ['obmOffballPolicy', 'OBM_POLICY_TTL_TICKS'],
  debtPaid: '#228.5(b) — OBM-T0\'s inventory could not see the seat\'s CALL SITE or its CADENCE '
    + 'CAP, so neither was enumerated. Both are now their own classes (SEAT_CALL, CADENCE_CAP). '
    + 'INSTRUMENT-SIDE ONLY: no src byte moves (X-SRC-UNTOUCHED is a separate HARD gate).',
  occurrences: forkSites.length,
  byKind: Object.fromEntries([...new Set(forkSites.map((s) => s.kind))].sort()
    .map((k) => [k, kindCount(k)])),
  sites: forkSites,
  unclassified: forkSites.filter((s) => s.kind === 'OTHER'),
  pass: kindCount('FLAG_FORK_SCORE') === 1 && kindCount('FLAG_FORK_PLANE') === 1
    && kindCount('PLANE_APPLY') === 1 && kindCount('SCORE_APPLY') === 2
    && kindCount('SCORE_MUL_NEUTRAL') === 2 && kindCount('SCORE_MUL_SET') === 2
    && kindCount('POLICY_WRITE') === 1
    && kindCount('SEAT_CALL') >= 1 && kindCount('CADENCE_CAP') >= 1
    && kindCount('OTHER') === 0
    && forkSites.some((s) => s.kind === 'FLAG_FORK_SCORE' && s.file.endsWith('PlayerBrain.ts'))
    && forkSites.some((s) => s.kind === 'FLAG_FORK_PLANE' && s.file.endsWith('actionExecutor.ts')),
};

/* ========================================================================== */
/* §13c ⭐⭐ THE JOINT PRE-REGISTERED PRIMARY — MECHANICAL FLAGS ONLY (#203)    */
/* ========================================================================== */
/**
 * ⭐ FROZEN EX ANTE (contract §1 H-DLC, VERBATIM), computed here and ADJUDICATED NOWHERE.
 *
 *   "Pre-registered prediction (the #234 poison inverted): at the CHOICE arm the TRUE-holdable
 *    gain is retained (resolved helpful) AND goals stay inside the frozen band."
 *
 * It is ONE prediction with TWO limbs that must hold TOGETHER — which is exactly what makes it
 * falsifiable by the #234 shape it was written against. Either limb alone is uninformative here:
 *   · the gain alone is what the FORCED dial already had (LEAD moved +0.1307 pp at #234) — and
 *     the dial died anyway, on the band;
 *   · the band alone is what ABSENT has for free.
 * The claim of the contract is that the CONTEST buys the first WITHOUT spending the second.
 *
 * ⭐ AND THE CONTRAST ANCHOR IS PART OF THE READING, not decoration: the same two limbs are
 * computed at LEAD-ANCHOR, which G-ANCHOR proves IS ruling #234's own arm. The rows are
 * published side by side so the poison and its proposed dissolution are read on one ruler.
 *
 * ⚠ THE BAND LIMB'S GRAIN, INHERITED VERBATIM AND STATED HERE RATHER THAN DISCOVERED LATER: the
 * equilibrium band GATES AT BATTERY N ONLY (§GUARDS, the PTP-T1/#198 form), and a dimension the
 * ABSENT arm itself fails is EXCLUDED and DISCLOSED. At smoke grain the goals row is therefore a
 * PLUMBING READING, computed and published so the predicate cannot be re-cut after sight — not
 * evidence about H-DLC.
 *
 * ⚠ These are MECHANICAL predicate flags on published CIs, exactly like `resolved` (#203). They
 * fire no branch: F-DLC-a (the contest RETAINS the poison — goals out of band at CHOICE),
 * F-DLC-b (the contest KILLS the gain — supply null at CHOICE) and F-DLC-c (an inherited guard
 * STOPs) are ALL the commander's.
 */
const goalsBandOf = (a: ArmName) => {
  const row = (bandRows as any)[a].perDimension.goals as { perMatch: number; inBand: boolean };
  return {
    goalsPerMatch: row.perMatch,
    baseline: BAND_BASELINE.goals,
    toleranceFraction: BAND_TOLERANCE.goals,
    bandLo: round(BAND_BASELINE.goals * (1 - BAND_TOLERANCE.goals), 4),
    bandHi: round(BAND_BASELINE.goals * (1 + BAND_TOLERANCE.goals), 4),
    inBand: row.inBand,
    controlAlsoInBand: (bandRows as any)[CONTROL_ARM].perDimension.goals.inBand as boolean,
    gatingGrain: 'the band GATES at battery N only (inherited verbatim); at smoke grain this '
      + 'row is a plumbing reading',
  };
};
const supplyLimbOf = (a: ArmName) => {
  const cell = C.trueHoldableShare[a];
  const d = cell.pairedDelta as { point: number; lower: number; upper: number } | null;
  return {
    point: cell.point as number,
    delta: d === null ? null : d.point,
    ci: d === null ? null : [d.lower, d.upper],
    resolved: cell.resolved as boolean,
    /** helpful = TRUE-holdable supply UP (contract §1: "the gain is RETAINED"). */
    resolvedHelpful: d !== null && d.lower > 0,
    pointDirectionHelpful: d !== null && d.point > 0,
  };
};
const jointAt = (a: ArmName) => {
  const supply = supplyLimbOf(a);
  const band = goalsBandOf(a);
  return {
    arm: a,
    supplyLimb: supply,
    goalsBandLimb: band,
    /** ⭐ THE JOINT FLAG — BOTH limbs, or nothing. */
    jointSatisfied: supply.resolvedHelpful && band.inBand,
    whichLimbFails: supply.resolvedHelpful && band.inBand ? null
      : !supply.resolvedHelpful && !band.inBand ? 'BOTH'
        : supply.resolvedHelpful ? 'the GOALS BAND (the F-DLC-a shape: the poison retained)'
          : 'the SUPPLY GAIN (the F-DLC-b shape: the gain killed)',
  };
};
const preRegisteredPrimary = {
  frozenText: 'contract §1 H-DLC, VERBATIM: "Pre-registered prediction (the #234 poison '
    + 'inverted): at the CHOICE arm the TRUE-holdable gain is retained (resolved helpful) AND '
    + 'goals stay inside the frozen band."',
  successRule: '⭐ JOINT: at the CHOICE arm, `trueHoldableShare` RESOLVED HELPFUL (paired-delta '
    + 'CI excludes zero in the UP direction) AND the `goals` equilibrium-band dimension INSIDE '
    + 'the frozen band (2.3944 ± 15 %), BOTH TOGETHER. Neither limb alone is the prediction: the '
    + 'forced dial already had the gain and died on the band, and the band alone is what ABSENT '
    + 'has for free.',
  choiceCell: CHOICE_ARM,
  primaryAtChoice: jointAt(CHOICE_ARM),
  /** ⭐ the same two limbs at every other arm — the CONTRAST ANCHOR first among them. */
  allArms: Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => [a, jointAt(a)])),
  contrastAnchor: {
    arm: 'leadAnchor',
    what: '⭐⭐ RULING #234\'s OWN ARM, proved by G-ANCHOR against PTP-T1\'s committed battery '
      + 'rows. At battery N its published reading was `trueHoldableShare` +0.1307 pp '
      + '[+0.0338, +0.2256] RESOLVED HELPFUL — the arc\'s first resolved supply move — with the '
      + 'goals band FAILING. That is the shape the contest is claimed to invert, and it is '
      + 're-walked here rather than quoted at.',
    reading: jointAt('leadAnchor'),
  },
  failBranches: '⭐ PRE-NAMED IN THE CONTRACT §3, VERBATIM: F-DLC-a — the contest RETAINS the '
    + 'poison (goals out of band at CHOICE; the pricing itself misprices leads, and the '
    + 'aim-evaluation surgery reopens). F-DLC-b — the contest KILLS the gain (supply null at '
    + 'CHOICE; the T1 gain was the forcing\'s artifact and the channel is re-examined). F-DLC-c '
    + '— the inherited guard STOPs. ⚠ THIS PROBE FIRES NONE OF THEM (#203).',
  secondaryReported: '⭐ REPORTED HEADLINE, NOT A PRIMARY: the EMERGENT LED SHARE — '
    + '`ledPassesNonZero / passesChosen` per arm, i.e. THE NUMBER THE RETIRED DIAL USED TO FIX '
    + 'AT 1 — together with its SITUATIONAL PROFILE (the share at PRESSED versus UNPRESSED '
    + 'carrier moments, binned at the instant of the strike). It is a DISCOVERY, never a set '
    + 'point (contract §6 "genes taste not dose; the emergent led-share is a REPORTED '
    + 'discovery"), and no gate and no success condition reads it. The tier-2 #218 shares ride '
    + 'REPORTED beside it with their CIs, exactly as at PTP-T1 — no gate reads them either.',
  status: '⚠ MECHANICAL PREDICATE FLAGS ON PUBLISHED CIs AND ON THE FROZEN BAND, exactly like '
    + '`resolved` (#203). THIS PROBE ADJUDICATES NOTHING: at SMOKE GRAIN none of these rows is '
    + 'evidence about anything, the band gates at battery N only, and F-DLC-a/b/c are the '
    + 'commander\'s.',
};

/* --- ⭐⭐ THE THIRD TOKEN FAMILY: THE CONTEST's OWN READ-FORK INVENTORY (DLC-T0's, lifted) -- */
/** The seam this stage actually doses is the CONTEST, so its inventory is re-run here at T1:
 *  every `src/**` occurrence of the contest family enumerated and classified, ZERO
 *  unclassified, and the named sites counted EXACTLY — ONE flag fork, ONE `groundCandidate`
 *  DECLARATION, TWO candidate SCORINGS (feet, then led — the #236-amendment-1 receipt that the
 *  two calls differ in the AIM and in nothing else), ONE led formation, TWO led captures, and
 *  ⭐ ZERO NEW STRIKE STATEMENTS (the three `match.performPass(` statements `PlayerBrain.ts`
 *  has always had: the kickoff back-pass, the incumbent synchronous strike, and the BANKED
 *  PTP-T0 led strike the contest's winner rides). */
const DLC_FORK_LINE =
  'const dlcSeat = match.dlcDeliveryChoice ? deliveryChoiceSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const DLC_FEET_CALL = 'const feet = groundCandidate(mate, aim, d);';
const DLC_LED_CALL = 'const ledCand = groundCandidate(mate, ledBall.aim, d);';
const DLC_TOKENS = /dlcDeliveryChoice|dlcSeat|deliveryChoiceSeat|ledDelivery|ledBall|ledCand|groundCandidate/;
const dlcForkSites = (() => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcTsFiles('src')) {
    readFileSync(f, 'utf8').split('\n').forEach((raw, i) => {
      const t = raw.trim();
      if (!DLC_TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === DLC_FORK_LINE ? 'FLAG_FORK'
        : t === DLC_FEET_CALL || t === DLC_LED_CALL ? 'CAND_SCORE'
          : /^const ledBall = ledDelivery\(dlcSeat, p\.pos, mate\);$/.test(t) ? 'LED_FORM'
            : /^const groundCandidate = \(/.test(t) ? 'CAND_DECL'
              : /^bestLead[XY] = ledBall\.lead\.[xy];$/.test(t) ? 'LED_CAPTURE'
                : /^if \(dlcSeat !== null\) \{$/.test(t) ? 'LED_GUARD'
                  : /^if \(ledCand\.s > bestPass\) \{$/.test(t) ? 'LED_ARGMAX'
                    : /^(bestPass|bestMate|bestLane|bestOpen) = (ledCand|mate)/.test(t)
                      ? 'LED_ARGMAX'
                      : /^readonly dlcDeliveryChoice: boolean;$/.test(t) ? 'FIELD'
                        : /^dlcDeliveryChoice\?: boolean;$/.test(t) ? 'CONFIG'
                          : /this\.dlcDeliveryChoice = cfg\.dlcDeliveryChoice \?\? false;/.test(t)
                            ? 'INIT'
                            : /'dlcDeliveryChoice'/.test(t) ? 'UNION_KEY'
                              : /^import |^\} from |from '\.\/deliveryChoiceSeat'/.test(t) ? 'IMPORT'
                                : /^export function (deliveryChoiceSeatOf|ledDelivery)\($/.test(t)
                                  ? 'SEAT_DECL'
                                  : f.endsWith('deliveryChoiceSeat.ts') ? 'SEAT_BODY'
                                    : f.endsWith('PlayerBrain.ts') && /groundCandidate/.test(t)
                                      ? 'CAND_DECL'
                                      : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  return sites;
})();
const dlcKindCount = (k: string): number => dlcForkSites.filter((s) => s.kind === k).length;
const dlcStrikeStatements =
  (readFileSync(BRAIN_SRC, 'utf8').match(/match\.performPass\(/g) ?? []).length;
const gForkTokensDlc = {
  tokenSet: DLC_TOKENS.source,
  occurrences: dlcForkSites.length,
  byKind: Object.fromEntries([...new Set(dlcForkSites.map((s) => s.kind))].sort()
    .map((k) => [k, dlcKindCount(k)])),
  sites: dlcForkSites,
  unclassified: dlcForkSites.filter((s) => s.kind === 'OTHER'),
  strikeStatementsInBrain: dlcStrikeStatements,
  candidateCallsVerbatim: {
    feet: readFileSync(BRAIN_SRC, 'utf8').includes(DLC_FEET_CALL),
    led: readFileSync(BRAIN_SRC, 'utf8').includes(DLC_LED_CALL),
  },
  pass: dlcKindCount('FLAG_FORK') === 1
    && dlcForkSites.some((s) => s.kind === 'FLAG_FORK' && s.file.endsWith('PlayerBrain.ts'))
    && dlcKindCount('CAND_DECL') === 1 && dlcKindCount('CAND_SCORE') === 2
    && dlcKindCount('LED_FORM') === 1 && dlcKindCount('LED_CAPTURE') === 2
    && dlcKindCount('OTHER') === 0
    && dlcStrikeStatements === 3
    && readFileSync(BRAIN_SRC, 'utf8').includes(DLC_FEET_CALL)
    && readFileSync(BRAIN_SRC, 'utf8').includes(DLC_LED_CALL),
  scopeNote: '⭐⭐ DLC-T0\'s READ-FORK INVENTORY, RE-RUN AT T1 (the #236 amendment-2 discipline: '
    + 'an inherited receipt never exempts a re-run). Exactly ONE `match.dlcDeliveryChoice` fork '
    + 'in src/**, at the named site in `PlayerBrain.ts`; exactly ONE `groundCandidate` '
    + 'DECLARATION and exactly TWO calls to it, matched VERBATIM — `groundCandidate(mate, aim, '
    + 'd)` and `groundCandidate(mate, ledBall.aim, d)` — which is the #236-amendment-1 receipt '
    + 'IN CODE that the two deliveries are priced by the SAME machinery and differ in the AIM '
    + 'POINT and in NOTHING else (no taste multiplier, no second copy of the pricing); ONE led '
    + 'formation; TWO led captures; and ⭐ THREE `match.performPass(` statements in the brain, '
    + 'i.e. ZERO added by the contest — its winner rides the BANKED PTP-T0 led strike. ZERO '
    + 'unclassified occurrences.',
};

const gates = {
  xDet: {
    pass: xDet, digestA, digestB,
    note: 'the WHOLE computation (all 5 arms + the SEVEN receipt walks — six inherited plus '
      + '⭐⭐ G-ANCHOR — + the 5 dose reads + summaries + bootstrap) run '
      + 'twice; the two HASHED BODIES are byte-identical and resultSha256 is run 1\'s digest',
  },
  xFpProd: {
    pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
  },
  xSrcUntouched: {
    pass: srcDiff === '', diffStat: srcDiff,
    note: 'INSTRUMENT-ONLY ROUND: EVERY seam is banked — the CONTEST at 9360882/b8f5ef0 '
      + '(#237), the pass-lead seat at e7eb041 (#232), the eyes seat at 600ff04 (#228) — and '
      + 'this round changes no engine byte.',
  },
  gReproObmT1: {
    pass: bodyA.gReproObmT1.identical,
    block: bodyA.gReproObmT1.block, source: OBMT1_PATH,
    sourceResultSha: bodyA.gReproObmT1.sourceResultSha,
    fieldsPerRow: bodyA.gReproObmT1.fieldsPerRow,
    absentRowsChecked: bodyA.gReproObmT1.absentArm.rowsChecked,
    absentMismatches: bodyA.gReproObmT1.absentArm.mismatches,
    checkAndShowRowsChecked: bodyA.gReproObmT1.checkAndShowArm.rowsChecked,
    checkAndShowMismatches: bodyA.gReproObmT1.checkAndShowArm.mismatches,
    sourceSha256: OBMT1 === null ? null : sha(OBMT1.bytes.toString('utf8')),
    note: bodyA.gReproObmT1.note,
  },
  gAnchor: {
    pass: bodyA.gAnchor.identical,
    block: bodyA.gAnchor.block, source: PTPT1_PATH, sourceArm: bodyA.gAnchor.sourceArm,
    sourceResultSha: bodyA.gAnchor.sourceResultSha,
    fieldsPerRow: bodyA.gAnchor.fieldsPerRow,
    rowsChecked: bodyA.gAnchor.rowsChecked,
    committedRowsAvailable: bodyA.gAnchor.committedRowsAvailable,
    mismatches: bodyA.gAnchor.mismatches,
    sourceSha256: PTPT1 === null ? null : sha(PTPT1.bytes.toString('utf8')),
    armConfigurationIdentical: DOOR.leadAnchor === 'ptp' && GENE.leadAnchor === PTP_GENE_MAX
      && DOSE.leadAnchor === null,
    note: bodyA.gAnchor.note,
  },
  gTracePtp,
  gForkTokensPtp,
  gForkTokensDlc,
  gReproCtbT1: {
    pass: bodyA.gReproCtbT1.identical,
    block: bodyA.gReproCtbT1.block, source: CTBT1_PATH,
    sourceResultSha: bodyA.gReproCtbT1.sourceResultSha,
    rowsChecked: bodyA.gReproCtbT1.rowsChecked, fieldsPerRow: bodyA.gReproCtbT1.fieldsPerRow,
    mismatches: bodyA.gReproCtbT1.mismatches,
    sourceSha256: CTBT1 === null ? null : sha(CTBT1.bytes.toString('utf8')),
  },
  gBlindWorld,
  gForkTokens,
  gReproO2T1: {
    pass: bodyA.gReproO2T1.identical,
    rowsChecked: bodyA.gReproO2T1.rowsChecked, mismatches: bodyA.gReproO2T1.mismatches,
  },
  gRepro173: {
    pass: bodyA.gRepro173.identical,
    target: bodyA.gRepro173.target, observed: bodyA.gRepro173.observed,
  },
  gReproGgc: {
    pass: bodyA.gReproGgc.identical,
    block: bodyA.gReproGgc.block, source: GGC_SMOKE_PATH,
    fieldsChecked: bodyA.gReproGgc.fieldsChecked, mismatches: bodyA.gReproGgc.mismatches,
    sourceSha256: GGC_SMOKE === null ? null : sha(GGC_SMOKE.bytes.toString('utf8')),
  },
  gTraceRadius: {
    pass: radiusTrace.lineFound && radiusTrace.base === 10 && radiusTrace.slope === 8,
    ...radiusTrace,
    note: 'the short-option instrument\'s radius family is PARSED out of src/ai/formations.ts '
      + '(the #202 form: derived from source, never typed), so it cannot drift from the seat it '
      + 'is taken from.',
  },
  seedDisjoint: {
    pass: blockFailures.length === 0 && stageOwnOverlaps.length === 0
      && examCollisions.length === 0 && subBlocksOrdered,
    walkedBlocks,
    blockFailures,
    stageOwnOverlaps,
    stageOwnUnified,
    stageOwnOverlapSemantics: '⭐ a stage-own pair FAILS when its intervals intersect UNLESS they '
      + 'are EXACTLY equal (same first AND same last), in which case the two rows are ONE block '
      + 'under two names and are recorded in `stageOwnUnified` instead. This is the FULL-mode '
      + 'reality: the exam walk redeems the reserved battery block (RUN_BASE === BATTERY_BASE, '
      + 'same N-derived count), so a reservation and the walk that consumes it are not two blocks '
      + 'clashing. PARTIAL overlap still FAILS — an exam block that half-covers the reservation '
      + '(or outgrows it) is a genuine ledger defect and is exactly what this check is for.',
    examCollisions,
    subBlocksOrdered,
    batteryCollisions,
    subBlocks: {
      smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
      deliveredDoseRead: `${DOSE_READ_SEED}`,
      exitSemanticsGuard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      battery: `${BATTERY_BASE}..${batteryLast}`,
      batteryN,
      batteryRoom: BATTERY_ROOM,
      nextConsumedAfterBattery: NEXT_CONSUMED_AFTER_BATTERY,
    },
    coverageNote: '⭐ EVERY BLOCK THIS STAGE TOUCHES IS MACHINE-CHECKED HERE (the pre-battery '
      + 'correction; the earlier cut computed only four walked blocks and left the DECLARED '
      + 'delivered-dose read, the reserved guard and battery blocks and the CTB-T1 re-walk out '
      + 'of the machine check): 2 FRESH (exam · delivered-dose read) + 2 RESERVED (guard · '
      + 'battery) + 6 RE-WALKS (O2-T1 · #173 · GGC · CTB-T1 · ⭐ OBM-T1 · ⭐⭐ PTP-T1 LEAD, the '
      + 'G-ANCHOR block).',
    reproBlocksNote: 'the SIX repro blocks (O2-T1 · #173 · GGC · CTB-T1 · ⭐ OBM-T1 · ⭐⭐ '
      + 'PTP-T1 LEAD) are DELIBERATE '
      + 're-walks of the SOURCES\' own committed blocks — receipts, never fresh data — so their '
      + 'overlap with the ledger is THE POINT and their predicate is INVERTED: each must land '
      + 'INSIDE a consumed interval (`ledgerCollisions` NON-EMPTY), and a re-walk that came back '
      + 'clash-free would prove it is walking fresh seeds instead of reproducing a receipt. The '
      + 'FRESH blocks (exam, delivered-dose read) and the RESERVED ones (guard, battery) carry '
      + 'the ordinary predicate: `ledgerCollisions` EMPTY, and pairwise disjoint from each other '
      + '(`stageOwnOverlaps`).',
    consumedLedger: CONSUMED,
  },
  statsDisjoint: {
    pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, minGap: statsMinGap,
    published: PUBLISHED_STATS_BASES,
    publishedScope: 'the O2-T1 probe\'s COMPLETE ≥91,100-regime ledger + 104,600 (O2-T1\'s own '
      + 'base). Pre-regime bases (90,730, the 50xxx family) are ≥ 13,000 away and cannot move '
      + 'the minimum.',
  },
  flagHygiene,
  gArm: { pass: gArmPass, arms: gArmRows },
  gCleanInvocation: {
    pass: !OVERRIDDEN, envN: N_ENV, skipFp: SKIP_FP, routedToGuardBlock: OVERRIDDEN,
    note: 'any DLCT1_N / DLCT1_SKIP_FP override is BY DEFINITION not the exam: the run is routed '
      + 'onto the exit-semantics guard block, this gate goes RED and the process exits 1.',
  },
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §15 THE ARTIFACT — hashed body vs UNHASHED envelope (#197-M1 / #198)        */
/* ========================================================================== */
const body = {
  stage: 'DLC T1 — THE CHOICE EXAM (出球的选择权: does the CONTEST retain PTP-T1\'s supply gain '
    + 'while dissolving its max-dose poison?)',
  ruling: '#235/#236/#237 (the dial retired · the contract drafted and re-audited · DLC-T0 '
    + 'banked), under the live self-drive · DELIVERY-CHOICE-CONTRACT §3 DLC-T1 (+ §1 H-DLC, §2 '
    + 'M-DLC.1–4, §4 non-claims; F-DLC-a/b/c pre-named there) · #234 (PTP-T1 adjudicated: the '
    + 'channel is REAL but the uniform max dose POISONS the world — the finding this stage '
    + 'inverts, and whose LEAD arm is re-walked here as the CONTRAST ANCHOR) · #225.3(c) '
    + '(per-dose STOP granularity) · #181.2 (the standing receipt rule)',
  doc: 'docs/world-model/DLC-T1-CHOICE-EXAM.md',
  mode: MODE,
  block: `${RUN_BASE}..${RUN_BASE + RUN_N - 1}`,
  seeds: RUN_N,
  world: '⭐ ONE PERCEPT-ARMED BASE WORLD, IDENTICAL IN EVERY ARM: `new Match({seed, teamA, '
    + 'teamB, duration, edsPerceivedChoice: true})`. MINIMAL by construction — one flag, and the '
    + 'only one that arms BOTH halves of the percept chain (the refresh AND the scan-moment '
    + 'record); `edsPerceivedDefence` alone would leave every body believing he is alone (all '
    + 'four features exactly zero = the treatment undelivered), and a `stationEye` is a far '
    + 'larger intervention. ⚠ DECLARED: the choice flag also moves the CARRIER onto the '
    + 'perceived-snapshot pass chooser, so this is NOT CTB-T1\'s bare world and the two exams\' '
    + 'ABSOLUTE levels are not comparable; the PAIRED contrast is clean because all FIVE arms '
    + 'share this world exactly. ⭐⭐ AND IT IS NOT A FREE CHOICE HERE EITHER: the CONTRAST '
    + 'ANCHOR re-walks PTP-T1\'s LEAD arm, which lives in exactly this world, so any other world '
    + 'would forfeit G-ANCHOR. The THIN channel that follows from it is therefore the HONEST '
    + 'channel, declared at the head. Each G-REPRO walk runs in ITS SOURCE\'s own world.',
  armDefinitions: Object.fromEntries(ARMS.map((a) => [a, [
    DOSE[a] === null ? 'obmMovement:false (no matrix)'
      : `obmMovement:true · matrix [${(DOSE[a] as number[]).join(',')}]`,
    DOOR[a] === 'dlc' ? `dlcDeliveryChoice:true (THE CONTEST) · ptpPassLead:false · `
      + `passLeadSupport ${GENE[a]} = TASTE (no zero-dose semantics)`
      : DOOR[a] === 'ptp' ? `ptpPassLead:true (THE BANKED FORCED DIAL) · dlcDeliveryChoice:false `
        + `· passLeadSupport ${GENE[a]} = DOSE`
        : 'dlcDeliveryChoice:false · ptpPassLead:false (gene absent — no delivery door)',
    'ctbSupportPlane:false · edsPerceivedChoice:true',
    '(every gene on all three genome views of BOTH teams — the real gene channel, #196.3-D6)',
  ].join(' · ')])),
  armRationale: ARM_SENTENCE,
  doseProvenance: 'RECEIVER SIDE (the ONE OBM-dosed arm): every non-zero weight is a DOMAIN '
    + `CORNER (±1) of the frozen signed domain [${OBM_WEIGHT_MIN}, ${OBM_WEIGHT_MAX}] (= `
    + 'CTB_GENE_MIN/MAX, derived in code), and the CHECK-AND-SHOW matrix is OBM-T1\'s OWN, '
    + 're-walked against its committed rows by G-REPRO-OBMT1 rather than re-typed on trust. '
    + 'PASSER SIDE: the gene takes only the frozen domain\'s own ends {0, 1} — PROBED through '
    + 'the shipped `passLeadSupportWeight` map by G-TRACE-PTP at absence, both ends and beyond '
    + 'both ends. ⭐⭐ AND ITS MEANING IS DECLARED PER DOOR, because the SAME NUMBER MEANS TWO '
    + 'DIFFERENT THINGS: under `ptpPassLead` (the anchor) the gene is a DOSE that FORCES the '
    + 'aim; under `dlcDeliveryChoice` (the contest) it is TASTE — the projection magnitude the '
    + 'chooser is willing to PRICE, with the candidate free to LOSE, and NO zero-dose semantics '
    + 'at all (present at 0 the candidate still forms, competes and loses every tie). NO dose '
    + 'ladder is walked on the contest\'s side: under #235 the dial is retired and a ladder on '
    + 'it would be a knee on an architecture that no longer exists. See `deliveredDose`, '
    + '`arms.*.leadSeam` and the EMERGENT LED SHARE for what each arm ACTUALLY delivered.',
  twoDoorsDeclaration: '⭐⭐ THREE DOORS, AND THE TWO DELIVERY DOORS ARE MUTUALLY EXCLUSIVE '
    + 'BY CONSTRUCTION. `ctbSupportPlane` is FALSE in EVERY arm (asserted per arm in '
    + 'gates.flagHygiene.twoDoors off the REAL constructed matches, not merely stated), so the '
    + 'banked static bank cannot leak in and the OBM policy\'s INTERCEPT is a hard 0 by the #228 '
    + 'fix. `obmMovement` is on iff the arm has a matrix. And NO ARM EVER OPENS BOTH '
    + '`dlcDeliveryChoice` AND `ptpPassLead` (`neverBothDeliveryDoors`): under DLC-T0 §LAW the '
    + 'BANKED SEAM KEEPS PRECEDENCE by arithmetic — the two aims are the same doubles and the '
    + 'tie rule keeps the incumbent — so an armed-both arm would silently BE the forced dose '
    + 'wearing the contest\'s name, and the whole CHOICE-versus-FORCED-DOSE contrast would be a '
    + 'comparison of an arm with itself.',
  thinChannelDeclaration: '⭐⭐ THE EXAM TESTS THE HONEST (THIN) CHANNEL, DECLARED AT THE HEAD '
    + 'RATHER THAN DISCOVERED AT THE FOOT (#232.3, inherited). In a percept world the passer '
    + 'projects only the mates his OWN EYES carry a remembered velocity for; PTP-T0 measured 921 '
    + 'of 1,109 support projections EXACTLY ZERO here, and PTP-T1 delivered a led share of '
    + '18.5–22.3 % at battery N against a bare world\'s 62.9 %. ⭐ UNDER THIS CONTRACT THAT '
    + 'LIMIT IS NO LONGER A WEAKNESS OF THE MECHANISM (DLC-T0 §HONESTY): a mate the carrier '
    + 'cannot project simply has ONE candidate, and the ball goes to his feet — which is a '
    + 'footballing outcome rather than an undelivered treatment. ⚠ AND IT SETS THE CEILING ON '
    + 'THE EMERGENT LED SHARE: the contest can only choose a led ball where a projection exists '
    + 'at all, so its share is bounded ABOVE by the forced dial\'s ~19 %, and a smaller number '
    + 'is the chooser DECLINING leads, not the channel failing. The two readings are '
    + 'distinguishable only WITH the anchor arm beside it, which is why the anchor is walked.',
  preRegisteredSuccess: 'contract §1 H-DLC, VERBATIM: "Pre-registered prediction (the #234 '
    + 'poison inverted): at the CHOICE arm the TRUE-holdable gain is retained (resolved helpful) '
    + 'AND goals stay inside the frozen band." ⭐ IT IS ONE PREDICTION WITH TWO LIMBS THAT MUST '
    + 'HOLD JOINTLY — the forced dial already had the gain (#234: +0.1307 pp resolved at LEAD) '
    + 'and died on the band, and the band alone is what ABSENT has for free; the contract\'s '
    + 'claim is that the CONTEST buys the first WITHOUT spending the second. FAIL branches '
    + 'pre-named in contract §3: F-DLC-a (the contest RETAINS the poison — goals out of band at '
    + 'CHOICE; the pricing itself misprices leads and the aim-evaluation surgery reopens) · '
    + 'F-DLC-b (the contest KILLS the gain — supply null at CHOICE; the T1 gain was the '
    + 'forcing\'s artifact) · F-DLC-c (the inherited guard STOPs). ⚠ THIS PROBE FIRES NONE OF '
    + 'THEM: it emits PER-ARM ROWS and paired deltas with mechanical `resolved` CI flags only '
    + '(#203); adjudication is the commander\'s.',
  preRegisteredPrimary,
  preRegisteredStopGranularity: '⭐ FROZEN EX ANTE, INHERITED VERBATIM (#225.3(c); stage doc '
    + '§SUCCESS): F-DLC-b and F-DLC-c fire PER DOSE — a dose whose guard BREACHES (resolved AND '
    + 'beyond the frozen tolerance) is DISQUALIFIED as a candidate, and the ARC-level STOP fires '
    + 'only if EVERY dose that moves the primary ruler helpfully is disqualified. The DELIVERED '
    + 'reading is frozen with it: every row is read beside its DELIVERED dose (mean |plane '
    + 'shift|, the four support-tick classes, the clamp shares, the score-mul distributions), so '
    + 'a null result can never be read as a strong dose that failed when it was a weak dose that '
    + 'arrived. The band rule is frozen with it too: the equilibrium band GATES at battery N '
    + 'only; at any N the #198-form exclusion applies (dimensions the ABSENT arm itself fails are '
    + 'excluded AND disclosed). ⚠ THIS PROBE STILL FIRES NOTHING (#203) — this is the '
    + 'pre-registered GRANULARITY of the commander\'s own adjudication, recorded here so it '
    + 'cannot be re-cut after sight.',
  rulerProvenance: {
    r1: 'the O2-T1 `trueCellOf` instrument VERBATIM on the #186 eligible-moment population; '
      + 'control read 0.639% at N=320. Gate: G-REPRO-O2T1.',
    r2: 'the #173 tempo-census pressed-first-reception instrument (openPlay-origin spells, '
      + 'TOUCH_CONTROL_DIST 4.2 m); baseline 80.8%. Gate: G-REPRO-173.',
    r3: 'SHORT-OPTION SUPPLY — #224.4(i)\'s named CI-unprotected debt, instrumented DIRECTLY '
      + 'for the first time; radius family PARSED from source. Gate: G-TRACE-RADIUS.',
    r4: 'support-existence at PRESSED moments = r3\'s predicate under r2\'s pressure test — '
      + 'H-CTB\'s core quantity, published at BOTH grains.',
    r5: 'the #218 shares: LIFTED — the goal-genealogy ORIGIN CLASSIFIER ported with its LOSS-TICK '
      + 'semantics verbatim (#215.3-H1/M2) and published per arm (constructed ladder ≥3/4/5, '
      + 'scramble share, set-piece share, turnover-by-third origins). Gate: G-REPRO-GGC. '
      + 'REPORTED ONLY — no gate hangs on any of these shares in T1.',
    inheritance: '⭐ THE WHOLE SET IS OBM-T1\'s (and through it CTB-T1\'s), and that is PROVED '
      + 'not asserted: G-REPRO-OBMT1 re-walks the committed OBM-T1 battery block\'s first rows '
      + 'on TWO arms — its ABSENT world and its CHECK-AND-SHOW matrix — and G-REPRO-CTBT1 '
      + 're-walks the committed CTB-T1 battery block in CTB-T1\'s own ABSENT world; both must '
      + 'reproduce every published field EXACTLY, whole-match signature included.',
  },
  primaryRulers: '⭐ JOINT, FROZEN EX ANTE (see `preRegisteredPrimary`): ruler 1 '
    + '(TRUE-holdable supply) RESOLVED HELPFUL **AND** the `goals` equilibrium-band dimension IN '
    + 'BAND, both at the CHOICE cell, both together. ⭐ REPORTED HEADLINE beside it: the '
    + 'EMERGENT LED SHARE (the number the retired dial fixed at 1) with its situational profile. '
    + 'Ruler 2 (pressed-first-reception) stays published with its CI as the second supply column '
    + 'and is the N rule\'s second limb, but it is NOT part of this contract\'s prediction. '
    + 'Rulers 3 and 4 stay REPORTED with their ceilings DISCLOSED (`saturationCeilings`); the '
    + '#218 tier-2 shares stay REPORTED with CIs — no gate reads any of them.',
  tableSha: EXPECTED_TABLE_SHA,
  frozenParameters: {
    perMatchCap: PER_MATCH_CAP, momentSpacing: MOMENT_SPACING, horizon: HORIZON,
    supportWindowM: [SUPPORT_MIN_M, SUPPORT_MAX_M], pressureRadiusM: PRESSURE_R,
    duration: MATCH_DURATION, sampleEvery: SAMPLE_EVERY, pairSubsample: PAIR_SUBSAMPLE,
    closePairM: CLOSE_PAIR_M, niFraction: round(NI_FRACTION, 6),
    samplingBudgetNote: 'the #186 sampling BUDGET (cap 80, spacing 30) is untouched; the WALK '
      + 'continues to full time after the cap so the whole-match instruments exist. The sampled '
      + 'moment SET is bit-identical to the O2-T1 walker\'s — which is what G-REPRO-O2T1 proves.',
  },
  nRule,
  saturationCeilings,
  ...bodyA,
  guardVerdicts: {
    tolerances: guardRows,
    offside: {
      rows: offsideRows,
      note: 'the #157 FLAG form (PM-T1): a RESOLVED increase raises a FLAG that returns to the '
        + 'commander; it flips no gate here.',
    },
    band: {
      baseline: BAND_BASELINE, tolerance: BAND_TOLERANCE,
      excludedBecauseControlFails: bandExcluded, gatedDimensions: bandGated,
      rows: bandRows,
      note: 'the A4-S2P3 §4.2 equilibrium band inherited VERBATIM with its declared '
        + 'substrate-drift exclusion: a dimension the ABSENT arm itself fails is DISCLOSED and '
        + 'EXCLUDED rather than silently failed by every arm.',
    },
    note: 'GUARD ROWS ONLY (#203). `breach` = resolved AND beyond the ex-ante tolerance; it is '
      + 'EVIDENCE for F-DLC-b/c, never the firing of it.',
  },
  gates,
  allGatesPass,
};
const resultSha256 = sha(canonical(body));

const wallMs = Date.now() - wall0;
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  /* ⭐ #197-M1/#198: EVERYTHING below rides OUTSIDE resultSha256 — git head, wall clock,
   * paths and checkpoint state. resultSha256 recomputes identically at any later commit. */
  envelopeContextOnly: {
    headContextOnly: head,
    wallMsContextOnly: wallMs,
    wallNote: 'CONTEXT ONLY (#128) — used in NO rate and in no gate',
    outPath: OUT_PATH,
    srcDiffStat: srcDiff,
    tablePath: TABLE_PATH,
    o2t1Path: O2T1_PATH,
    tempoPath: TEMPO_PATH,
    tempoSmokePath: TEMPO_SMOKE_PATH,
    ggcSmokePath: GGC_SMOKE_PATH,
    checkpoint: {
      armed: CHECKPOINTING, path: CHECKPOINTING ? CKPT_PATH : null, resumeRequested: RESUME,
      restoredPass1: coreA.restored.length, computedPass1: coreA.computed.length,
      restoredPass2: coreB.restored.length, computedPass2: coreB.computed.length,
      note: 'RESILIENCE ONLY. The unit is the per-(pass, seed) set of 5 arm rows; nothing pooled '
        + 'is stored and every quantity, gate, digest and resultSha256 is recomputed from the '
        + 'union — a resumed run is byte-identical to a fresh one. /tmp scratch, never committed, '
        + 'never read by a gate.',
    },
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §16 THE TRANSCRIPT — PER-ARM ROWS AND DELTAS ONLY (#203)                    */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number): string => `${(x * 100).toFixed(4)}%`;
const rowLine = (label: string, key: RateKey, asPct = true, dp = 4): void => {
  o(`  ${label}`);
  for (const a of ARMS) {
    const c = C[key][a];
    const f = (v: number): string => (asPct ? pct(v) : v.toFixed(dp));
    const d = c.pairedDelta;
    o(`    ${a.padEnd(16)} ${f(c.point).padStart(12)}`
      + (d === null ? '   (CONTROL)'
        : `   Δ ${String(d.point).padStart(11)} [${d.lower}, ${d.upper}] resolved=${c.resolved}`));
  }
};
o('');
o(`=== DLC-T1 CHOICE EXAM · mode ${MODE} · ${body.block} (${RUN_N} seeds/arm, shared) ===`);
o('world: PERCEPT-ARMED (edsPerceivedChoice) · ctbSupportPlane FALSE in every arm');
o(`arms differ by EXACTLY the delivery DOOR + the OBM matrix · NO arm opens both delivery doors`
  + ` · Δ = ARM − ${CONTROL_ARM}`);
o('  doors: ' + ARMS.map((a) => `${a}=${DOOR[a]}`).join(' · '));
o(`estimator: paired seed-cluster bootstrap, ratio-of-totals, 2.5/97.5, ${BOOTSTRAP_RESAMPLES} `
  + `resamples, stats base ${BOOTSTRAP_SEED}`);
o('');
o('THE RULER');
rowLine('1  TRUE-holdable supply (share of eligible moments)', 'trueHoldableShare');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].ruler1TrueHoldable;
  o(`    ${a.padEnd(16)} n_true ${String(s.trueHoldableTotal).padStart(4)} / eligible ${s.eligibleTotal}`);
}
rowLine('2  PRESSED first reception (openPlay spells, 4.2 m)', 'pressedFirstReceptionShare');
rowLine('3a SHORT-OPTION supply — possession ticks', 'shortOptionPossShare');
rowLine('3b SHORT-OPTION supply — first receptions', 'shortOptionFirstRecShare');
rowLine('4a SUPPORT-EXISTENCE at PRESSED possession ticks', 'supportAtPressedPossShare');
rowLine('4b SUPPORT-EXISTENCE at PRESSED first receptions', 'supportAtPressedFirstRecShare');
rowLine('5  goals per match (the #218 shares are LIFTED — rows below)', 'goalsPerMatch', false);
o('');
o('RULER 5 — THE #218 LIFT (REPORTED; no gate reads these · G-REPRO-GGC proves the port)');
for (const a of ARMS) {
  const g = (bodyA.arms as any)[a].ruler5BuildUp.genealogy;
  o(`  ${a.padEnd(16)} goals ${String(g.goals).padStart(3)} · constructed≥3 `
    + `${pct(g.constructedLadder.nonSetPiece.ladder.ge3.constructedShareOfPool)}`
    + ` · ≥4 ${pct(g.constructedLadder.nonSetPiece.ladder.ge4.constructedShareOfPool)}`
    + ` · ≥5 ${pct(g.constructedLadder.nonSetPiece.ladder.ge5.constructedShareOfPool)}`
    + ` · scramble ${pct(g.scrambleShareOfGoals)} · setPiece ${pct(g.setPieceShareOfGoals)}`
    + ` · turnover own/mid/final ${pct(g.turnoverByThirdOriginShares.own)}/`
    + `${pct(g.turnoverByThirdOriginShares.middle)}/${pct(g.turnoverByThirdOriginShares.final)}`);
}
o('  (the same five shares, PAIRED and bootstrapped — REPORTED, no gate reads them)');
rowLine('5a constructed ≥3 passes (non-set-piece pool)', 'constructedGe3Share');
rowLine('5b constructed ≥4 passes (non-set-piece pool)', 'constructedGe4Share');
rowLine('5c constructed ≥5 passes (non-set-piece pool)', 'constructedGe5Share');
rowLine('5d scramble share of goals', 'scrambleShareOfGoals');
rowLine('5e set-piece share of goals', 'setPieceShareOfGoals');
o('');
o('THE CEILINGS (rulers 3b/4b are near-saturated — disclosed, computed from these rows)');
for (const [k, c] of [['4b support@pressed first rec', saturationCeilings.ruler4bSupportAtPressedFirstRec],
  ['3b short option / first rec', saturationCeilings.ruler3bShortOptionFirstRec]] as const) {
  o(`  ${k}: ABSENT ${c.absentLevelPct}% ⇒ helpful headroom ${c.helpfulHeadroomPp} pp`);
  for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
    const r = (c.perArm as any)[a];
    o(`    ${a.padEnd(16)} Δ ${String(r.deltaPp).padStart(7)} pp = ${(r.shareOfHeadroomConsumed * 100).toFixed(1)}%`
      + ` of the headroom · resolved=${r.resolved}`);
  }
}
o('');
o('THE SEAT, REACHED (G-ARM: the four support-tick classes partition exactly)');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].seam;
  o(`  ${a.padEnd(16)} supportTicks ${String(s.supportTicks).padStart(7)} · policyWrites `
    + `${String(s.policyCacheEntries).padStart(5)} · shifted ${String(s.supportTicksShifted).padStart(7)}`
    + ` · planeZero ${String(s.planeZeroTicks).padStart(7)} · planeAbsent ${String(s.planeAbsentTicks).padStart(7)}`
    + ` · clampBound ${String(s.supportTicksUnshiftedClampBound).padStart(5)}`
    + ` · partition=${s.partitionExact}`);
}
o('');
o('⭐ THE DELIVERED DOSE (dose ≠ delivered — read where the executor consumes it)');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].seam;
  o(`  ${a.padEnd(16)} meanShift ${String(s.meanShiftMetres).padStart(8)} m · max `
    + `${String(s.maxShiftMetres).padStart(7)} m · moved ${pct(s.shiftedShareOfSupportTicks)}`
    + ` · ≥1 m ${pct(s.shiftGe1mShareOfSupportTicks)} · plane d/w `
    + `${String(s.meanPlaneDepthOnPresent).padStart(8)}/${String(s.meanPlaneWidthOnPresent).padStart(8)}`
    + ` · behindBall ${pct(s.behindBallShare)} · clampX ${pct(s.clampXShare)}`);
}
o('  the FEATURES and the SCORE MULTIPLIERS (observational read, seed '
  + `${DOSE_READ_SEED}, DESCRIPTIVE ONLY)`);
for (const a of ARMS) {
  const d = (bodyA as any).deliveredDose[a];
  o(`    ${a.padEnd(16)} f[${d.featureMeans.join(', ')}] · out[${d.outputMeans.join(', ')}]`
    + ` · supportMul ${d.supportMul.mean} [${d.supportMul.p05}, ${d.supportMul.p95}]`
    + ` · runMul ${d.runMul.mean} [${d.runMul.p05}, ${d.runMul.p95}]`
    + ` · zeroFeatureShare ${pct(d.allFeaturesZeroShare)}`);
}
o('');
o('⭐⭐ THE EMERGENT LED SHARE (the number the RETIRED DIAL used to fix at 1) — REPORTED');
for (const a of ARMS) {
  const l = (bodyA.arms as any)[a].leadSeam;
  o(`  ${a.padEnd(16)} gene ${String(GENE[a]).padStart(5)} · passes ${String(l.passesChosen).padStart(6)}`
    + ` · handed ${String(l.ledPassesHandled).padStart(6)} · NON-ZERO ${String(l.ledPassesNonZero).padStart(6)}`
    + ` (${pct(l.ledShareOfChosenPasses)}) · meanLead ${String(l.meanLeadMetres).padStart(7)} m`
    + ` · max ${String(l.maxLeadMetres).padStart(7)} m · lead/passDist ${l.meanLeadShareOfPassDistance}`
    + ` · interceptions/ledPass ${l.interceptionsPerLedPass}`);
}
o('  the LEAD LAW on the passes actually chosen (observational read, seed '
  + `${DOSE_READ_SEED}, DESCRIPTIVE ONLY)`);
for (const a of ARMS) {
  const d = (bodyA as any).deliveredDose[a];
  o(`    ${a.padEnd(16)} checked ${String(d.leadChecked).padStart(5)}`
    + ` · signViolations ${d.leadSignViolations} · magnitudeViolations ${d.leadMagnitudeViolations}`);
}
o('  ⭐ the SITUATIONAL PROFILE (led share at PRESSED vs UNPRESSED carrier moments — REPORTED,');
o(`     bin = nearest opponent within ${PRESSURE_R} m of the CARRIER at the instant of the strike)`);
for (const a of ARMS) {
  const sp = (bodyA.arms as any)[a].leadSeam.situationalLedShare;
  o(`    ${a.padEnd(16)} pressed ${pct(sp.ledShareAtPressed)} (${sp.ledAtPressed}/${sp.pressedTotal})`
    + ` · unpressed ${pct(sp.ledShareAtUnpressed)} (${sp.ledAtUnpressed}/${sp.unpressedTotal})`
    + ` · partition=${sp.partitionExact}`);
}
o('');
o('⭐⭐ THE JOINT PRE-REGISTERED PRIMARY (mechanical flags only — #203, NOTHING is fired)');
o('  contract §1 H-DLC: at CHOICE, trueHoldableShare RESOLVED HELPFUL *AND* goals IN BAND — JOINTLY');
for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
  const j = a === CHOICE_ARM ? preRegisteredPrimary.primaryAtChoice
    : (preRegisteredPrimary.allArms as any)[a];
  const sl = j.supplyLimb; const bl = j.goalsBandLimb;
  o(`    ${a.padEnd(16)} supply Δ ${String(sl.delta).padStart(11)} [${sl.ci === null ? '' : sl.ci[0]}, `
    + `${sl.ci === null ? '' : sl.ci[1]}] resolvedHelpful=${sl.resolvedHelpful}`
    + ` · goals/match ${bl.goalsPerMatch} in [${bl.bandLo}, ${bl.bandHi}] inBand=${bl.inBand}`
    + ` · JOINT=${j.jointSatisfied}${j.whichLimbFails === null ? '' : ` (fails: ${j.whichLimbFails})`}`);
}
o('  ⚠ the goals BAND gates at battery N only (inherited verbatim) — at smoke grain it is plumbing');
o('');
o('⭐ THE #218 TIER-2 SHARES — REPORTED WITH CIs, no gate reads them');
rowLine('  5c constructed >=5 passes (non-set-piece pool)', 'constructedGe5Share');
rowLine('  5d scramble share of goals', 'scrambleShareOfGoals');
o('');
o('THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)');
for (const g of guardRows) {
  o(`  ${g.key} [${g.family}, ${g.direction}] control ${g.controlLevel} · tol ±${g.toleranceAbs}`);
  for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
    const r = (g.arms as any)[a];
    o(`    ${a.padEnd(16)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
      + ` resolved=${r.resolved} beyondTol=${r.beyondTolerance} BREACH=${r.breach}`);
  }
}
o('  offsides/match (the #157 FLAG form — returns to the commander, flips no gate)');
for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
  const r = (offsideRows as any)[a];
  o(`    ${a.padEnd(16)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
    + ` resolved=${r.resolved} resolvedIncrease=${r.resolvedIncrease}`);
}
o(`  equilibrium band — gated dimensions ${JSON.stringify(bandGated)}`
  + ` · EXCLUDED (control itself out of band) ${JSON.stringify(bandExcluded)}`);
for (const a of ARMS) {
  o(`    ${a.padEnd(16)} allGatedInBand=${(bandRows as any)[a].allGatedDimensionsInBand}`);
}
o('');
o('N RULE (in-probe, from the committed artifacts)');
if (nRule.available) {
  const nr = nRule as any;
  o(`  DEFF ${nr.deff} (measured off the O2-T1 committed paired-delta CI)`);
  o(`  q1 TRUE-holdable (MDE = the O2-T1 resolved delta ${nr.q1TrueHoldable.mde}): m_req `
    + `${nr.q1TrueHoldable.mReq} ⇒ N ${nr.q1TrueHoldable.n}`);
  o(`  q2 pressed-first-reception (MDE = ${nr.q2PressedFirstReception.mde}, the census's own `
    + `smallest cross-arm gap): m_req ${nr.q2PressedFirstReception.mReq} ⇒ N ${nr.q2PressedFirstReception.n}`);
  o(`  DEFF source ${nr.deffProvenance}`);
  o(`  p0 source ${nr.sourceOfP0}`);
  o(`  binding ${nr.binding} · N_raw ${nr.nRaw} ⇒ N* ${nr.nStar} (ledger room ${nr.batteryRoom}, `
    + `binds=${nr.roomBinds} · cap ${nr.nCap}, binds=${nr.capBinds}) · battery block ${nr.batteryBlock}`);
  if (nr.capBinds) o(`  ⚠ ${nr.capForkNote}`);
}
o('');
o('GATES');
for (const [k, g] of Object.entries(gates)) o(`  ${k.padEnd(20)} ${(g as any).pass ? 'PASS' : '*** FAIL ***'}`);
o(`  ALL                ${allGatesPass ? 'PASS' : '*** FAIL ***'}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${Math.round(wallMs / 1000)} s (CONTEXT ONLY) · artifact ${OUT_PATH}`);
if (!allGatesPass || OVERRIDDEN) process.exitCode = 1;
