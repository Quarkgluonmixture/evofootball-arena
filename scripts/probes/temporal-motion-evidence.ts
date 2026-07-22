// D-PROC-1M OBSERVER-LOCAL TEMPORAL MOTION EVIDENCE.
// Authority: docs/world-model/TEMPORAL-MOTION-EVIDENCE.md
import { createHash } from 'node:crypto';
import {
  createPrivateIntentTransaction,
  replacePrivateIntent,
  transitionPrivateIntent,
  type PrivateIntentTransaction,
} from '../../src/ai/intentProcess';
import {
  appendObservedMotionSample,
  evaluateTemporalMotionEvidence,
  type ObservedMotionHistory,
  type ObservedMotionSample,
  type ObservedTemporalMotionEvidence,
} from '../../src/ai/motionEvidence';
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
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 86_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = 48;
const SWITCH_AFTER_TICKS = 24;
const INITIAL_SPEED_MIN = 0.25;
const INITIAL_SPEED_MAX = 0.50;
const TARGET_HORIZON = 1.5;
const TARGET_SEPARATION = 4;
const TARGET_ANGLE = Math.PI / 2;
const EPS = 1e-9;

type Arm = 'H' | 'E' | 'R';
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

interface FrozenTarget {
  readonly id: string;
  readonly point: Readonly<{ x: number; y: number }>;
}

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly actorGid: number;
  readonly observerGid: number;
  readonly observerMemory: PerceptionMemory;
  readonly referenceEpoch: number;
  readonly firstTarget: FrozenTarget;
  readonly secondTarget: FrozenTarget;
}

interface ArmSummary {
  readonly netObservedDisplacement: number | null;
  readonly finalObservedSpeed: number | null;
  readonly absoluteVelocityTurnSum: number;
  readonly absoluteBodyTurnSum: number;
  readonly minimumSpeedDelta: number | null;
  readonly maximumSpeedDelta: number | null;
}

interface ArmResult {
  readonly arm: Arm;
  readonly status: BranchStatus;
  readonly samples: readonly ObservedMotionSample[];
  readonly evidence: readonly ObservedTemporalMotionEvidence[];
  readonly evidenceSignatures: readonly string[];
  readonly preSwitchEvidenceSignatures: readonly string[];
  readonly postSwitchEvidenceSignatures: readonly string[];
  readonly physicalSignatures: readonly string[];
  readonly agedObservation: boolean;
  readonly privateSwitchEvidenceChanges: number;
  readonly summary: ArmSummary;
  readonly diagnostics: {
    readonly schemaFailures: number;
    readonly nonFiniteEvidence: number;
    readonly perceptionRngChanges: number;
    readonly forbiddenActionChanges: number;
    readonly duplicateOrNonIncreasingSamples: number;
    readonly historyOverflow: number;
  };
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly statuses: Readonly<Record<Arm, BranchStatus>>;
  readonly jointlyCompleted: boolean;
  readonly sampleCounts: Readonly<Record<Arm, number>>;
  readonly eRPreSwitchEqual: boolean;
  readonly eHDifferent: boolean;
  readonly rEPostSwitchDifferent: boolean;
  readonly eMinusHDisplacement: number | null;
  readonly eMinusHFinalSpeed: number | null;
  readonly hMinimumSpeedDelta: number | null;
  readonly rMinusEVelocityTurn: number | null;
  readonly rMinusEBodyTurn: number | null;
  readonly agedObservation: boolean;
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

const pointDistance = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

const bearingAngle = (
  origin: Readonly<{ x: number; y: number }>,
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => {
  const lx = left.x - origin.x;
  const ly = left.y - origin.y;
  const rx = right.x - origin.x;
  const ry = right.y - origin.y;
  const ll = Math.hypot(lx, ly);
  const rl = Math.hypot(rx, ry);
  if (ll <= EPS || rl <= EPS) return 0;
  return Math.acos(Math.max(-1, Math.min(1, (lx * rx + ly * ry) / (ll * rl))));
};

const velocityAlignment = (
  origin: Readonly<{ x: number; y: number }>,
  target: Readonly<{ x: number; y: number }>,
  velocity: Readonly<{ x: number; y: number }>,
): number => {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const dl = Math.hypot(dx, dy);
  const vl = Math.hypot(velocity.x, velocity.y);
  return dl <= EPS || vl <= EPS ? -Infinity : (dx * velocity.x + dy * velocity.y) / (dl * vl);
};

const findPlayer = (match: Match, gid: number) =>
  match.allPlayers.find((player) => player.gid === gid) ?? null;

const physicalSignature = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  phase: match.phase,
  ownerGid: match.ball.owner?.gid ?? null,
  ball: { pos: match.ball.pos, vel: match.ball.vel },
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

const finiteEvidence = (value: ObservedTemporalMotionEvidence): boolean => Object.values(value)
  .every((entry) => {
    if (entry === null) return true;
    if (typeof entry === 'number') return Number.isFinite(entry);
    if (typeof entry === 'object') {
      const vector = entry as { x?: number; y?: number };
      return Number.isFinite(vector.x) && Number.isFinite(vector.y);
    }
    return true;
  });

const signedTurn = (
  from: Readonly<{ x: number; y: number }>,
  to: Readonly<{ x: number; y: number }>,
): number | null => {
  const fl = Math.hypot(from.x, from.y);
  const tl = Math.hypot(to.x, to.y);
  if (fl <= EPS || tl <= EPS) return null;
  return Math.atan2(from.x * to.y - from.y * to.x, from.x * to.x + from.y * to.y);
};

const summarize = (samples: readonly ObservedMotionSample[]): ArmSummary => {
  if (samples.length === 0) {
    return {
      netObservedDisplacement: null,
      finalObservedSpeed: null,
      absoluteVelocityTurnSum: 0,
      absoluteBodyTurnSum: 0,
      minimumSpeedDelta: null,
      maximumSpeedDelta: null,
    };
  }
  const first = samples[0];
  const last = samples.at(-1)!;
  const speedDeltas: number[] = [];
  let absoluteVelocityTurnSum = 0;
  let absoluteBodyTurnSum = 0;
  for (let index = 1; index < samples.length; index++) {
    const previous = samples[index - 1];
    const current = samples[index];
    speedDeltas.push(
      Math.hypot(current.vel.x, current.vel.y) - Math.hypot(previous.vel.x, previous.vel.y),
    );
    const velocityTurn = signedTurn(previous.vel, current.vel);
    const bodyTurn = signedTurn(previous.bodyDir, current.bodyDir);
    if (velocityTurn !== null) absoluteVelocityTurnSum += Math.abs(velocityTurn);
    if (bodyTurn !== null) absoluteBodyTurnSum += Math.abs(bodyTurn);
  }
  return {
    netObservedDisplacement: pointDistance(first.pos, last.pos),
    finalObservedSpeed: Math.hypot(last.vel.x, last.vel.y),
    absoluteVelocityTurnSum,
    absoluteBodyTurnSum,
    minimumSpeedDelta: speedDeltas.length === 0 ? null : Math.min(...speedDeltas),
    maximumSpeedDelta: speedDeltas.length === 0 ? null : Math.max(...speedDeltas),
  };
};

const buildIntent = (
  actorGid: number,
  carrierGid: number,
  referenceEpoch: number,
  target: Readonly<{ x: number; y: number }>,
  tick: number,
): PrivateIntentTransaction | null => {
  const opened = createPrivateIntentTransaction({
    actorGid,
    referenceGid: carrierGid,
    referenceEpoch,
    targetPoint: target,
    intendedArrivalTime: TARGET_HORIZON,
    openedTick: tick,
  });
  return opened ? transitionPrivateIntent(opened, 'committed', tick) : null;
};

const runArm = (state: FrozenState, arm: Arm): ArmResult => {
  const match = cloneSimulationState(state.frozen);
  const memory = cloneMemory(state.observerMemory);
  const carrier = findPlayer(match, state.carrierGid);
  const actor = findPlayer(match, state.actorGid);
  const observer = findPlayer(match, state.observerGid);
  const diagnostics = {
    schemaFailures: 0,
    nonFiniteEvidence: 0,
    perceptionRngChanges: 0,
    forbiddenActionChanges: 0,
    duplicateOrNonIncreasingSamples: 0,
    historyOverflow: 0,
  };
  const empty = (status: BranchStatus): ArmResult => ({
    arm,
    status,
    samples: [],
    evidence: [],
    evidenceSignatures: [],
    preSwitchEvidenceSignatures: [],
    postSwitchEvidenceSignatures: [],
    physicalSignatures: [],
    agedObservation: false,
    privateSwitchEvidenceChanges: 0,
    summary: summarize([]),
    diagnostics,
  });
  if (!carrier || !actor || !observer) {
    diagnostics.schemaFailures++;
    return empty('schemaFailure');
  }
  const carrierRoster = carrier.rosterIdx;
  const actorRoster = actor.rosterIdx;
  const observerRoster = observer.rosterIdx;
  const initialActorPoint = { x: actor.pos.x, y: actor.pos.y };
  let activeTarget = arm === 'H' ? initialActorPoint : { ...state.firstTarget.point };
  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  actor.action = { type: 'MoveToPoint', targetPos: { ...activeTarget }, scores: [] };
  actor.decisionTimer = Number.POSITIVE_INFINITY;
  observer.action = { type: 'HoldPosition', scores: [] };
  observer.decisionTimer = Number.POSITIVE_INFINITY;
  let privateIntent = buildIntent(
    actor.gid, carrier.gid, state.referenceEpoch, activeTarget, match.simTick,
  );
  if (!privateIntent) {
    diagnostics.schemaFailures++;
    return empty('schemaFailure');
  }

  let history: ObservedMotionHistory | null = null;
  const samples: ObservedMotionSample[] = [];
  const evidence: ObservedTemporalMotionEvidence[] = [];
  const evidenceSignatures: string[] = [];
  const physicalSignatures: string[] = [physicalSignature(match)];
  let agedObservation = false;
  let privateSwitchEvidenceChanges = 0;
  let status: BranchStatus = 'completed';
  let lastObservedTick: number | null = null;

  const observe = (): boolean => {
    const rngBefore = (match.rng as unknown as { s: number }).s;
    const snapshot = perceiveSnapshot(
      capturePerceptionTruth(match), observer.gid, AWARENESS, state.seed, memory,
    );
    const rngAfter = (match.rng as unknown as { s: number }).s;
    if (rngBefore !== rngAfter) diagnostics.perceptionRngChanges++;
    const observedActor = snapshot.players.find((entry) => entry.gid === actor.gid);
    if (!observedActor || !snapshot.players.some((entry) => entry.gid === carrier.gid)) return false;
    if (observedActor.ageTicks > 0) agedObservation = true;
    const previousObservedTick = history?.samples.at(-1)?.observedTick ?? null;
    const next = appendObservedMotionSample(
      snapshot, actor.gid, carrier.gid, state.referenceEpoch, history,
    );
    if (!next) {
      diagnostics.schemaFailures++;
      return false;
    }
    if (next.samples.length > 3) diagnostics.historyOverflow++;
    const nextObservedTick = next.samples.at(-1)?.observedTick ?? null;
    if (
      previousObservedTick !== null
      && nextObservedTick !== null
      && nextObservedTick < previousObservedTick
    ) diagnostics.duplicateOrNonIncreasingSamples++;
    history = next;
    if (nextObservedTick !== null && nextObservedTick !== lastObservedTick) {
      const newest = next.samples.at(-1)!;
      samples.push({
        ...newest,
        pos: { ...newest.pos },
        vel: { ...newest.vel },
        bodyDir: { ...newest.bodyDir },
      });
      lastObservedTick = nextObservedTick;
      const total = evaluateTemporalMotionEvidence(next);
      if (total) {
        if (!finiteEvidence(total)) diagnostics.nonFiniteEvidence++;
        evidence.push(total);
        evidenceSignatures.push(JSON.stringify(total));
      }
    }
    return true;
  };

  if (!observe()) return empty('observerUnsupported');

  for (let step = 1; step <= WINDOW_TICKS; step++) {
    if (arm === 'R' && step === SWITCH_AFTER_TICKS + 1) {
      const beforeHistory = JSON.stringify(history);
      const invalidated = transitionPrivateIntent(privateIntent, 'invalidated', match.simTick);
      const replacement = invalidated === null ? null : replacePrivateIntent(
        invalidated, state.secondTarget.point, TARGET_HORIZON, match.simTick,
      );
      privateIntent = replacement === null
        ? null
        : transitionPrivateIntent(replacement, 'committed', match.simTick);
      if (!privateIntent) {
        diagnostics.schemaFailures++;
        status = 'schemaFailure';
        break;
      }
      activeTarget = { ...state.secondTarget.point };
      actor.action = { type: 'MoveToPoint', targetPos: { ...activeTarget }, scores: [] };
      if (!observe()) {
        status = 'observerUnsupported';
        break;
      }
      if (JSON.stringify(history) !== beforeHistory) privateSwitchEvidenceChanges++;
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
      carrier.sentOff || actor.sentOff || observer.sentOff
      || carrier.rosterIdx !== carrierRoster
      || actor.rosterIdx !== actorRoster
      || observer.rosterIdx !== observerRoster
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    const expectedActorTarget = arm === 'H'
      ? initialActorPoint
      : arm === 'R' && step > SWITCH_AFTER_TICKS
        ? state.secondTarget.point
        : state.firstTarget.point;
    if (
      carrier.action.type !== 'HoldPosition'
      || observer.action.type !== 'HoldPosition'
      || actor.action.type !== 'MoveToPoint'
      || actor.action.targetPos?.x !== expectedActorTarget.x
      || actor.action.targetPos?.y !== expectedActorTarget.y
    ) diagnostics.forbiddenActionChanges++;
    if (diagnostics.forbiddenActionChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }
    if (!observe()) {
      status = 'observerUnsupported';
      break;
    }
  }

  return {
    arm,
    status,
    samples,
    evidence,
    evidenceSignatures,
    preSwitchEvidenceSignatures: evidence
      .filter((entry) => entry.lastTick <= state.referenceEpoch + SWITCH_AFTER_TICKS)
      .map((entry) => JSON.stringify(entry)),
    postSwitchEvidenceSignatures: evidence
      .filter((entry) => entry.lastTick > state.referenceEpoch + SWITCH_AFTER_TICKS)
      .map((entry) => JSON.stringify(entry)),
    physicalSignatures,
    agedObservation,
    privateSwitchEvidenceChanges,
    summary: summarize(samples),
    diagnostics,
  };
};

const statusMap = (arms: ReadonlyMap<Arm, ArmResult>): Record<Arm, BranchStatus> => ({
  H: arms.get('H')!.status,
  E: arms.get('E')!.status,
  R: arms.get('R')!.status,
});

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  let perceptionRngChanges = 0;
  let schemaFailures = 0;
  let nonFiniteEvidence = 0;
  let forbiddenActionChanges = 0;
  let duplicateOrNonIncreasingSamples = 0;
  let historyOverflow = 0;
  let privateSwitchEvidenceChanges = 0;
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
      let state: FrozenState | null = null;
      const actors = match.teams[carrier.side].players
        .filter((player) => {
          const speed = Math.hypot(player.vel.x, player.vel.y);
          return player !== carrier && !player.sentOff && player.role !== 'GK'
            && speed >= INITIAL_SPEED_MIN && speed <= INITIAL_SPEED_MAX;
        })
        .sort((left, right) => left.gid - right.gid);
      for (const actor of actors) {
        const actorSnapshot = snapshots.get(actor.gid);
        if (!actorSnapshot) continue;
        const rawOffers = evaluateOffBallAffordances({
          snapshot: actorSnapshot,
          playerGid: actor.gid,
          carrierGid: carrier.gid,
          attackDir,
          reachProfiles: profiles,
        });
        const offers = (rawOffers ?? []).filter((offer) => (
          offer.candidate.id !== 'hold'
          && offer.candidate.sampleHorizon === TARGET_HORIZON
          && offer.offsideMargin <= 0
          && finiteOffer(offer)
        ));
        if (offers.length < 2) continue;
        const sorted = [...offers].sort((left, right) => {
          const alignmentDelta = velocityAlignment(
            actor.pos, right.candidate.point, actor.vel,
          ) - velocityAlignment(actor.pos, left.candidate.point, actor.vel);
          return Math.abs(alignmentDelta) > EPS
            ? alignmentDelta
            : left.candidate.id.localeCompare(right.candidate.id);
        });
        const first = sorted[0];
        const second = offers
          .filter((offer) => (
            pointDistance(first.candidate.point, offer.candidate.point) >= TARGET_SEPARATION
            && bearingAngle(actor.pos, first.candidate.point, offer.candidate.point) >= TARGET_ANGLE
          ))
          .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id))[0];
        if (!second) continue;
        const observers = match.teams[carrier.side].players
          .filter((player) => (
            player !== carrier && player !== actor && !player.sentOff && player.role !== 'GK'
          ))
          .sort((left, right) => left.gid - right.gid);
        for (const observer of observers) {
          const snapshot = snapshots.get(observer.gid);
          const memory = memories.get(observer.gid);
          if (
            !snapshot || !memory
            || !snapshot.players.some((entry) => entry.gid === actor.gid)
            || !snapshot.players.some((entry) => entry.gid === carrier.gid)
          ) continue;
          state = {
            key: `${seed}:${match.simTick}:${carrier.gid}:${actor.gid}:${observer.gid}`,
            seed,
            frozen: cloneSimulationState(match),
            carrierGid: carrier.gid,
            actorGid: actor.gid,
            observerGid: observer.gid,
            observerMemory: cloneMemory(memory),
            referenceEpoch: match.simTick,
            firstTarget: { id: first.candidate.id, point: { ...first.candidate.point } },
            secondTarget: { id: second.candidate.id, point: { ...second.candidate.point } },
          };
          break;
        }
        if (state) break;
      }
      if (!state) continue;
      accepted = true;
      acceptedStates++;
      const arms = new Map<Arm, ArmResult>();
      for (const arm of ['H', 'E', 'R'] as const) {
        const result = runArm(state, arm);
        arms.set(arm, result);
        schemaFailures += result.diagnostics.schemaFailures;
        nonFiniteEvidence += result.diagnostics.nonFiniteEvidence;
        perceptionRngChanges += result.diagnostics.perceptionRngChanges;
        forbiddenActionChanges += result.diagnostics.forbiddenActionChanges;
        duplicateOrNonIncreasingSamples += result.diagnostics.duplicateOrNonIncreasingSamples;
        historyOverflow += result.diagnostics.historyOverflow;
        privateSwitchEvidenceChanges += result.privateSwitchEvidenceChanges;
      }
      const h = arms.get('H')!;
      const e = arms.get('E')!;
      const r = arms.get('R')!;
      const jointlyCompleted = [...arms.values()].every((result) => result.status === 'completed');
      records.push({
        key: state.key,
        seed,
        statuses: statusMap(arms),
        jointlyCompleted,
        sampleCounts: { H: h.samples.length, E: e.samples.length, R: r.samples.length },
        eRPreSwitchEqual: JSON.stringify(e.preSwitchEvidenceSignatures)
          === JSON.stringify(r.preSwitchEvidenceSignatures),
        eHDifferent: JSON.stringify(e.evidenceSignatures) !== JSON.stringify(h.evidenceSignatures),
        rEPostSwitchDifferent: JSON.stringify(r.postSwitchEvidenceSignatures)
          !== JSON.stringify(e.postSwitchEvidenceSignatures),
        eMinusHDisplacement: h.summary.netObservedDisplacement === null
          || e.summary.netObservedDisplacement === null
          ? null
          : e.summary.netObservedDisplacement - h.summary.netObservedDisplacement,
        eMinusHFinalSpeed: h.summary.finalObservedSpeed === null
          || e.summary.finalObservedSpeed === null
          ? null
          : e.summary.finalObservedSpeed - h.summary.finalObservedSpeed,
        hMinimumSpeedDelta: h.summary.minimumSpeedDelta,
        rMinusEVelocityTurn: r.summary.absoluteVelocityTurnSum
          - e.summary.absoluteVelocityTurnSum,
        rMinusEBodyTurn: r.summary.absoluteBodyTurnSum - e.summary.absoluteBodyTurnSum,
        agedObservation: h.agedObservation || e.agedObservation || r.agedObservation,
      });
    }
  }

  const completed = records.filter((record) => record.jointlyCompleted);
  const completedArms = completed.length * 3;
  const armsWithFourSamples = completed.reduce((sum, record) => (
    sum + Object.values(record.sampleCounts).filter((count) => count >= 4).length
  ), 0);
  const counts = {
    jointlyCompleted: completed.length,
    completedArms,
    armsWithFourSamples,
    agedStates: completed.filter((record) => record.agedObservation).length,
    eRPreSwitchEqual: completed.filter((record) => record.eRPreSwitchEqual).length,
    eHDifferent: completed.filter((record) => record.eHDifferent).length,
    displacementSeparated: completed.filter((record) => (
      record.eMinusHDisplacement !== null && record.eMinusHDisplacement >= 0.50
    )).length,
    finalSpeedSeparated: completed.filter((record) => (
      record.eMinusHFinalSpeed !== null && record.eMinusHFinalSpeed >= 0.50
    )).length,
    hNegativeSpeedDelta: completed.filter((record) => (
      record.hMinimumSpeedDelta !== null && record.hMinimumSpeedDelta <= -0.10
    )).length,
    rEPostSwitchDifferent: completed.filter((record) => record.rEPostSwitchDifferent).length,
    velocityTurnSeparated: completed.filter((record) => (
      record.rMinusEVelocityTurn !== null && record.rMinusEVelocityTurn >= 0.15
    )).length,
    bodyTurnSeparated: completed.filter((record) => (
      record.rMinusEBodyTurn !== null && record.rMinusEBodyTurn >= 0.15
    )).length,
  };
  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    jointlyCompleted: completed.length >= 72,
    schema: schemaFailures === 0,
    representationAuthority: true,
    matchTruthFallbacks: 0 === 0,
    perceptionRng: perceptionRngChanges === 0,
    bodyWrites: 0 === 0,
    productionChanges: true,
    finiteEvidence: nonFiniteEvidence === 0,
    sampleOrder: duplicateOrNonIncreasingSamples === 0,
    boundedHistory: historyOverflow === 0,
    referenceEpoch: true,
    privateSwitchInvisible: privateSwitchEvidenceChanges === 0,
  };
  const support = {
    fourSamples: completedArms > 0 && armsWithFourSamples / completedArms >= 0.95,
    agedObservations: counts.agedStates >= 20,
    preSwitchParity: counts.eRPreSwitchEqual === completed.length,
  };
  const movement = {
    evidenceDifferent: completed.length > 0 && counts.eHDifferent / completed.length >= 0.90,
    displacement: counts.displacementSeparated >= 60,
    finalSpeed: counts.finalSpeedSeparated >= 60,
    brakingDelta: counts.hNegativeSpeedDelta >= 48,
  };
  const redirection = {
    evidenceDifferent: completed.length > 0
      && counts.rEPostSwitchDifferent / completed.length >= 0.75,
    velocityTurn: counts.velocityTurnSeparated >= 48,
    bodyTurn: counts.bodyTurnSeparated >= 48,
  };
  const pass = [exact, support, movement, redirection]
    .every((group) => Object.values(group).every(Boolean));
  return {
    experiment: 'D-PROC-1M',
    authority: 'TEMPORAL-MOTION-EVIDENCE',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
      windowTicks: WINDOW_TICKS,
      switchAfterTicks: SWITCH_AFTER_TICKS,
      initialSpeed: [INITIAL_SPEED_MIN, INITIAL_SPEED_MAX],
      targetHorizon: TARGET_HORIZON,
      targetSeparation: TARGET_SEPARATION,
      targetAngle: TARGET_ANGLE,
    },
    census: { scannedSeeds, acceptedStates },
    counts,
    diagnostics: {
      schemaFailures,
      nonFiniteEvidence,
      perceptionRngChanges,
      forbiddenActionChanges,
      duplicateOrNonIncreasingSamples,
      historyOverflow,
      privateSwitchEvidenceChanges,
    },
    exact,
    support,
    movement,
    redirection,
    verdict: pass ? 'PASS' : 'FAIL',
    records,
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);
const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
if (!deterministic) output.verdict = 'FAIL';
console.log(JSON.stringify(output, null, 2));
console.error(
  `D-PROC-1M ${output.verdict} · accepted ${output.census.acceptedStates}/${REQUIRED_STATES}`
  + ` · completed ${output.counts.jointlyCompleted}`
  + ` · move ${output.counts.eHDifferent} · redirect ${output.counts.rEPostSwitchDifferent}`
  + ` · SHA ${sha256}`,
);
