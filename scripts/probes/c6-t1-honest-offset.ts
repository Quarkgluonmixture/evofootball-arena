// C6 T1 — THE HONEST OFFSET (fork-and-force paired same-seed turn episodes).
//
// Authority: docs/world-model/C6-T1-HONEST-OFFSET.md (FROZEN pre-registration,
// as amended by commander amendments #48.3 (structural zero-loose) and #48.4
// (pinned fork window)) + ruling #48.5 (implementation + run authorized).
//
// This is the AUTHORIZED run of the frozen instrument. It steps UNMODIFIED OFF
// base matches to DETECT turn episodes (sweep >= 90 deg, T0's definition); at
// each episode it clones the pre-step world and runs it TWICE from the same seed
// over the #48.4 window [sweep start, sweep end + 0.5 s] — once with `c6Carry`
// OFF (the paired baseline), once ON (the honest offset). Nothing ships: the
// only armed world is a clone, `c6Carry` stays null in every production path.
//
// It measures, exactly to the frozen spec:
//   axis 1  tackle-eligibility RATE on turn episodes (expected UP ~+19.1%);
//   axis 2  far-side share among eligible (dot-sign rule; expected UP ~+1.4 pp);
//   the kick-origin displacement on kicks initiated inside the window (#48.4);
//   the FIDELITY ledger — per-tick applied offset == the §LAW value to 1e-9,
//     exception classes keyed on SPEED (#46.3), unexplained must be 0;
//   the OWNERSHIP-RELEASE ledger (#48.3) — every release on ON forks classes to
//     a named channel (tackle / de-glue / kick / ball-won); offset-attributable
//     releases must be exactly 0; the paired loose-ball COUNT DELTA is REPORTED;
//   the lag-skill (G) gradient — far-side by dribbling, REPORTED never gated.
//
// Gates: X-SRC, X-DET (byte-identical twice + canonical SHA), the floors
// (F-TURN / F-TURN-EXPOSED / F-EXPOSURE / F-FARSIDE), FIDELITY (unexplained 0),
// ZERO-LOOSE-STRUCTURAL (offset-attributable releases 0), and the two priced
// HARD direction gates (axis-1 CI lower > 0; axis-2 CI excludes 0).
//
// Output: docs/world-model/data/c6-t1-honest-offset.json

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- staging (doc §STAGING) --------------------------------------------------
const SEED_START = 5_000_000; // above every consumed range (incl. all of T0)
const BLOCK_STRIDE = 100_000;
const BLOCKS = 12; // b in 0..11
const MATCHES_PER_BLOCK = 100; // k in 0..99 -> 1,200 matches, 5.0M-6.1M
const BOOTSTRAP_SEED = 51_037; // frozen (doc §STAGING: a frozen BOOTSTRAP_SEED)
const BOOTSTRAP_RESAMPLES = 2000;

// --- ENGINEERING smoke cap (does NOT touch the frozen staging for the real run) --
// C6_T1_CAP_MATCHES caps total matches for a crash/NaN smoke; when set, output is
// routed to C6_T1_OUT (a scratch path) so the canonical JSON is never overwritten.
// Unset (the authorized run) => full 1,200 matches, canonical output path.
const CAP_MATCHES = process.env.C6_T1_CAP_MATCHES
  ? Math.max(1, Number.parseInt(process.env.C6_T1_CAP_MATCHES, 10))
  : Number.POSITIVE_INFINITY;
const OUT_PATH = process.env.C6_T1_OUT ?? 'docs/world-model/data/c6-t1-honest-offset.json';

// --- frozen instrument constants (T0's, verbatim) ----------------------------
const SPEED_GATE = 2.5; // the de-glue speed gate (Match.ts)
const OMEGA_LO = 0.1 * TURN_RATE; // 0.65 rad/s: essentially straight (episode end)
const SWEEP_THRESHOLD = Math.PI / 2; // 90 deg turn episode
const HALF_THRESHOLD = SWEEP_THRESHOLD * 0.5; // clone speculatively past 45 deg
const POST_WINDOW_TICKS = 30; // +0.5 s (#48.4 window tail)
const TACKLE_R = 1.15; // ball-keyed tackle radius (mechanics.ts)
const DIST_INNER = 0.58; // half the tackle radius (T0 §2 (iii))
const CARRY = 0.85; // the outfield glue offset

// --- floors (doc §STAGING; #24) ----------------------------------------------
const F_TURN = 3_600;
const F_TURN_EXPOSED = 1_400;
const F_EXPOSURE = 8_000;
const F_FARSIDE = 300;

// --- kick-origin displacement bound (#47.4 / #48.4; T0 §5-result) ------------
const KICK_P50_BOUND = 0.346;
const KICK_P90_BOUND = 0.727;

// --- the §LAW, replicated VERBATIM from Match.ts for the fidelity recompute ---
// (mirrors src/sim/Match.ts's module constants + c6* helpers exactly; the
// fidelity gate checks the engine's applied offset against this to 1e-9.)
const C6_D_BAR = 0.4;
const C6_V_REF = 7.0;
const C6_CARRY_BASE = 0.55;
const C6_CARRY_SPEED = 0.15;
const C6_CARRY_TUCK = 0.3;
const C6_CARRY_FLOOR = 0.3;
const C6_CARRY_CAP = 1.4;
const C6_TUCK_KAPPA = 1.0;
const C6_TAU_BASE = 0.18;
const C6_TAU_SLOPE = 0.1;
const C6_TAU_MIN = 0.12;
const C6_TAU_MAX = 0.24;
const C6_SIGMA_AMP = 0.06;
const C6_SIGMA_DRB = 0.8;
const clampN = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);
const c6CarryLen = (speed: number, omega: number, drb: number): number => {
  const tuckGain = 1 + C6_TUCK_KAPPA * (drb - C6_D_BAR);
  return clampN(
    C6_CARRY_BASE + C6_CARRY_SPEED * (speed / C6_V_REF) - C6_CARRY_TUCK * (omega / TURN_RATE) * tuckGain,
    C6_CARRY_FLOOR, C6_CARRY_CAP,
  );
};
const c6TauTicks = (drb: number): number =>
  Math.round(clampN(C6_TAU_BASE + C6_TAU_SLOPE * (drb - C6_D_BAR), C6_TAU_MIN, C6_TAU_MAX) / DT);
const c6Sigma = (omega: number, drb: number): number =>
  C6_SIGMA_AMP * (omega / TURN_RATE) * (1 - C6_SIGMA_DRB * drb);
const c6KeyedUnit = (gid: number, tick: number, channel: number): number => {
  let h = 0x6d6e4c31 | 0;
  h = Math.imul(h ^ (gid + 0x9e3779b9), 0x85ebca6b);
  h = Math.imul(h ^ (tick + 0xc2b2ae35), 0x27d4eb2d);
  h = Math.imul(h ^ (channel + 0x165667b1), 0x9e3779b1);
  h ^= h >>> 16;
  return (h >>> 0) / 0x100000000;
};
const c6KeyedGaussian2D = (gid: number, tick: number): { x: number; y: number } => {
  const u1 = Math.min(1 - 1e-12, Math.max(1e-12, c6KeyedUnit(gid, tick, 0)));
  const u2 = c6KeyedUnit(gid, tick, 1);
  const r = Math.sqrt(-2 * Math.log(u1));
  const a = 2 * Math.PI * u2;
  return { x: r * Math.cos(a), y: r * Math.sin(a) };
};
// the engine's ring lookup, over the fork's public `c6HeadingHist`.
type Ring = Map<number, { tick: number; hx: number; hy: number }[]>;
const headingAt = (hist: Ring, gid: number, tick: number): { hx: number; hy: number } | null => {
  const ring = hist.get(gid);
  if (ring === undefined) return null;
  for (let i = ring.length - 1; i >= 0; i--) if (ring[i].tick === tick) return ring[i];
  return null;
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
const matchOf = (seed: number, c6Carry: boolean): Match => {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  (m as unknown as { c6Carry: boolean }).c6Carry = c6Carry;
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

// --- per-tick eligibility / far-side (T0 instrument iii, verbatim) ------------
interface Elig { owned: boolean; eligible: boolean; far: boolean; inner: boolean; drb: number }
const measureElig = (m: Match): Elig | null => {
  const owner = m.ball.owner;
  if (owner === null || m.phase !== 'playing' || owner.sentOff) return null;
  if (owner.gkHoldTimer > 0 || (owner.role === 'GK' && owner.gkDistributing)) return null;
  if (owner.role === 'GK') return null;
  if (m.restartKickGid === owner.gid) return null;
  const ball = m.ball;
  const offX = ball.pos.x - owner.pos.x;
  const offY = ball.pos.y - owner.pos.y;
  let eligible = false;
  let nearestDist = Infinity;
  let ndx = 0;
  let ndy = 0;
  for (const q of m.teams[1 - owner.side].players) {
    if (q.sentOff) continue;
    const db = Math.hypot(q.pos.x - ball.pos.x, q.pos.y - ball.pos.y);
    if (db < TACKLE_R && db < nearestDist) {
      eligible = true; nearestDist = db; ndx = q.pos.x - owner.pos.x; ndy = q.pos.y - owner.pos.y;
    }
  }
  const far = eligible && ndx * offX + ndy * offY < 0; // dot(defVec, ballOffset) < 0
  return { owned: true, eligible, far, inner: nearestDist <= DIST_INNER, drb: owner.attrs.dribbling };
};

// --- standing exception classes (doc §FIDELITY, #38.1; keyed on SPEED #46.3) --
interface Ledger {
  ePaused: number; eGk: number; eGkHold: number; eRestart: number; eSentOff: number;
  eNoOwner: number; eEnded: number; eDeglue: number; eTransition: number;
  seamTicks: number; fidelityOk: number; unexplained: number;
}
const newLedger = (): Ledger => ({
  ePaused: 0, eGk: 0, eGkHold: 0, eRestart: 0, eSentOff: 0, eNoOwner: 0, eEnded: 0,
  eDeglue: 0, eTransition: 0, seamTicks: 0, fidelityOk: 0, unexplained: 0,
});
const addLedger = (a: Ledger, b: Ledger): void => {
  a.ePaused += b.ePaused; a.eGk += b.eGk; a.eGkHold += b.eGkHold; a.eRestart += b.eRestart;
  a.eSentOff += b.eSentOff; a.eNoOwner += b.eNoOwner; a.eEnded += b.eEnded; a.eDeglue += b.eDeglue;
  a.eTransition += b.eTransition; a.seamTicks += b.seamTicks; a.fidelityOk += b.fidelityOk;
  a.unexplained += b.unexplained;
};

// --- ownership-release ledger (#48.3) ----------------------------------------
interface ReleaseLedger {
  releases: number; tackle: number; deglue: number; kick: number; ballWon: number;
  offsetAttributable: number; // MUST be 0 (the seam never writes ball.owner)
}
const newReleaseLedger = (): ReleaseLedger => ({
  releases: 0, tackle: 0, deglue: 0, kick: 0, ballWon: 0, offsetAttributable: 0,
});
const addReleaseLedger = (a: ReleaseLedger, b: ReleaseLedger): void => {
  a.releases += b.releases; a.tackle += b.tackle; a.deglue += b.deglue; a.kick += b.kick;
  a.ballWon += b.ballWon; a.offsetAttributable += b.offsetAttributable;
};

// --- per-match aggregate (cluster unit = match seed) -------------------------
interface MatchAgg {
  seed: number;
  offOwned: number; offElig: number; offFar: number;
  onOwned: number; onElig: number; onFar: number;
}

// --- the census accumulator --------------------------------------------------
interface Census {
  totalBaseSteps: number;
  episodesForked: number; // F-TURN
  episodesExposed: number; // F-TURN-EXPOSED (OFF arm, any eligible in window)
  episodesEndedInWindow: number; // #48.4 excluded, REPORTED
  fidelity: Ledger;
  release: ReleaseLedger;
  offLoose: number; onLoose: number; // loose-ball counts over windows (delta REPORTED)
  kickDisp: number[]; // ON kick-origin displacements (kicks inside window)
  kicksInWindow: number;
  perTickDisp: number[]; // ON honest-vs-glue displacement at every seam tick (supplementary)
  gradElig: number[]; gradFar: number[]; // per dribbling bucket (G), ON
  matches: MatchAgg[];
  cloneGuardFails: number; // OFF fork must reproduce base at startTick (MUST be 0)
}
const GRAD_BUCKETS = 3; // [0.1,0.3) [0.3,0.5) [0.5,+]
const gradBucket = (drb: number): number => (drb < 0.3 ? 0 : drb < 0.5 ? 1 : 2);
const newCensus = (): Census => ({
  totalBaseSteps: 0, episodesForked: 0, episodesExposed: 0, episodesEndedInWindow: 0,
  fidelity: newLedger(), release: newReleaseLedger(), offLoose: 0, onLoose: 0,
  kickDisp: [], kicksInWindow: 0, perTickDisp: [],
  gradElig: Array(GRAD_BUCKETS).fill(0), gradFar: Array(GRAD_BUCKETS).fill(0),
  matches: [], cloneGuardFails: 0,
});

// classify the owner state on a fork tick into exactly one class; returns null
// when the tick is a continuous-possession outfield SEAM tick (the caller then
// runs the fidelity recompute).
const classifyOwned = (
  m: Match, prevOwnerGid: number | null,
): 'paused' | 'gk' | 'gkhold' | 'restart' | 'sentoff' | 'noowner' | 'ended' | 'transition' | 'seam' => {
  if (m.finished) return 'ended';
  if (m.phase !== 'playing') return 'paused';
  const owner = m.ball.owner;
  if (owner === null) return 'noowner';
  if (owner.sentOff) return 'sentoff';
  if (owner.gkHoldTimer > 0 || (owner.role === 'GK' && owner.gkDistributing)) return 'gkhold';
  if (owner.role === 'GK') return 'gk';
  if (m.restartKickGid === owner.gid) return 'restart';
  // Any ownership settling THIS tick — a handover OR a regain from a loose ball
  // (prevOwnerGid === null) — is the E-TRANSITION re-strike artefact, NOT a
  // continuous-possession seam tick: on such a tick the seam may not have run
  // (the ball settled to feet via giveBall inside the free-ball path). Only a
  // body that already owned last tick reaches the honest offset here.
  if (owner.gid !== prevOwnerGid) return 'transition';
  return 'seam';
};

// Run one fork arm over the window [startTick, windowEnd]; measure into `c`.
// `guardBallPos` (OFF only) pins the clone timing: the first step must land on
// the base's recorded ball.pos at startTick.
const runArm = (
  clone: Match, armOn: boolean, startTick: number, windowEnd: number,
  agg: MatchAgg, c: Census, guardBallPos: { x: number; y: number } | null,
): { exposed: boolean; endedInWindow: boolean } => {
  const fork = cloneSimulationState(clone);
  (fork as unknown as { c6Carry: boolean }).c6Carry = armOn;
  const hist = (fork as unknown as { c6HeadingHist: Ring }).c6HeadingHist;
  let exposed = false;
  let endedInWindow = false;
  let prevOwnerGid: number | null = fork.ball.owner?.gid ?? null;
  let prevOwnerSide: number | null = fork.ball.owner?.side ?? null;
  const lastHonestDisp = new Map<number, number>();
  let firstStep = true;
  while (fork.simTick < windowEnd) {
    if (fork.finished) { endedInWindow = true; break; }
    // pre-step owner kinematics for the de-glue-regime (speed) classification
    const preOwner = fork.ball.owner;
    const preSpeedSq = preOwner ? preOwner.vel.x * preOwner.vel.x + preOwner.vel.y * preOwner.vel.y : 0;
    fork.step(DT);
    if (firstStep) {
      firstStep = false;
      if (!armOn && guardBallPos !== null) {
        if (Math.abs(fork.ball.pos.x - guardBallPos.x) > 1e-9
          || Math.abs(fork.ball.pos.y - guardBallPos.y) > 1e-9) c.cloneGuardFails += 1;
      }
    }
    const t = fork.simTick;
    if (t < startTick) continue; // (never: first step lands on startTick)

    // --- eligibility / far-side (both arms) ---
    const e = measureElig(fork);
    if (e !== null && e.owned) {
      if (armOn) { agg.onOwned += 1; if (e.eligible) { agg.onElig += 1; if (e.far) agg.onFar += 1; } }
      else { agg.offOwned += 1; if (e.eligible) { agg.offElig += 1; if (e.far) agg.offFar += 1; } }
      if (e.eligible) exposed = true;
    }

    // --- ownership release (both arms count loose; ON classifies) ---
    const newOwner = fork.ball.owner;
    const released = prevOwnerGid !== null && (newOwner === null || newOwner.gid !== prevOwnerGid);
    if (released) {
      const relGid = prevOwnerGid as number;
      if (newOwner === null) { if (armOn) c.onLoose += 1; else c.offLoose += 1; }
      if (armOn) {
        c.release.releases += 1;
        const deglued = fork.dribbleTouch !== null && fork.dribbleTouch.gid === relGid
          && fork.dribbleTouch.until >= fork.simTime; // just set by performDribbleTouch
        if (deglued) {
          c.release.deglue += 1;
        } else if (newOwner === null) {
          // freed without de-glue: a deliberate kick (pass/shot/clearance) if the
          // ball has real pace or a pass is pending; otherwise a loose contest.
          const kicked = fork.pendingPass !== null
            || fork.ball.vel.x * fork.ball.vel.x + fork.ball.vel.y * fork.ball.vel.y > SPEED_GATE * SPEED_GATE;
          if (kicked) {
            c.release.kick += 1;
            c.kicksInWindow += 1;
            const d = lastHonestDisp.get(relGid);
            if (d !== undefined) c.kickDisp.push(d);
          } else {
            c.release.ballWon += 1;
          }
        } else if (prevOwnerSide !== null && newOwner.side !== prevOwnerSide) {
          c.release.tackle += 1; // won by the other side
        } else {
          c.release.kick += 1; // teammate received the pass
        }
      }
    }

    // --- fidelity + gradient + kick-origin bookkeeping (ON only) ---
    if (armOn) {
      const cls = classifyOwned(fork, prevOwnerGid);
      switch (cls) {
        case 'ended': c.fidelity.eEnded += 1; break;
        case 'paused': c.fidelity.ePaused += 1; break;
        case 'gk': c.fidelity.eGk += 1; break;
        case 'gkhold': c.fidelity.eGkHold += 1; break;
        case 'restart': c.fidelity.eRestart += 1; break;
        case 'sentoff': c.fidelity.eSentOff += 1; break;
        case 'noowner':
          // a freed ball: classify de-glue (speed-keyed) vs plain no-owner.
          if (preOwner !== null && prevOwnerGid !== null && preOwner.gid === prevOwnerGid
            && preSpeedSq > SPEED_GATE * SPEED_GATE) c.fidelity.eDeglue += 1;
          else c.fidelity.eNoOwner += 1;
          break;
        case 'transition': c.fidelity.eTransition += 1; break;
        case 'seam': {
          const owner = fork.ball.owner!;
          // The engine records the carrier's heading (unconditionally, carry===0.85)
          // in the SAME line that guards the seam; a ring entry at tick t is its own
          // proof that the owned-outfield seam block ran this tick. Its ABSENCE means
          // the ball was loose at stepBall entry and got assigned to this body AFTER
          // the block (the kickoff-spot pin / a same-tick re-strike) — the seam never
          // ran, so this is the E-TRANSITION artefact, not a fidelity seam tick.
          if (headingAt(hist, owner.gid, t) === null) { c.fidelity.eTransition += 1; break; }
          const drb = owner.attrs.dribbling;
          const speed = Math.sqrt(owner.vel.x * owner.vel.x + owner.vel.y * owner.vel.y);
          const prev = headingAt(hist, owner.gid, t - 1);
          let omega = 0;
          if (prev !== null) omega = Math.abs(headingDelta({ x: prev.hx, y: prev.hy }, owner.heading)) / DT;
          const lagged = headingAt(hist, owner.gid, t - c6TauTicks(drb));
          const dirX = lagged !== null ? lagged.hx : owner.heading.x;
          const dirY = lagged !== null ? lagged.hy : owner.heading.y;
          const carryLen = c6CarryLen(speed, omega, drb);
          const sigma = c6Sigma(omega, drb);
          const noise = c6KeyedGaussian2D(owner.gid, t);
          const ex = owner.pos.x + dirX * carryLen + noise.x * sigma;
          const ey = owner.pos.y + dirY * carryLen + noise.y * sigma;
          c.fidelity.seamTicks += 1;
          if (Math.abs(fork.ball.pos.x - ex) <= 1e-9 && Math.abs(fork.ball.pos.y - ey) <= 1e-9) {
            c.fidelity.fidelityOk += 1;
          } else {
            c.fidelity.unexplained += 1;
          }
          // kick-origin bookkeeping: honest ball vs the rigid glue position.
          const disp = Math.hypot(
            fork.ball.pos.x - (owner.pos.x + owner.heading.x * CARRY),
            fork.ball.pos.y - (owner.pos.y + owner.heading.y * CARRY),
          );
          lastHonestDisp.set(owner.gid, disp);
          c.perTickDisp.push(disp);
          // (G) gradient: far-side by dribbling on eligible seam ticks.
          if (e !== null && e.eligible) {
            const b = gradBucket(drb);
            c.gradElig[b] += 1;
            if (e.far) c.gradFar[b] += 1;
          }
          break;
        }
      }
    }

    prevOwnerGid = newOwner?.gid ?? null;
    prevOwnerSide = newOwner?.side ?? null;
  }
  return { exposed, endedInWindow };
};

// --- per-owner turn-episode tracker (T0's detection, verbatim) ---------------
interface Tracker {
  gid: number;
  prevHeading: { x: number; y: number };
  sweepAccum: number;
  inEpisode: boolean;
  episodeStartTick: number;
}

// Run ONE base match OFF; detect episodes; fork+measure each over its window.
const runMatch = (seed: number, c: Census): void => {
  const base = matchOf(seed, false);
  let tracker: Tracker | null = null;
  // rolling pre-step clone, kept only while the current carrier is mid-sweep.
  let rollingClone: Match | null = null;
  // the pending episode captured at 90-deg cross, launched at sweep end.
  let pending: { clone: Match; startTick: number; startBallPos: { x: number; y: number } } | null = null;

  while (!base.finished) {
    // decide whether to snapshot the PRE-step world (for a possible fork).
    const preOwner = base.ball.owner;
    const midSweep = preOwner !== null && tracker !== null && tracker.gid === preOwner.gid
      && Math.abs(tracker.sweepAccum) >= HALF_THRESHOLD;
    rollingClone = midSweep ? cloneSimulationState(base) : null;

    base.step(DT);
    c.totalBaseSteps += 1;
    if (base.finished) break;

    const owner = base.ball.owner;
    const playing = base.phase === 'playing';
    const outfield = owner !== null && playing && !owner.sentOff && owner.role !== 'GK'
      && !(owner.gkHoldTimer > 0 || owner.gkDistributing) && base.restartKickGid !== owner.gid;

    if (!outfield || owner === null) { tracker = null; continue; }

    if (tracker === null || tracker.gid !== owner.gid) {
      tracker = {
        gid: owner.gid,
        prevHeading: { x: owner.heading.x, y: owner.heading.y },
        sweepAccum: 0, inEpisode: false, episodeStartTick: base.simTick,
      };
      continue;
    }

    const dHead = headingDelta(tracker.prevHeading, { x: owner.heading.x, y: owner.heading.y });
    const omega = Math.abs(dHead) / DT;
    tracker.prevHeading = { x: owner.heading.x, y: owner.heading.y };

    // accumulate signed sweep; a sign flip resets the accumulator (T0).
    if (tracker.sweepAccum !== 0 && Math.sign(dHead) !== Math.sign(tracker.sweepAccum) && dHead !== 0) {
      tracker.sweepAccum = dHead;
    } else {
      tracker.sweepAccum += dHead;
    }

    if (!tracker.inEpisode && Math.abs(tracker.sweepAccum) >= SWEEP_THRESHOLD) {
      tracker.inEpisode = true;
      tracker.episodeStartTick = base.simTick;
      // capture the pre-step clone of THIS tick (rollingClone was made before it).
      if (rollingClone !== null && pending === null) {
        pending = {
          clone: rollingClone,
          startTick: base.simTick,
          startBallPos: { x: base.ball.pos.x, y: base.ball.pos.y },
        };
      }
    }

    if (tracker.inEpisode && omega < OMEGA_LO) {
      // episode END at base.simTick; window = [startTick, endTick + 30].
      if (pending !== null) {
        const windowEnd = base.simTick + POST_WINDOW_TICKS;
        const agg: MatchAgg = { seed, offOwned: 0, offElig: 0, offFar: 0, onOwned: 0, onElig: 0, onFar: 0 };
        const off = runArm(pending.clone, false, pending.startTick, windowEnd, agg, c, pending.startBallPos);
        const on = runArm(pending.clone, true, pending.startTick, windowEnd, agg, c, null);
        if (off.endedInWindow || on.endedInWindow) {
          c.episodesEndedInWindow += 1; // #48.4 excluded, REPORTED
        } else {
          c.episodesForked += 1;
          if (off.exposed) c.episodesExposed += 1;
          c.matches.push(agg);
        }
      }
      pending = null;
      tracker.inEpisode = false;
      tracker.sweepAccum = 0;
    }
  }
};

// --- cluster bootstrap over match seeds (#20) --------------------------------
interface AxisResult {
  point: number; lower: number; upper: number; resolved: boolean;
}
const bootstrapAxes = (matches: readonly MatchAgg[], offset: number): {
  axis1: AxisResult & { offRate: number; onRate: number };
  axis2: AxisResult & { offShare: number; onShare: number; resolvedUp: boolean };
} => {
  const sum = (sel: (m: MatchAgg) => number) => matches.reduce((s, m) => s + sel(m), 0);
  const offOwned = sum((m) => m.offOwned);
  const offElig = sum((m) => m.offElig);
  const offFar = sum((m) => m.offFar);
  const onOwned = sum((m) => m.onOwned);
  const onElig = sum((m) => m.onElig);
  const onFar = sum((m) => m.onFar);
  const offRate = offOwned === 0 ? Number.NaN : offElig / offOwned;
  const onRate = onOwned === 0 ? Number.NaN : onElig / onOwned;
  const axis1Point = Number.isFinite(offRate) && offRate > 0 ? onRate / offRate - 1 : Number.NaN;
  const offShare = offElig === 0 ? Number.NaN : offFar / offElig;
  const onShare = onElig === 0 ? Number.NaN : onFar / onElig;
  const axis2Point = onShare - offShare;

  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const n = matches.length;
  const d1: number[] = [];
  const d2: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let boOwned = 0, boElig = 0, boFar = 0, bnOwned = 0, bnElig = 0, bnFar = 0;
    for (let i = 0; i < n; i++) {
      const m = matches[rng.int(0, n - 1)];
      boOwned += m.offOwned; boElig += m.offElig; boFar += m.offFar;
      bnOwned += m.onOwned; bnElig += m.onElig; bnFar += m.onFar;
    }
    if (boOwned > 0 && bnOwned > 0 && boElig > 0) {
      const orr = boElig / boOwned;
      const nrr = bnElig / bnOwned;
      if (orr > 0) d1.push(nrr / orr - 1);
    }
    if (boElig > 0 && bnElig > 0) d2.push(bnFar / bnElig - boFar / boElig);
  }
  d1.sort((a, b) => a - b);
  d2.sort((a, b) => a - b);
  const at = (arr: number[], q: number) => (arr.length === 0 ? Number.NaN
    : arr[Math.min(arr.length - 1, Math.max(0, Math.floor(q * (arr.length - 1))))]);
  const a1lo = at(d1, 0.025), a1hi = at(d1, 0.975);
  const a2lo = at(d2, 0.025), a2hi = at(d2, 0.975);
  return {
    axis1: {
      point: round(axis1Point), lower: round(a1lo), upper: round(a1hi),
      resolved: Number.isFinite(a1lo) && a1lo > 0, offRate: round(offRate), onRate: round(onRate),
    },
    axis2: {
      point: round(axis2Point), lower: round(a2lo), upper: round(a2hi),
      // reported: CI excludes zero either side (feeds reading (E) wrong-direction).
      resolved: Number.isFinite(a2lo) && Number.isFinite(a2hi) && (a2lo > 0 || a2hi < 0),
      // the HARD gate is DIRECTIONAL: far-side RISES, CI lower > 0 (doc §GATES Axis 2 "(UP)").
      resolvedUp: Number.isFinite(a2lo) && a2lo > 0,
      offShare: round(offShare), onShare: round(onShare),
    },
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

  const { axis1, axis2 } = bootstrapAxes(c.matches, 0);

  // --- floors ---
  const totalOffElig = c.matches.reduce((s, m) => s + m.offElig, 0);
  const totalOnFar = c.matches.reduce((s, m) => s + m.onFar, 0);
  const floors = {
    fTurn: { population: c.episodesForked, floor: F_TURN, pass: c.episodesForked >= F_TURN },
    fTurnExposed: { population: c.episodesExposed, floor: F_TURN_EXPOSED, pass: c.episodesExposed >= F_TURN_EXPOSED },
    fExposure: { population: totalOffElig, floor: F_EXPOSURE, pass: totalOffElig >= F_EXPOSURE },
    fFarside: { population: totalOnFar, floor: F_FARSIDE, pass: totalOnFar >= F_FARSIDE },
  };

  // --- kick-origin displacement (#48.4: kicks inside the window) ---
  const kick = {
    kicksInWindow: c.kicksInWindow,
    p50: round(quantile(c.kickDisp, 0.5), 5),
    p90: round(quantile(c.kickDisp, 0.9), 5),
    max: round(arrayMax(c.kickDisp), 5),
    boundP50: KICK_P50_BOUND,
    boundP90: KICK_P90_BOUND,
    withinBound: quantile(c.kickDisp, 0.5) <= KICK_P50_BOUND && quantile(c.kickDisp, 0.9) <= KICK_P90_BOUND,
    perSeamTick: {
      p50: round(quantile(c.perTickDisp, 0.5), 5),
      p90: round(quantile(c.perTickDisp, 0.9), 5),
      max: round(arrayMax(c.perTickDisp), 5),
      n: c.perTickDisp.length,
    },
  };

  // --- (G) lag-skill gradient (REPORTED) ---
  const gradient = Array.from({ length: GRAD_BUCKETS }, (_, i) => ({
    bucket: i === 0 ? '[0.1,0.3)' : i === 1 ? '[0.3,0.5)' : '[0.5,+]',
    eligible: c.gradElig[i],
    far: c.gradFar[i],
    farShare: round(c.gradElig[i] === 0 ? Number.NaN : c.gradFar[i] / c.gradElig[i]),
  }));

  // --- gates ---
  let srcClean: boolean;
  let srcDiff: string;
  try {
    srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim();
    srcClean = srcDiff === '';
  } catch {
    srcDiff = 'git-unavailable'; srcClean = false;
  }
  const gates = {
    xSrc: srcClean,
    cloneGuard: c.cloneGuardFails === 0,
    fidelityUnexplained: c.fidelity.unexplained === 0,
    zeroLooseStructural: c.release.offsetAttributable === 0,
    fTurn: floors.fTurn.pass,
    fTurnExposed: floors.fTurnExposed.pass,
    fExposure: floors.fExposure.pass,
    fFarside: floors.fFarside.pass,
    axis1Up: axis1.resolved, // HARD: eligibility rate rises (CI lower > 0)
    axis2Up: axis2.resolvedUp, // HARD: far-side share RISES (CI lower > 0, directional UP)
  };

  return {
    experiment: 'C6-T1 (the honest offset)',
    authority: 'C6-T1-HONEST-OFFSET (ruling #48 as amended by #48.3/#48.4; run #48.5)',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      matches: BLOCKS * MATCHES_PER_BLOCK,
      seedFormula: '5,000,000 + b*100,000 + k, b in 0..11, k in 0..99',
      clusterUnit: 'match seed (disjoint per block)',
      bootstrapSeed: BOOTSTRAP_SEED, bootstrapResamples: BOOTSTRAP_RESAMPLES,
      window: 'sweep start to sweep end + 0.5 s (#48.4)',
      sweepThreshold: SWEEP_THRESHOLD, postWindowTicks: POST_WINDOW_TICKS,
      tackleRadius: TACKLE_R, distInner: DIST_INNER,
    },
    coverage: {
      totalBaseSteps: c.totalBaseSteps,
      episodesForked: c.episodesForked,
      episodesExposed: c.episodesExposed,
      episodesEndedInWindow: c.episodesEndedInWindow,
      matchesWithEpisodes: c.matches.length,
      srcDiff,
    },
    floors,
    axes: {
      axis1_eligibilityRate: {
        offRate: axis1.offRate, onRate: axis1.onRate,
        relativeShift: axis1.point, ci: [axis1.lower, axis1.upper], resolvedUp: axis1.resolved,
        expected: 0.191, band: [0.095, 0.286], insideBand: axis1.point >= 0.095 && axis1.point <= 0.286,
      },
      axis2_farSideShare: {
        offShare: axis2.offShare, onShare: axis2.onShare,
        shiftPP: round(axis2.point * 100, 4), ci: [round(axis2.lower * 100, 4), round(axis2.upper * 100, 4)],
        resolved: axis2.resolved, resolvedUp: axis2.resolvedUp, expectedPP: 1.425, bracketPP: [1.328, 1.525],
      },
    },
    kick,
    gradient,
    fidelity: c.fidelity,
    release: c.release,
    looseBall: { off: c.offLoose, on: c.onLoose, deltaReported: c.onLoose - c.offLoose },
    cloneGuardFails: c.cloneGuardFails,
    gates,
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const canonical = (v: unknown): string => JSON.stringify(v);
const first = runExperiment();
const second = runExperiment();
const deterministic = canonical(first) === canonical(second);
const tableSha = createHash('sha256').update(canonical({
  floors: first.floors, axes: first.axes, kick: first.kick, gradient: first.gradient,
  fidelity: first.fidelity, release: first.release, looseBall: first.looseBall,
})).digest('hex');
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');

const gates = { ...first.gates, xDet: deterministic };
const output = { ...first, gates, tableSha, sha256, verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL' };

writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(100 * v).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `C6-T1 ${output.verdict}`
  + ` · baseSteps ${first.coverage.totalBaseSteps} · episodes ${first.coverage.episodesForked}`
  + ` (exposed ${first.coverage.episodesExposed}, endedInWin ${first.coverage.episodesEndedInWindow})`
  + ` · F-TURN ${first.floors.fTurn.population}/${F_TURN} ${first.floors.fTurn.pass}`
  + ` · F-EXPOSURE ${first.floors.fExposure.population}/${F_EXPOSURE} ${first.floors.fExposure.pass}`
  + ` · F-FARSIDE ${first.floors.fFarside.population}/${F_FARSIDE} ${first.floors.fFarside.pass}`
  + ` · axis1 ${pct(first.axes.axis1_eligibilityRate.relativeShift)} CI[${pct(first.axes.axis1_eligibilityRate.ci[0])},${pct(first.axes.axis1_eligibilityRate.ci[1])}] up=${first.axes.axis1_eligibilityRate.resolvedUp}`
  + ` · axis2 ${first.axes.axis2_farSideShare.shiftPP}pp CI[${first.axes.axis2_farSideShare.ci[0]},${first.axes.axis2_farSideShare.ci[1]}] res=${first.axes.axis2_farSideShare.resolved}`
  + ` · kick p50 ${first.kick.p50}/p90 ${first.kick.p90} within=${first.kick.withinBound}`
  + ` · unexplained ${first.fidelity.unexplained} · offsetRel ${first.release.offsetAttributable}`
  + ` · loose Δ ${first.looseBall.deltaReported} · guard ${first.cloneGuardFails}`
  + ` · det ${deterministic} · tableSHA ${tableSha.slice(0, 12)} · SHA ${sha256.slice(0, 12)}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
