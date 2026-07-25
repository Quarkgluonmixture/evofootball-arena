// EDS E3R2 — THE NARROW RE-AUDIT: CE2R + X5R2.
// Authority: docs/world-model/EDS-E3R2-NARROW-REAUDIT.md
// (pre-registered 2026-07-26 under commander ruling #13.5).
//
// E3R passed 26 of 28 gates. Ruling #13 banked those 26, gave the two failures
// their honest forms, and forbade widening. So this probe carries exactly two
// questions:
//
//   X5R2  perception is PULL (ruling #13.3) — a body knows what its scans WOULD
//         have shown, computed at the moment it acts. P1 is the perpetual
//         field-for-field pin (tests/lazyPerception.test.ts); P2 is in-sim
//         identity, eager vs lazy, signature AND choice trace; P3 is B1
//         identity against E3R's own banked live numbers at full float
//         precision — which is also what makes the 26 banked results transfer.
//   CE2R  style diversity gated ECOLOGICALLY — the median entropy ratio over
//         five FRESH sealed-evo seeds, with H2's three mechanism discriminators
//         as co-gates.
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
  PASS_CHOICE_MAX_METRES, PASS_CHOICE_MIN_METRES, threatQuintilePrice,
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
// E2b-1R's own G1/G2 bands, verbatim — C1b/C1c re-verify them on the re-bank.
const G1_NON_INFERIORITY = 0.02;
const G2_LONG_SHARE_BAND = 0.25;
const G2_DISTANCE_BAND = 0.15;
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

/**
 * P3 — E3R's banked LIVE numbers (its §5.2, §5.3, §5.8), at full float
 * precision. The lazy path must reproduce every one of them: same seeds, same
 * bundle, same world. This is the B1 gate ruling #13.3 asked for, and it is
 * also the mechanism by which E3R's 26 banked results transfer to the pull
 * implementation — they are the SAME numbers or they are not transferred.
 */
const E3R_BANKED_LIVE = {
  goals: 2.4471830985915495,
  crosses: 2.267605633802817,
  headers: 9.065140845070422,
  longBalls: 6.704225352112676,
  cutbacks: 3.6338028169014085,
  miscontrols: 7.625,
  passCompletion: 0.702441485851803,
  divergenceFromLegacy: 0.6114409240498161,
  noExecutableShare: 0.040403727669587296,
  meanChosenDistance: 13.066449886951938,
  longShare: 0.19245660450409757,
  lookPressureReadAxis: 0.06594631412737237,
  lookPressureBandAxis: 0.037803027957521905,
  highestPowerShare: 0.21861863803919032,
  classRead: 0.9106507699950322,
  classSeenUnread: 0.0005663189269746647,
  classUnseen: 0.08878291107799305,
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
/** CE2R (ruling #13.2): five FRESH seeds, named in the contract before the run. */
const CE2R_SEEDS = [700_101, 700_202, 700_303, 700_404, 700_505] as const;
/** E3R's own two, reported beside the five so this statistic's spread is on record. */
const E3R_ENTROPY_RATIOS = { 424242: 0.5797187428294707, 515151: 1.5321 } as const;
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
    // The v1 live bundle after ruling #12.3: choice + defence + the evaluator.
    // `edsTouchCost` is armed nowhere in this audit.
    league.matchFlags = {
      edsPerceivedDefence: true,
      edsPerceivedChoice: true,
      traceChoice: input.trace,
    };
  }
  const totals = emptyTotals();
  const seasons: SeasonRow[] = [];
  const trace: PassChoiceTraceEntry[] = [];
  const styleSpread: { distinctNameplates: number; entropy: number }[] = [];
  // D1/D2 (constraint (c)): per-club route rates and the genes behind them,
  // captured season by season so a correlation reads the genome that actually
  // played. Available in BOTH arms — the flags-off arm has no choice trace, so
  // any comparable statistic has to come from match stats.
  const clubSeasons: {
    longBalls: number[]; crosses: number[]; passBias: number[]; attackingWidth: number[];
  }[] = [];
  // D3 (bundle arm only): the chooser's own club-to-club variety.
  const clubChoice = new Map<number, { distance: number; long: number; n: number }>();
  for (let season = 0; season < input.seasons; season++) {
    const seasonTotals = emptyTotals();
    let seasonChoices = 0;
    let seasonHighest = 0;
    const clubs = league.franchises.map((franchise) => ({
      longBalls: 0, crosses: 0, matches: 0,
      passBias: franchise.coach.genome.passBias,
      attackingWidth: franchise.coach.genome.attackingWidth,
    }));
    while (!league.seasonDone) {
      const fixture = league.nextFixture()!;
      const match = league.createMatch(fixture);
      const result = match.runToCompletion();
      league.applyResult(fixture, result);
      for (const [side, slot] of [[0, fixture.home], [1, fixture.away]] as const) {
        clubs[slot].matches += 1;
        clubs[slot].longBalls += result.stats[side].longBalls;
        clubs[slot].crosses += result.stats[side].crosses;
      }
      if (input.trace && input.bundle) {
        const sideOf = new Map(match.allPlayers.map((player) => [player.gid, player.side]));
        for (const entry of match.passChoiceTrace) {
          if (entry.chosenGid < 0) continue;
          const slot = sideOf.get(entry.passerGid) === 0 ? fixture.home : fixture.away;
          const into = clubChoice.get(slot) ?? { distance: 0, long: 0, n: 0 };
          into.distance += entry.distance;
          if (entry.distance >= AB_LONG_METRES) into.long += 1;
          into.n += 1;
          clubChoice.set(slot, into);
        }
      }
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
    clubSeasons.push({
      longBalls: clubs.map((club) => (club.matches === 0 ? 0 : club.longBalls / club.matches)),
      crosses: clubs.map((club) => (club.matches === 0 ? 0 : club.crosses / club.matches)),
      passBias: clubs.map((club) => club.passBias),
      attackingWidth: clubs.map((club) => club.attackingWidth),
    });
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
  // D1: how differently do clubs play? D2: does the genome still express?
  const std = (values: readonly number[]): number => {
    if (values.length === 0) return 0;
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length);
  };
  const pearson = (left: readonly number[], right: readonly number[]): number => {
    const n = Math.min(left.length, right.length);
    if (n < 3) return 0;
    const meanL = left.reduce((sum, value) => sum + value, 0) / n;
    const meanR = right.reduce((sum, value) => sum + value, 0) / n;
    let cov = 0;
    let varL = 0;
    let varR = 0;
    for (let index = 0; index < n; index++) {
      const dl = left[index] - meanL;
      const dr = right[index] - meanR;
      cov += dl * dr;
      varL += dl * dl;
      varR += dr * dr;
    }
    return varL === 0 || varR === 0 ? 0 : cov / Math.sqrt(varL * varR);
  };
  const mean = (values: readonly number[]): number =>
    (values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length);
  const clubChoiceRows = [...clubChoice.values()].filter((row) => row.n >= 20);
  const diagnostics = {
    d1LongBallSpread: mean(clubSeasons.map((row) => std(row.longBalls))),
    d1CrossSpread: mean(clubSeasons.map((row) => std(row.crosses))),
    d2LongBallVsPassBias: mean(clubSeasons.map((row) => pearson(row.longBalls, row.passBias))),
    d2LongBallVsWidth: mean(clubSeasons.map((row) => pearson(row.longBalls, row.attackingWidth))),
    d2CrossVsWidth: mean(clubSeasons.map((row) => pearson(row.crosses, row.attackingWidth))),
    d3ChosenDistanceSpread: std(clubChoiceRows.map((row) => row.distance / row.n)),
    d3ChosenLongShareSpread: std(clubChoiceRows.map((row) => row.long / row.n)),
    d3Clubs: clubChoiceRows.length,
  };
  return { totals: perMatch(totals), seasons, trace, styleSpread, diagnostics };
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
      /**
       * Two diagnostics added after the shakedown, REPORTED and never gated
       * (disclosed in §6): the corridor axis is a five-step quintile function
       * while the touch axis is smooth, so if a 15% power change rarely moves
       * the quintile, the touch term decides every comparison by construction.
       * `lowestThreatIsHighestPower` is E0's own canary shape — does more pace
       * still buy a safer corridor — measured on the same moments.
       */
      sameQuintileShare: withPower.length === 0 ? Number.NaN
        : withPower.filter((entry) => new Set(
          entry.powerThreatSeconds.map((seconds) => threatQuintilePrice(seconds)),
        ).size === 1).length / withPower.length,
      lowestThreatIsHighestPowerShare: withPower.length === 0 ? Number.NaN
        : withPower.filter((entry) => entry.powerThreatSeconds[CANARY_POWERS.length - 1]
          === Math.min(...entry.powerThreatSeconds)).length / withPower.length,
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

/**
 * P2 — in-sim equivalence: over one match seed, the EAGER reference path and the
 * LAZY pull path must produce the same world AND the same choices, entry for
 * entry. A perception that is cheaper because it is blinder would show up here
 * as a different trace long before it showed up as a different scoreline.
 */
const lazyMatchesEager = (seed: number): { signature: boolean; trace: boolean } => {
  const build = (eager: boolean): Match => new Match({
    seed,
    teamA: team('A', seed * 2 + 1),
    teamB: team('B', seed * 2 + 2),
    duration: MATCH_DURATION,
    edsPerceivedDefence: true,
    edsPerceivedChoice: true,
    traceChoice: true,
    edsEagerPerception: eager,
  });
  const eager = build(true);
  eager.runToCompletion();
  const lazy = build(false);
  lazy.runToCompletion();
  return {
    signature: signature(eager) === signature(lazy),
    trace: JSON.stringify(eager.passChoiceTrace) === JSON.stringify(lazy.passChoiceTrace),
  };
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

const median = (values: readonly number[]): number => {
  const sorted = [...values].sort((left, right) => left - right);
  if (sorted.length === 0) return Number.NaN;
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

const runExperiment = () => {
  // --- X5R2 pins ------------------------------------------------------------
  const pins = runs('pins') ? {
    p2: HARNESS_SEEDS.map((seed) => ({ seed, ...lazyMatchesEager(seed) })),
    flagsOffUnchanged: flagsOffUnchanged(4242),
    traceInert: traceIsInert(4242),
    cheapBallPathIdentical: cheapBallPathIdentical(),
  } : null;

  // --- P3: the live world must be E3R's, number for number ------------------
  const band = runs('band') ? {
    bundle: runLeagueArm({ seed: BAND_SEED, seasons: BAND_SEASONS, bundle: true, trace: true }),
  } : null;
  const bandTrace = band === null ? null : summariseTrace(band.bundle.trace);
  const p3 = band === null || bandTrace === null ? null : (() => {
    const live = {
      goals: band.bundle.totals.goals,
      crosses: band.bundle.totals.crosses,
      headers: band.bundle.totals.headers,
      longBalls: band.bundle.totals.longBalls,
      cutbacks: band.bundle.totals.cutbacks,
      miscontrols: band.bundle.totals.miscontrols,
      passCompletion: band.bundle.totals.passCompletion,
      divergenceFromLegacy: bandTrace.divergenceFromLegacy,
      noExecutableShare: bandTrace.noExecutableShare,
      meanChosenDistance: bandTrace.meanChosenDistance,
      longShare: bandTrace.longShare,
      lookPressureReadAxis: bandTrace.lookPressureReadAxis,
      lookPressureBandAxis: bandTrace.lookPressureBandAxis,
      highestPowerShare: bandTrace.powerCanary.highestShare,
      classRead: bandTrace.classShares.READ,
      classSeenUnread: bandTrace.classShares['SEEN-UNREAD'],
      classUnseen: bandTrace.classShares.UNSEEN,
    };
    const identical: Record<string, boolean> = {};
    for (const key of Object.keys(E3R_BANKED_LIVE) as (keyof typeof E3R_BANKED_LIVE)[]) {
      identical[key] = live[key] === E3R_BANKED_LIVE[key];
    }
    return { live, identical, allIdentical: Object.values(identical).every(Boolean) };
  })();
  // Reported, since P3's identity already carries them: E3R's transferred band.
  const bandDeltas = band === null ? null : {
    goals: relative(band.bundle.totals.goals, BAND_BASELINE.goals),
    crosses: relative(band.bundle.totals.crosses, BAND_BASELINE.crosses),
    headers: relative(band.bundle.totals.headers, BAND_BASELINE.headers),
    longBalls: relative(band.bundle.totals.longBalls, BAND_BASELINE.longBalls),
    cutbacks: relative(band.bundle.totals.cutbacks, BAND_BASELINE.cutbacks),
  };

  // --- CE2R: five fresh seeds, both arms, paired ---------------------------
  const ce2r = runs('evo') ? CE2R_SEEDS.map((seed) => {
    const baseline = runLeagueArm({ seed, seasons: EVO_SEASONS, bundle: false, trace: false });
    const bundle = runLeagueArm({ seed, seasons: EVO_SEASONS, bundle: true, trace: true });
    const finalBundle = bundle.styleSpread[bundle.styleSpread.length - 1];
    const finalBaseline = baseline.styleSpread[baseline.styleSpread.length - 1];
    const advantage = bundle.seasons.map((row, index) =>
      row.goalsPerMatch - baseline.seasons[index].goalsPerMatch);
    const mean = (values: readonly number[]) =>
      values.reduce((sum, value) => sum + value, 0) / values.length;
    return {
      seed,
      entropy: { bundle: finalBundle.entropy, flagsOff: finalBaseline.entropy },
      entropyRatio: finalBaseline.entropy === 0 ? 1 : finalBundle.entropy / finalBaseline.entropy,
      nameplateRatio: finalBaseline.distinctNameplates === 0 ? 1
        : finalBundle.distinctNameplates / finalBaseline.distinctNameplates,
      // CE1 transferred from E3R, reported here per seed since it is free.
      ce1: {
        early: mean(advantage.slice(0, EVO_EDGE_GENERATIONS)),
        late: mean(advantage.slice(-EVO_EDGE_GENERATIONS)),
        shrinks: Math.abs(mean(advantage.slice(-EVO_EDGE_GENERATIONS)))
          < Math.abs(mean(advantage.slice(0, EVO_EDGE_GENERATIONS))),
      },
      // The three mechanism discriminators, measured identically in both arms.
      m1LongBallSpreadDelta: bundle.diagnostics.d1LongBallSpread
        - baseline.diagnostics.d1LongBallSpread,
      m2GeneExpressionDelta: Math.abs(bundle.diagnostics.d2LongBallVsPassBias)
        - Math.abs(baseline.diagnostics.d2LongBallVsPassBias),
      m3ChooserClubSpread: bundle.diagnostics.d3ChosenDistanceSpread,
      diagnostics: { bundle: bundle.diagnostics, flagsOff: baseline.diagnostics },
    };
  }) : null;

  const ce2rVerdict = ce2r === null ? null : {
    entropyRatios: ce2r.map((row) => row.entropyRatio),
    medianEntropyRatio: median(ce2r.map((row) => row.entropyRatio)),
    medianNameplateRatio: median(ce2r.map((row) => row.nameplateRatio)),
    medianM1: median(ce2r.map((row) => row.m1LongBallSpreadDelta)),
    medianM2: median(ce2r.map((row) => row.m2GeneExpressionDelta)),
    medianM3: median(ce2r.map((row) => row.m3ChooserClubSpread)),
    ce1ShrinksCount: ce2r.filter((row) => row.ce1.shrinks).length,
    e3rReference: E3R_ENTROPY_RATIOS,
  };

  const gates: Record<string, boolean> = {};
  if (pins) {
    gates.p2SignatureIdentical = pins.p2.every((entry) => entry.signature);
    gates.p2TraceIdentical = pins.p2.every((entry) => entry.trace);
    gates.pinFlagsOffUnchanged = pins.flagsOffUnchanged;
    gates.pinTraceInert = pins.traceInert;
    gates.pinCheapBallPath = pins.cheapBallPathIdentical;
  }
  if (p3) {
    for (const [key, value] of Object.entries(p3.identical)) gates[`p3_${key}`] = value;
  }
  if (ce2rVerdict) {
    gates.ce2rMedianEntropy = ce2rVerdict.medianEntropyRatio >= STYLE_FLOOR;
    gates.ce2rNameplates = ce2rVerdict.medianNameplateRatio >= STYLE_FLOOR;
    gates.m1ClubsNotMoreAlike = ce2rVerdict.medianM1 >= 0;
    gates.m2GenomeNotWeaker = ce2rVerdict.medianM2 >= 0;
    gates.m3ChooserClubDependent = ce2rVerdict.medianM3 > 0;
  }

  return {
    experiment: 'EDS-E3R2',
    authority: 'EDS-E3R2-NARROW-REAUDIT',
    section: SECTION,
    parameters: {
      ce2rSeeds: CE2R_SEEDS,
      evoSeasons: EVO_SEASONS,
      styleFloor: STYLE_FLOOR,
      bandSeed: BAND_SEED,
      bandSeasons: BAND_SEASONS,
      perf: { matches: PERF_MATCHES, mean: PERF_MEAN_BUDGET, p95: PERF_P95_BUDGET },
      dominance: { min: DOMINANCE_MIN, max: DOMINANCE_MAX, powers: CANARY_POWERS },
    },
    pins,
    p3,
    bandDeltasTransferred: bandDeltas,
    ce2r,
    ce2rVerdict,
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
  `EDS-E3R2 ${output.verdict} · section ${SECTION}`
  + (output.pins ? ` · P2 sig ${output.pins.p2.every((entry) => entry.signature)}`
    + `/trace ${output.pins.p2.every((entry) => entry.trace)}` : '')
  + (output.p3 ? ` · P3 ${Object.values(output.p3.identical).filter(Boolean).length}`
    + `/${Object.keys(output.p3.identical).length} identical to E3R` : '')
  + (output.ce2rVerdict ? ` · CE2R median ${output.ce2rVerdict.medianEntropyRatio.toFixed(4)}`
    + ` [${output.ce2rVerdict.entropyRatios.map((value) => value.toFixed(2)).join(' ')}]`
    + ` · M1 ${output.ce2rVerdict.medianM1.toFixed(3)}`
    + ` M2 ${output.ce2rVerdict.medianM2.toFixed(3)}`
    + ` M3 ${output.ce2rVerdict.medianM3.toFixed(3)}`
    + ` · CE1 ${output.ce2rVerdict.ce1ShrinksCount}/5` : '')
  + (perf ? ` · perf ${perf.off.usPerStep.toFixed(2)}→${perf.on.usPerStep.toFixed(2)}µs`
    + ` (${(perf.on.usPerStep / perf.off.usPerStep).toFixed(4)}x)` : '')
  + ` · failed [${failed.join(', ')}]`
  + ` · worldSHA ${worldSha256} (perf reported, never hashed)`,
);
