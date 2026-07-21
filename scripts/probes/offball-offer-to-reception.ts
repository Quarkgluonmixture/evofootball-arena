// O4a OFFER MOVEMENT -> FORCED PASS -> FIRST TRANSITION (offline only).
//   npx tsx scripts/probes/offball-offer-to-reception.ts [states] [seedOffset]
// O4b truth-ceiling fact calibration (explicit mode; O4a default stays frozen).
//   npx tsx scripts/probes/offball-offer-to-reception.ts 128 24000 calibration
// O4c observer-specific fact calibration (explicit mode; execution remains truth-frozen).
//   npx tsx scripts/probes/offball-offer-to-reception.ts 128 25000 observer
import {
  evaluateOffBallAffordances, evaluateOffBallCandidate,
  type OffBallAffordance, type OffBallCandidatePoint,
} from '../../src/ai/offBallAffordance';
import {
  capturePerceptionTruth, createPerceptionMemory, oraclePerceptionSnapshot, perceiveSnapshot,
  type PerceptionMemory,
} from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { supportSpot } from '../../src/ai/formations';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch, type FirstTransitionOutcome, type OracleTransitionStatus,
} from './oracle-v2';

const REQUIRED = Number(process.argv[2] ?? 128);
const OFF = Number(process.argv[3] ?? 23000);
const CALIBRATION = process.argv[4] === 'calibration';
const OBSERVER = process.argv[4] === 'observer';
const REPORT_CALIBRATION = CALIBRATION || OBSERVER;
const MOVE_STEPS = 90;
const SAMPLE_TICKS = Math.round(1 / DT);
const O4_NAMESPACE = 0x04a00001;
const AWARENESS = [0.2, 0.5, 0.8] as const;

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

type BranchKind = 'hold' | 'legacy' | 'forward' | 'lateral' | 'backward';
const BRANCHES: readonly BranchKind[] = ['hold', 'legacy', 'forward', 'lateral', 'backward'];

type PrePassStatus =
  | 'passForced'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';

interface BranchResult {
  readonly kind: BranchKind;
  readonly prePassStatus: PrePassStatus;
  readonly targetChanges: number;
  readonly unexpectedActionChanges: number;
  readonly nonFiniteFacts: number;
  readonly forceFailure: string | null;
  readonly transitionStatus: OracleTransitionStatus | null;
  readonly transitionOutcome: FirstTransitionOutcome | null;
  readonly progressionAtKick: number | null;
}

interface Aggregate {
  readonly prePass: Map<PrePassStatus, number>;
  forced: number;
  forceFailures: number;
  progressionAtKick: number;
  readonly transitionStatus: Map<OracleTransitionStatus, number>;
  readonly transitionOutcome: Map<FirstTransitionOutcome, number>;
}

type CalibrationFact =
  | 'opponentArrivalMargin'
  | 'carrierLaneClearance'
  | 'nearestTeammateDistanceAtArrival'
  | 'selfArrival'
  | 'forwardDelta';

const CALIBRATION_FACTS: readonly CalibrationFact[] = [
  'opponentArrivalMargin',
  'carrierLaneClearance',
  'nearestTeammateDistanceAtArrival',
  'selfArrival',
  'forwardDelta',
];

interface CalibrationRecord {
  readonly ordinal: number;
  readonly branch: BranchKind;
  readonly outcome: FirstTransitionOutcome | 'censored';
  readonly facts: Readonly<Record<CalibrationFact, number>>;
}

interface ObserverCalibrationRecord extends CalibrationRecord {
  readonly truthMargin: number;
  readonly selfAgeTicks: number;
  readonly carrierAgeTicks: number;
  readonly observedOpponentCount: number;
}

const aggregate = (): Aggregate => ({
  prePass: new Map<PrePassStatus, number>(),
  forced: 0,
  forceFailures: 0,
  progressionAtKick: 0,
  transitionStatus: new Map<OracleTransitionStatus, number>(),
  transitionOutcome: new Map<FirstTransitionOutcome, number>(),
});

const profilesOf = (match: Match): Map<number, KnownReachProfile> => {
  const result = new Map<number, KnownReachProfile>();
  for (const player of match.allPlayers) {
    if (player.sentOff) continue;
    result.set(player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    });
  }
  return result;
};

const sector = (value: OffBallAffordance): Exclude<BranchKind, 'hold' | 'legacy'> | null => {
  const { forwardDelta, lateralDelta } = value.candidate;
  if (forwardDelta > 1e-6) return 'forward';
  if (forwardDelta < -1e-6) return 'backward';
  if (Math.abs(lateralDelta) > 1e-6) return 'lateral';
  return null;
};

const qualifyingAffordance = (
  values: readonly OffBallAffordance[],
  wanted: Exclude<BranchKind, 'hold' | 'legacy'>,
): OffBallAffordance | null => values
  .filter((value) => (
    sector(value) === wanted && value.offsideMargin <= 0 && value.opponentArrivalMargin > 0
  ))
  .sort((a, b) => a.selfArrival - b.selfArrival || a.candidate.id.localeCompare(b.candidate.id))[0]
  ?? null;

const calibrationFactsOf = (
  value: OffBallAffordance,
): Readonly<Record<CalibrationFact, number>> => ({
  opponentArrivalMargin: value.opponentArrivalMargin,
  carrierLaneClearance: value.carrierLaneClearance,
  nearestTeammateDistanceAtArrival: value.nearestTeammateDistanceAtArrival,
  selfArrival: value.selfArrival,
  forwardDelta: value.candidate.forwardDelta,
});

const runBranch = (
  frozen: Match,
  carrierGid: number,
  moverGid: number,
  target: OffBallCandidatePoint,
  kind: BranchKind,
  side: Side,
  childSeed: number,
): BranchResult => {
  const branch = cloneSimulationState(frozen);
  const carrier = branch.allPlayers[carrierGid];
  const mover = branch.allPlayers[moverGid];
  const initialCarrierRoster = carrier.rosterIdx;
  const initialMoverRoster = mover.rosterIdx;
  const frozenTarget = { x: target.point.x, y: target.point.y };

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  mover.action = { type: 'MoveToPoint', targetPos: frozenTarget, scores: [] };
  mover.decisionTimer = Number.POSITIVE_INFINITY;

  let prePassStatus: PrePassStatus = 'passForced';
  let targetChanges = 0;
  let unexpectedActionChanges = 0;
  let nonFiniteFacts = 0;

  for (let step = 0; step < MOVE_STEPS; step++) {
    if (branch.finished) {
      prePassStatus = 'finishedEarly';
      break;
    }
    branch.step(DT);
    if (![carrier.pos.x, carrier.pos.y, mover.pos.x, mover.pos.y, branch.ball.pos.x, branch.ball.pos.y]
      .every(Number.isFinite)) nonFiniteFacts++;
    if (branch.phase !== 'playing') {
      prePassStatus = 'deadBallOrRestart';
      break;
    }
    if (branch.ball.owner !== carrier) {
      if (!branch.ball.owner) prePassStatus = 'loose';
      else if (branch.ball.owner.side === carrier.side) prePassStatus = 'lostToTeammate';
      else prePassStatus = 'lostToOpponent';
      break;
    }
    if (
      carrier.sentOff || mover.sentOff ||
      carrier.rosterIdx !== initialCarrierRoster || mover.rosterIdx !== initialMoverRoster
    ) {
      prePassStatus = 'removedOrSubstituted';
      break;
    }
    if (mover.action.type !== 'MoveToPoint') {
      unexpectedActionChanges++;
      prePassStatus = 'unexpectedInterventionChange';
      break;
    }
    if (
      mover.action.targetPos?.x !== frozenTarget.x ||
      mover.action.targetPos?.y !== frozenTarget.y
    ) targetChanges++;
    if (carrier.action.type !== 'HoldPosition') {
      unexpectedActionChanges++;
      prePassStatus = 'unexpectedInterventionChange';
      break;
    }
  }

  if (prePassStatus !== 'passForced') return {
    kind,
    prePassStatus,
    targetChanges,
    unexpectedActionChanges,
    nonFiniteFacts,
    forceFailure: null,
    transitionStatus: null,
    transitionOutcome: null,
    progressionAtKick: null,
  };

  const progressionAtKick = branch.teams[side].localX(mover.pos.x)
    - branch.teams[side].localX(carrier.pos.x);
  if (!Number.isFinite(progressionAtKick)) nonFiniteFacts++;
  carrier.decisionTimer = 0;
  mover.decisionTimer = 0;
  const oracle = runOracleV2Branch({
    frozen: branch,
    passerGid: carrierGid,
    targetGid: moverGid,
    side,
    branch: kind === 'hold' ? 'chosen' : 'alternative',
    childRngState: childSeed,
    includeTransitionDiagnostic: false,
  });
  if (!oracle.ok) return {
    kind,
    prePassStatus,
    targetChanges,
    unexpectedActionChanges,
    nonFiniteFacts,
    forceFailure: oracle.reason,
    transitionStatus: null,
    transitionOutcome: null,
    progressionAtKick,
  };
  return {
    kind,
    prePassStatus,
    targetChanges,
    unexpectedActionChanges,
    nonFiniteFacts,
    forceFailure: null,
    transitionStatus: oracle.record.firstTransition.status,
    transitionOutcome: oracle.record.firstTransition.outcome,
    progressionAtKick,
  };
};

const totals = new Map<BranchKind, Aggregate>(BRANCHES.map((kind) => [kind, aggregate()]));
let frozenStates = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;
let targetChanges = 0;
let unexpectedActionChanges = 0;
let nonFiniteFacts = 0;
let calibrationNonFiniteFacts = 0;
const calibrationRecords: CalibrationRecord[] = [];
let observerNonFiniteFacts = 0;
const observerRecords = new Map<number, ObserverCalibrationRecord[]>(
  AWARENESS.map((awareness) => [awareness, []]),
);

for (let seed = OFF; frozenStates < REQUIRED && seed < OFF + 128; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  const memories = new Map<number, Map<number, PerceptionMemory>>(
    AWARENESS.map((awareness) => [awareness, new Map()]),
  );
  const memoryFor = (awareness: number, gid: number): PerceptionMemory => {
    const byPlayer = memories.get(awareness)!;
    let memory = byPlayer.get(gid);
    if (!memory) {
      memory = createPerceptionMemory();
      byPlayer.set(gid, memory);
    }
    return memory;
  };
  while (!match.finished && frozenStates < REQUIRED) {
    match.step(DT);
    if (OBSERVER) {
      const warmTruth = capturePerceptionTruth(match);
      for (const player of match.allPlayers) {
        if (player.sentOff) continue;
        for (const awareness of AWARENESS) {
          perceiveSnapshot(
            warmTruth, player.gid, awareness, seed, memoryFor(awareness, player.gid),
          );
        }
      }
    }
    if (
      match.simTick % SAMPLE_TICKS !== 0 || match.phase !== 'playing' ||
      match.simTime > match.duration - 6
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff || carrier.role === 'GK' || carrier.action.type !== 'Dribble') continue;
    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const profiles = profilesOf(match);
    let selected: {
      moverGid: number;
      offers: Record<BranchKind, OffBallAffordance>;
      perceivedOffers: ReadonlyMap<number, ReadonlyMap<BranchKind, OffBallAffordance | null>>;
    } | null = null;

    for (const mover of attackingTeam.players) {
      if (
        mover.sentOff || mover.role === 'GK' || mover === carrier ||
        mover.action.type !== 'SupportBallCarrier'
      ) continue;
      const values = evaluateOffBallAffordances({
        snapshot: oraclePerceptionSnapshot(truth, mover.gid),
        playerGid: mover.gid,
        carrierGid: carrier.gid,
        attackDir: attackingTeam.attackDir,
        reachProfiles: profiles,
      });
      if (!values) continue;
      const hold = values.find((value) => value.candidate.id === 'hold') ?? null;
      const forward = qualifyingAffordance(values, 'forward');
      const lateral = qualifyingAffordance(values, 'lateral');
      const backward = qualifyingAffordance(values, 'backward');
      if (!forward || !lateral || !backward) continue;
      const legacyPoint = supportSpot(mover, attackingTeam, match.ball);
      const legacy = evaluateOffBallCandidate({
        snapshot: oraclePerceptionSnapshot(truth, mover.gid),
        playerGid: mover.gid,
        carrierGid: carrier.gid,
        attackDir: attackingTeam.attackDir,
        reachProfiles: profiles,
      }, {
        id: 'legacy', point: { x: legacyPoint.x, y: legacyPoint.y }, sampleHorizon: 0,
        directionIndex: null,
        forwardDelta: (legacyPoint.x - mover.pos.x) * attackingTeam.attackDir,
        lateralDelta: legacyPoint.y - mover.pos.y,
      });
      if (!hold || !legacy) continue;
      const offers: Record<BranchKind, OffBallAffordance> = {
        hold,
        legacy,
        forward,
        lateral,
        backward,
      };
      const perceivedOffers = new Map<number, ReadonlyMap<BranchKind, OffBallAffordance | null>>();
      if (OBSERVER) {
        for (const awareness of AWARENESS) {
          const snapshot = perceiveSnapshot(
            truth, mover.gid, awareness, seed, memoryFor(awareness, mover.gid),
          );
          const byBranch = new Map<BranchKind, OffBallAffordance | null>();
          for (const kind of BRANCHES) {
            byBranch.set(kind, evaluateOffBallCandidate({
              snapshot,
              playerGid: mover.gid,
              carrierGid: carrier.gid,
              attackDir: attackingTeam.attackDir,
              reachProfiles: profiles,
            }, offers[kind].candidate));
          }
          perceivedOffers.set(awareness, byBranch);
        }
      }
      selected = {
        moverGid: mover.gid,
        offers,
        perceivedOffers,
      };
      break;
    }
    if (!selected) continue;

    const childSeed = hashSeed(
      O4_NAMESPACE, seed, match.simTick, carrier.gid, selected.moverGid,
    );
    for (const kind of BRANCHES) {
      try {
        const offer = selected.offers[kind];
        const facts = calibrationFactsOf(offer);
        if (REPORT_CALIBRATION && !Object.values(facts).every(Number.isFinite)) {
          calibrationNonFiniteFacts++;
        }
        const first = runBranch(
          match, carrier.gid, selected.moverGid, offer.candidate, kind,
          carrier.side, childSeed,
        );
        const second = runBranch(
          match, carrier.gid, selected.moverGid, offer.candidate, kind,
          carrier.side, childSeed,
        );
        if (JSON.stringify(first) !== JSON.stringify(second)) deterministicDifferences++;
        targetChanges += first.targetChanges;
        unexpectedActionChanges += first.unexpectedActionChanges;
        nonFiniteFacts += first.nonFiniteFacts;
        const sum = totals.get(kind)!;
        sum.prePass.set(first.prePassStatus, (sum.prePass.get(first.prePassStatus) ?? 0) + 1);
        if (first.prePassStatus === 'passForced') {
          sum.forced++;
          if (first.forceFailure) sum.forceFailures++;
          else {
            const ordinal = calibrationRecords.length;
            const outcome = first.transitionStatus === 'censored'
              ? 'censored'
              : first.transitionOutcome!;
            if (REPORT_CALIBRATION) calibrationRecords.push({
              ordinal,
              branch: kind,
              outcome,
              facts,
            });
            if (OBSERVER) {
              for (const awareness of AWARENESS) {
                const perceived = selected.perceivedOffers.get(awareness)!.get(kind);
                if (!perceived) continue;
                const perceivedFacts = calibrationFactsOf(perceived);
                if (!Object.values(perceivedFacts).every(Number.isFinite)) {
                  observerNonFiniteFacts++;
                  continue;
                }
                observerRecords.get(awareness)!.push({
                  ordinal,
                  branch: kind,
                  outcome,
                  facts: perceivedFacts,
                  truthMargin: facts.opponentArrivalMargin,
                  selfAgeTicks: perceived.selfObservationAgeTicks,
                  carrierAgeTicks: perceived.carrierObservationAgeTicks,
                  observedOpponentCount: perceived.observedOpponentCount,
                });
              }
            }
            sum.progressionAtKick += first.progressionAtKick!;
            sum.transitionStatus.set(
              first.transitionStatus!,
              (sum.transitionStatus.get(first.transitionStatus!) ?? 0) + 1,
            );
            if (first.transitionOutcome) sum.transitionOutcome.set(
              first.transitionOutcome,
              (sum.transitionOutcome.get(first.transitionOutcome) ?? 0) + 1,
            );
          }
        }
      } catch {
        cloneFailures++;
      }
    }
    frozenStates++;
  }
}

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const mapLine = <T extends string>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([name, count]) => `${name}=${count}`).join(' · ');

console.log(`O4a OFFER MOVEMENT TO RECEPTION · requested ${REQUIRED} · seed start ${OFF}`);
console.log(`frozen states ${frozenStates} · clone failures ${cloneFailures} · deterministic differences ${deterministicDifferences}`);
console.log(`target/unexpected-action/non-finite violations ${targetChanges}/${unexpectedActionChanges}/${nonFiniteFacts}`);
let minIntendedRate = Infinity;
let maxIntendedRate = -Infinity;
for (const kind of BRANCHES) {
  const sum = totals.get(kind)!;
  const intended = sum.transitionOutcome.get('intendedReception') ?? 0;
  const intendedRate = sum.forced > 0 ? intended / sum.forced : 0;
  minIntendedRate = Math.min(minIntendedRate, intendedRate);
  maxIntendedRate = Math.max(maxIntendedRate, intendedRate);
  console.log(`  ${kind.padEnd(8)} pre-pass ${mapLine(sum.prePass)}`);
  console.log(
    `           forced ${sum.forced}/${REQUIRED} · force failures ${sum.forceFailures}`
    + ` · progression ${(sum.progressionAtKick / Math.max(1, sum.forced)).toFixed(3)}m`,
  );
  console.log(
    `           status ${mapLine(sum.transitionStatus)}`
    + ` · outcomes ${mapLine(sum.transitionOutcome)}`
    + ` · intended ${pct(intended, sum.forced)}`,
  );
}
console.log(`intended-reception range ${((maxIntendedRate - minIntendedRate) * 100).toFixed(1)}pp`);

interface QuartileResult {
  readonly count: number;
  readonly intendedRate: number;
  readonly opponentRate: number;
}

const reportCalibrationFact = (
  fact: CalibrationFact,
  records: readonly CalibrationRecord[],
): readonly QuartileResult[] => {
  const sorted = records.slice().sort((a, b) =>
    a.facts[fact] - b.facts[fact] || a.ordinal - b.ordinal);
  const buckets = Array.from({ length: 4 }, () => [] as CalibrationRecord[]);
  sorted.forEach((record, index) => {
    buckets[Math.min(3, Math.floor(index * 4 / sorted.length))].push(record);
  });
  console.log(`  ${fact}${fact === 'opponentArrivalMargin' ? ' [PRIMARY]' : ' [diagnostic]'}`);
  return buckets.map((bucket, index) => {
    const intended = bucket.filter((record) => record.outcome === 'intendedReception').length;
    const opponent = bucket.filter((record) => record.outcome === 'opponentInterception').length;
    const outcomeCounts = new Map<string, number>();
    const branchCounts = new Map<BranchKind, number>();
    let total = 0;
    for (const record of bucket) {
      total += record.facts[fact];
      outcomeCounts.set(record.outcome, (outcomeCounts.get(record.outcome) ?? 0) + 1);
      branchCounts.set(record.branch, (branchCounts.get(record.branch) ?? 0) + 1);
    }
    console.log(
      `    Q${index + 1} n=${bucket.length} mean=${(total / Math.max(1, bucket.length)).toFixed(4)}`
      + ` · intended=${pct(intended, bucket.length)}`
      + ` · opponent=${pct(opponent, bucket.length)}`
      + ` · other=${pct(bucket.length - intended - opponent, bucket.length)}`,
    );
    console.log(`       outcomes ${mapLine(outcomeCounts)} · branches ${mapLine(branchCounts)}`);
    return {
      count: bucket.length,
      intendedRate: intended / Math.max(1, bucket.length),
      opponentRate: opponent / Math.max(1, bucket.length),
    };
  });
};

let calibrationPassed = true;
if (CALIBRATION) {
  console.log(`O4b TRUTH-CEILING TRANSITION CALIBRATION · records ${calibrationRecords.length}`);
  console.log(`calibration non-finite facts ${calibrationNonFiniteFacts}`);
  let primary: readonly QuartileResult[] = [];
  for (const fact of CALIBRATION_FACTS) {
    const quartiles = reportCalibrationFact(fact, calibrationRecords);
    if (fact === 'opponentArrivalMargin') primary = quartiles;
  }
  const intendedDelta = primary[3].intendedRate - primary[0].intendedRate;
  const opponentDelta = primary[3].opponentRate - primary[0].opponentRate;
  console.log(
    `primary Q4-Q1 intended ${(intendedDelta * 100).toFixed(1)}pp`
    + ` · opponent ${(opponentDelta * 100).toFixed(1)}pp`,
  );
  calibrationPassed = calibrationRecords.length >= 400 && calibrationNonFiniteFacts === 0
    && intendedDelta >= 0.10 && opponentDelta <= -0.10;
}

let observerPassed = true;
if (OBSERVER) {
  console.log(`O4c OBSERVER-SPECIFIC TRANSITION CALIBRATION · truth records ${calibrationRecords.length}`);
  console.log(
    `truth/observer non-finite facts ${calibrationNonFiniteFacts}/${observerNonFiniteFacts}`,
  );
  console.log('  truth ceiling on fresh states');
  const truthQuartiles = reportCalibrationFact('opponentArrivalMargin', calibrationRecords);
  const truthIntendedDelta = truthQuartiles[3].intendedRate - truthQuartiles[0].intendedRate;
  const truthOpponentDelta = truthQuartiles[3].opponentRate - truthQuartiles[0].opponentRate;
  console.log(
    `  truth Q4-Q1 intended ${(truthIntendedDelta * 100).toFixed(1)}pp`
    + ` · opponent ${(truthOpponentDelta * 100).toFixed(1)}pp`,
  );
  const truthReplicated = calibrationRecords.length >= 400 && calibrationNonFiniteFacts === 0
    && truthIntendedDelta >= 0.10 && truthOpponentDelta <= -0.10;

  let highCoverage = 0;
  let highIntendedDelta = -Infinity;
  let highOpponentDelta = Infinity;
  for (const awareness of AWARENESS) {
    const records = observerRecords.get(awareness)!;
    const coverage = records.length / Math.max(1, calibrationRecords.length);
    let marginError = 0;
    let signMatches = 0;
    let selfAge = 0;
    let carrierAge = 0;
    let opponents = 0;
    for (const record of records) {
      marginError += Math.abs(record.facts.opponentArrivalMargin - record.truthMargin);
      if ((record.facts.opponentArrivalMargin >= 0) === (record.truthMargin >= 0)) signMatches++;
      selfAge += record.selfAgeTicks;
      carrierAge += record.carrierAgeTicks;
      opponents += record.observedOpponentCount;
    }
    console.log(
      `  awareness ${awareness.toFixed(1)} coverage ${records.length}/${calibrationRecords.length}`
      + ` (${(coverage * 100).toFixed(1)}%)`
      + ` · margin MAE ${(marginError / Math.max(1, records.length)).toFixed(4)}s`
      + ` · sign agreement ${pct(signMatches, records.length)}`
      + ` · ages self/carrier ${(selfAge / Math.max(1, records.length)).toFixed(2)}`
      + `/${(carrierAge / Math.max(1, records.length)).toFixed(2)} ticks`
      + ` · opponents ${(opponents / Math.max(1, records.length)).toFixed(2)}`,
    );
    const perceivedQuartiles = reportCalibrationFact('opponentArrivalMargin', records);
    const intendedDelta = perceivedQuartiles[3].intendedRate
      - perceivedQuartiles[0].intendedRate;
    const opponentDelta = perceivedQuartiles[3].opponentRate
      - perceivedQuartiles[0].opponentRate;
    console.log(
      `    perceived Q4-Q1 intended ${(intendedDelta * 100).toFixed(1)}pp`
      + ` · opponent ${(opponentDelta * 100).toFixed(1)}pp`,
    );
    const supportedTruthRecords: CalibrationRecord[] = records.map((record) => ({
      ordinal: record.ordinal,
      branch: record.branch,
      outcome: record.outcome,
      facts: { ...record.facts, opponentArrivalMargin: record.truthMargin },
    }));
    console.log('    paired truth within supported records');
    const supportedTruthQuartiles = reportCalibrationFact(
      'opponentArrivalMargin', supportedTruthRecords,
    );
    console.log(
      `    paired-truth Q4-Q1 intended ${((supportedTruthQuartiles[3].intendedRate
        - supportedTruthQuartiles[0].intendedRate) * 100).toFixed(1)}pp`
      + ` · opponent ${((supportedTruthQuartiles[3].opponentRate
        - supportedTruthQuartiles[0].opponentRate) * 100).toFixed(1)}pp`,
    );
    if (awareness === 0.8) {
      highCoverage = coverage;
      highIntendedDelta = intendedDelta;
      highOpponentDelta = opponentDelta;
    }
  }
  console.log(
    `observer verdict truth=${truthReplicated ? 'PASS' : 'INCONCLUSIVE'}`
    + ` · high-awareness coverage ${(highCoverage * 100).toFixed(1)}%`
    + ` · intended ${(highIntendedDelta * 100).toFixed(1)}pp`
    + ` · opponent ${(highOpponentDelta * 100).toFixed(1)}pp`,
  );
  observerPassed = truthReplicated && observerNonFiniteFacts === 0
    && highCoverage >= 0.80 && highIntendedDelta >= 0.08 && highOpponentDelta <= -0.08;
}

const minimumForced = BRANCHES.every((kind) =>
  totals.get(kind)!.forced >= Math.min(64, REQUIRED));
const forceFailures = [...totals.values()].reduce((sum, value) => sum + value.forceFailures, 0);
if (
  frozenStates !== REQUIRED || cloneFailures > 0 || deterministicDifferences > 0 ||
  targetChanges > 0 || unexpectedActionChanges > 0 || nonFiniteFacts > 0 ||
  forceFailures > 0 || !minimumForced ||
  (CALIBRATION
    ? !calibrationPassed
    : OBSERVER ? !observerPassed : maxIntendedRate - minIntendedRate < 0.05)
) process.exitCode = 1;
