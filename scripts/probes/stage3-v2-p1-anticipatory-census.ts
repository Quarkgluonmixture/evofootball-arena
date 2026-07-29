// STAGE III V2-P1 — THE ANTICIPATORY CENSUS
//
// Authority: docs/world-model/STAGE3-V2-P1-ANTICIPATORY-CENSUS.md (the frozen
// spec — the P1R fork-and-force instrument reused VERBATIM, re-keyed on the
// per-candidate TRUE binary OTHERS-GOING bit; 12 v1 contexts × the going bit ×
// 18 candidates = 432 cell-candidate pairs; primary contrast value(going=1) −
// value(going=0) per candidate-context, pooled REPORTED; floors 150 per split
// cell; the X-family verbatim incl. the X6 FORMULA FORM with `unexplained = 0`
// UNCONDITIONAL) · commander rulings #68 (V2-P0 accepted, reading W1) and #69
// (pre-registration PASS; lattice VERBATIM; X6 form frozen; budget FROZEN at the
// full 49,094 moments / 650 matches; build authorized, run supervised).
//
// The INSTRUMENT is STAGE3-P1R-APPROACH-CENSUS §2 verbatim (forcedStationPolicy
// forked at the executor READ, the 18-candidate ball-local lattice, W = 3.0 s,
// the two faces H 6/10 s, the signed outcome, the exception classes, X1–X7 with
// the derived X6). The CELL a priced approach lands in is refined by the TRUE
// OTHERS-GOING bit of the forced candidate, computed on the PRE-FORK clone from
// TRUE world state exactly as STAGE3-V2-P0-WEDGE-MAP §2 (R = 4.0 m, W-advance,
// TRUE velocities). It prices approaches under #41.2 only; nothing ships (Road
// B), the seam is null in every production path, the fingerprint is unchanged.
import { createHash } from 'node:crypto';
import { writeFileSync, appendFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters (the spec §2/§3/§6) -----------------------------------
/** §2.1: P1R §2.3 verbatim — above P0's 1.466 s dwell mean, dominating the
 *  2.66 s median travel, deliberately not the tail (a long approach is priced). */
const W_S = 3.0;
const W_TICKS = Math.round(W_S / DT);
/** §2.5, face-specific. One fork, two read-off points. */
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
/** §2.5: consecutive moments must not be the same football. */
const MOMENT_SPACING_S = 2.0;
/** §2.2: the OTHERS-GOING region radius, FROZEN at V2-P0 §2.1 (not a partition). */
const R_M = 4.0;
/** §2.3 repair 2: the percept warm-up window. Naturally satisfied here — the
 *  sampled body has played the whole live match (≫ 15 ticks) before the decision
 *  moment, so the perceived snapshot read on the pre-fork clone is warm. The
 *  TRUE-keyed table needs no warm-up (TRUE velocities are exact); the window is
 *  pinned and reported for the PERCEIVED cross-check column (V2-P0 §2.3). */
const WARMUP_TICKS = 15;
/** §6: the single contiguous census block, disjoint above the 8.80M smoke. */
const MATCH_DURATION = 240;
const SEED_START = 8_810_000;
const MATCH_CAP = envInt('V2P1_MATCHES', 650);      // §6 cap; env-capped for the smoke
const MOMENT_TARGET = 49_094;                        // §3 the 2×-headroom binding budget
const BOOTSTRAP_RESAMPLES = 2000;                    // #20
const BOOTSTRAP_SEED = 50068;                        // §6 frozen
/** §3: a split cell below this is published UNDER-POWERED, never pooled. */
const CELL_FLOOR = 150;
/** §2.1: "within 2 m of the target" for every arrival mediator (P1R §4.4). */
const ARRIVE_M = 2;
/** §2.1: the saturation arm's agreement band (P1R §4.3). */
const SAT_BAND = 0.05;
/** X6. */
const X6_EPS = 1e-9;
/** §2.4: the DERIVATION RULE is frozen (`1 − 2 × measured clamp share`); the
 *  clamp share is the world's OWN measured input, re-derived at the run. P1R's
 *  0.84 (measured 8.08% clamp share on the shipped world) is the REFERENCE. */
const X6_FLOOR_REF = 0.84;
/** §5 receipts (#49.3): first-N deterministic, per class. */
const RECEIPT_CAP = 1000;
const OUT_PATH = process.env.V2P1_OUT
  ?? 'docs/world-model/data/stage3-v2-p1-anticipatory-census.json';

/** §6 / #67.3: the ENRICHED census world — the full certified bundle, armed on
 *  EVERY arm (the base match and, through cloneSimulationState, every fork). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- the lattice (§2.1 / P1R §2.3): 18 candidates + control ------------------
const RADII = [7, 14, 21] as const;
const ANGLES = [0, 60, 120, 180, 240, 300] as const;
interface Candidate { readonly id: string; readonly dx: number; readonly dy: number }
const LATTICE: Candidate[] = [];
for (const r of RADII) {
  for (const a of ANGLES) {
    const rad = (a * Math.PI) / 180;
    LATTICE.push({
      id: `r${r}a${a}`,
      dx: Number((r * Math.cos(rad)).toFixed(9)),
      dy: Number((r * Math.sin(rad)).toFixed(9)),
    });
  }
}
/** §2.1: the positive control — 21 m BEHIND the ball, away from goal. */
const PC_ID = 'r21a180';
const CONTROL_ID = 'control';

// --- contexts (P1R §3.2, verbatim), frozen and closed ------------------------
type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const contextKey = (f: Face, t: Threat, d: Density): string => `${f}|${t}|${d}`;
const FACES: readonly Face[] = ['ours', 'theirs'];
const THREATS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const DENSITIES: readonly Density[] = ['sparse', 'crowded'];
const CONTEXTS: string[] = [];
for (const f of FACES) for (const t of THREATS) for (const d of DENSITIES) CONTEXTS.push(contextKey(f, t, d));
const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

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

// --- helpers -----------------------------------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);
const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);

// --- per-record receipts (#49.3), capped, first-N deterministic --------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  const arr = book[cls] ?? (book[cls] = []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

// --- standing exception classes (§5, #38.1); eSentOff = E-INJURY family ------
interface Exceptions {
  ePaused: number;
  eCarrier: number;
  eBallWon: number;
  eSentOff: number;      // E-INJURY: the forced body was sent off mid-window
  eOnside: number;
  eBarred: number;
  eEnded: number;
  ok: number;
  unexplained: number;   // the hard fidelity claim: EXACTLY 0 (#32.1), unconditional
  /** REPORTED, never gated (P1R §4.6b diagnostic). */
  reconstructionDiverged: number;
}
const newExceptions = (): Exceptions => ({
  ePaused: 0, eCarrier: 0, eBallWon: 0, eSentOff: 0,
  eOnside: 0, eBarred: 0, eEnded: 0, ok: 0, unexplained: 0,
  reconstructionDiverged: 0,
});
const addExceptions = (a: Exceptions, b: Exceptions): void => {
  a.ePaused += b.ePaused; a.eCarrier += b.eCarrier; a.eBallWon += b.eBallWon;
  a.eSentOff += b.eSentOff; a.eOnside += b.eOnside; a.eBarred += b.eBarred;
  a.eEnded += b.eEnded; a.ok += b.ok; a.unexplained += b.unexplained;
  a.reconstructionDiverged += b.reconstructionDiverged;
};

interface ForkOutcome {
  readonly score: boolean;
  readonly concede: boolean;
  readonly goalFor: boolean;
  readonly goalAgainst: boolean;
  readonly eta: number;
  readonly targetError: number;
  readonly occupancy: number;
  readonly ended: boolean;         // §2.1: a fork ending inside the horizon is EXCLUDED, not zeroed
  readonly signature: string;
}

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

/**
 * Run ONE fork (P1R §2 verbatim). `cand === null` is the CONTROL arm (no policy)
 * — X5's harness gate compares its signature against the base's continuation.
 * `seed`/`decisionTick` thread the receipts (#49.3).
 */
const runFork = (
  before: Match, gid: number, side: number, cand: Candidate | null, x6: Exceptions,
  seed: number, decisionTick: number, receipts: ReceiptBook | null,
): ForkOutcome => {
  const fork = cloneSimulationState(before);
  const body = fork.allPlayers.find((p) => p.gid === gid)!;
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const shots0 = mine.stats.shots;
  const conceded0 = theirs.stats.shots;
  const goals0 = mine.stats.goals;
  const against0 = theirs.stats.goals;
  const startTick = fork.simTick;
  const untilTick = startTick + W_TICKS;

  let score = false;
  let goalFor = false;
  let eta = Number.NaN;
  let insideTicks = 0;
  let errSum = 0;
  let errTicks = 0;
  let ended = false;

  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    const live = cand !== null && fork.simTick + 1 < untilTick;
    let want: { x: number; y: number } | null = null;
    if (live) {
      fork.forcedStationPolicy = { gid, offset: { dx: cand!.dx, dy: cand!.dy }, untilTick };
      want = {
        x: fork.ball.pos.x + mine.attackDir * cand!.dx,
        y: fork.ball.pos.y + cand!.dy,
      };
    } else fork.forcedStationPolicy = null;
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;
    // The clamps are evaluated INSIDE the step, off the PRE-step world — so
    // their classification must be read here, not after (P1R §4.6b).
    const rBefore = fork.restart;
    const barredBefore = (rBefore?.kind === 'goalKick' && rBefore.side !== side)
      || theirs.goalkeeper.gkHoldTimer > 0 || theirs.goalkeeper.gkDistributing;
    const onsideBefore = ownerBefore !== null && ownerBefore.side === side
      && ownerBefore !== body;

    fork.step(DT);

    if (live) {
      const cause = cand!.id;
      const tr = body.c4Trace;
      if (pausedBefore || fork.phase !== 'playing') {
        x6.ePaused += 1;
        if (receipts) addReceipt(receipts, 'ePaused', seed, decisionTick, gid, cause);
      } else if (body.sentOff) {
        x6.eSentOff += 1;                                    // E-INJURY
        if (receipts) addReceipt(receipts, 'eSentOff', seed, decisionTick, gid, cause);
      } else if (ownerBefore === body || fork.ball.owner === body) {
        x6.eCarrier += 1;
        if (receipts) addReceipt(receipts, 'eCarrier', seed, decisionTick, gid, cause);
      } else if (tr === null) {
        if (fork.ball.owner !== null && fork.ball.owner.side !== side) {
          x6.eBallWon += 1;
          if (receipts) addReceipt(receipts, 'eBallWon', seed, decisionTick, gid, cause);
        } else {
          x6.unexplained += 1;
          if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${cause}:noTrace`);
        }
      } else if (
        // X6 compares the applied target against the ENGINE'S OWN policy target
        // (`tr.meet`); the `meet == ball + offset` half is pinned by the unit
        // test. Divergences are still COUNTED (reconstructionDiverged).
        Math.abs(tr.applied.x - tr.meet.x) <= X6_EPS && Math.abs(tr.applied.y - tr.meet.y) <= X6_EPS
      ) {
        x6.ok += 1;
        if (Math.abs(tr.meet.x - want!.x) > X6_EPS || Math.abs(tr.meet.y - want!.y) > X6_EPS) {
          x6.reconstructionDiverged += 1;
        }
        const d = Math.hypot(body.pos.x - tr.meet.x, body.pos.y - tr.meet.y);
        errSum += d;
        errTicks += 1;
        if (d <= ARRIVE_M) {
          insideTicks += 1;
          if (!Number.isFinite(eta)) eta = (fork.simTick - startTick) * DT;
        }
      } else if (barredBefore) {
        x6.eBarred += 1;
        if (receipts) addReceipt(receipts, 'eBarred', seed, decisionTick, gid, cause);
      } else if (onsideBefore) {
        x6.eOnside += 1;
        if (receipts) addReceipt(receipts, 'eOnside', seed, decisionTick, gid, cause);
      } else {
        x6.unexplained += 1;
        if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${cause}:clampMiss`);
      }
    }

    // §2.5: the score face is read AT its horizon and never after.
    if (fork.simTick - startTick === H_SCORE_TICKS) {
      score = mine.stats.shots > shots0;
      goalFor = mine.stats.goals > goals0;
    }
    if (fork.finished) ended = true;
  }
  fork.forcedStationPolicy = null;
  if (fork.simTick - startTick < H_SCORE_TICKS) {
    score = mine.stats.shots > shots0;
    goalFor = mine.stats.goals > goals0;
  }
  if (ended) {
    x6.eEnded += 1;
    if (receipts && cand !== null) addReceipt(receipts, 'eEnded', seed, decisionTick, gid, cand.id);
  }

  return {
    score,
    concede: theirs.stats.shots > conceded0,
    goalFor,
    goalAgainst: theirs.stats.goals > against0,
    eta: Number.isFinite(eta) ? eta : W_S,
    targetError: errTicks === 0 ? Number.NaN : errSum / errTicks,
    occupancy: cand === null ? Number.NaN : insideTicks / W_TICKS,
    ended,
    signature: signatureOf(fork),
  };
};

/** The saturation arm (§2.1 / P1R §4.3): the SAME relative policy on every own outfielder. */
const runSaturated = (
  before: Match, side: number, cand: Candidate,
): { score: boolean; concede: boolean } => {
  const fork = cloneSimulationState(before);
  const mine = fork.teams[side];
  const theirs = fork.teams[1 - side];
  const shots0 = mine.stats.shots;
  const conceded0 = theirs.stats.shots;
  const startTick = fork.simTick;
  const untilTick = startTick + W_TICKS;
  const bodies = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff).map((p) => p.gid);
  let score = false;
  let cursor = 0;
  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    if (fork.simTick + 1 < untilTick && bodies.length > 0) {
      const gid = bodies[cursor % bodies.length];
      cursor += 1;
      fork.forcedStationPolicy = { gid, offset: { dx: cand.dx, dy: cand.dy }, untilTick };
    } else fork.forcedStationPolicy = null;
    fork.step(DT);
    if (fork.simTick - startTick === H_SCORE_TICKS) score = mine.stats.shots > shots0;
  }
  fork.forcedStationPolicy = null;
  if (fork.simTick - startTick < H_SCORE_TICKS) score = mine.stats.shots > shots0;
  return { score, concede: theirs.stats.shots > conceded0 };
};

// --- per-moment record -------------------------------------------------------
interface MomentRow {
  readonly cluster: number;                     // §6: the match seed
  readonly context: string;
  readonly face: Face;
  readonly outcomes: Record<string, ForkOutcome>;  // candidate id → outcome
  readonly trueGoing: Record<string, 0 | 1>;    // §2.2: TRUE OTHERS-GOING bit per candidate (keys the cell)
  readonly percGoing: Record<string, 0 | 1>;    // the PERCEIVED bit (recorded for the wedge cross-check)
  readonly hasPercept: boolean;                 // false ⇒ omitted from the wedge cross-check only
}

/**
 * §2.2: the TRUE (and, for the cross-check, PERCEIVED) OTHERS-GOING bit of each
 * candidate, read on the PRE-FORK clone from TRUE world state — V2-P0 §2 verbatim
 * on the TRUE side (R = 4.0 m, W-advance, TRUE velocities).
 */
const computeGoingBits = (
  clone: Match, side: number, body: Player, gkGid: number,
): { trueGoing: Record<string, 0 | 1>; percGoing: Record<string, 0 | 1>; hasPercept: boolean;
     agree: number; trueCount: number; percCount: number } => {
  const mine = clone.teams[side];
  const ball = clone.ball.pos;
  const teammates = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p.gid !== body.gid);
  // The body's own perceived snapshot — the remembered VELOCITY path (#67.2),
  // naturally warmed (the body has played the whole match ≫ WARMUP_TICKS).
  const snap = clone.perceivedSnapshot(body);
  const hasPercept = snap !== null;
  const perc = new Map<number, { px: number; py: number; vx: number; vy: number }>();
  if (snap !== null) {
    for (const o of snap.players) {
      if (o.side !== body.side || o.gid === body.gid || o.gid === gkGid) continue;
      perc.set(o.gid, { px: o.pos.x, py: o.pos.y, vx: o.vel.x, vy: o.vel.y });
    }
  }
  const trueGoing: Record<string, 0 | 1> = {};
  const percGoing: Record<string, 0 | 1> = {};
  let agree = 0; let trueCount = 0; let percCount = 0;
  for (const cand of LATTICE) {
    const cx = ball.x + mine.attackDir * cand.dx;
    const cy = ball.y + cand.dy;
    let trueBit: 0 | 1 = 0;
    for (const t of teammates) {
      if (dist(t.pos.x + t.vel.x * W_S, t.pos.y + t.vel.y * W_S, cx, cy) <= R_M) { trueBit = 1; break; }
    }
    let percBit: 0 | 1 = 0;
    for (const [, o] of perc) {
      if (dist(o.px + o.vx * W_S, o.py + o.vy * W_S, cx, cy) <= R_M) { percBit = 1; break; }
    }
    trueGoing[cand.id] = trueBit;
    percGoing[cand.id] = percBit;
    if (trueBit === percBit) agree += 1;
    trueCount += trueBit;
    percCount += percBit;
  }
  return { trueGoing, percGoing, hasPercept, agree, trueCount, percCount };
};

interface CensusOut {
  rows: MomentRow[];
  moments: number;
  matchesRun: number;
  ballDirectedSkipped: number;
  noPool: number;
  eNoSnapshot: number;
  clonesTaken: number;
  x5Checked: number;
  x5Mismatched: number;
  x6: Exceptions;
  receipts: ReceiptBook;
  // wedge cross-check accumulators (V2-P0-style, moment-grain)
  wedgeAgree: number;
  wedgePairs: number;
  wedgeTrue: number;
  wedgePerc: number;
}

const runCensus = (withReceipts: boolean): CensusOut => {
  const out: CensusOut = {
    rows: [], moments: 0, matchesRun: 0, ballDirectedSkipped: 0, noPool: 0, eNoSnapshot: 0,
    clonesTaken: 0, x5Checked: 0, x5Mismatched: 0, x6: newExceptions(),
    receipts: {}, wedgeAgree: 0, wedgePairs: 0, wedgeTrue: 0, wedgePerc: 0,
  };
  const receipts = withReceipts ? out.receipts : null;
  let rotation = 0;

  for (let k = 0; k < MATCH_CAP && out.moments < MOMENT_TARGET; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    out.matchesRun += 1;
    let lastMomentTime = -Infinity;
    while (!m.finished && out.moments < MOMENT_TARGET) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }

      // §2.1 / P1R §3.2: FACE dimension needs bodies from BOTH sides; side
      // alternates on the same stable rotation as the body choice.
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { out.noPool += 1; m.step(DT); continue; }
      // §2.1: STABLE ROTATION, never proximity.
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      // §2.1 (#40.4 item 2): STATION-FAMILY ticks only.
      if (!STATION_FAMILY.has(body.action.type)) { out.ballDirectedSkipped += 1; m.step(DT); continue; }

      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
      }
      const face: Face = side === owner!.side ? 'ours' : 'theirs';
      const context = contextKey(face, localXBand(mine.localX(m.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');

      const clone = cloneSimulationState(m);
      out.clonesTaken += 1;
      const decisionTick = m.simTick;
      lastMomentTime = m.simTime;
      out.moments += 1;

      // §2.2: the going bits, on the PRE-FORK clone from TRUE (+ perceived) state.
      const cloneBody = clone.allPlayers.find((p) => p.gid === body.gid)!;
      const gkGid = clone.teams[side].goalkeeper.gid;
      const bits = computeGoingBits(clone, side, cloneBody, gkGid);
      if (!bits.hasPercept) out.eNoSnapshot += 1;
      if (bits.hasPercept) {
        out.wedgeAgree += bits.agree;
        out.wedgePairs += LATTICE.length;
        out.wedgeTrue += bits.trueCount;
        out.wedgePerc += bits.percCount;
      }

      // the forks — P1R verbatim (control + 18 candidates).
      const outcomes: Record<string, ForkOutcome> = {};
      const control = runFork(clone, body.gid, side, null, out.x6, seed, decisionTick, receipts);
      outcomes[CONTROL_ID] = control;
      for (const cand of LATTICE) {
        outcomes[cand.id] = runFork(clone, body.gid, side, cand, out.x6, seed, decisionTick, receipts);
      }

      // X5: the control fork reproduces the base continuation exactly (1-in-25).
      if (out.moments % 25 === 0) {
        const plain = cloneSimulationState(clone);
        for (let i = 0; i < H_CONCEDE_TICKS && !plain.finished; i++) plain.step(DT);
        out.x5Checked += 1;
        if (signatureOf(plain) !== control.signature) out.x5Mismatched += 1;
      }

      out.rows.push({
        cluster: seed, context, face, outcomes,
        trueGoing: bits.trueGoing, percGoing: bits.percGoing, hasPercept: bits.hasPercept,
      });
      if (process.env.V2P1_PROG && out.moments % 20 === 0) { appendFileSync(process.env.V2P1_PROG, `[prog] match ${k} moment ${out.moments} t=${((Date.now() - (globalThis as any).__t0) / 1000).toFixed(1)}s\n`); }
      m.step(DT);
    }
  }
  return out;
};

// --- statistics: paired candidate−control bootstrap (P1R, for PC + gradient) --
const pairedCI = (
  rows: readonly MomentRow[], id: string, offset: number,
): { n: number; point: number; lower: number; upper: number } => {
  const usable = rows.filter((r) => r.outcomes[id] !== undefined
    && !r.outcomes[id].ended && !r.outcomes[CONTROL_ID].ended);
  const byCluster = new Map<number, MomentRow[]>();
  for (const r of usable) {
    const b = byCluster.get(r.cluster) ?? [];
    b.push(r);
    byCluster.set(r.cluster, b);
  }
  const clusters = [...byCluster.values()];
  const diff = (rs: readonly MomentRow[]) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => signed(r.outcomes[id]) - signed(r.outcomes[CONTROL_ID]))));
  const point = diff(usable);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentRow[] = [];
    for (let i = 0; i < clusters.length; i++) {
      for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    }
    const v = diff(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { n: usable.length, point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};

// --- statistics: the PRIMARY going contrast, value(going=1) − value(going=0) --
// Paired at the candidate-context grain (a between-cell contrast within a
// candidate-context), clustered on the match seed. The going=1/going=0 forks are
// DIFFERENT moments, so the contrast is unpaired at the moment grain but the CI
// clusters on the seed (#20). Sufficient statistics per cluster make the
// bootstrap cheap.
interface SplitAgg { s1: number; n1: number; s0: number; n0: number }
const emptyAgg = (): SplitAgg => ({ s1: 0, n1: 0, s0: 0, n0: 0 });
const contrastOf = (a: SplitAgg): number => (
  a.n1 === 0 || a.n0 === 0 ? Number.NaN : a.s1 / a.n1 - a.s0 / a.n0
);

interface CellStat {
  context: string; cand: string;
  n1: number; n0: number; value1: number; value0: number;
  point: number; lower: number; upper: number;
  inPower: boolean;
}

const goingContrasts = (rows: readonly MomentRow[]) => {
  // cluster index
  const clusterIds = [...new Set(rows.map((r) => r.cluster))].sort((a, b) => a - b);
  const clusterIndex = new Map(clusterIds.map((c, i) => [c, i]));
  const C = clusterIds.length;

  // full-data + per-cluster aggregates, one pass, all 432 cells
  const cellOrder: { context: string; cand: string; key: string }[] = [];
  const fullAgg = new Map<string, SplitAgg>();
  const perCluster = new Map<string, SplitAgg[]>();
  const cellKey = (ctx: string, cand: string) => `${ctx}||${cand}`;
  for (const ctx of CONTEXTS) {
    for (const cand of LATTICE) {
      const key = cellKey(ctx, cand.id);
      cellOrder.push({ context: ctx, cand: cand.id, key });
      fullAgg.set(key, emptyAgg());
      perCluster.set(key, Array.from({ length: C }, emptyAgg));
    }
  }
  for (const r of rows) {
    const cj = clusterIndex.get(r.cluster)!;
    for (const cand of LATTICE) {
      const o = r.outcomes[cand.id];
      if (o === undefined || o.ended) continue;
      const key = cellKey(r.context, cand.id);
      const v = signed(o);
      const fa = fullAgg.get(key)!;
      const ca = perCluster.get(key)![cj];
      if (r.trueGoing[cand.id] === 1) { fa.s1 += v; fa.n1 += 1; ca.s1 += v; ca.n1 += 1; }
      else { fa.s0 += v; fa.n0 += 1; ca.s0 += v; ca.n0 += 1; }
    }
  }

  // per-cell stats + in-power set (both split cells ≥ 150 usable forks, §3)
  const perCellFlat: CellStat[] = [];
  const inPowerCells: { context: string; cand: string; key: string; cj: number }[] = [];
  let idx = 0;
  for (const { context, cand, key } of cellOrder) {
    const fa = fullAgg.get(key)!;
    const inPower = fa.n1 >= CELL_FLOOR && fa.n0 >= CELL_FLOOR;
    let point = contrastOf(fa);
    let lower = Number.NaN; let upper = Number.NaN;
    if (inPower) {
      const arr = perCluster.get(key)!;
      const rng = new Rng(BOOTSTRAP_SEED + 2000 + idx);
      const draws: number[] = [];
      for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
        const acc = emptyAgg();
        for (let i = 0; i < C; i++) {
          const a = arr[rng.int(0, C - 1)];
          acc.s1 += a.s1; acc.n1 += a.n1; acc.s0 += a.s0; acc.n0 += a.n0;
        }
        const v = contrastOf(acc);
        if (Number.isFinite(v)) draws.push(v);
      }
      draws.sort((a, b) => a - b);
      const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
      lower = round(at(0.025)); upper = round(at(0.975));
      inPowerCells.push({ context, cand, key, cj: idx });
      idx += 1;
    }
    perCellFlat.push({
      context, cand,
      n1: fa.n1, n0: fa.n0,
      value1: fa.n1 === 0 ? Number.NaN : round(fa.s1 / fa.n1),
      value0: fa.n0 === 0 ? Number.NaN : round(fa.s0 / fa.n0),
      point: round(point), lower, upper, inPower,
    });
  }

  // pooled contrast across the in-power cells (equal-weight per cell, avoiding
  // the P1R ecological fallacy), one shared cluster draw per resample.
  const inPowerArrs = inPowerCells.map((c) => perCluster.get(c.key)!);
  const inPowerFull = inPowerCells.map((c) => fullAgg.get(c.key)!);
  const pooledPoint = inPowerCells.length === 0 ? Number.NaN
    : mean(inPowerFull.map(contrastOf).filter(Number.isFinite));
  let pooledLower = Number.NaN; let pooledUpper = Number.NaN;
  if (inPowerCells.length > 0) {
    const rng = new Rng(BOOTSTRAP_SEED + 6000);
    const draws: number[] = [];
    for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
      const picks = new Array<number>(C);
      for (let i = 0; i < C; i++) picks[i] = rng.int(0, C - 1);
      const cellVals: number[] = [];
      for (const arr of inPowerArrs) {
        const acc = emptyAgg();
        for (let i = 0; i < C; i++) {
          const a = arr[picks[i]];
          acc.s1 += a.s1; acc.n1 += a.n1; acc.s0 += a.s0; acc.n0 += a.n0;
        }
        const v = contrastOf(acc);
        if (Number.isFinite(v)) cellVals.push(v);
      }
      if (cellVals.length > 0) draws.push(mean(cellVals));
    }
    draws.sort((a, b) => a - b);
    const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
    pooledLower = round(at(0.025)); pooledUpper = round(at(0.975));
  }

  // descriptive sign census (§4; the census pre-judges NONE)
  const resolvedNeg = perCellFlat.filter((c) => c.inPower && c.upper < 0).length;
  const resolvedPos = perCellFlat.filter((c) => c.inPower && c.lower > 0).length;
  const nullCells = perCellFlat.filter((c) => c.inPower && c.lower <= 0 && c.upper >= 0).length;

  return {
    perCell: perCellFlat,
    inPowerCount: inPowerCells.length,
    pooled: { cells: inPowerCells.length, point: round(pooledPoint), lower: pooledLower, upper: pooledUpper },
    signCensus: { inPower: inPowerCells.length, resolvedNegative: resolvedNeg, resolvedPositive: resolvedPos, unresolvedNull: nullCells },
  };
};

// --- the 432-cell TABLE (context × going bit × candidate), per-cell n (§3) ----
interface TableCell {
  n: number; score: number; concede: number; value: number;
  goalFor: number; goalAgainst: number;
  eta: number; targetError: number; occupancy: number;
  underPowered: boolean;
}
const cellFrom = (os: ForkOutcome[]): TableCell => ({
  n: os.length,
  score: round(mean(os.map((o) => (o.score ? 1 : 0)))),
  concede: round(mean(os.map((o) => (o.concede ? 1 : 0)))),
  value: round(mean(os.map(signed))),
  goalFor: round(mean(os.map((o) => (o.goalFor ? 1 : 0)))),
  goalAgainst: round(mean(os.map((o) => (o.goalAgainst ? 1 : 0)))),
  eta: round(mean(os.map((o) => o.eta).filter(Number.isFinite)), 4),
  targetError: round(mean(os.map((o) => o.targetError).filter(Number.isFinite)), 4),
  occupancy: round(mean(os.map((o) => o.occupancy).filter(Number.isFinite)), 4),
  underPowered: os.length < CELL_FLOOR,
});

// --- the SAT arm (§2.1 / P1R §4.3): a second deterministic traversal ----------
const runSatPass = (contexts: readonly string[], ids: readonly string[]) => {
  const byCandidate: Record<string, { uni: number[]; sat: number[] }> = {};
  for (const id of ids) byCandidate[id] = { uni: [], sat: [] };
  let moments = 0;
  let rotation = 0;
  const scratch = newExceptions();
  for (let k = 0; k < MATCH_CAP && moments < MOMENT_TARGET; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    while (!m.finished && moments < MOMENT_TARGET) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { m.step(DT); continue; }
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      if (!STATION_FAMILY.has(body.action.type)) { m.step(DT); continue; }
      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
      }
      const face: Face = side === owner!.side ? 'ours' : 'theirs';
      const context = contextKey(face, localXBand(mine.localX(m.ball.pos.x)), near >= 2 ? 'crowded' : 'sparse');
      const decisionTick = m.simTick;
      moments += 1;
      if (contexts.includes(context)) {
        const clone = cloneSimulationState(m);
        for (const id of ids) {
          const cand = LATTICE.find((c) => c.id === id)!;
          byCandidate[id].uni.push(signed(runFork(clone, body.gid, side, cand, scratch, seed, decisionTick, null)));
          const s2 = runSaturated(clone, side, cand);
          byCandidate[id].sat.push((s2.score ? 1 : 0) - (s2.concede ? 1 : 0));
        }
      }
      m.step(DT);
    }
  }
  const perCandidate = Object.fromEntries(ids.map((id) => {
    const u = mean(byCandidate[id].uni);
    const v = mean(byCandidate[id].sat);
    return [id, { n: byCandidate[id].uni.length, unilateral: round(u), saturated: round(v), gap: round(v - u) }];
  }));
  return { moments, perCandidate };
};

// --- assemble the run --------------------------------------------------------
const summarise = (c: CensusOut) => {
  const rows = c.rows;

  // TABLE: context × {going0, going1} × candidate
  const table: Record<string, { going0: Record<string, TableCell>; going1: Record<string, TableCell> }> = {};
  for (const ctx of CONTEXTS) {
    const ctxRows = rows.filter((r) => r.context === ctx);
    const going0: Record<string, TableCell> = {};
    const going1: Record<string, TableCell> = {};
    for (const cand of LATTICE) {
      const os0: ForkOutcome[] = [];
      const os1: ForkOutcome[] = [];
      for (const r of ctxRows) {
        const o = r.outcomes[cand.id];
        if (o === undefined || o.ended) continue;
        if (r.trueGoing[cand.id] === 1) os1.push(o); else os0.push(o);
      }
      going0[cand.id] = cellFrom(os0);
      going1[cand.id] = cellFrom(os1);
    }
    table[ctx] = { going0, going1 };
  }

  // PRIMARY contrast + pooled
  const contrasts = goingContrasts(rows);

  // PC — the power GATE (§5): r21a180 below control in both faces, CI upper < 0
  const pcAll = pairedCI(rows, PC_ID, 1);
  const pcByFace = Object.fromEntries(FACES.map((f, i) => [
    f, pairedCI(rows.filter((r) => r.face === f), PC_ID, 10 + i),
  ]));
  const pcResolves = Object.values(pcByFace).every((c2) => (
    Number.isFinite(c2.upper) ? c2.upper < 0 : true
  )) && Number.isFinite(pcAll.upper) && pcAll.upper < 0;

  // gradient: every candidate vs control, pooled (reported, not gating)
  const pooledByCandidate = Object.fromEntries(LATTICE.map((cand, i) => [
    cand.id, pairedCI(rows, cand.id, 100 + i),
  ]));

  // SAT arm — data-dependent subset, second traversal (P1R §4.3)
  const bestContexts = [...CONTEXTS]
    .sort((a, b) => rows.filter((r) => r.context === b).length - rows.filter((r) => r.context === a).length)
    .slice(0, 4);
  const nearestByFace = Object.fromEntries(FACES.map((f) => {
    const faceRows = rows.filter((r) => r.face === f);
    const ctrl = mean(faceRows.map((r) => signed(r.outcomes[CONTROL_ID])));
    return [f, [...LATTICE]
      .map((cand) => ({ id: cand.id, gap: Math.abs(mean(faceRows.map((r) => signed(r.outcomes[cand.id]))) - ctrl) }))
      .sort((a, b) => a.gap - b.gap).slice(0, 3).map((x) => x.id)];
  })) as Record<Face, string[]>;
  const satIds = [...new Set([...nearestByFace.ours, ...nearestByFace.theirs])];
  const sat = runSatPass(bestContexts, satIds);
  const satAgrees = Object.values(sat.perCandidate).every((v) => (
    !Number.isFinite((v as { gap: number }).gap) || Math.abs((v as { gap: number }).gap) <= SAT_BAND
  ));

  // X6 — the derived floor (§2.4): the census re-derives from its OWN measured
  // enriched-world clamp share; the hard `unexplained = 0` is UNCONDITIONAL.
  const x6 = c.x6;
  const okDenom = x6.ok + x6.eOnside + x6.eBarred + x6.unexplained;
  const okFraction = okDenom === 0 ? Number.NaN : x6.ok / okDenom;
  const clampShare = okDenom === 0 ? Number.NaN : (x6.eOnside + x6.eBarred) / okDenom;
  const x6FloorDerived = round(1 - 2 * clampShare, 6);
  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.unexplained;

  // wedge cross-check headline (V2-P0-style, moment-grain)
  const wedge = {
    agreement: c.wedgePairs === 0 ? Number.NaN : round(c.wedgeAgree / c.wedgePairs, 4),
    trueSomeoneGoingRate: c.wedgePairs === 0 ? Number.NaN : round(c.wedgeTrue / c.wedgePairs, 4),
    perceivedSomeoneGoingRate: c.wedgePairs === 0 ? Number.NaN : round(c.wedgePerc / c.wedgePairs, 4),
    wedgeRatio: c.wedgeTrue === 0 ? Number.NaN : round(c.wedgePerc / c.wedgeTrue, 4),
    note: 'TRUE-keyed table; this is the PERCEIVED-vs-TRUE cross-check only '
      + '(the consumer pays the perception exchange at V2-P2 with the ORACLE arm).',
  };

  const cellCount = CONTEXTS.length * 2 * LATTICE.length;
  const underPowered = CONTEXTS.reduce((s, ctx) => s
    + LATTICE.filter((cand) => table[ctx].going0[cand.id].underPowered || table[ctx].going1[cand.id].underPowered).length, 0);

  const gates = {
    x4CloneCoverage: c.clonesTaken === c.moments && c.moments > 0,
    x5ControlIdentity: c.x5Checked > 0 && c.x5Mismatched === 0,
    // X6: hard half UNCONDITIONAL (unexplained EXACTLY 0); ok-floor the secondary
    // check against the run's OWN derived floor (#69.2).
    x6ForceFidelity: x6Total > 0 && x6.unexplained === 0
      && (Number.isFinite(okFraction) && Number.isFinite(x6FloorDerived) ? okFraction >= x6FloorDerived : true),
    pcPositiveControl: pcResolves,
  };

  return {
    parameters: {
      seedStart: SEED_START, matchCap: MATCH_CAP, momentTarget: MOMENT_TARGET,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, wTicks: W_TICKS,
      hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      hScoreTicks: H_SCORE_TICKS, hConcedeTicks: H_CONCEDE_TICKS,
      regionRadiusM: R_M, warmupTicks: WARMUP_TICKS,
      lattice: LATTICE.map((cand) => cand.id), positiveControl: PC_ID,
      contexts: CONTEXTS, cellFloor: CELL_FLOOR,
      clusterUnit: 'match seed (single contiguous block)',
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
      outcome: 'signed = ANY shot for (H_score) − ANY shot against (H_concede)',
      cellKey: '(context × TRUE OTHERS-GOING bit of the forced candidate × candidate)',
      goingBit: 'TRUE-keyed: ≥1 own outfielder (not self/GK) whose TRUE velocity advanced W lands within R of the candidate point (V2-P0 §2 verbatim, TRUE side)',
      estimand: 'the value of committing W to APPROACHING the candidate (#41.2)',
      population: 'station-family ticks only (#40.4 item 2)',
      motionSource: 'TRUE world velocity (differencing clause dead, #67.2)',
    },
    coverage: {
      matchesRun: c.matchesRun, moments: c.moments,
      clonesTaken: c.clonesTaken, cloneCoverage: c.moments === 0 ? Number.NaN : round(c.clonesTaken / c.moments),
      forks: c.moments * (LATTICE.length + 1),
      ballDirectedSkipped: c.ballDirectedSkipped, noPool: c.noPool, eNoSnapshot: c.eNoSnapshot,
      x5Checked: c.x5Checked, x5Mismatched: c.x5Mismatched,
      cellCount, underPowered,
      contextCounts: Object.fromEntries(CONTEXTS.map((ctx) => [ctx, rows.filter((r) => r.context === ctx).length])),
    },
    x6: {
      ...x6, total: x6Total,
      okFraction: round(okFraction, 6), clampShare: round(clampShare, 6),
      floorDerived: x6FloorDerived, floorReference: X6_FLOOR_REF,
    },
    positiveControl: { id: PC_ID, pooled: pcAll, byFace: pcByFace, resolves: pcResolves },
    gradient: { pooledByCandidate },
    saturation: {
      contexts: bestContexts, nearestByFace, tested: satIds,
      moments: sat.moments, perCandidate: sat.perCandidate,
      band: SAT_BAND, agrees: satAgrees,
      tableStatus: satAgrees ? 'SHIPPING TABLE' : 'DESIGN-CALIBRATION ONLY',
    },
    wedgeCrossCheck: wedge,
    primaryContrast: contrasts,
    table,
    gates,
  };
};

// --- run: X-DET double run + canonical SHA (§6) ------------------------------
(globalThis as any).__t0 = Date.now();
const __mark = (l: string) => { if (process.env.V2P1_PROG) { appendFileSync(process.env.V2P1_PROG, `[mark] ${l} t=${((Date.now() - (globalThis as any).__t0) / 1000).toFixed(1)}s\n`); } };
const first = runCensus(true);
__mark('census-1 done');
const firstSummary = summarise(first);
__mark('summarise-1 done');
const second = runCensus(false);
__mark('census-2 done');
const secondSummary = summarise(second);
__mark('summarise-2 done');
const canonical = (v: unknown): string => JSON.stringify(v);
// receipts are excluded from the determinism/SHA canonicalisation (they are a
// first-N diagnostic ledger; the second run omits them to halve their cost).
const deterministic = canonical(firstSummary) === canonical(secondSummary);
const tableSha = createHash('sha256').update(canonical(firstSummary.table)).digest('hex');
const sha256 = createHash('sha256').update(canonical(firstSummary)).digest('hex');
const gates = { ...firstSummary.gates, x7Determinism: deterministic };
const verdict = Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL';

const output = {
  experiment: 'STAGE3-V2-P1 (the anticipatory census)',
  authority: 'STAGE3-V2-P1-ANTICIPATORY-CENSUS · rulings #68/#69',
  head: 'c5f2913 (ruling #68; src identical to V2-P0 HEAD 92876e5)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  ...firstSummary,
  receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(first.receipts).map(([k, v]) => [k, v.length])), records: first.receipts },
  gates,
  deterministic,
  tableSha,
  sha256,
  verdict,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `STAGE3-V2-P1 ${verdict}`
  + ` · matches ${output.coverage.matchesRun} moments ${output.coverage.moments} forks ${output.coverage.forks}`
  + ` · clone ${pct(output.coverage.cloneCoverage)}`
  + ` · X5 ${output.coverage.x5Checked}/${output.coverage.x5Mismatched} mismatched`
  + ` · X6 ok ${output.x6.ok} onside ${output.x6.eOnside} barred ${output.x6.eBarred}`
  + ` clampShare ${pct(output.x6.clampShare)} floorDerived ${output.x6.floorDerived} (ref ${X6_FLOOR_REF})`
  + ` UNEXPLAINED ${output.x6.unexplained} · reconDiverged ${output.x6.reconstructionDiverged}`
  + ` · PC ${output.positiveControl.pooled.point} CI[${output.positiveControl.pooled.lower}, ${output.positiveControl.pooled.upper}] resolves ${output.positiveControl.resolves}`
  + ` · contrast inPower ${output.primaryContrast.inPowerCount} pooled ${output.primaryContrast.pooled.point}`
  + ` CI[${output.primaryContrast.pooled.lower}, ${output.primaryContrast.pooled.upper}]`
  + ` (neg ${output.primaryContrast.signCensus.resolvedNegative} pos ${output.primaryContrast.signCensus.resolvedPositive} null ${output.primaryContrast.signCensus.unresolvedNull})`
  + ` · wedge A ${pct(output.wedgeCrossCheck.agreement)} W_r ${output.wedgeCrossCheck.wedgeRatio}`
  + ` · SAT ${output.saturation.tableStatus}`
  + ` · cells ${output.coverage.cellCount} underPowered ${output.coverage.underPowered}`
  + ` · det ${deterministic} · tableSHA ${tableSha} · SHA ${sha256}`
  + (failed.length ? ` · FAILED ${failed.join(',')}` : ''),
);
