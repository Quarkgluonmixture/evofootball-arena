// STAGE III V4-P0b — THE DECISION ANCHOR (instrument-corrected re-classification).
//
// Authority: docs/world-model/STAGE3-V4-P0B-DECISION-ANCHOR.md (FROZEN pre-registration
// 2026-07-31, all sections) ordered by ruling #96.6 (the V4-P0 adjudication) and
// AUTHORIZED to build by ruling #97 (pre-reg reviewed PASS, all flagged choices
// ratified). Under the v4 design contract STAGE3-V4-LONG-HORIZON-PRICE.md (I1-I11).
// Read-only stage: ZERO src/** changes; the re-classification is MAPPED, never priced
// (I8). Nothing ships (Road B): every EDS flag dormant in production, stationEye null
// in every production path, the fingerprint 57b0bdab…c673 unchanged throughout.
//
// P0b RE-CLASSIFIES ONLY (§1 / §6). It INHERITS the entire P0 machinery (the corpus
// re-simulation, X-CORPUS-IDENT, the verbatim V3-P1 support predicate, the H/S engines,
// the match-cluster bootstrap + within-match permutation) and changes ONLY the two
// named instrument defects (#96.3 / #96.4) plus the ratified anti-tautology fixes:
//   (a) DECISION-ANCHORED J (#96.6(i)) — for the three R3 discipline limbs (rest,
//       offside, restart) the CLASS J support test moves from the excess-EVENT moment
//       to the anchor body's MOST RECENT STATION-DECISION moment (the tick the eye
//       (re)committed that body's station target; decisionTick = untilTick − 180,
//       EYE_W_TICKS = 180, W = 3.0 s). Same CI form, same 0.5 threshold, same J-first
//       precedence. UNANCHORED excess events (anchor body never decided ≤ t_event) are
//       DROPPED from the J denominator and their fraction is PUBLISHED per limb. The
//       anchor-lag distribution is published at the frozen bins.
//   (b) THE EXPOSURE MAP (#96.6(i)) — the DIRECT jurisdiction fact: over EVERY R3 eye
//       station-decision, the out-of-support fraction × (phase: playing/restart/other)
//       × (ball: owned/in-flight/loose) × side, with cluster CIs + per-cell counts.
//       Descriptive labelled output (I7); it governs the restart adjudication (#97.3(i)).
//   (c) THE DELIVERY DETECTOR FIX (#96.6(ii)) — the mining-R0 delivery detector drops
//       the P0 `playing && owner !== null` guard (a long-ball/cross/cutback stat
//       increments at the KICK tick, owner null ⇒ the guard suppressed EVERY event ⇒
//       nExcess=0) and adopts the working REFERENCE-STYLE guard-free increment
//       condition (dNow > prevDelivery[side]), behind a MAGNITUDE SANITY HARD GATE:
//       mining-R0 total build-ups ∈ [4,833, 14,499] (= [0.5,1.5] × 12.0825 × 800),
//       else INSTRUMENT FAIL, STOP. Delivery support/contrast/coverage evaluate at the
//       possession-(re)gain ORIGINATION moment (spellStart), NOT the kick tick (at the
//       kick owner is null ⇒ support-out ≡ 1 — the next tautology, caught before it fired).
//
//   H and S columns are UNCHANGED (#96.6(iii)): they keep their P0 EVENT-time anchors
//   (H = when the cost binds relative to the event; S = the realised outcome after the
//   event); only the J slot moves to the decision moment. Delivery is NOT decision-
//   anchored (it routes on R0 where the eye is null; it keeps the A2 origination-moment
//   J). The 400-match fresh reference is REUSED as a banked constant (12.0825 [11.635,
//   12.540], total 4,833) — NOT re-run (§2.5). The dominance rule + UNROUTABLE semantics
//   are verbatim, with the NEW J statistic in the J slot.
//
// COMMAND LINES (documented per prereg §8):
//   • FULL RUN (the commander launches this detached under #49.5):
//       npx tsx scripts/probes/stage3-v4-p0b-decision-anchor.ts
//     → re-simulates the P3a mining arms R0+R3 @ 800/arm (seeds 9,300,000+block*100,000+k),
//       the enriched #67.3 bundle, injected table 171a6dad…/control 968349ff…; builds the
//       decision-anchored J + exposure map + fixed delivery route; X-CORPUS-IDENT (full)
//       + delivery magnitude gate + X-DET (whole output twice byte-identical) + X-SRC-ZERO;
//       writes docs/world-model/data/stage3-v4-p0b-decision-anchor.json (SHA'd).
//   • PREFLIGHT IDENTITY SMOKE (X-CORPUS-IDENT-slice + anchor + delivery-detection slice;
//     writes OUTSIDE the repo; NEVER touches the canonical JSON):
//       V4P0B_CAP_MINE=8 V4P0B_SKIP_DET=1 \
//         V4P0B_OUT=/tmp/v4p0b-smoke.json npx tsx scripts/probes/stage3-v4-p0b-decision-anchor.ts
//   • PREFLIGHT X-DET SMOKE (double-run of the same slice for byte-identity determinism):
//       V4P0B_CAP_MINE=8 \
//         V4P0B_OUT=/tmp/v4p0b-det.json npx tsx scripts/probes/stage3-v4-p0b-decision-anchor.ts
//
// ENV KNOBS (smoke only; the full run touches none): V4P0B_CAP_MINE caps matches-per-
// mining-arm; V4P0B_SKIP_DET=1 skips the 2nd whole-experiment run (the X-DET double-run);
// V4P0B_OUT redirects output to a scratch path. When the cap is set the run is a SMOKE:
// X-CORPUS-IDENT switches to a SLICE self-determinism check (the committed full-800
// aggregates cannot match on a slice), the delivery MAGNITUDE gate is REPORTED not
// enforced (the band is calibrated to the full 800), and the canonical data file is only
// ever written by the uncapped full run.
//
// FLAGGED IMPLEMENTATION CHOICES (the prereg §7 froze the FORM; the operationalisations
// below are the executor's documented choices; every one is surfaced in the run's
// `deviations` block and here):
//   E1  DECISION observable — a station-decision for body `gid` = the tick
//       `stationEyeState.get(gid).untilTick` takes a NEW value (the very signal P0's
//       per-role reconstruction watches). Recorded in a SEPARATE detection loop (own
//       `lastUntilDec` map) so P0's identity aggregates are byte-untouched.
//   E2  DECISION time + support read (§7.8) — support is read at the tick the fresh
//       untilTick is FIRST OBSERVED (post-step), and the decision time = that
//       observation tick's accumulated simTime (the SAME float source as the event
//       times ⇒ exact, monotonic ≤/lag comparisons). This is decisionTick = untilTick−180
//       modulo a deterministic ≤1-tick observation offset (§7.8, negligible, X-DET-safe).
//   E3  ANCHOR bodies — rest = index-1 (non-GK) body; offside = the pass-TARGET body
//       (m.allPlayers[pp.targetGid] ?? mostAdvancedNonOwner); restart = index-1 body
//       (FLAGGED #97.3(i): restart's PRIMARY evidence is the exposure map's phase=restart
//       cell; the decision-anchored restart J is reported secondary/diagnostic).
//   E4  UNANCHORED events (anchor body has no decision ≤ t_event) — DROPPED from the J
//       denominator, count+fraction PUBLISHED per limb (mirrors the H test's
//       no-preceding-anchor drop). No lookback cap; the lag distribution exposes staleness.
//   E5  DELIVERY detector guard-free (reference-style) on R0; per-INCREMENT counting
//       (delta = dNow − prevDelivery pushed as delta build-ups) so mining and reference
//       count the SAME events by the SAME rule (the magnitude band is calibrated to the
//       reference's delta-sum total 4,833/400).
//   E6  DELIVERY support/context×role/coverage snapshotted at the ORIGINATION moment
//       (each possession (re)gain, spellStart) on the most-advanced non-owner body; a
//       build-up later in the spell INHERITS that snapshot; the wide/central group stays
//       the build-up's own geometry (adv |y| at the kick). prevPoss seeded to −2 so the
//       first spell is captured. (spellStart is NOT an identity aggregate.)
//   E7  BALL-STATE buckets — owned := owner!==null; in-flight := owner===null &&
//       (pendingPass!==null || |v|>SPEED_GATE); loose := owner===null && not in-flight
//       (SPEED_GATE=2.5 + pendingPass = the same observables as the P0 release ledger).
//   E8  X-DET = the WHOLE deterministic experiment payload computed TWICE and asserted
//       byte-identical (self-contained; the reused reference enters as a frozen constant,
//       not a recomputation). Equivalent to reproducibility across separate invocations.
//   The FRESH REFERENCE is REUSED not re-run (§2.5): 12.0825 [11.635,12.540] total 4,833
//   is a banked published constant; the magnitude gate consumes it; no ref re-simulation.
//
// Output: docs/world-model/data/stage3-v4-p0b-decision-anchor.json (SHA'd; whole output
// twice byte-identical, X-DET). The RUN writes it — a smoke never does.

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { runHeadless } from '../../src/sim/simRunner';
import { offsideLineLocalX } from '../../src/ai/formations';
import { DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import {
  STATION_FAMILY, EYE_W_S, newStationEyeTrace,
  type RoleConditionedTable, type RoleControlLevels, type StationEyeTrace,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (prereg §2 / §3) — ALL constants inherited verbatim from P0.
// =============================================================================
// mining corpus — RE-SIMULATES the P3a seeds byte-for-byte (§2.5): same arms, same
// frozen seeds/config; same seeds + same flags + byte-identical src ⇒ byte-identical matches.
const MINE_SEED_START = 9_300_000;
const MINE_BLOCK_STRIDE = 100_000;
const MINE_BLOCKS = 4;
const MINE_MATCHES_PER_BLOCK = 200; // 4 × 200 = 800 per arm
const MINE_MATCHES_TOTAL = MINE_BLOCKS * MINE_MATCHES_PER_BLOCK; // 800 (the FROZEN full corpus)

// the eye commitment window (src/ai/stationEye.ts:38, src/ai/actionExecutor.ts:39): the
// decision moment is decisionTick = untilTick − EYE_W_TICKS.
const EYE_W_TICKS = Math.round(EYE_W_S / DT); // = round(3.0 / (1/60)) = 180

// cluster bootstrap (#20) + permutation (#80.2 / I11) — the frozen fresh seeds (verbatim P0).
const BOOTSTRAP_SEED = 97_003;
const BOOTSTRAP_RESAMPLES = 2000;
const PERM_SEED = 97_103;
const PERM_B = 2000;

// routing thresholds (frozen §2 / §2.4)
const PERM_ALPHA = 0.025; // permutation p < 0.025 ⇒ beyond-horizon mass dominates
const SUPPORT_MAJORITY = 0.5; // J iff support-out CI lower > 0.5; in-support iff upper < 0.5

// face-matched CLASS H boundaries (A1, inherited): concede face 10 s, score face 6 s.
const BOUNDARY_CONCEDE_S = 10;
const BOUNDARY_SCORE_S = 6;

// time-to-cost curve bins (inherited P0 §2.5) — descriptive curves only.
const BIN_EDGES = [0, 2, 4, 6, 10, 15, 30, Number.POSITIVE_INFINITY] as const;
const N_BINS = BIN_EDGES.length - 1; // 7

// anchor-lag bins pinned ex ante (§2.1, frozen; W = 3.0 s is a bin edge) — decision→event lag.
const LAG_BIN_EDGES = [0, 1, 2, 3, 6, 10, Number.POSITIVE_INFINITY] as const;
const N_LAG_BINS = LAG_BIN_EDGES.length - 1; // 6: [0,1)[1,2)[2,3)[3,6)[6,10)[10,inf)

// instrument constants (§2 / P3a verbatim)
const REST_THIRD = HALF_L / 3; // I5 own-third depth (P3a REST_THIRD)
const SPEED_GATE = 2.5; // de-glue speed gate = the in-flight ball-state gate (§2.2/E7)
const MOMENT_SPACING_S = 2.0; // V3-P1 sub-state sampling spacing
const NEAR_LINE_M = 2; // pass-release-"near-line" band
const WIDE_HELD_Y = 15; // |y| threshold for a "wide-held" station (D7/D8)
const RESTART_ADJ_S = 5; // "restart-adjacent" window (D7/D8)
const RECEIPT_CAP = 1000; // per-class receipts cap (#49.3), first-N deterministic

// THE DELIVERY MAGNITUDE SANITY HARD GATE (§2.3, frozen). The banked fresh-reference
// delivery rate (P0 §RESULT / #96.5(iii)) is a FROZEN CONSTANT here, NOT re-measured.
const REF_DELIVERY_RATE = 12.0825; // build-ups/match (banked; total 4,833 over 400)
const MAG_CENTER = REF_DELIVERY_RATE * MINE_MATCHES_TOTAL; // 12.0825 × 800 = 9,666.0
const MAG_LO = 0.5 * MAG_CENTER; // 4,833.0
const MAG_HI = 1.5 * MAG_CENTER; // 14,499.0

// THE REUSED FRESH REFERENCE (§2.5) — banked P0 §RESULT constants; NOT re-run.
const BANKED_REFERENCE = {
  reused: true,
  reRun: false,
  seedFamily: '9,700,000 + k, k in 0..399',
  matches: 400,
  source: 'P0 §RESULT (HEAD b390cf9) / #96.5(iii) — banked published constants, NOT re-run (§2.5)',
  baseRates: {
    turnoversPerMatch: 51.335,
    passReleaseNearLinePerMatch: 44.1025,
    restartPhasesPerMatch: 12.6375,
    deliveryBuildupsPerMatch: 12.0825,
  },
  deliveryBuildups: { point: 12.0825, lower: 11.635, upper: 12.540, total: 4833 },
  note: 'The fresh corpus is unchanged (same seeds, enriched R0 eye-null) and its detector '
    + 'was already the working guard-free one; re-running it would deterministically reproduce '
    + 'the banked bytes at cost. The exposure map needs the R3 mining arm only; the delivery '
    + 'magnitude gate consumes the banked 12.0825 constant only (§2.5).',
} as const;

// the injected table + control (never bundled in src/**; the V3-P2/P3a pattern §2.5).
const TABLE_PATH = 'docs/world-model/data/stage3-v3-p1-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const P3A_PATH = 'docs/world-model/data/stage3-v3-p3a-deployment.json';
const TABLE_SHA_FROZEN = '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
const CONTROL_SHA_FROZEN = '968349ff52313df6ce6fe42683faff64b7509d32c108b7b40010c129e18acc1c';

// the ENRICHED census world (#67.3, copied verbatim from the P3a stage doc §3.2).
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// X-SRC-ZERO — the frozen shipped-world production fingerprint (P3a verbatim).
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

// role axis for the role-mix TV (P3a verbatim: GK excluded).
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];

// --- ENGINEERING smoke caps (do NOT touch the frozen staging for the real run) ---
const CAP_MINE = process.env.V4P0B_CAP_MINE
  ? Math.max(1, Number.parseInt(process.env.V4P0B_CAP_MINE, 10)) : Number.POSITIVE_INFINITY;
const SKIP_DET = process.env.V4P0B_SKIP_DET === '1';
const IS_SMOKE = Number.isFinite(CAP_MINE);
const OUT_PATH = process.env.V4P0B_OUT ?? 'docs/world-model/data/stage3-v4-p0b-decision-anchor.json';

// =============================================================================
// SMALL NUMERIC HELPERS (P3a / P0 verbatim where shared)
// =============================================================================
const round = (v: number, dp = 6): number =>
  (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number =>
  (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const finiteMean = (xs: readonly number[]): number => mean(xs.filter(Number.isFinite));
const pct = (sorted: readonly number[], q: number): number => (sorted.length === 0
  ? Number.NaN
  : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]);
const dist2 = (ax: number, ay: number, bx: number, by: number): number =>
  Math.hypot(ax - bx, ay - by);

const binOf = (lagS: number): number => {
  if (!(lagS >= 0)) return -1;
  for (let i = 0; i < N_BINS; i++) if (lagS < BIN_EDGES[i + 1]) return i;
  return N_BINS - 1;
};
const binIsBeyond = (bin: number, boundaryS: number): boolean => BIN_EDGES[bin] >= boundaryS;
const lagBinOf = (lagS: number): number => {
  if (!(lagS >= 0)) return -1;
  for (let i = 0; i < N_LAG_BINS; i++) if (lagS < LAG_BIN_EDGES[i + 1]) return i;
  return N_LAG_BINS - 1;
};
const lagBinLabels = Array.from({ length: N_LAG_BINS }, (_, i) =>
  `[${LAG_BIN_EDGES[i]},${LAG_BIN_EDGES[i + 1] === Infinity ? 'inf' : LAG_BIN_EDGES[i + 1]})`);

// --- per-record receipts (#49.3), capped, first-N deterministic --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// =============================================================================
// THE ENRICHED MATCH FIXTURE (= the census world; P3a verbatim)
// =============================================================================
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS,
});

// the injected role table + control (never bundled in src/**; the V3-P2 pattern §2.5).
const rawTable = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string; table: RoleConditionedTable;
};
const roleTable: RoleConditionedTable = rawTable.table;
const tableCanonicalSha = rawTable.tableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: RoleControlLevels; sha256: string;
};
const control: RoleControlLevels = rawControl.control;
const controlSha = rawControl.sha256;

// =============================================================================
// THE V3-P1 SAMPLING-SUPPORT PREDICATE (quoted VERBATIM from §2.3 / the V3-P1
// source; read READ-ONLY). CLASS J uses the support-out fraction against this — now
// evaluated at the DECISION moment for R3 limbs and the ORIGINATION moment for delivery.
// =============================================================================
type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const localXBand = (localX: number): Threat =>
  (localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle');

/**
 * A moment is IN SUPPORT iff, at that tick (V3-P1 predicate, verbatim §2.3):
 *   m.phase === 'playing' && m.ball.owner !== null && the sampled body is a non-GK,
 *   non-sent-off, non-owner outfielder && body.action.type ∈ the STATION FAMILY.
 * At a DECISION moment the body is by construction non-GK, non-sent-off, non-owner,
 * STATION_FAMILY (the eye-eligibility gate) ⇒ inSupport ⟺ (phase==='playing' &&
 * owner!==null) modulo the ≤1-tick observation offset (§2.1 decomposition property).
 */
const inSupport = (m: Match, body: Player | null): boolean => {
  if (body === null) return false;
  const owner = m.ball.owner;
  return m.phase === 'playing'
    && owner !== null
    && body.role !== 'GK' && !body.sentOff && owner !== body
    && STATION_FAMILY.has(body.action.type);
};
/** context = face × ballThird × density (≥2 non-GK bodies within 9 m of the body). */
const contextOf = (m: Match, body: Player): string => {
  const owner = m.ball.owner;
  const side = body.side;
  const t = m.teams[side];
  const face: Face = owner !== null && owner.side === side ? 'ours' : 'theirs';
  const ballThird = localXBand(t.localX(m.ball.pos.x));
  let near = 0;
  for (const q of t.players) {
    if (q === body || q.role === 'GK' || q.sentOff) continue;
    if (dist2(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
  }
  const density: Density = near >= 2 ? 'crowded' : 'sparse';
  return `${face}|${ballThird}|${density}`;
};

// =============================================================================
// THE EVENT-RECORDING HARNESS (§2.5). One match, one arm. Records BOTH the
// P3a-identity aggregates (for X-CORPUS-IDENT, byte-untouched) and the P0b instruments
// (decision stream, decision-anchored excess events, fixed delivery build-ups).
// =============================================================================
type PhaseBucket = 'playing' | 'restart' | 'other';
type BallBucket = 'owned' | 'inflight' | 'loose';
const PHASE_BUCKETS: readonly PhaseBucket[] = ['playing', 'restart', 'other'];
const BALL_BUCKETS: readonly BallBucket[] = ['owned', 'inflight', 'loose'];

interface Anchor { t: number; side: 0 | 1; gid: number } // simTime seconds; gid = anchor body
interface CostEvent { t: number; side: 0 | 1; mass: number }
interface OffsideMoment { t: number; side: 0 | 1; offside: boolean; outcome: number; ctx: string; role: Role | 'na'; anchorGid: number }
interface SubStateSample { t: number; side: 0 | 1; group: 'A' | 'B'; outcome: number; ctx: string; role: Role | 'na' }
interface DeliveryOrig { t: number; side: 0 | 1; wide: boolean; inSup: boolean; covered: boolean }
// (a)/(b): every R3 eye station-decision (a fresh untilTick), the observable of §2.1/§2.2.
interface Decision { gid: number; side: 0 | 1; t: number; inSup: boolean; phase: PhaseBucket; ball: BallBucket }
// (c/E6): the origination-moment snapshot inherited by any build-up in the spell.
interface SpellOrig { t: number; inSup: boolean; ctx: string; role: Role | 'na'; covered: boolean }

// shared accumulators (R3-only, accumulated across ALL matches — P3a pattern; identity).
interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  eyeAttributable: number; unattributable: number;
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, eyeAttributable: 0, unattributable: 0,
});
interface RoleLedger { decisions: number; deviations: number; mix: Map<string, number> }
type PerRole = Record<Role, RoleLedger>;
const newPerRole = (): PerRole => ({
  GK: { decisions: 0, deviations: 0, mix: new Map() },
  DF: { decisions: 0, deviations: 0, mix: new Map() },
  MF: { decisions: 0, deviations: 0, mix: new Map() },
  WG: { decisions: 0, deviations: 0, mix: new Map() },
  ST: { decisions: 0, deviations: 0, mix: new Map() },
});

interface MineRow {
  seed: number;
  arm: 'R0' | 'R3';
  // --- P3a identity aggregates (deterministic; the X-CORPUS-IDENT set — byte-untouched) ---
  restSlotShare: [number, number];
  offsides: [number, number];
  restartTicks: number;
  band: { goals: number; crosses: number; headers: number; longBalls: number; cutbacks: number };
  // --- P0b routing event streams ---
  playSpan: [number, number]; // [firstPlayingTime, lastPlayingTime] seconds — permutation redraw
  concedeCost: [CostEvent[], CostEvent[]];
  scoreValue: [CostEvent[], CostEvent[]];
  restEvents: Anchor[]; // index-1 own-third→out transitions (D5); gid = index-1 body
  restSub: SubStateSample[]; // slot-held vs slot-abandoned (D7; EVENT-time, unchanged)
  offsideMoments: OffsideMoment[]; // pass-release-near-line moments (D5/D7); anchorGid = target body
  restartEvents: Anchor[]; // restart-phase onsets (D5); gid = index-1 body
  restartSub: SubStateSample[]; // restart-adjacent vs open (D7; EVENT-time, unchanged)
  decisions: Decision[]; // (a)/(b): ALL R3 eye station-decisions (fresh untilTick), chronological
  deliveryOrigs: DeliveryOrig[]; // R0 (A2): fixed guard-free build-ups; origination support
  deliveryValue: CostEvent[]; // R0: value events tied to delivery side (score-face)
  deliverySub: SubStateSample[]; // wide-held vs central (D7); ctx/role at ORIGINATION (E6)
}

const runMineMatch = (
  seed: number, arm: 'R0' | 'R3',
  release: ReleaseLedger | null, perRole: PerRole | null, receipts: ReceiptBook | null,
  trace: StationEyeTrace | null,
): MineRow => {
  const m = matchOf(seed);
  if (arm === 'R3') {
    // stationEye armed EXACTLY as P3a's R3 (arm/scope/table/v3 + the write-only trace
    // sink) so the re-simulation is byte-identical to the committed P3a corpus.
    m.stationEye = { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control }, trace: trace ?? undefined };
  }

  // identity accumulators (P0 verbatim)
  const restTicks: [number, number] = [0, 0];
  const restSlotTicks: [number, number] = [0, 0];
  let restartTicks = 0;

  // per-role reconstruction (R3; reads m.stationEyeState directly — P3a pattern, UNCHANGED)
  const roleOf = new Map<number, Role>();
  for (const p of m.allPlayers) roleOf.set(p.gid, p.role);
  const lastUntil = new Map<number, number>();
  // E1: a SEPARATE decision-detection cursor so the identity per-role loop is byte-untouched.
  const lastUntilDec = new Map<number, number>();

  // release ledger tracking (R3; P3a verbatim)
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = m.ball.owner?.side ?? null;

  // routing event streams
  const concedeCost: [CostEvent[], CostEvent[]] = [[], []];
  const scoreValue: [CostEvent[], CostEvent[]] = [[], []];
  const restEvents: Anchor[] = [];
  const restSub: SubStateSample[] = [];
  const offsideMoments: OffsideMoment[] = [];
  const restartEvents: Anchor[] = [];
  const restartSub: SubStateSample[] = [];
  const decisions: Decision[] = [];
  const deliveryOrigs: DeliveryOrig[] = [];
  const deliveryValue: CostEvent[] = [];
  const deliverySub: SubStateSample[] = [];

  // event-detection state
  const prevShots: [number, number] = [m.teams[0].stats.shots, m.teams[1].stats.shots];
  const prevDelivery: [number, number] = [
    m.teams[0].stats.longBalls + m.teams[0].stats.crosses + m.teams[0].stats.cutbacks,
    m.teams[1].stats.longBalls + m.teams[1].stats.crosses + m.teams[1].stats.cutbacks,
  ];
  const index1DeepPrev: [boolean, boolean] = [false, false];
  const oppDeepPrev: [boolean, boolean] = [false, false];
  let prevPendingT: number | null = null;
  let prevRestartNull = m.restart === null;
  const spellStart: [number, number] = [0, 0]; // per-side possession-spell start time (D5)
  const spellOrig: [SpellOrig | null, SpellOrig | null] = [null, null]; // E6 origination snapshot
  let prevPoss: number = -2; // E6: seed to −2 so the FIRST real possession is captured
  const lastRestartOnset: [number, number] = [-Infinity, -Infinity];
  let lastSubSampleT = -Infinity;
  let firstPlayT = Number.POSITIVE_INFINITY;
  let lastPlayT = 0;

  const index1Of = (side: 0 | 1): Player | null =>
    m.teams[side].players.find((p) => p.index === 1 && p.role !== 'GK') ?? null;
  const mostAdvancedNonOwner = (side: 0 | 1): Player | null => {
    let best: Player | null = null; let bestX = -Infinity;
    for (const p of m.teams[side].players) {
      if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
      const lx = m.teams[side].localX(p.pos.x);
      if (lx > bestX) { bestX = lx; best = p; }
    }
    return best;
  };

  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;

    const playing = m.phase === 'playing';
    const owner = m.ball.owner;
    const nowT = m.simTime;
    const tick = m.simTick;
    if (playing) { if (nowT < firstPlayT) firstPlayT = nowT; lastPlayT = nowT; }

    // --- I5(b) restSlotShare 6 Hz sampling (P3a VERBATIM; identity) ---
    if (tick % 10 === 0 && playing) {
      for (const t of m.teams) {
        const side = t.side as 0 | 1;
        if (m.possessionSide !== side) continue;
        const deep = t.players.filter((p) => p.role !== 'GK' && !p.sentOff && t.localX(p.pos.x) < -REST_THIRD);
        restTicks[side] += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks[side] += 1;
      }
    }

    // --- per-role deviation reconstruction (R3; P3a VERBATIM; identity — byte-untouched) ---
    if (perRole !== null && arm === 'R3') {
      for (const [gid, st] of m.stationEyeState) {
        const prev = lastUntil.get(gid);
        if (prev === st.untilTick) continue;
        lastUntil.set(gid, st.untilTick);
        const role = roleOf.get(gid);
        if (role === undefined) continue;
        const led = perRole[role];
        led.decisions += 1;
        if (st.offset !== null) {
          led.deviations += 1;
          led.mix.set(st.candidateId, (led.mix.get(st.candidateId) ?? 0) + 1);
        }
      }
    }

    // --- (a)/(b) DECISION observations (R3 only, E1/E2): the fresh-untilTick signal.
    // Support is read at THIS (observation) tick, decision time = this tick's simTime. ---
    if (arm === 'R3') {
      for (const [gid, st] of m.stationEyeState) {
        const prevD = lastUntilDec.get(gid);
        if (prevD === st.untilTick) continue;
        lastUntilDec.set(gid, st.untilTick);
        const body = m.allPlayers[gid] ?? null;
        if (body === null) continue;
        const side = body.side as 0 | 1;
        const dSup = inSupport(m, body);
        const phaseB: PhaseBucket = m.phase === 'playing' ? 'playing' : m.phase === 'restart' ? 'restart' : 'other';
        const speed2 = m.ball.vel.x * m.ball.vel.x + m.ball.vel.y * m.ball.vel.y;
        const ballB: BallBucket = owner !== null ? 'owned'
          : (m.pendingPass !== null || speed2 > SPEED_GATE * SPEED_GATE) ? 'inflight' : 'loose';
        decisions.push({ gid, side, t: nowT, inSup: dSup, phase: phaseB, ball: ballB });
        if (receipts) addReceipt(receipts, 'decision', seed, tick, gid, `${phaseB}/${ballB}/${dSup ? 'in' : 'out'}`);
      }
    }

    // --- ownership release ledger (R3; P3a VERBATIM; identity) ---
    const newOwner = m.ball.owner;
    if (release !== null && arm === 'R3') {
      const released = prevOwnerGid !== null && (newOwner === null || newOwner.gid !== prevOwnerGid);
      if (released) {
        const relGid = prevOwnerGid as number;
        release.releases += 1;
        const deglued = m.dribbleTouch !== null && m.dribbleTouch.gid === relGid
          && m.dribbleTouch.until >= m.simTime;
        if (deglued) {
          release.deglue += 1;
          if (receipts) addReceipt(receipts, 'deglue', seed, tick, relGid, 'de-glue branch');
        } else if (newOwner === null) {
          const kicked = m.pendingPass !== null
            || m.ball.vel.x * m.ball.vel.x + m.ball.vel.y * m.ball.vel.y > SPEED_GATE * SPEED_GATE;
          if (kicked) { release.kick += 1; if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'strike/kick/pass/clearance'); }
          else { release.ballWon += 1; if (receipts) addReceipt(receipts, 'ball-won', seed, tick, relGid, 'loose contest'); }
        } else if (prevOwnerSide !== null && newOwner.side !== prevOwnerSide) {
          release.tackle += 1; if (receipts) addReceipt(receipts, 'tackle', seed, tick, relGid, 'won by other side');
        } else {
          release.kick += 1; if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'teammate received');
        }
      }
    }
    prevOwnerGid = newOwner?.gid ?? null;
    prevOwnerSide = newOwner?.side ?? null;

    // --- cost channels (both arms): shots-for (score) + concession surrogate (concede) ---
    for (const side of [0, 1] as const) {
      const shotsNow = m.teams[side].stats.shots;
      if (shotsNow > prevShots[side]) {
        const n = shotsNow - prevShots[side];
        scoreValue[side].push({ t: nowT, side, mass: n });
        const conc = (1 - side) as 0 | 1;
        concedeCost[conc].push({ t: nowT, side: conc, mass: n });
      }
      prevShots[side] = shotsNow;
    }
    for (const side of [0, 1] as const) {
      const oppOwns = owner !== null && owner.side !== side;
      const inOwnThird = oppOwns && m.teams[side].localX(m.ball.pos.x) < -REST_THIRD && playing;
      if (inOwnThird && !oppDeepPrev[side]) {
        concedeCost[side].push({ t: nowT, side, mass: 1 });
      }
      oppDeepPrev[side] = inOwnThird;
    }

    // --- possession-spell origin (D5) + the ORIGINATION snapshot (E6, R0 delivery arm) ---
    if (m.possessionSide !== -1 && m.possessionSide !== prevPoss) {
      const s = m.possessionSide as 0 | 1;
      spellStart[s] = nowT;
      if (arm === 'R0') {
        const advOrig = mostAdvancedNonOwner(s);
        const idx1 = index1Of(s);
        const idx1Deep = idx1 !== null && m.teams[s].localX(idx1.pos.x) < -REST_THIRD;
        const restartAdj = nowT - lastRestartOnset[s] <= RESTART_ADJ_S;
        let wideHeld = false;
        for (const p of m.teams[s].players) {
          if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
          if (Math.abs(p.pos.y) > WIDE_HELD_Y && STATION_FAMILY.has(p.action.type)) { wideHeld = true; break; }
        }
        spellOrig[s] = {
          t: nowT,
          inSup: inSupport(m, advOrig),
          ctx: advOrig ? contextOf(m, advOrig) : 'na',
          role: advOrig?.role ?? 'na',
          covered: idx1Deep || restartAdj || wideHeld,
        };
      }
    }
    if (m.possessionSide !== -1) prevPoss = m.possessionSide;

    // --- rest-slot excess events (D5): index-1 own-third→out transition (playing) ---
    for (const side of [0, 1] as const) {
      const b = index1Of(side);
      const deepNow = b !== null && playing && m.teams[side].localX(b.pos.x) < -REST_THIRD;
      if (b !== null && playing && index1DeepPrev[side] && !deepNow) {
        restEvents.push({ t: nowT, side, gid: b.gid });
      }
      index1DeepPrev[side] = deepNow;
    }

    // --- rest-slot + restart sub-state samples (D7): EVENT-time, UNCHANGED (H/S keep event anchors) ---
    if (playing && nowT - lastSubSampleT >= MOMENT_SPACING_S) {
      lastSubSampleT = nowT;
      for (const side of [0, 1] as const) {
        const b = index1Of(side);
        if (b === null) continue;
        const held = m.teams[side].localX(b.pos.x) < -REST_THIRD;
        restSub.push({ t: nowT, side, group: held ? 'A' : 'B', outcome: Number.NaN, ctx: contextOf(m, b), role: b.role });
      }
      for (const side of [0, 1] as const) {
        const adj = nowT - lastRestartOnset[side] <= RESTART_ADJ_S;
        const rb = index1Of(side);
        restartSub.push({ t: nowT, side, group: adj ? 'A' : 'B', outcome: Number.NaN, ctx: rb ? contextOf(m, rb) : 'na', role: rb?.role ?? 'na' });
      }
    }

    // --- offside binding moments (D5/D7): a NEW pass release; anchorGid = the pass-target body ---
    if (m.pendingPass !== null && m.pendingPass.t !== prevPendingT) {
      prevPendingT = m.pendingPass.t;
      const pp = m.pendingPass;
      const side = pp.side as 0 | 1;
      const t = m.teams[side];
      const line = offsideLineLocalX(t, m.teams[1 - side].players, t.localX(m.ball.pos.x));
      let nearLine = false;
      for (const p of t.players) {
        if (p.role === 'GK' || p.sentOff || p.gid === pp.passerGid) continue;
        if (t.localX(p.pos.x) >= line - NEAR_LINE_M) { nearLine = true; break; }
      }
      if (pp.offside || nearLine) {
        const targetBody = m.allPlayers[pp.targetGid] ?? mostAdvancedNonOwner(side);
        offsideMoments.push({
          t: nowT, side, offside: pp.offside, outcome: Number.NaN,
          ctx: targetBody ? contextOf(m, targetBody) : 'na',
          role: targetBody?.role ?? 'na', anchorGid: targetBody?.gid ?? -1,
        });
      }
    }

    // --- restart-phase onsets (D5): restart null→non-null; anchorGid = index-1 body (E3) ---
    const restartNull = m.restart === null;
    if (prevRestartNull && !restartNull && m.restart !== null) {
      const side = m.restart.side as 0 | 1;
      restartEvents.push({ t: nowT, side, gid: index1Of(side)?.gid ?? -1 });
      lastRestartOnset[side] = nowT;
    }
    prevRestartNull = restartNull;

    // --- delivery events (R0 routing side, A2): GUARD-FREE reference-style detection (E5).
    // The P0 `playing && owner !== null` guard is REMOVED (#96.4 fix). Per-increment
    // counting; each build-up INHERITS the spell origination snapshot (E6). ---
    for (const side of [0, 1] as const) {
      const dNow = m.teams[side].stats.longBalls + m.teams[side].stats.crosses
        + m.teams[side].stats.cutbacks;
      if (dNow > prevDelivery[side] && arm === 'R0') {
        const delta = dNow - prevDelivery[side];
        const so: SpellOrig = spellOrig[side] ?? {
          t: spellStart[side] > 0 ? spellStart[side] : nowT,
          inSup: false, ctx: 'na', role: 'na', covered: false,
        };
        const advKick = mostAdvancedNonOwner(side) ?? owner;
        const wide = advKick !== null && Math.abs(advKick.pos.y) > WIDE_HELD_Y;
        for (let i = 0; i < delta; i++) {
          deliveryOrigs.push({ t: so.t, side, wide, inSup: so.inSup, covered: so.covered });
          deliverySub.push({ t: so.t, side, group: wide ? 'A' : 'B', outcome: Number.NaN, ctx: so.ctx, role: so.role });
          if (receipts) addReceipt(receipts, 'delivery-buildup', seed, tick, advKick?.gid ?? -1, `origin@${round(so.t, 2)} ${wide ? 'wide' : 'central'} inSup=${so.inSup}`);
        }
      }
      prevDelivery[side] = dNow;
    }
  }

  // identity aggregates read from the SINGLE simulated match (no re-sim needed).
  const restSlotShare: [number, number] = [
    restTicks[0] === 0 ? Number.NaN : restSlotTicks[0] / restTicks[0],
    restTicks[1] === 0 ? Number.NaN : restSlotTicks[1] / restTicks[1],
  ];
  const offsides: [number, number] = [m.teams[0].stats.offsides, m.teams[1].stats.offsides];
  const band = {
    goals: m.teams[0].stats.goals + m.teams[1].stats.goals,
    crosses: m.teams[0].stats.crosses + m.teams[1].stats.crosses,
    headers: m.teams[0].stats.headersWon + m.teams[1].stats.headersWon,
    longBalls: m.teams[0].stats.longBalls + m.teams[1].stats.longBalls,
    cutbacks: m.teams[0].stats.cutbacks + m.teams[1].stats.cutbacks,
  };

  if (arm === 'R3') m.stationEye = null;

  // resolve the S-contrast + offside outcomes now that all cost streams exist (P0 verbatim).
  const scoreForResolve = scoreValue;
  const concedeResolve = concedeCost;
  const signedOutcome = (side: 0 | 1, t0: number): number => {
    let scoreFor = 0; let concedeAg = 0;
    for (const c of scoreForResolve[side]) { const lag = c.t - t0; if (lag > 0 && lag <= BOUNDARY_SCORE_S) scoreFor += c.mass; }
    for (const c of concedeResolve[side]) { const lag = c.t - t0; if (lag > 0 && lag <= BOUNDARY_CONCEDE_S) concedeAg += c.mass; }
    return (scoreFor > 0 ? 1 : 0) - (concedeAg > 0 ? 1 : 0);
  };
  const concedeIndicator = (side: 0 | 1, t0: number): number => {
    for (const c of concedeResolve[side]) { const lag = c.t - t0; if (lag > 0 && lag <= BOUNDARY_CONCEDE_S) return 1; }
    return 0;
  };
  for (const s of restSub) s.outcome = concedeIndicator(s.side, s.t);
  for (const s of restartSub) s.outcome = concedeIndicator(s.side, s.t);
  for (const o of offsideMoments) o.outcome = signedOutcome(o.side, o.t);
  for (const s of deliverySub) s.outcome = signedOutcome(s.side, s.t);
  for (const side of [0, 1] as const) for (const c of scoreValue[side]) deliveryValue.push(c);

  const firstT = Number.isFinite(firstPlayT) ? firstPlayT : 0;
  return {
    seed, arm, restSlotShare, offsides, restartTicks, band,
    playSpan: [firstT, Math.max(firstT, lastPlayT)],
    concedeCost, scoreValue, restEvents, restSub,
    offsideMoments, restartEvents, restartSub, decisions,
    deliveryOrigs, deliveryValue, deliverySub,
  };
};

// =============================================================================
// STATISTICS — match-cluster bootstrap (#20) + within-match permutation (#80.2).
// (all P0 verbatim; the seeds/resamples/thresholds are inherited)
// =============================================================================
const clusterCI = <A>(
  units: readonly A[], stat: (sample: readonly A[]) => number, offset: number,
): { point: number; lower: number; upper: number; n: number } => {
  const point = stat(units);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const n = units.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const sample: A[] = [];
    for (let i = 0; i < n; i++) sample.push(units[rng.int(0, n - 1)]);
    const v = stat(sample);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return { point: round(point), lower: round(pct(draws, 0.025)), upper: round(pct(draws, 0.975)), n };
};

// support-out fraction CI: units = per-match {out,total}. stat = Σout/Σtotal.
const supportOutCI = (perMatch: readonly { out: number; total: number }[], offset: number) => {
  const stat = (s: readonly { out: number; total: number }[]): number => {
    let out = 0; let tot = 0;
    for (const u of s) { out += u.out; tot += u.total; }
    return tot === 0 ? Number.NaN : out / tot;
  };
  const ci = clusterCI(perMatch, stat, offset);
  return { ...ci, firesJ: Number.isFinite(ci.lower) && ci.lower > SUPPORT_MAJORITY, inSupport: Number.isFinite(ci.upper) && ci.upper < SUPPORT_MAJORITY };
};

// within-cell sub-state contrast CI (raw pool): units = per-match {aSum,aN,bSum,bN}.
const contrastCI = (
  perMatch: readonly { aSum: number; aN: number; bSum: number; bN: number }[], offset: number,
) => {
  const stat = (s: readonly { aSum: number; aN: number; bSum: number; bN: number }[]): number => {
    let aS = 0; let aN = 0; let bS = 0; let bN = 0;
    for (const u of s) { aS += u.aSum; aN += u.aN; bS += u.bSum; bN += u.bN; }
    if (aN === 0 || bN === 0) return Number.NaN;
    return aS / aN - bS / bN;
  };
  const ci = clusterCI(perMatch, stat, offset);
  const resolved = Number.isFinite(ci.lower) && Number.isFinite(ci.upper) && (ci.lower > 0 || ci.upper < 0);
  return { ...ci, resolved };
};

// STRATIFIED within-cell sub-state contrast (REVIEW FIX R1, ruling #94.3; inherited P0
// verbatim). Stratify by (context × role) [the coarse frozen V3-P1 key × the sampled
// body's role]; A−B within each stratum; pool weighted by sub-state moment count; empty-
// sub-state strata excluded + published; match-cluster bootstrap over the whole pooled
// estimator (B/seed unchanged). S FIRES iff the pooled CI excludes 0. LIMITATION (#94.3):
// the candidate axis of the full census key is OMITTED at this classify-only stage.
type StratSample = { stratum: string; group: 'A' | 'B'; outcome: number };
const stratifiedContrastCI = (perMatch: readonly (readonly StratSample[])[], offset: number) => {
  type Cell = { aSum: number; aN: number; bSum: number; bN: number };
  const aggregate = (matches: readonly (readonly StratSample[])[]): Map<string, Cell> => {
    const strata = new Map<string, Cell>();
    for (const mm of matches) for (const s of mm) {
      let e = strata.get(s.stratum);
      if (e === undefined) { e = { aSum: 0, aN: 0, bSum: 0, bN: 0 }; strata.set(s.stratum, e); }
      if (s.group === 'A') { e.aSum += s.outcome; e.aN += 1; } else { e.bSum += s.outcome; e.bN += 1; }
    }
    return strata;
  };
  const pooledStat = (matches: readonly (readonly StratSample[])[]): number => {
    let wSum = 0; let wDiff = 0;
    for (const e of aggregate(matches).values()) {
      if (e.aN === 0 || e.bN === 0) continue;
      const w = e.aN + e.bN;
      wSum += w; wDiff += w * (e.aSum / e.aN - e.bSum / e.bN);
    }
    return wSum === 0 ? Number.NaN : wDiff / wSum;
  };
  const ci = clusterCI(perMatch, pooledStat, offset);
  const resolved = Number.isFinite(ci.lower) && Number.isFinite(ci.upper) && (ci.lower > 0 || ci.upper < 0);
  const full = aggregate(perMatch);
  let excludedEmptyStrata = 0;
  const perStratum = [...full.entries()]
    .sort((x, y) => (x[0] < y[0] ? -1 : x[0] > y[0] ? 1 : 0))
    .map(([stratum, e]) => {
      const excluded = e.aN === 0 || e.bN === 0;
      if (excluded) excludedEmptyStrata += 1;
      return {
        stratum, aN: e.aN, bN: e.bN,
        aMean: e.aN === 0 ? null : round(e.aSum / e.aN),
        bMean: e.bN === 0 ? null : round(e.bSum / e.bN),
        diff: excluded ? null : round(e.aSum / e.aN - e.bSum / e.bN),
        weight: excluded ? 0 : e.aN + e.bN,
        excluded,
      };
    });
  return { ...ci, resolved, nStrata: full.size, excludedEmptyStrata, perStratum };
};

// paired R3−R0 per-bin CI (descriptive curve). units = per-match {r3,r0}.
const pairedBinCI = (perMatch: readonly { r3: number; r0: number }[], offset: number) => {
  const stat = (s: readonly { r3: number; r0: number }[]): number => {
    let a = 0; let b = 0; let n = 0;
    for (const u of s) { a += u.r3; b += u.r0; n += 1; }
    return n === 0 ? Number.NaN : (a - b) / n;
  };
  return clusterCI(perMatch, stat, offset);
};

// --- CLASS H mass-dominance permutation (A1 face-matched boundary; P0 verbatim) ------
interface HMatch { anchors: readonly Anchor[]; costs: readonly CostEvent[]; span: [number, number] }
const attributeMass = (
  anchors: readonly Anchor[], costs: readonly CostEvent[], boundaryS: number,
): { beyond: number; within: number } => {
  const bySide: [number[], number[]] = [[], []];
  for (const a of anchors) bySide[a.side].push(a.t);
  bySide[0].sort((x, y) => x - y); bySide[1].sort((x, y) => x - y);
  let beyond = 0; let within = 0;
  for (const c of costs) {
    const arr = bySide[c.side];
    let best = Number.NaN;
    for (let i = arr.length - 1; i >= 0; i--) { if (arr[i] <= c.t) { best = arr[i]; break; } }
    if (!Number.isFinite(best)) continue;
    const lag = c.t - best;
    const bin = binOf(lag);
    if (bin < 0) continue;
    if (binIsBeyond(bin, boundaryS)) beyond += c.mass; else within += c.mass;
  }
  return { beyond, within };
};

const hTest = (matches: readonly HMatch[], boundaryS: number, offset: number) => {
  let obsBeyond = 0; let obsWithin = 0;
  for (const mm of matches) {
    const r = attributeMass(mm.anchors, mm.costs, boundaryS);
    obsBeyond += r.beyond; obsWithin += r.within;
  }
  const obsTot = obsBeyond + obsWithin;
  const beyondFraction = obsTot === 0 ? Number.NaN : obsBeyond / obsTot;
  const dominance = Number.isFinite(beyondFraction) && obsBeyond > obsWithin;
  const rng = new Rng(PERM_SEED + offset);
  let ge = 0; let valid = 0;
  for (let b = 0; b < PERM_B; b++) {
    let pBeyond = 0; let pWithin = 0;
    for (const mm of matches) {
      const [lo, hi] = mm.span;
      const permAnchors: Anchor[] = mm.anchors.map((a) => ({
        t: hi > lo ? lo + rng.next() * (hi - lo) : a.t, side: a.side, gid: a.gid,
      }));
      const r = attributeMass(permAnchors, mm.costs, boundaryS);
      pBeyond += r.beyond; pWithin += r.within;
    }
    const pt = pBeyond + pWithin;
    if (pt === 0) continue;
    valid += 1;
    if (pBeyond / pt >= beyondFraction) ge += 1;
  }
  const permP = valid === 0 ? Number.NaN : ge / PERM_B;
  const firesH = dominance && Number.isFinite(permP) && permP < PERM_ALPHA;
  return {
    beyondMass: obsBeyond, withinMass: obsWithin, beyondFraction: round(beyondFraction),
    dominance, permP: round(permP, 6), permValid: valid, firesH, boundaryS,
  };
};

// =============================================================================
// (a) THE DECISION-ANCHORED CLASS J (§2.1) — bind each excess event to its anchor
// body's most recent station decision ≤ t_event; support at THAT decision moment.
// =============================================================================
const decisionAnchoredJ = (
  rows: readonly MineRow[],
  eventsOf: (r: MineRow) => { t: number; gid: number }[],
  offset: number,
) => {
  const perMatch: { out: number; total: number }[] = [];
  const lagBinCounts = new Array(N_LAG_BINS).fill(0);
  const allLags: number[] = [];
  let unanchored = 0; let anchored = 0;
  for (const r of rows) {
    // per-gid decision history for this match (r.decisions is chronological ⇒ arr sorted by t).
    const hist = new Map<number, { t: number; inSup: boolean }[]>();
    for (const d of r.decisions) {
      let arr = hist.get(d.gid);
      if (arr === undefined) { arr = []; hist.set(d.gid, arr); }
      arr.push({ t: d.t, inSup: d.inSup });
    }
    let out = 0; let total = 0;
    for (const e of eventsOf(r)) {
      const arr = hist.get(e.gid);
      let best: { t: number; inSup: boolean } | null = null;
      if (arr !== undefined) {
        for (let i = arr.length - 1; i >= 0; i--) { if (arr[i].t <= e.t) { best = arr[i]; break; } }
      }
      if (best === null) { unanchored += 1; continue; } // E4: dropped from the J denominator
      anchored += 1; total += 1;
      if (!best.inSup) out += 1;
      const lag = e.t - best.t;
      allLags.push(lag);
      const lb = lagBinOf(lag); if (lb >= 0) lagBinCounts[lb] += 1;
    }
    perMatch.push({ out, total });
  }
  const support = supportOutCI(perMatch, offset);
  const sorted = [...allLags].sort((a, b) => a - b);
  const nEvents = anchored + unanchored;
  return {
    support,
    anchored,
    unanchored,
    unanchoredFraction: nEvents === 0 ? null : round(unanchored / nEvents),
    medianLagS: sorted.length === 0 ? null : round(pct(sorted, 0.5)),
    lagBins: lagBinLabels.map((label, i) => ({ bin: label, count: lagBinCounts[i] })),
  };
};

// =============================================================================
// (b) THE EXPOSURE MAP (§2.2) — the DIRECT jurisdiction fact over ALL R3 decisions.
// =============================================================================
const buildExposureMap = (rows: readonly MineRow[], offBase: number) => {
  const outUnits = (pred: (d: Decision) => boolean) =>
    rows.map((r) => {
      let out = 0; let total = 0;
      for (const d of r.decisions) { if (!pred(d)) continue; total += 1; if (!d.inSup) out += 1; }
      return { out, total };
    });
  let off = offBase;
  const perSide = ([0, 1] as const).map((side) => {
    const units = outUnits((d) => d.side === side);
    const ci = supportOutCI(units, off++);
    return {
      side,
      totalDecisions: units.reduce((s, u) => s + u.total, 0),
      outOfSupportFraction: { point: ci.point, lower: ci.lower, upper: ci.upper, n: ci.n },
    };
  });
  const cells: {
    side: 0 | 1; phase: PhaseBucket; ball: BallBucket; count: number;
    outOfSupportFraction: { point: number; lower: number; upper: number; n: number };
  }[] = [];
  for (const side of [0, 1] as const) {
    for (const phase of PHASE_BUCKETS) {
      for (const ball of BALL_BUCKETS) {
        const units = outUnits((d) => d.side === side && d.phase === phase && d.ball === ball);
        const ci = supportOutCI(units, off++);
        cells.push({
          side, phase, ball,
          count: units.reduce((s, u) => s + u.total, 0),
          outOfSupportFraction: { point: ci.point, lower: ci.lower, upper: ci.upper, n: ci.n },
        });
      }
    }
  }
  return {
    totalDecisions: rows.reduce((s, r) => s + r.decisions.length, 0),
    perSide,
    cells,
    note: 'DESCRIPTIVE, labelled (I7): no threshold, no stop of its own. The DIRECT '
      + 'measurement of the CLASS J estimand — the fraction of R3 eye consumptions occurring '
      + 'out of the census sampled support, by (phase × ball-state × side). By the §2.1 '
      + 'decomposition an out-of-support decision falls in a phase≠playing or ball≠owned cell. '
      + 'GOVERNS the restart adjudication (#97.3(i)): the phase=restart cell is restart’s '
      + 'PRIMARY jurisdiction instrument. Cluster CIs, BOOTSTRAP_SEED=97003 family.',
  };
};

// =============================================================================
// THE ROUTING BATTERY (§2.4) — one limb → exactly one class. Dominance rule verbatim,
// with the NEW J statistic (decision-anchored for R3; A2-origination for delivery).
// =============================================================================
type MClass = 'H' | 'S' | 'J' | 'UNROUTABLE';
interface LimbRoute {
  limb: string; routingArm: 'R0' | 'R3'; prior: string; costFace: 'concede' | 'score';
  jAnchor: 'decision-moment' | 'origination-moment';
  nExcess: number;
  support: ReturnType<typeof supportOutCI>;
  decisionAnchor: Omit<ReturnType<typeof decisionAnchoredJ>, 'support'> | null;
  h: ReturnType<typeof hTest>;
  hSingle6: ReturnType<typeof hTest>;
  hSingle10: ReturnType<typeof hTest>;
  s: ReturnType<typeof stratifiedContrastCI>;
  sRawPooled: ReturnType<typeof contrastCI>;
  route: MClass;
  routeReason: string;
  bothFired: boolean;
}

const decideRoute = (
  support: ReturnType<typeof supportOutCI>, h: ReturnType<typeof hTest>,
  s: ReturnType<typeof stratifiedContrastCI>,
): { route: MClass; reason: string; bothFired: boolean } => {
  if (support.firesJ) return { route: 'J', reason: 'support-out CI lower > 0.5 (jurisdiction first)', bothFired: false };
  if (!support.inSupport) return { route: 'UNROUTABLE', reason: 'support-out CI straddles 0.5 (jurisdiction ambiguous — neither bound clears)', bothFired: false };
  const both = h.firesH && s.resolved;
  if (h.firesH) return { route: 'H', reason: both ? 'beyond-boundary mass dominates (perm p<0.025) AND within-cell contrast resolved — H>S on double fire' : 'beyond-boundary mass dominates (perm p<0.025)', bothFired: both };
  if (s.resolved) return { route: 'S', reason: 'within-cell sub-state contrast resolved (CI excludes 0) at ≤ boundary; H does not dominate', bothFired: false };
  return { route: 'UNROUTABLE', reason: 'in support but neither H (no dominant beyond-boundary mass) nor S (no resolved within-cell contrast) fires', bothFired: false };
};

// =============================================================================
// X-CORPUS-IDENT (§2.5, HARD) — recompute the committed P3a aggregates + SHAs (P0 verbatim).
// =============================================================================
const roleMixTV = (perRole: PerRole): number => {
  const norm = (led: RoleLedger): Map<string, number> => {
    const total = [...led.mix.values()].reduce((s, v) => s + v, 0);
    const out = new Map<string, number>();
    if (total === 0) return out;
    for (const [k, v] of led.mix) out.set(k, v / total);
    return out;
  };
  const mixes = Object.fromEntries(ROLE_AXIS.map((r) => [r, norm(perRole[r])])) as Record<Role, Map<string, number>>;
  const vals: number[] = [];
  for (let i = 0; i < ROLE_AXIS.length; i++) {
    for (let j = i + 1; j < ROLE_AXIS.length; j++) {
      const a = mixes[ROLE_AXIS[i]]; const b = mixes[ROLE_AXIS[j]];
      if (a.size === 0 || b.size === 0) continue;
      const keys = new Set([...a.keys(), ...b.keys()]);
      let tv = 0; for (const k of keys) tv += Math.abs((a.get(k) ?? 0) - (b.get(k) ?? 0));
      vals.push(tv * 0.5);
    }
  }
  return round(mean(vals), 4);
};

// =============================================================================
// THE EXPERIMENT — the deterministic P0b payload (run TWICE for X-DET, E8).
// =============================================================================
const runExperiment = () => {
  const mineSeeds: number[] = [];
  outer: for (let b = 0; b < MINE_BLOCKS; b++) {
    for (let k = 0; k < MINE_MATCHES_PER_BLOCK; k++) {
      if (mineSeeds.length >= CAP_MINE) break outer;
      mineSeeds.push(MINE_SEED_START + b * MINE_BLOCK_STRIDE + k);
    }
  }

  // --- re-simulate R0 + R3 (D1) with the event-recording harness ---
  const release = newReleaseLedger();
  const perRole = newPerRole();
  const receipts: ReceiptBook = {};
  const r3Trace = newStationEyeTrace();
  const R0: MineRow[] = [];
  const R3: MineRow[] = [];
  for (const seed of mineSeeds) {
    R0.push(runMineMatch(seed, 'R0', null, null, null, null));
    R3.push(runMineMatch(seed, 'R3', release, perRole, receipts, r3Trace));
  }

  // --- X-CORPUS-IDENT (§2.5, HARD; A4 reframe — P0 verbatim) ---
  const p3a = JSON.parse(readFileSync(P3A_PATH, 'utf8')) as any;
  const hl = p3a.watchabilityHardLimbs;
  const bandC = p3a.equilibriumBand;
  const relC = p3a.structural.release;
  const perRoleC = p3a.perRole.byRole;
  const roleTvC = p3a.perRole.roleMixTV.mean as number;

  const meanCol = (rows: MineRow[], sel: (r: MineRow) => number): number => round(finiteMean(rows.map(sel)));
  const recomputed = {
    restDefence: {
      side0: { control: meanCol(R0, (r) => r.restSlotShare[0]), treated: meanCol(R3, (r) => r.restSlotShare[0]) },
      side1: { control: meanCol(R0, (r) => r.restSlotShare[1]), treated: meanCol(R3, (r) => r.restSlotShare[1]) },
    },
    offside: { control: meanCol(R0, (r) => r.offsides[0] + r.offsides[1]), treated: meanCol(R3, (r) => r.offsides[0] + r.offsides[1]) },
    restart: { control: meanCol(R0, (r) => r.restartTicks), treated: meanCol(R3, (r) => r.restartTicks) },
    band: {
      goals: { r0: round(mean(R0.map((r) => r.band.goals))), r3: round(mean(R3.map((r) => r.band.goals))) },
      crosses: { r0: round(mean(R0.map((r) => r.band.crosses))), r3: round(mean(R3.map((r) => r.band.crosses))) },
      headers: { r0: round(mean(R0.map((r) => r.band.headers))), r3: round(mean(R3.map((r) => r.band.headers))) },
      longBalls: { r0: round(mean(R0.map((r) => r.band.longBalls))), r3: round(mean(R3.map((r) => r.band.longBalls))) },
      cutbacks: { r0: round(mean(R0.map((r) => r.band.cutbacks))), r3: round(mean(R3.map((r) => r.band.cutbacks))) },
    },
    release,
    perRole: Object.fromEntries(ROLE_AXIS.map((r) => [r, { decisions: perRole[r].decisions, deviations: perRole[r].deviations }])),
    roleMixTV: roleMixTV(perRole),
  };

  const checks: { field: string; got: number; want: number; ok: boolean }[] = [];
  const chk = (field: string, got: number, want: number) => {
    checks.push({ field, got, want, ok: got === want });
  };
  let identMode: string;
  if (IS_SMOKE) {
    identMode = 'SMOKE-SLICE: committed full-800 aggregates cannot match on a capped slice; '
      + 'X-CORPUS-IDENT LOGIC exercised via a slice self-determinism re-check (below). '
      + 'The HARD committed-aggregate gate runs ONLY in the uncapped full run.';
    const R0b: MineRow[] = []; const R3b: MineRow[] = [];
    const rel2 = newReleaseLedger(); const pr2 = newPerRole(); const tr2 = newStationEyeTrace();
    for (const seed of mineSeeds) { R0b.push(runMineMatch(seed, 'R0', null, null, null, null)); R3b.push(runMineMatch(seed, 'R3', rel2, pr2, null, tr2)); }
    const a = JSON.stringify([R0.map((r) => r.restSlotShare), R3.map((r) => r.offsides), R3.map((r) => r.restartTicks), release,
      R3.map((r) => r.decisions.length), R0.map((r) => r.deliveryOrigs.length)]);
    const bch = JSON.stringify([R0b.map((r) => r.restSlotShare), R3b.map((r) => r.offsides), R3b.map((r) => r.restartTicks), rel2,
      R3b.map((r) => r.decisions.length), R0b.map((r) => r.deliveryOrigs.length)]);
    checks.push({ field: 'slice-self-determinism', got: a === bch ? 1 : 0, want: 1, ok: a === bch });
  } else {
    identMode = 'FULL: recomputed aggregates matched to committed P3a to full stored precision (6 dp).';
    chk('restDefence.side0.control', recomputed.restDefence.side0.control, hl.restDefence.side0.control);
    chk('restDefence.side0.treated', recomputed.restDefence.side0.treated, hl.restDefence.side0.treated);
    chk('restDefence.side1.control', recomputed.restDefence.side1.control, hl.restDefence.side1.control);
    chk('restDefence.side1.treated', recomputed.restDefence.side1.treated, hl.restDefence.side1.treated);
    chk('offside.control', recomputed.offside.control, hl.offsideCanary.control);
    chk('offside.treated', recomputed.offside.treated, hl.offsideCanary.treated);
    chk('restart.control', recomputed.restart.control, hl.restartCanary.control);
    chk('restart.treated', recomputed.restart.treated, hl.restartCanary.treated);
    for (const k of ['goals', 'crosses', 'headers', 'longBalls', 'cutbacks'] as const) {
      chk(`band.${k}.r0`, (recomputed.band as any)[k].r0, bandC[k].r0);
      chk(`band.${k}.r3`, (recomputed.band as any)[k].r3, bandC[k].r3);
    }
    chk('release.releases', release.releases, relC.releases);
    chk('release.tackle', release.tackle, relC.tackle);
    chk('release.deglue', release.deglue, relC.deglue);
    chk('release.kick', release.kick, relC.kick);
    chk('release.ballWon', release.ballWon, relC.ballWon);
    chk('release.eyeAttributable', release.eyeAttributable, relC.eyeAttributable);
    chk('release.unattributable', release.unattributable, relC.unattributable);
    for (const r of ROLE_AXIS) {
      chk(`perRole.${r}.decisions`, perRole[r].decisions, perRoleC[r].decisions);
      chk(`perRole.${r}.deviations`, perRole[r].deviations, perRoleC[r].deviations);
    }
    chk('roleMixTV', recomputed.roleMixTV, roleTvC);
  }
  const tableShaOk = tableCanonicalSha === TABLE_SHA_FROZEN;
  const controlShaOk = controlSha === CONTROL_SHA_FROZEN;
  const xCorpusIdent = checks.every((c) => c.ok) && tableShaOk && controlShaOk;

  // =============================================================================
  // ROUTING (§2.4). Route arm: R3 for rest/offside/restart (decision-anchored J);
  // R0 for delivery (origination-moment J, no decision-anchor).
  // =============================================================================
  let off = 100;

  // ---- REST-SLOT limb (prior H) — H/S event-time; J decision-anchored ----
  const restH = hTest(R3.map((r) => ({ anchors: r.restEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const restH6 = hTest(R3.map((r) => ({ anchors: r.restEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const restH10 = restH;
  const restDA = decisionAnchoredJ(R3, (r) => r.restEvents.map((e) => ({ t: e.t, gid: e.gid })), off++);
  const restSupport = restDA.support;
  const restS = stratifiedContrastCI(R3.map((r) => r.restSub.map((s) => ({
    stratum: `${s.ctx}#${s.role}`, group: (s.group === 'B' ? 'A' : 'B') as 'A' | 'B', outcome: s.outcome,
  }))), off++);
  const restSRaw = contrastCI(R3.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const s of r.restSub) { if (s.group === 'B') { aSum += s.outcome; aN += 1; } else { bSum += s.outcome; bN += 1; } }
    return { aSum, aN, bSum, bN };
  }), off++);
  const restDec = decideRoute(restSupport, restH, restS);
  const { support: _rSup, ...restDAmeta } = restDA;
  const restRoute: LimbRoute = {
    limb: 'rest-defence slot (DEGEN-RESTDEF, I5(b))', routingArm: 'R3', prior: 'H', costFace: 'concede',
    jAnchor: 'decision-moment',
    nExcess: R3.reduce((s, r) => s + r.restEvents.length, 0),
    support: restSupport, decisionAnchor: restDAmeta, h: restH, hSingle6: restH6, hSingle10: restH10,
    s: restS, sRawPooled: restSRaw,
    route: restDec.route, routeReason: restDec.reason, bothFired: restDec.bothFired,
  };

  // ---- OFFSIDE limb (prior S) — H/S event-time; J decision-anchored on the target body ----
  const offsideAnchors = (r: MineRow): Anchor[] => r.offsideMoments.filter((o) => o.offside).map((o) => ({ t: o.t, side: o.side, gid: o.anchorGid }));
  const offH = hTest(R3.map((r) => ({ anchors: offsideAnchors(r), costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const offH6 = hTest(R3.map((r) => ({ anchors: offsideAnchors(r), costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const offDA = decisionAnchoredJ(R3, (r) => r.offsideMoments.filter((o) => o.offside).map((o) => ({ t: o.t, gid: o.anchorGid })), off++);
  const offSupport = offDA.support;
  const offS = stratifiedContrastCI(R3.map((r) => r.offsideMoments.map((o) => ({
    stratum: `${o.ctx}#${o.role}`, group: (o.offside ? 'A' : 'B') as 'A' | 'B', outcome: o.outcome,
  }))), off++);
  const offSRaw = contrastCI(R3.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const o of r.offsideMoments) { if (o.offside) { aSum += o.outcome; aN += 1; } else { bSum += o.outcome; bN += 1; } }
    return { aSum, aN, bSum, bN };
  }), off++);
  const offDec = decideRoute(offSupport, offH, offS);
  const { support: _oSup, ...offDAmeta } = offDA;
  const offsideRoute: LimbRoute = {
    limb: 'offsides (C-OFFSIDE)', routingArm: 'R3', prior: 'S', costFace: 'concede',
    jAnchor: 'decision-moment',
    nExcess: R3.reduce((s, r) => s + r.offsideMoments.filter((o) => o.offside).length, 0),
    support: offSupport, decisionAnchor: offDAmeta, h: offH, hSingle6: offH6, hSingle10: offH,
    s: offS, sRawPooled: offSRaw,
    route: offDec.route, routeReason: offDec.reason, bothFired: offDec.bothFired,
  };

  // ---- RESTART limb (prior J) — H/S event-time; J decision-anchored (SECONDARY per #97.3(i)) ----
  const restartH = hTest(R3.map((r) => ({ anchors: r.restartEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const restartH6 = hTest(R3.map((r) => ({ anchors: r.restartEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const restartDA = decisionAnchoredJ(R3, (r) => r.restartEvents.map((e) => ({ t: e.t, gid: e.gid })), off++);
  const restartSupport = restartDA.support;
  const restartS = stratifiedContrastCI(R3.map((r) => r.restartSub.map((s) => ({
    stratum: `${s.ctx}#${s.role}`, group: s.group, outcome: s.outcome,
  }))), off++);
  const restartSRaw = contrastCI(R3.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const s of r.restartSub) { if (s.group === 'A') { aSum += s.outcome; aN += 1; } else { bSum += s.outcome; bN += 1; } }
    return { aSum, aN, bSum, bN };
  }), off++);
  const restartDec = decideRoute(restartSupport, restartH, restartS);
  const { support: _rtSup, ...restartDAmeta } = restartDA;
  const restartRoute: LimbRoute & { adjudicationNote: string } = {
    limb: 'restart resettle (C-RESTART)', routingArm: 'R3', prior: 'J', costFace: 'concede',
    jAnchor: 'decision-moment',
    nExcess: R3.reduce((s, r) => s + r.restartEvents.length, 0),
    support: restartSupport, decisionAnchor: restartDAmeta, h: restartH, hSingle6: restartH6, hSingle10: restartH,
    s: restartS, sRawPooled: restartSRaw,
    route: restartDec.route, routeReason: restartDec.reason, bothFired: restartDec.bothFired,
    adjudicationNote: 'FLAGGED #97.3(i): restart’s resettle defect is PHASE-level (shapeReady reads '
      + 'the incumbent shape), not one body’s decision. This decision-anchored restart J (index-1 '
      + 'anchor) is REPORTED secondary/diagnostic with its lag + unanchored fraction; the exposure '
      + 'map’s phase=restart cell is restart’s PRIMARY jurisdiction instrument and GOVERNS the '
      + 'adjudication. If this J is thin/stale/ambiguous it reads UNROUTABLE for restart and the '
      + 'exposure map governs.',
  };

  // ---- DELIVERY limb (prior H; routes ENTIRELY on R0 per A2) — origination-moment J ----
  const delAnchors = (r: MineRow): Anchor[] => r.deliveryOrigs.map((d) => ({ t: d.t, side: d.side, gid: -1 }));
  const delCosts = (r: MineRow): CostEvent[] => r.deliveryValue;
  const delH = hTest(R0.map((r) => ({ anchors: delAnchors(r), costs: delCosts(r), span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const delH10 = hTest(R0.map((r) => ({ anchors: delAnchors(r), costs: delCosts(r), span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const delSupport = supportOutCI(R0.map((r) => { const arr = r.deliveryOrigs.map((d) => d.inSup); return { out: arr.filter((x) => !x).length, total: arr.length }; }), off++);
  const delS = stratifiedContrastCI(R0.map((r) => r.deliverySub.map((s) => ({
    stratum: `${s.ctx}#${s.role}`, group: s.group, outcome: s.outcome,
  }))), off++);
  const delSRaw = contrastCI(R0.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const s of r.deliverySub) { if (s.group === 'A') { aSum += s.outcome; aN += 1; } else { bSum += s.outcome; bN += 1; } }
    return { aSum, aN, bSum, bN };
  }), off++);
  const delDec = decideRoute(delSupport, delH, delS);
  const dwCI = clusterCI(R0.map((r) => ({ cov: r.deliveryOrigs.filter((d) => d.covered).length, tot: r.deliveryOrigs.length })),
    (s) => { let c = 0; let t = 0; for (const u of s) { c += u.cov; t += u.tot; } return t === 0 ? Number.NaN : c / t; }, off++);
  const downstreamWatch = Number.isFinite(dwCI.lower) && dwCI.lower > SUPPORT_MAJORITY;

  // THE DELIVERY MAGNITUDE SANITY HARD GATE (§2.3). Enforced ONLY on the full run.
  const deliveryTotal = R0.reduce((s, r) => s + r.deliveryOrigs.length, 0);
  const deliveryMagnitudePass = deliveryTotal >= MAG_LO && deliveryTotal <= MAG_HI;
  const deliveryMagnitude = {
    observed: deliveryTotal,
    band: [MAG_LO, MAG_HI] as [number, number],
    center: MAG_CENTER,
    refRatePerMatch: REF_DELIVERY_RATE,
    refMatchesScaledTo: MINE_MATCHES_TOTAL,
    enforced: !IS_SMOKE,
    pass: IS_SMOKE ? null : deliveryMagnitudePass,
    note: IS_SMOKE
      ? 'SMOKE: the band is calibrated to the full 800; on a capped slice the count is REPORTED, not enforced.'
      : (deliveryMagnitudePass
        ? 'PASS: mining-R0 build-up count within [4833, 14499] — the guard-free detector produces a non-empty population.'
        : 'INSTRUMENT FAIL: mining-R0 build-up count outside [4833, 14499] — the detector is still wrong; no delivery verdict is drawn; STOP.'),
  };

  const deliveryRoute: LimbRoute & {
    downstreamWatch: boolean; downstreamWatchCI: typeof dwCI; deliveryMagnitude: typeof deliveryMagnitude; note: string;
  } = {
    limb: 'delivery economy (§2 band break)', routingArm: 'R0', prior: 'H (+downstream-watch)', costFace: 'score',
    jAnchor: 'origination-moment',
    nExcess: deliveryTotal,
    support: delSupport, decisionAnchor: null, h: delH, hSingle6: delH, hSingle10: delH10,
    s: delS, sRawPooled: delSRaw,
    route: delDec.route, routeReason: delDec.reason, bothFired: delDec.bothFired,
    downstreamWatch, downstreamWatchCI: dwCI, deliveryMagnitude,
    note: 'A2: routes on the INCUMBENT/R0 side (guard-free build-ups; chain lag origin→shot-for; '
      + 'R0 ORIGINATION-moment contrasts/support — E6, NOT the kick tick where owner is null). '
      + 'NOT decision-anchored (the eye is null on R0). Downstream-watch = coverage by other '
      + 'routes’ remedies (D8) at the origin state, REPORTED never a stop.',
  };

  const limbs = [restRoute, offsideRoute, restartRoute, deliveryRoute];
  const anyUnroutable = limbs.some((l) => l.route === 'UNROUTABLE');
  const allRoute = limbs.every((l) => l.route === 'H' || l.route === 'S' || l.route === 'J');

  // =============================================================================
  // (b) THE EXPOSURE MAP — over ALL R3 station-decisions.
  // =============================================================================
  const exposureMap = buildExposureMap(R3, 3000);

  // =============================================================================
  // TIME-TO-COST CURVES (§2.5) — descriptive per-bin R3/R0 (inherited P0 form).
  // =============================================================================
  const curveFor = (
    arm: MineRow[], pairArm: MineRow[] | null, anchorsOf: (r: MineRow) => Anchor[],
    costsOf: (r: MineRow) => CostEvent[], offBase: number,
  ) => {
    const binMass = (r: MineRow): number[] => {
      const anchors = anchorsOf(r); const costs = costsOf(r);
      const bySide: [number[], number[]] = [[], []];
      for (const a of anchors) bySide[a.side].push(a.t);
      bySide[0].sort((x, y) => x - y); bySide[1].sort((x, y) => x - y);
      const bins = new Array(N_BINS).fill(0);
      for (const c of costs) {
        const arrA = bySide[c.side]; let best = Number.NaN;
        for (let i = arrA.length - 1; i >= 0; i--) { if (arrA[i] <= c.t) { best = arrA[i]; break; } }
        if (!Number.isFinite(best)) continue;
        const bin = binOf(c.t - best); if (bin >= 0) bins[bin] += c.mass;
      }
      return bins;
    };
    const armBins = arm.map(binMass);
    const pairBins = pairArm ? new Map(pairArm.map((r) => [r.seed, binMass(r)])) : null;
    const perBin = [] as any[];
    for (let bin = 0; bin < N_BINS; bin++) {
      const units = arm.map((r, i) => {
        const r3 = armBins[i][bin];
        const r0 = pairBins ? (pairBins.get(r.seed)?.[bin] ?? 0) : 0;
        return { r3, r0 };
      });
      const ci = pairArm ? pairedBinCI(units, offBase + bin) : { point: round(mean(units.map((u) => u.r3))), lower: Number.NaN, upper: Number.NaN, n: units.length };
      perBin.push({
        bin: `[${BIN_EDGES[bin]},${BIN_EDGES[bin + 1] === Infinity ? 'inf' : BIN_EDGES[bin + 1]})`,
        armMean: round(mean(armBins.map((b) => b[bin]))),
        pairMean: pairBins ? round(mean([...pairBins.values()].map((b) => b[bin]))) : null,
        excessDiff: pairArm ? ci.point : null,
        ciLower: pairArm ? ci.lower : null, ciUpper: pairArm ? ci.upper : null,
      });
    }
    return perBin;
  };
  let curveOff = 500;
  const curves = {
    restSlot: curveFor(R3, R0, (r) => r.restEvents, (r) => [...r.concedeCost[0], ...r.concedeCost[1]], curveOff),
    offside: (curveOff += N_BINS, curveFor(R3, R0, (r) => r.offsideMoments.filter((o) => o.offside).map((o) => ({ t: o.t, side: o.side, gid: o.anchorGid })), (r) => [...r.concedeCost[0], ...r.concedeCost[1]], curveOff)),
    restart: (curveOff += N_BINS, curveFor(R3, R0, (r) => r.restartEvents, (r) => [...r.concedeCost[0], ...r.concedeCost[1]], curveOff)),
    delivery: (curveOff += N_BINS, curveFor(R0, null, (r) => r.deliveryOrigs.map((d) => ({ t: d.t, side: d.side, gid: -1 })), (r) => r.deliveryValue, curveOff)),
    binEdges: BIN_EDGES.map((e) => (e === Infinity ? 'inf' : e)),
    note: 'DESCRIPTIVE (I7): form frozen; numbers pin W_hold/W_long at V4-P2 (a fresh dataset). '
      + 'restSlot/offside/restart = concede-surrogate hazard (R3−paired R0) per bin; delivery = '
      + 'delivery-value hazard on R0 (A2), no cross-arm pairing.',
  };

  return {
    mining: {
      seeds: mineSeeds.length, seedFormula: '9,300,000 + blockIndex*100,000 + k (R0+R3, D1)',
      tableCanonicalSha, controlSha,
    },
    routing: { limbs, anyUnroutable, allRoute },
    deliveryMagnitudePass: IS_SMOKE ? null : deliveryMagnitudePass,
    exposureMap,
    xCorpusIdent: { pass: xCorpusIdent, mode: identMode, tableShaOk, controlShaOk, recomputed, checks },
    curves,
    receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
  };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET (whole-experiment double-run, E8), X-SRC-ZERO, SHA, write.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);

const experiment = runExperiment();
// X-DET (§2.5, HARD): the WHOLE deterministic payload twice byte-identical. The reused
// reference is a frozen constant (not recomputed); the mining re-sim + all derived
// instruments are deterministic ⇒ two runs are byte-identical.
const experiment2 = SKIP_DET ? null : runExperiment();
const xDet = SKIP_DET ? null : canonical(experiment) === canonical(experiment2);

// X-SRC-ZERO (HARD): git diff --stat -- src empty + production fingerprint unchanged.
let srcDiff = '';
try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
const fpLeague = new League({ seed: FINGERPRINT_SEED });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
});
const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
const xFpProd = fingerprint === FINGERPRINT_BASELINE;
const xSrcZero = srcDiff === '' && xFpProd;

let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }

const gates = {
  xCorpusIdent: experiment.xCorpusIdent.pass, // HARD (full run); SMOKE-SLICE self-determinism otherwise
  deliveryMagnitude: experiment.deliveryMagnitudePass, // HARD (full run); null on smoke
  xDet, // HARD (whole output twice byte-identical); null when skipped (identity smoke)
  xSrcZero, // HARD
  routingComplete: experiment.routing.allRoute && !experiment.routing.anyUnroutable
    && (IS_SMOKE || experiment.deliveryMagnitudePass === true),
};

// A SMOKE is a preflight of the machinery, NEVER a verdict (its capped populations make
// every routing CI noise and the magnitude gate un-calibrated). The verdict is the run's.
const verdict = IS_SMOKE
  ? 'SMOKE (preflight) — NOT a verdict; exercises compile + X-CORPUS-IDENT-slice + '
    + 'anchor/exposure/delivery-detection wiring + X-DET(double-run) + X-SRC-ZERO logic only. '
    + 'Routing + magnitude on a capped slice are meaningless.'
  : (!experiment.xCorpusIdent.pass)
    ? 'FAIL — X-CORPUS-IDENT (§2.5): the re-sim is NOT the P3a corpus (drift/config); STOP'
    : (!xSrcZero)
      ? 'FAIL — X-SRC-ZERO: src touched or fingerprint moved; STOP'
      : (xDet === false)
        ? 'FAIL — X-DET: the P0b output is not byte-identical across the double-run; STOP'
        : (experiment.deliveryMagnitudePass === false)
          ? 'INSTRUMENT FAIL — delivery MAGNITUDE gate (§2.3): mining-R0 build-up count outside '
            + '[4833, 14499]; the detector is still wrong; STOP at the commander (reading D)'
          : experiment.routing.anyUnroutable
            ? 'STOP AT COMMANDER — a limb is UNROUTABLE (§5 reading C)'
            : experiment.routing.allRoute
              ? 'ALL FOUR LIMBS ROUTE + delivery magnitude PASS (§5 reading A/B) — RETURNS to the '
                + 'commander; only the commander’s review (NOT this run) opens V4-P1 (§6)'
              : 'INCOMPLETE';

const body = {
  experiment: 'STAGE3-V4-P0b (the decision anchor — instrument-corrected re-classification)',
  authority: 'STAGE3-V4-P0B-DECISION-ANCHOR §1-§8 (ordered #96.6, authorized #97); INHERITS the '
    + 'P0 pre-reg §§1-7 + #93 A1-A4; contract STAGE3-V4-LONG-HORIZON-PRICE (I1-I11)',
  head,
  world: 'ENRICHED (#67.3: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off)',
  flags: CENSUS_FLAGS,
  smoke: IS_SMOKE ? { capMine: Number.isFinite(CAP_MINE) ? CAP_MINE : null, skipDet: SKIP_DET } : null,
  parameters: {
    mining: experiment.mining,
    reference: BANKED_REFERENCE,
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
    permSeed: PERM_SEED, permB: PERM_B, permAlpha: PERM_ALPHA,
    supportMajority: SUPPORT_MAJORITY,
    boundaryConcedeS: BOUNDARY_CONCEDE_S, boundaryScoreS: BOUNDARY_SCORE_S,
    lagBins: LAG_BIN_EDGES.map((e) => (e === Infinity ? 'inf' : e)),
    timeToCostBins: BIN_EDGES.map((e) => (e === Infinity ? 'inf' : e)),
    eyeWindowTicks: EYE_W_TICKS, eyeWindowS: EYE_W_S,
    clusterUnit: 'match seed (#20)',
    deliveryMagnitudeBand: [MAG_LO, MAG_HI],
    corrections: {
      a: 'DECISION-ANCHORED J (#96.6(i)) — R3 limbs: support at the anchor body’s most recent '
        + 'station decision ≤ t_event (decisionTick = untilTick − 180); UNANCHORED events dropped '
        + 'from the denominator + fraction published; anchor-lag distribution at the frozen bins.',
      b: 'THE EXPOSURE MAP (#96.6(i)) — out-of-support fraction of ALL R3 eye decisions × '
        + '(phase × ball-state × side), cluster CIs; governs restart (#97.3(i)).',
      c: 'DELIVERY DETECTOR FIX (#96.6(ii)) — guard-free reference-style increment detection on '
        + 'R0; origination-moment support/context/coverage (E6); MAGNITUDE HARD gate [4833,14499].',
      inherited: 'H + S columns UNCHANGED (event-time anchors, #96.6(iii)); dominance rule + '
        + 'UNROUTABLE semantics verbatim; A1 face-matched boundaries; R1 stratified S; '
        + 'X-CORPUS-IDENT (aggregate-recompute + input SHA); reference REUSED not re-run (§2.5).',
    },
  },
  xCorpusIdent: experiment.xCorpusIdent,
  routing: experiment.routing,
  exposureMap: experiment.exposureMap,
  reference: BANKED_REFERENCE,
  timeToCostCurves: experiment.curves,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (identity smoke)' : xDet,
    xSrcZero: { pass: xSrcZero, srcDiffEmpty: srcDiff === '', srcDiff, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd },
  },
  receipts: experiment.receipts,
  gates,
  deviations: [
    'E1: decision observable = a fresh stationEyeState.untilTick (P0’s per-role signal); recorded in a SEPARATE cursor so P0 identity aggregates are byte-untouched.',
    'E2/§7.8: support read at the observation tick (post-step), decision time = that tick’s accumulated simTime (same float source as events ⇒ exact ≤/lag); = decisionTick(untilTick−180) modulo ≤1-tick.',
    'E3/§7.1: anchor bodies = rest/restart index-1 body, offside pass-target body; restart’s decision-anchored J is SECONDARY, the exposure map phase=restart cell is PRIMARY (#97.3(i)).',
    'E4/§7.7: UNANCHORED excess events dropped from the J denominator, fraction published per limb (mirrors the H unattributed-cost drop).',
    'E5: delivery detector guard-free (reference-style, #96.4 fix) on R0, per-increment counting (delta pushed as delta build-ups) so mining and reference count the same events by the same rule.',
    'E6/§7.4: delivery support + (context×role) + D8 coverage snapshotted at the ORIGINATION moment (possession (re)gain) on the most-advanced non-owner body and inherited by any build-up in the spell; wide/central stays the build-up’s own geometry (adv |y| at the kick); prevPoss seeded −2 to capture the first spell.',
    'E7/§7.6: ball-state buckets owned/in-flight/loose via SPEED_GATE=2.5 + pendingPass (P0 release-ledger observables).',
    'E8/§2.5: X-DET = the whole deterministic experiment payload computed twice and asserted byte-identical (self-contained; reference enters as a frozen constant).',
    '§7.2: H and S keep the EVENT-time anchor; only J moves to the decision moment (#96.6(iii)).',
    '§7.3/§7.5: delivery keeps the A2 origination-moment J (eye null on R0, no decision-anchor); the fresh reference is REUSED not re-run, the magnitude gate consumes 12.0825 as a banked constant.',
  ],
  registeredNonClaims: [
    'RE-CLASSIFIES ONLY: P0’s verdicts stay published, never overwritten (#96.6 revert→reframe on instruments).',
    'NO pricing/consumer claim; forces no body, prices no state, builds no surrogate/merged scalar/in-support law.',
    'The P3a corpus numbers stay LABELLED (I7/#44.3); re-sim aggregates re-derived only to prove identity.',
    'The exposure map + anchor-lag distributions are descriptive reference, not gate-bearing verdicts.',
    'Nothing ships (Road B): EDS flags dormant, c6Carry/c7Windup probe-only, stationEye null, fingerprint 57b0bdab…c673 unchanged throughout.',
    'V4-P0b CANNOT authorize V4-P1: only the commander’s review of the freeze opens V4-P1; an UNROUTABLE limb or failed magnitude gate stops the stage here.',
  ],
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
const r = experiment.routing.limbs;
const em = experiment.exposureMap;
console.error(
  `V4-P0b ${verdict}`
  + ` · HEAD ${head}${IS_SMOKE ? ' · SMOKE' : ''}`
  + ` · mining ${experiment.mining.seeds}×(R0,R3)`
  + ` · X-CORPUS-IDENT ${experiment.xCorpusIdent.pass} (${experiment.xCorpusIdent.checks.filter((c) => !c.ok).length} fails)`
  + ` · routes rest=${r[0].route} offside=${r[1].route} restart=${r[2].route} delivery=${r[3].route}`
  + ` · deliveryN ${(r[3] as any).nExcess} (mag ${(r[3] as any).deliveryMagnitude.pass})`
  + ` · exposure decisions ${em.totalDecisions}`
  + ` · xDet ${xDet} · xSrcZero ${xSrcZero} (fp ${xFpProd})`
  + ` · SHA ${sha256.slice(0, 12)}`,
);
