// C6 T0 — THE CARRY-GEOMETRY CENSUS (read-only, observational).
//
// Authority: docs/world-model/C6-T0-CARRY-GEOMETRY.md (FROZEN pre-registration)
// + commander ruling #46 (PASS as amended) + amendment #46.2 (smoke/census seed
// disjointness: the census staging shifts one stride up to 4,100,000).
//
// This is the AUTHORIZED run of the frozen instrument. It steps UNMODIFIED
// matches and reads state — it does not fork the world, force any behaviour, or
// touch any flag. The glue is the shipped glue throughout. Zero src/** changes.
// Nothing armed. It prices GEOMETRY, not value (contract §9).
//
// The four census deliverables (doc §2), implemented EXACTLY to the frozen spec:
//   (i)   carry-state population over the 27 speed x turn-rate x pressure cells,
//         with action.type as a reported 4th axis;
//   (ii)  the turn-episode census (sweep >= 90 deg): count, duration, and
//         tackle-eligibility during OR in the 0.5 s (30-tick) post-window;
//   (iii) the exposure instrument: tackle-eligibility x ball-defender geometry,
//         with the frozen dot-sign side rule and the two distance bands;
//   (iv)  counterfactual geometry sizing (pure arithmetic on recorded states)
//         for the three registered candidates A/B/C: far-side-share shift with
//         its match-seed cluster CI, and the kick-origin displacement dist.
//
// Gates (doc §3): X-SRC, X-FP (asserted), X-DET (byte-identical twice + SHA),
// X-OVERLAP (vacuous, reason recorded), X-CLASSIFY (unexplained == 0), and the
// population floors F-CARRY / F-TURN / F-TURN-EXPOSED / F-EXPOSURE.
//
// Band edges are DERIVED from named code constants, not invented (doc §2 (i)):
//   speed:     the 2.5 m/s de-glue gate (Match.ts:1420); 5.0 = 2x the gate.
//   turn-rate: TURN_RATE = 6.5 rad/s (Player.ts:17); edges 0.1x and 0.5x it.
//   pressure:  TOUCH_CONTROL_DIST = 4.2 m (constants.ts:315); half = 2.1 m.
//   tackle:    the 1.15 m ball-keyed tackle radius (mechanics.ts:1757).
//
// Output: docs/world-model/data/c6-t0-carry-geometry.json

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { dist, dot, fromAngle, len } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

// --- staging (doc §4, as amended by #46.2) -----------------------------------
const SEED_START = 4_100_000; // amendment #46.2: one stride above the 4.0M smoke
const BLOCK_STRIDE = 100_000;
const BLOCKS = 6; // b in 0..5
const MATCHES_PER_BLOCK = 100; // k in 0..99 -> 600 matches, 4.1M-4.7M
const BOOTSTRAP_SEED = 46037;
const BOOTSTRAP_RESAMPLES = 2000;

// --- frozen band edges (doc §2 (i)) ------------------------------------------
const SPEED_LO = 2.5; // the de-glue speed gate
const SPEED_HI = 5.0; // 2x the gate
const OMEGA_LO = 0.1 * TURN_RATE; // 0.65 rad/s: essentially straight
const OMEGA_HI = 0.5 * TURN_RATE; // 3.25 rad/s: hard turn (>= half the cap)
const PRESS_TIGHT = 0.5 * TOUCH_CONTROL_DIST; // 2.1 m
const PRESS_GLUE = TOUCH_CONTROL_DIST; // 4.2 m (the space gate)
const TACKLE_R = 1.15; // ball-keyed tackle radius (mechanics.ts:1757)
const DIST_INNER = 0.58; // half the tackle radius (doc §2 (iii))
const SWEEP_THRESHOLD = Math.PI / 2; // 90 deg turn episode
const POST_WINDOW_TICKS = 30; // 0.5 s window after an episode ends (frozen)

// --- floors (doc §3) ---------------------------------------------------------
const F_CARRY = 800_000;
const F_TURN = 1_800;
const F_TURN_EXPOSED = 700;
const F_EXPOSURE = 4_000;
const CELL_FLOOR = 150; // per (distance x side) exposure cell (SE <= 3pp)

// --- glue geometry (doc §2 (iii), §7: carry = 0.85, confirmed @ HEAD) --------
const CARRY = 0.85;
const TOP_SPEED_REF = 7; // candidate B's role top-speed reference (doc §5)

const SPEED_NAMES = ['walk<=2.5', 'jog2.5-5', 'sprint>5'] as const;
const OMEGA_NAMES = ['straight<0.65', 'moderate0.65-3.25', 'hard>=3.25'] as const;
const PRESS_NAMES = ['tight<=2.1', 'pressured2.1-4.2', 'free>4.2'] as const;

const speedBand = (v: number): number => (v <= SPEED_LO ? 0 : v <= SPEED_HI ? 1 : 2);
const omegaBand = (w: number): number => (w < OMEGA_LO ? 0 : w < OMEGA_HI ? 1 : 2);
const pressBand = (d: number): number => (d <= PRESS_TIGHT ? 0 : d <= PRESS_GLUE ? 1 : 2);
const cellKey = (sb: number, ob: number, pb: number): string => `${sb}|${ob}|${pb}`;
const cellLabel = (k: string): string => {
  const [sb, ob, pb] = k.split('|').map(Number);
  return `${SPEED_NAMES[sb]} / ${OMEGA_NAMES[ob]} / ${PRESS_NAMES[pb]}`;
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
const arrayMax = (xs: readonly number[]): number => {
  if (xs.length === 0) return Number.NaN;
  let m = xs[0];
  for (let i = 1; i < xs.length; i++) if (xs[i] > m) m = xs[i];
  return m;
};
const quantile = (values: readonly number[], p: number): number => {
  if (values.length === 0) return Number.NaN;
  const s = [...values].sort((a, b) => a - b);
  const i = (s.length - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (i - lo);
};

// Signed heading change between two unit heading vectors (rad, (-pi, pi]).
const headingDelta = (
  prev: { x: number; y: number },
  cur: { x: number; y: number },
): number => {
  const a0 = Math.atan2(prev.y, prev.x);
  const a1 = Math.atan2(cur.y, cur.x);
  let d = a1 - a0;
  while (d > Math.PI) d -= 2 * Math.PI;
  while (d < -Math.PI) d += 2 * Math.PI;
  return d;
};

// --- candidate laws (doc §5, non-binding sizing devices) ---------------------
// Each returns the counterfactual (carryLen, thetaBall) at a recorded state.
// noise is excluded (zero-mean, doc §5). thetaBall lag reads the body's own
// recorded heading history back tau seconds (pure arithmetic on recorded
// states, never re-simulation).
const TAU_B_TICKS = Math.round(0.18 / DT); // 11 ticks
const TAU_C_TICKS = Math.round(0.30 / DT); // 18 ticks

interface CandGeom {
  carryLen: number;
  theta: number;
}
// A — MAGNITUDE-ONLY tuck, no lag.
const candA = (v: number, omega: number, thetaNow: number): CandGeom => ({
  carryLen: CARRY - 0.35 * Math.min(omega / TURN_RATE, 1),
  theta: thetaNow,
});
// B — MODERATE tuck + MEDIUM lag + speed growth (the "combined" shape).
const candB = (v: number, omega: number, thetaLagB: number): CandGeom => ({
  carryLen: Math.min(
    1.4,
    Math.max(0.3, 0.55 + 0.15 * (v / TOP_SPEED_REF) - 0.3 * (omega / TURN_RATE)),
  ),
  theta: thetaLagB,
});
// C — LAG-ONLY, magnitude held.
const candC = (v: number, omega: number, thetaLagC: number): CandGeom => ({
  carryLen: CARRY,
  theta: thetaLagC,
});
const CAND_IDS = ['A', 'B', 'C'] as const;
type CandId = (typeof CAND_IDS)[number];

// --- standing exception classes (doc §3, #38.1) ------------------------------
interface Ledger {
  ePaused: number;
  eGk: number;
  eGkHold: number;
  eRestart: number;
  eSentOff: number;
  eNoOwner: number;
  eEnded: number;
  classified: number; // owned-outfield-playing ticks mapped to a band cell
  unexplained: number; // MUST be 0
}
const newLedger = (): Ledger => ({
  ePaused: 0, eGk: 0, eGkHold: 0, eRestart: 0, eSentOff: 0,
  eNoOwner: 0, eEnded: 0, classified: 0, unexplained: 0,
});
const addLedger = (a: Ledger, b: Ledger): void => {
  a.ePaused += b.ePaused; a.eGk += b.eGk; a.eGkHold += b.eGkHold;
  a.eRestart += b.eRestart; a.eSentOff += b.eSentOff; a.eNoOwner += b.eNoOwner;
  a.eEnded += b.eEnded; a.classified += b.classified; a.unexplained += b.unexplained;
};

// --- per-match aggregates (cluster unit = match seed, doc §3 / #20) ----------
interface MatchAgg {
  seed: number;
  // exposure baseline (instrument iii)
  baseElig: number;
  baseFar: number;
  // counterfactual (iv): recomputed eligibility + far-side per candidate
  candElig: Record<CandId, number>;
  candFar: Record<CandId, number>;
}

// --- the full census accumulator ---------------------------------------------
interface Census {
  totalSteps: number;
  ownedTicks: number;
  ledger: Ledger;
  // (i) 27 band cells: count + action-type breakdown
  cellCount: Map<string, number>;
  cellAction: Map<string, Map<string, number>>;
  actionCount: Map<string, number>;
  pressuredTicks: number; // nearOpp <= 4.2
  tightTicks: number; // nearOpp <= 2.1
  // (ii) turn episodes
  episodesPerMatch: number[];
  episodeDurations: number[]; // ticks
  episodesDuring: number;
  episodesAfter: number;
  episodesExposed: number; // during OR after
  // (iii) exposure instrument: 2 dist bands x 2 sides + left/right split
  eligTicks: number;
  expCells: Map<string, number>; // key `${distBand}|${side}`
  leftTicks: number; // cross(ballOffset, defVec) > 0
  rightTicks: number; // cross < 0
  onAxisTicks: number; // cross == 0
  // (iv) kick-origin displacement distributions per candidate
  kickDisp: Record<CandId, number[]>;
  candLagFallback: number; // reported: ticks where lag history was too short
  // per-match records for the cluster bootstrap
  matches: MatchAgg[];
}

const newCensus = (): Census => ({
  totalSteps: 0,
  ownedTicks: 0,
  ledger: newLedger(),
  cellCount: new Map(),
  cellAction: new Map(),
  actionCount: new Map(),
  pressuredTicks: 0,
  tightTicks: 0,
  episodesPerMatch: [],
  episodeDurations: [],
  episodesDuring: 0,
  episodesAfter: 0,
  episodesExposed: 0,
  eligTicks: 0,
  expCells: new Map(),
  leftTicks: 0,
  rightTicks: 0,
  onAxisTicks: 0,
  kickDisp: { A: [], B: [], C: [] },
  candLagFallback: 0,
  matches: [],
});

// Per-owner running turn-episode tracker (reset when ownership changes).
interface Carry {
  gid: number;
  prevHeading: { x: number; y: number };
  sweepAccum: number;
  inEpisode: boolean;
  episodeTackleDuring: boolean;
  episodeStartTick: number;
  postWindowFor: number;
  postTackleSeen: boolean;
  postPending: boolean;
  lastEpisodeDuring: boolean;
}

const runMatch = (seed: number, c: Census): void => {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
  });

  const agg: MatchAgg = {
    seed,
    baseElig: 0,
    baseFar: 0,
    candElig: { A: 0, B: 0, C: 0 },
    candFar: { A: 0, B: 0, C: 0 },
  };

  // Per-player heading-angle history (post-step), for the lag candidates.
  // Indexed [gid][stepIndex]; a body's own recorded heading back tau seconds.
  const headHist: number[][] = Array.from({ length: TEAM_SIZE * 2 }, () => []);
  let stepIndex = -1;

  let episodesThisMatch = 0;
  let carry: Carry | null = null;

  const closePost = (cc: Carry): void => {
    if (cc.postPending) {
      if (cc.postTackleSeen) c.episodesAfter += 1;
      if (cc.lastEpisodeDuring || cc.postTackleSeen) c.episodesExposed += 1;
      cc.postPending = false;
      cc.postTackleSeen = false;
      cc.postWindowFor = 0;
      cc.lastEpisodeDuring = false;
    }
  };

  while (!match.finished) {
    match.step(DT);
    c.totalSteps += 1;
    stepIndex += 1;

    // record every player's post-step heading angle for the lag lookback
    for (const p of match.allPlayers) {
      headHist[p.gid].push(Math.atan2(p.heading.y, p.heading.x));
    }

    const owner = match.ball.owner;
    const playing = match.phase === 'playing';

    // --- classification (exactly one class per step; unexplained must be 0) --
    if (match.finished) {
      c.ledger.eEnded += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }
    if (!playing) {
      c.ledger.ePaused += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }
    if (owner === null) {
      c.ledger.eNoOwner += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }
    if (owner.sentOff) {
      c.ledger.eSentOff += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }
    if (owner.role === 'GK' && (owner.gkHoldTimer > 0 || owner.gkDistributing)) {
      c.ledger.eGkHold += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }
    if (owner.role === 'GK') {
      c.ledger.eGk += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }
    if (match.restartKickGid === owner.gid) {
      c.ledger.eRestart += 1;
      if (carry) { closePost(carry); carry = null; }
      continue;
    }

    // --- OWNED, PLAYING, OUTFIELD tick -------------------------------------
    c.ownedTicks += 1;

    if (!carry || carry.gid !== owner.gid) {
      if (carry) closePost(carry);
      carry = {
        gid: owner.gid,
        prevHeading: { x: owner.heading.x, y: owner.heading.y },
        sweepAccum: 0,
        inEpisode: false,
        episodeTackleDuring: false,
        episodeStartTick: match.simTick,
        postWindowFor: 0,
        postTackleSeen: false,
        postPending: false,
        lastEpisodeDuring: false,
      };
    }

    const v = len(owner.vel);
    const dHead = headingDelta(carry.prevHeading, { x: owner.heading.x, y: owner.heading.y });
    const omega = Math.abs(dHead) / DT;
    carry.prevHeading = { x: owner.heading.x, y: owner.heading.y };

    // nearest opponent (body-to-body, matching the de-glue space gate)
    const opps = match.teams[1 - owner.side].players;
    let nearOpp = Infinity;
    for (const q of opps) {
      if (q.sentOff) continue;
      const d = dist(q.pos, owner.pos);
      if (d < nearOpp) nearOpp = d;
    }

    // (i) band cell + action label
    const sb = speedBand(v);
    const ob = omegaBand(omega);
    const pb = pressBand(nearOpp);
    const key = cellKey(sb, ob, pb);
    c.cellCount.set(key, (c.cellCount.get(key) ?? 0) + 1);
    let am = c.cellAction.get(key);
    if (!am) { am = new Map(); c.cellAction.set(key, am); }
    const at = owner.action.type;
    am.set(at, (am.get(at) ?? 0) + 1);
    c.actionCount.set(at, (c.actionCount.get(at) ?? 0) + 1);
    c.ledger.classified += 1;

    if (nearOpp <= PRESS_GLUE) c.pressuredTicks += 1;
    if (nearOpp <= PRESS_TIGHT) c.tightTicks += 1;

    // (iii) exposure instrument: nearest opponent within 1.15 m of the BALL
    const ball = match.ball;
    const offX = ball.pos.x - owner.pos.x; // ballOffset (glue: heading*0.85)
    const offY = ball.pos.y - owner.pos.y;
    let eligible = false;
    let nearestDist = Infinity;
    let nearestDefX = 0;
    let nearestDefY = 0;
    for (const q of opps) {
      if (q.sentOff) continue;
      const db = dist(q.pos, ball.pos);
      if (db < TACKLE_R && db < nearestDist) {
        eligible = true;
        nearestDist = db;
        nearestDefX = q.pos.x - owner.pos.x; // defVec
        nearestDefY = q.pos.y - owner.pos.y;
      }
    }
    if (eligible) {
      c.eligTicks += 1;
      agg.baseElig += 1;
      const distBand = nearestDist <= DIST_INNER ? 'inner' : 'outer';
      const dotSign = nearestDefX * offX + nearestDefY * offY; // dot(defVec, ballOffset)
      const side = dotSign >= 0 ? 'exposed' : 'far';
      if (side === 'far') agg.baseFar += 1;
      const ek = `${distBand}|${side}`;
      c.expCells.set(ek, (c.expCells.get(ek) ?? 0) + 1);
      const cross = offX * nearestDefY - offY * nearestDefX; // cross(ballOffset, defVec)
      if (cross > 0) c.leftTicks += 1;
      else if (cross < 0) c.rightTicks += 1;
      else c.onAxisTicks += 1;
    }

    // (iv) counterfactual geometry sizing — pure arithmetic on recorded state.
    const thetaNow = headHist[owner.gid][stepIndex];
    const idxB = stepIndex - TAU_B_TICKS;
    const idxC = stepIndex - TAU_C_TICKS;
    const thetaB = idxB >= 0 ? headHist[owner.gid][idxB] : (c.candLagFallback++, thetaNow);
    const thetaC = idxC >= 0 ? headHist[owner.gid][idxC] : thetaNow;
    const geoms: Record<CandId, CandGeom> = {
      A: candA(v, omega, thetaNow),
      B: candB(v, omega, thetaB),
      C: candC(v, omega, thetaC),
    };
    for (const id of CAND_IDS) {
      const g = geoms[id];
      const off = fromAngle(g.theta, g.carryLen);
      const nbx = owner.pos.x + off.x;
      const nby = owner.pos.y + off.y;
      // kick-origin displacement vs the recorded (glue) ball position
      c.kickDisp[id].push(Math.hypot(nbx - ball.pos.x, nby - ball.pos.y));
      // recomputed eligibility + far-side under the candidate ball
      let elig2 = false;
      let nd2 = Infinity;
      let dx2 = 0;
      let dy2 = 0;
      for (const q of opps) {
        if (q.sentOff) continue;
        const db = Math.hypot(q.pos.x - nbx, q.pos.y - nby);
        if (db < TACKLE_R && db < nd2) {
          elig2 = true;
          nd2 = db;
          dx2 = q.pos.x - owner.pos.x;
          dy2 = q.pos.y - owner.pos.y;
        }
      }
      if (elig2) {
        agg.candElig[id] += 1;
        const nOffX = nbx - owner.pos.x;
        const nOffY = nby - owner.pos.y;
        if (dx2 * nOffX + dy2 * nOffY < 0) agg.candFar[id] += 1; // far side
      }
    }

    // (ii) turn-episode detection (accumulate signed sweep; sign flip resets)
    if (carry.sweepAccum !== 0 && Math.sign(dHead) !== Math.sign(carry.sweepAccum) && dHead !== 0) {
      carry.sweepAccum = dHead;
    } else {
      carry.sweepAccum += dHead;
    }
    if (!carry.inEpisode && Math.abs(carry.sweepAccum) >= SWEEP_THRESHOLD) {
      carry.inEpisode = true;
      carry.episodeTackleDuring = false;
      carry.episodeStartTick = match.simTick;
    }
    if (carry.inEpisode) {
      if (eligible) carry.episodeTackleDuring = true;
      if (omega < OMEGA_LO) {
        episodesThisMatch += 1;
        c.episodeDurations.push(match.simTick - carry.episodeStartTick + 1);
        if (carry.episodeTackleDuring) c.episodesDuring += 1;
        closePost(carry);
        carry.inEpisode = false;
        carry.sweepAccum = 0;
        carry.postWindowFor = POST_WINDOW_TICKS;
        carry.postPending = true;
        carry.postTackleSeen = false;
        carry.lastEpisodeDuring = carry.episodeTackleDuring;
      }
    } else if (carry.postWindowFor > 0) {
      if (eligible) carry.postTackleSeen = true;
      carry.postWindowFor -= 1;
      if (carry.postWindowFor === 0) closePost(carry);
    }
  }

  if (carry) closePost(carry);
  c.episodesPerMatch.push(episodesThisMatch);
  c.matches.push(agg);
};

// --- cluster bootstrap of the far-side-share SHIFT (candidate - baseline) ----
// Cluster unit = match seed (doc §3 / #20). A shift is RESOLVED only when its
// match-seed cluster-bootstrap CI excludes zero.
const bootstrapShift = (matches: readonly MatchAgg[], id: CandId, offset: number) => {
  const baseElig = matches.reduce((s, m) => s + m.baseElig, 0);
  const baseFar = matches.reduce((s, m) => s + m.baseFar, 0);
  const candElig = matches.reduce((s, m) => s + m.candElig[id], 0);
  const candFar = matches.reduce((s, m) => s + m.candFar[id], 0);
  const baseShare = baseElig === 0 ? Number.NaN : baseFar / baseElig;
  const candShare = candElig === 0 ? Number.NaN : candFar / candElig;
  const point = candShare - baseShare;

  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const n = matches.length;
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let be = 0;
    let bf = 0;
    let ce = 0;
    let cf = 0;
    for (let i = 0; i < n; i++) {
      const m = matches[rng.int(0, n - 1)];
      be += m.baseElig; bf += m.baseFar; ce += m.candElig[id]; cf += m.candFar[id];
    }
    if (be > 0 && ce > 0) draws.push(cf / ce - bf / be);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => (draws.length === 0 ? Number.NaN
    : draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))]);
  const lower = at(0.025);
  const upper = at(0.975);
  return {
    baseShare: round(baseShare),
    candShare: round(candShare),
    shift: round(point),
    lower: round(lower),
    upper: round(upper),
    resolved: Number.isFinite(lower) && Number.isFinite(upper) && (lower > 0 || upper < 0),
    candEligN: candElig,
  };
};

const runExperiment = () => {
  const c = newCensus();
  const ledgerByBlock: Ledger[] = [];
  for (let b = 0; b < BLOCKS; b++) {
    const before = { ...c.ledger };
    const seedStart = SEED_START + b * BLOCK_STRIDE;
    for (let k = 0; k < MATCHES_PER_BLOCK; k++) runMatch(seedStart + k, c);
    ledgerByBlock.push({
      ePaused: c.ledger.ePaused - before.ePaused,
      eGk: c.ledger.eGk - before.eGk,
      eGkHold: c.ledger.eGkHold - before.eGkHold,
      eRestart: c.ledger.eRestart - before.eRestart,
      eSentOff: c.ledger.eSentOff - before.eSentOff,
      eNoOwner: c.ledger.eNoOwner - before.eNoOwner,
      eEnded: c.ledger.eEnded - before.eEnded,
      classified: c.ledger.classified - before.classified,
      unexplained: c.ledger.unexplained - before.unexplained,
    });
  }

  // --- (i) the 27-cell carry-state table -----------------------------------
  const cellKeys: string[] = [];
  for (let sb = 0; sb < 3; sb++) for (let ob = 0; ob < 3; ob++) for (let pb = 0; pb < 3; pb++) cellKeys.push(cellKey(sb, ob, pb));
  const cells = cellKeys.map((k) => {
    const count = c.cellCount.get(k) ?? 0;
    const am = c.cellAction.get(k) ?? new Map<string, number>();
    const actions = Object.fromEntries(
      [...am.entries()].sort((a, b) => b[1] - a[1]).map(([t, n]) => [t, n]),
    );
    return {
      cell: k,
      label: cellLabel(k),
      count,
      share: round(c.ownedTicks === 0 ? Number.NaN : count / c.ownedTicks),
      actions,
    };
  }).sort((a, b) => b.count - a.count);
  const cellsPopulated = cells.filter((x) => x.count > 0).length;

  const actionLabels = Object.fromEntries(
    [...c.actionCount.entries()].sort((a, b) => b[1] - a[1])
      .map(([t, n]) => [t, { count: n, share: round(n / c.ownedTicks) }]),
  );

  // --- (ii) turn-episode distributions -------------------------------------
  const totalEpisodes = c.episodeDurations.length;
  const turn = {
    totalEpisodes,
    perMatch: {
      mean: round(totalEpisodes / (BLOCKS * MATCHES_PER_BLOCK), 4),
      p10: round(quantile(c.episodesPerMatch, 0.1), 2),
      p50: round(quantile(c.episodesPerMatch, 0.5), 2),
      p90: round(quantile(c.episodesPerMatch, 0.9), 2),
    },
    durationTicks: {
      p10: round(quantile(c.episodeDurations, 0.1), 2),
      p50: round(quantile(c.episodeDurations, 0.5), 2),
      p90: round(quantile(c.episodeDurations, 0.9), 2),
    },
    durationSeconds: {
      p50: round(quantile(c.episodeDurations, 0.5) * DT, 4),
      p90: round(quantile(c.episodeDurations, 0.9) * DT, 4),
    },
    tackleDuring: c.episodesDuring,
    tackleDuringShare: round(totalEpisodes === 0 ? Number.NaN : c.episodesDuring / totalEpisodes),
    tackleAfter: c.episodesAfter,
    tackleAfterShare: round(totalEpisodes === 0 ? Number.NaN : c.episodesAfter / totalEpisodes),
    exposedDuringOrAfter: c.episodesExposed,
    exposedShare: round(totalEpisodes === 0 ? Number.NaN : c.episodesExposed / totalEpisodes),
  };

  // --- (iii) the exposure baseline -----------------------------------------
  const expBands = ['inner', 'outer'] as const;
  const expSides = ['exposed', 'far'] as const;
  const exposureCells = expBands.flatMap((band) => expSides.map((side) => {
    const n = c.expCells.get(`${band}|${side}`) ?? 0;
    return {
      cell: `${band}|${side}`,
      distanceBand: band === 'inner' ? '<=0.58' : '0.58-1.15',
      side,
      count: n,
      shareOfEligible: round(c.eligTicks === 0 ? Number.NaN : n / c.eligTicks),
      underPowered: n < CELL_FLOOR,
    };
  }));
  const farCount = (c.expCells.get('inner|far') ?? 0) + (c.expCells.get('outer|far') ?? 0);
  const exposure = {
    eligibleTicks: c.eligTicks,
    eligibleShareOfOwned: round(c.ownedTicks === 0 ? Number.NaN : c.eligTicks / c.ownedTicks),
    exposedShare: round(c.eligTicks === 0 ? Number.NaN : (c.eligTicks - farCount) / c.eligTicks),
    farSideShare: round(c.eligTicks === 0 ? Number.NaN : farCount / c.eligTicks),
    farSideCount: farCount,
    cells: exposureCells,
    lateral: {
      left: c.leftTicks,
      right: c.rightTicks,
      onAxis: c.onAxisTicks,
    },
  };

  // --- (iv) counterfactual sizing ------------------------------------------
  const counterfactual = Object.fromEntries(CAND_IDS.map((id, i) => {
    const shift = bootstrapShift(c.matches, id, i);
    const disp = c.kickDisp[id];
    return [id, {
      baselineFarSideShare: shift.baseShare,
      candidateFarSideShare: shift.candShare,
      farSideShift: shift.shift,
      shiftCI: [shift.lower, shift.upper],
      resolved: shift.resolved,
      recomputedEligibleTicks: shift.candEligN,
      kickDisplacement: {
        p50: round(quantile(disp, 0.5), 5),
        p90: round(quantile(disp, 0.9), 5),
        max: round(arrayMax(disp), 5),
      },
    }];
  }));

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

  const ledgerTotal = c.ledger.ePaused + c.ledger.eGk + c.ledger.eGkHold
    + c.ledger.eRestart + c.ledger.eSentOff + c.ledger.eNoOwner + c.ledger.eEnded
    + c.ledger.classified + c.ledger.unexplained;
  // The per-(distance x side) 150 floor is a LABEL (doc §3 F-EXPOSURE: "a cell
  // below it is labelled UNDER-POWERED, never pooled away"), NOT a gate. It is
  // reported per cell via `underPowered`; the degenerate far-side baseline
  // (reading §8(b)) is expected to sit below it and must never fail the run.
  const underPoweredExposureCells = exposureCells.filter((x) => x.underPowered).map((x) => x.cell);

  const floors = {
    fCarry: { population: c.ownedTicks, floor: F_CARRY, pass: c.ownedTicks >= F_CARRY },
    fTurn: { population: totalEpisodes, floor: F_TURN, pass: totalEpisodes >= F_TURN },
    fTurnExposed: { population: c.episodesExposed, floor: F_TURN_EXPOSED, pass: c.episodesExposed >= F_TURN_EXPOSED },
    fExposure: { population: c.eligTicks, floor: F_EXPOSURE, pass: c.eligTicks >= F_EXPOSURE },
  };

  const gates = {
    xSrc: srcClean,
    xFp: true, // asserted: nothing armed (doc §3 X-FP)
    xOverlap: true, // vacuous: no prior instrument measures this object (doc §3)
    xClassify: c.ledger.unexplained === 0 && ledgerTotal === c.totalSteps && c.ledger.classified === c.ownedTicks,
    fCarry: floors.fCarry.pass,
    fTurn: floors.fTurn.pass,
    fTurnExposed: floors.fTurnExposed.pass,
    fExposure: floors.fExposure.pass,
  };

  return {
    experiment: 'C6-T0 (carry-geometry census)',
    authority: 'C6-T0-CARRY-GEOMETRY (ruling #46 as amended by #46.2)',
    parameters: {
      seedStart: SEED_START,
      blocks: BLOCKS,
      matchesPerBlock: MATCHES_PER_BLOCK,
      matches: BLOCKS * MATCHES_PER_BLOCK,
      seedFormula: '4,100,000 + b*100,000 + k, b in 0..5, k in 0..99 (amendment #46.2)',
      clusterUnit: 'match seed (disjoint per block)',
      bootstrapSeed: BOOTSTRAP_SEED,
      bootstrapResamples: BOOTSTRAP_RESAMPLES,
      bandEdges: {
        speed: [SPEED_LO, SPEED_HI],
        omega: [OMEGA_LO, OMEGA_HI],
        pressure: [PRESS_TIGHT, PRESS_GLUE],
        tackleRadius: TACKLE_R,
        distInner: DIST_INNER,
      },
      sweepThreshold: SWEEP_THRESHOLD,
      postWindowTicks: POST_WINDOW_TICKS,
      candidates: {
        A: 'MAGNITUDE-ONLY tuck, no lag',
        B: 'MODERATE tuck + MEDIUM lag (tau=0.18s) + speed growth',
        C: 'LAG-ONLY (tau=0.30s), magnitude held',
      },
      tauTicks: { B: TAU_B_TICKS, C: TAU_C_TICKS },
    },
    coverage: {
      totalSteps: c.totalSteps,
      ownedTicks: c.ownedTicks,
      ownedShareOfSteps: round(c.ownedTicks / c.totalSteps),
      cellsPopulated,
      candLagFallbackTicks: c.candLagFallback,
      underPoweredExposureCells,
      cellFloor: CELL_FLOOR,
      srcDiff,
    },
    ledger: { ...c.ledger, total: ledgerTotal },
    ledgerByBlock,
    floors,
    carryState: {
      pressuredTicks: c.pressuredTicks,
      pressuredShare: round(c.pressuredTicks / c.ownedTicks),
      tightTicks: c.tightTicks,
      tightShare: round(c.tightTicks / c.ownedTicks),
      cells,
      actionLabels,
    },
    turn,
    exposure,
    counterfactual,
    gates,
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const canonical = (v: unknown): string => JSON.stringify(v);
const first = runExperiment();
const second = runExperiment();
const deterministic = canonical(first) === canonical(second);
const tableSha = createHash('sha256').update(canonical({
  carryState: first.carryState, turn: first.turn, exposure: first.exposure,
  counterfactual: first.counterfactual,
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

writeFileSync(
  'docs/world-model/data/c6-t0-carry-geometry.json',
  `${JSON.stringify(output, null, 2)}\n`,
);

const pct = (v: number) => `${(100 * v).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `C6-T0 ${output.verdict}`
  + ` · steps ${first.coverage.totalSteps} owned ${first.coverage.ownedTicks} (${pct(first.coverage.ownedShareOfSteps)})`
  + ` · F-CARRY ${first.floors.fCarry.population}/${F_CARRY} ${first.floors.fCarry.pass}`
  + ` · F-TURN ${first.floors.fTurn.population}/${F_TURN} ${first.floors.fTurn.pass}`
  + ` · F-TURN-EXPOSED ${first.floors.fTurnExposed.population}/${F_TURN_EXPOSED} ${first.floors.fTurnExposed.pass}`
  + ` · F-EXPOSURE ${first.floors.fExposure.population}/${F_EXPOSURE} ${first.floors.fExposure.pass}`
  + ` · unexplained ${first.ledger.unexplained}`
  + ` · exposure far-side ${pct(first.exposure.farSideShare)}`
  + ` · cf ` + CAND_IDS.map((id) => {
    const cf = (first.counterfactual as Record<string, { farSideShift: number; resolved: boolean; kickDisplacement: { p50: number; p90: number } }>)[id];
    return `${id}: shift ${cf.farSideShift} res ${cf.resolved} kick p50 ${cf.kickDisplacement.p50}/p90 ${cf.kickDisplacement.p90}`;
  }).join(' | ')
  + ` · det ${deterministic} · tableSHA ${tableSha} · SHA ${sha256}`
  + (failed.length ? ` · FAILED: ${failed.join(',')}` : ''),
);
