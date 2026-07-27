// C5 T0R — THE TWO REDRAWN GATES, ON A FRESH BLOCK.
// Authority: docs/world-model/C5-T0R-REDRAW.md §3 (commander ruling #27)
//
// A2aR — the world grades a held ball by pressure, measured on the channel
//        pressure actually drives (tackle loss), not on possession survival,
//        which bundled graded terminations with ungraded ones.
// A3R  — the hold is attr-graded, stratified BY CONSTRUCTION, gating on the
//        attr the tackle formula itself weights most for a stationary holder:
//        `dribbling` x0.18 against `strength` x0.10, with the pace term
//        (x0.16) switched off by drive being about zero during a hold.
//
// Judged on seed block 840,000+. The 830,000+ block designed these gates and
// has therefore been seen: it may derive power and may not judge (C3R).
//
// A1 / A2b / A2c ride along as TRANSFERS — re-earned at their original
// thresholds rather than assumed from run 1.
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
const SEED_START = 840_000; // FRESH — the 830,000 block designed these gates
const MAX_MATCHES = Number(process.argv[3] ?? 4000);
/** A3R's budget: 12,000 forced holds — a 1.9x margin over the derived 6,400. */
const HOLD_BUDGET = Number(process.argv[2] ?? 12_000);
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

/**
 * The cluster bootstrap for a DIFFERENCE of two rates, resampling match seeds.
 * `pick` selects each row's arm; rows outside both arms are carried so the
 * band weights resample with the clusters rather than being held fixed.
 */
const differenceCI = (
  rows: readonly { cluster: number; left: boolean; right: boolean; hit: number }[],
  offset: number,
) => {
  const byCluster = new Map<number, typeof rows[number][]>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster);
    if (bucket === undefined) byCluster.set(row.cluster, [row]); else bucket.push(row);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    let lh = 0; let ln = 0; let rh = 0; let rn = 0;
    for (let index = 0; index < clusters.length; index++) {
      for (const row of clusters[rng.int(0, clusters.length - 1)]) {
        if (row.left) { lh += row.hit; ln += 1; }
        if (row.right) { rh += row.hit; rn += 1; }
      }
    }
    if (ln > 0 && rn > 0) draws.push(rh / rn - lh / ln);
  }
  draws.sort((left, right) => left - right);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

/**
 * A3R's statistic: the BAND-WEIGHTED within-stratum gradient. Stratified by
 * construction — the comparison never crosses a pressure band, and the bands
 * are re-weighted inside every bootstrap draw.
 */
const stratifiedGradientCI = (
  rows: readonly { cluster: number; band: Band; arm: 'bottom' | 'mid' | 'top'; hit: number }[],
) => {
  const byCluster = new Map<number, typeof rows[number][]>();
  for (const row of rows) {
    const bucket = byCluster.get(row.cluster);
    if (bucket === undefined) byCluster.set(row.cluster, [row]); else bucket.push(row);
  }
  const clusters = [...byCluster.values()];
  const rng = new Rng(BOOTSTRAP_SEED + 40);
  const draws: number[] = [];
  const weighted = (sample: readonly (readonly typeof rows[number][])[]) => {
    let total = 0; let sum = 0;
    for (const band of [0, 1, 2] as Band[]) {
      let bh = 0; let bn = 0; let th = 0; let tn = 0; let all = 0;
      for (const group of sample) {
        for (const row of group) {
          if (row.band !== band) continue;
          all += 1;
          if (row.arm === 'bottom') { bh += row.hit; bn += 1; }
          if (row.arm === 'top') { th += row.hit; tn += 1; }
        }
      }
      if (bn === 0 || tn === 0) continue;
      sum += all * (th / tn - bh / bn);
      total += all;
    }
    return total === 0 ? Number.NaN : sum / total;
  };
  for (let draw = 0; draw < BOOTSTRAP_RESAMPLES; draw++) {
    const sample: (readonly typeof rows[number][])[] = [];
    for (let index = 0; index < clusters.length; index++) {
      sample.push(clusters[rng.int(0, clusters.length - 1)]);
    }
    const value = weighted(sample);
    if (Number.isFinite(value)) draws.push(value);
  }
  draws.sort((left, right) => left - right);
  const at = (q: number) => draws[Math.min(draws.length - 1,
    Math.max(0, Math.floor(q * (draws.length - 1))))];
  return {
    point: weighted(clusters), lower: at(0.025), median: at(0.5), upper: at(0.975),
  };
};

const runExperiment = () => {
  const { trials, carry, matches } = harvest();
  const held = trials.filter((trial) => trial.heldTicks > 0);

  // --- transfers -----------------------------------------------------------
  const farSide = held.reduce((sum, trial) => sum + trial.farSideTicks, 0);
  const heldTicks = held.reduce((sum, trial) => sum + trial.heldTicks, 0);
  const a1Rate = heldTicks === 0 ? Number.NaN : farSide / heldTicks;

  const byBand = ([0, 1, 2] as Band[]).map((band) => {
    const rows = trials.filter((trial) => trial.band === band);
    return {
      band,
      n: rows.length,
      survival: rows.length === 0 ? Number.NaN
        : rows.filter((trial) => trial.survived).length / rows.length,
      tackleLoss: rows.length === 0 ? Number.NaN
        : rows.filter((trial) => trial.lostToTackle).length / rows.length,
      staminaPerSecond: mean(rows.map((trial) => (trial.heldTicks === 0 ? 0
        : trial.staminaSpent / (trial.heldTicks * DT)))),
    };
  });
  const a2b = byBand[2].survival < A2B_SURVIVAL_CEILING;
  const a2c = byBand.every((row) => row.staminaPerSecond > 0)
    && byBand[0].staminaPerSecond < byBand[1].staminaPerSecond
    && byBand[1].staminaPerSecond < byBand[2].staminaPerSecond;

  // --- A2aR: tackle loss strictly increasing, each step's CI above zero ----
  const steps = ([[0, 1], [1, 2]] as const).map(([left, right], index) => {
    const ci = differenceCI(trials.map((trial) => ({
      cluster: trial.cluster,
      left: trial.band === left,
      right: trial.band === right,
      hit: trial.lostToTackle ? 1 : 0,
    })), index);
    return {
      step: `band${left}->band${right}`,
      delta: byBand[right].tackleLoss - byBand[left].tackleLoss,
      ci,
      holds: ci.lower > 0,
    };
  });
  const a2aR = steps.every((step) => step.holds);

  // --- A3R: band-weighted within-stratum dribbling gradient ----------------
  const cut = terciles(trials.map((trial) => trial.dribbling));
  const armOf = (value: number): 'bottom' | 'mid' | 'top' =>
    (value < cut.low ? 'bottom' : value >= cut.high ? 'top' : 'mid');
  const gradient = stratifiedGradientCI(trials.map((trial) => ({
    cluster: trial.cluster, band: trial.band, arm: armOf(trial.dribbling),
    hit: trial.lostToTackle ? 1 : 0,
  })));
  const a3R = gradient.upper < 0;

  const perBand = ([0, 1, 2] as Band[]).map((band) => {
    const rows = trials.filter((trial) => trial.band === band);
    const cell = (name: 'bottom' | 'mid' | 'top') => {
      const inCell = rows.filter((trial) => armOf(trial.dribbling) === name);
      return {
        tercile: name, n: inCell.length,
        tackleLoss: inCell.length === 0 ? Number.NaN
          : inCell.filter((trial) => trial.lostToTackle).length / inCell.length,
      };
    };
    const cells = [cell('bottom'), cell('mid'), cell('top')];
    return { band, n: rows.length, cells, delta: cells[2].tackleLoss - cells[0].tackleLoss };
  });

  const gates = {
    a2aR, a3R,
    a1Transfer: a1Rate >= A1_FAR_SIDE_FLOOR,
    a2bTransfer: a2b,
    a2cTransfer: a2c,
    coverage: trials.length >= HOLD_BUDGET,
  };

  return {
    experiment: 'C5-T0R',
    authority: 'C5-T0R-REDRAW',
    parameters: {
      seedStart: SEED_START, holdBudget: HOLD_BUDGET, holdTicks: HOLD_TICKS,
      pressureBands: PRESSURE_BANDS, clusterUnit: 'match seed',
      dribblingTercileCuts: cut,
      designedOn: 'block 830,000 (seen: derived power, did not judge)',
    },
    matches, trials: trials.length,
    byBand,
    a2aR: { steps, holds: a2aR },
    a3R: { gradient, perBand, holds: a3R },
    transfers: { a1: { rate: a1Rate, heldTicks }, a2b: byBand[2].survival, a2c: byBand.map((b) => b.staminaPerSecond) },
    reported: {
      carryBaseline: {
        n: carry.length,
        survival: carry.length === 0 ? Number.NaN
          : carry.filter((row) => row.survived).length / carry.length,
      },
      holdSurvivalOverall: trials.length === 0 ? Number.NaN
        : trials.filter((trial) => trial.survived).length / trials.length,
      strengthGradientForComparison: (() => {
        const sc = terciles(trials.map((trial) => trial.strength));
        return stratifiedGradientCI(trials.map((trial) => ({
          cluster: trial.cluster, band: trial.band,
          arm: trial.strength < sc.low ? 'bottom' : trial.strength >= sc.high ? 'top' : 'mid',
          hit: trial.lostToTackle ? 1 : 0,
        })));
      })(),
    },
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const gates = { ...first.gates, dDeterministic: deterministic };
const output = { ...first, gates, sha256, verdict: Object.values(gates).every(Boolean) ? 'PASS' : 'FAIL' };
console.log(JSON.stringify(output, null, 2));
const pct = (value: number) => `${(value * 100).toFixed(2)}%`;
const pp = (value: number) => `${(value * 100).toFixed(2)}pp`;
const failed = Object.entries(output.gates).filter(([, value]) => !value).map(([key]) => key);
console.error(
  `C5-T0R ${output.verdict} · ${output.trials} trials / ${output.matches} clusters (block ${SEED_START})`
  + ` · A2aR tackle-loss ${output.byBand.map((b) => `${pct(b.tackleLoss)}(n=${b.n})`).join(' → ')}`
  + ` steps ${output.a2aR.steps.map((s) => `${pp(s.delta)} CI[${pp(s.ci.lower)},${pp(s.ci.upper)}]`).join(' ')}`
  + ` = ${output.gates.a2aR}`
  + ` · A3R dribbling gradient ${pp(output.a3R.gradient.point)}`
  + ` CI [${pp(output.a3R.gradient.lower)}, ${pp(output.a3R.gradient.upper)}] = ${output.gates.a3R}`
  + ` (per band ${output.a3R.perBand.map((b) => pp(b.delta)).join(' / ')})`
  + ` · strength for comparison ${pp(output.reported.strengthGradientForComparison.point)}`
  + ` CI [${pp(output.reported.strengthGradientForComparison.lower)}, ${pp(output.reported.strengthGradientForComparison.upper)}]`
  + ` · transfers A1 ${pct(output.transfers.a1.rate)} A2b ${pct(output.transfers.a2b)}`
  + ` A2c ${output.transfers.a2c.map((v) => v.toFixed(5)).join('→')}`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256}`,
);
