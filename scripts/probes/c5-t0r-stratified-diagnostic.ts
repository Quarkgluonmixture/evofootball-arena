// C5 T0R — THE AUTHORIZED STRATIFIED DIAGNOSTIC.
// Authority: commander ruling #27.3 — "the STRATIFIED RE-ANALYSIS on the frozen
// data is AUTHORIZED — adjustment set declared ex ante (stratify by pressure
// band; role reported as secondary), purpose = DESIGN A3R, never to change
// run 1."
//
// PURPOSE, stated so it cannot drift: this designs A3R. It does NOT re-judge
// T0 run 1, whose FAIL stands as history. Nothing here is a gate.
//
// "The frozen data": the probe does not persist trials, but the world is
// deterministic in its seeds, so re-running the identical harvest over the
// identical block (830,000+, 10,000 holds) IS reading the same data — the
// argument R20-2 already used.
//
// The adjustment set is fixed here, before the numbers: STRATIFY BY PRESSURE
// BAND (the frozen T0 cuts), report ROLE as secondary. Both attrs are crossed
// so A3R can be designed on evidence rather than on my guess: `strength` (what
// T0 gated) and `dribbling` (what the tackle formula actually weights most for
// a stationary holder — 0.18 vs 0.10, with the pace term switched off by
// drive ≈ 0).
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
  readonly dribbling: number;
  readonly role: string;
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
  const dribbling = ownerBefore.attrs.dribbling;
  const role = ownerBefore.role;

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
      cluster, band, strength, dribbling, role, farSideTicks, heldTicks, survived, lostToTackle,
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

const terciles = (values: readonly number[]) => {
  const sorted = [...values].sort((left, right) => left - right);
  const third = Math.floor(sorted.length / 3);
  return { low: sorted[third] ?? 0, high: sorted[sorted.length - third] ?? 1 };
};

const cellOf = (rows: readonly Trial[]) => ({
  n: rows.length,
  survival: rows.length === 0 ? Number.NaN
    : rows.filter((trial) => trial.survived).length / rows.length,
  tackleLoss: rows.length === 0 ? Number.NaN
    : rows.filter((trial) => trial.lostToTackle).length / rows.length,
});

const runExperiment = () => {
  const { trials, matches } = harvest();
  const cut = {
    strength: terciles(trials.map((trial) => trial.strength)),
    dribbling: terciles(trials.map((trial) => trial.dribbling)),
  };
  const tercileOf = (value: number, edges: { low: number; high: number }) =>
    (value < edges.low ? 'bottom' : value >= edges.high ? 'top' : 'mid');

  // The declared adjustment set: pressure band. Both attrs crossed against it.
  const stratified = (pick: (trial: Trial) => number, edges: { low: number; high: number }) =>
    ([0, 1, 2] as Band[]).map((band) => {
      const inBand = trials.filter((trial) => trial.band === band);
      const cells = ['bottom', 'mid', 'top'].map((name) => ({
        tercile: name,
        ...cellOf(inBand.filter((trial) => tercileOf(pick(trial), edges) === name)),
      }));
      return {
        band,
        n: inBand.length,
        cells,
        survivalGradient: cells[2].survival - cells[0].survival,
        tackleLossGradient: cells[2].tackleLoss - cells[0].tackleLoss,
      };
    });

  // The confound itself, measured: does the attr skew across the bands?
  const skew = ([0, 1, 2] as Band[]).map((band) => {
    const inBand = trials.filter((trial) => trial.band === band);
    return {
      band,
      n: inBand.length,
      meanStrength: mean(inBand.map((trial) => trial.strength)),
      meanDribbling: mean(inBand.map((trial) => trial.dribbling)),
    };
  });

  // Secondary, per the ruling: role.
  const roles = [...new Set(trials.map((trial) => trial.role))].sort().map((role) => {
    const rows = trials.filter((trial) => trial.role === role);
    return {
      role,
      ...cellOf(rows),
      meanStrength: mean(rows.map((trial) => trial.strength)),
      meanDribbling: mean(rows.map((trial) => trial.dribbling)),
      bandMix: ([0, 1, 2] as Band[]).map((band) =>
        rows.filter((trial) => trial.band === band).length / Math.max(rows.length, 1)),
    };
  });

  return {
    experiment: 'C5-T0R-stratified-diagnostic',
    authority: 'ruling #27.3 — purpose DESIGN A3R, never to re-judge run 1',
    parameters: {
      seedStart: SEED_START, holdBudget: HOLD_BUDGET, holdTicks: HOLD_TICKS,
      pressureBands: PRESSURE_BANDS,
      adjustmentSet: 'pressure band (declared ex ante); role secondary',
      tercileCuts: cut,
    },
    matches,
    trials: trials.length,
    /** The T0 gate's own object, unstratified — the thing being explained. */
    unstratified: {
      strength: ['bottom', 'mid', 'top'].map((name) => ({
        tercile: name,
        ...cellOf(trials.filter((trial) => tercileOf(trial.strength, cut.strength) === name)),
      })),
      dribbling: ['bottom', 'mid', 'top'].map((name) => ({
        tercile: name,
        ...cellOf(trials.filter((trial) => tercileOf(trial.dribbling, cut.dribbling) === name)),
      })),
    },
    stratifiedByStrength: stratified((trial) => trial.strength, cut.strength),
    stratifiedByDribbling: stratified((trial) => trial.dribbling, cut.dribbling),
    attrSkewAcrossBands: skew,
    roleSecondary: roles,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
console.log(JSON.stringify(output, null, 2));
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const line = (label: string, rows: ReturnType<typeof runExperiment>['stratifiedByStrength']) =>
  ` · ${label} ` + rows.map((band) => `b${band.band}[`
    + band.cells.map((cell) => `${pct(cell.tackleLoss)}(n=${cell.n})`).join('/')
    + `]Δ${(band.tackleLossGradient * 100).toFixed(2)}pp`).join(' ');
console.error(
  `C5-T0R-DIAG (design only, not a gate) · ${output.trials} trials / ${output.matches} matches`
  + ` · deterministic ${output.deterministic}`
  + ` · UNSTRAT tackle-loss strength ${output.unstratified.strength.map((c) => pct(c.tackleLoss)).join('/')}`
  + ` dribbling ${output.unstratified.dribbling.map((c) => pct(c.tackleLoss)).join('/')}`
  + line('STRAT-strength tackleLoss', output.stratifiedByStrength)
  + line('STRAT-dribbling tackleLoss', output.stratifiedByDribbling)
  + ` · attr skew across bands ` + output.attrSkewAcrossBands.map((b) =>
    `b${b.band} str ${b.meanStrength.toFixed(3)} dri ${b.meanDribbling.toFixed(3)}`).join(' ')
  + ` · SHA ${sha256}`,
);
