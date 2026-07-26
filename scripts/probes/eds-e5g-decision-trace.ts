// EDS E5g — THE DECISION-MOMENT TRACE: WHY ISN'T HE TAKEN?
// Authority: docs/world-model/EDS-E5G-DECISION-TRACE.md
//
// E5f localised the overlap collapse to ONE stage — releases per licence
// trigger, 22.86% -> 11.43% — with more overlappers assigned upstream, the
// counter intact downstream, and the perception hypothesis dead by its own
// decomposition. E5e Phase 0 (b) had already measured the same runner as the
// TOP-PRICED option at his own licence moments.
//
// So the chooser that prices him highest picks him half as often. This asks the
// seam directly instead of modelling it: at every pass-decision moment inside
// an overlapper-live window, what menu did the chooser see, what did it price
// each option at, where did the runner rank, and what did it pick?
//
// Three outcomes are pre-laid and exhaustive over the CHOICE (contract §3), and
// a fourth quantity — the chooser->release gap — is measured separately because
// the action layer decides whether to pass at all (contract §3.1).
import { createHash } from 'node:crypto';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { valueZoneIndex } from '../../src/ai/passPrior';
import { League } from '../../src/sim/League';
import type { Match, PassChoiceTraceEntry } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { DT } from '../../src/sim/constants';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §4, §5) ------------------------------------
const LEAGUE_SEEDS = [20260702, 20260801, 20260802, 20260803, 20260804, 20260805] as const;
const SEASONS = Number(process.argv[2] ?? 24);
/** P1: E5f's banked VALUE-arm funnel, per cluster, in seed order. */
const P1_BANKED = {
  matches: 1704,
  f1: [7695, 5471, 10337, 6456, 9986, 11376],
  f2: [701, 515, 718, 472, 1034, 1372],
  f3: [78, 65, 78, 59, 145, 125],
  f4: [33, 33, 31, 32, 59, 57],
  counter: [74, 65, 82, 66, 126, 129],
} as const;
/** P0: world-hash identity, trace on vs off. */
const P0_SEEDS = [20260702, 20260803, 20260805] as const;
const P0_SEASONS = 2;
const P2_MOMENT_FLOOR = 2000;
const OVERLAP_MIN_ABS_Y = 9;
const OVERLAP_MIN_LOCAL_X_GAIN = -6;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50003; // frozen

const VALUE_FLAGS = {
  edsPerceivedDefence: true,
  edsPerceivedChoice: true,
  edsValueAxis: true,
} as const;

/** The full legacy release predicate — the come-around, `PlayerBrain.ts`. */
const licenceActive = (team: Team, holder: Player, runner: Player): boolean => {
  if (!passChoiceCandidateGids(holder, team.players).includes(runner.gid)) return false;
  if (Math.abs(runner.pos.y) <= OVERLAP_MIN_ABS_Y) return false;
  return team.localX(runner.pos.x) > team.localX(holder.pos.x) + OVERLAP_MIN_LOCAL_X_GAIN;
};

// --- one decision moment ----------------------------------------------------
interface Moment {
  readonly cluster: number;
  /** Was the runner an EXECUTABLE option on the menu? */
  readonly onMenu: boolean;
  /** Present at all, executable or not (an unseen man is priced but unplayable). */
  readonly priced: boolean;
  /** 1 = top-priced among executable options; 0 when not on the menu. */
  readonly rank: number;
  readonly executableCount: number;
  /** winner's price − runner's price, in the price's own units. */
  readonly margin: number;
  readonly runnerPrice: number;
  readonly winnerPrice: number;
  readonly chosenIsRunner: boolean;
  readonly chosenGid: number;
  /** The stale-geometry seam: what he was priced AS vs where he actually was. */
  readonly pricedCell: number;
  readonly truthCell: number;
  readonly band: number;
  readonly infoClass: string;
  readonly winnerCell: number;
  readonly winnerBand: number;
}

interface ClusterResult {
  readonly seed: number;
  readonly matches: number;
  readonly f1: number;
  readonly f2: number;
  readonly f3: number;
  readonly f4: number;
  readonly counter: number;
  readonly moments: Moment[];
}

/**
 * One VALUE-arm league, stepped by hand. E5f's funnel is recomputed alongside
 * the trace so P1 can pin this staging against E5f's banked integers — the same
 * double duty P0 did there: a pin that also proves the instrument is inert.
 */
const runLeagueArm = (seed: number, clusterIndex: number): ClusterResult => {
  const league = new League({ seed });
  league.matchFlags = { ...VALUE_FLAGS, traceChoice: true };
  let matches = 0;
  let f1 = 0;
  let f2 = 0;
  let f3 = 0;
  let f4 = 0;
  let counter = 0;
  const moments: Moment[] = [];

  for (let season = 0; season < SEASONS; season++) {
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      const open: ({ f2: boolean; f3: boolean; f4: boolean } | null)[] = [null, null];
      const openIndex: (number | null)[] = [null, null];
      const openOverlaps = [0, 0];
      /** tick -> the licence-active holder/runner pair and the runner's truth cell. */
      const liveAt = new Map<number, {
        holderGid: number; runnerGid: number; truthCell: number;
      }>();
      const closeSpan = (side: 0 | 1, team: Team) => {
        const span = open[side];
        if (span === null) return;
        f1 += 1;
        if (span.f2) {
          f2 += 1;
          if (span.f3) f3 += 1;
          // E5f's accounting, VERBATIM: F4 is "the counter fired during this
          // span", NOT "the release we counted arrived wide". The two differ —
          // P1 caught this probe nesting F4 under F3 and the pin fired on three
          // spans out of ~4,800, where the counter fired without a release to
          // the runner being recorded inside the span. Corrected toward the
          // pre-registration (contract §3's own wording), never toward a number.
          if (team.stats.overlaps > openOverlaps[side]) f4 += 1;
        }
        open[side] = null;
        openIndex[side] = null;
      };
      while (!match.finished) {
        // The brain logs `match.simTick`, which is stepCount AFTER the increment
        // at the top of step() — so the tick this pre-step state belongs to is
        // the current simTick + 1.
        const brainTick = match.simTick + 1;
        for (const side of [0, 1] as const) {
          const team = match.teams[side];
          const index = team.overlapper;
          if (index !== openIndex[side]) {
            closeSpan(side, team);
            if (index !== null) {
              open[side] = { f2: false, f3: false, f4: false };
              openIndex[side] = index;
              openOverlaps[side] = team.stats.overlaps;
            }
          }
          const span = open[side];
          if (span === null || index === null) continue;
          const runner = team.players[index];
          const pending = match.pendingPass;
          if (pending && pending.targetGid === runner.gid) span.f3 = true;
          const holder = match.ball.owner;
          if (holder === null || holder.side !== side || holder.gid === runner.gid) continue;
          if (!licenceActive(team, holder, runner)) continue;
          span.f2 = true;
          liveAt.set(brainTick, {
            holderGid: holder.gid,
            runnerGid: runner.gid,
            // His TRUTH cell, in his own team's attacking frame, pre-integration.
            truthCell: valueZoneIndex(team.localX(runner.pos.x), runner.pos.y),
          });
        }
        match.step(DT);
      }
      for (const side of [0, 1] as const) closeSpan(side, match.teams[side]);
      // Join the trace to the licence-active ticks, then drop it: the trace is
      // per match and must never accumulate across a 1,704-match season block.
      for (const entry of match.passChoiceTrace) {
        const live = liveAt.get(entry.tick);
        if (live === undefined || live.holderGid !== entry.passerGid) continue;
        moments.push(momentOf(entry, live.runnerGid, live.truthCell, clusterIndex));
      }
      match.passChoiceTrace.length = 0;
      league.applyResult(fixture, match.getResult());
      matches += 1;
      for (const stat of match.getResult().stats) counter += stat.overlaps;
    }
    league.finishSeason();
  }
  return { seed, matches, f1, f2, f3, f4, counter, moments };
};

const momentOf = (
  entry: PassChoiceTraceEntry, runnerGid: number, truthCell: number, cluster: number,
): Moment => {
  const executable = entry.options.filter((option) => option.executable);
  const runner = entry.options.find((option) => option.targetGid === runnerGid);
  const onMenu = runner !== undefined && runner.executable;
  // The chooser's own tie-break, verbatim: higher price wins, lower gid breaks.
  const winner = executable.length === 0 ? undefined : executable.reduce((best, option) => (
    option.price > best.price || (option.price === best.price && option.targetGid < best.targetGid)
      ? option : best));
  const rank = !onMenu || winner === undefined ? 0
    : 1 + executable.filter((option) => (
      option.price > runner!.price
      || (option.price === runner!.price && option.targetGid < runnerGid)
    )).length;
  return {
    cluster,
    onMenu,
    priced: runner !== undefined,
    rank,
    executableCount: executable.length,
    margin: winner === undefined || runner === undefined ? Number.NaN
      : winner.price - runner.price,
    runnerPrice: runner?.price ?? Number.NaN,
    winnerPrice: winner?.price ?? Number.NaN,
    chosenIsRunner: entry.chosenGid === runnerGid,
    chosenGid: entry.chosenGid,
    pricedCell: runner?.cell ?? -1,
    truthCell,
    band: runner?.band ?? -1,
    infoClass: runner?.infoClass ?? 'ABSENT',
    winnerCell: winner?.cell ?? -1,
    winnerBand: winner?.band ?? -1,
  };
};

// --- P0: the trace is a sidecar ---------------------------------------------
const worldHash = (seed: number, trace: boolean): string => {
  const league = new League({ seed });
  league.matchFlags = trace ? { ...VALUE_FLAGS, traceChoice: true } : { ...VALUE_FLAGS };
  const digest = createHash('sha256');
  for (let season = 0; season < P0_SEASONS; season++) {
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      const result = match.runToCompletion();
      league.applyResult(fixture, result);
      digest.update(JSON.stringify({ score: result.score, stats: result.stats }));
    }
    league.finishSeason();
  }
  return digest.digest('hex');
};

// --- intervals (cluster unit = league seed, ruling #20) ---------------------
const clusterBootstrapCI = (
  clusters: readonly { readonly hits: number; readonly n: number }[], offset: number,
) => {
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const rates: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let hits = 0;
    let n = 0;
    for (let index = 0; index < clusters.length; index++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      hits += pick.hits;
      n += pick.n;
    }
    rates.push(n === 0 ? Number.NaN : hits / n);
  }
  rates.sort((left, right) => left - right);
  const at = (q: number) => rates[Math.min(rates.length - 1,
    Math.max(0, Math.floor(q * (rates.length - 1))))];
  return { lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

const share = (
  moments: readonly Moment[], clusters: number, predicate: (moment: Moment) => boolean,
  offset: number,
) => {
  const hits = moments.filter(predicate).length;
  const perCluster = Array.from({ length: clusters }, (_, index) => {
    const rows = moments.filter((moment) => moment.cluster === index);
    return { hits: rows.filter(predicate).length, n: rows.length };
  });
  return {
    hits,
    n: moments.length,
    rate: moments.length === 0 ? Number.NaN : hits / moments.length,
    clusterCI: clusterBootstrapCI(perCluster, offset),
    perCluster: perCluster.map((row) => ({
      ...row, rate: row.n === 0 ? Number.NaN : row.hits / row.n,
    })),
  };
};

const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const p0 = P0_SEEDS.map((seed) => {
    const on = worldHash(seed, true);
    const off = worldHash(seed, false);
    return { seed, identical: on === off, hash: off };
  });

  const clusters = LEAGUE_SEEDS.map((seed, index) => runLeagueArm(seed, index));
  const p1 = clusters.every((cluster, index) => (
    cluster.matches === P1_BANKED.matches
    && cluster.f1 === P1_BANKED.f1[index] && cluster.f2 === P1_BANKED.f2[index]
    && cluster.f3 === P1_BANKED.f3[index] && cluster.f4 === P1_BANKED.f4[index]
    && cluster.counter === P1_BANKED.counter[index]
  ));

  const moments = clusters.flatMap((cluster) => cluster.moments);
  const n = clusters.length;
  const p2 = moments.length >= P2_MOMENT_FLOOR;

  // §3: the three outcomes, over the moments where he is NOT the chooser's pick.
  const notChosen = moments.filter((moment) => !moment.chosenIsRunner);
  const outcomes = {
    aOffMenu: share(notChosen, n, (moment) => !moment.onMenu, 0),
    bNotTopPriced: share(notChosen, n, (moment) => moment.onMenu && moment.rank > 1, 1),
    cTopPricedNotChosen: share(notChosen, n, (moment) => moment.onMenu && moment.rank === 1, 2),
  };
  const onMenu = moments.filter((moment) => moment.onMenu);

  return {
    experiment: 'EDS-E5g',
    authority: 'EDS-E5G-DECISION-TRACE',
    parameters: {
      leagueSeeds: LEAGUE_SEEDS, seasons: SEASONS, clusterUnit: 'league seed',
      banked: P1_BANKED, momentFloor: P2_MOMENT_FLOOR,
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
    },
    p0,
    funnel: clusters.map((cluster) => ({
      seed: cluster.seed, matches: cluster.matches,
      f1: cluster.f1, f2: cluster.f2, f3: cluster.f3, f4: cluster.f4,
      counter: cluster.counter, moments: cluster.moments.length,
    })),
    decisionMoments: moments.length,
    /**
     * The clock question, upstream of the three outcomes: how many licence-active
     * assignments produce a licence-active DECISION at all. The three outcomes
     * partition the decision moments; this says how few there are to partition.
     */
    decisionsPerF2: {
      moments: moments.length,
      f2: clusters.reduce((sum, cluster) => sum + cluster.f2, 0),
      perAssignment: moments.length
        / Math.max(clusters.reduce((sum, cluster) => sum + cluster.f2, 0), 1),
      perCluster: clusters.map((cluster) => ({
        seed: cluster.seed, moments: cluster.moments.length, f2: cluster.f2,
        perAssignment: cluster.moments.length / Math.max(cluster.f2, 1),
      })),
    },
    // The headline splits, over ALL licence-active decision moments.
    menu: {
      pricedAtAll: share(moments, n, (moment) => moment.priced, 3),
      onMenu: share(moments, n, (moment) => moment.onMenu, 4),
      chosen: share(moments, n, (moment) => moment.chosenIsRunner, 5),
      topPriced: share(moments, n, (moment) => moment.onMenu && moment.rank === 1, 6),
      meanExecutable: mean(moments.map((moment) => moment.executableCount)),
    },
    outcomes,
    // §3.1: measured, and deliberately NOT a fourth outcome.
    chooserToRelease: {
      chosenRate: moments.length === 0 ? Number.NaN
        : moments.filter((moment) => moment.chosenIsRunner).length / moments.length,
      bankedF3PerF2: 0.1142975893599335,
      bankedF3PerF2Off: 0.22860635696821516,
    },
    priceGeometry: {
      meanMarginWhenOnMenu: mean(onMenu.map((moment) => moment.margin)),
      meanRunnerPrice: mean(onMenu.map((moment) => moment.runnerPrice)),
      meanWinnerPrice: mean(onMenu.map((moment) => moment.winnerPrice)),
      rankHistogram: Array.from({ length: 8 }, (_, rank) => ({
        rank: rank + 1, n: onMenu.filter((moment) => moment.rank === rank + 1).length,
      })),
      // The stale-geometry seam, if it exists.
      pricedCellMatchesTruth: share(onMenu, n, (moment) => moment.pricedCell === moment.truthCell, 7),
      bandMinusOne: share(onMenu, n, (moment) => moment.band === -1, 8),
      infoClassShares: ['READ', 'SEEN-UNREAD', 'UNSEEN', 'ABSENT'].map((label) => ({
        infoClass: label,
        n: moments.filter((moment) => moment.infoClass === label).length,
      })),
      cellPairs: (() => {
        const counts = new Map<string, number>();
        for (const moment of onMenu) {
          const key = `${moment.pricedCell}->${moment.winnerCell}`;
          counts.set(key, (counts.get(key) ?? 0) + 1);
        }
        return [...counts.entries()].sort((left, right) => right[1] - left[1]).slice(0, 10)
          .map(([pair, count]) => ({ pair, count }));
      })(),
    },
    gates: { p0: p0.every((entry) => entry.identical), p1, p2 },
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, p3Deterministic: deterministic };
const output = {
  ...first,
  gates,
  sha256,
  verdict: gates.p0 && gates.p1 && gates.p3Deterministic ? 'MEASURED' : 'INVALID',
};
console.log(JSON.stringify(output, null, 2));
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
console.error(
  `EDS-E5g ${output.verdict}`
  + ` · P0 ${output.gates.p0} P1 ${output.gates.p1} P2 ${output.gates.p2}`
  + ` · ${output.decisionMoments} licence-active decision moments`
  + ` · priced ${pct(output.menu.pricedAtAll.rate)}`
  + ` · onMenu ${pct(output.menu.onMenu.rate)}`
  + ` [${pct(output.menu.onMenu.clusterCI.lower)}, ${pct(output.menu.onMenu.clusterCI.upper)}]`
  + ` · topPriced ${pct(output.menu.topPriced.rate)}`
  + ` · CHOSEN ${pct(output.menu.chosen.rate)}`
  + ` (banked F3|F2 ${pct(output.chooserToRelease.bankedF3PerF2)},`
  + ` OFF ${pct(output.chooserToRelease.bankedF3PerF2Off)})`
  + ` · outcomes (a) off-menu ${pct(output.outcomes.aOffMenu.rate)}`
  + ` (b) not-top ${pct(output.outcomes.bNotTopPriced.rate)}`
  + ` (c) TOP-BUT-NOT-CHOSEN ${pct(output.outcomes.cTopPricedNotChosen.rate)}`
  + ` · margin ${output.priceGeometry.meanMarginWhenOnMenu.toFixed(4)}`
  + ` (runner ${output.priceGeometry.meanRunnerPrice.toFixed(4)}`
  + ` vs winner ${output.priceGeometry.meanWinnerPrice.toFixed(4)})`
  + ` · pricedCell=truth ${pct(output.priceGeometry.pricedCellMatchesTruth.rate)}`
  + ` · SHA ${sha256}`,
);
