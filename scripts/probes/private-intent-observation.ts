// D-PROC-0T PRIVATE INTENT, EMBODIED EVIDENCE AND OBSERVER BELIEF.
// Authority: docs/world-model/PRIVATE-INTENT-OBSERVATION-PROTOCOL.md
import { createHash } from 'node:crypto';
import {
  captureObservedIntentEvidence,
  createPrivateIntentTransaction,
  evaluateObservedIntentHypotheses,
  replacePrivateIntent,
  transitionPrivateIntent,
  type IntentCandidateHypothesis,
  type ObservedIntentEvidence,
  type ObservedIntentHypothesisEvidence,
  type PrivateIntentTransaction,
} from '../../src/ai/intentProcess';
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
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 84_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 24;
const REVOCATION_TICK = 12;
const DEPENDENCE_RESOLUTION = 0.10;
const TRUE_ALIGNMENT_FLOOR = 0.50;
const PROGRESS_RESOLUTION = 0.25;
const EPS = 1e-9;

type Arm = 'H' | 'X' | 'E' | 'R';
type BranchStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'observerUnsupported'
  | 'unexpectedInterventionChange'
  | 'finishedEarly'
  | 'schemaFailure';

interface FrozenIntentState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly actorGid: number;
  readonly observerGids: readonly [number, number];
  readonly observerMemories: ReadonlyMap<number, PerceptionMemory>;
  readonly hypotheses: ReadonlyMap<number, readonly IntentCandidateHypothesis[]>;
  readonly trueCandidateId: string;
  readonly alternateCandidateId: string;
  readonly trueTarget: Readonly<{ x: number; y: number }>;
  readonly alternateTarget: Readonly<{ x: number; y: number }>;
  readonly trueArrivalTime: number;
  readonly alternateArrivalTime: number;
}

interface ObserverTrace {
  readonly initial: ObservedIntentEvidence;
  readonly final: ObservedIntentEvidence;
  readonly finalHypotheses: readonly ObservedIntentHypothesisEvidence[];
  readonly evidenceSignatures: readonly string[];
  readonly hypothesisSignatures: readonly string[];
  readonly revocationImmediateSame: boolean | null;
}

interface ArmResult {
  readonly arm: Arm;
  readonly status: BranchStatus;
  readonly physicalSignatures: readonly string[];
  readonly observers: ReadonlyMap<number, ObserverTrace>;
  readonly evidenceSeries: ReadonlyMap<number, readonly string[]>;
  readonly hypothesisSeries: ReadonlyMap<number, readonly string[]>;
  readonly actorStart: Readonly<{ x: number; y: number }>;
  readonly actorEnd: Readonly<{ x: number; y: number }>;
  readonly transaction: PrivateIntentTransaction | null;
  readonly privateTarget: Readonly<{ x: number; y: number }> | null;
  readonly perceptionRngChanges: number;
  readonly nonFinite: number;
  readonly forbiddenActionChanges: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly statuses: Readonly<Record<Arm, BranchStatus>>;
  readonly jointlyCompleted: boolean;
  readonly privateTargetsDiffer: boolean;
  readonly hiddenPhysicalEqual: boolean;
  readonly hiddenEvidenceEqual: boolean;
  readonly hiddenHypothesesEqual: boolean;
  readonly actorExtraTargetProgress: number | null;
  readonly candidateDependent: boolean;
  readonly trueEvidenceImproved: boolean;
  readonly nonIntendedFinite: boolean;
  readonly observersDifferent: boolean;
  readonly agedObserverRecords: number;
  readonly supportedObserverRecords: number;
  readonly revocationImmediateLeaks: number;
  readonly revocationEmbodiedChanges: number;
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
  return boundary - match.simTime >= 4;
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
  ...(evidence.velocityChangeSincePrevious
    ? [evidence.velocityChangeSincePrevious.x, evidence.velocityChangeSincePrevious.y]
    : []),
  ...(evidence.bodyTurnSincePrevious === null ? [] : [evidence.bodyTurnSincePrevious]),
].every(Number.isFinite);

const hypothesesSignature = (values: readonly ObservedIntentHypothesisEvidence[]): string =>
  JSON.stringify(values);

const captureForObserver = (
  match: Match,
  observerGid: number,
  actorGid: number,
  memory: PerceptionMemory,
  seed: number,
  previous: ObservedIntentEvidence | null,
  candidates: readonly IntentCandidateHypothesis[],
): {
  snapshot: PerceptionSnapshot;
  evidence: ObservedIntentEvidence | null;
  hypotheses: readonly ObservedIntentHypothesisEvidence[] | null;
  rngChanged: boolean;
} => {
  const before = (match.rng as unknown as { s: number }).s;
  const snapshot = perceiveSnapshot(
    capturePerceptionTruth(match), observerGid, AWARENESS, seed, memory,
  );
  const after = (match.rng as unknown as { s: number }).s;
  const evidence = captureObservedIntentEvidence(snapshot, actorGid, previous);
  const hypotheses = evidence === null
    ? null
    : evaluateObservedIntentHypotheses(evidence, candidates);
  return { snapshot, evidence, hypotheses, rngChanged: before !== after };
};

const runArm = (state: FrozenIntentState, arm: Arm): ArmResult => {
  const match = cloneSimulationState(state.frozen);
  const memories = new Map([...state.observerMemories].map(([gid, memory]) => [gid, cloneMemory(memory)]));
  const carrier = findPlayer(match, state.carrierGid);
  const actor = findPlayer(match, state.actorGid);
  const observers = state.observerGids.map((gid) => findPlayer(match, gid));
  if (!carrier || !actor || observers.some((observer) => observer === null)) {
    return {
      arm, status: 'schemaFailure', physicalSignatures: [], observers: new Map(),
      evidenceSeries: new Map(), hypothesisSeries: new Map(),
      actorStart: { x: 0, y: 0 }, actorEnd: { x: 0, y: 0 }, transaction: null,
      privateTarget: null, perceptionRngChanges: 0, nonFinite: 0,
      forbiddenActionChanges: 0,
    };
  }
  const carrierRoster = carrier.rosterIdx;
  const actorRoster = actor.rosterIdx;
  const observerRosters = observers.map((observer) => observer!.rosterIdx);
  const actorStart = { x: actor.pos.x, y: actor.pos.y };
  const initialTarget = arm === 'X' ? state.alternateTarget : state.trueTarget;
  const initialArrival = arm === 'X' ? state.alternateArrivalTime : state.trueArrivalTime;
  let transaction = createPrivateIntentTransaction({
    actorGid: state.actorGid,
    referenceGid: state.carrierGid,
    referenceEpoch: state.frozen.simTick,
    targetPoint: initialTarget,
    intendedArrivalTime: initialArrival,
    openedTick: match.simTick,
  });
  if (transaction) transaction = transitionPrivateIntent(transaction, 'committed', match.simTick);
  if (!transaction) {
    return {
      arm, status: 'schemaFailure', physicalSignatures: [], observers: new Map(),
      evidenceSeries: new Map(), hypothesisSeries: new Map(),
      actorStart, actorEnd: actorStart, transaction: null, privateTarget: null,
      perceptionRngChanges: 0, nonFinite: 0, forbiddenActionChanges: 0,
    };
  }

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  const heldActorTarget = { x: actor.pos.x, y: actor.pos.y };
  const actorTarget = arm === 'H' || arm === 'X' ? heldActorTarget : state.trueTarget;
  actor.action = { type: 'MoveToPoint', targetPos: { ...actorTarget }, scores: [] };
  actor.decisionTimer = Number.POSITIVE_INFINITY;
  const fixedObserverTargets = new Map<number, { x: number; y: number }>();
  for (const observer of observers) {
    const target = { x: observer!.pos.x, y: observer!.pos.y };
    fixedObserverTargets.set(observer!.gid, target);
    observer!.action = { type: 'MoveToPoint', targetPos: { ...target }, scores: [] };
    observer!.decisionTimer = Number.POSITIVE_INFINITY;
  }

  const previous = new Map<number, ObservedIntentEvidence>();
  const initial = new Map<number, ObservedIntentEvidence>();
  const evidenceSignatures = new Map<number, string[]>();
  const hypothesisSignatures = new Map<number, string[]>();
  const revocationImmediateSame = new Map<number, boolean | null>();
  let perceptionRngChanges = 0;
  let nonFinite = 0;
  for (const observerGid of state.observerGids) {
    const capture = captureForObserver(
      match, observerGid, state.actorGid, memories.get(observerGid)!, state.seed,
      null, state.hypotheses.get(observerGid)!,
    );
    if (capture.rngChanged) perceptionRngChanges++;
    if (!capture.evidence || !capture.hypotheses) {
      return {
        arm, status: 'schemaFailure', physicalSignatures: [], observers: new Map(),
        evidenceSeries: new Map(), hypothesisSeries: new Map(),
        actorStart, actorEnd: actorStart, transaction, privateTarget: transaction.targetPoint,
        perceptionRngChanges, nonFinite, forbiddenActionChanges: 0,
      };
    }
    if (!finiteEvidence(capture.evidence)) nonFinite++;
    previous.set(observerGid, capture.evidence);
    initial.set(observerGid, capture.evidence);
    evidenceSignatures.set(observerGid, [JSON.stringify(capture.evidence)]);
    hypothesisSignatures.set(observerGid, [hypothesesSignature(capture.hypotheses)]);
    revocationImmediateSame.set(observerGid, null);
  }

  const physicalSignatures = [physicalSignature(match)];
  let status: BranchStatus = 'completed';
  let forbiddenActionChanges = 0;
  for (let step = 1; step <= WINDOW_TICKS; step++) {
    if (arm === 'R' && step === REVOCATION_TICK) {
      const revoked = transitionPrivateIntent(transaction, 'revoked', match.simTick);
      const replacement = revoked === null ? null : replacePrivateIntent(
        revoked, state.alternateTarget, state.alternateArrivalTime, match.simTick,
      );
      if (!replacement) {
        status = 'schemaFailure';
        break;
      }
      transaction = transitionPrivateIntent(replacement, 'committed', match.simTick);
      if (!transaction) {
        status = 'schemaFailure';
        break;
      }
      for (const observerGid of state.observerGids) {
        const capture = captureForObserver(
          match, observerGid, state.actorGid, memories.get(observerGid)!, state.seed,
          previous.get(observerGid)!, state.hypotheses.get(observerGid)!,
        );
        if (capture.rngChanged) perceptionRngChanges++;
        revocationImmediateSame.set(observerGid,
          capture.evidence !== null
          && JSON.stringify(capture.evidence) === JSON.stringify({
            ...previous.get(observerGid)!,
            displacementSincePrevious: null,
            velocityChangeSincePrevious: null,
            bodyTurnSincePrevious: null,
          }));
      }
      actor.action = {
        type: 'MoveToPoint', targetPos: { ...state.alternateTarget }, scores: [],
      };
    }

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
      carrier.sentOff || actor.sentOff
      || carrier.rosterIdx !== carrierRoster || actor.rosterIdx !== actorRoster
      || observers.some((observer, index) => (
        observer!.sentOff || observer!.rosterIdx !== observerRosters[index]
      ))
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') forbiddenActionChanges++;
    if (actor.action.type !== 'MoveToPoint') forbiddenActionChanges++;
    for (const observer of observers) {
      const fixed = fixedObserverTargets.get(observer!.gid)!;
      if (
        observer!.action.type !== 'MoveToPoint'
        || observer!.action.targetPos?.x !== fixed.x
        || observer!.action.targetPos?.y !== fixed.y
      ) forbiddenActionChanges++;
    }
    if (forbiddenActionChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }

    for (const observerGid of state.observerGids) {
      const capture = captureForObserver(
        match, observerGid, state.actorGid, memories.get(observerGid)!, state.seed,
        previous.get(observerGid)!, state.hypotheses.get(observerGid)!,
      );
      if (capture.rngChanged) perceptionRngChanges++;
      if (!capture.evidence || !capture.hypotheses) {
        status = 'observerUnsupported';
        break;
      }
      if (!finiteEvidence(capture.evidence)) nonFinite++;
      previous.set(observerGid, capture.evidence);
      evidenceSignatures.get(observerGid)!.push(JSON.stringify(capture.evidence));
      hypothesisSignatures.get(observerGid)!.push(hypothesesSignature(capture.hypotheses));
    }
    if (status !== 'completed') break;
  }

  const traces = new Map<number, ObserverTrace>();
  if (status === 'completed') {
    for (const observerGid of state.observerGids) {
      const final = previous.get(observerGid)!;
      const finalHypotheses = evaluateObservedIntentHypotheses(
        final, state.hypotheses.get(observerGid)!,
      );
      if (!finalHypotheses) {
        status = 'schemaFailure';
        break;
      }
      traces.set(observerGid, {
        initial: initial.get(observerGid)!,
        final,
        finalHypotheses,
        evidenceSignatures: evidenceSignatures.get(observerGid)!,
        hypothesisSignatures: hypothesisSignatures.get(observerGid)!,
        revocationImmediateSame: revocationImmediateSame.get(observerGid)!,
      });
    }
  }
  return {
    arm,
    status,
    physicalSignatures,
    observers: traces,
    evidenceSeries: evidenceSignatures,
    hypothesisSeries: hypothesisSignatures,
    actorStart,
    actorEnd: { x: actor.pos.x, y: actor.pos.y },
    transaction,
    privateTarget: transaction?.targetPoint ?? null,
    perceptionRngChanges,
    nonFinite,
    forbiddenActionChanges,
  };
};

const distance = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

const candidateDependent = (
  values: readonly ObservedIntentHypothesisEvidence[],
): boolean => {
  const fields = [
    'velocityBearingAlignment',
    'displacementBearingAlignment',
    'bodyBearingAlignment',
  ] as const;
  return fields.some((field) => {
    const finite = values.map((value) => value[field])
      .filter((value): value is number => value !== null && Number.isFinite(value));
    return finite.length >= 2 && Math.max(...finite) - Math.min(...finite) >= DEPENDENCE_RESOLUTION;
  });
};

const trueEvidenceImproved = (
  embodied: readonly ObservedIntentHypothesisEvidence[],
  held: readonly ObservedIntentHypothesisEvidence[],
  candidateId: string,
): boolean => {
  const e = embodied.find((value) => value.candidateId === candidateId);
  const h = held.find((value) => value.candidateId === candidateId);
  if (!e || !h) return false;
  for (const field of ['velocityBearingAlignment', 'displacementBearingAlignment'] as const) {
    const embodiedValue = e[field];
    const heldValue = h[field];
    if (
      embodiedValue !== null
      && embodiedValue >= TRUE_ALIGNMENT_FLOOR
      && (heldValue === null || embodiedValue - heldValue >= DEPENDENCE_RESOLUTION)
    ) return true;
  }
  return false;
};

const someNonIntendedFinite = (
  values: readonly ObservedIntentHypothesisEvidence[],
  intendedId: string,
): boolean => values.some((value) => value.candidateId !== intendedId && [
  value.velocityBearingAlignment,
  value.displacementBearingAlignment,
  value.bodyBearingAlignment,
  value.observedClosingSpeed,
].some((field) => field !== null && Number.isFinite(field)));

const statusMap = (arms: ReadonlyMap<Arm, ArmResult>): Record<Arm, BranchStatus> => ({
  H: arms.get('H')!.status,
  X: arms.get('X')!.status,
  E: arms.get('E')!.status,
  R: arms.get('R')!.status,
});

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  let perceptionRngChanges = 0;
  let nonFinite = 0;
  let forbiddenActionChanges = 0;
  let unsupportedChecks = 0;
  let unsupportedFailures = 0;
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
      const possibleActors: {
        gid: number;
        candidates: readonly OffBallAffordance[];
      }[] = [];
      for (const actor of match.teams[carrier.side].players) {
        if (actor === carrier || actor.sentOff || actor.role === 'GK') continue;
        const actorSnapshot = snapshots.get(actor.gid);
        if (!actorSnapshot) continue;
        const offers = evaluateOffBallAffordances({
          snapshot: actorSnapshot,
          playerGid: actor.gid,
          carrierGid: carrier.gid,
          attackDir,
          reachProfiles: profiles,
        });
        if (!offers) continue;
        const candidates = offers.filter((offer) => (
          offer.candidate.id !== 'hold'
          && offer.candidate.sampleHorizon === 0.75
          && offer.offsideMargin <= 0
          && finiteOffer(offer)
        )).sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));
        if (candidates.length >= 2) possibleActors.push({ gid: actor.gid, candidates });
      }
      possibleActors.sort((left, right) => left.gid - right.gid);

      let frozenState: FrozenIntentState | null = null;
      for (const possible of possibleActors) {
        const first = possible.candidates[0];
        const alternate = possible.candidates.find((candidate) =>
          distance(candidate.candidate.point, first.candidate.point) >= 2);
        if (!alternate) continue;
        const possibleObservers: {
          gid: number;
          memory: PerceptionMemory;
          hypotheses: readonly IntentCandidateHypothesis[];
        }[] = [];
        for (const observer of match.teams[carrier.side].players) {
          if (
            observer.gid === possible.gid
            || observer.gid === carrier.gid
            || observer.role === 'GK'
            || observer.sentOff
          ) continue;
          const observerSnapshot = snapshots.get(observer.gid);
          const memory = memories.get(observer.gid);
          const observedActor = observerSnapshot?.players.find((entry) => entry.gid === possible.gid);
          const actorProfile = profiles.get(possible.gid);
          if (!observerSnapshot || !memory || !observedActor || !actorProfile) continue;
          const generated = generateOffBallCandidates(observedActor, actorProfile, attackDir)
            .map((candidate) => ({ id: candidate.id, point: { ...candidate.point } }))
            .sort((left, right) => left.id.localeCompare(right.id));
          if (
            generated.length >= 5
            && generated.some((candidate) => candidate.id === first.candidate.id)
            && generated.some((candidate) => candidate.id === alternate.candidate.id)
          ) possibleObservers.push({
            gid: observer.gid,
            memory: cloneMemory(memory),
            hypotheses: generated,
          });
        }
        possibleObservers.sort((left, right) => left.gid - right.gid);
        if (possibleObservers.length < 2) continue;
        const chosenObservers = possibleObservers.slice(0, 2) as [
          typeof possibleObservers[number], typeof possibleObservers[number],
        ];
        frozenState = {
          key: `${seed}:${match.simTick}:${carrier.gid}:${possible.gid}:${chosenObservers[0].gid}:${chosenObservers[1].gid}`,
          seed,
          frozen: cloneSimulationState(match),
          carrierGid: carrier.gid,
          actorGid: possible.gid,
          observerGids: [chosenObservers[0].gid, chosenObservers[1].gid],
          observerMemories: new Map(chosenObservers.map((observer) => [observer.gid, observer.memory])),
          hypotheses: new Map(chosenObservers.map((observer) => [observer.gid, observer.hypotheses])),
          trueCandidateId: first.candidate.id,
          alternateCandidateId: alternate.candidate.id,
          trueTarget: { ...first.candidate.point },
          alternateTarget: { ...alternate.candidate.point },
          trueArrivalTime: first.selfArrival,
          alternateArrivalTime: alternate.selfArrival,
        };
        break;
      }
      if (!frozenState) continue;
      accepted = true;
      acceptedStates++;

      const arms = new Map<Arm, ArmResult>();
      for (const arm of ['H', 'X', 'E', 'R'] as const) {
        const result = runArm(frozenState, arm);
        arms.set(arm, result);
        perceptionRngChanges += result.perceptionRngChanges;
        nonFinite += result.nonFinite;
        forbiddenActionChanges += result.forbiddenActionChanges;
      }
      const h = arms.get('H')!;
      const x = arms.get('X')!;
      const e = arms.get('E')!;
      const r = arms.get('R')!;
      const jointlyCompleted = [...arms.values()].every((arm) => arm.status === 'completed');
      const hiddenEvidenceEqual = frozenState.observerGids.every((gid) =>
        canonical(h.evidenceSeries.get(gid)) === canonical(x.evidenceSeries.get(gid)));
      const hiddenHypothesesEqual = frozenState.observerGids.every((gid) =>
        canonical(h.hypothesisSeries.get(gid)) === canonical(x.hypothesisSeries.get(gid)));
      let candidateSignal = false;
      let improved = false;
      let nonIntended = false;
      let observersDifferent = false;
      let agedObserverRecords = 0;
      let supportedObserverRecords = 0;
      let revocationImmediateLeaks = 0;
      let revocationEmbodiedChanges = 0;
      if (jointlyCompleted) {
        const eHypotheses = frozenState.observerGids.map((gid) => e.observers.get(gid)!.finalHypotheses);
        candidateSignal = eHypotheses.some(candidateDependent);
        improved = frozenState.observerGids.some((gid) => trueEvidenceImproved(
          e.observers.get(gid)!.finalHypotheses,
          h.observers.get(gid)!.finalHypotheses,
          frozenState.trueCandidateId,
        ));
        nonIntended = eHypotheses.every((values) =>
          someNonIntendedFinite(values, frozenState.trueCandidateId));
        observersDifferent = canonical(eHypotheses[0]) !== canonical(eHypotheses[1]);
        for (const gid of frozenState.observerGids) {
          supportedObserverRecords++;
          if (e.observers.get(gid)!.final.observationAgeTicks > 0) agedObserverRecords++;
          if (r.observers.get(gid)!.revocationImmediateSame === false) revocationImmediateLeaks++;
          if (
            canonical(r.observers.get(gid)!.final)
            !== canonical(r.observers.get(gid)!.initial)
          ) revocationEmbodiedChanges++;
          unsupportedChecks++;
          const missingActorSnapshot: PerceptionSnapshot = {
            tick: e.observers.get(gid)!.final.observedTick,
            observerGid: gid,
            awareness: AWARENESS,
            ball: null,
            players: [],
          };
          if (captureObservedIntentEvidence(missingActorSnapshot, frozenState.actorGid) !== null) {
            unsupportedFailures++;
          }
        }
      }
      records.push({
        key: frozenState.key,
        seed,
        statuses: statusMap(arms),
        jointlyCompleted,
        privateTargetsDiffer: canonical(h.privateTarget) !== canonical(x.privateTarget),
        hiddenPhysicalEqual: canonical(h.physicalSignatures) === canonical(x.physicalSignatures),
        hiddenEvidenceEqual,
        hiddenHypothesesEqual,
        actorExtraTargetProgress: jointlyCompleted
          ? distance(h.actorEnd, frozenState.trueTarget)
            - distance(e.actorEnd, frozenState.trueTarget)
          : null,
        candidateDependent: candidateSignal,
        trueEvidenceImproved: improved,
        nonIntendedFinite: nonIntended,
        observersDifferent,
        agedObserverRecords,
        supportedObserverRecords,
        revocationImmediateLeaks,
        revocationEmbodiedChanges,
      });
    }
  }

  const completed = records.filter((record) => record.jointlyCompleted);
  // Progress advantage is E progress minus H progress. The stored expression above
  // is expanded for auditability here before verdicting.
  const progressAdvantages = completed.map((record) => {
    const stateRecord = record.actorExtraTargetProgress;
    return stateRecord ?? Number.NEGATIVE_INFINITY;
  });
  const counts = {
    completed: completed.length,
    privacyPhysical: records.filter((record) => record.hiddenPhysicalEqual).length,
    privacyEvidence: records.filter((record) => record.hiddenEvidenceEqual).length,
    privacyHypotheses: records.filter((record) => record.hiddenHypothesesEqual).length,
    privateTargetsDiffer: records.filter((record) => record.privateTargetsDiffer).length,
    progress: progressAdvantages.filter((value) => value >= PROGRESS_RESOLUTION).length,
    candidateDependent: completed.filter((record) => record.candidateDependent).length,
    trueEvidenceImproved: completed.filter((record) => record.trueEvidenceImproved).length,
    nonIntendedFinite: completed.filter((record) => record.nonIntendedFinite).length,
    observersDifferent: completed.filter((record) => record.observersDifferent).length,
    agedObserverStates: completed.filter((record) => record.agedObserverRecords > 0).length,
    supportedObserverRecords: completed.reduce((sum, record) => sum + record.supportedObserverRecords, 0),
    revocationImmediateLeaks: completed.reduce((sum, record) => sum + record.revocationImmediateLeaks, 0),
    revocationEmbodiedChanges: completed.filter((record) => record.revocationEmbodiedChanges > 0).length,
    schemaFailures: records.filter((record) => Object.values(record.statuses).includes('schemaFailure')).length,
  };
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    completed: completed.length >= 72,
    privateTargetsDiffer: counts.privateTargetsDiffer === acceptedStates,
    privacyPhysical: counts.privacyPhysical === acceptedStates,
    privacyEvidence: counts.privacyEvidence === acceptedStates,
    privacyHypotheses: counts.privacyHypotheses === acceptedStates,
    schemaFailures: counts.schemaFailures === 0,
    perceptionRng: perceptionRngChanges === 0,
    finite: nonFinite === 0,
    interventionsHeld: forbiddenActionChanges === 0,
    unsupported: unsupportedFailures === 0 && unsupportedChecks > 0,
    revocationNoLeak: counts.revocationImmediateLeaks === 0,
  };
  const mechanism = {
    progress: counts.progress / Math.max(1, completed.length) >= 0.75,
    candidateDependent: counts.candidateDependent >= 60,
    trueEvidenceImproved: counts.trueEvidenceImproved / Math.max(1, completed.length) >= 0.50,
    nonIntendedFinite: counts.nonIntendedFinite / Math.max(1, completed.length) >= 0.95,
    fullySupported: counts.supportedObserverRecords >= completed.length * 2 * 0.80,
    agedSupport: counts.agedObserverStates >= 20,
    observerSpecific: counts.observersDifferent / Math.max(1, completed.length) >= 0.25,
    revocationEmbodied: counts.revocationEmbodiedChanges / Math.max(1, completed.length) >= 0.50,
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(mechanism).every(Boolean);
  return {
    experiment: 'D-PROC-0T',
    authority: 'PRIVATE-INTENT-OBSERVATION-PROTOCOL',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      revocationTick: REVOCATION_TICK,
      dependenceResolution: DEPENDENCE_RESOLUTION,
      trueAlignmentFloor: TRUE_ALIGNMENT_FLOOR,
      progressResolution: PROGRESS_RESOLUTION,
    },
    support: { scannedSeeds, acceptedStates, completed: completed.length },
    counts,
    diagnostics: {
      perceptionRngChanges,
      nonFinite,
      forbiddenActionChanges,
      unsupportedChecks,
      unsupportedFailures,
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
  `D-PROC-0T ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` · completed ${output.support.completed} · SHA ${sha256}`,
);
