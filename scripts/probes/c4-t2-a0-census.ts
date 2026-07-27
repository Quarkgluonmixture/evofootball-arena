// C4 T2-ARRIVAL, A0 — THE REACHABILITY CENSUS (read-only, zero src/**)
// Authority: docs/world-model/C4-T2-ARRIVAL.md §4.1 (commander rulings #32.4,
// #33.3). Runs BEFORE the intervention exists. It may STOP the stage; it may
// not re-tune a single Phase-A gate value.
//
// The question: T1-FLIGHT left H3 (the ball crossed head height with nobody at
// head height) at 22.90% of all crosses with a median miss of 2.39 m. Is that
// a ROUTING failure — the bodies could have been there and were sent
// elsewhere — or is it UNREACHABLE by construction, in which case the seat is
// pre-kick anticipation and belongs to Stage III, not to this stage.
//
// Classification is inherited VERBATIM from the T0R/T1-FLIGHT census probe so
// H3 is the same object it was when the target was sized; the only additions
// are the licence snapshot at the kick and the R1-R4 decomposition.
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { ballLanding } from '../../src/ai/perception';
import {
  BOX_DEPTH, BOX_WIDTH, DT, GRAVITY, HALF_L,
  HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS,
} from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import {
  DEFAULT_POLICY, TEAM_SIZE,
  type PolicyParams, type TeamInfo, type TeamStyle,
} from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §3, §4.1) ----------------------------------
/** `cross-anatomy.ts`'s own WINDOW, verbatim — changing it breaks the pin. */
const WINDOW = 4;
/** Fresh: 830/840/850/860/870/880/890/900/909/910 are all seen. */
const A0_SEED_START = 920_000;
/** T0R's per-combination budgets, verbatim (2,695 matches). */
const MATCH_BUDGET: Record<string, number> = {
  'CROSS vs NEUTRAL': 295,
  'CROSS vs BUS': 296,
  'CROSS vs PRESS': 354,
  'BAL vs NEUTRAL': 524,
  'BAL vs BUS': 566,
  'BAL vs PRESS': 660,
};
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50017;
/** §4.1's STOP rule: the intervention does not run above this. */
const STOP_THRESHOLD = 0.80;
/** §4.1's R2 band, verbatim: "reachable within 1.15x that budget". */
const MARGINAL_MULTIPLIER = 1.15;
/** `actionExecutor.ts:166` / `320` / `344` — the meet point's upstream offset. */
const MEET_UPSTREAM = 2.5;

// --- staging, reused verbatim from `cross-anatomy.ts` (which is NOT edited) --
const neutral = (): TacticalGenome => {
  const g = {} as TacticalGenome;
  for (const k of GENE_KEYS) g[k] = 0.5;
  return g;
};
const squad = (): PlayerAttributes[] =>
  Array.from({ length: TEAM_SIZE }, () => {
    const p = {} as PlayerAttributes;
    for (const k of ATTR_KEYS) p[k] = 0.5;
    return p;
  });
const team = (
  name: string, genome: TacticalGenome, style: TeamStyle, policy?: Partial<PolicyParams>,
): TeamInfo => ({
  id: name, name, short: name.toUpperCase().slice(0, 3),
  colors: { primary: 0xff0000, secondary: 0xffffff },
  playerNames: ['Gk', 'Df', 'Mf', 'Wl', 'Wr', 'St'],
  genome, squad: squad(), style, policy,
});

const wideStyle: TeamStyle = { formationAtk: 'wide-212', formationDef: 'press-23', scheme: 'man' };

interface Atk { readonly tag: string; readonly genome: TacticalGenome; readonly policy?: Partial<PolicyParams> }
const attackers: Atk[] = [
  (() => {
    const g = neutral();
    g.attackingWidth = 0.85;
    return { tag: 'CROSS', genome: g, policy: { crossBase: DEFAULT_POLICY.crossBase * 2.2 } };
  })(),
  (() => {
    const g = neutral();
    g.attackingWidth = 0.85;
    return { tag: 'BAL', genome: g };
  })(),
];

interface Shell { readonly tag: string; readonly genome: TacticalGenome; readonly style: TeamStyle }
const shells: Shell[] = [
  { tag: 'NEUTRAL', genome: neutral(), style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } },
  (() => {
    const g = neutral();
    g.defensiveCompactness = 0.9;
    g.formationDepth = 0.15;
    g.pressIntensity = 0.15;
    return { tag: 'BUS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: 'man' } as TeamStyle };
  })(),
  (() => {
    const g = neutral();
    g.pressIntensity = 0.9;
    g.defensiveCompactness = 0.35;
    g.formationDepth = 0.8;
    return { tag: 'PRESS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } as TeamStyle };
  })(),
];

// --- per-cross record --------------------------------------------------------
type Klass = 'C0' | 'C1' | 'C2' | 'C3atk' | 'C3def';
type Reach = 'R1reachable' | 'R2marginal' | 'R3unreachable' | 'R4noLicence';
const REACHES: readonly Reach[] = ['R1reachable', 'R2marginal', 'R3unreachable', 'R4noLicence'];

interface CrossRow {
  readonly cluster: number;
  readonly klass: Klass;
  readonly arrived: boolean;
  readonly atkTouchInWindow: boolean;
  readonly defTouchInWindow: boolean;
  readonly inRadiusAtSample: boolean;
  readonly maxZ: number;
  readonly bandTicks: number;
  readonly minOutfieldDistInBand: number;
  readonly minAtkDistInBand: number;
  readonly terminalByGk: boolean;
  readonly terminalOutfield: boolean;
  readonly terminalZ: number;
  readonly oldClass: 'atkHeader' | 'defHeader' | 'noHeader';
  readonly goal: boolean;
  readonly shot: boolean;
  /** A0: the licence snapshot at the kick, and what it could physically do. */
  readonly licence: Licence | null;
}

interface Licence {
  /** |runners U {arriver}| at the kick, sent-off excluded. */
  readonly count: number;
  readonly hadArriver: boolean;
  /** Flight time to touch-down, read off the launch (`ballLanding`). */
  readonly flightT: number;
  /** Nearest licensed body's travel to the meet point, and his budget. */
  readonly need: number;
  readonly budget: number;
  /** Same two numbers for the ARRIVER specifically, when he is licensed. */
  readonly arriverNeed: number | null;
  readonly arriverBudget: number | null;
  /** Distance from the meet point to the nearest attacker of ANY licence. */
  readonly nearestAnyAtk: number;
}

const reachOf = (row: CrossRow): Reach => {
  const l = row.licence;
  if (l === null || l.count === 0) return 'R4noLicence';
  if (l.need <= l.budget) return 'R1reachable';
  if (l.need <= l.budget * MARGINAL_MULTIPLIER) return 'R2marginal';
  return 'R3unreachable';
};

const dist = (
  a: Readonly<{ x: number; y: number }>, b: Readonly<{ x: number; y: number }>,
): number => Math.hypot(a.x - b.x, a.y - b.y);

/** In the attacking box, by the same geometry `tryAerial`'s bonus term uses. */
const inAttackingBox = (
  localX: number, y: number,
): boolean => localX > HALF_L - BOX_DEPTH && Math.abs(y) <= BOX_WIDTH / 2;

interface Open {
  readonly kickTime: number;
  readonly crosser: Player | null;
  readonly ah0: number;
  readonly dh0: number;
  readonly licence: Licence | null;
  arrived: boolean;
  windowDone: boolean;
  atkTouchInWindow: boolean;
  defTouchInWindow: boolean;
  maxZ: number;
  bandTicks: number;
  minOutfieldDistInBand: number;
  minAtkDistInBand: number;
  terminalByGk: boolean;
  terminalOutfield: boolean;
  terminalZ: number;
  lastZ: number;
  nearestAtkAtClosest: number;
  inRadiusAtSample: boolean;
}

/** One (archetype × shell) cell: walk the matches, harvest every cross. */
const harvestCombo = (
  atk: Atk, shell: Shell, seedStart: number, matchBudget: number,
): { rows: CrossRow[]; matches: number } => {
  const rows: CrossRow[] = [];
  for (let k = 0; k < matchBudget; k++) {
    const m = new Match({
      seed: seedStart + k,
      teamA: team('ATK', atk.genome, wideStyle, atk.policy),
      teamB: team(shell.tag, shell.genome, shell.style),
      c4Flight: true, // the coupled-pair baseline (#32.3): T2 sits on T1's world
    });
    const attacking = m.teams[0];
    const defending = m.teams[1];
    let open: Open | null = null;
    let crosses0 = 0;

    const closeWindow = (): void => {
      if (open === null) return;
      const ah = attacking.stats.headersWon - open.ah0;
      const dh = defending.stats.headersWon - open.dh0;
      const oldClass = ah > 0 ? 'atkHeader' : dh > 0 ? 'defHeader' : 'noHeader';
      const metByAttacker = open.inRadiusAtSample || open.atkTouchInWindow;
      const klass: Klass = ah > 0 ? 'C3atk'
        : dh > 0 ? 'C3def'
          : !open.arrived ? 'C0'
            : metByAttacker ? 'C2' : 'C1';
      const s = m.shotLog.find((e) => (
        e.side === 0 && e.t >= open!.kickTime && e.t <= open!.kickTime + WINDOW
        && e.outcome !== 'pending'
      ));
      rows.push({
        cluster: k,
        klass,
        arrived: open.arrived,
        atkTouchInWindow: open.atkTouchInWindow,
        defTouchInWindow: open.defTouchInWindow,
        inRadiusAtSample: open.inRadiusAtSample,
        maxZ: open.maxZ,
        bandTicks: open.bandTicks,
        minOutfieldDistInBand: open.minOutfieldDistInBand,
        minAtkDistInBand: open.minAtkDistInBand,
        terminalByGk: open.terminalByGk,
        terminalOutfield: open.terminalOutfield,
        terminalZ: open.terminalZ,
        oldClass,
        shot: s !== undefined,
        goal: s?.outcome === 'goal',
        licence: open.licence,
      });
      open = null;
    };

    /** Tick-boundary reading, called BOTH before and after `m.step()`. */
    const readBoundary = (): void => {
      if (open !== null && !open.windowDone) {
        const t = m.ball.lastTouch;
        if (t === open.crosser && m.ball.z > open.maxZ) open.maxZ = m.ball.z;
        const zBefore = open.lastZ;
        open.lastZ = m.ball.z;
        const touched = t !== null && t !== open.crosser;
        const inBand = m.ball.vz < 0 && m.ball.z <= HEADER_MAX_HEIGHT;
        if (m.phase !== 'playing') {
          open.windowDone = true;
        } else if (touched) {
          if (open.arrived) {
            if (t!.side === 0) open.atkTouchInWindow = true;
            else open.defTouchInWindow = true;
          } else if (t!.side === 0 && t!.role !== 'GK') open.atkTouchInWindow = true;
          open.terminalByGk = t!.role === 'GK';
          open.terminalOutfield = t!.role !== 'GK';
          open.terminalZ = zBefore;
          open.windowDone = true;
        } else if (!inBand) {
          if (open.arrived) open.windowDone = true;
        } else {
          const ball = m.ball.pos;
          let nearestAtk = Infinity;
          let nearestDef = Infinity;
          let within135 = 0;
          for (const p of attacking.players) {
            if (p.sentOff || p.role === 'GK') continue;
            const d = dist(p.pos, ball);
            if (d < nearestAtk) nearestAtk = d;
            if (d <= HEADER_RADIUS) within135 += 1;
          }
          for (const p of defending.players) {
            if (p.sentOff || p.role === 'GK') continue;
            const d = dist(p.pos, ball);
            if (d < nearestDef) nearestDef = d;
          }
          if (m.ball.z >= HEADER_MIN_HEIGHT) {
            open.bandTicks += 1;
            if (nearestAtk < open.minAtkDistInBand) open.minAtkDistInBand = nearestAtk;
            const nearestAny = Math.min(nearestAtk, nearestDef);
            if (nearestAny < open.minOutfieldDistInBand) open.minOutfieldDistInBand = nearestAny;
          }
          open.arrived = true;
          if (within135 > 0) open.inRadiusAtSample = true;
          if (nearestAtk < open.nearestAtkAtClosest) open.nearestAtkAtClosest = nearestAtk;
        }
      }
    };

    /**
     * The A0 measurement, taken at the kick boundary. The licence set is the
     * one the INTERVENTION would snapshot: `team.runners` union the arriver,
     * sent-off excluded — nobody new, exactly as §2.3 freezes it. The meet
     * point is the engine's own formula (`actionExecutor.ts:164-166`).
     *
     * `ballLanding` is exact and Magnus-corrected, so `flightT` is the real
     * budget rather than an estimate. On the pre-existing not-a-launch capture
     * (§4.2c, flag-independent, shared with the banked census) there is no
     * meaningful flight to reason about, and the row carries a null licence —
     * counted and reported separately from R4, which is a real empty licence.
     */
    const readLicence = (): Licence | null => {
      const b = m.ball;
      if (b.vz < (GRAVITY * 0.7) / 2 - GRAVITY * DT) return null;
      const land = ballLanding(b);
      const vl = Math.hypot(b.vel.x, b.vel.y) || 1;
      const meet = {
        x: land.x - (b.vel.x / vl) * MEET_UPSTREAM,
        y: land.y - (b.vel.y / vl) * MEET_UPSTREAM,
      };
      const licensed: Player[] = [];
      const seen = new Set<number>();
      for (const idx of attacking.runners) {
        const p = attacking.players[idx];
        if (p.sentOff || p.role === 'GK' || p === b.lastTouch) continue;
        licensed.push(p);
        seen.add(idx);
      }
      const arriverIdx = attacking.arriver;
      let arriver: Player | null = null;
      if (arriverIdx !== null) {
        const p = attacking.players[arriverIdx];
        if (!p.sentOff && p.role !== 'GK' && p !== b.lastTouch) {
          arriver = p;
          if (!seen.has(arriverIdx)) licensed.push(p);
        }
      }
      let need = Infinity;
      let budget = Number.NaN;
      for (const p of licensed) {
        const d = dist(p.pos, meet);
        if (d < need) {
          need = d;
          budget = Math.max(p.topSpeed, 0.1) * land.t;
        }
      }
      let nearestAnyAtk = Infinity;
      for (const p of attacking.players) {
        if (p.sentOff || p.role === 'GK' || p === b.lastTouch) continue;
        const d = dist(p.pos, meet);
        if (d < nearestAnyAtk) nearestAnyAtk = d;
      }
      return {
        count: licensed.length,
        hadArriver: arriver !== null,
        flightT: land.t,
        need: licensed.length === 0 ? Number.NaN : need,
        budget: licensed.length === 0 ? Number.NaN : budget,
        arriverNeed: arriver === null ? null : dist(arriver.pos, meet),
        arriverBudget: arriver === null ? null : Math.max(arriver.topSpeed, 0.1) * land.t,
        nearestAnyAtk,
      };
    };

    while (!m.finished) {
      readBoundary();
      m.step(DT);
      readBoundary();

      const c = attacking.stats.crosses;
      if (c > crosses0) {
        if (open !== null) closeWindow();
        open = {
          kickTime: m.simTime,
          crosser: m.ball.lastTouch,
          ah0: attacking.stats.headersWon,
          dh0: defending.stats.headersWon,
          licence: readLicence(),
          arrived: false,
          windowDone: false,
          atkTouchInWindow: false,
          defTouchInWindow: false,
          maxZ: m.ball.z,
          bandTicks: 0,
          minOutfieldDistInBand: Infinity,
          minAtkDistInBand: Infinity,
          terminalByGk: false,
          terminalOutfield: false,
          terminalZ: Number.NaN,
          lastZ: m.ball.z,
          nearestAtkAtClosest: Infinity,
          inRadiusAtSample: false,
        };
        crosses0 = c;
      }
      if (open !== null && m.simTime > open.kickTime + WINDOW) closeWindow();
    }
    if (open !== null) closeWindow();
  }
  return { rows, matches: matchBudget };
};

// --- the T0b ladder, verbatim ------------------------------------------------
type Rung = 'H0heightPreempted' | 'H1keeper' | 'H2takenDownAtHeight'
  | 'H3noContenderAtHeight' | 'H4contenderNoHeader';
const RUNGS: readonly Rung[] = ['H0heightPreempted', 'H1keeper',
  'H2takenDownAtHeight', 'H3noContenderAtHeight', 'H4contenderNoHeader'];

const rungOf = (row: CrossRow): Rung => {
  if (row.bandTicks === 0) return 'H0heightPreempted';
  if (row.terminalByGk) return 'H1keeper';
  if (row.terminalOutfield && row.terminalZ >= HEADER_MIN_HEIGHT) return 'H2takenDownAtHeight';
  if (row.minOutfieldDistInBand > HEADER_RADIUS) return 'H3noContenderAtHeight';
  return 'H4contenderNoHeader';
};

// --- statistics (cluster unit = the match seed, ruling #20) ------------------
const shareCI = (
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
  return { lower: at(0.025), median: at(0.5), upper: at(0.975) };
};

const mean = (values: readonly number[]): number => (values.length === 0 ? Number.NaN
  : values.reduce((sum, value) => sum + value, 0) / values.length);
const quantile = (values: readonly number[], q: number): number => {
  if (values.length === 0) return Number.NaN;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1))))];
};
const share = (rows: readonly CrossRow[], pick: (row: CrossRow) => boolean): number =>
  (rows.length === 0 ? Number.NaN : rows.filter(pick).length / rows.length);
const canonical = (value: unknown): string => JSON.stringify(value);
const round = (value: number, dp = 6): number =>
  (Number.isFinite(value) ? Number(value.toFixed(dp)) : Number.NaN);

const CLASSES: readonly Klass[] = ['C0', 'C1', 'C2', 'C3atk', 'C3def'];

const describeReach = (rows: readonly CrossRow[], offset: number) => {
  const withLicence = rows.filter((row) => row.licence !== null);
  const counts = Object.fromEntries(
    REACHES.map((r) => [r, withLicence.filter((row) => reachOf(row) === r).length]),
  ) as Record<Reach, number>;
  const n = withLicence.length;
  const shares = Object.fromEntries(REACHES.map((r) => [
    r, n === 0 ? Number.NaN : round(counts[r] / n),
  ])) as Record<Reach, number>;
  const stopStat = n === 0 ? Number.NaN
    : (counts.R3unreachable + counts.R4noLicence) / n;
  const ci = shareCI(withLicence.map((row) => ({
    cluster: row.cluster,
    hit: reachOf(row) === 'R3unreachable' || reachOf(row) === 'R4noLicence' ? 1 : 0,
  })), offset);
  const needs = withLicence.filter((row) => Number.isFinite(row.licence!.need))
    .map((row) => row.licence!);
  const slack = needs.map((l) => l.budget - l.need);
  return {
    n,
    noLaunchAtCapture: rows.length - withLicence.length,
    counts,
    shares,
    stopStatistic: round(stopStat),
    stopStatisticCI: { lower: round(ci.lower), upper: round(ci.upper) },
    geometry: {
      needMedian: round(quantile(needs.map((l) => l.need), 0.5), 4),
      needP90: round(quantile(needs.map((l) => l.need), 0.9), 4),
      budgetMedian: round(quantile(needs.map((l) => l.budget), 0.5), 4),
      flightTMedian: round(quantile(needs.map((l) => l.flightT), 0.5), 4),
      slackMedian: round(quantile(slack, 0.5), 4),
      slackP10: round(quantile(slack, 0.1), 4),
      licenceCountMean: round(mean(withLicence.map((row) => row.licence!.count)), 4),
      hadArriverShare: n === 0 ? Number.NaN
        : round(withLicence.filter((row) => row.licence!.hadArriver).length / n),
      // What an UNLICENSED body could have done: the seat of a later
      // licensing stage, reported so the residual has a size.
      nearestAnyAtkMedian: round(quantile(
        withLicence.map((row) => row.licence!.nearestAnyAtk), 0.5,
      ), 4),
    },
  };
};

const describeCombo = (tag: string, rows: readonly CrossRow[], matches: number) => {
  const c2rows = rows.filter((row) => row.klass === 'C2');
  const h3rows = c2rows.filter((row) => rungOf(row) === 'H3noContenderAtHeight');
  return {
    tag,
    matches,
    crosses: rows.length,
    crossesPerMatch: round(rows.length / matches, 4),
    classShares: Object.fromEntries(
      CLASSES.map((k) => [k, round(share(rows, (row) => row.klass === k))]),
    ) as Record<Klass, number>,
    h3: {
      n: h3rows.length,
      shareOfAllCrosses: round(h3rows.length / rows.length),
      minOutMedian: round(quantile(h3rows.filter((row) => Number.isFinite(row.minOutfieldDistInBand))
        .map((row) => row.minOutfieldDistInBand), 0.5), 4),
    },
    reach: describeReach(h3rows, 0),
    rollupOk: rows.filter((row) => row.klass === 'C3atk').length
        === rows.filter((row) => row.oldClass === 'atkHeader').length
      && rows.filter((row) => row.klass === 'C3def').length
        === rows.filter((row) => row.oldClass === 'defHeader').length,
  };
};

const runBlock = (seedStart: number) => {
  const combos: ReturnType<typeof describeCombo>[] = [];
  const pooled: CrossRow[] = [];
  for (const atk of attackers) {
    for (const shell of shells) {
      const tag = `${atk.tag} vs ${shell.tag}`;
      const { rows, matches } = harvestCombo(atk, shell, seedStart, MATCH_BUDGET[tag]!);
      combos.push(describeCombo(tag, rows, matches));
      const offset = combos.length * 10_000;
      for (const row of rows) pooled.push({ ...row, cluster: row.cluster + offset });
    }
  }
  const c2 = pooled.filter((row) => row.klass === 'C2');
  const ladderCounts = Object.fromEntries(
    RUNGS.map((r) => [r, c2.filter((row) => rungOf(row) === r).length]),
  ) as Record<Rung, number>;
  const h3 = c2.filter((row) => rungOf(row) === 'H3noContenderAtHeight');
  return {
    seedStart,
    combos,
    pooled,
    pooledCrosses: pooled.length,
    classShares: Object.fromEntries(
      CLASSES.map((k) => [k, round(share(pooled, (row) => row.klass === k))]),
    ) as Record<Klass, number>,
    contestShare: round(share(pooled, (row) => row.klass === 'C3atk' || row.klass === 'C3def')),
    c3atkShare: round(share(pooled, (row) => row.klass === 'C3atk')),
    c3defShare: round(share(pooled, (row) => row.klass === 'C3def')),
    goalShare: round(share(pooled, (row) => row.goal)),
    shotShare: round(share(pooled, (row) => row.shot)),
    c2Pooled: c2.length,
    ladder: Object.fromEntries(RUNGS.map((r) => [r, {
      count: ladderCounts[r],
      share: c2.length === 0 ? Number.NaN : round(ladderCounts[r] / c2.length),
    }])) as Record<Rung, { count: number; share: number }>,
    ladderPartitionOk: RUNGS.reduce((sum, r) => sum + ladderCounts[r], 0) === c2.length,
    h3: {
      n: h3.length,
      shareOfAllCrosses: round(h3.length / pooled.length),
      minOutMedian: round(quantile(h3.filter((row) => Number.isFinite(row.minOutfieldDistInBand))
        .map((row) => row.minOutfieldDistInBand), 0.5), 4),
      withinTwoMetres: h3.length === 0 ? Number.NaN
        : round(h3.filter((row) => row.minOutfieldDistInBand <= 2).length / h3.length),
    },
    // THE A0 QUESTION, on H3 — and, reported beside it, on every cross, so
    // the H3 figure can be read against its own population rather than alone.
    reachH3: describeReach(h3, 1),
    reachAll: describeReach(pooled, 2),
    reachC1: describeReach(pooled.filter((row) => row.klass === 'C1'), 3),
  };
};

const runExperiment = () => {
  const a0 = runBlock(A0_SEED_START);
  const stop = a0.reachH3.stopStatistic > STOP_THRESHOLD;
  return {
    experiment: 'C4-T2-ARRIVAL (A0 reachability census)',
    authority: 'C4-T2-ARRIVAL §4.1',
    parameters: {
      seedStart: A0_SEED_START,
      matchBudget: MATCH_BUDGET,
      window: WINDOW,
      baselineFlags: { c4Flight: true },
      stopThreshold: STOP_THRESHOLD,
      marginalMultiplier: MARGINAL_MULTIPLIER,
      meetUpstream: MEET_UPSTREAM,
      clusterUnit: 'match seed',
    },
    block: a0,
    stopRule: {
      statistic: 'R3 + R4 as a share of H3 crosses with a captured launch',
      value: a0.reachH3.stopStatistic,
      threshold: STOP_THRESHOLD,
      ci: a0.reachH3.stopStatisticCI,
      fired: stop,
      verdict: stop
        ? 'STOP — the residual is unreachable by construction; the seat is pre-kick anticipation'
        : 'PROCEED — the addressable population supports the intervention',
    },
    checks: {
      ladderPartition: a0.ladderPartitionOk,
      rollup: a0.combos.every((c) => c.rollupOk),
    },
  };
};

const first = runExperiment();
const second = runExperiment();
const firstJson = canonical(first);
const deterministic = firstJson === canonical(second);
const sha256 = createHash('sha256').update(firstJson).digest('hex');
const output = { ...first, deterministic, sha256 };
// The pooled rows are the working set, not the report.
const printable = JSON.parse(JSON.stringify(output, (key, value) => (
  key === 'pooled' ? undefined : value
)));
console.log(JSON.stringify(printable, null, 2));

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const b = output.block;
console.error(
  `C4-T2-A0 ${output.stopRule.fired ? 'STOP' : 'PROCEED'}`
  + ` · crosses ${b.pooledCrosses} · C3atk ${pct(b.c3atkShare)} C3def ${pct(b.c3defShare)}`
  + ` contests ${pct(b.contestShare)} goals ${pct(b.goalShare)}`
  + ` · H3 ${b.h3.n} = ${pct(b.h3.shareOfAllCrosses)} of crosses (median ${b.h3.minOutMedian} m)`
  + ` · REACH on H3 R1 ${pct(b.reachH3.shares.R1reachable)}`
  + ` R2 ${pct(b.reachH3.shares.R2marginal)}`
  + ` R3 ${pct(b.reachH3.shares.R3unreachable)}`
  + ` R4 ${pct(b.reachH3.shares.R4noLicence)}`
  + ` · STOP stat ${pct(b.reachH3.stopStatistic)}`
  + ` CI[${pct(b.reachH3.stopStatisticCI.lower)}, ${pct(b.reachH3.stopStatisticCI.upper)}]`
  + ` vs ${pct(STOP_THRESHOLD)}`
  + ` · need median ${b.reachH3.geometry.needMedian} m vs budget ${b.reachH3.geometry.budgetMedian} m`
  + ` (slack median ${b.reachH3.geometry.slackMedian} m, flight ${b.reachH3.geometry.flightTMedian} s)`
  + ` · licence ${b.reachH3.geometry.licenceCountMean} bodies, arriver ${pct(b.reachH3.geometry.hadArriverShare)}`
  + ` · no-launch-at-capture ${b.reachH3.noLaunchAtCapture}`
  + ` · det ${deterministic} · SHA ${sha256}`,
);
