// C-OBS-0 OBSERVER-GROUNDED COUPLED RACE AUDIT.
// Authority: docs/world-model/OBSERVER-GROUNDED-ARRIVAL-CONTACT.md
import { createHash } from 'node:crypto';
import { evaluatePassCorridorInterception } from '../../src/ai/passCorridorInterception';
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  oraclePerceptionSnapshot,
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
import { Rng } from '../../src/utils/rng';
import {
  capturePassLifecycle,
  classifyFirstTransition,
  type FirstTransitionOutcome,
  type OraclePassKey,
  type OracleTransitionStatus,
} from './oracle-v2';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED_START = Number(process.argv[3] ?? 69_000);
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const ADMIN_GUARD = 5;
const TRANSITION_CAP = 4;

type Binary = 'intended' | 'opponent';
type Prediction = Binary | 'other';

interface TransitionRun {
  status: OracleTransitionStatus;
  outcome: FirstTransitionOutcome | null;
  controllerGid: number | null;
  kickSignature: string;
  coordinationPublications: number;
  forbiddenActionStates: number;
  targetPosWrites: number;
}

interface Row {
  identity: string;
  actual: FirstTransitionOutcome;
  truth: FirstTransitionOutcome;
  observer: FirstTransitionOutcome;
  baselinePrediction: Binary;
  truthPrediction: Prediction;
  observerPrediction: Prediction;
  actualControllerGid: number | null;
  observerControllerGid: number | null;
  truthParticipants: number[];
  observerParticipants: number[];
  maxObservedAge: number;
}

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

const profilesOf = (match: Match): Map<number, KnownReachProfile> => new Map(
  match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
    topSpeed: player.topSpeed, accel: player.accel, dribbling: player.attrs.dribbling,
  }]),
);
const rngState = (match: Match): number => (match.rng as unknown as { s: number }).s;
const frozenSignature = (match: Match): string => JSON.stringify({
  tick: match.simTick, time: match.simTime, phase: match.phase, rng: rngState(match),
  ball: [match.ball.pos, match.ball.vel, match.ball.owner?.gid ?? null],
  players: match.allPlayers.map((player) => [
    player.gid, player.pos, player.vel, player.heading, player.action,
    player.decisionTimer, player.kickCooldown,
  ]),
});
const beforeAdministrativeBoundary = (match: Match): boolean => {
  const second = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1 ? match.duration / 2 : second + match.duration / 2;
  return boundary - match.simTime >= ADMIN_GUARD;
};
const action = (type: ActionState['type']): ActionState => ({ type, scores: [] });

const runTransition = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
  participants: ReadonlySet<number> | null,
): TransitionRun => {
  const branch = cloneSimulationState(frozen);
  const passer = branch.allPlayers.find((player) => player.gid === passerGid);
  const target = branch.allPlayers.find((player) => player.gid === targetGid);
  const failure = (): TransitionRun => ({
    status: 'forceFailure', outcome: null, controllerGid: null, kickSignature: '',
    coordinationPublications: 0, forbiddenActionStates: 0, targetPosWrites: 0,
  });
  if (!passer || !target || branch.ball.owner !== passer || branch.phase !== 'playing') return failure();
  branch.performPass(passer, target);
  const pending = branch.pendingPass;
  if (!pending || pending.passerGid !== passerGid || pending.targetGid !== targetGid
    || pending.side !== side || branch.lastPassKind?.kind !== 'pass') return failure();
  const key: OraclePassKey = {
    passerGid, targetGid, side, kickTick: branch.simTick, kickTime: pending.t, kind: 'pass',
  };
  const kickSignature = JSON.stringify({
    rng: rngState(branch), ball: [branch.ball.pos, branch.ball.vel, branch.ball.z, branch.ball.vz],
    pending: branch.pendingPass, kind: branch.lastPassKind,
  });
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
      raceTeam.chasers.clear(); raceTeam.marks.clear();
    }
  }
  let before = capturePassLifecycle(branch);
  const stop = pending.t + TRANSITION_CAP + DT * 2;
  while (!branch.finished && branch.simTime < stop) {
    if (participants !== null) {
      for (const player of branch.allPlayers) player.decisionTimer = Number.POSITIVE_INFINITY;
      for (const raceTeam of branch.teams) {
        raceTeam.brainTimer = Number.POSITIVE_INFINITY;
        raceTeam.chasers.clear(); raceTeam.marks.clear();
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
    if (classified !== null) return {
      status: classified.status,
      outcome: classified.outcome,
      controllerGid: classified.controllerGid,
      kickSignature,
      coordinationPublications,
      forbiddenActionStates,
      targetPosWrites,
    };
    before = after;
  }
  return {
    status: 'censored', outcome: null, controllerGid: null, kickSignature,
    coordinationPublications, forbiddenActionStates, targetPosWrites,
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
      snapshot, passerGid, targetGid, defenderGid: observed.gid, reachProfiles: profiles,
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
  const controller = controllerGid === null ? null
    : match.allPlayers.find((player) => player.gid === controllerGid) ?? null;
  if (outcome === 'intendedReception') return controller?.gid === targetGid && controller.side === side;
  if (outcome === 'teammateRecovery') {
    return controller !== null && controller.side === side && controller.gid !== targetGid;
  }
  if (outcome === 'opponentInterception') return controller !== null && controller.side !== side;
  return controllerGid === null;
};
const prediction = (outcome: FirstTransitionOutcome): Prediction => outcome === 'intendedReception'
  ? 'intended' : outcome === 'opponentInterception' ? 'opponent' : 'other';

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
let normalFailures = 0;
let truthFailures = 0;
let observerFailures = 0;
let conservationFailures = 0;
let administrativeCensors = 0;
let kickMismatches = 0;
let coordinationPublications = 0;
let forbiddenActionStates = 0;
let targetPosWrites = 0;

for (let index = 0; index < MATCHES; index++) {
  const seed = SEED_START + index;
  const match = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION, traceContests: true,
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
        capturePerceptionTruth(match), carrier.gid, AWARENESS, seed, memories.get(carrier.gid)!,
      );
      if (beforeRng !== rngState(match)) perceptionRngChanges++;
      if (carrier.decisionTimer <= 0 && carrier.kickCooldown <= 0) frozen = cloneSimulationState(match);
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
        boundaryExcluded++; previousPass = pass; continue;
      }
      const passer = frozen.allPlayers.find((player) => player.gid === pass.passerGid);
      const target = frozen.allPlayers.find((player) => player.gid === pass.targetGid);
      if (!passer || !target || target.role === 'GK' || target.sentOff) {
        invalidTarget++; previousPass = pass; continue;
      }
      eligiblePasses++;
      const observedTarget = launchSnapshot.players.some((player) => player.gid === target.gid);
      if (!observedTarget) {
        targetUnsupported++; previousPass = pass; continue;
      }
      const identity = `${seed}:${frozen.simTick}:${pass.passerGid}:${pass.targetGid}`;
      if (identities.has(identity)) duplicateIdentities++;
      identities.add(identity);
      const beforeQuery = frozenSignature(frozen);
      const truthSnapshot = oraclePerceptionSnapshot(capturePerceptionTruth(frozen), passer.gid);
      const truthSet = candidateSet(truthSnapshot, frozen, passer.gid, target.gid, passer.side);
      const observerSet = candidateSet(launchSnapshot, frozen, passer.gid, target.gid, passer.side);
      for (const gid of observerSet) {
        if (!launchSnapshot.players.some((player) => player.gid === gid)) truthFallbacks++;
      }
      if (beforeQuery !== frozenSignature(frozen)) frozenMutations++;

      const normal = runTransition(frozen, passer.gid, target.gid, passer.side, null);
      const truth = runTransition(frozen, passer.gid, target.gid, passer.side, truthSet);
      const observer = runTransition(frozen, passer.gid, target.gid, passer.side, observerSet);
      if (normal.status !== 'resolved' || normal.outcome === null) {
        normalFailures++; if (normal.status === 'censored') administrativeCensors++;
        previousPass = pass; continue;
      }
      if (truth.status !== 'resolved' || truth.outcome === null) {
        truthFailures++; if (truth.status === 'censored') administrativeCensors++;
        previousPass = pass; continue;
      }
      if (observer.status !== 'resolved' || observer.outcome === null) {
        observerFailures++; if (observer.status === 'censored') administrativeCensors++;
        previousPass = pass; continue;
      }
      if (normal.kickSignature !== truth.kickSignature || truth.kickSignature !== observer.kickSignature) {
        kickMismatches++;
      }
      for (const result of [normal, truth, observer]) {
        if (!validTransition(frozen, result.outcome!, result.controllerGid, passer.side, target.gid)) {
          conservationFailures++;
        }
      }
      coordinationPublications += truth.coordinationPublications + observer.coordinationPublications;
      forbiddenActionStates += truth.forbiddenActionStates + observer.forbiddenActionStates;
      targetPosWrites += truth.targetPosWrites + observer.targetPosWrites;
      represented.add(seed);
      rows.push({
        identity,
        actual: normal.outcome,
        truth: truth.outcome,
        observer: observer.outcome,
        baselinePrediction: observerSet.size > 0 ? 'opponent' : 'intended',
        truthPrediction: prediction(truth.outcome),
        observerPrediction: prediction(observer.outcome),
        actualControllerGid: normal.controllerGid,
        observerControllerGid: observer.controllerGid,
        truthParticipants: [...truthSet].sort((a, b) => a - b),
        observerParticipants: [...observerSet].sort((a, b) => a - b),
        maxObservedAge: Math.max(0, ...launchSnapshot.players.map((player) => player.ageTicks)),
      });
    }
    previousPass = pass;
  }
}

const binaryRows = rows.filter((row) =>
  row.actual === 'intendedReception' || row.actual === 'opponentInterception');
const actualBinary = (row: Row): Binary => row.actual === 'intendedReception' ? 'intended' : 'opponent';
const correct = (value: Prediction, row: Row): boolean => value === actualBinary(row);
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
const truthMetric = metric((row) => row.truthPrediction);
const observerMetric = metric((row) => row.observerPrediction);
const changed = binaryRows.filter((row) => row.baselinePrediction !== row.observerPrediction);
const changedBaselineCorrect = changed.filter((row) => correct(row.baselinePrediction, row)).length
  / Math.max(1, changed.length);
const changedObserverCorrect = changed.filter((row) => correct(row.observerPrediction, row)).length
  / Math.max(1, changed.length);
const saysOpponent = binaryRows.filter((row) => row.observerPrediction === 'opponent');
const saysIntended = binaryRows.filter((row) => row.observerPrediction === 'intended');
const opponentRate = (selected: readonly Row[]): number => selected.filter((row) =>
  row.actual === 'opponentInterception').length / Math.max(1, selected.length);
const opponentSeparation = opponentRate(saysOpponent) - opponentRate(saysIntended);
const truthAgreement = binaryRows.filter((row) => row.truthPrediction === row.observerPrediction).length
  / Math.max(1, binaryRows.length);
const setStats = rows.map((row) => {
  const truthSet = new Set(row.truthParticipants);
  const observerSet = new Set(row.observerParticipants);
  const intersection = [...truthSet].filter((gid) => observerSet.has(gid)).length;
  const union = new Set([...truthSet, ...observerSet]).size;
  return {
    identical: union === intersection,
    precision: intersection / Math.max(1, observerSet.size),
    recall: intersection / Math.max(1, truthSet.size),
    jaccard: union === 0 ? 1 : intersection / union,
  };
});
const mean = (values: readonly number[]): number => values.reduce((sum, value) => sum + value, 0)
  / Math.max(1, values.length);
const controlledRows = rows.filter((row) => row.actualControllerGid !== null
  && row.observerControllerGid !== null);
const controllerAgreement = controlledRows.filter((row) =>
  row.actualControllerGid === row.observerControllerGid).length / Math.max(1, controlledRows.length);

const gates = {
  matches: represented.size === MATCHES,
  ordinarySupport: ordinaryPasses >= 8_000,
  targetCoverage: (eligiblePasses - targetUnsupported) / Math.max(1, eligiblePasses) >= 0.75,
  binarySupport: binaryRows.length >= 5_000,
  resolvedSupport: rows.length / Math.max(1, eligiblePasses - targetUnsupported) >= 0.95,
  observerBalanced: observerMetric.balanced >= 0.80,
  baselineEdge: observerMetric.balanced - baseline.balanced >= 0.10,
  truthLoss: truthMetric.balanced - observerMetric.balanced <= 0.05,
  intendedRecall: observerMetric.intended >= 0.75,
  opponentRecall: observerMetric.opponent >= 0.65,
  truthAgreement: truthAgreement >= 0.85,
  changedSupport: changed.length / Math.max(1, binaryRows.length) >= 0.10,
  changedEdge: changedObserverCorrect - changedBaselineCorrect >= 0.20,
  opponentSeparation: opponentSeparation >= 0.40,
  nonVacuousPerception: setStats.some((entry) => !entry.identical),
  noDuplicates: duplicateIdentities === 0,
  rngPurity: perceptionRngChanges === 0,
  noFrozenMutation: frozenMutations === 0,
  noTruthFallback: truthFallbacks === 0,
  noForceFailures: normalFailures + truthFailures + observerFailures === 0,
  conservation: conservationFailures === 0,
  noAdministrativeCensors: administrativeCensors === 0,
  kickParity: kickMismatches === 0,
  noCoordinationPublications: coordinationPublications === 0,
  frozenActionVocabulary: forbiddenActionStates === 0,
  noTargetPosWrites: targetPosWrites === 0,
};

const report = {
  authority: 'C-OBS-0 observer-grounded coupled race audit',
  parameters: { matches: MATCHES, seedStart: SEED_START, awareness: AWARENESS },
  support: { representedMatches: represented.size, ordinaryPasses, eligiblePasses,
    targetUnsupported, targetCoverage: (eligiblePasses - targetUnsupported) / Math.max(1, eligiblePasses),
    boundaryExcluded, invalidTarget, rows: rows.length, binaryRows: binaryRows.length },
  metrics: { baseline, truth: truthMetric, observer: observerMetric, truthAgreement,
    controllerAgreement },
  mediators: { changed: changed.length, changedRate: changed.length / Math.max(1, binaryRows.length),
    changedBaselineCorrect, changedObserverCorrect, opponentSeparation,
    setDisagreements: setStats.filter((entry) => !entry.identical).length,
    candidatePrecision: mean(setStats.map((entry) => entry.precision)),
    candidateRecall: mean(setStats.map((entry) => entry.recall)),
    candidateJaccard: mean(setStats.map((entry) => entry.jaccard)),
    maxObservedAgeTicks: Math.max(0, ...rows.map((row) => row.maxObservedAge)) },
  validity: { duplicateIdentities, perceptionRngChanges, frozenMutations, truthFallbacks,
    normalFailures, truthFailures, observerFailures, conservationFailures,
    administrativeCensors, kickMismatches, coordinationPublications,
    forbiddenActionStates, targetPosWrites },
  gates,
  pass: Object.values(gates).every(Boolean),
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(1)}%`;
console.log('C-OBS-0 OBSERVER-GROUNDED COUPLED RACE AUDIT');
console.log(`matches ${represented.size}/${MATCHES} · passes ${rows.length}/${eligiblePasses}`
  + ` · target coverage ${pct(report.support.targetCoverage)} · binary ${binaryRows.length}`);
console.log(`BA baseline/truth/observer ${pct(baseline.balanced)} / ${pct(truthMetric.balanced)}`
  + ` / ${pct(observerMetric.balanced)} · observer recalls I ${pct(observerMetric.intended)}`
  + ` O ${pct(observerMetric.opponent)}`);
console.log(`truth agreement ${pct(truthAgreement)} · controller ${pct(controllerAgreement)}`
  + ` · changed correctness ${pct(changedBaselineCorrect)}→${pct(changedObserverCorrect)}`);
console.log(`candidate P/R/J ${pct(report.mediators.candidatePrecision)}`
  + `/${pct(report.mediators.candidateRecall)}/${pct(report.mediators.candidateJaccard)}`
  + ` · disagreements ${report.mediators.setDisagreements}`);
console.log(`gates ${JSON.stringify(gates)}`);
console.log(`PASS ${report.pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
