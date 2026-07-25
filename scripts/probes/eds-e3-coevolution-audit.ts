// EDS E3 — THE CO-EVOLUTION AUDIT.
// Authority: docs/world-model/EDS-E3-COEVOLUTION-AUDIT.md (pre-registered
// 2026-07-25, approved to run as-is by commander ruling #11.2).
//
// Everything in this slice so far ran dormant. E3's first act was a BUILD — the
// live perceived chooser (`src/ai/perceivedPassChoice.ts` + the
// `Match.edsPerceivedChoice` seam in `PlayerBrain`) — and this probe is the
// audit of the world that build produces:
//
//   X4  the live consumer must reproduce E2b-1R's banked choices on E2b-1R's
//       own staging. Run FIRST, per the user's instruction: if the consumer
//       does not reproduce the probe that validated it, the probe validated
//       something else and nothing below means anything.
//   §2  the equilibrium band C1-B broke, paired 8-season calibrate.
//   ND  no-strict-dominance — E0's always-heavy canary, made live.
//   CE  co-evolution restoration + style diversity, sealed 10-season evo.
//   X1/X2/X3/X5 fingerprint, suite, world determinism, perf.
//
// Nothing ships from here. Every flag stays default OFF; E4 is the user's.
import { createHash } from 'node:crypto';
import {
  advancePerceptionMemory, capturePerceptionTruth, createPerceptionMemory,
  materialisePerceptionSnapshot, observeBall, oraclePerceptionSnapshot, perceiveSnapshot,
  type PerceptionMemory, type PerceptionSnapshot, type PerceptionTruth,
} from '../../src/ai/perceptionSnapshot';
import { evaluatePassOption } from '../../src/ai/passOptionValue';
import {
  choosePerceivedPassTarget, passChoiceCandidateGids,
  PASS_CHOICE_MAX_METRES, PASS_CHOICE_MIN_METRES,
} from '../../src/ai/perceivedPassChoice';
import type { KnownReachProfile } from '../../src/ai/reachability';
import {
  OPTION_SPACE_PRIOR_MARGINAL, optionSpacePriorAt, PASS_PRIOR_BANDS, THREAT_CALIBRATION,
} from '../../src/ai/passPrior';
import { Match, type PassChoiceTraceEntry } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, PASS_POWER_MAX, PASS_POWER_MIN } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { nameplates } from '../../src/evolution/styleSpace';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters ------------------------------------------------------
// X4 staging: E2b-1R's, verbatim (its contract §3-§5).
const CENSUS_SEED_START = 700_000;
const HARNESS_SEEDS = [700_001, 700_002, 700_003] as const;
const MATCH_DURATION = 240;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const MAX_MATCHES_PER_SET = 4000;
const AB_MOMENTS = Number(process.argv[3] ?? 3000);
const AB_LONG_METRES = 18;
const ARMS = [
  { awareness: 0.2, oracle: false },
  { awareness: 0.5, oracle: false },
  { awareness: 0.8, oracle: false },
  { awareness: 0.8, oracle: true },
] as const;
/** E2b-1R's banked aggregates, at full float precision (its §6 / B1 gate). */
const E2B1_BANKED = {
  realizedSuccess: [0.6328437917222964, 0.6460066555740432, 0.6345846645367412, 0.6789739603575593],
  longShare: [0.1330663106364041, 0.1772046589018303, 0.1805111821086262, 0.18072289156626506],
  meanChosenDistance: [12.811833983628665, 13.340329743702053, 13.409259450524523, 13.18243800204292],
  agreesWithBrain: [0.38050734312416556, 0.39642262895174707, 0.40814696485623003, 0.4741546832491255],
  lookRead: [0.17033333333333334, 0.11766666666666667, 0.09166666666666666, 0],
  lookBand: [0.071, 0.05633333333333333, 0.036, 0],
  read: [0.6195972495088409, 0.7708742632612967, 0.855967583497053, 1],
  seenUnread: [0.002333005893909627, 0.001719056974459725, 0.0018418467583497054, 0],
  unseen: [0.3780697445972495, 0.2274066797642436, 0.14219056974459726, 0],
  chosen: [2247, 2404, 2504, 2573],
} as const;

// §2 EQUILIBRIUM BAND (contract §3, C1 §4 verbatim).
const BAND_SEED = 20260702;
const BAND_SEASONS = Number(process.argv[4] ?? 8);
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;

// NO-STRICT-DOMINANCE (contract §3): the highest-power share must stay 20-80%.
const DOMINANCE_MIN = 0.20;
const DOMINANCE_MAX = 0.80;
const CANARY_POWERS = [PASS_POWER_MIN, 1, PASS_POWER_MAX] as const;

// CO-EVOLUTION RESTORATION (contract §3).
const EVO_SEED = 424242;
const EVO_SEASONS = Number(process.argv[5] ?? 10);
const EVO_EDGE_GENERATIONS = 3; // the first/last thirds an "advantage" is read over
const STYLE_FLOOR = 0.60;

// X5 perf (contract §3).
const PERF_MATCHES = 12;
const PERF_MEAN_BUDGET = 1.25;
const PERF_P95_BUDGET = 1.50;

const SECTION = process.argv[2] ?? 'all';
const runs = (name: string): boolean => SECTION === 'all' || SECTION === name;

// --- shared staging (E2b-1R's, verbatim) ------------------------------------
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

const cloneMemory = (memory: PerceptionMemory): PerceptionMemory => ({
  nextScanTick: memory.nextScanTick,
  ball: memory.ball === null ? null : { ...memory.ball, pos: { ...memory.ball.pos }, vel: { ...memory.ball.vel } },
  players: new Map([...memory.players].map(([gid, stored]) => [gid, {
    ...stored, pos: { ...stored.pos }, vel: { ...stored.vel }, bodyDir: { ...stored.bodyDir },
  }])),
});

// --- X4's REFERENCE chooser: E2b-1R's own pricing, copied verbatim ----------
// The one adaptation, and why it is faithful: E2b-1R priced a READ option as
// `reached × cleanGivenReached` from factors it re-derived from its census, and
// its X5 asserted that product equals `THREAT_CALIBRATION[q].realizedSuccess`
// to <1e-12. Re-running that 14,678-fork census here would re-measure a banked
// number, so the banked composite is used directly. Any consequence of the
// substitution would show up twice over: as a per-moment disagreement with the
// live consumer, and as a broken bit-identity against E2b-1R's banked
// aggregates, which are measured on the same 3,000 moments with real forks.
type InfoClass = 'READ' | 'SEEN-UNREAD' | 'UNSEEN';
interface ReferenceOption {
  readonly targetGid: number;
  readonly infoClass: InfoClass;
  readonly price: number;
  readonly executable: boolean;
  readonly distance: number;
}
const referenceQuintilePrice = (threatSeconds: number): number => {
  for (const row of THREAT_CALIBRATION) if (threatSeconds <= row.keyTo) return row.realizedSuccess;
  return THREAT_CALIBRATION[THREAT_CALIBRATION.length - 1].realizedSuccess;
};
const referencePrice = (
  snapshot: PerceptionSnapshot,
  passerGid: number,
  targetGid: number,
  attackDir: 1 | -1,
  reachProfiles: ReadonlyMap<number, KnownReachProfile>,
): ReferenceOption => {
  const seenTarget = snapshot.players.find((entry) => entry.gid === targetGid);
  const seenPasser = snapshot.players.find((entry) => entry.gid === passerGid);
  if (!seenTarget || !seenPasser) {
    const row = OPTION_SPACE_PRIOR_MARGINAL;
    return {
      targetGid,
      infoClass: 'UNSEEN',
      price: row.reachedRate * row.cleanGivenReached,
      executable: false,
      distance: Number.NaN,
    };
  }
  const distance = distanceBetween(seenPasser.pos, seenTarget.pos);
  const value = evaluatePassOption({
    snapshot, passerGid, targetGid, powerMultiplier: 1, attackDir, reachProfiles,
  });
  if (value === null) {
    const row = optionSpacePriorAt(distance);
    return {
      targetGid,
      infoClass: 'SEEN-UNREAD',
      price: row.reachedRate * row.cleanGivenReached,
      executable: true,
      distance,
    };
  }
  return {
    targetGid,
    infoClass: 'READ',
    price: referenceQuintilePrice(value.interceptionThreatSeconds),
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

/**
 * X4 — E2b-1R's A/B, with the LIVE consumer doing the choosing. Every other line
 * is E2b-1R's: same seeds, same moments, same per-tick memory chain, same
 * fork-and-force, same aggregates at full float precision.
 */
const runX4 = () => {
  const arms = ARMS.map(() => ({
    moments: 0, chosen: 0, wins: 0, distance: 0, long: 0, agrees: 0,
    read: 0, seenUnread: 0, unseen: 0, options: 0, lookRead: 0, lookBand: 0,
  }));
  let sampled = 0;
  let comparisons = 0;
  let disagreements = 0;
  for (
    let seed = CENSUS_SEED_START;
    seed < CENSUS_SEED_START + MAX_MATCHES_PER_SET && sampled < AB_MOMENTS;
    seed++
  ) {
    const match = matchOf(seed);
    const memories = ARMS.map(() => new Map<number, PerceptionMemory>());
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
        if (arm.oracle) return;
        for (const player of match.allPlayers) {
          if (player.role === 'GK' || player.sentOff) continue;
          advancePerceptionMemory(truth, player.gid, arm.awareness, seed, memories[index].get(player.gid)!);
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
        && distanceBetween(player.pos, passerBefore.pos) >= PASS_CHOICE_MIN_METRES
        && distanceBetween(player.pos, passerBefore.pos) <= PASS_CHOICE_MAX_METRES
      ));
      if (candidates.length === 0) continue;
      sampled += 1;
      const reachProfiles = new Map<number, KnownReachProfile>(
        before.allPlayers.filter((player) => !player.sentOff).map((player) => [player.gid, {
          topSpeed: player.topSpeed, accel: player.accel, dribbling: player.attrs.dribbling,
        }]),
      );
      const attackDir = before.teams[passerBefore.side].attackDir;
      // The live consumer's own enumeration, over the same roster: it must
      // select the same option set the probe's filter did.
      const candidateGids = passChoiceCandidateGids(
        passerBefore, before.teams[passerBefore.side].players,
      );

      ARMS.forEach((arm, index) => {
        const acc = arms[index];
        acc.moments += 1;
        const memory = memories[index].get(pending.passerGid);
        if (passerBefore.role === 'GK' || passerBefore.sentOff) return;
        if (!arm.oracle && memory === undefined) return;
        const snapshot = arm.oracle
          ? oraclePerceptionSnapshot(truth, pending.passerGid)
          : materialisePerceptionSnapshot(truth, pending.passerGid, arm.awareness, memory!);
        // THE LIVE CONSUMER.
        const live = choosePerceivedPassTarget({
          snapshot, passerGid: pending.passerGid, candidateGids, attackDir, reachProfiles,
        });
        // E2b-1R's reference chooser, beside it, on the same inputs.
        const priced = candidates.map((candidate) => referencePrice(
          snapshot, pending.passerGid, candidate.gid, attackDir, reachProfiles,
        ));
        acc.options += priced.length;
        for (const option of priced) {
          if (option.infoClass === 'READ') acc.read += 1;
          else if (option.infoClass === 'SEEN-UNREAD') acc.seenUnread += 1;
          else acc.unseen += 1;
        }
        const executable = priced.filter((option) => option.executable);
        const blind = priced.filter((option) => !option.executable);
        if (executable.length === 0) {
          comparisons += 1;
          if (live !== null) disagreements += 1;
          return;
        }
        const bestExecutable = executable.reduce(
          (best, option) => (option.price > best.price
            || (option.price === best.price && option.targetGid < best.targetGid) ? option : best),
        );
        comparisons += 1;
        if (live === null || live.targetGid !== bestExecutable.targetGid) disagreements += 1;
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
        const fork = cloneSimulationState(before);
        (fork as unknown as { edsPerceivedDefence: boolean }).edsPerceivedDefence = !arm.oracle;
        (fork as unknown as { edsAwareness: number }).edsAwareness = arm.awareness;
        if (!arm.oracle) {
          for (const [gid, stored] of memories[index]) {
            fork.perceptionMemories.set(gid, cloneMemory(stored));
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
  const results = ARMS.map((arm, index): ArmResult => {
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
  const same = (values: readonly number[], banked: readonly number[]): boolean =>
    values.length === banked.length && values.every((value, index) => value === banked[index]);
  return {
    arms: results,
    comparisons,
    disagreements,
    perMomentIdentical: comparisons > 0 && disagreements === 0,
    banked: {
      realizedSuccess: same(results.map((a) => a.realizedSuccess), E2B1_BANKED.realizedSuccess),
      longShare: same(results.map((a) => a.longShare), E2B1_BANKED.longShare),
      meanChosenDistance: same(results.map((a) => a.meanChosenDistance), E2B1_BANKED.meanChosenDistance),
      agreesWithBrain: same(results.map((a) => a.agreesWithBrain), E2B1_BANKED.agreesWithBrain),
      lookPressure: same(results.map((a) => a.lookPressureReadAxis), E2B1_BANKED.lookRead)
        && same(results.map((a) => a.lookPressureBandAxis), E2B1_BANKED.lookBand),
      classShares: same(results.map((a) => a.classShares.READ), E2B1_BANKED.read)
        && same(results.map((a) => a.classShares['SEEN-UNREAD']), E2B1_BANKED.seenUnread)
        && same(results.map((a) => a.classShares.UNSEEN), E2B1_BANKED.unseen),
      chosenCounts: same(results.map((a) => a.chosen), E2B1_BANKED.chosen),
    },
  };
};

// --- the live arms: §2 band, dominance canary, route mix --------------------
interface LeagueTotals {
  matches: number;
  goals: number;
  crosses: number;
  headers: number;
  longBalls: number;
  cutbacks: number;
  tackles: number;
  miscontrols: number;
  passes: number;
  completed: number;
}
const emptyTotals = (): LeagueTotals => ({
  matches: 0, goals: 0, crosses: 0, headers: 0, longBalls: 0, cutbacks: 0,
  tackles: 0, miscontrols: 0, passes: 0, completed: 0,
});
const perMatch = (totals: LeagueTotals) => ({
  matches: totals.matches,
  goals: totals.goals / totals.matches,
  crosses: totals.crosses / totals.matches,
  headers: totals.headers / totals.matches,
  longBalls: totals.longBalls / totals.matches,
  cutbacks: totals.cutbacks / totals.matches,
  tackles: totals.tackles / totals.matches,
  miscontrols: totals.miscontrols / totals.matches,
  passCompletion: totals.completed / Math.max(totals.passes, 1),
});

interface SeasonRow {
  readonly generation: number;
  readonly goalsPerMatch: number;
  readonly matches: number;
  readonly highestPowerShare: number;
  readonly choices: number;
}

/**
 * One league arm. `flags` is empty for the paired baseline and the whole bundle
 * for the audit arm; the trace is armed only where the canary needs it, because
 * the instrument costs three extra option valuations per pass.
 */
const runLeagueArm = (input: {
  readonly seed: number;
  readonly seasons: number;
  readonly bundle: boolean;
  readonly trace: boolean;
}) => {
  const league = new League({ seed: input.seed });
  if (input.bundle) {
    league.matchFlags = {
      edsTouchCost: true,
      edsPerceivedDefence: true,
      edsPerceivedChoice: true,
      traceChoice: input.trace,
    };
  }
  const totals = emptyTotals();
  const seasons: SeasonRow[] = [];
  const trace: PassChoiceTraceEntry[] = [];
  const styleSpread: { distinctNameplates: number; entropy: number }[] = [];
  for (let season = 0; season < input.seasons; season++) {
    const seasonTotals = emptyTotals();
    let seasonChoices = 0;
    let seasonHighest = 0;
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      const result = match.runToCompletion();
      league.applyResult(fixture, result);
      for (const accumulator of [totals, seasonTotals]) {
        accumulator.matches += 1;
        accumulator.goals += result.score[0] + result.score[1];
        for (const stat of result.stats) {
          accumulator.crosses += stat.crosses;
          accumulator.headers += stat.headersWon;
          accumulator.longBalls += stat.longBalls;
          accumulator.cutbacks += stat.cutbacks;
          accumulator.tackles += stat.tackles;
          accumulator.miscontrols += stat.miscontrols;
          accumulator.passes += stat.passes;
          accumulator.completed += stat.passesCompleted;
        }
      }
      if (input.trace && input.bundle) {
        for (const entry of match.passChoiceTrace) {
          trace.push(entry);
          if (entry.preferredPowerIndex >= 0) {
            seasonChoices += 1;
            if (entry.preferredPowerIndex === CANARY_POWERS.length - 1) seasonHighest += 1;
          }
        }
      }
    }
    const record = league.finishSeason();
    seasons.push({
      generation: record.generation - 1,
      goalsPerMatch: seasonTotals.goals / seasonTotals.matches,
      matches: seasonTotals.matches,
      highestPowerShare: seasonChoices === 0 ? Number.NaN : seasonHighest / seasonChoices,
      choices: seasonChoices,
    });
    const shares = record.styleShares;
    const plates = nameplates(league.franchises.map((franchise) => ({
      genome: franchise.coach.genome, policy: franchise.coach.policy,
    })));
    const labels = new Set(plates.map((plate) => plate.join('|')));
    const entropyOf = (row: Record<string, number>): number => {
      const counts = Object.values(row);
      const total = counts.reduce((sum, value) => sum + value, 0);
      if (total === 0) return 0;
      return -counts.filter((value) => value > 0)
        .reduce((sum, value) => sum + (value / total) * Math.log(value / total), 0);
    };
    styleSpread.push({
      distinctNameplates: labels.size,
      entropy: shares === undefined ? 0
        : (entropyOf(shares.atk) + entropyOf(shares.def) + entropyOf(shares.scheme)) / 3,
    });
  }
  return { totals: perMatch(totals), seasons, trace, styleSpread };
};

/** The canary and the live-play reports, read off the traced bundle arm. */
const summariseTrace = (trace: readonly PassChoiceTraceEntry[]) => {
  const withPower = trace.filter((entry) => entry.preferredPowerIndex >= 0);
  const highest = withPower.filter(
    (entry) => entry.preferredPowerIndex === CANARY_POWERS.length - 1).length;
  const lowest = withPower.filter((entry) => entry.preferredPowerIndex === 0).length;
  const priced = trace.filter((entry) => entry.chosenGid >= 0);
  const options = trace.reduce((sum, entry) => sum + entry.read + entry.seenUnread + entry.unseen, 0);
  return {
    choices: trace.length,
    /** The seam fired but no option was executable: the legacy chooser kept it. */
    noExecutableShare: trace.length === 0 ? 0
      : trace.filter((entry) => entry.chosenGid < 0).length / trace.length,
    divergenceFromLegacy: priced.length === 0 ? 0
      : priced.filter((entry) => entry.chosenGid !== entry.legacyGid).length / priced.length,
    classShares: {
      READ: options === 0 ? 0 : trace.reduce((sum, entry) => sum + entry.read, 0) / options,
      'SEEN-UNREAD': options === 0 ? 0 : trace.reduce((sum, entry) => sum + entry.seenUnread, 0) / options,
      UNSEEN: options === 0 ? 0 : trace.reduce((sum, entry) => sum + entry.unseen, 0) / options,
    },
    lookPressureReadAxis: trace.length === 0 ? 0
      : trace.filter((entry) => entry.blindOutpricesRead).length / trace.length,
    lookPressureBandAxis: trace.length === 0 ? 0
      : trace.filter((entry) => entry.blindOutpricesBand).length / trace.length,
    meanChosenDistance: priced.length === 0 ? 0
      : priced.reduce((sum, entry) => sum + entry.distance, 0) / priced.length,
    longShare: priced.length === 0 ? 0
      : priced.filter((entry) => entry.distance >= AB_LONG_METRES).length / priced.length,
    powerCanary: {
      n: withPower.length,
      highestShare: withPower.length === 0 ? Number.NaN : highest / withPower.length,
      lowestShare: withPower.length === 0 ? Number.NaN : lowest / withPower.length,
      /** The parts, so any other joining rule can be applied to these numbers. */
      meanThreatSeconds: CANARY_POWERS.map((_, index) => (withPower.length === 0 ? Number.NaN
        : withPower.reduce((sum, entry) => sum + entry.powerThreatSeconds[index], 0) / withPower.length)),
      meanTouchFailPrior: CANARY_POWERS.map((_, index) => (withPower.length === 0 ? Number.NaN
        : withPower.reduce((sum, entry) => sum + entry.powerTouchFailPriors[index], 0) / withPower.length)),
      meanPrice: CANARY_POWERS.map((_, index) => (withPower.length === 0 ? Number.NaN
        : withPower.reduce((sum, entry) => sum + entry.powerPrices[index], 0) / withPower.length)),
    },
  };
};

/**
 * The instrument must not move the world: same seed, trace on and off, identical
 * end state. (The trace prices three powers per pass — pure reads, but that is
 * an assertion until it is measured.)
 */
const traceIsInert = (seed: number): boolean => {
  const build = (trace: boolean): Match => new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
    edsTouchCost: true,
    edsPerceivedDefence: true,
    edsPerceivedChoice: true,
    traceChoice: trace,
  });
  const off = build(false);
  off.runToCompletion();
  const on = build(true);
  on.runToCompletion();
  return signature(off) === signature(on) && on.passChoiceTrace.length > 0;
};

/** Flags all off must be the shipped match, tick for tick. */
const flagsOffUnchanged = (seed: number): boolean => {
  const plain = matchOf(seed);
  plain.runToCompletion();
  const armedOff = new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
    traceFirstTouch: true,
    edsTouchCost: false,
    edsPerceivedDefence: false,
    edsPerceivedChoice: false,
  });
  armedOff.runToCompletion();
  return signature(plain) === signature(armedOff)
    && plain.passChoiceTrace.length === 0 && plain.perceptionMemories.size === 0;
};

// --- X5: perf, flags off vs the full bundle, interleaved ---------------------
const measurePerf = () => {
  const samples: Record<'off' | 'on', number[]> = { off: [], on: [] };
  for (let index = 0; index < PERF_MATCHES; index++) {
    for (const bundle of index % 2 === 0 ? [false, true] : [true, false]) {
      const seed = 990_000 + index;
      const match = new Match({
        seed,
        teamA: team('A', seed * 2 + 1),
        teamB: team('B', seed * 2 + 2),
        duration: MATCH_DURATION,
        edsTouchCost: bundle,
        edsPerceivedDefence: bundle,
        edsPerceivedChoice: bundle,
        edsAwareness: 0.8,
      });
      const into = samples[bundle ? 'on' : 'off'];
      while (!match.finished) {
        const before = process.hrtime.bigint();
        match.step(DT);
        into.push(Number(process.hrtime.bigint() - before) / 1000);
      }
    }
  }
  const summarise = (values: number[]) => {
    const sorted = [...values].sort((left, right) => left - right);
    return {
      usPerStep: sorted.reduce((sum, value) => sum + value, 0) / sorted.length,
      p95: sorted[Math.floor(sorted.length * 0.95)],
      steps: sorted.length,
    };
  };
  return { off: summarise(samples.off), on: summarise(samples.on) };
};

// --- X6-style honesty pin (E2b-1R's, kept) ----------------------------------
const cheapBallPathIdentical = (): boolean => {
  const observer = {
    gid: 0, side: 0 as const, pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 },
    bodyDir: { x: 1, y: 0 }, sentOff: false,
  };
  for (const awareness of [0.2, 0.5, 0.8]) {
    const full = createPerceptionMemory();
    const cheap = createPerceptionMemory();
    for (let tick = 0; tick < 60; tick++) {
      const truth: PerceptionTruth = {
        tick,
        ball: { pos: { x: 3 + tick * 0.5, y: 1 }, vel: { x: 5, y: -1 }, ownerGid: null },
        players: [observer],
      };
      const a = perceiveSnapshot(truth, 0, awareness, 1234, full).ball;
      const b = observeBall(cheap, observer, truth.ball, tick, awareness, 1234);
      if (JSON.stringify(a) !== JSON.stringify(b)) return false;
    }
  }
  return true;
};

const relative = (value: number, reference: number): number =>
  (reference === 0 ? 0 : (value - reference) / reference);

const runExperiment = () => {
  const harness = runs('x4') ? HARNESS_SEEDS.map((seed) => ({
    seed, reproduces: harnessReproduces(seed),
  })) : [];
  const x4 = runs('x4') ? runX4() : null;

  const band = runs('band') ? {
    baseline: runLeagueArm({ seed: BAND_SEED, seasons: BAND_SEASONS, bundle: false, trace: false }),
    bundle: runLeagueArm({ seed: BAND_SEED, seasons: BAND_SEASONS, bundle: true, trace: true }),
  } : null;
  const evo = runs('evo') ? {
    baseline: runLeagueArm({ seed: EVO_SEED, seasons: EVO_SEASONS, bundle: false, trace: false }),
    bundle: runLeagueArm({ seed: EVO_SEED, seasons: EVO_SEASONS, bundle: true, trace: true }),
  } : null;

  const bandDeltas = band === null ? null : {
    goals: relative(band.bundle.totals.goals, BAND_BASELINE.goals),
    crosses: relative(band.bundle.totals.crosses, BAND_BASELINE.crosses),
    headers: relative(band.bundle.totals.headers, BAND_BASELINE.headers),
    longBalls: relative(band.bundle.totals.longBalls, BAND_BASELINE.longBalls),
    cutbacks: relative(band.bundle.totals.cutbacks, BAND_BASELINE.cutbacks),
  };
  const bandGate = bandDeltas === null ? null : {
    goals: Math.abs(bandDeltas.goals) <= BAND_TOLERANCE.goals,
    crosses: Math.abs(bandDeltas.crosses) <= BAND_TOLERANCE.crosses,
    headers: Math.abs(bandDeltas.headers) <= BAND_TOLERANCE.headers,
    longBalls: Math.abs(bandDeltas.longBalls) <= BAND_TOLERANCE.longBalls,
    cutbacks: Math.abs(bandDeltas.cutbacks) <= BAND_TOLERANCE.cutbacks,
  };
  /** The paired arm must land on the numbers the band was frozen from. */
  const baselineReproduces = band === null ? null : {
    goals: band.baseline.totals.goals.toFixed(4) === BAND_BASELINE.goals.toFixed(4),
    crosses: band.baseline.totals.crosses.toFixed(4) === BAND_BASELINE.crosses.toFixed(4),
    headers: band.baseline.totals.headers.toFixed(4) === BAND_BASELINE.headers.toFixed(4),
    longBalls: band.baseline.totals.longBalls.toFixed(4) === BAND_BASELINE.longBalls.toFixed(4),
    cutbacks: band.baseline.totals.cutbacks.toFixed(4) === BAND_BASELINE.cutbacks.toFixed(4),
  };

  const bandTrace = band === null ? null : summariseTrace(band.bundle.trace);
  const evoTrace = evo === null ? null : summariseTrace(evo.bundle.trace);
  const dominance = bandTrace === null ? null : {
    highestShare: bandTrace.powerCanary.highestShare,
    inBand: bandTrace.powerCanary.highestShare >= DOMINANCE_MIN
      && bandTrace.powerCanary.highestShare <= DOMINANCE_MAX,
  };

  // Co-evolution restoration: the bundle's goal advantage over the paired
  // flags-off world, read over the first and last thirds of the evo run.
  const coEvo = evo === null ? null : (() => {
    const advantage = evo.bundle.seasons.map((row, index) =>
      row.goalsPerMatch - evo.baseline.seasons[index].goalsPerMatch);
    const mean = (values: readonly number[]) =>
      values.reduce((sum, value) => sum + value, 0) / values.length;
    const early = mean(advantage.slice(0, EVO_EDGE_GENERATIONS));
    const late = mean(advantage.slice(-EVO_EDGE_GENERATIONS));
    const finalBundle = evo.bundle.styleSpread[evo.bundle.styleSpread.length - 1];
    const finalBaseline = evo.baseline.styleSpread[evo.baseline.styleSpread.length - 1];
    const nameplateRatio = finalBaseline.distinctNameplates === 0 ? 1
      : finalBundle.distinctNameplates / finalBaseline.distinctNameplates;
    const entropyRatio = finalBaseline.entropy === 0 ? 1
      : finalBundle.entropy / finalBaseline.entropy;
    return {
      advantage,
      early,
      late,
      /** Absolute size, so a shrink is a shrink whichever way it leans. */
      shrinks: Math.abs(late) < Math.abs(early),
      styleSpread: { bundle: finalBundle, baseline: finalBaseline, nameplateRatio, entropyRatio },
      styleHeld: nameplateRatio >= STYLE_FLOOR && entropyRatio >= STYLE_FLOOR,
      alwaysHeavyByGeneration: evo.bundle.seasons.map((row) => row.highestPowerShare),
    };
  })();

  const inert = runs('inert') ? {
    flagsOffUnchanged: flagsOffUnchanged(4242),
    traceInert: traceIsInert(4242),
    cheapBallPathIdentical: cheapBallPathIdentical(),
  } : null;

  const gates: Record<string, boolean> = {};
  if (x4) {
    gates.x4HarnessReproduces = harness.every((entry) => entry.reproduces);
    gates.x4PerMomentIdentical = x4.perMomentIdentical;
    for (const [key, value] of Object.entries(x4.banked)) gates[`x4Banked_${key}`] = value;
  }
  if (bandGate) {
    for (const [key, value] of Object.entries(bandGate)) gates[`band_${key}`] = value;
  }
  if (baselineReproduces) {
    for (const [key, value] of Object.entries(baselineReproduces)) {
      gates[`bandBaseline_${key}`] = value;
    }
  }
  if (dominance) gates.noStrictDominance = dominance.inBand;
  if (coEvo) {
    gates.coEvoRestoration = coEvo.shrinks;
    gates.styleDiversity = coEvo.styleHeld;
  }
  if (inert) for (const [key, value] of Object.entries(inert)) gates[`inert_${key}`] = value;

  return {
    experiment: 'EDS-E3',
    authority: 'EDS-E3-COEVOLUTION-AUDIT',
    section: SECTION,
    parameters: {
      abMoments: AB_MOMENTS,
      bandSeed: BAND_SEED,
      bandSeasons: BAND_SEASONS,
      bandBaseline: BAND_BASELINE,
      bandTolerance: BAND_TOLERANCE,
      dominance: { min: DOMINANCE_MIN, max: DOMINANCE_MAX, powers: CANARY_POWERS },
      evo: { seed: EVO_SEED, seasons: EVO_SEASONS, edgeGenerations: EVO_EDGE_GENERATIONS, styleFloor: STYLE_FLOOR },
      perf: { matches: PERF_MATCHES, mean: PERF_MEAN_BUDGET, p95: PERF_P95_BUDGET },
    },
    harness,
    x4,
    band: band === null ? null : {
      baseline: band.baseline.totals,
      bundle: band.bundle.totals,
      deltas: bandDeltas,
      baselineReproduces,
      gate: bandGate,
      seasons: { baseline: band.baseline.seasons, bundle: band.bundle.seasons },
    },
    dominance,
    coEvo,
    reported: {
      r1RouteMix: band === null ? null : {
        crosses: band.bundle.totals.crosses,
        headers: band.bundle.totals.headers,
        longBalls: band.bundle.totals.longBalls,
        cutbacks: band.bundle.totals.cutbacks,
        s3bCollapseSignature: { headers: [6.39, 4.05], cutbacks: [3.96, 2.46] },
        chosenLongShare: bandTrace?.longShare ?? null,
        meanChosenDistance: bandTrace?.meanChosenDistance ?? null,
      },
      r2AlwaysHeavyByGeneration: coEvo?.alwaysHeavyByGeneration ?? null,
      r3LookPressure: bandTrace === null ? null : {
        readAxis: bandTrace.lookPressureReadAxis, bandAxis: bandTrace.lookPressureBandAxis,
      },
      r4DivergenceFromLegacy: bandTrace?.divergenceFromLegacy ?? null,
      r5NoExecutableShare: bandTrace?.noExecutableShare ?? null,
      liveClassShares: bandTrace?.classShares ?? null,
      powerCanaryParts: bandTrace?.powerCanary ?? null,
      evoTrace: evoTrace === null ? null : {
        choices: evoTrace.choices,
        divergenceFromLegacy: evoTrace.divergenceFromLegacy,
        noExecutableShare: evoTrace.noExecutableShare,
        highestPowerShare: evoTrace.powerCanary.highestShare,
      },
      miscontrols: band === null ? null : {
        baseline: band.baseline.totals.miscontrols, bundle: band.bundle.totals.miscontrols,
      },
      passCompletion: band === null ? null : {
        baseline: band.baseline.totals.passCompletion, bundle: band.bundle.totals.passCompletion,
      },
    },
    gates,
  };
};

/**
 * X3 (ruling #10.2): the determinism hash covers WORLD OUTCOMES only. Perf is a
 * measurement of the machine, not of the world — it is measured ONCE, outside
 * the hashed part, and reported beside it. A probe cannot both hash the wall
 * clock and promise byte-identity; that was E2b-1's own defect.
 */
const first = runExperiment();
const second = runExperiment();
const firstWorld = JSON.stringify(first);
const deterministic = firstWorld === JSON.stringify(second);
const worldSha256 = createHash('sha256').update(firstWorld).digest('hex');
const perf = runs('perf') ? measurePerf() : null;
const perfGates = perf === null ? {} : {
  perfMean: perf.on.usPerStep <= perf.off.usPerStep * PERF_MEAN_BUDGET,
  perfP95: perf.on.p95 <= perf.off.p95 * PERF_P95_BUDGET,
};
const gates = { ...first.gates, ...perfGates };
const output = {
  ...first,
  gates,
  perf,
  worldDeterministic: deterministic,
  worldSha256,
  verdict: deterministic && Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL',
};
console.log(JSON.stringify(output, null, 2));
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
console.error(
  `EDS-E3 ${output.verdict} · section ${SECTION}`
  + (output.x4 ? ` · X4 ${output.x4.perMomentIdentical} (${output.x4.disagreements}/${output.x4.comparisons})`
    + ` banked ${Object.values(output.x4.banked).filter(Boolean).length}/7` : '')
  + (output.band?.deltas ? ` · band ${Object.entries(output.band.deltas)
    .map(([key, value]) => `${key} ${(value * 100).toFixed(2)}%`).join(' ')}` : '')
  + (output.dominance ? ` · heavy ${(output.dominance.highestShare * 100).toFixed(1)}%` : '')
  + (output.coEvo ? ` · coEvo ${output.coEvo.early.toFixed(3)}→${output.coEvo.late.toFixed(3)}` : '')
  + (perf ? ` · perf ${perf.off.usPerStep.toFixed(2)}→${perf.on.usPerStep.toFixed(2)}µs` : '')
  + ` · failed [${failed.join(', ')}]`
  + ` · worldSHA ${worldSha256} (perf reported, never hashed)`,
);
