// O3a MULTI-PLAYER OFFER-COMMITMENT CENSUS (probe-only).
//
// Synthetic independent feasibility commitments exercise O3 in real attacking
// states. No selector, duplicate threshold or live state is written.
//   npx tsx scripts/probes/offball-offer-commitment-census.ts [matches] [seedOffset]
import {
  createOffBallOfferCommitment, evaluateOffBallOfferCoordination,
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
