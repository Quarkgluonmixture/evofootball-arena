// C5 T0 — HOLD ANATOMY: is the shield a body position, and is it NOT FREE?
// Authority: docs/world-model/C5-T0-HOLD-MECHANICS.md §3.2
//
// T0 builds a capability and must prove two things about it. The X-series
// pins (tests/c5HoldMechanics.test.ts) prove the world without it is
// unchanged. This probe proves the thing built is real and, above all, is not
// a FREE OPTION — E5h's x1.3 lesson and C1-A2's, in a new costume.
//
// The Phase-0 map found that the attack surface already exists: the tackle
// search measures dist(o.pos, ball.pos), not the man, so a ball on the far
// side of a body is already harder to reach. So the risk here runs the other
// way from what "add a hold" suggests — the shield could make holding SAFER
// than carrying. A2b is the ceiling that catches it.
import { createHash } from 'node:crypto';
import { pressureAt } from '../../src/ai/perception';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT } from '../../src/sim/constants';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §3.2) --------------------------------------
const MATCH_DURATION = 240;
const SEED_START = 830_000;
const MAX_MATCHES = Number(process.argv[3] ?? 4000);
/** A3's budget: 10,000 forced holds ⇒ ≈3,300 per strength tercile. */
const HOLD_BUDGET = Number(process.argv[2] ?? 10_000);
/** Survival is read at 1.5 s — 90 ticks at DT = 1/60. */
const HOLD_TICKS = 90;
/** Pre-registered pressure bands (the census's own `pressureAt` scale). */
const PRESSURE_BANDS = [0.15, 0.45] as const; // low < 0.15 ≤ mid < 0.45 ≤ high
const A1_FAR_SIDE_FLOOR = 0.90;
const A2B_SURVIVAL_CEILING = 0.90;
const A3_GRADIENT_FLOOR = 0.03; // 3.0pp, top − bottom strength tercile
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50005; // frozen

const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, index) => `P${index}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
const matchOf = (seed: number, hold: boolean): Match => new Match({
  seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
  duration: MATCH_DURATION, c5Hold: hold,
});
const distance = (
  a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>,
): number => Math.hypot(a.x - b.x, a.y - b.y);

const nearestOpponent = (match: Match, p: Player): Player | null => {
  let near: Player | null = null;
  let best = Infinity;
  for (const o of match.teams[1 - p.side].players) {
    if (o.sentOff) continue;
    const d = distance(o.pos, p.pos);
    if (d < best) { best = d; near = o; }
  }
  return near;
};

type Band = 0 | 1 | 2;
const bandOf = (pressure: number): Band =>
  (pressure < PRESSURE_BANDS[0] ? 0 : pressure < PRESSURE_BANDS[1] ? 1 : 2);

interface Trial {
  readonly cluster: number;
  readonly band: Band;
  readonly strength: number;
  /** Held ticks in which the ball was farther from the threat than the body. */
  readonly farSideTicks: number;
  readonly heldTicks: number;
  readonly survived: boolean;
  readonly staminaSpent: number;
  readonly lostToTackle: boolean;
}

/**
 * One trial: fork the world at a ball-owner tick and run it twice — once with
 * the hold FORCED, once left alone (the carry baseline). Both forks see the
 * same world, so the comparison is paired by construction.
 */
const trialAt = (
  before: Match, ownerGid: number, cluster: number,
): { hold: Trial; carrySurvived: boolean; carryStamina: number } | null => {
  const ownerBefore = before.allPlayers.find((p) => p.gid === ownerGid);
  if (!ownerBefore || ownerBefore.role === 'GK') return null;
  const threat = nearestOpponent(before, ownerBefore);
  if (threat === null) return null;
  const band = bandOf(pressureAt(ownerBefore.pos, before.teams[1 - ownerBefore.side].players));
  const strength = ownerBefore.attrs.strength;

  const hold = cloneSimulationState(before);
  // The window must cover the WHOLE measured 1.5 s. Set to exactly HOLD_TICKS
  // the guard releases him on the final step, `decideCarrier` runs, and a free
  // man passes immediately — which the survival check then read as a LOSS.
  // That is what inverted the pressure curve on the first two runs: an
  // unpressured holder releases the instant he is allowed to, a pressed one
  // does not. Corrected toward the contract's own words ("survival after 1.5 s
  // of forced hold" — so the hold is in force for all of it), never toward a
  // number.
  hold.forcedHold = { gid: ownerGid, untilTick: hold.simTick + HOLD_TICKS + 2 };
  const holdStart = hold.allPlayers.find((p) => p.gid === ownerGid)!.stamina;
  let farSideTicks = 0;
  let heldTicks = 0;
  let lostToTackle = false;
  const tacklesBefore = hold.teams[1 - ownerBefore.side].stats.tackles;
  for (let tick = 0; tick < HOLD_TICKS; tick++) {
    hold.step(DT);
    const holder = hold.allPlayers.find((p) => p.gid === ownerGid)!;
    if (hold.ball.owner !== holder) break;
    heldTicks += 1;
    const near = nearestOpponent(hold, holder);
    if (near !== null && distance(near.pos, hold.ball.pos) > distance(near.pos, holder.pos)) {
      farSideTicks += 1;
    }
  }
  const holder = hold.allPlayers.find((p) => p.gid === ownerGid)!;
  const survived = hold.ball.owner === holder;
  lostToTackle = hold.teams[1 - ownerBefore.side].stats.tackles > tacklesBefore;

  // The baseline arm: the same fork, untouched — whatever he would have done.
  const carry = cloneSimulationState(before);
  const carryStart = carry.allPlayers.find((p) => p.gid === ownerGid)!.stamina;
  for (let tick = 0; tick < HOLD_TICKS; tick++) {
    carry.step(DT);
    if (carry.ball.owner?.gid !== ownerGid) break;
  }
  const carrier = carry.allPlayers.find((p) => p.gid === ownerGid)!;

  return {
    hold: {
      cluster, band, strength, farSideTicks, heldTicks, survived, lostToTackle,
      staminaSpent: Math.max(0, holdStart - holder.stamina),
    },
    carrySurvived: carry.ball.owner?.gid === ownerGid,
    carryStamina: Math.max(0, carryStart - carrier.stamina),
  };
};

const harvest = () => {
  const trials: Trial[] = [];
  const carry: { survived: boolean; stamina: number }[] = [];
  let matches = 0;
  for (
    let seed = SEED_START;
    seed < SEED_START + MAX_MATCHES && trials.length < HOLD_BUDGET;
    seed++
  ) {
    matches += 1;
    const cluster = seed - SEED_START;
    const match = matchOf(seed, true);
    let sinceLast = 0;
    while (!match.finished && trials.length < HOLD_BUDGET) {
      match.step(DT);
      sinceLast += 1;
      const owner = match.ball.owner;
      // Sample every 30th tick with a settled owner — spaced so successive
      // trials are not the same possession seen twice.
      if (owner === null || owner.role === 'GK' || sinceLast < 30) continue;
      if (match.phase !== 'playing') continue;
      sinceLast = 0;
      const result = trialAt(match, owner.gid, cluster);
      if (result === null) continue;
      trials.push(result.hold);
      carry.push({ survived: result.carrySurvived, stamina: result.carryStamina });
    }
  }
  return { trials, carry, matches };
};

// --- statistics (cluster unit = match seed, ruling #20) ---------------------
const clusterBootstrapCI = (
  rows: readonly { readonly cluster: number; readonly hit: number }[], offset: number,
) => {
  const byCluster = new Map<number, { hits: number; n: number }>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster) ?? { hits: 0, n: 0 };
    bucket.hits += row.hit;
    bucket.n += 1;
    byCluster.set(row.cluster, bucket);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const rates: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let hits = 0;
    let n = 0;
    for (let index = 0; index < clusters.length; index++) {
      const pick = clusters[rng.int(0, clusters.length - 1)];
      hits += pick.hits;
      n += pick.n;
    }
    rates.push(n === 0 ? Number.NaN : hits / n);
  }
  rates.sort((left, right) => left - right);
  const at = (q: number) => rates[Math.min(rates.length - 1,
    Math.max(0, Math.floor(q * (rates.length - 1))))];
  return { clusters: clusters.length, lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

/** The A3 gradient's interval: resample clusters, recompute top − bottom. */
const gradientCI = (
  rows: readonly { cluster: number; top: boolean; bottom: boolean; hit: number }[],
) => {
  const byCluster = new Map<number, typeof rows[number][]>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster);
    if (bucket === undefined) byCluster.set(row.cluster, [row]); else bucket.push(row);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + 90);
  const draws: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let topHits = 0; let topN = 0; let botHits = 0; let botN = 0;
    for (let index = 0; index < clusters.length; index++) {
      for (const row of clusters[rng.int(0, clusters.length - 1)]) {
        if (row.top) { topHits += row.hit; topN += 1; }
        if (row.bottom) { botHits += row.hit; botN += 1; }
      }
    }
    if (topN > 0 && botN > 0) draws.push(topHits / topN - botHits / botN);
  }
  draws.sort((left, right) => left - right);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);
const canonical = (value: unknown): string => JSON.stringify(value);

const runExperiment = () => {
  const { trials, carry, matches } = harvest();
  const held = trials.filter((trial) => trial.heldTicks > 0);

  // A1: the shield is a body position.
  const farSide = held.reduce((sum, trial) => sum + trial.farSideTicks, 0);
  const heldTicks = held.reduce((sum, trial) => sum + trial.heldTicks, 0);
  const a1Rate = heldTicks === 0 ? Number.NaN : farSide / heldTicks;

  // A2a/A2b: survival by pressure band.
  const byBand = ([0, 1, 2] as Band[]).map((band) => {
    const rows = trials.filter((trial) => trial.band === band);
    return {
      band,
      n: rows.length,
      survival: rows.length === 0 ? Number.NaN
        : rows.filter((trial) => trial.survived).length / rows.length,
      ci: clusterBootstrapCI(
        rows.map((trial) => ({ cluster: trial.cluster, hit: trial.survived ? 1 : 0 })), band,
      ),
      staminaPerSecond: mean(rows.map((trial) => (trial.heldTicks === 0 ? 0
        : trial.staminaSpent / (trial.heldTicks * DT)))),
      lostToTackle: rows.length === 0 ? Number.NaN
        : rows.filter((trial) => trial.lostToTackle).length / rows.length,
    };
  });
  const a2aMonotone = byBand[0].survival > byBand[1].survival
    && byBand[1].survival > byBand[2].survival;
  const a2bCeiling = byBand[2].survival < A2B_SURVIVAL_CEILING;
  const a2cStamina = byBand.every((row) => row.staminaPerSecond > 0)
    && byBand[0].staminaPerSecond < byBand[1].staminaPerSecond
    && byBand[1].staminaPerSecond < byBand[2].staminaPerSecond;

  // A3: the gradient, by strength tercile.
  const sorted = [...trials].sort((left, right) => left.strength - right.strength);
  const third = Math.floor(sorted.length / 3);
  const bottomCut = sorted[third]?.strength ?? 0;
  const topCut = sorted[sorted.length - third]?.strength ?? 1;
  const tercile = (trial: Trial) => (trial.strength < bottomCut ? 'bottom'
    : trial.strength >= topCut ? 'top' : 'mid');
  const terciles = ['bottom', 'mid', 'top'].map((name) => {
    const rows = trials.filter((trial) => tercile(trial) === name);
    return {
      tercile: name,
      n: rows.length,
      meanStrength: mean(rows.map((trial) => trial.strength)),
      survival: rows.length === 0 ? Number.NaN
        : rows.filter((trial) => trial.survived).length / rows.length,
    };
  });
  const gradient = terciles[2].survival - terciles[0].survival;
  const gradientInterval = gradientCI(trials.map((trial) => ({
    cluster: trial.cluster,
    top: tercile(trial) === 'top',
    bottom: tercile(trial) === 'bottom',
    hit: trial.survived ? 1 : 0,
  })));
  const a3 = gradient >= A3_GRADIENT_FLOOR && gradientInterval.lower > 0;

  const gates = {
    a1FarSide: a1Rate >= A1_FAR_SIDE_FLOOR,
    a2aMonotone,
    a2bCeiling,
    a2cStamina,
    a3Gradient: a3,
    coverage: trials.length >= HOLD_BUDGET,
  };

  return {
    experiment: 'C5-T0-hold-anatomy',
    authority: 'C5-T0-HOLD-MECHANICS',
    parameters: {
      seedStart: SEED_START, holdBudget: HOLD_BUDGET, holdTicks: HOLD_TICKS,
      pressureBands: PRESSURE_BANDS, clusterUnit: 'match seed',
      a1Floor: A1_FAR_SIDE_FLOOR, a2bCeiling: A2B_SURVIVAL_CEILING,
      a3Floor: A3_GRADIENT_FLOOR,
      bootstrapResamples: BOOTSTRAP_RESAMPLES, bootstrapSeed: BOOTSTRAP_SEED,
    },
    matches,
    trials: trials.length,
    a1: { farSideTicks: farSide, heldTicks, rate: a1Rate },
    a2: { byBand, monotone: a2aMonotone, ceiling: a2bCeiling, stamina: a2cStamina },
    a3: { terciles, gradient, ci: gradientInterval },
    // §3.3, reported never gated.
    reported: {
      carryBaseline: {
        n: carry.length,
        survival: carry.length === 0 ? Number.NaN
          : carry.filter((row) => row.survived).length / carry.length,
        staminaPerSecond: mean(carry.map((row) => row.stamina / (HOLD_TICKS * DT))),
      },
      holdSurvivalOverall: trials.length === 0 ? Number.NaN
        : trials.filter((trial) => trial.survived).length / trials.length,
      meanHeldTicks: mean(trials.map((trial) => trial.heldTicks)),
      lostToTackleOverall: trials.length === 0 ? Number.NaN
        : trials.filter((trial) => trial.lostToTackle).length / trials.length,
    },
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, x5Deterministic: deterministic };
const output = {
  ...first, gates, sha256,
  verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL',
};
console.log(JSON.stringify(output, null, 2));
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
console.error(
  `C5-T0 ${output.verdict} · ${output.trials} trials over ${output.matches} matches`
  + ` · A1 far-side ${pct(output.a1.rate)} (floor ${pct(A1_FAR_SIDE_FLOOR)})`
  + ` · survival by pressure ${output.a2.byBand.map((b) => `${pct(b.survival)}(n=${b.n})`).join(' → ')}`
  + ` · A2b ceiling ${pct(output.a2.byBand[2].survival)} < ${pct(A2B_SURVIVAL_CEILING)} = ${output.gates.a2bCeiling}`
  + ` · stamina/s ${output.a2.byBand.map((b) => b.staminaPerSecond.toFixed(5)).join(' → ')}`
  + ` · A3 gradient ${(output.a3.gradient * 100).toFixed(2)}pp`
  + ` CI [${(output.a3.ci.lower * 100).toFixed(2)}, ${(output.a3.ci.upper * 100).toFixed(2)}]`
  + ` (bottom ${pct(output.a3.terciles[0].survival)} → top ${pct(output.a3.terciles[2].survival)})`
  + ` · carry baseline survival ${pct(output.reported.carryBaseline.survival)}`
  + ` · lost-to-tackle ${pct(output.reported.lostToTackleOverall)}`
  + ` · failed [${failed.join(', ')}]`
  + ` · SHA ${sha256}`,
);
