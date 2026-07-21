// O4a OFFER MOVEMENT -> FORCED PASS -> FIRST TRANSITION (offline only).
//   npx tsx scripts/probes/offball-offer-to-reception.ts [states] [seedOffset]
import {
  evaluateOffBallAffordances, type OffBallAffordance, type OffBallCandidatePoint,
} from '../../src/ai/offBallAffordance';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
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
const MOVE_STEPS = 90;
const SAMPLE_TICKS = Math.round(1 / DT);
const O4_NAMESPACE = 0x04a00001;

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

const qualifyingPoint = (
  values: readonly OffBallAffordance[],
  wanted: Exclude<BranchKind, 'hold' | 'legacy'>,
): OffBallCandidatePoint | null => values
  .filter((value) => (
    sector(value) === wanted && value.offsideMargin <= 0 && value.opponentArrivalMargin > 0
  ))
  .sort((a, b) => a.selfArrival - b.selfArrival || a.candidate.id.localeCompare(b.candidate.id))[0]
  ?.candidate ?? null;

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

for (let seed = OFF; frozenStates < REQUIRED && seed < OFF + 128; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  while (!match.finished && frozenStates < REQUIRED) {
    match.step(DT);
    if (
      match.simTick % SAMPLE_TICKS !== 0 || match.phase !== 'playing' ||
      match.simTime > match.duration - 6
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff || carrier.role === 'GK' || carrier.action.type !== 'Dribble') continue;
    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const profiles = profilesOf(match);
    let selected: { moverGid: number; targets: Record<BranchKind, OffBallCandidatePoint> } | null = null;

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
      const forward = qualifyingPoint(values, 'forward');
      const lateral = qualifyingPoint(values, 'lateral');
      const backward = qualifyingPoint(values, 'backward');
      if (!forward || !lateral || !backward) continue;
      const legacyPoint = supportSpot(mover, attackingTeam, match.ball);
      selected = {
        moverGid: mover.gid,
        targets: {
          hold: {
            id: 'hold', point: { x: mover.pos.x, y: mover.pos.y }, sampleHorizon: 0,
            directionIndex: null, forwardDelta: 0, lateralDelta: 0,
          },
          legacy: {
            id: 'legacy', point: { x: legacyPoint.x, y: legacyPoint.y }, sampleHorizon: 0,
            directionIndex: null,
            forwardDelta: (legacyPoint.x - mover.pos.x) * attackingTeam.attackDir,
            lateralDelta: legacyPoint.y - mover.pos.y,
          },
          forward,
          lateral,
          backward,
        },
      };
      break;
    }
    if (!selected) continue;

    const childSeed = hashSeed(
      O4_NAMESPACE, seed, match.simTick, carrier.gid, selected.moverGid,
    );
    for (const kind of BRANCHES) {
      try {
        const first = runBranch(
          match, carrier.gid, selected.moverGid, selected.targets[kind], kind,
          carrier.side, childSeed,
        );
        const second = runBranch(
          match, carrier.gid, selected.moverGid, selected.targets[kind], kind,
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

const minimumForced = BRANCHES.every((kind) =>
  totals.get(kind)!.forced >= Math.min(64, REQUIRED));
const forceFailures = [...totals.values()].reduce((sum, value) => sum + value.forceFailures, 0);
if (
  frozenStates !== REQUIRED || cloneFailures > 0 || deterministicDifferences > 0 ||
  targetChanges > 0 || unexpectedActionChanges > 0 || nonFiniteFacts > 0 ||
  forceFailures > 0 || !minimumForced || maxIntendedRate - minIntendedRate < 0.05
) process.exitCode = 1;
