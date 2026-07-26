// EDS E5c (a) — THE INNER-CELL TOP-UP (the HU test's instrument).
// Authority: docs/world-model/EDS-E5C-VALUE-ATTRIBUTION.md §2.1, §4
//
// E5a's Z6 and Z7 — the attacking third's inner half, central and wide — hold
// 129 and 64 clean receptions against a 400 floor, so the live chooser reads
// them at the 7.15% marginal, BELOW the outer-third cells it did measure. That
// is one of the two candidate causes of E5b's third-man failure, and ruling
// #16.4 asks for it to be removed rather than argued about.
//
// Everything about how a number is produced is E5a's, verbatim: plain ground
// pass moments, the 6-30 m window, target-choice-only intervention, the
// 240-tick follow, the 12-tick adjudication window, clean-reception
// conditioning, and the 240-tick value horizon with its dead-ball stop. Two
// things change and both are sampling infrastructure (ruling #2.1): only Z6/Z7
// candidates are forked, and fresh seed blocks are walked until the floor is
// met.
//
// The staging is also FASTER, and U1 is what makes that honest rather than
// merely plausible. E5a cloned the world every tick to hold a pre-tick fork
// point; this walks each match twice — once to record where a pass registers,
// once to clone only there — and must return E5a's own Z6/Z7 rows exactly
// before any topped-up number is allowed to count. Perception is dropped
// entirely: the V table is keyed on TRUE positions and never consumed a
// percept.
import { createHash } from 'node:crypto';
import {
  VALUE_ZONE_MARGINAL, VALUE_ZONE_TABLE, VALUE_ZONE_TABLE_TOPPED,
  valueZoneIndex, type ValueZoneRow,
} from '../../src/ai/passPrior';
import { Match } from '../../src/sim/Match';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2.1, §4) ----------------------------------
// E5a's staging constants, verbatim.
const MATCH_DURATION = 240;
const MIN_PASS_DISTANCE = 6;
const MAX_PASS_DISTANCE = 30;
const FOLLOW_TICKS = 240;
const ADJUDICATION_WINDOW_TICKS = 12;
const VALUE_HORIZON_TICKS = 240;
// E5a's own seed blocks — U1 replays them; the top-up never reuses them.
const E5A_SEED_A = 700_000;
const E5A_SEED_B = 710_000;
const E5A_MOMENTS_PER_SET = 4500;
// E5c's fresh blocks (contract §2.1).
const TOPUP_SEED_A = 720_000;
const TOPUP_SEED_B = 730_000;
const TARGET_CELLS = [6, 7] as const;
const CELL_FLOOR = 400; // U4
const HELD_OUT_TOLERANCE = 0.05; // U5, 5.0pp
/** Sampling backstop only; the floor is the objective, this stops a runaway. */
const MAX_TOPUP_MATCHES = Number(process.argv[2] ?? 4000);

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
const matchOf = (seed: number): Match => new Match({
  seed,
  teamA: team('A', seed * 2 + 1),
  teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION,
  traceFirstTouch: true,
});

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

interface Reception {
  readonly zone: number;
  /** E5a's convention: false for an arrival that never reached adjudication. */
  readonly shot: boolean;
  readonly goal: boolean;
  readonly progression: number;
  /** Whether the first touch actually reached `attemptFirstTouch`. */
  readonly adjudicated: boolean;
  /**
   * What the window did for an UNADJUDICATED arrival, simulated anyway. E5a
   * counted these receptions but never followed them, recording no shot by
   * construction — see §7.1's disclosure. Equal to `shot` when adjudicated.
   */
  readonly shotIfFollowed: boolean;
}

/**
 * Walk ONE match and return the clean receptions of every Z6/Z7 candidate at
 * every plain-ground-pass moment, plus how many moments were seen (so the
 * caller can honour a moment budget identical to E5a's).
 *
 * Two walks: the first records the ticks at which a pass registers, spending no
 * clone; the second replays and clones only at those ticks. The world is
 * deterministic and neither walk intervenes, so the fork points are the same
 * ones E5a held — U1 measures that claim rather than trusting it.
 */
const harvestMatch = (seed: number, momentBudget: number): {
  receptions: Reception[]; moments: number;
} => {
  const scout = matchOf(seed);
  const passTicks: number[] = [];
  let key = '';
  while (!scout.finished) {
    const kindBefore = scout.lastPassKind;
    scout.step(DT);
    const fresh = newPassKey(scout, key, kindBefore);
    if (fresh === null) continue;
    key = fresh;
    passTicks.push(scout.simTick);
  }

  const receptions: Reception[] = [];
  const match = matchOf(seed);
  let index = 0;
  let moments = 0;
  while (!match.finished && index < passTicks.length && moments < momentBudget) {
    // The pre-tick state of the tick a pass registers on IS E5a's fork point.
    const isForkTick = match.simTick + 1 === passTicks[index];
    const before = isForkTick ? cloneSimulationState(match) : null;
    match.step(DT);
    if (!isForkTick) continue;
    index += 1;
    const pending = match.pendingPass;
    if (!pending || before === null) continue;
    const passerBefore = before.allPlayers.find((player) => player.gid === pending.passerGid);
    if (!passerBefore) continue;
    const attacking = before.teams[passerBefore.side];
    // E5a's candidate set, then E5c's cell filter on top of it. The moment is
    // counted whenever E5a would have counted it, so a moment budget here means
    // the same thing it meant there.
    const candidates = attacking.players.filter((player) => (
      player.gid !== passerBefore.gid && !player.sentOff && player.role !== 'GK'
      && distanceBetween(player.pos, passerBefore.pos) >= MIN_PASS_DISTANCE
      && distanceBetween(player.pos, passerBefore.pos) <= MAX_PASS_DISTANCE
    ));
    if (candidates.length === 0) continue;
    moments += 1;
    const targeted = candidates.filter((player) => (TARGET_CELLS as readonly number[]).includes(
      valueZoneIndex(attacking.localX(player.pos.x), player.pos.y),
    ));
    for (const candidate of targeted) {
      const zone = valueZoneIndex(attacking.localX(candidate.pos.x), candidate.pos.y);
      const fork = cloneSimulationState(before);
      const passer = fork.allPlayers.find((player) => player.gid === pending.passerGid);
      if (!passer) continue;
      fork.forcedPassTarget = candidate.gid;
      fork.step(DT);
      fork.forcedPassTarget = null;
      const forkPending = fork.pendingPass;
      if (!forkPending || forkPending.targetGid !== candidate.gid
        || forkPending.passerGid !== pending.passerGid) continue;
      const kickTick = fork.simTick;
      let reached = false;
      let toucherGid = -1;
      for (let tick = 0; tick < FOLLOW_TICKS; tick++) {
        fork.step(DT);
        const toucher = fork.ball.lastTouch;
        if (toucher && toucher.gid !== pending.passerGid) {
          toucherGid = toucher.gid;
          reached = toucher.gid === candidate.gid;
          break;
        }
        if (fork.phase !== 'playing') break;
      }
      if (!reached) continue;
      const touchTick = fork.simTick;
      for (let tick = 0; tick < ADJUDICATION_WINDOW_TICKS && fork.phase === 'playing'; tick++) {
        fork.step(DT);
      }
      const event = fork.firstTouchTrace.find((trace) => (
        trace.gid === toucherGid && trace.intendedTarget
        && trace.tick >= kickTick && trace.tick <= touchTick + ADJUDICATION_WINDOW_TICKS
      ));
      // E5a's `succeeded()`, VERBATIM (contract §2.1: acceptance rules
      // unchanged): a reception is an arrival that is not an ADJUDICATED spill.
      // An arrival that never reached adjudication counts as a reception — the
      // convention E2a-2 registered and E5a inherited — and E5a then recorded
      // no shot for it without simulating the window. That last part is a
      // defect, surfaced by gate U1 and disclosed in §7.1; this probe
      // reproduces the convention exactly AND measures what the unfollowed
      // windows actually did, so the size of the defect is a number rather
      // than a worry.
      const adjudicated = event !== undefined;
      if (adjudicated && !event!.clean) continue;
      const side = passer.side;
      const attackingFork = fork.teams[side];
      const shotsBefore = attackingFork.stats.shots;
      const goalsBefore = fork.score[side];
      const startX = attackingFork.localX(fork.ball.pos.x);
      while (fork.simTick - kickTick < VALUE_HORIZON_TICKS && fork.phase === 'playing') {
        fork.step(DT);
      }
      const shotIfFollowed = attackingFork.stats.shots > shotsBefore;
      receptions.push({
        zone,
        shot: adjudicated ? shotIfFollowed : false,
        goal: adjudicated ? fork.score[side] > goalsBefore : false,
        progression: adjudicated ? attackingFork.localX(fork.ball.pos.x) - startX : 0,
        adjudicated,
        shotIfFollowed,
      });
    }
  }
  return { receptions, moments };
};

const tabulate = (receptions: readonly Reception[], zone: number): ValueZoneRow => {
  const n = receptions.length;
  const mean = (pick: (row: Reception) => number) =>
    (n === 0 ? 0 : receptions.reduce((sum, row) => sum + pick(row), 0) / n);
  return {
    zone,
    receptions: n,
    shotRate: n === 0 ? 0 : receptions.filter((row) => row.shot).length / n,
    goalRate: n === 0 ? 0 : receptions.filter((row) => row.goal).length / n,
    meanProgression: mean((row) => row.progression),
  };
};

/** Walk a seed block until the moment budget is spent (U1) or the floor is met. */
const harvest = (
  seedStart: number,
  stop: (receptions: readonly Reception[], moments: number) => boolean,
): { receptions: Reception[]; moments: number; matches: number } => {
  const receptions: Reception[] = [];
  let moments = 0;
  let matches = 0;
  for (let seed = seedStart; seed < seedStart + MAX_TOPUP_MATCHES; seed++) {
    if (stop(receptions, moments)) break;
    const batch = harvestMatch(seed, Number.POSITIVE_INFINITY);
    receptions.push(...batch.receptions);
    moments += batch.moments;
    matches += 1;
  }
  return { receptions, moments, matches };
};

/** U1: E5a's own seed block, its own moment budget, its own answer. */
const replayE5aBlock = (seedStart: number) => {
  const receptions: Reception[] = [];
  let moments = 0;
  let matches = 0;
  for (let seed = seedStart; seed < seedStart + MAX_TOPUP_MATCHES; seed++) {
    if (moments >= E5A_MOMENTS_PER_SET) break;
    const batch = harvestMatch(seed, E5A_MOMENTS_PER_SET - moments);
    receptions.push(...batch.receptions);
    moments += batch.moments;
    matches += 1;
  }
  return { receptions, moments, matches };
};

const rowsEqual = (left: ValueZoneRow, right: ValueZoneRow): boolean =>
  (Object.keys(left) as (keyof ValueZoneRow)[]).every((key) => left[key] === right[key]);
const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  // --- U1: the fast staging must be E5a's staging ---------------------------
  const replayA = replayE5aBlock(E5A_SEED_A);
  const replayB = replayE5aBlock(E5A_SEED_B);
  const replayRowsA = TARGET_CELLS.map((zone) =>
    tabulate(replayA.receptions.filter((row) => row.zone === zone), zone));
  const u1 = TARGET_CELLS.every((zone, index) =>
    rowsEqual(replayRowsA[index], VALUE_ZONE_TABLE[zone]));

  // --- the top-up: fresh seeds until every target cell clears the floor -----
  const needed = (receptions: readonly Reception[], base: readonly Reception[]) =>
    TARGET_CELLS.every((zone) => (
      base.filter((row) => row.zone === zone).length
      + receptions.filter((row) => row.zone === zone).length
    ) >= CELL_FLOOR);
  const topA = harvest(TOPUP_SEED_A, (receptions) => needed(receptions, replayA.receptions));
  const topB = harvest(TOPUP_SEED_B, (receptions) => needed(receptions, replayB.receptions));

  // The topped-up cell = E5a's forks for that cell PLUS the fresh ones. Set A's
  // base comes from the U1 replay, which gate U1 proves is E5a's own sample.
  const combined = (base: readonly Reception[], extra: readonly Reception[], zone: number) =>
    tabulate([...base, ...extra].filter((row) => row.zone === zone), zone);
  const toppedA = TARGET_CELLS.map((zone) => combined(replayA.receptions, topA.receptions, zone));
  const toppedB = TARGET_CELLS.map((zone) => combined(replayB.receptions, topB.receptions, zone));

  const heldOut = TARGET_CELLS.map((zone, index) => ({
    zone,
    receptionsA: toppedA[index].receptions,
    receptionsB: toppedB[index].receptions,
    shotRateA: toppedA[index].shotRate,
    shotRateB: toppedB[index].shotRate,
    error: Math.abs(toppedA[index].shotRate - toppedB[index].shotRate),
  }));

  /** The table as it should now be committed: E5a's, two cells replaced. */
  const table = VALUE_ZONE_TABLE.map((row) => {
    const index = TARGET_CELLS.indexOf(row.zone as 6 | 7);
    return index < 0 ? row : toppedA[index];
  });

  const exact = {
    u1StagingEquivalence: u1,
    // U2: everything that is not a target cell is E5a's, bit for bit — and the
    // marginal is deliberately NOT topped up (contract §2.1).
    u2RestUntouched: VALUE_ZONE_TABLE_TOPPED.length === table.length
      && VALUE_ZONE_TABLE_TOPPED.every((row, index) => (
        (TARGET_CELLS as readonly number[]).includes(row.zone)
        || rowsEqual(row, VALUE_ZONE_TABLE[index])
      )),
    u3CommittedMatchesCensus: VALUE_ZONE_TABLE_TOPPED.length === table.length
      && VALUE_ZONE_TABLE_TOPPED.every((row, index) => rowsEqual(row, table[index])),
  };
  const coverage = {
    u4Floor: heldOut.every((row) => row.receptionsA >= CELL_FLOOR && row.receptionsB >= CELL_FLOOR),
  };
  const calibration = {
    u5HeldOut: heldOut.every((row) => row.error <= HELD_OUT_TOLERANCE),
  };

  const pass = Object.values(exact).every(Boolean)
    && Object.values(coverage).every(Boolean)
    && Object.values(calibration).every(Boolean);

  return {
    experiment: 'EDS-E5c-a',
    authority: 'EDS-E5C-VALUE-ATTRIBUTION',
    parameters: {
      e5aSeedA: E5A_SEED_A,
      e5aSeedB: E5A_SEED_B,
      e5aMomentsPerSet: E5A_MOMENTS_PER_SET,
      topupSeedA: TOPUP_SEED_A,
      topupSeedB: TOPUP_SEED_B,
      targetCells: TARGET_CELLS,
      cellFloor: CELL_FLOOR,
      heldOutTolerance: HELD_OUT_TOLERANCE,
      valueHorizonTicks: VALUE_HORIZON_TICKS,
    },
    u1: {
      banked: TARGET_CELLS.map((zone) => VALUE_ZONE_TABLE[zone]),
      replayed: replayRowsA,
      momentsA: replayA.moments,
      matchesA: replayA.matches,
      momentsB: replayB.moments,
      matchesB: replayB.matches,
      equivalent: u1,
    },
    topup: {
      matchesA: topA.matches,
      matchesB: topB.matches,
      momentsA: topA.moments,
      momentsB: topB.moments,
      freshReceptionsA: TARGET_CELLS.map((zone) => topA.receptions.filter((r) => r.zone === zone).length),
      freshReceptionsB: TARGET_CELLS.map((zone) => topB.receptions.filter((r) => r.zone === zone).length),
    },
    toppedTableA: toppedA,
    toppedTableB: toppedB,
    committedTable: table,
    heldOut,
    reported: {
      // A1: how far the correction moves the cells off the marginal the live
      // chooser has been reading for them.
      a1MoveOffMarginal: TARGET_CELLS.map((zone, index) => ({
        zone,
        marginal: VALUE_ZONE_MARGINAL.shotRate,
        e5a: VALUE_ZONE_TABLE[zone].shotRate,
        e5aReceptions: VALUE_ZONE_TABLE[zone].receptions,
        topped: toppedA[index].shotRate,
        toppedReceptions: toppedA[index].receptions,
        deltaFromMarginal: toppedA[index].shotRate - VALUE_ZONE_MARGINAL.shotRate,
      })),
      goalRates: toppedA.map((row) => ({ zone: row.zone, goalRate: row.goalRate })),
      progression: toppedA.map((row) => ({ zone: row.zone, meanProgression: row.meanProgression })),
      /**
       * THE DEFECT U1 SURFACED, sized rather than described (§7.1). E5a counted
       * an arrival that never reached adjudication as a reception — E2a-2's
       * registered convention — but never simulated its value window, so it
       * entered the denominator as a guaranteed non-shot. Here the same windows
       * ARE simulated. `e5aConvention` is what the committed table says;
       * `followedAll` is what those receptions actually did.
       */
      a4UnfollowedWindows: TARGET_CELLS.map((zone, index) => {
        const all = [...replayA.receptions, ...topA.receptions].filter((row) => row.zone === zone);
        const unadjudicated = all.filter((row) => !row.adjudicated);
        return {
          zone,
          receptions: all.length,
          unadjudicated: unadjudicated.length,
          unadjudicatedShare: all.length === 0 ? 0 : unadjudicated.length / all.length,
          e5aConvention: toppedA[index].shotRate,
          followedAll: all.length === 0 ? 0
            : all.filter((row) => row.shotIfFollowed).length / all.length,
          shotRateAmongUnfollowed: unadjudicated.length === 0 ? 0
            : unadjudicated.filter((row) => row.shotIfFollowed).length / unadjudicated.length,
        };
      }),
    },
    exact,
    coverage,
    calibration,
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
  `EDS-E5c-a ${output.verdict} · U1 ${output.exact.u1StagingEquivalence}`
  + ` · U2 ${output.exact.u2RestUntouched} · U3 ${output.exact.u3CommittedMatchesCensus}`
  + ` · U4 ${output.coverage.u4Floor} · U5 ${output.calibration.u5HeldOut}`
  + ` · Z6 ${output.toppedTableA[0].receptions}@${(output.toppedTableA[0].shotRate * 100).toFixed(2)}%`
  + ` (B ${output.toppedTableB[0].receptions}@${(output.toppedTableB[0].shotRate * 100).toFixed(2)}%)`
  + ` · Z7 ${output.toppedTableA[1].receptions}@${(output.toppedTableA[1].shotRate * 100).toFixed(2)}%`
  + ` (B ${output.toppedTableB[1].receptions}@${(output.toppedTableB[1].shotRate * 100).toFixed(2)}%)`
  + ` · marginal ${(VALUE_ZONE_MARGINAL.shotRate * 100).toFixed(2)}%`
  + ` · top-up matches ${output.topup.matchesA}/${output.topup.matchesB}`
  + ` · SHA ${sha256}`,
);
