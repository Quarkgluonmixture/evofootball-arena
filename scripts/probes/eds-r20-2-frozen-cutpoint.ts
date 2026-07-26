// RULING #20.1 (2) — E2b-0'S HELD-OUT CHECK, WITH THE CUTPOINTS ACTUALLY FROZEN.
// Authority: docs/world-model/EDS-RULING20-REANALYSES.md §R20-2
//
// E2b-0's census half is reproduced here BYTE-FOR-BYTE (F1 pins that against
// the shipped table). Only the analysis half changes, and only in one place:
// set B is binned by SET A'S boundaries instead of by its own.
//
// E2b-0 wrote `quintilesBy(holdout.forkRecords, ...)`, and `quintilesBy` sorts
// whatever it is given and cuts it into five equal parts. So both arms had
// equal-n quintiles by construction and the comparison asked whether two
// independently-binned sets have similar per-bin rates — not whether A's RULE
// survives on data it has never seen. The rule that runs in the game is A's
// cutpoints applied to unseen options (`bandOf()` reads `THREAT_CALIBRATION`'s
// `keyTo` ladder on every priced option the attempt axis charges for), so it is
// that rule, and not an equal-n re-binning, which needed scoring.
//
// This step may relabel. It may not repair: no table, flag or constant moves.
//
// Inherited header from the probe this reuses:
// EDS E2b-0 THREAT CALIBRATION.
//
// E2a-2's fork-and-force staging, VERBATIM, plus one read-only column: what the
// E0 evaluator predicted for each candidate from the passer's own perceived
// state, before the world was forked. Censusing realized outcomes against that
// prediction turns the corridor read — which is in seconds — into a probability
// on the same axis as the band prior, so a seen option and a blind one can be
// compared without a hand-set weight. X5 is the guard: the outcome census must
// come back byte-equal to E2a-2's, because only an observation was added.
//
// Inherited header from the staging this reuses:
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
  capturePerceptionTruth, createPerceptionMemory, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption } from '../../src/ai/passOptionValue';
import type { KnownReachProfile } from '../../src/ai/reachability';
import {
  OPTION_SPACE_PRIOR_MARGINAL, OPTION_SPACE_PRIOR_TABLE, PASS_PRIOR_BANDS,
  optionSpacePriorAt, THREAT_CALIBRATION, type PassPriorRow,
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
const BAND_TOLERANCE = 0.06;
const MARGINAL_TOLERANCE = 0.02;
const BAND_SAMPLE_FLOOR = 1200;
// E2b-0's own frozen parameters (contract §4).
const AWARENESS = 0.8; // E0's setting, so the read is the one E0 validated
const QUINTILES = 5;
const QUINTILE_FLOOR = 1200; // C1
const DISCRIMINATION_FLOOR = 0.10; // C2, 10.0pp
const CALIBRATION_TOLERANCE = 0.05; // C3, 5.0pp per quintile
const CALIBRATION_MARGINAL_TOLERANCE = 0.02; // C3, 2.0pp
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
  /** E2b-0's read-only column: what the evaluator predicted, before the fork. */
  readonly read: EvaluatorRead | null;
  /** The band prior this candidate would have been priced at (R2's rival). */
  readonly bandSuccess: number;
}

/** E0's prediction for one candidate, from the passer's OWN perceived state. */
interface EvaluatorRead {
  readonly threatSeconds: number;
  readonly touchFailPrior: number;
  readonly flightSeconds: number;
  readonly arrivalSpeed: number;
}

/** Success is the thing being predicted: the intended man ends up in control. */
const succeeded = (fork: Fork): boolean => fork.outcome === 'reachedTarget' && !fork.spilled;

/**
 * Fork the pre-tick state once per candidate, substituting only the target.
 * Everything after the substitution is the live machinery playing that pass.
 */
const forkCandidates = (
  before: Match,
  passerGid: number,
  chosenGid: number,
  candidates: readonly Player[],
  reads: ReadonlyMap<number, EvaluatorRead | null>,
): Fork[] => candidates.map((candidate) => {
  const read = reads.get(candidate.gid) ?? null;
  const fork = cloneSimulationState(before);
  const passer = fork.allPlayers.find((player) => player.gid === passerGid);
  if (!passer) {
    return {
      band: 0, outcome: 'unplayable' as Outcome, spilled: false, adjudicated: false,
      chosen: false, read, bandSuccess: 0,
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
  // Unplayable: the substitution did not become a pass to this man. Counted as
  // its own class, never dropped — ruling #8 (i).
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return { band, outcome: 'unplayable', spilled: false, adjudicated: false, chosen, read, bandSuccess };
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
    return { band, outcome, spilled: false, adjudicated: false, chosen, read, bandSuccess };
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
  return {
    band,
    outcome,
    spilled: event ? !event.clean : false,
    adjudicated: event !== undefined,
    chosen,
    read,
    bandSuccess,
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
    // Perception memory is maintained continuously, on the PRE-step truth, so
    // the passer's snapshot at a decision moment is the state he decided from.
    // A memory chain sampled only at pass moments would not be a memory chain.
    const memories = new Map<number, PerceptionMemory>();
    const snapshots = new Map<number, PerceptionSnapshot>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK') memories.set(player.gid, createPerceptionMemory());
    }
    let key = '';
    while (!match.finished && moments < MOMENTS_PER_SET) {
      // The pre-tick state is the fork point: the brain has not decided yet.
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
      // The read-only column. Priced from the passer's OWN snapshot — never
      // truth — and taken BEFORE the fork, so it is a prediction rather than a
      // description of what then happened.
      const snapshot = snapshots.get(pending.passerGid);
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed,
          accel: player.accel,
          dribbling: player.attrs.dribbling,
        }]),
      );
      const reads = new Map<number, EvaluatorRead | null>();
      for (const candidate of candidates) {
        const value = snapshot === undefined ? null : evaluatePassOption({
          snapshot,
          passerGid: pending.passerGid,
          targetGid: candidate.gid,
          powerMultiplier: 1,
          attackDir: before.teams[passerBefore.side].attackDir,
          reachProfiles,
        });
        reads.set(candidate.gid, value === null ? null : {
          threatSeconds: value.interceptionThreatSeconds,
          touchFailPrior: value.touchFailPrior,
          flightSeconds: value.flightSeconds,
          arrivalSpeed: value.arrivalSpeed,
        });
      }
      const batch = forkCandidates(
        before, pending.passerGid, pending.targetGid, candidates, reads,
      );
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
    forkRecords: forks,
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

/**
 * Bin the playable, priced forks into quintiles of a predicted quantity and
 * report what the world actually did in each. This is the calibration: it turns
 * a prediction into a probability by measuring the prediction.
 */
const quintilesBy = (
  forks: readonly Fork[], value: (read: EvaluatorRead) => number,
) => {
  const priced = forks
    .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
    .map((fork) => ({ fork, key: value(fork.read!) }))
    // Ties broken by the outcome-independent band so the ordering is total and
    // deterministic; never by the outcome, which would fit the curve to itself.
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

/** The spread a predictor achieves — R2's comparison, same forks both ways. */
const spreadOf = (bins: readonly { realizedSuccess: number; n: number }[]): number => {
  const rates = bins.filter((bin) => bin.n > 0).map((bin) => bin.realizedSuccess);
  return rates.length === 0 ? 0 : Math.max(...rates) - Math.min(...rates);
};

/**
 * F2 — A's cutpoints, applied unchanged. This is `bandOf()`'s rule verbatim:
 * the first quintile whose `keyTo` the value does not exceed, and the last
 * quintile for anything past the top boundary. Bin sizes come out unequal, and
 * that inequality IS the measurement of how stable A's cutpoints are.
 */
const binByFrozenCutpoints = (
  forks: readonly Fork[], reference: ReturnType<typeof quintilesBy>,
) => {
  const priced = forks.filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null);
  const bins = reference.map((bin) => ({
    quintile: bin.quintile, keyFrom: bin.keyFrom, keyTo: bin.keyTo,
    n: 0, wins: 0, realizedSuccess: 0,
  }));
  for (const fork of priced) {
    const key = fork.read!.threatSeconds;
    let index = bins.length - 1;
    for (let candidate = 0; candidate < bins.length; candidate++) {
      if (key <= bins[candidate].keyTo) { index = candidate; break; }
    }
    bins[index].n += 1;
    if (succeeded(fork)) bins[index].wins += 1;
  }
  for (const bin of bins) bin.realizedSuccess = bin.n === 0 ? 0 : bin.wins / bin.n;
  return bins;
};

/** The 95% Wilson interval on a rate — ruling #20's semantics, reported beside
 *  the point predicates E2b-0 froze, so the relabel can say where they part. */
const wilson = (wins: number, n: number) => {
  if (n === 0) return { lower: Number.NaN, upper: Number.NaN };
  const z = 1.959963984540054;
  const share = wins / n;
  const denominator = 1 + (z * z) / n;
  const centre = (share + (z * z) / (2 * n)) / denominator;
  const spread = (z * Math.sqrt((share * (1 - share)) / n + (z * z) / (4 * n * n))) / denominator;
  return { lower: Math.max(0, centre - spread), upper: Math.min(1, centre + spread) };
};

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const census = runCensus(CENSUS_SEED_START);
  const holdout = runCensus(HOLDOUT_SEED_START);

  const threatA = quintilesBy(census.forkRecords, (read) => read.threatSeconds);
  // F2: THE ONE CHANGE. B is binned by A's frozen ladder, via bandOf()'s own
  // rule — the first quintile whose keyTo the fork does not exceed.
  const threatB = binByFrozenCutpoints(holdout.forkRecords, threatA);
  // Kept for the relabel: what E2b-0 actually computed, so the two readings sit
  // side by side instead of one quietly replacing the other.
  const threatBSelfBinned = quintilesBy(holdout.forkRecords, (read) => read.threatSeconds);
  const touchA = quintilesBy(census.forkRecords, (read) => read.touchFailPrior);
  // R2's rival predictor, over the SAME forks: the band prior alone.
  const bandBins = quintilesBy(census.forkRecords, () => 0).length === 0 ? [] : (() => {
    const priced = census.forkRecords
      .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
      .sort((left, right) => left.bandSuccess - right.bandSuccess);
    const size = Math.floor(priced.length / QUINTILES);
    return Array.from({ length: QUINTILES }, (_, index) => {
      const from = index * size;
      const to = index === QUINTILES - 1 ? priced.length : from + size;
      const slice = priced.slice(from, to);
      const wins = slice.filter((fork) => succeeded(fork)).length;
      return { quintile: index, n: slice.length, realizedSuccess: slice.length === 0 ? 0 : wins / slice.length };
    });
  })();

  const playablePriced = census.forkRecords.filter(
    (fork) => fork.outcome !== 'unplayable' && fork.read !== null,
  );
  const playable = census.forkRecords.filter((fork) => fork.outcome !== 'unplayable');
  const marginalSuccessA = playablePriced.length === 0
    ? 0 : playablePriced.filter(succeeded).length / playablePriced.length;
  const holdoutPriced = holdout.forkRecords.filter(
    (fork) => fork.outcome !== 'unplayable' && fork.read !== null,
  );
  const marginalSuccessB = holdoutPriced.length === 0
    ? 0 : holdoutPriced.filter(succeeded).length / holdoutPriced.length;

  const calibration = threatA.map((bin, index) => ({
    quintile: index,
    keyFrom: bin.keyFrom,
    keyTo: bin.keyTo,
    nA: bin.n,
    nB: threatB[index].n,
    successA: bin.realizedSuccess,
    successB: threatB[index].realizedSuccess,
    error: Math.abs(bin.realizedSuccess - threatB[index].realizedSuccess),
    ciB: wilson(threatB[index].wins, threatB[index].n),
    /** Whether A's rate is even inside B's own interval — the CI reading of F4. */
    aInsideB: (() => {
      const ci = wilson(threatB[index].wins, threatB[index].n);
      return bin.realizedSuccess >= ci.lower && bin.realizedSuccess <= ci.upper;
    })(),
    /** What E2b-0 reported for this bin, for the relabel. */
    nBSelfBinned: threatBSelfBinned[index].n,
    successBSelfBinned: threatBSelfBinned[index].realizedSuccess,
  }));

  const discrimination = Math.abs(
    threatA[0].realizedSuccess - threatA[QUINTILES - 1].realizedSuccess,
  );

  const rowsEqualAll = (left: readonly PassPriorRow[], right: readonly PassPriorRow[]) =>
    left.length === right.length && left.every((row, index) => rowsEqual(row, right[index]));

  const exact = {
    x5HarnessReproduces: harness.every((entry) => entry.reproduces),
    // X5's second half and the reason the extra column is safe: E2a-2 measured
    // this staging, and only an observation was added.
    x5ReproducesE2a2: rowsEqualAll(census.table, OPTION_SPACE_PRIOR_TABLE)
      && rowsEqual(census.marginal, OPTION_SPACE_PRIOR_MARGINAL),
    x6CommittedCalibrationMatches: THREAT_CALIBRATION.length === threatA.length
      && THREAT_CALIBRATION.every((row, index) => (
        row.n === threatA[index].n && row.realizedSuccess === threatA[index].realizedSuccess
      )),
  };
  // F2: bin sizes in B are REPORTED, never gated (contract §3) — unequal bins
  // are the consequence of freezing the cutpoints, not a defect in the data.
  const coverage = {
    f1SetAFloor: threatA.every((bin) => bin.n >= QUINTILE_FLOOR),
  };
  // F3: the held-out spread, under A's cutpoints.
  const spreadB = spreadOf(threatB);
  const discriminationGate = {
    f3DiscriminatesHeldOut: spreadB >= DISCRIMINATION_FLOOR,
  };
  const calibrationGates = {
    f4Quintiles: calibration.every((entry) => entry.error <= CALIBRATION_TOLERANCE),
    f4Marginal: Math.abs(marginalSuccessA - marginalSuccessB) <= CALIBRATION_MARGINAL_TOLERANCE,
  };

  const pass = Object.values(exact).every(Boolean)
    && Object.values(coverage).every(Boolean)
    && Object.values(discriminationGate).every(Boolean)
    && Object.values(calibrationGates).every(Boolean);

  return {
    experiment: 'R20-2-frozen-cutpoint',
    authority: 'EDS-RULING20-REANALYSES',
    parameters: {
      censusSeedStart: CENSUS_SEED_START,
      holdoutSeedStart: HOLDOUT_SEED_START,
      momentsPerSet: MOMENTS_PER_SET,
      awareness: AWARENESS,
      quintiles: QUINTILES,
      quintileFloor: QUINTILE_FLOOR,
      discriminationFloor: DISCRIMINATION_FLOOR,
      calibrationTolerance: CALIBRATION_TOLERANCE,
    },
    harness,
    census: { table: census.table, marginal: census.marginal, moments: census.moments, forks: census.forks },
    threatQuintilesA: threatA,
    /** B under A's FROZEN cutpoints — the corrected held-out reading. */
    threatQuintilesB: threatB,
    /** B under its OWN cutpoints — what E2b-0 computed, kept for the relabel. */
    threatQuintilesBSelfBinned: threatBSelfBinned,
    binSizeDrift: {
      equalNTarget: threatBSelfBinned.map((bin) => bin.n),
      underFrozenCutpoints: threatB.map((bin) => bin.n),
    },
    heldOutSpread: { frozenCutpoints: spreadB, selfBinned: spreadOf(threatBSelfBinned) },
    calibration,
    marginalSuccess: { setA: marginalSuccessA, setB: marginalSuccessB },
    reported: {
      r1TouchQuintiles: touchA,
      r2WhichReadCarriesMore: {
        threatSpread: spreadOf(threatA),
        bandPriorSpread: spreadOf(bandBins),
        bandBins,
      },
      r3Priced: {
        playable: playable.length,
        priced: playablePriced.length,
        unpricedShare: playable.length === 0
          ? 0 : 1 - playablePriced.length / playable.length,
      },
      r4LookPressurePrecursor: {
        blindMarginal: OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate,
        bestExecutableMeanBand: playablePriced.length === 0
          ? 0 : playablePriced.reduce((sum, fork) => sum + fork.bandSuccess, 0) / playablePriced.length,
      },
    },
    exact,
    coverage,
    discrimination: { topVsBottom: discrimination, ...discriminationGate },
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
  `R20-2 ${output.verdict}`
  + ` · F1 harness ${output.exact.x5HarnessReproduces}`
  + ` staging ${output.exact.x5ReproducesE2a2}`
  + ` committed ${output.exact.x6CommittedCalibrationMatches}`
  + ` · A ${output.threatQuintilesA.map((q) => (q.realizedSuccess * 100).toFixed(1)).join('/')}`
  + ` · B frozen ${output.threatQuintilesB.map((q) => (q.realizedSuccess * 100).toFixed(1)).join('/')}`
  + ` (n ${output.binSizeDrift.underFrozenCutpoints.join('/')})`
  + ` · B self-binned ${output.threatQuintilesBSelfBinned.map((q) => (q.realizedSuccess * 100).toFixed(1)).join('/')}`
  + ` · F3 spread ${(output.heldOutSpread.frozenCutpoints * 100).toFixed(2)}pp`
  + ` (self-binned ${(output.heldOutSpread.selfBinned * 100).toFixed(2)}pp)`
  + ` · F4 worst ${(Math.max(...output.calibration.map((c) => c.error)) * 100).toFixed(2)}pp`
  + ` marginal ${(Math.abs(output.marginalSuccess.setA - output.marginalSuccess.setB) * 100).toFixed(2)}pp`
  + ` · A-inside-B ${output.calibration.filter((c) => c.aInsideB).length}/5`
  + ` · SHA ${sha256}`,
);
