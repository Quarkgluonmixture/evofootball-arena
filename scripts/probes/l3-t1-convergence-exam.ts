/**
 * L3 T1 — THE CONVERGENCE EXAM (docs/world-model/L3-T1-CONVERGENCE-EXAM.md).
 *
 * H-L3 is scored here. Contract CB-L3-DEFENCE-BOOK-CONTRACT.md §1/§3 under commander ruling
 * ⭐ #280.3 (the #257.3 exam frame on the defence family: the POLISHED ARMED WORLD of record,
 * the LEARN-ONLY arm as the scored one, OFF the identity anchor, ZERO dosing, the ordering
 * predicate at g2 with tau DERIVED, the yardstick measured INSIDE this instrument at the
 * APPLIED 54-tick window, the phase-sensitivity rung, the learning curve in SEASONS), bound by
 * #279.3 (the label ruling) and #280.2 (the applied-window law + the two pre-tasks).
 *
 * ⭐ INSTRUMENT-ONLY ROUND: `src/**` moves only by this round's two committed COMMENT fixes
 * (#280.2(ii)/(iv)); xSrcUntouched gates the worktree against HEAD.
 * ⭐ #247: this probe may READ the committed censuses; `src/**` may not (gValuesUnreachable).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2's third-visit form):
 *   accepted: L3T1_MODE (smoke|full, REQUIRED) · L3T1_R · L3T1_M · L3T1_SKIP_FP · L3T1_OUT.
 *   ANY other `L3T1_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is a PREFLIGHT: it routes onto the guard block and may not write a canonical
 *   repo path.
 *
 * RUN: L3T1_MODE=full npx tsx scripts/probes/l3-t1-convergence-exam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import { Match } from '../../src/sim/Match';
import { DT } from '../../src/sim/constants';
import {
  DefenceAccountBook, LungeLabelLedger, L3_DEFENCE_GROUPS, L3_DEFENCE_WINDOW_S,
  L3_RECKLESS_ARRIVAL,
} from '../../src/ai/defenceBook';
import { a4MatchFlags, armA4World, cbArmedVersion, CB_WORLD_VERSION } from '../../src/game/a4World';
import { GENE_KEYS, randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ⭐ ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS (#261.2 + #262.2)     */
/* ========================================================================== */
const ENV_WHITELIST = ['L3T1_MODE', 'L3T1_R', 'L3T1_M', 'L3T1_SKIP_FP', 'L3T1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('L3T1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('L3-T1 FATAL — refused env surface. '
    + `rogue L3T1_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.L3T1_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`L3-T1 FATAL — L3T1_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v !== undefined
  ? Math.max(1, Number.parseInt(v, 10)) : null);
const R_ENV = intEnv(process.env.L3T1_R);
const M_ENV = intEnv(process.env.L3T1_M);
const SKIP_FP = process.env.L3T1_SKIP_FP === '1';
const OUT_ENV = process.env.L3T1_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'L3T1_R', set: R_ENV !== null },
  { name: 'L3T1_M', set: M_ENV !== null },
  { name: 'L3T1_SKIP_FP', set: SKIP_FP },
  { name: 'L3T1_OUT', set: OUT_ENV !== undefined },
];
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/l3-t1-convergence-exam-smoke.json',
  full: 'docs/world-model/data/l3-t1-convergence-exam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/l3-t1-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('L3-T1 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 THE FROZEN DESIGN — every literal machine-checked by gN                   */
/* ========================================================================== */
const L3C0B_PATH = 'docs/world-model/data/l3-c0b-window-decomposition.json';
const L3T0_PATH = 'docs/world-model/data/l3-t0-defence-book-seam.json';

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';

/** ⭐ A SEASON = 7 FIXTURES PER TEAM — traced from `League.ts`, never typed as a design choice. */
const FIXTURES_PER_SEASON = 7;
const R_FROZEN = 8;
const M_FROZEN = 15;
const TAU_FROZEN = 0.75;
const POWER_TARGET = 0.80;
const FAILABILITY_TARGET = 0.05;
const MIN_BOOKS = 12;
const MIN_SEASONS = 2;
const SEED_ROOM = 840;
const CHECKPOINT_SEASONS: readonly number[] = [1, 2, 3, 5, 8, 12, 15];
const WALL_CAP_S = 7200;
const NOMINAL_MS_PER_WALK = 150;
/** the ⭐ APPLIED window, the law of record (#280.2(iii)): 54 ticks = 0.9000 s. */
const APPLIED_WINDOW_TICKS = 54;

/**
 * ⭐ THE FROZEN SIZING LITERALS — recomputed here from the artifacts' RAW COUNTS (#229.2 and this
 * stage's own "rates recomputed from raw counts" rule). ⚠ §DEV 8: the stage doc's §M table was
 * computed from the PUBLISHED ROUNDED rates (0.7890 / 0.8305); the raw-count recomputation moves
 * q, the two powers and the failability in the 4th–5th decimal ONLY. Every structural output —
 * R* = 8, M* = 15, n_eff = [769, 76], tau = 0.75, both powers ≥ 0.80, failability ≤ 0.05 — is
 * IDENTICAL under both. The doc's numbers are published beside these.
 */
const FROZEN_SIZING = {
  deff: 1.875,
  designRates: [13.727285, 1.360905],
  censusRates: [0.788963, 0.830508],
  pooledNull: 0.794427,
  smokeRates: [0.793496, 0.764706],
  rStar: 8,
  mStar: 15,
  nEff: [769, 76],
  qPerBook: 0.821333,
  qNull: 0.511299,
  tau: 0.75,
  powerIndependent: 0.857659,
  powerConservative: 0.84186,
  failabilityIndependent: 0.046555,
  failabilityConservative: 0.159867,
  mdePp: 3.82,
  qUnderSmokeVector: 0.291924,
  oneSeasonQ: 0.60597,
  oneSeasonPower: 0.178979,
  docLiterals: {
    note: '⚠ §DEV 8 — the stage doc\'s §M table, computed from the ROUNDED published rates',
    qPerBook: 0.821087, qNull: 0.511307, powerIndependent: 0.85703,
    powerConservative: 0.841367, failabilityIndependent: 0.046561, oneSeasonQ: 0.6058,
  },
} as const;

/* ---- the guard tolerances, inherited VERBATIM from DV-T1/#251 / EK-T1 ------------- */
const NI_FRACTION = 1 - 0.275 / 0.380;
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;

/* ---- the estimator ---------------------------------------------------------------- */
const BOOTSTRAP = 2000;
const STATS_BASE = 111_200;
const STATS_PUBLISHED_BASES: readonly number[] = [
  100_000, 100_400, 101_000, 101_400, 102_000, 102_400, 103_000, 103_400, 104_000, 104_400,
  105_000, 105_400, 106_000, 106_200, 106_600, 107_000, 107_400, 107_800, 108_200, 108_600,
  108_800, 109_000, 110_800, 111_000,
];

/* ---- §SEED LEDGER (#163) ---------------------------------------------------------- */
const BATTERY_BASE = 12_483_000;
const SMOKE_BASE = 12_483_840;
const GUARD_BASE = 12_483_880;
const GUARD_SPAN = 20;
const PREFLIGHT_WALKED_BASE = 12_483_900;
const PREFLIGHT_WALKED_N = 20;
const GWORLD_SEED = 12_483_999;
/** ⭐ A RE-WALK, NOT A CONSUMPTION: L3-T0's own committed smoke block. */
const DEFF_REWALK_BASE = 12_482_100;
const DEFF_REWALK_N = 20;

const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / MT / LADDER bands', range: [12_300_000, 12_421_999] },
  { name: 'O2-T1 · CTB · OBM · PTP · DLC bands', range: [12_422_000, 12_428_999] },
  { name: 'DV-C0 / DV-T0 / DV-T1 family', range: [12_429_000, 12_435_099] },
  { name: 'DV-T2-C0 census band (#255.4/#256)', range: [12_436_000, 12_436_999] },
  { name: 'DV-T2-T0 learning seam (#256.4/#257)', range: [12_437_000, 12_437_999] },
  { name: 'DV-T2-T1 convergence exam (#257.3/#258.4)', range: [12_438_000, 12_447_999] },
  { name: 'EK-C0 census band (#259.3/#260.4)', range: [12_448_000, 12_448_999] },
  { name: 'EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
  { name: 'EK-T0 hold-belief seam (#261.4/#262)', range: [12_450_000, 12_450_999] },
  { name: 'EK-T1 convergence exam band (#262.4)', range: [12_451_000, 12_469_999] },
  { name: 'CB-C0 / CB-T0 / CB-T1 / CB-T2 bands (#264–#273)', range: [12_470_000, 12_479_999] },
  { name: 'L3-C0 lunge-outcome census (#277.2/#278)', range: [12_480_000, 12_480_999] },
  { name: 'L3-C0b window decomposition (#278.2/#279)', range: [12_481_000, 12_481_999] },
  { name: '⭐ L3-T0 dormant defence-book seam (#279.4/#280)', range: [12_482_000, 12_482_999] },
];

/* ========================================================================== */
/* §2 SMALL HELPERS                                                            */
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
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : xs.reduce((a, b) => a + b, 0) / xs.length);
const quantile = (xs: readonly number[], q: number): number => {
  if (xs.length === 0) return Number.NaN;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.min(s.length - 1, Math.floor(q * s.length))];
};
const t0Wall = Date.now();

/* ---- exact binomial machinery (no normal approximation anywhere) ------------------ */
const lgamma = (x: number): number => {
  // Lanczos, g = 7, n = 9 — deterministic and float-stable for our range.
  const g = 7;
  const c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  const z = x - 1;
  let a = c[0];
  const t = z + g + 0.5;
  for (let i = 1; i < g + 2; i++) a += c[i] / (z + i);
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
};
const binPmf = (n: number, p: number): number[] => {
  const out: number[] = [];
  for (let k = 0; k <= n; k++) {
    const lp = lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1)
      + (p > 0 ? k * Math.log(p) : (k === 0 ? 0 : -1e18))
      + (p < 1 ? (n - k) * Math.log(1 - p) : (k === n ? 0 : -1e18));
    out.push(Math.exp(lp));
  }
  return out;
};
/** P(X >= k) for X ~ Bin(n, p). */
const binSf = (n: number, p: number, k: number): number => {
  const f = binPmf(n, p);
  let s = 0;
  for (let i = Math.max(0, k); i <= n; i++) s += f[i];
  return s;
};
/** ⭐ q — the per-book ordering probability, EXACT convolution, STRICT (ties are not ordered). */
const qOrder = (nR: number, nC: number, pR: number, pC: number): number => {
  const fR = binPmf(nR, pR);
  const fC = binPmf(nC, pC);
  const cum: number[] = new Array<number>(nC + 1).fill(0);
  let s = 0;
  for (let k = 0; k <= nC; k++) { cum[k] = s; s += fC[k]; }
  let tot = 0;
  for (let kr = 0; kr <= nR; kr++) {
    const kmax = Math.min(Math.ceil((kr * nC) / nR) - 1, nC);
    if (kmax < 0) continue;
    tot += fR[kr] * (cum[kmax] + fC[kmax]);
  }
  return tot;
};
/** the one-sided 95 % LOWER Poisson bound on a committed count, per unit exposure. */
const Z95 = 1.6448536269514722;
const poissonLower = (n: number, exposure: number): number => (n - Z95 * Math.sqrt(n)) / exposure;

/* ========================================================================== */
/* §3 THE WORLD OF RECORD + THE ARMS                                           */
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
type Books = readonly [DefenceAccountBook, DefenceAccountBook];
type ArmKind = 'learnOnly' | 'off';
const matchOf = (seed: number, arm: ArmKind, books: Books | null): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...a4MatchFlags(CB_WORLD_VERSION),
    ...(arm === 'learnOnly'
      ? { l3DefenceLearn: true, ...(books !== null ? { l3DefenceBooks: books } : {}) }
      : {}),
  });
  armA4World(m, null, CB_WORLD_VERSION);
  return m;
};
const signature = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/** the ARM-IDENTITY conjuncts, derived FOR THIS EXAM (gArms). */
const armConjuncts = (
  m: Match, arm: ArmKind, books: Books | null, seed: number,
): Record<string, boolean> => {
  const mm = m as unknown as {
    l3DefenceLearn: boolean; l3DefenceVeto: boolean; l3Defence: LungeLabelLedger | null;
  };
  return {
    learnFlagMatchesTheArm: mm.l3DefenceLearn === (arm === 'learnOnly'),
    vetoDoorShut: mm.l3DefenceVeto === false,
    ledgerSeatMatchesTheArm: (mm.l3Defence !== null) === (arm === 'learnOnly'),
    booksArePersistentAndWired: arm === 'off' || books === null
      || (mm.l3Defence !== null && mm.l3Defence.books[0] === books[0]
        && mm.l3Defence.books[1] === books[1]),
    theArmedWorldOfRecord: cbArmedVersion(m) === CB_WORLD_VERSION,
    noGeneAnywhere: !GENE_KEYS.some((k) => String(k).toLowerCase().includes('defence')),
    squadsRedrawnPerFixture:
      canonical(m.teams[0].info.genome) === canonical(team('A', seed * 2 + 1).genome)
      && canonical(m.teams[1].info.genome) === canonical(team('B', seed * 2 + 2).genome),
  };
};

interface GuardRow {
  interceptions: number; offsides: number; goals: number;
  spreadYOut: number; spacingMedian: number; spacingUnder4: number;
}
interface LabelRec {
  side: number; group: number; punished: boolean; spansRestart: boolean; spanTicks: number;
}
interface WalkOut {
  signature: string; guards: GuardRow; armOk: boolean;
  labels: LabelRec[]; closed: number; censored: number; opened: number; fired: number;
  vetoes: number;
}

/** ONE walk. The tick loop also carries the PROBE-SIDE phase log (§DEV 5) and the guard sampler. */
const walk = (seed: number, arm: ArmKind, books: Books | null): WalkOut => {
  const m = matchOf(seed, arm, books);
  const armOk = Object.values(armConjuncts(m, arm, books, seed)).every(Boolean);
  const pairs: number[] = [];
  const spreadOut: number[] = [];
  const playing: boolean[] = [];
  let samples = 0;
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    tick += 1;
    playing.push(m.phase === 'playing');
    if (tick % SAMPLE_EVERY !== 0 || m.phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      if (m.possessionSide !== (t.side as 0 | 1)) {
        const ys = outfield.map((p) => p.pos.y);
        const mu = mean(ys);
        spreadOut.push(Math.sqrt(ys.reduce((a, b) => a + (b - mu) ** 2, 0) / ys.length));
      }
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) {
            pairs.push(Math.hypot(
              outfield[i].pos.x - outfield[j].pos.x, outfield[i].pos.y - outfield[j].pos.y,
            ));
          }
        }
      }
    }
  }
  const st = [m.teams[0].stats, m.teams[1].stats];
  const led = (m as unknown as { l3Defence: LungeLabelLedger | null }).l3Defence;
  const labels: LabelRec[] = [];
  if (led !== null) {
    for (const n of led.noted) {
      const i0 = Math.max(0, Math.round(n.tMiss / DT) - 1);
      const i1 = Math.min(playing.length - 1, Math.round(n.tClose / DT) - 1);
      let spans = false;
      for (let k = i0; k <= i1; k++) if (!playing[k]) { spans = true; break; }
      labels.push({
        side: n.side, group: n.group, punished: n.punished, spansRestart: spans,
        spanTicks: Math.round((n.tClose - n.tMiss) / DT),
      });
    }
  }
  return {
    signature: signature(m),
    armOk,
    labels,
    closed: led?.closedLabels ?? 0,
    censored: led?.censored ?? 0,
    opened: led?.opened ?? 0,
    fired: led === null ? 0 : led.fired.reduce((a, b) => a + b, 0),
    vetoes: led?.vetoes ?? 0,
    guards: {
      interceptions: st[0].interceptions + st[1].interceptions,
      offsides: st[0].offsides + st[1].offsides,
      goals: st[0].goals + st[1].goals,
      spreadYOut: mean(spreadOut),
      spacingMedian: quantile(pairs, 0.5),
      spacingUnder4: pairs.length === 0 ? Number.NaN
        : pairs.filter((v) => v < CLOSE_PAIR_M).length / pairs.length,
    },
  };
};

/* ========================================================================== */
/* §4 THE deff RE-WALK — a deterministic replay of a COMMITTED parent           */
/* ========================================================================== */
const l3t0 = readJson(L3T0_PATH);
const l3c0b = readJson(L3C0B_PATH);
/** the committed T0 smoke cells, READ (never typed) — the receipt the re-walk must reproduce. */
const t0Smoke = ((l3t0.smoke ?? {}) as Record<string, unknown>);
const t0SmokeCells = (t0Smoke.rows ?? []) as { group: string; lunges: number; punished: number }[];

interface DeffOut {
  punished: number; clusters: number; deff: number; closed: number;
  cells: { lunges: number; punished: number }[]; spanning: number;
}
const deffRewalk = (): DeffOut => {
  const cells = [{ lunges: 0, punished: 0 }, { lunges: 0, punished: 0 }];
  const clusters = new Set<string>();
  let punished = 0; let closed = 0; let spanning = 0;
  for (let i = 0; i < DEFF_REWALK_N; i++) {
    const seed = DEFF_REWALK_BASE + i;
    const books: Books = [new DefenceAccountBook(), new DefenceAccountBook()];
    const m = matchOf(seed, 'learnOnly', books);
    const episodeAt: number[] = [];
    const playing: boolean[] = [];
    let episodes = 0; let prevPlaying = true;
    while (!m.finished) {
      m.step(DT);
      const p = m.phase === 'playing';
      if (!p && prevPlaying) episodes += 1;
      prevPlaying = p;
      playing.push(p);
      episodeAt.push(episodes);
    }
    const led = (m as unknown as { l3Defence: LungeLabelLedger | null }).l3Defence;
    if (led === null) continue;
    for (const n of led.noted) {
      closed += 1;
      cells[n.group].lunges += 1;
      const i1 = Math.min(playing.length - 1, Math.round(n.tClose / DT) - 1);
      const i0 = Math.max(0, Math.round(n.tMiss / DT) - 1);
      for (let k = i0; k <= i1; k++) if (!playing[k]) { spanning += 1; break; }
      if (!n.punished) continue;
      punished += 1;
      cells[n.group].punished += 1;
      // ⭐ THE CLUSTER: one team's labels resolved inside one dead-ball episode.
      clusters.add(`${seed}:${n.side}:${episodeAt[Math.max(0, i1)]}`);
    }
  }
  return {
    punished, clusters: clusters.size, deff: punished / clusters.size, closed, cells, spanning,
  };
};

/* ========================================================================== */
/* §5 THE SIZING — recomputed FROM the committed artifacts + the re-walk        */
/* ========================================================================== */
/** the committed g2 / sepGainedCommonLong row, READ from L3-C0b's artifact (never typed). */
const g2Rows = ((l3c0b.tables as Record<string, unknown>).g2) as {
  band: string; misses: number; missesPerTeamMatch: { mean: number };
  candidates: { sepGainedCommonLong: { rate: { num: number; den: number } } };
}[];
const CENSUS_NUM = g2Rows.map((r) => r.candidates.sepGainedCommonLong.rate.num);
const CENSUS_DEN = g2Rows.map((r) => r.candidates.sepGainedCommonLong.rate.den);
const CENSUS_RATE = CENSUS_NUM.map((n, i) => n / CENSUS_DEN[i]);
const POOLED_NULL = (CENSUS_NUM[0] + CENSUS_NUM[1]) / (CENSUS_DEN[0] + CENSUS_DEN[1]);
/** the census FILL: its own tabulated misses, over an exposure DERIVED from its own per-team-match
 *  mean (never typed — 7,029 / 14.001992 = 502 team-matches). */
const CENSUS_MISSES = g2Rows.map((r) => r.misses ?? 0);
const CENSUS_EXPOSURE = g2Rows.map((r, i) => CENSUS_MISSES[i] / (r.missesPerTeamMatch?.mean ?? 1));
/** L3-T0's committed smoke: the seam's OWN instrument in the same venue. */
const SMOKE_LUNGES = t0SmokeCells.map((c) => c.lunges);
const SMOKE_PUNISHED = t0SmokeCells.map((c) => c.punished);
const SMOKE_RATE = SMOKE_PUNISHED.map((p, i) => p / SMOKE_LUNGES[i]);
/** L3-T0's committed smoke exposure, READ from its artifact (20 matches × 2 teams). */
const SMOKE_TEAM_MATCHES = ((t0Smoke.matches ?? 0) as number) * 2;

interface Sizing {
  deff: number; designRates: number[]; censusRates: number[]; pooledNull: number;
  smokeRates: number[]; rStar: number; mStar: number; nEff: number[]; q: number; qNull: number;
  tau: number; k: number; powerIndependent: number; powerConservative: number;
  failabilityIndependent: number; failabilityConservative: number; mdePp: number;
  qUnderSmoke: number; powerUnderSmoke: number; limbIPowerCons: number; limbIPowerInd: number;
  oneSeasonQ: number; oneSeasonPower: number; feasibleCount: number;
  curveQ: { seasons: number; nEffReckless: number; nEffControlled: number; q: number }[];
}
const phi = (x: number): number => {
  // Abramowitz–Stegun 7.1.26 style erf, deterministic.
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t
    + 0.254829592) * t * Math.exp(-(x * x) / 2);
  return x >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
};
const nEffOf = (d: number[], deff: number, seasons: number): number[] => d
  .map((r) => Math.round((r * FIXTURES_PER_SEASON * seasons) / deff));

const deriveSizing = (deff: number): Sizing => {
  const designRates = [0, 1].map((g) => Math.min(
    poissonLower(SMOKE_LUNGES[g], SMOKE_TEAM_MATCHES),
    poissonLower(CENSUS_MISSES[g], CENSUS_EXPOSURE[g]),
  ));
  const pC = CENSUS_RATE[0];
  const pR = CENSUS_RATE[1];
  let best: Sizing | null = null;
  let feasibleCount = 0;
  for (let R = MIN_BOOKS / 2; R <= 60; R++) {
    for (let M = MIN_SEASONS; M <= 400; M++) {
      const S = R * FIXTURES_PER_SEASON * M;
      if (S > SEED_ROOM) break;
      const B = 2 * R;
      if (B < MIN_BOOKS) continue;
      const ne = nEffOf(designRates, deff, M);
      if (ne[1] < 1 || ne[0] < 1) continue;
      const q = qOrder(ne[1], ne[0], pR, pC);
      const qNull = qOrder(ne[1], ne[0], POOLED_NULL, POOLED_NULL);
      let k = -1;
      for (let kk = 1; kk <= B; kk++) {
        if (binSf(B, qNull, kk) <= FAILABILITY_TARGET) { k = kk; break; }
      }
      if (k < 0) continue;
      const tau = k / B;
      const kCons = Math.ceil(tau * R);
      const powerInd = binSf(B, q, k);
      const powerCons = binSf(R, q, kCons);
      if (powerInd < POWER_TARGET || powerCons < POWER_TARGET) continue;
      feasibleCount += 1;
      // ⭐ THE N RULE: power is the CONSTRAINT, DEPTH is the objective (#280.3's curve).
      const better = best === null || M > best.mStar
        || (M === best.mStar && powerInd > best.powerIndependent)
        || (M === best.mStar && powerInd === best.powerIndependent && R > best.rStar);
      if (!better) continue;
      const sd = Math.sqrt((pR * (1 - pR)) / ne[1] + (pC * (1 - pC)) / ne[0]);
      let mde = 0;
      for (let g = 0; g < 0.3; g += 0.00005) {
        if (binSf(B, qOrder(ne[1], ne[0], Math.min(0.999, pC + g), pC), k) >= POWER_TARGET) {
          mde = g; break;
        }
      }
      const qSmoke = qOrder(ne[1], ne[0], SMOKE_RATE[1], SMOKE_RATE[0]);
      const ne1 = nEffOf(designRates, deff, 1);
      best = {
        deff,
        designRates,
        censusRates: CENSUS_RATE,
        pooledNull: POOLED_NULL,
        smokeRates: SMOKE_RATE,
        rStar: R,
        mStar: M,
        nEff: ne,
        q,
        qNull,
        tau,
        k,
        powerIndependent: powerInd,
        powerConservative: powerCons,
        failabilityIndependent: binSf(B, qNull, k),
        failabilityConservative: binSf(R, qNull, kCons),
        mdePp: mde * 100,
        qUnderSmoke: qSmoke,
        powerUnderSmoke: binSf(B, qSmoke, k),
        limbIPowerCons: phi((pR - pC) / (sd / Math.sqrt(R)) - 1.959963985),
        limbIPowerInd: phi((pR - pC) / (sd / Math.sqrt(B)) - 1.959963985),
        oneSeasonQ: qOrder(Math.max(1, ne1[1]), ne1[0], pR, pC),
        oneSeasonPower: binSf(B, qOrder(Math.max(1, ne1[1]), ne1[0], pR, pC), k),
        feasibleCount: 0,
        curveQ: CHECKPOINT_SEASONS.map((s) => {
          const n = nEffOf(designRates, deff, s);
          return {
            seasons: s,
            nEffReckless: Math.max(1, n[1]),
            nEffControlled: n[0],
            q: qOrder(Math.max(1, n[1]), n[0], pR, pC),
          };
        }),
      };
    }
  }
  if (best === null) throw new Error('L3-T1 FATAL — the N rule found no feasible design.');
  best.feasibleCount = feasibleCount;
  return best;
};

/* ========================================================================== */
/* §6 THE BATTERY                                                              */
/* ========================================================================== */
const R_RUN = R_ENV ?? (MODE === 'smoke' ? 2 : R_FROZEN);
const M_RUN = M_ENV ?? (MODE === 'smoke' ? 1 : M_FROZEN);
const MATCHES_PER_REPLICATE = FIXTURES_PER_SEASON * M_RUN;
const BASE_RUN = MODE === 'smoke' && R_ENV === null && M_ENV === null ? SMOKE_BASE
  : (IS_PREFLIGHT ? GUARD_BASE : BATTERY_BASE);

type Cell = { lunges: number; punished: number };
const emptyCell = (): Cell => ({ lunges: 0, punished: 0 });
interface BookSnap { all: Cell[]; clean: Cell[] }
interface Replicate {
  r: number;
  /** per book (side), per checkpoint index, the raw cells (ALL and CLEAN). */
  snaps: BookSnap[][];
  /** the in-world book cells at the end (the gLedgerEq comparison target). */
  inWorld: Cell[][];
  guardsLearn: GuardRow[];
  guardsOff: GuardRow[];
  identical: boolean[];
  armOkLearn: boolean[];
  armOkOff: boolean[];
  vetoes: number;
  closed: number;
  censored: number;
  opened: number;
  fired: number;
  spanTicksSeen: Set<number>;
  worldOk: boolean[];
}

const runBattery = (): Replicate[] => {
  const out: Replicate[] = [];
  for (let r = 0; r < R_RUN; r++) {
    const books: Books = [new DefenceAccountBook(), new DefenceAccountBook()];
    const running: BookSnap = {
      all: [emptyCell(), emptyCell(), emptyCell(), emptyCell()],
      clean: [emptyCell(), emptyCell(), emptyCell(), emptyCell()],
    };
    // index = side * L3_DEFENCE_GROUPS + group
    const snaps: BookSnap[][] = [[], []];
    const rep: Replicate = {
      r,
      snaps,
      inWorld: [[emptyCell(), emptyCell()], [emptyCell(), emptyCell()]],
      guardsLearn: [], guardsOff: [], identical: [], armOkLearn: [], armOkOff: [],
      vetoes: 0, closed: 0, censored: 0, opened: 0, fired: 0,
      spanTicksSeen: new Set<number>(), worldOk: [],
    };
    for (let i = 0; i < MATCHES_PER_REPLICATE; i++) {
      const seed = BASE_RUN + r * MATCHES_PER_REPLICATE + i;
      const wl = walk(seed, 'learnOnly', books);
      const wo = walk(seed, 'off', null);
      rep.identical.push(wl.signature === wo.signature);
      rep.armOkLearn.push(wl.armOk);
      rep.armOkOff.push(wo.armOk);
      rep.guardsLearn.push(wl.guards);
      rep.guardsOff.push(wo.guards);
      rep.vetoes += wl.vetoes + wo.vetoes;
      rep.closed += wl.closed;
      rep.censored += wl.censored;
      rep.opened += wl.opened;
      rep.fired += wl.fired;
      for (const l of wl.labels) {
        rep.spanTicksSeen.add(l.spanTicks);
        const idx = l.side * L3_DEFENCE_GROUPS + l.group;
        running.all[idx].lunges += 1;
        if (l.punished) running.all[idx].punished += 1;
        if (!l.spansRestart) {
          running.clean[idx].lunges += 1;
          if (l.punished) running.clean[idx].punished += 1;
        }
      }
      const season = Math.floor(i / FIXTURES_PER_SEASON) + 1;
      const endOfSeason = (i + 1) % FIXTURES_PER_SEASON === 0;
      if (endOfSeason && CHECKPOINT_SEASONS.includes(season)) {
        for (let side = 0; side < 2; side++) {
          snaps[side].push({
            all: [0, 1].map((g) => ({ ...running.all[side * L3_DEFENCE_GROUPS + g] })),
            clean: [0, 1].map((g) => ({ ...running.clean[side * L3_DEFENCE_GROUPS + g] })),
          });
        }
      }
    }
    for (let side = 0; side < 2; side++) {
      for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
        rep.inWorld[side][g] = {
          lunges: books[side].lunges[g],
          punished: books[side].punished[g],
        };
      }
    }
    out.push(rep);
    banner(`  [l3-t1] replicate ${r + 1}/${R_RUN} done — ${rep.closed} labels closed`);
  }
  return out;
};

/* ========================================================================== */
/* §7 SCORING — every headline re-derives from the STORED cells alone           */
/* ========================================================================== */
type Split = 'all' | 'clean';
const bookPair = (rep: Replicate, side: number, cp: number, split: Split): Cell[] => {
  const s = rep.snaps[side][cp];
  return split === 'all' ? s.all : s.clean;
};
const ordered = (pair: Cell[]): boolean | null => {
  if (pair[0].lunges === 0 || pair[1].lunges === 0) return null; // no belief in a group
  return pair[1].punished / pair[1].lunges > pair[0].punished / pair[0].lunges;
};
const gapOf = (pair: Cell[]): number => (pair[0].lunges === 0 || pair[1].lunges === 0
  ? Number.NaN
  : pair[1].punished / pair[1].lunges - pair[0].punished / pair[0].lunges);

interface Score {
  seasons: number;
  split: Split;
  booksTotal: number;
  booksOrdered: number;
  share: number;
  meanControlled: number;
  meanReckless: number;
  meanGapPp: number;
  gapCi95Pp: [number, number];
  pooledControlled: number;
  pooledReckless: number;
  pooledGapPp: number;
  pooledGapCi95Pp: [number, number];
  labels: number;
}
/** the bootstrap rng — the stats stream, opened at STATS_BASE. */
let statsRng = new Rng(STATS_BASE);
const resetStats = (): void => { statsRng = new Rng(STATS_BASE); };
const bootCi = (perReplicate: number[], resamples: number): [number, number] => {
  const n = perReplicate.length;
  const vals: number[] = [];
  for (let b = 0; b < resamples; b++) {
    let s = 0; let cnt = 0;
    for (let i = 0; i < n; i++) {
      const pick = perReplicate[Math.floor(statsRng.next() * n) % n];
      if (Number.isFinite(pick)) { s += pick; cnt += 1; }
    }
    vals.push(cnt === 0 ? Number.NaN : s / cnt);
  }
  const s = vals.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  return [s[Math.floor(0.025 * s.length)], s[Math.min(s.length - 1, Math.floor(0.975 * s.length))]];
};
const scoreAt = (reps: Replicate[], cp: number, split: Split): Score => {
  let booksTotal = 0; let booksOrdered = 0; let labels = 0;
  const pooled = [emptyCell(), emptyCell()];
  const perRepGap: number[] = [];
  const perRepPooledGap: number[] = [];
  const beliefs: number[][] = [[], []];
  for (const rep of reps) {
    const gaps: number[] = [];
    const repPooled = [emptyCell(), emptyCell()];
    for (let side = 0; side < 2; side++) {
      const pair = bookPair(rep, side, cp, split);
      booksTotal += 1;
      const o = ordered(pair);
      if (o === true) booksOrdered += 1;
      const g = gapOf(pair);
      if (Number.isFinite(g)) gaps.push(g);
      for (let gi = 0; gi < 2; gi++) {
        pooled[gi].lunges += pair[gi].lunges;
        pooled[gi].punished += pair[gi].punished;
        repPooled[gi].lunges += pair[gi].lunges;
        repPooled[gi].punished += pair[gi].punished;
        labels += pair[gi].lunges;
        if (pair[gi].lunges > 0) beliefs[gi].push(pair[gi].punished / pair[gi].lunges);
      }
    }
    perRepGap.push(mean(gaps));
    perRepPooledGap.push(repPooled[0].lunges > 0 && repPooled[1].lunges > 0
      ? repPooled[1].punished / repPooled[1].lunges - repPooled[0].punished / repPooled[0].lunges
      : Number.NaN);
  }
  const ciGap = bootCi(perRepGap, BOOTSTRAP);
  const ciPooled = bootCi(perRepPooledGap, BOOTSTRAP);
  return {
    seasons: CHECKPOINT_SEASONS[cp],
    split,
    booksTotal,
    booksOrdered,
    share: booksOrdered / booksTotal,
    meanControlled: mean(beliefs[0]),
    meanReckless: mean(beliefs[1]),
    meanGapPp: mean(perRepGap) * 100,
    gapCi95Pp: [ciGap[0] * 100, ciGap[1] * 100],
    pooledControlled: pooled[0].punished / pooled[0].lunges,
    pooledReckless: pooled[1].punished / pooled[1].lunges,
    pooledGapPp: (pooled[1].punished / pooled[1].lunges
      - pooled[0].punished / pooled[0].lunges) * 100,
    pooledGapCi95Pp: [ciPooled[0] * 100, ciPooled[1] * 100],
    labels,
  };
};

/* ========================================================================== */
/* §8 THE DETERMINISTIC CORE                                                   */
/* ========================================================================== */
interface Core {
  deff: DeffOut;
  sizing: Sizing;
  reps: Replicate[];
  scores: Score[];
  finalAll: Score;
  finalClean: Score;
}
const runCore = (): Core => {
  const deff = deffRewalk();
  const sizing = deriveSizing(deff.deff);
  const reps = runBattery();
  resetStats();
  const scores: Score[] = [];
  const cps = reps[0].snaps[0].length;
  for (let cp = 0; cp < cps; cp++) {
    scores.push(scoreAt(reps, cp, 'all'));
    scores.push(scoreAt(reps, cp, 'clean'));
  }
  const last = cps - 1;
  return {
    deff, sizing, reps, scores,
    finalAll: scoreAt(reps, last, 'all'),
    finalClean: scoreAt(reps, last, 'clean'),
  };
};
const coreDigest = (c: Core): string => sha(canonical({
  deff: c.deff,
  sizing: c.sizing,
  scores: c.scores,
  cells: c.reps.map((r) => ({ inWorld: r.inWorld, snaps: r.snaps })),
  identical: c.reps.map((r) => r.identical.every(Boolean)),
}));

banner(`  [l3-t1] mode=${MODE} R=${R_RUN} M=${M_RUN} seasons · `
  + `${R_RUN * MATCHES_PER_REPLICATE} seeds × 2 arms × 2 G-DET runs`);
const coreA = runCore();
const digestA = coreDigest(coreA);
banner('  [l3-t1] G-DET second run…');
const coreB = runCore();
const digestB = coreDigest(coreB);
const C = coreA;

/* ========================================================================== */
/* §9 THE READINGS THE GATES SCORE                                             */
/* ========================================================================== */
const ALL_LABEL_SPANS = new Set<number>();
for (const rep of C.reps) for (const s of rep.spanTicksSeen) ALL_LABEL_SPANS.add(s);

/** gLedgerEq: the probe's own per-label aggregation vs the in-world book cells. */
const ledgerMismatches = (() => {
  let bad = 0; let compared = 0;
  const lastCp = C.reps[0].snaps[0].length - 1;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      const pair = bookPair(rep, side, lastCp, 'all');
      for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
        compared += 1;
        if (pair[g].lunges !== rep.inWorld[side][g].lunges
          || pair[g].punished !== rep.inWorld[side][g].punished) bad += 1;
      }
    }
  }
  return { bad, compared };
})();

/** the phase partition — exhaustive and disjoint by construction, MEASURED anyway. */
const phasePartition = (() => {
  const lastCp = C.reps[0].snaps[0].length - 1;
  let all = 0; let clean = 0; let spanning = 0;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      const a = bookPair(rep, side, lastCp, 'all');
      const c = bookPair(rep, side, lastCp, 'clean');
      for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
        all += a[g].lunges;
        clean += c[g].lunges;
      }
    }
  }
  spanning = all - clean;
  return { all, clean, spanning, spanShare: all === 0 ? Number.NaN : spanning / all };
})();

/** the guards: paired per replicate, and REQUIRED to be exactly zero (the null control). */
const GUARD_KEYS = ['interceptions', 'offsides', 'goals', 'spreadYOut', 'spacingMedian',
  'spacingUnder4'] as const;
const GUARD_DIRECTION: Record<string, string> = {
  interceptions: 'ceiling', offsides: 'FLAG', goals: 'FLAG',
  spreadYOut: 'floor', spacingMedian: 'floor', spacingUnder4: 'ceiling',
};
const guardRows = GUARD_KEYS.map((k) => {
  const perRep = C.reps.map((rep) => {
    const l = mean(rep.guardsLearn.map((g) => g[k]).filter((v) => Number.isFinite(v)));
    const o = mean(rep.guardsOff.map((g) => g[k]).filter((v) => Number.isFinite(v)));
    return l - o;
  });
  const control = mean(C.reps.flatMap((rep) => rep.guardsOff.map((g) => g[k]))
    .filter((v) => Number.isFinite(v)));
  return {
    ruler: k,
    direction: GUARD_DIRECTION[k],
    control: round(control),
    tolerance: round(NI_FRACTION * Math.abs(control)),
    delta: round(mean(perRep), 12),
    exactlyZero: perRep.every((v) => v === 0),
  };
});

/** the forks — mechanical flags, resolved by nobody here (#203). */
const FORKS = {
  'F-L3-a': {
    fired: C.finalAll.share < C.sizing.tau,
    consequent: 'an HONEST NEGATIVE about the label\'s audibility at real fills',
    companionYardstickOrdered: C.finalAll.pooledGapPp > 0
      && C.finalAll.pooledGapCi95Pp[0] > 0,
  },
  'F-L3-b': {
    fired: (C.finalAll.gapCi95Pp[1] - C.finalAll.gapCi95Pp[0]) / 2
      < (CENSUS_RATE[1] - CENSUS_RATE[0]) * 100
      && C.finalAll.meanGapPp <= 0,
    consequent: 'converged to a DIFFERENT stable shape — diagnostic, the commander\'s',
  },
  'F-L3-c': {
    fired: !C.reps.every((r) => r.identical.every(Boolean))
      || !guardRows.every((g) => g.exactlyZero)
      || C.reps.some((r) => r.vetoes > 0),
    consequent: 'the LEARN-ONLY world is not byte-identical (or a veto fired) — STOP',
  },
} as const;

/* ---- the source-side reads (gVetoDark / gValuesUnreachable / xSrcUntouched) -------- */
/** ⭐ THE EXECUTABLE VIEW: block and line comments stripped, so a DOC PATH in a header comment is
 *  not mistaken for a loader (the T0 gNotable form — the check is about what the code can REACH). */
const stripComments = (t: string): string => t
  .replace(/\/\*[\s\S]*?\*\//g, ' ')
  .split('\n').map((l) => l.replace(/\/\/.*$/, ' ')).join('\n');
const srcFiles = (() => {
  const list = gitOut('git ls-files src').split('\n').filter((f) => f.length > 0);
  return list.map((f) => {
    const text = readFileSync(f, 'utf8');
    return { path: f, text, code: stripComments(text) };
  });
})();
const mechanics = srcFiles.find((f) => f.path.endsWith('sim/mechanics.ts'));
const mechLines = (mechanics?.text ?? '').split('\n');
const IDX_JOCKEY = mechLines.findIndex((l) => l.includes('driveNow >') && l.includes('return;'));
const IDX_VETO = mechLines.findIndex((l) => l.includes('l3DefenceDeclines'));
const IDX_COMMIT = mechLines.findIndex((l, i) => i > IDX_VETO && l.includes('tackleAnimTimer'));
const declinesReadSites = srcFiles
  .reduce((a, f) => a + (f.code.match(/declinesLunge/g) ?? []).length, 0);
const vetoFlagInPresets = srcFiles.filter((f) => f.path.includes('game/'))
  .some((f) => f.text.includes('l3DefenceVeto'));

/** gValuesUnreachable — the keyed needle extraction, T0's form replayed. */
const CONTROL_NEEDLE = String(CB_WORLD_VERSION);
const DERIVED_EXEMPT = new Set<string>([
  String(L3_RECKLESS_ARRIVAL), String(L3_DEFENCE_WINDOW_S),
  L3_RECKLESS_ARRIVAL.toFixed(5), L3_DEFENCE_WINDOW_S.toFixed(5),
]);
const needleForms = new Set<string>();
const needleValues = new Set<number>();
let excludedForms = 0;
const addNeedle = (v: unknown): void => {
  if (typeof v !== 'number' || !Number.isFinite(v)) return;
  needleValues.add(v);
  const forms = [String(v), v.toFixed(5), (v * 100).toFixed(3)];
  for (const f of forms) {
    const digits = f.replace(/[^0-9]/g, '').replace(/^0+/, '');
    if (digits.length < 4 || !f.includes('.') || f.split('.')[1].length < 3) { excludedForms += 1; continue; }
    if (DERIVED_EXEMPT.has(f)) { excludedForms += 1; continue; }
    needleForms.add(f);
  }
};
const walkNeedles = (v: unknown, depth = 0): void => {
  if (depth > 8) return;
  if (Array.isArray(v)) { for (const x of v) walkNeedles(x, depth + 1); return; }
  if (v !== null && typeof v === 'object') {
    for (const x of Object.values(v as Record<string, unknown>)) walkNeedles(x, depth + 1);
    return;
  }
  addNeedle(v);
};
/** ⭐ KEYED, like T0's: the ANSWER-valued subtrees only. Walking a whole artifact would drag in
 *  every incidental float and collide with unrelated banked tables by arithmetic accident. */
for (const key of ['tables', 'shape', 'twoWindowContrast', 'vetoFrame', 'stability', 'bands',
  'windows']) walkNeedles((l3c0b as Record<string, unknown>)[key]);
walkNeedles((l3t0 as Record<string, unknown>).smoke);
const srcBlob = srcFiles.map((f) => f.text).join('\n');
const srcCodeBlob = srcFiles.map((f) => f.code).join('\n');
const rawValueHits = [...needleForms].filter((n) => srcBlob.includes(n));
/**
 * ⭐ THE COLLISION ADJUDICATION (T0 §DEV 5's exemption class, done by MACHINE rather than by name).
 * A 4-significant-digit decimal form can appear inside an UNRELATED banked constant by arithmetic
 * accident. For each raw hit, every FULL numeric token in `src/**` containing that form is parsed:
 * if none of them IS a needle value (to 1e-9), the hit is a PREFIX COLLISION — published with its
 * file:line — and not a leak. If any full token equals a measured answer, the gate goes RED.
 */
const collisionRows: { form: string; tokens: string[]; sites: string[]; isLeak: boolean }[] = [];
for (const form of rawValueHits) {
  const tokens = new Set<string>();
  const sites: string[] = [];
  for (const f of srcFiles) {
    const lines = f.text.split('\n');
    lines.forEach((line, i) => {
      if (!line.includes(form)) return;
      sites.push(`${f.path}:${i + 1}`);
      for (const t of line.match(/-?\d+\.\d+/g) ?? []) if (t.includes(form)) tokens.add(t);
    });
  }
  const isLeak = [...tokens].some((t) => [...needleValues]
    .some((v) => Math.abs(Math.abs(v) - Math.abs(Number(t))) < 1e-9));
  collisionRows.push({ form, tokens: [...tokens], sites: sites.slice(0, 4), isLeak });
}
const valueHits = collisionRows.filter((r) => r.isLeak).map((r) => r.form);
const prefixCollisions = collisionRows.filter((r) => !r.isLeak);
void srcCodeBlob;
const nameHits = ['l3-c0b-window-decomposition', 'l3-t0-defence-book-seam',
  'l3-c0-lunge-outcome-census', 'l3-t1-convergence-exam'].filter((n) => srcBlob.includes(n));
const loaderHits = srcFiles.filter((f) => /readFileSync|docs\/world-model|import\(/.test(f.code)
  && /l3Defence|defenceBook/.test(f.code)).map((f) => f.path);
const controlNeedleFound = srcBlob.includes(CONTROL_NEEDLE);

/* ---- the league fingerprint, re-derived IN THIS PROCESS ---------------------------- */
const fingerprintOf = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'SKIPPED' : fingerprintOf(1337);

/* ---- gSeed ------------------------------------------------------------------------ */
const CLAIMED: { name: string; range: [number, number] }[] = [
  ...(BASE_RUN === BATTERY_BASE
    ? [{ name: 'L3-T1 battery', range: [BASE_RUN, BASE_RUN + R_RUN * MATCHES_PER_REPLICATE - 1] as [number, number] }]
    : []),
  { name: 'L3-T1 smoke sub-block', range: [SMOKE_BASE, SMOKE_BASE + 13] },
  { name: 'L3-T1 guard/preflight block', range: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1] },
  {
    name: 'L3-T1 wall-clock preflight (declared, §DEV 3)',
    range: [PREFLIGHT_WALKED_BASE, PREFLIGHT_WALKED_BASE + PREFLIGHT_WALKED_N - 1],
  },
  { name: 'L3-T1 gWorld construction seed', range: [GWORLD_SEED, GWORLD_SEED] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => `${c.name} ∩ ${p.name}`));
const claimedInternalClashes = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => `${c.name} ∩ ${d.name}`));
/** ⭐ THE INVERTED PREDICATE: the deff re-walk MUST collide with the consumed ledger. */
const rewalkCollides = CONSUMED.some((p) => overlaps(
  [DEFF_REWALK_BASE, DEFF_REWALK_BASE + DEFF_REWALK_N - 1], p.range,
));

/* ---- gWorld: the never-stepped construction seed ---------------------------------- */
const worldSeedMatch = matchOf(GWORLD_SEED, 'learnOnly', null);
const worldSeedOk = cbArmedVersion(worldSeedMatch) === CB_WORLD_VERSION;

/* ---- gTauLive: the DEAD-PREDICATE bar, exercised on this instrument's own code ----- */
const synthetic = (orderedShare: number, books: number): Cell[][] => {
  const out: Cell[][] = [];
  for (let b = 0; b < books; b++) {
    const isOrdered = b < Math.round(orderedShare * books);
    out.push(isOrdered
      ? [{ lunges: 100, punished: 70 }, { lunges: 100, punished: 80 }]
      : [{ lunges: 100, punished: 80 }, { lunges: 100, punished: 70 }]);
  }
  return out;
};
const shareOf = (books: Cell[][]): number => books
  .filter((p) => ordered(p) === true).length / books.length;
const tauAllOrdered = shareOf(synthetic(1, 16));
const tauNull = shareOf(synthetic(0, 16));
const tieBooks: Cell[][] = [[{ lunges: 100, punished: 80 }, { lunges: 50, punished: 40 }]];
const tieNotOrdered = ordered(tieBooks[0]) === false;
/** flipping the comparison on the REAL cells must flip the verdict. */
const flippedShare = (() => {
  const lastCp = C.reps[0].snaps[0].length - 1;
  let n = 0; let k = 0;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      const p = bookPair(rep, side, lastCp, 'all');
      if (p[0].lunges === 0 || p[1].lunges === 0) continue;
      n += 1;
      if (p[0].punished / p[0].lunges > p[1].punished / p[1].lunges) k += 1;
    }
  }
  return n === 0 ? Number.NaN : k / n;
})();

/* ---- gBookMath -------------------------------------------------------------------- */
const bookMath = (() => {
  let cells = 0; let bad = 0;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      for (const snap of rep.snaps[side]) {
        for (const c of [...snap.all, ...snap.clean]) {
          cells += 1;
          if (c.punished > c.lunges || c.lunges < 0 || c.punished < 0) bad += 1;
        }
      }
    }
  }
  return { cells, bad };
})();

/* ---- gCurve ----------------------------------------------------------------------- */
const curveMonotone = (() => {
  let violations = 0;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      const snaps = rep.snaps[side];
      for (let i = 1; i < snaps.length; i++) {
        for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
          if (snaps[i].all[g].lunges < snaps[i - 1].all[g].lunges
            || snaps[i].all[g].punished < snaps[i - 1].all[g].punished
            || snaps[i].clean[g].lunges < snaps[i - 1].clean[g].lunges) violations += 1;
        }
      }
    }
  }
  return violations;
})();

/* ---- gBooksLive ------------------------------------------------------------------- */
const booksLive = (() => {
  const lastCp = C.reps[0].snaps[0].length - 1;
  let books = 0; let bothGroups = 0; let withPunishment = 0;
  let minReckless = Number.POSITIVE_INFINITY; let minControlled = Number.POSITIVE_INFINITY;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      const p = bookPair(rep, side, lastCp, 'all');
      books += 1;
      if (p[0].lunges > 0 && p[1].lunges > 0) bothGroups += 1;
      if (p[0].punished + p[1].punished > 0) withPunishment += 1;
      minReckless = Math.min(minReckless, p[1].lunges);
      minControlled = Math.min(minControlled, p[0].lunges);
    }
  }
  return { books, bothGroups, withPunishment, minReckless, minControlled };
})();

/* ========================================================================== */
/* §10 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean;
  live: boolean;
}
interface GateSpec<I> {
  name: string;
  fn: (i: I) => Conj;
  input: I;
  mutants: readonly { conjunct: string; name: string; mutate: (i: I) => I }[];
}
const REGISTRY: GateSpec<never>[] = [];
const registerGate = <I>(spec: GateSpec<I>): void => { REGISTRY.push(spec as unknown as GateSpec<never>); };
const runMutant = <I>(
  gate: string, name: string, conjunct: string, fn: (i: I) => Conj, base: Conj, mutated: I,
): MutantResult => {
  const out = fn(mutated);
  const flipped = base[conjunct] === true && out[conjunct] === false;
  const othersSurvived = Object.keys(base).filter((k) => k !== conjunct)
    .every((k) => out[k] === base[k]);
  return { gate, name, conjunct, flipped, othersSurvived, live: flipped && othersSurvived };
};

/* ---- 1 gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: digestA === digestB, digest: digestA },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second run differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- 2 xSrcUntouched ---- */
const srcDiff = gitOut('git diff --stat -- src');
const srcStatus = gitOut('git status --porcelain -- src');
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({ noWorktreeDiff: i.diff === '', noUntrackedOrStaged: i.status === '' }),
  input: { diff: srcDiff, status: srcStatus },
  mutants: [
    { conjunct: 'noWorktreeDiff', name: 'src moved in the worktree', mutate: (i) => ({ ...i, diff: 'src/sim/Match.ts | 2 +-' }) },
    { conjunct: 'noUntrackedOrStaged', name: 'an untracked src file appeared', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- 3 xFpProd ---- */
registerGate<{ observed: string; skipped: boolean }>({
  name: 'xFpProd',
  fn: (i) => ({
    theProductionFingerprintIsUnmoved: i.skipped || i.observed === FINGERPRINT_BASELINE,
    itWasActuallyRecomputed: !i.skipped,
  }),
  input: { observed: fpObserved, skipped: SKIP_FP },
  mutants: [
    { conjunct: 'theProductionFingerprintIsUnmoved', name: 'the fingerprint moved', mutate: (i) => ({ ...i, observed: 'deadbeef' }) },
    { conjunct: 'itWasActuallyRecomputed', name: 'the fingerprint was skipped', mutate: (i) => ({ ...i, skipped: true }) },
  ],
});

/* ---- 4 gWorld ---- */
const worldOkCount = C.reps.reduce((a, r) => a + r.armOkLearn.filter(Boolean).length
  + r.armOkOff.filter(Boolean).length, 0);
const worldTotal = C.reps.reduce((a, r) => a + r.armOkLearn.length + r.armOkOff.length, 0);
registerGate<{ ok: number; total: number; constructionSeedOk: boolean }>({
  name: 'gWorld',
  fn: (i) => ({
    everyArmMatchIsTheWorldOfRecord: i.ok === i.total,
    theCheckIsNonVacuous: i.total > 0,
    theConstructionSeedIsTheWorldOfRecord: i.constructionSeedOk,
  }),
  input: { ok: worldOkCount, total: worldTotal, constructionSeedOk: worldSeedOk },
  mutants: [
    { conjunct: 'everyArmMatchIsTheWorldOfRecord', name: 'one arm-match was not the world of record', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theCheckIsNonVacuous', name: 'no arm-match was checked at all', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
    { conjunct: 'theConstructionSeedIsTheWorldOfRecord', name: 'the construction seed was bare', mutate: (i) => ({ ...i, constructionSeedOk: false }) },
  ],
});

/* ---- 5 gByteIdentical (F-L3-c's gate) ---- */
const identCount = C.reps.reduce((a, r) => a + r.identical.filter(Boolean).length, 0);
const identTotal = C.reps.reduce((a, r) => a + r.identical.length, 0);
registerGate<{ ok: number; total: number; labels: number }>({
  name: 'gByteIdentical',
  fn: (i) => ({
    learnOnlyIsByteIdenticalToOff: i.ok === i.total,
    theComparisonIsNonVacuous: i.total > 0,
    theMachineryWasLIVEWhileIdentical: i.labels > 0,
  }),
  input: { ok: identCount, total: identTotal, labels: C.reps.reduce((a, r) => a + r.closed, 0) },
  mutants: [
    { conjunct: 'learnOnlyIsByteIdenticalToOff', name: 'learning alone moved the world', mutate: (i) => ({ ...i, ok: i.ok - 1 }) },
    { conjunct: 'theComparisonIsNonVacuous', name: 'no seed was compared', mutate: (i) => ({ ...i, ok: 0, total: 0 }) },
    { conjunct: 'theMachineryWasLIVEWhileIdentical', name: 'the books never filled', mutate: (i) => ({ ...i, labels: 0 }) },
  ],
});

/* ---- 6 gArms ---- */
const armSample = armConjuncts(matchOf(GWORLD_SEED, 'learnOnly', null), 'learnOnly', null, GWORLD_SEED);
registerGate<{ sample: Record<string, boolean>; battery: boolean; conjuncts: number }>({
  name: 'gArms',
  fn: (i) => ({
    everyArmConjunctHoldsOnASample: Object.values(i.sample).every(Boolean),
    everyArmConjunctHoldsOnTheBattery: i.battery,
    theConjunctSetIsTheDeclaredOne: i.conjuncts === 7,
  }),
  input: {
    sample: armSample,
    battery: C.reps.every((r) => r.armOkLearn.every(Boolean) && r.armOkOff.every(Boolean)),
    conjuncts: Object.keys(armSample).length,
  },
  mutants: [
    { conjunct: 'everyArmConjunctHoldsOnASample', name: 'the veto door was open on the sample', mutate: (i) => ({ ...i, sample: { ...i.sample, vetoDoorShut: false } }) },
    { conjunct: 'everyArmConjunctHoldsOnTheBattery', name: 'a battery match had the wrong arm', mutate: (i) => ({ ...i, battery: false }) },
    { conjunct: 'theConjunctSetIsTheDeclaredOne', name: 'a conjunct was dropped from the predicate', mutate: (i) => ({ ...i, conjuncts: 6 }) },
  ],
});

/* ---- 7 gBooksLive ---- */
registerGate<typeof booksLive>({
  name: 'gBooksLive',
  fn: (i) => ({
    everyBookHasEventsInBOTHGroups: i.bothGroups === i.books,
    everyBookCarriesAPunishment: i.withPunishment === i.books,
    theBookCountIsTheDesignsB: i.books === 2 * R_RUN,
    nonVacuityAtClaimGrain: i.minReckless > 0 && i.minControlled > 0,
  }),
  input: booksLive,
  mutants: [
    { conjunct: 'everyBookHasEventsInBOTHGroups', name: 'a book never saw a reckless lunge', mutate: (i) => ({ ...i, bothGroups: i.bothGroups - 1 }) },
    { conjunct: 'everyBookCarriesAPunishment', name: 'a book was never punished', mutate: (i) => ({ ...i, withPunishment: i.withPunishment - 1 }) },
    { conjunct: 'theBookCountIsTheDesignsB', name: 'the book count is not 2R', mutate: (i) => ({ ...i, books: i.books + 1, bothGroups: i.bothGroups + 1, withPunishment: i.withPunishment + 1 }) },
    { conjunct: 'nonVacuityAtClaimGrain', name: 'the binding group was empty somewhere', mutate: (i) => ({ ...i, minReckless: 0 }) },
  ],
});

/* ---- 8 gBookMath ---- */
registerGate<{ cells: number; bad: number; tieNotOrdered: boolean }>({
  name: 'gBookMath',
  fn: (i) => ({
    everyStoredCellIsWellFormed: i.bad === 0,
    theCellSweepIsNonVacuous: i.cells > 0,
    aTieIsNOTOrdered: i.tieNotOrdered,
  }),
  input: { ...bookMath, tieNotOrdered },
  mutants: [
    { conjunct: 'everyStoredCellIsWellFormed', name: 'punished exceeded lunges somewhere', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'theCellSweepIsNonVacuous', name: 'no cell was checked', mutate: (i) => ({ ...i, cells: 0, bad: 0 }) },
    { conjunct: 'aTieIsNOTOrdered', name: 'strictness was dropped', mutate: (i) => ({ ...i, tieNotOrdered: false }) },
  ],
});

/* ---- 9 gLedgerEq ---- */
registerGate<{ bad: number; compared: number }>({
  name: 'gLedgerEq',
  fn: (i) => ({
    theProbeSideReLabellingEqualsTheBook: i.bad === 0,
    theComparisonIsNonVacuous: i.compared > 0,
  }),
  input: ledgerMismatches,
  mutants: [
    { conjunct: 'theProbeSideReLabellingEqualsTheBook', name: 'a cell disagreed with the in-world book', mutate: (i) => ({ ...i, bad: 1 }) },
    { conjunct: 'theComparisonIsNonVacuous', name: 'no cell was compared', mutate: (i) => ({ ...i, bad: 0, compared: 0 }) },
  ],
});

/* ---- 10 gWindowApplied ---- */
registerGate<{ spans: number[]; nominal: number; labels: number }>({
  name: 'gWindowApplied',
  fn: (i) => ({
    everyLabelClosesAtTheAPPLIEDWindow: i.spans.every((s) => s === APPLIED_WINDOW_TICKS),
    theSpanReadIsNonVacuous: i.labels > 0 && i.spans.length > 0,
    theAppliedWindowIsTheGridCeilingOfTheNominal:
      Math.ceil(i.nominal / DT - 1e-9) === APPLIED_WINDOW_TICKS,
  }),
  input: {
    spans: [...ALL_LABEL_SPANS].sort((a, b) => a - b),
    nominal: L3_DEFENCE_WINDOW_S,
    labels: C.reps.reduce((a, r) => a + r.closed, 0),
  },
  mutants: [
    { conjunct: 'everyLabelClosesAtTheAPPLIEDWindow', name: 'a label closed off the 54-tick grid', mutate: (i) => ({ ...i, spans: [53, 54] }) },
    { conjunct: 'theSpanReadIsNonVacuous', name: 'no label span was read', mutate: (i) => ({ ...i, spans: [], labels: 0 }) },
    { conjunct: 'theAppliedWindowIsTheGridCeilingOfTheNominal', name: 'the nominal window moved off its grid cell', mutate: (i) => ({ ...i, nominal: 0.2 }) },
  ],
});

/* ---- 11 gDeffRewalk ---- */
const rewalkReceipt = {
  cellsMatch: SMOKE_LUNGES.length === 2
    && C.deff.cells[0].lunges === SMOKE_LUNGES[0] && C.deff.cells[0].punished === SMOKE_PUNISHED[0]
    && C.deff.cells[1].lunges === SMOKE_LUNGES[1] && C.deff.cells[1].punished === SMOKE_PUNISHED[1],
  closed: C.deff.closed,
  committedClosed: SMOKE_LUNGES[0] + SMOKE_LUNGES[1],
  deff: C.deff.deff,
};
registerGate<typeof rewalkReceipt>({
  name: 'gDeffRewalk',
  fn: (i) => ({
    theRewalkReproducesT0sCommittedCells: i.cellsMatch,
    theClosedLabelCountMatches: i.closed > 0 && i.closed === i.committedClosed,
    deffIsTheFrozenLiteral: Math.abs(i.deff - FROZEN_SIZING.deff) < 1e-9,
  }),
  input: rewalkReceipt,
  mutants: [
    { conjunct: 'theRewalkReproducesT0sCommittedCells', name: 'the walker is a look-alike, not the seam\'s', mutate: (i) => ({ ...i, cellsMatch: false }) },
    { conjunct: 'theClosedLabelCountMatches', name: 'the closed-label count drifted', mutate: (i) => ({ ...i, closed: i.closed + 1 }) },
    { conjunct: 'deffIsTheFrozenLiteral', name: 'deff moved off the frozen literal', mutate: (i) => ({ ...i, deff: 2.5 }) },
  ],
});

/* ---- 12 gN ---- */
const sizingMatches = (s: Sizing): boolean => {
  const near = (a: number, b: number, eps = 5e-5): boolean => Math.abs(a - b) <= eps;
  return s.rStar === FROZEN_SIZING.rStar && s.mStar === FROZEN_SIZING.mStar
    && s.nEff[0] === FROZEN_SIZING.nEff[0] && s.nEff[1] === FROZEN_SIZING.nEff[1]
    && near(s.q, FROZEN_SIZING.qPerBook) && near(s.qNull, FROZEN_SIZING.qNull)
    && near(s.designRates[0], FROZEN_SIZING.designRates[0], 1e-3)
    && near(s.designRates[1], FROZEN_SIZING.designRates[1], 1e-3);
};
registerGate<{ s: Sizing; ranAtStar: boolean }>({
  name: 'gN',
  fn: (i) => ({
    theFrozenLiteralsAreTheRecomputedDerivation: sizingMatches(i.s),
    powerClearsTargetOnBOTHReadings: i.s.powerIndependent >= POWER_TARGET
      && i.s.powerConservative >= POWER_TARGET,
    theThresholdIsFAILABLE: i.s.failabilityIndependent <= FAILABILITY_TARGET,
    tauIsTheDerivedMinimum: i.s.tau === i.s.k / (2 * i.s.rStar)
      && i.s.tau === FROZEN_SIZING.tau,
    theExamRanAtRStarMStar: i.ranAtStar,
  }),
  input: { s: C.sizing, ranAtStar: MODE === 'full' && R_RUN === C.sizing.rStar && M_RUN === C.sizing.mStar },
  mutants: [
    { conjunct: 'theFrozenLiteralsAreTheRecomputedDerivation', name: 'a frozen sizing literal disagrees', mutate: (i) => ({ ...i, s: { ...i.s, mStar: 99 } }) },
    { conjunct: 'powerClearsTargetOnBOTHReadings', name: 'the conservative reading fell short', mutate: (i) => ({ ...i, s: { ...i.s, powerConservative: 0.1 } }) },
    { conjunct: 'theThresholdIsFAILABLE', name: 'a null world would clear tau', mutate: (i) => ({ ...i, s: { ...i.s, failabilityIndependent: 0.5 } }) },
    { conjunct: 'tauIsTheDerivedMinimum', name: 'tau was typed rather than derived', mutate: (i) => ({ ...i, s: { ...i.s, k: i.s.k + 1 } }) },
    { conjunct: 'theExamRanAtRStarMStar', name: 'the battery ran at a different size', mutate: (i) => ({ ...i, ranAtStar: false }) },
  ],
});

/* ---- 13 gTauLive (the DEAD-PREDICATE bar) ---- */
registerGate<{ allOrdered: number; nullShare: number; tau: number; flipped: number; real: number }>({
  name: 'gTauLive',
  fn: (i) => ({
    tauIsPASSABLEByConstruction: i.allOrdered >= i.tau,
    tauIsFAILABLEByConstruction: i.nullShare < i.tau,
    flippingTheComparisonFlipsTheReading:
      Number.isFinite(i.flipped) && Math.abs((i.flipped + i.real) - 1) < 1e-9,
  }),
  input: {
    allOrdered: tauAllOrdered, nullShare: tauNull, tau: C.sizing.tau,
    flipped: flippedShare, real: C.finalAll.share,
  },
  mutants: [
    { conjunct: 'tauIsPASSABLEByConstruction', name: 'an all-ordered world could not clear tau', mutate: (i) => ({ ...i, allOrdered: 0 }) },
    { conjunct: 'tauIsFAILABLEByConstruction', name: 'a null world clears tau anyway (a DEAD predicate)', mutate: (i) => ({ ...i, nullShare: 1 }) },
    { conjunct: 'flippingTheComparisonFlipsTheReading', name: 'the direction test is inert', mutate: (i) => ({ ...i, flipped: i.flipped + 0.5 }) },
  ],
});

/* ---- 14 gCurve ---- */
registerGate<{ violations: number; checkpoints: number; endsAtM: boolean }>({
  name: 'gCurve',
  fn: (i) => ({
    everyCellIsMonotoneAlongTheStream: i.violations === 0,
    theCheckpointStreamIsTheFrozenList: i.checkpoints === CHECKPOINT_SEASONS
      .filter((s) => s <= M_RUN).length,
    theStreamEndsAtM: i.endsAtM,
  }),
  input: {
    violations: curveMonotone,
    checkpoints: C.reps[0].snaps[0].length,
    endsAtM: CHECKPOINT_SEASONS.filter((s) => s <= M_RUN).slice(-1)[0] === M_RUN,
  },
  mutants: [
    { conjunct: 'everyCellIsMonotoneAlongTheStream', name: 'a cell decreased along the curve', mutate: (i) => ({ ...i, violations: 1 }) },
    { conjunct: 'theCheckpointStreamIsTheFrozenList', name: 'a checkpoint went missing', mutate: (i) => ({ ...i, checkpoints: i.checkpoints - 1 }) },
    { conjunct: 'theStreamEndsAtM', name: 'the stream stopped short of M', mutate: (i) => ({ ...i, endsAtM: false }) },
  ],
});

/* ---- 15 gCells ---- */
const rederivedShare = (() => {
  const lastCp = C.reps[0].snaps[0].length - 1;
  let n = 0; let k = 0;
  for (const rep of C.reps) {
    for (let side = 0; side < 2; side++) {
      const p = bookPair(rep, side, lastCp, 'all');
      n += 1;
      if (ordered(p) === true) k += 1;
    }
  }
  return k / n;
})();
registerGate<{ rederived: number; published: number; stored: number }>({
  name: 'gCells',
  fn: (i) => ({
    thePublishedShareReDerivesFromStoredCellsAlone: Math.abs(i.rederived - i.published) < 1e-12,
    theStoredCellStreamIsNonEmpty: i.stored > 0,
  }),
  input: { rederived: rederivedShare, published: C.finalAll.share, stored: bookMath.cells },
  mutants: [
    { conjunct: 'thePublishedShareReDerivesFromStoredCellsAlone', name: 'the headline does not re-derive', mutate: (i) => ({ ...i, published: i.published + 0.1 }) },
    { conjunct: 'theStoredCellStreamIsNonEmpty', name: 'no cells were stored', mutate: (i) => ({ ...i, stored: 0 }) },
  ],
});

/* ---- 16 gPhase ---- */
registerGate<typeof phasePartition>({
  name: 'gPhase',
  fn: (i) => ({
    thePartitionIsExhaustiveAndDisjoint: i.clean + i.spanning === i.all,
    bothSidesOfTheSplitAreNonVacuous: i.clean > 0 && i.spanning > 0,
    theSpanShareIsAProperFraction: i.spanShare >= 0 && i.spanShare <= 1,
  }),
  input: phasePartition,
  mutants: [
    { conjunct: 'thePartitionIsExhaustiveAndDisjoint', name: 'a label fell out of both halves', mutate: (i) => ({ ...i, clean: i.clean - 1 }) },
    { conjunct: 'bothSidesOfTheSplitAreNonVacuous', name: 'no label spanned a restart at all', mutate: (i) => ({ ...i, spanning: 0, all: i.clean }) },
    { conjunct: 'theSpanShareIsAProperFraction', name: 'the span share is not a fraction', mutate: (i) => ({ ...i, spanShare: 2 }) },
  ],
});

/* ---- 17 gVetoDark ---- */
registerGate<{
  vetoes: number; readSites: number; jockey: number; veto: number; commit: number;
  inPresets: boolean;
}>({
  name: 'gVetoDark',
  fn: (i) => ({
    zeroVetoesInTheWholeBattery: i.vetoes === 0,
    declinesLungeIsReadInExactlyTwoPlaces: i.readSites === 2,
    theVetoSiteSitsBetweenTheJockeyGateAndTheCommitLine:
      i.jockey > 0 && i.veto > i.jockey && i.commit > i.veto,
    theVetoDoorIsInNoPreset: !i.inPresets,
  }),
  input: {
    vetoes: C.reps.reduce((a, r) => a + r.vetoes, 0),
    readSites: declinesReadSites,
    jockey: IDX_JOCKEY, veto: IDX_VETO, commit: IDX_COMMIT,
    inPresets: vetoFlagInPresets,
  },
  mutants: [
    { conjunct: 'zeroVetoesInTheWholeBattery', name: 'a veto was served', mutate: (i) => ({ ...i, vetoes: 1 }) },
    { conjunct: 'declinesLungeIsReadInExactlyTwoPlaces', name: 'a second consumer appeared', mutate: (i) => ({ ...i, readSites: 3 }) },
    { conjunct: 'theVetoSiteSitsBetweenTheJockeyGateAndTheCommitLine', name: 'the veto moved before the jockey gate', mutate: (i) => ({ ...i, veto: 1 }) },
    { conjunct: 'theVetoDoorIsInNoPreset', name: 'a preset armed the veto', mutate: (i) => ({ ...i, inPresets: true }) },
  ],
});

/* ---- 18 gValuesUnreachable ---- */
registerGate<{
  valueHits: string[]; nameHits: string[]; loaderHits: string[]; control: boolean; forms: number;
}>({
  name: 'gValuesUnreachable',
  fn: (i) => ({
    noMeasuredValueIsReachableFromSrc: i.valueHits.length === 0,
    noArtifactNameIsReachableFromSrc: i.nameHits.length === 0,
    noLoaderOrDocPathInSeamSource: i.loaderHits.length === 0,
    theControlNeedleWasFOUND: i.control,
    theNeedleSetIsNonVacuous: i.forms > 100,
  }),
  input: {
    valueHits, nameHits, loaderHits, control: controlNeedleFound, forms: needleForms.size,
  },
  mutants: [
    { conjunct: 'noMeasuredValueIsReachableFromSrc', name: 'a census value reached src', mutate: (i) => ({ ...i, valueHits: ['0.83050'] }) },
    { conjunct: 'noArtifactNameIsReachableFromSrc', name: 'src names an artifact', mutate: (i) => ({ ...i, nameHits: ['l3-c0b-window-decomposition'] }) },
    { conjunct: 'noLoaderOrDocPathInSeamSource', name: 'the seam loads a doc path', mutate: (i) => ({ ...i, loaderHits: ['src/ai/defenceBook.ts'] }) },
    { conjunct: 'theControlNeedleWasFOUND', name: 'the search cannot find anything at all', mutate: (i) => ({ ...i, control: false }) },
    { conjunct: 'theNeedleSetIsNonVacuous', name: 'the needle set was empty', mutate: (i) => ({ ...i, forms: 0 }) },
  ],
});

/* ---- 19 gSeed ---- */
registerGate<{
  clashes: string[]; internal: string[]; collides: boolean; blocks: number;
}>({
  name: 'gSeed',
  fn: (i) => ({
    everyClaimedBlockIsDisjointFromTheLedger: i.clashes.length === 0,
    theClaimedBlocksAreDisjointFromEachOther: i.internal.length === 0,
    theRewalkPredicateIsINVERTEDAndCollides: i.collides,
    theLedgerCheckIsNonVacuous: i.blocks > 0,
  }),
  input: {
    clashes: seedClashes, internal: claimedInternalClashes, collides: rewalkCollides,
    blocks: CLAIMED.length,
  },
  mutants: [
    { conjunct: 'everyClaimedBlockIsDisjointFromTheLedger', name: 'a claimed block collides with a consumed one', mutate: (i) => ({ ...i, clashes: ['x'] }) },
    { conjunct: 'theClaimedBlocksAreDisjointFromEachOther', name: 'two claimed blocks overlap', mutate: (i) => ({ ...i, internal: ['x'] }) },
    { conjunct: 'theRewalkPredicateIsINVERTEDAndCollides', name: 'the re-walk walked fresh seeds', mutate: (i) => ({ ...i, collides: false }) },
    { conjunct: 'theLedgerCheckIsNonVacuous', name: 'nothing was claimed at all', mutate: (i) => ({ ...i, blocks: 0 }) },
  ],
});

/* ---- 20 gStats ---- */
registerGate<{ base: number; bases: readonly number[]; drawn: number }>({
  name: 'gStats',
  fn: (i) => ({
    theBaseIsAtOrAboveTheRulingsFloor: i.base >= 111_200,
    theGapToEveryPublishedBaseIsAtLeast200:
      i.bases.every((b) => Math.abs(b - i.base) >= 200),
    theStreamWasActuallyDrawn: i.drawn > 0,
  }),
  input: { base: STATS_BASE, bases: STATS_PUBLISHED_BASES, drawn: BOOTSTRAP },
  mutants: [
    { conjunct: 'theBaseIsAtOrAboveTheRulingsFloor', name: 'the base fell below the floor', mutate: (i) => ({ ...i, base: 1 }) },
    { conjunct: 'theGapToEveryPublishedBaseIsAtLeast200', name: 'the base collided with a published one', mutate: (i) => ({ ...i, bases: [...i.bases, i.base + 1] }) },
    { conjunct: 'theStreamWasActuallyDrawn', name: 'no bootstrap was drawn', mutate: (i) => ({ ...i, drawn: 0 }) },
  ],
});

/* ---- 21 gEnvClean ---- */
registerGate<{
  rogueOwn: string[]; rogueEngine: string[]; preflight: boolean; out: string;
  syntheticPreflightOut: string;
}>({
  name: 'gEnvClean',
  fn: (i) => ({
    noRogueOwnVariable: i.rogueOwn.length === 0,
    noEngineDoorIsSet: i.rogueEngine.length === 0,
    aPreflightIsRoutedOffTheCanonicalPath: !isCanonicalPath(i.syntheticPreflightOut),
    theRunIsNotAPreflight: !i.preflight,
  }),
  input: {
    rogueOwn: [...rogueOwn], rogueEngine: [...rogueEngine], preflight: IS_PREFLIGHT, out: OUT_PATH,
    syntheticPreflightOut: '/tmp/l3-t1-preflight.json',
  },
  mutants: [
    { conjunct: 'noRogueOwnVariable', name: 'a rogue L3T1_* variable was set', mutate: (i) => ({ ...i, rogueOwn: ['L3T1_X'] }) },
    { conjunct: 'noEngineDoorIsSet', name: 'an engine env door was set', mutate: (i) => ({ ...i, rogueEngine: ['EDS_BUNDLE'] }) },
    { conjunct: 'aPreflightIsRoutedOffTheCanonicalPath', name: 'a preflight would write the canonical artifact', mutate: (i) => ({ ...i, syntheticPreflightOut: OUT_BY_MODE.full }) },
    { conjunct: 'theRunIsNotAPreflight', name: 'the scored run was a preflight', mutate: (i) => ({ ...i, preflight: true, out: '/tmp/x.json' }) },
  ],
});

/* ---- 22 gHashEnvelope ---- */
const envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[] };
registerGate<typeof envelopeInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    theBodyReDerivesItsDigestFromDisk: i.rederivesFromDisk,
    aCrossOUTWithADifferentEnvelopeHasTheSameDigest: i.crossOutIdentical,
    noMachineTimingLeakedIntoTheHashedBody: i.forbidden.length === 0,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'theBodyReDerivesItsDigestFromDisk', name: 'the written body does not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false, crossOutIdentical: i.crossOutIdentical }) },
    { conjunct: 'aCrossOUTWithADifferentEnvelopeHasTheSameDigest', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'noMachineTimingLeakedIntoTheHashedBody', name: 'a wall-clock field entered the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- 23 gMutants ---- */
const gMutantsInput = { uncovered: [] as string[], dead: 0, total: 0 };
registerGate<typeof gMutantsInput>({
  name: 'gMutants',
  fn: (i) => ({
    noUncoveredConjunctNoGhostNoDuplicate: i.uncovered.length === 0,
    everyMutantIsLIVE: i.dead === 0,
    theMapIsNonVacuous: i.total > 0,
  }),
  input: gMutantsInput,
  mutants: [
    { conjunct: 'noUncoveredConjunctNoGhostNoDuplicate', name: 'a conjunct owns no mutant', mutate: (i) => ({ ...i, uncovered: ['x.y'] }) },
    { conjunct: 'everyMutantIsLIVE', name: 'a mutant is dead', mutate: (i) => ({ ...i, dead: 1 }) },
    { conjunct: 'theMapIsNonVacuous', name: 'the coverage map is empty', mutate: (i) => ({ ...i, total: 0, dead: 0 }) },
  ],
});

/* ---- 24 gGuardNull ---- */
registerGate<{ rows: typeof guardRows; identical: boolean }>({
  name: 'gGuardNull',
  fn: (i) => ({
    everyGuardDeltaIsEXACTLYZero: i.rows.every((r) => r.exactlyZero),
    theGuardRowIsNonVacuous: i.rows.length === 6,
    theNullControlRestsOnAByteIdenticalWorld: i.identical,
  }),
  input: { rows: guardRows, identical: identCount === identTotal && identTotal > 0 },
  mutants: [
    { conjunct: 'everyGuardDeltaIsEXACTLYZero', name: 'a guard delta was non-zero', mutate: (i) => ({ ...i, rows: i.rows.map((r, k) => (k === 0 ? { ...r, exactlyZero: false } : r)) }) },
    { conjunct: 'theGuardRowIsNonVacuous', name: 'a ruler went missing', mutate: (i) => ({ ...i, rows: i.rows.slice(1) }) },
    { conjunct: 'theNullControlRestsOnAByteIdenticalWorld', name: 'the worlds were not identical', mutate: (i) => ({ ...i, identical: false }) },
  ],
});

/* ========================================================================== */
/* §11 THE COVERAGE MAP, EXACTLY-ONE ENFORCED (#268.3(a))                       */
/* ========================================================================== */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.input));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  const seen = new Set<string>();
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
    if (seen.has(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(duplicate)`);
    seen.add(mu.conjunct);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('L3-T1 REFUSES TO RUN — the coverage map is incomplete (#268.3(a)):');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}

const runRegistry = (): { gates: Record<string, boolean>; mutants: MutantResult[] } => {
  const gates: Record<string, boolean> = {};
  const mutants: MutantResult[] = [];
  for (const spec of REGISTRY) {
    const base = spec.fn(spec.input);
    gates[spec.name] = Object.values(base).every(Boolean);
    for (const mu of spec.mutants) {
      mutants.push(runMutant(spec.name, mu.name, mu.conjunct, spec.fn, base, mu.mutate(spec.input)));
    }
  }
  return { gates, mutants };
};

/* ========================================================================== */
/* §12 THE ARTIFACT                                                            */
/* ========================================================================== */
const publishScore = (s: Score): Record<string, unknown> => ({
  seasons: s.seasons, split: s.split, booksTotal: s.booksTotal, booksOrdered: s.booksOrdered,
  share: round(s.share), meanControlled: round(s.meanControlled), meanReckless: round(s.meanReckless),
  meanGapPp: round(s.meanGapPp, 4), gapCi95Pp: s.gapCi95Pp.map((v) => round(v, 4)),
  pooledControlled: round(s.pooledControlled), pooledReckless: round(s.pooledReckless),
  pooledGapPp: round(s.pooledGapPp, 4), pooledGapCi95Pp: s.pooledGapCi95Pp.map((v) => round(v, 4)),
  labels: s.labels,
});

const buildBody = (gates: Record<string, boolean>, mutants: MutantResult[]): Record<string, unknown> => ({
  stage: 'L3-T1 — THE CONVERGENCE EXAM',
  doc: 'docs/world-model/L3-T1-CONVERGENCE-EXAM.md',
  ruling: '#280.3 dispatched · #279.3 the label · #280.2 the applied window + the pre-tasks',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_DOORS,
  frozen: {
    claim: 'with the book learning from its own events and ZERO dosing, the team\'s OWN book shows '
      + 'RECKLESS more punished than CONTROLLED — carrier-anchored Δsep >= 0 at the APPLIED window.',
    scoredPredicate: `the share of books whose OWN cells are strictly ordered belief[RECKLESS] > `
      + `belief[CONTROLLED] is >= tau = ${TAU_FROZEN} (${Math.ceil(TAU_FROZEN * 2 * R_FROZEN)} of `
      + `${2 * R_FROZEN} books). Ties are NOT ordered.`,
    reportedLimb: 'the replicate-mean gap and its cluster bootstrap 95 % CI (REPORTED, not gated '
      + '— §DEV 1: a 1,000-seed band cannot buy 0.80 for the product).',
    window: {
      appliedTicks: APPLIED_WINDOW_TICKS,
      appliedSeconds: APPLIED_WINDOW_TICKS * DT,
      nominalSeconds: L3_DEFENCE_WINDOW_S,
      note: '⭐ #280.2(iii): the APPLIED window is the law of record; the derivation is provenance.',
    },
    grain: 'g2 — CONTROLLED (< v*) vs RECKLESS (>= v*); v* = ' + String(L3_RECKLESS_ARRIVAL),
    arms: ['LEARN-ONLY (scored)', 'OFF (identity anchor)'],
    dosing: 'NONE (#280.3 — zero dosing; no drill world, no injected table)',
    seasonLength: FIXTURES_PER_SEASON,
    checkpointsInSeasons: CHECKPOINT_SEASONS,
    frozenSizingLiterals: FROZEN_SIZING,
  },
  sizing: {
    ...C.sizing,
    designRates: C.sizing.designRates.map((v) => round(v)),
    censusRates: C.sizing.censusRates.map((v) => round(v)),
    smokeRates: C.sizing.smokeRates.map((v) => round(v)),
    q: round(C.sizing.q), qNull: round(C.sizing.qNull),
    powerIndependent: round(C.sizing.powerIndependent),
    powerConservative: round(C.sizing.powerConservative),
    failabilityIndependent: round(C.sizing.failabilityIndependent),
    failabilityConservative: round(C.sizing.failabilityConservative),
    mdePp: round(C.sizing.mdePp, 4),
    qUnderSmoke: round(C.sizing.qUnderSmoke),
    powerUnderSmoke: round(C.sizing.powerUnderSmoke, 8),
    limbIPowerCons: round(C.sizing.limbIPowerCons),
    limbIPowerInd: round(C.sizing.limbIPowerInd),
    oneSeasonQ: round(C.sizing.oneSeasonQ),
    oneSeasonPower: round(C.sizing.oneSeasonPower),
    curveQ: C.sizing.curveQ.map((c) => ({ ...c, q: round(c.q) })),
    wallCapS: WALL_CAP_S,
    nominalMsPerWalk: NOMINAL_MS_PER_WALK,
    seedRoom: SEED_ROOM,
  },
  deffRewalk: {
    block: [DEFF_REWALK_BASE, DEFF_REWALK_BASE + DEFF_REWALK_N - 1],
    ...C.deff,
    deff: round(C.deff.deff),
    committedT0Cells: t0SmokeCells,
    receiptHolds: rewalkReceipt.cellsMatch,
  },
  run: {
    R: R_RUN, Mseasons: M_RUN, matchesPerReplicate: MATCHES_PER_REPLICATE,
    seeds: R_RUN * MATCHES_PER_REPLICATE, base: BASE_RUN,
    arms: 2, walks: R_RUN * MATCHES_PER_REPLICATE * 2,
    labelsClosed: C.reps.reduce((a, r) => a + r.closed, 0),
    labelsOpened: C.reps.reduce((a, r) => a + r.opened, 0),
    labelsCensored: C.reps.reduce((a, r) => a + r.censored, 0),
    lungesFired: C.reps.reduce((a, r) => a + r.fired, 0),
    vetoesServed: C.reps.reduce((a, r) => a + r.vetoes, 0),
    labelSpanTicksSeen: [...ALL_LABEL_SPANS].sort((a, b) => a - b),
  },
  score: {
    scoredPredicate: {
      tau: C.sizing.tau,
      booksOrdered: C.finalAll.booksOrdered,
      booksTotal: C.finalAll.booksTotal,
      share: round(C.finalAll.share),
      VERDICT: C.finalAll.share >= C.sizing.tau ? 'POSITIVE' : 'NEGATIVE',
    },
    reportedLimb: {
      meanGapPp: round(C.finalAll.meanGapPp, 4),
      ci95Pp: C.finalAll.gapCi95Pp.map((v) => round(v, 4)),
      resolvedAboveZero: C.finalAll.gapCi95Pp[0] > 0,
    },
    finalAll: publishScore(C.finalAll),
    finalClean: publishScore(C.finalClean),
  },
  yardstick: {
    what: '⭐ THE CENSUS TRUTH OF THIS BATTERY\'S OWN WORLD, at the APPLIED 54-tick window, at '
      + 'claim grain — measured INSIDE this instrument (#279.3/#280.2(iii)), never imported.',
    appliedTicks: APPLIED_WINDOW_TICKS,
    pooledControlled: round(C.finalAll.pooledControlled),
    pooledReckless: round(C.finalAll.pooledReckless),
    gapPp: round(C.finalAll.pooledGapPp, 4),
    ci95Pp: C.finalAll.pooledGapCi95Pp.map((v) => round(v, 4)),
    committedCensusForContrast: {
      source: 'L3-C0b g2 sepGainedCommonLong (1.0000 s rung) — a CONTRAST, never the yardstick',
      controlled: round(CENSUS_RATE[0]), reckless: round(CENSUS_RATE[1]),
      gapPp: round((CENSUS_RATE[1] - CENSUS_RATE[0]) * 100, 4),
    },
  },
  phaseRung: {
    binding: '#280.2(i) — the group-neutrality assumption MEASURED, not assumed.',
    partition: { ...phasePartition, spanShare: round(phasePartition.spanShare) },
    all: publishScore(C.finalAll),
    clean: publishScore(C.finalClean),
    orderingAgrees: (C.finalAll.share >= C.sizing.tau) === (C.finalClean.share >= C.sizing.tau)
      && Math.sign(C.finalAll.pooledGapPp) === Math.sign(C.finalClean.pooledGapPp),
  },
  learningCurve: C.scores.map(publishScore),
  guards: { niFraction: round(NI_FRACTION), rows: guardRows },
  forks: FORKS,
  perBookCells: C.reps.map((rep) => ({
    replicate: rep.r,
    books: [0, 1].map((side) => rep.snaps[side].map((s, cp) => ({
      seasons: CHECKPOINT_SEASONS[cp],
      all: s.all, clean: s.clean,
    }))),
    inWorld: rep.inWorld,
  })),
  seeds: { claimed: CLAIMED, rewalk: [DEFF_REWALK_BASE, DEFF_REWALK_BASE + DEFF_REWALK_N - 1] },
  stats: { base: STATS_BASE, bootstrap: BOOTSTRAP, floorFromRuling: 111_200 },
  fingerprint: { baseline: FINGERPRINT_BASELINE, observed: fpObserved },
  notable: {
    needleValues: needleValues.size, needleForms: needleForms.size, excludedForms,
    rawValueHits, valueHits, prefixCollisions, nameHits, loaderHits,
    controlNeedleFound, derivedExemptions: [...DERIVED_EXEMPT],
    collisionRule: '⭐ a raw hit is a LEAK only if a FULL numeric token in src equals a measured '
      + 'answer to 1e-9; otherwise it is a PREFIX COLLISION with an unrelated banked constant, '
      + 'published with file:line (the T0 §DEV 5 exemption class, machine-adjudicated).',
  },
  gDetDigests: { runA: digestA, runB: digestB },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  conjunctTotal: CONJUNCT_TOTAL,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    'The exam scores the SHAPE, not the magnitude (#246).',
    'No football effect is claimed — L3-T2 asks that, and the play-test is the USER GATE.',
    'A wrong book is legal and is STYLE (#247).',
    'tau is derived, not sacred; the binomial sizing is a MODEL.',
    'The season-reset question is NOT settled here (§DOUBTS 1).',
  ],
});

const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: gitOut('git rev-parse HEAD'),
    outPath, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 1)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = '/tmp/l3-t1-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: {
      ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION',
    },
  }, null, 1)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs'];
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
({ gates, mutants } = runRegistry());
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
gMutantsInput.uncovered = uncoveredConjuncts;
gMutantsInput.dead = otherMutants.filter((m) => !m.live).length;
gMutantsInput.total = otherMutants.length;
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [l3-t1] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const dead = mutants.filter((m) => !m.live);
if (dead.length > 0) {
  banner('  [l3-t1] DEAD MUTANTS:');
  for (const m of dead) banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
}
banner(`  [l3-t1] SCORE: ${C.finalAll.booksOrdered}/${C.finalAll.booksTotal} books ordered = `
  + `${(C.finalAll.share * 100).toFixed(2)} % vs tau ${(C.sizing.tau * 100).toFixed(0)} % ⇒ `
  + `${C.finalAll.share >= C.sizing.tau ? 'POSITIVE' : 'NEGATIVE'}`);
banner(`  [l3-t1] yardstick @54 ticks: controlled ${(C.finalAll.pooledControlled * 100).toFixed(3)} % · `
  + `reckless ${(C.finalAll.pooledReckless * 100).toFixed(3)} % · gap ${C.finalAll.pooledGapPp.toFixed(3)} pp `
  + `CI [${C.finalAll.pooledGapCi95Pp[0].toFixed(3)}, ${C.finalAll.pooledGapCi95Pp[1].toFixed(3)}]`);
banner(`  [l3-t1] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
