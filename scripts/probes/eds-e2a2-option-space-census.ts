// EDS E2a-2 OPTION-SPACE CENSUS (counterfactual).
// Authority: docs/world-model/EDS-E2A2-OPTION-SPACE-CENSUS.md
//
// E2a-1 censused the passes the AI CHOSE to play, and its P3 caught that this
// is a selected sample — the chooser had already filtered for options it liked,
// while the prior must price options nobody chose and nobody saw. So this
// measures the population the evaluator actually prices: at each real decision
// moment the full candidate set is enumerated, the deterministic world is
// forked per candidate, and the intervention is on TARGET CHOICE ONLY — power,
// lead, aim spray, offside and bookkeeping all run the live machinery.
//
// The gate everything rests on is X5: arming the seam with the target the brain
// itself chose must replay the unforked match bit-identically. A fork that
// cannot reproduce reality has no standing to report what would have happened.
import { createHash } from 'node:crypto';
import {
  OPTION_SPACE_PRIOR_MARGINAL, OPTION_SPACE_PRIOR_TABLE, PASS_PRIOR_BANDS, PASS_PRIOR_MARGINAL,
  PASS_PRIOR_TABLE, type PassPriorRow,
} from '../../src/ai/passPrior';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §3, §4) ------------------------------------
const CENSUS_SEED_START = 700_000;
const HOLDOUT_SEED_START = 710_000;
const MOMENTS_PER_SET = Number(process.argv[2] ?? 4500);
const HARNESS_SEEDS = [700_001, 700_002, 700_003] as const;
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const BAND_TOLERANCE = 0.06; // P2, 6.0pp
const MARGINAL_TOLERANCE = 0.02; // P2, 2.0pp
const BAND_SAMPLE_FLOOR = 1200; // P2: below this a band is reported, not gated
const OWN_TARGET_PLAYABLE_FLOOR = 0.999; // P1
const MAX_MATCHES_PER_SET = 4000; // a backstop, never expected to bind

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

/**
 * A newly registered PLAIN ground pass, or null. `pendingPass` alone is not
 * enough: through balls, crosses, lofted passes and the corner cutback all
 * register one, and the seam deliberately substitutes none of them — the
 * contract's population is "a tick where the brain plays a plain ground pass"
 * (§3). `lastPassKind` is how the sim itself distinguishes them, and
 * `performCutback` tags 'cross', so this isolates `performPass` exactly.
 */
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

// --- the counterfactual census ----------------------------------------------
type Outcome = 'intercepted' | 'reachedTarget' | 'otherTeammate' | 'unresolved' | 'unplayable';

interface Fork {
  readonly band: number;
  readonly outcome: Outcome;
  readonly spilled: boolean;
  readonly adjudicated: boolean;
  /** True for the candidate the brain would have chosen unaided. */
  readonly chosen: boolean;
}

/**
 * Fork the pre-tick state once per candidate, substituting only the target.
 * Everything after the substitution is the live machinery playing that pass.
 */
const forkCandidates = (
  before: Match, passerGid: number, chosenGid: number, candidates: readonly Player[],
): Fork[] => candidates.map((candidate) => {
  const fork = cloneSimulationState(before);
  const passer = fork.allPlayers.find((player) => player.gid === passerGid);
  if (!passer) {
    return { band: 0, outcome: 'unplayable' as Outcome, spilled: false, adjudicated: false, chosen: false };
  }
  const band = bandIndexOf(distanceBetween(passer.pos, candidate.pos));
  const chosen = candidate.gid === chosenGid;
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  // Unplayable: the substitution did not become a pass to this man. Counted as
  // its own class, never dropped — ruling #8 (i).
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return { band, outcome: 'unplayable', spilled: false, adjudicated: false, chosen };
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
  if (outcome !== 'reachedTarget') return { band, outcome, spilled: false, adjudicated: false, chosen };
  // Let the adjudication land: contact and first touch are three ticks apart.
  const touchTick = fork.simTick;
  for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
    fork.step(DT);
  }
  const event = fork.firstTouchTrace.find((trace) => (
    trace.gid === toucherGid && trace.intendedTarget
    && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
  ));
  return {
    band,
    outcome,
    spilled: event ? !event.clean : false,
    adjudicated: event !== undefined,
    chosen,
  };
});

const tabulate = (forks: readonly Fork[], bandFrom: number, bandTo: number): PassPriorRow => {
  // UNPLAYABLE is not an outcome of a pass — it is the absence of one — so it
  // is excluded from the rate denominator and reported separately (R3).
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
    let key = '';
    while (!match.finished && moments < MOMENTS_PER_SET) {
      // The pre-tick state is the fork point: the brain has not decided yet.
      const before = cloneSimulationState(match);
      const kindBefore = match.lastPassKind;
      match.step(DT);
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null) continue;
      key = fresh;
      const pending = match.pendingPass!;
      const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
      if (!passerBefore) continue;
      // The full candidate set: every outfield teammate in the censused window.
      // No nearest-only and no near-stationary filter — both were isolation
      // devices for other questions and would re-select the population.
      const candidates = before.teams[passerBefore.side].players.filter((player) => (
        player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
        && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
        && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
      ));
      if (candidates.length === 0) continue;
      moments += 1;
      const batch = forkCandidates(before, pending.passerGid, pending.targetGid, candidates);
      // P1 asks whether the SEAM can play the brain's own choice. That question
      // is only askable when the chosen man is inside the censused window —
      // otherwise no fork is tagged `chosen` and the moment says nothing about
      // the seam. The out-of-window share is a finding in its own right (R5).
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
  const chosen = forks.filter((fork) => fork.chosen);
  const reached = forks.filter((fork) => fork.outcome === 'reachedTarget');
  return {
    table,
    marginal,
    chosenSubset: tabulate(chosen, -1, -1),
    moments,
    matches,
    forks: forks.length,
    unplayable: forks.filter((fork) => fork.outcome === 'unplayable').length,
    ownTargetPlayableRate: ownTargetInWindow === 0 ? 0 : ownTargetPlayable / ownTargetInWindow,
    ownTargetInWindow,
    chosenOutOfWindow,
    chosenOutOfWindowShare: moments === 0 ? 0 : chosenOutOfWindow / moments,
    adjudication: {
      reached: reached.length,
      adjudicated: reached.filter((fork) => fork.adjudicated).length,
      unadjudicated: reached.filter((fork) => !fork.adjudicated).length,
      spilled: reached.filter((fork) => fork.spilled).length,
    },
  };
};

const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);
const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const census = runCensus(CENSUS_SEED_START);
  const holdout = runCensus(HOLDOUT_SEED_START);

  const calibration = census.table.map((row, index) => {
    const other = holdout.table[index];
    const gated = row.passes >= BAND_SAMPLE_FLOOR && other.passes >= BAND_SAMPLE_FLOOR;
    return {
      band: `${row.bandFrom}-${row.bandTo}`,
      passesA: row.passes,
      passesB: other.passes,
      successA: row.receptionSuccessRate,
      successB: other.receptionSuccessRate,
      interceptedError: Math.abs(row.interceptedRate - other.interceptedRate),
      successError: Math.abs(row.receptionSuccessRate - other.receptionSuccessRate),
      gated,
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

  const exact = {
    x5HarnessReproduces: harness.every((entry) => entry.reproduces),
    x6CommittedTableMatchesCensus:
      OPTION_SPACE_PRIOR_TABLE.length === census.table.length
      && OPTION_SPACE_PRIOR_TABLE.every((row, index) => rowsEqual(row, census.table[index]))
      && rowsEqual(OPTION_SPACE_PRIOR_MARGINAL, census.marginal),
  };
  const completeness = {
    // Every fork carries exactly one of the five classes, and every moment
    // contributed at least one fork.
    p1AllClassified: census.forks > 0 && census.forks >= census.moments
      && holdout.forks >= holdout.moments,
    p1MomentsCollected: census.moments === MOMENTS_PER_SET && holdout.moments === MOMENTS_PER_SET,
    p1OwnTargetPlayable: census.ownTargetPlayableRate >= OWN_TARGET_PLAYABLE_FLOOR
      && holdout.ownTargetPlayableRate >= OWN_TARGET_PLAYABLE_FLOOR,
  };
  const calibrationGates = {
    p2Bands: calibration.filter((entry) => entry.gated).every((entry) =>
      entry.interceptedError <= BAND_TOLERANCE && entry.successError <= BAND_TOLERANCE),
    p2Marginal: marginalCalibration.interceptedError <= MARGINAL_TOLERANCE
      && marginalCalibration.successError <= MARGINAL_TOLERANCE,
  };

  // Reported, never gated (ruling #8 (j)).
  const reported = {
    r1ChooserLift: {
      optionSpaceSuccess: census.marginal.receptionSuccessRate,
      chosenSubsetSuccess: census.chosenSubset.receptionSuccessRate,
      passLogSuccess: PASS_PRIOR_MARGINAL.receptionSuccessRate,
      liftOverOptionSpace:
        census.chosenSubset.receptionSuccessRate - census.marginal.receptionSuccessRate,
      optionSpaceMinusPassLog:
        census.marginal.receptionSuccessRate - PASS_PRIOR_MARGINAL.receptionSuccessRate,
    },
    r2PricedAxisGradient: {
      shortestBand: census.table[0].receptionSuccessRate,
      longestBand: census.table[census.table.length - 1].receptionSuccessRate,
      gradient: census.table[0].receptionSuccessRate
        - census.table[census.table.length - 1].receptionSuccessRate,
      passLogGradient: PASS_PRIOR_TABLE[0].receptionSuccessRate
        - PASS_PRIOR_TABLE[PASS_PRIOR_TABLE.length - 1].receptionSuccessRate,
    },
    r3Unplayable: {
      count: census.unplayable,
      share: census.forks === 0 ? 0 : census.unplayable / census.forks,
      ownTargetPlayableRate: census.ownTargetPlayableRate,
    },
    r4Adjudication: census.adjudication,
    r5ChosenOutOfWindow: {
      moments: census.moments,
      inWindow: census.ownTargetInWindow,
      outOfWindow: census.chosenOutOfWindow,
      share: census.chosenOutOfWindowShare,
    },
  };

  const pass = Object.values(exact).every(Boolean)
    && Object.values(completeness).every(Boolean)
    && Object.values(calibrationGates).every(Boolean);

  return {
    experiment: 'EDS-E2a-2',
    authority: 'EDS-E2A2-OPTION-SPACE-CENSUS',
    parameters: {
      censusSeedStart: CENSUS_SEED_START,
      holdoutSeedStart: HOLDOUT_SEED_START,
      momentsPerSet: MOMENTS_PER_SET,
      bands: PASS_PRIOR_BANDS,
      bandTolerance: BAND_TOLERANCE,
      marginalTolerance: MARGINAL_TOLERANCE,
      bandSampleFloor: BAND_SAMPLE_FLOOR,
    },
    harness,
    census: {
      table: census.table,
      marginal: census.marginal,
      chosenSubset: census.chosenSubset,
      moments: census.moments,
      matches: census.matches,
      forks: census.forks,
    },
    holdout: { table: holdout.table, marginal: holdout.marginal, forks: holdout.forks },
    calibration,
    marginalCalibration,
    reported,
    exact,
    completeness,
    calibrationGates,
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
  `EDS-E2a-2 ${output.verdict} · X5 ${output.exact.x5HarnessReproduces}`
  + ` · X6 ${output.exact.x6CommittedTableMatchesCensus}`
  + ` · forks ${output.census.forks} (unplayable ${(output.reported.r3Unplayable.share * 100).toFixed(2)}%)`
  + ` · option-space ${(output.census.marginal.receptionSuccessRate * 100).toFixed(2)}%`
  + ` vs chosen ${(output.census.chosenSubset.receptionSuccessRate * 100).toFixed(2)}%`
  + ` vs pass-log ${(PASS_PRIOR_MARGINAL.receptionSuccessRate * 100).toFixed(2)}%`
  + ` · gradient ${(output.reported.r2PricedAxisGradient.gradient * 100).toFixed(2)}pp`
  + ` · SHA ${sha256}`,
);
