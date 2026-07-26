// EDS E5d PHASE 1 — THE ATTEMPT AXIS, CENSUSED WHERE IT IS DEPLOYED.
// Authority: docs/world-model/EDS-E5D-PHASE1.md §2, §4
//
// Phase 0 proved the axis re-ranks and fired two gates. Ruling #18 disposed of
// both: E5a's table is superseded with cause, and C3's near-miss is the house
// law's third appearance — a table is honest only on the population it is
// deployed on. E2a-1 censused played passes and mispriced unchosen options;
// E5a censused general touches and overprices the control arm by 2.08pp exactly
// at licence-triggered moments, which is where the chooser's hard decisions
// are. So the census moves to that population.
//
// Two pins, deliberately SEPARATE (ruling #18.2's codification, and the direct
// lesson of writing X6 twice as a mixed gate):
//
//   S1  staging held to the question — the two-walk staging must produce the
//       same attempt records as Phase 0's per-tick-clone staging, definition
//       held fixed
//   D1  definition held to the question — this window must return Phase 0's
//       banked attempt marginal exactly, staging held fixed
//
// X6 failed twice because one gate carried both claims and could not say which
// had moved.
import { createHash } from 'node:crypto';
import {
  advancePerceptionMemory, capturePerceptionTruth, createPerceptionMemory,
  materialisePerceptionSnapshot, type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption } from '../../src/ai/passOptionValue';
import {
  ATTEMPT_VALUE_BUCKET_FLOOR, ATTEMPT_VALUE_CELLS, ATTEMPT_VALUE_MARGINAL,
  ATTEMPT_VALUE_TABLE, THREAT_CALIBRATION, valueZoneIndex,
  type AttemptValueRow,
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

// --- frozen parameters (contract §2, §4) ------------------------------------
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const VALUE_HORIZON_TICKS = 240;
const AWARENESS = 0.8;
const MAX_MATCHES = 4000;
// The deployment census: fresh blocks, licence-triggered moments.
const CENSUS_SEED_START = 750_000;
const HOLDOUT_SEED_START = 760_000;
const MOMENTS_PER_SET = Number(process.argv[2] ?? 4000);
const HARNESS_SEEDS = [750_001, 750_002, 750_003] as const;
// The pins' own staging (Phase 0's population and seed block, verbatim).
const PIN_SEED_START = 700_000;
const S1_MOMENTS = Number(process.argv[3] ?? 400);
const D1_MOMENTS = 4500;
const D1_ATTEMPTS = 14114;
const D1_MARGINAL = 0.06327051154881677;
// The legacy licence predicates (`PlayerBrain.ts`), read from truth.
const THIRD_MAN_WINDOW_SECONDS = 1.5;
const THIRD_MAN_MIN_GAIN = 0.15;
const WALL_RETURN_MIN_GAIN = 0.2;
// Gate constants.
const BANDS = THREAT_CALIBRATION.length;
const BUCKET_FLOOR = ATTEMPT_VALUE_BUCKET_FLOOR; // C1
const MIN_GATED_BUCKETS = 8; // C1
const ARM_CALIBRATION_BAND = 0.02; // C2, 2.0pp — NOT widened (ruling #18.3)
const MARGINAL_CALIBRATION_BAND = 0.01; // C2, 1.0pp
const ARM_POWER_FLOOR = 1500; // C2's ex-ante power condition
const DISCRIMINATION_FLOOR = 0.05; // C3
const HELD_OUT_BUCKET_TOLERANCE = 0.05; // C3
const HELD_OUT_MARGINAL_TOLERANCE = 0.015; // C3

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

// --- the licence predicates -------------------------------------------------
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

const bandOf = (threatSeconds: number): number => {
  for (let index = 0; index < THREAT_CALIBRATION.length; index++) {
    if (threatSeconds <= THREAT_CALIBRATION[index].keyTo) return index;
  }
  return THREAT_CALIBRATION.length - 1;
};

// --- one forced attempt, always followed from the KICK ----------------------
interface Attempt {
  readonly moment: number;
  readonly cell: number;
  readonly band: number;
  readonly licensed: boolean;
  readonly licence: Licence | null;
  readonly reached: boolean;
  readonly adjudicated: boolean;
  readonly cleanReception: boolean;
  readonly shot: boolean;
  readonly targetGid: number;
}

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
  // The band is the passer's OWN corridor read; -1 when he cannot read it, which
  // sends the option down the frozen ladder rather than inventing a band.
  let band = -1;
  if (snapshot !== null) {
    const read = evaluatePassOption({
      snapshot,
      passerGid,
      targetGid: candidate.gid,
      powerMultiplier: 1,
      attackDir: attacking.attackDir,
      reachProfiles,
    });
    if (read !== null) band = bandOf(read.interceptionThreatSeconds);
  }

  const fork = cloneSimulationState(before);
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return null; // unplayable: the absence of a pass, never an attempt at one
  }
  const kickTick = fork.simTick;
  const side = passerBefore.side;
  const attackingFork = fork.teams[side];
  // FROM THE KICK (contract §2.2) — the window E5a's implementation started
  // twelve ticks after the touch, which is the defect X6 exposed.
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
  const cleanReception = reached && !(adjudicated && !event!.clean);
  // Every window runs, whatever happened to the ball. No conditioning anywhere.
  while (fork.simTick - kickTick < VALUE_HORIZON_TICKS && fork.phase === 'playing') {
    fork.step(DT);
  }
  return {
    moment,
    cell,
    band,
    licensed: licence !== null,
    licence,
    reached,
    adjudicated,
    cleanReception,
    shot: attackingFork.stats.shots > shotsBefore,
    targetGid: candidate.gid,
  };
};

/**
 * Walk a seed block collecting attempts.
 *
 * `slowStaging` clones every tick, as Phase 0 did; the default two-walk staging
 * scouts the pass ticks first and clones only there. S1 runs both over one
 * block and demands identical records — the staging claim, alone.
 */
const harvest = (input: {
  readonly seedStart: number;
  readonly momentBudget: number;
  readonly licensedOnly: boolean;
  readonly slowStaging?: boolean;
}) => {
  const attempts: Attempt[] = [];
  let moments = 0;
  let matches = 0;
  for (
    let seed = input.seedStart;
    seed < input.seedStart + MAX_MATCHES && moments < input.momentBudget;
    seed++
  ) {
    matches += 1;
    let passTicks: number[] | null = null;
    if (!input.slowStaging) {
      const scout = matchOf(seed);
      passTicks = [];
      let scoutKey = '';
      while (!scout.finished) {
        const kindBefore = scout.lastPassKind;
        scout.step(DT);
        const fresh = newPassKey(scout, scoutKey, kindBefore);
        if (fresh === null) continue;
        scoutKey = fresh;
        passTicks.push(scout.simTick);
      }
    }
    const match = matchOf(seed);
    const memories = new Map<number, PerceptionMemory>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let key = '';
    let index = 0;
    while (!match.finished && moments < input.momentBudget) {
      if (passTicks !== null && index >= passTicks.length) break;
      const isForkTick = passTicks === null || match.simTick + 1 === passTicks[index];
      const before = isForkTick ? cloneSimulationState(match) : null;
      const kindBefore = match.lastPassKind;
      // The memory chain advances EVERY tick in both stagings, on the pre-step
      // truth — a chain sampled only at pass moments would not be a chain.
      const truth = capturePerceptionTruth(match);
      for (const player of match.allPlayers) {
        if (player.role === 'GK' || player.sentOff) continue;
        advancePerceptionMemory(truth, player.gid, AWARENESS, seed, memories.get(player.gid)!);
      }
      match.step(DT);
      if (!isForkTick) continue;
      if (passTicks !== null) index += 1;
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null || before === null) continue;
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
      // THE DEPLOYMENT POPULATION (contract §2.1): a moment where the legacy
      // loop's own licence fires, with the FULL candidate set at it.
      if (input.licensedOnly) {
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

// --- the table --------------------------------------------------------------
const rateOf = (rows: readonly Attempt[]): number =>
  (rows.length === 0 ? 0 : rows.filter((row) => row.shot).length / rows.length);

const buildTable = (attempts: readonly Attempt[]): {
  buckets: AttemptValueRow[]; cells: AttemptValueRow[]; marginal: AttemptValueRow;
} => {
  const buckets: AttemptValueRow[] = [];
  for (let cell = 0; cell < ATTEMPT_VALUE_CELLS; cell++) {
    for (let band = 0; band < BANDS; band++) {
      const rows = attempts.filter((row) => row.cell === cell && row.band === band);
      buckets.push({ cell, band, attempts: rows.length, shotRate: rateOf(rows) });
    }
  }
  const cells = Array.from({ length: ATTEMPT_VALUE_CELLS }, (_, cell) => {
    const rows = attempts.filter((row) => row.cell === cell);
    return { cell, band: -1, attempts: rows.length, shotRate: rateOf(rows) };
  });
  return {
    buckets,
    cells,
    marginal: { cell: -1, band: -1, attempts: attempts.length, shotRate: rateOf(attempts) },
  };
};

/** The frozen fallback ladder, computed against a run's own table. */
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

const rowsEqual = (left: AttemptValueRow, right: AttemptValueRow): boolean =>
  (Object.keys(left) as (keyof AttemptValueRow)[]).every((key) => left[key] === right[key]);
const canonical = (value: unknown): string => JSON.stringify(value);
const attemptKey = (row: Attempt): string => [
  row.moment, row.cell, row.band, row.licensed, row.reached,
  row.adjudicated, row.cleanReception, row.shot, row.targetGid,
].join('|');

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));

  // --- S1: the STAGING claim, definition held fixed -------------------------
  const s1Fast = harvest({
    seedStart: PIN_SEED_START, momentBudget: S1_MOMENTS, licensedOnly: false,
  });
  const s1Slow = harvest({
    seedStart: PIN_SEED_START, momentBudget: S1_MOMENTS, licensedOnly: false, slowStaging: true,
  });
  const s1 = s1Fast.attempts.length === s1Slow.attempts.length
    && s1Fast.attempts.every((row, index) => attemptKey(row) === attemptKey(s1Slow.attempts[index]));

  // --- D1: the DEFINITION claim, staging held fixed -------------------------
  // Phase 0's population and seed block, its own budget: this window must
  // return its banked attempt marginal exactly.
  const d1Run = harvest({
    seedStart: PIN_SEED_START, momentBudget: D1_MOMENTS, licensedOnly: false,
  });
  const d1 = d1Run.attempts.length === D1_ATTEMPTS && rateOf(d1Run.attempts) === D1_MARGINAL;

  // --- the deployment census ------------------------------------------------
  const census = harvest({
    seedStart: CENSUS_SEED_START, momentBudget: MOMENTS_PER_SET, licensedOnly: true,
  });
  const holdout = harvest({
    seedStart: HOLDOUT_SEED_START, momentBudget: MOMENTS_PER_SET, licensedOnly: true,
  });
  const table = buildTable(census.attempts);
  const holdoutTable = buildTable(holdout.attempts);

  const heldOut = table.buckets.map((bucket, index) => ({
    cell: bucket.cell,
    band: bucket.band,
    attemptsA: bucket.attempts,
    attemptsB: holdoutTable.buckets[index].attempts,
    shotRateA: bucket.shotRate,
    shotRateB: holdoutTable.buckets[index].shotRate,
    error: Math.abs(bucket.shotRate - holdoutTable.buckets[index].shotRate),
    gated: bucket.attempts >= BUCKET_FLOOR && holdoutTable.buckets[index].attempts >= BUCKET_FLOOR,
  }));
  const gated = heldOut.filter((row) => row.gated);
  const gatedRates = gated.map((row) => row.shotRateA);
  const discrimination = gatedRates.length === 0
    ? 0 : Math.max(...gatedRates) - Math.min(...gatedRates);

  // --- C2: held-out calibration on DEPLOYMENT moments, per arm --------------
  const scoreWith = (rows: readonly Attempt[]) => rows.map((row) => ({
    row, ev: readTable(table, row.cell, row.band),
  }));
  const armStats = (rows: readonly { row: Attempt; ev: number }[]) => ({
    n: rows.length,
    predicted: rows.length === 0 ? 0 : rows.reduce((sum, entry) => sum + entry.ev, 0) / rows.length,
    realized: rows.length === 0 ? 0 : rows.filter((entry) => entry.row.shot).length / rows.length,
  });
  const withGap = (stats: { n: number; predicted: number; realized: number }) => ({
    ...stats, gap: stats.predicted - stats.realized,
  });
  const holdoutScored = scoreWith(holdout.attempts);
  const c2Pattern = withGap(armStats(holdoutScored.filter((entry) => entry.row.licensed)));
  const c2Control = withGap(armStats(holdoutScored.filter((entry) => !entry.row.licensed)));
  const c2Marginal = withGap(armStats(holdoutScored));

  // R2 (reported, never gated): the same calibration on the GENERAL population,
  // which is the boundary §2.1 registered before the run.
  const generalScored = scoreWith(d1Run.attempts);
  const r2General = {
    all: withGap(armStats(generalScored)),
    licensed: withGap(armStats(generalScored.filter((entry) => entry.row.licensed))),
    unlicensed: withGap(armStats(generalScored.filter((entry) => !entry.row.licensed))),
  };

  // R5: what the removed half was worth, on the deployment population.
  const clean = census.attempts.filter((row) => row.cleanReception);
  const r5RemovedHalf = {
    attempts: census.attempts.length,
    reached: census.attempts.filter((row) => row.reached).length,
    cleanReception: clean.length,
    shotRateGivenClean: rateOf(clean),
    shotRateGivenNotClean: rateOf(census.attempts.filter((row) => !row.cleanReception)),
    neverAdjudicated: census.attempts.filter((row) => row.reached && !row.adjudicated).length,
  };

  const exact = {
    x5Harness: harness.every((entry) => entry.reproduces),
    s1StagingPin: s1,
    d1DefinitionPin: d1,
    t1CommittedMatchesCensus: ATTEMPT_VALUE_TABLE.length === table.buckets.length
      && ATTEMPT_VALUE_TABLE.every((row, index) => rowsEqual(row, table.buckets[index]))
      && ATTEMPT_VALUE_CELLS === table.cells.length
      && rowsEqual(ATTEMPT_VALUE_MARGINAL, table.marginal),
  };
  const coverage = {
    c1GatedBuckets: gated.length,
    c1Enough: gated.length >= MIN_GATED_BUCKETS,
    c1ArmPower: c2Pattern.n >= ARM_POWER_FLOOR && c2Control.n >= ARM_POWER_FLOOR,
  };
  const calibration = {
    c2Pattern: Math.abs(c2Pattern.gap) <= ARM_CALIBRATION_BAND,
    c2Control: Math.abs(c2Control.gap) <= ARM_CALIBRATION_BAND,
    c2Marginal: Math.abs(c2Marginal.gap) <= MARGINAL_CALIBRATION_BAND,
  };
  const axis = {
    c3Discriminates: discrimination >= DISCRIMINATION_FLOOR,
    c3HeldOutBuckets: gated.every((row) => row.error <= HELD_OUT_BUCKET_TOLERANCE),
    c3HeldOutMarginal: Math.abs(table.marginal.shotRate - holdoutTable.marginal.shotRate)
      <= HELD_OUT_MARGINAL_TOLERANCE,
  };

  const pass = Object.values(exact).every(Boolean)
    && coverage.c1Enough && coverage.c1ArmPower
    && Object.values(calibration).every(Boolean)
    && Object.values(axis).every(Boolean);

  return {
    experiment: 'EDS-E5d-phase1',
    authority: 'EDS-E5D-PHASE1',
    parameters: {
      censusSeedStart: CENSUS_SEED_START,
      holdoutSeedStart: HOLDOUT_SEED_START,
      momentsPerSet: MOMENTS_PER_SET,
      pinSeedStart: PIN_SEED_START,
      s1Moments: S1_MOMENTS,
      d1: { moments: D1_MOMENTS, attempts: D1_ATTEMPTS, marginal: D1_MARGINAL },
      bucketFloor: BUCKET_FLOOR,
      armCalibrationBand: ARM_CALIBRATION_BAND,
      armPowerFloor: ARM_POWER_FLOOR,
      discriminationFloor: DISCRIMINATION_FLOOR,
    },
    harness,
    pins: {
      s1: {
        fastAttempts: s1Fast.attempts.length,
        slowAttempts: s1Slow.attempts.length,
        moments: s1Fast.moments,
        identical: s1,
      },
      d1: {
        attempts: d1Run.attempts.length,
        marginal: rateOf(d1Run.attempts),
        bankedAttempts: D1_ATTEMPTS,
        bankedMarginal: D1_MARGINAL,
        matches: d1,
      },
    },
    census: {
      moments: census.moments,
      matches: census.matches,
      attempts: census.attempts.length,
      marginal: table.marginal,
      cells: table.cells,
    },
    holdout: {
      moments: holdout.moments,
      matches: holdout.matches,
      attempts: holdout.attempts.length,
      marginal: holdoutTable.marginal,
    },
    committedTable: table.buckets,
    committedCells: table.cells,
    discrimination,
    c2: { pattern: c2Pattern, control: c2Control, marginal: c2Marginal },
    reported: {
      r1Buckets: heldOut,
      r2GeneralPopulation: r2General,
      r5RemovedHalf,
    },
    exact,
    coverage,
    calibration,
    axis,
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
  `EDS-E5d-P1 ${output.verdict} · X5 ${output.exact.x5Harness}`
  + ` · S1 ${output.exact.s1StagingPin} · D1 ${output.exact.d1DefinitionPin}`
  + ` (${output.pins.d1.attempts}@${output.pins.d1.marginal})`
  + ` · T1 ${output.exact.t1CommittedMatchesCensus}`
  + ` · census ${output.census.attempts} attempts / ${output.census.moments} moments`
  + ` marginal ${(output.census.marginal.shotRate * 100).toFixed(2)}%`
  + ` · gated ${output.coverage.c1GatedBuckets} · discrimination ${(output.discrimination * 100).toFixed(2)}pp`
  + ` · C2 pattern ${(output.c2.pattern.gap * 100).toFixed(2)}pp (n=${output.c2.pattern.n})`
  + ` control ${(output.c2.control.gap * 100).toFixed(2)}pp (n=${output.c2.control.n})`
  + ` marginal ${(output.c2.marginal.gap * 100).toFixed(2)}pp`
  + ` · general-pop gap ${(output.reported.r2GeneralPopulation.all.gap * 100).toFixed(2)}pp`
  + ` · SHA ${sha256}`,
);
