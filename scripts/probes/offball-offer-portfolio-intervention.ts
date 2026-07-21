// O6 PAIRED OFFER-PORTFOLIO INTERVENTION (offline only).
//
// Same carrier and two movers; lower/higher carrier-bearing portfolios move
// through real Match.step, then each receiver gets a separately cloned forced
// ordinary pass through Oracle v2.
//   npx tsx scripts/probes/offball-offer-portfolio-intervention.ts [states] [seedOffset]
import {
  createOffBallOfferCommitment, evaluateOffBallOfferPortfolio,
  type OffBallOfferPortfolioPair,
} from '../../src/ai/offBallCoordination';
import {
  evaluateOffBallAffordances, type OffBallAffordance,
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
const OFF = Number(process.argv[3] ?? 27000);
const MAX_SEEDS = 256;
const SAMPLE_TICKS = Math.round(1 / DT);
const MOVE_STEPS = 90;
const COMMITMENT_TICKS = 90;
const REPLICATES = 4;
const MIN_BEARING_DELTA = Math.PI / 4;
const O6_NAMESPACE = 0x06000001;
const EPS = 1e-9;

type PortfolioKind = 'lower' | 'higher';
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

interface PortfolioOption {
  readonly playerGids: readonly [number, number];
  readonly offers: readonly [OffBallAffordance, OffBallAffordance];
  readonly pair: OffBallOfferPortfolioPair;
}

interface Intervention {
  readonly playerGids: readonly [number, number];
  readonly lower: PortfolioOption;
  readonly higher: PortfolioOption;
  readonly bearingDelta: number;
}

interface MovementSummary {
  readonly kind: PortfolioKind;
  readonly status: MovementStatus;
  readonly initialDistances: readonly [number, number];
  readonly finalDistances: readonly [number, number];
  readonly actualBearingSeparation: number | null;
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

const eligibleOffers = (values: readonly OffBallAffordance[]): readonly OffBallAffordance[] =>
  values.filter((value) => (
    value.candidate.id !== 'hold'
    && value.offsideMargin <= 0
    && value.opponentArrivalMargin > 0
    && [
      value.candidate.point.x,
      value.candidate.point.y,
      value.selfArrival,
      value.opponentArrivalMargin,
    ].every(Number.isFinite)
  )).sort((a, b) => a.candidate.id.localeCompare(b.candidate.id));

let portfolioFailures = 0;
let portfolioIdentityFailures = 0;
let nonFiniteFacts = 0;

const makePortfolioOption = (
  carrierGid: number,
  carrierPoint: Readonly<{ x: number; y: number }>,
  currentTick: number,
  left: OffBallAffordance,
  right: OffBallAffordance,
): PortfolioOption | null => {
  const leftCommitment = createOffBallOfferCommitment(
    left, currentTick, currentTick + COMMITMENT_TICKS,
  );
  const rightCommitment = createOffBallOfferCommitment(
    right, currentTick, currentTick + COMMITMENT_TICKS,
  );
  if (!leftCommitment || !rightCommitment) {
    portfolioFailures++;
    return null;
  }
  const portfolio = evaluateOffBallOfferPortfolio({
    carrierGid,
    carrierPoint,
    commitments: [leftCommitment, rightCommitment],
    currentTick,
  });
  if (!portfolio || portfolio.pairs.length !== 1) {
    portfolioFailures++;
    return null;
  }
  const pair = portfolio.pairs[0];
  const gids = [left.playerGid, right.playerGid] as const;
  if (
    portfolio.carrierGid !== carrierGid
    || portfolio.commitments.length !== 2
    || pair.leftPlayerGid !== gids[0]
    || pair.rightPlayerGid !== gids[1]
  ) {
    portfolioIdentityFailures++;
    return null;
  }
  const facts = [
    pair.targetDistance,
    pair.bearingSeparation,
    pair.arrivalTimeSeparation,
    pair.corridorSeparation,
  ];
  if (facts.some((value) => value === null || !Number.isFinite(value))) {
    nonFiniteFacts++;
    return null;
  }
  return { playerGids: gids, offers: [left, right], pair };
};

const interventionKey = (value: Intervention): string => [
  value.playerGids[0],
  value.playerGids[1],
  value.lower.offers[0].candidate.id,
  value.lower.offers[1].candidate.id,
  value.higher.offers[0].candidate.id,
  value.higher.offers[1].candidate.id,
].join(':');

const chooseIntervention = (
  match: Match,
  carrierGid: number,
  offersByPlayer: ReadonlyMap<number, readonly OffBallAffordance[]>,
): Intervention | null => {
  const players = [...offersByPlayer.keys()].sort((a, b) => a - b);
  let selected: Intervention | null = null;
  for (let leftIndex = 0; leftIndex < players.length; leftIndex++) {
    for (let rightIndex = leftIndex + 1; rightIndex < players.length; rightIndex++) {
      const leftGid = players[leftIndex];
      const rightGid = players[rightIndex];
      const options: PortfolioOption[] = [];
      for (const left of offersByPlayer.get(leftGid)!) {
        for (const right of offersByPlayer.get(rightGid)!) {
          const option = makePortfolioOption(
            carrierGid, match.ball.owner!.pos, match.simTick, left, right,
          );
          if (option !== null && option.pair.bearingSeparation !== null) options.push(option);
        }
      }
      for (const lower of options) {
        for (const higher of options) {
          const lowerBearing = lower.pair.bearingSeparation!;
          const higherBearing = higher.pair.bearingSeparation!;
          const bearingDelta = higherBearing - lowerBearing;
          if (
            bearingDelta + EPS < MIN_BEARING_DELTA
            || lower.offers[0].candidate.id === higher.offers[0].candidate.id
            || lower.offers[1].candidate.id === higher.offers[1].candidate.id
          ) continue;
          const candidate: Intervention = {
            playerGids: [leftGid, rightGid],
            lower,
            higher,
            bearingDelta,
          };
          if (
            selected === null
            || bearingDelta > selected.bearingDelta + EPS
            || (
              Math.abs(bearingDelta - selected.bearingDelta) <= EPS
              && interventionKey(candidate).localeCompare(interventionKey(selected)) < 0
            )
          ) selected = candidate;
        }
      }
    }
  }
  return selected;
};

const bearingSeparation = (
  carrier: Readonly<{ x: number; y: number }>,
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number | null => {
  const lx = left.x - carrier.x;
  const ly = left.y - carrier.y;
  const rx = right.x - carrier.x;
  const ry = right.y - carrier.y;
  if (Math.hypot(lx, ly) < EPS || Math.hypot(rx, ry) < EPS) return null;
  const raw = Math.abs(Math.atan2(ly, lx) - Math.atan2(ry, rx)) % (Math.PI * 2);
  return Math.min(raw, Math.PI * 2 - raw);
};

const runMovementBranch = (
  frozen: Match,
  carrierGid: number,
  option: PortfolioOption,
  kind: PortfolioKind,
): MovementBranch => {
  const branch = cloneSimulationState(frozen);
  const carrier = branch.allPlayers[carrierGid];
  const movers = option.playerGids.map((gid) => branch.allPlayers[gid]) as [
    typeof carrier, typeof carrier,
  ];
  const targets = option.offers.map((offer) => ({
    x: offer.candidate.point.x,
    y: offer.candidate.point.y,
  })) as [{ x: number; y: number }, { x: number; y: number }];
  const carrierRoster = carrier.rosterIdx;
  const moverRosters = movers.map((mover) => mover.rosterIdx);
  const initialDistances = movers.map((mover, index) => Math.hypot(
    mover.pos.x - targets[index].x, mover.pos.y - targets[index].y,
  )) as [number, number];

  carrier.action = { type: 'HoldPosition', scores: [] };
  carrier.decisionTimer = Number.POSITIVE_INFINITY;
  movers.forEach((mover, index) => {
    mover.action = { type: 'MoveToPoint', targetPos: targets[index], scores: [] };
    mover.decisionTimer = Number.POSITIVE_INFINITY;
  });

  let status: MovementStatus = 'completed';
  let targetChanges = 0;
  let unexpectedActionChanges = 0;
  let branchNonFinite = 0;
  for (let step = 0; step < MOVE_STEPS; step++) {
    if (branch.finished) {
      status = 'finishedEarly';
      break;
    }
    branch.step(DT);
    if ([
      carrier.pos.x, carrier.pos.y, branch.ball.pos.x, branch.ball.pos.y,
      ...movers.flatMap((mover) => [mover.pos.x, mover.pos.y, mover.vel.x, mover.vel.y]),
    ].some((value) => !Number.isFinite(value))) branchNonFinite++;
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
      carrier.sentOff
      || carrier.rosterIdx !== carrierRoster
      || movers.some((mover, index) => (
        mover.sentOff || mover.rosterIdx !== moverRosters[index]
      ))
    ) {
      status = 'removedOrSubstituted';
      break;
    }
    for (let index = 0; index < movers.length; index++) {
      const mover = movers[index];
      if (mover.action.type !== 'MoveToPoint') {
        unexpectedActionChanges++;
      } else if (
        mover.action.targetPos?.x !== targets[index].x
        || mover.action.targetPos?.y !== targets[index].y
      ) targetChanges++;
    }
    if (carrier.action.type !== 'HoldPosition' || unexpectedActionChanges > 0) {
      unexpectedActionChanges++;
      status = 'unexpectedInterventionChange';
      break;
    }
  }

  const finalDistances = movers.map((mover, index) => Math.hypot(
    mover.pos.x - targets[index].x, mover.pos.y - targets[index].y,
  )) as [number, number];
  return {
    match: branch,
    summary: {
      kind,
      status,
      initialDistances,
      finalDistances,
      actualBearingSeparation: bearingSeparation(carrier.pos, movers[0].pos, movers[1].pos),
      targetChanges,
      unexpectedActionChanges,
      nonFiniteFacts: branchNonFinite,
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

const movementStatuses = new Map<PortfolioKind, Map<MovementStatus, number>>([
  ['lower', new Map()],
  ['higher', new Map()],
]);
const outcomes = new Map<PortfolioKind, Map<RecordedOutcome, number>>([
  ['lower', new Map()],
  ['higher', new Map()],
]);
const coverage = new Map<PortfolioKind, number>([['lower', 0], ['higher', 0]]);
const exactlyOne = new Map<PortfolioKind, number>([['lower', 0], ['higher', 0]]);
const both = new Map<PortfolioKind, number>([['lower', 0], ['higher', 0]]);
const neither = new Map<PortfolioKind, number>([['lower', 0], ['higher', 0]]);
const opportunities = new Map<PortfolioKind, number>([['lower', 0], ['higher', 0]]);
const plannedBearingDeltas: number[] = [];
const plannedTargetDeltas: number[] = [];
const plannedArrivalDeltas: number[] = [];
const plannedCorridorDeltas: number[] = [];
const actualBearingDeltas: number[] = [];
let actualDirectionMatches = 0;
let frozenStates = 0;
let scannedSeeds = 0;
let jointlyCompleted = 0;
let moverInterventions = 0;
let moverClosures = 0;
let cloneFailures = 0;
let deterministicDifferences = 0;
let targetChanges = 0;
let unexpectedActionChanges = 0;
let movementNonFinite = 0;
let oracleForceFailures = 0;

for (let seed = OFF; seed < OFF + MAX_SEEDS && frozenStates < REQUIRED; seed++) {
  scannedSeeds++;
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  let acceptedThisSeed = false;
  while (!match.finished && !acceptedThisSeed) {
    match.step(DT);
    if (
      match.simTick % SAMPLE_TICKS !== 0
      || match.phase !== 'playing'
      || match.simTime > match.duration - 6
    ) continue;
    const carrier = match.ball.owner;
    if (
      !carrier || carrier.sentOff || carrier.role === 'GK'
      || carrier.action.type !== 'Dribble'
    ) continue;
    const attackingTeam = match.teams[carrier.side];
    const truth = capturePerceptionTruth(match);
    const profiles = profilesOf(match);
    const offersByPlayer = new Map<number, readonly OffBallAffordance[]>();
    for (const player of attackingTeam.players) {
      if (player.sentOff || player.role === 'GK' || player === carrier) continue;
      const values = evaluateOffBallAffordances({
        snapshot: oraclePerceptionSnapshot(truth, player.gid),
        playerGid: player.gid,
        carrierGid: carrier.gid,
        attackDir: attackingTeam.attackDir,
        reachProfiles: profiles,
      });
      if (!values) continue;
      const eligible = eligibleOffers(values);
      if (eligible.length >= 2) offersByPlayer.set(player.gid, eligible);
    }
    if (offersByPlayer.size < 2) continue;
    const intervention = chooseIntervention(match, carrier.gid, offersByPlayer);
    if (!intervention) continue;

    acceptedThisSeed = true;
    frozenStates++;
    plannedBearingDeltas.push(intervention.bearingDelta);
    plannedTargetDeltas.push(
      intervention.higher.pair.targetDistance - intervention.lower.pair.targetDistance,
    );
    plannedArrivalDeltas.push(
      intervention.higher.pair.arrivalTimeSeparation
      - intervention.lower.pair.arrivalTimeSeparation,
    );
    plannedCorridorDeltas.push(
      intervention.higher.pair.corridorSeparation
      - intervention.lower.pair.corridorSeparation,
    );

    const movement = new Map<PortfolioKind, MovementBranch>();
    for (const kind of ['lower', 'higher'] as const) {
      try {
        const option = intervention[kind];
        const first = runMovementBranch(match, carrier.gid, option, kind);
        const second = runMovementBranch(match, carrier.gid, option, kind);
        if (JSON.stringify(first.summary) !== JSON.stringify(second.summary)) {
          deterministicDifferences++;
        }
        movement.set(kind, first);
        const statusMap = movementStatuses.get(kind)!;
        statusMap.set(first.summary.status, (statusMap.get(first.summary.status) ?? 0) + 1);
        targetChanges += first.summary.targetChanges;
        unexpectedActionChanges += first.summary.unexpectedActionChanges;
        movementNonFinite += first.summary.nonFiniteFacts;
        if (first.summary.status === 'completed') {
          for (let index = 0; index < 2; index++) {
            moverInterventions++;
            if (first.summary.finalDistances[index] < first.summary.initialDistances[index]) {
              moverClosures++;
            }
          }
        }
      } catch {
        cloneFailures++;
      }
    }
    const lowerMove = movement.get('lower');
    const higherMove = movement.get('higher');
    if (
      !lowerMove || !higherMove
      || lowerMove.summary.status !== 'completed'
      || higherMove.summary.status !== 'completed'
    ) continue;
    jointlyCompleted++;
    const actualLower = lowerMove.summary.actualBearingSeparation;
    const actualHigher = higherMove.summary.actualBearingSeparation;
    if (actualLower === null || actualHigher === null) {
      movementNonFinite++;
    } else {
      const delta = actualHigher - actualLower;
      actualBearingDeltas.push(delta);
      if (delta > 0) actualDirectionMatches++;
    }

    for (let replicate = 0; replicate < REPLICATES; replicate++) {
      const intendedByKind = new Map<PortfolioKind, number>([['lower', 0], ['higher', 0]]);
      for (let receiverOrdinal = 0; receiverOrdinal < 2; receiverOrdinal++) {
        const receiverGid = intervention.playerGids[receiverOrdinal];
        const childSeed = hashSeed(
          O6_NAMESPACE, seed, match.simTick, receiverOrdinal, replicate,
        );
        for (const kind of ['lower', 'higher'] as const) {
          const branch = movement.get(kind)!.match;
          const input = {
            frozen: branch,
            passerGid: carrier.gid,
            targetGid: receiverGid,
            side: carrier.side as Side,
            branch: kind === 'lower' ? 'chosen' as const : 'alternative' as const,
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
          if (outcome === 'intendedReception') {
            intendedByKind.set(kind, intendedByKind.get(kind)! + 1);
          }
        }
      }
      for (const kind of ['lower', 'higher'] as const) {
        const intended = intendedByKind.get(kind)!;
        if (intended > 0) coverage.set(kind, coverage.get(kind)! + 1);
        if (intended === 0) neither.set(kind, neither.get(kind)! + 1);
        else if (intended === 1) exactlyOne.set(kind, exactlyOne.get(kind)! + 1);
        else both.set(kind, both.get(kind)! + 1);
      }
    }
  }
}

console.log(`O6 PAIRED OFFER-PORTFOLIO INTERVENTION · requested ${REQUIRED} · seed start ${OFF}`);
console.log(
  `frozen states ${frozenStates} · scanned independent seeds ${scannedSeeds}`
  + ` · jointly completed ${jointlyCompleted}`,
);
console.log(
  `portfolio evaluation/identity/non-finite failures `
  + `${portfolioFailures}/${portfolioIdentityFailures}/${nonFiniteFacts}`,
);
console.log(
  `clone/determinism/target/action/movement-non-finite/Oracle failures `
  + `${cloneFailures}/${deterministicDifferences}/${targetChanges}`
  + `/${unexpectedActionChanges}/${movementNonFinite}/${oracleForceFailures}`,
);
for (const kind of ['lower', 'higher'] as const) {
  console.log(`  ${kind.padEnd(6)} movement ${mapLine(movementStatuses.get(kind)!)}`);
}
summary('planned bearing delta', plannedBearingDeltas.map((value) => value * 180 / Math.PI), 'deg');
summary('actual bearing delta', actualBearingDeltas.map((value) => value * 180 / Math.PI), 'deg');
summary('target-distance delta', plannedTargetDeltas, 'm');
summary('arrival-separation delta', plannedArrivalDeltas, 's');
summary('corridor-separation delta', plannedCorridorDeltas, 'm');
console.log(
  `actual direction ${actualDirectionMatches}/${jointlyCompleted}`
  + ` (${pct(actualDirectionMatches, jointlyCompleted)})`
  + ` · mover closure ${moverClosures}/${moverInterventions}`
  + ` (${pct(moverClosures, moverInterventions)})`,
);

const portfolioReplicates = jointlyCompleted * REPLICATES;
for (const kind of ['lower', 'higher'] as const) {
  console.log(
    `  ${kind.padEnd(6)} opportunities ${opportunities.get(kind)}`
    + ` · outcomes ${mapLine(outcomes.get(kind)!)}`,
  );
  console.log(
    `         coverage ${coverage.get(kind)}/${portfolioReplicates}`
    + ` (${pct(coverage.get(kind)!, portfolioReplicates)})`
    + ` · neither/exactly-one/both ${neither.get(kind)}/${exactlyOne.get(kind)}/${both.get(kind)}`,
  );
}
const lowerCoverageRate = coverage.get('lower')! / Math.max(1, portfolioReplicates);
const higherCoverageRate = coverage.get('higher')! / Math.max(1, portfolioReplicates);
const lowerOpponentRate = (outcomes.get('lower')!.get('opponentInterception') ?? 0)
  / Math.max(1, opportunities.get('lower')!);
const higherOpponentRate = (outcomes.get('higher')!.get('opponentInterception') ?? 0)
  / Math.max(1, opportunities.get('higher')!);
const coverageDelta = higherCoverageRate - lowerCoverageRate;
const opponentDelta = higherOpponentRate - lowerOpponentRate;
console.log(
  `PRIMARY higher-lower coverage ${(coverageDelta * 100).toFixed(1)}pp`
  + ` · opponent-control ${(opponentDelta * 100).toFixed(1)}pp`,
);

const lowerCompleted = movementStatuses.get('lower')!.get('completed') ?? 0;
const higherCompleted = movementStatuses.get('higher')!.get('completed') ?? 0;
const completionDelta = Math.abs(lowerCompleted - higherCompleted) / Math.max(1, frozenStates);
const enoughOpportunities = opportunities.get('lower')! >= 96 * 2 * REPLICATES
  && opportunities.get('higher')! >= 96 * 2 * REPLICATES;
if (
  frozenStates !== REQUIRED
  || scannedSeeds > MAX_SEEDS
  || jointlyCompleted < 96
  || !enoughOpportunities
  || completionDelta > 0.05
  || portfolioFailures > 0
  || portfolioIdentityFailures > 0
  || nonFiniteFacts > 0
  || cloneFailures > 0
  || deterministicDifferences > 0
  || targetChanges > 0
  || unexpectedActionChanges > 0
  || movementNonFinite > 0
  || oracleForceFailures > 0
  || plannedBearingDeltas.some((value) => value + EPS < MIN_BEARING_DELTA)
  || actualDirectionMatches < jointlyCompleted * 0.75
  || moverClosures < moverInterventions * 0.95
  || coverageDelta < 0.05
  || opponentDelta > 0.05
) process.exitCode = 1;
