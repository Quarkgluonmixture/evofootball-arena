// C-RNG-0 COUPLED RACE POST-KICK RNG ROBUSTNESS.
// Authority: docs/world-model/COUPLED-RACE-RNG-ROBUSTNESS.md
import { createHash } from 'node:crypto';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
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
import { TEAM_SIZE, type ActionState, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  capturePassLifecycle,
  classifyFirstTransition,
  type FirstTransitionOutcome,
  type OraclePassKey,
  type OracleTransitionStatus,
} from './oracle-v2';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED_START = Number(process.argv[3] ?? 70_000);
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const ADMIN_GUARD = 5;
const TRANSITION_CAP = 4;
const REPLICATES = 8;
const CHILD_NAMESPACE = 0xc0a70001;

type Binary = 'intended' | 'opponent';
type Prediction = Binary | 'other';

const OUTCOMES: readonly FirstTransitionOutcome[] = [
  'intendedReception',
  'teammateRecovery',
  'opponentInterception',
  'loose',
  'deadBall',
];

interface TransitionRun {
  status: OracleTransitionStatus;
  outcome: FirstTransitionOutcome | null;
  controllerGid: number | null;
  kickSignature: string;
  contactCount: number;
  delayedContactControl: boolean;
  coordinationPublications: number;
  forbiddenActionStates: number;
  targetPosWrites: number;
}

interface Row {
  identity: string;
  seed: number;
  actual: FirstTransitionOutcome;
  actualControllerGid: number | null;
  baselinePrediction: Binary;
  sharedPrediction: Prediction;
  independentPrediction: Prediction;
  counts: Record<FirstTransitionOutcome, number>;
  largestMass: number;
  unanimous: boolean;
  contactCounts: number[];
  delayedControlCount: number;
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

const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(
  match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
    topSpeed: player.topSpeed,
    accel: player.accel,
    dribbling: player.attrs.dribbling,
  }]),
);

const rngState = (match: Match): number => (match.rng as unknown as { s: number }).s;
const setRngState = (match: Match, seed: number): void => {
  (match.rng as unknown as { s: number }).s = seed === 0 ? 0x9e3779b9 : seed >>> 0;
};

const frozenSignature = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  time: match.simTime,
  phase: match.phase,
  score: match.score,
  possession: match.possessionSide,
  rng: rngState(match),
  ball: [match.ball.pos, match.ball.vel, match.ball.z, match.ball.vz, match.ball.owner?.gid ?? null],
  players: match.allPlayers.map((player) => [
    player.gid,
    player.pos,
    player.vel,
    player.heading,
    player.stamina,
    player.action,
    player.decisionTimer,
    player.kickCooldown,
  ]),
});

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= ADMIN_GUARD;
};

const action = (type: ActionState['type']): ActionState => ({ type, scores: [] });

const runTransition = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
  participants: ReadonlySet<number> | null,
  childSeed: number | null,
): TransitionRun => {
  const failure = (): TransitionRun => ({
    status: 'forceFailure',
    outcome: null,
    controllerGid: null,
    kickSignature: '',
    contactCount: 0,
    delayedContactControl: false,
    coordinationPublications: 0,
    forbiddenActionStates: 0,
    targetPosWrites: 0,
  });
  const branch = cloneSimulationState(frozen);
  const passer = branch.allPlayers.find((player) => player.gid === passerGid);
  const target = branch.allPlayers.find((player) => player.gid === targetGid);
  if (!passer || !target || branch.ball.owner !== passer || branch.phase !== 'playing') return failure();

  branch.performPass(passer, target);
  const pending = branch.pendingPass;
  if (!pending || pending.passerGid !== passerGid || pending.targetGid !== targetGid
    || pending.side !== side || branch.lastPassKind?.kind !== 'pass') return failure();
  const key: OraclePassKey = {
    passerGid,
    targetGid,
    side,
    kickTick: branch.simTick,
    kickTime: pending.t,
    kind: 'pass',
  };
  const kickSignature = JSON.stringify({
    rng: rngState(branch),
    ball: [branch.ball.pos, branch.ball.vel, branch.ball.z, branch.ball.vz],
    pending: branch.pendingPass,
    kind: branch.lastPassKind,
  });
  if (childSeed !== null) setRngState(branch, childSeed);

  const episodeStart = branch.contestEpisodes.length;
  let coordinationPublications = 0;
  let forbiddenActionStates = 0;
  let targetPosWrites = 0;
  if (participants !== null) {
    for (const player of branch.allPlayers) {
      player.action = player.gid === targetGid
        ? action('ReceivePass')
        : participants.has(player.gid)
          ? action('InterceptPass')
          : action('HoldPosition');
      player.decisionTimer = Number.POSITIVE_INFINITY;
    }
    for (const raceTeam of branch.teams) {
      raceTeam.brainTimer = Number.POSITIVE_INFINITY;
      raceTeam.chasers.clear();
      raceTeam.marks.clear();
    }
  }

  let before = capturePassLifecycle(branch);
  const stop = pending.t + TRANSITION_CAP + DT * 2;
  while (!branch.finished && branch.simTime < stop) {
    if (participants !== null) {
      for (const player of branch.allPlayers) player.decisionTimer = Number.POSITIVE_INFINITY;
      for (const raceTeam of branch.teams) {
        raceTeam.brainTimer = Number.POSITIVE_INFINITY;
        raceTeam.chasers.clear();
        raceTeam.marks.clear();
      }
    }
    branch.step(DT);
    if (participants !== null) {
      coordinationPublications += branch.teams[0].chasers.size + branch.teams[0].marks.size
        + branch.teams[1].chasers.size + branch.teams[1].marks.size;
    }
    const after = capturePassLifecycle(branch);
    const classified = classifyFirstTransition(before, after, key);
    if (participants !== null && classified === null) {
      for (const player of branch.allPlayers) {
        const expected = player.gid === targetGid
          ? 'ReceivePass'
          : participants.has(player.gid) ? 'InterceptPass' : 'HoldPosition';
        if (player.action.type !== expected) forbiddenActionStates++;
        if (player.action.targetPos !== undefined) targetPosWrites++;
      }
    }
    if (classified !== null) {
      const episodes = branch.contestEpisodes.slice(episodeStart);
      const contacts = episodes.flatMap((episode) => episode.contacts);
      const delayedContactControl = episodes.some((episode) => {
        const first = episode.contacts[0];
        return first !== undefined && episode.resolution?.kind === 'controlled'
          && episode.resolution.tick > first.tick;
      });
      return {
        status: classified.status,
        outcome: classified.outcome,
        controllerGid: classified.controllerGid,
        kickSignature,
        contactCount: contacts.length,
        delayedContactControl,
        coordinationPublications,
        forbiddenActionStates,
        targetPosWrites,
      };
    }
    before = after;
  }
  return {
    status: 'censored',
    outcome: null,
    controllerGid: null,
    kickSignature,
    contactCount: 0,
    delayedContactControl: false,
    coordinationPublications,
    forbiddenActionStates,
    targetPosWrites,
  };
};

const candidateSet = (
  snapshot: PerceptionSnapshot,
  match: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
): Set<number> => {
  const profiles = profilesOf(match);
  const set = new Set<number>();
  for (const observed of snapshot.players) {
    if (observed.side === side || observed.gid === targetGid) continue;
    const rosterPlayer = match.allPlayers.find((player) => player.gid === observed.gid);
    if (!rosterPlayer || rosterPlayer.role === 'GK' || rosterPlayer.sentOff) continue;
    const facts = evaluatePassCorridorInterception({
      snapshot,
      passerGid,
      targetGid,
      defenderGid: observed.gid,
      reachProfiles: profiles,
    });
    if (facts !== null && facts.strongestMargin >= 0) set.add(observed.gid);
  }
  return set;
};

const validTransition = (
  match: Match,
  outcome: FirstTransitionOutcome,
  controllerGid: number | null,
  side: Side,
  targetGid: number,
): boolean => {
  const controller = controllerGid === null
    ? null
    : match.allPlayers.find((player) => player.gid === controllerGid) ?? null;
  if (outcome === 'intendedReception') return controller?.gid === targetGid && controller.side === side;
  if (outcome === 'teammateRecovery') {
    return controller !== null && controller.side === side && controller.gid !== targetGid;
  }
  if (outcome === 'opponentInterception') return controller !== null && controller.side !== side;
  return controllerGid === null;
};

const outcomeCounts = (): Record<FirstTransitionOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
});

const predictionFromOutcome = (outcome: FirstTransitionOutcome): Prediction => {
  if (outcome === 'intendedReception') return 'intended';
  if (outcome === 'opponentInterception') return 'opponent';
  return 'other';
};

const predictionFromCounts = (counts: Record<FirstTransitionOutcome, number>): Prediction => {
  const largest = Math.max(...OUTCOMES.map((outcome) => counts[outcome]));
  const maxima = OUTCOMES.filter((outcome) => counts[outcome] === largest);
  if (maxima.length !== 1) return 'other';
  return predictionFromOutcome(maxima[0]);
};

const rows: Row[] = [];
const identities = new Set<string>();
const represented = new Set<number>();
let ordinaryPasses = 0;
let eligiblePasses = 0;
let targetUnsupported = 0;
let boundaryExcluded = 0;
let invalidTarget = 0;
let duplicateIdentities = 0;
let perceptionRngChanges = 0;
let frozenMutations = 0;
let truthFallbacks = 0;
let normalForceFailures = 0;
let normalCensors = 0;
let sharedForceFailures = 0;
let sharedCensors = 0;
let childForceFailures = 0;
let childCensors = 0;
let incompleteReplicateRecords = 0;
let executedReplicates = 0;
let conservationFailures = 0;
let kickMismatches = 0;
let withinPassChildSeedCollisions = 0;
let coordinationPublications = 0;
let forbiddenActionStates = 0;
let targetPosWrites = 0;

for (let index = 0; index < MATCHES; index++) {
  const seed = SEED_START + index;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
    traceContests: true,
  });
  const memories = new Map<number, PerceptionMemory>();
  for (const player of match.allPlayers) memories.set(player.gid, createPerceptionMemory());
  let previousPass = match.pendingPass;
  while (!match.finished) {
    const carrier = match.phase === 'playing' ? match.ball.owner : null;
    let frozen: Match | null = null;
    let launchSnapshot: PerceptionSnapshot | null = null;
    if (carrier !== null && !carrier.sentOff) {
      const beforeRng = rngState(match);
      launchSnapshot = perceiveSnapshot(
        capturePerceptionTruth(match),
        carrier.gid,
        AWARENESS,
        seed,
        memories.get(carrier.gid)!,
      );
      if (beforeRng !== rngState(match)) perceptionRngChanges++;
      if (carrier.decisionTimer <= 0 && carrier.kickCooldown <= 0) {
        frozen = cloneSimulationState(match);
      }
    }
    const frozenOwnerGid = carrier?.gid ?? null;
    match.step(DT);
    const pass = match.pendingPass;
    const freshOrdinary = pass !== previousPass && pass !== null
      && match.lastPassKind?.kind === 'pass' && match.lastPassKind.t === pass.t
      && frozen !== null && launchSnapshot !== null && frozenOwnerGid === pass.passerGid;
    if (freshOrdinary && pass !== null && frozen !== null && launchSnapshot !== null) {
      ordinaryPasses++;
      if (!beforeAdministrativeBoundary(frozen)) {
        boundaryExcluded++;
        previousPass = pass;
        continue;
      }
      const passer = frozen.allPlayers.find((player) => player.gid === pass.passerGid);
      const target = frozen.allPlayers.find((player) => player.gid === pass.targetGid);
      if (!passer || !target || target.role === 'GK' || target.sentOff) {
        invalidTarget++;
        previousPass = pass;
        continue;
      }
      eligiblePasses++;
      if (!launchSnapshot.players.some((player) => player.gid === target.gid)) {
        targetUnsupported++;
        previousPass = pass;
        continue;
      }

      const identity = `${seed}:${frozen.simTick}:${pass.passerGid}:${pass.targetGid}`;
      if (identities.has(identity)) duplicateIdentities++;
      identities.add(identity);
      const beforeAudit = frozenSignature(frozen);
      const participants = candidateSet(launchSnapshot, frozen, passer.gid, target.gid, passer.side);
      for (const gid of participants) {
        if (!launchSnapshot.players.some((player) => player.gid === gid)) truthFallbacks++;
      }

      const normal = runTransition(frozen, passer.gid, target.gid, passer.side, null, null);
      const shared = runTransition(frozen, passer.gid, target.gid, passer.side, participants, null);
      if (normal.status === 'forceFailure') normalForceFailures++;
      if (normal.status === 'censored') normalCensors++;
      if (shared.status === 'forceFailure') sharedForceFailures++;
      if (shared.status === 'censored') sharedCensors++;

      const childSeeds = Array.from({ length: REPLICATES }, (_, replicate) => hashSeed(
        CHILD_NAMESPACE,
        seed,
        frozen!.simTick,
        passer.gid,
        target.gid,
        replicate,
      ));
      withinPassChildSeedCollisions += childSeeds.length - new Set(childSeeds).size;
      const children = childSeeds.map((childSeed) => {
        executedReplicates++;
        return runTransition(
          frozen!, passer.gid, target.gid, passer.side, participants, childSeed,
        );
      });
      childForceFailures += children.filter((child) => child.status === 'forceFailure').length;
      childCensors += children.filter((child) => child.status === 'censored').length;

      const signatures = [normal.kickSignature, shared.kickSignature,
        ...children.map((child) => child.kickSignature)];
      if (new Set(signatures).size !== 1) kickMismatches++;
      if (beforeAudit !== frozenSignature(frozen)) frozenMutations++;

      for (const result of [shared, ...children]) {
        coordinationPublications += result.coordinationPublications;
        forbiddenActionStates += result.forbiddenActionStates;
        targetPosWrites += result.targetPosWrites;
      }
      for (const result of [normal, shared, ...children]) {
        if (result.status === 'resolved' && result.outcome !== null
          && !validTransition(frozen, result.outcome, result.controllerGid, passer.side, target.gid)) {
          conservationFailures++;
        }
      }

      if (normal.status !== 'resolved' || normal.outcome === null
        || shared.status !== 'resolved' || shared.outcome === null
        || children.some((child) => child.status !== 'resolved' || child.outcome === null)) {
        incompleteReplicateRecords++;
        previousPass = pass;
        continue;
      }

      const counts = outcomeCounts();
      for (const child of children) counts[child.outcome!]++;
      const largest = Math.max(...OUTCOMES.map((outcome) => counts[outcome]));
      represented.add(seed);
      rows.push({
        identity,
        seed,
        actual: normal.outcome,
        actualControllerGid: normal.controllerGid,
        baselinePrediction: participants.size > 0 ? 'opponent' : 'intended',
        sharedPrediction: predictionFromOutcome(shared.outcome),
        independentPrediction: predictionFromCounts(counts),
        counts,
        largestMass: largest / REPLICATES,
        unanimous: largest === REPLICATES,
        contactCounts: children.map((child) => child.contactCount),
        delayedControlCount: children.filter((child) => child.delayedContactControl).length,
      });
    }
    previousPass = pass;
  }
}

const binaryRows = rows.filter((row) =>
  row.actual === 'intendedReception' || row.actual === 'opponentInterception');
const actualBinary = (row: Row): Binary => row.actual === 'intendedReception' ? 'intended' : 'opponent';
const recall = (pick: (row: Row) => Prediction, label: Binary): number => {
  const selected = binaryRows.filter((row) => actualBinary(row) === label);
  return selected.filter((row) => pick(row) === label).length / Math.max(1, selected.length);
};
const metric = (pick: (row: Row) => Prediction) => {
  const intended = recall(pick, 'intended');
  const opponent = recall(pick, 'opponent');
  return { intended, opponent, balanced: (intended + opponent) / 2 };
};
const baseline = metric((row) => row.baselinePrediction);
const shared = metric((row) => row.sharedPrediction);
const independent = metric((row) => row.independentPrediction);
const saysOpponent = binaryRows.filter((row) => row.independentPrediction === 'opponent');
const saysIntended = binaryRows.filter((row) => row.independentPrediction === 'intended');
const opponentRate = (selected: readonly Row[]): number => selected.filter((row) =>
  row.actual === 'opponentInterception').length / Math.max(1, selected.length);
const opponentSeparation = opponentRate(saysOpponent) - opponentRate(saysIntended);
const mean = (values: readonly number[]): number => values.reduce((sum, value) => sum + value, 0)
  / Math.max(1, values.length);
const sharedAgreement = binaryRows.filter((row) =>
  row.sharedPrediction === row.independentPrediction).length / Math.max(1, binaryRows.length);
const brier = mean(binaryRows.map((row) => {
  const pIntended = row.counts.intendedReception / REPLICATES;
  const pOpponent = row.counts.opponentInterception / REPLICATES;
  const pOther = 1 - pIntended - pOpponent;
  const actual = actualBinary(row);
  return (pIntended - (actual === 'intended' ? 1 : 0)) ** 2
    + (pOpponent - (actual === 'opponent' ? 1 : 0)) ** 2
    + pOther ** 2;
}));
const childRuns = (eligiblePasses - targetUnsupported) * REPLICATES;
const resolvedChildren = childRuns - childForceFailures - childCensors;
const resolvedRate = resolvedChildren / Math.max(1, childRuns);
const meanLargestMass = mean(rows.map((row) => row.largestMass));
const unanimousRate = rows.filter((row) => row.unanimous).length / Math.max(1, rows.length);
const variableContactRecords = rows.filter((row) => new Set(row.contactCounts).size > 1).length;
const variableOutcomeRecords = rows.filter((row) => !row.unanimous).length;

const gates = {
  matches: represented.size === MATCHES,
  ordinarySupport: ordinaryPasses >= 8_000,
  targetCoverage: (eligiblePasses - targetUnsupported) / Math.max(1, eligiblePasses) >= 0.75,
  binarySupport: binaryRows.length >= 5_000,
  replicateResolution: resolvedRate >= 0.95,
  independentBalanced: independent.balanced >= 0.80,
  corridorEdge: independent.balanced - baseline.balanced >= 0.10,
  intendedRecall: independent.intended >= 0.75,
  opponentRecall: independent.opponent >= 0.65,
  meanLargestMass: meanLargestMass >= 0.75,
  unanimousRecords: unanimousRate >= 0.60,
  opponentSeparation: opponentSeparation >= 0.40,
  noDuplicates: duplicateIdentities === 0,
  rngPurity: perceptionRngChanges === 0,
  noFrozenMutation: frozenMutations === 0,
  noTruthFallback: truthFallbacks === 0,
  noForceFailures: normalForceFailures + sharedForceFailures + childForceFailures === 0,
  noAdministrativeCensors: normalCensors + sharedCensors === 0,
  conservation: conservationFailures === 0,
  kickParity: kickMismatches === 0,
  noChildSeedCollisions: withinPassChildSeedCollisions === 0,
  allReplicatesExecuted: executedReplicates === childRuns,
  noCoordinationPublications: coordinationPublications === 0,
  frozenActionVocabulary: forbiddenActionStates === 0,
  noTargetPosWrites: targetPosWrites === 0,
};

const report = {
  authority: 'C-RNG-0 coupled race post-kick RNG robustness',
  parameters: {
    matches: MATCHES,
    seedStart: SEED_START,
    awareness: AWARENESS,
    replicates: REPLICATES,
    namespace: CHILD_NAMESPACE,
  },
  support: {
    representedMatches: represented.size,
    ordinaryPasses,
    eligiblePasses,
    targetUnsupported,
    targetCoverage: (eligiblePasses - targetUnsupported) / Math.max(1, eligiblePasses),
    boundaryExcluded,
    invalidTarget,
    completeRows: rows.length,
    binaryRows: binaryRows.length,
    incompleteReplicateRecords,
    childRuns,
    resolvedChildren,
    resolvedRate,
  },
  metrics: { baseline, shared, independent, opponentSeparation, sharedAgreement, brier },
  variability: {
    meanLargestMass,
    unanimousRate,
    variableOutcomeRecords,
    variableContactRecords,
    meanDelayedControlRate: mean(rows.map((row) => row.delayedControlCount / REPLICATES)),
    meanContactCount: mean(rows.flatMap((row) => row.contactCounts)),
  },
  outcomeMass: Object.fromEntries(OUTCOMES.map((outcome) => [outcome,
    mean(rows.map((row) => row.counts[outcome] / REPLICATES))])),
  validity: {
    duplicateIdentities,
    perceptionRngChanges,
    frozenMutations,
    truthFallbacks,
    normalForceFailures,
    normalCensors,
    sharedForceFailures,
    sharedCensors,
    childForceFailures,
    childCensors,
    conservationFailures,
    kickMismatches,
    withinPassChildSeedCollisions,
    executedReplicates,
    coordinationPublications,
    forbiddenActionStates,
    targetPosWrites,
  },
  gates,
  pass: Object.values(gates).every(Boolean),
};

const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;
console.log('C-RNG-0 COUPLED RACE POST-KICK RNG ROBUSTNESS');
console.log(`matches ${represented.size}/${MATCHES} · passes ${rows.length}/${eligiblePasses}`
  + ` · target coverage ${pct(report.support.targetCoverage)} · binary ${binaryRows.length}`);
console.log(`child resolution ${pct(resolvedRate)} · BA corridor/shared/independent `
  + `${pct(baseline.balanced)} / ${pct(shared.balanced)} / ${pct(independent.balanced)}`
  + ` · independent recalls I ${pct(independent.intended)} O ${pct(independent.opponent)}`);
console.log(`largest mass ${pct(meanLargestMass)} · unanimous ${pct(unanimousRate)}`
  + ` · shared agreement ${pct(sharedAgreement)} · opponent separation ${pct(opponentSeparation)}`);
console.log(`variable outcomes/contacts ${variableOutcomeRecords}/${variableContactRecords}`
  + ` · Brier ${brier.toFixed(4)}`);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${report.pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
