// STAGE III V4-P3p-2b — THE PARTIAL CONSUMER (the five-arm fork-grain instrument)
//
// Authority: docs/world-model/STAGE3-V4-P3P2-CONSUMER.md (the FROZEN
// pre-registration; §3–§6 as #117-AMENDED, ratified by rulings #117/#118). This
// probe is the FIRST live consumption of the P3p-1 MERGED extended-key role table
// (`mergedTableSha 39662445…9d6105`) by the v3 role eye behind the EXISTING
// `eye.v4` flags — the consumption wiring itself was built and ratified at P3p-2a
// (commit bff06e0; `priceApproachesV3Partial` + the child-vs-base ledger fields in
// src/ai/stationEye.ts, the extended-key seam in src/ai/actionExecutor.ts, the
// optional `eye.v3.children`/`mergedTableSha` config in src/sim/Match.ts). This
// probe TOUCHES NO src: it INJECTS the committed merged table's `base` (as the v3
// roleTable) + `children` + `mergedTableSha`, arms the three `eye.v4` flags per
// arm, and READS the trace ledger the src writes. Nothing ships (Road B): every EDS
// flag is dormant in production, `stationEye` null, the `eye.v4` flags absent, and
// the production fingerprint 57b0bdab…c673 is unchanged throughout.
//
// TWO LAYERS (one probe):
//   (A) the FIVE WHOLE-MATCH SCOPE ARMS (§3.2) — R0 / R1p / R2p / R3p / R3v3, paired
//       same-seed. Each arm plays a full match with its eye config live; the four
//       pre-named fork-grain / per-match MEDIATORS (offside rate, delivery events,
//       restart resettle, rest-slot occupancy I5(b), §4) and the CONSUMPTION LEDGER
//       (in-support classes / bit tri-states / child-vs-base reads, §4) fall out of
//       the whole-match play + the eye's own trace. Contrasts R3p−R0 and R3p−R3v3,
//       cluster CIs (cluster = match seed, B=2000, bootstrap seed 99703). R1p/R2p
//       are PRUNABLE (§3.2 prune rule — the smoke measures per-arm wall cost).
//   (B) the FORK-GRAIN DEV/PC INSTRUMENT (the V3-P2 heritage, §3.3) — a base walk
//       (eye null) at the same band; at each sampled station decision a CONTROL
//       fork (X5) alongside a NEUTRAL partial-eye fork (DEV, on the perceived-
//       attainable IN-SUPPORT denominator) and an INVERTED partial-eye fork (PC).
//       X4 clone coverage / X5 control identity / X6 force fidelity / X7 = X-DET.
//
// TWO MODES (explicit `V4P3P2_MODE`, NO default):
//   smoke — 40 matches @ 11,000,000 + k (#117). Publishes: the partial-eye
//           perceived-attainable share + realised DEV (is the 0.22 floor reachable
//           under the in-support restriction, §3.3); the per-match mediator rates +
//           cluster-CI half-widths; the per-arm per-match WALL COST (the prune
//           input) + the disclosed prune decision; the disclosed-rule N* (CI-width +
//           wall-cost budget); the consumption-time perceived-ageTicks histogram
//           (the 30-tick stale pins, §5.1(iv)). Writes stage3-v4-p3p2-sizing-smoke.json.
//   run   — V4P3P2_N matches @ 11,100,000 + k (#117). The gate-bearing run; writes
//           stage3-v4-p3p2-consumer.json. Detached, the commander's session (#49.5).
//
// Stats seeds: bootstrap 99703, permutation 99803 (99803 RESERVED for symmetry with
// the seed banding; the P3p-2 gates are bootstrap-based — no permutation test here).
//
// Gates (all HARD, §6.1): X4 clone · X5 control-fork identity · X6 force fidelity ·
// X7/X-DET (double byte-identical) · DEV (partial-eye NEUTRAL dev share on the
// in-support denominator ≥ 0.22) · PC (inverted resolves below control, 95% cluster-
// bootstrap upper < 0) · X-MERGE-SHA (loaded mergedTableSha == 39662445…9d6105 AND
// base rehash == 171a6dad…6559f) · X-FP-PROD (57b0bdab…c673 unchanged, flags off) ·
// seed disjointness. BONUS receipts: X-OFF-IDENT (children injected + flags OFF ==
// plain v3, the injection dormancy) · X-SRC-ZERO (`git diff --stat -- src` empty —
// this probe adds no src). Mediators (§4) are REPORTED, never gating (§6.1).
//
// COMMAND LINES:
//   smoke:  V4P3P2_MODE=smoke npx tsx scripts/probes/stage3-v4-p3p2-consumer.ts
//   run:    V4P3P2_MODE=run V4P3P2_N=<disclosed-rule N> \
//           npx tsx scripts/probes/stage3-v4-p3p2-consumer.ts
//
// BOUNDED-PREFLIGHT env caps (labelled; a preflight REFUSES to write a canonical
// repo path — redirect to /tmp): V4P3P2_MATCH_CAP (cap seeds), V4P3P2_MAX_MOMENTS
// (cap fork moments), V4P3P2_MATCH_DURATION (shorten matches), V4P3P2_ARMS (csv arm
// subset), V4P3P2_SKIP_FP=1 (skip the fingerprint), V4P3P2_MERGED (alternate table
// path for the X-MERGE-SHA self-test), V4P3P2_OUT_SMOKE / V4P3P2_OUT_RUN (redirect).
//
// ⚠ BUILD NOTE (#114.2): the smoke's consumption-time ageTicks read pulls
// `match.perceivedSnapshot(body)`, which MUTATES the body's perception memory in the
// ENRICHED world (edsEagerPerception OFF). It is taken on a THROWAWAY CLONE so the
// base match `m` (and every fork clone) is left byte-identical. The eye's OWN percept
// reads inside the forks are the src's, consumed not reimplemented.
import { createHash } from 'node:crypto';
import { writeFileSync, readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import {
  EYE_LATTICE, STATION_FAMILY, localXBand, newStationEyeTrace,
  type RoleConditionedTable, type RoleControlLevels, type MergedChildTable,
  type StationEyeTrace,
} from '../../src/ai/stationEye';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// =============================================================================
// MODE + frozen parameters
// =============================================================================
const MODE = process.env.V4P3P2_MODE;                // 'smoke' | 'run'; validated in main()
const IS_RUN = MODE === 'run';

/** §5.2 (#117 amendment): fresh bands, disjoint above the P3p-1 census high-water. */
const SEED_START = IS_RUN ? 11_100_000 : 11_000_000;
/** smoke = 40 (env-overridable for the bounded preflight only, labelled);
 *  run = V4P3P2_N (REQUIRED, no default, validated in main). */
const N_REQUESTED = IS_RUN ? envInt('V4P3P2_N', -1) : envInt('V4P3P2_SMOKE_MATCHES', 40);
/** bounded-preflight cap on the number of seeds (labelled). */
const MATCH_CAP = envInt('V4P3P2_MATCH_CAP', Number.POSITIVE_INFINITY);
const MATCHES = Number.isFinite(MATCH_CAP) ? Math.min(N_REQUESTED, MATCH_CAP) : N_REQUESTED;
/** bounded-preflight cap on fork-grain moments (labelled). */
const MOMENT_TARGET = envInt('V4P3P2_MAX_MOMENTS', 1_000_000_000);

/** V3-P2 §6 verbatim horizons. */
const W_S = 3.0;
const W_TICKS = Math.round(W_S / DT);
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const MOMENT_SPACING_S = 2.0;
/** V3-P2 §3.3(2) / recensus: the nominal percept warm-up. REPORTED as the heritage's
 *  parameter; NO artificial pre-warm loop is added (the percept is warmed by the base
 *  match's own play up to the decision tick, exactly as V3-P2/recensus — which report
 *  WARMUP_TICKS but apply no extra loop). Flagged in `deviations`. */
const WARMUP_TICKS = 15;
/** §4 I5(b): own-third depth (P0b/P1/P2b REST_THIRD). */
const REST_THIRD = HALF_L / 3;
/** bounded-preflight match-duration override (labelled); real runs use 240. */
const MATCH_DURATION = envInt('V4P3P2_MATCH_DURATION', 240);

const BOOTSTRAP_RESAMPLES = 2000;                    // #20
const BOOTSTRAP_SEED = 99703;                        // §5.2 (fresh, disjoint)
const PERM_SEED = 99803;                             // §5.2 RESERVED (no permutation test here)
const DEV_FLOOR = 0.22;                              // §3.3 carried; smoke re-confirms reachability
const X6_EPS = 1e-9;

/** §3.2 prune rule (disclosed BEFORE the run) — over the 5-arm per-match wall budget
 *  ⇒ prune the R1p/R2p gradient rungs (keep R0/R3p/R3v3). My disclosed operationalised
 *  budget (flagged, §9); the smoke records the measured cost + the decision, no re-cut. */
const PRUNE_WALL_BUDGET_MS_PER_MATCH = envInt('V4P3P2_WALL_BUDGET_MS', 60_000);
/** §5.1 N rule: disclosed CI-width half-width targets for the two PRIMARY mediators
 *  (the two the bits index), on the R3p−R0 contrast. Flagged (§9). */
const CI_HALFWIDTH_TARGET: Readonly<Record<string, number>> = { offsideRate: 0.5, deliveryEvents: 2.0 };
const N_STEP = 40;                                   // fixed-step N grid (the P3p-1 smoke-size genre)
const N_MAX = 2000;                                  // N* cap (beyond ⇒ return to commander)

/** X-FP-PROD: the frozen shipped-world production fingerprint (P3a/P0b/P3p-1 verbatim). */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;
const SKIP_FP = process.env.V4P3P2_SKIP_FP === '1';  // bounded-preflight only, labelled

/** §2.3: the committed P3p-1 merged table (base + children + SHA). */
const MERGED_PATH = process.env.V4P3P2_MERGED
  ?? 'docs/world-model/data/stage3-v4-p3p1-merged-role-census-table.json';
const MERGED_SHA_EXPECTED =
  '39662445f253b21a97f13e21fb0187340063dd53413464cbe02701f63e9d6105';
const BASE_SHA_EXPECTED =
  '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f';
/** §2.3: the V3-P2 recovered control levels (SHA 968349ff…acc1c). */
const CONTROL_PATH = process.env.V4P3P2_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v3-p2-control-recovery.json';

const SMOKE_OUT = process.env.V4P3P2_OUT_SMOKE
  ?? 'docs/world-model/data/stage3-v4-p3p2-sizing-smoke.json';
const RUN_OUT = process.env.V4P3P2_OUT_RUN
  ?? 'docs/world-model/data/stage3-v4-p3p2-consumer.json';

/** §RESULT / #67.3: the ENRICHED world — the substrate the v3 table + merged children
 *  were censused on (identical CENSUS_FLAGS as V3-P2 / P3p-1). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- the five arms (§3.2) ----------------------------------------------------
const ALL_ARMS = ['R0', 'R1p', 'R2p', 'R3p', 'R3v3'] as const;
type Arm = (typeof ALL_ARMS)[number];
/** the minimal complete set kept under any prune (gives R3p−R0, R3p−R3v3, R3v3−R0). */
const MINIMAL_ARMS: readonly Arm[] = ['R0', 'R3p', 'R3v3'];
const PRUNABLE_ARMS: readonly Arm[] = ['R1p', 'R2p'];

/** §3.2: which arms this invocation runs. env override (csv) → else all five (the
 *  maximal complete set; the smoke DISCLOSES a prune, the commander decides). */
const resolveArms = (): { arms: Arm[]; source: string } => {
  const env = process.env.V4P3P2_ARMS;
  if (env !== undefined && env.trim() !== '') {
    const req = env.split(',').map((s) => s.trim());
    const bad = req.filter((a) => !(ALL_ARMS as readonly string[]).includes(a));
    if (bad.length > 0) throw new Error(`V4P3P2_ARMS unknown arm(s): ${bad.join(',')}`);
    const arms = ALL_ARMS.filter((a) => req.includes(a));
    for (const m of MINIMAL_ARMS) if (!arms.includes(m)) throw new Error(`V4P3P2_ARMS must keep the minimal set ${MINIMAL_ARMS.join('/')}; missing ${m}`);
    return { arms: [...arms], source: 'env V4P3P2_ARMS' };
  }
  return { arms: [...ALL_ARMS], source: 'default (all five; prune disclosed at smoke)' };
};

// =============================================================================
// preflight guard — a capped invocation must NOT write a canonical repo path
// =============================================================================
const OUT_PATH = IS_RUN ? RUN_OUT : SMOKE_OUT;
const PREFLIGHT = Number.isFinite(MATCH_CAP) || process.env.V4P3P2_MAX_MOMENTS !== undefined
  || SKIP_FP || MATCH_DURATION !== 240 || process.env.V4P3P2_ARMS !== undefined
  || process.env.V4P3P2_MERGED !== undefined;
const isCanonicalRepoPath = (p: string): boolean => p.startsWith('docs/world-model/data/');

// --- helpers -----------------------------------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const percentile = (sorted: readonly number[], q: number): number => (
  sorted.length === 0 ? Number.NaN
    : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]
);
const sha = (v: unknown): string => createHash('sha256').update(JSON.stringify(v)).digest('hex');

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
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, ...CENSUS_FLAGS,
});

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// =============================================================================
// the injected merged table + control (X-MERGE-SHA) — never bundled in src/**
// =============================================================================
interface MergedTableFile {
  mergedTableSha: string; baseTableSha?: string; baseTableShaObserved?: string;
  base: RoleConditionedTable; children: MergedChildTable; mergedChildCount?: number; keying?: string;
}
const rawMerged = JSON.parse(readFileSync(MERGED_PATH, 'utf8')) as MergedTableFile;
const roleTable: RoleConditionedTable = rawMerged.base;
const children: MergedChildTable = rawMerged.children;
const mergedTableSha = rawMerged.mergedTableSha;

/** X-MERGE-SHA: the loaded mergedTableSha == 39662445…9d6105 AND its `base` rehashes
 *  to the injected v3 base 171a6dad…6559f (= the P3p-1 identity), AND the field
 *  reproduces from {base, children} (self-consistency, the recensus computation). */
const buildMergeSha = () => {
  const baseRehash = sha(roleTable);
  const mergedRehash = sha({ base: roleTable, children });
  const mergedShaOk = mergedTableSha === MERGED_SHA_EXPECTED && mergedRehash === MERGED_SHA_EXPECTED;
  const baseShaOk = baseRehash === BASE_SHA_EXPECTED;
  return {
    mergedShaField: mergedTableSha, mergedShaExpected: MERGED_SHA_EXPECTED, mergedRehash,
    baseRehash, baseShaExpected: BASE_SHA_EXPECTED,
    mergedShaOk, baseShaOk, pass: mergedShaOk && baseShaOk,
    path: MERGED_PATH, mergedChildCount: rawMerged.mergedChildCount, keying: rawMerged.keying,
  };
};

const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: RoleControlLevels; sha256: string; pooledControl: number; guard: { pass: boolean };
};
const control: RoleControlLevels = rawControl.control;

// =============================================================================
// arm eye configs (§3.1/§3.2) — R3v3 base ≡ R3p base byte-for-byte (same object)
// =============================================================================
type EyeConfig = NonNullable<Match['stationEye']>;
/** the WHOLE-MATCH arm eye (arm value = neutral; the SCOPE + partial-ness vary). */
const armEye = (arm: Arm, seed: number, trace: StationEyeTrace | undefined): EyeConfig | null => {
  if (arm === 'R0') return null;
  const scope: EyeConfig['scope'] = arm === 'R1p' ? { kind: 'body', gid: 1 + (seed % 5) }
    : arm === 'R2p' ? { kind: 'team', side: 0 as Side }
      : { kind: 'both' };
  if (arm === 'R3v3') {
    // the ATTRIBUTION baseline: plain v3, NO children, NO eye.v4 flags.
    return { arm: 'neutral', scope, table: {}, v3: { roleTable, control }, trace };
  }
  // R1p / R2p / R3p: the PARTIAL eye — v3 base + injected children + all three flags.
  return {
    arm: 'neutral', scope, table: {},
    v3: { roleTable, control, children, mergedTableSha },
    v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
    trace,
  };
};
/** the FORK-GRAIN partial eye (§3.3): the PARTIAL config, scoped to the sampled body,
 *  NEUTRAL (DEV) or INVERTED (PC). Control forks pass arm=null (null eye). */
const partialForkEye = (arm: 'neutral' | 'inverted', gid: number, trace: StationEyeTrace | undefined): EyeConfig => ({
  arm, scope: { kind: 'body', gid }, table: {},
  v3: { roleTable, control, children, mergedTableSha },
  v4: { inSupportLaw: true, deliveryBit: true, offsideBit: true },
  trace,
});

// =============================================================================
// LAYER A — the five whole-match scope arms (mediators + ledger + wall cost)
// =============================================================================
interface MatchMediators {
  offsideRate: number;        // offsides both sides / match
  deliveryEvents: number;     // (longBalls + crosses + cutbacks) both sides / match
  restartTicks: number;       // §4 in-support law index: phase==='restart' ticks / match
  restSlotOccupancy: number;  // §4 I5(b): mean(both sides) held-in-own-third fraction
  restSlotS0: number; restSlotS1: number;
}
const emptyTrace = newStationEyeTrace;
/** sum every StationEyeTrace field (incl. the v4 ledger). */
const addTrace = (a: StationEyeTrace, b: StationEyeTrace): void => {
  a.decisions += b.decisions; a.deviate += b.deviate;
  a.abstainNoSnapshot += b.abstainNoSnapshot; a.abstainNoBall += b.abstainNoBall;
  a.abstainNoOwner += b.abstainNoOwner; a.noCell += b.noCell; a.tie += b.tie;
  a.nonStationTicks += b.nonStationTicks; a.overrideTicks += b.overrideTicks;
  a.ctxSeen += b.ctxSeen; a.ctxAgree += b.ctxAgree; a.ctxAgreeFace += b.ctxAgreeFace;
  a.ctxAgreeThreat += b.ctxAgreeThreat; a.ctxAgreeDensity += b.ctxAgreeDensity;
  a.v4InSupport += b.v4InSupport; a.v4OosPhase += b.v4OosPhase; a.v4OosUnseen += b.v4OosUnseen;
  a.v4OosInflight += b.v4OosInflight; a.v4OosStale += b.v4OosStale;
  a.v4WidthHeld0 += b.v4WidthHeld0; a.v4WidthHeld1 += b.v4WidthHeld1; a.v4WidthHeldUnknown += b.v4WidthHeldUnknown;
  a.v4BeyondLine0 += b.v4BeyondLine0; a.v4BeyondLine1 += b.v4BeyondLine1; a.v4BeyondLineUnknown += b.v4BeyondLineUnknown;
  a.v4DeliveryChild += b.v4DeliveryChild; a.v4DeliveryBase += b.v4DeliveryBase;
  a.v4OffsideChild += b.v4OffsideChild; a.v4OffsideBase += b.v4OffsideBase;
  for (const [k, v] of b.byCandidate) a.byCandidate.set(k, (a.byCandidate.get(k) ?? 0) + v);
  for (const [k, v] of b.byContext) a.byContext.set(k, (a.byContext.get(k) ?? 0) + v);
};

/** play ONE full match under `arm`, returning the per-match mediators, the arm's own
 *  whole-match trace (the ledger source), and the wall cost. Deterministic (the wall
 *  time is not — it is carried separately and stripped from X-DET/SHA). */
const playArm = (seed: number, arm: Arm): { mediators: MatchMediators; trace: StationEyeTrace | null; wallMs: number } => {
  const t0 = Date.now();
  const m = matchOf(seed);
  const trace = arm === 'R0' ? null : emptyTrace();
  m.stationEye = armEye(arm, seed, trace ?? undefined);
  let restartTicks = 0;
  let heldS0 = 0; let presentS0 = 0; let heldS1 = 0; let presentS1 = 0;
  while (!m.finished) {
    m.step(DT);
    if (m.phase === 'restart') restartTicks += 1;
    if (m.phase === 'playing') {
      for (const side of [0, 1] as const) {
        const t = m.teams[side];
        const b = t.players.find((p) => p.index === 1 && !p.sentOff);
        if (b === undefined) continue;
        const held = t.localX(b.pos.x) < -REST_THIRD ? 1 : 0;
        if (side === 0) { presentS0 += 1; heldS0 += held; } else { presentS1 += 1; heldS1 += held; }
      }
    }
  }
  const s = [m.teams[0].stats, m.teams[1].stats];
  const restSlotS0 = presentS0 === 0 ? Number.NaN : heldS0 / presentS0;
  const restSlotS1 = presentS1 === 0 ? Number.NaN : heldS1 / presentS1;
  const mediators: MatchMediators = {
    offsideRate: s[0].offsides + s[1].offsides,
    deliveryEvents: s[0].longBalls + s[0].crosses + s[0].cutbacks + s[1].longBalls + s[1].crosses + s[1].cutbacks,
    restartTicks,
    restSlotOccupancy: mean([restSlotS0, restSlotS1].filter(Number.isFinite)),
    restSlotS0: round(restSlotS0), restSlotS1: round(restSlotS1),
  };
  m.stationEye = null;
  return { mediators, trace, wallMs: Date.now() - t0 };
};

// --- the consumption ledger view (§4) ----------------------------------------
const ledgerOf = (t: StationEyeTrace) => {
  const bitDelivery = t.v4WidthHeld0 + t.v4WidthHeld1 + t.v4WidthHeldUnknown;
  const bitOffside = t.v4BeyondLine0 + t.v4BeyondLine1 + t.v4BeyondLineUnknown;
  const inSupportAttainable = t.v4InSupport - t.noCell;   // §3.3: in-support AND in-power own-role cell
  const oosTotal = t.v4OosPhase + t.v4OosUnseen + t.v4OosInflight + t.v4OosStale;
  return {
    decisions: t.decisions, deviate: t.deviate, tie: t.tie, noCell: t.noCell,
    abstainUnseen: t.abstainNoSnapshot + t.abstainNoBall + t.abstainNoOwner,
    // in-support classes (does the law close ≈ the out-of-support surface?)
    inSupport: t.v4InSupport, oosPhase: t.v4OosPhase, oosUnseen: t.v4OosUnseen,
    oosInflight: t.v4OosInflight, oosStale: t.v4OosStale, oosTotal,
    oosShare: round(oosTotal / ((t.v4InSupport + oosTotal) || 1)),
    // bit tri-states by family (delivery ≈ 39% fire / 60.7% UNKNOWN #116.3; offside census rate)
    widthHeld0: t.v4WidthHeld0, widthHeld1: t.v4WidthHeld1, widthHeldUnknown: t.v4WidthHeldUnknown,
    deliveryBitFireRate: round(t.v4WidthHeld1 / (bitDelivery || 1)),
    deliveryUnknownShare: round(t.v4WidthHeldUnknown / (bitDelivery || 1)),
    beyondLine0: t.v4BeyondLine0, beyondLine1: t.v4BeyondLine1, beyondLineUnknown: t.v4BeyondLineUnknown,
    offsideBeyondShare: round(t.v4BeyondLine1 / (bitOffside || 1)),
    offsideUnknownShare: round(t.v4BeyondLineUnknown / (bitOffside || 1)),
    // child-vs-base reads by family (a remedy whose child count ≈ 0 never fires ⇒ reading (C))
    deliveryChild: t.v4DeliveryChild, deliveryBase: t.v4DeliveryBase,
    deliveryChildShare: round(t.v4DeliveryChild / ((t.v4DeliveryChild + t.v4DeliveryBase) || 1)),
    offsideChild: t.v4OffsideChild, offsideBase: t.v4OffsideBase,
    offsideChildShare: round(t.v4OffsideChild / ((t.v4OffsideChild + t.v4OffsideBase) || 1)),
    // DEV pieces (§3.3): the in-support perceived-attainable denominator = tie+deviate
    // (in-support AND priceable context AND an in-power own-role cell).
    inSupportAttainable,
    devShareInSupport: round(t.deviate / (inSupportAttainable || 1)),
    // the would-be denominator WITHOUT the in-support law (upper bound): the OOS
    // decisions the law removed from pricing would otherwise have entered it. Shows
    // how far the in-support restriction shrank the denominator vs the plain v3 eye (§3.3).
    plainAttainable: inSupportAttainable + oosTotal,
  };
};

// =============================================================================
// LAYER B — the fork-grain DEV/PC instrument (V3-P2 heritage, re-pointed §3.3)
// =============================================================================
interface Exceptions {
  ePaused: number; eCarrier: number; eBallWon: number; eSentOff: number;
  eOnside: number; eBarred: number; eEnded: number; eNonStation: number; eRedecided: number;
  ok: number; unexplained: number;
}
const newExceptions = (): Exceptions => ({
  ePaused: 0, eCarrier: 0, eBallWon: 0, eSentOff: 0, eOnside: 0, eBarred: 0,
  eEnded: 0, eNonStation: 0, eRedecided: 0, ok: 0, unexplained: 0,
});
interface ForkOutcome {
  readonly score: boolean; readonly concede: boolean;
  readonly ended: boolean; readonly deviated: boolean; readonly candidateId: string | null;
  readonly signature: string;
}
const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);

const runFork = (
  before: Match, gid: number, side: number, arm: 'neutral' | 'inverted' | null,
  x6: Exceptions, trace: StationEyeTrace | null,
): ForkOutcome => {
  const fork = cloneSimulationState(before);
  const body = fork.allPlayers.find((p) => p.gid === gid)!;
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const shots0 = mine.stats.shots;
  const conceded0 = theirs.stats.shots;
  const startTick = fork.simTick;
  const localTrace = trace === null ? null : emptyTrace();
  if (arm !== null) fork.stationEye = partialForkEye(arm, gid, localTrace ?? undefined);

  let score = false;
  let ended = false;
  let deviated = false;
  let candidateId: string | null = null;
  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    const stBefore = fork.stationEyeState.get(gid);
    const overrideExpected = stBefore !== undefined && stBefore.offset !== null && STATION_FAMILY.has(body.action.type);
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;

    fork.step(DT);

    if (arm !== null) {
      const st = fork.stationEyeState.get(gid);
      if (st !== undefined && st.offset !== null && st.candidateId !== 'control') {
        deviated = true;
        if (candidateId === null) candidateId = st.candidateId;
      }
      const tr = body.c4Trace;
      if (tr !== null) {
        if (Math.abs(tr.applied.x - tr.meet.x) <= X6_EPS && Math.abs(tr.applied.y - tr.meet.y) <= X6_EPS) x6.ok += 1;
        else if (body.clampTrace === 'barred') x6.eBarred += 1;
        else if (body.clampTrace === 'onside') x6.eOnside += 1;
        else x6.unexplained += 1;
      } else if (overrideExpected) {
        const stAfter = fork.stationEyeState.get(gid);
        if (pausedBefore || fork.phase !== 'playing') x6.ePaused += 1;
        else if (body.sentOff) x6.eSentOff += 1;
        else if (ownerBefore === body || fork.ball.owner === body) x6.eCarrier += 1;
        else if (!STATION_FAMILY.has(body.action.type)) x6.eNonStation += 1;
        else if (stAfter === undefined || stAfter.untilTick !== stBefore!.untilTick || stAfter.candidateId !== stBefore!.candidateId) x6.eRedecided += 1;
        else if (fork.ball.owner !== null && fork.ball.owner.side !== side) x6.eBallWon += 1;
        else x6.unexplained += 1;
      }
    }

    if (fork.simTick - startTick === H_SCORE_TICKS) score = mine.stats.shots > shots0;
    if (fork.finished) ended = true;
  }
  if (fork.simTick - startTick < H_SCORE_TICKS) score = mine.stats.shots > shots0;
  if (ended) x6.eEnded += 1;
  if (localTrace !== null && trace !== null) addTrace(trace, localTrace);
  fork.stationEye = null;

  return { score, concede: theirs.stats.shots > conceded0, ended, deviated, candidateId, signature: signatureOf(fork) };
};

/** the smoke-only consumption-time ageTicks read — on a THROWAWAY CLONE (#114.2), so
 *  the base match is never mutated. Collects the perceived ageTicks of the body's own
 *  attacking-half outfield teammates (the 30-tick stale pin is visible in the hist). */
const readAgeOnClone = (m: Match, gid: number, side: number, out: number[]): void => {
  const clone = cloneSimulationState(m);
  const body = clone.allPlayers.find((p) => p.gid === gid)!;
  const snap = clone.perceivedSnapshot(body);
  if (snap === null) return;
  const localXOf = (x: number): number => clone.teams[side].localX(x);
  for (const q of snap.players) {
    if (q.side !== side || q.gid === gid || q.gid % TEAM_SIZE === 0) continue;
    if (localXOf(q.pos.x) < 0) continue;   // attacking half only (widthHeldBit's own filter)
    out.push(q.ageTicks);
  }
};

interface ForkRow { readonly cluster: number; readonly outcomes: Record<string, ForkOutcome> }
const runForkBlock = (collectAge: boolean) => {
  const rows: ForkRow[] = [];
  const x6 = newExceptions();
  const tNeutral = emptyTrace();
  const tInverted = emptyTrace();
  const ageSamples: number[] = [];
  let moments = 0; let clonesTaken = 0; let x5Checked = 0; let x5Mismatched = 0;
  let rotation = 0; let ballDirectedSkipped = 0;

  for (let k = 0; k < MATCHES && moments < MOMENT_TARGET; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    while (!m.finished && moments < MOMENT_TARGET) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { m.step(DT); continue; }
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      if (!STATION_FAMILY.has(body.action.type)) { ballDirectedSkipped += 1; m.step(DT); continue; }

      if (collectAge) {
        const face = side === owner!.side ? 'ours' : 'theirs';
        const threat = localXBand(mine.localX(m.ball.pos.x));
        if (face === 'ours' && (threat === 'middle' || threat === 'theirThird')) readAgeOnClone(m, body.gid, side, ageSamples);
      }

      const clone = cloneSimulationState(m);
      clonesTaken += 1;
      lastMomentTime = m.simTime;
      moments += 1;

      const outcomes: Record<string, ForkOutcome> = {};
      outcomes.neutral = runFork(clone, body.gid, side, 'neutral', x6, tNeutral);
      outcomes.control = runFork(clone, body.gid, side, null, x6, null);
      outcomes.inverted = runFork(clone, body.gid, side, 'inverted', x6, tInverted);

      if (moments % 25 === 0) {
        const plain = cloneSimulationState(clone);
        for (let i = 0; i < H_CONCEDE_TICKS && !plain.finished; i++) plain.step(DT);
        x5Checked += 1;
        if (signatureOf(plain) !== outcomes.control.signature) x5Mismatched += 1;
      }

      rows.push({ cluster: seed, outcomes });
      m.step(DT);
    }
  }
  return { rows, x6, tNeutral, tInverted, ageSamples, moments, clonesTaken, x5Checked, x5Mismatched, ballDirectedSkipped };
};

// =============================================================================
// statistics — cluster bootstrap (cluster = match seed, B=2000, seed 99703)
// =============================================================================
/** paired VALUE(id) − VALUE(control) over non-ended fork pairs (the ATE), for PC. */
const pairedForkCI = (rows: readonly ForkRow[], id: string, offset: number) => {
  const usable = rows.filter((r) => r.outcomes[id] !== undefined && !r.outcomes[id].ended && !r.outcomes.control.ended);
  const byCluster = new Map<number, ForkRow[]>();
  for (const r of usable) { const b = byCluster.get(r.cluster) ?? []; b.push(r); byCluster.set(r.cluster, b); }
  const clusters = [...byCluster.values()];
  const diff = (rs: readonly ForkRow[]) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => signed(r.outcomes[id]) - signed(r.outcomes.control))));
  const point = diff(usable);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: ForkRow[] = [];
    for (let i = 0; i < clusters.length; i++) for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    const v = diff(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  return { n: usable.length, point: round(point), lower: round(percentile(draws, 0.025)), upper: round(percentile(draws, 0.975)) };
};

/** a cluster (=seed) bootstrap over per-seed values (one value per cluster), for the
 *  whole-match mediator contrasts. `vals[i]` = { cluster: seed, v: mediator diff }. */
const clusterBootstrap = (vals: { cluster: number; v: number }[], offset: number) => {
  const byC = new Map<number, number[]>();
  for (const x of vals) { const a = byC.get(x.cluster) ?? []; a.push(x.v); byC.set(x.cluster, a); }
  const clusters = [...byC.values()];
  const point = mean(vals.map((x) => x.v));
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let sum = 0; let cnt = 0;
    for (let i = 0; i < clusters.length; i++) { const c = clusters[rng.int(0, clusters.length - 1)]; for (const v of c) { sum += v; cnt += 1; } }
    if (cnt > 0) draws.push(sum / cnt);
  }
  draws.sort((a, b) => a - b);
  const lower = percentile(draws, 0.025);
  const upper = percentile(draws, 0.975);
  return { n: vals.length, point: round(point), lower: round(lower), upper: round(upper), halfWidth: round((upper - lower) / 2) };
};

const histogram = (xs: readonly number[], edges: readonly number[]) => {
  const counts = new Array(edges.length + 1).fill(0);
  for (const x of xs) { let b = edges.length; for (let i = 0; i < edges.length; i++) { if (x < edges[i]) { b = i; break; } } counts[b] += 1; }
  const sorted = [...xs].sort((a, b) => a - b);
  return { edges: [...edges], counts, n: xs.length, p50: round(percentile(sorted, 0.5), 4), p95: round(percentile(sorted, 0.95), 4) };
};

// =============================================================================
// X-FP-PROD + seed disjointness + X-SRC-ZERO + X-OFF-IDENT
// =============================================================================
const productionFingerprint = (): { fingerprint: string; pass: boolean } => {
  if (SKIP_FP) return { fingerprint: 'SKIPPED(V4P3P2_SKIP_FP=1; bounded-preflight only)', pass: true };
  const fpLeague = new League({ seed: FINGERPRINT_SEED });
  const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
  });
  const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
  return { fingerprint, pass: fingerprint === FINGERPRINT_BASELINE };
};

const seedDisjointness = () => {
  // the P3p-1 census high-water (480 @ 10.5M ⇒ ≤ 10,500,479) AND the #111-ratified
  // P3p-3 battery reservation 10.6M..10.9M + reserved bootstrap 99603 (#117: untouched).
  const BATTERY_HI = 10_900_000 + 99_999;
  const smokeOk = 11_000_000 > BATTERY_HI;
  const runOk = 11_100_000 > BATTERY_HI;
  const boot: number = BOOTSTRAP_SEED;
  const perm: number = PERM_SEED;
  const statsOk = boot > 99_000 && perm > 99_000
    && boot !== perm && boot !== 99_603 && perm !== 99_603;
  return { pass: smokeOk && runOk && statsOk, batteryReservation: '10.6M..10.9M (#111, untouched)', smokeStart: 11_000_000, runStart: 11_100_000, bootstrapSeed: BOOTSTRAP_SEED, permutationSeed: PERM_SEED, statsOk };
};

/** X-SRC-ZERO: this probe adds NO src (P3p-2a's named-file change is already committed). */
const srcZero = () => {
  let srcDiff = '';
  try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }
  return { pass: srcDiff === '', srcDiff };
};

/** X-OFF-IDENT (the injection dormancy): with the children INJECTED but all three
 *  eye.v4 flags OFF, whole-match consumption is byte-identical to plain v3 (R3v3). */
const offIdent = (seed: number) => {
  const play = (withChildrenFlagsOff: boolean): string => {
    const m = matchOf(seed);
    m.stationEye = withChildrenFlagsOff
      ? { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control, children, mergedTableSha }, v4: { inSupportLaw: false, deliveryBit: false, offsideBit: false } }
      : { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control } };
    while (!m.finished) m.step(DT);
    const sig = signatureOf(m);
    m.stationEye = null;
    return sig;
  };
  const withChildrenOff = play(true);
  const plainV3 = play(false);
  return { pass: withChildrenOff === plainV3, sigChildrenFlagsOff: withChildrenOff, sigPlainV3: plainV3 };
};

// =============================================================================
// the deterministic science (LAYER A + LAYER B) — run twice for X-DET
// =============================================================================
const MEDIATOR_KEYS = ['offsideRate', 'deliveryEvents', 'restartTicks', 'restSlotOccupancy'] as const;
type MediatorKey = (typeof MEDIATOR_KEYS)[number];

const computeScience = (arms: readonly Arm[], collectAge: boolean) => {
  // --- LAYER A: the whole-match arms ---
  const medBySeed: Record<string, Map<number, MatchMediators>> = {};
  const traceByArm: Record<string, StationEyeTrace | null> = {};
  const wallByArm: Record<string, number> = {};
  for (const arm of arms) { medBySeed[arm] = new Map(); traceByArm[arm] = arm === 'R0' ? null : emptyTrace(); wallByArm[arm] = 0; }
  for (let k = 0; k < MATCHES; k++) {
    const seed = SEED_START + k;
    for (const arm of arms) {
      const r = playArm(seed, arm);
      medBySeed[arm].set(seed, r.mediators);
      wallByArm[arm] += r.wallMs;
      if (r.trace !== null && traceByArm[arm] !== null) addTrace(traceByArm[arm]!, r.trace);
    }
  }
  const seeds = Array.from({ length: MATCHES }, (_, k) => SEED_START + k);

  const perArmMediators = Object.fromEntries(arms.map((arm) => [arm, Object.fromEntries(
    MEDIATOR_KEYS.map((mk) => [mk, round(mean(seeds.map((s) => (medBySeed[arm].get(s) as MatchMediators)[mk]).filter(Number.isFinite)), 4)]),
  )])) as Record<string, Record<MediatorKey, number>>;

  const contrast = (a: Arm, b: Arm, mk: MediatorKey, offset: number) => {
    if (!arms.includes(a) || !arms.includes(b)) return null;
    const vals = seeds.map((s) => {
      const va = (medBySeed[a].get(s) as MatchMediators)[mk];
      const vb = (medBySeed[b].get(s) as MatchMediators)[mk];
      return { cluster: s, v: va - vb };
    }).filter((x) => Number.isFinite(x.v));
    return clusterBootstrap(vals, offset);
  };
  const mediatorContrasts = Object.fromEntries(MEDIATOR_KEYS.map((mk, i) => [mk, {
    'R3p-R0': contrast('R3p', 'R0', mk, 10 + i * 4),
    'R3p-R3v3': contrast('R3p', 'R3v3', mk, 11 + i * 4),
    'R3v3-R0': contrast('R3v3', 'R0', mk, 12 + i * 4),
  }]));

  const ledger = Object.fromEntries(arms.filter((a) => traceByArm[a] !== null).map((a) => [a, ledgerOf(traceByArm[a]!)]));

  // --- LAYER B: the fork-grain DEV/PC instrument ---
  const fb = runForkBlock(collectAge);
  const nLedger = ledgerOf(fb.tNeutral);
  const attainableInSupport = fb.tNeutral.v4InSupport - fb.tNeutral.noCell;
  const devShareInSupport = round(fb.tNeutral.deviate / (attainableInSupport || 1));
  const pc = pairedForkCI(fb.rows, 'inverted', 100);
  const neutralAte = pairedForkCI(fb.rows, 'neutral', 200);
  const x6Total = fb.x6.ok + fb.x6.ePaused + fb.x6.eCarrier + fb.x6.eBallWon + fb.x6.eSentOff
    + fb.x6.eOnside + fb.x6.eBarred + fb.x6.eNonStation + fb.x6.eRedecided + fb.x6.unexplained;

  const forkGrain = {
    moments: fb.moments, clonesTaken: fb.clonesTaken, ballDirectedSkipped: fb.ballDirectedSkipped,
    x5Checked: fb.x5Checked, x5Mismatched: fb.x5Mismatched,
    x6: { ...fb.x6, total: x6Total },
    neutralTrace: nLedger, neutralAte, pc,
    dev: {
      deviate: fb.tNeutral.deviate, inSupportAttainable: attainableInSupport,
      devShareInSupport, plainAttainable: nLedger.plainAttainable, floor: DEV_FLOOR,
      inSupportShrinkFactor: round(attainableInSupport / (nLedger.plainAttainable || 1)),
    },
    gatesRaw: {
      x4Clone: fb.clonesTaken === fb.moments && fb.moments > 0,
      x5Control: fb.x5Checked > 0 && fb.x5Mismatched === 0,
      x6Force: x6Total > 0 && fb.x6.unexplained === 0,
      dev: attainableInSupport > 0 && devShareInSupport >= DEV_FLOOR,
      pc: Number.isFinite(pc.upper) && pc.upper < 0,
    },
  };

  const ageHist = collectAge ? histogram(fb.ageSamples, [0, 5, 10, 15, 20, 25, 30, 45, 60, 90]) : null;

  return { perArmMediators, mediatorContrasts, ledger, forkGrain, ageHist, wallByArm, seeds };
};

// =============================================================================
// the sizing / N rule (smoke) — disclosed CI-width + wall-cost budget
// =============================================================================
const computeSizing = (sci: ReturnType<typeof computeScience>, armsRun: readonly Arm[]) => {
  const perArmPerMatchWallMs = Object.fromEntries(armsRun.map((a) => [a, round((sci.wallByArm[a] ?? 0) / (MATCHES || 1), 2)]));
  const fiveArmPerMatchWallMs = round(ALL_ARMS.reduce((s, a) => s + ((sci.wallByArm[a] ?? 0) / (MATCHES || 1)), 0), 2);
  const prune = fiveArmPerMatchWallMs > PRUNE_WALL_BUDGET_MS_PER_MATCH;
  const armsToRun: Arm[] = prune ? [...MINIMAL_ARMS] : [...ALL_ARMS];

  // N* from the two PRIMARY mediators' R3p−R0 half-widths (halfWidth ∝ 1/sqrt(N)).
  const perMediatorNStar = Object.entries(CI_HALFWIDTH_TARGET).map(([mk, target]) => {
    const c = (sci.mediatorContrasts[mk] as Record<string, ReturnType<typeof clusterBootstrap> | null>)['R3p-R0'];
    const hw = c?.halfWidth;
    const need = (hw !== undefined && Number.isFinite(hw) && hw > 0)
      ? MATCHES * Math.pow(hw / target, 2) : Number.NaN;
    return { mediator: mk, smokeHalfWidth: hw ?? null, target, projectedN: Number.isFinite(need) ? need : null };
  });
  const rawNeed = Math.max(...perMediatorNStar.map((p) => p.projectedN ?? 0), MATCHES);
  const nStar = Math.min(N_MAX, Math.ceil(rawNeed / N_STEP) * N_STEP);
  return {
    rule: 'N* = smallest fixed-step (40) match count whose PRIMARY-mediator (offsideRate, '
      + 'deliveryEvents) R3p−R0 cluster-CI half-widths meet the disclosed targets, projected '
      + 'from the smoke via halfWidth ∝ 1/sqrt(N), AND within the wall budget; #105 knee only '
      + 'if a per-cell floor unexpectedly bound (the consumer table is FROZEN — it does not).',
    ciTargets: CI_HALFWIDTH_TARGET, nStep: N_STEP, nMax: N_MAX, perMediatorNStar,
    nStar, nStarExceedsMax: rawNeed > N_MAX,
    wallBudgetMsPerMatch: PRUNE_WALL_BUDGET_MS_PER_MATCH, perArmPerMatchWallMs, fiveArmPerMatchWallMs,
    prune, prunedArms: prune ? [...PRUNABLE_ARMS] : [], armsToRun,
    note: 'DISCLOSED before the gate-bearing run; no re-cut after sight (#105.4). Under-powered '
      + 'mediator cells are published, never pooled (#24).',
  };
};

// =============================================================================
// main
// =============================================================================
const stripVolatile = (o: unknown): string => {
  // strip the wall-cost timings (non-deterministic) before the X-DET compare / SHA.
  const json = JSON.stringify(o, (k, v) => (k === 'wallByArm' || k === 'wallCost' || k === 'perArmPerMatchWallMs' || k === 'fiveArmPerMatchWallMs' ? undefined : v));
  return json;
};

const emit = (output: Record<string, unknown>, path: string): void => {
  if (PREFLIGHT && isCanonicalRepoPath(path)) {
    throw new Error(`bounded-preflight (caps active) must NOT write the canonical repo path '${path}'; redirect via V4P3P2_OUT_${IS_RUN ? 'RUN' : 'SMOKE'}=/tmp/...`);
  }
  writeFileSync(path, `${JSON.stringify(output, null, 2)}\n`);
};

function run(): void {
  const { arms, source: armsSource } = resolveArms();
  const collectAge = MODE === 'smoke';

  const sci1 = computeScience(arms, collectAge);
  const sci2 = computeScience(arms, collectAge);
  const deterministic = stripVolatile(sci1) === stripVolatile(sci2);

  const xMergeSha = buildMergeSha();
  const disjoint = seedDisjointness();
  const fp = productionFingerprint();
  const src = srcZero();
  const xoff = offIdent(SEED_START);

  const gr = sci1.forkGrain.gatesRaw;
  const gates: Record<string, boolean> = {
    x4Clone: gr.x4Clone,
    x5ControlIdentity: gr.x5Control,
    x6ForceFidelity: gr.x6Force,
    x7Determinism: deterministic,
    dev: gr.dev,
    pc: gr.pc,
    xMergeSha: xMergeSha.pass,
    xFpProd: fp.pass,
    xOffIdent: xoff.pass,
    xSrcZero: src.pass,
    seedDisjoint: disjoint.pass,
  };
  const verdict = MODE === 'smoke' ? 'SIZING SMOKE' : (Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL');

  const parameters = {
    mode: MODE, seedStart: SEED_START, matchesRequested: N_REQUESTED, matchesRun: MATCHES,
    matchCap: Number.isFinite(MATCH_CAP) ? MATCH_CAP : null, momentTarget: Number.isFinite(MOMENT_TARGET) ? MOMENT_TARGET : null,
    matchDuration: MATCH_DURATION, warmupTicks: WARMUP_TICKS,
    wSeconds: W_S, hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S, momentSpacingS: MOMENT_SPACING_S,
    restThird: round(REST_THIRD, 4), devFloor: DEV_FLOOR,
    arms, armsSource, allArms: ALL_ARMS, minimalArms: MINIMAL_ARMS, prunableArms: PRUNABLE_ARMS,
    bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED, permutationSeedReserved: PERM_SEED,
    clusterUnit: 'match seed',
    mediators: {
      offsideRate: 'offsides both sides / match (§4, indexes the offside bit; ⚠ #116.2 sign inverted ⇒ null/worsening a live outcome, REPORTED not gated)',
      deliveryEvents: '(longBalls+crosses+cutbacks) both sides / match (§4, indexes the delivery bit; pre-named: recover toward the P3a band)',
      restartTicks: "phase==='restart' ticks / match (§4, indexes the in-support law; pre-named: quiet toward R0)",
      restSlotOccupancy: 'mean(both sides) fraction of playing ticks the index-1 body is held in own-third (localX < −REST_THIRD) — I5(b) DEGEN-RESTDEF (§4, UNREMEDIED CLASS H; pre-named: residual persists)',
    },
    tableSource: MERGED_PATH, controlSource: CONTROL_PATH, controlSha: rawControl.sha256, controlPooled: rawControl.pooledControl,
    world: 'ENRICHED', flags: CENSUS_FLAGS, preflight: PREFLIGHT,
  };

  const common = {
    authority: 'STAGE3-V4-P3P2-CONSUMER §3–§6 (#117-AMENDED) · rulings #116/#117/#118',
    head: 'P3p-2a src wiring at bff06e0 (ratified #118); this probe touches no src',
    parameters,
    xMergeSha, seedDisjointness: disjoint,
    fingerprint: { ...fp, baseline: FINGERPRINT_BASELINE },
    xOffIdent: xoff, xSrcZero: src,
    perArmMediators: sci1.perArmMediators, mediatorContrasts: sci1.mediatorContrasts,
    consumptionLedger: sci1.ledger,
    forkGrain: sci1.forkGrain,
    gates, deterministic, verdict,
  };

  const wallCost = { perArmTotalMs: sci1.wallByArm, matchesRun: MATCHES };

  if (MODE === 'smoke') {
    const sizing = computeSizing(sci1, arms);
    const output = {
      experiment: 'STAGE3-V4-P3p-2b SIZING SMOKE (the five-arm partial consumer)',
      mode: 'smoke', ...common,
      sizing, wallCost,
      ageTicksPinConfirm: sci1.ageHist === null ? null : {
        ...sci1.ageHist, widthStaleTicks: 30,
        note: 'consumption-time perceived ageTicks of own attacking-half teammates (throwaway-clone read, #114.2); the 30-tick freshness pin should be visible in the tail.',
      },
      deviations: DEVIATIONS,
    };
    const sha256 = createHash('sha256').update(stripVolatile({ ...output, sha256: undefined })).digest('hex');
    emit({ ...output, sha256 }, SMOKE_OUT);
    logLine('SMOKE', verdict, sci1, gates, deterministic, sha256, sizing);
  } else {
    const output = {
      experiment: 'STAGE3-V4-P3p-2b CONSUMER RUN (the five-arm partial consumer)',
      mode: 'run', ...common,
      wallCost,
      deviations: DEVIATIONS,
    };
    const sha256 = createHash('sha256').update(stripVolatile({ ...output, sha256: undefined })).digest('hex');
    emit({ ...output, sha256 }, RUN_OUT);
    logLine('RUN', verdict, sci1, gates, deterministic, sha256, null);
  }
}

function logLine(tag: string, verdict: string, sci: ReturnType<typeof computeScience>, gates: Record<string, boolean>, det: boolean, sha256: string, sizing: ReturnType<typeof computeSizing> | null): void {
  const fg = sci.forkGrain;
  const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
  const c = (mk: MediatorKey) => (sci.mediatorContrasts[mk] as Record<string, { point: number } | null>)['R3p-R0'];
  process.stderr.write(
    `STAGE3-V4-P3p-2b ${tag} ${verdict}`
    + ` · matches ${MATCHES} arms ${Object.keys(sci.perArmMediators).join('/')}`
    + ` · forkMoments ${fg.moments} clone ${fg.clonesTaken === fg.moments ? 'OK' : 'FAIL'} X5 ${fg.x5Checked}/${fg.x5Mismatched} X6unexpl ${fg.x6.unexplained}`
    + ` · DEV ${fg.dev.devShareInSupport} (floor ${DEV_FLOOR}, attn ${fg.dev.inSupportAttainable})`
    + ` · PC ${fg.pc.point} CI[${fg.pc.lower},${fg.pc.upper}]`
    + ` · offΔ(R3p-R0) ${c('offsideRate')?.point} delivΔ ${c('deliveryEvents')?.point}`
    + (sizing ? ` · N* ${sizing.nStar} prune ${sizing.prune} 5armWall ${sizing.fiveArmPerMatchWallMs}ms/match` : '')
    + ` · X-MERGE ${gates.xMergeSha} fp ${gates.xFpProd} offIdent ${gates.xOffIdent} det ${det}`
    + ` · SHA ${sha256}`
    + (failed.length ? ` · FAILED ${failed.join(',')}` : '')
    + '\n',
  );
}

/** §9 — interpretive choices the prereg froze in FORM but not last detail. */
const DEVIATIONS: readonly string[] = [
  'DEV denominator (§3.3/§9.7): the in-support perceived-attainable denominator = v4InSupport − noCell (in-support AND priceable context AND an in-power own-role cell); DEV = deviate / that. The plain-v3 attainable + the in-support shrink factor are reported beside it.',
  'restartTicks mediator (§4): operationalised as phase===\'restart\' ticks/match (the restart-resettle surrogate the in-support law indexes); kickoff/goalPause not counted.',
  'rest-slot occupancy I5(b) (§4/§9.10): operationalised as the mean over BOTH sides of the fraction of playing ticks the index-1 (slot-1) body is held in own-third (localX < −REST_THIRD); the per-side shares are also carried. REPORTED, never gated.',
  'delivery/offside mediator directions (§4/§9.10): offside-rate pre-named quiet-toward-R0 but #116.2 sign inverted ⇒ a null/worsening is a live outcome, REPORTED not gated; no offside decomposition here (P3p-3\'s arm).',
  'prune rule (§3.2/§9.6): disclosed 5-arm per-match wall budget = 60,000 ms/match (env V4P3P2_WALL_BUDGET_MS); over budget ⇒ prune R1p/R2p (keep R0/R3p/R3v3). The smoke records the measured cost + the decision; no re-cut after sight.',
  'N rule (§5.1/§9.8): wall-cost-driven N with disclosed CI-width targets on the two PRIMARY mediators (offsideRate ≤ 0.5, deliveryEvents ≤ 2.0 on R3p−R0), projected halfWidth ∝ 1/sqrt(N), fixed step 40, cap N_MAX=2000; the #105 knee is NOT applicable (the consumer table is frozen — no per-cell census floor binds).',
  '15-tick warm-up (§3.3): carried as the heritage\'s NOMINAL WARMUP_TICKS parameter (reported); NO artificial pre-warm loop is added — the percept is warmed by the base match\'s own play up to the decision tick, exactly as V3-P2 / the P3p-1 recensus (which report WARMUP_TICKS but apply no extra loop).',
  'permutation seed 99803 (§5.2): RESERVED for symmetry with the seed banding; the P3p-2 gates are bootstrap-based (DEV/PC/mediators) — no permutation-null test is run here.',
  'X-OFF-IDENT + X-SRC-ZERO carried as BONUS receipts: this probe re-confirms the injection dormancy (children injected + flags OFF == plain v3, whole-match byte-identical) and that it adds no src (git diff --stat -- src empty); the HARD X-OFF-IDENT/X-SRC-ZERO(named) were P3p-2a\'s gates (ratified #118).',
  'fork-grain arms: the DEV/PC instrument runs the PARTIAL eye NEUTRAL (DEV) + INVERTED (PC) + a null-eye CONTROL fork per moment (the V3-P2 gate battery, §3.3); the eye value-arms gene/oracleCtx and the perception-price contrast are NOT re-run (not in the P3p-2 gate set).',
];

function main(): void {
  if (MODE !== 'smoke' && MODE !== 'run') {
    throw new Error(`V4P3P2_MODE must be explicitly 'smoke' or 'run' (no default); got '${MODE ?? ''}'`);
  }
  if (IS_RUN && !(N_REQUESTED >= 1)) {
    throw new Error('run mode requires V4P3P2_N ≥ 1 (the disclosed-rule N; no default, §5.1)');
  }
  if (!(MATCHES >= 1)) throw new Error(`no matches to run (MATCHES=${MATCHES}); check V4P3P2_MATCH_CAP`);
  run();
}

const isMain = (() => {
  try { return import.meta.url === pathToFileURL(process.argv[1] ?? '').href; } catch { return false; }
})();
if (isMain) main();

export {
  armEye, partialForkEye, playArm, runFork, runForkBlock, computeScience, computeSizing,
  ledgerOf, buildMergeSha, seedDisjointness, offIdent, matchOf, signatureOf,
};
