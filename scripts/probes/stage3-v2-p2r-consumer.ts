// STAGE III V2-P2R — THE CONSUMER, OUT OF SAMPLE, WITH THE ABORTABLE APPROACH
//
// Authority: docs/world-model/STAGE3-V2-P2R-ABORTABLE.md (the frozen spec — V2-P2
// re-run with ONE new break rule, D3-DUPLICATE) · STAGE3-V2-P2-CONSUMER.md IN FULL
// (the harness §2, the estimand §3.1, the disjoint-block methodology §3.2, the DEV
// gate §3.4, the fork-grain mediators §3.4b, the gates §3.5, the decision/exception
// classes §4) · ruling #73 (v2.1 the abortable approach) · ruling #74 (build
// authorized, run supervised) · the committed V2-P1 table (going-conditioned cells,
// tableSha a33e9a73…) + the V2-P2 control-recovery (per-(context × going-bit)
// levels, sha 8bac58da…, guard PASS #71.2, reused byte-identical, NOT re-run).
//
// THE ONE CHANGE is in src (dormant behind the null eye): actionExecutor.ts gains
// D3-DUPLICATE (STAGE3-V2-P2R-ABORTABLE.md §1.4) — at the body's own decision
// cadence during a LIVE DEVIATION window, re-read the OWN percept and recompute the
// going-contributor set G_mid for the committed region; if G_mid \ G_commit ≠ ∅ a
// duplicate is FORMING, the override lapses to incumbent-hold retaining the SAME
// untilTick (the clock is never reset; the ticks already spent are the unrefunded
// price). This probe EXTENDS the P2 consumer with the abort ledger (§4) — the
// D-ABORT class, per-window abort rate, time-to-abort, wasted ticks, contributor
// churn, and the post-abort mirror-preview (§3 R4) — nothing else moves.
//
// The eye is behind Match.stationEye.v2, null in every production path; the table
// and control are INJECTED here, never bundled in src/**; ORACLE-CTX is probe-only
// and asserted unreachable by the pinning tests. Nothing ships (Road B).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { AI_INTERVAL, DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  EYE_LATTICE, EYE_R_M, EYE_W_S, STATION_FAMILY, localXBand, newStationEyeTrace,
  type ControlLevels, type GoingConditionedTable, type StationEyeArm, type StationEyeTrace,
} from '../../src/ai/stationEye';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters (STAGE3-V2-P2R-ABORTABLE.md §7) -----------------------
const W_S = EYE_W_S;                       // 3.0
const W_TICKS = Math.round(W_S / DT);
const R_M = EYE_R_M;                        // 4.0
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const ABORT_INTERVAL_TICKS = Math.round(AI_INTERVAL / DT);   // §1.2: 9 ticks
const MOMENT_SPACING_S = 2.0;
const MATCH_DURATION = 240;
const SEED_START = 9_010_000;              // §7: the fresh disjoint payoff block
const MATCH_CAP = envInt('V2P2R_MATCHES', 160);
const MOMENT_TARGET = envInt('V2P2R_MOMENTS', 12_000);
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 90730;              // §7 frozen (a fresh disjoint seed)
const DEV_FLOOR = 0.22;                     // §5/§6, v1's floor unchanged
const X6_EPS = 1e-9;
const RECEIPT_CAP = 1000;
const TABLE_PATH = 'docs/world-model/data/stage3-v2-p1-anticipatory-table.json';
const CONTROL_PATH = process.env.V2P2R_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v2-p2-control-recovery.json';
const OUT_PATH = process.env.V2P2R_OUT ?? 'docs/world-model/data/stage3-v2-p2r-consumer.json';

/** §7 / #67.3: the ENRICHED consumer world (= the census world, #26.5). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const ARMS = ['neutral', 'gene', 'oracleCtx', 'inverted'] as const;
type Arm = (typeof ARMS)[number];
const CONTROL_ID = 'control';

// --- the injected table + control (never bundled in src/**) ------------------
const rawTable = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string; table: GoingConditionedTable;
};
const goingTable: GoingConditionedTable = rawTable.table;
const tableCanonicalSha = rawTable.tableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: ControlLevels; sha256: string; verdict: string;
  guard: { pass: boolean }; pooledControl: number;
};
const control: ControlLevels = rawControl.control;
const controlSha = rawControl.sha256;

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

const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const dist = (ax: number, ay: number, bx: number, by: number): number => Math.hypot(ax - bx, ay - by);

/** §4 percentiles off a {value → count} histogram (time-to-abort is small-support). */
const histStats = (h: Map<number, number>) => {
  const entries = [...h.entries()].sort((a, b) => a[0] - b[0]);
  let total = 0;
  for (const [, c] of entries) total += c;
  if (total === 0) return { n: 0, min: Number.NaN, max: Number.NaN, p50: Number.NaN, p90: Number.NaN };
  const q = (p: number): number => {
    const target = p * (total - 1);
    let cum = 0;
    for (const [v, c] of entries) { if (cum + c > target) return v; cum += c; }
    return entries[entries.length - 1][0];
  };
  return { n: total, min: entries[0][0], max: entries[entries.length - 1][0], p50: q(0.5), p90: q(0.9) };
};

// --- exception classes (§4, #38.1) -------------------------------------------
interface Exceptions {
  ePaused: number; eCarrier: number; eBallWon: number; eSentOff: number;
  eOnside: number; eBarred: number; eEnded: number; ok: number; unexplained: number;
  eRedecided: number; eNonStation: number;
}
const newExceptions = (): Exceptions => ({
  ePaused: 0, eCarrier: 0, eBallWon: 0, eSentOff: 0,
  eOnside: 0, eBarred: 0, eEnded: 0, ok: 0, unexplained: 0, eRedecided: 0, eNonStation: 0,
});
const addExceptions = (a: Exceptions, b: Exceptions): void => {
  a.ePaused += b.ePaused; a.eCarrier += b.eCarrier; a.eBallWon += b.eBallWon;
  a.eSentOff += b.eSentOff; a.eOnside += b.eOnside; a.eBarred += b.eBarred;
  a.eEnded += b.eEnded; a.ok += b.ok; a.unexplained += b.unexplained;
  a.eRedecided += b.eRedecided; a.eNonStation += b.eNonStation;
};
const addTrace = (a: StationEyeTrace, b: StationEyeTrace): void => {
  a.decisions += b.decisions; a.deviate += b.deviate;
  a.abstainNoSnapshot += b.abstainNoSnapshot; a.abstainNoBall += b.abstainNoBall;
  a.abstainNoOwner += b.abstainNoOwner; a.noCell += b.noCell; a.tie += b.tie;
  a.nonStationTicks += b.nonStationTicks; a.overrideTicks += b.overrideTicks;
  a.ctxSeen += b.ctxSeen; a.ctxAgree += b.ctxAgree; a.ctxAgreeFace += b.ctxAgreeFace;
  a.ctxAgreeThreat += b.ctxAgreeThreat; a.ctxAgreeDensity += b.ctxAgreeDensity;
  for (const [k, v] of b.byCandidate) a.byCandidate.set(k, (a.byCandidate.get(k) ?? 0) + v);
  for (const [k, v] of b.byContext) a.byContext.set(k, (a.byContext.get(k) ?? 0) + v);
  // V2-P2R §4: the abort ledger.
  a.abort += b.abort; a.abortWastedTicks += b.abortWastedTicks;
  a.abortGCommit += b.abortGCommit; a.abortGMid += b.abortGMid;
  a.abortNewContributors += b.abortNewContributors;
  for (const [k, v] of b.abortTicks) a.abortTicks.set(k, (a.abortTicks.get(k) ?? 0) + v);
  for (const [k, v] of b.abortDrivers) a.abortDrivers.set(k, (a.abortDrivers.get(k) ?? 0) + v);
};

interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string): void => {
  const arr = book[cls] ?? (book[cls] = []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

interface ForkOutcome {
  readonly score: boolean;
  readonly concede: boolean;
  readonly goalFor: boolean;
  readonly goalAgainst: boolean;
  readonly ended: boolean;
  readonly deviated: boolean;
  readonly candidateId: string | null;   // NEUTRAL's chosen region (for the mediators)
  readonly eta: number;
  readonly targetError: number;
  readonly occupancy: number;
  // §3.4b geometry mediators, over the FIRST window, vs a fixed ball-local region
  readonly forkSpacing: number;          // min body↔overlapping-teammate distance (NaN if none)
  readonly forkDuprun: number;           // share of window ticks with ≥1 overlapping teammate
  // V2-P2R: the fork-level abort observation (the trace carries the authoritative
  // per-arm ledger; these feed the §3 R4 post-abort mirror-preview).
  readonly aborted: boolean;             // this fork's first deviation window lapsed mid-window
  readonly postAbortUnserved: number;    // 1 if the yielded region went unserved over the remainder, else 0 (NaN if not aborted)
  readonly postAbortBodyServed: number;  // 1 if the incumbent (the body) re-occupied the region, else 0 (NaN if not aborted)
  readonly signature: string;
}

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

/**
 * One fork. `arm === null` is CONTROL (no eye, no abort). `mediatorOffset` fixes the
 * ball-local region over which FORK-SPACING / FORK-DUPRUN are measured across the
 * first window: for NEUTRAL it is null (use the arm's OWN chosen offset once it
 * decides); for CONTROL it is NEUTRAL's chosen offset (the paired counterfactual).
 */
const runFork = (
  before: Match, gid: number, side: number, arm: Arm | null,
  x6: Exceptions, trace: StationEyeTrace | null, receipts: ReceiptBook | null,
  seed: number, decisionTick: number,
  mediatorOffset: { dx: number; dy: number } | null,
  measureMediators: boolean,
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
  const wEnd = startTick + W_TICKS;
  const localTrace = trace === null ? null : newStationEyeTrace();
  if (arm !== null) {
    fork.stationEye = {
      arm: arm as StationEyeArm, scope: { kind: 'body', gid }, table: {},
      v2: { goingTable, control }, trace: localTrace ?? undefined,
    };
  }

  let score = false;
  let goalFor = false;
  let ended = false;
  let deviated = false;
  let candidateId: string | null = null;
  let eta = Number.NaN;
  let insideTicks = 0;
  let errSum = 0;
  let errTicks = 0;
  // mediator accumulators
  let dupTicks = 0;
  let medTicks = 0;
  let spacingMin = Number.NaN;
  // V2-P2R abort observation (fork-level, first-window; §3 R4 mirror-preview)
  let devUntil = -1;
  let devOffset: { dx: number; dy: number } | null = null;
  let aborted = false;
  let abortWindowUntil = -1;
  let abortOffset: { dx: number; dy: number } | null = null;
  let postAbortTicks = 0;
  let postAbortAnyServed = false;
  let postAbortBodyServed = false;

  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    const stBefore = fork.stationEyeState.get(gid);
    const overrideExpected = stBefore !== undefined && stBefore.offset !== null
      && STATION_FAMILY.has(body.action.type);
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;

    fork.step(DT);

    if (arm !== null) {
      const st = fork.stationEyeState.get(gid);
      // V2-P2R: an abort just fired iff a live deviation window (tracked by
      // devUntil/devOffset from a prior tick) is now incumbent-hold with the SAME
      // untilTick, before expiry (the clock was not reset — a re-decision at
      // expiry gets a NEW untilTick and does not match).
      const abortedThisTick = !aborted && devOffset !== null && st !== undefined
        && st.offset === null && st.candidateId === CONTROL_ID
        && st.untilTick === devUntil && fork.simTick < devUntil;
      if (st !== undefined && st.offset !== null && st.candidateId !== CONTROL_ID) {
        deviated = true;
        if (candidateId === null) candidateId = st.candidateId;
        devUntil = st.untilTick;
        devOffset = { dx: st.offset.dx, dy: st.offset.dy };
      } else if (abortedThisTick) {
        aborted = true;
        abortWindowUntil = devUntil;
        abortOffset = devOffset;
      }
      const tr = body.c4Trace;
      // X6 per record (#43.3). Abort ticks (incumbent-hold) are NOT override ticks
      // (§5 X6) — they are excluded from the override tally and counted in the
      // ledger instead.
      if (abortedThisTick) {
        // no-op for X6: the override lapsed this tick, it is a ledger event.
      } else if (tr !== null) {
        if (Math.abs(tr.applied.x - tr.meet.x) <= X6_EPS && Math.abs(tr.applied.y - tr.meet.y) <= X6_EPS) {
          x6.ok += 1;
          if (fork.simTick <= wEnd) {
            const d = Math.hypot(body.pos.x - tr.meet.x, body.pos.y - tr.meet.y);
            errSum += d; errTicks += 1;
            if (d <= 2) { insideTicks += 1; if (!Number.isFinite(eta)) eta = (fork.simTick - startTick) * DT; }
          }
        } else if (body.clampTrace === 'barred') x6.eBarred += 1;
        else if (body.clampTrace === 'onside') x6.eOnside += 1;
        else { x6.unexplained += 1; if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${arm}:clampMiss`); }
      } else if (overrideExpected) {
        const stAfter = st;
        if (pausedBefore || fork.phase !== 'playing') x6.ePaused += 1;
        else if (body.sentOff) x6.eSentOff += 1;
        else if (ownerBefore === body || fork.ball.owner === body) x6.eCarrier += 1;
        else if (!STATION_FAMILY.has(body.action.type)) x6.eNonStation += 1;
        else if (stAfter === undefined || stAfter.untilTick !== stBefore!.untilTick
          || stAfter.candidateId !== stBefore!.candidateId) x6.eRedecided += 1;
        else if (fork.ball.owner !== null && fork.ball.owner.side !== side) x6.eBallWon += 1;
        else { x6.unexplained += 1; if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${arm}:noTrace`); }
      }

      // §3 R4 mirror-preview: over the remainder of the aborted window, did any own
      // outfield teammate (incl. the incumbent body) occupy the yielded region within
      // R? The region tracks the ball. Unserved ⇔ no own body within R on any tick.
      if (aborted && abortOffset !== null && fork.simTick <= abortWindowUntil && fork.phase === 'playing') {
        const rx = fork.ball.pos.x + mine.attackDir * abortOffset.dx;
        const ry = fork.ball.pos.y + abortOffset.dy;
        postAbortTicks += 1;
        for (const q of mine.players) {
          if (q.role === 'GK' || q.sentOff) continue;
          if (dist(q.pos.x, q.pos.y, rx, ry) <= R_M) {
            postAbortAnyServed = true;
            if (q === body) postAbortBodyServed = true;
          }
        }
      }
    }

    // §3.4b: the geometry mediators over the FIRST window, against the fixed
    // ball-local region (NEUTRAL's own choice, or the paired region for CONTROL).
    if (measureMediators && fork.simTick <= wEnd) {
      const off = arm !== null ? (candidateId !== null
        ? EYE_LATTICE.find((c) => c.id === candidateId)! : null) : mediatorOffset;
      if (off !== null && fork.phase === 'playing') {
        const rx = fork.ball.pos.x + mine.attackDir * off.dx;
        const ry = fork.ball.pos.y + off.dy;
        medTicks += 1;
        let overlapping = false;
        let localMin = Number.NaN;
        for (const q of mine.players) {
          if (q === body || q.role === 'GK' || q.sentOff) continue;
          if (dist(q.pos.x + q.vel.x * W_S, q.pos.y + q.vel.y * W_S, rx, ry) <= R_M) {
            overlapping = true;
            const d = dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y);
            if (!Number.isFinite(localMin) || d < localMin) localMin = d;
          }
        }
        if (overlapping) {
          dupTicks += 1;
          if (!Number.isFinite(spacingMin) || localMin < spacingMin) spacingMin = localMin;
        }
      }
    }

    if (fork.simTick - startTick === H_SCORE_TICKS) {
      score = mine.stats.shots > shots0;
      goalFor = mine.stats.goals > goals0;
    }
    if (fork.finished) ended = true;
  }
  if (fork.simTick - startTick < H_SCORE_TICKS) {
    score = mine.stats.shots > shots0;
    goalFor = mine.stats.goals > goals0;
  }
  if (ended) x6.eEnded += 1;
  if (localTrace !== null && trace !== null) addTrace(trace, localTrace);
  fork.stationEye = null;

  return {
    score,
    concede: theirs.stats.shots > conceded0,
    goalFor,
    goalAgainst: theirs.stats.goals > against0,
    ended,
    deviated,
    candidateId,
    eta: Number.isFinite(eta) ? eta : W_S,
    targetError: errTicks === 0 ? Number.NaN : errSum / errTicks,
    occupancy: arm === null ? Number.NaN : insideTicks / W_TICKS,
    forkSpacing: spacingMin,
    forkDuprun: medTicks === 0 ? Number.NaN : dupTicks / medTicks,
    aborted,
    postAbortUnserved: aborted && postAbortTicks > 0 ? (postAbortAnyServed ? 0 : 1) : Number.NaN,
    postAbortBodyServed: aborted && postAbortTicks > 0 ? (postAbortBodyServed ? 1 : 0) : Number.NaN,
    signature: signatureOf(fork),
  };
};

interface MomentRow {
  readonly cluster: number;
  readonly context: string;
  readonly face: 'ours' | 'theirs';
  readonly neutralCandidate: string | null;   // for the geometry mediator side-split
  readonly outcomes: Record<string, ForkOutcome>;
}

// --- the resolved-negative / resolved-positive cell sets (§3.3(a) sign split) --
// NEGATIVE = the going=1 price sits below going=0 (following into cover);
// POSITIVE = going=1 pays (supporting a forward run). Keyed (context × candidate).
const cellSign = (() => {
  const neg = new Set<string>(); const pos = new Set<string>();
  const pc = (JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
    primaryContrast: { perCell: { context: string; cand: string; point: number; lower: number; upper: number; inPower: boolean }[] };
  }).primaryContrast.perCell;
  for (const c of pc) {
    if (!c.inPower) continue;
    if (c.upper < 0) neg.add(`${c.context}||${c.cand}`);
    else if (c.lower > 0) pos.add(`${c.context}||${c.cand}`);
  }
  return { neg, pos };
})();

const runBlock = (seedStart: number, matches: number, momentBudget: number) => {
  const rows: MomentRow[] = [];
  const x6 = newExceptions();
  const receipts: ReceiptBook = {};
  const traces: Record<Arm, StationEyeTrace> = {
    neutral: newStationEyeTrace(), gene: newStationEyeTrace(),
    oracleCtx: newStationEyeTrace(), inverted: newStationEyeTrace(),
  };
  let moments = 0;
  let clonesTaken = 0;
  let x5Checked = 0;
  let x5Mismatched = 0;
  let rotation = 0;
  let ballDirectedSkipped = 0;

  for (let k = 0; k < matches && moments < momentBudget; k++) {
    const seed = seedStart + k;
    const m = matchOf(seed);
    let lastMomentTime = -Infinity;
    while (!m.finished && moments < momentBudget) {
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
      if (!STATION_FAMILY.has(body.action.type)) { ballDirectedSkipped += 1; m.step(DT); continue; }

      let near = 0;
      for (const q of mine.players) {
        if (q === body || q.role === 'GK' || q.sentOff) continue;
        if (dist(q.pos.x, q.pos.y, body.pos.x, body.pos.y) <= 9) near += 1;
      }
      const face = side === owner!.side ? 'ours' : 'theirs';
      const context = `${face}|${localXBand(mine.localX(m.ball.pos.x))}|${near >= 2 ? 'crowded' : 'sparse'}`;

      const clone = cloneSimulationState(m);
      clonesTaken += 1;
      const decisionTick = m.simTick;
      lastMomentTime = m.simTime;
      moments += 1;

      const outcomes: Record<string, ForkOutcome> = {};
      // NEUTRAL first (its chosen region drives the paired mediators).
      const neutral = runFork(clone, body.gid, side, 'neutral', x6, traces.neutral, receipts, seed, decisionTick, null, true);
      outcomes.neutral = neutral;
      const neutralOffset = neutral.candidateId !== null
        ? EYE_LATTICE.find((c) => c.id === neutral.candidateId)! : null;
      // CONTROL, measuring the mediators against NEUTRAL's region (paired).
      const controlFork = runFork(clone, body.gid, side, null, x6, null, receipts, seed, decisionTick,
        neutralOffset === null ? null : { dx: neutralOffset.dx, dy: neutralOffset.dy }, neutralOffset !== null);
      outcomes[CONTROL_ID] = controlFork;
      for (const arm of ['gene', 'oracleCtx', 'inverted'] as const) {
        outcomes[arm] = runFork(clone, body.gid, side, arm, x6, traces[arm], receipts, seed, decisionTick, null, false);
      }

      if (moments % 25 === 0) {
        const plain = cloneSimulationState(clone);
        for (let i = 0; i < H_CONCEDE_TICKS && !plain.finished; i++) plain.step(DT);
        x5Checked += 1;
        if (signatureOf(plain) !== controlFork.signature) x5Mismatched += 1;
      }

      rows.push({ cluster: seed, context, face: face as 'ours' | 'theirs', neutralCandidate: neutral.candidateId, outcomes });
      m.step(DT);
    }
  }
  return { rows, moments, clonesTaken, x5Checked, x5Mismatched, x6, traces, ballDirectedSkipped, receipts };
};

// --- statistics --------------------------------------------------------------
const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);
const pairedCI = (rows: readonly MomentRow[], id: string, offset: number) => {
  const usable = rows.filter((r) => r.outcomes[id] !== undefined
    && !r.outcomes[id].ended && !r.outcomes[CONTROL_ID].ended);
  const byCluster = new Map<number, MomentRow[]>();
  for (const r of usable) { const b = byCluster.get(r.cluster) ?? []; b.push(r); byCluster.set(r.cluster, b); }
  const clusters = [...byCluster.values()];
  const diff = (rs: readonly MomentRow[]) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => signed(r.outcomes[id]) - signed(r.outcomes[CONTROL_ID]))));
  const point = diff(usable);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentRow[] = [];
    for (let i = 0; i < clusters.length; i++) for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    const v = diff(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { n: usable.length, point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};

/** a paired mean of an arbitrary per-moment quantity, NEUTRAL vs CONTROL (mediators). */
const pairedMediatorCI = (
  rows: readonly MomentRow[], pick: (o: ForkOutcome) => number, offset: number,
) => {
  const usable = rows.filter((r) => Number.isFinite(pick(r.outcomes.neutral)) && Number.isFinite(pick(r.outcomes[CONTROL_ID])));
  const byCluster = new Map<number, MomentRow[]>();
  for (const r of usable) { const b = byCluster.get(r.cluster) ?? []; b.push(r); byCluster.set(r.cluster, b); }
  const clusters = [...byCluster.values()];
  const diff = (rs: readonly MomentRow[]) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => pick(r.outcomes.neutral) - pick(r.outcomes[CONTROL_ID]))));
  const point = diff(usable);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentRow[] = [];
    for (let i = 0; i < clusters.length; i++) for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    const v = diff(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return {
    n: usable.length, point: round(point), lower: round(at(0.025)), upper: round(at(0.975)),
    neutralMean: round(mean(usable.map((r) => pick(r.outcomes.neutral))), 4),
    controlMean: round(mean(usable.map((r) => pick(r.outcomes[CONTROL_ID]))), 4),
  };
};

/** V2-P2R §4: the abort ledger for one arm, assembled from its trace + fork rows. */
const abortLedgerOf = (arm: Arm, t: StationEyeTrace, rows: readonly MomentRow[]) => {
  const tta = histStats(t.abortTicks);
  const forksAborted = rows.filter((r) => r.outcomes[arm]?.aborted);
  const unserved = forksAborted.map((r) => r.outcomes[arm].postAbortUnserved).filter(Number.isFinite);
  const bodyServed = forksAborted.map((r) => r.outcomes[arm].postAbortBodyServed).filter(Number.isFinite);
  return {
    deviate: t.deviate,
    abort: t.abort,
    abortRate: round(t.abort / (t.deviate || 1)),          // §4: D-ABORT / D-DEVIATE
    timeToAbort: {
      n: tta.n,
      p50Ticks: tta.p50, p90Ticks: tta.p90, minTicks: tta.min, maxTicks: tta.max,
      p50S: round(tta.p50 * DT, 4), p90S: round(tta.p90 * DT, 4),
      minS: round(tta.min * DT, 4), maxS: round(tta.max * DT, 4),
    },
    wastedTicks: {
      total: t.abortWastedTicks,
      meanPerAbort: round(t.abortWastedTicks / (t.abort || 1), 4),
      meanPerAbortS: round((t.abortWastedTicks / (t.abort || 1)) * DT, 4),
    },
    contributorChurn: {
      gCommitMean: round(t.abortGCommit / (t.abort || 1), 4),
      gMidMean: round(t.abortGMid / (t.abort || 1), 4),
      newContributorsMean: round(t.abortNewContributors / (t.abort || 1), 4),
      distinctDrivers: t.abortDrivers.size,
    },
    // §3 R4 mirror-preview (fork-level; forks whose FIRST deviation window aborted).
    postAbort: {
      forksAborted: forksAborted.length,
      unservedShare: round(mean(unserved), 4),
      incumbentReoccupyShare: round(mean(bodyServed), 4),
    },
  };
};

const runExperiment = () => {
  const rows: MomentRow[] = [];
  const x6 = newExceptions();
  const traces: Record<Arm, StationEyeTrace> = {
    neutral: newStationEyeTrace(), gene: newStationEyeTrace(),
    oracleCtx: newStationEyeTrace(), inverted: newStationEyeTrace(),
  };
  const receipts: ReceiptBook = {};
  let moments = 0; let clonesTaken = 0; let x5Checked = 0; let x5Mismatched = 0; let ballDirectedSkipped = 0;
  const res = runBlock(SEED_START, MATCH_CAP, MOMENT_TARGET);
  for (const r of res.rows) rows.push(r);
  moments += res.moments; clonesTaken += res.clonesTaken;
  x5Checked += res.x5Checked; x5Mismatched += res.x5Mismatched; ballDirectedSkipped += res.ballDirectedSkipped;
  addExceptions(x6, res.x6);
  for (const [cls, arr] of Object.entries(res.receipts)) for (const r of arr) addReceipt(receipts, cls, r.seed, r.tick, r.gid, r.cause);
  for (const arm of ARMS) addTrace(traces[arm], res.traces[arm]);

  const perArm = Object.fromEntries(ARMS.map((arm, i) => {
    const ate = pairedCI(rows, arm, 1 + i);
    const devRows = rows.filter((r) => r.outcomes[arm].deviated);
    const att = pairedCI(devRows, arm, 20 + i);
    const t = traces[arm];
    const abstainUnseen = t.abstainNoSnapshot + t.abstainNoBall + t.abstainNoOwner;
    // §3.4 / §4: the PERCEIVED-ATTAINABLE denominator = decisions NOT unseen and NOT noCell.
    const attainable = t.decisions - abstainUnseen - t.noCell;
    return [arm, {
      ate, att,
      deviationShareByMoment: round(devRows.length / (rows.length || 1)),
      decisions: t.decisions, deviateDecisions: t.deviate,
      abstainUnseen, noCell: t.noCell, tie: t.tie,
      perceivedAttainable: attainable,
      devShareAttainable: round(t.deviate / (attainable || 1)),
      deviationShareByDecision: round(t.deviate / (t.decisions || 1)),
      classes: {
        // §4: D-DEVIATE counts as delivered treatment; D-ABORT is a SUB-tally of it.
        deviate: t.deviate, abort: t.abort,
        abstainUnseen, abstainNoSnapshot: t.abstainNoSnapshot,
        abstainNoBall: t.abstainNoBall, abstainNoOwner: t.abstainNoOwner,
        noCell: t.noCell, tie: t.tie, nonStationTicks: t.nonStationTicks, overrideTicks: t.overrideTicks,
      },
      abortLedger: abortLedgerOf(arm, t, rows),
      ctx: {
        seen: t.ctxSeen, agree: round(t.ctxAgree / (t.ctxSeen || 1)),
        agreeFace: round(t.ctxAgreeFace / (t.ctxSeen || 1)),
        agreeThreat: round(t.ctxAgreeThreat / (t.ctxSeen || 1)),
        agreeDensity: round(t.ctxAgreeDensity / (t.ctxSeen || 1)),
      },
      byCandidate: Object.fromEntries([...t.byCandidate.entries()].sort((a, b) => b[1] - a[1])),
      byContext: Object.fromEntries([...t.byContext.entries()].sort((a, b) => b[1] - a[1])),
      mediators: {
        eta: round(mean(rows.filter((r) => r.outcomes[arm].deviated).map((r) => r.outcomes[arm].eta).filter(Number.isFinite)), 4),
        targetError: round(mean(rows.filter((r) => r.outcomes[arm].deviated).map((r) => r.outcomes[arm].targetError).filter(Number.isFinite)), 4),
        occupancy: round(mean(rows.filter((r) => r.outcomes[arm].deviated).map((r) => r.outcomes[arm].occupancy).filter(Number.isFinite)), 4),
      },
    }];
  })) as Record<Arm, any>;

  // §3.3(a) the deviation geometry: NEUTRAL's chosen-candidate mix by angle/radius.
  const mix = (() => {
    const byAngle: Record<string, number> = {}; const byRadius: Record<string, number> = {};
    let ring180 = 0; let ahead0 = 0; let total = 0;
    for (const [id, count] of traces.neutral.byCandidate) {
      const mm = /^r(\d+)a(\d+)$/.exec(id); if (mm === null) continue;
      const [, r, a] = mm;
      byAngle[a] = (byAngle[a] ?? 0) + count; byRadius[r] = (byRadius[r] ?? 0) + count;
      if (a === '180') ring180 += count; if (a === '0') ahead0 += count; total += count;
    }
    return { byAngle, byRadius, ring180Share: round(ring180 / (total || 1)), ahead0Share: round(ahead0 / (total || 1)), total };
  })();

  // §3.4b the geometry mediators, side-split on the resolved-negative / positive cells.
  const negRows = rows.filter((r) => r.neutralCandidate !== null && cellSign.neg.has(`${r.context}||${r.neutralCandidate}`));
  const posRows = rows.filter((r) => r.neutralCandidate !== null && cellSign.pos.has(`${r.context}||${r.neutralCandidate}`));
  const mediatorGeometry = {
    forkSpacing: {
      all: pairedMediatorCI(rows, (o) => o.forkSpacing, 200),
      negativeCells: pairedMediatorCI(negRows, (o) => o.forkSpacing, 210),
      positiveCells: pairedMediatorCI(posRows, (o) => o.forkSpacing, 220),
    },
    forkDuprun: {
      all: pairedMediatorCI(rows, (o) => o.forkDuprun, 230),
      negativeCells: pairedMediatorCI(negRows, (o) => o.forkDuprun, 240),
      positiveCells: pairedMediatorCI(posRows, (o) => o.forkDuprun, 250),
    },
    negCellDeviations: negRows.length, posCellDeviations: posRows.length,
    note: 'FORK-SPACING/FORK-DUPRUN over the first window vs NEUTRAL\'s chosen region, '
      + 'paired NEUTRAL−CONTROL. H-V2R: FORK-DUPRUN neg FALLS (CI<0) + FORK-SPACING stops closing.',
  };

  // per-context ATE for the primary arm.
  const contexts = [...new Set(rows.map((r) => r.context))].sort();
  const perContext = Object.fromEntries(contexts.map((c, i) => {
    const sub = rows.filter((r) => r.context === c);
    return [c, { n: sub.length, ate: pairedCI(sub, 'neutral', 300 + i) }];
  }));

  // perception price (§5(g)): ORACLE-CTX minus NEUTRAL, reported.
  const perceptionPrice = pairedCI(rows, 'oracleCtx', 400);

  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.eNonStation + x6.eRedecided + x6.unexplained;
  const gates = {
    x4CloneCoverage: clonesTaken === moments && moments > 0,
    x5ControlIdentity: x5Checked > 0 && x5Mismatched === 0,
    x6ForceFidelity: x6Total > 0 && x6.unexplained === 0,
    dev: perArm.neutral.perceivedAttainable > 0 && perArm.neutral.devShareAttainable >= DEV_FLOOR,
    pcInverted: Number.isFinite(perArm.inverted.ate.upper) && perArm.inverted.ate.upper < 0,
  };

  return {
    parameters: {
      seedStart: SEED_START, matchCap: MATCH_CAP, momentTarget: MOMENT_TARGET,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      regionRadiusM: R_M, abortIntervalTicks: ABORT_INTERVAL_TICKS, arms: [CONTROL_ID, ...ARMS], devFloor: DEV_FLOOR,
      tableCanonicalSha, tablePath: TABLE_PATH, controlSha, controlPath: CONTROL_PATH,
      pooledControlRecovered: rawControl.pooledControl, controlGuardPass: rawControl.guard.pass,
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
      clusterUnit: 'match seed', estimand: 'ATE = mean paired VALUE(arm)−VALUE(control) over eligible moments',
      population: 'station-family ticks, DISJOINT payoff block 9.01M',
    },
    coverage: {
      moments, clonesTaken, ballDirectedSkipped,
      cloneCoverage: moments === 0 ? Number.NaN : round(clonesTaken / moments),
      forks: moments * (ARMS.length + 1), x5Checked, x5Mismatched,
      contextCounts: Object.fromEntries(contexts.map((c) => [c, rows.filter((r) => r.context === c).length])),
      endedExcluded: rows.filter((r) => r.outcomes[CONTROL_ID].ended).length,
    },
    x6: { ...x6, total: x6Total, okShare: round(x6.ok / ((x6.ok + x6.eOnside + x6.eBarred + x6.unexplained) || 1)) },
    perArm, deviationMix: mix, mediatorGeometry, perContext, perceptionPrice, gates,
    receipts: { cap: RECEIPT_CAP, counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])), records: receipts },
  };
};

const first = runExperiment();
const second = runExperiment();
const strip = (o: any) => { const { receipts, ...rest } = o; return rest; };
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(strip(first)) === canonical(strip(second));
const sha256 = createHash('sha256').update(canonical(strip(first))).digest('hex');
const gates = { ...first.gates, x7Determinism: deterministic };
const output = {
  experiment: 'STAGE3-V2-P2R (the abortable approach, the consumer, out of sample)',
  authority: 'STAGE3-V2-P2R-ABORTABLE · STAGE3-V2-P2-CONSUMER (in full) · rulings #73/#74',
  head: 'c5f2913 (ruling #68; src = V2-P0 HEAD 92876e5 / V2-P1 + D3-DUPLICATE §1.4)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  ...first, gates, deterministic, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `STAGE3-V2-P2R ${output.verdict}`
  + ` · moments ${output.coverage.moments} forks ${output.coverage.forks} clone ${pct(output.coverage.cloneCoverage)}`
  + ` · X5 ${output.coverage.x5Checked}/${output.coverage.x5Mismatched} · X6 unexpl ${output.x6.unexplained}`
  + ` · NEUTRAL ate ${output.perArm.neutral.ate.point} CI[${output.perArm.neutral.ate.lower},${output.perArm.neutral.ate.upper}]`
  + ` att ${output.perArm.neutral.att.point}`
  + ` · DEV ${pct(output.perArm.neutral.devShareAttainable)} (floor ${DEV_FLOOR})`
  + ` · PC ${output.perArm.inverted.ate.point} CI[${output.perArm.inverted.ate.lower},${output.perArm.inverted.ate.upper}]`
  + ` · ABORT n${output.perArm.neutral.abortLedger.abort} rate ${pct(output.perArm.neutral.abortLedger.abortRate)}`
  + ` t50 ${output.perArm.neutral.abortLedger.timeToAbort.p50S}s`
  + ` · dup neg ${output.mediatorGeometry.forkDuprun.negativeCells.point} pos ${output.mediatorGeometry.forkDuprun.positiveCells.point}`
  + ` · spacing neg ${output.mediatorGeometry.forkSpacing.negativeCells.point}`
  + ` · det ${deterministic} · SHA ${sha256}`
  + (failed.length ? ` · FAILED ${failed.join(',')}` : ''),
);
