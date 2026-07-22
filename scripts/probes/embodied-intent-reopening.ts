// D-PROC-1 OBSERVER-LOCAL EMBODIED-INTENT REOPENING.
// Authority: docs/world-model/EMBODIED-INTENT-REOPENING.md
import { createHash } from 'node:crypto';
import {
  captureObservedIntentEvidence,
  createPrivateIntentTransaction,
  evaluateObservedIntentHypotheses,
  replacePrivateIntent,
  transitionPrivateIntent,
  type IntentCandidateHypothesis,
  type ObservedIntentEvidence,
  type PrivateIntentTransaction,
} from '../../src/ai/intentProcess';
import {
  buildObserverIntentBelief,
  evaluateIntentReopening,
  type ObserverIntentBelief,
} from '../../src/ai/intentResponse';
import {
  evaluateOffBallAffordances,
  generateOffBallCandidates,
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
import { DT, PLAYER_MIN_DIST } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 85_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 36;
const PROGRESS_RESOLUTION = 0.25;
const INITIAL_ACTOR_SPEED_MAX = 0.50;
const EPS = 1e-9;

type Arm = 'H' | 'I' | 'C';
type BranchStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'observerUnsupported'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly'
  | 'schemaFailure';

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly actorGid: number;
  readonly observerGid: number;
  readonly observerMemory: PerceptionMemory;
  readonly referenceEpoch: number;
  readonly actorTarget: IntentCandidateHypothesis;
  readonly actorArrivalTime: number;
  readonly actorCandidates: readonly IntentCandidateHypothesis[];
  readonly observerInitialTarget: IntentCandidateHypothesis;
  readonly observerInitialArrivalTime: number;
  readonly observerCandidates: readonly IntentCandidateHypothesis[];
}

interface RevisionRecord {
  readonly step: number;
  readonly observedTick: number;
  readonly fromCandidateId: string;
  readonly toCandidateId: string;
  readonly supportedActorCandidateIds: readonly string[];
  readonly conflictedOwnCandidateIds: readonly string[];
  readonly startDistance: number;
}

interface ArmResult {
  readonly arm: Arm;
  readonly status: BranchStatus;
  readonly physicalSignatures: readonly string[];
  readonly evidenceSignatures: readonly string[];
  readonly revisions: readonly RevisionRecord[];
  readonly nonEmptySupport: boolean;
  readonly duplicateRevisionTicks: number;
  readonly admissibleViolations: number;
  readonly frozenCandidateViolations: number;
  readonly nonFinite: number;
  readonly perceptionRngChanges: number;
  readonly forbiddenActionChanges: number;
  readonly unsupportedReopenings: number;
  readonly finalObserverPos: Readonly<{ x: number; y: number }>;
  readonly finalCandidateId: string;
  readonly finalCandidatePoint: Readonly<{ x: number; y: number }>;
  readonly firstRevisionStep: number | null;
  readonly firstRevisionProgress: number | null;
  readonly candidateCycle: boolean;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly statuses: Readonly<Record<Arm, BranchStatus>>;
  readonly jointlyCompleted: boolean;
  readonly preRevisionPhysicalEqual: boolean;
  readonly preRevisionEvidenceEqual: boolean;
  readonly cNonEmptySupport: boolean;
  readonly hRevisions: number;
  readonly iRevisions: number;
  readonly cRevisions: number;
  readonly orderedFingerprint: boolean;
  readonly cProgress: number | null;
  readonly cIBodySeparation: number | null;
  readonly candidateCycle: boolean;
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

const cloneMemory = (memory: PerceptionMemory): PerceptionMemory => ({
  nextScanTick: memory.nextScanTick,
  ball: memory.ball === null ? null : {
    ...memory.ball,
    pos: { ...memory.ball.pos },
    vel: { ...memory.ball.vel },
  },
  players: new Map([...memory.players].map(([gid, value]) => [gid, {
    ...value,
    pos: { ...value.pos },
    vel: { ...value.vel },
    bodyDir: { ...value.bodyDir },
  }])),
});

const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(
  match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
    topSpeed: player.topSpeed,
    accel: player.accel,
    dribbling: player.attrs.dribbling,
  }]),
);

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= 6;
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
  offer.offsideRisk,
].every(Number.isFinite);

const eligibleOffers = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  offers.filter((offer) => offer.offsideMargin <= 0 && finiteOffer(offer))
    .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

const pointDistance = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

const findPlayer = (match: Match, gid: number) =>
  match.allPlayers.find((player) => player.gid === gid) ?? null;

const physicalSignature = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  time: match.simTime,
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
    sentOff: player.sentOff,
    pos: player.pos,
    vel: player.vel,
    bodyDir: player.bodyDir,
    heading: player.heading,
    desiredVel: player.desiredVel,
    action: player.action,
    decisionTimer: player.decisionTimer,
  })),
});

const finiteEvidence = (evidence: ObservedIntentEvidence): boolean => [
  evidence.observedPos.x,
  evidence.observedPos.y,
  evidence.observedVel.x,
  evidence.observedVel.y,
  evidence.observedBodyDir.x,
  evidence.observedBodyDir.y,
  ...(evidence.displacementSincePrevious
    ? [evidence.displacementSincePrevious.x, evidence.displacementSincePrevious.y]
    : []),
].every(Number.isFinite);

const statusMap = (arms: ReadonlyMap<Arm, ArmResult>): Record<Arm, BranchStatus> => ({
  H: arms.get('H')!.status,
  I: arms.get('I')!.status,
  C: arms.get('C')!.status,
});

const runArm = (state: FrozenState, arm: Arm): ArmResult => {
  const match = cloneSimulationState(state.frozen);
  const memory = cloneMemory(state.observerMemory);
  const carrier = findPlayer(match, state.carrierGid);
  const actor = findPlayer(match, state.actorGid);
  const observer = findPlayer(match, state.observerGid);
  const emptyResult = (status: BranchStatus): ArmResult => ({
    arm,
    status,
    physicalSignatures: [],
    evidenceSignatures: [],
    revisions: [],
    nonEmptySupport: false,
    duplicateRevisionTicks: 0,
    admissibleViolations: 0,
    frozenCandidateViolations: 0,
    nonFinite: 0,
    perceptionRngChanges: 0,
    forbiddenActionChanges: 0,
    unsupportedReopenings: 0,
    finalObserverPos: { x: 0, y: 0 },
    finalCandidateId: state.observerInitialTarget.id,
    finalCandidatePoint: { ...state.observerInitialTarget.point },
    firstRevisionStep: null,
    firstRevisionProgress: null,
    candidateCycle: false,
  });
  if (!carrier || !actor || !observer) return emptyResult('schemaFailure');

  const carrierRoster = carrier.rosterIdx;
  const actorRoster = actor.rosterIdx;
  const observerRoster = observer.rosterIdx;
  const actorTarget = arm === 'H'
    ? { x: actor.pos.x, y: actor.pos.y }
    : { ...state.actorTarget.point };
  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  actor.action = { type: 'MoveToPoint', targetPos: actorTarget, scores: [] };
  actor.decisionTimer = Number.POSITIVE_INFINITY;
  observer.action = {
    type: 'MoveToPoint', targetPos: { ...state.observerInitialTarget.point }, scores: [],
  };
  observer.decisionTimer = Number.POSITIVE_INFINITY;

  let actorIntent = createPrivateIntentTransaction({
    actorGid: state.actorGid,
    referenceGid: state.carrierGid,
    referenceEpoch: state.referenceEpoch,
    targetPoint: state.actorTarget.point,
    intendedArrivalTime: state.actorArrivalTime,
    openedTick: match.simTick,
  });
  let observerIntent = createPrivateIntentTransaction({
    actorGid: state.observerGid,
    referenceGid: state.carrierGid,
    referenceEpoch: state.referenceEpoch,
    targetPoint: state.observerInitialTarget.point,
    intendedArrivalTime: state.observerInitialArrivalTime,
    openedTick: match.simTick,
  });
  if (actorIntent) actorIntent = transitionPrivateIntent(actorIntent, 'committed', match.simTick);
  if (observerIntent) observerIntent = transitionPrivateIntent(observerIntent, 'committed', match.simTick);
  if (!actorIntent || !observerIntent) return emptyResult('schemaFailure');

  const first = perceiveSnapshot(
    capturePerceptionTruth(match), state.observerGid, AWARENESS, state.seed, memory,
  );
  let previousEvidence = captureObservedIntentEvidence(first, state.actorGid);
  if (!previousEvidence) return emptyResult('schemaFailure');
  let hypotheses = evaluateObservedIntentHypotheses(previousEvidence, state.actorCandidates);
  if (!hypotheses) return emptyResult('schemaFailure');
  let belief: ObserverIntentBelief | null = buildObserverIntentBelief({
    evidence: previousEvidence,
    hypotheses,
    referenceGid: state.carrierGid,
    referenceEpoch: state.referenceEpoch,
    previous: null,
  });
  if (!belief) return emptyResult('schemaFailure');

  const physicalSignatures = [physicalSignature(match)];
  const evidenceSignatures = [JSON.stringify({ evidence: previousEvidence, belief })];
  const revisions: RevisionRecord[] = [];
  const visitedCandidates = [state.observerInitialTarget.id];
  let currentCandidate = { ...state.observerInitialTarget, point: { ...state.observerInitialTarget.point } };
  let lastRevisionObservedTick: number | null = null;
  let nonEmptySupport = false;
  let duplicateRevisionTicks = 0;
  let admissibleViolations = 0;
  let frozenCandidateViolations = 0;
  let nonFinite = 0;
  let perceptionRngChanges = 0;
  let forbiddenActionChanges = 0;
  let unsupportedReopenings = 0;
  let status: BranchStatus = 'completed';

  for (let step = 1; step <= WINDOW_TICKS; step++) {
    if (match.finished) {
      status = 'finishedEarly';
      break;
    }
    match.step(DT);
    physicalSignatures.push(physicalSignature(match));
    if (match.phase !== 'playing') {
      status = 'deadBallOrRestart';
      break;
    }
    if (match.ball.owner !== carrier) {
      if (!match.ball.owner) status = 'loose';
      else if (match.ball.owner.side === carrier.side) status = 'lostToTeammate';
      else status = 'lostToOpponent';
      break;
    }
    if (
      carrier.sentOff || actor.sentOff || observer.sentOff
      || carrier.rosterIdx !== carrierRoster
      || actor.rosterIdx !== actorRoster
      || observer.rosterIdx !== observerRoster
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (
      carrier.action.type !== 'HoldPosition'
      || actor.action.type !== 'MoveToPoint'
      || actor.action.targetPos?.x !== actorTarget.x
      || actor.action.targetPos?.y !== actorTarget.y
    ) {
      forbiddenActionChanges++;
    }
    if (
      observer.action.type !== 'MoveToPoint'
      || observer.action.targetPos?.x !== currentCandidate.point.x
      || observer.action.targetPos?.y !== currentCandidate.point.y
    ) forbiddenActionChanges++;
    if (forbiddenActionChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }

    const rngBefore = (match.rng as unknown as { s: number }).s;
    const snapshot = perceiveSnapshot(
      capturePerceptionTruth(match), state.observerGid, AWARENESS, state.seed, memory,
    );
    const rngAfter = (match.rng as unknown as { s: number }).s;
    if (rngBefore !== rngAfter) perceptionRngChanges++;
    const nextEvidence = captureObservedIntentEvidence(snapshot, state.actorGid, previousEvidence);
    if (!nextEvidence) {
      status = 'observerUnsupported';
      break;
    }
    if (!finiteEvidence(nextEvidence)) nonFinite++;
    hypotheses = evaluateObservedIntentHypotheses(nextEvidence, state.actorCandidates);
    if (!hypotheses) {
      status = 'schemaFailure';
      break;
    }
    const nextBelief = buildObserverIntentBelief({
      evidence: nextEvidence,
      hypotheses,
      referenceGid: state.carrierGid,
      referenceEpoch: state.referenceEpoch,
      previous: belief,
    });
    if (!nextBelief) {
      status = 'schemaFailure';
      break;
    }
    belief = nextBelief;
    previousEvidence = nextEvidence;
    if (belief.supportedCandidateIds.length > 0) nonEmptySupport = true;
    evidenceSignatures.push(JSON.stringify({ evidence: nextEvidence, belief }));

    if (arm === 'I') continue;
    const reopening = evaluateIntentReopening({
      belief,
      actorCandidates: state.actorCandidates,
      ownCandidates: state.observerCandidates,
      currentCandidateId: currentCandidate.id,
      lastRevisionObservedTick,
    });
    if (!reopening) {
      status = 'schemaFailure';
      break;
    }
    if (reopening.status === 'unsupported') {
      unsupportedReopenings++;
      continue;
    }
    if (reopening.status !== 'reopened' || !reopening.replacement) continue;
    if (lastRevisionObservedTick === reopening.observedTick) duplicateRevisionTicks++;
    if (!reopening.conflictedOwnCandidateIds.includes(currentCandidate.id)) admissibleViolations++;
    const frozenReplacement = state.observerCandidates.find((candidate) =>
      candidate.id === reopening.replacement!.id);
    if (
      !frozenReplacement
      || frozenReplacement.point.x !== reopening.replacement.point.x
      || frozenReplacement.point.y !== reopening.replacement.point.y
    ) frozenCandidateViolations++;
    const invalidated = transitionPrivateIntent(observerIntent, 'invalidated', match.simTick);
    const replacement = invalidated === null ? null : replacePrivateIntent(
      invalidated,
      reopening.replacement.point,
      Math.max(0, pointDistance(observer.pos, reopening.replacement.point) / observer.topSpeed),
      match.simTick,
    );
    observerIntent = replacement === null
      ? null
      : transitionPrivateIntent(replacement, 'committed', match.simTick);
    if (!observerIntent) {
      status = 'schemaFailure';
      break;
    }
    revisions.push({
      step,
      observedTick: reopening.observedTick,
      fromCandidateId: currentCandidate.id,
      toCandidateId: reopening.replacement.id,
      supportedActorCandidateIds: [...reopening.supportedActorCandidateIds],
      conflictedOwnCandidateIds: [...reopening.conflictedOwnCandidateIds],
      startDistance: pointDistance(observer.pos, reopening.replacement.point),
    });
    visitedCandidates.push(reopening.replacement.id);
    currentCandidate = {
      id: reopening.replacement.id,
      point: { ...reopening.replacement.point },
    };
    observer.action = {
      type: 'MoveToPoint', targetPos: { ...reopening.replacement.point }, scores: [],
    };
    lastRevisionObservedTick = reopening.observedTick;
  }

  const firstRevision = revisions[0] ?? null;
  const firstReplacement = firstRevision === null
    ? null
    : state.observerCandidates.find((candidate) => candidate.id === firstRevision.toCandidateId) ?? null;
  const firstRevisionProgress = firstRevision && firstReplacement
    ? firstRevision.startDistance - pointDistance(observer.pos, firstReplacement.point)
    : null;
  let candidateCycle = false;
  for (let index = 2; index < visitedCandidates.length; index++) {
    if (visitedCandidates[index] === visitedCandidates[index - 2]) candidateCycle = true;
  }
  return {
    arm,
    status,
    physicalSignatures,
    evidenceSignatures,
    revisions,
    nonEmptySupport,
    duplicateRevisionTicks,
    admissibleViolations,
    frozenCandidateViolations,
    nonFinite,
    perceptionRngChanges,
    forbiddenActionChanges,
    unsupportedReopenings,
    finalObserverPos: { x: observer.pos.x, y: observer.pos.y },
    finalCandidateId: currentCandidate.id,
    finalCandidatePoint: { ...currentCandidate.point },
    firstRevisionStep: firstRevision?.step ?? null,
    firstRevisionProgress,
    candidateCycle,
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  const records: StateRecord[] = [];
  let schemaFailures = 0;
  let nonFinite = 0;
  let perceptionRngChanges = 0;
  let forbiddenActionChanges = 0;
  let duplicateRevisionTicks = 0;
  let admissibleViolations = 0;
  let frozenCandidateViolations = 0;
  let unsupportedReopenings = 0;

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
    let accepted = false;
    while (!match.finished && !accepted) {
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
        || match.phase !== 'playing'
        || !beforeAdministrativeBoundary(match)
      ) continue;
      const carrier = match.ball.owner;
      if (!carrier || carrier.sentOff || carrier.role === 'GK') continue;
      const profiles = profilesOf(match);
      const attackDir = match.teams[carrier.side].attackDir;
      let state: FrozenState | null = null;

      const possibleActors = match.teams[carrier.side].players
        .filter((player) => (
          player !== carrier
          && !player.sentOff
          && player.role !== 'GK'
          && Math.hypot(player.vel.x, player.vel.y) <= INITIAL_ACTOR_SPEED_MAX
        ))
        .sort((left, right) => left.gid - right.gid);
      for (const actor of possibleActors) {
        const actorSnapshot = snapshots.get(actor.gid);
        if (!actorSnapshot) continue;
        const actorOffersRaw = evaluateOffBallAffordances({
          snapshot: actorSnapshot,
          playerGid: actor.gid,
          carrierGid: carrier.gid,
          attackDir,
          reachProfiles: profiles,
        });
        if (!actorOffersRaw) continue;
        const actorOffers = eligibleOffers(actorOffersRaw).filter((offer) => (
          offer.candidate.id !== 'hold' && offer.candidate.sampleHorizon === 0.75
        ));
        if (actorOffers.length === 0) continue;

        const possibleObservers = match.teams[carrier.side].players
          .filter((player) => (
            player !== carrier && player !== actor && !player.sentOff && player.role !== 'GK'
          ))
          .sort((left, right) => left.gid - right.gid);
        for (const observer of possibleObservers) {
          const observerSnapshot = snapshots.get(observer.gid);
          const observerMemory = memories.get(observer.gid);
          const observedActor = observerSnapshot?.players.find((entry) => entry.gid === actor.gid);
          const actorProfile = profiles.get(actor.gid);
          if (
            !observerSnapshot || !observerMemory || !observedActor || !actorProfile
            || !observerSnapshot.players.some((entry) => entry.gid === carrier.gid)
          ) continue;
          const observerOffersRaw = evaluateOffBallAffordances({
            snapshot: observerSnapshot,
            playerGid: observer.gid,
            carrierGid: carrier.gid,
            attackDir,
            reachProfiles: profiles,
          });
          if (!observerOffersRaw) continue;
          const observerOffers = eligibleOffers(observerOffersRaw);
          if (observerOffers.length < 5) continue;
          const actorHypotheses = generateOffBallCandidates(observedActor, actorProfile, attackDir)
            .map((candidate) => ({ id: candidate.id, point: { ...candidate.point } }))
            .sort((left, right) => left.id.localeCompare(right.id));

          for (const actorOffer of actorOffers) {
            const actorHypothesis = actorHypotheses.find((candidate) =>
              candidate.id === actorOffer.candidate.id);
            if (!actorHypothesis) continue;
            const conflictingObserverOffer = observerOffers.find((offer) =>
              pointDistance(offer.candidate.point, actorHypothesis.point) < PLAYER_MIN_DIST);
            if (!conflictingObserverOffer) continue;
            const alternatives = observerOffers.filter((offer) =>
              pointDistance(offer.candidate.point, actorHypothesis.point) >= PLAYER_MIN_DIST);
            if (alternatives.length < 3) continue;
            state = {
              key: `${seed}:${match.simTick}:${carrier.gid}:${actor.gid}:${observer.gid}`,
              seed,
              frozen: cloneSimulationState(match),
              carrierGid: carrier.gid,
              actorGid: actor.gid,
              observerGid: observer.gid,
              observerMemory: cloneMemory(observerMemory),
              referenceEpoch: match.simTick,
              actorTarget: {
                id: actorOffer.candidate.id,
                point: { ...actorOffer.candidate.point },
              },
              actorArrivalTime: actorOffer.selfArrival,
              actorCandidates: actorHypotheses,
              observerInitialTarget: {
                id: conflictingObserverOffer.candidate.id,
                point: { ...conflictingObserverOffer.candidate.point },
              },
              observerInitialArrivalTime: conflictingObserverOffer.selfArrival,
              observerCandidates: observerOffers.map((offer) => ({
                id: offer.candidate.id,
                point: { ...offer.candidate.point },
              })),
            };
            break;
          }
          if (state) break;
        }
        if (state) break;
      }
      if (!state) continue;
      accepted = true;
      acceptedStates++;
      const arms = new Map<Arm, ArmResult>();
      for (const arm of ['H', 'I', 'C'] as const) {
        const result = runArm(state, arm);
        arms.set(arm, result);
        if (result.status === 'schemaFailure') schemaFailures++;
        nonFinite += result.nonFinite;
        perceptionRngChanges += result.perceptionRngChanges;
        forbiddenActionChanges += result.forbiddenActionChanges;
        duplicateRevisionTicks += result.duplicateRevisionTicks;
        admissibleViolations += result.admissibleViolations;
        frozenCandidateViolations += result.frozenCandidateViolations;
        unsupportedReopenings += result.unsupportedReopenings;
      }
      const h = arms.get('H')!;
      const i = arms.get('I')!;
      const c = arms.get('C')!;
      const jointlyCompleted = [...arms.values()].every((arm) => arm.status === 'completed');
      const prefixLength = c.firstRevisionStep === null
        ? Math.min(i.physicalSignatures.length, c.physicalSignatures.length)
        : c.firstRevisionStep + 1;
      const preRevisionPhysicalEqual = canonical(i.physicalSignatures.slice(0, prefixLength))
        === canonical(c.physicalSignatures.slice(0, prefixLength));
      const evidencePrefix = c.firstRevisionStep === null
        ? Math.min(i.evidenceSignatures.length, c.evidenceSignatures.length)
        : c.firstRevisionStep + 1;
      const preRevisionEvidenceEqual = c.firstRevisionStep === null
        ? canonical(i.evidenceSignatures) === canonical(c.evidenceSignatures)
        : canonical(i.evidenceSignatures.slice(0, evidencePrefix))
          === canonical(c.evidenceSignatures.slice(0, evidencePrefix));
      const cProgress = jointlyCompleted ? c.firstRevisionProgress : null;
      const cIBodySeparation = jointlyCompleted
        ? pointDistance(c.finalObserverPos, i.finalObserverPos)
        : null;
      const firstRevision = c.revisions[0];
      const orderedFingerprint = jointlyCompleted
        && firstRevision !== undefined
        && firstRevision.supportedActorCandidateIds.length > 0
        && firstRevision.conflictedOwnCandidateIds.includes(firstRevision.fromCandidateId)
        && cProgress !== null
        && cProgress >= PROGRESS_RESOLUTION
        && i.revisions.length === 0;
      records.push({
        key: state.key,
        seed,
        statuses: statusMap(arms),
        jointlyCompleted,
        preRevisionPhysicalEqual,
        preRevisionEvidenceEqual,
        cNonEmptySupport: c.nonEmptySupport,
        hRevisions: h.revisions.length,
        iRevisions: i.revisions.length,
        cRevisions: c.revisions.length,
        orderedFingerprint,
        cProgress,
        cIBodySeparation,
        candidateCycle: c.candidateCycle,
      });
    }
  }

  const completed = records.filter((record) => record.jointlyCompleted);
  const cRevised = completed.filter((record) => record.cRevisions > 0);
  const counts = {
    completed: completed.length,
    nonEmptySupport: records.filter((record) => record.cNonEmptySupport).length,
    orderedFingerprints: records.filter((record) => record.orderedFingerprint).length,
    hFingerprints: records.filter((record) => record.hRevisions > 0).length,
    iFingerprints: records.filter((record) => record.iRevisions > 0).length,
    cRevisions: cRevised.length,
    cProgress: cRevised.filter((record) => (
      record.cProgress !== null && record.cProgress >= PROGRESS_RESOLUTION
    )).length,
    cIBodySeparation: cRevised.filter((record) => (
      record.cIBodySeparation !== null && record.cIBodySeparation >= PROGRESS_RESOLUTION
    )).length,
    preRevisionPhysicalEqual: records.filter((record) => record.preRevisionPhysicalEqual).length,
    preRevisionEvidenceEqual: records.filter((record) => record.preRevisionEvidenceEqual).length,
    candidateCycles: records.filter((record) => record.candidateCycle).length,
    maxRevisions: Math.max(0, ...records.map((record) => record.cRevisions)),
  };
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    completed: completed.length >= 72,
    schema: schemaFailures === 0,
    finite: nonFinite === 0,
    perceptionRng: perceptionRngChanges === 0,
    interventionsHeld: forbiddenActionChanges === 0,
    preRevisionPhysical: counts.preRevisionPhysicalEqual === acceptedStates,
    preRevisionEvidence: counts.preRevisionEvidenceEqual === acceptedStates,
    duplicateRevisionTicks: duplicateRevisionTicks === 0,
    admissibility: admissibleViolations === 0,
    frozenCandidates: frozenCandidateViolations === 0,
  };
  const mechanism = {
    support: counts.nonEmptySupport >= 64,
    ordered: counts.orderedFingerprints >= 56,
    heldEdge: counts.orderedFingerprints - counts.hFingerprints >= 48,
    signalBlind: counts.iFingerprints === 0,
    heldFalseReopen: counts.hFingerprints <= 4,
    progress: counts.cProgress / Math.max(1, counts.cRevisions) >= 0.75,
    bodySeparation: counts.cIBodySeparation / Math.max(1, counts.cRevisions) >= 0.60,
    noCycles: counts.candidateCycles === 0,
    boundedRevisions: counts.maxRevisions <= 3,
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(mechanism).every(Boolean);
  return {
    experiment: 'D-PROC-1',
    authority: 'EMBODIED-INTENT-REOPENING',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      progressResolution: PROGRESS_RESOLUTION,
      initialActorSpeedMax: INITIAL_ACTOR_SPEED_MAX,
      physicalConflictDistance: PLAYER_MIN_DIST,
    },
    support: { scannedSeeds, acceptedStates, completed: completed.length },
    counts,
    diagnostics: {
      schemaFailures,
      nonFinite,
      perceptionRngChanges,
      forbiddenActionChanges,
      duplicateRevisionTicks,
      admissibleViolations,
      frozenCandidateViolations,
      unsupportedReopenings,
    },
    exact,
    mechanism,
    verdict: pass ? 'PASS' : 'FAIL',
    records,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const secondJson = canonical(second);
const deterministic = firstJson === secondJson;
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
if (!deterministic) output.verdict = 'FAIL';
console.log(JSON.stringify(output, null, 2));
console.error(
  `D-PROC-1 ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` · completed ${output.support.completed} · ordered ${output.counts.orderedFingerprints}`
  + ` · SHA ${sha256}`,
);
