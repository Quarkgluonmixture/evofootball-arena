// H0 RECENT-HANDOFF CONTINUATION INTERVENTION (offline only).
//   npx tsx scripts/probes/offball-pass-handoff-continuation.ts [states] [seedOffset]
import {
  evaluateOffBallAffordances, type OffBallAffordance, type OffBallCandidatePoint,
} from '../../src/ai/offBallAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { hashSeed, Rng } from '../../src/utils/rng';
import {
  runOracleV2Branch, type FirstTransitionOutcome,
} from './oracle-v2';

const REQUIRED = Number(process.argv[2] ?? 128);
const OFF = Number(process.argv[3] ?? 29000);
const MAX_SEEDS = 256;
const MOVE_STEPS = 90;
const REPLICATES = 4;
const H0_NAMESPACE = 0x0a000001;

type BranchKind = 'hold' | 'continuation';
type MovementStatus =
  | 'completed'
  | 'loose'
  | 'lostToTeammate'
  | 'lostToOpponent'
  | 'deadBallOrRestart'
  | 'removedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';
type RecordedOutcome = FirstTransitionOutcome | 'censored';

interface MovementSummary {
  readonly kind: BranchKind;
  readonly status: MovementStatus;
  readonly initialDistance: number;
  readonly finalDistance: number;
  readonly forwardDisplacement: number;
  readonly targetChanges: number;
  readonly unexpectedActionChanges: number;
  readonly nonFiniteFacts: number;
}

interface MovementBranch {
  readonly summary: MovementSummary;
  readonly match: Match;
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

const completedPassKey = (
  pass: { passerGid: number; receiverGid: number; t: number },
): string => `${pass.passerGid}:${pass.receiverGid}:${pass.t}`;

const chooseForward = (values: readonly OffBallAffordance[]): OffBallAffordance | null =>
  values.filter((value) => (
    value.candidate.forwardDelta > 1e-6
    && value.offsideMargin <= 0
    && value.opponentArrivalMargin > 0
  )).sort((a, b) => (
    a.selfArrival - b.selfArrival || a.candidate.id.localeCompare(b.candidate.id)
  ))[0] ?? null;

const runMovementBranch = (
  frozen: Match,
  carrierGid: number,
  moverGid: number,
  target: OffBallCandidatePoint,
  kind: BranchKind,
  attackDir: 1 | -1,
): MovementBranch => {
  const branch = cloneSimulationState(frozen);
  const carrier = branch.allPlayers[carrierGid];
  const mover = branch.allPlayers[moverGid];
  const frozenTarget = { x: target.point.x, y: target.point.y };
  const initialCarrierRoster = carrier.rosterIdx;
  const initialMoverRoster = mover.rosterIdx;
  const startX = mover.pos.x;
  const initialDistance = Math.hypot(
    mover.pos.x - frozenTarget.x, mover.pos.y - frozenTarget.y,
  );

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  mover.action = { type: 'MoveToPoint', targetPos: frozenTarget, scores: [] };
  mover.decisionTimer = Number.POSITIVE_INFINITY;

  let status: MovementStatus = 'completed';
  let targetChanges = 0;
  let unexpectedActionChanges = 0;
  let nonFiniteFacts = 0;
  for (let step = 0; step < MOVE_STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    if ([
      carrier.pos.x, carrier.pos.y, mover.pos.x, mover.pos.y,
      mover.vel.x, mover.vel.y, branch.ball.pos.x, branch.ball.pos.y,
    ].some((value) => !Number.isFinite(value))) nonFiniteFacts++;
    if (branch.phase !== 'playing') {
      status = 'deadBallOrRestart';
      break;
    }
    if (branch.ball.owner !== carrier) {
      if (!branch.ball.owner) status = 'loose';
      else if (branch.ball.owner.side === carrier.side) status = 'lostToTeammate';
      else status = 'lostToOpponent';
      break;
    }
    if (
      carrier.sentOff || mover.sentOff
      || carrier.rosterIdx !== initialCarrierRoster
      || mover.rosterIdx !== initialMoverRoster
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    if (mover.action.type !== 'MoveToPoint') {
      unexpectedActionChanges++;
    } else if (
      mover.action.targetPos?.x !== frozenTarget.x
      || mover.action.targetPos?.y !== frozenTarget.y
    ) targetChanges++;
    if (carrier.action.type !== 'HoldPosition' || unexpectedActionChanges > 0) {
      unexpectedActionChanges++;
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  return {
    match: branch,
    summary: {
      kind,
      status,
      initialDistance,
      finalDistance: Math.hypot(
        mover.pos.x - frozenTarget.x, mover.pos.y - frozenTarget.y,
      ),
      forwardDisplacement: (mover.pos.x - startX) * attackDir,
      targetChanges,
      unexpectedActionChanges,
      nonFiniteFacts,
    },
  };
};

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const mean = (values: readonly number[]): number =>
  values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
const quantile = (values: readonly number[], q: number): number => {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)))];
};
const summary = (name: string, values: readonly number[], unit: string): void => {
  console.log(
    `  ${name.padEnd(24)} n=${values.length} · mean ${mean(values).toFixed(3)}${unit}`
    + ` · q10/q50/q90 ${quantile(values, 0.1).toFixed(3)}`
    + `/${quantile(values, 0.5).toFixed(3)}/${quantile(values, 0.9).toFixed(3)}${unit}`,
  );
};
const mapLine = <T extends string>(values: ReadonlyMap<T, number>): string =>
  [...values.entries()].map(([key, value]) => `${key}=${value}`).join(' · ');

const movementStatuses = new Map<BranchKind, Map<MovementStatus, number>>([
  ['hold', new Map()],
  ['continuation', new Map()],
]);
const outcomes = new Map<BranchKind, Map<RecordedOutcome, number>>([
  ['hold', new Map()],
  ['continuation', new Map()],
]);
const opportunities = new Map<BranchKind, number>([['hold', 0], ['continuation', 0]]);
const movementForward = new Map<BranchKind, number[]>([['hold', []], ['continuation', []]]);
const candidateMargins: number[] = [];
const candidateSelfArrivals: number[] = [];
const candidateForwardDeltas: number[] = [];
const passTimeForwardDeltas: number[] = [];
let positivePassTimeForwardDelta = 0;
let continuationClosures = 0;
let continuationCompleted = 0;
let frozenStates = 0;
let scannedSeeds = 0;
let jointlyCompleted = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;
let targetChanges = 0;
let unexpectedActionChanges = 0;
let nonFiniteFacts = 0;
let oracleForceFailures = 0;

for (let seed = OFF; seed < OFF + MAX_SEEDS && frozenStates < REQUIRED; seed++) {
  scannedSeeds++;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 300,
  });
  let previousPassKey = match.lastCompletedPass
    ? completedPassKey(match.lastCompletedPass)
    : null;
  let acceptedThisSeed = false;

  while (!match.finished && !acceptedThisSeed) {
    match.step(DT);
    const completed = match.lastCompletedPass;
    const passKey = completed ? completedPassKey(completed) : null;
    if (!completed || passKey === previousPassKey) continue;
    previousPassKey = passKey;
    if (match.phase !== 'playing' || match.simTime > match.duration - 6) continue;
    const mover = match.allPlayers[completed.passerGid];
    const carrier = match.allPlayers[completed.receiverGid];
    if (
      !mover || !carrier || mover.side !== carrier.side
      || mover.role === 'GK' || carrier.role === 'GK'
      || mover.sentOff || carrier.sentOff
      || match.ball.owner !== carrier
      || carrier.action.type !== 'Dribble'
    ) continue;

    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const values = evaluateOffBallAffordances({
      snapshot: oraclePerceptionSnapshot(truth, mover.gid),
      playerGid: mover.gid,
      carrierGid: carrier.gid,
      attackDir: attackingTeam.attackDir,
      reachProfiles: profilesOf(match),
    });
    if (!values) continue;
    const hold = values.find((value) => value.candidate.id === 'hold') ?? null;
    const continuation = chooseForward(values);
    if (!hold || !continuation) continue;

    acceptedThisSeed = true;
    frozenStates++;
    candidateMargins.push(continuation.opponentArrivalMargin);
    candidateSelfArrivals.push(continuation.selfArrival);
    candidateForwardDeltas.push(continuation.candidate.forwardDelta);

    const movement = new Map<BranchKind, MovementBranch>();
    for (const kind of ['hold', 'continuation'] as const) {
      try {
        const target = kind === 'hold' ? hold.candidate : continuation.candidate;
        const first = runMovementBranch(
          match, carrier.gid, mover.gid, target, kind, attackingTeam.attackDir,
        );
        const second = runMovementBranch(
          match, carrier.gid, mover.gid, target, kind, attackingTeam.attackDir,
        );
        if (JSON.stringify(first.summary) !== JSON.stringify(second.summary)) {
          deterministicDifferences++;
        }
        movement.set(kind, first);
        const statusMap = movementStatuses.get(kind)!;
        statusMap.set(first.summary.status, (statusMap.get(first.summary.status) ?? 0) + 1);
        targetChanges += first.summary.targetChanges;
        unexpectedActionChanges += first.summary.unexpectedActionChanges;
        nonFiniteFacts += first.summary.nonFiniteFacts;
        if (first.summary.status === 'completed') {
          movementForward.get(kind)!.push(first.summary.forwardDisplacement);
          if (kind === 'continuation') {
            continuationCompleted++;
            if (first.summary.finalDistance < first.summary.initialDistance) {
              continuationClosures++;
            }
          }
        }
      } catch {
        cloneFailures++;
      }
    }

    const holdMove = movement.get('hold');
    const continuationMove = movement.get('continuation');
    if (
      !holdMove || !continuationMove
      || holdMove.summary.status !== 'completed'
      || continuationMove.summary.status !== 'completed'
    ) continue;
    jointlyCompleted++;
    const passTimeForwardDelta = continuationMove.summary.forwardDisplacement
      - holdMove.summary.forwardDisplacement;
    passTimeForwardDeltas.push(passTimeForwardDelta);
    if (passTimeForwardDelta > 0) positivePassTimeForwardDelta++;

    for (let replicate = 0; replicate < REPLICATES; replicate++) {
      const childSeed = hashSeed(H0_NAMESPACE, seed, match.simTick, replicate);
      for (const kind of ['hold', 'continuation'] as const) {
        const input = {
          frozen: movement.get(kind)!.match,
          passerGid: carrier.gid,
          targetGid: mover.gid,
          side: carrier.side as Side,
          branch: kind === 'hold' ? 'chosen' as const : 'alternative' as const,
          childRngState: childSeed,
          includeTransitionDiagnostic: false,
        };
        const first = runOracleV2Branch(input);
        const second = runOracleV2Branch(input);
        if (JSON.stringify(first) !== JSON.stringify(second)) deterministicDifferences++;
        if (!first.ok || first.record.firstTransition.status === 'forceFailure') {
          oracleForceFailures++;
          continue;
        }
        opportunities.set(kind, opportunities.get(kind)! + 1);
        const outcome: RecordedOutcome = first.record.firstTransition.status === 'censored'
          ? 'censored'
          : first.record.firstTransition.outcome!;
        const outcomeMap = outcomes.get(kind)!;
        outcomeMap.set(outcome, (outcomeMap.get(outcome) ?? 0) + 1);
      }
    }
  }
}

console.log(`H0 RECENT-HANDOFF CONTINUATION · requested ${REQUIRED} · seed start ${OFF}`);
console.log(
  `frozen states ${frozenStates} · scanned independent seeds ${scannedSeeds}`
  + ` · jointly completed ${jointlyCompleted}`,
);
console.log(
  `clone/determinism/target/action/non-finite/Oracle failures `
  + `${cloneFailures}/${deterministicDifferences}/${targetChanges}`
  + `/${unexpectedActionChanges}/${nonFiniteFacts}/${oracleForceFailures}`,
);
for (const kind of ['hold', 'continuation'] as const) {
  console.log(`  ${kind.padEnd(12)} movement ${mapLine(movementStatuses.get(kind)!)}`);
}
summary('candidate forward delta', candidateForwardDeltas, 'm');
summary('candidate self arrival', candidateSelfArrivals, 's');
summary('candidate opp margin', candidateMargins, 's');
summary('hold movement', movementForward.get('hold')!, 'm');
summary('continuation movement', movementForward.get('continuation')!, 'm');
summary('pass-time forward delta', passTimeForwardDeltas, 'm');
console.log(
  `positive pass-time forward delta ${positivePassTimeForwardDelta}/${jointlyCompleted}`
  + ` (${pct(positivePassTimeForwardDelta, jointlyCompleted)})`
  + ` · continuation target closure ${continuationClosures}/${continuationCompleted}`
  + ` (${pct(continuationClosures, continuationCompleted)})`,
);
for (const kind of ['hold', 'continuation'] as const) {
  console.log(
    `  ${kind.padEnd(12)} opportunities ${opportunities.get(kind)}`
    + ` · outcomes ${mapLine(outcomes.get(kind)!)}`,
  );
}

const intendedRate = (kind: BranchKind): number =>
  (outcomes.get(kind)!.get('intendedReception') ?? 0) / Math.max(1, opportunities.get(kind)!);
const opponentRate = (kind: BranchKind): number =>
  (outcomes.get(kind)!.get('opponentInterception') ?? 0) / Math.max(1, opportunities.get(kind)!);
const intendedDelta = intendedRate('continuation') - intendedRate('hold');
const opponentDelta = opponentRate('continuation') - opponentRate('hold');
console.log(
  `PRIMARY continuation-hold intended ${(intendedDelta * 100).toFixed(1)}pp`
  + ` · opponent-control ${(opponentDelta * 100).toFixed(1)}pp`,
);

const holdCompleted = movementStatuses.get('hold')!.get('completed') ?? 0;
const continuedCompleted = movementStatuses.get('continuation')!.get('completed') ?? 0;
const completionDelta = Math.abs(holdCompleted - continuedCompleted) / Math.max(1, frozenStates);
if (
  frozenStates !== REQUIRED
  || scannedSeeds > MAX_SEEDS
  || jointlyCompleted < 96
  || opportunities.get('hold')! < 96 * REPLICATES
  || opportunities.get('continuation')! < 96 * REPLICATES
  || completionDelta > 0.05
  || cloneFailures > 0
  || deterministicDifferences > 0
  || targetChanges > 0
  || unexpectedActionChanges > 0
  || nonFiniteFacts > 0
  || oracleForceFailures > 0
  || continuationClosures < continuationCompleted * 0.95
  || positivePassTimeForwardDelta < jointlyCompleted * 0.90
  || intendedDelta < 0.05
  || opponentDelta > 0.05
) process.exitCode = 1;
