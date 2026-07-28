// C7 T1 — pendingKick: the shot wind-up (fork-and-force paired same-seed at
// seat-shot commits).
//
// Authority: docs/world-model/C7-T1-PENDINGKICK.md (FROZEN pre-registration) +
// commander rulings #56/#57 (build + run authorized). This is the AUTHORIZED run
// of the frozen instrument.
//
// Method (§STAGING): step UNMODIFIED OFF base matches; at each open-play/one-touch
// shot commit (the v1 SEAT: routes through performShot, not free-kick/header), the
// pre-commit world is cloned and run TWICE from the same seed —
//   OFF: today's synchronous strike at the commit tick (the paired baseline;
//        θ_commit / price reference for axis 2), and
//   ON : c7Windup armed — the body defers, turns toward goal for W ticks, then the
//        strike resolves at readyTick via the SAME performShot math.
// Nothing ships: the only armed world is a clone; c7Windup stays OFF in production.
//
// It measures, to the frozen spec:
//   axis 1  interruption rate on forked seat-shot commits (INT-* / forks) — UP
//           from ~0 (the synchronous release has no committed-but-unstruck tick);
//   axis 2  the realised orientation-price delta at strike vs commit, paired per
//           UNINTERRUPTED shot — NOISE reduction (primary) + POWER gain — the
//           heading integrator's work over the window (θ_strike < θ_commit);
//   the FIDELITY ledger — per ON window tick: readyTick == commit + W_ticks,
//           faceTarget == aim, |Δheading| <= TURN_RATE*DT, ball at the owned carry
//           offset — to 1e-9; event-keyed classes incl. E-INJURY; unexplained 0;
//   the OWNERSHIP-RELEASE ledger (#56.3(iv)) — every release on ON forks classes
//           to a named channel; seam-attributable releases MUST be 0;
//   X-STRUCT-2 — armPendingKick draws ZERO rng; the deferred performShot runs
//           EXACTLY once per struck fork; the ON struck-shot rng draw-count vs the
//           OFF synchronous strike (rng-stream parity), REPORTED;
//   the shot-outcome economy (goals / on-target), paired OFF vs ON — REPORTED.
//
// Output: docs/world-model/data/c7-t1-pendingkick.json

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { kickMisalignment, orientationNoiseMul, orientationPowerMul } from '../../src/sim/mechanics';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

// --- staging (doc §STAGING) --------------------------------------------------
const SEED_START = 7_300_000; // above every consumed range (incl. all of C7 T0 + the T1 sizing smoke 7.2M)
const BLOCK_STRIDE = 100_000;
const BLOCKS = 6; // b in 0..5
const MATCHES_PER_BLOCK = 100; // k in 0..99 -> 600 matches, 7.3M-7.8M
const BOOTSTRAP_SEED = 73_037; // frozen
const BOOTSTRAP_RESAMPLES = 2000;
const POST_HORIZON_TICKS = Math.round(2.0 / DT); // 120 ticks = 2.0 s (economy horizon, #48.4)
const CARRY = 0.85; // the outfield glue offset (c6Carry OFF here — C7 prices TIME, not carry)
const INJURY_REPOSITION_M = 3.0; // E-INJURY becomeSub-reposition signature (#49.3, the C6 threshold)
const RECEIPT_CAP = 1000; // per-class per-record receipts cap (#49.3)

// --- ENGINEERING smoke cap (does NOT touch the frozen staging for the real run) --
// C7_T1_CAP_MATCHES caps total matches for a crash/NaN smoke; when set, output is
// routed to C7_T1_OUT (a scratch path) so the canonical JSON is never overwritten.
const CAP_MATCHES = process.env.C7_T1_CAP_MATCHES
  ? Math.max(1, Number.parseInt(process.env.C7_T1_CAP_MATCHES, 10))
  : Number.POSITIVE_INFINITY;
const OUT_PATH = process.env.C7_T1_OUT ?? 'docs/world-model/data/c7-t1-pendingkick.json';

// --- floors (doc §STAGING; #24) ----------------------------------------------
const F_SHOT_SEAT = 2_400;
const F_INTERRUPTED = 150;
const F_UNINTERRUPTED = 2_000;
const F_TWISTED_UNINT = 400;

// --- interpretation bands (½×–1.5× recompute-to-live transfer, #48) -----------
const AXIS1_BAND: [number, number] = [0.061, 0.182]; // interruption rate
const AXIS2_NOISE_BAND_PP: [number, number] = [2.19, 6.56]; // noise reduction (pp)
const AXIS2_POWER_BAND_PP: [number, number] = [0.62, 1.85]; // power gain (pp)

// --- the FROZEN §LAW, replicated VERBATIM from Match.ts for the fidelity recompute ---
const C7_W_BASE = 0.06;
const C7_W_MOVE = 0.05;
const C7_W_TURN = 0.05;
const C7_W_TECH = 0.05;
const C7_W_FLOOR = 0.05;
const C7_W_CAP = 0.18;
const C7_V_REF = 7.0;
const C7_T_BAR = 0.4068;
const c7WindupTicks = (v: number, omega: number, tech: number): number => {
  const raw =
    C7_W_BASE + C7_W_MOVE * (v / C7_V_REF) + C7_W_TURN * (omega / TURN_RATE) - C7_W_TECH * (tech - C7_T_BAR);
  const clamped = raw < C7_W_FLOOR ? C7_W_FLOOR : raw > C7_W_CAP ? C7_W_CAP : raw;
  const ticks = Math.round(clamped * 60);
  return ticks < 3 ? 3 : ticks > 11 ? 11 : ticks;
};

// the engine's |ω| at commit: from the two most-recent recorded headings on the
// PUBLIC c6HeadingHist ring (mirrors Match.armPendingKick exactly).
type Ring = Map<number, { tick: number; hx: number; hy: number }[]>;
const headingAt = (hist: Ring, gid: number, tick: number): { hx: number; hy: number } | null => {
  const ring = hist.get(gid);
  if (ring === undefined) return null;
  for (let i = ring.length - 1; i >= 0; i--) if (ring[i].tick === tick) return ring[i];
  return null;
};
const omegaAtCommit = (hist: Ring, gid: number, commitStep: number): number => {
  const h1 = headingAt(hist, gid, commitStep - 1);
  const h0 = headingAt(hist, gid, commitStep - 2);
  if (h1 === null || h0 === null) return 0;
  let d = Math.atan2(h1.hy, h1.hx) - Math.atan2(h0.hy, h0.hx);
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return Math.abs(d) / DT;
};

// --- team fixture (matches T0 / the house pattern) ---------------------------
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, c7Windup: boolean): Match => {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  (m as unknown as { c7Windup: boolean }).c7Windup = c7Windup;
  return m;
};

const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const quantile = (values: readonly number[], p: number): number => {
  if (values.length === 0) return Number.NaN;
  const s = [...values].sort((a, b) => a - b);
  const i = (s.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
};
const mean = (a: readonly number[]): number => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);

// aim unit vector shooter -> its opponent-goal centre (the faceTarget aim).
const aimUnit = (shooter: Player, goal: { x: number; y: number }): { x: number; y: number } => {
  const dx = goal.x - shooter.pos.x;
  const dy = goal.y - shooter.pos.y;
  const l = Math.hypot(dx, dy) || 1;
  return { x: dx / l, y: dy / l };
};
const thetaDeg = (shooter: Player, aim: { x: number; y: number }): number => {
  const d = shooter.heading.x * aim.x + shooter.heading.y * aim.y;
  return (Math.acos(Math.max(-1, Math.min(1, d))) * 180) / Math.PI;
};

// wrap a match's rng.next to COUNT every draw (every method routes through next).
const countRng = (m: Match): { n: () => number } => {
  const rng = m.rng as unknown as { next: () => number };
  const orig = rng.next.bind(rng);
  let n = 0;
  rng.next = () => { n += 1; return orig(); };
  return { n: () => n };
};

// --- per-record receipts (#49.3) ---------------------------------------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string): void => {
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// --- resolution classes (doc §FIDELITY) --------------------------------------
type Cls = 'STRUCK' | 'INT-TACKLE' | 'INT-STUN' | 'INT-SENTOFF' | 'INT-PHASE' | 'E-INJURY' | 'E-ENDED';

// --- per-match aggregate (cluster unit = match seed) -------------------------
interface MatchAgg {
  seed: number;
  forks: number; // seat-shot forks that did NOT end in-window (the axis denominators)
  struck: number;
  interrupted: number; // INT-* (the axis-1 numerator)
  noiseReds: number[]; // per struck: orientationNoiseMul(commit) - (strike)   [reduction]
  powerGains: number[]; // per struck: orientationPowerMul(strike) - (commit)  [gain]
  thetaCommit: number[]; // per struck: θ_commit (deg)
}

// --- census accumulator ------------------------------------------------------
interface Census {
  totalBaseSteps: number;
  seatCommits: number; // F-SHOT-SEAT (forked seat-shot commits, incl. ended-in-window)
  endedInWindow: number; // #48.4 excluded, REPORTED (E-ENDED inside the window)
  intByClass: Record<string, number>;
  fidelity: { windowTicks: number; ok: number; unexplained: number; wTickMismatch: number };
  release: { releases: number; strike: number; tackle: number; stunDrop: number; sentOff: number; phase: number; seamAttributable: number };
  struct2: { armRngTotal: number; performCallsTotal: number; struckTotal: number; rngParityMatch: number; rngParityMismatch: number };
  twisted: { struck: number; noiseReds: number[]; powerGains: number[] };
  aligned: { struck: number; noiseReds: number[]; powerGains: number[] };
  econ: {
    offGoals: number; onGoals: number; offOnTarget: number; onOnTarget: number;
    offResolved: number; onResolved: number; offUnresolved: number; onUnresolved: number;
    pairs: number;
  };
  wTicks: number[]; // observed W distribution
  shooterMismatch: number; // pass-2 clone owner gid != pass-1 shooter gid (skipped)
  armFailed: number; // ON fork did not arm at commit (anomaly)
  matches: MatchAgg[];
  receipts: ReceiptBook;
}
const newCensus = (): Census => ({
  totalBaseSteps: 0, seatCommits: 0, endedInWindow: 0,
  intByClass: {}, fidelity: { windowTicks: 0, ok: 0, unexplained: 0, wTickMismatch: 0 },
  release: { releases: 0, strike: 0, tackle: 0, stunDrop: 0, sentOff: 0, phase: 0, seamAttributable: 0 },
  struct2: { armRngTotal: 0, performCallsTotal: 0, struckTotal: 0, rngParityMatch: 0, rngParityMismatch: 0 },
  twisted: { struck: 0, noiseReds: [], powerGains: [] },
  aligned: { struck: 0, noiseReds: [], powerGains: [] },
  econ: { offGoals: 0, onGoals: 0, offOnTarget: 0, onOnTarget: 0, offResolved: 0, onResolved: 0, offUnresolved: 0, onUnresolved: 0, pairs: 0 },
  wTicks: [], shooterMismatch: 0, armFailed: 0, matches: [], receipts: {},
});

const outfieldCommit = (m: Match): boolean => {
  const o = m.ball.owner;
  return o !== null && m.phase === 'playing' && !o.sentOff && o.role !== 'GK' && m.restartKickGid !== o.gid;
};

// run the OFF synchronous strike from the clone; return its economy (paired).
const runOffArm = (clone: Match, shooterGid: number): { struck: boolean; goal: boolean; onTarget: boolean; resolved: boolean; strikeRng: number } => {
  const off = cloneSimulationState(clone);
  (off as unknown as { c7Windup: boolean }).c7Windup = false;
  const rng = countRng(off);
  let strikeRng = 0;
  const origPerform = off.performShot.bind(off);
  (off as unknown as { performShot: (p: Player) => void }).performShot = (p: Player) => {
    const c0 = rng.n(); origPerform(p); strikeRng = rng.n() - c0;
  };
  const before = off.shotLog.length;
  off.step(DT); // commit tick: synchronous strike
  const struck = off.shotLog.length > before;
  const logIndex = struck ? off.shotLog.length - 1 : -1;
  const target = off.simTick + POST_HORIZON_TICKS;
  while (!off.finished && off.simTick < target) off.step(DT);
  const outcome = struck ? off.shotLog[logIndex].outcome : 'miss';
  const resolved = outcome !== 'pending';
  return { struck, goal: outcome === 'goal', onTarget: outcome === 'goal' || outcome === 'saved', resolved, strikeRng };
};

// process one seat-shot fork from the pre-commit clone (at stepCount S).
const processFork = (clone: Match, seed: number, shooterGid: number, c: Census, agg: MatchAgg): void => {
  c.seatCommits += 1;
  const goalClone = clone.teams[clone.ball.owner!.side].oppGoal();

  // OFF arm (paired baseline + θ_commit reference).
  const offShooter = clone.ball.owner!;
  if (offShooter.gid !== shooterGid) { c.shooterMismatch += 1; return; }
  const aimC = aimUnit(offShooter, goalClone);
  const mCommit = kickMisalignment(offShooter, aimC);
  const thetaCommitDeg = thetaDeg(offShooter, aimC);
  const drb = offShooter.attrs.dribbling;

  // W_ticks recompute (fidelity): the engine's own inputs at commit.
  const vCommit = Math.hypot(offShooter.vel.x, offShooter.vel.y);
  const omega = omegaAtCommit((clone as unknown as { c6HeadingHist: Ring }).c6HeadingHist, shooterGid, clone.simTick + 1);
  const wTicks = c7WindupTicks(vCommit, omega, drb);
  const commitStep = clone.simTick + 1;
  const expectedReadyTick = commitStep + wTicks;

  const off = runOffArm(clone, shooterGid);

  // ON arm.
  const on = cloneSimulationState(clone);
  (on as unknown as { c7Windup: boolean }).c7Windup = true;
  const rng = countRng(on);
  let armRng = 0;
  const origArm = on.armPendingKick.bind(on);
  (on as unknown as { armPendingKick: (p: Player, aim: { x: number; y: number }) => void }).armPendingKick = (p, aim) => {
    const c0 = rng.n(); origArm(p, aim); armRng += rng.n() - c0;
  };
  let performCalls = 0;
  let strikeRng = 0;
  const origPerform = on.performShot.bind(on);
  (on as unknown as { performShot: (p: Player) => void }).performShot = (p: Player) => {
    performCalls += 1; const c0 = rng.n(); origPerform(p); strikeRng = rng.n() - c0;
  };

  // step 1: the commit tick (S+1) — the wind-up arms.
  on.step(DT);
  if (on.pendingKick === null || on.pendingKick.gid !== shooterGid) {
    // ON did not arm the wind-up at the seat-shot commit — an anomaly (should be
    // impossible: same seed+state ⇒ same decision, routed through the seam).
    c.armFailed += 1;
    c.struct2.armRngTotal += armRng;
    return;
  }
  c.wTicks.push(wTicks);
  if (on.pendingKick.readyTick !== expectedReadyTick) c.fidelity.wTickMismatch += 1;
  const readyTick = on.pendingKick.readyTick;
  const aimPoint = on.pendingKick.aim;

  // classify through the window [commitStep, readyTick]; fidelity per window tick.
  let cls: Cls | null = null;
  let thetaStrikeDeg = Number.NaN;
  let mStrike = Number.NaN;
  let logIndex = -1;
  let prevHeading: { x: number; y: number } | null = null;
  let ownerReleased = false;

  // release-ledger bookkeeping
  let prevOwnerGid: number | null = on.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = on.ball.owner?.side ?? null;

  // window fidelity for the FIRST post-commit tick already taken? The commit tick
  // (S+1) is the arming tick; the window's turning ticks are (commit, readyTick).
  const inspectWindowTick = (): void => {
    const sh = on.allPlayers[shooterGid];
    if (on.phase !== 'playing' || on.ball.owner !== sh || on.pendingKick === null) return;
    c.fidelity.windowTicks += 1;
    let ok = true;
    // faceTarget == aim
    if (sh.faceTarget === null || Math.abs(sh.faceTarget.x - aimPoint.x) > 1e-9 || Math.abs(sh.faceTarget.y - aimPoint.y) > 1e-9) ok = false;
    // heading rotation <= TURN_RATE*DT
    if (prevHeading !== null) {
      let d = Math.atan2(sh.heading.y, sh.heading.x) - Math.atan2(prevHeading.y, prevHeading.x);
      while (d > Math.PI) d -= 2 * Math.PI;
      while (d < -Math.PI) d += 2 * Math.PI;
      if (Math.abs(d) > TURN_RATE * DT + 1e-9) ok = false;
    }
    // ball at owned carry offset (c6Carry OFF ⇒ rigid heading·0.85)
    const ex = sh.pos.x + sh.heading.x * CARRY;
    const ey = sh.pos.y + sh.heading.y * CARRY;
    if (Math.abs(on.ball.pos.x - ex) > 1e-9 || Math.abs(on.ball.pos.y - ey) > 1e-9) ok = false;
    if (ok) c.fidelity.ok += 1;
    else {
      c.fidelity.unexplained += 1;
      addReceipt(c.receipts, 'UNEXPLAINED', seed, on.simTick, shooterGid, 'window-state-mismatch');
    }
    prevHeading = { x: sh.heading.x, y: sh.heading.y };
  };

  // the arming tick (S+1) is itself a window tick: inspect it now.
  inspectWindowTick();

  while (cls === null) {
    const sh = on.allPlayers[shooterGid];
    const preDrb = sh.attrs.dribbling;
    const prePosX = sh.pos.x;
    const prePosY = sh.pos.y;
    // capture θ_strike right BEFORE the resolving step (heading performShot reads).
    if (on.pendingKick !== null && on.simTick + 1 === readyTick && on.ball.owner === sh) {
      const aimS = aimUnit(sh, on.teams[sh.side].oppGoal());
      mStrike = kickMisalignment(sh, aimS);
      thetaStrikeDeg = thetaDeg(sh, aimS);
    }
    const shotsBefore = on.shotLog.length;
    on.step(DT);
    const t = on.simTick;

    // --- ownership-release ledger (every release on the ON fork) ---
    const newOwner = on.ball.owner;
    const released = prevOwnerGid !== null && (newOwner === null || newOwner.gid !== prevOwnerGid);
    if (released) {
      const relGid = prevOwnerGid as number;
      c.release.releases += 1;
      const struckThisTick = on.shotLog.length > shotsBefore && on.pendingKick === null && relGid === shooterGid;
      if (struckThisTick) c.release.strike += 1;
      else if (newOwner !== null && prevOwnerSide !== null && newOwner.side !== prevOwnerSide) c.release.tackle += 1;
      else if (on.allPlayers[relGid].stunTimer > 0 || on.allPlayers[relGid].sentOff) c.release.stunDrop += 1;
      else if (on.phase !== 'playing') c.release.phase += 1;
      else if (newOwner === null || newOwner.gid !== relGid) {
        // a loose ball / teammate settle through an existing channel (tackle knock
        // or a kick). Not seam-attributable (the seam writes ball.owner nowhere).
        c.release.tackle += 1;
      }
    }
    prevOwnerGid = newOwner?.gid ?? null;
    prevOwnerSide = newOwner?.side ?? null;

    // --- classification (first terminal event wins) ---
    if (on.finished) { cls = 'E-ENDED'; break; }
    const sh2 = on.allPlayers[shooterGid];
    if (on.phase !== 'playing') { cls = 'INT-PHASE'; break; }
    // E-INJURY: same-gid attrs mutation or a becomeSub reposition (#49.3)
    const posJump = Math.hypot(sh2.pos.x - prePosX, sh2.pos.y - prePosY);
    if (sh2.attrs.dribbling !== preDrb || posJump > INJURY_REPOSITION_M) { cls = 'E-INJURY'; break; }
    if (sh2.sentOff) { cls = 'INT-SENTOFF'; break; }
    // resolution tick: pendingKick consumed
    if (on.pendingKick === null) {
      if (on.shotLog.length > shotsBefore) { cls = 'STRUCK'; logIndex = on.shotLog.length - 1; }
      else if (on.ball.owner !== sh2) cls = 'INT-TACKLE';
      else if (sh2.stunTimer > 0) cls = 'INT-STUN';
      else cls = 'INT-PHASE'; // voided by a guard with no other signature
      break;
    }
    // still in window: interruptions that leave pendingKick lingering
    if (on.ball.owner !== sh2) { cls = 'INT-TACKLE'; ownerReleased = true; break; }
    if (sh2.stunTimer > 0) { cls = 'INT-STUN'; break; }
    // still winding up: inspect this window tick's fidelity.
    inspectWindowTick();
    if (t > readyTick + 2) { cls = 'INT-PHASE'; break; } // safety net (never reached)
  }
  void ownerReleased;

  c.struct2.armRngTotal += armRng;

  // --- account the resolution ---
  if (cls === 'E-ENDED') {
    c.endedInWindow += 1;
    addReceipt(c.receipts, 'E-ENDED', seed, on.simTick, shooterGid, 'match-ended-in-window');
    return; // #48.4 excluded from the axes (REPORTED)
  }
  agg.forks += 1;
  if (cls === 'STRUCK') {
    agg.struck += 1;
    c.struct2.struckTotal += 1;
    c.struct2.performCallsTotal += performCalls;
    // rng-stream parity vs the OFF synchronous strike (REPORTED)
    if (off.struck) {
      if (strikeRng === off.strikeRng) c.struct2.rngParityMatch += 1;
      else c.struct2.rngParityMismatch += 1;
    }
    const noiseRed = orientationNoiseMul(mCommit, drb) - orientationNoiseMul(mStrike, drb);
    const powerGain = orientationPowerMul(mStrike, drb) - orientationPowerMul(mCommit, drb);
    agg.noiseReds.push(noiseRed);
    agg.powerGains.push(powerGain);
    agg.thetaCommit.push(thetaCommitDeg);
    if (thetaCommitDeg >= 30) { c.twisted.struck += 1; c.twisted.noiseReds.push(noiseRed); c.twisted.powerGains.push(powerGain); }
    else { c.aligned.struck += 1; c.aligned.noiseReds.push(noiseRed); c.aligned.powerGains.push(powerGain); }
    void thetaStrikeDeg;
    // economy (paired): read the ON shot outcome over the horizon.
    const target = on.simTick + POST_HORIZON_TICKS;
    while (!on.finished && on.simTick < target) on.step(DT);
    const outcome = logIndex >= 0 ? on.shotLog[logIndex].outcome : 'miss';
    const onResolved = outcome !== 'pending';
    if (off.struck) {
      c.econ.pairs += 1;
      if (off.resolved) { c.econ.offResolved += 1; if (off.goal) c.econ.offGoals += 1; if (off.onTarget) c.econ.offOnTarget += 1; } else c.econ.offUnresolved += 1;
      if (onResolved) { c.econ.onResolved += 1; if (outcome === 'goal') c.econ.onGoals += 1; if (outcome === 'goal' || outcome === 'saved') c.econ.onOnTarget += 1; } else c.econ.onUnresolved += 1;
    }
  } else {
    agg.interrupted += 1;
    c.intByClass[cls] = (c.intByClass[cls] ?? 0) + 1;
    addReceipt(c.receipts, cls, seed, on.simTick, shooterGid, cls);
  }
};

// run ONE base match: pass 1 records seat-shot commit pre-steps; pass 2 re-runs
// and forks at each (deterministic — same seed ⇒ identical base).
const runMatch = (seed: number, c: Census): void => {
  // pass 1
  const base1 = matchOf(seed, false);
  const commits: { preStep: number; gid: number }[] = [];
  while (!base1.finished) {
    const commit = outfieldCommit(base1) ? base1.ball.owner!.gid : -1;
    const preStep = base1.simTick;
    const before = base1.shotLog.length;
    base1.step(DT);
    c.totalBaseSteps += 1;
    if (base1.shotLog.length > before && commit >= 0) commits.push({ preStep, gid: commit });
  }
  if (commits.length === 0) return;

  const agg: MatchAgg = { seed, forks: 0, struck: 0, interrupted: 0, noiseReds: [], powerGains: [], thetaCommit: [] };
  // pass 2
  const base2 = matchOf(seed, false);
  let ci = 0;
  while (!base2.finished && ci < commits.length) {
    while (ci < commits.length && commits[ci].preStep < base2.simTick) ci += 1; // skip any missed (never)
    if (ci < commits.length && base2.simTick === commits[ci].preStep) {
      const clone = cloneSimulationState(base2);
      processFork(clone, seed, commits[ci].gid, c, agg);
      ci += 1;
      while (ci < commits.length && commits[ci].preStep === commits[ci - 1].preStep) ci += 1; // dedupe same-tick
    }
    base2.step(DT);
  }
  if (agg.forks > 0 || agg.struck > 0 || agg.interrupted > 0) c.matches.push(agg);
};

// --- cluster bootstrap over match seeds (#20) --------------------------------
interface AxisCI { point: number; lower: number; upper: number }
const bootstrap = (
  matches: readonly MatchAgg[], seedOffset: number,
): { axis1: AxisCI; axis2noise: AxisCI; axis2power: AxisCI } => {
  const rng = new Rng(BOOTSTRAP_SEED + seedOffset);
  const n = matches.length;
  const d1: number[] = [], d2n: number[] = [], d2p: number[] = [];
  const sumForks = matches.reduce((s, m) => s + m.forks, 0);
  const sumInt = matches.reduce((s, m) => s + m.interrupted, 0);
  const allNoise = matches.flatMap((m) => m.noiseReds);
  const allPower = matches.flatMap((m) => m.powerGains);
  const point1 = sumForks === 0 ? Number.NaN : sumInt / sumForks;
  const point2n = mean(allNoise) * 100;
  const point2p = mean(allPower) * 100;
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let bForks = 0, bInt = 0;
    let nSum = 0, nCnt = 0, pSum = 0, pCnt = 0;
    for (let i = 0; i < n; i++) {
      const m = matches[rng.int(0, n - 1)];
      bForks += m.forks; bInt += m.interrupted;
      for (const x of m.noiseReds) { nSum += x; nCnt += 1; }
      for (const x of m.powerGains) { pSum += x; pCnt += 1; }
    }
    if (bForks > 0) d1.push(bInt / bForks);
    if (nCnt > 0) d2n.push((nSum / nCnt) * 100);
    if (pCnt > 0) d2p.push((pSum / pCnt) * 100);
  }
  const at = (arr: number[], q: number) => { arr.sort((a, b) => a - b); return arr.length === 0 ? Number.NaN : arr[Math.min(arr.length - 1, Math.max(0, Math.floor(q * (arr.length - 1))))]; };
  return {
    axis1: { point: round(point1), lower: round(at(d1, 0.025)), upper: round(at(d1, 0.975)) },
    axis2noise: { point: round(point2n, 4), lower: round(at(d2n, 0.025), 4), upper: round(at(d2n, 0.975), 4) },
    axis2power: { point: round(point2p, 4), lower: round(at(d2p, 0.025), 4), upper: round(at(d2p, 0.975), 4) },
  };
};

const runExperiment = () => {
  const c = newCensus();
  let ran = 0;
  outer: for (let b = 0; b < BLOCKS; b++) {
    const seedStart = SEED_START + b * BLOCK_STRIDE;
    for (let k = 0; k < MATCHES_PER_BLOCK; k++) {
      if (ran >= CAP_MATCHES) break outer;
      runMatch(seedStart + k, c);
      ran += 1;
    }
  }

  const { axis1, axis2noise, axis2power } = bootstrap(c.matches, 0);

  const totalForks = c.matches.reduce((s, m) => s + m.forks, 0);
  const totalStruck = c.matches.reduce((s, m) => s + m.struck, 0);
  const totalInterrupted = c.matches.reduce((s, m) => s + m.interrupted, 0);
  const twistedUnint = c.twisted.struck;

  const floors = {
    fShotSeat: { population: c.seatCommits, floor: F_SHOT_SEAT, pass: c.seatCommits >= F_SHOT_SEAT },
    fInterrupted: { population: totalInterrupted, floor: F_INTERRUPTED, pass: totalInterrupted >= F_INTERRUPTED },
    fUninterrupted: { population: totalStruck, floor: F_UNINTERRUPTED, pass: totalStruck >= F_UNINTERRUPTED },
    fTwistedUnint: { population: twistedUnint, floor: F_TWISTED_UNINT, pass: twistedUnint >= F_TWISTED_UNINT },
  };

  // src diff gate
  let srcDiff: string, srcClean: boolean;
  try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); srcClean = srcDiff === ''; }
  catch { srcDiff = 'git-unavailable'; srcClean = false; }

  const axis1Up = Number.isFinite(axis1.lower) && axis1.lower > 0;
  const axis2NoiseDown = Number.isFinite(axis2noise.lower) && axis2noise.lower > 0; // reduction CI excludes 0
  const axis2PowerUp = Number.isFinite(axis2power.lower) && axis2power.lower > 0; // gain CI excludes 0

  const gates = {
    xSrc: srcClean,
    fidelityUnexplained: c.fidelity.unexplained === 0,
    wTickFidelity: c.fidelity.wTickMismatch === 0,
    struct1SeamNoRelease: c.release.seamAttributable === 0,
    struct2ArmNoRng: c.struct2.armRngTotal === 0,
    struct2PerformOncePerStruck: c.struct2.performCallsTotal === c.struct2.struckTotal,
    noArmFailures: c.armFailed === 0,
    noShooterMismatch: c.shooterMismatch === 0,
    fShotSeat: floors.fShotSeat.pass,
    fInterrupted: floors.fInterrupted.pass,
    fUninterrupted: floors.fUninterrupted.pass,
    fTwistedUnint: floors.fTwistedUnint.pass,
    axis1Up,
    axis2NoiseDown,
    axis2PowerUp,
  };

  const econ = c.econ;
  const shareOff = econ.pairs === 0 ? 0 : econ.offGoals / econ.pairs;
  const shareOn = econ.pairs === 0 ? 0 : econ.onGoals / econ.pairs;

  return {
    experiment: 'C7-T1 (pendingKick — the shot wind-up)',
    authority: 'C7-T1-PENDINGKICK.md (frozen pre-registration; rulings #56/#57 build+run authorized)',
    head: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      matches: Math.min(BLOCKS * MATCHES_PER_BLOCK, CAP_MATCHES === Number.POSITIVE_INFINITY ? BLOCKS * MATCHES_PER_BLOCK : CAP_MATCHES),
      seedFormula: '7,300,000 + b*100,000 + k, b in 0..5, k in 0..99',
      clusterUnit: 'match seed (disjoint per block)',
      bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
      window: '[commitTick, readyTick] priced; + readyTick+2.0s economy horizon (#48.4)',
      postHorizonTicks: POST_HORIZON_TICKS,
      wLaw: { W_BASE: C7_W_BASE, W_MOVE: C7_W_MOVE, W_TURN: C7_W_TURN, W_TECH: C7_W_TECH, W_FLOOR: C7_W_FLOOR, W_CAP: C7_W_CAP, V_REF: C7_V_REF, T_BAR: C7_T_BAR },
    },
    coverage: {
      totalBaseSteps: c.totalBaseSteps,
      seatCommitsForked: c.seatCommits,
      endedInWindow: c.endedInWindow,
      forks: totalForks, struck: totalStruck, interrupted: totalInterrupted,
      matchesWithForks: c.matches.length,
      shooterMismatch: c.shooterMismatch, armFailed: c.armFailed,
      wTicks: { p10: round(quantile(c.wTicks, 0.1), 2), p50: round(quantile(c.wTicks, 0.5), 2), p90: round(quantile(c.wTicks, 0.9), 2), mean: round(mean(c.wTicks), 4), meanSec: round(mean(c.wTicks) * DT, 5) },
      srcDiff,
    },
    floors,
    axes: {
      axis1_interruptionRate: {
        point: axis1.point, ci: [axis1.lower, axis1.upper], resolvedUp: axis1Up,
        band: AXIS1_BAND, insideBand: axis1.point >= AXIS1_BAND[0] && axis1.point <= AXIS1_BAND[1],
        composition: c.intByClass,
      },
      axis2_noiseReductionPP: {
        point: axis2noise.point, ci: [axis2noise.lower, axis2noise.upper], resolvedReducing: axis2NoiseDown,
        band: AXIS2_NOISE_BAND_PP, insideBand: axis2noise.point >= AXIS2_NOISE_BAND_PP[0] && axis2noise.point <= AXIS2_NOISE_BAND_PP[1],
        primary: true,
      },
      axis2_powerGainPP: {
        point: axis2power.point, ci: [axis2power.lower, axis2power.upper], resolvedRising: axis2PowerUp,
        band: AXIS2_POWER_BAND_PP, insideBand: axis2power.point >= AXIS2_POWER_BAND_PP[0] && axis2power.point <= AXIS2_POWER_BAND_PP[1],
      },
      twistedVsAligned: {
        twisted: { n: c.twisted.struck, noisePP: round(mean(c.twisted.noiseReds) * 100, 4), powerPP: round(mean(c.twisted.powerGains) * 100, 4) },
        aligned: { n: c.aligned.struck, noisePP: round(mean(c.aligned.noiseReds) * 100, 4), powerPP: round(mean(c.aligned.powerGains) * 100, 4) },
      },
    },
    economy: {
      pairs: econ.pairs,
      off: { goals: econ.offGoals, onTarget: econ.offOnTarget, resolved: econ.offResolved, unresolved: econ.offUnresolved, goalShare: round(shareOff) },
      on: { goals: econ.onGoals, onTarget: econ.onOnTarget, resolved: econ.onResolved, unresolved: econ.onUnresolved, goalShare: round(shareOn) },
      goalShareDelta: round(shareOn - shareOff),
    },
    fidelity: c.fidelity,
    release: c.release,
    struct2: c.struct2,
    receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(c.receipts).map(([k, v]) => [k, v.length])), records: c.receipts },
    gates,
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const canonical = (v: unknown): string => JSON.stringify(v);
const first = runExperiment();
const second = runExperiment();
const deterministic = canonical(first) === canonical(second);
const tableSha = createHash('sha256').update(canonical({
  floors: first.floors, axes: first.axes, economy: first.economy,
  fidelity: first.fidelity, release: first.release, struct2: first.struct2,
})).digest('hex');
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');

const gates = { ...first.gates, xDet: deterministic };
const output = { ...first, gates, tableSha, sha256, verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL' };
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => (Number.isFinite(v) ? `${(100 * v).toFixed(2)}%` : 'n/a');
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `C7-T1 ${output.verdict}`
  + ` · baseSteps ${first.coverage.totalBaseSteps} · seatForks ${first.coverage.seatCommitsForked} (endedInWin ${first.coverage.endedInWindow})`
  + ` · struck ${first.coverage.struck} · interrupted ${first.coverage.interrupted}`
  + ` · Wp50 ${first.coverage.wTicks.p50}t (${first.coverage.wTicks.meanSec}s)`
  + ` · F-SEAT ${first.floors.fShotSeat.population}/${F_SHOT_SEAT} ${first.floors.fShotSeat.pass}`
  + ` · F-INT ${first.floors.fInterrupted.population}/${F_INTERRUPTED} ${first.floors.fInterrupted.pass}`
  + ` · axis1 ${pct(first.axes.axis1_interruptionRate.point)} CI[${pct(first.axes.axis1_interruptionRate.ci[0])},${pct(first.axes.axis1_interruptionRate.ci[1])}] up=${first.axes.axis1_interruptionRate.resolvedUp}`
  + ` · axis2noise ${first.axes.axis2_noiseReductionPP.point}pp CI[${first.axes.axis2_noiseReductionPP.ci[0]},${first.axes.axis2_noiseReductionPP.ci[1]}] down=${first.axes.axis2_noiseReductionPP.resolvedReducing}`
  + ` · axis2power ${first.axes.axis2_powerGainPP.point}pp up=${first.axes.axis2_powerGainPP.resolvedRising}`
  + ` · unexpl ${first.fidelity.unexplained} · seamRel ${first.release.seamAttributable} · armRng ${first.struct2.armRngTotal}`
  + ` · perf ${first.struct2.performCallsTotal}/${first.struct2.struckTotal} · rngParity ${first.struct2.rngParityMatch}/${first.struct2.rngParityMatch + first.struct2.rngParityMismatch}`
  + ` · det ${deterministic} · tableSHA ${tableSha.slice(0, 12)} · SHA ${sha256.slice(0, 12)}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
