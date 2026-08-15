/**
 * L3-C0b — THE WINDOW DECOMPOSITION (docs/world-model/L3-C0B-WINDOW-DECOMPOSITION.md).
 *
 * Dispatched by ruling #278.2(i) (the EK-C0b diagnostic precedent) to decide the defence book's
 * FROZEN LABEL before L3-T0 exists. The L3-C0 draft picked `sepGainedOwnRecovery` (+10.75 pp at
 * g3) — but its window IS the recovery interval, a deterministic function of the indexed band
 * (0.655 → 0.987 s). This probe decomposes that confound on a FRESH seed block:
 *
 *   1 COMMON-WINDOW RUNGS — the SAME carrier-anchored separation label at two windows that are
 *     the SAME NUMBER OF SECONDS FOR EVERY BAND: W_short (the shortest band's own recovery, READ
 *     from L3-C0's committed artifact — the law's own output at b0) and W_long (1.0 s, the
 *     charter's rung, which exceeds EVERY band's own mean recovery). If a monotone band gradient
 *     survives a COMMON window, the punishment is WORLD-TAUGHT; if it vanishes or inverts, the
 *     picked label was measuring its own clock.
 *   2 THE TWO-WINDOW CONTRAST — per band, the label at the own-recovery window against the same
 *     label at each common window, on the SAME miss population, PAIRED event by event.
 *   3 P(won | band) UNDER THE VETO FRAME — the decline-only veto (the EK-T0 integer
 *     cross-multiplication idiom) consumes an ORDERING of ratios, not an absolute gap. Scored:
 *     resolvability at g3, the fill arithmetic of its event stream (every lunge is an event),
 *     the ordering's stability across seed blocks, and ⭐ what the VETO ITSELF would do — the
 *     exact EK-T0 predicate replayed on per-team-per-season books built from this battery.
 *
 * ⭐ THE CANDIDATE SET IS CLOSED (#278.2(i)(d)): common-window separation · P(won) · the original
 * pick. NOTHING new after sight.
 *
 * ⭐ NOTHING IS RE-TYPED. Every engine constant is EXTRACTED from `src/**` at run time; χ and the
 * recovery interval are RE-DERIVED here (never imported from `carryBeat.ts`) and gate-checked
 * against the ENGINE'S OWN ledger; the two common windows are READ from L3-C0's committed
 * artifact; the walker/detector/band machinery is L3-C0's, and the receipt gate proves it by
 * re-walking twelve of L3-C0's own committed seeds and reproducing its committed cells.
 *
 * ⭐ ENV — WHITELIST-OR-REFUSE (#261.2 / #262.2), including the ENGINE's own doors:
 *   accepted: L3C0B_N · L3C0B_SKIP_FP · L3C0B_OUT
 * Anything else `L3C0B_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override makes
 * the run a PREFLIGHT: routed onto the GUARD block, `gEnvClean` RED, a canonical repo path may
 * never be written.
 *
 * RUN:  npx tsx scripts/probes/l3-c0b-window-decomposition.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join as pathJoin, resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, MATCH_DURATION } from '../../src/sim/constants';
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
const ENV_WHITELIST = ['L3C0B_N', 'L3C0B_SKIP_FP', 'L3C0B_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'EDS_SCALE_PITCH', 'EDS_SCALE_SPEED', 'EDS_SCALE_BALL', 'EDS_SCALE_TIME', 'EDS_SCALE_STAMINA',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE',
] as const;
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('L3C0B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  banner(`L3-C0b FATAL: unrecognised env ${rogue.join(', ')} — whitelist-or-refuse (#261.2)`);
  process.exit(2);
}
const doorsSet = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (doorsSet.length > 0) {
  banner(`L3-C0b FATAL: the ENGINE's own doors are set (${doorsSet.join(', ')}) — refused (#262.2)`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.L3C0B_N);
const SKIP_FP = process.env.L3C0B_SKIP_FP === '1';
const OUT_ENV = process.env.L3C0B_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'L3C0B_N', set: N_ENV !== null },
  { name: 'L3C0B_SKIP_FP', set: SKIP_FP },
  { name: 'L3C0B_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const FULL_PATH = 'docs/world-model/data/l3-c0b-window-decomposition.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === CANONICAL_DIR_ABS || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/l3-c0b-preflight.json' : FULL_PATH);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner(`L3-C0b FATAL: a PREFLIGHT may not write a canonical repo path (${OUT_PATH}) — #262.2`);
  process.exit(2);
}
const t0Wall = Date.now();

/* ========================================================================== */
/* §1 SMALL TOOLS                                                              */
/* ========================================================================== */
const sha = (v: unknown): string => createHash('sha256').update(String(v)).digest('hex');
const canonical = (v: unknown): string => {
  const walkV = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walkV);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(o).sort()) out[k] = walkV(o[k]);
      return out;
    }
    return x;
  };
  return JSON.stringify(walkV(v));
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
const SELF_PATH = 'scripts/probes/l3-c0b-window-decomposition.ts';
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
const MISS_BRANCH_SRC = (() => {
  const i = TRY_TACKLES_SRC.indexOf('  } else {');
  return i < 0 ? '' : TRY_TACKLES_SRC.slice(i);
})();
const R_TACKLE = extractNum(TRY_TACKLES_SRC, /if \(d < ([\d.]+) && d < best\)/);
const MISS_COOLDOWN_S = extractNum(MISS_BRANCH_SRC, /tackler\.tackleCooldown = ([\d.]+);/);
const MISS_STUN_S = extractNum(MISS_BRANCH_SRC, /tackler\.stunTimer = ([\d.]+);/);
const WIN_COOLDOWN_S = extractNum(TRY_TACKLES_SRC, /tackler\.tackleCooldown = (0\.5);/);
const SLIDE_COOLDOWN_S = extractNum(MECH_SRC, /slider\.tackleCooldown = ([\d.]+);/);
const GRAB_COOLDOWN_S = extractNum(MECH_SRC, /grabber\.tackleCooldown = ([\d.]+);/);
const SMOTHER_COOLDOWN_S = extractNum(MECH_SRC, /gk\.tackleCooldown = (1\.2);/);
const GK_AERIAL_COOLDOWN_S = extractNum(MECH_SRC, /gk\.tackleCooldown = (0\.9);/);
const SMOTHER_STUN_S = extractNum(MECH_SRC, /gk\.stunTimer = ([\d.]+); \/\/ beaten/);
const SLIDE_WIN_STUN_S = extractNum(MECH_SRC, /slider\.stunTimer = ([\d.]+); \/\/ he won it/);
const SLIDE_MISS_STUN_S = extractNum(MECH_SRC, /slider\.stunTimer = ([\d.]+); \/\/ beaten and grounded/);
const TACKLE_COOLDOWN_WRITERS = [...MECH_SRC.matchAll(/\.tackleCooldown = /g)].length;
const ACCEL = extractNum(PLAYER_SRC, /^const ACCEL = ([\d.]+);/m);
const CB_TACKLE_RADIUS_SRC = extractNum(CB_SRC, /export const CB_TACKLE_RADIUS = ([\d.]+);/);
const TEAMS_PER_DIVISION = extractNum(LEAGUE_SRC, /^const TEAMS_PER_DIVISION = (\d+);/m);
const SEASON_FIXTURES_PER_TEAM = TEAMS_PER_DIVISION - 1;
const DISPLAY_MINUTES = extractNum(readFileSync('src/sim/Match.ts', 'utf8'),
  /Math\.floor\(\(this\.simTime \/ this\.duration\) \* (\d+)\)/);
const DISPLAY_S_PER_SIM_S = (DISPLAY_MINUTES * 60) / MATCH_DURATION;

/* ========================================================================== */
/* §3 THE BANDS — L3-C0's (CB-C0's own v* family), re-derived from §2          */
/* ========================================================================== */
const V_STAR = Math.sqrt(2 * ACCEL * R_TACKLE);
const BAND_CUTS = [0.25, 0.5, 0.75, 1].map((f) => f * V_STAR);
const BAND_LABELS = ['b0 walk', 'b1 jog', 'b2 run', 'b3 drive', 'b4 OVERCOMMITTED'] as const;
const NB = BAND_LABELS.length;
const bandOf = (v: number): number => {
  for (let i = 0; i < BAND_CUTS.length; i++) if (v < BAND_CUTS[i]) return i;
  return BAND_CUTS.length;
};
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
/** ⭐ THE VETO'S OWN GRAIN (#278.2(i)(c)): the book the decline-only veto would read. */
const VETO_GRAIN = 'g3';

/* ========================================================================== */
/* §4 ⭐⭐ THE COMMON WINDOWS — READ from L3-C0's COMMITTED artifact             */
/* ========================================================================== */
const L3C0_PATH = 'docs/world-model/data/l3-c0-lunge-outcome-census.json';
const L3C0_SIZING_PATH = 'docs/world-model/data/l3-c0-lunge-outcome-census-sizing.json';
const L3C0 = readJson(L3C0_PATH);
const L3C0_SIZING = readJson(L3C0_SIZING_PATH) as unknown as { msPerMatch: number };
interface L3c0G5Row {
  band: string; misses: number;
  recovery: { n: number; mean: number; p10: number; p90: number };
  separation: { sepT0Mean: number };
}
const L3C0_G5 = ((L3C0.tables as Record<string, unknown>).g5) as unknown as L3c0G5Row[];
const L3C0_BAND_MEAN_RECOVERY = L3C0_G5.map((r) => r.recovery.mean);
/**
 * ⭐ W_short — THE SHORTEST BAND'S OWN RECOVERY, i.e. the ENGINE'S OWN LAW evaluated over b0's
 * arrivals: L3-C0's committed b0 mean recovery interval. It is READ, never typed, and the
 * three-leg arithmetic that produces it is published beside it (brake + turn + close, evaluated
 * on b0's own committed quantities — the band's midpoint arrival and its committed mean
 * separation at t0; the residual IS the turn leg).
 */
const W_SHORT_S = L3C0_BAND_MEAN_RECOVERY[0];
/** ⭐ W_long — the charter's second rung (#278.2(i)(a)): 1.0 s, ABOVE every band's own recovery. */
const W_LONG_S = 1;
const COMMON_WINDOWS_S = [W_SHORT_S, W_LONG_S];
const NCW = COMMON_WINDOWS_S.length;
const COMMON_WINDOW_TICKS = COMMON_WINDOWS_S.map((w) => Math.max(1, Math.round(w / DT)));
/** the arithmetic, published: the legs of the law at b0's own committed state. */
const B0_MID_SPEED = BAND_CUTS[0] / 2;
const B0_SEP_T0 = L3C0_G5[0].separation.sepT0Mean;
const LEG_BRAKE_B0 = B0_MID_SPEED / ACCEL;
const LEG_CLOSE_B0 = Math.sqrt((2 * B0_SEP_T0) / ACCEL);
const LEG_TURN_RESIDUAL_B0 = W_SHORT_S - LEG_BRAKE_B0 - LEG_CLOSE_B0;
const IMPLIED_TURN_ANGLE_B0 = LEG_TURN_RESIDUAL_B0 * TURN_RATE;

/* ========================================================================== */
/* §5 THE SEED LEDGER (#163, booked = walked) — band 12,481,000–12,481,999     */
/* ========================================================================== */
const BAND_SEEDS: readonly [number, number] = [12_481_000, 12_481_999];
const GUARD_BASE = 12_481_050; // where EVERY preflight invocation is routed
const BATTERY_BASE = IS_PREFLIGHT ? GUARD_BASE + 20 : 12_481_200;
const DET_SEED = IS_PREFLIGHT ? GUARD_BASE + 45 : 12_481_998;
const WORLD_SEED = IS_PREFLIGHT ? GUARD_BASE + 46 : 12_481_999;
const SEED_ROOM = 700; // 12,481,200–12,481,899
/** ⭐ THE DECLARED RECEIPT RE-WALK — L3-C0's OWN committed battery head, ONE overlap statistic. */
const REPRO_BASE = 12_480_200;
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
  { name: 'L3-C0 lunge-outcome census (#277.2/#278.4)', range: [12_480_000, 12_480_999] },
];

const BOOT_B = 2000;
const STATS_BASE = 111_000;
const STATS_FLOOR = 111_000;
const PUBLISHED_BASES = [104_000, 105_000, 106_000, 107_000, 108_000, 109_000, 109_800,
  110_000, 110_200, 110_400, 110_600, 110_800];

/**
 * ⭐ THE N RULE (frozen) — sized EX ANTE off L3-C0's OWN COMMITTED MOMENTS. The quantity that must
 * resolve is a COMMON-WINDOW separation gradient at g3, whose per-cluster variance is the same
 * family as L3-C0's own g3 separation gradient. That gradient's committed 95 % CI half-width at
 * N = 158 is `hw0`; a bootstrap half-width scales as 1/sqrt(N), so
 *
 *     N* = min( max( ceil( N0 · (hw0 / TARGET_HW)² ), 60 ), floor(0.5 h / msPerMatch), 700 )
 *
 * with TARGET_HW = 3 pp — the tight end of the charter's ±3–4 pp resolvability requirement.
 */
const L3C0_G3_SEPOWN = (((L3C0.shape as Record<string, unknown>).byCandidate as Record<string,
  Record<string, { topMinusBottom: { ci95: [number, number] } }>>).g3).sepGainedOwnRecovery;
const L3C0_N = ((L3C0.run as Record<string, unknown>).nRule as { ran: number }).ran;
const HW0 = (L3C0_G3_SEPOWN.topMinusBottom.ci95[1] - L3C0_G3_SEPOWN.topMinusBottom.ci95[0]) / 2;
const TARGET_HW = 0.03;
const N_FLOOR = 60;
const N_CAP = SEED_ROOM;
const precisionTerm = Math.max(Math.ceil(L3C0_N * (HW0 / TARGET_HW) ** 2), N_FLOOR);
const wallTerm = Math.floor((0.5 * 3_600_000) / L3C0_SIZING.msPerMatch);
const N_STAR = Math.min(precisionTerm, wallTerm, N_CAP);
const N = N_ENV ?? N_STAR;

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE = '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];
const CB_WORLD_VERSION = 6;

/* ========================================================================== */
/* §6 THE WORLD (L3-C0's, unchanged)                                           */
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
const armedMatch = (seed: number): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(CB_WORLD_VERSION),
  });
  armA4World(m, null, CB_WORLD_VERSION);
  if (cbArmedVersion(m) !== CB_WORLD_VERSION) throw new Error('l3-c0b: the CB world failed to arm');
  return m;
};

/* ========================================================================== */
/* §7 ⭐⭐ THE LAWS, RE-DERIVED INDEPENDENTLY (never imported from carryBeat)    */
/* ========================================================================== */
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
function recoveryOf(
  px: number, py: number, vx: number, vy: number, accel: number,
  hx: number, hy: number, bx: number, by: number,
): number {
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
  return brake + (turnAngle / TURN_RATE) + Math.sqrt((2 * gd) / accel);
}
const LAW_TOL = Math.sqrt(2 * Number.EPSILON) / TURN_RATE;

/* ========================================================================== */
/* §8 THE WALK — L3-C0's detector, with the COMMON-WINDOW reads added          */
/* ========================================================================== */
type Side = 0 | 1;

interface BandCell {
  lunges: number; wins: number; misses: number; geomMiss: number;
  chiSum: number; speedSum: number;
  /** the recovery interval paid (context + the own-recovery window itself). */
  recN: number; recSum: number;
  /** the CARRIER-ANCHORED separation at t0. */
  sepT0N: number; sepT0Sum: number;
  /** THE ORIGINAL PICK — the label at HIS OWN recovery window. */
  ownN: number; ownSum: number; ownGained: number; ownCensored: number;
  /** ⭐ THE COMMON-WINDOW RUNGS — the same label at a window that is the same for every band. */
  cwN: number[]; cwSum: number[]; cwGained: number[]; cwCensored: number[];
  /** ⭐ THE PAIRED SUBSET — events resolved at EVERY window, so the contrast is exactly paired. */
  pairedN: number; pairedOwnGained: number; pairedCwGained: number[];
  pairedOwnSum: number; pairedCwSum: number[];
}
const emptyBandCell = (): BandCell => ({
  lunges: 0, wins: 0, misses: 0, geomMiss: 0, chiSum: 0, speedSum: 0,
  recN: 0, recSum: 0, sepT0N: 0, sepT0Sum: 0,
  ownN: 0, ownSum: 0, ownGained: 0, ownCensored: 0,
  cwN: new Array<number>(NCW).fill(0), cwSum: new Array<number>(NCW).fill(0),
  cwGained: new Array<number>(NCW).fill(0), cwCensored: new Array<number>(NCW).fill(0),
  pairedN: 0, pairedOwnGained: 0, pairedCwGained: new Array<number>(NCW).fill(0),
  pairedOwnSum: 0, pairedCwSum: new Array<number>(NCW).fill(0),
});

interface Cluster {
  seed: number; simSeconds: number; totalTicks: number;
  cells: BandCell[][];
  recPool: number[][];
  lungesDetected: number; winsDetected: number; missesDetected: number;
  whistledDuels: number; tabulated: number;
  ledgerArmed: number; ledgerRecoveries: number; ledgerGeomMisses: number;
  ledgerRecoverySeconds: number; recoverySecondsDetected: number;
  chiZeroDetected: number;
  maxLawDeviation: number; lawViolations: number; lawChecked: number;
  engineTackleDelta: number; slideWins: number;
  slideEvents: number; grabEvents: number; smotherEvents: number; gkAerialEvents: number;
  unclassifiedJumps: number; maxLungesInATick: number; outOfRadiusUnwhistled: number;
}

interface MissRec {
  side: Side; band: number; sep0: number;
  carrierGid: number; takerGid: number;
  dueOwn: number; dueCw: number[];
  sepOwn: number | null; sepCw: (number | null)[];
}

function walk(seed: number): Cluster {
  const m = armedMatch(seed);
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
    ledgerRecoverySeconds: 0, recoverySecondsDetected: 0, chiZeroDetected: 0,
    maxLawDeviation: 0, lawViolations: 0, lawChecked: 0,
    engineTackleDelta: 0, slideWins: 0,
    slideEvents: 0, grabEvents: 0, smotherEvents: 0, gkAerialEvents: 0,
    unclassifiedJumps: 0, maxLungesInATick: 0, outOfRadiusUnwhistled: 0,
  };

  const prevCd = new Float64Array(NP);
  for (let i = 0; i < NP; i++) prevCd[i] = P[i].tackleCooldown;
  const prevTackles: [number, number] = [m.teams[0].stats.tackles, m.teams[1].stats.tackles];
  let prevArmed = 0; let prevRec = 0; let prevGeom = 0; let prevRecSec = 0;
  let lastOwner: (typeof P)[number] | null = null;

  const records: MissRec[] = [];
  const openRecords: MissRec[] = [];

  while (!m.finished) {
    m.step(DT);
    c.totalTicks++;
    const tick = m.simTick;
    const ball = m.ball;
    const owner = ball.owner;
    const phase = m.phase;

    for (const s of [0, 1] as const) {
      const t = m.teams[s].stats.tackles;
      c.engineTackleDelta += t - prevTackles[s];
      prevTackles[s] = t;
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

    /* ---------- (a) THE DUEL DETECTOR (L3-C0's, re-keyed onto the engine ledger) ---------- */
    for (let i = 0; i < NP; i++) {
      const p = P[i];
      const cd = p.tackleCooldown;
      if (!(cd > prevCd[i] + 1e-12)) continue;
      const st = p.stunTimer;
      const isArmedMiss = dRec === 1 && Math.abs(cd - dRecSec) <= 1e-12;
      const isWin = cd === WIN_COOLDOWN_S;
      if (isWin || isArmedMiss) {
        c.lungesDetected++;
        const missed = !isWin;
        if (missed) c.missesDetected++; else c.winsDetected++;
        const carrier = (isWin ? lastOwner : owner) ?? lastOwner ?? owner;
        if (carrier === null || carrier === undefined) { c.unclassifiedJumps++; continue; }
        const whistled = phase !== 'playing' || p.sentOff;
        const dBall = hyp(p.pos.x - ball.pos.x, p.pos.y - ball.pos.y);
        if (!(dBall < R_TACKLE) && !whistled) c.outOfRadiusUnwhistled++;
        const speed = hyp(p.vel.x, p.vel.y);
        const band = bandOf(speed);
        const chi = chiOf(p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.accel,
          ball.pos.x, ball.pos.y, carrier.vel.x, carrier.vel.y);
        if (chi === 0) c.chiZeroDetected++;
        if (missed) c.recoverySecondsDetected += dRecSec;
        if (whistled) { c.whistledDuels++; prevCd[i] = cd; continue; }
        c.tabulated++;
        const cell = cells[p.side as Side][band];
        cell.lunges++;
        cell.chiSum += chi;
        cell.speedSum += speed;
        if (chi === 0) cell.geomMiss++;
        if (!missed) cell.wins++;
        else {
          cell.misses++;
          const paid = dRecSec;
          const rederived = recoveryOf(p.pos.x, p.pos.y, p.vel.x, p.vel.y, p.accel,
            p.heading.x, p.heading.y, ball.pos.x, ball.pos.y);
          const dev = Math.abs(paid - rederived);
          if (dev > c.maxLawDeviation) c.maxLawDeviation = dev;
          if (!(dev <= LAW_TOL)) c.lawViolations++;
          c.lawChecked++;
          cell.recN++; cell.recSum += paid;
          recPool[band].push(round(paid, 4));
          const sep0 = hyp(p.pos.x - carrier.pos.x, p.pos.y - carrier.pos.y);
          cell.sepT0N++; cell.sepT0Sum += sep0;
          const ownTicks = Math.max(1, Math.round(paid / DT));
          const rec: MissRec = {
            side: p.side as Side, band, sep0,
            carrierGid: carrier.gid, takerGid: p.gid,
            dueOwn: tick + ownTicks,
            dueCw: COMMON_WINDOW_TICKS.map((t) => tick + t),
            sepOwn: null, sepCw: new Array<number | null>(NCW).fill(null),
          };
          records.push(rec);
          openRecords.push(rec);
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

    /* ---------- (b) THE CARRIER-ANCHORED HORIZON READS (own + every COMMON rung) ---------- */
    for (let k = openRecords.length - 1; k >= 0; k--) {
      const q = openRecords[k];
      const sepNow = (): number => {
        const t = P[q.takerGid];
        const cr = P[q.carrierGid];
        return hyp(t.pos.x - cr.pos.x, t.pos.y - cr.pos.y);
      };
      if (q.sepOwn === null && tick >= q.dueOwn) q.sepOwn = sepNow();
      for (let w = 0; w < NCW; w++) {
        if (q.sepCw[w] === null && tick >= q.dueCw[w]) q.sepCw[w] = sepNow();
      }
      if (q.sepOwn !== null && q.sepCw.every((v) => v !== null)) openRecords.splice(k, 1);
    }

    lastOwner = owner;
    for (let i = 0; i < NP; i++) prevCd[i] = P[i].tackleCooldown;
  }
  c.simSeconds = m.simTime;

  /* ---------- (c) TABULATION — censoring is a DROP, never a zero ---------- */
  for (const r of records) {
    const cell = cells[r.side][r.band];
    if (r.sepOwn === null) cell.ownCensored++;
    else {
      const d = r.sepOwn - r.sep0;
      cell.ownN++; cell.ownSum += d;
      if (d > 0) cell.ownGained++;
    }
    for (let w = 0; w < NCW; w++) {
      const s = r.sepCw[w];
      if (s === null) cell.cwCensored[w]++;
      else {
        const d = s - r.sep0;
        cell.cwN[w]++; cell.cwSum[w] += d;
        if (d > 0) cell.cwGained[w]++;
      }
    }
    if (r.sepOwn !== null && r.sepCw.every((v) => v !== null)) {
      cell.pairedN++;
      const dOwn = r.sepOwn - r.sep0;
      cell.pairedOwnSum += dOwn;
      if (dOwn > 0) cell.pairedOwnGained++;
      for (let w = 0; w < NCW; w++) {
        const d = (r.sepCw[w] as number) - r.sep0;
        cell.pairedCwSum[w] += d;
        if (d > 0) cell.pairedCwGained[w]++;
      }
    }
  }
  return c;
}

/* ========================================================================== */
/* §9 THE BATTERY                                                              */
/* ========================================================================== */
banner(`L3-C0b · N=${N} (precision ${precisionTerm} · wall ${wallTerm} · cap ${N_CAP})`);
banner(`common windows: W_short ${round(W_SHORT_S, 6)} s (L3-C0's committed b0 mean recovery) · W_long ${W_LONG_S} s`);
const SEEDS = Array.from({ length: N }, (_, i) => BATTERY_BASE + i);
const CLUSTERS = SEEDS.map((s, i) => {
  if (i % 25 === 0) banner(`  … seed ${s} (${i}/${N}) [${((Date.now() - t0Wall) / 1000).toFixed(0)}s]`);
  return walk(s);
});
const detA = canonical(walk(DET_SEED));
const detB = canonical(walk(DET_SEED));
/* ⭐ THE DECLARED RECEIPT: L3-C0's own committed battery head, ONE overlap statistic. */
banner('  … gReproL3c0: re-walking twelve of L3-C0\'s OWN committed seeds (a receipt)');
const REPRO_ROWS = Array.from({ length: REPRO_N }, (_, i) => walk(REPRO_BASE + i));
const L3C0_CELLS = (L3C0.perClusterCells as { seed: number;
  cells: { misses: number; lunges: number; wins: number }[][] }[]);
const reproObservedMisses = sum(REPRO_ROWS.map((r) => sum([0, 1].flatMap((s) =>
  r.cells[s].map((cc) => cc.misses)))));
const reproCommittedMisses = sum(REPRO_ROWS.map((r) => {
  const row = L3C0_CELLS.find((x) => x.seed === r.seed);
  return row === undefined ? Number.NaN : sum([0, 1].flatMap((s) => row.cells[s].map((cc) => cc.misses)));
}));
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
function bandSumAll(bands: readonly number[], f: Pick): number {
  return sum(CLUSTERS.map((cl) => bandSum(cl, bands, f)));
}
interface Row { point: number; ci95: [number, number]; num: number; den: number }
function rateRow(bands: readonly number[], num: Pick, den: Pick): Row {
  const ratio = (idx: readonly number[]): number => {
    let n = 0; let d = 0;
    for (const i of idx) { n += bandSum(CLUSTERS[i], bands, num); d += bandSum(CLUSTERS[i], bands, den); }
    return d === 0 ? Number.NaN : n / d;
  };
  const base = CLUSTERS.map((_, i) => i);
  return {
    point: round(ratio(base), 6), ci95: ciOf(BOOT_ROWS.map(ratio)),
    num: bandSumAll(bands, num), den: bandSumAll(bands, den),
  };
}
function diffRow(bandsHi: readonly number[], bandsLo: readonly number[], num: Pick, den: Pick): {
  delta: number; ci95: [number, number]; verdict: string; halfWidth: number;
} {
  const ratio = (idx: readonly number[], bands: readonly number[]): number => {
    let n = 0; let d = 0;
    for (const i of idx) { n += bandSum(CLUSTERS[i], bands, num); d += bandSum(CLUSTERS[i], bands, den); }
    return d === 0 ? Number.NaN : n / d;
  };
  const base = CLUSTERS.map((_, i) => i);
  const delta = ratio(base, bandsHi) - ratio(base, bandsLo);
  const ci = ciOf(BOOT_ROWS.map((idx) => ratio(idx, bandsHi) - ratio(idx, bandsLo)));
  return {
    delta: round(delta, 6), ci95: ci,
    verdict: ci[0] > 0 ? 'RESOLVED-CONFIRM' : ci[1] < 0 ? 'RESOLVED-INVERT' : 'UNRESOLVED',
    halfWidth: round((ci[1] - ci[0]) / 2, 6),
  };
}

/* ---- ⭐ THE CLOSED CANDIDATE SET (#278.2(i)(d)) — nothing new after sight ---- */
interface Candidate {
  id: string; family: 'separation-common' | 'separation-own' | 'outcome';
  what: string; windowKind: 'COMMON' | 'PER-EVENT' | 'none';
  num: Pick; den: Pick;
}
const CANDIDATES: Candidate[] = [
  ...COMMON_WINDOWS_S.map((w, i) => ({
    id: `sepGainedCommon${i === 0 ? 'Short' : 'Long'}`,
    family: 'separation-common' as const,
    windowKind: 'COMMON' as const,
    what: `the carrier GAINED separation from him ${round(w, 4)} s after the miss — a window that is `
      + 'the SAME number of seconds for EVERY band (carrier-anchored t0, #266.2(i))',
    num: (c: Cluster, s: Side, b: number) => c.cells[s][b].cwGained[i],
    den: (c: Cluster, s: Side, b: number) => c.cells[s][b].cwN[i],
  })),
  { id: 'sepGainedOwnRecovery', family: 'separation-own', windowKind: 'PER-EVENT',
    what: 'THE ORIGINAL PICK — the same label over HIS OWN recovery interval (the window that IS '
      + 'a deterministic function of the indexed band)',
    num: (c, s, b) => c.cells[s][b].ownGained, den: (c, s, b) => c.cells[s][b].ownN },
  { id: 'lungeLost', family: 'outcome', windowKind: 'none',
    what: '⭐ P(won | band) UNDER THE VETO FRAME, written as its punishment complement: the lunge '
      + 'did NOT win the ball. Every lunge is an event; no window at all',
    num: (c, s, b) => c.cells[s][b].misses, den: (c, s, b) => c.cells[s][b].lunges },
];
/** the PAIRED forms of the two-window contrast (same events at every window). */
const PAIRED_CANDIDATES: Candidate[] = [
  ...COMMON_WINDOWS_S.map((w, i) => ({
    id: `pairedCommon${i === 0 ? 'Short' : 'Long'}`,
    family: 'separation-common' as const, windowKind: 'COMMON' as const,
    what: `the common ${round(w, 4)} s window, on the events resolved at EVERY window`,
    num: (c: Cluster, s: Side, b: number) => c.cells[s][b].pairedCwGained[i],
    den: (c: Cluster, s: Side, b: number) => c.cells[s][b].pairedN,
  })),
  { id: 'pairedOwnRecovery', family: 'separation-own', windowKind: 'PER-EVENT',
    what: 'the own-recovery window, on the events resolved at EVERY window',
    num: (c, s, b) => c.cells[s][b].pairedOwnGained, den: (c, s, b) => c.cells[s][b].pairedN },
];

const ALL_BANDS = [0, 1, 2, 3, 4];
const matches = CLUSTERS.length;
const teamMatches = matches * 2;

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
    min: s[0], median: round(quantileSorted(s, 0.5), 4), p90: round(quantileSorted(s, 0.9), 4),
    max: s[s.length - 1],
    zeroShare: round(per.filter((v) => v === 0).length / Math.max(1, per.length), 6),
    perSeasonAtMean: round(mu * SEASON_FIXTURES_PER_TEAM, 4),
  };
};

/* ---- the per-grain tables ---- */
const GRAIN_TABLES: Record<string, unknown> = {};
for (const [grain, groups] of Object.entries(GRAINS)) {
  GRAIN_TABLES[grain] = groups.map((bands, gi) => {
    const lunges = bandSumAll(bands, (c, s, b) => c.cells[s][b].lunges);
    const misses = bandSumAll(bands, (c, s, b) => c.cells[s][b].misses);
    const recN = bandSumAll(bands, (c, s, b) => c.cells[s][b].recN);
    return {
      band: GRAIN_LABELS[grain][gi], bands,
      window: [bands[0] === 0 ? 0 : round(BAND_CUTS[bands[0] - 1], 6),
        bands[bands.length - 1] === 4 ? null : round(BAND_CUTS[bands[bands.length - 1]], 6)],
      lunges,
      wins: bandSumAll(bands, (c, s, b) => c.cells[s][b].wins),
      misses,
      pWon: rateRow(bands, (c, s, b) => c.cells[s][b].wins, (c, s, b) => c.cells[s][b].lunges),
      meanArrivalSpeed: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].speedSum)
        / Math.max(1, lunges), 6),
      meanRecovery: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].recSum) / Math.max(1, recN), 6),
      sepT0Mean: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].sepT0Sum)
        / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].sepT0N)), 6),
      dSepMeans: {
        own: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].ownSum)
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].ownN)), 6),
        common: COMMON_WINDOWS_S.map((_, w) => round(
          bandSumAll(bands, (c, s, b) => c.cells[s][b].cwSum[w])
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].cwN[w])), 6)),
        pairedOwn: round(bandSumAll(bands, (c, s, b) => c.cells[s][b].pairedOwnSum)
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].pairedN)), 6),
        pairedCommon: COMMON_WINDOWS_S.map((_, w) => round(
          bandSumAll(bands, (c, s, b) => c.cells[s][b].pairedCwSum[w])
          / Math.max(1, bandSumAll(bands, (c, s, b) => c.cells[s][b].pairedN)), 6)),
      },
      censored: {
        own: bandSumAll(bands, (c, s, b) => c.cells[s][b].ownCensored),
        common: COMMON_WINDOWS_S.map((_, w) => bandSumAll(bands, (c, s, b) => c.cells[s][b].cwCensored[w])),
        pairedN: bandSumAll(bands, (c, s, b) => c.cells[s][b].pairedN),
      },
      lungesPerTeamMatch: momentsOf(bands, (c, s, b) => c.cells[s][b].lunges),
      missesPerTeamMatch: momentsOf(bands, (c, s, b) => c.cells[s][b].misses),
      candidates: Object.fromEntries([...CANDIDATES, ...PAIRED_CANDIDATES].map((cand) => [cand.id, {
        rate: rateRow(bands, cand.num, cand.den),
        eventsPerTeamMatch: momentsOf(bands, cand.den),
      }])),
    };
  });
}

/** ⭐ THE SHAPE READINGS — top band vs bottom band, paired by the shared resample matrix. */
const SHAPE = Object.fromEntries(Object.entries(GRAINS).map(([grain, groups]) => [grain,
  Object.fromEntries([...CANDIDATES, ...PAIRED_CANDIDATES].map((cand) => {
    const hi = groups[groups.length - 1];
    const lo = groups[0];
    const d = diffRow(hi, lo, cand.num, cand.den);
    const points = groups.map((bands) => {
      const n = bandSumAll(bands, cand.num);
      const dd = bandSumAll(bands, cand.den);
      return dd === 0 ? Number.NaN : n / dd;
    });
    return [cand.id, {
      topMinusBottom: d, points: points.map((v) => round(v, 6)),
      monotone: points.every((v, i) => i === 0 || !(v < points[i - 1])),
      monotoneDecreasing: points.every((v, i) => i === 0 || !(v > points[i - 1])),
    }];
  })),
]));

/** ⭐ THE TWO-WINDOW CONTRAST — per band, own-window minus common-window, on the PAIRED events. */
const CONTRAST = Object.fromEntries(Object.entries(GRAINS).map(([grain, groups]) => [grain,
  groups.map((bands, gi) => ({
    band: GRAIN_LABELS[grain][gi],
    own: rateRow(bands, (c, s, b) => c.cells[s][b].pairedOwnGained, (c, s, b) => c.cells[s][b].pairedN),
    common: COMMON_WINDOWS_S.map((_, w) => rateRow(bands,
      (c, s, b) => c.cells[s][b].pairedCwGained[w], (c, s, b) => c.cells[s][b].pairedN)),
    gapOwnMinusCommon: COMMON_WINDOWS_S.map((_, w) => {
      const ratio = (idx: readonly number[], which: 'own' | number): number => {
        let n = 0; let d = 0;
        for (const i of idx) {
          n += bandSum(CLUSTERS[i], bands, which === 'own'
            ? (c, s, b) => c.cells[s][b].pairedOwnGained
            : (c, s, b) => c.cells[s][b].pairedCwGained[which as number]);
          d += bandSum(CLUSTERS[i], bands, (c, s, b) => c.cells[s][b].pairedN);
        }
        return d === 0 ? Number.NaN : n / d;
      };
      const base = CLUSTERS.map((_, i) => i);
      const delta = ratio(base, 'own') - ratio(base, w);
      const ci = ciOf(BOOT_ROWS.map((idx) => ratio(idx, 'own') - ratio(idx, w)));
      return { delta: round(delta, 6), ci95: ci,
        verdict: ci[0] > 0 ? 'RESOLVED-CONFIRM' : ci[1] < 0 ? 'RESOLVED-INVERT' : 'UNRESOLVED' };
    }),
  })),
]));

/* ========================================================================== */
/* §11 ⭐⭐ THE VETO FRAME — the EK-T0 predicate, replayed on real books         */
/* ========================================================================== */
/**
 * THE EK-T0 DECLINE-ONLY VETO (M-EK.3 / M-L3.3), verbatim in form and ZERO-CONSTANT: with a book
 * of (events[b], punished[b]) over the veto's grain, the body DECLINES at band b iff
 *     events[b] > 0  AND  Σ_{b'≠b} events[b'] > 0
 *     AND  punished[b] · Σ_{b'≠b} events[b']  >  Σ_{b'≠b} punished[b'] · events[b]
 * — integer cross-multiplication, so no float and no epsilon enters.
 */
function declines(events: readonly number[], punished: readonly number[], b: number): boolean {
  const ownE = events[b];
  const ownP = punished[b];
  let otherE = 0;
  let otherP = 0;
  for (let i = 0; i < events.length; i++) {
    if (i === b) continue;
    otherE += events[i];
    otherP += punished[i];
  }
  if (!(ownE > 0)) return false;
  if (!(otherE > 0)) return false;
  return ownP * otherE > otherP * ownE;
}
/** the independent FLOAT re-derivation the sweep is checked against. */
function declinesFloat(events: readonly number[], punished: readonly number[], b: number): boolean {
  const ownE = events[b];
  let otherE = 0;
  let otherP = 0;
  for (let i = 0; i < events.length; i++) {
    if (i === b) continue;
    otherE += events[i];
    otherP += punished[i];
  }
  if (!(ownE > 0) || !(otherE > 0)) return false;
  return punished[b] / ownE > otherP / otherE;
}
/* the exhaustive small-book sweep (gVetoForm's own input) */
const VETO_SWEEP = (() => {
  let compared = 0;
  let mismatches = 0;
  let emptyDeclines = 0;
  let oneBandDeclines = 0;
  let tieDeclines = 0;
  let worstDeclines = 0;
  let bestDeclines = 0;
  let worstCases = 0;
  let bestCases = 0;
  for (let e0 = 0; e0 <= 4; e0++) for (let p0 = 0; p0 <= e0; p0++) {
    for (let e1 = 0; e1 <= 4; e1++) for (let p1 = 0; p1 <= e1; p1++) {
      for (let e2 = 0; e2 <= 4; e2++) for (let p2 = 0; p2 <= e2; p2++) {
        const ev = [e0, e1, e2];
        const pu = [p0, p1, p2];
        for (let b = 0; b < 3; b++) {
          const d = declines(ev, pu, b);
          if (d !== declinesFloat(ev, pu, b)) mismatches++;
          compared++;
          const tot = ev[0] + ev[1] + ev[2];
          if (tot === 0 && d) emptyDeclines++;
          if (ev.filter((v) => v > 0).length === 1 && d) oneBandDeclines++;
          const otherE = tot - ev[b];
          const otherP = pu[0] + pu[1] + pu[2] - pu[b];
          if (ev[b] > 0 && otherE > 0) {
            if (pu[b] * otherE === otherP * ev[b]) { if (d) tieDeclines++; }
            else if (pu[b] * otherE > otherP * ev[b]) { worstCases++; if (d) worstDeclines++; }
            else { bestCases++; if (d) bestDeclines++; }
          }
        }
      }
    }
  }
  return { compared, mismatches, emptyDeclines, oneBandDeclines, tieDeclines,
    worstDeclines, worstCases, bestDeclines, bestCases };
})();

/**
 * ⭐ THE BOOKS THE VETO WOULD ACTUALLY HOLD. A book is per-TEAM and SEASON-RESET (M-L3.2), and the
 * season is the League's own round-robin (traced: SEASON_FIXTURES_PER_TEAM). This replay builds one
 * book per (consecutive block of that many matches × side) — the EVENT VOLUME of a team-season,
 * declared as a volume proxy in §DEV (it is not a franchise identity).
 */
const VETO_GROUPS = GRAINS[VETO_GRAIN];
interface VetoLabel { id: string; events: Pick; punished: Pick }
const VETO_LABELS: VetoLabel[] = [
  { id: 'lungeLost', events: (c, s, b) => c.cells[s][b].lunges, punished: (c, s, b) => c.cells[s][b].misses },
  ...COMMON_WINDOWS_S.map((_, w) => ({
    id: `sepGainedCommon${w === 0 ? 'Short' : 'Long'}`,
    events: (c: Cluster, s: Side, b: number) => c.cells[s][b].cwN[w],
    punished: (c: Cluster, s: Side, b: number) => c.cells[s][b].cwGained[w],
  })),
  { id: 'sepGainedOwnRecovery',
    events: (c, s, b) => c.cells[s][b].ownN, punished: (c, s, b) => c.cells[s][b].ownGained },
];
const seasonBlocks = Math.floor(nClusters / SEASON_FIXTURES_PER_TEAM);
const VETO_REPLAY = VETO_LABELS.map((lab) => {
  /* the POPULATION truth: which grain groups are genuinely worse than their own pooled reference */
  const popEvents = VETO_GROUPS.map((bands) => bandSumAll(bands, lab.events));
  const popPunished = VETO_GROUPS.map((bands) => bandSumAll(bands, lab.punished));
  const popDeclines = VETO_GROUPS.map((_, gi) => declines(popEvents, popPunished, gi));
  const declineCounts = VETO_GROUPS.map(() => 0);
  const agreeCounts = VETO_GROUPS.map(() => 0);
  const speaksCounts = VETO_GROUPS.map(() => 0);
  const eventsPerBook: number[][] = VETO_GROUPS.map(() => []);
  let books = 0;
  for (let blk = 0; blk < seasonBlocks; blk++) {
    for (const s of [0, 1] as const) {
      const ev = VETO_GROUPS.map(() => 0);
      const pu = VETO_GROUPS.map(() => 0);
      for (let i = 0; i < SEASON_FIXTURES_PER_TEAM; i++) {
        const cl = CLUSTERS[blk * SEASON_FIXTURES_PER_TEAM + i];
        VETO_GROUPS.forEach((bands, gi) => {
          for (const b of bands) { ev[gi] += lab.events(cl, s, b); pu[gi] += lab.punished(cl, s, b); }
        });
      }
      books++;
      VETO_GROUPS.forEach((_, gi) => {
        eventsPerBook[gi].push(ev[gi]);
        if (ev[gi] > 0) speaksCounts[gi]++;
        const d = declines(ev, pu, gi);
        if (d) declineCounts[gi]++;
        if (d === popDeclines[gi]) agreeCounts[gi]++;
      });
    }
  }
  return {
    id: lab.id, books, seasonFixturesPerTeam: SEASON_FIXTURES_PER_TEAM,
    population: {
      events: popEvents, punished: popPunished,
      rate: popEvents.map((e, i) => round(e === 0 ? Number.NaN : popPunished[i] / e, 6)),
      declines: popDeclines,
    },
    perBand: VETO_GROUPS.map((_, gi) => ({
      band: GRAIN_LABELS[VETO_GRAIN][gi],
      bookSpeaksShare: round(speaksCounts[gi] / Math.max(1, books), 6),
      declineShare: round(declineCounts[gi] / Math.max(1, books), 6),
      agreesWithPopulationShare: round(agreeCounts[gi] / Math.max(1, books), 6),
      populationWouldDecline: popDeclines[gi],
      eventsPerBook: {
        mean: round(meanOf(eventsPerBook[gi]), 4),
        median: round(quantileSorted([...eventsPerBook[gi]].sort((a, b) => a - b), 0.5), 4),
        min: Math.min(...eventsPerBook[gi]), max: Math.max(...eventsPerBook[gi]),
        zeroShare: round(eventsPerBook[gi].filter((v) => v === 0).length / Math.max(1, books), 6),
      },
    })),
  };
});

/** ⭐ ORDERING STABILITY ACROSS SEED BLOCKS — the quarters of the battery, independently read. */
const BLOCK_COUNT = 4;
const STABILITY = [...CANDIDATES].map((cand) => {
  const blocks: { block: number; seeds: [number, number]; points: number[];
    argmax: number; argmin: number }[] = [];
  const per = Math.floor(nClusters / BLOCK_COUNT);
  for (let k = 0; k < BLOCK_COUNT; k++) {
    const lo = k * per;
    const hi = k === BLOCK_COUNT - 1 ? nClusters : (k + 1) * per;
    const slice = CLUSTERS.slice(lo, hi);
    const points = GRAINS[VETO_GRAIN].map((bands) => {
      let n = 0; let d = 0;
      for (const cl of slice) { n += bandSum(cl, bands, cand.num); d += bandSum(cl, bands, cand.den); }
      return d === 0 ? Number.NaN : round(n / d, 6);
    });
    const argmax = points.indexOf(Math.max(...points));
    const argmin = points.indexOf(Math.min(...points));
    blocks.push({ block: k, seeds: [slice[0].seed, slice[slice.length - 1].seed], points, argmax, argmin });
  }
  return {
    id: cand.id, blocks,
    argmaxStable: blocks.every((b) => b.argmax === blocks[0].argmax),
    argminStable: blocks.every((b) => b.argmin === blocks[0].argmin),
  };
});

/* ========================================================================== */
/* §12 THE GATE REGISTRY + THE MACHINE-DERIVED LIVENESS MAP (#268.3(a))        */
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
  lawChecked: sum(CLUSTERS.map((c) => c.lawChecked)),
  lawViolations: sum(CLUSTERS.map((c) => c.lawViolations)),
  maxLawDev: Math.max(...CLUSTERS.map((c) => c.maxLawDeviation)),
  engineTackles: sum(CLUSTERS.map((c) => c.engineTackleDelta)),
  slideWins: sum(CLUSTERS.map((c) => c.slideWins)),
  unclassified: sum(CLUSTERS.map((c) => c.unclassifiedJumps)),
  maxInTick: Math.max(...CLUSTERS.map((c) => c.maxLungesInATick)),
  outOfRadius: sum(CLUSTERS.map((c) => c.outOfRadiusUnwhistled)),
  cellLunges: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].lunges),
  cellWins: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].wins),
  cellMisses: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].misses),
  simSeconds: sum(CLUSTERS.map((c) => c.simSeconds)),
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
  fn: (i) => ({ worktreeMatchesHead: i.diff === '', noUntrackedSrcFile: i.status === '' }),
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

/* ---- gLawsRederived ---- */
registerGate<Record<string, number>>({
  name: 'gLawsRederived',
  fn: (i) => ({
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

/* ---- ⭐⭐ gWindowsDerived — the two COMMON windows and the arithmetic behind them ---- */
registerGate<{
  wShort: number; wLong: number; committedB0: number; committedMeans: number[];
  p10: number; p90: number; legSum: number; ticks: number[];
}>({
  name: 'gWindowsDerived',
  fn: (i) => ({
    shortRungIsTheCommittedB0Recovery: i.wShort === i.committedB0,
    shortRungSitsInsideB0sOwnDistribution: i.wShort > i.p10 && i.wShort < i.p90,
    theLawLegsAreBelowTheShortRung: i.legSum > 0 && i.legSum < i.wShort,
    longRungCoversEveryBandsOwnRecovery: i.committedMeans.every((m) => i.wLong > m),
    theTwoRungsAreDistinctAndCommon: i.wShort < i.wLong && i.ticks.length === 2
      && i.ticks.every((t) => t >= 1) && i.ticks[0] < i.ticks[1],
  }),
  input: {
    wShort: W_SHORT_S, wLong: W_LONG_S, committedB0: L3C0_BAND_MEAN_RECOVERY[0],
    committedMeans: L3C0_BAND_MEAN_RECOVERY, p10: L3C0_G5[0].recovery.p10, p90: L3C0_G5[0].recovery.p90,
    legSum: LEG_BRAKE_B0 + LEG_CLOSE_B0, ticks: COMMON_WINDOW_TICKS,
  },
  mutants: [
    { conjunct: 'shortRungIsTheCommittedB0Recovery', name: 'the short rung was typed rather than read', mutate: (i) => ({ ...i, wShort: 0.65 }) },
    { conjunct: 'shortRungSitsInsideB0sOwnDistribution', name: 'the short rung sits outside b0\'s own spread', mutate: (i) => ({ ...i, p10: i.wShort + 0.01 }) },
    { conjunct: 'theLawLegsAreBelowTheShortRung', name: 'the brake+close legs already exceed the rung', mutate: (i) => ({ ...i, legSum: i.wShort + 1 }) },
    { conjunct: 'longRungCoversEveryBandsOwnRecovery', name: 'a band recovers slower than the long rung', mutate: (i) => ({ ...i, committedMeans: [...i.committedMeans, i.wLong + 1] }) },
    { conjunct: 'theTwoRungsAreDistinctAndCommon', name: 'the rungs collapsed onto one window', mutate: (i) => ({ ...i, ticks: [i.ticks[0], i.ticks[0]] }) },
  ],
});

/* ---- ⭐ gPaired — the two-window contrast is on the SAME events ---- */
const pairedTotals = {
  misses: tot.cellMisses,
  ownResolved: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].ownN),
  ownCensored: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].ownCensored),
  cwResolved: COMMON_WINDOWS_S.map((_, w) => bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].cwN[w])),
  cwCensored: COMMON_WINDOWS_S.map((_, w) => bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].cwCensored[w])),
  paired: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].pairedN),
  /* ⭐ the #266.3(b) conjunct-grain rule: these two conjuncts get their OWN input fields, so a
   * mutant can flip exactly one of them and leave every sibling standing. */
  censorLadder: COMMON_WINDOWS_S.map((_, w) => bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].cwCensored[w])),
  censoredOfThePopulation: bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].misses)
    - bandSumAll(ALL_BANDS, (c, s, b) => c.cells[s][b].pairedN),
};
registerGate<typeof pairedTotals>({
  name: 'gPaired',
  fn: (i) => ({
    everyMissIsResolvedOrCensoredAtTheOwnWindow: i.ownResolved + i.ownCensored === i.misses,
    everyMissIsResolvedOrCensoredAtEveryCommonWindow: i.cwResolved
      .every((v, w) => v + i.cwCensored[w] === i.misses),
    longerCommonWindowsCensorAtLeastAsMuch: i.censorLadder
      .every((v, w) => w === 0 || v >= i.censorLadder[w - 1]),
    thePairedSubsetIsNonEmptyAndNoLargerThanEveryWindow: i.paired > 0
      && i.paired <= i.ownResolved && i.cwResolved.every((v) => i.paired <= v),
    censoringIsSmallEnoughToBeAnAside: i.misses > 0
      && i.censoredOfThePopulation * 100 < i.misses,
  }),
  input: pairedTotals,
  mutants: [
    { conjunct: 'everyMissIsResolvedOrCensoredAtTheOwnWindow', name: 'a miss left the own-window accounting', mutate: (i) => ({ ...i, ownCensored: i.ownCensored + 1 }) },
    { conjunct: 'everyMissIsResolvedOrCensoredAtEveryCommonWindow', name: 'a miss left a common-window accounting', mutate: (i) => ({ ...i, cwResolved: [i.cwResolved[0] + 1, ...i.cwResolved.slice(1)] }) },
    { conjunct: 'longerCommonWindowsCensorAtLeastAsMuch', name: 'the longer rung censored fewer events', mutate: (i) => ({ ...i, censorLadder: [i.censorLadder[0] + 1000, ...i.censorLadder.slice(1)] }) },
    { conjunct: 'thePairedSubsetIsNonEmptyAndNoLargerThanEveryWindow', name: 'the paired subset exceeds a window\'s own resolved set', mutate: (i) => ({ ...i, paired: i.ownResolved + 1 }) },
    { conjunct: 'censoringIsSmallEnoughToBeAnAside', name: 'censoring ate more than a hundredth of the population', mutate: (i) => ({ ...i, censoredOfThePopulation: i.misses }) },
  ],
});

/* ---- ⭐⭐ gReproL3c0 — THE DECLARED RECEIPT (ONE overlap statistic, no new conclusion) ---- */
registerGate<{ observed: number; committed: number; base: number; n: number; seedsFound: number }>({
  name: 'gReproL3c0',
  fn: (i) => ({
    theOverlapStatisticReproduces: i.observed === i.committed && Number.isFinite(i.committed),
    theStatisticIsNonEmpty: i.observed > 0,
    everyReceiptSeedIsInTheCommittedArtifact: i.seedsFound === i.n,
    theReceiptBlockIsL3c0sOwnBattery: i.base === 12_480_200,
  }),
  input: {
    observed: reproObservedMisses, committed: reproCommittedMisses,
    base: REPRO_BASE, n: REPRO_N,
    seedsFound: REPRO_ROWS.filter((r) => L3C0_CELLS.some((x) => x.seed === r.seed)).length,
  },
  mutants: [
    { conjunct: 'theOverlapStatisticReproduces', name: 'the walker no longer reproduces L3-C0', mutate: (i) => ({ ...i, observed: i.observed + 1 }) },
    { conjunct: 'theStatisticIsNonEmpty', name: 'the receipt statistic is empty', mutate: (i) => ({ ...i, observed: 0, committed: 0 }) },
    { conjunct: 'everyReceiptSeedIsInTheCommittedArtifact', name: 'a receipt seed is not in L3-C0\'s artifact', mutate: (i) => ({ ...i, seedsFound: i.seedsFound - 1 }) },
    { conjunct: 'theReceiptBlockIsL3c0sOwnBattery', name: 'the receipt walked fresh seeds', mutate: (i) => ({ ...i, base: i.base + 1 }) },
  ],
});

/* ---- ⭐⭐ gVetoForm — the EK-T0 predicate, exhaustively checked ---- */
registerGate<typeof VETO_SWEEP>({
  name: 'gVetoForm',
  fn: (i) => ({
    integerFormEqualsTheFloatReDerivation: i.mismatches === 0,
    theSweepIsNonTrivial: i.compared >= 1000,
    emptyAndOneBandBooksDeclineNothing: i.emptyDeclines === 0 && i.oneBandDeclines === 0,
    aTieNeverDeclines: i.tieDeclines === 0,
    theWorseBandAlwaysDeclinesAndTheBetterNever: i.worstCases > 0 && i.bestCases > 0
      && i.worstDeclines === i.worstCases && i.bestDeclines === 0,
  }),
  input: VETO_SWEEP,
  mutants: [
    { conjunct: 'integerFormEqualsTheFloatReDerivation', name: 'the integer form disagrees with floats', mutate: (i) => ({ ...i, mismatches: 1 }) },
    { conjunct: 'theSweepIsNonTrivial', name: 'the sweep is degenerate', mutate: (i) => ({ ...i, compared: 1 }) },
    { conjunct: 'emptyAndOneBandBooksDeclineNothing', name: 'an empty book declined', mutate: (i) => ({ ...i, emptyDeclines: 1 }) },
    { conjunct: 'aTieNeverDeclines', name: 'a tie declined', mutate: (i) => ({ ...i, tieDeclines: 1 }) },
    { conjunct: 'theWorseBandAlwaysDeclinesAndTheBetterNever', name: 'the better band declined', mutate: (i) => ({ ...i, bestDeclines: 1 }) },
  ],
});

/* ---- gNonVac (at the CLAIM grain, #263.2) ---- */
const claimGrainDenominators: number[] = [];
for (const groups of Object.values(GRAINS)) {
  for (const bands of groups) {
    claimGrainDenominators.push(bandSumAll(bands, (c, s, b) => c.cells[s][b].lunges));
    for (const cand of [...CANDIDATES, ...PAIRED_CANDIDATES]) {
      claimGrainDenominators.push(bandSumAll(bands, cand.den));
    }
  }
}
registerGate<{ dens: number[]; misses: number; wins: number; clusters: number; books: number }>({
  name: 'gNonVac',
  fn: (i) => ({
    everyPublishedRateHasEvents: i.dens.every((d) => d > 0),
    missesExist: i.misses > 0,
    winsExist: i.wins > 0,
    moreThanOneCluster: i.clusters > 1,
    theVetoReplayHasBooks: i.books > 1,
  }),
  input: {
    dens: claimGrainDenominators, misses: tot.cellMisses, wins: tot.cellWins,
    clusters: nClusters, books: VETO_REPLAY[0]?.books ?? 0,
  },
  mutants: [
    { conjunct: 'everyPublishedRateHasEvents', name: 'a published rate has an empty denominator', mutate: (i) => ({ ...i, dens: [...i.dens, 0] }) },
    { conjunct: 'missesExist', name: 'no miss was seen', mutate: (i) => ({ ...i, misses: 0 }) },
    { conjunct: 'winsExist', name: 'no lunge was ever won', mutate: (i) => ({ ...i, wins: 0 }) },
    { conjunct: 'moreThanOneCluster', name: 'a single cluster', mutate: (i) => ({ ...i, clusters: 1 }) },
    { conjunct: 'theVetoReplayHasBooks', name: 'the veto replay built no book', mutate: (i) => ({ ...i, books: 0 }) },
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
    { conjunct: 'noOverrideReason', name: 'an override reason exists', mutate: (i) => ({ ...i, reasons: ['L3C0B_N'] }) },
    { conjunct: 'noPreflightOnACanonicalPath', name: 'a preflight aimed at a canonical path', mutate: (i) => ({ ...i, aimedAtCanonical: true }) },
  ],
});

/* ---- gN ---- */
registerGate<{
  hw0: number; n0: number; target: number; targetInBand: number; precision: number; wall: number;
  cap: number; nStar: number; ran: number; overridden: boolean; committed: boolean;
  hwFromArtifact: boolean;
}>({
  name: 'gN',
  fn: (i) => ({
    nStarIsTheRuleOutput: i.nStar === Math.min(
      Math.max(Math.ceil(i.n0 * (i.hw0 / i.target) ** 2), N_FLOOR), i.wall, i.cap),
    ranAtNStar: i.ran === i.nStar && !i.overridden,
    termsFromTheCommittedArtifacts: i.committed && i.hwFromArtifact,
    theTargetHalfWidthIsInsideTheCharterBand: i.targetInBand >= 0.03 && i.targetInBand <= 0.04,
    precisionTermIsBounded: Number.isFinite(i.precision),
  }),
  input: {
    hw0: HW0, n0: L3C0_N, target: TARGET_HW, targetInBand: TARGET_HW,
    precision: precisionTerm, wall: wallTerm,
    cap: N_CAP, nStar: N_STAR, ran: N, overridden: N_ENV !== null,
    committed: existsSync(L3C0_PATH) && existsSync(L3C0_SIZING_PATH),
    hwFromArtifact: HW0 > 0 && Number.isFinite(HW0),
  },
  mutants: [
    { conjunct: 'nStarIsTheRuleOutput', name: 'N* is not the rule', mutate: (i) => ({ ...i, nStar: i.nStar + 1, ran: i.ran + 1 }) },
    { conjunct: 'ranAtNStar', name: 'the battery ran at another N', mutate: (i) => ({ ...i, ran: i.ran + 1 }) },
    { conjunct: 'termsFromTheCommittedArtifacts', name: 'a committed artifact is absent', mutate: (i) => ({ ...i, committed: false }) },
    { conjunct: 'theTargetHalfWidthIsInsideTheCharterBand', name: 'the target half-width left the charter band', mutate: (i) => ({ ...i, targetInBand: 0.1 }) },
    { conjunct: 'precisionTermIsBounded', name: 'the precision term is unbounded', mutate: (i) => ({ ...i, precision: Infinity }) },
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
  for (const groups of Object.values(GRAIN_TABLES) as { pWon: Row;
    candidates: Record<string, { rate: Row }> }[][]) {
    for (const row of groups) {
      vals.push(row.pWon.point);
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

/* ---- gHashEnvelope ---- */
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
  banner('L3-C0b FATAL (#268.3(a)): the MACHINE-DERIVED coverage map has conjuncts without a mutant —');
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
  'gBandsDerived', 'gDetect', 'gLawsRederived', 'gWindowsDerived', 'gPaired', 'gReproL3c0',
  'gVetoForm', 'gNonVac', 'gBoot', 'gSeed', 'gStats', 'gEnvClean', 'gN', 'gValuesUnreachable',
  'gHashEnvelope', 'gMutants'];

/* ========================================================================== */
/* §13 THE ARTIFACT                                                            */
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
  const crossPath = '/tmp/l3-c0b-cross-out.json';
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: { ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7,
      generatedAt: 'ANOTHER-INVOCATION' },
  }, null, 2)}\n`);
  const fileA = readJson(outPath);
  const fileB = readJson(crossPath);
  return {
    digest, reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
};

const buildBody = (): Record<string, unknown> => ({
  schema: 'l3-c0b-window-decomposition/v1',
  stage: 'L3-C0b — THE WINDOW DECOMPOSITION',
  contract: 'docs/world-model/CB-L3-DEFENCE-BOOK-CONTRACT.md §2 M-L3.1 (the label) / §3',
  ruling: '#278.2(i)',
  probeSha: SELF_SHA,
  world: {
    description: 'THE POLISHED ARMED WORLD — L3-C0\'s own arm (a4MatchFlags(6) + armA4World(m, '
      + 'null, 6), dose 1.0), cbArmedVersion === 6 asserted (#273).',
    version: CB_WORLD_VERSION, flags: worldFlags, matchDurationS: MATCH_DURATION,
  },
  clock: {
    law: '#270.2 / #272.3(ii): every count rate is on the 240 s MATCH CLOCK (convention A); the '
      + 'display mapping is printed beside it. Both terms EXTRACTED.',
    matchDurationS: MATCH_DURATION, displayMinutes: DISPLAY_MINUTES,
    displaySecondsPerSimSecond: round(DISPLAY_S_PER_SIM_S, 6),
    simSecondsPerMatch: round(tot.simSeconds / matches, 4),
  },
  bands: {
    index: 'THE LUNGER\'S OWN VELOCITY AT THE LUNGE DECISION (the self-percept; M-L3.1).',
    vStar: V_STAR, cuts: BAND_CUTS, labels: [...BAND_LABELS], grains: GRAINS,
    grainLabels: GRAIN_LABELS, vetoGrain: VETO_GRAIN,
  },
  windows: {
    doctrine: '⭐ A COMMON WINDOW IS THE SAME NUMBER OF SECONDS FOR EVERY BAND. The own-recovery '
      + 'window is NOT: it is a deterministic function of the indexed band, which is the confound '
      + '#278.2(i) ruled HIGH.',
    commonS: COMMON_WINDOWS_S.map((w) => round(w, 6)),
    commonTicks: COMMON_WINDOW_TICKS,
    shortRungTrace: {
      what: 'the SHORTEST band\'s own recovery — the engine\'s own recovery law averaged over b0\'s '
        + 'arrivals, READ from L3-C0\'s committed artifact (never typed).',
      source: L3C0_PATH, committedB0MeanRecoveryS: L3C0_BAND_MEAN_RECOVERY[0],
      b0P10: L3C0_G5[0].recovery.p10, b0P90: L3C0_G5[0].recovery.p90,
      arithmetic: {
        note: 'the three legs of the law at b0\'s own committed state: brake(v̄) + turn(θ) + '
          + 'close(d̄). The brake and close legs are computed here from traced constants; the '
          + 'residual IS the turn leg, and it is published rather than assumed.',
        bandMidpointSpeedMS: round(B0_MID_SPEED, 6),
        committedSepT0M: B0_SEP_T0,
        brakeLegS: round(LEG_BRAKE_B0, 6),
        closeLegS: round(LEG_CLOSE_B0, 6),
        residualTurnLegS: round(LEG_TURN_RESIDUAL_B0, 6),
        impliedTurnAngleRad: round(IMPLIED_TURN_ANGLE_B0, 6),
        turnRate: TURN_RATE, accel: ACCEL,
      },
    },
    longRungTrace: {
      what: 'the charter\'s second rung (#278.2(i)(a)): 1.0 s — a round common window that EXCEEDS '
        + 'every band\'s own mean recovery, so at this rung every band has finished its recovery.',
      valueS: W_LONG_S, committedBandMeanRecoveriesS: L3C0_BAND_MEAN_RECOVERY,
    },
    ownRecovery: 'PER-EVENT: the recovery interval the engine\'s own law made THIS lunger pay.',
  },
  candidates: [...CANDIDATES, ...PAIRED_CANDIDATES].map((c) => ({
    id: c.id, family: c.family, windowKind: c.windowKind, what: c.what })),
  candidateSetIsClosed: '⭐ #278.2(i)(d): the set is common-window separation · P(won) · the '
    + 'original pick. NOTHING was added after sight.',
  run: {
    matches, teamMatches,
    seeds: { band: BAND_SEEDS, battery: [BATTERY_BASE, BATTERY_BASE + N - 1], det: DET_SEED,
      world: WORLD_SEED, receiptRewalk: [REPRO_BASE, REPRO_BASE + REPRO_N - 1], consumed: CONSUMED },
    nRule: {
      rule: 'N* = min( max( ceil( N0 · (hw0 / 0.03)² ), 60 ), floor(0.5 h / msPerMatch), 700 )',
      n0: L3C0_N, hw0: round(HW0, 6), targetHalfWidth: TARGET_HW,
      msPerMatch: L3C0_SIZING.msPerMatch,
      precisionTerm, wallTerm, nStar: N_STAR, ran: N, overridden: N_ENV !== null,
      sizingSources: [L3C0_PATH, L3C0_SIZING_PATH],
    },
    stats: { base: STATS_BASE, step: 200, resamples: BOOT_B, clusters: nClusters },
    estimator: 'cluster bootstrap by match seed (#20), 2,000 resamples, percentile 95 % CI, '
      + 'ratio-of-sums, ONE SHARED resample matrix so every difference is paired by construction.',
    totals: {
      lunges: tot.lunges, wins: tot.wins, misses: tot.misses, tabulated: tot.tabulated,
      whistledExcluded: tot.whistled, geometricMisses: tot.chiZero,
      lungesPerTeamMatch: round(tot.tabulated / teamMatches, 4),
      missesPerTeamMatch: round(tot.cellMisses / teamMatches, 4),
      maxLawDeviation: tot.maxLawDev, lawTolerance: LAW_TOL,
      pairedEvents: pairedTotals.paired, ownCensored: pairedTotals.ownCensored,
      commonCensored: pairedTotals.cwCensored,
    },
    seasonFixturesPerTeam: SEASON_FIXTURES_PER_TEAM,
    receipt: {
      what: '⭐ A DECLARED RECEIPT RE-WALK of L3-C0\'s own battery head — ONE overlap statistic '
        + '(the summed misses over its per-cluster cells). NO new conclusion is drawn from it.',
      block: [REPRO_BASE, REPRO_BASE + REPRO_N - 1],
      observedMisses: reproObservedMisses, committedMisses: reproCommittedMisses,
    },
  },
  tables: GRAIN_TABLES,
  shape: SHAPE,
  twoWindowContrast: CONTRAST,
  vetoFrame: {
    predicate: 'EK-T0 / M-L3.3, verbatim: decline iff events[b] > 0 AND Σ_{b\'≠b} events[b\'] > 0 '
      + 'AND punished[b]·Σ_{b\'≠b} events[b\'] > Σ_{b\'≠b} punished[b\']·events[b] — integer '
      + 'cross-multiplication, zero constants but the structural 0.',
    sweep: VETO_SWEEP,
    replay: VETO_REPLAY,
    replayNote: 'one book per (consecutive block of the League\'s own fixture count × side): the '
      + 'EVENT VOLUME of a team-season, declared as a volume proxy (not a franchise identity).',
  },
  stability: { blocks: BLOCK_COUNT, byCandidate: STABILITY },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  uncoveredConjuncts,
  nonClaims: [
    'NOTHING SHIPS: zero src/** bytes (xSrcUntouched compares the WORKTREE against HEAD, #273.3); '
      + 'the production fingerprint re-derives unchanged.',
    'THE TABLES ARE WIRED INTO NO PLAYER (#247). The veto replay is an OFFLINE arithmetic on stored '
      + 'counters; no belief, no flag and no seam exists in src.',
    'NO PASS/FAIL ON ANY MEASURED RATE. Every verdict is a mechanical CI reading.',
    'THE RATES ARE CONDITIONAL, NOT CAUSAL (L3-C0 non-claim 4, inherited): arrival bands are not '
      + 'randomly assigned and no counterfactual is claimed.',
    '⭐ A MISS IS NOT PER SE A BEATING. A P(won) book teaches "don\'t waste lunges"; a separation '
      + 'book teaches "don\'t get taken away from". Both are restraint; which lesson the book '
      + 'carries is the COMMANDER\'s pick (#203).',
    'THE VETO REPLAY IS AN ARITHMETIC, NOT A WORLD EFFECT: it says what the frozen predicate would '
      + 'DO with these books, never what the world would then look like (that is L3-T2).',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). The recommendation is a '
      + 'recommendation with its arithmetic; the COMMANDER ratifies.',
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
  banner(`L3-C0b FATAL: the gate key set is not the FROZEN list (#250.3(i)) — ${Object.keys(gates).sort().join(',')}`);
  process.exit(1);
}
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner(`lunges ${tot.tabulated} (${round(tot.tabulated / teamMatches, 3)}/team/match) · misses ${tot.cellMisses} · paired ${pairedTotals.paired}`);
banner(`mutants ${mutants.filter((m) => m.live).length}/${mutants.length} live · re-derives ${final.reread === final.digest} · crossOut ${final.crossOutIdentical}`);
banner(red.length === 0
  ? `GATES GREEN (${Object.keys(gates).length}) · resultSha256 ${final.digest} · ${OUT_PATH}`
  : `GATES *** RED ***: ${red.join(', ')} (${Object.keys(gates).length - red.length}/${Object.keys(gates).length}) · ${OUT_PATH}`);
process.exit(red.length === 0 ? 0 : 1);
