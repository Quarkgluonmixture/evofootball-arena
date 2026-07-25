// EDS E2a CENSUS PRIORS + PRICING LAYER.
// Authority: docs/world-model/EDS-E2A-CENSUS-PRIORS.md
//
// Three jobs. Measure what the world actually does to a pass at each distance
// (the census). Prove that measurement generalises off its own seeds (a
// held-out set, an interval test sized before the run). Then prove the pricing
// layer turns E0's 55 deleted states into 55 priced ones without touching the
// 65 it could already read — the direct mechanism test of "unseen is not
// unavailable", which is the thing that killed S3b.
import { createHash } from 'node:crypto';
import { laneOpenness } from '../../src/ai/perception';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { pricePassOption, type PricedPassOption } from '../../src/ai/passOptionPricing';
import {
  PASS_PRIOR_BANDS, PASS_PRIOR_MARGINAL, PASS_PRIOR_TABLE, type PassPriorRow,
} from '../../src/ai/passPrior';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §3, §4) ------------------------------------
const CENSUS_SEED_START = 610_000;
const HOLDOUT_SEED_START = 620_000;
const CENSUS_MATCHES = Number(process.argv[2] ?? 250);
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const ADJUDICATION_WINDOW_TICKS = 12; // M3 control delay is 3; 12 is generous
const PASS_TIMEOUT_TICKS = 240;
const BAND_TOLERANCE = 0.05; // P2, 5.0pp
const MARGINAL_TOLERANCE = 0.015; // P2, 1.5pp
const BAND_REALITY_THRESHOLD = 0.05; // P4 routing rule

// E0's banked numbers (EDS-E0 §7) for the X5 reproduction gate.
const E0_SEED_START = 93_000;
const E0_REQUIRED_STATES = 120;
const E0_MAX_SEEDS = 512;
const E0_AWARENESS = 0.8;
const E0_POWERS = [0.85, 1.00001, 1.15] as const;
const E0_CONTESTED_LANE_MAX = 0.50;
const E0_FLIGHT_TICKS = 180;
const E0_RECEIVER_SPEED_MAX = 0.5;
const E0_BANKED_THREAT = [0.843, 0.586, 0.446] as const;
const E0_BANKED_FLIGHT = [1.713, 1.303, 1.061] as const;
const E0_BANKED_ARRIVAL = [5.99, 8.69, 11.39] as const;
const E0_BANKED_TOUCH = [0.0734, 0.1129] as const;
const E0_BANKED_SAFEST_115 = 52;
const E0_BANKED_OBSERVED = 65;
const E0_BANKED_UNSEEN = 55;

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
const mean = (values: readonly number[]): number =>
  (values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length);
const round = (value: number, places = 3): number => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};
const distanceBetween = (
  left: Readonly<{ x: number; y: number }>, right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);
const bandIndexOf = (distance: number): number => {
  for (let index = 0; index < PASS_PRIOR_BANDS.length; index++) {
    const [from, to] = PASS_PRIOR_BANDS[index];
    if (distance >= from && distance < to) return index;
  }
  return PASS_PRIOR_BANDS.length - 1; // the 30.0 m edge belongs to the last band
};

// --- the census -------------------------------------------------------------
type PassOutcome = 'intercepted' | 'reachedTarget' | 'otherTeammate' | 'unresolved';

interface CensusPass {
  readonly band: number;
  readonly outcome: PassOutcome;
  /** Only meaningful when the ball reached the intended target. */
  readonly spilled: boolean;
  readonly adjudicated: boolean;
}

/**
 * Watch one sealed match from outside and record every intended ground pass in
 * E0's 6–30 m candidate window. Nothing is injected: pass registration is read
 * from `pendingPass`, the outcome from who touches the ball next, and the first
 * touch from E1a's trace (a flag proven behaviour-neutral).
 */
const censusMatch = (seed: number): CensusPass[] => {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
    traceFirstTouch: true,
  });
  interface Open { passerGid: number; targetGid: number; band: number; tick: number }
  const recorded: { pass: CensusPass; toucherGid: number; tick: number }[] = [];
  let open: Open | null = null;
  let lastPassKey = '';
  while (!match.finished) {
    match.step(DT);
    const pending = match.pendingPass;
    if (pending) {
      const key = `${pending.passerGid}:${pending.targetGid}:${pending.t}`;
      if (key !== lastPassKey) {
        lastPassKey = key;
        const passer = match.allPlayers[pending.passerGid];
        const target = match.allPlayers[pending.targetGid];
        if (passer && target) {
          const distance = distanceBetween(passer.pos, target.pos);
          open = distance >= MIN_PASS_DISTANCE && distance <= MAX_PASS_DISTANCE
            ? {
              passerGid: pending.passerGid,
              targetGid: pending.targetGid,
              band: bandIndexOf(distance),
              tick: match.simTick,
            }
            : null;
        }
      }
    }
    if (open === null) continue;
    const toucher = match.ball.lastTouch;
    if (toucher && toucher.gid !== open.passerGid) {
      const passerSide = match.allPlayers[open.passerGid].side;
      const outcome: PassOutcome = toucher.gid === open.targetGid
        ? 'reachedTarget'
        : toucher.side === passerSide ? 'otherTeammate' : 'intercepted';
      recorded.push({
        pass: { band: open.band, outcome, spilled: false, adjudicated: false },
        toucherGid: toucher.gid,
        tick: match.simTick,
      });
      open = null;
    } else if (match.simTick - open.tick > PASS_TIMEOUT_TICKS || match.phase !== 'playing') {
      recorded.push({
        pass: { band: open.band, outcome: 'unresolved', spilled: false, adjudicated: false },
        toucherGid: -1,
        tick: match.simTick,
      });
      open = null;
    }
  }
  // Resolve the first touch afterwards, off the completed trace: contact and
  // adjudication are three ticks apart, and some contacts never adjudicate at
  // all (the registered M3 cushioning boundary).
  return recorded.map((entry) => {
    if (entry.pass.outcome !== 'reachedTarget') return entry.pass;
    const event = match.firstTouchTrace.find((trace) => (
      trace.gid === entry.toucherGid && trace.intendedTarget
      && trace.tick >= entry.tick && trace.tick <= entry.tick + ADJUDICATION_WINDOW_TICKS
    ));
    if (!event) return { ...entry.pass, adjudicated: false, spilled: false };
    return { ...entry.pass, adjudicated: true, spilled: !event.clean };
  });
};

const tabulate = (passes: readonly CensusPass[], bandFrom: number, bandTo: number): PassPriorRow => {
  const n = passes.length;
  const rate = (count: number) => (n === 0 ? 0 : count / n);
  const reached = passes.filter((pass) => pass.outcome === 'reachedTarget');
  const spilled = reached.filter((pass) => pass.spilled).length;
  // Clean GIVEN reached counts an unadjudicated arrival as kept: the world
  // declined to charge for it (<=6 m/s returns clean before the roll, and M3
  // cushioning can skip the adjudication entirely). Both splits are reported.
  const cleanGivenReached = reached.length === 0 ? 0 : 1 - spilled / reached.length;
  const reachedRate = rate(reached.length);
  return {
    bandFrom,
    bandTo,
    passes: n,
    interceptedRate: rate(passes.filter((pass) => pass.outcome === 'intercepted').length),
    reachedRate,
    otherTeammateRate: rate(passes.filter((pass) => pass.outcome === 'otherTeammate').length),
    unresolvedRate: rate(passes.filter((pass) => pass.outcome === 'unresolved').length),
    cleanGivenReached,
    receptionSuccessRate: reachedRate * cleanGivenReached,
  };
};

const runCensus = (seedStart: number) => {
  const passes: CensusPass[] = [];
  for (let index = 0; index < CENSUS_MATCHES; index++) passes.push(...censusMatch(seedStart + index));
  const table = PASS_PRIOR_BANDS.map(([from, to], index) =>
    tabulate(passes.filter((pass) => pass.band === index), from, to));
  const marginal = tabulate(passes, -1, -1);
  const reached = passes.filter((pass) => pass.outcome === 'reachedTarget');
  return {
    table,
    marginal,
    adjudicationSplit: {
      reached: reached.length,
      adjudicated: reached.filter((pass) => pass.adjudicated).length,
      unadjudicated: reached.filter((pass) => !pass.adjudicated).length,
      spilled: reached.filter((pass) => pass.spilled).length,
    },
  };
};

// --- the pricing layer on E0's own 120 banked states -------------------------
const findPlayer = (match: Match, gid: number) =>
  match.allPlayers.find((player) => player.gid === gid) ?? null;

/** E0's runBranch, kept only for its ACCEPTANCE effect (an unstruck state is
 * skipped, which shifts every state after it). */
const branchStruck = (
  frozen: Match, passerGid: number, targetGid: number, power: number,
): boolean => {
  const match = cloneSimulationState(frozen);
  const passer = findPlayer(match, passerGid);
  const target = findPlayer(match, targetGid);
  if (!passer || !target) return false;
  match.performPass(passer, target, false, power);
  if (Math.hypot(match.ball.vel.x, match.ball.vel.y) === 0) return false;
  for (let tick = 1; tick <= E0_FLIGHT_TICKS; tick++) {
    match.step(DT);
    const toucher = match.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) break;
    if (match.phase !== 'playing') break;
  }
  return true;
};

const runPricing = () => {
  let acceptedStates = 0;
  const states: { contested: boolean; options: PricedPassOption[] }[] = [];

  for (
    let seed = E0_SEED_START;
    seed < E0_SEED_START + E0_MAX_SEEDS && acceptedStates < E0_REQUIRED_STATES;
    seed++
  ) {
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
    });
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
          truth, player.gid, E0_AWARENESS, seed, memories.get(player.gid)!,
        ));
      }
      if (match.simTick % SAMPLE_TICKS !== 0 || match.simTime < 10 || match.phase !== 'playing') {
        continue;
      }
      const carrier = match.ball.owner;
      if (!carrier || carrier.sentOff || carrier.role === 'GK' || carrier.kickCooldown > 0) continue;
      const opponents = match.teams[1 - carrier.side].players;
      const candidates = match.teams[carrier.side].players
        .filter((player) => (
          player !== carrier && !player.sentOff && player.role !== 'GK'
          && Math.hypot(player.vel.x, player.vel.y) <= E0_RECEIVER_SPEED_MAX
          && distanceBetween(player.pos, carrier.pos) >= MIN_PASS_DISTANCE
          && distanceBetween(player.pos, carrier.pos) <= MAX_PASS_DISTANCE
        ))
        .sort((left, right) => (
          distanceBetween(left.pos, carrier.pos) - distanceBetween(right.pos, carrier.pos)
          || left.gid - right.gid
        ));
      const target = candidates[0];
      if (!target) continue;
      const lane = laneOpenness(carrier.pos, target.pos, opponents);
      const carrierSnapshot = snapshots.get(carrier.gid);
      if (!carrierSnapshot) continue;
      const reachProfiles = new Map<number, KnownReachProfile>(
        match.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed,
          accel: player.accel,
          dribbling: player.attrs.dribbling,
        }]),
      );
      // The OBSERVED separation — snapshot to snapshot, never truth. Undefined
      // when either body is unseen, which is exactly when the marginal applies.
      const seenPasser = carrierSnapshot.players.find((entry) => entry.gid === carrier.gid);
      const seenTarget = carrierSnapshot.players.find((entry) => entry.gid === target.gid);
      const observedDistanceMetres = seenPasser && seenTarget
        ? distanceBetween(seenPasser.pos, seenTarget.pos)
        : undefined;
      const attackDir = match.teams[carrier.side].attackDir;
      const options = E0_POWERS.map((power) => pricePassOption({
        snapshot: carrierSnapshot,
        passerGid: carrier.gid,
        targetGid: target.gid,
        powerMultiplier: power,
        attackDir,
        reachProfiles,
        observedDistanceMetres,
      }));
      const frozen = cloneSimulationState(match);
      if (!E0_POWERS.every((power) => branchStruck(frozen, carrier.gid, target.gid, power))) continue;
      accepted = true;
      acceptedStates++;
      states.push({ contested: lane <= E0_CONTESTED_LANE_MAX, options });
    }
  }

  const observedStates = states.filter((state) => state.options.every((o) => o.source === 'observed'));
  const priorStates = states.filter((state) => state.options.every((o) => o.source === 'prior'));
  const mixedStates = states.length - observedStates.length - priorStates.length;
  const nulls = states.reduce(
    (sum, state) => sum + state.options.filter((option) => option === null).length, 0,
  );
  // Physical leakage: a prior-priced option must carry NO physical read.
  const priorWithPhysics = states.reduce((sum, state) => sum
    + state.options.filter((option) => option.source === 'prior' && option.observed !== null).length, 0);

  const at = (state: { options: PricedPassOption[] }, index: number) => state.options[index];
  const perPower = E0_POWERS.map((power, index) => {
    const values = observedStates.map((state) => at(state, index).observed!);
    return {
      power,
      flightSeconds: mean(values.map((value) => value.flightSeconds)),
      arrivalSpeed: mean(values.map((value) => value.arrivalSpeed)),
      interceptionThreatSeconds: mean(values.map((value) => value.interceptionThreatSeconds)),
      touchFailPrior: mean(values.map((value) => value.touchFailPrior)),
    };
  });
  const contestedObserved = observedStates.filter((state) => state.contested);
  const safestIs115 = contestedObserved.filter((state) => {
    const ranked = [...state.options]
      .sort((left, right) =>
        left.observed!.interceptionThreatSeconds - right.observed!.interceptionThreatSeconds);
    return ranked[0].powerMultiplier === E0_POWERS[2];
  }).length;

  return {
    acceptedStates,
    observedStates: observedStates.length,
    priorStates: priorStates.length,
    mixedStates,
    nulls,
    priorWithPhysics,
    optionsPriced: states.reduce((sum, state) => sum + state.options.length, 0),
    perPower,
    contestedObserved: contestedObserved.length,
    safestIs115,
    meanObservedSuccessPrior: mean(observedStates.map((state) => at(state, 0).receptionSuccessPrior)),
    meanPriorSuccessPrior: mean(priorStates.map((state) => at(state, 0).receptionSuccessPrior)),
    priorBandsUsed: [...new Set(observedStates.map((state) => at(state, 0).priorBand))].sort(),
  };
};

const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const census = runCensus(CENSUS_SEED_START);
  const holdout = runCensus(HOLDOUT_SEED_START);
  const pricing = runPricing();

  const calibration = census.table.map((row, index) => {
    const other = holdout.table[index];
    return {
      band: `${row.bandFrom}-${row.bandTo}`,
      passesA: row.passes,
      passesB: other.passes,
      interceptedA: row.interceptedRate,
      interceptedB: other.interceptedRate,
      successA: row.receptionSuccessRate,
      successB: other.receptionSuccessRate,
      interceptedError: Math.abs(row.interceptedRate - other.interceptedRate),
      successError: Math.abs(row.receptionSuccessRate - other.receptionSuccessRate),
    };
  });
  const marginalCalibration = {
    passesA: census.marginal.passes,
    passesB: holdout.marginal.passes,
    interceptedError: Math.abs(census.marginal.interceptedRate - holdout.marginal.interceptedRate),
    successError: Math.abs(
      census.marginal.receptionSuccessRate - holdout.marginal.receptionSuccessRate,
    ),
  };

  const bandReality =
    census.table[census.table.length - 1].interceptedRate - census.table[0].interceptedRate;

  const exact = {
    // X6: the committed data module IS this run's measurement.
    committedTableMatchesCensus: PASS_PRIOR_TABLE.length === census.table.length
      && PASS_PRIOR_TABLE.every((row, index) => rowsEqual(row, census.table[index]))
      && rowsEqual(PASS_PRIOR_MARGINAL, census.marginal),
    // X5: E0's own numbers, reproduced by the observed half of the layer.
    reproducesE0: pricing.acceptedStates === E0_REQUIRED_STATES
      && pricing.observedStates === E0_BANKED_OBSERVED
      && pricing.priorStates === E0_BANKED_UNSEEN
      && pricing.safestIs115 === E0_BANKED_SAFEST_115
      && pricing.perPower.every((entry, index) => (
        round(entry.interceptionThreatSeconds) === E0_BANKED_THREAT[index]
        && round(entry.flightSeconds) === E0_BANKED_FLIGHT[index]
        && round(entry.arrivalSpeed, 2) === E0_BANKED_ARRIVAL[index]
      ))
      && round(pricing.perPower[0].touchFailPrior, 4) === E0_BANKED_TOUCH[0]
      && round(pricing.perPower[2].touchFailPrior, 4) === E0_BANKED_TOUCH[1],
  };
  const completeness = {
    p1AllPriced: pricing.optionsPriced === E0_REQUIRED_STATES * E0_POWERS.length
      && pricing.nulls === 0,
    p1SourceSplit: pricing.observedStates === E0_BANKED_OBSERVED
      && pricing.priorStates === E0_BANKED_UNSEEN && pricing.mixedStates === 0,
    p1UnknownReadsUnknown: pricing.priorWithPhysics === 0,
  };
  const calibrationGates = {
    p2Bands: calibration.every((entry) =>
      entry.interceptedError <= BAND_TOLERANCE && entry.successError <= BAND_TOLERANCE),
    p2Marginal: marginalCalibration.interceptedError <= MARGINAL_TOLERANCE
      && marginalCalibration.successError <= MARGINAL_TOLERANCE,
  };
  const notLooking = {
    p3ObservedAtLeastPrior: pricing.meanObservedSuccessPrior >= pricing.meanPriorSuccessPrior,
  };

  const pass = Object.values(exact).every(Boolean)
    && Object.values(completeness).every(Boolean)
    && Object.values(calibrationGates).every(Boolean)
    && Object.values(notLooking).every(Boolean);

  return {
    experiment: 'EDS-E2a',
    authority: 'EDS-E2A-CENSUS-PRIORS',
    parameters: {
      censusSeedStart: CENSUS_SEED_START,
      holdoutSeedStart: HOLDOUT_SEED_START,
      censusMatches: CENSUS_MATCHES,
      bands: PASS_PRIOR_BANDS,
      bandTolerance: BAND_TOLERANCE,
      marginalTolerance: MARGINAL_TOLERANCE,
    },
    census: { table: census.table, marginal: census.marginal, adjudication: census.adjudicationSplit },
    holdout: { table: holdout.table, marginal: holdout.marginal },
    calibration,
    marginalCalibration,
    pricing,
    routing: {
      bandRealityDelta: bandReality,
      // P4: decided in advance, both arms pre-registered.
      e2bPricesObservedOptionsAt: bandReality >= BAND_REALITY_THRESHOLD ? 'band' : 'marginal',
    },
    exact,
    completeness,
    calibrationGates,
    notLooking,
    verdict: pass ? 'PASS' : 'FAIL',
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
  `EDS-E2a ${output.verdict} · X6 ${output.exact.committedTableMatchesCensus}`
  + ` · X5 ${output.exact.reproducesE0}`
  + ` · priced ${output.pricing.optionsPriced} (${output.pricing.observedStates} obs / ${output.pricing.priorStates} prior)`
  + ` · marginal success ${(output.census.marginal.receptionSuccessRate * 100).toFixed(2)}%`
  + ` · band reality ${(output.routing.bandRealityDelta * 100).toFixed(2)}pp → ${output.routing.e2bPricesObservedOptionsAt}`
  + ` · SHA ${sha256}`,
);
