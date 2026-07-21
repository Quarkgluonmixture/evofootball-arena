// DDD-0 DECENTRALISED DEFENSIVE DILEMMA LAB (offline only).
// Authority: docs/world-model/DECENTRALISED-DEFENSIVE-DILEMMA-LAB.md
import { createHash } from 'node:crypto';
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
  type PerceptionMemory,
  type PerceptionSnapshot,
  type ObservedPlayer,
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
import { closestPointOnSegment } from '../../src/utils/vec';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type FirstTransitionOutcome,
} from './oracle-v2';

const REQUIRED_STATES = Number(process.argv[2] ?? 64);
const SEED_START = Number(process.argv[3] ?? 51_000);
const MAX_SEEDS = 128;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const MOVE_STEPS = Math.round(0.75 / DT);
const REPLICATES = 4;
const DDD_NAMESPACE = 0x0ddd0001;
const EPS = 1e-9;

const MIN_A_CANDIDATES = 4;
const MIN_D_NON_HOLD = 6;
const MIN_COMPLETED_RESPONSES = 7;
const ARRIVAL_CROSSOVER_SECONDS = 0.10;
const TRANSITION_CROSSOVER_RATE = 0.25;
const TARGET_PROGRESS_METRES = 0.25;

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

interface DefenderIntervention {
  readonly aOffer: OffBallAffordance;
  readonly dGid: number;
  readonly dCandidates: readonly OffBallCandidatePoint[];
}

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly aGid: number;
  readonly bGid: number;
  readonly interventions: readonly DefenderIntervention[];
}

interface PhysicalResponse {
  readonly candidate: OffBallCandidatePoint;
  readonly match: Match;
  readonly status: BranchStatus;
  readonly signature: string;
  readonly actionChanges: number;
  readonly targetChanges: number;
  readonly nonFinite: number;
  readonly dInitialTargetDistance: number;
  readonly dFinalTargetDistance: number;
  readonly etaA: number | null;
  readonly etaB: number | null;
  readonly laneDistanceA: number | null;
  readonly laneDistanceB: number | null;
  readonly goalSideA: number | null;
  readonly goalSideB: number | null;
  readonly nearestDefensiveTeammate: number | null;
  readonly dTravel: number | null;
}

interface TransitionTensor {
  readonly a: Record<RecordedOutcome, number>;
  readonly b: Record<RecordedOutcome, number>;
  readonly opportunities: number;
  readonly forceFailures: number;
  readonly deterministicDifferences: number;
}

interface ResponseRecord {
  readonly candidateId: string;
  readonly directionIndex: number | null;
  readonly status: BranchStatus;
  readonly targetProgressAdvantage: number | null;
  readonly etaA: number | null;
  readonly etaB: number | null;
  readonly laneDistanceA: number | null;
  readonly laneDistanceB: number | null;
  readonly goalSideA: number | null;
  readonly goalSideB: number | null;
  readonly nearestDefensiveTeammate: number | null;
  readonly dTravel: number | null;
  readonly transitions: TransitionTensor | null;
}

interface InterventionRecord {
  readonly stateKey: string;
  readonly seed: number;
  readonly aCandidateId: string;
  readonly aDirectionIndex: number | null;
  readonly dGid: number;
  readonly supported: boolean;
  readonly arrivalCrossOver: boolean;
  readonly transitionCrossOver: boolean;
  readonly samePairCrossOver: boolean;
  readonly responses: readonly ResponseRecord[];
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

const eligibleSurface = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  offers
    .filter((offer) => offer.offsideMargin <= 0 && finiteOffer(offer))
    .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

const shortAOffers = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  eligibleSurface(offers)
    .filter((offer) =>
      offer.candidate.id !== 'hold'
      && Math.abs(offer.candidate.sampleHorizon - 0.75) <= EPS)
    .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

const defenderCandidates = (
  observed: ObservedPlayer,
  profile: KnownReachProfile,
  attackDir: 1 | -1,
): readonly OffBallCandidatePoint[] => generateOffBallCandidates(observed, profile, attackDir)
  .filter((candidate) =>
    candidate.id === 'hold' || Math.abs(candidate.sampleHorizon - 0.75) <= EPS)
  .sort((left, right) => left.id.localeCompare(right.id));

const selectDefender = (
  match: Match,
  snapshots: ReadonlyMap<number, PerceptionSnapshot>,
  profiles: ReadonlyMap<number, KnownReachProfile>,
  attackingSide: Side,
  aGid: number,
  carrierGid: number,
  target: Readonly<{ x: number; y: number }>,
): { gid: number; candidates: readonly OffBallCandidatePoint[] } | null => {
  const options: Array<{ gid: number; eta: number; candidates: readonly OffBallCandidatePoint[] }> = [];
  const defendingTeam = match.teams[1 - attackingSide];
  for (const defender of defendingTeam.players) {
    if (defender.role === 'GK' || defender.sentOff) continue;
    const snapshot = snapshots.get(defender.gid);
    const profile = profiles.get(defender.gid);
    const observed = snapshot?.players.find((entry) => entry.gid === defender.gid);
    if (!snapshot || !profile || !observed) continue;
    if (!snapshot.players.some((entry) => entry.gid === aGid)) continue;
    if (!snapshot.players.some((entry) => entry.gid === carrierGid)) continue;
    const candidates = defenderCandidates(observed, profile, defendingTeam.attackDir);
    if (
      candidates.filter((candidate) => candidate.id !== 'hold').length < MIN_D_NON_HOLD
      || !candidates.some((candidate) => candidate.id === 'hold')
    ) continue;
    options.push({
      gid: defender.gid,
      eta: estimateReach(reachState(observed, profile), target).eta,
      candidates,
    });
  }
  options.sort((left, right) => left.eta - right.eta || left.gid - right.gid);
  return options.length > 0 ? options[0] : null;
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

const runPhysicalResponse = (
  state: FrozenState,
  intervention: DefenderIntervention,
  candidate: OffBallCandidatePoint,
): PhysicalResponse => {
  const branch = cloneSimulationState(state.frozen);
  const carrier = branch.allPlayers[state.carrierGid];
  const a = branch.allPlayers[state.aGid];
  const b = branch.allPlayers[state.bGid];
  const d = branch.allPlayers[intervention.dGid];
  const carrierRoster = carrier.rosterIdx;
  const aRoster = a.rosterIdx;
  const bRoster = b.rosterIdx;
  const dRoster = d.rosterIdx;
  const initialD = { x: d.pos.x, y: d.pos.y };
  const fixedB = { x: b.pos.x, y: b.pos.y };
  const fixedA = {
    x: intervention.aOffer.candidate.point.x,
    y: intervention.aOffer.candidate.point.y,
  };
  const fixedD = { x: candidate.point.x, y: candidate.point.y };
  const dInitialTargetDistance = Math.hypot(d.pos.x - fixedD.x, d.pos.y - fixedD.y);

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  a.action = { type: 'MoveToPoint', targetPos: fixedA, scores: [] };
  a.decisionTimer = Number.POSITIVE_INFINITY;
  b.action = { type: 'MoveToPoint', targetPos: fixedB, scores: [] };
  b.decisionTimer = Number.POSITIVE_INFINITY;
  d.action = { type: 'MoveToPoint', targetPos: fixedD, scores: [] };
  d.decisionTimer = Number.POSITIVE_INFINITY;

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
      branch.ball.pos.x,
      branch.ball.pos.y,
      ...[carrier, a, b, d].flatMap((player) => [
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
    if (
      carrier.sentOff || a.sentOff || b.sentOff || d.sentOff
      || carrier.rosterIdx !== carrierRoster
      || a.rosterIdx !== aRoster
      || b.rosterIdx !== bRoster
      || d.rosterIdx !== dRoster
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') actionChanges++;
    for (const [player, target] of [
      [a, fixedA], [b, fixedB], [d, fixedD],
    ] as const) {
      if (player.action.type !== 'MoveToPoint') actionChanges++;
      else if (player.action.targetPos?.x !== target.x || player.action.targetPos?.y !== target.y) {
        targetChanges++;
      }
    }
    if (actionChanges > 0 || targetChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  const dFinalTargetDistance = Math.hypot(d.pos.x - fixedD.x, d.pos.y - fixedD.y);
  let etaA: number | null = null;
  let etaB: number | null = null;
  let laneDistanceA: number | null = null;
  let laneDistanceB: number | null = null;
  let goalSideA: number | null = null;
  let goalSideB: number | null = null;
  let nearestDefensiveTeammate: number | null = null;
  let dTravel: number | null = null;
  if (status === 'completed') {
    const profile = profilesOf(branch).get(d.gid)!;
    const stateD: ReachState = {
      pos: d.pos,
      vel: d.vel,
      bodyDir: d.bodyDir,
      topSpeed: profile.topSpeed,
      accel: profile.accel,
      attrs: { dribbling: profile.dribbling ?? 0.5 },
    };
    etaA = estimateReach(stateD, a.pos).eta;
    etaB = estimateReach(stateD, b.pos).eta;
    const closestA = closestPointOnSegment(carrier.pos, a.pos, d.pos);
    const closestB = closestPointOnSegment(carrier.pos, b.pos, d.pos);
    laneDistanceA = Math.hypot(d.pos.x - closestA.x, d.pos.y - closestA.y);
    laneDistanceB = Math.hypot(d.pos.x - closestB.x, d.pos.y - closestB.y);
    const defendingTeam = branch.teams[d.side];
    goalSideA = defendingTeam.localX(a.pos.x) - defendingTeam.localX(d.pos.x);
    goalSideB = defendingTeam.localX(b.pos.x) - defendingTeam.localX(d.pos.x);
    nearestDefensiveTeammate = Math.min(...defendingTeam.players
      .filter((player) => player !== d && !player.sentOff)
      .map((player) => Math.hypot(player.pos.x - d.pos.x, player.pos.y - d.pos.y)));
    dTravel = Math.hypot(d.pos.x - initialD.x, d.pos.y - initialD.y);
  }

  return {
    candidate,
    match: branch,
    status,
    signature: physicalSignature(branch),
    actionChanges,
    targetChanges,
    nonFinite,
    dInitialTargetDistance,
    dFinalTargetDistance,
    etaA,
    etaB,
    laneDistanceA,
    laneDistanceB,
    goalSideA,
    goalSideB,
    nearestDefensiveTeammate,
    dTravel,
  };
};

const emptyOutcomes = (): Record<RecordedOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
  censored: 0,
});

const addOutcome = (target: Record<RecordedOutcome, number>, outcome: RecordedOutcome): void => {
  target[outcome]++;
};

const childSeedRegistry = new Map<number, string>();
let childSeedCollisions = 0;

const childSeedFor = (
  state: FrozenState,
  intervention: DefenderIntervention,
  targetOrdinal: number,
  replicate: number,
): number => {
  const candidateOrdinal = intervention.aOffer.candidate.directionIndex ?? -1;
  const key = `${state.key}:${candidateOrdinal}:${targetOrdinal}:${replicate}`;
  const seed = hashSeed(
    DDD_NAMESPACE,
    state.seed,
    state.frozen.simTick,
    state.carrierGid,
    state.aGid,
    state.bGid,
    candidateOrdinal,
    targetOrdinal,
    replicate,
  );
  const previous = childSeedRegistry.get(seed);
  if (previous !== undefined && previous !== key) childSeedCollisions++;
  else childSeedRegistry.set(seed, key);
  return seed;
};

const runTransitions = (
  response: PhysicalResponse,
  state: FrozenState,
  intervention: DefenderIntervention,
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
  const targets = [
    { ordinal: 0, gid: state.aGid, key: 'a' as const },
    { ordinal: 1, gid: state.bGid, key: 'b' as const },
  ];
  const tasks: Array<{ ordinal: number; gid: number; key: 'a' | 'b'; replicate: number }> = [];
  for (const target of targets) {
    for (let replicate = 0; replicate < REPLICATES; replicate++) tasks.push({ ...target, replicate });
  }
  if (reverse) tasks.reverse();
  for (const task of tasks) {
    const childSeed = childSeedFor(state, intervention, task.ordinal, task.replicate);
    const input = {
      frozen: response.match,
      passerGid: state.carrierGid,
      targetGid: task.gid,
      side: response.match.allPlayers[state.carrierGid].side as Side,
      branch: 'alternative' as const,
      childRngState: childSeed,
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
    addOutcome(mutable[task.key], outcome);
  }
  return result;
};

const opponentRate = (tensor: TransitionTensor, target: 'a' | 'b'): number =>
  tensor[target].opponentInterception / REPLICATES;

const isArrivalCrossOver = (left: PhysicalResponse, right: PhysicalResponse): boolean => {
  if (left.etaA === null || left.etaB === null || right.etaA === null || right.etaB === null) return false;
  return (
    left.etaA <= right.etaA - ARRIVAL_CROSSOVER_SECONDS
    && left.etaB >= right.etaB + ARRIVAL_CROSSOVER_SECONDS
  ) || (
    right.etaA <= left.etaA - ARRIVAL_CROSSOVER_SECONDS
    && right.etaB >= left.etaB + ARRIVAL_CROSSOVER_SECONDS
  );
};

const isTransitionCrossOver = (left: TransitionTensor, right: TransitionTensor): boolean => {
  const leftA = opponentRate(left, 'a');
  const leftB = opponentRate(left, 'b');
  const rightA = opponentRate(right, 'a');
  const rightB = opponentRate(right, 'b');
  return (
    leftA >= rightA + TRANSITION_CROSSOVER_RATE
    && leftB <= rightB - TRANSITION_CROSSOVER_RATE
  ) || (
    rightA >= leftA + TRANSITION_CROSSOVER_RATE
    && rightB <= leftB - TRANSITION_CROSSOVER_RATE
  );
};

const mapObject = <K extends string>(map: ReadonlyMap<K, number>): Record<K, number> =>
  Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right))) as Record<K, number>;

const increment = <K>(map: Map<K, number>, key: K): void => {
  map.set(key, (map.get(key) ?? 0) + 1);
};

let scannedSeeds = 0;
let acceptedStates = 0;
let enumeratedAInterventions = 0;
let enumeratedResponseBranches = 0;
let completedResponseBranches = 0;
let validOracleOpportunities = 0;
let oracleForceFailures = 0;
let oracleDeterministicDifferences = 0;
let physicalDeterministicDifferences = 0;
let actionChanges = 0;
let targetChanges = 0;
let nonFiniteFacts = 0;
let perceptionRngChanges = 0;
let cloneFailures = 0;
let candidateConstructionFailures = 0;
let targetProgressCount = 0;
let targetProgressDenominator = 0;
let supportedAInterventions = 0;
let arrivalCrossOvers = 0;
let transitionCrossOvers = 0;
let samePairCrossOvers = 0;
let childOrderDifferences = 0;
let responseOrderDifferences = 0;
const statesWithArrival = new Set<string>();
const statesWithCoupled = new Set<string>();
const statuses = new Map<BranchStatus, number>();
const responseDirections = new Map<string, number>();
const arrivalDirections = new Map<string, number>();
const coupledDirections = new Map<string, number>();
const records: InterventionRecord[] = [];
let childOrderControlUsed = false;

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
    for (const player of match.teams[carrier.side].players) {
      if (player === carrier || player.sentOff || player.role === 'GK') continue;
      const snapshot = snapshots.get(player.gid);
      if (!snapshot) continue;
      const offers = evaluateOffBallAffordances({
        snapshot,
        playerGid: player.gid,
        carrierGid: carrier.gid,
        attackDir: match.teams[carrier.side].attackDir,
        reachProfiles: profiles,
      });
      if (!offers) continue;
      const short = shortAOffers(offers);
      if (short.length >= MIN_A_CANDIDATES) offersByActor.set(player.gid, short);
    }
    if (offersByActor.size < 2) continue;
    const actorGids = [...offersByActor.keys()].sort((leftGid, rightGid) => {
      const left = match.allPlayers[leftGid];
      const right = match.allPlayers[rightGid];
      return left.decisionTimer - right.decisionTimer || leftGid - rightGid;
    });
    const [aGid, bGid] = actorGids;
    const interventions: DefenderIntervention[] = [];
    for (const aOffer of offersByActor.get(aGid)!) {
      const selected = selectDefender(
        match, snapshots, profiles, carrier.side, aGid, carrier.gid, aOffer.candidate.point,
      );
      if (!selected) {
        candidateConstructionFailures++;
        continue;
      }
      interventions.push({ aOffer, dGid: selected.gid, dCandidates: selected.candidates });
    }
    if (interventions.length < MIN_A_CANDIDATES) continue;

    const state: FrozenState = {
      key: `${seed}:${match.simTick}:${carrier.gid}:${aGid}:${bGid}`,
      seed,
      frozen: cloneSimulationState(match),
      carrierGid: carrier.gid,
      aGid,
      bGid,
      interventions,
    };
    acceptedThisSeed = true;
    acceptedStates++;

    for (const intervention of state.interventions) {
      enumeratedAInterventions++;
      const aDirection = String(intervention.aOffer.candidate.directionIndex);
      const responses: PhysicalResponse[] = [];
      for (const candidate of intervention.dCandidates) {
        enumeratedResponseBranches++;
        increment(responseDirections, String(candidate.directionIndex));
        try {
          const response = runPhysicalResponse(state, intervention, candidate);
          const replay = runPhysicalResponse(state, intervention, candidate);
          if (response.signature !== replay.signature) physicalDeterministicDifferences++;
          responses.push(response);
          increment(statuses, response.status);
          actionChanges += response.actionChanges;
          targetChanges += response.targetChanges;
          nonFiniteFacts += response.nonFinite;
          if (response.status === 'completed') completedResponseBranches++;
        } catch {
          cloneFailures++;
        }
      }

      const hold = responses.find((response) => response.candidate.id === 'hold');
      const completed = responses.filter((response) => response.status === 'completed');
      if (hold?.status === 'completed') {
        for (const response of completed) {
          if (response.candidate.id === 'hold') continue;
          const holdProgress = response.dInitialTargetDistance - Math.hypot(
            hold.match.allPlayers[intervention.dGid].pos.x - response.candidate.point.x,
            hold.match.allPlayers[intervention.dGid].pos.y - response.candidate.point.y,
          );
          const responseProgress = response.dInitialTargetDistance - response.dFinalTargetDistance;
          targetProgressDenominator++;
          if (responseProgress - holdProgress >= TARGET_PROGRESS_METRES) targetProgressCount++;
        }
      }

      const tensorById = new Map<string, TransitionTensor>();
      for (const response of completed) {
        const tensor = runTransitions(response, state, intervention);
        tensorById.set(response.candidate.id, tensor);
        validOracleOpportunities += tensor.opportunities;
        oracleForceFailures += tensor.forceFailures;
        oracleDeterministicDifferences += tensor.deterministicDifferences;
      }

      if (!childOrderControlUsed && completed.length > 0) {
        const forward = tensorById.get(completed[0].candidate.id)!;
        const reverse = runTransitions(completed[0], state, intervention, true);
        if (JSON.stringify(forward) !== JSON.stringify(reverse)) childOrderDifferences++;
        childOrderControlUsed = true;
      }

      const supported =
        hold?.status === 'completed'
        && completed.length >= MIN_COMPLETED_RESPONSES
        && completed.every((response) => tensorById.get(response.candidate.id)?.opportunities === REPLICATES * 2);
      let arrivalCrossOver = false;
      let transitionCrossOver = false;
      let samePairCrossOver = false;
      if (supported) {
        supportedAInterventions++;
        for (let left = 0; left < completed.length; left++) {
          for (let right = left + 1; right < completed.length; right++) {
            const arrival = isArrivalCrossOver(completed[left], completed[right]);
            const transition = isTransitionCrossOver(
              tensorById.get(completed[left].candidate.id)!,
              tensorById.get(completed[right].candidate.id)!,
            );
            if (arrival) arrivalCrossOver = true;
            if (transition) transitionCrossOver = true;
            if (arrival && transition) samePairCrossOver = true;
          }
        }
        const reverse = [...completed].reverse();
        let reverseArrival = false;
        let reverseTransition = false;
        for (let left = 0; left < reverse.length; left++) {
          for (let right = left + 1; right < reverse.length; right++) {
            if (isArrivalCrossOver(reverse[left], reverse[right])) reverseArrival = true;
            if (isTransitionCrossOver(
              tensorById.get(reverse[left].candidate.id)!,
              tensorById.get(reverse[right].candidate.id)!,
            )) reverseTransition = true;
          }
        }
        if (arrivalCrossOver !== reverseArrival || transitionCrossOver !== reverseTransition) {
          responseOrderDifferences++;
        }
        if (arrivalCrossOver) {
          arrivalCrossOvers++;
          statesWithArrival.add(state.key);
          increment(arrivalDirections, aDirection);
        }
        if (arrivalCrossOver && transitionCrossOver) {
          transitionCrossOvers++;
          statesWithCoupled.add(state.key);
          increment(coupledDirections, aDirection);
        }
        if (samePairCrossOver) samePairCrossOvers++;
      }

      const holdByResponseTarget = hold?.status === 'completed' ? hold : null;
      records.push({
        stateKey: state.key,
        seed,
        aCandidateId: intervention.aOffer.candidate.id,
        aDirectionIndex: intervention.aOffer.candidate.directionIndex,
        dGid: intervention.dGid,
        supported,
        arrivalCrossOver,
        transitionCrossOver,
        samePairCrossOver,
        responses: responses.map((response) => {
          let targetProgressAdvantage: number | null = null;
          if (response.status === 'completed' && holdByResponseTarget && response.candidate.id !== 'hold') {
            const holdDistance = Math.hypot(
              holdByResponseTarget.match.allPlayers[intervention.dGid].pos.x - response.candidate.point.x,
              holdByResponseTarget.match.allPlayers[intervention.dGid].pos.y - response.candidate.point.y,
            );
            targetProgressAdvantage = (response.dInitialTargetDistance - response.dFinalTargetDistance)
              - (response.dInitialTargetDistance - holdDistance);
          }
          return {
            candidateId: response.candidate.id,
            directionIndex: response.candidate.directionIndex,
            status: response.status,
            targetProgressAdvantage,
            etaA: response.etaA,
            etaB: response.etaB,
            laneDistanceA: response.laneDistanceA,
            laneDistanceB: response.laneDistanceB,
            goalSideA: response.goalSideA,
            goalSideB: response.goalSideB,
            nearestDefensiveTeammate: response.nearestDefensiveTeammate,
            dTravel: response.dTravel,
            transitions: tensorById.get(response.candidate.id) ?? null,
          };
        }),
      });
    }
  }
}

const completionRate = completedResponseBranches / Math.max(1, enumeratedResponseBranches);
const expectedOracleOpportunities = completedResponseBranches * REPLICATES * 2;
const oracleSupportRate = validOracleOpportunities / Math.max(1, expectedOracleOpportunities);
const targetProgressRate = targetProgressCount / Math.max(1, targetProgressDenominator);
const arrivalRate = arrivalCrossOvers / Math.max(1, supportedAInterventions);
const coupledRate = transitionCrossOvers / Math.max(1, supportedAInterventions);
const gates = {
  acceptedStates: acceptedStates === REQUIRED_STATES,
  scannedSeeds: scannedSeeds <= MAX_SEEDS,
  aInterventionSupport: enumeratedAInterventions >= 256,
  responseBranchSupport: enumeratedResponseBranches >= 1_792,
  completionSupport: completionRate >= 0.70,
  oracleOpportunitySupport: oracleSupportRate >= 0.90,
  oracleValidity: oracleForceFailures === 0,
  perceptionRngPurity: perceptionRngChanges === 0,
  finiteFacts: nonFiniteFacts === 0,
  interventionIntegrity: actionChanges === 0 && targetChanges === 0,
  cloneAndIdentityValidity: cloneFailures === 0,
  childSeedUniqueness: childSeedCollisions === 0,
  deterministicReruns: physicalDeterministicDifferences === 0
    && oracleDeterministicDifferences === 0,
  orderInvariance: childOrderDifferences === 0 && responseOrderDifferences === 0,
  defenderExecution: targetProgressRate >= 0.90,
  arrivalCrossOverRate: arrivalRate >= 0.50,
  arrivalStateSupport: statesWithArrival.size >= 48,
  coupledCrossOverRate: coupledRate >= 0.20,
  coupledStateSupport: statesWithCoupled.size >= 32,
};
const pass = Object.values(gates).every(Boolean);

const report = {
  authority: 'DDD-0 decentralised defensive dilemma lab',
  parameters: {
    seedStart: SEED_START,
    requiredStates: REQUIRED_STATES,
    maxSeeds: MAX_SEEDS,
    moveSteps: MOVE_STEPS,
    moveSeconds: MOVE_STEPS * DT,
    replicates: REPLICATES,
  },
  support: {
    scannedSeeds,
    acceptedStates,
    enumeratedAInterventions,
    enumeratedResponseBranches,
    completedResponseBranches,
    completionRate,
    validOracleOpportunities,
    expectedOracleOpportunities,
    oracleSupportRate,
    supportedAInterventions,
    targetProgressCount,
    targetProgressDenominator,
    targetProgressRate,
    arrivalCrossOvers,
    arrivalRate,
    statesWithArrival: statesWithArrival.size,
    transitionCrossOvers,
    coupledRate,
    statesWithCoupled: statesWithCoupled.size,
    samePairCrossOvers,
  },
  directions: Object.fromEntries([...responseDirections.keys()].sort().map((key) => [key, {
    responseBranches: responseDirections.get(key) ?? 0,
    aArrivalCrossOvers: arrivalDirections.get(key) ?? 0,
    aCoupledCrossOvers: coupledDirections.get(key) ?? 0,
  }])),
  statuses: mapObject(statuses),
  validity: {
    candidateConstructionFailures,
    perceptionRngChanges,
    nonFiniteFacts,
    actionChanges,
    targetChanges,
    cloneFailures,
    childSeedCollisions,
    oracleForceFailures,
    physicalDeterministicDifferences,
    oracleDeterministicDifferences,
    childOrderDifferences,
    responseOrderDifferences,
  },
  records,
  gates,
  pass,
};

const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;

console.log('DDD-0 DECENTRALISED DEFENSIVE DILEMMA LAB');
console.log(
  `accepted ${acceptedStates}/${REQUIRED_STATES} · scanned ${scannedSeeds}/${MAX_SEEDS}`
  + ` · A interventions ${enumeratedAInterventions}`,
);
console.log(
  `responses ${completedResponseBranches}/${enumeratedResponseBranches} (${pct(completionRate)})`
  + ` · oracle ${validOracleOpportunities}/${expectedOracleOpportunities} (${pct(oracleSupportRate)})`,
);
console.log(
  `D target progress ${targetProgressCount}/${targetProgressDenominator} (${pct(targetProgressRate)})`,
);
console.log(
  `arrival cross-over ${arrivalCrossOvers}/${supportedAInterventions} (${pct(arrivalRate)})`
  + ` · states ${statesWithArrival.size}/${acceptedStates}`,
);
console.log(
  `arrival + transition ${transitionCrossOvers}/${supportedAInterventions} (${pct(coupledRate)})`
  + ` · states ${statesWithCoupled.size}/${acceptedStates}`
  + ` · same response-pair ${samePairCrossOvers}`,
);
console.log(`statuses ${JSON.stringify(mapObject(statuses))}`);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
