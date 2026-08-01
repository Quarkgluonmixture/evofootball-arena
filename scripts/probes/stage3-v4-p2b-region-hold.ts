// STAGE III V4-P2b — THE REGION-CONTAINMENT HOLD (instrument-corrected occupancy census; CLASS H).
//
// Authority: docs/world-model/STAGE3-V4-P2B-REGION-HOLD.md (FROZEN pre-registration
// 2026-08-01, §§1-8) — ORDERED by ruling #106.5 (the V4-P2 adjudication: the statue confound
// #106.3) and AUTHORIZED to build by ruling #107 (pre-reg reviewed PASS; the SEVEN flagged
// choices ratified). A FOCUSED AMENDMENT of V4-P2 that INHERITS the entire P2 pre-registration
// (STAGE3-V4-P2-OCCUPANCY-CENSUS.md §§1-8 + its committed §RESULT) VERBATIM and amends ONLY the
// five items #106.5 names. Under the v4 design contract STAGE3-V4-LONG-HORIZON-PRICE.md (I1-I11).
// FORCING (unilateral fork-and-hold, I4); ZERO src/** changes. Nothing ships (Road B): every EDS
// flag dormant in production, forcedStation/stationEye NULL in every production path, the
// fingerprint 57b0bdab…c673 unchanged throughout.
//
// WHAT V4-P2b MEASURES (prereg §1/§2). Re-prices the SAME held region classes P2 defined — the
// long-horizon GOAL-VALUE PRICE OF HOLDING A REGION — but with the STATUE ARTIFACT REMOVED. P2
// forced the body to a FIXED pitch point every tick (pricing immobility, not occupancy → every
// resolved price came back NEGATIVE, dominated by dynamism loss; #106.3). P2b lets the held body
// move FREELY (its own policy) while INSIDE its frozen region class and steers it back ONLY on
// leaving it (a Schmitt-latch containment). The estimand becomes REGION OCCUPANCY: the body lives
// in its region and does its normal job there; the price is the change in opponent deep/box entries
// AGAINST caused by keeping it in that region through the counter window. Attack displacement stays
// priced (the hedge's real cost side). The frozen region class is resolved ONCE at t_fork from the
// SAME lattice geometry as P2 (a region-class, NEVER the incumbent designation, #91). Output = a
// PRICE SURFACE over (context × role × held region class), read OFF the surface, not the menu (#91).
//
// ⭐ THE GATING UNIT (ruling #103.3, inherited P2 LAW): the DEEP unit (0.0435 goals/entry) GATES
// Claims 1 AND 2 (dense, resolvable per fork). The BOX unit (0.1952) is the LABELLED SECONDARY
// EVERYWHERE. The two are NEVER summed (nesting, #102.5).
//
// THE FIVE AMENDMENTS (#106.5; everything else = P2 verbatim, §3):
//   (a) ENFORCEMENT — free-inside / steer-back-on-exit (§2.1): a two-state hysteresis (Schmitt)
//       latch on the body's signed depth-into-R distance s(t); engage (steer) when s<0 (body has
//       LEFT R), disengage (release, FREE) when s≥HYSTERESIS_M=1.0 m; the re-entry target is the
//       nearest point of R shrunk inward by the margin on the body's CURRENT wing, recomputed per
//       steering tick in absolute coords. Replaces P2's unconditional per-tick point re-assertion.
//   (b) OCCUPANCY — insideTicks counts inRegion ticks / W_hold ticks (region membership, NOT the
//       2 m point test; ARRIVE_M RETIRED from the estimand; §2.2). OCC_FLOOR=0.5 unchanged.
//   (c) N RULE — the attainability KNEE (§2.3): smallest 50-step N with inPower(N) ≥ 0.95·plateau,
//       cap N_max=800 (the pooled-MDL formula RETIRED; pooled prices/σ̂ kept as labelled context).
//   (d) SEEDS — new disjoint bands: smoke 10.2M / census 10.3M; stats seeds 99203 / 99303 (§2.4).
//   (e) COMPARISON READ — per in-power cell, the P2b price NEXT TO the P2 statue-price read from the
//       committed docs/world-model/data/stage3-v4-p2-occupancy-census.json (content SHA-256
//       3f332a8e…24a9, LABELLED NON-GATING; §2.5). PLUS the entailed `free` diagnostic tick class.
//
// COMMAND LINES (documented per prereg §8; the two REAL runs are the commander's, #49.5):
//   • SIZING SMOKE (real; writes the canonical smoke JSON, pins the census N via the knee rule):
//       V4P2B_MODE=smoke npx tsx scripts/probes/stage3-v4-p2b-region-hold.ts
//     → 40 matches on seeds 10,200,000+k (k∈0..39), enriched eye-null, FULL region-containment hold;
//       measures realized occupancy dist / exception+latch shares / moments-per-match / per-cell
//       attainability curve / per-moment wall-cost; applies the FROZEN KNEE RULE and records N in
//       docs/world-model/data/stage3-v4-p2b-sizing-smoke.json (SHA'd, X-DET).
//   • CENSUS (real; N passed EXPLICITLY from the smoke output; writes the canonical table):
//       V4P2B_MODE=census V4P2B_N=<N from the smoke JSON's nRule.N> \
//         npx tsx scripts/probes/stage3-v4-p2b-region-hold.ts
//     → N matches on seeds 10,300,000+k (k∈0..N−1, N ≤ N_max=800), enriched eye-null, FULL
//       region-containment hold; builds the price surface + Claim 1 (per-cell deep-price cluster
//       bootstrap CI) + Claim 2 (region/role SPREAD-S within-cluster permutation) + the box
//       secondary + attack-face secondary + the {15 s} W_long sensitivity + the labelled P2↔P2b
//       decomposition; writes docs/world-model/data/stage3-v4-p2b-region-census.json (SHA'd, X-DET).
//   • BOUNDED PREFLIGHT — the full machinery on a toy corpus (both modes), OUTSIDE the repo
//     (the caps ⇒ IS_PREFLIGHT: NEVER writes the canonical JSON; verdict is NOT a verdict):
//       V4P2B_MODE=smoke  V4P2B_MATCH_CAP=4 V4P2B_MOMENT_CAP=3 \
//         V4P2B_OUT=/tmp/v4p2b-smoke.json   npx tsx scripts/probes/stage3-v4-p2b-region-hold.ts
//       V4P2B_MODE=census V4P2B_N=4 V4P2B_MATCH_CAP=4 V4P2B_MOMENT_CAP=3 \
//         V4P2B_OUT=/tmp/v4p2b-census.json  npx tsx scripts/probes/stage3-v4-p2b-region-hold.ts
//
// ENV KNOBS (preflight only; the two real runs touch only V4P2B_MODE and — census — V4P2B_N):
//   V4P2B_MODE      REQUIRED, 'smoke' | 'census' (no bare-invocation default — the #101.2
//                   improvement, ratified for P1 by #102: a silent wrong-corpus run is worse
//                   than an error).
//   V4P2B_N         REQUIRED in census (the census match count, pinned from the smoke knee
//                   rule; capped at N_max=800).
//   V4P2B_MATCH_CAP / V4P2B_MOMENT_CAP  cap matches / moments-per-match ⇒ IS_PREFLIGHT (never
//                   writes the canonical JSON; the verdict is not a verdict).
//   V4P2B_OUT       redirects output to a scratch path (required in principle for a preflight;
//                   when IS_PREFLIGHT and V4P2B_OUT is unset the output defaults to /tmp, NEVER
//                   the canonical file — a safety improvement over P1's operator-trust).
//   V4P2B_SKIP_DET  =1 skips the X-DET second whole-experiment run (preflight speed only).
//   V4P2B_SEED_BASE honored ONLY under a preflight cap (the real corpus family can never be
//                   shifted; the seed-disjointness gate reads the FROZEN constants).
//
// FLAGGED IMPLEMENTATION CHOICES (prereg §7 froze the FORM; #107 ratified the seven P2b calls;
// F1-F8 inherit P2 unamended EXCEPT where a P2b amendment (C1-C4) supersedes — each is surfaced
// in the run's `deviations` block):
//   C1  THE CONTAINMENT ENFORCEMENT (§2.1 / #107.2(i,ii,iii); supersedes the P2 statue at F1's seam):
//       the seam and resolve-and-freeze are P2's (Match.forcedStation, absolute target; Match.ts:626,
//       actionExecutor.ts:639-649). At t_fork the lattice candidate is resolved ONCE in the body's
//       own attack frame and its FROZEN region class R = depthBand D × folded-lateral band Λ is
//       computed (regionOf on the resolved target). Each hold tick the probe computes the body's
//       signed depth-into-R distance s(t) (min over the binding depth+lateral edges of the metres
//       inside, negative if outside any edge) and drives a Schmitt latch: engage (steering:=true)
//       iff s<0 (LEFT R), disengage (steering:=false) iff s≥HYSTERESIS_M=1.0 m; in [0,H) the latch
//       HOLDS (no chatter). While steering, forcedStation={gid,target:reentry(t),untilTick}; while
//       free, forcedStation=null (the body's own policy governs). reentry(t) = the nearest point of
//       R SHRUNK inward by H, clamping the body's own-frame coords into the shrunk band and mapping
//       back to absolute coords (localX·attackDir), PRESERVING sign(body.y) for wide (nearest wing,
//       no cross-pitch teleport) / toward centre for central — a "steer to the nearest boundary" law,
//       NOT the v3 ball-local policy and NOT P2's single fixed point.
//   C2  OCCUPANCY = FRACTION OF TICKS INSIDE R (§2.2 / #107.2(iv); supersedes F2's 2 m point test):
//       insideTicks counts inRegion(t) := depthOf(mine.localX(body.x))===D && lateralOf(body.y)===Λ
//       over the hold window / W_hold_ticks; ARRIVE_M is RETIRED from the estimand. OCC_FLOOR=0.5
//       KEPT UNCHANGED (the occupancy distribution is expected to shift UP — containment is easier
//       than point-arrival; the smoke re-measures, the census publishes the P2b-vs-P2 accounting;
//       a pile-up near 1.0 is a REPORTED observation, not a re-cut). The possession flip stays
//       NON-TERMINAL (eBallWon; hold continues through the turnover); terminal only on E-INJURY
//       (excluded), E-BALL-ARRIVAL (terminal-hold, admissible), E-ENDED (excluded) — all P2 verbatim.
//   C3  THE `free` DIAGNOSTIC TICK CLASS (§2.1 / #107.2(v)): on a FREE tick (steering=false, in-region)
//       there is no forced target, so P2's clamp-trace ok/eBarred/eOnside/unexplained branch is
//       INAPPLICABLE — such ticks are tallied under a new labelled class `free`. ePaused/eCarrier/
//       eBallWon/eSentOff still fire on free ticks (possession/injury-driven, not steering-driven).
//       Occupancy stays DECOUPLED from the per-tick class (P2 F2). A necessary consequence of the
//       enforcement change, not a re-design. Engage/disengage/steer/free latch counts are surfaced.
//   C4  THE N RULE = THE ATTAINABILITY KNEE (§2.3 / #107.2(vi); supersedes the pooled-MDL formula):
//       grid {50,100,…,800} (50-step, #105); inPower(N) = #cells whose (smoke admitted-pairs/match)·N
//       ≥ CELL_FLOOR=150; plateau = max over the grid; N = smallest grid N with inPower(N) ≥
//       0.95·plateau, capped at N_max=800. The pooled deep/box prices and σ̂ are RECORDED as labelled
//       context only (they no longer gate N). The smoke re-measures its OWN attainability curve.
//   F3  OUTCOMES read the P0b deep detector VERBATIM (oppOwns && teams[d].localX(ball.x) <
//       −REST_THIRD) and Match.inPenaltyBox for box, on the null→true entry transition; the
//       entry-transition prev-state is SEEDED from the shared fork-start state so only NEW
//       entries within W_long are counted (identical seeding in both arms ⇒ clean pairing).
//       Attack-face secondary = own (=d) entries FOR = the same detectors with d↔1−d swapped.
//   F4  ADMISSION excludes a PAIR iff the treated arm was E-INJURY or the fork ENDED within
//       W_long in EITHER arm (E-ENDED — match end is time-based ⇒ arms end together; the
//       stricter either-arm form also guards a truncated control), OR occupancy < OCC_FLOOR.
//       Non-admitted pairs PUBLISHED per cell with reason counts, NEVER pooled, NEVER zeroed.
//   F5  THE OWN-POSSESSION FACE (side=owner.side); V3-P1 sampleability predicate otherwise
//       verbatim (non-GK, non-carrier, non-sent-off, STATION-FAMILY action; stable rotation,
//       never proximity/role). MOMENT_SPACING_S=4.0, no per-match cap. Face fixed 'ours',
//       density DROPPED ⇒ context = ball-third only (§2.6 coarsening).
//   F6  THE SEPARATION STATISTIC = the V3-P1 SPREAD-S ported to BOTH axes. Role is a
//       MOMENT-level label ⇒ permuted at moment granularity within (match×context) blocks
//       (V3-P1 verbatim). Region is a per-FORK label (each candidate resolves its own region)
//       ⇒ permuted at fork granularity within (match×context) blocks. The in-power spread-cell
//       set is FIXED from the observed data (V3-P1 pattern) and held across permutations. BH
//       q=0.05 within EACH axis's computable family; Claim 2 fires iff a BH-significant spread
//       survives on ≥1 axis. Per-cell prices by cluster bootstrap (#20), never a CI on S.
//   F7  THE {15 s} W_long SENSITIVITY re-reads the DEEP price surface only (the gating unit),
//       on the SAME admitted set, over the first 15 s sub-window (labelled, non-gating; 45 s
//       EXCLUDED per #102.4). W_hold is not swept (it is the intervention).
//   F8  X-DET excludes the NON-deterministic wall-cost timing + the receipts ledger from the
//       canonical/SHA (V3-P1 pattern); the deterministic payload is computed twice and
//       asserted byte-identical. Wall-cost is measured on run 1 and attached OUTSIDE the SHA.
//   C5  THE LABELLED P2↔P2b COMPARISON READ (§2.5 / #107.2(vii)): the census embeds, per in-power
//       cell, the P2b price NEXT TO the P2 statue-price read from the committed P2 census JSON,
//       joined by (context, role, region). Δ_statue = price_P2b − price_P2 (the dynamism-loss the
//       containment removes). The P2 file's IDENTITY is its embedded X-DET content SHA-256
//       3f332a8e…24a9 (the `sha256` field; the whole-file hash differs by construction — the
//       content-hash-vs-file-hash disambiguation, #107.2(vii)). LABELLED, NON-GATING.

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { v2, type V2 } from '../../src/utils/vec';

// =============================================================================
// FROZEN STAGING (prereg §2 / §2.5 / §2.7 / §2.8 / §3) — pinned before any run.
// =============================================================================
// windows (§2.5): pinned to published P0 lag-bin edges; W_long=30 s MANDATED by #102.4.
const W_HOLD_S = 15;
const W_LONG_S = 30;
const W_SENS_S = 15; // the {15 s} W_long sensitivity (labelled, non-gating; 45 s EXCLUDED)
const W_HOLD_TICKS = Math.round(W_HOLD_S / DT); // 900
const W_LONG_TICKS = Math.round(W_LONG_S / DT); // 1800
const W_SENS_TICKS = Math.round(W_SENS_S / DT); // 900

// sampling (§2.2)
const MOMENT_SPACING_S = 4.0;
// C1/§2.1: the Schmitt-latch containment margin. ARRIVE_M is RETIRED (occupancy is now region
// membership, not a 2 m point test). HYSTERESIS_M = 1.0 m = ½·P2's ARRIVE_M, an INDEPENDENT
// constant: engage steering on exit (s<0), disengage at s≥H; at ~7 m/s off-ball speed 1 m ≈ 8-9
// ticks ⇒ the seam cannot chatter tick-to-tick, and 1 m ≪ every band half-width (central ≈ 10.15 m,
// mid depth band ≈ 21 m) so R is not materially shrunk.
const HYSTERESIS_M = 1.0;
const OCC_FLOOR = 0.5; // a fork admitted iff occupancy ≥ 0.5 and not E-INJURY/E-ENDED (§2.1/§2.2 unchanged)

// cells + floor (§2.6 / §2.7)
const CELL_FLOOR = 150; // in-power iff ≥ 150 admitted fork PAIRS (#24)

// the calibrated units (I3 / #102.2). ⭐ deep GATES (#103.3); box is the labelled secondary.
const CALIB_DEEP = 0.0435; // opponent deep entry → goal-value/event
const CALIB_BOX = 0.1952; // opponent box entry → goal-value/event (SECONDARY, never summed)
const GATING_UNIT = 'deep' as const; // ruling #103.3

// the standing lattice (§2.1 / §2.3 / v1/v3 verbatim): 18 candidates, ball-local attack frame.
const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
interface Candidate { readonly id: string; readonly dx: number; readonly dy: number }
const LATTICE: Candidate[] = [];
for (const r of RADII) {
  for (const a of ANGLES) {
    const rad = (a * Math.PI) / 180;
    LATTICE.push({
      id: `r${r}a${a}`,
      dx: Number((r * Math.cos(rad)).toFixed(9)),
      dy: Number((r * Math.sin(rad)).toFixed(9)),
    });
  }
}
const N_CAND = LATTICE.length; // 18
const CONTROL_ID = 'control';

// the detectors (§2.4; P0b concede channel verbatim)
const REST_THIRD = HALF_L / 3; // I5 own-third depth (P0b/P1 REST_THIRD)

// the frozen region classes (§2.3): depth × lateral, folded L/R (6 classes).
type Depth = 'deep' | 'mid' | 'high';
type Lateral = 'central' | 'wide';
const REGIONS: readonly string[] = [
  'deep-central', 'deep-wide', 'mid-central', 'mid-wide', 'high-central', 'high-wide',
];
const N_REGION = REGIONS.length; // 6
const regionIndex = (r: string): number => REGIONS.indexOf(r);
const depthOf = (localX: number): Depth => (localX < -REST_THIRD ? 'deep' : localX > REST_THIRD ? 'high' : 'mid');
const lateralOf = (y: number): Lateral => (Math.abs(y) <= HALF_W / 2 ? 'central' : 'wide');
const regionOf = (localXOfTarget: number, targetY: number): string => `${depthOf(localXOfTarget)}-${lateralOf(targetY)}`;

// C1/§2.1: the SIGNED depth-into-R distance s(t) in the body's own attack frame (s ≥ 0 ⇔ inside R).
// s = MIN over the binding depth and lateral edges of the metres inside that edge (negative if
// outside any edge). deep binds only the −REST_THIRD upper edge (inside ⇔ localX < −REST_THIRD);
// high only the +REST_THIRD lower edge; mid BOTH edges (the nearest binds). central binds the outer
// +HALF_W/2 folded edge (inside ⇔ |y| ≤ HALF_W/2); wide the inner HALF_W/2 edge (|y| ≥ HALF_W/2).
const signedDepthInto = (localX: number, D: Depth): number => (
  D === 'deep' ? -REST_THIRD - localX
    : D === 'high' ? localX - REST_THIRD
      : Math.min(localX + REST_THIRD, REST_THIRD - localX)
);
const signedLateralInto = (y: number, L: Lateral): number => (
  L === 'central' ? HALF_W / 2 - Math.abs(y) : Math.abs(y) - HALF_W / 2
);
// C1/§2.1: the re-entry own-frame coordinates — the nearest point of R SHRUNK inward by
// HYSTERESIS_M (delivering the body to s = HYSTERESIS_M, the disengage threshold). Depth: clamp
// localX into the shrunk band edges. Lateral: clamp |y| into the shrunk band, sign preserved by
// the caller (nearest wing for wide; toward centre for central).
const clamp = (v: number, lo: number, hi: number): number => (v < lo ? lo : v > hi ? hi : v);
const reentryLocalX = (localX: number, D: Depth): number => (
  D === 'deep' ? Math.min(localX, -REST_THIRD - HYSTERESIS_M)
    : D === 'high' ? Math.max(localX, REST_THIRD + HYSTERESIS_M)
      : clamp(localX, -REST_THIRD + HYSTERESIS_M, REST_THIRD - HYSTERESIS_M)
);
const reentryAbsY = (y: number, L: Lateral): number => {
  const ay = Math.abs(y);
  const cay = L === 'central' ? Math.min(ay, HALF_W / 2 - HYSTERESIS_M) : Math.max(ay, HALF_W / 2 + HYSTERESIS_M);
  const wing = y >= 0 ? 1 : -1; // preserve the body's CURRENT wing (no cross-pitch teleport); y=0 ⇒ +1
  return wing * cay;
};

// context (§2.6): ball-third only (face fixed 'ours', density dropped).
type Threat = 'ownThird' | 'middle' | 'theirThird';
const CONTEXTS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const N_CTX = CONTEXTS.length; // 3
const contextIndex = (c: Threat): number => CONTEXTS.indexOf(c);
const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

// role axis (§2.6): the forced body's TRUE own-state role; GK never sampled.
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];
const N_ROLE = ROLE_AXIS.length; // 4
const roleIndex = (r: Role): number => ROLE_AXIS.indexOf(r);

const N_CELLS = N_CTX * N_ROLE * N_REGION; // 72
const cellIdxOf = (ctxI: number, roleI: number, regI: number): number => (ctxI * N_ROLE + roleI) * N_REGION + regI;

// the V3-P1 STATION FAMILY (§2.1/§2.2)
const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

// statistics (§2.6 / §2.8) — new stats seeds (§2.4/#107.1), disjoint from P2's 99003/99103.
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 99_203; // per-cell match-cluster bootstrap (#20) — replaces P2's 99003
const PERM_B = 2000;
const PERMUTATION_SEED = 99_303; // region/role SPREAD-S within-cluster permutation (#80.2/I11) — replaces P2's 99103
const BH_Q = 0.05;

// seed families (§2.4; new bands 10.2M/10.3M — above every consumed range incl. P2's 10.0M/10.1M).
const SMOKE_SEED_BASE = 10_200_000; // smoke: 10,200,000 + k, k∈0..39 (sizing only)
const SMOKE_MATCHES = 40;
const CENSUS_SEED_BASE = 10_300_000; // census: 10,300,000 + k, k∈0..N−1 (N ≤ 800 ⇒ ≤ 10,300,799)
const N_MAX = 800; // the frozen COST cap (§2.3; inherited from P2)
const PRIOR_SEED_CEIL = 9_999_999; // every pre-P2 match-seed family (P0/P0b/P1/V3) is ≤ this
// P2's CONSUMED bands (§2.4): the disjointness gate now also asserts disjointness from these.
const P2_SMOKE_RANGE: readonly [number, number] = [10_000_000, 10_000_039];
const P2_CENSUS_RANGE: readonly [number, number] = [10_100_000, 10_100_799];
const PRIOR_STATS_SEEDS = [98_003, 98_203, 98_103, 97_003, 97_103, 91_110, 99_003, 99_103]; // incl. P2's 99003/99103 (§2.4)

// C4/§2.3: the attainability-knee N rule (the pooled-MDL formula is RETIRED, #105).
const KNEE_STEP = 50; // the 50-match grid step (#105)
const KNEE_PLATEAU_FRAC = 0.95; // N = smallest grid N with inPower(N) ≥ 0.95·plateau

// C5/§2.5: the committed P2 census the comparison read joins against (LABELLED, NON-GATING).
const P2_CENSUS_PATH = 'docs/world-model/data/stage3-v4-p2-occupancy-census.json';
// the P2 file's IDENTITY = its embedded X-DET content SHA-256 (the `sha256` field; the whole-file
// hash differs by construction — the content-hash-vs-file-hash disambiguation, #107.2(vii)).
const P2_EXPECTED_CONTENT_SHA = '3f332a8e35ef341c84c5dbf83157be050dae401dff9e4b52242624ac0f7d24a9';

// the ENRICHED census world (#67.3, verbatim from the P0/P0b/P1 probes) — stationEye NULL.
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// X-SRC-ZERO — the frozen shipped-world production fingerprint (P0b/P1 verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

const RECEIPT_CAP = 1000; // per-class receipts cap (#49.3), first-N deterministic

// =============================================================================
// ENV / MODE (prereg §8). Two REAL modes; a bounded preflight caps either.
// =============================================================================
const MODE = process.env.V4P2B_MODE;
if (MODE !== 'smoke' && MODE !== 'census') {
  console.error('V4-P2b FATAL — V4P2B_MODE must be "smoke" or "census" (see the header command lines).');
  process.exit(2);
}
const MATCH_CAP = process.env.V4P2B_MATCH_CAP ? Math.max(1, Number.parseInt(process.env.V4P2B_MATCH_CAP, 10)) : Number.POSITIVE_INFINITY;
const MOMENT_CAP = process.env.V4P2B_MOMENT_CAP ? Math.max(1, Number.parseInt(process.env.V4P2B_MOMENT_CAP, 10)) : Number.POSITIVE_INFINITY;
const IS_PREFLIGHT = Number.isFinite(MATCH_CAP) || Number.isFinite(MOMENT_CAP);
const SKIP_DET = process.env.V4P2B_SKIP_DET === '1';
const N_ENV = process.env.V4P2B_N ? Math.max(1, Number.parseInt(process.env.V4P2B_N, 10)) : null;
if (MODE === 'census' && N_ENV === null) {
  console.error('V4-P2b FATAL — census mode requires V4P2B_N (the census match count pinned from the smoke knee rule).');
  process.exit(2);
}
const N_CENSUS = MODE === 'census' ? Math.min(N_ENV as number, N_MAX) : 0; // cap at N_max (§2.3)
const FROZEN_BASE = MODE === 'smoke' ? SMOKE_SEED_BASE : CENSUS_SEED_BASE;
// V4P2B_SEED_BASE is honored ONLY under a preflight cap — the real corpus family cannot be shifted.
const SEED_BASE = (IS_PREFLIGHT && process.env.V4P2B_SEED_BASE)
  ? Math.max(0, Number.parseInt(process.env.V4P2B_SEED_BASE, 10)) : FROZEN_BASE;
const PLANNED_MATCHES = MODE === 'smoke' ? SMOKE_MATCHES : N_CENSUS;
const MATCH_COUNT = Number.isFinite(MATCH_CAP) ? Math.min(PLANNED_MATCHES, MATCH_CAP) : PLANNED_MATCHES;
const SMOKE_OUT = 'docs/world-model/data/stage3-v4-p2b-sizing-smoke.json';
const CENSUS_OUT = 'docs/world-model/data/stage3-v4-p2b-region-census.json';
// SAFETY: a preflight NEVER writes the canonical JSON unless the operator explicitly sets V4P2B_OUT.
const OUT_PATH = process.env.V4P2B_OUT
  ?? (IS_PREFLIGHT ? '/tmp/v4p2b-preflight.json' : (MODE === 'smoke' ? SMOKE_OUT : CENSUS_OUT));

// =============================================================================
// C5/§2.5 — the committed P2 census, read ONCE (deterministic; identity = its embedded content SHA).
// The comparison read joins the P2 STATUE price per (context, role, region). LABELLED, NON-GATING:
// a missing/unreadable file degrades to `available:false` (never crashes the run, never gates).
// =============================================================================
interface P2PriorCell { deep: { point: number; lower: number | null; upper: number | null; n: number; excludesZero?: boolean }; box: { point: number; lower: number | null; upper: number | null; n: number }; sens15: number }
const loadP2Prior = (): {
  available: boolean; path: string; observedContentSha: string | null; expectedContentSha: string;
  contentShaMatches: boolean; cellsRead: number; map: Map<string, P2PriorCell>; note?: string;
} => {
  try {
    const parsed = JSON.parse(readFileSync(P2_CENSUS_PATH, 'utf8')) as {
      sha256?: string; result?: { census?: { priceSurface?: Array<Record<string, unknown>> } };
    };
    const observedSha = typeof parsed.sha256 === 'string' ? parsed.sha256 : null;
    const surface = parsed.result?.census?.priceSurface ?? [];
    const map = new Map<string, P2PriorCell>();
    for (const c of surface) {
      map.set(`${c.context as string}|${c.role as string}|${c.region as string}`, {
        deep: c.deepPriceGATING as P2PriorCell['deep'], box: c.boxPriceSECONDARY as P2PriorCell['box'],
        sens15: c.sensitivity15sDeep as number,
      });
    }
    return {
      available: true, path: P2_CENSUS_PATH, observedContentSha: observedSha,
      expectedContentSha: P2_EXPECTED_CONTENT_SHA, contentShaMatches: observedSha === P2_EXPECTED_CONTENT_SHA,
      cellsRead: map.size, map,
    };
  } catch (e) {
    return {
      available: false, path: P2_CENSUS_PATH, observedContentSha: null,
      expectedContentSha: P2_EXPECTED_CONTENT_SHA, contentShaMatches: false, cellsRead: 0, map: new Map(),
      note: `P2 census unreadable (${(e as Error).message}) — comparison read SKIPPED (labelled, non-gating)`,
    };
  }
};
const P2_PRIOR = loadP2Prior();

// =============================================================================
// SMALL NUMERIC HELPERS (P0b/P1/V3-P1 verbatim where shared).
// =============================================================================
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const pct = (sorted: readonly number[], q: number): number => (sorted.length === 0
  ? Number.NaN
  : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
// sample standard deviation (n−1) over the finite values (the V4-P1 D7 sizing σ̂).
const sampleSd = (xs: readonly number[]): number => {
  const f = xs.filter(Number.isFinite);
  if (f.length < 2) return Number.NaN;
  const m = f.reduce((s, x) => s + x, 0) / f.length;
  const v = f.reduce((s, x) => s + (x - m) * (x - m), 0) / (f.length - 1);
  return Math.sqrt(v);
};

// --- per-record receipts (#49.3), capped, first-N deterministic --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook | null, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  if (book === null) return;
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// --- the standing exception classes (§2.1; eSentOff = E-INJURY family) --------
interface Exceptions {
  ok: number;         // STEERING tick, clamp landed exactly on the re-entry target (C1/C3)
  free: number;       // C3/§2.1: FREE (non-steering) in-region tick — no forced target (the intended behaviour)
  ePaused: number;    // E-PHASE (non-terminal, hold suspended)
  eBallWon: number;   // E-POSSESSION-FLIP (non-terminal, hold CONTINUES) — per opp-owned hold tick
  eBarred: number;    // E-BARRED (clamp wins) — steering ticks only (C3)
  eOnside: number;    // E-ONSIDE (clamp wins) — steering ticks only (C3)
  eCarrier: number;   // E-BALL-ARRIVAL (terminal hold, admissible) — once/fork
  eSentOff: number;   // E-INJURY (terminal, pair EXCLUDED) — once/fork
  eEnded: number;     // E-ENDED (terminal, pair EXCLUDED) — once/fork
  unexplained: number; // residual clamp miss (steering ticks only) — investigated if nonzero
}
const newExceptions = (): Exceptions => ({
  ok: 0, free: 0, ePaused: 0, eBallWon: 0, eBarred: 0, eOnside: 0, eCarrier: 0, eSentOff: 0, eEnded: 0, unexplained: 0,
});

// C3/§2.1: the Schmitt-latch diagnostics (engage/disengage transitions; per-tick steer/free counts).
interface LatchStats { engage: number; disengage: number; steerTicks: number; freeTicks: number }
const newLatch = (): LatchStats => ({ engage: 0, disengage: 0, steerTicks: 0, freeTicks: 0 });

// =============================================================================
// THE ENRICHED MATCH FIXTURE (= the census world; P0b/P1 verbatim). Eye NULL.
// =============================================================================
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS,
});

// the harness-identity signature (V3-P1 verbatim) — for X-FORK-IDENT.
const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// =============================================================================
// ONE FORK (§2.1 / C1-C3) — REGION-CONTAINMENT fork-and-hold + long-horizon outcome read.
//   cand === null  ⇒ the CONTROL arm (no forcing; a pure step-through + observation) —
//                    its W_long signature is the X-FORK-IDENT target.
// The treated arm resolves `cand` ONCE at t_fork to its FROZEN region class R = D × Λ. Each hold
// tick it computes s(t) (signed depth-into-R) and drives a Schmitt latch: FREE while inside R
// (forcedStation=null, the body's own policy governs), STEER back toward reentry(t) (the nearest
// point of R shrunk by HYSTERESIS_M, on the current wing) once it LEAVES R — released again the
// instant it is safely back inside (s≥H). Occupancy = fraction of hold ticks INSIDE R (§2.2). It
// reads deep/box entries (against d + own FOR) over W_long at the 15 s and 30 s cutoffs.
// =============================================================================
interface ForkResult {
  readonly region: string;          // resolved region class (treated); '' for control
  readonly occupancy: number;       // insideTicks(inRegion) / W_hold_ticks (NaN for control)
  readonly injury: boolean;         // E-INJURY (forced body sent off mid-window)
  readonly carrier: boolean;        // E-BALL-ARRIVAL (held body became the carrier)
  readonly ended: boolean;          // E-ENDED (fork finished within W_long)
  readonly deepAgainst15: number; readonly deepAgainst30: number;
  readonly boxAgainst15: number; readonly boxAgainst30: number;
  readonly deepFor30: number; readonly boxFor30: number; // attack-face secondary (own FOR)
  readonly signature: string;       // W_long signature (control arm ⇒ X-FORK-IDENT)
}

const runFork = (
  before: Match, gid: number, side: Side, cand: Candidate | null, x6: Exceptions,
  latch: LatchStats, seed: number, decisionTick: number, receipts: ReceiptBook | null,
): ForkResult => {
  const fork = cloneSimulationState(before);
  const body = fork.allPlayers.find((p) => p.gid === gid)!;
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const d = side; // holder's side; opponent = 1 − d
  const startTick = fork.simTick;
  const holdUntilTick = startTick + W_HOLD_TICKS;

  // C1/§2.1: resolve-and-freeze the held REGION CLASS ONCE at t_fork (own attack frame; incumbent
  // nowhere). The frozen point itself is discarded — P2b holds the region R = D × Λ, not a point.
  let region = '';
  let regionDepth: Depth = 'mid';
  let regionLat: Lateral = 'central';
  if (cand !== null) {
    const target = v2(fork.ball.pos.x + mine.attackDir * cand.dx, fork.ball.pos.y + cand.dy);
    regionDepth = depthOf(mine.localX(target.x));
    regionLat = lateralOf(target.y);
    region = `${regionDepth}-${regionLat}`;
  }

  // F3: seed the entry-transition prev-state from the SHARED fork-start state so only NEW
  // entries within W_long count (identical seeding across arms ⇒ clean paired difference).
  const ballAtStart = fork.ball;
  const ownerAtStart = ballAtStart.owner;
  const oppOwnsStart = ownerAtStart !== null && ownerAtStart.side !== d;
  const meOwnsStart = ownerAtStart !== null && ownerAtStart.side === d;
  let deepAgPrev = oppOwnsStart && fork.phase === 'playing' && mine.localX(ballAtStart.pos.x) < -REST_THIRD;
  let boxAgPrev = oppOwnsStart && fork.phase === 'playing' && fork.inPenaltyBox(ballAtStart.pos, d);
  let deepForPrev = meOwnsStart && fork.phase === 'playing' && theirs.localX(ballAtStart.pos.x) < -REST_THIRD;
  let boxForPrev = meOwnsStart && fork.phase === 'playing' && fork.inPenaltyBox(ballAtStart.pos, 1 - d as Side);

  let deepAg15 = 0; let deepAg30 = 0; let boxAg15 = 0; let boxAg30 = 0;
  let deepFor30 = 0; let boxFor30 = 0;
  let insideTicks = 0;
  let injury = false; let carrier = false; let ended = false;
  let holdEnded = false; // set on E-INJURY / E-BALL-ARRIVAL (stop asserting the hold)
  let steering = false;  // C1/§2.1: the Schmitt latch — init FREE (false); the body starts inside R

  while (!fork.finished && fork.simTick - startTick < W_LONG_TICKS) {
    const inHold = cand !== null && !holdEnded && fork.simTick < holdUntilTick;

    // pre-step reads (clamps evaluate off the PRE-step world — V3-P1 §4.6b).
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;
    const rBefore = fork.restart;
    const barredBefore = (rBefore?.kind === 'goalKick' && rBefore.side !== side)
      || theirs.goalkeeper.gkHoldTimer > 0 || theirs.goalkeeper.gkDistributing;
    const onsideBefore = ownerBefore !== null && ownerBefore.side === side && ownerBefore !== body;

    // C1/§2.1: the CONTAINMENT ENFORCEMENT — drive the Schmitt latch off the body's PRE-step
    // own-frame position, then set the seam (steer to reentry(t)) or release it (FREE).
    let steeringThisTick = false;
    if (inHold) {
      const lx = mine.localX(body.pos.x);
      const s = Math.min(signedDepthInto(lx, regionDepth), signedLateralInto(body.pos.y, regionLat));
      if (!steering && s < 0) { steering = true; latch.engage += 1; }               // body LEFT R
      else if (steering && s >= HYSTERESIS_M) { steering = false; latch.disengage += 1; } // safely back inside
      // in the band s ∈ [0, HYSTERESIS_M) the latch HOLDS (no chatter).
      steeringThisTick = steering;
      if (steering) {
        // reentry(t): nearest point of R shrunk inward by H, on the body's CURRENT wing, in ABS coords.
        const reTarget = v2(reentryLocalX(lx, regionDepth) * mine.attackDir, reentryAbsY(body.pos.y, regionLat));
        fork.forcedStation = { gid, target: reTarget, untilTick: holdUntilTick };
        latch.steerTicks += 1;
      } else {
        fork.forcedStation = null; // FREE: the body's own policy governs
        latch.freeTicks += 1;
      }
    } else if (cand !== null) {
      fork.forcedStation = null; // treated, post-hold: release (control never sets it)
    }

    fork.step(DT);

    // --- hold classification + occupancy (treated arm, hold ticks only) ---
    if (inHold) {
      // C2/§2.2: occupancy = ticks INSIDE the frozen region class R (region membership, POST-step).
      if (depthOf(mine.localX(body.pos.x)) === regionDepth && lateralOf(body.pos.y) === regionLat) insideTicks += 1;
      const cause = cand!.id;
      const nowOwner = fork.ball.owner;
      if (body.sentOff) {
        x6.eSentOff += 1; injury = true; holdEnded = true;
        if (receipts) addReceipt(receipts, 'eSentOff', seed, decisionTick, gid, cause);
      } else if (pausedBefore || fork.phase !== 'playing') {
        x6.ePaused += 1;
        if (receipts) addReceipt(receipts, 'ePaused', seed, decisionTick, gid, cause);
      } else if (ownerBefore === body || nowOwner === body) {
        x6.eCarrier += 1; carrier = true; holdEnded = true;
        if (receipts) addReceipt(receipts, 'eCarrier', seed, decisionTick, gid, cause);
      } else if (nowOwner !== null && nowOwner.side !== side) {
        // E-POSSESSION-FLIP: opponent has the ball while the body holds (non-terminal).
        x6.eBallWon += 1;
        if (receipts) addReceipt(receipts, 'eBallWon', seed, decisionTick, gid, cause);
      } else if (!steeringThisTick) {
        // C3/§2.1: FREE (null-seam) in-region tick — no forced target ⇒ P2's clamp-trace branch is
        // inapplicable; the intended free-movement behaviour is tallied under the `free` class.
        x6.free += 1;
      } else {
        // STEERING tick: the clamp-trace branch applies exactly as P2 (a forced target was set).
        const tr = body.c4Trace;
        if (tr !== null && Math.abs(tr.applied.x - tr.meet.x) <= 1e-9 && Math.abs(tr.applied.y - tr.meet.y) <= 1e-9) {
          x6.ok += 1;
        } else if (barredBefore) {
          x6.eBarred += 1;
          if (receipts) addReceipt(receipts, 'eBarred', seed, decisionTick, gid, cause);
        } else if (onsideBefore) {
          x6.eOnside += 1;
          if (receipts) addReceipt(receipts, 'eOnside', seed, decisionTick, gid, cause);
        } else {
          x6.unexplained += 1;
          if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${cause}:clampMiss`);
        }
      }
    }

    // --- long-horizon outcome read (both arms), null→true entry transitions ---
    const offset = fork.simTick - startTick;
    const playing = fork.phase === 'playing';
    const owner = fork.ball.owner;
    const oppOwns = owner !== null && owner.side !== d;
    const meOwns = owner !== null && owner.side === d;
    // opponent deep/box entries AGAINST d (the price)
    const deepAgNow = oppOwns && playing && mine.localX(fork.ball.pos.x) < -REST_THIRD;
    if (deepAgNow && !deepAgPrev) { deepAg30 += 1; if (offset <= W_SENS_TICKS) deepAg15 += 1; }
    deepAgPrev = deepAgNow;
    const boxAgNow = oppOwns && playing && fork.inPenaltyBox(fork.ball.pos, d);
    if (boxAgNow && !boxAgPrev) { boxAg30 += 1; if (offset <= W_SENS_TICKS) boxAg15 += 1; }
    boxAgPrev = boxAgNow;
    // own deep/box entries FOR d (the attack-face opportunity cost) — detectors with d↔1−d.
    const deepForNow = meOwns && playing && theirs.localX(fork.ball.pos.x) < -REST_THIRD;
    if (deepForNow && !deepForPrev) deepFor30 += 1;
    deepForPrev = deepForNow;
    const boxForNow = meOwns && playing && fork.inPenaltyBox(fork.ball.pos, 1 - d as Side);
    if (boxForNow && !boxForPrev) boxFor30 += 1;
    boxForPrev = boxForNow;

    if (fork.finished) ended = true;
  }
  if (cand !== null) fork.forcedStation = null;
  if (ended) {
    x6.eEnded += 1;
    if (receipts && cand !== null) addReceipt(receipts, 'eEnded', seed, decisionTick, gid, cand.id);
  }

  return {
    region,
    occupancy: cand === null ? Number.NaN : insideTicks / W_HOLD_TICKS,
    injury, carrier, ended,
    deepAgainst15: deepAg15, deepAgainst30: deepAg30, boxAgainst15: boxAg15, boxAgainst30: boxAg30,
    deepFor30, boxFor30,
    signature: signatureOf(fork),
  };
};

// =============================================================================
// THE RAW COLLECTION (both modes run the same instrument; the summarizers differ).
// =============================================================================
interface PairRec {
  clusterIdx: number; momentIdx: number; ctxI: number; roleI: number; regI: number;
  priceDeep: number; priceBox: number; priceDeep15: number; ownDeep: number; ownBox: number;
}
interface MomentMeta { clusterIdx: number; ctxI: number; roleI: number }
interface CellCounts { admitted: number; exInjury: number; exEnded: number; exLowOcc: number }
interface OccStats { hist: number[]; n: number; sum: number; sumsq: number; min: number; max: number; admitted: number; excludedLowOcc: number }

interface RawOut {
  pairs: PairRec[];
  moments: MomentMeta[];
  cellCounts: CellCounts[];              // length N_CELLS
  perClusterDeep: { sum: number; n: number }[];   // per match: pooled deep hold-price
  perClusterBox: { sum: number; n: number }[];
  perClusterMoments: number[];
  x6: Exceptions;
  latch: LatchStats;   // C3/§2.1: the Schmitt-latch diagnostics, aggregated over treated forks
  receipts: ReceiptBook;
  occ: OccStats;
  coverage: {
    matchesRun: number; qualifying: number; moments: number; clonesTaken: number;
    momentsForked: number; noPool: number; ballDirectedSkipped: number;
    forks: number; xForkChecked: number; xForkMismatched: number;
    admittedPairs: number; excludedPairs: number;
  };
}

const OCC_BINS = 20; // histogram of occupancy over [0,1] in 0.05-wide bins
const newOcc = (): OccStats => ({ hist: new Array(OCC_BINS + 1).fill(0), n: 0, sum: 0, sumsq: 0, min: Infinity, max: -Infinity, admitted: 0, excludedLowOcc: 0 });
const pushOcc = (o: OccStats, v: number): void => {
  if (!Number.isFinite(v)) return;
  o.n += 1; o.sum += v; o.sumsq += v * v;
  if (v < o.min) o.min = v; if (v > o.max) o.max = v;
  const b = Math.min(OCC_BINS, Math.max(0, Math.floor(v / (1 / OCC_BINS))));
  o.hist[b] += 1;
};

const runInstrument = (withReceipts: boolean): RawOut => {
  const out: RawOut = {
    pairs: [], moments: [],
    cellCounts: Array.from({ length: N_CELLS }, () => ({ admitted: 0, exInjury: 0, exEnded: 0, exLowOcc: 0 })),
    perClusterDeep: [], perClusterBox: [], perClusterMoments: [],
    x6: newExceptions(), latch: newLatch(), receipts: {}, occ: newOcc(),
    coverage: {
      matchesRun: 0, qualifying: 0, moments: 0, clonesTaken: 0, momentsForked: 0,
      noPool: 0, ballDirectedSkipped: 0, forks: 0, xForkChecked: 0, xForkMismatched: 0,
      admittedPairs: 0, excludedPairs: 0,
    },
  };
  const receipts = withReceipts ? out.receipts : null;

  for (let k = 0; k < MATCH_COUNT; k++) {
    const seed = SEED_BASE + k;
    const clusterIdx = k;
    const m = matchOf(seed);
    out.coverage.matchesRun += 1;
    out.perClusterDeep.push({ sum: 0, n: 0 });
    out.perClusterBox.push({ sum: 0, n: 0 });
    out.perClusterMoments.push(0);
    let lastMomentTime = -Infinity;
    let rotation = 0;
    let momentsThisMatch = 0;

    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      out.coverage.qualifying += 1;
      lastMomentTime = m.simTime; // V3-P0/P1 placement: reset on EVERY qualifying moment

      // F5: OWN-POSSESSION FACE — side = owner.side (no face alternation).
      const side = owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { out.coverage.noPool += 1; m.step(DT); continue; }
      // stable rotation (never proximity, never role); advance even on skips.
      const body = pool[rotation % pool.length];
      rotation += 1;
      if (!STATION_FAMILY.has(body.action.type)) { out.coverage.ballDirectedSkipped += 1; m.step(DT); continue; }

      if (momentsThisMatch >= MOMENT_CAP) { m.step(DT); continue; } // preflight cap only

      const ctxI = contextIndex(localXBand(mine.localX(m.ball.pos.x)));
      const roleI = roleIndex(body.role as Role);
      const momentIdx = out.moments.length;
      out.moments.push({ clusterIdx, ctxI, roleI });
      const clone = cloneSimulationState(m);
      out.coverage.clonesTaken += 1;
      out.coverage.momentsForked += 1;
      out.coverage.moments += 1;
      out.perClusterMoments[clusterIdx] += 1;
      momentsThisMatch += 1;
      const decisionTick = m.simTick;

      // the control arm (shared across all 18 candidates) + the 18 held candidates.
      const control = runFork(clone, body.gid, side, null, out.x6, out.latch, seed, decisionTick, receipts);
      out.coverage.forks += 1;

      // X-FORK-IDENT (§2.1, HARD, 100% coverage): control W_long signature == an INDEPENDENT
      // plain step-through of the same clone over W_long.
      const plain = cloneSimulationState(clone);
      for (let i = 0; i < W_LONG_TICKS && !plain.finished; i++) plain.step(DT);
      out.coverage.xForkChecked += 1;
      if (signatureOf(plain) !== control.signature) out.coverage.xForkMismatched += 1;

      for (const cand of LATTICE) {
        const treated = runFork(clone, body.gid, side, cand, out.x6, out.latch, seed, decisionTick, receipts);
        out.coverage.forks += 1;
        const regI = regionIndex(treated.region);
        const cellIdx = cellIdxOf(ctxI, roleI, regI);
        const cc = out.cellCounts[cellIdx];
        pushOcc(out.occ, treated.occupancy);
        // ADMISSION (F4): exclude on E-INJURY (treated), E-ENDED (either arm), occupancy < floor.
        if (treated.injury) { cc.exInjury += 1; out.coverage.excludedPairs += 1; continue; }
        if (treated.ended || control.ended) { cc.exEnded += 1; out.coverage.excludedPairs += 1; continue; }
        if (!(treated.occupancy >= OCC_FLOOR)) { cc.exLowOcc += 1; out.occ.excludedLowOcc += 1; out.coverage.excludedPairs += 1; continue; }
        out.occ.admitted += 1;
        cc.admitted += 1;
        out.coverage.admittedPairs += 1;
        // the paired price (goal-value SAVED by holding); >0 ⇔ holding reduces opp entries.
        const priceDeep = -(treated.deepAgainst30 - control.deepAgainst30) * CALIB_DEEP;
        const priceBox = -(treated.boxAgainst30 - control.boxAgainst30) * CALIB_BOX;
        const priceDeep15 = -(treated.deepAgainst15 - control.deepAgainst15) * CALIB_DEEP;
        const ownDeep = (treated.deepFor30 - control.deepFor30) * CALIB_DEEP; // opportunity cost (labelled)
        const ownBox = (treated.boxFor30 - control.boxFor30) * CALIB_BOX;
        out.pairs.push({ clusterIdx, momentIdx, ctxI, roleI, regI, priceDeep, priceBox, priceDeep15, ownDeep, ownBox });
        out.perClusterDeep[clusterIdx].sum += priceDeep; out.perClusterDeep[clusterIdx].n += 1;
        out.perClusterBox[clusterIdx].sum += priceBox; out.perClusterBox[clusterIdx].n += 1;
      }
    }
  }
  return out;
};

// =============================================================================
// STATISTICS — the per-cell match-cluster bootstrap (#20, BOOTSTRAP_SEED=99003).
// =============================================================================
// units = per-cluster {sum, n} over ALL clusters (zeros incl.); stat = Σsum/Σn.
const clusterCIfromPerCluster = (
  sumArr: readonly number[], cntArr: readonly number[], offset: number,
): { point: number; lower: number; upper: number; n: number } => {
  const nClusters = sumArr.length;
  let totS = 0; let totN = 0;
  for (let i = 0; i < nClusters; i++) { totS += sumArr[i]; totN += cntArr[i]; }
  const point = totN === 0 ? Number.NaN : totS / totN;
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0; let n = 0;
    for (let i = 0; i < nClusters; i++) { const c = rng.int(0, nClusters - 1); s += sumArr[c]; n += cntArr[c]; }
    if (n > 0) draws.push(s / n);
  }
  draws.sort((a, b) => a - b);
  return { point: round(point), lower: round(pct(draws, 0.025)), upper: round(pct(draws, 0.975)), n: totN };
};

// =============================================================================
// THE SEPARATION SPREAD-S (§2.6 / F6) — within-cluster label permutation on BOTH axes.
// role = a MOMENT label (permuted at moment granularity); region = a per-FORK label
// (permuted at fork granularity); both blocked within (match × context); the in-power
// spread-cell set is FIXED from the observed data. Per-cell prices by bootstrap (never a
// CI on S). Deep-converted prices ONLY (the gating unit, #103.3).
// =============================================================================
interface SpreadCell {
  context: Threat; axis: 'region' | 'role'; heldFixed: string;
  levels: string[]; values: number[]; S: number; argMax: string; argMin: string;
  permGE: number; permP: number; resolved: boolean; resolvedBH: boolean;
}
const bhReject = (ps: number[], q: number): boolean[] => {
  const M = ps.length;
  const order = ps.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  let kStar = -1;
  for (let rank = 0; rank < M; rank++) if (order[rank].p <= ((rank + 1) / M) * q) kStar = rank;
  const rej = new Array(M).fill(false);
  if (kStar >= 0) { const thr = order[kStar].p; for (let i = 0; i < M; i++) if (ps[i] <= thr) rej[i] = true; }
  return rej;
};

const computeSeparation = (raw: RawOut) => {
  const pairs = raw.pairs; const moments = raw.moments;
  const nPairs = pairs.length; const nMoments = moments.length;

  // typed arrays for the hot permutation loop
  const pCtx = new Int8Array(nPairs); const pReg = new Int8Array(nPairs);
  const pMoment = new Int32Array(nPairs); const pRoleObs = new Int8Array(nPairs);
  const pPrice = new Float64Array(nPairs); const pCluster = new Int32Array(nPairs);
  for (let i = 0; i < nPairs; i++) {
    const pr = pairs[i];
    pCtx[i] = pr.ctxI; pReg[i] = pr.regI; pMoment[i] = pr.momentIdx;
    pRoleObs[i] = pr.roleI; pPrice[i] = pr.priceDeep; pCluster[i] = pr.clusterIdx;
  }
  const mCtx = new Int8Array(nMoments); const mRole = new Int8Array(nMoments); const mCluster = new Int32Array(nMoments);
  for (let i = 0; i < nMoments; i++) { mCtx[i] = moments[i].ctxI; mRole[i] = moments[i].roleI; mCluster[i] = moments[i].clusterIdx; }

  // observed cell sums → prices → in-power set
  const obsSum = new Float64Array(N_CELLS); const obsCnt = new Int32Array(N_CELLS);
  for (let i = 0; i < nPairs; i++) { const c = cellIdxOf(pCtx[i], pRoleObs[i], pReg[i]); obsSum[c] += pPrice[i]; obsCnt[c] += 1; }
  const priceOf = (sum: Float64Array, cnt: Int32Array, c: number): number => (cnt[c] > 0 ? sum[c] / cnt[c] : Number.NaN);
  const inPower = new Uint8Array(N_CELLS);
  for (let c = 0; c < N_CELLS; c++) inPower[c] = obsCnt[c] >= CELL_FLOOR ? 1 : 0;

  // computable spread cells (fixed from observed in-power set)
  interface Comp { ctxI: number; axis: 'region' | 'role'; heldI: number; levelIdx: number[]; Sobs: number; permGE: number; }
  const comps: Comp[] = [];
  const rangeOver = (sum: Float64Array, cnt: Int32Array, cells: number[]): number => {
    let lo = Infinity; let hi = -Infinity; let k = 0;
    for (const c of cells) { const v = priceOf(sum, cnt, c); if (Number.isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; k += 1; } }
    return k >= 2 ? hi - lo : Number.NaN;
  };
  // ROLE axis: per (context, region), spread over in-power roles.
  for (let ctxI = 0; ctxI < N_CTX; ctxI++) {
    for (let regI = 0; regI < N_REGION; regI++) {
      const roleCells = [] as number[]; const roles = [] as number[];
      for (let roleI = 0; roleI < N_ROLE; roleI++) { const c = cellIdxOf(ctxI, roleI, regI); if (inPower[c]) { roleCells.push(c); roles.push(roleI); } }
      if (roleCells.length >= 2) comps.push({ ctxI, axis: 'role', heldI: regI, levelIdx: roleCells, Sobs: rangeOver(obsSum, obsCnt, roleCells), permGE: 0 });
    }
  }
  // REGION axis: per (context, role), spread over in-power regions.
  for (let ctxI = 0; ctxI < N_CTX; ctxI++) {
    for (let roleI = 0; roleI < N_ROLE; roleI++) {
      const regCells = [] as number[];
      for (let regI = 0; regI < N_REGION; regI++) { const c = cellIdxOf(ctxI, roleI, regI); if (inPower[c]) regCells.push(c); }
      if (regCells.length >= 2) comps.push({ ctxI, axis: 'region', heldI: roleI, levelIdx: regCells, Sobs: rangeOver(obsSum, obsCnt, regCells), permGE: 0 });
    }
  }

  // permutation blocks (match × context)
  const roleBlocks = new Map<number, number[]>();
  for (let i = 0; i < nMoments; i++) { const key = mCluster[i] * N_CTX + mCtx[i]; (roleBlocks.get(key) ?? roleBlocks.set(key, []).get(key)!).push(i); }
  const regBlocks = new Map<number, number[]>();
  for (let i = 0; i < nPairs; i++) { const key = pCluster[i] * N_CTX + pCtx[i]; (regBlocks.get(key) ?? regBlocks.set(key, []).get(key)!).push(i); }
  const roleBlockList = [...roleBlocks.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);
  const regBlockList = [...regBlocks.entries()].sort((a, b) => a[0] - b[0]).map(([, v]) => v);

  const roleAxisComps = comps.filter((c) => c.axis === 'role');
  const regAxisComps = comps.filter((c) => c.axis === 'region');
  const permSum = new Float64Array(N_CELLS); const permCnt = new Int32Array(N_CELLS);
  const permMomentRole = new Int8Array(nMoments); const permPairReg = new Int8Array(nPairs);
  const roleRng = new Rng(PERMUTATION_SEED);
  const regRng = new Rng(PERMUTATION_SEED + 1);

  for (let b = 0; b < PERM_B; b++) {
    // --- ROLE axis permutation (moment-granularity within match×context) ---
    for (let i = 0; i < nMoments; i++) permMomentRole[i] = mRole[i];
    for (const block of roleBlockList) {
      for (let j = block.length - 1; j > 0; j--) { const t = roleRng.int(0, j); const tmp = permMomentRole[block[j]]; permMomentRole[block[j]] = permMomentRole[block[t]]; permMomentRole[block[t]] = tmp; }
    }
    permSum.fill(0); permCnt.fill(0);
    for (let i = 0; i < nPairs; i++) { const c = cellIdxOf(pCtx[i], permMomentRole[pMoment[i]], pReg[i]); permSum[c] += pPrice[i]; permCnt[c] += 1; }
    for (const comp of roleAxisComps) { const s = rangeOver(permSum, permCnt, comp.levelIdx); if (Number.isFinite(s) && Number.isFinite(comp.Sobs) && s >= comp.Sobs) comp.permGE += 1; }

    // --- REGION axis permutation (fork-granularity within match×context) ---
    for (let i = 0; i < nPairs; i++) permPairReg[i] = pReg[i];
    for (const block of regBlockList) {
      for (let j = block.length - 1; j > 0; j--) { const t = regRng.int(0, j); const tmp = permPairReg[block[j]]; permPairReg[block[j]] = permPairReg[block[t]]; permPairReg[block[t]] = tmp; }
    }
    permSum.fill(0); permCnt.fill(0);
    for (let i = 0; i < nPairs; i++) { const c = cellIdxOf(pCtx[i], pRoleObs[i], permPairReg[i]); permSum[c] += pPrice[i]; permCnt[c] += 1; }
    for (const comp of regAxisComps) { const s = rangeOver(permSum, permCnt, comp.levelIdx); if (Number.isFinite(s) && Number.isFinite(comp.Sobs) && s >= comp.Sobs) comp.permGE += 1; }
  }

  // assemble + BH per axis
  const assemble = (list: Comp[]): SpreadCell[] => {
    const ps = list.map((c) => c.permGE / PERM_B);
    const rej = bhReject(ps, BH_Q);
    return list.map((c, idx) => {
      const levels = c.levelIdx.map((cell) => {
        const regI = cell % N_REGION; const roleI = Math.floor(cell / N_REGION) % N_ROLE;
        return c.axis === 'role' ? ROLE_AXIS[roleI] : REGIONS[regI];
      });
      const values = c.levelIdx.map((cell) => round(priceOf(obsSum, obsCnt, cell)));
      let lo = Infinity; let hi = -Infinity; let argMin = ''; let argMax = '';
      c.levelIdx.forEach((cell, li) => { const v = priceOf(obsSum, obsCnt, cell); if (Number.isFinite(v)) { if (v < lo) { lo = v; argMin = levels[li]; } if (v > hi) { hi = v; argMax = levels[li]; } } });
      return {
        context: CONTEXTS[c.ctxI], axis: c.axis,
        heldFixed: c.axis === 'role' ? REGIONS[c.heldI] : ROLE_AXIS[c.heldI],
        levels, values, S: round(c.Sobs), argMax, argMin,
        permGE: c.permGE, permP: round(ps[idx], 6), resolved: ps[idx] < 0.025, resolvedBH: rej[idx],
      };
    });
  };
  const roleCells = assemble(roleAxisComps);
  const regionCells = assemble(regAxisComps);
  const claim2Role = roleCells.some((c) => c.resolvedBH);
  const claim2Region = regionCells.some((c) => c.resolvedBH);
  return {
    permB: PERM_B, permutationSeed: PERMUTATION_SEED, bhQ: BH_Q,
    note: 'SPREAD-S = max−min of the DEEP-converted cell price over in-power levels (§2.6/#103.3); '
      + 'separation test = within-(match×context) label permutation (role @ moment granularity, '
      + 'region @ fork granularity); NEVER a bootstrap CI on S (house law #80.2). In-power spread-'
      + 'cell set FIXED from observed data.',
    region: { computable: regionCells.length, rawResolved: regionCells.filter((c) => c.resolved).length, bhResolved: regionCells.filter((c) => c.resolvedBH).length, cells: regionCells },
    role: { computable: roleCells.length, rawResolved: roleCells.filter((c) => c.resolved).length, bhResolved: roleCells.filter((c) => c.resolvedBH).length, cells: roleCells },
    claim2Region, claim2Role, claim2: claim2Region || claim2Role,
  };
};

// =============================================================================
// THE PRICE SURFACE + CLAIMS (census summarizer, §2.4/§2.6). Deep GATES; box secondary.
// =============================================================================
const summariseCensus = (raw: RawOut) => {
  const nClusters = raw.coverage.matchesRun;
  // per-cell per-cluster aggregates (deep + box + deep15 + attack-face) for CIs.
  const deepSum = Array.from({ length: N_CELLS }, () => new Array(nClusters).fill(0));
  const deepCnt = Array.from({ length: N_CELLS }, () => new Array(nClusters).fill(0));
  const boxSum = Array.from({ length: N_CELLS }, () => new Array(nClusters).fill(0));
  const boxCnt = Array.from({ length: N_CELLS }, () => new Array(nClusters).fill(0));
  const deep15Sum = new Float64Array(N_CELLS); const deep15Cnt = new Int32Array(N_CELLS);
  const ownDeepSum = new Float64Array(N_CELLS); const ownBoxSum = new Float64Array(N_CELLS); const ownCnt = new Int32Array(N_CELLS);
  for (const p of raw.pairs) {
    const c = cellIdxOf(p.ctxI, p.roleI, p.regI);
    deepSum[c][p.clusterIdx] += p.priceDeep; deepCnt[c][p.clusterIdx] += 1;
    boxSum[c][p.clusterIdx] += p.priceBox; boxCnt[c][p.clusterIdx] += 1;
    deep15Sum[c] += p.priceDeep15; deep15Cnt[c] += 1;
    ownDeepSum[c] += p.ownDeep; ownBoxSum[c] += p.ownBox; ownCnt[c] += 1;
  }

  const cells: any[] = [];
  const p2Decomp: any[] = []; // C5/§2.5: the per in-power cell P2↔P2b decomposition (labelled, non-gating)
  let claim1 = false;
  for (let ctxI = 0; ctxI < N_CTX; ctxI++) {
    for (let roleI = 0; roleI < N_ROLE; roleI++) {
      for (let regI = 0; regI < N_REGION; regI++) {
        const c = cellIdxOf(ctxI, roleI, regI);
        const cc = raw.cellCounts[c];
        const inPower = cc.admitted >= CELL_FLOOR;
        // deep price CI (gating) + box price CI (secondary) — computed for in-power cells only.
        const deepCI = inPower ? clusterCIfromPerCluster(deepSum[c], deepCnt[c], c) : null;
        const boxCI = inPower ? clusterCIfromPerCluster(boxSum[c], boxCnt[c], c + N_CELLS) : null;
        const deepExcludesZero = deepCI !== null && Number.isFinite(deepCI.lower) && Number.isFinite(deepCI.upper) && (deepCI.lower > 0 || deepCI.upper < 0);
        if (inPower && deepExcludesZero) claim1 = true;
        // C5/§2.5: join the committed P2 STATUE price (labelled, non-gating) for in-power cells.
        const key = `${CONTEXTS[ctxI]}|${ROLE_AXIS[roleI]}|${REGIONS[regI]}`;
        const p2cell = P2_PRIOR.available ? P2_PRIOR.map.get(key) ?? null : null;
        const p2bDeep = deepCI ? deepCI.point : null;
        const p2Deep = p2cell ? p2cell.deep.point : null;
        const deltaStatueDeep = (p2bDeep !== null && p2Deep !== null) ? round(p2bDeep - p2Deep) : null;
        const p2bBox = boxCI ? boxCI.point : null;
        const p2Box = p2cell ? p2cell.box.point : null;
        const deltaStatueBox = (p2bBox !== null && p2Box !== null) ? round(p2bBox - p2Box) : null;
        const p2Comparison = inPower ? {
          available: p2cell !== null, joined: p2cell !== null,
          p2ContentSha: P2_PRIOR.observedContentSha, p2ContentShaMatches: P2_PRIOR.contentShaMatches,
          p2bDeepPrice: p2bDeep, p2DeepStatuePrice: p2cell ? p2cell.deep : null, deltaStatueDeep,
          p2bBoxPrice: p2bBox, p2BoxStatuePrice: p2cell ? p2cell.box : null, deltaStatueBox,
          note: 'LABELLED, NON-GATING (§2.5): P2 statue price quoted from the committed P2 census (content SHA 3f332a8e…24a9); Δ_statue = P2b − P2 = the dynamism-loss the containment removes.',
        } : null;
        cells.push({
          context: CONTEXTS[ctxI], role: ROLE_AXIS[roleI], region: REGIONS[regI],
          admittedPairs: cc.admitted, inPower,
          excluded: { injury: cc.exInjury, ended: cc.exEnded, lowOccupancy: cc.exLowOcc },
          deepPriceGATING: deepCI ? { point: deepCI.point, lower: deepCI.lower, upper: deepCI.upper, n: deepCI.n, excludesZero: deepExcludesZero }
            : { point: deepCnt[c].reduce((s, _v, i) => s + deepSum[c][i], 0) / Math.max(1, cc.admitted), lower: null, upper: null, n: cc.admitted, excludesZero: false, note: 'UNDER-POWERED — published, not pooled (#24/#44.5)' },
          boxPriceSECONDARY: boxCI ? { point: boxCI.point, lower: boxCI.lower, upper: boxCI.upper, n: boxCI.n } : { point: round(ownCnt[c] === 0 ? Number.NaN : boxSum[c].reduce((s, v) => s + v, 0) / cc.admitted), lower: null, upper: null, n: cc.admitted },
          attackFaceSecondary: { ownDeep: round(ownCnt[c] === 0 ? Number.NaN : ownDeepSum[c] / ownCnt[c]), ownBox: round(ownCnt[c] === 0 ? Number.NaN : ownBoxSum[c] / ownCnt[c]), n: ownCnt[c] },
          sensitivity15sDeep: round(deep15Cnt[c] === 0 ? Number.NaN : deep15Sum[c] / deep15Cnt[c]),
          p2Comparison,
        });
        if (inPower) {
          p2Decomp.push({
            context: CONTEXTS[ctxI], role: ROLE_AXIS[roleI], region: REGIONS[regI],
            p2bDeep, p2Deep, deltaStatueDeep, p2bBox, p2Box, deltaStatueBox, joined: p2cell !== null,
          });
        }
      }
    }
  }
  const inPowerCells = cells.filter((c) => c.inPower);

  // Claim 2 — the SPREAD-S permutation (deep-converted; both axes).
  const separation = computeSeparation(raw);
  const claim2 = separation.claim2;

  // the §5 reading (records the disposition; the DECISION is the commander's — P2 stops here).
  let reading: string; let readingCode: 'A' | 'B' | 'C' | 'D';
  if (claim1 && claim2) { readingCode = 'A'; reading = 'DESIGN CASE (§5-A): ≥1 in-power cell deep-price CI excludes 0 AND the surface separates by region and/or role — RETURNS to the commander with the price surface; V4-P3 reads the in-power cells. STOPS AT COMMANDER (P2 builds no consumer).'; }
  else if (claim1 && !claim2) { readingCode = 'B'; reading = 'PRICES RESOLVE BUT DO NOT SEPARATE (§5-B): holding pays, but region/role do not sort it — STOP at the commander (the hedge is generic; the grown-rest-defence/grown-delivery premise is unsupported).'; }
  else if (!claim1 && claim2) { readingCode = 'C'; reading = 'SEPARATION WITHOUT RESOLVED PRICES (§5-C): the spread survives permutation but no in-power cell price CI excludes 0 — a genuinely ambiguous reading; RETURNS to the commander to adjudicate. STOPS AT COMMANDER.'; }
  else { readingCode = 'D'; reading = 'THE NULL (§5-D): no resolved deep price AND no separation — CLASS H’s premise is unsupported; V4-P3 is NOT built. STOP at the commander. No re-cut.'; }

  return {
    gatingUnit: GATING_UNIT, gatingCalib: CALIB_DEEP, secondaryUnit: 'box', secondaryCalib: CALIB_BOX,
    cellsTotal: N_CELLS, cellFloor: CELL_FLOOR,
    inPowerCellCount: inPowerCells.length, underPoweredCellCount: N_CELLS - inPowerCells.length,
    claim1, claim1Note: 'Claim 1 — NONZERO PRICES: ≥1 in-power cell has a DEEP-price match-cluster bootstrap CI (B=2000, seed 99203) excluding 0 (#103.3 gating unit).',
    claim2, claim2Note: 'Claim 2 — SEPARATION: BH-significant SPREAD-S on ≥1 axis (region and/or role) by within-(match×context) permutation.',
    readingCode, reading,
    separation,
    // C5/§2.5: the LABELLED, NON-GATING P2↔P2b decomposition (read from the committed P2 census).
    p2ComparisonRead: {
      source: P2_PRIOR.path, available: P2_PRIOR.available,
      contentShaExpected: P2_PRIOR.expectedContentSha, contentShaObserved: P2_PRIOR.observedContentSha,
      contentShaMatches: P2_PRIOR.contentShaMatches, p2CellsRead: P2_PRIOR.cellsRead,
      inPowerCellsJoined: p2Decomp.filter((d) => d.joined).length, inPowerCellsTotal: p2Decomp.length,
      note: P2_PRIOR.note ?? 'per in-power cell: the P2b region-occupancy price beside the P2 STATUE price, '
        + 'Δ_statue = P2b − P2 (the dynamism-loss the containment removes). LABELLED, NON-GATING (§2.5); the P2 '
        + 'file identity is its embedded X-DET content SHA 3f332a8e…24a9 (the whole-file hash differs — #107.2(vii)).',
      decomposition: p2Decomp,
    },
    priceSurface: cells,
  };
};

// =============================================================================
// THE SIZING SMOKE (§2.3) — realized rates + the FROZEN ATTAINABILITY-KNEE N RULE (C4).
// =============================================================================
const summariseSmoke = (raw: RawOut) => {
  const nClusters = raw.coverage.matchesRun;
  // pooled deep/box hold-price + per-match cluster σ̂ (goal-value) — LABELLED CONTEXT ONLY (§2.3):
  // the pooled-MDL formula is RETIRED; these no longer gate N.
  const pooled = (arr: readonly { sum: number; n: number }[]): number => { let s = 0; let n = 0; for (const u of arr) { s += u.sum; n += u.n; } return n === 0 ? Number.NaN : s / n; };
  const perMatchLift = (arr: readonly { sum: number; n: number }[]): number[] => arr.map((u) => (u.n === 0 ? Number.NaN : u.sum / u.n));
  const pooledDeep = pooled(raw.perClusterDeep); const pooledBox = pooled(raw.perClusterBox);
  const sigmaDeep = sampleSd(perMatchLift(raw.perClusterDeep));
  const sigmaBox = sampleSd(perMatchLift(raw.perClusterBox));
  const finiteMatchesDeep = perMatchLift(raw.perClusterDeep).filter(Number.isFinite).length;
  const finiteMatchesBox = perMatchLift(raw.perClusterBox).filter(Number.isFinite).length;

  // C4/§2.3: THE FROZEN N RULE = the attainability knee (#105). For each candidate N on the
  // 50-match grid, project each of the 72 cells' admitted fork-pairs-per-match × N and count how
  // many reach CELL_FLOOR=150; plateau = the attainable ceiling; N = the SMALLEST grid N reaching
  // 0.95·plateau, capped at N_max=800. (The pooled-MDL formula is NOT reused.)
  const perMatchAdmitted = raw.cellCounts.map((cc) => cc.admitted / Math.max(1, nClusters));
  const grid: number[] = [];
  for (let n = KNEE_STEP; n <= N_MAX; n += KNEE_STEP) grid.push(n); // {50, 100, …, 800}
  const inPowerAt = (n: number): number => perMatchAdmitted.filter((pm) => pm * n >= CELL_FLOOR).length;
  const attainCurve = grid.map((n) => ({ N: n, inPower: inPowerAt(n) }));
  const plateau = attainCurve.reduce((mx, p) => Math.max(mx, p.inPower), 0);
  const kneeThreshold = KNEE_PLATEAU_FRAC * plateau;
  const kneeEntry = attainCurve.find((p) => p.inPower >= kneeThreshold);
  const knee = kneeEntry ? kneeEntry.N : N_MAX;
  const N = Math.min(knee, N_MAX);

  // per-cell attainability at N: project this smoke's admitted-pairs-per-match to N matches.
  const attain = raw.cellCounts.map((cc, c) => {
    const ctxI = Math.floor(c / (N_ROLE * N_REGION)); const roleI = Math.floor(c / N_REGION) % N_ROLE; const regI = c % N_REGION;
    const perMatch = cc.admitted / Math.max(1, nClusters);
    const projected = perMatch * N;
    return { context: CONTEXTS[ctxI], role: ROLE_AXIS[roleI], region: REGIONS[regI], smokeAdmitted: cc.admitted, admittedPerMatch: round(perMatch, 4), projectedAtN: round(projected, 2), inPowerAtN: projected >= CELL_FLOOR };
  });
  const attainableAtN = attain.filter((a) => a.inPowerAtN).length;

  // occupancy distribution
  const occ = raw.occ;
  const occMean = occ.n === 0 ? Number.NaN : occ.sum / occ.n;
  const occSd = occ.n < 2 ? Number.NaN : Math.sqrt(Math.max(0, occ.sumsq / occ.n - occMean * occMean));
  const occHistogram = occ.hist.map((count, i) => ({ bin: `[${round(i / OCC_BINS, 2)},${round((i + 1) / OCC_BINS, 2)})`, count }));

  // exception-class shares (incl. the C3 `free` class)
  const x6 = raw.x6;
  const x6Total = x6.ok + x6.free + x6.ePaused + x6.eBallWon + x6.eBarred + x6.eOnside + x6.eCarrier + x6.eSentOff + x6.eEnded + x6.unexplained;
  const share = (v: number) => round(x6Total === 0 ? Number.NaN : v / x6Total, 6);

  // C3/§2.1: the Schmitt-latch diagnostics (engage/disengage transitions; steer/free tick split).
  const l = raw.latch;
  const holdTicks = l.steerTicks + l.freeTicks;

  return {
    seedFamily: `${SMOKE_SEED_BASE} + k, k∈0..${SMOKE_MATCHES - 1} (sizing only; disjoint — §2.4)`,
    occupancy: { mean: round(occMean), sd: round(occSd), min: round(occ.min === Infinity ? Number.NaN : occ.min), max: round(occ.max === -Infinity ? Number.NaN : occ.max), admittedByOccFloor: occ.admitted, excludedByOccFloor: occ.excludedLowOcc, occFloor: OCC_FLOOR, histogram: occHistogram, note: 'C2/§2.2: occupancy = fraction of hold ticks INSIDE the region class R; expected to shift UP vs P2 (containment is easier than point-arrival). A pile-up near 1.0 is a REPORTED observation, not a re-cut (§2.2).' },
    latch: { engage: l.engage, disengage: l.disengage, steerTicks: l.steerTicks, freeTicks: l.freeTicks, holdTicks, freeFraction: round(holdTicks === 0 ? Number.NaN : l.freeTicks / holdTicks, 4), note: 'C3/§2.1 Schmitt latch: engage steering on exit (s<0), disengage at s≥1 m; freeFraction = share of hold ticks the body governed itself (the intended free-inside behaviour).' },
    realized: {
      momentsPerMatch: round(raw.coverage.moments / Math.max(1, nClusters), 3),
      admittedPairs: raw.coverage.admittedPairs, excludedPairs: raw.coverage.excludedPairs,
    },
    exceptionShares: { total: x6Total, ok: share(x6.ok), free: share(x6.free), ePaused: share(x6.ePaused), eBallWon: share(x6.eBallWon), eBarred: share(x6.eBarred), eOnside: share(x6.eOnside), eCarrier: share(x6.eCarrier), eSentOff_INJURY: share(x6.eSentOff), eEnded: share(x6.eEnded), unexplained: share(x6.unexplained), counts: { ...x6 } },
    nRule: {
      rule: 'N = smallest 50-step grid N with inPower(N) ≥ 0.95·plateau, capped at N_max=800 (the #105 attainability knee)',
      inPowerFormula: 'inPower(N) = #cells whose (smoke admitted-pairs/match)·N ≥ CELL_FLOOR = 150',
      grid: `{${KNEE_STEP}, ${2 * KNEE_STEP}, …, ${N_MAX}}`,
      cellFloor: CELL_FLOOR, nMax: N_MAX, plateauFrac: KNEE_PLATEAU_FRAC,
      plateau, kneeThreshold: round(kneeThreshold, 4), knee, N,
      attainCurve,
      pooledContextLABELLED: {
        note: 'the pooled-MDL formula is RETIRED (§2.3/#107.2(vi)); pooled prices/σ̂ kept as LABELLED CONTEXT only — they no longer gate N.',
        pooledDeepHoldPrice: round(pooledDeep), pooledBoxHoldPrice: round(pooledBox),
        sigmaDeep: round(sigmaDeep), sigmaBox: round(sigmaBox), finiteMatchesDeep, finiteMatchesBox,
      },
      note: 'N is a DETERMINISTIC function of this smoke (#44.5/#65). Pass it to the census as V4P2B_N=<N>.',
    },
    attainability: { cellFloor: CELL_FLOOR, attainableAtN, ofCells: N_CELLS, perCell: attain },
  };
};

// =============================================================================
// THE DETERMINISTIC EXPERIMENT (run TWICE for X-DET, F8) — mode-dispatched payload.
// The wall-cost timing is EXCLUDED (captured separately, run 1 only).
// =============================================================================
let g_instrumentMs = 0;
const runExperiment = (withReceipts: boolean) => {
  const _t = Date.now();
  const raw = runInstrument(withReceipts);
  g_instrumentMs = Date.now() - _t;
  const receiptOut = { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(raw.receipts).map(([k, v]) => [k, v.length])), records: raw.receipts };
  const coverage = {
    ...raw.coverage,
    cloneCoverage: raw.coverage.moments === 0 ? Number.NaN : round(raw.coverage.clonesTaken / raw.coverage.moments),
    xForkIdent: raw.coverage.xForkChecked > 0 && raw.coverage.xForkMismatched === 0,
  };
  if (MODE === 'smoke') {
    return { mode: 'smoke' as const, coverage, sizing: summariseSmoke(raw), receipts: receiptOut };
  }
  return { mode: 'census' as const, coverage, census: summariseCensus(raw), receipts: receiptOut };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET (double-run, F8), X-FORK-IDENT, clone-coverage,
// X-SRC-ZERO, seed disjointness, SHA, write.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);
// canonicalise WITHOUT the receipts ledger (a first-N diagnostic; not part of X-DET/SHA).
const canonicalDet = (exp: { receipts: unknown }): string => {
  const { receipts: _r, ...rest } = exp;
  return JSON.stringify(rest);
};

const tA = Date.now();
const experiment = runExperiment(true);
const wallMsRun1 = Date.now() - tA;
const instrumentMsRun1 = g_instrumentMs;
const experiment2 = SKIP_DET ? null : runExperiment(false);
const xDet = SKIP_DET ? null : canonicalDet(experiment) === canonicalDet(experiment2!);

// X-FORK-IDENT (HARD, 100% coverage) + clone coverage (HARD).
const xForkIdent = experiment.coverage.xForkChecked > 0
  && experiment.coverage.xForkChecked === experiment.coverage.momentsForked
  && experiment.coverage.xForkMismatched === 0;
const cloneCoverage = experiment.coverage.clonesTaken === experiment.coverage.momentsForked && experiment.coverage.momentsForked > 0;

// X-SRC-ZERO (HARD): git diff --stat -- src empty + the production fingerprint unchanged.
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const fpLeague = new League({ seed: FINGERPRINT_SEED });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, { kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS });
const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
const xFpProd = fingerprint === FINGERPRINT_BASELINE;
const xSrcZero = srcDiff === '' && xFpProd;

// SEED DISJOINTNESS (HARD, §2.4) — from the FROZEN family constants (design property). Now also
// asserts disjointness from P2's CONSUMED bands (10.0M smoke / 10.1M census / stats 99003,99103).
const smokeMaxSeed = SMOKE_SEED_BASE + SMOKE_MATCHES - 1; // 10,200,039
const censusMaxSeed = CENSUS_SEED_BASE + N_MAX - 1; // 10,300,799
const statsSeedsDisjoint = ![BOOTSTRAP_SEED, PERMUTATION_SEED].some((s) => PRIOR_STATS_SEEDS.includes(s));
// two integer ranges [a0,a1],[b0,b1] are disjoint iff one ends before the other begins.
const rangesDisjoint = (a: readonly [number, number], b: readonly [number, number]): boolean => a[1] < b[0] || b[1] < a[0];
const p2bSmokeRange: readonly [number, number] = [SMOKE_SEED_BASE, smokeMaxSeed];
const p2bCensusRange: readonly [number, number] = [CENSUS_SEED_BASE, censusMaxSeed];
const disjointFromP2 =
  rangesDisjoint(p2bSmokeRange, P2_SMOKE_RANGE) && rangesDisjoint(p2bSmokeRange, P2_CENSUS_RANGE)
  && rangesDisjoint(p2bCensusRange, P2_SMOKE_RANGE) && rangesDisjoint(p2bCensusRange, P2_CENSUS_RANGE);
const seedDisjoint =
  SMOKE_SEED_BASE > PRIOR_SEED_CEIL && CENSUS_SEED_BASE > PRIOR_SEED_CEIL // both above every pre-P2 consumed range
  && smokeMaxSeed < CENSUS_SEED_BASE // smoke band ends below the census band (mutually disjoint, 100k gap)
  && disjointFromP2 // above/disjoint from P2's consumed 10.0M/10.1M bands (§2.4)
  && statsSeedsDisjoint; // 99203/99303 disjoint from all prior stats seeds incl. P2's 99003/99103

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates: Record<string, boolean | null> = {
  xForkIdent, cloneCoverage, xDet, xSrcZero, seedDisjoint,
};

// ---- the verdict ----
let verdict: string;
const gateFail = !xForkIdent || !cloneCoverage || xDet === false || !xSrcZero || !seedDisjoint;
if (IS_PREFLIGHT) {
  verdict = `PREFLIGHT (bounded, ${MODE}) — NOT a verdict; exercises the full region-containment instrument `
    + '(the Schmitt-latch enforcement + region occupancy + the `free` class, every exception class in '
    + 'principle, X-FORK-IDENT on all moments, admission, cell binning, the knee-rule N (smoke) / both '
    + 'claim code paths + the P2↔P2b comparison read (census)) + X-DET on a capped toy corpus. Numbers '
    + 'are meaningless by design; nothing canonical written.';
} else if (gateFail) {
  verdict = 'FAIL — an X-family gate (X-FORK-IDENT / clone-coverage / X-DET / X-SRC-ZERO / seed-disjointness) '
    + 'did not pass (§5-E); STOP at the commander.';
} else if (MODE === 'smoke') {
  verdict = 'SIZING SMOKE — NOT a verdict (§2.3, #44.5/#65): realizes occupancy, exception+latch shares, the '
    + 'attainability curve, per-moment wall-cost and pins the census N via the FROZEN KNEE RULE (labelled, '
    + 'non-gating). Pass nRule.N as V4P2B_N to the census.';
} else {
  const c = (experiment as Extract<typeof experiment, { mode: 'census' }>).census;
  verdict = `CENSUS — ${c.reading} [Claim1=${c.claim1} Claim2=${c.claim2}] (the disposition is recorded; the DECISION is the commander’s — P2b builds no consumer and stops here; a repeat all-negative-deep-worst sign routes CLASS H to the #106.6 fallback fork at the commander).`;
}

const body = {
  experiment: `STAGE3-V4-P2b (the region-containment hold — instrument-corrected occupancy census; CLASS H) [${MODE}]`,
  authority: 'STAGE3-V4-P2B-REGION-HOLD §1-§8 (ordered #106.5 — the statue confound #106.3; authorized #107; '
    + 'gating unit = DEEP per #103.3), inheriting STAGE3-V4-P2-OCCUPANCY-CENSUS §§1-8 VERBATIM except the five '
    + '#106.5 amendments; contract STAGE3-V4-LONG-HORIZON-PRICE (I1-I11); reuses the V3-P1 fork machinery + '
    + 'P0b/P1 detectors + cluster-bootstrap + SPREAD-S engines, CHANGES only the hold enforcement (→ the '
    + 'Schmitt-latch region containment), the occupancy measure (→ region membership), the N rule (→ the '
    + 'attainability knee), the seed bands (→ 10.2M/10.3M) and stats seeds, ADDS the `free` class + the '
    + 'labelled P2↔P2b comparison read.',
  head,
  mode: MODE,
  world: 'ENRICHED eye-null (#67.3: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; '
    + 'c5TouchFork off; stationEye NULL; forcedStation the ONLY forcing seam — one body/fork, I4)',
  flags: CENSUS_FLAGS,
  preflight: IS_PREFLIGHT ? { matchCap: Number.isFinite(MATCH_CAP) ? MATCH_CAP : null, momentCap: Number.isFinite(MOMENT_CAP) ? MOMENT_CAP : null, seedBase: SEED_BASE, note: 'bounded preflight — writes OUTSIDE the canonical JSON; not a verdict' } : null,
  parameters: {
    matchCount: MATCH_COUNT, plannedMatches: PLANNED_MATCHES, nEnv: N_ENV, nCensus: MODE === 'census' ? N_CENSUS : null, nMax: N_MAX,
    seedBaseFrozen: FROZEN_BASE, seedBaseUsed: SEED_BASE,
    smokeSeedRange: [SMOKE_SEED_BASE, smokeMaxSeed], censusSeedRange: [CENSUS_SEED_BASE, censusMaxSeed], priorSeedCeiling: PRIOR_SEED_CEIL,
    p2SmokeRange: P2_SMOKE_RANGE, p2CensusRange: P2_CENSUS_RANGE,
    wHoldS: W_HOLD_S, wLongS: W_LONG_S, wSensitivityS: W_SENS_S, wHoldTicks: W_HOLD_TICKS, wLongTicks: W_LONG_TICKS,
    momentSpacingS: MOMENT_SPACING_S, occFloor: OCC_FLOOR, hysteresisM: HYSTERESIS_M, cellFloor: CELL_FLOOR,
    lattice: LATTICE.map((c) => c.id), regionClasses: REGIONS, contexts: CONTEXTS, roleAxis: ROLE_AXIS,
    cells: N_CELLS, restThird: REST_THIRD, halfL: HALF_L, halfW: HALF_W,
    calibDeepGATING: CALIB_DEEP, calibBoxSECONDARY: CALIB_BOX, gatingUnit: GATING_UNIT,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES, permutationSeed: PERMUTATION_SEED, permB: PERM_B, bhQ: BH_Q,
    kneeStep: KNEE_STEP, kneePlateauFrac: KNEE_PLATEAU_FRAC,
    p2ComparisonSource: P2_CENSUS_PATH, p2ExpectedContentSha: P2_EXPECTED_CONTENT_SHA,
    clusterUnit: 'match seed (#20)',
  },
  result: experiment,
  fidelity: {
    xForkIdent: { pass: xForkIdent, checked: experiment.coverage.xForkChecked, moments: experiment.coverage.momentsForked, mismatched: experiment.coverage.xForkMismatched, note: 'HARD, 100% coverage: control-fork W_long signature == an independent plain step-through (§2.1)' },
    cloneCoverage: { pass: cloneCoverage, clonesTaken: experiment.coverage.clonesTaken, momentsForked: experiment.coverage.momentsForked, note: 'HARD: clonesTaken == momentsForked (I4)' },
    xDet: SKIP_DET ? 'SKIPPED (preflight)' : xDet,
    xSrcZero: { pass: xSrcZero, srcDiffEmpty: srcDiff === '', srcDiff, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd },
    seedDisjoint: { pass: seedDisjoint, smokeRange: [SMOKE_SEED_BASE, smokeMaxSeed], censusRange: [CENSUS_SEED_BASE, censusMaxSeed], priorSeedCeiling: PRIOR_SEED_CEIL, disjointFromP2, p2SmokeRange: P2_SMOKE_RANGE, p2CensusRange: P2_CENSUS_RANGE, statsSeedsDisjoint, note: 'computed from the FROZEN family constants (design property); asserts disjointness from P2 10.0M/10.1M/99003/99103 (§2.4); a preflight V4P2B_SEED_BASE cannot shift it' },
    xCorpusIdent: 'N/A (a fresh forced-fork corpus has no identity target — as V4-P1)',
  },
  gates,
  deviations: [
    'C1 (§2.1/#107.2(i,ii,iii); supersedes P2 F1): THE CONTAINMENT ENFORCEMENT — free-inside, steer-back-on-exit. Seam + resolve-and-freeze are P2 (Match.forcedStation absolute target; Match.ts:626/actionExecutor.ts:639-649). At t_fork the lattice candidate resolves ONCE in the body own attack frame and its FROZEN region class R = depthBand D × folded-lateral Λ is computed (incumbent nowhere, #91/I8). Each hold tick s(t) = min over the binding depth+lateral edges of the metres inside R (negative if outside) drives a Schmitt latch: engage (steer) iff s<0, disengage (FREE) iff s≥HYSTERESIS_M=1.0 m; in [0,H) the latch holds (no chatter). While steering forcedStation={gid,reentry(t),untilTick}; while free forcedStation=null (the body own policy governs). reentry(t) = nearest point of R shrunk inward by H, clamping own-frame coords into the shrunk band and mapping back via localX·attackDir, PRESERVING sign(body.y) for wide (nearest wing, no cross-pitch teleport) / toward centre for central, recomputed per steering tick — a steer-to-nearest-boundary law, NOT the v3 ball-local policy and NOT P2 single fixed point.',
    'C2 (§2.2/#107.2(iv); supersedes P2 F2 occupancy): OCCUPANCY = fraction of hold ticks INSIDE R — insideTicks counts inRegion(t) := depthOf(mine.localX(body.x))===D && lateralOf(body.y)===Λ (POST-step) over W_hold_ticks; ARRIVE_M RETIRED from the estimand. OCC_FLOOR=0.5 KEPT UNCHANGED (distribution expected to shift UP; a pile-up near 1.0 is a REPORTED observation, not a re-cut, §2.2). Possession flip stays NON-TERMINAL (eBallWon continues the hold); terminal only on E-INJURY (excluded), E-BALL-ARRIVAL (terminal-hold, ADMISSIBLE at occupancy≥0.5), E-ENDED (excluded) — all P2 verbatim; occupancy DECOUPLED from the per-tick class.',
    'C3 (§2.1/#107.2(v)): THE `free` DIAGNOSTIC TICK CLASS — on a FREE tick (steering=false, in-region) there is no forced target ⇒ P2 clamp-trace ok/eBarred/eOnside/unexplained branch is INAPPLICABLE; tallied under `free`. ePaused/eCarrier/eBallWon/eSentOff still fire on free ticks. ok/eBarred/eOnside/unexplained now occur ONLY on steering ticks. The Schmitt latch engage/disengage transition counts + the steer/free tick split are surfaced (latch{}). A necessary consequence of the enforcement change, not a re-design.',
    'C4 (§2.3/#107.2(vi); supersedes the P2 §2.7 pooled-MDL formula): THE N RULE = the attainability KNEE. grid {50,100,…,800} (50-step, #105); inPower(N) = #cells whose (smoke admitted-pairs/match)·N ≥ CELL_FLOOR=150; plateau = max over grid; N = smallest grid N with inPower(N) ≥ 0.95·plateau, capped N_max=800. Pooled deep/box prices + σ̂ are RECORDED as LABELLED CONTEXT only (they no longer gate N). The smoke re-measures its OWN curve.',
    'C5 (§2.5/#107.2(vii)): THE LABELLED P2↔P2b COMPARISON READ — the census embeds, per in-power cell, the P2b price NEXT TO the P2 STATUE price read from the committed docs/world-model/data/stage3-v4-p2-occupancy-census.json, joined by (context,role,region); Δ_statue = P2b − P2 (deep + box). The P2 file IDENTITY = its embedded X-DET content SHA-256 3f332a8e…24a9 (the `sha256` field; the whole-file hash differs — the content-hash-vs-file-hash disambiguation). Read ONCE at module load (deterministic). LABELLED, NON-GATING; a missing/unreadable file degrades to available:false, never crashes/gates.',
    'F3 (P2 verbatim): outcomes = the P0b deep detector VERBATIM + Match.inPenaltyBox for box, on the null→true entry transition; the transition prev-state is SEEDED from the shared fork-start state so only NEW entries within W_long are counted (identical across arms ⇒ clean pairing). Attack-face secondary = own (=d) entries FOR = the same detectors with d↔1−d swapped (labelled, non-gating).',
    'F4 (P2 verbatim): ADMISSION excludes a PAIR iff treated E-INJURY, or the fork ENDED within W_long in EITHER arm (E-ENDED — match end is time-based so arms end together; the stricter either-arm form also guards a truncated control), or occupancy < OCC_FLOOR=0.5. Non-admitted pairs PUBLISHED per cell with reason counts, NEVER pooled, NEVER zeroed (#44.5).',
    'F5 (P2 verbatim): OWN-POSSESSION face (side=owner.side); V3-P1 sampleability predicate otherwise verbatim (non-GK, non-carrier, non-sent-off, STATION-FAMILY; stable rotation = pool[rotation%pool.length], advanced on every pick, never proximity/role). MOMENT_SPACING_S=4.0, no per-match cap. Context COARSENED to ball-third only (face fixed ours, density dropped, §2.6).',
    'F6 (P2 verbatim): SPREAD-S ported to BOTH axes — role permuted at MOMENT granularity (V3-P1 verbatim), region permuted at FORK granularity (region is a per-candidate label), both blocked within (match×context); the in-power spread-cell set is FIXED from observed data; BH q=0.05 within EACH axis; Claim 2 fires iff a BH-significant spread survives on ≥1 axis. Per-cell prices by cluster bootstrap; never a CI on S (#80.2).',
    'F7 (P2 verbatim): {15 s} W_long sensitivity re-reads the DEEP gating surface only, on the SAME admitted set, over the first-15 s sub-window (labelled, non-gating; 45 s EXCLUDED per #102.4). W_hold not swept.',
    'F8 (P2 verbatim): X-DET = the whole deterministic payload (receipts + wall-cost EXCLUDED) computed twice and asserted byte-identical (V3-P1 pattern). Wall-cost measured on run 1 and attached OUTSIDE the SHA. No X-CORPUS-IDENT (fresh forced-fork corpus). Fidelity = X-FORK-IDENT + clone-coverage + X-DET + X-SRC-ZERO + seed disjointness (now also asserting disjointness from P2 10.0M/10.1M/99003/99103, §2.4).',
    'MODE selection is EXPLICIT via V4P2B_MODE (no default); census requires V4P2B_N. A bounded preflight (V4P2B_MATCH_CAP / V4P2B_MOMENT_CAP) writes OUTSIDE the repo — when V4P2B_OUT is unset it defaults to /tmp (never the canonical file) as a safety improvement.',
    'FLAGGED SUB-CHOICE (§2.1, executor operationalisation): the re-entry wing for a body at exactly y=0 (Math.sign(0)=0 is degenerate) defaults to the +y wing; y=0 in a wide region is measure-zero and the seam self-corrects the next tick. All other re-entry/latch details are as ratified (#107.2).',
  ],
  registeredNonClaims: [
    'BUILDS NO CONSUMER (V4-P3): no merged scalar, no context extension, no in-support law. The price surface is a MEASUREMENT of held-station value.',
    'PRICES ONLY HELD LATTICE / REGION CLASSES (#91): the incumbent designation (formationSpot / restart stations) is NEVER a priced state and enters no held target (I8).',
    'CALIBRATES NOTHING: consumes the V4-P1 table frozen (#102.2); shot-against stays dropped.',
    'PRICES ONLY THE CLASS H CONCEDE FACE: the delivery bit (CLASS S) + in-support law (CLASS J) are V4-P3; the attack-face reading here is labelled opportunity cost, not a priced consumer term.',
    'MAKES NO DEPLOYMENT / SHIPPING CLAIM (V4-P4): no battery, no adoption ladder, no R3 iteration.',
    'The P3a/P0/P0b/P1 corpora stay LABELLED (I7/#44.3): P2b quotes published aggregates only to pin windows/units and seed the sizing; the P2 census read is LABELLED NON-GATING (§2.5); every gate-bearing number runs FRESH on the P2b corpus.',
    'Nothing ships (Road B): EDS flags dormant, c6Carry/c7Windup probe-only, forcedStation/stationEye null, fingerprint 57b0bdab…c673 unchanged throughout.',
    'V4-P2b CANNOT authorize V4-P3: only the commander opens it; the frozen null (Claim 1 and/or Claim 2 fail) STOPS CLASS H at the commander; a repeat all-negative-deep-worst sign routes to the #106.6 fallback fork at the commander with the user. No third instrument iteration without a ruling.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonicalDet(body as unknown as { receipts: unknown })).digest('hex');
// wall-cost is NON-deterministic ⇒ attached AFTER the SHA (outside X-DET/SHA).
const output = {
  ...body,
  sha256,
  wallCost: {
    note: 'NON-deterministic timing (excluded from X-DET + SHA); reading-(G) feasibility number.',
    run1TotalMs: wallMsRun1, run1InstrumentMs: instrumentMsRun1,
    moments: experiment.coverage.moments,
    perMomentMs: round(experiment.coverage.moments === 0 ? Number.NaN : instrumentMsRun1 / experiment.coverage.moments, 3),
    forks: experiment.coverage.forks,
    projectedCensusMomentHint: 'per-moment ms × (moments/match at N) × N ≈ the census wall-cost the commander weighs against #49.5 (reading (G) off-ramp).',
  },
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
const cov = experiment.coverage;
const base = `V4-P2b ${verdict.slice(0, 64)}`
  + ` · HEAD ${head}${IS_PREFLIGHT ? ' · PREFLIGHT' : ''} · ${MODE} ${cov.matchesRun}m`
  + ` · moments ${cov.moments} forks ${cov.forks}`
  + ` · admitted ${cov.admittedPairs} excluded ${cov.excludedPairs}`
  + ` · X-FORK ${cov.xForkChecked}/${cov.xForkMismatched}mis clone ${cov.clonesTaken}/${cov.momentsForked}`
  + ` · perMomentMs ${output.wallCost.perMomentMs}`
  + ` · xDet ${xDet} xSrcZero ${xSrcZero} disjoint ${seedDisjoint}`;
if (MODE === 'smoke') {
  const s = (experiment as Extract<typeof experiment, { mode: 'smoke' }>).sizing;
  console.error(base + ` · occMean ${s.occupancy.mean} freeFrac ${s.latch.freeFraction} · N ${s.nRule.N} (plateau ${s.nRule.plateau})`
    + ` · attainable ${s.attainability.attainableAtN}/${N_CELLS} · SHA ${sha256.slice(0, 12)}`);
} else {
  const c = (experiment as Extract<typeof experiment, { mode: 'census' }>).census;
  console.error(base + ` · inPower ${c.inPowerCellCount}/${N_CELLS} · Claim1 ${c.claim1} Claim2 ${c.claim2}`
    + ` (region ${c.separation.region.bhResolved}/${c.separation.region.computable} role ${c.separation.role.bhResolved}/${c.separation.role.computable})`
    + ` · reading ${c.readingCode} · SHA ${sha256.slice(0, 12)}`);
}
