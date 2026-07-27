// STAGE III P1R — THE APPROACH CENSUS
// Authority: docs/world-model/STAGE3-P1R-APPROACH-CENSUS.md (ruling #41: the
// station estimand re-founded as APPROACH-VALUE after P1's treatment was
// measured undelivered). Derived from the P1 probe; everything is verbatim
// except the three things the ruling changed — the population is
// station-family only, W is re-derived, and X6's floor is derived against the
// measured clamp share instead of assumed near zero.
//
// At sampled off-ball moments, fork the deterministic world and force ONE
// body's station to each candidate in a fixed BALL-LOCAL lattice, then let the
// live machinery play. Outcome = a signed two-face value with face-specific
// horizons. The table is the deliverable; nothing here ships behaviour.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2, §3, §5) ---------------------------------
/**
 * §2.3, re-derived under the APPROACH estimand: above P0's 1.466 s dwell mean
 * and dominating the MEDIAN measured travel time (2.66 s). It deliberately
 * does not dominate the tail — under #41.2 a long approach is a candidate
 * being priced, not a treatment failing.
 */
const W_S = 3.0;
const W_TICKS = Math.round(W_S / DT);
/** §2.5, face-specific. One fork, two read-off points. */
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
/** §3.4: consecutive moments must not be the same football. */
const MOMENT_SPACING_S = 2.0;
/** §5. */
const SEED_START = 980_000;
const BLOCK_STRIDE = 100_000;
const BLOCKS = 6;
const MATCHES_PER_BLOCK = 250;
const MOMENT_TARGET = 6000;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50037;
/** §3.3: a cell below this is published UNDER-POWERED, never pooled away. */
const CELL_FLOOR = 150;
/** §4.4: "within 2 m of the target" for every arrival mediator. */
const ARRIVE_M = 2;
/** §4.3: the saturation arm's agreement band. */
const SAT_BAND = 0.05;
/** §4.1 X6. */
const X6_EPS = 1e-9;
/**
 * §2.4: DERIVED as 1 − 2 × the measured 8.08% clamp share, not assumed. P1's
 * 99% floor failed on a perfectly faithful seam because it conflated "the seam
 * is faithful" with "the clamps rarely bite" — the latter is a property of the
 * lattice, and the clamp shares are reported separately.
 */
const X6_FLOOR = 0.84;

// --- the lattice (§2.3): 18 candidates + control -----------------------------
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
/** §4.2: the positive control — 21 m BEHIND the ball, away from goal. */
const PC_ID = 'r21a180';
const CONTROL_ID = 'control';

// --- contexts (§3.2), frozen and closed --------------------------------------
type Face = 'ours' | 'theirs';
type Threat = 'ownThird' | 'middle' | 'theirThird';
type Density = 'sparse' | 'crowded';
const contextKey = (f: Face, t: Threat, d: Density): string => `${f}|${t}|${d}`;
const FACES: readonly Face[] = ['ours', 'theirs'];
const THREATS: readonly Threat[] = ['ownThird', 'middle', 'theirThird'];
const DENSITIES: readonly Density[] = ['sparse', 'crowded'];
const CONTEXTS: string[] = [];
for (const f of FACES) for (const t of THREATS) for (const d of DENSITIES) CONTEXTS.push(contextKey(f, t, d));

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

// --- standing exception classes (§4.6, mandatory boilerplate #38.1) ----------
interface Exceptions {
  ePaused: number;
  eCarrier: number;
  eBallWon: number;
  eSentOff: number;
  eOnside: number;
  eBarred: number;
  eEnded: number;
  ok: number;
  unexplained: number;
  /** REPORTED, never gated: ticks where the probe's ball read differed from
   * the executor's (a restart hand-off or carrier snap between the two). */
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
  /** §3.1 the signed two-face outcome. */
  readonly score: boolean;
  readonly concede: boolean;
  readonly goalFor: boolean;
  readonly goalAgainst: boolean;
  /** §4.4 mediators — bad location is not the same fact as failed to arrive. */
  readonly eta: number;
  readonly targetError: number;
  readonly occupancy: number;
  /** §3.1: a fork whose match ended inside the horizon is excluded, not zeroed. */
  readonly ended: boolean;
  readonly signature: string;
}

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

/**
 * Run ONE fork. `cand === null` is the CONTROL arm (no policy) — X5's harness
 * gate compares its signature against the base's continuation.
 */
const runFork = (
  before: Match, gid: number, side: number, cand: Candidate | null, x6: Exceptions,
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
    // their classification must be read here, not after. Reading the post-step
    // owner mis-filed every onside rewrite as unexplained, which the sizing
    // smoke showed as ~1% of live ticks (contract §4.6b).
    const rBefore = fork.restart;
    const barredBefore = (rBefore?.kind === 'goalKick' && rBefore.side !== side)
      || theirs.goalkeeper.gkHoldTimer > 0 || theirs.goalkeeper.gkDistributing;
    const onsideBefore = ownerBefore !== null && ownerBefore.side === side
      && ownerBefore !== body;

    fork.step(DT);

    if (live) {
      // X6, per record, with the full standing class list (§4.6).
      const tr = body.c4Trace;
      if (pausedBefore || fork.phase !== 'playing') x6.ePaused += 1;
      else if (body.sentOff) x6.eSentOff += 1;
      else if (ownerBefore === body || fork.ball.owner === body) x6.eCarrier += 1;
      else if (tr === null) {
        if (fork.ball.owner !== null && fork.ball.owner.side !== side) x6.eBallWon += 1;
        else x6.unexplained += 1;
      } else if (
        // X6 compares the applied target against the ENGINE'S OWN policy
        // target (`tr.meet`), not against a probe reconstruction of
        // `ball + offset`. The probe reads the ball at the tick boundary; the
        // executor reads it mid-step, and on ticks where a restart hand-off or
        // a carrier snap moves the ball in between, the two differ by a
        // constant offset with no clamp involved — the sizing smoke showed
        // ~0.5% of live ticks landing in `unexplained` for that reason alone.
        // The `meet == ball + offset` half of the claim is pinned exactly by
        // the unit test instead, which is where an equality of that kind
        // belongs. Divergences are still COUNTED and reported below.
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
      } else if (barredBefore) x6.eBarred += 1;
      else if (onsideBefore) x6.eOnside += 1;
      else x6.unexplained += 1;
    }

    // §2.5: the score face is read AT its horizon and never after — a
    // longer-running fork must not accumulate the shorter face's outcome.
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
  if (ended) x6.eEnded += 1;

  return {
    score,
    concede: theirs.stats.shots > conceded0,
    goalFor,
    goalAgainst: theirs.stats.goals > against0,
    eta: Number.isFinite(eta) ? eta : W_S, // never arrived within W
    targetError: errTicks === 0 ? Number.NaN : errSum / errTicks,
    occupancy: cand === null ? Number.NaN : insideTicks / W_TICKS,
    ended,
    signature: signatureOf(fork),
  };
};

/** The saturation arm (§4.3): the SAME relative policy on every own outfielder. */
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
    // One seam, many bodies: rotate the policy across them within the tick
    // budget the seam allows. Each body is re-forced on its own cadence, so
    // over W every licensed body is steered at the same relative offset.
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
  readonly cluster: number;
  readonly context: string;
  readonly face: Face;
  readonly outcomes: Record<string, ForkOutcome>; // candidate id → outcome
}

const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

const STATION_FAMILY = new Set([
  'MoveToFormationSpot', 'HoldPosition', 'SupportBallCarrier', 'MakeRun', 'MarkOpponent',
]);

interface BlockResult {
  rows: MomentRow[];
  moments: number;
  ballDirectedSkipped: number;
  clonesTaken: number;
  x5Checked: number;
  x5Mismatched: number;
  x6: Exceptions;
}

const runBlock = (
  seedStart: number, matches: number, cluster0: number, momentBudget: number,
): BlockResult => {
  const rows: MomentRow[] = [];
  const x6 = newExceptions();
  let moments = 0;
  let clonesTaken = 0;
  let x5Checked = 0;
  let x5Mismatched = 0;
  let rotation = 0;
  let ballDirectedSkipped = 0;

  for (let k = 0; k < matches && moments < momentBudget; k++) {
    const m = new Match({ seed: seedStart + k, teamA: team('A', seedStart + k * 2 + 1), teamB: team('B', seedStart + k * 2 + 2) });
    let lastMomentTime = -Infinity;
    while (!m.finished && moments < momentBudget) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }

      // §3.2's FACE dimension requires bodies from BOTH sides — Q8's symmetry
      // law says every outfielder runs the same eye, and a census that only
      // ever forces the possessing team would collapse FACE to one value and
      // leave the concede horizon (§2.5) measuring nothing. The side
      // alternates on the same stable rotation as the body choice.
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => (
        p.role !== 'GK' && !p.sentOff && p !== owner
      ));
      if (pool.length === 0) { m.step(DT); continue; }
      // §3.4: STABLE ROTATION, never proximity — choosing the nearest body
      // would censor the census onto the bodies already involved.
      const body = pool[Math.floor(rotation / 2) % pool.length];
      rotation += 1;
      // §2.2 (#40.4 item 2): STATION-FAMILY ticks only. Forcing a chaser, a
      // receiver or an interceptor is not choosing a station — it is
      // abandoning the ball, which is C4 O2's measured harm in another
      // costume. The rotation still advances so the body choice stays stable.
      if (!STATION_FAMILY.has(body.action.type)) { ballDirectedSkipped += 1; m.step(DT); continue; }

      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (Math.hypot(q.pos.x - body.pos.x, q.pos.y - body.pos.y) <= 9) near += 1;
      }
      const face: Face = side === owner!.side ? 'ours' : 'theirs';
      const context = contextKey(
        face,
        localXBand(mine.localX(m.ball.pos.x)),
        near >= 2 ? 'crowded' : 'sparse',
      );

      const clone = cloneSimulationState(m);
      clonesTaken += 1;
      lastMomentTime = m.simTime;
      moments += 1;

      const outcomes: Record<string, ForkOutcome> = {};
      const control = runFork(clone, body.gid, side, null, x6);
      outcomes[CONTROL_ID] = control;
      for (const cand of LATTICE) {
        outcomes[cand.id] = runFork(clone, body.gid, side, cand, x6);
      }

      // X5: the control fork must reproduce the base continuation exactly.
      // Checked on a 1-in-25 sample so the gate is real without tripling cost.
      if (moments % 25 === 0) {
        const plain = cloneSimulationState(clone);
        for (let i = 0; i < H_CONCEDE_TICKS && !plain.finished; i++) plain.step(DT);
        x5Checked += 1;
        if (signatureOf(plain) !== control.signature) x5Mismatched += 1;
      }

      rows.push({ cluster: cluster0 + k, context, face, outcomes });
      m.step(DT);
    }
  }
  return { rows, moments, clonesTaken, x5Checked, x5Mismatched, x6, ballDirectedSkipped };
};

// --- statistics --------------------------------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);

/** Paired cluster bootstrap of (candidate − control) on a signed value. */
const pairedCI = (
  rows: readonly MomentRow[], id: string, value: (o: ForkOutcome) => number, offset: number,
) => {
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
    : mean(rs.map((r) => value(r.outcomes[id]) - value(r.outcomes[CONTROL_ID]))));
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

const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);

/**
 * §4.3's second traversal. Deterministic replay reproduces the same moments,
 * so a saturated fork at moment i is paired with the unilateral fork at
 * moment i. Only the pre-registered contexts and candidates are forked, which
 * is what keeps the arm cheap.
 */
const runSatPass = (contexts: readonly string[], ids: readonly string[]) => {
  const byCandidate: Record<string, { uni: number[]; sat: number[] }> = {};
  for (const id of ids) byCandidate[id] = { uni: [], sat: [] };
  let moments = 0;
  const perBlock = Math.ceil(MOMENT_TARGET / BLOCKS);
  for (let b = 0; b < BLOCKS; b++) {
    const seedStart = SEED_START + b * BLOCK_STRIDE;
    let seen = 0;
    let rotation = 0;
    for (let k = 0; k < MATCHES_PER_BLOCK && seen < perBlock; k++) {
      const m = new Match({ seed: seedStart + k, teamA: team('A', seedStart + k * 2 + 1), teamB: team('B', seedStart + k * 2 + 2) });
      let lastMomentTime = -Infinity;
      while (!m.finished && seen < perBlock) {
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
          if (Math.hypot(q.pos.x - body.pos.x, q.pos.y - body.pos.y) <= 9) near += 1;
        }
        const face: Face = side === owner!.side ? 'ours' : 'theirs';
        const context = contextKey(face, localXBand(mine.localX(m.ball.pos.x)),
          near >= 2 ? 'crowded' : 'sparse');
        lastMomentTime = m.simTime;
        seen += 1;
        if (contexts.includes(context)) {
          const clone = cloneSimulationState(m);
          const scratch = newExceptions();
          moments += 1;
          for (const id of ids) {
            const cand = LATTICE.find((c) => c.id === id)!;
            byCandidate[id].uni.push(signed(runFork(clone, body.gid, side, cand, scratch)));
            const s2 = runSaturated(clone, side, cand);
            byCandidate[id].sat.push((s2.score ? 1 : 0) - (s2.concede ? 1 : 0));
          }
        }
        m.step(DT);
      }
    }
  }
  const perCandidate = Object.fromEntries(ids.map((id) => {
    const u = mean(byCandidate[id].uni);
    const v = mean(byCandidate[id].sat);
    return [id, { n: byCandidate[id].uni.length, unilateral: round(u), saturated: round(v), gap: round(v - u) }];
  }));
  return { moments, perCandidate };
};

const runExperiment = () => {
  const rows: MomentRow[] = [];
  const x6 = newExceptions();
  let moments = 0;
  let clonesTaken = 0;
  let x5Checked = 0;
  let x5Mismatched = 0;
  let ballDirectedSkipped = 0;
  const perBlock = Math.ceil(MOMENT_TARGET / BLOCKS);
  for (let b = 0; b < BLOCKS; b++) {
    const res = runBlock(SEED_START + b * BLOCK_STRIDE, MATCHES_PER_BLOCK, b * 100_000, perBlock);
    ballDirectedSkipped += res.ballDirectedSkipped;
    for (const r of res.rows) rows.push(r);
    moments += res.moments;
    clonesTaken += res.clonesTaken;
    x5Checked += res.x5Checked;
    x5Mismatched += res.x5Mismatched;
    addExceptions(x6, res.x6);
  }

  // --- the TABLE: 216 cells, per-cell n published (§3.3) --------------------
  const table: Record<string, Record<string, {
    n: number; score: number; concede: number; value: number;
    goalFor: number; goalAgainst: number;
    eta: number; targetError: number; occupancy: number;
    underPowered: boolean;
  }>> = {};
  for (const ctx of CONTEXTS) {
    const ctxRows = rows.filter((r) => r.context === ctx);
    table[ctx] = {};
    for (const id of [CONTROL_ID, ...LATTICE.map((c) => c.id)]) {
      const os = ctxRows.map((r) => r.outcomes[id]).filter((o) => o !== undefined && !o.ended);
      table[ctx][id] = {
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
      };
    }
  }
  const cellCount = CONTEXTS.length * LATTICE.length;
  const underPowered = CONTEXTS.reduce((s, ctx) => s
    + LATTICE.filter((c) => table[ctx][c.id].underPowered).length, 0);

  // --- PC, the power GATE (§4.2) --------------------------------------------
  const pcAll = pairedCI(rows, PC_ID, signed, 1);
  const pcByFace = Object.fromEntries(FACES.map((f, i) => [
    f, pairedCI(rows.filter((r) => r.face === f), PC_ID, signed, 10 + i),
  ]));
  const pcResolves = Object.values(pcByFace).every((c) => (
    Number.isFinite(c.upper) ? c.upper < 0 : true
  )) && Number.isFinite(pcAll.upper) && pcAll.upper < 0;

  // --- gradient: every candidate vs control, pooled --------------------------
  const pooledByCandidate = Object.fromEntries(LATTICE.map((c, i) => [
    c.id, pairedCI(rows, c.id, signed, 100 + i),
  ]));
  const resolved = Object.values(pooledByCandidate).filter((c) => c.lower > 0 || c.upper < 0).length;

  // --- SAT, the saturation-gap arm (§4.3) -----------------------------------
  // The subset is data-dependent by contract, so it needs a SECOND traversal.
  // The world is deterministic, so replaying the same blocks reproduces the
  // same moments exactly — the SAT rows are paired with the unilateral ones.
  const bestContexts = [...CONTEXTS]
    .sort((a, b) => rows.filter((r) => r.context === b).length
      - rows.filter((r) => r.context === a).length)
    .slice(0, 4);
  const nearestByFace = Object.fromEntries(FACES.map((f) => {
    const faceRows = rows.filter((r) => r.face === f);
    const ctrl = mean(faceRows.map((r) => signed(r.outcomes[CONTROL_ID])));
    return [f, [...LATTICE]
      .map((c) => ({
        id: c.id,
        gap: Math.abs(mean(faceRows.map((r) => signed(r.outcomes[c.id]))) - ctrl),
      }))
      .sort((a, b) => a.gap - b.gap).slice(0, 3).map((x) => x.id)];
  })) as Record<Face, string[]>;
  const satIds = [...new Set([...nearestByFace.ours, ...nearestByFace.theirs])];
  const sat = runSatPass(bestContexts, satIds);
  const satAgrees = Object.values(sat.perCandidate).every((v) => (
    !Number.isFinite(v.gap) || Math.abs(v.gap) <= SAT_BAND
  ));

  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.unexplained;
  const gates = {
    x4CloneCoverage: clonesTaken === moments && moments > 0,
    x5ControlIdentity: x5Checked > 0 && x5Mismatched === 0,
    x6ForceFidelity: x6Total > 0 && x6.unexplained === 0
      && x6.ok / (x6.ok + x6.eOnside + x6.eBarred + x6.unexplained) >= X6_FLOOR,
    pcPositiveControl: pcResolves,
  };

  return {
    experiment: 'STAGE3-P1R (approach census)',
    authority: 'STAGE3-P1R-APPROACH-CENSUS',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      momentTarget: MOMENT_TARGET, momentSpacingS: MOMENT_SPACING_S,
      wSeconds: W_S, hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      lattice: LATTICE.map((c) => c.id), positiveControl: PC_ID,
      contexts: CONTEXTS, cellFloor: CELL_FLOOR,
      clusterUnit: 'match seed (disjoint per block)',
      outcome: 'signed = ANY shot for (H_score) − ANY shot against (H_concede)',
      estimand: 'the value of committing W to APPROACHING the candidate (#41.2)',
      population: 'station-family ticks only (#40.4 item 2)',
    },
    coverage: {
      moments, clonesTaken, ballDirectedSkipped,
      ballDirectedShare: round(ballDirectedSkipped / (ballDirectedSkipped + moments || 1)),
      cloneCoverage: moments === 0 ? Number.NaN : round(clonesTaken / moments),
      forks: moments * (LATTICE.length + 1),
      x5Checked, x5Mismatched,
      cellCount, underPowered,
      contextCounts: Object.fromEntries(CONTEXTS.map((c) => [c, rows.filter((r) => r.context === c).length])),
    },
    x6: { ...x6, total: x6Total },
    positiveControl: { id: PC_ID, pooled: pcAll, byFace: pcByFace, resolves: pcResolves },
    saturation: {
      contexts: bestContexts, nearestByFace, tested: satIds,
      moments: sat.moments, perCandidate: sat.perCandidate,
      band: SAT_BAND, agrees: satAgrees,
      tableStatus: satAgrees ? 'SHIPPING TABLE' : 'DESIGN-CALIBRATION ONLY',
    },
    gradient: { resolvedCandidates: resolved, of: LATTICE.length, pooledByCandidate },
    table,
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(first) === canonical(second);
const tableSha = createHash('sha256').update(canonical(first.table)).digest('hex');
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');
const gates = { ...first.gates, x7Determinism: deterministic };
const output = { ...first, gates, tableSha, sha256, verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL' };
console.log(JSON.stringify(output, null, 2));
writeFileSync('docs/world-model/data/stage3-p1r-approach-table.json',
  `${JSON.stringify({ table: first.table, parameters: first.parameters, tableSha }, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const failed = Object.entries(output.gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `STAGE3-P1R ${output.verdict}`
  + ` · moments ${output.coverage.moments} forks ${output.coverage.forks}`
  + ` ballDirectedSkipped ${output.coverage.ballDirectedSkipped} (${pct(output.coverage.ballDirectedShare)})`
  + ` clone ${pct(output.coverage.cloneCoverage)}`
  + ` · X5 ${output.coverage.x5Checked}/${output.coverage.x5Mismatched} mismatched`
  + ` · X6 ok ${output.x6.ok} paused ${output.x6.ePaused} carrier ${output.x6.eCarrier}`
  + ` ballWon ${output.x6.eBallWon} onside ${output.x6.eOnside} barred ${output.x6.eBarred}`
  + ` ended ${output.x6.eEnded} reconDiverged ${output.x6.reconstructionDiverged}`
  + ` UNEXPLAINED ${output.x6.unexplained}`
  + ` · PC ${output.positiveControl.pooled.point} CI[${output.positiveControl.pooled.lower}, ${output.positiveControl.pooled.upper}]`
  + ` resolves ${output.positiveControl.resolves}`
  + ` · gradient ${output.gradient.resolvedCandidates}/${output.gradient.of} candidates resolved`
  + ` · cells ${output.coverage.cellCount} underPowered ${output.coverage.underPowered}`
  + ` · SAT ${output.saturation.tableStatus} (${JSON.stringify(Object.fromEntries(Object.entries(output.saturation.perCandidate).map(([k, v]) => [k, (v as { gap: number }).gap])))})`
  + ` · det ${deterministic} · tableSHA ${tableSha} · SHA ${sha256}`,
);
