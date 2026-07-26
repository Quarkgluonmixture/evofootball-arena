// EDS E5a — THE VALUE CENSUS (what the ball is worth there).
// Authority: docs/world-model/EDS-E5-VALUE-AXIS.md §2.1, §4
//
// E4 round 1: the perceived chooser picks argmax P(clean reception) and
// combination play collapses, because the measured axis is half a decision.
// Football wants P(success) x WHAT THE BALL IS WORTH THERE, and rulings #8/#9
// forbid inventing the second half. So it gets measured, by the same move
// E2b-0 made for the corridor read: E2a-2's fork-and-force staging, VERBATIM,
// with the follow extended past the reception to record what happened NEXT.
//
// Two gates carry this file. X5b: the reception-outcome census must come back
// byte-equal to E2a-2's and the threat quintiles byte-equal to E2b-0's, because
// only a longer follow was added and a forward simulation cannot change its own
// past. V4: the product P-hat x V-hat must predict the conjunction it claims to
// estimate — clean reception AND a shot — which is what makes the composition a
// measurement instead of a weight.
//
// Inherited header from the staging this reuses:
// EDS E2a-2 OPTION-SPACE CENSUS (counterfactual). At each real decision moment
// the full candidate set is enumerated, the deterministic world is forked per
// candidate, and the intervention is on TARGET CHOICE ONLY — power, lead, aim
// spray, offside and bookkeeping all run the live machinery.
import { createHash } from 'node:crypto';
import {
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption } from '../../src/ai/passOptionValue';
import type { KnownReachProfile } from '../../src/ai/reachability';
import {
  OPTION_SPACE_PRIOR_MARGINAL, OPTION_SPACE_PRIOR_TABLE, PASS_PRIOR_BANDS,
  optionSpacePriorAt, THREAT_CALIBRATION, VALUE_ZONE_MARGINAL, VALUE_ZONE_TABLE,
  valueZoneIndex, type PassPriorRow, type ValueZoneRow,
} from '../../src/ai/passPrior';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2.1, §4) ----------------------------------
// The staging: E2a-2's and E2b-0's, verbatim. Changing any of these breaks X5b
// by construction, which is the point of freezing them here.
const CENSUS_SEED_START = 700_000;
const HOLDOUT_SEED_START = 710_000;
const MOMENTS_PER_SET = Number(process.argv[2] ?? 4500);
const HARNESS_SEEDS = [700_001, 700_002, 700_003] as const;
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const AWARENESS = 0.8;
const QUINTILES = 5;
const MAX_MATCHES_PER_SET = 4000;

// E5a's own frozen parameters (contract §2.1, §4).
/** The value window: 4.0 s from the kick, the staging's own FOLLOW_TICKS. */
const VALUE_HORIZON_TICKS = 240;
const ZONE_SAMPLE_FLOOR = 400; // V1
const V2_DISCRIMINATION_FLOOR = 0.05; // V2, 5.0pp
const V3_CELL_TOLERANCE = 0.05; // V3, 5.0pp
const V3_MARGINAL_TOLERANCE = 0.015; // V3, 1.5pp
const V4A_DISCRIMINATION_FLOOR = 0.04; // V4a, 4.0pp
const V4B_QUINTILE_TOLERANCE = 0.05; // V4b, 5.0pp
const V4B_MARGINAL_TOLERANCE = 0.02; // V4b, 2.0pp
const V4C_QUINTILE_FLOOR = 1200; // V4c

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
const bandIndexOf = (distance: number): number => {
  for (let index = 0; index < PASS_PRIOR_BANDS.length; index++) {
    const [from, to] = PASS_PRIOR_BANDS[index];
    if (distance >= from && distance < to) return index;
  }
  return PASS_PRIOR_BANDS.length - 1;
};
const matchOf = (seed: number, duration = MATCH_DURATION): Match => new Match({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  duration,
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

/** A newly registered PLAIN ground pass, or null (E2a-2 §3's population). */
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

// --- X5a: the fork must replay reality ---------------------------------------
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

// --- the counterfactual census ----------------------------------------------
type Outcome = 'intercepted' | 'reachedTarget' | 'otherTeammate' | 'unresolved' | 'unplayable';
type InfoClass = 'READ' | 'SEEN-UNREAD' | 'UNSEEN';

/** E0's prediction for one candidate, from the passer's OWN perceived state. */
interface EvaluatorRead {
  readonly threatSeconds: number;
  readonly touchFailPrior: number;
  readonly flightSeconds: number;
  readonly arrivalSpeed: number;
}

interface Fork {
  readonly band: number;
  readonly outcome: Outcome;
  readonly spilled: boolean;
  readonly adjudicated: boolean;
  readonly chosen: boolean;
  readonly read: EvaluatorRead | null;
  readonly bandSuccess: number;
  // --- E5a's columns ---------------------------------------------------------
  /** The TRUE decision-moment zone of this candidate (the table is built here). */
  readonly zone: number;
  /** The zone the passer's own percept puts him in; -1 when he cannot see him. */
  readonly perceivedZone: number;
  readonly infoClass: InfoClass;
  /** Shot by the passing team inside the window; only defined for clean receptions. */
  readonly shot: boolean;
  readonly goal: boolean;
  /** Metres of ball progression in the attack frame over the window. */
  readonly progression: number;
  /** How long the follow actually ran (a dead ball stops it) — reported. */
  readonly followTicks: number;
  /** Which decision moment this candidate belonged to (R5 groups on it). */
  moment: number;
}

/** Success is E2a-2's thing: the intended man ends up in clean control. */
const succeeded = (fork: Fork): boolean => fork.outcome === 'reachedTarget' && !fork.spilled;
/** The conjunction the product rule claims to estimate (V4). */
const conjunction = (fork: Fork): boolean => succeeded(fork) && fork.shot;

/**
 * Fork the pre-tick state once per candidate, substituting only the target,
 * then — for the forks where the intended man got it cleanly — keep the world
 * running to the value horizon and record what happened next.
 */
const forkCandidates = (
  before: Match,
  passerGid: number,
  chosenGid: number,
  candidates: readonly Player[],
  reads: ReadonlyMap<number, EvaluatorRead | null>,
  zones: ReadonlyMap<number, number>,
  perceivedZones: ReadonlyMap<number, number>,
  classes: ReadonlyMap<number, InfoClass>,
): Fork[] => candidates.map((candidate) => {
  const read = reads.get(candidate.gid) ?? null;
  const zone = zones.get(candidate.gid) ?? 0;
  const perceivedZone = perceivedZones.get(candidate.gid) ?? -1;
  const infoClass = classes.get(candidate.gid) ?? 'UNSEEN';
  const blank = {
    read, bandSuccess: 0, zone, perceivedZone, infoClass,
    shot: false, goal: false, progression: 0, followTicks: 0, moment: -1,
  };
  const fork = cloneSimulationState(before);
  const passer = fork.allPlayers.find((player) => player.gid === passerGid);
  if (!passer) {
    return {
      band: 0, outcome: 'unplayable' as Outcome, spilled: false, adjudicated: false,
      chosen: false, ...blank,
    };
  }
  const band = bandIndexOf(distanceBetween(passer.pos, candidate.pos));
  const bandSuccess = optionSpacePriorAt(distanceBetween(passer.pos, candidate.pos))
    .receptionSuccessRate;
  const chosen = candidate.gid === chosenGid;
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  // Unplayable: the substitution did not become a pass to this man (ruling #8 (i)).
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return { band, outcome: 'unplayable', spilled: false, adjudicated: false, chosen, ...blank, bandSuccess };
  }
  const kickTick = fork.simTick;
  let outcome: Outcome = 'unresolved';
  let toucherGid = -1;
  for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
    fork.step(DT);
    const toucher = fork.ball.lastTouch;
    if (toucher && toucher.gid !== passerGid) {
      toucherGid = toucher.gid;
      outcome = toucher.gid === candidate.gid
        ? 'reachedTarget'
        : toucher.side === passer.side ? 'otherTeammate' : 'intercepted';
      break;
    }
    if (fork.phase !== 'playing') break;
  }
  if (outcome !== 'reachedTarget') {
    return { band, outcome, spilled: false, adjudicated: false, chosen, ...blank, bandSuccess };
  }
  // Let the adjudication land: contact and first touch are three ticks apart.
  const touchTick = fork.simTick;
  for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
    fork.step(DT);
  }
  const event = fork.firstTouchTrace.find((trace) => (
    trace.gid === toucherGid && trace.intendedTarget
    && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
  ));
  const spilled = event ? !event.clean : false;
  const adjudicated = event !== undefined;
  // V is conditioned on a CLEAN reception, so only those forks need the rest of
  // the window: for every other fork the conjunction is false by definition and
  // simulating it would buy nothing (contract §2.1).
  if (spilled || !adjudicated) {
    return {
      band, outcome, spilled, adjudicated, chosen, ...blank, bandSuccess,
    };
  }
  const side = passer.side;
  const attacking = fork.teams[side];
  const shotsBefore = attacking.stats.shots;
  const goalsBefore = fork.score[side];
  const startX = attacking.localX(fork.ball.pos.x);
  let followTicks = fork.simTick - kickTick;
  while (fork.simTick - kickTick < VALUE_HORIZON_TICKS && fork.phase === 'playing') {
    fork.step(DT);
    followTicks = fork.simTick - kickTick;
  }
  return {
    band,
    outcome,
    spilled,
    adjudicated,
    chosen,
    read,
    bandSuccess,
    zone,
    perceivedZone,
    infoClass,
    shot: attacking.stats.shots > shotsBefore,
    goal: fork.score[side] > goalsBefore,
    progression: attacking.localX(fork.ball.pos.x) - startX,
    followTicks,
    moment: -1,
  };
});

const tabulate = (forks: readonly Fork[], bandFrom: number, bandTo: number): PassPriorRow => {
  const playable = forks.filter((fork) => fork.outcome !== 'unplayable');
  const n = playable.length;
  const rate = (count: number) => (n === 0 ? 0 : count / n);
  const reached = playable.filter((fork) => fork.outcome === 'reachedTarget');
  const spilled = reached.filter((fork) => fork.spilled).length;
  const cleanGivenReached = reached.length === 0 ? 0 : 1 - spilled / reached.length;
  const reachedRate = rate(reached.length);
  return {
    bandFrom,
    bandTo,
    passes: n,
    interceptedRate: rate(playable.filter((fork) => fork.outcome === 'intercepted').length),
    reachedRate,
    otherTeammateRate: rate(playable.filter((fork) => fork.outcome === 'otherTeammate').length),
    unresolvedRate: rate(playable.filter((fork) => fork.outcome === 'unresolved').length),
    cleanGivenReached,
    receptionSuccessRate: reachedRate * cleanGivenReached,
  };
};

/** The V row for a set of clean receptions — the value of arriving there. */
const tabulateValue = (receptions: readonly Fork[], zone: number): ValueZoneRow => {
  const n = receptions.length;
  const mean = (pick: (fork: Fork) => number) =>
    (n === 0 ? 0 : receptions.reduce((sum, fork) => sum + pick(fork), 0) / n);
  return {
    zone,
    receptions: n,
    shotRate: n === 0 ? 0 : receptions.filter((fork) => fork.shot).length / n,
    goalRate: n === 0 ? 0 : receptions.filter((fork) => fork.goal).length / n,
    meanProgression: mean((fork) => fork.progression),
  };
};

const runCensus = (seedStart: number) => {
  const forks: Fork[] = [];
  let moments = 0;
  let ownTargetPlayable = 0;
  let ownTargetInWindow = 0;
  let chosenOutOfWindow = 0;
  let matches = 0;
  for (
    let seed = seedStart;
    seed < seedStart + MAX_MATCHES_PER_SET && moments < MOMENTS_PER_SET;
    seed++
  ) {
    matches += 1;
    const match = matchOf(seed);
    // Perception memory is maintained continuously, on the PRE-step truth, so
    // the passer's snapshot at a decision moment is the state he decided from.
    const memories = new Map<number, PerceptionMemory>();
    const snapshots = new Map<number, PerceptionSnapshot>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let key = '';
    while (!match.finished && moments < MOMENTS_PER_SET) {
      const before = cloneSimulationState(match);
      const kindBefore = match.lastPassKind;
      const truth = capturePerceptionTruth(match);
      for (const player of match.allPlayers) {
        if (player.role === 'GK' || player.sentOff) continue;
        snapshots.set(player.gid, perceiveSnapshot(
          truth, player.gid, AWARENESS, seed, memories.get(player.gid)!,
        ));
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
      moments += 1;
      const snapshot = snapshots.get(pending.passerGid);
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed,
          accel: player.accel,
          dribbling: player.attrs.dribbling,
        }]),
      );
      const reads = new Map<number, EvaluatorRead | null>();
      const zones = new Map<number, number>();
      const perceivedZones = new Map<number, number>();
      const classes = new Map<number, InfoClass>();
      for (const candidate of candidates) {
        const value = snapshot === undefined ? null : evaluatePassOption({
          snapshot,
          passerGid: pending.passerGid,
          targetGid: candidate.gid,
          powerMultiplier: 1,
          attackDir: attacking.attackDir,
          reachProfiles,
        });
        reads.set(candidate.gid, value === null ? null : {
          threatSeconds: value.interceptionThreatSeconds,
          touchFailPrior: value.touchFailPrior,
          flightSeconds: value.flightSeconds,
          arrivalSpeed: value.arrivalSpeed,
        });
        // The table is keyed on the TRUE decision-moment position (contract §4);
        // the classes and the perceived zone are what a reader would have.
        zones.set(candidate.gid, valueZoneIndex(
          attacking.localX(candidate.pos.x), candidate.pos.y,
        ));
        const seen = snapshot?.players.find((entry) => entry.gid === candidate.gid);
        if (seen === undefined) {
          classes.set(candidate.gid, 'UNSEEN');
          perceivedZones.set(candidate.gid, -1);
        } else {
          classes.set(candidate.gid, value === null ? 'SEEN-UNREAD' : 'READ');
          perceivedZones.set(candidate.gid, valueZoneIndex(
            attacking.localX(seen.pos.x), seen.pos.y,
          ));
        }
      }
      const batch = forkCandidates(
        before, pending.passerGid, pending.targetGid, candidates, reads,
        zones, perceivedZones, classes,
      );
      for (const fork of batch) fork.moment = moments;
      const own = batch.find((fork) => fork.chosen);
      if (own === undefined) chosenOutOfWindow += 1;
      else {
        ownTargetInWindow += 1;
        if (own.outcome !== 'unplayable') ownTargetPlayable += 1;
      }
      forks.push(...batch);
    }
  }

  const table = PASS_PRIOR_BANDS.map(([from, to], index) =>
    tabulate(forks.filter((fork) => fork.band === index), from, to));
  const marginal = tabulate(forks, -1, -1);
  const receptions = forks.filter(succeeded);
  const valueTable = Array.from({ length: VALUE_ZONE_TABLE.length }, (_, zone) =>
    tabulateValue(receptions.filter((fork) => fork.zone === zone), zone));
  const valueMarginal = tabulateValue(receptions, -1);
  return {
    forkRecords: forks,
    table,
    marginal,
    valueTable,
    valueMarginal,
    chosenSubset: tabulate(forks.filter((fork) => fork.chosen), -1, -1),
    chosenValue: tabulateValue(receptions.filter((fork) => fork.chosen), -1),
    moments,
    matches,
    forks: forks.length,
    receptions: receptions.length,
    ownTargetPlayableRate: ownTargetInWindow === 0 ? 0 : ownTargetPlayable / ownTargetInWindow,
    chosenOutOfWindow,
  };
};

const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);
const valueRowsEqual = (left: ValueZoneRow, right: ValueZoneRow): boolean =>
  (Object.keys(left) as (keyof ValueZoneRow)[]).every((key) => left[key] === right[key]);
const canonical = (value: unknown): string => JSON.stringify(value);

/** E2b-0's quintile machinery, unchanged — X5b re-derives its curve. */
const quintilesBy = (forks: readonly Fork[], value: (read: EvaluatorRead) => number) => {
  const priced = forks
    .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
    .map((fork) => ({ fork, key: value(fork.read!) }))
    .sort((left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess);
  const size = Math.floor(priced.length / QUINTILES);
  return Array.from({ length: QUINTILES }, (_, index) => {
    const from = index * size;
    const to = index === QUINTILES - 1 ? priced.length : from + size;
    const slice = priced.slice(from, to);
    const wins = slice.filter((entry) => succeeded(entry.fork)).length;
    return {
      quintile: index,
      n: slice.length,
      keyFrom: slice.length === 0 ? 0 : slice[0].key,
      keyTo: slice.length === 0 ? 0 : slice[slice.length - 1].key,
      realizedSuccess: slice.length === 0 ? 0 : wins / slice.length,
    };
  });
};

const threatQuintilePriceFrom = (
  rows: readonly { keyTo: number; realizedSuccess: number }[], threatSeconds: number,
): number => {
  for (const row of rows) if (threatSeconds <= row.keyTo) return row.realizedSuccess;
  return rows[rows.length - 1].realizedSuccess;
};

/**
 * The composition, exactly as the live chooser will do it (contract §2.1): the
 * information class picks WHICH census answers on each half, and the two halves
 * multiply. Nothing here is weighted by hand.
 */
const composeScore = (
  fork: Fork,
  threatRows: readonly { keyTo: number; realizedSuccess: number }[],
  valueTable: readonly ValueZoneRow[],
  valueMarginal: ValueZoneRow,
  usableZones: ReadonlySet<number>,
): { p: number; v: number; score: number } => {
  let p: number;
  if (fork.infoClass === 'UNSEEN') p = OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate;
  else if (fork.infoClass === 'SEEN-UNREAD') p = fork.bandSuccess;
  else p = threatQuintilePriceFrom(threatRows, fork.read!.threatSeconds);
  const cell = fork.perceivedZone;
  const v = cell >= 0 && usableZones.has(cell)
    ? valueTable[cell].shotRate : valueMarginal.shotRate;
  return { p, v, score: p * v };
};

/** Bin by a predicted quantity and report what the world actually did (V4). */
const scoreQuintiles = (
  scored: readonly { fork: Fork; key: number }[],
) => {
  const sorted = [...scored].sort(
    (left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess,
  );
  const size = Math.floor(sorted.length / QUINTILES);
  return Array.from({ length: QUINTILES }, (_, index) => {
    const from = index * size;
    const to = index === QUINTILES - 1 ? sorted.length : from + size;
    const slice = sorted.slice(from, to);
    const n = slice.length;
    return {
      quintile: index,
      n,
      meanPredicted: n === 0 ? 0 : slice.reduce((sum, entry) => sum + entry.key, 0) / n,
      realizedConjunction: n === 0 ? 0 : slice.filter((entry) => conjunction(entry.fork)).length / n,
      // NOT the unconditional shot rate: `shot` is only ever recorded for clean
      // receptions, because the window is only simulated for them (the
      // conjunction is false by construction otherwise). Kept so the identity
      // with `realizedConjunction` is visible rather than implied — see R3.
      realizedShotAmongClean: n === 0 ? 0
        : slice.filter((entry) => entry.fork.shot).length / n,
      realizedSuccess: n === 0 ? 0 : slice.filter((entry) => succeeded(entry.fork)).length / n,
    };
  });
};

const spreadOf = (bins: readonly { realizedConjunction: number; n: number }[]): number => {
  const rates = bins.filter((bin) => bin.n > 0).map((bin) => bin.realizedConjunction);
  return rates.length === 0 ? 0 : Math.max(...rates) - Math.min(...rates);
};

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const census = runCensus(CENSUS_SEED_START);
  const holdout = runCensus(HOLDOUT_SEED_START);

  const threatA = quintilesBy(census.forkRecords, (read) => read.threatSeconds);

  // V1: which cells are measurements. The held-out GATES (V2/V3) need the cell
  // measured in both sets; the COMPOSITION uses the rule the live consumer can
  // actually apply, which sees only the committed set-A table — `valueZoneAt`'s
  // own floor. Keeping the two separate is what stops the probe from simulating
  // a chooser the game cannot be.
  const gatedZones = new Set<number>(census.valueTable
    .filter((row, index) => row.receptions >= ZONE_SAMPLE_FLOOR
      && holdout.valueTable[index].receptions >= ZONE_SAMPLE_FLOOR)
    .map((row) => row.zone));
  const usableZones = new Set<number>(census.valueTable
    .filter((row) => row.receptions >= ZONE_SAMPLE_FLOOR).map((row) => row.zone));

  const valueCalibration = census.valueTable.map((row, index) => ({
    zone: row.zone,
    receptionsA: row.receptions,
    receptionsB: holdout.valueTable[index].receptions,
    shotRateA: row.shotRate,
    shotRateB: holdout.valueTable[index].shotRate,
    error: Math.abs(row.shotRate - holdout.valueTable[index].shotRate),
    gated: gatedZones.has(row.zone),
  }));
  const gatedRates = valueCalibration.filter((row) => row.gated).map((row) => row.shotRateA);
  const v2Discrimination = gatedRates.length === 0
    ? 0 : Math.max(...gatedRates) - Math.min(...gatedRates);

  // V4, gated on set A; the same computation on set B with A's table reported
  // beside it (contract §4, settled before implementation).
  const playableA = census.forkRecords.filter((fork) => fork.outcome !== 'unplayable');
  const playableB = holdout.forkRecords.filter((fork) => fork.outcome !== 'unplayable');
  const compose = (fork: Fork) => composeScore(
    fork, threatA, census.valueTable, census.valueMarginal, usableZones,
  );
  const scoredA = playableA.map((fork) => ({ fork, key: compose(fork).score }));
  const scoredB = playableB.map((fork) => ({ fork, key: compose(fork).score }));
  const compositionA = scoreQuintiles(scoredA);
  const compositionB = scoreQuintiles(scoredB);
  const marginalPredictedA = scoredA.length === 0
    ? 0 : scoredA.reduce((sum, entry) => sum + entry.key, 0) / scoredA.length;
  const marginalRealizedA = scoredA.length === 0
    ? 0 : scoredA.filter((entry) => conjunction(entry.fork)).length / scoredA.length;
  const marginalPredictedB = scoredB.length === 0
    ? 0 : scoredB.reduce((sum, entry) => sum + entry.key, 0) / scoredB.length;
  const marginalRealizedB = scoredB.length === 0
    ? 0 : scoredB.filter((entry) => conjunction(entry.fork)).length / scoredB.length;

  // R4: which half carries the discrimination, same forks, both ways.
  const pOnly = scoreQuintiles(playableA.map((fork) => ({ fork, key: compose(fork).p })));
  const vOnly = scoreQuintiles(playableA.map((fork) => ({ fork, key: compose(fork).v })));

  // R5: how often the composed argmax differs from the P-only argmax, grouped
  // by the decision moment each candidate belonged to.
  const byMoment = new Map<number, Fork[]>();
  for (const fork of census.forkRecords) {
    const group = byMoment.get(fork.moment);
    if (group) group.push(fork);
    else byMoment.set(fork.moment, [fork]);
  }
  const momentGroups = [...byMoment.values()];
  let argmaxMoments = 0;
  let argmaxDiffers = 0;
  for (const group of momentGroups) {
    const executable = group.filter((fork) => fork.infoClass !== 'UNSEEN');
    if (executable.length < 2) continue;
    argmaxMoments += 1;
    const best = (key: (fork: Fork) => number) => executable.reduce(
      (winner, fork) => (key(fork) > key(winner) ? fork : winner));
    const composed = best((fork) => compose(fork).score);
    const pOnlyBest = best((fork) => compose(fork).p);
    if (composed !== pOnlyBest) argmaxDiffers += 1;
  }

  const rowsEqualAll = (left: readonly PassPriorRow[], right: readonly PassPriorRow[]) =>
    left.length === right.length && left.every((row, index) => rowsEqual(row, right[index]));

  const exact = {
    x5aHarnessReproduces: harness.every((entry) => entry.reproduces),
    x5bReproducesE2a2: rowsEqualAll(census.table, OPTION_SPACE_PRIOR_TABLE)
      && rowsEqual(census.marginal, OPTION_SPACE_PRIOR_MARGINAL),
    x5bReproducesE2b0: THREAT_CALIBRATION.length === threatA.length
      && THREAT_CALIBRATION.every((row, index) => (
        row.n === threatA[index].n && row.realizedSuccess === threatA[index].realizedSuccess
      )),
    x6CommittedValueTableMatches: VALUE_ZONE_TABLE.length === census.valueTable.length
      && VALUE_ZONE_TABLE.every((row, index) => valueRowsEqual(row, census.valueTable[index]))
      && valueRowsEqual(VALUE_ZONE_MARGINAL, census.valueMarginal),
  };
  const coverage = {
    v1GatedCells: gatedZones.size,
    v1AtLeastFourGated: gatedZones.size >= 4,
  };
  const discrimination = {
    v2Discriminates: v2Discrimination >= V2_DISCRIMINATION_FLOOR,
  };
  const heldOut = {
    v3Cells: valueCalibration.filter((row) => row.gated)
      .every((row) => row.error <= V3_CELL_TOLERANCE),
    v3Marginal: Math.abs(census.valueMarginal.shotRate - holdout.valueMarginal.shotRate)
      <= V3_MARGINAL_TOLERANCE,
  };
  const composition = {
    v4aDiscriminates: Math.abs(
      compositionA[QUINTILES - 1].realizedConjunction - compositionA[0].realizedConjunction,
    ) >= V4A_DISCRIMINATION_FLOOR,
    v4bQuintiles: compositionA.every(
      (bin) => Math.abs(bin.meanPredicted - bin.realizedConjunction) <= V4B_QUINTILE_TOLERANCE),
    v4bMarginal: Math.abs(marginalPredictedA - marginalRealizedA) <= V4B_MARGINAL_TOLERANCE,
    v4cCoverage: compositionA.every((bin) => bin.n >= V4C_QUINTILE_FLOOR),
  };

  const pass = Object.values(exact).every(Boolean)
    && coverage.v1AtLeastFourGated
    && Object.values(discrimination).every(Boolean)
    && Object.values(heldOut).every(Boolean)
    && Object.values(composition).every(Boolean);

  return {
    experiment: 'EDS-E5a',
    authority: 'EDS-E5-VALUE-AXIS',
    parameters: {
      censusSeedStart: CENSUS_SEED_START,
      holdoutSeedStart: HOLDOUT_SEED_START,
      momentsPerSet: MOMENTS_PER_SET,
      awareness: AWARENESS,
      valueHorizonTicks: VALUE_HORIZON_TICKS,
      zoneSampleFloor: ZONE_SAMPLE_FLOOR,
      v2DiscriminationFloor: V2_DISCRIMINATION_FLOOR,
      v3CellTolerance: V3_CELL_TOLERANCE,
      v4aDiscriminationFloor: V4A_DISCRIMINATION_FLOOR,
      v4bQuintileTolerance: V4B_QUINTILE_TOLERANCE,
    },
    harness,
    census: {
      moments: census.moments,
      matches: census.matches,
      forks: census.forks,
      receptions: census.receptions,
      table: census.table,
      marginal: census.marginal,
      valueTable: census.valueTable,
      valueMarginal: census.valueMarginal,
    },
    holdout: {
      forks: holdout.forks,
      receptions: holdout.receptions,
      valueTable: holdout.valueTable,
      valueMarginal: holdout.valueMarginal,
    },
    threatQuintilesA: threatA,
    valueCalibration,
    v2Discrimination,
    compositionA,
    compositionB,
    compositionMarginal: {
      predictedA: marginalPredictedA,
      realizedA: marginalRealizedA,
      predictedB: marginalPredictedB,
      realizedB: marginalRealizedB,
    },
    reported: {
      r2RivalValueDefinitions: census.valueTable.map((row) => ({
        zone: row.zone,
        receptions: row.receptions,
        shotRate: row.shotRate,
        goalRate: row.goalRate,
        meanProgression: row.meanProgression,
      })),
      /**
       * R3 AS CONTRACTED IS NOT MEASURABLE IN THIS STAGING, and saying so is
       * cheaper than a column that looks like an answer. The contract asked for
       * the unconditional shot-within-window rate per composed quintile; §2.1
       * simulates the window only for clean receptions, because for every other
       * fork the conjunction is false by definition and following it buys
       * nothing the gates need. So `shotAmongClean` below is identically
       * `realizedConjunction`. Answering R3 honestly would cost ~45% more
       * simulation for a reported-only number; it is left unmeasured, not
       * faked.
       */
      r3UnconditionalShot: {
        measurable: false,
        why: 'the window is simulated only for clean receptions (contract §2.1)',
        shotAmongClean: compositionA.map((bin) => ({
          quintile: bin.quintile, n: bin.n, shot: bin.realizedShotAmongClean,
        })),
      },
      r4WhichHalfCarries: {
        composedSpread: spreadOf(compositionA),
        pOnlySpread: spreadOf(pOnly),
        vOnlySpread: spreadOf(vOnly),
        pOnly,
        vOnly,
      },
      r5ArgmaxChange: {
        moments: argmaxMoments,
        differs: argmaxDiffers,
        share: argmaxMoments === 0 ? 0 : argmaxDiffers / argmaxMoments,
      },
      r6ChosenSubsetValue: {
        optionSpaceShotRate: census.valueMarginal.shotRate,
        chosenShotRate: census.chosenValue.shotRate,
        chosenReceptions: census.chosenValue.receptions,
        lift: census.chosenValue.shotRate - census.valueMarginal.shotRate,
      },
      r7FollowLength: {
        meanTicks: census.receptions === 0 ? 0
          : census.forkRecords.filter(succeeded)
            .reduce((sum, fork) => sum + fork.followTicks, 0) / census.receptions,
        truncated: census.forkRecords.filter(
          (fork) => succeeded(fork) && fork.followTicks < VALUE_HORIZON_TICKS).length,
      },
    },
    exact,
    coverage: { ...coverage, usableCells: usableZones.size },
    discrimination: { spread: v2Discrimination, ...discrimination },
    heldOut,
    composition,
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
  `EDS-E5a ${output.verdict} · X5a ${output.exact.x5aHarnessReproduces}`
  + ` · X5b E2a-2 ${output.exact.x5bReproducesE2a2} / E2b-0 ${output.exact.x5bReproducesE2b0}`
  + ` · X6 ${output.exact.x6CommittedValueTableMatches}`
  + ` · receptions ${output.census.receptions}`
  + ` · V ${output.census.valueTable.map((row) => (row.shotRate * 100).toFixed(1)).join('/')}`
  + ` (marginal ${(output.census.valueMarginal.shotRate * 100).toFixed(2)}%)`
  + ` · V2 ${(output.v2Discrimination * 100).toFixed(2)}pp`
  + ` · V4 predicted ${output.compositionA.map((bin) => (bin.meanPredicted * 100).toFixed(1)).join('/')}`
  + ` vs realized ${output.compositionA.map((bin) => (bin.realizedConjunction * 100).toFixed(1)).join('/')}`
  + ` · argmax differs ${(output.reported.r5ArgmaxChange.share * 100).toFixed(1)}%`
  + ` · SHA ${sha256}`,
);
