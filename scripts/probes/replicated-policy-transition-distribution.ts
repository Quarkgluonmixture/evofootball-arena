// T-DIST-0 REPLICATED-POLICY TRANSITION DISTRIBUTION AUTHORITY.
// Authority: docs/world-model/REPLICATED-POLICY-TRANSITION-DISTRIBUTION.md
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
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  capturePassLifecycle,
  classifyFirstTransition,
  type FirstTransitionOutcome,
  type OraclePassKey,
  type OracleTransitionStatus,
} from './oracle-v2';

const numericArguments = process.argv.slice(2)
  .filter((value) => !value.startsWith('--'))
  .map(Number);
if (numericArguments.some((value) => !Number.isFinite(value))) {
  throw new Error('T-DIST-0 numeric arguments must be finite');
}
const DEVELOPMENT_START = numericArguments[0] ?? 71_000;
const DEVELOPMENT_MATCHES = numericArguments[1] ?? 120;
const EXTERNAL_START = numericArguments[2] ?? 72_000;
const EXTERNAL_MATCHES = numericArguments[3] ?? 120;
const MATCH_DURATION = 240;
const AWARENESS = 0.8;
const ADMIN_GUARD = 5;
const TRANSITION_CAP = 4;
const REPLICATES = 8;
const CHILD_NAMESPACE = 0x7d157001;
const BOOTSTRAPS = 10_000;
const BOOTSTRAP_NAMESPACE = 0x7d157062;

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

interface DistributionRow {
  readonly identity: string;
  readonly matchSeed: number;
  readonly corridorPresent: boolean;
  readonly label: number;
  readonly childCounts: readonly number[];
}

interface Dataset {
  readonly rows: readonly DistributionRow[];
  readonly representedMatches: number;
  readonly ordinaryPasses: number;
  readonly eligiblePasses: number;
  readonly targetUnsupported: number;
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
  readonly withinPassChildSeedCollisions: number;
  readonly executedReplicates: number;
  readonly incompleteRecords: number;
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

const corridorPresent = (
  snapshot: PerceptionSnapshot,
  match: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
): { present: boolean; fallbacks: number } => {
  const profiles = profilesOf(match);
  let present = false;
  let fallbacks = 0;
  for (const observed of snapshot.players) {
    if (observed.side === side || observed.gid === targetGid) continue;
    const rosterPlayer = match.allPlayers.find((player) => player.gid === observed.gid);
    if (!rosterPlayer) {
      fallbacks++;
      continue;
    }
    if (rosterPlayer.role === 'GK' || rosterPlayer.sentOff) continue;
    const facts = evaluatePassCorridorInterception({
      snapshot,
      passerGid,
      targetGid,
      defenderGid: observed.gid,
      reachProfiles: profiles,
    });
    if (facts !== null && facts.strongestMargin >= 0) present = true;
  }
  return { present, fallbacks };
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

const collect = (start: number, matches: number): Dataset => {
  const rows: DistributionRow[] = [];
  const identities = new Set<string>();
  const represented = new Set<number>();
  const digest = createHash('sha256');
  const actualCounts = Array<number>(5).fill(0);
  const childAggregateCounts = Array<number>(5).fill(0);
  let ordinaryPasses = 0;
  let eligiblePasses = 0;
  let targetUnsupported = 0;
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
  let withinPassChildSeedCollisions = 0;
  let executedReplicates = 0;
  let incompleteRecords = 0;

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
        const corridor = corridorPresent(
          launchSnapshot, frozen, passer.gid, target.gid, passer.side,
        );
        truthFallbacks += corridor.fallbacks;
        const label = runTransition(frozen, passer.gid, target.gid, passer.side, null);
        if (label.status === 'forceFailure') labelForceFailures++;
        if (label.status === 'censored') labelCensors++;
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
        const counts = Array<number>(5).fill(0);
        for (const child of children) {
          const outcomeIndex = OUTCOME_INDEX.get(child.outcome!)!;
          counts[outcomeIndex]++;
          childAggregateCounts[outcomeIndex]++;
        }
        const labelIndex = OUTCOME_INDEX.get(label.outcome)!;
        actualCounts[labelIndex]++;
        represented.add(seed);
        const row: DistributionRow = {
          identity,
          matchSeed: seed,
          corridorPresent: corridor.present,
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
    withinPassChildSeedCollisions,
    executedReplicates,
    incompleteRecords,
    actualCounts,
    childCounts: childAggregateCounts,
    digest: digest.digest('hex'),
  };
};

const probabilityVectorValid = (values: readonly number[]): boolean =>
  values.length === 5
  && values.every((value) => Number.isFinite(value) && value > 0 && value < 1)
  && Math.abs(values.reduce((sum, value) => sum + value, 0) - 1) <= 1e-12;

interface Priors {
  readonly global: readonly number[];
  readonly corridorEmpty: readonly number[];
  readonly corridorPresent: readonly number[];
}

const fitPriors = (rows: readonly DistributionRow[]): Priors => {
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

const processProbabilities = (
  row: DistributionRow,
  global: readonly number[],
): readonly number[] => row.childCounts.map((count, klass) =>
  (count + global[klass]) / (REPLICATES + 1));

interface RowScore {
  readonly logLoss: number;
  readonly brier: number;
  readonly classBrier: readonly number[];
}

const score = (probabilities: readonly number[], label: number): RowScore => {
  const classBrier = probabilities.map((probability, klass) =>
    (probability - (label === klass ? 1 : 0)) ** 2);
  return {
    logLoss: -Math.log(probabilities[label]),
    brier: classBrier.reduce((sum, value) => sum + value, 0),
    classBrier,
  };
};

interface ScoredRow {
  readonly row: DistributionRow;
  readonly processProbabilities: readonly number[];
  readonly corridorProbabilities: readonly number[];
  readonly globalProbabilities: readonly number[];
  readonly process: RowScore;
  readonly corridor: RowScore;
  readonly global: RowScore;
}

interface MatchMetric {
  n: number;
  processLog: number;
  corridorLog: number;
  globalLog: number;
  processBrier: number;
  corridorBrier: number;
  globalBrier: number;
  processClass: number[];
  corridorClass: number[];
}

const emptyMetric = (): MatchMetric => ({
  n: 0,
  processLog: 0,
  corridorLog: 0,
  globalLog: 0,
  processBrier: 0,
  corridorBrier: 0,
  globalBrier: 0,
  processClass: Array<number>(5).fill(0),
  corridorClass: Array<number>(5).fill(0),
});

const metricsByMatch = (rows: readonly ScoredRow[]): Map<number, MatchMetric> => {
  const result = new Map<number, MatchMetric>();
  for (const row of rows) {
    let metric = result.get(row.row.matchSeed);
    if (metric === undefined) {
      metric = emptyMetric();
      result.set(row.row.matchSeed, metric);
    }
    metric.n++;
    metric.processLog += row.process.logLoss;
    metric.corridorLog += row.corridor.logLoss;
    metric.globalLog += row.global.logLoss;
    metric.processBrier += row.process.brier;
    metric.corridorBrier += row.corridor.brier;
    metric.globalBrier += row.global.brier;
    for (let klass = 0; klass < 5; klass++) {
      metric.processClass[klass] += row.process.classBrier[klass];
      metric.corridorClass[klass] += row.corridor.classBrier[klass];
    }
  }
  return result;
};

const meanMetric = (
  matches: ReadonlyMap<number, MatchMetric>,
  read: (metric: MatchMetric) => number,
): number => [...matches.values()].reduce((sum, metric) => sum + read(metric) / metric.n, 0)
  / Math.max(1, matches.size);

const bootstrapQuantile = (
  matches: ReadonlyMap<number, MatchMetric>,
  read: (metric: MatchMetric) => number,
  channel: number,
  quantile: number,
): number => {
  const values = [...matches.values()].map((metric) => read(metric) / metric.n);
  const rng = new Rng(hashSeed(BOOTSTRAP_NAMESPACE, channel));
  const samples = Array<number>(BOOTSTRAPS);
  for (let sample = 0; sample < BOOTSTRAPS; sample++) {
    let sum = 0;
    for (let draw = 0; draw < values.length; draw++) sum += values[rng.int(0, values.length - 1)];
    samples[sample] = sum / values.length;
  }
  samples.sort((left, right) => left - right);
  return samples[Math.min(BOOTSTRAPS - 1, Math.floor(quantile * BOOTSTRAPS))];
};

interface CalibrationLedger {
  readonly n: number[];
  readonly predicted: number[];
  readonly observed: number[];
}

const emptyLedger = (): CalibrationLedger => ({
  n: Array<number>(50).fill(0),
  predicted: Array<number>(50).fill(0),
  observed: Array<number>(50).fill(0),
});

const ledgerIndex = (klass: number, probability: number): number =>
  klass * 10 + Math.min(9, Math.floor(probability * 10));

const calibrationLedgers = (
  rows: readonly ScoredRow[],
  read: (row: ScoredRow) => readonly number[],
): Map<number, CalibrationLedger> => {
  const result = new Map<number, CalibrationLedger>();
  for (const row of rows) {
    let ledger = result.get(row.row.matchSeed);
    if (ledger === undefined) {
      ledger = emptyLedger();
      result.set(row.row.matchSeed, ledger);
    }
    const probabilities = read(row);
    for (let klass = 0; klass < 5; klass++) {
      const index = ledgerIndex(klass, probabilities[klass]);
      ledger.n[index]++;
      ledger.predicted[index] += probabilities[klass];
      ledger.observed[index] += row.row.label === klass ? 1 : 0;
    }
  }
  return result;
};

const eceFromTotals = (ledger: CalibrationLedger): { classwise: number[]; macro: number } => {
  const classwise = Array<number>(5).fill(0);
  const classTotals = Array<number>(5).fill(0);
  for (let index = 0; index < 50; index++) classTotals[Math.floor(index / 10)] += ledger.n[index];
  for (let klass = 0; klass < 5; klass++) {
    for (let bin = 0; bin < 10; bin++) {
      const index = klass * 10 + bin;
      if (ledger.n[index] === 0) continue;
      classwise[klass] += ledger.n[index] / classTotals[klass]
        * Math.abs((ledger.predicted[index] - ledger.observed[index]) / ledger.n[index]);
    }
  }
  return { classwise, macro: classwise.reduce((sum, value) => sum + value, 0) / 5 };
};

const totalLedger = (ledgers: ReadonlyMap<number, CalibrationLedger>): CalibrationLedger => {
  const total = emptyLedger();
  for (const ledger of ledgers.values()) {
    for (let index = 0; index < 50; index++) {
      total.n[index] += ledger.n[index];
      total.predicted[index] += ledger.predicted[index];
      total.observed[index] += ledger.observed[index];
    }
  }
  return total;
};

const calibrationDifferenceUcb = (
  processLedgers: ReadonlyMap<number, CalibrationLedger>,
  corridorLedgers: ReadonlyMap<number, CalibrationLedger>,
): number => {
  const seeds = [...processLedgers.keys()].sort((left, right) => left - right);
  const rng = new Rng(hashSeed(BOOTSTRAP_NAMESPACE, 99));
  const samples = Array<number>(BOOTSTRAPS);
  for (let sample = 0; sample < BOOTSTRAPS; sample++) {
    const processTotal = emptyLedger();
    const corridorTotal = emptyLedger();
    for (let draw = 0; draw < seeds.length; draw++) {
      const seed = seeds[rng.int(0, seeds.length - 1)];
      const process = processLedgers.get(seed)!;
      const corridor = corridorLedgers.get(seed)!;
      for (let index = 0; index < 50; index++) {
        processTotal.n[index] += process.n[index];
        processTotal.predicted[index] += process.predicted[index];
        processTotal.observed[index] += process.observed[index];
        corridorTotal.n[index] += corridor.n[index];
        corridorTotal.predicted[index] += corridor.predicted[index];
        corridorTotal.observed[index] += corridor.observed[index];
      }
    }
    samples[sample] = eceFromTotals(processTotal).macro - eceFromTotals(corridorTotal).macro;
  }
  samples.sort((left, right) => left - right);
  return samples[Math.floor(0.975 * BOOTSTRAPS)];
};

const supportGates = (dataset: Dataset, expectedMatches: number) => {
  const targetSupported = dataset.eligiblePasses - dataset.targetUnsupported;
  const configuredChildren = targetSupported * REPLICATES;
  const resolvedChildren = configuredChildren - dataset.childForceFailures - dataset.childCensors;
  const resolvedLabels = targetSupported - dataset.labelForceFailures - dataset.labelCensors;
  return {
    matches: dataset.representedMatches === expectedMatches,
    ordinarySupport: dataset.ordinaryPasses >= 8_000,
    targetCoverage: targetSupported / Math.max(1, dataset.eligiblePasses) >= 0.75,
    completeSupport: dataset.rows.length >= 6_000,
    labelResolution: resolvedLabels / Math.max(1, targetSupported) >= 0.95,
    childResolution: resolvedChildren / Math.max(1, configuredChildren) >= 0.95,
    allActualOutcomes: dataset.actualCounts.every((count) => count > 0),
    allChildOutcomes: dataset.childCounts.every((count) => count > 0),
    noDuplicates: dataset.duplicateIdentities === 0,
    rngPurity: dataset.perceptionRngChanges === 0,
    noFrozenMutation: dataset.frozenMutations === 0,
    noTruthFallback: dataset.truthFallbacks === 0,
    noForceFailures: dataset.labelForceFailures + dataset.childForceFailures === 0,
    conservation: dataset.conservationFailures === 0,
    kickParity: dataset.kickMismatches === 0,
    noChildSeedCollisions: dataset.withinPassChildSeedCollisions === 0,
    allReplicatesExecuted: dataset.executedReplicates === configuredChildren,
  };
};

const datasetSummary = (dataset: Dataset) => ({
  representedMatches: dataset.representedMatches,
  ordinaryPasses: dataset.ordinaryPasses,
  eligiblePasses: dataset.eligiblePasses,
  targetUnsupported: dataset.targetUnsupported,
  targetCoverage: (dataset.eligiblePasses - dataset.targetUnsupported)
    / Math.max(1, dataset.eligiblePasses),
  boundaryExcluded: dataset.boundaryExcluded,
  invalidTarget: dataset.invalidTarget,
  completeRows: dataset.rows.length,
  incompleteRecords: dataset.incompleteRecords,
  actualCounts: Object.fromEntries(OUTCOMES.map((outcome, index) =>
    [outcome, dataset.actualCounts[index]])),
  childCounts: Object.fromEntries(OUTCOMES.map((outcome, index) =>
    [outcome, dataset.childCounts[index]])),
  labelCensors: dataset.labelCensors,
  childCensors: dataset.childCensors,
  digest: dataset.digest,
});

const development = collect(DEVELOPMENT_START, DEVELOPMENT_MATCHES);
const developmentRerun = collect(DEVELOPMENT_START, DEVELOPMENT_MATCHES);
const developmentGates = supportGates(development, DEVELOPMENT_MATCHES);
const priors = fitPriors(development.rows);
const priorValidity = Object.values(priors).every(probabilityVectorValid);
const developmentDeterministic = JSON.stringify(development) === JSON.stringify(developmentRerun);
const developmentPass = Object.values(developmentGates).every(Boolean)
  && priorValidity
  && developmentDeterministic;

let external: Dataset | null = null;
let evaluation: Record<string, unknown> | null = null;
let externalGates: Record<string, boolean> | null = null;

if (developmentPass) {
  external = collect(EXTERNAL_START, EXTERNAL_MATCHES);
  const support = supportGates(external, EXTERNAL_MATCHES);
  let nonFiniteVectors = 0;
  const scored: ScoredRow[] = external.rows.map((row) => {
    const process = processProbabilities(row, priors.global);
    const corridor = row.corridorPresent ? priors.corridorPresent : priors.corridorEmpty;
    if (!probabilityVectorValid(process) || !probabilityVectorValid(corridor)
      || !probabilityVectorValid(priors.global)) nonFiniteVectors++;
    return {
      row,
      processProbabilities: process,
      corridorProbabilities: corridor,
      globalProbabilities: priors.global,
      process: score(process, row.label),
      corridor: score(corridor, row.label),
      global: score(priors.global, row.label),
    };
  });
  const matches = metricsByMatch(scored);
  const processLog = meanMetric(matches, (metric) => metric.processLog);
  const corridorLog = meanMetric(matches, (metric) => metric.corridorLog);
  const globalLog = meanMetric(matches, (metric) => metric.globalLog);
  const processBrier = meanMetric(matches, (metric) => metric.processBrier);
  const corridorBrier = meanMetric(matches, (metric) => metric.corridorBrier);
  const globalBrier = meanMetric(matches, (metric) => metric.globalBrier);
  const globalLogImprovement = (globalLog - processLog) / globalLog;
  const globalBrierImprovement = (globalBrier - processBrier) / globalBrier;
  const corridorLogImprovement = (corridorLog - processLog) / corridorLog;
  const corridorBrierImprovement = (corridorBrier - processBrier) / corridorBrier;
  const globalLogLcb = bootstrapQuantile(
    matches, (metric) => metric.globalLog - metric.processLog, 1, 0.025,
  );
  const globalBrierLcb = bootstrapQuantile(
    matches, (metric) => metric.globalBrier - metric.processBrier, 2, 0.025,
  );
  const corridorLogLcb = bootstrapQuantile(
    matches, (metric) => metric.corridorLog - metric.processLog, 3, 0.025,
  );
  const corridorBrierLcb = bootstrapQuantile(
    matches, (metric) => metric.corridorBrier - metric.processBrier, 4, 0.025,
  );
  const classImprovement = OUTCOMES.map((_, klass) => meanMetric(
    matches, (metric) => metric.corridorClass[klass] - metric.processClass[klass],
  ));
  const classLcb = OUTCOMES.map((_, klass) => bootstrapQuantile(
    matches,
    (metric) => metric.corridorClass[klass] - metric.processClass[klass],
    10 + klass,
    0.025,
  ));
  const rareRegressionUcb = OUTCOMES.map((_, klass) => bootstrapQuantile(
    matches,
    (metric) => metric.processClass[klass] - metric.corridorClass[klass],
    20 + klass,
    0.975,
  ));
  const processLedgers = calibrationLedgers(scored, (row) => row.processProbabilities);
  const corridorLedgers = calibrationLedgers(scored, (row) => row.corridorProbabilities);
  const processEce = eceFromTotals(totalLedger(processLedgers));
  const corridorEce = eceFromTotals(totalLedger(corridorLedgers));
  const calibrationUcb = calibrationDifferenceUcb(processLedgers, corridorLedgers);
  const calibrationInLarge = OUTCOMES.map((_, klass) => {
    const predicted = scored.reduce((sum, row) => sum + row.processProbabilities[klass], 0)
      / Math.max(1, scored.length);
    const observed = scored.filter((row) => row.row.label === klass).length
      / Math.max(1, scored.length);
    return Math.abs(predicted - observed);
  });
  const distances = scored.map((row) => row.processProbabilities.reduce((sum, probability, klass) =>
    sum + Math.abs(probability - priors.global[klass]), 0)).sort((left, right) => left - right);
  const medianL1 = distances[Math.floor(distances.length / 2)] ?? 0;
  const byOpponentProbability = [...scored].sort((left, right) =>
    left.processProbabilities[2] - right.processProbabilities[2]
      || left.row.identity.localeCompare(right.row.identity));
  const quintile = Math.max(1, Math.floor(byOpponentProbability.length / 5));
  const bottom = byOpponentProbability.slice(0, quintile);
  const top = byOpponentProbability.slice(-quintile);
  const opponentRate = (rows: readonly ScoredRow[]) => rows.filter((row) => row.row.label === 2).length
    / Math.max(1, rows.length);
  const opponentQuintileSeparation = opponentRate(top) - opponentRate(bottom);

  externalGates = {
    ...support,
    finiteProbabilityVectors: nonFiniteVectors === 0,
    globalLogMean: globalLogImprovement >= 0.05,
    globalBrierMean: globalBrierImprovement >= 0.05,
    globalLogLcb: globalLogLcb > 0,
    globalBrierLcb: globalBrierLcb > 0,
    corridorLogMean: corridorLogImprovement >= 0.02,
    corridorBrierMean: corridorBrierImprovement >= 0.02,
    corridorLogLcb: corridorLogLcb > 0,
    corridorBrierLcb: corridorBrierLcb > 0,
    intendedBrierLcb: classLcb[0] > 0,
    opponentBrierLcb: classLcb[2] > 0,
    teammateNonRegression: rareRegressionUcb[1] <= 0.001,
    looseNonRegression: rareRegressionUcb[3] <= 0.001,
    deadNonRegression: rareRegressionUcb[4] <= 0.001,
    calibrationAbsolute: processEce.macro <= 0.04,
    calibrationVsCorridor: calibrationUcb <= 0.005,
    intendedCalibrationInLarge: calibrationInLarge[0] <= 0.02,
    opponentCalibrationInLarge: calibrationInLarge[2] <= 0.02,
    teammateCalibrationInLarge: calibrationInLarge[1] <= 0.01,
    looseCalibrationInLarge: calibrationInLarge[3] <= 0.01,
    deadCalibrationInLarge: calibrationInLarge[4] <= 0.01,
    probabilityVariation: medianL1 >= 0.10,
    opponentQuintileSeparation: opponentQuintileSeparation >= 0.20,
  };
  evaluation = {
    scores: {
      logLoss: { process: processLog, corridor: corridorLog, global: globalLog },
      brier: { process: processBrier, corridor: corridorBrier, global: globalBrier },
      relativeImprovement: {
        globalLog: globalLogImprovement,
        globalBrier: globalBrierImprovement,
        corridorLog: corridorLogImprovement,
        corridorBrier: corridorBrierImprovement,
      },
      bootstrapLcb: { globalLogLcb, globalBrierLcb, corridorLogLcb, corridorBrierLcb },
    },
    classImprovement: Object.fromEntries(OUTCOMES.map((outcome, index) => [outcome, {
      mean: classImprovement[index], lcb: classLcb[index], regressionUcb: rareRegressionUcb[index],
    }])),
    calibration: {
      processEce,
      corridorEce,
      differenceUcb: calibrationUcb,
      inLarge: Object.fromEntries(OUTCOMES.map((outcome, index) =>
        [outcome, calibrationInLarge[index]])),
    },
    nonVacuity: { medianL1FromGlobal: medianL1, opponentQuintileSeparation },
    nonFiniteVectors,
  };
}

const pass = developmentPass && externalGates !== null && Object.values(externalGates).every(Boolean);
const report = {
  authority: 'T-DIST-0 replicated-policy transition distribution',
  parameters: {
    developmentStart: DEVELOPMENT_START,
    developmentMatches: DEVELOPMENT_MATCHES,
    externalStart: EXTERNAL_START,
    externalMatches: EXTERNAL_MATCHES,
    awareness: AWARENESS,
    replicates: REPLICATES,
    childNamespace: CHILD_NAMESPACE,
  },
  development: datasetSummary(development),
  developmentGates: { ...developmentGates, priorValidity, developmentDeterministic },
  priors,
  external: external === null ? null : datasetSummary(external),
  evaluation,
  externalGates,
  pass,
};
const canonical = JSON.stringify(report);
const digest = createHash('sha256').update(canonical).digest('hex');
const pct = (value: number): string => `${(value * 100).toFixed(2)}%`;
console.log('T-DIST-0 REPLICATED-POLICY TRANSITION DISTRIBUTION');
console.log(`development rows ${development.rows.length} · gates ${JSON.stringify(report.developmentGates)}`);
if (external !== null && evaluation !== null) {
  const scores = evaluation.scores as {
    logLoss: { process: number; corridor: number; global: number };
    brier: { process: number; corridor: number; global: number };
    relativeImprovement: Record<string, number>;
  };
  const calibration = evaluation.calibration as {
    processEce: { macro: number };
    corridorEce: { macro: number };
  };
  const nonVacuity = evaluation.nonVacuity as {
    medianL1FromGlobal: number;
    opponentQuintileSeparation: number;
  };
  console.log(`external rows ${external.rows.length} · outcomes ${JSON.stringify(report.external!.actualCounts)}`);
  console.log(`log process/corridor/global ${scores.logLoss.process.toFixed(6)}`
    + `/${scores.logLoss.corridor.toFixed(6)}/${scores.logLoss.global.toFixed(6)}`);
  console.log(`Brier process/corridor/global ${scores.brier.process.toFixed(6)}`
    + `/${scores.brier.corridor.toFixed(6)}/${scores.brier.global.toFixed(6)}`);
  const formattedImprovements = Object.fromEntries(
    Object.entries(scores.relativeImprovement).map(([key, value]) => [key, pct(value)]),
  );
  console.log(`improvement ${JSON.stringify(formattedImprovements)}`);
  console.log(`ECE process/corridor ${calibration.processEce.macro.toFixed(6)}`
    + `/${calibration.corridorEce.macro.toFixed(6)}`
    + ` · median L1 ${nonVacuity.medianL1FromGlobal.toFixed(4)}`
    + ` · opponent quintile separation ${pct(nonVacuity.opponentQuintileSeparation)}`);
  console.log(`external gates ${JSON.stringify(externalGates)}`);
}
console.log(`PASS ${pass}`);
console.log(`SHA256 ${digest}`);
if (process.argv.includes('--json')) console.log(`REPORT ${canonical}`);
