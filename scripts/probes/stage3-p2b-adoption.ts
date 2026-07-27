// STAGE III P2-B — THE DEPLOYMENT AND THE ADOPTION LADDER
// Authority: docs/world-model/STAGE3-P2-DORMANT-EYE.md §4 (§4.1 rungs, §4.2
// P0's seven instruments side-split, §4.3 the two reverts' canaries HARD,
// §4.4 the degenerate attractor, §4.5 reported, §4.6 staging).
//
// The same eye, armed across the adoption ladder on the SAME seeds, measured
// against the R0 control arm of those seeds — never against P0's published
// numbers, which ran on a different block (P0 §5's own rule).
//
// Nothing here ships: every arm is a probe-side flag and the shipped world is
// the R0 arm, which must reproduce it bit-identically.
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { formationSpot, runTarget, supportSpot } from '../../src/ai/formations';
import { BOX_DEPTH, BOX_WIDTH, DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  EYE_LATTICE, newStationEyeTrace, type ApproachTable, type StationEyeArm, type StationEyeTrace,
} from '../../src/ai/stationEye';

// --- staging, frozen (contract §4.6) -----------------------------------------
const SEED_START = 3_500_000;
const BLOCK_STRIDE = 100_000;
const SMOKE = process.env.P2B_SMOKE === '1';
const BLOCKS = SMOKE ? 1 : 4;
const MATCHES_PER_BLOCK = SMOKE ? 4 : 200;
const SAMPLE_EVERY = 10; // 6 Hz, P0 §2 verbatim
const SAMPLE_DT = SAMPLE_EVERY * DT;
const PAIR_SUBSAMPLE = 6; // P0's, verbatim
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50041;
// P0 §2.2's reporting buckets, verbatim.
const CLOSE_PAIR_M = 4;
const BALL_NEAR_M = 5;
const BALL_MID_M = 10;
const DRIFT_FAST_MS = 4;
const DUP_RUN_M = 4;
const REST_THIRD = HALF_L / 3;
/** §4.3 / §4.4: the frozen canary and degeneracy bands. */
const CANARY_OFFSIDE_REL = 0.10;
const CANARY_BOX_REL = -0.15;
const DEGEN_PILEUP_REL = 0.50;
const DEGEN_RESTDEF_REL = -0.20;
const DEGEN_SCRAMBLE_REL = 0.25;
/** §4.3: the cross-arrival window, C4's own 4 s. */
const CROSS_WINDOW_S = 4;
const TABLE_PATH = 'docs/world-model/data/stage3-p1r-approach-table.json';

const parsed = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
const table: ApproachTable = parsed.table as ApproachTable;
const tableCanonicalSha = parsed.tableSha as string;

type RungId = 'R0' | 'R1' | 'R2' | 'R3' | 'R3G';
const RUNGS: readonly RungId[] = ['R0', 'R1', 'R2', 'R3', 'R3G'];

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

type Family = 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'ONBALL' | 'OTHER';
const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition': return 'FORMATION';
    case 'SupportBallCarrier': return 'SUPPORT';
    case 'MakeRun': return 'RUN';
    case 'MarkOpponent': return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass': return 'BALL';
    default: return 'OTHER';
  }
};

/**
 * P0 §2.2's I2 reference: the INCUMBENT station target, recomputed exactly as
 * the executor recomputes it. Under an armed arm this is still the incumbent's
 * point — I2 asks how fast the station FIELD moves, and the eye's own commitment
 * is measured by its decision counters instead.
 */
const stationTargetOf = (
  p: Player, t: Team, opp: Team, m: Match, family: Family,
): { x: number; y: number } | null => {
  const hasBall = m.possessionSide === t.side;
  switch (family) {
    case 'FORMATION': return formationSpot(p, t, m.ball, hasBall, opp);
    case 'SUPPORT': return supportSpot(p, t, m.ball);
    case 'RUN': return runTarget(p, t, opp.players);
    default: return null;
  }
};

const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((s, x) => s + x, 0) / xs.length);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const round = (v: number, dp = 4): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);

/** Everything one match produces, per side where the instrument is side-split. */
interface SideRow {
  dwellMedian: number;
  familyChangesPerBodyPerMin: number;
  driftMedian: number;
  driftFastShare: number;
  spacingMedian: number;
  spacingUnder4: number;
  ballNear: number;
  ballMid: number;
  restCount: number;
  restSlotShare: number;
  dupRunShare: number;
  shapeDeltaCentroid: number;
  shapeDeltaSpreadX: number;
  shapeDeltaSpreadY: number;
  offsides: number;
  shots: number;
  goals: number;
  crosses: number;
  boxAtArrival: number;
  crossArrivals: number;
}
interface MatchRow {
  readonly cluster: number;
  readonly sides: [SideRow, SideRow];
  readonly restartTicks: number;
  readonly signature: string;
}

const emptySide = (): SideRow => ({
  dwellMedian: Number.NaN, familyChangesPerBodyPerMin: Number.NaN,
  driftMedian: Number.NaN, driftFastShare: Number.NaN,
  spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
  ballNear: Number.NaN, ballMid: Number.NaN,
  restCount: Number.NaN, restSlotShare: Number.NaN, dupRunShare: Number.NaN,
  shapeDeltaCentroid: Number.NaN, shapeDeltaSpreadX: Number.NaN, shapeDeltaSpreadY: Number.NaN,
  offsides: 0, shots: 0, goals: 0, crosses: 0, boxAtArrival: Number.NaN, crossArrivals: 0,
});

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const armEye = (m: Match, rung: RungId, seed: number, trace: StationEyeTrace | null): void => {
  if (rung === 'R0') return;
  const arm: StationEyeArm = rung === 'R3G' ? 'gene' : 'neutral';
  const scope = rung === 'R1'
    ? { kind: 'body' as const, gid: 1 + (seed % 5) }
    : rung === 'R2'
      ? { kind: 'team' as const, side: 0 as const }
      : { kind: 'both' as const };
  m.stationEye = { arm, scope, table, trace: trace ?? undefined };
};

const runMatch = (
  seed: number, cluster: number, rung: RungId, trace: StationEyeTrace | null,
): MatchRow => {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  armEye(m, rung, seed, trace);

  const per: [SideRow, SideRow] = [emptySide(), emptySide()];
  const dwells: [number[], number[]] = [[], []];
  const drifts: [number[], number[]] = [[], []];
  const pairs: [number[], number[]] = [[], []];
  const ballNear: [number[], number[]] = [[], []];
  const ballMid: [number[], number[]] = [[], []];
  const restCount: [number[], number[]] = [[], []];
  const shape = [0, 1].map(() => ({
    inPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
    outPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
  }));
  const boxAtArrival: [number[], number[]] = [[], []];
  const lastFamily = new Map<number, Family>();
  const dwellStart = new Map<number, number>();
  const lastTarget = new Map<number, { x: number; y: number }>();
  const familyChanges = [0, 0];
  const restTicks = [0, 0];
  const restSlotTicks = [0, 0];
  const runTicks = [0, 0];
  const dupRunTicks = [0, 0];
  let restartTicks = 0;
  let samples = 0;
  let tick = 0;
  let crossesBefore: [number, number] = [0, 0];
  /** §4.3: crosses in flight, per side, with their arrival deadline. */
  const inFlight: { side: 0 | 1; deadline: number }[] = [];

  while (!m.finished) {
    const owned = m.ball.owner !== null;
    m.step(DT);
    tick += 1;
    if (m.restart !== null) restartTicks += 1;

    // --- §4.3's C-BOX instrument: attackers in the opposition box at cross
    // arrival. A cross is detected by the engine's own counter; ARRIVAL is the
    // first tick the ball is owned again, is dead, or the 4 s window expires
    // (the probe-local arrival rule, disclosed — C4 T0's box predicate itself
    // is verbatim).
    for (const side of [0, 1] as const) {
      const now = m.teams[side].stats.crosses;
      if (now > crossesBefore[side]) {
        inFlight.push({ side, deadline: m.simTime + CROSS_WINDOW_S });
      }
      crossesBefore[side] = now;
    }
    for (let i = inFlight.length - 1; i >= 0; i--) {
      const f = inFlight[i];
      const arrived = (m.ball.owner !== null && !owned) || m.phase !== 'playing'
        || m.simTime >= f.deadline;
      if (!arrived) continue;
      const att = m.teams[f.side];
      const opp = m.teams[1 - f.side];
      const oppGoalX = opp.attackDir < 0 ? HALF_L : -HALF_L;
      let inBox = 0;
      for (const p of att.players) {
        if (p.role === 'GK' || p.sentOff) continue;
        const insideX = oppGoalX > 0
          ? p.pos.x > oppGoalX - BOX_DEPTH : p.pos.x < oppGoalX + BOX_DEPTH;
        if (insideX && Math.abs(p.pos.y) <= BOX_WIDTH / 2) inBox += 1;
      }
      boxAtArrival[f.side].push(inBox);
      inFlight.splice(i, 1);
    }

    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;

    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const opp = m.teams[1 - side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      const hasBall = m.possessionSide === side;

      for (const p of outfield) {
        const fam = familyOf(p, m);
        const prev = lastFamily.get(p.gid);
        if (prev !== fam) {
          if (prev !== undefined) {
            familyChanges[side] += 1;
            const start = dwellStart.get(p.gid);
            if (start !== undefined && prev !== 'ONBALL' && prev !== 'OTHER') {
              dwells[side].push((tick - start) * DT);
            }
          }
          lastFamily.set(p.gid, fam);
          dwellStart.set(p.gid, tick);
          lastTarget.delete(p.gid);
        }
        const target = stationTargetOf(p, t, opp, m, fam);
        if (target !== null) {
          const before = lastTarget.get(p.gid);
          if (before !== undefined) drifts[side].push(dist2(target, before) / SAMPLE_DT);
          lastTarget.set(p.gid, { x: target.x, y: target.y });
        } else lastTarget.delete(p.gid);
      }

      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            pairs[side].push(dist2(outfield[i].pos, outfield[j].pos));
          }
        }
      }

      let near = 0;
      let mid = 0;
      for (const p of outfield) {
        const d = dist2(p.pos, m.ball.pos);
        if (d <= BALL_NEAR_M) near += 1;
        if (d <= BALL_MID_M) mid += 1;
      }
      ballNear[side].push(near);
      ballMid[side].push(mid);

      if (hasBall) {
        const deep = outfield.filter((p) => t.localX(p.pos.x) < -REST_THIRD);
        restCount[side].push(deep.length);
        restTicks[side] += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks[side] += 1;
      }

      const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
      const liveCorner = m.restart?.kind === 'corner' && m.restart.side === side;
      const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
        && t.arriver !== p.index && t.overlapper !== p.index
        && !((crashLive || liveCorner) && t.runners.has(p.index)));
      if (runners.length >= 2) {
        runTicks[side] += 1;
        const targets = runners.map((p) => runTarget(p, t, opp.players));
        let dup = false;
        for (let i = 0; i < targets.length && !dup; i++) {
          for (let j = i + 1; j < targets.length && !dup; j++) {
            if (dist2(targets[i], targets[j]) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) dupRunTicks[side] += 1;
      }

      if (outfield.length > 0) {
        const xs = outfield.map((p) => t.localX(p.pos.x));
        const ys = outfield.map((p) => p.pos.y);
        const acc = hasBall ? shape[side].inPoss : shape[side].outPoss;
        acc.cx += xs.reduce((s, x) => s + x, 0) / xs.length;
        acc.sx += sd(xs);
        acc.sy += sd(ys);
        acc.n += 1;
      }
    }
  }

  const minutes = (tick * DT) / 60;
  for (const side of [0, 1] as const) {
    const t = m.teams[side];
    const s = per[side];
    s.dwellMedian = quantile(dwells[side], 0.5);
    s.familyChangesPerBodyPerMin = minutes === 0 ? Number.NaN
      : familyChanges[side] / minutes / (TEAM_SIZE - 1);
    s.driftMedian = quantile(drifts[side], 0.5);
    s.driftFastShare = drifts[side].filter((v) => v > DRIFT_FAST_MS).length / (drifts[side].length || 1);
    s.spacingMedian = quantile(pairs[side], 0.5);
    s.spacingUnder4 = pairs[side].filter((v) => v < CLOSE_PAIR_M).length / (pairs[side].length || 1);
    s.ballNear = mean(ballNear[side]);
    s.ballMid = mean(ballMid[side]);
    s.restCount = mean(restCount[side]);
    s.restSlotShare = restTicks[side] === 0 ? Number.NaN : restSlotTicks[side] / restTicks[side];
    s.dupRunShare = runTicks[side] === 0 ? Number.NaN : dupRunTicks[side] / runTicks[side];
    const face = (a: { cx: number; sx: number; sy: number; n: number }) => (a.n === 0
      ? { c: Number.NaN, x: Number.NaN, y: Number.NaN }
      : { c: a.cx / a.n, x: a.sx / a.n, y: a.sy / a.n });
    const ip = face(shape[side].inPoss);
    const op = face(shape[side].outPoss);
    s.shapeDeltaCentroid = ip.c - op.c;
    s.shapeDeltaSpreadX = ip.x - op.x;
    s.shapeDeltaSpreadY = ip.y - op.y;
    s.offsides = t.stats.offsides;
    s.shots = t.stats.shots;
    s.goals = t.stats.goals;
    s.crosses = t.stats.crosses;
    s.boxAtArrival = mean(boxAtArrival[side]);
    s.crossArrivals = boxAtArrival[side].length;
  }
  m.stationEye = null;
  return { cluster, sides: per, restartTicks, signature: signatureOf(m) };
};

// --- paired statistics --------------------------------------------------------
const pairedCI = (
  treated: readonly number[], control: readonly number[], offset: number,
) => {
  const diffs: number[] = [];
  for (let i = 0; i < treated.length; i++) {
    const d = treated[i] - control[i];
    if (Number.isFinite(d)) diffs.push(d);
  }
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0;
    for (let i = 0; i < diffs.length; i++) s += diffs[rng.int(0, diffs.length - 1)];
    draws.push(s / (diffs.length || 1));
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const base = mean(control.filter(Number.isFinite));
  const point = mean(diffs);
  return {
    n: diffs.length,
    control: round(base),
    treated: round(mean(treated.filter(Number.isFinite))),
    diff: round(point, 6),
    lower: round(at(0.025), 6),
    upper: round(at(0.975), 6),
    relative: round(point / (Math.abs(base) || Number.NaN), 6),
  };
};

type Metric = keyof SideRow;
const METRICS: readonly Metric[] = [
  'dwellMedian', 'familyChangesPerBodyPerMin', 'driftMedian', 'driftFastShare',
  'spacingMedian', 'spacingUnder4', 'ballNear', 'ballMid', 'restCount', 'restSlotShare',
  'dupRunShare', 'shapeDeltaCentroid', 'shapeDeltaSpreadX', 'shapeDeltaSpreadY',
  'offsides', 'shots', 'goals', 'crosses', 'boxAtArrival',
];

const runExperiment = () => {
  const seeds: number[] = [];
  for (let b = 0; b < BLOCKS; b++) {
    for (let k = 0; k < MATCHES_PER_BLOCK; k++) seeds.push(SEED_START + b * BLOCK_STRIDE + k);
  }
  const rows: Record<RungId, MatchRow[]> = { R0: [], R1: [], R2: [], R3: [], R3G: [] };
  const traces: Record<RungId, StationEyeTrace> = {
    R0: newStationEyeTrace(), R1: newStationEyeTrace(), R2: newStationEyeTrace(),
    R3: newStationEyeTrace(), R3G: newStationEyeTrace(),
  };
  for (let i = 0; i < seeds.length; i++) {
    for (const rung of RUNGS) {
      rows[rung].push(runMatch(seeds[i], i, rung, rung === 'R0' ? null : traces[rung]));
    }
  }

  // The flag-off pin: R0 must be the shipped world, match for match.
  const plainSignatures = seeds.map((s, i) => runMatch(s, i, 'R0', null).signature);
  const r0Identical = rows.R0.every((r, i) => r.signature === plainSignatures[i]);

  const col = (rung: RungId, side: 0 | 1, metric: Metric): number[] =>
    rows[rung].map((r) => r.sides[side][metric] as number);

  let offset = 0;
  const instruments = Object.fromEntries(RUNGS.filter((r) => r !== 'R0').map((rung) => [
    rung,
    Object.fromEntries(METRICS.map((metric) => [
      metric,
      {
        side0: pairedCI(col(rung, 0, metric), col('R0', 0, metric), offset++),
        side1: pairedCI(col(rung, 1, metric), col('R0', 1, metric), offset++),
      },
    ])),
  ]));

  // §4.5: the signed match-level differential, per rung, REPORTED not gating.
  const differential = Object.fromEntries(RUNGS.filter((r) => r !== 'R0').map((rung) => {
    const treated = rows[rung].map((r) => r.sides[0].shots - r.sides[1].shots);
    const control = rows.R0.map((r) => r.sides[0].shots - r.sides[1].shots);
    const gTreated = rows[rung].map((r) => r.sides[0].goals - r.sides[1].goals);
    const gControl = rows.R0.map((r) => r.sides[0].goals - r.sides[1].goals);
    return [rung, {
      shots: pairedCI(treated, control, offset++),
      goals: pairedCI(gTreated, gControl, offset++),
    }];
  }));

  // §4.3 canaries, on the DEPLOYMENT rung, both sides pooled by summing.
  const offsidesOf = (rung: RungId) => rows[rung].map((r) => r.sides[0].offsides + r.sides[1].offsides);
  const boxOf = (rung: RungId) => rows[rung].map((r) => {
    const a = r.sides[0].boxAtArrival;
    const b = r.sides[1].boxAtArrival;
    const na = r.sides[0].crossArrivals;
    const nb = r.sides[1].crossArrivals;
    if (na + nb === 0) return Number.NaN;
    return ((Number.isFinite(a) ? a * na : 0) + (Number.isFinite(b) ? b * nb : 0)) / (na + nb);
  });
  const offsideCanary = pairedCI(offsidesOf('R3'), offsidesOf('R0'), offset++);
  const boxCanary = pairedCI(boxOf('R3'), boxOf('R0'), offset++);
  const canaries = {
    offside: {
      ...offsideCanary,
      band: CANARY_OFFSIDE_REL,
      fires: offsideCanary.lower > 0 && offsideCanary.relative >= CANARY_OFFSIDE_REL,
    },
    box: {
      ...boxCanary,
      band: CANARY_BOX_REL,
      fires: boxCanary.upper < 0 && boxCanary.relative <= CANARY_BOX_REL,
    },
  };

  // §4.4 the degenerate attractor, on R3, side-split and never pooled.
  const degenLimb = (metric: Metric, rel: number, sign: 1 | -1, off: number) => {
    const s0 = pairedCI(col('R3', 0, metric), col('R0', 0, metric), off);
    const s1 = pairedCI(col('R3', 1, metric), col('R0', 1, metric), off + 1);
    const fires = (c: ReturnType<typeof pairedCI>) => (sign === 1
      ? c.lower > 0 && c.relative >= rel
      : c.upper < 0 && c.relative <= rel);
    return { side0: s0, side1: s1, band: rel, fires: fires(s0) || fires(s1) };
  };
  const degeneracy = {
    pileup: degenLimb('spacingUnder4', DEGEN_PILEUP_REL, 1, offset += 2),
    restDefence: degenLimb('restSlotShare', DEGEN_RESTDEF_REL, -1, offset += 2),
    scramble: degenLimb('ballNear', DEGEN_SCRAMBLE_REL, 1, offset += 2),
  };

  const traceOf = (rung: RungId) => {
    const t = traces[rung];
    const byAngle: Record<string, number> = {};
    const byRadius: Record<string, number> = {};
    let ring180 = 0;
    let total = 0;
    for (const [id, count] of t.byCandidate) {
      if (EYE_LATTICE.find((c) => c.id === id) === undefined) continue;
      const [, r, a] = /^r(\d+)a(\d+)$/.exec(id)!;
      byAngle[a] = (byAngle[a] ?? 0) + count;
      byRadius[r] = (byRadius[r] ?? 0) + count;
      if (a === '180') ring180 += count;
      total += count;
    }
    return {
      decisions: t.decisions,
      deviate: t.deviate,
      deviationShare: round(t.deviate / (t.decisions || 1), 6),
      classes: {
        abstainUnseen: t.abstainNoSnapshot + t.abstainNoBall + t.abstainNoOwner,
        abstainNoSnapshot: t.abstainNoSnapshot,
        abstainNoBall: t.abstainNoBall,
        abstainNoOwner: t.abstainNoOwner,
        noCell: t.noCell, tie: t.tie,
        nonStationTicks: t.nonStationTicks, overrideTicks: t.overrideTicks,
      },
      ctx: {
        seen: t.ctxSeen,
        agree: round(t.ctxAgree / (t.ctxSeen || 1), 6),
        agreeFace: round(t.ctxAgreeFace / (t.ctxSeen || 1), 6),
        agreeThreat: round(t.ctxAgreeThreat / (t.ctxSeen || 1), 6),
        agreeDensity: round(t.ctxAgreeDensity / (t.ctxSeen || 1), 6),
      },
      byAngle, byRadius, ring180Share: round(ring180 / (total || 1), 6),
      byContext: Object.fromEntries([...t.byContext.entries()].sort((a, b) => b[1] - a[1])),
    };
  };

  const restartTicksOf = (rung: RungId) => rows[rung].map((r) => r.restartTicks);
  const gates = {
    r0FlagOffIdentity: r0Identical,
    offsideCanaryQuiet: !canaries.offside.fires,
    boxCanaryQuiet: !canaries.box.fires,
    degeneracyQuiet: !degeneracy.pileup.fires && !degeneracy.restDefence.fires
      && !degeneracy.scramble.fires,
  };

  return {
    experiment: 'STAGE3-P2B (deployment + adoption ladder)',
    authority: 'STAGE3-P2-DORMANT-EYE §4',
    parameters: {
      seedStart: SEED_START, blocks: BLOCKS, matchesPerBlock: MATCHES_PER_BLOCK,
      matchesPerArm: seeds.length, rungs: RUNGS, sampleEvery: SAMPLE_EVERY,
      pairSubsample: PAIR_SUBSAMPLE, tableCanonicalSha,
      bands: {
        offsideRel: CANARY_OFFSIDE_REL, boxRel: CANARY_BOX_REL,
        pileupRel: DEGEN_PILEUP_REL, restDefRel: DEGEN_RESTDEF_REL,
        scrambleRel: DEGEN_SCRAMBLE_REL,
      },
      clusterUnit: 'match seed (paired across arms)',
      crossArrivalRule: 'first tick the ball is owned again, play stops, or 4 s expires',
      smoke: SMOKE,
    },
    instruments,
    differential,
    canaries,
    degeneracy,
    eye: Object.fromEntries(RUNGS.filter((r) => r !== 'R0').map((r) => [r, traceOf(r)])),
    restarts: Object.fromEntries(RUNGS.filter((r) => r !== 'R0').map((r, i) => [
      r, pairedCI(restartTicksOf(r), restartTicksOf('R0'), 900 + i),
    ])),
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(first) === canonical(second);
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');
const gates = { ...first.gates, determinism: deterministic };
const output = {
  ...first, gates, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL',
};
console.log(JSON.stringify(output, null, 2));
if (!SMOKE) {
  writeFileSync('docs/world-model/data/stage3-p2b-adoption-results.json',
    `${JSON.stringify(output, null, 2)}\n`);
}

console.error(
  `STAGE3-P2B ${output.verdict}`
  + ` · ${output.parameters.matchesPerArm} matches × ${RUNGS.length} arms`
  + ` · R0 identity ${output.gates.r0FlagOffIdentity}`
  + ` · offside ${output.canaries.offside.diff} rel ${output.canaries.offside.relative}`
  + ` fires ${output.canaries.offside.fires}`
  + ` · box ${output.canaries.box.diff} rel ${output.canaries.box.relative}`
  + ` fires ${output.canaries.box.fires}`
  + ` · degen pileup ${output.degeneracy.pileup.fires}`
  + ` restdef ${output.degeneracy.restDefence.fires}`
  + ` scramble ${output.degeneracy.scramble.fires}`
  + ` · R3 dev ${output.eye.R3.deviationShare}`
  + ` · R2 shots diff ${output.differential.R2.shots.diff}`
  + ` CI[${output.differential.R2.shots.lower}, ${output.differential.R2.shots.upper}]`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
