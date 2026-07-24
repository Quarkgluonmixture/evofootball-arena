// EDS E1b FLAGGED TOUCH-COST CURVE.
// Authority: docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md
//
// C1-B's one-liner returns behind Match.edsTouchCost, default OFF, and is
// judged by the E1a instrument instead of by a live calibrate. Three questions:
// is the flag really a flag (nothing moves with it off), does the curve land at
// the real adjudication exactly as the analytic prediction says (per bucket,
// against an interval sized before the run), and can the dormant E0 evaluator
// now SEE a cost of the right order — the always-heavy canary E3 will otherwise
// discover the expensive way.
import { createHash } from 'node:crypto';
import { laneOpenness } from '../../src/ai/perception';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption, type PassOptionValue } from '../../src/ai/passOptionValue';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { TOUCH_SPEED_COST, touchFailChance, type FirstTouchTraceEntry } from '../../src/sim/mechanics';
import { randomGenome, type TacticalGenome, GENE_KEYS } from '../../src/evolution/genome';
import { ATTR_KEYS, randomSquad, type PlayerAttributes } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { v2 } from '../../src/utils/vec';

// --- frozen parameters (contract §3, §4) ------------------------------------
const SWEEP_REPS = Number(process.argv[2] ?? 1300);
const CHECKPOINT_REPS = 300; // X5: where E1a's banked I1 run ended
const MIN_BUCKET_EVENTS = 11_300; // §3.2, computed before the run
const SPEED_BUCKETS = [7, 9, 11, 13] as const;
const BUCKET_TOLERANCE = 0.6;
const CALIBRATION_TOLERANCE = 0.02; // F1c, I1's gate verbatim
const DELTA_BAND = 0.0125; // F1d, >= 3 sigma in every bucket
const SPEED_SHARE_FLOOR = 0.95; // F2a
const CHANNEL_LEAK_MAX = 0.0005; // F2a, 0.05pp
const MISALIGN_EQUIVALENCE = 0.01; // F2b
const CANARY_SPREAD_FLOOR = 0.06; // C1

// I1 staging, copied from the frozen E1a probe so both arms run the world E1a
// certified. X5 is what proves the copy did not drift.
const SWEEP_POWERS = [0.85, 0.90, 0.95, 1.00, 1.05, 1.10, 1.15] as const;
const SWEEP_DISTANCES = [6, 9, 12, 15, 18, 21, 24, 27, 30] as const;
const SWEEP_HOT_POWERS = [1.10, 1.15] as const;
const SWEEP_HOT_DISTANCES = [12, 15, 18, 21, 24, 27] as const;
const SWEEP_HOT_PASSES = 4;
const SWEEP_COLD_POWERS = [0.85, 0.90] as const;
const SWEEP_COLD_PASSES = 2;
const SWEEP_PASSER_X = -24;
const SWEEP_FLIGHT_TICKS = 240;
const SWEEP_MAX_PRESSURE = 0.05;
const SWEEP_MAX_MISALIGN = 0.15;
const SWEEP_SEED_BASE = 5_100_000;

// E1a's banked I1 numbers (contract §4 X5, EDS-E1A §6).
const I1_BANKED_EVENTS = [2780, 4302, 4478, 2864] as const;
const I1_BANKED_SPILL = [
  0.016906474820143885, 0.03277545327754533, 0.04756587762393926, 0.06494413407821228,
] as const;

// E0's banked prediction numbers (EDS-E0 §7), for C1/C2/C3.
const E0_SEED_START = 93_000;
const E0_REQUIRED_STATES = 120;
const E0_MAX_SEEDS = 512;
const E0_AWARENESS = 0.8;
const E0_POWERS = [0.85, 1.00001, 1.15] as const;
const E0_CONTESTED_LANE_MAX = 0.50;
const E0_MIN_PASS_DISTANCE = 6;
const E0_MAX_PASS_DISTANCE = 30;
const E0_RECEIVER_SPEED_MAX = 0.5;
const E0_FLIGHT_TICKS = 180;
const E0_BANKED_THREAT = [0.843, 0.586, 0.446] as const;
const E0_BANKED_FLIGHT = [1.713, 1.303, 1.061] as const;
const E0_BANKED_ARRIVAL = [5.99, 8.69, 11.39] as const;
const E0_BANKED_TOUCH = [0.0734, 0.1129] as const; // 0.85 and 1.15 arms
const E0_BANKED_SAFEST_115 = 52;

const MATCH_DURATION = 240;
const SAMPLE_TICKS = Math.round(1 / DT);
const DIAGNOSTIC_MATCHES = 12;

const mean = (values: readonly number[]): number =>
  (values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length);
const round = (value: number, places = 3): number => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};

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
const staticTeam = (name: string): TeamInfo => ({
  id: name,
  name,
  short: name.slice(0, 3).toUpperCase(),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
  genome: neutralGenome(),
  squad: Array.from({ length: TEAM_SIZE }, () => neutralAttrs()),
});

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

/** X2/X2b: the flag must leave the default path alone and must move the ON one. */
const signatureFor = (seed: number, edsTouchCost: boolean): string => {
  const match = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: 120,
    edsTouchCost,
  });
  while (!match.finished) match.step(DT);
  return createHash('sha256').update(resultSignature(match)).digest('hex');
};

// --- the term decomposition (F2) --------------------------------------------
// Exactly the terms `touchFailChance` composes, read back per event so a
// measured change can be attributed to a channel rather than asserted.
const techniqueMultiplier = (technique: number): number => 1.3 - technique * 0.85;
const awareness = (positioning: number): number => 1 - (positioning - 0.5) * 0.6;
const speedChannel = (event: FirstTouchTraceEntry, heavy: boolean): number => {
  const cost = heavy ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;
  const ramp = Math.min(Math.max((event.relativeSpeed - 6) / cost.span, 0), 1);
  return ramp * cost.weight * techniqueMultiplier(event.technique);
};
const pressureChannel = (event: FirstTouchTraceEntry): number =>
  event.pressure * 0.1 * awareness(event.positioning) * techniqueMultiplier(event.technique);
const misalignChannel = (event: FirstTouchTraceEntry): number =>
  event.misalign * 0.05 * awareness(event.positioning) * techniqueMultiplier(event.technique);

interface BucketStats {
  readonly bucket: number;
  readonly events: number;
  readonly empiricalSpillRate: number;
  readonly meanLoggedPFail: number;
  readonly meanRelativeSpeed: number;
  readonly meanPressure: number;
  readonly meanMisalign: number;
  readonly speedChannel: number;
  readonly pressureChannel: number;
  readonly misalignChannel: number;
}

const bucketise = (
  events: readonly FirstTouchTraceEntry[], heavy: boolean,
): BucketStats[] => SPEED_BUCKETS.map((bucket) => {
  const inBucket = events.filter((event) => (
    Math.abs(event.relativeSpeed - bucket) <= BUCKET_TOLERANCE
    && event.pressure <= SWEEP_MAX_PRESSURE && event.misalign <= SWEEP_MAX_MISALIGN
  ));
  const spilled = inBucket.filter((event) => !event.clean).length;
  return {
    bucket,
    events: inBucket.length,
    empiricalSpillRate: inBucket.length === 0 ? 0 : spilled / inBucket.length,
    meanLoggedPFail: mean(inBucket.map((event) => event.pFail)),
    meanRelativeSpeed: mean(inBucket.map((event) => event.relativeSpeed)),
    meanPressure: mean(inBucket.map((event) => event.pressure)),
    meanMisalign: mean(inBucket.map((event) => event.misalign)),
    speedChannel: mean(inBucket.map((event) => speedChannel(event, heavy))),
    pressureChannel: mean(inBucket.map((event) => pressureChannel(event))),
    misalignChannel: mean(inBucket.map((event) => misalignChannel(event))),
  };
});

/**
 * One arm of the OFF/ON contrast on E1a's certified I1 staging: a pinned passer
 * plays a real intended pass to a pinned, isolated teammate facing him, power
 * and distance sweeping the arrival speed. Both arms walk the identical staging
 * schedule; their RNG streams diverge once an outcome differs, which is why the
 * gates are sized against between-arms sampling error.
 */
const runSweep = (heavy: boolean) => {
  let match: Match | null = null;
  let seedCounter = SWEEP_SEED_BASE;
  const freshMatch = (): Match => {
    const created = new Match({
      seed: seedCounter++,
      teamA: staticTeam('A'),
      teamB: staticTeam('B'),
      duration: 6000,
      traceFirstTouch: true,
      edsTouchCost: heavy,
    });
    for (let tick = 0; tick < 600 && created.phase !== 'playing'; tick++) created.step(DT);
    return created;
  };
  const hold = (world: Match, passer: Player, receiver: Player, distance: number): void => {
    for (const player of world.allPlayers) {
      if (player === passer || player === receiver) continue;
      player.pos = v2(player.side === 0 ? -44 : 44, player.gid % 2 === 0 ? -27 : 27);
      player.vel = v2(0, 0);
      player.action = { type: 'HoldPosition', scores: [] };
      player.decisionTimer = Number.POSITIVE_INFINITY;
    }
    receiver.pos = v2(SWEEP_PASSER_X + distance, 0);
    receiver.vel = v2(0, 0);
    receiver.heading = v2(-1, 0);
    receiver.action = { type: 'HoldPosition', scores: [] };
    receiver.decisionTimer = Number.POSITIVE_INFINITY;
  };

  const events: FirstTouchTraceEntry[] = [];
  const checkpoint: FirstTouchTraceEntry[] = []; // the first CHECKPOINT_REPS reps
  let attempts = 0;
  let adjudicated = 0;
  let rep = 0;
  const trial = (distance: number, power: number): void => {
    attempts++;
    if (match === null || match.finished || match.phase !== 'playing') match = freshMatch();
    if (match.phase !== 'playing') return;
    const passer = match.teams[0].players[2];
    const receiver = match.teams[0].players[3];
    hold(match, passer, receiver, distance);
    passer.pos = v2(SWEEP_PASSER_X, 0);
    passer.vel = v2(0, 0);
    passer.heading = v2(1, 0);
    passer.action = { type: 'HoldPosition', scores: [] };
    passer.decisionTimer = Number.POSITIVE_INFINITY;
    passer.firstTouchWindow = 0;
    receiver.kickCooldown = 0;
    match.giveBall(passer);
    passer.kickCooldown = 0;
    const before = match.firstTouchTrace.length;
    match.performPass(passer, receiver, true, power);
    for (let tick = 0; tick < SWEEP_FLIGHT_TICKS; tick++) {
      hold(match, passer, receiver, distance);
      match.step(DT);
      if (match.phase !== 'playing') break;
      if (match.firstTouchTrace.length > before) break;
    }
    const event = match.firstTouchTrace
      .slice(before)
      .find((entry) => entry.gid === receiver.gid && entry.intendedTarget);
    if (!event) return;
    adjudicated++;
    events.push(event);
    if (rep < CHECKPOINT_REPS) checkpoint.push(event);
  };

  for (rep = 0; rep < SWEEP_REPS; rep++) {
    for (const power of SWEEP_POWERS) {
      for (const distance of SWEEP_DISTANCES) trial(distance, power);
    }
    for (let pass = 0; pass < SWEEP_HOT_PASSES; pass++) {
      for (const power of SWEEP_HOT_POWERS) {
        for (const distance of SWEEP_HOT_DISTANCES) trial(distance, power);
      }
    }
    for (let pass = 0; pass < SWEEP_COLD_PASSES; pass++) {
      for (const power of SWEEP_COLD_POWERS) {
        for (const distance of SWEEP_DISTANCES) trial(distance, power);
      }
    }
  }

  return {
    buckets: bucketise(events, heavy),
    checkpoint: bucketise(checkpoint, heavy),
    staging: {
      attempts,
      adjudicated,
      adjudicationRate: attempts === 0 ? 0 : adjudicated / attempts,
    },
  };
};

// --- F3: the always-heavy canary, on E0's own states -------------------------
// E0's state acceptance is reproduced faithfully — including the branch strike
// that decides whether a state is accepted at all — because C3 asks the copy to
// return E0's banked numbers exactly. Only the evaluator call is doubled.
const findPlayer = (match: Match, gid: number) =>
  match.allPlayers.find((player) => player.gid === gid) ?? null;
const distanceBetween = (
  left: Readonly<{ x: number; y: number }>, right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);

/** E0's runBranch, kept only for its ACCEPTANCE effect (a state whose branches
 * do not strike is skipped, which shifts every state after it). */
const branchStruck = (
  frozen: Match, passerGid: number, targetGid: number, power: number,
): boolean => {
  const match = cloneSimulationState(frozen);
  const passer = findPlayer(match, passerGid);
  const target = findPlayer(match, targetGid);
  if (!passer || !target) return false;
  match.performPass(passer, target, false, power);
  const launchSpeed = Math.hypot(match.ball.vel.x, match.ball.vel.y);
  if (launchSpeed === 0) return false;
  for (let tick = 1; tick <= E0_FLIGHT_TICKS; tick++) {
    match.step(DT);
    const toucher = match.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) break;
    if (match.phase !== 'playing') break;
  }
  return true;
};

interface CanaryPrediction {
  readonly power: number;
  readonly flightSeconds: number;
  readonly arrivalSpeed: number;
  readonly interceptionThreatSeconds: number;
  readonly touchFailPriorBase: number;
  readonly touchFailPriorHeavy: number;
}

const runCanary = () => {
  let scannedSeeds = 0;
  let acceptedStates = 0;
  const states: { contested: boolean; predictions: CanaryPrediction[] }[] = [];

  for (
    let seed = E0_SEED_START;
    seed < E0_SEED_START + E0_MAX_SEEDS && acceptedStates < E0_REQUIRED_STATES;
    seed++
  ) {
    scannedSeeds++;
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
          && distanceBetween(player.pos, carrier.pos) >= E0_MIN_PASS_DISTANCE
          && distanceBetween(player.pos, carrier.pos) <= E0_MAX_PASS_DISTANCE
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
      const attackDir = match.teams[carrier.side].attackDir;
      const valuation = (power: number, heavyTouchCost: boolean) => evaluatePassOption({
        snapshot: carrierSnapshot,
        passerGid: carrier.gid,
        targetGid: target.gid,
        powerMultiplier: power,
        attackDir,
        reachProfiles,
        heavyTouchCost,
      });
      const predictions: CanaryPrediction[] = [];
      E0_POWERS.forEach((power) => {
        const base: PassOptionValue | null = valuation(power, false);
        const heavy: PassOptionValue | null = valuation(power, true);
        if (base === null || heavy === null) return;
        predictions.push({
          power,
          flightSeconds: base.flightSeconds,
          arrivalSpeed: base.arrivalSpeed,
          interceptionThreatSeconds: base.interceptionThreatSeconds,
          touchFailPriorBase: base.touchFailPrior,
          touchFailPriorHeavy: heavy.touchFailPrior,
        });
      });
      const frozen = cloneSimulationState(match);
      const struck = E0_POWERS.every((power) => branchStruck(frozen, carrier.gid, target.gid, power));
      if (!struck) continue;
      accepted = true;
      acceptedStates++;
      states.push({ contested: lane <= E0_CONTESTED_LANE_MAX, predictions });
    }
  }

  const priced = states.filter((state) => state.predictions.length === E0_POWERS.length);
  const contestedPriced = priced.filter((state) => state.contested);
  const at = (state: { predictions: CanaryPrediction[] }, index: number) => state.predictions[index];
  const perPower = E0_POWERS.map((power, index) => ({
    power,
    flightSeconds: mean(priced.map((state) => at(state, index).flightSeconds)),
    arrivalSpeed: mean(priced.map((state) => at(state, index).arrivalSpeed)),
    interceptionThreatSeconds: mean(priced.map((state) => at(state, index).interceptionThreatSeconds)),
    touchFailPriorBase: mean(priced.map((state) => at(state, index).touchFailPriorBase)),
    touchFailPriorHeavy: mean(priced.map((state) => at(state, index).touchFailPriorHeavy)),
  }));
  // E0's own definition: safest = lowest predicted corridor threat.
  const safestIs115 = contestedPriced.filter((state) => {
    const ranked = [...state.predictions]
      .sort((left, right) => left.interceptionThreatSeconds - right.interceptionThreatSeconds);
    return ranked[0].power === E0_POWERS[2];
  }).length;
  return {
    scannedSeeds,
    acceptedStates,
    pricedStates: priced.length,
    contestedPriced: contestedPriced.length,
    safestIs115,
    perPower,
    spreadBase: perPower[2].touchFailPriorBase - perPower[0].touchFailPriorBase,
    spreadHeavy: perPower[2].touchFailPriorHeavy - perPower[0].touchFailPriorHeavy,
  };
};

// --- diagnostics (reported, never gates) ------------------------------------
const runMatchDiagnostic = (heavy: boolean) => {
  const events: FirstTouchTraceEntry[] = [];
  let miscontrols = 0;
  let goals = 0;
  for (let index = 0; index < DIAGNOSTIC_MATCHES; index++) {
    const seed = 880_000 + index;
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
      traceFirstTouch: true,
      edsTouchCost: heavy,
    });
    while (!match.finished) match.step(DT);
    events.push(...match.firstTouchTrace);
    miscontrols += match.teams[0].stats.miscontrols + match.teams[1].stats.miscontrols;
    goals += match.score[0] + match.score[1];
  }
  return {
    matches: DIAGNOSTIC_MATCHES,
    adjudications: events.length,
    miscontrolsPerMatch: miscontrols / DIAGNOSTIC_MATCHES,
    goalsPerMatch: goals / DIAGNOSTIC_MATCHES,
    spillRate: events.length === 0 ? 0 : events.filter((e) => !e.clean).length / events.length,
    meanPFail: mean(events.map((e) => e.pFail)),
    meanRelativeSpeed: mean(events.map((e) => e.relativeSpeed)),
    meanPressure: mean(events.map((e) => e.pressure)),
    meanMisalign: mean(events.map((e) => e.misalign)),
    speedChannel: mean(events.map((e) => speedChannel(e, heavy))),
    pressureChannel: mean(events.map((e) => pressureChannel(e))),
    misalignChannel: mean(events.map((e) => misalignChannel(e))),
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const behaviourSeeds = [7001, 7002, 7003];
  const behaviour = behaviourSeeds.map((seed) => ({
    seed,
    off: signatureFor(seed, false),
    on: signatureFor(seed, true),
  }));

  const off = runSweep(false);
  const on = runSweep(true);
  const canary = runCanary();
  const diagnosticOff = runMatchDiagnostic(false);
  const diagnosticOn = runMatchDiagnostic(true);

  // §3.1's analytic predictions, recomputed rather than pasted.
  const predictedDelta = SPEED_BUCKETS.map((bucket) => (
    touchFailChance(bucket, 0, 0, 0.5, 0.5, true) - touchFailChance(bucket, 0, 0, 0.5, 0.5, false)
  ));

  const contrast = SPEED_BUCKETS.map((bucket, index) => {
    const a = off.buckets[index];
    const b = on.buckets[index];
    const measuredDelta = b.empiricalSpillRate - a.empiricalSpillRate;
    const deltaPFail = b.meanLoggedPFail - a.meanLoggedPFail;
    const deltaSpeed = b.speedChannel - a.speedChannel;
    const deltaPressure = b.pressureChannel - a.pressureChannel;
    const deltaMisalign = b.misalignChannel - a.misalignChannel;
    return {
      bucket,
      offEvents: a.events,
      onEvents: b.events,
      offSpill: a.empiricalSpillRate,
      onSpill: b.empiricalSpillRate,
      onLoggedPFail: b.meanLoggedPFail,
      measuredDelta,
      predictedDelta: predictedDelta[index],
      deltaError: Math.abs(measuredDelta - predictedDelta[index]),
      calibrationError: Math.abs(b.empiricalSpillRate - b.meanLoggedPFail),
      deltaPFail,
      deltaSpeed,
      deltaPressure,
      deltaMisalign,
      speedShare: deltaPFail === 0 ? 0 : deltaSpeed / deltaPFail,
      misalignEquivalence: Math.abs(b.meanMisalign - a.meanMisalign),
    };
  });

  const exact = {
    // X2: the OFF path must be untouched — this run's OFF signatures are
    // compared against the pre-E1b HEAD outside the probe (see the result doc);
    // here the probe asserts the flag DOES something and is self-consistent.
    // X2b as amended (contract §4.1): at least one of three 120s matches must
    // diverge. Requiring all three is a coin flip — a short match holds only a
    // handful of adjudications, and a curve change flips one only when the
    // shared uniform lands between the two pFail values.
    flagMovesTheWorld: behaviour.some((entry) => entry.off !== entry.on),
    // X5: the OFF arm's first 300 reps must be E1a's banked I1 run.
    reproducesI1: off.checkpoint.every((entry, index) => (
      entry.events === I1_BANKED_EVENTS[index]
      && Math.abs(entry.empiricalSpillRate - I1_BANKED_SPILL[index]) < 1e-12
    )),
    sweepSampled: off.buckets.every((entry) => entry.events >= MIN_BUCKET_EVENTS)
      && on.buckets.every((entry) => entry.events >= MIN_BUCKET_EVENTS),
    canaryAccepted: canary.acceptedStates === E0_REQUIRED_STATES,
  };

  const onMonotone = on.buckets.every((entry, index) =>
    index === 0 || entry.empiricalSpillRate > on.buckets[index - 1].empiricalSpillRate);
  const fires = {
    f1a: exact.sweepSampled,
    f1b: onMonotone,
    f1c: contrast.every((entry) => entry.calibrationError <= CALIBRATION_TOLERANCE),
    f1d: contrast.every((entry) => entry.deltaError <= DELTA_BAND),
  };
  const decomposition = {
    f2aSpeedShare: contrast.every((entry) => entry.speedShare >= SPEED_SHARE_FLOOR),
    f2aPressureBounded: contrast.every((entry) => Math.abs(entry.deltaPressure) <= CHANNEL_LEAK_MAX),
    f2aMisalignBounded: contrast.every((entry) => Math.abs(entry.deltaMisalign) <= CHANNEL_LEAK_MAX),
    f2b: contrast.every((entry) => entry.misalignEquivalence <= MISALIGN_EQUIVALENCE),
  };
  const canaryGates = {
    c1: canary.spreadHeavy >= CANARY_SPREAD_FLOOR,
    c2: canary.perPower.every((entry, index) => (
      round(entry.interceptionThreatSeconds) === E0_BANKED_THREAT[index]
      && round(entry.flightSeconds) === E0_BANKED_FLIGHT[index]
      && round(entry.arrivalSpeed, 2) === E0_BANKED_ARRIVAL[index]
    )),
    c3: round(canary.perPower[0].touchFailPriorBase, 4) === E0_BANKED_TOUCH[0]
      && round(canary.perPower[2].touchFailPriorBase, 4) === E0_BANKED_TOUCH[1]
      && canary.safestIs115 === E0_BANKED_SAFEST_115,
  };

  const pass = Object.values(exact).every(Boolean)
    && Object.values(fires).every(Boolean)
    && Object.values(decomposition).every(Boolean)
    && Object.values(canaryGates).every(Boolean);

  return {
    experiment: 'EDS-E1b',
    authority: 'EDS-E1B-TOUCH-COST-CURVE',
    parameters: {
      sweepReps: SWEEP_REPS,
      checkpointReps: CHECKPOINT_REPS,
      minBucketEvents: MIN_BUCKET_EVENTS,
      speedBuckets: SPEED_BUCKETS,
      deltaBand: DELTA_BAND,
      curve: TOUCH_SPEED_COST,
    },
    behaviour,
    offArm: { buckets: off.buckets, checkpoint: off.checkpoint, staging: off.staging },
    onArm: { buckets: on.buckets, staging: on.staging },
    contrast,
    canary,
    diagnostics: { off: diagnosticOff, on: diagnosticOn },
    exact,
    fires,
    decomposition,
    canaryGates,
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
  `EDS-E1b ${output.verdict} · X5 reproducesI1 ${output.exact.reproducesI1}`
  + ` · deltas ${output.contrast.map((c) => `${c.bucket}:${(c.measuredDelta * 100).toFixed(2)}vs${(c.predictedDelta * 100).toFixed(2)}`).join(' ')}`
  + ` · canary spread ${(output.canary.spreadBase * 100).toFixed(2)}→${(output.canary.spreadHeavy * 100).toFixed(2)}pp`
  + ` · SHA ${sha256}`,
);
