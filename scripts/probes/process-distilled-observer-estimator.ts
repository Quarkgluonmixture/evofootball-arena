// T-STUDENT-0 PROCESS-DISTILLED OBSERVER TRANSITION ESTIMATOR.
// Authority: docs/world-model/PROCESS-DISTILLED-OBSERVER-ESTIMATOR.md
import { createHash } from 'node:crypto';
import { evaluatePassAffordance, type KnownReachProfile } from '../../src/ai/passAffordance';
import {
  KICK_TRANSITION_FEATURE_DIMENSIONS,
  projectKickTransitionFeaturesV1,
} from '../../src/ai/kickTransitionFeatures';
import {
  KICK_TRANSITION_CORRIDOR_FEATURE_DIMENSIONS,
  KICK_TRANSITION_CORRIDOR_FEATURE_VERSION,
  projectKickTransitionCorridorFeaturesV1,
} from '../../src/ai/kickTransitionCorridorFeatures';
import {
  capturePerceptionTruth,
  createPerceptionMemory,
  perceiveSnapshot,
  type PerceptionMemory,
  type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  capturePassLifecycle,
  classifyFirstTransition,
  type FirstTransitionOutcome,
  type OraclePassKey,
  type OracleTransitionStatus,
} from './oracle-v2';
import {
  fitSoftTransitionSoftmaxV1,
  predictSoftTransitionProbabilitiesV1,
  type SoftTransitionSoftmaxModelV1,
} from './transition-probability-model';

const numericArguments = process.argv.slice(2)
  .filter((value) => !value.startsWith('--'))
  .map(Number);
if (numericArguments.some((value) => !Number.isFinite(value))) {
  throw new Error('T-STUDENT-0 numeric arguments must be finite');
}
const FIT_START = numericArguments[0] ?? 71_000;
const FIT_MATCHES = numericArguments[1] ?? 120;
const INTERNAL_START = numericArguments[2] ?? 72_000;
const INTERNAL_MATCHES = numericArguments[3] ?? 120;
const EXTERNAL_START = numericArguments[4] ?? 74_000;
const EXTERNAL_MATCHES = numericArguments[5] ?? 120;
const ALTERNATIVE_AUDIT = process.argv.includes('--alternative-audit');
const INTERVENTION_TRAINING = process.argv.includes('--intervention-training');
const PAIRED_RISK_AUDIT = process.argv.includes('--paired-risk-audit');
const USE_CORRIDOR_FEATURES = process.argv.includes('--corridor')
  || ALTERNATIVE_AUDIT || INTERVENTION_TRAINING || PAIRED_RISK_AUDIT;
const ENGINEERING_EXTERNAL = process.argv.includes('--engineering-external');
const ALTERNATIVE_START = ALTERNATIVE_AUDIT ? numericArguments[2] ?? 77_000 : 77_000;
const ALTERNATIVE_MATCHES = ALTERNATIVE_AUDIT ? numericArguments[3] ?? 120 : 120;
const ALTERNATIVE_NAMESPACE = 0x7a170001;
const RANDOM_VALIDATION_START = 78_000;
const SELECTED_VALIDATION_START = 81_000;
const INTERVENTION_VALIDATION_MATCHES = 120;
const PAIRED_AUDIT_START = 83_000;
const PAIRED_AUDIT_MATCHES = 120;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const ADMIN_GUARD = 5;
const TRANSITION_CAP = 4;
const REPLICATES = 8;
const CHILD_NAMESPACE = 0x7d157001;
const BOOTSTRAPS = 10_000;
const BOOTSTRAP_NAMESPACE = 0x7d157562;

const OUTCOMES = [
  'intendedReception',
  'teammateRecovery',
  'opponentInterception',
  'loose',
  'deadBall',
] as const satisfies readonly FirstTransitionOutcome[];
const OUTCOME_INDEX = new Map<FirstTransitionOutcome, number>(
  OUTCOMES.map((outcome, index) => [outcome, index]),
);

interface TransitionRun {
  readonly status: OracleTransitionStatus;
  readonly outcome: FirstTransitionOutcome | null;
  readonly controllerGid: number | null;
  readonly kickSignature: string;
}

interface StudentRow {
  readonly identity: string;
  readonly matchSeed: number;
  readonly features: readonly number[];
  readonly corridorPresent: boolean;
  readonly label: number;
  readonly childCounts: readonly number[];
}

interface Dataset {
  readonly rows: readonly StudentRow[];
  readonly representedMatches: number;
  readonly ordinaryPasses: number;
  readonly eligiblePasses: number;
  readonly targetUnsupported: number;
  readonly featureUnsupported: number;
  readonly completeBeforeFeature: number;
  readonly boundaryExcluded: number;
  readonly invalidTarget: number;
  readonly duplicateIdentities: number;
  readonly perceptionRngChanges: number;
  readonly frozenMutations: number;
  readonly truthFallbacks: number;
  readonly labelForceFailures: number;
  readonly labelCensors: number;
  readonly childForceFailures: number;
  readonly childCensors: number;
  readonly conservationFailures: number;
  readonly kickMismatches: number;
  readonly childSeedCollisions: number;
  readonly executedReplicates: number;
  readonly incompleteRecords: number;
  readonly nonFiniteFeatures: number;
  readonly corridorVersionMismatches: number;
  readonly alternativeOpportunities: number;
  readonly alternativeChoiceFailures: number;
  readonly selectedTargetReuses: number;
  readonly actualCounts: readonly number[];
  readonly childCounts: readonly number[];
  readonly digest: string;
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

const runTransition = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
  childSeed: number | null,
): TransitionRun => {
  const failure = (): TransitionRun => ({
    status: 'forceFailure', outcome: null, controllerGid: null, kickSignature: '',
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
    passerGid, targetGid, side, kickTick: branch.simTick, kickTime: pending.t, kind: 'pass',
  };
  const kickSignature = JSON.stringify({
    rng: rngState(branch),
    ball: [branch.ball.pos, branch.ball.vel, branch.ball.z, branch.ball.vz],
    pending: branch.pendingPass,
    kind: branch.lastPassKind,
  });
  if (childSeed !== null) setRngState(branch, childSeed);
  let before = capturePassLifecycle(branch);
  const stop = pending.t + TRANSITION_CAP + DT * 2;
  while (!branch.finished && branch.simTime < stop) {
    branch.step(DT);
    const after = capturePassLifecycle(branch);
    const classified = classifyFirstTransition(before, after, key);
    if (classified !== null) {
      return {
        status: classified.status,
        outcome: classified.outcome,
        controllerGid: classified.controllerGid,
        kickSignature,
      };
    }
    before = after;
  }
  return { status: 'censored', outcome: null, controllerGid: null, kickSignature };
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

const observedFacts = (
  snapshot: PerceptionSnapshot,
  match: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
): { features: readonly number[] | null; corridorPresent: boolean; fallbacks: number } => {
  const profiles = profilesOf(match);
  const affordance = evaluatePassAffordance({
    snapshot,
    passerGid,
    targetGid,
    attackDir: match.teams[side].attackDir,
    reachProfiles: profiles,
  });
  const projected = affordance === null ? null : projectKickTransitionFeaturesV1(affordance);
  const baseFeatures = projected === null ? null : KICK_TRANSITION_FEATURE_DIMENSIONS.map((dimension) =>
    projected.features[dimension]);
  let fallbacks = 0;
  const defenderGids: number[] = [];
  for (const observed of snapshot.players) {
    if (observed.side === side || observed.gid === targetGid) continue;
    const rosterPlayer = match.allPlayers.find((player) => player.gid === observed.gid);
    if (!rosterPlayer) {
      fallbacks++;
      continue;
    }
    if (rosterPlayer.role === 'GK' || rosterPlayer.sentOff) continue;
    defenderGids.push(observed.gid);
  }
  const corridor = projectKickTransitionCorridorFeaturesV1({
    snapshot,
    passerGid,
    targetGid,
    defenderGids,
    reachProfiles: profiles,
  });
  const corridorPresent = corridor !== null
    && corridor.features.corridorStrongestMargin >= 0;
  const features = baseFeatures === null || (USE_CORRIDOR_FEATURES && corridor === null)
    ? null
    : [
      ...baseFeatures,
      ...(USE_CORRIDOR_FEATURES
        ? KICK_TRANSITION_CORRIDOR_FEATURE_DIMENSIONS.map((dimension) =>
          corridor!.features[dimension])
        : []),
    ];
  return { features, corridorPresent, fallbacks };
};

const collect = (
  start: number,
  matches: number,
  targetMode: 'selected' | 'randomAlternative' = 'selected',
): Dataset => {
  const rows: StudentRow[] = [];
  const identities = new Set<string>();
  const represented = new Set<number>();
  const digest = createHash('sha256');
  const actualCounts = Array<number>(5).fill(0);
  const aggregateChildCounts = Array<number>(5).fill(0);
  let ordinaryPasses = 0;
  let eligiblePasses = 0;
  let targetUnsupported = 0;
  let featureUnsupported = 0;
  let completeBeforeFeature = 0;
  let boundaryExcluded = 0;
  let invalidTarget = 0;
  let duplicateIdentities = 0;
  let perceptionRngChanges = 0;
  let frozenMutations = 0;
  let truthFallbacks = 0;
  let labelForceFailures = 0;
  let labelCensors = 0;
  let childForceFailures = 0;
  let childCensors = 0;
  let conservationFailures = 0;
  let kickMismatches = 0;
  let childSeedCollisions = 0;
  let executedReplicates = 0;
  let incompleteRecords = 0;
  let nonFiniteFeatures = 0;
  let corridorVersionMismatches = 0;
  let alternativeOpportunities = 0;
  let alternativeChoiceFailures = 0;
  let selectedTargetReuses = 0;

  for (let index = 0; index < matches; index++) {
    const seed = start + index;
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
        const selectedTarget = frozen.allPlayers.find((player) => player.gid === pass.targetGid);
        if (!passer || !selectedTarget || selectedTarget.role === 'GK' || selectedTarget.sentOff) {
          invalidTarget++;
          previousPass = pass;
          continue;
        }
        let target = selectedTarget;
        if (targetMode === 'randomAlternative') {
          const alternatives = launchSnapshot.players
            .filter((observed) => observed.side === passer.side
              && observed.gid !== passer.gid
              && observed.gid !== selectedTarget.gid)
            .map((observed) => frozen!.allPlayers.find((player) => player.gid === observed.gid))
            .filter((player): player is NonNullable<typeof player> =>
              player !== undefined && !player.sentOff && player.role !== 'GK')
            .sort((left, right) => left.gid - right.gid);
          if (alternatives.length === 0) {
            alternativeChoiceFailures++;
            previousPass = pass;
            continue;
          }
          alternativeOpportunities++;
          const choice = hashSeed(
            ALTERNATIVE_NAMESPACE, seed, frozen.simTick, passer.gid,
          ) % alternatives.length;
          target = alternatives[choice];
          if (target.gid === selectedTarget.gid) selectedTargetReuses++;
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
        const facts = observedFacts(launchSnapshot, frozen, passer.gid, target.gid, passer.side);
        truthFallbacks += facts.fallbacks;
        if (facts.features !== null && !facts.features.every(Number.isFinite)) nonFiniteFeatures++;
        if (USE_CORRIDOR_FEATURES && facts.features !== null
          && facts.features.length !== KICK_TRANSITION_FEATURE_DIMENSIONS.length
            + KICK_TRANSITION_CORRIDOR_FEATURE_DIMENSIONS.length) {
          corridorVersionMismatches++;
        }
        const beforeAudit = frozenSignature(frozen);
        const label = runTransition(frozen, passer.gid, target.gid, passer.side, null);
        if (label.status === 'forceFailure') labelForceFailures++;
        if (label.status === 'censored') labelCensors++;
        const childSeeds = Array.from({ length: REPLICATES }, (_, replicate) => hashSeed(
          CHILD_NAMESPACE, seed, frozen!.simTick, passer.gid, target.gid, replicate,
        ));
        childSeedCollisions += childSeeds.length - new Set(childSeeds).size;
        const children = childSeeds.map((childSeed) => {
          executedReplicates++;
          return runTransition(frozen!, passer.gid, target.gid, passer.side, childSeed);
        });
        childForceFailures += children.filter((child) => child.status === 'forceFailure').length;
        childCensors += children.filter((child) => child.status === 'censored').length;
        const signatures = [label.kickSignature, ...children.map((child) => child.kickSignature)];
        if (new Set(signatures).size !== 1) kickMismatches++;
        if (beforeAudit !== frozenSignature(frozen)) frozenMutations++;
        for (const result of [label, ...children]) {
          if (result.status === 'resolved' && result.outcome !== null
            && !validTransition(frozen, result.outcome, result.controllerGid, passer.side, target.gid)) {
            conservationFailures++;
          }
        }
        if (label.status !== 'resolved' || label.outcome === null
          || children.some((child) => child.status !== 'resolved' || child.outcome === null)) {
          incompleteRecords++;
          previousPass = pass;
          continue;
        }
        completeBeforeFeature++;
        if (facts.features === null) {
          featureUnsupported++;
          previousPass = pass;
          continue;
        }
        const counts = Array<number>(5).fill(0);
        for (const child of children) counts[OUTCOME_INDEX.get(child.outcome!)!]++;
        const labelIndex = OUTCOME_INDEX.get(label.outcome)!;
        actualCounts[labelIndex]++;
        for (let klass = 0; klass < 5; klass++) aggregateChildCounts[klass] += counts[klass];
        represented.add(seed);
        const row: StudentRow = {
          identity,
          matchSeed: seed,
          features: facts.features,
          corridorPresent: facts.corridorPresent,
          label: labelIndex,
          childCounts: counts,
        };
        rows.push(row);
        digest.update(`${JSON.stringify(row)}\n`);
      }
      previousPass = pass;
    }
  }
  return {
    rows,
    representedMatches: represented.size,
    ordinaryPasses,
    eligiblePasses,
    targetUnsupported,
    featureUnsupported,
    completeBeforeFeature,
    boundaryExcluded,
    invalidTarget,
    duplicateIdentities,
    perceptionRngChanges,
    frozenMutations,
    truthFallbacks,
    labelForceFailures,
    labelCensors,
    childForceFailures,
    childCensors,
    conservationFailures,
    kickMismatches,
    childSeedCollisions,
    executedReplicates,
    incompleteRecords,
    nonFiniteFeatures,
    corridorVersionMismatches,
    alternativeOpportunities,
    alternativeChoiceFailures,
    selectedTargetReuses,
    actualCounts,
    childCounts: aggregateChildCounts,
    digest: digest.digest('hex'),
  };
};

interface Priors {
  readonly global: readonly number[];
  readonly corridorEmpty: readonly number[];
  readonly corridorPresent: readonly number[];
}

const fitPriors = (rows: readonly StudentRow[]): Priors => {
  const globalCounts = Array<number>(5).fill(0);
  const emptyCounts = Array<number>(5).fill(0);
  const presentCounts = Array<number>(5).fill(0);
  let emptyN = 0;
  let presentN = 0;
  for (const row of rows) {
    globalCounts[row.label]++;
    if (row.corridorPresent) {
      presentCounts[row.label]++;
      presentN++;
    } else {
      emptyCounts[row.label]++;
      emptyN++;
    }
  }
  const global = globalCounts.map((count) => (count + 0.5) / (rows.length + 2.5));
  return {
    global,
    corridorEmpty: emptyCounts.map((count, klass) => (count + global[klass]) / (emptyN + 1)),
    corridorPresent: presentCounts.map((count, klass) =>
      (count + global[klass]) / (presentN + 1)),
  };
};

const teacherOf = (row: StudentRow, global: readonly number[]): readonly number[] =>
  row.childCounts.map((count, klass) => (count + global[klass]) / (REPLICATES + 1));
const probabilityVectorValid = (values: readonly number[]): boolean =>
  values.length === 5
  && values.every((value) => Number.isFinite(value) && value > 0 && value < 1)
  && Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) <= 1e-10;

interface PredictionRow {
  readonly row: StudentRow;
  readonly teacher: readonly number[];
  readonly student: readonly number[];
  readonly corridor: readonly number[];
  readonly global: readonly number[];
}

interface Scores {
  readonly teacherCrossEntropy: number;
  readonly teacherSquaredError: number;
  readonly actualLogLoss: number;
  readonly actualBrier: number;
  readonly actualClassBrier: readonly number[];
}

const scores = (
  probabilities: readonly number[], teacher: readonly number[], label: number,
): Scores => {
  const actualClassBrier = probabilities.map((probability, klass) =>
    (probability - (label === klass ? 1 : 0)) ** 2);
  return {
    teacherCrossEntropy: -teacher.reduce((sum, target, klass) =>
      sum + target * Math.log(Math.max(probabilities[klass], 1e-15)), 0),
    teacherSquaredError: probabilities.reduce((sum, probability, klass) =>
      sum + (probability - teacher[klass]) ** 2, 0),
    actualLogLoss: -Math.log(Math.max(probabilities[label], 1e-15)),
    actualBrier: actualClassBrier.reduce((sum, value) => sum + value, 0),
    actualClassBrier,
  };
};

interface MatchMetric {
  n: number;
  teacherEntropy: number;
  teacherCe: number[];
  teacherSq: number[];
  actualLog: number[];
  actualBrier: number[];
  classBrier: number[][];
}

const emptyMatchMetric = (): MatchMetric => ({
  n: 0,
  teacherEntropy: 0,
  teacherCe: Array(3).fill(0),
  teacherSq: Array(3).fill(0),
  actualLog: Array(3).fill(0),
  actualBrier: Array(3).fill(0),
  classBrier: Array.from({ length: 3 }, () => Array(5).fill(0)),
});

const buildMatchMetrics = (rows: readonly PredictionRow[]): Map<number, MatchMetric> => {
  const matches = new Map<number, MatchMetric>();
  for (const prediction of rows) {
    let metric = matches.get(prediction.row.matchSeed);
    if (metric === undefined) {
      metric = emptyMatchMetric();
      matches.set(prediction.row.matchSeed, metric);
    }
    metric.n++;
    metric.teacherEntropy += -prediction.teacher.reduce((sum, probability) =>
      sum + probability * Math.log(probability), 0);
    [prediction.student, prediction.corridor, prediction.global].forEach((probabilities, source) => {
      const value = scores(probabilities, prediction.teacher, prediction.row.label);
      metric!.teacherCe[source] += value.teacherCrossEntropy;
      metric!.teacherSq[source] += value.teacherSquaredError;
      metric!.actualLog[source] += value.actualLogLoss;
      metric!.actualBrier[source] += value.actualBrier;
      for (let klass = 0; klass < 5; klass++) {
        metric!.classBrier[source][klass] += value.actualClassBrier[klass];
      }
    });
  }
  return matches;
};

const meanMetric = (
  matches: ReadonlyMap<number, MatchMetric>,
  read: (metric: MatchMetric) => number,
): number => [...matches.values()].reduce((sum, metric) => sum + read(metric) / metric.n, 0)
  / Math.max(matches.size, 1);

const bootstrapBound = (
  matches: ReadonlyMap<number, MatchMetric>,
  read: (metric: MatchMetric) => number,
  quantile: number,
  channel: number,
): number => {
  const values = [...matches.values()].map((metric) => read(metric) / metric.n);
  const rng = new Rng(hashSeed(BOOTSTRAP_NAMESPACE, channel));
  const samples = Array<number>(BOOTSTRAPS);
  for (let bootstrap = 0; bootstrap < BOOTSTRAPS; bootstrap++) {
    let sum = 0;
    for (let draw = 0; draw < values.length; draw++) {
      sum += values[rng.int(0, values.length - 1)];
    }
    samples[bootstrap] = sum / values.length;
  }
  samples.sort((a, b) => a - b);
  return samples[Math.floor(quantile * (samples.length - 1))];
};

const calibration = (rows: readonly PredictionRow[]): {
  macroEce: number;
  classwise: readonly number[];
  inLarge: readonly number[];
} => {
  const classwise: number[] = [];
  const inLarge: number[] = [];
  for (let klass = 0; klass < 5; klass++) {
    let ece = 0;
    for (let bin = 0; bin < 10; bin++) {
      const lower = bin / 10;
      const upper = (bin + 1) / 10;
      const members = rows.filter((value) => {
        const probability = value.student[klass];
        return probability >= lower && (bin === 9 ? probability <= upper : probability < upper);
      });
      if (members.length === 0) continue;
      const predicted = members.reduce((sum, value) => sum + value.student[klass], 0)
        / members.length;
      const realised = members.reduce((sum, value) =>
        sum + (value.row.label === klass ? 1 : 0), 0) / members.length;
      ece += members.length / rows.length * Math.abs(predicted - realised);
    }
    classwise.push(ece);
    const predicted = rows.reduce((sum, value) => sum + value.student[klass], 0) / rows.length;
    const realised = rows.reduce((sum, value) =>
      sum + (value.row.label === klass ? 1 : 0), 0) / rows.length;
    inLarge.push(Math.abs(predicted - realised));
  }
  return {
    macroEce: classwise.reduce((sum, value) => sum + value, 0) / 5,
    classwise,
    inLarge,
  };
};

const median = (values: readonly number[]): number => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
};

interface Evaluation {
  readonly rows: number;
  readonly scores: {
    readonly teacherEntropy: number;
    readonly teacherCe: readonly number[];
    readonly teacherKl: readonly number[];
    readonly teacherSq: readonly number[];
    readonly actualLog: readonly number[];
    readonly actualBrier: readonly number[];
  };
  readonly improvement: {
    readonly teacherGlobalCe: number;
    readonly teacherGlobalSq: number;
    readonly teacherCorridorCe: number;
    readonly teacherCorridorSq: number;
    readonly actualGlobalLog: number;
    readonly actualGlobalBrier: number;
    readonly actualCorridorLog: number;
    readonly actualCorridorBrier: number;
  };
  readonly lcb: Readonly<Record<string, number>>;
  readonly classCorridorImprovement: readonly { mean: number; lcb: number; regressionUcb: number }[];
  readonly calibration: ReturnType<typeof calibration>;
  readonly medianL1FromGlobal: number;
  readonly opponentQuintileSeparation: number;
  readonly nonFiniteVectors: number;
}

const evaluate = (
  dataset: Dataset,
  model: SoftTransitionSoftmaxModelV1,
  priors: Priors,
): Evaluation => {
  const predictions: PredictionRow[] = dataset.rows.map((row) => ({
    row,
    teacher: teacherOf(row, priors.global),
    student: predictSoftTransitionProbabilitiesV1(model, row.features),
    corridor: row.corridorPresent ? priors.corridorPresent : priors.corridorEmpty,
    global: priors.global,
  }));
  const nonFiniteVectors = predictions.filter((value) =>
    ![value.teacher, value.student, value.corridor, value.global].every(probabilityVectorValid)).length;
  const matches = buildMatchMetrics(predictions);
  const sourceMeans = (field: 'teacherCe' | 'teacherSq' | 'actualLog' | 'actualBrier') =>
    Array.from({ length: 3 }, (_, source) => meanMetric(matches, (metric) => metric[field][source]));
  const teacherCe = sourceMeans('teacherCe');
  const teacherEntropy = meanMetric(matches, (metric) => metric.teacherEntropy);
  const teacherKl = teacherCe.map((value) => value - teacherEntropy);
  const teacherSq = sourceMeans('teacherSq');
  const actualLog = sourceMeans('actualLog');
  const actualBrier = sourceMeans('actualBrier');
  const improvement = {
    teacherGlobalCe: (teacherCe[2] - teacherCe[0]) / teacherCe[2],
    teacherGlobalSq: (teacherSq[2] - teacherSq[0]) / teacherSq[2],
    teacherCorridorCe: (teacherCe[1] - teacherCe[0]) / teacherCe[1],
    teacherCorridorSq: (teacherSq[1] - teacherSq[0]) / teacherSq[1],
    actualGlobalLog: (actualLog[2] - actualLog[0]) / actualLog[2],
    actualGlobalBrier: (actualBrier[2] - actualBrier[0]) / actualBrier[2],
    actualCorridorLog: (actualLog[1] - actualLog[0]) / actualLog[1],
    actualCorridorBrier: (actualBrier[1] - actualBrier[0]) / actualBrier[1],
  };
  const fields = [
    ['teacherGlobalCe', (metric: MatchMetric) => metric.teacherCe[2] - metric.teacherCe[0]],
    ['teacherGlobalSq', (metric: MatchMetric) => metric.teacherSq[2] - metric.teacherSq[0]],
    ['teacherCorridorCe', (metric: MatchMetric) => metric.teacherCe[1] - metric.teacherCe[0]],
    ['teacherCorridorSq', (metric: MatchMetric) => metric.teacherSq[1] - metric.teacherSq[0]],
    ['actualGlobalLog', (metric: MatchMetric) => metric.actualLog[2] - metric.actualLog[0]],
    ['actualGlobalBrier', (metric: MatchMetric) => metric.actualBrier[2] - metric.actualBrier[0]],
    ['actualCorridorLog', (metric: MatchMetric) => metric.actualLog[1] - metric.actualLog[0]],
    ['actualCorridorBrier', (metric: MatchMetric) => metric.actualBrier[1] - metric.actualBrier[0]],
  ] as const;
  const lcb: Record<string, number> = {};
  fields.forEach(([name, read], channel) => {
    lcb[name] = bootstrapBound(matches, read, 0.025, channel);
  });
  const classCorridorImprovement = Array.from({ length: 5 }, (_, klass) => {
    const read = (metric: MatchMetric): number =>
      metric.classBrier[1][klass] - metric.classBrier[0][klass];
    const mean = meanMetric(matches, read);
    return {
      mean,
      lcb: bootstrapBound(matches, read, 0.025, 20 + klass),
      regressionUcb: bootstrapBound(matches, (metric) => -read(metric), 0.975, 30 + klass),
    };
  });
  const ranked = [...predictions].sort((a, b) =>
    a.student[2] - b.student[2] || a.row.identity.localeCompare(b.row.identity));
  const fifth = Math.floor(ranked.length / 5);
  const bottom = ranked.slice(0, fifth);
  const top = ranked.slice(ranked.length - fifth);
  const rate = (rows: readonly PredictionRow[]): number => rows.reduce((sum, value) =>
    sum + (value.row.label === 2 ? 1 : 0), 0) / Math.max(rows.length, 1);
  return {
    rows: predictions.length,
    scores: { teacherEntropy, teacherCe, teacherKl, teacherSq, actualLog, actualBrier },
    improvement,
    lcb,
    classCorridorImprovement,
    calibration: calibration(predictions),
    medianL1FromGlobal: median(predictions.map((value) => value.student.reduce((sum, probability, klass) =>
      sum + Math.abs(probability - value.global[klass]), 0))),
    opponentQuintileSeparation: rate(top) - rate(bottom),
    nonFiniteVectors,
  };
};

const datasetGates = (dataset: Dataset, expectedMatches: number): Record<string, boolean> => {
  const targetSupported = dataset.eligiblePasses - dataset.targetUnsupported;
  const configuredChildren = targetSupported * REPLICATES;
  return {
    matches: dataset.representedMatches === expectedMatches,
    rowSupport: dataset.rows.length >= 5_000,
    featureSupport: dataset.rows.length / Math.max(dataset.completeBeforeFeature, 1) >= 0.70,
    labelResolution: (targetSupported - dataset.labelCensors - dataset.labelForceFailures)
      / Math.max(targetSupported, 1) >= 0.95,
    childResolution: (configuredChildren - dataset.childCensors - dataset.childForceFailures)
      / Math.max(configuredChildren, 1) >= 0.95,
    allActualOutcomes: dataset.actualCounts.every((count) => count > 0),
    allChildOutcomes: dataset.childCounts.every((count) => count > 0),
    noDuplicates: dataset.duplicateIdentities === 0,
    rngPurity: dataset.perceptionRngChanges === 0,
    noFrozenMutation: dataset.frozenMutations === 0,
    noTruthFallback: dataset.truthFallbacks === 0,
    noForceFailures: dataset.labelForceFailures === 0 && dataset.childForceFailures === 0,
    conservation: dataset.conservationFailures === 0,
    kickParity: dataset.kickMismatches === 0,
    noChildSeedCollisions: dataset.childSeedCollisions === 0,
    allReplicatesExecuted: dataset.executedReplicates === configuredChildren,
    finiteFeatures: dataset.nonFiniteFeatures === 0,
    corridorFeatureVersion: !USE_CORRIDOR_FEATURES || dataset.corridorVersionMismatches === 0,
  };
};

const learningGates = (evaluation: Evaluation, external: boolean): Record<string, boolean> => ({
  finiteProbabilityVectors: evaluation.nonFiniteVectors === 0,
  teacherGlobalCeMean: evaluation.improvement.teacherGlobalCe >= 0.15,
  teacherGlobalSqMean: evaluation.improvement.teacherGlobalSq >= 0.15,
  teacherGlobalCeLcb: evaluation.lcb.teacherGlobalCe > 0,
  teacherGlobalSqLcb: evaluation.lcb.teacherGlobalSq > 0,
  teacherCorridorCeMean: evaluation.improvement.teacherCorridorCe >= 0.05,
  teacherCorridorSqMean: evaluation.improvement.teacherCorridorSq >= 0.05,
  teacherCorridorCeLcb: evaluation.lcb.teacherCorridorCe > 0,
  teacherCorridorSqLcb: evaluation.lcb.teacherCorridorSq > 0,
  actualGlobalLogMean: evaluation.improvement.actualGlobalLog >= 0.05,
  actualGlobalBrierMean: evaluation.improvement.actualGlobalBrier >= 0.05,
  actualGlobalLogLcb: evaluation.lcb.actualGlobalLog > 0,
  actualGlobalBrierLcb: evaluation.lcb.actualGlobalBrier > 0,
  actualCorridorLogMean: evaluation.improvement.actualCorridorLog >= 0.02,
  actualCorridorBrierMean: evaluation.improvement.actualCorridorBrier >= 0.02,
  actualCorridorLogLcb: evaluation.lcb.actualCorridorLog > 0,
  actualCorridorBrierLcb: evaluation.lcb.actualCorridorBrier > 0,
  calibrationAbsolute: evaluation.calibration.macroEce <= 0.04,
  intendedCalibrationInLarge: evaluation.calibration.inLarge[0] <= 0.03,
  opponentCalibrationInLarge: evaluation.calibration.inLarge[2] <= 0.03,
  teammateCalibrationInLarge: evaluation.calibration.inLarge[1] <= 0.015,
  looseCalibrationInLarge: evaluation.calibration.inLarge[3] <= 0.015,
  deadCalibrationInLarge: evaluation.calibration.inLarge[4] <= 0.015,
  probabilityVariation: evaluation.medianL1FromGlobal >= 0.08,
  opponentQuintileSeparation: evaluation.opponentQuintileSeparation >= 0.15,
  intendedBrierLcb: !external || evaluation.classCorridorImprovement[0].lcb > 0,
  opponentBrierLcb: !external || evaluation.classCorridorImprovement[2].lcb > 0,
  teammateNonRegression: !external || evaluation.classCorridorImprovement[1].regressionUcb <= 0.002,
  looseNonRegression: !external || evaluation.classCorridorImprovement[3].regressionUcb <= 0.002,
  deadNonRegression: !external || evaluation.classCorridorImprovement[4].regressionUcb <= 0.002,
});

const alternativeLearningGates = (evaluation: Evaluation): Record<string, boolean> => {
  const [studentKl, corridorKl, globalKl] = evaluation.scores.teacherKl;
  return {
    finiteProbabilityVectors: evaluation.nonFiniteVectors === 0,
    teacherGlobalKlMean: (globalKl - studentKl) / globalKl >= 0.10,
    teacherCorridorKlMean: (corridorKl - studentKl) / corridorKl >= 0.05,
    teacherGlobalKlLcb: evaluation.lcb.teacherGlobalCe > 0,
    teacherCorridorKlLcb: evaluation.lcb.teacherCorridorCe > 0,
    teacherGlobalSqMean: evaluation.improvement.teacherGlobalSq >= 0.10,
    teacherCorridorSqMean: evaluation.improvement.teacherCorridorSq >= 0.05,
    teacherGlobalSqLcb: evaluation.lcb.teacherGlobalSq > 0,
    teacherCorridorSqLcb: evaluation.lcb.teacherCorridorSq > 0,
    actualGlobalLogMean: evaluation.improvement.actualGlobalLog >= 0.05,
    actualGlobalBrierMean: evaluation.improvement.actualGlobalBrier >= 0.05,
    actualGlobalLogLcb: evaluation.lcb.actualGlobalLog > 0,
    actualGlobalBrierLcb: evaluation.lcb.actualGlobalBrier > 0,
    actualCorridorLogMean: evaluation.improvement.actualCorridorLog >= 0.02,
    actualCorridorBrierMean: evaluation.improvement.actualCorridorBrier >= 0.02,
    actualCorridorLogLcb: evaluation.lcb.actualCorridorLog > 0,
    actualCorridorBrierLcb: evaluation.lcb.actualCorridorBrier > 0,
    calibrationAbsolute: evaluation.calibration.macroEce <= 0.04,
    intendedCalibrationInLarge: evaluation.calibration.inLarge[0] <= 0.03,
    opponentCalibrationInLarge: evaluation.calibration.inLarge[2] <= 0.03,
    teammateCalibrationInLarge: evaluation.calibration.inLarge[1] <= 0.015,
    looseCalibrationInLarge: evaluation.calibration.inLarge[3] <= 0.015,
    deadCalibrationInLarge: evaluation.calibration.inLarge[4] <= 0.015,
    probabilityVariation: evaluation.medianL1FromGlobal >= 0.08,
    opponentQuintileSeparation: evaluation.opponentQuintileSeparation >= 0.15,
    intendedBrierLcb: evaluation.classCorridorImprovement[0].lcb > 0,
    opponentBrierLcb: evaluation.classCorridorImprovement[2].lcb > 0,
    teammateNonRegression: evaluation.classCorridorImprovement[1].regressionUcb <= 0.002,
    looseNonRegression: evaluation.classCorridorImprovement[3].regressionUcb <= 0.002,
    deadNonRegression: evaluation.classCorridorImprovement[4].regressionUcb <= 0.002,
  };
};

interface PairedPrediction {
  readonly identity: string;
  readonly matchSeed: number;
  readonly selectedTeacher: readonly number[];
  readonly alternativeTeacher: readonly number[];
  /** Source order: student, corridor, global. */
  readonly selectedSources: readonly (readonly number[])[];
  readonly alternativeSources: readonly (readonly number[])[];
  readonly selectedLabel: number;
  readonly alternativeLabel: number;
}

interface PairedMatchMetric {
  n: number;
  teacherSq: number[];
  actualSq: number[];
}

const pairedPrediction = (
  selected: StudentRow,
  alternative: StudentRow,
  model: SoftTransitionSoftmaxModelV1,
  priors: Priors,
): PairedPrediction => {
  const sources = (row: StudentRow): readonly (readonly number[])[] => [
    predictSoftTransitionProbabilitiesV1(model, row.features),
    row.corridorPresent ? priors.corridorPresent : priors.corridorEmpty,
    priors.global,
  ];
  return {
    identity: selected.identity,
    matchSeed: selected.matchSeed,
    selectedTeacher: teacherOf(selected, priors.global),
    alternativeTeacher: teacherOf(alternative, priors.global),
    selectedSources: sources(selected),
    alternativeSources: sources(alternative),
    selectedLabel: selected.label,
    alternativeLabel: alternative.label,
  };
};

const deltaOf = (
  alternative: readonly number[], selected: readonly number[],
): readonly number[] => alternative.map((value, klass) => value - selected[klass]);

const pairBootstrapBound = (
  metrics: ReadonlyMap<number, PairedMatchMetric>,
  read: (metric: PairedMatchMetric) => number,
  quantile: number,
  channel: number,
): number => {
  const values = [...metrics.values()].map((metric) => read(metric) / metric.n);
  const rng = new Rng(hashSeed(BOOTSTRAP_NAMESPACE, 0x50414952, channel));
  const samples = Array<number>(BOOTSTRAPS);
  for (let bootstrap = 0; bootstrap < BOOTSTRAPS; bootstrap++) {
    let sum = 0;
    for (let draw = 0; draw < values.length; draw++) {
      sum += values[rng.int(0, values.length - 1)];
    }
    samples[bootstrap] = sum / values.length;
  }
  samples.sort((left, right) => left - right);
  return samples[Math.floor(quantile * (samples.length - 1))];
};

const pairMean = (
  metrics: ReadonlyMap<number, PairedMatchMetric>,
  read: (metric: PairedMatchMetric) => number,
): number => [...metrics.values()].reduce((sum, metric) => sum + read(metric) / metric.n, 0)
  / Math.max(metrics.size, 1);

const deltaCalibrationError = (
  rows: readonly PairedPrediction[], klass: number,
): { inLarge: number; ece: number } => {
  const samples = rows.map((row) => {
    const predicted = row.alternativeSources[0][klass] - row.selectedSources[0][klass];
    const actual = (row.alternativeLabel === klass ? 1 : 0)
      - (row.selectedLabel === klass ? 1 : 0);
    return { predicted, actual };
  });
  const meanPredicted = samples.reduce((sum, sample) => sum + sample.predicted, 0)
    / Math.max(samples.length, 1);
  const meanActual = samples.reduce((sum, sample) => sum + sample.actual, 0)
    / Math.max(samples.length, 1);
  let ece = 0;
  for (let bin = 0; bin < 10; bin++) {
    const lower = -1 + bin * 0.2;
    const upper = lower + 0.2;
    const members = samples.filter((sample) => sample.predicted >= lower
      && (bin === 9 ? sample.predicted <= upper : sample.predicted < upper));
    if (members.length === 0) continue;
    const predicted = members.reduce((sum, sample) => sum + sample.predicted, 0) / members.length;
    const actual = members.reduce((sum, sample) => sum + sample.actual, 0) / members.length;
    ece += members.length / samples.length * Math.abs(predicted - actual);
  }
  return { inLarge: Math.abs(meanPredicted - meanActual), ece };
};

const pairedDirection = (
  rows: readonly PairedPrediction[], klass: number,
): {
  teacherSignStudent: number;
  teacherSignCorridor: number;
  teacherQuintileSeparation: number;
  actualQuintileSeparation: number;
  calibrationInLarge: number;
  calibrationEce: number;
} => {
  const withDeltas = rows.map((row) => {
    const teacher = row.alternativeTeacher[klass] - row.selectedTeacher[klass];
    const student = row.alternativeSources[0][klass] - row.selectedSources[0][klass];
    const corridor = row.alternativeSources[1][klass] - row.selectedSources[1][klass];
    const actual = (row.alternativeLabel === klass ? 1 : 0)
      - (row.selectedLabel === klass ? 1 : 0);
    return { row, teacher, student, corridor, actual };
  });
  const nonZero = withDeltas.filter((value) => Math.abs(value.teacher) > 1e-12);
  const signRate = (source: 'student' | 'corridor'): number => nonZero.reduce((sum, value) =>
    sum + (Math.sign(value[source]) === Math.sign(value.teacher) ? 1 : 0), 0)
    / Math.max(nonZero.length, 1);
  const ranked = [...withDeltas].sort((left, right) =>
    left.student - right.student || left.row.identity.localeCompare(right.row.identity));
  const fifth = Math.floor(ranked.length / 5);
  const bottom = ranked.slice(0, fifth);
  const top = ranked.slice(ranked.length - fifth);
  const mean = (values: readonly typeof ranked[number][], field: 'teacher' | 'actual'): number =>
    values.reduce((sum, value) => sum + value[field], 0) / Math.max(values.length, 1);
  const calibrated = deltaCalibrationError(rows, klass);
  return {
    teacherSignStudent: signRate('student'),
    teacherSignCorridor: signRate('corridor'),
    teacherQuintileSeparation: mean(top, 'teacher') - mean(bottom, 'teacher'),
    actualQuintileSeparation: mean(top, 'actual') - mean(bottom, 'actual'),
    calibrationInLarge: calibrated.inLarge,
    calibrationEce: calibrated.ece,
  };
};

const runPairedRiskEvaluation = (
  selectedDataset: Dataset,
  alternativeDataset: Dataset,
  model: SoftTransitionSoftmaxModelV1,
  priors: Priors,
) => {
  const selectedByIdentity = new Map(selectedDataset.rows.map((row) => [row.identity, row]));
  const alternativeByIdentity = new Map(alternativeDataset.rows.map((row) => [row.identity, row]));
  const identities = [...selectedByIdentity.keys()]
    .filter((identity) => alternativeByIdentity.has(identity))
    .sort();
  const rows = identities.map((identity) => pairedPrediction(
    selectedByIdentity.get(identity)!, alternativeByIdentity.get(identity)!, model, priors,
  ));
  const metrics = new Map<number, PairedMatchMetric>();
  let nonFiniteDeltaVectors = 0;
  for (const row of rows) {
    let metric = metrics.get(row.matchSeed);
    if (!metric) {
      metric = { n: 0, teacherSq: Array(3).fill(0), actualSq: Array(3).fill(0) };
      metrics.set(row.matchSeed, metric);
    }
    metric.n++;
    const teacherDelta = deltaOf(row.alternativeTeacher, row.selectedTeacher);
    const actualDelta = Array.from({ length: 5 }, (_, klass) =>
      (row.alternativeLabel === klass ? 1 : 0) - (row.selectedLabel === klass ? 1 : 0));
    for (let source = 0; source < 3; source++) {
      const predictedDelta = deltaOf(row.alternativeSources[source], row.selectedSources[source]);
      if (![teacherDelta, actualDelta, predictedDelta].every((values) => values.every(Number.isFinite))) {
        nonFiniteDeltaVectors++;
      }
      metric.teacherSq[source] += predictedDelta.reduce((sum, value, klass) =>
        sum + (value - teacherDelta[klass]) ** 2, 0);
      metric.actualSq[source] += predictedDelta.reduce((sum, value, klass) =>
        sum + (value - actualDelta[klass]) ** 2, 0);
    }
  }
  const means = (field: 'teacherSq' | 'actualSq'): readonly number[] =>
    Array.from({ length: 3 }, (_, source) => pairMean(metrics, (metric) => metric[field][source]));
  const teacherSq = means('teacherSq');
  const actualSq = means('actualSq');
  const lcb = {
    teacherGlobal: pairBootstrapBound(metrics,
      (metric) => metric.teacherSq[2] - metric.teacherSq[0], 0.025, 0),
    teacherCorridor: pairBootstrapBound(metrics,
      (metric) => metric.teacherSq[1] - metric.teacherSq[0], 0.025, 1),
    actualGlobal: pairBootstrapBound(metrics,
      (metric) => metric.actualSq[2] - metric.actualSq[0], 0.025, 2),
    actualCorridor: pairBootstrapBound(metrics,
      (metric) => metric.actualSq[1] - metric.actualSq[0], 0.025, 3),
  };
  const intended = pairedDirection(rows, 0);
  const opponent = pairedDirection(rows, 2);
  const opponentDeltas = rows.map((row) =>
    row.alternativeSources[0][2] - row.selectedSources[0][2]);
  return {
    pairs: rows.length,
    representedMatches: metrics.size,
    selectedOnly: selectedDataset.rows.length - rows.length,
    alternativeOnly: alternativeDataset.rows.length - rows.length,
    pairedSupport: rows.length / Math.max(
      Math.min(selectedDataset.rows.length, alternativeDataset.rows.length), 1,
    ),
    nonFiniteDeltaVectors,
    teacherSq,
    actualSq,
    improvement: {
      teacherGlobal: (teacherSq[2] - teacherSq[0]) / teacherSq[2],
      teacherCorridor: (teacherSq[1] - teacherSq[0]) / teacherSq[1],
      actualGlobal: (actualSq[2] - actualSq[0]) / actualSq[2],
      actualCorridor: (actualSq[1] - actualSq[0]) / actualSq[1],
    },
    lcb,
    intended,
    opponent,
    antiVacuity: {
      medianAbsoluteOpponentDelta: median(opponentDeltas.map(Math.abs)),
      positiveOpponentDeltaShare: opponentDeltas.filter((value) => value > 0).length
        / Math.max(opponentDeltas.length, 1),
      negativeOpponentDeltaShare: opponentDeltas.filter((value) => value < 0).length
        / Math.max(opponentDeltas.length, 1),
    },
  };
};

const fitOnce = (dataset: Dataset, priors: Priors): SoftTransitionSoftmaxModelV1 =>
  fitRows(dataset.rows, priors);
const fitRows = (
  rows: readonly StudentRow[], priors: Priors,
): SoftTransitionSoftmaxModelV1 =>
  fitSoftTransitionSoftmaxV1(
    rows.map((row) => row.features),
    rows.map((row) => teacherOf(row, priors.global)),
  );

const modelDigest = (model: SoftTransitionSoftmaxModelV1): string =>
  createHash('sha256').update(JSON.stringify(model)).digest('hex');
const allTrue = (gates: Readonly<Record<string, boolean>>): boolean =>
  Object.values(gates).every(Boolean);
const allTrueExcept = (
  gates: Readonly<Record<string, boolean>>,
  excluded: ReadonlySet<string>,
): boolean => Object.entries(gates).every(([name, value]) => excluded.has(name) || value);
const datasetSummary = (dataset: Dataset) => {
  const { rows, ...summary } = dataset;
  return { ...summary, rows: rows.length };
};

const fitA = collect(FIT_START, FIT_MATCHES);
if (PAIRED_RISK_AUDIT) {
  const randomFit = collect(77_000, 120, 'randomAlternative');
  const unionRows = [...fitA.rows, ...randomFit.rows];
  const unionPriors = fitPriors(unionRows);
  const model = fitRows(unionRows, unionPriors);
  const repeatedModel = fitRows(unionRows, unionPriors);
  const fitGates = {
    selectedAuthority: fitA.digest
      === 'c99d3be12c7c2d65d35cc1be6b2aec88f7b5fc2ba0c863710e6ed20e10fd9547',
    randomAuthority: randomFit.digest
      === '817543fd3c5c746235b917fe4d30d12a9cdab1238be86740e90bdc24427cbda3',
    selectedExact: allTrue(datasetGates(fitA, FIT_MATCHES)),
    randomExact: allTrue({
      ...datasetGates(randomFit, 120),
      alternativeOpportunities: randomFit.alternativeOpportunities >= 7_000,
      noSelectedTargetReuse: randomFit.selectedTargetReuses === 0,
    }),
    deterministicModel: modelDigest(model) === modelDigest(repeatedModel),
    modelDimensions: model.inputDimensions === 19,
    modelParameters: model.weights.length === 195,
  };
  const selectedAudit = allTrue(fitGates)
    ? collect(PAIRED_AUDIT_START, PAIRED_AUDIT_MATCHES, 'selected') : null;
  const alternativeAudit = allTrue(fitGates)
    ? collect(PAIRED_AUDIT_START, PAIRED_AUDIT_MATCHES, 'randomAlternative') : null;
  const selectedExactGates = selectedAudit === null
    ? null : datasetGates(selectedAudit, PAIRED_AUDIT_MATCHES);
  const alternativeExactGates = alternativeAudit === null ? null : {
    ...datasetGates(alternativeAudit, PAIRED_AUDIT_MATCHES),
    alternativeOpportunities: alternativeAudit.alternativeOpportunities >= 7_000,
    noSelectedTargetReuse: alternativeAudit.selectedTargetReuses === 0,
  };
  const evaluation = selectedAudit === null || alternativeAudit === null
    ? null : runPairedRiskEvaluation(selectedAudit, alternativeAudit, model, unionPriors);
  const pairedGates = evaluation === null ? null : {
    representedMatches: evaluation.representedMatches === PAIRED_AUDIT_MATCHES,
    pairSupport: evaluation.pairs >= 7_000 && evaluation.pairedSupport >= 0.98,
    finiteDeltaVectors: evaluation.nonFiniteDeltaVectors === 0,
    teacherGlobalMean: evaluation.improvement.teacherGlobal >= 0.10,
    teacherCorridorMean: evaluation.improvement.teacherCorridor >= 0.05,
    teacherGlobalLcb: evaluation.lcb.teacherGlobal > 0,
    teacherCorridorLcb: evaluation.lcb.teacherCorridor > 0,
    actualGlobalMean: evaluation.improvement.actualGlobal >= 0.05,
    actualCorridorMean: evaluation.improvement.actualCorridor >= 0.02,
    actualGlobalLcb: evaluation.lcb.actualGlobal > 0,
    actualCorridorLcb: evaluation.lcb.actualCorridor > 0,
    intendedSign: evaluation.intended.teacherSignStudent >= 0.60,
    intendedSignEdge: evaluation.intended.teacherSignStudent
      - evaluation.intended.teacherSignCorridor >= 0.05,
    opponentSign: evaluation.opponent.teacherSignStudent >= 0.60,
    opponentSignEdge: evaluation.opponent.teacherSignStudent
      - evaluation.opponent.teacherSignCorridor >= 0.05,
    intendedTeacherSeparation: evaluation.intended.teacherQuintileSeparation >= 0.10,
    intendedActualSeparation: evaluation.intended.actualQuintileSeparation >= 0.08,
    opponentTeacherSeparation: evaluation.opponent.teacherQuintileSeparation >= 0.10,
    opponentActualSeparation: evaluation.opponent.actualQuintileSeparation >= 0.08,
    intendedCalibrationInLarge: evaluation.intended.calibrationInLarge <= 0.03,
    intendedCalibrationEce: evaluation.intended.calibrationEce <= 0.05,
    opponentCalibrationInLarge: evaluation.opponent.calibrationInLarge <= 0.03,
    opponentCalibrationEce: evaluation.opponent.calibrationEce <= 0.05,
    opponentDeltaVariation: evaluation.antiVacuity.medianAbsoluteOpponentDelta >= 0.03,
    opponentPositiveSupport: evaluation.antiVacuity.positiveOpponentDeltaShare >= 0.20,
    opponentNegativeSupport: evaluation.antiVacuity.negativeOpponentDeltaShare >= 0.20,
  };
  const pass = allTrue(fitGates)
    && selectedExactGates !== null && alternativeExactGates !== null && pairedGates !== null
    && allTrue(selectedExactGates) && allTrue(alternativeExactGates) && allTrue(pairedGates);
  const report = {
    authority: 'T-PAIR-0 within-decision transition-risk audit',
    parameters: {
      selectedFitStart: FIT_START,
      randomFitStart: 77_000,
      pairedAuditStart: PAIRED_AUDIT_START,
      matches: PAIRED_AUDIT_MATCHES,
      alternativeNamespace: ALTERNATIVE_NAMESPACE,
      replicates: REPLICATES,
      childNamespace: CHILD_NAMESPACE,
      featureVersion: KICK_TRANSITION_CORRIDOR_FEATURE_VERSION,
    },
    unionRows: unionRows.length,
    modelDigest: modelDigest(model),
    fitGates,
    selectedAudit: selectedAudit === null ? null : datasetSummary(selectedAudit),
    alternativeAudit: alternativeAudit === null ? null : datasetSummary(alternativeAudit),
    selectedExactGates,
    alternativeExactGates,
    evaluation,
    pairedGates,
    pass,
  };
  const canonical = JSON.stringify(report);
  const sha = createHash('sha256').update(canonical).digest('hex');
  console.log('T-PAIR-0 WITHIN-DECISION TRANSITION-RISK AUDIT');
  console.log(`union rows ${unionRows.length} · fit gates ${JSON.stringify(fitGates)}`);
  if (evaluation !== null) {
    console.log(`pairs ${evaluation.pairs} · matches ${evaluation.representedMatches}`
      + ` · support ${evaluation.pairedSupport.toFixed(6)}`);
    console.log(`teacher delta Sq student/corridor/global ${evaluation.teacherSq.map((value) => value.toFixed(6)).join('/')}`);
    console.log(`actual delta Sq student/corridor/global ${evaluation.actualSq.map((value) => value.toFixed(6)).join('/')}`);
    console.log(`intended ${JSON.stringify(evaluation.intended)}`);
    console.log(`opponent ${JSON.stringify(evaluation.opponent)}`);
    console.log(`anti-vacuity ${JSON.stringify(evaluation.antiVacuity)}`);
    console.log(`gates ${JSON.stringify(pairedGates)}`);
  }
  console.log(`PASS ${pass}`);
  console.log(`SHA256 ${sha}`);
  if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
  process.exit(0);
}
if (INTERVENTION_TRAINING) {
  const randomFit = collect(77_000, 120, 'randomAlternative');
  const unionRows = [...fitA.rows, ...randomFit.rows];
  const unionPriors = fitPriors(unionRows);
  const model = fitRows(unionRows, unionPriors);
  const repeatedModel = fitRows(unionRows, unionPriors);
  const selectedFitGates = datasetGates(fitA, FIT_MATCHES);
  const randomFitGates = {
    ...datasetGates(randomFit, 120),
    alternativeOpportunities: randomFit.alternativeOpportunities >= 7_000,
    noSelectedTargetReuse: randomFit.selectedTargetReuses === 0,
  };
  const fitGates = {
    selectedAuthority: fitA.digest
      === 'c99d3be12c7c2d65d35cc1be6b2aec88f7b5fc2ba0c863710e6ed20e10fd9547',
    randomAuthority: randomFit.digest
      === '817543fd3c5c746235b917fe4d30d12a9cdab1238be86740e90bdc24427cbda3',
    selectedExact: allTrue(selectedFitGates),
    randomExact: allTrue(randomFitGates),
    deterministicModel: modelDigest(model) === modelDigest(repeatedModel),
    modelDimensions: model.inputDimensions === 19,
    modelParameters: model.weights.length === 195,
  };
  const randomValidation = allTrue(fitGates)
    ? collect(RANDOM_VALIDATION_START, INTERVENTION_VALIDATION_MATCHES, 'randomAlternative')
    : null;
  const selectedValidation = allTrue(fitGates)
    ? collect(SELECTED_VALIDATION_START, INTERVENTION_VALIDATION_MATCHES, 'selected')
    : null;
  const randomEvaluation = randomValidation === null
    ? null : evaluate(randomValidation, model, unionPriors);
  const selectedEvaluation = selectedValidation === null
    ? null : evaluate(selectedValidation, model, unionPriors);
  const randomExactGates = randomValidation === null ? null : {
    ...datasetGates(randomValidation, INTERVENTION_VALIDATION_MATCHES),
    alternativeOpportunities: randomValidation.alternativeOpportunities >= 7_000,
    noSelectedTargetReuse: randomValidation.selectedTargetReuses === 0,
  };
  const selectedExactGates = selectedValidation === null
    ? null : datasetGates(selectedValidation, INTERVENTION_VALIDATION_MATCHES);
  const randomPredictiveGates = randomEvaluation === null
    ? null : alternativeLearningGates(randomEvaluation);
  const selectedPredictiveGates = selectedEvaluation === null
    ? null : alternativeLearningGates(selectedEvaluation);
  const crossStratumGates = randomEvaluation === null || selectedEvaluation === null ? null : {
    intendedCalibrationDifference: Math.abs(
      randomEvaluation.calibration.inLarge[0] - selectedEvaluation.calibration.inLarge[0],
    ) <= 0.03,
    opponentCalibrationDifference: Math.abs(
      randomEvaluation.calibration.inLarge[2] - selectedEvaluation.calibration.inLarge[2],
    ) <= 0.03,
  };
  const pass = allTrue(fitGates)
    && randomExactGates !== null && selectedExactGates !== null
    && randomPredictiveGates !== null && selectedPredictiveGates !== null
    && crossStratumGates !== null
    && allTrue(randomExactGates) && allTrue(selectedExactGates)
    && allTrue(randomPredictiveGates) && allTrue(selectedPredictiveGates)
    && allTrue(crossStratumGates);
  const report = {
    authority: 'T-INTERVENE-0 intervention-supported transition estimator',
    parameters: {
      selectedFitStart: FIT_START,
      randomFitStart: 77_000,
      randomValidationStart: RANDOM_VALIDATION_START,
      selectedValidationStart: SELECTED_VALIDATION_START,
      matchesPerPartition: INTERVENTION_VALIDATION_MATCHES,
      alternativeNamespace: ALTERNATIVE_NAMESPACE,
      awareness: AWARENESS,
      replicates: REPLICATES,
      childNamespace: CHILD_NAMESPACE,
      featureVersion: KICK_TRANSITION_CORRIDOR_FEATURE_VERSION,
    },
    selectedFit: datasetSummary(fitA),
    randomFit: datasetSummary(randomFit),
    unionRows: unionRows.length,
    model: {
      version: model.version,
      inputDimensions: model.inputDimensions,
      basisDimensions: model.basisDimensions,
      weights: model.weights.length,
      digest: modelDigest(model),
    },
    unionPriors,
    fitGates,
    selectedFitGates,
    randomFitGates,
    randomValidation: randomValidation === null ? null : datasetSummary(randomValidation),
    selectedValidation: selectedValidation === null ? null : datasetSummary(selectedValidation),
    randomEvaluation,
    selectedEvaluation,
    randomExactGates,
    selectedExactGates,
    randomPredictiveGates,
    selectedPredictiveGates,
    crossStratumGates,
    pass,
  };
  const canonical = JSON.stringify(report);
  const sha = createHash('sha256').update(canonical).digest('hex');
  console.log('T-INTERVENE-0 INTERVENTION-SUPPORTED TRANSITION ESTIMATOR');
  console.log(`union rows ${unionRows.length} · fit gates ${JSON.stringify(fitGates)}`);
  if (randomEvaluation !== null && selectedEvaluation !== null) {
    console.log(`random actual log/Brier ${randomEvaluation.scores.actualLog[0].toFixed(6)}`
      + `/${randomEvaluation.scores.actualBrier[0].toFixed(6)}`
      + ` · ECE ${randomEvaluation.calibration.macroEce.toFixed(6)}`);
    console.log(`random teacher KL ${randomEvaluation.scores.teacherKl.map((value) => value.toFixed(6)).join('/')}`
      + ` · teacher squared ${randomEvaluation.scores.teacherSq.map((value) => value.toFixed(6)).join('/')}`
      + ` · actual log ${randomEvaluation.scores.actualLog.map((value) => value.toFixed(6)).join('/')}`
      + ` · actual Brier ${randomEvaluation.scores.actualBrier.map((value) => value.toFixed(6)).join('/')}`
      + ` · calibration-in-large ${randomEvaluation.calibration.inLarge.map((value) => value.toFixed(6)).join('/')}`);
    console.log(`selected actual log/Brier ${selectedEvaluation.scores.actualLog[0].toFixed(6)}`
      + `/${selectedEvaluation.scores.actualBrier[0].toFixed(6)}`
      + ` · ECE ${selectedEvaluation.calibration.macroEce.toFixed(6)}`);
    console.log(`selected teacher KL ${selectedEvaluation.scores.teacherKl.map((value) => value.toFixed(6)).join('/')}`
      + ` · teacher squared ${selectedEvaluation.scores.teacherSq.map((value) => value.toFixed(6)).join('/')}`
      + ` · actual log ${selectedEvaluation.scores.actualLog.map((value) => value.toFixed(6)).join('/')}`
      + ` · actual Brier ${selectedEvaluation.scores.actualBrier.map((value) => value.toFixed(6)).join('/')}`
      + ` · calibration-in-large ${selectedEvaluation.calibration.inLarge.map((value) => value.toFixed(6)).join('/')}`);
    console.log(`random gates ${JSON.stringify({ ...randomExactGates, ...randomPredictiveGates })}`);
    console.log(`selected gates ${JSON.stringify({ ...selectedExactGates, ...selectedPredictiveGates })}`);
    console.log(`cross-stratum gates ${JSON.stringify(crossStratumGates)}`);
  }
  console.log(`PASS ${pass}`);
  console.log(`SHA256 ${sha}`);
  if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
  process.exit(0);
}
const priors = fitPriors(fitA.rows);
const modelA = fitOnce(fitA, priors);
const fitB = collect(FIT_START, FIT_MATCHES);
const modelB = fitOnce(fitB, priors);
const fitGates = {
  ...datasetGates(fitA, FIT_MATCHES),
  deterministicDataset: fitA.digest === fitB.digest,
  deterministicModel: modelDigest(modelA) === modelDigest(modelB),
  modelDimensions: modelA.inputDimensions === (USE_CORRIDOR_FEATURES ? 19 : 14),
  modelParameters: modelA.weights.length === (USE_CORRIDOR_FEATURES ? 195 : 145),
};

if (ALTERNATIVE_AUDIT) {
  const alternatives = collect(ALTERNATIVE_START, ALTERNATIVE_MATCHES, 'randomAlternative');
  const evaluation = evaluate(alternatives, modelA, priors);
  const exactGates = {
    ...datasetGates(alternatives, ALTERNATIVE_MATCHES),
    alternativeOpportunities: alternatives.alternativeOpportunities >= 7_000,
    alternativeRows: alternatives.rows.length >= 5_000,
    alternativeFeatureSupport: alternatives.rows.length
      / Math.max(alternatives.completeBeforeFeature, 1) >= 0.70,
    noSelectedTargetReuse: alternatives.selectedTargetReuses === 0,
  };
  const predictiveGates = alternativeLearningGates(evaluation);
  const alternativePass = allTrue(fitGates) && allTrue(exactGates) && allTrue(predictiveGates);
  const report = {
    authority: 'T-ALT-0 alternative-action transition coverage audit',
    parameters: {
      fitStart: FIT_START,
      fitMatches: FIT_MATCHES,
      alternativeStart: ALTERNATIVE_START,
      alternativeMatches: ALTERNATIVE_MATCHES,
      alternativeNamespace: ALTERNATIVE_NAMESPACE,
      awareness: AWARENESS,
      replicates: REPLICATES,
      childNamespace: CHILD_NAMESPACE,
      featureVersion: KICK_TRANSITION_CORRIDOR_FEATURE_VERSION,
    },
    fit: datasetSummary(fitA),
    model: {
      version: modelA.version,
      inputDimensions: modelA.inputDimensions,
      basisDimensions: modelA.basisDimensions,
      weights: modelA.weights.length,
      digest: modelDigest(modelA),
    },
    fitGates,
    alternatives: datasetSummary(alternatives),
    evaluation,
    exactGates,
    predictiveGates,
    pass: alternativePass,
  };
  const canonical = JSON.stringify(report);
  const sha = createHash('sha256').update(canonical).digest('hex');
  console.log('T-ALT-0 ALTERNATIVE-ACTION TRANSITION COVERAGE AUDIT');
  console.log(`fit rows ${fitA.rows.length} · gates ${JSON.stringify(fitGates)}`);
  console.log(`alternative rows ${alternatives.rows.length} · gates ${JSON.stringify({
    ...exactGates, ...predictiveGates,
  })}`);
  console.log(`teacher KL student/corridor/global ${evaluation.scores.teacherKl
    .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`actual log student/corridor/global ${evaluation.scores.actualLog
    .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`actual Brier student/corridor/global ${evaluation.scores.actualBrier
    .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`ECE ${evaluation.calibration.macroEce.toFixed(6)}`
    + ` · median L1 ${evaluation.medianL1FromGlobal.toFixed(4)}`
    + ` · opponent separation ${(evaluation.opponentQuintileSeparation * 100).toFixed(2)}%`);
  console.log(`PASS ${alternativePass}`);
  console.log(`SHA256 ${sha}`);
  if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
  process.exit(0);
}

const internal = collect(INTERNAL_START, INTERNAL_MATCHES);
const internalEvaluation = evaluate(internal, modelA, priors);
const internalDatasetGates = datasetGates(internal, INTERNAL_MATCHES);
const internalLearningGates = learningGates(internalEvaluation, false);
const internalPass = allTrue(fitGates) && allTrue(internalDatasetGates)
  && allTrue(internalLearningGates);

const externalAuthorised = internalPass || (USE_CORRIDOR_FEATURES && ENGINEERING_EXTERNAL);
const external = externalAuthorised ? collect(EXTERNAL_START, EXTERNAL_MATCHES) : null;
const externalEvaluation = external === null ? null : evaluate(external, modelA, priors);
const externalDatasetGates = external === null ? null : datasetGates(external, EXTERNAL_MATCHES);
const externalLearningGates = externalEvaluation === null ? null : learningGates(externalEvaluation, true);
const pass = internalPass && externalDatasetGates !== null && externalLearningGates !== null
  && allTrue(externalDatasetGates) && allTrue(externalLearningGates);
const engineeringExternalRobustness = !internalPass && USE_CORRIDOR_FEATURES && ENGINEERING_EXTERNAL
  && externalDatasetGates !== null && externalLearningGates !== null
  && allTrue(fitGates) && allTrue(internalDatasetGates) && allTrue(externalDatasetGates)
  && allTrueExcept(internalLearningGates, new Set(['teacherGlobalCeMean']))
  && allTrueExcept(externalLearningGates, new Set(['teacherGlobalCeMean']));

const report = {
  authority: USE_CORRIDOR_FEATURES
    ? 'T-CORRIDOR-0 pathwise corridor observer state audit'
    : 'T-STUDENT-0 process-distilled observer transition estimator',
  parameters: {
    fitStart: FIT_START,
    fitMatches: FIT_MATCHES,
    internalStart: INTERNAL_START,
    internalMatches: INTERNAL_MATCHES,
    externalStart: EXTERNAL_START,
    externalMatches: EXTERNAL_MATCHES,
    awareness: AWARENESS,
    replicates: REPLICATES,
    childNamespace: CHILD_NAMESPACE,
    featureVersion: USE_CORRIDOR_FEATURES
      ? KICK_TRANSITION_CORRIDOR_FEATURE_VERSION
      : 'kick-transition-features-v1',
    engineeringExternal: ENGINEERING_EXTERNAL,
  },
  fit: datasetSummary(fitA),
  model: {
    version: modelA.version,
    inputDimensions: modelA.inputDimensions,
    basisDimensions: modelA.basisDimensions,
    weights: modelA.weights.length,
    digest: modelDigest(modelA),
  },
  fitGates,
  priors,
  internal: datasetSummary(internal),
  internalEvaluation,
  internalDatasetGates,
  internalLearningGates,
  internalPass,
  externalAuthorised,
  external: external === null ? null : datasetSummary(external),
  externalEvaluation,
  externalDatasetGates,
  externalLearningGates,
  strictPass: pass,
  engineeringExternalRobustness,
  pass,
};
const canonical = JSON.stringify(report);
const sha = createHash('sha256').update(canonical).digest('hex');

console.log(USE_CORRIDOR_FEATURES
  ? 'T-CORRIDOR-0 PATHWISE CORRIDOR OBSERVER STATE AUDIT'
  : 'T-STUDENT-0 PROCESS-DISTILLED OBSERVER ESTIMATOR');
console.log(`fit rows ${fitA.rows.length} · gates ${JSON.stringify(fitGates)}`);
console.log(`internal rows ${internal.rows.length} · gates ${JSON.stringify({
  ...internalDatasetGates, ...internalLearningGates,
})}`);
console.log(`internal teacher CE student/corridor/global ${internalEvaluation.scores.teacherCe
  .map((value) => value.toFixed(6)).join('/')}`);
console.log(`internal teacher entropy ${internalEvaluation.scores.teacherEntropy.toFixed(6)}`
  + ` · KL student/corridor/global ${internalEvaluation.scores.teacherKl
    .map((value) => value.toFixed(6)).join('/')}`);
console.log(`internal actual log student/corridor/global ${internalEvaluation.scores.actualLog
  .map((value) => value.toFixed(6)).join('/')}`);
console.log(`internal actual Brier student/corridor/global ${internalEvaluation.scores.actualBrier
  .map((value) => value.toFixed(6)).join('/')}`);
console.log(`internal ECE ${internalEvaluation.calibration.macroEce.toFixed(6)}`
  + ` · median L1 ${internalEvaluation.medianL1FromGlobal.toFixed(4)}`
  + ` · opponent separation ${(internalEvaluation.opponentQuintileSeparation * 100).toFixed(2)}%`);
if (externalEvaluation !== null) {
  console.log(`external rows ${external!.rows.length} · gates ${JSON.stringify({
    ...externalDatasetGates, ...externalLearningGates,
  })}`);
  console.log(`external teacher CE student/corridor/global ${externalEvaluation.scores.teacherCe
    .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`external teacher entropy ${externalEvaluation.scores.teacherEntropy.toFixed(6)}`
    + ` · KL student/corridor/global ${externalEvaluation.scores.teacherKl
      .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`external actual log student/corridor/global ${externalEvaluation.scores.actualLog
    .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`external actual Brier student/corridor/global ${externalEvaluation.scores.actualBrier
    .map((value) => value.toFixed(6)).join('/')}`);
  console.log(`external ECE ${externalEvaluation.calibration.macroEce.toFixed(6)}`
    + ` · median L1 ${externalEvaluation.medianL1FromGlobal.toFixed(4)}`
    + ` · opponent separation ${(externalEvaluation.opponentQuintileSeparation * 100).toFixed(2)}%`);
}
console.log(`PASS ${pass}`);
if (ENGINEERING_EXTERNAL) {
  console.log(`ENGINEERING_EXTERNAL_ROBUSTNESS ${engineeringExternalRobustness}`);
}
console.log(`SHA256 ${sha}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
