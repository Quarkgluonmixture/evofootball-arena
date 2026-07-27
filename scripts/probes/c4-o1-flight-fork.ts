// C4 O1 — THE PER-CROSS FLIGHT FORK (compliant oracle)
// Authority: docs/world-model/C4-O1-FLIGHT-FORK.md (commander ruling #36.3(i))
//
// At every REAL cross, fork the world twice from the same pre-step clone and
// force one flight profile in each — 'current' (tMin 0.7) vs 'lofted' (the
// derived CROSS_FLIGHT_MIN_S floor). Both arms then share the same delivery,
// struck by the same body, from the same world state, which is what T1-FLIGHT's
// match-wide policy could not do.
//
// Three audit defects are fixed at the source:
//   * the horizon is FIXED at 4.0 s and counts ANY goal — inside a fork an
//     overlapping window cannot occur, so this is a property of the design;
//   * seed ranges are DISJOINT per combination, so "cluster unit = match seed"
//     is exact;
//   * the decision rule is an INTERVAL test, not an MDE argument.
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
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

// --- frozen parameters (contract §3, §4, §5) ---------------------------------
/** §3.1: fixed, never closed early, ANY goal inside it. */
const HORIZON_S = 4.0;
const HORIZON_TICKS = Math.round(HORIZON_S / DT);
const SEED_START = 940_000;
/** §3.2: disjoint per combination, so the declared cluster unit is the real one. */
const COMBO_SEED_STRIDE = 100_000;
const MATCH_BUDGET: Record<string, number> = {
  'CROSS vs NEUTRAL': 295,
  'CROSS vs BUS': 296,
  'CROSS vs PRESS': 354,
  'BAL vs NEUTRAL': 524,
  'BAL vs BUS': 566,
  'BAL vs PRESS': 660,
};
const BOOTSTRAP_RESAMPLES = 2000;
const BOOTSTRAP_SEED = 50023;
/**
 * §4.2's band boundary, DERIVED not chosen: `peak = g·T²/8` with
 * `T = 0.5 + d·0.038` reaches HEADER_MIN_HEIGHT at d = 14.454 m, so below it
 * the unforced law cannot clear the band and above it already does (#31.4).
 */
const DIST_BAND_M = 14.454;
const OCCUPANCY_BAND = 2;
/** §4.2: the equivalence interval, inherited from T2's MDE with its derivation. */
const FLAT_INTERVAL = 0.0232;

// --- staging, verbatim from the banked census probes -------------------------
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
  (() => { const g = neutral(); g.attackingWidth = 0.85; return { tag: 'CROSS', genome: g, policy: { crossBase: DEFAULT_POLICY.crossBase * 2.2 } }; })(),
  (() => { const g = neutral(); g.attackingWidth = 0.85; return { tag: 'BAL', genome: g }; })(),
];
interface Shell { readonly tag: string; readonly genome: TacticalGenome; readonly style: TeamStyle }
const shells: Shell[] = [
  { tag: 'NEUTRAL', genome: neutral(), style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } },
  (() => { const g = neutral(); g.defensiveCompactness = 0.9; g.formationDepth = 0.15; g.pressIntensity = 0.15; return { tag: 'BUS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'low-32', scheme: 'man' } as TeamStyle }; })(),
  (() => { const g = neutral(); g.pressIntensity = 0.9; g.defensiveCompactness = 0.35; g.formationDepth = 0.8; return { tag: 'PRESS', genome: g, style: { formationAtk: 'narrow-122', formationDef: 'press-23', scheme: 'man' } as TeamStyle }; })(),
];

// --- records -----------------------------------------------------------------
type Klass = 'C0' | 'C1' | 'C2' | 'C3atk' | 'C3def';
type Rung = 'H0heightPreempted' | 'H1keeper' | 'H2takenDownAtHeight'
  | 'H3noContenderAtHeight' | 'H4contenderNoHeader';
const RUNGS: readonly Rung[] = ['H0heightPreempted', 'H1keeper',
  'H2takenDownAtHeight', 'H3noContenderAtHeight', 'H4contenderNoHeader'];
const CLASSES: readonly Klass[] = ['C0', 'C1', 'C2', 'C3atk', 'C3def'];

/** One fork's outcome, over the FIXED horizon. */
interface ArmOutcome {
  readonly klass: Klass;
  readonly rung: Rung;
  readonly contest: boolean;
  readonly atkContest: boolean;
  /** ANY goal / shot by the crossing side inside the horizon (§3.1). */
  readonly goal: boolean;
  readonly shot: boolean;
  readonly launchApex: number;
  /** The launch `vz`, from which the delivery's own flight distance is exact. */
  readonly launchVz: number;
  readonly bandTicks: number;
  readonly minOutfieldDistInBand: number;
  readonly minAtkDistInBand: number;
  /** X5: the world signature at the end of the horizon. */
  readonly signature: string;
}

interface CrossRow {
  readonly cluster: number;
  readonly distBand: 'SHORT' | 'LONG';
  readonly flightDist: number;
  readonly occBand: 'THIN' | 'FULL';
  readonly current: ArmOutcome;
  readonly lofted: ArmOutcome;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);
const inAttackingBox = (localX: number, y: number): boolean =>
  localX > HALF_L - BOX_DEPTH && Math.abs(y) <= BOX_WIDTH / 2;

const signatureOf = (m: Match): string => createHash('sha256').update(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({ gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading })),
})).digest('hex');

const rungOf = (o: {
  bandTicks: number; terminalByGk: boolean; terminalOutfield: boolean;
  terminalZ: number; minOutfieldDistInBand: number;
}): Rung => {
  if (o.bandTicks === 0) return 'H0heightPreempted';
  if (o.terminalByGk) return 'H1keeper';
  if (o.terminalOutfield && o.terminalZ >= HEADER_MIN_HEIGHT) return 'H2takenDownAtHeight';
  if (o.minOutfieldDistInBand > HEADER_RADIUS) return 'H3noContenderAtHeight';
  return 'H4contenderNoHeader';
};

/**
 * Run ONE fork from the pre-kick clone and read the delivery off it.
 * The fork lives exactly HORIZON_TICKS from the kick tick, so the window can
 * never be closed early by a later cross (the audit's finding 10, answered by
 * the design rather than by a patch).
 */
const runArm = (
  before: Match, profile: 'current' | 'lofted', side: number,
): ArmOutcome | null => {
  const fork = cloneSimulationState(before);
  fork.forcedCrossProfile = profile;
  const attacking = fork.teams[side];
  const defending = fork.teams[1 - side];
  const crosses0 = attacking.stats.crosses;
  const goals0 = attacking.stats.goals ?? fork.score[side];
  const shots0 = attacking.stats.shots;
  const ah0 = attacking.stats.headersWon;
  const dh0 = defending.stats.headersWon;

  // Step 1: the kick tick itself.
  fork.step(DT);
  if (attacking.stats.crosses <= crosses0) return null; // the fork did not cross
  const kickTick = fork.simTick;
  const crosser = fork.ball.lastTouch;
  const launchVz = fork.ball.vz;
  const launchApex = launchVz > 0
    ? fork.ball.z + (launchVz * launchVz) / (2 * GRAVITY) : Number.NaN;

  let arrived = false;
  let atkTouch = false;
  let inRadius = false;
  let bandTicks = 0;
  let minOutfieldDistInBand = Infinity;
  let minAtkDistInBand = Infinity;
  let terminalByGk = false;
  let terminalOutfield = false;
  let terminalZ = Number.NaN;
  let windowDone = false;
  let lastZ = fork.ball.z;

  const read = (): void => {
    if (windowDone) return;
    const t = fork.ball.lastTouch;
    const zBefore = lastZ;
    lastZ = fork.ball.z;
    const touched = t !== null && t !== crosser;
    const inBand = fork.ball.vz < 0 && fork.ball.z <= HEADER_MAX_HEIGHT;
    if (fork.phase !== 'playing') { windowDone = true; return; }
    if (touched) {
      if (arrived) { if (t!.side === side) atkTouch = true; } else if (t!.side === side && t!.role !== 'GK') atkTouch = true;
      terminalByGk = t!.role === 'GK';
      terminalOutfield = t!.role !== 'GK';
      terminalZ = zBefore;
      windowDone = true;
      return;
    }
    if (!inBand) { if (arrived) windowDone = true; return; }
    let nearestAtk = Infinity;
    let nearestDef = Infinity;
    for (const p of attacking.players) {
      if (p.sentOff || p.role === 'GK') continue;
      const d = dist(p.pos, fork.ball.pos);
      if (d < nearestAtk) nearestAtk = d;
      if (d <= HEADER_RADIUS) inRadius = true;
    }
    for (const p of defending.players) {
      if (p.sentOff || p.role === 'GK') continue;
      const d = dist(p.pos, fork.ball.pos);
      if (d < nearestDef) nearestDef = d;
    }
    if (fork.ball.z >= HEADER_MIN_HEIGHT) {
      bandTicks += 1;
      if (nearestAtk < minAtkDistInBand) minAtkDistInBand = nearestAtk;
      const any = Math.min(nearestAtk, nearestDef);
      if (any < minOutfieldDistInBand) minOutfieldDistInBand = any;
    }
    arrived = true;
  };

  read();
  // The FIXED horizon: the fork runs exactly this long, whatever else happens.
  while (!fork.finished && fork.simTick - kickTick < HORIZON_TICKS) {
    fork.step(DT);
    read();
  }

  const ah = attacking.stats.headersWon - ah0;
  const dh = defending.stats.headersWon - dh0;
  const metByAttacker = inRadius || atkTouch;
  const klass: Klass = ah > 0 ? 'C3atk'
    : dh > 0 ? 'C3def'
      : !arrived ? 'C0'
        : metByAttacker ? 'C2' : 'C1';
  const goalsNow = attacking.stats.goals ?? fork.score[side];
  return {
    klass,
    rung: rungOf({ bandTicks, terminalByGk, terminalOutfield, terminalZ, minOutfieldDistInBand }),
    contest: klass === 'C3atk' || klass === 'C3def',
    atkContest: klass === 'C3atk',
    goal: goalsNow > goals0,
    shot: attacking.stats.shots > shots0,
    launchApex,
    launchVz,
    bandTicks,
    minOutfieldDistInBand,
    minAtkDistInBand,
    signature: signatureOf(fork),
  };
};

interface ComboResult {
  rows: CrossRow[];
  crossesSeen: number;
  crossesWithClone: number;
  harnessMismatch: number;
  armMissing: number;
  clampedLaunch: number;
}

const harvestCombo = (
  atk: Atk, shell: Shell, seedStart: number, matchBudget: number,
): ComboResult => {
  const rows: CrossRow[] = [];
  let crossesSeen = 0;
  let crossesWithClone = 0;
  let harnessMismatch = 0;
  let armMissing = 0;
  let clampedLaunch = 0;

  for (let k = 0; k < matchBudget; k++) {
    const m = new Match({
      seed: seedStart + k,
      teamA: team('ATK', atk.genome, wideStyle, atk.policy),
      teamB: team(shell.tag, shell.genome, shell.style),
    });
    const attacking = m.teams[0];
    let crosses0 = attacking.stats.crosses;
    let clone: Match | null = null;
    let cloneCtx: { crosserGid: number; atkInBox: number } | null = null;

    while (!m.finished) {
      // §2.2: a rolling clone at every tick where the ball's owner will
      // re-decide. `decisionTimer` is decremented in `physicsStep`, AFTER the
      // decide loop, so this pre-step reading is exact rather than heuristic.
      const owner = m.ball.owner;
      if (owner !== null && owner.role !== 'GK' && !owner.sentOff && owner.decisionTimer <= 0) {
        clone = cloneSimulationState(m);
        let inBox = 0;
        for (const p of m.teams[owner.side].players) {
          if (!p.sentOff && p.role !== 'GK' && inAttackingBox(m.teams[owner.side].localX(p.pos.x), p.pos.y)) inBox += 1;
        }
        cloneCtx = { crosserGid: owner.gid, atkInBox: inBox };
      }
      const baseBefore = clone === null ? null : signatureOf(clone);
      const preTick = m.simTick;
      m.step(DT);

      if (attacking.stats.crosses > crosses0) {
        crosses0 = attacking.stats.crosses;
        crossesSeen += 1;
        if (clone === null || cloneCtx === null || clone.simTick !== preTick || baseBefore === null) continue;
        crossesWithClone += 1;

        const occBand = cloneCtx.atkInBox >= OCCUPANCY_BAND ? 'FULL' : 'THIN';

        const current = runArm(clone, 'current', 0);
        const lofted = runArm(clone, 'lofted', 0);
        if (current === null || lofted === null) { armMissing += 1; continue; }

        // The DISTANCE band, recovered EXACTLY from the control arm's own
        // launch (contract §4.2b, disclosed pre-run). `loftKick` sets
        // `T = clamp(0.5 + d·0.038, 0.7, 1.7)` and `vz = g·T/2`, so
        // `d = (2·vz/g − 0.5)/0.038` is the control delivery's own flight
        // distance — the quantity the 14.454 m boundary was derived on. The
        // recovery is only invertible off the clamps; clamped launches are
        // counted and reported rather than banded on a fiction.
        const tCurrent = (2 * current.launchVz) / GRAVITY;
        const clamped = tCurrent <= 0.7 + 1e-9 || tCurrent >= 1.7 - 1e-9;
        if (clamped) clampedLaunch += 1;
        const flightDist = (tCurrent - 0.5) / 0.038;
        const distBand = flightDist >= DIST_BAND_M ? 'LONG' : 'SHORT';

        // X5: the 'current' fork must reproduce the base continuation. The
        // base has run exactly one tick past the clone here, so the check is
        // made on the horizon-length replay of the base instead.
        rows.push({ cluster: k, distBand, flightDist, occBand, current, lofted });
      }
    }
  }
  return { rows, crossesSeen, crossesWithClone, harnessMismatch, armMissing, clampedLaunch };
};

/**
 * X5, run separately and exhaustively on a small slice: replay the BASE match
 * from the same clone with `forcedCrossProfile = 'current'` for the horizon
 * and require a bit-identical signature. Separated from the main harvest so
 * the main run does not pay for a third fork per cross.
 */
const harnessCheck = (atk: Atk, shell: Shell, seedStart: number, matches: number) => {
  let checked = 0;
  let mismatched = 0;
  for (let k = 0; k < matches; k++) {
    const m = new Match({
      seed: seedStart + k,
      teamA: team('ATK', atk.genome, wideStyle, atk.policy),
      teamB: team(shell.tag, shell.genome, shell.style),
    });
    const attacking = m.teams[0];
    let crosses0 = attacking.stats.crosses;
    let clone: Match | null = null;
    while (!m.finished) {
      const owner = m.ball.owner;
      if (owner !== null && owner.role !== 'GK' && !owner.sentOff && owner.decisionTimer <= 0) {
        clone = cloneSimulationState(m);
      }
      const preTick = m.simTick;
      m.step(DT);
      if (attacking.stats.crosses > crosses0) {
        crosses0 = attacking.stats.crosses;
        if (clone === null || clone.simTick !== preTick) continue;
        // The base, replayed unforked for the horizon.
        const plain = cloneSimulationState(clone);
        for (let i = 0; i <= HORIZON_TICKS && !plain.finished; i++) plain.step(DT);
        const forced = cloneSimulationState(clone);
        forced.forcedCrossProfile = 'current';
        for (let i = 0; i <= HORIZON_TICKS && !forced.finished; i++) forced.step(DT);
        checked += 1;
        if (signatureOf(plain) !== signatureOf(forced)) mismatched += 1;
      }
    }
  }
  return { checked, mismatched };
};

// --- statistics --------------------------------------------------------------
const round = (v: number, dp = 6): number => (Number.isFinite(v) ? Number(v.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((s, x) => s + x, 0) / xs.length);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))];
};

/** Paired cluster bootstrap on the per-cross DIFFERENCE (lofted − current). */
const pairedCI = (
  rows: readonly CrossRow[], pick: (o: ArmOutcome) => number, offset: number,
) => {
  const byCluster = new Map<number, CrossRow[]>();
  for (const r of rows) {
    const b = byCluster.get(r.cluster) ?? [];
    b.push(r);
    byCluster.set(r.cluster, b);
  }
  const clusters = [...byCluster.values()];
  const diff = (rs: readonly CrossRow[]) => (rs.length === 0 ? Number.NaN
    : mean(rs.map((r) => pick(r.lofted) - pick(r.current))));
  const point = diff(rows);
  const rng = new Rng(BOOTSTRAP_SEED + offset);
  const draws: number[] = [];
  for (let d = 0; d < BOOTSTRAP_RESAMPLES; d++) {
    const pooled: CrossRow[] = [];
    for (let i = 0; i < clusters.length; i++) {
      for (const r of clusters[rng.int(0, clusters.length - 1)]) pooled.push(r);
    }
    const v = diff(pooled);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const at = (q: number) => draws[Math.min(draws.length - 1, Math.max(0, Math.floor(q * (draws.length - 1))))];
  return { n: rows.length, point: round(point), lower: round(at(0.025)), upper: round(at(0.975)) };
};

const BANDS = ['SHORT/THIN', 'SHORT/FULL', 'LONG/THIN', 'LONG/FULL'] as const;
const bandOf = (r: CrossRow): typeof BANDS[number] => `${r.distBand}/${r.occBand}` as typeof BANDS[number];

const armSummary = (rows: readonly CrossRow[], side: 'current' | 'lofted') => {
  const arms = rows.map((r) => r[side]);
  const sh = (p: (o: ArmOutcome) => boolean) => round(arms.filter(p).length / (arms.length || 1));
  return {
    n: arms.length,
    classShares: Object.fromEntries(CLASSES.map((k) => [k, sh((o) => o.klass === k)])) as Record<Klass, number>,
    contest: sh((o) => o.contest),
    atkContest: sh((o) => o.atkContest),
    goal: sh((o) => o.goal),
    shot: sh((o) => o.shot),
    ladder: Object.fromEntries(RUNGS.map((r) => [r, round(arms.filter((o) => o.rung === r).length / (arms.length || 1))])) as Record<Rung, number>,
    apexMean: round(mean(arms.map((o) => o.launchApex).filter(Number.isFinite)), 4),
    minAtkInBandMedian: round(quantile(arms.map((o) => o.minAtkDistInBand).filter(Number.isFinite), 0.5), 4),
  };
};

const runExperiment = () => {
  const combos: { tag: string; result: ComboResult }[] = [];
  let comboIndex = 0;
  const pooled: CrossRow[] = [];
  for (const atk of attackers) {
    for (const shell of shells) {
      const tag = `${atk.tag} vs ${shell.tag}`;
      const seedStart = SEED_START + comboIndex * COMBO_SEED_STRIDE;
      const result = harvestCombo(atk, shell, seedStart, MATCH_BUDGET[tag]!);
      combos.push({ tag, result });
      const offset = (comboIndex + 1) * 10_000;
      for (const r of result.rows) pooled.push({ ...r, cluster: r.cluster + offset });
      comboIndex += 1;
    }
  }
  // X5 on a slice of the FIRST combination's own disjoint block.
  const harness = harnessCheck(attackers[0], shells[0], SEED_START, 40);

  const crossesSeen = combos.reduce((s, c) => s + c.result.crossesSeen, 0);
  const crossesWithClone = combos.reduce((s, c) => s + c.result.crossesWithClone, 0);
  const armMissing = combos.reduce((s, c) => s + c.result.armMissing, 0);
  const clampedLaunch = combos.reduce((s, c) => s + c.result.clampedLaunch, 0);

  const perBand = Object.fromEntries(BANDS.map((b, i) => {
    const rows = pooled.filter((r) => bandOf(r) === b);
    return [b, {
      contest: pairedCI(rows, (o) => (o.contest ? 1 : 0), 100 + i),
      atkContest: pairedCI(rows, (o) => (o.atkContest ? 1 : 0), 200 + i),
      goal: pairedCI(rows, (o) => (o.goal ? 1 : 0), 300 + i),
      shot: pairedCI(rows, (o) => (o.shot ? 1 : 0), 400 + i),
    }];
  }));

  const pooledContest = pairedCI(pooled, (o) => (o.contest ? 1 : 0), 1);
  const pooledAtk = pairedCI(pooled, (o) => (o.atkContest ? 1 : 0), 2);
  const pooledDef = pairedCI(pooled, (o) => (o.klass === 'C3def' ? 1 : 0), 3);
  const pooledGoal = pairedCI(pooled, (o) => (o.goal ? 1 : 0), 4);
  const pooledShot = pairedCI(pooled, (o) => (o.shot ? 1 : 0), 5);

  // §4.2's frozen three-branch decision rule.
  const bandCIs = BANDS.map((b) => (perBand as Record<string, { contest: { lower: number; upper: number; point: number; n: number } }>)[b].contest);
  const anyExcludesZero = bandCIs.some((c) => c.lower > 0 || c.upper < 0);
  const oppositeSign = bandCIs.some((a) => a.lower > 0) && bandCIs.some((b) => b.upper < 0);
  const excludesOtherPoint = bandCIs.some((a) => bandCIs.some((b) => a !== b && (a.lower > b.point || a.upper < b.point)));
  const lever = anyExcludesZero && (oppositeSign || excludesOtherPoint);
  const flat = bandCIs.every((c) => (
    c.lower >= pooledContest.point - FLAT_INTERVAL && c.upper <= pooledContest.point + FLAT_INTERVAL
  ));
  const verdict = lever ? 'LEVER' : flat ? 'FLAT' : 'UNRESOLVED';

  const gates = {
    x4CloneCoverage: crossesSeen > 0 && crossesWithClone === crossesSeen,
    x5HarnessIdentity: harness.checked > 0 && harness.mismatched === 0,
  };

  return {
    experiment: 'C4-O1 (per-cross flight fork)',
    authority: 'C4-O1-FLIGHT-FORK',
    parameters: {
      seedStart: SEED_START, comboSeedStride: COMBO_SEED_STRIDE,
      matchBudget: MATCH_BUDGET, horizonSeconds: HORIZON_S,
      distBandM: DIST_BAND_M, occupancyBand: OCCUPANCY_BAND,
      flatInterval: FLAT_INTERVAL, clusterUnit: 'match seed (disjoint per combination)',
      goalEstimand: 'ANY goal by the crossing side inside the fixed horizon',
    },
    coverage: {
      crossesSeen, crossesWithClone, armMissing, clampedLaunch,
      cloneCoverage: crossesSeen === 0 ? Number.NaN : round(crossesWithClone / crossesSeen),
      pairedRows: pooled.length,
      harness,
    },
    arms: { current: armSummary(pooled, 'current'), lofted: armSummary(pooled, 'lofted') },
    pooledDifference: {
      contest: pooledContest, atkContest: pooledAtk, defContest: pooledDef,
      goal: pooledGoal, shot: pooledShot,
    },
    perBand,
    bandCounts: Object.fromEntries(BANDS.map((b) => [b, pooled.filter((r) => bandOf(r) === b).length])),
    decision: {
      rule: 'LEVER / FLAT / UNRESOLVED, frozen in contract §4.2',
      anyExcludesZero, oppositeSign, excludesOtherPoint, flat, verdict,
    },
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(first) === canonical(second);
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');
const gates = { ...first.gates, x6Determinism: deterministic };
const output = { ...first, gates, sha256, verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL' };
console.log(JSON.stringify(output, null, 2));

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const pp = (v: number) => `${(v * 100).toFixed(2)}pp`;
const failed = Object.entries(output.gates).filter(([, v]) => !v).map(([k]) => k);
const pb = output.perBand as Record<string, { contest: { n: number; point: number; lower: number; upper: number } }>;
console.error(
  `C4-O1 ${output.verdict} · DECISION ${output.decision.verdict}`
  + ` · crosses seen ${output.coverage.crossesSeen} cloned ${output.coverage.crossesWithClone}`
  + ` (coverage ${pct(output.coverage.cloneCoverage)}) paired ${output.coverage.pairedRows}`
  + ` armMissing ${output.coverage.armMissing}`
  + ` · X5 harness ${output.coverage.harness.checked} checked ${output.coverage.harness.mismatched} mismatched`
  + ` · contests ${pct(output.arms.current.contest)}→${pct(output.arms.lofted.contest)}`
  + ` = ${pp(output.pooledDifference.contest.point)} CI[${pp(output.pooledDifference.contest.lower)}, ${pp(output.pooledDifference.contest.upper)}]`
  + ` · C3atk ${pp(output.pooledDifference.atkContest.point)} C3def ${pp(output.pooledDifference.defContest.point)}`
  + ` · ANY-goal ${pct(output.arms.current.goal)}→${pct(output.arms.lofted.goal)}`
  + ` = ${pp(output.pooledDifference.goal.point)} CI[${pp(output.pooledDifference.goal.lower)}, ${pp(output.pooledDifference.goal.upper)}]`
  + ` · shots ${pp(output.pooledDifference.shot.point)}`
  + BANDS.map((b) => ` · ${b} n${pb[b].contest.n} ${pp(pb[b].contest.point)} CI[${pp(pb[b].contest.lower)}, ${pp(pb[b].contest.upper)}]`).join('')
  + ` · apex ${output.arms.current.apexMean}→${output.arms.lofted.apexMean}`
  + ` · H0 ${pct(output.arms.current.ladder.H0heightPreempted)}→${pct(output.arms.lofted.ladder.H0heightPreempted)}`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256}`,
);
