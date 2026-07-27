// C4 O2 — THE SECOND-BODY STATION FORK (compliant oracle)
// Authority: docs/world-model/C4-O2-SECOND-BODY-FORK.md (ruling #36.3(ii))
//
// At every REAL cross, fork the world twice from the same pre-step clone:
// CONTROL (seam null) and FORCED (one ADDITIONAL already-licensed body — not
// the registered receiver, not a chaser — steered at the descent meet point
// for the flight). This is the branch #34.3 closed by DOCTRINE; O2 does not
// challenge the doctrine, it converts the closure from doctrinal to measured.
//
// Harness, estimand and clustering are O1's verbatim: a fixed 4.0 s horizon
// counting ANY goal, disjoint seed ranges per combination, clone coverage and
// control-fork identity as GATES, and an interval decision rule.
import { createHash } from 'node:crypto';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { ballLanding } from '../../src/ai/perception';
import {
  CONTROL_MAX_HEIGHT, DT, HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_RADIUS,
} from '../../src/sim/constants';
import { GENE_KEYS, type TacticalGenome } from '../../src/evolution/genome';
import { ATTR_KEYS, type PlayerAttributes } from '../../src/evolution/playerGenome';
import {
  DEFAULT_POLICY, TEAM_SIZE,
  type PolicyParams, type TeamInfo, type TeamStyle,
} from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

// --- frozen parameters (contract §3, §4, §5) ---------------------------------
const HORIZON_S = 4.0;
const HORIZON_TICKS = Math.round(HORIZON_S / DT);
const SEED_START = 950_000;
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
const BOOTSTRAP_SEED = 50029;
/** §4.2: the NO-LEVER equivalence interval, carried with T2's derivation. */
const NO_LEVER_INTERVAL = 0.0232;
/** `actionExecutor.ts`'s own upstream offset, at every one of its sites. */
const MEET_UPSTREAM = 2.5;
/** X6's fidelity tolerance — the two sides are the same arithmetic. */
const X6_EPS = 1e-9;
const X6_FLOOR = 0.99;

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

interface X6Ledger {
  ok: number;
  eOnsideClamp: number;
  eBarredBox: number;
  eBecameCarrier: number;
  eBallWon: number;
  unexplained: number;
}

interface ArmOutcome {
  readonly klass: Klass;
  readonly rung: Rung;
  readonly contest: boolean;
  readonly atkContest: boolean;
  readonly goal: boolean;
  readonly shot: boolean;
  readonly bandTicks: number;
  readonly minOutfieldDistInBand: number;
  readonly minAtkDistInBand: number;
  readonly signature: string;
}

interface CrossRow {
  readonly cluster: number;
  /** Whether an eligible ADDITIONAL body existed — the arms differ only then. */
  readonly eligible: boolean;
  readonly control: ArmOutcome;
  readonly forced: ArmOutcome;
}

const dist = (a: { x: number; y: number }, b: { x: number; y: number }): number =>
  Math.hypot(a.x - b.x, a.y - b.y);

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

const meetPointOf = (m: Match): { x: number; y: number } => {
  const land = ballLanding(m.ball);
  const vl = Math.hypot(m.ball.vel.x, m.ball.vel.y) || 1;
  return {
    x: land.x - (m.ball.vel.x / vl) * MEET_UPSTREAM,
    y: land.y - (m.ball.vel.y / vl) * MEET_UPSTREAM,
  };
};

/**
 * §2.2's eligible ADDITIONAL body, read on the fork just after the kick:
 * already licensed (`runners ∪ {arriver}`), not sent off, not the crosser,
 * NOT the registered pass target (who has carried the Phase-63 meet-point
 * re-route all along) and NOT a chaser (routed by `interceptBall` to the same
 * landing). Of the remainder, the one closest to the landing. Nobody new is
 * licensed and no count changes.
 */
const eligibleSecondBody = (m: Match, side: number): Player | null => {
  const t = m.teams[side];
  const receiverGid = m.pendingPass !== null && m.pendingPass.side === side
    ? m.pendingPass.targetGid : null;
  const idxs = new Set<number>(t.runners);
  if (t.arriver !== null) idxs.add(t.arriver);
  const land = ballLanding(m.ball);
  let best: Player | null = null;
  let bd = Infinity;
  for (const idx of [...idxs].sort((a, b) => a - b)) {
    const p = t.players[idx];
    if (p.sentOff || p.role === 'GK') continue;
    if (p === m.ball.lastTouch) continue;
    if (receiverGid !== null && p.gid === receiverGid) continue;
    if (t.chasers.has(idx)) continue;
    const d = Math.hypot(p.pos.x - land.x, p.pos.y - land.y);
    if (d < bd) { bd = d; best = p; }
  }
  return best;
};

/** Run ONE fork from the pre-kick clone over the FIXED horizon. */
const runArm = (
  before: Match, force: boolean, side: number, x6: X6Ledger,
): { outcome: ArmOutcome; eligible: boolean } | null => {
  const fork = cloneSimulationState(before);
  const attacking = fork.teams[side];
  const defending = fork.teams[1 - side];
  const crosses0 = attacking.stats.crosses;
  const goals0 = attacking.stats.goals;
  const shots0 = attacking.stats.shots;
  const ah0 = attacking.stats.headersWon;
  const dh0 = defending.stats.headersWon;

  fork.step(DT); // the kick tick — identical in both arms, the seam is not set yet
  if (attacking.stats.crosses <= crosses0) return null;
  const kickTick = fork.simTick;
  const crosser = fork.ball.lastTouch;
  const second = eligibleSecondBody(fork, side);
  const untilTick = kickTick + Math.round(ballLanding(fork.ball).t / DT);

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
  while (!fork.finished && fork.simTick - kickTick < HORIZON_TICKS) {
    // The force is re-aimed every tick while the delivery is above control
    // height — the meet point moves with the flight, exactly as the engine's
    // own three sites recompute it.
    let expected: { x: number; y: number } | null = null;
    if (
      // `stepCount++` is the FIRST thing `Match.step` does, so the executor
      // sees `simTick + 1`. Comparing the pre-step value would predict a fire
      // on the last tick that the engine then declines — one unexplained
      // record per delivery, which the smoke duly produced.
      force && second !== null && fork.simTick + 1 < untilTick
      && fork.ball.owner === null && fork.ball.z > CONTROL_MAX_HEIGHT
      && !second.sentOff
    ) {
      expected = meetPointOf(fork);
      fork.forcedStation = { gid: second.gid, target: expected, untilTick };
    } else {
      fork.forcedStation = null;
    }
    const ownerBefore = fork.ball.owner;
    fork.step(DT);
    if (expected !== null) {
      // X6, per record with NAMED exception classes (#32.1).
      const tr = second!.c4Trace;
      if (tr === null) {
        if (ownerBefore === second) x6.eBecameCarrier += 1;
        else if (fork.ball.owner !== null) x6.eBallWon += 1;
        else x6.unexplained += 1;
      } else if (
        Math.abs(tr.applied.x - expected.x) <= X6_EPS
        && Math.abs(tr.applied.y - expected.y) <= X6_EPS
      ) x6.ok += 1;
      else {
        const r = fork.restart;
        const barred = (r?.kind === 'goalKick' && r.side !== side)
          || defending.goalkeeper.gkHoldTimer > 0 || defending.goalkeeper.gkDistributing;
        if (barred) x6.eBarredBox += 1;
        else if (fork.ball.owner !== null && fork.ball.owner.side === side) x6.eOnsideClamp += 1;
        else x6.unexplained += 1;
      }
    }
    read();
  }
  fork.forcedStation = null;

  const ah = attacking.stats.headersWon - ah0;
  const dh = defending.stats.headersWon - dh0;
  const metByAttacker = inRadius || atkTouch;
  const klass: Klass = ah > 0 ? 'C3atk'
    : dh > 0 ? 'C3def'
      : !arrived ? 'C0'
        : metByAttacker ? 'C2' : 'C1';
  return {
    eligible: second !== null,
    outcome: {
      klass,
      rung: rungOf({ bandTicks, terminalByGk, terminalOutfield, terminalZ, minOutfieldDistInBand }),
      contest: klass === 'C3atk' || klass === 'C3def',
      atkContest: klass === 'C3atk',
      goal: attacking.stats.goals > goals0,
      shot: attacking.stats.shots > shots0,
      bandTicks,
      minOutfieldDistInBand,
      minAtkDistInBand,
      signature: signatureOf(fork),
    },
  };
};

interface ComboResult {
  rows: CrossRow[];
  crossesSeen: number;
  crossesWithClone: number;
  armMissing: number;
}

const harvestCombo = (
  atk: Atk, shell: Shell, seedStart: number, matchBudget: number, x6: X6Ledger,
): ComboResult => {
  const rows: CrossRow[] = [];
  let crossesSeen = 0;
  let crossesWithClone = 0;
  let armMissing = 0;

  for (let k = 0; k < matchBudget; k++) {
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
        crossesSeen += 1;
        if (clone === null || clone.simTick !== preTick) continue;
        crossesWithClone += 1;
        const control = runArm(clone, false, 0, x6);
        const forced = runArm(clone, true, 0, x6);
        if (control === null || forced === null) { armMissing += 1; continue; }
        rows.push({
          cluster: k, eligible: forced.eligible,
          control: control.outcome, forced: forced.outcome,
        });
      }
    }
  }
  return { rows, crossesSeen, crossesWithClone, armMissing };
};

/** X5: the CONTROL fork must reproduce the base continuation bit-identically. */
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
        const plain = cloneSimulationState(clone);
        for (let i = 0; i <= HORIZON_TICKS && !plain.finished; i++) plain.step(DT);
        const ledger: X6Ledger = {
          ok: 0, eOnsideClamp: 0, eBarredBox: 0, eBecameCarrier: 0, eBallWon: 0, unexplained: 0,
        };
        const control = runArm(clone, false, 0, ledger);
        checked += 1;
        if (control === null || control.outcome.signature !== signatureOf(plain)) mismatched += 1;
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
    : mean(rs.map((r) => pick(r.forced) - pick(r.control))));
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

const armSummary = (rows: readonly CrossRow[], side: 'control' | 'forced') => {
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
    h3ShareOfAll: sh((o) => o.rung === 'H3noContenderAtHeight'),
    minAtkInBandMedian: round(quantile(arms.map((o) => o.minAtkDistInBand).filter(Number.isFinite), 0.5), 4),
    minOutInBandMedian: round(quantile(arms.map((o) => o.minOutfieldDistInBand).filter(Number.isFinite), 0.5), 4),
  };
};

const runExperiment = () => {
  const x6: X6Ledger = {
    ok: 0, eOnsideClamp: 0, eBarredBox: 0, eBecameCarrier: 0, eBallWon: 0, unexplained: 0,
  };
  const pooled: CrossRow[] = [];
  const combos: { tag: string; result: ComboResult }[] = [];
  let comboIndex = 0;
  for (const atk of attackers) {
    for (const shell of shells) {
      const tag = `${atk.tag} vs ${shell.tag}`;
      const result = harvestCombo(atk, shell, SEED_START + comboIndex * COMBO_SEED_STRIDE,
        MATCH_BUDGET[tag]!, x6);
      combos.push({ tag, result });
      const offset = (comboIndex + 1) * 10_000;
      for (const r of result.rows) pooled.push({ ...r, cluster: r.cluster + offset });
      comboIndex += 1;
    }
  }
  const harness = harnessCheck(attackers[0], shells[0], SEED_START, 40);

  const crossesSeen = combos.reduce((s, c) => s + c.result.crossesSeen, 0);
  const crossesWithClone = combos.reduce((s, c) => s + c.result.crossesWithClone, 0);
  const armMissing = combos.reduce((s, c) => s + c.result.armMissing, 0);

  // §4.2: PRIMARY is all crosses with an eligible second body.
  const eligible = pooled.filter((r) => r.eligible);
  // §4.3: the H3 subgroup, defined on the CONTROL arm, REPORTED not primary.
  const h3 = eligible.filter((r) => r.control.rung === 'H3noContenderAtHeight');

  const d1 = pairedCI(eligible, (o) => (o.atkContest ? 1 : 0), 1);
  const contests = pairedCI(eligible, (o) => (o.contest ? 1 : 0), 2);
  const c3def = pairedCI(eligible, (o) => (o.klass === 'C3def' ? 1 : 0), 3);
  const goal = pairedCI(eligible, (o) => (o.goal ? 1 : 0), 4);
  const shot = pairedCI(eligible, (o) => (o.shot ? 1 : 0), 5);
  const h3Share = pairedCI(eligible, (o) => (o.rung === 'H3noContenderAtHeight' ? 1 : 0), 6);
  const minAtk = pairedCI(eligible.filter((r) => (
    Number.isFinite(r.control.minAtkDistInBand) && Number.isFinite(r.forced.minAtkDistInBand)
  )), (o) => o.minAtkDistInBand, 7);
  const h3D1 = pairedCI(h3, (o) => (o.atkContest ? 1 : 0), 8);
  const h3Contest = pairedCI(h3, (o) => (o.contest ? 1 : 0), 9);

  const verdict = d1.lower > 0 ? 'LEVER'
    : (d1.lower > -NO_LEVER_INTERVAL && d1.upper < NO_LEVER_INTERVAL) ? 'NO LEVER'
      : 'UNRESOLVED';

  const x6Total = x6.ok + x6.eOnsideClamp + x6.eBarredBox + x6.eBecameCarrier
    + x6.eBallWon + x6.unexplained;
  const gates = {
    x4CloneCoverage: crossesSeen > 0 && crossesWithClone === crossesSeen,
    x5HarnessIdentity: harness.checked > 0 && harness.mismatched === 0,
    x6ForceBites: x6Total > 0 && x6.unexplained === 0 && x6.ok / x6Total >= X6_FLOOR,
  };

  return {
    experiment: 'C4-O2 (second-body station fork)',
    authority: 'C4-O2-SECOND-BODY-FORK',
    parameters: {
      seedStart: SEED_START, comboSeedStride: COMBO_SEED_STRIDE,
      matchBudget: MATCH_BUDGET, horizonSeconds: HORIZON_S,
      noLeverInterval: NO_LEVER_INTERVAL, meetUpstream: MEET_UPSTREAM,
      clusterUnit: 'match seed (disjoint per combination)',
      goalEstimand: 'ANY goal by the crossing side inside the fixed horizon',
      primaryPopulation: 'all crosses with an eligible second body (§4.2)',
      h3Note: 'H3 is a CONTROL-arm outcome; reported, never primary (§4.3)',
    },
    coverage: {
      crossesSeen, crossesWithClone, armMissing,
      cloneCoverage: crossesSeen === 0 ? Number.NaN : round(crossesWithClone / crossesSeen),
      pairedRows: pooled.length,
      eligibleRows: eligible.length,
      noSecondBodyShare: pooled.length === 0 ? Number.NaN
        : round(1 - eligible.length / pooled.length),
      h3Rows: h3.length,
      harness,
    },
    x6: { ...x6, total: x6Total, okShare: x6Total === 0 ? Number.NaN : round(x6.ok / x6Total) },
    arms: { control: armSummary(eligible, 'control'), forced: armSummary(eligible, 'forced') },
    primary: { statistic: 'C3atk share, paired per-cross', ...d1 },
    reported: {
      contests, c3def, goal, shot, h3Share, minAtkInBand: minAtk,
      h3Subgroup: { atkContest: h3D1, contest: h3Contest },
    },
    decision: { rule: 'LEVER / NO LEVER / UNRESOLVED, frozen in contract §4.2', verdict },
    gates,
  };
};

const first = runExperiment();
const second = runExperiment();
const canonical = (v: unknown): string => JSON.stringify(v);
const deterministic = canonical(first) === canonical(second);
const sha256 = createHash('sha256').update(canonical(first)).digest('hex');
const gates = { ...first.gates, x7Determinism: deterministic };
const output = { ...first, gates, sha256, verdict: Object.values(gates).every(Boolean) ? 'GATES PASS' : 'GATES FAIL' };
console.log(JSON.stringify(output, null, 2));

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const pp = (v: number) => `${(v * 100).toFixed(2)}pp`;
const failed = Object.entries(output.gates).filter(([, v]) => !v).map(([k]) => k);
console.error(
  `C4-O2 ${output.verdict} · DECISION ${output.decision.verdict}`
  + ` · crosses seen ${output.coverage.crossesSeen} cloned ${output.coverage.crossesWithClone}`
  + ` (coverage ${pct(output.coverage.cloneCoverage)}) paired ${output.coverage.pairedRows}`
  + ` eligible ${output.coverage.eligibleRows} (no-second-body ${pct(output.coverage.noSecondBodyShare)})`
  + ` · X5 harness ${output.coverage.harness.checked}/${output.coverage.harness.mismatched} mismatched`
  + ` · X6 ok ${output.x6.ok} (${pct(output.x6.okShare)}) carrier ${output.x6.eBecameCarrier}`
  + ` ballWon ${output.x6.eBallWon} onside ${output.x6.eOnsideClamp} barred ${output.x6.eBarredBox}`
  + ` UNEXPLAINED ${output.x6.unexplained}`
  + ` · D1 C3atk ${pct(output.arms.control.atkContest)}→${pct(output.arms.forced.atkContest)}`
  + ` = ${pp(output.primary.point)} CI[${pp(output.primary.lower)}, ${pp(output.primary.upper)}]`
  + ` · contests ${pp(output.reported.contests.point)} C3def ${pp(output.reported.c3def.point)}`
  + ` · ANY-goal ${pct(output.arms.control.goal)}→${pct(output.arms.forced.goal)} = ${pp(output.reported.goal.point)}`
  + ` · H3 of all ${pct(output.arms.control.h3ShareOfAll)}→${pct(output.arms.forced.h3ShareOfAll)}`
  + ` = ${pp(output.reported.h3Share.point)} CI[${pp(output.reported.h3Share.lower)}, ${pp(output.reported.h3Share.upper)}]`
  + ` · minAtk median ${output.arms.control.minAtkInBandMedian}→${output.arms.forced.minAtkInBandMedian} m`
  + ` (${output.reported.minAtkInBand.point})`
  + ` · H3 subgroup n${output.reported.h3Subgroup.atkContest.n} C3atk ${pp(output.reported.h3Subgroup.atkContest.point)}`
  + ` CI[${pp(output.reported.h3Subgroup.atkContest.lower)}, ${pp(output.reported.h3Subgroup.atkContest.upper)}]`
  + ` · failed [${failed.join(', ')}] · SHA ${sha256}`,
);
