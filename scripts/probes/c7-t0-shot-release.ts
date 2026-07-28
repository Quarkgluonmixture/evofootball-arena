// C7 T0 — THE SHOT-RELEASE CENSUS (read-only, observational).
//
// Authority: docs/world-model/C7-T0-SHOT-RELEASE.md (FROZEN pre-registration)
// + commander ruling #55 (PASS, no amendment; run authorized). Conventions:
// #46.2 (smoke/census seed disjointness), #48.4 (reach model pinned ex ante),
// #49.3 (event-keyed exception classes + per-record receipts, incl. E-INJURY),
// #20 (CI semantics, cluster = match seed), #38.1 (standing exception classes),
// #24 (attainable-population floors), #32.1 (no coupon-collector gate).
//
// This is the AUTHORIZED run of the frozen instrument. It steps UNMODIFIED
// matches and reads state at each shot commit — it does not fork the world,
// force any behaviour, or touch any flag. Release is the shipped SYNCHRONOUS
// strike throughout; there is no pendingKick at T0 (contract Road B). Zero
// src/** changes. Nothing armed. It prices the POPULATION and the GEOMETRY,
// not value (contract §9).
//
// The census deliverables (doc §2), implemented EXACTLY to the frozen spec:
//   (i)   the shot population by RELEASE PATH {open-play, one-touch, header,
//         free-kick}; the v1 SEAT = open-play + one-touch (route through
//         performShot -> kickBall). Headers (aerial contact, no kickBall) and
//         free-kicks (dead-ball restart taker) are EXCLUDED (contract §9).
//   (ii)  body state at commit: |v| / |omega| bands (edges from named code
//         constants) and the RECONSTRUCTED misalignment theta (disclosed:
//         body-facing -> freed-ball-velocity direction; |v|/|omega| exact).
//   (iii) charge-down exposure geometry: nearest non-sent-off opponent to the
//         BALL, its distance and CLOSING SPEED on the ball at commit.
//   (iv)  counterfactual arithmetic (pure arithmetic on recorded states) for
//         the three non-binding candidate W laws FAST/MID/SLOW: interruption
//         exposure under BOTH reach models (current-closing = PRIMARY, top-
//         speed = SENSITIVITY) with match-seed cluster CI, and the theta-decay
//         quality head-room (misalignment price deltas via mechanics.ts:78-88).
//   spell context: gaining-ownership -> commit time vs the 0.33 s median spell.
//
// Gates (doc §3): X-SRC, X-FP (asserted), X-DET (byte-identical twice + SHA),
// X-OVERLAP (vacuous, reason recorded), X-CLASSIFY (every shotLog entry maps to
// exactly one class; unexplained == 0; E-NONSEAT-NOOWNER == 0). Population
// floors F-SHOT-SEAT (>= 2000), F-SHOT-EXPOSED (>= 150, PRIMARY reach model on
// the conservative FAST candidate — the BINDING gate), F-TWISTED (>= 400).
//
// Band edges DERIVED from named code constants (doc §2 (ii)):
//   speed:  the 2.5 m/s de-glue gate (Match.ts:1420); 5.0 = 2x the gate.
//   omega:  TURN_RATE = 6.5 rad/s (Player.ts:17); edges 0.1x and 0.5x it.
//   theta:  30deg / 45deg twisted brackets; theta decays at TURN_RATE.
//   tackle: the 1.15 m ball-keyed tackle radius (mechanics.ts:1757).
//   price:  orientationPowerMul/orientationNoiseMul (mechanics.ts:78-88).
//
// Output: docs/world-model/data/c7-t0-shot-release.json

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import type { PlayerAttributes } from '../../src/evolution/playerGenome';
import { dist, dot, len, sub, norm } from '../../src/utils/vec';
import { orientationPowerMul, orientationNoiseMul } from '../../src/sim/mechanics';
import { Rng } from '../../src/utils/rng';

// --- staging (doc §4, frozen; #46.2 disjointness) ----------------------------
const SEED_START = 6_700_000; // one stride above the 6.6M smoke, disjoint
const BLOCK_STRIDE = 100_000;
const BLOCKS = 5; // b in 0..4 -> 6.7M, 6.8M, 6.9M, 7.0M, 7.1M
const MATCHES_PER_BLOCK = 100; // k in 0..99 -> 500 matches
const BOOTSTRAP_SEED = 70037;
const BOOTSTRAP_RESAMPLES = 2000;

// --- frozen band edges (doc §2 (ii)) -----------------------------------------
const SPEED_LO = 2.5; // the de-glue speed gate (Match.ts:1420)
const SPEED_HI = 5.0; // 2x the gate
const OMEGA_LO = 0.1 * TURN_RATE; // 0.65 rad/s: essentially straight
const OMEGA_HI = 0.5 * TURN_RATE; // 3.25 rad/s: hard turn (>= half the cap)
const TACKLE_R = 1.15; // ball-keyed tackle radius (mechanics.ts:1757)
const V_REF = 7.0; // role top-speed reference (C6 convention)
const TOP_SPEED = 7.0; // defender top speed for the sensitivity reach model
const TWIST_30 = (30 * Math.PI) / 180;
const TWIST_45 = (45 * Math.PI) / 180;

// --- population floors (doc §3, derived from the §6 smoke) --------------------
const F_SHOT_SEAT = 2_000; // open-play + one-touch
const F_SHOT_EXPOSED = 150; // FAST candidate, PRIMARY reach model (BINDING)
const F_TWISTED = 400; // seat shots with theta >= 30deg at commit

const RECEIPT_CAP = 1_000; // per-class per-record receipt cap (#49.3)

const SPEED_NAMES = ['walk<=2.5', 'jog2.5-5', 'sprint>5'] as const;
const OMEGA_NAMES = ['straight<0.65', 'moderate0.65-3.25', 'hard>=3.25'] as const;
const speedBand = (v: number): number => (v <= SPEED_LO ? 0 : v <= SPEED_HI ? 1 : 2);
const omegaBand = (w: number): number => (w < OMEGA_LO ? 0 : w < OMEGA_HI ? 1 : 2);

// --- candidate W laws (doc §5, NON-BINDING sizing devices) -------------------
// W(|v|,|omega|,tech) = clamp( W_BASE + W_MOVE*(v/V_REF) + W_TURN*(omega/TURN_RATE)
//                              - W_TECH*(tech - t_bar), W_FLOOR, W_CAP )
// tech = dribbling, mean-centered on the population mean t_bar (mean-preserving).
interface WLaw {
  base: number; move: number; turn: number; tech: number; floor: number; cap: number;
}
const CANDIDATES: Record<'FAST' | 'MID' | 'SLOW', WLaw> = {
  FAST: { base: 0.04, move: 0.03, turn: 0.03, tech: 0.04, floor: 0.03, cap: 0.12 },
  MID: { base: 0.06, move: 0.05, turn: 0.05, tech: 0.05, floor: 0.05, cap: 0.18 },
  SLOW: { base: 0.08, move: 0.07, turn: 0.07, tech: 0.06, floor: 0.06, cap: 0.25 },
};
const CAND_IDS = ['FAST', 'MID', 'SLOW'] as const;
type CandId = (typeof CAND_IDS)[number];
const wOf = (law: WLaw, v: number, omega: number, tech: number, tBar: number): number => {
  const raw = law.base + law.move * (v / V_REF) + law.turn * (omega / TURN_RATE) - law.tech * (tech - tBar);
  return Math.min(law.cap, Math.max(law.floor, raw));
};

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
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
const mean = (a: readonly number[]): number => (a.length ? a.reduce((x, y) => x + y, 0) / a.length : Number.NaN);
const deg = (rad: number): number => (rad * 180) / Math.PI;
const misalign = (theta: number): number => (1 - Math.cos(theta)) / 2;

const headingDelta = (prev: { x: number; y: number }, cur: { x: number; y: number }): number => {
  const a0 = Math.atan2(prev.y, prev.x);
  const a1 = Math.atan2(cur.y, cur.x);
  let d = a1 - a0;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};

// --- per-seat-shot record (cluster-tagged with its match seed, #20) ----------
interface SeatShot {
  seed: number;
  path: 'openplay' | 'onetouch';
  v: number;
  omega: number;
  theta: number; // reconstructed misalignment (rad), disclosed
  defDist: number; // nearest non-sent-off opp distance to the BALL
  closeSpeed: number; // that opp's closing speed on the ball (>=0)
  dribbling: number;
  spellTicks: number; // ticks from gaining ownership to the commit
}

// --- standing exception classes (doc §3, #38.1; receipts #49.3) --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string; }
interface Classes {
  openplay: number;
  onetouch: number;
  header: number;
  freekick: number;
  eEnded: number;
  eOwnerswitch: number;
  eInjury: number;
  eNonseatNoowner: number;
}
const newClasses = (): Classes => ({
  openplay: 0, onetouch: 0, header: 0, freekick: 0,
  eEnded: 0, eOwnerswitch: 0, eInjury: 0, eNonseatNoowner: 0,
});

// --- pre-step snapshot of the prospective shooter (the feet owner) -----------
interface Snap {
  gid: number;
  side: number;
  path: 'openplay' | 'onetouch' | 'freekick';
  v: number;
  omega: number;
  defDist: number;
  closeSpeed: number;
  dribbling: number;
  spellTicks: number;
  headingX: number;
  headingY: number;
  ref: Player;
  preInjured: Player['injured'];
  preAttrs: PlayerAttributes;
}

// --- per-match aggregate (cluster unit = match seed) -------------------------
interface MatchAgg {
  seed: number;
  seat: number;
  expPrimary: Record<CandId, number>;
  expTop: Record<CandId, number>;
}

interface Census {
  totalSteps: number;
  totalShots: number;
  classes: Classes;
  receipts: Record<string, Receipt[]>;
  shotsPerMatch: number[];
  seat: SeatShot[];
  matchAggs: MatchAgg[]; // filled in a 2nd pass once t_bar is known
  matchSeatByOrder: SeatShot[][]; // seat shots grouped by match (for the 2nd pass)
}
const newCensus = (): Census => ({
  totalSteps: 0,
  totalShots: 0,
  classes: newClasses(),
  receipts: {
    eEnded: [], eOwnerswitch: [], eInjury: [], eNonseatNoowner: [], header: [], freekick: [],
  },
  shotsPerMatch: [],
  seat: [],
  matchAggs: [],
  matchSeatByOrder: [],
});

const addReceipt = (c: Census, cls: string, r: Receipt): void => {
  const arr = c.receipts[cls];
  if (arr && arr.length < RECEIPT_CAP) arr.push(r);
};

const runMatch = (seed: number, c: Census): void => {
  const match = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  let owner: { gid: number; spellStartTick: number; prevHeading: { x: number; y: number } } | null = null;
  let shotsThisMatch = 0;
  const matchSeat: SeatShot[] = [];

  while (!match.finished) {
    // --- PRE-STEP snapshot of the feet owner (the prospective shooter) ------
    const o = match.ball.owner;
    const playing = match.phase === 'playing';
    const outfield = o && !o.sentOff && o.role !== 'GK';
    const preBallAirborne = match.ball.airborne;

    let snap: Snap | null = null;
    if (playing && o && outfield) {
      if (!owner || owner.gid !== o.gid) {
        owner = { gid: o.gid, spellStartTick: match.simTick, prevHeading: { x: o.heading.x, y: o.heading.y } };
      }
      const omega = Math.abs(headingDelta(owner.prevHeading, o.heading)) / DT;
      owner.prevHeading = { x: o.heading.x, y: o.heading.y };

      // nearest non-sent-off opponent to the BALL + its closing speed on the ball
      const ball = match.ball;
      const opps = match.teams[1 - o.side].players;
      let defDist = Infinity;
      let closeSpeed = 0;
      for (const q of opps) {
        if (q.sentOff) continue;
        const d = dist(q.pos, ball.pos);
        if (d < defDist) {
          defDist = d;
          const toBall = norm(sub(ball.pos, q.pos));
          const relVel = sub(q.vel, o.vel); // ball moves with the owner while owned
          closeSpeed = dot(relVel, toBall); // >0 = closing on the ball
        }
      }
      const isRestartTaker = match.restartKickGid === o.gid;
      snap = {
        gid: o.gid,
        side: o.side,
        path: isRestartTaker ? 'freekick' : o.firstTouchWindow > 0 ? 'onetouch' : 'openplay',
        v: len(o.vel),
        omega,
        defDist,
        closeSpeed: Math.max(0, closeSpeed),
        dribbling: o.attrs.dribbling,
        spellTicks: match.simTick - owner.spellStartTick,
        headingX: o.heading.x,
        headingY: o.heading.y,
        ref: o,
        preInjured: o.injured,
        preAttrs: o.attrs,
      };
    } else {
      owner = null;
    }

    const shotsBefore = match.shotLog.length;
    const tickAt = match.simTick;
    match.step(DT);
    c.totalSteps += 1;
    const newShots = match.shotLog.length - shotsBefore;
    if (newShots <= 0) continue;

    for (let s = 0; s < newShots; s++) {
      const entry = match.shotLog[shotsBefore + s];
      c.totalShots += 1;
      shotsThisMatch += 1;
      const r = (gid: number, cause: string): Receipt => ({ seed, tick: tickAt, gid, cause });

      // --- classification: exactly ONE class per shotLog entry (#49.3) ------
      // (1) match-ending boundary: attribution mid-transition is ambiguous.
      if (match.finished) {
        c.classes.eEnded += 1;
        addReceipt(c, 'eEnded', r(snap ? snap.gid : -1, 'shot logged as the match finished'));
        continue;
      }
      // (2) no pre-step feet owner -> aerial header, or the exactly-0 fault.
      if (!snap) {
        if (preBallAirborne) {
          c.classes.header += 1;
          addReceipt(c, 'header', r(-1, 'no feet owner pre-step; ball airborne (performHeaderShot)'));
        } else {
          c.classes.eNonseatNoowner += 1;
          addReceipt(c, 'eNonseatNoowner', r(-1, 'shot with no feet owner and ball NOT airborne'));
        }
        continue;
      }
      // (3) ownership switched on the shot step: the pre-step owner cannot be
      //     attributed as the shooter (the entry's side disagrees).
      if (entry.side !== snap.side) {
        c.classes.eOwnerswitch += 1;
        addReceipt(c, 'eOwnerswitch', r(snap.gid, `entry side ${entry.side} != pre-step owner side ${snap.side}`));
        continue;
      }
      // (4) an advantage-foul injury to the shooter inside the attribution step
      //     (a knock mutating attrs post-read, Player.ts:223).
      if (snap.ref.injured !== snap.preInjured || snap.ref.attrs !== snap.preAttrs) {
        c.classes.eInjury += 1;
        addReceipt(c, 'eInjury', r(snap.gid, `shooter injury state changed in-step (${snap.preInjured ?? 'none'} -> ${snap.ref.injured ?? 'none'})`));
        continue;
      }
      // (5) EXCLUDED release paths.
      if (snap.path === 'freekick') {
        c.classes.freekick += 1;
        addReceipt(c, 'freekick', r(snap.gid, 'restart taker (performFreeKick)'));
        continue;
      }
      // (6) v1-SEAT paths: open-play / one-touch. Reconstruct theta from the
      //     freed ball velocity direction (disclosed; |v|/|omega| exact).
      const bv = match.ball.vel;
      const bl = len(bv);
      let theta = 0;
      if (bl > 1e-6) {
        const dotv = (snap.headingX * bv.x + snap.headingY * bv.y) / bl;
        theta = Math.acos(Math.max(-1, Math.min(1, dotv)));
      }
      if (snap.path === 'onetouch') c.classes.onetouch += 1;
      else c.classes.openplay += 1;
      const seatShot: SeatShot = {
        seed,
        path: snap.path,
        v: snap.v,
        omega: snap.omega,
        theta,
        defDist: snap.defDist,
        closeSpeed: snap.closeSpeed,
        dribbling: snap.dribbling,
        spellTicks: snap.spellTicks,
      };
      c.seat.push(seatShot);
      matchSeat.push(seatShot);
    }
  }
  c.shotsPerMatch.push(shotsThisMatch);
  c.matchSeatByOrder.push(matchSeat);
};

// --- cluster bootstrap of the interruption-exposed SHARE (per candidate, per
// reach model). Cluster unit = match seed (#20). Reports point + 95% CI. ------
const bootstrapShare = (
  aggs: readonly MatchAgg[],
  pick: (m: MatchAgg) => number,
  offset: number,
) => {
  const seat = aggs.reduce((s, m) => s + m.seat, 0);
  const exp = aggs.reduce((s, m) => s + pick(m), 0);
  const point = seat === 0 ? Number.NaN : exp / seat;
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const n = aggs.length;
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let se = 0;
    let ex = 0;
    for (let i = 0; i < n; i++) {
      const m = aggs[rng.int(0, n - 1)];
      se += m.seat;
      ex += pick(m);
    }
    if (se > 0) draws.push(ex / se);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => (draws.length === 0 ? Number.NaN
    : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))]);
  const lower = at(0.025);
  const upper = at(0.975);
  return { count: exp, share: round(point), lower: round(lower), upper: round(upper) };
};

const runExperiment = () => {
  const c = newCensus();
  const classesByBlock: Classes[] = [];
  for (let b = 0; b < BLOCKS; b++) {
    const before = { ...c.classes };
    const seedStart = SEED_START + b * BLOCK_STRIDE;
    for (let k = 0; k < MATCHES_PER_BLOCK; k++) runMatch(seedStart + k, c);
    classesByBlock.push({
      openplay: c.classes.openplay - before.openplay,
      onetouch: c.classes.onetouch - before.onetouch,
      header: c.classes.header - before.header,
      freekick: c.classes.freekick - before.freekick,
      eEnded: c.classes.eEnded - before.eEnded,
      eOwnerswitch: c.classes.eOwnerswitch - before.eOwnerswitch,
      eInjury: c.classes.eInjury - before.eInjury,
      eNonseatNoowner: c.classes.eNonseatNoowner - before.eNonseatNoowner,
    });
  }

  const seat = c.seat;
  const seatN = seat.length;
  const tBar = seatN === 0 ? 0 : mean(seat.map((s) => s.dribbling));

  // --- 2nd pass: per-candidate per-shot arithmetic + per-match aggregates ---
  // (needs t_bar, which is a population quantity — the mean-preserving centering)
  const perCand: Record<CandId, {
    exposedPrimary: number;
    exposedTop: number;
    wValues: number[];
    thetaDecayDeg: number[];
    fullyCancelled: number;
    powerGains: number[];
    noiseDrops: number[];
  }> = {
    FAST: { exposedPrimary: 0, exposedTop: 0, wValues: [], thetaDecayDeg: [], fullyCancelled: 0, powerGains: [], noiseDrops: [] },
    MID: { exposedPrimary: 0, exposedTop: 0, wValues: [], thetaDecayDeg: [], fullyCancelled: 0, powerGains: [], noiseDrops: [] },
    SLOW: { exposedPrimary: 0, exposedTop: 0, wValues: [], thetaDecayDeg: [], fullyCancelled: 0, powerGains: [], noiseDrops: [] },
  };
  const aggs: MatchAgg[] = c.matchSeatByOrder.map((shots, idx) => {
    const agg: MatchAgg = {
      seed: SEED_START + Math.floor(idx / MATCHES_PER_BLOCK) * BLOCK_STRIDE + (idx % MATCHES_PER_BLOCK),
      seat: shots.length,
      expPrimary: { FAST: 0, MID: 0, SLOW: 0 },
      expTop: { FAST: 0, MID: 0, SLOW: 0 },
    };
    for (const s of shots) {
      for (const id of CAND_IDS) {
        const W = wOf(CANDIDATES[id], s.v, s.omega, s.dribbling, tBar);
        const pc = perCand[id];
        pc.wValues.push(W);
        // (iv)(a) interruption exposure: reachable if the straight-line advance
        // closes the def->ball gap to TACKLE_R inside W.
        const reachPrimary = Number.isFinite(s.defDist) && s.defDist - s.closeSpeed * W <= TACKLE_R;
        const reachTop = Number.isFinite(s.defDist) && s.defDist - TOP_SPEED * W <= TACKLE_R;
        if (reachPrimary) { pc.exposedPrimary += 1; agg.expPrimary[id] += 1; }
        if (reachTop) { pc.exposedTop += 1; agg.expTop[id] += 1; }
        // (iv)(b) quality head-room: theta decays at TURN_RATE during the wind-up.
        const thetaW = Math.max(0, s.theta - TURN_RATE * W);
        pc.thetaDecayDeg.push(deg(s.theta - thetaW));
        if (s.theta <= TURN_RATE * W) pc.fullyCancelled += 1;
        const mCommit = misalign(s.theta);
        const mW = misalign(thetaW);
        pc.powerGains.push(orientationPowerMul(mW, s.dribbling) - orientationPowerMul(mCommit, s.dribbling));
        pc.noiseDrops.push(orientationNoiseMul(mCommit, s.dribbling) - orientationNoiseMul(mW, s.dribbling));
      }
    }
    return agg;
  });

  // --- (i) shot population by release path ----------------------------------
  const cl = c.classes;
  const allShots = c.totalShots;
  const pathShare = (n: number) => round(allShots === 0 ? Number.NaN : n / allShots);
  const population = {
    totalShots: allShots,
    perMatch: {
      mean: round(allShots / (BLOCKS * MATCHES_PER_BLOCK), 4),
      p10: round(quantile(c.shotsPerMatch, 0.1), 2),
      p50: round(quantile(c.shotsPerMatch, 0.5), 2),
      p90: round(quantile(c.shotsPerMatch, 0.9), 2),
    },
    byPath: {
      openplay: { count: cl.openplay, share: pathShare(cl.openplay), inSeat: true },
      onetouch: { count: cl.onetouch, share: pathShare(cl.onetouch), inSeat: true },
      header: { count: cl.header, share: pathShare(cl.header), inSeat: false },
      freekick: { count: cl.freekick, share: pathShare(cl.freekick), inSeat: false },
    },
    seatCount: cl.openplay + cl.onetouch,
    seatPerMatch: round((cl.openplay + cl.onetouch) / (BLOCKS * MATCHES_PER_BLOCK), 4),
    seatShareOfAll: round(allShots === 0 ? Number.NaN : (cl.openplay + cl.onetouch) / allShots),
  };

  // --- (ii) body state at commit (v1-seat) ----------------------------------
  const vs = seat.map((s) => s.v);
  const ws = seat.map((s) => s.omega);
  const ths = seat.map((s) => s.theta);
  const bandShare = (fn: (s: SeatShot) => number, band: number) =>
    round(seatN === 0 ? Number.NaN : seat.filter((s) => fn(s) === band).length / seatN);
  const twisted30 = seat.filter((s) => s.theta >= TWIST_30).length;
  const twisted45 = seat.filter((s) => s.theta >= TWIST_45).length;
  const bodyState = {
    speed: { p10: round(quantile(vs, 0.1), 3), p50: round(quantile(vs, 0.5), 3), p90: round(quantile(vs, 0.9), 3) },
    omega: { p10: round(quantile(ws, 0.1), 3), p50: round(quantile(ws, 0.5), 3), p90: round(quantile(ws, 0.9), 3) },
    thetaDeg: { p10: round(deg(quantile(ths, 0.1)), 2), p50: round(deg(quantile(ths, 0.5)), 2), p90: round(deg(quantile(ths, 0.9)), 2) },
    speedBands: { [SPEED_NAMES[0]]: bandShare((s) => speedBand(s.v), 0), [SPEED_NAMES[1]]: bandShare((s) => speedBand(s.v), 1), [SPEED_NAMES[2]]: bandShare((s) => speedBand(s.v), 2) },
    omegaBands: { [OMEGA_NAMES[0]]: bandShare((s) => omegaBand(s.omega), 0), [OMEGA_NAMES[1]]: bandShare((s) => omegaBand(s.omega), 1), [OMEGA_NAMES[2]]: bandShare((s) => omegaBand(s.omega), 2) },
    twisted30: { count: twisted30, share: round(seatN === 0 ? Number.NaN : twisted30 / seatN) },
    twisted45: { count: twisted45, share: round(seatN === 0 ? Number.NaN : twisted45 / seatN) },
    meanDribbling: round(tBar, 4),
    thetaReconstructed: true, // disclosed: body-facing -> freed-ball-velocity (doc §2 (ii))
  };

  // --- (iii) charge-down exposure geometry (v1-seat) ------------------------
  const finiteDef = seat.filter((s) => Number.isFinite(s.defDist));
  const dds = finiteDef.map((s) => s.defDist);
  const css = finiteDef.map((s) => s.closeSpeed);
  const bandCount = (lo: number, hi: number) => finiteDef.filter((s) => s.defDist > lo && s.defDist <= hi).length;
  const bAlready = finiteDef.filter((s) => s.defDist <= TACKLE_R).length;
  const bMid = bandCount(TACKLE_R, 3);
  const bFar = finiteDef.filter((s) => s.defDist > 3).length;
  const within3 = seat.filter((s) => Number.isFinite(s.defDist) && s.defDist <= 3).length;
  const exposureGeometry = {
    finiteDefShots: finiteDef.length,
    distance: { p10: round(quantile(dds, 0.1), 3), p50: round(quantile(dds, 0.5), 3), p90: round(quantile(dds, 0.9), 3) },
    distanceBands: {
      'alreadyEligible<=1.15': { count: bAlready, share: round(seatN === 0 ? Number.NaN : bAlready / seatN) },
      '1.15-3': { count: bMid, share: round(seatN === 0 ? Number.NaN : bMid / seatN) },
      '>3': { count: bFar, share: round(seatN === 0 ? Number.NaN : bFar / seatN) },
    },
    closeSpeed: { p10: round(quantile(css, 0.1), 3), p50: round(quantile(css, 0.5), 3), p90: round(quantile(css, 0.9), 3) },
    within3m: { count: within3, share: round(seatN === 0 ? Number.NaN : within3 / seatN) },
  };

  // --- (iv) counterfactual arithmetic per candidate (NON-BINDING) -----------
  const counterfactual = Object.fromEntries(CAND_IDS.map((id, i) => {
    const pc = perCand[id];
    const primaryCI = bootstrapShare(aggs, (m) => m.expPrimary[id], i * 2);
    const topCI = bootstrapShare(aggs, (m) => m.expTop[id], i * 2 + 1);
    return [id, {
      law: CANDIDATES[id],
      wSeconds: { p10: round(quantile(pc.wValues, 0.1), 4), p50: round(quantile(pc.wValues, 0.5), 4), p90: round(quantile(pc.wValues, 0.9), 4), mean: round(mean(pc.wValues), 4) },
      interruptionExposure: {
        primary: { count: primaryCI.count, share: primaryCI.share, ci: [primaryCI.lower, primaryCI.upper], reachModel: 'current closing speed at commit (PINNED PRIMARY, #48.4)' },
        topSpeedSensitivity: { count: topCI.count, share: topCI.share, ci: [topCI.lower, topCI.upper], reachModel: 'defender top speed 7 m/s toward the ball (SENSITIVITY)' },
      },
      qualityHeadroom: {
        thetaDecayMeanDeg: round(mean(pc.thetaDecayDeg), 3),
        fullyCancelled: { count: pc.fullyCancelled, share: round(seatN === 0 ? Number.NaN : pc.fullyCancelled / seatN) },
        meanPowerMulGainPP: round(100 * mean(pc.powerGains), 4),
        meanNoiseMulDropPP: round(100 * mean(pc.noiseDrops), 4),
      },
    }];
  }));

  // --- spell context (v1-seat) ----------------------------------------------
  const spellS = seat.map((s) => s.spellTicks * DT);
  const spellContext = {
    gainingToCommitSeconds: { p10: round(quantile(spellS, 0.1), 4), p50: round(quantile(spellS, 0.5), 4), p90: round(quantile(spellS, 0.9), 4) },
    medianOwnershipSpellSeconds: 0.33, // #29.2
  };

  // --- gates ----------------------------------------------------------------
  let srcClean: boolean;
  let srcDiff: string;
  try {
    srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim();
    srcClean = srcDiff === '';
  } catch {
    srcDiff = 'git-unavailable';
    srcClean = false;
  }

  const classSum = cl.openplay + cl.onetouch + cl.header + cl.freekick
    + cl.eEnded + cl.eOwnerswitch + cl.eInjury + cl.eNonseatNoowner;
  const unexplained = allShots - classSum;

  const floors = {
    fShotSeat: { population: population.seatCount, floor: F_SHOT_SEAT, pass: population.seatCount >= F_SHOT_SEAT },
    fShotExposed: {
      population: perCand.FAST.exposedPrimary, floor: F_SHOT_EXPOSED, pass: perCand.FAST.exposedPrimary >= F_SHOT_EXPOSED,
      basis: 'FAST candidate, PRIMARY (current-closing) reach model — the BINDING gate (doc §3)',
    },
    fTwisted: { population: twisted30, floor: F_TWISTED, pass: twisted30 >= F_TWISTED },
  };

  const gates = {
    xSrc: srcClean,
    xFp: true, // asserted: nothing armed (doc §3 X-FP; baseline 57b0bdab…c673)
    xOverlap: true, // vacuous: no prior instrument reads body state / def-to-ball geometry / release timing at the shot COMMIT (doc §3)
    xClassify: unexplained === 0 && cl.eNonseatNoowner === 0 && classSum === allShots,
    fShotSeat: floors.fShotSeat.pass,
    fShotExposed: floors.fShotExposed.pass,
    fTwisted: floors.fTwisted.pass,
  };

  return {
    experiment: 'C7-T0 (shot-release census)',
    authority: 'C7-T0-SHOT-RELEASE (ruling #55, run authorized)',
    parameters: {
      seedStart: SEED_START,
      blocks: BLOCKS,
      matchesPerBlock: MATCHES_PER_BLOCK,
      matches: BLOCKS * MATCHES_PER_BLOCK,
      seedFormula: '6,700,000 + b*100,000 + k, b in 0..4, k in 0..99 (#46.2 disjoint above the 6.6M smoke)',
      clusterUnit: 'match seed (disjoint per block)',
      bootstrapSeed: BOOTSTRAP_SEED,
      bootstrapResamples: BOOTSTRAP_RESAMPLES,
      bandEdges: { speed: [SPEED_LO, SPEED_HI], omega: [OMEGA_LO, OMEGA_HI], tackleRadius: TACKLE_R, twistDeg: [30, 45] },
      reachModels: { primary: 'current closing speed at commit (#48.4)', sensitivity: `top speed ${TOP_SPEED} m/s` },
      candidates: CANDIDATES,
      vRef: V_REF,
      turnRate: TURN_RATE,
      dt: DT,
    },
    coverage: { totalSteps: c.totalSteps, totalShots: allShots, seatShots: seatN, srcDiff },
    classes: { ...cl, sum: classSum, unexplained },
    classesByBlock,
    receipts: {
      caps: RECEIPT_CAP,
      counts: Object.fromEntries(Object.entries(c.receipts).map(([k, v]) => [k, v.length])),
      records: c.receipts,
    },
    floors,
    population,
    bodyState,
    exposureGeometry,
    counterfactual,
    spellContext,
    gates,
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const canonical = (v: unknown): string => JSON.stringify(v);
const first = runExperiment();
const second = runExperiment();
const deterministic = canonical(first) === canonical(second);
const tableSha = createHash('sha256').update(canonical({
  population: first.population, bodyState: first.bodyState,
  exposureGeometry: first.exposureGeometry, counterfactual: first.counterfactual,
  spellContext: first.spellContext,
})).digest('hex');
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');

const gates = { ...first.gates, xDet: deterministic };
const output = {
  ...first,
  gates,
  tableSha,
  sha256,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};

writeFileSync('docs/world-model/data/c7-t0-shot-release.json', `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(100 * v).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `C7-T0 ${output.verdict}`
  + ` · steps ${first.coverage.totalSteps} shots ${first.coverage.totalShots} seat ${first.coverage.seatShots}`
  + ` · F-SHOT-SEAT ${first.floors.fShotSeat.population}/${F_SHOT_SEAT} ${first.floors.fShotSeat.pass}`
  + ` · F-SHOT-EXPOSED ${first.floors.fShotExposed.population}/${F_SHOT_EXPOSED} ${first.floors.fShotExposed.pass}`
  + ` · F-TWISTED ${first.floors.fTwisted.population}/${F_TWISTED} ${first.floors.fTwisted.pass}`
  + ` · unexplained ${first.classes.unexplained} · eNonseat ${first.classes.eNonseatNoowner}`
  + ` · exposure ` + CAND_IDS.map((id) => {
    const cf = (first.counterfactual as Record<string, { interruptionExposure: { primary: { share: number; count: number }; topSpeedSensitivity: { share: number } }; qualityHeadroom: { meanPowerMulGainPP: number; meanNoiseMulDropPP: number } }>)[id];
    return `${id}: prim ${pct(cf.interruptionExposure.primary.share)}(${cf.interruptionExposure.primary.count}) top ${pct(cf.interruptionExposure.topSpeedSensitivity.share)} pow +${cf.qualityHeadroom.meanPowerMulGainPP}pp noise -${cf.qualityHeadroom.meanNoiseMulDropPP}pp`;
  }).join(' | ')
  + ` · det ${deterministic} · tableSHA ${tableSha} · SHA ${sha256}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
