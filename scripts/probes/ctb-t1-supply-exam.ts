// CTB T1 — THE SUPPORT-SUPPLY EXAM: hand-dose the banked 2D support plane, measure the
// WORLD's receiver-side supply.
//
// Doc:      docs/world-model/CTB-T1-SUPPLY-EXAM.md  (§FORM/§SEEDS/§GATES frozen before sight)
// Contract: docs/world-model/CHECK-TO-BALL-CONTRACT.md §3 CTB-T1 (+ §1 H-CTB, §4 non-claims)
// Rulings:  #224.5 (this dispatch) · #224.4 (the T1 inheritances: short-option supply is
//           CI-unprotected ⇒ instrument it DIRECTLY; clamp saturation is dose-response, not
//           slop; no span may be re-cut) · #223 (the contract) ·
//           #181.2 (every HARD gate computed in-probe) · #197-M1/#198 (hashed body vs
//           UNHASHED envelope) · #163 (seed/stats disjointness) · #20 (cluster = match seed) ·
//           #128 (wall is CONTEXT ONLY) · #207 (per-seed checkpoint/resume) ·
//           #203 (PER-ARM ROWS and paired deltas ONLY — this probe fires NO branch).
//
// ⭐ INSTRUMENT-ONLY ROUND. src/** is byte-untouched (X-SRC-UNTOUCHED is a HARD gate); the
// seam is banked at 1dc4aa9 + d0814d7. Arms are built by the `ctbSupportPlane` MatchConfig
// flag + the two genes written on ALL THREE genome views of BOTH teams (#196.3-D6).
//
// ⭐ EVERY RULER QUANTITY IS INHERITED, each with its own G-REPRO receipt:
//   1 TRUE-holdable supply     — the O2-T1 `trueCellOf` instrument VERBATIM (#186 population)
//   2 pressed-first-reception  — the #173 tempo-census instrument VERBATIM
//   3 short-option supply      — #224.4(i)'s named debt; constants PARSED out of source
//   4 support-existence @ press— (3) restricted to (2)'s pressure test: H-CTB's core quantity
//   5 the #218 shares          — LIFTED (the goal-genealogy origin classifier ported with its
//                                LOSS-TICK semantics verbatim, #215.3-H1/M2). Gate: G-REPRO-GGC.
//                                REPORTED per arm; NO gate hangs on the shares in T1.
//
//   CTBT1_MODE=smoke|full    (default smoke: 12 seeds @ 12,423,025)
//   CTBT1_RESUME=1           full mode only — restore finished (pass, seed) units (#207)
//   CTBT1_CHECKPOINT=<path>  /tmp scratch; never committed, never read by a gate
//   CTBT1_N=<n> / CTBT1_SKIP_FP=1 — OVERRIDES: routed onto the EXIT-SEMANTICS GUARD BLOCK,
//                            turn G-CLEAN-INVOCATION RED and exit 1. Such a run adjudicates
//                            nothing.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import {
  formationSpot, supportSpot, SUPPORT_LAT_CAP_FRAC, SUPPORT_LAT_PULL, CTB_DEPTH_BIAS_SPAN,
} from '../../src/ai/formations';
import { clamp } from '../../src/utils/math';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  CTB_GENE_MAX, CTB_GENE_MIN, ctbSupportDepthWeight, ctbSupportWidthWeight, randomGenome,
  type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { League } from '../../src/sim/League';
import { runHeadless } from '../../src/sim/simRunner';
import type { RecensusCostTable } from '../../src/ai/whetherEye';

const wall0 = Date.now();
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const canonical = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walk(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walk(v));
};
const gitSay = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'git-unavailable'; }
};
const round = (x: number, dp = 6): number => (Number.isFinite(x) ? Number(x.toFixed(dp)) : Number.NaN);
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = mean(xs);
  return Math.sqrt(xs.reduce((s, x) => s + (x - mu) ** 2, 0) / xs.length);
};
const pctlSorted = (s: readonly number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.max(0, Math.floor(q * (s.length - 1))))]);
const quantile = (xs: readonly number[], q: number): number => pctlSorted([...xs].sort((a, b) => a - b), q);
const dist = (a: { x: number; y: number }, b: { x: number; y: number }): number => Math.hypot(a.x - b.x, a.y - b.y);

/* ========================================================================== */
/* §1 FROZEN PARAMETERS — every one INHERITED VERBATIM                        */
/* ========================================================================== */
/* --- ruler 1: the #186 (= #65) eligible-moment population, O2-T1 verbatim --- */
const MATCH_DURATION = 240;
const PER_MATCH_CAP = 80;
const MOMENT_SPACING = 30;
const HORIZON = 240;
const SUPPORT_MIN_M = 6;
const SUPPORT_MAX_M = 30;
/* --- ruler 2: the #173 pressure test, tempo-census verbatim ---------------- */
/** TOUCH_CONTROL_DIST (src/sim/constants.ts) — the substrate's own "under pressure" switch. */
const PRESSURE_R = TOUCH_CONTROL_DIST;
/* --- the guards: PM-T1 §5 constants, inherited VERBATIM -------------------- */
const NI_FRACTION = 1 - 0.275 / 0.380;
const BAND_BASELINE = {
  goals: 2.3944, crosses: 2.4894, headers: 9.1039, longBalls: 6.2042, cutbacks: 3.8151,
} as const;
const BAND_TOLERANCE = {
  goals: 0.15, crosses: 0.25, headers: 0.25, longBalls: 0.25, cutbacks: 0.25,
} as const;
type BandKey = keyof typeof BAND_BASELINE;
const BAND_KEYS = Object.keys(BAND_BASELINE) as BandKey[];
/** the P3′ whole-match guard constants, PM-T1 verbatim */
const SAMPLE_EVERY = 10;
const PAIR_SUBSAMPLE = 6;
const CLOSE_PAIR_M = 4;
/** the Phase 30.5 column-disease reading, REPORTED context only — never a gate. */
const PHASE305_INTERCEPTION_CONTEXT = 33;

/* --- §2 the seed ledger (stage doc §SEEDS) --------------------------------- */
const MODE = (process.env.CTBT1_MODE ?? 'smoke') === 'full' ? 'full' : 'smoke';
const SMOKE_BASE = 12_423_025;
const SMOKE_N = 12;
const GUARD_BLOCK: readonly [number, number] = [12_423_050, 12_423_099];
const BATTERY_BASE = 12_423_100;
/** the #173 sizing-smoke block — a DELIBERATE re-walk (receipt), never fresh data */
const REPRO173_BASE = 12_293_000;
const REPRO173_N = 40;
/** the O2-T1 battery block — a DELIBERATE re-walk of its first rows (receipt) */
const REPRO_O2_BASE = 12_422_100;
const REPRO_O2_N = 12;
/** ⭐ the #218 LIFT's receipt: the goal-genealogy census's OWN SMOKE block, `PROD` arm — a
 *  DELIBERATE re-walk (receipt), never fresh data (G-REPRO-GGC). */
const REPRO_GGC_BASE = 12_421_000;
const REPRO_GGC_N = 12;
/** The COMPLETE consumed ledger: the ctb-t0 probe's list + CTB-T0's OWN consumption. */
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat block (repro receipt)', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 phase-0 census', range: [12_300_000, 12_301_999] },
  { name: 'O1-T1 smoke', range: [12_302_000, 12_302_039] },
  { name: 'O1-T2 sizing smoke', range: [12_302_040, 12_302_063] },
  { name: 'O1-T2 full A/B', range: [12_303_000, 12_303_999] },
  { name: 'O1 phase-0 sizing smoke', range: [12_309_900, 12_309_923] },
  { name: 'O2 opening sizing (#186)', range: [12_310_000, 12_310_199] },
  { name: 'far-side forensic (reserved in full)', range: [12_310_200, 12_310_999] },
  { name: 'O2-T0 receipts + freshness read', range: [12_311_000, 12_311_024] },
  { name: 'PM-T0 receipts + boundary/ASK read', range: [12_311_100, 12_311_124] },
  { name: 'PM-T1 sizing smoke', range: [12_311_200, 12_311_205] },
  { name: 'PM-T1 battery (#199)', range: [12_311_300, 12_311_949] },
  { name: 'MT-T0 receipts + stance census + lockstep', range: [12_312_000, 12_312_025] },
  { name: 'MT-T0 test-file seeds', range: [12_312_900, 12_312_901] },
  { name: 'MT-T1 smoke + exit-check + battery (#204)', range: [12_313_000, 12_313_999] },
  { name: 'MT-T2 reserved band (#208)', range: [12_320_000, 12_419_999] },
  { name: 'MT-LADDER reserved band (#211)', range: [12_420_000, 12_420_999] },
  { name: 'goal-genealogy census band (#214/#217)', range: [12_421_000, 12_421_999] },
  { name: 'O2-T1 smoke (#222)', range: [12_422_000, 12_422_011] },
  { name: 'O2-T1 guard (#222)', range: [12_422_050, 12_422_099] },
  { name: 'O2-T1 battery + reserve (#222)', range: [12_422_100, 12_422_899] },
  { name: 'CTB-T0 receipts + corner/smoke read (#224)', range: [12_423_000, 12_423_024] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
];
/** ⭐ THE BATTERY BLOCK'S CEILING IS THE LEDGER'S, NOT A DISPATCH NUMBER (the ruled amendment):
 *  the dispatch's 500-seed cap was the DISPATCH's, never the contract's, and the N rule's own
 *  number governs. The only ceiling left is STRUCTURAL — the battery block may not run into the
 *  next consumed interval. Computed IN-PROBE from the ledger, never typed. */
const NEXT_CONSUMED_AFTER_BATTERY = Math.min(
  ...CONSUMED.map((c) => c.range[0]).filter((s) => s > BATTERY_BASE),
);
const BATTERY_ROOM = NEXT_CONSUMED_AFTER_BATTERY - BATTERY_BASE;
/** §4.2 the stats stream — a SEPARATE namespace. O2-T1's base was 104,600 ⇒ the next legal
 *  base under the #163 200-floor is 104,800. The list is O2-T1's COMPLETE ≥91,100-regime
 *  ledger + 104,600 (O2-T1's own base). */
const BOOTSTRAP_SEED = 104_800;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600,
];

/* --- §3 the X-family pins + the committed source artifacts ----------------- */
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const O2T1_PATH = 'docs/world-model/data/o2-t1-wedge-exam.json';
const TEMPO_SMOKE_PATH = 'docs/world-model/data/tempo-census-sizing-smoke.json';
const TEMPO_PATH = 'docs/world-model/data/tempo-census.json';
/** the #218 lift's source of truth: the goal-genealogy census's OWN committed SMOKE artifact */
const GGC_SMOKE_PATH = 'docs/world-model/data/goal-genealogy-census-smoke.json';
const FORMATIONS_SRC = 'src/ai/formations.ts';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* --- §4 the invocation guard (G-CLEAN-INVOCATION) -------------------------- */
const N_ENV = process.env.CTBT1_N ? Math.max(1, Number.parseInt(process.env.CTBT1_N, 10)) : null;
const SKIP_FP = process.env.CTBT1_SKIP_FP === '1';
const OVERRIDDEN = N_ENV !== null || SKIP_FP;
const OUT_PATH = OVERRIDDEN
  ? '/tmp/ctb-t1-guard-run.json'
  : (MODE === 'smoke'
    ? 'docs/world-model/data/ctb-t1-supply-exam-smoke.json'
    : 'docs/world-model/data/ctb-t1-supply-exam.json');

/* ========================================================================== */
/* §5 THE INHERITED INSTRUMENT PIECES                                         */
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

/* --- the certified table, INJECTED (#65's P2 convention; O2-T1 verbatim) ---- */
const rawTableBytes = readFileSync(TABLE_PATH, 'utf8');
const rawTable = JSON.parse(rawTableBytes) as Record<string, any>;
if (rawTable.tableSha !== EXPECTED_TABLE_SHA) {
  throw new Error(`certified table SHA drift: ${String(rawTable.tableSha)} != ${EXPECTED_TABLE_SHA}`);
}
const tableParams = rawTable.parameters;
const TABLE: RecensusCostTable = {
  pressureBands: tableParams.pressureBands,
  staleBands: tableParams.staleBands,
  supportCuts: tableParams.supportCuts,
  supportWindowM: tableParams.supportWindowM,
  cells: rawTable.build.table.cells.map((c: any) => ({
    pressureBand: c.pressureBand, staleBand: c.staleBand, supportBand: c.supportBand,
    costs: c.costs.map((k: any) => ({
      holdTicks: k.holdTicks, point: k.point, lower: k.lower, upper: k.upper, reachesZero: k.reachesZero,
    })),
  })),
};
const HOLDABLE_CELLS = TABLE.cells
  .filter((c) => c.costs.some((k) => k.reachesZero))
  .map((c) => `${c.pressureBand}|${c.staleBand}|${c.supportBand}`)
  .sort();
if (HOLDABLE_CELLS.length !== 1 || HOLDABLE_CELLS[0] !== '0|0|0') {
  throw new Error(`holdable-cell set drift: ${JSON.stringify(HOLDABLE_CELLS)} != ["0|0|0"]`);
}
type Band = 0 | 1 | 2;
const pressureBandOf = (v: number): Band =>
  (v < TABLE.pressureBands[0] ? 0 : v < TABLE.pressureBands[1] ? 1 : 2);
const staleBandOf = (v: number): Band =>
  (v < TABLE.staleBands[0] ? 0 : v < TABLE.staleBands[1] ? 1 : 2);
const supportBandOf = (v: number): Band =>
  (v < TABLE.supportCuts.low ? 0 : v >= TABLE.supportCuts.high ? 2 : 1);

/** A0 (untouched): one fork step to read the decided action — #186 / O2-T1 verbatim. */
const decidedActionOf = (before: Match, ownerGid: number): string => {
  const fork = cloneSimulationState(before);
  const owner = fork.allPlayers.find((p) => p.gid === ownerGid)!;
  let action = owner.action.type;
  const startTick = fork.simTick;
  for (let t = 0; t < HORIZON; t++) {
    if (fork.finished) break;
    fork.step(DT);
    if (fork.simTick - startTick === 1) { action = owner.action.type; break; }
  }
  return action;
};
/** The TRUE-context cell (census keying) — #186 / O2-T1 VERBATIM. */
const trueCellOf = (match: Match, owner: Player): { key: string; bands: [Band, Band, Band] } => {
  const side = owner.side;
  const pB = pressureBandOf(pressureAt(owner.pos, match.teams[1 - side].players));
  const sB = staleBandOf(match.teams[side].staleTime);
  const support = match.teams[side].players.filter((p) => (
    p.gid !== owner.gid && p.role !== 'GK' && !p.sentOff
    && dist(p.pos, owner.pos) >= SUPPORT_MIN_M && dist(p.pos, owner.pos) <= SUPPORT_MAX_M
  )).length;
  return { key: `${pB}|${sB}|${supportBandOf(support)}`, bands: [pB, sB, supportBandOf(support)] };
};

/* --- ruler 3: the SHORT-OPTION radius family, PARSED OUT OF SOURCE ---------- */
/** ⭐ G-TRACE-RADIUS (#202 form): the instrument's constants are READ FROM `supportSpot`'s
 *  own line, never typed here. `radius = 10 + supportDistance·8` is the code's standing
 *  answer to "how far is support"; the short-option predicate asks that same question of
 *  the CARRIER. */
const radiusTrace = (() => {
  const src = readFileSync(FORMATIONS_SRC, 'utf8');
  const line = 'const radius = 10 + g.supportDistance * 8;';
  const m = /const radius = ([\d.]+) \+ g\.supportDistance \* ([\d.]+);/.exec(src);
  return {
    lineFound: src.includes(line),
    base: m === null ? Number.NaN : Number(m[1]),
    slope: m === null ? Number.NaN : Number(m[2]),
    line, file: FORMATIONS_SRC,
  };
})();
const supportRadiusOf = (g: { supportDistance: number }): number =>
  radiusTrace.base + g.supportDistance * radiusTrace.slope;

/* ========================================================================== */
/* §5b THE #218 LIFT — the goal-genealogy ORIGIN CLASSIFIER, ported            */
/* ========================================================================== */
/** ⭐ PORTED FROM `scripts/probes/goal-genealogy-census.ts` (#214/#215/#217), with its
 *  ⚠ LOSS-TICK semantics VERBATIM (#215.3-H1 + M2): the by-third origin classes are cut on the
 *  ball's position at the previous segment's LAST OWNED tick (the loss/release point), mirrored
 *  into the WINNER's attacking frame; the REGAIN-tick reading is carried beside it as the
 *  declared cross-cut. The limbs this exam does NOT read (pass LOCATION / own-third chains /
 *  the danger-window ladder) are not lifted — the G-REPRO-173 precedent verbatim, and
 *  G-REPRO-GGC is what proves the omission changes nothing on the columns that ARE read. */
const THIRD_LOCAL_X = HALF_L / 3;
const GG_ORIGIN_CLASSES = [
  'kickoff', 'goalKick', 'kickIn', 'restartSecondBall', 'matchOpenFallback',
  'setPieceCorner', 'setPieceFreeKick', 'setPiecePenalty',
  'scrambleLooseBall',
  'turnoverWonInOwnThird', 'turnoverWonInMiddleThird', 'turnoverWonInFinalThird',
] as const;
type OriginClass = typeof GG_ORIGIN_CLASSES[number];
const GG_SET_PIECE: readonly OriginClass[] = ['setPieceCorner', 'setPieceFreeKick', 'setPiecePenalty'];
const GG_OPEN_PLAY: readonly OriginClass[] = [
  'scrambleLooseBall', 'turnoverWonInOwnThird', 'turnoverWonInMiddleThird', 'turnoverWonInFinalThird',
];
type GgFamily = 'setPiece' | 'restart' | 'openPlay';
const ggFamilyOf = (o: OriginClass): GgFamily => (GG_SET_PIECE.includes(o) ? 'setPiece'
  : GG_OPEN_PLAY.includes(o) ? 'openPlay' : 'restart');
type Third = 'own' | 'middle' | 'final';
const ggThirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');
/** the CONSTRUCTION ladder (#214.1a) — a REPORTING GRID; no N is privileged, nothing gates. */
const CONSTRUCTED_LADDER = [3, 4, 5] as const;
interface GgSegment {
  team: Side;
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  startTick: number;
  lastOwnedTick: number;
  assignedTicks: number;
  completedPasses: number;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
  /** live-updated on every owned tick; frozen at the segment's LAST OWNED tick = the LOSS SPOT */
  lastOwnedLocalXOwnerFrame: number;
  lossLocalXLoserFrame: number | null;
  regainSpotLocalXLoserFrame: number | null;
  lossThird: Third | null;
  regainThird: Third | null;
  regainContested: boolean;
  goalScoringSide: Side | null;
}
interface GgGoalRec {
  origin: OriginClass;
  originAtRegainSpot: OriginClass;
  family: GgFamily;
  lossThird: Third | null;
  completedPasses: number;
}
type GgCounts = Record<OriginClass, number>;
const ggZeroCounts = (): GgCounts => Object.fromEntries(
  GG_ORIGIN_CLASSES.map((o) => [o, 0]),
) as GgCounts;

const nearestOpponent = (m: Match, p: Player): number => {
  let best = Number.POSITIVE_INFINITY;
  for (const o of m.teams[(1 - p.side) as Side].players) {
    if (o.sentOff) continue;
    const d = dist(o.pos, p.pos);
    if (d < best) best = d;
  }
  return best;
};

/* ========================================================================== */
/* §6 THE ARMS (stage doc §FORM)                                              */
/* ========================================================================== */
type ArmName = 'absent' | 'armedZero' | 'depthBack' | 'depthHalf' | 'depthFwd'
  | 'narrow' | 'wide' | 'cornerCheck';
const ARMS: readonly ArmName[] = [
  'absent', 'armedZero', 'depthBack', 'depthHalf', 'depthFwd', 'narrow', 'wide', 'cornerCheck',
];
const CONTROL_ARM: ArmName = 'absent';
/** Every dose is a SPAN END or its half, read off the exported gene domain — never invented. */
const DOSE: Record<ArmName, { depth: number; width: number } | null> = {
  absent: null,
  armedZero: { depth: 0, width: 0 },
  depthBack: { depth: CTB_GENE_MIN, width: 0 },
  depthHalf: { depth: CTB_GENE_MIN / 2, width: 0 },
  depthFwd: { depth: CTB_GENE_MAX, width: 0 },
  narrow: { depth: 0, width: CTB_GENE_MIN },
  wide: { depth: 0, width: CTB_GENE_MAX },
  cornerCheck: { depth: CTB_GENE_MIN, width: CTB_GENE_MIN },
};
/** the receipt walks (never exam data): each runs in ITS SOURCE's own world */
type ReproArm = 'reproO2Control' | 'repro173Prod' | 'reproGgcProd';
type WalkArm = ArmName | ReproArm;
/** the O2-T1 CONTROL world, VERBATIM (CENSUS_FLAGS + o1PassWindup) */
const O2T1_CONTROL_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false, o1PassWindup: true,
} as const;

/** ⭐ THE ARMING CHECKLIST (#196.3-D6): genes on ALL THREE genome views of BOTH teams. */
const armGenes = (m: Match, depth: number, width: number): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      g.ctbSupportDepth = depth;
      g.ctbSupportWidth = width;
    }
  }
};
/** G-ARM's gene-channel receipt: are both genes present on all six views? */
const genesOnAllViews = (m: Match): boolean => m.teams.every((t) => (
  [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => typeof g.ctbSupportDepth === 'number' && typeof g.ctbSupportWidth === 'number'));

const matchOf = (seed: number, arm: WalkArm): Match => {
  const base = { seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: MATCH_DURATION };
  if (arm === 'reproO2Control') {
    return new Match({ ...base, ...O2T1_CONTROL_FLAGS } as ConstructorParameters<typeof Match>[0]);
  }
  /** ⭐ THE WORLD (doc §FORM): the BARE production-shaped world — for the exam arms AND for
   *  the #173 receipt walk, which is exactly the census's own `prod` arm. */
  /** ⭐ the #218 receipt walk runs in the GENEALOGY CENSUS's OWN `PROD` arm — `new Match({seed,
   *  teamA, teamB})`, the shipped game with no flags. Its `duration` is the engine default
   *  MATCH_DURATION, which is the same 240 s this exam passes explicitly, so the census's world
   *  and this exam's world coincide EXACTLY here — and G-REPRO-GGC is what proves it rather
   *  than asserting it. */
  if (arm === 'repro173Prod' || arm === 'reproGgcProd') {
    return new Match(base as ConstructorParameters<typeof Match>[0]);
  }
  const d = DOSE[arm];
  if (d === null) return new Match(base as ConstructorParameters<typeof Match>[0]);
  const m = new Match({ ...base, ctbSupportPlane: true } as ConstructorParameters<typeof Match>[0]);
  armGenes(m, d.depth, d.width);
  return m;
};

/** The whole-match signature INCLUDING the rng stream state (the CTB-T0 form). */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((p) => ({
    gid: p.gid, pos: p.pos, vel: p.vel, heading: p.heading, stamina: p.stamina,
  })),
}));

/* ========================================================================== */
/* §7 THE WALK — one whole match, every inherited instrument at once           */
/* ========================================================================== */
interface PerMatch {
  seed: number;
  /* --- ruler 1 (#186 population, O2-T1 verbatim) --- */
  qualifying: number;
  eligible: number;
  exFirstTouch: number;
  exMustKick: number;
  exShoot: number;
  exClear: number;
  trueHoldable: number;
  /* --- ruler 2 (#173) --- */
  spellsOpenPlay: number;
  firstRecOpen: number;
  firstRecOpenPressed: number;
  /* --- rulers 3 + 4 --- */
  possTicks: number;
  possTicksShort: number;
  possTicksPressed: number;
  possTicksPressedShort: number;
  firstRecShort: number;
  firstRecPressedShort: number;
  /* --- G-ARM + clamp saturation --- */
  supportTicks: number;
  supportTicksShifted: number;
  supportTicksUnshiftedClampBound: number;
  supportShiftSum: number;
  supportShiftMax: number;
  supportBehindBall: number;
  clampXBound: number;
  clampYBound: number;
  genesOnAllViews: number;
  /* --- guards --- */
  interceptions: number;
  offsides: number;
  fouls: number;
  penalties: number;
  goals: number;
  crosses: number;
  headers: number;
  longBalls: number;
  cutbacks: number;
  spreadYOut: number;
  spreadYIn: number;
  spacingMedian: number;
  spacingUnder4: number;
  /* --- ruler 5: the #218 LIFT (goal-genealogy origin classifier, ported) --- */
  ggSegments: number;
  ggSegmentsByOrigin: GgCounts;
  ggSegmentsByOriginAtRegainSpot: GgCounts;
  ggGoals: GgGoalRec[];
  ggTotalTicks: number;
  ggDeadBallTicks: number;
  ggSegmentTicks: number;
  ggLooseGapTicks: number;
  ggAssignedTicksSum: number;
  ggSpanOrderViolations: number;
  ggGoalsFromScore: number;
  ggUnattributedGoals: number;
  ggTurnoversTotal: number;
  ggOwnThirdTurnovers: number;
  ggOwnThirdTurnoversAtRegainSpot: number;
  /* --- context --- */
  ticksWalked: number;
  playedTicks: number;
  reachedFullTime: number;
  signature: string;
}

const walkSeed = (seed: number, arm: WalkArm): PerMatch => {
  const m = matchOf(seed, arm);
  const dosed = arm !== 'absent' && arm !== 'reproO2Control' && arm !== 'repro173Prod'
    && DOSE[arm as ArmName] !== null;
  const armedFlag = dosed;

  /* ---- ruler 1 state (#186 sampling budget) ---- */
  let sinceLast = MOMENT_SPACING;
  let inMatch = 0;
  /* ---- ruler 2 state (the tempo-census spell/touch machinery, verbatim in the part
   *      the pressed-first-reception instrument depends on) ---- */
  type SpellOrigin = 'openPlay' | 'restart' | 'kickoff';
  let curSpellOrigin: SpellOrigin | null = null;
  let curSpellSide: Side | null = null;
  let curSpellTouches = 0;
  let prevOwnerGid: number | null = null;
  /* ---- guard accumulators (PM-T1 P3′/B1-a forms) ---- */
  const pairs: [number[], number[]] = [[], []];
  const spreadOut: [number[], number[]] = [[], []];
  const spreadIn: [number[], number[]] = [[], []];
  let samples = 0;
  let tick = 0;

  const r: PerMatch = {
    seed,
    qualifying: 0, eligible: 0, exFirstTouch: 0, exMustKick: 0, exShoot: 0, exClear: 0,
    trueHoldable: 0,
    spellsOpenPlay: 0, firstRecOpen: 0, firstRecOpenPressed: 0,
    possTicks: 0, possTicksShort: 0, possTicksPressed: 0, possTicksPressedShort: 0,
    firstRecShort: 0, firstRecPressedShort: 0,
    supportTicks: 0, supportTicksShifted: 0, supportTicksUnshiftedClampBound: 0,
    supportShiftSum: 0, supportShiftMax: 0,
    supportBehindBall: 0, clampXBound: 0, clampYBound: 0, genesOnAllViews: 0,
    interceptions: 0, offsides: 0, fouls: 0, penalties: 0, goals: 0,
    crosses: 0, headers: 0, longBalls: 0, cutbacks: 0,
    spreadYOut: Number.NaN, spreadYIn: Number.NaN,
    spacingMedian: Number.NaN, spacingUnder4: Number.NaN,
    ggSegments: 0, ggSegmentsByOrigin: ggZeroCounts(),
    ggSegmentsByOriginAtRegainSpot: ggZeroCounts(), ggGoals: [],
    ggTotalTicks: 0, ggDeadBallTicks: 0, ggSegmentTicks: 0, ggLooseGapTicks: 0,
    ggAssignedTicksSum: 0, ggSpanOrderViolations: 0, ggGoalsFromScore: 0,
    ggUnattributedGoals: 0, ggTurnoversTotal: 0, ggOwnThirdTurnovers: 0,
    ggOwnThirdTurnoversAtRegainSpot: 0,
    ticksWalked: 0, playedTicks: 0, reachedFullTime: 0, signature: '',
  };
  r.genesOnAllViews = genesOnAllViews(m) ? 1 : 0;

  /** the short-option predicate (ruler 3), asked of the CARRIER */
  const shortOptionFor = (carrier: Player): boolean => {
    const t = m.teams[carrier.side];
    const radius = supportRadiusOf(t.genome);
    return t.players.some((p) => p.gid !== carrier.gid && p.role !== 'GK' && !p.sentOff
      && dist(p.pos, carrier.pos) <= radius);
  };

  /* ===== ruler 5: THE #218 LIFT — the census's segment/origin machinery, PORTED =====
   * ⚠ THE LOSS-TICK SEMANTICS ARE THE CENSUS'S OWN (#215.3-H1/M2), carried verbatim: an
   * open-play regain is classified on the ball's position at the PREVIOUS segment's LAST
   * OWNED tick, mirrored into the WINNER's frame (localX_winner = −localX_loser); the
   * REGAIN-tick reading rides beside it as the declared cross-cut. */
  const ggSegs: GgSegment[] = [];
  const ggGoalRecs: GgGoalRec[] = [];
  let ggCur: GgSegment | null = null;
  let ggPrevSeg: GgSegment | null = null;
  const ggPrevCompleted: [number, number] = [m.teams[0].stats.passesCompleted, m.teams[1].stats.passesCompleted];
  const ggPrevScore: [number, number] = [m.score[0], m.score[1]];
  let ggSinceDeadBall = true;   // the match opens from a kickoff
  let ggContestedSinceLastSeg = false;

  const ggClose = (s: GgSegment, terminator: GgSegment['terminator'], scoringSide: Side | null): void => {
    s.terminator = terminator;
    s.goalScoringSide = scoringSide;
    const last = ggSegs.length === 0 ? null : ggSegs[ggSegs.length - 1];
    if (last !== null && s.startTick <= last.startTick) r.ggSpanOrderViolations += 1;
    ggSegs.push(s);
    ggPrevSeg = s;
  };
  const ggOpenPlayClass = (contested: boolean, t: Third): OriginClass => (contested ? 'scrambleLooseBall'
    : t === 'own' ? 'turnoverWonInOwnThird'
      : t === 'final' ? 'turnoverWonInFinalThird' : 'turnoverWonInMiddleThird');
  const ggOpen = (side: Side, tick: number, ownerGid: number): GgSegment => {
    let origin: OriginClass;
    let lossThird: Third | null = null;
    let regainThird: Third | null = null;
    let regainContested = false;
    let regainSpotClass: OriginClass | null = null;
    if (m.kickoffKickGid === ownerGid) origin = 'kickoff';
    else if (m.restartKickGid === ownerGid) {
      const k = m.restartKickKind;
      origin = k === 'corner' ? 'setPieceCorner'
        : k === 'freeKick' ? 'setPieceFreeKick'
          : k === 'penalty' ? 'setPiecePenalty'
            : k === 'goalKick' ? 'goalKick'
              : k === 'kickIn' ? 'kickIn' : 'restartSecondBall';
    } else if (ggSinceDeadBall) origin = 'restartSecondBall';
    else if (ggPrevSeg === null) origin = 'matchOpenFallback';
    else {
      const lost = ggPrevSeg.lossLocalXLoserFrame;
      const regained = ggPrevSeg.regainSpotLocalXLoserFrame;
      lossThird = ggThirdOf(lost === null ? 0 : -lost);
      regainThird = ggThirdOf(regained === null ? 0 : -regained);
      regainContested = ggContestedSinceLastSeg;
      origin = ggOpenPlayClass(ggContestedSinceLastSeg, lossThird);
      regainSpotClass = ggOpenPlayClass(ggContestedSinceLastSeg, regainThird);
    }
    return {
      team: side, origin, originAtRegainSpot: regainSpotClass ?? origin,
      startTick: tick, lastOwnedTick: tick, assignedTicks: 0, completedPasses: 0,
      terminator: 'matchEnd', lastOwnedLocalXOwnerFrame: m.teams[side].localX(m.ball.pos.x),
      lossLocalXLoserFrame: null, regainSpotLocalXLoserFrame: null,
      lossThird, regainThird, regainContested, goalScoringSide: null,
    };
  };
  const ggGoalOf = (s: GgSegment): GgGoalRec => ({
    origin: s.origin, originAtRegainSpot: s.originAtRegainSpot, family: ggFamilyOf(s.origin),
    lossThird: s.lossThird, completedPasses: s.completedPasses,
  });
  /** ONE genealogy tick, run immediately after `m.step(DT)` — the census's own loop body, with
   *  its `continue`s expressed as `return` so this exam's other instruments are untouched. */
  const ggStep = (): void => {
    r.ggTotalTicks += 1;
    const tickNow = m.simTick;
    const phaseNow = m.phase;
    const ownerNow = m.ball.owner;
    let goalSide: Side | null = null;
    for (const s of [0, 1] as const) {
      if (m.score[s] > ggPrevScore[s]) {
        goalSide = s;
        r.ggGoalsFromScore += m.score[s] - ggPrevScore[s];
      }
      ggPrevScore[s] = m.score[s];
      const dCompleted = m.teams[s].stats.passesCompleted - ggPrevCompleted[s];
      if (dCompleted > 0 && ggCur !== null && ggCur.team === s) ggCur.completedPasses += dCompleted;
      ggPrevCompleted[s] = m.teams[s].stats.passesCompleted;
    }
    if (phaseNow !== 'playing') {
      r.ggDeadBallTicks += 1;
      if (ggCur !== null) {
        if (goalSide !== null) {
          ggClose(ggCur, 'goal', goalSide);
          ggGoalRecs.push(ggGoalOf(ggCur));
        } else ggClose(ggCur, 'deadBall', null);
        ggCur = null;
      } else if (goalSide !== null) r.ggUnattributedGoals += 1;
      ggSinceDeadBall = true;
      ggContestedSinceLastSeg = false;
      return;
    }
    if (m.possessionPhase.kind === 'contested') ggContestedSinceLastSeg = true;
    if (ownerNow === null) {
      if (ggCur !== null) { ggCur.assignedTicks += 1; r.ggSegmentTicks += 1; } else r.ggLooseGapTicks += 1;
      if (goalSide !== null && ggCur === null) r.ggUnattributedGoals += 1;
      return;
    }
    const side = ownerNow.side;
    if (ggCur !== null && ggCur.team !== side) {
      // ⭐ THE DEFINITIONAL LOSS SPOT: the LAST OWNED tick's ball position, loser's frame.
      const lossLocal = ggCur.lastOwnedLocalXOwnerFrame;
      const regainLocal = m.teams[ggCur.team].localX(m.ball.pos.x);
      ggCur.lossLocalXLoserFrame = lossLocal;
      ggCur.regainSpotLocalXLoserFrame = regainLocal;
      if (ggThirdOf(lossLocal) === 'own') r.ggOwnThirdTurnovers += 1;
      if (ggThirdOf(regainLocal) === 'own') r.ggOwnThirdTurnoversAtRegainSpot += 1;
      ggClose(ggCur, 'opponentControl', null);
      ggCur = null;
    }
    if (ggCur === null) {
      ggCur = ggOpen(side, tickNow, ownerNow.gid);
      ggSinceDeadBall = false;
      ggContestedSinceLastSeg = false;
    }
    const seg = ggCur;
    ggContestedSinceLastSeg = false;
    seg.assignedTicks += 1; r.ggSegmentTicks += 1;
    seg.lastOwnedTick = tickNow;
    seg.lastOwnedLocalXOwnerFrame = m.teams[side].localX(m.ball.pos.x);
  };

  while (!m.finished) {
    /* ============ ruler 1: the #186 sampling block, O2-T1 VERBATIM ============
     * ⚠ the sampling BUDGET stops at PER_MATCH_CAP; the WALK continues to full time so
     * the whole-match instruments exist. The sampled moment SET is bit-identical to the
     * O2-T1 walker's (G-REPRO-O2T1 proves it against the committed rows). */
    const owner: Player | null = m.ball.owner;
    const qualifies = inMatch < PER_MATCH_CAP && m.phase === 'playing' && owner !== null
      && owner.role !== 'GK' && !owner.sentOff
      && owner.decisionTimer <= 0 && sinceLast >= MOMENT_SPACING;
    if (qualifies) {
      r.qualifying += 1;
      const gid = owner!.gid;
      const before = cloneSimulationState(m);
      if (owner!.firstTouchWindow > 0) {
        r.exFirstTouch += 1;
      } else if (m.restartKickGid === gid) {
        r.exMustKick += 1;
      } else {
        const decided = decidedActionOf(before, gid);
        if (decided === 'Shoot') {
          r.exShoot += 1;
        } else if (decided === 'ClearBall') {
          r.exClear += 1;
        } else {
          r.eligible += 1;
          const truth = trueCellOf(m, owner!);
          if (HOLDABLE_CELLS.includes(truth.key)) r.trueHoldable += 1;
        }
      }
      sinceLast = 0;
      inMatch += 1;
    }

    m.step(DT);
    tick += 1;
    r.ticksWalked += 1;
    sinceLast += 1;
    /* ⭐ ruler 5 runs BEFORE the full-time break, because the census's own loop processes every
     * stepped tick including the terminal one. Every other instrument below keeps its existing
     * early-break behaviour EXACTLY — this lift moves no previously measured number. */
    ggStep();
    if (m.finished) break;
    const phase = m.phase;
    const now = m.ball.owner;
    const nowGid = now === null ? null : now.gid;

    /* ============ ruler 2: the tempo-census spell/touch machinery ============ */
    if (phase !== 'playing') {
      curSpellOrigin = null; curSpellSide = null; curSpellTouches = 0;
      prevOwnerGid = null;
    } else {
      r.playedTicks += 1;
      if (now === null) {
        prevOwnerGid = null;
      } else {
        const side = now.side;
        if (curSpellSide !== null && curSpellSide !== side) {
          curSpellOrigin = null; curSpellSide = null; curSpellTouches = 0;
        }
        if (curSpellOrigin === null) {
          curSpellOrigin = m.kickoffKickGid === now.gid ? 'kickoff'
            : m.restartKickGid === now.gid ? 'restart' : 'openPlay';
          curSpellSide = side;
          curSpellTouches = 0;
          if (curSpellOrigin === 'openPlay') r.spellsOpenPlay += 1;
        }
        if (nowGid !== prevOwnerGid) {
          // a NEW ownership episode = a TOUCH (reception / re-collect / tackle-win)
          const isFirstOfSpell = curSpellTouches === 0;
          curSpellTouches += 1;
          if (isFirstOfSpell && curSpellOrigin === 'openPlay') {
            // ⭐ THE #173 POPULATION, VERBATIM: the FIRST reception of each openPlay-origin
            // spell, EVERY role included (the census's touch record excludes none). Rulers
            // 3b/4b are read on this SAME population so their shares are commensurable with
            // the inherited denominator.
            const pressed = nearestOpponent(m, now) <= PRESSURE_R;
            const short = shortOptionFor(now);
            r.firstRecOpen += 1;
            if (pressed) r.firstRecOpenPressed += 1;
            if (short) r.firstRecShort += 1;
            if (pressed && short) r.firstRecPressedShort += 1;
          }
        }
        prevOwnerGid = nowGid;

        /* ===== rulers 3 + 4 at POSSESSION-TICK grain =====
         * DECLARED: a GK carrier is excluded at THIS grain (a keeper holding the ball is
         * not the check-to-ball question, and it is the #186 eligibility's own role rule).
         * The first-reception grain above keeps EVERY role, because its denominator is the
         * inherited #173 population. Both choices are stated, neither is silent. */
        if (now.role !== 'GK' && !now.sentOff) {
          r.possTicks += 1;
          const short = shortOptionFor(now);
          const pressed = nearestOpponent(m, now) <= PRESSURE_R;
          if (short) r.possTicksShort += 1;
          if (pressed) r.possTicksPressed += 1;
          if (pressed && short) r.possTicksPressedShort += 1;
        }
      }
    }

    /* ===== G-ARM + clamp saturation: the seam, read where it is consumed ===== */
    if (phase === 'playing') {
      for (const t of m.teams) {
        for (const p of t.players) {
          if (p.action.type !== 'SupportBallCarrier' || p.sentOff) continue;
          r.supportTicks += 1;
          const base = supportSpot(p, t, m.ball);
          const got = supportSpot(p, t, m.ball, armedFlag);
          const shift = Math.hypot(got.x - base.x, got.y - base.y);
          if (shift > 0) r.supportTicksShifted += 1;
          r.supportShiftSum += shift;
          r.supportShiftMax = Math.max(r.supportShiftMax, shift);
          if ((got.x - m.ball.pos.x) * t.attackDir < 0) r.supportBehindBall += 1;
          // ⭐ CLAMP SATURATION (#224.4(ii)): the INCUMBENT pitch clamps, priced by
          // recomputing the PRE-CLAMP expression exactly as `supportSpot` builds it (the
          // CTB-T0 G-BITE idiom). Saturation is part of the dose-response, not slop.
          const g = t.genome;
          const radius = supportRadiusOf(g);
          const bias = t.mode === 'CounterAttack' || t.mode === 'Attack' ? 0.75 : 0.35;
          const depthShift = armedFlag ? ctbSupportDepthWeight(g) * CTB_DEPTH_BIAS_SPAN : 0;
          const widthScale = armedFlag ? 1 + ctbSupportWidthWeight(g) : 1;
          const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;
          const lane = formationSpot(p, t, m.ball, true);
          const preX = m.ball.pos.x + t.attackDir * radius * (bias + depthShift);
          const preY = m.ball.pos.y
            + clamp((lane.y - m.ball.pos.y) * SUPPORT_LAT_PULL * widthScale, -maxLat, maxLat);
          if (Math.abs(preX) > HALF_L - 2) r.clampXBound += 1;
          if (Math.abs(preY) > HALF_W - 2) r.clampYBound += 1;
          // ⚠ G-ARM, CORRECTED AFTER A GUARD-BLOCK RUN (recorded, not rewritten — the
          // CTB-T0 §DEV 3 form): a DOSED tick can fail to move ONLY where the INCUMBENT
          // pitch clamp already binds on BOTH the incumbent and the dosed pre-clamp value
          // and pins them to the SAME bound. That is #224.4(ii)'s named clamp saturation,
          // not a dead seam. The predicate is made EXACT rather than loosened: every
          // non-shifting dosed tick must be clamp-bound on the axis the dose acts on.
          // ⚠ CORRECTED AGAIN, PRE-BATTERY (the ruled amendment): the counter used to fire on
          // TRIVIAL EQUALITY too, so in ABSENT / ARMED-ZERO — where there is no dose at all and
          // the two expressions are the SAME expression — it counted every unshifted tick and
          // contradicted its own published `clampBoundSemantics`. It now fires ONLY when a dose
          // EXISTS and the incumbent clamp GENUINELY pinned two DIFFERENT pre-clamp values to
          // the SAME bound on at least one axis. The gate predicate is unchanged (`gArmPass`
          // reads `zeroShift` in the undosed arms), and the dosed arms' counts are unchanged:
          // a non-zero dose always separates the pre-clamp values on the axis it acts on.
          if (shift === 0 && armedFlag) {
            const maxLat0 = radius * SUPPORT_LAT_CAP_FRAC;
            const preX0 = m.ball.pos.x + t.attackDir * radius * bias;
            const preY0 = m.ball.pos.y
              + clamp((lane.y - m.ball.pos.y) * SUPPORT_LAT_PULL, -maxLat0, maxLat0);
            const xGenuine = preX0 !== preX && Math.abs(preX0) > HALF_L - 2
              && Math.abs(preX) > HALF_L - 2 && Math.sign(preX0) === Math.sign(preX);
            const yGenuine = preY0 !== preY && Math.abs(preY0) > HALF_W - 2
              && Math.abs(preY) > HALF_W - 2 && Math.sign(preY0) === Math.sign(preY);
            const xPinned = preX0 === preX || xGenuine;
            const yPinned = preY0 === preY || yGenuine;
            if (xPinned && yPinned && (xGenuine || yGenuine)) {
              r.supportTicksUnshiftedClampBound += 1;
            }
          }
        }
      }
    }

    /* ============ the whole-match GUARDS (PM-T1 P3′ / B1-a forms) ============ */
    if (tick % SAMPLE_EVERY !== 0 || phase !== 'playing') continue;
    samples += 1;
    for (const t of m.teams) {
      const side = t.side as 0 | 1;
      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
      if (outfield.length === 0) continue;
      const hasBall = m.possessionSide === side;
      (hasBall ? spreadIn : spreadOut)[side].push(sd(outfield.map((p) => p.pos.y)));
      if (samples % PAIR_SUBSAMPLE === 0) {
        for (let i = 0; i < outfield.length; i++) {
          for (let j = i + 1; j < outfield.length; j++) pairs[side].push(dist(outfield[i].pos, outfield[j].pos));
        }
      }
    }
  }

  /* --- ruler 5: close the open segment and fold the per-match genealogy rows --- */
  if (ggCur !== null) { ggClose(ggCur, 'matchEnd', null); ggCur = null; }
  r.ggSegments = ggSegs.length;
  r.ggGoals = ggGoalRecs;
  for (const s of ggSegs) {
    r.ggSegmentsByOrigin[s.origin] += 1;
    r.ggSegmentsByOriginAtRegainSpot[s.originAtRegainSpot] += 1;
    r.ggAssignedTicksSum += s.assignedTicks;
    if (s.terminator === 'opponentControl') r.ggTurnoversTotal += 1;
  }

  const bothPairs = [...pairs[0], ...pairs[1]];
  r.spreadYOut = mean([...spreadOut[0], ...spreadOut[1]]);
  r.spreadYIn = mean([...spreadIn[0], ...spreadIn[1]]);
  r.spacingMedian = quantile(bothPairs, 0.5);
  r.spacingUnder4 = bothPairs.length === 0 ? Number.NaN
    : bothPairs.filter((v) => v < CLOSE_PAIR_M).length / bothPairs.length;
  const st = [m.teams[0].stats, m.teams[1].stats];
  r.interceptions = st[0].interceptions + st[1].interceptions;
  r.offsides = st[0].offsides + st[1].offsides;
  r.fouls = st[0].fouls + st[1].fouls;
  r.penalties = st[0].penalties + st[1].penalties;
  r.goals = st[0].goals + st[1].goals;
  r.crosses = st[0].crosses + st[1].crosses;
  r.headers = st[0].headersWon + st[1].headersWon;
  r.longBalls = st[0].longBalls + st[1].longBalls;
  r.cutbacks = st[0].cutbacks + st[1].cutbacks;
  r.reachedFullTime = m.finished ? 1 : 0;
  r.signature = signatureOf(m);
  return r;
};

/* ========================================================================== */
/* §8 SUMMARIES + the paired per-seed cluster bootstrap                        */
/* ========================================================================== */
const RATE_KEYS = [
  'trueHoldableShare', 'pressedFirstReceptionShare',
  'shortOptionPossShare', 'shortOptionFirstRecShare',
  'supportAtPressedPossShare', 'supportAtPressedFirstRecShare',
  'interceptionsPerMatch', 'offsidesPerMatch', 'foulsPerMatch', 'goalsPerMatch',
  'spreadYOut', 'spreadYIn', 'spacingMedian', 'spacingUnder4',
  'clampXShare', 'clampYShare', 'behindBallShare', 'meanShiftM',
  /* ⭐ ruler 5 — the #218 ARC RULER's own named shares, carried into the SAME paired
   * seed-cluster bootstrap as everything else, so the battery reads them with CIs, paired
   * deltas and mechanical `resolved` flags instead of bare per-arm counts.
   * ⚠ THEY STAY REPORTED: no gate reads any of them, the pre-registered §SUCCESS set and the
   * frozen F-CTB-a/b/c STOP set are UNCHANGED, and `resolved` here is the same mechanical CI
   * flag it is everywhere else (#203) — never a verdict. Per #218 the arc-grain question is
   * whether these shares MOVE, and that is the commander's to read. */
  'constructedGe3Share', 'constructedGe4Share', 'constructedGe5Share',
  'scrambleShareOfGoals', 'setPieceShareOfGoals',
] as const;
type RateKey = typeof RATE_KEYS[number];
/** the construction ladder's numerator/denominator on the NON-SET-PIECE pool, summed over rows */
const ggPool = (rows: readonly PerMatch[], k: number): { num: number; den: number } => {
  let num = 0; let den = 0;
  for (const r of rows) {
    for (const g of r.ggGoals) {
      if (g.family === 'setPiece') continue;
      den += 1;
      if (g.completedPasses >= k) num += 1;
    }
  }
  return { num, den };
};
const rateOf = (rows: readonly PerMatch[], key: RateKey): number => {
  const s = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  const n = Math.max(1, rows.length);
  const finiteMean = (f: (r: PerMatch) => number): number => {
    const xs = rows.map(f).filter(Number.isFinite);
    return xs.length === 0 ? Number.NaN : xs.reduce((a, b) => a + b, 0) / xs.length;
  };
  switch (key) {
    case 'trueHoldableShare': return s((r) => r.trueHoldable) / Math.max(1, s((r) => r.eligible));
    case 'pressedFirstReceptionShare': return s((r) => r.firstRecOpenPressed) / Math.max(1, s((r) => r.firstRecOpen));
    case 'shortOptionPossShare': return s((r) => r.possTicksShort) / Math.max(1, s((r) => r.possTicks));
    case 'shortOptionFirstRecShare': return s((r) => r.firstRecShort) / Math.max(1, s((r) => r.firstRecOpen));
    case 'supportAtPressedPossShare': return s((r) => r.possTicksPressedShort) / Math.max(1, s((r) => r.possTicksPressed));
    case 'supportAtPressedFirstRecShare': return s((r) => r.firstRecPressedShort) / Math.max(1, s((r) => r.firstRecOpenPressed));
    case 'interceptionsPerMatch': return s((r) => r.interceptions) / n;
    case 'offsidesPerMatch': return s((r) => r.offsides) / n;
    case 'foulsPerMatch': return s((r) => r.fouls) / n;
    case 'goalsPerMatch': return s((r) => r.goals) / n;
    case 'spreadYOut': return finiteMean((r) => r.spreadYOut);
    case 'spreadYIn': return finiteMean((r) => r.spreadYIn);
    case 'spacingMedian': return finiteMean((r) => r.spacingMedian);
    case 'spacingUnder4': return finiteMean((r) => r.spacingUnder4);
    case 'clampXShare': return s((r) => r.clampXBound) / Math.max(1, s((r) => r.supportTicks));
    case 'clampYShare': return s((r) => r.clampYBound) / Math.max(1, s((r) => r.supportTicks));
    case 'behindBallShare': return s((r) => r.supportBehindBall) / Math.max(1, s((r) => r.supportTicks));
    case 'meanShiftM': return s((r) => r.supportShiftSum) / Math.max(1, s((r) => r.supportTicks));
    /* ruler 5 — RATIO-OF-TOTALS, exactly like every other share above: the numerator and the
     * denominator are each summed over the resampled seed set, then divided. The construction
     * ladder is read on the NON-SET-PIECE pool (the census's own primary pool); the scramble
     * and set-piece shares are read on ALL goals. */
    case 'constructedGe3Share': return ggPool(rows, 3).num / Math.max(1, ggPool(rows, 3).den);
    case 'constructedGe4Share': return ggPool(rows, 4).num / Math.max(1, ggPool(rows, 4).den);
    case 'constructedGe5Share': return ggPool(rows, 5).num / Math.max(1, ggPool(rows, 5).den);
    case 'scrambleShareOfGoals':
      return s((r) => r.ggGoals.filter((g) => g.origin === 'scrambleLooseBall').length)
        / Math.max(1, s((r) => r.ggGoals.length));
    case 'setPieceShareOfGoals':
      return s((r) => r.ggGoals.filter((g) => g.family === 'setPiece').length)
        / Math.max(1, s((r) => r.ggGoals.length));
  }
};
const BAND_RATE: Record<BandKey, (r: PerMatch) => number> = {
  goals: (r) => r.goals, crosses: (r) => r.crosses, headers: (r) => r.headers,
  longBalls: (r) => r.longBalls, cutbacks: (r) => r.cutbacks,
};

/* --- ruler 5: the #218 LIFT's per-arm rows. DESCRIPTIVE (#203); NO gate reads them. ------ */
const ggShare = (num: number, den: number): number => round(den === 0 ? Number.NaN : num / den, 5);
const ggSummary = (rows: readonly PerMatch[]) => {
  const goals = rows.flatMap((r) => r.ggGoals);
  const n = goals.length;
  const counts = (pick: (g: GgGoalRec) => OriginClass): GgCounts => {
    const c = ggZeroCounts();
    for (const g of goals) c[pick(g)] += 1;
    return c;
  };
  const byOrigin = counts((g) => g.origin);
  const byOriginAtRegainSpot = counts((g) => g.originAtRegainSpot);
  const byFamily = {
    setPiece: goals.filter((g) => g.family === 'setPiece').length,
    restart: goals.filter((g) => g.family === 'restart').length,
    openPlay: goals.filter((g) => g.family === 'openPlay').length,
  };
  const ladderOn = (pool: readonly GgGoalRec[]) => ({
    pool: pool.length,
    ladder: Object.fromEntries(CONSTRUCTED_LADDER.map((k) => {
      const constructed = pool.filter((g) => g.completedPasses >= k).length;
      return [`ge${k}`, {
        threshold: k, constructed, transition: pool.length - constructed,
        constructedShareOfPool: ggShare(constructed, pool.length),
        constructedShareOfAllGoals: ggShare(constructed, n),
      }];
    })),
  });
  const segByOrigin = ggZeroCounts();
  const segByOriginAtRegain = ggZeroCounts();
  for (const r of rows) {
    for (const o of GG_ORIGIN_CLASSES) {
      segByOrigin[o] += r.ggSegmentsByOrigin[o];
      segByOriginAtRegain[o] += r.ggSegmentsByOriginAtRegainSpot[o];
    }
  }
  const sm = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  const matches = Math.max(1, rows.length);
  const lossThirdCells: Record<string, number> = { own: 0, middle: 0, final: 0, notARegain: 0 };
  for (const g of goals) {
    if (g.lossThird === null) lossThirdCells.notARegain += 1; else lossThirdCells[g.lossThird] += 1;
  }
  return {
    provenance: '⭐ THE #218 LIFT: the goal-genealogy census\'s ORIGIN CLASSIFIER, ported from '
      + 'scripts/probes/goal-genealogy-census.ts with its LOSS-TICK semantics VERBATIM '
      + '(#215.3-H1/M2 — the by-third classes are cut on the ball at the previous segment\'s LAST '
      + 'OWNED tick, mirrored into the WINNER\'s frame; the REGAIN-tick reading rides beside it '
      + 'as the declared cross-cut). Gate: G-REPRO-GGC, which re-walks the census\'s OWN smoke '
      + 'block and must reproduce its committed PROD rows EXACTLY. The limbs this exam does not '
      + 'read (pass LOCATION, own-third chains, the danger-window ladder) are not lifted — the '
      + 'G-REPRO-173 precedent, and the gate is what proves the omission changes nothing on the '
      + 'columns that ARE read.',
    status: 'REPORTED, at BOTH smoke and battery grain. NO GATE HANGS ON ANY SHARE BELOW in T1; '
      + 'per #218 the arc-grain reading is whether the shares MOVE, and that is the commander\'s.',
    goals: n,
    goalsPerMatch: round(n / matches, 4),
    byOrigin,
    byOriginShare: Object.fromEntries(GG_ORIGIN_CLASSES.map((o) => [o, ggShare(byOrigin[o], n)])),
    byOriginAtRegainSpot,
    byFamily,
    byFamilyShare: {
      setPiece: ggShare(byFamily.setPiece, n),
      restart: ggShare(byFamily.restart, n),
      openPlay: ggShare(byFamily.openPlay, n),
    },
    scrambleShareOfGoals: ggShare(byOrigin.scrambleLooseBall, n),
    setPieceShareOfGoals: ggShare(byFamily.setPiece, n),
    turnoverByThirdOriginShares: {
      own: ggShare(byOrigin.turnoverWonInOwnThird, n),
      middle: ggShare(byOrigin.turnoverWonInMiddleThird, n),
      final: ggShare(byOrigin.turnoverWonInFinalThird, n),
      note: 'thirds are named in the WINNING team\'s attacking frame: turnoverWonInFinalThird = a '
        + 'HIGH regain = the ball was lost in the LOSER\'s own third (exact mirror).',
    },
    byLossThird: lossThirdCells,
    constructedLadder: {
      note: 'A REPORTING GRID (#214.1a), NOT a gate and NOT a tuned N: constructed(k) = a goal '
        + 'whose segment completed ≥ k passes, at every k ∈ {3,4,5}, on TWO pools.',
      nonSetPiece: ladderOn(goals.filter((g) => g.family !== 'setPiece')),
      openPlayOriginOnly: ladderOn(goals.filter((g) => g.family === 'openPlay')),
    },
    segmentPopulation: {
      segments: sm((r) => r.ggSegments),
      segmentsPerMatch: round(sm((r) => r.ggSegments) / matches, 4),
      byOrigin: segByOrigin,
      byOriginAtRegainSpot: segByOriginAtRegain,
    },
    turnovers: {
      total: sm((r) => r.ggTurnoversTotal),
      ownThird: sm((r) => r.ggOwnThirdTurnovers),
      ownThirdAtRegainSpot: sm((r) => r.ggOwnThirdTurnoversAtRegainSpot),
      ownThirdPerMatch: round(sm((r) => r.ggOwnThirdTurnovers) / matches, 4),
      ownThirdShareOfAllTurnovers: ggShare(sm((r) => r.ggOwnThirdTurnovers), sm((r) => r.ggTurnoversTotal)),
    },
    accounting: {
      totalTicks: sm((r) => r.ggTotalTicks),
      deadBallTicks: sm((r) => r.ggDeadBallTicks),
      segmentTicks: sm((r) => r.ggSegmentTicks),
      looseGapTicks: sm((r) => r.ggLooseGapTicks),
      assignedTicksSum: sm((r) => r.ggAssignedTicksSum),
      goalsFromScore: sm((r) => r.ggGoalsFromScore),
      goalsMappedToSegments: n,
      unattributedGoals: sm((r) => r.ggUnattributedGoals),
      spanOrderViolations: sm((r) => r.ggSpanOrderViolations),
    },
  };
};

const armSummary = (rows: PerMatch[]) => {
  const s = (f: (r: PerMatch) => number): number => rows.reduce((a, r) => a + f(r), 0);
  return {
    matches: rows.length,
    /* ruler 1 */
    ruler1TrueHoldable: {
      qualifyingTotal: s((r) => r.qualifying),
      eligibleTotal: s((r) => r.eligible),
      exclusions: {
        firstTouch: s((r) => r.exFirstTouch), mustKick: s((r) => r.exMustKick),
        a0Shoot: s((r) => r.exShoot), a0Clear: s((r) => r.exClear),
      },
      holdableCells: HOLDABLE_CELLS,
      trueHoldableTotal: s((r) => r.trueHoldable),
      shareOfEligible: round(rateOf(rows, 'trueHoldableShare')),
    },
    /* ruler 2 */
    ruler2PressedFirstReception: {
      openPlaySpells: s((r) => r.spellsOpenPlay),
      firstReceptions: s((r) => r.firstRecOpen),
      pressed: s((r) => r.firstRecOpenPressed),
      pressedShare: round(rateOf(rows, 'pressedFirstReceptionShare'), 5),
      radiusM: PRESSURE_R,
    },
    /* rulers 3 + 4 */
    ruler3ShortOptionSupply: {
      possessionTicks: s((r) => r.possTicks),
      possessionTicksWithShortOption: s((r) => r.possTicksShort),
      shareOfPossessionTicks: round(rateOf(rows, 'shortOptionPossShare')),
      firstReceptionsWithShortOption: s((r) => r.firstRecShort),
      shareOfFirstReceptions: round(rateOf(rows, 'shortOptionFirstRecShare')),
      radiusTrace,
    },
    ruler4SupportAtPressed: {
      pressedPossessionTicks: s((r) => r.possTicksPressed),
      pressedPossessionTicksWithShortOption: s((r) => r.possTicksPressedShort),
      shareOfPressedPossessionTicks: round(rateOf(rows, 'supportAtPressedPossShare')),
      pressedFirstReceptions: s((r) => r.firstRecOpenPressed),
      pressedFirstReceptionsWithShortOption: s((r) => r.firstRecPressedShort),
      shareOfPressedFirstReceptions: round(rateOf(rows, 'supportAtPressedFirstRecShare')),
    },
    /* ruler 5 — the #218 LIFT, REPORTED (no gate reads any of it) */
    ruler5BuildUp: {
      goalsTotal: s((r) => r.goals),
      goalsPerMatch: round(rateOf(rows, 'goalsPerMatch'), 4),
      genealogy: ggSummary(rows),
    },
    /* the seam, reached */
    seam: {
      supportTicks: s((r) => r.supportTicks),
      supportTicksShifted: s((r) => r.supportTicksShifted),
      meanShiftMetres: round(rateOf(rows, 'meanShiftM'), 4),
      maxShiftMetres: round(Math.max(...rows.map((r) => r.supportShiftMax)), 4),
      behindBallTicks: s((r) => r.supportBehindBall),
      behindBallShare: round(rateOf(rows, 'behindBallShare')),
      genesOnAllViewsSeeds: s((r) => r.genesOnAllViews),
      clampXBoundTicks: s((r) => r.clampXBound),
      clampXShare: round(rateOf(rows, 'clampXShare')),
      clampYBoundTicks: s((r) => r.clampYBound),
      clampYShare: round(rateOf(rows, 'clampYShare')),
      clampNote: 'CLAMP SATURATION (#224.4(ii)): the INCUMBENT pitch clamps ±(HALF_L−2) / '
        + '±(HALF_W−2) bind on real ticks and bind MORE at the deep/wide dose ends. Published '
        + 'so the dose-response reads honestly — it is not slop and it is not a gate.',
    },
    /* the guards */
    guards: {
      interceptionsPerMatch: round(rateOf(rows, 'interceptionsPerMatch'), 4),
      offsidesPerMatch: round(rateOf(rows, 'offsidesPerMatch'), 4),
      foulsPerMatch: round(rateOf(rows, 'foulsPerMatch'), 4),
      spreadYOut: round(rateOf(rows, 'spreadYOut'), 4),
      spreadYIn: round(rateOf(rows, 'spreadYIn'), 4),
      spacingMedian: round(rateOf(rows, 'spacingMedian'), 4),
      spacingUnder4: round(rateOf(rows, 'spacingUnder4')),
      band: Object.fromEntries(BAND_KEYS.map((k) => {
        const lvl = mean(rows.map(BAND_RATE[k]).filter(Number.isFinite));
        return [k, {
          perMatch: round(lvl, 4), baseline: BAND_BASELINE[k], tolerance: BAND_TOLERANCE[k],
          inBand: Number.isFinite(lvl)
            && Math.abs(lvl - BAND_BASELINE[k]) <= BAND_TOLERANCE[k] * BAND_BASELINE[k],
        }];
      })),
      phase305InterceptionContext: PHASE305_INTERCEPTION_CONTEXT,
      phase305Note: 'REPORTED CONTEXT ONLY, never a gate: the Phase 30.5 column disease ran at '
        + '33 interceptions/match (the `supportSpot` doc comment). It is a historical probe '
        + 'reading in a comment, not a live assertion anywhere in tests (#224.4(i)).',
    },
    context: {
      ticksWalked: s((r) => r.ticksWalked),
      playedTicks: s((r) => r.playedTicks),
      matchesReachingFullTime: s((r) => r.reachedFullTime),
    },
  };
};

/** the paired per-seed cluster bootstrap: ONE resampled index set feeds EVERY arm. */
const bootstrapAll = (byArm: Record<ArmName, PerMatch[]>) => {
  const n = byArm[CONTROL_ARM].length;
  const rng = new Rng(BOOTSTRAP_SEED);
  const draws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    draws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  const deltaDraws: Record<string, Record<ArmName, number[]>> = {};
  for (const k of RATE_KEYS) {
    deltaDraws[k] = Object.fromEntries(ARMS.map((a) => [a, [] as number[]])) as Record<ArmName, number[]>;
  }
  for (let b = 0; b < BOOTSTRAP_RESAMPLES; b++) {
    const idx: number[] = [];
    for (let i = 0; i < n; i++) idx.push(Math.min(n - 1, Math.floor(rng.next() * n)));
    const resampled = Object.fromEntries(
      ARMS.map((a) => [a, idx.map((i) => byArm[a][i])]),
    ) as Record<ArmName, PerMatch[]>;
    for (const k of RATE_KEYS) {
      const base = rateOf(resampled[CONTROL_ARM], k);
      for (const a of ARMS) {
        const v = rateOf(resampled[a], k);
        draws[k][a].push(v);
        deltaDraws[k][a].push(v - base);
      }
    }
  }
  const ci = (xs: number[], dp: number) => {
    const s = xs.filter((v) => Number.isFinite(v)).sort((x, y) => x - y);
    return {
      lower: round(pctlSorted(s, 0.025), dp), upper: round(pctlSorted(s, 0.975), dp),
      finiteDraws: s.length, draws: xs.length,
    };
  };
  const rates: Record<string, unknown> = {};
  for (const k of RATE_KEYS) {
    const dp = 6;
    rates[k] = Object.fromEntries(ARMS.map((a) => {
      const point = rateOf(byArm[a], k);
      const d = ci(deltaDraws[k][a], dp);
      return [a, {
        point: round(point, dp), ...ci(draws[k][a], dp),
        pairedDelta: a === CONTROL_ARM ? null
          : { point: round(point - rateOf(byArm[CONTROL_ARM], k), dp), ...d },
        resolved: a !== CONTROL_ARM && Number.isFinite(d.lower) && Number.isFinite(d.upper)
          && (d.lower > 0 || d.upper < 0),
      }];
    }));
  }
  return {
    method: 'per-match (seed-clustered) PAIRED bootstrap, ratio-of-totals estimator, '
      + '2.5/97.5 percentiles; ONE resampled seed-index set feeds EVERY arm (#20 cluster = seed)',
    statsBase: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES, clusters: n,
    deltaDirection: `ARM − ${CONTROL_ARM}`,
    resolvedNote: '`resolved` is a MECHANICAL CI FLAG (the paired-delta CI excludes zero), '
      + 'NEVER a verdict (#203). F-CTB-a/b/c are the commander\'s.',
    ruler5KeysNote: '⭐ the five ruler-5 keys (constructedGe3/4/5Share on the NON-SET-PIECE pool, '
      + 'scrambleShareOfGoals, setPieceShareOfGoals) ride the SAME paired bootstrap as every '
      + 'other column, so the battery reads the #218 arc ruler with CIs and paired deltas rather '
      + 'than bare counts. ⚠ THEY REMAIN REPORTED: NO GATE READS THEM, and the pre-registered '
      + '§SUCCESS condition and the frozen F-CTB-a/b/c STOP set are UNCHANGED by their presence.',
    rates,
  };
};

/* ========================================================================== */
/* §9 THE N RULE — derived IN-PROBE from the COMMITTED artifacts               */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.841621234;
const readJson = (p: string): { bytes: Buffer; j: any } | null => (existsSync(p)
  ? (() => { const bytes = readFileSync(p); return { bytes, j: JSON.parse(bytes.toString('utf8')) }; })()
  : null);
const O2T1 = readJson(O2T1_PATH);
const TEMPO_SMOKE = readJson(TEMPO_SMOKE_PATH);
const TEMPO = readJson(TEMPO_PATH);
const GGC_SMOKE = readJson(GGC_SMOKE_PATH);

const nRule = (() => {
  if (O2T1 === null || TEMPO === null) {
    return { available: false, note: `absent: ${O2T1_PATH} / ${TEMPO_PATH}`, nStar: null as number | null };
  }
  const j = O2T1.j;
  const ctrl = j.arms.control;
  const eligPerSeed = ctrl.eligibleTotal / j.seeds;
  const c1 = j.contrasts.rates.trueContextShare;
  const p0q1 = c1.control.point as number;
  /** ⭐ TRACED MDE: the smallest move this instrument has ever RESOLVED in a banked battery. */
  const mdeQ1 = Math.abs(c1.pairedDelta.point as number);
  const p1q1 = p0q1 + mdeQ1;
  const m320 = ctrl.eligibleTotal as number;
  const seBoot = ((c1.pairedDelta.upper - c1.pairedDelta.lower) / 2) / Z975;
  const seIid = Math.sqrt((p0q1 * (1 - p0q1) + (c1.look.point as number)
    * (1 - (c1.look.point as number))) / m320);
  const deff = (seBoot * seBoot) / (seIid * seIid);
  const mIid = (p0: number, p1: number): number =>
    ((Z975 + Z80) ** 2 * (p0 * (1 - p0) + p1 * (1 - p1))) / ((p1 - p0) ** 2);
  const mReqQ1 = deff * mIid(p0q1, p1q1);
  const nQ1 = Math.ceil(mReqQ1 / eligPerSeed);

  /* q2 — the #173 column. p0 and the MDE both READ from the committed census. */
  const arms = TEMPO.j.result.arms;
  const shareOf = (a: string): number => arms[a].pressContext.firstReceptionsOfSpell.pressedShare as number;
  const p0q2 = shareOf('prod');
  const mdeQ2 = Math.min(Math.abs(shareOf('v1') - p0q2), Math.abs(shareOf('v2') - p0q2));
  const p1q2 = p0q2 - mdeQ2;
  const frPerSeed = (arms.prod.pressContext.firstReceptionsOfSpell.all.n as number)
    / (arms.prod.matches as number);
  const mReqQ2 = deff * mIid(p0q2, p1q2);
  const nQ2 = Math.ceil(mReqQ2 / frPerSeed);

  const nRaw = Math.max(nQ1, nQ2);
  /** ⭐ THE RULED AMENDMENT (pre-battery, before any battery number exists): the dispatch's
   *  500-seed cap was the DISPATCH's, never the contract's, so THE RULE'S OWN NUMBER governs —
   *  the conservative direction. The only ceiling left is STRUCTURAL: the battery block may not
   *  run into the next consumed interval, and that room is computed from the ledger in-probe. */
  const nStar = Math.min(BATTERY_ROOM, nRaw);
  return {
    available: true,
    rule: 'm_iid = (z.975+z.80)^2 (p0(1−p0)+p1(1−p1)) / (p1−p0)^2 ; DEFF measured off the O2-T1 '
      + 'committed paired-delta CI on the SAME column at 320 clusters ; m_req = DEFF·m_iid ; '
      + 'N(q) = ceil(m_req / momentsPerSeed) ; N = max_q N(q), floored ONLY by the ledger room',
    sources: {
      o2t1: { path: O2T1_PATH, sha256: sha(O2T1.bytes.toString('utf8')), resultSha: j.resultSha256 },
      tempo: { path: TEMPO_PATH, sha256: sha(TEMPO.bytes.toString('utf8')), resultSha: TEMPO.j.resultSha256 },
    },
    deff: round(deff, 4),
    q1TrueHoldable: {
      p0: p0q1, mde: mdeQ1, p1: round(p1q1, 8),
      mdeProvenance: 'the O2-T1 COMMITTED paired delta on trueContextShare — THE ONE paired '
        + 'delta this instrument has resolved in a banked battery (O2-T1, two arms). ⚠ CORRECTED '
        + 'PRE-BATTERY: the earlier wording said "the SMALLEST move ever resolved", which dresses '
        + 'a selection from a set of ONE as a minimum over many. The number is unchanged and it '
        + 'is still traced, never chosen after sight.',
      eligiblePerSeed: round(eligPerSeed, 4), mIid: round(mIid(p0q1, p1q1), 1),
      mReq: round(mReqQ1, 1), n: nQ1,
    },
    q2PressedFirstReception: {
      p0: p0q2, mde: round(mdeQ2, 6), p1: round(p1q2, 8),
      mdeProvenance: 'the SMALLEST cross-arm difference the #173 census itself published on this '
        + 'column (prod vs v1/v2), read from the committed artifact',
      deffProvenance: 'INHERITED from q1 — declared: #173 is a single-arm census and publishes '
        + 'no paired CI for this column',
      firstReceptionsPerSeed: round(frPerSeed, 4), mIid: round(mIid(p0q2, p1q2), 1),
      mReq: round(mReqQ2, 1), n: nQ2,
    },
    binding: nQ1 >= nQ2 ? 'q1TrueHoldable' : 'q2PressedFirstReception',
    nRaw,
    batteryRoom: BATTERY_ROOM,
    roomBinds: nRaw > BATTERY_ROOM,
    nStar,
    batteryBlock: `${BATTERY_BASE}..${BATTERY_BASE + nStar - 1}`,
    capAmendment: '⭐ RULED PRE-BATTERY, before any battery number exists: N is the RULE\'S OWN '
      + `number (${nRaw}), not the dispatch's 500-seed cap — the cap belonged to the dispatch, not `
      + 'to the contract, and honouring the in-probe rule is the conservative direction. The only '
      + `remaining ceiling is the LEDGER's: the block may not reach the next consumed interval `
      + `(${NEXT_CONSUMED_AFTER_BATTERY}), leaving ${BATTERY_ROOM} seeds of room — computed here, `
      + 'never typed.',
    primaryRulers: 'ruler 1 (TRUE-holdable supply) + ruler 2 (pressed-first-reception) — the two '
      + 'UNSATURATED quantities, and the two the N rule is cut on. Rulers 3/4 are DEMOTED to '
      + 'REPORTED with their ceilings DISCLOSED (see `saturationCeilings`).',
  };
})();

/* ========================================================================== */
/* §10 MODE / SEED ROUTING (the exit-semantics guard block)                    */
/* ========================================================================== */
const RUN_N = MODE === 'smoke' ? (N_ENV ?? SMOKE_N) : (N_ENV ?? (nRule.nStar ?? 0));
const RUN_BASE = OVERRIDDEN ? GUARD_BLOCK[0] : (MODE === 'smoke' ? SMOKE_BASE : BATTERY_BASE);
if (MODE === 'full' && RUN_N <= 0) {
  console.error(`CTB-T1 FATAL — full mode needs the committed artifacts for the N rule (${O2T1_PATH}).`);
  process.exit(2);
}

banner('');
banner('=============================================================================');
banner(`CTB-T1 SUPPORT-SUPPLY EXAM (#224.5) · mode ${MODE} · N ${RUN_N} seeds × ${ARMS.length} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1} · world = BARE PRODUCTION-SHAPED (doc §FORM)`);
banner(`arms differ by EXACTLY the ctb dose · gene domain [${CTB_GENE_MIN}, ${CTB_GENE_MAX}]`);
banner(`N rule ⇒ N* ${String(nRule.nStar)} (the rule's own number; ledger room ${BATTERY_ROOM})`);
if (OVERRIDDEN) {
  banner('⚠ OVERRIDE IN FORCE (CTBT1_N / CTBT1_SKIP_FP) — routed onto the EXIT-SEMANTICS GUARD');
  banner(`  BLOCK ${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}; G-CLEAN-INVOCATION goes RED and this run`);
  banner('  adjudicates NOTHING.');
}
banner('=============================================================================');

/* ========================================================================== */
/* §11 CHECKPOINT / RESUME — RESILIENCE ONLY (#207 form)                       */
/* ========================================================================== */
const CKPT_PATH = process.env.CTBT1_CHECKPOINT ?? '/tmp/ctb-t1-checkpoint.jsonl';
const RESUME = process.env.CTBT1_RESUME === '1';
const CHECKPOINTING = MODE === 'full';
const PROBE_SELF_PATH = 'scripts/probes/ctb-t1-supply-exam.ts';
const NONFINITE_TAG = '__nonFinite__';
const encTransport = (v: unknown): unknown => {
  if (typeof v === 'number' && !Number.isFinite(v)) {
    return { [NONFINITE_TAG]: Number.isNaN(v) ? 'NaN' : v > 0 ? 'Infinity' : '-Infinity' };
  }
  if (Array.isArray(v)) return v.map(encTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(o)) out[k] = encTransport(o[k]);
    return out;
  }
  return v;
};
const decTransport = (v: unknown): unknown => {
  if (Array.isArray(v)) return v.map(decTransport);
  if (v !== null && typeof v === 'object') {
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length === 1 && keys[0] === NONFINITE_TAG) {
      const t = o[NONFINITE_TAG];
      return t === 'NaN' ? Number.NaN : t === 'Infinity' ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    }
    const out: Record<string, unknown> = {};
    for (const k of keys) out[k] = decTransport(o[k]);
    return out;
  }
  return v;
};
interface SeedUnit { seedIdx: number; seed: number; rows: Record<ArmName, PerMatch> }
const encodeUnit = (u: SeedUnit): string => JSON.stringify(encTransport(u));
const ckptConfigEcho = {
  mode: MODE, runN: RUN_N, runBase: RUN_BASE, arms: ARMS, dose: DOSE,
  momentSpacing: MOMENT_SPACING, perMatchCap: PER_MATCH_CAP, horizon: HORIZON,
  duration: MATCH_DURATION, supportWindow: [SUPPORT_MIN_M, SUPPORT_MAX_M],
  pressureR: PRESSURE_R, tableSha: EXPECTED_TABLE_SHA, holdable: HOLDABLE_CELLS,
  radiusTrace, bootstrapSeed: BOOTSTRAP_SEED, resamples: BOOTSTRAP_RESAMPLES,
  repro: [REPRO173_BASE, REPRO173_N, REPRO_O2_BASE, REPRO_O2_N, REPRO_GGC_BASE, REPRO_GGC_N],
};
const ckptHeader = {
  kind: 'header' as const,
  version: 1,
  headFull: gitSay('git rev-parse HEAD'),
  probeSha256: existsSync(PROBE_SELF_PATH) ? sha(readFileSync(PROBE_SELF_PATH, 'utf8')) : 'probe-unreadable',
  srcDiffSha256: sha(gitSay('git diff -- src')),
  mode: MODE,
  configSha256: sha(canonical(ckptConfigEcho)),
};
type CkptHeader = typeof ckptHeader;
const restoredUnits = new Map<string, SeedUnit>();
const ckptKey = (pass: number, seedIdx: number): string => `${pass}:${seedIdx}`;
const refuse = (why: string): never => {
  console.error(`CTB-T1 FATAL — REFUSING TO RESUME: ${why}`);
  console.error(`  checkpoint: ${CKPT_PATH}`);
  console.error('  Resuming across a changed world would silently mix two worlds. Delete the '
    + 'checkpoint to start a genuinely fresh run, or check out the commit it was made on.');
  process.exit(1);
};
const startCheckpoint = (): void => {
  if (!CHECKPOINTING) return;
  const exists = existsSync(CKPT_PATH);
  if (RESUME && exists) {
    const lines = readFileSync(CKPT_PATH, 'utf8').split('\n').filter((l) => l.trim() !== '');
    let hdr: CkptHeader | null = null;
    let bad = 0;
    for (const line of lines) {
      let rec: Record<string, unknown>;
      try { rec = JSON.parse(line) as Record<string, unknown>; } catch { bad += 1; continue; }
      if (rec.kind === 'header') { if (hdr === null) hdr = rec as unknown as CkptHeader; continue; }
      if (rec.kind !== 'unit' || hdr === null) { bad += 1; continue; }
      const payload = rec.payload as string;
      if (typeof payload !== 'string' || sha(payload) !== rec.sha) { bad += 1; continue; }
      let unit: SeedUnit;
      try { unit = decTransport(JSON.parse(payload)) as SeedUnit; } catch { bad += 1; continue; }
      if (encodeUnit(unit) !== payload) { bad += 1; continue; }
      if (unit.seed !== RUN_BASE + unit.seedIdx
        || ARMS.some((a) => unit.rows[a] === undefined || unit.rows[a].seed !== unit.seed)) {
        bad += 1; continue;
      }
      restoredUnits.set(ckptKey(rec.pass as number, unit.seedIdx), unit);
    }
    if (hdr === null) refuse('the checkpoint has no readable header record (corrupt or truncated).');
    const h = hdr as CkptHeader;
    const mismatches = ([
      ['git HEAD', h.headFull, ckptHeader.headFull],
      ['probe file', h.probeSha256, ckptHeader.probeSha256],
      ['src working tree', h.srcDiffSha256, ckptHeader.srcDiffSha256],
      ['mode', h.mode, ckptHeader.mode],
      ['frozen config', h.configSha256, ckptHeader.configSha256],
    ] as const).filter(([, was, now]) => was !== now);
    if (mismatches.length > 0) {
      refuse(`${mismatches.length} guard field(s) changed since the checkpoint was written — `
        + mismatches.map(([w, was, now]) => `${w}: ${String(was)} → ${String(now)}`).join(' · '));
    }
    banner(`RESUME — checkpoint ${CKPT_PATH} accepted · ${restoredUnits.size} (pass, seed) unit(s) `
      + `restored${bad > 0 ? ` · ${bad} unusable record(s) DISCARDED and will be recomputed` : ''}`);
    return;
  }
  if (RESUME && !exists) banner(`RESUME requested but no checkpoint at ${CKPT_PATH} — starting FRESH.`);
  writeFileSync(CKPT_PATH, `${JSON.stringify(ckptHeader)}\n`);
  banner(`checkpoint ARMED at ${CKPT_PATH} (one line per finished (pass, seed) unit)`);
};
const appendCheckpoint = (pass: number, u: SeedUnit): void => {
  if (!CHECKPOINTING) return;
  const payload = encodeUnit(u);
  try {
    appendFileSync(CKPT_PATH, `${JSON.stringify({
      kind: 'unit', pass, seedIdx: u.seedIdx, seed: u.seed, sha: sha(payload), payload,
    })}\n`);
  } catch (e) {
    banner(`⚠ checkpoint append FAILED (${String(e)}) — the run continues, unprotected.`);
  }
};
startCheckpoint();

/* ========================================================================== */
/* §12 THE CORE (X-DET: run TWICE)                                            */
/* ========================================================================== */
interface Core {
  byArm: Record<ArmName, PerMatch[]>;
  reproO2: PerMatch[];
  repro173: PerMatch[];
  reproGgc: PerMatch[];
  restored: string[];
  computed: string[];
}
const computeCore = (pass: number): Core => {
  const byArm = Object.fromEntries(ARMS.map((a) => [a, [] as PerMatch[]])) as Record<ArmName, PerMatch[]>;
  const restored: string[] = []; const computed: string[] = [];
  const t0 = Date.now();
  for (let i = 0; i < RUN_N; i++) {
    const seed = RUN_BASE + i;
    const already = restoredUnits.get(ckptKey(pass, i));
    let unit: SeedUnit;
    if (already !== undefined) {
      unit = already;
      restored.push(ckptKey(pass, i));
      banner(`  pass ${pass} · seed ${i + 1}/${RUN_N} (${seed}) · SKIPPED — restored from checkpoint`);
    } else {
      const rows = {} as Record<ArmName, PerMatch>;
      for (const a of ARMS) rows[a] = walkSeed(seed, a);
      unit = { seedIdx: i, seed, rows };
      computed.push(ckptKey(pass, i));
      appendCheckpoint(pass, unit);
      banner(`  pass ${pass} · seed ${i + 1}/${RUN_N} (${seed}) · ${ARMS.length} arms done · `
        + `${((Date.now() - t0) / 1000).toFixed(1)} s`);
    }
    for (const a of ARMS) byArm[a].push(unit.rows[a]);
  }
  banner(`  pass ${pass} · G-REPRO-O2T1: block ${REPRO_O2_BASE} (${REPRO_O2_N} matches, O2-T1 CONTROL world)...`);
  const reproO2: PerMatch[] = [];
  for (let i = 0; i < REPRO_O2_N; i++) reproO2.push(walkSeed(REPRO_O2_BASE + i, 'reproO2Control'));
  banner(`  pass ${pass} · G-REPRO-173: block ${REPRO173_BASE} (${REPRO173_N} matches, prod world)...`);
  const repro173: PerMatch[] = [];
  for (let i = 0; i < REPRO173_N; i++) repro173.push(walkSeed(REPRO173_BASE + i, 'repro173Prod'));
  banner(`  pass ${pass} · G-REPRO-GGC: block ${REPRO_GGC_BASE} (${REPRO_GGC_N} matches, census PROD world)...`);
  const reproGgc: PerMatch[] = [];
  for (let i = 0; i < REPRO_GGC_N; i++) reproGgc.push(walkSeed(REPRO_GGC_BASE + i, 'reproGgcProd'));
  return { byArm, reproO2, repro173, reproGgc, restored, computed };
};

const coreBody = (core: Core) => {
  /* --- G-REPRO-O2T1: the committed rows, read from the artifact (never typed) --- */
  const committedO2 = O2T1 === null ? [] : (O2T1.j.perMatch.control as any[]);
  const rowsO2 = core.reproO2.map((r) => ({ seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable }));
  const mismatchesO2 = rowsO2.filter((row, i) => {
    const want = committedO2[i];
    return want === undefined || JSON.stringify(row) !== JSON.stringify({
      seed: want.seed, eligible: want.eligible, trueHoldable: want.trueHoldable,
    });
  });
  /* --- G-REPRO-173: the committed pooled block, read from the artifact ---------- */
  const want173 = TEMPO_SMOKE === null ? null
    : TEMPO_SMOKE.j.result.arms.prod.pressContext.firstReceptionsOfSpell;
  const got173 = {
    pressed: core.repro173.reduce((a, r) => a + r.firstRecOpenPressed, 0),
    all: core.repro173.reduce((a, r) => a + r.firstRecOpen, 0),
  };
  const share173 = got173.all === 0 ? Number.NaN : got173.pressed / got173.all;
  const identical173 = want173 !== null
    && got173.pressed === (want173.pressed.n as number)
    && got173.all === (want173.all.n as number)
    && (got173.all - got173.pressed) === (want173.unpressed.n as number)
    && Number(share173.toFixed(4)) === Number((want173.pressedShare as number).toFixed(4));

  /* --- G-REPRO-GGC: the #218 LIFT proved against the census's OWN committed rows ---------- */
  const ggcGot = ggSummary(core.reproGgc);
  const ggcWant = GGC_SMOKE === null ? null : GGC_SMOKE.j.result.perArm.PROD;
  /** ⭐ WHICH ROWS, AND WHY: the census publishes NO per-seed rows in either committed artifact,
   *  so the strongest CHEAP form available is its SMOKE arm ENTIRE — `PROD` over the whole
   *  12-seed block 12,421,000..12,421,011, which is every match that arm contains. The compared
   *  fields are the INTEGER COUNTS (never the rounded shares, which are functions of them) on
   *  every limb this lift uses: the origin classification of GOALS and of SEGMENTS, the
   *  loss-third cut, the construction ladder on both pools, the own-third turnover counts on
   *  BOTH readings (loss tick AND regain tick — the #215.3-H1 wedge), and the segmentation
   *  ACCOUNTING identity. Targets are READ from the artifact, never typed. */
  const ggcChecks: { field: string; want: number; got: number }[] = ggcWant === null ? [] : [
    { field: 'goals', want: ggcWant.goalGenealogy.goals as number, got: ggcGot.goals },
    ...GG_ORIGIN_CLASSES.map((o) => ({
      field: `goals.byOrigin.${o}`,
      want: ggcWant.goalGenealogy.byOrigin[o] as number,
      got: ggcGot.byOrigin[o],
    })),
    ...GG_ORIGIN_CLASSES.map((o) => ({
      field: `goals.byOriginAtRegainSpot.${o}`,
      want: ggcWant.goalGenealogy.byOriginAtRegainSpot[o] as number,
      got: ggcGot.byOriginAtRegainSpot[o],
    })),
    ...(['setPiece', 'restart', 'openPlay'] as const).map((f) => ({
      field: `goals.byFamily.${f}`,
      want: ggcWant.goalGenealogy.byFamily[f] as number,
      got: ggcGot.byFamily[f],
    })),
    ...(['own', 'middle', 'final', 'notARegain'] as const).map((t) => ({
      field: `goals.byLossThird.${t}`,
      want: ggcWant.goalGenealogy.byLossThird[t] as number,
      got: ggcGot.byLossThird[t],
    })),
    ...(['nonSetPiece', 'openPlayOriginOnly'] as const).flatMap((pool) => [
      {
        field: `constructedLadder.${pool}.pool`,
        want: ggcWant.goalGenealogy.constructedLadder[pool].pool as number,
        got: (ggcGot.constructedLadder as any)[pool].pool as number,
      },
      ...CONSTRUCTED_LADDER.map((k) => ({
        field: `constructedLadder.${pool}.ge${k}.constructed`,
        want: ggcWant.goalGenealogy.constructedLadder[pool].ladder[`ge${k}`].constructed as number,
        got: (ggcGot.constructedLadder as any)[pool].ladder[`ge${k}`].constructed as number,
      })),
    ]),
    ...GG_ORIGIN_CLASSES.map((o) => ({
      field: `segments.byOrigin.${o}`,
      want: ggcWant.segmentPopulation.byOrigin[o] as number,
      got: ggcGot.segmentPopulation.byOrigin[o],
    })),
    {
      field: 'turnovers.ownThird(lossTick)',
      want: ggcWant.backThirdErrors.ownThirdTurnovers as number,
      got: ggcGot.turnovers.ownThird,
    },
    {
      field: 'turnovers.ownThird(regainTick, the declared cross-cut)',
      want: ggcWant.backThirdErrors.atRegainSpot.ownThirdTurnovers as number,
      got: ggcGot.turnovers.ownThirdAtRegainSpot,
    },
    ...(['totalTicks', 'deadBallTicks', 'segmentTicks', 'looseGapTicks', 'assignedTicksSum',
      'goalsFromScore', 'goalsMappedToSegments', 'unattributedGoals', 'spanOrderViolations'] as const)
      .map((k) => ({
        field: `accounting.${k}`,
        want: ggcWant.accounting[k] as number,
        got: (ggcGot.accounting as Record<string, number>)[k],
      })),
  ];
  const ggcMismatches = ggcChecks.filter((c) => c.want !== c.got);

  return {
    arms: Object.fromEntries(ARMS.map((a) => [a, armSummary(core.byArm[a])])),
    contrasts: bootstrapAll(core.byArm),
    gReproGgc: {
      block: `${REPRO_GGC_BASE}..${REPRO_GGC_BASE + REPRO_GGC_N - 1}`,
      source: GGC_SMOKE_PATH,
      sourceArm: 'PROD',
      world: 'the goal-genealogy census\'s OWN `PROD` arm — the shipped game, no flags (this '
        + 'exam\'s world, and the #173 census\'s `prod` world too)',
      rowsScope: 'the census publishes NO per-seed rows, so the whole 12-match PROD arm of its '
        + 'committed SMOKE artifact is the strongest cheap target: every match that arm contains, '
        + 'compared on INTEGER COUNTS across goal origins, segment origins, the loss-third cut, '
        + 'the construction ladder on both pools, own-third turnovers on BOTH readings, and the '
        + 'segmentation accounting identity.',
      fieldsChecked: ggcChecks.length,
      mismatches: ggcMismatches.length,
      mismatchRows: ggcMismatches,
      observed: ggcGot,
      identical: ggcWant !== null && ggcChecks.length > 0 && ggcMismatches.length === 0,
      note: 'THE #218 LIFT PROVED, NOT ASSERTED (#203 / the G-REPRO-173 precedent): this probe\'s '
        + 'OWN ported classifier re-walks the census\'s own block in the census\'s own world and '
        + 'must reproduce the committed counts EXACTLY, including the LOSS-TICK semantics '
        + '(#215.3-H1/M2) that separate them from the regain-tick reading. The census\'s seeds '
        + 'ride as a RECEIPT re-walk only — never fresh data for this exam.',
    },
    gReproO2T1: {
      block: `${REPRO_O2_BASE}..${REPRO_O2_BASE + REPRO_O2_N - 1}`,
      world: 'the O2-T1 CONTROL world (CENSUS_FLAGS + o1PassWindup), VERBATIM',
      rowsChecked: rowsO2.length, committedRowsAvailable: committedO2.length,
      mismatches: mismatchesO2.length, observedRows: rowsO2,
      identical: rowsO2.length > 0 && mismatchesO2.length === 0 && committedO2.length >= rowsO2.length,
      note: 'INSTRUMENT INHERITANCE PROVED, NOT ASSERTED: this probe\'s OWN walker re-walks the '
        + 'first rows of the O2-T1 battery block in the O2-T1 CONTROL world and must reproduce '
        + 'the committed perMatch.control {seed, eligible, trueHoldable} EXACTLY. Scope stated: '
        + 'the inherited limb is the #186 POPULATION + `trueCellOf`; the perceived-hold '
        + 'classifier is NOT part of this exam\'s ruler and is not walked.',
    },
    gRepro173: {
      block: `${REPRO173_BASE}..${REPRO173_BASE + REPRO173_N - 1}`,
      world: 'the #173 census `prod` arm — the SHIPPED game, no flags (this exam\'s world)',
      target: want173 === null ? null : {
        pressedShare: want173.pressedShare, pressed: want173.pressed.n,
        unpressed: want173.unpressed.n, all: want173.all.n,
      },
      observed: { pressedShare: round(share173, 5), pressed: got173.pressed, unpressed: got173.all - got173.pressed, all: got173.all },
      identical: identical173,
      note: 'the #173 pressed-first-reception instrument, re-derived by THIS probe\'s walker on '
        + 'the census\'s OWN sizing-smoke block, compared to the COMMITTED numbers field for '
        + 'field. The outcome-resolution / foul-attribution limbs of the census walker are not '
        + 'lifted (this ruler does not read them); this gate is what proves the omission changes '
        + 'nothing on the column that IS read.',
    },
    perMatch: Object.fromEntries(ARMS.map((a) => [a, core.byArm[a].map((r) => ({
      seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable,
      firstRecOpen: r.firstRecOpen, firstRecOpenPressed: r.firstRecOpenPressed,
      possTicks: r.possTicks, possTicksShort: r.possTicksShort,
      possTicksPressed: r.possTicksPressed, possTicksPressedShort: r.possTicksPressedShort,
      firstRecShort: r.firstRecShort, firstRecPressedShort: r.firstRecPressedShort,
      supportTicks: r.supportTicks, supportTicksShifted: r.supportTicksShifted,
      clampXBound: r.clampXBound, clampYBound: r.clampYBound,
      interceptions: r.interceptions, offsides: r.offsides, goals: r.goals,
      spreadYOut: round(r.spreadYOut, 4), spacingMedian: round(r.spacingMedian, 4),
      ticksWalked: r.ticksWalked, signature: r.signature,
    }))])),
  };
};

const coreA = computeCore(1);
const bodyA = coreBody(coreA);
const digestA = sha(canonical(bodyA));
banner(`  [ctb-t1] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = computeCore(2);
const bodyB = coreBody(coreB);
const digestB = sha(canonical(bodyB));
const xDet = digestA === digestB;
banner(`  [ctb-t1] pass 2 digest ${digestB} — X-DET ${xDet ? 'PASS' : 'FAIL'}`);

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (CTBT1_SKIP_FP)' : leagueHash(FINGERPRINT_SEED);
const xFpProd = !SKIP_FP && fpObserved === FINGERPRINT_BASELINE;

/* ========================================================================== */
/* §13 THE GUARD VERDICT ROWS (tolerances FROZEN ex ante, computed in-probe)   */
/* ========================================================================== */
const C = bodyA.contrasts.rates as Record<string, Record<ArmName, any>>;
type GuardDir = 'ceiling' | 'floor';
const GUARD_LIMBS: readonly { key: RateKey; direction: GuardDir; family: string }[] = [
  { key: 'interceptionsPerMatch', direction: 'ceiling', family: 'F-CTB-b interception' },
  { key: 'spreadYOut', direction: 'floor', family: 'F-CTB-b clump' },
  { key: 'spacingMedian', direction: 'floor', family: 'F-CTB-b clump' },
  { key: 'spacingUnder4', direction: 'ceiling', family: 'F-CTB-b clump' },
];
const guardRows = GUARD_LIMBS.map((l) => {
  const control = C[l.key][CONTROL_ARM].point as number;
  const tol = NI_FRACTION * Math.abs(control);
  return {
    key: l.key, family: l.family, direction: l.direction,
    controlLevel: round(control, 6), toleranceAbs: round(tol, 6),
    toleranceForm: 'NI_FRACTION · |controlLevel|, NI_FRACTION = 1 − 0.275/0.380 (PM-T1 §5, '
      + 'inherited from A4-S2P1-VECTOR-CENSUS §4) — frozen ex ante in the stage doc',
    arms: Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => {
      const d = C[l.key][a].pairedDelta;
      const resolved = C[l.key][a].resolved as boolean;
      const harmful = l.direction === 'ceiling' ? (d.point as number) > tol : (d.point as number) < -tol;
      return [a, {
        delta: d.point, ci: [d.lower, d.upper], resolved,
        beyondTolerance: harmful,
        breach: resolved && harmful,
      }];
    })),
  };
});
const offsideRows = Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => {
  const d = C.offsidesPerMatch[a].pairedDelta;
  return [a, {
    delta: d.point, ci: [d.lower, d.upper], resolved: C.offsidesPerMatch[a].resolved,
    resolvedIncrease: (C.offsidesPerMatch[a].resolved as boolean) && (d.point as number) > 0,
  }];
}));
const bandControl = (bodyA.arms as any)[CONTROL_ARM].guards.band as Record<string, any>;
const bandExcluded = BAND_KEYS.filter((k) => !bandControl[k].inBand);
const bandGated = BAND_KEYS.filter((k) => bandControl[k].inBand);
const bandRows = Object.fromEntries(ARMS.map((a) => {
  const b = (bodyA.arms as any)[a].guards.band as Record<string, any>;
  return [a, {
    perDimension: Object.fromEntries(BAND_KEYS.map((k) => [k, { perMatch: b[k].perMatch, inBand: b[k].inBand }])),
    allGatedDimensionsInBand: bandGated.every((k) => b[k].inBand),
  }];
}));

/* ========================================================================== */
/* §13b THE CEILINGS — rulers 3b/4b are NEAR-SATURATED, and by how much        */
/* ========================================================================== */
/** ⭐ PUBLISHED BECAUSE THE FORK PARAGRAPH ONCE SIZED A RULER WITHOUT COMPUTING IT: the
 *  headroom above the ABSENT arm is what a helpful move on a near-saturated share can possibly
 *  buy, and it is measured HERE, from the run's own numbers, never typed into a doc. */
const ceilingOf = (key: RateKey) => {
  const absent = C[key][CONTROL_ARM].point as number;
  const headroomPp = (1 - absent) * 100;
  return {
    absentLevel: round(absent, 6),
    absentLevelPct: round(absent * 100, 3),
    helpfulHeadroomPp: round(headroomPp, 3),
    perArm: Object.fromEntries(ARMS.filter((a) => a !== CONTROL_ARM).map((a) => {
      const d = C[key][a].pairedDelta.point as number;
      return [a, {
        deltaPp: round(d * 100, 3),
        shareOfHeadroomConsumed: round(headroomPp === 0 ? Number.NaN : (d * 100) / headroomPp, 4),
        resolved: C[key][a].resolved as boolean,
      }];
    })),
  };
};
const saturationCeilings = {
  note: '⭐ THE CEILINGS, DISCLOSED (the ruled amendment): rulers 3b and 4b are bounded above by '
    + '100 %, and the ABSENT arm already sits just under it. The headroom below is the ENTIRE '
    + 'budget any helpful move on those two columns can spend — which is why the exam is carried '
    + 'by rulers 1 + 2 (the unsaturated pair) and 3/4 are REPORTED.',
  ruler4bSupportAtPressedFirstRec: ceilingOf('supportAtPressedFirstRecShare'),
  ruler3bShortOptionFirstRec: ceilingOf('shortOptionFirstRecShare'),
  decodeNote: '⚠ LABELLED DECODE NOTE, NOT A CONCLUSION (the commander\'s reading, recorded so it '
    + 'can be tested rather than assumed): in the BARE world the radius-family proximity '
    + 'predicate is NEAR-SATURATED — a body is almost always within the support radius — so the '
    + 'scarcity H-CTB is about does not live in RAW PROXIMITY at all; it lives in whether that '
    + 'body is a SAFE support (holdable, unpressed). That is a hypothesis about what these '
    + 'columns mean, not a measured finding of this round, and it is exactly why rulers 1 + 2 '
    + 'carry the exam.',
};

/* ========================================================================== */
/* §14 GATES — all computed IN-PROBE (#181.2)                                 */
/* ========================================================================== */
const srcDiff = gitSay('git diff --stat -- src');
const head = gitSay('git rev-parse --short HEAD');

const walkedBlocks = [
  { name: 'exam', first: RUN_BASE, last: RUN_BASE + RUN_N - 1 },
  { name: 'reproO2 (re-walk)', first: REPRO_O2_BASE, last: REPRO_O2_BASE + REPRO_O2_N - 1 },
  { name: 'repro173 (re-walk)', first: REPRO173_BASE, last: REPRO173_BASE + REPRO173_N - 1 },
  { name: 'reproGgc (re-walk)', first: REPRO_GGC_BASE, last: REPRO_GGC_BASE + REPRO_GGC_N - 1 },
];
const examCollisions = CONSUMED
  .filter((c) => !((RUN_BASE + RUN_N - 1) < c.range[0] || RUN_BASE > c.range[1]))
  .map((c) => c.name);
/** ⭐ THE BATTERY BLOCK IS NOW N-DERIVED (the ruled amendment), so its clash-freedom is CHECKED
 *  rather than pinned to a typed end-seed: it must clear the guard block below and the next
 *  consumed interval above. */
const batteryN = nRule.nStar ?? 0;
const batteryLast = BATTERY_BASE + batteryN - 1;
const batteryCollisions = CONSUMED
  .filter((c) => !(batteryLast < c.range[0] || BATTERY_BASE > c.range[1]))
  .map((c) => c.name);
const subBlocksOrdered = SMOKE_BASE + SMOKE_N - 1 < GUARD_BLOCK[0]
  && GUARD_BLOCK[1] < BATTERY_BASE
  && batteryN > 0 && batteryLast < NEXT_CONSUMED_AFTER_BATTERY
  && batteryCollisions.length === 0;
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

/* --- FLAG-HYGIENE + the in-battery identity arm ---------------------------- */
const armConfigEcho = Object.fromEntries(ARMS.map((a) => [a, {
  ctbSupportPlane: DOSE[a] === null ? undefined : true,
  ctbSupportDepth: DOSE[a]?.depth, ctbSupportWidth: DOSE[a]?.width,
}]));
/** ⚠ CORRECTED AFTER A GUARD-BLOCK RUN (recorded, not rewritten — the CTB-T0 §DEV form):
 *  `genesOnAllViews` is the ARM'S OWN DEFINITION (ARMED-ZERO has both genes present AT
 *  ZERO; ABSENT has none) and is excluded from the identity comparison. It is not a world
 *  quantity: it is the very fact that makes this the G-ZERO arm — the arms differ in CODE
 *  PATH and in GENE STATE, and the identity is over everything the world produced. Every
 *  other measured field, and the whole-match signature INCLUDING the rng stream, is
 *  compared. */
const IDENTITY_EXCLUDED_FIELDS = ['genesOnAllViews'] as const;
const identityRows = coreA.byArm[CONTROL_ARM].map((r, i) => {
  const z = coreA.byArm.armedZero[i];
  const strip = (x: PerMatch): string => {
    const o2: Record<string, unknown> = { ...x };
    for (const k of IDENTITY_EXCLUDED_FIELDS) delete o2[k];
    return JSON.stringify(o2);
  };
  const diffs = (Object.keys(r) as (keyof PerMatch)[])
    .filter((k) => !(IDENTITY_EXCLUDED_FIELDS as readonly string[]).includes(k as string))
    .filter((k) => JSON.stringify(r[k]) !== JSON.stringify(z[k]));
  return {
    seed: r.seed,
    signatureIdentical: r.signature === z.signature,
    rowIdentical: strip(r) === strip(z),
    differingFields: diffs,
  };
});
const flagHygiene = {
  pass: identityRows.every((x) => x.signatureIdentical && x.rowIdentical)
    && DOSE[CONTROL_ARM] === null
    && ARMS.filter((a) => a !== CONTROL_ARM).every((a) => DOSE[a] !== null)
    && DOSE.armedZero!.depth === 0 && DOSE.armedZero!.width === 0
    && DOSE.depthBack!.depth === CTB_GENE_MIN && DOSE.depthBack!.width === 0
    && DOSE.depthHalf!.depth === CTB_GENE_MIN / 2 && DOSE.depthHalf!.width === 0
    && DOSE.depthFwd!.depth === CTB_GENE_MAX && DOSE.depthFwd!.width === 0
    && DOSE.narrow!.depth === 0 && DOSE.narrow!.width === CTB_GENE_MIN
    && DOSE.wide!.depth === 0 && DOSE.wide!.width === CTB_GENE_MAX
    && DOSE.cornerCheck!.depth === CTB_GENE_MIN && DOSE.cornerCheck!.width === CTB_GENE_MIN,
  armConfigEcho,
  identityRows,
  identityExcludedFields: IDENTITY_EXCLUDED_FIELDS,
  identityExcludedWhy: '`genesOnAllViews` IS the arm definition (ARMED-ZERO carries both genes '
    + 'present at zero; ABSENT carries none) — a config echo, not a world quantity. Excluded '
    + 'from the comparison and stated here rather than quietly dropped.',
  note: 'the arms differ by EXACTLY the ctb dose (the MatchConfig flag + the two genes on all '
    + 'three genome views of both teams); everything else — world, seeds, teams, duration — is '
    + 'identical by construction. ARMED-ZERO ≡ ABSENT is proved per seed on the whole-match '
    + 'signature INCLUDING the rng stream state, AND on every measured row field.',
};

/* --- G-ARM: the plane is REACHED in every dosed arm ------------------------ */
const gArmRows = Object.fromEntries(ARMS.map((a) => {
  const rows = coreA.byArm[a];
  const dosedNonZero = DOSE[a] !== null && (DOSE[a]!.depth !== 0 || DOSE[a]!.width !== 0);
  const supportTicks = rows.reduce((s, r) => s + r.supportTicks, 0);
  const shifted = rows.reduce((s, r) => s + r.supportTicksShifted, 0);
  const unshiftedClampBound = rows.reduce((s, r) => s + r.supportTicksUnshiftedClampBound, 0);
  return [a, {
    dosedNonZero,
    seedsWithSupportTicks: rows.filter((r) => r.supportTicks > 0).length,
    supportTicks,
    supportTicksShifted: shifted,
    supportTicksUnshiftedClampBound: dosedNonZero ? unshiftedClampBound : null,
    everyTickShifted: supportTicks > 0 && shifted === supportTicks,
    everyTickShiftedOrClampBound: dosedNonZero
      ? (supportTicks > 0 && shifted + unshiftedClampBound === supportTicks)
      : null,
    clampBoundSemantics: 'a DOSED tick that did not move is accounted for EXACTLY: the '
      + 'INCUMBENT pitch clamp pinned the incumbent and the dosed pre-clamp values to the SAME '
      + 'bound (#224.4(ii) clamp saturation). The gate asserts shifted + clampBound === total; '
      + 'nothing is excused by a tolerance. ⚠ CORRECTED PRE-BATTERY: in ABSENT / ARMED-ZERO the '
      + 'counter is published as NULL — there is no dose, the two pre-clamp expressions are the '
      + 'SAME expression, and the shift is zero BY DEFINITION, so a "clamp-bound" count there '
      + 'was degenerate (it fired on trivial equality and contradicted this very semantics). The '
      + 'gate predicate is unchanged: the undosed arms are gated on `zeroShift`.',
    zeroShift: shifted === 0,
    genesOnAllViewsSeeds: rows.reduce((s, r) => s + r.genesOnAllViews, 0),
    meanShiftMetres: round(rows.reduce((s, r) => s + r.supportShiftSum, 0) / Math.max(1, supportTicks), 4),
  }];
}));
const gArmPass = ARMS.every((a) => {
  const g = (gArmRows as any)[a];
  if (g.dosedNonZero) {
    return g.seedsWithSupportTicks === RUN_N && g.everyTickShiftedOrClampBound
      && g.supportTicksShifted > 0 && g.genesOnAllViewsSeeds === RUN_N;
  }
  // ABSENT and ARMED-ZERO: the shift must be EXACTLY zero
  return g.zeroShift && g.seedsWithSupportTicks === RUN_N;
});

const gates = {
  xDet: {
    pass: xDet, digestA, digestB,
    note: 'the WHOLE computation (all 8 arms + both repro walks + summaries + bootstrap) run '
      + 'twice; the two HASHED BODIES are byte-identical and resultSha256 is run 1\'s digest',
  },
  xFpProd: {
    pass: xFpProd, baseline: FINGERPRINT_BASELINE, observed: fpObserved,
    seed: FINGERPRINT_SEED, seasons: FINGERPRINT_SEASONS,
  },
  xSrcUntouched: {
    pass: srcDiff === '', diffStat: srcDiff,
    note: 'INSTRUMENT-ONLY ROUND: the seam is banked (1dc4aa9 + d0814d7); this round changes no '
      + 'engine byte.',
  },
  gReproO2T1: {
    pass: bodyA.gReproO2T1.identical,
    rowsChecked: bodyA.gReproO2T1.rowsChecked, mismatches: bodyA.gReproO2T1.mismatches,
  },
  gRepro173: {
    pass: bodyA.gRepro173.identical,
    target: bodyA.gRepro173.target, observed: bodyA.gRepro173.observed,
  },
  gReproGgc: {
    pass: bodyA.gReproGgc.identical,
    block: bodyA.gReproGgc.block, source: GGC_SMOKE_PATH,
    fieldsChecked: bodyA.gReproGgc.fieldsChecked, mismatches: bodyA.gReproGgc.mismatches,
    sourceSha256: GGC_SMOKE === null ? null : sha(GGC_SMOKE.bytes.toString('utf8')),
  },
  gTraceRadius: {
    pass: radiusTrace.lineFound && radiusTrace.base === 10 && radiusTrace.slope === 8,
    ...radiusTrace,
    note: 'the short-option instrument\'s radius family is PARSED out of src/ai/formations.ts '
      + '(the #202 form: derived from source, never typed), so it cannot drift from the seat it '
      + 'is taken from.',
  },
  seedDisjoint: {
    pass: examCollisions.length === 0 && subBlocksOrdered,
    walkedBlocks, examCollisions, subBlocksOrdered, batteryCollisions,
    subBlocks: {
      smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
      exitSemanticsGuard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      battery: `${BATTERY_BASE}..${batteryLast}`,
      batteryN,
      batteryRoom: BATTERY_ROOM,
      nextConsumedAfterBattery: NEXT_CONSUMED_AFTER_BATTERY,
    },
    reproBlocksNote: 'the two repro blocks are DELIBERATE re-walks of the SOURCES\' own committed '
      + 'blocks (receipts, never fresh data), so their overlap with the ledger is the point; only '
      + 'the EXAM block must be clash-free.',
    consumedLedger: CONSUMED,
  },
  statsDisjoint: {
    pass: statsMinGap >= 200, base: BOOTSTRAP_SEED, minGap: statsMinGap,
    published: PUBLISHED_STATS_BASES,
    publishedScope: 'the O2-T1 probe\'s COMPLETE ≥91,100-regime ledger + 104,600 (O2-T1\'s own '
      + 'base). Pre-regime bases (90,730, the 50xxx family) are ≥ 13,000 away and cannot move '
      + 'the minimum.',
  },
  flagHygiene,
  gArm: { pass: gArmPass, arms: gArmRows },
  gCleanInvocation: {
    pass: !OVERRIDDEN, envN: N_ENV, skipFp: SKIP_FP, routedToGuardBlock: OVERRIDDEN,
    note: 'any CTBT1_N / CTBT1_SKIP_FP override is BY DEFINITION not the exam: the run is routed '
      + 'onto the exit-semantics guard block, this gate goes RED and the process exits 1.',
  },
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §15 THE ARTIFACT — hashed body vs UNHASHED envelope (#197-M1 / #198)        */
/* ========================================================================== */
const body = {
  stage: 'CTB T1 — THE SUPPORT-SUPPLY EXAM (hand-dose the banked 2D support plane)',
  ruling: '#224.5 (the dispatch) · CHECK-TO-BALL-CONTRACT §3 CTB-T1 · #224.4 (the inheritances) '
    + '· #181.2 (the standing receipt rule)',
  doc: 'docs/world-model/CTB-T1-SUPPLY-EXAM.md',
  mode: MODE,
  block: `${RUN_BASE}..${RUN_BASE + RUN_N - 1}`,
  seeds: RUN_N,
  world: 'the BARE PRODUCTION-SHAPED world (`new Match({seed, teamA, teamB, duration})`) — the '
    + 'MINIMAL world that carries every inherited instrument (doc §FORM): TRUE-holdable supply '
    + 'is a truth-side read needing no percept flag, the #173 instrument was censused in exactly '
    + 'this world (`prod` = "the SHIPPED game — no match flags"), and the guards are team.stats / '
    + 'geometry. Each G-REPRO walk runs in ITS SOURCE\'s own world.',
  armDefinitions: Object.fromEntries(ARMS.map((a) => [a, DOSE[a] === null
    ? 'ABSENT — no ctbSupportPlane flag, no genes (the production world)'
    : `ctbSupportPlane:true · depth ${DOSE[a]!.depth} · width ${DOSE[a]!.width} `
      + '(genes on all three genome views of BOTH teams — the real gene channel, #196.3-D6)'])),
  doseProvenance: 'every dose is a SPAN END or its half, read off the exported gene domain '
    + `[${CTB_GENE_MIN}, ${CTB_GENE_MAX}]. NO span is re-cut and no dose is invented (#224.4(iv)).`,
  preRegisteredSuccess: 'contract §1 / dispatch, VERBATIM: at least one dose moves the ruler '
    + 'RESOLVEDLY in the helpful direction (holdable supply UP or support-existence-at-pressed UP '
    + 'or pressed-first-reception DOWN) with the guards held. FAIL branches pre-named: F-CTB-a '
    + '(no dose moves any ruler quantity resolvedly) · F-CTB-b (interception/clump beyond the '
    + 'frozen tolerance, resolved) · F-CTB-c (offside spike or world-health collapse, resolved). '
    + '⚠ THIS PROBE FIRES NONE OF THEM: it emits PER-ARM ROWS and paired deltas with mechanical '
    + '`resolved` CI flags only (#203); adjudication is the commander\'s.',
  preRegisteredStopGranularity: '⭐ FROZEN EX ANTE, BEFORE ANY BATTERY NUMBER EXISTS (the ruled '
    + 'amendment; stage doc §SUCCESS): F-CTB-b and F-CTB-c fire PER DOSE — a dose whose guard '
    + 'BREACHES (resolved AND beyond the frozen tolerance) is DISQUALIFIED as a candidate, and '
    + 'the ARC-level STOP fires only if EVERY dose that moves the primary ruler helpfully is '
    + 'disqualified. The clamp reading is frozen with it: SPAN-END rows are read as DELIVERED '
    + 'GEOMETRY (mean shift + clamp shares published beside every row), and the depth axis\'s '
    + 'dose-response primary read INCLUDES the interior −0.5 row. The band rule is frozen with '
    + 'it too: the equilibrium band GATES at battery N only; at any N the #198-form exclusion '
    + 'applies (dimensions the ABSENT arm itself fails are excluded AND disclosed). ⚠ THIS PROBE '
    + 'STILL FIRES NOTHING (#203) — this is the pre-registered GRANULARITY of the commander\'s '
    + 'own adjudication, recorded here so it cannot be re-cut after sight.',
  rulerProvenance: {
    r1: 'the O2-T1 `trueCellOf` instrument VERBATIM on the #186 eligible-moment population; '
      + 'control read 0.639% at N=320. Gate: G-REPRO-O2T1.',
    r2: 'the #173 tempo-census pressed-first-reception instrument (openPlay-origin spells, '
      + 'TOUCH_CONTROL_DIST 4.2 m); baseline 80.8%. Gate: G-REPRO-173.',
    r3: 'SHORT-OPTION SUPPLY — #224.4(i)\'s named CI-unprotected debt, instrumented DIRECTLY '
      + 'for the first time; radius family PARSED from source. Gate: G-TRACE-RADIUS.',
    r4: 'support-existence at PRESSED moments = r3\'s predicate under r2\'s pressure test — '
      + 'H-CTB\'s core quantity, published at BOTH grains.',
    r5: 'the #218 shares: LIFTED — the goal-genealogy ORIGIN CLASSIFIER ported with its LOSS-TICK '
      + 'semantics verbatim (#215.3-H1/M2) and published per arm (constructed ladder ≥3/4/5, '
      + 'scramble share, set-piece share, turnover-by-third origins). Gate: G-REPRO-GGC. '
      + 'REPORTED ONLY — no gate hangs on any of these shares in T1.',
  },
  primaryRulers: '⭐ RULED PRE-BATTERY: the PRIMARY RULER is ruler 1 (TRUE-holdable supply) + '
    + 'ruler 2 (pressed-first-reception) — the two UNSATURATED quantities. Rulers 3 and 4 are '
    + 'DEMOTED to REPORTED with their ceilings DISCLOSED (`saturationCeilings`), and ruler 5 is '
    + 'REPORTED by construction. This changes no measurement: it names which columns the exam is '
    + 'read on, before the battery exists.',
  tableSha: EXPECTED_TABLE_SHA,
  frozenParameters: {
    perMatchCap: PER_MATCH_CAP, momentSpacing: MOMENT_SPACING, horizon: HORIZON,
    supportWindowM: [SUPPORT_MIN_M, SUPPORT_MAX_M], pressureRadiusM: PRESSURE_R,
    duration: MATCH_DURATION, sampleEvery: SAMPLE_EVERY, pairSubsample: PAIR_SUBSAMPLE,
    closePairM: CLOSE_PAIR_M, niFraction: round(NI_FRACTION, 6),
    samplingBudgetNote: 'the #186 sampling BUDGET (cap 80, spacing 30) is untouched; the WALK '
      + 'continues to full time after the cap so the whole-match instruments exist. The sampled '
      + 'moment SET is bit-identical to the O2-T1 walker\'s — which is what G-REPRO-O2T1 proves.',
  },
  nRule,
  saturationCeilings,
  ...bodyA,
  guardVerdicts: {
    tolerances: guardRows,
    offside: {
      rows: offsideRows,
      note: 'the #157 FLAG form (PM-T1): a RESOLVED increase raises a FLAG that returns to the '
        + 'commander; it flips no gate here.',
    },
    band: {
      baseline: BAND_BASELINE, tolerance: BAND_TOLERANCE,
      excludedBecauseControlFails: bandExcluded, gatedDimensions: bandGated,
      rows: bandRows,
      note: 'the A4-S2P3 §4.2 equilibrium band inherited VERBATIM with its declared '
        + 'substrate-drift exclusion: a dimension the ABSENT arm itself fails is DISCLOSED and '
        + 'EXCLUDED rather than silently failed by every arm.',
    },
    note: 'GUARD ROWS ONLY (#203). `breach` = resolved AND beyond the ex-ante tolerance; it is '
      + 'EVIDENCE for F-CTB-b/c, never the firing of it.',
  },
  gates,
  allGatesPass,
};
const resultSha256 = sha(canonical(body));

const wallMs = Date.now() - wall0;
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  /* ⭐ #197-M1/#198: EVERYTHING below rides OUTSIDE resultSha256 — git head, wall clock,
   * paths and checkpoint state. resultSha256 recomputes identically at any later commit. */
  envelopeContextOnly: {
    headContextOnly: head,
    wallMsContextOnly: wallMs,
    wallNote: 'CONTEXT ONLY (#128) — used in NO rate and in no gate',
    outPath: OUT_PATH,
    srcDiffStat: srcDiff,
    tablePath: TABLE_PATH,
    o2t1Path: O2T1_PATH,
    tempoPath: TEMPO_PATH,
    tempoSmokePath: TEMPO_SMOKE_PATH,
    ggcSmokePath: GGC_SMOKE_PATH,
    checkpoint: {
      armed: CHECKPOINTING, path: CHECKPOINTING ? CKPT_PATH : null, resumeRequested: RESUME,
      restoredPass1: coreA.restored.length, computedPass1: coreA.computed.length,
      restoredPass2: coreB.restored.length, computedPass2: coreB.computed.length,
      note: 'RESILIENCE ONLY. The unit is the per-(pass, seed) set of 8 arm rows; nothing pooled '
        + 'is stored and every quantity, gate, digest and resultSha256 is recomputed from the '
        + 'union — a resumed run is byte-identical to a fresh one. /tmp scratch, never committed, '
        + 'never read by a gate.',
    },
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §16 THE TRANSCRIPT — PER-ARM ROWS AND DELTAS ONLY (#203)                    */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number): string => `${(x * 100).toFixed(4)}%`;
const rowLine = (label: string, key: RateKey, asPct = true, dp = 4): void => {
  o(`  ${label}`);
  for (const a of ARMS) {
    const c = C[key][a];
    const f = (v: number): string => (asPct ? pct(v) : v.toFixed(dp));
    const d = c.pairedDelta;
    o(`    ${a.padEnd(12)} ${f(c.point).padStart(12)}`
      + (d === null ? '   (CONTROL)'
        : `   Δ ${String(d.point).padStart(11)} [${d.lower}, ${d.upper}] resolved=${c.resolved}`));
  }
};
o('');
o(`=== CTB-T1 SUPPORT-SUPPLY EXAM · mode ${MODE} · ${body.block} (${RUN_N} seeds/arm, shared) ===`);
o(`world: BARE PRODUCTION-SHAPED · arms differ by EXACTLY the ctb dose · Δ = ARM − ${CONTROL_ARM}`);
o(`estimator: paired seed-cluster bootstrap, ratio-of-totals, 2.5/97.5, ${BOOTSTRAP_RESAMPLES} `
  + `resamples, stats base ${BOOTSTRAP_SEED}`);
o('');
o('THE RULER');
rowLine('1  TRUE-holdable supply (share of eligible moments)', 'trueHoldableShare');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].ruler1TrueHoldable;
  o(`    ${a.padEnd(12)} n_true ${String(s.trueHoldableTotal).padStart(4)} / eligible ${s.eligibleTotal}`);
}
rowLine('2  PRESSED first reception (openPlay spells, 4.2 m)', 'pressedFirstReceptionShare');
rowLine('3a SHORT-OPTION supply — possession ticks', 'shortOptionPossShare');
rowLine('3b SHORT-OPTION supply — first receptions', 'shortOptionFirstRecShare');
rowLine('4a SUPPORT-EXISTENCE at PRESSED possession ticks', 'supportAtPressedPossShare');
rowLine('4b SUPPORT-EXISTENCE at PRESSED first receptions', 'supportAtPressedFirstRecShare');
rowLine('5  goals per match (the #218 shares are LIFTED — rows below)', 'goalsPerMatch', false);
o('');
o('RULER 5 — THE #218 LIFT (REPORTED; no gate reads these · G-REPRO-GGC proves the port)');
for (const a of ARMS) {
  const g = (bodyA.arms as any)[a].ruler5BuildUp.genealogy;
  o(`  ${a.padEnd(12)} goals ${String(g.goals).padStart(3)} · constructed≥3 `
    + `${pct(g.constructedLadder.nonSetPiece.ladder.ge3.constructedShareOfPool)}`
    + ` · ≥4 ${pct(g.constructedLadder.nonSetPiece.ladder.ge4.constructedShareOfPool)}`
    + ` · ≥5 ${pct(g.constructedLadder.nonSetPiece.ladder.ge5.constructedShareOfPool)}`
    + ` · scramble ${pct(g.scrambleShareOfGoals)} · setPiece ${pct(g.setPieceShareOfGoals)}`
    + ` · turnover own/mid/final ${pct(g.turnoverByThirdOriginShares.own)}/`
    + `${pct(g.turnoverByThirdOriginShares.middle)}/${pct(g.turnoverByThirdOriginShares.final)}`);
}
o('  (the same five shares, PAIRED and bootstrapped — REPORTED, no gate reads them)');
rowLine('5a constructed ≥3 passes (non-set-piece pool)', 'constructedGe3Share');
rowLine('5b constructed ≥4 passes (non-set-piece pool)', 'constructedGe4Share');
rowLine('5c constructed ≥5 passes (non-set-piece pool)', 'constructedGe5Share');
rowLine('5d scramble share of goals', 'scrambleShareOfGoals');
rowLine('5e set-piece share of goals', 'setPieceShareOfGoals');
o('');
o('THE CEILINGS (rulers 3b/4b are near-saturated — disclosed, computed from these rows)');
for (const [k, c] of [['4b support@pressed first rec', saturationCeilings.ruler4bSupportAtPressedFirstRec],
  ['3b short option / first rec', saturationCeilings.ruler3bShortOptionFirstRec]] as const) {
  o(`  ${k}: ABSENT ${c.absentLevelPct}% ⇒ helpful headroom ${c.helpfulHeadroomPp} pp`);
  for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
    const r = (c.perArm as any)[a];
    o(`    ${a.padEnd(12)} Δ ${String(r.deltaPp).padStart(7)} pp = ${(r.shareOfHeadroomConsumed * 100).toFixed(1)}%`
      + ` of the headroom · resolved=${r.resolved}`);
  }
}
o('');
o('THE SEAM (G-ARM + clamp saturation)');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].seam;
  o(`  ${a.padEnd(12)} supportTicks ${String(s.supportTicks).padStart(7)} · shifted `
    + `${String(s.supportTicksShifted).padStart(7)} · meanShift ${String(s.meanShiftMetres).padStart(8)} m`
    + ` · behindBall ${pct(s.behindBallShare)} · clampX ${pct(s.clampXShare)} · clampY ${pct(s.clampYShare)}`);
}
o('');
o('THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)');
for (const g of guardRows) {
  o(`  ${g.key} [${g.family}, ${g.direction}] control ${g.controlLevel} · tol ±${g.toleranceAbs}`);
  for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
    const r = (g.arms as any)[a];
    o(`    ${a.padEnd(12)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
      + ` resolved=${r.resolved} beyondTol=${r.beyondTolerance} BREACH=${r.breach}`);
  }
}
o('  offsides/match (the #157 FLAG form — returns to the commander, flips no gate)');
for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
  const r = (offsideRows as any)[a];
  o(`    ${a.padEnd(12)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
    + ` resolved=${r.resolved} resolvedIncrease=${r.resolvedIncrease}`);
}
o(`  equilibrium band — gated dimensions ${JSON.stringify(bandGated)}`
  + ` · EXCLUDED (control itself out of band) ${JSON.stringify(bandExcluded)}`);
for (const a of ARMS) {
  o(`    ${a.padEnd(12)} allGatedInBand=${(bandRows as any)[a].allGatedDimensionsInBand}`);
}
o('');
o('N RULE (in-probe, from the committed artifacts)');
if (nRule.available) {
  const nr = nRule as any;
  o(`  DEFF ${nr.deff} (measured off the O2-T1 committed paired-delta CI)`);
  o(`  q1 TRUE-holdable (MDE = the O2-T1 resolved delta ${nr.q1TrueHoldable.mde}): m_req `
    + `${nr.q1TrueHoldable.mReq} ⇒ N ${nr.q1TrueHoldable.n}`);
  o(`  q2 pressed-first-reception (MDE = ${nr.q2PressedFirstReception.mde}, the census's own `
    + `smallest cross-arm gap): m_req ${nr.q2PressedFirstReception.mReq} ⇒ N ${nr.q2PressedFirstReception.n}`);
  o(`  binding ${nr.binding} ⇒ N* ${nr.nStar} (the RULE'S own number; ledger room ${nr.batteryRoom}, `
    + `binds=${nr.roomBinds}) · battery block ${nr.batteryBlock}`);
}
o('');
o('GATES');
for (const [k, g] of Object.entries(gates)) o(`  ${k.padEnd(18)} ${(g as any).pass ? 'PASS' : '*** FAIL ***'}`);
o(`  ALL                ${allGatesPass ? 'PASS' : '*** FAIL ***'}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${Math.round(wallMs / 1000)} s (CONTEXT ONLY) · artifact ${OUT_PATH}`);
if (!allGatesPass || OVERRIDDEN) process.exitCode = 1;
