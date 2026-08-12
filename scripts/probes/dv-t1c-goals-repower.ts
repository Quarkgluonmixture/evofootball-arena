// DV T1c — THE GOALS RE-POWER: DV-T1 read goals +0.2438 [0.0459, 0.4205] RESOLVED toward the band
// at the parity rung; DV-T1b read +0.040435 [-0.083981, 0.167963] on virgin seeds and did NOT
// replicate it. Ruling #253.1's disposition, run as a TWO-ARM REDUCTION of DV-T1b on VIRGIN SEEDS
// at an N sized EX ANTE to the INVERSE-VARIANCE POOLED point of those two committed readings.
//
// Doc:      docs/world-model/DV-T1C-GOALS-REPOWER.md (§FORM/§N/§SEEDS/§GATES frozen before sight)
// Charter:  ruling #253.1 — "TWO arms only — PLANE-ANCHOR · dvTruthP, configurations
//           byte-identical to T1/T1b (identity via re-walks of BOTH prior batteries' committed
//           rows). N sized EX ANTE to resolve the POOLED T1+T1b goals-vs-anchor point
//           (inverse-variance pooling of the two committed artifacts' published CIs — a
//           published-numbers derivation, shown before any battery) at 80 % power / 95 %
//           two-sided; block 12,432,000+ (room to 12,434,999); stats >= 107,000. Frozen letter =
//           goals delta dvTruthP vs anchor (supply republished for continuity). Routes pre-named:
//           RESOLVED-RECOVER => the goals half stands on its own properly-powered exam (with
//           #252.2's supply half, the #244 inversion then stands whole, each limb on a powered
//           virgin battery) · RESOLVED-NULL => T1's +0.2438 was a first-resolution overshoot; the
//           goals question closes honest-negative at these doses · UNRESOLVED at N* => a
//           commander's honesty ruling."
// Contract: docs/world-model/DELIVERY-VALUE-CONTRACT.md §3 — the JOINT's two limbs, verbatim.
// Rulings:  #252 (DV-T1b adjudicated: the SUPPLY half of the #244 inversion STANDS at exam grain,
//           F-DV-b closed permanently; the GOALS half did not replicate and is OPEN) ·
//           ⭐ #252.3 (THE LESSON THIS PROBE IS BUILT AGAINST: a route consequent that silently
//           EMBEDS another limb is a defect — #251.2's HELPFUL consequent said "the #244 inversion
//           is COMPLETE" while limb B was unreplicated. This probe's route consequents are
//           #253.1's OWN WORDS, verbatim, and nothing else) · ⭐ #252.3 again (the mutant-liveness
//           proof covered 4/7 conjuncts — future liveness proofs give EVERY conjunct a mutant, and
//           this one does, with machine-checked coverage) · #251.3 (never inherit another exam's
//           configuration predicate; MODE-CONDITION every caveat literal) · #250.3 (machine
//           timings ride the UNHASHED envelope so `resultSha256` re-derives; percentage grep-forms
//           FORMATTED before String()) · #250.4 (H-250a, the delivered-rate publication, the
//           no-cost-% rule) · #249 (DV-C0 — THE TRUE TABLE, the belief dose) · #247 (TRUTH vs
//           BELIEF: the census table is the INSTRUMENT's and is DOSED, never wired into src) ·
//           #244 (THE FAILURE THE ARC INVERTS) · #225.3(c) · #207 (checkpoint) · #203 (ROWS,
//           never verdicts — this probe PRINTS the route and RESOLVES nothing) · #197-M1/#198 ·
//           #181.2 · #163 · #20 · #128.
//
// ⭐ INSTRUMENT-ONLY ROUND. src/** is byte-untouched (X-SRC-UNTOUCHED is a HARD gate). The two
// arms are built by exactly the constructors DV-T1 and DV-T1b used, from THIS file's own DOOR /
// GENE / DOSE / DV tables — and the CONFIGURATION IDENTITY is not asserted from those tables, it
// is EARNED TWICE: ⭐⭐ G-REPRO-T1 re-walks the first rows of DV-T1's OWN COMMITTED BATTERY BLOCK
// and ⭐⭐ G-REPRO-T1B re-walks the first rows of DV-T1b's, both on BOTH of this exam's arms,
// through this exam's own arm constructors, and both must reproduce every published field EXACTLY
// — whole-match signature (rng stream state inside) and the delivered-strike columns included.
// Beside them a DERIVED (never inherited) configuration-identity predicate is published WITH A
// MUTANT FOR EVERY CONJUNCT and a machine-checked COVERAGE row (the #252.3 LOW discharged).
//
// ⭐⭐ THERE IS NO CONTROL ARM (#253.1: "TWO arms only"). The goals limb gates on the PAIRED delta
// dvTruthP vs planeAnchor, so the control buys nothing the letter reads — and every seed spent on
// it is a seed not spent on the pooled point. Consequences, DECLARED rather than discovered: every
// paired delta in this artifact is referenced to the ANCHOR (`BASE_ARM === ANCHOR_ARM`), and the
// three quantities that used to be cut on the absent arm — the guard tolerances, the band's
// #198-form exclusion set and the saturation headroom — are READ FROM DV-T1b's COMMITTED ARTIFACT
// (its own absent arm, 643 clusters) rather than re-measured here. G-FROZEN-BASES is the gate.
//
// ⭐⭐ N IS SIZED EX ANTE, FROM THE TWO COMMITTED ARTIFACTS' PUBLISHED CIs, BEFORE ANY BATTERY RAN:
// each half-width gives an SE (half-width / z.975), the SEs give inverse-variance weights
// (1/se^2), the weights give the POOLED point and the POOLED SE, and N is the cluster count at
// which DV-T1b's OWN paired SE on this same column gives 80 % power to resolve THAT POOLED POINT
// at 95 % two-sided (the 1/sqrt(N) cluster law, #20). See `poolingRule` below and §N in the doc.
// G-N machine-checks the frozen literal against the derivation and publishes the MDE bought.
//
// ⭐ THE BELIEF DOSE IS DV-C0's TRUE TABLE, read at exam time (INSTRUMENT -> GENES, never CODE ->
// TABLE), and the EXPOSURE dose is the PARITY rung re-derived here from DV-T0's own published
// numbers — the same two derivations DV-T1 and DV-T1b ran, re-run rather than copied (G-DOSE).
//
//   DVT1C_MODE=smoke|full    (default smoke: 8 seeds @ 12,432,000)
//   DVT1C_RESUME=1           full mode only — restore finished (pass, seed) units (#207)
//   DVT1C_CHECKPOINT=<path>  /tmp scratch; never committed, never read by a gate
//   DVT1C_N=<n> / DVT1C_SKIP_FP=1 — OVERRIDES: routed onto the EXIT-SEMANTICS GUARD BLOCK, turn
//                            G-CLEAN-INVOCATION RED and exit 1. Such a run adjudicates nothing.
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
import {
  deliveryRiskPrice, deliveryValueSeatOf, flightExposure, receptionZoneIndex,
} from '../../src/ai/deliveryValueSeat';
import { dvExposureWeightOf, dvLossBeliefVector } from '../../src/evolution/genome';
import {
  STRIKE_PLANE_K, STRIKE_PLANE_STEPS, STRIKE_PLANE_ZERO_INDEX, groundStrikeGrid, strikePlaneSeatOf,
} from '../../src/ai/strikePlaneSeat';
import { randomSquad } from '../../src/evolution/playerGenome';
import { DEFAULT_POLICY, TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
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
const MODE = (process.env.DVT1C_MODE ?? 'smoke') === 'full' ? 'full' : 'smoke';
/** ⭐ FRESH, and strictly above EVERYTHING DV-T1b consumed (its committed ledger, read off
 *  `data/dv-t1b-power-extension.json`'s `gates.seedDisjoint`: 12,431,000–007 smoke ·
 *  12,431,010/015/020 its three declared reads · 12,431,050–099 guard · 12,431,100–742 battery ·
 *  12,431,900–999 its reserved ceiling). Ruling #253.1 grants this stage the block 12,432,000+
 *  with room to 12,434,999, so the smoke block opens the grant on its round number. Clash-freedom
 *  is proved IN-PROBE against the COMPLETE ledger below, never asserted here. */
const SMOKE_BASE = 12_432_000;
const SMOKE_N = 8;
/** ⭐ THE DELIVERED-DOSE READ's own seed (one match per arm, OBSERVATIONAL — see §6c). It is
 *  a DECLARED fourth block, not a re-use of the exam block: the read pulls percepts
 *  out-of-band, so it may never touch a match whose rows are exam data. */
const DOSE_READ_SEED = 12_432_010;
/** ⭐ THE STRIKE READ's own declared seed (one traced + one untraced match per arm — the
 *  DLC-T0s substitution decode's form, lifted whole). It pulls percepts and re-derives grids, so
 *  it may never touch a match whose rows are exam data. */
const STRIKE_READ_SEED = 12_432_015;
const GUARD_BLOCK: readonly [number, number] = [12_432_050, 12_432_099];
const BATTERY_BASE = 12_432_100;
/** ⭐ THERE IS NO DISPATCH CAP AT THIS STAGE, AND THAT IS A DELIBERATE REDUCTION IN THE NUMBER OF
 *  CEILINGS. Ruling #253.1 names exactly ONE bound — "block 12,432,000+ (room to 12,434,999)" —
 *  so the only ceiling this file carries is the STRUCTURAL one computed from the seed ledger
 *  (`BATTERY_ROOM`), and a second hand-typed cap would be a second source of truth for the same
 *  fact. If the pooling rule asks for more clusters than the room allows, the ROOM is run and the
 *  MDE actually bought is DECLARED (`mdeBoughtAtNStar`), never quietly re-cut (#253.1: "if N
 *  exceeds the room, run the room and declare the MDE bought"). `roomBinds` is published either
 *  way. */
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
 *  DLC-T1 BATTERY block, re-walked on ITS CHOICE ARM (`dlcDeliveryChoice` armed,
 *  `passLeadSupport` 1, no OBM) in DLC-T1's OWN percept-armed world. The CHOICE-ANCHOR exam arm
 *  and this re-walk are THE SAME CONFIGURATION, which is what makes the CONTRAST anchor honest:
 *  the arm this exam sets the PLANE against — and against which the #240 OVERSHOOT prediction is
 *  read — is proved, field for field with the whole-match signature and the DELIVERED-STRIKE
 *  columns included, to be the very arm ruling #239 adjudicated.
 *  A DELIBERATE re-walk (receipt), never fresh data; its seed predicate is INVERTED (it MUST
 *  collide with its source's consumed interval). */
const REPRO_DLCT1S_BASE = 12_428_100;
const REPRO_DLCT1S_N = 8;
/** ⭐⭐ THE IDENTITY OF RECORD, HALF ONE — G-REPRO-T1: the first rows of DV-T1's OWN COMMITTED
 *  BATTERY BLOCK, re-walked on BOTH of this exam's arms THROUGH THIS EXAM'S OWN ARM CONSTRUCTORS
 *  (`matchOf` reading this file's DOOR / GENE / DOSE / DV tables). Every published field must
 *  reproduce EXACTLY — the whole-match signature (rng stream state inside) and the
 *  delivered-strike columns included. This is what makes "configurations byte-identical to
 *  T1/T1b" (#253.1) an EARNED fact rather than an inherited assertion: a door, a gene, a dose or
 *  a belief vector that differed anywhere could not reproduce a single signature.
 *  A DELIBERATE re-walk (receipt), never fresh data; its seed predicate is INVERTED. */
const REPRO_DVT1_BASE = 12_430_100;
const REPRO_DVT1_N = 8;
/** ⭐⭐ THE IDENTITY OF RECORD, HALF TWO — G-REPRO-T1B: the same receipt against the OTHER parent.
 *  Ruling #253.1 says "identity via re-walks of BOTH prior batteries' committed rows", so DV-T1b's
 *  own committed battery block is re-walked here too, on BOTH arms, field-exact. ⭐ The two halves
 *  are NOT redundant: DV-T1 and DV-T1b published rows for the SAME two arm configurations on
 *  DIFFERENT seeds, so reproducing both is a statement about the configuration rather than about
 *  one block of seeds. A DELIBERATE re-walk (receipt), never fresh data; predicate INVERTED. */
const REPRO_DVT1B_BASE = 12_431_100;
const REPRO_DVT1B_N = 8;
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
  /** ⭐ read off the COMMITTED DLC-T1 artifacts' own `gates.seedDisjoint.walkedBlocks`. */
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_041] },
  { name: 'DLC-T1 delivered-dose read (#238)', range: [12_426_045, 12_426_045] },
  { name: 'DLC-T1 guard band (#238)', range: [12_426_050, 12_426_099] },
  /** ⭐⭐ the block G-ANCHOR RE-WALKS: DLC-T1's battery + reserve (#238/#239), counted at its
   *  RESERVED extent (walked 100..545, reserved to 727). */
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  /** ⭐ read off the COMMITTED DLC-T0s artifact's own `gates.seedDisjoint.intervals`. */
  { name: 'DLC-T0s receipts + grid/winner/EPI/smoke/decode read (#242)', range: [12_427_000, 12_427_024] },
  { name: 'DLC-T0s REPORTED chooser-cost reading (#242)', range: [12_427_025, 12_427_025] },
  { name: 'DLC-T0s test-file seeds (#242)', range: [12_427_900, 12_427_906] },
  /** ⭐ THIS STAGE'S OWN RESERVED CEILING: the 12,428,9xx test-seed band, entered in the ledger
   *  ex ante so the battery ROOM is FINITE and the battery block can never run past
   *  12,428,899 — the same structural ceiling every stage in this family has carried. */
  /** ⭐⭐ the block G-ANCHOR RE-WALKS: DLC-T1s's battery + reserve (#243/#244), counted at its
   *  RESERVED extent (walked 100..545, reserved to 727), plus its own reads and test band —
   *  read off the COMMITTED DLC-T1s artifact's own ledger. */
  { name: 'DLC-T1s smoke (#243)', range: [12_428_000, 12_428_011] },
  { name: 'DLC-T1s delivered-dose read (#243)', range: [12_428_015, 12_428_015] },
  { name: 'DLC-T1s strike read (#243)', range: [12_428_020, 12_428_020] },
  { name: 'DLC-T1s guard band (#243)', range: [12_428_050, 12_428_099] },
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_727] },
  { name: 'DLC-T1s reserved test-seed band (#243)', range: [12_428_900, 12_428_906] },
  /** ⭐ read off the COMMITTED DV-C0 artifact's own ledger (#249). */
  { name: 'DV-C0 smoke (#249)', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 guard band (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD read (#249)', range: [12_429_999, 12_429_999] },
  /** ⭐ read off the COMMITTED DV-T0 artifact's own ledger (#250) — the seam this stage doses.
   *  ⚠ ITS TEST BLOCK 12,430,900–911 IS THE ONE THE DISPATCH ORDERS SKIPPED, and it is entered
   *  here so the skip is a MACHINE-CHECKED disjointness fact rather than a promise. */
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_024] },
  { name: 'DV-T0 REPORTED cost read (#250)', range: [12_430_025, 12_430_025] },
  { name: 'DV-T0 REPORTED truth-dosed smoke (#250)', range: [12_430_026, 12_430_026] },
  { name: '⚠ DV-T0 test-file seeds (#250 — THE ORDERED SKIP)', range: [12_430_900, 12_430_911] },
  /** ⭐ read off the COMMITTED DV-T1 artifact's own `gates.seedDisjoint.walkedBlocks` (#251) —
   *  the exam this stage EXTENDS. ⭐⭐ Its BATTERY block is the one G-REPRO-T1 re-walks, so it is
   *  entered here BOTH as consumed ground (nothing fresh may touch it) AND as the interval the
   *  re-walk's INVERTED predicate must land inside. The H-250a read seed is entered too: DV-T1's
   *  own walked-block list omitted it, and an omitted block is an unchecked block. */
  { name: 'DV-T1 smoke (#251)', range: [12_430_027, 12_430_038] },
  { name: 'DV-T1 delivered-dose read (#251)', range: [12_430_040, 12_430_040] },
  { name: 'DV-T1 strike read (#251)', range: [12_430_045, 12_430_045] },
  { name: 'DV-T1 H-250a counterfactual read (#251)', range: [12_430_047, 12_430_047] },
  { name: 'DV-T1 guard band (#251)', range: [12_430_050, 12_430_099] },
  {
    name: '⭐⭐ DV-T1 battery (#251) — THE BLOCK G-REPRO-T1 RE-WALKS',
    range: [12_430_100, 12_430_382],
  },
  /** ⭐ read off the COMMITTED DV-T1b artifact's own `gates.seedDisjoint.walkedBlocks` (#252) —
   *  the exam this stage re-powers. ⭐⭐ Its BATTERY block is the one G-REPRO-T1B re-walks, so it
   *  is entered here BOTH as consumed ground (nothing fresh may touch it) AND as the interval that
   *  re-walk's INVERTED predicate must land inside. */
  { name: 'DV-T1b smoke (#252)', range: [12_431_000, 12_431_007] },
  { name: 'DV-T1b delivered-dose read (#252)', range: [12_431_010, 12_431_010] },
  { name: 'DV-T1b strike read (#252)', range: [12_431_015, 12_431_015] },
  { name: 'DV-T1b H-250a counterfactual read (#252)', range: [12_431_020, 12_431_020] },
  { name: 'DV-T1b guard band (#252)', range: [12_431_050, 12_431_099] },
  {
    name: '⭐⭐ DV-T1b battery (#252) — THE BLOCK G-REPRO-T1B RE-WALKS',
    range: [12_431_100, 12_431_742],
  },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  /** ⭐ THIS STAGE'S OWN RESERVED CEILING, entered ex ante so the battery ROOM is FINITE and the
   *  battery block can never run past the room ruling #253.1 granted (12,432,000–12,434,999).
   *  ⭐⭐ THIS ENTRY *IS* THE ROOM: `BATTERY_ROOM` is computed from it below, never typed, so the
   *  charter's ceiling and the probe's ceiling cannot drift apart. */
  { name: '⭐ DV-T1c reserved ceiling (#253.1 — the room ends at 12,434,999)', range: [12_435_000, 12_435_099] },
];
/** ⭐ THE BATTERY BLOCK'S CEILING IS THE LEDGER'S, NOT A DISPATCH NUMBER (the ruled amendment):
 *  the dispatch's 500-seed cap was the DISPATCH's, never the contract's, and the N rule's own
 *  number governs. The only ceiling left is STRUCTURAL — the battery block may not run into the
 *  next consumed interval. Computed IN-PROBE from the ledger, never typed. */
const NEXT_CONSUMED_AFTER_BATTERY = Math.min(
  ...CONSUMED.map((c) => c.range[0]).filter((s) => s > BATTERY_BASE),
);
const BATTERY_ROOM = NEXT_CONSUMED_AFTER_BATTERY - BATTERY_BASE;
/** §4.2 the stats stream — a SEPARATE namespace. DV-T1's base was 106,200 and DV-T1b's was
 *  106,600 (both paired cluster bootstraps really were drawn); ruling #253.1 sets the floor for
 *  THIS stage at 107,000, which clears the #163 200-gap against every published base by 400. The
 *  list is DLC-T1s's COMPLETE published ledger + 105,800 (DLC-T1s's own) + 106,200 (DV-T1's own)
 *  + 106,600 (DV-T1b's own). */
const BOOTSTRAP_SEED = 107_000;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800, 105_000, 105_200, 105_400, 105_800,
  /** ⭐ DV-T1's own base (#251). */
  106_200,
  /** ⭐ DV-T1b's own base (#252) — the stage this one re-powers. */
  106_600,
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
/** ⭐⭐ THE DIRECT PARENT AND THE CONTRAST ANCHOR'S SOURCE: DLC-T1s's committed BATTERY
 *  artifact (#243/#244) — the run whose PLANE arm this exam re-walks and doses the RISK PRICE
 *  on top of. It is ruling #244's own arm and the reference of the "goals RECOVER" limb. */
const DLCT1S_PATH = 'docs/world-model/data/dlc-t1s-strike-exam.json';
/** ⭐⭐ THE DIRECT PARENT: DV-T1's committed BATTERY artifact (#251) — the source of BOTH this
 *  stage's EX-ANTE N (its published anchor supply moments) and its IDENTITY receipt (its
 *  per-match rows on the two arms this stage keeps). */
const DVT1_PATH = 'docs/world-model/data/dv-t1-map-exam.json';
/** ⭐⭐ THE OTHER DIRECT PARENT: DV-T1b's committed BATTERY artifact (#252) — the SECOND moment of
 *  this stage's ex-ante pooling, the SECOND identity re-walk (G-REPRO-T1B), and the source of the
 *  three FROZEN BASES a two-arm exam cannot measure for itself (guard tolerances, the band's
 *  #198-form exclusion set, the saturation headroom — all cut on ITS absent arm at 643 clusters).
 *  ⭐ AND THE SOURCE OF THE CLUSTER-SCALING SE: the N rule scales from DV-T1b's OWN paired SE on
 *  the very column the frozen letter reads, at ITS 643 clusters (#253.1). */
const DVT1B_PATH = 'docs/world-model/data/dv-t1b-power-extension.json';
const FORMATIONS_SRC = 'src/ai/formations.ts';
const BRAIN_SRC = 'src/ai/PlayerBrain.ts';
const PASSLEAD_SRC = 'src/ai/passLeadSeat.ts';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* --- §4 the invocation guard (G-CLEAN-INVOCATION) -------------------------- */
const N_ENV = process.env.DVT1C_N ? Math.max(1, Number.parseInt(process.env.DVT1C_N, 10)) : null;
const SKIP_FP = process.env.DVT1C_SKIP_FP === '1';
const OVERRIDDEN = N_ENV !== null || SKIP_FP;
const OUT_PATH = OVERRIDDEN
  ? '/tmp/dv-t1c-guard-run.json'
  : (MODE === 'smoke'
    ? 'docs/world-model/data/dv-t1c-goals-repower-smoke.json'
    : 'docs/world-model/data/dv-t1c-goals-repower.json');

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
/** ⭐⭐ EXACTLY TWO ARMS (ruling #253.1, frozen): PLANE-ANCHOR · dvTruthP. DV-T1's other five
 *  rungs are banked at #251.1 and DV-T1b's CONTROL is DROPPED — this is a re-power of ONE paired
 *  delta, and every seed spent on an arm the frozen letter does not read is a seed not spent on
 *  the pooled point. What survives is the contrast the letter IS: the dose, and the anchor it is
 *  differenced against. */
type ArmName = 'planeAnchor' | 'dvTruthP';
const ARMS: readonly ArmName[] = ['planeAnchor', 'dvTruthP'];
/** ⭐ THE PRIMARY CELL — `dvTruthP`, the PARITY rung: the ONE cell ruling #251.2 names for both
 *  limbs of the frozen letter ("supply vs control resolved helpful … at dvTruthP" and "dvTruthP
 *  goals vs anchor resolved toward the frozen band"). It is DV-T1's own parity arm, unchanged. */
const PRIMARY_ARM: ArmName = 'dvTruthP';
/** ⭐⭐ THE CONTRAST ANCHOR — ruling #244's own PLANE arm re-walked here, and the second
 *  reference of the estimator: "goals RECOVER … or resolvedly TOWARD IT vs the plane-alone
 *  anchor" is a DV-versus-ANCHOR statement and needs its own paired CI. */
const ANCHOR_ARM: ArmName = 'planeAnchor';
/** ⭐⭐ THE BASE OF EVERY PAIRED DELTA IN THIS ARTIFACT IS THE ANCHOR, BECAUSE THERE IS NO CONTROL
 *  ARM (#253.1: "TWO arms only … so no control arm runs"). Every `pairedDelta` this file publishes
 *  is `ARM − planeAnchor`; the anchor-referenced table (`ratesVsAnchor`, kept from the inherited
 *  estimator) therefore coincides with it BY CONSTRUCTION, and that coincidence is asserted rather
 *  than assumed (FLAG-HYGIENE's `baseEqualsAnchorTablesAgree`). ⚠ READ THE COLUMNS ACCORDINGLY:
 *  a delta here is the RISK PRICE's OWN marginal effect on top of the banked plane — it is NOT the
 *  plane-plus-price effect against a bare world, which is what DV-T1's and DV-T1b's
 *  control-referenced columns measured. */
const BASE_ARM: ArmName = ANCHOR_ARM;
/** ⭐ THE TRUTH-DOSED LADDER IS ONE RUNG LONG HERE, and that is the reduction: the extension
 *  spends its whole seed budget on the PARITY rung, which is the rung the #251.2 letter is
 *  written at. DV-T1's zero and gradient rungs are BANKED, not re-asked. */
const LADDER_ARMS: readonly ArmName[] = ['dvTruthP'];

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

/** ⭐ THE #230 CELL'S MATRIX, RE-USED VERBATIM. CHECK-AND-SHOW is OBM-T1's own arm — the drop
 *  plus the demand: f1 (the carrier's perceived plight) drives plane depth DOWN and the
 *  `SupportBallCarrier` score UP. It is re-walked against OBM-T1's committed rows by
 *  G-REPRO-OBMT1 rather than re-typed on trust. */
const CHECK_AND_SHOW_MATRIX = matrix([O_DEPTH, F1, MIN], [O_SUPPORT, F1, MAX]);

/** THE OBM SEAM's dose per arm: the 16-weight matrix, or `null` = flag off, gene absent.
 *  ⭐ NO ARM DOSES IT HERE. The relational pair (`dvTruthPxCas`) is DV-T1's, and it is banked;
 *  the CHECK-AND-SHOW matrix survives in this file ONLY as the G-REPRO-OBMT1 receipt walk's
 *  configuration, which is why it is still constructed above. */
const DOSE: Record<ArmName, number[] | null> = {
  planeAnchor: null,
  dvTruthP: null,
};

/* --- the STRIKE PLANE's gene: PRESENCE-ONLY under this door (#240/#241, MEASURED at DLC-T0s
 *     by G-VALUE: gene 0 ≡ 0.37 ≡ 1 byte for byte). Every arm but the CONTROL carries it at the
 *     domain max, so the plane is IDENTICAL in all of them and the ONLY thing that varies across
 *     the treatment arms is the DV price. */
const PTP_GENE_MIN = 0;
const PTP_GENE_MAX = 1;
const PTP_GENE_HALF = (PTP_GENE_MIN + PTP_GENE_MAX) / 2;
const GENE: Record<ArmName, number | null> = {
  planeAnchor: PTP_GENE_MAX,
  dvTruthP: PTP_GENE_MAX,
};
type Door = 'none' | 'dlc' | 'ptp' | 'sp';
const DOOR: Record<ArmName, Door> = {
  planeAnchor: 'sp',
  dvTruthP: 'sp',
};

/* ========================================================================== */
/* §6b ⭐⭐ THE DOSES — belief from the TRUE TABLE, exposure from a DERIVED LADDER */
/* ========================================================================== */
/**
 * ⭐⭐ THE BELIEF DOSE IS THE TRUE TABLE EXACTLY, READ AT EXAM TIME (contract §3 / #250.4).
 * The instrument opens DV-C0's committed artifact, takes
 * `result.census.yardstick.zones[z].hazard` in the frozen own·middle·final order and WRITES
 * those three numbers into `dvLossBelief` on all three genome views of BOTH teams. The values
 * travel INSTRUMENT → GENES; they never travel CODE → TABLE (DV-T0's G-NOTABLE, re-greped here
 * as X-NOTABLE). Nothing is typed: `TRUTH_BELIEF` below is a READ, not a literal.
 *
 * ⚠ THE INDEX-AXIS FACT, RESTATED NOT RESOLVED (DV-T0 §HONESTY 8, #250.4): the belief is read at
 * the candidate's RECEPTION zone; DV-C0's hazards are indexed by the LOSS (release) point. The
 * truth dose therefore writes TRUE VALUES ON A SHIFTED INDEX — adequate for THIS exam's
 * shape-capability question (own > middle > final either way) and NOT commensurable for DV-T2's
 * convergence scoring, which must resolve it FIRST.
 */
const TRUE_TABLE_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';
const DV_ZONES = ['own', 'middle', 'final'] as const;
const trueTable = JSON.parse(readFileSync(TRUE_TABLE_PATH, 'utf8')) as {
  resultSha256: string;
  result: { census: { yardstick: { zones: Record<string, { hazard: number }> } } };
};
const TRUTH_BELIEF: readonly number[] = DV_ZONES
  .map((z) => trueTable.result.census.yardstick.zones[z].hazard);
const ZERO_BELIEF: readonly number[] = [0, 0, 0];

/**
 * ⭐⭐ THE EXPOSURE LADDER — PRE-REGISTERED, SMALL, AND DERIVED FROM PUBLISHED NUMBERS.
 *
 * The T0 facts that force it (#250.4): the exposure reading SATURATES HIGH (mean 0.8126 on the
 * percept-armed world, 51,420 priced pairs) and at exposure = 1 it SUPPRESSED 21 of 32 base
 * strike-ticks (H-250a) — a dose of 1 is not a lever, it is a different game. So the ladder
 * INCLUDES 0 and stays far below 1, and every rung is a QUOTIENT OF PUBLISHED NUMBERS:
 *
 *   rung 0  `0`        — THE MANDATORY ZERO RUNG (contract §3). The truth MAP ALONE: the
 *                        capability question with the second limb silent.
 *   rung 1  PARITY     — `truthDosedMeanRiskPrice / meanExposure`
 *                        = 0.009865 / 0.8126 = 0.012140…  ⇒ at this weight the exposure limb
 *                        subtracts, ON AVERAGE, EXACTLY WHAT THE TRUTH MAP SUBTRACTS. The two
 *                        limbs are equally loud; neither carries the other. Both inputs are
 *                        DV-T0's own published readings (`reported.truthDosedSmoke.arms[1]
 *                        .meanRiskPrice` and `gates.gExposure.percept.meanExposure`), READ from
 *                        the artifact by this probe and machine-checked (G-DOSE).
 *   rung 2  PARITY × G — G = the census's OWN own/final hazard gradient
 *                        (0.0816 / 0.01807 = 4.5158, ruling #249.2's 4.5× landscape). The
 *                        loudest rung is the parity rung amplified by the WORLD'S OWN measured
 *                        risk gradient — a number the census produced, not a taste factor.
 *                        = 0.054822, i.e. 5.5 % of the dose H-250a measured.
 *
 * ⭐⭐ THIS STAGE DOSES EXACTLY ONE RUNG — PARITY — and derives the whole ladder anyway, because
 * the derivation is what proves the dosed rung is DV-T1's rung and not a look-alike: rung 0 and
 * rung 2 are computed, machine-checked against their frozen literals by G-DOSE, and then NOT
 * WALKED. DV-T1's above-truth arm (`dvLoud`, the census SHAPE preserved and its LEVEL scaled by
 * 1/hazard(own)) is BANKED at #251.1 with its own numbers and is not re-asked here.
 */
const DOSE_DERIVATION = (() => {
  const t0 = JSON.parse(readFileSync('docs/world-model/data/dv-t0-risk-pricing.json', 'utf8')) as {
    resultSha256: string;
    result: {
      gates: { gExposure: { percept: { meanExposure: number } } };
      reported: { truthDosedSmoke: { arms: { meanRiskPrice: number }[] } };
    };
  };
  const meanExposure = t0.result.gates.gExposure.percept.meanExposure;
  const truthMeanPrice = t0.result.reported.truthDosedSmoke.arms[1].meanRiskPrice;
  const parity = truthMeanPrice / meanExposure;
  const gradient = TRUTH_BELIEF[0] / TRUTH_BELIEF[2];
  return {
    source: 'docs/world-model/data/dv-t0-risk-pricing.json + docs/world-model/data/dv-c0-loss-cost.json',
    t0Sha: t0.resultSha256,
    censusSha: trueTable.resultSha256,
    meanExposure,
    truthMeanPrice,
    parity,
    gradient,
    rungParity: parity,
    rungGradient: parity * gradient,
  };
})();
/** ⭐ THE FROZEN RUNGS — literals, so the ladder is fixed in the file rather than floating with
 *  a re-read; G-DOSE proves each equals its derivation to 5e-7 and that every rung is < 0.1. */
const EXPOSURE_LADDER = { zero: 0, parity: 0.01214, gradient: 0.054822 } as const;

/** ⭐⭐ THE DV STATE PER ARM: `null` = the `dvDeliveryValue` door SHUT and both genes ABSENT.
 *  Otherwise the door is OPEN and BOTH genes are written on all three genome views of both
 *  teams (DV-T0's TWO-LIMB ARMING CHECKLIST: the flag PLUS a non-absent gene). */
type DvState = { exposure: number; belief: readonly number[]; label: string } | null;
const DV: Record<ArmName, DvState> = {
  planeAnchor: null,
  dvTruthP: { exposure: EXPOSURE_LADDER.parity, belief: TRUTH_BELIEF, label: 'TRUTH belief · exposure PARITY' },
};
/** ⭐ THE ZERO-DOSED STATE, kept as an INSTRUMENT rather than an arm: DV-T1's `dvInert` arm is
 *  banked (283/283 byte-identical to the anchor), so this extension does not spend seeds
 *  re-proving it. The state survives here because the H-250a counterfactual's VALIDITY CHECK
 *  needs a null fork — a counterfactual whose zero-dosed arm does not reproduce the reference is
 *  measuring the fork, not the dose (#250.4). */
const NULL_DV_STATE: NonNullable<DvState> = {
  exposure: 0, belief: ZERO_BELIEF, label: 'genes PRESENT AT ZERO (the counterfactual\'s null fork)',
};

/** the sentence for each arm, frozen with the arm (stage doc §FORM's table). */
const ARM_SENTENCE: Record<ArmName, string> = {
  planeAnchor: '⭐⭐ THE CONTRAST ANCHOR AND THE BASE OF EVERY PAIRED DELTA HERE: ruling #244\'s own '
    + 'PLANE arm — the banked GROUND STRIKE PLANE armed alone at gene 1, NO risk price. At #244 '
    + 'its supply gain read +0.1365 pp RESOLVED helpful; on DV-T1\'s 283 virgin seeds it '
    + 'REPLICATED the point estimate (+0.1344 pp) but the CI touched zero '
    + '(+0.001344 [-0.000076, 0.002758]) — which is why ruling #251.2 calls limb A '
    + 'POWER-CONFOUNDED and orders THIS extension. Here it is re-walked again, on seeds neither '
    + 'exam has touched, at an N sized to resolve exactly that estimate.',
  dvTruthP: 'the plane + THE TRUE MAP + the flight-exposure limb AT PARITY — DV-T1\'s own '
    + '`dvTruthP` arm, byte for byte (belief = DV-C0\'s measured hazards read at exam time, '
    + 'exposure = the PARITY rung re-derived from DV-T0\'s published numbers). It is the cell the '
    + 'frozen letter is written at: the arm whose goals recovered +0.2438 [0.0459, 0.4205] '
    + 'RESOLVED toward the band at DV-T1, and whose supply limb the extension exists to resolve.',
};
/** the receipt walks (never exam data): each runs in ITS SOURCE's own world */
type ReproArm = 'reproO2Control' | 'repro173Prod' | 'reproGgcProd' | 'reproCtbT1Absent'
  | 'reproObmT1Absent' | 'reproObmT1CheckAndShow' | 'reproDlcT1sPlane';
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
/** ⭐⭐ THE DV SEAM's ARMING CHECKLIST (DV-T0 §SEAM, TWO limbs): the `dvDeliveryValue` flag —
 *  written in `matchOf` above — PLUS a NON-ABSENT gene. Both DV genes are written on ALL THREE
 *  genome views of BOTH teams, exactly as the T0 truth-dosed smoke wrote them (INSTRUMENT →
 *  GENES). `null` DELETES both keys, so an un-dosed arm is genuinely BORN ABSENT rather than
 *  zeroed. The belief array is COPIED per view (never aliased — the OBM-T0 catch). */
const armDv = (m: Match, s: DvState): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (s === null) { delete g.dvExposureWeight; delete g.dvLossBelief; continue; }
      g.dvExposureWeight = s.exposure;
      g.dvLossBelief = [...s.belief];
    }
  }
};
/** ⭐ the DV gene-channel receipt: both genes present, finite, full-width on all six views —
 *  and, where the arm declares them, EQUAL TO THE DECLARED DOSE (so a silently mis-armed arm
 *  cannot pass as a dosed one). */
const dvGenesOnAllViews = (m: Match, s: DvState): boolean => m.teams.every((t) => (
  [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => (s === null
  ? g.dvExposureWeight === undefined && g.dvLossBelief === undefined
  : g.dvExposureWeight === s.exposure
    && Array.isArray(g.dvLossBelief)
    && g.dvLossBelief.length === s.belief.length
    && g.dvLossBelief.every((v, i) => v === s.belief[i]))));
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
  /** ⭐⭐ THE G-ANCHOR RE-WALK runs in DLC-T1s's OWN world on ITS `plane` ARM — percept-armed,
   *  `dlcStrikePlane` armed, the gene at the domain max, NO OBM matrix, and `ptpPassLead` /
   *  `dlcDeliveryChoice` / `dvDeliveryValue` NEVER passed (DLC-T1s predates the risk price
   *  entirely). It is CONFIGURATION-IDENTICAL to this exam's PLANE-ANCHOR arm, which is exactly
   *  what makes the CONTRAST anchor honest — and it is ruling #244's own arm, the one the
   *  "goals RECOVER toward the band" limb is read against. */
  if (arm === 'reproDlcT1sPlane') {
    const mm = new Match({
      ...base, ...PERCEPT_FLAGS, dlcStrikePlane: true,
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
   *  EXACTLY ONE of `dlcStrikePlane` (THE PLANE), `dlcDeliveryChoice` (the banked CONTEST) and
   *  `ptpPassLead` (the retired dial, unused here), never two — under DLC-T0 §LAW the banked seam keeps PRECEDENCE, so an armed-both
   *  arm would silently BE the forced dose wearing the contest's name. `obmMovement` is passed
   *  if and only if this arm has a matrix. Asserted per arm off the REAL constructed matches by
   *  FLAG-HYGIENE, never merely stated. */
  const m = new Match({
    ...base,
    ...PERCEPT_FLAGS,
    ...(d === null ? {} : { obmMovement: true }),
    ...(door === 'ptp' ? { ptpPassLead: true } : {}),
    ...(door === 'dlc' ? { dlcDeliveryChoice: true } : {}),
    ...(door === 'sp' ? { dlcStrikePlane: true } : {}),
    ...(DV[arm] === null ? {} : { dvDeliveryValue: true }),
  } as ConstructorParameters<typeof Match>[0]);
  if (d !== null) armMatrix(m, d);
  if (gene !== null) armGene(m, gene);
  armDv(m, DV[arm]);
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
  const doorHere = DOOR[arm];
  let leadChecked = 0;
  let leadSignViolations = 0;
  let leadMagnitudeViolations = 0;
  let leadModuleChecked = 0;
  let leadModuleDisagreements = 0;
  /** ⭐ THE PLANE'S OWN LAW CHECK (this stage's replacement for the two-point contest's algebra):
   *  a displacement struck under the STRIKE-PLANE door must be a MEMBER OF ITS OWN GRID, matched
   *  by IEEE identity against a grid re-derived here from the shipped module — no tolerance, no
   *  re-implementation of the geometry (`groundStrikeGrid` itself is called, so the law has ONE
   *  owner). `planeUnmatched` is the violation counter G-ARM reads. */
  let planeChecked = 0;
  let planeUnmatched = 0;
  const planeMemberWins = new Array<number>(STRIKE_PLANE_K).fill(0);
  const origPass = m.performPass.bind(m);
  m.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    if (ptpLead !== null && doorHere === 'sp') {
      const t = m.teams[p.side];
      const seat = strikePlaneSeatOf(p, m, t.genome, m.edsPerceivedChoice);
      if (seat === null) { origPass(p, mate, offsideExempt, powerChoice, ptpLead); return; }
      planeChecked += 1;
      let found = -1;
      groundStrikeGrid(seat, p.pos, mate).forEach((c, k) => {
        if (c.strike.x === ptpLead.x && c.strike.y === ptpLead.y) found = k;
      });
      if (found < 0) planeUnmatched += 1; else planeMemberWins[found] += 1;
    } else if (ptpLead !== null && geneHere !== null && doorHere !== 'none') {
      const t = m.teams[p.side];
      /** ⭐ THE SEAT IS BUILT THROUGH THIS ARM'S OWN DOOR, not through a convenient one: the
       *  CONTEST anchor re-derives through `deliveryChoiceSeatOf` (its own arming rule) and a
       *  dial arm (none here) would go through the banked `passLeadSeatOf`. */
      const seat = doorHere === 'dlc'
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
      if (doorHere === 'dlc') {
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
    planeChecked,
    planeUnmatched,
    planeMemberWins,
    planeLawNote: '⭐ THE STRIKE PLANE\'s OWN LAW, RE-DERIVED on every chosen pass the strike '
      + 'was handed a displacement for: the displacement must be a MEMBER of the K = '
      + `${STRIKE_PLANE_K}` + ' grid this carrier\'s own seat produces for THIS mate, matched by '
      + 'IEEE identity (`===` on both components) against `groundStrikeGrid` itself — the shipped '
      + 'module, called rather than re-implemented, so the geometry keeps ONE owner. '
      + '`planeUnmatched` must be 0 (G-ARM reads it). ⚠ The grid\'s SCALE is the banked '
      + 'projection at WEIGHT 1, so the gene\'s magnitude is not in this law at all (#240/#241).',
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
/* §7c ⭐⭐ THE STRIKE READ — the REPORTED headline, and the TREATMENT-DELIVERY number  */
/* ========================================================================== */
/**
 * ⭐⭐ THE #242.2 FACT OF RECORD, INSTRUMENTED EX ANTE (the OBM P1-trap lesson, third
 * application). DLC-T0s measured that in a PERCEPT world roughly TWO THIRDS of the plane's
 * chosen kicks never reach the ball: the pass TARGET is re-chosen AFTER the plane has priced
 * its nine points (`choosePerceivedPassTarget`), and the banked led-strike guard
 * `passMate === bestMate && (bestLeadX !== 0 || bestLeadY !== 0)` then DISCARDS the winner and
 * strikes to the substituted man's FEET — delivered rate 0.298 percept vs 0.776 bare.
 *
 * ⇒ THIS EXAM PUBLISHES DELIVERED RATE PER ARM AS A FIRST-CLASS NUMBER, and it publishes it in
 * BOTH available forms rather than one:
 *
 *   (a) the STRIKE-TIME rate, on the EXAM WALKS themselves, at BATTERY GRAIN and with ZERO
 *       percept pulls — `ptpLedNonZero / passesChosen`, i.e. the share of kicks that carried the
 *       chooser's OWN displacement. It is the rate the treatment was ACTUALLY delivered at in
 *       the matches every ruler is computed on. It rides the ordinary bootstrap as `ledPassShare`.
 *   (b) the DECODED rate, here, on ONE declared observational seed per arm: the DLC-T0s
 *       substitution decode's own four buckets (sampled-struck · genuine zero-point ·
 *       target-substituted · no chooser row), which is the only form that can tell a kick the
 *       chooser DECLINED to displace from a kick whose winner was THROWN AWAY upstream.
 *
 * ⚠ WHY (b) IS OBSERVATIONAL AND SEPARATE: it re-derives grids (a PERCEPT PULL, which advances
 * the body's memory) and it arms the chooser's SIDECAR trace. Inside an exam arm either would be
 * an intervention wearing an instrument's clothes. It runs on its OWN seed, its numbers enter no
 * rate, no CI and no exam row, and the sidecar's innocence is a RECEIPT not a promise: a second,
 * UNTRACED match at the same seed and arm must produce the same kick count, the same sampled
 * count and the same per-member wins (`lockstepWithUntraced`).
 *
 * ⭐ AND IT CARRIES THE STAGE'S REPORTED HEADLINE: the CHOSEN-STRIKE DISTRIBUTION over the nine
 * grid members, per arm, by member / by direction / by power. No control, no CI, no verdict.
 *
 * ⭐⭐ #242.3 — TWO DECODE DEFECTS FOUND IN THIS BLOCK AND CORRECTED HERE (REPORTED layer only;
 * no gate, no rate and no CI reads anything below, and `src/**` is untouched):
 *
 *  (1) THE DELIVERED-RATE DECOMPOSITION CONFLATED TWO OPPOSITE FACTS. The zero-point bucket is
 *      decided SOLELY by `chosenGid === legacyGid` and carries NO grid information, so a decision
 *      where the plane was FULLY DEGENERATE (all nine members exactly (0,0) — reach 0, the
 *      thin-channel collapse) counted as a delivered treatment exactly like a live-grid win. The
 *      symptom: `deliveredRateDecoded` was NOT MONOTONE IN TREATMENT (PLANE-INERT above PLANE).
 *      ⇒ the liveness of the plane is now MEASURED per decision, off the LEGACY man's own grid,
 *      and the corrected reading `deliveredRateLiveGrid` conditions on LIVE-GRID decisions. The
 *      old statistic is kept, flagged RETRACTED, and given the bracket it can honestly support.
 *
 *  (2) MEMBER 4 IS STRUCTURALLY UNRECORDABLE AT STRIKE TIME. `byMember` is tallied from the 5th
 *      argument of `performPass`; a zero-displacement kick carries none. Its published 0 was the
 *      channel, not the world. ⇒ member 4 is `n/a` here, and the inherited "legacy man kept AND
 *      member 4 won" bucket definition is corrected with it — that conjunction is unobservable.
 */
const strikeReadOf = (arm: ArmName) => {
  const run = (traced: boolean) => {
    const base = {
      seed: STRIKE_READ_SEED, teamA: team('A', STRIKE_READ_SEED * 2 + 1),
      teamB: team('B', STRIKE_READ_SEED * 2 + 2), duration: MATCH_DURATION,
    };
    const d = DOSE[arm];
    const door = DOOR[arm];
    const m = new Match({
      ...base,
      ...PERCEPT_FLAGS,
      ...(d === null ? {} : { obmMovement: true }),
      ...(door === 'ptp' ? { ptpPassLead: true } : {}),
      ...(door === 'dlc' ? { dlcDeliveryChoice: true } : {}),
      ...(door === 'sp' ? { dlcStrikePlane: true } : {}),
      ...(DV[arm] === null ? {} : { dvDeliveryValue: true }),
      ...(traced ? { traceChoice: true } : {}),
    } as ConstructorParameters<typeof Match>[0]);
    if (d !== null) armMatrix(m, d);
    if (GENE[arm] !== null) armGene(m, GENE[arm]);
    armDv(m, DV[arm]);
    const wins = new Array<number>(STRIKE_PLANE_K).fill(0);
    let kicks = 0;
    let sampledStruck = 0;
    let unmatched = 0;
    let genuineZeroPoint = 0;
    let targetSubstituted = 0;
    let noChooserRow = 0;
    /** ⭐⭐ THE #242.3 DEGENERACY SPLIT (this round's decode correction). A zero-displacement
     *  kick is only EVIDENCE THE PLANE WAS DECLINED if the plane had something to decline. The
     *  three liveness classes are measured, per decision, on the LEGACY man's own grid — the man
     *  the plane's winner was priced on. LIVE = at least one member is a different kick. */
    let zeroPointLiveGrid = 0;
    let zeroPointDegenerateGrid = 0;
    let zeroPointNoSeat = 0;
    let substitutedLiveGrid = 0;
    let substitutedDegenerateGrid = 0;
    let substitutedNoSeat = 0;
    let dispSum = 0;
    let dispMax = 0;
    let shareSum = 0;
    const orig = m.performPass.bind(m);
    m.performPass = (
      p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<{ x: number; y: number }> | null = null,
    ): void => {
      kicks += 1;
      if (ptpLead !== null) {
        sampledStruck += 1;
        const mag = Math.hypot(ptpLead.x, ptpLead.y);
        dispSum += mag;
        if (mag > dispMax) dispMax = mag;
        const dd = dist(p.pos, mate.pos);
        shareSum += dd > 0 ? mag / dd : 0;
        if (DOOR[arm] === 'sp') {
          const seat = strikePlaneSeatOf(p, m, m.teams[p.side].genome, m.edsPerceivedChoice);
          let found = -1;
          if (seat !== null) {
            groundStrikeGrid(seat, p.pos, mate).forEach((c, k) => {
              if (c.strike.x === ptpLead.x && c.strike.y === ptpLead.y) found = k;
            });
          }
          if (found < 0) unmatched += 1; else wins[found] += 1;
        }
      } else if (traced) {
        /** the chooser's own row for THIS decision: same tick, same passer — pushed INSIDE the
         *  decision, before the strike statement is reached. */
        const row = m.passChoiceTrace.find((x) => x.tick === m.simTick && x.passerGid === p.gid);
        if (row === undefined) noChooserRow += 1;
        else {
          const substituted = row.chosenGid !== -1 && row.chosenGid !== row.legacyGid;
          if (substituted) targetSubstituted += 1; else genuineZeroPoint += 1;
          /* ⭐⭐ THE LIVENESS OF THE PLANE AT THIS DECISION (#242.3). Only a PLANE arm has a
           * grid at all; the class is read off the LEGACY man — the man the plane's own argmax
           * winner was priced on, and (for a genuine zero-point) the man actually struck. */
          if (DOOR[arm] === 'sp') {
            const legacy = m.teams[p.side].players.find((q) => q.gid === row.legacyGid) ?? null;
            const seat = legacy === null ? null
              : strikePlaneSeatOf(p, m, m.teams[p.side].genome, m.edsPerceivedChoice);
            const grid = seat === null || legacy === null
              ? null : groundStrikeGrid(seat, p.pos, legacy);
            if (grid === null) { if (substituted) substitutedNoSeat += 1; else zeroPointNoSeat += 1; }
            else if (grid.every((c) => c.strike.x === 0 && c.strike.y === 0)) {
              if (substituted) substitutedDegenerateGrid += 1; else zeroPointDegenerateGrid += 1;
            } else if (substituted) substitutedLiveGrid += 1; else zeroPointLiveGrid += 1;
          }
        }
      }
      orig(p, mate, offsideExempt, powerChoice, ptpLead);
    };
    while (!m.finished) m.step(DT);
    return {
      kicks, sampledStruck, unmatched, genuineZeroPoint, targetSubstituted, noChooserRow, wins,
      dispSum, dispMax, shareSum,
      zeroPointLiveGrid, zeroPointDegenerateGrid, zeroPointNoSeat,
      substitutedLiveGrid, substitutedDegenerateGrid, substitutedNoSeat,
    };
  };
  const traced = run(true);
  const untraced = run(false);
  const byMember = traced.wins.map((w, k) => ({
    index: k,
    dirStep: STRIKE_PLANE_STEPS[Math.floor(k / 3)],
    powerStep: STRIKE_PLANE_STEPS[k % 3],
    /** ⚠⚠ #242.3: `wins` is a STRIKE-TIME tally and the ZERO-POINT MEMBER CANNOT APPEAR IN ONE.
     *  A zero-displacement kick carries NO 5th argument (the banked strike guard's own
     *  `bestLeadX !== 0 || bestLeadY !== 0`), so member 4 has no observation channel here and
     *  its 0 is STRUCTURAL, not measured. Read `observableAtStrike` before reading `wins`. */
    wins: k === STRIKE_PLANE_ZERO_INDEX ? null : w,
    winsRawUnobservable: k === STRIKE_PLANE_ZERO_INDEX ? w : null,
    observableAtStrike: k !== STRIKE_PLANE_ZERO_INDEX,
    isZeroPoint: k === STRIKE_PLANE_ZERO_INDEX,
  }));
  const byDirection: Record<string, number> = {};
  const byPower: Record<string, number> = {};
  for (const r of byMember.map((r) => ({ ...r, wins: r.wins ?? 0 }))) {
    byDirection[`dir${r.dirStep}`] = (byDirection[`dir${r.dirStep}`] ?? 0) + r.wins;
    byPower[`pow${r.powerStep}`] = (byPower[`pow${r.powerStep}`] ?? 0) + r.wins;
  }
  const k = Math.max(traced.kicks, 1);
  return {
    seed: STRIKE_READ_SEED,
    arm,
    door: DOOR[arm],
    gridK: STRIKE_PLANE_K,
    kicks: traced.kicks,
    sampledStruck: traced.sampledStruck,
    unmatchedStrikes: traced.unmatched,
    genuineZeroPoint: traced.genuineZeroPoint,
    targetSubstituted: traced.targetSubstituted,
    noChooserRow: traced.noChooserRow,
    /* ⭐⭐ THE #242.3 DEGENERACY SPLIT — the plane's LIVENESS at each non-sampled decision, read
     * off the LEGACY man's own grid. Zero on every arm without a plane door, and zero on
     * PLANE-INERT (gene absent ⇒ no seat ⇒ `*NoSeat`), which is the honest answer there. */
    zeroPointLiveGrid: traced.zeroPointLiveGrid,
    zeroPointDegenerateGrid: traced.zeroPointDegenerateGrid,
    zeroPointNoSeat: traced.zeroPointNoSeat,
    substitutedLiveGrid: traced.substitutedLiveGrid,
    substitutedDegenerateGrid: traced.substitutedDegenerateGrid,
    substitutedNoSeat: traced.substitutedNoSeat,
    /** ⭐⭐ THE TREATMENT-DELIVERY NUMBERS (#242.2), on this observational match. */
    substitutionRate: round(traced.targetSubstituted / k, 5),
    /** ⚠⚠ RETRACTED AS A TREATMENT READING (#242.3) — kept only so the superseded number is
     *  auditable. It counts a zero-point kick as DELIVERED without asking whether the plane had
     *  any alternative to deliver, so a FULLY DEGENERATE grid (treatment IMPOSSIBLE at that
     *  decision) scores exactly like a live-grid win. Read `deliveredRateLiveGrid` instead, and
     *  `deliveredRateDecodedBracket` for what this formula can honestly bracket. */
    deliveredRateDecoded: round((traced.sampledStruck + traced.genuineZeroPoint) / k, 5),
    deliveredRateDecodedRetracted: true,
    /** the honest span of the retracted formula: NONE of the zero-point kicks counted as
     *  delivered (lower) … ALL of them counted (upper, i.e. the retracted number itself). */
    deliveredRateDecodedBracket: {
      lower: round(traced.sampledStruck / k, 5),
      upper: round((traced.sampledStruck + traced.genuineZeroPoint) / k, 5),
    },
    /** ⭐⭐ THE CORRECTED READING: delivered rate CONDITIONED ON LIVE-GRID DECISIONS — decisions
     *  where the plane really had another kick to offer. Numerator: the plane's choice reached
     *  the ball (a sampled strike, or a live-grid zero-point WIN). Denominator: those plus the
     *  live-grid decisions whose winner was thrown away upstream by the substitution. Degenerate
     *  grids, seatless decisions and `noChooserRow` enter NEITHER side. `null` where the arm has
     *  no plane, because an arm with no plane has no treatment to deliver. */
    liveGridDecisions: DOOR[arm] === 'sp'
      ? traced.sampledStruck + traced.zeroPointLiveGrid + traced.substitutedLiveGrid : 0,
    deliveredRateLiveGrid: DOOR[arm] === 'sp'
      && traced.sampledStruck + traced.zeroPointLiveGrid + traced.substitutedLiveGrid > 0
      ? round((traced.sampledStruck + traced.zeroPointLiveGrid)
        / (traced.sampledStruck + traced.zeroPointLiveGrid + traced.substitutedLiveGrid), 5)
      : null,
    /** the zero-pull form of the same quantity, on the SAME match — comparable to the exam
     *  walks' `ledPassShare`, which is this rate at battery grain. */
    deliveredRateStrikeTime: round(traced.sampledStruck / k, 5),
    /** ⚠ THE RATES ARE ONLY A *TREATMENT*-DELIVERY READING WHERE THERE IS A TREATMENT. On an arm
     *  with no plane door the four buckets still fill (the percept chooser runs in every arm and
     *  substitutes targets in every arm), but "genuine zero-point" then means only *the chooser
     *  kept the legacy man* — there was no grid whose winner could have been delivered or
     *  discarded. Flagged rather than left for a reader to infer. */
    deliveredRateIsATreatmentReading: DOOR[arm] === 'sp' && GENE[arm] !== null,
    byMember,
    byDirection,
    byPower,
    meanDisplacementMetres: round(traced.dispSum / Math.max(traced.sampledStruck, 1), 4),
    maxDisplacementMetres: round(traced.dispMax, 4),
    meanDisplacementShareOfDistance: round(traced.shareSum / Math.max(traced.sampledStruck, 1), 5),
    lockstepWithUntraced: traced.kicks === untraced.kicks
      && traced.sampledStruck === untraced.sampledStruck
      && traced.wins.every((w, i) => w === untraced.wins[i]),
    note: '⭐ REPORTED ONLY — ONE observational match per arm at the DECLARED strike-read seed, '
      + 'no control, no CI, no gate level. ⚠ THE FOUR BUCKETS ARE NOT A PARTITION OF A SINGLE '
      + 'CAUSE: `noChooserRow` (a keeper, a restart with no executable option, a cutback) is '
      + 'UNDETERMINED by this instrument and is deliberately folded into NEITHER side, exactly as '
      + 'DLC-T0s folded the bare world\'s. ⚠⚠ AND ON AN ARM WITHOUT AN ARMED PLANE THESE RATES '
      + 'ARE NOT A TREATMENT READING AT ALL (`deliveredRateIsATreatmentReading: false`): the '
      + 'percept chooser runs — and substitutes — in EVERY arm, so the buckets still fill, but '
      + 'with no grid there is no winner to deliver or discard and "genuine zero-point" means '
      + 'only that the chooser kept the legacy man. ⚠ AND AN ARM WITHOUT THE PLANE DOOR HAS NO '
      + 'GRID: its '
      + '`byMember` row is all zeros BY CONSTRUCTION (the CHOICE anchor\'s displacement is the '
      + 'two-point contest\'s single led candidate, which is not a member of any plane), so read '
      + 'the member table at the PLANE arms and the delivered rates everywhere.',
    /** ⭐⭐ #242.3 CORRECTION 1 — the delivered-rate decomposition. */
    decodeCorrectionNote: '⭐⭐ #242.3 (this round): `deliveredRateDecoded` is RETRACTED as a '
      + 'treatment reading. Its bucket is decided SOLELY by `chosenGid === legacyGid` and carries '
      + 'NO grid information, so a kick where the plane was FULLY DEGENERATE (every one of the '
      + 'nine members exactly (0,0) — the thin-channel collapse: no remembered motion ⇒ reach 0 ⇒ '
      + 'the whole plane on today\'s kick BY ARITHMETIC) scores identically to a live-grid '
      + 'zero-point WIN. Those are opposite facts: the first says the treatment was IMPOSSIBLE at '
      + 'that decision, the second says it was OFFERED and DECLINED. ⚠ THE SYMPTOM THAT PROVES IT '
      + 'MATTERS: the retracted formula was NOT MONOTONE IN TREATMENT — PLANE-INERT (gene absent, '
      + 'no grid can exist) scored HIGHER than PLANE, because on an inert arm every kept-legacy '
      + 'kick banks into the same numerator. ⇒ read `deliveredRateLiveGrid`, which conditions on '
      + 'decisions where the plane really had another kick to offer, is `null` wherever no plane '
      + 'exists, and cannot be inflated by degeneracy. `deliveredRateDecodedBracket` is what the '
      + 'old formula can honestly say instead of its point value.',
    /** ⭐⭐ #242.3 CORRECTION 2 — the zero-point member is not measurable at strike time. */
    memberFourNote: '⭐⭐ #242.3 (this round): the member-4 (dir 0, power 0) cell is `n/a`, NOT a '
      + 'measured 0. `byMember` is tallied from the 5th argument of `performPass`, and a '
      + 'ZERO-DISPLACEMENT kick carries NO 5th argument (the banked strike guard requires '
      + '`bestLeadX !== 0 || bestLeadY !== 0`), so TODAY\'S KICK IS STRUCTURALLY UNRECORDABLE ON '
      + 'THIS CHANNEL and its 0 was an artefact of the channel, not a finding. ⚠ The inherited '
      + '"legacy man kept AND member 4 won" bucket definition is CORRECTED WITH IT: that '
      + 'conjunction is unobservable at strike time — keeping the legacy man is observable, '
      + 'member 4 winning is not. Zero-point wins are only countable at DECISION time, through a '
      + 'winner instrument that reads the argmax rather than the ball: the nearest banked '
      + 'evidence is DLC-T0s\'s G-WINNER (`docs/world-model/data/dlc-t0s-strike-plane.json` → '
      + '`gates.gWinner`), which on materially-spread decisions recorded 6 of 96 won by TODAY\'S '
      + 'KICK in the percept world and 5 of 75 in the bare world. ⚠ That is T0s\'s world, cited '
      + 'as the honest source for the QUANTITY — it is not a T1s exam-arm measurement, and this '
      + 'stage runs no decision-time winner instrument of its own.',
  };
};


/* ========================================================================== */
/* §7d ⭐⭐ THE H-250a COUNTERFACTUAL — FLIP vs SUPPRESS, AT THIS EXAM'S DOSES  */
/* ========================================================================== */
/**
 * ⭐⭐ THE #250.4 OBLIGATION, DISCHARGED IN THE FORM THE RULING NAMES: *"a flip-vs-suppress
 * counterfactual AT YOUR CHOSEN DOSES (the T0 verifier's one-tick counterfactual form: step to
 * tick T zero-dosed, dose, take ONE tick, compare the struck pass)."*
 *
 * H-250a (the hypothesis this instrument tests at THIS stage's doses): at the T0-tested doses the
 * DV price acted as a LEVEL SUPPRESSANT, not a REORDERER — 0/64 target flips, with exposure = 1
 * suppressing 21 of 32 base strike-ticks. The exam's doses are two to three orders of magnitude
 * smaller, so the reading is expected to differ; that is exactly why it is re-measured here
 * rather than inherited.
 *
 * THE FORM, exactly:
 *   1. A REFERENCE WALK on the declared observational seed, in the ZERO-DOSED world — the plane
 *      armed at the domain max and `dvDeliveryValue` ON with both genes at ZERO. By DV-T0's
 *      G-ZERO (and by this stage's own FLAG-HYGIENE identity rows) that world IS the PLANE
 *      ANCHOR, byte for byte; making it the reference means the counterfactual's base ticks are
 *      the ANCHOR's own strikes.
 *   2. Its BASE STRIKE-TICKS are recorded (the `simTick` at which `performPass` fired, with the
 *      target's gid and the aim displacement the strike was handed), and so is a matched sample
 *      of NON-strike ticks — CREATION cannot be measured on strike ticks alone.
 *   3. For each sampled tick T and each dosed arm: a fresh un-wrapped walk of the SAME world is
 *      stepped to T, DEEP-CLONED, the clone's genomes are re-dosed, and the clone takes EXACTLY
 *      ONE tick. What it struck is compared with what the reference struck at that tick.
 *   4. ⭐ THE INSTRUMENT'S OWN VALIDITY CHECK, published beside the rows: the same fork with the
 *      dose LEFT AT ZERO must reproduce the reference strike at every sampled tick
 *      (`referenceReproduced`). A counterfactual whose null arm does not reproduce the reference
 *      is measuring the fork, not the dose.
 *
 * ⚠ OBSERVATIONAL AND REPORTED. One seed, no control, no CI, no verdict (#203). It answers
 * "WHAT KIND of change is the price making" — suppression, creation or reordering — which is the
 * question #250.4 orders published beside the exam's rows, and nothing else.
 */
const H250A_SEED = 12_432_020;
const H250A_STRIKE_SAMPLE_CAP = 40;
const H250A_NONSTRIKE_SAMPLE_CAP = 40;
/** ⭐⭐ TWO DOSE STATES, NOT FIVE ARMS: the NULL FORK (the instrument's own validity check) and
 *  THE PARITY DOSE (the only dose this extension carries). Ruling #251.2's re-publication order
 *  is "the H-250a flip-vs-suppress counterfactual at the parity dose (with the null-arm validity
 *  check)" — exactly these two rows. */
type H250aState = { readonly label: string; readonly name: string; readonly s: NonNullable<DvState> };
const H250A_STATES: readonly H250aState[] = [
  { label: 'ZERO', name: 'NULL FORK (both DV genes at zero)', s: NULL_DV_STATE },
  { label: 'TRUTH', name: 'dvTruthP (belief = THE TRUE TABLE · exposure PARITY)', s: DV.dvTruthP! },
];
const h250aCounterfactual = () => {
  const baseCfg = () => ({
    seed: H250A_SEED, teamA: team('A', H250A_SEED * 2 + 1), teamB: team('B', H250A_SEED * 2 + 2),
    duration: MATCH_DURATION, ...PERCEPT_FLAGS, dlcStrikePlane: true, dvDeliveryValue: true,
  } as ConstructorParameters<typeof Match>[0]);
  /** the zero-dosed world = the PLANE ANCHOR by G-ZERO (and by this stage's identity rows). */
  const zeroWorld = (): Match => {
    const m = new Match(baseCfg());
    armGene(m, PTP_GENE_MAX);
    armDv(m, NULL_DV_STATE);
    return m;
  };
  type Strike = { tick: number; targetGid: number; aimX: number; aimY: number };
  /** ---- 1/2: the reference walk and its strike ledger (wrapped; its own instance) ---- */
  const ref = zeroWorld();
  const strikes: Strike[] = [];
  const origRef = ref.performPass.bind(ref);
  ref.performPass = (
    p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
    ptpLead: Readonly<{ x: number; y: number }> | null = null,
  ): void => {
    strikes.push({
      tick: ref.simTick, targetGid: mate.gid,
      aimX: ptpLead === null ? 0 : ptpLead.x, aimY: ptpLead === null ? 0 : ptpLead.y,
    });
    origRef(p, mate, offsideExempt, powerChoice, ptpLead);
  };
  let refTicks = 0;
  while (!ref.finished) { ref.step(DT); refTicks += 1; }
  const strikeTicks = new Map<number, Strike>();
  for (const s of strikes) if (!strikeTicks.has(s.tick)) strikeTicks.set(s.tick, s);
  const strikeTickList = [...strikeTicks.keys()].sort((a, b) => a - b);
  /** an EVEN sample across the match, never the first N (which would all be one phase). */
  const evenSample = <T,>(xs: readonly T[], cap: number): T[] => {
    if (xs.length <= cap) return [...xs];
    const step = xs.length / cap;
    return Array.from({ length: cap }, (_, i) => xs[Math.floor(i * step)]);
  };
  const sampledStrikeTicks = evenSample(strikeTickList, H250A_STRIKE_SAMPLE_CAP);
  const nonStrikeAll: number[] = [];
  for (let t = 1; t < refTicks; t += 7) if (!strikeTicks.has(t)) nonStrikeAll.push(t);
  const sampledNonStrikeTicks = evenSample(nonStrikeAll, H250A_NONSTRIKE_SAMPLE_CAP);
  /** ---- 3: the one-tick forks ---- */
  const oneTick = (atTick: number, s: DvState): Strike | null => {
    /** a FRESH, UN-WRAPPED walk of the same world, stepped to the tick, then cloned. The walk is
     *  un-wrapped so the clone can never inherit a closure bound to another match. */
    /** ⚠ THE TICK'S ARITHMETIC, STATED: `Match.step` INCREMENTS `stepCount` at its head, so a
     *  strike recorded at `simTick === T` happened during the step taken FROM the state at
     *  `simTick === T − 1`. The fork is therefore stepped to T − 1 and then takes exactly one
     *  tick. (Getting this wrong makes every arm "suppress" everything — which is why the
     *  ZERO-dosed null arm's reproduction of the reference is published as the validity check.) */
    const m = zeroWorld();
    while (!m.finished && m.simTick < atTick - 1) m.step(DT);
    if (m.finished || m.simTick !== atTick - 1) return null;
    const fork = cloneSimulationState(m);
    armDv(fork, s);
    let out: Strike | null = null;
    const origFork = fork.performPass.bind(fork);
    fork.performPass = (
      p: Player, mate: Player, offsideExempt = false, powerChoice = 1,
      ptpLead: Readonly<{ x: number; y: number }> | null = null,
    ): void => {
      if (out === null) {
        out = {
          tick: fork.simTick, targetGid: mate.gid,
          aimX: ptpLead === null ? 0 : ptpLead.x, aimY: ptpLead === null ? 0 : ptpLead.y,
        };
      }
      origFork(p, mate, offsideExempt, powerChoice, ptpLead);
    };
    fork.step(DT);
    return out;
  };
  const rowFor = (st: H250aState) => {
    const s: DvState = st.s;
    let suppressed = 0; let comparedTicks = 0; let targetFlips = 0; let aimChanges = 0;
    let identical = 0; let created = 0; let referenceReproduced = 0; let unusable = 0;
    for (const t of sampledStrikeTicks) {
      const got = oneTick(t, s);
      const want = strikeTicks.get(t)!;
      if (got === null) { suppressed += 1; continue; }
      comparedTicks += 1;
      if (got.targetGid !== want.targetGid) targetFlips += 1;
      else if (got.aimX !== want.aimX || got.aimY !== want.aimY) aimChanges += 1;
      else identical += 1;
      if (got.targetGid === want.targetGid && got.aimX === want.aimX && got.aimY === want.aimY) {
        referenceReproduced += 1;
      }
    }
    for (const t of sampledNonStrikeTicks) {
      const got = oneTick(t, s);
      if (got !== null) created += 1;
      else unusable += 0;
    }
    return {
      arm: st.name,
      exposure: s.exposure,
      beliefLabel: st.label,
      belief: [...s.belief],
      baseTicks: sampledStrikeTicks.length,
      suppressed,
      comparedTicks,
      targetFlips,
      aimChanges,
      identicalStrikes: identical,
      created,
      nonStrikeTicksSampled: sampledNonStrikeTicks.length,
      referenceReproduced,
      unusable,
    };
  };
  const rows = H250A_STATES.map(rowFor);
  const nullArm = rows[0];
  return {
    seed: H250A_SEED,
    world: 'the PLANE ANCHOR world (percept-armed, `dlcStrikePlane` at gene 1) with '
      + '`dvDeliveryValue` ON and both DV genes at ZERO — byte-identical to the anchor by '
      + 'DV-T0 G-ZERO and by this stage\'s own FLAG-HYGIENE identity rows.',
    referenceTicks: refTicks,
    baseStrikeTicks: strikeTickList.length,
    sampledStrikeTicks: sampledStrikeTicks.length,
    sampledNonStrikeTicks: sampledNonStrikeTicks.length,
    rows,
    /** ⭐ THE VALIDITY CHECK: the ZERO-dosed fork must reproduce the reference at EVERY sampled
     *  tick. If it does not, the instrument is measuring the fork rather than the dose. */
    nullArmReproducesReference: nullArm.suppressed === 0 && nullArm.created === 0
      && nullArm.referenceReproduced === nullArm.baseTicks,
    reading: 'REPORTED, one seed, no CI (#203): per dose, how many of the anchor\'s own base '
      + 'strike-ticks the price SUPPRESSED, how many strikes it CREATED at sampled non-strike '
      + 'ticks, and — on the ticks where a strike survived — how often it REORDERED the target '
      + '(a flip) versus merely moved the aim within the same target. This is H-250a re-measured '
      + 'at THIS exam\'s doses instead of inherited from T0\'s.',
    inheritedFromT0: '⚠ H-250a AT T0 DOSES, for contrast only (ruling #250.3(iii), n = 64): 0/64 '
      + 'target flips; exposure = 1 suppressed 21/32 base strike-ticks and own-belief = 1 '
      + 'suppressed 5/32. Those doses are 18× to 82× this exam\'s loudest rung.',
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
  const n = byArm[BASE_ARM].length;
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    draws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  const deltaDraws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    deltaDraws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  /** ⭐⭐ THE SECOND REFERENCE, FROZEN EX ANTE WITH THE #240 OVERSHOOT PREDICTION: the same
   *  resampled seed-index sets, differenced against the CHOICE ANCHOR instead of the control.
   *  The overshoot clause is a PLANE-vs-ANCHOR statement, so it needs a PLANE-vs-ANCHOR paired
   *  CI; computing it off two control-referenced CIs would be an error of arithmetic as well as
   *  of pairing. Same clusters, same draws, same estimator — only the reference moves. */
  const anchorDraws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    anchorDraws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx: number[] = [];
    for (let i = 0; i < n; i++) idx.push(Math.min(n - 1, Math.floor(rng.next() * n)));
    const resampled = Object.fromEntries(
      ARMS.map((a) => [a, idx.map((i) => byArm[a][i])]),
    ) as Record<ArmName, PerMatch[]>;
    for (const k of RATE_KEYS) {
      const base = rateOf(resampled[BASE_ARM], k);
      const anchorBase = rateOf(resampled[ANCHOR_ARM], k);
      for (const a of ARMS) {
        const v = rateOf(resampled[a], k);
        draws[k][a].push(v);
        deltaDraws[k][a].push(v - base);
        anchorDraws[k][a].push(v - anchorBase);
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
  const ratesVsAnchor: Record<string, unknown> = {};
  for (const k of RATE_KEYS) {
    const dp = 6;
    ratesVsAnchor[k] = Object.fromEntries(ARMS.map((a) => {
      const d = ci(anchorDraws[k][a], dp);
      return [a, {
        pairedDelta: a === ANCHOR_ARM ? null
          : { point: round(rateOf(byArm[a], k) - rateOf(byArm[ANCHOR_ARM], k), dp), ...d },
        resolved: a !== ANCHOR_ARM && Number.isFinite(d.lower) && Number.isFinite(d.upper)
          && (d.lower > 0 || d.upper < 0),
      }];
    }));
  }
  const rates: Record<string, unknown> = {};
  for (const k of RATE_KEYS) {
    const dp = 6;
    rates[k] = Object.fromEntries(ARMS.map((a) => {
      const point = rateOf(byArm[a], k);
      const d = ci(deltaDraws[k][a], dp);
      return [a, {
        point: round(point, dp), ...ci(draws[k][a], dp),
        pairedDelta: a === BASE_ARM ? null
          : { point: round(point - rateOf(byArm[BASE_ARM], k), dp), ...d },
        resolved: a !== BASE_ARM && Number.isFinite(d.lower) && Number.isFinite(d.upper)
          && (d.lower > 0 || d.upper < 0),
      }];
    }));
  }
  return {
    method: 'per-match (seed-clustered) PAIRED bootstrap, ratio-of-totals estimator, '
      + '2.5/97.5 percentiles; ONE resampled seed-index set feeds EVERY arm (#20 cluster = seed)',
    statsBase: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, clusters: n,
    deltaDirection: `ARM − ${BASE_ARM}`,
    resolvedNote: '`resolved` is a MECHANICAL CI FLAG (the paired-delta CI excludes zero), '
      + 'NEVER a verdict (#203). F-DLC-a/b/c are the commander\'s.',
    ruler5KeysNote: '⭐ the five ruler-5 keys (constructedGe3/4/5Share on the NON-SET-PIECE pool, '
      + 'scrambleShareOfGoals, setPieceShareOfGoals) ride the SAME paired bootstrap as every '
      + 'other column, so the battery reads the #218 arc ruler with CIs and paired deltas rather '
      + 'than bare counts. ⚠ THEY REMAIN GATE-FREE: no GATE reads a cell of this table, and the '
      + 'frozen F-DLC-a/b/c STOP set is unchanged by their presence. ⚠ AND THIS STAGE MAKES NO '
      + 'TIER-2 PRE-REGISTRATION AT ALL: DLC-T1\'s tier-2 pre-registration (constructedGe5Share '
      + 'and scrambleShareOfGoals at the COMBINED cell) belonged to ITS §SUCCESS and is NOT '
      + 'carried here. This slice\'s pre-registration is the JOINT primary at PLANE plus the '
      + '#240 OVERSHOOT contrast clause, and nothing else. The tier-2 shares ride REPORTED with '
      + 'CIs so the arc-grain question stays visible; no gate and no success condition reads '
      + 'them.',
    rates,
    anchorReference: ANCHOR_ARM,
    anchorDeltaDirection: `ARM − ${ANCHOR_ARM}`,
    anchorNote: '⭐⭐ THE #240 OVERSHOOT CONTRAST\'s OWN ESTIMATOR, frozen with the prediction: '
      + 'the SAME resampled seed-index sets differenced against the CHOICE ANCHOR (the banked '
      + 'two-point contest, DLC-T1\'s own arm) rather than against the control. It exists because '
      + 'the overshoot clause is a PLANE-versus-ANCHOR sentence and a paired CI for it cannot be '
      + 'read off two control-referenced CIs. Same clusters, same draws, same ratio-of-totals '
      + 'estimator; `resolved` is the same MECHANICAL flag (#203).',
    ratesVsAnchor,
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
const DLCT1S = readJson(DLCT1S_PATH);
const DVT1 = readJson(DVT1_PATH);
const DVT1B = readJson(DVT1B_PATH);
/**
 * ⭐⭐ THE N RULE OF THIS STAGE IS A POOLING RULE, AND IT IS SIZED EX ANTE — BEFORE ANY BATTERY,
 * FROM THE TWO COMMITTED ARTIFACTS' PUBLISHED CIs AND NOTHING ELSE (#253.1).
 *
 * WHY POOLING RATHER THAN "T1's POINT" OR "T1b's POINT". The goals-vs-anchor delta has now been
 * measured twice on this exact configuration, on disjoint seeds:
 *
 *     DV-T1  (283 clusters):  +0.243816  95 % CI [ 0.045936, 0.420495]
 *     DV-T1b (643 clusters):  +0.040435  95 % CI [-0.083981, 0.167963]
 *
 * The CIs OVERLAP, so neither reading contradicts the other; sizing to EITHER point alone would be
 * choosing which of two compatible measurements to believe. Ruling #253.1 therefore orders the N
 * sized "to resolve the POOLED T1+T1b goals-vs-anchor point (inverse-variance pooling of the two
 * committed artifacts' published CIs)". That is the standard fixed-effect combination, and every
 * input is READ from a committed artifact rather than typed here.
 *
 * THE ARITHMETIC, in six steps:
 *   1. SE per study: each published interval is a 2.5/97.5 percentile paired-cluster interval, so
 *      `se_i = ((upper_i - lower_i) / 2) / z.975`.
 *   2. WEIGHTS: `w_i = 1 / se_i^2` — inverse variance, the minimum-variance weighting.
 *   3. POOLED POINT: `theta = (Σ w_i · point_i) / (Σ w_i)`.
 *   4. POOLED SE: `se_pooled = 1 / sqrt(Σ w_i)` (published with its own 95 % interval, which is
 *      REPORTED context — the exam does not adjudicate the pooled number, it is sized to it).
 *   5. SE REQUIRED: `se_req = |theta| / (z.975 + z.80)` — the standard 80 %-power identity at
 *      95 % two-sided, the same `(z.975 + z.80)` this family's N rule has always used.
 *   6. N: the paired cluster bootstrap's SE scales as `1/sqrt(N)` in the number of CLUSTERS (#20:
 *      cluster = match seed), and the SE this stage will actually have is DV-T1b's OWN paired SE
 *      on THIS SAME column at ITS 643 clusters (#253.1: "scaling from T1b's OWN paired se at 643
 *      clusters"), so `N = ceil( 643 · (se_T1b / se_req)^2 )`.
 *   7. `N* = min(N, ledger room)`; when the room binds, the run declares the MDE it ACTUALLY
 *      bought (`mdeBoughtAtNStar`) instead of pretending to the MDE it asked for.
 *
 * ⚠ WHY THE SCALING SE IS T1b's AND NOT THE POOLED ONE, DECLARED: the pooled SE is the precision
 * of TWO batteries combined and is not available to a single new battery; what a new battery of N
 * clusters will have is THIS instrument's per-cluster variance, and the best committed estimate of
 * that is DV-T1b's — same world, same two arm configurations, same rulers, same estimator, same
 * column, 643 clusters. Different seeds, so it is still an ASSUMPTION, and the probe prints the
 * REALISED half-width beside the ex-ante EXPECTED one so the reader can see whether it held.
 *
 * ⚠ AND WHAT IT DOES NOT CLAIM: resolving the pooled point is not the pooled point being real, and
 * a battery sized to it can still come back UNRESOLVED. That is #253.1's third route, and route
 * three is the COMMANDER's honesty ruling, not a probe output.
 */
const N_FROZEN = 1936;
const poolingRule = (() => {
  if (DVT1 === null || DVT1B === null) {
    return {
      available: false,
      note: `absent: ${DVT1 === null ? DVT1_PATH : DVT1B_PATH}`,
      nStar: null as number | null,
    };
  }
  /** the SAME field in both artifacts: the frozen letter's own column. */
  const readGoals = (j: any) => {
    const g = j.preRegisteredPrimary.allArms.dvTruthP.goalsBandLimb.goalsVsAnchor as {
      point: number; lower: number; upper: number;
    };
    return { clusters: j.seeds as number, point: g.point, lower: g.lower, upper: g.upper };
  };
  const t1 = readGoals(DVT1.j);
  const t1b = readGoals(DVT1B.j);
  const seOf = (x: { lower: number; upper: number }): number => ((x.upper - x.lower) / 2) / Z975;
  const studies = [
    { stage: 'DV-T1 (#251)', path: DVT1_PATH, resultSha: DVT1.j.resultSha256, ...t1, se: seOf(t1) },
    { stage: 'DV-T1b (#252)', path: DVT1B_PATH, resultSha: DVT1B.j.resultSha256, ...t1b, se: seOf(t1b) },
  ].map((x) => ({ ...x, halfWidth: (x.upper - x.lower) / 2, weight: 1 / (x.se ** 2) }));
  const wSum = studies.reduce((a, x) => a + x.weight, 0);
  const pooledPoint = studies.reduce((a, x) => a + x.weight * x.point, 0) / wSum;
  const pooledSe = 1 / Math.sqrt(wSum);
  const seRequired = Math.abs(pooledPoint) / (Z975 + Z80);
  /** the scaling study is DV-T1b: its clusters and its SE on this column. */
  const scaleFrom = studies[1];
  const nRaw = Math.ceil(scaleFrom.clusters * ((scaleFrom.se / seRequired) ** 2));
  const ceiling = BATTERY_ROOM;
  const nStar = Math.min(nRaw, ceiling);
  const seAt = (n: number): number => scaleFrom.se * Math.sqrt(scaleFrom.clusters / Math.max(1, n));
  const mdeAt = (n: number): number => (Z975 + Z80) * seAt(n);
  return {
    available: true,
    rule: 'se_i = (CI half-width_i)/z.975 per committed study ; w_i = 1/se_i^2 ; pooledPoint = '
      + 'Σ(w_i·point_i)/Σw_i ; pooledSe = 1/sqrt(Σw_i) ; se_required = |pooledPoint| / '
      + '(z.975 + z.80) [80 % power, 95 % two-sided] ; N = ceil(nScale · (seScale/se_required)^2) '
      + 'with (nScale, seScale) = DV-T1b\'s OWN clusters and SE on this column ; N* = min(N, '
      + 'ledger room) — and when the room binds, the MDE ACTUALLY BOUGHT is declared rather than '
      + 'the MDE asked for',
    field: 'preRegisteredPrimary.allArms.dvTruthP.goalsBandLimb.goalsVsAnchor '
      + '(goalsPerMatch, dvTruthP − planeAnchor, paired cluster bootstrap)',
    studies,
    weightSum: round(wSum, 6),
    pooledPoint: round(pooledPoint, 9),
    pooledSe: round(pooledSe, 9),
    pooledCi: [round(pooledPoint - Z975 * pooledSe, 9), round(pooledPoint + Z975 * pooledSe, 9)],
    pooledCiNote: '⚠ REPORTED CONTEXT, NOT A FINDING. The pooled interval is published because the '
      + 'N rule is cut on the pooled POINT and a reader is owed the precision that point came '
      + 'with. This stage adjudicates NOTHING about it (#203): it is an ex-ante sizing input read '
      + 'off two committed artifacts, and the battery below is a THIRD, independent measurement.',
    targetEstimate: round(Math.abs(pooledPoint), 9),
    targetProvenance: '⭐⭐ THE INVERSE-VARIANCE POOLED GOALS-vs-ANCHOR POINT of DV-T1 and DV-T1b — '
      + 'ruling #253.1\'s named target. Neither parent\'s reading is privileged: their CIs overlap, '
      + 'so choosing one point over the other would be choosing which compatible measurement to '
      + 'believe. Sizing to their minimum-variance combination is what makes this a RE-POWER of the '
      + 'existing evidence rather than a new hypothesis.',
    z: { z975: Z975, z80: Z80 },
    scaleFrom: {
      stage: scaleFrom.stage, clusters: scaleFrom.clusters, se: round(scaleFrom.se, 9),
      why: '⭐ #253.1: "scaling from T1b\'s OWN paired se at 643 clusters (the same 1/sqrt(N) '
        + 'cluster law T1b used, #20)". The POOLED se is the precision of two batteries combined '
        + 'and is not available to one new battery; what a new battery has is this instrument\'s '
        + 'own per-cluster variance, and DV-T1b is its most recent committed estimate on this '
        + 'exact column, world and pair of arms.',
    },
    seRequired: round(seRequired, 9),
    nRaw,
    batteryRoom: BATTERY_ROOM,
    ceiling,
    roomBinds: nRaw > BATTERY_ROOM,
    nStar,
    nFrozen: N_FROZEN,
    frozenMatchesDerivation: N_FROZEN === nStar,
    mdeBoughtAtNStar: round(mdeAt(nStar), 9),
    mdeAskedFor: round(Math.abs(pooledPoint), 9),
    expectedHalfWidthAtNStar: round(Z975 * seAt(nStar), 9),
    roomForkNote: nRaw > BATTERY_ROOM
      ? '⚠ THE ROOM BINDS: the pooling rule asks for more clusters than ruling #253.1\'s block '
        + 'room allows. The ROOM is RUN and `mdeBoughtAtNStar` is the effect size this battery can '
        + 'actually resolve at 80 % power — DECLARED, not re-cut (#253.1).'
      : 'the room does not bind at this reading: the pooling rule\'s own N is run',
    batteryBlock: `${BATTERY_BASE}..${BATTERY_BASE + nStar - 1}`,
    primaryRulers: '⭐ THE COLUMN THE N IS CUT ON IS `goalsPerMatch` (dvTruthP − planeAnchor), '
      + 'because that is the column the frozen letter reads. Ruler 1 (TRUE-holdable supply) rides '
      + 'REPUBLISHED with its CI for continuity and sizes NOTHING here — #252 closed the supply '
      + 'question at exam grain and this stage does not re-open it.',
    costNote: '⭐ BUDGET IT (#228.4): this stage walks TWO arms per seed where DV-T1b walked three, '
      + 'so the wall per seed is roughly two thirds of DV-T1b\'s, against about three times its '
      + 'cluster count.',
  };
})();
/** the emitted name the rest of the file uses, so the artifact key and the sizing object cannot
 *  drift apart. */
const nRule = poolingRule;

/* ========================================================================== */
/* §10 MODE / SEED ROUTING (the exit-semantics guard block)                    */
/* ========================================================================== */
const RUN_N = MODE === 'smoke' ? (N_ENV ?? SMOKE_N) : (N_ENV ?? (nRule.nStar ?? 0));
const RUN_BASE = OVERRIDDEN ? GUARD_BLOCK[0] : (MODE === 'smoke' ? SMOKE_BASE : BATTERY_BASE);
if (MODE === 'full' && RUN_N <= 0) {
  console.error(`DV-T1c FATAL — full mode needs DV-T1's committed artifact for the EX-ANTE power `
    + `rule (${DVT1_PATH}).`);
  process.exit(2);
}

banner('');
banner('=============================================================================');
banner(`DV-T1c THE GOALS RE-POWER (#253.1) · mode ${MODE} · N ${RUN_N} seeds × ${ARMS.length} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1} · world = PERCEPT-ARMED (edsPerceivedChoice)`);
banner('arms: PLANE-ANCHOR · dvTruthP (NO control arm, #253.1) — differing by EXACTLY the PRICE');
banner(`EX-ANTE pooling rule ⇒ N* ${String(nRule.nStar)} (frozen literal ${N_FROZEN}, ledger room `
  + `${BATTERY_ROOM})`);
if (OVERRIDDEN) {
  banner('⚠ OVERRIDE IN FORCE (DVT1C_N / DVT1C_SKIP_FP) — routed onto the EXIT-SEMANTICS GUARD');
  banner(`  BLOCK ${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}; G-CLEAN-INVOCATION goes RED and this run`);
  banner('  adjudicates NOTHING.');
}
banner('=============================================================================');

/* ========================================================================== */
/* §11 CHECKPOINT / RESUME — RESILIENCE ONLY (#207 form)                       */
/* ========================================================================== */
const CKPT_PATH = process.env.DVT1C_CHECKPOINT ?? '/tmp/dv-t1c-checkpoint.jsonl';
const RESUME = process.env.DVT1C_RESUME === '1';
const CHECKPOINTING = MODE === 'full';
const PROBE_SELF_PATH = 'scripts/probes/dv-t1c-goals-repower.ts';
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
  console.error(`DV-T1c FATAL — REFUSING TO RESUME: ${why}`);
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
  reproDlcT1sPlane: PerMatch[];
  /** ⭐⭐ G-REPRO-T1: DV-T1's own battery block, re-walked on ALL THREE of THIS exam's arms
   *  through THIS exam's own arm constructors. */
  reproDvt1: Record<ArmName, PerMatch[]>;
  /** ⭐⭐ G-REPRO-T1B: DV-T1b's own battery block, re-walked on BOTH of THIS exam's arms. */
  reproDvt1b: Record<ArmName, PerMatch[]>;
  dose: Record<ArmName, ReturnType<typeof doseRead>>;
  strike: Record<ArmName, ReturnType<typeof strikeReadOf>>;
  h250a: ReturnType<typeof h250aCounterfactual>;
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
  banner(`  pass ${pass} · ⭐⭐ STRIKE READ (seed ${STRIKE_READ_SEED}, ${ARMS.length} arms × 2 `
    + 'matches: traced + untraced lockstep twin)...');
  const strike = Object.fromEntries(ARMS.map((a) => [a, strikeReadOf(a)])) as Core['strike'];
  banner(`  pass ${pass} · ⭐⭐ H-250a FLIP-vs-SUPPRESS COUNTERFACTUAL (seed ${H250A_SEED}, `
    + `${H250A_STATES.length} dose states × one-tick forks)...`);
  const h250a = h250aCounterfactual();
  banner(`  pass ${pass} · ⭐⭐ G-ANCHOR (G-REPRO-DLCT1): block ${REPRO_DLCT1S_BASE} `
    + `(${REPRO_DLCT1S_N} matches on DLC-T1's OWN CHOICE arm)`);
  const reproDlcT1sPlane: PerMatch[] = [];
  for (let i = 0; i < REPRO_DLCT1S_N; i++) {
    reproDlcT1sPlane.push(walkSeed(REPRO_DLCT1S_BASE + i, 'reproDlcT1sPlane'));
  }
  banner(`  pass ${pass} · ⭐⭐ G-REPRO-T1 (THE IDENTITY OF RECORD): block ${REPRO_DVT1_BASE} `
    + `(${REPRO_DVT1_N} matches × ${ARMS.length} arms, DV-T1's OWN battery rows)...`);
  /** ⭐⭐ NOTE THE ARM NAMES: these walks go through `walkSeed(seed, a)` with THIS EXAM'S OWN arm
   *  names, i.e. through `matchOf`'s reading of THIS file's DOOR / GENE / DOSE / DV tables. That
   *  is the whole point — the receipt is not "an arm that looks like DV-T1's", it is THIS
   *  probe's arm, and it must reproduce DV-T1's committed rows byte for byte. */
  const reproDvt1 = Object.fromEntries(ARMS.map((a) => {
    const rows: PerMatch[] = [];
    for (let i = 0; i < REPRO_DVT1_N; i++) rows.push(walkSeed(REPRO_DVT1_BASE + i, a));
    return [a, rows];
  })) as Record<ArmName, PerMatch[]>;

  banner(`  pass ${pass} · ⭐⭐ G-REPRO-T1B (THE IDENTITY OF RECORD, HALF TWO): block `
    + `${REPRO_DVT1B_BASE} (${REPRO_DVT1B_N} matches × ${ARMS.length} arms, DV-T1b's OWN battery `
    + 'rows)...');
  const reproDvt1b = Object.fromEntries(ARMS.map((a) => {
    const rows: PerMatch[] = [];
    for (let i = 0; i < REPRO_DVT1B_N; i++) rows.push(walkSeed(REPRO_DVT1B_BASE + i, a));
    return [a, rows];
  })) as Record<ArmName, PerMatch[]>;

  return {
    byArm, reproO2, repro173, reproGgc, reproCtbT1, reproObmT1Absent, reproObmT1CheckAndShow,
    reproDlcT1sPlane, reproDvt1, reproDvt1b,
    dose, strike, h250a, restored, computed,
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
  /** The committed DLC-T1 BATTERY artifact publishes per-match rows for every arm. This probe
   *  re-walks the first `REPRO_DLCT1S_N` rows of its CHOICE arm — `dlcDeliveryChoice` armed alone
   *  at gene 1, in DLC-T1's own percept-armed world — and must reproduce every published field EXACTLY,
   *  including the whole-match SIGNATURE (rng stream state inside) AND the DELIVERED-LEAD
   *  columns (`passesChosen` / `ptpLedHandled` / `ptpLedNonZero` / `ptpLeadSum` / `ptpLeadMax`),
   *  which no other G-REPRO in this family carries.
   *
   *  ⭐ IT CARRIES THREE LOADS AT ONCE, and that is why it is this stage's hardest gate:
   *    (1) THE INSTRUMENT IS DLC-T1's — every ruler, sampling rule, walk order and constant;
   *    (2) THE CONTRAST ANCHOR IS THE REAL ARM — the CHOICE-ANCHOR exam arm is
   *        CONFIGURATION-IDENTICAL to this walk, so "the plane versus the two-point contest"
   *        (the whole #240 overshoot clause) is a comparison against ruling #239's own arm
   *        rather than against a look-alike;
   *    (3) THE STRIKE WRAPPER PERTURBS NOTHING — it is installed on this walk too, and the
   *        DELIVERED-LEAD columns it produces are themselves compared field for field.
   *  Targets are READ from the artifact, never typed. */
  const DLCT1S_FIELDS = [
    'seed', 'eligible', 'trueHoldable', 'firstRecOpen', 'firstRecOpenPressed',
    'possTicks', 'possTicksShort', 'possTicksPressed', 'possTicksPressedShort',
    'firstRecShort', 'firstRecPressedShort', 'supportTicks', 'supportTicksShifted',
    'clampXBound', 'clampYBound', 'interceptions', 'offsides', 'goals',
    'spreadYOut', 'spacingMedian',
    'passesChosen', 'ptpLedHandled', 'ptpLedNonZero', 'ptpLeadSum', 'ptpLeadMax',
    'ticksWalked', 'signature',
  ] as const;
  const dlcT1sRowOf = (r: PerMatch): Record<string, unknown> => ({
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
  const dlcT1sCommitted = DLCT1S === null ? [] : ((DLCT1S.j.perMatch.plane ?? []) as any[]);
  const dlcT1sRows = core.reproDlcT1sPlane.map((r, i) => {
    const want = dlcT1sCommitted[i];
    const got = dlcT1sRowOf(r);
    const differing = want === undefined ? [...DLCT1S_FIELDS]
      : DLCT1S_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
    return { seed: r.seed, differingFields: differing, got };
  });
  const dlcT1sMismatches = dlcT1sRows.filter((x) => x.differingFields.length > 0);

  /* --- ⭐⭐ G-REPRO-T1: THE CONFIGURATION IDENTITY WITH DV-T1, EARNED ROW BY ROW ----------- */
  /** ⭐⭐ THIS STAGE'S IDENTITY OF RECORD (ruling #251.2's "configuration byte-identical to
   *  DV-T1's … identity gated", and the #251.3 lesson discharged in the only way that cannot go
   *  dead by construction). The committed DV-T1 battery artifact publishes per-match rows for
   *  every arm. This probe re-walks the first `REPRO_DVT1_N` of them ON ALL THREE OF ITS OWN
   *  ARMS — `absent`, `planeAnchor`, `dvTruthP` — through its OWN `matchOf`, and must reproduce
   *  every published field EXACTLY, whole-match SIGNATURE (rng stream state inside) and
   *  delivered-strike columns included.
   *
   *  ⭐ WHY THIS IS THE RIGHT INSTRUMENT FOR "byte-identical configuration": a predicate that
   *  compares this file's tables against numbers typed in this file can be true by construction
   *  and prove nothing (the #251.3 HIGH). A re-walk cannot: the belief vector, the exposure
   *  weight, the plane door, the gene value, the world flags and every ruler constant all enter
   *  the signature, so a single differing byte anywhere in the configuration reds this gate.
   *  Targets are READ from the artifact, never typed. */
  const dvt1Committed = (a: ArmName): any[] => (DVT1 === null ? []
    : ((DVT1.j.perMatch[a] ?? []) as any[]));
  const dvt1ArmCompare = (a: ArmName) => {
    const walked = core.reproDvt1[a];
    const committed = dvt1Committed(a);
    const rows = walked.map((r, i) => {
      const want = committed[i];
      const got = dlcT1sRowOf(r);
      const differing = want === undefined ? [...DLCT1S_FIELDS]
        : DLCT1S_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
      return { seed: r.seed, differingFields: differing, got };
    });
    const mismatches = rows.filter((x) => x.differingFields.length > 0);
    return {
      arm: a,
      rowsChecked: rows.length,
      committedRowsAvailable: committed.length,
      mismatches: mismatches.length,
      mismatchRows: mismatches,
      identical: rows.length > 0 && mismatches.length === 0 && committed.length >= rows.length,
    };
  };
  const dvt1Arms = Object.fromEntries(ARMS.map((a) => [a, dvt1ArmCompare(a)]));
  const dvt1AllIdentical = ARMS.every((a) => (dvt1Arms as any)[a].identical === true);

  /* --- ⭐⭐ G-REPRO-T1B: THE SAME RECEIPT AGAINST THE OTHER PARENT ------------------------- */
  /** ⭐⭐ #253.1 says "identity via re-walks of BOTH prior batteries' committed rows", and the two
   *  halves are not redundant: DV-T1 and DV-T1b published rows for these SAME two arm
   *  configurations on DISJOINT seed blocks, so reproducing both makes the identity a statement
   *  about the CONFIGURATION rather than about one block of seeds. Targets READ from the artifact,
   *  never typed. */
  const dvt1bCommitted = (a: ArmName): any[] => (DVT1B === null ? []
    : ((DVT1B.j.perMatch[a] ?? []) as any[]));
  const dvt1bArmCompare = (a: ArmName) => {
    const walked = core.reproDvt1b[a];
    const committed = dvt1bCommitted(a);
    const rows = walked.map((r, i) => {
      const want = committed[i];
      const got = dlcT1sRowOf(r);
      const differing = want === undefined ? [...DLCT1S_FIELDS]
        : DLCT1S_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
      return { seed: r.seed, differingFields: differing, got };
    });
    const mismatches = rows.filter((x) => x.differingFields.length > 0);
    return {
      arm: a,
      rowsChecked: rows.length,
      committedRowsAvailable: committed.length,
      mismatches: mismatches.length,
      mismatchRows: mismatches,
      identical: rows.length > 0 && mismatches.length === 0 && committed.length >= rows.length,
    };
  };
  const dvt1bArms = Object.fromEntries(ARMS.map((a) => [a, dvt1bArmCompare(a)]));
  const dvt1bAllIdentical = ARMS.every((a) => (dvt1bArms as any)[a].identical === true);

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
    gReproT1: {
      block: `${REPRO_DVT1_BASE}..${REPRO_DVT1_BASE + REPRO_DVT1_N - 1}`,
      source: DVT1_PATH,
      sourceResultSha: DVT1 === null ? null : DVT1.j.resultSha256,
      sourceArms: ARMS,
      fieldsPerRow: DLCT1S_FIELDS.length,
      perArm: dvt1Arms,
      identical: dvt1AllIdentical,
      note: '⭐⭐ THE IDENTITY OF RECORD (#251.2 / the #251.3 lesson). Ruling #251.2 requires this '
        + 'extension\'s two arms to be CONFIGURATION-BYTE-IDENTICAL to DV-T1\'s, and #251.3 '
        + 'forbids inheriting another exam\'s configuration predicate. So the identity is EARNED '
        + 'rather than asserted: each of THIS exam\'s two arms re-walks the first rows of '
        + 'DV-T1\'s OWN committed battery block, through THIS file\'s own arm constructors, and '
        + 'must reproduce every published field exactly — including the whole-match SIGNATURE '
        + '(rng stream state inside) and the delivered-strike columns. The belief vector, the '
        + 'exposure weight, the plane door, the gene, the world flags and every ruler constant '
        + 'all feed that signature, so a configuration that differed anywhere could not '
        + 'reproduce one row. A DELIBERATE re-walk (receipt), never fresh data.',
    },
    gReproT1b: {
      block: `${REPRO_DVT1B_BASE}..${REPRO_DVT1B_BASE + REPRO_DVT1B_N - 1}`,
      source: DVT1B_PATH,
      sourceResultSha: DVT1B === null ? null : DVT1B.j.resultSha256,
      sourceArms: ARMS,
      fieldsPerRow: DLCT1S_FIELDS.length,
      perArm: dvt1bArms,
      identical: dvt1bAllIdentical,
      note: '⭐⭐ THE IDENTITY OF RECORD, HALF TWO (#253.1: "identity via re-walks of BOTH prior '
        + 'batteries\' committed rows"). Each of THIS exam\'s two arms re-walks the first rows of '
        + 'DV-T1b\'s OWN committed battery block, through THIS file\'s own arm constructors, and '
        + 'must reproduce every published field exactly — whole-match SIGNATURE (rng stream state '
        + 'inside) and the delivered-strike columns included. Together with G-REPRO-T1 it makes '
        + '"configurations byte-identical to T1/T1b" a receipt on TWO disjoint seed blocks rather '
        + 'than an assertion about one. A DELIBERATE re-walk (receipt), never fresh data.',
    },
    deliveredDose: core.dose,
    strikeRead: core.strike,
    h250aCounterfactual: core.h250a,
    contrasts: bootstrapAll(core.byArm),
    gAnchor: {
      block: `${REPRO_DLCT1S_BASE}..${REPRO_DLCT1S_BASE + REPRO_DLCT1S_N - 1}`,
      source: DLCT1S_PATH,
      sourceArm: 'plane',
      sourceResultSha: DLCT1S === null ? null : DLCT1S.j.resultSha256,
      world: 'DLC-T1\'s OWN percept-armed world (`edsPerceivedChoice: true`) with '
        + '`dlcDeliveryChoice` ARMED ALONE at `passLeadSupport` 1 — no OBM matrix, and neither '
        + '`ptpPassLead` nor `dlcStrikePlane` ever passed (DLC-T1 predates the plane). '
        + 'CONFIGURATION-IDENTICAL to this exam\'s CHOICE-ANCHOR arm, which is the whole point.',
      fieldsPerRow: DLCT1S_FIELDS.length,
      rowsChecked: dlcT1sRows.length,
      committedRowsAvailable: dlcT1sCommitted.length,
      mismatches: dlcT1sMismatches.length,
      mismatchRows: dlcT1sMismatches,
      identical: dlcT1sRows.length > 0 && dlcT1sMismatches.length === 0
        && dlcT1sCommitted.length >= dlcT1sRows.length,
      note: '⭐⭐ THE ANCHOR RE-WALK — ONE RECEIPT CARRYING THREE LOADS. (1) THE INSTRUMENT IS '
        + 'DLC-T1\'s (and through it PTP-T1\'s / OBM-T1\'s / CTB-T1\'s): every ruler, sampling '
        + 'rule, walk order and constant, proved by reproducing the committed BATTERY rows field '
        + 'for field with the whole-match SIGNATURE (rng stream state inside). (2) THE CONTRAST '
        + 'ANCHOR IS RULING #239\'s OWN ARM, not a look-alike: this exam\'s CHOICE-ANCHOR arm is '
        + 'the same configuration, so every PLANE-versus-CONTEST reading — the whole #240 '
        + 'overshoot clause — is against the arm that actually ran. (3) THE STRIKE WRAPPER '
        + 'PERTURBS NOTHING: it is installed here too, and the DELIVERED-STRIKE columns it '
        + 'produces (`passesChosen` · `ptpLedHandled` · `ptpLedNonZero` · `ptpLeadSum` · '
        + '`ptpLeadMax`) are themselves compared — a load no other G-REPRO in this family '
        + 'carries. A single changed instrument constant, sampling rule, walk order or arm flag '
        + 'reds this gate. The block rides as a RECEIPT re-walk only — never fresh data.',
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
banner(`  [dv-t1c] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = computeCore(2);
const bodyB = coreBody(coreB);
const digestB = sha(canonical(bodyB));
const xDet = digestA === digestB;
banner(`  [dv-t1c] pass 2 digest ${digestB} — X-DET ${xDet ? 'PASS' : 'FAIL'}`);

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (DVT1C_SKIP_FP)' : leagueHash(FINGERPRINT_SEED);
const xFpProd = !SKIP_FP && fpObserved === FINGERPRINT_BASELINE;

/* ========================================================================== */
/* §13a THE FROZEN BASES — read from DV-T1b's committed artifact (no control arm) */
/* ========================================================================== */
const C = bodyA.contrasts.rates as Record<string, Record<ArmName, any>>;

/* --------------------------------------------------------------------------
 * ⭐⭐ THE FROZEN BASES — the three quantities a TWO-ARM exam cannot measure.
 *
 * DV-T1 and DV-T1b cut their guard tolerances, their band-exclusion set and their saturation
 * headroom on an ABSENT arm. #253.1 removes that arm, so those three bases are READ FROM DV-T1b's
 * COMMITTED ARTIFACT — its own absent arm at 643 clusters — rather than re-measured here or, worse,
 * silently re-cut onto the anchor (which would LOOSEN the interception tolerance every time the
 * plane raised the level it is measured against). Ruling #253.1's words are "the frozen guards at
 * T1b's tolerances", and this is that, machine-checked by G-FROZEN-BASES: the tolerance numbers
 * are the ones the committed artifact publishes, not numbers this file re-derives and hopes match.
 *
 * ⚠ WHAT CHANGES AND WHAT DOES NOT, DECLARED. The TOLERANCE is T1b's, unchanged and absolute. The
 * CONTRAST is necessarily different: T1b measured ARM − CONTROL (plane + price versus a bare
 * world); this stage can only measure dvTruthP − planeAnchor (the PRICE's own marginal effect on
 * top of the plane). That is the STRICTER reading of the same tolerance — the plane's own
 * contribution, which is most of every guard delta T1b published, is differenced away — so a guard
 * that passed at T1b cannot be made to pass here by the change of base. Published per row so the
 * reader compares like with like.
 * -------------------------------------------------------------------------- */
type GuardDir = 'ceiling' | 'floor';
const GUARD_LIMBS: readonly { key: RateKey; direction: GuardDir; family: string }[] = [
  { key: 'interceptionsPerMatch', direction: 'ceiling', family: 'F-DLC-b interception (the NAMED risk: led passes into traffic)' },
  { key: 'spreadYOut', direction: 'floor', family: 'F-DLC-b clump' },
  { key: 'spacingMedian', direction: 'floor', family: 'F-DLC-b clump' },
  { key: 'spacingUnder4', direction: 'ceiling', family: 'F-DLC-b clump' },
];
/** every base below is READ from the committed DV-T1b artifact; nothing here is typed. */
const frozenBases = (() => {
  const j = DVT1B === null ? null : DVT1B.j;
  const tolRows: any[] = j === null ? [] : (j.guardVerdicts.tolerances as any[]);
  const tolOf = (key: RateKey) => tolRows.find((r) => r.key === key) ?? null;
  const bandAbsent: Record<string, any> | null = j === null ? null : j.arms.absent.guards.band;
  const satOf = (path: 'ruler4bSupportAtPressedFirstRec' | 'ruler3bShortOptionFirstRec') =>
    (j === null ? null : j.saturationCeilings[path]);
  /** the frozen tolerance is re-derived from the frozen CONTROL LEVEL and cross-checked against
   *  the tolerance the artifact itself published — two independent statements of one number. */
  const rows = GUARD_LIMBS.map((l) => {
    const t = tolOf(l.key);
    const controlLevel = t === null ? Number.NaN : (t.controlLevel as number);
    const derived = round(NI_FRACTION * Math.abs(controlLevel), 6);
    return {
      key: l.key,
      frozenControlLevel: controlLevel,
      publishedTolerance: t === null ? Number.NaN : (t.toleranceAbs as number),
      rederivedTolerance: derived,
      agrees: t !== null && Math.abs(derived - (t.toleranceAbs as number)) <= 5e-7,
      direction: t === null ? null : t.direction,
      directionAgrees: t !== null && t.direction === l.direction,
    };
  });
  return {
    source: DVT1B_PATH,
    sourceResultSha: j === null ? null : j.resultSha256,
    sourceSha256: DVT1B === null ? null : sha(DVT1B.bytes.toString('utf8')),
    sourceClusters: j === null ? null : (j.seeds as number),
    sourceArm: 'absent (DV-T1b\'s own CONTROL arm)',
    guardRows: rows,
    bandAbsentInBand: bandAbsent === null ? null
      : Object.fromEntries(BAND_KEYS.map((k) => [k, bandAbsent[k].inBand as boolean])),
    saturation: {
      ruler4bSupportAtPressedFirstRec: satOf('ruler4bSupportAtPressedFirstRec'),
      ruler3bShortOptionFirstRec: satOf('ruler3bShortOptionFirstRec'),
    },
    allAgree: rows.length === GUARD_LIMBS.length && rows.every((r) => r.agrees && r.directionAgrees)
      && bandAbsent !== null,
    note: '⭐⭐ THE BASES A TWO-ARM EXAM CANNOT MEASURE, READ FROM THE PARENT RATHER THAN INVENTED. '
      + 'Ruling #253.1 removes the control arm, so the guard tolerances, the band\'s #198-form '
      + 'exclusion set and the saturation headroom come from DV-T1b\'s committed artifact (its own '
      + 'absent arm, 643 clusters). Each tolerance is RE-DERIVED here from the frozen control level '
      + '(NI_FRACTION · |level|) and cross-checked against the number the artifact itself '
      + 'published — a drifted parent reds G-FROZEN-BASES instead of riding in.',
  };
})();
const bandExcluded = BAND_KEYS.filter((k) => frozenBases.bandAbsentInBand !== null
  && frozenBases.bandAbsentInBand[k] === false);
const bandGated = BAND_KEYS.filter((k) => frozenBases.bandAbsentInBand !== null
  && frozenBases.bandAbsentInBand[k] === true);

/* ========================================================================== */
/* §13 THE GUARD VERDICT ROWS (tolerances FROZEN at DV-T1b's, computed here)   */
/* ========================================================================== */
const guardRows = GUARD_LIMBS.map((l) => {
  const fb = frozenBases.guardRows.find((r) => r.key === l.key)!;
  const tol = fb.rederivedTolerance;
  return {
    key: l.key, family: l.family, direction: l.direction,
    frozenControlLevel: fb.frozenControlLevel,
    frozenControlLevelSource: `${DVT1B_PATH} → guardVerdicts.tolerances[${l.key}].controlLevel `
      + '(DV-T1b\'s own ABSENT arm at 643 clusters)',
    toleranceAbs: tol,
    toleranceAgreesWithParent: fb.agrees,
    anchorLevelThisStage: round(C[l.key][ANCHOR_ARM].point as number, 6),
    toleranceForm: 'NI_FRACTION · |DV-T1b\'s frozen controlLevel|, NI_FRACTION = 1 − 0.275/0.380 '
      + '(PM-T1 §5, inherited from A4-S2P1-VECTOR-CENSUS §4) — frozen ex ante in the stage doc and '
      + 'READ from the parent artifact, never re-cut on this stage\'s own arms',
    contrastNote: '⚠ THE CONTRAST IS dvTruthP − planeAnchor (this exam has no control arm), i.e. '
      + 'the RISK PRICE\'s OWN marginal effect on top of the banked plane — a STRICTER reading of '
      + 'the same absolute tolerance than DV-T1b\'s ARM − CONTROL delta, because the plane\'s own '
      + 'contribution is differenced away rather than added in. The anchor\'s own level on this '
      + 'stage\'s seeds is published beside the frozen base so the two can be compared.',
    arms: Object.fromEntries(ARMS.filter((a) => a !== BASE_ARM).map((a) => {
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
const offsideRows = Object.fromEntries(ARMS.filter((a) => a !== BASE_ARM).map((a) => {
  const d = C.offsidesPerMatch[a].pairedDelta;
  return [a, {
    delta: d.point, ci: [d.lower, d.upper], resolved: C.offsidesPerMatch[a].resolved,
    resolvedIncrease: (C.offsidesPerMatch[a].resolved as boolean) && (d.point as number) > 0,
  }];
}));
const bandRows = Object.fromEntries(ARMS.map((a) => {
  const b = (bodyA.arms as any)[a].guards.band as Record<string, any>;
  return [a, {
    perDimension: Object.fromEntries(BAND_KEYS.map((k) => [k, { perMatch: b[k].perMatch, inBand: b[k].inBand }])),
    allGatedDimensionsInBand: bandGated.every((k) => b[k].inBand),
  }];
}));

/* ========================================================================== */
/* §13b THE CEILINGS — rulers 3b/4b are NEAR-SATURATED, and by how much       */
/* ========================================================================== */
/** ⭐ THE HEADROOM IS DV-T1b's FROZEN ONE (its absent arm), because headroom is a statement about
 *  the BARE world's level and this stage has no bare arm. The per-arm consumption below is
 *  therefore this stage's own anchor-referenced delta measured against the PARENT's headroom, and
 *  it is labelled as exactly that rather than presented as a like-for-like re-measurement. */
const ceilingOf = (key: RateKey, frozen: any) => {
  const absent = frozen === null ? Number.NaN : (frozen.absentLevel as number);
  const headroomPp = frozen === null ? Number.NaN : (frozen.helpfulHeadroomPp as number);
  return {
    absentLevelFrozen: absent,
    absentLevelPctFrozen: frozen === null ? Number.NaN : (frozen.absentLevelPct as number),
    helpfulHeadroomPpFrozen: headroomPp,
    frozenSource: `${DVT1B_PATH} → saturationCeilings (DV-T1b's own ABSENT arm at 643 clusters)`,
    anchorLevelThisStage: round(C[key][ANCHOR_ARM].point as number, 6),
    perArm: Object.fromEntries(ARMS.filter((a) => a !== BASE_ARM).map((a) => {
      const d = C[key][a].pairedDelta.point as number;
      return [a, {
        deltaPpVsAnchor: round(d * 100, 3),
        shareOfFrozenHeadroomConsumed: round(headroomPp === 0 ? Number.NaN : (d * 100) / headroomPp, 4),
        resolved: C[key][a].resolved as boolean,
      }];
    })),
  };
};
const saturationCeilings = {
  note: '⭐ THE CEILINGS, DISCLOSED (the ruled amendment): rulers 3b and 4b are bounded above by '
    + '100 %, and the bare world already sits just under it. ⚠ AT THIS STAGE THE HEADROOM IS '
    + 'FROZEN AT DV-T1b\'s (this exam has no absent arm) and the per-arm column is this stage\'s '
    + 'ANCHOR-referenced delta — the risk price\'s own marginal move, not the plane\'s. REPORTED '
    + 'only; no gate reads a cell of this table.',
  ruler4bSupportAtPressedFirstRec: ceilingOf('supportAtPressedFirstRecShare',
    frozenBases.saturation.ruler4bSupportAtPressedFirstRec),
  ruler3bShortOptionFirstRec: ceilingOf('shortOptionFirstRecShare',
    frozenBases.saturation.ruler3bShortOptionFirstRec),
  decodeNote: '⚠ LABELLED DECODE NOTE, NOT A CONCLUSION (the commander\'s reading, recorded so it '
    + 'can be tested rather than assumed): in the BARE world the radius-family proximity '
    + 'predicate is NEAR-SATURATED — a body is almost always within the support radius — so the '
    + 'scarcity H-CTB is about does not live in RAW PROXIMITY at all; it lives in whether that '
    + 'body is a SAFE support (holdable, unpressed).',
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
 *   · `re-walk`  — a DELIBERATE receipt walk of a SOURCE's own committed block (all EIGHT of
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
    name: '⭐⭐ strikeRead (the DECLARED fifth block, observational: traced + untraced twin)',
    first: STRIKE_READ_SEED, last: STRIKE_READ_SEED, kind: 'fresh',
  },
  /** ⭐ DV-T1's walked-block list OMITTED its H-250a read seed, and an omitted block is an
   *  UNCHECKED block. This stage declares it. */
  {
    name: '⭐ h250aCounterfactualRead (the DECLARED sixth block, observational)',
    first: H250A_SEED, last: H250A_SEED, kind: 'fresh',
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
    name: '⭐⭐ reproDlcT1sPlane (re-walk — G-ANCHOR: DLC-T1s\'s BATTERY block on its PLANE arm)',
    first: REPRO_DLCT1S_BASE, last: REPRO_DLCT1S_BASE + REPRO_DLCT1S_N - 1, kind: 're-walk',
  },
  {
    name: '⭐⭐ reproDvt1 (re-walk — G-REPRO-T1: DV-T1\'s BATTERY block on BOTH of this exam\'s '
      + 'own arms; the IDENTITY OF RECORD, half one)',
    first: REPRO_DVT1_BASE, last: REPRO_DVT1_BASE + REPRO_DVT1_N - 1, kind: 're-walk',
  },
  {
    name: '⭐⭐ reproDvt1b (re-walk — G-REPRO-T1B: DV-T1b\'s BATTERY block on BOTH of this '
      + 'exam\'s own arms; the IDENTITY OF RECORD, half two)',
    first: REPRO_DVT1B_BASE, last: REPRO_DVT1B_BASE + REPRO_DVT1B_N - 1, kind: 're-walk',
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
  && DOSE_READ_SEED < STRIKE_READ_SEED
  && STRIKE_READ_SEED < H250A_SEED
  && H250A_SEED < GUARD_BLOCK[0]
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
    dlcStrikePlane: m.dlcStrikePlane,
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
    /** ⭐⭐ THE DV ARMING CHECKLIST, READ BACK OFF THE CONSTRUCTED MATCH: the flag, both genes
     *  on all three genome views of both teams at the DECLARED dose, and the belief vector read
     *  back THROUGH THE SHIPPED accessor rather than off the object the probe wrote. */
    dvDeliveryValue: m.dvDeliveryValue,
    dvGenesAsDeclared: dvGenesOnAllViews(m, DV[a]),
    dvSeatFormed: deliveryValueSeatOf(m.teams[0].effGenome) !== null,
    dvExposureReadBack: DV[a] === null ? null : dvExposureWeightOf(m.teams[1].effGenome),
    dvBeliefReadBack: DV[a] === null ? null : dvLossBeliefVector(m.teams[1].effGenome),
  }];
}));
const twoDoors = {
  ctbSupportPlaneFalseInEveryArm: ARMS.every((a) => (armWorlds as any)[a].ctbSupportPlane === false),
  perceptArmedInEveryArm: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true),
  obmFlagMatchesMatrix: ARMS.every((a) => (armWorlds as any)[a].obmMovement === (DOSE[a] !== null)),
  matrixOnAllViewsWhereArmed: ARMS.every((a) => (armWorlds as any)[a].matrixPresentOnAllViews
    === (DOSE[a] !== null)),
  /** ⭐⭐ THE DELIVERY DOORS, asserted off the constructed matches — and the EXCLUSIVITY with
   *  them. ⚠ `dvDeliveryValue` is NOT a delivery door: it is a PRICE on whatever door produced
   *  the candidate (DV-T0 §LAW: "this seam does not COMPETE with those doors — it prices
   *  whatever they produce"), which is why it is asserted separately below. */
  ptpFlagMatchesDoor: ARMS.every((a) => (armWorlds as any)[a].ptpPassLead === (DOOR[a] === 'ptp')),
  dlcFlagMatchesDoor: ARMS.every((a) => (armWorlds as any)[a].dlcDeliveryChoice === (DOOR[a] === 'dlc')),
  spFlagMatchesDoor: ARMS.every((a) => (armWorlds as any)[a].dlcStrikePlane === (DOOR[a] === 'sp')),
  /** ⭐⭐ THE RETIRED DIAL AND THE BANKED CONTEST ARE NOWHERE IN THIS EXAM (#235/#244): every
   *  treatment arm rides the SAME banked strike plane, so the ONLY thing that varies across
   *  them is the risk price. */
  dialNeverArmed: ARMS.every((a) => (armWorlds as any)[a].ptpPassLead === false),
  contestNeverArmed: ARMS.every((a) => (armWorlds as any)[a].dlcDeliveryChoice === false),
  neverBothDeliveryDoors: ARMS.every((a) => [
    (armWorlds as any)[a].ptpPassLead, (armWorlds as any)[a].dlcDeliveryChoice,
    (armWorlds as any)[a].dlcStrikePlane,
  ].filter((x) => x === true).length <= 1),
  /** ⭐⭐ THE DV ARMING CHECKLIST'S TWO LIMBS, ASSERTED PER ARM: the flag is on IF AND ONLY IF
   *  the arm declares a DV state, and where it is on BOTH genes carry the DECLARED dose on all
   *  three genome views of both teams (read back off the constructed match, not off the object
   *  the probe wrote). Where it is off, both keys are genuinely ABSENT — born absent, not
   *  zeroed. */
  dvFlagMatchesDeclaration: ARMS.every((a) => (armWorlds as any)[a].dvDeliveryValue === (DV[a] !== null)),
  dvGenesMatchDeclaration: ARMS.every((a) => (armWorlds as any)[a].dvGenesAsDeclared === true),
  dvBeliefReadBackMatches: ARMS.every((a) => (DV[a] === null
    ? (armWorlds as any)[a].dvBeliefReadBack === null
    : JSON.stringify((armWorlds as any)[a].dvBeliefReadBack) === JSON.stringify(DV[a]!.belief))),
  /** ⭐ THE BELIEF DOSE IS THE CENSUS'S OWN VECTOR — on every TRUTH arm, byte for byte against
   *  the artifact this probe read (never a literal). */
  truthArmsCarryTheCensusVector: ARMS.filter((a) => DV[a] !== null)
    .every((a) => JSON.stringify(DV[a]!.belief) === JSON.stringify(TRUTH_BELIEF)),
  /** the plane gene: present at the domain MAX on every arm but the control, read back THROUGH
   *  the shipped map on both teams — so every treatment arm rides the IDENTICAL plane. */
  leadGeneOnAllViewsWhereArmed: ARMS.every((a) => (armWorlds as any)[a].leadGenePresentOnAllViews
    === (GENE[a] !== null)),
  leadWeightMatchesDeclaration: ARMS.every((a) => (GENE[a] === null
    ? (armWorlds as any)[a].leadWeightReadBack === 0
    : (armWorlds as any)[a].leadWeightReadBack === GENE[a]
      && (armWorlds as any)[a].leadWeightReadBackB === GENE[a])),
  declaration: '⭐ THE DOORS DECLARATION, ASSERTED NOT STATED. `ctbSupportPlane`, `ptpPassLead` '
    + 'and `dlcDeliveryChoice` are FALSE in EVERY arm; the ONLY delivery door open anywhere is '
    + 'the banked STRIKE PLANE, and it is open IDENTICALLY (gene at the domain max) on every arm '
    + 'but the control — so the treatment arms differ from the ANCHOR by the RISK PRICE ALONE. '
    + '`dvDeliveryValue` is not a door but a PRICE on whatever the open door produced, and its '
    + 'own two-limb arming checklist (flag + non-absent genes on all three genome views of both '
    + 'teams) is asserted per arm off the REAL constructed matches.',
};
const armConfigEcho = Object.fromEntries(ARMS.map((a) => [a, {
  obmMovement: DOSE[a] !== null,
  ptpPassLead: DOOR[a] === 'ptp',
  dlcDeliveryChoice: DOOR[a] === 'dlc',
  dlcStrikePlane: DOOR[a] === 'sp',
  dvDeliveryValue: DV[a] !== null,
  declaredDoor: DOOR[a],
  geneSemanticsUnderThisDoor: DOOR[a] === 'sp'
    ? '⭐⭐ `passLeadSupport` is a PRESENCE-GATE ONLY under the plane door — the magnitude '
      + 'RETIRED at #240/#241 and was MEASURED retired at DLC-T0s (G-VALUE: 0 ≡ 0.37 ≡ 1 byte '
      + 'for byte). ⚠ 0 is NOT "off" under this door; ABSENCE is. ⭐ THE DV GENES ARE THE '
      + 'OPPOSITE: they are MAGNITUDES, and BOTH zero and absence are inert (DV-T0 G-ZERO / '
      + 'G-BORN) — which is why this stage\'s identity arm is a gene-ZERO arm.'
    : 'n/a — no delivery door open',
  ctbSupportPlane: false,
  edsPerceivedChoice: true,
  matrix: DOSE[a],
  passLeadSupportGene: GENE[a],
  dv: DV[a],
  sentence: ARM_SENTENCE[a],
}]));
/** every non-zero OBM slot must be a DOMAIN CORNER (±1); every plane gene a member of the frozen
 *  `{0, ½, 1}` set; ⭐ and every DV dose IN DOMAIN and EQUAL TO ITS FROZEN DERIVATION. */
const doseWellFormed = ARMS.filter((a) => DOSE[a] !== null).every((a) => {
  const w = DOSE[a] as number[];
  return w.length === OBM_WEIGHT_SLOTS
    && w.every((v) => v === 0 || v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX);
}) && ARMS.filter((a) => GENE[a] !== null).every((a) => {
  const v = GENE[a] as number;
  return v === PTP_GENE_MIN || v === PTP_GENE_HALF || v === PTP_GENE_MAX;
}) && ARMS.filter((a) => DV[a] !== null).every((a) => {
  const d = DV[a] as NonNullable<DvState>;
  return d.exposure >= 0 && d.exposure <= 1 && d.belief.length === 3
    && d.belief.every((v) => v >= 0 && v <= 1)
    && (Object.values(EXPOSURE_LADDER) as number[]).includes(d.exposure);
});

/* ========================================================================== */
/* §13d ⭐⭐ THE CONFIGURATION-IDENTITY PREDICATE — DERIVED HERE, AND PROVED LIVE */
/* ========================================================================== */
/**
 * ⭐⭐ THE #251.3 HIGH, DISCHARGED BY CONSTRUCTION RATHER THAN BY PROMISE.
 *
 * DV-T1 shipped a configuration-identity conjunct INHERITED from DLC-T1s — `DOOR === 'dlc'` — on
 * an exam whose anchor door is necessarily `'sp'`. It could never hold, it published `false`, and
 * the frozen doc row asserted it proved something. The lesson ruling #251.3 carries forward is
 * exact: NEVER inherit another exam's configuration predicate without re-deriving it, and A
 * PREDICATE THAT IS CONSTANT-FALSE (or constant-TRUE) BY CONSTRUCTION IS A BUG, NOT A GATE.
 *
 * So this exam writes its OWN predicate, from its OWN tables, and then PROVES IT IS LIVE:
 *
 *   (a) `configIdentityOf` is a PURE function of a configuration table — door, gene, OBM dose and
 *       DV state per arm. It is written against THIS exam's two arms and THIS exam's declared
 *       doses (the parity rung and the census belief vector), not against any other exam's.
 *   (b) it is evaluated on the REAL tables (must be TRUE), and
 *   (c) it is re-evaluated on FOUR MUTANTS — a wrong door, a wrong gene, a wrong exposure, a
 *       wrong belief — each of which must come back FALSE. A predicate that cannot be broken by
 *       breaking the configuration is not reading the configuration.
 *
 * ⚠ AND IT IS STILL NOT THE IDENTITY OF RECORD. This predicate proves this file is internally
 * what it says it is; ⭐⭐ G-REPRO-T1 — the re-walk of DV-T1's own committed battery rows on all
 * both of these arms — is what proves the configuration is DV-T1's. The predicate is the cheap
 * check; the re-walk is the expensive one that cannot be fooled. Both are published, and the gate
 * reads BOTH.
 */
interface ArmConfig {
  door: Door;
  gene: number | null;
  obm: number[] | null;
  dv: DvState;
}
type ConfigTable = Partial<Record<ArmName | 'ghost', ArmConfig>>;
const REAL_CONFIG: ConfigTable = Object.fromEntries(ARMS.map((a) => [a, {
  door: DOOR[a], gene: GENE[a], obm: DOSE[a], dv: DV[a],
}])) as ConfigTable;
const sameVector = (x: readonly number[] | null | undefined, y: readonly number[]): boolean =>
  Array.isArray(x) && x.length === y.length && x.every((v, i) => v === y[i]);
/** ⭐ THE DERIVED PREDICATE. Each conjunct names a real, separately breakable fact about one of
 *  THIS exam's TWO arms; none of them mentions a door, an arm or a dose this exam does not have.
 *  ⭐⭐ AND EVERY ONE OF THEM HAS ITS OWN MUTANT BELOW (the #252.3 LOW, discharged): DV-T1b's
 *  liveness proof broke 4 of its 7 conjuncts and left three reading the real table with nothing
 *  able to break them, which is three conjuncts of unproved liveness inside a PASS gate. Here the
 *  coverage is MACHINE-CHECKED — `everyConjunctHasAMutant` — not counted by hand. */
const configIdentityOf = (t: ConfigTable) => {
  const an = t.planeAnchor; const dv = t.dvTruthP;
  const armKeys = Object.keys(t);
  const limbs = {
    /** ⭐ EXACTLY TWO ARMS, and they are the two #253.1 names. A third arm in this table would
     *  mean the reduction did not happen. */
    exactlyTheTwoDeclaredArms: armKeys.length === 2
      && armKeys.includes('planeAnchor') && armKeys.includes('dvTruthP'),
    /** the ANCHOR: the banked STRIKE PLANE alone at the domain max, and NO risk price — which is
     *  exactly what makes it ruling #244's arm. */
    anchorIsPlaneAlone: an !== undefined && an.door === 'sp' && an.gene === PTP_GENE_MAX
      && an.obm === null,
    /** ⭐ AND THE ANCHOR CARRIES NO PRICE — its own conjunct, because "plane alone" and "unpriced"
     *  are two facts and a mutant that adds a price must break something. */
    anchorCarriesNoPrice: an !== undefined && an.dv === null,
    /** the DOSED arm: the SAME plane at the SAME gene — so the only thing that varies between it
     *  and the anchor is the price. */
    dosedRidesTheSamePlane: an !== undefined && dv !== undefined
      && dv.door === an.door && dv.gene === an.gene,
    dosedCarriesThePrice: dv !== undefined && dv.dv !== null,
    /** the BELIEF is the census vector this probe READ at exam time (never a literal). */
    beliefIsTheCensusVector: dv !== undefined && dv.dv !== null
      && sameVector(dv.dv.belief, TRUTH_BELIEF),
    /** the EXPOSURE is the PARITY rung, which G-DOSE separately proves equals its derivation. */
    exposureIsTheParityRung: dv !== undefined && dv.dv !== null
      && dv.dv.exposure === EXPOSURE_LADDER.parity,
    /** NO OBM matrix anywhere: the relational pair is DV-T1's and is not re-asked here. */
    noArmDosesTheMatrix: Object.values(t).every((c) => c !== undefined && c.obm === null),
  };
  return { limbs, pass: Object.values(limbs).every((v) => v === true) };
};
type LimbName = keyof ReturnType<typeof configIdentityOf>['limbs'];
const configIdentity = (() => {
  const real = configIdentityOf(REAL_CONFIG);
  const limbNames = Object.keys(real.limbs) as LimbName[];
  const mutate = (name: string, targets: readonly LimbName[], f: (t: ConfigTable) => void) => {
    const t = JSON.parse(JSON.stringify(REAL_CONFIG)) as ConfigTable;
    f(t);
    const r = configIdentityOf(t);
    const flipped = limbNames.filter((k) => real.limbs[k] === true && r.limbs[k] === false);
    return {
      mutant: name,
      conjunctsItExistsFor: [...targets],
      pass: r.pass,
      brokeThePredicate: r.pass === false,
      flippedConjuncts: flipped,
      brokeItsOwnTargets: targets.every((k) => flipped.includes(k)),
      limbs: r.limbs,
    };
  };
  /** ⭐⭐ ONE MUTANT PER CONJUNCT, DECLARED AGAINST THE CONJUNCT IT EXISTS FOR (#252.3). A mutant
   *  may flip more than one conjunct — breaking a door breaks two facts at once, and that is
   *  honest — but every conjunct must be the DECLARED TARGET of at least one mutant AND must
   *  actually flip under it. */
  const mutants = [
    mutate('a THIRD arm added to the configuration table', ['exactlyTheTwoDeclaredArms'], (t) => {
      (t as Record<string, ArmConfig>).ghost = { door: 'none', gene: null, obm: null, dv: null };
    }),
    mutate('anchor door flipped to the retired dial', ['anchorIsPlaneAlone'], (t) => {
      if (t.planeAnchor !== undefined) t.planeAnchor.door = 'ptp';
    }),
    mutate('anchor given the dosed arm\'s risk price', ['anchorCarriesNoPrice'], (t) => {
      if (t.planeAnchor !== undefined && t.dvTruthP !== undefined) {
        t.planeAnchor.dv = JSON.parse(JSON.stringify(t.dvTruthP.dv)) as DvState;
      }
    }),
    mutate('dosed arm\'s plane gene halved', ['dosedRidesTheSamePlane'], (t) => {
      if (t.dvTruthP !== undefined) t.dvTruthP.gene = PTP_GENE_HALF;
    }),
    mutate('dosed arm\'s risk price removed entirely', ['dosedCarriesThePrice'], (t) => {
      if (t.dvTruthP !== undefined) t.dvTruthP.dv = null;
    }),
    mutate('belief vector perturbed off the census table', ['beliefIsTheCensusVector'], (t) => {
      if (t.dvTruthP !== undefined && t.dvTruthP.dv !== null) {
        (t.dvTruthP.dv as unknown as { belief: readonly number[] }).belief =
          TRUTH_BELIEF.map((v, i) => (i === 0 ? v + 1e-6 : v));
      }
    }),
    mutate('exposure moved off the PARITY rung', ['exposureIsTheParityRung'], (t) => {
      if (t.dvTruthP !== undefined && t.dvTruthP.dv !== null) {
        (t.dvTruthP.dv as { exposure: number }).exposure = EXPOSURE_LADDER.gradient;
      }
    }),
    mutate('the dosed arm given an OBM matrix', ['noArmDosesTheMatrix'], (t) => {
      if (t.dvTruthP !== undefined) t.dvTruthP.obm = [...CHECK_AND_SHOW_MATRIX];
    }),
  ];
  const coveredConjuncts = limbNames.filter((k) => mutants
    .some((m) => (m.conjunctsItExistsFor as string[]).includes(k) && m.flippedConjuncts.includes(k)));
  const uncoveredConjuncts = limbNames.filter((k) => !coveredConjuncts.includes(k));
  const everyConjunctHasAMutant = uncoveredConjuncts.length === 0;
  return {
    pass: real.pass && mutants.every((m) => m.brokeThePredicate && m.brokeItsOwnTargets)
      && everyConjunctHasAMutant,
    realTablePasses: real.pass,
    limbs: real.limbs,
    conjuncts: limbNames,
    conjunctCount: limbNames.length,
    mutantCount: mutants.length,
    coveredConjuncts,
    uncoveredConjuncts,
    everyConjunctHasAMutant,
    livenessProof: mutants,
    livenessNote: '⭐⭐ THE PREDICATE IS PROVED LIVE CONJUNCT BY CONJUNCT (#252.3, the LOW this '
      + 'stage discharges at the source). DV-T1b\'s proof broke 4 of its 7 conjuncts and left '
      + 'three unproved inside a PASS gate. Here EVERY conjunct is the declared target of a '
      + 'mutant, every mutant must break its own target AND the whole predicate, and the COVERAGE '
      + 'is machine-checked (`everyConjunctHasAMutant`) rather than counted by a reader. A '
      + 'conjunct that cannot be broken by breaking the configuration is not reading the '
      + 'configuration.',
    ofRecordNote: '⚠ THIS IS THE CHEAP HALF. The identity OF RECORD — that this configuration is '
      + 'DV-T1\'s AND DV-T1b\'s — is ⭐⭐ G-REPRO-T1 and ⭐⭐ G-REPRO-T1B: re-walks of BOTH parents\' '
      + 'own committed battery rows on BOTH of these arms, field-exact with the whole-match '
      + 'signature. This predicate proves the file is internally what it declares; the re-walks '
      + 'prove the declaration is the parents\'.',
  };
})();

/* ⭐ THE TREATMENT IS NOT A NULL BY CONSTRUCTION: the anchor and the dosed arm must actually
 * DIVERGE somewhere. DV-T1 banked the opposite receipt (its gene-ZERO arm was byte-identical to
 * the anchor on 283/283 seeds); the live half of that fact is that a NON-zero dose must NOT be.
 * Published per seed, and the gate requires at least one divergent seed — a "treatment" that
 * changed no byte anywhere would make every CI below a measurement of nothing. */
const divergenceRows = coreA.byArm[ANCHOR_ARM].map((r, i) => {
  const d = coreA.byArm[PRIMARY_ARM][i];
  return {
    seed: r.seed,
    signatureIdentical: r.signature === d.signature,
    goalsAnchor: r.goals,
    goalsDosed: d.goals,
  };
});
const divergentSeeds = divergenceRows.filter((x) => !x.signatureIdentical).length;

/** ⭐⭐ THE TWO DELTA TABLES MUST COINCIDE, AND THAT IS ASSERTED RATHER THAN ASSUMED. With no
 *  control arm the base of every paired delta IS the anchor, so `contrasts.rates[k][a].pairedDelta`
 *  and `contrasts.ratesVsAnchor[k][a].pairedDelta` are the SAME quantity computed twice, off the
 *  same resampled index sets. Publishing two tables that had silently drifted apart would be
 *  exactly the "the copy the reader sees is the wrong one" failure, so the equality is a PASS
 *  condition rather than a remark. */
const baseAnchorAgreement = (() => {
  const va = (bodyA.contrasts as any).ratesVsAnchor as Record<string, Record<ArmName, any>>;
  const rows: { key: string; arm: ArmName; agrees: boolean }[] = [];
  for (const k of RATE_KEYS) {
    for (const a of ARMS) {
      rows.push({
        key: k,
        arm: a,
        agrees: JSON.stringify(C[k][a].pairedDelta) === JSON.stringify(va[k][a].pairedDelta)
          && C[k][a].resolved === va[k][a].resolved,
      });
    }
  }
  const disagreements = rows.filter((r) => !r.agrees);
  return {
    baseArm: BASE_ARM,
    anchorArm: ANCHOR_ARM,
    cellsCompared: rows.length,
    disagreements,
    agree: disagreements.length === 0,
    note: '⭐ `BASE_ARM === ANCHOR_ARM` because #253.1 runs no control arm, so the '
      + 'control-referenced and the anchor-referenced delta tables are ONE quantity published '
      + 'twice. Every cell of both is compared here.',
  };
})();

const flagHygiene = {
  pass: configIdentity.pass
    && divergentSeeds > 0
    && baseAnchorAgreement.agree
    /** ⭐ THERE IS NO CONTROL ARM (#253.1): the base of every delta IS the anchor, there are
     *  EXACTLY TWO arms, and BOTH open the banked plane door at the domain max. */
    && BASE_ARM === ANCHOR_ARM
    && ARMS.length === 2
    && ARMS.every((a) => DOOR[a] === 'sp' && GENE[a] === PTP_GENE_MAX)
    /** ⭐ THE ANCHOR carries the plane and NO risk price — that is what makes it #244's arm. */
    && DV[ANCHOR_ARM] === null && DOSE[ANCHOR_ARM] === null
    /** ⭐ EXACTLY ONE dosed arm, at exactly the PARITY rung, carrying exactly the census vector. */
    && ARMS.filter((a) => DV[a] !== null).length === 1
    && LADDER_ARMS.length === 1 && LADDER_ARMS[0] === PRIMARY_ARM
    && DV[PRIMARY_ARM] !== null
    && (DV[PRIMARY_ARM] as NonNullable<DvState>).exposure === EXPOSURE_LADDER.parity
    && JSON.stringify((DV[PRIMARY_ARM] as NonNullable<DvState>).belief)
      === JSON.stringify(TRUTH_BELIEF)
    /** no arm doses the OBM matrix here (the relational pair is DV-T1's, and banked). */
    && ARMS.every((a) => DOSE[a] === null)
    && doseWellFormed
    && twoDoors.ctbSupportPlaneFalseInEveryArm && twoDoors.perceptArmedInEveryArm
    && twoDoors.obmFlagMatchesMatrix && twoDoors.matrixOnAllViewsWhereArmed
    && twoDoors.ptpFlagMatchesDoor && twoDoors.dlcFlagMatchesDoor && twoDoors.spFlagMatchesDoor
    && twoDoors.dialNeverArmed && twoDoors.contestNeverArmed
    && twoDoors.neverBothDeliveryDoors
    && twoDoors.dvFlagMatchesDeclaration && twoDoors.dvGenesMatchDeclaration
    && twoDoors.dvBeliefReadBackMatches && twoDoors.truthArmsCarryTheCensusVector
    && twoDoors.leadGeneOnAllViewsWhereArmed
    && twoDoors.leadWeightMatchesDeclaration,
  configIdentity,
  baseAnchorAgreement,
  doseWellFormed,
  geneDomain: { min: PTP_GENE_MIN, half: PTP_GENE_HALF, max: PTP_GENE_MAX },
  twoDoors,
  armWorlds,
  armConfigEcho,
  divergence: {
    pair: `${PRIMARY_ARM} vs ${ANCHOR_ARM}`,
    seeds: divergenceRows.length,
    divergentSeeds,
    identicalSeeds: divergenceRows.length - divergentSeeds,
    rows: divergenceRows,
    note: '⭐ THE DOSE IS DELIVERED, PER SEED. DV-T1 proved the ZERO dose changes nothing '
      + '(`dvInert` ≡ `planeAnchor`, 283/283 byte-identical); the live half of that fact — and '
      + 'the one this extension needs — is that the PARITY dose DOES change the world. A '
      + '"treatment" that left every signature untouched would make every CI here a measurement '
      + 'of nothing, so at least one divergent seed is a PASS condition rather than a note.',
  },
  note: '⭐⭐ THE TWO ARMS DIFFER BY EXACTLY THE RISK PRICE. Both open the SAME banked '
    + 'strike-plane door at the SAME gene value, and `dvDeliveryValue` plus the two DV genes are '
    + 'the only things that move between them — which is what makes the paired delta this stage is '
    + 'sized on a reading of the PRICE and of nothing else. The configuration-identity predicate '
    + 'is DERIVED HERE (never inherited) and PROVED LIVE with a mutant for EVERY conjunct '
    + '(#252.3); the identity with the parents is G-REPRO-T1\'s and G-REPRO-T1B\'s re-walks.',
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
  const passes = sum((r) => r.passesChosen);
  const ledNonZero = sum((r) => r.ptpLedNonZero);
  return [a, {
    armed,
    door: DOOR[a],
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
    /** ⭐ THE PLANE'S OWN LAW CHECK (observational read): every struck displacement must be a
     *  MEMBER of its own grid, by IEEE identity. */
    planeChecked: dose.planeChecked,
    planeUnmatched: dose.planeUnmatched,
    planeMemberWins: dose.planeMemberWins,
    /** ⭐⭐ THE TREATMENT AS REALLY DELIVERED (#242.2), at BATTERY GRAIN and with zero percept
     *  pulls: the share of chosen passes that carried the chooser's OWN displacement. */
    deliveredRateStrikeTime: round(ledNonZero / Math.max(1, passes), 5),
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
    /* ⭐ THE LAW, ON THE PASSES ACTUALLY CHOSEN (the observational read) — READ THROUGH THIS
     * ARM'S OWN DOOR. A STRIKE-PLANE arm's law is MEMBERSHIP (every struck displacement is a
     * member of its own K = 9 grid, IEEE-exact, `planeUnmatched === 0`, and the check must
     * actually have been reached); the banked CONTEST anchor's law is the projection ALGEBRA
     * (zero sign and zero magnitude violations). Neither is asserted of the other. */
    if (g.door === 'sp') {
      if (g.planeChecked <= 0 || g.planeUnmatched !== 0) return false;
    } else if (g.leadSignViolations !== 0 || g.leadMagnitudeViolations !== 0) return false;
    // DOSED ⇒ a real lead is delivered; INERT (gene 0) ⇒ exactly zero metres, exactly zero passes.
    if (g.leadDosed) {
      if (!(g.ledPassesNonZero > 0) || !(g.leadMetresSum > 0)) return false;
    } else if (g.ledPassesNonZero !== 0 || g.leadMetresSum !== 0) return false;
  } else if (g.leadGeneOnAllViewsSeeds !== 0 || g.ledPassesHandled !== 0
    || g.ledPassesNonZero !== 0 || g.leadMetresSum !== 0 || g.leadChecked !== 0
    || g.planeChecked !== 0) return false;
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
        /* ⚠ THE PLANE-ERA CLASSES — this stage's Deviation 1, the same #228.5(b) form DLC-T1
         * itself used for the contest-era lines. DLC-T1 froze this classifier BEFORE the STRIKE
         * PLANE was banked (#242), so the plane's own lines carry PTP tokens with no name in it:
         * its TWO grid captures, its PRECEDENCE GUARD (which names `ptpSeat` precisely so the
         * banked fork line is never edited) and the seat module's body. INSTRUMENT-SIDE ONLY —
         * same token set, and every frozen count below asserted UNCHANGED. */
        /* ⚠ THE DV-ERA CLASS — THIS stage's declared completion, the SAME #228.5(b) form
         * DLC-T1 used for the contest-era lines and DLC-T1s for the plane-era ones. Both froze
         * this classifier BEFORE the RISK PRICER was banked (#250), so the ONE risk-price line
         * in the hoisted pricer carries a PTP token (`team.localX(aim.x)`) with no name in it.
         * INSTRUMENT-SIDE ONLY — the token set is untouched, every FROZEN COUNT below is
         * asserted UNCHANGED (the three AIM_APPLY sites stay three), and not one `src/**` byte
         * moves (X-SRC-UNTOUCHED is a separate HARD gate). */
        : /deliveryRiskPrice\(dvSeat, p\.pos, aim, opp\.players, team\.localX\(aim\.x\), W\.passBase\)/
          .test(t) ? 'DV_RISK_PRICE'
        : f.endsWith('deliveryValueSeat.ts') && !/^import |^\} from /.test(t) ? 'DV_SEAT_BODY'
        : /^bestLead[XY] = strike\.strike\.[xy];$/.test(t) ? 'SP_GRID_CAPTURE'
        : /^if \(spSeat !== null && dlcSeat === null && ptpSeat === null\) \{$/.test(t)
          ? 'SP_PRECEDENCE_GUARD'
        : f.endsWith('strikePlaneSeat.ts') && !/^import |^\} from /.test(t) ? 'SP_SEAT_BODY'
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
    /** ⭐ THE DV-ERA PIN: exactly ONE risk-price call site in the whole tree (DV-T0's G-FORK
     *  claim, re-measured at exam time by this stage's own classifier). */
    && ptpKindCount('DV_RISK_PRICE') === 1
    && ptpForkSites.some((s) => s.kind === 'FLAG_FORK' && s.file.endsWith('PlayerBrain.ts')),
  contestEraClasses: ['DLC_LED_CAPTURE', 'DLC_SEAT_BODY'],
  dvEraClasses: ['DV_RISK_PRICE', 'DV_SEAT_BODY'],
  dvEraNote: '⚠ DECLARED COMPLETION, THIS STAGE (the #228.5(b) form applied a THIRD time). '
    + 'DLC-T1 froze this classifier before the CONTEST was banked, DLC-T1s completed it for the '
    + 'PLANE, and both predate the RISK PRICER (#250) — whose ONE call site inside the hoisted '
    + 'pricer carries the PTP token `team.localX(aim.x)`. STRICTLY ADDITIVE: two new classes, '
    + 'the SAME token set, every frozen count asserted UNCHANGED (AIM_APPLY stays at exactly '
    + 'THREE — the incumbent lane, open and gain reads), and no `src/**` byte moves. ⭐ It also '
    + 'PINS the risk-price call site at exactly ONE, which is DV-T0\'s own G-FORK claim '
    + 're-measured at exam time.',
  dvRiskPriceSites: ptpKindCount('DV_RISK_PRICE'),
  planeEraClasses: ['SP_GRID_CAPTURE', 'SP_PRECEDENCE_GUARD', 'SP_SEAT_BODY'],
  planeEraNote: '⚠ DECLARED COMPLETION, THIS STAGE (Deviation 1, the #228.5(b) form applied a '
    + 'second time). DLC-T1 froze this classifier BEFORE the STRIKE PLANE was banked (#242), so '
    + 'the plane\'s `src/**` lines that carry PTP tokens had no name in it — its TWO grid '
    + 'captures, its ONE PRECEDENCE GUARD (which names `ptpSeat` exactly so the pinned '
    + '`match.ptpPassLead` fork line is never edited) and the seat module\'s body. STRICTLY '
    + 'ADDITIVE: three new classes, the SAME token set, every frozen count asserted UNCHANGED, '
    + 'and no `src/**` byte moves (X-SRC-UNTOUCHED is a separate HARD gate).',
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
 * ⭐ FROZEN EX ANTE (contract §3, VERBATIM), computed here and ADJUDICATED NOWHERE. See the
 * JOINT's own docblock below `anchorDeltaOf` for the exact operational predicate, its two limbs,
 * the per-dose granularity and the pre-named F-DV-a/b/c forks.
 *
 * ⚠ THE BAND LIMB'S GRAIN, INHERITED VERBATIM AND STATED HERE RATHER THAN DISCOVERED LATER: the
 * equilibrium band GATES AT BATTERY N ONLY (§GUARDS, the PTP-T1/#198 form), and a dimension the
 * ABSENT arm itself fails is EXCLUDED and DISCLOSED. At smoke grain the goals row is therefore a
 * PLUMBING READING, computed and published so the predicate cannot be re-cut after sight.
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
    /** ⚠ THIS STAGE HAS NO CONTROL ARM: the row is DV-T1b's FROZEN absent-arm reading, read from
     *  its committed artifact, and it is named for what it is rather than quietly re-pointed at
     *  the anchor (which would turn "the bare world is in band" into "the plane arm is in band" —
     *  a different sentence wearing the same key). */
    controlInBandFrozenAtT1b: frozenBases.bandAbsentInBand === null ? null
      : frozenBases.bandAbsentInBand.goals,
    controlInBandFrozenSource: `${DVT1B_PATH} → arms.absent.guards.band.goals.inBand `
      + '(DV-T1b\'s own ABSENT arm at 643 clusters)',
    /** ⚠ MODE-CONDITIONED (#251.3(ii)): a battery artifact must not carry smoke-grain caveats,
     *  and a smoke artifact must not claim battery grain. */
    gatingGrain: MODE === 'full'
      ? `the band GATES at battery N only (inherited verbatim) — and THIS IS THE BATTERY (N* = ${RUN_N} clusters), so this row gates`
      : 'the band GATES at battery N only (inherited verbatim); at SMOKE grain this row is a plumbing reading and gates nothing',
  };
};
const bandDistanceOf = (a: ArmName): number => {
  const b = goalsBandOf(a);
  if (b.inBand) return 0;
  const g = b.goalsPerMatch;
  return round(g < b.bandLo ? b.bandLo - g : g - b.bandHi, 6);
};
const anchorDeltaOf = (a: ArmName, key: RateKey) => {
  const cell = (bodyA.contrasts as any).ratesVsAnchor[key][a] as {
    pairedDelta: { point: number; lower: number; upper: number } | null; resolved: boolean;
  };
  return cell;
};
/**
 * ⭐ THE SUPPLY LIMB, REPUBLISHED FOR CONTINUITY AND GATING NOTHING (#253.1).
 *
 * Ruling #252 CLOSED the supply question at exam grain: F-DV-b is closed permanently and limb A
 * resolved HELPFUL at `dvTruthP` on DV-T1b's 643 virgin seeds. #253.1 therefore writes this
 * stage's letter on the GOALS delta alone and says of the supply column, verbatim, "supply vs
 * anchor is republished for continuity … its resolution is NOT this exam's question". So the row
 * below is a ROW: it carries its CI and its mechanical `resolved` flag, no gate and no route
 * reads it, and it is referenced to the ANCHOR because that is the only reference a two-arm exam
 * has. ⚠ It is NOT comparable to DV-T1b's +0.001146 vs CONTROL — that number contained the
 * plane's own contribution; this one is the price's marginal move on top of the plane, i.e.
 * DV-T1b's +0.000408 [-0.00041, 0.001224] column, which is the one it should be read against.
 */
const supplyVsAnchorOf = (a: ArmName) => {
  const cell = C.trueHoldableShare[a];
  const d = cell.pairedDelta as { point: number; lower: number; upper: number } | null;
  return {
    point: cell.point as number,
    deltaVsAnchor: d === null ? null : d.point,
    ci: d === null ? null : [d.lower, d.upper],
    resolved: cell.resolved as boolean,
    resolvedHelpfulVsAnchor: d !== null && d.lower > 0,
    resolvedKilledVsAnchor: d !== null && d.upper < 0,
    pointDirectionHelpful: d !== null && d.point > 0,
    status: '⭐ CONTINUITY ROW, NON-GATING (#253.1). #252 closed the supply half at exam grain; '
      + 'this stage does not re-open it and no route reads this cell.',
    comparableColumnAtT1b: 'DV-T1b\'s `dvTruthP` vs ANCHOR supply delta (+0.000408 '
      + '[-0.00041, 0.001224]) — NOT its vs-CONTROL delta (+0.001146), which carries the plane.',
  };
};

/**
 * ⭐⭐ THE FROZEN LETTER (ruling #253.1), PRE-REGISTERED AND MECHANICALLY PRINTED.
 *
 *   "Frozen letter = goals Δ dvTruthP vs anchor (supply republished for continuity)."
 *
 * Operationally, and frozen HERE before any receipt ran: the `goalsPerMatch` PAIRED CLUSTER
 * BOOTSTRAP delta of `dvTruthP` against `planeAnchor` (#20: cluster = match seed), read against
 * the frozen equilibrium band re-derived exactly as DV-T1 and DV-T1b derived it (baseline 2.3944,
 * tolerance ±15 % ⇒ [2.0352, 2.7536]), with `inBand` printed beside it.
 *
 * ⭐⭐ AND THE THREE ROUTES, PRE-NAMED BY #253.1 AND PRINTED MECHANICALLY:
 *   RESOLVED-RECOVER — the delta is RESOLVED toward the band.
 *   RESOLVED-NULL    — the delta's CI is clear of zero on the WRONG side (away from the band), or
 *                      clear of the POOLED POINT'S SIGN.
 *   UNRESOLVED       — neither, at N*.
 *
 * ⚠ THE CONSEQUENTS BELOW ARE #253.1's OWN WORDS, CARRIED VERBATIM AND NOTHING ELSE (#252.3). The
 * lesson that correction carries is exact: #251.2's HELPFUL consequent said "the #244 inversion is
 * COMPLETE at exam grain" while the goals limb was unreplicated — a consequent that silently
 * EMBEDS another limb is a defect. Where #253.1's own wording names the other limb it does so
 * EXPLICITLY and conditionally ("with #252.2's supply half"), and that clause is reproduced as the
 * ruling wrote it rather than paraphrased, extended or trimmed.
 *
 * ⚠ THE PROBE PRINTS THE ROUTE AND RESOLVES NOTHING (#203). The third route in particular is a
 * COMMANDER'S HONESTY RULING, not a probe output.
 */
const goalsLetterAt = (a: ArmName) => {
  const band = goalsBandOf(a);
  const anchorBand = goalsBandOf(ANCHOR_ARM);
  const goalsVsAnchor = a === ANCHOR_ARM ? null : anchorDeltaOf(a, 'goalsPerMatch');
  const dArm = bandDistanceOf(a);
  const dAnchor = bandDistanceOf(ANCHOR_ARM);
  const anchorBelowBand = !anchorBand.inBand && anchorBand.goalsPerMatch < anchorBand.bandLo;
  const pd = goalsVsAnchor === null ? null : goalsVsAnchor.pairedDelta;
  /** the direction of the band FROM THE ANCHOR: below ⇒ goals must RISE, above ⇒ FALL. */
  const towardBandResolved = pd !== null && (anchorBelowBand ? pd.lower > 0 : pd.upper < 0);
  const awayFromBandResolved = pd !== null && (anchorBelowBand ? pd.upper < 0 : pd.lower > 0);
  /** the POOLED point's sign, from the ex-ante rule (a published number, not a re-derivation). */
  const pooledPoint = (poolingRule as any).pooledPoint ?? null;
  const pooledSign = pooledPoint === null ? 0 : Math.sign(pooledPoint as number);
  const clearOfPooledSign = pd !== null && pooledSign !== 0
    && (pooledSign > 0 ? pd.upper < 0 : pd.lower > 0);
  return {
    arm: a,
    goalsPerMatch: band.goalsPerMatch,
    band: [band.bandLo, band.bandHi],
    inBand: band.inBand,
    controlInBandFrozenAtT1b: band.controlInBandFrozenAtT1b,
    anchorGoalsPerMatch: anchorBand.goalsPerMatch,
    anchorBelowBand,
    bandDistance: dArm,
    bandDistanceAnchor: dAnchor,
    bandDistanceFell: dArm < dAnchor,
    goalsVsAnchor: pd,
    towardBandResolved,
    awayFromBandResolved,
    pooledPoint,
    clearOfPooledSign,
    gatingGrain: band.gatingGrain,
  };
};
const goalsRouteOf = (a: ArmName) => {
  const g = goalsLetterAt(a);
  const recover = g.towardBandResolved;
  const nullRoute = !recover && (g.awayFromBandResolved || g.clearOfPooledSign);
  return {
    ...g,
    route: recover ? 'RESOLVED-RECOVER' : nullRoute ? 'RESOLVED-NULL' : 'UNRESOLVED',
  };
};
/** ⭐ the JOINT is DV-T1's shape, kept so the contract's two limbs stay visible together — but at
 *  THIS stage limb A is the CONTINUITY row and only limb B is the letter. Published, never gated. */
const jointAt = (a: ArmName) => {
  const supply = supplyVsAnchorOf(a);
  const g = goalsLetterAt(a);
  const limbAContinuityOnly = a === ANCHOR_ARM ? null : supply.resolvedHelpfulVsAnchor;
  const limbB = g.inBand || (g.bandDistanceFell && g.towardBandResolved);
  return {
    arm: a,
    eligibleForTheArcJoint: (LADDER_ARMS as readonly string[]).includes(a),
    supplyLimbContinuityOnly: { ...supply, limbAvsAnchorContinuityOnly: limbAContinuityOnly },
    goalsBandLimb: { ...g, limbB },
    limbBIsTheFrozenLetter: true,
    note: '⭐ #253.1 writes this stage\'s letter on limb B ALONE. Limb A is republished as a '
      + 'continuity row against the anchor and is NOT this exam\'s question (#252 closed it).',
  };
};

const preRegisteredPrimary = {
  frozenText: '⭐⭐ THE FROZEN LETTER (ruling #253.1, VERBATIM): "Frozen letter = goals Δ dvTruthP '
    + 'vs anchor (supply republished for continuity)." Operationally: the `goalsPerMatch` PAIRED '
    + 'CLUSTER BOOTSTRAP delta of dvTruthP against planeAnchor, resolved TOWARD the frozen band '
    + '(band re-derived here as DV-T1 and DV-T1b derived it: 2.3944 ± 15 %), with `inBand` printed '
    + 'too. Frozen in this probe\'s own predicates before any receipt ran; computed at the dosed '
    + 'arm; adjudicated nowhere.',
  successRule: '⭐ THE LETTER IS ONE LIMB AT THIS STAGE. LIMB B = the anchor-referenced paired '
    + 'delta on `goalsPerMatch` RESOLVED in the band\'s direction, OR the `goals` band dimension '
    + 'INSIDE the frozen band. LIMB A (supply) is REPUBLISHED FOR CONTINUITY against the anchor '
    + 'and gates nothing — ruling #252 closed the supply half at exam grain and #253.1 says its '
    + 'resolution is not this exam\'s question.',
  primaryCell: PRIMARY_ARM,
  primaryCellWhy: '⭐ THE PRIMARY CELL IS `dvTruthP` — the PARITY rung, the cell BOTH parents read '
    + 'their goals delta at. Every seed this stage owns goes into resolving THAT delta against '
    + 'THAT anchor.',
  primaryAtCell: jointAt(PRIMARY_ARM),
  ladderArms: LADDER_ARMS,
  allArms: Object.fromEntries(ARMS.map((a) => [a, jointAt(a)])),
  contrastAnchor: {
    arm: ANCHOR_ARM,
    what: '⭐⭐ RULING #244\'s OWN ARM, and the BASE of every paired delta in this artifact. The '
      + 'goals sentence has always been a dvTruthP-versus-anchor sentence; with no control arm it '
      + 'is now the ONLY reference, which is why the anchor\'s own goals level is published beside '
      + 'every row.',
    reading: jointAt(ANCHOR_ARM),
  },
  /** ⭐⭐ THE LETTER ITSELF — the goals limb, printed as the ruling words it. */
  frozenLetter: {
    limbB: {
      ...goalsLetterAt(PRIMARY_ARM),
      bandProvenance: 'RE-DERIVED HERE EXACTLY AS DV-T1 AND DV-T1b DERIVED IT: baseline '
        + `${BAND_BASELINE.goals} × (1 ± ${BAND_TOLERANCE.goals}) — the A4-S2P3 §4.2 equilibrium `
        + 'band, inherited verbatim, with the #198-form exclusion set FROZEN at DV-T1b\'s (a '
        + 'dimension the bare world itself fails is excluded AND disclosed; this exam has no bare '
        + 'arm, so the set is read from the parent rather than re-cut).',
      limbB: jointAt(PRIMARY_ARM).goalsBandLimb.limbB,
      priorReadings: {
        dvT1: '+0.243816 [0.045936, 0.420495] at 283 clusters — RESOLVED toward the band (#251.1)',
        dvT1b: '+0.040435 [-0.083981, 0.167963] at 643 clusters — NOT resolved (#252.2)',
        pooled: (poolingRule as any).pooledPoint ?? null,
        pooledCi: (poolingRule as any).pooledCi ?? null,
        note: '⭐ the two priors are the EX-ANTE SIZING INPUTS, read from the committed artifacts '
          + 'before this battery ran. They are context for the row above, not a claim about it: '
          + 'this battery is a THIRD, independent measurement on virgin seeds.',
      },
    },
    limbAContinuity: {
      arm: PRIMARY_ARM,
      ...supplyVsAnchorOf(PRIMARY_ARM),
    },
  },
  /** ⭐⭐ THE THREE ROUTES OF #253.1, PRINTED MECHANICALLY AND RESOLVED NOWHERE. */
  routes: (() => {
    const r = goalsRouteOf(PRIMARY_ARM);
    return {
      definitions: {
        'RESOLVED-RECOVER': 'the goals half stands on its own properly-powered exam (with '
          + '#252.2\'s supply half, the #244 inversion then stands whole, each limb on a powered '
          + 'virgin battery)',
        'RESOLVED-NULL': 'T1\'s +0.2438 was a first-resolution overshoot; the goals question '
          + 'closes honest-negative at these doses',
        UNRESOLVED: 'a commander\'s honesty ruling',
      },
      consequentProvenance: '⭐⭐ THE CONSEQUENTS ABOVE ARE RULING #253.1\'s OWN WORDS, CARRIED '
        + 'VERBATIM (#252.3). Nothing is added: where #253.1 names the OTHER limb it does so '
        + 'explicitly and conditionally ("with #252.2\'s supply half"), and that clause is '
        + 'reproduced as written rather than paraphrased, widened or trimmed. #251.2\'s HELPFUL '
        + 'consequent embedded an unreplicated limb silently; this one embeds nothing silently.',
      predicates: {
        'RESOLVED-RECOVER': 'the goals Δ vs the anchor is RESOLVED toward the band '
          + '(anchor below band ⇒ CI lower > 0; anchor above band ⇒ CI upper < 0)',
        'RESOLVED-NULL': 'not RECOVER, and the CI is clear of zero on the WRONG side (away from '
          + 'the band) OR clear of the POOLED POINT\'S SIGN',
        UNRESOLVED: 'neither, at this stage\'s N*',
      },
      readAt: PRIMARY_ARM,
      selected: r.route,
      recover: r.route === 'RESOLVED-RECOVER',
      resolvedNull: r.route === 'RESOLVED-NULL',
      unresolved: r.route === 'UNRESOLVED',
      towardBandResolved: r.towardBandResolved,
      awayFromBandResolved: r.awayFromBandResolved,
      clearOfPooledSign: r.clearOfPooledSign,
      pooledPoint: r.pooledPoint,
      mdeBoughtAtThisN: (poolingRule as any).mdeBoughtAtNStar ?? null,
      grain: MODE === 'full'
        ? `BATTERY grain: ${RUN_N} clusters, the N sized ex ante for exactly this reading`
        : 'SMOKE grain: this route selection is PLUMBING and selects nothing — the stage\'s whole '
          + 'purpose is a battery-N reading, and at smoke N no CI here could resolve the pooled '
          + 'point even in principle',
      status: '⚠ PRINTED, NEVER RESOLVED (#203). The route is a mechanical function of published '
        + 'CI flags; which route the programme TAKES — and in particular whether the third route '
        + 'is declared as an honest limit of this world\'s grain — is the commander\'s alone.',
    };
  })(),
  failBranches: '⭐ PRE-NAMED (contract §3, carried unchanged): F-DV-a — the map fix does NOT move '
    + 'the deflation. F-DV-b — it KILLS the supply gain; ⚠ CLOSED PERMANENTLY at #252.1 (letter '
    + 'satisfied at the DV arm; mechanism refuted on two independent batteries), and this stage '
    + 'does not re-open it. F-DV-c — a guard STOPs. ⚠ THIS PROBE FIRES NONE OF THEM (#203), and '
    + '⭐ a fired fork is still a commit.',
  secondaryReported: '⭐ REPUBLISHED AT BATTERY GRAIN (ruling #253.1\'s order): the DELIVERED RATE '
    + 'per arm; the H-250a flip-vs-suppress counterfactual AT THE PARITY DOSE with its null-arm '
    + 'validity check; the frozen guards at DV-T1b\'s tolerances; the offside/restart flags in the '
    + '#157 form; and SUPPLY vs the anchor as a continuity row. No gate and no route reads any of '
    + 'them.',
  status: MODE === 'full'
    ? '⚠ MECHANICAL PREDICATE FLAGS ON PUBLISHED CIs AND ON THE FROZEN BAND, exactly like '
      + `\`resolved\` (#203). THIS IS THE BATTERY (N* = ${RUN_N} clusters, seeds `
      + `${RUN_BASE}..${RUN_BASE + RUN_N - 1}): these rows ARE the adjudicating evidence and the `
      + 'band gates here. THE PROBE STILL ADJUDICATES NOTHING — the three #253.1 routes are the '
      + 'commander\'s.'
    : '⚠ MECHANICAL PREDICATE FLAGS (#203) AT SMOKE GRAIN: none of these rows is evidence, the '
      + 'band gates at battery N only, and the printed route selects nothing. The three #253.1 '
      + 'routes are the commander\'s.',
};

/* --- ⭐⭐ THE THIRD TOKEN FAMILY: THE CONTEST's OWN READ-FORK INVENTORY (DLC-T0's, lifted) -- */
/** The seam this stage doses is the PLANE (G-FORK-TOKENS-SP); the CONTEST is its CONTRAST
 *  ANCHOR's seam, so ITS inventory is re-run here too:
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
/** the two STRIKE-PLANE lines that carry CONTEST tokens on this tree (declared, additive). */
const SP_PLANE_CALL_IN_DLC = 'const planeCand = groundCandidate(mate, strike.aim, d);';
const SP_PLANE_GUARD_IN_DLC = 'if (spSeat !== null && dlcSeat === null && ptpSeat === null) {';
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
                                    /* ⭐⭐ THE PLANE-ERA CLASSES (this stage's Deviation 1, the
                                     * #228.5(b) form): the plane calls the SAME ONE hoisted
                                     * pricer — a THIRD call site, which gets its OWN class so
                                     * the banked contest's frozen TWO stays exactly two — and
                                     * its PRECEDENCE GUARD names `dlcSeat` precisely so the
                                     * pinned `match.dlcDeliveryChoice` fork line is never
                                     * edited. Instrument-side only; no src byte moves. */
                                    : t === SP_PLANE_CALL_IN_DLC ? 'SP_CAND_SCORE'
                                      : t === SP_PLANE_GUARD_IN_DLC ? 'SP_PRECEDENCE_GUARD'
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
  planeEraClasses: ['SP_CAND_SCORE', 'SP_PRECEDENCE_GUARD'],
  planeEraNote: '⚠ DECLARED COMPLETION, THIS STAGE (Deviation 1): the STRIKE PLANE calls the '
    + 'SAME ONE hoisted `groundCandidate` declaration, so on this tree there is a THIRD call '
    + 'site. It gets its OWN class — the banked contest\'s frozen count of exactly TWO '
    + 'candidate scorings (feet, led) is asserted UNCHANGED beside it, and the plane\'s call is '
    + 'counted at exactly ONE. Instrument-side only; no src byte moves.',
  pass: dlcKindCount('FLAG_FORK') === 1
    && dlcForkSites.some((s) => s.kind === 'FLAG_FORK' && s.file.endsWith('PlayerBrain.ts'))
    && dlcKindCount('CAND_DECL') === 1 && dlcKindCount('CAND_SCORE') === 2
    && dlcKindCount('SP_CAND_SCORE') === 1 && dlcKindCount('SP_PRECEDENCE_GUARD') === 1
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

/* --- ⭐⭐ THE FOURTH TOKEN FAMILY: THE STRIKE PLANE's OWN READ-FORK INVENTORY (T0s's, lifted) */
/** The seam this stage DOSES is the plane, so DLC-T0s's inventory is RE-RUN here at T1s (the
 *  #236 amendment-2 discipline: an inherited receipt never exempts a re-run). Exactly ONE
 *  `match.dlcStrikePlane` fork in `src/**`, ONE grid formation, ONE candidate-scoring call, ONE
 *  capture pair, ⭐⭐ ONE PRECEDENCE GUARD naming NO flag (the seat-guard form that keeps both
 *  banked G-FORK pins verbatim), and ⭐ THREE `match.performPass(` statements in the brain —
 *  i.e. ZERO added by the plane, its winner riding the BANKED led-strike statement. */
const SP_FORK_LINE = 'const spSeat = match.dlcStrikePlane ? strikePlaneSeatOf(p, match, g, match.edsPerceivedChoice) : null;';
const SP_PLANE_CALL = 'const planeCand = groundCandidate(mate, strike.aim, d);';
const SP_PLANE_GUARD = 'if (spSeat !== null && dlcSeat === null && ptpSeat === null) {';
/** ⭐ DLC-T0s's OWN token set, VERBATIM (its G-FORK line) — narrowing it would silently
 *  un-count the very sites this gate exists to pin. */
const SP_TOKENS = /dlcStrikePlane|spSeat|strikePlaneSeat|groundStrikeGrid|strikeReach|planeCand|STRIKE_PLANE|strike\.strike/;
const spForkSites = (() => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcTsFiles('src')) {
    readFileSync(f, 'utf8').split('\n').forEach((raw, i) => {
      const t = raw.trim();
      if (!SP_TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = t === SP_FORK_LINE ? 'FLAG_FORK'
        : t === SP_PLANE_CALL ? 'CAND_SCORE'
          : /^for \(const strike of groundStrikeGrid\(spSeat, p\.pos, mate\)\) \{$/.test(t)
            ? 'GRID_FORM'
            : /^bestLead[XY] = strike\.strike\.[xy];$/.test(t) ? 'GRID_CAPTURE'
              : t === SP_PLANE_GUARD ? 'PLANE_GUARD'
                : /^if \(planeCand\.s > bestPass\) \{$/.test(t) ? 'PLANE_ARGMAX'
                  : /^(bestPass|bestMate|bestLane|bestOpen) = (planeCand|mate)/.test(t)
                    ? 'PLANE_ARGMAX'
                    : /^readonly dlcStrikePlane: boolean;$/.test(t) ? 'FIELD'
                      : /^dlcStrikePlane\?: boolean;$/.test(t) ? 'CONFIG'
                        : /this\.dlcStrikePlane = cfg\.dlcStrikePlane \?\? false;/.test(t)
                          ? 'INIT'
                          : /'dlcStrikePlane'/.test(t) ? 'UNION_KEY'
                            : /^import |^\} from |from '\.\/strikePlaneSeat'/.test(t) ? 'IMPORT'
                              : f.endsWith('strikePlaneSeat.ts') ? 'SEAT_BODY'
                                : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  return sites;
})();
const spKindCount = (k: string): number => spForkSites.filter((s) => s.kind === k).length;
const spStrikeStatements =
  (readFileSync(BRAIN_SRC, 'utf8').match(/match\.performPass\(/g) ?? []).length;
const gForkTokensSp = {
  tokenSet: SP_TOKENS.source,
  occurrences: spForkSites.length,
  byKind: Object.fromEntries([...new Set(spForkSites.map((s) => s.kind))].sort()
    .map((k) => [k, spKindCount(k)])),
  sites: spForkSites,
  unclassified: spForkSites.filter((s) => s.kind === 'OTHER'),
  strikeStatementsInBrain: spStrikeStatements,
  forkLineVerbatim: readFileSync(BRAIN_SRC, 'utf8').includes(SP_FORK_LINE),
  pass: spKindCount('FLAG_FORK') === 1
    && spForkSites.some((s) => s.kind === 'FLAG_FORK' && s.file.endsWith('PlayerBrain.ts'))
    && spKindCount('GRID_FORM') === 1 && spKindCount('CAND_SCORE') === 1
    && spForkSites.some((s) => s.kind === 'CAND_SCORE' && s.file.endsWith('PlayerBrain.ts'))
    && spKindCount('GRID_CAPTURE') === 2 && spKindCount('PLANE_GUARD') === 1
    && spKindCount('OTHER') === 0
    && spStrikeStatements === 3
    && readFileSync(BRAIN_SRC, 'utf8').includes(SP_FORK_LINE),
  scopeNote: '⭐⭐ DLC-T0s\'s READ-FORK INVENTORY, RE-RUN AT T1s. Exactly ONE '
    + '`match.dlcStrikePlane` fork in src/**, at the named site in `PlayerBrain.ts` (one percept '
    + 'pull per DECISION, never per mate and never per grid member); ONE grid formation; ONE '
    + 'candidate-scoring call into the ONE hoisted `groundCandidate` (the pricer the banked '
    + 'contest declares — no second copy, no taste multiplier); ONE capture PAIR (two lines) '
    + 'carrying the winning member\'s own displacement; ⭐⭐ ONE PRECEDENCE GUARD, and it names '
    + 'NO FLAG (`spSeat !== null && dlcSeat === null && ptpSeat === null`) — which is why both '
    + 'banked G-FORK pins survive this seam verbatim and why the CONTRAST ANCHOR is still '
    + 'walkable; and ⭐ THREE `match.performPass(` statements in the brain, i.e. ZERO added by '
    + 'the plane. ZERO unclassified occurrences.',
};

/* --- ⭐ G-TRACE-SP: the plane's own frozen constants, READ FROM THE SHIPPED MODULE ---------- */
/** K, the step set and the zero-point INDEX are law, not taste (DLC-T0s §LAW / §DEV 3), so they
 *  are read from `src/ai/strikePlaneSeat.ts` through its own exports rather than typed here, and
 *  the two INCUMBENT STRIKE lines that turn a moved aim point into (direction, power) are matched
 *  VERBATIM in source — if either drifts, the power axis of this exam stops meaning what §LAW
 *  says it means. */
const SP_SEAT_SRC = 'src/ai/strikePlaneSeat.ts';
const MECHANICS_SRC = 'src/sim/mechanics.ts';
const gTraceSp = (() => {
  const seatSrc = readFileSync(SP_SEAT_SRC, 'utf8');
  const mechSrc = readFileSync(MECHANICS_SRC, 'utf8');
  const lines = [
    { file: SP_SEAT_SRC, line: 'export const STRIKE_PLANE_K = 9;', found: seatSrc.includes('export const STRIKE_PLANE_K = 9;') },
    { file: SP_SEAT_SRC, line: 'export const STRIKE_PLANE_ZERO_INDEX = 4;', found: seatSrc.includes('export const STRIKE_PLANE_ZERO_INDEX = 4;') },
    { file: SP_SEAT_SRC, line: 'export const STRIKE_PLANE_STEPS: readonly number[] = [-1, 0, 1];', found: seatSrc.includes('export const STRIKE_PLANE_STEPS: readonly number[] = [-1, 0, 1];') },
    { file: MECHANICS_SRC, line: 'const aim = norm(sub(lead, passer.pos));', found: mechSrc.includes('const aim = norm(sub(lead, passer.pos));') },
    { file: MECHANICS_SRC, line: 'const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;', found: mechSrc.includes('const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;') },
  ];
  const constantsHold = STRIKE_PLANE_K === 9 && STRIKE_PLANE_ZERO_INDEX === 4
    && STRIKE_PLANE_STEPS.length === 3 && STRIKE_PLANE_STEPS[0] === -1
    && STRIKE_PLANE_STEPS[1] === 0 && STRIKE_PLANE_STEPS[2] === 1;
  return {
    pass: lines.every((l) => l.found) && constantsHold,
    lines,
    constants: {
      STRIKE_PLANE_K, STRIKE_PLANE_ZERO_INDEX, steps: [...STRIKE_PLANE_STEPS],
      zeroPointMemberIsDirection0Power0:
        STRIKE_PLANE_STEPS[Math.floor(STRIKE_PLANE_ZERO_INDEX / 3)] === 0
        && STRIKE_PLANE_STEPS[STRIKE_PLANE_ZERO_INDEX % 3] === 0,
    },
    note: '⭐ THE PLANE\'s OWN CONSTANTS, TRACED: K = 9, the ±1 step set and the zero-point INDEX '
      + 'are read from the SHIPPED module\'s exports (never typed here), and the zero-point index '
      + 'is CHECKED to be the (direction 0, power 0) member — the candidate that IS today\'s kick '
      + 'and that the whole plane must beat. ⭐⭐ The two INCUMBENT STRIKE lines are matched '
      + 'VERBATIM because they are what turns a moved aim point into (direction, power): '
      + '`performPass` strikes ALONG the bearing to the point it is handed, and weights the ball '
      + 'by a law MONOTONE in the struck distance — so the struck LENGTH is the weight and the '
      + 'plane needs no new strike argument (DLC-T0s §DEV 2).',
  };
})();

const gates = {
  xDet: {
    pass: xDet, digestA, digestB,
    note: '⭐ THE SCOPE, STATED ACCURATELY (the #251.3(iii) correction made at the source rather '
      + `than in a later note): the WHOLE CORE — all ${ARMS.length} arms × ${RUN_N} seeds, the `
      + 'EIGHT receipt families (O2-T1 · #173 · GGC · CTB-T1 · OBM-T1 ×2 arms · G-ANCHOR · ⭐⭐ '
      + `G-REPRO-T1 ×${ARMS.length} arms · ⭐⭐ G-REPRO-T1B ×${ARMS.length} arms), the `
      + `${ARMS.length} delivered-dose reads, the `
      + `${ARMS.length} strike reads (each a traced match + its untraced LOCKSTEP TWIN), the `
      + 'H-250a counterfactual, the summaries and the paired bootstrap — runs TWICE; the two '
      + 'HASHED BODIES are byte-identical and resultSha256 is run 1\'s digest.',
  },
  xFpProd: {
    pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
  },
  xSrcUntouched: {
    pass: srcDiff === '', diffStat: srcDiff,
    note: 'INSTRUMENT-ONLY ROUND: EVERY seam is banked — the STRIKE PLANE at 54a45df/8333911 '
      + '(#242), the two-point CONTEST at 9360882/b8f5ef0 (#237), the pass-lead seat at e7eb041 '
      + '(#232), the eyes seat at 600ff04 (#228) — and this round changes no engine byte.',
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
    pass: bodyA.gAnchor.identical
      && DOOR.planeAnchor === 'sp' && GENE.planeAnchor === PTP_GENE_MAX
      && DOSE.planeAnchor === null && DV.planeAnchor === null,
    block: bodyA.gAnchor.block, source: DLCT1S_PATH, sourceArm: bodyA.gAnchor.sourceArm,
    sourceResultSha: bodyA.gAnchor.sourceResultSha,
    fieldsPerRow: bodyA.gAnchor.fieldsPerRow,
    rowsChecked: bodyA.gAnchor.rowsChecked,
    committedRowsAvailable: bodyA.gAnchor.committedRowsAvailable,
    mismatches: bodyA.gAnchor.mismatches,
    sourceSha256: DLCT1S === null ? null : sha(DLCT1S.bytes.toString('utf8')),
    // ⭐⭐ #251.3, CORRECTED AT THE SOURCE. DV-T1 shipped this conjunct with DLC-T1s's `'dlc'`
    // door on an exam whose anchor door is necessarily `'sp'` — dead by construction, publishing
    // false inside a row that claimed it proved something. Here the conjunct is RE-DERIVED for
    // THIS exam (the anchor's door IS the plane's, its gene IS the domain max, it carries NO
    // matrix and NO risk price) and it is part of the PASS predicate, which is only honest
    // because it is LIVE: the same three facts are the `anchorIsPlaneAlone` limb of
    // FLAG-HYGIENE's configuration predicate, whose liveness proof breaks it with a mutated door.
    armConfigurationIdentical: DOOR.planeAnchor === 'sp' && GENE.planeAnchor === PTP_GENE_MAX
      && DOSE.planeAnchor === null && DV.planeAnchor === null,
    note: bodyA.gAnchor.note,
  },
  /** ⭐⭐ G-REPRO-T1 — THE IDENTITY OF RECORD (#251.2 / #251.3). */
  gReproT1: {
    pass: bodyA.gReproT1.identical,
    block: bodyA.gReproT1.block,
    source: DVT1_PATH,
    sourceArms: bodyA.gReproT1.sourceArms,
    sourceResultSha: bodyA.gReproT1.sourceResultSha,
    fieldsPerRow: bodyA.gReproT1.fieldsPerRow,
    perArm: Object.fromEntries(ARMS.map((a) => [a, {
      rowsChecked: (bodyA.gReproT1.perArm as any)[a].rowsChecked,
      committedRowsAvailable: (bodyA.gReproT1.perArm as any)[a].committedRowsAvailable,
      mismatches: (bodyA.gReproT1.perArm as any)[a].mismatches,
      identical: (bodyA.gReproT1.perArm as any)[a].identical,
    }])),
    sourceSha256: DVT1 === null ? null : sha(DVT1.bytes.toString('utf8')),
    note: bodyA.gReproT1.note,
  },
  /** ⭐⭐ G-REPRO-T1B — THE IDENTITY OF RECORD, HALF TWO (#253.1). */
  gReproT1b: {
    pass: bodyA.gReproT1b.identical,
    block: bodyA.gReproT1b.block,
    source: DVT1B_PATH,
    sourceArms: bodyA.gReproT1b.sourceArms,
    sourceResultSha: bodyA.gReproT1b.sourceResultSha,
    fieldsPerRow: bodyA.gReproT1b.fieldsPerRow,
    perArm: Object.fromEntries(ARMS.map((a) => [a, {
      rowsChecked: (bodyA.gReproT1b.perArm as any)[a].rowsChecked,
      committedRowsAvailable: (bodyA.gReproT1b.perArm as any)[a].committedRowsAvailable,
      mismatches: (bodyA.gReproT1b.perArm as any)[a].mismatches,
      identical: (bodyA.gReproT1b.perArm as any)[a].identical,
    }])),
    sourceSha256: DVT1B === null ? null : sha(DVT1B.bytes.toString('utf8')),
    note: bodyA.gReproT1b.note,
  },
  /** ⭐⭐ G-FROZEN-BASES — the three bases a two-arm exam cannot measure, READ from DV-T1b's
   *  committed artifact and cross-checked against their own re-derivation. */
  gFrozenBases: {
    pass: frozenBases.allAgree,
    ...frozenBases,
  },
  /** ⭐⭐ G-N — THE EX-ANTE POOLING ARITHMETIC, MACHINE-CHECKED AGAINST THE FROZEN LITERAL.
   *  The battery's N is a literal in this file (`N_FROZEN`) so it is fixed before sight; this
   *  gate proves that literal IS the derivation from DV-T1's committed moments, that the moments
   *  were read from the artifact (never typed), and that the ceilings' state is declared. */
  gN: {
    pass: poolingRule.available === true
      && (poolingRule as any).frozenMatchesDerivation === true
      && (poolingRule as any).nStar > 0
      && (MODE === 'smoke' || RUN_N === (poolingRule as any).nStar),
    available: poolingRule.available,
    nFrozen: N_FROZEN,
    nStar: (poolingRule as any).nStar ?? null,
    nRaw: (poolingRule as any).nRaw ?? null,
    frozenMatchesDerivation: (poolingRule as any).frozenMatchesDerivation ?? false,
    runN: RUN_N,
    mode: MODE,
    studies: (poolingRule as any).studies ?? null,
    pooledPoint: (poolingRule as any).pooledPoint ?? null,
    pooledSe: (poolingRule as any).pooledSe ?? null,
    pooledCi: (poolingRule as any).pooledCi ?? null,
    scaleFrom: (poolingRule as any).scaleFrom ?? null,
    seRequired: (poolingRule as any).seRequired ?? null,
    mdeAskedFor: (poolingRule as any).mdeAskedFor ?? null,
    mdeBoughtAtNStar: (poolingRule as any).mdeBoughtAtNStar ?? null,
    roomBinds: (poolingRule as any).roomBinds ?? null,
    note: '⭐⭐ N SIZED EX ANTE TO THE POOLED POINT (#253.1). Both parents\' published '
      + 'goals-vs-anchor CIs are read out of their committed artifacts; each half-width gives an '
      + 'SE, the SEs give inverse-variance weights, the weights give the POOLED point; N is the '
      + 'cluster count at which DV-T1b\'s OWN paired SE on this same column gives 80 % power to '
      + 'resolve THAT POOLED POINT at 95 % two-sided. The literal in this file is checked against '
      + 'the derivation, and in FULL mode the battery is required to have RUN at it — a battery '
      + 'that quietly ran a different N would red this gate rather than publish a smaller MDE as '
      + 'if it were the frozen one.',
  },
  gTracePtp,
  gTraceSp,
  gForkTokensPtp,
  gForkTokensDlc,
  gForkTokensSp,
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
      strikeRead: `${STRIKE_READ_SEED}`,
      exitSemanticsGuard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      battery: `${BATTERY_BASE}..${batteryLast}`,
      batteryN,
      batteryRoom: BATTERY_ROOM,
      nextConsumedAfterBattery: NEXT_CONSUMED_AFTER_BATTERY,
    },
    coverageNote: '⭐ FOURTEEN BLOCKS, EVERY ONE MACHINE-CHECKED: 4 FRESH (exam · delivered-dose '
      + 'read · ⭐⭐ strike read · ⭐ H-250a counterfactual read — the block DV-T1\'s own list '
      + 'omitted) + 2 RESERVED (guard · battery) + 8 RE-WALKS (O2-T1 · #173 · GGC · CTB-T1 · '
      + 'OBM-T1 · ⭐⭐ DLC-T1s PLANE, the G-ANCHOR block · ⭐⭐ DV-T1 BATTERY and ⭐⭐ DV-T1b '
      + 'BATTERY, each on BOTH of this exam\'s arms — the G-REPRO-T1 and G-REPRO-T1B blocks). '
      + '⭐⭐ AND THE WHOLE STAGE LIVES ABOVE 12,432,000: every fresh and reserved block is VIRGIN '
      + 'ground, strictly above everything DV-T1 consumed (through 12,430,382) and everything '
      + 'DV-T1b consumed (through 12,431,999), and clear of DV-T0\'s test band — which is the '
      + 'entire point of a virgin-seed extension and is checked here rather than promised.',
    reproBlocksNote: 'the EIGHT repro blocks (O2-T1 · #173 · GGC · CTB-T1 · ⭐ OBM-T1 · ⭐⭐ '
      + 'DLC-T1s PLANE · ⭐⭐ DV-T1 BATTERY · ⭐⭐ DV-T1b BATTERY) are DELIBERATE '
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
    publishedScope: 'the O2-T1 probe\'s COMPLETE ≥91,100-regime ledger + every base drawn since '
      + '(105,800 DLC-T1s · 106,200 DV-T1 · 106,600 DV-T1b). Pre-regime bases (90,730, the 50xxx '
      + 'family) are ≥ 13,000 away and cannot move the minimum.',
  },
  flagHygiene,
  gArm: { pass: gArmPass, arms: gArmRows },
  /** ⭐⭐ G-DOSE — THE DOSES ARE DERIVED, NOT TASTED, AND THE DERIVATION IS MACHINE-CHECKED.
   *  (a) the BELIEF dose equals DV-C0's committed table EXACTLY, zone for zone, in the frozen
   *      own·middle·final order — read from the artifact by this probe, never typed;
   *  (b) each frozen exposure rung equals its published-number derivation to 5e-7;
   *  (c) the ladder INCLUDES 0 and every rung is FAR below 1 (< 0.1) — the #250.4 constraint;
   *  (d) the ABOVE-TRUTH arm is SHAPE-PRESERVING (one scalar factor on the whole vector) and
   *      inside the gene domain [0,1]. */
  gDose: (() => {
    const d = DOSE_DERIVATION;
    const near = (a: number, b: number): boolean => Math.abs(a - b) <= 5e-7;
    const beliefIsTheTable = DV_ZONES.every((z, i) => TRUTH_BELIEF[i]
      === trueTable.result.census.yardstick.zones[z].hazard);
    const parityOk = near(EXPOSURE_LADDER.parity, d.rungParity);
    const gradientOk = near(EXPOSURE_LADDER.gradient, d.rungGradient);
    const zeroPresent = EXPOSURE_LADDER.zero === 0;
    const allSmall = (Object.values(EXPOSURE_LADDER) as number[]).every((v) => v >= 0 && v < 0.1);
    /** ⭐ AND THE DOSED RUNG IS THE PARITY ONE — the rung the frozen letter is written at, read
     *  off the DV table rather than off the ladder constant, so a mis-wired arm cannot pass. */
    const dosedRungIsParity = ARMS.filter((a) => DV[a] !== null)
      .every((a) => (DV[a] as NonNullable<DvState>).exposure === EXPOSURE_LADDER.parity);
    return {
      pass: beliefIsTheTable && parityOk && gradientOk && zeroPresent && allSmall
        && dosedRungIsParity,
      beliefIsTheTable,
      beliefDose: TRUTH_BELIEF,
      beliefSource: `${TRUE_TABLE_PATH} → result.census.yardstick.zones[z].hazard, in the frozen `
        + `${DV_ZONES.join('·')} order`,
      censusResultSha: d.censusSha,
      t0ResultSha: d.t0Sha,
      meanExposurePublished: d.meanExposure,
      truthMeanRiskPricePublished: d.truthMeanPrice,
      derivedParity: d.parity,
      frozenParity: EXPOSURE_LADDER.parity,
      derivedGradientRung: d.rungGradient,
      frozenGradientRung: EXPOSURE_LADDER.gradient,
      censusGradient: d.gradient,
      zeroPresent,
      allRungsFarBelowOne: allSmall,
      dosedRungIsParity,
      dosedExposure: (DV[PRIMARY_ARM] as NonNullable<DvState>).exposure,
      note: '⭐⭐ EVERY DOSE IN THIS EXAM IS A QUOTIENT OF PUBLISHED NUMBERS, RE-DERIVED HERE '
        + 'RATHER THAN COPIED FROM DV-T1. The belief is DV-C0\'s measured table itself '
        + '(INSTRUMENT → GENES, read at exam time). The exposure ladder is 0 · PARITY (= the T0 '
        + 'truth-dosed mean risk price ÷ the T0 mean exposure reading: at this weight the '
        + 'exposure limb subtracts on average exactly what the truth map subtracts) · PARITY × '
        + 'the census\'s OWN own/final gradient — all three derived and machine-checked, and '
        + 'EXACTLY ONE of them (PARITY) dosed, because that is the rung ruling #251.2\'s letter '
        + 'is written at. No rung is a taste number.',
    };
  })(),
  /** ⭐⭐ X-NOTABLE — THE #247 SPLIT, RE-GREPED AT EXAM TIME. DV-T0's G-NOTABLE proved that
   *  `src/**` contains neither the census artifact's name nor any of its measured values; this
   *  exam DOSES those values, so it re-runs the grep on the very numbers it is about to write.
   *  If the table had leaked into src, the "instrument → genes" claim of this whole stage would
   *  be a fiction. ⚠ Percentage forms are FORMATTED before String() (the #250.3 hygiene note:
   *  no floating-point tail strings that can never match). */
  xNotable: (() => {
    const files: string[] = [];
    const walk = (dir: string): void => {
      for (const e of readdirSync(dir)) {
        const full = `${dir}/${e}`;
        if (statSync(full).isDirectory()) walk(full);
        else if (full.endsWith('.ts')) files.push(full);
      }
    };
    walk('src');
    const needles = [
      'dv-c0-loss-cost', 'dv-c0.truth-table',
      ...TRUTH_BELIEF.map((h) => String(h)),
      ...TRUTH_BELIEF.map((h) => (h * 100).toFixed(4)),
      ...TRUTH_BELIEF.map((h) => (h * 100).toFixed(2)),
    ];
    const hits: { file: string; needle: string }[] = [];
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      for (const n of needles) if (text.includes(n)) hits.push({ file: f, needle: n });
    }
    return {
      pass: hits.length === 0,
      filesScanned: files.length,
      needles,
      hits,
      note: '⭐⭐ THE TRUTH/BELIEF SPLIT (#247) HELD BY GREP AT EXAM TIME, on the exact values '
        + 'this stage writes into the genes: no file in `src/**` names the census artifact, its '
        + 'schema, or any zone hazard — as written or as a percentage formatted to 2 and 4 '
        + 'decimals. The players are dosed by the INSTRUMENT; the code has never heard of the '
        + 'table.',
    };
  })(),
  gCleanInvocation: {
    pass: !OVERRIDDEN, envN: N_ENV, skipFp: SKIP_FP, routedToGuardBlock: OVERRIDDEN,
    note: 'any DVT1C_N / DVT1C_SKIP_FP override is BY DEFINITION not the exam: the run is routed '
      + 'onto the exit-semantics guard block, this gate goes RED and the process exits 1.',
  },
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §15 THE ARTIFACT — hashed body vs UNHASHED envelope (#197-M1 / #198)        */
/* ========================================================================== */
const body = {
  stage: 'DV T1c — THE GOALS RE-POWER (T1 读到 +0.2438 resolved,T1b 只读到 +0.0404 没复现 — '
    + '这一场按两份已落盘读数的合并点买够场次,把这一格看清楚)',
  ruling: '#253.1 (THE CHARTER: TWO arms only — PLANE-ANCHOR · dvTruthP, configurations '
    + 'byte-identical to T1/T1b with identity via re-walks of BOTH prior batteries\' committed '
    + 'rows; N sized EX ANTE to resolve the POOLED T1+T1b goals-vs-anchor point at 80 % power / '
    + '95 % two-sided; frozen letter = goals Δ dvTruthP vs anchor, supply republished for '
    + 'continuity; the three routes pre-named) · ⭐ #252.3 (THE LESSON THIS PROBE IS BUILT '
    + 'AGAINST: a route consequent that silently EMBEDS another limb is a defect — the consequents '
    + 'here are #253.1\'s own words verbatim; and EVERY conjunct of the configuration predicate '
    + 'gets a mutant, machine-checked) · #252 (DV-T1b adjudicated: supply half STANDS, goals half '
    + 'OPEN) · #251.3 (never inherit a configuration predicate; mode-condition every caveat '
    + 'literal) · #250.3 (timings ride the UNHASHED envelope; percentage grep-forms FORMATTED '
    + 'before String()) · #250.4 (H-250a, the delivered-rate publication, the no-cost-% rule) · '
    + '#249 (DV-C0 — THE TRUE TABLE) · #247 (the TRUTH/BELIEF split) · #244 (THE FAILURE THE ARC '
    + 'INVERTS) · DELIVERY-VALUE-CONTRACT §3 (the JOINT\'s two limbs, verbatim) · #225.3(c) · '
    + '#203 (rows and a printed route, never verdicts)',
  doc: 'docs/world-model/DV-T1C-GOALS-REPOWER.md',
  mode: MODE,
  block: `${RUN_BASE}..${RUN_BASE + RUN_N - 1}`,
  seeds: RUN_N,
  world: '⭐ ONE PERCEPT-ARMED BASE WORLD, IDENTICAL IN EVERY ARM: `new Match({seed, teamA, '
    + 'teamB, duration, edsPerceivedChoice: true})` — DV-T1\'s world, which is DLC-T1s\'s world, '
    + 'exactly. ⚠ DECLARED (inherited verbatim): the choice flag also moves the CARRIER onto the '
    + 'perceived-snapshot pass chooser, so absolute levels are not comparable across exams; the '
    + 'PAIRED contrast is clean because BOTH ARMS SHARE THIS WORLD EXACTLY and differ by '
    + 'nothing but the RISK PRICE. Each G-REPRO walk runs in ITS SOURCE\'s own world — and '
    + '⭐⭐ G-REPRO-T1\'s and G-REPRO-T1B\'s walks run in THIS world on THIS exam\'s own two arms, '
    + 'which is what makes the configuration identity with both parents an earned receipt rather '
    + 'than a claim.',
  armDefinitions: Object.fromEntries(ARMS.map((a) => [a, [
    DOSE[a] === null ? 'obmMovement:false (no matrix)'
      : `obmMovement:true · matrix [${(DOSE[a] as number[]).join(',')}]`,
    DOOR[a] === 'sp' ? `dlcStrikePlane:true (the banked GROUND STRIKE PLANE, K = ${STRIKE_PLANE_K}) `
      + `· passLeadSupport ${GENE[a]} = PRESENCE-GATE ONLY (magnitude retired #240/#241)`
      : 'no delivery door open',
    DV[a] === null ? 'dvDeliveryValue:false · dvExposureWeight ABSENT · dvLossBelief ABSENT'
      : `dvDeliveryValue:true · dvExposureWeight ${(DV[a] as NonNullable<DvState>).exposure} · `
        + `dvLossBelief [${(DV[a] as NonNullable<DvState>).belief.join(',')}] — `
        + (DV[a] as NonNullable<DvState>).label,
    'ctbSupportPlane:false · dlcDeliveryChoice:false · ptpPassLead:false · edsPerceivedChoice:true',
    '(every gene on all three genome views of BOTH teams — the real gene channel, #196.3-D6)',
  ].join(' · ')])),
  armRationale: ARM_SENTENCE,
  doseProvenance: '⭐⭐ INSTRUMENT → GENES, NEVER CODE → TABLE, AND EVERY NUMBER A QUOTIENT OF '
    + 'PUBLISHED ONES. THE BELIEF DOSE IS THE TRUE TABLE EXACTLY: this probe opens DV-C0\'s '
    + 'committed artifact at exam time, reads `result.census.yardstick.zones[z].hazard` in the '
    + 'frozen own·middle·final order and WRITES those three numbers into `dvLossBelief` on all '
    + 'three genome views of both teams. `src/**` has never heard of that table and X-NOTABLE '
    + 're-greps the whole tree on the exact values being written. THE EXPOSURE LADDER is 0 · '
    + 'PARITY · PARITY × the census\'s own own/final gradient, each DERIVED IN-PROBE from DV-T0\'s '
    + 'published readings and machine-checked against the frozen literals by G-DOSE. THE '
    + 'WHOLE LADDER IS DERIVED AND MACHINE-CHECKED, AND EXACTLY ONE RUNG IS DOSED: PARITY, the '
    + 'rung ruling #251.2\'s letter is written at. DV-T1\'s zero rung, gradient rung and '
    + 'above-truth arm are BANKED at #251.1 and are not re-asked — a power extension buys '
    + 'clusters, not cells. ⭐ And the doses are not COPIED from DV-T1: they are RE-READ from '
    + 'DV-C0\'s and DV-T0\'s own committed artifacts by this probe, so a drifted source would '
    + 'red G-DOSE here rather than ride in on inheritance.',
  indexAxisFact: '⚠⚠ STATED, NOT RESOLVED (DV-T0 §HONESTY 8, ruling #250.4). The belief is read '
    + 'at the candidate\'s RECEPTION zone (`zone(aim)`); DV-C0\'s hazards are indexed by the LOSS '
    + 'point, which for an intercepted pass is the RELEASE position (#215.3-H1, definitional). '
    + 'At ~19.5 m mean flight against 21 m-wide thirds, aim and release routinely sit in '
    + 'different thirds, so THE TRUTH DOSE WRITES TRUE VALUES ONTO A SHIFTED INDEX. The '
    + 'mechanism choice is RATIFIED (#250.3): reception indexing prices "passing INTO danger", '
    + 'which is the behaviour this arc exists to shape, while release indexing would tax the '
    + 'own-third OUTLET ball itself (anti-purpose, H-169a). It is ADEQUATE for this exam\'s '
    + 'shape-capability JOINT — the map is own > middle > final either way — and NOT '
    + 'commensurable for DV-T2\'s convergence scoring, which must resolve it FIRST.',
  saturationFact: '⚠ THE T0 FACT THAT SIZED THIS LADDER (#250.4): the exposure reading SATURATES '
    + 'HIGH (mean 0.8126 over 51,420 priced pairs in the percept world; a body covers ~7–9 m in '
    + 'the ~1.08 s mean flight against the corridor family\'s own 4 m scale), and H-250a measured '
    + 'a dose of 1 SUPPRESSING 21 of 32 base strike-ticks with 0/64 target flips — a LEVEL '
    + 'SUPPRESSANT, not a reorderer. Hence a ladder that includes 0 and whose loudest rung is '
    + '0.054822, i.e. 5.5 % of that dose; hence also the H-250a counterfactual RE-MEASURED at '
    + 'this exam\'s own doses rather than inherited.',
  costRule: '⚠ NO COST PERCENTAGE IS QUOTED ANYWHERE IN THIS STAGE (#250.4), and no cost '
    + 'percentage from any other stage is quoted either — the durable cost fact of this arc is a '
    + 'BYTE-IDENTITY, not a timing, and it is DV-T1\'s (`dvInert` ≡ `planeAnchor` on 283/283 '
    + 'seeds), banked and not re-asked here. This stage measures no cost at all. Its own '
    + 'byte-level facts are the two receipts it does run: G-REPRO-T1 (this exam\'s two arms '
    + 'reproduce DV-T1\'s committed rows exactly) and the DIVERGENCE row (the parity dose does '
    + 'change the world, per seed).',
  twoDoorsDeclaration: '⭐⭐ ONE DELIVERY DOOR IN EVERY TREATMENT ARM, AND IT IS THE SAME ONE. '
    + '`ptpPassLead`, `dlcDeliveryChoice` and `ctbSupportPlane` are FALSE IN EVERY ARM — asserted '
    + 'per arm off the REAL constructed matches, never merely stated — so every treatment arm '
    + 'rides the IDENTICAL banked strike plane at the IDENTICAL gene value and the ONLY thing '
    + 'that varies across them is the RISK PRICE. ⚠ `dvDeliveryValue` is NOT a fourth delivery '
    + 'door: under DV-T0 §LAW it does not COMPETE with any seam, it PRICES whatever they '
    + 'produce, which is why its arming is asserted as its own two-limb checklist (flag + '
    + 'non-absent genes on all three genome views of both teams) rather than through the '
    + 'exclusivity row.',
  thinChannelDeclaration: '⭐⭐ THE DELIVERY LIMITS, DECLARED AT THE HEAD RATHER THAN DISCOVERED '
    + 'AT THE FOOT (#242.2, the fact ruling #250.4 orders republished). The plane chooses at '
    + 'DECISION time; in a percept world the pass TARGET is then re-chosen and the banked '
    + 'led-strike guard DISCARDS the plane\'s winner whenever the man changed (DLC-T0s measured '
    + 'delivered rate 0.298 percept vs 0.776 bare). ⇒ THIS EXAM PUBLISHES DELIVERED RATE PER ARM '
    + 'AS A FIRST-CLASS NUMBER in both forms — the zero-pull STRIKE-TIME share on the exam walks '
    + 'themselves and the LIVE-GRID-conditioned decoded rate on its own declared seed — and '
    + 'never reads a decision-time rate as a strike-time one. ⚠ AND THE RISK PRICE\'S OWN '
    + 'delivery limit is published beside it: the price reaches only candidates that go through '
    + 'the GROUND-PASS pricer (DV-T0 §SEAM\'s scope note — the loft, the through ball, the cross '
    + 'and the cutback price themselves on their own chains and are NOT priced by this seam).',
  preRegisteredSuccess: '⭐⭐ THE FROZEN LETTER (ruling #253.1): the `goalsPerMatch` PAIRED '
    + 'CLUSTER BOOTSTRAP delta of `dvTruthP` against `planeAnchor`, resolved TOWARD the frozen '
    + 'band (band re-derived here as DV-T1 and DV-T1b derived it: 2.3944 ± 15 %), with `inBand` '
    + 'printed too; SUPPLY vs the anchor republished for continuity and gating nothing. ⭐⭐ AND '
    + 'THE THREE ROUTES, PRE-NAMED AND PRINTED MECHANICALLY, their consequents #253.1\'s OWN '
    + 'WORDS: RESOLVED-RECOVER ⇒ "the goals half stands on its own properly-powered exam (with '
    + '#252.2\'s supply half, the #244 inversion then stands whole, each limb on a powered virgin '
    + 'battery)" · RESOLVED-NULL ⇒ "T1\'s +0.2438 was a first-resolution overshoot; the goals '
    + 'question closes honest-negative at these doses" · UNRESOLVED at N* ⇒ "a commander\'s '
    + 'honesty ruling". The probe PRINTS the route; the commander RESOLVES it (#203).',

  preRegisteredStopGranularity: '⭐ FROZEN EX ANTE, INHERITED VERBATIM (#225.3(c); stage doc '
    + '§SUCCESS): F-DLC-b and F-DLC-c fire PER DOSE — a dose whose guard BREACHES (resolved AND '
    + 'beyond the frozen tolerance) is DISQUALIFIED as a candidate, and the ARC-level STOP fires '
    + 'only if EVERY dose that moves the primary ruler helpfully is disqualified. The DELIVERED '
    + 'reading is frozen with it: every row is read beside its DELIVERED dose (mean |plane '
    + 'shift|, the four support-tick classes, the clamp shares, the score-mul distributions), so '
    + 'a null result can never be read as a strong dose that failed when it was a weak dose that '
    + 'arrived — and at THIS stage the delivered reading that matters most is the #242.2 one: the '
    + 'plane\'s own choice reaches the ball on roughly a THIRD of kicks in a percept world, so '
    + 'every row is read beside its DELIVERED RATE. The band rule is frozen with it too: the '
    + 'equilibrium band GATES at battery N only'
    + (MODE === 'full' ? ` — AND THIS RUN IS THE BATTERY (N* = ${RUN_N}), so it gates here` : ', and THIS RUN IS SMOKE, so it gates nothing here')
    + '; at any N the #198-form exclusion applies (dimensions the ABSENT arm itself fails are '
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
  primaryRulers: '⭐ THE LETTER, FROZEN EX ANTE (see `preRegisteredPrimary`): the `goals` band '
    + 'dimension RECOVERED at the PARITY cell, read against the PLANE-ALONE ANCHOR — the ONLY '
    + 'reference a two-arm exam has. ⭐⭐ `goalsPerMatch` is also the column the EX-ANTE N is cut '
    + 'on, because it is the column the letter reads; ruler 1 (TRUE-holdable supply) rides '
    + 'REPUBLISHED for continuity and sizes nothing. ⭐ REPORTED HEADLINES beside it: the DELIVERED RATE per arm (both '
    + 'forms), the H-250a flip-vs-suppress counterfactual at this exam\'s own doses, the '
    + 'chosen-strike distribution over the nine grid members, and the emergent led share. '
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
  preRegisteredPrimary,
  poolingRule,
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
      + 'EVIDENCE for F-DV-b/c, never the firing of it.',
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
      note: `RESILIENCE ONLY. The unit is the per-(pass, seed) set of ${ARMS.length} arm rows `
        + '(this exam\'s own arm count, computed rather than inherited — DV-T1b shipped a stale '
        + '"5 arm rows" literal here, #252.3); nothing pooled '
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
o(`=== DV-T1c THE GOALS RE-POWER (#253.1) · mode ${MODE} · ${body.block} `
  + `(${RUN_N} seeds/arm, shared) ===`);
o('world: PERCEPT-ARMED (edsPerceivedChoice) · ctbSupportPlane FALSE in every arm');
o(`arms: PLANE-ANCHOR · dvTruthP (NO control arm, #253.1) — differing by EXACTLY the RISK PRICE · Δ = ARM − ${BASE_ARM}`);
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
  o(`  ${k}: ABSENT (FROZEN at DV-T1b) ${c.absentLevelPctFrozen}% ⇒ helpful headroom `
    + `${c.helpfulHeadroomPpFrozen} pp · this stage's ANCHOR level ${c.anchorLevelThisStage}`);
  for (const a of ARMS.filter((x) => x !== BASE_ARM)) {
    const r = (c.perArm as any)[a];
    o(`    ${a.padEnd(16)} Δ vs anchor ${String(r.deltaPpVsAnchor).padStart(7)} pp = `
      + `${(r.shareOfFrozenHeadroomConsumed * 100).toFixed(1)}% of the FROZEN headroom`
      + ` · resolved=${r.resolved}`);
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
o('⭐⭐ THE CHOSEN-STRIKE DISTRIBUTION over the NINE grid members + THE DELIVERED RATE — REPORTED');
o(`  (observational, seed ${STRIKE_READ_SEED}; index = (dirStep+1)*3 + (powerStep+1), member 4 = TODAY'S KICK`);
o("   — ⚠ member 4 prints n/a: a zero-displacement kick carries no 5th argument, so it is");
o('     STRUCTURALLY UNRECORDABLE at strike time. #242.3)');
for (const a of ARMS) {
  const sr = (bodyA as any).strikeRead[a];
  o(`  ${a.padEnd(16)} door ${String(sr.door).padEnd(4)} kicks ${String(sr.kicks).padStart(4)}`
    + ` · sampled ${String(sr.sampledStruck).padStart(4)} · zeroPoint ${String(sr.genuineZeroPoint).padStart(4)}`
    + ` (live ${sr.zeroPointLiveGrid} / DEGENERATE ${sr.zeroPointDegenerateGrid} / noSeat ${sr.zeroPointNoSeat})`
    + ` · SUBSTITUTED ${String(sr.targetSubstituted).padStart(4)}`
    + ` (live ${sr.substitutedLiveGrid} / DEGENERATE ${sr.substitutedDegenerateGrid} / noSeat ${sr.substitutedNoSeat})`
    + ` · noRow ${String(sr.noChooserRow).padStart(4)}`);
  o(`    ${' '.repeat(16)} ⭐⭐ deliveredRate LIVE-GRID ${sr.deliveredRateLiveGrid} (n=${sr.liveGridDecisions})`
    + ` · ⚠ RETRACTED decoded ${sr.deliveredRateDecoded}`
    + ` [${sr.deliveredRateDecodedBracket.lower}, ${sr.deliveredRateDecodedBracket.upper}]`
    + ` · substitutionRate ${sr.substitutionRate}`
    + ` · unmatched ${sr.unmatchedStrikes} · lockstep=${sr.lockstepWithUntraced}`);
  o(`    ${' '.repeat(16)} byMember [${sr.byMember.map((m2: any) => (m2.observableAtStrike ? m2.wins : 'n/a')).join(', ')}]`
    + ` · byDirection ${JSON.stringify(sr.byDirection)} · byPower ${JSON.stringify(sr.byPower)}`
    + ` · meanDisp ${sr.meanDisplacementMetres} m (max ${sr.maxDisplacementMetres})`);
}
o('  ⭐ THE DELIVERED RATE AT BATTERY GRAIN (zero-pull, on the exam walks themselves)');
for (const a of ARMS) {
  o(`    ${a.padEnd(16)} ${(gArmRows as any)[a].deliveredRateStrikeTime}`
    + ` = ledPassesNonZero/passesChosen — the treatment AS REALLY DELIVERED (#242.2)`);
}
o('');
o('⭐⭐ THE CONTRACT\'S TWO LIMBS, TOGETHER (mechanical flags only, #203)');
o('  LIMB A supply vs the ANCHOR — REPUBLISHED FOR CONTINUITY, gating nothing (#252 closed it)');
o('  LIMB B goals RECOVER (in band, or bandDistance below the anchor AND resolvedly toward it)');
for (const a of ARMS.filter((x) => x !== BASE_ARM)) {
  const j = (preRegisteredPrimary.allArms as any)[a];
  const sl = j.supplyLimbContinuityOnly; const bl = j.goalsBandLimb;
  o(`    ${a.padEnd(14)} supply Δvs.anchor ${String(sl.deltaVsAnchor).padStart(11)} `
    + `[${sl.ci === null ? '' : sl.ci[0]}, ${sl.ci === null ? '' : sl.ci[1]}]`
    + ` helpfulVsAnchor=${sl.resolvedHelpfulVsAnchor} killedVsAnchor=${sl.resolvedKilledVsAnchor}`
    + ' (CONTINUITY ROW, NON-GATING)');
  o(`    ${' '.repeat(14)} goals/match ${bl.goalsPerMatch} in [${bl.band[0]}, ${bl.band[1]}] inBand=${bl.inBand}`
    + ` · bandDist ${bl.bandDistance} vs anchor ${bl.bandDistanceAnchor} fell=${bl.bandDistanceFell}`
    + ` · Δgoals vs.anchor ${bl.goalsVsAnchor === null ? 'n/a' : `${bl.goalsVsAnchor.point} [${bl.goalsVsAnchor.lower}, ${bl.goalsVsAnchor.upper}]`}`
    + ` towardBandResolved=${bl.towardBandResolved} ⇒ LIMB B=${bl.limbB}`);
}
o(MODE === 'full'
  ? `  ⚠ the goals BAND gates at battery N — and this IS the battery (N* = ${RUN_N})`
  : '  ⚠ the goals BAND gates at battery N only — this run is SMOKE, so it is plumbing');
o('');
o('⭐⭐ THE FROZEN LETTER (#253.1) — goals Δ dvTruthP vs the ANCHOR — printed, never resolved (#203)');
{
  const fl = preRegisteredPrimary.frozenLetter;
  const rt = preRegisteredPrimary.routes;
  const b2 = fl.limbB;
  o(`  goals ${PRIMARY_ARM} ${b2.goalsPerMatch} vs anchor ${b2.anchorGoalsPerMatch}`
    + ` · band [${b2.band[0]}, ${b2.band[1]}] inBand=${b2.inBand}`
    + ` · anchorBelowBand=${b2.anchorBelowBand}`);
  o(`  ⭐⭐ Δ goals vs the ANCHOR ${b2.goalsVsAnchor === null ? 'n/a'
    : `${b2.goalsVsAnchor.point} [${b2.goalsVsAnchor.lower}, ${b2.goalsVsAnchor.upper}]`}`
    + ` · towardBandResolved=${b2.towardBandResolved}`
    + ` · awayFromBandResolved=${b2.awayFromBandResolved}`
    + ` · clearOfPooledSign=${b2.clearOfPooledSign} ⇒ LIMB B=${b2.limbB}`);
  o(`  bandDistance ${b2.bandDistance} vs the anchor's ${b2.bandDistanceAnchor}`
    + ` fell=${b2.bandDistanceFell}`);
  o(`  priors (EX-ANTE SIZING INPUTS, not claims about this row): T1 ${b2.priorReadings.dvT1}`);
  o(`                                                            T1b ${b2.priorReadings.dvT1b}`);
  o(`                                                            POOLED ${String(b2.priorReadings.pooled)} `
    + `${JSON.stringify(b2.priorReadings.pooledCi)}`);
  o(`  LIMB A (CONTINUITY, non-gating) supply Δ vs anchor ${String(fl.limbAContinuity.deltaVsAnchor)}`
    + ` ${JSON.stringify(fl.limbAContinuity.ci)} resolved=${fl.limbAContinuity.resolved}`);
  o('  ⭐⭐ THE THREE ROUTES (#253.1, consequents VERBATIM), read at ' + String(rt.readAt) + ':');
  o(`     RESOLVED-RECOVER ${rt.definitions['RESOLVED-RECOVER']}`);
  o(`     RESOLVED-NULL    ${rt.definitions['RESOLVED-NULL']}`);
  o(`     UNRESOLVED       ${rt.definitions.UNRESOLVED}`);
  o(`  ⇒ THE FROZEN LETTER SELECTS: ${rt.selected}`);
  o(`     MDE bought at this N: ${String(rt.mdeBoughtAtThisN)} · ${rt.grain}`);
  o(`     ${rt.status}`);
}
o('');
o('⭐⭐ H-250a AT THIS EXAM\'S OWN DOSES — the flip-vs-suppress counterfactual (REPORTED)');
{
  const cf = bodyA.h250aCounterfactual as any;
  o(`  base strike-ticks sampled ${cf.baseStrikeTicks} · zero-dosed reference walk seed ${cf.seed}`);
  for (const r of cf.rows) {
    o(`    ${String(r.arm).padEnd(14)} exposure ${String(r.exposure).padEnd(9)} belief ${r.beliefLabel.padEnd(6)}`
      + ` · suppressed ${r.suppressed}/${r.baseTicks} · created ${r.created}`
      + ` · TARGET FLIPS ${r.targetFlips}/${r.comparedTicks} · aim-only changes ${r.aimChanges}`);
  }
  o(`  ⇒ ${cf.reading}`);
}
o('');
o('⭐ THE #218 TIER-2 SHARES — REPORTED WITH CIs, no gate reads them');
rowLine('  5c constructed >=5 passes (non-set-piece pool)', 'constructedGe5Share');
rowLine('  5d scramble share of goals', 'scrambleShareOfGoals');
o('');
o('THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)');
for (const g of guardRows) {
  o(`  ${g.key} [${g.family}, ${g.direction}] FROZEN control level (DV-T1b) ${g.frozenControlLevel}`
    + ` · tol ±${g.toleranceAbs} (agrees with parent: ${g.toleranceAgreesWithParent})`
    + ` · this stage's anchor level ${g.anchorLevelThisStage}`);
  for (const a of ARMS.filter((x) => x !== BASE_ARM)) {
    const r = (g.arms as any)[a];
    o(`    ${a.padEnd(16)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
      + ` resolved=${r.resolved} beyondTol=${r.beyondTolerance} BREACH=${r.breach}`);
  }
}
o('  offsides/match (the #157 FLAG form — returns to the commander, flips no gate)');
for (const a of ARMS.filter((x) => x !== BASE_ARM)) {
  const r = (offsideRows as any)[a];
  o(`    ${a.padEnd(16)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
    + ` resolved=${r.resolved} resolvedIncrease=${r.resolvedIncrease}`);
}
o(`  equilibrium band — gated dimensions ${JSON.stringify(bandGated)}`
  + ` · EXCLUDED (DV-T1b's own control out of band) ${JSON.stringify(bandExcluded)}`);
for (const a of ARMS) {
  o(`    ${a.padEnd(16)} allGatedInBand=${(bandRows as any)[a].allGatedDimensionsInBand}`);
}
o('');
o('⭐⭐ THE EX-ANTE POOLING RULE (in-probe, from BOTH parents\' COMMITTED artifacts)');
if (nRule.available) {
  const nr = nRule as any;
  o(`  column = ${nr.field}`);
  for (const st of nr.studies) {
    o(`    ${String(st.stage).padEnd(14)} ${st.point} [${st.lower}, ${st.upper}] at ${st.clusters}`
      + ` clusters · half-width ${round(st.halfWidth, 9)} ⇒ se ${round(st.se, 9)}`
      + ` ⇒ weight 1/se² ${round(st.weight, 6)}`);
  }
  o(`  Σw ${nr.weightSum} ⇒ POOLED point ${nr.pooledPoint} · pooled se ${nr.pooledSe}`
    + ` · pooled 95 % CI ${JSON.stringify(nr.pooledCi)} (REPORTED context, adjudicated nowhere)`);
  o(`  se(required) ${nr.seRequired} = |pooledPoint|/(z.975+z.80)`);
  o(`  scaling se = ${nr.scaleFrom.stage}'s own ${nr.scaleFrom.se} at ${nr.scaleFrom.clusters} clusters`);
  o(`  N_raw ${nr.nRaw} = ceil(${nr.scaleFrom.clusters} · (se_scale/se_required)^2) ⇒ N* ${nr.nStar}`
    + ` (ledger room ${nr.batteryRoom} binds=${nr.roomBinds})`);
  o(`  frozen literal N_FROZEN ${nr.nFrozen} matches the derivation: ${nr.frozenMatchesDerivation}`);
  o(`  MDE asked for ${nr.mdeAskedFor} · MDE BOUGHT at N* ${nr.mdeBoughtAtNStar}`
    + ` · expected goals-Δ CI half-width at N* ${nr.expectedHalfWidthAtNStar}`);
  o(`  battery block ${nr.batteryBlock} · ${nr.roomForkNote}`);
  o('  ⭐ REALISED vs EX-ANTE (the assumption this rule made, checked after the fact):');
  {
    const cell = C.goalsPerMatch[PRIMARY_ARM].pairedDelta;
    const realised = cell === null ? null : (cell.upper - cell.lower) / 2;
    o(`     goals Δ vs anchor CI half-width — ex-ante expectation ${nr.expectedHalfWidthAtNStar}`
      + ` vs REALISED ${realised === null ? 'n/a' : round(realised, 9)}`);
  }
}
o('');
o('GATES');
for (const [k, g] of Object.entries(gates)) o(`  ${k.padEnd(20)} ${(g as any).pass ? 'PASS' : '*** FAIL ***'}`);
o(`  ALL                ${allGatesPass ? 'PASS' : '*** FAIL ***'}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${Math.round(wallMs / 1000)} s (CONTEXT ONLY) · artifact ${OUT_PATH}`);
if (!allGatesPass || OVERRIDDEN) process.exitCode = 1;
