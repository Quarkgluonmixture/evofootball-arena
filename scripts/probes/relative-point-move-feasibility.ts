// R0a RELATIVE-POINT CLONE FEASIBILITY (offline only).
//   npx tsx scripts/probes/relative-point-move-feasibility.ts [states] [seedOffset]
import { relativePointTarget } from '../../src/ai/actionExecutor';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W } from '../../src/sim/constants';
import { Match } from '../../src/sim/Match';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { V2 } from '../../src/utils/vec';
import { Rng } from '../../src/utils/rng';

const REQUIRED = Number(process.argv[2] ?? 64);
const OFF = Number(process.argv[3] ?? 32000);
const MAX_SEEDS = 128;
const STEPS = 90;
const REFERENCE_FORWARD = 5;
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

interface BranchSummary {
  readonly kind: BranchKind;
  readonly status: BranchStatus;
  readonly initialMoverDistance: number;
  readonly finalMoverDistance: number;
  readonly referenceDisplacement: number;
  readonly referenceTargetClosure: number;
  readonly relativeTargetDisplacement: number;
  readonly displacementIdentityError: number;
  readonly actionChanges: number;
  readonly offsetChanges: number;
  readonly referenceChanges: number;
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

const distance = (a: Readonly<V2>, b: Readonly<V2>): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

const findFrozenState = (match: Match): FrozenState | null => {
  if (match.phase !== 'playing') return null;
  const carrier = match.ball.owner;
  if (!carrier || carrier.role === 'GK' || carrier.sentOff || carrier.action.type !== 'Dribble') {
    return null;
  }
  const side = match.teams[carrier.side];
  const candidates = side.players
    .filter((player) => player !== carrier && player.role !== 'GK' && !player.sentOff)
    .sort((a, b) => a.gid - b.gid);
  for (const reference of candidates) {
    const referenceTarget = {
      x: reference.pos.x + side.attackDir * REFERENCE_FORWARD,
      y: reference.pos.y,
    };
    if (!insideInset(referenceTarget)) continue;
    for (const mover of candidates) {
      if (mover === reference) continue;
      const baseOffset = {
        x: side.attackDir * (mover.pos.x - reference.pos.x),
        y: mover.pos.y - reference.pos.y,
      };
      const allInside = DELTAS.every((delta) => {
        const offset = { x: baseOffset.x + delta.x, y: baseOffset.y + delta.y };
        const initial = relativePointTarget(reference.pos, side.attackDir, offset);
        const terminal = relativePointTarget(referenceTarget, side.attackDir, offset);
        return initial !== null && terminal !== null && insideInset(initial) && insideInset(terminal);
      });
      if (allInside) {
        return {
          match,
          carrierGid: carrier.gid,
          referenceGid: reference.gid,
          moverGid: mover.gid,
          referenceTarget,
          baseOffset,
        };
      }
    }
  }
  return null;
};

const runBranch = (frozen: FrozenState, kind: BranchKind): BranchSummary => {
  const branch = cloneSimulationState(frozen.match);
  const carrier = branch.allPlayers[frozen.carrierGid];
  const reference = branch.allPlayers[frozen.referenceGid];
  const mover = branch.allPlayers[frozen.moverGid];
  const delta = DELTAS.find((entry) => entry.kind === kind)!;
  const offset = {
    x: frozen.baseOffset.x + delta.x,
    y: frozen.baseOffset.y + delta.y,
  };
  const frozenReferenceTarget = { ...frozen.referenceTarget };
  const frozenOffset = { ...offset };
  const initialReference = { ...reference.pos };
  const initialMoverTarget = relativePointTarget(reference.pos, branch.teams[mover.side].attackDir, offset)!;
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
  let nonFiniteFacts = 0;
  for (let step = 0; step < STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    const currentTarget = relativePointTarget(
      reference.pos, branch.teams[mover.side].attackDir, frozenOffset,
    );
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
    if (
      reference.action.type !== 'MoveToPoint'
      || reference.action.targetPos?.x !== frozenReferenceTarget.x
      || reference.action.targetPos?.y !== frozenReferenceTarget.y
    ) actionChanges++;
    if (mover.action.type !== 'TrackRelativePoint') {
      actionChanges++;
    } else {
      if (mover.action.relativeToGid !== frozen.referenceGid) referenceChanges++;
      if (
        mover.action.relativeOffset?.x !== frozenOffset.x
        || mover.action.relativeOffset?.y !== frozenOffset.y
      ) offsetChanges++;
    }
    if (actionChanges > 0 || offsetChanges > 0 || referenceChanges > 0) {
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  const finalMoverTarget = relativePointTarget(
    reference.pos, branch.teams[mover.side].attackDir, frozenOffset,
  )!;
  const referenceDelta = {
    x: reference.pos.x - initialReference.x,
    y: reference.pos.y - initialReference.y,
  };
  const relativeTargetDelta = {
    x: finalMoverTarget.x - initialMoverTarget.x,
    y: finalMoverTarget.y - initialMoverTarget.y,
  };
  return {
    kind,
    status,
    initialMoverDistance,
    finalMoverDistance: distance(mover.pos, finalMoverTarget),
    referenceDisplacement: Math.hypot(referenceDelta.x, referenceDelta.y),
    referenceTargetClosure: initialReferenceDistance - distance(reference.pos, frozenReferenceTarget),
    relativeTargetDisplacement: Math.hypot(relativeTargetDelta.x, relativeTargetDelta.y),
    displacementIdentityError: Math.hypot(
      referenceDelta.x - relativeTargetDelta.x,
      referenceDelta.y - relativeTargetDelta.y,
    ),
    actionChanges,
    offsetChanges,
    referenceChanges,
    nonFiniteFacts,
  };
};

const statuses = new Map<BranchKind, Map<BranchStatus, number>>(
  DELTAS.map(({ kind }) => [kind, new Map()]),
);
const summaries = new Map<BranchKind, BranchSummary[]>(DELTAS.map(({ kind }) => [kind, []]));
let frozenStates = 0;
let scannedSeeds = 0;
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
      try {
        const first = runBranch(frozen, kind);
        const second = runBranch(frozen, kind);
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
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)))];
};
const summary = (name: string, values: readonly number[], unit: string): void => {
  console.log(
    `    ${name.padEnd(24)} mean ${mean(values).toFixed(3)}${unit}`
    + ` · q10/q50/q90 ${quantile(values, 0.1).toFixed(3)}`
    + `/${quantile(values, 0.5).toFixed(3)}/${quantile(values, 0.9).toFixed(3)}${unit}`,
  );
};
const mapLine = <T extends string>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');

console.log(`R0a RELATIVE-POINT MOVE FEASIBILITY · requested ${REQUIRED} · seed start ${OFF}`);
console.log(
  `frozen states ${frozenStates} · scanned independent seeds ${scannedSeeds}`
  + ` · clone failures ${cloneFailures} · determinism differences ${deterministicDifferences}`,
);

let completedTotal = 0;
let referenceMovedTotal = 0;
let moverClosedTotal = 0;
let actionChangesTotal = 0;
let offsetChangesTotal = 0;
let referenceChangesTotal = 0;
let nonFiniteTotal = 0;
let identityFailures = 0;
let perAxisPassed = true;

for (const { kind } of DELTAS) {
  const all = summaries.get(kind)!;
  const completed = all.filter((entry) => entry.status === 'completed');
  const referenceMoved = completed.filter((entry) => entry.referenceDisplacement >= 3).length;
  const moverClosed = completed.filter((entry) => (
    entry.finalMoverDistance < entry.initialMoverDistance
  )).length;
  const identityBad = all.filter((entry) => entry.displacementIdentityError > 1e-12).length;
  completedTotal += completed.length;
  referenceMovedTotal += referenceMoved;
  moverClosedTotal += moverClosed;
  actionChangesTotal += all.reduce((sum, entry) => sum + entry.actionChanges, 0);
  offsetChangesTotal += all.reduce((sum, entry) => sum + entry.offsetChanges, 0);
  referenceChangesTotal += all.reduce((sum, entry) => sum + entry.referenceChanges, 0);
  nonFiniteTotal += all.reduce((sum, entry) => sum + entry.nonFiniteFacts, 0);
  identityFailures += identityBad;
  if (
    completed.length < 48
    || referenceMoved / Math.max(1, completed.length) < 0.95
    || moverClosed / Math.max(1, completed.length) < 0.90
  ) perAxisPassed = false;
  console.log(`  ${kind}`);
  console.log(
    `    status ${mapLine(statuses.get(kind)!)} · reference moved ${referenceMoved}/${completed.length}`
    + ` (${pct(referenceMoved, completed.length)}) · mover closed ${moverClosed}/${completed.length}`
    + ` (${pct(moverClosed, completed.length)}) · identity failures ${identityBad}`,
  );
  summary('initial mover distance', completed.map((entry) => entry.initialMoverDistance), 'm');
  summary('final mover distance', completed.map((entry) => entry.finalMoverDistance), 'm');
  summary('reference displacement', completed.map((entry) => entry.referenceDisplacement), 'm');
  summary('relative target travel', completed.map((entry) => entry.relativeTargetDisplacement), 'm');
  summary('reference target closure', completed.map((entry) => entry.referenceTargetClosure), 'm');
}

console.log(
  `TOTAL completed ${completedTotal}/${frozenStates * DELTAS.length}`
  + ` · reference moved ${referenceMovedTotal}/${completedTotal} (${pct(referenceMovedTotal, completedTotal)})`
  + ` · mover closed ${moverClosedTotal}/${completedTotal} (${pct(moverClosedTotal, completedTotal)})`,
);
console.log(
  `drift action/offset/reference ${actionChangesTotal}/${offsetChangesTotal}/${referenceChangesTotal}`
  + ` · identity failures ${identityFailures} · non-finite ${nonFiniteTotal}`,
);

if (
  frozenStates !== REQUIRED
  || scannedSeeds > MAX_SEEDS
  || completedTotal < 192
  || referenceMovedTotal / Math.max(1, completedTotal) < 0.95
  || moverClosedTotal / Math.max(1, completedTotal) < 0.90
  || !perAxisPassed
  || cloneFailures > 0
  || deterministicDifferences > 0
  || actionChangesTotal > 0
  || offsetChangesTotal > 0
  || referenceChangesTotal > 0
  || identityFailures > 0
  || nonFiniteTotal > 0
) process.exitCode = 1;
