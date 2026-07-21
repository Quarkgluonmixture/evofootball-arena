// O1a MOVE-TO-POINT CLONE FEASIBILITY (offline mechanism only).
//
// Same frozen Match, five fixed world targets, real 1.5s continuation. This
// proves the generic primitive composes with the live loop; it never reads a
// football payoff or changes Match source.
//   npx tsx scripts/probes/offball-move-feasibility.ts [states] [seedOffset]
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
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED = Number(process.argv[2] ?? 64);
const OFF = Number(process.argv[3] ?? 20000);
const FORCE_STEPS = 90;
const SAMPLE_TICKS = Math.round(1 / DT);
const EPS = 1e-9;

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

interface BranchResult {
  readonly kind: BranchKind;
  readonly initialDistance: number;
  readonly finalDistance: number;
  readonly pathLength: number;
  readonly forwardDisplacement: number;
  readonly lateralDisplacement: number;
  readonly targetChanges: number;
  readonly unexpectedActionChanges: number;
  readonly interruption:
    | 'none'
    | 'becameController'
    | 'deadBallOrRestart'
    | 'removed'
    | 'substituted';
  readonly nonFiniteStates: number;
  readonly peakSpeedRatio: number;
  readonly finishedEarly: boolean;
}

interface Aggregate {
  n: number;
  closures: number;
  closedMetres: number;
  finalDistance: number;
  pathLength: number;
  forwardDisplacement: number;
  lateralDisplacement: number;
  peakSpeedRatio: number;
}

const aggregate = (): Aggregate => ({
  n: 0,
  closures: 0,
  closedMetres: 0,
  finalDistance: 0,
  pathLength: 0,
  forwardDisplacement: 0,
  lateralDisplacement: 0,
  peakSpeedRatio: 0,
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
  playerGid: number,
  target: OffBallCandidatePoint,
  kind: BranchKind,
  attackDir: 1 | -1,
): BranchResult => {
  const branch = cloneSimulationState(frozen);
  const player = branch.allPlayers[playerGid];
  const start = { x: player.pos.x, y: player.pos.y };
  const frozenTarget = { x: target.point.x, y: target.point.y };
  const initialDistance = Math.hypot(start.x - frozenTarget.x, start.y - frozenTarget.y);
  const initialRosterIdx = player.rosterIdx;
  player.action = { type: 'MoveToPoint', targetPos: frozenTarget, scores: [] };
  player.decisionTimer = Number.POSITIVE_INFINITY;

  let previous = { x: player.pos.x, y: player.pos.y };
  let pathLength = 0;
  let targetChanges = 0;
  let unexpectedActionChanges = 0;
  let interruption: BranchResult['interruption'] = 'none';
  let nonFiniteStates = 0;
  let peakSpeedRatio = 0;
  let finishedEarly = false;

  for (let step = 0; step < FORCE_STEPS; step++) {
    if (branch.finished) {
      finishedEarly = true;
      break;
    }
    branch.step(DT);
    pathLength += Math.hypot(player.pos.x - previous.x, player.pos.y - previous.y);
    previous = { x: player.pos.x, y: player.pos.y };
    if (player.action.type === 'MoveToPoint') {
      if (
        player.action.targetPos?.x !== frozenTarget.x ||
        player.action.targetPos?.y !== frozenTarget.y
      ) targetChanges++;
    } else {
      // Match may legitimately terminate the intervention: giveBall changes a
      // new controller to Dribble, restarts reset everybody, and removal or a
      // substitution replaces the player's current action. Do not overwrite
      // those football events, and do not count the missing targetPos as target
      // drift. Anything else remains an unexplained hard failure.
      if (branch.ball.owner === player && player.action.type === 'Dribble') {
        interruption = 'becameController';
      } else if (player.sentOff) {
        interruption = 'removed';
      } else if (player.rosterIdx !== initialRosterIdx) {
        interruption = 'substituted';
      } else if (branch.phase !== 'playing') {
        interruption = 'deadBallOrRestart';
      } else {
        unexpectedActionChanges++;
      }
    }
    const speed = Math.hypot(player.vel.x, player.vel.y);
    if (![player.pos.x, player.pos.y, player.vel.x, player.vel.y, player.topSpeed].every(Number.isFinite)) {
      nonFiniteStates++;
    }
    peakSpeedRatio = Math.max(peakSpeedRatio, speed / Math.max(player.topSpeed, EPS));
    if (interruption !== 'none' || unexpectedActionChanges > 0) break;
  }

  const finalDistance = Math.hypot(player.pos.x - frozenTarget.x, player.pos.y - frozenTarget.y);
  return {
    kind,
    initialDistance,
    finalDistance,
    pathLength,
    forwardDisplacement: (player.pos.x - start.x) * attackDir,
    lateralDisplacement: player.pos.y - start.y,
    targetChanges,
    unexpectedActionChanges,
    interruption,
    nonFiniteStates,
    peakSpeedRatio,
    finishedEarly,
  };
};

const totals = new Map<BranchKind, Aggregate>(BRANCHES.map((kind) => [kind, aggregate()]));
let frozenStates = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;
let targetChanges = 0;
let unexpectedActionChanges = 0;
const interruptions = new Map<BranchResult['interruption'], number>([
  ['none', 0],
  ['becameController', 0],
  ['deadBallOrRestart', 0],
  ['removed', 0],
  ['substituted', 0],
]);
let nonFiniteStates = 0;
let finishedEarly = 0;
let pathDiffersFromHold = 0;

for (let seed = OFF; frozenStates < REQUIRED && seed < OFF + 64; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });

  while (!match.finished && frozenStates < REQUIRED) {
    match.step(DT);
    if (
      match.simTick % SAMPLE_TICKS !== 0 ||
      match.phase !== 'playing' ||
      match.simTime > match.duration - 2
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff) continue;
    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const profiles = profilesOf(match);
    let selected: {
      playerGid: number;
      targets: Record<BranchKind, OffBallCandidatePoint>;
    } | null = null;

    for (const player of attackingTeam.players) {
      if (
        player.sentOff || player.role === 'GK' || player === carrier ||
        player.action.type !== 'SupportBallCarrier'
      ) continue;
      const input = {
        snapshot: oraclePerceptionSnapshot(truth, player.gid),
        playerGid: player.gid,
        carrierGid: carrier.gid,
        attackDir: attackingTeam.attackDir,
        reachProfiles: profiles,
      } as const;
      const values = evaluateOffBallAffordances(input);
      if (!values) continue;
      const forward = qualifyingPoint(values, 'forward');
      const lateral = qualifyingPoint(values, 'lateral');
      const backward = qualifyingPoint(values, 'backward');
      if (!forward || !lateral || !backward) continue;
      const legacyPoint = supportSpot(player, attackingTeam, match.ball);
      selected = {
        playerGid: player.gid,
        targets: {
          hold: {
            id: 'hold', point: { x: player.pos.x, y: player.pos.y }, sampleHorizon: 0,
            directionIndex: null, forwardDelta: 0, lateralDelta: 0,
          },
          legacy: {
            id: 'legacy', point: { x: legacyPoint.x, y: legacyPoint.y }, sampleHorizon: 0,
            directionIndex: null,
            forwardDelta: (legacyPoint.x - player.pos.x) * attackingTeam.attackDir,
            lateralDelta: legacyPoint.y - player.pos.y,
          },
          forward,
          lateral,
          backward,
        },
      };
      break;
    }
    if (!selected) continue;

    const results = new Map<BranchKind, BranchResult>();
    for (const kind of BRANCHES) {
      try {
        const first = runBranch(
          match, selected.playerGid, selected.targets[kind], kind, attackingTeam.attackDir,
        );
        const second = runBranch(
          match, selected.playerGid, selected.targets[kind], kind, attackingTeam.attackDir,
        );
        if (JSON.stringify(first) !== JSON.stringify(second)) deterministicDifferences++;
        results.set(kind, first);
        const sum = totals.get(kind)!;
        sum.n++;
        if (first.finalDistance < first.initialDistance) sum.closures++;
        sum.closedMetres += first.initialDistance - first.finalDistance;
        sum.finalDistance += first.finalDistance;
        sum.pathLength += first.pathLength;
        sum.forwardDisplacement += first.forwardDisplacement;
        sum.lateralDisplacement += Math.abs(first.lateralDisplacement);
        sum.peakSpeedRatio = Math.max(sum.peakSpeedRatio, first.peakSpeedRatio);
        targetChanges += first.targetChanges;
        unexpectedActionChanges += first.unexpectedActionChanges;
        interruptions.set(first.interruption, interruptions.get(first.interruption)! + 1);
        nonFiniteStates += first.nonFiniteStates;
        if (first.finishedEarly) finishedEarly++;
      } catch {
        cloneFailures++;
      }
    }
    const hold = results.get('hold');
    if (hold) {
      for (const kind of ['legacy', 'forward', 'lateral', 'backward'] as const) {
        const result = results.get(kind);
        if (result && (
          Math.abs(result.forwardDisplacement - hold.forwardDisplacement) > 1e-6 ||
          Math.abs(result.lateralDisplacement - hold.lateralDisplacement) > 1e-6
        )) pathDiffersFromHold++;
      }
    }
    frozenStates++;
  }
}

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const avg = (sum: number, whole: number): string => whole > 0 ? (sum / whole).toFixed(3) : 'n/a';

console.log(`O1a MOVE-TO-POINT CLONE FEASIBILITY · requested ${REQUIRED} · seed start ${OFF}`);
console.log(`frozen states ${frozenStates} · clone failures ${cloneFailures} · deterministic differences ${deterministicDifferences}`);
console.log(`target/unexpected-action/non-finite violations ${targetChanges}/${unexpectedActionChanges}/${nonFiniteStates} · finished early ${finishedEarly}`);
console.log(
  `interventions completed ${interruptions.get('none')}/${frozenStates * BRANCHES.length}`
  + ` · controller ${interruptions.get('becameController')}`
  + ` · dead/restart ${interruptions.get('deadBallOrRestart')}`
  + ` · removed ${interruptions.get('removed')}`
  + ` · substituted ${interruptions.get('substituted')}`,
);
console.log(`non-hold paths differing from hold ${pathDiffersFromHold}/${frozenStates * 4}`);
for (const kind of BRANCHES) {
  const sum = totals.get(kind)!;
  console.log(
    `  ${kind.padEnd(8)} n=${sum.n} · closure ${pct(sum.closures, sum.n)}`
    + ` · closed ${avg(sum.closedMetres, sum.n)}m · final ${avg(sum.finalDistance, sum.n)}m`
    + ` · path ${avg(sum.pathLength, sum.n)}m · Δforward ${avg(sum.forwardDisplacement, sum.n)}m`
    + ` · |Δlateral| ${avg(sum.lateralDisplacement, sum.n)}m · peak speed/top ${sum.peakSpeedRatio.toFixed(3)}`,
  );
}

const majorityClosure = (kind: BranchKind): boolean => {
  const value = totals.get(kind)!;
  return value.closures > value.n / 2;
};
if (
  frozenStates !== REQUIRED || cloneFailures > 0 || deterministicDifferences > 0 ||
  targetChanges > 0 || unexpectedActionChanges > 0 || nonFiniteStates > 0 || finishedEarly > 0 ||
  pathDiffersFromHold === 0 ||
  !majorityClosure('forward') || !majorityClosure('lateral') || !majorityClosure('backward')
) process.exitCode = 1;
