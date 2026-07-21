// D2a DECENTRALISED PREFERENCE LEARNABILITY LAB (offline only).
// Authority: docs/world-model/DECENTRALISED-PREFERENCE-LEARNABILITY.md
import { createHash } from 'node:crypto';
import {
  createOffBallOfferCommitment,
  evaluateOffBallOfferCoordination,
  type OffBallOfferCommitment,
} from '../../src/ai/offBallCoordination';
import {
  evaluateOffBallAffordances,
  type OffBallAffordance,
} from '../../src/ai/offBallAffordance';
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  perceiveSnapshot,
  type PerceptionMemory,
  type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { clamp } from '../../src/utils/math';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type FirstTransitionOutcome,
} from './oracle-v2';

const MATCH_DURATION = 240;
const MOVE_STEPS = 90;
const COMMITMENT_TICKS = 90;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const MOVER_COUNT = 3;
const DIMENSIONS = 9;
const EPS = 1e-9;

const POPULATION = 12;
const GENERATIONS = 6;
const ELITES = 2;
const PARENT_POOL = 4;
const DEVELOPMENT_REPLICATES = 2;
const SEALED_REPLICATES = 4;
const BOOTSTRAPS = 10_000;

const DEVELOPMENT = { name: 'development', seedStart: 47_000, states: 64, maxSeeds: 128 } as const;
const VALIDATION = { name: 'validation', seedStart: 48_000, states: 96, maxSeeds: 192 } as const;
const FINAL = { name: 'final', seedStart: 49_000, states: 96, maxSeeds: 192 } as const;

const D2_PERSONAL_NAMESPACE = 0x0d2a0001;
const D2_EVOLUTION_NAMESPACE = 0x0d2a0002;
const D2_CHILD_NAMESPACE = 0x0d2a0003;
const D2_BOOTSTRAP_NAMESPACE = 0x0d2a0004;

type PreferenceGenome = readonly number[];
type RecordedOutcome = FirstTransitionOutcome | 'censored';
type EvaluationKind = 'legacy' | 'neutral' | 'independent' | 'coordinated' | 'ablation';
type MovementStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';

interface FrozenState {
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly moverGids: readonly [number, number, number];
  readonly offers: readonly [
    readonly OffBallAffordance[],
    readonly OffBallAffordance[],
    readonly OffBallAffordance[],
  ];
}

interface CollectionResult {
  readonly partition: string;
  readonly states: readonly FrozenState[];
  readonly scannedSeeds: number;
  readonly perceptionRngDraws: number;
  readonly nonFiniteFacts: number;
}

interface SelectionResult {
  readonly offer: OffBallAffordance;
  readonly coordinationNonConstant: boolean;
  readonly commitmentFactReads: number;
}

interface PortfolioSelection {
  readonly offers: readonly [OffBallAffordance, OffBallAffordance, OffBallAffordance];
  readonly coordinationInformative: boolean;
  readonly commitmentFactReads: number;
}

interface MovementResult {
  readonly match: Match;
  readonly status: MovementStatus;
  readonly selectedIds: readonly string[];
  readonly initialDistances: readonly number[];
  readonly finalDistances: readonly number[];
  readonly targetChanges: number;
  readonly unexpectedActionChanges: number;
  readonly nonFiniteFacts: number;
}

interface StateEvaluation {
  readonly seed: number;
  readonly movementStatus: MovementStatus;
  readonly selectedIds: readonly string[];
  readonly selectionNonHold: number;
  readonly coordinationInformative: boolean;
  readonly commitmentFactReads: number;
  readonly targetSatisfied: number;
  readonly targetDenominator: number;
  readonly coverageByReplicate: readonly number[];
  readonly outcomes: Readonly<Record<RecordedOutcome, number>>;
  readonly oracleOpportunities: number;
  readonly validity: ValidityCounters;
}

interface ValidityCounters {
  selectionFailures: number;
  oracleFailures: number;
  nonFiniteFacts: number;
  targetChanges: number;
  unexpectedActionChanges: number;
  childSeedCollisions: number;
}

interface GenomeEvaluation {
  readonly genome: PreferenceGenome;
  readonly canonicalGenome: string;
  readonly states: readonly StateEvaluation[];
  readonly coverage: number;
  readonly portfolioDenominator: number;
  readonly completedMovement: number;
  readonly opponentControls: number;
  readonly deadBalls: number;
  readonly nonHoldSelections: number;
  readonly selectionCount: number;
  readonly targetSatisfied: number;
  readonly targetDenominator: number;
  readonly outcomes: Readonly<Record<RecordedOutcome, number>>;
  readonly oracleOpportunities: number;
  readonly validity: ValidityCounters;
}

interface SealedBranchResult {
  readonly kind: EvaluationKind;
  readonly states: readonly StateEvaluation[];
  readonly coverage: number;
  readonly portfolioDenominator: number;
  readonly coverageRate: number;
  readonly completedMovement: number;
  readonly completionRate: number;
  readonly opponentControls: number;
  readonly opponentRate: number;
  readonly deadBalls: number;
  readonly deadRate: number;
  readonly nonHoldSelections: number;
  readonly selectionCount: number;
  readonly targetSatisfied: number;
  readonly targetDenominator: number;
  readonly targetSatisfactionRate: number;
  readonly outcomes: Readonly<Record<RecordedOutcome, number>>;
  readonly oracleOpportunities: number;
  readonly selectedIds: Readonly<Record<string, number>>;
  readonly validity: ValidityCounters;
}

const zeroValidity = (): ValidityCounters => ({
  selectionFailures: 0,
  oracleFailures: 0,
  nonFiniteFacts: 0,
  targetChanges: 0,
  unexpectedActionChanges: 0,
  childSeedCollisions: 0,
});

const addValidity = (target: ValidityCounters, source: ValidityCounters): void => {
  for (const key of Object.keys(target) as Array<keyof ValidityCounters>) target[key] += source[key];
};

const emptyOutcomes = (): Record<RecordedOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
  censored: 0,
});

const addOutcomes = (
  target: Record<RecordedOutcome, number>,
  source: Readonly<Record<RecordedOutcome, number>>,
): void => {
  for (const key of Object.keys(target) as RecordedOutcome[]) target[key] += source[key];
};

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

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1 ? match.duration / 2 : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= 8;
};

const finiteOffer = (offer: OffBallAffordance): boolean => [
  offer.candidate.point.x,
  offer.candidate.point.y,
  offer.selfArrival,
  offer.selfTurnTime,
  offer.opponentArrival,
  offer.opponentArrivalMargin,
  offer.nearestOpponentDistanceAtArrival,
  offer.nearestTeammateDistanceAtArrival,
  offer.carrierDistanceAtArrival,
  offer.carrierLaneClearance,
  offer.fieldMargin,
  offer.offsideMargin,
].every(Number.isFinite);

const eligibleOffers = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  offers
    .filter((offer) => offer.offsideMargin <= 0 && finiteOffer(offer))
    .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

const collectStates = (partition: typeof DEVELOPMENT | typeof VALIDATION | typeof FINAL): CollectionResult => {
  const states: FrozenState[] = [];
  let scannedSeeds = 0;
  let perceptionRngDraws = 0;
  let nonFiniteFacts = 0;

  for (
    let seed = partition.seedStart;
    seed < partition.seedStart + partition.maxSeeds && states.length < partition.states;
    seed++
  ) {
    scannedSeeds++;
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
    });
    const memories = new Map<number, PerceptionMemory>();
    const snapshots = new Map<number, PerceptionSnapshot>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let accepted = false;

    while (!match.finished && !accepted) {
      match.step(DT);
      const truth = capturePerceptionTruth(match);
      const rngBefore = (match.rng as unknown as { s: number }).s;
      for (const player of match.allPlayers) {
        if (player.role === 'GK' || player.sentOff) continue;
        snapshots.set(player.gid, perceiveSnapshot(
          truth,
          player.gid,
          AWARENESS,
          seed,
          memories.get(player.gid)!,
        ));
      }
      if (rngBefore !== (match.rng as unknown as { s: number }).s) perceptionRngDraws++;

      if (
        match.simTick % SAMPLE_TICKS !== 0
        || match.simTime < 10
        || !beforeAdministrativeBoundary(match)
        || match.phase !== 'playing'
      ) continue;
      const carrier = match.ball.owner;
      if (!carrier || carrier.sentOff || carrier.role === 'GK') continue;

      const profiles = profilesOf(match);
      const offersByGid = new Map<number, readonly OffBallAffordance[]>();
      const possibleMovers: number[] = [];
      for (const player of match.teams[carrier.side].players) {
        if (player === carrier || player.sentOff || player.role === 'GK') continue;
        const snapshot = snapshots.get(player.gid);
        if (!snapshot) continue;
        const evaluated = evaluateOffBallAffordances({
          snapshot,
          playerGid: player.gid,
          carrierGid: carrier.gid,
          attackDir: match.teams[carrier.side].attackDir,
          reachProfiles: profiles,
        });
        if (!evaluated) continue;
        const offers = eligibleOffers(evaluated);
        if (offers.some((offer) => !finiteOffer(offer))) nonFiniteFacts++;
        if (offers.length >= 5 && offers.some((offer) => offer.candidate.id === 'hold')) {
          possibleMovers.push(player.gid);
          offersByGid.set(player.gid, offers);
        }
      }
      if (possibleMovers.length < MOVER_COUNT) continue;
      possibleMovers.sort((leftGid, rightGid) => {
        const left = match.allPlayers[leftGid];
        const right = match.allPlayers[rightGid];
        return left.decisionTimer - right.decisionTimer || leftGid - rightGid;
      });
      const movers = possibleMovers.slice(0, MOVER_COUNT) as [number, number, number];
      states.push({
        seed,
        frozen: cloneSimulationState(match),
        carrierGid: carrier.gid,
        moverGids: movers,
        offers: [
          offersByGid.get(movers[0])!,
          offersByGid.get(movers[1])!,
          offersByGid.get(movers[2])!,
        ],
      });
      accepted = true;
    }
  }

  return { partition: partition.name, states, scannedSeeds, perceptionRngDraws, nonFiniteFacts };
};

const tiedPercentileRanks = (values: readonly number[]): readonly number[] => {
  const unique = [...new Set(values)].sort((left, right) => left - right);
  if (unique.length <= 1) return values.map(() => 0.5);
  const ranks = new Map(unique.map((value, index) => [value, index / (unique.length - 1)]));
  return values.map((value) => ranks.get(value)!);
};

const personalMultiplier = (seed: number, gid: number, dimension: number): number =>
  0.5 + (hashSeed(D2_PERSONAL_NAMESPACE, seed, gid, dimension) % 1001) / 1000;

const effectiveWeights = (
  genome: PreferenceGenome,
  seed: number,
  gid: number,
  personal: boolean,
): readonly number[] | null => {
  if (genome.length !== DIMENSIONS || genome.some((gene) => !Number.isFinite(gene) || gene < 0 || gene > 1)) {
    return null;
  }
  const raw = genome.map((gene, dimension) =>
    gene * (personal ? personalMultiplier(seed, gid, dimension) : 1));
  const total = raw.reduce((sum, value) => sum + value, 0);
  if (!Number.isFinite(total) || total <= 0) return null;
  return raw.map((value) => value / total);
};

const selectOffer = (
  offers: readonly OffBallAffordance[],
  weights: readonly number[],
  carrierPoint: Readonly<{ x: number; y: number }>,
  commitments: readonly OffBallOfferCommitment[],
  currentTick: number,
  coordinationEnabled: boolean,
): SelectionResult | null => {
  if (offers.length === 0 || weights.length !== DIMENSIONS) return null;
  const rows: number[][] = [];
  const coordinationRows: number[][] = [];
  let commitmentFactReads = 0;

  for (const offer of offers) {
    const base = [
      offer.opponentArrivalMargin,
      offer.nearestTeammateDistanceAtArrival,
      offer.carrierLaneClearance,
      offer.candidate.forwardDelta,
      -offer.selfArrival,
    ];
    let coordination = [0.5, 0.5, 0.5, 0.5];
    if (coordinationEnabled && commitments.length > 0) {
      const facts = evaluateOffBallOfferCoordination({
        candidate: offer,
        carrierPoint,
        commitments,
        currentTick,
      });
      if (
        !facts
        || facts.nearestTargetDistance === null
        || facts.nearestBearingSeparation === null
        || facts.nearestArrivalTimeSeparation === null
        || facts.nearestCorridorSeparation === null
      ) return null;
      coordination = [
        facts.nearestTargetDistance,
        facts.nearestBearingSeparation,
        facts.nearestArrivalTimeSeparation,
        facts.nearestCorridorSeparation,
      ];
      commitmentFactReads += 4;
    }
    if ([...base, ...coordination].some((value) => !Number.isFinite(value))) return null;
    rows.push([...base, ...coordination]);
    coordinationRows.push(coordination);
  }

  const ranks = Array.from({ length: DIMENSIONS }, (_, dimension) =>
    tiedPercentileRanks(rows.map((row) => row[dimension])));
  let selected = 0;
  let selectedScore = -Infinity;
  for (let offerIndex = 0; offerIndex < offers.length; offerIndex++) {
    const score = weights.reduce((sum, weight, dimension) =>
      sum + weight * ranks[dimension][offerIndex], 0);
    if (
      score > selectedScore + EPS
      || (
        Math.abs(score - selectedScore) <= EPS
        && offers[offerIndex].candidate.id.localeCompare(offers[selected].candidate.id) < 0
      )
    ) {
      selected = offerIndex;
      selectedScore = score;
    }
  }
  return {
    offer: offers[selected],
    coordinationNonConstant: coordinationEnabled && commitments.length > 0
      ? [0, 1, 2, 3].some((dimension) =>
        new Set(coordinationRows.map((row) => row[dimension])).size > 1)
      : false,
    commitmentFactReads,
  };
};

const selectPortfolio = (
  state: FrozenState,
  genome: PreferenceGenome,
  coordinationEnabled: boolean,
  personal: boolean,
): PortfolioSelection | null => {
  const carrier = state.frozen.allPlayers[state.carrierGid];
  const commitments: OffBallOfferCommitment[] = [];
  const selected: OffBallAffordance[] = [];
  let coordinationInformative = true;
  let commitmentFactReads = 0;

  for (let index = 0; index < MOVER_COUNT; index++) {
    const gid = state.moverGids[index];
    const weights = effectiveWeights(genome, state.seed, gid, personal);
    if (!weights) return null;
    const result = selectOffer(
      state.offers[index],
      weights,
      carrier.pos,
      coordinationEnabled ? commitments : [],
      state.frozen.simTick,
      coordinationEnabled,
    );
    if (!result) return null;
    if (index > 0 && coordinationEnabled && !result.coordinationNonConstant) {
      coordinationInformative = false;
    }
    commitmentFactReads += result.commitmentFactReads;
    selected.push(result.offer);
    if (coordinationEnabled) {
      const commitment = createOffBallOfferCommitment(
        result.offer,
        state.frozen.simTick,
        state.frozen.simTick + COMMITMENT_TICKS,
      );
      if (!commitment) return null;
      commitments.push(commitment);
    }
  }
  return {
    offers: [selected[0], selected[1], selected[2]],
    coordinationInformative,
    commitmentFactReads,
  };
};

const runMovement = (
  state: FrozenState,
  selected: PortfolioSelection | null,
): MovementResult => {
  const branch = cloneSimulationState(state.frozen);
  const carrier = branch.allPlayers[state.carrierGid];
  const movers = state.moverGids.map((gid) => branch.allPlayers[gid]);
  const targets = selected?.offers.map((offer) => ({
    x: offer.candidate.point.x,
    y: offer.candidate.point.y,
  })) ?? [];
  const initialDistances = selected?.offers.map((offer, index) => Math.hypot(
    movers[index].pos.x - offer.candidate.point.x,
    movers[index].pos.y - offer.candidate.point.y,
  )) ?? [];
  const carrierRoster = carrier.rosterIdx;
  const moverRosters = movers.map((mover) => mover.rosterIdx);

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  if (selected) {
    movers.forEach((mover, index) => {
      mover.action = { type: 'MoveToPoint', targetPos: targets[index], scores: [] };
      mover.decisionTimer = Number.POSITIVE_INFINITY;
    });
  }

  let status: MovementStatus = 'completed';
  let targetChanges = 0;
  let unexpectedActionChanges = 0;
  let nonFiniteFacts = 0;
  for (let step = 0; step < MOVE_STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    if ([
      carrier.pos.x,
      carrier.pos.y,
      branch.ball.pos.x,
      branch.ball.pos.y,
      ...movers.flatMap((mover) => [mover.pos.x, mover.pos.y, mover.vel.x, mover.vel.y]),
    ].some((value) => !Number.isFinite(value))) nonFiniteFacts++;
    if (branch.phase !== 'playing') {
      status = 'deadBallOrRestart';
      break;
    }
    if (branch.ball.owner !== carrier) {
      if (!branch.ball.owner) status = 'loose';
      else if (branch.ball.owner.side === carrier.side) status = 'lostToTeammate';
      else status = 'lostToOpponent';
      break;
    }
    if (
      carrier.sentOff
      || carrier.rosterIdx !== carrierRoster
      || movers.some((mover, index) => mover.sentOff || mover.rosterIdx !== moverRosters[index])
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') {
      unexpectedActionChanges++;
      status = 'unexpectedInterventionChange';
      break;
    }
    if (selected) {
      for (let index = 0; index < MOVER_COUNT; index++) {
        const action = movers[index].action;
        if (action.type !== 'MoveToPoint') unexpectedActionChanges++;
        else if (action.targetPos?.x !== targets[index].x || action.targetPos?.y !== targets[index].y) {
          targetChanges++;
        }
      }
      if (targetChanges > 0 || unexpectedActionChanges > 0) {
        status = 'unexpectedInterventionChange';
        break;
      }
    }
  }

  return {
    match: branch,
    status,
    selectedIds: selected?.offers.map((offer) => offer.candidate.id) ?? [],
    initialDistances,
    finalDistances: selected?.offers.map((offer, index) => Math.hypot(
      movers[index].pos.x - offer.candidate.point.x,
      movers[index].pos.y - offer.candidate.point.y,
    )) ?? [],
    targetChanges,
    unexpectedActionChanges,
    nonFiniteFacts,
  };
};

const childSeedOf = (state: FrozenState, moverOrdinal: number, replicate: number): number =>
  hashSeed(D2_CHILD_NAMESPACE, state.seed, state.frozen.simTick, moverOrdinal, replicate);

const evaluateState = (
  state: FrozenState,
  kind: EvaluationKind,
  genome: PreferenceGenome,
  replicates: number,
): StateEvaluation => {
  const validity = zeroValidity();
  const coordinated = kind !== 'legacy' && kind !== 'independent';
  const personal = kind !== 'ablation';
  const selection = kind === 'legacy'
    ? null
    : selectPortfolio(state, genome, coordinated, personal);
  if (kind !== 'legacy' && !selection) validity.selectionFailures++;
  const movement = runMovement(state, selection);
  validity.nonFiniteFacts += movement.nonFiniteFacts;
  validity.targetChanges += movement.targetChanges;
  validity.unexpectedActionChanges += movement.unexpectedActionChanges;

  let targetSatisfied = 0;
  let targetDenominator = 0;
  if (selection && movement.status === 'completed') {
    for (let index = 0; index < MOVER_COUNT; index++) {
      targetDenominator++;
      const hold = selection.offers[index].candidate.id === 'hold';
      if (
        hold
          ? movement.finalDistances[index] <= 0.5
          : movement.initialDistances[index] - movement.finalDistances[index] >= 0.25
      ) targetSatisfied++;
    }
  }

  const outcomes = emptyOutcomes();
  const coverageByReplicate = Array.from({ length: replicates }, () => 0);
  let oracleOpportunities = 0;
  const seenChildSeeds = new Map<number, string>();
  if (movement.status === 'completed') {
    for (let replicate = 0; replicate < replicates; replicate++) {
      let intended = 0;
      for (let moverOrdinal = 0; moverOrdinal < MOVER_COUNT; moverOrdinal++) {
        const childSeed = childSeedOf(state, moverOrdinal, replicate);
        const childKey = `${state.seed}:${state.frozen.simTick}:${moverOrdinal}:${replicate}`;
        const existing = seenChildSeeds.get(childSeed);
        if (existing !== undefined && existing !== childKey) validity.childSeedCollisions++;
        seenChildSeeds.set(childSeed, childKey);
        const oracle = runOracleV2Branch({
          frozen: movement.match,
          passerGid: state.carrierGid,
          targetGid: state.moverGids[moverOrdinal],
          side: state.frozen.allPlayers[state.carrierGid].side as Side,
          branch: kind === 'legacy' ? 'chosen' : 'alternative',
          childRngState: childSeed,
          includeTransitionDiagnostic: false,
        });
        if (!oracle.ok || oracle.record.firstTransition.status === 'forceFailure') {
          validity.oracleFailures++;
          continue;
        }
        oracleOpportunities++;
        const outcome: RecordedOutcome = oracle.record.firstTransition.status === 'censored'
          ? 'censored'
          : oracle.record.firstTransition.outcome!;
        outcomes[outcome]++;
        if (outcome === 'intendedReception') intended++;
      }
      if (intended > 0) coverageByReplicate[replicate] = 1;
    }
  }

  return {
    seed: state.seed,
    movementStatus: movement.status,
    selectedIds: movement.selectedIds,
    selectionNonHold: movement.selectedIds.filter((id) => id !== 'hold').length,
    coordinationInformative: selection?.coordinationInformative ?? false,
    commitmentFactReads: selection?.commitmentFactReads ?? 0,
    targetSatisfied,
    targetDenominator,
    coverageByReplicate,
    outcomes,
    oracleOpportunities,
    validity,
  };
};

const evaluateGenome = (
  states: readonly FrozenState[],
  genome: PreferenceGenome,
  replicates: number,
  kind: EvaluationKind = 'coordinated',
): GenomeEvaluation => {
  const stateResults = states.map((state) => evaluateState(state, kind, genome, replicates));
  const outcomes = emptyOutcomes();
  const validity = zeroValidity();
  for (const state of stateResults) {
    addOutcomes(outcomes, state.outcomes);
    addValidity(validity, state.validity);
  }
  return {
    genome,
    canonicalGenome: JSON.stringify(genome),
    states: stateResults,
    coverage: stateResults.reduce((sum, state) =>
      sum + state.coverageByReplicate.reduce((a, b) => a + b, 0), 0),
    portfolioDenominator: states.length * replicates,
    completedMovement: stateResults.filter((state) => state.movementStatus === 'completed').length,
    opponentControls: outcomes.opponentInterception,
    deadBalls: outcomes.deadBall,
    nonHoldSelections: stateResults.reduce((sum, state) => sum + state.selectionNonHold, 0),
    selectionCount: states.length * MOVER_COUNT,
    targetSatisfied: stateResults.reduce((sum, state) => sum + state.targetSatisfied, 0),
    targetDenominator: stateResults.reduce((sum, state) => sum + state.targetDenominator, 0),
    outcomes,
    oracleOpportunities: stateResults.reduce((sum, state) => sum + state.oracleOpportunities, 0),
    validity,
  };
};

const compareGenomeEvaluation = (left: GenomeEvaluation, right: GenomeEvaluation): number =>
  right.coverage - left.coverage
  || right.completedMovement - left.completedMovement
  || left.opponentControls - right.opponentControls
  || left.deadBalls - right.deadBalls
  || left.canonicalGenome.localeCompare(right.canonicalGenome);

const neutralGenome = (): PreferenceGenome => Array.from({ length: DIMENSIONS }, () => 1);

const initialPopulation = (): PreferenceGenome[] => {
  const rng = new Rng(D2_EVOLUTION_NAMESPACE);
  return [
    neutralGenome(),
    ...Array.from({ length: POPULATION - 1 }, () =>
      Array.from({ length: DIMENSIONS }, () => rng.range(0.05, 1))),
  ];
};

const reproduce = (
  ranked: readonly GenomeEvaluation[],
  generation: number,
): PreferenceGenome[] => {
  const rng = new Rng(hashSeed(D2_EVOLUTION_NAMESPACE, generation));
  const next: PreferenceGenome[] = ranked.slice(0, ELITES).map((entry) => [...entry.genome]);
  const pool = ranked.slice(0, PARENT_POOL);
  while (next.length < POPULATION) {
    const parentA = pool[rng.int(0, pool.length - 1)].genome;
    let parentBIndex = rng.int(0, pool.length - 1);
    if (pool.length > 1 && pool[parentBIndex].genome === parentA) {
      parentBIndex = (parentBIndex + 1) % pool.length;
    }
    const parentB = pool[parentBIndex].genome;
    const child = Array.from({ length: DIMENSIONS }, (_, dimension) => {
      const inheritance = rng.next();
      let value = inheritance < 0.4
        ? parentA[dimension]
        : inheritance < 0.8
          ? parentB[dimension]
          : (parentA[dimension] + parentB[dimension]) / 2;
      if (rng.chance(0.5)) value += rng.gaussian() * 0.15;
      return clamp(value, 0, 1);
    });
    next.push(child);
  }
  return next;
};

const normalisedBase = (genome: PreferenceGenome): readonly number[] => {
  const total = genome.reduce((sum, gene) => sum + gene, 0);
  return genome.map((gene) => gene / total);
};

const l1 = (left: readonly number[], right: readonly number[]): number =>
  left.reduce((sum, value, index) => sum + Math.abs(value - right[index]), 0);

const coverageRate = (evaluation: GenomeEvaluation): number =>
  evaluation.coverage / Math.max(1, evaluation.portfolioDenominator);

const fixedOutcomeRate = (evaluation: GenomeEvaluation, count: number): number =>
  count / Math.max(1, evaluation.portfolioDenominator * MOVER_COUNT);

const selectionDifferenceRate = (left: GenomeEvaluation, right: GenomeEvaluation): number => {
  let changed = 0;
  for (let index = 0; index < left.states.length; index++) {
    if (left.states[index].selectedIds.some((id, mover) => id !== right.states[index].selectedIds[mover])) {
      changed++;
    }
  }
  return changed / Math.max(1, left.states.length);
};

const developmentValidityPass = (evaluation: GenomeEvaluation): boolean =>
  Object.values(evaluation.validity).every((value) => value === 0);

const runDevelopment = (collection: CollectionResult) => {
  let population = initialPopulation();
  const generations: Array<{
    generation: number;
    bestGenome: PreferenceGenome;
    bestCoverage: number;
    bestCompleted: number;
    bestOpponent: number;
    bestDead: number;
  }> = [];
  let evaluations = 0;
  let finalRanked: GenomeEvaluation[] = [];
  let neutralEvaluation: GenomeEvaluation | null = null;

  for (let generation = 0; generation < GENERATIONS; generation++) {
    const ranked = population
      .map((genome) => evaluateGenome(collection.states, genome, DEVELOPMENT_REPLICATES))
      .sort(compareGenomeEvaluation);
    evaluations += ranked.length;
    if (generation === 0) {
      neutralEvaluation = ranked.find((entry) => entry.canonicalGenome === JSON.stringify(neutralGenome())) ?? null;
    }
    const best = ranked[0];
    generations.push({
      generation,
      bestGenome: best.genome,
      bestCoverage: best.coverage,
      bestCompleted: best.completedMovement,
      bestOpponent: best.opponentControls,
      bestDead: best.deadBalls,
    });
    console.log(
      `development generation ${generation}`
      + ` coverage ${best.coverage}/${best.portfolioDenominator}`
      + ` completed ${best.completedMovement}/${collection.states.length}`
      + ` opponent ${best.opponentControls} dead ${best.deadBalls}`,
    );
    finalRanked = ranked;
    if (generation < GENERATIONS - 1) population = reproduce(ranked, generation + 1);
  }

  const winner = finalRanked[0];
  const repeatedWinner = evaluateGenome(collection.states, winner.genome, DEVELOPMENT_REPLICATES);
  const neutral = neutralEvaluation!;
  const winnerNormalised = normalisedBase(winner.genome);
  const neutralNormalised = normalisedBase(neutral.genome);
  const winnerCoverageEdge = coverageRate(winner) - coverageRate(neutral);
  const winnerOpponentEdge = fixedOutcomeRate(winner, winner.opponentControls)
    - fixedOutcomeRate(neutral, neutral.opponentControls);
  const winnerDeadEdge = fixedOutcomeRate(winner, winner.deadBalls)
    - fixedOutcomeRate(neutral, neutral.deadBalls);
  const deterministicWinner = JSON.stringify(winner) === JSON.stringify(repeatedWinner);
  const gates = {
    acceptedStates: collection.states.length === DEVELOPMENT.states,
    scannedSeeds: collection.scannedSeeds <= DEVELOPMENT.maxSeeds,
    collectionValidity: collection.perceptionRngDraws === 0 && collection.nonFiniteFacts === 0,
    evaluationValidity: developmentValidityPass(winner) && developmentValidityPass(neutral),
    evaluationCount: evaluations === POPULATION * GENERATIONS,
    deterministicWinner,
    weightMovement: l1(winnerNormalised, neutralNormalised) >= 0.15,
    selectionMovement: selectionDifferenceRate(winner, neutral) >= 0.4,
    nonHoldSupport: winner.nonHoldSelections / Math.max(1, winner.selectionCount) >= 0.4,
    movementCompletion: winner.completedMovement / Math.max(1, collection.states.length) >= 0.7,
    coverageLearning: winnerCoverageEdge >= 0.15,
    opponentNonRegression: winnerOpponentEdge <= 0,
    deadBallNonRegression: winnerDeadEdge <= 0.05,
  };
  const pass = Object.values(gates).every(Boolean);
  return {
    winner,
    neutral,
    generations,
    evaluations,
    effects: {
      coverageEdge: winnerCoverageEdge,
      opponentEdge: winnerOpponentEdge,
      deadBallEdge: winnerDeadEdge,
      normalisedWeightL1: l1(winnerNormalised, neutralNormalised),
      selectionDifferenceRate: selectionDifferenceRate(winner, neutral),
      nonHoldRate: winner.nonHoldSelections / Math.max(1, winner.selectionCount),
    },
    deterministicWinner,
    gates,
    pass,
  };
};

const aggregateSealedBranch = (
  kind: EvaluationKind,
  states: readonly StateEvaluation[],
  stateCount: number,
  replicates: number,
): SealedBranchResult => {
  const outcomes = emptyOutcomes();
  const validity = zeroValidity();
  const selectedIds: Record<string, number> = {};
  for (const state of states) {
    addOutcomes(outcomes, state.outcomes);
    addValidity(validity, state.validity);
    for (const id of state.selectedIds) selectedIds[id] = (selectedIds[id] ?? 0) + 1;
  }
  const coverage = states.reduce((sum, state) =>
    sum + state.coverageByReplicate.reduce((a, b) => a + b, 0), 0);
  const portfolioDenominator = stateCount * replicates;
  const completedMovement = states.filter((state) => state.movementStatus === 'completed').length;
  const selectionCount = states.reduce((sum, state) => sum + state.selectedIds.length, 0);
  const targetSatisfied = states.reduce((sum, state) => sum + state.targetSatisfied, 0);
  const targetDenominator = states.reduce((sum, state) => sum + state.targetDenominator, 0);
  const fixedOptionDenominator = portfolioDenominator * MOVER_COUNT;
  return {
    kind,
    states,
    coverage,
    portfolioDenominator,
    coverageRate: coverage / Math.max(1, portfolioDenominator),
    completedMovement,
    completionRate: completedMovement / Math.max(1, stateCount),
    opponentControls: outcomes.opponentInterception,
    opponentRate: outcomes.opponentInterception / Math.max(1, fixedOptionDenominator),
    deadBalls: outcomes.deadBall,
    deadRate: outcomes.deadBall / Math.max(1, fixedOptionDenominator),
    nonHoldSelections: states.reduce((sum, state) => sum + state.selectionNonHold, 0),
    selectionCount,
    targetSatisfied,
    targetDenominator,
    targetSatisfactionRate: targetSatisfied / Math.max(1, targetDenominator),
    outcomes,
    oracleOpportunities: states.reduce((sum, state) => sum + state.oracleOpportunities, 0),
    selectedIds: Object.fromEntries(Object.entries(selectedIds).sort(([a], [b]) => a.localeCompare(b))),
    validity,
  };
};

const quantile = (sorted: readonly number[], p: number): number => {
  const index = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * sorted.length)));
  return sorted[index];
};

const bootstrapDifference = (
  left: SealedBranchResult,
  right: SealedBranchResult,
  seed: number,
): readonly [number, number] => {
  const rng = new Rng(seed);
  const values: number[] = [];
  for (let iteration = 0; iteration < BOOTSTRAPS; iteration++) {
    let leftCoverage = 0;
    let rightCoverage = 0;
    for (let draw = 0; draw < left.states.length; draw++) {
      const index = rng.int(0, left.states.length - 1);
      leftCoverage += left.states[index].coverageByReplicate.reduce((a, b) => a + b, 0);
      rightCoverage += right.states[index].coverageByReplicate.reduce((a, b) => a + b, 0);
    }
    const denominator = left.states.length * left.states[0].coverageByReplicate.length;
    values.push((leftCoverage - rightCoverage) / denominator);
  }
  values.sort((a, b) => a - b);
  return [quantile(values, 0.025), quantile(values, 0.975)];
};

const stateSelectionDifferenceRate = (
  left: SealedBranchResult,
  right: SealedBranchResult,
): number => {
  let changed = 0;
  for (let index = 0; index < left.states.length; index++) {
    if (left.states[index].selectedIds.some((id, mover) => id !== right.states[index].selectedIds[mover])) {
      changed++;
    }
  }
  return changed / Math.max(1, left.states.length);
};

const maxCandidateShare = (branch: SealedBranchResult): number =>
  Math.max(0, ...Object.values(branch.selectedIds)) / Math.max(1, branch.selectionCount);

const allValidityZero = (branch: SealedBranchResult): boolean =>
  Object.values(branch.validity).every((value) => value === 0);

const runSealedPartition = (
  collection: CollectionResult,
  winner: PreferenceGenome,
  developmentEdge: number,
  finalMode: boolean,
) => {
  const neutral = neutralGenome();
  const branchKinds: readonly EvaluationKind[] = ['legacy', 'neutral', 'independent', 'coordinated', 'ablation'];
  const branches = new Map<EvaluationKind, SealedBranchResult>();
  for (const kind of branchKinds) {
    const genome = kind === 'neutral' ? neutral : winner;
    const states = collection.states.map((state) => evaluateState(
      state,
      kind,
      genome,
      SEALED_REPLICATES,
    ));
    branches.set(kind, aggregateSealedBranch(
      kind,
      states,
      collection.states.length,
      SEALED_REPLICATES,
    ));
  }
  const legacy = branches.get('legacy')!;
  const neutralBranch = branches.get('neutral')!;
  const independent = branches.get('independent')!;
  const coordinated = branches.get('coordinated')!;
  const ablation = branches.get('ablation')!;
  const coverageNeutralEdge = coordinated.coverageRate - neutralBranch.coverageRate;
  const coverageIndependentEdge = coordinated.coverageRate - independent.coverageRate;
  const coverageLegacyEdge = coordinated.coverageRate - legacy.coverageRate;
  const opponentLegacyEdge = coordinated.opponentRate - legacy.opponentRate;
  const deadLegacyEdge = coordinated.deadRate - legacy.deadRate;
  const neutralCi = bootstrapDifference(
    coordinated,
    neutralBranch,
    hashSeed(D2_BOOTSTRAP_NAMESPACE, collection.states[0].seed, 1),
  );
  const legacyCi = bootstrapDifference(
    coordinated,
    legacy,
    hashSeed(D2_BOOTSTRAP_NAMESPACE, collection.states[0].seed, 2),
  );
  const firstMoverMismatches = coordinated.states.reduce((sum, state, index) =>
    sum + Number(state.selectedIds[0] !== independent.states[index].selectedIds[0]), 0);
  const coordinationInformative = coordinated.states.filter((state) => state.coordinationInformative).length;
  const selectionDifference = stateSelectionDifferenceRate(coordinated, neutralBranch);
  const validityGates = {
    acceptedStates: collection.states.length === (finalMode ? FINAL.states : VALIDATION.states),
    scannedSeeds: collection.scannedSeeds <= (finalMode ? FINAL.maxSeeds : VALIDATION.maxSeeds),
    collectionValidity: collection.perceptionRngDraws === 0 && collection.nonFiniteFacts === 0,
    branchValidity: branchKinds.every((kind) => allValidityZero(branches.get(kind)!)),
    movementAttempts: branchKinds.every((kind) => branches.get(kind)!.states.length === collection.states.length),
    opportunityConservation: branchKinds.every((kind) => {
      const branch = branches.get(kind)!;
      return branch.oracleOpportunities === branch.completedMovement * MOVER_COUNT * SEALED_REPLICATES;
    }),
    firstMoverAblation: firstMoverMismatches === 0,
    coordinationSupport: coordinationInformative >= collection.states.length * 0.95,
    targetSatisfaction: coordinated.targetSatisfactionRate >= 0.95,
    completionBalance: Math.abs(coordinated.completionRate - legacy.completionRate) <= 0.05,
    selectionMovement: selectionDifference >= 0.4,
    nonHoldSupport: coordinated.nonHoldSelections / Math.max(1, coordinated.selectionCount) >= 0.4,
    candidateNonCollapse: maxCandidateShare(coordinated) <= 0.7,
  };
  const pointGates = {
    coverageNeutral: coverageNeutralEdge >= (finalMode ? 0.1 : 0.15),
    coordinationPayoff: coverageIndependentEdge >= 0.03,
    legacyNonInferiority: coverageLegacyEdge >= -0.1,
    opponentNonRegression: opponentLegacyEdge <= 0.05,
    deadBallNonRegression: deadLegacyEdge <= 0.05,
    generalisation: finalMode || developmentEdge - coverageNeutralEdge <= 0.1,
  };
  const confidenceGates = {
    neutralLowerBound: finalMode || neutralCi[0] >= 0.05,
    legacyLowerBound: finalMode || legacyCi[0] >= -0.15,
  };
  const validityPass = Object.values(validityGates).every(Boolean);
  const pointPass = Object.values(pointGates).every(Boolean);
  const confidencePass = Object.values(confidenceGates).every(Boolean);
  const verdict = validityPass && pointPass
    ? confidencePass ? 'PASS' : 'INCONCLUSIVE'
    : 'FAIL';
  return {
    partition: collection.partition,
    branches: Object.fromEntries(branchKinds.map((kind) => {
      const branch = branches.get(kind)!;
      return [kind, {
        coverage: branch.coverage,
        portfolioDenominator: branch.portfolioDenominator,
        coverageRate: branch.coverageRate,
        completedMovement: branch.completedMovement,
        completionRate: branch.completionRate,
        opponentControls: branch.opponentControls,
        opponentRate: branch.opponentRate,
        deadBalls: branch.deadBalls,
        deadRate: branch.deadRate,
        nonHoldSelections: branch.nonHoldSelections,
        selectionCount: branch.selectionCount,
        targetSatisfied: branch.targetSatisfied,
        targetDenominator: branch.targetDenominator,
        targetSatisfactionRate: branch.targetSatisfactionRate,
        outcomes: branch.outcomes,
        oracleOpportunities: branch.oracleOpportunities,
        selectedIds: branch.selectedIds,
        validity: branch.validity,
      }];
    })),
    effects: {
      coverageNeutralEdge,
      coverageIndependentEdge,
      coverageLegacyEdge,
      opponentLegacyEdge,
      deadLegacyEdge,
      neutralCi,
      legacyCi,
      developmentValidationEdgeDrop: developmentEdge - coverageNeutralEdge,
      selectionDifference,
      firstMoverMismatches,
      coordinationInformative,
      maxCandidateShare: maxCandidateShare(coordinated),
      ablationCoverageEdge: coordinated.coverageRate - ablation.coverageRate,
    },
    validityGates,
    pointGates,
    confidenceGates,
    verdict,
  };
};

const conciseEvaluation = (evaluation: GenomeEvaluation) => ({
  genome: evaluation.genome,
  coverage: evaluation.coverage,
  portfolioDenominator: evaluation.portfolioDenominator,
  coverageRate: coverageRate(evaluation),
  completedMovement: evaluation.completedMovement,
  movementStatuses: Object.fromEntries(
    [...new Set(evaluation.states.map((state) => state.movementStatus))]
      .sort()
      .map((status) => [
        status,
        evaluation.states.filter((state) => state.movementStatus === status).length,
      ]),
  ),
  opponentControls: evaluation.opponentControls,
  opponentRate: fixedOutcomeRate(evaluation, evaluation.opponentControls),
  deadBalls: evaluation.deadBalls,
  deadRate: fixedOutcomeRate(evaluation, evaluation.deadBalls),
  nonHoldSelections: evaluation.nonHoldSelections,
  selectionCount: evaluation.selectionCount,
  outcomes: evaluation.outcomes,
  oracleOpportunities: evaluation.oracleOpportunities,
  validity: evaluation.validity,
});

const developmentCollection = collectStates(DEVELOPMENT);
console.log(
  `development states ${developmentCollection.states.length}/${DEVELOPMENT.states}`
  + ` from ${developmentCollection.scannedSeeds}/${DEVELOPMENT.maxSeeds} seeds`,
);
const development = runDevelopment(developmentCollection);

let validationCollection: CollectionResult | null = null;
let validation: ReturnType<typeof runSealedPartition> | null = null;
let finalCollection: CollectionResult | null = null;
let final: ReturnType<typeof runSealedPartition> | null = null;

if (development.pass) {
  validationCollection = collectStates(VALIDATION);
  console.log(
    `validation states ${validationCollection.states.length}/${VALIDATION.states}`
    + ` from ${validationCollection.scannedSeeds}/${VALIDATION.maxSeeds} seeds`,
  );
  validation = runSealedPartition(
    validationCollection,
    development.winner.genome,
    development.effects.coverageEdge,
    false,
  );
  if (validation.verdict === 'PASS') {
    finalCollection = collectStates(FINAL);
    console.log(
      `final states ${finalCollection.states.length}/${FINAL.states}`
      + ` from ${finalCollection.scannedSeeds}/${FINAL.maxSeeds} seeds`,
    );
    final = runSealedPartition(
      finalCollection,
      development.winner.genome,
      development.effects.coverageEdge,
      true,
    );
  }
}

const report = {
  authority: 'D2a decentralised preference learnability lab',
  configuration: {
    population: POPULATION,
    generations: GENERATIONS,
    developmentReplicates: DEVELOPMENT_REPLICATES,
    sealedReplicates: SEALED_REPLICATES,
    bootstraps: BOOTSTRAPS,
    development: DEVELOPMENT,
    validation: VALIDATION,
    final: FINAL,
  },
  developmentCollection: {
    states: developmentCollection.states.length,
    scannedSeeds: developmentCollection.scannedSeeds,
    perceptionRngDraws: developmentCollection.perceptionRngDraws,
    nonFiniteFacts: developmentCollection.nonFiniteFacts,
  },
  development: {
    winner: conciseEvaluation(development.winner),
    neutral: conciseEvaluation(development.neutral),
    generations: development.generations,
    evaluations: development.evaluations,
    effects: development.effects,
    deterministicWinner: development.deterministicWinner,
    gates: development.gates,
    pass: development.pass,
  },
  validationCollection: validationCollection && {
    states: validationCollection.states.length,
    scannedSeeds: validationCollection.scannedSeeds,
    perceptionRngDraws: validationCollection.perceptionRngDraws,
    nonFiniteFacts: validationCollection.nonFiniteFacts,
  },
  validation,
  finalCollection: finalCollection && {
    states: finalCollection.states.length,
    scannedSeeds: finalCollection.scannedSeeds,
    perceptionRngDraws: finalCollection.perceptionRngDraws,
    nonFiniteFacts: finalCollection.nonFiniteFacts,
  },
  final,
  verdict: !development.pass
    ? 'FAIL — DEVELOPMENT STOP'
    : validation?.verdict !== 'PASS'
      ? `${validation?.verdict ?? 'FAIL'} — VALIDATION STOP`
      : final?.verdict === 'PASS'
        ? 'PASS'
        : 'FAIL — FINAL STOP',
};

const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');

console.log('D2a DECENTRALISED PREFERENCE LEARNABILITY LAB');
console.log(`winner ${JSON.stringify(development.winner.genome)}`);
console.log(
  `development coverage winner ${development.winner.coverage}/${development.winner.portfolioDenominator}`
  + ` neutral ${development.neutral.coverage}/${development.neutral.portfolioDenominator}`
  + ` edge ${(development.effects.coverageEdge * 100).toFixed(1)}pp`,
);
console.log(
  `development movement winner ${development.winner.completedMovement}/${DEVELOPMENT.states}`
  + ` neutral ${development.neutral.completedMovement}/${DEVELOPMENT.states}`
  + ` · opponent ${development.winner.opponentControls}/${development.neutral.opponentControls}`
  + ` · dead ${development.winner.deadBalls}/${development.neutral.deadBalls}`,
);
console.log(`development gates ${JSON.stringify(development.gates)}`);
if (validation) {
  console.log(`validation effects ${JSON.stringify(validation.effects)}`);
  console.log(`validation gates ${JSON.stringify({
    ...validation.validityGates,
    ...validation.pointGates,
    ...validation.confidenceGates,
  })}`);
  console.log(`validation verdict ${validation.verdict}`);
}
if (final) {
  console.log(`final effects ${JSON.stringify(final.effects)}`);
  console.log(`final gates ${JSON.stringify({ ...final.validityGates, ...final.pointGates })}`);
  console.log(`final verdict ${final.verdict}`);
}
console.log(`canonical sha256 ${digest}`);
console.log(`verdict ${report.verdict}`);

if (report.verdict !== 'PASS') process.exitCode = 1;
