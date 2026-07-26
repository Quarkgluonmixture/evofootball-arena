// EDS E5b — THE VALUE-AXIS AUDIT (the live composition).
// Authority: docs/world-model/EDS-E5-VALUE-AXIS.md §2.2, §5
// (pre-registered 2026-07-26 under commander ruling #15.3, constraints (a)-(d)).
//
// E5a measured what a pass is WORTH where it lands. This puts the product
// P-hat x V-hat inside the live chooser behind `edsValueAxis`, default OFF, and
// asks the questions ruling #15 (c) and (d) ordered:
//
//   Y4V FLAG-OFF IDENTITY: with the axis off the chooser is E3R's, per moment
//       per arm, and E2b-1R's seven banked aggregate families are bit-identical.
//       Everything the slice banked has to still be there underneath.
//   H   THE CENTRAL HYPOTHESIS: measured value REPRODUCES combination play
//       without the hand-coded bonuses — third-man and overlap releases, the
//       forward share and the shots recover toward flags-off. Three paired arms
//       so the recovery is attributable, not just present.
//   §2  the equilibrium band, verbatim, paired 8-season calibrate.
//   ND  no-strict-dominance — E0's canary, live.
//   X1/X2/X3/X5V fingerprint, suite, world determinism, perf.
//
// The watchability instruments ride along in every arm (ruling #15 (4)): 29
// gates contained none while watchability measurably dropped, and the numbers
// cost minutes.
//
// Nothing ships from here. Every flag stays default OFF; E4 round 2 is the
// user's.
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

// §2 EQUILIBRIUM BAND (contract §5, C1 §4 verbatim).
const BAND_SEED = 20260702;
const BAND_SEASONS = Number(process.argv[4] ?? 8);
/**
 * H's staging (contract §5). The same league seed, run long: E4 round 1 read
 * two seasons, and the overlap counter at 0.176 per match needs the length
 * before a ratio means anything. The §2 band is read off the first
 * BAND_SEASONS of the same arms — the league is deterministic in its seed, so
 * season 1..8 of a 24-season run IS the 8-season run.
 */
const H_SEASONS = Number(process.argv[6] ?? 24);
/** Each threshold closes 50-60% of the gap E4 round 1 measured. */
const H_THIRD_MAN_RATIO = 0.85;
const H_OVERLAP_RATIO = 0.70;
const H_FORWARD_SHARE_DROP = 0.02;
const H_SHOTS_RATIO = 0.97;
/** E4 round 1's own numbers, for the report's second column. */
const E4_ROUND1 = {
  forwardShare: [0.5856, 0.5347], passes: [101.58, 107.49], shots: [13.47, 12.66],
  passCompletion: [0.7243, 0.7025], oneTouchShare: [0.2078, 0.2028],
  thirdMan: [10.014, 6.437], overlaps: [0.176, 0.056], oneTwos: [0.578, 0.732],
  bestPassChain: [5.88, 6.62],
} as const;
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

// Co-evolution and style are NOT re-run here: ruling #15 (d) ordered a NARROW
// audit, and E3R2 banked those two on the perception bundle five seeds deep.
// If the composed chooser changes the ecology, that is the next slice's
// question, and this file must not pretend to have answered it.

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
    // Constraint (a), made explicit rather than implicit: the price is read in
    // the world AS IT IS, with the E1b curve OFF. It was always so — no E2b
    // probe ever passed `heavyTouchCost` — and the READ price does not consume
    // this formula at all; stating it here means the declaration is in the code
    // the gate runs, and C1a proves it moved no digit.
    heavyTouchCost: false,
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
  // C1b/C1c (constraint (a)): G1 and G2 must RE-HOLD on the re-banked reference
  // before the live chooser is allowed to chain to it.
  const oracle = results[results.length - 1];
  const chain = results.slice(1).map((arm, index) => ({
    from: results[index].oracle ? 'oracle' : `${results[index].awareness}`,
    to: arm.oracle ? 'oracle' : `${arm.awareness}`,
    delta: arm.realizedSuccess - results[index].realizedSuccess,
  }));
  const perceived08 = results[2];
  const rel = (value: number, reference: number): number =>
    (reference === 0 ? 0 : Math.abs(value - reference) / reference);
  return {
    arms: results,
    chain,
    g1NonInferiority: chain.every((step) => step.delta >= -G1_NON_INFERIORITY),
    g2LongShare: rel(perceived08.longShare, oracle.longShare) <= G2_LONG_SHARE_BAND,
    g2MeanDistance: rel(perceived08.meanChosenDistance, oracle.meanChosenDistance)
      <= G2_DISTANCE_BAND,
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
  // --- the watchability instruments (ruling #15 (4)) -------------------------
  forward: number;
  shots: number;
  thirdMan: number;
  overlaps: number;
  oneTwos: number;
  oneTouch: number;
  chainSum: number;
  chainTeams: number;
}
const emptyTotals = (): LeagueTotals => ({
  matches: 0, goals: 0, crosses: 0, headers: 0, longBalls: 0, cutbacks: 0,
  tackles: 0, miscontrols: 0, passes: 0, completed: 0,
  forward: 0, shots: 0, thirdMan: 0, overlaps: 0, oneTwos: 0, oneTouch: 0,
  chainSum: 0, chainTeams: 0,
});
const addTotals = (into: LeagueTotals, from: LeagueTotals): LeagueTotals => {
  for (const key of Object.keys(into) as (keyof LeagueTotals)[]) into[key] += from[key];
  return into;
};
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
  // Per match, as E4 round 1 reported them, so the two tables read side by side.
  passesPerMatch: totals.passes / totals.matches,
  forwardShare: totals.forward / Math.max(totals.passes, 1),
  shots: totals.shots / totals.matches,
  thirdMan: totals.thirdMan / totals.matches,
  overlaps: totals.overlaps / totals.matches,
  oneTwos: totals.oneTwos / totals.matches,
  oneTouchShare: totals.oneTouch / Math.max(totals.passes, 1),
  bestPassChain: totals.chainSum / Math.max(totals.chainTeams, 1),
});

interface SeasonRow {
  readonly generation: number;
  readonly goalsPerMatch: number;
  readonly matches: number;
  readonly highestPowerShare: number;
  readonly choices: number;
  /** The season's raw totals, so §2's 8-season window is a slice, not a re-run. */
  readonly totals: LeagueTotals;
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
  readonly valueAxis: boolean;
  readonly trace: boolean;
}) => {
  const league = new League({ seed: input.seed });
  if (input.bundle) {
    // The v1 live bundle after ruling #12.3: choice + defence + the evaluator.
    // `edsTouchCost` is armed nowhere in this audit. `edsValueAxis` is E5's own
    // addition and is the only difference between arms 1 and 2.
    league.matchFlags = {
      edsPerceivedDefence: true,
      edsPerceivedChoice: true,
      edsValueAxis: input.valueAxis,
      traceChoice: input.trace,
    };
  }
  const totals = emptyTotals();
  const seasons: SeasonRow[] = [];
  const trace: PassChoiceTraceEntry[] = [];
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
          accumulator.forward += stat.passesForward;
          accumulator.shots += stat.shots;
          accumulator.thirdMan += stat.thirdMan;
          accumulator.overlaps += stat.overlaps;
          accumulator.oneTwos += stat.oneTwos;
          accumulator.oneTouch += stat.oneTouch;
          accumulator.chainSum += stat.bestPassChain;
          accumulator.chainTeams += 1;
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
    league.finishSeason();
    seasons.push({
      generation: season,
      goalsPerMatch: seasonTotals.goals / seasonTotals.matches,
      matches: seasonTotals.matches,
      highestPowerShare: seasonChoices === 0 ? Number.NaN : seasonHighest / seasonChoices,
      choices: seasonChoices,
      totals: seasonTotals,
    });
    // Style/ecology is deliberately NOT measured here: ruling #15 (d) ordered a
    // narrow audit and E3R2 banked those gates five seeds deep. A statistic
    // computed but not gated invites being read as if it had been.
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
  return { totals: perMatch(totals), seasons, trace, diagnostics };
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
    edsValueAxis: true,
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
    edsValueAxis: false,
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
        edsValueAxis: bundle,
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
  /** Y4V: the live chooser with the value axis OFF is still E3R's chooser. */
  const x4 = runs('x4') ? runX4() : null;

  // The three paired arms. Same league seed, same length; the only difference
  // between arm 1 and arm 2 is `edsValueAxis`, which is what makes any recovery
  // attributable to the value half rather than to perception.
  const arms = runs('band') ? {
    flagsOff: runLeagueArm({
      seed: BAND_SEED, seasons: H_SEASONS, bundle: false, valueAxis: false, trace: false,
    }),
    v1: runLeagueArm({
      seed: BAND_SEED, seasons: H_SEASONS, bundle: true, valueAxis: false, trace: false,
    }),
    value: runLeagueArm({
      seed: BAND_SEED, seasons: H_SEASONS, bundle: true, valueAxis: true, trace: true,
    }),
  } : null;

  /** §2's window: the first BAND_SEASONS of the same deterministic league. */
  const bandWindow = (rows: readonly SeasonRow[]) => perMatch(
    rows.slice(0, BAND_SEASONS).reduce(
      (into, row) => addTotals(into, row.totals), emptyTotals()),
  );
  const band = arms === null ? null : {
    baseline: bandWindow(arms.flagsOff.seasons),
    v1: bandWindow(arms.v1.seasons),
    bundle: bandWindow(arms.value.seasons),
  };

  const bandDeltas = band === null ? null : {
    goals: relative(band.bundle.goals, BAND_BASELINE.goals),
    crosses: relative(band.bundle.crosses, BAND_BASELINE.crosses),
    headers: relative(band.bundle.headers, BAND_BASELINE.headers),
    longBalls: relative(band.bundle.longBalls, BAND_BASELINE.longBalls),
    cutbacks: relative(band.bundle.cutbacks, BAND_BASELINE.cutbacks),
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
    goals: band.baseline.goals.toFixed(4) === BAND_BASELINE.goals.toFixed(4),
    crosses: band.baseline.crosses.toFixed(4) === BAND_BASELINE.crosses.toFixed(4),
    headers: band.baseline.headers.toFixed(4) === BAND_BASELINE.headers.toFixed(4),
    longBalls: band.baseline.longBalls.toFixed(4) === BAND_BASELINE.longBalls.toFixed(4),
    cutbacks: band.baseline.cutbacks.toFixed(4) === BAND_BASELINE.cutbacks.toFixed(4),
  };

  const bandTrace = arms === null ? null : summariseTrace(arms.value.trace);
  const dominance = bandTrace === null ? null : {
    highestShare: bandTrace.powerCanary.highestShare,
    inBand: bandTrace.powerCanary.highestShare >= DOMINANCE_MIN
      && bandTrace.powerCanary.highestShare <= DOMINANCE_MAX,
  };

  // --- H: the central hypothesis, over the full H_SEASONS -------------------
  const watchability = arms === null ? null : {
    flagsOff: arms.flagsOff.totals,
    v1: arms.v1.totals,
    value: arms.value.totals,
  };
  const ratio = (value: number, reference: number) => (reference === 0 ? 0 : value / reference);
  const hypothesis = watchability === null ? null : {
    h1ThirdMan: {
      flagsOff: watchability.flagsOff.thirdMan,
      v1: watchability.v1.thirdMan,
      value: watchability.value.thirdMan,
      ratio: ratio(watchability.value.thirdMan, watchability.flagsOff.thirdMan),
      v1Ratio: ratio(watchability.v1.thirdMan, watchability.flagsOff.thirdMan),
      floor: H_THIRD_MAN_RATIO,
      holds: ratio(watchability.value.thirdMan, watchability.flagsOff.thirdMan)
        >= H_THIRD_MAN_RATIO,
    },
    h2Overlap: {
      flagsOff: watchability.flagsOff.overlaps,
      v1: watchability.v1.overlaps,
      value: watchability.value.overlaps,
      ratio: ratio(watchability.value.overlaps, watchability.flagsOff.overlaps),
      v1Ratio: ratio(watchability.v1.overlaps, watchability.flagsOff.overlaps),
      floor: H_OVERLAP_RATIO,
      holds: ratio(watchability.value.overlaps, watchability.flagsOff.overlaps)
        >= H_OVERLAP_RATIO,
    },
    h3ForwardShare: {
      flagsOff: watchability.flagsOff.forwardShare,
      v1: watchability.v1.forwardShare,
      value: watchability.value.forwardShare,
      deltaPp: (watchability.value.forwardShare - watchability.flagsOff.forwardShare) * 100,
      v1DeltaPp: (watchability.v1.forwardShare - watchability.flagsOff.forwardShare) * 100,
      floor: -H_FORWARD_SHARE_DROP * 100,
      holds: watchability.value.forwardShare
        >= watchability.flagsOff.forwardShare - H_FORWARD_SHARE_DROP,
    },
    h4Shots: {
      flagsOff: watchability.flagsOff.shots,
      v1: watchability.v1.shots,
      value: watchability.value.shots,
      ratio: ratio(watchability.value.shots, watchability.flagsOff.shots),
      v1Ratio: ratio(watchability.v1.shots, watchability.flagsOff.shots),
      floor: H_SHOTS_RATIO,
      holds: ratio(watchability.value.shots, watchability.flagsOff.shots) >= H_SHOTS_RATIO,
    },
  };

  const inert = runs('inert') ? {
    flagsOffUnchanged: flagsOffUnchanged(4242),
    traceInert: traceIsInert(4242),
    cheapBallPathIdentical: cheapBallPathIdentical(),
  } : null;

  const gates: Record<string, boolean> = {};
  if (x4) {
    gates.y4vHarnessReproduces = harness.every((entry) => entry.reproduces);
    // Y4V: with the axis off, every banked family is still exactly where E3R
    // left it, and the live consumer still chains to the reference per moment.
    for (const [key, value] of Object.entries(x4.banked)) gates[`y4vFlagOff_${key}`] = value;
    gates.y4vG1NonInferiority = x4.g1NonInferiority;
    gates.y4vG2LongShare = x4.g2LongShare;
    gates.y4vG2MeanDistance = x4.g2MeanDistance;
    gates.y4vPerMomentIdentical = x4.perMomentIdentical;
  }
  if (bandGate) for (const [key, value] of Object.entries(bandGate)) gates[`band_${key}`] = value;
  if (baselineReproduces) {
    for (const [key, value] of Object.entries(baselineReproduces)) {
      gates[`bandBaseline_${key}`] = value;
    }
  }
  if (dominance) gates.noStrictDominance = dominance.inBand;
  if (hypothesis) {
    gates.h1ThirdMan = hypothesis.h1ThirdMan.holds;
    gates.h2Overlap = hypothesis.h2Overlap.holds;
    gates.h3ForwardShare = hypothesis.h3ForwardShare.holds;
    gates.h4Shots = hypothesis.h4Shots.holds;
  }
  if (inert) for (const [key, value] of Object.entries(inert)) gates[`inert_${key}`] = value;

  return {
    experiment: 'EDS-E5b',
    authority: 'EDS-E5-VALUE-AXIS',
    section: SECTION,
    parameters: {
      abMoments: AB_MOMENTS,
      bandSeed: BAND_SEED,
      bandSeasons: BAND_SEASONS,
      hSeasons: H_SEASONS,
      bandBaseline: BAND_BASELINE,
      bandTolerance: BAND_TOLERANCE,
      hypothesis: {
        thirdMan: H_THIRD_MAN_RATIO, overlap: H_OVERLAP_RATIO,
        forwardShareDropPp: H_FORWARD_SHARE_DROP * 100, shots: H_SHOTS_RATIO,
      },
      dominance: { min: DOMINANCE_MIN, max: DOMINANCE_MAX, powers: CANARY_POWERS },
      perf: { matches: PERF_MATCHES, mean: PERF_MEAN_BUDGET, p95: PERF_P95_BUDGET },
    },
    harness,
    y4vFlagOffIdentity: x4,
    band: band === null ? null : {
      baseline: band.baseline,
      v1: band.v1,
      bundle: band.bundle,
      deltas: bandDeltas,
      baselineReproduces,
      gate: bandGate,
    },
    dominance,
    hypothesis,
    watchability,
    reported: {
      /** The E4 round-1 table, arm for arm, so the user's session can be read
       *  against this run rather than remembered. */
      e4Round1: E4_ROUND1,
      /**
       * E4 round 1 was an ad-hoc two-season read with no frozen artefact, so it
       * cannot be a gate — but arms 0 and 1 here ARE its staging, and their
       * first two seasons should therefore land on its numbers. Reported as a
       * cross-check on this instrument: if these disagree, one of the two
       * measurements is wrong and the commander's ruling rests on the older one.
       */
      e4Round1Reproduction: arms === null ? null : (() => {
        const window = (rows: readonly SeasonRow[]) => perMatch(
          rows.slice(0, 2).reduce((into, row) => addTotals(into, row.totals), emptyTotals()));
        const off = window(arms.flagsOff.seasons);
        const on = window(arms.v1.seasons);
        return {
          forwardShare: [off.forwardShare, on.forwardShare],
          passes: [off.passesPerMatch, on.passesPerMatch],
          shots: [off.shots, on.shots],
          passCompletion: [off.passCompletion, on.passCompletion],
          oneTouchShare: [off.oneTouchShare, on.oneTouchShare],
          thirdMan: [off.thirdMan, on.thirdMan],
          overlaps: [off.overlaps, on.overlaps],
          oneTwos: [off.oneTwos, on.oneTwos],
          bestPassChain: [off.bestPassChain, on.bestPassChain],
        };
      })(),
      seasons: arms === null ? null : {
        flagsOff: arms.flagsOff.seasons.map((row) => row.goalsPerMatch),
        v1: arms.v1.seasons.map((row) => row.goalsPerMatch),
        value: arms.value.seasons.map((row) => row.goalsPerMatch),
      },
      r1RouteMix: band === null ? null : {
        crosses: band.bundle.crosses,
        headers: band.bundle.headers,
        longBalls: band.bundle.longBalls,
        cutbacks: band.bundle.cutbacks,
        chosenLongShare: bandTrace?.longShare ?? null,
        meanChosenDistance: bandTrace?.meanChosenDistance ?? null,
      },
      r3LookPressure: bandTrace === null ? null : {
        readAxis: bandTrace.lookPressureReadAxis, bandAxis: bandTrace.lookPressureBandAxis,
      },
      r4DivergenceFromLegacy: bandTrace?.divergenceFromLegacy ?? null,
      r5NoExecutableShare: bandTrace?.noExecutableShare ?? null,
      liveClassShares: bandTrace?.classShares ?? null,
      powerCanaryParts: bandTrace?.powerCanary ?? null,
      /** What the live composed chooser actually paid for: the two halves of
       *  the winning price, averaged over every traced choice. */
      priceHalves: arms === null ? null : (() => {
        const priced = arms.value.trace.filter((entry) => entry.chosenGid >= 0);
        const mean = (pick: (entry: PassChoiceTraceEntry) => number) => (priced.length === 0
          ? Number.NaN : priced.reduce((sum, entry) => sum + pick(entry), 0) / priced.length);
        return {
          choices: priced.length,
          meanPrice: mean((entry) => entry.price),
          meanReception: mean((entry) => entry.reception),
          meanValue: mean((entry) => entry.value),
        };
      })(),
      diagnostics: arms === null ? null : {
        value: arms.value.diagnostics, v1: arms.v1.diagnostics, flagsOff: arms.flagsOff.diagnostics,
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
const pct = (value: number | undefined) => (value === undefined ? 'n/a' : `${(value * 100).toFixed(1)}%`);
console.error(
  `EDS-E5b ${output.verdict} · section ${SECTION}`
  + (output.y4vFlagOffIdentity ? ` · Y4V ${output.y4vFlagOffIdentity.perMomentIdentical}`
    + ` (${output.y4vFlagOffIdentity.disagreements}/${output.y4vFlagOffIdentity.comparisons})`
    + ` banked ${Object.values(output.y4vFlagOffIdentity.banked).filter(Boolean).length}/7` : '')
  + (output.band?.deltas ? ` · band ${Object.entries(output.band.deltas)
    .map(([key, value]) => `${key} ${(value * 100).toFixed(2)}%`).join(' ')}` : '')
  + (output.dominance ? ` · heavy ${pct(output.dominance.highestShare)}` : '')
  + (output.hypothesis ? ` · H thirdMan ${output.hypothesis.h1ThirdMan.ratio.toFixed(3)}x`
    + ` (v1 ${output.hypothesis.h1ThirdMan.v1Ratio.toFixed(3)}x)`
    + ` · overlap ${output.hypothesis.h2Overlap.ratio.toFixed(3)}x`
    + ` (v1 ${output.hypothesis.h2Overlap.v1Ratio.toFixed(3)}x)`
    + ` · forward ${output.hypothesis.h3ForwardShare.deltaPp.toFixed(2)}pp`
    + ` (v1 ${output.hypothesis.h3ForwardShare.v1DeltaPp.toFixed(2)}pp)`
    + ` · shots ${output.hypothesis.h4Shots.ratio.toFixed(3)}x`
    + ` (v1 ${output.hypothesis.h4Shots.v1Ratio.toFixed(3)}x)` : '')
  + (perf ? ` · perf ${perf.off.usPerStep.toFixed(2)}→${perf.on.usPerStep.toFixed(2)}µs` : '')
  + ` · failed [${failed.join(', ')}]`
  + ` · worldSHA ${worldSha256} (perf reported, never hashed)`,
);
