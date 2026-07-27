// Stage III P0 — INCUMBENT INSTRUMENT BASELINES (read-only, zero src/**)
// Authority: docs/world-model/STAGE3-P0-CONSUMER-MAP.md §2 (definitions and
// the two-meanings sweep, both committed BEFORE this file measured anything)
// · STAGE3-POSITIONING-EYE.md §5 P0 · ruling #34.4.
//
// This is not an experiment and nothing here gates. It measures what
// `emergentStation` — the hand-tuned interim any eye must beat — actually
// produces, so P1 can size a commitment window and P2/P3 can freeze gates
// against a measured distribution instead of an invented one.
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { formationSpot, runTarget, supportSpot } from '../../src/ai/formations';
import { DT, HALF_L } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- staging, declared before measurement (§2) -------------------------------
/** Fresh: 830-920k are all consumed by the C4/C5 chain. */
const SEED_START = 930_000;
const MATCHES = 300;
/** §2: sample every 10th tick (6 Hz), playing phase only. */
const SAMPLE_EVERY = 10;
const SAMPLE_DT = SAMPLE_EVERY * DT;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50021;
/**
 * I3 pools every unordered pair on every sample, which is ~30 numbers per
 * sampled tick — 12 M over the block. It is sub-sampled to every 6th sampled
 * tick (~1 Hz) so the pooled distribution fits in memory; declared here rather
 * than discovered later, and it changes no definition (§2.2's I3 is a pooled
 * distribution, and a 1 Hz sub-sample of it is the same distribution).
 */
const PAIR_SUBSAMPLE = 6;
// §2.2's reporting buckets. None is a gate.
const CLOSE_PAIR_M = 4;
const BALL_NEAR_M = 5;
const BALL_MID_M = 10;
const DRIFT_FAST_MS = 4;
const DUP_RUN_M = 4;
const REST_THIRD = HALF_L / 3;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

// --- the station family ledger (§2.2 I1) -------------------------------------
type Family = 'FORMATION' | 'SUPPORT' | 'RUN' | 'MARK' | 'BALL' | 'ONBALL' | 'OTHER';

const familyOf = (p: Player, m: Match): Family => {
  if (m.ball.owner === p) return 'ONBALL';
  switch (p.action.type) {
    case 'MoveToFormationSpot':
    case 'HoldPosition':
      return 'FORMATION';
    case 'SupportBallCarrier':
      return 'SUPPORT';
    case 'MakeRun':
      return 'RUN';
    case 'MarkOpponent':
      return 'MARK';
    case 'ChaseBall':
    case 'ReceivePass':
    case 'InterceptPass':
      return 'BALL';
    default:
      return 'OTHER';
  }
};

/**
 * The station target for a STATION family, recomputed exactly as the executor
 * recomputes it. MARK is deliberately excluded from I2: its target is a
 * stance on a moving body plus a reaction-lag anchor, so its drift measures
 * the opponent's motion, not the station field's.
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

// --- per-match accumulation --------------------------------------------------
interface MatchRow {
  readonly cluster: number;
  // I1
  readonly dwells: number[];
  readonly familyChangesPerMin: number;
  /** The same count divided by the ten outfield bodies — the readable form. */
  readonly familyChangesPerBodyPerMin: number;
  readonly familyShare: Record<Family, number>;
  // I2
  readonly drifts: number[];
  // I3
  readonly pairDists: number[];
  // I4
  readonly ownNear: number[];
  readonly ownMid: number[];
  readonly oppNear: number[];
  readonly oppMid: number[];
  // I5
  readonly restCount: number[];
  readonly restSlotShare: number;
  // I6
  readonly dupRunShare: number;
  readonly runTickCount: number;
  /** RUN-family body-ticks excluded from I6 because a licensed branch routes them. */
  readonly licensedRunTicks: number;
  // I7
  readonly shape: {
    inPoss: { centroid: number; spreadX: number; spreadY: number; n: number };
    outPoss: { centroid: number; spreadX: number; spreadY: number; n: number };
  };
  readonly samples: number;
}

const FAMILIES: readonly Family[] = ['FORMATION', 'SUPPORT', 'RUN', 'MARK', 'BALL', 'ONBALL', 'OTHER'];

const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = xs.reduce((s, x) => s + x, 0) / xs.length;
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const dist2 = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

const runMatch = (seed: number, cluster: number): MatchRow => {
  const m = new Match({ seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2) });
  const dwells: number[] = [];
  const drifts: number[] = [];
  const pairDists: number[] = [];
  const ownNear: number[] = [];
  const ownMid: number[] = [];
  const oppNear: number[] = [];
  const oppMid: number[] = [];
  const restCount: number[] = [];
  const familyTicks = Object.fromEntries(FAMILIES.map((f) => [f, 0])) as Record<Family, number>;
  const shapeAcc = {
    inPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
    outPoss: { cx: 0, sx: 0, sy: 0, n: 0 },
  };
  // Per-body running state for I1/I2.
  const lastFamily = new Map<number, Family>();
  const dwellStart = new Map<number, number>();
  const lastTarget = new Map<number, { x: number; y: number }>();
  let familyChanges = 0;
  let restTicks = 0;
  let restSlotTicks = 0;
  let runTicks = 0;
  let licensedRunTicks = 0;
  let dupRunTicks = 0;
  let samples = 0;
  let tick = 0;

  while (!m.finished) {
    m.step(DT);
    tick += 1;
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;

    for (const t of m.teams) {
      const opp = m.teams[1 - t.side];
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      const hasBall = m.possessionSide === t.side;

      // --- I1 / I2, per body ---
      for (const p of outfield) {
        const fam = familyOf(p, m);
        familyTicks[fam] += 1;
        const prev = lastFamily.get(p.gid);
        if (prev !== fam) {
          if (prev !== undefined) {
            familyChanges += 1;
            const start = dwellStart.get(p.gid);
            if (start !== undefined && prev !== 'ONBALL' && prev !== 'OTHER') {
              dwells.push((tick - start) * DT);
            }
          }
          lastFamily.set(p.gid, fam);
          dwellStart.set(p.gid, tick);
          lastTarget.delete(p.gid); // a family change is I1's event, not a drift
        }
        const target = stationTargetOf(p, t, opp, m, fam);
        if (target !== null) {
          const before = lastTarget.get(p.gid);
          if (before !== undefined) drifts.push(dist2(target, before) / SAMPLE_DT);
          lastTarget.set(p.gid, { x: target.x, y: target.y });
        } else lastTarget.delete(p.gid);
      }

      // --- I3, own pairs (sub-sampled, see PAIR_SUBSAMPLE) ---
      if (samples % PAIR_SUBSAMPLE === 0) for (let i = 0; i < outfield.length; i++) {
        for (let j = i + 1; j < outfield.length; j++) {
          pairDists.push(dist2(outfield[i].pos, outfield[j].pos));
        }
      }

      // --- I4, per side, never summed ---
      let near = 0;
      let mid = 0;
      for (const p of outfield) {
        const d = dist2(p.pos, m.ball.pos);
        if (d <= BALL_NEAR_M) near += 1;
        if (d <= BALL_MID_M) mid += 1;
      }
      if (t.side === 0) { ownNear.push(near); ownMid.push(mid); } else { oppNear.push(near); oppMid.push(mid); }

      // --- I5, in possession only ---
      if (hasBall) {
        const deep = outfield.filter((p) => t.localX(p.pos.x) < -REST_THIRD);
        restCount.push(deep.length);
        restTicks += 1;
        if (deep.some((p) => p.index === 1)) restSlotTicks += 1;
      }

      // --- I6, run targets ---
      // Only bodies the executor actually routes through `runTarget`: the
      // arriver, the overlapper and a live corner crasher are routed by their
      // own licensed branches (`actionExecutor.ts:294-390`), so scoring them
      // against `runTarget` would measure a target they never chase.
      const crashLive = t.cornerCrash !== null && m.simTime < t.cornerCrash.until;
      const liveCorner = m.restart?.kind === 'corner' && m.restart.side === t.side;
      const runners = outfield.filter((p) => familyOf(p, m) === 'RUN'
        && t.arriver !== p.index && t.overlapper !== p.index
        && !((crashLive || liveCorner) && t.runners.has(p.index)));
      licensedRunTicks += outfield.filter((p) => familyOf(p, m) === 'RUN').length - runners.length;
      if (runners.length >= 2) {
        runTicks += 1;
        const targets = runners.map((p) => runTarget(p, t, opp.players));
        let dup = false;
        for (let i = 0; i < targets.length && !dup; i++) {
          for (let j = i + 1; j < targets.length && !dup; j++) {
            if (dist2(targets[i], targets[j]) < DUP_RUN_M) dup = true;
          }
        }
        if (dup) dupRunTicks += 1;
      }

      // --- I7, shape by POSSESSION (never by team.mode) ---
      if (outfield.length > 0) {
        const xs = outfield.map((p) => t.localX(p.pos.x));
        const ys = outfield.map((p) => p.pos.y);
        const acc = hasBall ? shapeAcc.inPoss : shapeAcc.outPoss;
        acc.cx += xs.reduce((s, x) => s + x, 0) / xs.length;
        acc.sx += sd(xs);
        acc.sy += sd(ys);
        acc.n += 1;
      }
    }
  }

  const minutes = (tick * DT) / 60;
  const face = (a: { cx: number; sx: number; sy: number; n: number }) => ({
    centroid: a.n === 0 ? Number.NaN : a.cx / a.n,
    spreadX: a.n === 0 ? Number.NaN : a.sx / a.n,
    spreadY: a.n === 0 ? Number.NaN : a.sy / a.n,
    n: a.n,
  });
  const totalFamily = FAMILIES.reduce((s, f) => s + familyTicks[f], 0) || 1;
  return {
    cluster,
    dwells,
    familyChangesPerMin: minutes === 0 ? Number.NaN : familyChanges / minutes,
    familyChangesPerBodyPerMin: minutes === 0 ? Number.NaN
      : familyChanges / minutes / (2 * (TEAM_SIZE - 1)),
    familyShare: Object.fromEntries(
      FAMILIES.map((f) => [f, familyTicks[f] / totalFamily]),
    ) as Record<Family, number>,
    drifts,
    pairDists,
    ownNear, ownMid, oppNear, oppMid,
    restCount,
    restSlotShare: restTicks === 0 ? Number.NaN : restSlotTicks / restTicks,
    dupRunShare: runTicks === 0 ? Number.NaN : dupRunTicks / runTicks,
    runTickCount: runTicks,
    licensedRunTicks,
    shape: { inPoss: face(shapeAcc.inPoss), outPoss: face(shapeAcc.outPoss) },
    samples,
  };
};

// --- statistics: cluster unit = the match seed (#20) -------------------------
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((s, x) => s + x, 0) / xs.length);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};
const round = (v: number, dp = 4): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);

/** Cluster bootstrap of a per-match statistic. Clusters are match seeds. */
const clusterCI = (perMatch: readonly number[], offset: number) => {
  const vals = perMatch.filter(Number.isFinite);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    let s = 0;
    for (let i = 0; i < vals.length; i++) s += vals[rng.int(0, vals.length - 1)];
    draws.push(s / vals.length);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { mean: round(mean(vals)), lower: round(at(0.025)), upper: round(at(0.975)) };
};

/** A pooled distribution reported as quantiles — never as a bare mean (§2.1). */
const distOf = (pooled: readonly number[], extra?: (xs: readonly number[]) => Record<string, number>) => ({
  n: pooled.length,
  p10: round(quantile(pooled, 0.1)),
  median: round(quantile(pooled, 0.5)),
  p90: round(quantile(pooled, 0.9)),
  mean: round(mean(pooled)),
  ...(extra ? extra(pooled) : {}),
});

const runExperiment = () => {
  const rows: MatchRow[] = [];
  for (let k = 0; k < MATCHES; k++) rows.push(runMatch(SEED_START + k, k));

  const pool = (pick: (r: MatchRow) => readonly number[]): number[] => {
    const out: number[] = [];
    for (const r of rows) for (const v of pick(r)) out.push(v);
    return out;
  };
  const shapeFace = (f: 'inPoss' | 'outPoss', key: 'centroid' | 'spreadX' | 'spreadY') =>
    rows.map((r) => r.shape[f][key]);
  const deltaOf = (key: 'centroid' | 'spreadX' | 'spreadY') =>
    rows.map((r) => r.shape.inPoss[key] - r.shape.outPoss[key]);

  const dwells = pool((r) => r.dwells);
  const drifts = pool((r) => r.drifts);
  const pairs = pool((r) => r.pairDists);

  return {
    experiment: 'STAGE3-P0 (incumbent instrument baselines)',
    authority: 'STAGE3-P0-CONSUMER-MAP §2',
    parameters: {
      seedStart: SEED_START, matches: MATCHES, sampleEvery: SAMPLE_EVERY,
      sampleHz: round(1 / SAMPLE_DT, 3), clusterUnit: 'match seed',
      buckets: {
        closePairM: CLOSE_PAIR_M, ballNearM: BALL_NEAR_M, ballMidM: BALL_MID_M,
        driftFastMs: DRIFT_FAST_MS, dupRunM: DUP_RUN_M, restThirdM: round(REST_THIRD, 3),
      },
      pairSubsample: PAIR_SUBSAMPLE,
      incumbent: 'emergentStation (emergentPosOn default ON)',
      note: 'read-only baselines; no gate is frozen here',
    },
    samplesTotal: rows.reduce((s, r) => s + r.samples, 0),
    i1StationFamilyDwell: {
      dwellSeconds: distOf(dwells),
      familyChangesPerMinuteAllBodies: clusterCI(rows.map((r) => r.familyChangesPerMin), 1),
      familyChangesPerBodyPerMinute: clusterCI(rows.map((r) => r.familyChangesPerBodyPerMin), 2),
      familyShare: Object.fromEntries(FAMILIES.map((f, i) => [
        f, clusterCI(rows.map((r) => r.familyShare[f]), 10 + i),
      ])),
    },
    i2TargetDrift: {
      metresPerSecond: distOf(drifts, (xs) => ({
        shareAbove4: round(xs.filter((v) => v > DRIFT_FAST_MS).length / (xs.length || 1)),
        p99: round(quantile(xs, 0.99)),
      })),
    },
    i3PairwiseSpacing: {
      metres: distOf(pairs, (xs) => ({
        shareUnder4: round(xs.filter((v) => v < CLOSE_PAIR_M).length / (xs.length || 1)),
      })),
    },
    i4BallConvergence: {
      note: 'own and opponent reported SEPARATELY and never summed (§2.1)',
      ownWithin5: clusterCI(rows.map((r) => mean(r.ownNear)), 20),
      ownWithin10: clusterCI(rows.map((r) => mean(r.ownMid)), 21),
      oppWithin5: clusterCI(rows.map((r) => mean(r.oppNear)), 22),
      oppWithin10: clusterCI(rows.map((r) => mean(r.oppMid)), 23),
    },
    i5RestDefence: {
      anyBodyInOwnThird: clusterCI(rows.map((r) => mean(r.restCount)), 30),
      designatedSlotPresentShare: clusterCI(rows.map((r) => r.restSlotShare), 31),
    },
    i6DuplicateRuns: {
      shareOfMultiRunnerTicks: clusterCI(rows.map((r) => r.dupRunShare), 40),
      multiRunnerTicksPerMatch: clusterCI(rows.map((r) => r.runTickCount), 41),
      licensedRunBodyTicksExcluded: clusterCI(rows.map((r) => r.licensedRunTicks), 42),
    },
    i7Shape: {
      inPossession: {
        centroidLocalX: clusterCI(shapeFace('inPoss', 'centroid'), 50),
        spreadX: clusterCI(shapeFace('inPoss', 'spreadX'), 51),
        spreadY: clusterCI(shapeFace('inPoss', 'spreadY'), 52),
      },
      outOfPossession: {
        centroidLocalX: clusterCI(shapeFace('outPoss', 'centroid'), 53),
        spreadX: clusterCI(shapeFace('outPoss', 'spreadX'), 54),
        spreadY: clusterCI(shapeFace('outPoss', 'spreadY'), 55),
      },
      delta: {
        centroidLocalX: clusterCI(deltaOf('centroid'), 56),
        spreadX: clusterCI(deltaOf('spreadX'), 57),
        spreadY: clusterCI(deltaOf('spreadY'), 58),
      },
    },
  };
};

const first = runExperiment();
const second = runExperiment();
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(first) === canonical(second);
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');
console.log(JSON.stringify({ ...first, deterministic, sha256 }, null, 2));

const o = first;
console.error(
  `STAGE3-P0 · ${MATCHES} matches · ${o.samplesTotal} samples @${round(1 / SAMPLE_DT, 2)}Hz`
  + ` · I1 dwell median ${o.i1StationFamilyDwell.dwellSeconds.median}s p90 ${o.i1StationFamilyDwell.dwellSeconds.p90}s`
  + ` · family changes ${o.i1StationFamilyDwell.familyChangesPerBodyPerMinute.mean}/body/min`
  + ` · I2 drift median ${o.i2TargetDrift.metresPerSecond.median} m/s p90 ${o.i2TargetDrift.metresPerSecond.p90}`
  + ` (>${DRIFT_FAST_MS} m/s on ${(o.i2TargetDrift.metresPerSecond as unknown as { shareAbove4: number }).shareAbove4})`
  + ` · I3 spacing p10 ${o.i3PairwiseSpacing.metres.p10} median ${o.i3PairwiseSpacing.metres.median}`
  + ` (<4 m ${(o.i3PairwiseSpacing.metres as unknown as { shareUnder4: number }).shareUnder4})`
  + ` · I4 own@5m ${o.i4BallConvergence.ownWithin5.mean} own@10m ${o.i4BallConvergence.ownWithin10.mean}`
  + ` opp@5m ${o.i4BallConvergence.oppWithin5.mean} opp@10m ${o.i4BallConvergence.oppWithin10.mean}`
  + ` · I5 deep ${o.i5RestDefence.anyBodyInOwnThird.mean} slot-present ${o.i5RestDefence.designatedSlotPresentShare.mean}`
  + ` · I6 dup ${o.i6DuplicateRuns.shareOfMultiRunnerTicks.mean}`
  + ` · I7 centroid ${o.i7Shape.inPossession.centroidLocalX.mean}/${o.i7Shape.outOfPossession.centroidLocalX.mean}`
  + ` delta ${o.i7Shape.delta.centroidLocalX.mean} spreadX ${o.i7Shape.delta.spreadX.mean} spreadY ${o.i7Shape.delta.spreadY.mean}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
