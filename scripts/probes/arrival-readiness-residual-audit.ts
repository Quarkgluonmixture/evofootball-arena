// A0 ARRIVAL-READINESS RESIDUAL AUDIT (read-only).
// Authority: docs/world-model/ARRIVAL-READINESS-RESIDUAL-AUDIT.md
import { createHash } from 'node:crypto';
import { evaluatePassAffordance, type KnownReachProfile } from '../../src/ai/passAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { BALL_FRICTION_K, CONTROL_RADIUS, DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch,
  type FirstTransitionOutcome,
  type OracleV2BranchRecord,
} from './oracle-v2';

const MATCHES = Number(process.argv[2] ?? 120);
const SEED_START = Number(process.argv[3] ?? 45000);
const MATCH_DURATION = 240;
const ADMIN_BOUNDARY_GUARD_SECONDS = 5;

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

const rngState = (match: Match): number =>
  (match.rng as unknown as { s: number }).s;

const minimalFrozenState = (match: Match): string => JSON.stringify({
  simTick: match.simTick,
  simTime: match.simTime,
  phase: match.phase,
  half: match.half,
  finished: match.finished,
  score: match.score,
  possessionSide: match.possessionSide,
  rng: rngState(match),
  ball: {
    pos: match.ball.pos,
    vel: match.ball.vel,
    z: match.ball.z,
    vz: match.ball.vz,
    ownerGid: match.ball.owner?.gid ?? null,
  },
  pendingPass: match.pendingPass,
  players: match.allPlayers.map((player) => ({
    gid: player.gid,
    pos: player.pos,
    vel: player.vel,
    heading: player.heading,
    stamina: player.stamina,
    decisionTimer: player.decisionTimer,
    kickCooldown: player.kickCooldown,
  })),
});

const beforeAdministrativeBoundary = (match: Match): boolean => {
  const secondHalfStart = (match as unknown as { secondHalfStart: number }).secondHalfStart;
  const boundary = match.half === 1
    ? match.duration / 2
    : secondHalfStart + match.duration / 2;
  return boundary - match.simTime >= ADMIN_BOUNDARY_GUARD_SECONDS;
};

const validateTransition = (
  record: OracleV2BranchRecord,
  targetGid: number,
  side: Side,
): string[] => {
  const errors: string[] = [];
  const transition = record.firstTransition;
  if (transition.status !== 'resolved' || transition.outcome === null) {
    errors.push('unresolved transition');
    return errors;
  }
  if (transition.outcome === 'intendedReception') {
    if (transition.controllerGid !== targetGid || transition.controllerSide !== side) {
      errors.push('intended controller mismatch');
    }
  } else if (transition.outcome === 'teammateRecovery') {
    if (
      transition.controllerGid === null
      || transition.controllerGid === targetGid
      || transition.controllerSide !== side
    ) errors.push('teammate controller mismatch');
  } else if (transition.outcome === 'opponentInterception') {
    if (transition.controllerSide === null || transition.controllerSide === side) {
      errors.push('opponent controller mismatch');
    }
  } else if (transition.controllerGid !== null) {
    errors.push('uncontrolled outcome has controller');
  }
  return errors;
};

interface ArrivalRecord {
  readonly identity: string;
  readonly seed: number;
  readonly kickTick: number;
  readonly passerGid: number;
  readonly targetGid: number;
  readonly outcome: FirstTransitionOutcome;
  readonly arrivalMargin: number;
  readonly bodyReadiness: number;
  readonly ballArrival: number;
  readonly receivePressure: number;
  readonly relativeArrivalSpeedProxy: number;
  readonly targetSpeed: number;
  readonly targetTowardSpeed: number;
  readonly targetLateralSpeed: number;
  readonly predictedEndpointBallSpeed: number;
  readonly stoppingDistance: number;
  readonly stoppingSlack: number;
}

const records: ArrivalRecord[] = [];
const identities = new Set<string>();
const representedMatches = new Set<number>();
let freshOrdinaryPasses = 0;
let boundaryExcluded = 0;
let goalkeeperExcluded = 0;
let unsupportedAffordance = 0;
let nonFiniteFlightExcluded = 0;
let offsideBufferExcluded = 0;
let duplicateIdentities = 0;
let nonFiniteFacts = 0;
let oracleForceFailures = 0;
let transitionConservationFailures = 0;
let administrativeCensors = 0;
let frozenMutations = 0;
let factRngDraws = 0;

for (let matchIndex = 0; matchIndex < MATCHES; matchIndex++) {
  const seed = SEED_START + matchIndex;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
  });
  let previousPass = match.pendingPass;

  while (!match.finished) {
    const owner = match.phase === 'playing' ? match.ball.owner : null;
    const frozen = owner !== null && owner.decisionTimer <= 0 && owner.kickCooldown <= 0
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
      if (!beforeAdministrativeBoundary(frozen)) {
        boundaryExcluded++;
        previousPass = pass;
        continue;
      }
      const passer = frozen.allPlayers[pass.passerGid];
      const target = frozen.allPlayers[pass.targetGid];
      if (target === undefined || target.role === 'GK') {
        goalkeeperExcluded++;
        previousPass = pass;
        continue;
      }

      const frozenBefore = minimalFrozenState(frozen);
      const rngBefore = rngState(frozen);
      const affordance = evaluatePassAffordance({
        snapshot: oraclePerceptionSnapshot(capturePerceptionTruth(frozen), passer.gid),
        passerGid: passer.gid,
        targetGid: target.gid,
        attackDir: frozen.teams[passer.side].attackDir,
        reachProfiles: profilesOf(frozen),
      });
      const rngAfterFacts = rngState(frozen);
      if (rngBefore !== rngAfterFacts) factRngDraws++;
      if (affordance === null) {
        unsupportedAffordance++;
        previousPass = pass;
        continue;
      }
      if (!affordance.flight.reachable || !Number.isFinite(affordance.flight.arrivalTime)) {
        nonFiniteFlightExcluded++;
        previousPass = pass;
        continue;
      }
      if (affordance.affordance.offsideMargin > -0.2) {
        offsideBufferExcluded++;
        previousPass = pass;
        continue;
      }

      const dx = affordance.flight.targetPoint.x - passer.pos.x;
      const dy = affordance.flight.targetPoint.y - passer.pos.y;
      const distance = Math.hypot(dx, dy);
      const ux = distance > 1e-9 ? dx / distance : passer.bodyDir.x;
      const uy = distance > 1e-9 ? dy / distance : passer.bodyDir.y;
      const flightTicks = Math.max(0, Math.round(affordance.flight.arrivalTime / DT));
      const decay = Math.exp(-BALL_FRICTION_K * DT) ** flightTicks;
      const predictedEndpointBallSpeed = affordance.flight.launchSpeed * decay;
      const predictedBallVelocityX = ux * predictedEndpointBallSpeed;
      const predictedBallVelocityY = uy * predictedEndpointBallSpeed;
      const relativeArrivalSpeedProxy = Math.hypot(
        predictedBallVelocityX - target.vel.x,
        predictedBallVelocityY - target.vel.y,
      );

      const targetDx = affordance.flight.targetPoint.x - target.pos.x;
      const targetDy = affordance.flight.targetPoint.y - target.pos.y;
      const targetDistance = Math.hypot(targetDx, targetDy);
      const targetUx = targetDistance > 1e-9 ? targetDx / targetDistance : ux;
      const targetUy = targetDistance > 1e-9 ? targetDy / targetDistance : uy;
      const targetTowardSpeed = target.vel.x * targetUx + target.vel.y * targetUy;
      const targetLateralSpeed = Math.abs(target.vel.x * -targetUy + target.vel.y * targetUx);
      const targetSpeed = Math.hypot(target.vel.x, target.vel.y);
      const stoppingDistance = targetSpeed * targetSpeed / (2 * Math.max(target.accel, 0.1));
      const stoppingSlack = Math.max(0, targetDistance - CONTROL_RADIUS) - stoppingDistance;
      const numericFacts = [
        affordance.affordance.arrivalMargin,
        affordance.affordance.bodyReadiness,
        affordance.affordance.ballArrival,
        affordance.affordance.receivePressure,
        relativeArrivalSpeedProxy,
        targetSpeed,
        targetTowardSpeed,
        targetLateralSpeed,
        predictedEndpointBallSpeed,
        stoppingDistance,
        stoppingSlack,
      ];
      if (numericFacts.some((value) => !Number.isFinite(value))) {
        nonFiniteFacts++;
        previousPass = pass;
        continue;
      }

      const result = runOracleV2Branch({
        frozen,
        passerGid: passer.gid,
        targetGid: target.gid,
        side: passer.side,
        branch: 'chosen',
        includeTransitionDiagnostic: false,
      });
      if (!result.ok) {
        oracleForceFailures++;
        previousPass = pass;
        continue;
      }
      if (result.record.firstTransition.status !== 'resolved') {
        administrativeCensors++;
        previousPass = pass;
        continue;
      }
      const errors = validateTransition(result.record, target.gid, passer.side);
      transitionConservationFailures += errors.length;
      if (minimalFrozenState(frozen) !== frozenBefore) frozenMutations++;

      const identity = `${seed}:${frozen.simTick}:${passer.gid}:${target.gid}`;
      if (identities.has(identity)) duplicateIdentities++;
      identities.add(identity);
      representedMatches.add(seed);
      records.push({
        identity,
        seed,
        kickTick: frozen.simTick,
        passerGid: passer.gid,
        targetGid: target.gid,
        outcome: result.record.firstTransition.outcome!,
        arrivalMargin: affordance.affordance.arrivalMargin,
        bodyReadiness: affordance.affordance.bodyReadiness,
        ballArrival: affordance.affordance.ballArrival,
        receivePressure: affordance.affordance.receivePressure,
        relativeArrivalSpeedProxy,
        targetSpeed,
        targetTowardSpeed,
        targetLateralSpeed,
        predictedEndpointBallSpeed,
        stoppingDistance,
        stoppingSlack,
      });
    }
    previousPass = pass;
  }
}

const arrivalMarginBin = (value: number): number =>
  value < -0.5 ? 0 : value < -0.2 ? 1 : value < 0 ? 2 : value < 0.2 ? 3 : value < 0.5 ? 4 : 5;
const bodyReadinessBin = (value: number): number =>
  Math.max(0, Math.min(3, Math.floor(value * 4)));
const ballArrivalBin = (value: number): number =>
  value < 0.5 ? 0 : value < 1 ? 1 : value < 1.5 ? 2 : 3;
const cellKey = (record: ArrivalRecord): string => [
  arrivalMarginBin(record.arrivalMargin),
  bodyReadinessBin(record.bodyReadiness),
  ballArrivalBin(record.ballArrival),
].join(':');

const cells = new Map<string, ArrivalRecord[]>();
for (const record of records) {
  const key = cellKey(record);
  const cell = cells.get(key) ?? [];
  cell.push(record);
  cells.set(key, cell);
}

interface CellSummary {
  readonly key: string;
  readonly n: number;
  readonly quarterN: number;
  readonly meanRelativeGap: number;
  readonly lowIntendedRate: number;
  readonly highIntendedRate: number;
  readonly intendedEdge: number;
  readonly lowOpponentRate: number;
  readonly highOpponentRate: number;
  readonly informative: boolean;
}

const rate = (group: readonly ArrivalRecord[], outcome: FirstTransitionOutcome): number =>
  group.filter((record) => record.outcome === outcome).length / Math.max(1, group.length);
const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

const cellSummaries: CellSummary[] = [];
let supportedCells = 0;
let informativeCells = 0;
let positiveCells = 0;
let extremeRecords = 0;
let lowIntended = 0;
let highIntended = 0;
let lowOpponent = 0;
let highOpponent = 0;
let groupDenominator = 0;

for (const [key, cell] of [...cells.entries()].sort(([left], [right]) => left.localeCompare(right))) {
  if (cell.length < 40) continue;
  supportedCells++;
  const sorted = [...cell].sort((left, right) =>
    left.relativeArrivalSpeedProxy - right.relativeArrivalSpeedProxy
    || left.identity.localeCompare(right.identity));
  const quarterN = Math.floor(sorted.length / 4);
  const low = sorted.slice(0, quarterN);
  const high = sorted.slice(sorted.length - quarterN);
  const meanRelativeGap = mean(high.map((record) => record.relativeArrivalSpeedProxy))
    - mean(low.map((record) => record.relativeArrivalSpeedProxy));
  const lowIntendedRate = rate(low, 'intendedReception');
  const highIntendedRate = rate(high, 'intendedReception');
  const lowOpponentRate = rate(low, 'opponentInterception');
  const highOpponentRate = rate(high, 'opponentInterception');
  const informative = meanRelativeGap >= 1;
  cellSummaries.push({
    key,
    n: cell.length,
    quarterN,
    meanRelativeGap,
    lowIntendedRate,
    highIntendedRate,
    intendedEdge: lowIntendedRate - highIntendedRate,
    lowOpponentRate,
    highOpponentRate,
    informative,
  });
  if (!informative) continue;
  informativeCells++;
  if (lowIntendedRate > highIntendedRate) positiveCells++;
  extremeRecords += low.length + high.length;
  lowIntended += low.filter((record) => record.outcome === 'intendedReception').length;
  highIntended += high.filter((record) => record.outcome === 'intendedReception').length;
  lowOpponent += low.filter((record) => record.outcome === 'opponentInterception').length;
  highOpponent += high.filter((record) => record.outcome === 'opponentInterception').length;
  groupDenominator += quarterN;
}

const outcomeCounts: Record<FirstTransitionOutcome, number> = {
  intendedReception: 0,
  teammateRecovery: 0,
  opponentInterception: 0,
  loose: 0,
  deadBall: 0,
};
for (const record of records) outcomeCounts[record.outcome]++;

const lowIntendedRate = lowIntended / Math.max(1, groupDenominator);
const highIntendedRate = highIntended / Math.max(1, groupDenominator);
const intendedEdge = lowIntendedRate - highIntendedRate;
const lowOpponentRate = lowOpponent / Math.max(1, groupDenominator);
const highOpponentRate = highOpponent / Math.max(1, groupDenominator);
const opponentEdge = lowOpponentRate - highOpponentRate;
const positiveCellShare = positiveCells / Math.max(1, informativeCells);

const gates = {
  matchesRepresented: representedMatches.size === MATCHES,
  eligibleRecords: records.length >= 3000,
  duplicateRecordIdentities: duplicateIdentities === 0,
  finitePretreatmentFacts: nonFiniteFacts === 0,
  oracleForceFailures: oracleForceFailures === 0,
  transitionConservation: transitionConservationFailures === 0,
  administrativeCensors: administrativeCensors === 0,
  frozenStateMutation: frozenMutations === 0,
  factRngDraws: factRngDraws === 0,
  informativeCellSupport: informativeCells >= 12,
  extremeRecordSupport: extremeRecords >= 800,
  primaryIntendedReceptionEdge: intendedEdge >= 0.1,
  positiveCellShare: positiveCellShare >= 0.6,
  opponentNonRegression: opponentEdge <= 0.05,
};
const pass = Object.values(gates).every(Boolean);

const report = {
  authority: 'A0 arrival-readiness residual audit',
  seedStart: SEED_START,
  matches: MATCHES,
  matchDuration: MATCH_DURATION,
  census: {
    representedMatches: representedMatches.size,
    freshOrdinaryPasses,
    boundaryExcluded,
    goalkeeperExcluded,
    unsupportedAffordance,
    nonFiniteFlightExcluded,
    offsideBufferExcluded,
    eligibleRecords: records.length,
    outcomes: outcomeCounts,
  },
  validity: {
    duplicateIdentities,
    nonFiniteFacts,
    oracleForceFailures,
    transitionConservationFailures,
    administrativeCensors,
    frozenMutations,
    factRngDraws,
  },
  residual: {
    totalCells: cells.size,
    supportedCells,
    informativeCells,
    positiveCells,
    positiveCellShare,
    extremeRecords,
    groupDenominator,
    lowIntendedRate,
    highIntendedRate,
    intendedEdge,
    lowOpponentRate,
    highOpponentRate,
    opponentEdge,
    cells: cellSummaries,
  },
  diagnostics: {
    meanRelativeArrivalSpeedProxy: mean(records.map((record) => record.relativeArrivalSpeedProxy)),
    meanTargetSpeed: mean(records.map((record) => record.targetSpeed)),
    meanTargetTowardSpeed: mean(records.map((record) => record.targetTowardSpeed)),
    meanTargetLateralSpeed: mean(records.map((record) => record.targetLateralSpeed)),
    meanPredictedEndpointBallSpeed: mean(records.map((record) => record.predictedEndpointBallSpeed)),
    meanStoppingDistance: mean(records.map((record) => record.stoppingDistance)),
    meanStoppingSlack: mean(records.map((record) => record.stoppingSlack)),
  },
  gates,
  pass,
};

const canonicalLedger = records
  .map((record) => JSON.stringify(record))
  .join('\n');
const ledgerDigest = createHash('sha256').update(canonicalLedger).digest('hex');
const canonicalReport = JSON.stringify(report);
const reportDigest = createHash('sha256').update(canonicalReport).digest('hex');

console.log('A0 arrival-readiness residual audit');
console.log(`seeds ${SEED_START}-${SEED_START + MATCHES - 1} · represented ${representedMatches.size}/${MATCHES}`);
console.log(
  `ordinary ${freshOrdinaryPasses} · eligible ${records.length} · boundary ${boundaryExcluded} · `
  + `GK ${goalkeeperExcluded} · unsupported ${unsupportedAffordance} · `
  + `unreachable ${nonFiniteFlightExcluded} · offside-buffer ${offsideBufferExcluded}`,
);
console.log(`outcomes ${JSON.stringify(outcomeCounts)}`);
console.log(
  `cells total/supported/informative ${cells.size}/${supportedCells}/${informativeCells} · `
  + `extreme records ${extremeRecords} · positive ${positiveCells}/${informativeCells} `
  + `(${(positiveCellShare * 100).toFixed(1)}%)`,
);
console.log(
  `intended low/high ${(lowIntendedRate * 100).toFixed(1)}%/${(highIntendedRate * 100).toFixed(1)}% · `
  + `edge ${(intendedEdge * 100).toFixed(1)}pp`,
);
console.log(
  `opponent low/high ${(lowOpponentRate * 100).toFixed(1)}%/${(highOpponentRate * 100).toFixed(1)}% · `
  + `edge ${(opponentEdge * 100).toFixed(1)}pp`,
);
console.log(`validity ${JSON.stringify(report.validity)}`);
console.log(`ledger sha256 ${ledgerDigest}`);
console.log(`report sha256 ${reportDigest}`);
console.log('gates:');
for (const [name, value] of Object.entries(gates)) {
  console.log(`  ${name}: ${value ? 'PASS' : 'FAIL'}`);
}
console.log(`verdict ${pass ? 'PASS' : 'FAIL — STOP'}`);

