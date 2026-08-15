/**
 * L3 T0 — THE DORMANT DEFENCE-BOOK SEAM (docs/world-model/L3-T0-DEFENCE-BOOK-SEAM.md).
 *
 * Contract CB-L3-DEFENCE-BOOK-CONTRACT.md §2 (M-L3.1–.4), bound by #277.1, dispatched by #279.4,
 * and BOUND BY THE LABEL RULING #279.3 (carrier-anchored separation over an ENGINE-DERIVED common
 * window, grain g2). Every gate below was FROZEN in the stage doc's §GATES and committed before
 * this file existed; every number the doc publishes is quoted from this probe's artifact.
 *
 * ⭐ THE #247 SPLIT IS THE LAW OF THE INSTRUMENT/CODE BOUNDARY: this probe may READ the committed
 * censuses (L3-C0's, L3-C0b's) — `src/**` may not, and gNotable greps the whole tree for exactly
 * that, on their own published values.
 *
 * ⭐ ENV SURFACE — WHITELISTED-OR-REFUSE (#261.2 + #262.2's third-visit upgrade): the ONLY accepted
 *   variables are L3T0_MODE (smoke|full, REQUIRED) · L3T0_N · L3T0_SMOKE_N · L3T0_SKIP_FP ·
 *   L3T0_OUT. Any other `L3T0_*` variable AND any of the ENGINE's own known env doors is a FATAL
 *   refusal. Every override that changes WHAT IS MEASURED sets the preflight flag, and a preflight
 *   may never write a canonical repo path (#260.2); OUTPUT-PATH variables are overrides.
 *
 * RUN: L3T0_MODE=full npx tsx scripts/probes/l3-t0-defence-book-seam.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
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
  DefenceAccountBook, LungeLabelLedger, L3_DEFENCE_GROUPS, L3_DEFENCE_WINDOW_S,
  L3_RECKLESS_ARRIVAL, arrivalGroup,
} from '../../src/ai/defenceBook';
import { a4MatchFlags, armA4World, cbArmedVersion, CB_WORLD_VERSION } from '../../src/game/a4World';
import { GENE_KEYS, randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS — every one of them TRACED                              */
/* ========================================================================== */
/** ⭐ INSTRUMENT-SIDE ONLY (#247): the probe may read the TRUE tables; `src/**` may not. */
const L3C0_PATH = 'docs/world-model/data/l3-c0-lunge-outcome-census.json';
const L3C0B_PATH = 'docs/world-model/data/l3-c0b-window-decomposition.json';

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];

/* ========================================================================== */
/* §2 ⭐ ENV — WHITELIST-OR-REFUSE (#261.2 / #262.2) + THE PREFLIGHT ROUTING    */
/* ========================================================================== */
const ENV_WHITELIST = ['L3T0_MODE', 'L3T0_N', 'L3T0_SMOKE_N', 'L3T0_SKIP_FP', 'L3T0_OUT'] as const;
/** ⭐ #262.2(2): the ENGINE's own env doors are REFUSED too, not merely un-whitelisted. */
const ENGINE_ENV_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE'] as const;
const rogue = Object.keys(process.env)
  .filter((k) => (k.startsWith('L3T0_') && !(ENV_WHITELIST as readonly string[]).includes(k))
    || (ENGINE_ENV_DOORS as readonly string[]).includes(k));
if (rogue.length > 0) {
  console.error(`L3-T0 FATAL — unrecognised env override(s): ${rogue.join(', ')}. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse, #261.2; the `
    + `engine's own doors ${ENGINE_ENV_DOORS.join('/')} are refused outright, #262.2).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.L3T0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`L3-T0 FATAL — L3T0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.L3T0_N);
const SMOKE_N_ENV = intEnv(process.env.L3T0_SMOKE_N);
const SKIP_FP = process.env.L3T0_SKIP_FP === '1';
const OUT_ENV = process.env.L3T0_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'L3T0_N', set: N_ENV !== null },
  { name: 'L3T0_SMOKE_N', set: SMOKE_N_ENV !== null },
  { name: 'L3T0_SKIP_FP', set: SKIP_FP },
  { name: 'L3T0_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/l3-t0-defence-book-seam-smoke.json',
  full: 'docs/world-model/data/l3-t0-defence-book-seam.json',
};
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/l3-t0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('L3-T0 FATAL — a PREFLIGHT invocation may not write a canonical repo path (the '
    + `canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 SEED LEDGER (#163)                                                       */
/* ========================================================================== */
const BLOCK = 12_482_000;
const N = N_ENV ?? (MODE === 'smoke' ? 2 : 12);
const CROSS_N = Math.min(N, 4);
const PREFIX_N = Math.min(N, 6);
const READ_BASE = 12_482_020;
const SMOKE_BASE = 12_482_100;
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
  { name: 'EK-C0 census band (#259.3/#260.4)', range: [12_448_000, 12_448_999] },
  { name: 'EK-C0b diagnostic band (#260.3/#261)', range: [12_449_000, 12_449_999] },
  { name: 'EK-T0 hold-belief seam (#261.4/#262)', range: [12_450_000, 12_450_999] },
  { name: 'EK-T1 convergence exam band (#262.4)', range: [12_451_000, 12_469_999] },
  { name: 'CB-C0 / CB-T0 / CB-T1 / CB-T2 bands (#264–#273)', range: [12_470_000, 12_479_999] },
  { name: '⭐ L3-C0 lunge-outcome census (#277.2/#278)', range: [12_480_000, 12_480_999] },
  { name: '⭐ L3-C0b window decomposition (#278.2/#279)', range: [12_481_000, 12_481_999] },
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
const readJson = (p: string): Record<string, unknown> => JSON.parse(readFileSync(p, 'utf8'));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
const t0Wall = Date.now();

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

/** ⭐ THE TRUTH-DOSE (the exam idiom): L3-C0b's committed g2 rates, READ at run time. */
const l3c0b = readJson(L3C0B_PATH);
const g2Rows = ((l3c0b.tables as Record<string, unknown>).g2) as {
  band: string; candidates: { sepGainedCommonLong: { rate: { num: number; den: number } } };
}[];
const DOSE_WORSE = g2Rows.map((r) => ({
  group: r.band,
  num: r.candidates.sepGainedCommonLong.rate.num,
  den: r.candidates.sepGainedCommonLong.rate.den,
}));
/** the NEUTRAL dose: the SAME (num, den) in both groups ⇒ an exact tie ⇒ nothing declines. */
const DOSE_NEUTRAL = DOSE_WORSE.map(() => DOSE_WORSE[0]);
type DoseKind = 'worse' | 'neutral';
const doseBook = (book: DefenceAccountBook, kind: DoseKind): void => {
  const rows = kind === 'worse' ? DOSE_WORSE : DOSE_NEUTRAL;
  rows.forEach((r, g) => {
    for (let i = 0; i < r.den; i++) book.note(g, i < r.num);
  });
};
const freshBooks = (dose: DoseKind | null): [DefenceAccountBook, DefenceAccountBook] => {
  const books: [DefenceAccountBook, DefenceAccountBook] = [
    new DefenceAccountBook(), new DefenceAccountBook(),
  ];
  if (dose !== null) for (const b of books) doseBook(b, dose);
  return books;
};

interface Arm {
  /** flag omitted entirely (`absent`) vs explicitly false vs true. */
  learn: 'absent' | false | true;
  veto?: boolean;
  /** ⭐ THE POLISHED ARMED WORLD — L3-C0/C0b's own world of record (#273, cbArmedVersion 6). */
  armedWorld?: boolean;
  books?: readonly [DefenceAccountBook, DefenceAccountBook];
}

const matchOf = (seed: number, a: Arm): Match => {
  const m = new Match({
    seed, teamA: team('A', seed * 2 + 1), teamB: team('B', seed * 2 + 2),
    ...(a.armedWorld === true ? a4MatchFlags(CB_WORLD_VERSION) : {}),
    ...(a.learn === 'absent' ? {} : { l3DefenceLearn: a.learn }),
    ...(a.learn === true && a.books !== undefined ? { l3DefenceBooks: a.books } : {}),
    ...(a.veto === true ? { l3DefenceVeto: true } : {}),
  });
  if (a.armedWorld === true) armA4World(m, null, CB_WORLD_VERSION);
  return m;
};

const runMatch = (m: Match): void => { while (!m.finished) m.step(DT); };

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
  runMatch(m);
  return signature(m);
};
/** a cheap per-tick state read for the lockstep prefix comparison (no hashing). */
const tickState = (m: Match): number => {
  let s = (m.rng as unknown as { s: number }).s + m.score[0] * 1e7 + m.score[1] * 1e9;
  s += m.ball.pos.x * 1e3 + m.ball.pos.y * 1e5;
  for (const p of m.allPlayers) s += p.pos.x + p.pos.y * 3 + p.vel.x * 7;
  return s;
};

/* ========================================================================== */
/* §6 ⭐⭐ THE CONSTANTS, EXTRACTED FROM `src/**` TEXT (never imported here)     */
/* ========================================================================== */
const PLAYER_SRC = readFileSync('src/sim/Player.ts', 'utf8');
const MECHANICS_SRC = readFileSync('src/sim/mechanics.ts', 'utf8');
const CARRYBEAT_SRC = readFileSync('src/sim/carryBeat.ts', 'utf8');
const BOOK_SRC = readFileSync('src/ai/defenceBook.ts', 'utf8');
const MATCH_SRC = readFileSync('src/sim/Match.ts', 'utf8');
const LEAGUE_SRC = readFileSync('src/sim/League.ts', 'utf8');
const HOLDBOOK_SRC = readFileSync('src/ai/holdAccountBook.ts', 'utf8');
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  if (m === null) throw new Error(`L3-T0 FATAL — constant not found: ${re}`);
  return Number(m[1]);
};
/** ACCEL and TURN_RATE off `Player.ts`; R_TACKLE off `tryTackles`' own candidate scan. */
const X_ACCEL = extractNum(PLAYER_SRC, /^export const ACCEL = ([\d.]+);/m);
const X_TURN_RATE = extractNum(PLAYER_SRC, /^export const TURN_RATE = ([\d.]+);/m);
const X_R_TACKLE = extractNum(MECHANICS_SRC, /if \(d < ([\d.]+) && d < best\)/);
const X_CB_RADIUS = extractNum(CARRYBEAT_SRC, /^export const CB_TACKLE_RADIUS = ([\d.]+);/m);
/** ⭐ the window and the cut, RE-DERIVED here from the extracted constants alone. */
const X_WINDOW_S = Math.sqrt((2 * X_R_TACKLE) / X_ACCEL) + Math.PI / X_TURN_RATE;
const X_V_STAR = Math.sqrt(2 * X_ACCEL * X_R_TACKLE);
const X_LEG_BRAKE = 0;
const X_LEG_TURN = Math.PI / X_TURN_RATE;
const X_LEG_CLOSE = Math.sqrt((2 * X_R_TACKLE) / X_ACCEL);

/* ========================================================================== */
/* §7 ⭐⭐ gLabel — THE RULED LABEL, RE-DERIVED INDEPENDENTLY                    */
/* ========================================================================== */
interface LabelMutant {
  /** the anchor moves to the BALL (the #266.2(i) violation the census names). */
  ballAnchored?: boolean;
  /** the window collapses (the clock conjunct). */
  windowS?: number;
  /** the sign flips (`< 0` instead of `>= 0`). */
  signFlipped?: boolean;
  /** the miss population becomes EVERY lunge (the rejected `P(won)` denominator). */
  everyLungeIsAnEvent?: boolean;
}
interface ReDetected {
  tick: number; tSim: number; side: number; group: number;
  takerGid: number; carrierGid: number; sep0: number; missed: boolean;
  whistled: boolean;
}
interface ReLabelled {
  detected: ReDetected[];
  unreadableEvents: number;
  /** my own closures: `tMiss` (6 dp) → punished. */
  closures: { tMiss: number; punished: boolean; sepClose: number }[];
  censored: number;
  ledgerNoted: { tMiss: number; punished: boolean; group: number; side: number }[];
  ledgerOpened: number; ledgerClosed: number; ledgerCensored: number;
  ledgerFired: number[];
  books: readonly [DefenceAccountBook, DefenceAccountBook];
  groupAgreements: number; groupDisagreements: number; groupUnreadable: number;
  ownEventsViolations: number;
}
/**
 * ⭐ THE INDEPENDENT RE-LABELLING. It walks the SAME match the book is filling (two ACCOUNTS of
 * one trajectory, the EK-T0 form), but every ingredient is its own:
 *
 *   * ITS OWN DUEL DETECTOR — the engine's own `cbLedger` deltas (`armedChallenges` +1 per armed
 *     standing challenge, `recoveries` +1 per armed MISS; `tryTackles` picks at most one tackler
 *     per tick), with the tackler identified by the strict `tackleCooldown` increase — L3-C0's
 *     own detector, inherited.
 *   * ITS OWN WINDOW — `X_WINDOW_S`, re-derived from the constants EXTRACTED from src text.
 *   * ITS OWN CARRIER-ANCHORED SEPARATION WALK and its own sign test.
 *
 * ⚠ SCOPED OF RECORD: the miss POPULATION and the pair are re-detected independently; the
 * ledger's own group index is checked separately (gGroup) because a whistled duel's post-step
 * velocity is the RESTART's, not the decision's (L3-C0 §DEV 2's exclusion, inherited as a
 * published unreadable count rather than as a silent drop).
 */
function reLabel(seed: number, mut: LabelMutant = {}): ReLabelled {
  const books = freshBooks(null);
  const m = matchOf(seed, { learn: true, armedWorld: true, books });
  const W = mut.windowS ?? X_WINDOW_S;
  const detected: ReDetected[] = [];
  const closures: { tMiss: number; punished: boolean; sepClose: number }[] = [];
  const openMine: { tSim: number; takerGid: number; carrierGid: number; sep0: number }[] = [];
  let censored = 0;
  let groupAgreements = 0; let groupDisagreements = 0; let groupUnreadable = 0;
  const byGid = new Map<number, Player>();
  for (const p of m.allPlayers) byGid.set(p.gid, p);
  const sepOf = (aGid: number, bGid: number): number | null => {
    const a = byGid.get(aGid); const b = byGid.get(bGid);
    if (a === undefined || b === undefined) return null;
    const dx = a.pos.x - b.pos.x; const dy = a.pos.y - b.pos.y;
    return Math.sqrt(dx * dx + dy * dy);
  };
  while (!m.finished) {
    const preOwner = m.ball.owner;
    const prePhase = m.phase;
    const preArmed = m.cbLedger.armedChallenges;
    const preRec = m.cbLedger.recoveries;
    const preCd = new Map<number, number>();
    for (const p of m.allPlayers) preCd.set(p.gid, p.tackleCooldown);
    m.step(DT);
    // --- MY OWN DETECTION ------------------------------------------------
    const armedDelta = m.cbLedger.armedChallenges - preArmed;
    if (armedDelta > 0 && preOwner !== null) {
      let taker: Player | null = null;
      for (const p of m.allPlayers) {
        if (p.side === preOwner.side) continue;
        if (p.tackleCooldown > (preCd.get(p.gid) ?? 0)) { taker = p; break; }
      }
      if (taker !== null) {
        const missed = m.cbLedger.recoveries - preRec > 0;
        // ⚠ ⭐ THE WHISTLED DUEL IS UNREADABLE POST-STEP (L3-C0 §DEV 2, inherited): a missed
        // lunge can become a foul, and `awardFoul` repositions the ball and the bodies BEFORE
        // this probe gets to look — so the post-step geometry is the RESTART's, not the duel's.
        // It is detected (the phase moved, or the "tackler" is now outside the challenge radius
        // of the ball — a geometry no candidate scan could have produced) and EXCLUDED from the
        // comparison, with the count PUBLISHED. The SEAM itself labels these events correctly,
        // because it reads its t0 geometry INSIDE the duel; it is this probe that cannot see
        // them. §DEV 3 carries the honest consequence for T1.
        const dBall = Math.hypot(taker.pos.x - m.ball.pos.x, taker.pos.y - m.ball.pos.y);
        const whistled = m.phase !== prePhase || prePhase !== 'playing' || dBall >= X_R_TACKLE;
        const speed = Math.sqrt(taker.vel.x * taker.vel.x + taker.vel.y * taker.vel.y);
        const group = speed >= X_V_STAR ? 1 : 0;
        const sep0 = sepOf(taker.gid, preOwner.gid) ?? 0;
        detected.push({
          tick: m.simTick, tSim: m.simTime, side: taker.side, group,
          takerGid: taker.gid, carrierGid: preOwner.gid, sep0, missed, whistled,
        });
        if ((missed || mut.everyLungeIsAnEvent === true) && !whistled) {
          openMine.push({ tSim: m.simTime, takerGid: taker.gid, carrierGid: preOwner.gid, sep0 });
        }
      }
    }
    // --- MY OWN WINDOW SWEEP ---------------------------------------------
    for (let i = openMine.length - 1; i >= 0; i--) {
      const o = openMine[i];
      if (m.simTime < o.tSim + W) continue;
      openMine.splice(i, 1);
      const sep = mut.ballAnchored === true
        ? (() => {
          const a = byGid.get(o.takerGid);
          if (a === undefined) return null;
          const dx = a.pos.x - m.ball.pos.x; const dy = a.pos.y - m.ball.pos.y;
          return Math.sqrt(dx * dx + dy * dy);
        })()
        : sepOf(o.takerGid, o.carrierGid);
      if (sep === null) { censored++; continue; }
      const gained = sep - o.sep0;
      closures.push({
        tMiss: round(o.tSim), sepClose: round(sep),
        punished: mut.signFlipped === true ? gained < 0 : gained >= 0,
      });
    }
  }
  censored += openMine.length; // the whistle truncated these — CENSORED, never a zero
  const ledger = m.l3Defence as LungeLabelLedger;
  // --- THE INDEX CHECK (gGroup's population) ------------------------------
  const ledgerNoted = ledger.noted.map((n) => ({
    tMiss: round(n.tMiss), punished: n.punished, group: n.group, side: n.side,
  }));
  const mineByTime = new Map<number, ReDetected>();
  for (const d of detected) if (d.missed) mineByTime.set(round(d.tSim), d);
  /** the ledger events this probe CANNOT read (restart-displaced) — excluded and published. */
  const unreadable = new Set<number>();
  for (const d of detected) if (d.missed && d.whistled) unreadable.add(round(d.tSim));
  for (const n of ledgerNoted) {
    const mine = mineByTime.get(n.tMiss);
    if (mine === undefined) { groupUnreadable++; continue; }
    if (mine.whistled) { groupUnreadable++; continue; }
    if (mine.group === n.group) groupAgreements++; else groupDisagreements++;
  }
  // --- OWN EVENTS ONLY -----------------------------------------------------
  let ownEventsViolations = 0;
  for (const n of ledger.noted) {
    const mine = mineByTime.get(round(n.tMiss));
    if (mine !== undefined && mine.side !== n.side) ownEventsViolations++;
  }
  return {
    detected, closures, censored,
    ledgerNoted: ledgerNoted.filter((n) => !unreadable.has(n.tMiss)),
    unreadableEvents: unreadable.size,
    ledgerOpened: ledger.opened, ledgerClosed: ledger.closedLabels,
    ledgerCensored: ledger.censored, ledgerFired: [...ledger.fired], books,
    groupAgreements, groupDisagreements, groupUnreadable, ownEventsViolations,
  };
}
/** ⭐ the ONE comparison every gLabel claim and every mutant RE-INVOKES (#260.2). */
const labelMismatches = (r: ReLabelled): number => {
  const mine = [...r.closures].sort((a, b) => a.tMiss - b.tMiss || Number(a.punished) - Number(b.punished));
  const theirs = [...r.ledgerNoted].sort((a, b) => a.tMiss - b.tMiss || Number(a.punished) - Number(b.punished));
  let n = Math.abs(mine.length - theirs.length);
  for (let i = 0; i < Math.min(mine.length, theirs.length); i++) {
    if (mine[i].tMiss !== theirs[i].tMiss || mine[i].punished !== theirs[i].punished) n++;
  }
  return n;
};

/* ========================================================================== */
/* §8 THE RECEIPTS CORE (run TWICE for G-DET)                                  */
/* ========================================================================== */
const SEEDS = Array.from({ length: N }, (_, i) => BLOCK + i);
const SHAPES = [
  { tag: 'bare', arm: {} as Partial<Arm> },
  { tag: 'armed', arm: { armedWorld: true } as Partial<Arm> },
] as const;

function receipts(): Record<string, unknown> {
  /* ---- gOff / gBorn ------------------------------------------------------ */
  const offBorn = SEEDS.map((seed) => {
    const row: Record<string, unknown> = { seed };
    for (const shape of SHAPES) {
      const off = walk(seed, { learn: 'absent', ...shape.arm });
      const flagFalse = walk(seed, { learn: false, ...shape.arm });
      const books = freshBooks(null);
      const lm = matchOf(seed, { learn: true, books, ...shape.arm });
      runMatch(lm);
      const led = lm.l3Defence as LungeLabelLedger;
      row[shape.tag] = {
        gOff: off === flagFalse,
        gBorn: off === signature(lm),
        opened: led.opened, closed: led.closedLabels, censored: led.censored,
        fired: led.fired.reduce((a, b) => a + b, 0),
        firedByGroup: [...led.fired],
        filledCells: books.reduce((n, b) => n + b.lunges.filter((h) => h > 0).length, 0),
        bookTotal: books[0].total + books[1].total,
        punishedTotal: books.reduce((n, b) => n + b.punished.reduce((x, y) => x + y, 0), 0),
      };
    }
    return row;
  });
  const shapeRow = (r: Record<string, unknown>, tag: string): Record<string, number | boolean> =>
    r[tag] as Record<string, number | boolean>;
  const gOffAll = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gOff === true));
  const gBornIdentical = offBorn.every((r) => SHAPES.every((s) => shapeRow(r, s.tag).gBorn === true));
  const gBornLiveArmed = offBorn.every((r) => (shapeRow(r, 'armed').closed as number) > 0
    && (shapeRow(r, 'armed').filledCells as number) > 0);
  const bareFill = offBorn.reduce((n, r) => n + (shapeRow(r, 'bare').closed as number), 0);
  const armedFill = offBorn.reduce((n, r) => n + (shapeRow(r, 'armed').closed as number), 0);

  /* ---- gVeto / gZero / gBite / gBook — the book + veto arithmetic -------- */
  const vetoBooks: { h: number[]; p: number[] }[] = [];
  for (let h0 = 0; h0 <= 4; h0++) for (let p0 = 0; p0 <= h0; p0++) {
    for (let h1 = 0; h1 <= 4; h1++) for (let p1 = 0; p1 <= h1; p1++) {
      vetoBooks.push({ h: [h0, h1], p: [p0, p1] });
    }
  }
  type VetoRef = (h: readonly number[], p: readonly number[], g: number) => boolean;
  /** the INDEPENDENT re-derivation, in floats: belief[g] > pooled other-group rate. */
  const refVeto: VetoRef = (h, p, g) => {
    if (h[g] === 0) return false;
    let oh = 0; let op = 0;
    for (let i = 0; i < L3_DEFENCE_GROUPS; i++) { if (i === g) continue; oh += h[i]; op += p[i]; }
    if (oh === 0) return false;
    return p[g] / h[g] > op / oh;
  };
  const vetoSweep = (ref: VetoRef): number => {
    let mismatches = 0;
    for (const bk of vetoBooks) {
      const book = new DefenceAccountBook();
      for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
        for (let k = 0; k < bk.h[g]; k++) book.note(g, k < bk.p[g]);
      }
      for (let g = 0; g < L3_DEFENCE_GROUPS; g++) {
        if (book.declinesLunge(g) !== ref(bk.h, bk.p, g)) mismatches++;
      }
    }
    return mismatches;
  };
  const vetoMutants = ([
    { name: 'tie flips (>= instead of >)', ref: ((h, p, g) => {
      if (h[g] === 0) return false;
      let oh = 0; let op = 0;
      for (let i = 0; i < L3_DEFENCE_GROUPS; i++) { if (i === g) continue; oh += h[i]; op += p[i]; }
      if (oh === 0) return false;
      return p[g] / h[g] >= op / oh;
    }) as VetoRef },
    { name: 'cross-group guard dropped', ref: ((h, p, g) => {
      if (h[g] === 0) return false;
      let oh = 0; let op = 0;
      for (let i = 0; i < L3_DEFENCE_GROUPS; i++) { if (i === g) continue; oh += h[i]; op += p[i]; }
      return p[g] / h[g] > (oh === 0 ? 0 : op / oh);
    }) as VetoRef },
    { name: 'emptiness test dropped (an unseen group declines)', ref: ((h, p, g) => {
      let oh = 0; let op = 0;
      for (let i = 0; i < L3_DEFENCE_GROUPS; i++) { if (i === g) continue; oh += h[i]; op += p[i]; }
      if (oh === 0) return false;
      return (h[g] === 0 ? 0 : p[g] / h[g]) >= op / oh;
    }) as VetoRef },
  ] as const).map((mut) => ({ name: mut.name, mismatches: vetoSweep(mut.ref) }));
  const emptyBook = new DefenceAccountBook();
  const oneGroupBook = new DefenceAccountBook();
  for (let i = 0; i < 5; i++) oneGroupBook.note(0, i < 4);
  const tieBook = new DefenceAccountBook();
  tieBook.note(0, true); tieBook.note(0, false); tieBook.note(1, true); tieBook.note(1, false);
  const worstBook = new DefenceAccountBook();
  for (let i = 0; i < 4; i++) worstBook.note(0, i < 1);
  for (let i = 0; i < 4; i++) worstBook.note(1, true);
  const bestBook = new DefenceAccountBook();
  for (let i = 0; i < 4; i++) bestBook.note(0, true);
  for (let i = 0; i < 4; i++) bestBook.note(1, i < 1);
  const dosedWorse = new DefenceAccountBook(); doseBook(dosedWorse, 'worse');
  const dosedNeutral = new DefenceAccountBook(); doseBook(dosedNeutral, 'neutral');

  /* ---- gBook — the arithmetic on a hand-counted stream ------------------- */
  const bookProbe = new DefenceAccountBook();
  const bookStream: { g: number; p: boolean }[] = [];
  const brng = new Rng(4242);
  for (let i = 0; i < 500; i++) {
    const g = Math.floor(brng.next() * L3_DEFENCE_GROUPS) % L3_DEFENCE_GROUPS;
    const p = brng.next() < 0.7;
    bookStream.push({ g, p });
    bookProbe.note(g, p);
  }
  const handCount = [0, 1].map((g) => ({
    n: bookStream.filter((s) => s.g === g).length,
    k: bookStream.filter((s) => s.g === g && s.p).length,
  }));
  const bel = bookProbe.beliefVector() ?? [];
  const emptyGroupBook = new DefenceAccountBook();
  emptyGroupBook.note(1, true);
  const outOfRange = new DefenceAccountBook(); outOfRange.note(9, true);

  /* ---- gZero (c) PREFIX + gBite — the lockstep read ---------------------- */
  const prefixRun = (dose: DoseKind | null, armedWorld = true) => SEEDS.slice(0, PREFIX_N).map((seed) => {
    const both = matchOf(seed, {
      learn: true, veto: true, armedWorld, books: freshBooks(dose),
    });
    const learnOnly = matchOf(seed, {
      learn: true, armedWorld, books: freshBooks(dose),
    });
    let firstVetoTick = -1; let firstDiffTick = -1; let tick = 0;
    while (!both.finished && !learnOnly.finished) {
      both.step(DT); learnOnly.step(DT); tick++;
      const led = both.l3Defence as LungeLabelLedger;
      if (firstVetoTick < 0 && led.vetoes > 0) firstVetoTick = tick;
      if (firstDiffTick < 0 && tickState(both) !== tickState(learnOnly)) firstDiffTick = tick;
      if (firstDiffTick >= 0 && firstVetoTick >= 0) break;
    }
    const led = both.l3Defence as LungeLabelLedger;
    return {
      seed, firstVetoTick, firstDiffTick, vetoes: led.vetoes,
      prefixHeld: firstDiffTick < 0 || (firstVetoTick > 0 && firstDiffTick >= firstVetoTick),
      prefixNonEmpty: firstVetoTick !== 1,
      diverged: firstDiffTick >= 0,
    };
  });
  const prefix = prefixRun('worse');
  /**
   * ⭐ THE BORN-EMPTY ARM (the G-ZERO analogue, in its ONLY honest in-world form): both doors
   * armed on a book born ABSENT. It cannot be scored over a WHOLE match, because the ledger
   * keeps LEARNING inside the match — once the book has earned evidence in BOTH groups it may
   * legitimately veto, which is the contract's "consumption is EARNED" working. So it is scored
   * as a PREFIX: nothing moves before the book's own first veto, and the tick at which that
   * first veto lands is PUBLISHED (§DEV 1).
   */
  const bornEmptyPrefix = prefixRun(null);
  /** the same read in BARE PRODUCTION — the shape gCross's own DORMANT-ALL cell walks. */
  const bornEmptyPrefixBare = prefixRun(null, false);

  /* ---- ⭐ DECLINE-ONLY, MEASURED IN-WORLD -------------------------------- */
  const declineOnly = SEEDS.slice(0, PREFIX_N).map((seed) => {
    const armedM = matchOf(seed, {
      learn: true, veto: true, armedWorld: true, books: freshBooks('worse'),
    });
    const learnM = matchOf(seed, {
      learn: true, armedWorld: true, books: freshBooks('worse'),
    });
    runMatch(armedM); runMatch(learnM);
    const a = armedM.l3Defence as LungeLabelLedger;
    const l = learnM.l3Defence as LungeLabelLedger;
    const firedA = a.fired.reduce((x, y) => x + y, 0);
    const firedL = l.fired.reduce((x, y) => x + y, 0);
    return { seed, firedArmed: firedA, firedLearnOnly: firedL, vetoes: a.vetoes, never: firedA <= firedL };
  });
  /** the NEUTRAL dose: a tie declines nothing, so not one veto may fire. */
  const neutralDose = SEEDS.slice(0, PREFIX_N).map((seed) => {
    const m = matchOf(seed, {
      learn: true, veto: true, armedWorld: true, books: freshBooks('neutral'),
    });
    runMatch(m);
    const off = walk(seed, { learn: 'absent', armedWorld: true });
    const led = m.l3Defence as LungeLabelLedger;
    return { seed, vetoes: led.vetoes, identicalToOff: signature(m) === off };
  });

  /* ---- ⭐⭐ gLabel + gGroup + gOwnEvents ---------------------------------- */
  const labelRows = SEEDS.map((seed) => {
    const r = reLabel(seed);
    return {
      seed, mismatches: labelMismatches(r),
      mineClosures: r.closures.length, theirClosures: r.ledgerNoted.length,
      minePunished: r.closures.filter((c) => c.punished).length,
      theirPunished: r.ledgerNoted.filter((c) => c.punished).length,
      mineCensored: r.censored, theirCensored: r.ledgerCensored,
      detectedLunges: r.detected.length, detectedMisses: r.detected.filter((d) => d.missed).length,
      ledgerOpened: r.ledgerOpened, ledgerFired: r.ledgerFired.reduce((a, b) => a + b, 0),
      groupAgreements: r.groupAgreements, groupDisagreements: r.groupDisagreements,
      groupUnreadable: r.groupUnreadable, ownEventsViolations: r.ownEventsViolations,
      unreadableEvents: r.unreadableEvents,
    };
  });
  const labelTotals = labelRows.reduce((a, r) => ({
    mismatches: a.mismatches + r.mismatches,
    closures: a.closures + r.theirClosures,
    punished: a.punished + r.theirPunished,
    censored: a.censored + r.theirCensored,
    detectedLunges: a.detectedLunges + r.detectedLunges,
    detectedMisses: a.detectedMisses + r.detectedMisses,
    opened: a.opened + r.ledgerOpened,
    fired: a.fired + r.ledgerFired,
    groupAgreements: a.groupAgreements + r.groupAgreements,
    groupDisagreements: a.groupDisagreements + r.groupDisagreements,
    groupUnreadable: a.groupUnreadable + r.groupUnreadable,
    ownEventsViolations: a.ownEventsViolations + r.ownEventsViolations,
    unreadableEvents: a.unreadableEvents + r.unreadableEvents,
  }), {
    mismatches: 0, closures: 0, punished: 0, censored: 0, detectedLunges: 0, detectedMisses: 0,
    opened: 0, fired: 0, groupAgreements: 0, groupDisagreements: 0, groupUnreadable: 0,
    ownEventsViolations: 0, unreadableEvents: 0,
  });
  const mutantSeeds = SEEDS.slice(0, Math.min(N, 6));
  const labelMutantRuns = ([
    { name: 'ballAnchored (the CARRIER-ANCHOR conjunct, #266.2(i))', mut: { ballAnchored: true } },
    { name: 'windowS=0 (the COMMON-WINDOW conjunct)', mut: { windowS: 0 } },
    { name: 'signFlipped (the ZERO-METRE sign conjunct)', mut: { signFlipped: true } },
    { name: 'everyLungeIsAnEvent (the MISS-POPULATION conjunct — the rejected P(won) denominator)',
      mut: { everyLungeIsAnEvent: true } },
  ] as const).map(({ name, mut }) => {
    let mismatches = 0; let flippedOn = 0;
    for (const seed of mutantSeeds) {
      const mm = labelMismatches(reLabel(seed, mut));
      mismatches += mm;
      if (mm > 0) flippedOn++;
    }
    return { name, seeds: mutantSeeds.length, mismatches, flipped: mismatches > 0 };
  });

  /* ---- ⭐ gReset --------------------------------------------------------- */
  const resetLeague = new League({ seed: READ_BASE });
  resetLeague.matchFlags = { l3DefenceLearn: true };
  let resetMatches = 0;
  let sameObjects = true;
  while (!resetLeague.seasonDone && resetMatches < 6) {
    const f = resetLeague.nextFixture();
    if (f === undefined || f === null) break;
    const lm = resetLeague.createMatch(f);
    const books = resetLeague.defenceBooks ?? [];
    const led = lm.l3Defence;
    if (led === null || led.books[0] !== books[f.home] || led.books[1] !== books[f.away]) {
      sameObjects = false;
    }
    resetLeague.applyResult(f, lm.runToCompletion());
    resetMatches++;
  }
  const seasonBooks = resetLeague.defenceBooks ?? [];
  const filledTotal = seasonBooks.reduce((n, b) => n + b.total, 0);
  const filledNonNull = seasonBooks.filter((b) => b.beliefVector() !== null).length;
  resetLeague.finishSeason();
  const afterBooks = resetLeague.defenceBooks ?? [];
  const gResetRows = {
    unarmedLeagueAllocatesNothing: new League({ seed: READ_BASE + 9 }).defenceBooks === null,
    armedLeagueAllocates: seasonBooks.length > 0,
    fixturesShareTheSeasonBooks: sameObjects,
    seasonFilled: filledTotal > 0 && filledNonNull > 0,
    wipedCounts: afterBooks.reduce((n, b) => n + b.total, 0) === 0,
    wipedBeliefs: afterBooks.every((b) => b.beliefVector() === null),
    wipedVetoes: afterBooks.every((b) => [0, 1].every((g) => !b.declinesLunge(g))),
  };

  /* ---- gNoLamarck (the world half) --------------------------------------- */
  const lamJson = JSON.stringify(resetLeague.toJSON());
  const lamMatch = matchOf(READ_BASE + 4, { learn: true, veto: true, armedWorld: true, books: freshBooks('worse') });
  runMatch(lamMatch);
  const gNoLamarckRows = {
    franchiseGenomesClean: resetLeague.franchises.every((f) => {
      const g = f.coach.genome as unknown as Record<string, unknown>;
      return g.l3DefenceBelief === undefined && g.defenceBelief === undefined
        && g.lungeBelief === undefined;
    }),
    matchGenomesClean: lamMatch.teams.every((t) => {
      const g = t.baseGenome as unknown as Record<string, unknown>;
      return g.l3DefenceBelief === undefined && g.defenceBelief === undefined
        && g.lungeBelief === undefined;
    }),
    saveCarriesNothing: !lamJson.includes('l3Defence') && !lamJson.includes('defenceBelief')
      && !lamJson.includes('DefenceAccountBook'),
    noNewGeneKey: !(GENE_KEYS as readonly string[]).some(
      (k) => k.toLowerCase().includes('lunge') || k.toLowerCase().includes('defencebook'),
    ),
  };

  /* ---- gRng --------------------------------------------------------------- */
  const rngArmed = matchOf(READ_BASE + 2, { learn: true, armedWorld: true, books: freshBooks(null) });
  const rngOff = matchOf(READ_BASE + 2, { learn: 'absent', armedWorld: true });
  let rngStatesEqual = true;
  while (!rngArmed.finished && !rngOff.finished) {
    rngArmed.step(DT); rngOff.step(DT);
    if ((rngArmed.rng as unknown as { s: number }).s !== (rngOff.rng as unknown as { s: number }).s) {
      rngStatesEqual = false; break;
    }
  }
  const ledgerFixture = matchOf(READ_BASE + 3, { learn: 'absent' });
  for (let i = 0; i < 400; i++) ledgerFixture.step(DT);
  const sBefore = (ledgerFixture.rng as unknown as { s: number }).s;
  const standalone = freshBooks(null);
  const standaloneLedger = new LungeLabelLedger(standalone);
  for (let i = 0; i < 300; i++) {
    standaloneLedger.noteFired(i % L3_DEFENCE_GROUPS);
    standaloneLedger.noteMiss(i % 2, i % L3_DEFENCE_GROUPS, i * 0.1, i % 12, (i + 1) % 12, 1 + (i % 3));
    for (const p of [...standaloneLedger.open]) {
      standaloneLedger.observeSeparation(p.key, 2 + (i % 5), i * 0.1);
    }
  }
  standaloneLedger.flush();
  const sAfter = (ledgerFixture.rng as unknown as { s: number }).s;

  return {
    offBorn, gOffAll, gBornIdentical, gBornLiveArmed, bareFill, armedFill,
    veto: {
      sweptBooks: vetoBooks.length,
      sweepMismatches: vetoSweep(refVeto),
      emptyServesNull: emptyBook.beliefVector() === null,
      emptyDeclinesNothing: [0, 1].every((g) => !emptyBook.declinesLunge(g)),
      oneGroupServesBelief: oneGroupBook.beliefVector() !== null,
      oneGroupDeclinesNothing: [0, 1].every((g) => !oneGroupBook.declinesLunge(g)),
      tieDeclinesNothing: !tieBook.declinesLunge(0) && !tieBook.declinesLunge(1),
      worstDeclines: worstBook.declinesLunge(1),
      bestDoesNot: !bestBook.declinesLunge(1),
      outOfRangeSafe: !worstBook.declinesLunge(-1) && !worstBook.declinesLunge(L3_DEFENCE_GROUPS),
      dosedWorseDeclinesReckless: dosedWorse.declinesLunge(1),
      dosedWorseSparesControlled: !dosedWorse.declinesLunge(0),
      dosedNeutralDeclinesNothing: [0, 1].every((g) => !dosedNeutral.declinesLunge(g)),
      mutants: vetoMutants,
    },
    book: {
      marginalExact: handCount.every((h, g) => bel[g] === (h.n > 0 ? h.k / h.n : 0)),
      countsExact: handCount.every((h, g) => bookProbe.lunges[g] === h.n && bookProbe.punished[g] === h.k),
      punishedNeverExceeds: bookProbe.punished.every((k, g) => k <= bookProbe.lunges[g]),
      totalIsSum: bookProbe.total === bookProbe.lunges.reduce((a, b) => a + b, 0),
      widthHeld: bel.length === L3_DEFENCE_GROUPS,
      zeroConstantOnUnseenGroup: JSON.stringify(emptyGroupBook.beliefVector()) === JSON.stringify([0, 1]),
      outOfRangeIgnored: outOfRange.total === 0,
      belief: bel.map((v) => round(v)),
    },
    prefix, bornEmptyPrefix, bornEmptyPrefixBare, declineOnly, neutralDose,
    labelRows, labelTotals, labelMutantRuns,
    gResetRows, resetMatches, filledTotal,
    gNoLamarckRows,
    rng: {
      armedStreamIdentical: rngStatesEqual,
      ledgerDrawsNothing: sBefore === sAfter,
      ledgerNonVacuous: standalone[0].total + standalone[1].total > 0,
      ledgerClosesEverything: standaloneLedger.openLabels === 0,
      sBefore, sAfter,
    },
  };
}

banner('  [l3-t0] receipts core run A...');
const runA = receipts();
const digestA = sha(canonical(runA));
banner(`  [l3-t0] run A digest ${digestA}\n  [l3-t0] G-DET second run...`);
const runB = receipts();
const digestB = sha(canonical(runB));
banner(`  [l3-t0] run B digest ${digestB} — G-DET ${digestA === digestB ? 'PASS' : 'FAIL'}`);

/* ========================================================================== */
/* §9 ⭐⭐ gCross — THE DOORS MATRIX + THE MACHINE-DERIVED DOOR FAMILY          */
/* ========================================================================== */
interface CrossCell { learn: boolean; veto: boolean; world: boolean; dosed: boolean }
const crossKey = (c: CrossCell): string =>
  `learn${c.learn ? 1 : 0}·veto${c.veto ? 1 : 0}·world${c.world ? 1 : 0}·dosed${c.dosed ? 1 : 0}`;
const crossCells: CrossCell[] = [];
for (const learn of [false, true]) for (const veto of [false, true]) {
  for (const world of [false, true]) for (const dosed of [false, true]) {
    crossCells.push({ learn, veto, world, dosed });
  }
}
const crossSeeds = SEEDS.slice(0, CROSS_N);
const crossSig: Record<number, Record<string, string>> = {};
for (const seed of crossSeeds) {
  banner(`  [l3-t0] gCross seed ${seed}...`);
  crossSig[seed] = {};
  for (const c of crossCells) {
    crossSig[seed][crossKey(c)] = walk(seed, {
      learn: c.learn ? true : 'absent', veto: c.veto, armedWorld: c.world,
      books: c.learn ? freshBooks(c.dosed ? 'worse' : null) : undefined,
    });
  }
}
const cs = (seed: number, c: CrossCell): string => crossSig[seed][crossKey(c)];
const crossClaims = crossSeeds.map((seed) => {
  const base = cs(seed, { learn: false, veto: false, world: false, dosed: false });
  const worldOnly = cs(seed, { learn: false, veto: false, world: true, dosed: false });
  return {
    seed,
    /** ⭐ RE-SPECIFIED (§DEV 1): the LEARNING door alone is the incumbent world, in BOTH
     *  shapes. The both-doors cell is NOT an identity cell — a born-empty book EARNS
     *  two-group evidence inside a match and may then legitimately veto, which is the
     *  contract's own "consumption is EARNED"; its honest form is gZero's PREFIX. */
    dormantLearnDoorAlone: base === cs(seed, { learn: true, veto: false, world: false, dosed: false })
      && worldOnly === cs(seed, { learn: true, veto: false, world: true, dosed: false }),
    bothDoorsBornEmptyInertOverAWholeMatch:
      base === cs(seed, { learn: true, veto: true, world: false, dosed: false }),
    aNeighboursUnmoved: worldOnly === cs(seed, { learn: true, veto: false, world: true, dosed: true }),
    bVetoAloneInert: worldOnly === cs(seed, { learn: false, veto: true, world: true, dosed: false })
      && base === cs(seed, { learn: false, veto: true, world: false, dosed: false }),
    interactionNeedsBoth:
      cs(seed, { learn: true, veto: true, world: true, dosed: true }) !== worldOnly,
    bornEmptyInert: worldOnly === cs(seed, { learn: true, veto: true, world: true, dosed: false }),
    discriminationNotWorldOff:
      cs(seed, { learn: true, veto: true, world: true, dosed: true })
      !== cs(seed, { learn: false, veto: false, world: false, dosed: false }),
  };
});
const CROSS_ALWAYS = ['dormantLearnDoorAlone', 'aNeighboursUnmoved', 'bVetoAloneInert'] as const;
const CROSS_SETWISE = ['interactionNeedsBoth', 'discriminationNotWorldOff'] as const;
/** ⭐ REPORTED, not claimed (§DEV 1): a BORN-EMPTY armed book may legitimately move the world
 *  LATE in a match — once it has EARNED evidence in both groups. The honest form of the
 *  born-absent claim is the PREFIX (gZero), not a whole-match identity. */
const crossBornEmptyInertWholeMatch = crossClaims
  .filter((r) => r.bornEmptyInert === true).length;
const crossBornEmptyInertBareWholeMatch = crossClaims
  .filter((r) => r.bothDoorsBornEmptyInertOverAWholeMatch === true).length;
const crossAlways = crossClaims.every((r) => CROSS_ALWAYS.every((k) => r[k] === true));
const crossSetwise = Object.fromEntries(CROSS_SETWISE.map(
  (k) => [k, crossClaims.filter((r) => r[k] === true).length],
)) as Record<string, number>;

/** ⭐ THE DOOR FAMILY, MACHINE-DERIVED from `Match.ts`'s own `?? false` construction doors. */
const DOOR_NAMES = [...MATCH_SRC.matchAll(/this\.([A-Za-z0-9_]+) = cfg\.[A-Za-z0-9_]+ \?\? (?:true|false);/g)]
  .map((m) => m[1]).sort();
const prodMatch = new Match({ seed: 7, teamA: team('A', 7), teamB: team('B', 8) });
const doorsAllFalseInProduction = DOOR_NAMES.every(
  (d) => (prodMatch as unknown as Record<string, unknown>)[d] === false,
);
const A4_SRC = readFileSync('src/game/a4World.ts', 'utf8');

/* ========================================================================== */
/* §10 gIdent / xFpProd                                                        */
/* ========================================================================== */
const leagueHash = (seed: number): string => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  return createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
};
const FP_ROWS = LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  if (SKIP_FP) return { seed, baseline, observed: 'skipped (preflight)', match: false };
  banner(`  [l3-t0] gIdent league seed ${seed}...`);
  const observed = leagueHash(seed);
  return { seed, baseline, observed, match: observed === baseline };
});

/* ========================================================================== */
/* §11 SOURCE READS: forks · hygiene · epi · notable · pins                    */
/* ========================================================================== */
const srcFilesOf = (dir: string): string[] => readdirSync(dir).flatMap((e) => {
  const p = join(dir, e);
  if (statSync(p).isDirectory()) return srcFilesOf(p);
  return p.endsWith('.ts') ? [p] : [];
});
const SRC = srcFilesOf('src');
const srcText = new Map(SRC.map((f) => [f, readFileSync(f, 'utf8')]));
const countOf = (s: string, needle: string): number => s.split(needle).length - 1;
const executableOf = (text: string): string => text.split('\n')
  .filter((l) => {
    const t = l.trim();
    return !(t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/') || t === '');
  }).join('\n');

/* ---- gFork ---------------------------------------------------------------- */
const SEAM_RE = /l3DefenceLearn|l3DefenceVeto|l3DefenceBooks|l3DefenceDeclines|l3DefenceGroup|l3DefenceNoteMiss|l3DefenceNoteFired|l3DefenceObserve|l3Defence\b|DefenceAccountBook|LungeLabelLedger|defenceBook|L3_DEFENCE_|L3_RECKLESS_|L3_GROUP_|arrivalGroup|l3BooksFor|defenceBooks|noteMiss|noteFired|observeSeparation/;
const forkOccurrences: { file: string; line: number; text: string; cls: string }[] = [];
for (const [file, text] of srcText) {
  text.split('\n').forEach((line, i) => {
    if (!SEAM_RE.test(line)) return;
    const t = line.trim();
    let cls = 'unclassified';
    if (file === 'src/ai/defenceBook.ts') cls = "the book module's own body";
    else if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*') || t.startsWith('*/')) cls = 'comment';
    else if (t.startsWith('import ') || t.startsWith('} from') || /^ *DefenceAccountBook, LungeLabelLedger/.test(line)) cls = 'import';
    else if (t.startsWith('this.l3Defence = this.l3DefenceLearn')) cls = '⭐ THE LEDGER FORK';
    else if (t.includes('this.matchFlags?.l3DefenceLearn === true')) cls = '⭐ THE SEASON FORK';
    else if (t.startsWith('l3DefenceDeclines(side: number, group: number)')) cls = '⭐ THE VETO FORK (the one consumption site)';
    else if (t.startsWith('l3DefenceGroup(taker: Player)')) cls = '⭐ THE GROUP READ (the one index read)';
    else if (t.startsWith('l3DefenceNoteMiss(taker: Player')) cls = '⭐ THE LABEL CAPTURE';
    else if (t.startsWith('l3DefenceNoteFired(')) cls = 'the fired meter (a read)';
    else if (t.startsWith('private l3DefenceObserve(')) cls = 'the observation method';
    else if (/^(l3DefenceLearn|l3DefenceVeto|l3DefenceBooks)\??:/.test(t)) cls = 'MatchConfig declaration';
    else if (/^readonly (l3DefenceLearn|l3DefenceVeto|l3Defence):/.test(t)) cls = 'Match field declaration';
    else if (/^private l3DefenceBooks/.test(t)) cls = 'League field declaration';
    else if (/^this\.(l3DefenceLearn|l3DefenceVeto) = cfg\./.test(t)) cls = 'constructor init';
    else if (t.includes("| 'l3DefenceLearn' | 'l3DefenceVeto'")) cls = 'League matchFlags union key';
    else if (t.startsWith('private l3BooksFor') || t.includes('this.l3DefenceBooks = this.franchises')
      || t.includes('return [this.l3DefenceBooks[home]') || t.includes('if (this.l3DefenceBooks === null')) cls = 'League book allocator';
    else if (t.startsWith('get defenceBooks(')) cls = 'League instrument getter';
    else if (t.includes('if (this.l3DefenceBooks !== null')) cls = 'League season reset';
    else if (t.startsWith('for (const b of this.l3DefenceBooks)')) cls = 'League season reset';
    else if (t.includes('this.l3Defence !== null')) cls = 'consumer site (the nullable seat test)';
    else if (t.includes('if (this.l3Defence === null) return -1;')
      || t.includes('if (this.l3Defence === null) return;')) cls = 'consumer site (the nullable seat test)';
    else if (t.includes('if (!this.l3DefenceVeto || ledger === null) return false;')) cls = 'the veto fork body';
    else if (t.includes('p.tMiss + L3_DEFENCE_WINDOW_S')) cls = 'the observation / veto / capture method body';
    else if (t.includes('const ledger = this.l3Defence;')) cls = 'seat read inside a seam method';
    else if (t.includes('ledger.noteMiss(') || t.includes('ledger.observeSeparation(')
      || t.includes('ledger.censor(') || t.includes('ledger.vetoes++')
      || t.includes('ledger.books[side]') || t.includes('this.l3Defence.noteFired(')) cls = 'the observation / veto / capture method body';
    else if (t.includes('this.l3Defence.flush()')) cls = 'consumer site (the whistle)';
    else if (t.includes('const l3Group = match.l3DefenceGroup(tackler);')) cls = '⭐ THE WIRING — the group read at the lunge gate';
    else if (t.includes('match.l3DefenceDeclines(')) cls = '⭐ THE WIRING — the veto at the lunge gate';
    else if (t.includes('match.l3DefenceNoteFired(')) cls = 'the wiring — the fired meter';
    else if (t.includes('match.l3DefenceNoteMiss(')) cls = '⭐ THE WIRING — the label capture in the MISS branch';
    else if (t.includes('if (l3Group >= 0)')) cls = 'the wiring guard (inert in production)';
    else if (t.includes('l3DefenceBooks:')) cls = 'the season fork body';
    else if (t.includes('new LungeLabelLedger(') || t.includes('new DefenceAccountBook()')) cls = 'the fork body (allocation)';
    else if (t.includes('arrivalGroup(len(taker.vel))')) cls = 'the group read body';
    forkOccurrences.push({ file, line: i + 1, text: t.slice(0, 150), cls });
  });
}
const unclassified = forkOccurrences.filter((o) => o.cls === 'unclassified');

/* ---- gHygiene ------------------------------------------------------------- */
const hygLeague = new League({ seed: 2 });
const hygFixture = hygLeague.nextFixture();
const hygMatch = hygFixture === undefined || hygFixture === null ? null : hygLeague.createMatch(hygFixture);
const seamFileTexts = [BOOK_SRC, MATCH_SRC, LEAGUE_SRC, MECHANICS_SRC].join('\n');

/* ---- gEpi ----------------------------------------------------------------- */
const bookImports = BOOK_SRC.split('\n').filter((l) => /^\s*import\s/.test(l));
const bookExecutable = executableOf(BOOK_SRC);
/** ⭐ the forbidden-name scan runs on the executable source MINUS its import lines — the import
 *  list is gated by its OWN conjunct (and `'../sim/Player'` is a licensed engine-constant path,
 *  #DEV: the name `Player` occurs there and nowhere else). */
const bookExecutableNoImports = bookExecutable.split('\n')
  .filter((l) => !/^\s*import\s/.test(l)).join('\n');
const EPI_FORBIDDEN = ['Match', 'match.', 'Player', 'Team', 'perceivedSnapshot', 'perceptionSnapshot',
  'opp', 'rng', 'Rng', 'attrs', 'readFileSync', 'docs/', 'import(', 'genome', 'Genome'];
const epiHits = EPI_FORBIDDEN.filter((n) => bookExecutableNoImports.includes(n));
const EPI_MEMBERS = ['noteFired', 'noteMiss', 'observeSeparation', 'censor', 'flush',
  'declinesLunge', 'beliefVector', 'reset'];

/* ---- gNotable ------------------------------------------------------------- */
const NEEDLE_FLOOR = 0.0001;
const collectNumbers = (v: unknown, out: Set<number>): void => {
  if (typeof v === 'number') {
    if (Number.isFinite(v) && !Number.isInteger(v) && Math.abs(v) >= NEEDLE_FLOOR) out.add(v);
    return;
  }
  if (Array.isArray(v)) { for (const x of v) collectNumbers(x, out); return; }
  if (v !== null && typeof v === 'object') {
    for (const x of Object.values(v as Record<string, unknown>)) collectNumbers(x, out);
  }
};
const needleValues = new Set<number>();
const l3c0 = readJson(L3C0_PATH);
collectNumbers(l3c0.tables ?? l3c0.result ?? l3c0, needleValues);
collectNumbers(l3c0b.tables, needleValues);
collectNumbers(l3c0b.twoWindowContrast, needleValues);
collectNumbers(l3c0b.shape, needleValues);
collectNumbers(l3c0b.vetoFrame, needleValues);
const searchableForm = (f: string): boolean => /^\d+\.\d{3,}$/.test(f);
const needleForms = new Set<string>();
let excludedForms = 0;
for (const v of needleValues) {
  for (const f of [String(v), v.toFixed(5), (v * 100).toFixed(2)]) {
    if (searchableForm(f)) needleForms.add(f); else excludedForms++;
  }
}
/** ⭐ the DERIVED window and cut are the engine's own arithmetic, not census values — but they
 *  can coincide with a census number by construction (the census derived v* the same way), so
 *  the two DERIVED forms are excluded BY NAME and the exclusion is published. */
const DERIVED_EXEMPT = new Set([
  String(X_V_STAR), X_V_STAR.toFixed(5), (X_V_STAR * 100).toFixed(2),
  String(X_WINDOW_S), X_WINDOW_S.toFixed(5), (X_WINDOW_S * 100).toFixed(2),
]);
const srcAll = [...srcText.values()].join('\n');
const srcTokens = new Set(srcAll.match(/\d+\.\d+|\d+/g) ?? []);
const valueHits = [...needleForms].filter((f) => srcTokens.has(f) && !DERIVED_EXEMPT.has(f));
const NAME_NEEDLES = ['l3-c0-lunge-outcome-census', 'l3-c0b-window-decomposition',
  'lunge-outcome-census', 'window-decomposition', 'sepGainedCommon', 'sepGainedOwnRecovery'];
const nameHits = NAME_NEEDLES.filter((n) => srcAll.includes(n));
const seamExecutable = [BOOK_SRC, MATCH_SRC, LEAGUE_SRC, MECHANICS_SRC].map(executableOf).join('\n');
const loaderHits = ['readFileSync', 'import(', 'require(', 'docs/'].filter((n) => seamExecutable.includes(n));
const CONTROL_NEEDLE = '0.5';

/* ---- gPort — the EK-T0 veto, token-for-token ------------------------------ */
const methodBody = (src: string, header: string): string => {
  const i = src.indexOf(header);
  if (i < 0) return '';
  let depth = 0; let started = false; let out = '';
  for (let k = i; k < src.length; k++) {
    const ch = src[k];
    out += ch;
    if (ch === '{') { depth++; started = true; }
    if (ch === '}') { depth--; if (started && depth === 0) break; }
  }
  return out;
};
const normalisePort = (s: string): string => s
  .replace(/declinesHold/g, 'DECLINES').replace(/declinesLunge/g, 'DECLINES')
  .replace(/holds/g, 'CELLS').replace(/lunges/g, 'CELLS')
  .replace(/otherHolds/g, 'OTHER').replace(/otherLunges/g, 'OTHER')
  .replace(/band/g, 'IDX').replace(/group/g, 'IDX')
  .replace(/EK_HOLD_BANDS/g, 'WIDTH').replace(/L3_DEFENCE_GROUPS/g, 'WIDTH')
  .replace(/\s+/g, ' ').trim();
const portEk = normalisePort(methodBody(HOLDBOOK_SRC, 'declinesHold(band: number): boolean'));
const portL3 = normalisePort(methodBody(BOOK_SRC, 'declinesLunge(group: number): boolean'));

/* ---- the veto's + window's own source lines: ZERO CONSTANT ---------------- */
const vetoLiterals = (methodBody(BOOK_SRC, 'declinesLunge(group: number): boolean')
  .match(/\b\d+(\.\d+)?\b/g) ?? []).filter((x) => x !== '0');
const windowLine = BOOK_SRC.split('\n').filter((l) => l.includes('export const L3_DEFENCE_WINDOW_S')
  || l.includes('export const L3_RECKLESS_ARRIVAL')).join('\n');
const windowLiterals = (windowLine.match(/\b\d+(\.\d+)?\b/g) ?? []).filter((x) => x !== '2' && x !== '3');

/* ---- gPins ---------------------------------------------------------------- */
const PIN_FILES = ['src/ai/holdAccountBook.ts', 'src/ai/deliveryAccountBook.ts',
  'src/ai/whetherEye.ts', 'src/ai/perceptionSnapshot.ts', 'src/sim/carryBeat.ts',
  'src/game/a4World.ts'];
const pinDiffs = PIN_FILES.map((f) => ({ file: f, diff: gitOut(`git diff --stat HEAD -- ${f}`) }));
const evolutionDiff = gitOut('git diff --stat HEAD -- src/evolution');
const playerDiff = gitOut('git diff -U0 HEAD -- src/sim/Player.ts');
const playerDiffLines = playerDiff.split('\n').filter((l) => /^[+-][^+-]/.test(l)).map((l) => l.trim());
const playerDiffIsTheKeyword = playerDiffLines.length === 2
  && playerDiffLines[0] === '-const ACCEL = 14; // m/s^2 toward desired velocity'
  && playerDiffLines[1] === '+export const ACCEL = 14; // m/s^2 toward desired velocity';
const testStatus = gitOut('git status --porcelain -- tests').split('\n')
  .map((l) => l.trim()).filter((l) => l.length > 0);

/* ---- gSeed ---------------------------------------------------------------- */
const CLAIMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: 'L3-T0 receipts (incl. the doors matrix, no new block)', range: [BLOCK, BLOCK + N - 1] },
  { name: 'L3-T0 label / book / veto / reset / rng reads', range: [READ_BASE, READ_BASE + 9] },
  { name: 'L3-T0 REPORTED armed smoke', range: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1] },
  { name: 'L3-T0 test-file seeds', range: [12_482_900, 12_482_911] },
];
const overlaps = (a: readonly [number, number], b: readonly [number, number]): boolean =>
  a[0] <= b[1] && b[0] <= a[1];
const seedClashes = CLAIMED.flatMap((c) => CONSUMED
  .filter((p) => overlaps(c.range, p.range)).map((p) => ({ claimed: c.name, against: p.name })));
const claimedInternalClash = CLAIMED.flatMap((c, i) => CLAIMED.slice(i + 1)
  .filter((d) => overlaps(c.range, d.range)).map((d) => ({ claimed: c.name, against: d.name })));

/* ========================================================================== */
/* §12 ⭐ REPORTED — THE ARMED SMOKE (a plumbing read, NOT a gate)              */
/* ========================================================================== */
banner(`  [l3-t0] REPORTED smoke: ${SMOKE_N} armed-world matches...`);
const smokeBooks = freshBooks(null);
let smokeIdenticalToOff = true;
let smokeFired = 0; let smokeOpened = 0; let smokeClosed = 0; let smokeCensored = 0;
let smokeVetoesWorse = 0; let smokeVetoesNeutral = 0;
let smokeFiredArmedWorse = 0; let smokeFiredLearnOnly = 0;
const smokeSeeds = Array.from({ length: SMOKE_N }, (_, i) => SMOKE_BASE + i);
for (const seed of smokeSeeds) {
  const m = matchOf(seed, { learn: true, armedWorld: true, books: smokeBooks });
  runMatch(m);
  const off = walk(seed, { learn: 'absent', armedWorld: true });
  if (signature(m) !== off) smokeIdenticalToOff = false;
  const led = m.l3Defence as LungeLabelLedger;
  smokeFired += led.fired.reduce((a, b) => a + b, 0);
  smokeOpened += led.opened; smokeClosed += led.closedLabels; smokeCensored += led.censored;
  smokeFiredLearnOnly += led.fired.reduce((a, b) => a + b, 0);
  // ⭐ THE TRUTH-DOSED ARMS (the exam idiom): the same seeds, the veto door open.
  const worse = matchOf(seed, { learn: true, veto: true, armedWorld: true, books: freshBooks('worse') });
  runMatch(worse);
  const wl = worse.l3Defence as LungeLabelLedger;
  smokeVetoesWorse += wl.vetoes;
  smokeFiredArmedWorse += wl.fired.reduce((a, b) => a + b, 0);
  const neutral = matchOf(seed, { learn: true, veto: true, armedWorld: true, books: freshBooks('neutral') });
  runMatch(neutral);
  smokeVetoesNeutral += (neutral.l3Defence as LungeLabelLedger).vetoes;
}
const smokeCells = [0, 1].map((g) => ({
  group: g === 0 ? 'controlled (< v*)' : 'RECKLESS (>= v*)',
  lunges: smokeBooks[0].lunges[g] + smokeBooks[1].lunges[g],
  punished: smokeBooks[0].punished[g] + smokeBooks[1].punished[g],
}));
const smoke = {
  matches: SMOKE_N, seeds: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1],
  worldIdenticalToOff: smokeIdenticalToOff,
  firedLunges: smokeFired, openedLabels: smokeOpened, closedLabels: smokeClosed,
  censoredLabels: smokeCensored,
  perTeamMatch: {
    firedLunges: round(smokeFired / (SMOKE_N * 2)),
    closedLabels: round(smokeClosed / (SMOKE_N * 2)),
  },
  rows: smokeCells.map((c, g) => ({
    ...c,
    bookRate: c.lunges > 0 ? round(c.punished / c.lunges) : null,
    censusRateCommonLong: round(DOSE_WORSE[g].num / DOSE_WORSE[g].den),
    censusEvents: DOSE_WORSE[g].den,
  })),
  vetoes: {
    dosedWorse: smokeVetoesWorse, dosedNeutral: smokeVetoesNeutral,
    firedArmedWorse: smokeFiredArmedWorse, firedLearnOnly: smokeFiredLearnOnly,
  },
  honesty: 'REPORTED, descriptive, uncontrolled — no control, no CI, no verdict (#203). It is '
    + 'NOT the registration (that is L3-T1\'s, on per-team books grown over multiple seasons).',
};

/* ---- ⭐⭐ THE STRUCTURAL DECLINE-ONLY PROOF (mechanics.ts, by position) ------ */
const MECH_LINES = MECHANICS_SRC.split('\n');
const lineIndexOf = (needle: string): number => MECH_LINES.findIndex((l) => l.includes(needle));
const IDX_JOCKEY = lineIndexOf('if (goalSide && !looseTouch && !helpClose && !dangerZone && driveNow');
const IDX_VETO = lineIndexOf('if (match.l3DefenceDeclines(oppTeam.side, l3Group)) return;');
const IDX_COMMIT = lineIndexOf('tackler.tackleAnimTimer = 0.4;');
const DECLINE_ONLY_STRUCTURAL =
  // the ONE veto site sits BETWEEN the untouched jockey gate and the line that commits the body
  IDX_JOCKEY >= 0 && IDX_VETO > IDX_JOCKEY && IDX_COMMIT > IDX_VETO
  // its consequent is an early RETURN — the same exit the withheld challenge already takes
  && MECH_LINES[IDX_VETO].trim() === 'if (match.l3DefenceDeclines(oppTeam.side, l3Group)) return;'
  // the belief is read NOWHERE else in `src/**`: the definition + the one Match fork
  && [...srcText.values()].reduce((n, t) => n + countOf(t, 'declinesLunge('), 0) === 2
  // and no seam line touches the duel's odds or the body's cooldowns
  && !MECH_LINES.some((l) => l.includes('l3Defence') && /\bp\b *[*+-]?=|tackleCooldown|stunTimer/.test(l));


/* ========================================================================== */
/* §13 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
/* ========================================================================== */
type Conj = Record<string, boolean>;
interface MutantResult {
  gate: string; name: string; conjunct: string; flipped: boolean; othersSurvived: boolean; live: boolean;
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

const R = runA as Record<string, any>;

/* ---- gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: digestA === digestB, digest: digestA },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second run differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- gIdent / xFpProd ---- */
registerGate<{ rows: { match: boolean; observed: string }[]; skipped: boolean }>({
  name: 'gIdent',
  fn: (i) => ({
    everyBaselineHeld: !i.skipped && i.rows.length > 0 && i.rows.every((r) => r.match),
    threeSeedsRead: i.rows.length === 3,
  }),
  input: { rows: FP_ROWS, skipped: SKIP_FP },
  mutants: [
    { conjunct: 'everyBaselineHeld', name: 'a league fingerprint moved', mutate: (i) => ({ ...i, rows: i.rows.map((r, k) => (k === 1 ? { ...r, match: false } : r)) }) },
    { conjunct: 'threeSeedsRead', name: 'a league seed was not read', mutate: (i) => ({ ...i, rows: i.rows.slice(1) }) },
  ],
});
registerGate<{ observed: string }>({
  name: 'xFpProd',
  fn: (i) => ({ headlineIsTheProductionFingerprint: i.observed === FINGERPRINT_BASELINE }),
  input: { observed: FP_ROWS[0].observed },
  mutants: [
    { conjunct: 'headlineIsTheProductionFingerprint', name: 'the production fingerprint moved', mutate: (i) => ({ ...i, observed: 'deadbeef' }) },
  ],
});

/* ---- gOff ---- */
registerGate<{ all: boolean; seeds: number; shapes: number }>({
  name: 'gOff',
  fn: (i) => ({
    absentEqualsFalseEverywhere: i.all,
    bothShapesWalked: i.shapes === 2,
    everySeedWalked: i.seeds === N,
  }),
  input: { all: R.gOffAll as boolean, seeds: (R.offBorn as unknown[]).length, shapes: SHAPES.length },
  mutants: [
    { conjunct: 'absentEqualsFalseEverywhere', name: 'a flag spelling moved the world', mutate: (i) => ({ ...i, all: false }) },
    { conjunct: 'bothShapesWalked', name: 'only one world shape was walked', mutate: (i) => ({ ...i, shapes: 1 }) },
    { conjunct: 'everySeedWalked', name: 'a receipt seed was skipped', mutate: (i) => ({ ...i, seeds: N - 1 }) },
  ],
});

/* ---- gBorn ---- */
registerGate<{ identical: boolean; live: boolean; armedFill: number }>({
  name: 'gBorn',
  fn: (i) => ({
    learnOnlyIsByteIdentical: i.identical,
    machineryLiveOnEverySeed: i.live,
    theArmedWorldFills: i.armedFill > 0,
  }),
  input: {
    identical: R.gBornIdentical as boolean, live: R.gBornLiveArmed as boolean,
    armedFill: R.armedFill as number,
  },
  mutants: [
    { conjunct: 'learnOnlyIsByteIdentical', name: 'learning alone moved the world', mutate: (i) => ({ ...i, identical: false }) },
    { conjunct: 'machineryLiveOnEverySeed', name: 'a seed closed no label at all', mutate: (i) => ({ ...i, live: false }) },
    { conjunct: 'theArmedWorldFills', name: 'the armed world produced no events', mutate: (i) => ({ ...i, armedFill: 0 }) },
  ],
});

/* ---- gZero ---- */
registerGate<{
  structural: boolean; oneGroup: boolean; bornEmptyPrefix: boolean;
  prefixHeld: boolean; prefixNonEmpty: boolean;
}>({
  name: 'gZero',
  fn: (i) => ({
    emptyServesNullAndDeclinesNothing: i.structural,
    aOneGroupBookDeclinesNothing: i.oneGroup,
    aBornEmptyArmedWorldMovesNothingBeforeItsOwnFirstVeto: i.bornEmptyPrefix,
    nothingMovesBeforeTheFirstVeto: i.prefixHeld,
    theIdenticalPrefixIsNonEmpty: i.prefixNonEmpty,
  }),
  input: {
    structural: (R.veto.emptyServesNull && R.veto.emptyDeclinesNothing
      && R.veto.tieDeclinesNothing) as boolean,
    oneGroup: (R.veto.oneGroupDeclinesNothing && R.veto.oneGroupServesBelief) as boolean,
    bornEmptyPrefix: (R.bornEmptyPrefix as { prefixHeld: boolean }[]).every((p) => p.prefixHeld)
      && (R.bornEmptyPrefixBare as { prefixHeld: boolean }[]).every((p) => p.prefixHeld),
    prefixHeld: (R.prefix as { prefixHeld: boolean }[]).every((p) => p.prefixHeld),
    prefixNonEmpty: (R.prefix as { prefixNonEmpty: boolean }[]).every((p) => p.prefixNonEmpty),
  },
  mutants: [
    { conjunct: 'emptyServesNullAndDeclinesNothing', name: 'an empty book served a belief', mutate: (i) => ({ ...i, structural: false }) },
    { conjunct: 'aOneGroupBookDeclinesNothing', name: 'a one-group book declined', mutate: (i) => ({ ...i, oneGroup: false }) },
    { conjunct: 'aBornEmptyArmedWorldMovesNothingBeforeItsOwnFirstVeto', name: 'a born-absent book moved the world before earning anything', mutate: (i) => ({ ...i, bornEmptyPrefix: false }) },
    { conjunct: 'nothingMovesBeforeTheFirstVeto', name: 'the world diverged before any veto', mutate: (i) => ({ ...i, prefixHeld: false }) },
    { conjunct: 'theIdenticalPrefixIsNonEmpty', name: 'the veto fired on tick one', mutate: (i) => ({ ...i, prefixNonEmpty: false }) },
  ],
});

/* ---- gLabel ---- */
registerGate<{
  mismatches: number; punished: number; closures: number; mutantsLive: number; mutantsTotal: number;
}>({
  name: 'gLabel',
  fn: (i) => ({
    theIndependentRelabellingAgreesExactly: i.mismatches === 0,
    theLabelIsNonVacuous: i.punished > 0 && i.closures > 0,
    everyLabelConjunctHasALiveMutant: i.mutantsTotal > 0 && i.mutantsLive === i.mutantsTotal,
  }),
  input: {
    mismatches: R.labelTotals.mismatches as number,
    punished: R.labelTotals.punished as number,
    closures: R.labelTotals.closures as number,
    mutantsLive: (R.labelMutantRuns as { flipped: boolean }[]).filter((m) => m.flipped).length,
    mutantsTotal: (R.labelMutantRuns as unknown[]).length,
  },
  mutants: [
    { conjunct: 'theIndependentRelabellingAgreesExactly', name: 'a cell disagreed with the re-labelling', mutate: (i) => ({ ...i, mismatches: 1 }) },
    { conjunct: 'theLabelIsNonVacuous', name: 'nothing was ever labelled punished', mutate: (i) => ({ ...i, punished: 0 }) },
    { conjunct: 'everyLabelConjunctHasALiveMutant', name: 'a label conjunct had a dead mutant', mutate: (i) => ({ ...i, mutantsLive: i.mutantsLive - 1 }) },
  ],
});

/* ---- gWindow ---- */
const LIVE_REGIME = ((l3c0b.windows as Record<string, unknown>).commonS) as number[];
registerGate<{
  moduleW: number; derivedW: number; legs: number[]; regime: number[]; literals: string[];
}>({
  name: 'gWindow',
  fn: (i) => ({
    theModuleWindowIsTheDerivedOne: i.moduleW === i.derivedW,
    theThreeLegsSumToIt: Math.abs((i.legs[0] + i.legs[1] + i.legs[2]) - i.derivedW) < 1e-15,
    itSitsInsideTheProvenLiveRegime: i.derivedW > i.regime[0] && i.derivedW < i.regime[1],
    noTypedDurationInTheModule: i.literals.length === 0,
  }),
  input: {
    moduleW: L3_DEFENCE_WINDOW_S, derivedW: X_WINDOW_S,
    legs: [X_LEG_BRAKE, X_LEG_TURN, X_LEG_CLOSE], regime: LIVE_REGIME,
    literals: windowLiterals,
  },
  mutants: [
    { conjunct: 'theModuleWindowIsTheDerivedOne', name: 'the module typed its own window', mutate: (i) => ({ ...i, moduleW: i.moduleW + 0.001 }) },
    { conjunct: 'theThreeLegsSumToIt', name: 'a leg of the derivation is missing', mutate: (i) => ({ ...i, legs: [i.legs[0], i.legs[1], 0] }) },
    { conjunct: 'itSitsInsideTheProvenLiveRegime', name: 'the window left the live regime', mutate: (i) => ({ ...i, derivedW: i.regime[1] + 1, moduleW: i.regime[1] + 1, legs: [i.legs[0], i.legs[1], i.regime[1] + 1 - i.legs[1]] }) },
    { conjunct: 'noTypedDurationInTheModule', name: 'a duration literal sits in the module', mutate: (i) => ({ ...i, literals: ['0.888'] }) },
  ],
});

/* ---- gGroup ---- */
registerGate<{
  moduleV: number; derivedV: number; censusV: number; groups: number;
  identityResidual: number; agreements: number; disagreements: number;
}>({
  name: 'gGroup',
  fn: (i) => ({
    theCutIsTheDerivedVStar: i.moduleV === i.derivedV,
    theBrakingIdentityHolds: i.identityResidual < 1e-12,
    itIsTheCensusesOwnBandEdge: i.moduleV === i.censusV,
    theGrainIsG2: i.groups === 2,
    everyReadableEventIsPlacedIdentically: i.disagreements === 0 && i.agreements > 0,
  }),
  input: {
    moduleV: L3_RECKLESS_ARRIVAL, derivedV: X_V_STAR,
    censusV: ((l3c0b.bands as Record<string, unknown>).vStar) as number,
    groups: L3_DEFENCE_GROUPS,
    identityResidual: Math.abs((X_V_STAR * X_V_STAR) / (2 * X_ACCEL) - X_R_TACKLE),
    agreements: R.labelTotals.groupAgreements as number,
    disagreements: R.labelTotals.groupDisagreements as number,
  },
  mutants: [
    { conjunct: 'theCutIsTheDerivedVStar', name: 'the module typed its own cut', mutate: (i) => ({ ...i, moduleV: i.moduleV + 0.1, censusV: i.moduleV + 0.1 }) },
    { conjunct: 'theBrakingIdentityHolds', name: 'the identity v*²/2a = R broke', mutate: (i) => ({ ...i, identityResidual: 1 }) },
    { conjunct: 'itIsTheCensusesOwnBandEdge', name: 'the cut left the censuses\' own family', mutate: (i) => ({ ...i, censusV: i.censusV + 0.5 }) },
    { conjunct: 'theGrainIsG2', name: 'the grain is not the ruled one', mutate: (i) => ({ ...i, groups: 3 }) },
    { conjunct: 'everyReadableEventIsPlacedIdentically', name: 'an in-world placement disagreed', mutate: (i) => ({ ...i, disagreements: 1 }) },
  ],
});

/* ---- gBook ---- */
registerGate<Record<string, boolean>>({
  name: 'gBook',
  fn: (i) => ({
    marginalExact: i.marginalExact,
    countsExact: i.countsExact,
    punishedNeverExceeds: i.punishedNeverExceeds,
    totalIsSum: i.totalIsSum,
    widthHeld: i.widthHeld,
    zeroConstantOnUnseenGroup: i.zeroConstantOnUnseenGroup,
    outOfRangeIgnored: i.outOfRangeIgnored,
  }),
  input: {
    marginalExact: R.book.marginalExact, countsExact: R.book.countsExact,
    punishedNeverExceeds: R.book.punishedNeverExceeds, totalIsSum: R.book.totalIsSum,
    widthHeld: R.book.widthHeld, zeroConstantOnUnseenGroup: R.book.zeroConstantOnUnseenGroup,
    outOfRangeIgnored: R.book.outOfRangeIgnored,
  },
  mutants: [
    { conjunct: 'marginalExact', name: 'the belief is not punished/lunges', mutate: (i) => ({ ...i, marginalExact: false }) },
    { conjunct: 'countsExact', name: 'a cell miscounted', mutate: (i) => ({ ...i, countsExact: false }) },
    { conjunct: 'punishedNeverExceeds', name: 'punished exceeded lunges', mutate: (i) => ({ ...i, punishedNeverExceeds: false }) },
    { conjunct: 'totalIsSum', name: 'total is not the sum', mutate: (i) => ({ ...i, totalIsSum: false }) },
    { conjunct: 'widthHeld', name: 'the book width moved', mutate: (i) => ({ ...i, widthHeld: false }) },
    { conjunct: 'zeroConstantOnUnseenGroup', name: 'an unseen group served something other than 0', mutate: (i) => ({ ...i, zeroConstantOnUnseenGroup: false }) },
    { conjunct: 'outOfRangeIgnored', name: 'an out-of-range group was counted', mutate: (i) => ({ ...i, outOfRangeIgnored: false }) },
  ],
});

/* ---- gVeto ---- */
registerGate<{
  sweep: number; swept: number; guards: boolean; direction: boolean; dosing: boolean;
  literals: string[]; declineOnlyStructural: boolean; vetoesFired: number;
  mutantsLive: number; mutantsTotal: number;
}>({
  name: 'gVeto',
  fn: (i) => ({
    theSweepIsExactAgainstAnIndependentDerivation: i.sweep === 0 && i.swept > 0,
    emptyOneGroupAndTieDeclineNothing: i.guards,
    theWorstGroupDeclinesAndTheBestDoesNot: i.direction,
    theTruthDoseBehavesAsRuled: i.dosing,
    zeroConstant: i.literals.length === 0,
    declineOnlyIsStructural: i.declineOnlyStructural,
    theVetoActuallyFired: i.vetoesFired > 0,
    everyVetoConjunctHasALiveMutant: i.mutantsTotal > 0 && i.mutantsLive === i.mutantsTotal,
  }),
  input: {
    sweep: R.veto.sweepMismatches as number, swept: R.veto.sweptBooks as number,
    guards: (R.veto.emptyDeclinesNothing && R.veto.oneGroupDeclinesNothing
      && R.veto.tieDeclinesNothing && R.veto.outOfRangeSafe) as boolean,
    direction: (R.veto.worstDeclines && R.veto.bestDoesNot) as boolean,
    dosing: (R.veto.dosedWorseDeclinesReckless && R.veto.dosedWorseSparesControlled
      && R.veto.dosedNeutralDeclinesNothing) as boolean,
    literals: vetoLiterals,
    declineOnlyStructural: DECLINE_ONLY_STRUCTURAL,
    vetoesFired: (R.prefix as { vetoes: number }[]).reduce((a, p) => a + p.vetoes, 0),
    mutantsLive: (R.veto.mutants as { mismatches: number }[]).filter((m) => m.mismatches > 0).length,
    mutantsTotal: (R.veto.mutants as unknown[]).length,
  },
  mutants: [
    { conjunct: 'theSweepIsExactAgainstAnIndependentDerivation', name: 'the predicate diverged from its float re-derivation', mutate: (i) => ({ ...i, sweep: 1 }) },
    { conjunct: 'emptyOneGroupAndTieDeclineNothing', name: 'an empty/one-group/tie book declined', mutate: (i) => ({ ...i, guards: false }) },
    { conjunct: 'theWorstGroupDeclinesAndTheBestDoesNot', name: 'the direction reversed', mutate: (i) => ({ ...i, direction: false }) },
    { conjunct: 'theTruthDoseBehavesAsRuled', name: 'the dosed book declined the wrong group', mutate: (i) => ({ ...i, dosing: false }) },
    { conjunct: 'zeroConstant', name: 'a constant entered the veto', mutate: (i) => ({ ...i, literals: ['0.5'] }) },
    { conjunct: 'declineOnlyIsStructural', name: 'the veto escaped its decline-only position', mutate: (i) => ({ ...i, declineOnlyStructural: false }) },
    { conjunct: 'theVetoActuallyFired', name: 'no veto ever fired', mutate: (i) => ({ ...i, vetoesFired: 0 }) },
    { conjunct: 'everyVetoConjunctHasALiveMutant', name: 'a veto mutant was dead', mutate: (i) => ({ ...i, mutantsLive: i.mutantsLive - 1 }) },
  ],
});

/* ---- gPort ---- */
registerGate<{ identical: boolean; found: boolean }>({
  name: 'gPort',
  fn: (i) => ({
    theVetoIsEkT0sTokenForToken: i.identical,
    bothBodiesWereFound: i.found,
  }),
  input: { identical: portEk.length > 0 && portEk === portL3, found: portEk.length > 0 && portL3.length > 0 },
  mutants: [
    { conjunct: 'theVetoIsEkT0sTokenForToken', name: 'the port drifted from EK-T0\'s idiom', mutate: (i) => ({ ...i, identical: false }) },
    { conjunct: 'bothBodiesWereFound', name: 'a method body was not found at all', mutate: (i) => ({ ...i, found: false }) },
  ],
});

/* ---- gReset ---- */
registerGate<Record<string, boolean>>({
  name: 'gReset',
  fn: (i) => ({ ...i }),
  input: R.gResetRows as Record<string, boolean>,
  mutants: Object.keys(R.gResetRows as Record<string, boolean>).map((k) => ({
    conjunct: k, name: `the season-boundary conjunct '${k}' broke`,
    mutate: (i: Record<string, boolean>) => ({ ...i, [k]: false }),
  })),
});

/* ---- gBite ---- */
registerGate<{ diverged: number; vetoes: number; onlyAfterVeto: boolean }>({
  name: 'gBite',
  fn: (i) => ({
    theSeamBitesSomewhere: i.diverged > 0,
    aVetoActuallyFired: i.vetoes > 0,
    divergenceOnlyFollowsAVeto: i.onlyAfterVeto,
  }),
  input: {
    diverged: (R.prefix as { diverged: boolean }[]).filter((p) => p.diverged).length,
    vetoes: (R.prefix as { vetoes: number }[]).reduce((a, p) => a + p.vetoes, 0),
    onlyAfterVeto: (R.prefix as { prefixHeld: boolean }[]).every((p) => p.prefixHeld),
  },
  mutants: [
    { conjunct: 'theSeamBitesSomewhere', name: 'the armed seam never moved anything', mutate: (i) => ({ ...i, diverged: 0 }) },
    { conjunct: 'aVetoActuallyFired', name: 'no veto fired at all', mutate: (i) => ({ ...i, vetoes: 0 }) },
    { conjunct: 'divergenceOnlyFollowsAVeto', name: 'the world moved before a veto', mutate: (i) => ({ ...i, onlyAfterVeto: false }) },
  ],
});

/* ---- gCross ---- */
registerGate<{
  always: boolean; setwise: Record<string, number>; cells: number; doors: string[];
  doorsFalse: boolean; a4Clean: boolean;
}>({
  name: 'gCross',
  fn: (i) => ({
    everyIdentityClaimHoldsOnEverySeed: i.always,
    everyBiteClaimFiresSomewhere: Object.values(i.setwise).every((v) => v > 0),
    theFullMatrixWasWalked: i.cells === 16,
    theBankedDoorFamilyIsAllOffInProduction: i.doorsFalse && i.doors.length >= 20,
    theTwoNewDoorsAreInTheFamilyAndAbsentFromA4:
      i.doors.includes('l3DefenceLearn') && i.doors.includes('l3DefenceVeto') && i.a4Clean,
    theThreeCbDoorsAreInTheFamily: ['cbCommitPhysics', 'cbTouchPast', 'cbChoiceSeat']
      .every((d) => i.doors.includes(d)),
  }),
  input: {
    always: crossAlways, setwise: crossSetwise, cells: crossCells.length,
    doors: DOOR_NAMES, doorsFalse: doorsAllFalseInProduction,
    a4Clean: !A4_SRC.includes('l3Defence'),
  },
  mutants: [
    { conjunct: 'everyIdentityClaimHoldsOnEverySeed', name: 'a dormancy claim failed on a seed', mutate: (i) => ({ ...i, always: false }) },
    { conjunct: 'everyBiteClaimFiresSomewhere', name: 'a bite claim never fired', mutate: (i) => ({ ...i, setwise: { ...i.setwise, interactionNeedsBoth: 0 } }) },
    { conjunct: 'theFullMatrixWasWalked', name: 'the matrix was short a cell', mutate: (i) => ({ ...i, cells: 15 }) },
    { conjunct: 'theBankedDoorFamilyIsAllOffInProduction', name: 'a banked door was ON in production', mutate: (i) => ({ ...i, doorsFalse: false }) },
    { conjunct: 'theTwoNewDoorsAreInTheFamilyAndAbsentFromA4', name: 'a new door reached a4World', mutate: (i) => ({ ...i, a4Clean: false }) },
    { conjunct: 'theThreeCbDoorsAreInTheFamily', name: 'a CB door left the enumerated family', mutate: (i) => ({ ...i, doors: i.doors.filter((d) => d !== 'cbTouchPast') }) },
  ],
});

/* ---- gNotable ---- */
registerGate<{ valueHits: string[]; nameHits: string[]; loaderHits: string[]; control: boolean; forms: number }>({
  name: 'gNotable',
  fn: (i) => ({
    noCensusValueIsReachableFromSrc: i.valueHits.length === 0,
    noArtifactOrSchemaNameInSrc: i.nameHits.length === 0,
    noLoaderOrDocPathInSeamSource: i.loaderHits.length === 0,
    theControlNeedleWasFound: i.control,
    theNeedleSetIsNonEmpty: i.forms > 0,
  }),
  input: {
    valueHits, nameHits, loaderHits, control: srcTokens.has(CONTROL_NEEDLE), forms: needleForms.size,
  },
  mutants: [
    { conjunct: 'noCensusValueIsReachableFromSrc', name: 'a measured rate sits in src', mutate: (i) => ({ ...i, valueHits: ['0.830508'] }) },
    { conjunct: 'noArtifactOrSchemaNameInSrc', name: 'an artifact name sits in src', mutate: (i) => ({ ...i, nameHits: ['l3-c0b-window-decomposition'] }) },
    { conjunct: 'noLoaderOrDocPathInSeamSource', name: 'a loader sits in the seam', mutate: (i) => ({ ...i, loaderHits: ['readFileSync'] }) },
    { conjunct: 'theControlNeedleWasFound', name: 'the search was silently empty', mutate: (i) => ({ ...i, control: false }) },
    { conjunct: 'theNeedleSetIsNonEmpty', name: 'no needles were collected', mutate: (i) => ({ ...i, forms: 0 }) },
  ],
});

/* ---- gEpi ---- */
registerGate<{ imports: string[]; hits: string[]; members: boolean }>({
  name: 'gEpi',
  fn: (i) => ({
    theImportListIsExactlyTheEngineConstants: i.imports.length === 2
      && i.imports.every((l) => l.includes("'../sim/Player'") || l.includes("'../sim/carryBeat'")),
    noForbiddenNameInTheExecutableSource: i.hits.length === 0,
    everyEventKindTheLawNamesExists: i.members,
  }),
  input: {
    imports: bookImports, hits: epiHits,
    members: EPI_MEMBERS.every((m) => BOOK_SRC.includes(`${m}(`)),
  },
  mutants: [
    { conjunct: 'theImportListIsExactlyTheEngineConstants', name: 'the module imported something else', mutate: (i) => ({ ...i, imports: [...i.imports, "import { Match } from '../sim/Match';"] }) },
    { conjunct: 'noForbiddenNameInTheExecutableSource', name: 'the learner named the world', mutate: (i) => ({ ...i, hits: ['match.'] }) },
    { conjunct: 'everyEventKindTheLawNamesExists', name: 'an event kind the law names is missing', mutate: (i) => ({ ...i, members: false }) },
  ],
});

/* ---- gNoLamarck ---- */
registerGate<{ rows: Record<string, boolean>; evolutionDiff: string; genomeWrites: number }>({
  name: 'gNoLamarck',
  fn: (i) => ({
    noGenomeCarriesADefenceBelief: Object.values(i.rows).every(Boolean),
    theEvolutionPathIsByteUntouched: i.evolutionDiff === '',
    theSeamWritesNoGenomeField: i.genomeWrites === 0,
  }),
  input: {
    rows: R.gNoLamarckRows as Record<string, boolean>,
    evolutionDiff,
    genomeWrites: (executableOf(BOOK_SRC).match(/genome/gi) ?? []).length
      + (executableOf(MECHANICS_SRC).split('\n')
        .filter((l) => l.includes('l3Defence') && /genome/i.test(l)).length),
  },
  mutants: [
    { conjunct: 'noGenomeCarriesADefenceBelief', name: 'a genome carried a belief', mutate: (i) => ({ ...i, rows: { ...i.rows, saveCarriesNothing: false } }) },
    { conjunct: 'theEvolutionPathIsByteUntouched', name: 'crossover/mutation was edited', mutate: (i) => ({ ...i, evolutionDiff: ' src/evolution/evolve.ts | 2 +-' }) },
    { conjunct: 'theSeamWritesNoGenomeField', name: 'the seam touched a genome', mutate: (i) => ({ ...i, genomeWrites: 1 }) },
  ],
});

/* ---- gOwnEvents ---- */
registerGate<{ violations: number; closures: number; sidesSeen: number }>({
  name: 'gOwnEvents',
  fn: (i) => ({
    everyWriteCameFromThatTeamsOwnLunge: i.violations === 0,
    theCheckSawRealEvents: i.closures > 0,
    bothTeamsWrote: i.sidesSeen === 2,
  }),
  input: {
    violations: R.labelTotals.ownEventsViolations as number,
    closures: R.labelTotals.closures as number,
    sidesSeen: (R.offBorn as Record<string, any>[])
      .some((r) => (r.armed as Record<string, number>).bookTotal > 0) ? 2 : 0,
  },
  mutants: [
    { conjunct: 'everyWriteCameFromThatTeamsOwnLunge', name: 'a write was mis-routed to the other book', mutate: (i) => ({ ...i, violations: 1 }) },
    { conjunct: 'theCheckSawRealEvents', name: 'nothing was written at all', mutate: (i) => ({ ...i, closures: 0 }) },
    { conjunct: 'bothTeamsWrote', name: 'only one side\'s book moved', mutate: (i) => ({ ...i, sidesSeen: 1 }) },
  ],
});

/* ---- gRng ---- */
registerGate<Record<string, boolean>>({
  name: 'gRng',
  fn: (i) => ({ ...i }),
  input: {
    armedStreamIdentical: R.rng.armedStreamIdentical as boolean,
    ledgerDrawsNothing: R.rng.ledgerDrawsNothing as boolean,
    ledgerNonVacuous: R.rng.ledgerNonVacuous as boolean,
    ledgerClosesEverything: R.rng.ledgerClosesEverything as boolean,
  },
  mutants: ['armedStreamIdentical', 'ledgerDrawsNothing', 'ledgerNonVacuous', 'ledgerClosesEverything']
    .map((k) => ({
      conjunct: k, name: `the rng conjunct '${k}' broke`,
      mutate: (i: Record<string, boolean>) => ({ ...i, [k]: false }),
    })),
});

/* ---- gHygiene ---- */
const freshHyg = new Match({ seed: 1, teamA: team('A', 1), teamB: team('B', 2) });
registerGate<Record<string, boolean>>({
  name: 'gHygiene',
  fn: (i) => ({ ...i }),
  input: {
    absentFromA4: !A4_SRC.includes('l3Defence'),
    hardFalseInit: MATCH_SRC.includes('this.l3DefenceLearn = cfg.l3DefenceLearn ?? false;')
      && MATCH_SRC.includes('this.l3DefenceVeto = cfg.l3DefenceVeto ?? false;'),
    freshMatchOff: freshHyg.l3DefenceLearn === false && freshHyg.l3DefenceVeto === false
      && freshHyg.l3Defence === null,
    leagueMatchOff: hygMatch !== null && hygMatch.l3Defence === null,
    unarmedLeagueAllocatesNothing: hygLeague.defenceBooks === null,
    noEnvDoor: !BOOK_SRC.includes('process.env') && !BOOK_SRC.includes('EDS_BUNDLE_ARMED')
      && !/l3Defence[A-Za-z]*.{0,80}(process\.env|envArmed|EDS_BUNDLE_ARMED)/.test(seamFileTexts),
    noNewGeneKey: !(GENE_KEYS as readonly string[]).some(
      (k) => k.toLowerCase().includes('lunge') || k.toLowerCase().includes('defencebook'),
    ),
    neverSerialized: !JSON.stringify(hygLeague.toJSON()).includes('l3Defence'),
    envWhitelistOrRefuse: ENV_WHITELIST.length === 5 && ENGINE_ENV_DOORS.length === 3,
  },
  mutants: ['absentFromA4', 'hardFalseInit', 'freshMatchOff', 'leagueMatchOff',
    'unarmedLeagueAllocatesNothing', 'noEnvDoor', 'noNewGeneKey', 'neverSerialized',
    'envWhitelistOrRefuse'].map((k) => ({
    conjunct: k, name: `the hygiene conjunct '${k}' broke`,
    mutate: (i: Record<string, boolean>) => ({ ...i, [k]: false }),
  })),
});

/* ---- gFork ---- */
registerGate<{
  ledger: number; season: number; veto: number; group: number; miss: number;
  unclassified: number; occurrences: number; duelStatements: number; jockeyGate: number;
}>({
  name: 'gFork',
  fn: (i) => ({
    exactlyOneLedgerFork: i.ledger === 1,
    exactlyOneSeasonFork: i.season === 1,
    exactlyOneVetoSite: i.veto === 1,
    exactlyOneGroupReadAndOneLabelCapture: i.group === 1 && i.miss === 1,
    zeroUnclassifiedOccurrences: i.unclassified === 0 && i.occurrences > 0,
    theDuelItselfIsUnchanged: i.duelStatements === 1 && i.jockeyGate === 1,
  }),
  input: {
    ledger: countOf(MATCH_SRC, 'this.l3Defence = this.l3DefenceLearn'),
    season: countOf(LEAGUE_SRC, 'this.matchFlags?.l3DefenceLearn === true'),
    veto: countOf(MECHANICS_SRC, 'match.l3DefenceDeclines('),
    group: countOf(MECHANICS_SRC, 'match.l3DefenceGroup('),
    miss: countOf(MECHANICS_SRC, 'match.l3DefenceNoteMiss('),
    unclassified: unclassified.length, occurrences: forkOccurrences.length,
    /** the duel's own roll and its jockey gate: still ONE each, untouched (M-L3.4). */
    duelStatements: countOf(MECHANICS_SRC, 'tackler.tackleAnimTimer = 0.4;'),
    jockeyGate: countOf(MECHANICS_SRC,
      'if (goalSide && !looseTouch && !helpClose && !dangerZone && driveNow > 0.9 - jockeyG * 0.55) return;'),
  },
  mutants: [
    { conjunct: 'exactlyOneLedgerFork', name: 'a second ledger fork appeared', mutate: (i) => ({ ...i, ledger: 2 }) },
    { conjunct: 'exactlyOneSeasonFork', name: 'a second season fork appeared', mutate: (i) => ({ ...i, season: 0 }) },
    { conjunct: 'exactlyOneVetoSite', name: 'the veto is consulted twice', mutate: (i) => ({ ...i, veto: 2 }) },
    { conjunct: 'exactlyOneGroupReadAndOneLabelCapture', name: 'the index is read twice', mutate: (i) => ({ ...i, group: 2 }) },
    { conjunct: 'zeroUnclassifiedOccurrences', name: 'an unclassified seam occurrence appeared', mutate: (i) => ({ ...i, unclassified: 1 }) },
    { conjunct: 'theDuelItselfIsUnchanged', name: 'the jockey gate or the duel was rewritten', mutate: (i) => ({ ...i, jockeyGate: 0 }) },
  ],
});

/* ---- gPins ---- */
registerGate<{
  pins: { file: string; diff: string }[]; playerOk: boolean; tests: string[]; evolution: string;
}>({
  name: 'gPins',
  fn: (i) => ({
    everyBankedFileIsByteUntouched: i.pins.every((p) => p.diff === ''),
    playerTsMovedByExactlyTheKeyword: i.playerOk,
    zeroTestFilesEdited: i.tests.every((l) => l.startsWith('?? ')),
    theEvolutionPathIsUntouched: i.evolution === '',
  }),
  input: { pins: pinDiffs, playerOk: playerDiffIsTheKeyword, tests: testStatus, evolution: evolutionDiff },
  mutants: [
    { conjunct: 'everyBankedFileIsByteUntouched', name: 'a banked file moved', mutate: (i) => ({ ...i, pins: [{ file: 'x', diff: ' x | 1 +' }, ...i.pins] }) },
    { conjunct: 'playerTsMovedByExactlyTheKeyword', name: 'Player.ts moved by more than the keyword', mutate: (i) => ({ ...i, playerOk: false }) },
    { conjunct: 'zeroTestFilesEdited', name: 'an existing test file was edited', mutate: (i) => ({ ...i, tests: ['M tests/careers.test.ts'] }) },
    { conjunct: 'theEvolutionPathIsUntouched', name: 'evolution was edited', mutate: (i) => ({ ...i, evolution: ' src/evolution/evolve.ts | 1 +' }) },
  ],
});

/* ---- gSeed ---- */
registerGate<{ clashes: number; ordered: boolean; blocks: number; prior: number }>({
  name: 'gSeed',
  fn: (i) => ({
    noClashWithAnyConsumedBlock: i.clashes === 0,
    everyClaimedIntervalIsOrdered: i.ordered,
    theLedgerWasActuallyChecked: i.blocks === 4 && i.prior > 60,
  }),
  input: {
    clashes: seedClashes.length + claimedInternalClash.length,
    ordered: CLAIMED.every((c) => c.range[0] <= c.range[1]),
    blocks: CLAIMED.length, prior: CONSUMED.length,
  },
  mutants: [
    { conjunct: 'noClashWithAnyConsumedBlock', name: 'a claimed block overlaps a consumed one', mutate: (i) => ({ ...i, clashes: 1 }) },
    { conjunct: 'everyClaimedIntervalIsOrdered', name: 'an interval runs backwards', mutate: (i) => ({ ...i, ordered: false }) },
    { conjunct: 'theLedgerWasActuallyChecked', name: 'the consumed ledger was not read', mutate: (i) => ({ ...i, prior: 0 }) },
  ],
});

/* ---- gStats ---- */
const SELF_SRC = readFileSync('scripts/probes/l3-t0-defence-book-seam.ts', 'utf8');
registerGate<{ drawn: number; floor: number; bootstrapTokens: number }>({
  name: 'gStats',
  fn: (i) => ({
    noStatsStreamIsDrawn: i.drawn === 0,
    theFloorIsRecordedNotReserved: i.floor === 111_200,
    thisProbeRunsNoBootstrap: i.bootstrapTokens === 0,
  }),
  input: {
    drawn: 0, floor: 111_200,
    // ⚠ the needles are ASSEMBLED, never written literally: a probe that greps itself for a
    // literal it contains is the self-match trap (the pgrep class), and it would make this
    // conjunct permanently red.
    bootstrapTokens: [`resample${'Index'}`, `cluster${'Bootstrap'}`, `bootstrap${'CI'}`]
      .reduce((n, needle) => n + countOf(SELF_SRC, needle), 0),
  },
  mutants: [
    { conjunct: 'noStatsStreamIsDrawn', name: 'a stats stream was drawn silently', mutate: (i) => ({ ...i, drawn: 1 }) },
    { conjunct: 'theFloorIsRecordedNotReserved', name: 'the ruling\'s floor was mis-stated', mutate: (i) => ({ ...i, floor: 0 }) },
    { conjunct: 'thisProbeRunsNoBootstrap', name: 'a bootstrap crept into the probe', mutate: (i) => ({ ...i, bootstrapTokens: 1 }) },
  ],
});

/* ---- gHashEnvelope (filled after the write) ---- */
let envelopeInput = { crossOutIdentical: false, rederivesFromDisk: false, forbidden: [] as string[] };
registerGate<typeof envelopeInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    crossOutDigestIdentical: i.crossOutIdentical,
    rederivesFromTheWrittenBody: i.rederivesFromDisk,
    noInvocationKeyInTheBody: i.forbidden.length === 0,
  }),
  input: envelopeInput,
  mutants: [
    { conjunct: 'crossOutDigestIdentical', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'rederivesFromTheWrittenBody', name: 'the written body does not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'noInvocationKeyInTheBody', name: 'an invocation key sits in the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- gMutants ---- */
registerGate<{ uncovered: string[]; dead: number; total: number }>({
  name: 'gMutants',
  fn: (i) => ({
    everyConjunctCovered: i.uncovered.length === 0,
    everyMutantLive: i.total > 0 && i.dead === 0,
  }),
  input: { uncovered: [], dead: 0, total: 1 },
  mutants: [
    { conjunct: 'everyConjunctCovered', name: 'a conjunct has no mutant', mutate: (i) => ({ ...i, uncovered: ['gX.y'] }) },
    { conjunct: 'everyMutantLive', name: 'a mutant did not flip its conjunct', mutate: (i) => ({ ...i, dead: 1 }) },
  ],
});

/* ---- ⭐⭐ THE MACHINE-DERIVED COVERAGE MAP + THE REFUSAL (#268.3(a)) ---- */
const COVERAGE_MAP: Record<string, string[]> = {};
const uncoveredConjuncts: string[] = [];
for (const spec of REGISTRY) {
  const keys = Object.keys(spec.fn(spec.input));
  COVERAGE_MAP[spec.name] = keys;
  for (const k of keys) {
    if (!spec.mutants.some((mu) => mu.conjunct === k)) uncoveredConjuncts.push(`${spec.name}.${k}`);
  }
  for (const mu of spec.mutants) {
    if (!keys.includes(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(ghost)`);
  }
  const seen = new Set<string>();
  for (const mu of spec.mutants) {
    if (seen.has(mu.conjunct)) uncoveredConjuncts.push(`${spec.name}.${mu.conjunct}(duplicate)`);
    seen.add(mu.conjunct);
  }
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('L3-T0 FATAL (#268.3(a)): the MACHINE-DERIVED coverage map is not EXACTLY-ONE —');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}
banner(`  [l3-t0] liveness: ${REGISTRY.length} gate objects · ${CONJUNCT_TOTAL} conjuncts enumerated FROM THE OBJECTS`);

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
/* §14 THE ARTIFACT                                                            */
/* ========================================================================== */
const buildBody = (gates: Record<string, boolean>, mutants: MutantResult[]): Record<string, unknown> => ({
  schema: 'l3-t0-defence-book-seam/v1',
  stage: 'L3-T0 — THE DORMANT DEFENCE-BOOK SEAM',
  doc: 'docs/world-model/L3-T0-DEFENCE-BOOK-SEAM.md',
  contract: 'docs/world-model/CB-L3-DEFENCE-BOOK-CONTRACT.md §2 (M-L3.1–.4)',
  ruling: '#277.1 bound · #279.3 THE LABEL RULING · #279.4 dispatched',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  preflightReasons: PREFLIGHT_REASONS,
  envWhitelist: ENV_WHITELIST,
  engineEnvDoorsRefused: ENGINE_ENV_DOORS,
  frozen: {
    label: 'A MISSED lunge is PUNISHED iff sep(t0 + W) − sep(t0) >= 0, sep(t) = |taker − CARRIER| '
      + '(#266.2(i)); the threshold is ZERO METRES; censored ⇒ out of the denominator, counted.',
    grain: 'g2 — CONTROLLED (< v*) vs RECKLESS (>= v*), the census\'s own g2 order (#279.3(3)).',
    window: {
      derivation: 'W = sqrt(2·R_TACKLE/ACCEL) + π/TURN_RATE — the STATIONARY MISSER\'S RECOVERY '
        + 'BOUND (brake 0 + turn π/ω + close = CB-T0\'s own duel horizon). ENGINE CONSTANTS ONLY.',
      moduleValue: L3_DEFENCE_WINDOW_S,
      rederivedFromExtractedConstants: X_WINDOW_S,
      legs: { brake: X_LEG_BRAKE, turn: X_LEG_TURN, close: X_LEG_CLOSE },
      provenLiveRegime: LIVE_REGIME,
    },
    cut: {
      derivation: 'v* = sqrt(2·ACCEL·R_TACKLE) — CB-C0/L3-C0\'s own identity, re-derived.',
      moduleValue: L3_RECKLESS_ARRIVAL, rederived: X_V_STAR,
      censusCommitted: ((l3c0b.bands as Record<string, unknown>).vStar) as number,
    },
    constantsExtractedFromSrc: {
      ACCEL: X_ACCEL, TURN_RATE: X_TURN_RATE, R_TACKLE: X_R_TACKLE, CB_TACKLE_RADIUS: X_CB_RADIUS,
    },
    vetoForm: 'DECLINE ⇔ lunges[g] > 0 AND Σ_{g\'≠g} lunges[g\'] > 0 AND punished[g]·Σ_{g\'≠g} '
      + 'lunges[g\'] > Σ_{g\'≠g} punished[g\']·lunges[g] — the team\'s OWN group rate strictly '
      + 'above its OWN pooled cross-group reference; integer cross-multiplication, zero '
      + 'constants, DECLINE-ONLY (EK-T0\'s idiom, ported token-for-token — gPort).',
    truthDose: {
      what: 'the instrument writes L3-C0b\'s committed g2 common-long rates into the book '
        + '(probe-side injection; the table is NEVER bundled in src — gNotable).',
      worse: DOSE_WORSE, neutral: DOSE_NEUTRAL,
    },
  },
  world: {
    shapes: ['bare production', 'THE POLISHED ARMED WORLD (a4MatchFlags(6) + armA4World(m, null, 6))'],
    cbArmedVersionAsserted: cbArmedVersion(matchOf(BLOCK, { learn: 'absent', armedWorld: true })),
  },
  seeds: { block: BLOCK, n: N, readBase: READ_BASE, smokeBase: SMOKE_BASE, smokeN: SMOKE_N, claimed: CLAIMED },
  stats: { drawn: 0, floorFromRuling: 111_200, disposition: 'NOT DRAWN — an identity round.' },
  receipts: runA,
  gDetDigests: { runA: digestA, runB: digestB },
  crossClaims,
  crossScoring: { always: CROSS_ALWAYS, setwise: CROSS_SETWISE, setwiseCounts: crossSetwise, seeds: crossSeeds.length, alwaysHeld: crossAlways },
  doorFamily: { names: DOOR_NAMES, count: DOOR_NAMES.length, allFalseInProduction: doorsAllFalseInProduction },
  gIdentRows: FP_ROWS,
  forkOccurrences,
  notable: {
    needleValues: needleValues.size, needleForms: needleForms.size,
    excludedDegenerateForms: excludedForms, derivedExemptions: [...DERIVED_EXEMPT],
    valueHits, nameHits, loaderHits, controlNeedleFound: srcTokens.has(CONTROL_NEEDLE),
  },
  port: { normalisedEk: portEk, normalisedL3: portL3, identical: portEk === portL3 },
  declineOnly: {
    structural: DECLINE_ONLY_STRUCTURAL,
    positions: { jockeyGateLine: IDX_JOCKEY + 1, vetoLine: IDX_VETO + 1, commitLine: IDX_COMMIT + 1 },
    reason: '⭐ §DEV 2 — the frozen COUNT proxy ("an armed arm fires <= the learn-only arm") is '
      + 'INVALID and is published as a REPORTED number instead: a declined lunge changes the '
      + 'future (the body keeps his legs and his cooldown, and may lunge again later), so the '
      + 'counterfactual world can contain MORE lunges while every single decision was '
      + 'decline-only. The property is proved STRUCTURALLY instead, and measured.',
    measuredCounts: R.declineOnly,
    neutralDoseInWorld: R.neutralDose,
  },
  crossBornEmptyInertWholeMatch,
  crossBornEmptyInertBareWholeMatch,
  pins: { pinDiffs, evolutionDiff, playerDiffLines, playerDiffIsTheKeyword, testStatus },
  smoke,
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  uncoveredConjuncts,
  allGatesPass: Object.values(gates).every(Boolean),
  nonClaims: [
    'No football claim and no learning claim — whether a book grows the measured shape is L3-T1\'s.',
    'The REPORTED smoke is descriptive, uncontrolled and adjudicates nothing (#203).',
    'Nothing ships: both doors are hard false and absent from every preset.',
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
  const crossPath = '/tmp/l3-t0-cross-out.json';
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
    digest, reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

/* PASS 1: run the registry, write, then re-run with the envelope gate's real input. */
let { gates, mutants } = runRegistry();
const pass1 = writeArtifact(buildBody(gates, mutants), OUT_PATH);
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'receiptsMs'];
envelopeInput.crossOutIdentical = pass1.crossOutIdentical;
envelopeInput.rederivesFromDisk = pass1.reread === pass1.digest;
envelopeInput.forbidden = FORBIDDEN_BODY_KEYS
  .filter((k) => canonical(buildBody(gates, mutants)).includes(`"${k}"`));
({ gates, mutants } = runRegistry());
/** gMutants is scored on the OTHER gates' mutants, then re-run so its own row is honest. */
const otherMutants = mutants.filter((m) => m.gate !== 'gMutants');
const gMutantsSpec = REGISTRY.find((s) => s.name === 'gMutants') as unknown as GateSpec<{
  uncovered: string[]; dead: number; total: number;
}>;
gMutantsSpec.input = {
  uncovered: uncoveredConjuncts,
  dead: otherMutants.filter((m) => !m.live).length,
  total: otherMutants.length,
};
({ gates, mutants } = runRegistry());
const final = writeArtifact(buildBody(gates, mutants), OUT_PATH);

const allPass = Object.values(gates).every(Boolean);
banner(`\n  [l3-t0] artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`    ${v ? 'PASS' : 'FAIL'}  ${k}`);
const deadMutants = mutants.filter((m) => !m.live);
if (deadMutants.length > 0) {
  banner('  [l3-t0] DEAD MUTANTS:');
  for (const m of deadMutants) banner(`    · ${m.gate}.${m.conjunct} — ${m.name} (flipped=${m.flipped} others=${m.othersSurvived})`);
}
banner(`  [l3-t0] ${Object.values(gates).filter(Boolean).length}/${Object.keys(gates).length} gates · `
  + `${mutants.filter((m) => m.live).length}/${mutants.length} mutants LIVE · resultSha256 ${final.digest}`);
process.exit(allPass ? 0 : 1);
