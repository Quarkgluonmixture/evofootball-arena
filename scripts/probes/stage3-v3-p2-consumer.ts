// STAGE III V3-P2 — THE ROLE-EYE CONSUMER, OUT OF SAMPLE (the payoff probe)
//
// Authority: docs/world-model/STAGE3-V3-P2-ROLE-CONSUMER.md (the frozen spec — the
// V2-P2 harness reused VERBATIM, role-conditioned per §3.2/§3.4; five arms §5.1;
// paired same-seed forks; disjoint payoff block §6; DEV on the PERCEIVED-attainable
// denominator §7; PC hard §5.3; the convergence mediators PRIMARY §5.4, split BY ROLE
// AND by resolved-cell membership; the perceptionPrice = ORACLE − NEUTRAL fix §5.2;
// receipts §5.3; X-family §5.3) · rulings #82/#83 (build + the resident runs #49.5) ·
// the committed V3-P1 table (the role-conditioned cells, tableSha 171a6dad…) + the
// V3-P2 control-recovery (the per-(context × role) control levels, §4).
//
// The eye is behind Match.stationEye.v3, null in every production path; the table and
// control are INJECTED here, never bundled in src/**; ORACLE-CTX is probe-only and
// asserted unreachable by the pinning tests. NO going-bit, NO brake (dormant #77.2(iii)).
// Nothing ships (Road B).
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Role, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  EYE_LATTICE, EYE_R_M, EYE_W_S, STATION_FAMILY, localXBand, newStationEyeTrace,
  type RoleConditionedTable, type RoleControlLevels, type StationEyeArm, type StationEyeTrace,
} from '../../src/ai/stationEye';

const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const v = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(v) ? v : def;
};

// --- frozen parameters (§6) --------------------------------------------------
const W_S = EYE_W_S;                       // 3.0
const W_TICKS = Math.round(W_S / DT);
const R_M = EYE_R_M;                        // 4.0
const H_SCORE_S = 6.0;
const H_CONCEDE_S = 10.0;
const H_SCORE_TICKS = Math.round(H_SCORE_S / DT);
const H_CONCEDE_TICKS = Math.round(H_CONCEDE_S / DT);
const MOMENT_SPACING_S = 2.0;
const MATCH_DURATION = 240;
const SEED_START = 9_210_000;              // §6: the disjoint payoff block (9.21M)
const MATCH_CAP = envInt('V3P2_MATCHES', 160);
const MOMENT_TARGET = envInt('V3P2_MOMENTS', 12_000);
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 92110;              // §6 frozen (fresh, disjoint from 91110/91100/50070)
const DEV_FLOOR = 0.22;                     // §5.3/§7, carried unchanged
const X6_EPS = 1e-9;
const RECEIPT_CAP = 1000;
const ROLE_AXIS: readonly Role[] = ['DF', 'MF', 'WG', 'ST'];
const TABLE_PATH = 'docs/world-model/data/stage3-v3-p1-role-census-table.json';
const CONTROL_PATH = process.env.V3P2_CONTROL_PATH
  ?? 'docs/world-model/data/stage3-v3-p2-control-recovery.json';
const OUT_PATH = process.env.V3P2_OUT ?? 'docs/world-model/data/stage3-v3-p2-role-consumer.json';

/** §6 / #67.3: the ENRICHED consumer world (= the census world, #26.5). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;

const ARMS = ['neutral', 'gene', 'oracleCtx', 'inverted'] as const;
type Arm = (typeof ARMS)[number];
const CONTROL_ID = 'control';

// --- the injected table + control (never bundled in src/**) ------------------
const rawTable = JSON.parse(readFileSync(TABLE_PATH, 'utf8')) as {
  tableSha: string; table: RoleConditionedTable;
  primary: { cells: { context: string; cand: string; resolvedBH: boolean }[] };
};
const roleTable: RoleConditionedTable = rawTable.table;
const tableCanonicalSha = rawTable.tableSha;
const rawControl = JSON.parse(readFileSync(CONTROL_PATH, 'utf8')) as {
  control: RoleControlLevels; sha256: string; verdict: string;
  guard: { pass: boolean }; pooledControl: number;
};
const control: RoleControlLevels = rawControl.control;
const controlSha = rawControl.sha256;

// --- the 16 BH-resolved (context × candidate) cells (§2.2 / §5.4) ------------
const resolvedCellSet = (() => {
  const set = new Set<string>();
  for (const c of rawTable.primary.cells) if (c.resolvedBH) set.add(`${c.context}||${c.cand}`);
  return set;
})();

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

// --- exception classes (§5.3, #38.1) -----------------------------------------
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
  readonly candidateId: string | null;
  readonly eta: number;
  readonly targetError: number;
  readonly occupancy: number;
  readonly forkSpacing: number;
  readonly forkDuprun: number;
  readonly signature: string;
}

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

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
      v3: { roleTable, control }, trace: localTrace ?? undefined,
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
  let dupTicks = 0;
  let medTicks = 0;
  let spacingMin = Number.NaN;

  while (!fork.finished && fork.simTick - startTick < H_CONCEDE_TICKS) {
    const stBefore = fork.stationEyeState.get(gid);
    const overrideExpected = stBefore !== undefined && stBefore.offset !== null
      && STATION_FAMILY.has(body.action.type);
    const pausedBefore = fork.phase !== 'playing';
    const ownerBefore = fork.ball.owner;

    fork.step(DT);

    if (arm !== null) {
      const st = fork.stationEyeState.get(gid);
      if (st !== undefined && st.offset !== null && st.candidateId !== 'control') {
        deviated = true;
        if (candidateId === null) candidateId = st.candidateId;
      }
      const tr = body.c4Trace;
      if (tr !== null) {
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
        const stAfter = fork.stationEyeState.get(gid);
        if (pausedBefore || fork.phase !== 'playing') x6.ePaused += 1;
        else if (body.sentOff) x6.eSentOff += 1;
        else if (ownerBefore === body || fork.ball.owner === body) x6.eCarrier += 1;
        else if (!STATION_FAMILY.has(body.action.type)) x6.eNonStation += 1;
        else if (stAfter === undefined || stAfter.untilTick !== stBefore!.untilTick
          || stAfter.candidateId !== stBefore!.candidateId) x6.eRedecided += 1;
        else if (fork.ball.owner !== null && fork.ball.owner.side !== side) x6.eBallWon += 1;
        else { x6.unexplained += 1; if (receipts) addReceipt(receipts, 'unexplained', seed, decisionTick, gid, `${arm}:noTrace`); }
      }
    }

    // §5.4: the convergence mediators over the FIRST window, against the fixed ball-
    // local region (NEUTRAL's own choice, or the paired region for CONTROL).
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
    ended, deviated, candidateId,
    eta: Number.isFinite(eta) ? eta : W_S,
    targetError: errTicks === 0 ? Number.NaN : errSum / errTicks,
    occupancy: arm === null ? Number.NaN : insideTicks / W_TICKS,
    forkSpacing: spacingMin,
    forkDuprun: medTicks === 0 ? Number.NaN : dupTicks / medTicks,
    signature: signatureOf(fork),
  };
};

interface MomentRow {
  readonly cluster: number;
  readonly context: string;
  readonly face: 'ours' | 'theirs';
  readonly role: Role;                        // §3.2: the body's OWN role (keys the mediator split)
  readonly neutralCandidate: string | null;
  readonly outcomes: Record<string, ForkOutcome>;
}

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
      const role = body.role as Role;

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

      rows.push({ cluster: seed, context, face: face as 'ours' | 'theirs', role, neutralCandidate: neutral.candidateId, outcomes });
      m.step(DT);
    }
  }
  return { rows, moments, clonesTaken, x5Checked, x5Mismatched, x6, traces, ballDirectedSkipped, receipts };
};

// --- statistics --------------------------------------------------------------
const signed = (o: ForkOutcome): number => (o.score ? 1 : 0) - (o.concede ? 1 : 0);
const bootstrap = (
  usable: readonly MomentRow[], diffOf: (rs: readonly MomentRow[]) => number, offset: number,
) => {
  const byCluster = new Map<number, MomentRow[]>();
  for (const r of usable) { const b = byCluster.get(r.cluster) ?? []; b.push(r); byCluster.set(r.cluster, b); }
  const clusters = [...byCluster.values()];
  const point = diffOf(usable);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: MomentRow[] = [];
    for (let i = 0; i < clusters.length; i++) for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    const v = diffOf(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { n: usable.length, point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};
/** paired VALUE(arm) − VALUE(control) over eligible moments (the ATE / ATT). */
const pairedCI = (rows: readonly MomentRow[], id: string, offset: number) => {
  const usable = rows.filter((r) => r.outcomes[id] !== undefined
    && !r.outcomes[id].ended && !r.outcomes[CONTROL_ID].ended);
  return bootstrap(usable, (rs) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => signed(r.outcomes[id]) - signed(r.outcomes[CONTROL_ID])))), offset);
};
/** §5.2: paired VALUE(idA) − VALUE(idB), the two-arm within-clone difference. */
const pairedArmDiffCI = (rows: readonly MomentRow[], idA: string, idB: string, offset: number) => {
  const usable = rows.filter((r) => r.outcomes[idA] !== undefined && r.outcomes[idB] !== undefined
    && !r.outcomes[idA].ended && !r.outcomes[idB].ended);
  return bootstrap(usable, (rs) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => signed(r.outcomes[idA]) - signed(r.outcomes[idB])))), offset);
};
/** a paired mean of an arbitrary per-moment quantity, NEUTRAL vs CONTROL (mediators). */
const pairedMediatorCI = (
  rows: readonly MomentRow[], pick: (o: ForkOutcome) => number, offset: number,
) => {
  const usable = rows.filter((r) => Number.isFinite(pick(r.outcomes.neutral)) && Number.isFinite(pick(r.outcomes[CONTROL_ID])));
  const res = bootstrap(usable, (rs) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => pick(r.outcomes.neutral) - pick(r.outcomes[CONTROL_ID])))), offset);
  return {
    ...res,
    neutralMean: round(mean(usable.map((r) => pick(r.outcomes.neutral))), 4),
    controlMean: round(mean(usable.map((r) => pick(r.outcomes[CONTROL_ID]))), 4),
  };
};

const roleMix = (trace: StationEyeTrace) => {
  const byAngle: Record<string, number> = {}; const byRadius: Record<string, number> = {};
  let ring180 = 0; let ahead0 = 0; let total = 0;
  for (const [id, count] of trace.byCandidate) {
    const mm = /^r(\d+)a(\d+)$/.exec(id); if (mm === null) continue;
    const [, r, a] = mm;
    byAngle[a] = (byAngle[a] ?? 0) + count; byRadius[r] = (byRadius[r] ?? 0) + count;
    if (a === '180') ring180 += count; if (a === '0') ahead0 += count; total += count;
  }
  return {
    byAngle: Object.fromEntries(Object.entries(byAngle).map(([k, v]) => [k, round(v / (total || 1), 4)])),
    byRadius: Object.fromEntries(Object.entries(byRadius).map(([k, v]) => [k, round(v / (total || 1), 4)])),
    ring180Share: round(ring180 / (total || 1), 4), ahead0Share: round(ahead0 / (total || 1), 4), total,
  };
};

const runExperiment = () => {
  const res = runBlock(SEED_START, MATCH_CAP, MOMENT_TARGET);
  const rows = res.rows;
  const { x6, traces, receipts } = res;
  const moments = res.moments;

  const perArm = Object.fromEntries(ARMS.map((arm, i) => {
    const ate = pairedCI(rows, arm, 1 + i);
    const devRows = rows.filter((r) => r.outcomes[arm].deviated);
    const att = pairedCI(devRows, arm, 20 + i);
    const t = traces[arm];
    const abstainUnseen = t.abstainNoSnapshot + t.abstainNoBall + t.abstainNoOwner;
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
        deviate: t.deviate, abstainUnseen, abstainNoSnapshot: t.abstainNoSnapshot,
        abstainNoBall: t.abstainNoBall, abstainNoOwner: t.abstainNoOwner,
        noCell: t.noCell, tie: t.tie, nonStationTicks: t.nonStationTicks, overrideTicks: t.overrideTicks,
      },
      ctx: {
        seen: t.ctxSeen, agree: round(t.ctxAgree / (t.ctxSeen || 1)),
        agreeFace: round(t.ctxAgreeFace / (t.ctxSeen || 1)),
        agreeThreat: round(t.ctxAgreeThreat / (t.ctxSeen || 1)),
        agreeDensity: round(t.ctxAgreeDensity / (t.ctxSeen || 1)),
      },
      byCandidate: Object.fromEntries([...t.byCandidate.entries()].sort((a, b) => b[1] - a[1])),
      byContext: Object.fromEntries([...t.byContext.entries()].sort((a, b) => b[1] - a[1])),
      mediators: {
        eta: round(mean(devRows.map((r) => r.outcomes[arm].eta).filter(Number.isFinite)), 4),
        targetError: round(mean(devRows.map((r) => r.outcomes[arm].targetError).filter(Number.isFinite)), 4),
        occupancy: round(mean(devRows.map((r) => r.outcomes[arm].occupancy).filter(Number.isFinite)), 4),
      },
    }];
  })) as Record<Arm, any>;

  // §2.3 / §5.4 the NEUTRAL deviation mix (angle/radius), pooled and PER ROLE.
  const deviationMix = roleMix(traces.neutral);

  // §5.4 the convergence mediators, split BY ROLE and by RESOLVED-CELL membership.
  const resolvedRows = rows.filter((r) => r.neutralCandidate !== null && resolvedCellSet.has(`${r.context}||${r.neutralCandidate}`));
  const unresolvedRows = rows.filter((r) => r.neutralCandidate !== null && !resolvedCellSet.has(`${r.context}||${r.neutralCandidate}`));
  const roleRows = Object.fromEntries(ROLE_AXIS.map((role) => [role, rows.filter((r) => r.role === role)])) as Record<Role, MomentRow[]>;

  const spacingSplit = {
    all: pairedMediatorCI(rows, (o) => o.forkSpacing, 200),
    resolvedCells: pairedMediatorCI(resolvedRows, (o) => o.forkSpacing, 210),
    unresolvedCells: pairedMediatorCI(unresolvedRows, (o) => o.forkSpacing, 220),
    byRole: Object.fromEntries(ROLE_AXIS.map((role, i) => [role, pairedMediatorCI(roleRows[role], (o) => o.forkSpacing, 260 + i)])),
  };
  const duprunSplit = {
    all: pairedMediatorCI(rows, (o) => o.forkDuprun, 230),
    resolvedCells: pairedMediatorCI(resolvedRows, (o) => o.forkDuprun, 240),
    unresolvedCells: pairedMediatorCI(unresolvedRows, (o) => o.forkDuprun, 250),
    byRole: Object.fromEntries(ROLE_AXIS.map((role, i) => [role, pairedMediatorCI(roleRows[role], (o) => o.forkDuprun, 270 + i)])),
  };
  // §5.4 PER-ROLE MIX: the deviation angle × radius mix per role (the between-role split).
  const perRoleMix = Object.fromEntries(ROLE_AXIS.map((role) => {
    const t = newStationEyeTrace();
    for (const r of roleRows[role]) {
      if (r.neutralCandidate === null) continue;
      t.byCandidate.set(r.neutralCandidate, (t.byCandidate.get(r.neutralCandidate) ?? 0) + 1);
    }
    return [role, roleMix(t)];
  }));
  const mediatorGeometry = {
    forkSpacing: spacingSplit, forkDuprun: duprunSplit, perRoleMix,
    resolvedCellDeviations: resolvedRows.length, unresolvedCellDeviations: unresolvedRows.length,
    resolvedCellCount: resolvedCellSet.size,
    note: 'FORK-SPACING/FORK-DUPRUN over the first window vs NEUTRAL\'s chosen region, paired '
      + 'NEUTRAL−CONTROL. H-V3: spacing OPENS (>0) + duprun FALLS (<0), strongest on the resolved cells; '
      + 'per-role mixes DISTINCT (the between-role split §2.3).',
  };

  // per-context ATE for the PRIMARY arm.
  const contexts = [...new Set(rows.map((r) => r.context))].sort();
  const perContext = Object.fromEntries(contexts.map((c, i) => {
    const sub = rows.filter((r) => r.context === c);
    return [c, { n: sub.length, ate: pairedCI(sub, 'neutral', 300 + i) }];
  }));
  // per-role ATE (reported).
  const perRole = Object.fromEntries(ROLE_AXIS.map((role, i) => [role, {
    n: roleRows[role].length, ate: pairedCI(roleRows[role], 'neutral', 320 + i),
    devShareByMoment: round(roleRows[role].filter((r) => r.outcomes.neutral.deviated).length / (roleRows[role].length || 1)),
  }]));

  // §5.2 perception price = ORACLE-CTX − NEUTRAL (the CORRECTED field), paired within-clone.
  const perceptionPrice = pairedArmDiffCI(rows, 'oracleCtx', 'neutral', 400);
  // the §5.2 identity self-check: over rows where oracle/neutral/control all non-ended,
  // paired(ORACLE−NEUTRAL) == ate(ORACLE) − ate(NEUTRAL) EXACTLY (same row set).
  const triRows = rows.filter((r) => !r.outcomes.oracleCtx.ended && !r.outcomes.neutral.ended && !r.outcomes[CONTROL_ID].ended);
  const ppPaired = mean(triRows.map((r) => signed(r.outcomes.oracleCtx) - signed(r.outcomes.neutral)));
  const oracleAteTri = mean(triRows.map((r) => signed(r.outcomes.oracleCtx) - signed(r.outcomes[CONTROL_ID])));
  const neutralAteTri = mean(triRows.map((r) => signed(r.outcomes.neutral) - signed(r.outcomes[CONTROL_ID])));
  const perceptionPriceIdentity = {
    n: triRows.length,
    paired: round(ppPaired), oracleMinusNeutralViaAtes: round(oracleAteTri - neutralAteTri),
    holds: Number.isFinite(ppPaired) ? Math.abs(ppPaired - (oracleAteTri - neutralAteTri)) < 1e-9 : true,
    note: 'field = ORACLE − NEUTRAL (§5.2), NOT ORACLE − CONTROL (the diagnosed :546 mislabel).',
  };

  const x6Total = x6.ok + x6.ePaused + x6.eCarrier + x6.eBallWon + x6.eSentOff
    + x6.eOnside + x6.eBarred + x6.eNonStation + x6.eRedecided + x6.unexplained;
  const gates = {
    x4CloneCoverage: res.clonesTaken === moments && moments > 0,
    x5ControlIdentity: res.x5Checked > 0 && res.x5Mismatched === 0,
    x6ForceFidelity: x6Total > 0 && x6.unexplained === 0,
    dev: perArm.neutral.perceivedAttainable > 0 && perArm.neutral.devShareAttainable >= DEV_FLOOR,
    pcInverted: Number.isFinite(perArm.inverted.ate.upper) && perArm.inverted.ate.upper < 0,
    perceptionPriceIdentity: perceptionPriceIdentity.holds,
  };

  return {
    parameters: {
      seedStart: SEED_START, matchCap: MATCH_CAP, momentTarget: MOMENT_TARGET,
      momentSpacingS: MOMENT_SPACING_S, wSeconds: W_S, hScoreSeconds: H_SCORE_S, hConcedeSeconds: H_CONCEDE_S,
      regionRadiusM: R_M, arms: [CONTROL_ID, ...ARMS], devFloor: DEV_FLOOR, roleAxis: ROLE_AXIS,
      tableCanonicalSha, tablePath: TABLE_PATH, controlSha, controlPath: CONTROL_PATH,
      pooledControlRecovered: rawControl.pooledControl, controlGuardPass: rawControl.guard.pass,
      resolvedCellCount: resolvedCellSet.size,
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
      clusterUnit: 'match seed', estimand: 'ATE = mean paired VALUE(arm)−VALUE(control) over eligible moments',
      population: 'station-family ticks, DISJOINT payoff block 9.21M',
    },
    coverage: {
      moments, clonesTaken: res.clonesTaken, ballDirectedSkipped: res.ballDirectedSkipped,
      cloneCoverage: moments === 0 ? Number.NaN : round(res.clonesTaken / moments),
      forks: moments * (ARMS.length + 1), x5Checked: res.x5Checked, x5Mismatched: res.x5Mismatched,
      contextCounts: Object.fromEntries(contexts.map((c) => [c, rows.filter((r) => r.context === c).length])),
      roleCounts: Object.fromEntries(ROLE_AXIS.map((role) => [role, roleRows[role].length])),
      endedExcluded: rows.filter((r) => r.outcomes[CONTROL_ID].ended).length,
    },
    x6: { ...x6, total: x6Total, okShare: round(x6.ok / ((x6.ok + x6.eOnside + x6.eBarred + x6.unexplained) || 1)) },
    perArm, deviationMix, mediatorGeometry, perContext, perRole,
    perceptionPrice, perceptionPriceIdentity, gates,
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
  experiment: 'STAGE3-V3-P2 (the role-eye consumer, out of sample)',
  authority: 'STAGE3-V3-P2-ROLE-CONSUMER · rulings #82/#83',
  head: '57e3c35 (ruling #79; src byte-identical to V3-P0 HEAD 49ba867)',
  world: 'ENRICHED (edsPerceivedDefence+Choice+valueAxis, c5Hold, c6Carry, c7Windup; c5TouchFork off; #67.3)',
  flags: CENSUS_FLAGS,
  ...first, gates, deterministic, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};
writeFileSync(OUT_PATH, `${JSON.stringify(output, null, 2)}\n`);

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const failed = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `STAGE3-V3-P2 ${output.verdict}`
  + ` · moments ${output.coverage.moments} forks ${output.coverage.forks} clone ${pct(output.coverage.cloneCoverage)}`
  + ` · X5 ${output.coverage.x5Checked}/${output.coverage.x5Mismatched} · X6 unexpl ${output.x6.unexplained}`
  + ` · NEUTRAL ate ${output.perArm.neutral.ate.point} CI[${output.perArm.neutral.ate.lower},${output.perArm.neutral.ate.upper}]`
  + ` · DEV ${pct(output.perArm.neutral.devShareAttainable)} (floor ${DEV_FLOOR})`
  + ` · PC ${output.perArm.inverted.ate.point} CI[${output.perArm.inverted.ate.lower},${output.perArm.inverted.ate.upper}]`
  + ` · spacing all ${output.mediatorGeometry.forkSpacing.all.point} resolved ${output.mediatorGeometry.forkSpacing.resolvedCells.point}`
  + ` · dup all ${output.mediatorGeometry.forkDuprun.all.point} resolved ${output.mediatorGeometry.forkDuprun.resolvedCells.point}`
  + ` · percPrice ${output.perceptionPrice.point} (identity ${output.perceptionPriceIdentity.holds})`
  + ` · det ${deterministic} · SHA ${sha256}`
  + (failed.length ? ` · FAILED ${failed.join(',')}` : ''),
);
