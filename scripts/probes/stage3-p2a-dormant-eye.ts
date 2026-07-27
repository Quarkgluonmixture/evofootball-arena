// STAGE III P2-A — THE DORMANT EYE, OUT OF SAMPLE
// Authority: docs/world-model/STAGE3-P2-DORMANT-EYE.md §3 (as amended by
// commander ruling #43.3: X6 binds on per-record fidelity only; the ok-share
// and clamp shares are REPORTED, per candidate × per context).
//
// At sampled station-family moments — the P1R census population verbatim, on a
// DISJOINT seed block — clone the world and run one fork per arm:
//   CONTROL (no eye) · NEUTRAL · GENE · ORACLE-CTX · INVERTED (the argmin PC)
// and compare each arm's signed two-face outcome against the control's, paired
// inside the same clone.
//
// The 40 positive cells were selected on P1R's own sample, so re-scoring the
// chooser there would measure the selection. This block is disjoint by
// construction (§3.2) and the contract predicted the shrinkage before the run.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  EYE_LATTICE, STATION_FAMILY, localXBand, newStationEyeTrace,
  type ApproachTable, type StationEyeArm, type StationEyeTrace,
} from '../../src/ai/stationEye';

// --- frozen parameters (contract §2.2, §3.1, §3.6) ---------------------------
const W_S = 3.0;
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const MOMENT_SPACING_S = 2.0;
/** §3.6: disjoint from P0 (930k), P1 (960k–1.46M) and P1R (980k–1.48M). */
const SEED_START = 2_000_000;
const BLOCK_STRIDE = 100_000;
const SMOKE = process.env.P2A_SMOKE === '1';
const BLOCKS = SMOKE ? 1 : 12;
const MATCHES_PER_BLOCK = SMOKE ? 12 : 250;
const MOMENT_TARGET = SMOKE ? 60 : 12_000;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50041;
/** §3.4 DEV: half the 44.4% the committed table predicts. */
const DEV_FLOOR = 0.22;
const X6_EPS = 1e-9;
const TABLE_PATH = 'docs/world-model/data/stage3-p1r-approach-table.json';

const ARMS = ['neutral', 'gene', 'oracleCtx', 'inverted'] as const;
type Arm = (typeof ARMS)[number];
const CONTROL_ID = 'control';

const table: ApproachTable = JSON.parse(readFileSync(TABLE_PATH, 'utf8')).table as ApproachTable;
const tableSha = createHash('sha256')
  .update(JSON.parse(readFileSync(TABLE_PATH, 'utf8')).tableSha as string).digest('hex');
const tableCanonicalSha = JSON.parse(readFileSync(TABLE_PATH, 'utf8')).tableSha as string;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

// --- standing exception classes (contract §5, boilerplate #38.1) -------------
interface Exceptions {
  ePaused: number; eCarrier: number; eBallWon: number; eSentOff: number;
  eOnside: number; eBarred: number; eEnded: number; ok: number; unexplained: number;
  /** the commitment ended this tick and the eye re-decided (expiry / face flip) */
  eRedecided: number;
  /** the body's action left the station family inside the window (§2.2) */
  eNonStation: number;
}
const newExceptions = (): Exceptions => ({
  ePaused: 0, eCarrier: 0, eBallWon: 0, eSentOff: 0,
  eOnside: 0, eBarred: 0, eEnded: 0, ok: 0, unexplained: 0,
  eRedecided: 0, eNonStation: 0,
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
};

interface ForkOutcome {
  readonly score: boolean;
  readonly concede: boolean;
  readonly goalFor: boolean;
  readonly goalAgainst: boolean;
  readonly ended: boolean;
  readonly deviated: boolean;
  /** M-ETA / M-ERROR / M-OCCUPANCY over the FIRST window (§3.5). */
  readonly eta: number;
  readonly targetError: number;
  readonly occupancy: number;
  readonly signature: string;
}

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

/**
 * One fork. `arm === null` is the CONTROL (no eye) — X5's harness gate compares
 * its signature against the base continuation.
 *
 * The eye stays ARMED for the whole horizon, re-deciding every window: that is
 * the deployment behaviour #41.2's population law points at (the deployed eye
 * perpetually approaches), and it is the object P2 is testing — a chooser, not
 * one forced window.
 */
const runFork = (
  before: Match, gid: number, side: number, arm: Arm | null,
  x6: Exceptions, trace: StationEyeTrace | null, clampMix: Map<string, number>,
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
  const wEnd = startTick + Math.round(W_S / DT);
  const localTrace = trace === null ? null : newStationEyeTrace();
  if (arm !== null) {
    fork.stationEye = {
      arm: arm as StationEyeArm,
      scope: { kind: 'body', gid },
      table,
      trace: localTrace ?? undefined,
    };
  }

  let score = false;
  let goalFor = false;
  let ended = false;
  let deviated = false;
  let eta = Number.NaN;
  let insideTicks = 0;
  let errSum = 0;
  let errTicks = 0;

  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    const stBefore = fork.stationEyeState.get(gid);
    const overrideExpected = stBefore !== undefined && stBefore.offset !== null
      && STATION_FAMILY.has(body.action.type);
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;

    fork.step(DT);

    if (arm !== null) {
      const tr = body.c4Trace;
      if (tr !== null) {
        // X6 per record (#43.3, hard): the applied target must be the engine's
        // own policy target unless a CLAMP rewrote it — and WHICH clamp is read
        // off the engine's own `clampTrace`, never reconstructed from a
        // pre-step guess (the P1 §4.6b defect, in a new place).
        deviated = true;
        if (Math.abs(tr.applied.x - tr.meet.x) <= X6_EPS
          && Math.abs(tr.applied.y - tr.meet.y) <= X6_EPS) {
          x6.ok += 1;
          if (fork.simTick <= wEnd) {
            const d = Math.hypot(body.pos.x - tr.meet.x, body.pos.y - tr.meet.y);
            errSum += d;
            errTicks += 1;
            if (d <= 2) {
              insideTicks += 1;
              if (!Number.isFinite(eta)) eta = (fork.simTick - startTick) * DT;
            }
          }
        } else if (body.clampTrace === 'barred') x6.eBarred += 1;
        else if (body.clampTrace === 'onside') x6.eOnside += 1;
        else x6.unexplained += 1;
        const cand = fork.stationEyeState.get(gid)?.candidateId;
        if (cand !== undefined && body.clampTrace !== null) {
          const key = `${cand}|${body.clampTrace}`;
          clampMix.set(key, (clampMix.get(key) ?? 0) + 1);
        }
      } else if (overrideExpected) {
        const stAfter = fork.stationEyeState.get(gid);
        if (pausedBefore || fork.phase !== 'playing') x6.ePaused += 1;
        else if (body.sentOff) x6.eSentOff += 1;
        else if (ownerBefore === body || fork.ball.owner === body) x6.eCarrier += 1;
        else if (!STATION_FAMILY.has(body.action.type)) x6.eNonStation += 1;
        else if (stAfter === undefined || stAfter.untilTick !== stBefore!.untilTick
          || stAfter.candidateId !== stBefore!.candidateId) x6.eRedecided += 1;
        else if (fork.ball.owner !== null && fork.ball.owner.side !== side) x6.eBallWon += 1;
        else x6.unexplained += 1;
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
    eta: Number.isFinite(eta) ? eta : W_S,
    targetError: errTicks === 0 ? Number.NaN : errSum / errTicks,
    occupancy: arm === null ? Number.NaN : insideTicks / Math.round(W_S / DT),
    signature: signatureOf(fork),
  };
};

interface MomentRow {
  readonly cluster: number;
  readonly context: string;
  readonly face: 'ours' | 'theirs';
  readonly outcomes: Record<string, ForkOutcome>;
}

const runBlock = (
  seedStart: number, matches: number, cluster0: number, momentBudget: number,
) => {
  const rows: MomentRow[] = [];
  const x6 = newExceptions();
  const clampMix = new Map<string, number>();
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
    const m = new Match({
      seed: seedStart + k,
      teamA: team('A', seedStart + k * 2 + 1),
      teamB: team('B', seedStart + k * 2 + 2),
    });
    let lastMomentTime = -Infinity;
    while (!m.finished && moments < momentBudget) {
      const owner = m.ball.owner;
      const qualifies = m.phase === 'playing' && owner !== null
        && m.simTime - lastMomentTime >= MOMENT_SPACING_S;
      if (!qualifies) { m.step(DT); continue; }
      // P1R's sampling verbatim: side alternates on the same stable rotation
      // as the body choice, so both faces are censused (P1 §4.6b's fix).
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
        if (Math.hypot(q.pos.x - body.pos.x, q.pos.y - body.pos.y) <= 9) near += 1;
      }
      const face = side === owner!.side ? 'ours' : 'theirs';
      const context = `${face}|${localXBand(mine.localX(m.ball.pos.x))}|${near >= 2 ? 'crowded' : 'sparse'}`;

      const clone = cloneSimulationState(m);
      clonesTaken += 1;
      lastMomentTime = m.simTime;
      moments += 1;

      const outcomes: Record<string, ForkOutcome> = {};
      const control = runFork(clone, body.gid, side, null, x6, null, clampMix);
      outcomes[CONTROL_ID] = control;
      for (const arm of ARMS) {
        outcomes[arm] = runFork(clone, body.gid, side, arm, x6, traces[arm], clampMix);
      }

      if (moments % 25 === 0) {
        const plain = cloneSimulationState(clone);
        for (let i = 0; i < H_CONCEDE_TICKS && !plain.finished; i++) plain.step(DT);
        x5Checked += 1;
        if (signatureOf(plain) !== control.signature) x5Mismatched += 1;
      }

      rows.push({ cluster: cluster0 + k, context, face: face as 'ours' | 'theirs', outcomes });
      m.step(DT);
    }
  }
  return {
    rows, moments, clonesTaken, x5Checked, x5Mismatched, x6, traces, ballDirectedSkipped, clampMix,
  };
};

// --- statistics ---------------------------------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);

const pairedCI = (
  rows: readonly MomentRow[], id: string, offset: number,
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

const runExperiment = () => {
  const rows: MomentRow[] = [];
  const x6 = newExceptions();
  const traces: Record<Arm, StationEyeTrace> = {
    neutral: newStationEyeTrace(), gene: newStationEyeTrace(),
    oracleCtx: newStationEyeTrace(), inverted: newStationEyeTrace(),
  };
  let moments = 0;
  let clonesTaken = 0;
  let x5Checked = 0;
  let x5Mismatched = 0;
  let ballDirectedSkipped = 0;
  const clampMix = new Map<string, number>();
  const perBlock = Math.ceil(MOMENT_TARGET / BLOCKS);
  for (let b = 0; b < BLOCKS; b++) {
    const res = runBlock(SEED_START + b * BLOCK_STRIDE, MATCHES_PER_BLOCK, b * 100_000, perBlock);
    for (const r of res.rows) rows.push(r);
    moments += res.moments;
    clonesTaken += res.clonesTaken;
    x5Checked += res.x5Checked;
    x5Mismatched += res.x5Mismatched;
    ballDirectedSkipped += res.ballDirectedSkipped;
    addExceptions(x6, res.x6);
    for (const [k, v] of res.clampMix) clampMix.set(k, (clampMix.get(k) ?? 0) + v);
    for (const arm of ARMS) addTrace(traces[arm], res.traces[arm]);
  }

  // PRIMARY (§3.1): the ATE over ALL eligible moments, and the ATT over the
  // moments where the arm actually deviated.
  const perArm = Object.fromEntries(ARMS.map((arm, i) => {
    const ate = pairedCI(rows, arm, 1 + i);
    const devRows = rows.filter((r) => r.outcomes[arm].deviated);
    const att = pairedCI(devRows, arm, 20 + i);
    const t = traces[arm];
    return [arm, {
      ate,
      att,
      deviationShareByMoment: round(devRows.length / (rows.length || 1)),
      decisions: t.decisions,
      deviateDecisions: t.deviate,
      deviationShareByDecision: round(t.deviate / (t.decisions || 1)),
      classes: {
        deviate: t.deviate,
        abstainUnseen: t.abstainNoSnapshot + t.abstainNoBall + t.abstainNoOwner,
        abstainNoSnapshot: t.abstainNoSnapshot,
        abstainNoBall: t.abstainNoBall,
        abstainNoOwner: t.abstainNoOwner,
        noCell: t.noCell,
        tie: t.tie,
        nonStationTicks: t.nonStationTicks,
        overrideTicks: t.overrideTicks,
      },
      ctx: {
        seen: t.ctxSeen,
        agree: round(t.ctxAgree / (t.ctxSeen || 1)),
        agreeFace: round(t.ctxAgreeFace / (t.ctxSeen || 1)),
        agreeThreat: round(t.ctxAgreeThreat / (t.ctxSeen || 1)),
        agreeDensity: round(t.ctxAgreeDensity / (t.ctxSeen || 1)),
      },
      byCandidate: Object.fromEntries([...t.byCandidate.entries()].sort((a, b) => b[1] - a[1])),
      byContext: Object.fromEntries([...t.byContext.entries()].sort((a, b) => b[1] - a[1])),
      mediators: {
        eta: round(mean(rows.filter((r) => r.outcomes[arm].deviated)
          .map((r) => r.outcomes[arm].eta).filter(Number.isFinite)), 4),
        targetError: round(mean(rows.filter((r) => r.outcomes[arm].deviated)
          .map((r) => r.outcomes[arm].targetError).filter(Number.isFinite)), 4),
        occupancy: round(mean(rows.filter((r) => r.outcomes[arm].deviated)
          .map((r) => r.outcomes[arm].occupancy).filter(Number.isFinite)), 4),
      },
    }];
  })) as Record<Arm, ReturnType<typeof pairedCI> extends never ? never : any>;

  // M-DEVIATE, by angle and by radius (#42.2's direction dominance, instrumented)
  const mix = (arm: Arm) => {
    const byAngle: Record<string, number> = {};
    const byRadius: Record<string, number> = {};
    let ring180 = 0;
    let total = 0;
    for (const [id, count] of traces[arm].byCandidate) {
      const cand = EYE_LATTICE.find((c) => c.id === id);
      if (cand === undefined) continue;
      const [, r, a] = /^r(\d+)a(\d+)$/.exec(id)!;
      byAngle[a] = (byAngle[a] ?? 0) + count;
      byRadius[r] = (byRadius[r] ?? 0) + count;
      if (a === '180') ring180 += count;
      total += count;
    }
    return { byAngle, byRadius, ring180Share: round(ring180 / (total || 1)), total };
  };

  // Per-context ATE for the primary arm — where the eye earned or lost it.
  const contexts = [...new Set(rows.map((r) => r.context))].sort();
  const perContext = Object.fromEntries(contexts.map((c, i) => {
    const sub = rows.filter((r) => r.context === c);
    return [c, { n: sub.length, ate: pairedCI(sub, 'neutral', 300 + i) }];
  }));

  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.unexplained;
  const gates = {
    x4CloneCoverage: clonesTaken === moments && moments > 0,
    x5ControlIdentity: x5Checked > 0 && x5Mismatched === 0,
    // #43.3: per-record fidelity only. The ok-share is REPORTED below.
    x6ForceFidelity: x6Total > 0 && x6.unexplained === 0,
    dev: traces.neutral.decisions > 0
      && traces.neutral.deviate / traces.neutral.decisions >= DEV_FLOOR,
    pcInverted: Number.isFinite(perArm.inverted.ate.upper) && perArm.inverted.ate.upper < 0,
  };

  return {
    experiment: 'STAGE3-P2A (the dormant eye, out of sample)',
    authority: 'STAGE3-P2-DORMANT-EYE §3, amended by ruling #43.3',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      momentTarget: MOMENT_TARGET, momentSpacingS: MOMENT_SPACING_S,
      wSeconds: W_S, hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      arms: [CONTROL_ID, ...ARMS], devFloor: DEV_FLOOR,
      tableCanonicalSha, tablePath: TABLE_PATH,
      clusterUnit: 'match seed (disjoint per block)',
      estimand: 'ATE = mean over eligible moments of VALUE(arm) − VALUE(control), paired in-clone',
      population: 'station-family ticks only, P1R verbatim, on a DISJOINT block',
      smoke: SMOKE,
    },
    coverage: {
      moments, clonesTaken, ballDirectedSkipped,
      cloneCoverage: moments === 0 ? Number.NaN : round(clonesTaken / moments),
      forks: moments * (ARMS.length + 1),
      x5Checked, x5Mismatched,
      contextCounts: Object.fromEntries(contexts.map((c) => [c, rows.filter((r) => r.context === c).length])),
      endedExcluded: rows.filter((r) => r.outcomes[CONTROL_ID].ended).length,
    },
    x6: {
      ...x6,
      total: x6Total,
      // REPORTED, never gating (#43.3).
      okShare: round(x6.ok / ((x6.ok + x6.eOnside + x6.eBarred + x6.unexplained) || 1)),
      clampShare: round((x6.eOnside + x6.eBarred)
        / ((x6.ok + x6.eOnside + x6.eBarred + x6.unexplained) || 1)),
      // #43.3's interpretation mediator: WHICH candidate met WHICH clamp.
      byCandidate: Object.fromEntries([...clampMix.entries()].sort((a, b) => b[1] - a[1])),
    },
    perArm,
    deviationMix: Object.fromEntries(ARMS.map((a) => [a, mix(a)])),
    perContext,
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(first) === canonical(second);
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');
const gates = { ...first.gates, x7Determinism: deterministic };
const output = {
  ...first, gates, sha256, tableSha,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};
console.log(JSON.stringify(output, null, 2));
if (!SMOKE) {
  writeFileSync('docs/world-model/data/stage3-p2a-eye-results.json',
    `${JSON.stringify(output, null, 2)}\n`);
}

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
console.error(
  `STAGE3-P2A ${output.verdict}`
  + ` · moments ${output.coverage.moments} forks ${output.coverage.forks}`
  + ` clone ${pct(output.coverage.cloneCoverage)}`
  + ` · X5 ${output.coverage.x5Checked}/${output.coverage.x5Mismatched}`
  + ` · X6 ok ${output.x6.ok} onside ${output.x6.eOnside} barred ${output.x6.eBarred}`
  + ` paused ${output.x6.ePaused} carrier ${output.x6.eCarrier} ballWon ${output.x6.eBallWon}`
  + ` UNEXPLAINED ${output.x6.unexplained} okShare ${pct(output.x6.okShare)}`
  + ` · NEUTRAL ate ${output.perArm.neutral.ate.point}`
  + ` CI[${output.perArm.neutral.ate.lower}, ${output.perArm.neutral.ate.upper}]`
  + ` dev ${pct(output.perArm.neutral.deviationShareByDecision)}`
  + ` · GENE ate ${output.perArm.gene.ate.point}`
  + ` · ORACLE ate ${output.perArm.oracleCtx.ate.point}`
  + ` · PC(inverted) ${output.perArm.inverted.ate.point}`
  + ` CI[${output.perArm.inverted.ate.lower}, ${output.perArm.inverted.ate.upper}]`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
