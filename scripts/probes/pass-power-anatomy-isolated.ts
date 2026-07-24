// C1-A2 PASS-POWER ANATOMY, ISOLATED.
// Authority: docs/world-model/PASS-POWER-SLICE.md §10
//
// C1-A's ledger failed because the measurement, not the ball, was confounded:
// the 1.00 arm was the only one drawing no execution gaussian (a privileged,
// RNG-unshifted baseline), the intended power moved the LEAD and therefore the
// corridor, and a three-second resolution window let world divergence dwarf the
// effect. Three fixes, no src change: every arm draws exactly one gaussian (the
// middle arm is struck at 1.00001), acceptance requires a near-stationary
// receiver so all arms share one corridor, and every outcome is decided by the
// FIRST body to touch the ball.
import { createHash } from 'node:crypto';
import { laneOpenness } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 120);
const SEED_START = Number(process.argv[3] ?? 93_000);
const MAX_SEEDS = 512;
const MATCH_DURATION = 240;
const SAMPLE_TICKS = Math.round(1 / DT);
const FLIGHT_TICKS = 180; // upper bound; a first touch normally lands far sooner
/** The middle arm is inert to ~5e-6 of power yet consumes the same gaussian. */
const POWERS = [0.85, 1.00001, 1.15] as const;
const CONTESTED_LANE_MAX = 0.50;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const RECEIVER_SPEED_MAX = 0.5;

type FirstToucher = 'opponent' | 'intendedTarget' | 'otherTeammate' | 'none';

interface BranchResult {
  readonly power: number;
  readonly firstToucher: FirstToucher;
  /** Only meaningful when the intended target is the first toucher. */
  readonly targetControlled: boolean;
  readonly launchSpeed: number;
  readonly flightTicks: number | null;
  readonly speedAtFirstTouch: number | null;
  readonly rngDraws: number;
  readonly nonFinite: number;
  readonly struck: boolean;
}

interface StateRecord {
  readonly key: string;
  readonly seed: number;
  readonly passDistance: number;
  readonly receiverSpeed: number;
  readonly laneOpenness: number;
  readonly contested: boolean;
  readonly branches: readonly BranchResult[];
  readonly equalDraws: boolean;
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

const rngState = (match: Match): number => (match.rng as unknown as { s: number }).s;

/**
 * Exact draw count between two mulberry32 states: every `next()` advances the
 * state by one fixed increment, so stepping from `before` to `after` counts the
 * uniforms consumed. A gaussian is two of them, so an ordinary pass at power 1.0
 * spends 2 (the aim spray) and one off 1.0 spends 4 (aim + execution error).
 */
const MULBERRY_STEP = 0x6d2b79f5;
const drawsBetween = (before: number, after: number): number => {
  let state = before >>> 0;
  const target = after >>> 0;
  for (let draws = 0; draws <= 64; draws++) {
    if (state === target) return draws;
    state = (state + MULBERRY_STEP) >>> 0;
  }
  return -1;
};

/**
 * Strike the frozen pass at one intended power and stop at the FIRST body other
 * than the passer to touch the ball. Whether that body keeps it is read from the
 * ownership state a few ticks later — inside the M3 control delay, not three
 * seconds of match.
 */
const runBranch = (
  frozen: Match,
  passerGid: number,
  targetGid: number,
  power: number,
): BranchResult => {
  const match = cloneSimulationState(frozen);
  const passer = findPlayer(match, passerGid);
  const target = findPlayer(match, targetGid);
  const empty = (struck: boolean): BranchResult => ({
    power,
    firstToucher: 'none',
    targetControlled: false,
    launchSpeed: 0,
    flightTicks: null,
    speedAtFirstTouch: null,
    rngDraws: 0,
    nonFinite: 0,
    struck,
  });
  if (!passer || !target) return empty(false);
  const stateBefore = rngState(match);
  match.performPass(passer, target, false, power);
  const kickDraws = drawsBetween(stateBefore, rngState(match));
  const launchSpeed = Math.hypot(match.ball.vel.x, match.ball.vel.y);
  if (launchSpeed === 0) return empty(false);

  let nonFinite = Number.isFinite(launchSpeed) ? 0 : 1;
  let firstToucher: FirstToucher = 'none';
  let flightTicks: number | null = null;
  let speedAtFirstTouch: number | null = null;
  let toucherGid: number | null = null;
  let toucherSide: number | null = null;
  for (let tick = 1; tick <= FLIGHT_TICKS; tick++) {
    const speedBefore = Math.hypot(match.ball.vel.x, match.ball.vel.y);
    match.step(DT);
    if (!Number.isFinite(match.ball.pos.x) || !Number.isFinite(match.ball.pos.y)) nonFinite++;
    const toucher = match.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) {
      flightTicks = tick;
      speedAtFirstTouch = speedBefore;
      toucherGid = toucher.gid;
      toucherSide = toucher.side;
      break;
    }
    if (match.phase !== 'playing') break;
  }
  if (toucherGid !== null) {
    if (toucherGid === targetGid) firstToucher = 'intendedTarget';
    else if (toucherSide === passer.side) firstToucher = 'otherTeammate';
    else firstToucher = 'opponent';
  }
  // Did that first touch become control? Resolve only the M3 control window.
  let targetControlled = false;
  if (firstToucher === 'intendedTarget') {
    for (let tick = 0; tick < 12 && match.phase === 'playing'; tick++) {
      if (match.ball.owner?.gid === targetGid) {
        targetControlled = true;
        break;
      }
      if (match.ball.owner && match.ball.owner.gid !== targetGid) break;
      match.step(DT);
    }
    if (match.ball.owner?.gid === targetGid) targetControlled = true;
  }
  return {
    power,
    firstToucher,
    targetControlled,
    launchSpeed,
    flightTicks,
    speedAtFirstTouch,
    rngDraws: kickDraws,
    nonFinite,
    struck: true,
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  let nonFinite = 0;
  let notStruck = 0;
  let unequalDrawStates = 0;
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
      // Near-stationary receiver ⇒ the lead point, corridor and pass distance are
      // identical for every power. That is what isolates speed.
      const candidates = match.teams[carrier.side].players
        .filter((player) => (
          player !== carrier && !player.sentOff && player.role !== 'GK'
          && Math.hypot(player.vel.x, player.vel.y) <= RECEIVER_SPEED_MAX
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
      const branches = POWERS.map((power) => runBranch(frozen, carrier.gid, target.gid, power));
      if (branches.some((branch) => !branch.struck)) {
        notStruck++;
        continue;
      }
      for (const branch of branches) nonFinite += branch.nonFinite;
      const equalDraws = branches.every((branch) => branch.rngDraws === branches[0].rngDraws);
      if (!equalDraws) unequalDrawStates++;
      accepted = true;
      acceptedStates++;
      records.push({
        key: `${seed}:${match.simTick}:${carrier.gid}:${target.gid}`,
        seed,
        passDistance: distance(carrier.pos, target.pos),
        receiverSpeed: Math.hypot(target.vel.x, target.vel.y),
        laneOpenness: lane,
        contested: lane <= CONTESTED_LANE_MAX,
        branches,
        equalDraws,
      });
    }
  }

  const mean = (values: readonly number[]): number =>
    (values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length);
  const at = (record: StateRecord, power: number): BranchResult =>
    record.branches.find((branch) => branch.power === power)!;

  const perPower = POWERS.map((power) => {
    const all = records.map((record) => at(record, power));
    const contested = records.filter((record) => record.contested).map((record) => at(record, power));
    const reachedTarget = all.filter((branch) => branch.firstToucher === 'intendedTarget');
    return {
      power,
      states: all.length,
      contestedStates: contested.length,
      opponentFirstAll: all.filter((branch) => branch.firstToucher === 'opponent').length,
      opponentFirstContested: contested.filter((b) => b.firstToucher === 'opponent').length,
      targetFirst: reachedTarget.length,
      targetFirstSpilled: reachedTarget.filter((branch) => !branch.targetControlled).length,
      otherTeammateFirst: all.filter((branch) => branch.firstToucher === 'otherTeammate').length,
      untouched: all.filter((branch) => branch.firstToucher === 'none').length,
      meanLaunchSpeed: mean(all.map((branch) => branch.launchSpeed)),
      meanFlightSeconds: mean(reachedTarget.filter((b) => b.flightTicks !== null)
        .map((branch) => branch.flightTicks! * DT)),
      meanSpeedAtFirstTouch: mean(reachedTarget.filter((b) => b.speedAtFirstTouch !== null)
        .map((branch) => branch.speedAtFirstTouch!)),
    };
  });

  const rate = (numerator: number, denominator: number): number =>
    (denominator === 0 ? 0 : numerator / denominator);
  const opponentFirstContestedRates = perPower.map((entry) =>
    rate(entry.opponentFirstContested, entry.contestedStates));
  const touchFailureRates = perPower.map((entry) => rate(entry.targetFirstSpilled, entry.targetFirst));
  const strictlyDecreasing = (values: readonly number[]): boolean =>
    values.every((value, index) => index === 0 || value < values[index - 1]);
  const strictlyIncreasing = (values: readonly number[]): boolean =>
    values.every((value, index) => index === 0 || value > values[index - 1]);

  const exact = {
    acceptedStates: acceptedStates === REQUIRED_STATES,
    scannedSeeds: scannedSeeds <= MAX_SEEDS,
    equalRngDraws: unequalDrawStates === 0,
    finite: nonFinite === 0,
    struck: notStruck === 0,
  };
  const directional = {
    h1OpponentFirstFallsWithPower: strictlyDecreasing(opponentFirstContestedRates)
      && (opponentFirstContestedRates[0] - opponentFirstContestedRates[2]) >= 0.03,
    h2TouchFailureRisesWithPower: strictlyIncreasing(touchFailureRates)
      && (touchFailureRates[2] - touchFailureRates[0]) >= 0.01,
    h3FlightTimeFallsWithPower: strictlyDecreasing(perPower.map((e) => e.meanFlightSeconds)),
    h4TouchSpeedRisesWithPower: strictlyIncreasing(perPower.map((e) => e.meanSpeedAtFirstTouch)),
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(directional).every(Boolean);
  return {
    experiment: 'C1-A2',
    authority: 'PASS-POWER-SLICE',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      powers: POWERS,
      contestedLaneMax: CONTESTED_LANE_MAX,
      passDistanceBand: [MIN_PASS_DISTANCE, MAX_PASS_DISTANCE],
      receiverSpeedMax: RECEIVER_SPEED_MAX,
      flightTicks: FLIGHT_TICKS,
    },
    support: {
      scannedSeeds,
      acceptedStates,
      contestedStates: records.filter((record) => record.contested).length,
    },
    perPower,
    rates: {
      opponentFirstContested: opponentFirstContestedRates,
      touchFailure: touchFailureRates,
    },
    diagnostics: {
      nonFinite,
      notStruck,
      unequalDrawStates,
      firstToucherCensus: records.reduce<Record<string, number>>((census, record) => {
        for (const branch of record.branches) {
          const key = `${branch.power}:${branch.firstToucher}`;
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
  `C1-A2 ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` · contested ${output.support.contestedStates}`
  + ` · oppFirst ${output.rates.opponentFirstContested.map((r) => r.toFixed(3)).join('/')}`
  + ` · touchFail ${output.rates.touchFailure.map((r) => r.toFixed(3)).join('/')}`
  + ` · SHA ${sha256}`,
);
