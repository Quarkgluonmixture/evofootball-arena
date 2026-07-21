// O3a MULTI-PLAYER OFFER-COMMITMENT CENSUS (probe-only).
//
// Synthetic independent feasibility commitments exercise O3 in real attacking
// states. No selector, duplicate threshold or live state is written.
//   npx tsx scripts/probes/offball-offer-commitment-census.ts [matches] [seedOffset] [portfolio]
import {
  createOffBallOfferCommitment, evaluateOffBallOfferCoordination,
  evaluateOffBallOfferPortfolio, type OffBallOfferPortfolioRange,
} from '../../src/ai/offBallCoordination';
import { evaluateOffBallAffordances, type OffBallAffordance } from '../../src/ai/offBallAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);
const PORTFOLIO = process.argv[4] === 'portfolio';
const SAMPLE_TICKS = Math.round(1 / DT);
const COMMITMENT_TICKS = 90;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name,
    name,
    short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const profilesOf = (match: Match): Map<number, KnownReachProfile> => {
  const result = new Map<number, KnownReachProfile>();
  for (const player of match.allPlayers) {
    if (player.sentOff) continue;
    result.set(player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    });
  }
  return result;
};

const independentFeasibleChoice = (
  values: readonly OffBallAffordance[],
): OffBallAffordance | null => values
  .filter((value) => (
    value.candidate.id !== 'hold'
    && value.offsideMargin <= 0
    && value.opponentArrivalMargin > 0
  ))
  .sort((a, b) => a.selfArrival - b.selfArrival || a.candidate.id.localeCompare(b.candidate.id))[0]
  ?? null;

const targetDistances: number[] = [];
const bearingSeparations: number[] = [];
const arrivalSeparations: number[] = [];
const corridorSeparations: number[] = [];
let sampledStates = 0;
let statesWithTwo = 0;
let totalCommitments = 0;
let missingO0 = 0;
let commitmentFailures = 0;
let coordinationFailures = 0;
let activeCountViolations = 0;
let nonFiniteFacts = 0;

const portfolioMemberCounts: number[] = [];
const portfolioPairCounts: number[] = [];
const portfolioTargetMins: number[] = [];
const portfolioTargetMaxes: number[] = [];
const portfolioTargetRanges: number[] = [];
const portfolioBearingMins: number[] = [];
const portfolioBearingMaxes: number[] = [];
const portfolioBearingRanges: number[] = [];
const portfolioArrivalMins: number[] = [];
const portfolioArrivalMaxes: number[] = [];
const portfolioArrivalRanges: number[] = [];
const portfolioCorridorMins: number[] = [];
const portfolioCorridorMaxes: number[] = [];
const portfolioCorridorRanges: number[] = [];
let portfolioEligible = 0;
let portfolioFailures = 0;
let portfolioConservationFailures = 0;
let portfolioIdentityFailures = 0;
let portfolioNonFinite = 0;

const pairKey = (left: number, right: number): string => `${left}:${right}`;

const recordPortfolioRange = (
  range: OffBallOfferPortfolioRange | null,
  pairValues: ReadonlyMap<string, number>,
  mins: number[],
  maxes: number[],
  ranges: number[],
): boolean => {
  if (!range) return false;
  const values = [range.min, range.max, range.max - range.min];
  if (values.some((value) => !Number.isFinite(value)) || range.max < range.min) return false;
  const minKey = pairKey(range.minPair[0], range.minPair[1]);
  const maxKey = pairKey(range.maxPair[0], range.maxPair[1]);
  if (pairValues.get(minKey) !== range.min || pairValues.get(maxKey) !== range.max) return false;
  mins.push(range.min);
  maxes.push(range.max);
  ranges.push(range.max - range.min);
  return true;
};

for (let seed = OFF; seed < OFF + MATCHES; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  while (!match.finished) {
    match.step(DT);
    if (match.simTick % SAMPLE_TICKS !== 0 || match.phase !== 'playing') continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff) continue;
    sampledStates++;
    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const profiles = profilesOf(match);
    const choices: OffBallAffordance[] = [];

    for (const player of attackingTeam.players) {
      if (player.sentOff || player.role === 'GK' || player === carrier) continue;
      const values = evaluateOffBallAffordances({
        snapshot: oraclePerceptionSnapshot(truth, player.gid),
        playerGid: player.gid,
        carrierGid: carrier.gid,
        attackDir: attackingTeam.attackDir,
        reachProfiles: profiles,
      });
      if (!values) {
        missingO0++;
        continue;
      }
      const choice = independentFeasibleChoice(values);
      if (choice) choices.push(choice);
    }

    const commitments = choices.flatMap((choice) => {
      const commitment = createOffBallOfferCommitment(
        choice, match.simTick, match.simTick + COMMITMENT_TICKS,
      );
      if (!commitment) {
        commitmentFailures++;
        return [];
      }
      return [commitment];
    });
    totalCommitments += commitments.length;
    if (commitments.length >= 2) statesWithTwo++;

    if (PORTFOLIO && commitments.length >= 2) {
      portfolioEligible++;
      const portfolio = evaluateOffBallOfferPortfolio({
        carrierGid: carrier.gid,
        carrierPoint: carrier.pos,
        commitments,
        currentTick: match.simTick,
      });
      if (!portfolio) {
        portfolioFailures++;
      } else {
        const expectedGids = commitments.map((commitment) => commitment.playerGid)
          .sort((a, b) => a - b);
        const actualGids = portfolio.commitments.map((commitment) => commitment.playerGid);
        const expectedPairCount = commitments.length * (commitments.length - 1) / 2;
        portfolioMemberCounts.push(portfolio.commitments.length);
        portfolioPairCounts.push(portfolio.pairs.length);
        if (
          portfolio.commitments.length !== commitments.length
          || portfolio.pairs.length !== expectedPairCount
        ) portfolioConservationFailures++;
        if (
          portfolio.carrierGid !== carrier.gid
          || actualGids.length !== expectedGids.length
          || actualGids.some((gid, index) => gid !== expectedGids[index])
          || portfolio.commitments.some((commitment) => commitment.carrierGid !== carrier.gid)
        ) portfolioIdentityFailures++;

        const expectedPairs = new Set<string>();
        for (let left = 0; left < expectedGids.length; left++) {
          for (let right = left + 1; right < expectedGids.length; right++) {
            expectedPairs.add(pairKey(expectedGids[left], expectedGids[right]));
          }
        }
        const observedPairs = new Set<string>();
        const targetPairValues = new Map<string, number>();
        const bearingPairValues = new Map<string, number>();
        const arrivalPairValues = new Map<string, number>();
        const corridorPairValues = new Map<string, number>();
        let invalidPair = false;
        for (const pair of portfolio.pairs) {
          const key = pairKey(pair.leftPlayerGid, pair.rightPlayerGid);
          const numeric = [
            pair.targetDistance,
            pair.bearingSeparation,
            pair.arrivalTimeSeparation,
            pair.corridorSeparation,
          ];
          if (
            pair.leftPlayerGid >= pair.rightPlayerGid
            || !expectedPairs.has(key)
            || observedPairs.has(key)
          ) invalidPair = true;
          if (numeric.some((value) => value === null || !Number.isFinite(value))) {
            invalidPair = true;
            portfolioNonFinite++;
            continue;
          }
          observedPairs.add(key);
          targetPairValues.set(key, pair.targetDistance);
          bearingPairValues.set(key, pair.bearingSeparation!);
          arrivalPairValues.set(key, pair.arrivalTimeSeparation);
          corridorPairValues.set(key, pair.corridorSeparation);
        }
        if (
          invalidPair
          || observedPairs.size !== expectedPairs.size
          || [...expectedPairs].some((key) => !observedPairs.has(key))
        ) portfolioIdentityFailures++;

        const rangesValid = [
          recordPortfolioRange(
            portfolio.targetDistance, targetPairValues,
            portfolioTargetMins, portfolioTargetMaxes, portfolioTargetRanges,
          ),
          recordPortfolioRange(
            portfolio.bearingSeparation, bearingPairValues,
            portfolioBearingMins, portfolioBearingMaxes, portfolioBearingRanges,
          ),
          recordPortfolioRange(
            portfolio.arrivalTimeSeparation, arrivalPairValues,
            portfolioArrivalMins, portfolioArrivalMaxes, portfolioArrivalRanges,
          ),
          recordPortfolioRange(
            portfolio.corridorSeparation, corridorPairValues,
            portfolioCorridorMins, portfolioCorridorMaxes, portfolioCorridorRanges,
          ),
        ].every(Boolean);
        if (!rangesValid) portfolioNonFinite++;
      }
    }

    for (const choice of choices) {
      const facts = evaluateOffBallOfferCoordination({
        candidate: choice,
        carrierPoint: carrier.pos,
        commitments,
        currentTick: match.simTick,
      });
      if (!facts) {
        coordinationFailures++;
        continue;
      }
      if (facts.activeCommitmentCount !== Math.max(0, commitments.length - 1)) {
        activeCountViolations++;
      }
      const numeric = [
        facts.nearestTargetDistance,
        facts.nearestBearingSeparation,
        facts.nearestArrivalTimeSeparation,
        facts.nearestCorridorSeparation,
      ];
      if (facts.activeCommitmentCount === 0) {
        if (numeric.some((value) => value !== null)) activeCountViolations++;
        continue;
      }
      if (numeric.some((value) => value === null || !Number.isFinite(value))) {
        nonFiniteFacts++;
        continue;
      }
      targetDistances.push(facts.nearestTargetDistance!);
      bearingSeparations.push(facts.nearestBearingSeparation!);
      arrivalSeparations.push(facts.nearestArrivalTimeSeparation!);
      corridorSeparations.push(facts.nearestCorridorSeparation!);
    }
  }
}

const quantile = (values: readonly number[], q: number): number => {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)));
  return sorted[index];
};
const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / values.length;
const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const summary = (name: string, values: readonly number[], unit: string): void => {
  console.log(
    `  ${name.padEnd(17)} n=${values.length} · mean ${mean(values).toFixed(3)}${unit}`
    + ` · q10/q50/q90 ${quantile(values, 0.1).toFixed(3)}/${quantile(values, 0.5).toFixed(3)}/${quantile(values, 0.9).toFixed(3)}${unit}`,
  );
};

console.log(`O3a MULTI-PLAYER OFFER-COMMITMENT CENSUS · matches ${MATCHES} · seed start ${OFF}`);
console.log(
  `sampled states ${sampledStates} · states with >=2 commitments ${statesWithTwo}`
  + ` (${pct(statesWithTwo, sampledStates)}) · commitments ${totalCommitments}`,
);
console.log(
  `missing O0 / commitment / coordination / active-count / non-finite failures `
  + `${missingO0}/${commitmentFailures}/${coordinationFailures}/${activeCountViolations}/${nonFiniteFacts}`,
);
summary('target distance', targetDistances, 'm');
summary('bearing separation', bearingSeparations.map((value) => value * 180 / Math.PI), 'deg');
summary('arrival separation', arrivalSeparations, 's');
summary('corridor separation', corridorSeparations, 'm');

if (PORTFOLIO) {
  console.log('O5a TEAM OFFER-PORTFOLIO CENSUS');
  console.log(
    `portfolio eligible ${portfolioEligible} (${pct(portfolioEligible, sampledStates)})`
    + ` · evaluation / conservation / identity / non-finite failures `
    + `${portfolioFailures}/${portfolioConservationFailures}/${portfolioIdentityFailures}/${portfolioNonFinite}`,
  );
  summary('member count', portfolioMemberCounts, '');
  summary('pair count', portfolioPairCounts, '');
  summary('target min', portfolioTargetMins, 'm');
  summary('target max', portfolioTargetMaxes, 'm');
  summary('target range', portfolioTargetRanges, 'm');
  summary('bearing min', portfolioBearingMins.map((value) => value * 180 / Math.PI), 'deg');
  summary('bearing max', portfolioBearingMaxes.map((value) => value * 180 / Math.PI), 'deg');
  summary('bearing range', portfolioBearingRanges.map((value) => value * 180 / Math.PI), 'deg');
  summary('arrival min', portfolioArrivalMins, 's');
  summary('arrival max', portfolioArrivalMaxes, 's');
  summary('arrival range', portfolioArrivalRanges, 's');
  summary('corridor min', portfolioCorridorMins, 'm');
  summary('corridor max', portfolioCorridorMaxes, 'm');
  summary('corridor range', portfolioCorridorRanges, 'm');
  console.log(
    `positive internal range target/bearing/arrival/corridor `
    + `${pct(portfolioTargetRanges.filter((value) => value > 0).length, portfolioTargetRanges.length)}/`
    + `${pct(portfolioBearingRanges.filter((value) => value > 0).length, portfolioBearingRanges.length)}/`
    + `${pct(portfolioArrivalRanges.filter((value) => value > 0).length, portfolioArrivalRanges.length)}/`
    + `${pct(portfolioCorridorRanges.filter((value) => value > 0).length, portfolioCorridorRanges.length)}`,
  );
}

const distributions = [
  targetDistances,
  bearingSeparations,
  arrivalSeparations,
  corridorSeparations,
];
const spreadGate = distributions.every((values) => (
  values.length > 0 && quantile(values, 0.9) > quantile(values, 0.1)
));
if (
  missingO0 > 0 || commitmentFailures > 0 || coordinationFailures > 0 ||
  activeCountViolations > 0 || nonFiniteFacts > 0 ||
  statesWithTwo < sampledStates * 0.8 || !spreadGate
) process.exitCode = 1;

if (PORTFOLIO) {
  const portfolioDistributions = [
    [portfolioTargetMins, portfolioTargetMaxes, portfolioTargetRanges],
    [portfolioBearingMins, portfolioBearingMaxes, portfolioBearingRanges],
    [portfolioArrivalMins, portfolioArrivalMaxes, portfolioArrivalRanges],
    [portfolioCorridorMins, portfolioCorridorMaxes, portfolioCorridorRanges],
  ];
  const portfolioSpreadGate = portfolioDistributions.every(([mins, maxes, ranges]) => (
    mins.length > 0
    && maxes.length > 0
    && quantile(mins, 0.9) > quantile(mins, 0.1)
    && quantile(maxes, 0.9) > quantile(maxes, 0.1)
    && ranges.filter((value) => value > 0).length >= ranges.length * 0.5
  ));
  if (
    MATCHES !== 120
    || portfolioEligible < sampledStates * 0.8
    || portfolioFailures > 0
    || portfolioConservationFailures > 0
    || portfolioIdentityFailures > 0
    || portfolioNonFinite > 0
    || !portfolioSpreadGate
  ) process.exitCode = 1;
}
