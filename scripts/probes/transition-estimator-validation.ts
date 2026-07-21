// T0b five-transition estimator: fixed fit/internal/external validation contract.
// Authority: docs/world-model/TRANSITION-ESTIMATOR-PROGRAMME.md §10
//   npx tsx scripts/probes/transition-estimator-validation.ts
import { createHash } from 'node:crypto';
import { evaluatePassAffordance, type KnownReachProfile } from '../../src/ai/passAffordance';
import {
  KICK_TRANSITION_FEATURE_DIMENSIONS,
  projectKickTransitionFeaturesV1,
} from '../../src/ai/kickTransitionFeatures';
import { passNextStateValue } from '../../src/ai/passValue';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type FirstTransitionOutcome,
  type OracleV2BranchRecord,
} from './oracle-v2';
import {
  fitTransitionSoftmaxV1,
  predictTransitionProbabilitiesV1,
  type TransitionSoftmaxModelV1,
} from './transition-probability-model';
import { auditTransitionCalibrationV1 } from './transition-calibration-audit';
import {
  fitFactorizedTransitionModelV1,
  predictFactorizedTransitionDecisionV1,
  type FactorizedTransitionModelV1,
} from './factorized-transition-model';

const TRAIN_START = 40000;
const TRAIN_MATCHES = 240;
const VALIDATION_START = 41000;
const VALIDATION_MATCHES = 120;
const BOOTSTRAPS = 10000;
const BOOTSTRAP_NAMESPACE = 0x74306262;

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
  const profiles = new Map<number, KnownReachProfile>();
  for (const player of match.allPlayers) {
    if (player.sentOff) continue;
    profiles.set(player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    });
  }
  return profiles;
};

interface Candidate {
  readonly targetGid: number;
  readonly features: readonly number[];
}

const candidatesAt = (match: Match, passerGid: number): Candidate[] => {
  const passer = match.allPlayers[passerGid];
  const snapshot = oraclePerceptionSnapshot(capturePerceptionTruth(match), passerGid);
  const profiles = profilesOf(match);
  const candidates: Candidate[] = [];
  for (const target of match.teams[passer.side].players) {
    if (target.sentOff || target.gid === passerGid) continue;
    const affordance = evaluatePassAffordance({
      snapshot,
      passerGid,
      targetGid: target.gid,
      attackDir: match.teams[passer.side].attackDir,
      reachProfiles: profiles,
    });
    if (affordance === null || passNextStateValue(affordance) === null) continue;
    const projected = projectKickTransitionFeaturesV1(affordance);
    if (projected === null) continue;
    candidates.push({
      targetGid: target.gid,
      features: KICK_TRANSITION_FEATURE_DIMENSIONS.map((dimension) =>
        projected.features[dimension]),
    });
  }
  return candidates;
};

interface DatasetRow {
  readonly matchSeed: number;
  readonly decisionId: string;
  readonly targetGid: number;
  readonly actionFeatures: readonly number[];
  readonly stateFeatures: readonly number[];
  readonly label: number;
}

interface DatasetResult {
  readonly rows: DatasetRow[];
  readonly clusters: number;
  readonly decisions: number;
  readonly actions: number;
  readonly censors: number;
  readonly forceFailures: number;
  readonly invariantFailures: number;
  readonly duplicateIdentities: number;
  readonly unrepresented: number;
  readonly digest: string;
}

const validateRecord = (
  record: OracleV2BranchRecord,
  targetGid: number,
  side: Side,
): number => {
  const transition = record.firstTransition;
  let failures = 0;
  if ((transition.status === 'resolved') !== (transition.outcome !== null)) failures++;
  if (transition.status === 'forceFailure') failures++;
  if (transition.outcome === 'intendedReception') {
    if (transition.controllerGid !== targetGid || transition.controllerSide !== side) failures++;
  } else if (transition.outcome === 'teammateRecovery') {
    if (
      transition.controllerGid === null
      || transition.controllerGid === targetGid
      || transition.controllerSide !== side
    ) failures++;
  } else if (transition.outcome === 'opponentInterception') {
    if (transition.controllerSide === null || transition.controllerSide === side) failures++;
  } else if (
    (transition.outcome === 'loose' || transition.outcome === 'deadBall')
    && transition.controllerGid !== null
  ) failures++;
  if (
    record.payoffFromKick3s.projectionVersion !== 'comparable-pass-payoff-v1'
    || !Object.values(record.payoffFromKick3s.comparable).every(Number.isFinite)
  ) failures++;
  return failures;
};

const meanFeatures = (candidates: readonly Candidate[]): number[] =>
  KICK_TRANSITION_FEATURE_DIMENSIONS.map((_, dimension) =>
    candidates.reduce((sum, candidate) => sum + candidate.features[dimension], 0)
      / candidates.length);

const generateDataset = (start: number, matches: number): DatasetResult => {
  const rows: DatasetRow[] = [];
  const identities = new Set<string>();
  const digest = createHash('sha256');
  let decisions = 0;
  let actions = 0;
  let censors = 0;
  let forceFailures = 0;
  let invariantFailures = 0;
  let duplicateIdentities = 0;
  let unrepresented = 0;

  for (let seed = start; seed < start + matches; seed++) {
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: 240,
    });
    let previousPass = match.pendingPass;
    while (!match.finished) {
      const owner = match.phase === 'playing' ? match.ball.owner : null;
      const frozen = owner && owner.decisionTimer <= 0 && owner.kickCooldown <= 0
        ? cloneSimulationState(match)
        : null;
      const frozenOwnerGid = owner?.gid ?? null;
      match.step(DT);
      const pass = match.pendingPass;
      const freshOrdinary = pass !== previousPass
        && pass !== null
        && match.lastPassKind?.kind === 'pass'
        && match.lastPassKind.t === pass.t
        && frozen !== null
        && frozen.phase === 'playing'
        && frozenOwnerGid === pass.passerGid;

      if (freshOrdinary && frozen !== null && pass !== null) {
        const candidates = candidatesAt(frozen, pass.passerGid);
        if (candidates.filter((candidate) => candidate.targetGid === pass.targetGid).length !== 1) {
          unrepresented++;
          previousPass = pass;
          continue;
        }
        decisions++;
        const decisionId = `${seed}:${frozen.simTick}:${pass.passerGid}`;
        const stateFeatures = meanFeatures(candidates);
        const side = frozen.allPlayers[pass.passerGid].side as Side;
        for (const candidate of candidates) {
          const identity = `${decisionId}:${candidate.targetGid}`;
          if (identities.has(identity)) duplicateIdentities++;
          identities.add(identity);
          const result = runOracleV2Branch({
            frozen,
            passerGid: pass.passerGid,
            targetGid: candidate.targetGid,
            side,
            branch: candidate.targetGid === pass.targetGid ? 'chosen' : 'alternative',
            includeTransitionDiagnostic: false,
          });
          if (!result.ok) {
            forceFailures++;
            continue;
          }
          actions++;
          invariantFailures += validateRecord(result.record, candidate.targetGid, side);
          const transition = result.record.firstTransition;
          digest.update(`${JSON.stringify({
            identity,
            actionFeatures: candidate.features,
            stateFeatures,
            transition,
          })}\n`);
          if (transition.status !== 'resolved') {
            censors++;
            continue;
          }
          rows.push({
            matchSeed: seed,
            decisionId,
            targetGid: candidate.targetGid,
            actionFeatures: candidate.features,
            stateFeatures,
            label: OUTCOME_INDEX.get(transition.outcome!)!,
          });
        }
      }
      previousPass = pass;
    }
  }

  return {
    rows,
    clusters: matches,
    decisions,
    actions,
    censors,
    forceFailures,
    invariantFailures,
    duplicateIdentities,
    unrepresented,
    digest: digest.digest('hex'),
  };
};

interface RowScores {
  readonly logLoss: number;
  readonly brier: number;
  readonly classBrier: readonly number[];
  readonly correct: number;
}

const score = (probabilities: readonly number[], label: number): RowScores => {
  const classBrier = probabilities.map((probability, klass) =>
    (probability - (label === klass ? 1 : 0)) ** 2);
  let predicted = 0;
  for (let klass = 1; klass < probabilities.length; klass++) {
    if (probabilities[klass] > probabilities[predicted]) predicted = klass;
  }
  return {
    logLoss: -Math.log(Math.max(probabilities[label], 1e-15)),
    brier: classBrier.reduce((sum, value) => sum + value, 0),
    classBrier,
    correct: predicted === label ? 1 : 0,
  };
};

interface ScoredRow {
  readonly row: DatasetRow;
  readonly actionProbabilities: readonly number[];
  readonly stateProbabilities: readonly number[];
  readonly globalProbabilities: readonly number[];
  readonly action: RowScores;
  readonly state: RowScores;
  readonly global: RowScores;
}

interface MatchMetric {
  n: number;
  actionLog: number;
  stateLog: number;
  globalLog: number;
  actionBrier: number;
  stateBrier: number;
  globalBrier: number;
  actionClass: number[];
  stateClass: number[];
  globalClass: number[];
  actionCorrect: number;
  stateCorrect: number;
  globalCorrect: number;
}

const emptyMatchMetric = (): MatchMetric => ({
  n: 0,
  actionLog: 0,
  stateLog: 0,
  globalLog: 0,
  actionBrier: 0,
  stateBrier: 0,
  globalBrier: 0,
  actionClass: Array(5).fill(0),
  stateClass: Array(5).fill(0),
  globalClass: Array(5).fill(0),
  actionCorrect: 0,
  stateCorrect: 0,
  globalCorrect: 0,
});

const matchMetrics = (rows: readonly ScoredRow[]): Map<number, MatchMetric> => {
  const matches = new Map<number, MatchMetric>();
  for (const value of rows) {
    let metric = matches.get(value.row.matchSeed);
    if (metric === undefined) {
      metric = emptyMatchMetric();
      matches.set(value.row.matchSeed, metric);
    }
    metric.n++;
    metric.actionLog += value.action.logLoss;
    metric.stateLog += value.state.logLoss;
    metric.globalLog += value.global.logLoss;
    metric.actionBrier += value.action.brier;
    metric.stateBrier += value.state.brier;
    metric.globalBrier += value.global.brier;
    metric.actionCorrect += value.action.correct;
    metric.stateCorrect += value.state.correct;
    metric.globalCorrect += value.global.correct;
    for (let klass = 0; klass < 5; klass++) {
      metric.actionClass[klass] += value.action.classBrier[klass];
      metric.stateClass[klass] += value.state.classBrier[klass];
      metric.globalClass[klass] += value.global.classBrier[klass];
    }
  }
  return matches;
};

const meanMatchMetric = (
  matches: ReadonlyMap<number, MatchMetric>,
  read: (metric: MatchMetric) => number,
): number => [...matches.values()].reduce((sum, metric) => sum + read(metric) / metric.n, 0)
  / Math.max(matches.size, 1);

const bootstrapLcb = (
  matches: ReadonlyMap<number, MatchMetric>,
  readImprovement: (metric: MatchMetric) => number,
  channel: number,
): number => {
  const values = [...matches.values()].map((metric) => readImprovement(metric) / metric.n);
  const rng = new Rng(hashSeed(BOOTSTRAP_NAMESPACE, channel));
  const samples = Array<number>(BOOTSTRAPS);
  for (let sample = 0; sample < BOOTSTRAPS; sample++) {
    let sum = 0;
    for (let draw = 0; draw < values.length; draw++) sum += values[rng.int(0, values.length - 1)];
    samples[sample] = sum / values.length;
  }
  samples.sort((left, right) => left - right);
  return samples[Math.floor(0.025 * BOOTSTRAPS)];
};

const ece = (
  rows: readonly ScoredRow[],
  probabilitiesOf: (row: ScoredRow) => readonly number[],
): { classwise: number[]; macro: number } => {
  const classwise: number[] = [];
  for (let klass = 0; klass < 5; klass++) {
    const ordered = [...rows].sort((left, right) =>
      probabilitiesOf(left)[klass] - probabilitiesOf(right)[klass]);
    let total = 0;
    for (let bin = 0; bin < 10; bin++) {
      const start = Math.floor(bin * ordered.length / 10);
      const end = Math.floor((bin + 1) * ordered.length / 10);
      if (end <= start) continue;
      let predicted = 0;
      let observed = 0;
      for (let index = start; index < end; index++) {
        predicted += probabilitiesOf(ordered[index])[klass];
        observed += ordered[index].row.label === klass ? 1 : 0;
      }
      total += (end - start) / ordered.length
        * Math.abs(predicted / (end - start) - observed / (end - start));
    }
    classwise.push(total);
  }
  return {
    classwise,
    macro: classwise.reduce((sum, value) => sum + value, 0) / classwise.length,
  };
};

const specificity = (rows: readonly ScoredRow[]): {
  decisions: number;
  differing: number;
  medianMaxL1: number;
} => {
  const byDecision = new Map<string, ScoredRow[]>();
  for (const row of rows) {
    const values = byDecision.get(row.row.decisionId) ?? [];
    values.push(row);
    byDecision.set(row.row.decisionId, values);
  }
  const distances: number[] = [];
  for (const values of byDecision.values()) {
    if (values.length < 2) continue;
    let maxDistance = 0;
    for (let left = 0; left < values.length; left++) {
      for (let right = left + 1; right < values.length; right++) {
        let distance = 0;
        for (let klass = 0; klass < 5; klass++) {
          distance += Math.abs(
            values[left].actionProbabilities[klass]
            - values[right].actionProbabilities[klass],
          );
        }
        maxDistance = Math.max(maxDistance, distance);
      }
    }
    distances.push(maxDistance);
  }
  distances.sort((left, right) => left - right);
  return {
    decisions: distances.length,
    differing: distances.filter((value) => value > 1e-6).length,
    medianMaxL1: distances[Math.floor(distances.length / 2)] ?? 0,
  };
};

interface EvaluationResult {
  readonly pass: boolean;
  readonly scoredRows: readonly ScoredRow[];
  readonly actionEce: { readonly classwise: readonly number[]; readonly macro: number };
  readonly stateEce: { readonly classwise: readonly number[]; readonly macro: number };
}

const evaluate = (
  name: string,
  rows: readonly DatasetRow[],
  actionModel: TransitionSoftmaxModelV1,
  stateModel: TransitionSoftmaxModelV1,
  globalProbabilities: readonly number[],
  datasetValidity: boolean,
  channelOffset: number,
): EvaluationResult => {
  let modelNonFinite = 0;
  const scoredRows = rows.map((row): ScoredRow => {
    const actionProbabilities = predictTransitionProbabilitiesV1(actionModel, row.actionFeatures);
    const stateProbabilities = predictTransitionProbabilitiesV1(stateModel, row.stateFeatures);
    if (
      !actionProbabilities.every(Number.isFinite)
      || !stateProbabilities.every(Number.isFinite)
    ) modelNonFinite++;
    return {
      row,
      actionProbabilities,
      stateProbabilities,
      globalProbabilities,
      action: score(actionProbabilities, row.label),
      state: score(stateProbabilities, row.label),
      global: score(globalProbabilities, row.label),
    };
  });
  const matches = matchMetrics(scoredRows);
  const outcomeCounts = Array(5).fill(0) as number[];
  for (const row of rows) outcomeCounts[row.label]++;
  const actionLog = meanMatchMetric(matches, (metric) => metric.actionLog);
  const stateLog = meanMatchMetric(matches, (metric) => metric.stateLog);
  const globalLog = meanMatchMetric(matches, (metric) => metric.globalLog);
  const actionBrier = meanMatchMetric(matches, (metric) => metric.actionBrier);
  const stateBrier = meanMatchMetric(matches, (metric) => metric.stateBrier);
  const globalBrier = meanMatchMetric(matches, (metric) => metric.globalBrier);
  const globalLogImprovement = (globalLog - actionLog) / globalLog;
  const globalBrierImprovement = (globalBrier - actionBrier) / globalBrier;
  const stateLogImprovement = (stateLog - actionLog) / stateLog;
  const stateBrierImprovement = (stateBrier - actionBrier) / stateBrier;
  const globalLogLcb = bootstrapLcb(matches, (metric) => metric.globalLog - metric.actionLog, channelOffset);
  const globalBrierLcb = bootstrapLcb(matches, (metric) => metric.globalBrier - metric.actionBrier, channelOffset + 1);
  const stateLogLcb = bootstrapLcb(matches, (metric) => metric.stateLog - metric.actionLog, channelOffset + 2);
  const stateBrierLcb = bootstrapLcb(matches, (metric) => metric.stateBrier - metric.actionBrier, channelOffset + 3);
  const classImprovement = OUTCOMES.map((_, klass) => meanMatchMetric(
    matches,
    (metric) => metric.stateClass[klass] - metric.actionClass[klass],
  ));
  const classLcb = OUTCOMES.map((_, klass) => bootstrapLcb(
    matches,
    (metric) => metric.stateClass[klass] - metric.actionClass[klass],
    channelOffset + 10 + klass,
  ));
  const actionEce = ece(scoredRows, (row) => row.actionProbabilities);
  const stateEce = ece(scoredRows, (row) => row.stateProbabilities);
  const actionSpecificity = specificity(scoredRows);
  const accuracy = {
    action: meanMatchMetric(matches, (metric) => metric.actionCorrect),
    state: meanMatchMetric(matches, (metric) => metric.stateCorrect),
    global: meanMatchMetric(matches, (metric) => metric.globalCorrect),
  };
  const gates = {
    validity: datasetValidity && modelNonFinite === 0,
    allOutcomes: outcomeCounts.every((count) => count > 0),
    globalLogMean: globalLogImprovement >= 0.05,
    globalBrierMean: globalBrierImprovement >= 0.05,
    globalLogLcb: globalLogLcb > 0,
    globalBrierLcb: globalBrierLcb > 0,
    stateLogMean: stateLogImprovement >= 0.02,
    stateBrierMean: stateBrierImprovement >= 0.02,
    stateLogLcb: stateLogLcb > 0,
    stateBrierLcb: stateBrierLcb > 0,
    intendedBrierLcb: classLcb[0] > 0,
    opponentBrierLcb: classLcb[2] > 0,
    teammateNonRegression: -classImprovement[1] <= 0.001,
    looseNonRegression: -classImprovement[3] <= 0.001,
    deadNonRegression: -classImprovement[4] <= 0.001,
    calibrationVsState: actionEce.macro <= stateEce.macro,
    calibrationAbsolute: actionEce.macro <= 0.04,
    specificityCoverage: actionSpecificity.differing / Math.max(actionSpecificity.decisions, 1) >= 0.95,
    specificityMagnitude: actionSpecificity.medianMaxL1 >= 0.10,
  };
  const pass = Object.values(gates).every(Boolean);

  console.log(`\n${name}: clusters ${matches.size} · rows ${rows.length} · outcomes ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, outcomeCounts[index]])))}`);
  console.log(
    `log loss action/state/global ${actionLog.toFixed(6)}/${stateLog.toFixed(6)}/${globalLog.toFixed(6)} · `
    + `improvement vs state/global ${(stateLogImprovement * 100).toFixed(2)}%/${(globalLogImprovement * 100).toFixed(2)}%`,
  );
  console.log(
    `Brier action/state/global ${actionBrier.toFixed(6)}/${stateBrier.toFixed(6)}/${globalBrier.toFixed(6)} · `
    + `improvement vs state/global ${(stateBrierImprovement * 100).toFixed(2)}%/${(globalBrierImprovement * 100).toFixed(2)}%`,
  );
  console.log(
    `bootstrap LCB global log/Brier ${globalLogLcb.toFixed(6)}/${globalBrierLcb.toFixed(6)} · `
    + `state log/Brier ${stateLogLcb.toFixed(6)}/${stateBrierLcb.toFixed(6)}`,
  );
  console.log(
    `class Brier improvement ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, Number(classImprovement[index].toFixed(6))])))} · `
    + `LCB ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, Number(classLcb[index].toFixed(6))])))}`,
  );
  console.log(
    `macro ECE action/state ${actionEce.macro.toFixed(6)}/${stateEce.macro.toFixed(6)} · `
    + `accuracy action/state/global ${(accuracy.action * 100).toFixed(2)}%/`
    + `${(accuracy.state * 100).toFixed(2)}%/${(accuracy.global * 100).toFixed(2)}%`,
  );
  console.log(
    `specificity differing ${actionSpecificity.differing}/${actionSpecificity.decisions} · `
    + `median max-L1 ${actionSpecificity.medianMaxL1.toFixed(6)}`,
  );
  console.log(`gates ${Object.entries(gates).map(([gate, value]) => `${gate}=${value ? 'PASS' : 'FAIL'}`).join(' · ')}`);
  console.log(`${name} verdict: ${pass ? 'PASS' : 'FAIL — STOP'}`);
  return { pass, scoredRows, actionEce, stateEce };
};

const evaluateFactorized = (
  name: string,
  rows: readonly DatasetRow[],
  model: FactorizedTransitionModelV1,
  globalProbabilities: readonly number[],
  datasetValidity: boolean,
  deterministicModel: boolean,
  channelOffset: number,
): { readonly pass: boolean } => {
  const byDecision = new Map<string, DatasetRow[]>();
  for (const row of rows) {
    const values = byDecision.get(row.decisionId) ?? [];
    values.push(row);
    byDecision.set(row.decisionId, values);
  }
  const probabilitiesByIdentity = new Map<string, readonly number[]>();
  const stateByIdentity = new Map<string, readonly number[]>();
  let balanceFailures = 0;
  let permutationFailures = 0;
  let modelNonFinite = 0;
  for (const values of byDecision.values()) {
    const candidates = values.map((row) => ({
      candidateKey: row.targetGid,
      actionFeatures: row.actionFeatures,
      stateFeatures: row.stateFeatures,
    }));
    const prediction = predictFactorizedTransitionDecisionV1(model, candidates);
    const reversed = predictFactorizedTransitionDecisionV1(model, [...candidates].reverse());
    if (JSON.stringify(reversed) !== JSON.stringify(prediction)) permutationFailures++;
    if (
      prediction.maxRowSumError > 1e-12
      || prediction.meanVectorL1Error > 1e-10
    ) balanceFailures++;
    for (const candidate of prediction.candidates) {
      if (!candidate.probabilities.every(Number.isFinite)) modelNonFinite++;
      const identity = `${values[0].decisionId}:${candidate.candidateKey}`;
      probabilitiesByIdentity.set(identity, candidate.probabilities);
      stateByIdentity.set(identity, prediction.stateProbabilities);
    }
  }
  const scoredRows = rows.map((row): ScoredRow => {
    const identity = `${row.decisionId}:${row.targetGid}`;
    const actionProbabilities = probabilitiesByIdentity.get(identity);
    const stateProbabilities = stateByIdentity.get(identity);
    if (actionProbabilities === undefined || stateProbabilities === undefined) {
      throw new Error(`missing factorized prediction for ${identity}`);
    }
    return {
      row,
      actionProbabilities,
      stateProbabilities,
      globalProbabilities,
      action: score(actionProbabilities, row.label),
      state: score(stateProbabilities, row.label),
      global: score(globalProbabilities, row.label),
    };
  });
  const matches = matchMetrics(scoredRows);
  const outcomeCounts = Array(5).fill(0) as number[];
  for (const row of rows) outcomeCounts[row.label]++;
  const actionLog = meanMatchMetric(matches, (metric) => metric.actionLog);
  const stateLog = meanMatchMetric(matches, (metric) => metric.stateLog);
  const globalLog = meanMatchMetric(matches, (metric) => metric.globalLog);
  const actionBrier = meanMatchMetric(matches, (metric) => metric.actionBrier);
  const stateBrier = meanMatchMetric(matches, (metric) => metric.stateBrier);
  const globalBrier = meanMatchMetric(matches, (metric) => metric.globalBrier);
  const globalLogImprovement = (globalLog - actionLog) / globalLog;
  const globalBrierImprovement = (globalBrier - actionBrier) / globalBrier;
  const stateLogImprovement = (stateLog - actionLog) / stateLog;
  const stateBrierImprovement = (stateBrier - actionBrier) / stateBrier;
  const globalLogLcb = bootstrapLcb(matches, (metric) => metric.globalLog - metric.actionLog, channelOffset);
  const globalBrierLcb = bootstrapLcb(matches, (metric) => metric.globalBrier - metric.actionBrier, channelOffset + 1);
  const stateLogLcb = bootstrapLcb(matches, (metric) => metric.stateLog - metric.actionLog, channelOffset + 2);
  const stateBrierLcb = bootstrapLcb(matches, (metric) => metric.stateBrier - metric.actionBrier, channelOffset + 3);
  const classImprovement = OUTCOMES.map((_, klass) => meanMatchMetric(
    matches,
    (metric) => metric.stateClass[klass] - metric.actionClass[klass],
  ));
  const classLcb = OUTCOMES.map((_, klass) => bootstrapLcb(
    matches,
    (metric) => metric.stateClass[klass] - metric.actionClass[klass],
    channelOffset + 10 + klass,
  ));
  const actionEce = ece(scoredRows, (row) => row.actionProbabilities);
  const stateEce = ece(scoredRows, (row) => row.stateProbabilities);
  const actionSpecificity = specificity(scoredRows);
  const calibration = auditTransitionCalibrationV1(scoredRows.map((row) => ({
    matchSeed: row.row.matchSeed,
    decisionId: row.row.decisionId,
    label: row.row.label,
    actionProbabilities: row.actionProbabilities,
    stateProbabilities: row.stateProbabilities,
  })));
  const calibrationParity = calibration.action.macroEce === actionEce.macro
    && calibration.state.macroEce === stateEce.macro;
  const accuracy = {
    action: meanMatchMetric(matches, (metric) => metric.actionCorrect),
    state: meanMatchMetric(matches, (metric) => metric.stateCorrect),
    global: meanMatchMetric(matches, (metric) => metric.globalCorrect),
  };
  const residualLimits = [0.02, 0.01, 0.02, 0.01, 0.01];
  const gates = {
    validity: datasetValidity
      && deterministicModel
      && modelNonFinite === 0
      && balanceFailures === 0
      && permutationFailures === 0
      && calibrationParity
      && Object.values(calibration.invariants).every((value) => value === 0),
    allOutcomes: outcomeCounts.every((count) => count > 0),
    globalLogMean: globalLogImprovement >= 0.05,
    globalBrierMean: globalBrierImprovement >= 0.05,
    globalLogLcb: globalLogLcb > 0,
    globalBrierLcb: globalBrierLcb > 0,
    stateLogMean: stateLogImprovement >= 0.02,
    stateBrierMean: stateBrierImprovement >= 0.02,
    stateLogLcb: stateLogLcb > 0,
    stateBrierLcb: stateBrierLcb > 0,
    intendedBrierLcb: classLcb[0] > 0,
    opponentBrierLcb: classLcb[2] > 0,
    teammateNonRegression: -classImprovement[1] <= 0.001,
    looseNonRegression: -classImprovement[3] <= 0.001,
    deadNonRegression: -classImprovement[4] <= 0.001,
    calibrationAbsolute: actionEce.macro <= 0.04,
    calibrationNonInferiority: calibration.bootstrap.upper95 <= 0.005,
    calibrationInTheLarge: calibration.action.classes.every((value, index) =>
      Math.abs(value.signedResidual) <= residualLimits[index]),
    specificityCoverage: actionSpecificity.differing / Math.max(actionSpecificity.decisions, 1) >= 0.95,
    specificityMagnitude: actionSpecificity.medianMaxL1 >= 0.10,
    stateMarginalConservation: calibration.decisionMassShift.meanL1 <= 1e-10,
  };
  const pass = Object.values(gates).every(Boolean);

  console.log(`\n${name}: clusters ${matches.size} · rows ${rows.length} · outcomes ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, outcomeCounts[index]])))}`);
  console.log(
    `log loss factor/state/global ${actionLog.toFixed(6)}/${stateLog.toFixed(6)}/${globalLog.toFixed(6)} · `
    + `improvement vs state/global ${(stateLogImprovement * 100).toFixed(2)}%/${(globalLogImprovement * 100).toFixed(2)}%`,
  );
  console.log(
    `Brier factor/state/global ${actionBrier.toFixed(6)}/${stateBrier.toFixed(6)}/${globalBrier.toFixed(6)} · `
    + `improvement vs state/global ${(stateBrierImprovement * 100).toFixed(2)}%/${(globalBrierImprovement * 100).toFixed(2)}%`,
  );
  console.log(
    `bootstrap LCB global log/Brier ${globalLogLcb.toFixed(6)}/${globalBrierLcb.toFixed(6)} · `
    + `state log/Brier ${stateLogLcb.toFixed(6)}/${stateBrierLcb.toFixed(6)}`,
  );
  console.log(
    `class Brier improvement ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, Number(classImprovement[index].toFixed(6))])))} · `
    + `LCB ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, Number(classLcb[index].toFixed(6))])))}`,
  );
  console.log(
    `macro ECE factor/state ${actionEce.macro.toFixed(6)}/${stateEce.macro.toFixed(6)} · `
    + `gap bootstrap 95% [${calibration.bootstrap.lower95.toFixed(6)}, ${calibration.bootstrap.upper95.toFixed(6)}] · `
    + `signed residual ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, Number(calibration.action.classes[index].signedResidual.toFixed(6))])))}`,
  );
  console.log(
    `specificity differing ${actionSpecificity.differing}/${actionSpecificity.decisions} · `
    + `median max-L1 ${actionSpecificity.medianMaxL1.toFixed(6)} · `
    + `state-marginal mean L1 ${calibration.decisionMassShift.meanL1.toExponential(3)}`,
  );
  console.log(
    `accuracy factor/state/global ${(accuracy.action * 100).toFixed(2)}%/`
    + `${(accuracy.state * 100).toFixed(2)}%/${(accuracy.global * 100).toFixed(2)}% · `
    + `balance/permutation/nonfinite failures ${balanceFailures}/${permutationFailures}/${modelNonFinite}`,
  );
  console.log(`gates ${Object.entries(gates).map(([gate, value]) => `${gate}=${value ? 'PASS' : 'FAIL'}`).join(' · ')}`);
  console.log(`${name} verdict: ${pass ? 'PASS' : 'FAIL — STOP'}`);
  return { pass };
};

console.log('T0b five-transition probability estimator');
console.log('generating frozen training/internal data...');
const training = generateDataset(TRAIN_START, TRAIN_MATCHES);
const fitRows = training.rows.filter((row) => (row.matchSeed - TRAIN_START) % 4 !== 3);
const internalRows = training.rows.filter((row) => (row.matchSeed - TRAIN_START) % 4 === 3);
const trainingValid = training.forceFailures === 0
  && training.invariantFailures === 0
  && training.duplicateIdentities === 0;
console.log(
  `training data clusters ${training.clusters} · decisions ${training.decisions} · actions ${training.actions} · `
  + `fit/internal ${fitRows.length}/${internalRows.length} · censors ${training.censors} · `
  + `force/invariant/duplicate ${training.forceFailures}/${training.invariantFailures}/${training.duplicateIdentities} · `
  + `hash ${training.digest}`,
);

if (process.argv.includes('--factorized')) {
  const EXPECTED_TRAINING_DIGEST = '17eebdd52a883daabddc7d7a69c1c7455e398cf5ba2dd91f687a2df4befc0427';
  const sourceAuthorityMatches = training.digest === EXPECTED_TRAINING_DIGEST
    && fitRows.length === 69922
    && internalRows.length === 22974;
  const factorizedModel = fitFactorizedTransitionModelV1(fitRows);
  const factorizedModelRepeat = fitFactorizedTransitionModelV1(fitRows);
  const deterministicFactorizedModel = JSON.stringify(factorizedModel)
    === JSON.stringify(factorizedModelRepeat);
  const factorizedClassCounts = Array(5).fill(0) as number[];
  for (const row of fitRows) factorizedClassCounts[row.label]++;
  const factorizedGlobalProbabilities = factorizedClassCounts.map((count) =>
    count / fitRows.length);
  const factorizedModelDigest = createHash('sha256')
    .update(JSON.stringify({ factorizedModel, globalProbabilities: factorizedGlobalProbabilities }))
    .digest('hex');
  console.log(
    `T0b-R source authority ${sourceAuthorityMatches ? 'MATCH' : 'MISMATCH'} · `
    + `model deterministic ${deterministicFactorizedModel ? 'yes' : 'NO'} · sha256 ${factorizedModelDigest}`,
  );
  const preflight = evaluateFactorized(
    'factorized development preflight',
    internalRows,
    factorizedModel,
    factorizedGlobalProbabilities,
    trainingValid && sourceAuthorityMatches,
    deterministicFactorizedModel,
    2000,
  );
  if (!preflight.pass) {
    console.log('\nT0b-R verdict: FAIL — ESTIMATOR LINE PARKED; EXTERNAL REMAINS SEALED');
    process.exitCode = 2;
  } else {
    console.log('\ndevelopment preflight passed; opening pre-registered external validation seeds...');
    const validation = generateDataset(VALIDATION_START, VALIDATION_MATCHES);
    const validationValid = validation.forceFailures === 0
      && validation.invariantFailures === 0
      && validation.duplicateIdentities === 0;
    console.log(
      `validation data clusters ${validation.clusters} · decisions ${validation.decisions} · actions ${validation.actions} · `
      + `rows ${validation.rows.length} · censors ${validation.censors} · unrepresented ${validation.unrepresented} · `
      + `force/invariant/duplicate ${validation.forceFailures}/${validation.invariantFailures}/${validation.duplicateIdentities} · `
      + `hash ${validation.digest}`,
    );
    const external = evaluateFactorized(
      'factorized external validation',
      validation.rows,
      factorizedModel,
      factorizedGlobalProbabilities,
      validationValid,
      deterministicFactorizedModel,
      3000,
    );
    console.log(`\nT0b-R verdict: ${external.pass ? 'PASS' : 'FAIL — ESTIMATOR LINE PARKED'}`);
    if (!external.pass) process.exitCode = 2;
  }
} else {
const actionInputs = fitRows.map((row) => row.actionFeatures);
const stateInputs = fitRows.map((row) => row.stateFeatures);
const fitLabels = fitRows.map((row) => row.label);
const actionModel = fitTransitionSoftmaxV1(actionInputs, fitLabels);
const actionModelRepeat = fitTransitionSoftmaxV1(actionInputs, fitLabels);
const stateModel = fitTransitionSoftmaxV1(stateInputs, fitLabels);
const deterministicModel = JSON.stringify(actionModel) === JSON.stringify(actionModelRepeat);
const classCounts = Array(5).fill(0) as number[];
for (const label of fitLabels) classCounts[label]++;
const globalProbabilities = classCounts.map((count) => count / fitLabels.length);
const modelDigest = createHash('sha256')
  .update(JSON.stringify({ actionModel, stateModel, globalProbabilities }))
  .digest('hex');
console.log(`model deterministic ${deterministicModel ? 'yes' : 'NO'} · sha256 ${modelDigest}`);

const internal = evaluate(
  'internal holdout',
  internalRows,
  actionModel,
  stateModel,
  globalProbabilities,
  trainingValid && deterministicModel,
  100,
);
if (!internal.pass) {
  if (process.argv.includes('--calibration-audit')) {
    const EXPECTED_TRAINING_DIGEST = '17eebdd52a883daabddc7d7a69c1c7455e398cf5ba2dd91f687a2df4befc0427';
    const EXPECTED_MODEL_DIGEST = '6e388d0a6263229a0dc6d8f74c96022c780168afb7e963f37e67bc6e25920865';
    const sourceAuthorityMatches = training.digest === EXPECTED_TRAINING_DIGEST
      && modelDigest === EXPECTED_MODEL_DIGEST
      && fitRows.length === 69922
      && internalRows.length === 22974;
    const audit = auditTransitionCalibrationV1(internal.scoredRows.map((row) => ({
      matchSeed: row.row.matchSeed,
      decisionId: row.row.decisionId,
      label: row.row.label,
      actionProbabilities: row.actionProbabilities,
      stateProbabilities: row.stateProbabilities,
    })));
    const eceParity = audit.action.macroEce === internal.actionEce.macro
      && audit.state.macroEce === internal.stateEce.macro
      && audit.action.classes.every((value, index) =>
        value.ece === internal.actionEce.classwise[index])
      && audit.state.classes.every((value, index) =>
        value.ece === internal.stateEce.classwise[index]);
    const invariantFailures = Object.values(audit.invariants)
      .reduce((sum, value) => sum + value, 0);
    console.log('\nT0b-F calibration failure audit');
    console.log(`source authority ${sourceAuthorityMatches ? 'MATCH' : 'MISMATCH'} · ECE parity ${eceParity ? 'MATCH' : 'MISMATCH'}`);
    for (let klass = 0; klass < OUTCOMES.length; klass++) {
      const action = audit.action.classes[klass];
      const state = audit.state.classes[klass];
      console.log(
        `${OUTCOMES[klass]} ECE action/state/gap ${action.ece.toFixed(6)}/${state.ece.toFixed(6)}/${audit.classEceGaps[klass].toFixed(6)} · `
        + `observed ${action.observedFrequency.toFixed(6)} · predicted action/state ${action.meanPredictedProbability.toFixed(6)}/${state.meanPredictedProbability.toFixed(6)} · `
        + `signed residual action/state ${action.signedResidual.toFixed(6)}/${state.signedResidual.toFixed(6)}`,
      );
    }
    console.log(
      `decision mass shift L1 mean/median/p90 ${audit.decisionMassShift.meanL1.toFixed(6)}/`
      + `${audit.decisionMassShift.medianL1.toFixed(6)}/${audit.decisionMassShift.p90L1.toFixed(6)} · `
      + `class shift ${JSON.stringify(Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, Number(audit.decisionMassShift.meanSignedClassShift[index].toFixed(6))])))}`,
    );
    console.log(
      `fixed-bin cluster bootstrap ECE gap 95% [${audit.bootstrap.lower95.toFixed(6)}, ${audit.bootstrap.upper95.toFixed(6)}] · `
      + `n=${audit.bootstrap.samples} · sha256 ${audit.bootstrap.digest}`,
    );
    console.log(`audit invariants ${JSON.stringify(audit.invariants)}`);
    const auditValid = sourceAuthorityMatches && eceParity && invariantFailures === 0;
    console.log(`T0b-F verdict: ${auditValid ? 'VALID ANATOMY — T0b REMAINS FAILED' : 'AUDIT INVALID — STOP'}`);
    process.exitCode = auditValid ? 0 : 2;
  } else {
    process.exitCode = 2;
  }
} else {
  console.log('\ninternal gates passed; opening pre-registered external validation seeds...');
  const validation = generateDataset(VALIDATION_START, VALIDATION_MATCHES);
  const validationValid = validation.forceFailures === 0
    && validation.invariantFailures === 0
    && validation.duplicateIdentities === 0;
  console.log(
    `validation data clusters ${validation.clusters} · decisions ${validation.decisions} · actions ${validation.actions} · `
    + `rows ${validation.rows.length} · censors ${validation.censors} · unrepresented ${validation.unrepresented} · `
    + `force/invariant/duplicate ${validation.forceFailures}/${validation.invariantFailures}/${validation.duplicateIdentities} · `
    + `hash ${validation.digest}`,
  );
  const external = evaluate(
    'external validation',
    validation.rows,
    actionModel,
    stateModel,
    globalProbabilities,
    validationValid,
    1000,
  );
  console.log(`\nT0b verdict: ${external.pass ? 'PASS' : 'FAIL — STOP'}`);
  if (!external.pass) process.exitCode = 2;
}
}
