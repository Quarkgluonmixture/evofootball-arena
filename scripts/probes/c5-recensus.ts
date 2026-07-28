// C5 RE-CENSUS — the enriched world's waiting price (fork-and-force hold-k vs
// act-now, re-run on the JOINTLY ENRICHED world with the four #29.1/#36 repairs).
//
// Authority: docs/world-model/C5-RECENSUS.md (FROZEN pre-registration) · rulings
// #60.3 (single re-census authorized) · #61 (review PASS; the two forks disposed:
// #61.2 the dormant ShieldHold percept edit ACCEPTED, #61.3 H1 first branch binds
// K_build>=980 / K_heldout>=392, tolerance 2.0pp untouched) · #29.1 (H1 re-powered)
// · #29.3 (the unpark law) · #36 (the four defects) · #26.5 · #46.2 · #48.4 · #49.3.
//
// The instrument is C5 T1 VERBATIM with the four repairs applied and marked:
//   (i)   fallback populations get REAL laddered cluster CIs (C5-RECENSUS §1.1)
//   (ii)  concession read at elapsed===HORIZON in ALL four arms (§1.2)
//   (iii) a PERCEPT-COMPLIANT shield — the ShieldHold READ is the holder's own
//         percept, not opponent truth (§1.3; the src edit, dormant behind
//         forcedHold && c5Hold, lives in src/ai/actionExecutor.ts)
//   (iv)  eligible-choice moments only (§1.5)
//
// The world is ENRICHED IN EVERY ARM: the VALUE brain + c6Carry + c7Windup are
// armed in the census Match config, so A0, the three hold arms and the release
// twins all run in the c6Carry+c7Windup world (§0.1, §1). Nothing ships: all
// flags are default-OFF in production; ShieldHold is reachable only through
// forcedHold, which no production path sets (X-family, proven separately).
//
// The exchange rate is REPORTED, never gated (§3.2). The #29.3 unpark test is
// COMPUTED and returned; the commander drafts C5-T2 iff a cell's cost interval
// reaches zero (§2). The gates are instrument-quality only.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { AI_INTERVAL, DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- env caps (smoke only; the frozen defaults are the census, §3.3) ----------
const envInt = (name: string, def: number): number => {
  const raw = process.env[name];
  const value = raw === undefined ? Number.NaN : Number(raw);
  return Number.isFinite(value) ? value : def;
};

// --- frozen parameters (C5-RECENSUS §3.3) ------------------------------------
const MATCH_DURATION = 240;
/** Build block: seeds 8,300,000+ (fresh, disjoint — §3.3/§3.4). */
const BUILD_SEED_START = 8_300_000;
/** Held-out block: seeds 8,400,000+ (100k apart, disjoint — §3.3/§3.4). */
const HELDOUT_SEED_START = 8_400_000;
/** Cluster floors, the #62.3-extension counts re-sized on the REALISED σ_c =
 *  11.9075 pp (the smoke's 11.135 pp under-estimated by 7 %): 3.15σ design target
 *  at the untouched 2.0 pp tolerance ⇒ SE ≤ 0.6349 pp ⇒ 1/1233 + 1/493 = 0.002839
 *  ⇒ 3.152σ. Blocks EXTENDED in-sequence from the same starts (cluster = match
 *  seed). Was 980 / 392 (#61.3, the FAILED first sizing — §RESULT / §EXT). */
const CLUSTER_FLOOR_BUILD = envInt('C5_RECENSUS_CLUSTER_BUILD', 1_233);
const CLUSTER_FLOOR_HELDOUT = envInt('C5_RECENSUS_CLUSTER_HELDOUT', 493);
/** Match ceilings — ~22 % headroom over the floors (as the old 1,200 / 980 design),
 *  attainable at the observed 1:1 eligible-match yield; the walk continues into the
 *  8,301,200+ / 8,400,480+ extension territory (§EXT). Was 1,200 / 480. */
const MAX_MATCHES_BUILD = envInt('C5_RECENSUS_MAX_BUILD', 1_500);
const MAX_MATCHES_HELDOUT = envInt('C5_RECENSUS_MAX_HELDOUT', 600);
/** Per-match cap on SAMPLED (qualifying) moments — C5 T1 verbatim; the smoke's
 *  80/match qualifying yield the sizing (§3.0) rests on. Eligible is the subset. */
const PER_MATCH_CAP = 80;
/** Ticks between sampled moments in one match — C5 T1 verbatim. */
const MOMENT_SPACING = 30;
/** The outcome window, from the DECISION MOMENT in every arm (#48.4). */
const HORIZON = 240;
/** The hold ladder, in ticks: 0.5 / 1.0 / 1.5 s. */
const HOLD_LADDER = [30, 60, 90] as const;
/** T0R's frozen pressure bands, verbatim. */
const PRESSURE_BANDS = [0.15, 0.45] as const;
const STALE_BANDS = [3, 8] as const;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
const BUCKET_FLOOR = 300; // ladder rung floor (rows per rung, §1.1)
const PRESSURE_ROW_FLOOR = 300; // C3
const H1_TOLERANCE = 0.02; // 2.0pp, marginal (#61.3, untouched)
const H2_TOLERANCE = 0.05; // 5.0pp, per gated pressure row
const X5_BITE_FLOOR = 0.90;
const BOOTSTRAP_RESAMPLES = 2_000;
const BOOTSTRAP_SEED = 50_060; // §3.3, new seed
const H1_SIGMA_FLOOR = 3.0; // 2.0pp >= 3σ — the CERTIFICATION floor (#61.3, full
// weight); NOT the sizing target. The #62.3 extension SIZES to a 3.15σ DESIGN
// target (headroom) via the cluster floors above; the gate bar stays 3.0.
const RECEIPT_CAP = 1_000; // per-class per-record receipts (#49.3)
const INJURY_REPOSITION_M = 3.0; // E-INJURY becomeSub-reposition signature (#49.3)
/** Whole-match tempo instruments (§9), re-read on the enriched world. */
const TS_MATCHES = envInt('C5_RECENSUS_TS', 75);
const OUT_PATH = process.env.C5_RECENSUS_OUT ?? 'docs/world-model/data/c5-recensus.json';

/** The census world (§0.1): VALUE brain + BOTH enrichment flags, EVERY arm.
 *  The one-touch fork stays OFF — it is priced by its own two branches at T2. */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true,
  edsPerceivedChoice: true,
  edsValueAxis: true,
  c5Hold: true,
  c6Carry: true,
  c7Windup: true,
  c5TouchFork: false,
} as const;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, enriched: boolean): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION,
  ...(enriched ? CENSUS_FLAGS : {}),
});

const distance = (
  a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>,
): number => Math.hypot(a.x - b.x, a.y - b.y);

/** A digest of the whole visible world — X4's inertness and X5's bite pin. */
const stateSignature = (match: Match): string => {
  const digest = createHash('sha256');
  digest.update(`${match.simTick}|${match.phase}|${match.score[0]}:${match.score[1]}`);
  digest.update(`|${match.ball.pos.x},${match.ball.pos.y},${match.ball.z}`);
  digest.update(`|${match.ball.vel.x},${match.ball.vel.y},${match.ball.vz}`);
  digest.update(`|${match.ball.owner?.gid ?? -1}|${match.ball.lastTouch?.gid ?? -1}`);
  for (const p of match.allPlayers) {
    digest.update(`|${p.gid},${p.pos.x},${p.pos.y},${p.vel.x},${p.vel.y},${p.stamina}`);
  }
  for (const t of match.teams) {
    digest.update(`|${t.stats.shots},${t.stats.passes},${t.stats.tackles},${t.stats.goals}`);
  }
  return digest.digest('hex');
};

type Band = 0 | 1 | 2;
const pressureBandOf = (value: number): Band =>
  (value < PRESSURE_BANDS[0] ? 0 : value < PRESSURE_BANDS[1] ? 1 : 2);
const staleBandOf = (value: number): Band =>
  (value < STALE_BANDS[0] ? 0 : value < STALE_BANDS[1] ? 1 : 2);

// --- per-record receipts (#49.3) ---------------------------------------------
interface Receipt { seed: number; tick: number; gid: number; cause: string }
type ReceiptBook = Record<string, Receipt[]>;
const addReceipt = (
  book: ReceiptBook, cls: string, seed: number, tick: number, gid: number, cause: string,
): void => {
  const arr = (book[cls] ??= []);
  if (arr.length < RECEIPT_CAP) arr.push({ seed, tick, gid, cause });
};

interface ArmOutcome {
  /** THE axis: the attacking team took a shot inside the horizon. */
  readonly shot: boolean;
  /** The concession twin — read at elapsed===HORIZON in ALL arms (repair ii). */
  readonly conceded: boolean;
  /** A0 only: the owner's decided action after the first fork step (repair iv). */
  readonly decidedAction: string | null;
  /** Hold arms only: the holder still had it when the forced window expired. */
  readonly survivedHold: boolean | null;
  /** Hold arms only: lost during the hold, and to a tackle specifically. */
  readonly lostToTackle: boolean | null;
  /** Hold arms only, §1.4: a 240-tick window starting at the RELEASE instead. */
  readonly shotFromRelease: boolean | null;
  /** #48.4: the window did not reach the horizon because the match ended. */
  readonly endedInWindow: boolean;
  /** The window neither reached the horizon nor ended — a stalled clock (the
   *  only "unexplained" state; gated at 0, #38.1). */
  readonly stalled: boolean;
  /** §3.5 exception flags (event-keyed, REPORTED). */
  readonly paused: boolean;
  readonly injured: boolean;
  readonly injuredGid: number;
  readonly signature: string;
}

interface Moment {
  readonly cluster: number;
  readonly seed: number;
  readonly tick: number;
  readonly ownerGid: number;
  readonly pressureBand: Band;
  readonly staleBand: Band;
  readonly support: number;
  readonly arms: readonly ArmOutcome[]; // [A0, A1, A2, A3]
}

/** Run one fork forward and read the axis off it (repairs ii, iii ride here). */
const runArm = (
  before: Match, ownerGid: number, holdTicks: number,
): ArmOutcome => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  const side = owner.side;
  const attacking = fork.teams[side];
  const defending = fork.teams[1 - side];
  const shotsBefore = attacking.stats.shots;
  const concededBefore = defending.stats.shots;
  const tacklesBefore = defending.stats.tackles;
  const startTick = fork.simTick;
  if (holdTicks > 0) fork.forcedHold = { gid: ownerGid, untilTick: startTick + holdTicks };

  let shot = false;
  let conceded = false;
  let horizonReached = false;
  let decidedAction: string | null = null;
  let survivedHold: boolean | null = holdTicks > 0 ? true : null;
  let lostDuringHold = false;
  let paused = false;
  let injured = false;
  let injuredGid = -1;
  // E-INJURY (#49.3): watch the owner body across the window for an attrs
  // mutation (takeKnock) or a single-tick becomeSub reposition (teleport).
  const watchGid = ownerGid;
  let prevDrb = owner.attrs.dribbling;
  let prevX = owner.pos.x;
  let prevY = owner.pos.y;
  // The release-origin twin needs the window to keep running past the horizon,
  // so hold arms simulate holdTicks + HORIZON (§1.4).
  const total = holdTicks + HORIZON;
  let shotsAtRelease = -1;
  for (let tick = 0; tick < total; tick++) {
    if (fork.finished) break;
    fork.step(DT);
    const elapsed = fork.simTick - startTick;
    if (holdTicks === 0 && tick === 0) decidedAction = owner.action.type;
    if (fork.phase !== 'playing') paused = true;
    // E-INJURY watch (only meaningful up to the horizon read). The attrs
    // mutation (takeKnock) is the reliable signal; the becomeSub reposition
    // (a same-gid >3m teleport) is only an injury WHILE PLAYING — a restart
    // repositions bodies too, and that is E-PAUSED, not E-INJURY (#49.3).
    if (!injured && elapsed <= HORIZON) {
      const body = fork.allPlayers[watchGid];
      if (body !== undefined) {
        const jump = Math.hypot(body.pos.x - prevX, body.pos.y - prevY);
        const attrsMutated = body.attrs.dribbling !== prevDrb;
        const teleported = fork.phase === 'playing' && jump > INJURY_REPOSITION_M;
        if (attrsMutated || teleported) { injured = true; injuredGid = watchGid; }
        prevDrb = body.attrs.dribbling; prevX = body.pos.x; prevY = body.pos.y;
      }
    }
    if (holdTicks > 0 && elapsed === holdTicks) {
      shotsAtRelease = attacking.stats.shots;
      if (fork.ball.owner?.gid !== ownerGid) { survivedHold = false; lostDuringHold = true; }
    }
    if (holdTicks > 0 && elapsed <= holdTicks && fork.ball.owner?.gid !== ownerGid) {
      lostDuringHold = true;
    }
    if (elapsed === HORIZON) {
      // Read BOTH axes AT the horizon and never again (repair ii kills the
      // clock skew: a hold arm keeps simulating for the release twin, but its
      // concession is captured at elapsed 240, exactly like act-now).
      shot = attacking.stats.shots > shotsBefore;
      conceded = defending.stats.shots > concededBefore;
      horizonReached = true;
      if (holdTicks === 0) break;
    }
  }
  // A window the match ended inside reads at whatever it reached (#48.4).
  if (!horizonReached) {
    shot = attacking.stats.shots > shotsBefore;
    conceded = defending.stats.shots > concededBefore;
  }
  return {
    shot,
    conceded,
    decidedAction,
    survivedHold: holdTicks > 0 ? survivedHold && !lostDuringHold : null,
    lostToTackle: holdTicks > 0
      ? lostDuringHold && defending.stats.tackles > tacklesBefore : null,
    shotFromRelease: holdTicks > 0 && shotsAtRelease >= 0
      ? attacking.stats.shots > shotsAtRelease : null,
    endedInWindow: !horizonReached && fork.finished,
    stalled: !horizonReached && !fork.finished,
    paused,
    injured,
    injuredGid,
    signature: stateSignature(fork),
  };
};

interface Coverage {
  qualifying: number;
  eligible: number;
  excl: Record<string, number>; // X-FIRSTTOUCH / X-MUSTKICK / X-A0-SHOOT / X-A0-CLEAR
}
interface Exceptions {
  paused: number; injured: number; matchEnd: number; noOwner: number; gkHold: number;
  unexplained: number;
}
interface HarvestOut {
  moments: Moment[];
  matches: number;
  clusters: number;
  coverage: Coverage;
  exceptions: Exceptions;
  inertPins: { seed: number; identical: boolean }[];
  receipts: ReceiptBook;
}

/**
 * Walk a seed block; at every QUALIFYING decision moment apply the eligibility
 * predicate (repair iv), and for eligible moments fork the world four ways off
 * the SAME pre-step state — paired by construction. Cluster-driven stop (§3.3).
 */
const harvest = (
  seedStart: number, clusterFloor: number, maxMatches: number, receipts: ReceiptBook,
): HarvestOut => {
  const moments: Moment[] = [];
  const coverage: Coverage = { qualifying: 0, eligible: 0, excl: {} };
  const exceptions: Exceptions = {
    paused: 0, injured: 0, matchEnd: 0, noOwner: 0, gkHold: 0, unexplained: 0,
  };
  const inertPins: { seed: number; identical: boolean }[] = [];
  const clustersWithData = new Set<number>();
  let matches = 0;
  const excl = (cls: string, seed: number, tick: number, gid: number): void => {
    coverage.excl[cls] = (coverage.excl[cls] ?? 0) + 1;
    addReceipt(receipts, cls, seed, tick, gid, cls);
  };
  for (let seed = seedStart; seed < seedStart + maxMatches; seed++) {
    matches += 1;
    const cluster = seed - seedStart;
    const match = matchOf(seed, true);
    let sinceLast = MOMENT_SPACING;
    let inMatch = 0;
    let firstEligibleSeen = false;
    while (!match.finished && inMatch < PER_MATCH_CAP) {
      const owner: Player | null = match.ball.owner;
      const qualifies = match.phase === 'playing' && owner !== null
        && owner.role !== 'GK' && !owner.sentOff
        && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
      if (qualifies) {
        coverage.qualifying += 1;
        const gid = owner!.gid;
        const tick = match.simTick;
        // Eligibility predicate (repair iv, §1.5) — read paired from pre-fork.
        if (owner!.firstTouchWindow > 0) {
          excl('X-FIRSTTOUCH', seed, tick, gid);
        } else if (match.restartKickGid === gid) {
          excl('X-MUSTKICK', seed, tick, gid);
        } else {
          const before = cloneSimulationState(match);
          const a0 = runArm(before, gid, 0);
          if (a0.decidedAction === 'Shoot') {
            excl('X-A0-SHOOT', seed, tick, gid);
          } else if (a0.decidedAction === 'ClearBall') {
            excl('X-A0-CLEAR', seed, tick, gid);
          } else {
            // ELIGIBLE — fork the three hold arms and bank the moment.
            const side = owner!.side;
            const opponents = match.teams[1 - side].players;
            const support = match.teams[side].players.filter((p) => (
              p.gid !== gid && p.role !== 'GK' && !p.sentOff
              && distance(p.pos, owner!.pos) >= SUPPORT_MIN_M
              && distance(p.pos, owner!.pos) <= SUPPORT_MAX_M
            )).length;
            const arms = [a0, runArm(before, gid, 30), runArm(before, gid, 60), runArm(before, gid, 90)];
            // X4, on the first eligible moment of the first three clusters: an
            // ALREADY EXPIRED forcedHold must leave the world byte-identical to A0.
            if (cluster < 3 && !firstEligibleSeen) {
              const inert = cloneSimulationState(before);
              inert.forcedHold = { gid, untilTick: inert.simTick };
              for (let step = 0; step < HORIZON && !inert.finished; step++) inert.step(DT);
              inertPins.push({ seed, identical: stateSignature(inert) === arms[0].signature });
            }
            // §3.5 exceptions, event-keyed across the forked arms (REPORTED).
            for (const arm of arms) {
              if (arm.paused) {
                exceptions.paused += 1;
                addReceipt(receipts, 'E-PAUSED', seed, tick, gid, 'window-entered-non-playing');
              }
              if (arm.injured) {
                exceptions.injured += 1;
                addReceipt(receipts, 'E-INJURY', seed, tick, arm.injuredGid, 'attrs-mutation-or-reposition');
              }
              if (arm.endedInWindow) {
                exceptions.matchEnd += 1;
                addReceipt(receipts, 'E-MATCHEND', seed, tick, gid, 'match-ended-in-window');
              }
              // unexplained (#38.1): the ONLY reason a window fails to reach the
              // horizon is a match end — a stalled clock is unattributed.
              if (arm.stalled) {
                exceptions.unexplained += 1;
                addReceipt(receipts, 'UNEXPLAINED', seed, tick, gid, 'window-stalled-no-horizon-no-end');
              }
            }
            coverage.eligible += 1;
            clustersWithData.add(cluster);
            firstEligibleSeen = true;
            moments.push({
              cluster, seed, tick, ownerGid: gid,
              pressureBand: pressureBandOf(pressureAt(owner!.pos, opponents)),
              staleBand: staleBandOf(match.teams[side].staleTime),
              support, arms,
            });
          }
        }
        sinceLast = 0;
        inMatch += 1;
      }
      match.step(DT);
      sinceLast += 1;
    }
    if (clustersWithData.size >= clusterFloor) break; // cluster-driven stop (§3.3)
  }
  return {
    moments, matches, clusters: clustersWithData.size, coverage, exceptions, inertPins, receipts,
  };
};

// --- statistics (cluster unit = the match seed, ruling #20) -----------------
interface CI { point: number; lower: number; upper: number; clusters: number }
const clusterBootstrap = (
  rows: readonly { readonly cluster: number; readonly value: number }[], offset: number,
): CI => {
  const byCluster = new Map<number, number[]>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster);
    if (bucket === undefined) byCluster.set(row.cluster, [row.value]); else bucket.push(row.value);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let sum = 0;
    let n = 0;
    for (let index = 0; index < clusters.length; index++) {
      for (const value of clusters[rng.int(0, clusters.length - 1)]) { sum += value; n += 1; }
    }
    if (n > 0) draws.push(sum / n);
  }
  draws.sort((left, right) => left - right);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  const point = rows.length === 0 ? Number.NaN
    : rows.reduce((sum, row) => sum + row.value, 0) / rows.length;
  return { point, lower: at(0.025), upper: at(0.975), clusters: clusters.length };
};

const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);
const round = (value: number, dp = 6): number =>
  (Number.isFinite(value) ? Number(value.toFixed(dp)) : Number.NaN);
const canonical = (value: unknown): string => JSON.stringify(value);

/** Support-count terciles, computed on the BUILD block and applied to both. */
const supportCuts = (values: readonly number[]) => {
  const sorted = [...values].sort((left, right) => left - right);
  const third = Math.floor(sorted.length / 3);
  return { low: sorted[third] ?? 0, high: sorted[sorted.length - third] ?? 0 };
};
const supportBandOf = (
  value: number, cuts: { low: number; high: number },
): Band => (value < cuts.low ? 0 : value >= cuts.high ? 2 : 1);

const ARM_NAMES = ['actNow', 'hold30', 'hold60', 'hold90'] as const;

/**
 * REPAIR (i): the census table with per-cell LADDERED cluster-CI costs. For each
 * of the 27 cells the rate AND the paired cost per k are computed on the
 * population the cell falls TO (P_rung), and each cost carries a 95% cluster
 * bootstrap CI — the #29.3 unpark input, computable at last (§1.1).
 */
const buildTable = (
  moments: readonly Moment[], cuts: { low: number; high: number }, offsetBase: number,
) => {
  const keyOf = (m: Moment) => `${m.pressureBand}|${m.staleBand}|${supportBandOf(m.support, cuts)}`;
  const cellPop = new Map<string, Moment[]>();
  for (const m of moments) {
    const bucket = cellPop.get(keyOf(m));
    if (bucket === undefined) cellPop.set(keyOf(m), [m]); else bucket.push(m);
  }
  const rateOf = (rows: readonly Moment[], arm: number) => (rows.length === 0 ? Number.NaN
    : rows.filter((m) => m.arms[arm].shot).length / rows.length);
  const rowsFor = (predicate: (m: Moment) => boolean) => moments.filter(predicate);
  const rungPop = (rung: string, p: number, s: number, sup: number): Moment[] => {
    if (rung === 'cell') return cellPop.get(`${p}|${s}|${sup}`) ?? [];
    if (rung === 'pressureStale') return rowsFor((m) => m.pressureBand === p && m.staleBand === s);
    if (rung === 'pressure') return rowsFor((m) => m.pressureBand === p);
    return moments as Moment[];
  };

  // Memoised paired-cost bootstrap per (rung population, k) — many cells share a
  // laddered population; a stable, order-deterministic offset keeps X-DET.
  const costCache = new Map<string, CI>();
  let offsetTick = offsetBase;
  const costFor = (rung: string, p: number, s: number, sup: number, arm: number, pop: Moment[]): CI => {
    const rungKey = rung === 'cell' ? `${p}|${s}|${sup}` : rung === 'pressureStale'
      ? `${p}|${s}` : rung === 'pressure' ? `${p}` : 'marginal';
    const cacheKey = `${rungKey}#${arm}`;
    const hit = costCache.get(cacheKey);
    if (hit !== undefined) return hit;
    const ci = clusterBootstrap(pop.map((m) => ({
      cluster: m.cluster, value: (m.arms[arm].shot ? 1 : 0) - (m.arms[0].shot ? 1 : 0),
    })), offsetTick);
    offsetTick += 1;
    costCache.set(cacheKey, ci);
    return ci;
  };

  const cellRows = [...cellPop.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, rows]) => {
    const [p, s, sup] = k.split('|').map(Number);
    // Frozen ladder, floor 300: (p × s × sup) → (p × s) → p → marginal.
    const rung = rows.length >= BUCKET_FLOOR ? 'cell'
      : rowsFor((m) => m.pressureBand === p && m.staleBand === s).length >= BUCKET_FLOOR
        ? 'pressureStale'
        : rowsFor((m) => m.pressureBand === p).length >= BUCKET_FLOOR ? 'pressure' : 'marginal';
    const pop = rungPop(rung, p, s, sup);
    return {
      pressureBand: p, staleBand: s, supportBand: sup, n: rows.length, rung, rungN: pop.length,
      rates: Object.fromEntries(ARM_NAMES.map((name, arm) => [name, round(rateOf(pop, arm))])),
      // The unpark input: paired cost per k, on the laddered population, with CI.
      costs: HOLD_LADDER.map((holdTicks, index) => {
        const ci = costFor(rung, p, s, sup, index + 1, pop);
        return {
          holdTicks, point: round(ci.point), lower: round(ci.lower), upper: round(ci.upper),
          reachesZero: ci.upper >= 0, // §2: the unpark test for this (cell, k)
        };
      }),
    };
  });

  const pressureRows = ([0, 1, 2] as Band[]).map((p) => {
    const rows = rowsFor((m) => m.pressureBand === p);
    return {
      pressureBand: p, n: rows.length,
      rates: Object.fromEntries(ARM_NAMES.map((name, arm) => [name, round(rateOf(rows, arm))])),
    };
  });

  return {
    cells: cellRows,
    pressureRows,
    marginal: {
      n: moments.length,
      rates: Object.fromEntries(
        ARM_NAMES.map((name, arm) => [name, round(rateOf(moments, arm))]),
      ) as Record<typeof ARM_NAMES[number], number>,
    },
  };
};

const describeBlock = (
  out: HarvestOut, cuts: { low: number; high: number }, offsetBase: number,
) => {
  const table = buildTable(out.moments, cuts, offsetBase);
  return {
    matches: out.matches, clusters: out.clusters, moments: out.moments.length,
    coverage: {
      qualifying: out.coverage.qualifying,
      eligible: out.coverage.eligible,
      retainedFraction: round(out.coverage.eligible / Math.max(1, out.coverage.qualifying)),
      exclusions: out.coverage.excl,
    },
    exceptions: out.exceptions,
    table,
  };
};

const runExperiment = () => {
  const receipts: ReceiptBook = {};
  const build = harvest(BUILD_SEED_START, CLUSTER_FLOOR_BUILD, MAX_MATCHES_BUILD, receipts);
  const heldout = harvest(HELDOUT_SEED_START, CLUSTER_FLOOR_HELDOUT, MAX_MATCHES_HELDOUT, receipts);
  const cuts = supportCuts(build.moments.map((m) => m.support));

  const buildBlock = describeBlock(build, cuts, 1_000);
  const heldoutBlock = describeBlock(heldout, cuts, 5_000);

  // --- §3.2: the exchange rate, PAIRED per moment, reported never gated ------
  const exchange = HOLD_LADDER.map((k, index) => {
    const arm = index + 1;
    const paired = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster, value: (m.arms[arm].shot ? 1 : 0) - (m.arms[0].shot ? 1 : 0),
    })), index);
    const unpairedHold = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster, value: m.arms[arm].shot ? 1 : 0,
    })), 10 + index);
    const unpairedNow = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster, value: m.arms[0].shot ? 1 : 0,
    })), 20 + index);
    // REPAIR (ii): the concession twin is now clock-correct (elapsed 240 both).
    const concession = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster, value: (m.arms[arm].conceded ? 1 : 0) - (m.arms[0].conceded ? 1 : 0),
    })), 30 + index);
    const byPressure = ([0, 1, 2] as Band[]).map((p) => {
      const rows = build.moments.filter((m) => m.pressureBand === p);
      return {
        pressureBand: p, n: rows.length,
        delta: round(mean(rows.map((m) => (m.arms[arm].shot ? 1 : 0) - (m.arms[0].shot ? 1 : 0)))),
      };
    });
    // §1.4 the release-origin twin — reported beside the primary, never gated.
    const released = build.moments.filter((m) => m.arms[arm].shotFromRelease !== null);
    const releaseTwin = clusterBootstrap(released.map((m) => ({
      cluster: m.cluster, value: (m.arms[arm].shotFromRelease ? 1 : 0) - (m.arms[0].shot ? 1 : 0),
    })), 40 + index);
    return {
      holdTicks: k,
      paired: { point: round(paired.point), lower: round(paired.lower), upper: round(paired.upper) },
      unpaired: {
        hold: round(unpairedHold.point), actNow: round(unpairedNow.point),
        delta: round(unpairedHold.point - unpairedNow.point),
        holdCi: [round(unpairedHold.lower), round(unpairedHold.upper)],
      },
      concessionTwin: {
        point: round(concession.point), lower: round(concession.lower), upper: round(concession.upper),
      },
      byPressure,
      releaseTwin: {
        n: released.length, point: round(releaseTwin.point),
        lower: round(releaseTwin.lower), upper: round(releaseTwin.upper),
      },
      holdAnatomy: {
        survived: round(mean(build.moments.map((m) => (m.arms[arm].survivedHold ? 1 : 0)))),
        lostToTackle: round(mean(build.moments.map((m) => (m.arms[arm].lostToTackle ? 1 : 0)))),
      },
    };
  });

  // --- §2: the #29.3 unpark test (COMPUTED, returned; the commander drafts) --
  const offenders: { cell: string; rung: string; holdTicks: number; point: number; upper: number }[] = [];
  for (const cell of buildBlock.table.cells) {
    for (const cost of cell.costs) {
      if (cost.reachesZero) {
        offenders.push({
          cell: `${cell.pressureBand}|${cell.staleBand}|${cell.supportBand}`,
          rung: cell.rung, holdTicks: cost.holdTicks, point: cost.point, upper: cost.upper,
        });
      }
    }
  }
  const unpark = { fires: offenders.length > 0, offenders };

  // --- §3.0: H1 power — realised σ_c and the 3σ verification -----------------
  const byMatchActNow = new Map<number, { shot: number; n: number }>();
  for (const m of build.moments) {
    const acc = byMatchActNow.get(m.cluster) ?? { shot: 0, n: 0 };
    acc.shot += m.arms[0].shot ? 1 : 0; acc.n += 1;
    byMatchActNow.set(m.cluster, acc);
  }
  const perMatchRates = [...byMatchActNow.values()].filter((v) => v.n > 0).map((v) => v.shot / v.n);
  const rateMean = mean(perMatchRates);
  const sigmaC = perMatchRates.length > 1
    ? Math.sqrt(perMatchRates.reduce((s, r) => s + (r - rateMean) ** 2, 0) / (perMatchRates.length - 1))
    : Number.NaN;
  const seDiff = sigmaC * Math.sqrt(1 / Math.max(1, build.clusters) + 1 / Math.max(1, heldout.clusters));
  const sigmaMultiple = seDiff > 0 ? H1_TOLERANCE / seDiff : Number.NaN;

  // --- gates ----------------------------------------------------------------
  const x4 = build.inertPins.length > 0 && build.inertPins.every((pin) => pin.identical);
  const bite = mean(build.moments.map((m) => (m.arms[3].signature !== m.arms[0].signature ? 1 : 0)));
  const x5 = bite >= X5_BITE_FLOOR;
  const rowFloorOk = (block: ReturnType<typeof describeBlock>) =>
    block.table.pressureRows.every((row) => row.n >= PRESSURE_ROW_FLOOR);

  const h1 = ARM_NAMES.map((name) => ({
    arm: name,
    delta: round(Math.abs(
      buildBlock.table.marginal.rates[name] - heldoutBlock.table.marginal.rates[name],
    )),
  }));
  const h2 = ([0, 1, 2] as Band[]).flatMap((p) => {
    const b = buildBlock.table.pressureRows[p];
    const h = heldoutBlock.table.pressureRows[p];
    if (b.n < PRESSURE_ROW_FLOOR || h.n < PRESSURE_ROW_FLOOR) return [];
    return ARM_NAMES.map((name) => ({
      pressureBand: p, arm: name, delta: round(Math.abs(b.rates[name] - h.rates[name])),
    }));
  });
  const unexplainedTotal = build.exceptions.unexplained + heldout.exceptions.unexplained;

  const gates = {
    x4SeamInert: x4,
    x5SeamBites: x5,
    c1Build: buildBlock.clusters >= CLUSTER_FLOOR_BUILD,
    c2Heldout: heldoutBlock.clusters >= CLUSTER_FLOOR_HELDOUT,
    c3RowFloors: rowFloorOk(buildBlock) && rowFloorOk(heldoutBlock),
    h1Marginal: h1.every((row) => row.delta <= H1_TOLERANCE),
    h1SigmaFloor: Number.isFinite(sigmaMultiple) && sigmaMultiple >= H1_SIGMA_FLOOR,
    h2PressureRows: h2.length > 0 && h2.every((row) => row.delta <= H2_TOLERANCE),
    unexplainedZero: unexplainedTotal === 0,
  };

  return {
    experiment: 'C5-RE-CENSUS',
    authority: 'C5-RECENSUS',
    parameters: {
      buildSeedStart: BUILD_SEED_START, heldoutSeedStart: HELDOUT_SEED_START,
      clusterFloorBuild: CLUSTER_FLOOR_BUILD, clusterFloorHeldout: CLUSTER_FLOOR_HELDOUT,
      maxMatchesBuild: MAX_MATCHES_BUILD, maxMatchesHeldout: MAX_MATCHES_HELDOUT,
      perMatchCap: PER_MATCH_CAP, momentSpacing: MOMENT_SPACING,
      horizon: HORIZON, holdLadder: HOLD_LADDER,
      pressureBands: PRESSURE_BANDS, staleBands: STALE_BANDS,
      supportWindowM: [SUPPORT_MIN_M, SUPPORT_MAX_M], supportCuts: cuts,
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
      aiIntervalTicks: round(AI_INTERVAL / DT, 4),
      clusterUnit: 'match seed',
      arm: 'VALUE (perceived pair + value axis) + c5Hold + c6Carry + c7Windup, EVERY arm',
    },
    build: buildBlock,
    heldout: heldoutBlock,
    exchange,
    unpark,
    h1Power: {
      sigmaC: round(sigmaC, 6), seDiff: round(seDiff, 6), sigmaMultiple: round(sigmaMultiple, 4),
      clustersBuild: build.clusters, clustersHeldout: heldout.clusters, floor: H1_SIGMA_FLOOR,
    },
    reported: { seamBiteShare: round(bite), inertPins: build.inertPins, h1, h2 },
    receipts: {
      cap: RECEIPT_CAP,
      counts: Object.fromEntries(Object.entries(receipts).map(([k, v]) => [k, v.length])),
      records: receipts,
    },
    gates,
  };
};

// --- §9 time-signature instruments (whole matches, unforked, both worlds) ---
const timeSignature = (enriched: boolean) => {
  const spells: { ticks: number; released: boolean }[] = [];
  let passes = 0;
  let oneTouch = 0;
  let possessionTime = 0;
  for (let seed = BUILD_SEED_START; seed < BUILD_SEED_START + TS_MATCHES; seed++) {
    const match = matchOf(seed, enriched);
    let ownerGid = -1;
    let ticks = 0;
    const close = (): void => {
      if (ownerGid !== -1 && ticks > 0) {
        spells.push({ ticks, released: match.ball.owner === null && match.ball.lastTouch?.gid === ownerGid });
      }
      ticks = 0;
    };
    while (!match.finished) {
      match.step(DT);
      const current = match.phase === 'playing' ? (match.ball.owner?.gid ?? -1) : -1;
      if (current !== ownerGid) { close(); ownerGid = current; }
      if (current !== -1) ticks += 1;
    }
    close();
    for (const t of match.teams) {
      passes += t.stats.passes;
      oneTouch += t.stats.oneTouch;
      possessionTime += t.stats.possessionTime;
    }
  }
  const secs = spells.map((s) => s.ticks * DT);
  const sorted = [...secs].sort((left, right) => left - right);
  const q = (p: number) => (sorted.length === 0 ? Number.NaN
    : sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))]);
  const released = spells.filter((s) => s.released).map((s) => s.ticks * DT);
  const lost = spells.filter((s) => !s.released).map((s) => s.ticks * DT);
  return {
    world: enriched ? 'ENRICHED (VALUE + c6Carry + c7Windup)' : 'legacy (flags-off)',
    matches: TS_MATCHES,
    ts1PassesPerMinute: round(passes / (possessionTime / 60), 4),
    ts2OneTouchShare: round(oneTouch / passes),
    ts3SpellSeconds: {
      n: spells.length, mean: round(mean(secs), 4), median: round(q(0.5), 4), p90: round(q(0.9), 4),
    },
    ts4TimeToRelease: {
      releasedN: released.length, releasedMean: round(mean(released), 4),
      lostN: lost.length, lostMean: round(mean(lost), 4),
    },
    ts5DecisionsPerSpell: round(mean(secs.map((s) => s / AI_INTERVAL)), 4),
  };
};

// --- X-DET: two byte-identical invocations + canonical SHA -------------------
const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');

const tempo = [timeSignature(false), timeSignature(true)];
const gates = { ...first.gates, dDeterministic: deterministic };
const output = {
  ...first, tempo, gates, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL',
};

// The deliverable (§3.3): the table as DATA, SHA'd.
const tablePayload = {
  authority: 'C5-RECENSUS',
  parameters: first.parameters,
  build: first.build.table,
  heldout: first.heldout.table,
  unpark: first.unpark,
  h1Power: first.h1Power,
};
const tableJson = JSON.stringify(tablePayload);
const tableSha = createHash('sha256').update(tableJson).digest('hex');
writeFileSync(OUT_PATH, `${JSON.stringify({ ...output, tableSha }, null, 2)}\n`);

const pp = (value: number) => `${(value * 100).toFixed(2)}pp`;
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
console.error(
  `C5-RE-CENSUS ${output.verdict} · build ${output.build.moments} moments / ${output.build.clusters}`
  + ` clusters (${output.build.matches} matches) · heldout ${output.heldout.moments} / ${output.heldout.clusters}`
  + ` (${output.heldout.matches}) · retained ${pct(output.build.coverage.retainedFraction)}`
  + ` · marginal actNow ${pct(output.build.table.marginal.rates.actNow)}`
  + ` hold30 ${pct(output.build.table.marginal.rates.hold30)}`
  + ` hold60 ${pct(output.build.table.marginal.rates.hold60)}`
  + ` hold90 ${pct(output.build.table.marginal.rates.hold90)}`
  + ` · EXCHANGE ${output.exchange.map((e) => (
    `k=${e.holdTicks} ${pp(e.paired.point)} CI[${pp(e.paired.lower)}, ${pp(e.paired.upper)}]`
  )).join(' · ')}`
  + ` · concession ${output.exchange.map((e) => pp(e.concessionTwin.point)).join('/')}`
  + ` · release-twin ${output.exchange.map((e) => pp(e.releaseTwin.point)).join('/')}`
  + ` · UNPARK ${output.unpark.fires ? `FIRES (${output.unpark.offenders.length} cell-k)` : 'does not fire'}`
  + ` · H1 ${output.reported.h1.map((r) => `${r.arm} ${pp(r.delta)}`).join(' ')}`
  + ` · σ_c ${pp(output.h1Power.sigmaC)} SE ${pp(output.h1Power.seDiff)} = ${output.h1Power.sigmaMultiple}σ`
  + ` · bite ${pct(output.reported.seamBiteShare)}`
  + ` · exc paused ${first.build.exceptions.paused} inj ${first.build.exceptions.injured}`
  + ` end ${first.build.exceptions.matchEnd} unexpl ${first.build.exceptions.unexplained}`
  + ` · tempo legacy ${output.tempo[0].ts1PassesPerMinute}/min vs enriched ${output.tempo[1].ts1PassesPerMinute}/min`
  + ` · spell median ${output.tempo[0].ts3SpellSeconds.median}s vs ${output.tempo[1].ts3SpellSeconds.median}s`
  + ` · det ${deterministic} · failed [${failed.join(', ')}] · SHA ${sha256} · table ${tableSha}`,
);
