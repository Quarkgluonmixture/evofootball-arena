// D-TRI-0 TRIADIC MOTION-GATED ROTATION.
// Authority: docs/world-model/TRIADIC-MOTION-GATED-ROTATION.md
//
// D-MUT-0's mutual response and S3-G2's interleaved attention, spent together.
// Three off-ball teammates hold privately conflicting intents in a CHAIN (A–B,
// B–C); each reads its TWO partners only through its own alternating gaze and
// three-sample motion evidence, and runs the UNCHANGED consumer once per partner
// in fixed order, applying the first reopening. No belief merging, no new
// admissibility semantics, zero src changes.
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
const SEED_START = Number(process.argv[3] ?? 95_000);
const MAX_SEEDS = 4096;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 48;
/** S3-G2's banked alternation period: the scan interval at awareness 0.8. */
const SCAN_INTERVAL_TICKS = Math.round(15 - AWARENESS * 9);
const PROGRESS_RESOLUTION = 0.25;
const SEPARATION_MIN_EXCLUSIVE = 5;
const SEPARATION_MAX_INCLUSIVE = 30;

type Arm = 'N' | 'M';
type Role = 'A' | 'B' | 'C';
const ROLES: readonly Role[] = ['A', 'B', 'C'];
/** The chain: A–B and B–C conflict; each player's two partners, in gid order. */
const PARTNERS: Readonly<Record<Role, readonly [Role, Role]>> = {
  A: ['B', 'C'],
  B: ['A', 'C'],
  C: ['A', 'B'],
};
const CHAIN_LINKS: readonly [Role, Role][] = [['A', 'B'], ['B', 'C']];
const ALL_PAIRS: readonly [Role, Role][] = [['A', 'B'], ['B', 'C'], ['A', 'C']];

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

interface FrozenSide {
  readonly gid: number;
  readonly memory: PerceptionMemory;
  readonly acceptanceSnapshot: PerceptionSnapshot;
  readonly ownCandidates: readonly IntentCandidateHypothesis[];
  readonly initialTarget: IntentCandidateHypothesis;
  readonly initialArrivalTime: number;
  /** What I can hypothesise about each partner, from my own observation. */
  readonly partnerCandidates: Readonly<Record<Role, readonly IntentCandidateHypothesis[]>>;
}

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly referenceEpoch: number;
  readonly initialMeanPairDistance: number;
  readonly sides: Readonly<Record<Role, FrozenSide>>;
}

interface RevisionRecord {
  readonly role: Role;
  readonly againstPartner: Role;
  readonly step: number;
  readonly observedTick: number;
  readonly fromCandidateId: string;
  readonly toCandidateId: string;
  readonly startDistance: number;
  endDistance: number | null;
  /** True when this revision's replacement conflicts with the OTHER partner's
   * frozen initial target — the second-order churn signature. */
  readonly conflictsOtherPartnerTarget: boolean;
}

interface SideResult {
  readonly revisions: readonly RevisionRecord[];
  readonly nonEmptySupport: Readonly<Record<Role, boolean>>;
  readonly duplicateRevisionTicks: number;
  readonly admissibleViolations: number;
  readonly frozenCandidateViolations: number;
  readonly unsupportedReopenings: number;
  readonly identityViolations: number;
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
  readonly finalMeanPairDistance: number;
  readonly finalTargetSeparations: readonly number[];
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly statuses: Readonly<Record<Arm, BranchStatus>>;
  readonly jointlyCompleted: boolean;
  readonly preRevisionPhysicalEqual: boolean;
  readonly preRevisionEvidenceEqual: boolean;
  readonly initialMeanPairDistance: number;
  readonly nFinalMeanPairDistance: number;
  readonly nConverged: boolean;
  readonly nRevisions: number;
  readonly mRevisions: number;
  readonly mRevisionsByRole: Readonly<Record<Role, number>>;
  readonly mResolved: boolean;
  readonly mMinTargetSeparation: number;
  readonly mProgressed: number;
  readonly mProgressTotal: number;
  readonly mSecondOrderRevisions: number;
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

/** The intent family D-MUT-0 froze private intents from. */
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

/** S3-G2's probe-owned alternation, over a player's two partners. */
const scheduledPartner = (role: Role, step: number): Role =>
  PARTNERS[role][Math.floor((step - 1) / SCAN_INTERVAL_TICKS) % 2];

interface ObserverRuntime {
  readonly role: Role;
  readonly player: Player;
  readonly partners: Readonly<Record<Role, Player>>;
  readonly side: FrozenSide;
  memory: PerceptionMemory;
  histories: Record<Role, ObservedMotionHistory | null>;
  beliefs: Record<Role, ObserverIntentBelief | null>;
  previousGaze: ObserverGaze | null;
  previousSnapshot: PerceptionSnapshot;
  readonly gazeLog: (ObserverGaze | null)[];
  readonly snapshotLog: PerceptionSnapshot[];
  readonly evidenceSignatures: string[];
  readonly revisions: RevisionRecord[];
  readonly visitedCandidates: string[];
  currentCandidate: IntentCandidateHypothesis;
  lastRevisionObservedTick: number | null;
  nonEmptySupport: Record<Role, boolean>;
  duplicateRevisionTicks: number;
  admissibleViolations: number;
  frozenCandidateViolations: number;
  unsupportedReopenings: number;
  identityViolations: number;
  nonFinite: number;
  gazeInvalid: number;
  nonNormalisedGaze: number;
  recomputeMismatches: number;
  rosterIdx: number;
}

const emptySide = (side: FrozenSide): SideResult => ({
  revisions: [],
  nonEmptySupport: { A: false, B: false, C: false },
  duplicateRevisionTicks: 0,
  admissibleViolations: 0,
  frozenCandidateViolations: 0,
  unsupportedReopenings: 0,
  identityViolations: 0,
  nonFinite: 0,
  gazeInvalid: 0,
  nonNormalisedGaze: 0,
  recomputeMismatches: 0,
  finalCandidateId: side.initialTarget.id,
  finalCandidatePoint: { ...side.initialTarget.point },
  finalPos: { x: 0, y: 0 },
  candidateCycle: false,
});

const meanPairDistance = (positions: Readonly<Record<Role, { x: number; y: number }>>): number =>
  ALL_PAIRS.reduce((sum, [left, right]) =>
    sum + pointDistance(positions[left], positions[right]), 0) / ALL_PAIRS.length;

const runArm = (state: FrozenState, arm: Arm): ArmResult => {
  const match = cloneSimulationState(state.frozen);
  const carrier = findPlayer(match, state.carrierGid);
  const players: Partial<Record<Role, Player>> = {};
  for (const role of ROLES) players[role] = findPlayer(match, state.sides[role].gid) ?? undefined;
  const initialTargetSeparations = ALL_PAIRS.map(([left, right]) =>
    pointDistance(state.sides[left].initialTarget.point, state.sides[right].initialTarget.point));
  const emptyResult = (status: BranchStatus): ArmResult => ({
    arm,
    status,
    physicalSignatures: [],
    evidenceSignatures: { A: [], B: [], C: [] },
    sides: {
      A: emptySide(state.sides.A), B: emptySide(state.sides.B), C: emptySide(state.sides.C),
    },
    perceptionRngChanges: 0,
    forbiddenActionChanges: 0,
    firstRevisionStep: null,
    finalMeanPairDistance: state.initialMeanPairDistance,
    finalTargetSeparations: initialTargetSeparations,
  });
  if (!carrier || ROLES.some((role) => !players[role])) return emptyResult('schemaFailure');

  const carrierRoster = carrier.rosterIdx;
  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;

  const runtimes: Partial<Record<Role, ObserverRuntime>> = {};
  let intents: Partial<Record<Role, ReturnType<typeof createPrivateIntentTransaction>>> = {};
  for (const role of ROLES) {
    const side = state.sides[role];
    const player = players[role]!;
    player.action = { type: 'MoveToPoint', targetPos: { ...side.initialTarget.point }, scores: [] };
    player.decisionTimer = Number.POSITIVE_INFINITY;
    const partnerRoles = PARTNERS[role];
    runtimes[role] = {
      role,
      player,
      partners: {
        A: players.A!, B: players.B!, C: players.C!,
      },
      side,
      memory: cloneMemory(side.memory),
      histories: { A: null, B: null, C: null },
      beliefs: { A: null, B: null, C: null },
      previousGaze: null,
      previousSnapshot: side.acceptanceSnapshot,
      gazeLog: [],
      snapshotLog: [],
      evidenceSignatures: [],
      revisions: [],
      visitedCandidates: [side.initialTarget.id],
      currentCandidate: { id: side.initialTarget.id, point: { ...side.initialTarget.point } },
      lastRevisionObservedTick: null,
      nonEmptySupport: { A: false, B: false, C: false },
      duplicateRevisionTicks: 0,
      admissibleViolations: 0,
      frozenCandidateViolations: 0,
      unsupportedReopenings: 0,
      identityViolations: 0,
      nonFinite: 0,
      gazeInvalid: 0,
      nonNormalisedGaze: 0,
      recomputeMismatches: 0,
      rosterIdx: player.rosterIdx,
    };
    void partnerRoles;
    const opened = createPrivateIntentTransaction({
      actorGid: side.gid,
      referenceGid: state.carrierGid,
      referenceEpoch: state.referenceEpoch,
      targetPoint: side.initialTarget.point,
      intendedArrivalTime: side.initialArrivalTime,
      openedTick: match.simTick,
    });
    intents[role] = opened === null
      ? null
      : transitionPrivateIntent(opened, 'committed', match.simTick);
  }
  if (ROLES.some((role) => !intents[role])) return emptyResult('schemaFailure');

  const physicalSignatures = [physicalSignature(match)];
  let perceptionRngChanges = 0;
  let forbiddenActionChanges = 0;
  let status: BranchStatus = 'completed';
  let firstRevisionStep: number | null = null;

  /**
   * One observer's tick: aim at the SCHEDULED partner (S3-G2 alternation, one
   * tick of reflex latency), perceive once, then refresh the motion history and
   * motion-gated belief for BOTH partners from that single snapshot.
   */
  const observe = (
    runtime: ObserverRuntime, truth: PerceptionTruth, step: number,
  ): 'ok' | 'unsupported' | 'schema' => {
    const attend = scheduledPartner(runtime.role, step);
    const gaze = chooseAttentionGaze(
      runtime.previousSnapshot, runtime.partners[attend].gid, runtime.previousGaze,
    );
    runtime.gazeLog.push(gaze);
    if (gaze !== null) {
      if (
        gaze.observerGid !== runtime.player.gid
        || !Number.isInteger(gaze.establishedTick)
        || gaze.establishedTick < 0
        || gaze.establishedTick > truth.tick
      ) runtime.gazeInvalid++;
      if (Math.abs(Math.hypot(gaze.gazeDir.x, gaze.gazeDir.y) - 1) > 1e-9) {
        runtime.nonNormalisedGaze++;
      }
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
    if (!snapshot.players.some((entry) => entry.gid === carrier.gid)) return 'unsupported';
    const evidence: Record<string, unknown> = {};
    for (const partner of PARTNERS[runtime.role]) {
      const partnerPlayer = runtime.partners[partner];
      const observed = snapshot.players.find((entry) => entry.gid === partnerPlayer.gid);
      if (!observed) return 'unsupported';
      const next = appendObservedMotionSample(
        snapshot, partnerPlayer.gid, state.carrierGid, state.referenceEpoch,
        runtime.histories[partner],
      );
      if (!next) return 'schema';
      runtime.histories[partner] = next;
      const newest = next.samples[next.samples.length - 1];
      if (
        !finiteVector(newest.pos) || !finiteVector(newest.vel) || !finiteVector(newest.bodyDir)
      ) runtime.nonFinite++;
      const belief = buildMotionGatedBelief({
        history: next,
        actorCandidates: runtime.side.partnerCandidates[partner],
        referenceGid: state.carrierGid,
        referenceEpoch: state.referenceEpoch,
        previous: runtime.beliefs[partner],
      });
      if (!belief) return 'schema';
      // Privacy identity audit: a belief may only ever be this observer's own,
      // about this partner.
      if (belief.observerGid !== runtime.side.gid || belief.actorGid !== partnerPlayer.gid) {
        runtime.identityViolations++;
      }
      runtime.beliefs[partner] = belief;
      if (belief.supportedCandidateIds.length > 0) runtime.nonEmptySupport[partner] = true;
      evidence[partner] = { history: next, belief };
    }
    runtime.evidenceSignatures.push(JSON.stringify(evidence));
    return 'ok';
  };

  /** The UNCHANGED consumer, run once per partner in fixed order; first wins. */
  const consume = (runtime: ObserverRuntime, step: number): 'ok' | 'schema' => {
    for (const partner of PARTNERS[runtime.role]) {
      const belief = runtime.beliefs[partner];
      if (!belief) continue;
      const reopening = evaluateIntentReopening({
        belief,
        actorCandidates: runtime.side.partnerCandidates[partner],
        ownCandidates: runtime.side.ownCandidates,
        currentCandidateId: runtime.currentCandidate.id,
        lastRevisionObservedTick: runtime.lastRevisionObservedTick,
      });
      if (!reopening) return 'schema';
      if (reopening.status === 'unsupported') {
        runtime.unsupportedReopenings++;
        continue;
      }
      if (reopening.status !== 'reopened' || !reopening.replacement) continue;
      if (runtime.lastRevisionObservedTick === reopening.observedTick) {
        runtime.duplicateRevisionTicks++;
      }
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
      const invalidated = current
        ? transitionPrivateIntent(current, 'invalidated', match.simTick)
        : null;
      const replaced = invalidated === null ? null : replacePrivateIntent(
        invalidated,
        reopening.replacement.point,
        Math.max(
          0,
          pointDistance(runtime.player.pos, reopening.replacement.point) / runtime.player.topSpeed,
        ),
        match.simTick,
      );
      const committed = replaced === null
        ? null
        : transitionPrivateIntent(replaced, 'committed', match.simTick);
      if (!committed) return 'schema';
      intents = { ...intents, [runtime.role]: committed };
      const previousRevision = runtime.revisions[runtime.revisions.length - 1];
      if (previousRevision && previousRevision.endDistance === null) {
        const previousTarget = runtime.side.ownCandidates.find((candidate) =>
          candidate.id === previousRevision.toCandidateId);
        previousRevision.endDistance = previousTarget
          ? pointDistance(runtime.player.pos, previousTarget.point)
          : null;
      }
      // Second-order churn signature: does this replacement land on top of the
      // OTHER partner's frozen initial target?
      const otherPartner = PARTNERS[runtime.role].find((role) => role !== partner)!;
      const conflictsOtherPartnerTarget = pointDistance(
        reopening.replacement.point, state.sides[otherPartner].initialTarget.point,
      ) < PLAYER_MIN_DIST;
      runtime.revisions.push({
        role: runtime.role,
        againstPartner: partner,
        step,
        observedTick: reopening.observedTick,
        fromCandidateId: runtime.currentCandidate.id,
        toCandidateId: reopening.replacement.id,
        startDistance: pointDistance(runtime.player.pos, reopening.replacement.point),
        endDistance: null,
        conflictsOtherPartnerTarget,
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
      return 'ok'; // first reopening wins; the other partner waits for next tick
    }
    return 'ok';
  };

  const firstTruth = capturePerceptionTruth(match);
  for (const role of ROLES) {
    const first = observe(runtimes[role]!, firstTruth, 1);
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
      const observed = observe(runtimes[role]!, truth, step + 1);
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
    // Per-observer purity: every gaze recomputable from this observer's own
    // logged snapshots plus its own alternation schedule alone.
    let replayPrevious: ObserverGaze | null = null;
    let replayInput: PerceptionSnapshot = runtime.side.acceptanceSnapshot;
    for (let index = 0; index < runtime.gazeLog.length; index++) {
      const attend = scheduledPartner(role, index + 1);
      const replayGaze = chooseAttentionGaze(
        replayInput, runtime.partners[attend].gid, replayPrevious,
      );
      if (JSON.stringify(replayGaze) !== JSON.stringify(runtime.gazeLog[index])) {
        runtime.recomputeMismatches++;
      }
      replayPrevious = replayGaze;
      replayInput = runtime.snapshotLog[index];
    }
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
      nonEmptySupport: { ...runtime.nonEmptySupport },
      duplicateRevisionTicks: runtime.duplicateRevisionTicks,
      admissibleViolations: runtime.admissibleViolations,
      frozenCandidateViolations: runtime.frozenCandidateViolations,
      unsupportedReopenings: runtime.unsupportedReopenings,
      identityViolations: runtime.identityViolations,
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

  const finalPositions = {
    A: { x: players.A!.pos.x, y: players.A!.pos.y },
    B: { x: players.B!.pos.x, y: players.B!.pos.y },
    C: { x: players.C!.pos.x, y: players.C!.pos.y },
  };
  return {
    arm,
    status,
    physicalSignatures,
    evidenceSignatures: {
      A: evidenceSignatures.A!, B: evidenceSignatures.B!, C: evidenceSignatures.C!,
    },
    sides: { A: sides.A!, B: sides.B!, C: sides.C! },
    perceptionRngChanges,
    forbiddenActionChanges,
    firstRevisionStep,
    finalMeanPairDistance: meanPairDistance(finalPositions),
    finalTargetSeparations: ALL_PAIRS.map(([left, right]) => pointDistance(
      runtimes[left]!.currentCandidate.point, runtimes[right]!.currentCandidate.point,
    )),
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
  let identityViolations = 0;
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
      if (teammates.length < 3) continue;

      for (let i = 0; i < teammates.length && !state; i++) {
        for (let j = i + 1; j < teammates.length && !state; j++) {
          for (let k = j + 1; k < teammates.length && !state; k++) {
            const bodies: Record<Role, Player> = {
              A: teammates[i], B: teammates[j], C: teammates[k],
            };
            // Chain links must sit in the banked separation band.
            if (CHAIN_LINKS.some(([left, right]) => {
              const d = pointDistance(bodies[left].pos, bodies[right].pos);
              return d <= SEPARATION_MIN_EXCLUSIVE || d > SEPARATION_MAX_INCLUSIVE;
            })) continue;

            const seen: Partial<Record<Role, {
              snapshot: PerceptionSnapshot;
              memory: PerceptionMemory;
              offers: readonly OffBallAffordance[];
              partnerHypotheses: Record<Role, readonly IntentCandidateHypothesis[]>;
            }>> = {};
            let viable = true;
            for (const role of ROLES) {
              const self = bodies[role];
              const snapshot = snapshots.get(self.gid);
              const memory = memories.get(self.gid);
              if (!snapshot || !memory) { viable = false; break; }
              if (!snapshot.players.some((entry) => entry.gid === carrier.gid)) {
                viable = false;
                break;
              }
              const partnerHypotheses: Record<Role, readonly IntentCandidateHypothesis[]> = {
                A: [], B: [], C: [],
              };
              for (const partner of PARTNERS[role]) {
                const observed = snapshot.players.find((e) => e.gid === bodies[partner].gid);
                const profile = profiles.get(bodies[partner].gid);
                if (!observed || !profile) { viable = false; break; }
                partnerHypotheses[partner] =
                  generateOffBallCandidates(observed, profile, attackDir)
                    .map((candidate) => ({ id: candidate.id, point: { ...candidate.point } }))
                    .sort((left, right) => left.id.localeCompare(right.id));
              }
              if (!viable) break;
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
              seen[role] = { snapshot, memory, offers, partnerHypotheses };
            }
            if (!viable) continue;

            // A player's intent must be hypothesisable by BOTH partners.
            const intentCandidatesFor = (role: Role): readonly OffBallAffordance[] =>
              intentOffers(seen[role]!.offers).filter((offer) =>
                PARTNERS[role].every((partner) =>
                  seen[partner]!.partnerHypotheses[role].some((h) => h.id === offer.candidate.id)));
            const options = {
              A: intentCandidatesFor('A'),
              B: intentCandidatesFor('B'),
              C: intentCandidatesFor('C'),
            };
            for (const bOffer of options.B) {
              // B is the chain's middle: pick it first, then its two neighbours.
              const aOffer = options.A.find((offer) =>
                pointDistance(offer.candidate.point, bOffer.candidate.point) < PLAYER_MIN_DIST);
              if (!aOffer) continue;
              const cOffer = options.C.find((offer) =>
                pointDistance(offer.candidate.point, bOffer.candidate.point) < PLAYER_MIN_DIST);
              if (!cOffer) continue;
              const chosen: Record<Role, OffBallAffordance> = { A: aOffer, B: bOffer, C: cOffer };
              // Each player keeps >= 3 alternatives clear of BOTH partners' targets.
              const alternatives = (role: Role): number => seen[role]!.offers.filter((offer) =>
                PARTNERS[role].every((partner) => pointDistance(
                  offer.candidate.point, chosen[partner].candidate.point,
                ) >= PLAYER_MIN_DIST)).length;
              if (ROLES.some((role) => alternatives(role) < 3)) continue;
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
                key: `${seed}:${match.simTick}:${carrier.gid}`
                  + `:${bodies.A.gid}:${bodies.B.gid}:${bodies.C.gid}`,
                seed,
                frozen: cloneSimulationState(match),
                carrierGid: carrier.gid,
                referenceEpoch: match.simTick,
                initialMeanPairDistance: meanPairDistance({
                  A: bodies.A.pos, B: bodies.B.pos, C: bodies.C.pos,
                }),
                sides: { A: sideOf('A'), B: sideOf('B'), C: sideOf('C') },
              };
              break;
            }
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
          identityViolations += side.identityViolations;
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
      const mRevisionsByRole = {
        A: m.sides.A.revisions.length,
        B: m.sides.B.revisions.length,
        C: m.sides.C.revisions.length,
      };
      const allRevisions = ROLES.flatMap((role) => m.sides[role].revisions);
      const progressed = allRevisions.filter((revision) => (
        revision.endDistance !== null
        && revision.startDistance - revision.endDistance >= PROGRESS_RESOLUTION
      )).length;
      const minTargetSeparation = Math.min(...m.finalTargetSeparations);
      records.push({
        key: state.key,
        seed,
        statuses: { N: n.status, M: m.status },
        jointlyCompleted,
        preRevisionPhysicalEqual,
        preRevisionEvidenceEqual,
        initialMeanPairDistance: state.initialMeanPairDistance,
        nFinalMeanPairDistance: n.finalMeanPairDistance,
        nConverged: jointlyCompleted
          && n.finalMeanPairDistance < state.initialMeanPairDistance,
        nRevisions: ROLES.reduce((sum, role) => sum + n.sides[role].revisions.length, 0),
        mRevisions: mRevisionsByRole.A + mRevisionsByRole.B + mRevisionsByRole.C,
        mRevisionsByRole,
        mResolved: jointlyCompleted
          && allRevisions.length > 0
          && minTargetSeparation >= PLAYER_MIN_DIST,
        mMinTargetSeparation: minTargetSeparation,
        mProgressed: progressed,
        mProgressTotal: allRevisions.length,
        mSecondOrderRevisions: allRevisions.filter((r) => r.conflictsOtherPartnerTarget).length,
        candidateCycle: ROLES.some((role) => m.sides[role].candidateCycle),
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
    responders: ROLES.reduce<Record<string, number>>((tally, role) => {
      tally[role] = completed.filter((record) => record.mRevisionsByRole[role] > 0).length;
      return tally;
    }, {}),
    respondersAll3: completed.filter((record) =>
      ROLES.every((role) => record.mRevisionsByRole[role] > 0)).length,
    revisionTotal,
    progressedTotal,
    secondOrderRevisions: completed.reduce((sum, r) => sum + r.mSecondOrderRevisions, 0),
    maxCombinedRevisions: Math.max(0, ...completed.map((record) => record.mRevisions)),
    maxPerPlayerRevisions: Math.max(
      0,
      ...completed.flatMap((record) => ROLES.map((role) => record.mRevisionsByRole[role])),
    ),
    overBudgetStates: completed.filter((record) => record.mRevisions > 6).length,
    overPerPlayerStates: completed.filter((record) =>
      ROLES.some((role) => record.mRevisionsByRole[role] > 3)).length,
    candidateCycles: records.filter((record) => record.candidateCycle).length,
    preRevisionPhysicalEqual: records.filter((record) => record.preRevisionPhysicalEqual).length,
    preRevisionEvidenceEqual: records.filter((record) => record.preRevisionEvidenceEqual).length,
    meanInitialPairDistance: completed.reduce((s, r) => s + r.initialMeanPairDistance, 0)
      / Math.max(1, completed.length),
    meanNFinalPairDistance: completed.reduce((s, r) => s + r.nFinalMeanPairDistance, 0)
      / Math.max(1, completed.length),
    meanMinTargetSeparation: completed.reduce((s, r) => s + r.mMinTargetSeparation, 0)
      / Math.max(1, completed.length),
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
    identity: identityViolations === 0,
    gazeInvalid: gazeInvalid === 0,
    nonNormalisedGaze: nonNormalisedGaze === 0,
    policyRecompute: recomputeMismatches === 0,
  };
  const share = (value: number): number => value / Math.max(1, counts.completed);
  const mechanism = {
    completed: counts.completed >= 40,
    materiality: share(counts.nConverged) >= 0.70,
    resolved: share(counts.mResolved) >= 0.45,
    progress: counts.progressedTotal / Math.max(1, counts.revisionTotal) >= 0.75,
    combinedRevisionBudget: counts.overBudgetStates === 0,
    perPlayerRevisionBudget: counts.overPerPlayerStates === 0,
    noCycles: counts.candidateCycles === 0,
    signalBlindN: counts.nRevisions === 0,
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(mechanism).every(Boolean);
  // The FAIL axis, per contract §6 — named by the probe, not by prose later.
  const failedAxis = pass ? null : [
    !exact.acceptedStates || !exact.scannedSeeds ? 'acceptance' : null,
    !mechanism.completed ? 'completion' : null,
    !mechanism.materiality ? 'materiality' : null,
    !mechanism.resolved ? 'resolution' : null,
    !mechanism.combinedRevisionBudget || !mechanism.perPlayerRevisionBudget || !mechanism.noCycles
      ? 'churn' : null,
    !mechanism.progress ? 'progress' : null,
  ].filter(Boolean);
  return {
    experiment: 'D-TRI-0',
    authority: 'TRIADIC-MOTION-GATED-ROTATION',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      scanIntervalTicks: SCAN_INTERVAL_TICKS,
      progressResolution: PROGRESS_RESOLUTION,
      separationBand: [SEPARATION_MIN_EXCLUSIVE, SEPARATION_MAX_INCLUSIVE],
      physicalConflictDistance: PLAYER_MIN_DIST,
    },
    support: { scannedSeeds, acceptedStates, completed: counts.completed },
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
      identityViolations,
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
    failedAxis,
    verdict: pass ? 'PASS' : 'FAIL',
    records,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
if (!deterministic) output.verdict = 'FAIL';
console.log(JSON.stringify(output, null, 2));
console.error(
  `D-TRI-0 ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` (scanned ${output.support.scannedSeeds}) · completed ${output.support.completed}`
  + ` · converged ${output.counts.nConverged} · resolved ${output.counts.mResolved}`
  + ` · axis ${output.failedAxis ? output.failedAxis.join(',') : 'none'}`
  + ` · SHA ${sha256}`,
);
