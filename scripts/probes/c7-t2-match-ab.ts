// C7 T2 — THE MATCH-LEVEL A/B (deployment / watchability).
//
// Authority: docs/world-model/C7-T2-MATCH-AB.md (FROZEN pre-registration,
// 2026-07-29) + ruling #58 (T1 accepted, T2 drafting authorized with the
// goals-push risk pre-named) + ruling #59 (pre-registration reviewed PASS;
// #59.2 build + run authorized). No src/** changes: the certified law/seam
// already ship behind `c7Windup` (default OFF) from the T1 build (HEAD a6e7d9a);
// T2 arms the EXISTING flag as probe `Match` config.
//
// Two arms, paired same seeds (§2 — the wind-up is physics, symmetric, no
// adoption ladder):
//   R0      c7Windup OFF (c6Carry OFF) — must reproduce the shipped world
//           BIT-IDENTICALLY (the flag-off pin; fingerprint 57b0bd…c673).
//   R-BOTH  c7Windup ON on EVERY carrier's shot commit on BOTH sides, c6Carry
//           OFF — the deployment arm; every canary/band binds here, paired vs R0.
// ONE mechanic per A/B: c6Carry stays OFF in both arms (§2).
//
// It measures, exactly to the frozen spec:
//   §4.1 (i)  WATCHABILITY HARD LIMBS (any one firing STOPS THE QUEUE):
//               the scramble battery DEGEN-SCRAMBLE / DEGEN-PILEUP /
//               DEGEN-RESTDEF (P2-B §4.4 bands verbatim, I4/I3/I5b at 6 Hz),
//               and the standing canaries C-OFFSIDE / C-BOX / C-RESTART;
//   §4.2 (ii) THE §2 EQUILIBRIUM BAND (C1 §4 verbatim, absolute hard-abort on
//               R-BOTH's five headline rates — goals is the #58.3 HEADLINE band);
//   §4.3 (iii) THE SHOT / GOALS AXIS (#58.3 headline, both outcomes pre-laid):
//               goals/match paired delta (mechanism size) AND R-BOTH absolute vs
//               the §2 goals band [2.0352, 2.7536] (the hard-abort check); plus
//               REPORTED shots/match, seat-shot share, conversion, on-target,
//               blocks/match, charge-downs/match, realised W distribution,
//               match-level interruption rate, twisted-tail share;
//   §4.4 (iv) DUEL ECONOMY (tackles / turnover zone / turn-episode outcomes) —
//               REPORTED with CIs, NOT gated;
//   §4.5 (v)  LOOSE-BALL economy REPORTED, expected ~NULL (contract I3) and
//               guarded at exactly 0 by the STRUCTURAL SEAM gate; PC-KICK N/A
//               (C7 moves no origin — c6Carry OFF, the ball stays at the rigid
//               carry offset through the window);
//   §4.6      ECOLOGY (the P0 seven side-split, possession spells, long-ball
//               share, forward-pass share, give-and-gos, longest chain);
//   §4.7      X-FAMILY / STRUCTURAL: X-FP (league fingerprint unchanged),
//               X-OFF-IDENT (R0 ≡ shipped world across the 800 seeds), X-SEAM
//               (c7Windup null on a fresh Match), X-DET (two byte-identical runs
//               + canonical SHA), and STRUCTURAL SEAM-NEVER-RELEASES (#48.3 —
//               every ownership release on R-BOTH classes to a named EXISTING
//               channel; pendingKick-seam-attributable releases exactly 0; any
//               unattributable ⇒ FAIL).
//
// Output: docs/world-model/data/c7-t2-match-ab.json (SHA'd, twice byte-identical).

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { TURN_RATE } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { runHeadless } from '../../src/sim/simRunner';
import { formationSpot, runTarget, supportSpot } from '../../src/ai/formations';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- staging, frozen (doc §3) ------------------------------------------------
// seeds = 7,900,000 + blockIndex·100,000 + k, blockIndex 0..3, k 0..199
//       = 4 disjoint blocks × 200 = 800 matches per arm, range 7.9M..8.2M0199.
// 7,900,000 lies above every consumed range incl. all of C7 T0 and all of C7 T1.
const SEED_START = 7_900_000;
const BLOCK_STRIDE = 100_000;
const BLOCKS = 4;
const MATCHES_PER_BLOCK = 200; // 4 × 200 = 800 per arm (the C6 T2 / P2-B §4.6 precedent)
const BOOTSTRAP_SEED = 79_002; // frozen (doc §3.2)
const BOOTSTRAP_RESAMPLES = 2000;

// --- ENGINEERING smoke cap (does NOT touch the frozen staging for the real run) --
// C7_T2_CAP_MATCHES caps matches-per-arm for a crash/NaN smoke; when set, output
// is routed to C7_T2_OUT (a scratch path) so the canonical JSON is never
// overwritten. Unset (the authorized run) => full 800/arm, canonical output path.
const CAP_MATCHES = process.env.C7_T2_CAP_MATCHES
  ? Math.max(1, Number.parseInt(process.env.C7_T2_CAP_MATCHES, 10))
  : Number.POSITIVE_INFINITY;
const OUT_PATH = process.env.C7_T2_OUT ?? 'docs/world-model/data/c7-t2-match-ab.json';

// --- frozen instrument constants (P0 §2.2 buckets, verbatim) ------------------
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
const SWEEP_THRESHOLD = Math.PI / 2; // 90° turn episode (T1 window)
const OMEGA_LO = 0.1 * TURN_RATE; // essentially straight (episode end)
const POST_SWEEP_S = 0.5; // the T1 turn-episode outcome window (+0.5 s)
const RECEIPT_CAP = 1000; // per-class receipts cap (#49.3), first-N deterministic
const TWIST_DEG = 30; // twisted-tail θ threshold at commit (T1's 24.7% cut)

// --- P0 baselines the DEGEN battery bands are anchored on (doc §4.1) ----------
const P0_I4_OWN5 = 0.956; // DEGEN-SCRAMBLE
const P0_I3_UNDER4 = 0.0940; // DEGEN-PILEUP (share, 9.40%)
const P0_I5_SLOT = 0.6582; // DEGEN-RESTDEF (65.82%)
// two-part predicate thresholds (relative), P2-B §4.4 KEPT VERBATIM (doc §4.1):
const DEGEN_SCRAMBLE_REL = 0.25; // I4 own-within-5 m rises ≥ +25%
const DEGEN_PILEUP_REL = 0.50; // I3 share < 4 m rises ≥ +50%
const DEGEN_RESTDEF_REL = -0.20; // I5(b) slot falls ≥ 20% drop
// standing canaries (doc §4.1):
const CANARY_OFFSIDE_REL = 0.10; // C-OFFSIDE: offsides/match rise, point ≥ +10%
const CANARY_BOX_REL = -0.15; // C-BOX: box-at-arrival falls ≥ 15%
const CANARY_RESTART_REL = 0.10; // C-RESTART: restart ticks/match rise ≥ +10%

// --- §2 EQUILIBRIUM BAND (doc §4.2, C1 §4 verbatim, absolute hard-abort) ------
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
// the #58.3 headline goals band, laid out explicitly for the §4.3 absolute read:
const GOALS_BAND_LO = BAND_BASELINE.goals * (1 - BAND_TOLERANCE.goals); // 2.0352…
const GOALS_BAND_HI = BAND_BASELINE.goals * (1 + BAND_TOLERANCE.goals); // 2.7536…

// --- T1 fork-level cross-checks (doc §4.3 — REPORTED, never gated) ------------
const T1_W_P50 = 7; // T1 realised W p50 (ticks)
const T1_W_MEAN = 6.73; // T1 realised W mean (ticks)
const T1_INT_RATE = 0.0352; // T1 fork-level interruption rate (3.52%)
const T1_TWISTED_SHARE = 0.247; // T1 twisted-tail share at commit (24.7%)

// --- X-FP: the frozen shipped-world league fingerprint (57b0bd…c673) ----------
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337; // scripts/fingerprint.ts defaults
const FINGERPRINT_SEASONS = 2;

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
// R0 (armOn=false) sets c7Windup explicitly OFF (c6Carry OFF, one mechanic per
// A/B); shipped (armOn omitted) leaves both at the constructor default — X-OFF-
// IDENT proves the two are byte-identical.
const matchOf = (seed: number, armOn: boolean): Match =>
  new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    c6Carry: false, c7Windup: armOn,
  });
const shippedMatchOf = (seed: number): Match =>
  new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });

// --- small numeric helpers ---------------------------------------------------
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
const headingDelta = (
  prev: { x: number; y: number }, cur: { x: number; y: number },
): number => {
  let d = Math.atan2(cur.y, cur.x) - Math.atan2(prev.y, prev.x);
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};
// θ between a body's heading and its aim (deg) — the commit-orientation read.
const thetaCommitDeg = (p: Player, aim: { x: number; y: number }): number => {
  const dx = aim.x - p.pos.x;
  const dy = aim.y - p.pos.y;
  const l = Math.hypot(dx, dy) || 1;
  const dot = p.heading.x * (dx / l) + p.heading.y * (dy / l);
  return (Math.acos(Math.max(-1, Math.min(1, dot))) * 180) / Math.PI;
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

// --- ownership-release ledger (#48.3 / I3; R-BOTH only) ----------------------
// The pendingKick seam NEVER writes ball.owner (T1 X-STRUCT-1, certified): every
// release classes to a named EXISTING channel and seamAttributable is 0 by
// construction; the classification is exhaustive so unattributable stays 0.
interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  seamAttributable: number; // MUST be 0 (the seam never writes ball.owner)
  unattributable: number; // MUST be 0 (every release classes to a named channel)
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, seamAttributable: 0, unattributable: 0,
});

// --- wind-up ledger (§4.3, R-BOTH live; hooked at armPendingKick) ------------
interface WindupLedger {
  seatCommits: number; // armPendingKick calls (open-play/one-touch shot commits)
  struck: number; // wind-ups that resolved to a strike at readyTick
  interrupted: number; // wind-ups that cleared without a strike (INT-*)
  chargeDowns: number; // interruptions where the ball left the shooter (INT-TACKLE)
  otherInt: number; // interruptions with the ball still owned (phase/stun/cooldown)
  wTicks: number[]; // realised W ticks per armed wind-up
  struckThetas: number[]; // θ_commit (deg) per STRUCK wind-up (twisted-tail cut)
}
const newWindupLedger = (): WindupLedger => ({
  seatCommits: 0, struck: 0, interrupted: 0, chargeDowns: 0, otherInt: 0,
  wTicks: [], struckThetas: [],
});

// --- sampling-exclusion class counts (doc §5, REPORTED not gated) -------------
interface ExclusionCounts { ePaused: number; eGk: number; eEnded: number }
const newExclusion = (): ExclusionCounts => ({ ePaused: 0, eGk: 0, eEnded: 0 });

// --- one side's 6 Hz instrument row (P0 seven, side-split) --------------------
interface SideRow {
  // I1
  dwellMedian: number;
  familyChangesPerBodyPerMin: number;
  // I2
  driftMedian: number;
  driftFastShare: number;
  // I3
  spacingMedian: number;
  spacingUnder4: number;
  // I4
  ballNear: number; // own within 5 m — DEGEN-SCRAMBLE
  ballMid: number; // own within 10 m
  // I5
  restCount: number;
  restSlotShare: number; // DEGEN-RESTDEF
  // I6
  dupRunShare: number;
  // I7
  shapeDeltaCentroid: number;
  shapeDeltaSpreadX: number;
  shapeDeltaSpreadY: number;
  // canary / band / shot-economy raw counts (match totals for this side)
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
  spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
  ballNear: Number.NaN, ballMid: Number.NaN,
  restCount: Number.NaN, restSlotShare: Number.NaN, dupRunShare: Number.NaN,
  shapeDeltaCentroid: Number.NaN, shapeDeltaSpreadX: Number.NaN, shapeDeltaSpreadY: Number.NaN,
  offsides: 0, goals: 0, shots: 0, shotsOnTarget: 0, blocks: 0, crosses: 0, headersWon: 0,
  longBalls: 0, cutbacks: 0, passes: 0, passesCompleted: 0, passesForward: 0,
  oneTwos: 0, bestPassChain: 0, tackles: 0, interceptions: 0,
  boxAtArrival: Number.NaN, crossArrivals: 0,
});

// --- the whole per-match output (cluster unit = match seed) -------------------
interface MatchRow {
  readonly seed: number;
  readonly arm: 'R0' | 'RBOTH';
  readonly sides: [SideRow, SideRow];
  readonly restartTicks: number;
  readonly looseCount: number; // ownership releases to no-owner (PC-LOOSE reported)
  readonly possessionSpells: number;
  readonly spellDurations: number[]; // seconds
  // turnover zone histogram (relative to the LOSING team), REPORTED
  readonly turnoverOwnThird: number;
  readonly turnoverMiddle: number;
  readonly turnoverTheirThird: number;
  // turn-episode outcomes (≥90° sweep, T1 window), REPORTED
  readonly turnEpisodes: number;
  readonly turnEpisodesLostInWindow: number;
  // C-BOX arrival-class mix (probe-local proxy, REPORTED)
  readonly arrivalC0: number;
  readonly arrivalC1: number;
  readonly arrivalC2: number;
  readonly arrivalC3: number;
  readonly signature: string;
}

// --- one match, one arm ------------------------------------------------------
const runMatch = (
  seed: number, armOn: boolean, release: ReleaseLedger | null, exclusion: ExclusionCounts | null,
  windup: WindupLedger | null, receipts: ReceiptBook | null,
): MatchRow => {
  const m = matchOf(seed, armOn);
  const per: [SideRow, SideRow] = [emptySide(), emptySide()];

  // --- wind-up hook (R-BOTH only): capture W ticks + θ_commit at each arm. ---
  // A single pendingKick slot exists; each arm records its realised W and the
  // committing body's θ, and the active wind-up's θ is banked when it strikes.
  let activeWindup: { gid: number; theta: number } | null = null;
  if (windup !== null) {
    const orig = m.armPendingKick.bind(m);
    (m as unknown as { armPendingKick: (p: Player, aim: { x: number; y: number }) => void })
      .armPendingKick = (p, aim) => {
        const commitStep = m.simTick;
        orig(p, aim);
        const pk = m.pendingKick;
        if (pk !== null && pk.gid === p.gid) {
          windup.seatCommits += 1;
          windup.wTicks.push(pk.readyTick - commitStep);
          activeWindup = { gid: p.gid, theta: thetaCommitDeg(p, aim) };
        }
      };
  }

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
  const restSlotTicks = [0, 0];
  const runTicks = [0, 0];
  const dupRunTicks = [0, 0];

  // full-rate accumulators.
  let restartTicks = 0;
  let looseCount = 0;
  let samples = 0;
  let tick = 0;
  const crossesBefore: [number, number] = [0, 0];
  const inFlight: { side: 0 | 1; deadline: number; headersAtStart: number; arrived: boolean; maxInBox: number }[] = [];
  let arrivalC0 = 0, arrivalC1 = 0, arrivalC2 = 0, arrivalC3 = 0;

  // possession / turnover / spell tracking.
  let lastValidPoss: number | -1 = -1;
  let spellStartTick = 0;
  let possessionSpells = 0;
  const spellDurations: number[] = [];
  let turnoverOwnThird = 0, turnoverMiddle = 0, turnoverTheirThird = 0;

  // release classification.
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = m.ball.owner?.side ?? null;

  // turn-episode (≥90° sweep) tracking (T1 window).
  let sweepGid: number | null = null;
  let sweepPrevHeading: { x: number; y: number } | null = null;
  let sweepAccum = 0;
  let inEpisode = false;
  let episodeWindowEnd = -1; // sim-time deadline for a lost-in-window outcome
  let turnEpisodes = 0;
  let turnEpisodesLostInWindow = 0;

  while (!m.finished) {
    const ownedBefore = m.ball.owner !== null;
    const pendBefore = m.pendingKick; // wind-up resolution detection (R-BOTH)
    const shotsBeforeStep = m.shotLog.length;
    m.step(DT);
    tick += 1;
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;

    // --- wind-up resolution (R-BOTH): the single slot cleared this tick? ---
    if (windup !== null && activeWindup !== null && pendBefore !== null
      && (m.pendingKick === null || m.pendingKick.gid !== pendBefore.gid)) {
      const aw = activeWindup as { gid: number; theta: number };
      const struck = m.shotLog.length > shotsBeforeStep;
      if (struck) {
        windup.struck += 1;
        windup.struckThetas.push(aw.theta);
      } else {
        windup.interrupted += 1;
        const owner = m.ball.owner;
        if (owner === null || owner.gid !== aw.gid) windup.chargeDowns += 1;
        else windup.otherInt += 1;
      }
      activeWindup = null;
    }

    const owner = m.ball.owner;
    const playing = m.phase === 'playing';

    // --- sampling-exclusion class counts (REPORTED, R-BOTH ledger) ---
    if (exclusion !== null) {
      if (m.finished) exclusion.eEnded += 1;
      else if (!playing) exclusion.ePaused += 1;
      else if (owner !== null && owner.role === 'GK') exclusion.eGk += 1;
    }

    // --- ownership release (both arms count loose; R-BOTH classifies) ---
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
        // The seam only ever reads at strike time and writes ball.owner nowhere:
        // seam-attributable releases are 0 by construction, and the classification
        // above is exhaustive so unattributable stays 0. Both asserted by the gate.
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
        // a turnover for the LOSING team (lastValidPoss); bin by its localX.
        const loser = m.teams[lastValidPoss];
        const lx = loser.localX(m.ball.pos.x);
        if (lx < -REST_THIRD) turnoverOwnThird += 1;
        else if (lx > REST_THIRD) turnoverTheirThird += 1;
        else turnoverMiddle += 1;
      }
      lastValidPoss = poss;
    }

    // --- turn-episode (≥90° sweep) tracker for the duel-economy outcome ---
    const outfieldOwner = owner !== null && playing && !owner.sentOff && owner.role !== 'GK'
      && !(owner.gkHoldTimer > 0 || owner.gkDistributing) && m.restartKickGid !== owner.gid;
    if (outfieldOwner && owner !== null) {
      if (sweepGid !== owner.gid || sweepPrevHeading === null) {
        sweepGid = owner.gid;
        sweepPrevHeading = { x: owner.heading.x, y: owner.heading.y };
        sweepAccum = 0;
        inEpisode = false;
      } else {
        const dHead = headingDelta(sweepPrevHeading, owner.heading);
        const omega = Math.abs(dHead) / DT;
        sweepPrevHeading = { x: owner.heading.x, y: owner.heading.y };
        if (sweepAccum !== 0 && Math.sign(dHead) !== Math.sign(sweepAccum) && dHead !== 0) {
          sweepAccum = dHead;
        } else {
          sweepAccum += dHead;
        }
        if (!inEpisode && Math.abs(sweepAccum) >= SWEEP_THRESHOLD) inEpisode = true;
        if (inEpisode && omega < OMEGA_LO) {
          turnEpisodes += 1;
          episodeWindowEnd = m.simTime + POST_SWEEP_S;
          inEpisode = false;
          sweepAccum = 0;
        }
      }
    } else {
      sweepGid = null;
      sweepPrevHeading = null;
      sweepAccum = 0;
      inEpisode = false;
    }
    // a lost-to-the-opponent release inside the post-sweep window = the outcome.
    if (episodeWindowEnd >= 0 && m.simTime <= episodeWindowEnd
      && released && prevOwnerSide !== null
      && (newOwner === null || newOwner.side !== prevOwnerSide)) {
      turnEpisodesLostInWindow += 1;
      episodeWindowEnd = -1;
    } else if (episodeWindowEnd >= 0 && m.simTime > episodeWindowEnd) {
      episodeWindowEnd = -1;
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
      // arrival-class mix (probe-local proxy, disclosed; C4 T0's four meanings):
      const headed = m.teams[f.side].stats.headersWon > f.headersAtStart;
      if (headed) arrivalC3 += 1; // C3 HEADER
      else if (!f.arrived) arrivalC0 += 1; // C0 NEVER-ARRIVED (window expired unmet)
      else if (f.maxInBox === 0) arrivalC1 += 1; // C1 NOBODY-THERE
      else arrivalC2 += 1; // C2 ARRIVED-NO-HEADER
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

  // close the final possession spell.
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
    s.spacingMedian = quantile(pairs[side], 0.5);
    s.spacingUnder4 = pairs[side].filter((v) => v < CLOSE_PAIR_M).length / (pairs[side].length || 1);
    s.ballNear = mean(ballNear[side]);
    s.ballMid = mean(ballMid[side]);
    s.restCount = mean(restCount[side]);
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
  return {
    seed, arm: armOn ? 'RBOTH' : 'R0', sides: per, restartTicks, looseCount,
    possessionSpells, spellDurations,
    turnoverOwnThird, turnoverMiddle, turnoverTheirThird,
    turnEpisodes, turnEpisodesLostInWindow,
    arrivalC0, arrivalC1, arrivalC2, arrivalC3, signature: sig,
  };
};

// --- cluster bootstrap over match seeds (#20), paired R-BOTH vs R0 -----------
interface PairedCI {
  n: number; control: number; treated: number; diff: number;
  lower: number; upper: number; relative: number; resolved: boolean;
}
const pairedCI = (
  treated: readonly number[], control: readonly number[], offset: number,
): PairedCI => {
  const diffs: number[] = [];
  const ctrl: number[] = [];
  for (let i = 0; i < treated.length; i++) {
    const d = treated[i] - control[i];
    if (Number.isFinite(d)) { diffs.push(d); ctrl.push(control[i]); }
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

// --- the experiment ----------------------------------------------------------
const runExperiment = () => {
  const seeds: number[] = [];
  outer: for (let b = 0; b < BLOCKS; b++) {
    for (let k = 0; k < MATCHES_PER_BLOCK; k++) {
      if (seeds.length >= CAP_MATCHES) break outer;
      seeds.push(SEED_START + b * BLOCK_STRIDE + k);
    }
  }

  const release = newReleaseLedger();
  const exclusion = newExclusion();
  const windup = newWindupLedger();
  const receipts: ReceiptBook = {};

  const r0: MatchRow[] = [];
  const rboth: MatchRow[] = [];
  for (const seed of seeds) {
    r0.push(runMatch(seed, false, null, null, null, null));
    rboth.push(runMatch(seed, true, release, exclusion, windup, receipts));
  }

  // helper: per-side column, and both-sides-summed per-match column.
  const colSide = (rows: MatchRow[], side: 0 | 1, sel: (s: SideRow) => number): number[] =>
    rows.map((r) => sel(r.sides[side]));
  const colSum = (rows: MatchRow[], sel: (s: SideRow) => number): number[] =>
    rows.map((r) => sel(r.sides[0]) + sel(r.sides[1]));

  let offset = 0;

  // ===== §4.1 (i) WATCHABILITY HARD LIMBS =====
  // scramble battery — side-split, fires if EITHER side fires (P2-B §4.4).
  const degenLimb = (
    sel: (s: SideRow) => number, rel: number, sign: 1 | -1,
  ) => {
    const s0 = pairedCI(colSide(rboth, 0, sel), colSide(r0, 0, sel), offset++);
    const s1 = pairedCI(colSide(rboth, 1, sel), colSide(r0, 1, sel), offset++);
    const fires = (c: PairedCI) => (sign === 1
      ? c.lower > 0 && c.relative >= rel
      : c.upper < 0 && c.relative <= rel);
    return { side0: s0, side1: s1, band: rel, fires: fires(s0) || fires(s1) };
  };
  const scramble = degenLimb((s) => s.ballNear, DEGEN_SCRAMBLE_REL, 1); // I4 own within 5 m
  const pileup = degenLimb((s) => s.spacingUnder4, DEGEN_PILEUP_REL, 1); // I3 share < 4 m
  const restDefence = degenLimb((s) => s.restSlotShare, DEGEN_RESTDEF_REL, -1); // I5(b) slot

  // standing canaries — both sides summed (P2-B §4.3 pooled).
  const offsideCanaryCI = pairedCI(colSum(rboth, (s) => s.offsides), colSum(r0, (s) => s.offsides), offset++);
  const offsideCanary = {
    ...offsideCanaryCI, band: CANARY_OFFSIDE_REL,
    fires: offsideCanaryCI.lower > 0 && offsideCanaryCI.relative >= CANARY_OFFSIDE_REL,
  };
  // C-BOX: cross-arrival box presence, weighted by arrivals per match (P2-B form).
  const boxOf = (rows: MatchRow[]) => rows.map((r) => {
    const a = r.sides[0].boxAtArrival; const b = r.sides[1].boxAtArrival;
    const na = r.sides[0].crossArrivals; const nb = r.sides[1].crossArrivals;
    if (na + nb === 0) return Number.NaN;
    return ((Number.isFinite(a) ? a * na : 0) + (Number.isFinite(b) ? b * nb : 0)) / (na + nb);
  });
  const boxCanaryCI = pairedCI(boxOf(rboth), boxOf(r0), offset++);
  const boxCanary = {
    ...boxCanaryCI, band: CANARY_BOX_REL,
    fires: boxCanaryCI.upper < 0 && boxCanaryCI.relative <= CANARY_BOX_REL,
  };
  const restartCanaryCI = pairedCI(rboth.map((r) => r.restartTicks), r0.map((r) => r.restartTicks), offset++);
  const restartCanary = {
    ...restartCanaryCI, band: CANARY_RESTART_REL,
    fires: restartCanaryCI.lower > 0 && restartCanaryCI.relative >= CANARY_RESTART_REL,
  };
  // arrival-class mix (REPORTED alongside C-BOX so a class-MIX shift shows).
  const arrivalMix = (rows: MatchRow[]) => ({
    C0: rows.reduce((s, r) => s + r.arrivalC0, 0),
    C1: rows.reduce((s, r) => s + r.arrivalC1, 0),
    C2: rows.reduce((s, r) => s + r.arrivalC2, 0),
    C3: rows.reduce((s, r) => s + r.arrivalC3, 0),
  });

  // ===== §4.2 (ii) THE §2 EQUILIBRIUM BAND (absolute, hard-abort on R-BOTH) =====
  const matchCount = seeds.length;
  const perMatchRate = (rows: MatchRow[], sel: (s: SideRow) => number): number =>
    rows.reduce((acc, r) => acc + sel(r.sides[0]) + sel(r.sides[1]), 0) / matchCount;
  const bandDim = (key: keyof typeof BAND_BASELINE, sel: (s: SideRow) => number) => {
    const baseline = BAND_BASELINE[key];
    const tol = BAND_TOLERANCE[key];
    const lo = baseline * (1 - tol);
    const hi = baseline * (1 + tol);
    const rboth_ = perMatchRate(rboth, sel);
    const r0_ = perMatchRate(r0, sel);
    return {
      baseline, tolerance: tol, lo: round(lo), hi: round(hi),
      rboth: round(rboth_), r0: round(r0_),
      relativeVsBaseline: round(rboth_ / baseline - 1),
      insideBand: rboth_ >= lo && rboth_ <= hi,
      r0InsideBand: r0_ >= lo && r0_ <= hi,
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

  // ===== §4.3 (iii) THE SHOT / GOALS AXIS — the #58.3 HEADLINE =====
  // goals/match — the mechanism size (paired delta, R-BOTH − R0) AND the R-BOTH
  // absolute point vs the §2 goals band (the hard-abort read lives in `band.goals`).
  const goalsDelta = pairedCI(colSum(rboth, (s) => s.goals), colSum(r0, (s) => s.goals), offset++);
  const goalsAxis = {
    // (1) the mechanism size — paired delta with CI (T1's fork +2.94 pp → ~+8%).
    pairedDelta: goalsDelta,
    // (2) the hard-abort check — R-BOTH absolute vs the §2 band [2.0352, 2.7536].
    band: {
      lo: round(GOALS_BAND_LO), hi: round(GOALS_BAND_HI),
      baseline: BAND_BASELINE.goals,
      rbothPerMatch: band.goals.rboth,
      r0PerMatch: band.goals.r0,
      relativeVsBaseline: band.goals.relativeVsBaseline,
      insideBand: band.goals.insideBand,
      distToUpperEdge: round(GOALS_BAND_HI - band.goals.rboth),
      distToLowerEdge: round(band.goals.rboth - GOALS_BAND_LO),
    },
  };

  // shot economy — REPORTED with CIs (paired vs R0), none gated.
  const convRate = (r: MatchRow) => {
    const sh = r.sides[0].shots + r.sides[1].shots;
    return sh === 0 ? Number.NaN : (r.sides[0].goals + r.sides[1].goals) / sh;
  };
  const onTargetRate = (r: MatchRow) => {
    const sh = r.sides[0].shots + r.sides[1].shots;
    return sh === 0 ? Number.NaN : (r.sides[0].shotsOnTarget + r.sides[1].shotsOnTarget) / sh;
  };
  const totalShotsRBOTH = rboth.reduce((s, r) => s + r.sides[0].shots + r.sides[1].shots, 0);
  const shotEconomy = {
    shotsPerMatch: pairedCI(colSum(rboth, (s) => s.shots), colSum(r0, (s) => s.shots), offset++),
    conversion: pairedCI(rboth.map(convRate), r0.map(convRate), offset++),
    onTargetRate: pairedCI(rboth.map(onTargetRate), r0.map(onTargetRate), offset++),
    blocksPerMatch: pairedCI(colSum(rboth, (s) => s.blocks), colSum(r0, (s) => s.blocks), offset++),
    // wind-up-specific (R-BOTH live; there is no wind-up on R0), cross-checks vs T1.
    seatShotShare: {
      seatCommits: windup.seatCommits, totalShots: totalShotsRBOTH,
      share: round(totalShotsRBOTH === 0 ? Number.NaN : windup.seatCommits / totalShotsRBOTH),
    },
    chargeDownsPerMatch: round(windup.chargeDowns / matchCount),
    wDistributionRealised: {
      n: windup.wTicks.length,
      p10: round(quantile(windup.wTicks, 0.1), 2),
      p50: round(quantile(windup.wTicks, 0.5), 2),
      p90: round(quantile(windup.wTicks, 0.9), 2),
      mean: round(mean(windup.wTicks), 4),
      meanSec: round(mean(windup.wTicks) * DT, 5),
      t1p50: T1_W_P50, t1mean: T1_W_MEAN,
    },
    interruptionRateMatchLevel: {
      seatCommits: windup.seatCommits, struck: windup.struck, interrupted: windup.interrupted,
      chargeDowns: windup.chargeDowns, otherInt: windup.otherInt,
      rate: round(windup.seatCommits === 0 ? Number.NaN : windup.interrupted / windup.seatCommits),
      t1ForkRate: T1_INT_RATE,
    },
    twistedTailShare: {
      struck: windup.struck,
      twisted: windup.struckThetas.filter((t) => t >= TWIST_DEG).length,
      share: round(windup.struck === 0 ? Number.NaN
        : windup.struckThetas.filter((t) => t >= TWIST_DEG).length / windup.struck),
      t1Share: T1_TWISTED_SHARE,
    },
  };

  // ===== §4.4 (iv) DUEL ECONOMY (REPORTED, not gated) =====
  const duelEconomy = {
    tacklesPerMatch: pairedCI(colSum(rboth, (s) => s.tackles), colSum(r0, (s) => s.tackles), offset++),
    interceptionsPerMatch: pairedCI(colSum(rboth, (s) => s.interceptions), colSum(r0, (s) => s.interceptions), offset++),
    turnoverZone: {
      ownThird: pairedCI(rboth.map((r) => r.turnoverOwnThird), r0.map((r) => r.turnoverOwnThird), offset++),
      middle: pairedCI(rboth.map((r) => r.turnoverMiddle), r0.map((r) => r.turnoverMiddle), offset++),
      theirThird: pairedCI(rboth.map((r) => r.turnoverTheirThird), r0.map((r) => r.turnoverTheirThird), offset++),
    },
    turnEpisodes: pairedCI(rboth.map((r) => r.turnEpisodes), r0.map((r) => r.turnEpisodes), offset++),
    turnEpisodeLossRate: pairedCI(
      rboth.map((r) => (r.turnEpisodes === 0 ? Number.NaN : r.turnEpisodesLostInWindow / r.turnEpisodes)),
      r0.map((r) => (r.turnEpisodes === 0 ? Number.NaN : r.turnEpisodesLostInWindow / r.turnEpisodes)),
      offset++,
    ),
    note: 'tackle attempts are not separately counted in stats (only successful '
      + 'recoveries increment stats.tackles); success-count + interceptions + the '
      + 'turnover zone + turn-episode outcomes stand as the reported turnover economy',
  };

  // ===== §4.5 (v) LOOSE-BALL ECONOMY — REPORTED, expected ~NULL (I3) =====
  // No priced band (PC-LOOSE demoted, #19); guarded at exactly 0 by the STRUCTURAL
  // SEAM gate. A resolved loose-ball INCREASE without a gate failure ⇒ reading (D).
  const looseCI = pairedCI(rboth.map((r) => r.looseCount), r0.map((r) => r.looseCount), offset++);
  const looseBall = {
    ...looseCI,
    r0PerMatch: round(mean(r0.map((r) => r.looseCount))),
    rbothPerMatch: round(mean(rboth.map((r) => r.looseCount))),
    resolvedIncrease: looseCI.resolved && looseCI.diff > 0, // reading (D) trigger
    note: 'C7 opens no new loose-ball channel (contract I3); an interruption is an '
      + 'EXISTING ball-keyed tackle. REPORTED, guarded at exactly 0 by the structural '
      + 'seam gate; a resolved increase without a gate failure is a reading-(D) surprise.',
  };

  // ===== §4.6 ECOLOGY (REPORTED, never gated) =====
  const p0Seven = (side: 0 | 1) => ({
    i1DwellMedian: pairedCI(colSide(rboth, side, (s) => s.dwellMedian), colSide(r0, side, (s) => s.dwellMedian), offset++),
    i1FamilyChanges: pairedCI(colSide(rboth, side, (s) => s.familyChangesPerBodyPerMin), colSide(r0, side, (s) => s.familyChangesPerBodyPerMin), offset++),
    i2DriftMedian: pairedCI(colSide(rboth, side, (s) => s.driftMedian), colSide(r0, side, (s) => s.driftMedian), offset++),
    i3SpacingMedian: pairedCI(colSide(rboth, side, (s) => s.spacingMedian), colSide(r0, side, (s) => s.spacingMedian), offset++),
    i3SpacingUnder4: pairedCI(colSide(rboth, side, (s) => s.spacingUnder4), colSide(r0, side, (s) => s.spacingUnder4), offset++),
    i4OwnWithin5: pairedCI(colSide(rboth, side, (s) => s.ballNear), colSide(r0, side, (s) => s.ballNear), offset++),
    i4OwnWithin10: pairedCI(colSide(rboth, side, (s) => s.ballMid), colSide(r0, side, (s) => s.ballMid), offset++),
    i5RestCount: pairedCI(colSide(rboth, side, (s) => s.restCount), colSide(r0, side, (s) => s.restCount), offset++),
    i5RestSlotShare: pairedCI(colSide(rboth, side, (s) => s.restSlotShare), colSide(r0, side, (s) => s.restSlotShare), offset++),
    i6DupRunShare: pairedCI(colSide(rboth, side, (s) => s.dupRunShare), colSide(r0, side, (s) => s.dupRunShare), offset++),
    i7ShapeDeltaCentroid: pairedCI(colSide(rboth, side, (s) => s.shapeDeltaCentroid), colSide(r0, side, (s) => s.shapeDeltaCentroid), offset++),
    i7ShapeDeltaSpreadX: pairedCI(colSide(rboth, side, (s) => s.shapeDeltaSpreadX), colSide(r0, side, (s) => s.shapeDeltaSpreadX), offset++),
    i7ShapeDeltaSpreadY: pairedCI(colSide(rboth, side, (s) => s.shapeDeltaSpreadY), colSide(r0, side, (s) => s.shapeDeltaSpreadY), offset++),
  });
  const allSpells = (rows: MatchRow[]) => rows.flatMap((r) => r.spellDurations);
  const ecology = {
    p0Seven: { side0: p0Seven(0), side1: p0Seven(1) },
    shotsPerMatch: pairedCI(colSum(rboth, (s) => s.shots), colSum(r0, (s) => s.shots), offset++),
    possessionSpellsPerMatch: pairedCI(rboth.map((r) => r.possessionSpells), r0.map((r) => r.possessionSpells), offset++),
    possessionSpellDuration: {
      r0: { p50: round(quantile(allSpells(r0), 0.5)), p90: round(quantile(allSpells(r0), 0.9)), mean: round(mean(allSpells(r0))) },
      rboth: { p50: round(quantile(allSpells(rboth), 0.5)), p90: round(quantile(allSpells(rboth), 0.9)), mean: round(mean(allSpells(rboth))) },
    },
    longBallShare: pairedCI(
      rboth.map((r) => { const p = r.sides[0].passes + r.sides[1].passes; return p === 0 ? Number.NaN : (r.sides[0].longBalls + r.sides[1].longBalls) / p; }),
      r0.map((r) => { const p = r.sides[0].passes + r.sides[1].passes; return p === 0 ? Number.NaN : (r.sides[0].longBalls + r.sides[1].longBalls) / p; }),
      offset++,
    ),
    forwardPassShare: pairedCI(
      rboth.map((r) => { const p = r.sides[0].passes + r.sides[1].passes; return p === 0 ? Number.NaN : (r.sides[0].passesForward + r.sides[1].passesForward) / p; }),
      r0.map((r) => { const p = r.sides[0].passes + r.sides[1].passes; return p === 0 ? Number.NaN : (r.sides[0].passesForward + r.sides[1].passesForward) / p; }),
      offset++,
    ),
    giveAndGosPerMatch: pairedCI(colSum(rboth, (s) => s.oneTwos), colSum(r0, (s) => s.oneTwos), offset++),
    longestChain: pairedCI(
      rboth.map((r) => Math.max(r.sides[0].bestPassChain, r.sides[1].bestPassChain)),
      r0.map((r) => Math.max(r.sides[0].bestPassChain, r.sides[1].bestPassChain)),
      offset++,
    ),
  };

  // ===== §4.7 X-FAMILY / STRUCTURAL =====
  const r0Sigs = r0.map((r) => r.signature);

  const gates = {
    // watchability HARD limbs (all-quiet expected):
    scrambleQuiet: !scramble.fires,
    pileupQuiet: !pileup.fires,
    restDefQuiet: !restDefence.fires,
    offsideCanaryQuiet: !offsideCanary.fires,
    boxCanaryQuiet: !boxCanary.fires,
    restartCanaryQuiet: !restartCanary.fires,
    // §2 band (hard abort) — goals is the #58.3 headline band:
    equilibriumBandHolds: bandHolds,
    // structural (the one T2 ledger where "unexplained exactly 0" binds):
    seamNeverReleases: release.seamAttributable === 0 && release.unattributable === 0,
    // X-OFF-IDENT / X-FP / X-SEAM / X-DET finalised at the top level.
  };

  return {
    experiment: 'C7-T2 (the match-level A/B — deployment / watchability)',
    authority: 'C7-T2-MATCH-AB (ruling #58 T2 authorized; #59 reviewed PASS; #59.2 build+run)',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      matchesPerArm: seeds.length, arms: ['R0', 'RBOTH'],
      seedFormula: '7,900,000 + blockIndex*100,000 + k, blockIndex 0..3, k 0..199',
      clusterUnit: 'match seed (paired across arms)',
      bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
      sampleEvery: SAMPLE_EVERY, sampleHz: round(1 / SAMPLE_DT, 3), pairSubsample: PAIR_SUBSAMPLE,
      capMatches: Number.isFinite(CAP_MATCHES) ? CAP_MATCHES : null,
      oneMechanicPerAB: 'c6Carry OFF in both arms; the only difference is c7Windup',
    },
    watchabilityHardLimbs: {
      scramble: { instrument: 'I4 own-within-5m', p0Baseline: P0_I4_OWN5, ...scramble },
      pileup: { instrument: 'I3 share <4m', p0Baseline: P0_I3_UNDER4, ...pileup },
      restDefence: { instrument: 'I5(b) designated slot', p0Baseline: P0_I5_SLOT, ...restDefence },
      offsideCanary, boxCanary, restartCanary,
      arrivalClassMix: { r0: arrivalMix(r0), rboth: arrivalMix(rboth) },
    },
    equilibriumBand: { ...band, holds: bandHolds },
    shotGoalsAxis: { goals: goalsAxis, economy: shotEconomy },
    looseBall,
    duelEconomy,
    ecology,
    structural: {
      release,
      exclusionCounts: exclusion,
      receipts: {
        cap: RECEIPT_CAP,
        counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
        records: receipts,
      },
    },
    r0Sigs,
    gates,
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const canonical = (v: unknown): string => JSON.stringify(v);
const first = runExperiment();
const second = runExperiment();
const deterministic = canonical(first) === canonical(second);

// --- X-OFF-IDENT: R0 world signatures byte-identical to the shipped world -----
// (run the shipped/default-flag world for each seed, compare to R0's captured
// signatures — the flag-off pin. Runs once; unaffected by X-DET's double call.)
const offIdentSeeds: number[] = [];
outerPin: for (let b = 0; b < BLOCKS; b++) {
  for (let k = 0; k < MATCHES_PER_BLOCK; k++) {
    if (offIdentSeeds.length >= CAP_MATCHES) break outerPin;
    offIdentSeeds.push(SEED_START + b * BLOCK_STRIDE + k);
  }
}
let offIdentMismatch = 0;
for (let i = 0; i < offIdentSeeds.length; i++) {
  const shipped = shippedMatchOf(offIdentSeeds[i]);
  while (!shipped.finished) shipped.step(DT);
  if (signatureOf(shipped) !== first.r0Sigs[i]) offIdentMismatch += 1;
}

// --- X-SEAM: c7Windup is null/off on a fresh Match ---------------------------
const freshMatch = shippedMatchOf(SEED_START);
const xSeam = (freshMatch as unknown as { c7Windup: boolean }).c7Windup === false
  && freshMatch.pendingKick === null;

// --- X-FP: league fingerprint identical to the frozen baseline ---------------
const fpLeague = new League({ seed: FINGERPRINT_SEED });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
});
const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
const xFp = fingerprint === FINGERPRINT_BASELINE;

// HEAD the run states (#26.5).
let head: string;
try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); }
catch { head = 'git-unavailable'; }

// The r0Sigs array is bulky; keep counts only in the persisted output.
const { r0Sigs, ...body } = first;

const gates = {
  ...body.gates,
  xFp,
  xSeam,
  xOffIdent: offIdentMismatch === 0,
  xDet: deterministic,
};

const tableSha = createHash('sha256').update(canonical({
  watchabilityHardLimbs: body.watchabilityHardLimbs,
  equilibriumBand: body.equilibriumBand,
  shotGoalsAxis: body.shotGoalsAxis,
  looseBall: body.looseBall,
  duelEconomy: body.duelEconomy,
  ecology: body.ecology,
  structural: body.structural,
})).digest('hex');
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');

const output = {
  ...body,
  head,
  fingerprint: { baseline: FINGERPRINT_BASELINE, observed: fingerprint, matches: xFp },
  offIdentity: { seeds: offIdentSeeds.length, mismatches: offIdentMismatch },
  gates,
  tableSha,
  sha256,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
const hl = output.watchabilityHardLimbs;
const ga = output.shotGoalsAxis.goals;
const ec = output.shotGoalsAxis.economy;
console.error(
  `C7-T2 ${output.verdict}`
  + ` · ${output.parameters.matchesPerArm} matches/arm × 2 arms · HEAD ${head}`
  + ` · scramble ${hl.scramble.fires} pileup ${hl.pileup.fires} restDef ${hl.restDefence.fires}`
  + ` · offside ${hl.offsideCanary.fires} box ${hl.boxCanary.fires} restart ${hl.restartCanary.fires}`
  + ` · band ${output.equilibriumBand.holds}`
  + ` · goalsΔ ${ga.pairedDelta.diff} CI[${ga.pairedDelta.lower},${ga.pairedDelta.upper}] rel ${ga.pairedDelta.relative}`
  + ` · goals R-BOTH ${ga.band.rbothPerMatch} in[${ga.band.lo},${ga.band.hi}] inside ${ga.band.insideBand} (dUpper ${ga.band.distToUpperEdge})`
  + ` · seatShare ${ec.seatShotShare.share} intRate ${ec.interruptionRateMatchLevel.rate} chargeDowns/m ${ec.chargeDownsPerMatch}`
  + ` · Wp50 ${ec.wDistributionRealised.p50} mean ${ec.wDistributionRealised.mean} · twisted ${ec.twistedTailShare.share}`
  + ` · loose rel ${output.looseBall.relative} resolvedInc ${output.looseBall.resolvedIncrease}`
  + ` · seamRel off=${output.structural.release.seamAttributable}/unattr=${output.structural.release.unattributable}`
  + ` · xFp ${xFp} xSeam ${xSeam} xOffIdent ${gates.xOffIdent} (${offIdentMismatch} mism) xDet ${deterministic}`
  + ` · tableSHA ${tableSha.slice(0, 12)} · SHA ${sha256.slice(0, 12)}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
