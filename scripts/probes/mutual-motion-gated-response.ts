// D-MUT-0 MUTUAL MOTION-GATED INTENT RESPONSE.
// Authority: docs/world-model/MUTUAL-MOTION-GATED-RESPONSE.md
//
// D-PROC-1G's banked consumer, symmetrised. Two off-ball teammates hold
// privately conflicting intents; each reads the other ONLY through its own
// gaze-driven observations and three-sample motion-phase evidence, and each runs
// the UNCHANGED motion-gated consumer against the other. No commander, no
// communication channel, no telepathy. Every predicate, lifecycle rule,
// admissibility test, cyclic tie-break and audit is consumed unchanged; the
// mutual configuration is probe-level composition of two consumer instances.
import { createHash } from 'node:crypto';
import { chooseAttentionGaze } from '../../src/ai/attentionPolicy';
import {
  createPrivateIntentTransaction,
  replacePrivateIntent,
  transitionPrivateIntent,
  type IntentCandidateHypothesis,
} from '../../src/ai/intentProcess';
import {
  evaluateIntentReopening,
  type ObserverIntentBelief,
} from '../../src/ai/intentResponse';
import {
  appendObservedMotionSample,
  type ObservedMotionHistory,
} from '../../src/ai/motionEvidence';
import { buildMotionGatedBelief } from '../../src/ai/motionGatedIntentResponse';
import {
  evaluateOffBallAffordances,
  generateOffBallCandidates,
  type OffBallAffordance,
} from '../../src/ai/offBallAffordance';
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  perceiveSnapshot,
  type ObserverGaze,
  type PerceptionMemory,
  type PerceptionSnapshot,
  type PerceptionTruth,
} from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, PLAYER_MIN_DIST } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 91_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 48;
const PROGRESS_RESOLUTION = 0.25;
const SEPARATION_MIN_EXCLUSIVE = 5;
const SEPARATION_MAX_INCLUSIVE = 30;

type Arm = 'N' | 'M';
/** Which of the two symmetric players a per-observer record belongs to. */
type Role = 'A' | 'B';
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

/** One symmetric player's frozen private situation at the acceptance tick. */
interface FrozenSide {
  readonly gid: number;
  readonly memory: PerceptionMemory;
  readonly acceptanceSnapshot: PerceptionSnapshot;
  /** My own frozen offer set — the replacement hypothesis space for ME. */
  readonly ownCandidates: readonly IntentCandidateHypothesis[];
  /** My committed private intent (conflicting with the partner's).  */
  readonly initialTarget: IntentCandidateHypothesis;
  readonly initialArrivalTime: number;
  /** What I can hypothesise about my PARTNER, from my own observation of them. */
  readonly partnerCandidates: readonly IntentCandidateHypothesis[];
}

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly referenceEpoch: number;
  readonly initialSeparation: number;
  readonly sides: Readonly<Record<Role, FrozenSide>>;
}

interface RevisionRecord {
  readonly role: Role;
  readonly step: number;
  readonly observedTick: number;
  readonly fromCandidateId: string;
  readonly toCandidateId: string;
  readonly supportedPartnerCandidateIds: readonly string[];
  readonly conflictedOwnCandidateIds: readonly string[];
  readonly startDistance: number;
  /** Distance still to run when this revision's active span ended. */
  endDistance: number | null;
}

interface SideResult {
  readonly revisions: readonly RevisionRecord[];
  readonly nonEmptySupport: boolean;
  readonly duplicateRevisionTicks: number;
  readonly admissibleViolations: number;
  readonly frozenCandidateViolations: number;
  readonly unsupportedReopenings: number;
  readonly unsupportedRetentionViolations: number;
  readonly nonFinite: number;
  readonly gazeInvalid: number;
  readonly nonNormalisedGaze: number;
  readonly recomputeMismatches: number;
  readonly finalCandidateId: string;
  readonly finalCandidatePoint: Readonly<{ x: number; y: number }>;
  readonly finalPos: Readonly<{ x: number; y: number }>;
  readonly candidateCycle: boolean;
}

interface ArmResult {
  readonly arm: Arm;
  readonly status: BranchStatus;
  readonly physicalSignatures: readonly string[];
  readonly evidenceSignatures: Readonly<Record<Role, readonly string[]>>;
  readonly sides: Readonly<Record<Role, SideResult>>;
  readonly perceptionRngChanges: number;
  readonly forbiddenActionChanges: number;
  readonly firstRevisionStep: number | null;
  readonly finalSeparation: number;
  readonly finalTargetSeparation: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly statuses: Readonly<Record<Arm, BranchStatus>>;
  readonly jointlyCompleted: boolean;
  readonly preRevisionPhysicalEqual: boolean;
  readonly preRevisionEvidenceEqual: boolean;
  readonly initialSeparation: number;
  readonly nFinalSeparation: number;
  readonly nConverged: boolean;
  readonly nRevisions: number;
  readonly mRevisions: number;
  readonly mRevisionsByRole: Readonly<Record<Role, number>>;
  readonly mResolved: boolean;
  readonly mFinalTargetSeparation: number;
  readonly mNonEmptySupport: Readonly<Record<Role, boolean>>;
  readonly mProgressed: number;
  readonly mProgressTotal: number;
  readonly candidateCycle: boolean;
}

const ROLES: readonly Role[] = ['A', 'B'];
const other = (role: Role): Role => (role === 'A' ? 'B' : 'A');

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

/** The intent family D-PROC-1G froze private intents from, applied to BOTH sides. */
const intentOffers = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  offers.filter((offer) => offer.candidate.id !== 'hold' && offer.candidate.sampleHorizon === 0.75);

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

const finiteVector = (value: Readonly<{ x: number; y: number }>): boolean =>
  Number.isFinite(value.x) && Number.isFinite(value.y);

/** One observer's mutable state inside an arm: gaze thread, history, belief. */
interface ObserverRuntime {
  readonly role: Role;
  readonly player: Player;
  readonly partner: Player;
  readonly side: FrozenSide;
  memory: PerceptionMemory;
  history: ObservedMotionHistory | null;
  belief: ObserverIntentBelief | null;
  previousGaze: ObserverGaze | null;
  previousSnapshot: PerceptionSnapshot;
  readonly gazeLog: (ObserverGaze | null)[];
  readonly snapshotLog: PerceptionSnapshot[];
  readonly evidenceSignatures: string[];
  readonly revisions: RevisionRecord[];
  readonly visitedCandidates: string[];
  currentCandidate: IntentCandidateHypothesis;
  lastRevisionObservedTick: number | null;
  nonEmptySupport: boolean;
  duplicateRevisionTicks: number;
  admissibleViolations: number;
  frozenCandidateViolations: number;
  unsupportedReopenings: number;
  unsupportedRetentionViolations: number;
  nonFinite: number;
  gazeInvalid: number;
  nonNormalisedGaze: number;
  recomputeMismatches: number;
  rosterIdx: number;
}

const emptySide = (side: FrozenSide): SideResult => ({
  revisions: [],
  nonEmptySupport: false,
  duplicateRevisionTicks: 0,
  admissibleViolations: 0,
  frozenCandidateViolations: 0,
  unsupportedReopenings: 0,
  unsupportedRetentionViolations: 0,
  nonFinite: 0,
  gazeInvalid: 0,
  nonNormalisedGaze: 0,
  recomputeMismatches: 0,
  finalCandidateId: side.initialTarget.id,
  finalCandidatePoint: { ...side.initialTarget.point },
  finalPos: { x: 0, y: 0 },
  candidateCycle: false,
});

const runArm = (state: FrozenState, arm: Arm): ArmResult => {
  const match = cloneSimulationState(state.frozen);
  const carrier = findPlayer(match, state.carrierGid);
  const players: Partial<Record<Role, Player>> = {};
  for (const role of ROLES) players[role] = findPlayer(match, state.sides[role].gid) ?? undefined;
  const emptyResult = (status: BranchStatus): ArmResult => ({
    arm,
    status,
    physicalSignatures: [],
    evidenceSignatures: { A: [], B: [] },
    sides: { A: emptySide(state.sides.A), B: emptySide(state.sides.B) },
    perceptionRngChanges: 0,
    forbiddenActionChanges: 0,
    firstRevisionStep: null,
    finalSeparation: state.initialSeparation,
    finalTargetSeparation: pointDistance(
      state.sides.A.initialTarget.point, state.sides.B.initialTarget.point,
    ),
  });
  if (!carrier || !players.A || !players.B) return emptyResult('schemaFailure');

  const carrierRoster = carrier.rosterIdx;
  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;

  const runtimes: Partial<Record<Role, ObserverRuntime>> = {};
  let intents: Partial<Record<Role, ReturnType<typeof createPrivateIntentTransaction>>> = {};
  for (const role of ROLES) {
    const side = state.sides[role];
    const player = players[role]!;
    const partner = players[other(role)]!;
    player.action = { type: 'MoveToPoint', targetPos: { ...side.initialTarget.point }, scores: [] };
    player.decisionTimer = Number.POSITIVE_INFINITY;
    runtimes[role] = {
      role,
      player,
      partner,
      side,
      memory: cloneMemory(side.memory),
      history: null,
      belief: null,
      previousGaze: null,
      previousSnapshot: side.acceptanceSnapshot,
      gazeLog: [],
      snapshotLog: [],
      evidenceSignatures: [],
      revisions: [],
      visitedCandidates: [side.initialTarget.id],
      currentCandidate: { id: side.initialTarget.id, point: { ...side.initialTarget.point } },
      lastRevisionObservedTick: null,
      nonEmptySupport: false,
      duplicateRevisionTicks: 0,
      admissibleViolations: 0,
      frozenCandidateViolations: 0,
      unsupportedReopenings: 0,
      unsupportedRetentionViolations: 0,
      nonFinite: 0,
      gazeInvalid: 0,
      nonNormalisedGaze: 0,
      recomputeMismatches: 0,
      rosterIdx: player.rosterIdx,
    };
    const opened = createPrivateIntentTransaction({
      actorGid: side.gid,
      referenceGid: state.carrierGid,
      referenceEpoch: state.referenceEpoch,
      targetPoint: side.initialTarget.point,
      intendedArrivalTime: side.initialArrivalTime,
      openedTick: match.simTick,
    });
    intents[role] = opened === null ? null : transitionPrivateIntent(opened, 'committed', match.simTick);
  }
  if (!intents.A || !intents.B) return emptyResult('schemaFailure');

  const physicalSignatures = [physicalSignature(match)];
  let perceptionRngChanges = 0;
  let forbiddenActionChanges = 0;
  let status: BranchStatus = 'completed';
  let firstRevisionStep: number | null = null;

  // One observer's tick: aim MY gaze at MY PARTNER from my own memory (S3-G1,
  // one-tick latency, previous-gaze fallback), perceive, then refresh my
  // three-sample motion history and my motion-gated belief about them.
  const observe = (runtime: ObserverRuntime, truth: PerceptionTruth): 'ok' | 'unsupported' | 'schema' => {
    const gaze = chooseAttentionGaze(runtime.previousSnapshot, runtime.partner.gid, runtime.previousGaze);
    runtime.gazeLog.push(gaze);
    if (gaze !== null) {
      if (
        gaze.observerGid !== runtime.player.gid
        || !Number.isInteger(gaze.establishedTick)
        || gaze.establishedTick < 0
        || gaze.establishedTick > truth.tick
      ) runtime.gazeInvalid++;
      if (Math.abs(Math.hypot(gaze.gazeDir.x, gaze.gazeDir.y) - 1) > 1e-9) runtime.nonNormalisedGaze++;
    }
    const rngBefore = (match.rng as unknown as { s: number }).s;
    const snapshot = perceiveSnapshot(
      truth, runtime.side.gid, AWARENESS, state.seed, runtime.memory, gaze,
    );
    const rngAfter = (match.rng as unknown as { s: number }).s;
    if (rngBefore !== rngAfter) perceptionRngChanges++;
    runtime.previousGaze = gaze;
    runtime.previousSnapshot = snapshot;
    runtime.snapshotLog.push(snapshot);
    const observedPartner = snapshot.players.find((entry) => entry.gid === runtime.partner.gid);
    if (!observedPartner || !snapshot.players.some((entry) => entry.gid === carrier.gid)) {
      return 'unsupported';
    }
    const next = appendObservedMotionSample(
      snapshot, runtime.partner.gid, state.carrierGid, state.referenceEpoch, runtime.history,
    );
    if (!next) return 'schema';
    runtime.history = next;
    const newestSample = next.samples[next.samples.length - 1];
    if (
      !finiteVector(newestSample.pos)
      || !finiteVector(newestSample.vel)
      || !finiteVector(newestSample.bodyDir)
    ) runtime.nonFinite++;
    const nextBelief = buildMotionGatedBelief({
      history: next,
      actorCandidates: runtime.side.partnerCandidates,
      referenceGid: state.carrierGid,
      referenceEpoch: state.referenceEpoch,
      previous: runtime.belief,
    });
    if (!nextBelief) return 'schema';
    runtime.belief = nextBelief;
    if (runtime.belief.supportedCandidateIds.length > 0) runtime.nonEmptySupport = true;
    runtime.evidenceSignatures.push(JSON.stringify({ history: next, belief: runtime.belief }));
    return 'ok';
  };

  // One observer's consumer tick (M only): the UNCHANGED reopening query,
  // repinned through the same private-intent transaction lifecycle as 1G.
  const consume = (runtime: ObserverRuntime, step: number): 'ok' | 'schema' => {
    if (!runtime.belief) return 'schema';
    const reopening = evaluateIntentReopening({
      belief: runtime.belief,
      actorCandidates: runtime.side.partnerCandidates,
      ownCandidates: runtime.side.ownCandidates,
      currentCandidateId: runtime.currentCandidate.id,
      lastRevisionObservedTick: runtime.lastRevisionObservedTick,
    });
    if (!reopening) return 'schema';
    if (reopening.status === 'unsupported') {
      runtime.unsupportedReopenings++;
      return 'ok';
    }
    if (reopening.status !== 'reopened' || !reopening.replacement) return 'ok';
    if (runtime.lastRevisionObservedTick === reopening.observedTick) runtime.duplicateRevisionTicks++;
    if (!reopening.conflictedOwnCandidateIds.includes(runtime.currentCandidate.id)) {
      runtime.admissibleViolations++;
    }
    const frozenReplacement = runtime.side.ownCandidates.find((candidate) =>
      candidate.id === reopening.replacement!.id);
    if (
      !frozenReplacement
      || frozenReplacement.point.x !== reopening.replacement.point.x
      || frozenReplacement.point.y !== reopening.replacement.point.y
    ) runtime.frozenCandidateViolations++;
    const current = intents[runtime.role];
    const invalidated = current ? transitionPrivateIntent(current, 'invalidated', match.simTick) : null;
    const replacement = invalidated === null ? null : replacePrivateIntent(
      invalidated,
      reopening.replacement.point,
      Math.max(0, pointDistance(runtime.player.pos, reopening.replacement.point) / runtime.player.topSpeed),
      match.simTick,
    );
    const committed = replacement === null
      ? null
      : transitionPrivateIntent(replacement, 'committed', match.simTick);
    if (!committed) return 'schema';
    intents = { ...intents, [runtime.role]: committed };
    // The previous revision's active span ends here — freeze its progress.
    const previousRevision = runtime.revisions[runtime.revisions.length - 1];
    if (previousRevision && previousRevision.endDistance === null) {
      const previousTarget = runtime.side.ownCandidates.find((candidate) =>
        candidate.id === previousRevision.toCandidateId);
      previousRevision.endDistance = previousTarget
        ? pointDistance(runtime.player.pos, previousTarget.point)
        : null;
    }
    runtime.revisions.push({
      role: runtime.role,
      step,
      observedTick: reopening.observedTick,
      fromCandidateId: runtime.currentCandidate.id,
      toCandidateId: reopening.replacement.id,
      supportedPartnerCandidateIds: [...reopening.supportedActorCandidateIds],
      conflictedOwnCandidateIds: [...reopening.conflictedOwnCandidateIds],
      startDistance: pointDistance(runtime.player.pos, reopening.replacement.point),
      endDistance: null,
    });
    runtime.visitedCandidates.push(reopening.replacement.id);
    runtime.currentCandidate = {
      id: reopening.replacement.id,
      point: { ...reopening.replacement.point },
    };
    runtime.player.action = {
      type: 'MoveToPoint', targetPos: { ...reopening.replacement.point }, scores: [],
    };
    runtime.lastRevisionObservedTick = reopening.observedTick;
    if (firstRevisionStep === null) firstRevisionStep = step;
    return 'ok';
  };

  const firstTruth = capturePerceptionTruth(match);
  for (const role of ROLES) {
    const first = observe(runtimes[role]!, firstTruth);
    if (first === 'unsupported') return emptyResult('observerUnsupported');
    if (first === 'schema') return emptyResult('schemaFailure');
  }

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
      carrier.sentOff || carrier.rosterIdx !== carrierRoster
      || ROLES.some((role) => {
        const runtime = runtimes[role]!;
        return runtime.player.sentOff || runtime.player.rosterIdx !== runtime.rosterIdx;
      })
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') forbiddenActionChanges++;
    for (const role of ROLES) {
      const runtime = runtimes[role]!;
      if (
        runtime.player.action.type !== 'MoveToPoint'
        || runtime.player.action.targetPos?.x !== runtime.currentCandidate.point.x
        || runtime.player.action.targetPos?.y !== runtime.currentCandidate.point.y
      ) forbiddenActionChanges++;
    }
    if (forbiddenActionChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }

    const truth = capturePerceptionTruth(match);
    let broke = false;
    for (const role of ROLES) {
      const observed = observe(runtimes[role]!, truth);
      if (observed === 'unsupported') {
        status = 'observerUnsupported';
        broke = true;
        break;
      }
      if (observed === 'schema') {
        status = 'schemaFailure';
        broke = true;
        break;
      }
    }
    if (broke) break;

    if (arm === 'N') continue;
    // Both consumers run, in fixed role order — the probe owns this ordering
    // exactly as 1G's single consumer owned its cyclic tie-break.
    for (const role of ROLES) {
      if (consume(runtimes[role]!, step) === 'schema') {
        status = 'schemaFailure';
        broke = true;
        break;
      }
    }
    if (broke) break;
  }

  const sides: Partial<Record<Role, SideResult>> = {};
  const evidenceSignatures: Partial<Record<Role, readonly string[]>> = {};
  for (const role of ROLES) {
    const runtime = runtimes[role]!;
    // S3-G1 purity audit, per observer: every gaze must be recomputable from
    // that observer's own logged snapshot sequence alone.
    let replayPrevious: ObserverGaze | null = null;
    let replayInput: PerceptionSnapshot = runtime.side.acceptanceSnapshot;
    for (let index = 0; index < runtime.gazeLog.length; index++) {
      const replayGaze = chooseAttentionGaze(replayInput, runtime.partner.gid, replayPrevious);
      if (JSON.stringify(replayGaze) !== JSON.stringify(runtime.gazeLog[index])) {
        runtime.recomputeMismatches++;
      }
      replayPrevious = replayGaze;
      replayInput = runtime.snapshotLog[index];
    }
    // The final revision's span ends at the window edge.
    const lastRevision = runtime.revisions[runtime.revisions.length - 1];
    if (lastRevision && lastRevision.endDistance === null) {
      const target = runtime.side.ownCandidates.find((c) => c.id === lastRevision.toCandidateId);
      lastRevision.endDistance = target
        ? pointDistance(runtime.player.pos, target.point)
        : null;
    }
    let candidateCycle = false;
    for (let index = 2; index < runtime.visitedCandidates.length; index++) {
      if (runtime.visitedCandidates[index] === runtime.visitedCandidates[index - 2]) {
        candidateCycle = true;
      }
    }
    sides[role] = {
      revisions: runtime.revisions,
      nonEmptySupport: runtime.nonEmptySupport,
      duplicateRevisionTicks: runtime.duplicateRevisionTicks,
      admissibleViolations: runtime.admissibleViolations,
      frozenCandidateViolations: runtime.frozenCandidateViolations,
      unsupportedReopenings: runtime.unsupportedReopenings,
      unsupportedRetentionViolations: runtime.unsupportedRetentionViolations,
      nonFinite: runtime.nonFinite,
      gazeInvalid: runtime.gazeInvalid,
      nonNormalisedGaze: runtime.nonNormalisedGaze,
      recomputeMismatches: runtime.recomputeMismatches,
      finalCandidateId: runtime.currentCandidate.id,
      finalCandidatePoint: { ...runtime.currentCandidate.point },
      finalPos: { x: runtime.player.pos.x, y: runtime.player.pos.y },
      candidateCycle,
    };
    evidenceSignatures[role] = runtime.evidenceSignatures;
  }

  return {
    arm,
    status,
    physicalSignatures,
    evidenceSignatures: { A: evidenceSignatures.A!, B: evidenceSignatures.B! },
    sides: { A: sides.A!, B: sides.B! },
    perceptionRngChanges,
    forbiddenActionChanges,
    firstRevisionStep,
    finalSeparation: pointDistance(players.A.pos, players.B.pos),
    finalTargetSeparation: pointDistance(
      runtimes.A!.currentCandidate.point, runtimes.B!.currentCandidate.point,
    ),
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
  let unsupportedRetentionViolations = 0;
  let gazeInvalid = 0;
  let nonNormalisedGaze = 0;
  let recomputeMismatches = 0;

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

      const teammates = match.teams[carrier.side].players
        .filter((player) => player !== carrier && !player.sentOff && player.role !== 'GK')
        .sort((left, right) => left.gid - right.gid);

      // Symmetric acceptance: an unordered pair (A = lower gid), each seeing the
      // other AND the carrier, each with its own offers and its own hypothesis
      // space about the other, and privately conflicting committed intents.
      for (let ai = 0; ai < teammates.length && !state; ai++) {
        for (let bi = ai + 1; bi < teammates.length && !state; bi++) {
          const bodies: Record<Role, Player> = { A: teammates[ai], B: teammates[bi] };
          const separation = pointDistance(bodies.A.pos, bodies.B.pos);
          if (separation <= SEPARATION_MIN_EXCLUSIVE || separation > SEPARATION_MAX_INCLUSIVE) continue;
          const seen: Partial<Record<Role, {
            snapshot: PerceptionSnapshot;
            memory: PerceptionMemory;
            offers: readonly OffBallAffordance[];
            partnerHypotheses: readonly IntentCandidateHypothesis[];
          }>> = {};
          let viable = true;
          for (const role of ROLES) {
            const self = bodies[role];
            const partner = bodies[other(role)];
            const snapshot = snapshots.get(self.gid);
            const memory = memories.get(self.gid);
            const observedPartner = snapshot?.players.find((entry) => entry.gid === partner.gid);
            const partnerProfile = profiles.get(partner.gid);
            if (
              !snapshot || !memory || !observedPartner || !partnerProfile
              || !snapshot.players.some((entry) => entry.gid === carrier.gid)
            ) { viable = false; break; }
            const offersRaw = evaluateOffBallAffordances({
              snapshot,
              playerGid: self.gid,
              carrierGid: carrier.gid,
              attackDir,
              reachProfiles: profiles,
            });
            if (!offersRaw) { viable = false; break; }
            const offers = eligibleOffers(offersRaw);
            if (offers.length < 5) { viable = false; break; }
            seen[role] = {
              snapshot,
              memory,
              offers,
              partnerHypotheses: generateOffBallCandidates(observedPartner, partnerProfile, attackDir)
                .map((candidate) => ({ id: candidate.id, point: { ...candidate.point } }))
                .sort((left, right) => left.id.localeCompare(right.id)),
            };
          }
          if (!viable) continue;

          // Each side's intent must be hypothesisable BY THE PARTNER, and the
          // two targets must physically conflict with each other.
          const intentCandidatesFor = (role: Role): readonly OffBallAffordance[] =>
            intentOffers(seen[role]!.offers).filter((offer) =>
              seen[other(role)]!.partnerHypotheses.some((h) => h.id === offer.candidate.id));
          const aIntents = intentCandidatesFor('A');
          const bIntents = intentCandidatesFor('B');
          for (const aOffer of aIntents) {
            for (const bOffer of bIntents) {
              if (pointDistance(aOffer.candidate.point, bOffer.candidate.point) >= PLAYER_MIN_DIST) {
                continue;
              }
              const chosen: Record<Role, OffBallAffordance> = { A: aOffer, B: bOffer };
              // Each side must retain >= 3 alternatives clear of the OTHER's target.
              const alternatives = (role: Role): number => seen[role]!.offers.filter((offer) =>
                pointDistance(offer.candidate.point, chosen[other(role)].candidate.point)
                  >= PLAYER_MIN_DIST).length;
              if (alternatives('A') < 3 || alternatives('B') < 3) continue;
              const sideOf = (role: Role): FrozenSide => ({
                gid: bodies[role].gid,
                memory: cloneMemory(seen[role]!.memory),
                acceptanceSnapshot: seen[role]!.snapshot,
                ownCandidates: seen[role]!.offers.map((offer) => ({
                  id: offer.candidate.id,
                  point: { ...offer.candidate.point },
                })),
                initialTarget: {
                  id: chosen[role].candidate.id,
                  point: { ...chosen[role].candidate.point },
                },
                initialArrivalTime: chosen[role].selfArrival,
                partnerCandidates: seen[role]!.partnerHypotheses,
              });
              state = {
                key: `${seed}:${match.simTick}:${carrier.gid}:${bodies.A.gid}:${bodies.B.gid}`,
                seed,
                frozen: cloneSimulationState(match),
                carrierGid: carrier.gid,
                referenceEpoch: match.simTick,
                initialSeparation: separation,
                sides: { A: sideOf('A'), B: sideOf('B') },
              };
              break;
            }
            if (state) break;
          }
        }
      }
      if (!state) continue;
      accepted = true;
      acceptedStates++;
      const arms = new Map<Arm, ArmResult>();
      for (const arm of ['N', 'M'] as const) {
        const result = runArm(state, arm);
        arms.set(arm, result);
        if (result.status === 'schemaFailure') schemaFailures++;
        perceptionRngChanges += result.perceptionRngChanges;
        forbiddenActionChanges += result.forbiddenActionChanges;
        for (const role of ROLES) {
          const side = result.sides[role];
          nonFinite += side.nonFinite;
          duplicateRevisionTicks += side.duplicateRevisionTicks;
          admissibleViolations += side.admissibleViolations;
          frozenCandidateViolations += side.frozenCandidateViolations;
          unsupportedReopenings += side.unsupportedReopenings;
          unsupportedRetentionViolations += side.unsupportedRetentionViolations;
          gazeInvalid += side.gazeInvalid;
          nonNormalisedGaze += side.nonNormalisedGaze;
          recomputeMismatches += side.recomputeMismatches;
        }
      }
      const n = arms.get('N')!;
      const m = arms.get('M')!;
      const jointlyCompleted = n.status === 'completed' && m.status === 'completed';
      const prefixLength = m.firstRevisionStep === null
        ? Math.min(n.physicalSignatures.length, m.physicalSignatures.length)
        : m.firstRevisionStep + 1;
      const preRevisionPhysicalEqual = canonical(n.physicalSignatures.slice(0, prefixLength))
        === canonical(m.physicalSignatures.slice(0, prefixLength));
      const preRevisionEvidenceEqual = ROLES.every((role) => {
        const nSide = n.evidenceSignatures[role];
        const mSide = m.evidenceSignatures[role];
        const cut = m.firstRevisionStep === null
          ? Math.min(nSide.length, mSide.length)
          : m.firstRevisionStep + 1;
        return canonical(nSide.slice(0, cut)) === canonical(mSide.slice(0, cut));
      });
      const mRevisionsByRole = { A: m.sides.A.revisions.length, B: m.sides.B.revisions.length };
      const mRevisions = mRevisionsByRole.A + mRevisionsByRole.B;
      const allRevisions = [...m.sides.A.revisions, ...m.sides.B.revisions];
      const progressed = allRevisions.filter((revision) => (
        revision.endDistance !== null
        && revision.startDistance - revision.endDistance >= PROGRESS_RESOLUTION
      )).length;
      records.push({
        key: state.key,
        seed,
        statuses: { N: n.status, M: m.status },
        jointlyCompleted,
        preRevisionPhysicalEqual,
        preRevisionEvidenceEqual,
        initialSeparation: state.initialSeparation,
        nFinalSeparation: n.finalSeparation,
        nConverged: jointlyCompleted && n.finalSeparation < state.initialSeparation,
        nRevisions: n.sides.A.revisions.length + n.sides.B.revisions.length,
        mRevisions,
        mRevisionsByRole,
        mResolved: jointlyCompleted
          && mRevisions > 0
          && m.finalTargetSeparation >= PLAYER_MIN_DIST,
        mFinalTargetSeparation: m.finalTargetSeparation,
        mNonEmptySupport: { A: m.sides.A.nonEmptySupport, B: m.sides.B.nonEmptySupport },
        mProgressed: progressed,
        mProgressTotal: allRevisions.length,
        candidateCycle: m.sides.A.candidateCycle || m.sides.B.candidateCycle,
      });
    }
  }

  const completed = records.filter((record) => record.jointlyCompleted);
  const revisionTotal = completed.reduce((sum, record) => sum + record.mProgressTotal, 0);
  const progressedTotal = completed.reduce((sum, record) => sum + record.mProgressed, 0);
  const counts = {
    completed: completed.length,
    nConverged: completed.filter((record) => record.nConverged).length,
    nRevisions: records.filter((record) => record.nRevisions > 0).length,
    mResolved: completed.filter((record) => record.mResolved).length,
    mRevised: completed.filter((record) => record.mRevisions > 0).length,
    supportA: records.filter((record) => record.mNonEmptySupport.A).length,
    supportB: records.filter((record) => record.mNonEmptySupport.B).length,
    responderA: completed.filter((record) => record.mRevisionsByRole.A > 0).length,
    responderB: completed.filter((record) => record.mRevisionsByRole.B > 0).length,
    responderBoth: completed.filter((record) => (
      record.mRevisionsByRole.A > 0 && record.mRevisionsByRole.B > 0
    )).length,
    revisionTotal,
    progressedTotal,
    maxCombinedRevisions: Math.max(0, ...completed.map((record) => record.mRevisions)),
    maxPerPlayerRevisions: Math.max(
      0,
      ...completed.flatMap((record) => [record.mRevisionsByRole.A, record.mRevisionsByRole.B]),
    ),
    overBudgetStates: completed.filter((record) => record.mRevisions > 4).length,
    candidateCycles: records.filter((record) => record.candidateCycle).length,
    preRevisionPhysicalEqual: records.filter((record) => record.preRevisionPhysicalEqual).length,
    preRevisionEvidenceEqual: records.filter((record) => record.preRevisionEvidenceEqual).length,
  };
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    schema: schemaFailures === 0,
    finite: nonFinite === 0,
    perceptionRng: perceptionRngChanges === 0,
    interventionsHeld: forbiddenActionChanges === 0,
    preRevisionPhysical: counts.preRevisionPhysicalEqual === acceptedStates,
    preRevisionEvidence: counts.preRevisionEvidenceEqual === acceptedStates,
    duplicateRevisionTicks: duplicateRevisionTicks === 0,
    admissibility: admissibleViolations === 0,
    frozenCandidates: frozenCandidateViolations === 0,
    unsupportedRetention: unsupportedRetentionViolations === 0,
    gazeInvalid: gazeInvalid === 0,
    nonNormalisedGaze: nonNormalisedGaze === 0,
    policyRecompute: recomputeMismatches === 0,
  };
  const mechanism = {
    completed: completed.length >= 48,
    materiality: counts.nConverged / Math.max(1, counts.completed) >= 0.70,
    resolved: counts.mResolved / Math.max(1, counts.completed) >= 0.60,
    progress: counts.progressedTotal / Math.max(1, counts.revisionTotal) >= 0.75,
    combinedRevisionBudget: counts.overBudgetStates === 0,
    noCycles: counts.candidateCycles === 0,
    boundedPerPlayerRevisions: counts.maxPerPlayerRevisions <= 3,
    signalBlindN: counts.nRevisions === 0,
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(mechanism).every(Boolean);
  return {
    experiment: 'D-MUT-0',
    authority: 'MUTUAL-MOTION-GATED-RESPONSE',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      progressResolution: PROGRESS_RESOLUTION,
      separationBand: [SEPARATION_MIN_EXCLUSIVE, SEPARATION_MAX_INCLUSIVE],
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
      unsupportedRetentionViolations,
      gazeInvalid,
      nonNormalisedGaze,
      recomputeMismatches,
      statusCensus: records.reduce<Record<string, number>>((census, record) => {
        for (const arm of ['N', 'M'] as const) {
          const key = `${arm}:${record.statuses[arm]}`;
          census[key] = (census[key] ?? 0) + 1;
        }
        return census;
      }, {}),
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
  `D-MUT-0 ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` · completed ${output.support.completed} · converged ${output.counts.nConverged}`
  + ` · resolved ${output.counts.mResolved} · SHA ${sha256}`,
);
