// EDS E0b PASS-OPTION VALUATION, MEASURED AT THE FIRST TOUCH.
// Authority: docs/world-model/EDS-E0B-OPTION-VALUATION-REDRAW.md
//
// E0's evaluator is unchanged. Two measurements are: the reception outcome is
// now the RAW first touch (owned at firstTouchTick + CONTACT_CONTROL_DELAY_TICKS
// + 1 — a spill the player re-collects later is a spill, which is exactly the
// lesson C1-B §13.3 left behind), and an unobservable teammate is classified
// rather than failed.
//
// C1-A2's isolated ledger, VERBATIM (same acceptance, same seeds, same
// first-touch outcome measurement, same per-arm gaussian) — so its measured
// rates must reproduce exactly — plus, on each frozen pre-kick state, what the
// dormant E0 evaluator PREDICTS for the same three options. The gates ask
// whether the prediction agrees with the world it claims to model, including
// that world's near-flat reception cost.
// Kept from C1-A2 for reproduction:
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
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption, type PassOptionValue } from '../../src/ai/passOptionValue';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { CONTACT_CONTROL_DELAY_TICKS, DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

const REQUIRED_STATES = Number(process.argv[2] ?? 120);
const AWARENESS = 0.8;
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
  /** E0b: was the FIRST TOUCH itself clean, before any re-collection? */
  readonly firstTouchClean: boolean;
  readonly launchSpeed: number;
  readonly flightTicks: number | null;
  readonly speedAtFirstTouch: number | null;
  readonly rngDraws: number;
  readonly nonFinite: number;
  readonly struck: boolean;
}

interface Prediction {
  readonly power: number;
  readonly flightSeconds: number;
  readonly arrivalSpeed: number;
  readonly interceptionThreatSeconds: number;
  readonly touchFailPrior: number;
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
  /** E0: what the dormant evaluator predicted for the same three options. */
  readonly predictions: readonly Prediction[];
  readonly nullValuations: number;
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
    firstTouchClean: false,
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
  // E0b: the RAW first touch. M3 resolves the control attempt three ticks after
  // contact, so step exactly that far and ask who owns the ball — before any
  // recontact can quietly rescue a spill.
  let firstTouchClean = false;
  if (firstToucher === 'intendedTarget') {
    for (let tick = 0; tick <= CONTACT_CONTROL_DELAY_TICKS && match.phase === 'playing'; tick++) {
      match.step(DT);
    }
    firstTouchClean = match.ball.owner?.gid === targetGid;
  }
  // Retained diagnostic: the OLD eventual-control metric, so both stay visible.
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
    firstTouchClean,
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
    // The passer must read its OWN snapshot: per-player memories, fed every tick.
    const memories = new Map<number, PerceptionMemory>();
    const snapshots = new Map<number, PerceptionSnapshot>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let accepted = false;
    while (!match.finished && !accepted) {
      match.step(DT);
      const truth = capturePerceptionTruth(match);
      for (const player of match.allPlayers) {
        if (player.role === 'GK' || player.sentOff) continue;
        snapshots.set(player.gid, perceiveSnapshot(
          truth, player.gid, AWARENESS, seed, memories.get(player.gid)!,
        ));
      }
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
      // ---- E0: the dormant evaluator, on the passer's own observed state ----
      const carrierSnapshot = snapshots.get(carrier.gid);
      if (!carrierSnapshot) continue;
      const reachProfiles = new Map<number, KnownReachProfile>(
        match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed,
          accel: player.accel,
          dribbling: player.attrs.dribbling,
        }]),
      );
      const attackDir = match.teams[carrier.side].attackDir;
      const valuations = POWERS.map((power) => evaluatePassOption({
        snapshot: carrierSnapshot,
        passerGid: carrier.gid,
        targetGid: target.gid,
        powerMultiplier: power,
        attackDir,
        reachProfiles,
      }));
      // An accepted state whose valuation is null is a FAIL, not a skip: the
      // gate counts them rather than quietly dropping the state.
      const nullValuations = valuations.filter((value) => value === null).length;
      const predictions: Prediction[] = [];
      valuations.forEach((value: PassOptionValue | null, index: number) => {
        if (value === null) return;
        predictions.push({
          power: POWERS[index],
          flightSeconds: value.flightSeconds,
          arrivalSpeed: value.arrivalSpeed,
          interceptionThreatSeconds: value.interceptionThreatSeconds,
          touchFailPrior: value.touchFailPrior,
        });
      });
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
        predictions,
        nullValuations,
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
      targetFirstRawSpilled: reachedTarget.filter((branch) => !branch.firstTouchClean).length,
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
  const rawTouchFailureRates = perPower.map((entry) =>
    rate(entry.targetFirstRawSpilled, entry.targetFirst));
  const totalNullValuations = records.reduce((sum, r) => sum + r.nullValuations, 0);
  const withPredictions = records.filter((r) => r.predictions.length === POWERS.length);
  const contestedWithPredictions = withPredictions.filter((r) => r.contested);
  const predAt = (record: StateRecord, power: number): Prediction =>
    record.predictions.find((p) => p.power === power)!;
  const predMeans = POWERS.map((power) => ({
    power,
    interceptionThreatSeconds: mean(withPredictions.map((r) => predAt(r, power).interceptionThreatSeconds)),
    touchFailPrior: mean(withPredictions.map((r) => predAt(r, power).touchFailPrior)),
    flightSeconds: mean(withPredictions.map((r) => predAt(r, power).flightSeconds)),
    arrivalSpeed: mean(withPredictions.map((r) => predAt(r, power).arrivalSpeed)),
  }));
  // Per-state ranked selection: which option does the evaluator call safest?
  const rankedByThreat = (record: StateRecord): readonly Prediction[] =>
    [...record.predictions].sort((left, right) => (
      left.interceptionThreatSeconds - right.interceptionThreatSeconds
      || left.power - right.power
    ));
  const safestIs115 = contestedWithPredictions.filter((r) =>
    rankedByThreat(r)[0].power === POWERS[2]).length;
  const outcomeUnder = (record: StateRecord, power: number): FirstToucher =>
    record.branches.find((b) => b.power === power)!.firstToucher;
  const safestOpponentFirst = contestedWithPredictions.filter((r) =>
    outcomeUnder(r, rankedByThreat(r)[0].power) === 'opponent').length;
  const riskiestOpponentFirst = contestedWithPredictions.filter((r) =>
    outcomeUnder(r, rankedByThreat(r)[POWERS.length - 1].power) === 'opponent').length;
  const safestRate = rate(safestOpponentFirst, contestedWithPredictions.length);
  const riskiestRate = rate(riskiestOpponentFirst, contestedWithPredictions.length);

  // C1-A2's measured reference numbers (SHA 7e0ff4d5…257b), reproduced exactly.
  const C1A2_OPPONENT_FIRST = [0.5652173913043478, 0.4891304347826087, 0.391304347826087];
  const C1A2_TOUCH_FAILURE = [0.11864406779661017, 0.12121212121212122, 0.11842105263157894];
  const sameRates = (measured: readonly number[], reference: readonly number[]): boolean =>
    measured.length === reference.length
    && measured.every((value, index) => Math.abs(value - reference[index]) < 1e-12);

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
    contestedPricedNonVacuous: contestedWithPredictions.length >= 40,
    c1a2OpponentFirstReproduced: sameRates(opponentFirstContestedRates, C1A2_OPPONENT_FIRST),
    c1a2TouchFailureReproduced: sameRates(touchFailureRates, C1A2_TOUCH_FAILURE),
  };
  const prediction = {
    p1ThreatFallsWithPower:
      strictlyDecreasing(predMeans.map((entry) => entry.interceptionThreatSeconds))
      && rate(safestIs115, contestedWithPredictions.length) >= 0.60,
    p2AgreesWithRawFirstTouch: Math.abs(
      (predMeans[2].touchFailPrior - predMeans[0].touchFailPrior)
      - (rawTouchFailureRates[2] - rawTouchFailureRates[0]),
    ) <= 0.02,
    p3FlightTimeFallsWithPower: strictlyDecreasing(predMeans.map((entry) => entry.flightSeconds)),
    p4ArrivalSpeedRisesWithPower: strictlyIncreasing(predMeans.map((entry) => entry.arrivalSpeed)),
    p5RankedSelectionAgrees: (riskiestRate - safestRate) >= 0.05,
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(prediction).every(Boolean);
  return {
    experiment: 'EDS-E0b',
    authority: 'EDS-E0B-OPTION-VALUATION-REDRAW',
    parameters: {
      requiredStates: REQUIRED_STATES,
      seedStart: SEED_START,
      maxSeeds: MAX_SEEDS,
      awareness: AWARENESS,
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
      contestedWithPredictions: contestedWithPredictions.length,
    },
    measured: {
      perPower,
      opponentFirstContested: opponentFirstContestedRates,
      touchFailure: touchFailureRates,
      rawFirstTouchFailure: rawTouchFailureRates,
    },
    predicted: {
      perPower: predMeans,
      safestIs115,
      safestOpponentFirstRate: safestRate,
      riskiestOpponentFirstRate: riskiestRate,
    },
    diagnostics: {
      nonFinite,
      notStruck,
      unequalDrawStates,
      totalNullValuations,
      statesPricedFully: withPredictions.length,
      statesPricedNone: records.filter((r) => r.predictions.length === 0).length,
      firstToucherCensus: records.reduce<Record<string, number>>((census, record) => {
        for (const branch of record.branches) {
          const key = `${branch.power}:${branch.firstToucher}`;
          census[key] = (census[key] ?? 0) + 1;
        }
        return census;
      }, {}),
    },
    exact,
    prediction,
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
  `EDS-E0b ${output.verdict} · accepted ${output.support.acceptedStates}/${REQUIRED_STATES}`
  + ` · contested ${output.support.contestedStates}`
  + ` · measured oppFirst ${output.measured.opponentFirstContested.map((r) => r.toFixed(3)).join('/')}`
  + ` · predicted threat ${output.predicted.perPower.map((p) => p.interceptionThreatSeconds.toFixed(3)).join('/')}`
  + ` · safest=1.15 ${output.predicted.safestIs115}/${output.support.contestedWithPredictions}`
  + ` · ranked ${output.predicted.riskiestOpponentFirstRate.toFixed(3)}→${output.predicted.safestOpponentFirstRate.toFixed(3)}`
  + ` · rawTouchFail ${output.measured.rawFirstTouchFailure.map((r) => r.toFixed(3)).join('/')}`
  + ` · predTouch ${output.predicted.perPower.map((p) => p.touchFailPrior.toFixed(3)).join('/')}`
  + ` · SHA ${sha256}`,
);
