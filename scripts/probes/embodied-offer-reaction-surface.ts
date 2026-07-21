// EOR-0 EMBODIED OFFER REACTION SURFACE (offline only).
// Authority: docs/world-model/EMBODIED-OFFER-REACTION-SURFACE.md
import { createHash } from 'node:crypto';
import {
  createOffBallOfferCommitment,
  evaluateOffBallOfferCoordination,
} from '../../src/ai/offBallCoordination';
import {
  evaluateOffBallAffordances,
  evaluateOffBallCandidate,
  type OffBallAffordance,
  type OffBallCandidatePoint,
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
import { DT, TEAM_AI_INTERVAL } from '../../src/sim/constants';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 96);
const SEED_START = Number(process.argv[3] ?? 50_000);
const MAX_SEEDS = 192;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const RESPONSE_STEPS = Math.round(TEAM_AI_INTERVAL / DT);
const COMMITMENT_TICKS = Math.round(0.75 / DT);
const EPS = 1e-9;

const A_PROGRESS_RESOLUTION = 0.25;
const OPPONENT_DISPLACEMENT_RESOLUTION = 0.25;
const ARRIVAL_RANGE_RESOLUTION = 0.05;
const DISTANCE_RANGE_RESOLUTION = 0.10;
const MIN_MATCHED_B_CANDIDATES = 5;

type BranchStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';

interface FrozenReactionState {
  readonly key: string;
  readonly seed: number;
  readonly frozen: Match;
  readonly carrierGid: number;
  readonly aGid: number;
  readonly bGid: number;
  readonly aCandidates: readonly OffBallAffordance[];
  readonly bCandidates: readonly OffBallAffordance[];
  readonly bMemory: PerceptionMemory;
}

interface PhysicalBranch {
  readonly match: Match;
  readonly status: BranchStatus;
  readonly snapshot: PerceptionSnapshot;
  readonly signature: string;
  readonly actionChanges: number;
  readonly targetChanges: number;
  readonly nonFinite: number;
  readonly perceptionRngChanges: number;
}

interface DimensionDeltaSummary {
  readonly min: number;
  readonly max: number;
  readonly mean: number;
  readonly range: number;
}

interface InterventionRecord {
  readonly stateKey: string;
  readonly seed: number;
  readonly candidateId: string;
  readonly directionIndex: number | null;
  readonly hStatus: BranchStatus;
  readonly mStatus: BranchStatus;
  readonly completed: boolean;
  readonly aProgressAdvantage: number | null;
  readonly maxOpponentDisplacement: number | null;
  readonly meanOpponentDisplacement: number | null;
  readonly changedOpponentAssignments: number | null;
  readonly matchedBCandidates: number;
  readonly deltas: {
    readonly opponentArrivalMargin: DimensionDeltaSummary | null;
    readonly nearestOpponentDistanceAtArrival: DimensionDeltaSummary | null;
    readonly carrierLaneClearance: DimensionDeltaSummary | null;
    readonly offsideMargin: DimensionDeltaSummary | null;
  };
  readonly bObservesA: boolean | null;
  readonly bObservesCarrier: boolean | null;
  readonly bObservedChangedOpponents: number | null;
  readonly materialEmbodiedReaction: boolean;
  readonly informativeCommitment: boolean;
  readonly informativeCoordinationDimensions: readonly string[];
  readonly commitmentFactReads: number;
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

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= 8;
};

const cloneMemory = (memory: PerceptionMemory): PerceptionMemory => ({
  nextScanTick: memory.nextScanTick,
  ball: memory.ball === null ? null : {
    ...memory.ball,
    pos: { x: memory.ball.pos.x, y: memory.ball.pos.y },
    vel: { x: memory.ball.vel.x, y: memory.ball.vel.y },
  },
  players: new Map([...memory.players.entries()].map(([gid, player]) => [gid, {
    ...player,
    pos: { x: player.pos.x, y: player.pos.y },
    vel: { x: player.vel.x, y: player.vel.y },
    bodyDir: { x: player.bodyDir.x, y: player.bodyDir.y },
  }])),
});

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

const eligibleSurface = (offers: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  offers
    .filter((offer) => offer.offsideMargin <= 0 && finiteOffer(offer))
    .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

const shortMovementCandidates = (
  offers: readonly OffBallAffordance[],
): readonly OffBallAffordance[] => eligibleSurface(offers)
  .filter((offer) =>
    offer.candidate.id !== 'hold'
    && Math.abs(offer.candidate.sampleHorizon - 0.75) <= EPS)
  .sort((left, right) => left.candidate.id.localeCompare(right.candidate.id));

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

const finitePhysicalState = (match: Match, gids: readonly number[]): boolean => [
  match.ball.pos.x,
  match.ball.pos.y,
  match.ball.vel.x,
  match.ball.vel.y,
  ...gids.flatMap((gid) => {
    const player = match.allPlayers[gid];
    return [player.pos.x, player.pos.y, player.vel.x, player.vel.y];
  }),
].every(Number.isFinite);

const runPhysicalBranch = (
  state: FrozenReactionState,
  aTarget: Readonly<{ x: number; y: number }>,
): PhysicalBranch => {
  const branch = cloneSimulationState(state.frozen);
  const memory = cloneMemory(state.bMemory);
  const carrier = branch.allPlayers[state.carrierGid];
  const a = branch.allPlayers[state.aGid];
  const b = branch.allPlayers[state.bGid];
  const carrierRoster = carrier.rosterIdx;
  const aRoster = a.rosterIdx;
  const bRoster = b.rosterIdx;
  const fixedBTarget = { x: b.pos.x, y: b.pos.y };
  const fixedATarget = { x: aTarget.x, y: aTarget.y };

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  a.action = { type: 'MoveToPoint', targetPos: fixedATarget, scores: [] };
  a.decisionTimer = Number.POSITIVE_INFINITY;
  b.action = { type: 'MoveToPoint', targetPos: fixedBTarget, scores: [] };
  b.decisionTimer = Number.POSITIVE_INFINITY;

  let status: BranchStatus = 'completed';
  let actionChanges = 0;
  let targetChanges = 0;
  let nonFinite = 0;
  let perceptionRngChanges = 0;
  let snapshot = perceiveSnapshot(
    capturePerceptionTruth(branch), state.bGid, AWARENESS, state.seed, memory,
  );

  for (let step = 0; step < RESPONSE_STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    const rngBefore = (branch.rng as unknown as { s: number }).s;
    snapshot = perceiveSnapshot(
      capturePerceptionTruth(branch), state.bGid, AWARENESS, state.seed, memory,
    );
    const rngAfter = (branch.rng as unknown as { s: number }).s;
    if (rngBefore !== rngAfter) perceptionRngChanges++;

    if (!finitePhysicalState(branch, [state.carrierGid, state.aGid, state.bGid])) nonFinite++;
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
      || a.sentOff
      || b.sentOff
      || carrier.rosterIdx !== carrierRoster
      || a.rosterIdx !== aRoster
      || b.rosterIdx !== bRoster
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') actionChanges++;
    for (const [player, target] of [[a, fixedATarget], [b, fixedBTarget]] as const) {
      if (player.action.type !== 'MoveToPoint') {
        actionChanges++;
      } else if (
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

  return {
    match: branch,
    status,
    snapshot,
    signature: physicalSignature(branch),
    actionChanges,
    targetChanges,
    nonFinite,
    perceptionRngChanges,
  };
};

const evaluateFixedSurface = (
  branch: PhysicalBranch,
  state: FrozenReactionState,
  candidates: readonly OffBallCandidatePoint[],
): Map<string, OffBallAffordance> => {
  const result = new Map<string, OffBallAffordance>();
  const profiles = profilesOf(branch.match);
  const attackDir = branch.match.teams[branch.match.allPlayers[state.carrierGid].side].attackDir;
  for (const candidate of candidates) {
    const value = evaluateOffBallCandidate({
      snapshot: branch.snapshot,
      playerGid: state.bGid,
      carrierGid: state.carrierGid,
      attackDir,
      reachProfiles: profiles,
    }, candidate);
    if (value !== null && finiteOffer(value)) result.set(candidate.id, value);
  }
  return result;
};

const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

const summarise = (values: readonly number[]): DimensionDeltaSummary | null => {
  if (values.length === 0 || values.some((value) => !Number.isFinite(value))) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return { min, max, mean: mean(values), range: max - min };
};

const differingAssignments = (left: Match, right: Match, defendingSide: number): number => {
  const l = left.teams[defendingSide];
  const r = right.teams[defendingSide];
  const gids = new Set([...l.marks.keys(), ...r.marks.keys()]);
  let changed = 0;
  for (const gid of gids) if (l.marks.get(gid) !== r.marks.get(gid)) changed++;
  const chasers = new Set([...l.chasers, ...r.chasers]);
  for (const gid of chasers) if (l.chasers.has(gid) !== r.chasers.has(gid)) changed++;
  return changed;
};

const nonConstant = (values: readonly (number | null)[]): boolean => {
  const finite = values.filter((value): value is number => value !== null && Number.isFinite(value));
  if (finite.length < 2) return false;
  return Math.max(...finite) - Math.min(...finite) > EPS;
};

const mapObject = <K extends string>(map: ReadonlyMap<K, number>): Record<K, number> =>
  Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right))) as Record<K, number>;

const increment = <K>(map: Map<K, number>, key: K): void => {
  map.set(key, (map.get(key) ?? 0) + 1);
};

let scannedSeeds = 0;
let acceptedStates = 0;
let enumeratedInterventions = 0;
let jointlyCompleted = 0;
let materialEmbodiedReactions = 0;
let informativeCommitments = 0;
let perceptionRngChanges = 0;
let nonFiniteFacts = 0;
let actionChanges = 0;
let targetChanges = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;
let hReplayDifferences = 0;
let baseO0Mutations = 0;
let mcPhysicalDifferences = 0;
let candidateOrderDifferences = 0;
let commitmentCreationFailures = 0;
let candidateConstructionFailures = 0;
let initialPerceptionRngChanges = 0;
let commitmentFactReads = 0;
const materialStates = new Set<string>();
const statusesH = new Map<BranchStatus, number>();
const statusesM = new Map<BranchStatus, number>();
const directionCounts = new Map<string, number>();
const directionMaterial = new Map<string, number>();
const records: InterventionRecord[] = [];

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
    if (rngBefore !== rngAfter) initialPerceptionRngChanges++;

    if (
      match.simTick % SAMPLE_TICKS !== 0
      || match.simTime < 10
      || !beforeAdministrativeBoundary(match)
      || match.phase !== 'playing'
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff || carrier.role === 'GK') continue;

    const profiles = profilesOf(match);
    const actorOffers = new Map<number, {
      surface: readonly OffBallAffordance[];
      short: readonly OffBallAffordance[];
    }>();
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
      if (evaluated === null) continue;
      const surface = eligibleSurface(evaluated);
      const short = shortMovementCandidates(evaluated);
      if (
        surface.length >= MIN_MATCHED_B_CANDIDATES
        && surface.some((offer) => offer.candidate.id === 'hold')
        && short.length >= 4
      ) actorOffers.set(player.gid, { surface, short });
    }
    if (actorOffers.size < 2) continue;
    const actorGids = [...actorOffers.keys()].sort((leftGid, rightGid) => {
      const left = match.allPlayers[leftGid];
      const right = match.allPlayers[rightGid];
      return left.decisionTimer - right.decisionTimer || leftGid - rightGid;
    });
    const [aGid, bGid] = actorGids;
    const bMemory = memories.get(bGid);
    if (!bMemory) continue;
    const state: FrozenReactionState = {
      key: `${seed}:${match.simTick}:${carrier.gid}:${aGid}:${bGid}`,
      seed,
      frozen: cloneSimulationState(match),
      carrierGid: carrier.gid,
      aGid,
      bGid,
      aCandidates: actorOffers.get(aGid)!.short,
      bCandidates: actorOffers.get(bGid)!.surface,
      bMemory: cloneMemory(bMemory),
    };
    acceptedThisSeed = true;
    acceptedStates++;

    let h: PhysicalBranch;
    try {
      const aInitial = state.frozen.allPlayers[state.aGid].pos;
      h = runPhysicalBranch(state, aInitial);
      const hReplay = runPhysicalBranch(state, aInitial);
      if (h.signature !== hReplay.signature || JSON.stringify(h.snapshot) !== JSON.stringify(hReplay.snapshot)) {
        hReplayDifferences++;
      }
    } catch {
      cloneFailures++;
      continue;
    }

    for (const aCandidate of state.aCandidates) {
      enumeratedInterventions++;
      increment(statusesH, h.status);
      const directionKey = String(aCandidate.candidate.directionIndex);
      increment(directionCounts, directionKey);
      let m: PhysicalBranch;
      try {
        m = runPhysicalBranch(state, aCandidate.candidate.point);
        const mReplay = runPhysicalBranch(state, aCandidate.candidate.point);
        if (m.signature !== mReplay.signature || JSON.stringify(m.snapshot) !== JSON.stringify(mReplay.snapshot)) {
          deterministicDifferences++;
        }
      } catch {
        cloneFailures++;
        continue;
      }
      increment(statusesM, m.status);
      perceptionRngChanges += h.perceptionRngChanges + m.perceptionRngChanges;
      nonFiniteFacts += h.nonFinite + m.nonFinite;
      actionChanges += h.actionChanges + m.actionChanges;
      targetChanges += h.targetChanges + m.targetChanges;

      const completed = h.status === 'completed' && m.status === 'completed';
      if (!completed) {
        records.push({
          stateKey: state.key,
          seed,
          candidateId: aCandidate.candidate.id,
          directionIndex: aCandidate.candidate.directionIndex,
          hStatus: h.status,
          mStatus: m.status,
          completed: false,
          aProgressAdvantage: null,
          maxOpponentDisplacement: null,
          meanOpponentDisplacement: null,
          changedOpponentAssignments: null,
          matchedBCandidates: 0,
          deltas: {
            opponentArrivalMargin: null,
            nearestOpponentDistanceAtArrival: null,
            carrierLaneClearance: null,
            offsideMargin: null,
          },
          bObservesA: null,
          bObservesCarrier: null,
          bObservedChangedOpponents: null,
          materialEmbodiedReaction: false,
          informativeCommitment: false,
          informativeCoordinationDimensions: [],
          commitmentFactReads: 0,
        });
        continue;
      }
      jointlyCompleted++;

      const initialA = state.frozen.allPlayers[state.aGid];
      const hA = h.match.allPlayers[state.aGid];
      const mA = m.match.allPlayers[state.aGid];
      const initialTargetDistance = Math.hypot(
        initialA.pos.x - aCandidate.candidate.point.x,
        initialA.pos.y - aCandidate.candidate.point.y,
      );
      const hProgress = initialTargetDistance - Math.hypot(
        hA.pos.x - aCandidate.candidate.point.x,
        hA.pos.y - aCandidate.candidate.point.y,
      );
      const mProgress = initialTargetDistance - Math.hypot(
        mA.pos.x - aCandidate.candidate.point.x,
        mA.pos.y - aCandidate.candidate.point.y,
      );
      const aProgressAdvantage = mProgress - hProgress;

      const attackingSide = initialA.side;
      const opponents = state.frozen.teams[1 - attackingSide].players
        .filter((player) => !player.sentOff)
        .map((initial) => {
          const hp = h.match.allPlayers[initial.gid];
          const mp = m.match.allPlayers[initial.gid];
          return {
            gid: initial.gid,
            displacement: Math.hypot(hp.pos.x - mp.pos.x, hp.pos.y - mp.pos.y),
          };
        });
      const changedOpponentGids = opponents
        .filter((entry) => entry.displacement >= OPPONENT_DISPLACEMENT_RESOLUTION)
        .map((entry) => entry.gid);
      const maxOpponentDisplacement = Math.max(0, ...opponents.map((entry) => entry.displacement));
      const meanOpponentDisplacement = mean(opponents.map((entry) => entry.displacement));

      const fixedCandidates = state.bCandidates.map((offer) => offer.candidate);
      const hSurface = evaluateFixedSurface(h, state, fixedCandidates);
      const mSurface = evaluateFixedSurface(m, state, fixedCandidates);
      const matchedIds = [...hSurface.keys()]
        .filter((id) => mSurface.has(id))
        .sort((left, right) => left.localeCompare(right));
      const delta = (field: keyof Pick<
        OffBallAffordance,
        | 'opponentArrivalMargin'
        | 'nearestOpponentDistanceAtArrival'
        | 'carrierLaneClearance'
        | 'offsideMargin'
      >): number[] => matchedIds.map((id) => mSurface.get(id)![field] - hSurface.get(id)![field]);
      const deltas = {
        opponentArrivalMargin: summarise(delta('opponentArrivalMargin')),
        nearestOpponentDistanceAtArrival: summarise(delta('nearestOpponentDistanceAtArrival')),
        carrierLaneClearance: summarise(delta('carrierLaneClearance')),
        offsideMargin: summarise(delta('offsideMargin')),
      };
      const responseRangeMaterial =
        (deltas.opponentArrivalMargin?.range ?? 0) >= ARRIVAL_RANGE_RESOLUTION
        || (deltas.nearestOpponentDistanceAtArrival?.range ?? 0) >= DISTANCE_RANGE_RESOLUTION
        || (deltas.carrierLaneClearance?.range ?? 0) >= DISTANCE_RANGE_RESOLUTION
        || (deltas.offsideMargin?.range ?? 0) >= DISTANCE_RANGE_RESOLUTION;
      const materialEmbodiedReaction =
        aProgressAdvantage >= A_PROGRESS_RESOLUTION
        && maxOpponentDisplacement >= OPPONENT_DISPLACEMENT_RESOLUTION
        && matchedIds.length >= MIN_MATCHED_B_CANDIDATES
        && responseRangeMaterial;
      if (materialEmbodiedReaction) {
        materialEmbodiedReactions++;
        materialStates.add(state.key);
        increment(directionMaterial, directionKey);
      }

      const commitment = createOffBallOfferCommitment(
        aCandidate, state.frozen.simTick, state.frozen.simTick + COMMITMENT_TICKS,
      );
      let informativeCommitment = false;
      const informativeCoordinationDimensions: string[] = [];
      let localFactReads = 0;
      const baseBefore = JSON.stringify(matchedIds.map((id) => mSurface.get(id)));
      const physicalBefore = m.signature;
      if (commitment === null) {
        commitmentCreationFailures++;
      } else {
        const carrierObserved = m.snapshot.players.find((player) => player.gid === state.carrierGid);
        if (carrierObserved) {
          const facts = matchedIds.map((id) => evaluateOffBallOfferCoordination({
            candidate: mSurface.get(id)!,
            carrierPoint: carrierObserved.pos,
            commitments: [commitment],
            currentTick: m.match.simTick,
          }));
          if (facts.every((entry) => entry !== null && entry.activeCommitmentCount === 1)) {
            const rows = facts as NonNullable<(typeof facts)[number]>[];
            const dimensions = [
              ['nearestTargetDistance', rows.map((entry) => entry.nearestTargetDistance)],
              ['nearestBearingSeparation', rows.map((entry) => entry.nearestBearingSeparation)],
              ['nearestArrivalTimeSeparation', rows.map((entry) => entry.nearestArrivalTimeSeparation)],
              ['nearestCorridorSeparation', rows.map((entry) => entry.nearestCorridorSeparation)],
            ] as const;
            for (const [name, values] of dimensions) {
              localFactReads += values.length;
              if (nonConstant(values)) informativeCoordinationDimensions.push(name);
            }
            informativeCommitment = informativeCoordinationDimensions.length > 0;
          }
        }
      }
      commitmentFactReads += localFactReads;
      if (informativeCommitment) informativeCommitments++;
      if (baseBefore !== JSON.stringify(matchedIds.map((id) => mSurface.get(id)))) baseO0Mutations++;
      if (physicalBefore !== physicalSignature(m.match)) mcPhysicalDifferences++;

      const reversedFacts = commitment === null ? [] : [...matchedIds].reverse().map((id) => {
        const carrierObserved = m.snapshot.players.find((player) => player.gid === state.carrierGid);
        return carrierObserved ? evaluateOffBallOfferCoordination({
          candidate: mSurface.get(id)!,
          carrierPoint: carrierObserved.pos,
          commitments: [commitment],
          currentTick: m.match.simTick,
        }) : null;
      });
      const reversedById = new Map(reversedFacts.map((facts) => [facts?.candidateId ?? '', facts]));
      if (commitment !== null && matchedIds.some((id) =>
        JSON.stringify(evaluateOffBallOfferCoordination({
          candidate: mSurface.get(id)!,
          carrierPoint: m.snapshot.players.find((player) => player.gid === state.carrierGid)!.pos,
          commitments: [commitment],
          currentTick: m.match.simTick,
        })) !== JSON.stringify(reversedById.get(id)))) candidateOrderDifferences++;

      const mObserved = new Set(m.snapshot.players.map((player) => player.gid));
      records.push({
        stateKey: state.key,
        seed,
        candidateId: aCandidate.candidate.id,
        directionIndex: aCandidate.candidate.directionIndex,
        hStatus: h.status,
        mStatus: m.status,
        completed: true,
        aProgressAdvantage,
        maxOpponentDisplacement,
        meanOpponentDisplacement,
        changedOpponentAssignments: differingAssignments(h.match, m.match, 1 - attackingSide),
        matchedBCandidates: matchedIds.length,
        deltas,
        bObservesA: mObserved.has(state.aGid),
        bObservesCarrier: mObserved.has(state.carrierGid),
        bObservedChangedOpponents: changedOpponentGids.filter((gid) => mObserved.has(gid)).length,
        materialEmbodiedReaction,
        informativeCommitment,
        informativeCoordinationDimensions,
        commitmentFactReads: localFactReads,
      });
    }
  }
}

const completedRate = jointlyCompleted / Math.max(1, enumeratedInterventions);
const embodiedRate = materialEmbodiedReactions / Math.max(1, jointlyCompleted);
const informativeRate = informativeCommitments / Math.max(1, jointlyCompleted);
const gates = {
  acceptedStates: acceptedStates === REQUIRED_STATES,
  scannedSeeds: scannedSeeds <= MAX_SEEDS,
  interventionSupport: enumeratedInterventions >= 384,
  completionSupport: completedRate >= 0.75,
  perceptionRngPurity: initialPerceptionRngChanges === 0 && perceptionRngChanges === 0,
  finiteFacts: nonFiniteFacts === 0,
  interventionIntegrity: actionChanges === 0 && targetChanges === 0,
  cloneAndIdentityValidity: cloneFailures === 0,
  deterministicReruns: deterministicDifferences === 0 && hReplayDifferences === 0,
  mcPhysicalIdentity: mcPhysicalDifferences === 0,
  baseO0Immutability: baseO0Mutations === 0,
  candidateOrderInvariance: candidateOrderDifferences === 0,
  commitmentValidity: commitmentCreationFailures === 0,
  embodiedInterventionRate: embodiedRate >= 0.25,
  embodiedStateSupport: materialStates.size >= 60,
  intentInformationRate: informativeRate >= 0.95,
};
const pass = Object.values(gates).every(Boolean);

const report = {
  authority: 'EOR-0 embodied offer reaction surface',
  parameters: {
    seedStart: SEED_START,
    requiredStates: REQUIRED_STATES,
    maxSeeds: MAX_SEEDS,
    responseSteps: RESPONSE_STEPS,
    responseSeconds: RESPONSE_STEPS * DT,
    awareness: AWARENESS,
  },
  support: {
    scannedSeeds,
    acceptedStates,
    enumeratedInterventions,
    jointlyCompleted,
    completedRate,
    materialEmbodiedReactions,
    embodiedRate,
    materialStates: materialStates.size,
    informativeCommitments,
    informativeRate,
    commitmentFactReads,
  },
  directions: Object.fromEntries([...directionCounts.keys()].sort().map((key) => [key, {
    interventions: directionCounts.get(key) ?? 0,
    material: directionMaterial.get(key) ?? 0,
  }])),
  statuses: {
    h: mapObject(statusesH),
    m: mapObject(statusesM),
  },
  validity: {
    candidateConstructionFailures,
    initialPerceptionRngChanges,
    perceptionRngChanges,
    nonFiniteFacts,
    actionChanges,
    targetChanges,
    cloneFailures,
    deterministicDifferences,
    hReplayDifferences,
    baseO0Mutations,
    mcPhysicalDifferences,
    candidateOrderDifferences,
    commitmentCreationFailures,
  },
  records,
  gates,
  pass,
};

const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;

console.log('EOR-0 EMBODIED OFFER REACTION SURFACE');
console.log(
  `accepted ${acceptedStates}/${REQUIRED_STATES} · scanned ${scannedSeeds}/${MAX_SEEDS}`
  + ` · interventions ${enumeratedInterventions} · jointly completed ${jointlyCompleted} (${pct(completedRate)})`,
);
console.log(
  `material embodied ${materialEmbodiedReactions}/${jointlyCompleted} (${pct(embodiedRate)})`
  + ` · states ${materialStates.size}/${acceptedStates}`,
);
console.log(
  `informative commitments ${informativeCommitments}/${jointlyCompleted} (${pct(informativeRate)})`
  + ` · fact reads ${commitmentFactReads}`,
);
console.log(`statuses H ${JSON.stringify(mapObject(statusesH))}`);
console.log(`statuses M ${JSON.stringify(mapObject(statusesM))}`);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
