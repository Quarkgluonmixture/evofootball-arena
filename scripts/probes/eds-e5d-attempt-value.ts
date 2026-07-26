// EDS E5d PHASE 0 — THE ATTEMPT-VALUE AXIS, judged before it is built.
// Authority: docs/world-model/EDS-E5D-ATTEMPT-VALUE.md §2.1, §4
//
// Ruling #17.2 named the composition itself as the third cause: P̂(clean) ×
// V̂(cell | clean) is nearly exact for ordinary balls (3.83% predicted vs 3.80%
// realized) and inverts precisely on the balls whose value flows through messy
// paths — the third man arrives cleanly 40% of the time and pays the most.
//
// So this removes a factor instead of adding one:
//
//   now   P̂(clean reception) × V̂(shot | CLEAN reception, destination cell)
//   E5d   EV̂(shot | ATTEMPT, destination cell × threat band)
//
// Every fork's window is simulated and counted — clean, spilled, intercepted,
// unadjudicated alike — which is also why E5a's unfollowed-window defect cannot
// exist here: there is no adjudication gate to be wrong about.
//
// Phase 0 spends nothing new. The table is built on E5a's own census population
// and judged on E5c (b)'s own pattern moments, and the judgment is about the
// DECISION: R1 the ordering sign, R2 whether the argmax actually changes hands.
import { createHash } from 'node:crypto';
import {
  advancePerceptionMemory, capturePerceptionTruth, createPerceptionMemory,
  materialisePerceptionSnapshot, type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption } from '../../src/ai/passOptionValue';
import {
  OPTION_SPACE_PRIOR_MARGINAL, optionSpacePriorAt, THREAT_CALIBRATION,
  VALUE_ZONE_MARGINAL, valueZoneAt, valueZoneIndex,
} from '../../src/ai/passPrior';
import type { KnownReachProfile } from '../../src/ai/reachability';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2.1, §4) ----------------------------------
// E5a's staging, verbatim.
const CENSUS_SEED_START = 700_000;
const HOLDOUT_SEED_START = 710_000;
const MOMENTS_PER_SET = Number(process.argv[2] ?? 4500);
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const VALUE_HORIZON_TICKS = 240;
const AWARENESS = 0.8;
const MAX_MATCHES_PER_SET = 4000;
// E5c (b)'s pattern staging, verbatim.
const PATTERN_SEED_START = 740_000;
const HARNESS_SEEDS = [740_001, 740_002, 740_003] as const;
const PATTERN_MOMENT_FLOOR = Number(process.argv[3] ?? 450);
const THIRD_MAN_WINDOW_SECONDS = 1.5;
const THIRD_MAN_MIN_GAIN = 0.15;
const WALL_RETURN_MIN_GAIN = 0.2;
// E5d's own frozen numbers.
const BANDS = THREAT_CALIBRATION.length;
const CELLS = 8;
const BUCKET_FLOOR = 200; // C1
const HELD_OUT_BUCKET_TOLERANCE = 0.05; // C2, 5.0pp
const HELD_OUT_MARGINAL_TOLERANCE = 0.015; // C2, 1.5pp
const DISCRIMINATION_FLOOR = 0.05; // C3, 5.0pp
const CALIBRATION_TOLERANCE = 0.02; // C3, 2.0pp
const ARGMAX_SHIFT_FLOOR = 0.05; // R2, +5.0pp
/**
 * E5a's committed marginal — X6's target.
 *
 * ⚠️ AMENDED BEFORE THE RUN (own commit, disclosed in §6.1). As first written,
 * X6 asked the attempt census's clean subset to return E5a's shot rate. That is
 * UNSATISFIABLE BY CONSTRUCTION and I should have seen it when freezing the
 * gate: ruling #17.3 says attempt-conditioning closes E5a's unfollowed-window
 * defect, so a defect-free census cannot reproduce a defective number. A
 * predicate that cannot be satisfied is the structurally undecidable kind
 * PROBE-CONTRACTS §2 outlawed after ruling #6.3, and E1b §4.1 is the precedent
 * for amending one before the run rather than reporting a guaranteed failure.
 *
 * The amended gate compares what CAN be equal if and only if the staging is
 * unchanged, which is what X6 was for:
 *   X6a the clean subset's COUNT is E5a's 7,864 exactly
 *   X6b its shot rate computed E5a's OWN way — unadjudicated arrivals forced to
 *       no-shot — is E5a's 0.07146490335707019 exactly
 * X6b isolates staging drift from the definition change; the difference between
 * it and the honest rate is the defect, reported as D5.
 */
const E5A_CLEAN_RECEPTIONS = 7864;
const E5A_CLEAN_SHOT_RATE = 0.07146490335707019;

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
const distanceBetween = (
  left: Readonly<{ x: number; y: number }>, right: Readonly<{ x: number; y: number }>,
): number => Math.hypot(left.x - right.x, left.y - right.y);
const clamp01 = (value: number): number => (value < 0 ? 0 : value > 1 ? 1 : value);
const matchOf = (seed: number): Match => new Match({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION,
  traceFirstTouch: true,
});
const signature = (match: Match): string => createHash('sha256').update(JSON.stringify({
  tick: match.simTick,
  score: match.score,
  phase: match.phase,
  ball: { pos: match.ball.pos, vel: match.ball.vel, z: match.ball.z, vz: match.ball.vz },
  rng: (match.rng as unknown as { s: number }).s,
  players: match.allPlayers.map((player) => ({
    gid: player.gid, pos: player.pos, vel: player.vel, heading: player.heading,
  })),
})).digest('hex');

const newPassKey = (
  match: Match, previousKey: string, kindBefore: Match['lastPassKind'],
): string | null => {
  const pending = match.pendingPass;
  if (!pending) return null;
  const kind = match.lastPassKind;
  if (kind === null || kind === kindBefore || kind.kind !== 'pass') return null;
  const key = `${pending.passerGid}:${pending.targetGid}:${pending.t}`;
  return key === previousKey ? null : key;
};

// --- X5: the fork must replay reality ---------------------------------------
const harnessReproduces = (seed: number): boolean => {
  const reference = matchOf(seed);
  const events: { tick: number; targetGid: number }[] = [];
  let key = '';
  while (!reference.finished) {
    const kindBefore = reference.lastPassKind;
    reference.step(DT);
    const fresh = newPassKey(reference, key, kindBefore);
    if (fresh !== null) {
      key = fresh;
      events.push({ tick: reference.simTick, targetGid: reference.pendingPass!.targetGid });
    }
  }
  const referenceSignature = signature(reference);
  const replay = matchOf(seed);
  let index = 0;
  while (!replay.finished) {
    const next = events[index];
    const arm = next !== undefined && replay.simTick + 1 === next.tick;
    if (arm) replay.forcedPassTarget = next.targetGid;
    replay.step(DT);
    if (arm) {
      replay.forcedPassTarget = null;
      index += 1;
    }
  }
  return signature(replay) === referenceSignature && index === events.length && events.length > 0;
};

// --- the licence predicates (`PlayerBrain.ts`, transcribed) -----------------
type Licence = 'third-man' | 'wall-return';
const licenceFor = (before: Match, passer: Player, mate: Player): Licence | null => {
  const attacking = before.teams[passer.side];
  const gain = clamp01(
    (attacking.localX(mate.pos.x) - attacking.localX(passer.pos.x) + 30) / 60,
  ) * 2 - 1;
  if (mate.wallRun !== null && before.simTime < mate.wallRun.until
    && mate.wallRun.partnerGid === passer.gid && gain > WALL_RETURN_MIN_GAIN) return 'wall-return';
  const lp = before.lastCompletedPass;
  if (lp && lp.receiverGid === passer.gid && before.simTime - lp.t < THIRD_MAN_WINDOW_SECONDS
    && lp.passerGid !== mate.gid && mate.action.type === 'MakeRun' && gain > THIRD_MAN_MIN_GAIN) {
    return 'third-man';
  }
  return null;
};

// --- one forced attempt, always followed to the horizon ---------------------
interface Attempt {
  readonly cell: number;
  /** Threat quintile of the passer's own corridor read; -1 when unreadable. */
  readonly band: number;
  /** The composed axis, exactly as the live chooser computes it. */
  readonly composed: number;
  /** Whether the intended man ended in clean control (E5a's condition). */
  readonly cleanReception: boolean;
  readonly adjudicated: boolean;
  readonly reached: boolean;
  /** THE outcome: the passing team took a shot inside the window. */
  readonly shot: boolean;
  readonly licence: Licence | null;
  readonly targetGid: number;
  readonly moment: number;
}

const bandOf = (threatSeconds: number): number => {
  for (let index = 0; index < THREAT_CALIBRATION.length; index++) {
    if (threatSeconds <= THREAT_CALIBRATION[index].keyTo) return index;
  }
  return THREAT_CALIBRATION.length - 1;
};
const quintilePrice = (threatSeconds: number): number => {
  for (const row of THREAT_CALIBRATION) if (threatSeconds <= row.keyTo) return row.realizedSuccess;
  return THREAT_CALIBRATION[THREAT_CALIBRATION.length - 1].realizedSuccess;
};

/**
 * Fork, force the target, and follow to the value horizon UNCONDITIONALLY. The
 * reception fields are still recorded — X6 needs the clean subset, and D5 needs
 * to show the unadjudicated class from the inside — but nothing gates the
 * window any more.
 */
const forceAndFollow = (
  before: Match,
  passerGid: number,
  candidate: Player,
  snapshot: PerceptionSnapshot | null,
  reachProfiles: ReadonlyMap<number, KnownReachProfile>,
  licence: Licence | null,
  moment: number,
): Attempt | null => {
  const passerBefore = before.allPlayers.find((player) => player.gid === passerGid);
  if (!passerBefore) return null;
  const attacking = before.teams[passerBefore.side];
  const cell = valueZoneIndex(attacking.localX(candidate.pos.x), candidate.pos.y);

  // The composed axis, from the passer's OWN percept — the shipped chooser's
  // arithmetic, so R1/R2 compare like with like.
  const seenTarget = snapshot?.players.find((entry) => entry.gid === candidate.gid);
  const seenPasser = snapshot?.players.find((entry) => entry.gid === passerGid);
  let band = -1;
  let composed: number;
  if (snapshot === undefined || snapshot === null || !seenTarget || !seenPasser) {
    composed = (OPTION_SPACE_PRIOR_MARGINAL.reachedRate
      * OPTION_SPACE_PRIOR_MARGINAL.cleanGivenReached) * VALUE_ZONE_MARGINAL.shotRate;
  } else {
    const perceivedValue = valueZoneAt(
      seenTarget.pos.x * attacking.attackDir, seenTarget.pos.y,
    ).shotRate;
    const read = evaluatePassOption({
      snapshot,
      passerGid,
      targetGid: candidate.gid,
      powerMultiplier: 1,
      attackDir: attacking.attackDir,
      reachProfiles,
    });
    if (read === null) {
      const row = optionSpacePriorAt(distanceBetween(seenPasser.pos, seenTarget.pos));
      composed = row.reachedRate * row.cleanGivenReached * perceivedValue;
    } else {
      band = bandOf(read.interceptionThreatSeconds);
      composed = quintilePrice(read.interceptionThreatSeconds) * perceivedValue;
    }
  }

  const fork = cloneSimulationState(before);
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  // Unplayable is still the absence of a pass, not an attempt at one.
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return null;
  }
  const kickTick = fork.simTick;
  const side = passerBefore.side;
  const attackingFork = fork.teams[side];
  const shotsBefore = attackingFork.stats.shots;
  let reached = false;
  let toucherGid = -1;
  for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
    fork.step(DT);
    const toucher = fork.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) {
      toucherGid = toucher.gid;
      reached = toucher.gid === candidate.gid;
      break;
    }
    if (fork.phase !== 'playing') break;
  }
  const touchTick = fork.simTick;
  if (reached) {
    for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
      fork.step(DT);
    }
  }
  const event = reached ? fork.firstTouchTrace.find((trace) => (
    trace.gid === toucherGid && trace.intendedTarget
    && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
  )) : undefined;
  const adjudicated = event !== undefined;
  // E5a's `succeeded()`: an arrival that is not an ADJUDICATED spill.
  const cleanReception = reached && !(adjudicated && !event!.clean);
  // THE change: the window runs for every attempt, whatever happened.
  while (fork.simTick - kickTick < VALUE_HORIZON_TICKS && fork.phase === 'playing') {
    fork.step(DT);
  }
  return {
    cell,
    band,
    composed,
    cleanReception,
    adjudicated,
    reached,
    shot: attackingFork.stats.shots > shotsBefore,
    licence,
    targetGid: candidate.gid,
    moment,
  };
};

/**
 * Walk a seed block and force every window candidate at every plain-ground-pass
 * moment. `patternOnly` restricts to moments where a licence fires, which is
 * E5c (b)'s population.
 */
const harvest = (input: {
  readonly seedStart: number;
  readonly momentBudget: number;
  readonly patternOnly: boolean;
}) => {
  const attempts: Attempt[] = [];
  let moments = 0;
  let matches = 0;
  for (
    let seed = input.seedStart;
    seed < input.seedStart + MAX_MATCHES_PER_SET && moments < input.momentBudget;
    seed++
  ) {
    matches += 1;
    const match = matchOf(seed);
    const memories = new Map<number, PerceptionMemory>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let key = '';
    while (!match.finished && moments < input.momentBudget) {
      const before = cloneSimulationState(match);
      const kindBefore = match.lastPassKind;
      // The memory chain advances every tick on the PRE-step truth, so the
      // snapshot at a decision moment is the state the passer decided from.
      const truth = capturePerceptionTruth(match);
      for (const player of match.allPlayers) {
        if (player.role === 'GK' || player.sentOff) continue;
        advancePerceptionMemory(truth, player.gid, AWARENESS, seed, memories.get(player.gid)!);
      }
      match.step(DT);
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null) continue;
      key = fresh;
      const pending = match.pendingPass!;
      const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
      if (!passerBefore) continue;
      const attacking = before.teams[passerBefore.side];
      const candidates = attacking.players.filter((player) => (
        player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
        && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
        && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
      ));
      if (candidates.length === 0) continue;
      const licences = new Map<number, Licence | null>(
        candidates.map((mate) => [mate.gid, licenceFor(before, passerBefore, mate)]),
      );
      if (input.patternOnly) {
        if (candidates.length < 2) continue;
        if (!candidates.some((mate) => licences.get(mate.gid) !== null)) continue;
      }
      moments += 1;
      const memory = memories.get(pending.passerGid);
      const snapshot = passerBefore.role === 'GK' || memory === undefined ? null
        : materialisePerceptionSnapshot(truth, pending.passerGid, AWARENESS, memory);
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed, accel: player.accel, dribbling: player.attrs.dribbling,
        }]),
      );
      for (const candidate of candidates) {
        const attempt = forceAndFollow(
          before, pending.passerGid, candidate, snapshot, reachProfiles,
          licences.get(candidate.gid) ?? null, moments,
        );
        if (attempt !== null) attempts.push(attempt);
      }
    }
  }
  return { attempts, moments, matches };
};

// --- the attempt table ------------------------------------------------------
interface Bucket {
  readonly cell: number;
  readonly band: number;
  readonly attempts: number;
  readonly shotRate: number;
}
const rateOf = (rows: readonly Attempt[]): number =>
  (rows.length === 0 ? 0 : rows.filter((row) => row.shot).length / rows.length);

const buildTable = (attempts: readonly Attempt[]) => {
  const buckets: Bucket[] = [];
  for (let cell = 0; cell < CELLS; cell++) {
    for (let band = 0; band < BANDS; band++) {
      const rows = attempts.filter((row) => row.cell === cell && row.band === band);
      buckets.push({ cell, band, attempts: rows.length, shotRate: rateOf(rows) });
    }
  }
  const cells = Array.from({ length: CELLS }, (_, cell) => {
    const rows = attempts.filter((row) => row.cell === cell);
    return { cell, attempts: rows.length, shotRate: rateOf(rows) };
  });
  return { buckets, cells, marginal: { attempts: attempts.length, shotRate: rateOf(attempts) } };
};

/** The frozen fallback ladder (contract §2.1): bucket → cell → marginal. */
const readTable = (
  table: ReturnType<typeof buildTable>, cell: number, band: number,
): number => {
  if (band >= 0) {
    const bucket = table.buckets[cell * BANDS + band];
    if (bucket.attempts >= BUCKET_FLOOR) return bucket.shotRate;
  }
  const row = table.cells[cell];
  if (row.attempts >= BUCKET_FLOOR) return row.shotRate;
  return table.marginal.shotRate;
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const census = harvest({
    seedStart: CENSUS_SEED_START, momentBudget: MOMENTS_PER_SET, patternOnly: false,
  });
  const holdout = harvest({
    seedStart: HOLDOUT_SEED_START, momentBudget: MOMENTS_PER_SET, patternOnly: false,
  });
  const table = buildTable(census.attempts);
  const holdoutTable = buildTable(holdout.attempts);

  // X6: the clean-conditioned SUBSET must be E5a's census — count exactly, and
  // shot rate under E5a's own convention exactly (see the constant's note).
  const clean = census.attempts.filter((row) => row.cleanReception);
  const e5aWayShots = clean.filter((row) => row.adjudicated && row.shot).length;
  const e5aWayRate = clean.length === 0 ? 0 : e5aWayShots / clean.length;
  const x6 = clean.length === E5A_CLEAN_RECEPTIONS && e5aWayRate === E5A_CLEAN_SHOT_RATE;

  const gatedBuckets = table.buckets.filter((bucket, index) =>
    bucket.attempts >= BUCKET_FLOOR && holdoutTable.buckets[index].attempts >= BUCKET_FLOOR);
  const heldOut = table.buckets.map((bucket, index) => ({
    cell: bucket.cell,
    band: bucket.band,
    attemptsA: bucket.attempts,
    attemptsB: holdoutTable.buckets[index].attempts,
    shotRateA: bucket.shotRate,
    shotRateB: holdoutTable.buckets[index].shotRate,
    error: Math.abs(bucket.shotRate - holdoutTable.buckets[index].shotRate),
    gated: bucket.attempts >= BUCKET_FLOOR
      && holdoutTable.buckets[index].attempts >= BUCKET_FLOOR,
  }));
  const gatedRates = gatedBuckets.map((bucket) => bucket.shotRate);
  const discrimination = gatedRates.length === 0
    ? 0 : Math.max(...gatedRates) - Math.min(...gatedRates);

  // --- R: the decision test, on E5c (b)'s own pattern moments ---------------
  const patternRun = harvest({
    seedStart: PATTERN_SEED_START, momentBudget: PATTERN_MOMENT_FLOOR, patternOnly: true,
  });
  const scored = patternRun.attempts.map((attempt) => ({
    attempt, ev: readTable(table, attempt.cell, attempt.band),
  }));
  const patternArm = scored.filter((row) => row.attempt.licence !== null);
  const controlArm = scored.filter((row) => row.attempt.licence === null);
  const mean = (rows: readonly { ev: number }[]) =>
    (rows.length === 0 ? 0 : rows.reduce((sum, row) => sum + row.ev, 0) / rows.length);
  const meanComposed = (rows: readonly { attempt: Attempt }[]) => (rows.length === 0 ? 0
    : rows.reduce((sum, row) => sum + row.attempt.composed, 0) / rows.length);
  const realized = (rows: readonly { attempt: Attempt }[]) => (rows.length === 0 ? 0
    : rows.filter((row) => row.attempt.shot).length / rows.length);

  const byMoment = new Map<number, typeof scored>();
  for (const row of scored) {
    const group = byMoment.get(row.attempt.moment);
    if (group) group.push(row);
    else byMoment.set(row.attempt.moment, [row]);
  }
  let moments = 0;
  let composedPicksRunner = 0;
  let attemptPicksRunner = 0;
  const changedHands: { cell: number; band: number }[] = [];
  for (const group of byMoment.values()) {
    if (group.length < 2) continue;
    if (!group.some((row) => row.attempt.licence !== null)) continue;
    moments += 1;
    const best = (key: (row: typeof group[number]) => number) => group.reduce(
      (winner, row) => (key(row) > key(winner)
        || (key(row) === key(winner) && row.attempt.targetGid < winner.attempt.targetGid)
        ? row : winner));
    const composedPick = best((row) => row.attempt.composed);
    const attemptPick = best((row) => row.ev);
    if (composedPick.attempt.licence !== null) composedPicksRunner += 1;
    if (attemptPick.attempt.licence !== null) {
      attemptPicksRunner += 1;
      if (composedPick.attempt.licence === null) {
        changedHands.push({ cell: attemptPick.attempt.cell, band: attemptPick.attempt.band });
      }
    }
  }
  const composedShare = moments === 0 ? 0 : composedPicksRunner / moments;
  const attemptShare = moments === 0 ? 0 : attemptPicksRunner / moments;

  const exact = {
    x5Harness: harness.every((entry) => entry.reproduces),
    x6CleanSubsetIsE5a: x6,
  };
  const coverage = {
    c1GatedBuckets: gatedBuckets.length,
    c1AtLeastEightGated: gatedBuckets.length >= 8,
  };
  const calibrationGates = {
    c2Buckets: heldOut.filter((row) => row.gated)
      .every((row) => row.error <= HELD_OUT_BUCKET_TOLERANCE),
    c2Marginal: Math.abs(table.marginal.shotRate - holdoutTable.marginal.shotRate)
      <= HELD_OUT_MARGINAL_TOLERANCE,
  };
  const axisGates = {
    c3Discriminates: discrimination >= DISCRIMINATION_FLOOR,
    c3Calibrated: Math.abs(mean(scored) - realized(scored)) <= CALIBRATION_TOLERANCE
      && Math.abs(mean(patternArm) - realized(patternArm)) <= CALIBRATION_TOLERANCE
      && Math.abs(mean(controlArm) - realized(controlArm)) <= CALIBRATION_TOLERANCE,
  };
  const rerank = {
    r1OrderingRestored: mean(patternArm) - mean(controlArm) > 0,
    r2ArgmaxMoves: attemptShare - composedShare >= ARGMAX_SHIFT_FLOOR,
  };
  const reranks = rerank.r1OrderingRestored && rerank.r2ArgmaxMoves;
  const pass = Object.values(exact).every(Boolean)
    && coverage.c1AtLeastEightGated
    && Object.values(calibrationGates).every(Boolean)
    && Object.values(axisGates).every(Boolean)
    && reranks;

  return {
    experiment: 'EDS-E5d-phase0',
    authority: 'EDS-E5D-ATTEMPT-VALUE',
    parameters: {
      censusSeedStart: CENSUS_SEED_START,
      holdoutSeedStart: HOLDOUT_SEED_START,
      momentsPerSet: MOMENTS_PER_SET,
      patternSeedStart: PATTERN_SEED_START,
      patternMomentFloor: PATTERN_MOMENT_FLOOR,
      bucketFloor: BUCKET_FLOOR,
      heldOutBucketTolerance: HELD_OUT_BUCKET_TOLERANCE,
      discriminationFloor: DISCRIMINATION_FLOOR,
      calibrationTolerance: CALIBRATION_TOLERANCE,
      argmaxShiftFloor: ARGMAX_SHIFT_FLOOR,
    },
    harness,
    census: {
      moments: census.moments, matches: census.matches, attempts: census.attempts.length,
      marginal: table.marginal, cells: table.cells,
    },
    holdout: {
      attempts: holdout.attempts.length, marginal: holdoutTable.marginal,
    },
    x6: {
      cleanSubsetReceptions: clean.length,
      /** E5a's convention: unadjudicated arrivals forced to no-shot. */
      cleanSubsetShotRateE5aWay: e5aWayRate,
      /** The same receptions with every window actually simulated. */
      cleanSubsetShotRateHonest: rateOf(clean),
      e5aReceptions: E5A_CLEAN_RECEPTIONS,
      e5aShotRate: E5A_CLEAN_SHOT_RATE,
      /** The size of E5a's defect on its own marginal. */
      deflation: rateOf(clean) - e5aWayRate,
      matches: x6,
    },
    discrimination,
    rerankTest: {
      moments,
      composedPicksRunnerShare: composedShare,
      attemptPicksRunnerShare: attemptShare,
      shift: attemptShare - composedShare,
      pattern: {
        n: patternArm.length,
        meanComposed: meanComposed(patternArm),
        meanEv: mean(patternArm),
        realized: realized(patternArm),
      },
      control: {
        n: controlArm.length,
        meanComposed: meanComposed(controlArm),
        meanEv: mean(controlArm),
        realized: realized(controlArm),
      },
      orderingComposed: meanComposed(patternArm) - meanComposed(controlArm),
      orderingEv: mean(patternArm) - mean(controlArm),
      orderingRealized: realized(patternArm) - realized(controlArm),
    },
    reported: {
      d1Table: heldOut,
      d3ChangedHands: changedHands,
      d4OrdinaryOption: {
        controlMeanComposed: meanComposed(controlArm),
        controlMeanEv: mean(controlArm),
        controlRealized: realized(controlArm),
      },
      d5AdjudicationClosed: {
        attempts: census.attempts.length,
        reached: census.attempts.filter((row) => row.reached).length,
        cleanReception: clean.length,
        neverAdjudicated: census.attempts.filter((row) => row.reached && !row.adjudicated).length,
        shotRateAmongNeverAdjudicated: rateOf(
          census.attempts.filter((row) => row.reached && !row.adjudicated)),
        shotRateAmongNotReached: rateOf(census.attempts.filter((row) => !row.reached)),
      },
    },
    exact,
    coverage,
    calibrationGates,
    axisGates,
    rerank,
    verdict: pass ? 'PASS — RE-RANKS' : (reranks ? 'FAIL' : 'NO RE-RANK'),
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
  `EDS-E5d-phase0 ${output.verdict} · X5 ${output.exact.x5Harness}`
  + ` · X6 ${output.exact.x6CleanSubsetIsE5a}`
  + ` (${output.x6.cleanSubsetReceptions}@${output.x6.cleanSubsetShotRateE5aWay},`
  + ` honest ${output.x6.cleanSubsetShotRateHonest.toFixed(6)})`
  + ` · attempts ${output.census.attempts} marginal ${(output.census.marginal.shotRate * 100).toFixed(2)}%`
  + ` · gated ${output.coverage.c1GatedBuckets}/40 · discrimination ${(output.discrimination * 100).toFixed(2)}pp`
  + ` · ordering composed ${(output.rerankTest.orderingComposed * 100).toFixed(2)}pp`
  + ` EV ${(output.rerankTest.orderingEv * 100).toFixed(2)}pp`
  + ` realized ${(output.rerankTest.orderingRealized * 100).toFixed(2)}pp`
  + ` · argmax runner ${(output.rerankTest.composedPicksRunnerShare * 100).toFixed(1)}%`
  + ` → ${(output.rerankTest.attemptPicksRunnerShare * 100).toFixed(1)}%`
  + ` (${(output.rerankTest.shift * 100).toFixed(1)}pp of ${output.rerankTest.moments})`
  + ` · R1 ${output.rerank.r1OrderingRestored} R2 ${output.rerank.r2ArgmaxMoves}`
  + ` · SHA ${sha256}`,
);
