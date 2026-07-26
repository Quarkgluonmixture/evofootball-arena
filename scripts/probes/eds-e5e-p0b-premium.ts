// EDS E5e PHASE 0 (b) — THE TWO PREMIUMS, AGAINST THE DEPLOYED AXIS.
// Authority: docs/world-model/EDS-E5E-STATE-CONDITIONAL.md §3
//
// E5c (b) measured a third-man premium against the COMPOSED V̂, a table that has
// since been superseded twice. The axis that is deployed today is the committed
// attempt table, and ruling #21.3 (b) asks the same question of it — for BOTH
// patterns, because the seesaw is a two-sided fact and a repair certified on one
// side would be the same mistake in the other direction.
//
// The statistic is a difference in differences. A table that under-predicts
// everywhere is miscalibrated; a table that under-predicts ONLY where the
// pattern's runner arrives is blind to the state. Subtracting the control arm is
// what makes the premium a claim about STATE rather than about level, and gate
// P4 keeps that distinction binding.
import { createHash } from 'node:crypto';
import {
  advancePerceptionMemory, capturePerceptionTruth, createPerceptionMemory,
  materialisePerceptionSnapshot, type PerceptionMemory, type PerceptionSnapshot,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption } from '../../src/ai/passOptionValue';
import {
  ATTEMPT_VALUE_MARGINAL, THREAT_CALIBRATION, attemptValueAt, valueZoneIndex,
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

// --- frozen parameters (contract §3) ----------------------------------------
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const VALUE_HORIZON_TICKS = 240;
const AWARENESS = 0.8;

const A_SEED_START = 810_000;
const A_HARNESS_SEEDS = [810_001, 810_002, 810_003] as const;
const A_MOMENT_BUDGET = Number(process.argv[2] ?? 3000);
const A_MATCH_CAP = 4000;

const B_SEED_START = 820_000;
const B_HARNESS_SEEDS = [820_001, 820_002, 820_003] as const;
const B_MOMENT_FLOOR = Number(process.argv[3] ?? 2400); // P1
const B_MATCH_CAP = Number(process.argv[4] ?? 50_000); // contract §3.5

/** The staging check (§6.2 note): unfiltered vs scout-filtered, this many matches. */
const STAGING_CHECK_MATCHES = Number(process.argv[5] ?? 200);

const PATTERN_FORK_FLOOR = 2400; // P1
const CONTROL_GAP_BAND = 0.02; // P4, ±2.0pp
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50001; // frozen (contract §3.4)

// The legacy licence predicates (`PlayerBrain.ts`), read from truth.
const THIRD_MAN_WINDOW_SECONDS = 1.5;
const THIRD_MAN_MIN_GAIN = 0.15;
const WALL_RETURN_MIN_GAIN = 0.2;
const OVERLAP_MIN_ABS_Y = 9;
const OVERLAP_MIN_LOCAL_X_GAIN = -6;

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

// --- X5: the fork must replay reality (E2a-2's gate, verbatim) --------------
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

// --- the licence predicates (contract §3.3) ---------------------------------
type Licence = 'third-man' | 'wall-return' | 'overlap';

const licenceFor = (before: Match, passer: Player, mate: Player): Licence | null => {
  const attacking = before.teams[passer.side];
  const localX = attacking.localX(passer.pos.x);
  const mateLocalX = attacking.localX(mate.pos.x);
  const gain = clamp01((mateLocalX - localX + 30) / 60) * 2 - 1;
  // 套边: the run must have COME AROUND — wide, and level or beyond.
  if (attacking.overlapper === mate.index && Math.abs(mate.pos.y) > OVERLAP_MIN_ABS_Y
    && mateLocalX > localX + OVERLAP_MIN_LOCAL_X_GAIN) return 'overlap';
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

/**
 * The candidate window and the licence map at one pass moment, or null if this
 * moment does not qualify.
 *
 * ONE function, used by BOTH walks. The scout proposes ticks and the replay
 * re-derives everything from its own clone, so the fast staging cannot drift
 * from the slow one by construction rather than by gate — and the reported
 * staging check in §6.2 measures that claim anyway.
 */
const momentAt = (before: Match, passerGid: number, wanted: 'legacy' | 'overlap') => {
  const passer = before.allPlayers.find((player) => player.gid === passerGid);
  if (!passer) return null;
  const attacking = before.teams[passer.side];
  const candidates = attacking.players.filter((player) => (
    player.gid !== passer.gid && !player.sentOff && player.role !== 'GK'
    && distanceBetween(player.pos, passer.pos) >= MIN_PASS_DISTANCE
    && distanceBetween(player.pos, passer.pos) <= MAX_PASS_DISTANCE
  ));
  if (candidates.length < 2) return null;
  const licences = new Map<number, Licence | null>(
    candidates.map((mate) => [mate.gid, licenceFor(before, passer, mate)]),
  );
  const fires = wanted === 'overlap'
    ? candidates.some((mate) => licences.get(mate.gid) === 'overlap')
    // Harvest A's population is the census's own trigger: third-man / wall-return.
    : candidates.some((mate) => {
      const licence = licences.get(mate.gid);
      return licence === 'third-man' || licence === 'wall-return';
    });
  if (!fires) return null;
  return { passer, candidates, licences };
};

// --- one forced attempt, followed from the KICK -----------------------------
interface Fork {
  readonly moment: number;
  readonly arm: 'pattern' | 'control' | 'other-licence';
  readonly licence: Licence | null;
  readonly cell: number;
  readonly band: number;
  readonly predicted: number;
  readonly predictedCell: number;
  readonly reached: boolean;
  readonly cleanReception: boolean;
  readonly shot: boolean;
}

const forceAndFollow = (
  before: Match,
  passerGid: number,
  candidate: Player,
  snapshot: PerceptionSnapshot | null,
  reachProfiles: ReadonlyMap<number, KnownReachProfile>,
  arm: Fork['arm'],
  licence: Licence | null,
  moment: number,
): Fork | null => {
  const passerBefore = before.allPlayers.find((player) => player.gid === passerGid);
  if (!passerBefore) return null;
  const attacking = before.teams[passerBefore.side];
  const cell = valueZoneIndex(attacking.localX(candidate.pos.x), candidate.pos.y);
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
  // The price the DEPLOYED chooser charges this option, ladder and all.
  const predicted = attemptValueAt(cell, band);
  const predictedCell = attemptValueAt(cell, -1);

  const fork = cloneSimulationState(before);
  fork.forcedPassTarget = candidate.gid;
  fork.step(DT);
  fork.forcedPassTarget = null;
  const pending = fork.pendingPass;
  if (!pending || pending.targetGid !== candidate.gid || pending.passerGid !== passerGid) {
    return null; // unplayable: the absence of a pass, never an attempt at one
  }
  const kickTick = fork.simTick;
  const attackingFork = fork.teams[passerBefore.side];
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
  const cleanReception = reached && !(event !== undefined && !event.clean);
  // Every window runs, whatever happened to the ball — the axis conditions on
  // nothing, so neither does its audit.
  while (fork.simTick - kickTick < VALUE_HORIZON_TICKS && fork.phase === 'playing') {
    fork.step(DT);
  }
  return {
    moment,
    arm,
    licence,
    cell,
    band,
    predicted,
    predictedCell,
    reached,
    cleanReception,
    shot: attackingFork.stats.shots > shotsBefore,
  };
};

// --- the two walks ----------------------------------------------------------
/** Walk 1: cheap. No perception chain, no cloning — just which ticks qualify. */
const scoutMoments = (seed: number, wanted: 'legacy' | 'overlap') => {
  const match = matchOf(seed);
  const ticks: { tick: number; passerGid: number }[] = [];
  let key = '';
  while (!match.finished) {
    const kindBefore = match.lastPassKind;
    match.step(DT);
    const fresh = newPassKey(match, key, kindBefore);
    if (fresh === null) continue;
    key = fresh;
    const pending = match.pendingPass!;
    // Read on the POST-step match: the scout only proposes a tick, and the
    // replay re-derives the moment from its own pre-step clone.
    ticks.push({ tick: match.simTick, passerGid: pending.passerGid });
  }
  // A cheap pre-filter needs the licence read at the fork state, which the scout
  // does not have; so the scout keeps every pass tick and a second cheap walk
  // decides. That second walk is the same match again with the pre-step clone
  // check only — see `matchQualifies`.
  return ticks;
};

/**
 * Walk 1b: does this match contain ANY qualifying moment? Cloning is skipped —
 * the predicate reads the live pre-step state directly, which is what a clone
 * would have copied.
 */
const matchQualifies = (seed: number, wanted: 'legacy' | 'overlap'): boolean => {
  const match = matchOf(seed);
  let key = '';
  let pendingCheck: number | null = null;
  while (!match.finished) {
    const kindBefore = match.lastPassKind;
    // Snapshot the pre-step read cheaply: the licence needs the passer, who is
    // only known AFTER the step. So the state is read one tick late — for a
    // qualification filter that is sound, because a match that qualifies on the
    // exact pre-step state also qualifies here in every case the replay keeps
    // (the replay re-derives and is the authority; this only skips matches).
    match.step(DT);
    const fresh = newPassKey(match, key, kindBefore);
    if (fresh === null) continue;
    key = fresh;
    pendingCheck = match.pendingPass!.passerGid;
    if (momentAt(match, pendingCheck, wanted) !== null) return true;
  }
  return false;
};

interface HarvestResult {
  readonly forks: Fork[];
  readonly moments: number;
  readonly matches: number;
  readonly matchesReplayed: number;
  /** The flip benchmark (§3.6): best alternative price − pattern price. */
  readonly flipDeficits: number[];
}

const harvest = (input: {
  readonly seedStart: number;
  readonly matchCap: number;
  readonly momentTarget: number;
  readonly wanted: 'legacy' | 'overlap';
  readonly patternLicence: Licence;
  /** Skip the qualification pre-filter (the staging check's slow arm). */
  readonly noPreFilter?: boolean;
}): HarvestResult => {
  const forks: Fork[] = [];
  const flipDeficits: number[] = [];
  let moments = 0;
  let matches = 0;
  let matchesReplayed = 0;
  for (
    let seed = input.seedStart;
    seed < input.seedStart + input.matchCap && moments < input.momentTarget;
    seed++
  ) {
    matches += 1;
    if (!input.noPreFilter && !matchQualifies(seed, input.wanted)) continue;
    const passTicks = scoutMoments(seed, input.wanted);
    if (passTicks.length === 0) continue;
    matchesReplayed += 1;
    // Only the men who will actually hold the ball at a proposed tick need a
    // perception chain; the chains are independent per player, so advancing
    // this subset is bit-identical to advancing everyone.
    const needed = new Set(passTicks.map((entry) => entry.passerGid));
    const match = matchOf(seed);
    const memories = new Map<number, PerceptionMemory>();
    for (const player of match.allPlayers) {
      if (player.role !== 'GK' && needed.has(player.gid)) {
        memories.set(player.gid, createPerceptionMemory());
      }
    }
    let key = '';
    let index = 0;
    while (!match.finished && index < passTicks.length && moments < input.momentTarget) {
      const isForkTick = match.simTick + 1 === passTicks[index].tick;
      const before = isForkTick ? cloneSimulationState(match) : null;
      const kindBefore = match.lastPassKind;
      const truth = capturePerceptionTruth(match);
      for (const gid of memories.keys()) {
        const player = match.allPlayers.find((entry) => entry.gid === gid);
        if (player === undefined || player.sentOff) continue;
        advancePerceptionMemory(truth, gid, AWARENESS, seed, memories.get(gid)!);
      }
      match.step(DT);
      if (!isForkTick) continue;
      index += 1;
      const fresh = newPassKey(match, key, kindBefore);
      if (fresh === null || before === null) continue;
      key = fresh;
      const pending = match.pendingPass!;
      const moment = momentAt(before, pending.passerGid, input.wanted);
      if (moment === null) continue;
      moments += 1;
      const memory = memories.get(pending.passerGid);
      const snapshot = moment.passer.role === 'GK' || memory === undefined ? null
        : materialisePerceptionSnapshot(truth, pending.passerGid, AWARENESS, memory);
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed, accel: player.accel, dribbling: player.attrs.dribbling,
        }]),
      );
      const momentForks: Fork[] = [];
      for (const candidate of moment.candidates) {
        const licence = moment.licences.get(candidate.gid) ?? null;
        const arm: Fork['arm'] = licence === input.patternLicence ? 'pattern'
          : licence === null ? 'control' : 'other-licence';
        const fork = forceAndFollow(
          before, pending.passerGid, candidate, snapshot, reachProfiles, arm, licence, moments,
        );
        if (fork !== null) momentForks.push(fork);
      }
      forks.push(...momentForks);
      // §3.6: how much the pattern's man loses the argmax by, on price alone.
      const pattern = momentForks.filter((fork) => fork.arm === 'pattern');
      const others = momentForks.filter((fork) => fork.arm !== 'pattern');
      if (pattern.length > 0 && others.length > 0) {
        const best = Math.max(...others.map((fork) => fork.predicted));
        const own = Math.max(...pattern.map((fork) => fork.predicted));
        flipDeficits.push(best - own);
      }
    }
  }
  return { forks, moments, matches, matchesReplayed, flipDeficits };
};

// --- the statistic ----------------------------------------------------------
const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);

const armSummary = (forks: readonly Fork[], cellRung: boolean) => {
  const predicted = mean(forks.map((fork) => (cellRung ? fork.predictedCell : fork.predicted)));
  const realized = mean(forks.map((fork) => (fork.shot ? 1 : 0)));
  return {
    n: forks.length,
    predicted,
    realized,
    gap: realized - predicted,
    reachRate: mean(forks.map((fork) => (fork.reached ? 1 : 0))),
    cleanRate: mean(forks.map((fork) => (fork.cleanReception ? 1 : 0))),
  };
};

const premiumOf = (forks: readonly Fork[], cellRung: boolean): number => {
  const pattern = forks.filter((fork) => fork.arm === 'pattern');
  const control = forks.filter((fork) => fork.arm === 'control');
  if (pattern.length === 0 || control.length === 0) return Number.NaN;
  return armSummary(pattern, cellRung).gap - armSummary(control, cellRung).gap;
};

/**
 * The cluster bootstrap (contract §3.4). The unit is the MOMENT: candidates
 * forked at one moment share a world state, so resampling forks would treat
 * one world as several and shrink the interval by pretending.
 */
const momentBootstrapCI = (forks: readonly Fork[], cellRung: boolean) => {
  const byMoment = new Map<number, Fork[]>();
  for (const fork of forks) {
    const bucket = byMoment.get(fork.moment);
    if (bucket === undefined) byMoment.set(fork.moment, [fork]);
    else bucket.push(fork);
  }
  const clusters = [...byMoment.values()];
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    const sample: Fork[] = [];
    for (let index = 0; index < clusters.length; index++) {
      sample.push(...clusters[rng.int(0, clusters.length - 1)]);
    }
    const value = premiumOf(sample, cellRung);
    if (Number.isFinite(value)) draws.push(value);
  }
  draws.sort((left, right) => left - right);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  return {
    clusters: clusters.length,
    resamples: draws.length,
    lower: at(0.025),
    median: at(0.5),
    upper: at(0.975),
  };
};

type Verdict = 'SUPERIOR' | 'REFUTED' | 'INCONCLUSIVE';
const verdictOf = (lower: number, upper: number): Verdict => {
  if (lower > 0) return 'SUPERIOR';
  if (upper < 0) return 'REFUTED';
  return 'INCONCLUSIVE';
};

const cellMix = (forks: readonly Fork[]) => {
  const counts = new Map<number, number>();
  for (const fork of forks) counts.set(fork.cell, (counts.get(fork.cell) ?? 0) + 1);
  return [...counts.entries()].sort((left, right) => left[0] - right[0])
    .map(([cell, count]) => ({ cell, count, share: count / forks.length }));
};

const reportHarvest = (label: string, result: HarvestResult, patternLicence: Licence) => {
  const pattern = result.forks.filter((fork) => fork.arm === 'pattern');
  const control = result.forks.filter((fork) => fork.arm === 'control');
  const premium = premiumOf(result.forks, false);
  const ci = momentBootstrapCI(result.forks, false);
  const controlGap = armSummary(control, false).gap;
  const p4 = Math.abs(controlGap) <= CONTROL_GAP_BAND;
  const rawVerdict = verdictOf(ci.lower, ci.upper);
  return {
    label,
    patternLicence,
    moments: result.moments,
    matches: result.matches,
    matchesReplayed: result.matchesReplayed,
    pattern: armSummary(pattern, false),
    control: armSummary(control, false),
    otherLicence: armSummary(
      result.forks.filter((fork) => fork.arm === 'other-licence'), false,
    ),
    premium,
    ci,
    // P4: a table wrong everywhere is a third finding, not a premium.
    p4ControlSane: p4,
    rawVerdict,
    verdict: p4 ? rawVerdict : ('INCONCLUSIVE' as Verdict),
    p1Coverage: pattern.length >= PATTERN_FORK_FLOOR && control.length >= pattern.length,
    reported: {
      cellRungPremium: premiumOf(result.forks, true),
      cellRungCI: momentBootstrapCI(result.forks, true),
      flipBenchmark: {
        n: result.flipDeficits.length,
        meanDeficit: mean(result.flipDeficits),
        clearsMeanDeficit: ci.lower > mean(result.flipDeficits),
      },
      cellMix: { pattern: cellMix(pattern), control: cellMix(control) },
    },
  };
};

/**
 * The staging check, added after the freeze in the strengthening direction only
 * (disclosed in the contract's §6.2): the pre-filter must not drop a moment the
 * unfiltered walk would have kept.
 */
const stagingCheck = () => {
  const filtered = harvest({
    seedStart: B_SEED_START, matchCap: STAGING_CHECK_MATCHES, momentTarget: Infinity,
    wanted: 'overlap', patternLicence: 'overlap',
  });
  const unfiltered = harvest({
    seedStart: B_SEED_START, matchCap: STAGING_CHECK_MATCHES, momentTarget: Infinity,
    wanted: 'overlap', patternLicence: 'overlap', noPreFilter: true,
  });
  return {
    matches: STAGING_CHECK_MATCHES,
    filteredMoments: filtered.moments,
    unfilteredMoments: unfiltered.moments,
    identical: JSON.stringify(filtered.forks) === JSON.stringify(unfiltered.forks),
  };
};

const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const harness = {
    a: A_HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) })),
    b: B_HARNESS_SEEDS.map((seed) => ({ seed, reproduces: harnessReproduces(seed) })),
  };
  const staging = stagingCheck();
  const a = harvest({
    seedStart: A_SEED_START, matchCap: A_MATCH_CAP, momentTarget: A_MOMENT_BUDGET,
    wanted: 'legacy', patternLicence: 'third-man',
  });
  const b = harvest({
    seedStart: B_SEED_START, matchCap: B_MATCH_CAP, momentTarget: B_MOMENT_FLOOR,
    wanted: 'overlap', patternLicence: 'overlap',
  });
  const harvestA = reportHarvest('A (third-man, in-population)', a, 'third-man');
  const harvestB = reportHarvest('B (overlap, OFF-population)', b, 'overlap');

  const gates = {
    x5: [...harness.a, ...harness.b].every((entry) => entry.reproduces),
    stagingIdentical: staging.identical,
    p1: harvestA.p1Coverage && harvestB.p1Coverage,
    p2Overlap: harvestB.verdict === 'SUPERIOR',
    p3ThirdMan: harvestA.verdict === 'SUPERIOR',
    p4: harvestA.p4ControlSane && harvestB.p4ControlSane,
  };

  return {
    experiment: 'EDS-E5e-P0b',
    authority: 'EDS-E5E-STATE-CONDITIONAL',
    parameters: {
      aSeedStart: A_SEED_START, aMomentBudget: A_MOMENT_BUDGET, aMatchCap: A_MATCH_CAP,
      bSeedStart: B_SEED_START, bMomentFloor: B_MOMENT_FLOOR, bMatchCap: B_MATCH_CAP,
      patternForkFloor: PATTERN_FORK_FLOOR,
      controlGapBand: CONTROL_GAP_BAND,
      clusterUnit: 'moment',
      bootstrapResamples: BOOTSTRAP_RESAMPLES,
      bootstrapSeed: BOOTSTRAP_SEED,
      valueHorizonTicks: VALUE_HORIZON_TICKS,
      awareness: AWARENESS,
      marginal: ATTEMPT_VALUE_MARGINAL.shotRate,
    },
    harness,
    staging,
    harvestA,
    harvestB,
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, p5Deterministic: deterministic };
const output = {
  ...first,
  gates,
  sha256,
  // Certification (contract §4): every validity gate AND both premiums SUPERIOR.
  verdict: Object.values(gates).every(Boolean) ? 'CERTIFIED' : 'NOT CERTIFIED',
};
console.log(JSON.stringify(output, null, 2));
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
const pp = (value: number) => `${(value * 100).toFixed(2)}pp`;
console.error(
  `EDS-E5e-P0b ${output.verdict}`
  + ` · A third-man n=${output.harvestA.pattern.n}/${output.harvestA.control.n}`
  + ` premium ${pp(output.harvestA.premium)}`
  + ` CI [${pp(output.harvestA.ci.lower)}, ${pp(output.harvestA.ci.upper)}]`
  + ` → ${output.harvestA.verdict}`
  + ` (control ${pp(output.harvestA.control.gap)})`
  + ` · B overlap n=${output.harvestB.pattern.n}/${output.harvestB.control.n}`
  + ` over ${output.harvestB.matches} matches`
  + ` premium ${pp(output.harvestB.premium)}`
  + ` CI [${pp(output.harvestB.ci.lower)}, ${pp(output.harvestB.ci.upper)}]`
  + ` → ${output.harvestB.verdict}`
  + ` (control ${pp(output.harvestB.control.gap)},`
  + ` flip deficit ${pp(output.harvestB.reported.flipBenchmark.meanDeficit)})`
  + ` · failed [${failed.join(', ')}]`
  + ` · SHA ${sha256}`,
);
