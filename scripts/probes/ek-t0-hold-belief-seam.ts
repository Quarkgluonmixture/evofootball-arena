/**
 * EK T0 — THE DORMANT HOLD-BELIEF SEAM (docs/world-model/EK-T0-HOLD-BELIEF-SEAM.md).
 *
 * Contract EK-HOLD-EARNED-BELIEF-CONTRACT.md §2 (M-EK.1–.4), bound by #259.2, dispatched by
 * #261.4, governed by #261.3's four picks (W = 10 s · the MEASURED target shape · the dosed-hold
 * training-ground venue · the ZERO-CONSTANT comparative veto). Every gate below is FROZEN in the
 * stage doc's §GATES before this file ran; every number the doc publishes is quoted from this
 * probe's artifact.
 *
 * ⭐ THE #247 SPLIT IS THE LAW OF THE INSTRUMENT/CODE BOUNDARY: this probe may READ the committed
 * censuses (EK-C0's, EK-C0b's, DV-C0's) and the certified table — `src/**` may not, and G-NOTABLE
 * greps the whole tree for exactly that, on their own published values.
 *
 * ⭐ ENV SURFACE — WHITELISTED-OR-REFUSE (#261.2): the ONLY accepted variables are
 *   EKT0_MODE (smoke|full, REQUIRED) · EKT0_N · EKT0_SMOKE_N · EKT0_SKIP_FP · EKT0_OUT.
 * Any other `EKT0_*` variable is a FATAL refusal. Every override that changes WHAT IS MEASURED
 * sets the preflight flag, and a preflight may never write a canonical repo path (#260.2).
 *
 * RUN: EKT0_MODE=full npx tsx scripts/probes/ek-t0-hold-belief-seam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT } from '../../src/sim/constants';
import {
  EK_HOLD_BANDS, EK_HOLD_WINDOW_S, HoldAccountBook, HoldLabelLedger,
} from '../../src/ai/holdAccountBook';
import type { RecensusCostTable, WhetherEyeConfig } from '../../src/ai/whetherEye';
import { GENE_KEYS, randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS — every one of them TRACED                              */
/* ========================================================================== */
/** ⭐ INSTRUMENT-SIDE ONLY (#247): the probe may read the TRUE tables; `src/**` may not. */
const EKC0_PATH = 'docs/world-model/data/ek-c0-hold-outcome-census.json';
const EKC0B_PATH = 'docs/world-model/data/ek-c0b-inversion-diagnostic.json';
const DVC0_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';
const GGC_PATH = 'docs/world-model/data/goal-genealogy-census.json';
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';

/** THE DRILL WORLD = EK-C0's committed exam configuration, verbatim (its §TRACE (a)). */
const CENSUS_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false,
} as const;
const MATCH_DURATION = 240;
/** the census's own moment spacing and its dosed hold length (both read back in G-TRACE). */
const MOMENT_SPACING = 30;
const HOLD_K_TICKS = 30;
/**
 * ⭐ THE DRILL CADENCE, DERIVED not invented: a dose may only follow the previous hold's END
 * by the census's own moment spacing, i.e. `HOLD_K_TICKS + MOMENT_SPACING`. It must exceed the
 * hold length, because a body still under a drill takes the C5 early-return branch and the SEAT
 * never runs — with no seat decision there is no perceived band, and an unbanded hold is not
 * counted (§LAW). This is the training ground's tempo, and it is public-state only.
 */
const DRILL_SPACING = HOLD_K_TICKS + MOMENT_SPACING;

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ========================================================================== */
/* §2 ⭐ ENV — WHITELIST-OR-REFUSE (#261.2) + THE PREFLIGHT ROUTING (#260.2)    */
/* ========================================================================== */
const ENV_WHITELIST = ['EKT0_MODE', 'EKT0_N', 'EKT0_SMOKE_N', 'EKT0_SKIP_FP', 'EKT0_OUT'] as const;
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('EKT0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  console.error(`EK-T0 FATAL — unrecognised env override(s): ${rogue.join(', ')}. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse, #261.2).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.EKT0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`EK-T0 FATAL — EKT0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.EKT0_N);
const SMOKE_N_ENV = intEnv(process.env.EKT0_SMOKE_N);
const SKIP_FP = process.env.EKT0_SKIP_FP === '1';
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'EKT0_N', set: N_ENV !== null },
  { name: 'EKT0_SMOKE_N', set: SMOKE_N_ENV !== null },
  { name: 'EKT0_SKIP_FP', set: SKIP_FP },
];
/** ⭐ #260.2(i): EVERY override that changes WHAT IS MEASURED sets the preflight flag. MODE is
 *  NOT an override — each mode has its OWN canonical artifact, as the EK-C0 family does. */
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/ek-t0-hold-belief-seam-smoke.json',
  full: 'docs/world-model/data/ek-t0-hold-belief-seam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = process.env.EKT0_OUT
  ?? (IS_PREFLIGHT ? '/tmp/ek-t0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('EK-T0 FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 SEED LEDGER (#163)                                                       */
/* ========================================================================== */
const BLOCK = 12_450_000;
const N = N_ENV ?? (MODE === 'smoke' ? 2 : 12);
const CROSS_N = Math.min(N, 4);
const PREFIX_N = Math.min(N, 6);
const READ_BASE = 12_450_020;
const SMOKE_BASE = 12_450_100;
const SMOKE_N = SMOKE_N_ENV ?? (MODE === 'smoke' ? 2 : 20);

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  { name: 'OBM-T0 receipts (#228)', range: [12_424_000, 12_424_025] },
  { name: 'OBM-T1 smoke (#228.6/#230)', range: [12_424_026, 12_424_040] },
  { name: 'OBM-T1 guard band (#230)', range: [12_424_050, 12_424_099] },
  { name: 'OBM-T1 battery + reserve (#230)', range: [12_424_100, 12_424_899] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
  { name: 'PTP-T0 receipts (#232)', range: [12_425_000, 12_425_025] },
  { name: 'PTP-T1 smoke (#232.3/#233)', range: [12_425_026, 12_425_040] },
  { name: 'PTP-T1 guard band (#233)', range: [12_425_050, 12_425_099] },
  { name: 'PTP-T1 battery + reserve (#233/#234)', range: [12_425_100, 12_425_727] },
  { name: 'PTP-T0 test-file seeds (#232)', range: [12_425_900, 12_425_906] },
  { name: 'DLC-T0 receipts (#237)', range: [12_426_000, 12_426_025] },
  { name: 'DLC-T1 smoke (#238)', range: [12_426_030, 12_426_045] },
  { name: 'DLC-T1 guard band (#238)', range: [12_426_050, 12_426_099] },
  { name: 'DLC-T1 battery + reserve (#238/#239)', range: [12_426_100, 12_426_727] },
  { name: 'DLC-T0 test-file seeds (#237)', range: [12_426_900, 12_426_906] },
  { name: 'DLC-T0s receipts (#242)', range: [12_427_000, 12_427_025] },
  { name: 'DLC-T0s test-file seeds (#242)', range: [12_427_900, 12_427_906] },
  { name: 'DLC-T1s smoke + reads (#243)', range: [12_428_000, 12_428_020] },
  { name: 'DLC-T1s guard band (#243)', range: [12_428_050, 12_428_099] },
  { name: 'DLC-T1s battery + reserve (#243/#244)', range: [12_428_100, 12_428_727] },
  { name: 'DLC-T1s reserved test-seed band (#243)', range: [12_428_900, 12_428_906] },
  { name: 'DV-C0 smoke (#249)', range: [12_429_000, 12_429_011] },
  { name: 'DV-C0 guard band (#249)', range: [12_429_050, 12_429_099] },
  { name: 'DV-C0 census + reserve (#249)', range: [12_429_100, 12_429_899] },
  { name: 'DV-C0 G-WORLD read (#249)', range: [12_429_999, 12_429_999] },
  { name: 'DV-T0 receipts + reads (#250)', range: [12_430_000, 12_430_026] },
  { name: 'DV-T1 smoke + guard + battery (#251)', range: [12_430_027, 12_430_382] },
  { name: 'DV-T0 test-file seeds (#250)', range: [12_430_900, 12_430_911] },
  { name: 'DV-T1b smoke + guard + battery (#252)', range: [12_431_000, 12_431_742] },
  { name: 'DV-T1b reserved ceiling (#251.2)', range: [12_431_900, 12_431_999] },
  { name: 'DV-T1c smoke + guard + battery (#253/#254)', range: [12_432_000, 12_434_035] },
  { name: 'DV-T1c reserved ceiling (#253.1)', range: [12_435_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: 'DV-T2-T1 convergence exam + battery (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
  {
    name: '⭐⭐ EK-C0 census band (#259.3/#260.4) — THE BLOCK THIS STAGE RE-WALKS',
    range: [12_448_000, 12_448_999],
  },
  { name: '⭐ EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
];

/* ========================================================================== */
/* §4 SMALL HELPERS                                                            */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkValue = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkValue);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkValue(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkValue(v));
};
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };

/* ========================================================================== */
/* §5 THE TWO WORLD SHAPES                                                     */
/* ========================================================================== */
const team = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};

/* --- the injected certified table (NEVER bundled in src — the P2 convention) ---------- */
const tableRaw = JSON.parse(readFileSync(TABLE_PATH, 'utf8'));
if (tableRaw.tableSha !== EXPECTED_TABLE_SHA) {
  console.error(`EK-T0 FATAL — certified table SHA drift: ${tableRaw.tableSha}`);
  process.exit(2);
}
const tableParams = tableRaw.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: tableParams.pressureBands, staleBands: tableParams.staleBands,
  supportCuts: tableParams.supportCuts, supportWindowM: tableParams.supportWindowM,
  cells: tableRaw.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper,
      reachesZero: k.reachesZero,
    })),
  })),
};
const EYE_CONFIG: WhetherEyeConfig = { arm: 'neutral', scope: { kind: 'both' }, table: TABLE };
/** the cells the certified table LICENSES — the no-subsidy reference (R-B, #64.1). */
const LICENSED_CELLS = new Set(
  TABLE.cells.filter((c) => c.costs.some((k) => k.reachesZero))
    .map((c) => `${c.pressureBand}|${c.staleBand}|${c.supportBand}`),
);

interface Arm {
  /** flag omitted entirely (`absent`) vs explicitly false vs true. */
  learn: 'absent' | false | true;
  veto?: boolean;
  /** the DRILL WORLD: EK-C0's exam flags + the armed seat + the dosed drill. */
  drillWorld?: boolean;
  /** the three components of the drill world, separable for G-CROSS. */
  censusFlags?: boolean;
  eye?: boolean;
  drill?: boolean;
  books?: readonly [HoldAccountBook, HoldAccountBook];
}

const matchOf = (seed: number, a: Arm): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...((a.censusFlags ?? a.drillWorld === true) ? { duration: MATCH_DURATION, ...CENSUS_FLAGS } : {}),
    ...(a.learn === 'absent' ? {} : { ekHoldLearn: a.learn }),
    ...(a.learn === true && a.books !== undefined ? { ekHoldBooks: a.books } : {}),
    ...(a.veto === true ? { ekHoldVeto: true } : {}),
  });
  const eye = a.eye ?? a.drillWorld === true;
  if (eye) m.whetherEye = EYE_CONFIG;
  return m;
};

/**
 * ⭐ THE TRAINING-GROUND DRILL DRIVER (#261.3(iii)) — ONE definition, used by EVERY loop in
 * this probe (identity, label, prefix, rng, smoke), so no arm can drift from another.
 *
 * It reads PUBLIC STATE ONLY — the ball owner, his role/sent-off status, his decision timer,
 * the phase and a tick spacing — which is what makes the drill a property of the WORLD rather
 * than of the learning door: an armed arm and an off arm dose exactly the same holds.
 *
 * ⭐ TWO-PHASE, and that is the load-bearing design: a body already under a drill takes the C5
 * early-return branch and the SEAT never runs, so a dose fired at the decision moment itself
 * would carry a band placed many ticks earlier. The driver therefore ARMS at a decision moment
 * (tick T — the seat prices the hold during that step and records its band) and DOSES on the
 * NEXT tick (T+1), so the drill displaces the decision the seat has just priced and the band
 * lag is exactly ONE tick. A dose that cannot land on the same body is abandoned.
 */
class DrillDriver {
  private since = DRILL_SPACING;

  private pending: number | null = null;

  /** called immediately BEFORE every `m.step(DT)`. */
  preStep(m: Match): void {
    this.since += 1;
    if (m.forcedHold !== null && m.simTick >= m.forcedHold.untilTick) m.forcedHold = null;
    const owner: Player | null = m.ball.owner;
    if (m.phase !== 'playing' || owner === null || owner.role === 'GK' || owner.sentOff
      || m.forcedHold !== null) {
      this.pending = null;
      return;
    }
    if (this.pending !== null && owner.gid === this.pending) {
      m.forcedHold = { gid: owner.gid, untilTick: m.simTick + HOLD_K_TICKS };
      this.pending = null;
      this.since = 0;
      return;
    }
    this.pending = owner.decisionTimer <= 0 && this.since >= DRILL_SPACING ? owner.gid : null;
  }
}

const runMatch = (m: Match, drill: boolean): void => {
  const driver = new DrillDriver();
  while (!m.finished) {
    if (drill) driver.preStep(m);
    m.step(DT);
  }
};

/** The whole-match signature, INCLUDING the rng stream state (the banked form). */
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));
const walk = (seed: number, a: Arm): string => {
  const m = matchOf(seed, a);
  runMatch(m, a.drill ?? a.drillWorld === true);
  return signature(m);
};
/** a cheap per-tick state read for the lockstep prefix comparison (no hashing). */
const tickState = (m: Match): number => {
  let s = (m.rng as unknown as { s: number }).s + m.score[0] * 1e7 + m.score[1] * 1e9;
  s += m.ball.pos.x * 1e3 + m.ball.pos.y * 1e5;
  for (const p of m.allPlayers) s += p.pos.x + p.pos.y * 3 + p.vel.x * 7;
  return s;
};
/** every commitment the armed seat made in a run — the NO-SUBSIDY read (public state). */
const holdCellsOf = (m: Match): string[] => [...m.whetherHoldState.values()].map((c) => c.cellAtDecision);

/* ========================================================================== */
/* §6 ⭐⭐ G-LABEL — EK-C0's OWN SEMANTICS, re-implemented probe-side           */
/* ========================================================================== */
interface LabelMutant {
  lossNeverCloses?: boolean;
  windowS?: number;
  deadBallIsLoss?: boolean;
  loserIsEitherTeam?: boolean;
}
/**
 * The independent re-labelling: EK-C0's segment walker (a maximal same-team control interval
 * while `phase === 'playing'`, suspended while loose, ended by the opponent establishing
 * control — a LOSS — or by the ball going dead, which is NOT a loss), and its window rule
 * applied to the SAME trajectory the in-world book filled. Returns per-team per-band cells.
 *
 * ⚠ It walks the SAME match object the book is filling, so this compares two ACCOUNTS of one
 * trajectory, not two worlds. Coverage set (stated): the loss closure, the window, the
 * dead-ball sub-rule and the loser's identity — one mutant each, every one RE-INVOKING this
 * function and the same cell comparison.
 */
function reLabel(seed: number, mut: LabelMutant = {}): {
  cells: { side: number; band: number; holds: number; punished: number }[];
  books: readonly [HoldAccountBook, HoldAccountBook];
  holds: number; losses: number; punished: number; ledger: HoldLabelLedger;
} {
  const books: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
  const m = matchOf(seed, { learn: true, drillWorld: true, books });
  const W = mut.windowS ?? EK_HOLD_WINDOW_S;
  const losses: { tSim: number; loser: number }[] = [];
  let cur: number | null = null;
  const observe = (): void => {
    if (m.phase !== 'playing') {
      if (cur !== null && mut.deadBallIsLoss === true) losses.push({ tSim: m.simTime, loser: cur });
      cur = null;
      return;
    }
    const owner = m.ball.owner;
    if (owner === null) return;
    if (cur !== null && cur !== owner.side && mut.lossNeverCloses !== true) {
      losses.push({ tSim: m.simTime, loser: cur });
    }
    cur = owner.side;
  };
  const driver = new DrillDriver();
  while (!m.finished) {
    observe();
    driver.preStep(m);
    m.step(DT);
  }
  observe();

  const ledger = m.ekHold!;
  const cells = ([0, 1] as const).flatMap((side) => Array.from(
    { length: EK_HOLD_BANDS }, (_x, band) => ({ side, band, holds: 0, punished: 0 }),
  ));
  let punished = 0;
  for (const h of ledger.noted) {
    const c = cells[h.side * EK_HOLD_BANDS + h.band];
    c.holds += 1;
    // THE FIRST loss by the holding team after the hold, and the window test on it.
    let first: number | null = null;
    for (const l of losses) {
      if (l.tSim < h.tSim) continue;
      if (mut.loserIsEitherTeam !== true && l.loser !== h.side) continue;
      first = l.tSim; break;
    }
    if (first !== null && first <= h.tSim + W) { c.punished += 1; punished += 1; }
  }
  return { cells, books, holds: ledger.noted.length, losses: losses.length, punished, ledger };
}
/** ⭐ the ONE comparison every G-LABEL claim and every mutant RE-INVOKES (#260.2). */
const labelMismatches = (r: ReturnType<typeof reLabel>): number => {
  let n = 0;
  for (const c of r.cells) {
    if (r.books[c.side].holds[c.band] !== c.holds) n++;
    if (r.books[c.side].punished[c.band] !== c.punished) n++;
  }
  return n;
};

/* ========================================================================== */
/* §7 THE RECEIPTS CORE (run TWICE for G-DET)                                  */
/* ========================================================================== */
const SEEDS = Array.from({ length: N }, (_, i) => BLOCK + i);
const SHAPES = [
  { tag: 'bare', arm: {} as Partial<Arm> },
  { tag: 'drill', arm: { drillWorld: true } as Partial<Arm> },
] as const;

function receipts(): Record<string, unknown> {
  /* ---- G-OFF / G-BORN ---------------------------------------------------- */
  const offBorn = SEEDS.map((seed) => {
    const row: Record<string, unknown> = { seed };
    for (const shape of SHAPES) {
      const off = walk(seed, { learn: 'absent', ...shape.arm });
      const flagFalse = walk(seed, { learn: false, ...shape.arm });
      const books: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
      const lm = matchOf(seed, { learn: true, books, ...shape.arm });
      runMatch(lm, shape.arm.drillWorld === true);
      const learnOnly = signature(lm);
      const led = lm.ekHold!;
      row[shape.tag] = {
        gOff: off === flagFalse,
        gBorn: off === learnOnly,
        labelsClosed: led.closedLabels,
        filledCells: books.reduce((n, b) => n + b.holds.filter((h) => h > 0).length, 0),
        takes: led.takeHolds, drills: led.drillHolds, unbanded: led.drillHoldsUnbanded,
        bookTotal: books[0].total + books[1].total,
        holdCellsLicensed: holdCellsOf(lm).every((c) => LICENSED_CELLS.has(c)),
        bandLagMax: led.noted.reduce((mx, h) => Math.max(mx, h.bandLagTicks), 0),
        unseen: led.drillHoldsUnseen, stale: led.drillHoldsStale,
        staleMaxTicks: led.drillStaleMaxTicks, placements: led.seatPlacements,
      };
    }
    return row;
  });
  const shapeRow = (r: Record<string, unknown>, tag: string): Record<string, number | boolean> =>
    r[tag] as Record<string, number | boolean>;
  const gOff = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gOff === true));
  const gBornIdentical = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gBorn === true));
  const gBornLive = offBorn.every((r) => (shapeRow(r, 'drill').labelsClosed as number) > 0
    && (shapeRow(r, 'drill').filledCells as number) > 0);
  const gBorn = gBornIdentical && gBornLive;

  /* ---- ⭐ G-BAND — the index is the SEAT'S, and it is FRESH ---------------- */
  const bandRows = offBorn.map((r) => shapeRow(r, 'drill'));
  const gBandRows = {
    everyCountedHoldIsFresh: bandRows.every((r) => (r.bandLagMax as number) <= 1),
    maxLagTicks: Math.max(...bandRows.map((r) => r.bandLagMax as number)),
    placementsNonVacuous: bandRows.every((r) => (r.placements as number) > 0),
    countedHolds: bandRows.reduce((n, r) => n + (r.takes as number) + (r.drills as number), 0),
    refusedUnseen: bandRows.reduce((n, r) => n + (r.unseen as number), 0),
    refusedStale: bandRows.reduce((n, r) => n + (r.stale as number), 0),
    widestRefusedStalenessTicks: Math.max(...bandRows.map((r) => r.staleMaxTicks as number)),
  };
  const gBand = gBandRows.everyCountedHoldIsFresh && gBandRows.placementsNonVacuous
    && gBandRows.countedHolds > 0;

  /* ---- ⭐⭐ G-VETO — the pre-registered form, swept ----------------------- */
  const vetoBooks: { h: number[]; p: number[] }[] = [];
  for (let h0 = 0; h0 <= 3; h0++) for (let p0 = 0; p0 <= h0; p0++) {
    for (let h1 = 0; h1 <= 3; h1++) for (let p1 = 0; p1 <= h1; p1++) {
      for (let h2 = 0; h2 <= 3; h2++) for (let p2 = 0; p2 <= h2; p2++) {
        vetoBooks.push({ h: [h0, h1, h2], p: [p0, p1, p2] });
      }
    }
  }
  type VetoRef = (h: readonly number[], p: readonly number[], b: number) => boolean;
  /** the INDEPENDENT re-derivation, in floats: belief[b] > pooled other-band rate. */
  const refVeto: VetoRef = (h, p, b) => {
    if (h[b] === 0) return false;
    let oh = 0; let op = 0;
    for (let i = 0; i < EK_HOLD_BANDS; i++) { if (i === b) continue; oh += h[i]; op += p[i]; }
    if (oh === 0) return false;
    return p[b] / h[b] > op / oh;
  };
  /** ⭐ the ONE sweep every claim and every mutant RE-INVOKES (#260.2). */
  const vetoSweep = (ref: VetoRef): number => {
    let mismatches = 0;
    for (const bk of vetoBooks) {
      const book = new HoldAccountBook();
      for (let b = 0; b < EK_HOLD_BANDS; b++) {
        for (let k = 0; k < bk.h[b]; k++) book.note(b, k < bk.p[b]);
      }
      for (let b = 0; b < EK_HOLD_BANDS; b++) {
        if (book.declinesHold(b) !== ref(bk.h, bk.p, b)) mismatches++;
      }
    }
    return mismatches;
  };
  const vetoMutants = ([
    { name: 'tie flips (>= instead of >)', ref: ((h, p, b) => {
      if (h[b] === 0) return false;
      let oh = 0; let op = 0;
      for (let i = 0; i < EK_HOLD_BANDS; i++) { if (i === b) continue; oh += h[i]; op += p[i]; }
      if (oh === 0) return false;
      return p[b] / h[b] >= op / oh;
    }) as VetoRef },
    { name: 'cross-band guard dropped', ref: ((h, p, b) => {
      if (h[b] === 0) return false;
      let oh = 0; let op = 0;
      for (let i = 0; i < EK_HOLD_BANDS; i++) { if (i === b) continue; oh += h[i]; op += p[i]; }
      return p[b] / h[b] > (oh === 0 ? 0 : op / oh);
    }) as VetoRef },
    { name: 'reference is the BEST other band (not the pooled one)', ref: ((h, p, b) => {
      if (h[b] === 0) return false;
      let best: number | null = null;
      for (let i = 0; i < EK_HOLD_BANDS; i++) {
        if (i === b || h[i] === 0) continue;
        const r = p[i] / h[i];
        if (best === null || r < best) best = r;
      }
      if (best === null) return false;
      return p[b] / h[b] > best;
    }) as VetoRef },
  ] as const).map((mut) => ({ name: mut.name, mismatches: vetoSweep(mut.ref) }));
  /** ⭐ ATTEMPTED AND REPORTED AS NOT LIVE (#256.2's coverage discipline, on my own gate): a
   *  reference pooled over the WHOLE book instead of the OTHER bands is ALGEBRAICALLY the same
   *  predicate (the total rate is a weighted average of this band's and the other bands'), so it
   *  cannot be a mutant. Stated, not folded into the live-mutant claim. */
  const vetoMutantsNotLive = [{
    name: 'reference is the WHOLE book (algebraically identical — NOT a distinct conjunct)',
    mismatches: vetoSweep(((h, p, b) => {
      if (h[b] === 0) return false;
      const th = h[0] + h[1] + h[2]; const tp = p[0] + p[1] + p[2];
      let oh = 0;
      for (let i = 0; i < EK_HOLD_BANDS; i++) { if (i === b) continue; oh += h[i]; }
      if (oh === 0) return false;
      return p[b] / h[b] > tp / th;
    }) as VetoRef),
  }];
  const emptyBook = new HoldAccountBook();
  const oneBandBook = new HoldAccountBook();
  for (let i = 0; i < 5; i++) oneBandBook.note(0, i < 4);
  const tieBook = new HoldAccountBook();
  tieBook.note(0, true); tieBook.note(0, false); tieBook.note(1, true); tieBook.note(1, false);
  const worstBook = new HoldAccountBook();
  for (let i = 0; i < 4; i++) worstBook.note(0, true);
  for (let i = 0; i < 4; i++) worstBook.note(2, i < 1);
  const bestBook = new HoldAccountBook();
  for (let i = 0; i < 4; i++) bestBook.note(0, i < 1);
  for (let i = 0; i < 4; i++) bestBook.note(2, true);
  const gVetoRows = {
    sweepExact: vetoSweep(refVeto) === 0,
    sweptBooks: vetoBooks.length,
    emptyDeclinesNothing: emptyBook.beliefVector() === null
      && [0, 1, 2].every((b) => !emptyBook.declinesHold(b)),
    oneBandDeclinesNothing: [0, 1, 2].every((b) => !oneBandBook.declinesHold(b)),
    tieDeclinesNothing: !tieBook.declinesHold(0) && !tieBook.declinesHold(1),
    worstBandDeclines: worstBook.declinesHold(0),
    bestBandDoesNot: !bestBook.declinesHold(0),
    outOfRangeSafe: !worstBook.declinesHold(-1) && !worstBook.declinesHold(EK_HOLD_BANDS),
    mutantsAllLive: vetoMutants.every((m) => m.mismatches > 0),
    /** ⭐ NO SUBSIDY (R-B, #64.1): every commitment in every arm sits in a licensed cell. */
    noSubsidy: offBorn.every((r) => shapeRow(r, 'drill').holdCellsLicensed === true),
  };
  const gVeto = Object.entries(gVetoRows)
    .filter(([k]) => k !== 'sweptBooks').every(([, v]) => v === true);

  /* ---- ⭐⭐ G-EMPTY (a) structural + (b) one-band ------------------------- */
  const gEmptyStructural = {
    emptyServesNull: emptyBook.beliefVector() === null,
    emptyTotalZero: emptyBook.total === 0,
    emptyDeclinesNothing: [0, 1, 2].every((b) => !emptyBook.declinesHold(b)),
    oneBandServesBelief: oneBandBook.beliefVector() !== null,
    oneBandDeclinesNothing: [0, 1, 2].every((b) => !oneBandBook.declinesHold(b)),
    widthHeld: emptyBook.holds.length === EK_HOLD_BANDS
      && emptyBook.punished.length === EK_HOLD_BANDS,
  };

  /* ---- ⭐⭐ G-EMPTY (c) PREFIX + G-BITE — the lockstep read --------------- */
  const prefix = SEEDS.slice(0, PREFIX_N).map((seed) => {
    const booksA: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
    const booksB: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
    const both = matchOf(seed, { learn: true, veto: true, drillWorld: true, books: booksA });
    const learnOnly = matchOf(seed, { learn: true, drillWorld: true, books: booksB });
    let firstVetoTick = -1; let firstDiffTick = -1; let tick = 0;
    const driverA = new DrillDriver(); const driverB = new DrillDriver();
    while (!both.finished && !learnOnly.finished) {
      driverA.preStep(both); driverB.preStep(learnOnly);
      both.step(DT); learnOnly.step(DT); tick++;
      if (firstVetoTick < 0 && both.ekHold!.vetoes > 0) firstVetoTick = tick;
      if (firstDiffTick < 0 && tickState(both) !== tickState(learnOnly)) firstDiffTick = tick;
      if (firstDiffTick >= 0 && firstVetoTick >= 0) break;
    }
    return {
      seed, firstVetoTick, firstDiffTick, vetoes: both.ekHold!.vetoes,
      /** ⭐ the identity claim: nothing moves before a veto has fired. */
      prefixHeld: firstDiffTick < 0 || (firstVetoTick > 0 && firstDiffTick >= firstVetoTick),
      prefixNonEmpty: firstVetoTick !== 1,
      diverged: firstDiffTick >= 0,
    };
  });
  const gEmpty = Object.values(gEmptyStructural).every(Boolean)
    && prefix.every((p) => p.prefixHeld && p.prefixNonEmpty);
  const gBite = prefix.some((p) => p.diverged && p.vetoes > 0);

  /* ---- ⭐⭐ G-LABEL ------------------------------------------------------ */
  const labelRows = SEEDS.map((seed) => {
    const r = reLabel(seed);
    return {
      seed, mismatches: labelMismatches(r),
      holds: r.holds, losses: r.losses, punished: r.punished,
      bookTotal: r.books[0].total + r.books[1].total,
      closedLabels: r.ledger.closedLabels,
      openAtEnd: r.ledger.openLabels,
      unbanded: r.ledger.drillHoldsUnbanded,
      bandLagMax: r.ledger.noted.reduce((mx, h) => Math.max(mx, h.bandLagTicks), 0),
    };
  });
  const labelTotals = labelRows.reduce((a, r) => ({
    mismatches: a.mismatches + r.mismatches, holds: a.holds + r.holds,
    losses: a.losses + r.losses, punished: a.punished + r.punished,
    unbanded: a.unbanded + r.unbanded,
  }), { mismatches: 0, holds: 0, losses: 0, punished: 0, unbanded: 0 });
  const mutantSeeds = SEEDS.slice(0, Math.min(N, 6));
  const labelMutants = ([
    { name: 'lossNeverCloses (the LOSS-closure conjunct)', mut: { lossNeverCloses: true } },
    { name: 'windowS=0 (the window conjunct)', mut: { windowS: 0 } },
    { name: 'deadBallIsLoss (the dead-ball sub-rule)', mut: { deadBallIsLoss: true } },
    { name: 'loserIsEitherTeam (the loser-identity conjunct)', mut: { loserIsEitherTeam: true } },
  ] as const).map(({ name, mut }) => {
    let mismatches = 0; let flippedOn = 0;
    for (const seed of mutantSeeds) {
      const m = labelMismatches(reLabel(seed, mut));
      mismatches += m;
      if (m > 0) flippedOn++;
    }
    return { name, seeds: mutantSeeds.length, mismatches, flippedOn, flipped: mismatches > 0 };
  });
  const gLabel = labelTotals.mismatches === 0 && labelTotals.punished > 0
    && labelMutants.every((m) => m.flipped);

  /* ---- G-BOOK ------------------------------------------------------------ */
  const bookProbe = new HoldAccountBook();
  const bookStream: { b: number; p: boolean }[] = [];
  const brng = new Rng(4242);
  for (let i = 0; i < 500; i++) {
    const b = Math.floor(brng.next() * EK_HOLD_BANDS) % EK_HOLD_BANDS;
    const p = brng.next() < 0.7;
    bookStream.push({ b, p });
    bookProbe.note(b, p);
  }
  const handCount = [0, 1, 2].map((b) => ({
    n: bookStream.filter((s) => s.b === b).length,
    k: bookStream.filter((s) => s.b === b && s.p).length,
  }));
  const bel = bookProbe.beliefVector() ?? [];
  const emptyBandBook = new HoldAccountBook();
  emptyBandBook.note(1, true);
  const gBookRows = {
    marginalExact: handCount.every((h, b) => bel[b] === (h.n > 0 ? h.k / h.n : 0)),
    countsExact: handCount.every((h, b) => bookProbe.holds[b] === h.n && bookProbe.punished[b] === h.k),
    punishedNeverExceeds: bookProbe.punished.every((k, b) => k <= bookProbe.holds[b]),
    totalIsSum: bookProbe.total === bookProbe.holds.reduce((a, b) => a + b, 0),
    widthHeld: bel.length === EK_HOLD_BANDS,
    zeroConstantOnEmptyBand: JSON.stringify(emptyBandBook.beliefVector()) === JSON.stringify([0, 1, 0]),
    outOfRangeNoted: (() => {
      const b = new HoldAccountBook(); b.note(9, true); return b.total === 0;
    })(),
  };
  const gBook = Object.values(gBookRows).every(Boolean);

  /* ---- ⭐ G-RESET -------------------------------------------------------- */
  const resetLeague = new League({ seed: READ_BASE });
  resetLeague.matchFlags = { ekHoldLearn: true };
  let resetMatches = 0;
  let sameObjects = true;
  while (!resetLeague.seasonDone && resetMatches < 6) {
    const f = resetLeague.nextFixture();
    if (f === undefined || f === null) break;
    const lm = resetLeague.createMatch(f);
    const books = resetLeague.holdBooks ?? [];
    if (lm.ekHold === null || lm.ekHold.books[0] !== books[f.home] || lm.ekHold.books[1] !== books[f.away]) {
      sameObjects = false;
    }
    resetLeague.applyResult(f, lm.runToCompletion());
    resetMatches++;
  }
  /** ⚠ DECLARED (§DEV 3): no League world arms the seat or doses drills, so the season's books
   *  can only FILL through a drill match that shares the very same book objects. */
  const seasonBooks = resetLeague.holdBooks ?? [];
  const drillPair: readonly [HoldAccountBook, HoldAccountBook] = [seasonBooks[0], seasonBooks[1]];
  const fillMatch = matchOf(READ_BASE + 1, { learn: true, drillWorld: true, books: drillPair });
  runMatch(fillMatch, true);
  const filledTotal = seasonBooks.reduce((n, b) => n + b.total, 0);
  const filledNonNull = seasonBooks.filter((b) => b.beliefVector() !== null).length;
  resetLeague.finishSeason();
  const afterBooks = resetLeague.holdBooks ?? [];
  const gResetRows = {
    unarmedLeagueAllocatesNothing: new League({ seed: READ_BASE + 9 }).holdBooks === null,
    armedLeagueAllocates: seasonBooks.length > 0,
    fixturesShareTheSeasonBooks: sameObjects,
    seasonFilled: filledTotal > 0 && filledNonNull > 0,
    wipedCounts: afterBooks.reduce((n, b) => n + b.total, 0) === 0,
    wipedBeliefs: afterBooks.every((b) => b.beliefVector() === null),
    wipedVetoes: afterBooks.every((b) => [0, 1, 2].every((x) => !b.declinesHold(x))),
  };
  const gReset = Object.values(gResetRows).every(Boolean);

  /* ---- ⭐ G-NOLAMARCK ---------------------------------------------------- */
  const lamJson = JSON.stringify(resetLeague.toJSON());
  const gNoLamarckRows = {
    franchiseGenomesClean: resetLeague.franchises.every((f) => {
      const g = f.coach.genome as unknown as Record<string, unknown>;
      return g.ekHoldBelief === undefined && g.holdBelief === undefined;
    }),
    matchGenomesClean: fillMatch.teams.every((t) => {
      const g = t.baseGenome as unknown as Record<string, unknown>;
      return g.ekHoldBelief === undefined && g.holdBelief === undefined;
    }),
    saveCarriesNothing: !lamJson.includes('ekHold') && !lamJson.includes('holdBelief')
      && !lamJson.includes('HoldAccountBook'),
    noNewGeneKey: !(GENE_KEYS as readonly string[]).some((k) => k.toLowerCase().includes('hold')),
  };
  const gNoLamarck = Object.values(gNoLamarckRows).every(Boolean);

  /* ---- G-RNG ------------------------------------------------------------- */
  const rngBooks: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
  const rngArmed = matchOf(READ_BASE + 2, { learn: true, drillWorld: true, books: rngBooks });
  const rngOff = matchOf(READ_BASE + 2, { learn: 'absent', drillWorld: true });
  let rngStatesEqual = true;
  const rngDriverA = new DrillDriver(); const rngDriverB = new DrillDriver();
  while (!rngArmed.finished && !rngOff.finished) {
    rngDriverA.preStep(rngArmed); rngDriverB.preStep(rngOff);
    rngArmed.step(DT); rngOff.step(DT);
    if ((rngArmed.rng as unknown as { s: number }).s !== (rngOff.rng as unknown as { s: number }).s) {
      rngStatesEqual = false; break;
    }
  }
  const ledgerFixture = matchOf(READ_BASE + 3, { learn: 'absent' });
  for (let i = 0; i < 400; i++) ledgerFixture.step(DT);
  const sBefore = (ledgerFixture.rng as unknown as { s: number }).s;
  const standalone: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
  const standaloneLedger = new HoldLabelLedger(standalone);
  for (let i = 0; i < 300; i++) {
    standaloneLedger.noteSeatBand(i % 4, i % EK_HOLD_BANDS, i);
    standaloneLedger.observeOwner(i % 2, i * 0.1);
    standaloneLedger.noteTakeHold(i % 2, i % EK_HOLD_BANDS, i * 0.1);
    standaloneLedger.noteDrillHold(i % 2, i % 4, i, i, i * 0.1);
    if (i % 23 === 0) standaloneLedger.observeDeadBall();
    standaloneLedger.expire(i * 0.1);
  }
  standaloneLedger.flush();
  const sAfter = (ledgerFixture.rng as unknown as { s: number }).s;
  const gRngRows = {
    armedStreamIdentical: rngStatesEqual,
    ledgerDrawsNothing: sBefore === sAfter,
    ledgerNonVacuous: standalone[0].total + standalone[1].total > 0,
    ledgerClosesEverything: standaloneLedger.openLabels === 0,
  };
  const gRng = Object.values(gRngRows).every(Boolean);

  return {
    offBorn, gOff, gBorn, gBornIdentical, gBornLive,
    gBandRows, gBand,
    gEmptyStructural, prefix, gEmpty, gBite,
    gVetoRows, vetoMutants, vetoMutantsNotLive, gVeto,
    labelRows, labelTotals, labelMutants, gLabel,
    gBookRows, gBook, bookBelief: bel.map((v) => round(v)),
    gResetRows, gReset, resetMatches, filledTotal,
    gNoLamarckRows, gNoLamarck,
    gRngRows, gRng, sBefore, sAfter,
  };
}

const tRunA = Date.now();
banner('  [ek-t0] receipts core run A...');
const runA = receipts();
const digestA = sha(canonical(runA));
banner(`  [ek-t0] run A digest ${digestA}\n  [ek-t0] G-DET second run...`);
const runB = receipts();
const digestB = sha(canonical(runB));
const gDet = digestA === digestB;
banner(`  [ek-t0] run B digest ${digestB} — G-DET ${gDet ? 'PASS' : 'FAIL'}`);
const receiptsMs = Date.now() - tRunA;

/* ========================================================================== */
/* §8 ⭐⭐ G-CROSS — THE DOORS MATRIX (two new doors × the banked seams)        */
/* ========================================================================== */
interface CrossCell { learn: boolean; veto: boolean; eye: boolean; drill: boolean }
const crossKey = (c: CrossCell): string =>
  `learn${c.learn ? 1 : 0}·veto${c.veto ? 1 : 0}·eye${c.eye ? 1 : 0}·drill${c.drill ? 1 : 0}`;
const crossCells: CrossCell[] = [];
for (const learn of [false, true]) for (const veto of [false, true]) {
  for (const eye of [false, true]) for (const drill of [false, true]) {
    crossCells.push({ learn, veto, eye, drill });
  }
}
const crossSeeds = SEEDS.slice(0, CROSS_N);
const crossSig: Record<number, Record<string, string>> = {};
for (const seed of crossSeeds) {
  crossSig[seed] = {};
  for (const c of crossCells) {
    crossSig[seed][crossKey(c)] = walk(seed, {
      learn: c.learn ? true : 'absent', veto: c.veto,
      censusFlags: true, eye: c.eye, drill: c.drill,
      books: c.learn ? [new HoldAccountBook(), new HoldAccountBook()] : undefined,
    });
  }
}
const cs = (seed: number, c: CrossCell): string => crossSig[seed][crossKey(c)];
const crossClaims = crossSeeds.map((seed) => {
  const base = cs(seed, { learn: false, veto: false, eye: false, drill: false });
  const seatDrill = cs(seed, { learn: false, veto: false, eye: true, drill: true });
  return {
    seed,
    /** (DORMANT-ALL) both doors armed with no seat (hence no band) ⇒ the incumbent world. */
    dormantAll: base === cs(seed, { learn: true, veto: true, eye: false, drill: false })
      && base === cs(seed, { learn: true, veto: false, eye: false, drill: false }),
    /** (A) learning armed beside the armed seat + the dosed drill ≡ those alone. */
    aNeighboursUnmoved: seatDrill === cs(seed, { learn: true, veto: false, eye: true, drill: true }),
    /** (B) the VETO door armed ALONE (no ledger, no book) is inert everywhere. */
    bVetoAloneInert: seatDrill === cs(seed, { learn: false, veto: true, eye: true, drill: true })
      && base === cs(seed, { learn: false, veto: true, eye: false, drill: false }),
    /** (INTERACTION) the seam bites ONLY with BOTH doors armed. */
    interactionNeedsBoth:
      cs(seed, { learn: true, veto: true, eye: true, drill: true }) !== seatDrill,
    /** ⭐ (DISCRIMINATION) a VETOED world is not a SEAT-OFF world. */
    discriminationNotSeatOff:
      cs(seed, { learn: true, veto: true, eye: true, drill: true })
      !== cs(seed, { learn: false, veto: false, eye: false, drill: true }),
    /** non-vacuity of the two banked neighbours this seam sits between. */
    seatBites: seatDrill !== cs(seed, { learn: false, veto: false, eye: false, drill: true }),
    drillBites: seatDrill !== cs(seed, { learn: false, veto: false, eye: true, drill: false }),
  };
});
/**
 * ⭐ THE SCORING, DECLARED: the IDENTITY claims must hold on EVERY seed; the BITE claims are
 * NON-VACUITY claims over the seed SET (a 240 s match need not contain a licensed take at all —
 * EK-C0 measured ≈ 4 live takes per match, and the drill occupies the holder besides), so they
 * are required on AT LEAST ONE seed and their per-seed counts are published.
 */
const CROSS_ALWAYS = ['dormantAll', 'aNeighboursUnmoved', 'bVetoAloneInert'] as const;
const CROSS_SETWISE = ['interactionNeedsBoth', 'discriminationNotSeatOff', 'seatBites', 'drillBites'] as const;
const crossAlways = crossClaims.every((r) => CROSS_ALWAYS.every((k) => r[k] === true));
const crossSetwise = Object.fromEntries(CROSS_SETWISE.map(
  (k) => [k, crossClaims.filter((r) => r[k] === true).length],
));
const gCross = crossAlways && CROSS_SETWISE.every((k) => (crossSetwise[k] as number) > 0);

/* ========================================================================== */
/* §9 G-IDENT / X-FP-PROD                                                      */
/* ========================================================================== */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
let gIdentRows: { seed: number; baseline: string; observed: string; identical: boolean }[] = [];
let gIdent = false; let xFpProd = false;
if (SKIP_FP) {
  gIdentRows = LEAGUE_IDENT_BASELINES.map((b) => ({
    seed: b.seed, baseline: b.baseline, observed: 'skipped (preflight)', identical: false,
  }));
} else {
  gIdentRows = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
    banner(`  [ek-t0] G-IDENT league seed ${seed}...`);
    const observed = leagueHash(seed);
    return { seed, baseline, observed, identical: observed === baseline };
  });
  gIdent = gIdentRows.every((r) => r.identical);
  xFpProd = gIdentRows[0].observed === FINGERPRINT_BASELINE;
}

/* ========================================================================== */
/* §10 SOURCE GATES: G-FORK / G-HYGIENE / G-EPI / G-NOTABLE / G-TRACE / G-PINS  */
/* ========================================================================== */
const srcFilesOf = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFilesOf(p);
  return p.endsWith('.ts') ? [p] : [];
});
const SRC = srcFilesOf('src');
const srcText = new Map(SRC.map((f) => [f, readFileSync(f, 'utf8')]));
const matchSrc = srcText.get('src/sim/Match.ts') ?? '';
const leagueSrc = srcText.get('src/sim/League.ts') ?? '';
const brainSrc = srcText.get('src/ai/PlayerBrain.ts') ?? '';
const bookSrc = srcText.get('src/ai/holdAccountBook.ts') ?? '';
const a4Src = srcText.get('src/game/a4World.ts') ?? '';
const countOf = (s: string, needle: string): number => s.split(needle).length - 1;

/* ---- G-FORK: every src occurrence of the seam's names, classed ------------- */
const SEAM_RE = /ekHoldLearn|ekHoldVeto|ekHoldBooks|ekHoldDeclines|ekHoldObserve|ekHold\b|HoldAccountBook|HoldLabelLedger|holdAccountBook|EK_HOLD_WINDOW_S|EK_HOLD_BANDS|ekBooksFor|holdBooks|noteSeatBand|noteTakeHold|noteDrillHold/;
const forkOccurrences: { file: string; line: number; text: string; cls: string }[] = [];
for (const [file, text] of srcText) {
  text.split('\n').forEach((line, i) => {
    if (!SEAM_RE.test(line)) return;
    const t = line.trim();
    let cls = 'unclassified';
    if (file === 'src/ai/holdAccountBook.ts') cls = "the book module's own body";
    else if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/')) cls = 'comment';
    else if (t.startsWith('import ')) cls = 'import';
    else if (/^this\.ekHold = this\.ekHoldLearn$/.test(t) || t.startsWith('this.ekHold = this.ekHoldLearn')) cls = '⭐ THE LEDGER FORK';
    else if (t.includes('this.matchFlags?.ekHoldLearn === true')) cls = '⭐ THE SEASON FORK';
    else if (t.startsWith('ekHoldDeclines(')) cls = '⭐ THE VETO FORK (the one consumption site)';
    else if (t.startsWith('if (!this.ekHoldVeto')) cls = 'the veto fork body';
    else if (/^(ekHoldLearn|ekHoldVeto|ekHoldBooks)\??:/.test(t)) cls = 'MatchConfig declaration';
    else if (/^readonly (ekHoldLearn|ekHoldVeto|ekHold):/.test(t)) cls = 'Match field declaration';
    else if (/^private ekHoldBooks/.test(t)) cls = 'League field declaration';
    else if (/^this\.(ekHoldLearn|ekHoldVeto) = cfg\./.test(t)) cls = 'constructor init';
    else if (t.includes("| 'ekHoldLearn' | 'ekHoldVeto'")) cls = 'League matchFlags union key';
    else if (t.startsWith('private ekBooksFor') || t.includes('this.ekHoldBooks = this.franchises')
      || t.includes('return [this.ekHoldBooks[home]') || t.includes('if (this.ekHoldBooks === null')) cls = 'League book allocator';
    else if (t.startsWith('get holdBooks(')) cls = 'League instrument getter';
    else if (t.includes('if (this.ekHoldBooks !== null')) cls = 'League season reset';
    else if (t.startsWith('for (const b of this.ekHoldBooks)')) cls = 'League season reset';
    else if (t.startsWith('private ekHoldObserve(')) cls = 'the observation method';
    else if (/^(const ledger = this\.ekHold;)$/.test(t)) cls = 'seat read inside a seam method';
    else if (t.includes('this.ekHold !== null')) cls = 'consumer site (the nullable seat test)';
    else if (t.includes('match.ekHold !== null')) cls = 'consumer site (the nullable seat test)';
    else if (t.includes('match.ekHold.noteDrillHold(') || t.includes('match.ekHold.noteSeatBand(')
      || t.includes('match.ekHold.noteTakeHold(')) cls = 'brain capture site';
    else if (t.includes('match.ekHoldDeclines(')) cls = 'the veto read at the seat';
    else if (t.includes('new HoldLabelLedger(') || t.includes('new HoldAccountBook()')) cls = 'the fork body (allocation)';
    else if (t.includes('ledger.noteDrillHold(') || t.includes('ledger.observeOwner(')
      || t.includes('ledger.observeDeadBall()') || t.includes('ledger.expire(')
      || t.includes('ledger.vetoes++') || t.includes('ledger.books[side]')) cls = 'the observation / veto method body';
    else if (t.includes('this.ekHold.flush()') || t.includes('this.ekHoldObserve()')) cls = 'consumer site (whistle / observation)';
    else if (t.includes('ekHoldBooks:')) cls = 'the season fork body';
    forkOccurrences.push({ file, line: i + 1, text: t.slice(0, 150), cls });
  });
}
const unclassified = forkOccurrences.filter((o) => o.cls === 'unclassified');
const gForkRows = {
  oneLedgerFork: countOf(matchSrc, 'this.ekHold = this.ekHoldLearn') === 1,
  oneSeasonFork: countOf(leagueSrc, 'this.matchFlags?.ekHoldLearn === true') === 1,
  oneVetoFork: countOf(matchSrc, 'ekHoldDeclines(side: number, band: number)') === 1,
  vetoReadOnce: countOf(brainSrc, 'match.ekHoldDeclines(') === 1,
  brainCaptureSites: countOf(brainSrc, 'match.ekHold') === 5,
  matchDrillCapture: countOf(matchSrc, 'ledger.noteDrillHold(') === 1,
  zeroNewHoldStatements: countOf(brainSrc, "type: 'ShieldHold'") === 2,
  seatForkStillOne: countOf(brainSrc, 'match.whetherEye !== null && whetherEyeInScope') === 1,
  zeroUnclassified: unclassified.length === 0,
  occurrences: forkOccurrences.length,
};
const gFork = Object.entries(gForkRows).filter(([k]) => k !== 'occurrences')
  .every(([, v]) => v === true);

/* ---- G-HYGIENE ------------------------------------------------------------ */
const freshMatch = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
const hygLeague = new League({ seed: 2 });
const hygFixture = hygLeague.nextFixture();
const hygMatch = hygFixture === undefined || hygFixture === null ? null : hygLeague.createMatch(hygFixture);
const seamFileTexts = [bookSrc, matchSrc, leagueSrc, brainSrc].join('\n');
const gHygieneRows = {
  absentFromA4: !a4Src.includes('ekHold'),
  hardFalseInit: matchSrc.includes('this.ekHoldLearn = cfg.ekHoldLearn ?? false;')
    && matchSrc.includes('this.ekHoldVeto = cfg.ekHoldVeto ?? false;'),
  freshMatchOff: freshMatch.ekHoldLearn === false && freshMatch.ekHoldVeto === false
    && freshMatch.ekHold === null,
  leagueMatchOff: hygMatch !== null && hygMatch.ekHold === null,
  unarmedLeagueAllocatesNothing: hygLeague.holdBooks === null,
  noEnvDoor: !bookSrc.includes('process.env') && !bookSrc.includes('EDS_BUNDLE_ARMED')
    && !/ekHold[A-Za-z]*.{0,80}(process\.env|envArmed|EDS_BUNDLE_ARMED)/.test(seamFileTexts),
  noNewGeneKey: !(GENE_KEYS as readonly string[]).some((k) => k.toLowerCase().includes('hold')),
  neverSerialized: !JSON.stringify(hygLeague.toJSON()).includes('ekHold'),
  envWhitelistOrRefuse: ENV_WHITELIST.length === 5,
};
const gHygiene = Object.values(gHygieneRows).every(Boolean);

/* ---- ⭐ G-EPI: the learner reads only its own event stream ------------------ */
const bookImports = bookSrc.split('\n').filter((l) => /^\s*import\s/.test(l));
const bookExecutable = bookSrc.split('\n')
  .filter((l) => { const t = l.trim(); return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/') || t === ''); })
  .join('\n');
const EPI_FORBIDDEN = ['Match', 'match.', 'Player', 'Team', 'perceivedSnapshot', 'perceptionSnapshot',
  'opp', 'rng', 'Rng', 'attrs', '.pos', 'readFileSync', 'docs/', 'import(', 'whetherEye', 'genome'];
const epiHits = EPI_FORBIDDEN.filter((n) => bookExecutable.includes(n));
const EPI_MEMBERS = ['noteSeatBand', 'noteTakeHold', 'noteDrillHold', 'observeOwner',
  'observeDeadBall', 'expire', 'flush'];
const gEpiRows = {
  importListEmpty: bookImports.length === 0,
  forbiddenNames: epiHits.length,
  membersExist: EPI_MEMBERS.every((m) => bookSrc.includes(`${m}(`)),
};
const gEpi = gEpiRows.importListEmpty && gEpiRows.forbiddenNames === 0 && gEpiRows.membersExist;

/* ---- ⭐⭐ G-NOTABLE: no census value, no certified cost, reachable from src -- */
/**
 * ⭐ THE NEEDLE SET, SCOPED AND DECLARED (#256.2's coverage discipline): the MEASURED
 * ANSWERS — every field whose key names a rate, a CI bound, a share, a margin, a mean/SD or a
 * certified cost — from BOTH hold censuses and the certified table. Degenerate values are
 * excluded by a DECLARED FLOOR (|v| >= 0.0001) and integers are excluded (a count is not an
 * answer). Three string forms per needle: the raw serialisation, the 5-dp form, and the
 * percentage form the tables print (2 dp). The 1-dp percentage form is NOT searched — it
 * collides with ordinary engine constants and would make the gate noise, not evidence.
 */
const NEEDLE_FLOOR = 0.0001;
const VALUE_KEY_RE = /rate|ci95|share|margin|mean|sd$|point|lower|upper|p10|p50|p90|median|quantile|delta|diff|tvd/i;
const collectNumbers = (v: unknown, out: Set<number>, keyed: boolean): void => {
  if (typeof v === 'number') {
    if (keyed && Number.isFinite(v) && !Number.isInteger(v) && Math.abs(v) >= NEEDLE_FLOOR) out.add(v);
    return;
  }
  if (Array.isArray(v)) { for (const x of v) collectNumbers(x, out, keyed); return; }
  if (v !== null && typeof v === 'object') {
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      collectNumbers(x, out, keyed || VALUE_KEY_RE.test(k));
    }
  }
};
const needleValues = new Set<number>();
collectNumbers(JSON.parse(readFileSync(EKC0_PATH, 'utf8')).result, needleValues, false);
collectNumbers(JSON.parse(readFileSync(EKC0B_PATH, 'utf8')).result, needleValues, false);
collectNumbers(tableRaw.build.table.cells, needleValues, false);
/** ⭐ THE DECLARED FORM FLOOR: a searchable form must carry at least THREE decimals. A
 *  two-decimal form ("0.64", "0.07") is a coarse value that ordinary engine constants collide
 *  with by arithmetic accident, so searching it would make this gate noise instead of evidence;
 *  the count of forms excluded that way is PUBLISHED beside the gate. */
const searchableForm = (f: string): boolean => /^\d+\.\d{3,}$/.test(f);
const needleForms = new Set<string>();
let excludedForms = 0;
for (const v of needleValues) {
  for (const f of [String(v), v.toFixed(5), (v * 100).toFixed(2)]) {
    if (searchableForm(f)) needleForms.add(f); else excludedForms++;
  }
}
const srcAll = [...srcText.values()].join('\n');
const srcTokens = new Set(srcAll.match(/\d+\.\d+|\d+/g) ?? []);
const valueHits = [...needleForms].filter((f) => srcTokens.has(f));
const NAME_NEEDLES = ['ek-c0-hold-outcome-census', 'ek-c0b-inversion-diagnostic', 'c5-recensus',
  'hold-outcome-census', 'inversion-diagnostic', 'holdOutcomeCensus', 'tableSha'];
const nameHits = NAME_NEEDLES.filter((n) => srcAll.includes(n));
/** loaders / doc paths are searched in EXECUTABLE source only — a comment naming this stage's
 *  own doc is the #247 split being DECLARED, not breached (the DV-T2-T0 §DEV 7 disposition). */
const executableOf = (text: string): string => text.split('\n')
  .filter((l) => { const t = l.trim(); return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/') || t === ''); })
  .join('\n');
const seamExecutable = [bookSrc, matchSrc, leagueSrc, brainSrc].map(executableOf).join('\n');
const loaderHits = ['readFileSync', 'import(', 'require(', 'docs/']
  .filter((n) => seamExecutable.includes(n));
/** ⭐ THE CONTROL NEEDLE: a token that IS in src, so a silently empty search cannot pass. */
const CONTROL_NEEDLE = '0.5';
const gNotableRows = {
  needleValues: needleValues.size,
  needleForms: needleForms.size,
  excludedDegenerateForms: excludedForms,
  valueHits: valueHits.length,
  valueHitsSample: valueHits.slice(0, 8),
  nameHits: nameHits.length,
  loaderHits: loaderHits.length,
  controlNeedleFound: srcTokens.has(CONTROL_NEEDLE),
  floor: NEEDLE_FLOOR,
};
const gNotable = valueHits.length === 0 && nameHits.length === 0 && loaderHits.length === 0
  && gNotableRows.controlNeedleFound;

/* ---- G-TRACE (+ G-TRACE-WINDOW / G-TRACE-BANDS) ---------------------------- */
const ekc0 = JSON.parse(readFileSync(EKC0_PATH, 'utf8'));
const dvc0 = JSON.parse(readFileSync(DVC0_PATH, 'utf8'));
const ggc = JSON.parse(readFileSync(GGC_PATH, 'utf8'));
const ekc0Primary = ekc0.frozenDesign.windows.primaryWindowS;
const dvc0Primary = dvc0.frozenDesign.windows.primaryWindowS;
const ggcFamily: number[] = ggc.frozenDesign.definitions.dangerWindowsS;
const ekc0Bands = ekc0.result.census.table[0].byBand.length;
const gTraceRows = {
  windowIsEkC0Primary: EK_HOLD_WINDOW_S === ekc0Primary,
  windowIsDvC0Primary: EK_HOLD_WINDOW_S === dvc0Primary,
  windowInGgcFamily: ggcFamily.includes(EK_HOLD_WINDOW_S),
  bandsAreTheTableCutsPlusOne: EK_HOLD_BANDS === TABLE.pressureBands.length + 1,
  bandsAreTheCensusBands: EK_HOLD_BANDS === ekc0Bands,
  bandIsTheShippedPlacement: brainSrc.includes('decision.perceived.pressureBand'),
  drillIsTheShippedForcedHold: brainSrc.includes('match.forcedHold.untilTick'),
  holdKIsTheCensusDose: HOLD_K_TICKS === ekc0.frozenDesign.holdTicks,
  seatFileUntouchedByThisStage: true, // measured in G-PINS
};
const gTrace = Object.values(gTraceRows).every(Boolean);

/* ---- G-PINS ---------------------------------------------------------------- */
const gitStat = (path: string): string => {
  try { return execSync(`git diff --stat HEAD -- ${path}`, { encoding: 'utf8' }).trim(); }
  catch { return 'ERROR'; }
};
const testStatus = (() => {
  try {
    return execSync('git status --porcelain -- tests', { encoding: 'utf8' })
      .split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  } catch { return ['ERROR']; }
})();
const gPinsRows = {
  whetherEyeUntouched: gitStat('src/ai/whetherEye.ts') === '',
  deliveryAccountBookUntouched: gitStat('src/ai/deliveryAccountBook.ts') === '',
  deliveryValueSeatUntouched: gitStat('src/ai/deliveryValueSeat.ts') === '',
  perceptionUntouched: gitStat('src/ai/perceptionSnapshot.ts') === '',
  a4WorldUntouched: gitStat('src/game/a4World.ts') === '',
  zeroTestFilesEdited: testStatus.every((l) => l.startsWith('?? ')),
  dvForkPinIntact: matchSrc.includes('this.dvLearnedMap = cfg.dvLearnedMap ?? false;'),
  testStatus,
};
const gPins = Object.entries(gPinsRows).filter(([k]) => k !== 'testStatus')
  .every(([, v]) => v === true);

/* ---- G-SEED ---------------------------------------------------------------- */
const CLAIMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'EK-T0 receipts (incl. the G-CROSS matrix, no new block)', range: [BLOCK, BLOCK + N - 1] },
  { name: 'EK-T0 label / book / veto / reset / rng reads', range: [READ_BASE, READ_BASE + 9] },
  { name: 'EK-T0 REPORTED dosed-drill smoke', range: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1] },
  { name: 'EK-T0 test-file seeds', range: [12_450_900, 12_450_911] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range))
  .map((p) => ({ claimed: c.name, against: p.name })));
const claimedInternalClash = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => ({ claimed: c.name, against: d.name })));
const gSeedRows = {
  blocks: CLAIMED.length,
  priorBlocks: CONSUMED.length,
  clashes: seedClashes.length + claimedInternalClash.length,
  ordered: CLAIMED.every((c) => c.range[0] <= c.range[1]),
};
const gSeed = gSeedRows.clashes === 0 && gSeedRows.ordered;

/* ========================================================================== */
/* §11 ⭐ REPORTED — THE DOSED-DRILL SMOKE (a sanity read, NOT a gate)          */
/* ========================================================================== */
banner(`  [ek-t0] REPORTED smoke: ${SMOKE_N} drill-world matches...`);
const smokeBooks: [HoldAccountBook, HoldAccountBook] = [new HoldAccountBook(), new HoldAccountBook()];
let smokeIdenticalToLearnOff = true;
let smokeTakes = 0; let smokeDrills = 0; let smokeUnbanded = 0; let smokeLagMax = 0;
const smokeSeeds = Array.from({ length: SMOKE_N }, (_, i) => SMOKE_BASE + i);
for (const seed of smokeSeeds) {
  const m = matchOf(seed, { learn: true, drillWorld: true, books: smokeBooks });
  runMatch(m, true);
  const off = walk(seed, { learn: 'absent', drillWorld: true });
  if (signature(m) !== off) smokeIdenticalToLearnOff = false;
  const led = m.ekHold!;
  smokeTakes += led.takeHolds; smokeDrills += led.drillHolds; smokeUnbanded += led.drillHoldsUnbanded;
  smokeLagMax = Math.max(smokeLagMax, led.noted.reduce((mx, h) => Math.max(mx, h.bandLagTicks), 0));
}
const censusTable = ekc0.result.census.table.find((t: any) => t.isPrimary === true);
const censusByBand: Record<string, { rate: number; moments: number }> = {};
for (const row of censusTable.byBand) censusByBand[row.band] = { rate: row.punishRate, moments: row.moments };
const BAND_KEYS = ['p0', 'p1', 'p2'] as const;
const smokeRows = BAND_KEYS.map((bk, b) => {
  const holds = smokeBooks[0].holds[b] + smokeBooks[1].holds[b];
  const punished = smokeBooks[0].punished[b] + smokeBooks[1].punished[b];
  return {
    band: bk,
    label: ['free', 'mid', 'pressed'][b],
    bookHolds: holds, bookPunished: punished,
    bookRate: holds > 0 ? round(punished / holds) : null,
    censusRate: round(censusByBand[bk].rate),
    censusMoments: censusByBand[bk].moments,
  };
});
const smokeTotalHolds = smokeRows.reduce((n, r) => n + r.bookHolds, 0);
const smokeTotalPunished = smokeRows.reduce((n, r) => n + r.bookPunished, 0);
const smoke = {
  matches: SMOKE_N, seeds: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1],
  worldIdenticalToOff: smokeIdenticalToLearnOff,
  takes: smokeTakes, drills: smokeDrills, unbandedDrills: smokeUnbanded, maxBandLagTicks: smokeLagMax,
  rows: smokeRows,
  allBands: {
    holds: smokeTotalHolds, punished: smokeTotalPunished,
    bookRate: smokeTotalHolds > 0 ? round(smokeTotalPunished / smokeTotalHolds) : null,
    censusRate: round(censusTable.all.punishRate),
    censusMoments: censusTable.all.moments,
  },
  holdsPerTeamMatch: round(smokeTotalHolds / (SMOKE_N * 2)),
  orderingBook: [...smokeRows].sort((a, b) => (b.bookRate ?? -1) - (a.bookRate ?? -1)).map((r) => r.label),
  orderingCensus: [...smokeRows].sort((a, b) => b.censusRate - a.censusRate).map((r) => r.label),
};

/* ========================================================================== */
/* §12 THE GATE TABLE + THE ARTIFACT                                           */
/* ========================================================================== */
const gates: Record<string, boolean> = {
  gDet,
  gIdent, xFpProd,
  gOff: runA.gOff as boolean,
  gBorn: runA.gBorn as boolean,
  gEmpty: runA.gEmpty as boolean,
  gLabel: runA.gLabel as boolean,
  gBand: runA.gBand as boolean,
  gBook: runA.gBook as boolean,
  gVeto: runA.gVeto as boolean,
  gReset: runA.gReset as boolean,
  gBite: runA.gBite as boolean,
  gCross,
  gNotable,
  gEpi,
  gNoLamarck: runA.gNoLamarck as boolean,
  gRng: runA.gRng as boolean,
  gHygiene,
  gFork,
  gTrace,
  gPins,
  gSeed,
};
const allPass = Object.values(gates).every(Boolean);
const body = {
  stage: 'EK-T0',
  doc: 'docs/world-model/EK-T0-HOLD-BELIEF-SEAM.md',
  contract: 'docs/world-model/EK-HOLD-EARNED-BELIEF-CONTRACT.md §2 (M-EK.1–.4)',
  ruling: '#259.2 bound · #261.4 dispatched · #261.3 picks of record',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  frozen: {
    window: EK_HOLD_WINDOW_S, bands: EK_HOLD_BANDS, holdK: HOLD_K_TICKS,
    momentSpacing: MOMENT_SPACING, censusFlags: CENSUS_FLAGS, duration: MATCH_DURATION,
    vetoForm: 'DECLINE ⇔ holds[b] > 0 AND Σ_{b\'≠b} holds[b\'] > 0 AND punished[b]·Σ_{b\'≠b} holds[b\'] > Σ_{b\'≠b} punished[b\']·holds[b] — the team\'s OWN band rate strictly above its OWN pooled cross-band reference; integer cross-multiplication, zero constants, never a subsidy.',
  },
  seeds: { block: BLOCK, n: N, readBase: READ_BASE, smokeBase: SMOKE_BASE, smokeN: SMOKE_N, claimed: CLAIMED },
  receipts: runA,
  gDetDigests: { runA: digestA, runB: digestB },
  crossClaims,
  crossScoring: { always: CROSS_ALWAYS, setwise: CROSS_SETWISE, setwiseCounts: crossSetwise, seeds: crossSeeds.length, alwaysHeld: crossAlways },
  gIdentRows,
  gForkRows,
  forkOccurrences,
  gHygieneRows,
  gEpiRows,
  gNotableRows,
  gTraceRows,
  gPinsRows,
  gSeedRows,
  smoke,
  gates,
  allGatesPass: allPass,
  nonClaims: [
    'No football claim. No learning claim — whether a book grows the measured shape is EK-T1\'s.',
    'The REPORTED smoke is descriptive, uncontrolled and adjudicates nothing (#203).',
    'Nothing ships: both doors are hard false, and the band itself needs whetherEye, null in production.',
  ],
};
const resultSha256 = sha(canonical(body));
const envelope = {
  ...body,
  resultSha256,
  envelopeUnhashed: {
    receiptsMs, wallMs: Date.now() - tRunA,
    head: (() => { try { return execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(); } catch { return 'unknown'; } })(),
    outPath: OUT_PATH,
  },
};
writeFileSync(OUT_PATH, `${JSON.stringify(envelope, null, 1)}\n`);
banner(`\n  [ek-t0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
banner(`  [ek-t0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · resultSha256 ${resultSha256}`);
process.exit(allPass ? 0 : 1);
