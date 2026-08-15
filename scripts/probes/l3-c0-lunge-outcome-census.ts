/**
 * L3-C0 — THE LUNGE-OUTCOME CENSUS (docs/world-model/L3-C0-LUNGE-OUTCOME-CENSUS.md).
 *
 * Contract CB-L3-DEFENCE-BOOK-CONTRACT.md §3 L3-C0, dispatched by ruling #277.2. INSTRUMENT-ONLY:
 * `src/**` is byte-untouched (a HARD gate, WORKTREE vs HEAD per #273.3). The world measured is
 * THE POLISHED ARMED WORLD — the play entry's own arming (`a4MatchFlags(6)` + `armA4World(m, null,
 * 6)`, `cbArmedVersion === 6` asserted), i.e. the #273 truth.
 *
 * WHAT IT MEASURES, per ARRIVAL BAND of the lunger (his OWN velocity at the decision — the
 * self-percept the book will index by):
 *   1 lunge rates · P(won | lunged, band) · the geometric-miss (χ = 0) share
 *   2 THE PUNISHMENT CANDIDATES for every MISSED lunge — (a) the recovery interval the engine's
 *     own law made him pay, (b) the carrier RETAINED / GAINED at a CARRIER-ANCHORED t0
 *     (#266.2(i)), (c) a concession-within-window label whose window and loss semantics are
 *     TRACED from the banked census family (DV-C0's committed primary + ladder, the #218 family)
 *   3 the withheld-challenge baseline per band (the refusal tick density)
 *   4 the event-rate arithmetic (per band per team per match) L3-T0's sizing needs (#256.3)
 *
 * ⭐ NOTHING IS RE-TYPED. Every engine constant is EXTRACTED from `src/**` at run time; χ and the
 * recovery interval are RE-DERIVED here independently (never imported from `carryBeat.ts`) and
 * gate-checked against the ENGINE'S OWN in-engine ledger; the loss semantics are DV-C0's own
 * segment walker, proved by re-walking DV-C0's committed smoke block.
 *
 * ⭐ ENV — WHITELIST-OR-REFUSE (#261.2 / #262.2), including the ENGINE's own doors:
 *   accepted: L3C0_MODE (sizing|full, REQUIRED) · L3C0_N · L3C0_SIZING_N · L3C0_SKIP_FP · L3C0_OUT
 * Anything else `L3C0_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override makes
 * the run a PREFLIGHT: it is routed onto the GUARD block, `gEnvClean` goes RED, and a canonical
 * repo path may never be written.
 *
 * RUN: L3C0_MODE=sizing npx tsx scripts/probes/l3-c0-lunge-outcome-census.ts
 *      L3C0_MODE=full   npx tsx scripts/probes/l3-c0-lunge-outcome-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, MATCH_DURATION } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { a4MatchFlags, armA4World, cbArmedVersion } from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE + THE PREFLIGHT ROUTING                        */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const ENV_WHITELIST = ['L3C0_MODE', 'L3C0_N', 'L3C0_SIZING_N', 'L3C0_SKIP_FP', 'L3C0_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'EDS_SCALE_PITCH', 'EDS_SCALE_SPEED', 'EDS_SCALE_BALL', 'EDS_SCALE_TIME', 'EDS_SCALE_STAMINA',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE',
] as const;
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('L3C0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  banner(`L3-C0 FATAL: unrecognised env ${rogue.join(', ')} — whitelist-or-refuse (#261.2)`);
  process.exit(2);
}
const doorsSet = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (doorsSet.length > 0) {
  banner(`L3-C0 FATAL: the ENGINE's own doors are set (${doorsSet.join(', ')}) — refused (#262.2)`);
  process.exit(2);
}
const MODES = ['sizing', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.L3C0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner('L3-C0 FATAL: L3C0_MODE is REQUIRED and must be one of sizing|full');
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.L3C0_N);
const SIZING_N_ENV = intEnv(process.env.L3C0_SIZING_N);
const SKIP_FP = process.env.L3C0_SKIP_FP === '1';
const OUT_ENV = process.env.L3C0_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'L3C0_N', set: N_ENV !== null },
  { name: 'L3C0_SIZING_N', set: SIZING_N_ENV !== null },
  { name: 'L3C0_SKIP_FP', set: SKIP_FP },
  { name: 'L3C0_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const SIZING_PATH = 'docs/world-model/data/l3-c0-lunge-outcome-census-sizing.json';
const FULL_PATH = 'docs/world-model/data/l3-c0-lunge-outcome-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === CANONICAL_DIR_ABS || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const DEFAULT_OUT = MODE === 'sizing' ? SIZING_PATH : FULL_PATH;
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? `/tmp/l3-c0-preflight-${MODE}.json` : DEFAULT_OUT);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner(`L3-C0 FATAL: a PREFLIGHT may not write a canonical repo path (${OUT_PATH}) — #262.2`);
  process.exit(2);
}
const t0Wall = Date.now();

/* ========================================================================== */
/* §1 SMALL TOOLS                                                              */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
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
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** d) / 10 ** d : Number.NaN);
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const meanOf = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const hyp = (x: number, y: number): number => Math.sqrt(x * x + y * y);
const quantileSorted = (a: readonly number[], q: number): number => {
  if (a.length === 0) return Number.NaN;
  const i = (a.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (i - lo);
};
const readJson = (p: string): Record<string, unknown> =>
  JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;

/* ========================================================================== */
/* §2 ⭐⭐ THE TRACED ENGINE CONSTANTS — read out of the ENGINE'S OWN SOURCE     */
/* ========================================================================== */
const MECH_PATH = 'src/sim/mechanics.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const CARRYBEAT_PATH = 'src/sim/carryBeat.ts';
const LEAGUE_PATH = 'src/sim/League.ts';
const SELF_PATH = 'scripts/probes/l3-c0-lunge-outcome-census.ts';
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const PLAYER_SRC = readFileSync(PLAYER_PATH, 'utf8');
const CB_SRC = readFileSync(CARRYBEAT_PATH, 'utf8');
const LEAGUE_SRC = readFileSync(LEAGUE_PATH, 'utf8');
const SELF_SHA = sha(readFileSync(SELF_PATH, 'utf8'));
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
const fnBody = (src: string, name: string): string => {
  const i = src.indexOf(`export function ${name}(`);
  if (i < 0) return '';
  const j = src.indexOf('\n}', i);
  return j < 0 ? '' : src.slice(i, j + 2);
};
const TRY_TACKLES_SRC = fnBody(MECH_SRC, 'tryTackles');
const ARMED_BRANCH_SRC = (() => {
  const i = TRY_TACKLES_SRC.indexOf('const cbArmed = match.cbCommitPhysics;');
  return i < 0 ? '' : TRY_TACKLES_SRC.slice(i);
})();
const MISS_BRANCH_SRC = (() => {
  const i = TRY_TACKLES_SRC.indexOf('  } else {');
  return i < 0 ? '' : TRY_TACKLES_SRC.slice(i);
})();
/** the challenge radius — the candidate scan's own bound. */
const R_TACKLE = extractNum(TRY_TACKLES_SRC, /if \(d < ([\d.]+) && d < best\)/);
/** the INCUMBENT miss price (the flat pair the armed branch replaces) — still the traced horizon. */
const MISS_COOLDOWN_S = extractNum(MISS_BRANCH_SRC, /tackler\.tackleCooldown = ([\d.]+);/);
const MISS_STUN_S = extractNum(MISS_BRANCH_SRC, /tackler\.stunTimer = ([\d.]+);/);
const WIN_COOLDOWN_S = extractNum(TRY_TACKLES_SRC, /tackler\.tackleCooldown = (0\.5);/);
/** the other five writers of `tackleCooldown` — traced so no jump can be misread. */
const SLIDE_COOLDOWN_S = extractNum(MECH_SRC, /slider\.tackleCooldown = ([\d.]+);/);
const GRAB_COOLDOWN_S = extractNum(MECH_SRC, /grabber\.tackleCooldown = ([\d.]+);/);
const SMOTHER_COOLDOWN_S = extractNum(MECH_SRC, /gk\.tackleCooldown = (1\.2);/);
const GK_AERIAL_COOLDOWN_S = extractNum(MECH_SRC, /gk\.tackleCooldown = (0\.9);/);
const SMOTHER_STUN_S = extractNum(MECH_SRC, /gk\.stunTimer = ([\d.]+); \/\/ beaten/);
const SLIDE_WIN_STUN_S = extractNum(MECH_SRC, /slider\.stunTimer = ([\d.]+); \/\/ he won it/);
const SLIDE_MISS_STUN_S = extractNum(MECH_SRC, /slider\.stunTimer = ([\d.]+); \/\/ beaten and grounded/);
const TACKLE_COOLDOWN_WRITERS = [...MECH_SRC.matchAll(/\.tackleCooldown = /g)].length;
/** the body's own acceleration constant, and the CB module's own copy of the challenge radius. */
const ACCEL = extractNum(PLAYER_SRC, /^const ACCEL = ([\d.]+);/m);
const CB_TACKLE_RADIUS_SRC = extractNum(CB_SRC, /export const CB_TACKLE_RADIUS = ([\d.]+);/);
/** the season's own fixture count per team (the round-robin the League schedules). */
const TEAMS_PER_DIVISION = extractNum(LEAGUE_SRC, /^const TEAMS_PER_DIVISION = (\d+);/m);
const SEASON_FIXTURES_PER_TEAM = TEAMS_PER_DIVISION - 1;
/** the display clock (R-乙's CLOCK_LAW mapping, both terms extracted, never typed as a level). */
const DISPLAY_MINUTES = extractNum(readFileSync('src/sim/Match.ts', 'utf8'),
  /Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)/);
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;

/* ========================================================================== */
/* §3 ⭐⭐ THE FROZEN BANDS — CB-C0's OWN v* FAMILY, re-derived from §2          */
/* ========================================================================== */
/**
 * v* = sqrt(2 · a · R) — the arrival that cannot be braked inside the challenge radius (CB-C0
 * §BINS' identity, re-derived here from the same two traced constants). The five bands are the
 * QUARTERS of v*, CB-C0's own family; band 4 IS the overcommitted class.
 *
 * ⭐ THE BAND IS READ AT THE LUNGE DECISION AS THE LUNGER'S OWN VELOCITY — the self-percept
 * (M-L3.1: the book indexes what the chooser reads; the #256.2 commensurability rule at source).
 */
const V_STAR = Math.sqrt(2 * ACCEL * R_TACKLE);
const BAND_CUTS = [0.25, 0.5, 0.75, 1].map((f) => f * V_STAR);
const BAND_LABELS = ['b0 walk', 'b1 jog', 'b2 run', 'b3 drive', 'b4 OVERCOMMITTED'] as const;
const NB = BAND_LABELS.length;
const bandOf = (v: number): number => {
  for (let i = 0; i < BAND_CUTS.length; i++) if (v < BAND_CUTS[i]) return i;
  return BAND_CUTS.length;
};
/** ⭐ THE COARSER GRAINS — UNIONS of the five, never new cuts (the T2-C0 rarity lesson). */
const GRAINS: Record<string, number[][]> = {
  g5: [[0], [1], [2], [3], [4]],
  g3: [[0, 1], [2, 3], [4]],
  g2: [[0, 1, 2, 3], [4]],
};
const GRAIN_LABELS: Record<string, string[]> = {
  g5: [...BAND_LABELS],
  g3: ['walk+jog', 'run+drive', 'OVERCOMMITTED'],
  g2: ['controlled (< v*)', 'OVERCOMMITTED (≥ v*)'],
};

/* ---- THE PUNISHMENT-CANDIDATE WINDOWS ------------------------------------ */
/** the loss semantics + window family, TRACED from the banked census family's own artifacts. */
const DVC0_FULL_PATH = 'docs/world-model/data/dv-c0-loss-cost.json';
const DVC0_SMOKE_PATH = 'docs/world-model/data/dv-c0-loss-cost-smoke.json';
const GGC_FULL_PATH = 'docs/world-model/data/goal-genealogy-census.json';
const DVC0_FULL = readJson(DVC0_FULL_PATH);
const GGC_FULL = readJson(GGC_FULL_PATH);
const DV_WINDOWS = ((DVC0_FULL.frozenDesign as Record<string, Record<string, unknown>>)
  .windows) as { primaryWindowS: number; windowsS: number[] };
const DV_FAMILY = (((GGC_FULL.frozenDesign as Record<string, Record<string, unknown>>)
  .definitions) as Record<string, number[]>).dangerWindowsS;
const PRIMARY_WINDOW_S = DV_WINDOWS.primaryWindowS;
/**
 * THE WINDOW LADDER, in report order. The first two are the ENGINE'S OWN duel horizons (the
 * incumbent re-challenge interval and twice it — CB-C0's H1/H2, traced from `mechanics.ts`); the
 * rest are DV-C0's committed ladder. `ownRecovery` is not in this list: it is a PER-EVENT window
 * (the recovery interval the engine's own law made THIS lunger pay) and is resolved beside them.
 */
const WINDOWS_S: number[] = [MISS_COOLDOWN_S, 2 * MISS_COOLDOWN_S, ...DV_WINDOWS.windowsS];
const NW = WINDOWS_S.length;
const PRIMARY_WINDOW_IDX = WINDOWS_S.indexOf(PRIMARY_WINDOW_S);
const MAX_WINDOW_TICKS = Math.ceil(Math.max(...WINDOWS_S) / DT);
const H1_TICKS = Math.round(MISS_COOLDOWN_S / DT);

/* ========================================================================== */
/* §4 THE SEED LEDGER (#163, booked = walked) — band 12,480,000–12,480,999     */
/* ========================================================================== */
const BAND_SEEDS: readonly [number, number] = [12_480_000, 12_480_999];
const GUARD_BASE = 12_480_050; // where EVERY preflight invocation is routed
const SIZING_BASE = IS_PREFLIGHT ? GUARD_BASE : 12_480_100;
const BATTERY_BASE = IS_PREFLIGHT ? GUARD_BASE + 20 : 12_480_200;
const DET_SEED = IS_PREFLIGHT ? GUARD_BASE + 45 : 12_480_998;
const WORLD_SEED = IS_PREFLIGHT ? GUARD_BASE + 46 : 12_480_999;
const SEED_ROOM = 700; // 12,480,200–12,480,899
/** ⭐ THE DELIBERATE RE-WALK — a RECEIPT, never fresh data: DV-C0's OWN committed smoke block. */
const REPRO_BASE = 12_429_000;
const REPRO_N = 12;
const CONSUMED: readonly { name: string; range: readonly [number, number] }[] = [
  { name: '#65 whether-seat sizing block', range: [8_500_000, 8_500_047] },
  { name: 'tempo census', range: [12_293_000, 12_299_999] },
  { name: 'O1 / O2 / PM / MT / CTB / OBM / PTP / DLC bands', range: [12_300_000, 12_428_999] },
  { name: 'DV bands (#249–#258)', range: [12_429_000, 12_447_999] },
  { name: 'EK bands (#259–#263)', range: [12_448_000, 12_465_999] },
  { name: 'CB-C0 dispossession census (#265.4/#266)', range: [12_470_000, 12_471_799] },
  { name: 'CB-T0 dormant layer-1 seam (#266.5/#267)', range: [12_472_000, 12_472_999] },
  { name: 'CB-T1 beaten-event exam (#267.5/#268)', range: [12_473_000, 12_473_999] },
  { name: 'CB-T2 choice seat (#268.3/#269)', range: [12_474_000, 12_477_999] },
  { name: 'CB aftermath polish (#272.4(b))', range: [12_478_000, 12_478_999] },
  { name: 'R-乙 instrument fix / epoch 2 (#273.3)', range: [12_479_000, 12_479_999] },
];

const BOOT_B = 2000;
const STATS_BASE = 110_800;
const STATS_FLOOR = 110_800;
const PUBLISHED_BASES = [104_000, 105_000, 106_000, 107_000, 108_000, 109_000, 109_800,
  110_000, 110_200, 110_400, 110_600];

/** N RULE (frozen): the rarest scored cell is a MISS in the rarest ARRIVAL BAND (g5 grain). */
const N_EVENTS = 600;
const N_FLOOR = 60;
const N_CAP = SEED_ROOM;

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];
const CB_WORLD_VERSION = 6;

/* ========================================================================== */
/* §5 THE WORLD                                                                */
/* ========================================================================== */
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ THE POLISHED ARMED WORLD — the play entry's own arming, and nothing else (#273). */
const armedMatch = (seed: number): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(CB_WORLD_VERSION),
  });
  armA4World(m, null, CB_WORLD_VERSION);
  if (cbArmedVersion(m) !== CB_WORLD_VERSION) throw new Error('l3-c0: the CB world failed to arm');
  return m;
};
/** BARE PRODUCTION — byte-for-byte DV-C0's own arm, which is why the re-walk can reproduce it. */
const bareMatch = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
});

/* ========================================================================== */
/* §6 ⭐⭐ THE LAWS, RE-DERIVED INDEPENDENTLY (never imported from carryBeat)    */
/* ========================================================================== */
/** χ — the commitment factor: the slack his own motion model has to spare, in radius units. */
function chiOf(
  px: number, py: number, vx: number, vy: number, accel: number,
  bx: number, by: number, bvx: number, bvy: number,
): number {
  const horizon = Math.sqrt((2 * R_TACKLE) / accel);
  const steps = Math.ceil(horizon / DT);
  let best = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const t = Math.min(i * DT, horizon);
    const dx = (bx + bvx * t) - (px + vx * t);
    const dy = (by + bvy * t) - (py + vy * t);
    const slack = ((accel * t * t) / 2) - hyp(dx, dy);
    if (slack > best) best = slack;
  }
  const s = best / R_TACKLE;
  if (!(s > 0)) return 0;
  return s > 1 ? 1 : s;
}
/** the beaten lunger's own recovery interval: brake + turn + close, all closed forms. */
function recoveryOf(
  px: number, py: number, vx: number, vy: number, accel: number,
  hx: number, hy: number, bx: number, by: number,
): { brake: number; turn: number; close: number; total: number } {
  const speed = hyp(vx, vy);
  const brake = speed / accel;
  let fx = vx;
  let fy = vy;
  if (speed === 0) { fx = hx; fy = hy; }
  const gx = bx - px;
  const gy = by - py;
  const gd = hyp(gx, gy);
  const fd = hyp(fx, fy);
  const turnAngle = gd === 0 || fd === 0
    ? 0
    : Math.acos(Math.min(1, Math.max(-1, (fx * gx + fy * gy) / (fd * gd))));
  const turn = turnAngle / TURN_RATE;
  const close = Math.sqrt((2 * gd) / accel);
  return { brake, turn, close, total: brake + turn + close };
}
/**
 * ⭐ THE LAW-CHECK TOLERANCE, DERIVED — the ANGLE-RESOLUTION QUANTUM (#273.2(ii)'s relabelling of
 * the polish's bound): `recoveryInterval`'s turn leg is `acos(x)/TURN_RATE` and `acos` is
 * ill-conditioned at x → 1, where a one-ulp difference in x becomes sqrt(2·ε) of angle.
 */
const LAW_TOL = Math.sqrt(2 * Number.EPSILON) / TURN_RATE;

/* ========================================================================== */
/* §7 THE WALK                                                                 */
/* ========================================================================== */
type Side = 0 | 1;
const THIRDS = ['own', 'middle', 'final'] as const;
type Third = (typeof THIRDS)[number];
/** DV-C0's own third cut, inherited verbatim from the engine's pitch constant. */
const THIRD_LOCAL_X = HALF_L / 3;

interface BandCell {
  lunges: number; wins: number; misses: number; geomMiss: number;
  refusalTicks: number;
  chiSum: number;
  /** (a) the recovery interval PAID (the engine's own law) — misses only. */
  recN: number; recSum: number; recSq: number; recMin: number; recOverIncumbent: number;
  /** (b) the CARRIER-ANCHORED separation picture — misses only. */
  sepT0N: number; sepT0Sum: number;
  dSepN: number; dSepSum: number; sepGained: number;
  dSpaceN: number; dSpaceSum: number; spaceGained: number;
  dSepOwnN: number; dSepOwnSum: number; sepGainedOwn: number;
  /** (c) the concession family: the carrier's team still holds it at window w. */
  keepK: number[]; keepN: number[]; keepCensored: number[];
  keepOwnK: number; keepOwnN: number;
  shotK: number; shotN: number; goalK: number; goalN: number;
}
const emptyBandCell = (): BandCell => ({
  lunges: 0, wins: 0, misses: 0, geomMiss: 0, refusalTicks: 0, chiSum: 0,
  recN: 0, recSum: 0, recSq: 0, recMin: Number.POSITIVE_INFINITY, recOverIncumbent: 0,
  sepT0N: 0, sepT0Sum: 0,
  dSepN: 0, dSepSum: 0, sepGained: 0,
  dSpaceN: 0, dSpaceSum: 0, spaceGained: 0,
  dSepOwnN: 0, dSepOwnSum: 0, sepGainedOwn: 0,
  keepK: new Array<number>(NW).fill(0), keepN: new Array<number>(NW).fill(0),
  keepCensored: new Array<number>(NW).fill(0),
  keepOwnK: 0, keepOwnN: 0, shotK: 0, shotN: 0, goalK: 0, goalN: 0,
});

interface Cluster {
  seed: number; simSeconds: number; totalTicks: number;
  /** [side][band] — the LUNGER's side, so every rate has a per-team-per-match reading. */
  cells: BandCell[][];
  /** the recovery-interval pool per band (pooled over sides) — the distribution's own grain. */
  recPool: number[][];
  /* --- the detector's identity counters (gate input) --- */
  lungesDetected: number; winsDetected: number; missesDetected: number;
  whistledDuels: number; tabulated: number;
  ledgerArmed: number; ledgerRecoveries: number; ledgerGeomMisses: number;
  ledgerRecoverySeconds: number; recoverySecondsDetected: number;
  chiZeroDetected: number; chiZeroUnwhistled: number;
  maxLawDeviation: number; lawViolations: number; lawChecked: number;
  engineTackleDelta: number; slideWins: number;
  slideEvents: number; grabEvents: number; smotherEvents: number; gkAerialEvents: number;
  unclassifiedJumps: number; maxLungesInATick: number;
  outOfRadiusUnwhistled: number;
  proximityTicks: number; refusalTicks: number;
  /* --- DV-C0's own inherited columns (G-REPRO-DVC0 reads exactly these) --- */
  deadBallTicks: number; segmentTicks: number; looseGapTicks: number;
  assignedTicksSum: number; spanOrderViolations: number; goalsFromScore: number;
  turnoversTotal: number; turnoversByThird: Record<Third, number>;
  segmentsTotal: number;
}

interface Segment {
  team: Side; startTick: number; assignedTicks: number;
  lastOwnedLocalXOwnerFrame: number;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
}
interface MissEvent {
  side: Side; band: number; tick: number;
  ownRecoveryTicks: number;
}

function walk(seed: number, world: 'armed' | 'bare'): Cluster {
  const m = world === 'armed' ? armedMatch(seed) : bareMatch(seed);
  const P = m.allPlayers;
  const NP = P.length;
  const cells: BandCell[][] = [
    Array.from({ length: NB }, emptyBandCell),
    Array.from({ length: NB }, emptyBandCell),
  ];
  const recPool: number[][] = Array.from({ length: NB }, () => [] as number[]);
  const c: Cluster = {
    seed, simSeconds: 0, totalTicks: 0, cells, recPool,
    lungesDetected: 0, winsDetected: 0, missesDetected: 0, whistledDuels: 0, tabulated: 0,
    ledgerArmed: 0, ledgerRecoveries: 0, ledgerGeomMisses: 0,
    ledgerRecoverySeconds: 0, recoverySecondsDetected: 0,
    chiZeroDetected: 0, chiZeroUnwhistled: 0,
    maxLawDeviation: 0, lawViolations: 0, lawChecked: 0,
    engineTackleDelta: 0, slideWins: 0,
    slideEvents: 0, grabEvents: 0, smotherEvents: 0, gkAerialEvents: 0,
    unclassifiedJumps: 0, maxLungesInATick: 0, outOfRadiusUnwhistled: 0,
    proximityTicks: 0, refusalTicks: 0,
    deadBallTicks: 0, segmentTicks: 0, looseGapTicks: 0, assignedTicksSum: 0,
    spanOrderViolations: 0, goalsFromScore: 0, turnoversTotal: 0,
    turnoversByThird: { own: 0, middle: 0, final: 0 }, segmentsTotal: 0,
  };

  const prevCd = new Float64Array(NP);
  for (let i = 0; i < NP; i++) prevCd[i] = P[i].tackleCooldown;
  const prevTackles: [number, number] = [m.teams[0].stats.tackles, m.teams[1].stats.tackles];
  const prevShots: [number, number] = [m.teams[0].stats.shots ?? 0, m.teams[1].stats.shots ?? 0];
  const prevScore: [number, number] = [m.score[0], m.score[1]];
  let prevArmed = 0; let prevRec = 0; let prevGeom = 0; let prevRecSec = 0;
  let lastOwner: (typeof P)[number] | null = null;

  /* the event ledgers the windows resolve against (DV-C0 semantics for the turnovers) */
  const turnovers: { tick: number; loser: Side }[] = [];
  const shotEvents: { tick: number; side: Side }[] = [];
  const goalEvents: { tick: number; side: Side }[] = [];
  const misses: MissEvent[] = [];
  const segments: Segment[] = [];
  let cur: Segment | null = null;
  const closeSegment = (s: Segment, terminator: Segment['terminator']): void => {
    s.terminator = terminator;
    const last = segments.length === 0 ? null : segments[segments.length - 1];
    if (last !== null && s.startTick <= last.startTick) c.spanOrderViolations++;
    segments.push(s);
  };
  /** DV-C0's own zoning, inherited verbatim: the third cut is HALF_L / 3 (the engine's constant). */
  const thirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
    : localX > THIRD_LOCAL_X ? 'final' : 'middle');

  /* pendings: the carrier-anchored separation reads */
  interface Pend {
    side: Side; band: number; tick: number; dueTick: number;
    carrierGid: number; takerGid: number; sep0: number; space0: number; own: boolean;
  }
  const pend: Pend[] = [];

  while (!m.finished) {
    m.step(DT);
    c.totalTicks++;
    const tick = m.simTick;
    const ball = m.ball;
    const owner = ball.owner;
    const phase = m.phase;

    for (const s of [0, 1] as const) {
      if (m.score[s] > prevScore[s]) {
        c.goalsFromScore += m.score[s] - prevScore[s];
        for (let k = 0; k < m.score[s] - prevScore[s]; k++) goalEvents.push({ tick, side: s });
        prevScore[s] = m.score[s];
      }
      const t = m.teams[s].stats.tackles;
      c.engineTackleDelta += t - prevTackles[s];
      prevTackles[s] = t;
      const sh = m.teams[s].stats.shots ?? 0;
      for (let k = 0; k < sh - prevShots[s]; k++) shotEvents.push({ tick, side: s });
      prevShots[s] = sh;
    }
    const dArmed = m.cbLedger.armedChallenges - prevArmed;
    const dRec = m.cbLedger.recoveries - prevRec;
    const dGeom = m.cbLedger.geometricMisses - prevGeom;
    const dRecSec = m.cbLedger.recoverySeconds - prevRecSec;
    prevArmed = m.cbLedger.armedChallenges; prevRec = m.cbLedger.recoveries;
    prevGeom = m.cbLedger.geometricMisses; prevRecSec = m.cbLedger.recoverySeconds;
    c.ledgerArmed += dArmed; c.ledgerRecoveries += dRec; c.ledgerGeomMisses += dGeom;
    c.ledgerRecoverySeconds += dRecSec;
    if (dArmed > c.maxLungesInATick) c.maxLungesInATick = dArmed;

    /* ---------- (a) THE DUEL DETECTOR ---------- */
    let lungeThisTick = false;
    for (let i = 0; i < NP; i++) {
      const p = P[i];
      const cd = p.tackleCooldown;
      if (!(cd > prevCd[i] + 1e-12)) continue;
      const st = p.stunTimer;
      const isArmedMiss = dRec === 1 && Math.abs(cd - dRecSec) <= 1e-12;
      const isWin = cd === WIN_COOLDOWN_S;
      const isBareMiss = world === 'bare' && cd === MISS_COOLDOWN_S
        && Math.abs(st - MISS_STUN_S) < 1e-9;
      if (isWin || isArmedMiss || isBareMiss) {
        lungeThisTick = true;
        c.lungesDetected++;
        const missed = !isWin;
        if (missed) c.missesDetected++; else c.winsDetected++;
        const carrier = (isWin ? lastOwner : owner) ?? lastOwner ?? owner;
        if (carrier === null || carrier === undefined) { c.unclassifiedJumps++; continue; }
        const whistled = phase !== 'playing' || p.sentOff;
        const dBall = hyp(p.pos.x - ball.pos.x, p.pos.y - ball.pos.y);
        if (!(dBall < R_TACKLE) && !whistled) c.outOfRadiusUnwhistled++;
        /* ⭐ the LUNGER'S OWN velocity at the decision — the self-percept the band indexes. */
        const speed = hyp(p.vel.x, p.vel.y);
        const band = bandOf(speed);
        /* χ, re-derived: the ball the mechanic saw rides at the CARRIER's velocity (the glue
         * identity `ball.vel = owner.vel`, written earlier in this same stepBall), and the
         * mechanic writes neither ball.pos nor the taker's kinematics. */
        const chi = chiOf(p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.accel,
          ball.pos.x, ball.pos.y, carrier.vel.x, carrier.vel.y);
        if (chi === 0) c.chiZeroDetected++;
        /* the ENGINE's own written price rides the ledger, whistled or not — so the summed
         * recovery seconds identity covers the WHOLE population. */
        if (missed && world === 'armed') c.recoverySecondsDetected += dRecSec;
        /* ⚠ a whistled duel's post-step geometry is the RESTART's, not the duel's (CB-C0 §DEV 2):
         * counted, and EXCLUDED from every table and from both law re-derivations. */
        if (whistled) { c.whistledDuels++; prevCd[i] = cd; continue; }
        if (chi === 0) c.chiZeroUnwhistled++;
        c.tabulated++;
        const cell = cells[p.side as Side][band];
        cell.lunges++;
        cell.chiSum += chi;
        if (chi === 0) cell.geomMiss++;
        if (!missed) cell.wins++;
        else {
          cell.misses++;
          /* (a) the recovery interval PAID — the engine's own written price, and the probe's
           * INDEPENDENT re-derivation of the law that wrote it. */
          const paid = world === 'armed' ? dRecSec : cd;
          const rederived = recoveryOf(p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.accel,
            p.heading.x, p.heading.y, ball.pos.x, ball.pos.y).total;
          if (world === 'armed') {
            const dev = Math.abs(paid - rederived);
            if (dev > c.maxLawDeviation) c.maxLawDeviation = dev;
            if (!(dev <= LAW_TOL)) c.lawViolations++;
            c.lawChecked++;
          }
          cell.recN++; cell.recSum += paid; cell.recSq += paid * paid;
          if (paid < cell.recMin) cell.recMin = paid;
          if (paid > MISS_COOLDOWN_S) cell.recOverIncumbent++;
          recPool[band].push(round(paid, 4));
          /* (b) the CARRIER-ANCHORED t0 (#266.2(i)): separation is taker→CARRIER, and space is
           * the CARRIER's own distance to his nearest opponent — never the ball. */
          const sep0 = hyp(p.pos.x - carrier.pos.x, p.pos.y - carrier.pos.y);
          let nearest = Infinity;
          for (let k = 0; k < NP; k++) {
            const o = P[k];
            if (o.side === carrier.side || o.sentOff) continue;
            const dd = hyp(o.pos.x - carrier.pos.x, o.pos.y - carrier.pos.y);
            if (dd < nearest) nearest = dd;
          }
          cell.sepT0N++; cell.sepT0Sum += sep0;
          const ownTicks = Math.max(1, Math.round(paid / DT));
          pend.push({ side: p.side as Side, band, tick, dueTick: tick + H1_TICKS,
            carrierGid: carrier.gid, takerGid: p.gid, sep0, space0: nearest, own: false });
          pend.push({ side: p.side as Side, band, tick, dueTick: tick + ownTicks,
            carrierGid: carrier.gid, takerGid: p.gid, sep0, space0: nearest, own: true });
          /* (c) the concession family is resolved after the walk, off the turnover ledger. */
          misses.push({ side: p.side as Side, band, tick, ownRecoveryTicks: ownTicks });
        }
      } else if (cd === SLIDE_COOLDOWN_S) {
        c.slideEvents++;
        if (Math.abs(st - SLIDE_WIN_STUN_S) < 1e-9) c.slideWins++;
        else if (Math.abs(st - SLIDE_MISS_STUN_S) >= 1e-9) c.unclassifiedJumps++;
      } else if (cd === GRAB_COOLDOWN_S) c.grabEvents++;
      else if (cd === SMOTHER_COOLDOWN_S && Math.abs(st - SMOTHER_STUN_S) < 1e-9) c.smotherEvents++;
      else if (cd === GK_AERIAL_COOLDOWN_S && p.role === 'GK') c.gkAerialEvents++;
      else c.unclassifiedJumps++;
    }

    /* ---------- (b) THE WITHHELD CHALLENGE — `tryTackles`' own candidate predicate ---------- */
    if (phase === 'playing' && owner !== null && owner.gkHoldTimer <= 0
      && !(owner.role === 'GK' && owner.gkDistributing) && !lungeThisTick) {
      let best = -1; let bestD = Infinity;
      for (let i = 0; i < NP; i++) {
        const o = P[i];
        if (o.side === owner.side || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
        const d = hyp(o.pos.x - ball.pos.x, o.pos.y - ball.pos.y);
        if (d < R_TACKLE && d < bestD) { bestD = d; best = i; }
      }
      if (best >= 0) {
        c.proximityTicks++; c.refusalTicks++;
        const o = P[best];
        const b = bandOf(hyp(o.vel.x, o.vel.y));
        cells[o.side as Side][b].refusalTicks++;
      }
    } else if (lungeThisTick) c.proximityTicks++;

    /* ---------- (c) THE CARRIER-ANCHORED HORIZON READS ---------- */
    for (let k = pend.length - 1; k >= 0; k--) {
      const q = pend[k];
      if (tick < q.dueTick) continue;
      const t = P[q.takerGid];
      const cr = P[q.carrierGid];
      const sep = hyp(t.pos.x - cr.pos.x, t.pos.y - cr.pos.y);
      const cell = cells[q.side][q.band];
      const dSep = sep - q.sep0;
      if (q.own) {
        cell.dSepOwnN++; cell.dSepOwnSum += dSep;
        if (dSep > 0) cell.sepGainedOwn++;
      } else {
        cell.dSepN++; cell.dSepSum += dSep;
        if (dSep > 0) cell.sepGained++;
        let nearest = Infinity;
        for (let i = 0; i < NP; i++) {
          const o = P[i];
          if (o.side === cr.side || o.sentOff) continue;
          const dd = hyp(o.pos.x - cr.pos.x, o.pos.y - cr.pos.y);
          if (dd < nearest) nearest = dd;
        }
        const dSpace = nearest - q.space0;
        cell.dSpaceN++; cell.dSpaceSum += dSpace;
        if (dSpace > 0) cell.spaceGained++;
      }
      pend.splice(k, 1);
    }

    /* ---------- (d) THE CHURN WALKER — DV-C0's segment/turnover semantics ---------- */
    if (phase !== 'playing') {
      c.deadBallTicks++;
      if (cur !== null) { closeSegment(cur, 'deadBall'); cur = null; }
      lastOwner = owner;
      for (let i = 0; i < NP; i++) prevCd[i] = P[i].tackleCooldown;
      continue;
    }
    if (owner === null) {
      if (cur !== null) { cur.assignedTicks++; c.segmentTicks++; } else c.looseGapTicks++;
    } else {
      const side = owner.side as Side;
      if (cur !== null && cur.team !== side) {
        turnovers.push({ tick, loser: cur.team });
        c.turnoversByThird[thirdOf(cur.lastOwnedLocalXOwnerFrame)]++;
        closeSegment(cur, 'opponentControl');
        cur = null;
      }
      if (cur === null) {
        cur = {
          team: side, startTick: tick, assignedTicks: 0,
          lastOwnedLocalXOwnerFrame: m.teams[side].localX(ball.pos.x),
          terminator: 'matchEnd',
        };
      }
      cur.assignedTicks++; c.segmentTicks++;
      cur.lastOwnedLocalXOwnerFrame = m.teams[side].localX(ball.pos.x);
    }
    lastOwner = owner;
    for (let i = 0; i < NP; i++) prevCd[i] = P[i].tackleCooldown;
  }
  if (cur !== null) { closeSegment(cur, 'matchEnd'); cur = null; }
  c.simSeconds = m.simTime;
  c.assignedTicksSum = segments.reduce((a, s) => a + s.assignedTicks, 0);
  c.turnoversTotal = segments.filter((s) => s.terminator === 'opponentControl').length;
  c.segmentsTotal = segments.length;

  /* ---------- (e) THE CONCESSION FAMILY, off the ledgers (never re-defined) ---------- */
  for (const ev of misses) {
    const carrierSide = (1 - ev.side) as Side;
    const cell = cells[ev.side][ev.band];
    const keptThrough = (h: number): boolean => !turnovers
      .some((t) => t.loser === carrierSide && t.tick > ev.tick && t.tick <= ev.tick + h);
    for (let w = 0; w < NW; w++) {
      const h = Math.round(WINDOWS_S[w] / DT);
      if (ev.tick + h > c.totalTicks) { cell.keepCensored[w]++; continue; }
      cell.keepN[w]++;
      if (keptThrough(h)) cell.keepK[w]++;
    }
    if (ev.tick + ev.ownRecoveryTicks <= c.totalTicks) {
      cell.keepOwnN++;
      if (keptThrough(ev.ownRecoveryTicks)) cell.keepOwnK++;
    }
    const hp = Math.round(WINDOWS_S[PRIMARY_WINDOW_IDX] / DT);
    if (ev.tick + hp <= c.totalTicks) {
      cell.shotN++; cell.goalN++;
      if (shotEvents.some((s) => s.side === carrierSide && s.tick > ev.tick && s.tick <= ev.tick + hp)) {
        cell.shotK++;
      }
      if (goalEvents.some((g) => g.side === carrierSide && g.tick > ev.tick && g.tick <= ev.tick + hp)) {
        cell.goalK++;
      }
    }
  }
  for (let b = 0; b < NB; b++) {
    for (const s of [0, 1] as const) {
      if (cells[s][b].recN === 0) cells[s][b].recMin = 0;
    }
  }
  return c;
}

/* the third cut is DV-C0's own zoning: HALF_L / 3 — patched in after the import is available. */
/* eslint-disable-next-line @typescript-eslint/no-var-requires */

/* ========================================================================== */
/* §8 SIZING MODE                                                              */
/* ========================================================================== */
const writeArtifact = (body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} => {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    outPath, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0Wall,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 2)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const cc = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete cc.resultSha256;
    delete cc.envelope;
    return sha(canonical(cc));
  };
  const crossPath = `/tmp/l3-c0-cross-out-${MODE}.json`;
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: { ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7, generatedAt: 'ANOTHER-INVOCATION' },
  }, null, 2)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};
const bandMissesPerMatch = (cs: readonly Cluster[]): number[] => Array.from({ length: NB }, (_, b) =>
  sum(cs.map((cl) => cl.cells[0][b].misses + cl.cells[1][b].misses)) / Math.max(1, cs.length));

if (MODE === 'sizing') {
  const n = SIZING_N_ENV ?? 5;
  const st = Date.now();
  const cs: Cluster[] = [];
  for (let i = 0; i < n; i++) cs.push(walk(SIZING_BASE + i, 'armed'));
  const ms = Date.now() - st;
  const perBand = bandMissesPerMatch(cs);
  const body = {
    schema: 'l3-c0-lunge-outcome-census/sizing/v1',
    seeds: { base: SIZING_BASE, n },
    /** ⭐ the two terms the N rule consumes, published as FIXED numbers of this artifact. */
    msPerMatch: round(ms / n, 3),
    rarestBandMissesPerMatch: round(Math.min(...perBand), 6),
    missesPerBandPerMatch: perBand.map((v) => round(v, 6)),
    lungesPerMatch: round(sum(cs.map((cl) => cl.tabulated)) / n, 4),
    bands: { vStar: V_STAR, cuts: BAND_CUTS, labels: [...BAND_LABELS] },
  };
  const w = writeArtifact(body, OUT_PATH);
  banner(`SIZING n=${n} · ms/match ${body.msPerMatch} · rarest-band misses/match ${body.rarestBandMissesPerMatch}`);
  banner(`resultSha256 ${w.digest} · re-derives ${w.reread === w.digest} · ${OUT_PATH}`);
  process.exit(0);
}

/* ========================================================================== */
/* §9 FULL MODE — the battery                                                  */
/* ========================================================================== */
/** ⭐ a PREFLIGHT reads its own /tmp sizing file; only a RECORD run may read the committed one. */
const SIZING_INPUT = IS_PREFLIGHT ? '/tmp/l3-c0-preflight-sizing.json' : SIZING_PATH;
if (!existsSync(SIZING_INPUT)) {
  banner(`L3-C0 FATAL: the sizing artifact is missing (${SIZING_INPUT}) — N cannot re-derive`);
  process.exit(2);
}
const SIZING = readJson(SIZING_INPUT) as unknown as {
  msPerMatch: number; rarestBandMissesPerMatch: number;
};
const precisionTerm = SIZING.rarestBandMissesPerMatch > 0
  ? Math.max(Math.ceil(N_EVENTS / SIZING.rarestBandMissesPerMatch), N_FLOOR) : Infinity;
const wallTerm = Math.floor((0.5 * 3_600_000) / SIZING.msPerMatch);
const N_STAR = Math.min(precisionTerm, wallTerm, N_CAP);
const N = N_ENV ?? N_STAR;
banner(`L3-C0 full · N=${N} (precision ${precisionTerm} · wall ${wallTerm} · cap ${N_CAP})`);

const SEEDS = Array.from({ length: N }, (_, i) => BATTERY_BASE + i);
const CLUSTERS = SEEDS.map((s, i) => {
  if (i % 25 === 0) banner(`  … seed ${s} (${i}/${N}) [${((Date.now() - t0Wall) / 1000).toFixed(0)}s]`);
  return walk(s, 'armed');
});
/* G-DET: the anchor seed walked twice, independently. */
const detA = canonical(walk(DET_SEED, 'armed'));
const detB = canonical(walk(DET_SEED, 'armed'));
/* G-REPRO-DVC0: DV-C0's own committed smoke block, re-walked in BARE production. */
banner('  … G-REPRO-DVC0: re-walking DV-C0\'s own committed smoke block');
const REPRO_ROWS = Array.from({ length: REPRO_N }, (_, i) => walk(REPRO_BASE + i, 'bare'));
/* the production fingerprint. */
const FP_ROWS = SKIP_FP ? [] : LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
  const league = new League({ seed });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  const observed = sha(JSON.stringify(out.league));
  return { seed, baseline, observed, match: observed === baseline };
});

/* ========================================================================== */
/* §10 THE ESTIMATOR — one shared cluster-bootstrap matrix                     */
/* ========================================================================== */
const nClusters = CLUSTERS.length;
const BOOT_ROWS: number[][] = (() => {
  const rng = new Rng(STATS_BASE);
  const rows: number[][] = [];
  for (let b = 0; b < BOOT_B; b++) {
    const idx: number[] = [];
    for (let i = 0; i < nClusters; i++) idx.push(rng.int(0, nClusters - 1));
    rows.push(idx);
  }
  return rows;
})();
const ciOf = (values: readonly number[]): [number, number] => {
  const s = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  return [round(quantileSorted(s, 0.025)), round(quantileSorted(s, 0.975))];
};
type Pick = (cl: Cluster, side: Side, band: number) => number;
const bandSum = (cl: Cluster, bands: readonly number[], f: Pick): number => {
  let t = 0;
  for (const s of [0, 1] as const) for (const b of bands) t += f(cl, s, b);
  return t;
};
interface Row { point: number; ci95: [number, number]; num: number; den: number }
function rateRow(bands: readonly number[], num: Pick, den: Pick): Row {
  const ratio = (idx: readonly number[]): number => {
    let n = 0; let d = 0;
    for (const i of idx) { n += bandSum(CLUSTERS[i], bands, num); d += bandSum(CLUSTERS[i], bands, den); }
    return d === 0 ? Number.NaN : n / d;
  };
  const base = CLUSTERS.map((_, i) => i);
  const draws = BOOT_ROWS.map(ratio);
  return {
    point: round(ratio(base), 6), ci95: ciOf(draws),
    num: sum(base.map((i) => bandSum(CLUSTERS[i], bands, num))),
    den: sum(base.map((i) => bandSum(CLUSTERS[i], bands, den))),
  };
}
function diffRow(bandsHi: readonly number[], bandsLo: readonly number[], num: Pick, den: Pick): {
  delta: number; ci95: [number, number]; verdict: string;
} {
  const ratio = (idx: readonly number[], bands: readonly number[]): number => {
    let n = 0; let d = 0;
    for (const i of idx) { n += bandSum(CLUSTERS[i], bands, num); d += bandSum(CLUSTERS[i], bands, den); }
    return d === 0 ? Number.NaN : n / d;
  };
  const base = CLUSTERS.map((_, i) => i);
  const delta = ratio(base, bandsHi) - ratio(base, bandsLo);
  const draws = BOOT_ROWS.map((idx) => ratio(idx, bandsHi) - ratio(idx, bandsLo));
  const ci = ciOf(draws);
  const verdict = ci[0] > 0 ? 'RESOLVED-CONFIRM' : ci[1] < 0 ? 'RESOLVED-INVERT' : 'UNRESOLVED';
  return { delta: round(delta, 6), ci95: ci, verdict };
}

/* ---- the candidate registry: every punishment label the census measures ---- */
interface Candidate {
  id: string; family: 'recovery' | 'separation' | 'concession';
  what: string;
  num: Pick; den: Pick;
}
const CANDIDATES: Candidate[] = [
  { id: 'recoveryOverIncumbent', family: 'recovery',
    what: 'the recovery interval the engine made him pay EXCEEDS the incumbent flat price (traced MISS_COOLDOWN_S)',
    num: (c, s, b) => c.cells[s][b].recOverIncumbent, den: (c, s, b) => c.cells[s][b].recN },
  { id: 'sepGainedH1', family: 'separation',
    what: 'the carrier GAINED separation from him over H1, measured from the CARRIER (#266.2(i))',
    num: (c, s, b) => c.cells[s][b].sepGained, den: (c, s, b) => c.cells[s][b].dSepN },
  { id: 'sepGainedOwnRecovery', family: 'separation',
    what: 'the same, over HIS OWN recovery interval (the engine\'s per-event window)',
    num: (c, s, b) => c.cells[s][b].sepGainedOwn, den: (c, s, b) => c.cells[s][b].dSepOwnN },
  { id: 'spaceGainedH1', family: 'separation',
    what: 'the CARRIER\'s distance to his nearest opponent GREW over H1 (carrier-anchored)',
    num: (c, s, b) => c.cells[s][b].spaceGained, den: (c, s, b) => c.cells[s][b].dSpaceN },
  { id: 'keptOwnRecovery', family: 'concession',
    what: 'the carrier\'s team still held it through HIS OWN recovery interval',
    num: (c, s, b) => c.cells[s][b].keepOwnK, den: (c, s, b) => c.cells[s][b].keepOwnN },
  ...WINDOWS_S.map((w, i) => ({
    id: `keptThrough${String(w).replace('.', 'p')}s`, family: 'concession' as const,
    what: `the carrier's team still held it ${w} s after the miss (DV-C0 loss semantics)`,
    num: (c: Cluster, s: Side, b: number) => c.cells[s][b].keepK[i],
    den: (c: Cluster, s: Side, b: number) => c.cells[s][b].keepN[i],
  })),
  { id: 'shotConcededPrimary', family: 'concession',
    what: `the carrier's team took a SHOT within the primary window (${PRIMARY_WINDOW_S} s)`,
    num: (c, s, b) => c.cells[s][b].shotK, den: (c, s, b) => c.cells[s][b].shotN },
  { id: 'goalConcededPrimary', family: 'concession',
    what: `the carrier's team SCORED within the primary window (${PRIMARY_WINDOW_S} s)`,
    num: (c, s, b) => c.cells[s][b].goalK, den: (c, s, b) => c.cells[s][b].goalN },
];

const ALL_BANDS = [0, 1, 2, 3, 4];
const matches = CLUSTERS.length;
const teamMatches = matches * 2;

/** per-team-per-match moments of a per-(side,band) count. */
const momentsOf = (bands: readonly number[], f: Pick): Record<string, number> => {
  const per: number[] = [];
  for (const cl of CLUSTERS) {
    for (const s of [0, 1] as const) {
      let t = 0;
      for (const b of bands) t += f(cl, s, b);
      per.push(t);
    }
  }
  const s = [...per].sort((a, b) => a - b);
  const mu = meanOf(per);
  const sd = Math.sqrt(meanOf(per.map((v) => (v - mu) * (v - mu))));
  return {
    mean: round(mu, 6), sd: round(sd, 6), cv: round(sd / Math.max(1e-9, mu), 6),
    min: s[0], p10: round(quantileSorted(s, 0.1), 4), median: round(quantileSorted(s, 0.5), 4),
    p90: round(quantileSorted(s, 0.9), 4), max: s[s.length - 1],
    zeroShare: round(per.filter((v) => v === 0).length / Math.max(1, per.length), 6),
    perSeasonAtMean: round(mu * SEASON_FIXTURES_PER_TEAM, 4),
  };
};

/* ---- the tables ---- */
const GRAIN_TABLES: Record<string, unknown> = {};
for (const [grain, groups] of Object.entries(GRAINS)) {
  GRAIN_TABLES[grain] = groups.map((bands, gi) => {
    const lunges = bandSumAll(bands, (c, s, b) => c.cells[s][b].lunges);
    const misses = bandSumAll(bands, (c, s, b) => c.cells[s][b].misses);
    return {
      band: GRAIN_LABELS[grain][gi], bands,
      window: [bands[0] === 0 ? 0 : round(BAND_CUTS[bands[0] - 1], 6),
        bands[bands.length - 1] === 4 ? null : round(BAND_CUTS[bands[bands.length - 1]], 6)],
      lunges,
      wins: bandSumAll(bands, (c, s, b) => c.cells[s][b].wins),
      misses,
      takeRate: rateRow(bands, (c, s, b) => c.cells[s][b].wins, (c, s, b) => c.cells[s][b].lunges),
      geometricMissShare: rateRow(bands, (c, s, b) => c.cells[s][b].geomMiss,
        (c, s, b) => c.cells[s][b].lunges),
      meanChi: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].chiSum) / Math.max(1, lunges), 6),
      lungesPerTeamMatch: momentsOf(bands, (c, s, b) => c.cells[s][b].lunges),
      missesPerTeamMatch: momentsOf(bands, (c, s, b) => c.cells[s][b].misses),
      refusalTicksPerTeamMatch: momentsOf(bands, (c, s, b) => c.cells[s][b].refusalTicks),
      refusalTicks: bandSumAll(bands, (c, s, b) => c.cells[s][b].refusalTicks),
      recovery: recoveryStats(bands),
      separation: {
        sepT0Mean: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].sepT0Sum)
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].sepT0N)), 6),
        dSepH1Mean: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].dSepSum)
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].dSepN)), 6),
        dSepOwnMean: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].dSepOwnSum)
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].dSepOwnN)), 6),
        dSpaceH1Mean: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].dSpaceSum)
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].dSpaceN)), 6),
      },
      candidates: Object.fromEntries(CANDIDATES.map((cand) => [cand.id, {
        rate: rateRow(bands, cand.num, cand.den),
        eventsPerTeamMatch: momentsOf(bands, cand.num),
      }])),
    };
  });
}
function bandSumAll(bands: readonly number[], f: Pick): number {
  return sum(CLUSTERS.map((cl) => bandSum(cl, bands, f)));
}
function recoveryStats(bands: readonly number[]): Record<string, number> {
  const pool: number[] = [];
  for (const cl of CLUSTERS) for (const b of bands) for (const v of cl.recPool[b]) pool.push(v);
  const s = pool.sort((a, b) => a - b);
  const mu = meanOf(s);
  const sd = Math.sqrt(meanOf(s.map((v) => (v - mu) * (v - mu))));
  return {
    n: s.length, mean: round(mu, 6), sd: round(sd, 6),
    min: s.length === 0 ? Number.NaN : round(s[0], 6),
    p10: round(quantileSorted(s, 0.1), 6), median: round(quantileSorted(s, 0.5), 6),
    p90: round(quantileSorted(s, 0.9), 6),
    max: s.length === 0 ? Number.NaN : round(s[s.length - 1], 6),
    shareOverIncumbent: round(s.filter((v) => v > MISS_COOLDOWN_S).length / Math.max(1, s.length), 6),
  };
}

/** ⭐ #246, PRE-REGISTERED: faster arrival ⇒ MORE punished. Evaluated per candidate, per grain. */
const SHAPE = Object.fromEntries(Object.entries(GRAINS).map(([grain, groups]) => [grain,
  Object.fromEntries(CANDIDATES.map((cand) => {
    const hi = groups[groups.length - 1];
    const lo = groups[0];
    const d = diffRow(hi, lo, cand.num, cand.den);
    const points = groups.map((bands) => {
      const n = bandSumAll(bands, cand.num);
      const dd = bandSumAll(bands, cand.den);
      return dd === 0 ? Number.NaN : n / dd;
    });
    const monotone = points.every((v, i) => i === 0 || !(v < points[i - 1]));
    return [cand.id, { topMinusBottom: d, points: points.map((v) => round(v, 6)), monotone }];
  })),
]));

/* ---- the take-rate shape (context: does the armed take fall with arrival speed?) ---- */
const TAKE_SHAPE = Object.fromEntries(Object.entries(GRAINS).map(([grain, groups]) => [grain,
  diffRow(groups[groups.length - 1], groups[0],
    (c, s, b) => c.cells[s][b].wins, (c, s, b) => c.cells[s][b].lunges)]));

/* ========================================================================== */
/* §11 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
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

const tot = {
  lunges: sum(CLUSTERS.map((c) => c.lungesDetected)),
  wins: sum(CLUSTERS.map((c) => c.winsDetected)),
  misses: sum(CLUSTERS.map((c) => c.missesDetected)),
  tabulated: sum(CLUSTERS.map((c) => c.tabulated)),
  whistled: sum(CLUSTERS.map((c) => c.whistledDuels)),
  ledgerArmed: sum(CLUSTERS.map((c) => c.ledgerArmed)),
  ledgerRec: sum(CLUSTERS.map((c) => c.ledgerRecoveries)),
  ledgerGeom: sum(CLUSTERS.map((c) => c.ledgerGeomMisses)),
  ledgerRecSec: sum(CLUSTERS.map((c) => c.ledgerRecoverySeconds)),
  detRecSec: sum(CLUSTERS.map((c) => c.recoverySecondsDetected)),
  chiZero: sum(CLUSTERS.map((c) => c.chiZeroDetected)),
  chiZeroUnwhistled: sum(CLUSTERS.map((c) => c.chiZeroUnwhistled)),
  lawChecked: sum(CLUSTERS.map((c) => c.lawChecked)),
  engineTackles: sum(CLUSTERS.map((c) => c.engineTackleDelta)),
  slideWins: sum(CLUSTERS.map((c) => c.slideWins)),
  unclassified: sum(CLUSTERS.map((c) => c.unclassifiedJumps)),
  maxInTick: Math.max(...CLUSTERS.map((c) => c.maxLungesInATick)),
  outOfRadius: sum(CLUSTERS.map((c) => c.outOfRadiusUnwhistled)),
  maxLawDev: Math.max(...CLUSTERS.map((c) => c.maxLawDeviation)),
  lawViolations: sum(CLUSTERS.map((c) => c.lawViolations)),
  cellLunges: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].lunges),
  cellWins: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].wins),
  cellMisses: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].misses),
  refusalTicks: sum(CLUSTERS.map((c) => c.refusalTicks)),
  cellRefusals: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].refusalTicks),
  proximityTicks: sum(CLUSTERS.map((c) => c.proximityTicks)),
  simSeconds: sum(CLUSTERS.map((c) => c.simSeconds)),
  turnovers: sum(CLUSTERS.map((c) => c.turnoversTotal)),
};

/* ---- gDet ---- */
registerGate<{ equal: boolean; digest: string }>({
  name: 'gDet',
  fn: (i) => ({ rederivesBitIdentically: i.equal, digestNonEmpty: i.digest.length === 64 }),
  input: { equal: detA === detB, digest: sha(detA) },
  mutants: [
    { conjunct: 'rederivesBitIdentically', name: 'the second walk differed', mutate: (i) => ({ ...i, equal: false }) },
    { conjunct: 'digestNonEmpty', name: 'no digest was produced', mutate: (i) => ({ ...i, digest: '' }) },
  ],
});

/* ---- xSrcUntouched (WORKTREE vs HEAD, #273.3) ---- */
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
};
registerGate<{ diff: string; status: string }>({
  name: 'xSrcUntouched',
  fn: (i) => ({
    worktreeMatchesHead: i.diff === '',
    noUntrackedSrcFile: i.status === '',
  }),
  input: { diff: gitOut('git diff HEAD --stat -- src'), status: gitOut('git status --porcelain -- src') },
  mutants: [
    { conjunct: 'worktreeMatchesHead', name: 'a src byte moved against HEAD', mutate: (i) => ({ ...i, diff: ' src/sim/x.ts | 1 +' }) },
    { conjunct: 'noUntrackedSrcFile', name: 'an untracked file sits under src', mutate: (i) => ({ ...i, status: '?? src/x.ts' }) },
  ],
});

/* ---- xFpProd ---- */
registerGate<{ rows: { match: boolean; observed: string }[]; skipped: boolean }>({
  name: 'xFpProd',
  fn: (i) => ({
    everyBaselineHeld: !i.skipped && i.rows.length > 0 && i.rows.every((r) => r.match),
    headlineHeld: i.rows[0]?.observed === FINGERPRINT_BASELINE,
  }),
  input: { rows: FP_ROWS, skipped: SKIP_FP },
  mutants: [
    { conjunct: 'everyBaselineHeld', name: 'a league fingerprint moved', mutate: (i) => ({ ...i, rows: i.rows.map((r, k) => (k === 1 ? { ...r, match: false } : r)) }) },
    { conjunct: 'headlineHeld', name: 'the headline fingerprint changed', mutate: (i) => ({ ...i, rows: [{ ...i.rows[0], observed: 'deadbeef' }, ...i.rows.slice(1)] }) },
  ],
});

/* ---- gWorld ---- */
const worldMatch = armedMatch(WORLD_SEED);
const worldFlags = a4MatchFlags(CB_WORLD_VERSION) as unknown as Record<string, boolean>;
const OTHER_EYES = ['whetherEye', 'stationEye', 'forcedHold', 'forcedTouchPast', 'ekHold'];
registerGate<{
  version: number; flags: Record<string, boolean>; doors: number; eyes: string[];
  duration: number; stepped: number;
}>({
  name: 'gWorld',
  fn: (i) => ({
    armedAtVersionSix: i.version === CB_WORLD_VERSION,
    everyCbDoorOpen: i.flags.cbTouchPast === true && i.flags.cbChoiceSeat === true
      && i.flags.cbCommitPhysics === true,
    noEyeNoBook: i.eyes.length === 0,
    noEngineDoorSet: i.doors === 0,
    theMatchClock: i.duration === MATCH_DURATION,
    neverStepped: i.stepped === 0,
  }),
  input: {
    version: cbArmedVersion(worldMatch), flags: worldFlags, doors: doorsSet.length,
    eyes: OTHER_EYES.filter((k) => (worldMatch as unknown as Record<string, unknown>)[k] != null),
    duration: worldMatch.duration, stepped: worldMatch.simTick,
  },
  mutants: [
    { conjunct: 'armedAtVersionSix', name: 'the world armed at another version', mutate: (i) => ({ ...i, version: 0 }) },
    { conjunct: 'everyCbDoorOpen', name: 'a CB door was shut', mutate: (i) => ({ ...i, flags: { ...i.flags, cbCommitPhysics: false } }) },
    { conjunct: 'noEyeNoBook', name: 'an eye or book was armed', mutate: (i) => ({ ...i, eyes: ['whetherEye'] }) },
    { conjunct: 'noEngineDoorSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doors: 1 }) },
    { conjunct: 'theMatchClock', name: 'the match clock was overridden', mutate: (i) => ({ ...i, duration: i.duration + 1 }) },
    { conjunct: 'neverStepped', name: 'the receipt match had been stepped', mutate: (i) => ({ ...i, stepped: 1 }) },
  ],
});

/* ---- gConstTrace ---- */
registerGate<Record<string, number>>({
  name: 'gConstTrace',
  fn: (i) => ({
    challengeRadiusTraced: i.rTackle > 0 && Number.isFinite(i.rTackle),
    cbModuleAgreesOnTheRadius: i.cbRadius === i.rTackle,
    incumbentMissPriceTraced: i.missCd > 0 && i.missStun > 0,
    winCooldownTraced: i.winCd > 0,
    accelTraced: i.accel > 0,
    everyOtherWriterTraced: [i.slide, i.grab, i.smother, i.aerial].every((v) => v > 0),
    sevenTackleCooldownWriters: i.writers === 7,
    seasonFixturesTraced: i.seasonFixtures > 0,
    displayClockTraced: i.displayMin > 0 && i.displayPerSim > 0,
  }),
  input: {
    rTackle: R_TACKLE, cbRadius: CB_TACKLE_RADIUS_SRC, missCd: MISS_COOLDOWN_S,
    missStun: MISS_STUN_S, winCd: WIN_COOLDOWN_S, accel: ACCEL,
    slide: SLIDE_COOLDOWN_S, grab: GRAB_COOLDOWN_S, smother: SMOTHER_COOLDOWN_S,
    aerial: GK_AERIAL_COOLDOWN_S, writers: TACKLE_COOLDOWN_WRITERS,
    seasonFixtures: SEASON_FIXTURES_PER_TEAM, displayMin: DISPLAY_MINUTES,
    displayPerSim: DISPLAY_S_PER_SIM_S,
  },
  mutants: [
    { conjunct: 'challengeRadiusTraced', name: 'the radius regex found nothing', mutate: (i) => ({ ...i, rTackle: 0, cbRadius: 0 }) },
    { conjunct: 'cbModuleAgreesOnTheRadius', name: 'carryBeat carries another radius', mutate: (i) => ({ ...i, cbRadius: i.rTackle + 1 }) },
    { conjunct: 'incumbentMissPriceTraced', name: 'the incumbent miss price vanished', mutate: (i) => ({ ...i, missStun: 0 }) },
    { conjunct: 'winCooldownTraced', name: 'the win cooldown vanished', mutate: (i) => ({ ...i, winCd: 0 }) },
    { conjunct: 'accelTraced', name: 'ACCEL vanished', mutate: (i) => ({ ...i, accel: 0 }) },
    { conjunct: 'everyOtherWriterTraced', name: 'a rival mechanic constant vanished', mutate: (i) => ({ ...i, grab: 0 }) },
    { conjunct: 'sevenTackleCooldownWriters', name: 'an eighth cooldown writer appeared', mutate: (i) => ({ ...i, writers: i.writers + 1 }) },
    { conjunct: 'seasonFixturesTraced', name: 'the season length vanished', mutate: (i) => ({ ...i, seasonFixtures: 0 }) },
    { conjunct: 'displayClockTraced', name: 'the display clock vanished', mutate: (i) => ({ ...i, displayMin: 0 }) },
  ],
});

/* ---- gBandsDerived ---- */
registerGate<{ vStar: number; cuts: number[]; grains: Record<string, number[][]> }>({
  name: 'gBandsDerived',
  fn: (i) => ({
    vStarIsTheBrakingIdentity: Math.abs((i.vStar * i.vStar) / (2 * ACCEL) - R_TACKLE) < 1e-12,
    cutsAreQuartersOfVStar: i.cuts.length === 4
      && i.cuts.every((v, k) => Math.abs(v - ((k + 1) / 4) * i.vStar) < 1e-12),
    grainsArePartitionsOfTheFive: Object.values(i.grains).every((g) => {
      const flat = g.flat();
      return flat.length === NB && flat.every((b, k) => b === k);
    }),
  }),
  input: { vStar: V_STAR, cuts: BAND_CUTS, grains: GRAINS },
  mutants: [
    { conjunct: 'vStarIsTheBrakingIdentity', name: 'v* is not the braking identity', mutate: (i) => ({ ...i, vStar: i.vStar + 1, cuts: [1, 2, 3, 4].map((k) => (k / 4) * (i.vStar + 1)) }) },
    { conjunct: 'cutsAreQuartersOfVStar', name: 'a cut is not a quarter of v*', mutate: (i) => ({ ...i, cuts: [i.cuts[0] + 1, ...i.cuts.slice(1)] }) },
    { conjunct: 'grainsArePartitionsOfTheFive', name: 'a grain drops a band', mutate: (i) => ({ ...i, grains: { ...i.grains, g2: [[0, 1, 2], [4]] } }) },
  ],
});

/* ---- gDetect ---- */
registerGate<Record<string, number>>({
  name: 'gDetect',
  fn: (i) => ({
    detectedLungesAreTheEngineLedger: i.lunges === i.ledgerArmed,
    detectedMissesAreTheEngineLedger: i.misses === i.ledgerRec,
    winsPlusSlideWinsAreTheEngineCounter: i.wins + i.slideWins === i.engineTackles,
    noUnclassifiedCooldownJump: i.unclassified === 0,
    atMostOneLungePerTick: i.maxInTick <= 1,
    everyUnwhistledDuelInsideTheRadius: i.outOfRadius === 0,
    tabulatedPlusWhistledIsEveryLunge: i.tabulated + i.whistled === i.lunges,
  }),
  input: {
    lunges: tot.lunges, misses: tot.misses, wins: tot.wins, slideWins: tot.slideWins,
    engineTackles: tot.engineTackles, ledgerArmed: tot.ledgerArmed, ledgerRec: tot.ledgerRec,
    unclassified: tot.unclassified, maxInTick: tot.maxInTick, outOfRadius: tot.outOfRadius,
    tabulated: tot.tabulated, whistled: tot.whistled,
  },
  mutants: [
    { conjunct: 'detectedLungesAreTheEngineLedger', name: 'a lunge was missed by the detector', mutate: (i) => ({ ...i, ledgerArmed: i.ledgerArmed + 1 }) },
    { conjunct: 'detectedMissesAreTheEngineLedger', name: 'a miss was misclassified', mutate: (i) => ({ ...i, ledgerRec: i.ledgerRec + 1 }) },
    { conjunct: 'winsPlusSlideWinsAreTheEngineCounter', name: 'the engine counted another take', mutate: (i) => ({ ...i, engineTackles: i.engineTackles + 1 }) },
    { conjunct: 'noUnclassifiedCooldownJump', name: 'an unclassified cooldown jump', mutate: (i) => ({ ...i, unclassified: 1 }) },
    { conjunct: 'atMostOneLungePerTick', name: 'two lunges in one tick', mutate: (i) => ({ ...i, maxInTick: 2 }) },
    { conjunct: 'everyUnwhistledDuelInsideTheRadius', name: 'a duel outside the challenge radius', mutate: (i) => ({ ...i, outOfRadius: 1 }) },
    { conjunct: 'tabulatedPlusWhistledIsEveryLunge', name: 'a lunge is neither tabulated nor whistled', mutate: (i) => ({ ...i, whistled: i.whistled + 1 }) },
  ],
});

/* ---- gLawsRederived (χ and the recovery interval, independently) ---- */
registerGate<Record<string, number>>({
  name: 'gLawsRederived',
  fn: (i) => ({
    /* the χ re-derivation is checked against the ENGINE'S OWN geometric-miss counter; the only
     * admissible residue is the WHISTLED population, whose post-step geometry is the restart's. */
    chiDisagreementsAreConfinedToWhistledDuels: Math.abs(i.chiZero - i.ledgerGeom) <= i.whistled,
    geometricMissesExist: i.ledgerGeom > 0,
    recoveryLawReDerives: i.lawViolations === 0,
    theLawWasActuallyChecked: i.lawChecked > 0,
    recoverySecondsAgreeWithTheLedger: Math.abs(i.detRecSec - i.ledgerRecSec) <= 1e-6,
    theToleranceIsDerivedNotChosen: i.tol === Math.sqrt(2 * Number.EPSILON) / TURN_RATE,
    theDeviationIsBelowTheBound: i.maxDev <= i.tol,
  }),
  input: {
    chiZero: tot.chiZero, ledgerGeom: tot.ledgerGeom, lawViolations: tot.lawViolations,
    detRecSec: tot.detRecSec, ledgerRecSec: tot.ledgerRecSec, whistled: tot.whistled,
    tol: LAW_TOL, maxDev: tot.maxLawDev, lawChecked: tot.lawChecked,
  },
  mutants: [
    { conjunct: 'chiDisagreementsAreConfinedToWhistledDuels', name: 'the χ re-derivation disagrees beyond the whistled set', mutate: (i) => ({ ...i, chiZero: i.chiZero + i.whistled + 1 }) },
    { conjunct: 'geometricMissesExist', name: 'the armed world produced no geometric miss', mutate: (i) => ({ ...i, chiZero: 0, ledgerGeom: 0 }) },
    { conjunct: 'recoveryLawReDerives', name: 'a recovery interval disagrees with the law', mutate: (i) => ({ ...i, lawViolations: 1 }) },
    { conjunct: 'theLawWasActuallyChecked', name: 'no miss reached the law check', mutate: (i) => ({ ...i, lawChecked: 0 }) },
    { conjunct: 'recoverySecondsAgreeWithTheLedger', name: 'the summed recovery seconds drifted', mutate: (i) => ({ ...i, detRecSec: i.detRecSec + 1 }) },
    { conjunct: 'theToleranceIsDerivedNotChosen', name: 'the tolerance was hand-widened', mutate: (i) => ({ ...i, tol: i.tol * 2 }) },
    { conjunct: 'theDeviationIsBelowTheBound', name: 'a deviation exceeded the derived bound', mutate: (i) => ({ ...i, maxDev: i.tol * 2 }) },
  ],
});

/* ---- gAccounting ---- */
const keepMonotone = (() => {
  const rates = WINDOWS_S.map((_, w) => bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].keepK[w]));
  return rates.every((v, i) => i === 0 || v <= rates[i - 1]);
})();
const keepDenominators = WINDOWS_S.map((_, w) => bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].keepN[w]));
registerGate<{
  cellLunges: number; tabulated: number; cellWins: number; cellMisses: number;
  refusalCells: number; refusalTicks: number; monotone: boolean; dens: number[];
  everyBandPopulated: boolean; recN: number; missN: number;
}>({
  name: 'gAccounting',
  fn: (i) => ({
    everyTabulatedLungeSitsInExactlyOneBand: i.cellLunges === i.tabulated,
    winsPlusMissesAreTheBandPopulation: i.cellWins + i.cellMisses === i.cellLunges,
    refusalCellsCoverEveryRefusalTick: i.refusalCells === i.refusalTicks,
    keptSharesAreMonotoneInTheWindow: i.monotone,
    longerWindowsCensorMore: i.dens.every((v, k) => k === 0 || v <= i.dens[k - 1]),
    everyBandCarriesLunges: i.everyBandPopulated,
    everyMissPaidARecoveryInterval: i.recN === i.missN,
  }),
  input: {
    cellLunges: tot.cellLunges, tabulated: tot.tabulated, cellWins: tot.cellWins,
    cellMisses: tot.cellMisses, refusalCells: tot.cellRefusals, refusalTicks: tot.refusalTicks,
    monotone: keepMonotone, dens: keepDenominators,
    everyBandPopulated: ALL_BANDS.every((b) => bandSumAll([b], (c, s, bb) => c.cells[s][bb].lunges) > 0),
    recN: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].recN), missN: tot.cellMisses,
  },
  mutants: [
    { conjunct: 'everyTabulatedLungeSitsInExactlyOneBand', name: 'a lunge fell out of the grid', mutate: (i) => ({ ...i, tabulated: i.tabulated + 1 }) },
    { conjunct: 'winsPlusMissesAreTheBandPopulation', name: 'an outcome is neither win nor miss', mutate: (i) => ({ ...i, cellWins: i.cellWins + 1 }) },
    { conjunct: 'refusalCellsCoverEveryRefusalTick', name: 'a refusal tick has no cell', mutate: (i) => ({ ...i, refusalCells: i.refusalCells - 1 }) },
    { conjunct: 'keptSharesAreMonotoneInTheWindow', name: 'the kept count grew with the window', mutate: (i) => ({ ...i, monotone: false }) },
    { conjunct: 'longerWindowsCensorMore', name: 'a longer window resolved more events', mutate: (i) => ({ ...i, dens: [i.dens[0], i.dens[0] + 1, ...i.dens.slice(2)] }) },
    { conjunct: 'everyBandCarriesLunges', name: 'a band is empty', mutate: (i) => ({ ...i, everyBandPopulated: false }) },
    { conjunct: 'everyMissPaidARecoveryInterval', name: 'a miss carries no recovery reading', mutate: (i) => ({ ...i, recN: i.recN - 1 }) },
  ],
});

/* ---- gReproDvc0 ---- */
const dvSmoke = readJson(DVC0_SMOKE_PATH);
const dvCensus = ((dvSmoke.result as Record<string, unknown>).census) as Record<string, unknown>;
const dvAcct = dvCensus.accounting as Record<string, number>;
const dvPrimary = (dvCensus.table as { isPrimary: boolean; byThird: { zone: string; turnovers: number }[] }[])
  .find((t) => t.isPrimary);
const dvThirds: Record<string, number> = Object.fromEntries(
  (dvPrimary?.byThird ?? []).map((r) => [r.zone, r.turnovers]));
const reproObserved: Record<string, number> = {
  totalTicks: sum(REPRO_ROWS.map((r) => r.totalTicks)),
  deadBallTicks: sum(REPRO_ROWS.map((r) => r.deadBallTicks)),
  segmentTicks: sum(REPRO_ROWS.map((r) => r.segmentTicks)),
  looseGapTicks: sum(REPRO_ROWS.map((r) => r.looseGapTicks)),
  assignedTicksSum: sum(REPRO_ROWS.map((r) => r.assignedTicksSum)),
  spanOrderViolations: sum(REPRO_ROWS.map((r) => r.spanOrderViolations)),
  goalsFromScore: sum(REPRO_ROWS.map((r) => r.goalsFromScore)),
  turnoversTotal: sum(REPRO_ROWS.map((r) => r.turnoversTotal)),
  own: sum(REPRO_ROWS.map((r) => r.turnoversByThird.own)),
  middle: sum(REPRO_ROWS.map((r) => r.turnoversByThird.middle)),
  final: sum(REPRO_ROWS.map((r) => r.turnoversByThird.final)),
};
const reproExpected: Record<string, number> = {
  totalTicks: dvAcct.totalTicks, deadBallTicks: dvAcct.deadBallTicks,
  segmentTicks: dvAcct.segmentTicks, looseGapTicks: dvAcct.looseGapTicks,
  assignedTicksSum: dvAcct.assignedTicksSum,
  spanOrderViolations: dvAcct.spanOrderViolations, goalsFromScore: dvAcct.goalsFromScore,
  turnoversTotal: dvAcct.turnoversTotal,
  own: dvThirds.own, middle: dvThirds.middle, final: dvThirds.final,
};
const dvSeeds = ((dvSmoke.result as Record<string, unknown>).seeds) as { base: number; n: number };
registerGate<{
  observed: Record<string, number>; expected: Record<string, number>;
  walkedBase: number; walkedN: number; committedBase: number; committedN: number;
}>({
  name: 'gReproDvc0',
  fn: (i) => ({
    elevenFieldsCompared: Object.keys(i.expected).length === 11,
    noMismatch: Object.keys(i.expected).every((k) => i.observed[k] === i.expected[k]),
    theBlockIsDvc0sOwnCommittedOne: i.walkedBase === i.committedBase && i.walkedN === i.committedN,
  }),
  input: {
    observed: reproObserved, expected: reproExpected,
    walkedBase: REPRO_BASE, walkedN: REPRO_N,
    committedBase: dvSeeds.base, committedN: dvSeeds.n,
  },
  mutants: [
    { conjunct: 'elevenFieldsCompared', name: 'a field was dropped from the comparison', mutate: (i) => ({ ...i, expected: { totalTicks: i.expected.totalTicks } }) },
    { conjunct: 'noMismatch', name: "DV-C0's own rows do not reproduce", mutate: (i) => ({ ...i, observed: { ...i.observed, totalTicks: i.observed.totalTicks + 1 } }) },
    { conjunct: 'theBlockIsDvc0sOwnCommittedOne', name: 'the re-walk block moved off the receipt', mutate: (i) => ({ ...i, walkedBase: i.walkedBase + 1 }) },
  ],
});

/* ---- gWindowTrace ---- */
registerGate<{
  primary: number; dvPrimary: number; ladder: number[]; family: number[]; familyMin: number;
  windows: number[]; h1: number; missCd: number;
}>({
  name: 'gWindowTrace',
  fn: (i) => ({
    primaryIsDvc0Primary: i.primary === i.dvPrimary,
    ladderContainsDvc0Ladder: i.ladder.every((w) => i.windows.includes(w)),
    primaryInTheFamily: i.family.includes(i.primary),
    ladderMultiplesOfTheFamilyMinimum: i.ladder.every((w) => w % i.familyMin === 0)
      && i.familyMin === Math.min(...i.family),
    theEngineHorizonsAreTheEnginesOwn: i.windows[0] === i.missCd && i.windows[1] === 2 * i.missCd,
    h1TicksAreTheIncumbentInterval: Math.abs(i.h1 * DT - i.missCd) < 1e-9,
  }),
  input: {
    primary: PRIMARY_WINDOW_S, dvPrimary: DV_WINDOWS.primaryWindowS,
    ladder: DV_WINDOWS.windowsS, family: DV_FAMILY, familyMin: Math.min(...DV_FAMILY),
    windows: WINDOWS_S, h1: H1_TICKS, missCd: MISS_COOLDOWN_S,
  },
  mutants: [
    { conjunct: 'primaryIsDvc0Primary', name: 'the primary window was re-chosen', mutate: (i) => ({ ...i, dvPrimary: i.dvPrimary + 1 }) },
    { conjunct: 'ladderContainsDvc0Ladder', name: "DV-C0's ladder is not carried", mutate: (i) => ({ ...i, windows: i.windows.filter((w) => w !== i.ladder[0]) }) },
    { conjunct: 'primaryInTheFamily', name: 'the primary left the #218 family', mutate: (i) => ({ ...i, family: [i.familyMin, i.familyMin * 2 + 1] }) },
    { conjunct: 'ladderMultiplesOfTheFamilyMinimum', name: 'a ladder rung is not a multiple of the family minimum', mutate: (i) => ({ ...i, familyMin: 7 }) },
    { conjunct: 'theEngineHorizonsAreTheEnginesOwn', name: 'the duel horizons were typed', mutate: (i) => ({ ...i, windows: [i.missCd + 1, ...i.windows.slice(1)] }) },
    { conjunct: 'h1TicksAreTheIncumbentInterval', name: 'H1 is not the incumbent interval', mutate: (i) => ({ ...i, h1: i.h1 + 5 }) },
  ],
});

/* ---- gNonVac ---- */
const claimGrainDenominators: number[] = [];
for (const [grain, groups] of Object.entries(GRAINS)) {
  for (const bands of groups) {
    claimGrainDenominators.push(bandSumAll(bands, (c, s, b) => c.cells[s][b].lunges));
    for (const cand of CANDIDATES) claimGrainDenominators.push(bandSumAll(bands, cand.den));
  }
  void grain;
}
registerGate<{ dens: number[]; refusals: number; misses: number; wins: number; clusters: number }>({
  name: 'gNonVac',
  fn: (i) => ({
    everyPublishedRateHasEvents: i.dens.every((d) => d > 0),
    theWithheldBaselineExists: i.refusals > 0,
    missesExist: i.misses > 0,
    winsExist: i.wins > 0,
    moreThanOneCluster: i.clusters > 1,
  }),
  input: {
    dens: claimGrainDenominators, refusals: tot.refusalTicks, misses: tot.cellMisses,
    wins: tot.cellWins, clusters: nClusters,
  },
  mutants: [
    { conjunct: 'everyPublishedRateHasEvents', name: 'a published rate has an empty denominator', mutate: (i) => ({ ...i, dens: [...i.dens, 0] }) },
    { conjunct: 'theWithheldBaselineExists', name: 'no refusal tick was seen', mutate: (i) => ({ ...i, refusals: 0 }) },
    { conjunct: 'missesExist', name: 'no miss was seen', mutate: (i) => ({ ...i, misses: 0 }) },
    { conjunct: 'winsExist', name: 'no lunge was ever won', mutate: (i) => ({ ...i, wins: 0 }) },
    { conjunct: 'moreThanOneCluster', name: 'a single cluster', mutate: (i) => ({ ...i, clusters: 1 }) },
  ],
});

/* ---- gBoot ---- */
registerGate<{ rows: number; width: number; clusters: number; walkedN: number; inRange: boolean }>({
  name: 'gBoot',
  fn: (i) => ({
    oneSharedMatrix: i.rows === BOOT_B,
    widthIsTheClusterCount: i.width === i.clusters,
    indicesInRange: i.inRange,
    clustersAreTheWalkedSeeds: i.clusters === i.walkedN,
  }),
  input: {
    rows: BOOT_ROWS.length, width: BOOT_ROWS[0]?.length ?? 0, clusters: nClusters, walkedN: N,
    inRange: BOOT_ROWS.every((r) => r.every((v) => v >= 0 && v < nClusters)),
  },
  mutants: [
    { conjunct: 'oneSharedMatrix', name: 'a second matrix was drawn', mutate: (i) => ({ ...i, rows: BOOT_B + 1 }) },
    { conjunct: 'widthIsTheClusterCount', name: 'the resample width is wrong', mutate: (i) => ({ ...i, width: i.clusters + 1 }) },
    { conjunct: 'indicesInRange', name: 'an index is out of range', mutate: (i) => ({ ...i, inRange: false }) },
    { conjunct: 'clustersAreTheWalkedSeeds', name: 'a cluster is not a walked seed', mutate: (i) => ({ ...i, walkedN: i.walkedN + 1 }) },
  ],
});

/* ---- gSeed ---- */
interface SeedInput {
  intervals: { name: string; lo: number; hi: number }[];
  rewalk: { lo: number; hi: number };
  consumed: readonly { name: string; range: readonly [number, number] }[];
  band: readonly [number, number];
}
registerGate<SeedInput>({
  name: 'gSeed',
  fn: (i) => ({
    everyIntervalInsideTheBand: i.intervals.every((v) => v.lo >= i.band[0] && v.hi <= i.band[1]),
    pairwiseDisjoint: i.intervals.every((a, ai) => i.intervals
      .every((b, bi) => bi === ai || a.hi < b.lo || b.hi < a.lo)),
    disjointFromTheLedger: i.intervals.every((v) => i.consumed
      .every((cc) => v.hi < cc.range[0] || cc.range[1] < v.lo)),
    theRewalkPredicateIsInverted: i.consumed
      .some((cc) => !(i.rewalk.hi < cc.range[0] || cc.range[1] < i.rewalk.lo)),
  }),
  input: {
    intervals: [
      { name: 'sizing', lo: SIZING_BASE, hi: SIZING_BASE + 4 },
      { name: 'battery', lo: BATTERY_BASE, hi: BATTERY_BASE + N - 1 },
      { name: 'det', lo: DET_SEED, hi: DET_SEED },
      { name: 'world', lo: WORLD_SEED, hi: WORLD_SEED },
    ],
    rewalk: { lo: REPRO_BASE, hi: REPRO_BASE + REPRO_N - 1 },
    consumed: CONSUMED, band: BAND_SEEDS,
  },
  mutants: [
    { conjunct: 'everyIntervalInsideTheBand', name: 'an interval left the band', mutate: (i) => ({ ...i, band: [i.band[0], i.intervals[0].lo] as const }) },
    { conjunct: 'pairwiseDisjoint', name: 'two intervals overlap', mutate: (i) => ({ ...i, intervals: [...i.intervals, { ...i.intervals[0], name: 'dup' }] }) },
    { conjunct: 'disjointFromTheLedger', name: 'the ledger covers the battery block', mutate: (i) => ({ ...i, consumed: [...i.consumed, { name: 'x', range: [BATTERY_BASE, BATTERY_BASE + 1] as const }] }) },
    { conjunct: 'theRewalkPredicateIsInverted', name: 'the re-walk walked fresh seeds', mutate: (i) => ({ ...i, rewalk: { lo: BAND_SEEDS[1] - 1, hi: BAND_SEEDS[1] } }) },
  ],
});

/* ---- gStats ---- */
registerGate<{ base: number; floor: number; published: number[]; step: number }>({
  name: 'gStats',
  fn: (i) => ({
    atOrAboveTheFloor: i.base >= i.floor,
    onTheGrid: i.base % i.step === 0,
    clearOfEveryPublishedBase: i.published.every((p) => Math.abs(p - i.base) >= i.step),
  }),
  input: { base: STATS_BASE, floor: STATS_FLOOR, published: [...PUBLISHED_BASES], step: 200 },
  mutants: [
    { conjunct: 'atOrAboveTheFloor', name: 'the ruling floor is above the base', mutate: (i) => ({ ...i, floor: i.base + 200 }) },
    { conjunct: 'onTheGrid', name: 'off the 200 grid', mutate: (i) => ({ ...i, base: i.base + 1 }) },
    { conjunct: 'clearOfEveryPublishedBase', name: 'too close to a published base', mutate: (i) => ({ ...i, published: [...i.published, i.base + 1] }) },
  ],
});

/* ---- gEnvClean ---- */
registerGate<{ preflight: boolean; reasons: string[]; aimedAtCanonical: boolean }>({
  name: 'gEnvClean',
  fn: (i) => ({
    notAPreflight: !i.preflight,
    noOverrideReason: i.reasons.length === 0,
    noPreflightOnACanonicalPath: !i.aimedAtCanonical,
  }),
  input: {
    preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS,
    aimedAtCanonical: IS_PREFLIGHT && isCanonicalPath(OUT_PATH),
  },
  mutants: [
    { conjunct: 'notAPreflight', name: 'an override was set', mutate: (i) => ({ ...i, preflight: true }) },
    { conjunct: 'noOverrideReason', name: 'an override reason exists', mutate: (i) => ({ ...i, reasons: ['L3C0_N'] }) },
    { conjunct: 'noPreflightOnACanonicalPath', name: 'a preflight aimed at a canonical path', mutate: (i) => ({ ...i, aimedAtCanonical: true }) },
  ],
});

/* ---- gN ---- */
registerGate<{
  rarest: number; precision: number; wall: number; cap: number; nStar: number; ran: number;
  overridden: boolean; sizingCommitted: boolean;
}>({
  name: 'gN',
  fn: (i) => ({
    nStarIsTheRuleOutput: i.nStar === Math.min(
      Math.max(Math.ceil(N_EVENTS / i.rarest), N_FLOOR), i.wall, i.cap),
    ranAtNStar: i.ran === i.nStar && !i.overridden,
    termsFromTheCommittedSizingArtifact: i.sizingCommitted,
    precisionTermIsBounded: Number.isFinite(i.precision),
  }),
  input: {
    rarest: SIZING.rarestBandMissesPerMatch, precision: precisionTerm, wall: wallTerm,
    cap: N_CAP, nStar: N_STAR, ran: N, overridden: N_ENV !== null,
    sizingCommitted: existsSync(SIZING_PATH),
  },
  mutants: [
    { conjunct: 'nStarIsTheRuleOutput', name: 'N* is not the rule', mutate: (i) => ({ ...i, nStar: i.nStar + 1, ran: i.ran + 1 }) },
    { conjunct: 'ranAtNStar', name: 'the battery ran at another N', mutate: (i) => ({ ...i, ran: i.ran + 1 }) },
    { conjunct: 'termsFromTheCommittedSizingArtifact', name: 'the sizing artifact is absent', mutate: (i) => ({ ...i, sizingCommitted: false }) },
    { conjunct: 'precisionTermIsBounded', name: 'the zero-event clause fired', mutate: (i) => ({ ...i, precision: Infinity }) },
  ],
});

/* ---- gValuesUnreachable ---- */
const SRC_FILES: string[] = (() => {
  const out: string[] = [];
  const walkDir = (d: string): void => {
    for (const e of readdirSync(d)) {
      const p = pathJoin(d, e);
      if (statSync(p).isDirectory()) walkDir(p);
      else if (p.endsWith('.ts')) out.push(p);
    }
  };
  walkDir('src');
  return out;
})();
const SRC_BLOB = SRC_FILES.map((f) => readFileSync(f, 'utf8')).join('\n');
const NEEDLES: string[] = (() => {
  const vals: number[] = [];
  for (const groups of Object.values(GRAIN_TABLES) as { takeRate: Row;
    candidates: Record<string, { rate: Row }> }[][]) {
    for (const row of groups) {
      vals.push(row.takeRate.point);
      for (const cand of Object.values(row.candidates)) vals.push(cand.rate.point);
    }
  }
  const out = new Set<string>();
  for (const v of vals) {
    if (!Number.isFinite(v) || v === 0 || v === 1) continue;
    out.add(v.toFixed(5));
    out.add((v * 100).toFixed(3));
  }
  return [...out];
})();
const CONTROL_NEEDLE = String(R_TACKLE);
registerGate<{ needles: string[]; blob: string; files: number; control: string }>({
  name: 'gValuesUnreachable',
  fn: (i) => ({
    noPublishedRateAppearsInSrc: i.needles.every((n) => !i.blob.includes(n)),
    theNeedleSetIsNonTrivial: i.needles.length >= 20,
    theFileSetIsNonTrivial: i.files >= 100,
    theControlNeedleIsFound: i.blob.includes(i.control),
  }),
  input: { needles: NEEDLES, blob: SRC_BLOB, files: SRC_FILES.length, control: CONTROL_NEEDLE },
  mutants: [
    { conjunct: 'noPublishedRateAppearsInSrc', name: 'a published rate is reachable in src', mutate: (i) => ({ ...i, needles: [...i.needles, i.control] }) },
    { conjunct: 'theNeedleSetIsNonTrivial', name: 'the needle set is degenerate', mutate: (i) => ({ ...i, needles: i.needles.slice(0, 1) }) },
    { conjunct: 'theFileSetIsNonTrivial', name: 'the file set is degenerate', mutate: (i) => ({ ...i, files: 1 }) },
    { conjunct: 'theControlNeedleIsFound', name: 'the control needle is missing', mutate: (i) => ({ ...i, control: 'ZZZ-not-in-src' }) },
  ],
});

/* ---- gHashEnvelope (input filled after the body exists) ---- */
interface HashInput { crossOutIdentical: boolean; rederivesFromDisk: boolean; forbidden: string[] }
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'head', 'outPath', 'elapsedMs', 'msPerMatchRealized'];
let hashInput: HashInput = { crossOutIdentical: true, rederivesFromDisk: true, forbidden: [] };
registerGate<HashInput>({
  name: 'gHashEnvelope',
  fn: (i) => ({
    crossOutDigestIdentical: i.crossOutIdentical,
    rederivesFromTheWrittenBody: i.rederivesFromDisk,
    noInvocationKeyInTheBody: i.forbidden.length === 0,
  }),
  input: hashInput,
  mutants: [
    { conjunct: 'crossOutDigestIdentical', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'rederivesFromTheWrittenBody', name: 'the written body does not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'noInvocationKeyInTheBody', name: 'an invocation key sits in the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- gMutants ---- */
interface MutInput { uncovered: string[]; dead: number; total: number }
registerGate<MutInput>({
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
}
const CONJUNCT_TOTAL = Object.values(COVERAGE_MAP).reduce((a, v) => a + v.length, 0);
if (uncoveredConjuncts.length > 0) {
  banner('L3-C0 FATAL (#268.3(a)): the MACHINE-DERIVED coverage map has conjuncts without a mutant —');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}
banner(`liveness: ${REGISTRY.length} gate objects · ${CONJUNCT_TOTAL} conjuncts enumerated FROM THE OBJECTS`);

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
let { gates, mutants } = runRegistry();
const FROZEN_GATE_NAMES = ['gDet', 'xSrcUntouched', 'xFpProd', 'gWorld', 'gConstTrace',
  'gBandsDerived', 'gDetect', 'gLawsRederived', 'gAccounting', 'gReproDvc0', 'gWindowTrace',
  'gNonVac', 'gBoot', 'gSeed', 'gStats', 'gEnvClean', 'gN', 'gValuesUnreachable',
  'gHashEnvelope', 'gMutants'];

/* ========================================================================== */
/* §12 THE ARTIFACT                                                            */
/* ========================================================================== */
const buildBody = (): Record<string, unknown> => ({
  schema: 'l3-c0-lunge-outcome-census/v1',
  stage: 'L3-C0 — THE LUNGE-OUTCOME CENSUS',
  contract: 'docs/world-model/CB-L3-DEFENCE-BOOK-CONTRACT.md §3 L3-C0',
  ruling: '#277.2',
  probeSha: SELF_SHA,
  world: {
    description: 'THE POLISHED ARMED WORLD — the play entry\'s own arming (a4MatchFlags(6) '
      + '+ armA4World(m, null, 6), dose 1.0), cbArmedVersion === 6 asserted (#273).',
    version: CB_WORLD_VERSION, flags: worldFlags,
    matchDurationS: MATCH_DURATION,
  },
  clock: {
    law: '⭐ #270.2 / #272.3(ii): every rate below is on the 240 s MATCH CLOCK (convention A) and '
      + 'carries its convention-B (display 90′) reading beside it. Both terms are EXTRACTED.',
    matchDurationS: MATCH_DURATION, displayMinutes: DISPLAY_MINUTES,
    displaySecondsPerSimSecond: round(DISPLAY_S_PER_SIM_S, 6),
    simSecondsPerMatch: round(tot.simSeconds / matches, 4),
  },
  bands: {
    index: '⭐ THE LUNGER\'S OWN VELOCITY AT THE LUNGE DECISION (the self-percept; M-L3.1).',
    vStar: V_STAR, cuts: BAND_CUTS, labels: [...BAND_LABELS],
    derivation: 'v* = sqrt(2·ACCEL·R_TACKLE), both traced from src; the cuts are its quarters '
      + '(CB-C0 §BINS\' own family). The coarser grains are contiguous UNIONS of these five.',
    grains: GRAINS, grainLabels: GRAIN_LABELS,
  },
  candidates: CANDIDATES.map((c) => ({ id: c.id, family: c.family, what: c.what })),
  windows: {
    primaryWindowS: PRIMARY_WINDOW_S, ladderS: WINDOWS_S, dvc0Ladder: DV_WINDOWS.windowsS,
    family: DV_FAMILY,
    trace: 'the loss semantics are DV-C0\'s (segment walker re-walked on its own committed smoke '
      + 'block, G-REPRO-DVC0); the primary window and ladder are read from DV-C0\'s committed '
      + 'artifact and the #218 family from the goal-genealogy census\'s. The two shortest rungs '
      + 'are the ENGINE\'s own duel horizons (MISS_COOLDOWN_S and twice it).',
    perEventWindow: 'ownRecovery — the recovery interval the engine\'s own law made THIS lunger pay.',
  },
  run: {
    matches, teamMatches, seeds: { band: BAND_SEEDS, battery: [BATTERY_BASE, BATTERY_BASE + N - 1],
      sizing: SIZING_BASE, det: DET_SEED, world: WORLD_SEED,
      rewalkReceipt: [REPRO_BASE, REPRO_BASE + REPRO_N - 1], consumed: CONSUMED },
    nRule: {
      rule: 'N* = min( max( ceil(600 / rarestBandMissesPerMatch), 60 ), floor(0.5 h / msPerMatch), 700 )',
      nEvents: N_EVENTS, floor: N_FLOOR, cap: N_CAP,
      rarestBandMissesPerMatch: SIZING.rarestBandMissesPerMatch, msPerMatch: SIZING.msPerMatch,
      precisionTerm: Number.isFinite(precisionTerm) ? precisionTerm : null,
      wallTerm, nStar: N_STAR, ran: N, overridden: N_ENV !== null,
    },
    stats: { base: STATS_BASE, step: 200, resamples: BOOT_B, clusters: nClusters },
    estimator: 'cluster bootstrap by match seed (#20), 2,000 resamples, percentile 95 % CI, '
      + 'ratio-of-sums, ONE SHARED resample matrix so every difference is paired by construction.',
    totals: {
      lunges: tot.lunges, wins: tot.wins, misses: tot.misses, tabulated: tot.tabulated,
      whistledExcluded: tot.whistled, geometricMisses: tot.chiZero,
      refusalTicks: tot.refusalTicks, proximityTicks: tot.proximityTicks,
      turnovers: tot.turnovers,
      lungesPerMatch: round(tot.tabulated / matches, 4),
      lungesPerTeamMatch: round(tot.tabulated / teamMatches, 4),
      missesPerTeamMatch: round(tot.cellMisses / teamMatches, 4),
      refusalTicksPerTeamMatch: round(tot.refusalTicks / teamMatches, 4),
      turnoversPerMatch: round(tot.turnovers / matches, 4),
      slideEvents: sum(CLUSTERS.map((c) => c.slideEvents)),
      grabEvents: sum(CLUSTERS.map((c) => c.grabEvents)),
      maxLawDeviation: tot.maxLawDev, lawTolerance: LAW_TOL,
    },
    seasonFixturesPerTeam: SEASON_FIXTURES_PER_TEAM,
  },
  tables: GRAIN_TABLES,
  shape: {
    preRegistered: '⭐ #246, frozen BEFORE the battery: FASTER ARRIVAL ⇒ MORE PUNISHED (the top '
      + 'band\'s punishment rate exceeds the bottom band\'s), for EVERY candidate. An inversion is '
      + 'PUBLISHED and routed to diagnosis, NEVER corrected into the table.',
    byCandidate: SHAPE,
    takeRateTopMinusBottom: TAKE_SHAPE,
  },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  uncoveredConjuncts,
  nonClaims: [
    'NOTHING SHIPS: zero src/** bytes (xSrcUntouched compares the WORKTREE against HEAD, #273.3); '
      + 'the production fingerprint re-derives unchanged.',
    'THE TABLE IS WIRED INTO NO PLAYER (#247). It is instrument-side truth: the yardstick L3-T1 '
      + 'scores learned books against, and the sizing source L3-T0/T1 take their run length from.',
    'NO PASS/FAIL ON ANY MEASURED RATE. The #246 shape flags are mechanical CI readings.',
    'THE RATES ARE CONDITIONAL, NOT CAUSAL: arrival bands are not randomly assigned, and the state '
      + 'that put a body in a band is part of the price. No counterfactual is claimed.',
    'THE WITHHELD CHALLENGE IS A TICK DENSITY, NOT AN EVENT RATE (CB-C0 §DEV 2, inherited).',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). The label PICK is a RECOMMENDATION '
      + 'with its arithmetic; the COMMANDER ratifies it.',
  ],
  perClusterCells: CLUSTERS,
});

let body = buildBody();
const firstDigest = sha(canonical(body));
const w1 = writeArtifact(body, OUT_PATH);
const deepKeys = (x: unknown, out: Set<string> = new Set()): Set<string> => {
  if (Array.isArray(x)) { for (const y of x) deepKeys(y, out); return out; }
  if (x !== null && typeof x === 'object') {
    for (const [k, v] of Object.entries(x as Record<string, unknown>)) { out.add(k); deepKeys(v, out); }
  }
  return out;
};
hashInput = {
  crossOutIdentical: w1.crossOutIdentical,
  rederivesFromDisk: w1.reread === w1.digest && w1.digest === firstDigest,
  forbidden: FORBIDDEN_BODY_KEYS.filter((k) => deepKeys(body).has(k)),
};
(REGISTRY.find((r) => r.name === 'gHashEnvelope') as unknown as GateSpec<HashInput>).input = hashInput;
({ gates, mutants } = runRegistry());
(REGISTRY.find((r) => r.name === 'gMutants') as unknown as GateSpec<MutInput>).input = {
  uncovered: uncoveredConjuncts,
  dead: mutants.filter((m) => m.gate !== 'gMutants' && !m.live).length,
  total: mutants.filter((m) => m.gate !== 'gMutants').length,
};
({ gates, mutants } = runRegistry());
body = { ...buildBody(), gates, mutants };
const final = writeArtifact(body, OUT_PATH);

const keySetOk = canonical(Object.keys(gates).sort()) === canonical([...FROZEN_GATE_NAMES].sort());
if (!keySetOk) {
  banner(`L3-C0 FATAL: the gate key set is not the FROZEN list (#250.3(i)) — ${Object.keys(gates).sort().join(',')}`);
  process.exit(1);
}
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner(`lunges ${tot.tabulated} (${round(tot.tabulated / teamMatches, 3)}/team/match) · misses ${tot.cellMisses} · geometric ${tot.chiZero}`);
banner(`mutants ${mutants.filter((m) => m.live).length}/${mutants.length} live · re-derives ${final.reread === final.digest} · crossOut ${final.crossOutIdentical}`);
banner(red.length === 0
  ? `GATES GREEN (${Object.keys(gates).length}) · resultSha256 ${final.digest} · ${OUT_PATH}`
  : `GATES *** RED ***: ${red.join(', ')} (${Object.keys(gates).length - red.length}/${Object.keys(gates).length}) · ${OUT_PATH}`);
process.exit(red.length === 0 ? 0 : 1);

