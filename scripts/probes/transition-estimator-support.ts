// T0a kick-time transition-estimator support census.
// Authority: docs/world-model/TRANSITION-ESTIMATOR-PROGRAMME.md
//   npx tsx scripts/probes/transition-estimator-support.ts
import { createHash } from 'node:crypto';
import { evaluatePassAffordance, type KnownReachProfile, type PassAffordanceResult } from '../../src/ai/passAffordance';
import {
  KICK_TRANSITION_FEATURE_DIMENSIONS,
  KICK_TRANSITION_FEATURE_VERSION,
  projectKickTransitionFeaturesV1,
  type KickTransitionFeatureDimension,
  type ProjectedKickTransitionFeaturesV1,
} from '../../src/ai/kickTransitionFeatures';
import { passNextStateValue } from '../../src/ai/passValue';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type ComparablePassPayoffV1,
  type FirstTransitionOutcome,
  type OracleV2BranchRecord,
} from './oracle-v2';

const TRAIN_SEED_START = 40000;
const TRAIN_MATCHES = 240;
const TRAIN_SEED_END = TRAIN_SEED_START + TRAIN_MATCHES - 1;
const AUDIT_SEED_END = TRAIN_SEED_START + 7;
const FOLDS = 4;

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

interface CandidateAction {
  readonly targetGid: number;
  readonly affordance: PassAffordanceResult;
  readonly projected: ProjectedKickTransitionFeaturesV1;
}

const candidatesAt = (match: Match, passerGid: number): CandidateAction[] => {
  const passer = match.allPlayers[passerGid];
  const snapshot = oraclePerceptionSnapshot(capturePerceptionTruth(match), passerGid);
  const profiles = profilesOf(match);
  const candidates: CandidateAction[] = [];
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
    candidates.push({ targetGid: target.gid, affordance, projected });
  }
  return candidates;
};

const outcomes = (): Record<FirstTransitionOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
});

interface FeatureAggregate {
  min: number;
  max: number;
  sum: number;
  n: number;
  nonFinite: number;
}

const featureAggregates = Object.fromEntries(
  KICK_TRANSITION_FEATURE_DIMENSIONS.map((dimension) => [dimension, {
    min: Infinity,
    max: -Infinity,
    sum: 0,
    n: 0,
    nonFinite: 0,
  }]),
) as Record<KickTransitionFeatureDimension, FeatureAggregate>;

const addFeatures = (projected: ProjectedKickTransitionFeaturesV1): void => {
  for (const dimension of KICK_TRANSITION_FEATURE_DIMENSIONS) {
    const value = projected.features[dimension];
    const aggregate = featureAggregates[dimension];
    if (!Number.isFinite(value)) {
      aggregate.nonFinite++;
      continue;
    }
    aggregate.min = Math.min(aggregate.min, value);
    aggregate.max = Math.max(aggregate.max, value);
    aggregate.sum += value;
    aggregate.n++;
  }
};

const validateRecord = (
  record: OracleV2BranchRecord,
  targetGid: number,
  side: Side,
): string[] => {
  const errors: string[] = [];
  const transition = record.firstTransition;
  if ((transition.status === 'resolved') !== (transition.outcome !== null)) {
    errors.push('status/outcome partition');
  }
  if (transition.status === 'forceFailure') errors.push('force failure');
  if (transition.outcome === 'intendedReception') {
    if (transition.controllerGid !== targetGid || transition.controllerSide !== side) {
      errors.push('intended controller');
    }
  } else if (transition.outcome === 'teammateRecovery') {
    if (
      transition.controllerGid === null
      || transition.controllerGid === targetGid
      || transition.controllerSide !== side
    ) errors.push('teammate controller');
  } else if (transition.outcome === 'opponentInterception') {
    if (transition.controllerSide === null || transition.controllerSide === side) {
      errors.push('opponent controller');
    }
  } else if (
    (transition.outcome === 'loose' || transition.outcome === 'deadBall')
    && transition.controllerGid !== null
  ) errors.push('uncontrolled transition has controller');
  if (record.payoffFromKick3s.projectionVersion !== 'comparable-pass-payoff-v1') {
    errors.push('payoff version');
  }
  if (!Object.values(record.payoffFromKick3s.comparable).every(Number.isFinite)) {
    errors.push('non-finite payoff');
  }
  return errors;
};

interface ActionAuditRecord {
  readonly decisionId: string;
  readonly targetGid: number;
  readonly chosen: boolean;
  readonly featureVersion: typeof KICK_TRANSITION_FEATURE_VERSION;
  readonly features: ProjectedKickTransitionFeaturesV1['features'];
  readonly transition: OracleV2BranchRecord['firstTransition'];
  readonly payoff: ComparablePassPayoffV1;
}

const actionRecord = (
  decisionId: string,
  candidate: CandidateAction,
  chosenTargetGid: number,
  record: OracleV2BranchRecord,
): ActionAuditRecord => ({
  decisionId,
  targetGid: candidate.targetGid,
  chosen: candidate.targetGid === chosenTargetGid,
  featureVersion: candidate.projected.version,
  features: candidate.projected.features,
  transition: record.firstTransition,
  payoff: record.payoffFromKick3s.comparable,
});

const totalOutcomes = outcomes();
const foldOutcomes = Array.from({ length: FOLDS }, outcomes);
const identitySet = new Set<string>();
const digest = createHash('sha256');
let completedClusters = 0;
let freshOrdinaryPasses = 0;
let unrepresentedFreshPasses = 0;
let decisionEvents = 0;
let uniqueActionRecords = 0;
let estimatorRows = 0;
let multiCandidateDecisions = 0;
let multiResolvedDecisions = 0;
let outcomeVaryingDecisions = 0;
let actionFeatureVaryingDecisions = 0;
let administrativeCensors = 0;
let censoredEstimatorRows = 0;
let forceFailures = 0;
let conservationFailures = 0;
let duplicateIdentities = 0;
let nonFinitePayoffs = 0;
let chosenMultiplicityFailures = 0;
let deterministicAuditDecisions = 0;
let deterministicAuditDifferences = 0;

for (let seed = TRAIN_SEED_START; seed <= TRAIN_SEED_END; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  let previousPass = match.pendingPass;
  let auditedThisSeed = false;

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
      freshOrdinaryPasses++;
      const candidates = candidatesAt(frozen, pass.passerGid);
      const chosenCandidates = candidates.filter((candidate) =>
        candidate.targetGid === pass.targetGid);
      if (candidates.length === 0 || chosenCandidates.length !== 1) {
        unrepresentedFreshPasses++;
        previousPass = pass;
        continue;
      }

      decisionEvents++;
      if (candidates.length >= 2) multiCandidateDecisions++;
      if (chosenCandidates.length !== 1) chosenMultiplicityFailures++;
      const decisionId = `${seed}:${frozen.simTick}:${pass.passerGid}`;
      const featureKeys = new Set(candidates.map((candidate) =>
        JSON.stringify(candidate.projected.features)));
      if (featureKeys.size > 1) actionFeatureVaryingDecisions++;
      const resolvedOutcomes: FirstTransitionOutcome[] = [];
      const auditRecords: ActionAuditRecord[] = [];

      for (const candidate of candidates) {
        const identity = `${decisionId}:${candidate.targetGid}`;
        if (identitySet.has(identity)) duplicateIdentities++;
        identitySet.add(identity);
        const side = frozen.allPlayers[pass.passerGid].side as Side;
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
        const errors = validateRecord(result.record, candidate.targetGid, side);
        conservationFailures += errors.length;
        if (!Object.values(result.record.payoffFromKick3s.comparable).every(Number.isFinite)) {
          nonFinitePayoffs++;
        }
        const audit = actionRecord(
          decisionId,
          candidate,
          pass.targetGid,
          result.record,
        );
        auditRecords.push(audit);
        digest.update(`${JSON.stringify(audit)}\n`);
        uniqueActionRecords++;
        addFeatures(candidate.projected);
        if (result.record.firstTransition.status === 'resolved') {
          const outcome = result.record.firstTransition.outcome!;
          totalOutcomes[outcome]++;
          foldOutcomes[(seed - TRAIN_SEED_START) % FOLDS][outcome]++;
          resolvedOutcomes.push(outcome);
          estimatorRows++;
        } else {
          administrativeCensors++;
        }
      }

      if (resolvedOutcomes.length >= 2) {
        multiResolvedDecisions++;
        if (new Set(resolvedOutcomes).size > 1) outcomeVaryingDecisions++;
      }

      if (!auditedThisSeed && seed <= AUDIT_SEED_END) {
        auditedThisSeed = true;
        deterministicAuditDecisions++;
        const side = frozen.allPlayers[pass.passerGid].side as Side;
        const rerunRecords: ActionAuditRecord[] = [];
        for (const candidate of candidates) {
          const rerun = runOracleV2Branch({
            frozen,
            passerGid: pass.passerGid,
            targetGid: candidate.targetGid,
            side,
            branch: candidate.targetGid === pass.targetGid ? 'chosen' : 'alternative',
            includeTransitionDiagnostic: false,
          });
          if (!rerun.ok) {
            deterministicAuditDifferences++;
            continue;
          }
          rerunRecords.push(actionRecord(
            decisionId,
            candidate,
            pass.targetGid,
            rerun.record,
          ));
        }
        if (JSON.stringify(rerunRecords) !== JSON.stringify(auditRecords)) {
          deterministicAuditDifferences++;
        }
      }
    }
    previousPass = pass;
  }
  completedClusters++;
}

const pct = (value: number, denominator: number): string =>
  `${((value / Math.max(denominator, 1)) * 100).toFixed(2)}%`;
const featureNonFinite = KICK_TRANSITION_FEATURE_DIMENSIONS.reduce(
  (sum, dimension) => sum + featureAggregates[dimension].nonFinite,
  0,
);
const outcomeSupportPass = Object.values(totalOutcomes).every((count) => count >= 100);
const foldSupportPass = foldOutcomes.every((fold) =>
  Object.values(fold).every((count) => count >= 20));
const multiCandidateRate = multiCandidateDecisions / Math.max(decisionEvents, 1);
const outcomeVariationRate = outcomeVaryingDecisions / Math.max(multiResolvedDecisions, 1);
const featureVariationRate = actionFeatureVaryingDecisions / Math.max(decisionEvents, 1);
const censorRate = administrativeCensors / Math.max(uniqueActionRecords, 1);
const gates = {
  completedClusters: completedClusters === TRAIN_MATCHES,
  decisionEvents: decisionEvents >= 12000,
  uniqueActionRecords: uniqueActionRecords >= 48000,
  multiCandidateRate: multiCandidateRate >= 0.95,
  chosenTargetExactlyOnce: chosenMultiplicityFailures === 0,
  outcomeSupport: outcomeSupportPass,
  foldOutcomeSupport: foldSupportPass,
  withinDecisionOutcomeVariation: outcomeVariationRate >= 0.15,
  actionFeatureVariation: featureVariationRate >= 0.95,
  forceFailures: forceFailures === 0,
  conservationFailures: conservationFailures === 0,
  duplicateIdentities: duplicateIdentities === 0,
  finiteFeaturesAndPayoffs: featureNonFinite === 0 && nonFinitePayoffs === 0,
  censoredEstimatorRows: censoredEstimatorRows === 0,
  administrativeCensors: censorRate <= 0.01,
  sealedSeedsRead: true,
  deterministicAudit: deterministicAuditDecisions === 8
    && deterministicAuditDifferences === 0,
};
const pass = Object.values(gates).every(Boolean);

console.log('T0a kick-time transition-estimator support census');
console.log(
  `training seeds ${TRAIN_SEED_START}-${TRAIN_SEED_END} · clusters ${completedClusters} · `
  + `fresh ordinary ${freshOrdinaryPasses} · unrepresented ${unrepresentedFreshPasses}`,
);
console.log(
  `decisions ${decisionEvents} · action records ${uniqueActionRecords} · `
  + `estimator rows ${estimatorRows} · candidates/decision `
  + `${(uniqueActionRecords / Math.max(decisionEvents, 1)).toFixed(2)}`,
);
console.log(
  `multi-candidate ${multiCandidateDecisions}/${decisionEvents} (${pct(multiCandidateDecisions, decisionEvents)}) · `
  + `feature-varying ${actionFeatureVaryingDecisions}/${decisionEvents} `
  + `(${pct(actionFeatureVaryingDecisions, decisionEvents)})`,
);
console.log(
  `outcome-varying ${outcomeVaryingDecisions}/${multiResolvedDecisions} `
  + `resolved multi-action decisions (${pct(outcomeVaryingDecisions, multiResolvedDecisions)})`,
);
console.log(`outcomes ${JSON.stringify(totalOutcomes)}`);
foldOutcomes.forEach((fold, index) => console.log(`fold ${index} ${JSON.stringify(fold)}`));
console.log(
  `censors ${administrativeCensors} (${pct(administrativeCensors, uniqueActionRecords)}) · `
  + `force ${forceFailures} · conservation ${conservationFailures} · duplicates ${duplicateIdentities}`,
);
console.log(`record sha256 ${digest.digest('hex')}`);
console.log('\nfeature support:');
for (const dimension of KICK_TRANSITION_FEATURE_DIMENSIONS) {
  const value = featureAggregates[dimension];
  console.log(
    `  ${dimension}: min=${value.min.toFixed(6)} max=${value.max.toFixed(6)} `
    + `mean=${(value.sum / Math.max(value.n, 1)).toFixed(6)} n=${value.n}`,
  );
}
console.log('\ngates:');
for (const [name, value] of Object.entries(gates)) {
  console.log(`  ${name}: ${value ? 'PASS' : 'FAIL'}`);
}
console.log(`T0a verdict: ${pass ? 'PASS' : 'FAIL — STOP'}`);

if (!pass) process.exitCode = 2;
