// STAGE III V4-P0 — THE AUTOPSY MAP (route the three fired limbs).
//
// Authority: docs/world-model/STAGE3-V4-P0-AUTOPSY-MAP.md (FROZEN pre-registration
// 2026-07-31, INCLUDING §7 commander amendments A1-A4 / ruling #93) under the v4
// design contract STAGE3-V4-LONG-HORIZON-PRICE.md (invariants I1-I11). Read-only
// stage: ZERO src/** changes; designations are MAPPED, never priced (I8). Nothing
// ships (Road B): every EDS flag dormant in production, stationEye null in every
// production path, the fingerprint 57b0bdab…c673 unchanged throughout.
//
// This probe (per the prereg §2-§5 AS AMENDED):
//   (a) DESIGNATION / MACHINERY MAP  — the world's own designation variables to
//       file:line (§2.1), read-only. The P0 reference map (one of designations'
//       TWO legitimate uses, I8).
//   (b) MINING CORPUS  — deterministic RE-SIMULATION of the P3a arms from their
//       exact frozen seeds/config with an event-recording harness (§2.2), and the
//       HARD X-CORPUS-IDENT gate: recompute the committed P3a aggregates to full
//       stored precision + re-verify the injected table/control SHAs. Any mismatch
//       (e.g. V8/Node trajectory drift) ⇒ FAIL, STOP at the commander.
//   (c) ROUTING VERDICT per limb  — the frozen §2.3 battery (face-matched CLASS H
//       mass-dominance permutation [A1], within-cell CLASS S contrast, CLASS J
//       support-out fraction vs the verbatim V3-P1 predicate, the ordered
//       dominance rule J→H→S with H>S on double fire, UNROUTABLE⇒STOP). The
//       delivery limb routes ENTIRELY on the INCUMBENT/R0 side [A2] + its
//       coverage-based DOWNSTREAM-WATCH flag.
//   (d) BINDING-MOMENT BASE RATES  — a FRESH incumbent reference corpus (400
//       matches, enriched R0 eye-null, seeds 9,700,000+k) with match-cluster CIs
//       (§2.4); X-DET double-run byte-identity.
//   (e) TIME-TO-COST CURVES  — descriptive event-time cost curves, bins pinned ex
//       ante [0,2)[2,4)[4,6)[6,10)[10,15)[15,30)[30,inf) (§2.5); + the A1
//       single-boundary readings (6-for-all, 10-for-all) published as labelled data.
//
// COMMAND LINES (documented per prereg §3):
//   • FULL RUN (the commander launches this detached under #49.5):
//       npx tsx scripts/probes/stage3-v4-p0-autopsy-map.ts
//     → mines R0+R3 @ 800/arm (the P3a seeds), fresh reference @ 400, X-DET double
//       run, writes docs/world-model/data/stage3-v4-p0-autopsy-map.json (SHA'd).
//   • PREFLIGHT IDENTITY SMOKE (X-CORPUS-IDENT logic on a slice; writes OUTSIDE the
//     repo; NEVER touches the canonical JSON):
//       V4P0_CAP_MINE=8 V4P0_CAP_REF=8 V4P0_SKIP_DET=1 \
//         V4P0_OUT=/tmp/v4p0-smoke.json npx tsx scripts/probes/stage3-v4-p0-autopsy-map.ts
//   • PREFLIGHT X-DET SMOKE (fresh double-run on a slice):
//       V4P0_CAP_MINE=8 V4P0_CAP_REF=8 \
//         V4P0_OUT=/tmp/v4p0-det.json npx tsx scripts/probes/stage3-v4-p0-autopsy-map.ts
//
// ENV KNOBS (smoke only; the full run touches none): V4P0_CAP_MINE caps
// matches-per-mining-arm; V4P0_CAP_REF caps fresh-reference matches; V4P0_SKIP_DET=1
// skips the 2nd fresh run; V4P0_OUT redirects output to a scratch path. When either
// cap is set the run is a SMOKE: X-CORPUS-IDENT switches to a SLICE self-determinism
// check (the committed full-800 aggregates cannot match on a slice) and is clearly
// labelled; the canonical data file is only ever written by the uncapped full run.
//
// FLAGGED IMPLEMENTATION CHOICES (the prereg froze the statistical FORM, thresholds,
// seeds and gates; the event-detection operationalisations below are the executor's
// documented choices where the prereg did not fully determine them — every one is
// surfaced to the commander in the run's `deviations` block and this header):
//   D1  Mining re-simulates R0 (reference) + R3 (deployment) — the two arms every
//       routing test (all R3-vs-R0) and the chosen X-CORPUS-IDENT aggregate set
//       consume. R1/R2 ladder rungs are not re-simulated: no routing test and no
//       checked aggregate depends on them, and A4 reframed X-CORPUS-IDENT as
//       aggregate-recompute + input-SHA with the byte-identity determinism argument
//       carrying the rest.
//   D2  X-CORPUS-IDENT checks the high-sensitivity DETERMINISTIC point/count set
//       named in §2.2 (DEGEN-RESTDEF s0/s1, C-OFFSIDE, C-RESTART, the §2 five r0/r3,
//       the release ledger incl. the 113,836 exact count, the per-role
//       decisions/deviations, roleMixTV) + the table/control SHAs. The
//       shape-adjudicator BOOTSTRAP CIs are NOT recomputed (their exact byte-values
//       depend on a fragile bootstrap-offset sequence A4 explicitly declined to
//       require); the determinism argument carries them.
//   D3  CONCESSION SURROGATE (concede-face cost, boundary 10 s per A1) = opponent
//       shot-against (opp stats.shots increments) ∪ opponent deep-entry (ball owned
//       by the opponent freshly crossing into the conceding side's defensive third,
//       localX < −REST_THIRD). DELIVERY value (score-face cost, boundary 6 s per A1)
//       = shots-for the delivering side (shot count as the goal-value surrogate).
//   D4  Rest/offside/restart limbs route on their R3 within-arm event populations
//       (the arm where the limb fires); R0 is the paired reference for the
//       descriptive §2.5 curve. No per-tick cross-arm counterfactuals (A2's rule
//       applied uniformly — after divergence they are ill-defined).
//   D5  Excess-event populations: rest = index-1 (non-GK) body own-third→out
//       transitions on playing ticks; offside = pass releases flagged offside at
//       kick (pendingPass.offside===true — the pass-release-near-line binding
//       moment, "bodies pulled off the line"); restart = restart-phase onsets
//       (m.restart null→non-null, distinct events NOT ticks); delivery = R0
//       long-ball/cross/cutback events, anchored at their possession-spell origin.
//   D6  CLASS H permutation null (B=2000, seed 97103): within each match, cost is
//       attributed to its nearest preceding SAME-SIDE excess anchor; the null
//       redraws each anchor a uniform time in the match's own playing-tick span
//       (anchor count + side preserved), re-attributes, and pools beyond/within
//       cost mass across matches; p = #{perm beyond-fraction ≥ observed}/B.
//   D7  CLASS S within-cell contrast is computed POOLED over in-support playing
//       moments with a match-cluster bootstrap CI (per-context sub-counts reported);
//       the 150-moment per-(context×role×candidate) census-cell floors are a
//       V4-P2/V3-P1 construct not reconstructed here (this stage classifies, it does
//       not price). Sub-states per §2.3: rest slot-held/abandoned, offside
//       beyond-line/onside, restart restart-adjacent/open, delivery wide/central.
//   D8  DOWNSTREAM-WATCH (A2): an R0 delivery build-up is "covered" if its origin
//       state matches another route's remedy region — index-1 body deep in own
//       third (H deep-held) ∨ a restart within the last 5 s (J restart-adjacent) ∨ a
//       wide-held station present (|y|>15 m, station-family, non-owner). Cluster
//       proportion CI; lower bound > 0.5 ⇒ downstream-watch (REPORTED, never a stop).
//
// Output: docs/world-model/data/stage3-v4-p0-autopsy-map.json (SHA'd; the fresh
// corpus twice byte-identical, X-DET). The RUN writes it — a smoke never does.

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
  STATION_FAMILY, newStationEyeTrace,
  type RoleConditionedTable, type RoleControlLevels, type StationEyeTrace,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// =============================================================================
// FROZEN STAGING (prereg §3 / §2.2 / §2.4)
// =============================================================================
// mining corpus — REUSES the P3a seeds byte-for-byte (§2.2): the SAME arms from the
// SAME frozen seeds/config; same seeds + same flags + byte-identical src ⇒
// byte-identical matches.
const MINE_SEED_START = 9_300_000;
const MINE_BLOCK_STRIDE = 100_000;
const MINE_BLOCKS = 4;
const MINE_MATCHES_PER_BLOCK = 200; // 4 × 200 = 800 per arm

// fresh incumbent reference (§2.4) — 400 matches, seeds 9,700,000+k, DISJOINT from
// every consumed family (a 100k gap above P3a's 9.600199M).
const REF_SEED_START = 9_700_000;
const REF_MATCHES = 400;

// cluster bootstrap (#20) + permutation (#80.2 / I11) — the frozen fresh seeds.
const BOOTSTRAP_SEED = 97_003; // §2.4 (disjoint from 93003/92110/91110/91100/90730/79002/62003/50041)
const BOOTSTRAP_RESAMPLES = 2000;
const PERM_SEED = 97_103; // §2.3 CLASS H lag-mass permutation only
const PERM_B = 2000;

// routing thresholds (frozen §2.3)
const PERM_ALPHA = 0.025; // permutation p < 0.025 ⇒ beyond-horizon mass dominates
const SUPPORT_MAJORITY = 0.5; // J iff support-out CI lower > 0.5; in-support iff upper < 0.5

// face-matched CLASS H boundaries (A1): concede face 10 s, score face 6 s (bin edges).
const BOUNDARY_CONCEDE_S = 10;
const BOUNDARY_SCORE_S = 6;

// lag bins pinned ex ante (§2.5) — the 6 s score-face and 10 s concede-face horizons
// are bin edges; ">boundary" = the union of bins whose LOWER edge ≥ boundary.
const BIN_EDGES = [0, 2, 4, 6, 10, 15, 30, Number.POSITIVE_INFINITY] as const;
const N_BINS = BIN_EDGES.length - 1; // 7

// instrument constants (§2 / P3a verbatim)
const REST_THIRD = HALF_L / 3; // I5 own-third depth (P3a REST_THIRD)
const SPEED_GATE = 2.5; // de-glue speed gate (P3a release classification)
const MOMENT_SPACING_S = 2.0; // V3-P1 sub-state sampling spacing (§2.3 predicate)
const NEAR_LINE_M = 2; // pass-release-"near-line" band (§2.4 offside binding moment)
const WIDE_HELD_Y = 15; // |y| threshold for a "wide-held" station (D7/D8)
const RESTART_ADJ_S = 5; // "restart-adjacent" window (D7/D8)
const RECEIPT_CAP = 1000; // per-class receipts cap (#49.3), first-N deterministic

// the injected table + control (never bundled in src/**; the V3-P2/P3a pattern §2.2)
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
const CAP_MINE = process.env.V4P0_CAP_MINE
  ? Math.max(1, Number.parseInt(process.env.V4P0_CAP_MINE, 10)) : Number.POSITIVE_INFINITY;
const CAP_REF = process.env.V4P0_CAP_REF
  ? Math.max(1, Number.parseInt(process.env.V4P0_CAP_REF, 10)) : Number.POSITIVE_INFINITY;
const SKIP_DET = process.env.V4P0_SKIP_DET === '1';
const IS_SMOKE = Number.isFinite(CAP_MINE) || Number.isFinite(CAP_REF);
const OUT_PATH = process.env.V4P0_OUT ?? 'docs/world-model/data/stage3-v4-p0-autopsy-map.json';

// =============================================================================
// THE DESIGNATION / MACHINERY MAP (§2.1) — read-only, to file:line. The P0
// REFERENCE MAP; per I8 designations are mapped here, NEVER priced.
// =============================================================================
const DESIGNATION_MAP = {
  note: 'The P0 reference map (I8 use #1 of TWO; the other is the battery verdict '
    + 'instrument, V4-P4 I5(b)). Designations are MAPPED, never a priced state, never a '
    + 'consumer input, never in the value field. Anchors verified read-only for this freeze.',
  restDefenceAssignment: {
    'src/sim/Player.ts:25': 'readonly index: number — the roster slot; ROLES = '
      + "['GK','DF','MF','WG','WG','ST'] ⇒ index 1 = the sole DF (the rest-defence body)",
    'src/sim/types.ts:27': "export const ROLES = ['GK','DF','MF','WG','WG','ST'] — the "
      + 'index→role binding (index 1 = DF)',
    'src/ai/formations.ts:169-183': "formationSpot (table path): if (p.index === 1 && "
      + "p.role !== 'GK') — the DF slot NEVER joins the siege; depth = the coverBias "
      + 'SWEEPER gene (Phase 88), −8..−16 m; THIS is the rest-defence carve',
    'src/ai/formations.ts:260-263': 'emergentStation (emergent path): the SAME p.index === 1 carve',
    'battery proxy': 'P3a restSlotShare = deep.some((p) => p.index === 1) '
      + '(stage3-v3-p3a-deployment.ts:588)',
  },
  restartStationMachinery: {
    'src/ai/formations.ts:430-442': 'shapeReady(team, ball, radius=6) — the keeper waits for '
      + 'the INCUMBENT attacking shape (formationSpot, hasBall=true) before releasing a goal '
      + 'kick / held ball; ≥3 outfielders within 6 m of their incumbent spots. The '
      + 'restart-resettle designation (the #88.1 re-restart loop).',
    'src/sim/Match.ts:484': "phase: MatchPhase = 'kickoff' — the phase machine",
    'src/sim/Match.ts:784': 'restart: RestartState | null — the live dead-ball state',
    'src/sim/Match.ts:2371-2372': "awardRestart sets this.restart = {...} and this.phase = "
      + "'restart' — the restart-phase ONSET (distinct restart event)",
    'src/sim/Match.ts:2665-2666': "restart resolved: this.restart = null; this.phase = 'playing'",
    'src/sim/Match.ts:1160': "if (this.phase === 'restart') this.stepRestart(dt)",
  },
  offsideMachinery: {
    'src/ai/formations.ts:466-480': 'offsideLineLocalX(team, opponents, ballLocalX) — the '
      + 'second-last opponent (the real law)',
    'src/ai/formations.ts:448-456': 'defenderLineLocalX — the last defensive line',
    'src/ai/formations.ts:490-504': 'runTarget — aims BEYOND the line; the executor holds at '
      + 'the line',
    'src/ai/formations.ts:516-527': 'runBurstPoint — the burst the instant the kick releases '
      + 'the hold',
    'src/sim/Match.ts:1487-1490': 'the offside JUDGMENT: pendingPass.offside judged AT KICK '
      + 'TIME (Phase 29) — the pass-release-near-line binding moment',
    'src/sim/Match.ts:2302-2318': 'callOffside(offender, spot): attTeam.stats.offsides++ (the '
      + 'flag increment) + a goalKick restart to the defenders (restart.offside = true)',
  },
} as const;

// =============================================================================
// SMALL NUMERIC HELPERS (P3a verbatim where shared)
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

// the injected role table + control (never bundled in src/**; the V3-P2 pattern §2.2).
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
// source; read READ-ONLY). CLASS J uses the support-out fraction against this.
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
// THE EVENT-RECORDING HARNESS (§2.2). One match, one arm. Records BOTH the
// P3a-identity aggregates (for X-CORPUS-IDENT) and the routing event streams.
// =============================================================================
interface Anchor { t: number; side: 0 | 1 } // simTime seconds
interface CostEvent { t: number; side: 0 | 1; mass: number }
interface OffsideMoment { t: number; side: 0 | 1; offside: boolean; outcome: number; inSup: boolean; ctx: string }
interface SubStateSample { t: number; side: 0 | 1; group: 'A' | 'B'; outcome: number; ctx: string }
interface DeliveryOrig { t: number; side: 0 | 1; wide: boolean; inSup: boolean; covered: boolean }

// shared accumulators (R3-only, accumulated across ALL matches — P3a pattern).
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
  // --- P3a identity aggregates (deterministic; the X-CORPUS-IDENT set) ---
  restSlotShare: [number, number]; // per side (I5(b))
  offsides: [number, number]; // per side (t.stats.offsides)
  restartTicks: number;
  band: { goals: number; crosses: number; headers: number; longBalls: number; cutbacks: number }; // both-side SUM
  // --- routing event streams (R0/R3) ---
  playSpan: [number, number]; // [firstPlayingTime, lastPlayingTime] seconds — for the permutation redraw
  concedeCost: [CostEvent[], CostEvent[]]; // per side — the concession surrogate (D3)
  scoreValue: [CostEvent[], CostEvent[]]; // per side — shots-for (score-face value, D3)
  restEvents: Anchor[]; // index-1 own-third→out transitions (D5)
  restInSup: boolean[]; // support eval per rest event (aligned to restEvents)
  restSub: SubStateSample[]; // slot-held vs slot-abandoned (D7)
  offsideMoments: OffsideMoment[]; // pass-release-near-line moments (D5/D7)
  restartEvents: Anchor[]; // restart-phase onsets (D5)
  restartInSup: boolean[]; // support eval per restart event (phase≠playing ⇒ OUT)
  restartSub: SubStateSample[]; // restart-adjacent vs open (D7)
  deliveryOrigs: DeliveryOrig[]; // R0: delivery build-up origins (A2 / D5)
  deliveryValue: CostEvent[]; // R0: value events tied to delivery side (score-face)
  deliverySub: SubStateSample[]; // wide-held vs central (D7)
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

  // identity accumulators
  const restTicks: [number, number] = [0, 0];
  const restSlotTicks: [number, number] = [0, 0];
  let restartTicks = 0;

  // per-role reconstruction (R3; reads m.stationEyeState directly — P3a pattern)
  const roleOf = new Map<number, Role>();
  for (const p of m.allPlayers) roleOf.set(p.gid, p.role);
  const lastUntil = new Map<number, number>();

  // release ledger tracking (R3; P3a verbatim)
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = m.ball.owner?.side ?? null;

  // routing event streams
  const concedeCost: [CostEvent[], CostEvent[]] = [[], []];
  const scoreValue: [CostEvent[], CostEvent[]] = [[], []];
  const restEvents: Anchor[] = [];
  const restInSup: boolean[] = [];
  const restSub: SubStateSample[] = [];
  const offsideMoments: OffsideMoment[] = [];
  const restartEvents: Anchor[] = [];
  const restartInSup: boolean[] = [];
  const restartSub: SubStateSample[] = [];
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
  const oppDeepPrev: [boolean, boolean] = [false, false]; // ball (owned by opp) in side S's own third
  let prevPendingT: number | null = null;
  let prevRestartNull = m.restart === null;
  const spellStart: [number, number] = [0, 0]; // per-side possession-spell start time (D5)
  let prevPoss: number | -1 = m.possessionSide; // for spell-origin flips
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

    // --- I5(b) restSlotShare 6 Hz sampling (P3a VERBATIM, folded into the single
    // match so identity is guaranteed): every 10th tick, playing; the hasBall side's
    // deep outfielders; restSlot iff an index-1 (DF) body is deep. ---
    if (tick % 10 === 0 && playing) {
      for (const t of m.teams) {
        const side = t.side as 0 | 1;
        if (m.possessionSide !== side) continue;
        const deep = t.players.filter((p) => p.role !== 'GK' && !p.sentOff && t.localX(p.pos.x) < -REST_THIRD);
        restTicks[side] += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks[side] += 1;
      }
    }

    // --- per-role deviation reconstruction (R3; P3a verbatim) ---
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

    // --- ownership release ledger (R3; P3a verbatim classification) ---
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
        scoreValue[side].push({ t: nowT, side, mass: n }); // value FOR side
        const conc = (1 - side) as 0 | 1; // a shot for `side` is a shot AGAINST `conc`
        concedeCost[conc].push({ t: nowT, side: conc, mass: n });
      }
      prevShots[side] = shotsNow;
    }
    // deep-entry against side S (ball owned by the opponent, in S's own third — fresh)
    for (const side of [0, 1] as const) {
      const oppOwns = owner !== null && owner.side !== side;
      const inOwnThird = oppOwns && m.teams[side].localX(m.ball.pos.x) < -REST_THIRD && playing;
      if (inOwnThird && !oppDeepPrev[side]) {
        concedeCost[side].push({ t: nowT, side, mass: 1 });
      }
      oppDeepPrev[side] = inOwnThird;
    }

    // --- possession-spell origin (D5): a side's spell starts the tick it (re)gains
    // possession (possessionSide flips to it). Used as the delivery build-up origin. ---
    if (m.possessionSide !== -1 && m.possessionSide !== prevPoss) {
      spellStart[m.possessionSide as 0 | 1] = nowT;
    }
    if (m.possessionSide !== -1) prevPoss = m.possessionSide;

    // --- rest-slot excess events (D5): index-1 own-third→out transition (playing) ---
    for (const side of [0, 1] as const) {
      const b = index1Of(side);
      const deepNow = b !== null && playing && m.teams[side].localX(b.pos.x) < -REST_THIRD;
      if (b !== null && playing && index1DeepPrev[side] && !deepNow) {
        // abandonment transition
        restEvents.push({ t: nowT, side });
        restInSup.push(inSupport(m, b));
      }
      index1DeepPrev[side] = deepNow;
    }

    // --- rest-slot sub-state samples (D7): held vs abandoned, 2 s spacing (playing) ---
    if (playing && nowT - lastSubSampleT >= MOMENT_SPACING_S) {
      lastSubSampleT = nowT;
      for (const side of [0, 1] as const) {
        const b = index1Of(side);
        if (b === null) continue;
        const held = m.teams[side].localX(b.pos.x) < -REST_THIRD;
        restSub.push({ t: nowT, side, group: held ? 'A' : 'B', outcome: Number.NaN, ctx: contextOf(m, b) });
      }
      // restart-adjacency sub-state (D7): restart-adjacent (within RESTART_ADJ_S of an onset) vs open
      for (const side of [0, 1] as const) {
        const adj = nowT - lastRestartOnset[side] <= RESTART_ADJ_S;
        restartSub.push({ t: nowT, side, group: adj ? 'A' : 'B', outcome: Number.NaN, ctx: 'restart-vs-open' });
      }
    }

    // --- offside binding moments (D5/D7): a NEW pass release ---
    if (m.pendingPass !== null && m.pendingPass.t !== prevPendingT) {
      prevPendingT = m.pendingPass.t;
      const pp = m.pendingPass;
      const side = pp.side as 0 | 1;
      // near-line? any non-GK non-passer teammate at/beyond the offside line band.
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
          inSup: inSupport(m, targetBody), ctx: targetBody ? contextOf(m, targetBody) : 'na',
        });
      }
    }

    // --- restart-phase onsets (D5): restart null→non-null ---
    const restartNull = m.restart === null;
    if (prevRestartNull && !restartNull && m.restart !== null) {
      const side = m.restart.side as 0 | 1;
      restartEvents.push({ t: nowT, side });
      restartInSup.push(inSupport(m, index1Of(side))); // phase==='restart' ⇒ OUT by construction
      lastRestartOnset[side] = nowT;
    }
    prevRestartNull = restartNull;

    // --- delivery events (R0 routing side, A2): long-ball/cross/cutback increments ---
    for (const side of [0, 1] as const) {
      const dNow = m.teams[side].stats.longBalls + m.teams[side].stats.crosses
        + m.teams[side].stats.cutbacks;
      if (dNow > prevDelivery[side] && arm === 'R0' && playing && owner !== null) {
        const origin = spellStart[side] > 0 ? spellStart[side] : nowT;
        const adv = mostAdvancedNonOwner(side) ?? owner;
        const wide = Math.abs(adv.pos.y) > WIDE_HELD_Y;
        // covered? (D8) index-1 deep ∨ restart within RESTART_ADJ_S ∨ a wide-held station.
        const idx1 = index1Of(side);
        const idx1Deep = idx1 !== null && m.teams[side].localX(idx1.pos.x) < -REST_THIRD;
        const restartAdj = nowT - lastRestartOnset[side] <= RESTART_ADJ_S;
        let wideHeld = false;
        for (const p of m.teams[side].players) {
          if (p.role === 'GK' || p.sentOff || m.ball.owner === p) continue;
          if (Math.abs(p.pos.y) > WIDE_HELD_Y && STATION_FAMILY.has(p.action.type)) { wideHeld = true; break; }
        }
        const covered = idx1Deep || restartAdj || wideHeld;
        deliveryOrigs.push({ t: origin, side, wide, inSup: inSupport(m, adv), covered });
        deliverySub.push({ t: origin, side, group: wide ? 'A' : 'B', outcome: Number.NaN, ctx: 'wide-vs-central' });
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

  // resolve the S-contrast + offside outcomes now that all cost streams exist.
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
  // delivery value events = shots-for the delivering side (score-face); pooled.
  for (const side of [0, 1] as const) for (const c of scoreValue[side]) deliveryValue.push(c);

  const firstT = Number.isFinite(firstPlayT) ? firstPlayT : 0;
  return {
    seed, arm, restSlotShare, offsides, restartTicks, band,
    playSpan: [firstT, Math.max(firstT, lastPlayT)],
    concedeCost, scoreValue, restEvents, restInSup, restSub,
    offsideMoments, restartEvents, restartInSup, restartSub,
    deliveryOrigs, deliveryValue, deliverySub,
  };
};

// =============================================================================
// STATISTICS — match-cluster bootstrap (#20) + within-match permutation (#80.2)
// =============================================================================

// generic match-cluster bootstrap CI over per-match "units" and a pooling stat.
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

// within-cell sub-state contrast CI: units = per-match {aSum,aN,bSum,bN}. stat =
// mean(A) − mean(B) (A = the limb's "fired" sub-state). Resolved iff CI excludes 0.
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

// paired R3−R0 per-bin CI (descriptive curve). units = per-match {r3,r0}. stat = mean(r3)−mean(r0).
const pairedBinCI = (perMatch: readonly { r3: number; r0: number }[], offset: number) => {
  const stat = (s: readonly { r3: number; r0: number }[]): number => {
    let a = 0; let b = 0; let n = 0;
    for (const u of s) { a += u.r3; b += u.r0; n += 1; }
    return n === 0 ? Number.NaN : (a - b) / n;
  };
  return clusterCI(perMatch, stat, offset);
};

// --- CLASS H mass-dominance permutation (A1 face-matched boundary) -----------
interface HMatch { anchors: Anchor[]; costs: CostEvent[]; span: [number, number] }
// attribute each cost to its nearest preceding SAME-SIDE anchor; bin by lag; sum
// beyond/within mass with the given boundary. Anchor lists are provided per match.
const attributeMass = (
  anchors: readonly Anchor[], costs: readonly CostEvent[], boundaryS: number,
): { beyond: number; within: number } => {
  // sort anchors by side then time for a nearest-preceding scan.
  const bySide: [number[], number[]] = [[], []];
  for (const a of anchors) bySide[a.side].push(a.t);
  bySide[0].sort((x, y) => x - y); bySide[1].sort((x, y) => x - y);
  let beyond = 0; let within = 0;
  for (const c of costs) {
    const arr = bySide[c.side];
    // nearest preceding anchor time (binary-ish linear scan; anchors are few).
    let best = Number.NaN;
    for (let i = arr.length - 1; i >= 0; i--) { if (arr[i] <= c.t) { best = arr[i]; break; } }
    if (!Number.isFinite(best)) continue; // no preceding anchor ⇒ unattributed, dropped
    const lag = c.t - best;
    const bin = binOf(lag);
    if (bin < 0) continue;
    if (binIsBeyond(bin, boundaryS)) beyond += c.mass; else within += c.mass;
  }
  return { beyond, within };
};

const hTest = (matches: readonly HMatch[], boundaryS: number, offset: number) => {
  // observed pooled beyond-fraction
  let obsBeyond = 0; let obsWithin = 0;
  for (const mm of matches) {
    const r = attributeMass(mm.anchors, mm.costs, boundaryS);
    obsBeyond += r.beyond; obsWithin += r.within;
  }
  const obsTot = obsBeyond + obsWithin;
  const beyondFraction = obsTot === 0 ? Number.NaN : obsBeyond / obsTot;
  const dominance = Number.isFinite(beyondFraction) && obsBeyond > obsWithin;
  // permutation null: redraw each anchor a uniform time in its match's playing span
  // (count + side preserved), re-attribute, pool.
  const rng = new Rng(PERM_SEED + offset);
  let ge = 0; let valid = 0;
  for (let b = 0; b < PERM_B; b++) {
    let pBeyond = 0; let pWithin = 0;
    for (const mm of matches) {
      const [lo, hi] = mm.span;
      const permAnchors: Anchor[] = mm.anchors.map((a) => ({
        t: hi > lo ? lo + rng.next() * (hi - lo) : a.t, side: a.side,
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
// THE ROUTING BATTERY (§2.3 as amended) — one limb → exactly one class.
// =============================================================================
type MClass = 'H' | 'S' | 'J' | 'UNROUTABLE';
interface LimbRoute {
  limb: string; routingArm: 'R0' | 'R3'; prior: string; costFace: 'concede' | 'score';
  nExcess: number;
  support: ReturnType<typeof supportOutCI>;
  h: ReturnType<typeof hTest>;
  hSingle6: ReturnType<typeof hTest>;
  hSingle10: ReturnType<typeof hTest>;
  s: ReturnType<typeof contrastCI>;
  route: MClass;
  routeReason: string;
  bothFired: boolean;
}

// the ordered dominance rule (frozen §2.3): J first; then in-support ⇒ H vs S (H>S
// on double fire); straddle or in-support-but-neither ⇒ UNROUTABLE.
const decideRoute = (
  support: ReturnType<typeof supportOutCI>, h: ReturnType<typeof hTest>,
  s: ReturnType<typeof contrastCI>,
): { route: MClass; reason: string; bothFired: boolean } => {
  if (support.firesJ) return { route: 'J', reason: 'support-out CI lower > 0.5 (jurisdiction first)', bothFired: false };
  if (!support.inSupport) return { route: 'UNROUTABLE', reason: 'support-out CI straddles 0.5 (jurisdiction ambiguous — neither bound clears)', bothFired: false };
  // resolvedly in support ⇒ decide H vs S.
  const both = h.firesH && s.resolved;
  if (h.firesH) return { route: 'H', reason: both ? 'beyond-boundary mass dominates (perm p<0.025) AND within-cell contrast resolved — H>S on double fire' : 'beyond-boundary mass dominates (perm p<0.025)', bothFired: both };
  if (s.resolved) return { route: 'S', reason: 'within-cell sub-state contrast resolved (CI excludes 0) at ≤ boundary; H does not dominate', bothFired: false };
  return { route: 'UNROUTABLE', reason: 'in support but neither H (no dominant beyond-boundary mass) nor S (no resolved within-cell contrast) fires', bothFired: false };
};

// =============================================================================
// THE FRESH INCUMBENT REFERENCE CORPUS (§2.4) — binding-moment base rates.
// =============================================================================
interface RefRow {
  seed: number;
  turnovers: number; // possession-loss transitions
  passReleaseNearLine: number; // the offside binding moment
  restartPhases: number; // distinct restart events (NOT ticks)
  deliveryBuildups: number; // header/long-ball/cutback build-ups
}
const runRefMatch = (seed: number): RefRow => {
  const m = matchOf(seed); // R0: eye null (no stationEye ever assigned)
  let turnovers = 0; let passReleaseNearLine = 0; let restartPhases = 0; let deliveryBuildups = 0;
  let lastValidPoss: number | -1 = -1;
  let prevPendingT: number | null = null;
  let prevRestartNull = m.restart === null;
  const prevDelivery: [number, number] = [
    m.teams[0].stats.longBalls + m.teams[0].stats.crosses + m.teams[0].stats.cutbacks,
    m.teams[1].stats.longBalls + m.teams[1].stats.crosses + m.teams[1].stats.cutbacks,
  ];
  while (!m.finished) {
    m.step(DT);
    if (m.finished) break;
    // turnovers (possession-loss transitions)
    const poss = m.possessionSide;
    if (poss !== -1) {
      if (lastValidPoss !== -1 && poss !== lastValidPoss) turnovers += 1;
      lastValidPoss = poss;
    }
    // pass-release-near-line moments
    if (m.pendingPass !== null && m.pendingPass.t !== prevPendingT) {
      prevPendingT = m.pendingPass.t;
      const pp = m.pendingPass;
      const side = pp.side as 0 | 1;
      const t = m.teams[side];
      const line = offsideLineLocalX(t, m.teams[1 - side].players, t.localX(m.ball.pos.x));
      let nearLine = pp.offside;
      if (!nearLine) {
        for (const p of t.players) {
          if (p.role === 'GK' || p.sentOff || p.gid === pp.passerGid) continue;
          if (t.localX(p.pos.x) >= line - NEAR_LINE_M) { nearLine = true; break; }
        }
      }
      if (nearLine) passReleaseNearLine += 1;
    }
    // restart phases (onsets)
    const restartNull = m.restart === null;
    if (prevRestartNull && !restartNull) restartPhases += 1;
    prevRestartNull = restartNull;
    // delivery build-ups (long-ball/cross/cutback increments, either side)
    for (const side of [0, 1] as const) {
      const dNow = m.teams[side].stats.longBalls + m.teams[side].stats.crosses + m.teams[side].stats.cutbacks;
      if (dNow > prevDelivery[side]) deliveryBuildups += dNow - prevDelivery[side];
      prevDelivery[side] = dNow;
    }
  }
  return { seed, turnovers, passReleaseNearLine, restartPhases, deliveryBuildups };
};

const runReference = (nMatches: number) => {
  const rows: RefRow[] = [];
  for (let k = 0; k < nMatches; k++) rows.push(runRefMatch(REF_SEED_START + k));
  const rate = (sel: (r: RefRow) => number, offset: number) => {
    const ci = clusterCI(rows.map(sel), (s) => mean(s as number[]), offset);
    return ci;
  };
  let off = 0;
  return {
    matches: rows.length,
    seedFamily: `${REF_SEED_START} + k, k in 0..${nMatches - 1}`,
    baseRates: {
      turnoversPerMatch: rate((r) => r.turnovers, off++),
      passReleaseNearLinePerMatch: rate((r) => r.passReleaseNearLine, off++),
      restartPhasesPerMatch: rate((r) => r.restartPhases, off++),
      deliveryBuildupsPerMatch: rate((r) => r.deliveryBuildups, off++),
    },
    totals: {
      turnovers: rows.reduce((s, r) => s + r.turnovers, 0),
      passReleaseNearLine: rows.reduce((s, r) => s + r.passReleaseNearLine, 0),
      restartPhases: rows.reduce((s, r) => s + r.restartPhases, 0),
      deliveryBuildups: rows.reduce((s, r) => s + r.deliveryBuildups, 0),
    },
    underPowered: rows.length < 30 ? 'PUBLISHED under-powered (never pooled, #24/#44.5)' : null,
  };
};

// =============================================================================
// X-CORPUS-IDENT (§2.2, HARD) — recompute the committed P3a aggregates + SHAs.
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
// THE EXPERIMENT
// =============================================================================
const runExperiment = () => {
  // --- mining seeds (P3a §2.2 verbatim) ---
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
  const r3Trace = newStationEyeTrace(); // one shared R3 trace (P3a pattern; write-only sink)
  const R0: MineRow[] = [];
  const R3: MineRow[] = [];
  for (const seed of mineSeeds) {
    R0.push(runMineMatch(seed, 'R0', null, null, null, null));
    R3.push(runMineMatch(seed, 'R3', release, perRole, receipts, r3Trace));
  }

  // --- X-CORPUS-IDENT (§2.2, HARD; A4 reframe) ---
  const p3a = JSON.parse(readFileSync(P3A_PATH, 'utf8')) as any;
  const hl = p3a.watchabilityHardLimbs;
  const bandC = p3a.equilibriumBand;
  const relC = p3a.structural.release;
  const perRoleC = p3a.perRole.byRole;
  const roleTvC = p3a.perRole.roleMixTV.mean as number;

  // recomputed aggregates
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
    // self-determinism: re-simulate the slice again and confirm the recompute is byte-identical.
    const R0b: MineRow[] = []; const R3b: MineRow[] = [];
    const rel2 = newReleaseLedger(); const pr2 = newPerRole(); const tr2 = newStationEyeTrace();
    for (const seed of mineSeeds) { R0b.push(runMineMatch(seed, 'R0', null, null, null, null)); R3b.push(runMineMatch(seed, 'R3', rel2, pr2, null, tr2)); }
    const a = JSON.stringify([R0.map((r) => r.restSlotShare), R3.map((r) => r.offsides), R3.map((r) => r.restartTicks), release]);
    const bch = JSON.stringify([R0b.map((r) => r.restSlotShare), R3b.map((r) => r.offsides), R3b.map((r) => r.restartTicks), rel2]);
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
  // ROUTING (§2.3 as amended). Route arm: R3 for rest/offside/restart, R0 for delivery.
  // =============================================================================
  const bySeedR0 = new Map(R0.map((r) => [r.seed, r]));
  let off = 100; // bootstrap/permutation offset cursor (disjoint from base-rate offsets)

  // ---- helper: support-out per-match {out,total} for a limb's excess events ----
  const supportUnits = (rows: MineRow[], pick: (r: MineRow) => boolean[]): { out: number; total: number }[] =>
    rows.map((r) => { const arr = pick(r); return { out: arr.filter((x) => !x).length, total: arr.length }; });

  // ---- REST-SLOT limb (prior H) ----
  const restH = hTest(R3.map((r) => ({ anchors: r.restEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const restH6 = hTest(R3.map((r) => ({ anchors: r.restEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const restH10 = restH; // concede face boundary IS 10 s
  const restSupport = supportOutCI(supportUnits(R3, (r) => r.restInSup), off++);
  const restS = contrastCI(R3.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const s of r.restSub) { if (s.group === 'B') { aSum += s.outcome; aN += 1; } else { bSum += s.outcome; bN += 1; } } // A=abandoned(B group), B=held(A group)
    return { aSum, aN, bSum, bN };
  }), off++);
  const restDec = decideRoute(restSupport, restH, restS);
  const restRoute: LimbRoute = {
    limb: 'rest-defence slot (DEGEN-RESTDEF, I5(b))', routingArm: 'R3', prior: 'H', costFace: 'concede',
    nExcess: R3.reduce((s, r) => s + r.restEvents.length, 0),
    support: restSupport, h: restH, hSingle6: restH6, hSingle10: restH10, s: restS,
    route: restDec.route, routeReason: restDec.reason, bothFired: restDec.bothFired,
  };

  // ---- OFFSIDE limb (prior S) ----
  const offsideAnchors = (r: MineRow): Anchor[] => r.offsideMoments.filter((o) => o.offside).map((o) => ({ t: o.t, side: o.side }));
  const offH = hTest(R3.map((r) => ({ anchors: offsideAnchors(r), costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const offH6 = hTest(R3.map((r) => ({ anchors: offsideAnchors(r), costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const offSupport = supportOutCI(R3.map((r) => { const arr = r.offsideMoments.filter((o) => o.offside).map((o) => o.inSup); return { out: arr.filter((x) => !x).length, total: arr.length }; }), off++);
  const offS = contrastCI(R3.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const o of r.offsideMoments) { if (o.offside) { aSum += o.outcome; aN += 1; } else { bSum += o.outcome; bN += 1; } } // A=beyond-line, B=onside
    return { aSum, aN, bSum, bN };
  }), off++);
  const offDec = decideRoute(offSupport, offH, offS);
  const offsideRoute: LimbRoute = {
    limb: 'offsides (C-OFFSIDE)', routingArm: 'R3', prior: 'S', costFace: 'concede',
    nExcess: R3.reduce((s, r) => s + r.offsideMoments.filter((o) => o.offside).length, 0),
    support: offSupport, h: offH, hSingle6: offH6, hSingle10: offH, s: offS,
    route: offDec.route, routeReason: offDec.reason, bothFired: offDec.bothFired,
  };

  // ---- RESTART limb (prior J) ----
  const restartH = hTest(R3.map((r) => ({ anchors: r.restartEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const restartH6 = hTest(R3.map((r) => ({ anchors: r.restartEvents, costs: [...r.concedeCost[0], ...r.concedeCost[1]], span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const restartSupport = supportOutCI(supportUnits(R3, (r) => r.restartInSup), off++);
  const restartS = contrastCI(R3.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const s of r.restartSub) { if (s.group === 'A') { aSum += s.outcome; aN += 1; } else { bSum += s.outcome; bN += 1; } } // A=restart-adjacent, B=open
    return { aSum, aN, bSum, bN };
  }), off++);
  const restartDec = decideRoute(restartSupport, restartH, restartS);
  const restartRoute: LimbRoute = {
    limb: 'restart resettle (C-RESTART)', routingArm: 'R3', prior: 'J', costFace: 'concede',
    nExcess: R3.reduce((s, r) => s + r.restartEvents.length, 0),
    support: restartSupport, h: restartH, hSingle6: restartH6, hSingle10: restartH, s: restartS,
    route: restartDec.route, routeReason: restartDec.reason, bothFired: restartDec.bothFired,
  };

  // ---- DELIVERY limb (prior H; routes ENTIRELY on R0 per A2) ----
  const delAnchors = (r: MineRow): Anchor[] => r.deliveryOrigs.map((d) => ({ t: d.t, side: d.side }));
  const delCosts = (r: MineRow): CostEvent[] => r.deliveryValue; // shots-for (score face), same side pooling
  const delH = hTest(R0.map((r) => ({ anchors: delAnchors(r), costs: delCosts(r), span: r.playSpan })), BOUNDARY_SCORE_S, off++);
  const delH10 = hTest(R0.map((r) => ({ anchors: delAnchors(r), costs: delCosts(r), span: r.playSpan })), BOUNDARY_CONCEDE_S, off++);
  const delSupport = supportOutCI(R0.map((r) => { const arr = r.deliveryOrigs.map((d) => d.inSup); return { out: arr.filter((x) => !x).length, total: arr.length }; }), off++);
  const delS = contrastCI(R0.map((r) => {
    let aSum = 0; let aN = 0; let bSum = 0; let bN = 0;
    for (const s of r.deliverySub) { if (s.group === 'A') { aSum += s.outcome; aN += 1; } else { bSum += s.outcome; bN += 1; } } // A=wide, B=central
    return { aSum, aN, bSum, bN };
  }), off++);
  const delDec = decideRoute(delSupport, delH, delS);
  // DOWNSTREAM-WATCH (A2 / D8): fraction of R0 delivery build-ups from covered states.
  const dwCI = clusterCI(R0.map((r) => ({ cov: r.deliveryOrigs.filter((d) => d.covered).length, tot: r.deliveryOrigs.length })),
    (s) => { let c = 0; let t = 0; for (const u of s) { c += u.cov; t += u.tot; } return t === 0 ? Number.NaN : c / t; }, off++);
  const downstreamWatch = Number.isFinite(dwCI.lower) && dwCI.lower > SUPPORT_MAJORITY;
  const deliveryRoute: LimbRoute & { downstreamWatch: boolean; downstreamWatchCI: typeof dwCI; note: string } = {
    limb: 'delivery economy (§2 band break)', routingArm: 'R0', prior: 'H (+downstream-watch)', costFace: 'score',
    nExcess: R0.reduce((s, r) => s + r.deliveryOrigs.length, 0),
    support: delSupport, h: delH, hSingle6: delH, hSingle10: delH10, s: delS,
    route: delDec.route, routeReason: delDec.reason, bothFired: delDec.bothFired,
    downstreamWatch, downstreamWatchCI: dwCI,
    note: 'A2: routes on the INCUMBENT/R0 side (R0 build-ups; chain lag origin→shot-for; '
      + 'R0-moment contrasts). No cross-arm tick counterfactuals. Downstream-watch = coverage '
      + 'by other routes’ remedies (D8), REPORTED not a stop.',
  };

  const limbs = [restRoute, offsideRoute, restartRoute, deliveryRoute];
  const anyUnroutable = limbs.some((l) => l.route === 'UNROUTABLE');
  const allRoute = limbs.every((l) => l.route === 'H' || l.route === 'S' || l.route === 'J');

  // =============================================================================
  // TIME-TO-COST CURVES (§2.5) — descriptive per-bin R3/R0 (or R0-only delivery).
  // =============================================================================
  const curveFor = (
    arm: MineRow[], pairArm: MineRow[] | null, anchorsOf: (r: MineRow) => Anchor[],
    costsOf: (r: MineRow) => CostEvent[], offBase: number,
  ) => {
    // per-match per-bin attributed cost mass (attribute to nearest preceding same-side anchor).
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
    const pairBins = pairArm ? new Map(pairArm.map((r, i) => [r.seed, binMass(r)])) : null;
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
    restSlot: curveFor(R3, R0, (r) => r.restEvents, (r) => [...r.concedeCost[0], ...r.concedeCost[1]], curveOff), // concede
    offside: (curveOff += N_BINS, curveFor(R3, R0, (r) => r.offsideMoments.filter((o) => o.offside).map((o) => ({ t: o.t, side: o.side })), (r) => [...r.concedeCost[0], ...r.concedeCost[1]], curveOff)),
    restart: (curveOff += N_BINS, curveFor(R3, R0, (r) => r.restartEvents, (r) => [...r.concedeCost[0], ...r.concedeCost[1]], curveOff)),
    delivery: (curveOff += N_BINS, curveFor(R0, null, (r) => r.deliveryOrigs.map((d) => ({ t: d.t, side: d.side })), (r) => r.deliveryValue, curveOff)),
    binEdges: BIN_EDGES.map((e) => (e === Infinity ? 'inf' : e)),
    note: 'DESCRIPTIVE (I7): form frozen here; numbers pin W_hold/W_long at V4-P2 (a fresh dataset). '
      + 'restSlot/offside/restart = concede-surrogate hazard (R3−paired R0) per bin; delivery = '
      + 'delivery-value hazard on R0 (A2), no cross-arm pairing.',
  };

  return {
    mining: {
      seeds: mineSeeds.length, seedFormula: '9,300,000 + blockIndex*100,000 + k (R0+R3, D1)',
      tableCanonicalSha, controlSha,
    },
    routing: { limbs, anyUnroutable, allRoute },
    xCorpusIdent: { pass: xCorpusIdent, mode: identMode, tableShaOk, controlShaOk, recomputed, checks },
    reference: null as ReturnType<typeof runReference> | null, // filled at top level (double-run/X-DET)
    curves,
    receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
  };
};

// =============================================================================
// TOP LEVEL — assemble, X-DET on the fresh corpus, X-SRC-ZERO, SHA, write.
// =============================================================================
const canonical = (v: unknown): string => JSON.stringify(v);

const experiment = runExperiment();

// fresh reference + X-DET double-run (§2.4)
const refMatches = Number.isFinite(CAP_REF) ? CAP_REF : REF_MATCHES;
const ref1 = runReference(refMatches);
const ref2 = SKIP_DET ? ref1 : runReference(refMatches);
const xDet = SKIP_DET ? false : canonical(ref1) === canonical(ref2);
experiment.reference = ref1;

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
  xDet: SKIP_DET ? null : xDet, // HARD
  xSrcZero, // HARD
  routingComplete: experiment.routing.allRoute && !experiment.routing.anyUnroutable,
};

// A SMOKE is a preflight of the machinery, NEVER a verdict (its capped populations
// make every routing CI noise). The real verdict is the uncapped full run's.
const verdict = IS_SMOKE
  ? 'SMOKE (preflight) — NOT a verdict; exercises compile + X-CORPUS-IDENT-slice + '
    + 'X-DET + X-SRC-ZERO logic only. Routing on a capped slice is meaningless noise.'
  : experiment.routing.anyUnroutable
    ? 'STOP AT COMMANDER — a limb is UNROUTABLE (§6 / reading B)'
    : (!experiment.xCorpusIdent.pass)
      ? 'FAIL — X-CORPUS-IDENT (§2.2): the re-sim is NOT the P3a corpus (drift/config); STOP'
      : (!xSrcZero)
        ? 'FAIL — X-SRC-ZERO: src touched or fingerprint moved; STOP'
        : (!SKIP_DET && !xDet)
          ? 'FAIL — X-DET: fresh corpus not byte-identical; STOP'
          : experiment.routing.allRoute
            ? 'ALL FOUR LIMBS ROUTE (reading A) — returns to the commander; licenses V4-P1'
            : 'INCOMPLETE';

const body = {
  experiment: 'STAGE3-V4-P0 (the autopsy map — route the three fired limbs)',
  authority: 'STAGE3-V4-P0-AUTOPSY-MAP §2-§5 as amended (ruling #93 A1-A4); contract '
    + 'STAGE3-V4-LONG-HORIZON-PRICE (I1-I11)',
  head,
  world: 'ENRICHED (#67.3: edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off)',
  flags: CENSUS_FLAGS,
  smoke: IS_SMOKE ? { capMine: Number.isFinite(CAP_MINE) ? CAP_MINE : null, capRef: Number.isFinite(CAP_REF) ? CAP_REF : null, skipDet: SKIP_DET } : null,
  parameters: {
    mining: experiment.mining,
    reference: { seeds: `${REF_SEED_START}+k`, matches: refMatches },
    bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
    permSeed: PERM_SEED, permB: PERM_B, permAlpha: PERM_ALPHA,
    boundaryConcedeS: BOUNDARY_CONCEDE_S, boundaryScoreS: BOUNDARY_SCORE_S,
    lagBins: BIN_EDGES.map((e) => (e === Infinity ? 'inf' : e)),
    clusterUnit: 'match seed (#20)',
    amendments: {
      A1: 'H boundary FACE-MATCHED: concede-face cost 10 s, score-face cost 6 s; single-boundary (6/10-for-all) readings published as labelled data.',
      A2: 'delivery limb routes on the INCUMBENT/R0 side (R0 build-ups, chain lag origin→shot-for, R0-moment contrasts); NO cross-arm tick counterfactuals; downstream-watch = coverage by other remedies.',
      A3: "designation p.index===1 defines the rest limb's excess population only (battery-verdict-instrument use); never a priced cell or consumer.",
      A4: 'ordered dominance H>S on double fire; 400-match fresh corpus @9.7M; X-CORPUS-IDENT = aggregate-recompute + input SHA (drift trips the gate); enriched-R0 reference; #80.2 permutation-for-dispersion scope.',
    },
  },
  designationMap: DESIGNATION_MAP,
  xCorpusIdent: experiment.xCorpusIdent,
  routing: experiment.routing,
  reference: experiment.reference,
  timeToCostCurves: experiment.curves,
  fidelity: {
    xDet: SKIP_DET ? 'SKIPPED (smoke)' : xDet,
    xSrcZero: { pass: xSrcZero, srcDiffEmpty: srcDiff === '', srcDiff, fingerprintBaseline: FINGERPRINT_BASELINE, fingerprintObserved: fingerprint, matches: xFpProd },
  },
  receipts: experiment.receipts,
  gates,
  verdict,
};

const sha256 = createHash('sha256').update(canonical(body)).digest('hex');
const output = { ...body, sha256 };

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

// --- concise stderr line -----------------------------------------------------
const r = experiment.routing.limbs;
console.error(
  `V4-P0 ${verdict}`
  + ` · HEAD ${head}${IS_SMOKE ? ' · SMOKE' : ''}`
  + ` · mining ${experiment.mining.seeds}×(R0,R3)`
  + ` · X-CORPUS-IDENT ${experiment.xCorpusIdent.pass} (${experiment.xCorpusIdent.checks.filter((c) => !c.ok).length} fails)`
  + ` · routes rest=${r[0].route} offside=${r[1].route} restart=${r[2].route} delivery=${r[3].route}`
  + ` (dw ${(r[3] as any).downstreamWatch})`
  + ` · xDet ${SKIP_DET ? 'skip' : xDet} · xSrcZero ${xSrcZero} (fp ${xFpProd})`
  + ` · SHA ${sha256.slice(0, 12)}`,
);
