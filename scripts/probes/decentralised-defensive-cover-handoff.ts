// D-COVER-0 DECENTRALISED DEFENSIVE COVER HANDOFF LAB (offline only).
// Authority: docs/world-model/DECENTRALISED-DEFENSIVE-COVER-HANDOFF.md
import { createHash } from 'node:crypto';
import {
  createDefensiveMovementCommitment,
  evaluateDefensiveCoverCoordination,
  type DefensiveCoverCoordinationFacts,
  type DefensiveMovementCommitment,
} from '../../src/ai/defensiveCoordination';
import {
  evaluateOffBallAffordances,
  generateOffBallCandidates,
  type OffBallAffordance,
  type OffBallCandidatePoint,
} from '../../src/ai/offBallAffordance';
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  perceiveSnapshot,
  type ObservedPlayer,
  type PerceptionMemory,
  type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import {
  estimateReach,
  type KnownReachProfile,
  type ReachState,
} from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type FirstTransitionOutcome,
} from './oracle-v2';

const REQUIRED_STATES = Number(process.argv[2] ?? 64);
const SEED_START = Number(process.argv[3] ?? 62_000);
const MAX_SEEDS = 128;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const MOVE_STEPS = Math.round(0.75 / DT);
const REPLICATES = 4;
const DCOVER_NAMESPACE = 0xdc0e0001;
const EPS = 1e-9;

const MIN_SHORT_OFFERS = 4;
const MIN_NON_HOLD = 6;
const TARGET_PROGRESS_METRES = 0.25;
const ARRIVAL_HANDOFF_SECONDS = 0.10;
const TRANSITION_STEP = 0.25;

type BranchStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';

type RecordedOutcome = FirstTransitionOutcome | 'censored';
type Outlet = 'a' | 'b';

interface DefenderOption {
  readonly gid: number;
  readonly snapshot: PerceptionSnapshot;
  readonly observed: ObservedPlayer;
  readonly candidates: readonly OffBallCandidatePoint[];
  readonly etaA: number;
  readonly etaB: number;
}

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly aGid: number;
  readonly bGid: number;
  readonly aOffer: OffBallAffordance;
  readonly d1: DefenderOption;
  readonly d2: DefenderOption;
  readonly profiles: ReadonlyMap<number, KnownReachProfile>;
}

interface TransitionTensor {
  readonly a: Record<RecordedOutcome, number>;
  readonly b: Record<RecordedOutcome, number>;
  readonly opportunities: number;
  readonly forceFailures: number;
  readonly deterministicDifferences: number;
}

interface PhysicalPairResponse {
  readonly d1Candidate: OffBallCandidatePoint;
  readonly d2Candidate: OffBallCandidatePoint;
  readonly commitment: DefensiveMovementCommitment | null;
  readonly coordination: DefensiveCoverCoordinationFacts | null;
  readonly match: Match;
  readonly status: BranchStatus;
  readonly signature: string;
  readonly actionChanges: number;
  readonly targetChanges: number;
  readonly nonFinite: number;
  readonly d1InitialTargetDistance: number;
  readonly d2InitialTargetDistance: number;
  readonly d1FinalTargetDistance: number | null;
  readonly d2FinalTargetDistance: number | null;
  readonly d1EtaA: number | null;
  readonly d1EtaB: number | null;
  readonly d2EtaA: number | null;
  readonly d2EtaB: number | null;
  readonly d1Travel: number | null;
  readonly d2Travel: number | null;
  readonly pairDistance: number | null;
  readonly transitions: TransitionTensor | null;
}

interface D1DilemmaRecord {
  readonly d1CandidateId: string;
  readonly exposedOutlet: Outlet;
  readonly commitmentExposedOutlet: Outlet | null;
  readonly handoffCandidateIds: readonly string[];
  readonly transitionCandidateIds: readonly string[];
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly aCandidateId: string;
  readonly d1Gid: number;
  readonly d2Gid: number;
  readonly exposedDirections: readonly Outlet[];
  readonly dilemmas: readonly D1DilemmaRecord[];
}

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

const reachState = (player: ObservedPlayer, profile: KnownReachProfile): ReachState => ({
  pos: player.pos,
  vel: player.vel,
  bodyDir: player.bodyDir,
  topSpeed: profile.topSpeed,
  accel: profile.accel,
  attrs: { dribbling: profile.dribbling ?? 0.5 },
});

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

const shortOffers = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  offers
    .filter((offer) =>
      offer.candidate.id !== 'hold'
      && offer.offsideMargin <= 0
      && Math.abs(offer.candidate.sampleHorizon - 0.75) <= EPS
      && finiteOffer(offer))
    .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

const defenderCandidates = (
  observed: ObservedPlayer,
  profile: KnownReachProfile,
  attackDir: 1 | -1,
): readonly OffBallCandidatePoint[] => generateOffBallCandidates(observed, profile, attackDir)
  .filter((candidate) =>
    candidate.id === 'hold' || Math.abs(candidate.sampleHorizon - 0.75) <= EPS)
  .sort((left, right) => left.id.localeCompare(right.id));

const selectDefenders = (
  match: Match,
  snapshots: ReadonlyMap<number, PerceptionSnapshot>,
  profiles: ReadonlyMap<number, KnownReachProfile>,
  attackingSide: Side,
  carrierGid: number,
  aGid: number,
  bGid: number,
  aPoint: Readonly<{ x: number; y: number }>,
): readonly [DefenderOption, DefenderOption] | null => {
  const options: DefenderOption[] = [];
  for (const defender of match.teams[1 - attackingSide].players) {
    if (defender.role === 'GK' || defender.sentOff) continue;
    const snapshot = snapshots.get(defender.gid);
    const profile = profiles.get(defender.gid);
    const observed = snapshot?.players.find((entry) => entry.gid === defender.gid);
    const observedB = snapshot?.players.find((entry) => entry.gid === bGid);
    if (!snapshot || !profile || !observed || !observedB) continue;
    if (!snapshot.players.some((entry) => entry.gid === carrierGid)) continue;
    if (!snapshot.players.some((entry) => entry.gid === aGid)) continue;
    const candidates = defenderCandidates(observed, profile, match.teams[1 - attackingSide].attackDir);
    if (
      candidates.filter((candidate) => candidate.id !== 'hold').length < MIN_NON_HOLD
      || !candidates.some((candidate) => candidate.id === 'hold')
    ) continue;
    const state = reachState(observed, profile);
    options.push({
      gid: defender.gid,
      snapshot,
      observed,
      candidates,
      etaA: estimateReach(state, aPoint).eta,
      etaB: estimateReach(state, observedB.pos).eta,
    });
  }
  if (options.length < 2) return null;
  options.sort((left, right) => left.etaA - right.etaA || left.gid - right.gid);
  const d1 = options[0];
  const d2Options = options.slice(1).filter((entry) =>
    entry.snapshot.players.some((player) => player.gid === d1.gid));
  d2Options.sort((left, right) =>
    Math.min(left.etaA, left.etaB) - Math.min(right.etaA, right.etaB)
    || left.gid - right.gid);
  return d2Options.length > 0 ? [d1, d2Options[0]] : null;
};

const stableMap = (map: ReadonlyMap<number, number>): readonly (readonly [number, number])[] =>
  [...map.entries()].sort(([left], [right]) => left - right);

const physicalSignature = (match: Match): string => JSON.stringify({
  simTick: match.simTick,
  simTime: match.simTime,
  phase: match.phase,
  possessionSide: match.possessionSide,
  ownerGid: match.ball.owner?.gid ?? null,
  ball: {
    pos: match.ball.pos,
    vel: match.ball.vel,
    z: match.ball.z,
    vz: match.ball.vz,
    spin: match.ball.spin,
  },
  rng: (match.rng as unknown as { s: number }).s,
  players: match.allPlayers.map((player) => ({
    gid: player.gid,
    rosterIdx: player.rosterIdx,
    sentOff: player.sentOff,
    pos: player.pos,
    vel: player.vel,
    heading: player.heading,
    bodyDir: player.bodyDir,
    desiredVel: player.desiredVel,
    decisionTimer: player.decisionTimer,
    action: player.action,
  })),
  teams: match.teams.map((entry) => ({
    side: entry.side,
    mode: entry.mode,
    brainTimer: entry.brainTimer,
    chasers: [...entry.chasers].sort((left, right) => left - right),
    marks: stableMap(entry.marks),
    runners: [...entry.runners].sort((left, right) => left - right),
    arriver: entry.arriver,
    overlapper: entry.overlapper,
  })),
});

const emptyOutcomes = (): Record<RecordedOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
  censored: 0,
});

const childSeeds = new Map<number, string>();
let childSeedCollisions = 0;

const childSeedFor = (state: FrozenState, target: Outlet, replicate: number): number => {
  const key = `${state.key}:${target}:${replicate}`;
  const seed = hashSeed(
    DCOVER_NAMESPACE,
    state.seed,
    state.frozen.simTick,
    state.carrierGid,
    state.aGid,
    state.bGid,
    target === 'a' ? 0 : 1,
    replicate,
  );
  const previous = childSeeds.get(seed);
  if (previous !== undefined && previous !== key) childSeedCollisions++;
  else childSeeds.set(seed, key);
  return seed;
};

const runTransitions = (
  match: Match,
  state: FrozenState,
  reverse = false,
): TransitionTensor => {
  const result: TransitionTensor = {
    a: emptyOutcomes(),
    b: emptyOutcomes(),
    opportunities: 0,
    forceFailures: 0,
    deterministicDifferences: 0,
  };
  const mutable = result as {
    a: Record<RecordedOutcome, number>;
    b: Record<RecordedOutcome, number>;
    opportunities: number;
    forceFailures: number;
    deterministicDifferences: number;
  };
  const tasks: Array<{ outlet: Outlet; gid: number; replicate: number }> = [];
  for (const [outlet, gid] of [['a', state.aGid], ['b', state.bGid]] as const) {
    for (let replicate = 0; replicate < REPLICATES; replicate++) {
      tasks.push({ outlet, gid, replicate });
    }
  }
  if (reverse) tasks.reverse();
  for (const task of tasks) {
    const input = {
      frozen: match,
      passerGid: state.carrierGid,
      targetGid: task.gid,
      side: match.allPlayers[state.carrierGid].side as Side,
      branch: 'alternative' as const,
      childRngState: childSeedFor(state, task.outlet, task.replicate),
      includeTransitionDiagnostic: false,
    };
    const first = runOracleV2Branch(input);
    const second = runOracleV2Branch(input);
    if (JSON.stringify(first) !== JSON.stringify(second)) mutable.deterministicDifferences++;
    if (!first.ok || first.record.firstTransition.status === 'forceFailure') {
      mutable.forceFailures++;
      continue;
    }
    mutable.opportunities++;
    const outcome: RecordedOutcome = first.record.firstTransition.status === 'censored'
      ? 'censored'
      : first.record.firstTransition.outcome!;
    mutable[task.outlet][outcome]++;
  }
  return result;
};

const executePair = (
  state: FrozenState,
  d1Candidate: OffBallCandidatePoint,
  d2Candidate: OffBallCandidatePoint,
  annotate: boolean,
): PhysicalPairResponse => {
  const branch = cloneSimulationState(state.frozen);
  const carrier = branch.allPlayers[state.carrierGid];
  const a = branch.allPlayers[state.aGid];
  const b = branch.allPlayers[state.bGid];
  const d1 = branch.allPlayers[state.d1.gid];
  const d2 = branch.allPlayers[state.d2.gid];
  const roster = new Map([carrier, a, b, d1, d2].map((player) => [player.gid, player.rosterIdx]));
  const initialD1 = { x: d1.pos.x, y: d1.pos.y };
  const initialD2 = { x: d2.pos.x, y: d2.pos.y };
  const fixedA = { x: state.aOffer.candidate.point.x, y: state.aOffer.candidate.point.y };
  const fixedB = { x: b.pos.x, y: b.pos.y };
  const fixedD1 = { x: d1Candidate.point.x, y: d1Candidate.point.y };
  const fixedD2 = { x: d2Candidate.point.x, y: d2Candidate.point.y };
  const d1InitialTargetDistance = Math.hypot(d1.pos.x - fixedD1.x, d1.pos.y - fixedD1.y);
  const d2InitialTargetDistance = Math.hypot(d2.pos.x - fixedD2.x, d2.pos.y - fixedD2.y);

  const d1Profile = state.profiles.get(state.d1.gid)!;
  const d1Arrival = estimateReach(reachState(state.d1.observed, d1Profile), fixedD1).eta;
  const commitment = createDefensiveMovementCommitment({
    player: state.d1.observed,
    observedCarrierGid: state.carrierGid,
    candidate: d1Candidate,
    arrivalTime: d1Arrival,
    committedTick: state.frozen.simTick,
    validUntilTick: state.frozen.simTick + MOVE_STEPS,
  });
  const commitmentBefore = commitment === null ? null : JSON.stringify(commitment);
  const candidateBefore = JSON.stringify(d2Candidate);
  const coordination = annotate && commitment !== null
    ? evaluateDefensiveCoverCoordination({
      snapshot: state.d2.snapshot,
      playerGid: state.d2.gid,
      outletAGid: state.aGid,
      outletBGid: state.bGid,
      candidate: d2Candidate,
      commitment,
      reachProfiles: state.profiles,
      currentTick: state.frozen.simTick,
    })
    : null;
  if (
    commitmentBefore !== (commitment === null ? null : JSON.stringify(commitment))
    || candidateBefore !== JSON.stringify(d2Candidate)
  ) coordinationInputMutations++;

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  a.action = { type: 'MoveToPoint', targetPos: fixedA, scores: [] };
  a.decisionTimer = Number.POSITIVE_INFINITY;
  b.action = { type: 'MoveToPoint', targetPos: fixedB, scores: [] };
  b.decisionTimer = Number.POSITIVE_INFINITY;
  d1.action = { type: 'MoveToPoint', targetPos: fixedD1, scores: [] };
  d1.decisionTimer = Number.POSITIVE_INFINITY;
  d2.action = { type: 'MoveToPoint', targetPos: fixedD2, scores: [] };
  d2.decisionTimer = Number.POSITIVE_INFINITY;

  let status: BranchStatus = 'completed';
  let actionChanges = 0;
  let targetChanges = 0;
  let nonFinite = 0;
  for (let step = 0; step < MOVE_STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    if ([
      branch.ball.pos.x, branch.ball.pos.y,
      ...[carrier, a, b, d1, d2].flatMap((player) => [
        player.pos.x, player.pos.y, player.vel.x, player.vel.y,
      ]),
    ].some((value) => !Number.isFinite(value))) nonFinite++;
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
    if ([carrier, a, b, d1, d2].some((player) =>
      player.sentOff || player.rosterIdx !== roster.get(player.gid))) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') actionChanges++;
    for (const [player, target] of [
      [a, fixedA], [b, fixedB], [d1, fixedD1], [d2, fixedD2],
    ] as const) {
      if (player.action.type !== 'MoveToPoint') actionChanges++;
      else if (
        player.action.targetPos?.x !== target.x
        || player.action.targetPos?.y !== target.y
      ) {
        targetChanges++;
      }
    }
    if (actionChanges > 0 || targetChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  let d1FinalTargetDistance: number | null = null;
  let d2FinalTargetDistance: number | null = null;
  let d1EtaA: number | null = null;
  let d1EtaB: number | null = null;
  let d2EtaA: number | null = null;
  let d2EtaB: number | null = null;
  let d1Travel: number | null = null;
  let d2Travel: number | null = null;
  let pairDistance: number | null = null;
  let transitions: TransitionTensor | null = null;
  if (status === 'completed') {
    d1FinalTargetDistance = Math.hypot(d1.pos.x - fixedD1.x, d1.pos.y - fixedD1.y);
    d2FinalTargetDistance = Math.hypot(d2.pos.x - fixedD2.x, d2.pos.y - fixedD2.y);
    const liveProfiles = profilesOf(branch);
    const liveReach = (gid: number): ReachState => {
      const player = branch.allPlayers[gid];
      const profile = liveProfiles.get(gid)!;
      return {
        pos: player.pos,
        vel: player.vel,
        bodyDir: player.bodyDir,
        topSpeed: profile.topSpeed,
        accel: profile.accel,
        attrs: { dribbling: profile.dribbling ?? 0.5 },
      };
    };
    d1EtaA = estimateReach(liveReach(d1.gid), a.pos).eta;
    d1EtaB = estimateReach(liveReach(d1.gid), b.pos).eta;
    d2EtaA = estimateReach(liveReach(d2.gid), a.pos).eta;
    d2EtaB = estimateReach(liveReach(d2.gid), b.pos).eta;
    d1Travel = Math.hypot(d1.pos.x - initialD1.x, d1.pos.y - initialD1.y);
    d2Travel = Math.hypot(d2.pos.x - initialD2.x, d2.pos.y - initialD2.y);
    pairDistance = Math.hypot(d1.pos.x - d2.pos.x, d1.pos.y - d2.pos.y);
    transitions = runTransitions(branch, state);
  }

  return {
    d1Candidate,
    d2Candidate,
    commitment,
    coordination,
    match: branch,
    status,
    signature: physicalSignature(branch),
    actionChanges,
    targetChanges,
    nonFinite,
    d1InitialTargetDistance,
    d2InitialTargetDistance,
    d1FinalTargetDistance,
    d2FinalTargetDistance,
    d1EtaA,
    d1EtaB,
    d2EtaA,
    d2EtaB,
    d1Travel,
    d2Travel,
    pairDistance,
    transitions,
  };
};

const opponentRate = (tensor: TransitionTensor, outlet: Outlet): number =>
  tensor[outlet].opponentInterception / REPLICATES;

const finiteResponse = (response: PhysicalPairResponse): boolean => [
  response.d1FinalTargetDistance,
  response.d2FinalTargetDistance,
  response.d1EtaA,
  response.d1EtaB,
  response.d2EtaA,
  response.d2EtaB,
  response.d1Travel,
  response.d2Travel,
  response.pairDistance,
].every((value) => value !== null && Number.isFinite(value));

const responseKey = (d1: OffBallCandidatePoint, d2: OffBallCandidatePoint): string =>
  `${d1.id}|${d2.id}`;

const increment = <K>(map: Map<K, number>, key: K): void => {
  map.set(key, (map.get(key) ?? 0) + 1);
};

let scannedSeeds = 0;
let acceptedStates = 0;
let enumeratedBranches = 0;
let completedBranches = 0;
let validCommitments = 0;
let commitmentAttempts = 0;
let coordinationFacts = 0;
let d1ProgressPass = 0;
let d1ProgressDenominator = 0;
let d2ProgressPass = 0;
let d2ProgressDenominator = 0;
let oracleOpportunities = 0;
let expectedOracleOpportunities = 0;
let oracleForceFailures = 0;
let oracleDeterministicDifferences = 0;
let physicalDeterministicDifferences = 0;
let annotationPhysicsDifferences = 0;
let coordinationInputMutations = 0;
let perceptionRngChanges = 0;
let actionChanges = 0;
let targetChanges = 0;
let nonFiniteFacts = 0;
let cloneFailures = 0;
let candidateConstructionFailures = 0;
let responseOrderDifferences = 0;
let childOrderDifferences = 0;
let childOrderControlUsed = false;
let nonHoldD1Responses = 0;
let d1Dilemmas = 0;
let d1DilemmasWithHandoff = 0;
let physicalHandoffs = 0;
let transitionHandoffs = 0;
let commitmentDilemmaMatches = 0;
let commitmentDilemmaSupported = 0;
const statesWithBothDirections = new Set<string>();
const statesWithPhysicalHandoff = new Set<string>();
const statesWithTransitionHandoff = new Set<string>();
const statuses = new Map<BranchStatus, number>();
const records: StateRecord[] = [];

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
  const snapshots = new Map<number, PerceptionSnapshot>();
  for (const player of match.allPlayers) {
    if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
  }
  let acceptedThisSeed = false;

  while (!match.finished && !acceptedThisSeed) {
    match.step(DT);
    const truth = capturePerceptionTruth(match);
    const rngBefore = (match.rng as unknown as { s: number }).s;
    for (const player of match.allPlayers) {
      if (player.role === 'GK' || player.sentOff) continue;
      snapshots.set(player.gid, perceiveSnapshot(
        truth, player.gid, AWARENESS, seed, memories.get(player.gid)!,
      ));
    }
    const rngAfter = (match.rng as unknown as { s: number }).s;
    if (rngBefore !== rngAfter) perceptionRngChanges++;

    if (
      match.simTick % SAMPLE_TICKS !== 0
      || match.simTime < 10
      || !beforeAdministrativeBoundary(match)
      || match.phase !== 'playing'
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff || carrier.role === 'GK') continue;
    const profiles = profilesOf(match);
    const offersByActor = new Map<number, readonly OffBallAffordance[]>();
    for (const attacker of match.teams[carrier.side].players) {
      if (attacker === carrier || attacker.sentOff || attacker.role === 'GK') continue;
      const snapshot = snapshots.get(attacker.gid);
      if (!snapshot) continue;
      const offers = evaluateOffBallAffordances({
        snapshot,
        playerGid: attacker.gid,
        carrierGid: carrier.gid,
        attackDir: match.teams[carrier.side].attackDir,
        reachProfiles: profiles,
      });
      if (!offers) continue;
      const short = shortOffers(offers);
      if (short.length >= MIN_SHORT_OFFERS) offersByActor.set(attacker.gid, short);
    }
    const attackerGids = [...offersByActor.keys()].sort((left, right) => left - right);
    if (attackerGids.length < 2) continue;
    const [aGid, bGid] = attackerGids;
    const offers = offersByActor.get(aGid)!;
    const offerIndex = hashSeed(seed, match.simTick, carrier.gid, aGid, bGid) % offers.length;
    const aOffer = offers[offerIndex];
    const defenders = selectDefenders(
      match, snapshots, profiles, carrier.side, carrier.gid, aGid, bGid, aOffer.candidate.point,
    );
    if (!defenders) {
      candidateConstructionFailures++;
      continue;
    }
    const state: FrozenState = {
      key: `${seed}:${match.simTick}:${carrier.gid}:${aGid}:${bGid}`,
      seed,
      frozen: cloneSimulationState(match),
      carrierGid: carrier.gid,
      aGid,
      bGid,
      aOffer,
      d1: defenders[0],
      d2: defenders[1],
      profiles,
    };
    acceptedThisSeed = true;
    acceptedStates++;

    const responses = new Map<string, PhysicalPairResponse>();
    for (const d1Candidate of state.d1.candidates) {
      for (const d2Candidate of state.d2.candidates) {
        enumeratedBranches++;
        commitmentAttempts++;
        try {
          const response = executePair(state, d1Candidate, d2Candidate, true);
          const replay = executePair(state, d1Candidate, d2Candidate, false);
          if (response.signature !== replay.signature) {
            physicalDeterministicDifferences++;
            annotationPhysicsDifferences++;
          }
          responses.set(responseKey(d1Candidate, d2Candidate), response);
          increment(statuses, response.status);
          actionChanges += response.actionChanges;
          targetChanges += response.targetChanges;
          nonFiniteFacts += response.nonFinite;
          if (response.commitment !== null) validCommitments++;
          if (response.coordination !== null) coordinationFacts++;
          if (response.status === 'completed') {
            completedBranches++;
            if (!finiteResponse(response)) nonFiniteFacts++;
            expectedOracleOpportunities += REPLICATES * 2;
            oracleOpportunities += response.transitions!.opportunities;
            oracleForceFailures += response.transitions!.forceFailures;
            oracleDeterministicDifferences += response.transitions!.deterministicDifferences;
          }
        } catch {
          cloneFailures++;
        }
      }
    }

    const holdD1 = state.d1.candidates.find((candidate) => candidate.id === 'hold')!;
    const holdD2 = state.d2.candidates.find((candidate) => candidate.id === 'hold')!;
    const hold = responses.get(responseKey(holdD1, holdD2));
    const dilemmas: D1DilemmaRecord[] = [];
    const stateDirections = new Set<Outlet>();

    for (const d1Candidate of state.d1.candidates) {
      if (d1Candidate.id === 'hold') continue;
      nonHoldD1Responses++;
      const solo = responses.get(responseKey(d1Candidate, holdD2));
      if (!hold || !solo || hold.status !== 'completed' || solo.status !== 'completed') continue;
      const improveA = hold.d1EtaA! - solo.d1EtaA!;
      const improveB = hold.d1EtaB! - solo.d1EtaB!;
      let exposed: Outlet | null = null;
      if (improveA >= ARRIVAL_HANDOFF_SECONDS && improveB <= -ARRIVAL_HANDOFF_SECONDS) exposed = 'b';
      if (improveB >= ARRIVAL_HANDOFF_SECONDS && improveA <= -ARRIVAL_HANDOFF_SECONDS) exposed = 'a';
      if (exposed === null) continue;
      d1Dilemmas++;
      stateDirections.add(exposed);
      const commitmentExposed = solo.coordination?.relativelyExposedOutlet ?? null;
      if (commitmentExposed !== null) {
        commitmentDilemmaSupported++;
        if (commitmentExposed === exposed) commitmentDilemmaMatches++;
      }

      const handoffCandidateIds: string[] = [];
      const transitionCandidateIds: string[] = [];
      for (const d2Candidate of state.d2.candidates) {
        if (d2Candidate.id === 'hold') continue;
        const response = responses.get(responseKey(d1Candidate, d2Candidate));
        if (!response || response.status !== 'completed') continue;
        const soloEta = exposed === 'a' ? solo.d2EtaA! : solo.d2EtaB!;
        const responseEta = exposed === 'a' ? response.d2EtaA! : response.d2EtaB!;
        const holdDistanceToCandidate = Math.hypot(
          solo.match.allPlayers[state.d2.gid].pos.x - d2Candidate.point.x,
          solo.match.allPlayers[state.d2.gid].pos.y - d2Candidate.point.y,
        );
        const holdProgress = response.d2InitialTargetDistance - holdDistanceToCandidate;
        const responseProgress = response.d2InitialTargetDistance - response.d2FinalTargetDistance!;
        d2ProgressDenominator++;
        if (responseProgress - holdProgress >= TARGET_PROGRESS_METRES) d2ProgressPass++;
        const handoff = soloEta - responseEta >= ARRIVAL_HANDOFF_SECONDS
          && responseProgress - holdProgress >= TARGET_PROGRESS_METRES;
        if (!handoff) continue;
        physicalHandoffs++;
        handoffCandidateIds.push(d2Candidate.id);
        const occupied: Outlet = exposed === 'a' ? 'b' : 'a';
        const exposedDelta = opponentRate(response.transitions!, exposed)
          - opponentRate(solo.transitions!, exposed);
        const occupiedDelta = opponentRate(response.transitions!, occupied)
          - opponentRate(solo.transitions!, occupied);
        if (exposedDelta >= TRANSITION_STEP && occupiedDelta >= -TRANSITION_STEP) {
          transitionHandoffs++;
          transitionCandidateIds.push(d2Candidate.id);
          statesWithTransitionHandoff.add(state.key);
        }
      }
      if (handoffCandidateIds.length > 0) {
        d1DilemmasWithHandoff++;
        statesWithPhysicalHandoff.add(state.key);
      }
      dilemmas.push({
        d1CandidateId: d1Candidate.id,
        exposedOutlet: exposed,
        commitmentExposedOutlet: commitmentExposed,
        handoffCandidateIds: [...handoffCandidateIds].sort(),
        transitionCandidateIds: [...transitionCandidateIds].sort(),
      });
    }

    if (stateDirections.size === 2) statesWithBothDirections.add(state.key);

    if (hold?.status === 'completed') {
      for (const d1Candidate of state.d1.candidates) {
        if (d1Candidate.id === 'hold') continue;
        const solo = responses.get(responseKey(d1Candidate, holdD2));
        if (!solo || solo.status !== 'completed') continue;
        const holdDistance = Math.hypot(
          hold.match.allPlayers[state.d1.gid].pos.x - d1Candidate.point.x,
          hold.match.allPlayers[state.d1.gid].pos.y - d1Candidate.point.y,
        );
        const holdProgress = solo.d1InitialTargetDistance - holdDistance;
        const responseProgress = solo.d1InitialTargetDistance - solo.d1FinalTargetDistance!;
        d1ProgressDenominator++;
        if (responseProgress - holdProgress >= TARGET_PROGRESS_METRES) d1ProgressPass++;
      }
    }

    const forwardClassification = dilemmas.map((entry) => ({
      d1: entry.d1CandidateId,
      exposed: entry.exposedOutlet,
      handoff: entry.handoffCandidateIds,
      transition: entry.transitionCandidateIds,
    }));
    const reverseClassification = [...dilemmas].reverse().map((entry) => ({
      d1: entry.d1CandidateId,
      exposed: entry.exposedOutlet,
      handoff: [...entry.handoffCandidateIds].reverse().sort(),
      transition: [...entry.transitionCandidateIds].reverse().sort(),
    })).reverse();
    if (JSON.stringify(forwardClassification) !== JSON.stringify(reverseClassification)) {
      responseOrderDifferences++;
    }

    if (!childOrderControlUsed && hold?.status === 'completed') {
      const reverse = runTransitions(hold.match, state, true);
      if (JSON.stringify(hold.transitions) !== JSON.stringify(reverse)) childOrderDifferences++;
      childOrderControlUsed = true;
    }

    records.push({
      key: state.key,
      seed,
      aCandidateId: state.aOffer.candidate.id,
      d1Gid: state.d1.gid,
      d2Gid: state.d2.gid,
      exposedDirections: [...stateDirections].sort(),
      dilemmas,
    });
  }
}

const completionRate = completedBranches / Math.max(1, enumeratedBranches);
const oracleSupportRate = oracleOpportunities / Math.max(1, expectedOracleOpportunities);
const d1ProgressRate = d1ProgressPass / Math.max(1, d1ProgressDenominator);
const d2ProgressRate = d2ProgressPass / Math.max(1, d2ProgressDenominator);
const commitmentRate = validCommitments / Math.max(1, commitmentAttempts);
const dilemmaRate = d1Dilemmas / Math.max(1, nonHoldD1Responses);
const handoffDilemmaRate = d1DilemmasWithHandoff / Math.max(1, d1Dilemmas);
const transitionHandoffRate = transitionHandoffs / Math.max(1, physicalHandoffs);
const commitmentMatchRate = commitmentDilemmaMatches / Math.max(1, commitmentDilemmaSupported);

const gates = {
  acceptedStates: acceptedStates === REQUIRED_STATES,
  scannedSeeds: scannedSeeds <= MAX_SEEDS,
  completionSupport: completionRate >= 0.70,
  oracleOpportunitySupport: oracleSupportRate >= 0.90,
  d1TargetProgress: d1ProgressRate >= 0.90,
  d2TargetProgress: d2ProgressRate >= 0.90,
  validSharedCommitments: commitmentRate >= 0.90,
  sharedFactsSupported: coordinationFacts >= completedBranches * 0.90,
  bothExposedDirections: statesWithBothDirections.size >= 24,
  d1DilemmaRate: dilemmaRate >= 0.35,
  handoffDilemmaRate: handoffDilemmaRate >= 0.50,
  physicalHandoffStates: statesWithPhysicalHandoff.size >= 40,
  transitionHandoffRate: transitionHandoffRate >= 0.10,
  transitionHandoffStates: statesWithTransitionHandoff.size >= 16,
  oracleValidity: oracleForceFailures === 0,
  perceptionRngPurity: perceptionRngChanges === 0,
  commitmentPhysicsPurity: annotationPhysicsDifferences === 0,
  coordinationInputPurity: coordinationInputMutations === 0,
  interventionIntegrity: actionChanges === 0 && targetChanges === 0,
  finiteFacts: nonFiniteFacts === 0,
  cloneAndIdentityValidity: cloneFailures === 0,
  childSeedUniqueness: childSeedCollisions === 0,
  deterministicReruns: physicalDeterministicDifferences === 0
    && oracleDeterministicDifferences === 0,
  orderInvariance: responseOrderDifferences === 0 && childOrderDifferences === 0,
};
const pass = Object.values(gates).every(Boolean);

const report = {
  authority: 'D-COVER-0 decentralised defensive cover handoff lab',
  parameters: {
    seedStart: SEED_START,
    requiredStates: REQUIRED_STATES,
    maxSeeds: MAX_SEEDS,
    awareness: AWARENESS,
    moveSteps: MOVE_STEPS,
    moveSeconds: MOVE_STEPS * DT,
    replicates: REPLICATES,
  },
  support: {
    scannedSeeds,
    acceptedStates,
    enumeratedBranches,
    completedBranches,
    completionRate,
    oracleOpportunities,
    expectedOracleOpportunities,
    oracleSupportRate,
    validCommitments,
    commitmentAttempts,
    commitmentRate,
    coordinationFacts,
    d1ProgressPass,
    d1ProgressDenominator,
    d1ProgressRate,
    d2ProgressPass,
    d2ProgressDenominator,
    d2ProgressRate,
    nonHoldD1Responses,
    d1Dilemmas,
    dilemmaRate,
    statesWithBothDirections: statesWithBothDirections.size,
    d1DilemmasWithHandoff,
    handoffDilemmaRate,
    physicalHandoffs,
    statesWithPhysicalHandoff: statesWithPhysicalHandoff.size,
    transitionHandoffs,
    transitionHandoffRate,
    statesWithTransitionHandoff: statesWithTransitionHandoff.size,
    commitmentDilemmaMatches,
    commitmentDilemmaSupported,
    commitmentMatchRate,
  },
  statuses: Object.fromEntries([...statuses.entries()].sort(([left], [right]) =>
    left.localeCompare(right))),
  validity: {
    candidateConstructionFailures,
    perceptionRngChanges,
    actionChanges,
    targetChanges,
    nonFiniteFacts,
    cloneFailures,
    childSeedCollisions,
    coordinationInputMutations,
    annotationPhysicsDifferences,
    physicalDeterministicDifferences,
    oracleForceFailures,
    oracleDeterministicDifferences,
    responseOrderDifferences,
    childOrderDifferences,
  },
  records,
  gates,
  pass,
};

const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;

console.log('D-COVER-0 DECENTRALISED DEFENSIVE COVER HANDOFF LAB');
console.log(
  `accepted ${acceptedStates}/${REQUIRED_STATES} · scanned ${scannedSeeds}/${MAX_SEEDS}`
  + ` · branches ${completedBranches}/${enumeratedBranches} (${pct(completionRate)})`,
);
console.log(
  `oracle ${oracleOpportunities}/${expectedOracleOpportunities} (${pct(oracleSupportRate)})`
  + ` · commitments ${validCommitments}/${commitmentAttempts} (${pct(commitmentRate)})`,
);
console.log(
  `D1 dilemmas ${d1Dilemmas}/${nonHoldD1Responses} (${pct(dilemmaRate)})`
  + ` · both directions ${statesWithBothDirections.size}/${acceptedStates}`,
);
console.log(
  `physical handoff ${d1DilemmasWithHandoff}/${d1Dilemmas} (${pct(handoffDilemmaRate)})`
  + ` · states ${statesWithPhysicalHandoff.size}/${acceptedStates}`,
);
console.log(
  `transition handoffs ${transitionHandoffs}/${physicalHandoffs} (${pct(transitionHandoffRate)})`
  + ` · states ${statesWithTransitionHandoff.size}/${acceptedStates}`
  + ` · commitment match ${pct(commitmentMatchRate)}`,
);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
