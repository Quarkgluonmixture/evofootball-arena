// R1a RELATIVE-AFFORDANCE FRESH CLONE VALIDATION (offline only).
//   npx tsx scripts/probes/relative-affordance-validation.ts [states] [seedOffset]
import { relativePointTarget } from '../../src/ai/actionExecutor';
import { offsideLineLocalX } from '../../src/ai/formations';
import { evaluateRelativePointAffordance } from '../../src/ai/relativeAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

const REQUIRED = Number(process.argv[2] ?? 64);
const OFF = Number(process.argv[3] ?? 36000);
const MAX_SEEDS = 128;
const STEPS = 90;
const HORIZON = STEPS * DT;
const REFERENCE_TRAVEL = 5;
const OFFSET_DELTA = 4;
const PITCH_INSET = 2;

const DELTAS = [
  { kind: 'forward', x: OFFSET_DELTA, y: 0 },
  { kind: 'backward', x: -OFFSET_DELTA, y: 0 },
  { kind: 'lateral+', x: 0, y: OFFSET_DELTA },
  { kind: 'lateral-', x: 0, y: -OFFSET_DELTA },
] as const;

type BranchKind = typeof DELTAS[number]['kind'];
type BranchStatus =
  | 'completed'
  | 'finishedEarly'
  | 'deadBallOrRestart'
  | 'controlEnded'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange';

interface FrozenState {
  readonly match: Match;
  readonly carrierGid: number;
  readonly referenceGid: number;
  readonly moverGid: number;
  readonly referenceTarget: V2;
  readonly baseOffset: V2;
}

interface QueryFacts {
  readonly eligible: boolean;
  readonly reachable: boolean;
  readonly insidePitch: boolean;
  readonly projectedOnside: boolean;
  readonly barredAllowed: boolean;
  readonly selfArrival: number;
  readonly arrivalSlack: number;
  readonly currentOffsideMargin: number;
  readonly projectedOffsideMargin: number;
  readonly projectedOffsideLine: number;
  readonly fieldMargin: number;
  readonly targetX: number;
  readonly targetY: number;
}

interface BranchSummary extends QueryFacts {
  readonly kind: BranchKind;
  readonly status: BranchStatus;
  readonly closed: boolean;
  readonly initialMoverDistance: number;
  readonly finalMoverDistance: number;
  readonly referenceDisplacement: number;
  readonly referenceTargetClosure: number;
  readonly relativeTargetDisplacement: number;
  readonly displacementIdentityError: number;
  readonly actualOffsideMargin: number;
  readonly offsideLinePredictionError: number;
  readonly actionChanges: number;
  readonly offsetChanges: number;
  readonly referenceChanges: number;
  readonly intentChanges: number;
  readonly nonFiniteFacts: number;
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

const insideInset = (point: Readonly<V2>): boolean =>
  Math.abs(point.x) <= HALF_L - PITCH_INSET && Math.abs(point.y) <= HALF_W - PITCH_INSET;

const distance = (left: Readonly<V2>, right: Readonly<V2>): number =>
  Math.hypot(left.x - right.x, left.y - right.y);

const unitMotion = (vel: Readonly<V2>, bodyDir: Readonly<V2>): V2 => {
  const speed = Math.hypot(vel.x, vel.y);
  const source = speed >= 1 ? vel : bodyDir;
  const magnitude = Math.hypot(source.x, source.y);
  return magnitude > 1e-9
    ? { x: source.x / magnitude, y: source.y / magnitude }
    : { x: 1, y: 0 };
};

const findFrozenState = (match: Match): FrozenState | null => {
  if (match.phase !== 'playing') return null;
  const carrier = match.ball.owner;
  if (!carrier || carrier.role === 'GK' || carrier.sentOff || carrier.action.type !== 'Dribble') {
    return null;
  }
  const candidates = match.teams[carrier.side].players
    .filter((player) => player !== carrier && player.role !== 'GK' && !player.sentOff)
    .sort((left, right) => left.gid - right.gid);
  for (const reference of candidates) {
    const direction = unitMotion(reference.vel, reference.bodyDir);
    const referenceTarget = {
      x: reference.pos.x + direction.x * REFERENCE_TRAVEL,
      y: reference.pos.y + direction.y * REFERENCE_TRAVEL,
    };
    if (!insideInset(referenceTarget)) continue;
    const mover = candidates.find((candidate) => candidate !== reference);
    if (!mover) continue;
    return {
      match,
      carrierGid: carrier.gid,
      referenceGid: reference.gid,
      moverGid: mover.gid,
      referenceTarget,
      baseOffset: {
        x: match.teams[carrier.side].attackDir * (mover.pos.x - reference.pos.x),
        y: mover.pos.y - reference.pos.y,
      },
    };
  }
  return null;
};

const reachProfiles = (match: Match): ReadonlyMap<number, KnownReachProfile> =>
  new Map(match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
    topSpeed: player.topSpeed,
    accel: player.accel,
    dribbling: player.attrs.dribbling,
  }]));

const evaluateQuery = (
  frozen: FrozenState,
  kind: BranchKind,
): QueryFacts | null => {
  const match = frozen.match;
  const mover = match.allPlayers[frozen.moverGid];
  const delta = DELTAS.find((entry) => entry.kind === kind)!;
  const offset = {
    x: frozen.baseOffset.x + delta.x,
    y: frozen.baseOffset.y + delta.y,
  };
  const snapshot = oraclePerceptionSnapshot(capturePerceptionTruth(match), mover.gid);
  const facts = evaluateRelativePointAffordance({
    relationId: `r1a:${kind}`,
    snapshot,
    playerGid: mover.gid,
    carrierGid: frozen.carrierGid,
    attackDir: match.teams[mover.side].attackDir,
    reachProfiles: reachProfiles(match),
    referenceIntent: {
      referenceGid: frozen.referenceGid,
      targetPoint: frozen.referenceTarget,
      arrivalTime: HORIZON,
    },
    relativeOffset: offset,
    commitments: [],
    currentTick: match.simTick,
    barredFromOpposingBox: false,
  });
  if (!facts) return null;
  const repeated = evaluateRelativePointAffordance({
    relationId: `r1a:${kind}`,
    snapshot,
    playerGid: mover.gid,
    carrierGid: frozen.carrierGid,
    attackDir: match.teams[mover.side].attackDir,
    reachProfiles: reachProfiles(match),
    referenceIntent: {
      referenceGid: frozen.referenceGid,
      targetPoint: frozen.referenceTarget,
      arrivalTime: HORIZON,
    },
    relativeOffset: offset,
    commitments: [],
    currentTick: match.simTick,
    barredFromOpposingBox: false,
  });
  if (JSON.stringify(repeated) !== JSON.stringify(facts)) return null;
  return {
    eligible: facts.reachableByIntent
      && facts.insidePhysicalPitch
      && facts.projectedOnside
      && facts.barredAreaAllowed,
    reachable: facts.reachableByIntent,
    insidePitch: facts.insidePhysicalPitch,
    projectedOnside: facts.projectedOnside,
    barredAllowed: facts.barredAreaAllowed,
    selfArrival: facts.selfArrival,
    arrivalSlack: facts.arrivalSlack,
    currentOffsideMargin: facts.currentOffsideMargin,
    projectedOffsideMargin: facts.projectedOffsideMargin,
    projectedOffsideLine: facts.projectedOffsideLine,
    fieldMargin: facts.fieldMargin,
    targetX: facts.targetPoint.x,
    targetY: facts.targetPoint.y,
  };
};

const runBranch = (
  frozen: FrozenState,
  kind: BranchKind,
  query: QueryFacts,
): BranchSummary => {
  const branch = cloneSimulationState(frozen.match);
  const carrier = branch.allPlayers[frozen.carrierGid];
  const reference = branch.allPlayers[frozen.referenceGid];
  const mover = branch.allPlayers[frozen.moverGid];
  const side = branch.teams[mover.side];
  const delta = DELTAS.find((entry) => entry.kind === kind)!;
  const frozenOffset = {
    x: frozen.baseOffset.x + delta.x,
    y: frozen.baseOffset.y + delta.y,
  };
  const frozenReferenceTarget = { ...frozen.referenceTarget };
  const initialReference = { ...reference.pos };
  const initialMoverTarget = relativePointTarget(
    reference.pos, side.attackDir, frozenOffset,
  )!;
  const initialMoverDistance = distance(mover.pos, initialMoverTarget);
  const initialReferenceDistance = distance(reference.pos, frozenReferenceTarget);
  const carrierRoster = carrier.rosterIdx;
  const referenceRoster = reference.rosterIdx;
  const moverRoster = mover.rosterIdx;

  carrier.action = { type: 'HoldPosition', scores: [] };
  reference.action = { type: 'MoveToPoint', targetPos: frozenReferenceTarget, scores: [] };
  mover.action = {
    type: 'TrackRelativePoint',
    relativeToGid: reference.gid,
    relativeOffset: frozenOffset,
    scores: [],
  };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  reference.decisionTimer = Number.POSITIVE_INFINITY;
  mover.decisionTimer = Number.POSITIVE_INFINITY;

  let status: BranchStatus = 'completed';
  let actionChanges = 0;
  let offsetChanges = 0;
  let referenceChanges = 0;
  let intentChanges = 0;
  let nonFiniteFacts = 0;
  for (let step = 0; step < STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    const currentTarget = relativePointTarget(reference.pos, side.attackDir, frozenOffset);
    if (!currentTarget || ![
      carrier.pos.x, carrier.pos.y,
      reference.pos.x, reference.pos.y,
      mover.pos.x, mover.pos.y,
      mover.vel.x, mover.vel.y,
      currentTarget?.x, currentTarget?.y,
      branch.ball.pos.x, branch.ball.pos.y,
    ].every(Number.isFinite)) nonFiniteFacts++;
    if (branch.phase !== 'playing') {
      status = 'deadBallOrRestart';
      break;
    }
    if (branch.ball.owner !== carrier) {
      status = 'controlEnded';
      break;
    }
    if (
      carrier.sentOff || reference.sentOff || mover.sentOff
      || carrier.rosterIdx !== carrierRoster
      || reference.rosterIdx !== referenceRoster
      || mover.rosterIdx !== moverRoster
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (carrier.action.type !== 'HoldPosition') actionChanges++;
    if (reference.action.type !== 'MoveToPoint') {
      actionChanges++;
    } else if (
      reference.action.targetPos?.x !== frozenReferenceTarget.x
      || reference.action.targetPos?.y !== frozenReferenceTarget.y
    ) intentChanges++;
    if (mover.action.type !== 'TrackRelativePoint') {
      actionChanges++;
    } else {
      if (mover.action.relativeToGid !== frozen.referenceGid) referenceChanges++;
      if (
        mover.action.relativeOffset?.x !== frozenOffset.x
        || mover.action.relativeOffset?.y !== frozenOffset.y
      ) offsetChanges++;
    }
    if (
      actionChanges > 0 || offsetChanges > 0
      || referenceChanges > 0 || intentChanges > 0
    ) {
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  const finalMoverTarget = relativePointTarget(reference.pos, side.attackDir, frozenOffset)!;
  const finalMoverDistance = distance(mover.pos, finalMoverTarget);
  const referenceDelta = {
    x: reference.pos.x - initialReference.x,
    y: reference.pos.y - initialReference.y,
  };
  const relativeTargetDelta = {
    x: finalMoverTarget.x - initialMoverTarget.x,
    y: finalMoverTarget.y - initialMoverTarget.y,
  };
  const actualOffsideLine = offsideLineLocalX(
    side,
    branch.teams[1 - mover.side].players,
    side.localX(branch.ball.pos.x),
  );
  return {
    ...query,
    kind,
    status,
    closed: finalMoverDistance < initialMoverDistance,
    initialMoverDistance,
    finalMoverDistance,
    referenceDisplacement: Math.hypot(referenceDelta.x, referenceDelta.y),
    referenceTargetClosure: initialReferenceDistance - distance(reference.pos, frozenReferenceTarget),
    relativeTargetDisplacement: Math.hypot(relativeTargetDelta.x, relativeTargetDelta.y),
    displacementIdentityError: Math.hypot(
      referenceDelta.x - relativeTargetDelta.x,
      referenceDelta.y - relativeTargetDelta.y,
    ),
    actualOffsideMargin: side.localX(finalMoverTarget.x) - actualOffsideLine,
    offsideLinePredictionError: query.projectedOffsideLine - actualOffsideLine,
    actionChanges,
    offsetChanges,
    referenceChanges,
    intentChanges,
    nonFiniteFacts,
  };
};

const statuses = new Map<BranchKind, Map<BranchStatus, number>>(
  DELTAS.map(({ kind }) => [kind, new Map()]),
);
const summaries = new Map<BranchKind, BranchSummary[]>(
  DELTAS.map(({ kind }) => [kind, []]),
);
let frozenStates = 0;
let scannedSeeds = 0;
let queryFailures = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;

for (let seed = OFF; seed < OFF + MAX_SEEDS && frozenStates < REQUIRED; seed++) {
  scannedSeeds++;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
  });
  let accepted = false;
  while (!match.finished && !accepted) {
    match.step(DT);
    const frozen = findFrozenState(match);
    if (!frozen) continue;
    accepted = true;
    frozenStates++;
    for (const { kind } of DELTAS) {
      const query = evaluateQuery(frozen, kind);
      if (!query) {
        queryFailures++;
        continue;
      }
      try {
        const first = runBranch(frozen, kind, query);
        const second = runBranch(frozen, kind, query);
        if (JSON.stringify(first) !== JSON.stringify(second)) deterministicDifferences++;
        summaries.get(kind)!.push(first);
        const statusMap = statuses.get(kind)!;
        statusMap.set(first.status, (statusMap.get(first.status) ?? 0) + 1);
      } catch {
        cloneFailures++;
      }
    }
  }
}

const pct = (part: number, whole: number): string =>
  `${(part / Math.max(1, whole) * 100).toFixed(1)}%`;
const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const quantile = (values: readonly number[], q: number): number => {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)))];
};
const summary = (name: string, values: readonly number[], unit: string): void => {
  console.log(
    `    ${name.padEnd(27)} mean ${mean(values).toFixed(3)}${unit}`
    + ` · q10/q50/q90 ${quantile(values, 0.1).toFixed(3)}`
    + `/${quantile(values, 0.5).toFixed(3)}/${quantile(values, 0.9).toFixed(3)}${unit}`,
  );
};
const mapLine = <T extends string>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');

console.log(`R1a RELATIVE-AFFORDANCE VALIDATION · requested ${REQUIRED} · seed start ${OFF}`);
console.log(
  `frozen states ${frozenStates} · scanned independent seeds ${scannedSeeds}`
  + ` · query/clone failures ${queryFailures}/${cloneFailures}`
  + ` · determinism differences ${deterministicDifferences}`,
);

let completedTotal = 0;
let eligibleCompletedTotal = 0;
let eligibleClosedTotal = 0;
let closedTotal = 0;
let referenceMovedTotal = 0;
let ineligibleCompletedTotal = 0;
let actionChangesTotal = 0;
let offsetChangesTotal = 0;
let referenceChangesTotal = 0;
let intentChangesTotal = 0;
let identityFailures = 0;
let nonFiniteTotal = 0;
let perAxisPassed = true;

for (const { kind } of DELTAS) {
  const all = summaries.get(kind)!;
  const completed = all.filter((entry) => entry.status === 'completed');
  const eligible = completed.filter((entry) => entry.eligible);
  const eligibleClosed = eligible.filter((entry) => entry.closed);
  const closed = completed.filter((entry) => entry.closed);
  const ineligible = completed.filter((entry) => !entry.eligible);
  const referenceMoved = completed.filter((entry) => entry.referenceDisplacement >= 3).length;
  completedTotal += completed.length;
  eligibleCompletedTotal += eligible.length;
  eligibleClosedTotal += eligibleClosed.length;
  closedTotal += closed.length;
  ineligibleCompletedTotal += ineligible.length;
  referenceMovedTotal += referenceMoved;
  actionChangesTotal += all.reduce((sum, entry) => sum + entry.actionChanges, 0);
  offsetChangesTotal += all.reduce((sum, entry) => sum + entry.offsetChanges, 0);
  referenceChangesTotal += all.reduce((sum, entry) => sum + entry.referenceChanges, 0);
  intentChangesTotal += all.reduce((sum, entry) => sum + entry.intentChanges, 0);
  identityFailures += all.filter((entry) => entry.displacementIdentityError > 1e-12).length;
  nonFiniteTotal += all.reduce((sum, entry) => sum + entry.nonFiniteFacts, 0);
  const axisEligibleRate = eligibleClosed.length / Math.max(1, eligible.length);
  if (eligible.length < 24 || axisEligibleRate < 0.90) perAxisPassed = false;

  console.log(`  ${kind}`);
  console.log(
    `    status ${mapLine(statuses.get(kind)!)} · completed ${completed.length}`
    + ` · eligible ${eligible.length} · eligible closed ${eligibleClosed.length}/${eligible.length}`
    + ` (${pct(eligibleClosed.length, eligible.length)})`
    + ` · all closed ${closed.length}/${completed.length} (${pct(closed.length, completed.length)})`,
  );
  console.log(
    `    rejected reach/pitch/offside/barred `
    + `${completed.filter((entry) => !entry.reachable).length}`
    + `/${completed.filter((entry) => !entry.insidePitch).length}`
    + `/${completed.filter((entry) => !entry.projectedOnside).length}`
    + `/${completed.filter((entry) => !entry.barredAllowed).length}`,
  );
  summary('eligible final error', eligible.map((entry) => entry.finalMoverDistance), 'm');
  summary('ineligible final error', ineligible.map((entry) => entry.finalMoverDistance), 'm');
  summary('arrival slack', completed.map((entry) => entry.arrivalSlack), 's');
  summary('projected offside margin', completed.map((entry) => entry.projectedOffsideMargin), 'm');
  summary('actual offside margin', completed.map((entry) => entry.actualOffsideMargin), 'm');
  summary('offside-line prediction error', completed.map((entry) => entry.offsideLinePredictionError), 'm');
}

const eligibleCloseRate = eligibleClosedTotal / Math.max(1, eligibleCompletedTotal);
const retainedClosures = eligibleClosedTotal / Math.max(1, closedTotal);
const referenceMoveRate = referenceMovedTotal / Math.max(1, completedTotal);
console.log(
  `TOTAL completed ${completedTotal}/${frozenStates * DELTAS.length}`
  + ` · eligible ${eligibleCompletedTotal} · eligible closed ${eligibleClosedTotal}`
  + ` (${pct(eligibleClosedTotal, eligibleCompletedTotal)})`
  + ` · all closed ${closedTotal} · retained closures ${eligibleClosedTotal}/${closedTotal}`
  + ` (${pct(eligibleClosedTotal, closedTotal)})`,
);
console.log(
  `ineligible completed ${ineligibleCompletedTotal}`
  + ` · reference moved ${referenceMovedTotal}/${completedTotal} (${pct(referenceMovedTotal, completedTotal)})`,
);
console.log(
  `drift action/offset/reference/intent `
  + `${actionChangesTotal}/${offsetChangesTotal}/${referenceChangesTotal}/${intentChangesTotal}`
  + ` · identity failures ${identityFailures} · non-finite ${nonFiniteTotal}`,
);

if (
  frozenStates !== REQUIRED
  || scannedSeeds > MAX_SEEDS
  || queryFailures > 0
  || cloneFailures > 0
  || deterministicDifferences > 0
  || completedTotal < 192
  || !perAxisPassed
  || eligibleCloseRate < 0.92
  || retainedClosures < 0.70
  || ineligibleCompletedTotal < 8
  || referenceMoveRate < 0.90
  || actionChangesTotal > 0
  || offsetChangesTotal > 0
  || referenceChangesTotal > 0
  || intentChangesTotal > 0
  || identityFailures > 0
  || nonFiniteTotal > 0
) process.exitCode = 1;
