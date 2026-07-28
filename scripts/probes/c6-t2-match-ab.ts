// C6 T2 — THE MATCH-LEVEL A/B (deployment / watchability).
//
// Authority: docs/world-model/C6-T2-MATCH-AB.md (FROZEN pre-registration,
// 2026-07-29) + ruling #51 (T2 authorized, user-ratified "跑") + ruling #52
// (pre-registration reviewed PASS; #52.3 build + run authorized). No src/**
// changes: the certified law/seam already ship behind `c6Carry` (default OFF)
// from the T1R build; T2 arms the EXISTING flag as probe `Match` config.
//
// Two arms, paired same seeds (#51.2 — physics is symmetric, no adoption ladder):
//   R0      c6Carry OFF  — must reproduce the shipped world BIT-IDENTICALLY.
//   R-BOTH  c6Carry ON, armed on EVERY outfield carrier on BOTH sides — the
//           deployment arm; every canary/band binds here, paired vs R0.
//
// It measures, exactly to the frozen spec:
//   §4.1 (i)  WATCHABILITY HARD LIMBS (any one firing STOPS THE QUEUE):
//               the scramble battery DEGEN-SCRAMBLE / DEGEN-PILEUP /
//               DEGEN-RESTDEF (P2-B §4.4 bands verbatim, I4/I3/I5b at 6 Hz with
//               P0's definitions, side-split, never summed), and the standing
//               canaries C-OFFSIDE / C-BOX / C-RESTART (two-part predicates);
//   §4.2 (ii) THE §2 EQUILIBRIUM BAND (C1 §4 verbatim, absolute hard-abort on
//               R-BOTH's five headline per-match rates);
//   §4.3 (iii) THE PRICED CONSEQUENCES PC-LOOSE (loose/turnover economy, band
//               [-0.43%, +0.85%] rel) and PC-KICK (kick-origin displacement
//               REPORTED + completion/shot/on-target each within ±5% rel);
//   §4.4 (iv) DUEL ECONOMY (tackles / turnover zone / turn-episode outcomes) —
//               REPORTED with CIs, NOT gated;
//   §4.5 (v)  ECOLOGY (the P0 seven side-split, shots, possession spells,
//               long-ball share, forward-pass share, give-and-gos, longest
//               chain) — REPORTED, never gated;
//   §4.6      X-FAMILY / STRUCTURAL: X-FP (league fingerprint unchanged),
//               X-OFF-IDENT (R0 ≡ shipped world across the 800 seeds), X-SEAM
//               (flag null on a fresh Match), X-DET (two byte-identical runs +
//               canonical SHA), and STRUCTURAL ZERO-LOOSE (#48.3 — every
//               ownership release on R-BOTH classes to a named channel;
//               offset-attributable releases exactly 0; any unattributable ⇒ FAIL).
//
// Output: docs/world-model/data/c6-t2-match-ab.json (SHA'd, twice byte-identical).

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
// seeds = 6,200,000 + blockIndex·100,000 + k, blockIndex 0..3, k 0..199
//       = 4 disjoint blocks × 200 = 800 matches per arm, range 6.2M..6.5M0199.
// 6,200,000 lies above every consumed range incl. all of T1/T1R (5.0M–6.1M).
const SEED_START = 6_200_000;
const BLOCK_STRIDE = 100_000;
const BLOCKS = 4;
const MATCHES_PER_BLOCK = 200; // 4 × 200 = 800 per arm (the P2-B §4.6 precedent)
const BOOTSTRAP_SEED = 62_003; // frozen (doc §3.2)
const BOOTSTRAP_RESAMPLES = 2000;

// --- ENGINEERING smoke cap (does NOT touch the frozen staging for the real run) --
// C6_T2_CAP_MATCHES caps matches-per-arm for a crash/NaN smoke; when set, output
// is routed to C6_T2_OUT (a scratch path) so the canonical JSON is never
// overwritten. Unset (the authorized run) => full 800/arm, canonical output path.
const CAP_MATCHES = process.env.C6_T2_CAP_MATCHES
  ? Math.max(1, Number.parseInt(process.env.C6_T2_CAP_MATCHES, 10))
  : Number.POSITIVE_INFINITY;
const OUT_PATH = process.env.C6_T2_OUT ?? 'docs/world-model/data/c6-t2-match-ab.json';

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
const CROSS_WINDOW_S = 4; // §4.3 C-BOX arrival window (C4's own 4 s)
const CARRY = 0.85; // the outfield glue offset (T1's CARRY, for PC-KICK)
const TACKLE_R = 1.15; // ball-keyed tackle radius (mechanics.ts)
const SPEED_GATE = 2.5; // de-glue speed gate (Match.ts) — release classification
const SWEEP_THRESHOLD = Math.PI / 2; // 90° turn episode (T1 window)
const OMEGA_LO = 0.1 * TURN_RATE; // essentially straight (episode end)
const POST_SWEEP_S = 0.5; // the T1 turn-episode outcome window (+0.5 s)
const RECEIPT_CAP = 1000; // per-class receipts cap (#49.3), first-N deterministic

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

// --- PC bands (doc §4.3, priced consequences per #51.1) ----------------------
const PC_LOOSE_LO = -0.0043; // resolved below ⇒ reading (d)
const PC_LOOSE_HI = 0.0085; // resolved above ⇒ reading (d)
const PC_KICK_TOL = 0.05; // each completion/shot rate within ±5% rel
// T1R's kick-origin displacement (same law), for the REPORTED cross-check:
const T1R_KICK_PER_SEAM_P50 = 0.30929;
const T1R_KICK_PER_SEAM_P90 = 0.66276;

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
// R0 (armOn=false) sets c6Carry explicitly OFF; shipped (armOn omitted) leaves
// it at the constructor default — X-OFF-IDENT proves the two are byte-identical.
const matchOf = (seed: number, armOn: boolean): Match =>
  new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), c6Carry: armOn });
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
const arrayMax = (xs: readonly number[]): number => {
  if (xs.length === 0) return Number.NaN;
  let m = xs[0];
  for (let i = 1; i < xs.length; i++) if (xs[i] > m) m = xs[i];
  return m;
};
const headingDelta = (
  prev: { x: number; y: number }, cur: { x: number; y: number },
): number => {
  let d = Math.atan2(cur.y, cur.x) - Math.atan2(prev.y, prev.x);
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
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

// --- ownership-release ledger (#48.3; R-BOTH only) ---------------------------
interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  offsetAttributable: number; // MUST be 0 (the seam never writes ball.owner)
  unattributable: number; // MUST be 0 (every release classes to a named channel)
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, offsetAttributable: 0, unattributable: 0,
});
const addReleaseLedger = (a: ReleaseLedger, b: ReleaseLedger): void => {
  a.releases += b.releases; a.tackle += b.tackle; a.deglue += b.deglue; a.kick += b.kick;
  a.ballWon += b.ballWon; a.offsetAttributable += b.offsetAttributable;
  a.unattributable += b.unattributable;
};

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
  // canary / band raw counts (match totals for this side)
  offsides: number;
  goals: number;
  shots: number;
  shotsOnTarget: number;
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
  offsides: 0, goals: 0, shots: 0, shotsOnTarget: 0, crosses: 0, headersWon: 0,
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
  readonly looseCount: number; // ownership releases to no-owner (PC-LOOSE)
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
  perTickDisp: number[] | null, kickDisp: number[] | null, receipts: ReceiptBook | null,
): MatchRow => {
  const m = matchOf(seed, armOn);
  const per: [SideRow, SideRow] = [emptySide(), emptySide()];

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

  // release classification + kick displacement.
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = m.ball.owner?.side ?? null;
  const lastHonestDisp = new Map<number, number>();

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
    m.step(DT);
    tick += 1;
    if (m.finished) break;
    if (m.restart !== null) restartTicks += 1;

    const owner = m.ball.owner;
    const playing = m.phase === 'playing';
    const outfieldOwner = owner !== null && playing && !owner.sentOff && owner.role !== 'GK'
      && !(owner.gkHoldTimer > 0 || owner.gkDistributing) && m.restartKickGid !== owner.gid;

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
            if (receipts) addReceipt(receipts, 'kick', seed, tick, relGid, 'kick/pass/clearance');
            if (kickDisp !== null) {
              const d = lastHonestDisp.get(relGid);
              if (d !== undefined) kickDisp.push(d);
            }
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
        // The seam only writes ball.pos, never ball.owner: offset-attributable
        // releases are 0 by construction, and the classification above is
        // exhaustive so unattributable stays 0. Both are asserted by the gate.
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

    // --- kick-origin displacement seam ticks (R-BOTH only) ---
    if (perTickDisp !== null && outfieldOwner && owner !== null) {
      const disp = Math.hypot(
        m.ball.pos.x - (owner.pos.x + owner.heading.x * CARRY),
        m.ball.pos.y - (owner.pos.y + owner.heading.y * CARRY),
      );
      perTickDisp.push(disp);
      lastHonestDisp.set(owner.gid, disp);
    }

    // --- turn-episode (≥90° sweep) tracker for the duel-economy outcome ---
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
  const perTickDisp: number[] = [];
  const kickDisp: number[] = [];
  const receipts: ReceiptBook = {};

  const r0: MatchRow[] = [];
  const rboth: MatchRow[] = [];
  for (const seed of seeds) {
    r0.push(runMatch(seed, false, null, null, null, null, null));
    rboth.push(runMatch(seed, true, release, exclusion, perTickDisp, kickDisp, receipts));
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
    // two-part: CI lower > 0 AND point ≥ +10% (point-relative form, doc §4.1).
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

  // ===== §4.3 (iii) PRICED CONSEQUENCES =====
  // PC-LOOSE: loose-ball count per match, paired.
  const looseCI = pairedCI(rboth.map((r) => r.looseCount), r0.map((r) => r.looseCount), offset++);
  const pcLoose = {
    ...looseCI, bandLo: PC_LOOSE_LO, bandHi: PC_LOOSE_HI,
    r0PerMatch: round(mean(r0.map((r) => r.looseCount))),
    deltaPerMatch: round(mean(rboth.map((r, i) => r.looseCount - r0[i].looseCount))),
    // reading (d) iff RESOLVED and outside the band (a CI straddling zero inside
    // the band is "priced as designed", #29.5 / ruling #52.2(ii)).
    exceeded: looseCI.resolved && (looseCI.relative > PC_LOOSE_HI || looseCI.relative < PC_LOOSE_LO),
  };
  // PC-KICK: kick-origin displacement REPORTED + completion/shot rates ±5%.
  const kickDispReport = {
    n: kickDisp.length,
    p50: round(quantile(kickDisp, 0.5), 5),
    p90: round(quantile(kickDisp, 0.9), 5),
    max: round(arrayMax(kickDisp), 5),
    perSeamTick: {
      n: perTickDisp.length,
      p50: round(quantile(perTickDisp, 0.5), 5),
      p90: round(quantile(perTickDisp, 0.9), 5),
      max: round(arrayMax(perTickDisp), 5),
    },
    t1rPerSeamP50: T1R_KICK_PER_SEAM_P50,
    t1rPerSeamP90: T1R_KICK_PER_SEAM_P90,
  };
  // completion / shot / on-target rates, per-match, paired ±5% relative.
  const passCompRate = (r: MatchRow) => {
    const p = r.sides[0].passes + r.sides[1].passes;
    return p === 0 ? Number.NaN : (r.sides[0].passesCompleted + r.sides[1].passesCompleted) / p;
  };
  const shotRate = (r: MatchRow) => r.sides[0].shots + r.sides[1].shots; // shots/match
  const onTargetRate = (r: MatchRow) => {
    const sh = r.sides[0].shots + r.sides[1].shots;
    return sh === 0 ? Number.NaN : (r.sides[0].shotsOnTarget + r.sides[1].shotsOnTarget) / sh;
  };
  const pcKickRate = (label: string, sel: (r: MatchRow) => number) => {
    const ci = pairedCI(rboth.map(sel), r0.map(sel), offset++);
    return {
      label, ...ci, tolerance: PC_KICK_TOL,
      exceeded: ci.resolved && Math.abs(ci.relative) > PC_KICK_TOL,
    };
  };
  const pcKick = {
    displacement: kickDispReport,
    passCompletion: pcKickRate('passCompletion', passCompRate),
    shotRate: pcKickRate('shotRate', shotRate),
    onTargetRate: pcKickRate('onTargetRate', onTargetRate),
  };
  const pcKickExceeded = pcKick.passCompletion.exceeded || pcKick.shotRate.exceeded
    || pcKick.onTargetRate.exceeded;

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

  // ===== §4.5 (v) ECOLOGY (REPORTED, never gated) =====
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

  // ===== §4.6 X-FAMILY / STRUCTURAL =====
  const r0Sigs = r0.map((r) => r.signature);

  const gates = {
    // watchability HARD limbs (all-quiet expected):
    scrambleQuiet: !scramble.fires,
    pileupQuiet: !pileup.fires,
    restDefQuiet: !restDefence.fires,
    offsideCanaryQuiet: !offsideCanary.fires,
    boxCanaryQuiet: !boxCanary.fires,
    restartCanaryQuiet: !restartCanary.fires,
    // §2 band (hard abort):
    equilibriumBandHolds: bandHolds,
    // priced consequences (reading (d) if exceeded):
    pcLooseInBand: !pcLoose.exceeded,
    pcKickInBand: !pcKickExceeded,
    // structural:
    zeroLooseStructural: release.offsetAttributable === 0 && release.unattributable === 0,
    // X-OFF-IDENT is finalised at the top level (needs the shipped pin); X-FP and
    // X-SEAM and X-DET too. Placeholders here are overwritten after the pin runs.
  };

  return {
    experiment: 'C6-T2 (the match-level A/B — deployment / watchability)',
    authority: 'C6-T2-MATCH-AB (ruling #51 authorized; #52 reviewed PASS; #52.3 build+run)',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      matchesPerArm: seeds.length, arms: ['R0', 'RBOTH'],
      seedFormula: '6,200,000 + blockIndex*100,000 + k, blockIndex 0..3, k 0..199',
      clusterUnit: 'match seed (paired across arms)',
      bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
      sampleEvery: SAMPLE_EVERY, sampleHz: round(1 / SAMPLE_DT, 3), pairSubsample: PAIR_SUBSAMPLE,
      capMatches: Number.isFinite(CAP_MATCHES) ? CAP_MATCHES : null,
    },
    watchabilityHardLimbs: {
      scramble: { instrument: 'I4 own-within-5m', p0Baseline: P0_I4_OWN5, ...scramble },
      pileup: { instrument: 'I3 share <4m', p0Baseline: P0_I3_UNDER4, ...pileup },
      restDefence: { instrument: 'I5(b) designated slot', p0Baseline: P0_I5_SLOT, ...restDefence },
      offsideCanary, boxCanary, restartCanary,
      arrivalClassMix: { r0: arrivalMix(r0), rboth: arrivalMix(rboth) },
    },
    equilibriumBand: { ...band, holds: bandHolds },
    pricedConsequences: { pcLoose, pcKick },
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

// --- X-SEAM: c6Carry is null/off on a fresh Match, and de-glue path ungated ---
const freshMatch = shippedMatchOf(SEED_START);
const xSeam = (freshMatch as unknown as { c6Carry: boolean }).c6Carry === false;

// --- X-FP: league fingerprint identical to the frozen baseline ---------------
const fpLeague = new League({ seed: FINGERPRINT_SEED });
const fpOut = runHeadless(fpLeague.toJSON() as Record<string, unknown>, {
  kind: 'toGeneration', target: fpLeague.generation + FINGERPRINT_SEASONS,
});
const fingerprint = createHash('sha256').update(JSON.stringify(fpOut.league)).digest('hex');
const xFp = fingerprint === FINGERPRINT_BASELINE;

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
  pricedConsequences: body.pricedConsequences,
  duelEconomy: body.duelEconomy,
  ecology: body.ecology,
  structural: body.structural,
})).digest('hex');
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');

const output = {
  ...body,
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
console.error(
  `C6-T2 ${output.verdict}`
  + ` · ${output.parameters.matchesPerArm} matches/arm × 2 arms`
  + ` · scramble ${hl.scramble.fires} pileup ${hl.pileup.fires} restDef ${hl.restDefence.fires}`
  + ` · offside ${hl.offsideCanary.fires} box ${hl.boxCanary.fires} restart ${hl.restartCanary.fires}`
  + ` · band ${output.equilibriumBand.holds}`
  + ` · pcLoose rel ${output.pricedConsequences.pcLoose.relative} exceeded ${output.pricedConsequences.pcLoose.exceeded}`
  + ` · pcKick exceeded ${output.pricedConsequences.pcKick.passCompletion.exceeded || output.pricedConsequences.pcKick.shotRate.exceeded || output.pricedConsequences.pcKick.onTargetRate.exceeded}`
  + ` · zeroLoose off=${output.structural.release.offsetAttributable}/unattr=${output.structural.release.unattributable}`
  + ` · xFp ${xFp} xSeam ${xSeam} xOffIdent ${gates.xOffIdent} (${offIdentMismatch} mism) xDet ${deterministic}`
  + ` · tableSHA ${tableSha.slice(0, 12)} · SHA ${sha256.slice(0, 12)}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
