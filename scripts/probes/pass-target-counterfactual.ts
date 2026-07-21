// Probe: PASS-TARGET COUNTERFACTUAL PAYOFF (offline oracle, layer 4).
// When live AI launches an ordinary open-play pass, retain the immediately
// pre-decision state. If S7 says the chosen target is Pareto-dominated, clone
// that same state and force two symmetric branches: chosen target vs each
// unambiguously better target. Both call the same performPass with the same RNG
// state, then roll 3 seconds. The live sim never reads these branches.
//   npx tsx scripts/probes/pass-target-counterfactual.ts [matches] [seedOffset] [horizonSeconds]
import { evaluatePassAffordance, type KnownReachProfile } from '../../src/ai/passAffordance';
import {
  comparePassNextStates, passNextStateValue, type PassNextStateValue,
} from '../../src/ai/passValue';
import { capturePerceptionTruth, oraclePerceptionSnapshot } from '../../src/ai/perceptionSnapshot';
import { laneOpenness } from '../../src/ai/perception';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import {
  compareLegacyPassPayoffs as compareOutcomes,
  type PayoffRelation as OutcomeRelation,
} from './pass-payoff-relation';

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng),
    squad: randomSquad(rng),
  };
};

const N = Number(process.argv[2] ?? 120);
const OFF = Number(process.argv[3] ?? 0);
const requestedHorizon = Number(process.argv[4] ?? 3);
const ROLLOUT_SECONDS = Number.isFinite(requestedHorizon)
  ? Math.max(1, requestedHorizon)
  : 3;
const ROLLOUT_STEPS = Math.max(1, Math.round(ROLLOUT_SECONDS / DT));

interface RolloutOutcome {
  /** +1 own team possession, 0 unresolved, −1 opponent possession at horizon. */
  possession: number;
  goalDelta: number;
  xgDelta: number;
  progressionMetres: number;
  exitOptionCount: number;
}

type PassResolution = 'target' | 'teammate' | 'opponent' | 'deadBall' | 'other' | 'unresolved';
type FirstController = 'target' | 'teammate' | 'opponent' | 'none';

interface RolloutAnatomy {
  resolution: PassResolution;
  firstController: FirstController;
  firstControlSeconds: number | null;
  ownMiscontrols: number;
  /** Physical ball owner at 1/2/3s: +1 own, 0 free, -1 opponent. */
  ownerAtSeconds: readonly [number, number, number];
}

interface RolloutResult {
  outcome: RolloutOutcome;
  anatomy: RolloutAnatomy;
}

type OutcomeDimension = keyof RolloutOutcome;
const OUTCOME_DIMENSIONS: readonly OutcomeDimension[] = [
  'possession', 'goalDelta', 'xgDelta', 'progressionMetres', 'exitOptionCount',
];
const profilesOf = (match: Match): Map<number, KnownReachProfile> => {
  const profiles = new Map<number, KnownReachProfile>();
  for (const player of match.allPlayers) {
    if (player.sentOff) continue;
    profiles.set(player.gid, {
      topSpeed: player.topSpeed,
      accel: player.accel,
      dribbling: player.attrs.dribbling,
    });
  }
  return profiles;
};

const passValues = (match: Match, passerGid: number): PassNextStateValue[] => {
  const passer = match.allPlayers[passerGid];
  const truth = capturePerceptionTruth(match);
  const snapshot = oraclePerceptionSnapshot(truth, passerGid);
  const profiles = profilesOf(match);
  const values: PassNextStateValue[] = [];
  for (const target of match.teams[passer.side].players) {
    if (target.sentOff || target.gid === passerGid) continue;
    const affordance = evaluatePassAffordance({
      snapshot,
      passerGid,
      targetGid: target.gid,
      attackDir: match.teams[passer.side].attackDir,
      reachProfiles: profiles,
    });
    if (!affordance) continue;
    const value = passNextStateValue(affordance);
    if (value) values.push(value);
  }
  return values;
};

const xgFor = (match: Match, side: Side): number => match.shotLog
  .filter((shot) => shot.side === side)
  .reduce((sum, shot) => sum + shot.xg, 0);

const optionCount = (match: Match, side: Side): number => {
  const owner = match.ball.owner;
  if (!owner || owner.side !== side) return 0;
  const opponents = match.teams[1 - side].players;
  let options = 0;
  for (const teammate of match.teams[side].players) {
    if (teammate.sentOff || teammate.gid === owner.gid) continue;
    if (laneOpenness(owner.pos, teammate.pos, opponents) >= 0.6) options++;
  }
  return options;
};

const rollout = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  side: Side,
): RolloutResult | null => {
  const branch = cloneSimulationState(frozen);
  const passer = branch.allPlayers[passerGid];
  const target = branch.allPlayers[targetGid];
  if (branch.phase !== 'playing' || branch.ball.owner !== passer || passer.kickCooldown > 0) return null;

  const startX = branch.teams[side].localX(branch.ball.pos.x);
  const score0 = branch.score[side] - branch.score[1 - side];
  const xg0 = xgFor(branch, side) - xgFor(branch, (1 - side) as Side);
  const interceptions0 = branch.teams[1 - side].stats.interceptions;
  const miscontrols0 = branch.teams[side].stats.miscontrols;
  const kickTime = branch.simTime;
  branch.performPass(passer, target);
  if (branch.pendingPass?.targetGid !== targetGid) return null;
  let resolution: PassResolution = 'unresolved';
  let firstController: FirstController = 'none';
  let firstControlSeconds: number | null = null;
  const ownerAtSeconds: [number, number, number] = [0, 0, 0];
  for (let step = 0; step < ROLLOUT_STEPS && !branch.finished; step++) {
    branch.step(DT);
    const owner = branch.ball.owner;
    if (firstController === 'none' && owner !== null) {
      firstController = owner.side !== side
        ? 'opponent'
        : owner.gid === targetGid ? 'target' : 'teammate';
      firstControlSeconds = branch.simTime - kickTime;
    }
    if (resolution === 'unresolved' && branch.pendingPass === null) {
      const completed = branch.lastCompletedPass;
      if (completed && completed.passerGid === passerGid && completed.t >= kickTime) {
        resolution = completed.receiverGid === targetGid ? 'target' : 'teammate';
      } else if (branch.teams[1 - side].stats.interceptions > interceptions0) {
        resolution = 'opponent';
      } else if (branch.phase !== 'playing') {
        resolution = 'deadBall';
      } else {
        resolution = 'other';
      }
    }
    if (step === 59 || step === 119 || step === 179) {
      const index = step === 59 ? 0 : step === 119 ? 1 : 2;
      ownerAtSeconds[index] = owner === null ? 0 : owner.side === side ? 1 : -1;
    }
  }

  return {
    outcome: {
      possession: branch.possessionSide === side
        ? 1
        : branch.possessionSide === 1 - side ? -1 : 0,
      goalDelta: (branch.score[side] - branch.score[1 - side]) - score0,
      xgDelta: (xgFor(branch, side) - xgFor(branch, (1 - side) as Side)) - xg0,
      progressionMetres: branch.teams[side].localX(branch.ball.pos.x) - startX,
      exitOptionCount: optionCount(branch, side),
    },
    anatomy: {
      resolution,
      firstController,
      firstControlSeconds,
      ownMiscontrols: branch.teams[side].stats.miscontrols - miscontrols0,
      ownerAtSeconds,
    },
  };
};

interface AnatomyAggregate {
  n: number;
  resolutions: Record<PassResolution, number>;
  firstControllers: Record<FirstController, number>;
  firstControlSeconds: number;
  firstControlCount: number;
  ownMiscontrols: number;
  ownerAtSeconds: {
    own: [number, number, number];
    opponent: [number, number, number];
    free: [number, number, number];
  };
}

const anatomyAggregate = (): AnatomyAggregate => ({
  n: 0,
  resolutions: { target: 0, teammate: 0, opponent: 0, deadBall: 0, other: 0, unresolved: 0 },
  firstControllers: { target: 0, teammate: 0, opponent: 0, none: 0 },
  firstControlSeconds: 0,
  firstControlCount: 0,
  ownMiscontrols: 0,
  ownerAtSeconds: {
    own: [0, 0, 0],
    opponent: [0, 0, 0],
    free: [0, 0, 0],
  },
});

const addAnatomy = (aggregate: AnatomyAggregate, anatomy: RolloutAnatomy): void => {
  aggregate.n++;
  aggregate.resolutions[anatomy.resolution]++;
  aggregate.firstControllers[anatomy.firstController]++;
  if (anatomy.firstControlSeconds !== null) {
    aggregate.firstControlSeconds += anatomy.firstControlSeconds;
    aggregate.firstControlCount++;
  }
  aggregate.ownMiscontrols += anatomy.ownMiscontrols;
  for (let i = 0; i < 3; i++) {
    if (anatomy.ownerAtSeconds[i] > 0) aggregate.ownerAtSeconds.own[i]++;
    else if (anatomy.ownerAtSeconds[i] < 0) aggregate.ownerAtSeconds.opponent[i]++;
    else aggregate.ownerAtSeconds.free[i]++;
  }
};

type FirstControlStratum =
  | 'bothTarget'
  | 'alternativeTargetChosenOpponent'
  | 'alternativeOpponentChosenTarget'
  | 'bothOpponent'
  | 'other';

interface StratumMetric {
  n: number;
  alternativeDominates: number;
  chosenDominates: number;
  alternativeOwnPossession: number;
  chosenOwnPossession: number;
  possessionDelta: number;
  progressionDelta: number;
  xgDelta: number;
}

const stratumMetric = (): StratumMetric => ({
  n: 0,
  alternativeDominates: 0,
  chosenDominates: 0,
  alternativeOwnPossession: 0,
  chosenOwnPossession: 0,
  possessionDelta: 0,
  progressionDelta: 0,
  xgDelta: 0,
});

const firstControlStratum = (
  chosen: FirstController,
  alternative: FirstController,
): FirstControlStratum => {
  if (chosen === 'target' && alternative === 'target') return 'bothTarget';
  if (chosen === 'opponent' && alternative === 'target') return 'alternativeTargetChosenOpponent';
  if (chosen === 'target' && alternative === 'opponent') return 'alternativeOpponentChosenTarget';
  if (chosen === 'opponent' && alternative === 'opponent') return 'bothOpponent';
  return 'other';
};

const relationCounts: Record<OutcomeRelation, number> = {
  alternativeDominates: 0,
  chosenDominates: 0,
  equivalent: 0,
  tradeoff: 0,
};
const deltaSums: RolloutOutcome = {
  possession: 0,
  goalDelta: 0,
  xgDelta: 0,
  progressionMetres: 0,
  exitOptionCount: 0,
};
let dominatedChoices = 0;
let rolloutPairs = 0;
let forceFailures = 0;
let chosenPossession = 0;
let alternativePossession = 0;
const anatomy = {
  chosen: anatomyAggregate(),
  alternative: anatomyAggregate(),
};
const strata: Record<FirstControlStratum, StratumMetric> = {
  bothTarget: stratumMetric(),
  alternativeTargetChosenOpponent: stratumMetric(),
  alternativeOpponentChosenTarget: stratumMetric(),
  bothOpponent: stratumMetric(),
  other: stratumMetric(),
};

for (let seed = OFF; seed < OFF + N; seed++) {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 240,
  });
  let previousPass = match.pendingPass;

  while (!match.finished) {
    const owner = match.phase === 'playing' ? match.ball.owner : null;
    const frozen = owner && owner.decisionTimer <= 0 && owner.kickCooldown <= 0
      ? cloneSimulationState(match)
      : null;
    const frozenOwnerGid = owner?.gid ?? null;

    match.step(DT);
    const pass = match.pendingPass;
    const freshOrdinary = pass !== previousPass
      && pass
      && match.lastPassKind?.kind === 'pass'
      && match.lastPassKind.t === pass.t
      && frozen
      && frozen.phase === 'playing'
      && frozenOwnerGid === pass.passerGid;

    if (freshOrdinary) {
      const values = passValues(frozen, pass.passerGid);
      const chosen = values.find((value) => value.targetGid === pass.targetGid);
      if (chosen) {
        const alternatives = values.filter((value) =>
          value.targetGid !== chosen.targetGid
          && comparePassNextStates(value, chosen) === 'leftDominates');
        if (alternatives.length > 0) {
          dominatedChoices++;
          const side = frozen.allPlayers[pass.passerGid].side;
          const chosenResult = rollout(frozen, pass.passerGid, pass.targetGid, side);
          if (!chosenResult) {
            forceFailures += alternatives.length;
          } else {
            for (const alternative of alternatives) {
              const alternativeResult = rollout(
                frozen, pass.passerGid, alternative.targetGid, side,
              );
              if (!alternativeResult) {
                forceFailures++;
                continue;
              }
              const chosenOutcome = chosenResult.outcome;
              const alternativeOutcome = alternativeResult.outcome;
              rolloutPairs++;
              addAnatomy(anatomy.chosen, chosenResult.anatomy);
              addAnatomy(anatomy.alternative, alternativeResult.anatomy);
              const relation = compareOutcomes(alternativeOutcome, chosenOutcome);
              relationCounts[relation]++;
              const stratum = strata[firstControlStratum(
                chosenResult.anatomy.firstController,
                alternativeResult.anatomy.firstController,
              )];
              stratum.n++;
              if (relation === 'alternativeDominates') stratum.alternativeDominates++;
              if (relation === 'chosenDominates') stratum.chosenDominates++;
              if (alternativeOutcome.possession === 1) stratum.alternativeOwnPossession++;
              if (chosenOutcome.possession === 1) stratum.chosenOwnPossession++;
              stratum.possessionDelta += alternativeOutcome.possession - chosenOutcome.possession;
              stratum.progressionDelta += alternativeOutcome.progressionMetres - chosenOutcome.progressionMetres;
              stratum.xgDelta += alternativeOutcome.xgDelta - chosenOutcome.xgDelta;
              if (chosenOutcome.possession === 1) chosenPossession++;
              if (alternativeOutcome.possession === 1) alternativePossession++;
              for (const dimension of OUTCOME_DIMENSIONS) {
                deltaSums[dimension] += alternativeOutcome[dimension] - chosenOutcome[dimension];
              }
            }
          }
        }
      }
    }
    previousPass = pass;
  }
}

const pct = (value: number, denominator: number): string =>
  `${((value / Math.max(denominator, 1)) * 100).toFixed(1)}%`;
const meanDelta = (dimension: OutcomeDimension): string =>
  (deltaSums[dimension] / Math.max(rolloutPairs, 1)).toFixed(3);

console.log(`n=${N} (seeds ${OFF}-${OFF + N - 1})   dominated live choices ${dominatedChoices}`);
console.log(`paired ${ROLLOUT_SECONDS.toFixed(1)}s rollouts ${rolloutPairs}, force failures ${forceFailures}`);
console.log('Each pair starts from one pre-decision clone and identical RNG; only pass target differs.');
console.log('\nrollout Pareto relation (alternative vs chosen):');
for (const relation of Object.keys(relationCounts) as OutcomeRelation[]) {
  console.log(`  ${relation.padEnd(21)} ${relationCounts[relation].toString().padStart(5)}  ${pct(relationCounts[relation], rolloutPairs)}`);
}
console.log('\npaired mean delta (alternative − chosen; larger is better):');
console.log(`  possession ${meanDelta('possession')} · goals ${meanDelta('goalDelta')} · xG ${meanDelta('xgDelta')}`);
console.log(`  progression ${meanDelta('progressionMetres')}m · exit options ${meanDelta('exitOptionCount')}`);
console.log(`  own possession at ${ROLLOUT_SECONDS.toFixed(1)}s: chosen ${pct(chosenPossession, rolloutPairs)} → alternative ${pct(alternativePossession, rolloutPairs)}`);

console.log('\npass-resolution anatomy (diagnostic, not a new S7 dimension):');
for (const branch of ['chosen', 'alternative'] as const) {
  const metric = anatomy[branch];
  const resolutions = (Object.keys(metric.resolutions) as PassResolution[])
    .map((kind) => `${kind} ${pct(metric.resolutions[kind], metric.n)}`)
    .join(' · ');
  const controls = (Object.keys(metric.firstControllers) as FirstController[])
    .map((kind) => `${kind} ${pct(metric.firstControllers[kind], metric.n)}`)
    .join(' · ');
  const meanControl = metric.firstControlSeconds / Math.max(metric.firstControlCount, 1);
  const meanMiscontrols = metric.ownMiscontrols / Math.max(metric.n, 1);
  console.log(`  ${branch}: resolution ${resolutions}`);
  console.log(`    first controller ${controls} · mean ${meanControl.toFixed(3)}s · own miscontrols ${meanMiscontrols.toFixed(3)}/branch`);
  for (let second = 0; second < 3; second++) {
    console.log(
      `    physical owner ${second + 1}s: own ${pct(metric.ownerAtSeconds.own[second], metric.n)} · `
      + `opponent ${pct(metric.ownerAtSeconds.opponent[second], metric.n)} · `
      + `free ${pct(metric.ownerAtSeconds.free[second], metric.n)}`,
    );
  }
}

console.log('\npaired payoff by first physical controller:');
for (const name of Object.keys(strata) as FirstControlStratum[]) {
  const metric = strata[name];
  if (metric.n === 0) continue;
  console.log(
    `  ${name.padEnd(34)} n=${metric.n.toString().padStart(4)} · `
    + `alt/chosen dominate ${pct(metric.alternativeDominates, metric.n)}/${pct(metric.chosenDominates, metric.n)} · `
    + `own possession ${pct(metric.chosenOwnPossession, metric.n)}→${pct(metric.alternativeOwnPossession, metric.n)} · `
    + `mean Δ possession ${(metric.possessionDelta / metric.n).toFixed(3)}, `
    + `progression ${(metric.progressionDelta / metric.n).toFixed(3)}m, xG ${(metric.xgDelta / metric.n).toFixed(3)}`,
  );
}
