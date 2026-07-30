// STAGE III V3-P1 — THE ROLE-CONDITIONED CENSUS
//
// Authority: docs/world-model/STAGE3-V3-P1-ROLE-CENSUS.md (the frozen spec — the
// P1R fork-and-force instrument reused VERBATIM, re-keyed on the TRUE ROLE of the
// FORCED BODY; cells (12 v1 contexts × role ∈ {DF,MF,WG,ST} × 18 candidates) = 864
// cell-candidate pairs; the PRIMARY = the role SPREAD S per (context,candidate) with
// a WITHIN-CLUSTER role-label PERMUTATION null B=2,000 seed 91110 p<0.025 BH q=0.05
// across 216 cells; bootstrap CIs on S REPORTED-only; floors 150 moments per
// (context×role) taken EXACTLY from V3-P0; the 3 named DF cells published
// UNDER-POWERED never pooled; X1–X7 with the X6 FORMULA FORM `unexplained = 0`
// UNCONDITIONAL) · commander rulings #79 (V3-P0 accepted; V3-P1 drafting authorized;
// block reuse 9.11M) and #80 (pre-registration PASS; the permutation null codified as
// house law — a dispersion/extreme statistic takes a permutation null, never a
// bootstrap CI on itself; build authorized, the run supervised by the resident #49.5).
//
// The INSTRUMENT is STAGE3-P1R-APPROACH-CENSUS §2 verbatim (forcedStationPolicy forked
// at the executor READ, the 18-candidate ball-local lattice, W = 3.0 s, the two faces
// H 6/10 s, the signed outcome, the exception classes, X1–X7 with the derived X6). The
// going-bit machinery of V2-P1 (the OTHERS-GOING TRUE/PERCEIVED bit, R = 4.0 m, the
// percept snapshot read, the wedge cross-check) is STRIPPED (#77.2(ii)). The CELL a
// priced approach lands in gains ONE key: the TRUE ROLE of the FORCED BODY, read off
// the sampled body's immutable `role` field (contract I2/I3/I8 — own state, read never
// authored). Each moment lands in exactly ONE (context, role) row and forks all 18
// candidates within it. It prices approaches under #41.2 only; nothing ships (Road B),
// the seam is null in every production path, the fingerprint is unchanged.
//
// The census SAMPLING LOOP is STAGE3-V3-P0-ROLE-MAP verbatim (lastMomentTime advanced
// on EVERY qualifying moment; the stable side-alternating rotation; the station-family
// filter) — NOT V2-P1's — so the per-(context × role) moment counts V3-P1 collects are
// IDENTICAL to V3-P0's measured coverage on the same 9.11M block (the exactness the
// block-reuse decision §2.3 and the frozen in-power set §2.2 rest on).
import { createHash } from 'node:crypto';
import { writeFileSync, appendFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
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
/** §2.5: the percept warm-up window is pinned and reported for completeness, but is
 *  NOT load-bearing here — the role table is keyed on TRUE own-state (no percept read
 *  exists in V3-P1), so nothing consumes the warm-up. Reported = 15 (P1R §2.3). */
const WARMUP_TICKS = 15;
/** §6: the census block — the SAME frozen 388-match block V3-P0 mapped (§2.3 reuse). */
const MATCH_DURATION = 240;
const SEED_START = 9_110_000;
const MATCH_CAP = envInt('V3P1_MATCHES', 388);       // §6 cap; env-capped for the smoke
const BOOTSTRAP_RESAMPLES = 2000;                    // #20
const PERM_B = 2000;                                 // §4.1 permutations
const BOOTSTRAP_SEED = 91110;                        // §6 frozen (fresh, disjoint from 91100/90730/50068)
/** §3: a (context × role) cell below this is published UNDER-POWERED, never pooled.
 *  FROZEN at 150 (#24) for the census; env-overridable for the ENGINEERING SMOKE ONLY
 *  (like V3P1_MATCHES) — a low floor lets a tiny smoke create computable spread cells so
 *  the permutation engine is actually exercised. The resident's run leaves the default. */
const CELL_FLOOR = envInt('V3P1_FLOOR', 150);
/** §4.1: the family-wise multiplicity control on the 216 spread cells. */
const BH_Q = 0.05;
/** §2.1: "within 2 m of the target" for every arrival mediator (P1R §4.4). */
const ARRIVE_M = 2;
/** §2.1: the saturation arm's agreement band (P1R §4.3). */
const SAT_BAND = 0.05;
/** X6. */
const X6_EPS = 1e-9;
/** §2.4: the DERIVATION RULE is frozen (`1 − 2 × measured clamp share`); the clamp
 *  share is the world's OWN measured input, re-derived at the run. P1R's 0.84 (measured
 *  8.08% clamp share on the shipped world) is the REFERENCE. */
const X6_FLOOR_REF = 0.84;
/** §5 receipts (#49.3): first-N deterministic, per class. */
const RECEIPT_CAP = 1000;
const OUT_PATH = process.env.V3P1_OUT
  ?? 'docs/world-model/data/stage3-v3-p1-role-census-table.json';

/** §6 / #67.3: the ENRICHED census world — the full certified bundle, armed on EVERY
 *  arm (the base match and, through cloneSimulationState, every fork). Byte-identical
 *  src to V3-P0 HEAD 49ba867 (the intervening commits are docs-only rulings). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

// --- the role axis (contract §2.1): read from the sampled body; GK never here ---
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];
const roleIndex = (r: Role): number => ROLE_AXIS.indexOf(r);

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
const N_CAND = LATTICE.length;
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
const contextIndex = (c: string): number => CONTEXTS.indexOf(c);
const cellKey = (ctx: string, role: Role): string => `${ctx}||${role}`;
const localXBand = (localX: number): Threat => (
  localX < -HALF_L / 3 ? 'ownThird' : localX > HALF_L / 3 ? 'theirThird' : 'middle'
);

/** §2.2: the 3 named DF cells V3-P0 measured UNDER-POWERED (<150), published ex ante,
 *  never pooled. Cross-checked against this run's own measured counts. */
const PUBLISHED_UNDERPOWERED: readonly string[] = [
  'ours|theirThird|crowded||DF',
  'theirs|theirThird|crowded||DF',
  'theirs|ownThird|sparse||DF',
];

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
const percentile = (sorted: readonly number[], q: number): number => (
  sorted.length === 0 ? Number.NaN
    : sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))]
);

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

// --- per-moment record (the census unit; role is the forced body's own state) -
interface MomentRow {
  readonly cluster: number;                        // §6: the match seed
  readonly context: string;
  readonly role: Role;                             // §2.2: TRUE role of the forced body (keys the cell)
  readonly face: Face;
  readonly outcomes: Record<string, ForkOutcome>;  // candidate id → outcome
}

interface CensusOut {
  rows: MomentRow[];
  moments: number;
  matchesRun: number;
  qualifying: number;
  ballDirectedSkipped: number;
  noPool: number;
  clonesTaken: number;
  x5Checked: number;
  x5Mismatched: number;
  x6: Exceptions;
  receipts: ReceiptBook;
}

const runCensus = (withReceipts: boolean): CensusOut => {
  const out: CensusOut = {
    rows: [], moments: 0, matchesRun: 0, qualifying: 0, ballDirectedSkipped: 0, noPool: 0,
    clonesTaken: 0, x5Checked: 0, x5Mismatched: 0, x6: newExceptions(), receipts: {},
  };
  const receipts = withReceipts ? out.receipts : null;
  let rotation = 0;

  // The sampling loop is STAGE3-V3-P0 verbatim: full matches, no moment target,
  // lastMomentTime advanced on EVERY qualifying moment (NOT only on recorded rows,
  // as V2-P1 did) — this is what makes the per-(context × role) counts identical to
  // V3-P0's and lets the frozen in-power set (§2.2) apply EXACTLY.
  for (let k = 0; k < MATCH_CAP; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    out.matchesRun += 1;
    let lastMomentTime = -Infinity;
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      out.qualifying += 1;
      lastMomentTime = m.simTime;                    // V3-P0 placement: reset on EVERY qualifying moment

      // §2.1 / P1R §3.2: FACE needs bodies from BOTH sides; side alternates on the
      // same stable rotation as the body choice (NEVER by role).
      const side = rotation % 2 === 0 ? owner!.side : 1 - owner!.side;
      const mine = m.teams[side];
      const pool = mine.players.filter((p) => p.role !== 'GK' && !p.sentOff && p !== owner);
      if (pool.length === 0) { out.noPool += 1; m.step(DT); continue; }
      // §2.1: STABLE ROTATION, never proximity, never role.
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
      const role = body.role as Role;                 // §2.2: TRUE own-state role, read never authored (I8)

      const clone = cloneSimulationState(m);
      out.clonesTaken += 1;
      const decisionTick = m.simTick;
      out.moments += 1;

      // the forks — P1R verbatim (control + 18 candidates), all within this moment.
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

      out.rows.push({ cluster: seed, context, role, face, outcomes });
      if (process.env.V3P1_PROG && out.moments % 20 === 0) {
        appendFileSync(process.env.V3P1_PROG,
          `[prog] match ${k} moment ${out.moments} t=${((Date.now() - (globalThis as any).__t0) / 1000).toFixed(1)}s\n`);
      }
      m.step(DT);
    }
  }
  return out;
};

// --- statistics: paired candidate−control cluster bootstrap (P1R, PC + gradient) --
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
  return { n: usable.length, point: round(point), lower: round(percentile(draws, 0.025)), upper: round(percentile(draws, 0.975)) };
};

// =============================================================================
// THE PRIMARY — the role SPREAD S with a WITHIN-CLUSTER role-label PERMUTATION null
// =============================================================================
//
// S(context, candidate) = max_r value(context,r,candidate) − min_r value(...) over the
// IN-POWER roles r (§4.1). value(context,r,cand) = mean signed outcome over that role's
// NON-ENDED forks of that candidate. S is a non-negative EXTREME (range) statistic:
// under H0 its bootstrap CI would false-positive (winner's-curse inflation, #20 / house
// law #80.2). So the separation test is a PERMUTATION null, NOT a CI on S.
//
// WHAT IS EXCHANGED UNDER H0 (stated exactly, per the build brief):
//   H0 = "within a context, the ROLE a body plays does not affect the approach value."
//   The exchangeable objects are the per-moment PER-CANDIDATE SIGNED OUTCOME VECTORS.
//   We permute the ROLE LABEL attached to each moment WITHIN each (match-seed × context)
//   BLOCK — i.e. within a match-seed cluster (#20 clustering preserved) AND within a
//   context. A moment KEEPS its context and its 18 fork outcomes; only which role owns
//   that moment's outcome vector is reshuffled, and only among moments sharing the same
//   (match, context). This blocking:
//     • preserves the match-level clustering (#20) — labels never cross a match;
//     • preserves the per-context role mix EXACTLY (§4.1) — each (match,context) block
//       keeps its exact role multiset, so the per-(context × role) MOMENT COUNTS, and
//       hence the in-power set, are INVARIANT across permutations;
//     • isolates the pure role signal — the only thing that varies is the correlation
//       between the role label and the outcome, within matched contexts.
//   A cell RESOLVES role-separated iff observed S exceeds the 97.5th percentile of its
//   permutation distribution (one-sided p < 0.025); BH q=0.05 across the 216 computable
//   cells controls the family-wise discovery rate. Deterministic under the frozen seed.

interface PairwiseStat { diff: number; lower: number; upper: number }
interface SpreadCell {
  context: string;
  cand: string;
  computable: boolean;
  inPowerRoles: Role[];
  nByRole: Record<string, number>;         // NON-ENDED fork count per in-power role
  valueByRole: Record<string, number>;     // signed approach value per in-power role
  S: number;                               // observed range over in-power roles
  argMaxRole: string;
  argMinRole: string;
  permGE: number;                          // #{S_perm >= S_obs}
  permP: number;                           // permGE / PERM_B (one-sided)
  perm97_5: number;                        // 97.5th pct of the permutation distribution
  resolved: boolean;                       // permP < 0.025  (⇔ S_obs > perm97_5)
  resolvedBH: boolean;                     // survives BH q=0.05 across computable cells
  ciLower: number;                         // bootstrap CI on S — REPORTED-only (never the test)
  ciUpper: number;
  pairwise: Record<string, PairwiseStat>;  // secondary: value(r_i)−value(r_j), the DIRECTION
}

const flat = (ctxI: number, roleI: number, candI: number): number => (ctxI * ROLE_AXIS.length + roleI) * N_CAND + candI;
const FLAT_LEN = CONTEXTS.length * ROLE_AXIS.length * N_CAND;

const computePrimary = (rows: readonly MomentRow[]) => {
  // --- cluster index + moment typed arrays ---
  const clusterIds = [...new Set(rows.map((r) => r.cluster))].sort((a, b) => a - b);
  const clusterOf = new Map(clusterIds.map((c, i) => [c, i]));
  const C = clusterIds.length;
  const M = rows.length;

  const momCtx = new Int8Array(M);
  const momRole = new Int8Array(M);
  const momCluster = new Int32Array(M);
  const momSigned = new Float64Array(M * N_CAND);
  const momValid = new Uint8Array(M * N_CAND);

  // per-cluster aggregates keyed by (context, role, candidate) — for the point value,
  // the bootstrap CI on S, and the pairwise CIs (all share one bootstrap draw set).
  const clusterSum: Float64Array[] = Array.from({ length: C }, () => new Float64Array(FLAT_LEN));
  const clusterCnt: Float64Array[] = Array.from({ length: C }, () => new Float64Array(FLAT_LEN));
  // per-(context × role) MOMENT counts — the #24 floor quantity (§2.2).
  const momentCount = new Int32Array(CONTEXTS.length * ROLE_AXIS.length);

  for (let i = 0; i < M; i++) {
    const r = rows[i];
    const ctxI = contextIndex(r.context);
    const roleI = roleIndex(r.role);
    const cj = clusterOf.get(r.cluster)!;
    momCtx[i] = ctxI; momRole[i] = roleI; momCluster[i] = cj;
    momentCount[ctxI * ROLE_AXIS.length + roleI] += 1;
    for (let ci = 0; ci < N_CAND; ci++) {
      const o = r.outcomes[LATTICE[ci].id];
      const valid = o !== undefined && !o.ended;
      const v = valid ? signed(o) : 0;
      momSigned[i * N_CAND + ci] = v;
      momValid[i * N_CAND + ci] = valid ? 1 : 0;
      if (valid) {
        const f = flat(ctxI, roleI, ci);
        clusterSum[cj][f] += v;
        clusterCnt[cj][f] += 1;
      }
    }
  }

  // --- the in-power set (§2.2): per-(context × role) MOMENT count ≥ 150 ---
  const inPowerRoleIdx: number[][] = CONTEXTS.map((_, ctxI) =>
    ROLE_AXIS.map((_r, roleI) => roleI).filter((roleI) => momentCount[ctxI * ROLE_AXIS.length + roleI] >= CELL_FLOOR));

  // full-data totals (for point values), from the per-cluster aggregates
  const fullSum = new Float64Array(FLAT_LEN);
  const fullCnt = new Float64Array(FLAT_LEN);
  for (let cj = 0; cj < C; cj++) {
    const s = clusterSum[cj]; const n = clusterCnt[cj];
    for (let f = 0; f < FLAT_LEN; f++) { fullSum[f] += s[f]; fullCnt[f] += n[f]; }
  }
  const valueAt = (sum: Float64Array, cnt: Float64Array, ctxI: number, roleI: number, ci: number): number => {
    const f = flat(ctxI, roleI, ci);
    return cnt[f] > 0 ? sum[f] / cnt[f] : Number.NaN;
  };
  // S from an aggregate over its in-power roles (finite values only).
  const spreadAt = (sum: Float64Array, cnt: Float64Array, ctxI: number, ci: number): number => {
    let lo = Number.POSITIVE_INFINITY; let hi = Number.NEGATIVE_INFINITY; let k = 0;
    for (const roleI of inPowerRoleIdx[ctxI]) {
      const v = valueAt(sum, cnt, ctxI, roleI, ci);
      if (Number.isFinite(v)) { if (v < lo) lo = v; if (v > hi) hi = v; k += 1; }
    }
    return k >= 2 ? hi - lo : Number.NaN;
  };

  // --- the computable spread cells (§2.2: ≥ 2 in-power roles → 216 cells) ---
  interface CellRef { ctxI: number; ci: number; context: string; cand: string; roles: number[] }
  const computableCells: CellRef[] = [];
  for (let ctxI = 0; ctxI < CONTEXTS.length; ctxI++) {
    const roles = inPowerRoleIdx[ctxI];
    if (roles.length < 2) continue;
    for (let ci = 0; ci < N_CAND; ci++) {
      computableCells.push({ ctxI, ci, context: CONTEXTS[ctxI], cand: LATTICE[ci].id, roles });
    }
  }
  const nComputable = computableCells.length;

  // observed S per computable cell
  const Sobs = computableCells.map((c) => spreadAt(fullSum, fullCnt, c.ctxI, c.ci));

  // -------------------------------------------------------------------------
  // PERMUTATION null (§4.1) — role labels shuffled within (match × context) blocks.
  // -------------------------------------------------------------------------
  // build the blocks (fixed order: cluster then context) for deterministic shuffling
  const blockMap = new Map<number, number[]>();
  for (let i = 0; i < M; i++) {
    const key = momCluster[i] * CONTEXTS.length + momCtx[i];
    const b = blockMap.get(key) ?? [];
    b.push(i);
    blockMap.set(key, b);
  }
  const blocks = [...blockMap.entries()].sort((a, b) => a[0] - b[0]).map(([, idxs]) => idxs);

  const permGE = new Int32Array(nComputable);              // #{S_perm >= S_obs}
  const permDistns: number[][] = computableCells.map(() => []); // for the 97.5 pct (reported)
  const permRole = new Int8Array(M);
  const pSum = new Float64Array(FLAT_LEN);
  const pCnt = new Float64Array(FLAT_LEN);
  const permRng = new Rng(BOOTSTRAP_SEED + 1);
  for (let b = 0; b < PERM_B; b++) {
    // draw a permuted role for every moment, blocking within (match × context)
    for (const block of blocks) {
      // Fisher–Yates over the block's own role labels (multiset preserved exactly)
      const roles = block.map((idx) => momRole[idx]);
      for (let j = roles.length - 1; j > 0; j--) {
        const t = permRng.int(0, j);
        const tmp = roles[j]; roles[j] = roles[t]; roles[t] = tmp;
      }
      for (let j = 0; j < block.length; j++) permRole[block[j]] = roles[j];
    }
    // accumulate per (context, permuted-role, candidate)
    pSum.fill(0); pCnt.fill(0);
    for (let i = 0; i < M; i++) {
      const base = i * N_CAND;
      const ctxI = momCtx[i];
      const roleP = permRole[i];
      const off = (ctxI * ROLE_AXIS.length + roleP) * N_CAND;
      for (let ci = 0; ci < N_CAND; ci++) {
        if (momValid[base + ci]) { pSum[off + ci] += momSigned[base + ci]; pCnt[off + ci] += 1; }
      }
    }
    // recompute S per computable cell; compare to observed
    for (let e = 0; e < nComputable; e++) {
      const c = computableCells[e];
      const s = spreadAt(pSum, pCnt, c.ctxI, c.ci);
      permDistns[e].push(s);
      if (Number.isFinite(s) && Number.isFinite(Sobs[e]) && s >= Sobs[e]) permGE[e] += 1;
    }
  }

  // -------------------------------------------------------------------------
  // BOOTSTRAP CIs (REPORTED-only, §4.1) — one shared cluster-resample set drives the
  // CI on S AND the pairwise diff CIs. NEVER the separation test.
  // -------------------------------------------------------------------------
  const SdrawSorted: number[][] = computableCells.map(() => []);
  // pairwise: per computable cell, the in-power role pairs (i<j) → draws
  const pairKeys: string[][] = computableCells.map((c) =>
    c.roles.flatMap((ri, a) => c.roles.slice(a + 1).map((rj) => `${ROLE_AXIS[ri]}|${ROLE_AXIS[rj]}`)));
  const pairDraws: number[][][] = computableCells.map((c) => {
    const nPairs = (c.roles.length * (c.roles.length - 1)) / 2;
    return Array.from({ length: nPairs }, () => [] as number[]);
  });
  const bSum = new Float64Array(FLAT_LEN);
  const bCnt = new Float64Array(FLAT_LEN);
  const bootRng = new Rng(BOOTSTRAP_SEED + 2);
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    bSum.fill(0); bCnt.fill(0);
    for (let i = 0; i < C; i++) {
      const cj = bootRng.int(0, C - 1);
      const s = clusterSum[cj]; const n = clusterCnt[cj];
      for (let f = 0; f < FLAT_LEN; f++) { bSum[f] += s[f]; bCnt[f] += n[f]; }
    }
    for (let e = 0; e < nComputable; e++) {
      const c = computableCells[e];
      const s = spreadAt(bSum, bCnt, c.ctxI, c.ci);
      if (Number.isFinite(s)) SdrawSorted[e].push(s);
      let pIdx = 0;
      for (let a = 0; a < c.roles.length; a++) {
        const va = valueAt(bSum, bCnt, c.ctxI, c.roles[a], c.ci);
        for (let bb = a + 1; bb < c.roles.length; bb++) {
          const vb = valueAt(bSum, bCnt, c.ctxI, c.roles[bb], c.ci);
          const diff = va - vb;
          if (Number.isFinite(diff)) pairDraws[e][pIdx].push(diff);
          pIdx += 1;
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // assemble per-cell results + BH across the computable family
  // -------------------------------------------------------------------------
  const cells: SpreadCell[] = [];
  const permPs: { e: number; p: number }[] = [];
  for (let e = 0; e < nComputable; e++) {
    const c = computableCells[e];
    const p = permGE[e] / PERM_B;
    permPs.push({ e, p });
    const distn = [...permDistns[e]].filter(Number.isFinite).sort((a, b) => a - b);
    const draws = [...SdrawSorted[e]].sort((a, b) => a - b);
    // value + n + argmax/argmin over in-power roles
    const valueByRole: Record<string, number> = {};
    const nByRole: Record<string, number> = {};
    let lo = Number.POSITIVE_INFINITY; let hi = Number.NEGATIVE_INFINITY;
    let argMin = ''; let argMax = '';
    for (const roleI of c.roles) {
      const f = flat(c.ctxI, roleI, c.ci);
      const v = fullCnt[f] > 0 ? fullSum[f] / fullCnt[f] : Number.NaN;
      valueByRole[ROLE_AXIS[roleI]] = round(v);
      nByRole[ROLE_AXIS[roleI]] = fullCnt[f];
      if (Number.isFinite(v)) {
        if (v < lo) { lo = v; argMin = ROLE_AXIS[roleI]; }
        if (v > hi) { hi = v; argMax = ROLE_AXIS[roleI]; }
      }
    }
    // pairwise
    const pairwise: Record<string, PairwiseStat> = {};
    let pIdx = 0;
    for (let a = 0; a < c.roles.length; a++) {
      const fa = flat(c.ctxI, c.roles[a], c.ci);
      const va = fullCnt[fa] > 0 ? fullSum[fa] / fullCnt[fa] : Number.NaN;
      for (let bb = a + 1; bb < c.roles.length; bb++) {
        const fb = flat(c.ctxI, c.roles[bb], c.ci);
        const vb = fullCnt[fb] > 0 ? fullSum[fb] / fullCnt[fb] : Number.NaN;
        const key = pairKeys[e][pIdx];
        const sortedPair = [...pairDraws[e][pIdx]].sort((x, y) => x - y);
        pairwise[key] = {
          diff: round(va - vb),
          lower: round(percentile(sortedPair, 0.025)),
          upper: round(percentile(sortedPair, 0.975)),
        };
        pIdx += 1;
      }
    }
    cells.push({
      context: c.context, cand: c.cand, computable: true,
      inPowerRoles: c.roles.map((ri) => ROLE_AXIS[ri]),
      nByRole, valueByRole,
      S: round(Sobs[e]), argMaxRole: argMax, argMinRole: argMin,
      permGE: permGE[e], permP: round(p, 6), perm97_5: round(percentile(distn, 0.975)),
      resolved: p < 0.025,
      resolvedBH: false, // filled below
      ciLower: round(percentile(draws, 0.025)), ciUpper: round(percentile(draws, 0.975)),
      pairwise,
    });
  }

  // Benjamini–Hochberg at q = 0.05 across all computable cells (§4.1)
  const sortedByP = [...permPs].sort((a, b) => a.p - b.p);
  let kStar = -1;
  for (let rank = 0; rank < sortedByP.length; rank++) {
    if (sortedByP[rank].p <= ((rank + 1) / nComputable) * BH_Q) kStar = rank;
  }
  let bhResolved = 0;
  if (kStar >= 0) {
    const pThresh = sortedByP[kStar].p;
    for (const cell of cells) if (cell.permP <= pThresh) { cell.resolvedBH = true; bhResolved += 1; }
  }

  const rawResolved = cells.filter((c) => c.resolved).length;
  const nullExpectation = round(0.025 * nComputable, 3);
  // per-context resolved counts (§4.1 reported)
  const perContextResolved = Object.fromEntries(CONTEXTS.map((ctx) => {
    const cs = cells.filter((c) => c.context === ctx);
    return [ctx, {
      computable: cs.length,
      inPowerRoles: inPowerRoleIdx[contextIndex(ctx)].map((ri) => ROLE_AXIS[ri]),
      resolvedRaw: cs.filter((c) => c.resolved).length,
      resolvedBH: cs.filter((c) => c.resolvedBH).length,
    }];
  }));

  return {
    note: 'PRIMARY = role SPREAD S per (context,candidate); separation test = within-(match×context) '
      + 'role-label permutation null (B=' + PERM_B + ', seed ' + (BOOTSTRAP_SEED + 1) + ', p<0.025, BH q=' + BH_Q
      + '); bootstrap CIs on S are REPORTED-only (never the test, house law #80.2).',
    computableCells: nComputable,
    permB: PERM_B,
    bhQ: BH_Q,
    rawResolved,
    bhResolved,
    nullFalsePositiveExpectation: nullExpectation,
    perContextResolved,
    cells,
  };
};

// --- the 864-cell TABLE (context × role × candidate), per-cell fork stats -----
interface TableCell {
  n: number; score: number; concede: number; value: number;
  goalFor: number; goalAgainst: number;
  eta: number; targetError: number; occupancy: number;
  momentN: number; underPowered: boolean;
}
const cellFrom = (os: ForkOutcome[], momentN: number): TableCell => ({
  n: os.length,
  score: round(mean(os.map((o) => (o.score ? 1 : 0)))),
  concede: round(mean(os.map((o) => (o.concede ? 1 : 0)))),
  value: round(mean(os.map(signed))),
  goalFor: round(mean(os.map((o) => (o.goalFor ? 1 : 0)))),
  goalAgainst: round(mean(os.map((o) => (o.goalAgainst ? 1 : 0)))),
  eta: round(mean(os.map((o) => o.eta).filter(Number.isFinite)), 4),
  targetError: round(mean(os.map((o) => o.targetError).filter(Number.isFinite)), 4),
  occupancy: round(mean(os.map((o) => o.occupancy).filter(Number.isFinite)), 4),
  momentN,                                    // §2.2: the #24 floor binds on MOMENTS-per-(context×role)
  underPowered: momentN < CELL_FLOOR,
});

// --- the SAT arm (§2.1 / P1R §4.3): a second deterministic traversal ----------
// mirrors the census sampling loop (V3-P0 placement of lastMomentTime).
const runSatPass = (contexts: readonly string[], ids: readonly string[]) => {
  const byCandidate: Record<string, { uni: number[]; sat: number[] }> = {};
  for (const id of ids) byCandidate[id] = { uni: [], sat: [] };
  let moments = 0;
  let rotation = 0;
  const scratch = newExceptions();
  for (let k = 0; k < MATCH_CAP; k++) {
    const seed = SEED_START + k;
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    while (!m.finished) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      lastMomentTime = m.simTime;
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

  // per-(context × role) MOMENT counts + in-power set (§2.2), cross-checked to V3-P0
  const momentCounts: Record<string, number> = {};
  for (const ctx of CONTEXTS) for (const role of ROLE_AXIS) momentCounts[cellKey(ctx, role)] = 0;
  for (const r of rows) momentCounts[cellKey(r.context, r.role)] += 1;
  const inPowerCells = Object.entries(momentCounts).filter(([, n]) => n >= CELL_FLOOR).map(([k]) => k);
  const underPoweredCells = Object.entries(momentCounts).filter(([, n]) => n < CELL_FLOOR).map(([k]) => k);
  // §2.2: the measured under-powered set must be EXACTLY the 3 published DF cells
  const publishedMatch = underPoweredCells.length === PUBLISHED_UNDERPOWERED.length
    && PUBLISHED_UNDERPOWERED.every((k) => underPoweredCells.includes(k));
  const unexpectedUnderPowered = underPoweredCells.filter((k) => !PUBLISHED_UNDERPOWERED.includes(k));

  // TABLE: context × role × candidate (non-ended forks; momentN keys the floor)
  const table: Record<string, Record<string, Record<string, TableCell>>> = {};
  for (const ctx of CONTEXTS) {
    const ctxRows = rows.filter((r) => r.context === ctx);
    table[ctx] = {};
    for (const role of ROLE_AXIS) {
      const rrRows = ctxRows.filter((r) => r.role === role);
      const momentN = rrRows.length;
      table[ctx][role] = {};
      for (const cand of LATTICE) {
        const os: ForkOutcome[] = [];
        for (const r of rrRows) {
          const o = r.outcomes[cand.id];
          if (o === undefined || o.ended) continue;
          os.push(o);
        }
        table[ctx][role][cand.id] = cellFrom(os, momentN);
      }
    }
  }

  // PRIMARY — the role SPREAD S with the permutation null (§4.1)
  const primary = computePrimary(rows);

  // PC — the power GATE (§5): r21a180 below control, pooled, CI upper < 0, both faces.
  // Gated POOLED (role does not change the PC construction); reported per role (§5).
  const pcAll = pairedCI(rows, PC_ID, 1);
  const pcByFace = Object.fromEntries(FACES.map((f, i) => [
    f, pairedCI(rows.filter((r) => r.face === f), PC_ID, 10 + i),
  ]));
  const pcByRole = Object.fromEntries(ROLE_AXIS.map((role, i) => [
    role, pairedCI(rows.filter((r) => r.role === role), PC_ID, 20 + i),
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

  // X6 — the derived floor (§2.4): re-derived from the run's OWN measured enriched-world
  // clamp share; the hard `unexplained = 0` is UNCONDITIONAL.
  const x6 = c.x6;
  const okDenom = x6.ok + x6.eOnside + x6.eBarred + x6.unexplained;
  const okFraction = okDenom === 0 ? Number.NaN : x6.ok / okDenom;
  const clampShare = okDenom === 0 ? Number.NaN : (x6.eOnside + x6.eBarred) / okDenom;
  const x6FloorDerived = round(1 - 2 * clampShare, 6);
  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.unexplained;

  const cellCount = CONTEXTS.length * ROLE_AXIS.length * LATTICE.length;
  const underPoweredPairs = underPoweredCells.length * LATTICE.length;

  const gates = {
    x4CloneCoverage: c.clonesTaken === c.moments && c.moments > 0,
    x5ControlIdentity: c.x5Checked > 0 && c.x5Mismatched === 0,
    // X6: hard half UNCONDITIONAL (unexplained EXACTLY 0); ok-floor the secondary check
    // against the run's OWN derived floor (§2.4).
    x6ForceFidelity: x6Total > 0 && x6.unexplained === 0
      && (Number.isFinite(okFraction) && Number.isFinite(x6FloorDerived) ? okFraction >= x6FloorDerived : true),
    pcPositiveControl: pcResolves,
  };

  return {
    parameters: {
      seedStart: SEED_START, matchCap: MATCH_CAP,
      block: `${SEED_START}..${SEED_START + MATCH_CAP - 1}`,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, wTicks: W_TICKS,
      hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      hScoreTicks: H_SCORE_TICKS, hConcedeTicks: H_CONCEDE_TICKS,
      warmupTicks: WARMUP_TICKS,
      roleAxis: ROLE_AXIS,
      lattice: LATTICE.map((cand) => cand.id), positiveControl: PC_ID,
      contexts: CONTEXTS, cellFloor: CELL_FLOOR,
      clusterUnit: 'match seed (single contiguous block)',
      bootstrapResamples: BOOTSTRAP_RESAMPLES, permutations: PERM_B, bootstrapSeed: BOOTSTRAP_SEED,
      outcome: 'signed = ANY shot for (H_score) − ANY shot against (H_concede)',
      cellKey: '(context × TRUE role of the forced body × candidate)',
      primaryStatistic: 'role SPREAD S = max_r value − min_r value over in-power roles (§4.1)',
      separationTest: 'within-(match×context) role-label permutation null (§4.1); NOT a CI on S (house law #80.2)',
      estimand: 'the value of committing W to APPROACHING the candidate (#41.2)',
      population: 'station-family ticks only (#40.4 item 2)',
      samplingLoop: 'STAGE3-V3-P0 verbatim (lastMomentTime on every qualifying moment) — counts identical to V3-P0',
    },
    coverage: {
      matchesRun: c.matchesRun, moments: c.moments, qualifying: c.qualifying,
      clonesTaken: c.clonesTaken, cloneCoverage: c.moments === 0 ? Number.NaN : round(c.clonesTaken / c.moments),
      forks: c.moments * (LATTICE.length + 1),
      ballDirectedSkipped: c.ballDirectedSkipped, noPool: c.noPool,
      x5Checked: c.x5Checked, x5Mismatched: c.x5Mismatched,
      cellCount, underPoweredPairs,
      inPowerCellCount: inPowerCells.length, underPoweredCellCount: underPoweredCells.length,
      underPoweredCells,
      publishedUnderPowered: PUBLISHED_UNDERPOWERED,
      publishedUnderPoweredMatch: publishedMatch,
      unexpectedUnderPowered,
      momentCounts,
      contextCounts: Object.fromEntries(CONTEXTS.map((ctx) => [ctx, rows.filter((r) => r.context === ctx).length])),
      roleCounts: Object.fromEntries(ROLE_AXIS.map((role) => [role, rows.filter((r) => r.role === role).length])),
    },
    x6: {
      ...x6, total: x6Total,
      okFraction: round(okFraction, 6), clampShare: round(clampShare, 6),
      floorDerived: x6FloorDerived, floorReference: X6_FLOOR_REF,
    },
    positiveControl: { id: PC_ID, pooled: pcAll, byFace: pcByFace, byRole: pcByRole, resolves: pcResolves },
    gradient: { pooledByCandidate },
    saturation: {
      contexts: bestContexts, nearestByFace, tested: satIds,
      moments: sat.moments, perCandidate: sat.perCandidate,
      band: SAT_BAND, agrees: satAgrees,
      tableStatus: satAgrees ? 'SHIPPING TABLE' : 'DESIGN-CALIBRATION ONLY',
    },
    primary,
    table,
    gates,
  };
};

// --- run: X-DET double run + canonical SHA (§6) ------------------------------
// X-DET covers the WHOLE output incl. the permutation p-values (both runs are seeded
// deterministic; the canonical comparison spans `primary.cells[*].permP/permGE/...`).
(globalThis as any).__t0 = Date.now();
const __mark = (l: string) => { if (process.env.V3P1_PROG) { appendFileSync(process.env.V3P1_PROG, `[mark] ${l} t=${((Date.now() - (globalThis as any).__t0) / 1000).toFixed(1)}s\n`); } };
const first = runCensus(true);
__mark('census-1 done');
const firstSummary = summarise(first);
__mark('summarise-1 done');
const second = runCensus(false);
__mark('census-2 done');
const secondSummary = summarise(second);
__mark('summarise-2 done');
const canonical = (v: unknown): string => JSON.stringify(v);
// receipts are excluded from the determinism/SHA canonicalisation (they are a first-N
// diagnostic ledger; the second run omits them to halve their cost).
const deterministic = canonical(firstSummary) === canonical(secondSummary);
const tableSha = createHash('sha256').update(canonical(firstSummary.table)).digest('hex');
const primarySha = createHash('sha256').update(canonical(firstSummary.primary)).digest('hex');
const sha256 = createHash('sha256').update(canonical(firstSummary)).digest('hex');
const gates = { ...firstSummary.gates, x7Determinism: deterministic };
const verdict = Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL';

const output = {
  experiment: 'STAGE3-V3-P1 (the role-conditioned census)',
  authority: 'STAGE3-V3-P1-ROLE-CENSUS · rulings #79/#80',
  head: '57e3c35 (ruling #79; src byte-identical to V3-P0 HEAD 49ba867)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  ...firstSummary,
  receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(first.receipts).map(([k, v]) => [k, v.length])), records: first.receipts },
  gates,
  deterministic,
  tableSha,
  primarySha,
  sha256,
  verdict,
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `STAGE3-V3-P1 ${verdict}`
  + ` · matches ${output.coverage.matchesRun} moments ${output.coverage.moments} forks ${output.coverage.forks}`
  + ` · clone ${pct(output.coverage.cloneCoverage)}`
  + ` · inPower ${output.coverage.inPowerCellCount}/48 underPow ${output.coverage.underPoweredCellCount}`
  + ` (published-match ${output.coverage.publishedUnderPoweredMatch})`
  + ` · X5 ${output.coverage.x5Checked}/${output.coverage.x5Mismatched} mismatched`
  + ` · X6 ok ${output.x6.ok} onside ${output.x6.eOnside} barred ${output.x6.eBarred}`
  + ` clampShare ${pct(output.x6.clampShare)} floorDerived ${output.x6.floorDerived} (ref ${X6_FLOOR_REF})`
  + ` UNEXPLAINED ${output.x6.unexplained} · reconDiverged ${output.x6.reconstructionDiverged}`
  + ` · PC ${output.positiveControl.pooled.point} CI[${output.positiveControl.pooled.lower}, ${output.positiveControl.pooled.upper}] resolves ${output.positiveControl.resolves}`
  + ` · SPREAD computable ${output.primary.computableCells} rawResolved ${output.primary.rawResolved}`
  + ` BHresolved ${output.primary.bhResolved} (nullExp ${output.primary.nullFalsePositiveExpectation})`
  + ` · SAT ${output.saturation.tableStatus}`
  + ` · cells ${output.coverage.cellCount} underPoweredPairs ${output.coverage.underPoweredPairs}`
  + ` · det ${deterministic} · tableSHA ${tableSha} · primarySHA ${primarySha} · SHA ${sha256}`
  + (failed.length ? ` · FAILED ${failed.join(',')}` : ''),
);
