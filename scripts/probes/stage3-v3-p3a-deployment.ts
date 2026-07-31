// STAGE III V3-P3a — THE DEPLOYMENT LADDER + THE FULL HARD BATTERY.
//
// Authority: docs/world-model/STAGE3-V3-P3A-DEPLOYMENT.md (FROZEN pre-registration
// 2026-07-31) + commander rulings #86 (V3-P3 authorized, two sub-stages, P3a the cheap
// gate) and #87 (pre-registration PASS; the R0 two-pin resolution ratified; build+run
// authorized). No src/** changes: the role-eye deployment seam already ships behind
// `Match.stationEye` with `scope in {body, team, both}` + the v3 role table, certified by
// V3-P2 (HEAD d10ae24). P3a ARMS the EXISTING seam across the ladder on the ENRICHED
// substrate — it changes no src/**. The table + controls are INJECTED here, never bundled.
// Nothing ships (Road B): stationEye is null in every production path.
//
// Built on the C7-T2 match-level A/B pattern (scripts/probes/c7-t2-match-ab.ts §§2-6),
// the P2-B ladder arming (R0/R1/R2/R3), and the V3-P2 consumer's {roleTable, control}
// injection (scripts/probes/stage3-v3-p2-consumer.ts). It measures, to the frozen spec:
//
//   §2   THE DEPLOYMENT LADDER: R0 (eye-null enriched baseline) / R1 (one body,
//        gid = 1 + matchSeed mod 5, side 0) / R2 (one team, side 0) / R3 (both) —
//        all NEUTRAL (w_s = w_c = 0.5), the SAME 800 paired seeds every arm.
//   §4.1 WATCHABILITY HARD LIMBS (any one firing STOPS THE STAGE, bound on R3 vs R0):
//        DEGEN-SCRAMBLE / DEGEN-PILEUP / DEGEN-RESTDEF (P2-B §4.4 bands verbatim) +
//        the standing canaries C-OFFSIDE / C-BOX / C-RESTART (two-part predicates).
//   §4.2 THE §2 EQUILIBRIUM BAND (C1 §4 absolute, hard-abort on R3; R0 reported with
//        the substrate-drift caveat).
//   §4.3 THE SHAPE ADJUDICATORS (REPORTED, pre-named directions, ladder R1/R2/R3):
//        I3 p10/median/<4m share, I5 (a) both-back share + (b) designated slot, I6
//        duplicate runs, I7 shape delta, per-role deviation rate (the WG-silence
//        check), role-mix TV vs the V3-P0 incumbent 0.407.
//   §4.4 X-FAMILY + STRUCTURAL: X-FP-PROD, X-OFF-IDENT (the role-eye-off pin), X-SEAM,
//        X-DET, and STRUCTURAL EYE-NEVER-TOUCHES-BALL (eye-attributable releases = 0).
//   §4.5 ECOLOGY REPORTED (the P0 seven side-split, spells, long-ball / forward-pass
//        share, give-and-gos, longest chain, the signed match differential per rung).
//
// Output: docs/world-model/data/stage3-v3-p3a-deployment.json (SHA'd, twice byte-identical).

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { runHeadless } from '../../src/sim/simRunner';
import { formationSpot, runTarget, supportSpot } from '../../src/ai/formations';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Role, type Side, type TeamInfo } from '../../src/sim/types';
import {
  STATION_FAMILY, newStationEyeTrace,
  type RoleConditionedTable, type RoleControlLevels, type StationEyeTrace,
} from '../../src/ai/stationEye';
import { Rng } from '../../src/utils/rng';

// --- staging, frozen (doc §3.1) ----------------------------------------------
// seeds = 9,300,000 + blockIndex*100,000 + k, blockIndex 0..3, k 0..199
//       = 4 disjoint blocks × 200 = 800 matches per arm, range 9.30M..9.60M0199.
// 9,300,000 lies above every consumed range incl. all of V3-P2 (9.20M/9.21M).
const SEED_START = 9_300_000;
const BLOCK_STRIDE = 100_000;
const BLOCKS = 4;
const MATCHES_PER_BLOCK = 200; // 4 × 200 = 800 per arm (the C6/C7-T2 / P2-B §4.6 precedent)
const BOOTSTRAP_SEED = 93_003; // frozen (doc §3.2; disjoint from 92110/91110/91100/79002/62003/50041)
const BOOTSTRAP_RESAMPLES = 2000;

// --- ENGINEERING smoke cap (does NOT touch the frozen staging for the real run) --
// V3P3A_CAP_MATCHES caps matches-per-arm for a crash/NaN/projection smoke; when set,
// output routes to V3P3A_OUT (a scratch path) so the canonical JSON is never touched.
const CAP_MATCHES = process.env.V3P3A_CAP_MATCHES
  ? Math.max(1, Number.parseInt(process.env.V3P3A_CAP_MATCHES, 10))
  : Number.POSITIVE_INFINITY;
// SKIP_DET lets the smoke measure a single pass (X-DET adds a full 2nd run); never set
// for the authorized run.
const SKIP_DET = process.env.V3P3A_SKIP_DET === '1';
const OUT_PATH = process.env.V3P3A_OUT ?? 'docs/world-model/data/stage3-v3-p3a-deployment.json';

// --- frozen instrument constants (P0 §2.2 buckets, verbatim; C7-T2 §) ----------
const SAMPLE_EVERY = 10; // 6 Hz (every 10th tick), P0 §2 verbatim
const SAMPLE_DT = SAMPLE_EVERY * DT;
const PAIR_SUBSAMPLE = 6; // P0's I3 sub-sample, verbatim
const CLOSE_PAIR_M = 4; // I3 share < 4 m
const BALL_NEAR_M = 5; // I4 within 5 m
const BALL_MID_M = 10; // I4 within 10 m
const DRIFT_FAST_MS = 4; // I2 fast-drift bucket
const DUP_RUN_M = 4; // I6 duplicate-run bucket
const REST_THIRD = HALF_L / 3; // I5 own-third depth
const CROSS_WINDOW_S = 4; // §4.1 C-BOX arrival window (C4's own 4 s)
const SPEED_GATE = 2.5; // de-glue speed gate (Match.ts) — release classification
const RECEIPT_CAP = 1000; // per-class receipts cap (#49.3), first-N deterministic
const REST_BOTH = 2; // I5(a) both-back = >= 2 deep in own third

// --- P0 baselines the DEGEN battery bands are anchored on (doc §4.1) ----------
// v1 P0 reference (NOT the baseline — #68.2 re-baselines on the ENRICHED paired R0).
const P0_I4_OWN5 = 0.956; // DEGEN-SCRAMBLE (v1 reference)
const P0_I3_UNDER4 = 0.0940; // DEGEN-PILEUP (share, 9.40%, v1 reference)
const P0_I5_SLOT = 0.6582; // DEGEN-RESTDEF (65.82%, v1 reference)
// two-part predicate thresholds (relative), P2-B §4.4 KEPT VERBATIM (doc §4.1):
const DEGEN_SCRAMBLE_REL = 0.25; // I4 own-within-5 m rises >= +25%
const DEGEN_PILEUP_REL = 0.50; // I3 share < 4 m rises >= +50%
const DEGEN_RESTDEF_REL = -0.20; // I5(b) slot falls >= 20% drop
// standing canaries (doc §4.1):
const CANARY_OFFSIDE_REL = 0.10; // C-OFFSIDE: offsides/match rise, point >= +10%
const CANARY_BOX_REL = -0.15; // C-BOX: box-at-arrival falls >= 15%
const CANARY_RESTART_REL = 0.10; // C-RESTART: restart ticks/match rise >= +10%

// --- §2 EQUILIBRIUM BAND (doc §4.2, C1 §4 verbatim, absolute hard-abort) ------
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;

// --- the incumbent role signature reference (V3-P0 (iii) / #79.1) -------------
const INCUMBENT_ROLE_TV = 0.407; // mean pairwise role TV of the incumbent (doc §4.3)

// --- X-FP-PROD: the frozen shipped-world production fingerprint (57b0bd…c673) --
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337; // scripts/fingerprint.ts defaults
const FINGERPRINT_SEASONS = 2;

// --- the injected table + control (never bundled in src/**; V3-P2's pattern) ---
const TABLE_PATH = 'docs/world-model/data/stage3-v3-p1-role-census-table.json';
const CONTROL_PATH = 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const rawTable = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string; table: RoleConditionedTable;
};
const roleTable: RoleConditionedTable = rawTable.table;
const tableCanonicalSha = rawTable.tableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: RoleControlLevels; sha256: string; guard: { pass: boolean }; pooledControl: number;
};
const control: RoleControlLevels = rawControl.control;
const controlSha = rawControl.sha256;

// --- the ENRICHED consumer world (= the census world, #26.5 / #67.3) ----------
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];

// --- the ladder arms (doc §2) ------------------------------------------------
type ArmId = 'R0' | 'R1' | 'R2' | 'R3';
type EyeScope =
  | { readonly kind: 'body'; readonly gid: number }
  | { readonly kind: 'team'; readonly side: Side }
  | { readonly kind: 'both' };
// R1's one-body selection rule, VERBATIM (P2-B §4.1): gid = 1 + (matchSeed mod 5),
// side 0 — an outfielder (gids 1..5 on side 0; gid % TEAM_SIZE === 0 is the keeper).
const scopeFor = (arm: ArmId, seed: number): EyeScope | null => {
  switch (arm) {
    case 'R0': return null;
    case 'R1': return { kind: 'body', gid: 1 + (seed % 5) };
    case 'R2': return { kind: 'team', side: 0 };
    case 'R3': return { kind: 'both' };
  }
};

// --- team fixture (the house pattern) ----------------------------------------
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
// The ENRICHED match (= the census world); the default full match (no duration knob).
const matchOf = (seed: number): Match =>
  new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), ...CENSUS_FLAGS,
  });

// --- small numeric helpers (C7-T2 verbatim) ----------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((s, x) => s + x, 0) / xs.length);
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};

// --- station family ledger (P0 §2.2 I1, verbatim) ----------------------------
type Family = 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'ONBALL' | 'OTHER';
const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': return 'FORMATION';
    case 'SupportBallCarrier': return 'SUPPORT';
    case 'MakeRun': return 'RUN';
    case 'MarkOpponent': return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass': return 'BALL';
    default: return 'OTHER';
  }
};
const stationTargetOf = (
  p: Player, t: Team, opp: Team, m: Match, family: Family,
): { x: number; y: number } | null => {
  const hasBall = m.possessionSide === t.side;
  switch (family) {
    case 'FORMATION': return formationSpot(p, t, m.ball, hasBall, opp);
    case 'SUPPORT': return supportSpot(p, t, m.ball);
    case 'RUN': return runTarget(p, t, opp.players);
    default: return null;
  }
};

// --- the match signature (P2-B's, verbatim; the flag-off pin) -----------------
const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

// --- per-record receipts (#49.3), capped, first-N deterministic --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// --- ownership-release ledger (#48.3 / §4.4; R3 only) ------------------------
// The role eye writes ONLY the off-ball movement target (executor `target`), NEVER
// ball.owner: eye-attributable releases are 0 by construction, and the classification
// below is exhaustive so unattributable stays 0. Both asserted by the structural gate.
interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  eyeAttributable: number; // MUST be 0 (the eye never writes ball.owner)
  unattributable: number; // MUST be 0 (every release classes to a named channel)
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, eyeAttributable: 0, unattributable: 0,
});

// --- sampling-exclusion class counts (doc §5, REPORTED not gated) -------------
interface ExclusionCounts { ePaused: number; eGk: number; eEnded: number; eSentOff: number }
const newExclusion = (): ExclusionCounts => ({ ePaused: 0, eGk: 0, eEnded: 0, eSentOff: 0 });

// --- per-role deviation ledger (§4.3; reconstructed from stationEyeState) -----
// The shared trace pools all bodies; per-ROLE splitting is reconstructed by watching
// each armed body's commitment window transition (a new/greater `untilTick` == a new
// eye decision; offset !== null == a DEVIATION). The abort is DORMANT here, so a
// window's (untilTick) is fixed for its life and monotone-increasing per body across
// decisions — the reconstruction counts each decision exactly once.
interface RoleLedger {
  decisions: number;
  deviations: number;
  mix: Map<string, number>; // candidateId -> deviation count (the role's destination mix)
}
const newRoleLedger = (): RoleLedger => ({ decisions: 0, deviations: 0, mix: new Map() });
type PerRole = Record<Role, RoleLedger>;
const newPerRole = (): PerRole => ({
  GK: newRoleLedger(), DF: newRoleLedger(), MF: newRoleLedger(),
  WG: newRoleLedger(), ST: newRoleLedger(),
});

// --- one side's 6 Hz instrument row (P0 seven, side-split) --------------------
interface SideRow {
  dwellMedian: number;
  familyChangesPerBodyPerMin: number;
  driftMedian: number;
  driftFastShare: number;
  spacingP10: number; // I3 p10 (dispersal read)
  spacingMedian: number;
  spacingUnder4: number; // I3 share < 4 m — DEGEN-PILEUP
  ballNear: number; // own within 5 m — DEGEN-SCRAMBLE
  ballMid: number; // own within 10 m
  restCount: number;
  restBothShare: number; // I5(a) both-back share (>= 2 deep) — reported
  restSlotShare: number; // I5(b) designated slot — DEGEN-RESTDEF
  dupRunShare: number; // I6
  shapeDeltaCentroid: number; // I7
  shapeDeltaSpreadX: number;
  shapeDeltaSpreadY: number;
  offsides: number;
  goals: number;
  shots: number;
  shotsOnTarget: number;
  blocks: number;
  crosses: number;
  headersWon: number;
  longBalls: number;
  cutbacks: number;
  passes: number;
  passesCompleted: number;
  passesForward: number;
  oneTwos: number;
  bestPassChain: number;
  tackles: number;
  interceptions: number;
  boxAtArrival: number; // mean attackers in opp box at cross arrival
  crossArrivals: number;
}
const emptySide = (): SideRow => ({
  dwellMedian: Number.NaN, familyChangesPerBodyPerMin: Number.NaN,
  driftMedian: Number.NaN, driftFastShare: Number.NaN,
  spacingP10: Number.NaN, spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
  ballNear: Number.NaN, ballMid: Number.NaN,
  restCount: Number.NaN, restBothShare: Number.NaN, restSlotShare: Number.NaN, dupRunShare: Number.NaN,
  shapeDeltaCentroid: Number.NaN, shapeDeltaSpreadX: Number.NaN, shapeDeltaSpreadY: Number.NaN,
  offsides: 0, goals: 0, shots: 0, shotsOnTarget: 0, blocks: 0, crosses: 0, headersWon: 0,
  longBalls: 0, cutbacks: 0, passes: 0, passesCompleted: 0, passesForward: 0,
  oneTwos: 0, bestPassChain: 0, tackles: 0, interceptions: 0,
  boxAtArrival: Number.NaN, crossArrivals: 0,
});

// --- the whole per-match output (cluster unit = match seed) -------------------
interface MatchRow {
  readonly seed: number;
  readonly arm: ArmId;
  readonly sides: [SideRow, SideRow];
  readonly restartTicks: number;
  readonly looseCount: number;
  readonly possessionSpells: number;
  readonly spellDurations: number[];
  readonly turnoverOwnThird: number;
  readonly turnoverMiddle: number;
  readonly turnoverTheirThird: number;
  readonly arrivalC0: number;
  readonly arrivalC1: number;
  readonly arrivalC2: number;
  readonly arrivalC3: number;
  readonly signature: string;
}

// --- one match, one arm ------------------------------------------------------
const runMatch = (
  seed: number, arm: ArmId,
  trace: StationEyeTrace | null, release: ReleaseLedger | null,
  exclusion: ExclusionCounts | null, perRole: PerRole | null, receipts: ReceiptBook | null,
): MatchRow => {
  const m = matchOf(seed);
  const scope = scopeFor(arm, seed);
  if (scope !== null) {
    m.stationEye = {
      arm: 'neutral', scope, table: {},
      v3: { roleTable, control }, trace: trace ?? undefined,
    };
  }
  const per: [SideRow, SideRow] = [emptySide(), emptySide()];

  // gid -> role, for the per-role reconstruction (own-state, immutable).
  const roleOf = new Map<number, Role>();
  for (const p of m.allPlayers) roleOf.set(p.gid, p.role);
  const lastUntil = new Map<number, number>();

  // 6 Hz accumulators, per side.
  const dwells: [number[], number[]] = [[], []];
  const drifts: [number[], number[]] = [[], []];
  const pairs: [number[], number[]] = [[], []];
  const ballNear: [number[], number[]] = [[], []];
  const ballMid: [number[], number[]] = [[], []];
  const restCount: [number[], number[]] = [[], []];
  const boxAtArrival: [number[], number[]] = [[], []];
  const shape = [0, 1].map(() => ({
    inPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
    outPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
  }));
  const lastFamily = new Map<number, Family>();
  const dwellStart = new Map<number, number>();
  const lastTarget = new Map<number, { x: number; y: number }>();
  const familyChanges = [0, 0];
  const restTicks = [0, 0];
  const restBothTicks = [0, 0];
  const restSlotTicks = [0, 0];
  const runTicks = [0, 0];
  const dupRunTicks = [0, 0];

  let restartTicks = 0;
  let looseCount = 0;
  let samples = 0;
  let tick = 0;
  const crossesBefore: [number, number] = [0, 0];
  const inFlight: { side: 0 | 1; deadline: number; headersAtStart: number; arrived: boolean; maxInBox: number }[] = [];
  let arrivalC0 = 0, arrivalC1 = 0, arrivalC2 = 0, arrivalC3 = 0;

  let lastValidPoss: number | -1 = -1;
  let spellStartTick = 0;
  let possessionSpells = 0;
  const spellDurations: number[] = [];
  let turnoverOwnThird = 0, turnoverMiddle = 0, turnoverTheirThird = 0;

  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = m.ball.owner?.side ?? null;

  while (!m.finished) {
    const ownedBefore = m.ball.owner !== null;
    m.step(DT);
    tick += 1;
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;

    const owner = m.ball.owner;
    const playing = m.phase === 'playing';

    // --- per-role deviation reconstruction (R3 ledger; scope !== null) ---
    // A new/greater untilTick on an armed body's state == a fresh eye decision.
    if (perRole !== null && scope !== null) {
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

    // --- sampling-exclusion class counts (REPORTED, R3 ledger) ---
    if (exclusion !== null) {
      if (m.finished) exclusion.eEnded += 1;
      else if (!playing) exclusion.ePaused += 1;
      else if (owner !== null && owner.role === 'GK') exclusion.eGk += 1;
      else if (owner !== null && owner.sentOff) exclusion.eSentOff += 1;
    }

    // --- ownership release (both arms count loose; R3 classifies) ---
    const newOwner = m.ball.owner;
    const released = prevOwnerGid !== null && (newOwner === null || newOwner.gid !== prevOwnerGid);
    if (released) {
      const relGid = prevOwnerGid as number;
      if (newOwner === null) looseCount += 1;
      if (release !== null) {
        release.releases += 1;
        const deglued = m.dribbleTouch !== null && m.dribbleTouch.gid === relGid
          && m.dribbleTouch.until >= m.simTime;
        if (deglued) {
          release.deglue += 1;
          if (receipts) addReceipt(receipts, 'deglue', seed, tick, relGid, 'de-glue branch');
        } else if (newOwner === null) {
          const kicked = m.pendingPass !== null
            || m.ball.vel.x * m.ball.vel.x + m.ball.vel.y * m.ball.vel.y > SPEED_GATE * SPEED_GATE;
          if (kicked) {
            release.kick += 1;
            if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'strike/kick/pass/clearance');
          } else {
            release.ballWon += 1;
            if (receipts) addReceipt(receipts, 'ball-won', seed, tick, relGid, 'loose contest');
          }
        } else if (prevOwnerSide !== null && newOwner.side !== prevOwnerSide) {
          release.tackle += 1;
          if (receipts) addReceipt(receipts, 'tackle', seed, tick, relGid, 'won by other side');
        } else {
          release.kick += 1; // teammate received the pass
          if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'teammate received');
        }
        // The eye writes only the off-ball movement target and never ball.owner:
        // eye-attributable releases are 0 by construction and the classification above
        // is exhaustive so unattributable stays 0. Both asserted by the gate.
      }
    }

    // --- turnover / possession spell tracking ---
    const poss = m.possessionSide;
    if (poss !== -1) {
      if (lastValidPoss === -1) {
        spellStartTick = tick;
      } else if (poss !== lastValidPoss) {
        possessionSpells += 1;
        spellDurations.push((tick - spellStartTick) * DT);
        spellStartTick = tick;
        const loser = m.teams[lastValidPoss];
        const lx = loser.localX(m.ball.pos.x);
        if (lx < -REST_THIRD) turnoverOwnThird += 1;
        else if (lx > REST_THIRD) turnoverTheirThird += 1;
        else turnoverMiddle += 1;
      }
      lastValidPoss = poss;
    }

    // --- C-BOX: attackers in the opposition box at cross arrival (P2-B §4.3) ---
    for (const side of [0, 1] as const) {
      const now = m.teams[side].stats.crosses;
      if (now > crossesBefore[side]) {
        inFlight.push({
          side, deadline: m.simTime + CROSS_WINDOW_S,
          headersAtStart: m.teams[side].stats.headersWon, arrived: false, maxInBox: 0,
        });
      }
      crossesBefore[side] = now;
    }
    for (let i = inFlight.length - 1; i >= 0; i--) {
      const f = inFlight[i];
      const arrivedNow = (m.ball.owner !== null && !ownedBefore) || m.phase !== 'playing'
        || m.simTime >= f.deadline;
      const att = m.teams[f.side];
      const opp = m.teams[1 - f.side];
      const oppGoalX = opp.attackDir < 0 ? HALF_L : -HALF_L;
      let inBox = 0;
      for (const p of att.players) {
        if (p.role === 'GK' || p.sentOff) continue;
        const insideX = oppGoalX > 0 ? p.pos.x > oppGoalX - BOX_DEPTH : p.pos.x < oppGoalX + BOX_DEPTH;
        if (insideX && Math.abs(p.pos.y) <= BOX_WIDTH / 2) inBox += 1;
      }
      if (inBox > f.maxInBox) f.maxInBox = inBox;
      if (m.ball.owner !== null && !ownedBefore) f.arrived = true;
      if (!arrivedNow) continue;
      boxAtArrival[f.side].push(inBox);
      const headed = m.teams[f.side].stats.headersWon > f.headersAtStart;
      if (headed) arrivalC3 += 1;
      else if (!f.arrived) arrivalC0 += 1;
      else if (f.maxInBox === 0) arrivalC1 += 1;
      else arrivalC2 += 1;
      inFlight.splice(i, 1);
    }

    prevOwnerGid = newOwner?.gid ?? null;
    prevOwnerSide = newOwner?.side ?? null;

    // --- 6 Hz instrument sampling (P0 §2 verbatim: every 10th tick, playing) ---
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const opp = m.teams[1 - side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      const hasBall = m.possessionSide === side;

      for (const p of outfield) {
        const fam = familyOf(p, m);
        const prev = lastFamily.get(p.gid);
        if (prev !== fam) {
          if (prev !== undefined) {
            familyChanges[side] += 1;
            const start = dwellStart.get(p.gid);
            if (start !== undefined && prev !== 'ONBALL' && prev !== 'OTHER') {
              dwells[side].push((tick - start) * DT);
            }
          }
          lastFamily.set(p.gid, fam);
          dwellStart.set(p.gid, tick);
          lastTarget.delete(p.gid);
        }
        const target = stationTargetOf(p, t, opp, m, fam);
        if (target !== null) {
          const before = lastTarget.get(p.gid);
          if (before !== undefined) drifts[side].push(dist2(target, before) / SAMPLE_DT);
          lastTarget.set(p.gid, { x: target.x, y: target.y });
        } else lastTarget.delete(p.gid);
      }

      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
          }
        }
      }

      let near = 0;
      let mid = 0;
      for (const p of outfield) {
        const d = dist2(p.pos, m.ball.pos);
        if (d <= BALL_NEAR_M) near += 1;
        if (d <= BALL_MID_M) mid += 1;
      }
      ballNear[side].push(near);
      ballMid[side].push(mid);

      if (hasBall) {
        const deep = outfield.filter((p) => t.localX(p.pos.x) < -REST_THIRD);
        restCount[side].push(deep.length);
        restTicks[side] += 1;
        if (deep.length >= REST_BOTH) restBothTicks[side] += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks[side] += 1;
      }

      const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
      const liveCorner = m.restart?.kind === 'corner' && m.restart.side === side;
      const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
        && t.arriver !== p.index && t.overlapper !== p.index
        && !((crashLive || liveCorner) && t.runners.has(p.index)));
      if (runners.length >= 2) {
        runTicks[side] += 1;
        const targets = runners.map((p) => runTarget(p, t, opp.players));
        let dup = false;
        for (let i = 0; i < targets.length && !dup; i++) {
          for (let j = i + 1; j < targets.length && !dup; j++) {
            if (dist2(targets[i], targets[j]) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) dupRunTicks[side] += 1;
      }

      if (outfield.length > 0) {
        const xs = outfield.map((p) => t.localX(p.pos.x));
        const ys = outfield.map((p) => p.pos.y);
        const acc = hasBall ? shape[side].inPoss : shape[side].outPoss;
        acc.cx += xs.reduce((s, x) => s + x, 0) / xs.length;
        acc.sx += sd(xs);
        acc.sy += sd(ys);
        acc.n += 1;
      }
    }
  }

  if (lastValidPoss !== -1) spellDurations.push((tick - spellStartTick) * DT);

  const minutes = (tick * DT) / 60;
  for (const side of [0, 1] as const) {
    const t = m.teams[side];
    const s = per[side];
    s.dwellMedian = quantile(dwells[side], 0.5);
    s.familyChangesPerBodyPerMin = minutes === 0 ? Number.NaN
      : familyChanges[side] / minutes / (TEAM_SIZE - 1);
    s.driftMedian = quantile(drifts[side], 0.5);
    s.driftFastShare = drifts[side].filter((v) => v > DRIFT_FAST_MS).length / (drifts[side].length || 1);
    s.spacingP10 = quantile(pairs[side], 0.1);
    s.spacingMedian = quantile(pairs[side], 0.5);
    s.spacingUnder4 = pairs[side].filter((v) => v < CLOSE_PAIR_M).length / (pairs[side].length || 1);
    s.ballNear = mean(ballNear[side]);
    s.ballMid = mean(ballMid[side]);
    s.restCount = mean(restCount[side]);
    s.restBothShare = restTicks[side] === 0 ? Number.NaN : restBothTicks[side] / restTicks[side];
    s.restSlotShare = restTicks[side] === 0 ? Number.NaN : restSlotTicks[side] / restTicks[side];
    s.dupRunShare = runTicks[side] === 0 ? Number.NaN : dupRunTicks[side] / runTicks[side];
    const face = (a: { cx: number; sx: number; sy: number; n: number }) => (a.n === 0
      ? { c: Number.NaN, x: Number.NaN, y: Number.NaN }
      : { c: a.cx / a.n, x: a.sx / a.n, y: a.sy / a.n });
    const ip = face(shape[side].inPoss);
    const op = face(shape[side].outPoss);
    s.shapeDeltaCentroid = ip.c - op.c;
    s.shapeDeltaSpreadX = ip.x - op.x;
    s.shapeDeltaSpreadY = ip.y - op.y;
    s.offsides = t.stats.offsides;
    s.goals = t.stats.goals;
    s.shots = t.stats.shots;
    s.shotsOnTarget = t.stats.shotsOnTarget;
    s.blocks = t.stats.blocks;
    s.crosses = t.stats.crosses;
    s.headersWon = t.stats.headersWon;
    s.longBalls = t.stats.longBalls;
    s.cutbacks = t.stats.cutbacks;
    s.passes = t.stats.passes;
    s.passesCompleted = t.stats.passesCompleted;
    s.passesForward = t.stats.passesForward;
    s.oneTwos = t.stats.oneTwos;
    s.bestPassChain = t.stats.bestPassChain;
    s.tackles = t.stats.tackles;
    s.interceptions = t.stats.interceptions;
    s.boxAtArrival = mean(boxAtArrival[side]);
    s.crossArrivals = boxAtArrival[side].length;
  }

  const sig = signatureOf(m);
  m.stationEye = null;
  return {
    seed, arm, sides: per, restartTicks, looseCount,
    possessionSpells, spellDurations,
    turnoverOwnThird, turnoverMiddle, turnoverTheirThird,
    arrivalC0, arrivalC1, arrivalC2, arrivalC3, signature: sig,
  };
};

// --- cluster bootstrap over match seeds (#20), paired rung vs R0 -------------
interface PairedCI {
  n: number; control: number; treated: number; diff: number;
  lower: number; upper: number; relative: number; resolved: boolean;
}
const pairedCI = (
  treated: readonly number[], controlCol: readonly number[], offset: number,
): PairedCI => {
  const diffs: number[] = [];
  const ctrl: number[] = [];
  for (let i = 0; i < treated.length; i++) {
    const d = treated[i] - controlCol[i];
    if (Number.isFinite(d)) { diffs.push(d); ctrl.push(controlCol[i]); }
  }
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  const n = diffs.length;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += diffs[rng.int(0, n - 1)];
    draws.push(s / (n || 1));
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const base = mean(ctrl.filter(Number.isFinite));
  const point = mean(diffs);
  const lower = at(0.025);
  const upper = at(0.975);
  return {
    n, control: round(base), treated: round(mean(treated.filter(Number.isFinite))),
    diff: round(point), lower: round(lower), upper: round(upper),
    relative: round(point / (Math.abs(base) || Number.NaN)),
    resolved: Number.isFinite(lower) && Number.isFinite(upper) && (lower > 0 || upper < 0),
  };
};

// --- pairwise role-mix TV over the per-role destination mixes (§4.3) ----------
const roleMixTV = (perRole: PerRole): { pairwise: Record<string, number>; mean: number } => {
  const norm = (led: RoleLedger): Map<string, number> => {
    const total = [...led.mix.values()].reduce((s, v) => s + v, 0);
    const out = new Map<string, number>();
    if (total === 0) return out;
    for (const [k, v] of led.mix) out.set(k, v / total);
    return out;
  };
  const mixes = Object.fromEntries(ROLE_AXIS.map((r) => [r, norm(perRole[r])])) as Record<Role, Map<string, number>>;
  const pairwise: Record<string, number> = {};
  const vals: number[] = [];
  for (let i = 0; i < ROLE_AXIS.length; i++) {
    for (let j = i + 1; j < ROLE_AXIS.length; j++) {
      const a = mixes[ROLE_AXIS[i]];
      const b = mixes[ROLE_AXIS[j]];
      if (a.size === 0 || b.size === 0) { pairwise[`${ROLE_AXIS[i]}|${ROLE_AXIS[j]}`] = Number.NaN; continue; }
      const keys = new Set([...a.keys(), ...b.keys()]);
      let tv = 0;
      for (const k of keys) tv += Math.abs((a.get(k) ?? 0) - (b.get(k) ?? 0));
      tv *= 0.5;
      pairwise[`${ROLE_AXIS[i]}|${ROLE_AXIS[j]}`] = round(tv, 4);
      vals.push(tv);
    }
  }
  return { pairwise, mean: round(mean(vals), 4) };
};

// --- the experiment ----------------------------------------------------------
const runExperiment = () => {
  const seeds: number[] = [];
  outer: for (let b = 0; b < BLOCKS; b++) {
    for (let k = 0; k < MATCHES_PER_BLOCK; k++) {
      if (seeds.length >= CAP_MATCHES) break outer;
      seeds.push(SEED_START + b * BLOCK_STRIDE + k);
    }
  }

  // one shared trace per armed arm (accumulates across seeds); ledgers on R3.
  const traces: Record<'R1' | 'R2' | 'R3', StationEyeTrace> = {
    R1: newStationEyeTrace(), R2: newStationEyeTrace(), R3: newStationEyeTrace(),
  };
  const release = newReleaseLedger();
  const exclusion = newExclusion();
  const perRole = newPerRole();
  const receipts: ReceiptBook = {};

  const rows: Record<ArmId, MatchRow[]> = { R0: [], R1: [], R2: [], R3: [] };
  for (const seed of seeds) {
    rows.R0.push(runMatch(seed, 'R0', null, null, null, null, null));
    rows.R1.push(runMatch(seed, 'R1', traces.R1, null, null, null, null));
    rows.R2.push(runMatch(seed, 'R2', traces.R2, null, null, null, null));
    rows.R3.push(runMatch(seed, 'R3', traces.R3, release, exclusion, perRole, receipts));
  }

  const colSide = (rr: MatchRow[], side: 0 | 1, sel: (s: SideRow) => number): number[] =>
    rr.map((r) => sel(r.sides[side]));
  const colSum = (rr: MatchRow[], sel: (s: SideRow) => number): number[] =>
    rr.map((r) => sel(r.sides[0]) + sel(r.sides[1]));
  const colAvg = (rr: MatchRow[], sel: (s: SideRow) => number): number[] =>
    rr.map((r) => (sel(r.sides[0]) + sel(r.sides[1])) / 2);

  let offset = 0;

  // ===== §4.1 (i) WATCHABILITY HARD LIMBS — side-split, fire if EITHER side, R3 binds =====
  const degenLimb = (
    treatedArm: MatchRow[], sel: (s: SideRow) => number, rel: number, sign: 1 | -1,
  ) => {
    const s0 = pairedCI(colSide(treatedArm, 0, sel), colSide(rows.R0, 0, sel), offset++);
    const s1 = pairedCI(colSide(treatedArm, 1, sel), colSide(rows.R0, 1, sel), offset++);
    const fires = (c: PairedCI) => (sign === 1
      ? c.lower > 0 && c.relative >= rel
      : c.upper < 0 && c.relative <= rel);
    return { side0: s0, side1: s1, band: rel, fires: fires(s0) || fires(s1) };
  };
  const scramble = degenLimb(rows.R3, (s) => s.ballNear, DEGEN_SCRAMBLE_REL, 1);
  const pileup = degenLimb(rows.R3, (s) => s.spacingUnder4, DEGEN_PILEUP_REL, 1);
  const restDefence = degenLimb(rows.R3, (s) => s.restSlotShare, DEGEN_RESTDEF_REL, -1);

  const offsideCanaryCI = pairedCI(colSum(rows.R3, (s) => s.offsides), colSum(rows.R0, (s) => s.offsides), offset++);
  const offsideCanary = {
    ...offsideCanaryCI, band: CANARY_OFFSIDE_REL,
    fires: offsideCanaryCI.lower > 0 && offsideCanaryCI.relative >= CANARY_OFFSIDE_REL,
  };
  const boxOf = (rr: MatchRow[]) => rr.map((r) => {
    const a = r.sides[0].boxAtArrival; const b = r.sides[1].boxAtArrival;
    const na = r.sides[0].crossArrivals; const nb = r.sides[1].crossArrivals;
    if (na + nb === 0) return Number.NaN;
    return ((Number.isFinite(a) ? a * na : 0) + (Number.isFinite(b) ? b * nb : 0)) / (na + nb);
  });
  const boxCanaryCI = pairedCI(boxOf(rows.R3), boxOf(rows.R0), offset++);
  const boxCanary = {
    ...boxCanaryCI, band: CANARY_BOX_REL,
    fires: boxCanaryCI.upper < 0 && boxCanaryCI.relative <= CANARY_BOX_REL,
  };
  const restartCanaryCI = pairedCI(rows.R3.map((r) => r.restartTicks), rows.R0.map((r) => r.restartTicks), offset++);
  const restartCanary = {
    ...restartCanaryCI, band: CANARY_RESTART_REL,
    fires: restartCanaryCI.lower > 0 && restartCanaryCI.relative >= CANARY_RESTART_REL,
  };
  const arrivalMix = (rr: MatchRow[]) => ({
    C0: rr.reduce((s, r) => s + r.arrivalC0, 0), C1: rr.reduce((s, r) => s + r.arrivalC1, 0),
    C2: rr.reduce((s, r) => s + r.arrivalC2, 0), C3: rr.reduce((s, r) => s + r.arrivalC3, 0),
  });

  // ===== §4.2 (ii) THE §2 EQUILIBRIUM BAND (absolute, hard-abort on R3) =====
  const matchCount = seeds.length;
  const perMatchRate = (rr: MatchRow[], sel: (s: SideRow) => number): number =>
    rr.reduce((acc, r) => acc + sel(r.sides[0]) + sel(r.sides[1]), 0) / matchCount;
  const bandDim = (key: keyof typeof BAND_BASELINE, sel: (s: SideRow) => number) => {
    const baseline = BAND_BASELINE[key];
    const tol = BAND_TOLERANCE[key];
    const lo = baseline * (1 - tol);
    const hi = baseline * (1 + tol);
    const r3 = perMatchRate(rows.R3, sel);
    const r0 = perMatchRate(rows.R0, sel);
    return {
      baseline, tolerance: tol, lo: round(lo), hi: round(hi),
      r3: round(r3), r0: round(r0),
      relativeVsBaseline: round(r3 / baseline - 1),
      r0RelativeVsBaseline: round(r0 / baseline - 1),
      insideBand: r3 >= lo && r3 <= hi,
      r0InsideBand: r0 >= lo && r0 <= hi,
    };
  };
  const band = {
    goals: bandDim('goals', (s) => s.goals),
    crosses: bandDim('crosses', (s) => s.crosses),
    headers: bandDim('headers', (s) => s.headersWon),
    longBalls: bandDim('longBalls', (s) => s.longBalls),
    cutbacks: bandDim('cutbacks', (s) => s.cutbacks),
  };
  const bandHolds = Object.values(band).every((d) => d.insideBand);
  const r0BandHolds = Object.values(band).every((d) => d.r0InsideBand);

  // ===== §4.3 (iii) THE SHAPE ADJUDICATORS — reported, ladder R1/R2/R3, pre-named dirs =====
  const ladderRungs: Record<'R1' | 'R2' | 'R3', MatchRow[]> = { R1: rows.R1, R2: rows.R2, R3: rows.R3 };
  const overRungs = <T>(fn: (rr: MatchRow[]) => T): Record<'R1' | 'R2' | 'R3', T> => ({
    R1: fn(ladderRungs.R1), R2: fn(ladderRungs.R2), R3: fn(ladderRungs.R3),
  });
  // pooled (side-averaged) direction reads, paired rung − R0.
  const pooledCI = (rr: MatchRow[], sel: (s: SideRow) => number) =>
    pairedCI(colAvg(rr, sel), colAvg(rows.R0, sel), offset++);

  const shapeAdjudicators = {
    i3SpacingP10: overRungs((rr) => pooledCI(rr, (s) => s.spacingP10)), // pre-named UP (disperse)
    i3SpacingMedian: overRungs((rr) => pooledCI(rr, (s) => s.spacingMedian)), // UP (disperse)
    i3SpacingUnder4: overRungs((rr) => pooledCI(rr, (s) => s.spacingUnder4)), // FLAT/DOWN (no clump) — HARD via DEGEN-PILEUP
    i5RestBothShare: overRungs((rr) => pooledCI(rr, (s) => s.restBothShare)), // (a) STABLE
    i5RestSlotShare: overRungs((rr) => pooledCI(rr, (s) => s.restSlotShare)), // (b) STABLE — HARD via DEGEN-RESTDEF
    i6DupRunShare: overRungs((rr) => pooledCI(rr, (s) => s.dupRunShare)), // DOWN (fewer duplicates)
    i7ShapeSpreadX: overRungs((rr) => pooledCI(rr, (s) => s.shapeDeltaSpreadX)), // wider / differentiated
    i7ShapeSpreadY: overRungs((rr) => pooledCI(rr, (s) => s.shapeDeltaSpreadY)),
    prenamedDirections: {
      i3SpacingP10: 'UP = bodies spread (dispersal 到岗)',
      i3SpacingMedian: 'UP = bodies spread (dispersal 到岗)',
      i3SpacingUnder4: 'FLAT or DOWN = no pile-up (HARD via DEGEN-PILEUP)',
      i5RestBothShare: 'STABLE = rest defence held',
      i5RestSlotShare: 'STABLE / not >=20% drop (HARD via DEGEN-RESTDEF)',
      i6DupRunShare: 'DOWN = fewer duplicated destinations',
      i7Shape: 'wider / role-differentiated, not collapsed',
      roleMixTV: '>= incumbent 0.407 = roles more distinct',
      perRoleDev: 'present per role; WG quiet EXPECTED (#84.2)',
    },
  };

  // per-role deviation rate (R3) — the WG-silence check at match level.
  const perRoleReport = Object.fromEntries(ROLE_AXIS.map((r) => {
    const led = perRole[r];
    return [r, {
      decisions: led.decisions, deviations: led.deviations,
      deviationRate: round(led.decisions === 0 ? Number.NaN : led.deviations / led.decisions),
    }];
  }));
  const roleMix = roleMixTV(perRole);

  // ===== §4.5 ECOLOGY (REPORTED, never gated) — the signed match differential per rung =====
  // eye side = side 0 (R1/R2 arm side 0; R3 both — side 0 taken by convention, doc §4.5).
  const signedDiff = (r: MatchRow) => (r.sides[0].shots - r.sides[1].shots);
  const signedDifferential = overRungs((rr) => pairedCI(rr.map(signedDiff), rows.R0.map(signedDiff), offset++));

  const p0Seven = (rr: MatchRow[], side: 0 | 1) => ({
    i1DwellMedian: pairedCI(colSide(rr, side, (s) => s.dwellMedian), colSide(rows.R0, side, (s) => s.dwellMedian), offset++),
    i1FamilyChanges: pairedCI(colSide(rr, side, (s) => s.familyChangesPerBodyPerMin), colSide(rows.R0, side, (s) => s.familyChangesPerBodyPerMin), offset++),
    i2DriftMedian: pairedCI(colSide(rr, side, (s) => s.driftMedian), colSide(rows.R0, side, (s) => s.driftMedian), offset++),
    i3SpacingMedian: pairedCI(colSide(rr, side, (s) => s.spacingMedian), colSide(rows.R0, side, (s) => s.spacingMedian), offset++),
    i3SpacingUnder4: pairedCI(colSide(rr, side, (s) => s.spacingUnder4), colSide(rows.R0, side, (s) => s.spacingUnder4), offset++),
    i4OwnWithin5: pairedCI(colSide(rr, side, (s) => s.ballNear), colSide(rows.R0, side, (s) => s.ballNear), offset++),
    i4OwnWithin10: pairedCI(colSide(rr, side, (s) => s.ballMid), colSide(rows.R0, side, (s) => s.ballMid), offset++),
    i5RestCount: pairedCI(colSide(rr, side, (s) => s.restCount), colSide(rows.R0, side, (s) => s.restCount), offset++),
    i5RestSlotShare: pairedCI(colSide(rr, side, (s) => s.restSlotShare), colSide(rows.R0, side, (s) => s.restSlotShare), offset++),
    i6DupRunShare: pairedCI(colSide(rr, side, (s) => s.dupRunShare), colSide(rows.R0, side, (s) => s.dupRunShare), offset++),
    i7ShapeSpreadX: pairedCI(colSide(rr, side, (s) => s.shapeDeltaSpreadX), colSide(rows.R0, side, (s) => s.shapeDeltaSpreadX), offset++),
    i7ShapeSpreadY: pairedCI(colSide(rr, side, (s) => s.shapeDeltaSpreadY), colSide(rows.R0, side, (s) => s.shapeDeltaSpreadY), offset++),
  });
  const allSpells = (rr: MatchRow[]) => rr.flatMap((r) => r.spellDurations);
  const passShare = (rr: MatchRow[], selNum: (s: SideRow) => number) => rr.map((r) => {
    const p = r.sides[0].passes + r.sides[1].passes;
    return p === 0 ? Number.NaN : (selNum(r.sides[0]) + selNum(r.sides[1])) / p;
  });
  const ecology = {
    p0SevenR3: { side0: p0Seven(rows.R3, 0), side1: p0Seven(rows.R3, 1) },
    shotsPerMatch: pairedCI(colSum(rows.R3, (s) => s.shots), colSum(rows.R0, (s) => s.shots), offset++),
    possessionSpellsPerMatch: pairedCI(rows.R3.map((r) => r.possessionSpells), rows.R0.map((r) => r.possessionSpells), offset++),
    possessionSpellDuration: {
      r0: { p50: round(quantile(allSpells(rows.R0), 0.5)), p90: round(quantile(allSpells(rows.R0), 0.9)), mean: round(mean(allSpells(rows.R0))) },
      r3: { p50: round(quantile(allSpells(rows.R3), 0.5)), p90: round(quantile(allSpells(rows.R3), 0.9)), mean: round(mean(allSpells(rows.R3))) },
    },
    longBallShare: pairedCI(passShare(rows.R3, (s) => s.longBalls), passShare(rows.R0, (s) => s.longBalls), offset++),
    forwardPassShare: pairedCI(passShare(rows.R3, (s) => s.passesForward), passShare(rows.R0, (s) => s.passesForward), offset++),
    giveAndGosPerMatch: pairedCI(colSum(rows.R3, (s) => s.oneTwos), colSum(rows.R0, (s) => s.oneTwos), offset++),
    longestChain: pairedCI(
      rows.R3.map((r) => Math.max(r.sides[0].bestPassChain, r.sides[1].bestPassChain)),
      rows.R0.map((r) => Math.max(r.sides[0].bestPassChain, r.sides[1].bestPassChain)), offset++,
    ),
  };

  // pooled per-arm eye activity (the ladder saturation of eye decisions).
  const eyeActivity = Object.fromEntries((['R1', 'R2', 'R3'] as const).map((a) => {
    const t = traces[a];
    const abstainUnseen = t.abstainNoSnapshot + t.abstainNoBall + t.abstainNoOwner;
    return [a, {
      decisions: t.decisions, deviate: t.deviate, tie: t.tie, noCell: t.noCell,
      abstainUnseen, overrideTicks: t.overrideTicks, nonStationTicks: t.nonStationTicks,
      deviationShareByDecision: round(t.deviate / (t.decisions || 1)),
      byCandidate: Object.fromEntries([...t.byCandidate.entries()].sort((x, y) => y[1] - x[1])),
      byContext: Object.fromEntries([...t.byContext.entries()].sort((x, y) => y[1] - x[1])),
    }];
  }));

  // ===== §4.4 X-family (structural) + gate assembly =====
  const gates = {
    scrambleQuiet: !scramble.fires,
    pileupQuiet: !pileup.fires,
    restDefQuiet: !restDefence.fires,
    offsideCanaryQuiet: !offsideCanary.fires,
    boxCanaryQuiet: !boxCanary.fires,
    restartCanaryQuiet: !restartCanary.fires,
    equilibriumBandHolds: bandHolds,
    eyeNeverTouchesBall: release.eyeAttributable === 0 && release.unattributable === 0,
    // X-OFF-IDENT / X-FP-PROD / X-SEAM / X-DET finalised at the top level.
  };

  return {
    experiment: 'STAGE3-V3-P3a (the deployment ladder + the full HARD battery)',
    authority: 'STAGE3-V3-P3A-DEPLOYMENT (rulings #86 authorized; #87 review PASS + build/run)',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      matchesPerArm: seeds.length, arms: ['R0', 'R1', 'R2', 'R3'],
      seedFormula: '9,300,000 + blockIndex*100,000 + k, blockIndex 0..3, k 0..199',
      clusterUnit: 'match seed (paired across arms)',
      bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
      sampleEvery: SAMPLE_EVERY, sampleHz: round(1 / SAMPLE_DT, 3), pairSubsample: PAIR_SUBSAMPLE,
      capMatches: Number.isFinite(CAP_MATCHES) ? CAP_MATCHES : null,
      allNeutral: 'w_s = w_c = 0.5 on every arm; R1 gid = 1 + (matchSeed mod 5) side 0',
      tableCanonicalSha, controlSha, pooledControl: rawControl.pooledControl,
      controlGuardPass: rawControl.guard.pass,
      world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
      flags: CENSUS_FLAGS,
    },
    watchabilityHardLimbs: {
      scramble: { instrument: 'I4 own-within-5m', p0Ref: P0_I4_OWN5, ...scramble },
      pileup: { instrument: 'I3 share <4m', p0Ref: P0_I3_UNDER4, ...pileup },
      restDefence: { instrument: 'I5(b) designated slot', p0Ref: P0_I5_SLOT, ...restDefence },
      offsideCanary, boxCanary, restartCanary,
      arrivalClassMix: { r0: arrivalMix(rows.R0), r3: arrivalMix(rows.R3) },
    },
    equilibriumBand: { ...band, holds: bandHolds, r0Holds: r0BandHolds },
    shapeAdjudicators,
    perRole: {
      byRole: perRoleReport,
      roleMixTV: { ...roleMix, incumbentRef: INCUMBENT_ROLE_TV, moreDistinctThanIncumbent: Number.isFinite(roleMix.mean) && roleMix.mean >= INCUMBENT_ROLE_TV },
    },
    signedDifferential,
    ecology,
    eyeActivity,
    structural: {
      release,
      exclusionCounts: exclusion,
      receipts: {
        cap: RECEIPT_CAP,
        counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
        records: receipts,
      },
    },
    r0Sigs: rows.R0.map((r) => r.signature),
    gates,
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const canonical = (v: unknown): string => JSON.stringify(v);
const first = runExperiment();
const second = SKIP_DET ? first : runExperiment();
const deterministic = SKIP_DET ? false : canonical(first) === canonical(second);

// --- X-OFF-IDENT: R0 (enriched, eye null) byte-identical to the enriched world
// run with no stationEye field ever touched (the role-eye-off pin). ------------
const offIdentSeeds: number[] = [];
outerPin: for (let b = 0; b < BLOCKS; b++) {
  for (let k = 0; k < MATCHES_PER_BLOCK; k++) {
    if (offIdentSeeds.length >= CAP_MATCHES) break outerPin;
    offIdentSeeds.push(SEED_START + b * BLOCK_STRIDE + k);
  }
}
let offIdentMismatch = 0;
for (let i = 0; i < offIdentSeeds.length; i++) {
  const bare = matchOf(offIdentSeeds[i]); // never assigns stationEye — the pristine enriched world
  while (!bare.finished) bare.step(DT);
  if (signatureOf(bare) !== first.r0Sigs[i]) offIdentMismatch += 1;
}

// --- X-SEAM: stationEye null on a fresh Match; scope gating honoured; the eye
// never overrides a ball-directed action (E-NONSTATION). ----------------------
const seamMatch = matchOf(SEED_START);
const xSeamFreshNull = seamMatch.stationEye === null && seamMatch.stationEyeState.size === 0;
// body scope: after arming with a single gid, only that gid ever gets eye state.
const bodyGid = 1 + (SEED_START % 5);
const bodyM = matchOf(SEED_START);
bodyM.stationEye = { arm: 'neutral', scope: { kind: 'body', gid: bodyGid }, table: {}, v3: { roleTable, control } };
let bodyScopeOk = true;
let carrierNeverOverridden = true;
for (let i = 0; i < 3000 && !bodyM.finished; i++) {
  bodyM.step(DT);
  for (const [gid, st] of bodyM.stationEyeState) {
    if (gid !== bodyGid) bodyScopeOk = false;
    // the eye never overrides the carrier (a ball-directed body): if this gid owns
    // the ball, it must not carry an active off-ball override.
    if (bodyM.ball.owner !== null && bodyM.ball.owner.gid === gid && st.offset !== null) carrierNeverOverridden = false;
  }
}
// team scope: only side-0 outfielders ever get eye state.
const teamM = matchOf(SEED_START);
teamM.stationEye = { arm: 'neutral', scope: { kind: 'team', side: 0 }, table: {}, v3: { roleTable, control } };
let teamScopeOk = true;
for (let i = 0; i < 3000 && !teamM.finished; i++) {
  teamM.step(DT);
  for (const gid of teamM.stationEyeState.keys()) {
    if (Math.floor(gid / TEAM_SIZE) !== 0 || gid % TEAM_SIZE === 0) teamScopeOk = false;
  }
}
// both scope: eye state may populate on either side (only assert it activates).
const bothM = matchOf(SEED_START);
bothM.stationEye = { arm: 'neutral', scope: { kind: 'both' }, table: {}, v3: { roleTable, control } };
let bothActivated = false;
for (let i = 0; i < 3000 && !bothM.finished; i++) {
  bothM.step(DT);
  if (bothM.stationEyeState.size > 0) { bothActivated = true; break; }
}
const xSeam = xSeamFreshNull && bodyScopeOk && teamScopeOk && bothActivated && carrierNeverOverridden;

// --- X-FP-PROD: production fingerprint identical to the frozen baseline -------
const fpLeague = new League({ seed: FINGERPRINT_SEED });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
});
const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
const xFpProd = fingerprint === FINGERPRINT_BASELINE;

// HEAD the run states (#26.5).
let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); }
catch { head = 'git-unavailable'; }

const { r0Sigs, ...body } = first;

const gates = {
  ...body.gates,
  xFpProd,
  xSeam,
  xOffIdent: offIdentMismatch === 0,
  xDet: deterministic,
  tableShaUnchanged: tableCanonicalSha === '171a6dadee3b76e9683423a0af6ae5257bb4a8051a294f2d240d23da9016559f',
  controlGuardPass: rawControl.guard.pass,
};

const sha256 = createHash('sha256').update(canonical(first)).digest('hex');

const output = {
  ...body,
  head,
  fingerprint: { baseline: FINGERPRINT_BASELINE, observed: fingerprint, matches: xFpProd },
  offIdentity: { seeds: offIdentSeeds.length, mismatches: offIdentMismatch },
  seam: { freshNull: xSeamFreshNull, bodyScopeOk, teamScopeOk, bothActivated, carrierNeverOverridden },
  gates,
  sha256,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
const hl = output.watchabilityHardLimbs;
const bnd = output.equilibriumBand;
const rmtv = output.perRole.roleMixTV;
console.error(
  `V3-P3a ${output.verdict}`
  + ` · ${output.parameters.matchesPerArm} matches/arm × 4 arms · HEAD ${head}`
  + ` · scramble ${hl.scramble.fires} pileup ${hl.pileup.fires} restDef ${hl.restDefence.fires}`
  + ` · offside ${hl.offsideCanary.fires} box ${hl.boxCanary.fires} restart ${hl.restartCanary.fires}`
  + ` · band ${bnd.holds} (r0 ${bnd.r0Holds})`
  + ` · i3<4m R3 s0[${hl.pileup.side0.lower},${hl.pileup.side0.upper}] rel ${hl.pileup.side0.relative}`
  + ` · i3med R3 ${output.shapeAdjudicators.i3SpacingMedian.R3.diff} p10 ${output.shapeAdjudicators.i3SpacingP10.R3.diff}`
  + ` · dup R3 ${output.shapeAdjudicators.i6DupRunShare.R3.diff}`
  + ` · roleMixTV ${rmtv.mean} (>=${rmtv.incumbentRef}? ${rmtv.moreDistinctThanIncumbent})`
  + ` · WGdev ${output.perRole.byRole.WG.deviationRate} DFdev ${output.perRole.byRole.DF.deviationRate}`
  + ` · signedDiff R3 ${output.signedDifferential.R3.diff} CI[${output.signedDifferential.R3.lower},${output.signedDifferential.R3.upper}]`
  + ` · eyeAttrib ${output.structural.release.eyeAttributable}/unattr ${output.structural.release.unattributable}`
  + ` · xFpProd ${xFpProd} xSeam ${xSeam} xOffIdent ${gates.xOffIdent} (${offIdentMismatch} mism) xDet ${deterministic}`
  + ` · SHA ${sha256.slice(0, 12)}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
