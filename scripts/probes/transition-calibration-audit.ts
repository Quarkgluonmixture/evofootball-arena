import { createHash } from 'node:crypto';
import { hashSeed, Rng } from '../../src/utils/rng';

const CLASS_COUNT = 5;
const BIN_COUNT = 10;
const BOOTSTRAPS = 10000;
const BOOTSTRAP_NAMESPACE = 0x74306661;

export interface TransitionCalibrationAuditRow {
  readonly matchSeed: number;
  readonly decisionId: string;
  readonly label: number;
  readonly actionProbabilities: readonly number[];
  readonly stateProbabilities: readonly number[];
}

export interface TransitionClassCalibrationFacts {
  readonly ece: number;
  readonly observedFrequency: number;
  readonly meanPredictedProbability: number;
  readonly signedResidual: number;
}

export interface TransitionCalibrationAuditResult {
  readonly rows: number;
  readonly clusters: number;
  readonly decisions: number;
  readonly action: {
    readonly classes: readonly TransitionClassCalibrationFacts[];
    readonly macroEce: number;
  };
  readonly state: {
    readonly classes: readonly TransitionClassCalibrationFacts[];
    readonly macroEce: number;
  };
  readonly classEceGaps: readonly number[];
  readonly decisionMassShift: {
    readonly meanL1: number;
    readonly medianL1: number;
    readonly p90L1: number;
    readonly meanSignedClassShift: readonly number[];
  };
  readonly bootstrap: {
    readonly samples: number;
    readonly lower95: number;
    readonly upper95: number;
    readonly digest: string;
  };
  readonly invariants: {
    readonly malformedRows: number;
    readonly binConservationFailures: number;
    readonly stateWithinDecisionDifferences: number;
    readonly nonFiniteOutputs: number;
  };
}

interface IndexedRow {
  readonly row: TransitionCalibrationAuditRow;
  readonly index: number;
}

interface CalibrationFacts {
  readonly classes: TransitionClassCalibrationFacts[];
  readonly macroEce: number;
}

const validateRow = (row: TransitionCalibrationAuditRow): boolean => {
  if (
    !Number.isInteger(row.matchSeed)
    || typeof row.decisionId !== 'string'
    || row.decisionId.length === 0
    || !Number.isInteger(row.label)
    || row.label < 0
    || row.label >= CLASS_COUNT
    || row.actionProbabilities.length !== CLASS_COUNT
    || row.stateProbabilities.length !== CLASS_COUNT
    || !row.actionProbabilities.every(Number.isFinite)
    || !row.stateProbabilities.every(Number.isFinite)
    || row.actionProbabilities.some((value) => value < 0 || value > 1)
    || row.stateProbabilities.some((value) => value < 0 || value > 1)
  ) return false;
  const actionSum = row.actionProbabilities.reduce((sum, value) => sum + value, 0);
  const stateSum = row.stateProbabilities.reduce((sum, value) => sum + value, 0);
  return Math.abs(actionSum - 1) <= 1e-12 && Math.abs(stateSum - 1) <= 1e-12;
};

const calibrationFacts = (
  rows: readonly IndexedRow[],
  probabilitiesOf: (row: TransitionCalibrationAuditRow) => readonly number[],
): { facts: CalibrationFacts; bins: readonly (readonly IndexedRow[])[] } => {
  const classes: TransitionClassCalibrationFacts[] = [];
  const allBins: IndexedRow[][] = [];
  for (let klass = 0; klass < CLASS_COUNT; klass++) {
    const ordered = [...rows].sort((left, right) =>
      probabilitiesOf(left.row)[klass] - probabilitiesOf(right.row)[klass]
      || left.index - right.index);
    let ece = 0;
    let predictedTotal = 0;
    let observedTotal = 0;
    for (let bin = 0; bin < BIN_COUNT; bin++) {
      const start = Math.floor(bin * ordered.length / BIN_COUNT);
      const end = Math.floor((bin + 1) * ordered.length / BIN_COUNT);
      const values = ordered.slice(start, end);
      allBins.push(values);
      if (values.length === 0) continue;
      let predicted = 0;
      let observed = 0;
      for (const value of values) {
        predicted += probabilitiesOf(value.row)[klass];
        observed += value.row.label === klass ? 1 : 0;
      }
      predictedTotal += predicted;
      observedTotal += observed;
      ece += values.length / ordered.length
        * Math.abs(predicted / values.length - observed / values.length);
    }
    const meanPredictedProbability = predictedTotal / rows.length;
    const observedFrequency = observedTotal / rows.length;
    classes.push({
      ece,
      observedFrequency,
      meanPredictedProbability,
      signedResidual: meanPredictedProbability - observedFrequency,
    });
  }
  return {
    facts: {
      classes,
      macroEce: classes.reduce((sum, value) => sum + value.ece, 0) / CLASS_COUNT,
    },
    bins: allBins,
  };
};

interface ClusterBinLedger {
  readonly count: Float64Array;
  readonly predicted: Float64Array;
  readonly observed: Float64Array;
}

const clusterLedgers = (
  bins: readonly (readonly IndexedRow[])[],
  probabilitiesOf: (row: TransitionCalibrationAuditRow) => readonly number[],
): Map<number, ClusterBinLedger> => {
  const ledgers = new Map<number, ClusterBinLedger>();
  for (let channel = 0; channel < bins.length; channel++) {
    const klass = Math.floor(channel / BIN_COUNT);
    for (const indexed of bins[channel]) {
      let ledger = ledgers.get(indexed.row.matchSeed);
      if (ledger === undefined) {
        ledger = {
          count: new Float64Array(CLASS_COUNT * BIN_COUNT),
          predicted: new Float64Array(CLASS_COUNT * BIN_COUNT),
          observed: new Float64Array(CLASS_COUNT * BIN_COUNT),
        };
        ledgers.set(indexed.row.matchSeed, ledger);
      }
      ledger.count[channel]++;
      ledger.predicted[channel] += probabilitiesOf(indexed.row)[klass];
      ledger.observed[channel] += indexed.row.label === klass ? 1 : 0;
    }
  }
  return ledgers;
};

const macroEceFrom = (
  counts: Float64Array,
  predicted: Float64Array,
  observed: Float64Array,
): number => {
  let macro = 0;
  for (let klass = 0; klass < CLASS_COUNT; klass++) {
    let total = 0;
    for (let bin = 0; bin < BIN_COUNT; bin++) total += counts[klass * BIN_COUNT + bin];
    let classEce = 0;
    if (total > 0) {
      for (let bin = 0; bin < BIN_COUNT; bin++) {
        const index = klass * BIN_COUNT + bin;
        if (counts[index] === 0) continue;
        classEce += counts[index] / total
          * Math.abs(predicted[index] / counts[index] - observed[index] / counts[index]);
      }
    }
    macro += classEce;
  }
  return macro / CLASS_COUNT;
};

const percentile = (sorted: readonly number[], probability: number): number =>
  sorted[Math.min(sorted.length - 1, Math.floor(probability * sorted.length))];

const decisionMassShift = (
  rows: readonly TransitionCalibrationAuditRow[],
): {
  decisions: number;
  meanL1: number;
  medianL1: number;
  p90L1: number;
  meanSignedClassShift: number[];
  stateWithinDecisionDifferences: number;
} => {
  const byDecision = new Map<string, TransitionCalibrationAuditRow[]>();
  for (const row of rows) {
    const values = byDecision.get(row.decisionId) ?? [];
    values.push(row);
    byDecision.set(row.decisionId, values);
  }
  const distances: number[] = [];
  const classShift = Array<number>(CLASS_COUNT).fill(0);
  let stateWithinDecisionDifferences = 0;
  for (const values of byDecision.values()) {
    if (values.length < 2) continue;
    const state = values[0].stateProbabilities;
    const actionMean = Array<number>(CLASS_COUNT).fill(0);
    for (const value of values) {
      for (let klass = 0; klass < CLASS_COUNT; klass++) {
        if (value.stateProbabilities[klass] !== state[klass]) {
          stateWithinDecisionDifferences++;
        }
        actionMean[klass] += value.actionProbabilities[klass] / values.length;
      }
    }
    let distance = 0;
    for (let klass = 0; klass < CLASS_COUNT; klass++) {
      const shift = actionMean[klass] - state[klass];
      classShift[klass] += shift;
      distance += Math.abs(shift);
    }
    distances.push(distance);
  }
  distances.sort((left, right) => left - right);
  return {
    decisions: distances.length,
    meanL1: distances.reduce((sum, value) => sum + value, 0) / Math.max(distances.length, 1),
    medianL1: percentile(distances, 0.5),
    p90L1: percentile(distances, 0.9),
    meanSignedClassShift: classShift.map((sum) => sum / Math.max(distances.length, 1)),
    stateWithinDecisionDifferences,
  };
};

export function auditTransitionCalibrationV1(
  rows: readonly TransitionCalibrationAuditRow[],
): TransitionCalibrationAuditResult {
  const malformedRows = rows.filter((row) => !validateRow(row)).length;
  if (rows.length < BIN_COUNT || malformedRows > 0) {
    throw new Error(`invalid calibration audit rows: ${malformedRows}/${rows.length}`);
  }
  const indexed = rows.map((row, index): IndexedRow => ({ row, index }));
  const action = calibrationFacts(indexed, (row) => row.actionProbabilities);
  const state = calibrationFacts(indexed, (row) => row.stateProbabilities);
  const actionLedgers = clusterLedgers(action.bins, (row) => row.actionProbabilities);
  const stateLedgers = clusterLedgers(state.bins, (row) => row.stateProbabilities);
  const seeds = [...new Set(rows.map((row) => row.matchSeed))].sort((left, right) => left - right);

  let binConservationFailures = 0;
  for (const ledgers of [actionLedgers, stateLedgers]) {
    for (let klass = 0; klass < CLASS_COUNT; klass++) {
      let total = 0;
      for (const ledger of ledgers.values()) {
        for (let bin = 0; bin < BIN_COUNT; bin++) total += ledger.count[klass * BIN_COUNT + bin];
      }
      if (total !== rows.length) binConservationFailures++;
    }
  }

  const bootstrapDifferences: number[] = [];
  const rng = new Rng(hashSeed(BOOTSTRAP_NAMESPACE, rows.length, seeds.length));
  for (let sample = 0; sample < BOOTSTRAPS; sample++) {
    const actionCount = new Float64Array(CLASS_COUNT * BIN_COUNT);
    const actionPredicted = new Float64Array(CLASS_COUNT * BIN_COUNT);
    const actionObserved = new Float64Array(CLASS_COUNT * BIN_COUNT);
    const stateCount = new Float64Array(CLASS_COUNT * BIN_COUNT);
    const statePredicted = new Float64Array(CLASS_COUNT * BIN_COUNT);
    const stateObserved = new Float64Array(CLASS_COUNT * BIN_COUNT);
    for (let draw = 0; draw < seeds.length; draw++) {
      const seed = seeds[rng.int(0, seeds.length - 1)];
      const actionLedger = actionLedgers.get(seed)!;
      const stateLedger = stateLedgers.get(seed)!;
      for (let channel = 0; channel < CLASS_COUNT * BIN_COUNT; channel++) {
        actionCount[channel] += actionLedger.count[channel];
        actionPredicted[channel] += actionLedger.predicted[channel];
        actionObserved[channel] += actionLedger.observed[channel];
        stateCount[channel] += stateLedger.count[channel];
        statePredicted[channel] += stateLedger.predicted[channel];
        stateObserved[channel] += stateLedger.observed[channel];
      }
    }
    bootstrapDifferences.push(
      macroEceFrom(actionCount, actionPredicted, actionObserved)
      - macroEceFrom(stateCount, statePredicted, stateObserved),
    );
  }
  bootstrapDifferences.sort((left, right) => left - right);
  const bootstrapDigest = createHash('sha256')
    .update(JSON.stringify(bootstrapDifferences))
    .digest('hex');
  const massShift = decisionMassShift(rows);
  const classEceGaps = action.facts.classes.map((value, klass) =>
    value.ece - state.facts.classes[klass].ece);
  const finiteOutputs = [
    action.facts.macroEce,
    state.facts.macroEce,
    ...action.facts.classes.flatMap((value) => Object.values(value)),
    ...state.facts.classes.flatMap((value) => Object.values(value)),
    ...classEceGaps,
    massShift.meanL1,
    massShift.medianL1,
    massShift.p90L1,
    ...massShift.meanSignedClassShift,
    percentile(bootstrapDifferences, 0.025),
    percentile(bootstrapDifferences, 0.975),
  ];

  return {
    rows: rows.length,
    clusters: seeds.length,
    decisions: massShift.decisions,
    action: action.facts,
    state: state.facts,
    classEceGaps,
    decisionMassShift: {
      meanL1: massShift.meanL1,
      medianL1: massShift.medianL1,
      p90L1: massShift.p90L1,
      meanSignedClassShift: massShift.meanSignedClassShift,
    },
    bootstrap: {
      samples: BOOTSTRAPS,
      lower95: percentile(bootstrapDifferences, 0.025),
      upper95: percentile(bootstrapDifferences, 0.975),
      digest: bootstrapDigest,
    },
    invariants: {
      malformedRows,
      binConservationFailures,
      stateWithinDecisionDifferences: massShift.stateWithinDecisionDifferences,
      nonFiniteOutputs: finiteOutputs.filter((value) => !Number.isFinite(value)).length,
    },
  };
}
