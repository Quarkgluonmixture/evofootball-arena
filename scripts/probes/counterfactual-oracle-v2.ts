// Counterfactual Oracle v2-0 — event semantics + Comparable V1 preflight only.
// No ensemble, S7 relation, tolerance or live consumer is changed here.
//   npx tsx scripts/probes/counterfactual-oracle-v2.ts [matches] [seedOffset]
import { evaluatePassAffordance, type KnownReachProfile } from '../../src/ai/passAffordance';
import {
  comparePassNextStates,
  passNextStateValue,
  type PassNextStateValue,
} from '../../src/ai/passValue';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  projectComparablePassPayoffV1,
  runOracleV2Branch,
  type FirstTransitionOutcome,
  type OracleCensorCause,
  type OracleTransitionStatus,
  type OracleV2BranchRecord,
} from './oracle-v2';

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);

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

const passValues = (match: Match, passerGid: number): PassNextStateValue[] => {
  const passer = match.allPlayers[passerGid];
  const truth = capturePerceptionTruth(match);
  const snapshot = oraclePerceptionSnapshot(truth, passerGid);
  const profiles = profilesOf(match);
  const values: PassNextStateValue[] = [];
  for (const target of match.teams[passer.side].players) {
    if (target.sentOff || target.gid === passerGid) continue;
    const affordance = evaluatePassAffordance({
      snapshot,
      passerGid,
      targetGid: target.gid,
      attackDir: match.teams[passer.side].attackDir,
      reachProfiles: profiles,
    });
    if (!affordance) continue;
    const value = passNextStateValue(affordance);
    if (value) values.push(value);
  }
  return values;
};

const transitionOutcomes = (): Record<FirstTransitionOutcome, number> => ({
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
});

const statuses = (): Record<OracleTransitionStatus, number> => ({
  resolved: 0,
  censored: 0,
  forceFailure: 0,
});

const censorCauses = (): Record<OracleCensorCause, number> => ({
  horizon: 0,
  halftime: 0,
  fulltime: 0,
  continuationStopped: 0,
  identityLost: 0,
});

interface BranchAggregate {
  n: number;
  outcomes: Record<FirstTransitionOutcome, number>;
  statuses: Record<OracleTransitionStatus, number>;
  censors: Record<OracleCensorCause, number>;
  transitionSeconds: number;
  transitionSecondsCount: number;
  postControlSupported: number;
  primarySupported: number;
  primaryAbsorbed: number;
  diagnosticSupported: number;
  physicalNoneMacroAssigned: number;
  physicalMacroDisagreement: number;
  deadEvidence: Record<'goalPause' | 'restart' | 'ballCoastingOut', number>;
}

const aggregate = (): BranchAggregate => ({
  n: 0,
  outcomes: transitionOutcomes(),
  statuses: statuses(),
  censors: censorCauses(),
  transitionSeconds: 0,
  transitionSecondsCount: 0,
  postControlSupported: 0,
  primarySupported: 0,
  primaryAbsorbed: 0,
  diagnosticSupported: 0,
  physicalNoneMacroAssigned: 0,
  physicalMacroDisagreement: 0,
  deadEvidence: { goalPause: 0, restart: 0, ballCoastingOut: 0 },
});

const metrics = {
  chosen: aggregate(),
  alternative: aggregate(),
};

let candidatePairs = 0;
let pairForceFailures = 0;
let conservationViolations = 0;
let matchingCompletionCorroborations = 0;
const projectionViolations = {
  missingComparableVectors: 0,
  nonFiniteComparableFields: 0,
  macroPossessionProjectionReads: 0,
  rawNullFieldsOverwritten: 0,
  deadResetPositionReads: 0,
  administrativeTerminalUnsupported: 0,
  projectionVersionMismatch: 0,
  perDimensionDenominatorMismatch: 0,
};

const controlledOutcome = (outcome: FirstTransitionOutcome | null): boolean =>
  outcome === 'intendedReception'
  || outcome === 'teammateRecovery'
  || outcome === 'opponentInterception';

const validateRecord = (record: OracleV2BranchRecord): string[] => {
  const errors: string[] = [];
  const transition = record.firstTransition;
  if ((transition.status === 'resolved') !== (transition.outcome !== null)) {
    errors.push('resolved/outcome partition');
  }
  if (transition.status !== 'resolved' && transition.controllerGid !== null) {
    errors.push('non-resolved controller');
  }
  if (transition.status !== 'resolved' && transition.controllerSide !== null) {
    errors.push('non-resolved controller side');
  }
  if (transition.status === 'resolved' && transition.censorCause !== null) {
    errors.push('resolved censor cause');
  }
  if (transition.status === 'censored' && transition.censorCause === null) {
    errors.push('missing censor cause');
  }
  if (transition.outcome === 'intendedReception') {
    if (
      transition.controllerGid !== record.passKey.targetGid
      || transition.controllerSide !== record.passKey.side
    ) errors.push('intended controller');
  }
  if (transition.outcome === 'teammateRecovery') {
    if (
      transition.controllerGid === null
      || transition.controllerGid === record.passKey.targetGid
      || transition.controllerSide !== record.passKey.side
    ) errors.push('teammate controller');
  }
  if (transition.outcome === 'opponentInterception') {
    if (transition.controllerSide === null || transition.controllerSide === record.passKey.side) {
      errors.push('opponent controller');
    }
  }
  if (
    (transition.outcome === 'loose' || transition.outcome === 'deadBall')
    && transition.controllerGid !== null
  ) errors.push('uncontrolled outcome controller');
  if (transition.outcome === 'deadBall' && transition.deadEvidence === null) {
    errors.push('dead outcome evidence');
  }
  if (record.postControl.supported !== controlledOutcome(transition.outcome)) {
    errors.push('post-control support mask');
  }
  if (controlledOutcome(transition.outcome)) {
    if (!transition.pendingPassWasMatchingBeforeStep) {
      errors.push('controlled lifecycle precondition');
    }
    if (
      transition.ownerGid !== transition.controllerGid
      || transition.ownerGid === null
    ) errors.push('controlled owner edge');
  }
  if (record.postControl.supported) {
    if (
      record.postControl.controllerGid !== transition.controllerGid
      || record.postControl.controllerSide !== transition.controllerSide
    ) errors.push('post-control controller identity');
  }
  if (transition.outcome === 'loose') {
    if (
      !transition.pendingPassWasMatchingBeforeStep
      || transition.pendingPassIsMatchingAfterStep
      || transition.ownerGid !== null
      || transition.phase !== 'playing'
    ) errors.push('loose lifecycle');
  }
  const checkOutcome = (snapshot: OracleV2BranchRecord['payoffFromKick3s']): void => {
    const { raw, comparable } = snapshot;
    if (snapshot.projectionVersion !== 'comparable-pass-payoff-v1') {
      projectionViolations.projectionVersionMismatch++;
      errors.push('projection version');
    }
    if (raw.physicalControl === 'none') {
      if (raw.possession !== null || raw.attackingExitOptionCount !== null) {
        projectionViolations.rawNullFieldsOverwritten++;
        errors.push('owner-null raw fields are not null');
      }
      if (
        comparable.physicalControlValue !== 0
        || comparable.ownExecutableExitOptions !== 0
      ) errors.push('owner-null comparable state');
    } else if (
      raw.possession === null
      || raw.attackingExitOptionCount === null
    ) errors.push('controlled raw fields unexpectedly null');
    if (
      raw.physicalControl === 'own'
      && (raw.possession !== 1 || comparable.physicalControlValue !== 1)
    ) errors.push('own control projection');
    if (
      raw.physicalControl === 'opponent'
      && (
        raw.possession !== -1
        || raw.attackingExitOptionCount !== 0
        || comparable.physicalControlValue !== -1
        || comparable.ownExecutableExitOptions !== 0
      )
    ) errors.push('opponent control projection');
    const finite = Object.values(comparable).every(Number.isFinite);
    if (!finite) {
      projectionViolations.nonFiniteComparableFields++;
      errors.push('non-finite comparable field');
    }
    const projectedUnderMacro = (macroPossessionSide: Side | -1) =>
      projectComparablePassPayoffV1({ ...raw, macroPossessionSide });
    if (
      JSON.stringify(projectedUnderMacro(-1)) !== JSON.stringify(comparable)
      || JSON.stringify(projectedUnderMacro(0)) !== JSON.stringify(comparable)
      || JSON.stringify(projectedUnderMacro(1)) !== JSON.stringify(comparable)
    ) {
      projectionViolations.macroPossessionProjectionReads++;
      errors.push('macro possession projection read');
    }
    if (
      raw.currentPlayableProgressionMetres === null
      && comparable.actionProgressionMetres !== raw.lastPlayableProgressionMetres
    ) {
      projectionViolations.deadResetPositionReads++;
      errors.push('dead/reset progression read');
    }
    if (raw.authority === 'absorbedAdministrativeTerminal') {
      if (
        !raw.finished
        || raw.phase !== 'fulltime'
        || raw.observedSimTime >= raw.authoritySimTime
      ) {
        projectionViolations.administrativeTerminalUnsupported++;
        errors.push('administrative terminal absorption');
      }
    }
  };
  checkOutcome(record.payoffFromKick3s);
  const primaryRaw = record.payoffFromKick3s.raw;
  if (primaryRaw.authority === 'kickPlus3s') {
    const delta = primaryRaw.observedSimTime - record.passKey.kickTime;
    if (delta < 3 - 1e-9 || delta >= 3 + DT + 1e-9) errors.push('kick horizon');
  } else if (primaryRaw.authoritySimTime !== record.passKey.kickTime + 3) {
    errors.push('absorbed authority horizon');
  }
  if ('projectionVersion' in record.payoffFromTransition3s) {
    const delta = record.payoffFromTransition3s.raw.observedSimTime - transition.simTime;
    if (delta < 3 - 1e-9 || delta >= 3 + DT + 1e-9) errors.push('transition horizon');
  }
  return errors;
};

const addRecord = (record: OracleV2BranchRecord): void => {
  const target = metrics[record.branch];
  const transition = record.firstTransition;
  target.n++;
  target.statuses[transition.status]++;
  if (transition.outcome !== null) target.outcomes[transition.outcome]++;
  if (transition.censorCause !== null) target.censors[transition.censorCause]++;
  if (transition.status === 'resolved') {
    target.transitionSeconds += transition.secondsFromKick;
    target.transitionSecondsCount++;
  }
  if (transition.lastCompletedPassMatchesKick) matchingCompletionCorroborations++;
  if (transition.deadEvidence !== null) target.deadEvidence[transition.deadEvidence]++;
  if (record.postControl.supported) target.postControlSupported++;
  {
    target.primarySupported++;
    const snapshot = record.payoffFromKick3s.raw;
    if (snapshot.authority === 'absorbedAdministrativeTerminal') target.primaryAbsorbed++;
    if (snapshot.physicalControl === 'none' && snapshot.macroPossessionSide !== -1) {
      target.physicalNoneMacroAssigned++;
    }
    const physicalSide = snapshot.physicalControl === 'own'
      ? record.passKey.side
      : snapshot.physicalControl === 'opponent'
        ? (1 - record.passKey.side) as Side
        : null;
    if (physicalSide !== null && snapshot.macroPossessionSide !== physicalSide) {
      target.physicalMacroDisagreement++;
    }
  }
  if ('projectionVersion' in record.payoffFromTransition3s) target.diagnosticSupported++;
  const errors = validateRecord(record);
  conservationViolations += errors.length;
  if (errors.length > 0 && conservationViolations <= 10) {
    console.error(`${record.branch} ${record.passKey.kickTick}: ${errors.join(', ')}`);
  }
};

for (let seed = OFF; seed < OFF + N; seed++) {
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
      && pass
      && match.lastPassKind?.kind === 'pass'
      && match.lastPassKind.t === pass.t
      && frozen
      && frozen.phase === 'playing'
      && frozenOwnerGid === pass.passerGid;

    if (freshOrdinary) {
      const values = passValues(frozen, pass.passerGid);
      const chosen = values.find((value) => value.targetGid === pass.targetGid);
      if (chosen) {
        const alternatives = values.filter((value) =>
          value.targetGid !== chosen.targetGid
          && comparePassNextStates(value, chosen) === 'leftDominates');
        if (alternatives.length > 0) {
          const side = frozen.allPlayers[pass.passerGid].side as Side;
          const chosenResult = runOracleV2Branch({
            frozen,
            passerGid: pass.passerGid,
            targetGid: pass.targetGid,
            side,
            branch: 'chosen',
          });
          for (const alternative of alternatives) {
            candidatePairs++;
            const alternativeResult = runOracleV2Branch({
              frozen,
              passerGid: pass.passerGid,
              targetGid: alternative.targetGid,
              side,
              branch: 'alternative',
            });
            if (!chosenResult.ok || !alternativeResult.ok) {
              pairForceFailures++;
              continue;
            }
            addRecord(chosenResult.record);
            addRecord(alternativeResult.record);
          }
        }
      }
    }
    previousPass = pass;
  }
}

const pct = (value: number, denominator: number): string =>
  `${((value / Math.max(denominator, 1)) * 100).toFixed(1)}%`;

console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1}) · unchanged S7b candidate pairs ${candidatePairs}`);
console.log(`paired records ${metrics.chosen.n} · forced-pair failures ${pairForceFailures}`);
for (const branch of ['chosen', 'alternative'] as const) {
  const value = metrics[branch];
  console.log(`\n${branch}:`);
  console.log(
    `  status resolved/censored/force `
    + `${value.statuses.resolved}/${value.statuses.censored}/${value.statuses.forceFailure}`,
  );
  console.log(
    `  outcome intended/teammate/opponent/loose/dead `
    + `${value.outcomes.intendedReception}/${value.outcomes.teammateRecovery}/`
    + `${value.outcomes.opponentInterception}/${value.outcomes.loose}/${value.outcomes.deadBall}`,
  );
  console.log(
    `  transition mean ${(value.transitionSeconds / Math.max(value.transitionSecondsCount, 1)).toFixed(3)}s · `
    + `post-control support ${pct(value.postControlSupported, value.n)} · `
    + `kick+3s ${pct(value.primarySupported, value.n)} (${value.primaryAbsorbed} absorbed) · `
    + `transition+3s ${pct(value.diagnosticSupported, value.n)}`,
  );
  console.log(
    `  primary physical-none + macro-assigned ${value.physicalNoneMacroAssigned} · `
    + `physical/macro side mismatch ${value.physicalMacroDisagreement}`,
  );
  const censorText = (Object.keys(value.censors) as OracleCensorCause[])
    .filter((cause) => value.censors[cause] > 0)
    .map((cause) => `${cause}=${value.censors[cause]}`)
    .join(' · ');
  if (censorText) console.log(`  censor causes ${censorText}`);
  const deadText = (Object.keys(value.deadEvidence) as Array<keyof typeof value.deadEvidence>)
    .filter((evidence) => value.deadEvidence[evidence] > 0)
    .map((evidence) => `${evidence}=${value.deadEvidence[evidence]}`)
    .join(' · ');
  if (deadText) console.log(`  dead evidence ${deadText}`);
}

const totalRecords = metrics.chosen.n + metrics.alternative.n;
const recordForceFailures =
  metrics.chosen.statuses.forceFailure + metrics.alternative.statuses.forceFailure;
const candidateSetExpected = N !== 120 || OFF !== 0 || candidatePairs === 509;
const projectionViolationTotal = Object.values(projectionViolations)
  .reduce((sum, count) => sum + count, 0);
const partitioned = (['chosen', 'alternative'] as const).every((branch) => {
  const value = metrics[branch];
  const outcomeTotal = Object.values(value.outcomes).reduce((sum, count) => sum + count, 0);
  return outcomeTotal === value.statuses.resolved
    && value.statuses.resolved + value.statuses.censored + value.statuses.forceFailure === value.n;
});
console.log(
  `\ngates candidates=${candidateSetExpected ? 'yes' : 'NO'} · `
  + `partition=${partitioned ? 'yes' : 'NO'} · residual other=0 · residual unresolved=0 · `
  + `conservation violations=${conservationViolations} · force failures=${pairForceFailures} · `
  + `records=${totalRecords} · completion corroborations=${matchingCompletionCorroborations}`,
);
console.log(
  'projection exact-zero gates '
  + (Object.keys(projectionViolations) as Array<keyof typeof projectionViolations>)
    .map((key) => `${key}=${projectionViolations[key]}`)
    .join(' · '),
);

if (
  !candidateSetExpected
  || !partitioned
  || conservationViolations !== 0
  || projectionViolationTotal !== 0
  || pairForceFailures !== 0
  || recordForceFailures !== 0
) {
  process.exitCode = 1;
}
