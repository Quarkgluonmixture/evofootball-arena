// C1-A PASS-POWER ANATOMY (directional).
// Authority: docs/world-model/PASS-POWER-SLICE.md §8
//
// Sweeps the intended pass weight 0.85 / 1.00 / 1.15 on the SAME frozen live
// pass situation and measures what the substrate actually charges for it:
// interception on contested corridors, the intended receiver's reception
// failure, arrival time and arrival speed. Nothing chooses a power in the live
// game — this probe is the ledger the choice layer would need.
import { createHash } from 'node:crypto';
import { laneOpenness } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import {
  DT, PASS_POWER_EXECUTED_MAX, PASS_POWER_EXECUTED_MIN,
} from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 120);
const SEED_START = Number(process.argv[3] ?? 92_000);
const MAX_SEEDS = 384;
const MATCH_DURATION = 240;
const SAMPLE_TICKS = Math.round(1 / DT);
const RESOLVE_TICKS = 180; // 3s: an ordinary ground pass has resolved by then
const POWERS = [0.85, 1.0, 1.15] as const;
const CONTESTED_LANE_MAX = 0.50;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;

type Outcome =
  | 'targetControlled'
  | 'targetFailedTouch'
  | 'interceptedByOpponent'
  | 'otherTeammate'
  | 'unresolved'
  | 'deadBall'
  | 'notStruck';

interface BranchResult {
  readonly power: number;
  readonly outcome: Outcome;
  readonly launchSpeed: number;
  readonly executedPowerRatio: number;
  readonly arrivalTicks: number | null;
  readonly arrivalSpeed: number | null;
  readonly targetTouched: boolean;
  readonly nonFinite: number;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly passDistance: number;
  readonly laneOpenness: number;
  readonly contested: boolean;
  readonly branches: readonly BranchResult[];
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

const findPlayer = (match: Match, gid: number) =>
  match.allPlayers.find((player) => player.gid === gid) ?? null;

const distance = (
  left: Readonly<{ x: number; y: number }>,
  right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

/**
 * Strike the frozen pass at one intended power and follow the ball until it is
 * controlled, cut out, or the window closes. The un-powered launch speed for the
 * same geometry is passed in so the executed power can be reported honestly.
 */
const runBranch = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  power: number,
  referenceSpeed: number,
): BranchResult => {
  const match = cloneSimulationState(frozen);
  const passer = findPlayer(match, passerGid);
  const target = findPlayer(match, targetGid);
  if (!passer || !target) {
    return {
      power,
      outcome: 'notStruck',
      launchSpeed: 0,
      executedPowerRatio: 0,
      arrivalTicks: null,
      arrivalSpeed: null,
      targetTouched: false,
      nonFinite: 0,
    };
  }
  match.performPass(passer, target, false, power);
  const launchSpeed = Math.hypot(match.ball.vel.x, match.ball.vel.y);
  let nonFinite = Number.isFinite(launchSpeed) ? 0 : 1;
  if (launchSpeed === 0) {
    return {
      power,
      outcome: 'notStruck',
      launchSpeed,
      executedPowerRatio: 0,
      arrivalTicks: null,
      arrivalSpeed: null,
      targetTouched: false,
      nonFinite,
    };
  }
  let outcome: Outcome = 'unresolved';
  let arrivalTicks: number | null = null;
  let arrivalSpeed: number | null = null;
  let targetTouched = false;
  for (let tick = 1; tick <= RESOLVE_TICKS; tick++) {
    const speedBefore = Math.hypot(match.ball.vel.x, match.ball.vel.y);
    match.step(DT);
    if (!Number.isFinite(match.ball.pos.x) || !Number.isFinite(match.ball.pos.y)) nonFinite++;
    const toucher = match.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid && arrivalTicks === null) {
      // First body other than the passer to touch the ball ends the flight.
      arrivalTicks = tick;
      arrivalSpeed = speedBefore;
      if (toucher.gid === targetGid) targetTouched = true;
    }
    if (match.phase !== 'playing') {
      if (outcome === 'unresolved') outcome = 'deadBall';
      break;
    }
    const owner = match.ball.owner;
    if (owner && owner.gid !== passerGid) {
      if (owner.gid === targetGid) outcome = 'targetControlled';
      else if (owner.side === passer.side) outcome = 'otherTeammate';
      else outcome = 'interceptedByOpponent';
      break;
    }
  }
  if (outcome === 'unresolved' && targetTouched) outcome = 'targetFailedTouch';
  return {
    power,
    outcome,
    launchSpeed,
    executedPowerRatio: referenceSpeed > 0 ? launchSpeed / referenceSpeed : 0,
    arrivalTicks,
    arrivalSpeed,
    targetTouched,
    nonFinite,
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  let bandViolations = 0;
  let nonFinite = 0;
  let notStruck = 0;
  const records: StateRecord[] = [];

  for (
    let seed = SEED_START;
    seed < SEED_START + MAX_SEEDS && acceptedStates < REQUIRED_STATES;
    seed++
  ) {
    scannedSeeds++;
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
    });
    let accepted = false;
    while (!match.finished && !accepted) {
      match.step(DT);
      if (match.simTick % SAMPLE_TICKS !== 0 || match.simTime < 10 || match.phase !== 'playing') {
        continue;
      }
      const carrier = match.ball.owner;
      if (!carrier || carrier.sentOff || carrier.role === 'GK' || carrier.kickCooldown > 0) continue;
      const opponents = match.teams[1 - carrier.side].players;
      // The nearest eligible outfield teammate in the pass-distance band is the
      // target: one deterministic choice per state, no scoring involved.
      const candidates = match.teams[carrier.side].players
        .filter((player) => (
          player !== carrier && !player.sentOff && player.role !== 'GK'
          && distance(player.pos, carrier.pos) >= MIN_PASS_DISTANCE
          && distance(player.pos, carrier.pos) <= MAX_PASS_DISTANCE
        ))
        .sort((left, right) => (
          distance(left.pos, carrier.pos) - distance(right.pos, carrier.pos)
          || left.gid - right.gid
        ));
      const target = candidates[0];
      if (!target) continue;
      const lane = laneOpenness(carrier.pos, target.pos, opponents);
      const frozen = cloneSimulationState(match);
      // Reference: the same geometry struck at the untouched 1.0 weight. Its own
      // branch reuses it, so no extra simulation is spent.
      const branches: BranchResult[] = [];
      const referenceBranch = runBranch(frozen, carrier.gid, target.gid, 1, 0);
      if (referenceBranch.outcome === 'notStruck') {
        notStruck++;
        continue;
      }
      const referenceSpeed = referenceBranch.launchSpeed;
      for (const power of POWERS) {
        const branch = power === 1
          ? { ...referenceBranch, executedPowerRatio: 1 }
          : runBranch(frozen, carrier.gid, target.gid, power, referenceSpeed);
        branches.push(branch);
        nonFinite += branch.nonFinite;
        if (branch.outcome === 'notStruck') notStruck++;
        if (
          branch.executedPowerRatio > 0
          && (branch.executedPowerRatio < PASS_POWER_EXECUTED_MIN - 1e-9
            || branch.executedPowerRatio > PASS_POWER_EXECUTED_MAX + 1e-9)
        ) bandViolations++;
      }
      accepted = true;
      acceptedStates++;
      records.push({
        key: `${seed}:${match.simTick}:${carrier.gid}:${target.gid}`,
        seed,
        passDistance: distance(carrier.pos, target.pos),
        laneOpenness: lane,
        contested: lane <= CONTESTED_LANE_MAX,
        branches,
      });
    }
  }

  const perPower = POWERS.map((power) => {
    const branches = records.map((record) =>
      record.branches.find((branch) => branch.power === power)!);
    const contestedBranches = records
      .filter((record) => record.contested)
      .map((record) => record.branches.find((branch) => branch.power === power)!);
    const arrivals = branches.filter((branch) => branch.arrivalTicks !== null);
    const mean = (values: readonly number[]): number =>
      (values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length);
    return {
      power,
      states: branches.length,
      contestedStates: contestedBranches.length,
      interceptedAll: branches.filter((b) => b.outcome === 'interceptedByOpponent').length,
      interceptedContested: contestedBranches
        .filter((b) => b.outcome === 'interceptedByOpponent').length,
      targetControlled: branches.filter((b) => b.outcome === 'targetControlled').length,
      // Reception FAILURE: the intended receiver never ended up in control.
      receptionFailures: branches.filter((b) => b.outcome !== 'targetControlled').length,
      meanArrivalSeconds: mean(arrivals.map((b) => b.arrivalTicks! * DT)),
      meanArrivalSpeed: mean(arrivals.filter((b) => b.arrivalSpeed !== null)
        .map((b) => b.arrivalSpeed!)),
      meanLaunchSpeed: mean(branches.map((b) => b.launchSpeed)),
      meanExecutedPowerRatio: mean(branches.map((b) => b.executedPowerRatio)),
    };
  });

  const rate = (numerator: number, denominator: number): number =>
    (denominator === 0 ? 0 : numerator / denominator);
  const interceptedContestedRates = perPower.map((entry) =>
    rate(entry.interceptedContested, entry.contestedStates));
  const receptionFailureRates = perPower.map((entry) => rate(entry.receptionFailures, entry.states));
  const strictlyDecreasing = (values: readonly number[]): boolean =>
    values.every((value, index) => index === 0 || value < values[index - 1]);
  const strictlyIncreasing = (values: readonly number[]): boolean =>
    values.every((value, index) => index === 0 || value > values[index - 1]);

  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    bandViolations: bandViolations === 0,
    finite: nonFinite === 0,
    struck: notStruck === 0,
  };
  const directional = {
    g1InterceptionFallsWithPower: strictlyDecreasing(interceptedContestedRates)
      && (interceptedContestedRates[0] - interceptedContestedRates[2]) >= 0.03,
    g2ReceptionFailureRisesWithPower: strictlyIncreasing(receptionFailureRates)
      && (receptionFailureRates[2] - receptionFailureRates[0]) >= 0.01,
    g3ArrivalTimeFallsWithPower: strictlyDecreasing(perPower.map((e) => e.meanArrivalSeconds)),
    g4ArrivalSpeedRisesWithPower: strictlyIncreasing(perPower.map((e) => e.meanArrivalSpeed)),
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(directional).every(Boolean);
  return {
    experiment: 'C1-A',
    authority: 'PASS-POWER-SLICE',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      powers: POWERS,
      contestedLaneMax: CONTESTED_LANE_MAX,
      passDistanceBand: [MIN_PASS_DISTANCE, MAX_PASS_DISTANCE],
      resolveTicks: RESOLVE_TICKS,
    },
    support: {
      scannedSeeds,
      acceptedStates,
      contestedStates: records.filter((record) => record.contested).length,
    },
    perPower,
    rates: {
      interceptedContested: interceptedContestedRates,
      receptionFailure: receptionFailureRates,
    },
    diagnostics: {
      bandViolations,
      nonFinite,
      notStruck,
      outcomeCensus: records.reduce<Record<string, number>>((census, record) => {
        for (const branch of record.branches) {
          const key = `${branch.power}:${branch.outcome}`;
          census[key] = (census[key] ?? 0) + 1;
        }
        return census;
      }, {}),
    },
    exact,
    directional,
    verdict: pass ? 'PASS' : 'FAIL',
    records,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
if (!deterministic) output.verdict = 'FAIL';
console.log(JSON.stringify(output, null, 2));
console.error(
  `C1-A ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` · contested ${output.support.contestedStates}`
  + ` · interceptedContested ${output.rates.interceptedContested.map((r) => r.toFixed(3)).join('/')}`
  + ` · receptionFail ${output.rates.receptionFailure.map((r) => r.toFixed(3)).join('/')}`
  + ` · SHA ${sha256}`,
);
