// C5 T1 — THE WAITING CENSUS (fork-and-force hold-k vs act-now).
// Authority: docs/world-model/C5-T1-WAITING-CENSUS.md (design contract
// C5-TIME-DIMENSION.md §3 T1 / §4 Q2-Q3; commander ruling #27.5)
//
// What a second of waiting buys or costs, on the SAME outcome axis the pass
// options are already priced on. Nothing here invents a forward-looking term:
// the world pays, the census reads the exchange rate.
//
//   A0 ACT-NOW   the untouched fork — whatever the brain does (pass / carry /
//                shoot; per C5 §6.5 act-now INCLUDES the carry)
//   A1 HOLD-30   forcedHold 30 ticks (0.5 s), then free
//   A2 HOLD-60   60 ticks (1.0 s)
//   A3 HOLD-90   90 ticks (1.5 s) — T0R's own measured window
//
// The horizon starts at the DECISION MOMENT in every arm, so a hold arm spends
// k of its own 240 ticks holding. That is the price of waiting, not a handicap
// to correct; the release-origin twin is computed and REPORTED beside it.
//
// The exchange rate is REPORTED, never gated (contract §1, §8). The gates are
// instrument-quality only.
import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { AI_INTERVAL, DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §2) ----------------------------------------
const MATCH_DURATION = 240;
const BUILD_SEED_START = 850_000;
const HELDOUT_SEED_START = 860_000;
const BUILD_BUDGET = 6_000;
const HELDOUT_BUDGET = 2_500;
const PER_MATCH_CAP = 80;
const MAX_MATCHES = 4_000;
/** Ticks between sampled moments in one match — T0R's spacing, verbatim. */
const MOMENT_SPACING = 30;
/** The outcome window, from the DECISION MOMENT in every arm. */
const HORIZON = 240;
/** The hold ladder, in ticks: 0.5 / 1.0 / 1.5 s. */
const HOLD_LADDER = [30, 60, 90] as const;
/** T0R's frozen pressure bands, verbatim. */
const PRESSURE_BANDS = [0.15, 0.45] as const;
/** Code-derived: `stagnation = clamp01((staleTime − 3)/5)` is flat below 3
 *  and saturated at 8 (`PlayerBrain.ts:191`). */
const STALE_BANDS = [3, 8] as const;
/** E0's candidate window — the teammates a pass could actually reach. */
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
const BUCKET_FLOOR = 300;
const PRESSURE_ROW_FLOOR = 300;
const CLUSTER_FLOOR_BUILD = 60;
const CLUSTER_FLOOR_HELDOUT = 30;
const H1_TOLERANCE = 0.02; // 2.0pp, marginal
const H2_TOLERANCE = 0.05; // 5.0pp, per gated pressure row
const X5_BITE_FLOOR = 0.90;
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50007;
/** Whole-match instruments (§9) — the tempo census rides this stage. */
const TS_MATCHES = 75;

const VALUE_FLAGS = {
  edsPerceivedDefence: true,
  edsPerceivedChoice: true,
  edsValueAxis: true,
  c5Hold: true,
  // The one-touch fork stays OFF: it is priced by its own two branches at T2,
  // and mixing it in here would confound two forks (contract §2).
  c5TouchFork: false,
} as const;

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, value: boolean): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION,
  ...(value ? VALUE_FLAGS : {}),
});

const distance = (
  a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>,
): number => Math.hypot(a.x - b.x, a.y - b.y);

/** A digest of the whole visible world — X4's inertness and X5's bite pin. */
const stateSignature = (match: Match): string => {
  const digest = createHash('sha256');
  digest.update(`${match.simTick}|${match.phase}|${match.score[0]}:${match.score[1]}`);
  digest.update(`|${match.ball.pos.x},${match.ball.pos.y},${match.ball.z}`);
  digest.update(`|${match.ball.vel.x},${match.ball.vel.y},${match.ball.vz}`);
  digest.update(`|${match.ball.owner?.gid ?? -1}|${match.ball.lastTouch?.gid ?? -1}`);
  for (const p of match.allPlayers) {
    digest.update(`|${p.gid},${p.pos.x},${p.pos.y},${p.vel.x},${p.vel.y},${p.stamina}`);
  }
  for (const t of match.teams) {
    digest.update(`|${t.stats.shots},${t.stats.passes},${t.stats.tackles},${t.stats.goals}`);
  }
  return digest.digest('hex');
};

type Band = 0 | 1 | 2;
const pressureBandOf = (value: number): Band =>
  (value < PRESSURE_BANDS[0] ? 0 : value < PRESSURE_BANDS[1] ? 1 : 2);
const staleBandOf = (value: number): Band =>
  (value < STALE_BANDS[0] ? 0 : value < STALE_BANDS[1] ? 1 : 2);

interface ArmOutcome {
  /** THE axis: the attacking team took a shot inside the horizon. */
  readonly shot: boolean;
  /** The concession twin — waiting has two failure modes. */
  readonly conceded: boolean;
  /** Hold arms only: the holder still had it when the forced window expired. */
  readonly survivedHold: boolean | null;
  /** Hold arms only: lost during the hold, and to a tackle specifically. */
  readonly lostToTackle: boolean | null;
  /** Hold arms only, §8.3: a 240-tick window starting at the RELEASE instead. */
  readonly shotFromRelease: boolean | null;
  readonly signature: string;
}

interface Moment {
  readonly cluster: number;
  readonly pressureBand: Band;
  readonly staleBand: Band;
  readonly support: number;
  readonly arms: readonly ArmOutcome[]; // [A0, A1, A2, A3]
}

/** Run one fork forward and read the axis off it. */
const runArm = (
  before: Match, ownerGid: number, holdTicks: number,
): ArmOutcome => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  const side = owner.side;
  const attacking = fork.teams[side];
  const defending = fork.teams[1 - side];
  const shotsBefore = attacking.stats.shots;
  const concededBefore = defending.stats.shots;
  const tacklesBefore = defending.stats.tackles;
  const startTick = fork.simTick;
  if (holdTicks > 0) fork.forcedHold = { gid: ownerGid, untilTick: startTick + holdTicks };

  let shot = false;
  let horizonReached = false;
  let survivedHold: boolean | null = holdTicks > 0 ? true : null;
  let lostDuringHold = false;
  // The release-origin twin needs the window to keep running past the
  // horizon, so hold arms are simulated for holdTicks + HORIZON.
  const total = holdTicks + HORIZON;
  let shotsAtRelease = -1;
  for (let tick = 0; tick < total; tick++) {
    if (fork.finished) break;
    fork.step(DT);
    const elapsed = fork.simTick - startTick;
    if (holdTicks > 0 && elapsed === holdTicks) {
      shotsAtRelease = attacking.stats.shots;
      if (fork.ball.owner?.gid !== ownerGid) {
        survivedHold = false;
        lostDuringHold = true;
      }
    }
    if (holdTicks > 0 && elapsed <= holdTicks && fork.ball.owner?.gid !== ownerGid) {
      lostDuringHold = true;
    }
    if (elapsed === HORIZON) {
      // Read the axis AT the horizon and never again: a hold arm keeps
      // simulating for the release twin, and letting a post-horizon shot flip
      // this flag would silently give the hold arms a longer window than
      // act-now. The smoke found that in the first draft.
      shot = attacking.stats.shots > shotsBefore;
      horizonReached = true;
      if (holdTicks === 0) break;
    }
  }
  // A window the match ended inside reads at whatever it reached.
  if (!horizonReached) shot = attacking.stats.shots > shotsBefore;
  const conceded = defending.stats.shots > concededBefore;
  return {
    shot,
    conceded,
    survivedHold: holdTicks > 0 ? survivedHold && !lostDuringHold : null,
    lostToTackle: holdTicks > 0
      ? lostDuringHold && defending.stats.tackles > tacklesBefore : null,
    shotFromRelease: holdTicks > 0 && shotsAtRelease >= 0
      ? attacking.stats.shots > shotsAtRelease : null,
    signature: stateSignature(fork),
  };
};

/**
 * Walk a seed block, and at every qualifying decision moment fork the world
 * four ways off the SAME pre-step state — paired by construction.
 */
const harvest = (seedStart: number, budget: number) => {
  const moments: Moment[] = [];
  let matches = 0;
  let inertPins: { seed: number; identical: boolean }[] = [];
  for (
    let seed = seedStart;
    seed < seedStart + MAX_MATCHES && moments.length < budget;
    seed++
  ) {
    matches += 1;
    const cluster = seed - seedStart;
    const match = matchOf(seed, true);
    let sinceLast = MOMENT_SPACING;
    let inMatch = 0;
    while (!match.finished && moments.length < budget && inMatch < PER_MATCH_CAP) {
      // PRE-STEP: `decisionTimer <= 0` is what makes this tick the owner's
      // decision (`Match.ts:742`), and the argmax runs inside the step.
      const owner: Player | null = match.ball.owner;
      const qualifies = match.phase === 'playing' && owner !== null
        && owner.role !== 'GK' && !owner.sentOff
        && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
      if (qualifies) {
        const before = cloneSimulationState(match);
        const side = owner!.side;
        const opponents = match.teams[1 - side].players;
        const support = match.teams[side].players.filter((p) => (
          p.gid !== owner!.gid && p.role !== 'GK' && !p.sentOff
          && distance(p.pos, owner!.pos) >= SUPPORT_MIN_M
          && distance(p.pos, owner!.pos) <= SUPPORT_MAX_M
        )).length;
        const arms = [0, ...HOLD_LADDER].map((k) => runArm(before, owner!.gid, k));
        // X4, on the first moment of the first three clusters: an ALREADY
        // EXPIRED forcedHold must leave the world byte-identical to A0.
        if (cluster < 3 && inMatch === 0) {
          const inert = cloneSimulationState(before);
          inert.forcedHold = { gid: owner!.gid, untilTick: inert.simTick };
          for (let tick = 0; tick < HORIZON && !inert.finished; tick++) inert.step(DT);
          inertPins.push({ seed, identical: stateSignature(inert) === arms[0].signature });
        }
        moments.push({
          cluster,
          pressureBand: pressureBandOf(pressureAt(owner!.pos, opponents)),
          staleBand: staleBandOf(match.teams[side].staleTime),
          support,
          arms,
        });
        sinceLast = 0;
        inMatch += 1;
      }
      match.step(DT);
      sinceLast += 1;
    }
  }
  return { moments, matches, inertPins };
};

// --- statistics (cluster unit = the match seed, ruling #20) -----------------
const clusterBootstrap = (
  rows: readonly { readonly cluster: number; readonly value: number }[], offset: number,
) => {
  const byCluster = new Map<number, number[]>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster);
    if (bucket === undefined) byCluster.set(row.cluster, [row.value]); else bucket.push(row.value);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let sum = 0;
    let n = 0;
    for (let index = 0; index < clusters.length; index++) {
      for (const value of clusters[rng.int(0, clusters.length - 1)]) { sum += value; n += 1; }
    }
    if (n > 0) draws.push(sum / n);
  }
  draws.sort((left, right) => left - right);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  const point = rows.length === 0 ? Number.NaN
    : rows.reduce((sum, row) => sum + row.value, 0) / rows.length;
  return { point, lower: at(0.025), upper: at(0.975), clusters: clusters.length };
};

const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);
const round = (value: number, dp = 6): number =>
  (Number.isFinite(value) ? Number(value.toFixed(dp)) : Number.NaN);
const canonical = (value: unknown): string => JSON.stringify(value);

/** Support-count terciles, computed on the BUILD block and applied to both. */
const supportCuts = (values: readonly number[]) => {
  const sorted = [...values].sort((left, right) => left - right);
  const third = Math.floor(sorted.length / 3);
  return { low: sorted[third] ?? 0, high: sorted[sorted.length - third] ?? 0 };
};
const supportBandOf = (
  value: number, cuts: { low: number; high: number },
): Band => (value < cuts.low ? 0 : value >= cuts.high ? 2 : 1);

const ARM_NAMES = ['actNow', 'hold30', 'hold60', 'hold90'] as const;

/** The census table: shot rate per arm per cell, with the frozen ladder. */
const buildTable = (moments: readonly Moment[], cuts: { low: number; high: number }) => {
  const key = (m: Moment) => `${m.pressureBand}|${m.staleBand}|${supportBandOf(m.support, cuts)}`;
  const cells = new Map<string, Moment[]>();
  for (const m of moments) {
    const bucket = cells.get(key(m));
    if (bucket === undefined) cells.set(key(m), [m]); else bucket.push(m);
  }
  const rateOf = (rows: readonly Moment[], arm: number) => (rows.length === 0 ? Number.NaN
    : rows.filter((m) => m.arms[arm].shot).length / rows.length);
  const rowsFor = (predicate: (m: Moment) => boolean) => moments.filter(predicate);

  const cellRows = [...cells.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).map(([k, rows]) => {
    const [p, s, sup] = k.split('|').map(Number);
    // Frozen ladder: (p × s × sup) → (p × s) → p → marginal.
    const ladder = rows.length >= BUCKET_FLOOR ? 'cell'
      : rowsFor((m) => m.pressureBand === p && m.staleBand === s).length >= BUCKET_FLOOR
        ? 'pressureStale'
        : rowsFor((m) => m.pressureBand === p).length >= BUCKET_FLOOR ? 'pressure' : 'marginal';
    return {
      pressureBand: p, staleBand: s, supportBand: sup, n: rows.length, ladder,
      rates: Object.fromEntries(ARM_NAMES.map((name, arm) => [name, round(rateOf(rows, arm))])),
    };
  });

  const pressureRows = ([0, 1, 2] as Band[]).map((p) => {
    const rows = rowsFor((m) => m.pressureBand === p);
    return {
      pressureBand: p, n: rows.length,
      rates: Object.fromEntries(ARM_NAMES.map((name, arm) => [name, round(rateOf(rows, arm))])),
    };
  });

  return {
    cells: cellRows,
    pressureRows,
    marginal: {
      n: moments.length,
      rates: Object.fromEntries(
        ARM_NAMES.map((name, arm) => [name, round(rateOf(moments, arm))]),
      ) as Record<typeof ARM_NAMES[number], number>,
    },
  };
};

const describeBlock = (
  moments: readonly Moment[], matches: number, cuts: { low: number; high: number },
) => {
  const table = buildTable(moments, cuts);
  const clusters = new Set(moments.map((m) => m.cluster)).size;
  return { matches, clusters, moments: moments.length, table };
};

const runExperiment = () => {
  const build = harvest(BUILD_SEED_START, BUILD_BUDGET);
  const heldout = harvest(HELDOUT_SEED_START, HELDOUT_BUDGET);
  const cuts = supportCuts(build.moments.map((m) => m.support));

  const buildBlock = describeBlock(build.moments, build.matches, cuts);
  const heldoutBlock = describeBlock(heldout.moments, heldout.matches, cuts);

  // --- §8: the exchange rate, PAIRED per moment, reported never gated -------
  const exchange = HOLD_LADDER.map((k, index) => {
    const arm = index + 1;
    const paired = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster,
      value: (m.arms[arm].shot ? 1 : 0) - (m.arms[0].shot ? 1 : 0),
    })), index);
    const unpairedHold = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster, value: m.arms[arm].shot ? 1 : 0,
    })), 10 + index);
    const unpairedNow = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster, value: m.arms[0].shot ? 1 : 0,
    })), 20 + index);
    const concession = clusterBootstrap(build.moments.map((m) => ({
      cluster: m.cluster,
      value: (m.arms[arm].conceded ? 1 : 0) - (m.arms[0].conceded ? 1 : 0),
    })), 30 + index);
    const byPressure = ([0, 1, 2] as Band[]).map((p) => {
      const rows = build.moments.filter((m) => m.pressureBand === p);
      return {
        pressureBand: p, n: rows.length,
        delta: round(mean(rows.map((m) => (m.arms[arm].shot ? 1 : 0) - (m.arms[0].shot ? 1 : 0)))),
      };
    });
    // §8.3 the release-origin twin — only defined where the hold reached its
    // own release, and never substituted for the primary.
    const released = build.moments.filter((m) => m.arms[arm].shotFromRelease !== null);
    const releaseTwin = clusterBootstrap(released.map((m) => ({
      cluster: m.cluster,
      value: (m.arms[arm].shotFromRelease ? 1 : 0) - (m.arms[0].shot ? 1 : 0),
    })), 40 + index);
    return {
      holdTicks: k,
      paired: {
        point: round(paired.point), lower: round(paired.lower), upper: round(paired.upper),
      },
      unpaired: {
        hold: round(unpairedHold.point), actNow: round(unpairedNow.point),
        delta: round(unpairedHold.point - unpairedNow.point),
        holdCi: [round(unpairedHold.lower), round(unpairedHold.upper)],
      },
      concessionTwin: {
        point: round(concession.point),
        lower: round(concession.lower),
        upper: round(concession.upper),
      },
      byPressure,
      releaseTwin: {
        n: released.length,
        point: round(releaseTwin.point),
        lower: round(releaseTwin.lower),
        upper: round(releaseTwin.upper),
      },
      holdAnatomy: {
        survived: round(mean(build.moments.map((m) => (m.arms[arm].survivedHold ? 1 : 0)))),
        lostToTackle: round(mean(build.moments.map((m) => (m.arms[arm].lostToTackle ? 1 : 0)))),
      },
    };
  });

  // --- gates ----------------------------------------------------------------
  const x4 = build.inertPins.length > 0 && build.inertPins.every((pin) => pin.identical);
  const bite = mean(build.moments.map((m) => (m.arms[3].signature !== m.arms[0].signature ? 1 : 0)));
  const x5 = bite >= X5_BITE_FLOOR;

  const rowFloorOk = (block: ReturnType<typeof describeBlock>) =>
    block.table.pressureRows.every((row) => row.n >= PRESSURE_ROW_FLOOR);

  const h1 = ARM_NAMES.map((name) => ({
    arm: name,
    delta: round(Math.abs(
      buildBlock.table.marginal.rates[name] - heldoutBlock.table.marginal.rates[name],
    )),
  }));
  const h2 = ([0, 1, 2] as Band[]).flatMap((p) => {
    const b = buildBlock.table.pressureRows[p];
    const h = heldoutBlock.table.pressureRows[p];
    if (b.n < PRESSURE_ROW_FLOOR || h.n < PRESSURE_ROW_FLOOR) return [];
    return ARM_NAMES.map((name) => ({
      pressureBand: p, arm: name, delta: round(Math.abs(b.rates[name] - h.rates[name])),
    }));
  });

  const gates = {
    x4SeamInert: x4,
    x5SeamBites: x5,
    c1Build: buildBlock.moments >= BUILD_BUDGET && buildBlock.clusters >= CLUSTER_FLOOR_BUILD,
    c2Heldout: heldoutBlock.moments >= HELDOUT_BUDGET
      && heldoutBlock.clusters >= CLUSTER_FLOOR_HELDOUT,
    c3RowFloors: rowFloorOk(buildBlock) && rowFloorOk(heldoutBlock),
    h1Marginal: h1.every((row) => row.delta <= H1_TOLERANCE),
    h2PressureRows: h2.length > 0 && h2.every((row) => row.delta <= H2_TOLERANCE),
  };

  return {
    experiment: 'C5-T1',
    authority: 'C5-T1-WAITING-CENSUS',
    parameters: {
      buildSeedStart: BUILD_SEED_START, heldoutSeedStart: HELDOUT_SEED_START,
      buildBudget: BUILD_BUDGET, heldoutBudget: HELDOUT_BUDGET,
      perMatchCap: PER_MATCH_CAP, momentSpacing: MOMENT_SPACING,
      horizon: HORIZON, holdLadder: HOLD_LADDER,
      pressureBands: PRESSURE_BANDS, staleBands: STALE_BANDS,
      supportWindowM: [SUPPORT_MIN_M, SUPPORT_MAX_M], supportCuts: cuts,
      aiIntervalTicks: round(AI_INTERVAL / DT, 4),
      clusterUnit: 'match seed', arm: 'VALUE (perceived pair + value axis) + c5Hold',
    },
    build: buildBlock,
    heldout: heldoutBlock,
    exchange,
    reported: {
      seamBiteShare: round(bite),
      inertPins: build.inertPins,
      h1, h2,
    },
    gates,
  };
};

// --- §9 time-signature instruments (whole matches, unforked, both worlds) ---
const timeSignature = (value: boolean) => {
  const spells: { ticks: number; released: boolean }[] = [];
  let passes = 0;
  let oneTouch = 0;
  let possessionTime = 0;
  for (let seed = BUILD_SEED_START; seed < BUILD_SEED_START + TS_MATCHES; seed++) {
    const match = matchOf(seed, value);
    let ownerGid = -1;
    let ticks = 0;
    const close = (): void => {
      if (ownerGid !== -1 && ticks > 0) {
        spells.push({ ticks, released: match.ball.owner === null
          && match.ball.lastTouch?.gid === ownerGid });
      }
      ticks = 0;
    };
    while (!match.finished) {
      match.step(DT);
      const current = match.phase === 'playing' ? (match.ball.owner?.gid ?? -1) : -1;
      if (current !== ownerGid) { close(); ownerGid = current; }
      if (current !== -1) ticks += 1;
    }
    close();
    for (const t of match.teams) {
      passes += t.stats.passes;
      oneTouch += t.stats.oneTouch;
      possessionTime += t.stats.possessionTime;
    }
  }
  const secs = spells.map((s) => s.ticks * DT);
  const sorted = [...secs].sort((left, right) => left - right);
  const q = (p: number) => (sorted.length === 0 ? Number.NaN
    : sorted[Math.min(sorted.length - 1, Math.floor(p * (sorted.length - 1)))]);
  const released = spells.filter((s) => s.released).map((s) => s.ticks * DT);
  const lost = spells.filter((s) => !s.released).map((s) => s.ticks * DT);
  return {
    world: value ? 'VALUE' : 'legacy (flags-off)',
    matches: TS_MATCHES,
    ts1PassesPerMinute: round(passes / (possessionTime / 60), 4),
    ts2OneTouchShare: round(oneTouch / passes),
    ts3SpellSeconds: {
      n: spells.length, mean: round(mean(secs), 4), median: round(q(0.5), 4), p90: round(q(0.9), 4),
    },
    ts4TimeToRelease: {
      releasedN: released.length, releasedMean: round(mean(released), 4),
      lostN: lost.length, lostMean: round(mean(lost), 4),
    },
    ts5DecisionsPerSpell: round(mean(secs.map((s) => s / AI_INTERVAL)), 4),
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');

const tempo = [timeSignature(false), timeSignature(true)];
const gates = { ...first.gates, dDeterministic: deterministic };
const output = {
  ...first, tempo, gates, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL',
};
console.log(JSON.stringify(output, null, 2));

// The deliverable (contract §10): the table as DATA, SHA'd. Baking it into a
// `src/ai/` module is T2's job under T2's own contract, pinned to this SHA.
const tablePayload = {
  authority: 'C5-T1-WAITING-CENSUS',
  parameters: first.parameters,
  build: first.build.table,
  heldout: first.heldout.table,
};
const tableJson = JSON.stringify(tablePayload);
const tableSha = createHash('sha256').update(tableJson).digest('hex');
writeFileSync('docs/world-model/data/c5-t1-waiting-census.json',
  `${JSON.stringify({ ...tablePayload, tableSha }, null, 2)}\n`);

const pp = (value: number) => `${(value * 100).toFixed(2)}pp`;
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
console.error(
  `C5-T1 ${output.verdict} · build ${output.build.moments} moments / ${output.build.clusters}`
  + ` clusters · heldout ${output.heldout.moments} / ${output.heldout.clusters}`
  + ` · marginal actNow ${pct(output.build.table.marginal.rates.actNow)}`
  + ` hold30 ${pct(output.build.table.marginal.rates.hold30)}`
  + ` hold60 ${pct(output.build.table.marginal.rates.hold60)}`
  + ` hold90 ${pct(output.build.table.marginal.rates.hold90)}`
  + ` · EXCHANGE ${output.exchange.map((e) => (
    `k=${e.holdTicks} ${pp(e.paired.point)} CI[${pp(e.paired.lower)}, ${pp(e.paired.upper)}]`
  )).join(' · ')}`
  + ` · concession ${output.exchange.map((e) => pp(e.concessionTwin.point)).join('/')}`
  + ` · release-twin ${output.exchange.map((e) => pp(e.releaseTwin.point)).join('/')}`
  + ` · bite ${pct(output.reported.seamBiteShare)}`
  + ` · H1 ${output.reported.h1.map((r) => `${r.arm} ${pp(r.delta)}`).join(' ')}`
  + ` · tempo legacy ${output.tempo[0].ts1PassesPerMinute}/min vs VALUE`
  + ` ${output.tempo[1].ts1PassesPerMinute}/min · spell median`
  + ` ${output.tempo[0].ts3SpellSeconds.median}s vs ${output.tempo[1].ts3SpellSeconds.median}s`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256} · table ${tableSha}`,
);
