/**
 * CB C0 — THE DISPOSSESSION-GEOMETRY CENSUS
 * (docs/world-model/CB-C0-DISPOSSESSION-CENSUS.md).
 *
 * Authority: the CARRY-BEAT CONTRACT `docs/world-model/CB-CARRY-BEAT-CONTRACT.md` §3 CB-C0
 * (and §2 M-CB.1, the layer-1 mechanism this table is the baseline for), dispatched by ruling
 * #265.4. It photographs TODAY's duels in the PRODUCTION world: how takings actually happen by
 * the taker's APPROACH GEOMETRY (speed × angle × motion state), whether OVERCOMMITMENT exists
 * today and whether it is EVER punished, and the baseline linkage to the churn (possession-spell
 * length around duel events). ⭐ The #246 reality-shape check is PRE-REGISTERED below.
 *
 * ⭐⭐ INSTRUMENT-ONLY ROUND. ZERO `src/**` bytes (X-SRC-UNTOUCHED is a HARD gate). Everything is
 * a tick-walk over PUBLIC match state plus a READ of the engine's own source for its constants.
 * Nothing measured here is wired into any player (#247).
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 / #262.2):
 *   accepted: CBC0_MODE (smoke|full, REQUIRED) · CBC0_N · CBC0_SKIP_FP · CBC0_OUT · CBC0_RESUME.
 *   ANY other `CBC0_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   CBC0_N / CBC0_SKIP_FP / CBC0_OUT are OVERRIDES: each makes the run a PREFLIGHT, which routes
 *   onto the guard block, may never write a canonical repo path, and REDS G-CLEAN-INVOCATION.
 *   ⭐ CBC0_RESUME is NOT an override (#260.2(i) is honoured the other way round: it cannot change
 *   a single measured number because PASS B never resumes — X-DET is the checkpoint's integrity
 *   proof — and it is recorded in the UNHASHED envelope).
 *
 * RUN:  CBC0_MODE=smoke npx tsx scripts/probes/cb-c0-dispossession-census.ts
 *       CBC0_MODE=full  npx tsx scripts/probes/cb-c0-dispossession-census.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal.
 */

import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { appendFileSync, existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve as pathResolve, sep as pathSep } from 'node:path';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import { DT, HALF_L, HALF_W, MATCH_DURATION, TACKLE_LUNGE_COST } from '../../src/sim/constants';
import { TURN_RATE } from '../../src/sim/Player';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';
import { mtArmedVersion, MT_WORLD_FLAGS } from '../../src/game/a4World';

/* ========================================================================== */
/* §0 ⭐ ENV — WHITELIST-OR-REFUSE incl. THE ENGINE DOORS                       */
/* ========================================================================== */
const ENV_WHITELIST = ['CBC0_MODE', 'CBC0_N', 'CBC0_SKIP_FP', 'CBC0_OUT', 'CBC0_RESUME'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_TRACE_CHOICE', 'EMERGENT_POS', 'PITCH_SCALE',
  'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('CBC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  console.error('CB-C0 FATAL — refused env surface. '
    + `rogue CBC0_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')}; the engine doors must be UNSET.`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.CBC0_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  console.error(`CB-C0 FATAL — CBC0_MODE must be one of ${MODES.join(' | ')} (see the header).`);
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v !== undefined
  ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.CBC0_N);
const SKIP_FP = process.env.CBC0_SKIP_FP === '1';
const OUT_ENV = process.env.CBC0_OUT;
const RESUME = process.env.CBC0_RESUME === '1';
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'CBC0_N', set: N_ENV !== null },
  { name: 'CBC0_SKIP_FP', set: SKIP_FP },
  { name: 'CBC0_OUT', set: OUT_ENV !== undefined },
];
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CLEAN_INVOCATION = !IS_PREFLIGHT;
const OUT_BY_MODE: Record<Mode, string> = {
  smoke: 'docs/world-model/data/cb-c0-dispossession-census-smoke.json',
  full: 'docs/world-model/data/cb-c0-dispossession-census.json',
};
const SMOKE_PATH = OUT_BY_MODE.smoke;
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const r = pathResolve(p);
  return r === CANONICAL_DIR_ABS || r.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/cb-c0-preflight.json' : OUT_BY_MODE[MODE]);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error('CB-C0 FATAL — a PREFLIGHT invocation may not write a canonical repo path '
    + `(the canonical-write guard, #260.2(i)). Preflight because: ${PREFLIGHT_REASONS.join(' + ')}.`);
  process.exit(2);
}
const CHECKPOINT_PATH = `/tmp/cb-c0-checkpoint-${MODE}.jsonl`;
const wall0 = Date.now();

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
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN : sum(xs) / xs.length);
const readJson = (p: string): Record<string, unknown> =>
  JSON.parse(readFileSync(p, 'utf8')) as Record<string, unknown>;

/* ========================================================================== */
/* §2 ⭐⭐ THE TRACED ENGINE CONSTANTS — read out of the ENGINE'S OWN SOURCE     */
/*    (#200: no invented literal beyond 0; every number below either arrives   */
/*     by import or is EXTRACTED from src/** at run time and gate-checked)     */
/* ========================================================================== */
const MECH_SRC_PATH = 'src/sim/mechanics.ts';
const PLAYER_SRC_PATH = 'src/sim/Player.ts';
const MECH_SRC = readFileSync(MECH_SRC_PATH, 'utf8');
const PLAYER_SRC = readFileSync(PLAYER_SRC_PATH, 'utf8');
const MECH_LINES = MECH_SRC.split('\n');
const PLAYER_LINES = PLAYER_SRC.split('\n');
/** find the 1-indexed line of the first line matching `re` (0 ⇒ not found). */
const lineOf = (lines: readonly string[], re: RegExp): number => {
  for (let i = 0; i < lines.length; i++) if (re.test(lines[i])) return i + 1;
  return 0;
};
/** extract the FIRST capture group of `re` from `src` as a number (NaN ⇒ not found). */
const extractNum = (src: string, re: RegExp): number => {
  const m = re.exec(src);
  return m === null ? Number.NaN : Number(m[1]);
};
/** the slice of `src` between the first match of `from` and the first following match of `to`. */
const sliceBetween = (src: string, from: RegExp, to: RegExp): string => {
  const a = from.exec(src);
  if (a === null) return '';
  const rest = src.slice(a.index);
  const b = to.exec(rest.slice(a[0].length));
  return b === null ? '' : rest.slice(0, a[0].length + b.index + b[0].length);
};
/** the whole body of `export function <name>` up to the next top-level `\n}` . */
const fnBody = (src: string, name: string): string => {
  const i = src.indexOf(`export function ${name}(`);
  if (i < 0) return '';
  const j = src.indexOf('\n}', i);
  return j < 0 ? '' : src.slice(i, j + 2);
};

const TRY_TACKLES_SRC = fnBody(MECH_SRC, 'tryTackles');
/** the take-probability EXPRESSION: everything from `let p =` to the clamp that closes it. */
const TAKE_P_EXPR = sliceBetween(TRY_TACKLES_SRC, /let p =/, /p = clamp\(p, [\d.]+, [\d.]+\);/);
/** the MISS branch: the `} else {` arm of the roll, to the end of the function. */
const MISS_BRANCH_SRC = (() => {
  const i = TRY_TACKLES_SRC.indexOf('  } else {');
  return i < 0 ? '' : TRY_TACKLES_SRC.slice(i);
})();

/** ⭐ THE CHALLENGE RADIUS — the candidate scan's own bound (`if (d < 1.15 && d < best)`). */
const R_TACKLE = extractNum(TRY_TACKLES_SRC, /if \(d < ([\d.]+) && d < best\)/);
const R_TACKLE_LINE = lineOf(MECH_LINES, /if \(d < [\d.]+ && d < best\)/);
/** ⭐ THE MISS PRICE — the two numbers a beaten lunger pays, and nothing else. */
const MISS_COOLDOWN_S = extractNum(MISS_BRANCH_SRC, /tackler\.tackleCooldown = ([\d.]+);/);
const MISS_STUN_S = extractNum(MISS_BRANCH_SRC, /tackler\.stunTimer = ([\d.]+);/);
const MISS_STUN_LINE = lineOf(MECH_LINES, /tackler\.stunTimer = [\d.]+; \/\/ whiffed lunge/);
const MISS_CD_LINE = MISS_STUN_LINE - 1;
const WIN_CD_LINE = lineOf(MECH_LINES, /tackler\.tackleCooldown = 0\.5;/);
const CARRIER_STUN_LINE = lineOf(MECH_LINES, /owner\.stunTimer = [\d.]+; \/\/ dispossessed/);
const DRIVE_NORM_LINE = lineOf(MECH_LINES, /const driveNow = clamp\(len\(owner\.vel\)/);
const CONE_LINE = lineOf(MECH_LINES, /ball\.vel = scale\(rotate\(wide, match\.rng\.range/);
const P_CLAMP_LINE = lineOf(MECH_LINES, /^ {2}p = clamp\(p, [\d.]+, [\d.]+\);/);
/** THE WIN PRICES (the tackler's own cooldown; the dispossessed carrier's stumble). */
const WIN_COOLDOWN_S = extractNum(TRY_TACKLES_SRC, /tackler\.tackleCooldown = (0\.5);/);
const CARRIER_STUN_S = extractNum(TRY_TACKLES_SRC, /owner\.stunTimer = ([\d.]+); \/\/ dispossessed/);
/** the OTHER duel mechanics' committing cooldowns — used only to CLASSIFY detected events. */
const SLIDE_COOLDOWN_S = extractNum(MECH_SRC, /slider\.tackleCooldown = ([\d.]+);/);
const GRAB_COOLDOWN_S = extractNum(MECH_SRC, /grabber\.tackleCooldown = ([\d.]+);/);
const SMOTHER_COOLDOWN_S = extractNum(MECH_SRC, /gk\.tackleCooldown = (1\.2);/);
/** the keeper's AERIAL CLAIM commitment — the sixth (and last) writer of `tackleCooldown`. */
const GK_AERIAL_COOLDOWN_S = extractNum(MECH_SRC, /gk\.tackleCooldown = (0\.9);/);
const SMOTHER_STUN_S = extractNum(MECH_SRC, /gk\.stunTimer = ([\d.]+); \/\/ beaten/);
const SLIDE_WIN_STUN_S = extractNum(MECH_SRC, /slider\.stunTimer = ([\d.]+); \/\/ he won it/);
const SLIDE_MISS_STUN_S = extractNum(MECH_SRC, /slider\.stunTimer = ([\d.]+); \/\/ beaten and grounded/);
/** ⭐ THE BODY'S OWN ACCELERATION CONSTANT (`const ACCEL = 14; // m/s^2 toward desired velocity`). */
const ACCEL = extractNum(PLAYER_SRC, /^const ACCEL = ([\d.]+);/m);
const ACCEL_LINE = lineOf(PLAYER_LINES, /^const ACCEL = [\d.]+;/);
/** the carrier's own DRIVE normaliser — the ONE motion term the take probability contains. */
const DRIVE_NORM = extractNum(TRY_TACKLES_SRC, /clamp\(len\(owner\.vel\) \/ (\d+), 0, 1\)/);
/** the squirt cone half-width (rad) — the engine's own angular constant, reused as an angle cut. */
const CONE_RAD = extractNum(TRY_TACKLES_SRC, /rotate\(wide, match\.rng\.range\(-([\d.]+), [\d.]+\)\)/);
/** the take probability's own clamp — the floor/ceiling a geometry-blind roll lives between. */
const P_FLOOR = extractNum(TRY_TACKLES_SRC, /p = clamp\(p, ([\d.]+), [\d.]+\);/);
const P_CEIL = extractNum(TRY_TACKLES_SRC, /p = clamp\(p, [\d.]+, ([\d.]+)\);/);

/* ========================================================================== */
/* §3 ⭐⭐ THE FROZEN GRID — DERIVED from §2, arithmetic shown, no invention     */
/* ========================================================================== */
/**
 * ⭐ THE OVERCOMMITMENT THRESHOLD v*, derived. `physicsStep` approaches `desiredVel` at the SAME
 * rate in every direction (Player.ts §physicsStep: `maxDelta = this.accel * dt`, applied to the
 * vector difference) — so the body's DECELERATION model is its acceleration model: |dv/dt| ≤ a.
 * A body arriving at speed v therefore needs  v² / (2a)  metres to come to rest. Set that equal
 * to the challenge radius R_TACKLE — the distance inside which the duel is even offered — and
 * solve:  v* = sqrt(2 · a · R_TACKLE).  With a = ACCEL (14) and R = 1.15:
 *        v* = sqrt(2 × 14 × 1.15) = sqrt(32.2) = 5.674504… m/s.
 * ⇒ X (the "brake within X" of the charter) IS the challenge radius, and an arrival at or above
 *   v* CANNOT be stopped inside it: the body is committed to passing through.
 * ⚠ a is the BASE constant; the per-body accel is ACCEL × (0.9 + pace × 0.2) ∈ [12.6, 16.8]
 *   (Player.ts), so v* spans [5.383, 6.216] across the population. The base value is the frozen
 *   grid edge, DECLARED, and the per-body v* is published as a REPORTED sensitivity column.
 */
const V_STAR = Math.sqrt(2 * ACCEL * R_TACKLE);
/** the four speed cuts: quarters of v*. Five bins s0..s4; s4 IS the overcommitted class. */
const SPEED_CUTS = [0.25, 0.5, 0.75, 1].map((f) => f * V_STAR);
const SPEED_LABELS = ['s0 walk', 's1 jog', 's2 run', 's3 drive', 's4 OVERCOMMITTED'] as const;
const NS = SPEED_LABELS.length;
const speedBin = (v: number): number => {
  for (let i = 0; i < SPEED_CUTS.length; i++) if (v < SPEED_CUTS[i]) return i;
  return SPEED_CUTS.length;
};
/**
 * THE ANGLE CUTS — the engine's OWN angular constant. θ = the angle between the taker's bearing
 * from the carrier and the CARRIER'S heading, in [0, π]. The cut is CONE_RAD = 1.2 rad, the
 * half-width of the engine's own tackle-squirt noise cone, and its supplement π − 1.2:
 *   FRONT  θ <  1.2            · FLANK  1.2 ≤ θ < π − 1.2 (= 1.941593)  · BEHIND  θ ≥ π − 1.2.
 */
const ANGLE_CUTS = [CONE_RAD, Math.PI - CONE_RAD];
const ANGLE_LABELS = ['front', 'flank', 'behind'] as const;
const NA = ANGLE_LABELS.length;
const angleBin = (theta: number): number => {
  for (let i = 0; i < ANGLE_CUTS.length; i++) if (theta < ANGLE_CUTS[i]) return i;
  return ANGLE_CUTS.length;
};
/**
 * ⭐ THE APPROACH-DIRECTION AXIS φ — the angle between the TAKER'S OWN VELOCITY and the carrier's
 * heading, at the SAME cone cuts. φ ≈ 0 ⇒ he is travelling the way the carrier faces (a CHASE from
 * behind); φ ≈ π ⇒ he is running INTO the carrier's line (HEAD-ON). A body slower than half a
 * per-tick speed quantum has no meaningful direction of travel and is binned PLANTED.
 * ⚠ ADDED AFTER THE PREFLIGHT AND BEFORE THE BATTERY — see §DEV: the BEARING axis θ turned out to
 * be structurally degenerate (the ball is carried ahead of the body, so a candidate inside the
 * challenge radius is nearly always in the carrier's frontal cone). Both axes are published.
 */
const PHI_LABELS = ['chasing', 'across', 'head-on', 'planted'] as const;
const NPHI = PHI_LABELS.length;
const phiBin = (phi: number, speed: number, plantedCut: number): number => {
  if (!(speed >= plantedCut) || !Number.isFinite(phi)) return 3;
  for (let i = 0; i < ANGLE_CUTS.length; i++) if (phi < ANGLE_CUTS[i]) return i;
  return ANGLE_CUTS.length;
};
/**
 * THE MOTION-STATE CUTS — the body's own per-tick quanta.
 *   speed quantum  q_v = ACCEL × DT   = 14/60      = 0.233333 m/s per tick (the most a body's
 *                                                    speed can change in one tick)
 *   turn quantum   q_ψ = TURN_RATE×DT = 6.5/60     = 0.108333 rad per tick (the heading cap)
 * A body is ACCELERATING / BRAKING when |Δspeed| exceeds HALF its own per-tick quantum (half a
 * quantum is the smallest cut that is not measurement noise at this timestep — declared ex ante),
 * and TURNING-HARD when |Δheading| reaches half the turn cap.
 */
const Q_V = ACCEL * DT;
const Q_PSI = TURN_RATE * DT;
const ACCEL_CUT = 0.5 * Q_V;
const TURN_CUT = 0.5 * Q_PSI;
const MOTION_LABELS = ['braking', 'steady', 'accelerating'] as const;
/** the MISS-overrun horizon: the stun the engine itself imposes on a beaten lunger, in ticks. */
const STUN_TICKS = Math.round(MISS_STUN_S / DT);
/**
 * ⭐ THE TWO OUTCOME HORIZONS, TRACED (not a round number of seconds): the beaten lunger's OWN
 * re-challenge interval `MISS_COOLDOWN_S` (1.2 s — the engine's answer to "when may he try again")
 * and twice it. If diving in ever costs anything, the price must be visible inside the interval
 * the engine itself says he is out of the duel for.
 */
const H1_TICKS = Math.round(MISS_COOLDOWN_S / DT);
const H2_TICKS = 2 * H1_TICKS;
const H1_S = round(H1_TICKS * DT, 6);
const H2_S = round(H2_TICKS * DT, 6);

/* --- the CHURN instrument's own traced zoning (DV-C0's, inherited VERBATIM) -- */
const THIRD_LOCAL_X = HALF_L / 3;
const BAND_LOCAL_Y = HALF_W / 3;
const THIRDS = ['own', 'middle', 'final'] as const;
type Third = (typeof THIRDS)[number];
const thirdOf = (localX: number): Third => (localX < -THIRD_LOCAL_X ? 'own'
  : localX > THIRD_LOCAL_X ? 'final' : 'middle');

/* ========================================================================== */
/* §4 THE SEED LEDGER (#163) — band 12,470,000–12,479,999 (ruling #265.4)      */
/* ========================================================================== */
const RESERVED_BAND: readonly [number, number] = [12_470_000, 12_479_999];
const CORE_BASE = 12_470_000; //        12,470,000–011  the core (X-DET pilot / G-WORLD reads)
const CORE_N = 12;
const GUARD_BASE = 12_470_050; //       12,470,050–099  where EVERY preflight is routed
const GUARD_SPAN = 50;
const SMOKE_BASE = 12_470_100; //       12,470,100–139  the smoke MODE's own sizing battery
const SMOKE_N = 40;
const GWORLD_SEED = 12_470_999; //      constructed, NEVER stepped
const CENSUS_BASE = 12_471_000; //      12,471,000 + i, N ≤ SEED_ROOM
const SEED_ROOM = 800;
/** ⭐ THE DELIBERATE RE-WALK (a RECEIPT, never fresh data): DV-C0's OWN committed smoke block. */
const REPRO_DVC0_BASE = 12_429_000;
const REPRO_DVC0_N = 12;
const DVC0_SMOKE_PATH = 'docs/world-model/data/dv-c0-loss-cost-smoke.json';

/** The COMPLETE #163-regime ledger, carried forward from EK-C0c's committed probe and extended
 *  with the EK-C0c band itself (12,461,000–12,465,999 reserved incl. its ceiling). */
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
  { name: '⭐ DV-C0 smoke (#249) — THIS STAGE RE-WALKS IT', range: [12_429_000, 12_429_011] },
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
  { name: 'EK-T0 seam band (#261.4/#262)', range: [12_450_000, 12_450_999] },
  { name: 'EK-T1 exam band + reserved ceiling (#262.3/#263)', range: [12_451_000, 12_460_999] },
  { name: 'EK-C0c in-timeline census band (#263.3/#264)', range: [12_461_000, 12_465_999] },
];

/* --- THE STATS STREAM — a SEPARATE namespace (#163) ------------------------- */
const STATS_BASE = 109_600; // ruling #265.4's floor, exactly on the 200-step grid
const BOOTSTRAP = 2000;
const STATS_PUBLISHED_BASES: readonly number[] = [
  105_800, 106_000, 106_200, 106_400, 106_600, 106_800,
  107_000, 107_200, 107_400, 107_600, 107_800,
  108_000, 108_200, 108_400, 108_600, 108_800, 109_000, 109_200, 109_400,
];

/* --- the N rule's frozen inputs --------------------------------------------- */
/** 60 events ⇒ a count's relative SE ≈ 1/sqrt(60) ≈ 13 %, the precision at which a rate
 *  ORDERING (the #246 check) is readable — DV-C0's own target, inherited with its reason. */
const RARE_CELL_EVENTS = 60;
const N_FLOOR = 25;
const N_STEP = 25;
const WALL_BUDGET_HOURS = 0.5;
const XDET_FACTOR = 2;
const ARMS_COUNT = 1;
/** used only when no committed smoke artifact exists yet (a first smoke run). */
const PRIOR_MS_PER_MATCH = 200;

/* --- the X-family pins ------------------------------------------------------ */
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
const FINGERPRINT_SEED = 1337;
const FINGERPRINT_SEASONS = 2;

/* ========================================================================== */
/* §5 THE WORLD — BARE PRODUCTION (all experimental flags OFF)                 */
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
/** ⭐ THE SHIPPED GAME: no MatchConfig flag, no gene written, no eye armed. Byte-for-byte DV-C0's
 *  PROD-arm constructor — which is WHY G-REPRO-DVC0 can reproduce its committed rows exactly. */
const matchFor = (seed: number): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
});

/** ⭐ THE PRODUCTION-WORLD PREDICATE, RE-DERIVED for this census (never inherited). */
const DOOR_FLAGS = ['ptpPassLead', 'dlcDeliveryChoice', 'dlcStrikePlane', 'obmMovement',
  'ctbSupportPlane', 'o1PassWindup', 'pmPhaseModulation', 'mtMarkTightness', 'ptpPassToPath',
  'ctbCheckToBall', 'dvLearnedMap', 'dvDeliveryValue', 'dvLearn', 'c5Hold', 'c6Carry',
  'c7Windup', 'o2Look', 'edsPerceivedDefence', 'edsPerceivedChoice', 'edsValueAxis',
  'c5TouchFork', 'ekHoldLearn', 'ekHoldVeto'] as const;
const GENE_NEEDLES = ['defLaneConvergence', 'markSag', 'passLeadSupport', 'obmMoveWeights',
  'ctbSupportPlane', 'dlcStrikePlaneGene', 'dvExposureWeight', 'dvLossBelief',
  'ekHoldBelief'] as const;
const prodConjuncts = (m: Match, seed: number): Record<string, boolean> => {
  const mm = m as unknown as Record<string, unknown>;
  const mtKeys = Object.keys(MT_WORLD_FLAGS) as string[];
  const genomes = ([0, 1] as const).flatMap((s) => [
    m.teams[s].info.genome, m.teams[s].baseGenome, m.teams[s].effGenome,
  ] as unknown as Record<string, unknown>[]);
  return {
    doorsShut: DOOR_FLAGS.every((k) => mm[k] !== true),
    mtShut: mtKeys.every((k) => mm[k] !== true) && mtArmedVersion(m) === 0,
    noEye: mm.whetherEye == null && mm.stationEye == null && mm.forcedHold == null,
    noBooks: mm.ekHold == null && mm.dvLearn !== true,
    noGene: genomes.every((g) => GENE_NEEDLES.every((k) => g[k] === undefined)),
    defaultDuration: m.duration === MATCH_DURATION,
    censusConstruction:
      canonical(m.teams[0].info.genome) === canonical(teamInfo('A', seed * 2 + 1).genome)
      && canonical(m.teams[1].info.genome) === canonical(teamInfo('B', seed * 2 + 2).genome),
  };
};

/* ========================================================================== */
/* §6 ⭐⭐ THE INSTRUMENT                                                       */
/*    (a) the DUEL DETECTOR — public state only, no src hook                   */
/*    (b) the CHURN walker — DV-C0's segment/turnover semantics, INHERITED      */
/* ========================================================================== */
/**
 * ⭐ HOW A CHALLENGE IS SEEN WITHOUT TOUCHING THE ENGINE. `Match.step` runs, in order,
 * brains → executors → `physicsStep` (which DECREMENTS every cooldown) → `stepBall`, and the duel
 * mechanics live at the END of `stepBall`'s owned-ball branch. So at POST-STEP the cooldowns a
 * mechanic set THIS tick are still at their FULL set value, and no other code path can raise a
 * cooldown. ⇒ a per-player STRICT INCREASE of `tackleCooldown` across one step is a duel mechanic
 * firing, and the exact post value names WHICH:
 *      0.5 → tryTackles WON      · 1.2 & stun 0.35 → tryTackles MISSED
 *      2.5 → trySlideTackle      · 2.0 → tryTacticalFoul  · 1.2 & stun 0.8 (GK) → trySmother miss
 * Every one of those numbers is EXTRACTED from `src/sim/mechanics.ts` at run time (§2), never
 * typed here, and G-DETECT proves the classification against the engine's OWN tackle counter.
 * ⭐ The geometry is read at the same post-step instant, which IS the instant the mechanic saw:
 * `tryTackles` runs after `physicsStep` and writes no position or velocity.
 */
type Outcome = 'win' | 'miss';
interface Duel {
  tick: number; tSim: number;
  defSide: Side; takerGid: number; carrierGid: number;
  outcome: Outcome;
  /** the taker's speed at the challenge instant (m/s). */
  speed: number;
  speedBin: number;
  /** θ: taker's bearing from the carrier vs the CARRIER's heading, rad in [0, π]. */
  theta: number;
  angleBin: number;
  /** φ: the TAKER'S OWN direction of travel vs the carrier's heading. */
  phi: number;
  phiBin: number;
  /** motion state from the taker's own per-tick deltas. */
  dSpeed: number; motion: number; turning: boolean;
  /** closing speed along the taker→carrier axis (m/s, + = closing). */
  closing: number;
  /** the carrier's own speed (the ONE motion term the take probability reads). */
  carrierSpeed: number;
  /** separation at the instant, and the taker's own v* (per-body accel). */
  dist: number; vStarBody: number; overcommitted: boolean;
  third: Third;
  /** ⭐ the tick's own whistle relocated the ball or the taker (a penalty award, a sending-off):
   *  the post-step geometry is then the RESTART's, not the duel's, so the event is counted and
   *  EXCLUDED from every geometry table. */
  whistled: boolean;
  /* --- resolved at the horizons (null ⇒ the match ended first) --- */
  overrun: number | null;      // metres travelled along the approach axis in STUN_TICKS
  dDist1: number | null;       // Δ separation taker↔carrier over H1 (+ = the taker fell away)
  dSpace1: number | null;      // Δ (carrier's distance to his nearest opponent) over H1
  retain1: boolean | null;     // the carrier's team still holds it (no turnover stamped) at H1
  retain2: boolean | null;
  /* --- the churn linkage --- */
  spellTicksTotal: number | null;   // the possession segment the duel sits in
  spellTicksAfter: number | null;   // ticks of that segment remaining after the duel
}
interface Segment {
  team: Side; startTick: number; assignedTicks: number;
  lastOwnedLocalXOwnerFrame: number;
  terminator: 'opponentControl' | 'deadBall' | 'goal' | 'matchEnd';
}
interface MatchRow {
  seed: number; simSeconds: number;
  /* --- the DV-C0 inherited columns (G-REPRO-DVC0 reads exactly these) --- */
  totalTicks: number; deadBallTicks: number; segmentTicks: number; looseGapTicks: number;
  assignedTicksSum: number; spanOrderViolations: number; goalsFromScore: number;
  turnoversTotal: number; turnoversByThird: Record<Third, number>;
  /* --- the CB-C0 ledger --- */
  duels: Duel[];
  refusals: number[][];        // [speedBin][angleBin] counts
  refusalsPhi: number[][];     // [speedBin][phiBin] counts
  refusalTicks: number;
  proximityTicks: number;      // ticks with ≥1 eligible candidate inside R_TACKLE
  slideEvents: number; slideWins: number;
  grabEvents: number; smotherMissEvents: number; gkAerialEvents: number;
  unclassifiedJumps: number;
  engineTackleDelta: number;   // Σ team.stats.tackles over the match (the engine's own counter)
  outOfRadiusDuels: number;    // a detected duel outside R_TACKLE (whistled ones are expected)
  outOfRadiusUnwhistled: number; // MUST be 0
  segmentsTotal: number;
  segmentTickList: number[];   // every closed segment's assignedTicks (the churn baseline)
}

const norm2 = (x: number, y: number): number => Math.sqrt(x * x + y * y);
const angBetween = (ax: number, ay: number, bx: number, by: number): number => {
  const la = norm2(ax, ay); const lb = norm2(bx, by);
  if (la < 1e-9 || lb < 1e-9) return Number.NaN;
  const c = Math.max(-1, Math.min(1, (ax * bx + ay * by) / (la * lb)));
  return Math.acos(c);
};

function walkOne(seed: number): MatchRow {
  lastOwnerRef = null;
  const m = matchFor(seed);
  const P = m.allPlayers;
  const NP = P.length;
  /* per-player previous post-step kinematics + cooldowns */
  const prevCd = new Float64Array(NP);
  const prevSpeed = new Float64Array(NP);
  const prevHx = new Float64Array(NP);
  const prevHy = new Float64Array(NP);
  const prevPx = new Float64Array(NP);
  const prevPy = new Float64Array(NP);
  for (let i = 0; i < NP; i++) {
    prevCd[i] = P[i].tackleCooldown; prevSpeed[i] = 0;
    prevHx[i] = P[i].heading.x; prevHy[i] = P[i].heading.y;
    prevPx[i] = P[i].pos.x; prevPy[i] = P[i].pos.y;
  }
  const prevStatsTackles: [number, number] = [m.teams[0].stats.tackles, m.teams[1].stats.tackles];
  const prevScore: [number, number] = [m.score[0], m.score[1]];

  const duels: Duel[] = [];
  const refusals: number[][] = Array.from({ length: NS }, () => new Array<number>(NA).fill(0));
  const refusalsPhi: number[][] = Array.from({ length: NS }, () => new Array<number>(NPHI).fill(0));
  let refusalTicks = 0; let proximityTicks = 0;
  let slideEvents = 0; let slideWins = 0; let grabEvents = 0; let smotherMissEvents = 0;
  let gkAerialEvents = 0;
  let unclassifiedJumps = 0; let engineTackleDelta = 0; let outOfRadiusDuels = 0;
  let outOfRadiusUnwhistled = 0;

  /* pending horizon resolutions */
  interface Pending { d: Duel; ax: number; ay: number; px: number; py: number }
  const pendStun: Pending[] = [];
  const pendH1: Pending[] = [];
  /* turnover ledger (DV-C0 semantics) */
  const turnovers: { tick: number; loser: Side }[] = [];
  const turnoversByThird: Record<Third, number> = { own: 0, middle: 0, final: 0 };
  const segmentTickList: number[] = [];
  /* the duel→segment linkage: duels awaiting the close of the segment they sit in */
  let curSegDuels: Duel[] = [];

  const segments: Segment[] = [];
  let cur: Segment | null = null;
  let totalTicks = 0; let deadBallTicks = 0; let segmentTicks = 0; let looseGapTicks = 0;
  let spanOrderViolations = 0; let goalsFromScore = 0;

  const closeSegment = (s: Segment, terminator: Segment['terminator']): void => {
    s.terminator = terminator;
    const last = segments.length === 0 ? null : segments[segments.length - 1];
    if (last !== null && s.startTick <= last.startTick) spanOrderViolations++;
    segments.push(s);
    segmentTickList.push(s.assignedTicks);
    for (const d of curSegDuels) {
      d.spellTicksTotal = s.assignedTicks;
      d.spellTicksAfter = Math.max(0, s.startTick + s.assignedTicks - d.tick);
    }
    curSegDuels = [];
  };

  while (!m.finished) {
    m.step(DT);
    totalTicks++;
    const tick = m.simTick;
    const phase = m.phase;
    const ball = m.ball;
    const owner = ball.owner;

    for (const s of [0, 1] as const) {
      if (m.score[s] > prevScore[s]) goalsFromScore += m.score[s] - prevScore[s];
      prevScore[s] = m.score[s];
      const t = m.teams[s].stats.tackles;
      engineTackleDelta += t - prevStatsTackles[s];
      prevStatsTackles[s] = t;
    }

    /* ---------- (a) THE DUEL DETECTOR ---------- */
    let lungeThisTick = false;
    for (let i = 0; i < NP; i++) {
      const p = P[i];
      const cd = p.tackleCooldown;
      if (cd > prevCd[i] + 1e-12) {
        const st = p.stunTimer;
        const isStanding = cd === WIN_COOLDOWN_S
          || (cd === MISS_COOLDOWN_S && Math.abs(st - MISS_STUN_S) < 1e-9);
        if (isStanding) {
          lungeThisTick = true;
          const outcome: Outcome = cd === WIN_COOLDOWN_S ? 'win' : 'miss';
          /* the carrier: on a WIN the engine has already cleared ball.owner, so the carrier is
           * the body that owned it at the PREVIOUS post-step instant — which is the body the
           * mechanic actually duelled. Both readings are recorded and G-DETECT ties them. */
          const carrier = (outcome === 'win' ? lastOwnerRef : owner) ?? lastOwnerRef ?? owner;
          if (carrier === null || carrier === undefined) { unclassifiedJumps++; continue; }
          const vx = p.vel.x; const vy = p.vel.y;
          const speed = norm2(vx, vy);
          const bx = p.pos.x - carrier.pos.x; const by = p.pos.y - carrier.pos.y;
          const theta = angBetween(bx, by, carrier.heading.x, carrier.heading.y);
          const phi = angBetween(vx, vy, carrier.heading.x, carrier.heading.y);
          const dSpeed = speed - prevSpeed[i];
          const dPsi = angBetween(p.heading.x, p.heading.y, prevHx[i], prevHy[i]);
          const dNow = norm2(p.pos.x - carrier.pos.x, p.pos.y - carrier.pos.y);
          const dPrev = norm2(prevPx[i] - carrier.pos.x, prevPy[i] - carrier.pos.y);
          const dBall = norm2(p.pos.x - ball.pos.x, p.pos.y - ball.pos.y);
          const whistled = m.phase !== 'playing' || p.sentOff;
          if (!(dBall < R_TACKLE)) { outOfRadiusDuels++; if (!whistled) outOfRadiusUnwhistled++; }
          const accelBody = ACCEL * (0.9 + p.attrs.pace * 0.2);
          const d: Duel = {
            tick, tSim: m.simTime, defSide: p.side, takerGid: p.gid, carrierGid: carrier.gid,
            outcome, speed, speedBin: speedBin(speed),
            theta: Number.isFinite(theta) ? theta : 0,
            angleBin: angleBin(Number.isFinite(theta) ? theta : 0),
            phi: Number.isFinite(phi) ? phi : Number.NaN,
            phiBin: phiBin(phi, speed, ACCEL_CUT),
            dSpeed, motion: dSpeed > ACCEL_CUT ? 2 : dSpeed < -ACCEL_CUT ? 0 : 1,
            turning: Number.isFinite(dPsi) && dPsi >= TURN_CUT,
            closing: (dPrev - dNow) / DT,
            carrierSpeed: norm2(carrier.vel.x, carrier.vel.y),
            dist: dBall, vStarBody: Math.sqrt(2 * accelBody * R_TACKLE),
            overcommitted: speed >= V_STAR,
            third: thirdOf(m.teams[carrier.side].localX(ball.pos.x)),
            whistled: m.phase !== 'playing' || p.sentOff,
            overrun: null, dDist1: null, dSpace1: null, retain1: null, retain2: null,
            spellTicksTotal: null, spellTicksAfter: null,
          };
          duels.push(d);
          if (cur !== null && cur.team === carrier.side) curSegDuels.push(d);
          const ux = speed > 1e-6 ? vx / speed : (dNow > 1e-6 ? -bx / dNow : 0);
          const uy = speed > 1e-6 ? vy / speed : (dNow > 1e-6 ? -by / dNow : 0);
          pendStun.push({ d, ax: ux, ay: uy, px: p.pos.x, py: p.pos.y });
          pendH1.push({ d, ax: ux, ay: uy, px: p.pos.x, py: p.pos.y });
        } else if (cd === SLIDE_COOLDOWN_S) {
          slideEvents++;
          if (Math.abs(st - SLIDE_WIN_STUN_S) < 1e-9) slideWins++;
          else if (Math.abs(st - SLIDE_MISS_STUN_S) >= 1e-9) unclassifiedJumps++;
        } else if (cd === GRAB_COOLDOWN_S) grabEvents++;
        else if (cd === SMOTHER_COOLDOWN_S && Math.abs(st - SMOTHER_STUN_S) < 1e-9) smotherMissEvents++;
        else if (cd === GK_AERIAL_COOLDOWN_S && p.role === 'GK') gkAerialEvents++;
        else unclassifiedJumps++;
      }
    }

    /* ---------- (b) THE REFUSAL / PROXIMITY ACCOUNTING ---------- */
    /* The candidate predicate is `tryTackles`' own, re-derived: an opponent of the carrier who is
     * not sent off, has NO tackle cooldown and NO stun, inside R_TACKLE of the BALL. It is read
     * at post-step, which for a tick with NO lunge is exactly the state the mechanic saw (the
     * only writer of those fields between physicsStep and the mechanic IS the mechanic). */
    if (phase === 'playing' && owner !== null && owner.gkHoldTimer <= 0
      && !(owner.role === 'GK' && owner.gkDistributing) && !lungeThisTick) {
      let best = -1; let bestD = Infinity;
      for (let i = 0; i < NP; i++) {
        const o = P[i];
        if (o.side === owner.side || o.sentOff || o.tackleCooldown > 0 || o.stunTimer > 0) continue;
        const d = norm2(o.pos.x - ball.pos.x, o.pos.y - ball.pos.y);
        if (d < R_TACKLE && d < bestD) { bestD = d; best = i; }
      }
      if (best >= 0) {
        proximityTicks++; refusalTicks++;
        const o = P[best];
        const sp = norm2(o.vel.x, o.vel.y);
        const th = angBetween(o.pos.x - owner.pos.x, o.pos.y - owner.pos.y,
          owner.heading.x, owner.heading.y);
        const ph = angBetween(o.vel.x, o.vel.y, owner.heading.x, owner.heading.y);
        refusals[speedBin(sp)][angleBin(Number.isFinite(th) ? th : 0)]++;
        refusalsPhi[speedBin(sp)][phiBin(ph, sp, ACCEL_CUT)]++;
      }
    } else if (lungeThisTick) proximityTicks++;

    /* ---------- (c) HORIZON RESOLUTION ---------- */
    for (let k = pendStun.length - 1; k >= 0; k--) {
      const q = pendStun[k];
      if (tick - q.d.tick < STUN_TICKS) continue;
      const t = P[q.d.takerGid];
      q.d.overrun = (t.pos.x - q.px) * q.ax + (t.pos.y - q.py) * q.ay;
      pendStun.splice(k, 1);
    }
    for (let k = pendH1.length - 1; k >= 0; k--) {
      const q = pendH1[k];
      if (tick - q.d.tick < H1_TICKS) continue;
      const t = P[q.d.takerGid]; const c = P[q.d.carrierGid];
      q.d.dDist1 = norm2(t.pos.x - c.pos.x, t.pos.y - c.pos.y) - q.d.dist;
      let nearest = Infinity;
      for (let i = 0; i < NP; i++) {
        const o = P[i];
        if (o.side === c.side || o.sentOff) continue;
        const dd = norm2(o.pos.x - c.pos.x, o.pos.y - c.pos.y);
        if (dd < nearest) nearest = dd;
      }
      q.d.dSpace1 = nearest - q.d.dist;
      pendH1.splice(k, 1);
    }

    /* ---------- (d) THE CHURN WALKER — DV-C0's segment/turnover semantics ---------- */
    if (phase !== 'playing') {
      deadBallTicks++;
      if (cur !== null) { closeSegment(cur, 'deadBall'); cur = null; }
      lastOwnerRef = owner;
      for (let i = 0; i < NP; i++) {
        const p = P[i];
        prevCd[i] = p.tackleCooldown; prevSpeed[i] = norm2(p.vel.x, p.vel.y);
        prevHx[i] = p.heading.x; prevHy[i] = p.heading.y;
        prevPx[i] = p.pos.x; prevPy[i] = p.pos.y;
      }
      continue;
    }
    if (owner === null) {
      if (cur !== null) { cur.assignedTicks++; segmentTicks++; } else looseGapTicks++;
    } else {
      const side = owner.side;
      if (cur !== null && cur.team !== side) {
        const lt = thirdOf(cur.lastOwnedLocalXOwnerFrame);
        turnovers.push({ tick, loser: cur.team });
        turnoversByThird[lt]++;
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
      cur.assignedTicks++; segmentTicks++;
      cur.lastOwnedLocalXOwnerFrame = m.teams[side].localX(ball.pos.x);
    }
    lastOwnerRef = owner;

    for (let i = 0; i < NP; i++) {
      const p = P[i];
      prevCd[i] = p.tackleCooldown; prevSpeed[i] = norm2(p.vel.x, p.vel.y);
      prevHx[i] = p.heading.x; prevHy[i] = p.heading.y;
      prevPx[i] = p.pos.x; prevPy[i] = p.pos.y;
    }
  }
  if (cur !== null) { closeSegment(cur, 'matchEnd'); cur = null; }

  /* ---------- (e) RETENTION, from the turnover ledger (never re-defined) ---------- */
  for (const d of duels) {
    const carrierSide = (1 - d.defSide) as Side;
    const endsBy = (h: number): boolean => turnovers
      .some((t) => t.loser === carrierSide && t.tick > d.tick && t.tick <= d.tick + h);
    const reach = (h: number): boolean => d.tick + h <= totalTicks;
    d.retain1 = reach(H1_TICKS) ? !endsBy(H1_TICKS) : null;
    d.retain2 = reach(H2_TICKS) ? !endsBy(H2_TICKS) : null;
  }

  return {
    seed, simSeconds: m.simTime,
    totalTicks, deadBallTicks, segmentTicks, looseGapTicks,
    assignedTicksSum: segments.reduce((a, s) => a + s.assignedTicks, 0),
    spanOrderViolations, goalsFromScore,
    turnoversTotal: segments.filter((s) => s.terminator === 'opponentControl').length,
    turnoversByThird,
    duels, refusals, refusalsPhi, refusalTicks, proximityTicks,
    slideEvents, slideWins, grabEvents, smotherMissEvents, gkAerialEvents,
    unclassifiedJumps, engineTackleDelta, outOfRadiusDuels, outOfRadiusUnwhistled,
    segmentsTotal: segments.length,
    segmentTickList,
  };
}
/** the previous post-step ball owner — module-scoped so the detector can name a WIN's carrier. */
let lastOwnerRef: { gid: number; side: Side; pos: { x: number; y: number };
  heading: { x: number; y: number }; vel: { x: number; y: number } } | null = null;

/* ========================================================================== */
/* §7 CLUSTER CELLS — the stored grain every headline re-derives from          */
/* ========================================================================== */
interface ClusterRow {
  seed: number; simSeconds: number; totalTicks: number;
  /** [speedBin][angleBin] → lunges / wins / refusals (the BEARING axis θ) */
  lunges: number[][]; wins: number[][]; refusals: number[][];
  /** [speedBin][phiBin] → lunges / wins / refusals (the APPROACH-DIRECTION axis φ) */
  lungesPhi: number[][]; winsPhi: number[][]; refusalsPhi: number[][];
  /** per speed bin, the MISS population's outcome sums (n and Σ), so means re-derive */
  missN: number[]; missOverrunSum: number[]; missOverrunN: number[];
  missDDistSum: number[]; missDDistN: number[];
  missDSpaceSum: number[]; missDSpaceN: number[];
  missRetain1K: number[]; missRetain1N: number[];
  missRetain2K: number[]; missRetain2N: number[];
  /** per speed bin, the WIN population's overrun (the symmetric picture) */
  winOverrunSum: number[]; winOverrunN: number[];
  /** motion-state marginals: [motion][0]=lunges [1]=wins ; turning marginal */
  motionLunges: number[]; motionWins: number[];
  turnLunges: number; turnWins: number;
  /** churn */
  turnovers: number; segments: number; segmentTickSum: number;
  duelSpellTickSum: number; duelSpellN: number;
  duelSpellAfterSum: number; duelSpellAfterN: number;
  /** context / accounting */
  duelsTotal: number; winsTotal: number; refusalTicks: number; proximityTicks: number;
  slideEvents: number; slideWins: number; grabEvents: number; smotherMissEvents: number;
  gkAerialEvents: number;
  unclassifiedJumps: number; engineTackleDelta: number; outOfRadiusDuels: number;
  outOfRadiusUnwhistled: number; whistledExcluded: number; duelsTabulated: number;
  goalsFromScore: number; deadBallTicks: number; segmentTicks: number; looseGapTicks: number;
  assignedTicksSum: number; spanOrderViolations: number;
  /** overcommitted-by-own-body cross-cut (per-body v*, the REPORTED sensitivity) */
  ocBodyLunges: number; ocBodyWins: number;
  /** carrier-speed cross-cut, published because it is the ONE motion term the roll reads */
  carrierSpeedSum: number; carrierSpeedN: number;
  takerSpeedSum: number; takerSpeedN: number;
}

const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const grid = (): number[][] => Array.from({ length: NS }, () => zeros(NA));
const gridPhi = (): number[][] => Array.from({ length: NS }, () => zeros(NPHI));

const clusterOf = (seed: number): ClusterRow => {
  const r = walkOne(seed);
  const c: ClusterRow = {
    seed, simSeconds: round(r.simSeconds, 4), totalTicks: r.totalTicks,
    lunges: grid(), wins: grid(), refusals: r.refusals,
    lungesPhi: gridPhi(), winsPhi: gridPhi(), refusalsPhi: r.refusalsPhi,
    missN: zeros(NS), missOverrunSum: zeros(NS), missOverrunN: zeros(NS),
    missDDistSum: zeros(NS), missDDistN: zeros(NS),
    missDSpaceSum: zeros(NS), missDSpaceN: zeros(NS),
    missRetain1K: zeros(NS), missRetain1N: zeros(NS),
    missRetain2K: zeros(NS), missRetain2N: zeros(NS),
    winOverrunSum: zeros(NS), winOverrunN: zeros(NS),
    motionLunges: zeros(3), motionWins: zeros(3), turnLunges: 0, turnWins: 0,
    turnovers: r.turnoversTotal, segments: r.segmentsTotal,
    segmentTickSum: sum(r.segmentTickList),
    duelSpellTickSum: 0, duelSpellN: 0, duelSpellAfterSum: 0, duelSpellAfterN: 0,
    duelsTotal: r.duels.length, winsTotal: r.duels.filter((d) => d.outcome === 'win').length,
    refusalTicks: r.refusalTicks, proximityTicks: r.proximityTicks,
    slideEvents: r.slideEvents, slideWins: r.slideWins, grabEvents: r.grabEvents,
    smotherMissEvents: r.smotherMissEvents, gkAerialEvents: r.gkAerialEvents,
    unclassifiedJumps: r.unclassifiedJumps,
    engineTackleDelta: r.engineTackleDelta, outOfRadiusDuels: r.outOfRadiusDuels,
    outOfRadiusUnwhistled: r.outOfRadiusUnwhistled,
    whistledExcluded: r.duels.filter((d) => d.whistled).length,
    duelsTabulated: r.duels.filter((d) => !d.whistled).length,
    goalsFromScore: r.goalsFromScore, deadBallTicks: r.deadBallTicks,
    segmentTicks: r.segmentTicks, looseGapTicks: r.looseGapTicks,
    assignedTicksSum: r.assignedTicksSum, spanOrderViolations: r.spanOrderViolations,
    ocBodyLunges: 0, ocBodyWins: 0,
    carrierSpeedSum: 0, carrierSpeedN: 0, takerSpeedSum: 0, takerSpeedN: 0,
  };
  for (const d of r.duels) {
    if (d.whistled) continue; // the whistle moved the world — its geometry is not the duel's
    const s = d.speedBin; const a = d.angleBin; const f = d.phiBin;
    c.lunges[s][a]++;
    c.lungesPhi[s][f]++;
    c.motionLunges[d.motion]++;
    if (d.turning) c.turnLunges++;
    c.carrierSpeedSum += d.carrierSpeed; c.carrierSpeedN++;
    c.takerSpeedSum += d.speed; c.takerSpeedN++;
    if (d.speed >= d.vStarBody) { c.ocBodyLunges++; if (d.outcome === 'win') c.ocBodyWins++; }
    if (d.spellTicksTotal !== null) { c.duelSpellTickSum += d.spellTicksTotal; c.duelSpellN++; }
    if (d.spellTicksAfter !== null) { c.duelSpellAfterSum += d.spellTicksAfter; c.duelSpellAfterN++; }
    if (d.outcome === 'win') {
      c.wins[s][a]++;
      c.winsPhi[s][f]++;
      c.motionWins[d.motion]++;
      if (d.turning) c.turnWins++;
      if (d.overrun !== null) { c.winOverrunSum[s] += d.overrun; c.winOverrunN[s]++; }
    } else {
      c.missN[s]++;
      if (d.overrun !== null) { c.missOverrunSum[s] += d.overrun; c.missOverrunN[s]++; }
      if (d.dDist1 !== null) { c.missDDistSum[s] += d.dDist1; c.missDDistN[s]++; }
      if (d.dSpace1 !== null) { c.missDSpaceSum[s] += d.dSpace1; c.missDSpaceN[s]++; }
      if (d.retain1 !== null) { c.missRetain1N[s]++; if (d.retain1) c.missRetain1K[s]++; }
      if (d.retain2 !== null) { c.missRetain2N[s]++; if (d.retain2) c.missRetain2K[s]++; }
    }
  }
  return c;
};

/* ========================================================================== */
/* §8 THE BATTERY                                                              */
/* ========================================================================== */
/** the frozen N rule, computed in-probe from the committed smoke's two sizing numbers. */
const sizingFrom = (s: { rarestCellEventsPerMatch: number; msPerMatch: number })
: { n: number; wallTerm: number; precisionTerm: number | null; precisionUnbounded: boolean;
    binding: string; projectedHours: number } => {
  const unbounded = !(s.rarestCellEventsPerMatch > 0);
  const precisionTerm = unbounded ? null
    : Math.max(N_FLOOR, Math.ceil(Math.ceil(RARE_CELL_EVENTS / s.rarestCellEventsPerMatch) / N_STEP) * N_STEP);
  const wallTerm = Math.max(N_FLOOR, Math.floor(
    (WALL_BUDGET_HOURS * 3600 * 1000) / (s.msPerMatch * ARMS_COUNT * XDET_FACTOR),
  ));
  const n = Math.min(...[precisionTerm, wallTerm, SEED_ROOM].filter((x): x is number => x !== null));
  const binding = n === precisionTerm ? 'precision'
    : n === wallTerm ? `wall${unbounded ? ' (precision term UNBOUNDED — the zero-event clause)' : ''}`
      : 'seed-room cap';
  return {
    n, wallTerm, precisionTerm, precisionUnbounded: unbounded, binding,
    projectedHours: (n * s.msPerMatch * ARMS_COUNT * XDET_FACTOR) / 3600000,
  };
};

const smokeCommitted = MODE === 'full' && !IS_PREFLIGHT && existsSync(SMOKE_PATH)
  ? readJson(SMOKE_PATH) : null;
const smokeSizing = smokeCommitted === null ? null
  : (smokeCommitted.sizing as { rarestCellEventsPerMatch: number; msPerMatch: number });
const derived = smokeSizing === null
  ? sizingFrom({ rarestCellEventsPerMatch: 0, msPerMatch: PRIOR_MS_PER_MATCH })
  : sizingFrom(smokeSizing);
const N = IS_PREFLIGHT ? (N_ENV ?? 4) : (MODE === 'smoke' ? SMOKE_N : derived.n);
const RUN_BASE = IS_PREFLIGHT ? GUARD_BASE : (MODE === 'smoke' ? SMOKE_BASE : CENSUS_BASE);
const seedOf = (i: number): number => RUN_BASE + i;

const PROBE_SRC_SHA = sha(readFileSync('scripts/probes/cb-c0-dispossession-census.ts', 'utf8'));
const DESIGN_TAG = `${N}-${MODE}${IS_PREFLIGHT ? '-preflight' : ''}-${PROBE_SRC_SHA.slice(0, 12)}`;
const loadCheckpoint = (): Map<number, ClusterRow> => {
  const out = new Map<number, ClusterRow>();
  if (!RESUME || !existsSync(CHECKPOINT_PATH)) return out;
  for (const line of readFileSync(CHECKPOINT_PATH, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    try {
      const rec = JSON.parse(line) as { tag: string; row: ClusterRow };
      if (rec.tag === DESIGN_TAG) out.set(rec.row.seed, rec.row);
    } catch { /* a torn line is simply not resumable */ }
  }
  return out;
};

process.stderr.write(`  [cbc0] ${MODE} — N ${N} · seeds ${seedOf(0)}..${seedOf(N - 1)}\n`);
const done = loadCheckpoint();
const clusters: ClusterRow[] = [];
const tWalk0 = Date.now();
let walkedFresh = 0;
for (let i = 0; i < N; i++) {
  const seed = seedOf(i);
  const cached = done.get(seed);
  if (cached !== undefined) { clusters.push(cached); continue; }
  const row = clusterOf(seed);
  clusters.push(row);
  walkedFresh++;
  appendFileSync(CHECKPOINT_PATH, `${JSON.stringify({ tag: DESIGN_TAG, row })}\n`);
  if (walkedFresh % 25 === 0) {
    process.stderr.write(`  [cbc0] pass A ${i + 1}/${N} (${((Date.now() - tWalk0) / 1000).toFixed(0)}s)\n`);
  }
}
const msPerMatchMeasured = walkedFresh > 0 ? (Date.now() - tWalk0) / walkedFresh : PRIOR_MS_PER_MATCH;
const passAMs = Date.now() - tWalk0;

/* ---- X-DET pass B: a SECOND independent walk, NEVER resumed ---- */
const tDet0 = Date.now();
const digestOf = (rows: readonly ClusterRow[]): string => sha(canonical(rows));
const digestA = digestOf(clusters);
const clustersB: ClusterRow[] = [];
for (let i = 0; i < N; i++) clustersB.push(clusterOf(seedOf(i)));
const digestB = digestOf(clustersB);
const xDetMs = Date.now() - tDet0;

/* ========================================================================== */
/* §9 THE ESTIMATOR — ONE shared cluster-bootstrap index matrix (#20/#256.3)   */
/* ========================================================================== */
const bootRng = new Rng(STATS_BASE);
const bootIdx: number[][] = Array.from({ length: BOOTSTRAP }, () =>
  Array.from({ length: clusters.length }, () => Math.floor(bootRng.next() * clusters.length)));
const bootRatio = (num: readonly number[], den: readonly number[]): [number, number] => {
  const out: number[] = [];
  for (const idx of bootIdx) {
    let n = 0; let d = 0;
    for (const j of idx) { n += num[j]; d += den[j]; }
    out.push(d > 0 ? n / d : Number.NaN);
  }
  const ok = out.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (ok.length === 0) return [Number.NaN, Number.NaN];
  const q = (p: number): number => ok[Math.min(ok.length - 1, Math.max(0, Math.floor(p * (ok.length - 1))))];
  return [round(q(0.025), 6), round(q(0.975), 6)];
};
/** the PAIRED difference of two ratios on the SAME resampled clusters (the #246 predicates). */
const bootRatioGap = (
  n1: readonly number[], d1: readonly number[], n2: readonly number[], d2: readonly number[],
): { point: number; ci95: [number, number]; verdict: string } => {
  const t1 = sum(n1) / sum(d1); const t2 = sum(n2) / sum(d2);
  const point = t1 - t2;
  const out: number[] = [];
  for (const idx of bootIdx) {
    let a = 0; let b = 0; let c = 0; let e = 0;
    for (const j of idx) { a += n1[j]; b += d1[j]; c += n2[j]; e += d2[j]; }
    if (b > 0 && e > 0) out.push(a / b - c / e);
  }
  const ok = out.sort((x, y) => x - y);
  if (ok.length === 0) return { point: Number.NaN, ci95: [Number.NaN, Number.NaN], verdict: 'UNRESOLVED' };
  const q = (p: number): number => ok[Math.min(ok.length - 1, Math.max(0, Math.floor(p * (ok.length - 1))))];
  const ci: [number, number] = [round(q(0.025), 6), round(q(0.975), 6)];
  const verdict = ci[0] > 0 ? 'POSITIVE' : ci[1] < 0 ? 'NEGATIVE' : 'UNRESOLVED';
  return { point: round(point, 6), ci95: ci, verdict };
};
/** the paired difference of two MEANS (sum/count form) on the same resampled clusters. */
const bootMeanGap = (
  s1: readonly number[], c1: readonly number[], s2: readonly number[], c2: readonly number[],
): { point: number; ci95: [number, number]; verdict: string } => bootRatioGap(s1, c1, s2, c2);

/* --- the cell accessors ----------------------------------------------------- */
const cellLunge = (s: number, a: number): number[] => clusters.map((c) => c.lunges[s][a]);
const cellWin = (s: number, a: number): number[] => clusters.map((c) => c.wins[s][a]);
const cellRefuse = (s: number, a: number): number[] => clusters.map((c) => c.refusals[s][a]);
const rowLunge = (s: number): number[] => clusters.map((c) => sum(c.lunges[s]));
const rowWin = (s: number): number[] => clusters.map((c) => sum(c.wins[s]));
const colLunge = (a: number): number[] => clusters.map((c) => sum(c.lunges.map((r) => r[a])));
const colWin = (a: number): number[] => clusters.map((c) => sum(c.wins.map((r) => r[a])));
const colLungePhi = (f: number): number[] => clusters.map((c) => sum(c.lungesPhi.map((r) => r[f])));
const colWinPhi = (f: number): number[] => clusters.map((c) => sum(c.winsPhi.map((r) => r[f])));
const addV = (...vs: number[][]): number[] => vs[0].map((_, i) => sum(vs.map((v) => v[i])));

const rateRow = (n: readonly number[], d: readonly number[]): {
  k: number; n: number; rate: number; ci95: [number, number];
} => {
  const K = sum(n); const D = sum(d);
  return { k: K, n: D, rate: D > 0 ? round(K / D, 6) : Number.NaN, ci95: D > 0 ? bootRatio(n, d) : [Number.NaN, Number.NaN] };
};

/* ========================================================================== */
/* §10 THE TABLES                                                             */
/* ========================================================================== */
const speedRows = Array.from({ length: NS }, (_, s) => ({
  bin: SPEED_LABELS[s],
  loEdge: round(s === 0 ? 0 : SPEED_CUTS[s - 1], 6),
  hiEdge: s === NS - 1 ? null : round(SPEED_CUTS[s], 6),
  ...rateRow(rowWin(s), rowLunge(s)),
  refusals: sum(clusters.map((c) => sum(c.refusals[s]))),
}));
const angleRows = Array.from({ length: NA }, (_, a) => ({
  bin: ANGLE_LABELS[a],
  loEdge: round(a === 0 ? 0 : ANGLE_CUTS[a - 1], 6),
  hiEdge: a === NA - 1 ? round(Math.PI, 6) : round(ANGLE_CUTS[a], 6),
  ...rateRow(colWin(a), colLunge(a)),
  refusals: sum(clusters.map((c) => sum(c.refusals.map((r) => r[a])))),
}));
const phiRows = Array.from({ length: NPHI }, (_, f) => ({
  bin: PHI_LABELS[f],
  ...rateRow(colWinPhi(f), colLungePhi(f)),
  refusals: sum(clusters.map((c) => sum(c.refusalsPhi.map((r) => r[f])))),
}));
const cellRows = Array.from({ length: NS }, (_, s) => Array.from({ length: NA }, (_, a) => ({
  speed: SPEED_LABELS[s], angle: ANGLE_LABELS[a],
  ...rateRow(cellWin(s, a), cellLunge(s, a)),
  refusals: sum(cellRefuse(s, a)),
}))).flat();
/** ⭐ THE PRIMARY GRID: speed × approach direction — the cell the N rule's rarest event lives in. */
const cellRowsPhi = Array.from({ length: NS }, (_, s) => Array.from({ length: NPHI }, (_, f) => ({
  speed: SPEED_LABELS[s], approach: PHI_LABELS[f],
  ...rateRow(clusters.map((c) => c.winsPhi[s][f]), clusters.map((c) => c.lungesPhi[s][f])),
  refusals: sum(clusters.map((c) => c.refusalsPhi[s][f])),
}))).flat();
const motionRows = Array.from({ length: 3 }, (_, mi) => ({
  state: MOTION_LABELS[mi],
  ...rateRow(clusters.map((c) => c.motionWins[mi]), clusters.map((c) => c.motionLunges[mi])),
}));
const turningRow = {
  state: 'turning-hard (|Δheading| ≥ half the turn cap)',
  ...rateRow(clusters.map((c) => c.turnWins), clusters.map((c) => c.turnLunges)),
};

/* --- the OVERCOMMITMENT contrast: s4 vs the CONTROLLED classes s0+s1 -------- */
const OC = NS - 1;
const ocLunge = rowLunge(OC); const ocWin = rowWin(OC);
const ctrlLunge = addV(rowLunge(0), rowLunge(1));
const ctrlWin = addV(rowWin(0), rowWin(1));
const ocRow = { class: 'OVERCOMMITTED (v ≥ v*)', ...rateRow(ocWin, ocLunge) };
const ctrlRow = { class: 'CONTROLLED (v < v*/2)', ...rateRow(ctrlWin, ctrlLunge) };

/* --- the PUNISHMENT battery: what a MISS costs, by arrival speed ------------ */
const missRows = Array.from({ length: NS }, (_, s) => ({
  bin: SPEED_LABELS[s],
  misses: sum(clusters.map((c) => c.missN[s])),
  overrunM: (() => {
    const r = rateRow(clusters.map((c) => c.missOverrunSum[s]), clusters.map((c) => c.missOverrunN[s]));
    return { mean: r.rate, ci95: r.ci95, n: r.n };
  })(),
  dSeparationM: (() => {
    const r = rateRow(clusters.map((c) => c.missDDistSum[s]), clusters.map((c) => c.missDDistN[s]));
    return { mean: r.rate, ci95: r.ci95, n: r.n };
  })(),
  dSpaceM: (() => {
    const r = rateRow(clusters.map((c) => c.missDSpaceSum[s]), clusters.map((c) => c.missDSpaceN[s]));
    return { mean: r.rate, ci95: r.ci95, n: r.n };
  })(),
  retain1: rateRow(clusters.map((c) => c.missRetain1K[s]), clusters.map((c) => c.missRetain1N[s])),
  retain2: rateRow(clusters.map((c) => c.missRetain2K[s]), clusters.map((c) => c.missRetain2N[s])),
  winOverrunM: (() => {
    const r = rateRow(clusters.map((c) => c.winOverrunSum[s]), clusters.map((c) => c.winOverrunN[s]));
    return { mean: r.rate, ci95: r.ci95, n: r.n };
  })(),
}));

/* ========================================================================== */
/* §11 ⭐ THE #246 REALITY-SHAPE CHECK — PRE-REGISTERED (see the stage doc)     */
/* ========================================================================== */
/**
 * The shapes below were written into this probe and into the stage doc's FROZEN half BEFORE any
 * battery was read. Real football is cited as a SHAPE ONLY (VISION §3 — 常数永不进口).
 *  R1  a defender who arrives OVERCOMMITTED wins the ball LESS often than one who arrives under
 *      control                                       ⇒ EXPECT NEGATIVE (take-rate gap oc − ctrl)
 *  R2  a MISSED overcommitted challenge costs MORE: the carrier is more likely to still have the
 *      ball 2 s later                                ⇒ EXPECT POSITIVE (retain2 gap oc − ctrl)
 *  R3  a challenge from BEHIND wins the ball less often than one from the FRONT
 *                                                    ⇒ EXPECT NEGATIVE (behind − front)
 *  R4  a beaten defender is CARRIED THROUGH: his separation from the carrier grows more when he
 *      arrived fast                                  ⇒ EXPECT POSITIVE (Δsep gap oc − ctrl)
 * ⭐ AND THE ENGINE-EXPECTED SHAPE, from the mechanism itself (stated ex ante, and the reason
 * this census exists): the take probability's own expression (mechanics.ts, the `let p = …` block)
 * contains NO term derived from the TAKER's speed, heading or motion state — so E1 predicts the
 * take rate is FLAT in the taker's approach geometry, and any gradient that IS observed is
 * confounding (which carriers get challenged at speed), not a mechanism. G-GEOMETRY-BLIND proves
 * the premise from the engine's own source; the CI's below measure the consequence.
 * ⚠ An inversion of a REALITY shape is PUBLISHED as measured and ROUTED to the 街机偏离 test
 * (#246); it is NEVER corrected into the table, and this probe adjudicates nothing (#203).
 */
const shapeVerdict = (g: { verdict: string }, expect: 'POSITIVE' | 'NEGATIVE'): string =>
  (g.verdict === 'UNRESOLVED' ? 'UNRESOLVED'
    : g.verdict === expect ? 'RESOLVED-CONFIRM' : 'RESOLVED-INVERT');

const gapR1 = bootRatioGap(ocWin, ocLunge, ctrlWin, ctrlLunge);
const gapR2 = bootRatioGap(
  clusters.map((c) => c.missRetain2K[OC]), clusters.map((c) => c.missRetain2N[OC]),
  clusters.map((c) => c.missRetain2K[0] + c.missRetain2K[1]),
  clusters.map((c) => c.missRetain2N[0] + c.missRetain2N[1]),
);
/** R3 lives on the APPROACH-DIRECTION axis: chasing (φ ≈ 0) − head-on (φ ≈ π). */
const gapR3 = bootRatioGap(colWinPhi(0), colLungePhi(0), colWinPhi(2), colLungePhi(2));
/** the bearing-axis reading is published beside it (structurally degenerate — see §DEV). */
const gapR3bearing = bootRatioGap(colWin(2), colLunge(2), colWin(0), colLunge(0));
const gapR4 = bootMeanGap(
  clusters.map((c) => c.missDDistSum[OC]), clusters.map((c) => c.missDDistN[OC]),
  clusters.map((c) => c.missDDistSum[0] + c.missDDistSum[1]),
  clusters.map((c) => c.missDDistN[0] + c.missDDistN[1]),
);
const shapes = [
  { id: 'R1', claim: 'overcommitted arrivals take LESS often than controlled ones',
    expect: 'NEGATIVE', ...gapR1, shapeVerdict: shapeVerdict(gapR1, 'NEGATIVE') },
  { id: 'R2', claim: 'a MISSED overcommitted challenge is punished: the carrier retains at 2 s more often',
    expect: 'POSITIVE', ...gapR2, shapeVerdict: shapeVerdict(gapR2, 'POSITIVE') },
  { id: 'R3', claim: 'a CHASING challenge (φ≈0, from behind) takes less often than a HEAD-ON one '
      + '(φ≈π, the defender getting in front and facing the carrier)',
    expect: 'NEGATIVE', ...gapR3, shapeVerdict: shapeVerdict(gapR3, 'NEGATIVE') },
  { id: 'R4', claim: 'a beaten fast arrival is CARRIED THROUGH: separation grows more',
    expect: 'POSITIVE', ...gapR4, shapeVerdict: shapeVerdict(gapR4, 'POSITIVE') },
];
const inversionPresent = shapes.some((s) => s.shapeVerdict === 'RESOLVED-INVERT');

/* --- THE PUNISHMENT VERDICT (mechanical, never adjudicating) ---------------- */
const punishmentSignals = [
  { name: 'take-rate penalty for arriving overcommitted (R1)', gap: gapR1, punishes: gapR1.verdict === 'NEGATIVE' },
  { name: 'carrier retention after a missed overcommitted dive (R2)', gap: gapR2, punishes: gapR2.verdict === 'POSITIVE' },
  { name: 'separation gained by the carrier after the miss (R4)', gap: gapR4, punishes: gapR4.verdict === 'POSITIVE' },
];
const punishedAnywhere = punishmentSignals.some((s) => s.punishes);

/* ========================================================================== */
/* §12 CHURN LINKAGE                                                          */
/* ========================================================================== */
const totalTicksAll = sum(clusters.map((c) => c.totalTicks));
const churn = {
  matches: clusters.length,
  simSecondsPerMatch: round(mean(clusters.map((c) => c.simSeconds)), 4),
  turnoversPerMatch: round(mean(clusters.map((c) => c.turnovers)), 4),
  secondsPerTurnover: round(mean(clusters.map((c) => c.simSeconds))
    / Math.max(1e-9, mean(clusters.map((c) => c.turnovers))), 4),
  duelsPerMatch: round(mean(clusters.map((c) => c.duelsTotal)), 4),
  winsPerMatch: round(mean(clusters.map((c) => c.winsTotal)), 4),
  refusalTicksPerMatch: round(mean(clusters.map((c) => c.refusalTicks)), 4),
  proximityTicksPerMatch: round(mean(clusters.map((c) => c.proximityTicks)), 4),
  /** THE BASELINE SPELL: every closed possession segment, in ticks and seconds. */
  meanSpellTicks: (() => {
    const r = rateRow(clusters.map((c) => c.segmentTickSum), clusters.map((c) => c.segments));
    return { mean: r.rate, meanSeconds: round(r.rate * DT, 4), ci95: r.ci95, segments: r.n };
  })(),
  /** THE DUELLED SPELL: the length of the spell a duel event sits inside. */
  meanDuelledSpellTicks: (() => {
    const r = rateRow(clusters.map((c) => c.duelSpellTickSum), clusters.map((c) => c.duelSpellN));
    return { mean: r.rate, meanSeconds: round(r.rate * DT, 4), ci95: r.ci95, duels: r.n };
  })(),
  /** THE TAIL: how much of that spell is left AFTER the duel. */
  meanSpellTicksAfterDuel: (() => {
    const r = rateRow(clusters.map((c) => c.duelSpellAfterSum), clusters.map((c) => c.duelSpellAfterN));
    return { mean: r.rate, meanSeconds: round(r.rate * DT, 4), ci95: r.ci95, duels: r.n };
  })(),
  spellVsDuelledGap: bootRatioGap(
    clusters.map((c) => c.duelSpellTickSum), clusters.map((c) => c.duelSpellN),
    clusters.map((c) => c.segmentTickSum), clusters.map((c) => c.segments),
  ),
  slideEventsPerMatch: round(mean(clusters.map((c) => c.slideEvents)), 4),
  slideWinsPerMatch: round(mean(clusters.map((c) => c.slideWins)), 4),
  grabEventsPerMatch: round(mean(clusters.map((c) => c.grabEvents)), 4),
  goalsPerMatch: round(mean(clusters.map((c) => c.goalsFromScore)), 4),
};

/* ========================================================================== */
/* §13 THE GATES — frozen ex ante, ALL computed in-probe (#181.2)             */
/*     every composite gate is a FUNCTION so G-MUTANTS can RE-INVOKE it        */
/* ========================================================================== */
type GateOut = { pass: boolean; conjuncts: Record<string, boolean>; [k: string]: unknown };
const allTrue = (c: Record<string, boolean>): boolean => Object.values(c).every(Boolean);

/* --- G-CONST-TRACE ---------------------------------------------------------- */
interface ConstIn {
  rTackle: number; missCooldown: number; missStun: number; winCooldown: number;
  accel: number; driveNorm: number; cone: number; turnRate: number; dt: number;
  slide: number; grab: number; smother: number; gkAerial: number;
  lungeCost: number; pFloor: number; pCeil: number;
}
const CONST_IN: ConstIn = {
  rTackle: R_TACKLE, missCooldown: MISS_COOLDOWN_S, missStun: MISS_STUN_S,
  winCooldown: WIN_COOLDOWN_S, accel: ACCEL, driveNorm: DRIVE_NORM, cone: CONE_RAD,
  turnRate: TURN_RATE, dt: DT, slide: SLIDE_COOLDOWN_S, grab: GRAB_COOLDOWN_S,
  smother: SMOTHER_COOLDOWN_S, gkAerial: GK_AERIAL_COOLDOWN_S,
  lungeCost: TACKLE_LUNGE_COST, pFloor: P_FLOOR, pCeil: P_CEIL,
};
const gConstTraceFn = (v: ConstIn): GateOut => {
  const finite = (x: number): boolean => Number.isFinite(x) && x > 0;
  const conjuncts = {
    rTackleFromSource: finite(v.rTackle) && v.rTackle === extractNum(TRY_TACKLES_SRC, /if \(d < ([\d.]+) && d < best\)/),
    missPriceFromSource: finite(v.missCooldown) && finite(v.missStun)
      && v.missCooldown === extractNum(MISS_BRANCH_SRC, /tackler\.tackleCooldown = ([\d.]+);/)
      && v.missStun === extractNum(MISS_BRANCH_SRC, /tackler\.stunTimer = ([\d.]+);/),
    winPriceFromSource: finite(v.winCooldown) && v.winCooldown !== v.missCooldown,
    accelFromSource: finite(v.accel) && v.accel === extractNum(PLAYER_SRC, /^const ACCEL = ([\d.]+);/m),
    driveNormFromSource: finite(v.driveNorm)
      && v.driveNorm === extractNum(TRY_TACKLES_SRC, /clamp\(len\(owner\.vel\) \/ (\d+), 0, 1\)/),
    coneFromSource: finite(v.cone)
      && v.cone === extractNum(TRY_TACKLES_SRC, /rotate\(wide, match\.rng\.range\(-([\d.]+), [\d.]+\)\)/),
    turnRateImported: v.turnRate === TURN_RATE && finite(v.turnRate),
    dtImported: v.dt === DT && finite(v.dt),
    otherCooldownsDistinct: new Set([v.winCooldown, v.missCooldown, v.slide, v.grab]).size === 4,
    smotherTraced: finite(v.smother),
    /** the SIXTH and last writer of `tackleCooldown` in the whole engine — the keeper's aerial
     *  claim — is traced too, so no cooldown jump can be silently misread as a challenge. */
    gkAerialTraced: finite(v.gkAerial)
      && v.gkAerial === extractNum(MECH_SRC, /gk\.tackleCooldown = (0\.9);/)
      && (MECH_SRC.match(/\.tackleCooldown = [\d.]+;/g) ?? []).length === 6,
    lungeCostImported: v.lungeCost === TACKLE_LUNGE_COST && finite(v.lungeCost),
    clampTraced: finite(v.pFloor) && finite(v.pCeil) && v.pFloor < v.pCeil,
  };
  return {
    pass: allTrue(conjuncts), conjuncts,
    traced: {
      R_TACKLE: { value: v.rTackle, at: `${MECH_SRC_PATH}:${R_TACKLE_LINE}` },
      MISS_COOLDOWN_S: { value: v.missCooldown, at: `${MECH_SRC_PATH}:${MISS_CD_LINE}` },
      MISS_STUN_S: { value: v.missStun, at: `${MECH_SRC_PATH}:${MISS_STUN_LINE}` },
      WIN_COOLDOWN_S: { value: v.winCooldown, at: `${MECH_SRC_PATH}:${WIN_CD_LINE}` },
      CARRIER_STUN_S: { value: CARRIER_STUN_S, at: `${MECH_SRC_PATH}:${CARRIER_STUN_LINE}` },
      ACCEL: { value: v.accel, at: `${PLAYER_SRC_PATH}:${ACCEL_LINE}` },
      TURN_RATE: { value: v.turnRate, at: `${PLAYER_SRC_PATH}:${lineOf(PLAYER_LINES, /^export const TURN_RATE = /)} (imported)` },
      DT: { value: v.dt, at: 'src/sim/constants.ts (imported)' },
      DRIVE_NORM: { value: v.driveNorm, at: `${MECH_SRC_PATH}:${DRIVE_NORM_LINE}` },
      CONE_RAD: { value: v.cone, at: `${MECH_SRC_PATH}:${CONE_LINE}` },
      TACKLE_LUNGE_COST: { value: v.lungeCost, at: 'src/sim/constants.ts (imported)' },
      P_CLAMP: { value: [v.pFloor, v.pCeil], at: `${MECH_SRC_PATH}:${P_CLAMP_LINE}` },
    },
  };
};
const gConstTrace = gConstTraceFn(CONST_IN);

/* --- G-BINS-DERIVED --------------------------------------------------------- */
interface BinsIn { vStar: number; speedCuts: number[]; angleCuts: number[]; qv: number; qpsi: number;
  accelCut: number; turnCut: number; stunTicks: number }
const BINS_IN: BinsIn = {
  vStar: V_STAR, speedCuts: SPEED_CUTS, angleCuts: ANGLE_CUTS, qv: Q_V, qpsi: Q_PSI,
  accelCut: ACCEL_CUT, turnCut: TURN_CUT, stunTicks: STUN_TICKS,
};
const gBinsDerivedFn = (v: BinsIn): GateOut => {
  const conjuncts = {
    vStarIsBrakingIdentity: Math.abs(v.vStar - Math.sqrt(2 * ACCEL * R_TACKLE)) < 1e-12,
    vStarBrakesToRadius: Math.abs((v.vStar ** 2) / (2 * ACCEL) - R_TACKLE) < 1e-9,
    speedCutsAreQuarters: v.speedCuts.length === 4
      && v.speedCuts.every((c, i) => Math.abs(c - ((i + 1) / 4) * v.vStar) < 1e-12),
    speedCutsOrdered: v.speedCuts.every((c, i) => i === 0 || c > v.speedCuts[i - 1]),
    angleCutsFromCone: v.angleCuts.length === 2
      && v.angleCuts[0] === CONE_RAD && Math.abs(v.angleCuts[1] - (Math.PI - CONE_RAD)) < 1e-12,
    angleCutsOrdered: v.angleCuts[0] < v.angleCuts[1] && v.angleCuts[1] < Math.PI,
    quantaAreTheBodys: Math.abs(v.qv - ACCEL * DT) < 1e-12 && Math.abs(v.qpsi - TURN_RATE * DT) < 1e-12,
    motionCutsAreHalfQuanta: Math.abs(v.accelCut - 0.5 * v.qv) < 1e-12
      && Math.abs(v.turnCut - 0.5 * v.qpsi) < 1e-12,
    stunHorizonIsTheEnginesStun: v.stunTicks === Math.round(MISS_STUN_S / DT) && v.stunTicks > 0,
  };
  return {
    pass: allTrue(conjuncts), conjuncts,
    arithmetic: {
      vStar: `sqrt(2 × ACCEL × R_TACKLE) = sqrt(2 × ${ACCEL} × ${R_TACKLE}) = sqrt(${round(2 * ACCEL * R_TACKLE, 6)}) = ${round(V_STAR, 6)} m/s`,
      brakingDistanceAtVStar: `v*² / (2 × ACCEL) = ${round((V_STAR ** 2) / (2 * ACCEL), 6)} m = R_TACKLE`,
      speedCuts: v.speedCuts.map((c) => round(c, 6)),
      angleCuts: v.angleCuts.map((c) => round(c, 6)),
      qv: round(v.qv, 6), qpsi: round(v.qpsi, 6),
      stunTicks: v.stunTicks, h1Ticks: H1_TICKS, h2Ticks: H2_TICKS,
      horizonProvenance: `H1 = MISS_COOLDOWN_S / DT = ${MISS_COOLDOWN_S} / ${round(DT, 8)} = ${H1_TICKS} ticks (${H1_S} s); H2 = 2 × H1`,
      perBodyVStarRange: [round(Math.sqrt(2 * ACCEL * 0.9 * R_TACKLE), 6),
        round(Math.sqrt(2 * ACCEL * 1.1 * R_TACKLE), 6)],
    },
  };
};
const gBinsDerived = gBinsDerivedFn(BINS_IN);

/* --- ⭐⭐ G-GEOMETRY-BLIND: the STRUCTURAL FINDING, proved from the source ---- */
interface BlindIn { takeExpr: string; missBranch: string; fnSrc: string }
const BLIND_IN: BlindIn = { takeExpr: TAKE_P_EXPR, missBranch: MISS_BRANCH_SRC, fnSrc: TRY_TACKLES_SRC };
const TAKER_MOTION_NEEDLES = ['tackler.vel', 'tackler.heading', 'tackler.speed', 'o.vel', 'o.heading'];
const gGeometryBlindFn = (v: BlindIn): GateOut => {
  const strip = (s: string): string => s.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const expr = strip(v.takeExpr);
  const body = strip(v.fnSrc);
  const missArm = strip(v.missBranch);
  const conjuncts = {
    exprFound: expr.length > 0 && expr.includes('let p =') && expr.includes('clamp(p,'),
    /** ⭐ the take probability reads NO taker motion state at all. */
    noTakerMotionInExpr: TAKER_MOTION_NEEDLES.every((n) => !expr.includes(n)),
    /** ⭐ and none anywhere in the whole mechanic — its ONLY taker input is POSITION. */
    noTakerMotionInBody: TAKER_MOTION_NEEDLES.every((n) => !body.includes(n)),
    takerPositionIsRead: body.includes('o.pos') && body.includes('tackler.pos'),
    /** the ONE motion term in the expression is the CARRIER's own drive. */
    carrierDriveIsTheOnlyMotionTerm: expr.includes('drive') && expr.includes('owner.attrs.pace'),
    driveIsCarrierVelocity: body.includes(`clamp(len(owner.vel) / ${DRIVE_NORM}, 0, 1)`),
    /** ⭐⭐ the MISS branch writes NO position and NO velocity: there is no carry-through. */
    missWritesNoKinematics: !/\.pos\s*=|\.pos\.[xy]\s*=|\.vel\s*=|\.vel\.[xy]\s*=/.test(missArm),
    missWritesOnlyCooldownAndStun:
      /tackler\.tackleCooldown = /.test(missArm) && /tackler\.stunTimer = /.test(missArm)
      && (missArm.match(/tackler\.[a-zA-Z]+ =/g) ?? []).every((a) =>
        a === 'tackler.tackleCooldown =' || a === 'tackler.stunTimer ='),
    /** the outcome is a DICE ROLL on an attribute expression (layer-4's shape, named as found). */
    outcomeIsARoll: body.includes('match.rng.chance(p)'),
    /** the miss price is a CONSTANT — it cannot depend on how hard he dived. */
    missPriceIsConstant: /tackler\.tackleCooldown = [\d.]+;/.test(missArm)
      && /tackler\.stunTimer = [\d.]+;/.test(missArm),
  };
  return {
    pass: allTrue(conjuncts), conjuncts,
    finding: 'THE TAKE IS GEOMETRY-BLIND: `tryTackles` selects its tackler by DISTANCE alone and '
      + 'prices the duel from team aggression, the tackler\'s `defending`, and the CARRIER\'s '
      + 'dribbling/strength/pace×drive. The TAKER\'s speed, heading and motion state enter '
      + 'NOWHERE. A missed lunge writes only a cooldown and a stun — both CONSTANTS — so the '
      + 'engine has no carry-through and no speed-dependent price for diving in.',
    takeExpressionSource: expr.trim(),
    missBranchSource: missArm.trim(),
  };
};
const gGeometryBlind = gGeometryBlindFn(BLIND_IN);

/* --- G-DETECT --------------------------------------------------------------- */
interface DetectIn {
  duels: number; wins: number; slideWins: number; engineTackles: number;
  outOfRadius: number; outOfRadiusUnwhistled: number; whistled: number;
  unclassified: number; misses: number; allMisses: number; refusalTicks: number;
}
const DETECT_IN: DetectIn = {
  duels: sum(clusters.map((c) => c.duelsTotal)),
  wins: sum(clusters.map((c) => c.winsTotal)),
  slideWins: sum(clusters.map((c) => c.slideWins)),
  engineTackles: sum(clusters.map((c) => c.engineTackleDelta)),
  outOfRadius: sum(clusters.map((c) => c.outOfRadiusDuels)),
  outOfRadiusUnwhistled: sum(clusters.map((c) => c.outOfRadiusUnwhistled)),
  whistled: sum(clusters.map((c) => c.whistledExcluded)),
  unclassified: sum(clusters.map((c) => c.unclassifiedJumps)),
  misses: sum(clusters.map((c) => sum(c.missN))),
  allMisses: sum(clusters.map((c) => c.duelsTotal - c.winsTotal)),
  refusalTicks: sum(clusters.map((c) => c.refusalTicks)),
};
const gDetectFn = (v: DetectIn): GateOut => {
  const conjuncts = {
    /** ⭐ THE EXTERNAL IDENTITY: the engine's OWN tackle counter is incremented by exactly the two
     *  win branches this detector claims to see (standing + slide) — nothing else touches it. */
    winsTieToEngineCounter: v.wins + v.slideWins === v.engineTackles,
    /** ⭐ every duel whose tick was NOT interrupted by the whistle sits inside the challenge
     *  radius. The exceptions are exactly the whistled ones (a penalty award moves the ball to
     *  the spot, a sending-off parks the offender on the apron) and they are EXCLUDED from every
     *  geometry table rather than read at the restart's geometry. */
    everyUnwhistledDuelInsideTheChallengeRadius: v.outOfRadiusUnwhistled === 0,
    outOfRadiusIsAllWhistled: v.outOfRadius <= v.whistled,
    noUnclassifiedCooldownJump: v.unclassified === 0,
    winsPlusMissesArePartition: v.wins + v.allMisses === v.duels,
    nonVacuousDuels: v.duels > 0,
    nonVacuousWins: v.wins > 0,
    nonVacuousMisses: v.misses > 0,
    nonVacuousRefusals: v.refusalTicks > 0,
    nonVacuousEngineCounter: v.engineTackles > 0,
  };
  return { pass: allTrue(conjuncts), conjuncts, counts: { ...v } };
};
const gDetect = gDetectFn(DETECT_IN);

/* --- G-ACCOUNTING ----------------------------------------------------------- */
interface AcctIn {
  totalTicks: number; deadBall: number; segment: number; loose: number;
  assigned: number; spanViolations: number;
  cellLungeSum: number; phiLungeSum: number; duels: number; tabulated: number;
  cellWinSum: number; wins: number; missSum: number; misses: number; motionLungeSum: number; refusalCellSum: number; refusalTicks: number;
  proximity: number; retainMonotone: boolean;
  plantedAboveS0: number; plantedInS0: number; duelsAboveS0: number;
}
const ACCT_IN: AcctIn = {
  totalTicks: totalTicksAll,
  deadBall: sum(clusters.map((c) => c.deadBallTicks)),
  segment: sum(clusters.map((c) => c.segmentTicks)),
  loose: sum(clusters.map((c) => c.looseGapTicks)),
  assigned: sum(clusters.map((c) => c.assignedTicksSum)),
  spanViolations: sum(clusters.map((c) => c.spanOrderViolations)),
  cellLungeSum: sum(clusters.map((c) => sum(c.lunges.map(sum)))),
  phiLungeSum: sum(clusters.map((c) => sum(c.lungesPhi.map(sum)))),
  duels: sum(clusters.map((c) => c.duelsTotal)),
  tabulated: sum(clusters.map((c) => c.duelsTabulated)),
  cellWinSum: sum(clusters.map((c) => sum(c.wins.map(sum)))),
  wins: sum(clusters.map((c) => sum(c.wins.map(sum)))),
  missSum: sum(clusters.map((c) => sum(c.missN))),
  misses: sum(clusters.map((c) => c.duelsTabulated - sum(c.wins.map(sum)))),
  motionLungeSum: sum(clusters.map((c) => sum(c.motionLunges))),
  refusalCellSum: sum(clusters.map((c) => sum(c.refusals.map(sum)))),
  refusalTicks: sum(clusters.map((c) => c.refusalTicks)),
  proximity: sum(clusters.map((c) => c.proximityTicks)),
  retainMonotone: clusters.every((c) => c.missRetain2N.every((n, i) => n <= c.missRetain1N[i])),
  plantedAboveS0: sum(clusters.map((c) => sum(c.lungesPhi.slice(1).map((r) => r[3])))),
  plantedInS0: sum(clusters.map((c) => c.lungesPhi[0][3])),
  duelsAboveS0: sum(clusters.map((c) => sum(c.lungesPhi.slice(1).map(sum)))),
};
const gAccountingFn = (v: AcctIn): GateOut => {
  const conjuncts = {
    tickPartition: v.totalTicks === v.deadBall + v.segment + v.loose,
    assignedEqualsSegment: v.assigned === v.segment,
    spanOrdered: v.spanViolations === 0,
    cellsCoverEveryTabulatedDuel: v.cellLungeSum === v.tabulated,
    approachCellsCoverEveryTabulatedDuel: v.phiLungeSum === v.tabulated,
    tabulatedPlusWhistledIsEveryDuel: v.tabulated <= v.duels,
    winCellsCoverEveryWin: v.cellWinSum === v.wins,
    missCellsCoverEveryMiss: v.missSum === v.misses,
    motionMarginalIsComplete: v.motionLungeSum === v.tabulated,
    refusalCellsCoverEveryRefusalTick: v.refusalCellSum === v.refusalTicks,
    /** ⭐ THE PROXIMITY PARTITION: a tick with an eligible candidate either LUNGES or REFUSES. */
    proximityPartition: v.proximity >= v.refusalTicks && v.proximity - v.refusalTicks >= 0,
    /** the 2 s horizon can only be reachable for fewer events than the 1 s one. */
    horizonMonotone: v.retainMonotone,
    /** ⭐ the PLANTED bin is defined by a speed below half a per-tick quantum, which lies inside
     *  the FIRST speed bin — so (s ≥ 1 × planted) is STRUCTURALLY EMPTY, and the N rule excludes
     *  those cells as inadmissible rather than reading a zero out of them. Proved, not asserted. */
    plantedOnlyInTheFirstSpeedBin: v.plantedAboveS0 === 0 && v.duelsAboveS0 > 0,
    nonVacuous: v.duels > 0 && v.totalTicks > 0 && v.refusalTicks > 0,
  };
  return { pass: allTrue(conjuncts), conjuncts, identities: { ...v } };
};
const gAccounting = gAccountingFn(ACCT_IN);

/* --- ⭐⭐ G-REPRO-DVC0: the loss semantics are DV-C0's, PROVED --------------- */
const dvc0 = readJson(DVC0_SMOKE_PATH);
const dvc0Census = (dvc0.result as { census: Record<string, unknown> }).census;
const dvc0Acct = dvc0Census.accounting as Record<string, number>;
const dvc0Primary = (dvc0Census.table as { isPrimary: boolean; byThird: { zone: string; turnovers: number }[] }[])
  .find((t) => t.isPrimary);
const dvc0Thirds: Record<string, number> = Object.fromEntries(
  (dvc0Primary?.byThird ?? []).map((r) => [r.zone, r.turnovers]));
process.stderr.write('  [cbc0] G-REPRO-DVC0: re-walking DV-C0\'s own committed smoke block…\n');
const reproRows = Array.from({ length: REPRO_DVC0_N }, (_, i) => walkOne(REPRO_DVC0_BASE + i));
const reproObserved: Record<string, number> = {
  totalTicks: sum(reproRows.map((r) => r.totalTicks)),
  deadBallTicks: sum(reproRows.map((r) => r.deadBallTicks)),
  segmentTicks: sum(reproRows.map((r) => r.segmentTicks)),
  looseGapTicks: sum(reproRows.map((r) => r.looseGapTicks)),
  assignedTicksSum: sum(reproRows.map((r) => r.assignedTicksSum)),
  spanOrderViolations: sum(reproRows.map((r) => r.spanOrderViolations)),
  goalsFromScore: sum(reproRows.map((r) => r.goalsFromScore)),
  turnoversTotal: sum(reproRows.map((r) => r.turnoversTotal)),
  own: sum(reproRows.map((r) => r.turnoversByThird.own)),
  middle: sum(reproRows.map((r) => r.turnoversByThird.middle)),
  final: sum(reproRows.map((r) => r.turnoversByThird.final)),
};
const reproExpected: Record<string, number> = {
  totalTicks: dvc0Acct.totalTicks, deadBallTicks: dvc0Acct.deadBallTicks,
  segmentTicks: dvc0Acct.segmentTicks, looseGapTicks: dvc0Acct.looseGapTicks,
  assignedTicksSum: dvc0Acct.assignedTicksSum, spanOrderViolations: dvc0Acct.spanOrderViolations,
  goalsFromScore: dvc0Acct.goalsFromScore, turnoversTotal: dvc0Acct.turnoversTotal,
  own: dvc0Thirds.own, middle: dvc0Thirds.middle, final: dvc0Thirds.final,
};
interface ReproIn { observed: Record<string, number>; expected: Record<string, number> }
const gReproDvc0Fn = (v: ReproIn): GateOut => {
  const keys = Object.keys(v.expected);
  const mismatches = keys.filter((k) => v.observed[k] !== v.expected[k]);
  const conjuncts: Record<string, boolean> = { fieldsPresent: keys.length === 11, noMismatch: mismatches.length === 0 };
  for (const k of keys) conjuncts[`match_${k}`] = v.observed[k] === v.expected[k];
  return {
    pass: allTrue(conjuncts), conjuncts,
    fieldsChecked: keys.length, mismatches: mismatches.length, mismatchedKeys: mismatches,
    block: `${REPRO_DVC0_BASE}..${REPRO_DVC0_BASE + REPRO_DVC0_N - 1}`,
    observed: v.observed, expected: v.expected,
  };
};
const gReproDvc0 = gReproDvc0Fn({ observed: reproObserved, expected: reproExpected });

/* --- G-WORLD (production, on a never-stepped match) -------------------------- */
const gWorldMatch = matchFor(GWORLD_SEED);
const gWorldConjuncts = prodConjuncts(gWorldMatch, GWORLD_SEED);
const gWorldFn = (c: Record<string, boolean>): GateOut => ({
  pass: allTrue(c), conjuncts: c,
  seed: GWORLD_SEED, note: 'read back on a freshly constructed match that is NEVER stepped',
});
const gWorld = gWorldFn(gWorldConjuncts);

/* --- G-SEED-DISJOINT / G-STATS-DISJOINT / G-CLEAN-INVOCATION / G-N ---------- */
const firstSeed = seedOf(0); const lastSeed = seedOf(N - 1);
interface SeedIn {
  blocks: { name: string; first: number; last: number; kind: 'fresh' | 'reserved' | 're-walk' }[];
  consumed: readonly { name: string; range: readonly [number, number] }[];
  band: readonly [number, number];
  layout: { core: number; coreN: number; guard: number; guardSpan: number; smoke: number;
    smokeN: number; gworld: number; census: number; room: number };
  first: number; last: number;
}
const SEED_IN: SeedIn = {
  consumed: CONSUMED,
  band: RESERVED_BAND,
  layout: {
    core: CORE_BASE, coreN: CORE_N, guard: GUARD_BASE, guardSpan: GUARD_SPAN,
    smoke: SMOKE_BASE, smokeN: SMOKE_N, gworld: GWORLD_SEED, census: CENSUS_BASE, room: SEED_ROOM,
  },
  first: firstSeed, last: lastSeed,
  blocks: [
    { name: 'the walked block', first: firstSeed, last: lastSeed, kind: IS_PREFLIGHT ? 'reserved' : 'fresh' },
    { name: 'core block (reserved)', first: CORE_BASE, last: CORE_BASE + CORE_N - 1, kind: 'reserved' },
    { name: 'exit-semantics guard block (reserved)', first: GUARD_BASE, last: GUARD_BASE + GUARD_SPAN - 1, kind: 'reserved' },
    { name: 'smoke battery (reserved)', first: SMOKE_BASE, last: SMOKE_BASE + SMOKE_N - 1, kind: 'reserved' },
    { name: 'census block + reserve (reserved)', first: CENSUS_BASE, last: CENSUS_BASE + SEED_ROOM - 1, kind: 'reserved' },
    { name: 'G-WORLD construction seed (never stepped)', first: GWORLD_SEED, last: GWORLD_SEED, kind: 'reserved' },
    { name: '⭐ G-REPRO-DVC0 re-walk (RECEIPT)', first: REPRO_DVC0_BASE, last: REPRO_DVC0_BASE + REPRO_DVC0_N - 1, kind: 're-walk' },
  ],
};
const gSeedDisjointFn = (v: SeedIn): GateOut => {
  const collide = (a: number, b: number): string[] => v.consumed
    .filter((c) => !(b < c.range[0] || a > c.range[1])).map((c) => c.name);
  const walked = v.blocks.map((b) => {
    const ledgerCollisions = collide(b.first, b.last);
    /** ⭐ THE INVERTED PREDICATE for a re-walk: it MUST collide, or it is not a receipt. */
    const ok = b.kind === 're-walk' ? ledgerCollisions.length > 0 : ledgerCollisions.length === 0;
    return { ...b, seeds: b.last - b.first + 1, ledgerCollisions, ok };
  });
  const L = v.layout;
  const inBand = v.first >= v.band[0] && v.last <= v.band[1];
  const routed = CLEAN_INVOCATION
    ? (MODE === 'smoke' ? v.first === L.smoke : v.first === L.census)
    : (v.first >= L.guard && v.last <= L.guard + L.guardSpan - 1);
  const ordered = L.core + L.coreN - 1 < L.guard && L.guard + L.guardSpan - 1 < L.smoke
    && L.smoke + L.smokeN - 1 < L.gworld && L.gworld < L.census
    && L.census + L.room - 1 <= v.band[1];
  const conjuncts = {
    everyBlockOk: walked.every((b) => b.ok),
    inReservedBand: inBand,
    routedCorrectly: routed,
    subBlocksOrderedAndDisjoint: ordered,
    ekc0cBandPresentInLedger: v.consumed.some((c) => c.range[0] === 12_461_000),
    dvc0SmokeBandPresentInLedger: v.consumed.some((c) => c.range[0] === 12_429_000),
    nonVacuous: walked.length === 7 && v.consumed.length > 50,
  };
  return { pass: allTrue(conjuncts), conjuncts, blocks: walked, ledgerEntries: v.consumed.length };
};
const gSeedDisjoint = gSeedDisjointFn(SEED_IN);

const STATS_FLOOR = 109_600; // ruling #265.4's floor
const STATS_GRID = 200; // the #163 step
const gStatsDisjointFn = (v: { base: number; published: readonly number[] }): GateOut => {
  const minGap = v.published.length === 0 ? Number.NaN
    : Math.min(...v.published.map((b) => Math.abs(v.base - b)));
  const conjuncts = {
    atOrAboveFloor: v.base >= STATS_FLOOR,
    onTheGrid: v.base % STATS_GRID === 0,
    gapAtLeastTheStep: minGap >= STATS_GRID,
    nonVacuousLedger: v.published.length > 10,
  };
  return { pass: allTrue(conjuncts), conjuncts, base: v.base, minGap, published: v.published.length };
};
const gStatsDisjoint = gStatsDisjointFn({ base: STATS_BASE, published: STATS_PUBLISHED_BASES });

const gCleanInvocationFn = (v: { preflight: boolean; reasons: string[]; out: string; resume: boolean }): GateOut => {
  const conjuncts = {
    noOverrideSet: !v.preflight,
    outIsCanonicalForACleanRun: v.preflight ? true : isCanonicalPath(v.out),
    preflightNeverCanonical: v.preflight ? !isCanonicalPath(v.out) : true,
  };
  return {
    pass: allTrue(conjuncts), conjuncts,
    preflight: v.preflight, reasons: v.reasons, outPath: v.out, resumeRequested: v.resume,
    note: 'ANY of CBC0_N / CBC0_SKIP_FP / CBC0_OUT makes the run a PREFLIGHT: it is routed onto '
      + 'the guard block, may never write a canonical repo path (checked at parse time AND at the '
      + 'write, on the RESOLVED absolute path) and TURNS THIS GATE RED so the census block stays '
      + 'virgin. CBC0_RESUME is NOT an override — pass B never resumes, so X-DET is the '
      + 'checkpoint\'s integrity proof — and it rides the UNHASHED envelope.',
  };
};
const gCleanInvocation = gCleanInvocationFn({
  preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS, out: OUT_PATH, resume: RESUME,
});

const gNDerivedFn = (v: { n: number; derivedN: number; mode: Mode; preflight: boolean }): GateOut => {
  const conjuncts = {
    ranTheFrozenN: v.preflight ? true : (v.mode === 'smoke' ? v.n === SMOKE_N : v.n === v.derivedN),
    nPositive: v.n > 0,
    withinSeedRoom: v.n <= SEED_ROOM,
  };
  return { pass: allTrue(conjuncts), conjuncts, ranN: v.n, derivedN: v.derivedN, sizing: derived };
};
const gNDerived = gNDerivedFn({ n: N, derivedN: derived.n, mode: MODE, preflight: IS_PREFLIGHT });

/* --- X-family --------------------------------------------------------------- */
let fpObserved = 'skipped';
let xFpProdPass = false;
if (SKIP_FP) { xFpProdPass = true; fpObserved = 'skipped (preflight)'; } else {
  process.stderr.write('  [cbc0] X-FP-PROD: re-deriving the production fingerprint…\n');
  const league = new League({ seed: FINGERPRINT_SEED });
  const out = runHeadless(league.toJSON() as Record<string, unknown>, {
    kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
  });
  fpObserved = createHash('sha256').update(JSON.stringify(out.league)).digest('hex');
  xFpProdPass = fpObserved === FINGERPRINT_BASELINE;
}
let head = ''; try { head = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(); } catch { head = 'git-unavailable'; }
let srcDiff = ''; try { srcDiff = execSync('git diff --stat -- src', { encoding: 'utf8' }).trim(); } catch { srcDiff = 'git-unavailable'; }

/* --- G-VALUES-UNREACHABLE --------------------------------------------------- */
const srcFiles: string[] = [];
const walkDir = (d: string): void => {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walkDir(p);
    else if (p.endsWith('.ts')) srcFiles.push(p);
  }
};
walkDir('src');
const needleValues: number[] = [
  ...speedRows.map((r) => r.rate), ...angleRows.map((r) => r.rate),
  ocRow.rate, ctrlRow.rate,
].filter((x) => Number.isFinite(x) && x > 0.001 && x < 0.999);
const needles = needleValues.flatMap((v) => [v.toFixed(5), (v * 100).toFixed(3)]);
const CONTROL_NEEDLE = 'tryTackles';
const gValuesUnreachableFn = (v: { files: string[]; needles: string[]; control: string }): GateOut => {
  let hits = 0; let controlFound = false;
  for (const f of v.files) {
    const txt = readFileSync(f, 'utf8');
    if (txt.includes(v.control)) controlFound = true;
    for (const n of v.needles) if (txt.includes(n)) hits++;
  }
  const conjuncts = {
    noHit: hits === 0,
    controlNeedleFound: controlFound,
    nonVacuousNeedleSet: v.needles.length >= 8,
    nonVacuousFileSet: v.files.length > 50,
  };
  return { pass: allTrue(conjuncts), conjuncts, filesScanned: v.files.length, needles: v.needles.length, hits };
};
const gValuesUnreachable = gValuesUnreachableFn({ files: srcFiles, needles, control: CONTROL_NEEDLE });

/* --- ⭐⭐ G-MUTANTS: every conjunct of every composite gate RE-INVOKES its own
 *      gate function on a MUTATED input, and must flip exactly that conjunct.  */
interface Mutant { gate: string; conjunct: string; flipped: boolean }
const mutants: Mutant[] = [];
const runMutant = (gate: string, conjunct: string, out: GateOut): void => {
  mutants.push({ gate, conjunct, flipped: out.conjuncts[conjunct] === false });
};
/* G-CONST-TRACE */
runMutant('gConstTrace', 'rTackleFromSource', gConstTraceFn({ ...CONST_IN, rTackle: R_TACKLE + 1 }));
runMutant('gConstTrace', 'missPriceFromSource', gConstTraceFn({ ...CONST_IN, missStun: MISS_STUN_S * 2 }));
runMutant('gConstTrace', 'winPriceFromSource', gConstTraceFn({ ...CONST_IN, winCooldown: MISS_COOLDOWN_S }));
runMutant('gConstTrace', 'accelFromSource', gConstTraceFn({ ...CONST_IN, accel: ACCEL + 1 }));
runMutant('gConstTrace', 'driveNormFromSource', gConstTraceFn({ ...CONST_IN, driveNorm: DRIVE_NORM + 1 }));
runMutant('gConstTrace', 'coneFromSource', gConstTraceFn({ ...CONST_IN, cone: CONE_RAD + 0.1 }));
runMutant('gConstTrace', 'turnRateImported', gConstTraceFn({ ...CONST_IN, turnRate: TURN_RATE + 1 }));
runMutant('gConstTrace', 'dtImported', gConstTraceFn({ ...CONST_IN, dt: DT * 2 }));
runMutant('gConstTrace', 'otherCooldownsDistinct', gConstTraceFn({ ...CONST_IN, slide: GRAB_COOLDOWN_S }));
runMutant('gConstTrace', 'smotherTraced', gConstTraceFn({ ...CONST_IN, smother: Number.NaN }));
runMutant('gConstTrace', 'gkAerialTraced', gConstTraceFn({ ...CONST_IN, gkAerial: GK_AERIAL_COOLDOWN_S + 1 }));
runMutant('gConstTrace', 'lungeCostImported', gConstTraceFn({ ...CONST_IN, lungeCost: TACKLE_LUNGE_COST * 2 }));
runMutant('gConstTrace', 'clampTraced', gConstTraceFn({ ...CONST_IN, pFloor: P_CEIL, pCeil: P_FLOOR }));
/* G-BINS-DERIVED */
runMutant('gBinsDerived', 'vStarIsBrakingIdentity', gBinsDerivedFn({ ...BINS_IN, vStar: V_STAR + 0.1 }));
runMutant('gBinsDerived', 'vStarBrakesToRadius', gBinsDerivedFn({ ...BINS_IN, vStar: V_STAR * 1.5 }));
runMutant('gBinsDerived', 'speedCutsAreQuarters', gBinsDerivedFn({ ...BINS_IN, speedCuts: SPEED_CUTS.map((c) => c + 0.3) }));
runMutant('gBinsDerived', 'speedCutsOrdered', gBinsDerivedFn({ ...BINS_IN, speedCuts: [...SPEED_CUTS].reverse() }));
runMutant('gBinsDerived', 'angleCutsFromCone', gBinsDerivedFn({ ...BINS_IN, angleCuts: [1.0, 2.0] }));
runMutant('gBinsDerived', 'angleCutsOrdered', gBinsDerivedFn({ ...BINS_IN, angleCuts: [ANGLE_CUTS[1], ANGLE_CUTS[0]] }));
runMutant('gBinsDerived', 'quantaAreTheBodys', gBinsDerivedFn({ ...BINS_IN, qv: Q_V * 2 }));
runMutant('gBinsDerived', 'motionCutsAreHalfQuanta', gBinsDerivedFn({ ...BINS_IN, accelCut: Q_V }));
runMutant('gBinsDerived', 'stunHorizonIsTheEnginesStun', gBinsDerivedFn({ ...BINS_IN, stunTicks: STUN_TICKS + 1 }));
/* G-GEOMETRY-BLIND */
runMutant('gGeometryBlind', 'exprFound', gGeometryBlindFn({ ...BLIND_IN, takeExpr: '' }));
runMutant('gGeometryBlind', 'noTakerMotionInExpr',
  gGeometryBlindFn({ ...BLIND_IN, takeExpr: `${TAKE_P_EXPR}\n + tackler.vel.x * 0.1` }));
runMutant('gGeometryBlind', 'noTakerMotionInBody',
  gGeometryBlindFn({ ...BLIND_IN, fnSrc: `${TRY_TACKLES_SRC}\n const q = tackler.heading.x;` }));
runMutant('gGeometryBlind', 'takerPositionIsRead',
  gGeometryBlindFn({ ...BLIND_IN, fnSrc: TRY_TACKLES_SRC.split('o.pos').join('o.POS').split('tackler.pos').join('tackler.POS') }));
runMutant('gGeometryBlind', 'carrierDriveIsTheOnlyMotionTerm',
  gGeometryBlindFn({ ...BLIND_IN, takeExpr: TAKE_P_EXPR.split('drive').join('DRV') }));
runMutant('gGeometryBlind', 'driveIsCarrierVelocity', gGeometryBlindFn({
  ...BLIND_IN,
  fnSrc: TRY_TACKLES_SRC.split(`len(owner.vel) / ${DRIVE_NORM}`).join(`len(owner.vel) / ${DRIVE_NORM + 1}`),
}));
runMutant('gGeometryBlind', 'missWritesNoKinematics',
  gGeometryBlindFn({ ...BLIND_IN, missBranch: `${MISS_BRANCH_SRC}\n tackler.pos.x = 0;` }));
runMutant('gGeometryBlind', 'missWritesOnlyCooldownAndStun',
  gGeometryBlindFn({ ...BLIND_IN, missBranch: `${MISS_BRANCH_SRC}\n tackler.kickCooldown = 1;` }));
runMutant('gGeometryBlind', 'outcomeIsARoll',
  gGeometryBlindFn({ ...BLIND_IN, fnSrc: TRY_TACKLES_SRC.split('match.rng.chance(p)').join('always(p)') }));
runMutant('gGeometryBlind', 'missPriceIsConstant',
  gGeometryBlindFn({ ...BLIND_IN, missBranch: MISS_BRANCH_SRC.split('tackler.stunTimer = 0.35;').join('tackler.stunTimer = speed;') }));
/* G-DETECT */
runMutant('gDetect', 'winsTieToEngineCounter', gDetectFn({ ...DETECT_IN, wins: DETECT_IN.wins + 1 }));
runMutant('gDetect', 'everyUnwhistledDuelInsideTheChallengeRadius',
  gDetectFn({ ...DETECT_IN, outOfRadiusUnwhistled: 1 }));
runMutant('gDetect', 'outOfRadiusIsAllWhistled', gDetectFn({ ...DETECT_IN, whistled: -1 }));
runMutant('gDetect', 'noUnclassifiedCooldownJump', gDetectFn({ ...DETECT_IN, unclassified: 1 }));
runMutant('gDetect', 'winsPlusMissesArePartition', gDetectFn({ ...DETECT_IN, allMisses: DETECT_IN.allMisses + 1 }));
runMutant('gDetect', 'nonVacuousDuels', gDetectFn({ ...DETECT_IN, duels: 0 }));
runMutant('gDetect', 'nonVacuousWins', gDetectFn({ ...DETECT_IN, wins: 0 }));
runMutant('gDetect', 'nonVacuousMisses', gDetectFn({ ...DETECT_IN, misses: 0 }));
runMutant('gDetect', 'nonVacuousRefusals', gDetectFn({ ...DETECT_IN, refusalTicks: 0 }));
runMutant('gDetect', 'nonVacuousEngineCounter', gDetectFn({ ...DETECT_IN, engineTackles: 0 }));
/* G-ACCOUNTING */
runMutant('gAccounting', 'tickPartition', gAccountingFn({ ...ACCT_IN, deadBall: ACCT_IN.deadBall + 1 }));
runMutant('gAccounting', 'assignedEqualsSegment', gAccountingFn({ ...ACCT_IN, assigned: ACCT_IN.assigned + 1 }));
runMutant('gAccounting', 'spanOrdered', gAccountingFn({ ...ACCT_IN, spanViolations: 1 }));
runMutant('gAccounting', 'cellsCoverEveryTabulatedDuel', gAccountingFn({ ...ACCT_IN, cellLungeSum: ACCT_IN.cellLungeSum + 1 }));
runMutant('gAccounting', 'approachCellsCoverEveryTabulatedDuel', gAccountingFn({ ...ACCT_IN, phiLungeSum: ACCT_IN.phiLungeSum + 1 }));
runMutant('gAccounting', 'tabulatedPlusWhistledIsEveryDuel', gAccountingFn({ ...ACCT_IN, tabulated: ACCT_IN.duels + 1 }));
runMutant('gAccounting', 'winCellsCoverEveryWin', gAccountingFn({ ...ACCT_IN, cellWinSum: ACCT_IN.cellWinSum + 1 }));
runMutant('gAccounting', 'missCellsCoverEveryMiss', gAccountingFn({ ...ACCT_IN, missSum: ACCT_IN.missSum + 1 }));
runMutant('gAccounting', 'motionMarginalIsComplete', gAccountingFn({ ...ACCT_IN, motionLungeSum: ACCT_IN.motionLungeSum + 1 }));
runMutant('gAccounting', 'refusalCellsCoverEveryRefusalTick', gAccountingFn({ ...ACCT_IN, refusalCellSum: ACCT_IN.refusalCellSum + 1 }));
runMutant('gAccounting', 'proximityPartition', gAccountingFn({ ...ACCT_IN, proximity: ACCT_IN.refusalTicks - 1 }));
runMutant('gAccounting', 'horizonMonotone', gAccountingFn({ ...ACCT_IN, retainMonotone: false }));
runMutant('gAccounting', 'plantedOnlyInTheFirstSpeedBin', gAccountingFn({ ...ACCT_IN, plantedAboveS0: 1 }));
runMutant('gAccounting', 'nonVacuous', gAccountingFn({ ...ACCT_IN, duels: 0 }));
/* G-REPRO-DVC0 */
for (const k of Object.keys(reproExpected)) {
  runMutant('gReproDvc0', `match_${k}`,
    gReproDvc0Fn({ observed: { ...reproObserved, [k]: reproObserved[k] + 1 }, expected: reproExpected }));
}
runMutant('gReproDvc0', 'noMismatch',
  gReproDvc0Fn({ observed: { ...reproObserved, totalTicks: -1 }, expected: reproExpected }));
runMutant('gReproDvc0', 'fieldsPresent',
  gReproDvc0Fn({ observed: reproObserved, expected: { totalTicks: reproExpected.totalTicks } }));
/* G-WORLD */
for (const k of Object.keys(gWorldConjuncts)) {
  runMutant('gWorld', k, gWorldFn({ ...gWorldConjuncts, [k]: false }));
}
/* G-SEED-DISJOINT */
runMutant('gSeedDisjoint', 'everyBlockOk', gSeedDisjointFn({
  ...SEED_IN,
  blocks: SEED_IN.blocks.map((b) => (b.kind === 're-walk' ? { ...b, first: 12_479_000, last: 12_479_011 } : b)),
}));
runMutant('gSeedDisjoint', 'routedCorrectly',
  gSeedDisjointFn({ ...SEED_IN, first: 12_478_000, last: 12_478_000 }));
runMutant('gSeedDisjoint', 'inReservedBand', gSeedDisjointFn({ ...SEED_IN, first: RESERVED_BAND[0] - 1 }));
runMutant('gSeedDisjoint', 'subBlocksOrderedAndDisjoint', gSeedDisjointFn({
  ...SEED_IN, layout: { ...SEED_IN.layout, guard: SEED_IN.layout.core },
}));
runMutant('gSeedDisjoint', 'ekc0cBandPresentInLedger', gSeedDisjointFn({
  ...SEED_IN, consumed: CONSUMED.filter((c) => c.range[0] !== 12_461_000),
}));
runMutant('gSeedDisjoint', 'dvc0SmokeBandPresentInLedger', gSeedDisjointFn({
  ...SEED_IN, consumed: CONSUMED.filter((c) => c.range[0] !== 12_429_000),
}));
runMutant('gSeedDisjoint', 'nonVacuous', gSeedDisjointFn({ ...SEED_IN, blocks: SEED_IN.blocks.slice(0, 3) }));
/* G-STATS-DISJOINT */
runMutant('gStatsDisjoint', 'atOrAboveFloor', gStatsDisjointFn({ base: 109_400, published: STATS_PUBLISHED_BASES }));
runMutant('gStatsDisjoint', 'onTheGrid', gStatsDisjointFn({ base: 109_601, published: STATS_PUBLISHED_BASES }));
runMutant('gStatsDisjoint', 'gapAtLeastTheStep',
  gStatsDisjointFn({ base: STATS_BASE, published: [...STATS_PUBLISHED_BASES, STATS_BASE + 1] }));
runMutant('gStatsDisjoint', 'nonVacuousLedger', gStatsDisjointFn({ base: STATS_BASE, published: [] }));
/* G-CLEAN-INVOCATION */
runMutant('gCleanInvocation', 'noOverrideSet',
  gCleanInvocationFn({ preflight: true, reasons: ['CBC0_N'], out: '/tmp/x.json', resume: false }));
runMutant('gCleanInvocation', 'preflightNeverCanonical',
  gCleanInvocationFn({ preflight: true, reasons: ['CBC0_OUT'], out: OUT_BY_MODE.full, resume: false }));
runMutant('gCleanInvocation', 'outIsCanonicalForACleanRun',
  gCleanInvocationFn({ preflight: false, reasons: [], out: '/tmp/x.json', resume: false }));
/* G-N-DERIVED */
runMutant('gNDerived', 'ranTheFrozenN', gNDerivedFn({ n: N + 1, derivedN: derived.n, mode: MODE, preflight: false }));
runMutant('gNDerived', 'nPositive', gNDerivedFn({ n: 0, derivedN: 0, mode: MODE, preflight: true }));
runMutant('gNDerived', 'withinSeedRoom', gNDerivedFn({ n: SEED_ROOM + 1, derivedN: SEED_ROOM + 1, mode: MODE, preflight: true }));
/* G-VALUES-UNREACHABLE */
runMutant('gValuesUnreachable', 'noHit',
  gValuesUnreachableFn({ files: srcFiles, needles: [...needles, CONTROL_NEEDLE], control: CONTROL_NEEDLE }));
runMutant('gValuesUnreachable', 'controlNeedleFound',
  gValuesUnreachableFn({ files: srcFiles, needles, control: 'zzz-not-in-any-source-zzz' }));
runMutant('gValuesUnreachable', 'nonVacuousNeedleSet',
  gValuesUnreachableFn({ files: srcFiles, needles: needles.slice(0, 2), control: CONTROL_NEEDLE }));
runMutant('gValuesUnreachable', 'nonVacuousFileSet',
  gValuesUnreachableFn({ files: srcFiles.slice(0, 3), needles, control: CONTROL_NEEDLE }));

const MUTANT_COVERAGE = ['gConstTrace', 'gBinsDerived', 'gGeometryBlind', 'gDetect', 'gAccounting',
  'gReproDvc0', 'gWorld', 'gSeedDisjoint', 'gStatsDisjoint', 'gCleanInvocation', 'gNDerived',
  'gValuesUnreachable'] as const;
const deadMutants = mutants.filter((m) => !m.flipped);
const COMPOSITE_GATES: Record<string, GateOut> = {
  gConstTrace, gBinsDerived, gGeometryBlind, gDetect, gAccounting, gReproDvc0, gWorld,
  gSeedDisjoint, gStatsDisjoint, gCleanInvocation, gNDerived, gValuesUnreachable,
};
/** ⭐ the #251.3 COVERAGE claim, checked rather than asserted: every conjunct of every gate in the
 *  coverage set must appear in the mutant list. */
const uncoveredConjuncts: string[] = [];
for (const g of MUTANT_COVERAGE) {
  for (const c of Object.keys(COMPOSITE_GATES[g].conjuncts)) {
    if (!mutants.some((m) => m.gate === g && m.conjunct === c)) uncoveredConjuncts.push(`${g}.${c}`);
  }
}
const gMutants = {
  pass: deadMutants.length === 0 && uncoveredConjuncts.length === 0,
  conjuncts: { noDeadMutant: deadMutants.length === 0, everyConjunctCovered: uncoveredConjuncts.length === 0 },
  mutantsRun: mutants.length, dead: deadMutants.length, deadList: deadMutants,
  coverage: [...MUTANT_COVERAGE], uncoveredConjuncts,
  note: 'every mutant RE-INVOKES the gate\'s own function on a mutated input and must flip exactly '
    + 'that conjunct (#264.2(3)); the coverage set is NAMED and machine-checked for completeness. '
    + 'The single-predicate gates (xDet / xSrcUntouched / xFpProd) print their evidence in full '
    + 'instead of carrying mutants.',
};

/* ========================================================================== */
/* §14 THE GATE TABLE — hand-checked count (#250.3(i))                        */
/* ========================================================================== */
const gates = {
  xDet: {
    pass: digestA === digestB, conjuncts: { digestsIdentical: digestA === digestB },
    digestA, digestB, passBResumed: false,
    note: 'the whole measured core walked TWICE (pass B never resumes from the checkpoint), '
      + 'canonical-JSON digests compared.',
  },
  xSrcUntouched: {
    pass: srcDiff === '', conjuncts: { gitDiffEmpty: srcDiff === '' }, diff: srcDiff,
  },
  xFpProd: {
    pass: xFpProdPass, conjuncts: { fingerprintUnchanged: xFpProdPass },
    baseline: FINGERPRINT_BASELINE, observed: fpObserved, skipped: SKIP_FP,
  },
  gConstTrace, gBinsDerived, gGeometryBlind, gDetect, gAccounting, gReproDvc0, gWorld,
  gSeedDisjoint, gStatsDisjoint, gCleanInvocation, gNDerived, gValuesUnreachable, gMutants,
};
const GATE_NAMES = Object.keys(gates);
const allGatesPass = Object.values(gates).every((g) => (g as { pass: boolean }).pass);

/* ========================================================================== */
/* §15 THE ARTIFACT                                                           */
/* ========================================================================== */
/** ⭐ the ADMISSIBLE cells: (s ≥ 1 × planted) is structurally empty (G-ACCOUNTING proves it), so
 *  the N rule may not read a zero out of a cell the grid cannot produce. Declared ex ante. */
const cellRowsPhiAdmissible = cellRowsPhi.filter((r) =>
  !(r.approach === 'planted' && r.speed !== SPEED_LABELS[0]));
const rarestCell = cellRowsPhiAdmissible.reduce((a, b) => (a.n <= b.n ? a : b));
const sizingOut = {
  rarestCellEventsPerMatch: round(rarestCell.n / Math.max(1, clusters.length), 6),
  rarestCellName: `${rarestCell.speed} × ${rarestCell.approach}`,
  msPerMatch: round(msPerMatchMeasured, 1),
  rule: 'N* = min( ceil(60 / rarestCellLungesPerMatch) ↑25, floor(0.5 h / (ms/match × 1 arm × 2 '
    + 'X-DET)), 800 ) — DV-C0 / EK-C0 §NRULE\'s form, inherited, with THIS census\'s own numerator: '
    + 'a LUNGE in the RAREST (approach speed × approach direction) cell of the frozen grid. '
    + 'Frozen in the stage doc '
    + '§NRULE BEFORE the smoke ran; the ZERO-EVENT CLAUSE (an unbounded precision term when the '
    + 'rarest cell is empty) is frozen with it.',
  derived,
};

const body = {
  stage: 'CB-C0',
  doc: 'docs/world-model/CB-C0-DISPOSSESSION-CENSUS.md',
  contract: 'docs/world-model/CB-CARRY-BEAT-CONTRACT.md §3 CB-C0 (mechanism §2 M-CB.1)',
  ruling: '#265 (the contract bound; CB-C0 dispatched, seeds from 12,470,000, stats ≥ 109,600)',
  mode: MODE,
  preflight: IS_PREFLIGHT,
  frozenDesign: {
    world: 'BARE PRODUCTION — new Match({seed, teamA, teamB}); every experimental flag OFF, no eye, '
      + 'no gene, no book. Byte-for-byte DV-C0\'s PROD-arm constructor.',
    tracedConstants: gConstTrace.traced,
    derivation: gBinsDerived.arithmetic,
    speedBins: SPEED_LABELS, angleBins: ANGLE_LABELS, motionStates: MOTION_LABELS,
    overcommitmentDefinition:
      'an arrival is OVERCOMMITTED iff the taker\'s speed at the challenge instant is ≥ v* = '
      + 'sqrt(2 · ACCEL · R_TACKLE), i.e. iff his own braking model needs MORE than the challenge '
      + 'radius to bring him to rest: he cannot stop inside the duel. X (the "brake within X") IS '
      + 'the challenge radius, and the arithmetic is in derivation.vStar.',
    horizons: { stunTicks: STUN_TICKS, stunSeconds: MISS_STUN_S, h1Seconds: H1_S, h2Seconds: H2_S },
    estimator: `cluster bootstrap by match seed (#20), ${BOOTSTRAP} resamples, percentile 95 % CI, `
      + 'ratio-of-sums, ONE shared resample-index matrix so every rate AND every difference is '
      + `paired by construction; stats base ${STATS_BASE}.`,
    preRegisteredShapes: shapes.map((s) => ({ id: s.id, claim: s.claim, expect: s.expect })),
    engineExpectedShape:
      'E1 — the take rate is FLAT in the TAKER\'s approach geometry, because the take probability '
      + 'expression contains no term derived from his speed, heading or motion state '
      + '(G-GEOMETRY-BLIND proves the premise from the engine\'s own source). Any observed gradient '
      + 'is CONFOUNDING — which carriers get challenged at speed — not a mechanism.',
    seeds: {
      band: RESERVED_BAND, core: [CORE_BASE, CORE_BASE + CORE_N - 1],
      guard: [GUARD_BASE, GUARD_BASE + GUARD_SPAN - 1],
      smoke: [SMOKE_BASE, SMOKE_BASE + SMOKE_N - 1],
      census: [CENSUS_BASE, CENSUS_BASE + SEED_ROOM - 1],
      gWorld: GWORLD_SEED,
      reproDvc0: [REPRO_DVC0_BASE, REPRO_DVC0_BASE + REPRO_DVC0_N - 1],
      walked: [firstSeed, lastSeed],
    },
    statsBase: STATS_BASE,
  },
  result: {
    run: {
      matches: clusters.length, simSecondsPerMatch: churn.simSecondsPerMatch,
      duels: DETECT_IN.duels, wins: DETECT_IN.wins, misses: DETECT_IN.allMisses,
      duelsTabulated: ACCT_IN.tabulated, whistledExcluded: DETECT_IN.whistled,
      tabulatedWins: ACCT_IN.wins, tabulatedMisses: DETECT_IN.misses,
      refusalTicks: DETECT_IN.refusalTicks, proximityTicks: ACCT_IN.proximity,
      slideEvents: sum(clusters.map((c) => c.slideEvents)),
      grabEvents: sum(clusters.map((c) => c.grabEvents)),
      smotherMissEvents: sum(clusters.map((c) => c.smotherMissEvents)),
      turnovers: sum(clusters.map((c) => c.turnovers)),
      meanTakerSpeed: round(sum(clusters.map((c) => c.takerSpeedSum)) / Math.max(1, sum(clusters.map((c) => c.takerSpeedN))), 6),
      meanCarrierSpeed: round(sum(clusters.map((c) => c.carrierSpeedSum)) / Math.max(1, sum(clusters.map((c) => c.carrierSpeedN))), 6),
    },
    takeRateBySpeed: speedRows,
    takeRateByApproachDirection: phiRows,
    takeRateByBearing: angleRows,
    bearingAxisDegeneracy: {
      note: '⭐ A STRUCTURAL FINDING, not a defect: the ball is carried AHEAD of the body and the '
        + 'challenge radius is measured about the BALL, so a candidate inside it is almost always '
        + 'inside the carrier\'s frontal cone. The bearing axis therefore cannot separate a '
        + 'front-on duel from a chase; the approach-DIRECTION axis φ does, and it carries R3.',
      lungesByBearing: angleRows.map((r) => ({ bin: r.bin, lunges: r.n })),
    },
    takeRateByCellBearing: cellRows,
    takeRateByCell: cellRowsPhi,
    takeRateByMotion: [...motionRows, turningRow],
    overcommitment: {
      overcommitted: ocRow, controlled: ctrlRow,
      gap: gapR1,
      byOwnBodyVStar: rateRow(clusters.map((c) => c.ocBodyWins), clusters.map((c) => c.ocBodyLunges)),
      note: 'the byOwnBodyVStar row re-classifies each arrival against THAT BODY\'s own v* '
        + '(per-body accel = ACCEL × (0.9 + pace × 0.2)); it is a REPORTED sensitivity, the frozen '
        + 'grid is the base-constant one.',
    },
    punishment: {
      byArrivalSpeed: missRows,
      signals: punishmentSignals.map((s) => ({ name: s.name, ...s.gap, punishes: s.punishes })),
      anySignalPunishes: punishedAnywhere,
      priceOfAMiss: {
        cooldownS: MISS_COOLDOWN_S, stunS: MISS_STUN_S, burstStamina: TACKLE_LUNGE_COST,
        positionCost: 0, velocityCost: 0,
        note: 'the price is a CONSTANT (G-GEOMETRY-BLIND.missPriceIsConstant): the beaten lunger '
          + 'pays the same cooldown, the same stun and the same burst whether he arrived walking '
          + 'or flat out, and the engine writes NO position or velocity change — there is no '
          + 'carry-through. Whatever overrun the tables show is the STUN\'s velocity damping '
          + 'acting on the momentum he already had, not a modelled commitment cost.',
      },
    },
    realityShapes: shapes,
    r3OnTheBearingAxisReported: gapR3bearing,
    inversionPresent,
    routing: inversionPresent
      ? '⚠ AN INVERSION IS PRESENT — ROUTED to the 街机偏离 test (#246). It is PUBLISHED as measured '
        + 'and is NEVER corrected into the table.'
      : 'no inversion at this battery; every resolved shape reads in its pre-registered direction.',
    churn,
    perClusterCells: clusters,
  },
  gates,
  allGatesPass,
  gateCount: GATE_NAMES.length,
  gateNames: GATE_NAMES,
  deviations: [
    '⭐⭐ THE CENSUS POPULATION IS THE STANDING CHALLENGE (`tryTackles`). The slide tackle, the '
      + 'tactical-foul grab and the keeper smother are DETECTED and counted, but they are NOT in '
      + 'the geometry table: each is a different mechanic with its own gate, and pooling them '
      + 'would blur the one duel the CB arc rebuilds. Their per-match rates are published in the '
      + 'churn block.',
    '⭐ THE REFUSAL CLASS IS A TICK COUNT, NOT AN EVENT COUNT. A challenge that is declined (the '
      + 'jockey gate) leaves no mark in the world, so it can only be counted as "a tick at which a '
      + 'candidate stood inside the challenge radius and no lunge fired". Consecutive ticks of the '
      + 'same standoff therefore each count once. Declared ex ante; it is a DENSITY, not a rate.',
    'THE GEOMETRY IS READ AT POST-STEP, which IS the instant the mechanic saw (`tryTackles` runs '
      + 'after `physicsStep` and writes no position or velocity). The motion state uses the '
      + 'previous post-step tick, i.e. the body\'s own last completed tick.',
    'v* USES THE BASE ACCELERATION CONSTANT (14), not the per-body one — the frozen grid must be '
      + 'the same for every body. The per-body classification is published beside it.',
    'A HORIZON TRUNCATED BY FULL TIME IS NULL, NOT A ZERO: those events are excluded from the '
      + 'horizon means and their counts are stored per cell, so every mean re-derives.',
  ],
  registeredNonClaims: [
    'NOTHING SHIPS: zero src/** bytes, the production fingerprint re-derived unchanged, no flag, '
      + 'no gene, no eye anywhere.',
    '⭐⭐ THE TABLE IS WIRED INTO NO PLAYER (#247). It is instrument-side truth: it is the A/B '
      + 'baseline CB-T1 contrasts against, and nothing else.',
    'NO PASS/FAIL ON ANY MEASURED RATE. The gates are the X-family, the trace gates, the source '
      + 'gate, the detection and accounting identities, the DV-C0 inheritance receipt and the '
      + 'mutant-liveness proof. The #246 shape flags are MECHANICAL CI readings: an inversion '
      + 'turns nothing red and is ROUTED, never corrected.',
    'THE RATES ARE CONDITIONAL, NOT CAUSAL. Approach geometry is not randomly assigned: a defender '
      + 'who arrives at 6 m/s is chasing a different carrier in a different state from one who '
      + 'arrives at 1 m/s, and that state is part of the price. No counterfactual is claimed.',
    'THIS STAGE PROPOSES NO MECHANIC AND RULES ON NOTHING (#203). CB-T0/T1/T2 are the contract\'s.',
  ],
  verdict: `CB-C0 DISPOSSESSION-GEOMETRY CENSUS at N=${clusters.length} × 1 arm (bare production) — `
    + `${Object.values(gates).filter((g) => (g as { pass: boolean }).pass).length}/${GATE_NAMES.length} gates. `
    + 'THE TABLE IS DESCRIPTIVE TRUTH; the #246 flags are mechanical and the commander adjudicates '
    + 'them (#203).',
};

const resultSha256 = createHash('sha256').update(canonical(body)).digest('hex');
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  console.error(`CB-C0 FATAL — refusing to write a PREFLIGHT artifact to the canonical path ${OUT_PATH}.`);
  process.exit(2);
}
writeFileSync(OUT_PATH, `${JSON.stringify({
  ...body,
  resultSha256,
  sizing: sizingOut,
  /** ⭐ THE UNHASHED ENVELOPE (#197-M1 / #258.3): every machine timing, path and git fact lives
   *  HERE, outside resultSha256, so a /tmp re-run re-derives the canonical receipt byte-for-byte. */
  preflightProvenance: {
    preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS, resumeRequested: RESUME,
    outPath: OUT_PATH, outPathResolved: pathResolve(OUT_PATH), canonicalPath: isCanonicalPath(OUT_PATH),
    checkpointPath: CHECKPOINT_PATH, checkpointRowsReused: done.size, freshWalks: walkedFresh,
  },
  headContextOnly: head,
  wallContextOnly: {
    passAMs, xDetMs, totalMs: Date.now() - wall0, msPerMatch: round(msPerMatchMeasured, 1),
    note: 'CONTEXT ONLY and OUTSIDE resultSha256 (#128 / #258.3) — used in no gate. '
      + '`sizing.msPerMatch` is the one timing number with a job: the N rule\'s wall term reads it.',
  },
}, null, 2)}\n`);

/* ========================================================================== */
/* §16 STDOUT — rows, never verdicts (#203)                                   */
/* ========================================================================== */
const o = (s: string): void => { process.stdout.write(`${s}\n`); };
const pct = (x: number): string => (Number.isFinite(x) ? `${(x * 100).toFixed(3)} %` : 'n/a');
o('');
o(`=== CB-C0 DISPOSSESSION-GEOMETRY CENSUS — ${MODE} — HEAD ${head} — ${clusters.length} seeds `
  + `(bare production), block ${firstSeed}..${lastSeed} ===`);
o('');
o(`v* = sqrt(2 × ${ACCEL} × ${R_TACKLE}) = ${round(V_STAR, 6)} m/s · duels ${DETECT_IN.duels} `
  + `(${churn.duelsPerMatch}/match) · wins ${DETECT_IN.wins} · misses ${DETECT_IN.allMisses} `
  + `· whistle-excluded ${DETECT_IN.whistled} · tabulated ${ACCT_IN.tabulated} `
  + `· refusal ticks ${DETECT_IN.refusalTicks}`);
o('');
o('TAKE RATE BY APPROACH SPEED');
for (const r of speedRows) {
  o(`  ${r.bin.padEnd(20)} [${r.loEdge.toFixed(3)}, ${r.hiEdge === null ? '∞' : r.hiEdge.toFixed(3)})`
    + `  lunges ${String(r.n).padStart(6)}  wins ${String(r.k).padStart(6)}  rate ${pct(r.rate).padStart(10)}`
    + `  CI [${pct(r.ci95[0])}, ${pct(r.ci95[1])}]  refusalTicks ${r.refusals}`);
}
o('');
o('TAKE RATE BY APPROACH DIRECTION (φ = taker\'s own direction of travel vs CARRIER heading)');
for (const r of phiRows) {
  o(`  ${r.bin.padEnd(20)} lunges ${String(r.n).padStart(6)}  wins ${String(r.k).padStart(6)}`
    + `  rate ${pct(r.rate).padStart(10)}  CI [${pct(r.ci95[0])}, ${pct(r.ci95[1])}]  refusalTicks ${r.refusals}`);
}
o('');
o('TAKE RATE BY BEARING (θ = taker bearing from the carrier vs CARRIER heading) — STRUCTURALLY DEGENERATE');
for (const r of angleRows) {
  o(`  ${r.bin.padEnd(20)} lunges ${String(r.n).padStart(6)}  wins ${String(r.k).padStart(6)}`
    + `  rate ${pct(r.rate).padStart(10)}  CI [${pct(r.ci95[0])}, ${pct(r.ci95[1])}]`);
}
o('');
o('TAKE RATE BY MOTION STATE');
for (const r of [...motionRows, turningRow]) {
  o(`  ${r.state.padEnd(46)} lunges ${String(r.n).padStart(6)}  rate ${pct(r.rate).padStart(10)}`
    + `  CI [${pct(r.ci95[0])}, ${pct(r.ci95[1])}]`);
}
o('');
o(`OVERCOMMITTED (v ≥ v*) ${pct(ocRow.rate)} [${pct(ocRow.ci95[0])}, ${pct(ocRow.ci95[1])}] on ${ocRow.n} lunges`);
o(`CONTROLLED  (v < v*/2) ${pct(ctrlRow.rate)} [${pct(ctrlRow.ci95[0])}, ${pct(ctrlRow.ci95[1])}] on ${ctrlRow.n} lunges`);
o('');
o('WHAT A MISS COSTS, BY ARRIVAL SPEED (overrun over the stun · Δseparation and Δspace at 1 s · carrier retention)');
for (const r of missRows) {
  o(`  ${r.bin.padEnd(20)} misses ${String(r.misses).padStart(6)}  overrun ${r.overrunM.mean.toFixed(4)} m`
    + `  Δsep ${r.dSeparationM.mean.toFixed(4)} m  Δspace ${r.dSpaceM.mean.toFixed(4)} m`
    + `  retain@1s ${pct(r.retain1.rate)}  retain@2s ${pct(r.retain2.rate)}`);
}
o('');
o('⭐ THE #246 REALITY-SHAPE CHECK (pre-registered)');
for (const s of shapes) {
  o(`  ${s.id} ${s.claim}`);
  o(`     expect ${s.expect} · measured ${s.point} CI [${s.ci95[0]}, ${s.ci95[1]}] ⇒ ${s.shapeVerdict}`);
}
o(`  ROUTING: ${body.result.routing}`);
o('');
o(`CHURN: turnovers/match ${churn.turnoversPerMatch} (one every ${churn.secondsPerTurnover} s) · `
  + `mean spell ${churn.meanSpellTicks.meanSeconds} s · duelled spell ${churn.meanDuelledSpellTicks.meanSeconds} s `
  + `· remaining after a duel ${churn.meanSpellTicksAfterDuel.meanSeconds} s`);
o('');
o(`GATES ${allGatesPass ? 'GREEN' : '*** RED ***'} (${GATE_NAMES.length}): `
  + Object.entries(gates).map(([k, v]) => `${k} ${(v as { pass: boolean }).pass ? 'ok' : 'FAIL'}`).join(' · '));
o(`  G-REPRO-DVC0 ${gReproDvc0.fieldsChecked} fields · ${gReproDvc0.mismatches} mismatches · block ${gReproDvc0.block}`);
o(`  G-MUTANTS ${gMutants.mutantsRun} mutants · ${gMutants.dead} dead · coverage ${gMutants.coverage.length} gates`);
o(`X-DET digest ${digestA}`);
o(`resultSha256 ${resultSha256}`);
o(`wall ${((Date.now() - wall0) / 1000).toFixed(1)}s · ${round(msPerMatchMeasured, 1)} ms/match `
  + `· rarest cell ${sizingOut.rarestCellName} at ${sizingOut.rarestCellEventsPerMatch}/match · artifact ${OUT_PATH}`);
o(`VERDICT: ${body.verdict}`);
if (MODE === 'smoke') o('⚠ SMOKE ADJUDICATES NOTHING — every number above is plumbing evidence, not a finding.');

if (!allGatesPass) process.exit(1);
process.exit(0);
