// O2a OFF-BALL OFFER-STATE ANATOMY (offline conditional mechanism only).
//
// Same frozen Match, five fixed mover targets, stable carrier decision held for
// 1.5s. Physical transitions remain categorical; only branches that preserve the
// same carrier receive a conditional pass-option vector.
//   npx tsx scripts/probes/offball-offer-state-anatomy.ts [states] [seedOffset]
import {
  evaluateOffBallAffordances, evaluateOffBallCandidate,
  type OffBallAffordance, type OffBallCandidatePoint,
} from '../../src/ai/offBallAffordance';
import { evaluatePassAffordance } from '../../src/ai/passAffordance';
import {
  comparePassNextStates, PASS_NEXT_STATE_DIMENSIONS, passNextStateValue,
  type PassNextStateValue, type PassValueRelation,
} from '../../src/ai/passValue';
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

const REQUIRED = Number(process.argv[2] ?? 128);
const OFF = Number(process.argv[3] ?? 21000);
const FORCE_STEPS = 90;
const SAMPLE_TICKS = Math.round(1 / DT);

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
const MOVEMENT_BRANCHES = ['forward', 'lateral', 'backward'] as const;

type BranchStatus =
  | 'offerState'
  | 'lostToOpponent'
  | 'lostToTeammate'
  | 'loose'
  | 'deadBallOrRestart'
  | 'moverRemovedOrSubstituted'
  | 'unexpectedInterventionChange'
  | 'finishedEarly';

interface ConditionalOfferState {
  readonly passValue: PassNextStateValue | null;
  readonly currentOpponentAccessMargin: number;
  readonly currentTeammateSpacing: number;
  readonly currentCarrierLaneClearance: number;
}

interface BranchResult {
  readonly kind: BranchKind;
  readonly status: BranchStatus;
  readonly targetChanges: number;
  readonly unexpectedActionChanges: number;
  readonly nonFiniteFacts: number;
  readonly pathLength: number;
  readonly staminaSpent: number;
  readonly conditional: ConditionalOfferState | null;
}

interface BranchAggregate {
  readonly status: Map<BranchStatus, number>;
  supported: number;
  pathLength: number;
  staminaSpent: number;
  opponentAccessMargin: number;
  teammateSpacing: number;
  carrierLaneClearance: number;
  readonly passSums: Record<Exclude<keyof PassNextStateValue, 'targetGid'>, number>;
}

interface RelationAggregate {
  supported: number;
  leftDominates: number;
  rightDominates: number;
  equivalent: number;
  tradeoff: number;
}

const branchAggregate = (): BranchAggregate => ({
  status: new Map<BranchStatus, number>(),
  supported: 0,
  pathLength: 0,
  staminaSpent: 0,
  opponentAccessMargin: 0,
  teammateSpacing: 0,
  carrierLaneClearance: 0,
  passSums: {
    arrivalMarginSeconds: 0,
    receiverTiming: 0,
    pressureRelief: 0,
    bodyReadiness: 0,
    progressionMetres: 0,
    lineBreakCount: 0,
    offsideSafety: 0,
    exitOptionCount: 0,
  },
});

const relationAggregate = (): RelationAggregate => ({
  supported: 0,
  leftDominates: 0,
  rightDominates: 0,
  equivalent: 0,
  tradeoff: 0,
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

const allFinite = (values: readonly number[]): boolean => values.every(Number.isFinite);

const captureConditional = (
  branch: Match,
  carrierGid: number,
  moverGid: number,
  attackDir: 1 | -1,
): ConditionalOfferState | null => {
  const truth = capturePerceptionTruth(branch);
  const profiles = profilesOf(branch);
  const pass = evaluatePassAffordance({
    snapshot: oraclePerceptionSnapshot(truth, carrierGid),
    passerGid: carrierGid,
    targetGid: moverGid,
    attackDir,
    reachProfiles: profiles,
  });
  const mover = branch.allPlayers[moverGid];
  const local = evaluateOffBallCandidate({
    snapshot: oraclePerceptionSnapshot(truth, moverGid),
    playerGid: moverGid,
    carrierGid,
    attackDir,
    reachProfiles: profiles,
  }, {
    id: 'terminal',
    point: { x: mover.pos.x, y: mover.pos.y },
    sampleHorizon: 0,
    directionIndex: null,
    forwardDelta: 0,
    lateralDelta: 0,
  });
  if (!pass || !local) return null;
  return {
    passValue: passNextStateValue(pass),
    currentOpponentAccessMargin: local.opponentArrivalMargin,
    currentTeammateSpacing: local.nearestTeammateDistanceAtArrival,
    currentCarrierLaneClearance: local.carrierLaneClearance,
  };
};

const runBranch = (
  frozen: Match,
  carrierGid: number,
  moverGid: number,
  target: OffBallCandidatePoint,
  kind: BranchKind,
  attackDir: 1 | -1,
): BranchResult => {
  const branch = cloneSimulationState(frozen);
  const carrier = branch.allPlayers[carrierGid];
  const mover = branch.allPlayers[moverGid];
  const initialRosterIdx = mover.rosterIdx;
  const initialStamina = mover.stamina;
  const frozenTarget = { x: target.point.x, y: target.point.y };

  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  mover.action = { type: 'MoveToPoint', targetPos: frozenTarget, scores: [] };
  mover.decisionTimer = Number.POSITIVE_INFINITY;

  let status: BranchStatus = 'offerState';
  let targetChanges = 0;
  let unexpectedActionChanges = 0;
  let nonFiniteFacts = 0;
  let pathLength = 0;
  let previous = { x: mover.pos.x, y: mover.pos.y };

  for (let step = 0; step < FORCE_STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    pathLength += Math.hypot(mover.pos.x - previous.x, mover.pos.y - previous.y);
    previous = { x: mover.pos.x, y: mover.pos.y };

    if (!allFinite([
      mover.pos.x, mover.pos.y, mover.vel.x, mover.vel.y, mover.stamina,
      carrier.pos.x, carrier.pos.y, carrier.vel.x, carrier.vel.y,
      branch.ball.pos.x, branch.ball.pos.y,
    ])) nonFiniteFacts++;

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
    if (mover.sentOff || mover.rosterIdx !== initialRosterIdx) {
      status = 'moverRemovedOrSubstituted';
      break;
    }

    if (mover.action.type === 'MoveToPoint') {
      if (
        mover.action.targetPos?.x !== frozenTarget.x ||
        mover.action.targetPos?.y !== frozenTarget.y
      ) targetChanges++;
    } else {
      unexpectedActionChanges++;
      status = 'unexpectedInterventionChange';
      break;
    }
    if (carrier.action.type !== 'Dribble') {
      unexpectedActionChanges++;
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  const conditional = status === 'offerState'
    ? captureConditional(branch, carrierGid, moverGid, attackDir)
    : null;
  if (conditional) {
    const passNumbers = conditional.passValue
      ? PASS_NEXT_STATE_DIMENSIONS.map((dimension) => conditional.passValue![dimension])
      : [];
    if (!allFinite([
      conditional.currentOpponentAccessMargin,
      conditional.currentTeammateSpacing,
      conditional.currentCarrierLaneClearance,
      ...passNumbers,
    ])) nonFiniteFacts++;
  }

  return {
    kind,
    status,
    targetChanges,
    unexpectedActionChanges,
    nonFiniteFacts,
    pathLength,
    staminaSpent: initialStamina - mover.stamina,
    conditional,
  };
};

const totals = new Map<BranchKind, BranchAggregate>(
  BRANCHES.map((kind) => [kind, branchAggregate()]),
);
const relations = new Map<(typeof MOVEMENT_BRANCHES)[number], RelationAggregate>(
  MOVEMENT_BRANCHES.map((kind) => [kind, relationAggregate()]),
);
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
      match.simTick % SAMPLE_TICKS !== 0 ||
      match.phase !== 'playing' ||
      match.simTime > match.duration - 2
    ) continue;
    const carrier = match.ball.owner;
    if (!carrier || carrier.sentOff || carrier.role === 'GK' || carrier.action.type !== 'Dribble') continue;
    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const profiles = profilesOf(match);
    let selected: {
      moverGid: number;
      targets: Record<BranchKind, OffBallCandidatePoint>;
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

    const results = new Map<BranchKind, BranchResult>();
    for (const kind of BRANCHES) {
      try {
        const first = runBranch(
          match, carrier.gid, selected.moverGid, selected.targets[kind], kind,
          attackingTeam.attackDir,
        );
        const second = runBranch(
          match, carrier.gid, selected.moverGid, selected.targets[kind], kind,
          attackingTeam.attackDir,
        );
        if (JSON.stringify(first) !== JSON.stringify(second)) deterministicDifferences++;
        results.set(kind, first);

        targetChanges += first.targetChanges;
        unexpectedActionChanges += first.unexpectedActionChanges;
        nonFiniteFacts += first.nonFiniteFacts;
        const sum = totals.get(kind)!;
        sum.status.set(first.status, (sum.status.get(first.status) ?? 0) + 1);
        sum.pathLength += first.pathLength;
        sum.staminaSpent += first.staminaSpent;
        if (first.conditional?.passValue) {
          sum.supported++;
          sum.opponentAccessMargin += first.conditional.currentOpponentAccessMargin;
          sum.teammateSpacing += first.conditional.currentTeammateSpacing;
          sum.carrierLaneClearance += first.conditional.currentCarrierLaneClearance;
          for (const dimension of PASS_NEXT_STATE_DIMENSIONS) {
            sum.passSums[dimension] += first.conditional.passValue[dimension];
          }
        }
      } catch {
        cloneFailures++;
      }
    }

    const hold = results.get('hold')?.conditional?.passValue;
    for (const kind of MOVEMENT_BRANCHES) {
      const candidate = results.get(kind)?.conditional?.passValue;
      if (!hold || !candidate) continue;
      const relation = comparePassNextStates(candidate, hold);
      const sum = relations.get(kind)!;
      sum.supported++;
      sum[relation]++;
    }
    frozenStates++;
  }
}

const pct = (part: number, whole: number): string =>
  whole > 0 ? `${(part / whole * 100).toFixed(1)}%` : 'n/a';
const avg = (sum: number, whole: number): string => whole > 0 ? (sum / whole).toFixed(3) : 'n/a';
const statusLine = (status: ReadonlyMap<BranchStatus, number>): string =>
  [...status.entries()].map(([name, count]) => `${name}=${count}`).join(' · ');

console.log(`O2a OFF-BALL OFFER-STATE ANATOMY · requested ${REQUIRED} · seed start ${OFF}`);
console.log(`frozen states ${frozenStates} · clone failures ${cloneFailures} · deterministic differences ${deterministicDifferences}`);
console.log(`target/unexpected-action/non-finite violations ${targetChanges}/${unexpectedActionChanges}/${nonFiniteFacts}`);
for (const kind of BRANCHES) {
  const sum = totals.get(kind)!;
  console.log(`  ${kind.padEnd(8)} ${statusLine(sum.status)}`);
  console.log(
    `           supported pass states ${sum.supported}/${REQUIRED}`
    + ` · path ${avg(sum.pathLength, REQUIRED)}m · stamina ${avg(sum.staminaSpent, REQUIRED)}`
    + ` · access margin ${avg(sum.opponentAccessMargin, sum.supported)}s`
    + ` · teammate spacing ${avg(sum.teammateSpacing, sum.supported)}m`
    + ` · lane ${avg(sum.carrierLaneClearance, sum.supported)}m`,
  );
  console.log(
    `           pass vector ${PASS_NEXT_STATE_DIMENSIONS.map((dimension) =>
      `${dimension}=${avg(sum.passSums[dimension], sum.supported)}`).join(' · ')}`,
  );
}
for (const kind of MOVEMENT_BRANCHES) {
  const sum = relations.get(kind)!;
  const nonEquivalent = sum.leftDominates + sum.rightDominates + sum.tradeoff;
  console.log(
    `  ${kind.padEnd(8)} vs hold · supported ${sum.supported}/${REQUIRED}`
    + ` · candidate/hold dominance ${pct(sum.leftDominates, sum.supported)}/${pct(sum.rightDominates, sum.supported)}`
    + ` · tradeoff ${pct(sum.tradeoff, sum.supported)} · equivalent ${pct(sum.equivalent, sum.supported)}`
    + ` · non-equivalent ${pct(nonEquivalent, sum.supported)}`,
  );
}

const relationGate = MOVEMENT_BRANCHES.every((kind) => {
  const value = relations.get(kind)!;
  const nonEquivalent = value.leftDominates + value.rightDominates + value.tradeoff;
  return value.supported >= REQUIRED / 2 && nonEquivalent >= value.supported / 2;
});
if (
  frozenStates !== REQUIRED || cloneFailures > 0 || deterministicDifferences > 0 ||
  targetChanges > 0 || unexpectedActionChanges > 0 || nonFiniteFacts > 0 || !relationGate
) process.exitCode = 1;
