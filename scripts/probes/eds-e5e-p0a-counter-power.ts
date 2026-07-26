// EDS E5e PHASE 0 (a) — H2'S OWN POWER.
// Authority: docs/world-model/EDS-E5E-STATE-CONDITIONAL.md §2
//
// The live audit read overlap 0.468x off ONE league seed, where the counter
// fires 0.093 times per match. Ruling #21.3 (a) asks the prior question: is
// that a magnitude, or is it a count of rare events?
//
// Two things change from the audit, and only two. The counter gets SIX league
// seeds instead of one, so the cluster unit — the league seed — can be named
// and resampled instead of assumed away; and the reading is a CONFIDENCE
// INTERVAL under ruling #20's verdict semantics, so "0.468 < 0.70" stops being
// a verdict and becomes a point estimate with a stated uncertainty.
//
// Cluster 1 IS the audit's own seed. It must reproduce the banked per-match
// counters to the last float (A0) — otherwise this probe and the audit are
// measuring different worlds and nothing below compares.
import { createHash } from 'node:crypto';
import { League } from '../../src/sim/League';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2.1, §2.3) --------------------------------
/** Cluster 1 is the E5b audit's own seed; the other five are fresh. */
const LEAGUE_SEEDS = [20260702, 20260801, 20260802, 20260803, 20260804, 20260805] as const;
const SEASONS = Number(process.argv[2] ?? 24); // H_SEASONS, verbatim
/** A0: the audit's banked cluster-1 numbers, at full float precision. */
const A0_BANKED = {
  matches: 1704,
  overlapsOff: 0.09272300469483569,
  overlapsValue: 0.04342723004694836,
  thirdManOff: 6.85093896713615,
  thirdManValue: 4.399647887323944,
} as const;
const A1_EVENT_FLOOR = 300; // ex-ante Poisson budget
const H_OVERLAP_RATIO = 0.70; // H2's floor, verbatim
const H_THIRD_MAN_RATIO = 0.85; // H1's floor, verbatim
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50000; // frozen (contract §2.3 A3)

interface ArmCounts {
  readonly matches: number;
  readonly overlaps: number;
  readonly thirdMan: number;
}

/**
 * One league arm. The E5b audit's `runLeagueArm` reduced to what part (a)
 * needs: two counters and a match count. `traceChoice` stays OFF — the trace
 * costs three extra option valuations per pass and no gate here reads it.
 */
const runLeagueArm = (seed: number, valueAxis: boolean): ArmCounts => {
  const league = new League({ seed });
  if (valueAxis) {
    league.matchFlags = {
      edsPerceivedDefence: true,
      edsPerceivedChoice: true,
      edsValueAxis: true,
      traceChoice: false,
    };
  }
  let matches = 0;
  let overlaps = 0;
  let thirdMan = 0;
  for (let season = 0; season < SEASONS; season++) {
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      const result = match.runToCompletion();
      league.applyResult(fixture, result);
      matches += 1;
      for (const stat of result.stats) {
        overlaps += stat.overlaps;
        thirdMan += stat.thirdMan;
      }
    }
    league.finishSeason();
  }
  return { matches, overlaps, thirdMan };
};

// --- the two intervals ------------------------------------------------------
/**
 * The within-cluster interval. Exposure is equal by construction (the two arms
 * play the same fixture count), so the rate ratio is k_on/k_off and the split
 * k_on | (k_on + k_off) is binomial. Wilson on that share, mapped back to a
 * ratio — no normal approximation on a count.
 */
const poissonRatioCI = (kOn: number, kOff: number) => {
  const total = kOn + kOff;
  const ratio = kOff === 0 ? Number.NaN : kOn / kOff;
  if (total === 0) return { ratio, lower: Number.NaN, upper: Number.NaN };
  const z = 1.959963984540054;
  const share = kOn / total;
  const denominator = 1 + (z * z) / total;
  const centre = (share + (z * z) / (2 * total)) / denominator;
  const spread = (z * Math.sqrt((share * (1 - share)) / total
    + (z * z) / (4 * total * total))) / denominator;
  const low = Math.max(0, centre - spread);
  const high = Math.min(1, centre + spread);
  return { ratio, lower: low / (1 - low), upper: high === 1 ? Infinity : high / (1 - high) };
};

/**
 * The between-cluster interval: resample LEAGUE SEEDS with replacement, pool
 * the counts inside each resample, take the percentile interval. This is the
 * one that answers "would another six leagues say the same thing".
 */
const clusterBootstrapCI = (
  clusters: readonly { readonly on: number; readonly off: number }[],
) => {
  const rng = new Rng(BOOTSTRAP_SEED);
  const ratios: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let on = 0;
    let off = 0;
    for (let index = 0; index < clusters.length; index++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      on += pick.on;
      off += pick.off;
    }
    ratios.push(off === 0 ? Number.NaN : on / off);
  }
  ratios.sort((left, right) => left - right);
  const at = (q: number) => ratios[Math.min(ratios.length - 1,
    Math.max(0, Math.floor(q * (ratios.length - 1))))];
  return { lower: at(0.025), upper: at(0.975), median: at(0.5) };
};

/** Ruling #20's verdict semantics, applied to a non-inferiority floor. */
type Verdict = 'NON-INFERIOR' | 'REFUTED' | 'INCONCLUSIVE';
const verdictOf = (lower: number, upper: number, floor: number): Verdict => {
  if (lower >= floor) return 'NON-INFERIOR';
  if (upper < floor) return 'REFUTED';
  return 'INCONCLUSIVE';
};

const counterReport = (
  clusters: readonly { readonly seed: number; readonly on: number; readonly off: number }[],
  floor: number,
) => {
  const on = clusters.reduce((sum, row) => sum + row.on, 0);
  const off = clusters.reduce((sum, row) => sum + row.off, 0);
  const pooled = poissonRatioCI(on, off);
  const bootstrap = clusterBootstrapCI(clusters);
  const pooledVerdict = verdictOf(pooled.lower, pooled.upper, floor);
  const bootstrapVerdict = verdictOf(bootstrap.lower, bootstrap.upper, floor);
  // A3: the pooled reading stands only if the clusters agree with it.
  const agree = pooledVerdict === bootstrapVerdict;
  return {
    floor,
    events: { on, off },
    ratio: pooled.ratio,
    pooledCI: { lower: pooled.lower, upper: pooled.upper },
    pooledVerdict,
    bootstrapCI: bootstrap,
    bootstrapVerdict,
    clustersAgree: agree,
    verdict: agree ? pooledVerdict : ('INCONCLUSIVE' as Verdict),
    perCluster: clusters.map((row) => ({
      seed: row.seed, on: row.on, off: row.off,
      ratio: row.off === 0 ? Number.NaN : row.on / row.off,
    })),
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const clusters = LEAGUE_SEEDS.map((seed) => ({
    seed,
    off: runLeagueArm(seed, false),
    value: runLeagueArm(seed, true),
  }));

  const first = clusters[0];
  const a0 = {
    matchesOff: first.off.matches === A0_BANKED.matches,
    matchesValue: first.value.matches === A0_BANKED.matches,
    overlapsOff: first.off.overlaps / first.off.matches === A0_BANKED.overlapsOff,
    overlapsValue: first.value.overlaps / first.value.matches === A0_BANKED.overlapsValue,
    thirdManOff: first.off.thirdMan / first.off.matches === A0_BANKED.thirdManOff,
    thirdManValue: first.value.thirdMan / first.value.matches === A0_BANKED.thirdManValue,
  };

  const overlapClusters = clusters.map((row) => ({
    seed: row.seed, on: row.value.overlaps, off: row.off.overlaps,
  }));
  const thirdManClusters = clusters.map((row) => ({
    seed: row.seed, on: row.value.thirdMan, off: row.off.thirdMan,
  }));

  const h2 = counterReport(overlapClusters, H_OVERLAP_RATIO);
  const h1 = counterReport(thirdManClusters, H_THIRD_MAN_RATIO);
  const a1 = h2.events.off >= A1_EVENT_FLOOR;

  return {
    experiment: 'EDS-E5e-P0a',
    authority: 'EDS-E5E-STATE-CONDITIONAL',
    parameters: {
      leagueSeeds: LEAGUE_SEEDS,
      seasons: SEASONS,
      clusterUnit: 'league seed',
      bootstrapResamples: BOOTSTRAP_RESAMPLES,
      bootstrapSeed: BOOTSTRAP_SEED,
      eventFloor: A1_EVENT_FLOOR,
      banked: A0_BANKED,
    },
    effectiveN: {
      clusters: clusters.length,
      matchesPerClusterPerArm: first.off.matches,
      matchesTotal: clusters.reduce((sum, row) => sum + row.off.matches + row.value.matches, 0),
    },
    a0,
    a1,
    h2Overlap: h2,
    h1ThirdMan: h1,
    perCluster: clusters.map((row) => ({
      seed: row.seed,
      off: { ...row.off, overlapsPerMatch: row.off.overlaps / row.off.matches,
        thirdManPerMatch: row.off.thirdMan / row.off.matches },
      value: { ...row.value, overlapsPerMatch: row.value.overlaps / row.value.matches,
        thirdManPerMatch: row.value.thirdMan / row.value.matches },
    })),
    // Part (a) is a MEASUREMENT step (contract §2.3): INVALID only on A0/A1.
    valid: Object.values(a0).every(Boolean) && a1,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = {
  ...first,
  deterministic,
  sha256,
  verdict: deterministic && first.valid ? 'MEASURED' : 'INVALID',
};
console.log(JSON.stringify(output, null, 2));
console.error(
  `EDS-E5e-P0a ${output.verdict}`
  + ` · A0 ${Object.values(output.a0).filter(Boolean).length}/6 · A1 ${output.a1}`
  + ` (${output.h2Overlap.events.off} off-arm overlap events)`
  + ` · H2 ${output.h2Overlap.ratio.toFixed(3)}x`
  + ` CI [${output.h2Overlap.pooledCI.lower.toFixed(3)}, ${output.h2Overlap.pooledCI.upper.toFixed(3)}]`
  + ` boot [${output.h2Overlap.bootstrapCI.lower.toFixed(3)}, ${output.h2Overlap.bootstrapCI.upper.toFixed(3)}]`
  + ` → ${output.h2Overlap.verdict}`
  + ` · H1 ${output.h1ThirdMan.ratio.toFixed(3)}x`
  + ` CI [${output.h1ThirdMan.pooledCI.lower.toFixed(3)}, ${output.h1ThirdMan.pooledCI.upper.toFixed(3)}]`
  + ` boot [${output.h1ThirdMan.bootstrapCI.lower.toFixed(3)}, ${output.h1ThirdMan.bootstrapCI.upper.toFixed(3)}]`
  + ` → ${output.h1ThirdMan.verdict}`
  + ` · SHA ${sha256}`,
);
