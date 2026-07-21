// K0a CARRY-AFFORDANCE SUPPORT AND TRADEOFF CENSUS (observational only).
//
// Pre-registered authority:
//   docs/world-model/CARRY-AFFORDANCE-CENSUS.md
//
// Usage:
//   npx tsx scripts/probes/carry-affordance-census.ts [matches] [seedOffset]
import { createHash } from 'node:crypto';
import {
  CARRY_DIRECTION_COUNT,
  CARRY_SAMPLE_HORIZONS,
  evaluateCarryAffordances,
  type CarryAffordance,
} from '../../src/ai/carryAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED_OFFSET = Number(process.argv[3] ?? 43000);
const MATCH_DURATION = 240;
const SAMPLE_TICKS = Math.round(1 / DT);
const SPATIAL_DELTA = 0.25;
const MIN_ELIGIBLE_STATES = 1000;
const MIN_ID_SUPPORT = 1000;

const EXPECTED_IDS = CARRY_SAMPLE_HORIZONS.flatMap((_, horizonIndex) =>
  Array.from({ length: CARRY_DIRECTION_COUNT }, (_, directionIndex) =>
    `${horizonIndex}:${directionIndex}`));

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

const finiteProfile = (profile: KnownReachProfile | undefined): boolean =>
  profile !== undefined
  && Number.isFinite(profile.topSpeed)
  && profile.topSpeed > 0
  && Number.isFinite(profile.accel)
  && profile.accel > 0;

const quantile = (values: readonly number[], p: number): number => {
  if (values.length === 0) return NaN;
  const sorted = [...values].sort((left, right) => left - right);
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const range = (values: readonly number[]): number =>
  Math.max(...values) - Math.min(...values);

const hasOrderedTradeoff = (
  values: readonly CarryAffordance[],
  leftFact: (value: CarryAffordance) => number,
  rightFact: (value: CarryAffordance) => number,
  leftDelta: number,
  rightDelta: number,
): boolean => {
  for (const horizon of CARRY_SAMPLE_HORIZONS) {
    const sameHorizon = values.filter((value) => value.candidate.sampleHorizon === horizon);
    for (let left = 0; left < sameHorizon.length; left++) {
      for (let right = 0; right < sameHorizon.length; right++) {
        if (left === right) continue;
        if (
          leftFact(sameHorizon[left]) >= leftFact(sameHorizon[right]) + leftDelta
          && rightFact(sameHorizon[right]) >= rightFact(sameHorizon[left]) + rightDelta
        ) return true;
      }
    }
  }
  return false;
};

interface RangeLedger {
  selfArrival: number[];
  opponentArrivalMargin: number[];
  nearestOpponentDistance: number[];
  travelCorridorClearance: number[];
  nearestTeammateDistance: number[];
  goalwardProgression: number[];
  goalCorridorClearance: number[];
  fieldMargin: number[];
}

const ranges: RangeLedger = {
  selfArrival: [],
  opponentArrivalMargin: [],
  nearestOpponentDistance: [],
  travelCorridorClearance: [],
  nearestTeammateDistance: [],
  goalwardProgression: [],
  goalCorridorClearance: [],
  fieldMargin: [],
};
const supportCounts = new Map(EXPECTED_IDS.map((id) => [id, 0]));
const supportMatches = new Map(EXPECTED_IDS.map((id) => [id, new Set<number>()]));
const candidateCounts: number[] = [];
const directionCountsByHorizon = CARRY_SAMPLE_HORIZONS.map(() => [] as number[]);
const observedOpponentCounts: number[] = [];
const observedTeammateCounts: number[] = [];
const selfObservationAges: number[] = [];
const ballObservationAges: number[] = [];
const stateIds = new Set<string>();

let eligibleStates = 0;
let representedMatches = 0;
let duplicateStateIdentities = 0;
let nullEvaluations = 0;
let nonFiniteFacts = 0;
let duplicateCandidateIds = 0;
let holdCandidateFailures = 0;
let insetViolations = 0;
let controllerOwnerMismatches = 0;
let inputMutations = 0;
let rngDraws = 0;
let progressAccessTradeoffs = 0;
let endpointCorridorTradeoffs = 0;
let progressFieldTradeoffs = 0;

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = SEED_OFFSET + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  let represented = false;
  while (!match.finished) {
    match.step(DT);
    if (match.simTick % SAMPLE_TICKS !== 0 || match.phase !== 'playing') continue;
    const controller = match.ball.owner;
    if (!controller || controller.sentOff || controller.role === 'GK') continue;
    const truth = capturePerceptionTruth(match);
    const snapshot = oraclePerceptionSnapshot(truth, controller.gid);
    const profiles = profilesOf(match);
    const self = snapshot.players.find((player) => player.gid === controller.gid);
    const opponents = self === undefined
      ? []
      : snapshot.players.filter((player) => player.side !== self.side);
    const teammates = self === undefined
      ? []
      : snapshot.players.filter((player) => player.side === self.side && player.gid !== self.gid);
    if (
      self === undefined
      || snapshot.ball?.ownerGid !== controller.gid
      || opponents.length === 0
      || teammates.length === 0
      || snapshot.players.some((player) => !finiteProfile(profiles.get(player.gid)))
    ) continue;

    const stateId = `${seed}:${match.simTick}:${controller.gid}`;
    if (stateIds.has(stateId)) duplicateStateIdentities++;
    stateIds.add(stateId);
    eligibleStates++;
    represented = true;

    const before = JSON.stringify({ snapshot, profiles: [...profiles.entries()] });
    const rngBefore = (match.rng as unknown as { s: number }).s;
    const values = evaluateCarryAffordances({
      snapshot,
      controllerGid: controller.gid,
      attackDir: match.teams[controller.side].attackDir,
      reachProfiles: profiles,
    });
    const rngAfter = (match.rng as unknown as { s: number }).s;
    if (rngAfter !== rngBefore) rngDraws++;
    if (JSON.stringify({ snapshot, profiles: [...profiles.entries()] }) !== before) inputMutations++;
    if (!values) {
      nullEvaluations++;
      continue;
    }

    candidateCounts.push(values.length);
    const candidateIds = values.map((value) => value.candidate.id);
    if (new Set(candidateIds).size !== candidateIds.length) duplicateCandidateIds++;
    if (candidateIds.filter((id) => id === 'hold').length !== 1) holdCandidateFailures++;

    const directional = values.filter((value) => value.candidate.id !== 'hold');
    for (const value of values) {
      const numeric = [
        value.candidate.point.x,
        value.candidate.point.y,
        value.candidate.sampleHorizon,
        value.candidate.forwardDelta,
        value.candidate.lateralDelta,
        value.selfArrival,
        value.selfTurnTime,
        value.bodyAlignment,
        value.opponentArrival,
        value.opponentArrivalMargin,
        value.nearestOpponentDistanceAtArrival,
        value.travelCorridorClearance,
        value.nearestTeammateDistanceAtArrival,
        value.goalDistanceBefore,
        value.goalDistanceAfter,
        value.goalwardProgression,
        value.goalCorridorClearance,
        value.fieldMargin,
        value.selfObservationAgeTicks,
        value.ballObservationAgeTicks,
        value.observedOpponentCount,
        value.observedTeammateCount,
      ];
      if (numeric.some((fact) => !Number.isFinite(fact))) nonFiniteFacts++;
      if (
        Math.abs(value.candidate.point.x) > HALF_L - 2 + 1e-9
        || Math.abs(value.candidate.point.y) > HALF_W - 2 + 1e-9
      ) insetViolations++;
      if (value.controllerGid !== controller.gid || snapshot.ball.ownerGid !== controller.gid) {
        controllerOwnerMismatches++;
      }
      if (value.candidate.id !== 'hold') {
        if (!supportCounts.has(value.candidate.id)) {
          duplicateCandidateIds++;
        } else {
          supportCounts.set(value.candidate.id, supportCounts.get(value.candidate.id)! + 1);
          supportMatches.get(value.candidate.id)!.add(seed);
        }
      }
    }

    for (let horizonIndex = 0; horizonIndex < CARRY_SAMPLE_HORIZONS.length; horizonIndex++) {
      const horizon = CARRY_SAMPLE_HORIZONS[horizonIndex];
      directionCountsByHorizon[horizonIndex].push(new Set(
        directional
          .filter((value) => value.candidate.sampleHorizon === horizon)
          .map((value) => value.candidate.directionIndex),
      ).size);
    }

    const recordRange = (target: number[], fact: (value: CarryAffordance) => number): void => {
      const facts = directional.map(fact);
      if (facts.length > 0) target.push(range(facts));
    };
    recordRange(ranges.selfArrival, (value) => value.selfArrival);
    recordRange(ranges.opponentArrivalMargin, (value) => value.opponentArrivalMargin);
    recordRange(ranges.nearestOpponentDistance, (value) => value.nearestOpponentDistanceAtArrival);
    recordRange(ranges.travelCorridorClearance, (value) => value.travelCorridorClearance);
    recordRange(ranges.nearestTeammateDistance, (value) => value.nearestTeammateDistanceAtArrival);
    recordRange(ranges.goalwardProgression, (value) => value.goalwardProgression);
    recordRange(ranges.goalCorridorClearance, (value) => value.goalCorridorClearance);
    recordRange(ranges.fieldMargin, (value) => value.fieldMargin);

    observedOpponentCounts.push(values[0].observedOpponentCount);
    observedTeammateCounts.push(values[0].observedTeammateCount);
    selfObservationAges.push(values[0].selfObservationAgeTicks);
    ballObservationAges.push(values[0].ballObservationAgeTicks);

    if (hasOrderedTradeoff(
      directional,
      (value) => value.goalwardProgression,
      (value) => value.opponentArrivalMargin,
      SPATIAL_DELTA,
      DT,
    )) progressAccessTradeoffs++;
    if (hasOrderedTradeoff(
      directional,
      (value) => value.opponentArrivalMargin,
      (value) => value.travelCorridorClearance,
      DT,
      SPATIAL_DELTA,
    )) endpointCorridorTradeoffs++;
    if (hasOrderedTradeoff(
      directional,
      (value) => value.goalwardProgression,
      (value) => value.fieldMargin,
      SPATIAL_DELTA,
      SPATIAL_DELTA,
    )) progressFieldTradeoffs++;
  }
  if (represented) representedMatches++;
}

const distribution = (values: readonly number[]) => ({
  n: values.length,
  min: values.length === 0 ? null : Math.min(...values),
  q10: quantile(values, 0.1),
  q50: quantile(values, 0.5),
  q90: quantile(values, 0.9),
  max: values.length === 0 ? null : Math.max(...values),
  mean: values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length),
});

const support = Object.fromEntries(EXPECTED_IDS.map((id) => [id, {
  states: supportCounts.get(id)!,
  matches: supportMatches.get(id)!.size,
}]));
const rangeDistributions = Object.fromEntries(
  Object.entries(ranges).map(([name, values]) => [name, distribution(values)]),
);
const progressAccessRate = progressAccessTradeoffs / Math.max(1, eligibleStates);
const gates = {
  matchesRepresented: representedMatches === 120,
  eligibleStates: eligibleStates >= MIN_ELIGIBLE_STATES,
  duplicateStateIdentities: duplicateStateIdentities === 0,
  nullEvaluations: nullEvaluations === 0,
  nonFiniteFacts: nonFiniteFacts === 0,
  duplicateCandidateIds: duplicateCandidateIds === 0,
  holdCandidateFailures: holdCandidateFailures === 0,
  insetViolations: insetViolations === 0,
  controllerOwnerMismatches: controllerOwnerMismatches === 0,
  inputMutations: inputMutations === 0,
  rngDraws: rngDraws === 0,
  candidateSupport: EXPECTED_IDS.every((id) =>
    supportCounts.get(id)! >= MIN_ID_SUPPORT && supportMatches.get(id)!.size === 120),
  progressionRange: quantile(ranges.goalwardProgression, 0.1) > SPATIAL_DELTA,
  opponentMarginRange: quantile(ranges.opponentArrivalMargin, 0.1) > DT,
  corridorRange: quantile(ranges.travelCorridorClearance, 0.1) > SPATIAL_DELTA,
  teammateRange: quantile(ranges.nearestTeammateDistance, 0.1) > SPATIAL_DELTA,
  primaryProgressAccessTradeoff: progressAccessRate >= 0.5,
};

const report = {
  contract: 'K0a-carry-affordance-census-v1',
  matches: MATCHES,
  seedStart: SEED_OFFSET,
  seedEnd: SEED_OFFSET + MATCHES - 1,
  matchDuration: MATCH_DURATION,
  sampleTicks: SAMPLE_TICKS,
  eligibleStates,
  representedMatches,
  candidateCounts: distribution(candidateCounts),
  directionCounts: CARRY_SAMPLE_HORIZONS.map((horizon, index) => ({
    horizon,
    ...distribution(directionCountsByHorizon[index]),
  })),
  support,
  rangeDistributions,
  observations: {
    opponents: distribution(observedOpponentCounts),
    teammates: distribution(observedTeammateCounts),
    selfAgeTicks: distribution(selfObservationAges),
    ballAgeTicks: distribution(ballObservationAges),
  },
  tradeoffs: {
    progressAccess: { count: progressAccessTradeoffs, rate: progressAccessRate },
    endpointCorridor: {
      count: endpointCorridorTradeoffs,
      rate: endpointCorridorTradeoffs / Math.max(1, eligibleStates),
    },
    progressField: {
      count: progressFieldTradeoffs,
      rate: progressFieldTradeoffs / Math.max(1, eligibleStates),
    },
  },
  violations: {
    duplicateStateIdentities,
    nullEvaluations,
    nonFiniteFacts,
    duplicateCandidateIds,
    holdCandidateFailures,
    insetViolations,
    controllerOwnerMismatches,
    inputMutations,
    rngDraws,
  },
  gates,
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pass = MATCHES === 120
  && SEED_OFFSET === 43000
  && Object.values(gates).every(Boolean);

console.log(JSON.stringify(report, null, 2));
console.log(`canonical sha256 ${digest}`);
console.log(`K0a verdict: ${pass ? 'PASS' : 'FAIL — STOP'}`);

if (!pass) process.exitCode = 2;
