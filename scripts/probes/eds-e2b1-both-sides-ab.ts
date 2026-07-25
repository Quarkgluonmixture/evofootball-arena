// EDS E2b-1 BOTH-SIDES PERCEPTION A/B.
// Authority: docs/world-model/EDS-E2B1-BOTH-SIDES-AB.md
//
// The experiment the instruments were built for. Four awareness arms price the
// same real decision moments from the passer's OWN snapshot on one measured
// probability axis — E2b-0's exchange rate for READ, the band table for
// SEEN-UNREAD, the marginal for UNSEEN — choose among EXECUTABLE options only,
// and each arm's choice is forked and forced so the outcome belongs to the
// world rather than to the model. The defence reads its own perceived ball in
// the same arm, which is what makes it a both-sides test.
//
// Staging and census below are E2a-2's and E2b-0's, reused unchanged; X5 is
// the gate that the re-derived factors are the curve E2b-0 banked.
//
// Inherited header:
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
  capturePerceptionTruth, createPerceptionMemory, oraclePerceptionSnapshot, perceiveSnapshot,
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
const CALIBRATION_MARGINAL_TOLERANCE = 0.02;
// E2b-1's own frozen parameters (contract §4, §5).
const AB_MOMENTS = Number(process.argv[3] ?? 3000);
const AB_LONG_METRES = 18; // G2's long-option threshold
const G1_NON_INFERIORITY = 0.02; // 2.0pp
const G2_LONG_SHARE_BAND = 0.25; // ±25% relative
const G2_DISTANCE_BAND = 0.15; // ±15% relative
const G3_MEAN_BUDGET = 1.25;
const G3_P95_BUDGET = 1.50;
const PERF_MATCHES = 12; // sampling budget only; the ratio gates are frozen
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


// --- the A/B ---------------------------------------------------------------
type InfoClass = 'READ' | 'SEEN-UNREAD' | 'UNSEEN';

interface PricedOption {
  readonly targetGid: number;
  readonly infoClass: InfoClass;
  /** Measured probability the intended man ends in clean control. */
  readonly price: number;
  readonly corridorFactor: number;
  readonly touchFactor: number;
  readonly executable: boolean;
  readonly distance: number;
}

/** E2b-0's curve, re-derived as its two factors (contract §3, gate X5). */
interface QuintileFactors {
  readonly keyTo: number;
  readonly reached: number;
  readonly cleanGivenReached: number;
  readonly composite: number;
  readonly n: number;
}

const quintileOf = (
  threatSeconds: number, factors: readonly QuintileFactors[],
): QuintileFactors => {
  for (const row of factors) if (threatSeconds <= row.keyTo) return row;
  return factors[factors.length - 1];
};

/**
 * Price one candidate on the single measured axis. Every number here came from
 * a census; nothing is weighted by hand. The class decides WHICH census.
 */
const priceOption = (
  snapshot: PerceptionSnapshot,
  passerGid: number,
  candidate: Player,
  attackDir: 1 | -1,
  reachProfiles: ReadonlyMap<number, KnownReachProfile>,
  factors: readonly QuintileFactors[],
): PricedOption => {
  const seenTarget = snapshot.players.find((entry) => entry.gid === candidate.gid);
  const seenPasser = snapshot.players.find((entry) => entry.gid === passerGid);
  if (!seenTarget || !seenPasser) {
    const row = OPTION_SPACE_PRIOR_MARGINAL;
    return {
      targetGid: candidate.gid,
      infoClass: 'UNSEEN',
      price: row.reachedRate * row.cleanGivenReached,
      corridorFactor: row.reachedRate,
      touchFactor: row.cleanGivenReached,
      executable: false, // ruling #8 (l): priced always, kicked to never
      distance: Number.NaN, // he does not know, and it must not read as zero
    };
  }
  const distance = distanceBetween(seenPasser.pos, seenTarget.pos);
  const value = evaluatePassOption({
    snapshot, passerGid, targetGid: candidate.gid, powerMultiplier: 1, attackDir, reachProfiles,
  });
  if (value === null) {
    // SEEN-UNREAD: the man is there, the lane is not readable. 28.48% of
    // playable options live here and E2a-1 folded them in silently.
    const row = optionSpacePriorAt(distance);
    return {
      targetGid: candidate.gid,
      infoClass: 'SEEN-UNREAD',
      price: row.reachedRate * row.cleanGivenReached,
      corridorFactor: row.reachedRate,
      touchFactor: row.cleanGivenReached,
      executable: true,
      distance,
    };
  }
  const row = quintileOf(value.interceptionThreatSeconds, factors);
  return {
    targetGid: candidate.gid,
    infoClass: 'READ',
    price: row.reached * row.cleanGivenReached,
    corridorFactor: row.reached,
    touchFactor: row.cleanGivenReached,
    executable: true,
    distance,
  };
};

interface ArmResult {
  readonly awareness: number;
  readonly oracle: boolean;
  readonly moments: number;
  readonly chosen: number;
  readonly realizedSuccess: number;
  readonly classShares: Record<InfoClass, number>;
  readonly meanChosenDistance: number;
  readonly longShare: number;
  readonly agreesWithBrain: number;
  readonly lookPressureReadAxis: number;
  readonly lookPressureBandAxis: number;
}

const ARMS = [
  { awareness: 0.2, oracle: false },
  { awareness: 0.5, oracle: false },
  { awareness: 0.8, oracle: false },
  { awareness: 0.8, oracle: true },
] as const;

/**
 * Carry the defender's ACCUMULATED memory into the fork. Without this each
 * fork's defenders start blind and have to re-acquire the ball before they can
 * enter an interception, which would under-intercept the perceived arms and
 * flatter them against the omniscient oracle — a bias pointing the wrong way
 * through the not-looking gate. The memory copied in is the one that body
 * actually built in this match at this awareness.
 */
const cloneMemory = (memory: PerceptionMemory): PerceptionMemory => ({
  nextScanTick: memory.nextScanTick,
  ball: memory.ball === null ? null : { ...memory.ball, pos: { ...memory.ball.pos }, vel: { ...memory.ball.vel } },
  players: new Map([...memory.players].map(([gid, stored]) => [gid, {
    ...stored, pos: { ...stored.pos }, vel: { ...stored.vel }, bodyDir: { ...stored.bodyDir },
  }])),
});

const runAB = (factors: readonly QuintileFactors[]) => {
  const arms = ARMS.map(() => ({
    moments: 0, chosen: 0, wins: 0, distance: 0, long: 0, agrees: 0,
    read: 0, seenUnread: 0, unseen: 0, options: 0,
    lookRead: 0, lookBand: 0,
  }));
  let sampled = 0;
  for (
    let seed = CENSUS_SEED_START;
    seed < CENSUS_SEED_START + MAX_MATCHES_PER_SET && sampled < AB_MOMENTS;
    seed++
  ) {
    const match = matchOf(seed);
    const memories = ARMS.map(() => new Map<number, PerceptionMemory>());
    const snapshots = ARMS.map(() => new Map<number, PerceptionSnapshot>());
    for (const player of match.allPlayers) {
      if (player.role === 'GK') continue;
      memories.forEach((memory) => memory.set(player.gid, createPerceptionMemory()));
    }
    let key = '';
    while (!match.finished && sampled < AB_MOMENTS) {
      const before = cloneSimulationState(match);
      const kindBefore = match.lastPassKind;
      const truth = capturePerceptionTruth(match);
      ARMS.forEach((arm, index) => {
        for (const player of match.allPlayers) {
          if (player.role === 'GK' || player.sentOff) continue;
          snapshots[index].set(player.gid, arm.oracle
            ? oraclePerceptionSnapshot(truth, player.gid)
            : perceiveSnapshot(truth, player.gid, arm.awareness, seed, memories[index].get(player.gid)!));
        }
      });
      match.step(DT);
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null) continue;
      key = fresh;
      const pending = match.pendingPass!;
      const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
      if (!passerBefore) continue;
      const candidates = before.teams[passerBefore.side].players.filter((player) => (
        player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
        && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
        && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
      ));
      if (candidates.length === 0) continue;
      sampled += 1;
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed, accel: player.accel, dribbling: player.attrs.dribbling,
        }]),
      );
      const attackDir = before.teams[passerBefore.side].attackDir;

      ARMS.forEach((arm, index) => {
        const acc = arms[index];
        acc.moments += 1;
        const snapshot = snapshots[index].get(pending.passerGid);
        if (snapshot === undefined) return;
        const priced = candidates.map((candidate) => priceOption(
          snapshot, pending.passerGid, candidate, attackDir, reachProfiles, factors,
        ));
        acc.options += priced.length;
        for (const option of priced) {
          if (option.infoClass === 'READ') acc.read += 1;
          else if (option.infoClass === 'SEEN-UNREAD') acc.seenUnread += 1;
          else acc.unseen += 1;
        }
        const executable = priced.filter((option) => option.executable);
        const blind = priced.filter((option) => !option.executable);
        if (executable.length === 0) return;
        // Look-pressure on both axes (ruling #9.3 (d)).
        const bestExecutable = executable.reduce(
          (best, option) => (option.price > best.price
            || (option.price === best.price && option.targetGid < best.targetGid) ? option : best),
        );
        if (blind.length > 0) {
          if (blind[0].price > bestExecutable.price) acc.lookRead += 1;
          const bestExecutableBand = Math.max(...executable.map(
            (option) => (Number.isNaN(option.distance)
              ? OPTION_SPACE_PRIOR_MARGINAL.receptionSuccessRate
              : optionSpacePriorAt(option.distance).receptionSuccessRate),
          ));
          if (blind[0].price > bestExecutableBand) acc.lookBand += 1;
        }
        acc.chosen += 1;
        acc.distance += bestExecutable.distance;
        if (bestExecutable.distance >= AB_LONG_METRES) acc.long += 1;
        if (bestExecutable.targetGid === pending.targetGid) acc.agrees += 1;
        // Fork and force the arm's own choice; the defence reads its own ball.
        const fork = cloneSimulationState(before);
        (fork as unknown as { edsPerceivedDefence: boolean }).edsPerceivedDefence = !arm.oracle;
        (fork as unknown as { edsAwareness: number }).edsAwareness = arm.awareness;
        if (!arm.oracle) {
          for (const [gid, memory] of memories[index]) {
            fork.perceptionMemories.set(gid, cloneMemory(memory));
          }
        }
        fork.forcedPassTarget = bestExecutable.targetGid;
        fork.step(DT);
        fork.forcedPassTarget = null;
        const fp = fork.pendingPass;
        if (!fp || fp.targetGid !== bestExecutable.targetGid) return;
        const kickTick = fork.simTick;
        let toucherGid = -1;
        let reached = false;
        for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
          fork.step(DT);
          const toucher = fork.ball.lastTouch;
          if (toucher && toucher.gid !== pending.passerGid) {
            toucherGid = toucher.gid;
            reached = toucher.gid === bestExecutable.targetGid;
            break;
          }
          if (fork.phase !== 'playing') break;
        }
        if (!reached) return;
        const touchTick = fork.simTick;
        for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
          fork.step(DT);
        }
        const event = fork.firstTouchTrace.find((trace) => (
          trace.gid === toucherGid && trace.intendedTarget
          && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
        ));
        if (event === undefined || event.clean) acc.wins += 1;
      });
    }
  }
  return ARMS.map((arm, index): ArmResult => {
    const acc = arms[index];
    const share = (count: number) => (acc.options === 0 ? 0 : count / acc.options);
    return {
      awareness: arm.awareness,
      oracle: arm.oracle,
      moments: acc.moments,
      chosen: acc.chosen,
      realizedSuccess: acc.chosen === 0 ? 0 : acc.wins / acc.chosen,
      classShares: { READ: share(acc.read), 'SEEN-UNREAD': share(acc.seenUnread), UNSEEN: share(acc.unseen) },
      meanChosenDistance: acc.chosen === 0 ? 0 : acc.distance / acc.chosen,
      longShare: acc.chosen === 0 ? 0 : acc.long / acc.chosen,
      agreesWithBrain: acc.chosen === 0 ? 0 : acc.agrees / acc.chosen,
      lookPressureReadAxis: acc.moments === 0 ? 0 : acc.lookRead / acc.moments,
      lookPressureBandAxis: acc.moments === 0 ? 0 : acc.lookBand / acc.moments,
    };
  });
};

// --- X5: re-derive E2b-0's curve as its two factors --------------------------
const deriveFactors = (forks: readonly Fork[]): QuintileFactors[] => {
  const priced = forks
    .filter((fork) => fork.outcome !== 'unplayable' && fork.read !== null)
    .map((fork) => ({ fork, key: fork.read!.threatSeconds }))
    .sort((left, right) => left.key - right.key || left.fork.bandSuccess - right.fork.bandSuccess);
  const size = Math.floor(priced.length / QUINTILES);
  return Array.from({ length: QUINTILES }, (_, index) => {
    const from = index * size;
    const to = index === QUINTILES - 1 ? priced.length : from + size;
    const slice = priced.slice(from, to);
    const reachedForks = slice.filter((entry) => entry.fork.outcome === 'reachedTarget');
    const spilled = reachedForks.filter((entry) => entry.fork.spilled).length;
    const reached = slice.length === 0 ? 0 : reachedForks.length / slice.length;
    const cleanGivenReached = reachedForks.length === 0 ? 0 : 1 - spilled / reachedForks.length;
    return {
      keyTo: slice.length === 0 ? 0 : slice[slice.length - 1].key,
      reached,
      cleanGivenReached,
      composite: reached * cleanGivenReached,
      n: slice.length,
    };
  });
};

// --- G3: perf, flag off vs flag on, same seeds -------------------------------
const perfArm = (perceived: boolean) => {
  const samples: number[] = [];
  for (let index = 0; index < PERF_MATCHES; index++) {
    const seed = 990_000 + index;
    const match = new Match({
      seed,
      teamA: team('A', seed * 2 + 1),
      teamB: team('B', seed * 2 + 2),
      duration: MATCH_DURATION,
      edsPerceivedDefence: perceived,
      edsAwareness: 0.8,
    });
    while (!match.finished) {
      const before = process.hrtime.bigint();
      match.step(DT);
      samples.push(Number(process.hrtime.bigint() - before) / 1000);
    }
  }
  samples.sort((left, right) => left - right);
  return {
    usPerStep: samples.reduce((sum, value) => sum + value, 0) / samples.length,
    p95: samples[Math.floor(samples.length * 0.95)],
    steps: samples.length,
  };
};

const rowsEqual = (left: PassPriorRow, right: PassPriorRow): boolean =>
  (Object.keys(left) as (keyof PassPriorRow)[]).every((key) => left[key] === right[key]);
const canonical = (value: unknown): string => JSON.stringify(value);
const relative = (value: number, reference: number): number =>
  (reference === 0 ? 0 : Math.abs(value - reference) / reference);

const runExperiment = () => {
  const harness = HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) }));
  const census = runCensus(CENSUS_SEED_START);
  const factors = deriveFactors(census.forkRecords);
  const arms = runAB(factors);
  // Perf is measured outside the census so the fork load cannot colour it.
  const perfOff = perfArm(false);
  const perfOn = perfArm(true);

  const oracle = arms[arms.length - 1];
  const chain = arms.slice(1).map((arm, index) => ({
    from: `${arms[index].oracle ? 'oracle' : arms[index].awareness}`,
    to: `${arm.oracle ? 'oracle' : arm.awareness}`,
    delta: arm.realizedSuccess - arms[index].realizedSuccess,
  }));

  const exact = {
    x5Harness: harness.every((entry) => entry.reproduces),
    // The census this all rests on is still E2a-2's.
    x5CensusReproduces: census.table.every((row, index) => rowsEqual(row, OPTION_SPACE_PRIOR_TABLE[index]))
      && rowsEqual(census.marginal, OPTION_SPACE_PRIOR_MARGINAL),
    // The factors must BE E2b-0's banked curve, and must multiply back to it.
    x5FactorsReproduceCurve: factors.every((row, index) => (
      row.n === THREAT_CALIBRATION[index].n
      && Math.abs(row.composite - THREAT_CALIBRATION[index].realizedSuccess) < 1e-12
    )),
  };
  const g1 = {
    nonInferiorityChain: chain.every((step) => step.delta >= -G1_NON_INFERIORITY),
  };
  const perceived08 = arms[2];
  const g2 = {
    longShare: relative(perceived08.longShare, oracle.longShare) <= G2_LONG_SHARE_BAND,
    meanDistance: relative(perceived08.meanChosenDistance, oracle.meanChosenDistance)
      <= G2_DISTANCE_BAND,
  };
  const g3 = {
    mean: perfOn.usPerStep <= perfOff.usPerStep * G3_MEAN_BUDGET,
    p95: perfOn.p95 <= perfOff.p95 * G3_P95_BUDGET,
  };

  const pass = Object.values(exact).every(Boolean) && Object.values(g1).every(Boolean)
    && Object.values(g2).every(Boolean) && Object.values(g3).every(Boolean);

  return {
    experiment: 'EDS-E2b-1',
    authority: 'EDS-E2B1-BOTH-SIDES-AB',
    parameters: {
      abMoments: AB_MOMENTS,
      arms: ARMS,
      longMetres: AB_LONG_METRES,
      nonInferiority: G1_NON_INFERIORITY,
      perfBudgets: { mean: G3_MEAN_BUDGET, p95: G3_P95_BUDGET },
    },
    harness,
    factors,
    arms,
    chain,
    perf: { off: perfOff, on: perfOn, baselineUsPerStep: 5.32 },
    reported: {
      r1ClassShares: arms.map((arm) => ({
        arm: arm.oracle ? 'oracle' : arm.awareness, ...arm.classShares,
      })),
      r2LookPressure: arms.map((arm) => ({
        arm: arm.oracle ? 'oracle' : arm.awareness,
        readAxis: arm.lookPressureReadAxis,
        bandAxis: arm.lookPressureBandAxis,
      })),
      r3EndpointLift: oracle.realizedSuccess - arms[0].realizedSuccess,
      r4Factors: factors,
      r5AgreesWithBrain: arms.map((arm) => ({
        arm: arm.oracle ? 'oracle' : arm.awareness, agrees: arm.agreesWithBrain,
      })),
    },
    exact,
    g1,
    g2,
    g3,
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
  `EDS-E2b-1 ${output.verdict} · X5 ${output.exact.x5Harness}/${output.exact.x5CensusReproduces}/${output.exact.x5FactorsReproduceCurve}`
  + ` · success ${output.arms.map((a) => (a.realizedSuccess * 100).toFixed(1)).join('/')}`
  + ` · chain ${output.chain.map((c) => (c.delta * 100).toFixed(1)).join('/')}`
  + ` · long share ${output.arms.map((a) => (a.longShare * 100).toFixed(1)).join('/')}`
  + ` · perf ${output.perf.off.usPerStep.toFixed(2)}→${output.perf.on.usPerStep.toFixed(2)}µs`
  + ` · SHA ${sha256}`,
);
