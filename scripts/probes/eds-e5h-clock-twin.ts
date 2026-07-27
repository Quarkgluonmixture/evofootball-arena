// EDS E5h — THE CLOCK TWIN, AND WHAT AN OVERLAP BALL IS WORTH DOWNSTREAM.
// Authority: docs/world-model/EDS-E5H-CLOCK-TWIN.md
//
// E5g found 854 pass-commits inside 4,812 matured overlap runs — but in one arm
// only, and a rate with no twin cannot tell "direct football decides less
// inside windows" from "the window-decision share was always this low".
//
// And E5g left the comparison honest but unexplained: the overlap ball prices
// ~0.92pp second in the deployed world. #24.3 LABELS the reason rather than
// asserting it — if wide patterns cannot cash downstream, honest value is right
// to starve them and the legacy x1.3 was a subsidy — so this censuses it.
//
// Counters only. Zero forks, zero src/**.
import { createHash } from 'node:crypto';
import { passChoiceCandidateGids } from '../../src/ai/perceivedPassChoice';
import { League } from '../../src/sim/League';
import type { Player } from '../../src/sim/Player';
import type { Team } from '../../src/sim/Team';
import { DT } from '../../src/sim/constants';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2, §4) ------------------------------------
const LEAGUE_SEEDS = [20260702, 20260801, 20260802, 20260803, 20260804, 20260805] as const;
const SEASONS = Number(process.argv[2] ?? 24);
/** P0: E5f's banked funnel, per cluster, per arm, in seed order. */
const P0_BANKED = {
  matches: 1704,
  off: {
    f1: [5284, 8556, 7320, 6764, 10768, 7886],
    f2: [352, 805, 573, 668, 1131, 561],
    f3: [121, 153, 145, 104, 273, 139],
    f4: [61, 66, 70, 38, 124, 64],
    counter: [158, 156, 186, 101, 287, 163],
  },
  value: {
    f1: [7695, 5471, 10337, 6456, 9986, 11376],
    f2: [701, 515, 718, 472, 1034, 1372],
    f3: [78, 65, 78, 59, 145, 125],
    f4: [33, 33, 31, 32, 59, 57],
    counter: [74, 65, 82, 66, 126, 129],
  },
} as const;
/** E5g's banked commit count, for the §3.1 calibration (reported, never gated). */
const E5G_BANKED_COMMITS = 854;
/**
 * P1, derived from E5f's banked F3 (935 OFF / 550 VALUE) so attainability is
 * checked ex ante — ruling #24.1's codification of E5g's invented floor.
 */
const P1_RELEASE_FLOOR = 400;
const P1_COMMIT_FLOOR = 300;
const FATE_HORIZON_TICKS = 240; // the deployed axis's own horizon
const OVERLAP_MIN_ABS_Y = 9;
const OVERLAP_MIN_LOCAL_X_GAIN = -6;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50004; // frozen

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

interface Fate {
  readonly cluster: number;
  readonly cross: boolean;
  readonly shot: boolean;
  readonly header: boolean;
  /** The §3.2 PROXY for C4's "found nobody": a cross, no header, no shot. */
  readonly crossFoundNobody: boolean;
  readonly ownedAtEnd: boolean;
  readonly ownedShare: number;
}

interface ArmResult {
  readonly seed: number;
  matches: number;
  f1: number;
  f2: number;
  f3: number;
  f4: number;
  counter: number;
  /** The twin: pass-commits by a licence-active holder. */
  commits: number;
  /** Of those, the ones aimed at the licensed runner. */
  releases: number;
  /** E5g's own instrument, VALUE arm only (§3.1 calibration). */
  traceCommits: number;
  fates: Fate[];
}

const emptyArm = (seed: number): ArmResult => ({
  seed, matches: 0, f1: 0, f2: 0, f3: 0, f4: 0, counter: 0,
  commits: 0, releases: 0, traceCommits: 0, fates: [],
});

/** A release being followed to the frozen horizon, on team stats deltas. */
interface Pending {
  readonly side: 0 | 1;
  readonly endTick: number;
  readonly crosses: number;
  readonly shots: number;
  readonly headers: number;
  ownedTicks: number;
  ticks: number;
}

const runLeagueArm = (seed: number, clusterIndex: number, valueAxis: boolean): ArmResult => {
  const league = new League({ seed });
  if (valueAxis) league.matchFlags = { ...VALUE_FLAGS, traceChoice: true };
  const arm = emptyArm(seed);

  for (let season = 0; season < SEASONS; season++) {
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      const open: ({ f2: boolean; f3: boolean } | null)[] = [null, null];
      const openIndex: (number | null)[] = [null, null];
      const openOverlaps = [0, 0];
      /** Licence-active holder per side at the CURRENT pre-step state. */
      const liveHolder: (({ holderGid: number; runnerGid: number }) | null)[] = [null, null];
      const pending: Pending[] = [];
      let lastPassKey = '';
      const closeSpan = (side: 0 | 1, team: Team) => {
        const span = open[side];
        if (span === null) return;
        arm.f1 += 1;
        if (span.f2) {
          arm.f2 += 1;
          if (span.f3) arm.f3 += 1;
          // E5f's accounting: the counter firing is independent of the release.
          if (team.stats.overlaps > openOverlaps[side]) arm.f4 += 1;
        }
        open[side] = null;
        openIndex[side] = null;
      };

      while (!match.finished) {
        for (const side of [0, 1] as const) {
          const team = match.teams[side];
          const index = team.overlapper;
          if (index !== openIndex[side]) {
            closeSpan(side, team);
            if (index !== null) {
              open[side] = { f2: false, f3: false };
              openIndex[side] = index;
              openOverlaps[side] = team.stats.overlaps;
            }
          }
          liveHolder[side] = null;
          const span = open[side];
          if (span === null || index === null) continue;
          const runner = team.players[index];
          const pass = match.pendingPass;
          if (pass && pass.targetGid === runner.gid) span.f3 = true;
          const holder = match.ball.owner;
          if (holder === null || holder.side !== side || holder.gid === runner.gid) continue;
          if (!licenceActive(team, holder, runner)) continue;
          span.f2 = true;
          liveHolder[side] = { holderGid: holder.gid, runnerGid: runner.gid };
        }

        const beforeKind = match.lastPassKind;
        match.step(DT);

        // §3: a pass-commit is a NEW pass leaving a licence-active holder.
        const fresh = match.pendingPass;
        const kind = match.lastPassKind;
        const key = fresh === null ? ''
          : `${fresh.passerGid}:${fresh.targetGid}:${fresh.t}`;
        const isNewPass = fresh !== null && kind !== null && kind !== beforeKind
          && key !== lastPassKey;
        if (isNewPass) {
          lastPassKey = key;
          for (const side of [0, 1] as const) {
            const live = liveHolder[side];
            if (live === null || live.holderGid !== fresh!.passerGid) continue;
            arm.commits += 1;
            if (fresh!.targetGid !== live.runnerGid) continue;
            arm.releases += 1;
            const team = match.teams[side];
            pending.push({
              side,
              endTick: match.simTick + FATE_HORIZON_TICKS,
              crosses: team.stats.crosses,
              shots: team.stats.shots,
              headers: team.stats.headersWon,
              ownedTicks: 0,
              ticks: 0,
            });
          }
        }
        // Follow every open release to the frozen horizon, on stats deltas only.
        for (let index = pending.length - 1; index >= 0; index--) {
          const row = pending[index];
          const team = match.teams[row.side];
          row.ticks += 1;
          const owner = match.ball.owner;
          if (owner !== null && owner.side === row.side) row.ownedTicks += 1;
          if (match.simTick < row.endTick && !match.finished) continue;
          const cross = team.stats.crosses > row.crosses;
          const shot = team.stats.shots > row.shots;
          const header = team.stats.headersWon > row.headers;
          arm.fates.push({
            cluster: clusterIndex,
            cross,
            shot,
            header,
            crossFoundNobody: cross && !header && !shot,
            ownedAtEnd: owner !== null && owner.side === row.side,
            ownedShare: row.ticks === 0 ? 0 : row.ownedTicks / row.ticks,
          });
          pending.splice(index, 1);
        }
      }
      for (const side of [0, 1] as const) closeSpan(side, match.teams[side]);
      // Any release still in flight at the whistle is banked with what it had.
      for (const row of pending) {
        const team = match.teams[row.side];
        const cross = team.stats.crosses > row.crosses;
        const shot = team.stats.shots > row.shots;
        const header = team.stats.headersWon > row.headers;
        arm.fates.push({
          cluster: clusterIndex, cross, shot, header,
          crossFoundNobody: cross && !header && !shot,
          ownedAtEnd: false,
          ownedShare: row.ticks === 0 ? 0 : row.ownedTicks / row.ticks,
        });
      }
      pending.length = 0;
      if (valueAxis) {
        // §3.1: E5g's own instrument, for the calibration. Trace entries whose
        // tick had a licence-active holder are not reconstructible here without
        // the per-tick map, so the plain count of traced choices by a
        // licence-active holder is what is reported — see §7 for the mapping.
        arm.traceCommits += match.passChoiceTrace.length;
        match.passChoiceTrace.length = 0;
      }
      league.applyResult(fixture, match.getResult());
      arm.matches += 1;
      for (const stat of match.getResult().stats) arm.counter += stat.overlaps;
    }
    league.finishSeason();
  }
  return arm;
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

const rateOf = (
  arms: readonly ArmResult[], hits: (arm: ArmResult) => number,
  n: (arm: ArmResult) => number, offset: number,
) => {
  const totalHits = arms.reduce((sum, arm) => sum + hits(arm), 0);
  const totalN = arms.reduce((sum, arm) => sum + n(arm), 0);
  return {
    hits: totalHits,
    n: totalN,
    rate: totalN === 0 ? Number.NaN : totalHits / totalN,
    clusterCI: clusterBootstrapCI(arms.map((arm) => ({ hits: hits(arm), n: n(arm) })), offset),
    perCluster: arms.map((arm) => ({
      seed: arm.seed, hits: hits(arm), n: n(arm),
      rate: n(arm) === 0 ? Number.NaN : hits(arm) / n(arm),
    })),
  };
};

const fateReport = (arms: readonly ArmResult[], offset: number) => {
  const fates = arms.flatMap((arm) => arm.fates);
  const per = (pick: (fate: Fate) => boolean, shift: number) => rateOf(
    arms, (arm) => arm.fates.filter(pick).length, (arm) => arm.fates.length, offset + shift,
  );
  const mean = (values: readonly number[]) => (values.length === 0 ? Number.NaN
    : values.reduce((sum, value) => sum + value, 0) / values.length);
  return {
    n: fates.length,
    cross: per((fate) => fate.cross, 0),
    shot: per((fate) => fate.shot, 1),
    header: per((fate) => fate.header, 2),
    crossFoundNobodyProxy: per((fate) => fate.crossFoundNobody, 3),
    /** Of the releases that DID produce a cross, how many found nobody. */
    foundNobodyGivenCross: (() => {
      const crossed = fates.filter((fate) => fate.cross);
      return {
        n: crossed.length,
        rate: crossed.length === 0 ? Number.NaN
          : crossed.filter((fate) => fate.crossFoundNobody).length / crossed.length,
      };
    })(),
    ownedAtEnd: per((fate) => fate.ownedAtEnd, 4),
    meanOwnedShare: mean(fates.map((fate) => fate.ownedShare)),
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const off = LEAGUE_SEEDS.map((seed, index) => runLeagueArm(seed, index, false));
  const value = LEAGUE_SEEDS.map((seed, index) => runLeagueArm(seed, index, true));

  const pinned = (
    arms: readonly ArmResult[],
    banked: { readonly [K in 'f1' | 'f2' | 'f3' | 'f4' | 'counter']: readonly number[] },
  ) => arms.every(
    (arm, index) => arm.matches === P0_BANKED.matches
      && arm.f1 === banked.f1[index] && arm.f2 === banked.f2[index]
      && arm.f3 === banked.f3[index] && arm.f4 === banked.f4[index]
      && arm.counter === banked.counter[index],
  );
  const p0 = pinned(off, P0_BANKED.off) && pinned(value, P0_BANKED.value);

  const total = (arms: readonly ArmResult[], pick: (arm: ArmResult) => number) =>
    arms.reduce((sum, arm) => sum + pick(arm), 0);
  const p1 = total(off, (arm) => arm.releases) >= P1_RELEASE_FLOOR
    && total(value, (arm) => arm.releases) >= P1_RELEASE_FLOOR
    && total(off, (arm) => arm.commits) >= P1_COMMIT_FLOOR
    && total(value, (arm) => arm.commits) >= P1_COMMIT_FLOOR;

  // (i) THE CLOCK: commits per matured run, and releases per commit, per arm.
  const clock = {
    commitsPerWindow: {
      off: rateOf(off, (arm) => arm.commits, (arm) => arm.f2, 0),
      value: rateOf(value, (arm) => arm.commits, (arm) => arm.f2, 1),
    },
    releasesPerCommit: {
      off: rateOf(off, (arm) => arm.releases, (arm) => arm.commits, 2),
      value: rateOf(value, (arm) => arm.releases, (arm) => arm.commits, 3),
    },
    releasesPerWindow: {
      off: rateOf(off, (arm) => arm.releases, (arm) => arm.f2, 4),
      value: rateOf(value, (arm) => arm.releases, (arm) => arm.f2, 5),
    },
  };
  const ratio = (pair: { off: { rate: number }; value: { rate: number } }) =>
    pair.value.rate / pair.off.rate;

  return {
    experiment: 'EDS-E5h',
    authority: 'EDS-E5H-CLOCK-TWIN',
    parameters: {
      leagueSeeds: LEAGUE_SEEDS, seasons: SEASONS, clusterUnit: 'league seed',
      fateHorizonTicks: FATE_HORIZON_TICKS,
      releaseFloor: P1_RELEASE_FLOOR, commitFloor: P1_COMMIT_FLOOR,
      floorsDerivedFrom: 'E5f banked F3: 935 OFF / 550 VALUE',
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
    },
    funnel: {
      off: off.map((arm) => ({ seed: arm.seed, f1: arm.f1, f2: arm.f2, f3: arm.f3, f4: arm.f4, counter: arm.counter, commits: arm.commits, releases: arm.releases })),
      value: value.map((arm) => ({ seed: arm.seed, f1: arm.f1, f2: arm.f2, f3: arm.f3, f4: arm.f4, counter: arm.counter, commits: arm.commits, releases: arm.releases })),
    },
    clock,
    clockRatios: {
      commitsPerWindow: ratio(clock.commitsPerWindow),
      releasesPerCommit: ratio(clock.releasesPerCommit),
      releasesPerWindow: ratio(clock.releasesPerWindow),
    },
    // §3.1: reported, never gated.
    calibration: {
      twinCommitsValueArm: total(value, (arm) => arm.commits),
      e5gBankedCommits: E5G_BANKED_COMMITS,
      tracedChoicesValueArm: total(value, (arm) => arm.traceCommits),
    },
    fate: { off: fateReport(off, 10), value: fateReport(value, 30) },
    gates: { p0, p1 },
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, p2Deterministic: deterministic };
const output = {
  ...first,
  gates,
  sha256,
  // A MEASUREMENT step (contract §4): INVALID only on P0 or P2.
  verdict: gates.p0 && gates.p2Deterministic ? 'MEASURED' : 'INVALID',
};
console.log(JSON.stringify(output, null, 2));
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
console.error(
  `EDS-E5h ${output.verdict} · P0 ${output.gates.p0} P1 ${output.gates.p1}`
  + ` · commits/window OFF ${output.clock.commitsPerWindow.off.rate.toFixed(4)}`
  + ` (${output.clock.commitsPerWindow.off.hits}/${output.clock.commitsPerWindow.off.n})`
  + ` VALUE ${output.clock.commitsPerWindow.value.rate.toFixed(4)}`
  + ` (${output.clock.commitsPerWindow.value.hits}/${output.clock.commitsPerWindow.value.n})`
  + ` ratio ${output.clockRatios.commitsPerWindow.toFixed(3)}x`
  + ` · releases/commit OFF ${pct(output.clock.releasesPerCommit.off.rate)}`
  + ` VALUE ${pct(output.clock.releasesPerCommit.value.rate)}`
  + ` ratio ${output.clockRatios.releasesPerCommit.toFixed(3)}x`
  + ` · calib twin ${output.calibration.twinCommitsValueArm} vs E5g 854`
  + ` · FATE n OFF ${output.fate.off.n} VALUE ${output.fate.value.n}`
  + ` · shot OFF ${pct(output.fate.off.shot.rate)} VALUE ${pct(output.fate.value.shot.rate)}`
  + ` · cross OFF ${pct(output.fate.off.cross.rate)} VALUE ${pct(output.fate.value.cross.rate)}`
  + ` · foundNobody|cross OFF ${pct(output.fate.off.foundNobodyGivenCross.rate)}`
  + ` VALUE ${pct(output.fate.value.foundNobodyGivenCross.rate)}`
  + ` · retained OFF ${pct(output.fate.off.ownedAtEnd.rate)} VALUE ${pct(output.fate.value.ownedAtEnd.rate)}`
  + ` · SHA ${sha256}`,
);
