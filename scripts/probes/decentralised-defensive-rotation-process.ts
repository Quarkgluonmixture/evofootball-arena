// D-ROTATE-0 ASSIGNMENT-BLIND DEFENSIVE ROTATION PROCESS GATE.
// D-INTENT-0 adds a separate probe-only local-intent consumer mode.
// Authorities:
//   docs/world-model/DECENTRALISED-DEFENSIVE-ROTATION-PROCESS.md
//   docs/world-model/DECENTRALISED-DEFENSIVE-INTENT-NEGOTIATION.md
import { createHash } from 'node:crypto';
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  perceiveSnapshot,
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
import { CONTROL_RADIUS, DT, HALF_L } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 64);
const INTENT_MODE = process.argv.includes('--intent');
const SEED_START = Number(process.argv[3] ?? (INTENT_MODE ? 65_000 : 64_000));
const MAX_SEEDS = 128;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const SAMPLE_TICKS = Math.round(1 / DT);
const WINDOW_TICKS = Math.round(4 / DT);
const STABLE_TICKS = Math.round(0.20 / DT);
const EVENT_WINDOW_TICKS = Math.round(0.50 / DT);
const MATERIAL_MOVEMENT = 0.25;
const DROTATE_NAMESPACE = 0xd207a7e1;

type Arm = 'commander' | 'local' | 'intent';
type WorldEventKind = 'passStarted' | 'ballReleased' | 'carrierChanged' | 'possessionChanged';

interface FrozenState {
  readonly key: string;
  readonly seed: number;
  readonly attackingSide: Side;
  readonly defendingSide: Side;
  readonly frozen: Match;
  readonly memories: ReadonlyMap<number, PerceptionMemory>;
}

interface ResponsibilityBid {
  readonly gid: number;
  readonly eta: number;
  readonly goalSide: boolean;
  readonly actionType: string;
  readonly pos: Readonly<{ x: number; y: number }>;
}

interface ResponsibilityFrame {
  readonly tick: number;
  readonly carrierGid: number;
  readonly leaderGid: number;
  readonly bids: readonly ResponsibilityBid[];
}

interface WorldEvent {
  readonly tick: number;
  readonly kind: WorldEventKind;
}

interface StableTenure {
  readonly leaderGid: number;
  readonly startTick: number;
  readonly endTick: number;
  readonly confirmationTick: number;
}

interface RotationFingerprint {
  readonly fromGid: number;
  readonly toGid: number;
  readonly boundaryTick: number;
  readonly associatedEvents: readonly WorldEventKind[];
  readonly movement: number;
}

interface RelationCandidate {
  readonly playerGid: number;
  readonly opponentGid: number;
  readonly opponentIndex: number;
  readonly arrivalTime: number;
  readonly preference: number;
  readonly action: 'ChaseBall' | 'MarkOpponent';
  readonly targetPoint: Readonly<{ x: number; y: number }>;
}

interface RelationCommitment extends RelationCandidate {
  readonly committedTick: number;
}

interface NegotiationResult {
  readonly commitments: readonly RelationCommitment[];
  readonly proposalChanges: number;
  readonly rounds: number;
  readonly converged: boolean;
  readonly duplicateOpponentClaims: number;
  readonly unsupportedIdentities: number;
  readonly nonFiniteCandidates: number;
  readonly inputOrderDifference: number;
}

interface TimelineAnalysis {
  readonly stableTenures: readonly StableTenure[];
  readonly fingerprints: readonly RotationFingerprint[];
}

interface ArmResult {
  readonly arm: Arm;
  readonly completed: boolean;
  readonly eligibleTicks: number;
  readonly supportedBidTicks: number;
  readonly events: readonly WorldEvent[];
  readonly frames: readonly ResponsibilityFrame[];
  readonly analysis: TimelineAnalysis;
  readonly assignmentPublications: number;
  readonly brainFirings: number;
  readonly brainTimerSuppressions: number;
  readonly perceptionRngChanges: number;
  readonly nonFiniteBids: number;
  readonly probeActionWrites: number;
  readonly probeTargetWrites: number;
  readonly orderDifferences: number;
  readonly maxCommitments: number;
  readonly duplicateSettlementChanges: number;
  readonly actionTypes: readonly string[];
  readonly negotiationNonConvergence: number;
  readonly duplicateOpponentClaims: number;
  readonly unsupportedIdentities: number;
  readonly nonFiniteCandidates: number;
  readonly negotiationOrderDifferences: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly commander: {
    readonly completed: boolean;
    readonly eventCount: number;
    readonly stableTenures: number;
    readonly fingerprints: number;
  };
  readonly local: {
    readonly completed: boolean;
    readonly eventKinds: readonly WorldEventKind[];
    readonly stableTenures: number;
    readonly fingerprints: readonly RotationFingerprint[];
  };
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
    pos: { x: memory.ball.pos.x, y: memory.ball.pos.y },
    vel: { x: memory.ball.vel.x, y: memory.ball.vel.y },
  },
  players: new Map([...memory.players.entries()].map(([gid, entry]) => [gid, {
    ...entry,
    pos: { x: entry.pos.x, y: entry.pos.y },
    vel: { x: entry.vel.x, y: entry.vel.y },
    bodyDir: { x: entry.bodyDir.x, y: entry.bodyDir.y },
  }])),
});

const cloneMemories = (
  memories: ReadonlyMap<number, PerceptionMemory>,
): Map<number, PerceptionMemory> => new Map(
  [...memories.entries()].map(([gid, memory]) => [gid, cloneMemory(memory)]),
);

const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(
  match.allPlayers
    .filter((player) => !player.sentOff)
    .map((player) => [player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    }]),
);

const reachState = (
  player: PerceptionSnapshot['players'][number],
  profile: KnownReachProfile,
): ReachState => ({
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

const ownGoal = (side: Side): Readonly<{ x: number; y: number }> => ({
  x: side === 0 ? -HALF_L : HALF_L,
  y: 0,
});

const distance = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

const bidFromSnapshot = (
  snapshot: PerceptionSnapshot,
  defenderGid: number,
  carrierGid: number,
  defendingSide: Side,
  profile: KnownReachProfile,
  actionType: string,
): ResponsibilityBid | null => {
  const self = snapshot.players.find((entry) => entry.gid === defenderGid);
  const carrier = snapshot.players.find((entry) => entry.gid === carrierGid);
  if (!self || !carrier || self.side !== defendingSide || carrier.side === defendingSide) {
    return null;
  }
  const eta = estimateReach(reachState(self, profile), carrier.pos, {
    reachRadius: CONTROL_RADIUS,
  }).eta;
  if (!Number.isFinite(eta)) return null;
  const goal = ownGoal(defendingSide);
  return {
    gid: defenderGid,
    eta,
    goalSide: distance(self.pos, goal) < distance(carrier.pos, goal),
    actionType,
    pos: { x: self.pos.x, y: self.pos.y },
  };
};

const eventKindsNear = (
  events: readonly WorldEvent[],
  boundaryTick: number,
): readonly WorldEventKind[] => [...new Set(events
  .filter((event) => Math.abs(event.tick - boundaryTick) <= EVENT_WINDOW_TICKS)
  .map((event) => event.kind))].sort();

const bidAt = (
  frame: ResponsibilityFrame,
  gid: number,
): ResponsibilityBid | null => frame.bids.find((bid) => bid.gid === gid) ?? null;

const actionChangedNear = (
  frames: readonly ResponsibilityFrame[],
  gid: number,
  boundaryTick: number,
): boolean => {
  const actions = frames
    .filter((frame) => Math.abs(frame.tick - boundaryTick) <= EVENT_WINDOW_TICKS)
    .map((frame) => bidAt(frame, gid)?.actionType ?? null)
    .filter((action): action is string => action !== null);
  return actions.some((action, index) => index > 0 && action !== actions[index - 1]);
};

const frameAtOrAfter = (
  frames: readonly ResponsibilityFrame[],
  tick: number,
): ResponsibilityFrame | null => frames.find((frame) => frame.tick >= tick) ?? null;

const frameAtOrBefore = (
  frames: readonly ResponsibilityFrame[],
  tick: number,
): ResponsibilityFrame | null => {
  for (let index = frames.length - 1; index >= 0; index--) {
    if (frames[index].tick <= tick) return frames[index];
  }
  return null;
};

const analyseTimeline = (
  sourceFrames: readonly ResponsibilityFrame[],
  events: readonly WorldEvent[],
  reverseBids = false,
): TimelineAnalysis => {
  const frames = sourceFrames.map((frame) => {
    const bids = reverseBids ? [...frame.bids].reverse() : frame.bids;
    const leader = [...bids].sort((left, right) => left.eta - right.eta || left.gid - right.gid)[0];
    return { ...frame, leaderGid: leader.gid, bids };
  });
  const runs: Array<{ leaderGid: number; startTick: number; endTick: number }> = [];
  for (const frame of frames) {
    const last = runs[runs.length - 1];
    if (
      last
      && last.leaderGid === frame.leaderGid
      && frame.tick === last.endTick + 1
    ) {
      last.endTick = frame.tick;
    } else {
      runs.push({
        leaderGid: frame.leaderGid,
        startTick: frame.tick,
        endTick: frame.tick,
      });
    }
  }
  const stableTenures: StableTenure[] = runs
    .filter((run) => run.endTick - run.startTick + 1 >= STABLE_TICKS)
    .map((run) => ({
      ...run,
      confirmationTick: run.startTick + STABLE_TICKS - 1,
    }));
  const fingerprints: RotationFingerprint[] = [];
  for (let index = 1; index < stableTenures.length; index++) {
    const from = stableTenures[index - 1];
    const to = stableTenures[index];
    if (from.leaderGid === to.leaderGid) continue;
    const boundaryTick = Math.round((from.endTick + to.startTick) / 2);
    const associatedEvents = eventKindsNear(events, boundaryTick);
    if (associatedEvents.length === 0) continue;
    const before = frameAtOrBefore(frames, from.endTick);
    const after = frameAtOrAfter(frames, to.confirmationTick);
    if (!before || !after) continue;
    const toBefore = bidAt(before, to.leaderGid);
    const fromAfter = bidAt(after, from.leaderGid);
    const fromBefore = bidAt(before, from.leaderGid);
    const toAfter = bidAt(after, to.leaderGid);
    if (!toBefore?.goalSide || !fromAfter?.goalSide || !fromBefore || !toAfter) continue;
    if (
      !actionChangedNear(frames, from.leaderGid, boundaryTick)
      && !actionChangedNear(frames, to.leaderGid, boundaryTick)
    ) continue;
    const movement = Math.max(
      distance(fromBefore.pos, fromAfter.pos),
      distance(toBefore.pos, toAfter.pos),
    );
    if (movement < MATERIAL_MOVEMENT) continue;
    fingerprints.push({
      fromGid: from.leaderGid,
      toGid: to.leaderGid,
      boundaryTick,
      associatedEvents,
      movement,
    });
  }
  return { stableTenures, fingerprints };
};

const sameProposal = (
  left: RelationCandidate | undefined,
  right: RelationCandidate | undefined,
): boolean => left?.playerGid === right?.playerGid
  && left?.opponentGid === right?.opponentGid
  && left?.action === right?.action;

const proposalBeats = (
  left: RelationCandidate,
  right: RelationCandidate,
): boolean => left.arrivalTime < right.arrivalTime
  || (left.arrivalTime === right.arrivalTime && left.playerGid < right.playerGid);

const settleRelationCandidates = (
  source: readonly (readonly [number, readonly RelationCandidate[]])[],
  committedTick: number,
  reverseInput = false,
): Omit<NegotiationResult, 'unsupportedIdentities' | 'nonFiniteCandidates' | 'inputOrderDifference'> => {
  const entries = reverseInput ? [...source].reverse() : [...source];
  let proposals = new Map<number, RelationCandidate>();
  for (const [gid, candidates] of entries) {
    const candidate = candidates[0];
    if (candidate) proposals.set(gid, candidate);
  }
  let proposalChanges = 0;
  let converged = false;
  let rounds = 0;
  const maxRounds = entries.length + 1;
  for (let round = 1; round <= maxRounds; round++) {
    rounds = round;
    const next = new Map<number, RelationCandidate>();
    for (const [gid, candidates] of entries) {
      const chosen = candidates.find((candidate) => ![...proposals.values()].some((other) =>
        other.playerGid !== gid
        && other.opponentGid === candidate.opponentGid
        && proposalBeats(other, candidate)));
      if (chosen) next.set(gid, chosen);
    }
    const gids = new Set([...proposals.keys(), ...next.keys()]);
    let changed = false;
    for (const gid of gids) {
      if (!sameProposal(proposals.get(gid), next.get(gid))) {
        changed = true;
        proposalChanges++;
      }
    }
    proposals = next;
    if (!changed) {
      converged = true;
      break;
    }
  }
  const commitments = [...proposals.values()]
    .sort((left, right) => left.playerGid - right.playerGid)
    .map((candidate) => ({ ...candidate, committedTick }));
  const counts = new Map<number, number>();
  for (const commitment of commitments) {
    counts.set(commitment.opponentGid, (counts.get(commitment.opponentGid) ?? 0) + 1);
  }
  const duplicateOpponentClaims = [...counts.values()]
    .reduce((total, count) => total + Math.max(0, count - 1), 0);
  return {
    commitments,
    proposalChanges,
    rounds,
    converged,
    duplicateOpponentClaims,
  };
};

const negotiateRelations = (
  match: Match,
  state: FrozenState,
  memories: Map<number, PerceptionMemory>,
): { result: NegotiationResult; perceptionRngChanged: boolean } => {
  const defendingTeam = match.teams[state.defendingSide];
  const truth = capturePerceptionTruth(match);
  const profiles = profilesOf(match);
  const actualByGid = new Map(match.allPlayers.map((player) => [player.gid, player]));
  const source: Array<readonly [number, readonly RelationCandidate[]]> = [];
  let unsupportedIdentities = 0;
  let nonFiniteCandidates = 0;
  const rngBefore = (match.rng as unknown as { s: number }).s;
  for (const defender of defendingTeam.players) {
    if (defender.role === 'GK' || defender.sentOff) continue;
    let memory = memories.get(defender.gid);
    if (!memory) {
      memory = createPerceptionMemory();
      memories.set(defender.gid, memory);
    }
    const snapshot = perceiveSnapshot(
      truth,
      defender.gid,
      AWARENESS,
      hashSeed(DROTATE_NAMESPACE, state.seed),
      memory,
    );
    const self = snapshot.players.find((entry) => entry.gid === defender.gid);
    const profile = profiles.get(defender.gid);
    if (!self || !profile) continue;
    const policy = defendingTeam.policies[defender.index];
    const candidates: RelationCandidate[] = [];
    for (const opponent of snapshot.players) {
      if (opponent.side === state.defendingSide) continue;
      const actual = actualByGid.get(opponent.gid);
      if (!actual || actual.sentOff) {
        unsupportedIdentities++;
        continue;
      }
      if (actual.role === 'GK') continue;
      const observedOwner = snapshot.ball?.ownerGid ?? null;
      const chase = observedOwner === opponent.gid;
      const arrivalTime = estimateReach(reachState(self, profile), opponent.pos, {
        reachRadius: CONTROL_RADIUS,
      }).eta;
      const preference = chase
        ? policy.chaseBase + defendingTeam.genome.pressIntensity * 0.15
        : policy.markBase + defendingTeam.genome.markingAggression * 0.15;
      if (!Number.isFinite(arrivalTime) || !Number.isFinite(preference)) {
        nonFiniteCandidates++;
        continue;
      }
      candidates.push({
        playerGid: defender.gid,
        opponentGid: opponent.gid,
        opponentIndex: actual.index,
        arrivalTime,
        preference,
        action: chase ? 'ChaseBall' : 'MarkOpponent',
        targetPoint: { x: opponent.pos.x, y: opponent.pos.y },
      });
    }
    candidates.sort((left, right) =>
      right.preference - left.preference
      || left.arrivalTime - right.arrivalTime
      || left.opponentGid - right.opponentGid);
    source.push([defender.gid, candidates]);
  }
  const rngAfter = (match.rng as unknown as { s: number }).s;
  const forward = settleRelationCandidates(source, match.simTick);
  const reverse = settleRelationCandidates(source, match.simTick, true);
  const stable = (result: typeof forward): string => JSON.stringify({
    commitments: result.commitments,
    proposalChanges: result.proposalChanges,
    rounds: result.rounds,
    converged: result.converged,
    duplicateOpponentClaims: result.duplicateOpponentClaims,
  });
  return {
    result: {
      ...forward,
      unsupportedIdentities,
      nonFiniteCandidates,
      inputOrderDifference: stable(forward) === stable(reverse) ? 0 : 1,
    },
    perceptionRngChanged: rngBefore !== rngAfter,
  };
};

const runArm = (state: FrozenState, arm: Arm): ArmResult => {
  const match = cloneSimulationState(state.frozen);
  const defendingTeam = match.teams[state.defendingSide];
  const memories = cloneMemories(state.memories);
  const frames: ResponsibilityFrame[] = [];
  const events: WorldEvent[] = [];
  let eligibleTicks = 0;
  let supportedBidTicks = 0;
  let assignmentPublications = 0;
  let brainFirings = 0;
  let brainTimerSuppressions = 0;
  let perceptionRngChanges = 0;
  let nonFiniteBids = 0;
  let probeActionWrites = 0;
  let probeTargetWrites = 0;
  let maxCommitments = 0;
  let duplicateSettlementChanges = 0;
  const actionTypes = new Set<string>();
  let negotiationNonConvergence = 0;
  let duplicateOpponentClaims = 0;
  let unsupportedIdentities = 0;
  let nonFiniteCandidates = 0;
  let negotiationOrderDifferences = 0;
  let completed = true;
  let previousOwner = match.ball.owner?.gid ?? null;
  let lastStableOwner = previousOwner;
  let previousPending = match.pendingPass !== null;
  let previousPossession = match.possessionSide;

  const applyIntentNegotiation = (): void => {
    const { result, perceptionRngChanged } = negotiateRelations(match, state, memories);
    if (perceptionRngChanged) perceptionRngChanges++;
    if (!result.converged) negotiationNonConvergence++;
    duplicateOpponentClaims += result.duplicateOpponentClaims;
    unsupportedIdentities += result.unsupportedIdentities;
    nonFiniteCandidates += result.nonFiniteCandidates;
    negotiationOrderDifferences += result.inputOrderDifference;
    duplicateSettlementChanges += result.proposalChanges;
    maxCommitments = Math.max(maxCommitments, result.commitments.length);
    const byPlayer = new Map(result.commitments.map((commitment) => [
      commitment.playerGid,
      commitment,
    ]));
    for (const player of defendingTeam.players) {
      if (player.role === 'GK' || player.sentOff) continue;
      const commitment = byPlayer.get(player.gid);
      if (commitment?.action === 'ChaseBall') {
        player.action = {
          type: 'ChaseBall',
          scores: [{
            action: 'ChaseBall',
            score: commitment.preference,
            why: 'local relation commitment',
          }],
        };
      } else if (commitment?.action === 'MarkOpponent') {
        player.action = {
          type: 'MarkOpponent',
          targetIdx: commitment.opponentIndex,
          scores: [{
            action: 'MarkOpponent',
            score: commitment.preference,
            why: 'local relation commitment',
          }],
        };
      } else {
        player.action = {
          type: 'MoveToFormationSpot',
          scores: [{
            action: 'MoveToFormationSpot',
            score: 0,
            why: 'no supported local relation commitment',
          }],
        };
      }
      player.decisionTimer = Number.POSITIVE_INFINITY;
      actionTypes.add(player.action.type);
      probeActionWrites++;
      if (player.action.targetPos !== undefined) probeTargetWrites++;
    }
  };

  if (arm !== 'commander') {
    defendingTeam.chasers.clear();
    defendingTeam.marks.clear();
    defendingTeam.brainTimer = Number.POSITIVE_INFINITY;
    for (const player of defendingTeam.players) {
      if (player.role === 'GK' || player.sentOff) continue;
      player.decisionTimer = arm === 'intent' ? Number.POSITIVE_INFINITY : 0;
    }
    if (arm === 'intent') applyIntentNegotiation();
  }

  for (let step = 0; step < WINDOW_TICKS; step++) {
    if (match.finished) {
      completed = false;
      break;
    }
    if (arm !== 'commander') {
      if (Number.isFinite(defendingTeam.brainTimer)) brainTimerSuppressions++;
      defendingTeam.brainTimer = Number.POSITIVE_INFINITY;
      defendingTeam.chasers.clear();
      defendingTeam.marks.clear();
    }
    match.step(DT);
    if (arm !== 'commander') {
      if (defendingTeam.chasers.size > 0 || defendingTeam.marks.size > 0) {
        assignmentPublications += defendingTeam.chasers.size + defendingTeam.marks.size;
      }
      if (defendingTeam.brainTimer === Number.POSITIVE_INFINITY) {
        // Expected: no world event requested an early future TeamBrain refresh.
      } else if (defendingTeam.chasers.size > 0 || defendingTeam.marks.size > 0) {
        brainFirings++;
      }
    }

    const owner = match.ball.owner?.gid ?? null;
    const pending = match.pendingPass !== null;
    if (!previousPending && pending) events.push({ tick: match.simTick, kind: 'passStarted' });
    if (previousOwner !== null && owner === null) {
      events.push({ tick: match.simTick, kind: 'ballReleased' });
    }
    const carrierChanged = INTENT_MODE
      ? owner !== null && lastStableOwner !== null && lastStableOwner !== owner
      : previousOwner !== null && owner !== null && previousOwner !== owner;
    if (carrierChanged) {
      events.push({ tick: match.simTick, kind: 'carrierChanged' });
    }
    const possessionChanged = previousPossession !== match.possessionSide;
    if (possessionChanged) {
      events.push({ tick: match.simTick, kind: 'possessionChanged' });
    }
    previousOwner = owner;
    if (owner !== null) lastStableOwner = owner;
    previousPending = pending;
    previousPossession = match.possessionSide;
    if (arm === 'intent' && (carrierChanged || possessionChanged)) {
      applyIntentNegotiation();
    }

    const carrier = match.ball.owner;
    if (!carrier || carrier.side === state.defendingSide) continue;
    eligibleTicks++;
    const truth = capturePerceptionTruth(match);
    const rngBefore = (match.rng as unknown as { s: number }).s;
    const profiles = profilesOf(match);
    const bids: ResponsibilityBid[] = [];
    for (const defender of defendingTeam.players) {
      if (defender.role === 'GK' || defender.sentOff) continue;
      let memory = memories.get(defender.gid);
      if (!memory) {
        memory = createPerceptionMemory();
        memories.set(defender.gid, memory);
      }
      const snapshot = perceiveSnapshot(
        truth,
        defender.gid,
        AWARENESS,
        hashSeed(DROTATE_NAMESPACE, state.seed),
        memory,
      );
      const profile = profiles.get(defender.gid);
      if (!profile) continue;
      const bid = bidFromSnapshot(
        snapshot,
        defender.gid,
        carrier.gid,
        state.defendingSide,
        profile,
        defender.action.type,
      );
      if (!bid) continue;
      if (!Number.isFinite(bid.eta)) nonFiniteBids++;
      else bids.push(bid);
    }
    const rngAfter = (match.rng as unknown as { s: number }).s;
    if (rngBefore !== rngAfter) perceptionRngChanges++;
    if (bids.length < 2) continue;
    supportedBidTicks++;
    bids.sort((left, right) => left.eta - right.eta || left.gid - right.gid);
    frames.push({
      tick: match.simTick,
      carrierGid: carrier.gid,
      leaderGid: bids[0].gid,
      bids,
    });
  }

  const analysis = analyseTimeline(frames, events);
  const reversed = analyseTimeline(frames, events, true);
  const orderDifferences = JSON.stringify(analysis) === JSON.stringify(reversed) ? 0 : 1;
  return {
    arm,
    completed,
    eligibleTicks,
    supportedBidTicks,
    events,
    frames,
    analysis,
    assignmentPublications,
    brainFirings,
    brainTimerSuppressions,
    perceptionRngChanges,
    nonFiniteBids,
    probeActionWrites,
    probeTargetWrites,
    orderDifferences,
    maxCommitments,
    duplicateSettlementChanges,
    actionTypes: [...actionTypes].sort(),
    negotiationNonConvergence,
    duplicateOpponentClaims,
    unsupportedIdentities,
    nonFiniteCandidates,
    negotiationOrderDifferences,
  };
};

let scannedSeeds = 0;
let acceptedStates = 0;
let deterministicDifferences = 0;
let cloneFailures = 0;
let completedLocalWindows = 0;
let eventfulLocalStates = 0;
let localEligibleTicks = 0;
let localSupportedBidTicks = 0;
let localStatesWithStableTenures = 0;
let localRotationFingerprints = 0;
let commanderRotationFingerprints = 0;
let localAssignmentPublications = 0;
let localBrainFirings = 0;
let localBrainTimerSuppressions = 0;
let perceptionRngChanges = 0;
let discoveryPerceptionRngChanges = 0;
let nonFiniteBids = 0;
let probeActionWrites = 0;
let probeTargetWrites = 0;
let orderDifferences = 0;
const localRotationStates = new Set<string>();
const controlRotationStates = new Set<string>();
let statesWithTwoCommitments = 0;
let statesWithDuplicateSettlement = 0;
let statesWithTwoActionTypes = 0;
let negotiationNonConvergence = 0;
let duplicateOpponentClaims = 0;
let unsupportedIdentities = 0;
let nonFiniteCandidates = 0;
let negotiationOrderDifferences = 0;
const eventKindStates = new Map<WorldEventKind, Set<string>>();
const defenderRotationCounts = new Map<number, number>();
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
  for (const player of match.allPlayers) {
    if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
  }
  let accepted = false;
  while (!match.finished && !accepted) {
    match.step(DT);
    const truth = capturePerceptionTruth(match);
    const discoveryRngBefore = (match.rng as unknown as { s: number }).s;
    for (const player of match.allPlayers) {
      if (player.role === 'GK' || player.sentOff) continue;
      perceiveSnapshot(truth, player.gid, AWARENESS, seed, memories.get(player.gid)!);
    }
    const discoveryRngAfter = (match.rng as unknown as { s: number }).s;
    if (discoveryRngBefore !== discoveryRngAfter) discoveryPerceptionRngChanges++;
    if (
      match.simTick % SAMPLE_TICKS !== 0
      || match.simTime < 10
      || match.phase !== 'playing'
      || !beforeAdministrativeBoundary(match)
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.role === 'GK' || carrier.sentOff) continue;
    const defenders = match.teams[1 - carrier.side].players.filter((player) => {
      if (player.role === 'GK' || player.sentOff) return false;
      const memory = memories.get(player.gid);
      return memory?.players.has(carrier.gid) ?? false;
    });
    if (defenders.length < 3) continue;
    const state: FrozenState = {
      key: `${seed}:${match.simTick}:${carrier.gid}`,
      seed,
      attackingSide: carrier.side,
      defendingSide: (1 - carrier.side) as Side,
      frozen: cloneSimulationState(match),
      memories: cloneMemories(memories),
    };
    accepted = true;
    acceptedStates++;
    try {
      const commander = runArm(state, INTENT_MODE ? 'local' : 'commander');
      const local = runArm(state, INTENT_MODE ? 'intent' : 'local');
      const localReplay = runArm(state, INTENT_MODE ? 'intent' : 'local');
      if (JSON.stringify(local) !== JSON.stringify(localReplay)) deterministicDifferences++;
      if (local.completed) completedLocalWindows++;
      if (local.events.length > 0) eventfulLocalStates++;
      localEligibleTicks += local.eligibleTicks;
      localSupportedBidTicks += local.supportedBidTicks;
      if (local.analysis.stableTenures.length >= 2) localStatesWithStableTenures++;
      localRotationFingerprints += local.analysis.fingerprints.length;
      commanderRotationFingerprints += commander.analysis.fingerprints.length;
      if (local.analysis.fingerprints.length > 0) localRotationStates.add(state.key);
      if (commander.analysis.fingerprints.length > 0) controlRotationStates.add(state.key);
      if (local.maxCommitments >= 2) statesWithTwoCommitments++;
      if (local.duplicateSettlementChanges > 0) statesWithDuplicateSettlement++;
      if (local.actionTypes.length >= 2) statesWithTwoActionTypes++;
      negotiationNonConvergence += local.negotiationNonConvergence;
      duplicateOpponentClaims += local.duplicateOpponentClaims;
      unsupportedIdentities += local.unsupportedIdentities;
      nonFiniteCandidates += local.nonFiniteCandidates;
      negotiationOrderDifferences += local.negotiationOrderDifferences;
      localAssignmentPublications += local.assignmentPublications;
      localBrainFirings += local.brainFirings;
      localBrainTimerSuppressions += local.brainTimerSuppressions;
      perceptionRngChanges += local.perceptionRngChanges + commander.perceptionRngChanges;
      nonFiniteBids += local.nonFiniteBids + commander.nonFiniteBids;
      probeActionWrites += local.probeActionWrites + commander.probeActionWrites;
      probeTargetWrites += local.probeTargetWrites + commander.probeTargetWrites;
      orderDifferences += local.orderDifferences + commander.orderDifferences;
      for (const fingerprint of local.analysis.fingerprints) {
        defenderRotationCounts.set(
          fingerprint.toGid,
          (defenderRotationCounts.get(fingerprint.toGid) ?? 0) + 1,
        );
        for (const kind of fingerprint.associatedEvents) {
          let states = eventKindStates.get(kind);
          if (!states) {
            states = new Set<string>();
            eventKindStates.set(kind, states);
          }
          states.add(state.key);
        }
      }
      records.push({
        key: state.key,
        seed,
        commander: {
          completed: commander.completed,
          eventCount: commander.events.length,
          stableTenures: commander.analysis.stableTenures.length,
          fingerprints: commander.analysis.fingerprints.length,
        },
        local: {
          completed: local.completed,
          eventKinds: [...new Set(local.events.map((event) => event.kind))].sort(),
          stableTenures: local.analysis.stableTenures.length,
          fingerprints: local.analysis.fingerprints,
        },
      });
    } catch {
      cloneFailures++;
    }
  }
}

const supportedBidRate = localSupportedBidTicks / Math.max(1, localEligibleTicks);
const eventfulRotationRate = localRotationStates.size / Math.max(1, eventfulLocalStates);
const eventKindsWithFourStates = [...eventKindStates.values()]
  .filter((states) => states.size >= 4).length;
const largestDefenderShare = Math.max(0, ...defenderRotationCounts.values())
  / Math.max(1, localRotationFingerprints);
const rotateGates = {
  acceptedStates: acceptedStates === REQUIRED_STATES,
  scannedSeeds: scannedSeeds <= MAX_SEEDS,
  completedLocalWindows: completedLocalWindows >= 56,
  eventfulLocalStates: eventfulLocalStates >= 40,
  supportedBidTicks: supportedBidRate >= 0.70,
  stableLeaderStates: localStatesWithStableTenures >= 24,
  rotationStates: localRotationStates.size >= 16,
  rotationFingerprints: localRotationFingerprints >= 20,
  eventfulRotationRate: eventfulRotationRate >= 0.30,
  eventKindDiversity: eventKindStates.size >= 2,
  eventKindStateSupport: eventKindsWithFourStates >= 2,
  roleNeutrality: largestDefenderShare <= 0.60,
  assignmentBlind: localAssignmentPublications === 0,
  teamBrainNonFiring: localBrainFirings === 0,
  perceptionRngPurity:
    perceptionRngChanges === 0 && discoveryPerceptionRngChanges === 0,
  finiteBids: nonFiniteBids === 0,
  probeMovementPurity: probeActionWrites === 0 && probeTargetWrites === 0,
  cloneValidity: cloneFailures === 0,
  deterministicReruns: deterministicDifferences === 0,
  inputOrderInvariance: orderDifferences === 0,
};
const intentGates = {
  acceptedStates: acceptedStates === REQUIRED_STATES,
  scannedSeeds: scannedSeeds <= MAX_SEEDS,
  completedIntentWindows: completedLocalWindows >= 56,
  eventfulIntentStates: eventfulLocalStates >= 40,
  supportedBidTicks: supportedBidRate >= 0.70,
  stableLeaderStates: localStatesWithStableTenures >= 24,
  simultaneousCommitments: statesWithTwoCommitments >= 48,
  duplicateSettlement: statesWithDuplicateSettlement >= 24,
  actionDiversity: statesWithTwoActionTypes >= 40,
  rotationStates: localRotationStates.size >= 16,
  rotationFingerprints: localRotationFingerprints >= 20,
  eventfulRotationRate: eventfulRotationRate >= 0.30,
  eventKindDiversity: eventKindStates.size >= 2,
  eventKindStateSupport: eventKindsWithFourStates >= 2,
  roleNeutrality: largestDefenderShare <= 0.60,
  rotationStateEdge: localRotationStates.size - controlRotationStates.size >= 12,
  rotationFingerprintEdge:
    localRotationFingerprints - commanderRotationFingerprints >= 16,
  assignmentBlind: localAssignmentPublications === 0,
  teamBrainNonFiring: localBrainFirings === 0,
  perceptionRngPurity:
    perceptionRngChanges === 0 && discoveryPerceptionRngChanges === 0,
  finiteBids: nonFiniteBids === 0,
  negotiationConvergence: negotiationNonConvergence === 0,
  uniqueOpponentClaims: duplicateOpponentClaims === 0,
  supportedIdentities: unsupportedIdentities === 0,
  finiteCandidates: nonFiniteCandidates === 0,
  probeTargetPurity: probeTargetWrites === 0,
  actionConsumerFired: probeActionWrites > 0,
  cloneValidity: cloneFailures === 0,
  deterministicReruns: deterministicDifferences === 0,
  inputOrderInvariance:
    orderDifferences === 0 && negotiationOrderDifferences === 0,
};
const gates = INTENT_MODE ? intentGates : rotateGates;
const pass = Object.values(gates).every(Boolean);
const commonParameters = {
  seedStart: SEED_START,
  requiredStates: REQUIRED_STATES,
  maxSeeds: MAX_SEEDS,
  awareness: AWARENESS,
  windowTicks: WINDOW_TICKS,
  windowSeconds: WINDOW_TICKS * DT,
  stableTicks: STABLE_TICKS,
  eventWindowTicks: EVENT_WINDOW_TICKS,
  materialMovement: MATERIAL_MOVEMENT,
};
const rotateReport = {
  authority: 'D-ROTATE-0 assignment-blind defensive rotation process gate',
  parameters: {
    ...commonParameters,
  },
  support: {
    scannedSeeds,
    acceptedStates,
    completedLocalWindows,
    eventfulLocalStates,
    localEligibleTicks,
    localSupportedBidTicks,
    supportedBidRate,
    localStatesWithStableTenures,
    localRotationStates: localRotationStates.size,
    localRotationFingerprints,
    commanderRotationFingerprints,
    eventfulRotationRate,
    eventKindStates: Object.fromEntries([...eventKindStates.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([kind, states]) => [kind, states.size])),
    largestDefenderShare,
  },
  validity: {
    localAssignmentPublications,
    localBrainFirings,
    localBrainTimerSuppressions,
    perceptionRngChanges,
    discoveryPerceptionRngChanges,
    nonFiniteBids,
    probeActionWrites,
    probeTargetWrites,
    cloneFailures,
    deterministicDifferences,
    orderDifferences,
  },
  records,
  gates: rotateGates,
  pass,
};
const intentReport = {
  authority: 'D-INTENT-0 local defensive intent negotiation mechanism gate',
  parameters: commonParameters,
  support: {
    scannedSeeds,
    acceptedStates,
    completedIntentWindows: completedLocalWindows,
    eventfulIntentStates: eventfulLocalStates,
    localEligibleTicks,
    localSupportedBidTicks,
    supportedBidRate,
    intentStatesWithStableTenures: localStatesWithStableTenures,
    intentRotationStates: localRotationStates.size,
    intentRotationFingerprints: localRotationFingerprints,
    noConsumerRotationStates: controlRotationStates.size,
    noConsumerRotationFingerprints: commanderRotationFingerprints,
    rotationStateEdge: localRotationStates.size - controlRotationStates.size,
    rotationFingerprintEdge: localRotationFingerprints - commanderRotationFingerprints,
    eventfulRotationRate,
    eventKindStates: Object.fromEntries([...eventKindStates.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([kind, states]) => [kind, states.size])),
    largestDefenderShare,
    statesWithTwoCommitments,
    statesWithDuplicateSettlement,
    statesWithTwoActionTypes,
  },
  validity: {
    localAssignmentPublications,
    localBrainFirings,
    localBrainTimerSuppressions,
    perceptionRngChanges,
    discoveryPerceptionRngChanges,
    nonFiniteBids,
    probeActionWrites,
    probeTargetWrites,
    negotiationNonConvergence,
    duplicateOpponentClaims,
    unsupportedIdentities,
    nonFiniteCandidates,
    cloneFailures,
    deterministicDifferences,
    orderDifferences,
    negotiationOrderDifferences,
  },
  records,
  gates: intentGates,
  pass,
};
const report = INTENT_MODE ? intentReport : rotateReport;
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;

console.log(INTENT_MODE
  ? 'D-INTENT-0 LOCAL DEFENSIVE INTENT NEGOTIATION MECHANISM GATE'
  : 'D-ROTATE-0 ASSIGNMENT-BLIND DEFENSIVE ROTATION PROCESS GATE');
console.log(
  `accepted ${acceptedStates}/${REQUIRED_STATES} · scanned ${scannedSeeds}/${MAX_SEEDS}`
  + ` · completed local ${completedLocalWindows}/${acceptedStates}`,
);
console.log(
  `events ${eventfulLocalStates}/${acceptedStates}`
  + ` · supported bids ${localSupportedBidTicks}/${localEligibleTicks} (${pct(supportedBidRate)})`
  + ` · stable-tenure states ${localStatesWithStableTenures}/${acceptedStates}`,
);
console.log(INTENT_MODE
  ? `rotations intent ${localRotationFingerprints} in ${localRotationStates.size}/${acceptedStates}`
    + ` · no-consumer ${commanderRotationFingerprints} in ${controlRotationStates.size}/${acceptedStates}`
    + ` · eventful rate ${pct(eventfulRotationRate)}`
  : `rotations local ${localRotationFingerprints} in ${localRotationStates.size}/${acceptedStates}`
    + ` · commander ${commanderRotationFingerprints}`
    + ` · eventful rate ${pct(eventfulRotationRate)}`,
);
if (INTENT_MODE) {
  console.log(
    `commitment states ${statesWithTwoCommitments}/${acceptedStates}`
    + ` · duplicate-settlement states ${statesWithDuplicateSettlement}/${acceptedStates}`
    + ` · action-diverse states ${statesWithTwoActionTypes}/${acceptedStates}`,
  );
}
console.log(
  `event kinds ${JSON.stringify(Object.fromEntries([...eventKindStates.entries()]
    .map(([kind, states]) => [kind, states.size])))}`
  + ` · largest defender share ${pct(largestDefenderShare)}`,
);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
