// D1 DECENTRALISED OFFER-LOOP COMPOSITION LAB (offline only).
// Authority: docs/world-model/DECENTRALISED-OFFER-LOOP-LAB.md
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
import { closestPointOnSegment } from '../../src/utils/vec';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type FirstTransitionOutcome,
} from './oracle-v2';

const REQUIRED_STATES = Number(process.argv[2] ?? 128);
const SEED_START = Number(process.argv[3] ?? 46000);
const MAX_SEEDS = 256;
const MATCH_DURATION = 240;
const MOVE_STEPS = 90;
const COMMITMENT_TICKS = 90;
const REPLICATES = 4;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const MOVER_COUNT = 3;
const D1_NAMESPACE = 0x0d100001;
const DIMENSIONS = 9;
const EPS = 1e-9;

type BranchKind = 'legacy' | 'independent' | 'coordinated';
type RecordedOutcome = FirstTransitionOutcome | 'censored';
type MovementStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';

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
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
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

const preferenceWeights = (seed: number, playerGid: number): readonly number[] => {
  const raw = Array.from({ length: DIMENSIONS }, (_, dimension) =>
    0.5 + (hashSeed(D1_NAMESPACE, seed, playerGid, dimension) % 1001) / 1000);
  const total = raw.reduce((sum, value) => sum + value, 0);
  return raw.map((value) => value / total);
};

const tiedPercentileRanks = (values: readonly number[]): readonly number[] => {
  const unique = [...new Set(values)].sort((left, right) => left - right);
  if (unique.length <= 1) return values.map(() => 0.5);
  const rank = new Map(unique.map((value, index) => [value, index / (unique.length - 1)]));
  return values.map((value) => rank.get(value)!);
};

interface SelectionResult {
  readonly offer: OffBallAffordance;
  readonly score: number;
  readonly coordinationNonConstant: boolean;
  readonly commitmentFactReads: number;
}

let selectionFailures = 0;
let nonFiniteSelectionFacts = 0;

const selectOffer = (
  offers: readonly OffBallAffordance[],
  weights: readonly number[],
  carrierPoint: Readonly<{ x: number; y: number }>,
  commitments: readonly OffBallOfferCommitment[],
  currentTick: number,
  coordinationEnabled: boolean,
): SelectionResult | null => {
  if (offers.length === 0 || weights.length !== DIMENSIONS) return null;
  const rawRows: number[][] = [];
  let coordinationNonConstant = false;
  let commitmentFactReads = 0;
  const coordinationRows: number[][] = [];

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
        facts === null
        || facts.nearestTargetDistance === null
        || facts.nearestBearingSeparation === null
        || facts.nearestArrivalTimeSeparation === null
        || facts.nearestCorridorSeparation === null
      ) {
        selectionFailures++;
        return null;
      }
      coordination = [
        facts.nearestTargetDistance,
        facts.nearestBearingSeparation,
        facts.nearestArrivalTimeSeparation,
        facts.nearestCorridorSeparation,
      ];
      commitmentFactReads += coordination.length;
    }
    if ([...base, ...coordination].some((value) => !Number.isFinite(value))) {
      nonFiniteSelectionFacts++;
      return null;
    }
    rawRows.push([...base, ...coordination]);
    coordinationRows.push(coordination);
  }

  if (coordinationEnabled && commitments.length > 0) {
    coordinationNonConstant = [0, 1, 2, 3].some((dimension) =>
      new Set(coordinationRows.map((row) => row[dimension])).size > 1);
  }

  const ranksByDimension = Array.from({ length: DIMENSIONS }, (_, dimension) =>
    tiedPercentileRanks(rawRows.map((row) => row[dimension])));
  let selectedIndex = 0;
  let selectedScore = -Infinity;
  for (let index = 0; index < offers.length; index++) {
    let score = 0;
    for (let dimension = 0; dimension < DIMENSIONS; dimension++) {
      score += weights[dimension] * ranksByDimension[dimension][index];
    }
    if (
      score > selectedScore + EPS
      || (
        Math.abs(score - selectedScore) <= EPS
        && offers[index].candidate.id.localeCompare(offers[selectedIndex].candidate.id) < 0
      )
    ) {
      selectedIndex = index;
      selectedScore = score;
    }
  }
  return {
    offer: offers[selectedIndex],
    score: selectedScore,
    coordinationNonConstant,
    commitmentFactReads,
  };
};

interface FrozenComposition {
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly moverGids: readonly [number, number, number];
  readonly independent: readonly [OffBallAffordance, OffBallAffordance, OffBallAffordance];
  readonly coordinated: readonly [OffBallAffordance, OffBallAffordance, OffBallAffordance];
  readonly changedSelections: number;
  readonly coordinationInformative: boolean;
  readonly firstMoverMatch: boolean;
  readonly commitmentFactReads: number;
}

const constructComposition = (
  match: Match,
  seed: number,
  carrierGid: number,
  movers: readonly number[],
  snapshots: ReadonlyMap<number, PerceptionSnapshot>,
): FrozenComposition | null => {
  if (movers.length !== MOVER_COUNT) return null;
  const carrier = match.allPlayers[carrierGid];
  const profiles = profilesOf(match);
  const offersByPlayer = new Map<number, readonly OffBallAffordance[]>();
  for (const gid of movers) {
    const snapshot = snapshots.get(gid);
    if (!snapshot) return null;
    const evaluated = evaluateOffBallAffordances({
      snapshot,
      playerGid: gid,
      carrierGid,
      attackDir: match.teams[carrier.side].attackDir,
      reachProfiles: profiles,
    });
    if (evaluated === null) return null;
    const offers = eligibleOffers(evaluated);
    if (offers.length < 5 || !offers.some((offer) => offer.candidate.id === 'hold')) return null;
    offersByPlayer.set(gid, offers);
  }

  const independent: OffBallAffordance[] = [];
  const coordinated: OffBallAffordance[] = [];
  const commitments: OffBallOfferCommitment[] = [];
  let coordinationInformative = true;
  let commitmentFactReads = 0;

  for (let index = 0; index < movers.length; index++) {
    const gid = movers[index];
    const offers = offersByPlayer.get(gid)!;
    const weights = preferenceWeights(seed, gid);
    const independentSelection = selectOffer(
      offers, weights, carrier.pos, [], match.simTick, false,
    );
    const coordinatedSelection = selectOffer(
      offers, weights, carrier.pos, commitments, match.simTick, true,
    );
    if (!independentSelection || !coordinatedSelection) return null;
    independent.push(independentSelection.offer);
    coordinated.push(coordinatedSelection.offer);
    if (index > 0 && !coordinatedSelection.coordinationNonConstant) {
      coordinationInformative = false;
    }
    commitmentFactReads += coordinatedSelection.commitmentFactReads;
    const commitment = createOffBallOfferCommitment(
      coordinatedSelection.offer,
      match.simTick,
      match.simTick + COMMITMENT_TICKS,
    );
    if (commitment === null) return null;
    commitments.push(commitment);
  }

  return {
    seed,
    frozen: cloneSimulationState(match),
    carrierGid,
    moverGids: movers as [number, number, number],
    independent: independent as [OffBallAffordance, OffBallAffordance, OffBallAffordance],
    coordinated: coordinated as [OffBallAffordance, OffBallAffordance, OffBallAffordance],
    changedSelections: independent.filter((offer, index) =>
      offer.candidate.id !== coordinated[index].candidate.id).length,
    coordinationInformative,
    firstMoverMatch: independent[0].candidate.id === coordinated[0].candidate.id,
    commitmentFactReads,
  };
};

interface PortfolioGeometry {
  readonly minTargetDistance: number;
  readonly minBearingSeparation: number;
  readonly minArrivalSeparation: number | null;
  readonly minCorridorSeparation: number;
}

const pairGeometry = (
  carrier: Readonly<{ x: number; y: number }>,
  points: readonly Readonly<{ x: number; y: number }>[],
  arrivals?: readonly number[],
): PortfolioGeometry => {
  let minTargetDistance = Infinity;
  let minBearingSeparation = Infinity;
  let minArrivalSeparation = Infinity;
  let minCorridorSeparation = Infinity;
  for (let left = 0; left < points.length; left++) {
    for (let right = left + 1; right < points.length; right++) {
      const a = points[left];
      const b = points[right];
      minTargetDistance = Math.min(minTargetDistance, Math.hypot(a.x - b.x, a.y - b.y));
      const ax = a.x - carrier.x;
      const ay = a.y - carrier.y;
      const bx = b.x - carrier.x;
      const by = b.y - carrier.y;
      if (Math.hypot(ax, ay) > EPS && Math.hypot(bx, by) > EPS) {
        const raw = Math.abs(Math.atan2(ay, ax) - Math.atan2(by, bx)) % (Math.PI * 2);
        minBearingSeparation = Math.min(minBearingSeparation, Math.min(raw, Math.PI * 2 - raw));
      }
      if (arrivals) {
        minArrivalSeparation = Math.min(
          minArrivalSeparation,
          Math.abs(arrivals[left] - arrivals[right]),
        );
      }
      const aClosest = closestPointOnSegment(carrier, b, a);
      const bClosest = closestPointOnSegment(carrier, a, b);
      minCorridorSeparation = Math.min(minCorridorSeparation, Math.min(
        Math.hypot(a.x - aClosest.x, a.y - aClosest.y),
        Math.hypot(b.x - bClosest.x, b.y - bClosest.y),
      ));
    }
  }
  return {
    minTargetDistance,
    minBearingSeparation,
    minArrivalSeparation: arrivals ? minArrivalSeparation : null,
    minCorridorSeparation,
  };
};

interface MovementSummary {
  readonly kind: BranchKind;
  readonly status: MovementStatus;
  readonly initialDistances: readonly number[];
  readonly finalDistances: readonly number[];
  readonly selectedIds: readonly string[];
  readonly actualGeometry: PortfolioGeometry | null;
  readonly targetChanges: number;
  readonly unexpectedActionChanges: number;
  readonly nonFiniteFacts: number;
}

interface MovementBranch {
  readonly match: Match;
  readonly summary: MovementSummary;
}

const runMovementBranch = (
  composition: FrozenComposition,
  kind: BranchKind,
): MovementBranch => {
  const branch = cloneSimulationState(composition.frozen);
  const carrier = branch.allPlayers[composition.carrierGid];
  const movers = composition.moverGids.map((gid) => branch.allPlayers[gid]);
  const offers = kind === 'independent'
    ? composition.independent
    : kind === 'coordinated'
      ? composition.coordinated
      : null;
  const targets = offers?.map((offer) => ({
    x: offer.candidate.point.x,
    y: offer.candidate.point.y,
  })) ?? [];
  const initialDistances = offers?.map((offer, index) => Math.hypot(
    movers[index].pos.x - offer.candidate.point.x,
    movers[index].pos.y - offer.candidate.point.y,
  )) ?? [];
  const carrierRoster = carrier.rosterIdx;
  const moverRosters = movers.map((mover) => mover.rosterIdx);

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  if (offers) {
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
      || movers.some((mover, index) =>
        mover.sentOff || mover.rosterIdx !== moverRosters[index])
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') {
      unexpectedActionChanges++;
      status = 'unexpectedInterventionChange';
      break;
    }
    if (offers) {
      for (let index = 0; index < movers.length; index++) {
        const action = movers[index].action;
        if (action.type !== 'MoveToPoint') {
          unexpectedActionChanges++;
        } else if (
          action.targetPos?.x !== targets[index].x
          || action.targetPos?.y !== targets[index].y
        ) targetChanges++;
      }
      if (targetChanges > 0 || unexpectedActionChanges > 0) {
        status = 'unexpectedInterventionChange';
        break;
      }
    }
  }

  const finalDistances = offers?.map((offer, index) => Math.hypot(
    movers[index].pos.x - offer.candidate.point.x,
    movers[index].pos.y - offer.candidate.point.y,
  )) ?? [];
  return {
    match: branch,
    summary: {
      kind,
      status,
      initialDistances,
      finalDistances,
      selectedIds: offers?.map((offer) => offer.candidate.id) ?? [],
      actualGeometry: status === 'completed'
        ? pairGeometry(carrier.pos, movers.map((mover) => mover.pos))
        : null,
      targetChanges,
      unexpectedActionChanges,
      nonFiniteFacts,
    },
  };
};

const outcomeMap = (): Map<RecordedOutcome, number> => new Map();
const increment = <T>(map: Map<T, number>, key: T): void => {
  map.set(key, (map.get(key) ?? 0) + 1);
};
const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

const movementStatuses = new Map<BranchKind, Map<MovementStatus, number>>([
  ['legacy', new Map()],
  ['independent', new Map()],
  ['coordinated', new Map()],
]);
const outcomes = new Map<BranchKind, Map<RecordedOutcome, number>>([
  ['legacy', outcomeMap()],
  ['independent', outcomeMap()],
  ['coordinated', outcomeMap()],
]);
const coverage = new Map<BranchKind, number>([
  ['legacy', 0],
  ['independent', 0],
  ['coordinated', 0],
]);
const opportunities = new Map<BranchKind, number>([
  ['legacy', 0],
  ['independent', 0],
  ['coordinated', 0],
]);
const plannedGeometry = new Map<Exclude<BranchKind, 'legacy'>, PortfolioGeometry[]>([
  ['independent', []],
  ['coordinated', []],
]);
const actualGeometry = new Map<Exclude<BranchKind, 'legacy'>, PortfolioGeometry[]>([
  ['independent', []],
  ['coordinated', []],
]);

let scannedSeeds = 0;
let acceptedStates = 0;
let jointlyCompleted = 0;
let changedSelectionStates = 0;
let coordinationInformativeStates = 0;
let firstMoverMismatches = 0;
let commitmentFactReads = 0;
let targetSatisfactionCount = 0;
let targetSatisfactionDenominator = 0;
let candidateConstructionFailures = 0;
let perceptionFactRngDraws = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;
let targetChanges = 0;
let unexpectedActionChanges = 0;
let movementNonFinite = 0;
let oracleForceFailures = 0;
let childSeedCollisions = 0;
const childSeeds = new Set<number>();

for (
  let seed = SEED_START;
  seed < SEED_START + MAX_SEEDS && acceptedStates < REQUIRED_STATES;
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
  const latestSnapshots = new Map<number, PerceptionSnapshot>();
  for (const player of match.allPlayers) {
    if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
  }
  let acceptedThisSeed = false;

  while (!match.finished && !acceptedThisSeed) {
    match.step(DT);
    const truth = capturePerceptionTruth(match);
    const rngBeforePerception = (match.rng as unknown as { s: number }).s;
    for (const player of match.allPlayers) {
      if (player.role === 'GK' || player.sentOff) continue;
      latestSnapshots.set(player.gid, perceiveSnapshot(
        truth,
        player.gid,
        AWARENESS,
        seed,
        memories.get(player.gid)!,
      ));
    }
    const rngAfterPerception = (match.rng as unknown as { s: number }).s;
    if (rngBeforePerception !== rngAfterPerception) perceptionFactRngDraws++;

    if (
      match.simTick % SAMPLE_TICKS !== 0
      || match.simTime < 10
      || !beforeAdministrativeBoundary(match)
      || match.phase !== 'playing'
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff || carrier.role === 'GK') continue;

    const possibleMovers: number[] = [];
    const profiles = profilesOf(match);
    for (const player of match.teams[carrier.side].players) {
      if (player === carrier || player.sentOff || player.role === 'GK') continue;
      const snapshot = latestSnapshots.get(player.gid);
      if (!snapshot) continue;
      const offers = evaluateOffBallAffordances({
        snapshot,
        playerGid: player.gid,
        carrierGid: carrier.gid,
        attackDir: match.teams[carrier.side].attackDir,
        reachProfiles: profiles,
      });
      if (!offers) continue;
      const eligible = eligibleOffers(offers);
      if (eligible.length >= 5 && eligible.some((offer) => offer.candidate.id === 'hold')) {
        possibleMovers.push(player.gid);
      }
    }
    if (possibleMovers.length < MOVER_COUNT) continue;
    possibleMovers.sort((leftGid, rightGid) => {
      const left = match.allPlayers[leftGid];
      const right = match.allPlayers[rightGid];
      return left.decisionTimer - right.decisionTimer || leftGid - rightGid;
    });
    const selectedMovers = possibleMovers.slice(0, MOVER_COUNT);
    const composition = constructComposition(
      match,
      seed,
      carrier.gid,
      selectedMovers,
      latestSnapshots,
    );
    if (!composition) {
      candidateConstructionFailures++;
      continue;
    }

    acceptedThisSeed = true;
    acceptedStates++;
    if (composition.changedSelections > 0) changedSelectionStates++;
    if (composition.coordinationInformative) coordinationInformativeStates++;
    if (!composition.firstMoverMatch) firstMoverMismatches++;
    commitmentFactReads += composition.commitmentFactReads;
    for (const kind of ['independent', 'coordinated'] as const) {
      const offers = composition[kind];
      plannedGeometry.get(kind)!.push(pairGeometry(
        composition.frozen.allPlayers[composition.carrierGid].pos,
        offers.map((offer) => offer.candidate.point),
        offers.map((offer) => offer.selfArrival),
      ));
    }

    const branches = new Map<BranchKind, MovementBranch>();
    for (const kind of ['legacy', 'independent', 'coordinated'] as const) {
      try {
        const first = runMovementBranch(composition, kind);
        const second = runMovementBranch(composition, kind);
        if (JSON.stringify(first.summary) !== JSON.stringify(second.summary)) {
          deterministicDifferences++;
        }
        branches.set(kind, first);
        increment(movementStatuses.get(kind)!, first.summary.status);
        targetChanges += first.summary.targetChanges;
        unexpectedActionChanges += first.summary.unexpectedActionChanges;
        movementNonFinite += first.summary.nonFiniteFacts;
        if (kind !== 'legacy' && first.summary.status === 'completed') {
          actualGeometry.get(kind)!.push(first.summary.actualGeometry!);
          const selected = composition[kind];
          for (let index = 0; index < MOVER_COUNT; index++) {
            const initialDistance = first.summary.initialDistances[index];
            const finalDistance = first.summary.finalDistances[index];
            const hold = selected[index].candidate.id === 'hold';
            targetSatisfactionDenominator++;
            if (hold ? finalDistance <= 0.5 : initialDistance - finalDistance >= 0.25) {
              targetSatisfactionCount++;
            }
          }
        }
      } catch {
        cloneFailures++;
      }
    }

    if ([...branches.values()].some((branch) => branch.summary.status !== 'completed')) continue;
    if (branches.size !== 3) continue;
    jointlyCompleted++;

    for (let replicate = 0; replicate < REPLICATES; replicate++) {
      const intendedByBranch = new Map<BranchKind, number>([
        ['legacy', 0],
        ['independent', 0],
        ['coordinated', 0],
      ]);
      for (let moverOrdinal = 0; moverOrdinal < MOVER_COUNT; moverOrdinal++) {
        const receiverGid = composition.moverGids[moverOrdinal];
        const childSeed = hashSeed(
          D1_NAMESPACE,
          seed,
          composition.frozen.simTick,
          moverOrdinal,
          replicate,
        );
        if (childSeeds.has(childSeed)) childSeedCollisions++;
        childSeeds.add(childSeed);

        for (const kind of ['legacy', 'independent', 'coordinated'] as const) {
          const input = {
            frozen: branches.get(kind)!.match,
            passerGid: composition.carrierGid,
            targetGid: receiverGid,
            side: composition.frozen.allPlayers[composition.carrierGid].side as Side,
            branch: kind === 'legacy' ? 'chosen' as const : 'alternative' as const,
            childRngState: childSeed,
            includeTransitionDiagnostic: false,
          };
          const first = runOracleV2Branch(input);
          const second = runOracleV2Branch(input);
          if (JSON.stringify(first) !== JSON.stringify(second)) deterministicDifferences++;
          if (!first.ok || first.record.firstTransition.status === 'forceFailure') {
            oracleForceFailures++;
            continue;
          }
          opportunities.set(kind, opportunities.get(kind)! + 1);
          const outcome: RecordedOutcome = first.record.firstTransition.status === 'censored'
            ? 'censored'
            : first.record.firstTransition.outcome!;
          increment(outcomes.get(kind)!, outcome);
          if (outcome === 'intendedReception') {
            intendedByBranch.set(kind, intendedByBranch.get(kind)! + 1);
          }
        }
      }
      for (const kind of ['legacy', 'independent', 'coordinated'] as const) {
        if (intendedByBranch.get(kind)! > 0) coverage.set(kind, coverage.get(kind)! + 1);
      }
    }
  }
}

const statusCount = (kind: BranchKind, status: MovementStatus): number =>
  movementStatuses.get(kind)!.get(status) ?? 0;
const outcomeCount = (kind: BranchKind, outcome: RecordedOutcome): number =>
  outcomes.get(kind)!.get(outcome) ?? 0;
const portfolioReplicates = jointlyCompleted * REPLICATES;
const coverageRate = (kind: BranchKind): number =>
  coverage.get(kind)! / Math.max(1, portfolioReplicates);
const outcomeRate = (kind: BranchKind, outcome: RecordedOutcome): number =>
  outcomeCount(kind, outcome) / Math.max(1, opportunities.get(kind)!);
const completionRates = (['legacy', 'independent', 'coordinated'] as const).map((kind) =>
  statusCount(kind, 'completed') / Math.max(1, acceptedStates));
const maxCompletionDifference = Math.max(...completionRates) - Math.min(...completionRates);
const coordinatedIndependentCoverageEdge = coverageRate('coordinated') - coverageRate('independent');
const coordinatedLegacyCoverageEdge = coverageRate('coordinated') - coverageRate('legacy');
const opponentEdge = outcomeRate('coordinated', 'opponentInterception')
  - outcomeRate('independent', 'opponentInterception');
const deadBallEdge = outcomeRate('coordinated', 'deadBall')
  - outcomeRate('independent', 'deadBall');
const targetSatisfactionRate = targetSatisfactionCount / Math.max(1, targetSatisfactionDenominator);

const meanGeometry = (values: readonly PortfolioGeometry[]) => ({
  minTargetDistance: mean(values.map((value) => value.minTargetDistance)),
  minBearingSeparation: mean(values.map((value) => value.minBearingSeparation)),
  minArrivalSeparation: mean(values.map((value) => value.minArrivalSeparation ?? 0)),
  minCorridorSeparation: mean(values.map((value) => value.minCorridorSeparation)),
});

const enoughOpportunities = (['legacy', 'independent', 'coordinated'] as const)
  .every((kind) => opportunities.get(kind)! >= 96 * MOVER_COUNT * REPLICATES);
const gates = {
  eligibleStates: acceptedStates === REQUIRED_STATES,
  scannedSeeds: scannedSeeds <= MAX_SEEDS,
  jointlyCompleted: jointlyCompleted >= 96,
  oracleOpportunitySupport: enoughOpportunities,
  completionBalance: maxCompletionDifference <= 0.05,
  selectionConstruction: selectionFailures === 0 && nonFiniteSelectionFacts === 0,
  perceptionRngPurity: perceptionFactRngDraws === 0,
  cloneAndOracleValidity: cloneFailures === 0 && oracleForceFailures === 0,
  interventionValidity: targetChanges === 0 && unexpectedActionChanges === 0,
  finiteMovement: movementNonFinite === 0,
  childSeedUniqueness: childSeedCollisions === 0,
  deterministicReruns: deterministicDifferences === 0,
  selectionChanges: changedSelectionStates >= acceptedStates * 0.5,
  targetSatisfaction: targetSatisfactionRate >= 0.95,
  coordinationFactSupport: coordinationInformativeStates >= acceptedStates * 0.95,
  firstMoverAblation: firstMoverMismatches === 0,
  primaryCoverageEdge: coordinatedIndependentCoverageEdge >= 0.05,
  legacyNonInferiority: coordinatedLegacyCoverageEdge >= -0.02,
  opponentNonRegression: opponentEdge <= 0.05,
  deadBallNonRegression: deadBallEdge <= 0.05,
};
const pass = Object.values(gates).every(Boolean);

const mapObject = <K extends string>(map: ReadonlyMap<K, number>): Record<K, number> =>
  Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right))) as Record<K, number>;
const report = {
  authority: 'D1 decentralised offer-loop composition lab',
  seedStart: SEED_START,
  requiredStates: REQUIRED_STATES,
  scannedSeeds,
  acceptedStates,
  jointlyCompleted,
  composition: {
    changedSelectionStates,
    coordinationInformativeStates,
    firstMoverMismatches,
    commitmentFactReads,
    selectionFailures,
    nonFiniteSelectionFacts,
  },
  movement: {
    statuses: Object.fromEntries((['legacy', 'independent', 'coordinated'] as const)
      .map((kind) => [kind, mapObject(movementStatuses.get(kind)!)])),
    maxCompletionDifference,
    targetSatisfactionCount,
    targetSatisfactionDenominator,
    targetSatisfactionRate,
    plannedIndependent: meanGeometry(plannedGeometry.get('independent')!),
    plannedCoordinated: meanGeometry(plannedGeometry.get('coordinated')!),
    actualIndependent: meanGeometry(actualGeometry.get('independent')!),
    actualCoordinated: meanGeometry(actualGeometry.get('coordinated')!),
  },
  transitions: Object.fromEntries((['legacy', 'independent', 'coordinated'] as const)
    .map((kind) => [kind, {
      opportunities: opportunities.get(kind),
      outcomes: mapObject(outcomes.get(kind)!),
      coverage: coverage.get(kind),
      coverageRate: coverageRate(kind),
    }])),
  effects: {
    coordinatedIndependentCoverageEdge,
    coordinatedLegacyCoverageEdge,
    opponentEdge,
    deadBallEdge,
  },
  validity: {
    candidateConstructionFailures,
    perceptionFactRngDraws,
    cloneFailures,
    deterministicDifferences,
    targetChanges,
    unexpectedActionChanges,
    movementNonFinite,
    oracleForceFailures,
    childSeedCollisions,
  },
  gates,
  pass,
};

const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');

console.log('D1 DECENTRALISED OFFER-LOOP COMPOSITION LAB');
console.log(
  `accepted ${acceptedStates}/${REQUIRED_STATES} · scanned seeds ${scannedSeeds}/${MAX_SEEDS}`
  + ` · jointly completed ${jointlyCompleted}`,
);
console.log(
  `changed selections ${changedSelectionStates}/${acceptedStates} (${pct(changedSelectionStates, acceptedStates)})`
  + ` · coordination informative ${coordinationInformativeStates}/${acceptedStates}`
  + ` · first-mover mismatches ${firstMoverMismatches}`,
);
console.log(
  `target satisfaction ${targetSatisfactionCount}/${targetSatisfactionDenominator}`
  + ` (${pct(targetSatisfactionCount, targetSatisfactionDenominator)})`,
);
for (const kind of ['legacy', 'independent', 'coordinated'] as const) {
  console.log(
    `  ${kind.padEnd(11)} movement ${JSON.stringify(mapObject(movementStatuses.get(kind)!))}`,
  );
  console.log(
    `               opportunities ${opportunities.get(kind)}`
    + ` · outcomes ${JSON.stringify(mapObject(outcomes.get(kind)!))}`
    + ` · coverage ${coverage.get(kind)}/${portfolioReplicates}`
    + ` (${pct(coverage.get(kind)!, portfolioReplicates)})`,
  );
}
console.log(
  `PRIMARY C-I coverage ${(coordinatedIndependentCoverageEdge * 100).toFixed(1)}pp`
  + ` · C-L ${(coordinatedLegacyCoverageEdge * 100).toFixed(1)}pp`
  + ` · opponent C-I ${(opponentEdge * 100).toFixed(1)}pp`
  + ` · dead C-I ${(deadBallEdge * 100).toFixed(1)}pp`,
);
console.log(`planned geometry I ${JSON.stringify(report.movement.plannedIndependent)}`);
console.log(`planned geometry C ${JSON.stringify(report.movement.plannedCoordinated)}`);
console.log(`actual geometry I ${JSON.stringify(report.movement.actualIndependent)}`);
console.log(`actual geometry C ${JSON.stringify(report.movement.actualCoordinated)}`);
console.log(`validity ${JSON.stringify(report.validity)}`);
console.log(`canonical sha256 ${digest}`);
console.log('gates:');
for (const [name, value] of Object.entries(gates)) {
  console.log(`  ${name}: ${value ? 'PASS' : 'FAIL'}`);
}
console.log(`verdict ${pass ? 'PASS' : 'FAIL — STOP'}`);

if (!pass) process.exitCode = 1;
