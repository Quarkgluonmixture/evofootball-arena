// EDS E1a FIRST-TOUCH INSTRUMENT.
// Authority: docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md
//
// Three reception measurements contradict each other, so this builds one taken
// at the REAL adjudication inside attemptFirstTouch and logs the term
// decomposition per event. Three questions: does the flag change the world (it
// must not), can the instrument recover the formula's own speed term where that
// term provably exists, and does the E0b inversion survive a clean adjudication?
import { createHash } from 'node:crypto';
import { laneOpenness } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { touchFailChance, type FirstTouchTraceEntry } from '../../src/sim/mechanics';
import { randomGenome, type TacticalGenome, GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, randomSquad, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { v2 } from '../../src/utils/vec';

const SEED_START = Number(process.argv[2] ?? 93_000);
const I2_STATES = Number(process.argv[3] ?? 120);
const I2_MAX_SEEDS = 512;
const SWEEP_SEEDS = Number(process.argv[4] ?? 700);
const MATCH_DURATION = 240;
const SAMPLE_TICKS = Math.round(1 / DT);
const POWERS = [0.85, 1.00001, 1.15] as const;
const SPEED_BUCKETS = [7, 9, 11, 13] as const;
const BUCKET_TOLERANCE = 0.6; // ±0.6 m/s around each bucket centre
const MIN_BUCKET_EVENTS = 400;
const MIN_I2_EVENTS_PER_POWER = 40;
const RECEIVER_SPEED_MAX = 0.5;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const CONTESTED_LANE_MAX = 0.5;
const FLIGHT_TICKS = 180;

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

const neutralAttrs = (): PlayerAttributes => {
  const attrs = {} as PlayerAttributes;
  for (const key of ATTR_KEYS) attrs[key] = 0.5;
  return attrs;
};
const neutralGenome = (): TacticalGenome => {
  const genome = {} as TacticalGenome;
  for (const key of GENE_KEYS) genome[key] = 0.5;
  return genome;
};
/** A held world for the sweeps: neutral bodies, so only speed varies. */
const staticTeam = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
  genome: neutralGenome(),
  squad: Array.from({ length: TEAM_SIZE }, () => neutralAttrs()),
});

const mean = (values: readonly number[]): number =>
  (values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length);

const resultSignature = (match: Match): string => JSON.stringify({
  tick: match.simTick,
  score: match.score,
  phase: match.phase,
  ball: { pos: match.ball.pos, vel: match.ball.vel, z: match.ball.z, vz: match.ball.vz },
  rng: (match.rng as unknown as { s: number }).s,
  players: match.allPlayers.map((player) => ({
    gid: player.gid, pos: player.pos, vel: player.vel, heading: player.heading,
  })),
});

/** Zero-behaviour proof: the same seed with the flag on and off must agree. */
const behaviourIdentical = (seed: number): boolean => {
  const signatures = [false, true].map((traceFirstTouch) => {
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: 120,
      traceFirstTouch,
    });
    while (!match.finished) match.step(DT);
    return resultSignature(match);
  });
  return signatures[0] === signatures[1];
};

/**
 * I1 — the instrument against known physics. One isolated stationary receiver
 * facing an incoming ball, every opponent parked far away, so pressure and
 * blind-side are held near zero and only arrival speed varies.
 */
const runSweeps = () => {
  const events: FirstTouchTraceEntry[] = [];
  for (let seed = 0; seed < SWEEP_SEEDS; seed++) {
    for (const bucket of SPEED_BUCKETS) {
      const match = new Match({
        seed: seed * 31 + bucket * 7,
        teamA: staticTeam('A'),
        teamB: staticTeam('B'),
        duration: 60,
        traceFirstTouch: true,
      });
      // Get past the kickoff restart FIRST: a staged ball placed during a
      // restart is reset by the engine, which is why the first cut logged zero
      // events. Only stage once the ball is genuinely in play.
      for (let tick = 0; tick < 600 && match.phase !== 'playing'; tick++) match.step(DT);
      if (match.phase !== 'playing') continue;
      const receiver = match.teams[0].players[3];
      // Park everyone else out of the way: no pressure, no rival claim.
      for (const player of match.allPlayers) {
        if (player === receiver) continue;
        player.pos = v2(player.side === 0 ? -45 : 45, player.gid % 2 === 0 ? -28 : 28);
        player.vel = v2(0, 0);
        player.action = { type: 'HoldPosition', scores: [] };
        player.decisionTimer = Number.POSITIVE_INFINITY;
      }
      receiver.pos = v2(0, 0);
      receiver.vel = v2(0, 0);
      receiver.heading = v2(-1, 0); // facing the incoming ball
      receiver.action = { type: 'HoldPosition', scores: [] };
      receiver.decisionTimer = Number.POSITIVE_INFINITY;
      receiver.kickCooldown = 0;
      // Roll the ball at the receiver's face at the bucket's speed.
      match.ball.owner = null;
      // 2.2m: close enough that friction barely bites, so the ARRIVAL speed is
      // the bucket speed. (First cut launched from 6m and every event landed
      // between the buckets.)
      match.ball.pos = v2(-2.2, 0);
      // Launch a touch hot so the ARRIVAL speed lands on the bucket centre:
      // 2.2m of the engine's friction costs ~0.75 m/s.
      match.ball.vel = v2(bucket + 0.75, 0);
      match.ball.z = 0;
      match.ball.vz = 0;
      const before = match.firstTouchTrace.length;
      for (let tick = 0; tick < 90 && match.firstTouchTrace.length === before; tick++) {
        // Hold the held conditions: everyone but the receiver stays parked, so
        // pressure and rival claims cannot creep back in mid-flight.
        for (const player of match.allPlayers) {
          if (player === receiver) continue;
          player.vel = v2(0, 0);
          player.action = { type: 'HoldPosition', scores: [] };
          player.decisionTimer = Number.POSITIVE_INFINITY;
        }
        // Pin the receiver outright: HoldPosition still drifts a little, and the
        // drift showed up as misalign 0.24 in the first cut. Held means held.
        receiver.pos = v2(0, 0);
        receiver.vel = v2(0, 0);
        receiver.heading = v2(-1, 0);
        receiver.action = { type: 'HoldPosition', scores: [] };
        receiver.decisionTimer = Number.POSITIVE_INFINITY;
        match.step(DT);
        if (match.phase !== 'playing') break;
      }
      for (let index = before; index < match.firstTouchTrace.length; index++) {
        events.push(match.firstTouchTrace[index]);
      }
    }
  }
  return SPEED_BUCKETS.map((bucket) => {
    const inBucket = events.filter((event) => (
      Math.abs(event.relativeSpeed - bucket) <= BUCKET_TOLERANCE
      && event.pressure <= 0.05 && event.misalign <= 0.15
    ));
    const spilled = inBucket.filter((event) => !event.clean).length;
    return {
      bucket,
      events: inBucket.length,
      empiricalSpillRate: inBucket.length === 0 ? 0 : spilled / inBucket.length,
      meanLoggedPFail: mean(inBucket.map((event) => event.pFail)),
      meanPressure: mean(inBucket.map((event) => event.pressure)),
      meanMisalign: mean(inBucket.map((event) => event.misalign)),
      formulaAtBucket: touchFailChance(bucket, 0, 0, 0.5, 0.5),
    };
  });
};

/**
 * I2 — settle the E0b inversion. C1-A2's isolated states, the same three powers,
 * but the reception outcome now read from the real adjudication with its terms.
 */
const runInversion = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  const byPower = new Map<number, FirstTouchTraceEntry[]>(POWERS.map((power) => [power, []]));
  const contestedByPower = new Map<number, FirstTouchTraceEntry[]>(
    POWERS.map((power) => [power, []]),
  );

  for (
    let seed = SEED_START;
    seed < SEED_START + I2_MAX_SEEDS && acceptedStates < I2_STATES;
    seed++
  ) {
    scannedSeeds++;
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
      traceFirstTouch: true,
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
      const candidates = match.teams[carrier.side].players
        .filter((player) => (
          player !== carrier && !player.sentOff && player.role !== 'GK'
          && Math.hypot(player.vel.x, player.vel.y) <= RECEIVER_SPEED_MAX
          && Math.hypot(player.pos.x - carrier.pos.x, player.pos.y - carrier.pos.y) >= MIN_PASS_DISTANCE
          && Math.hypot(player.pos.x - carrier.pos.x, player.pos.y - carrier.pos.y) <= MAX_PASS_DISTANCE
        ))
        .sort((left, right) => (
          Math.hypot(left.pos.x - carrier.pos.x, left.pos.y - carrier.pos.y)
          - Math.hypot(right.pos.x - carrier.pos.x, right.pos.y - carrier.pos.y)
          || left.gid - right.gid
        ));
      const target = candidates[0];
      if (!target) continue;
      const contested = laneOpenness(carrier.pos, target.pos, opponents) <= CONTESTED_LANE_MAX;
      const frozen = cloneSimulationState(match);
      accepted = true;
      acceptedStates++;
      for (const power of POWERS) {
        const branch = cloneSimulationState(frozen);
        // The clone carries the trace flag; start this branch's log clean.
        branch.firstTouchTrace.length = 0;
        const passer = branch.allPlayers.find((player) => player.gid === carrier.gid);
        const mate = branch.allPlayers.find((player) => player.gid === target.gid);
        if (!passer || !mate) continue;
        branch.performPass(passer, mate, false, power);
        for (let tick = 0; tick < FLIGHT_TICKS; tick++) {
          branch.step(DT);
          if (branch.phase !== 'playing') break;
          // The first adjudication involving the intended target ends the branch.
          if (branch.firstTouchTrace.some((event) => event.gid === target.gid)) break;
        }
        const event = branch.firstTouchTrace.find((entry) => entry.gid === target.gid);
        if (!event) continue;
        byPower.get(power)!.push(event);
        if (contested) contestedByPower.get(power)!.push(event);
      }
    }
  }

  const perPower = POWERS.map((power) => {
    const events = byPower.get(power)!;
    return {
      power,
      events: events.length,
      cleanRate: events.length === 0 ? 0 : events.filter((e) => e.clean).length / events.length,
      meanRelativeSpeed: mean(events.map((e) => e.relativeSpeed)),
      meanPressure: mean(events.map((e) => e.pressure)),
      meanMisalign: mean(events.map((e) => e.misalign)),
      meanPFail: mean(events.map((e) => e.pFail)),
      // The decomposition: each term's own contribution at the logged means.
      speedTerm: mean(events.map((e) => Math.min(Math.max((e.relativeSpeed - 6) / 8, 0), 1) * 0.07)),
      pressureTerm: mean(events.map((e) => e.pressure * 0.1 * (1 - (e.positioning - 0.5) * 0.6))),
      misalignTerm: mean(events.map((e) => e.misalign * 0.05 * (1 - (e.positioning - 0.5) * 0.6))),
    };
  });
  return { scannedSeeds, acceptedStates, perPower };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const behaviourSeeds = [7001, 7002, 7003];
  const behaviourIdenticalAll = behaviourSeeds.every(behaviourIdentical);
  const sweeps = runSweeps();
  const inversion = runInversion();

  const bucketsMonotone = sweeps.every((entry, index) =>
    index === 0 || entry.empiricalSpillRate > sweeps[index - 1].empiricalSpillRate);
  const bucketsCalibrated = sweeps.every((entry) =>
    Math.abs(entry.empiricalSpillRate - entry.meanLoggedPFail) <= 0.02);
  const bucketsSampled = sweeps.every((entry) => entry.events >= MIN_BUCKET_EVENTS);
  const i2Sampled = inversion.perPower.every((entry) => entry.events >= MIN_I2_EVENTS_PER_POWER);

  // The adjudication I2 exists to make.
  const speedRise = inversion.perPower[2].speedTerm - inversion.perPower[0].speedTerm;
  const pressureFall = inversion.perPower[0].pressureTerm - inversion.perPower[2].pressureTerm;
  const cleanRateRises = inversion.perPower[2].cleanRate > inversion.perPower[0].cleanRate;
  const pressureFallsWithPower =
    inversion.perPower[2].meanPressure < inversion.perPower[0].meanPressure;
  const verdictOnInversion = !i2Sampled
    ? 'undecided'
    : !cleanRateRises
      ? 'contamination: the inversion vanishes under the clean adjudication'
      : pressureFallsWithPower && pressureFall >= speedRise
        ? 'pressure-relief confound CONFIRMED: the pressure term falls further than the speed term rises'
        : 'unexplained: the inversion survives but the decomposition does not account for it';

  const exact = {
    behaviourIdentical: behaviourIdenticalAll,
    sweepSampled: bucketsSampled,
    i2Sampled,
    i2Accepted: inversion.acceptedStates === I2_STATES,
    scannedSeeds: inversion.scannedSeeds <= I2_MAX_SEEDS,
  };
  const instrument = {
    i1Monotone: bucketsMonotone,
    i1Calibrated: bucketsCalibrated,
    i2Decided: verdictOnInversion !== 'undecided'
      && verdictOnInversion.startsWith('unexplained') === false,
  };
  const pass = Object.values(exact).every(Boolean) && Object.values(instrument).every(Boolean);
  return {
    experiment: 'EDS-E1a',
    authority: 'EDS-E1A-FIRST-TOUCH-INSTRUMENT',
    parameters: {
      seedStart: SEED_START,
      i2States: I2_STATES,
      i2MaxSeeds: I2_MAX_SEEDS,
      sweepSeeds: SWEEP_SEEDS,
      speedBuckets: SPEED_BUCKETS,
      bucketTolerance: BUCKET_TOLERANCE,
      minBucketEvents: MIN_BUCKET_EVENTS,
      powers: POWERS,
    },
    behaviour: { seeds: behaviourSeeds, identical: behaviourIdenticalAll },
    i1Sweeps: sweeps,
    i2Inversion: inversion,
    adjudication: {
      speedTermRise: speedRise,
      pressureTermFall: pressureFall,
      cleanRateRises,
      pressureFallsWithPower,
      verdict: verdictOnInversion,
    },
    exact,
    instrument,
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
  `EDS-E1a ${output.verdict} · behaviourIdentical ${output.behaviour.identical}`
  + ` · sweeps ${output.i1Sweeps.map((s) => `${s.bucket}:${s.events}/${s.empiricalSpillRate.toFixed(3)}vs${s.meanLoggedPFail.toFixed(3)}`).join(' ')}`
  + ` · cleanRate ${output.i2Inversion.perPower.map((p) => p.cleanRate.toFixed(3)).join('/')}`
  + ` · ${output.adjudication.verdict}`
  + ` · SHA ${sha256}`,
);
