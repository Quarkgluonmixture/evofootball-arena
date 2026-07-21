// Probe: PASS-TARGET COUNTERFACTUAL PAYOFF (offline oracle, layer 4).
// When live AI launches an ordinary open-play pass, retain the immediately
// pre-decision state. If S7 says the chosen target is Pareto-dominated, clone
// that same state and force two symmetric branches: chosen target vs each
// unambiguously better target. Both call the same performPass with the same RNG
// state, then roll 3 seconds. The live sim never reads these branches.
//   npx tsx scripts/probes/pass-target-counterfactual.ts [matches] [seedOffset]
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
const ROLLOUT_STEPS = 180;

interface RolloutOutcome {
  /** +1 own team possession, 0 unresolved, −1 opponent possession at horizon. */
  possession: number;
  goalDelta: number;
  xgDelta: number;
  progressionMetres: number;
  exitOptionCount: number;
}

type OutcomeDimension = keyof RolloutOutcome;
const OUTCOME_DIMENSIONS: readonly OutcomeDimension[] = [
  'possession', 'goalDelta', 'xgDelta', 'progressionMetres', 'exitOptionCount',
];
const OUTCOME_TOLERANCE: Readonly<Record<OutcomeDimension, number>> = {
  possession: 0,
  goalDelta: 0,
  xgDelta: 0.01,
  progressionMetres: 0.5,
  exitOptionCount: 0,
};

type OutcomeRelation = 'alternativeDominates' | 'chosenDominates' | 'equivalent' | 'tradeoff';

const compareOutcomes = (alternative: RolloutOutcome, chosen: RolloutOutcome): OutcomeRelation => {
  let alternativeNoWorse = true;
  let chosenNoWorse = true;
  let alternativeStrict = false;
  let chosenStrict = false;
  for (const dimension of OUTCOME_DIMENSIONS) {
    const delta = alternative[dimension] - chosen[dimension];
    const tolerance = OUTCOME_TOLERANCE[dimension];
    if (delta < -tolerance) alternativeNoWorse = false;
    if (delta > tolerance) chosenNoWorse = false;
    if (delta > tolerance) alternativeStrict = true;
    if (delta < -tolerance) chosenStrict = true;
  }
  if (alternativeNoWorse && alternativeStrict) return 'alternativeDominates';
  if (chosenNoWorse && chosenStrict) return 'chosenDominates';
  if (!alternativeStrict && !chosenStrict) return 'equivalent';
  return 'tradeoff';
};

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
): RolloutOutcome | null => {
  const branch = cloneSimulationState(frozen);
  const passer = branch.allPlayers[passerGid];
  const target = branch.allPlayers[targetGid];
  if (branch.phase !== 'playing' || branch.ball.owner !== passer || passer.kickCooldown > 0) return null;

  const startX = branch.teams[side].localX(branch.ball.pos.x);
  const score0 = branch.score[side] - branch.score[1 - side];
  const xg0 = xgFor(branch, side) - xgFor(branch, (1 - side) as Side);
  branch.performPass(passer, target);
  if (branch.pendingPass?.targetGid !== targetGid) return null;
  for (let step = 0; step < ROLLOUT_STEPS && !branch.finished; step++) branch.step(DT);

  return {
    possession: branch.possessionSide === side
      ? 1
      : branch.possessionSide === 1 - side ? -1 : 0,
    goalDelta: (branch.score[side] - branch.score[1 - side]) - score0,
    xgDelta: (xgFor(branch, side) - xgFor(branch, (1 - side) as Side)) - xg0,
    progressionMetres: branch.teams[side].localX(branch.ball.pos.x) - startX,
    exitOptionCount: optionCount(branch, side),
  };
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
          const chosenOutcome = rollout(frozen, pass.passerGid, pass.targetGid, side);
          if (!chosenOutcome) {
            forceFailures += alternatives.length;
          } else {
            for (const alternative of alternatives) {
              const alternativeOutcome = rollout(
                frozen, pass.passerGid, alternative.targetGid, side,
              );
              if (!alternativeOutcome) {
                forceFailures++;
                continue;
              }
              rolloutPairs++;
              relationCounts[compareOutcomes(alternativeOutcome, chosenOutcome)]++;
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
console.log(`paired 3.0s rollouts ${rolloutPairs}, force failures ${forceFailures}`);
console.log('Each pair starts from one pre-decision clone and identical RNG; only pass target differs.');
console.log('\nrollout Pareto relation (alternative vs chosen):');
for (const relation of Object.keys(relationCounts) as OutcomeRelation[]) {
  console.log(`  ${relation.padEnd(21)} ${relationCounts[relation].toString().padStart(5)}  ${pct(relationCounts[relation], rolloutPairs)}`);
}
console.log('\npaired mean delta (alternative − chosen; larger is better):');
console.log(`  possession ${meanDelta('possession')} · goals ${meanDelta('goalDelta')} · xG ${meanDelta('xgDelta')}`);
console.log(`  progression ${meanDelta('progressionMetres')}m · exit options ${meanDelta('exitOptionCount')}`);
console.log(`  own possession at 3.0s: chosen ${pct(chosenPossession, rolloutPairs)} → alternative ${pct(alternativePossession, rolloutPairs)}`);
