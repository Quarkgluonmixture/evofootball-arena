// OBM T1 — THE POLICY EXAM: hand-dose the banked off-ball EYES seat's 16-weight policy
// matrix at pre-registered POLICY CORNERS, and measure the WORLD's receiver-side supply on
// the CTB-T1 instrument set INHERITED WHOLE.
//
// Doc:      docs/world-model/OBM-T1-POLICY-EXAM.md   (§FORM/§SEEDS/§GATES frozen before sight)
// Contract: docs/world-model/OFFBALL-MOVEMENT-CONTRACT.md §3 OBM-T1 (+ §1 H-OBM, §2 the law,
//           §4 non-claims); F-OBM-a/b/c pre-named there.
// Rulings:  #227 (the seat's contract) · #228 (OBM-T0 banked: the eyes seat certified, the
//           intercept participates ONLY through its own gate) · #228.5 (the recorded debts —
//           this probe carries (b), the G-FORK token completion) · #228.6 (the T1 notes: the
//           exam world MUST be percept-armed; the doses are designed against the OBSERVED
//           feature distribution; ZERO IS SILENCE) · #225.3(c) (per-dose STOP granularity) ·
//           #226 (F-CTB-a: the static plane moved geometry, not supply — the missing
//           dimension is WHEN) · #181.2 (every HARD gate computed in-probe) ·
//           #197-M1/#198 (hashed body vs UNHASHED envelope) · #163 (seed/stats disjointness) ·
//           #20 (cluster = match seed) · #128 (wall is CONTEXT ONLY) · #207 (checkpoint) ·
//           #203 (PER-ARM ROWS and paired deltas ONLY — this probe fires NO branch).
//
// ⭐ INSTRUMENT-ONLY ROUND. src/** is byte-untouched (X-SRC-UNTOUCHED is a HARD gate); the
// seat is banked at 600ff04 (+ ruling #228). Arms are built by the `obmMovement` MatchConfig
// flag + the 16-weight matrix written on ALL THREE genome views of BOTH teams (#196.3-D6) —
// no engine byte moves, and `ctbSupportPlane` is FALSE in every arm (the two-doors
// declaration: the intercept is 0 by the #228 fix, so what is measured here is the DYNAMIC
// term alone, on the incumbent geometry as its zero point).
//
// ⭐ THE WORLD IS PERCEPT-ARMED IN EVERY ARM (the #228.6 gate, G-BLIND-WORLD): a blind body
// has no policy, so a blind world would silently UNDELIVER the treatment.
//
// ⭐ EVERY RULER QUANTITY IS INHERITED, each with its own G-REPRO receipt:
//   1 TRUE-holdable supply     — the O2-T1 `trueCellOf` instrument VERBATIM (#186 population)
//   2 pressed-first-reception  — the #173 tempo-census instrument VERBATIM
//   3 short-option supply      — #224.4(i)'s named debt; constants PARSED out of source
//   4 support-existence @ press— (3) restricted to (2)'s pressure test
//   5 the #218 shares          — the goal-genealogy origin classifier, LOSS-TICK semantics
//                                verbatim. Gate: G-REPRO-GGC. REPORTED; no gate hangs on them.
//   ⭐ and the whole instrument itself is proved to BE CTB-T1's by G-REPRO-CTBT1: a re-walk
//   of the committed CTB-T1 battery block's first rows in CTB-T1's own ABSENT world, which
//   must reproduce its committed per-match rows EXACTLY — signature included.
//
//   OBMT1_MODE=smoke|full    (default smoke: 12 seeds @ 12,424,026)
//   OBMT1_RESUME=1           full mode only — restore finished (pass, seed) units (#207)
//   OBMT1_CHECKPOINT=<path>  /tmp scratch; never committed, never read by a gate
//   OBMT1_N=<n> / OBMT1_SKIP_FP=1 — OVERRIDES: routed onto the EXIT-SEMANTICS GUARD BLOCK,
//                            turn G-CLEAN-INVOCATION RED and exit 1. Such a run adjudicates
//                            nothing.
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import {
  appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync,
} from 'node:fs';
import { pressureAt } from '../../src/ai/perception';
import {
  formationSpot, supportSpot, supportSpotOnObmPlane,
  SUPPORT_LAT_CAP_FRAC, SUPPORT_LAT_PULL, CTB_DEPTH_BIAS_SPAN,
} from '../../src/ai/formations';
import { clamp } from '../../src/utils/math';
import { Match } from '../../src/sim/Match';
import type { Player } from '../../src/sim/Player';
import { cloneSimulationState } from '../../src/sim/cloneState';
import { DT, HALF_L, HALF_W, TOUCH_CONTROL_DIST } from '../../src/sim/constants';
import {
  OBM_FEATURE_KEYS, OBM_OUTPUT_KEYS, OBM_WEIGHT_MAX, OBM_WEIGHT_MIN, OBM_WEIGHT_SLOTS,
  offballMovementWeightVector, randomGenome, type TacticalGenome,
} from '../../src/evolution/genome';
import { OBM_SCORE_SPAN, obmOffballPolicy, type ObmPlane } from '../../src/ai/offballEyes';
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
const MODE = (process.env.OBMT1_MODE ?? 'smoke') === 'full' ? 'full' : 'smoke';
/** ⭐ FRESH, strictly above EVERYTHING OBM-T0 consumed (its ledger: 12,424,000–025 receipts
 *  + cost read, and 12,424,900–906 test seeds — read off its committed artifact, and proved
 *  clash-free in-probe against the COMPLETE ledger below, never asserted here). */
const SMOKE_BASE = 12_424_026;
const SMOKE_N = 12;
/** ⭐ THE DELIVERED-DOSE READ's own seed (one match per arm, OBSERVATIONAL — see §6c). It is
 *  a DECLARED fourth block, not a re-use of the exam block: the read pulls percepts
 *  out-of-band, so it may never touch a match whose rows are exam data. */
const DOSE_READ_SEED = 12_424_040;
const GUARD_BLOCK: readonly [number, number] = [12_424_050, 12_424_099];
const BATTERY_BASE = 12_424_100;
/** ⭐ THE CTB-T1 PRECEDENT CAP (the dispatch's, stated as a ceiling not a target): the
 *  battery may not exceed the N CTB-T1 itself ran. If the rule asks for more, that is a
 *  FORK for the commander — flagged in-probe (`capBinds`), never quietly re-cut. */
const N_CAP = 628;
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
/** ⭐ NEW — G-REPRO-CTBT1: the first rows of the CTB-T1 BATTERY block, re-walked in CTB-T1's
 *  OWN `absent` world (the bare production-shaped match), a DELIBERATE re-walk (receipt),
 *  never fresh data. This is what proves THIS probe IS that instrument. */
const REPRO_CTBT1_BASE = 12_423_100;
const REPRO_CTBT1_N = 8;
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
  { name: 'CTB-T1 smoke + exit-check (#225)', range: [12_423_025, 12_423_036] },
  { name: 'CTB-T1 guard band (#225)', range: [12_423_050, 12_423_099] },
  { name: 'CTB-T1 battery + reserve (#225/#226)', range: [12_423_100, 12_423_727] },
  { name: 'CTB-T0 test-file seeds (#224)', range: [12_423_900, 12_423_901] },
  /** ⭐ read off the COMMITTED OBM-T0 artifact's own `gates.seedDisjoint.intervals`. */
  { name: 'OBM-T0 receipts + geometry/EPI/smoke read (#228)', range: [12_424_000, 12_424_024] },
  { name: 'OBM-T0 REPORTED cost reading (#228)', range: [12_424_025, 12_424_025] },
  { name: 'OBM-T0 test-file seeds (#228)', range: [12_424_900, 12_424_906] },
];
/** ⭐ THE BATTERY BLOCK'S CEILING IS THE LEDGER'S, NOT A DISPATCH NUMBER (the ruled amendment):
 *  the dispatch's 500-seed cap was the DISPATCH's, never the contract's, and the N rule's own
 *  number governs. The only ceiling left is STRUCTURAL — the battery block may not run into the
 *  next consumed interval. Computed IN-PROBE from the ledger, never typed. */
const NEXT_CONSUMED_AFTER_BATTERY = Math.min(
  ...CONSUMED.map((c) => c.range[0]).filter((s) => s > BATTERY_BASE),
);
const BATTERY_ROOM = NEXT_CONSUMED_AFTER_BATTERY - BATTERY_BASE;
/** §4.2 the stats stream — a SEPARATE namespace. CTB-T1's base was 104,800 ⇒ the next legal
 *  base under the #163 200-floor is 105,000. The list is CTB-T1's COMPLETE published ledger
 *  + 104,800 (CTB-T1's own base). */
const BOOTSTRAP_SEED = 105_000;
const BOOTSTRAP_RESAMPLES = 2000;
const PUBLISHED_STATS_BASES = [
  91_100, 91_110, 92_110, 93_003, 97_003, 98_003, 99_003, 99_203, 99_403, 99_503, 99_603,
  99_703, 99_803, 99_903,
  100_003, 100_203, 100_303, 100_403, 100_503, 100_603, 100_703, 100_803, 100_903,
  101_003, 101_103, 101_203, 101_303, 101_403, 101_503, 101_513, 101_523, 101_800,
  102_000, 102_200, 102_400, 102_600, 102_800,
  103_000, 103_200, 103_400, 103_600, 103_800,
  104_000, 104_200, 104_400, 104_600, 104_800,
];

/* --- §3 the X-family pins + the committed source artifacts ----------------- */
const TABLE_PATH = 'docs/world-model/data/c5-recensus.json';
const O2T1_PATH = 'docs/world-model/data/o2-t1-wedge-exam.json';
const TEMPO_SMOKE_PATH = 'docs/world-model/data/tempo-census-sizing-smoke.json';
const TEMPO_PATH = 'docs/world-model/data/tempo-census.json';
/** the #218 lift's source of truth: the goal-genealogy census's OWN committed SMOKE artifact */
const GGC_SMOKE_PATH = 'docs/world-model/data/goal-genealogy-census-smoke.json';
/** ⭐ the instrument's OWN source of truth: CTB-T1's committed BATTERY artifact (#226). */
const CTBT1_PATH = 'docs/world-model/data/ctb-t1-supply-exam.json';
const FORMATIONS_SRC = 'src/ai/formations.ts';
const EXPECTED_TABLE_SHA = '184d1e84b787c312b6da95d7abcb6aee79c386e239a4f1c98e1783bfc0e20b53';
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* --- §4 the invocation guard (G-CLEAN-INVOCATION) -------------------------- */
const N_ENV = process.env.OBMT1_N ? Math.max(1, Number.parseInt(process.env.OBMT1_N, 10)) : null;
const SKIP_FP = process.env.OBMT1_SKIP_FP === '1';
const OVERRIDDEN = N_ENV !== null || SKIP_FP;
const OUT_PATH = OVERRIDDEN
  ? '/tmp/obm-t1-guard-run.json'
  : (MODE === 'smoke'
    ? 'docs/world-model/data/obm-t1-policy-exam-smoke.json'
    : 'docs/world-model/data/obm-t1-policy-exam.json');

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
type ArmName = 'absent' | 'armedZero' | 'checkWhenPressed' | 'checkAndShow'
  | 'markerEscape' | 'spaceSeek' | 'staleCaution' | 'kitchenSink';
const ARMS: readonly ArmName[] = [
  'absent', 'armedZero', 'checkWhenPressed', 'checkAndShow', 'markerEscape', 'spaceSeek',
  'staleCaution', 'kitchenSink',
];
const CONTROL_ARM: ArmName = 'absent';

/** row-major slot index, the seat's own convention: `output * featureCount + feature`. */
const IDX = (output: number, feature: number): number => output * OBM_FEATURE_KEYS.length + feature;
/** the four features, by index: 0 carrierPlight · 1 ownMarker · 2 targetCongestion · 3 readingAge */
const F1 = 0; const F2 = 1; const F3 = 2; const F4 = 3;
/** the four outputs, by index: 0 planeDepth · 1 planeWidth · 2 supportScore · 3 runScore */
const O_DEPTH = 0; const O_WIDTH = 1; const O_SUPPORT = 2; const O_RUN = 3;
const ZERO_MATRIX = (): number[] => new Array<number>(OBM_WEIGHT_SLOTS).fill(0);
const matrix = (...entries: readonly [number, number, number][]): number[] => {
  const w = ZERO_MATRIX();
  for (const [o, f, v] of entries) w[IDX(o, f)] = v;
  return w;
};
const MIN = OBM_WEIGHT_MIN; const MAX = OBM_WEIGHT_MAX;

/**
 * ⭐ THE POLICY CORNERS — PRE-REGISTERED EX ANTE, each a named 16-weight matrix, each a
 * sentence about football. NO number is invented: every non-zero entry is ±1, the frozen
 * signed domain's OWN corner (`OBM_WEIGHT_MIN/MAX`, themselves `CTB_GENE_MIN/MAX`).
 *
 * ⚠ READ THE DOSE AGAINST THE OBSERVED FEATURE DISTRIBUTION (#228.6), never against the
 * weight domain alone: the features' OBM-T0 means are f1 0.184 · f2 0.456 · f3 0.216 ·
 * f4 0.171, and an output is the MEAN of its weighted features, so a single-slot corner at
 * ±1 delivers on average about |mean(f_i)| / 4 of an axis. An f1-driven corner is therefore
 * a SMALL dose ON AVERAGE and a LARGE one exactly where f1 is large — i.e. CONCENTRATED at
 * pressed moments. That concentration IS the hypothesis, not a weakness of the dose; the
 * DELIVERED dose is published per arm (§6c) so dose ≠ delivered stays visible (the CTB-T1
 * clamp lesson).
 */
const DOSE: Record<ArmName, number[] | null> = {
  /** no flag, no genes — the production-shaped decision in the percept-armed world. */
  absent: null,
  /** the IDENTITY arm: armed, matrix present, every slot 0 ⇒ must be byte-identical. */
  armedZero: ZERO_MATRIX(),
  /**
   * ⭐ CHECK-WHEN-PRESSED — the 回撤 hypothesis in POLICY form, and the corner this arc
   * exists to test. "When the man on the ball is in trouble, come short." Plane depth is
   * driven NEGATIVE by f1 (the carrier's plight) at full weight, everything else zero: the
   * body drops off the line toward the ball EXACTLY in proportion to how pressed the
   * carrier he can SEE is, and not at all otherwise. This is the same behaviour CTB-T1
   * bought statically (parked bodies, F-CTB-a) — but TIMED.
   */
  checkWhenPressed: matrix([O_DEPTH, F1, MIN]),
  /**
   * CHECK-AND-SHOW — the same drop, plus the demand. Real checking is not only movement:
   * the body who comes short also makes himself the preferred option. f1 drives plane
   * depth DOWN and the `SupportBallCarrier` score UP, so a pressed carrier both gets a
   * body coming toward him and gets more of the team choosing to be that body.
   */
  checkAndShow: matrix([O_DEPTH, F1, MIN], [O_SUPPORT, F1, MAX]),
  /**
   * MARKER-ESCAPE (f2-driven) — "the tighter you are marked, the further you go from
   * where he wants you." His own marker's tightness pushes him FORWARD (spin in behind)
   * and WIDE (stretch away from the crowd). f2 is the LARGEST feature in the observed
   * distribution (0.456), so this is the biggest delivered dose of the single-family
   * corners — the honest counterpart to the f1 corners' concentration.
   */
  markerEscape: matrix([O_DEPTH, F2, MAX], [O_WIDTH, F2, MAX]),
  /**
   * SPACE-SEEK (f3-driven) — "if the spot you were going to is crowded, do not go there."
   * Congestion at his OWN candidate point widens him (away from the lane) and drops him
   * off it. Note f3's polarity: it RISES with tightness, so a positive width weight means
   * "widen when it is crowded" and a negative depth weight means "come off it".
   */
  spaceSeek: matrix([O_WIDTH, F3, MAX], [O_DEPTH, F3, MIN]),
  /**
   * STALE-CAUTION (f4-driven) — "if your picture is old, do not gamble." The AGE of his
   * own readings pulls BOTH candidate scores down: a body who has not looked recently
   * neither demands the ball nor spends himself on a run. The fourth feature family is
   * probed rather than left dark, and its direction is the one a coach would recognise.
   */
  staleCaution: matrix([O_SUPPORT, F4, MIN], [O_RUN, F4, MIN]),
  /**
   * ⭐ KITCHEN-SINK — the CEILING PROBE, stated honestly as one. All sixteen slots at a
   * domain corner, signed as one coherent instruction: "come short, hold width, demand the
   * ball, do not gamble on runs", driven by EVERY reading at once. It is the largest
   * movement this seat can express, and because every feature is non-negative and each row
   * is single-signed it is also the arm whose delivered dose is the mean of the feature
   * means (~0.257 of an axis) — which is precisely what makes dose ≠ delivered legible.
   * It is NOT a football recommendation and nothing about it is proposed for shipping.
   */
  kitchenSink: ((): number[] => {
    const w = ZERO_MATRIX();
    for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) {
      w[IDX(O_DEPTH, f)] = MIN;
      w[IDX(O_WIDTH, f)] = MAX;
      w[IDX(O_SUPPORT, f)] = MAX;
      w[IDX(O_RUN, f)] = MIN;
    }
    return w;
  })(),
};
/** the receipt walks (never exam data): each runs in ITS SOURCE's own world */
type ReproArm = 'reproO2Control' | 'repro173Prod' | 'reproGgcProd' | 'reproCtbT1Absent';
type WalkArm = ArmName | ReproArm;
/** the O2-T1 CONTROL world, VERBATIM (CENSUS_FLAGS + o1PassWindup) */
const O2T1_CONTROL_FLAGS = {
  edsPerceivedDefence: true, edsPerceivedChoice: true, edsValueAxis: true,
  c5Hold: true, c6Carry: true, c7Windup: true, c5TouchFork: false, o1PassWindup: true,
} as const;

/**
 * ⭐ THE PERCEPT-ARMED BASE WORLD — IDENTICAL IN EVERY ARM (the #228.6 gate).
 *
 * `refreshPerception` runs only when `edsPerceivedDefence || edsPerceivedChoice ||
 * stationEye !== null` (`src/sim/Match.ts`), and a body's SNAPSHOT PLAYERS are
 * reconstructed from his RECORDED SCAN MOMENTS, which are recorded only when
 * `edsPerceivedChoice || stationEye !== null`. So:
 *   * `edsPerceivedDefence` ALONE gives a memory but NO scan frames ⇒ every body believes
 *     he is alone ⇒ all four features EXACTLY ZERO ⇒ the treatment is silently undelivered —
 *     the P1 failure mode wearing a percept flag;
 *   * a `stationEye` needs a whole eye configuration and is a far larger intervention;
 *   * `edsPerceivedChoice` ALONE is therefore the MINIMAL arming that makes the seat's eyes
 *     actually see: one flag, both halves of the chain (the refresh AND the scan record).
 *
 * ⚠ DECLARED, NOT HIDDEN: `edsPerceivedChoice` is not behaviour-free — it also switches the
 * CARRIER's pass choice onto the perceived-snapshot chooser (`PlayerBrain.ts`). That is a
 * REAL difference from CTB-T1's bare world, so the ABSENT level here is NOT CTB-T1's ABSENT
 * level and the two batteries' absolute numbers are not comparable. The PAIRED contrast is
 * clean regardless, because ALL EIGHT ARMS SHARE THIS WORLD EXACTLY and the arms differ by
 * nothing but the policy matrix. Weighed and chosen: a smaller flag set that leaves the eyes
 * blind would be strictly worse than a slightly larger world that delivers the treatment.
 */
const PERCEPT_FLAGS = { edsPerceivedChoice: true } as const;

/** ⭐ THE ARMING CHECKLIST (#196.3-D6 + the OBM-T0 four limbs): the 16-weight MATRIX on ALL
 *  THREE genome views of BOTH teams. Limb 4 (a percept-armed world) is the world above. */
const armMatrix = (m: Match, w: readonly number[] | null): void => {
  for (const t of m.teams) {
    for (const g of [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]) {
      if (w === null) delete g.offballMovementWeights;
      else g.offballMovementWeights = [...w];
    }
  }
};
/** G-ARM's gene-channel receipt: is the matrix present, full-length, on all six views? */
const genesOnAllViews = (m: Match): boolean => m.teams.every((t) => (
  [t.info.genome, t.baseGenome, t.effGenome] as TacticalGenome[]
).every((g) => Array.isArray(g.offballMovementWeights)
  && g.offballMovementWeights.length === OBM_WEIGHT_SLOTS));

const matchOf = (seed: number, arm: WalkArm): Match => {
  const base = { seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2), duration: MATCH_DURATION };
  if (arm === 'reproO2Control') {
    return new Match({ ...base, ...O2T1_CONTROL_FLAGS } as ConstructorParameters<typeof Match>[0]);
  }
  /** ⭐ the #173 receipt walk is the census's own `prod` arm; the #218 receipt walk is the
   *  genealogy census's own `PROD` arm; ⭐ the NEW G-REPRO-CTBT1 walk is CTB-T1's own ABSENT
   *  arm — all three are the BARE production-shaped world (`new Match({seed, teamA, teamB,
   *  duration})`), which is NOT this exam's world. Each receipt runs in ITS SOURCE's world,
   *  and the gates are what prove the identity rather than asserting it. */
  if (arm === 'repro173Prod' || arm === 'reproGgcProd' || arm === 'reproCtbT1Absent') {
    return new Match(base as ConstructorParameters<typeof Match>[0]);
  }
  const d = DOSE[arm];
  /** ⭐ THE TWO-DOORS DECLARATION, in code: `ctbSupportPlane` is NEVER passed, in ANY arm, so
   *  it is `false` everywhere and the policy's INTERCEPT is a hard 0 (the #228 fix). What
   *  this exam doses is the DYNAMIC term alone, on the incumbent geometry as its zero point;
   *  the banked static bank is not this exam's question and cannot leak in. Asserted per arm
   *  by FLAG-HYGIENE, never merely stated. */
  if (d === null) {
    return new Match({ ...base, ...PERCEPT_FLAGS } as ConstructorParameters<typeof Match>[0]);
  }
  const m = new Match({
    ...base, ...PERCEPT_FLAGS, obmMovement: true,
  } as ConstructorParameters<typeof Match>[0]);
  armMatrix(m, d);
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
  /* --- G-ARM + the DELIVERED dose, read where the executor consumes it --- */
  supportTicks: number;
  supportTicksPlanePresent: number;
  supportTicksPlaneAbsent: number;
  supportTicksPlaneZero: number;
  supportTicksShifted: number;
  supportTicksUnshiftedClampBound: number;
  supportTicksZeroPlaneMoved: number;
  supportShiftSum: number;
  supportShiftMax: number;
  supportShiftGe1: number;
  planeDepthSum: number;
  planeWidthSum: number;
  planeDepthAbsSum: number;
  planeWidthAbsSum: number;
  supportBehindBall: number;
  clampXBound: number;
  clampYBound: number;
  genesOnAllViews: number;
  policyCacheEntries: number;
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

const isExamArm = (arm: WalkArm): arm is ArmName => (ARMS as readonly string[]).includes(arm);
const walkSeed = (seed: number, arm: WalkArm): PerMatch => {
  const m = matchOf(seed, arm);
  /** ARMED = the `obmMovement` flag is on and a matrix is written (ARMED-ZERO included). */
  const armedFlag = isExamArm(arm) && DOSE[arm] !== null;
  /** DOSED = armed AND at least one slot is non-zero (ARMED-ZERO is armed but not dosed). */
  const dosed = armedFlag && (DOSE[arm as ArmName] as number[]).some((v) => v !== 0);

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
    supportTicks: 0, supportTicksPlanePresent: 0, supportTicksPlaneAbsent: 0,
    supportTicksPlaneZero: 0, supportTicksShifted: 0, supportTicksUnshiftedClampBound: 0,
    supportTicksZeroPlaneMoved: 0,
    supportShiftSum: 0, supportShiftMax: 0, supportShiftGe1: 0,
    planeDepthSum: 0, planeWidthSum: 0, planeDepthAbsSum: 0, planeWidthAbsSum: 0,
    supportBehindBall: 0, clampXBound: 0, clampYBound: 0, genesOnAllViews: 0,
    policyCacheEntries: 0,
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

    /* ===== G-ARM + the DELIVERED dose: the seam, read WHERE IT IS CONSUMED =====
     * ⭐ PURE READ, NO PERCEPT PULL. The executor's own two statements are replayed here:
     * the incumbent point `supportSpot(p, t, ball, match.ctbSupportPlane === false)`, then
     * `supportSpotOnObmPlane(...)` if and only if `match.obmPlaneFor(p)` is non-null. Both
     * are pure geometry over state the brain ALREADY computed, so this instrument cannot
     * perturb the world it measures — the seat's percept pull happens in the brain, at the
     * brain's cadence, exactly once, and nothing here asks for a second one. (The FEATURE
     * and SCORE-MULTIPLIER distributions need a pull and therefore live in the separate
     * OBSERVATIONAL delivered-dose read, §6c, on its own declared seed.) */
    if (phase === 'playing') {
      for (const t of m.teams) {
        for (const p of t.players) {
          if (p.action.type !== 'SupportBallCarrier' || p.sentOff) continue;
          r.supportTicks += 1;
          const base = supportSpot(p, t, m.ball);
          const plane: ObmPlane | null = armedFlag ? m.obmPlaneFor(p) : null;
          const got = plane === null ? base : supportSpotOnObmPlane(p, t, m.ball, plane);
          const shift = Math.hypot(got.x - base.x, got.y - base.y);
          const planeZero = plane !== null && plane.depth === 0 && plane.width === 0;
          if (plane === null) r.supportTicksPlaneAbsent += 1;
          else {
            r.supportTicksPlanePresent += 1;
            r.planeDepthSum += plane.depth;
            r.planeWidthSum += plane.width;
            r.planeDepthAbsSum += Math.abs(plane.depth);
            r.planeWidthAbsSum += Math.abs(plane.width);
            // ⭐ ZERO IS SILENCE (#228.6): a body whose four features ALL read zero — the
            // no-policy point, whose commonest cause is that this arm's own driving feature is
            // zero at this moment, not blindness — has a plane of exactly (0,0) and must not
            // move by one bit. Counted as its own class, never folded into "the seam did
            // nothing".
            if (planeZero) {
              r.supportTicksPlaneZero += 1;
              if (shift !== 0) r.supportTicksZeroPlaneMoved += 1;
            }
          }
          if (shift > 0) r.supportTicksShifted += 1;
          if (shift >= 1) r.supportShiftGe1 += 1;
          r.supportShiftSum += shift;
          r.supportShiftMax = Math.max(r.supportShiftMax, shift);
          if ((got.x - m.ball.pos.x) * t.attackDir < 0) r.supportBehindBall += 1;
          // ⭐ CLAMP SATURATION (#224.4(ii), inherited): the INCUMBENT pitch clamps, priced
          // by recomputing the PRE-CLAMP expression exactly as `supportSpotDeformed` builds
          // it. Saturation is part of the delivered dose, not slop.
          const g = t.genome;
          const radius = supportRadiusOf(g);
          const bias = t.mode === 'CounterAttack' || t.mode === 'Attack' ? 0.75 : 0.35;
          const depthShift = plane === null ? 0 : plane.depth * CTB_DEPTH_BIAS_SPAN;
          const widthScale = plane === null ? 1 : 1 + plane.width;
          const maxLat = radius * SUPPORT_LAT_CAP_FRAC * widthScale;
          const lane = formationSpot(p, t, m.ball, true);
          const preX = m.ball.pos.x + t.attackDir * radius * (bias + depthShift);
          const preY = m.ball.pos.y
            + clamp((lane.y - m.ball.pos.y) * SUPPORT_LAT_PULL * widthScale, -maxLat, maxLat);
          if (Math.abs(preX) > HALF_L - 2) r.clampXBound += 1;
          if (Math.abs(preY) > HALF_W - 2) r.clampYBound += 1;
          // ⚠ THE ACCOUNTING RULE, INHERITED AND RE-CUT FOR THIS SEAT (stated, not smuggled):
          // a tick whose plane is PRESENT and NON-ZERO can fail to move only where the
          // INCUMBENT pitch clamp pins two genuinely different pre-clamp values to the SAME
          // bound. The two OTHER ways an armed tick can fail to move are counted in their own
          // classes above and are NOT clamp saturation: `planeAbsent` (this body has not
          // decided inside `OBM_POLICY_TTL_TICKS` — the cadence cap doing its job) and
          // `planeZero` (ZERO IS SILENCE — he perceived nobody, so the policy is the
          // no-policy point). The four classes partition `supportTicks` exactly, and that
          // partition is a gate row rather than a claim.
          if (shift === 0 && plane !== null && !planeZero) {
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
  /** ⭐ THE SEAT REACHED, read at the SOURCE: the size of the match's own policy cache — the
   *  map `Match.setObmPolicy` writes to, and the ONLY thing that writes to it is the single
   *  `obmMovement` fork in `PlayerBrain.decideOffBall`. Non-zero ⇒ the brain entered the
   *  fork and wrote a policy. Read-only introspection of a private field, declared here
   *  rather than hidden; it changes nothing and is used only as a G-ARM receipt. */
  r.policyCacheEntries = (m as unknown as { obmPolicies: Map<number, unknown> }).obmPolicies.size;
  r.signature = signatureOf(m);
  return r;
};

/* ========================================================================== */
/* §6c THE DELIVERED-DOSE READ — OBSERVATIONAL, on its own declared seed       */
/* ========================================================================== */
/**
 * ⭐ WHAT THE ARM ACTUALLY DELIVERS, per arm: the FEATURE distribution the bodies really
 * read, the four outputs those features produce under THIS arm's matrix, the composed plane,
 * and the two SCORE MULTIPLIERS — which exist nowhere in the match state (the brain computes
 * them, applies them and drops them), so they can only be read by asking the seat again.
 *
 * ⚠ WHY THIS IS NOT IN THE EXAM WALK, declared: asking the seat again means calling
 * `match.perceivedSnapshot(p)`, which ADVANCES that body's percept memory. Inside an exam arm
 * that would be an intervention wearing an instrument's clothes. So this read runs on its own
 * declared seed, ONE match per arm, and its numbers are DESCRIPTIVE ONLY: no gate hangs on
 * any level here, no CI is computed, and none of it enters the paired estimator. The gate
 * that DOES read it is G-BLIND-WORLD, and only for the non-degeneracy of the percept trunk
 * (are there snapshots, are there perceived opponents, are the features non-zero) — a
 * property of the WORLD, which every arm shares.
 *
 * The sampling law is the OBM-T0 policy-geometry read's, verbatim: every 15 playing ticks,
 * every outfielder of both teams, the anchor being the point the body would take with the
 * seat absent under this world's flag state (`supportSpot(p, t, ball, m.ctbSupportPlane)`).
 */
const SAMPLE_EVERY_DOSE = 15;
const doseRead = (arm: ArmName) => {
  const m = matchOf(DOSE_READ_SEED, arm);
  const nF = OBM_FEATURE_KEYS.length;
  const nO = OBM_OUTPUT_KEYS.length;
  const featureSums = new Array<number>(nF).fill(0);
  const outputSums = new Array<number>(nO).fill(0);
  const supportMuls: number[] = [];
  const runMuls: number[] = [];
  const depths: number[] = [];
  const widths: number[] = [];
  let samples = 0;
  let sawSnapshot = 0;
  let someFeatureNonZero = 0;
  let allFeaturesZero = 0;
  let i = 0;
  while (!m.finished) {
    m.step(DT);
    i += 1;
    if (i % SAMPLE_EVERY_DOSE !== 0 || m.phase !== 'playing') continue;
    for (const t of m.teams) {
      for (const p of t.players) {
        if (p.sentOff || p.role === 'GK') continue;
        const anchor = supportSpot(p, t, m.ball, m.ctbSupportPlane);
        const policy = obmOffballPolicy(p, m, t.genome, anchor, m.ctbSupportPlane);
        samples += 1;
        if (policy.sawSnapshot) sawSnapshot += 1;
        // ⚠ NAMED FOR WHAT IT MEASURES (the pre-battery correction): this counts samples where
        // AT LEAST ONE of the four features is non-zero — it is NOT "he perceived an opponent".
        // All four features can read exactly zero WITH opponents present (every one of them
        // beyond the feature's radius, or the readings fresh enough that f4 is 0), so the
        // complement `allFeaturesZeroShare` is an UPPER BOUND on genuine blindness, never a
        // measurement of it.
        if (policy.features.some((f) => f !== 0)) someFeatureNonZero += 1;
        else allFeaturesZero += 1;
        for (let k = 0; k < nF; k++) featureSums[k] += policy.features[k];
        for (let o = 0; o < nO; o++) outputSums[o] += policy.outputs[o];
        depths.push(policy.plane.depth);
        widths.push(policy.plane.width);
        supportMuls.push(policy.supportMul);
        runMuls.push(policy.runMul);
      }
    }
  }
  const n = Math.max(1, samples);
  const dist5 = (xs: number[]) => ({
    mean: round(mean(xs), 5), p05: round(quantile(xs, 0.05), 5), p50: round(quantile(xs, 0.5), 5),
    p95: round(quantile(xs, 0.95), 5),
    min: round(xs.length === 0 ? Number.NaN : Math.min(...xs), 5),
    max: round(xs.length === 0 ? Number.NaN : Math.max(...xs), 5),
  });
  return {
    seed: DOSE_READ_SEED,
    samples,
    sampleLaw: `every ${SAMPLE_EVERY_DOSE} playing ticks, every outfielder of BOTH teams`,
    matrix: DOSE[arm],
    featureKeys: OBM_FEATURE_KEYS,
    outputKeys: OBM_OUTPUT_KEYS,
    featureMeans: featureSums.map((v) => round(v / n, 5)),
    outputMeans: outputSums.map((v) => round(v / n, 5)),
    planeDepth: dist5(depths),
    planeWidth: dist5(widths),
    supportMul: dist5(supportMuls),
    runMul: dist5(runMuls),
    sawSnapshotShare: round(sawSnapshot / n, 5),
    someFeatureNonZeroShare: round(someFeatureNonZero / n, 5),
    allFeaturesZeroShare: round(allFeaturesZero / n, 5),
    scoreSpan: OBM_SCORE_SPAN,
    note: 'DESCRIPTIVE ONLY, on ONE observational match per arm at the DECLARED dose-read '
      + 'seed. The percept pulls here perturb THIS match and no other; no exam row, no CI and '
      + 'no gate level is computed from it. ⭐ `someFeatureNonZeroShare` counts samples where AT '
      + 'LEAST ONE of the four features is non-zero — RENAMED from `sawPerceivedOpponentShare`, '
      + 'which claimed more than it measured. Its complement `allFeaturesZeroShare` is the '
      + 'ZERO-IS-SILENCE share and is an UPPER BOUND on genuine blindness, NOT a measurement of '
      + 'it: all four features also read exactly zero with opponents PRESENT (every one of them '
      + 'beyond the feature\'s own radius, or the body\'s readings fresh enough that f4 is 0). '
      + 'What it does license is the direction the gate needs — a body whose features are all '
      + 'zero has the no-policy point, and that class is small.',
  };
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
    /* ⭐ the seam, reached — and the DELIVERED dose, read where the executor consumes it */
    seam: {
      supportTicks: s((r) => r.supportTicks),
      policyCacheEntries: s((r) => r.policyCacheEntries),
      planePresentTicks: s((r) => r.supportTicksPlanePresent),
      planeAbsentTicks: s((r) => r.supportTicksPlaneAbsent),
      planeZeroTicks: s((r) => r.supportTicksPlaneZero),
      supportTicksShifted: s((r) => r.supportTicksShifted),
      supportTicksUnshiftedClampBound: s((r) => r.supportTicksUnshiftedClampBound),
      zeroPlaneMovedTicks: s((r) => r.supportTicksZeroPlaneMoved),
      partitionExact: s((r) => r.supportTicks) === s((r) => r.supportTicksPlaneAbsent)
        + s((r) => r.supportTicksPlaneZero) + s((r) => r.supportTicksShifted)
        + s((r) => r.supportTicksUnshiftedClampBound),
      /* ⭐ THE DELIVERED DOSE (dose ≠ delivered — the CTB-T1 clamp lesson, generalised) */
      meanShiftMetres: round(rateOf(rows, 'meanShiftM'), 4),
      maxShiftMetres: round(Math.max(...rows.map((r) => r.supportShiftMax)), 4),
      shiftedShareOfSupportTicks: round(
        s((r) => r.supportTicksShifted) / Math.max(1, s((r) => r.supportTicks)), 5,
      ),
      shiftGe1mShareOfSupportTicks: round(
        s((r) => r.supportShiftGe1) / Math.max(1, s((r) => r.supportTicks)), 5,
      ),
      meanPlaneDepthOnPresent: round(
        s((r) => r.planeDepthSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      meanPlaneWidthOnPresent: round(
        s((r) => r.planeWidthSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      meanAbsPlaneDepthOnPresent: round(
        s((r) => r.planeDepthAbsSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      meanAbsPlaneWidthOnPresent: round(
        s((r) => r.planeWidthAbsSum) / Math.max(1, s((r) => r.supportTicksPlanePresent)), 5,
      ),
      behindBallTicks: s((r) => r.supportBehindBall),
      behindBallShare: round(rateOf(rows, 'behindBallShare')),
      genesOnAllViewsSeeds: s((r) => r.genesOnAllViews),
      clampXBoundTicks: s((r) => r.clampXBound),
      clampXShare: round(rateOf(rows, 'clampXShare')),
      clampYBoundTicks: s((r) => r.clampYBound),
      clampYShare: round(rateOf(rows, 'clampYShare')),
      deliveredNote: '⭐ DOSE ≠ DELIVERED, published so it cannot be assumed away. The matrix '
        + 'is the DOSE; what the executor actually consumes is the composed PLANE, whose size '
        + 'is the mean of the WEIGHTED FEATURES — and the features are small on average '
        + '(#228.6: f1 0.184 · f2 0.456 · f3 0.216 · f4 0.171). The four support-tick classes '
        + 'partition exactly: SHIFTED · PLANE-ZERO · PLANE-ABSENT (no decision inside '
        + 'OBM_POLICY_TTL_TICKS — the cadence cap) · UNSHIFTED-CLAMP-BOUND (the INCUMBENT pitch '
        + 'clamp pinned both pre-clamp values to the same bound). ⭐ READ PLANE-ZERO CAREFULLY: '
        + 'it has THREE causes, and only one of them is blindness — (i) this arm doses no plane '
        + 'row at all (a SCORE-only corner moves no geometry BY CONSTRUCTION); (ii) this arm\'s '
        + 'own driving features read zero at that moment (for an f1 corner: the carrier is not '
        + 'perceived-pressed — the CONCENTRATION the hypothesis is about); (iii) genuine '
        + 'silence — nothing this body reads is non-zero — which the delivered-dose read BOUNDS '
        + 'FROM ABOVE as `allFeaturesZeroShare` (~1 % of samples; a ceiling, not a measurement, '
        + 'because four zero features also occur with opponents PRESENT beyond the feature '
        + 'radii). None of the four classes is slop and none of them is a gate on its own.',
      clampNote: 'CLAMP SATURATION (#224.4(ii)): the INCUMBENT pitch clamps ±(HALF_L−2) / '
        + '±(HALF_W−2) bind on real ticks. Published so the dose-response reads honestly.',
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
const CTBT1 = readJson(CTBT1_PATH);
/** ⭐ THIS EXAM'S OWN COMMITTED SMOKE, when one exists: the ONLY same-world source of p0 and
 *  of a cluster variance for the percept-armed world. Null on the smoke run itself. */
const OBM_SMOKE_PATH = 'docs/world-model/data/obm-t1-policy-exam-smoke.json';
/** ⚠ NEVER read in smoke mode: a smoke run must not size itself off a PREVIOUS smoke run
 *  (it would make the receipt depend on what happens to be lying in the tree). */
const OBM_SMOKE = MODE === 'smoke' ? null : readJson(OBM_SMOKE_PATH);

const nRule = (() => {
  if (O2T1 === null || TEMPO === null) {
    return { available: false, note: `absent: ${O2T1_PATH} / ${TEMPO_PATH}`, nStar: null as number | null };
  }
  const j = O2T1.j;
  const ctrl = j.arms.control;
  const c1 = j.contrasts.rates.trueContextShare;
  /** ⭐ TRACED MDE: the ONE paired delta this instrument has resolved in a banked battery. */
  const mdeQ1 = Math.abs(c1.pairedDelta.point as number);
  const m320 = ctrl.eligibleTotal as number;
  const p0o2 = c1.control.point as number;
  const seBoot = ((c1.pairedDelta.upper - c1.pairedDelta.lower) / 2) / Z975;
  const seIid = Math.sqrt((p0o2 * (1 - p0o2) + (c1.look.point as number)
    * (1 - (c1.look.point as number))) / m320);
  const deffInherited = (seBoot * seBoot) / (seIid * seIid);

  /* --- the #173 column's MDE, read from the committed census (no same-world source) --- */
  const arms = TEMPO.j.result.arms;
  const shareOf = (a: string): number => arms[a].pressContext.firstReceptionsOfSpell.pressedShare as number;
  const mdeQ2 = Math.min(Math.abs(shareOf('v1') - shareOf('prod')), Math.abs(shareOf('v2') - shareOf('prod')));

  /** ⭐ THE SAME-WORLD RECUT (the dispatch's instruction, and the honest half of this rule):
   *  CTB-T1's p0 / moments-per-seed / DEFF all came from worlds that are NOT this one — the
   *  bare production world and the O2-T1 control world. THIS exam runs percept-armed, whose
   *  variance may differ, so wherever this probe's OWN committed smoke exists its ABSENT arm
   *  supplies p0 and moments-per-seed, and its own paired-delta CI on the CEILING arm supplies
   *  a same-world DEFF. The MDEs stay the traced committed ones: no same-world MDE exists, and
   *  inventing one after sight is exactly what the frozen-before-sight rule forbids. */
  const smoke = OBM_SMOKE === null ? null : (() => {
    const s = OBM_SMOKE.j;
    const seeds = s.seeds as number;
    const absent = s.arms.absent;
    const rate1 = s.contrasts.rates.trueHoldableShare;
    const rate2 = s.contrasts.rates.pressedFirstReceptionShare;
    const p0q1 = rate1.absent.point as number;
    const p0q2 = rate2.absent.point as number;
    const eligPerSeed = (absent.ruler1TrueHoldable.eligibleTotal as number) / seeds;
    const frPerSeed = (absent.ruler2PressedFirstReception.firstReceptions as number) / seeds;
    /** DEFF, same-world: the CEILING arm's own paired-delta CI on ruler 2 (the column with
     *  enough moments per seed to have a usable variance at 12 clusters), against the iid SE
     *  on the same moment count. Declared: at 12 clusters this is a NOISY DEFF, which is why
     *  the rule takes the MAXIMUM of it and the inherited one — the conservative direction. */
    const mAll = (absent.ruler2PressedFirstReception.firstReceptions as number);
    const d2 = rate2.kitchenSink.pairedDelta;
    const seBoot2 = ((d2.upper - d2.lower) / 2) / Z975;
    const pK = rate2.kitchenSink.point as number;
    const seIid2 = Math.sqrt((p0q2 * (1 - p0q2) + pK * (1 - pK)) / Math.max(1, mAll));
    const deffSmoke = (seBoot2 * seBoot2) / (seIid2 * seIid2);
    return {
      path: OBM_SMOKE_PATH, sha256: sha(OBM_SMOKE.bytes.toString('utf8')),
      resultSha: s.resultSha256, seeds, p0q1, p0q2,
      eligiblePerSeed: round(eligPerSeed, 4), firstReceptionsPerSeed: round(frPerSeed, 4),
      deffSmoke: round(deffSmoke, 4),
      deffProvenance: 'the CEILING arm (kitchenSink) paired-delta CI on ruler 2, this world, '
        + '12 clusters — NOISY by construction and therefore used only through a MAX with the '
        + 'inherited DEFF.',
    };
  })();

  const deff = smoke === null ? deffInherited
    : Math.max(deffInherited, Number.isFinite(smoke.deffSmoke) ? smoke.deffSmoke : 0);
  const p0q1 = smoke === null ? p0o2 : smoke.p0q1;
  const p0q2 = smoke === null ? shareOf('prod') : smoke.p0q2;
  const eligPerSeed = smoke === null ? (ctrl.eligibleTotal / j.seeds) : smoke.eligiblePerSeed;
  const frPerSeed = smoke === null
    ? (arms.prod.pressContext.firstReceptionsOfSpell.all.n as number) / (arms.prod.matches as number)
    : smoke.firstReceptionsPerSeed;
  const p1q1 = p0q1 + mdeQ1;
  const p1q2 = p0q2 - mdeQ2;
  const mIid = (p0: number, p1: number): number =>
    ((Z975 + Z80) ** 2 * (p0 * (1 - p0) + p1 * (1 - p1))) / ((p1 - p0) ** 2);
  const mReqQ1 = deff * mIid(p0q1, p1q1);
  const nQ1 = Math.ceil(mReqQ1 / Math.max(1e-9, eligPerSeed));
  const mReqQ2 = deff * mIid(p0q2, p1q2);
  const nQ2 = Math.ceil(mReqQ2 / Math.max(1e-9, frPerSeed));

  const nRaw = Math.max(nQ1, nQ2);
  /** ⭐ THE CAP IS A CEILING, NOT A TARGET, and it is FLAGGED when it binds: the dispatch caps
   *  the battery at the CTB-T1 precedent N (628) because an armed battery costs ≈1.4× the wall
   *  (#228.4). If the rule asks for more, that is a FORK the commander decides — this probe
   *  publishes `capBinds` and `nRaw` side by side and re-cuts NOTHING. */
  const nStar = Math.min(BATTERY_ROOM, N_CAP, nRaw);
  return {
    available: true,
    rule: 'm_iid = (z.975+z.80)^2 (p0(1−p0)+p1(1−p1)) / (p1−p0)^2 ; DEFF = MAX(inherited O2-T1 '
      + 'paired-delta DEFF, this world\'s own smoke DEFF when it exists) ; m_req = DEFF·m_iid ; '
      + 'N(q) = ceil(m_req / momentsPerSeed) ; N = max_q N(q), capped by the ledger room AND by '
      + 'the CTB-T1 precedent cap (flagged when it binds)',
    worldNote: '⚠ p0 AND moments-per-seed are WORLD-DEPENDENT and this world (percept-armed) is '
      + 'NOT CTB-T1\'s (bare production). Where this probe\'s own committed smoke exists they '
      + 'are read from ITS absent arm; where it does not, they are the inherited out-of-world '
      + 'numbers and that substitution is stated in `sourceOfP0` rather than hidden.',
    sourceOfP0: smoke === null ? 'INHERITED (out-of-world: O2-T1 control + #173 prod)'
      : 'THIS WORLD (the committed OBM-T1 smoke\'s ABSENT arm)',
    sources: {
      o2t1: { path: O2T1_PATH, sha256: sha(O2T1.bytes.toString('utf8')), resultSha: j.resultSha256 },
      tempo: { path: TEMPO_PATH, sha256: sha(TEMPO.bytes.toString('utf8')), resultSha: TEMPO.j.resultSha256 },
      obmSmoke: smoke === null ? null
        : { path: smoke.path, sha256: smoke.sha256, resultSha: smoke.resultSha, seeds: smoke.seeds },
    },
    deff: round(deff, 4),
    deffInherited: round(deffInherited, 4),
    deffSmoke: smoke === null ? null : smoke.deffSmoke,
    deffProvenance: smoke === null
      ? 'INHERITED from the O2-T1 committed paired-delta CI (no same-world source yet)'
      : `MAX(inherited ${round(deffInherited, 4)}, same-world smoke ${smoke.deffSmoke}) — ${smoke.deffProvenance}`,
    q1TrueHoldable: {
      p0: round(p0q1, 8), mde: mdeQ1, p1: round(p1q1, 8),
      mdeProvenance: 'the O2-T1 COMMITTED paired delta on trueContextShare — the ONE paired '
        + 'delta this instrument has resolved in a banked battery. INHERITED knowingly: no '
        + 'same-world MDE exists, and choosing one after sight is forbidden.',
      eligiblePerSeed: round(eligPerSeed, 4), mIid: round(mIid(p0q1, p1q1), 1),
      mReq: round(mReqQ1, 1), n: nQ1,
    },
    q2PressedFirstReception: {
      p0: round(p0q2, 8), mde: round(mdeQ2, 6), p1: round(p1q2, 8),
      mdeProvenance: 'the SMALLEST cross-arm difference the #173 census itself published on this '
        + 'column (prod vs v1/v2), read from the committed artifact',
      firstReceptionsPerSeed: round(frPerSeed, 4), mIid: round(mIid(p0q2, p1q2), 1),
      mReq: round(mReqQ2, 1), n: nQ2,
    },
    binding: nQ1 >= nQ2 ? 'q1TrueHoldable' : 'q2PressedFirstReception',
    nRaw,
    batteryRoom: BATTERY_ROOM,
    roomBinds: nRaw > BATTERY_ROOM,
    nCap: N_CAP,
    capBinds: nRaw > N_CAP,
    capForkNote: nRaw > N_CAP
      ? '⚠ THE CAP BINDS: the rule asks for more seeds than the CTB-T1 precedent cap. This is a '
        + 'FORK for the commander (spend the wall, or accept a smaller MDE than the rule asks '
        + 'for) — NOT a re-cut, and the probe does not resolve it.'
      : 'the cap does not bind at this reading',
    nStar,
    batteryBlock: `${BATTERY_BASE}..${BATTERY_BASE + nStar - 1}`,
    costNote: '⭐ BUDGET IT (#228.4): an ARMED, percept-armed battery costs ≈1.4× the wall of a '
      + 'CTB-T1-shaped one (~40–45 % overhead, all of it the percept pull).',
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
  console.error(`OBM-T1 FATAL — full mode needs the committed artifacts for the N rule (${O2T1_PATH}).`);
  process.exit(2);
}

banner('');
banner('=============================================================================');
banner(`OBM-T1 POLICY EXAM (#228.6) · mode ${MODE} · N ${RUN_N} seeds × ${ARMS.length} arms`);
banner(`seeds ${RUN_BASE}..${RUN_BASE + RUN_N - 1} · world = PERCEPT-ARMED (edsPerceivedChoice)`);
banner(`arms differ by EXACTLY the 16-weight matrix · domain [${OBM_WEIGHT_MIN}, ${OBM_WEIGHT_MAX}]`);
banner(`N rule ⇒ N* ${String(nRule.nStar)} (ledger room ${BATTERY_ROOM}, cap ${N_CAP})`);
if (OVERRIDDEN) {
  banner('⚠ OVERRIDE IN FORCE (OBMT1_N / OBMT1_SKIP_FP) — routed onto the EXIT-SEMANTICS GUARD');
  banner(`  BLOCK ${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}; G-CLEAN-INVOCATION goes RED and this run`);
  banner('  adjudicates NOTHING.');
}
banner('=============================================================================');

/* ========================================================================== */
/* §11 CHECKPOINT / RESUME — RESILIENCE ONLY (#207 form)                       */
/* ========================================================================== */
const CKPT_PATH = process.env.OBMT1_CHECKPOINT ?? '/tmp/obm-t1-checkpoint.jsonl';
const RESUME = process.env.OBMT1_RESUME === '1';
const CHECKPOINTING = MODE === 'full';
const PROBE_SELF_PATH = 'scripts/probes/obm-t1-policy-exam.ts';
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
  console.error(`OBM-T1 FATAL — REFUSING TO RESUME: ${why}`);
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
  reproCtbT1: PerMatch[];
  dose: Record<ArmName, ReturnType<typeof doseRead>>;
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
  banner(`  pass ${pass} · ⭐ G-REPRO-CTBT1: block ${REPRO_CTBT1_BASE} (${REPRO_CTBT1_N} matches, `
    + 'CTB-T1 ABSENT world)...');
  const reproCtbT1: PerMatch[] = [];
  for (let i = 0; i < REPRO_CTBT1_N; i++) {
    reproCtbT1.push(walkSeed(REPRO_CTBT1_BASE + i, 'reproCtbT1Absent'));
  }
  banner(`  pass ${pass} · delivered-dose read (seed ${DOSE_READ_SEED}, ${ARMS.length} arms)...`);
  const dose = Object.fromEntries(ARMS.map((a) => [a, doseRead(a)])) as Core['dose'];
  return { byArm, reproO2, repro173, reproGgc, reproCtbT1, dose, restored, computed };
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

  /* --- ⭐ G-REPRO-CTBT1: THIS PROBE *IS* THE CTB-T1 INSTRUMENT, proved row by row -------- */
  /** The committed CTB-T1 battery artifact publishes per-match rows for its ABSENT arm. This
   *  probe re-walks the first `REPRO_CTBT1_N` of them in CTB-T1's OWN world and must reproduce
   *  every published field EXACTLY — including the whole-match SIGNATURE (which carries the
   *  rng stream state), so this is not a comparison of summaries but of worlds. Targets are
   *  READ from the artifact, never typed. */
  const ctbT1Committed = CTBT1 === null ? [] : (CTBT1.j.perMatch.absent as any[]);
  const CTBT1_FIELDS = [
    'seed', 'eligible', 'trueHoldable', 'firstRecOpen', 'firstRecOpenPressed',
    'possTicks', 'possTicksShort', 'possTicksPressed', 'possTicksPressedShort',
    'firstRecShort', 'firstRecPressedShort', 'supportTicks', 'supportTicksShifted',
    'clampXBound', 'clampYBound', 'interceptions', 'offsides', 'goals',
    'ticksWalked', 'signature',
  ] as const;
  const ctbT1Rows = core.reproCtbT1.map((r, i) => {
    const want = ctbT1Committed[i];
    const got: Record<string, unknown> = {
      seed: r.seed, eligible: r.eligible, trueHoldable: r.trueHoldable,
      firstRecOpen: r.firstRecOpen, firstRecOpenPressed: r.firstRecOpenPressed,
      possTicks: r.possTicks, possTicksShort: r.possTicksShort,
      possTicksPressed: r.possTicksPressed, possTicksPressedShort: r.possTicksPressedShort,
      firstRecShort: r.firstRecShort, firstRecPressedShort: r.firstRecPressedShort,
      supportTicks: r.supportTicks, supportTicksShifted: r.supportTicksShifted,
      clampXBound: r.clampXBound, clampYBound: r.clampYBound,
      interceptions: r.interceptions, offsides: r.offsides, goals: r.goals,
      ticksWalked: r.ticksWalked, signature: r.signature,
    };
    const differing = want === undefined ? [...CTBT1_FIELDS]
      : CTBT1_FIELDS.filter((k) => JSON.stringify(got[k]) !== JSON.stringify(want[k]));
    return { seed: r.seed, differingFields: differing, got };
  });
  const ctbT1Mismatches = ctbT1Rows.filter((x) => x.differingFields.length > 0);

  return {
    arms: Object.fromEntries(ARMS.map((a) => [a, armSummary(core.byArm[a])])),
    deliveredDose: core.dose,
    contrasts: bootstrapAll(core.byArm),
    gReproCtbT1: {
      block: `${REPRO_CTBT1_BASE}..${REPRO_CTBT1_BASE + REPRO_CTBT1_N - 1}`,
      source: CTBT1_PATH,
      sourceArm: 'absent',
      sourceResultSha: CTBT1 === null ? null : CTBT1.j.resultSha256,
      world: 'CTB-T1\'s OWN ABSENT world — the bare production-shaped match (no flags), which '
        + 'is NOT this exam\'s percept-armed world. The receipt walk runs in ITS SOURCE\'s '
        + 'world, exactly like the other three.',
      fieldsPerRow: CTBT1_FIELDS.length,
      rowsChecked: ctbT1Rows.length,
      committedRowsAvailable: ctbT1Committed.length,
      mismatches: ctbT1Mismatches.length,
      mismatchRows: ctbT1Mismatches,
      identical: ctbT1Rows.length > 0 && ctbT1Mismatches.length === 0
        && ctbT1Committed.length >= ctbT1Rows.length,
      note: '⭐ THE INHERITANCE CLAIM, PROVED: "the CTB-T1 instrument set inherited whole" is '
        + 'not a statement about how this file was written — it is a re-walk of the committed '
        + 'CTB-T1 battery block\'s first rows, field for field INCLUDING the whole-match '
        + 'signature (rng stream state inside). A single changed instrument constant, sampling '
        + 'rule or walk order reds this gate. The block rides as a RECEIPT re-walk only — never '
        + 'fresh data for this exam.',
    },
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
banner(`  [obm-t1] pass 1 digest ${digestA} — X-DET second pass...`);
const coreB = computeCore(2);
const bodyB = coreBody(coreB);
const digestB = sha(canonical(bodyB));
const xDet = digestA === digestB;
banner(`  [obm-t1] pass 2 digest ${digestB} — X-DET ${xDet ? 'PASS' : 'FAIL'}`);

/* --- X-FP-PROD, recomputed in-probe (#181.2) ------------------------------- */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const fpObserved = SKIP_FP ? 'skipped (OBMT1_SKIP_FP)' : leagueHash(FINGERPRINT_SEED);
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

/** ⭐ THE BATTERY BLOCK IS NOW N-DERIVED (the ruled amendment), so its clash-freedom is CHECKED
 *  rather than pinned to a typed end-seed: it must clear the guard block below and the next
 *  consumed interval above. */
const batteryN = nRule.nStar ?? 0;
const batteryLast = BATTERY_BASE + batteryN - 1;
const ledgerHits = (first: number, last: number): string[] => CONSUMED
  .filter((c) => !(last < c.range[0] || first > c.range[1])).map((c) => c.name);
/** ⭐ EVERY BLOCK THIS STAGE TOUCHES, MACHINE-CHECKED — not just the exam one (the pre-battery
 *  correction). Three kinds, each with its OWN predicate, because they are not the same claim:
 *   · `fresh`    — data this run creates and reads as evidence (the exam walk AND the DECLARED
 *                  delivered-dose read). MUST be clash-free against the complete ledger.
 *   · `reserved` — declared for this stage and walked by nothing yet (the exit-semantics guard
 *                  block, the N-derived battery block). MUST also be clash-free.
 *   · `re-walk`  — a DELIBERATE receipt walk of a SOURCE's own committed block (all FOUR of
 *                  them). Its overlap with the ledger IS THE POINT, so the predicate inverts:
 *                  it must land INSIDE a consumed interval, and a re-walk that came back
 *                  clash-free would mean it is walking fresh seeds and is NOT a receipt.
 *  The stage's own (fresh + reserved) blocks must additionally be pairwise disjoint. */
type BlockKind = 'fresh' | 'reserved' | 're-walk';
const walkedBlocksRaw: { name: string; first: number; last: number; kind: BlockKind }[] = [
  { name: 'exam', first: RUN_BASE, last: RUN_BASE + RUN_N - 1, kind: 'fresh' },
  {
    name: 'deliveredDoseRead (the DECLARED fourth block, observational)',
    first: DOSE_READ_SEED, last: DOSE_READ_SEED, kind: 'fresh',
  },
  {
    name: 'exitSemanticsGuard (reserved)',
    first: GUARD_BLOCK[0], last: GUARD_BLOCK[1], kind: 'reserved',
  },
  { name: 'battery (reserved, N-derived)', first: BATTERY_BASE, last: batteryLast, kind: 'reserved' },
  {
    name: 'reproO2 (re-walk)',
    first: REPRO_O2_BASE, last: REPRO_O2_BASE + REPRO_O2_N - 1, kind: 're-walk',
  },
  {
    name: 'repro173 (re-walk)',
    first: REPRO173_BASE, last: REPRO173_BASE + REPRO173_N - 1, kind: 're-walk',
  },
  {
    name: 'reproGgc (re-walk)',
    first: REPRO_GGC_BASE, last: REPRO_GGC_BASE + REPRO_GGC_N - 1, kind: 're-walk',
  },
  {
    name: 'reproCtbT1 (re-walk)',
    first: REPRO_CTBT1_BASE, last: REPRO_CTBT1_BASE + REPRO_CTBT1_N - 1, kind: 're-walk',
  },
];
const walkedBlocks = walkedBlocksRaw.map((b) => {
  const ledgerCollisions = ledgerHits(b.first, b.last);
  return {
    ...b,
    seeds: b.last - b.first + 1,
    ledgerCollisions,
    /** re-walks must HIT their source; fresh and reserved blocks must hit nothing. */
    ok: b.kind === 're-walk' ? ledgerCollisions.length > 0 : ledgerCollisions.length === 0,
  };
});
const stageOwnBlocks = walkedBlocks.filter((b) => b.kind !== 're-walk');
/** ⭐ IDENTITY IS NOT OVERLAP — the full-mode predicate correction. In FULL mode the exam walk IS
 *  the redemption of the reserved battery block: `RUN_BASE === BATTERY_BASE` and `RUN_N` is the
 *  same N-derived count, so the `exam` row and the `battery (reserved, N-derived)` row are the
 *  SAME interval under two names — a reservation and the walk that consumes it — not two blocks
 *  colliding. The earlier cut compared the block against itself and went RED in full mode only
 *  (in smoke the exam block sits at SMOKE_BASE, a genuinely different interval, so the defect was
 *  invisible). CORRECTED PREDICATE: an overlapping pair is a FAILURE unless the two intervals are
 *  EXACTLY equal, in which case they are UNIFIED (recorded, not ignored). A PARTIAL overlap — an
 *  exam block that half-covers the reservation, or a reservation the walk outgrew — is a real
 *  defect and still fails, which is the whole load the check carries. */
const stageOwnPairs = stageOwnBlocks.flatMap((a, i) => stageOwnBlocks.slice(i + 1)
  .filter((b) => !(a.last < b.first || b.last < a.first))
  .map((b) => ({
    pair: `${a.name} × ${b.name}`,
    identical: a.first === b.first && a.last === b.last,
    intervals: [`${a.first}..${a.last}`, `${b.first}..${b.last}`],
  })));
const stageOwnUnified = stageOwnPairs.filter((p) => p.identical);
const stageOwnOverlaps = stageOwnPairs.filter((p) => !p.identical).map((p) => p.pair);
const blockFailures = walkedBlocks.filter((b) => !b.ok).map((b) => b.name);
const examCollisions = ledgerHits(RUN_BASE, RUN_BASE + RUN_N - 1);
const batteryCollisions = ledgerHits(BATTERY_BASE, batteryLast);
const subBlocksOrdered = SMOKE_BASE + SMOKE_N - 1 < DOSE_READ_SEED
  && DOSE_READ_SEED < GUARD_BLOCK[0]
  && GUARD_BLOCK[1] < BATTERY_BASE
  && batteryN > 0 && batteryLast < NEXT_CONSUMED_AFTER_BATTERY
  && batteryCollisions.length === 0;
const statsMinGap = Math.min(...PUBLISHED_STATS_BASES.map((b) => Math.abs(BOOTSTRAP_SEED - b)));

/* --- FLAG-HYGIENE + the in-battery identity arm ---------------------------- */
/** ⭐ THE ARM CONFIG ECHO + THE TWO-DOORS ASSERTION, taken off REAL constructed matches (not
 *  off the intent that built them): every arm must be percept-armed, must have `obmMovement`
 *  exactly where its matrix says, and must have `ctbSupportPlane` FALSE — everywhere. */
const armWorlds = Object.fromEntries(ARMS.map((a) => {
  const m = matchOf(RUN_BASE, a);
  const w = DOSE[a];
  return [a, {
    obmMovement: m.obmMovement,
    ctbSupportPlane: m.ctbSupportPlane,
    edsPerceivedChoice: m.edsPerceivedChoice,
    edsPerceivedDefence: m.edsPerceivedDefence,
    matrixPresentOnAllViews: genesOnAllViews(m),
    matrixNonZeroSlots: w === null ? 0 : w.filter((v) => v !== 0).length,
    matrixReadBack: offballMovementWeightVector(m.teams[0].genome),
  }];
}));
const twoDoors = {
  ctbSupportPlaneFalseInEveryArm: ARMS.every((a) => (armWorlds as any)[a].ctbSupportPlane === false),
  perceptArmedInEveryArm: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true),
  obmFlagMatchesMatrix: ARMS.every((a) => (armWorlds as any)[a].obmMovement === (DOSE[a] !== null)),
  matrixOnAllViewsWhereArmed: ARMS.every((a) => (armWorlds as any)[a].matrixPresentOnAllViews
    === (DOSE[a] !== null)),
  declaration: '⭐ THE TWO-DOORS DECLARATION, ASSERTED NOT STATED (#228 / OBM-T0 §LAW 6): each '
    + 'seam keeps its OWN arming door. `ctbSupportPlane` is FALSE in every arm of this exam, so '
    + 'the policy\'s INTERCEPT is a hard 0 and what is dosed here is the DYNAMIC term ALONE, on '
    + 'the incumbent `supportSpot` geometry as its zero point. The banked static plane (#224) is '
    + 'NOT this exam\'s question and cannot leak in through the OBM door — that identity is the '
    + 'fix G-CROSS certified at T0, and this row is its T1 receipt.',
};
const armConfigEcho = Object.fromEntries(ARMS.map((a) => [a, {
  obmMovement: DOSE[a] !== null,
  ctbSupportPlane: false,
  edsPerceivedChoice: true,
  matrix: DOSE[a],
}]));
/** ⚠ CORRECTED AFTER A GUARD-BLOCK RUN (recorded, not rewritten — the CTB-T0 §DEV form):
 *  `genesOnAllViews` is the ARM'S OWN DEFINITION (ARMED-ZERO has both genes present AT
 *  ZERO; ABSENT has none) and is excluded from the identity comparison. It is not a world
 *  quantity: it is the very fact that makes this the G-ZERO arm — the arms differ in CODE
 *  PATH and in GENE STATE, and the identity is over everything the world produced. Every
 *  other measured field, and the whole-match signature INCLUDING the rng stream, is
 *  compared. */
const IDENTITY_EXCLUDED_FIELDS = [
  'genesOnAllViews', 'policyCacheEntries',
  'supportTicksPlanePresent', 'supportTicksPlaneAbsent', 'supportTicksPlaneZero',
] as const;
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
/** every non-zero slot must be a DOMAIN CORNER (±1), and every matrix must be full length. */
const doseWellFormed = ARMS.filter((a) => DOSE[a] !== null).every((a) => {
  const w = DOSE[a] as number[];
  return w.length === OBM_WEIGHT_SLOTS
    && w.every((v) => v === 0 || v === OBM_WEIGHT_MIN || v === OBM_WEIGHT_MAX);
});
const flagHygiene = {
  pass: identityRows.every((x) => x.signatureIdentical && x.rowIdentical)
    && DOSE[CONTROL_ARM] === null
    && ARMS.filter((a) => a !== CONTROL_ARM).every((a) => DOSE[a] !== null)
    && (DOSE.armedZero as number[]).every((v) => v === 0)
    && ARMS.filter((a) => a !== CONTROL_ARM && a !== 'armedZero')
      .every((a) => (DOSE[a] as number[]).some((v) => v !== 0))
    && doseWellFormed
    && twoDoors.ctbSupportPlaneFalseInEveryArm && twoDoors.perceptArmedInEveryArm
    && twoDoors.obmFlagMatchesMatrix && twoDoors.matrixOnAllViewsWhereArmed,
  doseWellFormed,
  twoDoors,
  armWorlds,
  armConfigEcho,
  identityRows,
  identityExcludedFields: IDENTITY_EXCLUDED_FIELDS,
  identityExcludedWhy: 'the five excluded fields ARE the arm definition or its code-path '
    + 'signature — whether the matrix is on the genome views, how many entries the policy cache '
    + 'holds, and the three PLANE-PRESENCE classes (present / absent / zero), which exist only '
    + 'in the armed arms because only there is a plane ever written. They are config echoes and '
    + 'code-path receipts, not world quantities. EVERYTHING the world produced — every ruler, '
    + 'every guard, every geometric quantity, the metre-shift sums AND the whole-match signature '
    + 'including the rng stream state — is compared. Excluded and stated, never quietly dropped.',
  note: 'the arms differ by EXACTLY the 16-weight matrix (the `obmMovement` MatchConfig flag + '
    + 'the matrix on all three genome views of both teams); everything else — world (percept-'
    + 'armed, identically), seeds, teams, duration, and `ctbSupportPlane` false throughout — is '
    + 'identical by construction. ARMED-ZERO ≡ ABSENT is proved per seed on the whole-match '
    + 'signature INCLUDING the rng stream state, AND on every measured row field.',
};

/* --- G-ARM: the SEAT is REACHED, and it delivers exactly what it should ----- */
/** the delivered-dose read of PASS 1 (X-DET re-derives it identically in pass 2). */
const core0Dose = coreA.dose;
/** ⭐ WHICH HALF OF THE SEAT DOES THIS ARM DOSE? The matrix has FOUR output rows: two drive
 *  the PLANE (geometry) and two drive the two candidate SCORES. An arm that doses only the
 *  score rows must move NO geometry — and an arm that doses only the plane rows must leave
 *  both multipliers at exactly 1. G-ARM checks delivery on the axes the arm doses AND
 *  silence on the axes it does not; reading "no shift" as "dead seam" without asking which
 *  rows are dosed would have been exactly the wrong inference. */
const dosesRow = (a: ArmName, o: number): boolean => {
  const w = DOSE[a];
  if (w === null) return false;
  for (let f = 0; f < OBM_FEATURE_KEYS.length; f++) if (w[IDX(o, f)] !== 0) return true;
  return false;
};
const dosesPlaneOf = (a: ArmName): boolean => dosesRow(a, O_DEPTH) || dosesRow(a, O_WIDTH);
const dosesScoreOf = (a: ArmName): boolean => dosesRow(a, O_SUPPORT) || dosesRow(a, O_RUN);
const gArmRows = Object.fromEntries(ARMS.map((a) => {
  const rows = coreA.byArm[a];
  const armed = DOSE[a] !== null;
  const dosedNonZero = armed && (DOSE[a] as number[]).some((v) => v !== 0);
  const dosesPlane = dosesPlaneOf(a);
  const dosesScore = dosesScoreOf(a);
  const sum = (f: (r: PerMatch) => number): number => rows.reduce((s, r) => s + f(r), 0);
  const supportTicks = sum((r) => r.supportTicks);
  const shifted = sum((r) => r.supportTicksShifted);
  const planePresent = sum((r) => r.supportTicksPlanePresent);
  const planeAbsent = sum((r) => r.supportTicksPlaneAbsent);
  const planeZero = sum((r) => r.supportTicksPlaneZero);
  const unshiftedClampBound = sum((r) => r.supportTicksUnshiftedClampBound);
  const cacheEntries = sum((r) => r.policyCacheEntries);
  const dose = core0Dose[a];
  const mulNeutral = (d: { mean: number; min: number; max: number }): boolean =>
    d.mean === 1 && d.min === 1 && d.max === 1;
  return [a, {
    armed,
    dosedNonZero,
    dosesPlane,
    dosesScore,
    supportMulNeutral: mulNeutral(dose.supportMul),
    runMulNeutral: mulNeutral(dose.runMul),
    supportMulSpread: [dose.supportMul.min, dose.supportMul.max],
    runMulSpread: [dose.runMul.min, dose.runMul.max],
    seedsWithSupportTicks: rows.filter((r) => r.supportTicks > 0).length,
    /* ⭐ THE SEAT REACHED: the brain entered its fork and wrote policies, on every seed. */
    policyCacheEntries: cacheEntries,
    seedsWithPolicyWrites: rows.filter((r) => r.policyCacheEntries > 0).length,
    supportTicks,
    planePresent,
    planeAbsent,
    planeZero,
    supportTicksShifted: shifted,
    supportTicksUnshiftedClampBound: unshiftedClampBound,
    zeroPlaneMoved: sum((r) => r.supportTicksZeroPlaneMoved),
    /** the four classes must partition the support ticks EXACTLY — no residue, no tolerance. */
    partitionExact: supportTicks === planeAbsent + planeZero + shifted + unshiftedClampBound,
    zeroShift: shifted === 0,
    genesOnAllViewsSeeds: sum((r) => r.genesOnAllViews),
    meanShiftMetres: round(sum((r) => r.supportShiftSum) / Math.max(1, supportTicks), 4),
    /* ⭐ FEATURES NON-DEGENERATE (the delivered-dose read, same world in every arm) */
    doseSawSnapshotShare: dose.sawSnapshotShare,
    doseSomeFeatureNonZeroShare: dose.someFeatureNonZeroShare,
    doseFeatureMeans: dose.featureMeans,
    semantics: '⭐ DELIVERY ON THE AXES THIS ARM DOSES, AND SILENCE ON THE ONES IT DOES NOT. '
      + 'ARMED arms: the seat must be REACHED (policy-cache writes > 0 on every seed, the matrix '
      + 'on all six genome views) and every support tick must fall in exactly one of the four '
      + 'accounted classes — SHIFTED · PLANE-ZERO · PLANE-ABSENT (the TTL cadence cap) · '
      + 'UNSHIFTED-CLAMP-BOUND. An arm that doses a PLANE row must SHIFT geometry; an arm that '
      + 'does NOT dose a plane row must shift EXACTLY NOTHING. An arm that doses a SCORE row '
      + 'must produce a non-neutral multiplier; an arm that does not must leave both multipliers '
      + 'at EXACTLY 1. ARMED-ZERO therefore has to be silent on all four axes with its planes '
      + 'PRESENT — that is the identity, and it is the strongest statement in this table. ABSENT '
      + 'never writes a policy at all. ⚠ NOTE ON PLANE-ZERO: a plane of exactly (0,0) means the '
      + 'DOSED FEATURES read zero at that moment — for the f1 corners that is "the carrier is '
      + 'not perceived-pressed", i.e. the CONCENTRATION the hypothesis predicts, NOT blindness. '
      + 'Genuine blindness is BOUNDED ABOVE by the delivered-dose read\'s `allFeaturesZeroShare` '
      + '(~1 % of samples) — that share is every sample whose four features all read zero, which '
      + 'INCLUDES samples with opponents present beyond the feature radii, so it is a ceiling on '
      + 'blindness and not a measurement of it.',
  }];
}));
const gArmPass = ARMS.every((a) => {
  const g = (gArmRows as any)[a];
  const featuresLive = g.doseSawSnapshotShare > 0 && g.doseSomeFeatureNonZeroShare > 0
    && (g.doseFeatureMeans as number[]).every((v) => v > 0);
  if (!featuresLive || !g.partitionExact || g.zeroPlaneMoved !== 0) return false;
  if (g.seedsWithSupportTicks !== RUN_N) return false;
  if (!g.armed) {
    // ABSENT: no flag, no matrix, no policy anywhere, no shift anywhere, no modulation.
    return g.zeroShift && g.policyCacheEntries === 0 && g.planePresent === 0
      && g.genesOnAllViewsSeeds === 0 && g.supportMulNeutral && g.runMulNeutral;
  }
  // ARMED: the seat is reached on EVERY seed and the matrix is on all six views.
  if (g.seedsWithPolicyWrites !== RUN_N || g.genesOnAllViewsSeeds !== RUN_N) return false;
  if (g.planePresent === 0) return false;
  // the PLANE half: dosed ⇒ geometry moves; undosed ⇒ geometry is EXACTLY untouched.
  if (g.dosesPlane ? !(g.supportTicksShifted > 0) : !g.zeroShift) return false;
  // the SCORE half: dosed ⇒ at least one multiplier leaves 1; undosed ⇒ both are EXACTLY 1.
  const scoreDelivered = !g.supportMulNeutral || !g.runMulNeutral;
  return g.dosesScore ? scoreDelivered : (g.supportMulNeutral && g.runMulNeutral);
});

/* --- ⭐ G-BLIND-WORLD (the #228.6 HARD gate): the percept trunk is LIVE ------ */
/** A blind body has no policy, so a blind world would silently UNDELIVER the treatment and
 *  every arm would read as ABSENT. This gate refuses to let that pass as a null result: the
 *  trunk must be armed in EVERY arm's constructed world, and the features it feeds must be
 *  non-degenerate in the delivered-dose read — snapshots exist, opponents are perceived, and
 *  every one of the four feature means is strictly positive. */
const gBlindWorld = {
  perceptFlagsEveryArm: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true),
  minimalArmingRationale: '⭐ `edsPerceivedChoice` ALONE is the minimal arming that makes the '
    + 'seat see: `refreshPerception` runs on `edsPerceivedDefence || edsPerceivedChoice || '
    + 'stationEye`, but a body\'s snapshot PLAYERS are reconstructed from his RECORDED SCAN '
    + 'MOMENTS, which are recorded only under `edsPerceivedChoice || stationEye`. Arming the '
    + 'DEFENCE flag alone therefore yields a memory with no scan frames — every body believes '
    + 'he is alone, all four features read exactly zero, and the treatment is undelivered while '
    + 'looking armed. ⚠ DECLARED COST: the choice flag also moves the CARRIER onto the '
    + 'perceived-snapshot pass chooser, so this world is NOT CTB-T1\'s bare world and the two '
    + 'exams\' ABSOLUTE levels are not comparable. All eight arms share it exactly, so the '
    + 'PAIRED contrast is unaffected.',
  perArm: Object.fromEntries(ARMS.map((a) => [a, {
    sawSnapshotShare: core0Dose[a].sawSnapshotShare,
    someFeatureNonZeroShare: core0Dose[a].someFeatureNonZeroShare,
    allFeaturesZeroShare: core0Dose[a].allFeaturesZeroShare,
    featureMeans: core0Dose[a].featureMeans,
    featureKeys: OBM_FEATURE_KEYS,
  }])),
  /** ⚠ THE PREDICATE, RE-CUT TO WHAT IT MEASURES (pre-battery correction, no level moves): the
   *  third limb was named `sawPerceivedOpponentShare > 0` and read as "opponents are perceived".
   *  It is `someFeatureNonZeroShare > 0` — at least one of the four features is non-zero on at
   *  least one sample — which is exactly the NON-DEGENERACY this gate needs and nothing more.
   *  The complement `allFeaturesZeroShare` is published as an UPPER BOUND on genuine blindness. */
  predicate: 'edsPerceivedChoice TRUE in every arm\'s CONSTRUCTED world · sawSnapshotShare > 0 · '
    + 'someFeatureNonZeroShare > 0 (at least one of the four features non-zero) · all four '
    + 'feature MEANS strictly positive. ⚠ NOT a claim that opponents were perceived on any '
    + 'particular sample: `allFeaturesZeroShare` bounds genuine blindness from ABOVE, because '
    + 'four zero features also occur with opponents present beyond the feature radii.',
  pass: ARMS.every((a) => (armWorlds as any)[a].edsPerceivedChoice === true
    && core0Dose[a].sawSnapshotShare > 0
    && core0Dose[a].someFeatureNonZeroShare > 0
    && core0Dose[a].featureMeans.every((v) => v > 0)),
};

/* --- ⭐ G-FORK-TOKENS: the #228.5(b) debt PAID (instrument-side completion) --- */
/** OBM-T0's fork inventory grep missed two of the seat's own src symbols — `obmOffballPolicy`
 *  (the call site) and `OBM_POLICY_TTL_TICKS` (the cadence cap). Ruling #228.5(b) records the
 *  completion as riding OBM-T1. It is INSTRUMENT-SIDE ONLY: the token set is widened, every
 *  occurrence is enumerated and classified, and NOT ONE src byte moves. */
const srcTsFiles = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const full = `${dir}/${e}`;
  return statSync(full).isDirectory() ? srcTsFiles(full) : full.endsWith('.ts') ? [full] : [];
});
const OBM_TOKENS = /obmMovement|obmPlane|offballMovementWeights|ObmPlane|obmPolicies|setObmPolicy|obmSupportMul|obmRunMul|obmOffballPolicy|OBM_POLICY_TTL_TICKS/;
const forkSites = (() => {
  const sites: { file: string; line: number; kind: string; text: string }[] = [];
  for (const f of srcTsFiles('src')) {
    readFileSync(f, 'utf8').split('\n').forEach((raw, i) => {
      const t = raw.trim();
      if (!OBM_TOKENS.test(t)) return;
      if (t.startsWith('*') || t.startsWith('//') || t.startsWith('/*')) return;
      const kind = /^if \(match\.obmMovement\) \{$/.test(t) ? 'FLAG_FORK_SCORE'
        : /^const obmPlane = match\.obmMovement \? match\.obmPlaneFor\(p\) : null;$/.test(t)
          ? 'FLAG_FORK_PLANE'
          : /^if \(obmPlane !== null\) target = supportSpotOnObmPlane/.test(t) ? 'PLANE_APPLY'
            : /^readonly obmMovement: boolean;$/.test(t) ? 'FIELD'
              : /^obmMovement\?: boolean;$/.test(t) ? 'CONFIG'
                : /this\.obmMovement = cfg\.obmMovement \?\? false;/.test(t) ? 'INIT'
                  : /'obmMovement'/.test(t) ? 'UNION_KEY'
                    : /^offballMovementWeights\?: number\[\];$/.test(t) ? 'GENE_DECL'
                      : /OBM_POLICY_TTL_TICKS/.test(t) ? 'CADENCE_CAP'
                        : /obmOffballPolicy/.test(t) ? 'SEAT_CALL'
                          : /obmPolicies/.test(t) ? 'POLICY_CACHE'
                            : /^match\.setObmPolicy\(p\.gid, obm\.plane\);$/.test(t) ? 'POLICY_WRITE'
                              : /^setObmPolicy|^obmPlaneFor/.test(t) ? 'ACCESSOR'
                                : /^let obm(Support|Run)Mul = 1;$/.test(t) ? 'SCORE_MUL_NEUTRAL'
                                  : /^obm(Support|Run)Mul = obm\.(support|run)Mul;$/.test(t) ? 'SCORE_MUL_SET'
                                    : /^s \*= obm(Support|Run)Mul;$/.test(t) ? 'SCORE_APPLY'
                                      : /offballMovementWeights/.test(t) ? 'GENE_RW'
                                        : /ObmPlane/.test(t) ? 'TYPE'
                                          : /obmPlane/.test(t) ? 'PLANE_PARAM' : 'OTHER';
      sites.push({ file: f, line: i + 1, kind, text: t });
    });
  }
  return sites;
})();
const kindCount = (k: string): number => forkSites.filter((s) => s.kind === k).length;
const gForkTokens = {
  tokenSet: OBM_TOKENS.source,
  tokensAddedHere: ['obmOffballPolicy', 'OBM_POLICY_TTL_TICKS'],
  debtPaid: '#228.5(b) — OBM-T0\'s inventory could not see the seat\'s CALL SITE or its CADENCE '
    + 'CAP, so neither was enumerated. Both are now their own classes (SEAT_CALL, CADENCE_CAP). '
    + 'INSTRUMENT-SIDE ONLY: no src byte moves (X-SRC-UNTOUCHED is a separate HARD gate).',
  occurrences: forkSites.length,
  byKind: Object.fromEntries([...new Set(forkSites.map((s) => s.kind))].sort()
    .map((k) => [k, kindCount(k)])),
  sites: forkSites,
  unclassified: forkSites.filter((s) => s.kind === 'OTHER'),
  pass: kindCount('FLAG_FORK_SCORE') === 1 && kindCount('FLAG_FORK_PLANE') === 1
    && kindCount('PLANE_APPLY') === 1 && kindCount('SCORE_APPLY') === 2
    && kindCount('SCORE_MUL_NEUTRAL') === 2 && kindCount('SCORE_MUL_SET') === 2
    && kindCount('POLICY_WRITE') === 1
    && kindCount('SEAT_CALL') >= 1 && kindCount('CADENCE_CAP') >= 1
    && kindCount('OTHER') === 0
    && forkSites.some((s) => s.kind === 'FLAG_FORK_SCORE' && s.file.endsWith('PlayerBrain.ts'))
    && forkSites.some((s) => s.kind === 'FLAG_FORK_PLANE' && s.file.endsWith('actionExecutor.ts')),
};

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
    note: 'INSTRUMENT-ONLY ROUND: the eyes seat is banked (600ff04, ruling #228); this round '
      + 'changes no engine byte. The #228.5(b) fork-token completion is instrument-side.',
  },
  gReproCtbT1: {
    pass: bodyA.gReproCtbT1.identical,
    block: bodyA.gReproCtbT1.block, source: CTBT1_PATH,
    sourceResultSha: bodyA.gReproCtbT1.sourceResultSha,
    rowsChecked: bodyA.gReproCtbT1.rowsChecked, fieldsPerRow: bodyA.gReproCtbT1.fieldsPerRow,
    mismatches: bodyA.gReproCtbT1.mismatches,
    sourceSha256: CTBT1 === null ? null : sha(CTBT1.bytes.toString('utf8')),
  },
  gBlindWorld,
  gForkTokens,
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
    pass: blockFailures.length === 0 && stageOwnOverlaps.length === 0
      && examCollisions.length === 0 && subBlocksOrdered,
    walkedBlocks,
    blockFailures,
    stageOwnOverlaps,
    stageOwnUnified,
    stageOwnOverlapSemantics: '⭐ a stage-own pair FAILS when its intervals intersect UNLESS they '
      + 'are EXACTLY equal (same first AND same last), in which case the two rows are ONE block '
      + 'under two names and are recorded in `stageOwnUnified` instead. This is the FULL-mode '
      + 'reality: the exam walk redeems the reserved battery block (RUN_BASE === BATTERY_BASE, '
      + 'same N-derived count), so a reservation and the walk that consumes it are not two blocks '
      + 'clashing. PARTIAL overlap still FAILS — an exam block that half-covers the reservation '
      + '(or outgrows it) is a genuine ledger defect and is exactly what this check is for.',
    examCollisions,
    subBlocksOrdered,
    batteryCollisions,
    subBlocks: {
      smoke: `${SMOKE_BASE}..${SMOKE_BASE + SMOKE_N - 1}`,
      deliveredDoseRead: `${DOSE_READ_SEED}`,
      exitSemanticsGuard: `${GUARD_BLOCK[0]}..${GUARD_BLOCK[1]}`,
      battery: `${BATTERY_BASE}..${batteryLast}`,
      batteryN,
      batteryRoom: BATTERY_ROOM,
      nextConsumedAfterBattery: NEXT_CONSUMED_AFTER_BATTERY,
    },
    coverageNote: '⭐ EVERY BLOCK THIS STAGE TOUCHES IS MACHINE-CHECKED HERE (the pre-battery '
      + 'correction; the earlier cut computed only four walked blocks and left the DECLARED '
      + 'delivered-dose read, the reserved guard and battery blocks and the CTB-T1 re-walk out '
      + 'of the machine check): 2 FRESH (exam · delivered-dose read) + 2 RESERVED (guard · '
      + 'battery) + 4 RE-WALKS (O2-T1 · #173 · GGC · ⭐ CTB-T1).',
    reproBlocksNote: 'the FOUR repro blocks (O2-T1 · #173 · GGC · ⭐ CTB-T1) are DELIBERATE '
      + 're-walks of the SOURCES\' own committed blocks — receipts, never fresh data — so their '
      + 'overlap with the ledger is THE POINT and their predicate is INVERTED: each must land '
      + 'INSIDE a consumed interval (`ledgerCollisions` NON-EMPTY), and a re-walk that came back '
      + 'clash-free would prove it is walking fresh seeds instead of reproducing a receipt. The '
      + 'FRESH blocks (exam, delivered-dose read) and the RESERVED ones (guard, battery) carry '
      + 'the ordinary predicate: `ledgerCollisions` EMPTY, and pairwise disjoint from each other '
      + '(`stageOwnOverlaps`).',
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
    note: 'any OBMT1_N / OBMT1_SKIP_FP override is BY DEFINITION not the exam: the run is routed '
      + 'onto the exit-semantics guard block, this gate goes RED and the process exits 1.',
  },
};
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass === true);

/* ========================================================================== */
/* §15 THE ARTIFACT — hashed body vs UNHASHED envelope (#197-M1 / #198)        */
/* ========================================================================== */
const body = {
  stage: 'OBM T1 — THE POLICY EXAM (hand-dose the banked off-ball EYES seat at policy corners)',
  ruling: '#228.6 (the dispatch, under the live #225 self-drive arc) · OFFBALL-MOVEMENT-CONTRACT '
    + '§3 OBM-T1 · #228 (the banked seat) · #228.5 (the recorded debts; (b) paid here) · '
    + '#225.3(c) (per-dose STOP granularity) · #181.2 (the standing receipt rule)',
  doc: 'docs/world-model/OBM-T1-POLICY-EXAM.md',
  mode: MODE,
  block: `${RUN_BASE}..${RUN_BASE + RUN_N - 1}`,
  seeds: RUN_N,
  world: '⭐ ONE PERCEPT-ARMED BASE WORLD, IDENTICAL IN EVERY ARM: `new Match({seed, teamA, '
    + 'teamB, duration, edsPerceivedChoice: true})`. MINIMAL by construction — one flag, and the '
    + 'only one that arms BOTH halves of the percept chain (the refresh AND the scan-moment '
    + 'record); `edsPerceivedDefence` alone would leave every body believing he is alone (all '
    + 'four features exactly zero = the treatment undelivered), and a `stationEye` is a far '
    + 'larger intervention. ⚠ DECLARED: the choice flag also moves the CARRIER onto the '
    + 'perceived-snapshot pass chooser, so this is NOT CTB-T1\'s bare world and the two exams\' '
    + 'ABSOLUTE levels are not comparable; the PAIRED contrast is clean because all eight arms '
    + 'share this world exactly. Each G-REPRO walk runs in ITS SOURCE\'s own world.',
  armDefinitions: Object.fromEntries(ARMS.map((a) => [a, DOSE[a] === null
    ? 'ABSENT — no obmMovement flag, no matrix (the percept-armed world, seat unreached)'
    : `obmMovement:true · matrix [${(DOSE[a] as number[]).join(',')}] `
      + '(on all three genome views of BOTH teams — the real gene channel, #196.3-D6)'])),
  armRationale: {
    absent: 'the CONTROL — the same percept-armed world with the seat unreached.',
    armedZero: 'the IDENTITY arm — armed, matrix present, all sixteen slots at 0. Must be '
      + 'byte-identical to ABSENT per seed (the #228 fix makes this true regardless of anything '
      + 'else, and this is its T1 receipt).',
    checkWhenPressed: '⭐ the 回撤 hypothesis in POLICY form: plane depth driven NEGATIVE by f1 '
      + '(the carrier\'s plight) at full weight, everything else 0 — "when the man on the ball '
      + 'is in trouble, come short", and not otherwise. ⚠ f1 is the SCARCEST feature (mean '
      + '0.184), so this dose is small ON AVERAGE and large exactly where the carrier is '
      + 'pressed: that CONCENTRATION is the hypothesis, not a weakness of the dose.',
    checkAndShow: 'the same drop PLUS the demand: f1 also raises the SupportBallCarrier score. '
      + 'Real checking is movement AND an offer — the body who comes short also asks for it.',
    markerEscape: 'f2-driven: the tighter his own marker, the further he goes from where the '
      + 'marker wants him — FORWARD (spin in behind) and WIDE. f2 is the LARGEST feature (0.456), '
      + 'so this is the biggest delivered dose among the single-family corners.',
    spaceSeek: 'f3-driven: congestion at his OWN candidate point widens him and drops him off '
      + 'it — "if the spot you were going to is crowded, do not go there". (f3 RISES with '
      + 'tightness; the SIGNS are what say "go where it is empty".)',
    staleCaution: 'f4-driven: the AGE of his own readings pulls BOTH candidate scores down — '
      + '"if your picture is old, do not gamble". The fourth family is probed, not left dark.',
    kitchenSink: '⭐ the CEILING PROBE, stated honestly as one: all sixteen slots at a domain '
      + 'corner as one coherent instruction (come short · hold width · demand the ball · do not '
      + 'gamble on runs). It is the most movement this seat can express and is NOT a football '
      + 'recommendation; nothing about it is proposed for shipping.',
  },
  doseProvenance: 'every non-zero weight is a DOMAIN CORNER (±1) of the frozen signed domain '
    + `[${OBM_WEIGHT_MIN}, ${OBM_WEIGHT_MAX}] (= CTB_GENE_MIN/MAX, derived in code). NO bound is `
    + 're-cut and no number is invented. ⭐ THE CORNERS ARE DESIGNED AGAINST THE OBSERVED FEATURE '
    + 'DISTRIBUTION (#228.6: f1 0.184 · f2 0.456 · f3 0.216 · f4 0.171), never against the weight '
    + 'domain alone — see `deliveredDose` for what each arm ACTUALLY delivered.',
  twoDoorsDeclaration: '⭐ `ctbSupportPlane` is FALSE in EVERY arm (asserted per arm in '
    + 'gates.flagHygiene.twoDoors, not merely stated): the banked static bank is not this exam\'s '
    + 'question, the policy\'s INTERCEPT is a hard 0 by the #228 fix, and what is measured here '
    + 'is the DYNAMIC term ALONE on the incumbent geometry as its zero point.',
  preRegisteredSuccess: 'contract §3 OBM-T1, VERBATIM: "success = a policy dose moves ruler 1 or '
    + '2 resolvedly helpful with that dose\'s guards held (the #225.3(c) per-dose granularity '
    + 'verbatim)". Helpful = TRUE-holdable supply UP or pressed-first-reception DOWN. FAIL '
    + 'branches pre-named in the contract: F-OBM-a (no policy dose moves the supply — the '
    + 'receiver-side program itself is re-examined, the arc\'s honest death branch) · F-OBM-b/c '
    + '= F-CTB-b/c VERBATIM (clump/interception · offside/health). ⚠ THIS PROBE FIRES NONE OF '
    + 'THEM: it emits PER-ARM ROWS and paired deltas with mechanical `resolved` CI flags only '
    + '(#203); adjudication is the commander\'s.',
  preRegisteredStopGranularity: '⭐ FROZEN EX ANTE, INHERITED VERBATIM (#225.3(c); stage doc '
    + '§SUCCESS): F-OBM-b and F-OBM-c fire PER DOSE — a dose whose guard BREACHES (resolved AND '
    + 'beyond the frozen tolerance) is DISQUALIFIED as a candidate, and the ARC-level STOP fires '
    + 'only if EVERY dose that moves the primary ruler helpfully is disqualified. The DELIVERED '
    + 'reading is frozen with it: every row is read beside its DELIVERED dose (mean |plane '
    + 'shift|, the four support-tick classes, the clamp shares, the score-mul distributions), so '
    + 'a null result can never be read as a strong dose that failed when it was a weak dose that '
    + 'arrived. The band rule is frozen with it too: the equilibrium band GATES at battery N '
    + 'only; at any N the #198-form exclusion applies (dimensions the ABSENT arm itself fails are '
    + 'excluded AND disclosed). ⚠ THIS PROBE STILL FIRES NOTHING (#203) — this is the '
    + 'pre-registered GRANULARITY of the commander\'s own adjudication, recorded here so it '
    + 'cannot be re-cut after sight.',
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
    inheritance: '⭐ THE WHOLE SET IS CTB-T1\'s, and that is PROVED not asserted: G-REPRO-CTBT1 '
      + 're-walks the committed CTB-T1 battery block\'s first rows in CTB-T1\'s own ABSENT world '
      + 'and must reproduce every published field EXACTLY, whole-match signature included.',
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
    o(`    ${a.padEnd(16)} ${f(c.point).padStart(12)}`
      + (d === null ? '   (CONTROL)'
        : `   Δ ${String(d.point).padStart(11)} [${d.lower}, ${d.upper}] resolved=${c.resolved}`));
  }
};
o('');
o(`=== OBM-T1 POLICY EXAM · mode ${MODE} · ${body.block} (${RUN_N} seeds/arm, shared) ===`);
o(`world: PERCEPT-ARMED (edsPerceivedChoice) · ctbSupportPlane FALSE in every arm`);
o(`arms differ by EXACTLY the 16-weight policy matrix · Δ = ARM − ${CONTROL_ARM}`);
o(`estimator: paired seed-cluster bootstrap, ratio-of-totals, 2.5/97.5, ${BOOTSTRAP_RESAMPLES} `
  + `resamples, stats base ${BOOTSTRAP_SEED}`);
o('');
o('THE RULER');
rowLine('1  TRUE-holdable supply (share of eligible moments)', 'trueHoldableShare');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].ruler1TrueHoldable;
  o(`    ${a.padEnd(16)} n_true ${String(s.trueHoldableTotal).padStart(4)} / eligible ${s.eligibleTotal}`);
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
  o(`  ${a.padEnd(16)} goals ${String(g.goals).padStart(3)} · constructed≥3 `
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
    o(`    ${a.padEnd(16)} Δ ${String(r.deltaPp).padStart(7)} pp = ${(r.shareOfHeadroomConsumed * 100).toFixed(1)}%`
      + ` of the headroom · resolved=${r.resolved}`);
  }
}
o('');
o('THE SEAT, REACHED (G-ARM: the four support-tick classes partition exactly)');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].seam;
  o(`  ${a.padEnd(16)} supportTicks ${String(s.supportTicks).padStart(7)} · policyWrites `
    + `${String(s.policyCacheEntries).padStart(5)} · shifted ${String(s.supportTicksShifted).padStart(7)}`
    + ` · planeZero ${String(s.planeZeroTicks).padStart(7)} · planeAbsent ${String(s.planeAbsentTicks).padStart(7)}`
    + ` · clampBound ${String(s.supportTicksUnshiftedClampBound).padStart(5)}`
    + ` · partition=${s.partitionExact}`);
}
o('');
o('⭐ THE DELIVERED DOSE (dose ≠ delivered — read where the executor consumes it)');
for (const a of ARMS) {
  const s = (bodyA.arms as any)[a].seam;
  o(`  ${a.padEnd(16)} meanShift ${String(s.meanShiftMetres).padStart(8)} m · max `
    + `${String(s.maxShiftMetres).padStart(7)} m · moved ${pct(s.shiftedShareOfSupportTicks)}`
    + ` · ≥1 m ${pct(s.shiftGe1mShareOfSupportTicks)} · plane d/w `
    + `${String(s.meanPlaneDepthOnPresent).padStart(8)}/${String(s.meanPlaneWidthOnPresent).padStart(8)}`
    + ` · behindBall ${pct(s.behindBallShare)} · clampX ${pct(s.clampXShare)}`);
}
o('  the FEATURES and the SCORE MULTIPLIERS (observational read, seed '
  + `${DOSE_READ_SEED}, DESCRIPTIVE ONLY)`);
for (const a of ARMS) {
  const d = (bodyA as any).deliveredDose[a];
  o(`    ${a.padEnd(16)} f[${d.featureMeans.join(', ')}] · out[${d.outputMeans.join(', ')}]`
    + ` · supportMul ${d.supportMul.mean} [${d.supportMul.p05}, ${d.supportMul.p95}]`
    + ` · runMul ${d.runMul.mean} [${d.runMul.p05}, ${d.runMul.p95}]`
    + ` · zeroFeatureShare ${pct(d.allFeaturesZeroShare)}`);
}
o('');
o('THE GUARDS (tolerance = NI_FRACTION · |control level|, frozen ex ante)');
for (const g of guardRows) {
  o(`  ${g.key} [${g.family}, ${g.direction}] control ${g.controlLevel} · tol ±${g.toleranceAbs}`);
  for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
    const r = (g.arms as any)[a];
    o(`    ${a.padEnd(16)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
      + ` resolved=${r.resolved} beyondTol=${r.beyondTolerance} BREACH=${r.breach}`);
  }
}
o('  offsides/match (the #157 FLAG form — returns to the commander, flips no gate)');
for (const a of ARMS.filter((x) => x !== CONTROL_ARM)) {
  const r = (offsideRows as any)[a];
  o(`    ${a.padEnd(16)} Δ ${String(r.delta).padStart(11)} [${r.ci[0]}, ${r.ci[1]}]`
    + ` resolved=${r.resolved} resolvedIncrease=${r.resolvedIncrease}`);
}
o(`  equilibrium band — gated dimensions ${JSON.stringify(bandGated)}`
  + ` · EXCLUDED (control itself out of band) ${JSON.stringify(bandExcluded)}`);
for (const a of ARMS) {
  o(`    ${a.padEnd(16)} allGatedInBand=${(bandRows as any)[a].allGatedDimensionsInBand}`);
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
  o(`  DEFF source ${nr.deffProvenance}`);
  o(`  p0 source ${nr.sourceOfP0}`);
  o(`  binding ${nr.binding} · N_raw ${nr.nRaw} ⇒ N* ${nr.nStar} (ledger room ${nr.batteryRoom}, `
    + `binds=${nr.roomBinds} · cap ${nr.nCap}, binds=${nr.capBinds}) · battery block ${nr.batteryBlock}`);
  if (nr.capBinds) o(`  ⚠ ${nr.capForkNote}`);
}
o('');
o('GATES');
for (const [k, g] of Object.entries(gates)) o(`  ${k.padEnd(20)} ${(g as any).pass ? 'PASS' : '*** FAIL ***'}`);
o(`  ALL                ${allGatesPass ? 'PASS' : '*** FAIL ***'}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${Math.round(wallMs / 1000)} s (CONTEXT ONLY) · artifact ${OUT_PATH}`);
if (!allGatesPass || OVERRIDDEN) process.exitCode = 1;
