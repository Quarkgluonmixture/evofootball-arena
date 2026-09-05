/**
 * ⭐⭐ BQ-C0 — 「停球」 THE FIRST-TOUCH CENSUS
 * (docs/world-model/BQ-C0-FIRST-TOUCH-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #382 item 6. Lineage: PT-C0 → the RC arc → RC-T1b (FAIL) →
 * BN-C0 (the bounce census: the user's 「传到人身上弹回」 is a CONTROL-QUALITY event, C1 the
 * majority class on both arms) → #382 item 5 (THE FAILING LAW, LOCATED) → this census.
 * E1a (docs/world-model/EDS-E1A-FIRST-TOUCH-INSTRUMENT.md) built the ledger this census READS;
 * E1b (docs/world-model/EDS-E1B-TOUCH-COST-CURVE.md) built the second speed curve it publishes
 * beside. Both measured the law on STAGED passes in a HELD world (pressure 0, misalign ≈ 0);
 * nobody has read its terms on world 12 LIVE. This census does.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis and arms no mechanism.
 * The READ SENTENCES are FROZEN LITERALS selected by STORED booleans. The commander rules.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS the shipped exports
 * (`touchFailChance` itself, `TOUCH_SPEED_COST`, the composer, the loaders) and reads `Match`
 * state per tick; the E1a first-touch ledger and the contest-episode ledger are READ, never
 * re-implemented. THERE IS NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte
 * per arm, and `gTraceInert` proves BOTH trace flags change no byte of the world.
 * ⛔ WORLD 12 IS UNTOUCHED: no world is cut, no flag is armed, the user's play-test gate is his.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  CONTACT_CONTROL_DELAY_TICKS, CONTROL_MAX_SPEED, DEFLECT_MAX_SPEED,
  PASS_POWER_MIN, PASS_POWER_MAX, DT, GRAVITY,
} from '../../src/sim/constants';
import { touchFailChance, TOUCH_SPEED_COST } from '../../src/sim/mechanics';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  RA_WORLD_VERSION, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { clamp01 } from '../../src/utils/math';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the BN-C0 §1 form)                         */
/* ========================================================================== */
const ENV_WHITELIST = ['BQC0_MODE', 'BQC0_N', 'BQC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BQC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`BQ-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.BQC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('BQ-C0 FATAL — BQC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.BQC0_N !== undefined ? Number(process.env.BQC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('BQ-C0 FATAL — BQC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.BQC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`BQC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`BQC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`BQC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bq-c0-first-touch-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/bq-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('BQ-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the house set)                                            */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'ERROR'; }
};
const sum = (xs: readonly number[]): number => xs.reduce((a, b) => a + b, 0);
const zeros = (n: number): number[] => new Array<number>(n).fill(0);
const zeros2 = (a: number, b: number): number[][] => Array.from({ length: a }, () => zeros(b));
const addInto = (a: number[], b: readonly number[]): void => {
  for (let i = 0; i < a.length; i++) a[i] += b[i];
};
const addInto2 = (a: number[][], b: readonly (readonly number[])[]): void => {
  for (let i = 0; i < a.length; i++) addInto(a[i], b[i]);
};
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
const binMedian = (bins: readonly number[], width: number): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return i * width;
  }
  return (bins.length - 1) * width;
};
const canonicalJson = (v: unknown): string => {
  const walk = (x: unknown): unknown => {
    if (Array.isArray(x)) return x.map(walk);
    if (x !== null && typeof x === 'object') {
      const o = x as Record<string, unknown>;
      return Object.keys(o).sort().reduce<Record<string, unknown>>(
        (acc, k) => { acc[k] = walk(o[k]); return acc; }, {},
      );
    }
    return x;
  };
  return JSON.stringify(walk(v));
};

/* ========================================================================== */
/* §3 THE ANCHORED SITES — anchored needle + line receipt, never first-occurrence
   canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4)                                        */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PERC_PATH = 'src/ai/perception.ts';
const A4_PATH = 'src/game/a4World.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MATH_PATH = 'src/utils/math.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, MECH_PATH, CONST_PATH, PERC_PATH, A4_PATH, BRAIN_PATH, MATH_PATH]) {
  SRC_OF[p] = readFileSync(p, 'utf8');
}
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};
interface Anchor {
  what: string; file: string; needle: string; want: number;
  occurrences: { line: number }[]; extracted?: unknown;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, want: number, extracted?: unknown,
): { line: number }[] => {
  const hits = occurrences(SRC_OF[file], needle);
  ANCHORS.push({ what, file, needle, want, occurrences: hits, extracted });
  return hits;
};

/* ⭐⭐ THE FAILING LAW ITSELF — `touchFailChance`, every constant AT ITS OWN SITE */
anchor('⭐⭐ THE LAW\'S SIGNATURE — the six arguments the roll reads', MECH_PATH,
  'export function touchFailChance(\n'
  + '  speed: number, pressure: number, misalign: number, technique: number, positioning = 0.5,\n'
  + '  heavyTouchCost = false,\n'
  + '): number {', 1);
anchor('⭐⭐ THE AWARE FORM — positioning tames the pressure and blind-side terms (0.6 at its '
  + 'site)', MECH_PATH,
  '  const aware = 1 - (positioning - 0.5) * 0.6; // 0.7 .. 1.3', 1, 0.6);
anchor('⭐⭐ THE CURVE SELECTOR — base vs heavy, chosen per call by `match.edsTouchCost`',
  MECH_PATH,
  '  const cost = heavyTouchCost ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;', 1);
anchor('⭐⭐ THE RAW EXPRESSION — the FOUR ADDENDS this census decomposes: the FLOOR 0.01, the '
  + 'SPEED term `clamp01((speed − 6) / span) · weight`, and `(pressure · 0.1 + misalign · 0.05) '
  + '· aware` (the 0.1 and the 0.05 at their own site)', MECH_PATH,
  '  const raw = 0.01 + clamp01((speed - 6) / cost.span) * cost.weight\n'
  + '    + (pressure * 0.1 + misalign * 0.05) * aware;', 1, { floor: 0.01, pressureWeight: 0.1, misalignWeight: 0.05 });
anchor('⭐⭐ THE TECHNIQUE MULTIPLIER AND THE CAP — `clamp(raw · (1.3 − technique · 0.85), 0, '
  + '0.4)`, the 1.3 / 0.85 / 0.4 all at their own site', MECH_PATH,
  '  return clamp(raw * (1.3 - technique * 0.85), 0, 0.4);', 1,
  { multBase: 1.3, multSlope: 0.85, cap: 0.4 });
anchor('⭐⭐ THE TWO SPEED CURVES — E1b\'s pair, `base` shipped and `heavy` behind '
  + '`edsTouchCost`', MECH_PATH,
  'export const TOUCH_SPEED_COST = {\n'
  + '  base: { span: 8, weight: 0.07 },\n'
  + '  heavy: { span: 16, weight: 0.24 },\n'
  + '} as const;', 1, TOUCH_SPEED_COST);
anchor('⭐ `clamp` and `clamp01` — the law\'s own helpers, CALLED through the shipped '
  + '`touchFailChance`, never re-implemented', MATH_PATH,
  'export const clamp = (v: number, a: number, b: number): number => (v < a ? a : v > b ? b : v);\n'
  + 'export const clamp01 = (v: number): number => clamp(v, 0, 1);', 1);
/* ⭐⭐ THE ADJUDICATION — `attemptFirstTouch`, its TWO early returns and its failure branch */
anchor('⭐⭐ THE ADJUDICATION\'S ENTRY POINT', MECH_PATH,
  'export function attemptFirstTouch(\n'
  + '  match: Match,\n'
  + '  p: Player,\n'
  + '  contact?: FirstTouchContactContext,\n'
  + '): boolean {', 1);
anchor('⭐⭐ THE SPEED THE ROLL READS — the contact\'s own `relativeSpeed` when one is handed '
  + 'in (the resolver always hands one in)', MECH_PATH,
  '  const speed = contact?.relativeSpeed ?? (len(ball.vel) + Math.abs(ball.vz) * 0.6);', 1);
anchor('⭐⭐ THE TWO FREE TRAPS — the ONLY early return before the roll: a KEEPER, or a ball at '
  + '`speed <= 6`. No roll, no rng draw, NO TRACE ENTRY', MECH_PATH,
  "  if (p.role === 'GK' || speed <= 6) return true;", 1, 6);
anchor('⭐⭐ THE MISALIGN FORM — face = 0, from behind the body = 1', MECH_PATH,
  '  const misalign = (1 + (inx * p.heading.x + iny * p.heading.y)) / 2;', 1);
anchor('⭐⭐ THE PRESSURE READ — `pressureAt` over the OPPOSING side\'s players. The NAMED '
  + 'site is pinned by its own FOLLOWING line, because the same expression has a second home '
  + 'in this file', MECH_PATH,
  '  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);\n'
  + '  let pFail = touchFailChance(', 1);
anchor('⭐ the SAME pressure expression, BOTH occurrences ENUMERATED (canon: a seam-map gate '
  + 'pins occurrence COUNTS per needle and enumerates EVERY occurrence\'s site) — '
  + '`attemptFirstTouch`\'s and the OTHER body-contact site\'s', MECH_PATH,
  '  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);', 2);
anchor('⭐⭐ THE CALL — the six arguments, with `match.edsTouchCost` choosing the curve',
  MECH_PATH,
  '  let pFail = touchFailChance(\n'
  + '    speed, pressure, misalign, p.attrs.dribbling, p.attrs.positioning, match.edsTouchCost,\n'
  + '  );', 1);
anchor('⭐⭐ THE OWN-TOUCH DISCOUNT ×0.45 — applied AFTER the clamp, so a discounted entry\'s '
  + 'logged pFail is exactly 0.45 × the recomposition', MECH_PATH,
  '  if (match.dribbleTouch !== null && match.dribbleTouch.gid === p.gid) pFail *= 0.45;', 1, 0.45);
anchor('⭐⭐ THE COIN — `clean = !match.rng.chance(pFail)`', MECH_PATH,
  '  const clean = !match.rng.chance(pFail);', 1);
anchor('⭐⭐ THE E1a LEDGER PUSH — AFTER the roll and AFTER the ×0.45, so the logged `pFail` is '
  + 'the one the coin actually used', MECH_PATH,
  '  if (match.traceFirstTouch) {\n    match.firstTouchTrace.push({', 1);
anchor('⭐⭐ THE LEDGER RECORD SHAPE — the exact terms this census decomposes', MECH_PATH,
  'export interface FirstTouchTraceEntry {', 1);
anchor('⭐⭐ THE FAILURE BRANCH — the `miscontrols` stat this census cross-checks', MECH_PATH,
  '  match.teams[p.side].stats.miscontrols++;\n  match.stat(p.gid).miscontrols++;', 1);
anchor('⭐⭐ THE KNOCK — direction rotated ±0.8 rad, speed 3.5–6.5 m/s', MECH_PATH,
  '  ball.vel = scale(rotate(v2(inx, iny), match.rng.range(-0.8, 0.8)), match.rng.range(3.5, 6.5));',
  1);
anchor('⭐ THE KNOCK\'S COOLDOWN — off balance, cannot instantly regather', MECH_PATH,
  "  p.kickCooldown = 0.5; // off balance — can't instantly regather", 1, 0.5);
anchor('⭐⭐ THE OTHER `miscontrols` WRITER — `tryChestTrap`\'s own spill, which pushes NO '
  + 'trace entry: BOTH `.stats.miscontrols++` sites in this file are ENUMERATED, which is why '
  + 'the stat/trace cross-check has a STRUCTURAL gap and this census says so', MECH_PATH,
  '.stats.miscontrols++;', 2);
anchor('⭐ `tryChestTrap`\'s own site, NAMED (the second of the two)', MECH_PATH,
  '  match.teams[trapper.side].stats.miscontrols++;', 1);
/* ⭐⭐ THE RESOLVER — the population, and the two flags */
anchor('⭐⭐ THE RESOLVER — the ONLY caller of `attemptFirstTouch` in the engine', MATCH_PATH,
  '  private resolvePendingControlAttempt(): boolean {', 1);
anchor('⭐⭐ THE RESOLVER\'S OWN GATE — nothing happens before `readyTick`', MATCH_PATH,
  '    if (attempt === null || this.stepCount < attempt.readyTick) return false;', 1);
anchor('⭐⭐ THE RESOLVER\'S PRE-ROLL EARLY RETURNS — a missing / sent-off / stunned body never '
  + 'reaches the roll (the census counts this class SEPARATELY from the free traps)', MATCH_PATH,
  '    if (!p || p.sentOff || p.stunTimer > 0) return false;', 1);
anchor('⭐⭐ THE RETENTION MARGIN — the other pre-roll early return', MATCH_PATH,
  '    if (access.geometry.centerDistance > access.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN) return false;',
  1);
anchor('⭐⭐ THE ROLL, CALLED AT `readyTick` with the contact\'s own frozen terms', MATCH_PATH,
  '    const clean = mech.attemptFirstTouch(this, p, {\n'
  + '      relativeSpeed: attempt.relativeSpeed,\n'
  + '      incomingDir: attempt.incomingDir,\n'
  + '    });', 1);
anchor('⭐ THE SUCCESS PATH — `giveBall`', MATCH_PATH, '    if (clean) this.giveBall(p);', 1);
anchor('⭐⭐ THE readyTick FORM — a CONSTANT offset, `CONTACT_CONTROL_DELAY_TICKS`', MATCH_PATH,
  '      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,', 1);
anchor('⭐⭐ K ITSELF — the engine\'s own constant, the ONLY source of the aftermath window',
  CONST_PATH, 'export const CONTACT_CONTROL_DELAY_TICKS = 3;', 1, CONTACT_CONTROL_DELAY_TICKS);
anchor('⭐ the PendingControlAttempt record shape', MATCH_PATH,
  'interface PendingControlAttempt {', 1);
anchor('⭐⭐ THE PENDING-CONTROL FIELD — declared `private`, so the census reads it through a '
  + 'TYPE VIEW (a READ, never a write; DECLARED at §P.B)', MATCH_PATH,
  '  private pendingControl: PendingControlAttempt | null = null;', 1);
anchor('⭐ simTick IS stepCount — the tick the ledger stamps is the tick the probe reads',
  MATCH_PATH, '  get simTick(): number { return this.stepCount; }', 1);
anchor('⭐⭐ THE E1a TRACE DOOR on the constructor config', MATCH_PATH,
  '  traceFirstTouch?: boolean;', 1);
anchor('⭐⭐ THE PUBLIC E1a LEDGER ARRAY this census reads', MATCH_PATH,
  '  readonly firstTouchTrace: FirstTouchTraceEntry[] = [];', 1);
anchor('⭐⭐ the E1a flag is OFF by default and set ONLY from cfg', MATCH_PATH,
  '    this.traceFirstTouch = cfg.traceFirstTouch ?? false;', 1);
anchor('⭐⭐ THE CURVE DOOR on the constructor config', MATCH_PATH,
  '  edsTouchCost?: boolean;', 1);
anchor('⭐⭐ THE CURVE\'S DEFAULT — `cfg.edsTouchCost ?? EDS_BUNDLE_ARMED`: this census PINS the '
  + 'value world 12 gets in THIS process and states which curve it measured', MATCH_PATH,
  '    this.edsTouchCost = cfg.edsTouchCost ?? EDS_BUNDLE_ARMED;', 1);
anchor('⭐⭐ EDS_BUNDLE_ARMED\'s own line — the env door, refused by this probe\'s §1 envelope',
  MATCH_PATH, "const EDS_BUNDLE_ARMED = envArmed('EDS_BUNDLE');", 1);
anchor('⭐ `envArmed`\'s own form — unset ⇒ every flag off', MATCH_PATH,
  'const envArmed = (name: string): boolean =>\n'
  + "  typeof process !== 'undefined' && !!process.env && process.env[name] === '1';", 1);
anchor('⭐ THE CONTEST-LEDGER DOOR (armed for the aftermath\'s context; observation only)',
  MATCH_PATH, '  traceContests?: boolean;', 1);
anchor('⭐ THE OWN-TOUCH TAG the ×0.45 reads — PUBLIC state', MATCH_PATH,
  '  dribbleTouch: { gid: number; until: number } | null = null;', 1);
/* ⭐⭐ THE PRESSURE FUNCTION AND ITS RADIUS */
anchor('⭐⭐ `pressureAt` — 1 at 0 m, 0 beyond the incumbent radius', PERC_PATH,
  'export function pressureAt(pos: V2, opponents: Player[]): number {', 1);
anchor('⭐ THE PRESSURE RADIUS at its own named site', PERC_PATH,
  'export const PRESSURE_RADIUS_M = 6;', 1, 6);
/* ⭐⭐ THE SPEED SOURCE — the launch-speed form and the POWER argument */
anchor('⭐⭐ THE LAUNCH-SPEED FORM — `clamp(d · 0.6 + 8.2, 9, 22) · executedMul`', MECH_PATH,
  '  const speed = clamp(d * 0.6 + 8.2, 9, 22) * executedMul;', 1);
anchor('⭐⭐ THE POWER CLAMP — `[PASS_POWER_MIN, PASS_POWER_MAX]`', MECH_PATH,
  '  const intended = clamp(powerChoice, PASS_POWER_MIN, PASS_POWER_MAX);', 1);
anchor('⭐⭐ POWER 1.0 DRAWS NO RNG AND IS ARITHMETICALLY INERT (C1-A\'s own construction)',
  MECH_PATH, '  if (intended === 1) return 1;', 1);
anchor('PASS_POWER_MIN', CONST_PATH, 'export const PASS_POWER_MIN = 0.85;', 1, PASS_POWER_MIN);
anchor('PASS_POWER_MAX', CONST_PATH, 'export const PASS_POWER_MAX = 1.15;', 1, PASS_POWER_MAX);
anchor('⭐⭐ THE POWER PASSTHROUGH — `Match.performPass`\'s own comment: every live caller omits '
  + 'the weight', MATCH_PATH,
  '  /** `powerChoice` is C1-A\'s dormant weight input; every live caller omits it. */', 1);
anchor('⭐⭐ THE ENGINE\'S OWN POWER LEDGER — `struckAtChosenPower` counts strikes that reached '
  + '`performPass` carrying a NON-DEFAULT weight; this census reads it per match', MATCH_PATH,
  '    struckAtChosenPower: 0,', 1);
anchor('⭐⭐ EVERY `performPass(` CALL SITE IN THE BRAIN, ENUMERATED (canon: a seam-map gate '
  + 'pins occurrence COUNTS per needle and enumerates EVERY occurrence\'s site)', BRAIN_PATH,
  'performPass(', 3);
anchor('⭐ brain call site 1/3 — no power argument at all', BRAIN_PATH,
  '      match.performPass(p, back);', 1);
anchor('⭐ brain call site 2/3 — the LITERAL 1', BRAIN_PATH,
  '          match.performPass(p, passMate!, offsideExemptKick, 1, v2(bestLeadX, bestLeadY));', 1);
anchor('⭐ brain call site 3/3 — no power argument at all', BRAIN_PATH,
  '        } else match.performPass(p, passMate!, offsideExemptKick);', 1);
anchor('⭐ the wind-up resolution\'s own call — the LITERAL 1', MATCH_PATH,
  '    this.performPass(passer, mate, pp.offsideExempt, 1, pp.aimLead);', 1);
/* ⭐ THE MAXSPEED CONSTANTS (context for the free traps and BN-C0\'s C2 disclosure) */
anchor('CONTROL_MAX_SPEED', CONST_PATH, 'export const CONTROL_MAX_SPEED = 14;', 1,
  CONTROL_MAX_SPEED);
anchor('DEFLECT_MAX_SPEED', CONST_PATH, 'export const DEFLECT_MAX_SPEED = 24;', 1,
  DEFLECT_MAX_SPEED);
anchor('GRAVITY — the ground-launch test\'s own vz correction', CONST_PATH,
  'export const GRAVITY = 9.81;', 1, GRAVITY);
/* ⭐ THE ARMS' OWN COMPOSITION LINES, CALLED never copied */
anchor('⭐ WORLD 12\'s flag composition — world 11 CALLED, plus RA_WORLD_DOORS', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐⭐ the DOSE ARGUMENT is IGNORED for worlds 11/12 by construction (PT-C0 §P.D fact 2, '
  + 'BN-C0 inherited)', A4_PATH,
  '  if (isRaWorld(version)) {\n    armRaWorld(match, l3Dose, pcDose);\n    return;\n  }', 1);
anchor('⭐⭐ `edsTouchCost` IS ABSENT FROM THE WHOLE WORLD COMPOSER — world 12 never sets it, '
  + 'so the curve is whatever the constructor default says (0 occurrences is the receipt)',
  A4_PATH, 'edsTouchCost', 0);

/** ⭐⭐ K — the AFTERMATH window, read off the control-attempt law's own `readyTick` form.
 *  ⛔ NOT a typed constant of this census: it IS `CONTACT_CONTROL_DELAY_TICKS`, imported.
 *  BN-C0's settle ladder at +K, REUSED for the failed touch's aftermath. */
const K_TICKS = CONTACT_CONTROL_DELAY_TICKS;

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && RA_WORLD_VERSION === 12 && K_TICKS === 3 && GRAVITY === 9.81
  && TOUCH_SPEED_COST.base.span === 8 && TOUCH_SPEED_COST.base.weight === 0.07
  && TOUCH_SPEED_COST.heavy.span === 16 && TOUCH_SPEED_COST.heavy.weight === 0.24
  && CONTROL_MAX_SPEED === 14 && DEFLECT_MAX_SPEED === 24
  && PASS_POWER_MIN === 0.85 && PASS_POWER_MAX === 1.15;

/* ========================================================================== */
/* §4 SEEDS — block 12,541,000–999 (#382 item 6(vi))                           */
/* ========================================================================== */
const BLOCK_BASE = 12_541_000;
const BLOCK_TOP = 12_541_999;
/** ⭐⭐ N_FROZEN = 998 — the LARGEST N the block affords under #382 item 6's own cap (N ≤ 998)
 *  after the construction receipt at 12,541,999. Sized by the §DEV-PREFLIGHT 12-cluster
 *  scratch smoke, run BEFORE the freeze commit and BEFORE any battery seed. */
const N_FROZEN = 998;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_900;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const TRACE_INERT_SEEDS = [SCRATCH_BASE + 80, SCRATCH_BASE + 81];
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];
const OVERHEAD_SEEDS = Array.from({ length: 12 }, (_, i) => SCRATCH_BASE + 40 + i);

/* ========================================================================== */
/* §5 THE ARMS — TWO, PAIRED on shared seeds; the composer CALLED, never copied */
/* ========================================================================== */
const ARMS = ['E', 'D'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E: 'world 12 EMPTY-BOOK — the exams\' form',
  D: 'world 12 DOSED — THE FORM THE USER PLAYS',
};

/** ⭐⭐ THE DOSES, from the SHIPPED LOADERS THEMSELVES, with the two PINNED byte-hashes.
 *  canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a self-declared
 *  field" (home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6). */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
if (L3_DOSE_BYTES_SHA !== L3_DOSE_PIN || PC_DOSE_BYTES_SHA !== PC_DOSE_PIN) {
  banner('BQ-C0 FATAL — a dose file\'s BYTES do not match the pinned value (#382 item 6)');
  banner(`  l3 got ${L3_DOSE_BYTES_SHA} want ${L3_DOSE_PIN}`);
  banner(`  pc got ${PC_DOSE_BYTES_SHA} want ${PC_DOSE_PIN}`);
  process.exit(3);
}
let L3_DOSE: readonly L3DoseCell[] | null = null;
let PC_DOSE: PcDoseTable | null = null;
let DOSE_LOAD_ERROR: string | null = null;
try {
  L3_DOSE = await loadL3Dose();
  PC_DOSE = await loadPcDose();
} catch (err) {
  DOSE_LOAD_ERROR = String(err);
}
const DOSED_ARM_REACHABLE = L3_DOSE !== null && PC_DOSE !== null
  && L3_DOSE.some((c) => c.lunges > 0)
  && PC_DOSE.some((row) => row.some((v) => v > 0));
if (!DOSED_ARM_REACHABLE) {
  banner(`BQ-C0 FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** BN-C0's own population construction per seed, so the two arms differ ONLY in the doses. */
const buildMatch = (seed: number, arm: Arm, trace = true): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(RA_WORLD_VERSION), traceFirstTouch: trace, traceContests: trace,
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'E') armA4World(m, null, RA_WORLD_VERSION);
  else armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  return m;
};

/** ⭐⭐ THE CURVE, PINNED. Built once on a scratch match of each arm BEFORE the battery. */
const CURVE_PROBE = ARMS.map((arm) => ({
  arm, edsTouchCost: buildMatch(SCRATCH_BASE + 70, arm, false).edsTouchCost,
}));
const EDS_TOUCH_COST = CURVE_PROBE[0].edsTouchCost;
const CURVE_MEASURED: 'base' | 'heavy' = EDS_TOUCH_COST ? 'heavy' : 'base';
const OTHER_CURVE: 'base' | 'heavy' = EDS_TOUCH_COST ? 'base' : 'heavy';
const CURVE_UNANIMOUS = CURVE_PROBE.every((c) => c.edsTouchCost === EDS_TOUCH_COST);
if (EDS_TOUCH_COST) {
  banner('BQ-C0 ⚠⚠ edsTouchCost is TRUE in this process — the census measures the HEAVY curve '
    + 'and says so everywhere (#382 item 6(i)\'s own instruction).');
}

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"              */
/* ========================================================================== */

/** ⭐⭐ THE FOUR ADDENDS OF `raw`, recomputed from the LOGGED terms with the shipped arithmetic
 *  and the IMPORTED constants. ⛔ NO NEW CONSTANT: `TOUCH_SPEED_COST` is imported, and the
 *  floor 0.01, the weights 0.1 / 0.05, the aware form 0.6 and the multiplier 1.3 / 0.85 are
 *  anchored AT THEIR OWN SITES above. */
const TERMS = ['floor', 'speed', 'pressure', 'misalign'] as const;
type Term = (typeof TERMS)[number];
const TMI = (t: Term): number => TERMS.indexOf(t);
const FLOOR_TERM = 0.01;
const awareOf = (positioning: number): number => 1 - (positioning - 0.5) * 0.6;
const multOf = (technique: number): number => 1.3 - technique * 0.85;
const termsOf = (
  relativeSpeed: number, pressure: number, misalign: number, positioning: number, heavy: boolean,
): { addends: number[]; raw: number } => {
  const aware = awareOf(positioning);
  const cost = heavy ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base;
  const addends = [
    FLOOR_TERM,
    clamp01((relativeSpeed - 6) / cost.span) * cost.weight,
    pressure * 0.1 * aware,
    misalign * 0.05 * aware,
  ];
  return { addends, raw: sum(addends) };
};
/** ⭐⭐ THE RECOMPOSITION — the SHIPPED `touchFailChance` itself, CALLED. A non-own-touch entry
 *  must reproduce its logged pFail BIT-EXACTLY; an own-touch entry must reproduce 0.45 × it. */
const recomposeOf = (
  relativeSpeed: number, pressure: number, misalign: number, technique: number,
  positioning: number, heavy: boolean,
): number => touchFailChance(relativeSpeed, pressure, misalign, technique, positioning, heavy);
const RECOMP_CELLS = ['exact', 'ownTouch', 'neither'] as const;
type RecompCell = (typeof RECOMP_CELLS)[number];
const recompCellOf = (loggedPFail: number, recomposed: number): RecompCell => (
  loggedPFail === recomposed ? 'exact'
    : loggedPFail === recomposed * 0.45 ? 'ownTouch' : 'neither');

/** ⭐⭐ THE CAP-HIT TEST — pFail === the cap, within 1e-12 (the cap is anchored at its site). */
const CAP = 0.4;
const isCapHitOf = (pFail: number): boolean => Math.abs(pFail - CAP) <= 1e-12;

/** ⭐⭐ THE FREE TRAPS AND THE ROLL — the resolver's own classes, in the ENGINE'S OWN ORDER
 *  (`p.role === 'GK' || speed <= 6`, the keeper first). `notReached` is the resolver's own
 *  PRE-ROLL early returns (missing / sent-off / stunned body, or the retention margin) — it is
 *  NOT a free trap and this census never pools it into one. */
const RES_CELLS = ['rolled', 'freeTrapGk', 'freeTrapSlow', 'notReached'] as const;
type ResCell = (typeof RES_CELLS)[number];
const RSI = (c: ResCell): number => RES_CELLS.indexOf(c);
const FREE_TRAP_SPEED = 6;
const resCellOf = (rolled: boolean, isGk: boolean, relativeSpeed: number): ResCell => (
  rolled ? 'rolled'
    : isGk ? 'freeTrapGk'
      : relativeSpeed <= FREE_TRAP_SPEED ? 'freeTrapSlow' : 'notReached');

/** ⭐⭐ THE AFTERMATH LADDER — BN-C0's settle ladder at +K, REUSED verbatim, read from the
 *  FAILED receiver's own side. `unresolved` = the window ran past FULL TIME: COUNTED, and it
 *  enters no aftermath share. */
const HOLDS = ['sameSide', 'opponent', 'loose', 'out', 'unresolved'] as const;
type HoldOutcome = (typeof HOLDS)[number];
const HOI = (h: HoldOutcome): number => HOLDS.indexOf(h);
const holdOutcomeOf = (
  resolved: boolean, live: boolean, ownerSide: Side | null, receiverSide: Side,
): HoldOutcome => (!resolved ? 'unresolved'
  : !live ? 'out'
    : ownerSide === null ? 'loose'
      : ownerSide === receiverSide ? 'sameSide' : 'opponent');

/** ⭐ THE GROUND-LAUNCH TEST — RA-T1B's own, reused for the SPEED SOURCE's split. */
const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>
  grounded || !(vzAfterGravity > 0);

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* ⭐⭐ THE DECOMPOSITION on constructed terms */
fx('aware.neutralIsOne', awareOf(0.5), 1);
fx('aware.readerCutsThirty', near(awareOf(1), 0.7), true);
fx('aware.blindPaysThirty', near(awareOf(0), 1.3), true);
fx('mult.neutral', near(multOf(0.5), 0.875), true);
fx('mult.eliteIsLowest', near(multOf(1), 0.45), true);
fx('mult.worstIsHighest', near(multOf(0), 1.3), true);
fx('terms.floorIsTheOnlyTermAtRest',
  termsOf(6, 0, 0, 0.5, false).addends, [FLOOR_TERM, 0, 0, 0]);
fx('terms.slowBallHasNoSpeedTerm', termsOf(3, 0, 0, 0.5, false).addends[TMI('speed')], 0);
fx('terms.speedSaturatesAtTheSpan',
  near(termsOf(6 + TOUCH_SPEED_COST.base.span, 0, 0, 0.5, false).addends[TMI('speed')],
    TOUCH_SPEED_COST.base.weight), true);
fx('terms.speedIsCappedBeyondTheSpan',
  termsOf(99, 0, 0, 0.5, false).addends[TMI('speed')],
  termsOf(6 + TOUCH_SPEED_COST.base.span, 0, 0, 0.5, false).addends[TMI('speed')]);
fx('terms.pressureAtNeutralAware', near(termsOf(6, 1, 0, 0.5, false).addends[TMI('pressure')], 0.1),
  true);
fx('terms.misalignAtNeutralAware',
  near(termsOf(6, 0, 1, 0.5, false).addends[TMI('misalign')], 0.05), true);
fx('terms.awareScalesBothPenalties',
  near(termsOf(6, 1, 1, 1, false).addends[TMI('pressure')]
    + termsOf(6, 1, 1, 1, false).addends[TMI('misalign')], 0.15 * 0.7), true);
fx('terms.heavyCurveIsSteeper',
  termsOf(14, 0, 0, 0.5, true).addends[TMI('speed')]
    > termsOf(14, 0, 0, 0.5, false).addends[TMI('speed')], true);
/* ⭐⭐ THE RECOMPOSITION reproduces the SHIPPED law on constructed inputs */
for (const [s, pr, mi, te, po] of [
  [10, 0, 0, 0.5, 0.5], [14, 0.4, 0.6, 0.7, 0.3], [22, 1, 1, 0, 1], [7, 0.1, 0.9, 1, 0],
] as const) {
  const { raw } = termsOf(s, pr, mi, po, EDS_TOUCH_COST);
  fx(`recompose.matchesTheShippedLaw(${s},${pr},${mi},${te},${po})`,
    near(Math.min(Math.max(raw * multOf(te), 0), CAP),
      recomposeOf(s, pr, mi, te, po, EDS_TOUCH_COST)), true);
}
fx('recompose.capBites', recomposeOf(22, 1, 1, 0, 0, true), CAP);
fx('recompCell.exact', recompCellOf(0.123, 0.123), 'exact');
fx('recompCell.ownTouch', recompCellOf(0.2 * 0.45, 0.2), 'ownTouch');
fx('recompCell.neither', recompCellOf(0.31, 0.2), 'neither');
fx('capHit.atTheCap', isCapHitOf(CAP), true);
fx('capHit.belowTheCap', isCapHitOf(CAP - 1e-6), false);
/* ⭐⭐ THE FREE-TRAP CLASSIFIER — the engine's own order */
fx('res.rolledBeatsEverything', resCellOf(true, true, 3), 'rolled');
fx('res.keeperIsAFreeTrap', resCellOf(false, true, 20), 'freeTrapGk');
fx('res.keeperBeatsSlow', resCellOf(false, true, 2), 'freeTrapGk');
fx('res.sixIsFree', resCellOf(false, false, 6), 'freeTrapSlow');
fx('res.justAboveSixRolls', resCellOf(false, false, 6.0001), 'notReached');
fx('res.fastNoEntryIsNotReached', resCellOf(false, false, 12), 'notReached');
fx('res.theFreeSpeedIsTheEarlyReturnsOwn', FREE_TRAP_SPEED, 6);
/* ⭐⭐ THE AFTERMATH LADDER (BN-C0's, reused) */
fx('aft.sameSide', holdOutcomeOf(true, true, 0, 0), 'sameSide');
fx('aft.opponent', holdOutcomeOf(true, true, 1, 0), 'opponent');
fx('aft.loose', holdOutcomeOf(true, true, null, 0), 'loose');
fx('aft.outBeatsOwner', holdOutcomeOf(true, false, 0, 0), 'out');
fx('aft.unresolved', holdOutcomeOf(false, true, null, 0), 'unresolved');
fx('aft.windowIsTheReadyTickForm', K_TICKS, CONTACT_CONTROL_DELAY_TICKS);
fx('ground.groundedIs', isGroundLaunch(true, 9), true);
fx('ground.risingIsNot', isGroundLaunch(false, 0.1), false);
fx('ground.fallingIs', isGroundLaunch(false, -0.1), true);
/* the bin helpers */
fx('binOf.first', binOf(0.004, 0.01, 41), 0);
fx('binOf.capLandsInTheLastBin', binOf(CAP, 0.01, 41), 40);
fx('binOf.overflow', binOf(999, 2, 13), 12);
fx('binMedian.simple', binMedian([0, 0, 5, 0], 1), 2);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1)), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed).
   ⚠ Every width/count below is a BIN EDGE of a stored histogram — never a rule, never a
   threshold: no face's WORD depends on one, and every published cut re-derives off disk.    */
/* ========================================================================== */
const PFAIL_BIN = 0.01; const PFAIL_BINS = 41;      // #382 item 6(iii)'s own grid
const DECILE_BIN = 0.04; const DECILE_BINS = 10;    // the calibration deciles over [0, 0.4]
const MULT_BIN = 0.05; const MULT_BINS = 28;        // the technique multiplier, 0 .. 1.4
const SPD_BIN = 2; const SPD_BINS = 13;             // relative speed, 2 m/s
const UNIT_BIN = 0.1; const UNIT_BINS = 11;         // pressure · misalign · dribbling · positioning
const KNOCK_BIN = 0.5; const KNOCK_BINS = 16;       // the knock speed at the end of the fail tick
const LAUNCH_BIN = 2; const LAUNCH_BINS = 13;       // the pass's launch speed
const DIST_BIN = 5; const DIST_BINS = 13;           // passer→target distance
const GROUPS = ['intended', 'all'] as const;        // intended-target PRIMARY, all beside
type Group = (typeof GROUPS)[number];
const GI = (g: Group): number => GROUPS.indexOf(g);
const DEC_CELLS = ['intendedFailed', 'intendedAll', 'allFailed', 'allAll'] as const;
type DecCell = (typeof DEC_CELLS)[number];
const DCI = (c: DecCell): number => DEC_CELLS.indexOf(c);
const MARGINALS = ['relativeSpeed', 'pressure', 'misalign', 'dribbling', 'positioning'] as const;
type Marginal = (typeof MARGINALS)[number];
const MGI = (m: Marginal): number => MARGINALS.indexOf(m);
const MARGINAL_BINS: Record<Marginal, { width: number; bins: number }> = {
  relativeSpeed: { width: SPD_BIN, bins: SPD_BINS },
  pressure: { width: UNIT_BIN, bins: UNIT_BINS },
  misalign: { width: UNIT_BIN, bins: UNIT_BINS },
  dribbling: { width: UNIT_BIN, bins: UNIT_BINS },
  positioning: { width: UNIT_BIN, bins: UNIT_BINS },
};
const MARGINAL_MAX = Math.max(...MARGINALS.map((m) => MARGINAL_BINS[m].bins));

/* ========================================================================== */
/* §8 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))          */
/* ========================================================================== */
interface Row {
  worldOk: boolean; armedVersion: number; genomeClean: boolean; traceOn: boolean;
  rcBfAbsent: boolean; edsTouchCost: boolean; ticks: number; matches: number; wallMs: number;
  /* (i) THE POPULATION — control-attempt resolutions */
  resEnded: number; resAbandonedBeforeReady: number; resCandidates: number; resCell: number[];
  entries: number; entriesLinkedToResolution: number; entriesRelSpeedAgree: number;
  /* (ii) the adjudications, per group */
  gN: number[]; gFail: number[]; gSumPFail: number[]; gCapHit: number[];
  pFailBins: number[][]; decileN: number[][]; decileFail: number[][]; decileSumPFail: number[][];
  /* ⭐⭐ THE TERM DECOMPOSITION */
  decN: number[]; decShareSum: number[][]; decMultSum: number[]; decRawSum: number[];
  multBins: number[][];
  recompCell: number[]; ownTouchN: number; dribbleTagAgree: number;
  /* the marginals and the term distributions (INTENDED-TARGET adjudications) */
  margN: number[][]; margFail: number[][];
  /* the other curve */
  otherSumPFail: number[]; otherBins: number[][];
  /* the miscontrols cross-check */
  statMiscontrols: number; traceFails: number;
  /* THE FAIL'S AFTERMATH */
  aftN: number[]; aftLadder: number[][]; knockBins: number[][];
  /* THE SPEED SOURCE (intended-target adjudications linked to a release) */
  ssN: number; ssGround: number; ssLaunchSum: number; ssDistSum: number;
  ssLaunchN: number[]; ssLaunchFail: number[]; ssDistN: number[]; ssDistFail: number[];
  powerStruckAtChosen: number;
  /* context (the 240 s match clock) */
  goals: number; passes: number; passesCompleted: number; interceptions: number; shots: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1, genomeClean: false, traceOn: false, rcBfAbsent: false,
  edsTouchCost: false, ticks: 0, matches: 1, wallMs: 0,
  resEnded: 0, resAbandonedBeforeReady: 0, resCandidates: 0, resCell: zeros(RES_CELLS.length),
  entries: 0, entriesLinkedToResolution: 0, entriesRelSpeedAgree: 0,
  gN: zeros(2), gFail: zeros(2), gSumPFail: zeros(2), gCapHit: zeros(2),
  pFailBins: zeros2(2, PFAIL_BINS), decileN: zeros2(2, DECILE_BINS),
  decileFail: zeros2(2, DECILE_BINS), decileSumPFail: zeros2(2, DECILE_BINS),
  decN: zeros(DEC_CELLS.length), decShareSum: zeros2(DEC_CELLS.length, TERMS.length),
  decMultSum: zeros(DEC_CELLS.length), decRawSum: zeros(DEC_CELLS.length),
  multBins: zeros2(2, MULT_BINS),
  recompCell: zeros(RECOMP_CELLS.length), ownTouchN: 0, dribbleTagAgree: 0,
  margN: zeros2(MARGINALS.length, MARGINAL_MAX), margFail: zeros2(MARGINALS.length, MARGINAL_MAX),
  otherSumPFail: zeros(2), otherBins: zeros2(2, PFAIL_BINS),
  statMiscontrols: 0, traceFails: 0,
  aftN: zeros(2), aftLadder: zeros2(2, HOLDS.length), knockBins: zeros2(2, KNOCK_BINS),
  ssN: 0, ssGround: 0, ssLaunchSum: 0, ssDistSum: 0,
  ssLaunchN: zeros(LAUNCH_BINS), ssLaunchFail: zeros(LAUNCH_BINS),
  ssDistN: zeros(DIST_BINS), ssDistFail: zeros(DIST_BINS),
  powerStruckAtChosen: 0,
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0,
});

/* ========================================================================== */
/* §9 THE WALK — one match; PURE per-tick reads of `Match` state, NO WRAPPER.
   The E1a first-touch ledger is READ from its own public array, never re-implemented.       */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
const runOut = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };

const STAT_KEYS = ['goals', 'passes', 'passesCompleted', 'interceptions', 'shots',
  'miscontrols'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface PendingView { gid: number; readyTick: number; relativeSpeed: number }
interface Release {
  t: number; passerGid: number; targetGid: number; side: Side; releaseTick: number;
  launchSpeed: number; distance: number; ground: boolean;
}
/** a failed adjudication awaiting its +K aftermath read */
interface Fail { gid: number; side: Side; intended: boolean; done: boolean; outcome: HoldOutcome }

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingControl: PendingView | null;
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    traceFirstTouch: boolean; traceContests: boolean; edsTouchCost: boolean;
    pwChooserLedger: { struckAtChosenPower: number };
  };
  row.armedVersion = raArmedVersion(m);
  row.worldOk = row.armedVersion === RA_WORLD_VERSION;
  row.traceOn = mm.traceFirstTouch === true && mm.traceContests === true;
  row.edsTouchCost = mm.edsTouchCost === true;
  row.rcBfAbsent = mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      raAccessWeight?: number; passLeadSupport?: number; dvExposureWeight?: number;
      rcReadyWeight?: number;
    };
    return g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined && g.rcReadyWeight === undefined;
  });
  const players = m.allPlayers;
  let cursor = 0;
  let prevAttempt: PendingView | null = null;
  let release: Release | null = null;
  let prevPassT: number | null = mm.pendingPass?.t ?? null;
  const fails: Fail[] = [];
  const dueK = new Map<number, number[]>();

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    const ball = m.ball;
    const ballIsLive = m.phase === 'playing' || m.phase === 'restart';
    const ownerSide: Side | null = ball.owner !== null ? ball.owner.side as Side : null;

    /* ---------- THE DEFERRED AFTERMATH READS (BN-C0's ladder at +K) ---------- */
    const due = dueK.get(tick);
    if (due !== undefined) {
      for (const i of due) {
        fails[i].outcome = holdOutcomeOf(true, ballIsLive, ownerSide, fails[i].side);
        fails[i].done = true;
      }
      dueK.delete(tick);
    }

    /* ---------- THE RELEASE RECORD (the SPEED SOURCE's own reconstruction) ---------- */
    const prevRelease = release;
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    if (passT !== null && passT !== prevPassT && pp !== null) {
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const tgt = players[pp.targetGid];
      const psr = players[pp.passerGid];
      release = {
        t: passT, passerGid: pp.passerGid, targetGid: pp.targetGid, side: pp.side as Side,
        releaseTick: tick, launchSpeed: Math.hypot(ball.vel.x, ball.vel.y),
        distance: Math.hypot(tgt.pos.x - psr.pos.x, tgt.pos.y - psr.pos.y),
        ground: isGroundLaunch(grounded, vz0),
      };
    } else if (passT === null) release = null;
    prevPassT = passT;

    /* ---------- ⭐⭐ THE E1a LEDGER, READ (never re-implemented) ---------- */
    const trace = m.firstTouchTrace;
    const rolledThisTick = new Set<number>();
    for (let i = cursor; i < trace.length; i++) {
      const e = trace[i];
      rolledThisTick.add(e.gid);
      row.entries += 1;
      const failed = !e.clean;
      if (failed) row.traceFails += 1;
      /* the recomposition, from the LOGGED terms with the SHIPPED arithmetic */
      const recomposed = recomposeOf(
        e.relativeSpeed, e.pressure, e.misalign, e.technique, e.positioning, EDS_TOUCH_COST,
      );
      const cell = recompCellOf(e.pFail, recomposed);
      row.recompCell[RECOMP_CELLS.indexOf(cell)] += 1;
      const ownTouch = cell === 'ownTouch';
      if (ownTouch) row.ownTouchN += 1;
      const tagged = m.dribbleTouch !== null && m.dribbleTouch.gid === e.gid;
      if (tagged === ownTouch) row.dribbleTagAgree += 1;
      const { addends, raw } = termsOf(
        e.relativeSpeed, e.pressure, e.misalign, e.positioning, EDS_TOUCH_COST,
      );
      const mult = multOf(e.technique);
      const otherPFailBase = recomposeOf(
        e.relativeSpeed, e.pressure, e.misalign, e.technique, e.positioning, !EDS_TOUCH_COST,
      );
      const otherPFail = ownTouch ? otherPFailBase * 0.45 : otherPFailBase;
      const groups: Group[] = e.intendedTarget ? ['intended', 'all'] : ['all'];
      for (const g of groups) {
        const gi = GI(g);
        row.gN[gi] += 1;
        if (failed) row.gFail[gi] += 1;
        row.gSumPFail[gi] += e.pFail;
        if (isCapHitOf(e.pFail)) row.gCapHit[gi] += 1;
        row.pFailBins[gi][binOf(e.pFail, PFAIL_BIN, PFAIL_BINS)] += 1;
        const di = binOf(e.pFail, DECILE_BIN, DECILE_BINS);
        row.decileN[gi][di] += 1;
        row.decileSumPFail[gi][di] += e.pFail;
        if (failed) row.decileFail[gi][di] += 1;
        row.otherSumPFail[gi] += otherPFail;
        row.otherBins[gi][binOf(otherPFail, PFAIL_BIN, PFAIL_BINS)] += 1;
        row.multBins[gi][binOf(mult, MULT_BIN, MULT_BINS)] += 1;
        const decs: DecCell[] = g === 'intended'
          ? (failed ? ['intendedFailed', 'intendedAll'] : ['intendedAll'])
          : (failed ? ['allFailed', 'allAll'] : ['allAll']);
        for (const d of decs) {
          const ci = DCI(d);
          row.decN[ci] += 1;
          row.decMultSum[ci] += mult;
          row.decRawSum[ci] += raw;
          for (let t = 0; t < TERMS.length; t++) row.decShareSum[ci][t] += addends[t] / raw;
        }
      }
      /* the marginals and the term distributions — INTENDED-TARGET adjudications */
      if (e.intendedTarget) {
        const vals: Record<Marginal, number> = {
          relativeSpeed: e.relativeSpeed, pressure: e.pressure, misalign: e.misalign,
          dribbling: e.technique, positioning: e.positioning,
        };
        for (const mk of MARGINALS) {
          const bi = binOf(vals[mk], MARGINAL_BINS[mk].width, MARGINAL_BINS[mk].bins);
          row.margN[MGI(mk)][bi] += 1;
          if (failed) row.margFail[MGI(mk)][bi] += 1;
        }
      }
      /* THE SPEED SOURCE — the release live at this entry's tick */
      const link = (prevRelease !== null && prevRelease.targetGid === e.gid) ? prevRelease
        : (release !== null && release.targetGid === e.gid) ? release : null;
      if (e.intendedTarget && link !== null) {
        row.ssN += 1;
        if (link.ground) row.ssGround += 1;
        row.ssLaunchSum += link.launchSpeed;
        row.ssDistSum += link.distance;
        const lb = binOf(link.launchSpeed, LAUNCH_BIN, LAUNCH_BINS);
        const db = binOf(link.distance, DIST_BIN, DIST_BINS);
        row.ssLaunchN[lb] += 1; row.ssDistN[db] += 1;
        if (failed) { row.ssLaunchFail[lb] += 1; row.ssDistFail[db] += 1; }
      }
      /* THE FAIL'S AFTERMATH — schedule the +K read, book the knock speed NOW */
      if (failed) {
        const side = players[e.gid].side as Side;
        const idx = fails.push({
          gid: e.gid, side, intended: e.intendedTarget, done: false, outcome: 'unresolved',
        }) - 1;
        const arr = dueK.get(tick + K_TICKS);
        if (arr === undefined) dueK.set(tick + K_TICKS, [idx]); else arr.push(idx);
        const knock = Math.hypot(ball.vel.x, ball.vel.y);
        for (const g of groups) row.knockBins[GI(g)][binOf(knock, KNOCK_BIN, KNOCK_BINS)] += 1;
      }
    }
    cursor = trace.length;

    /* ---------- ⭐⭐ THE POPULATION — a pendingControl that RESOLVES ---------- */
    const cur = mm.pendingControl;
    if (prevAttempt !== null
      && (cur === null || cur.gid !== prevAttempt.gid || cur.readyTick !== prevAttempt.readyTick)) {
      row.resEnded += 1;
      if (tick < prevAttempt.readyTick) row.resAbandonedBeforeReady += 1;
      else {
        row.resCandidates += 1;
        const rolled = rolledThisTick.has(prevAttempt.gid);
        row.resCell[RSI(resCellOf(
          rolled, players[prevAttempt.gid].role === 'GK', prevAttempt.relativeSpeed,
        ))] += 1;
        if (rolled) {
          row.entriesLinkedToResolution += 1;
          const e = trace.find((x) => x.tick === tick && x.gid === prevAttempt!.gid);
          if (e !== undefined && e.relativeSpeed === prevAttempt.relativeSpeed) {
            row.entriesRelSpeedAgree += 1;
          }
        }
      }
    }
    prevAttempt = cur === null ? null : { ...cur };
    row.powerStruckAtChosen = mm.pwChooserLedger.struckAtChosenPower;
  }

  /* ---------- BOOK THE AFTERMATH ---------- */
  if (observe) {
    for (const f of fails) {
      const gs: Group[] = f.intended ? ['intended', 'all'] : ['all'];
      for (const g of gs) {
        const gi = GI(g);
        row.aftN[gi] += 1;
        row.aftLadder[gi][HOI(f.done ? f.outcome : 'unresolved')] += 1;
      }
    }
  }
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.shots = st[0].shots + st[1].shots;
  row.statMiscontrols = st[0].miscontrols + st[1].miscontrols;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 gTraceInert — BOTH TRACE FLAGS ONLY RECORD                              */
/* ========================================================================== */
banner('BQ-C0 — gTraceInert (both traces ON vs OFF, whole-match signatures, per arm)');
const traceInertRows = TRACE_INERT_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const on = signatureOf(runOut(buildMatch(seed, arm, true)));
  const off = signatureOf(runOut(buildMatch(seed, arm, false)));
  return { seed, arm, signatureTraceOn: on, signatureTraceOff: off, equal: on === off };
}));
const TRACE_INERT_OK = traceInertRows.every((r) => r.equal);
banner(`  gTraceInert ${TRACE_INERT_OK ? 'GREEN' : 'RED'} (${traceInertRows.length} arm × seed pairs)`);

/* ⭐ THE TRACE OVERHEAD, MEASURED (#382's run discipline asked for it). Two repetitions per
   state on the same scratch seeds, the FIRST discarded as a warm-up. ⚠ a machine reading on
   one machine, and a RECEIPT — never a football number. */
const benchMs = (trace: boolean): number => {
  const t = Date.now();
  for (const seed of OVERHEAD_SEEDS) runOut(buildMatch(seed, 'E', trace));
  return (Date.now() - t) / OVERHEAD_SEEDS.length;
};
benchMs(true);
const benchReps = [benchMs(true), benchMs(false), benchMs(true), benchMs(false),
  benchMs(true), benchMs(false)];
const OVERHEAD_ON = (benchReps[0] + benchReps[2] + benchReps[4]) / 3;
const OVERHEAD_OFF = (benchReps[1] + benchReps[3] + benchReps[5]) / 3;
banner(`  trace overhead: ON ${OVERHEAD_ON.toFixed(6)} ms/match · OFF ${OVERHEAD_OFF.toFixed(6)}`
  + ` ⇒ ${(OVERHEAD_ON - OVERHEAD_OFF).toFixed(6)} ms/match`);

/* ========================================================================== */
/* §11 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT             */
/* ========================================================================== */
banner('BQ-C0 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm × scratch-seed walks)`);

/* ========================================================================== */
/* §12 THE BATTERY — the two arms PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`BQ-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const arm of ARMS) rows[arm] = walkMatch(buildMatch(seed, arm), arm, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `walked ×${ARMS.length} arms (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const arm of ARMS) receiptRows[arm] = walkMatch(buildMatch(RECEIPT_SEED, arm), arm, true);
const walksBooked = (cells.length + 1) * ARMS.length;

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef { unit: string; what: string; den: string;
  num: (r: Row) => number; dn: (r: Row) => number }
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, den, num, dn }; };

/* ---- (i) THE POPULATION ---- */
defFace('population.resolutionsPerMatch', 'resolutions per match (240 s match clock)',
  '⭐⭐ (i) CONTROL-ATTEMPT RESOLUTIONS per match — a `pendingControl` that ENDS at or after '
  + 'its own `readyTick` (the resolver\'s own gate, anchored). ⚠ read through a TYPE VIEW of '
  + 'the `private pendingControl` field: a READ, never a write (§P.B declares it)',
  'matches walked', (r) => r.resCandidates, (r) => r.matches);
defFace('population.resolutionsEndedPerMatch', 'pending controls ended per match (240 s clock)',
  '(i) every `pendingControl` that ENDED, at any tick — the superset the resolutions are cut '
  + 'from', 'matches walked', (r) => r.resEnded, (r) => r.matches);
defFace('population.abandonedBeforeReadyShare', 'share',
  '(i) pending controls that ended BEFORE their `readyTick` — abandoned, never a resolution '
  + '(a restart, a `giveBall`, a dead ball). COUNTED and excluded from every resolution face',
  'pending controls ended', (r) => r.resAbandonedBeforeReady, (r) => r.resEnded);
for (const c of RES_CELLS) {
  const i = RSI(c);
  defFace(`population.cell.${c}`, 'share',
    `⭐⭐ (i) THE RESOLUTION SPLIT — \`${c}\`: ${c === 'rolled'
      ? 'a ROLLED ADJUDICATION (an E1a trace entry at this tick for this body)'
      : c === 'freeTrapGk' ? 'a FREE TRAP by the KEEPER branch of `attemptFirstTouch`\'s ONE '
        + 'early return (`p.role === \'GK\' || speed <= 6`) — no roll, no trace entry'
        : c === 'freeTrapSlow' ? 'a FREE TRAP by the `speed <= 6` branch of the SAME early '
          + 'return — no roll, no trace entry'
          : 'NOT REACHED — the RESOLVER\'S OWN pre-roll early returns (a missing / sent-off / '
            + 'stunned body, or the retention margin). ⛔ NOT a free trap and never pooled '
            + 'into one'}`,
    'control-attempt resolutions', (r) => r.resCell[i], (r) => r.resCandidates);
}
defFace('population.freeTrapShare', 'share',
  '⭐⭐ (i) THE FREE TRAPS — the two branches of `attemptFirstTouch`\'s one early return pooled '
  + '(keeper OR `speed <= 6`): the resolutions the world does NOT adjudicate',
  'control-attempt resolutions',
  (r) => r.resCell[RSI('freeTrapGk')] + r.resCell[RSI('freeTrapSlow')], (r) => r.resCandidates);
defFace('population.gkExemptionShare', 'share',
  '⭐ (i) THE GK EXEMPTION SHARE — resolutions taken by a keeper, who is clean without a roll',
  'control-attempt resolutions', (r) => r.resCell[RSI('freeTrapGk')], (r) => r.resCandidates);
defFace('population.adjudicationsPerMatch', 'adjudications per match (240 s match clock)',
  '⭐⭐ (i) ROLLED ADJUDICATIONS per match — E1a trace entries', 'matches walked',
  (r) => r.entries, (r) => r.matches);
defFace('population.entriesLinkedToResolutionShare', 'share',
  'THE LINKAGE RECEIPT — trace entries the probe matched to a resolving `pendingControl` at '
  + 'the same tick and gid. ⛔ never a football effect size',
  'rolled adjudications', (r) => r.entriesLinkedToResolution, (r) => r.entries);
defFace('population.relativeSpeedAgreementShare', 'share',
  'THE FROZEN-TERM RECEIPT — linked entries whose LOGGED `relativeSpeed` is BIT-EQUAL to the '
  + '`PendingControlAttempt`\'s own stored `relativeSpeed` (the resolver hands exactly that '
  + 'value to the roll, anchored). ⛔ never a football effect size',
  'entries linked to a resolution', (r) => r.entriesRelSpeedAgree,
  (r) => r.entriesLinkedToResolution);
defFace('population.intendedTargetShare', 'share',
  '⭐⭐ (i) THE INTENDED-TARGET SHARE of rolled adjudications — the PRIMARY population',
  'rolled adjudications', (r) => r.gN[GI('intended')], (r) => r.gN[GI('all')]);
defFace('population.intendedShareOfFailures', 'share',
  '⭐ (i) THE INTENDED-TARGET SHARE of FAILED adjudications', 'failed adjudications',
  (r) => r.gFail[GI('intended')], (r) => r.gFail[GI('all')]);

/* ---- (ii) THE ROLL'S LIVE CALIBRATION ---- */
for (const g of GROUPS) {
  const gi = GI(g);
  const lbl = g === 'intended' ? 'INTENDED-TARGET adjudications (PRIMARY)'
    : 'ALL adjudications (beside)';
  defFace(`roll.${g}.realisedFail`, 'share',
    `⭐⭐ (ii) THE REALISED FAIL SHARE — entries with \`clean === false\` — over ${lbl}`,
    `${lbl}`, (r) => r.gFail[gi], (r) => r.gN[gi]);
  defFace(`roll.${g}.meanPFail`, 'probability',
    `⭐⭐ (ii) THE MEAN LOGGED \`pFail\` — the coin's OWN declared weight — over ${lbl}. The `
    + 'CALIBRATION rule compares the realised fail share against THIS face\'s bootstrap '
    + 'interval (E1a\'s I1 form, live)', `${lbl}`, (r) => r.gSumPFail[gi], (r) => r.gN[gi]);
  defFace(`roll.${g}.capHitShare`, 'share',
    `(ii) THE CAP-HIT SHARE — \`pFail\` at the law's own cap 0.4 (within 1e-12) — over ${lbl}`,
    `${lbl}`, (r) => r.gCapHit[gi], (r) => r.gN[gi]);
  for (let i = 0; i < DECILE_BINS; i++) {
    defFace(`calibration.${g}.decile.b${i}.realisedFail`, 'share',
      `(ii) THE CALIBRATION PER pFail DECILE — realised fail share in decile ${i} `
      + `(pFail ${(i * DECILE_BIN).toFixed(2)}–${((i + 1) * DECILE_BIN).toFixed(2)}), ${lbl}`,
      `${lbl} in decile ${i}`, (r) => r.decileFail[gi][i], (r) => r.decileN[gi][i]);
    defFace(`calibration.${g}.decile.b${i}.meanPFail`, 'probability',
      `(ii) THE CALIBRATION PER pFail DECILE — mean logged pFail in decile ${i}, ${lbl}`,
      `${lbl} in decile ${i}`, (r) => r.decileSumPFail[gi][i], (r) => r.decileN[gi][i]);
  }
}

/* ---- ⭐⭐ (ii) THE TERM DECOMPOSITION ---- */
const DEC_LABEL: Record<DecCell, string> = {
  intendedFailed: 'FAILED INTENDED-TARGET adjudications — ⭐⭐ THE MAJORITY-TERM POPULATION',
  intendedAll: 'ALL intended-target adjudications',
  allFailed: 'ALL failed adjudications',
  allAll: 'ALL adjudications',
};
for (const d of DEC_CELLS) {
  const ci = DCI(d);
  for (const t of TERMS) {
    defFace(`decomposition.${d}.${t}.meanShare`, 'share of `raw`',
      `⭐⭐ (ii) THE TERM DECOMPOSITION — the MEAN SHARE of \`raw\` carried by the \`${t}\` `
      + `term over ${DEC_LABEL[d]}. The four addends are recomputed from the LOGGED terms with `
      + 'the SHIPPED arithmetic and IMPORTED constants: floor = 0.01 · speed = '
      + 'clamp01((relativeSpeed − 6) / span) · weight · pressure = pressure · 0.1 · aware · '
      + 'misalign = misalign · 0.05 · aware, with aware = 1 − (positioning − 0.5) · 0.6. ⚠ THE '
      + 'DECOMPOSITION IS OF `raw`, BEFORE the technique multiplier and BEFORE the cap — both '
      + 'are PURELY MULTIPLICATIVE on `raw`, so they scale every term equally and cannot move '
      + 'a share (the cap, where it bites, truncates the product and not the mix)',
      `${DEC_LABEL[d]}`, (r) => r.decShareSum[ci][TMI(t)], (r) => r.decN[ci]);
  }
  defFace(`decomposition.${d}.multiplierMean`, 'multiplier',
    `⭐ (ii) THE TECHNIQUE MULTIPLIER \`1.3 − 0.85 · dribbling\` — its MEAN over `
    + `${DEC_LABEL[d]}`, `${DEC_LABEL[d]}`, (r) => r.decMultSum[ci], (r) => r.decN[ci]);
  defFace(`decomposition.${d}.meanRaw`, 'probability (pre-multiplier)',
    `(ii) the MEAN \`raw\` over ${DEC_LABEL[d]}`, `${DEC_LABEL[d]}`,
    (r) => r.decRawSum[ci], (r) => r.decN[ci]);
}
for (const c of RECOMP_CELLS) {
  const i = RECOMP_CELLS.indexOf(c);
  defFace(`decomposition.recomposition.${c}`, 'share',
    `⭐⭐ THE RECOMPOSITION RECEIPT — \`${c}\`: ${c === 'exact'
      ? 'the SHIPPED `touchFailChance`, CALLED on the entry\'s own logged terms, reproduces '
        + 'the logged `pFail` BIT-EXACTLY'
      : c === 'ownTouch' ? 'the logged `pFail` is BIT-EXACTLY 0.45 × the recomposition — the '
        + 'own-touch discount, applied AFTER the clamp (anchored at its site)'
        : '⛔ NEITHER — a discrepancy class this census does not know. `gRecomposition` is RED '
          + 'unless this is exactly 0'}`,
    'rolled adjudications', (r) => r.recompCell[i], (r) => r.entries);
}
defFace('decomposition.ownTouchShare', 'share',
  '⭐⭐ THE OWN-TOUCH (×0.45) SHARE — detected ARITHMETICALLY from the ledger\'s own logged '
  + '`pFail` (exactly 0.45 × the recomposition), which is the ENGINE\'S OWN RECORD of the '
  + 'discount. ⛔ NOT read off `match.dribbleTouch`, which is mutable between the roll and the '
  + 'end of the tick', 'rolled adjudications', (r) => r.ownTouchN, (r) => r.entries);
defFace('decomposition.dribbleTagAgreementShare', 'share',
  'THE `dribbleTouch` CROSS-CHECK, a RECEIPT: the END-OF-TICK read of `match.dribbleTouch` '
  + '(PUBLIC state) agrees with the arithmetic own-touch detection. ⚠ a LAGGED read — a clean '
  + 'touch\'s `giveBall` can clear the tag inside the same tick — so disagreement is expected '
  + 'and the ARITHMETIC is the record. ⛔ never a football effect size',
  'rolled adjudications', (r) => r.dribbleTagAgree, (r) => r.entries);

/* ---- (ii) THE MARGINALS AND THE TERM DISTRIBUTIONS (intended-target adjudications) ---- */
for (const mk of MARGINALS) {
  const mi = MGI(mk);
  const { width, bins } = MARGINAL_BINS[mk];
  for (let i = 0; i < bins; i++) {
    defFace(`marginals.${mk}.b${i}.pFailRate`, 'share',
      `⭐ (ii) P(fail | ${mk} bin ${i}) — bin edges ${(i * width).toFixed(2)}`
      + `${i === bins - 1 ? '+ (overflow)' : `–${((i + 1) * width).toFixed(2)}`}, on `
      + 'INTENDED-TARGET adjudications',
      `intended-target adjudications in ${mk} bin ${i}`,
      (r) => r.margFail[mi][i], (r) => r.margN[mi][i]);
    defFace(`marginals.${mk}.b${i}.share`, 'share',
      `(ii) THE TERM DISTRIBUTION — the share of intended-target adjudications in ${mk} bin `
      + `${i}`, 'intended-target adjudications',
      (r) => r.margN[mi][i], (r) => sum(r.margN[mi]));
  }
}

/* ---- (ii) WHAT THE OTHER CURVE WOULD HAVE SAID (never scored) ---- */
for (const g of GROUPS) {
  const gi = GI(g);
  defFace(`otherCurve.${g}.meanPFail`, 'probability',
    `⭐ (ii) WHAT THE OTHER CURVE WOULD HAVE SAID — the \`${OTHER_CURVE}\` curve's \`pFail\` `
    + 'recomputed per adjudication from the SAME logged terms (the own-touch ×0.45 carried '
    + `over), meaned over ${g === 'intended' ? 'INTENDED-TARGET' : 'ALL'} adjudications. `
    + '⛔ AN EXPECTATION UNDER A COUNTERFACTUAL CURVE, NEVER A MEASURED SHARE and NEVER SCORED '
    + '— no coin was tossed at these values',
    `${g === 'intended' ? 'intended-target' : 'all'} adjudications`,
    (r) => r.otherSumPFail[gi], (r) => r.gN[gi]);
}

/* ---- (ii) THE miscontrols CROSS-CHECK ---- */
defFace('miscontrols.statPerMatch', 'miscontrols per match (240 s match clock)',
  '⭐ THE ENGINE\'S OWN `miscontrols` TEAM STAT, both teams pooled, per match',
  'matches walked', (r) => r.statMiscontrols, (r) => r.matches);
defFace('miscontrols.traceFailsPerMatch', 'failed adjudications per match (240 s match clock)',
  '⭐ THE E1a LEDGER\'S OWN FAIL COUNT per match', 'matches walked',
  (r) => r.traceFails, (r) => r.matches);
defFace('miscontrols.gapPerMatch', 'miscontrols per match (240 s match clock)',
  '⭐⭐ THE CROSS-CHECK GAP (stat − trace) per match. ⚠ A STRUCTURAL, SIGNED gap is EXPECTED '
  + 'and its cause is anchored: `.stats.miscontrols++` has TWO sites in `mechanics.ts` and '
  + 'BOTH are enumerated — `attemptFirstTouch`\'s (which pushes a trace entry) and '
  + '`tryChestTrap`\'s (which does NOT). A POSITIVE gap is the chest-trap spills',
  'matches walked', (r) => r.statMiscontrols - r.traceFails, (r) => r.matches);

/* ---- (ii) THE FAIL'S AFTERMATH (BN-C0's ladder at +K) ---- */
for (const g of GROUPS) {
  const gi = GI(g);
  defFace(`aftermath.${g}.failsPerMatch`, 'failed touches per match (240 s match clock)',
    `(ii) FAILED ${g === 'intended' ? 'intended-target' : ''} adjudications per match`,
    'matches walked', (r) => r.aftN[gi], (r) => r.matches);
  for (const h of HOLDS) {
    defFace(`aftermath.${g}.${h}`, 'share',
      `⭐⭐ (ii) THE FAIL'S AFTERMATH — BN-C0's settle ladder at +K (K = ${K_TICKS} ticks, the `
      + `control-attempt law's OWN \`readyTick\` offset) after a FAILED touch: \`${h}\`, read `
      + `from the FAILED RECEIVER'S OWN SIDE${h === 'unresolved'
        ? '. The window ran past FULL TIME: COUNTED here and it enters no other reading' : ''}`,
      `failed ${g === 'intended' ? 'intended-target ' : ''}adjudications`,
      (r) => r.aftLadder[gi][HOI(h)], (r) => r.aftN[gi]);
  }
}

/* ---- (ii) THE SPEED SOURCE ---- */
defFace('speedSource.linkedShare', 'share',
  'THE LINKAGE RECEIPT — intended-target adjudications the probe matched to a registered '
  + 'delivery (`pendingPass`) whose target is this body. ⛔ never a football effect size',
  'intended-target adjudications', (r) => r.ssN, (r) => r.gN[GI('intended')]);
defFace('speedSource.groundLaunchShare', 'share',
  '(ii) of the linked deliveries, the share launched along the GROUND (RA-T1B\'s own '
  + '`isGroundLaunch`, reused)', 'linked intended-target adjudications',
  (r) => r.ssGround, (r) => r.ssN);
defFace('speedSource.meanLaunchSpeed', 'metres per second',
  '⭐ (ii) THE PASS\'S LAUNCH SPEED — |ball.vel| at the END of the release tick. ⚠ A PROBE '
  + 'RECONSTRUCTION: the engine stores no launch speed anywhere. The launch-speed FORM '
  + '`clamp(d · 0.6 + 8.2, 9, 22) · executedMul` is anchored at its site',
  'linked intended-target adjudications', (r) => r.ssLaunchSum, (r) => r.ssN);
defFace('speedSource.meanDistance', 'metres',
  '⭐ (ii) THE PASSER→TARGET DISTANCE at the release tick. ⚠ A PROBE RECONSTRUCTION (the '
  + 'engine stores no pass distance); the strike\'s own `d` is measured to the LED point, this '
  + 'one to the target himself — declared',
  'linked intended-target adjudications', (r) => r.ssDistSum, (r) => r.ssN);
for (let i = 0; i < LAUNCH_BINS; i++) {
  defFace(`speedSource.launchBin.b${i}.pFailRate`, 'share',
    `⭐ (ii) P(fail | launch-speed bin ${i}) — bin edges ${i * LAUNCH_BIN} m/s`
    + `${i === LAUNCH_BINS - 1 ? '+ (overflow)' : `–${(i + 1) * LAUNCH_BIN} m/s`}`,
    `linked intended-target adjudications in launch bin ${i}`,
    (r) => r.ssLaunchFail[i], (r) => r.ssLaunchN[i]);
}
for (let i = 0; i < DIST_BINS; i++) {
  defFace(`speedSource.distanceBin.b${i}.pFailRate`, 'share',
    `(ii) P(fail | passer→target distance bin ${i}) — bin edges ${i * DIST_BIN} m`
    + `${i === DIST_BINS - 1 ? '+ (overflow)' : `–${(i + 1) * DIST_BIN} m`}`,
    `linked intended-target adjudications in distance bin ${i}`,
    (r) => r.ssDistFail[i], (r) => r.ssDistN[i]);
}
defFace('speedSource.powerStruckAtChosenPerMatch', 'strikes per match (240 s match clock)',
  '⭐⭐ THE ENGINE\'S OWN POWER LEDGER — `pwChooserLedger.struckAtChosenPower`, "strikes that '
  + 'reached `performPass` carrying a non-default weight" (the engine\'s own words). The '
  + '`powerAlwaysOne` boolean is TRUE iff this reads 0 on EVERY walked match on BOTH arms AND '
  + 'every enumerated `performPass` call site passes no weight or the LITERAL 1',
  'matches walked', (r) => r.powerStruckAtChosen, (r) => r.matches);

/* ---- CONTEXT (rates on the 240 s match clock; 1 sim-s = 22.5 display-s) ---- */
defFace('context.goalsPerMatch', 'goals per match (240 s match clock)', 'context — goals',
  'matches walked', (r) => r.goals, (r) => r.matches);
defFace('context.enginePassesPerMatch', 'passes per match (240 s match clock)',
  'context — the engine\'s own whole-match pass count (⚠ ALL deliveries)', 'matches walked',
  (r) => r.passes, (r) => r.matches);
defFace('context.passCompletion', 'share',
  'context — the engine\'s own whole-match pass completion (⚠ ALL deliveries)',
  'engine passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('context.interceptionsPerMatch', 'per match (240 s match clock)',
  'context — interceptions', 'matches walked', (r) => r.interceptions, (r) => r.matches);
defFace('context.shotsPerMatch', 'per match (240 s match clock)', 'context — shots',
  'matches walked', (r) => r.shots, (r) => r.matches);
defFace('context.ticksPerMatch', 'ticks per match', 'context — the walk\'s own tick count',
  'matches walked', (r) => r.ticks, (r) => r.matches);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const armRows = (arm: Arm): Row[] => cells.map((c) => c.rows[arm]);
const faces: FaceRow[] = [];
for (const arm of ARMS) {
  const rows = armRows(arm);
  for (const key of FACE_KEYS) {
    const f = FACES[key];
    const nu = rows.map((r) => f.num(r));
    const de = rows.map((r) => f.dn(r));
    const point = ratio(sum(nu), sum(de));
    const draws: number[] = [];
    for (const idx of resampleIndex) {
      let n = 0; let dd = 0;
      for (const i of idx) { n += nu[i]; dd += de[i]; }
      const v = ratio(n, dd);
      if (Number.isFinite(v)) draws.push(v);
    }
    draws.sort((a, b) => a - b);
    faces.push({
      face: key, arm, unit: f.unit, what: f.what, denNote: f.den,
      value: point, numerator: sum(nu), denominator: sum(de),
      ciLo: pctl(draws, 0.025), ciHi: pctl(draws, 0.975),
      halfWidth: (pctl(draws, 0.975) - pctl(draws, 0.025)) / 2,
    });
  }
}
const face = (k: string, arm: Arm): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === arm);
  if (f === undefined) { banner(`BQ-C0 FATAL — unknown face ${k}/${arm}`); process.exit(3); }
  return f as FaceRow;
};
/** ⭐⭐ THE PAIRED Δ (D − E) — the arms share seeds, so the interval is PAIRED by construction. */
interface DeltaRow {
  key: string; face: string; pair: string; armL: Arm; armR: Arm;
  leftValue: number; rightValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
}
const pairedDelta = (faceKey: string, armL: Arm, armR: Arm): DeltaRow => {
  const f = FACES[faceKey];
  const nl = cells.map((c) => f.num(c.rows[armL]));
  const dl = cells.map((c) => f.dn(c.rows[armL]));
  const nr = cells.map((c) => f.num(c.rows[armR]));
  const dr = cells.map((c) => f.dn(c.rows[armR]));
  const pl = ratio(sum(nl), sum(dl));
  const pr = ratio(sum(nr), sum(dr));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nl[i]; d1 += dl[i]; n2 += nr[i]; d2 += dr[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  const hw = (hi - lo) / 2;
  return {
    key: `${faceKey}@${armL}-${armR}`, face: faceKey, pair: `${armL}−${armR}`, armL, armR,
    leftValue: pl, rightValue: pr, delta: pl - pr,
    ciLo: lo, ciHi: hi, halfWidth: hw,
    absDeltaOverHalfWidth: ratio(Math.abs(pl - pr), hw),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
  };
};
const deltas: DeltaRow[] = FACE_KEYS.map((k) => pairedDelta(k, 'D', 'E'));

/* ========================================================================== */
/* §14 THE PRE-REGISTERED READS — #382 item 6(v)'s SENTENCES, VERBATIM.
   The SELECTOR is a STORED majority BOOLEAN per TERM (majority = mean share over FAILED
   INTENDED-TARGET adjudications > 0.5); if no term holds a majority, `noMajority` is true.
   canon, VERBATIM: "a counterfactual verdict sentence ('had X been scored, the rule would read
   W') quotes a word the instrument STORED by applying the frozen rule to X's stored interval;
   a universal sentence about a table ('every bin', 'the one bin') is a stored boolean or is
   not written".                                                                             */
/* ========================================================================== */
const READ_SENTENCES: Record<Term | 'noMajority', string> = {
  speed: 'THE FIRST TOUCH FAILS ON PASS WEIGHT — the speed term is named, and step ④\'s power '
    + 'chooser with it.',
  pressure: 'THE FIRST TOUCH FAILS UNDER PRESSURE — the pressure term is named.',
  misalign: 'THE FIRST TOUCH FAILS ON THE BLIND SIDE — the misalign term is named; the '
    + 'receiver\'s body returns as a quality term.',
  floor: 'THE FIRST TOUCH FAILS BY THE FLOOR — the roll\'s constant and its technique '
    + 'multiplier are named; the law\'s FORM is the commander\'s question.',
  noMajority: 'THE FIRST TOUCH FAILS ON A MIX — the commander decides with the table.',
};
const CALIB_SENTENCE = {
  calibrated: 'THE ROLL IS CALIBRATED ON WORLD 12',
  not: 'THE ROLL IS NOT CALIBRATED ON WORLD 12',
};
const AGREE_SENTENCE = {
  agrees: 'THE DOSED WORLD AGREES ON THE MAJORITY TERM',
  disagrees: 'THE DOSED WORLD DISAGREES ON THE MAJORITY TERM',
};
/** ⭐⭐ THE CALIBRATION RULE, FROZEN: `calibrated` iff the REALISED fail share lies INSIDE the
 *  2,000-draw cluster-bootstrap interval of the MEAN LOGGED pFail, on INTENDED-TARGET
 *  adjudications (E1a's I1 form, live). ⛔ Not a tolerance this census invented. */
const calibratedOf = (realised: number, ciLo: number, ciHi: number): boolean =>
  Number.isFinite(realised) && realised >= ciLo && realised <= ciHi;
const readFor = (arm: Arm): Record<string, unknown> => {
  const shares: Record<string, number> = {};
  const majority: Record<string, boolean> = {};
  for (const t of TERMS) {
    const v = face(`decomposition.intendedFailed.${t}.meanShare`, arm).value;
    shares[t] = v;
    majority[t] = Number.isFinite(v) && v > 0.5;
  }
  const winners = TERMS.filter((t) => majority[t]);
  const noMajority = winners.length !== 1;
  const majorityTerm: Term | 'noMajority' = noMajority ? 'noMajority' : winners[0];
  const realised = face('roll.intended.realisedFail', arm);
  const meanP = face('roll.intended.meanPFail', arm);
  const calibrated = calibratedOf(realised.value, meanP.ciLo, meanP.ciHi);
  return {
    arm, armLabel: ARM_LABEL[arm], shares, majority, noMajority, majorityTerm,
    sentence: READ_SENTENCES[majorityTerm],
    failedIntendedAdjudications: face('decomposition.intendedFailed.floor.meanShare', arm)
      .denominator,
    calibration: {
      realisedFail: realised.value, meanPFail: meanP.value,
      meanPFailCi: [meanP.ciLo, meanP.ciHi], calibrated,
      sentence: calibrated ? CALIB_SENTENCE.calibrated : CALIB_SENTENCE.not,
    },
  };
};
const READS = { E: readFor('E'), D: readFor('D') };
const E_MAJ = (READS.E as { majorityTerm: string }).majorityTerm;
const D_MAJ = (READS.D as { majorityTerm: string }).majorityTerm;
const DOSED_AGREES = E_MAJ === D_MAJ;
const AGREE_WORD = DOSED_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees;
/** ⭐ THE READ OF RECORD is selected on the E arm's stored booleans; D's are printed beside. */
const READ_OF_RECORD = (READS.E as { sentence: string }).sentence;
const CALIB_WORD = ((READS.E as { calibration: { sentence: string } }).calibration).sentence;
const READ_LIST = [READ_OF_RECORD, CALIB_WORD, AGREE_WORD];

/** ⭐⭐ `powerAlwaysOne` — a STORED boolean from the ENGINE'S OWN LEDGER (every walked match on
 *  both arms read `pwChooserLedger.struckAtChosenPower` = 0) AND the ENUMERATED call-site
 *  census (every `performPass(` site passes no weight or the LITERAL 1; the needle counts are
 *  anchored above). ⚠ the engine records no per-strike POWER anywhere else, so this is the
 *  honest channel and the census says so. */
const POWER_LEDGER_ZERO = ARMS.every((arm) => cells.every((c) => c.rows[arm].powerStruckAtChosen === 0)
  && receiptRows[arm].powerStruckAtChosen === 0);
const POWER_CALLSITES_DEFAULT = ANCHORS
  .filter((a) => a.what.includes('call site') || a.what.includes('wind-up resolution'))
  .every((a) => a.occurrences.length === a.want);
const POWER_ALWAYS_ONE = POWER_LEDGER_ZERO && POWER_CALLSITES_DEFAULT;

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form                                      */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised half-widths (seeds
 *  900,002,900–911), read out of the smoke artifact's own `faces[].halfWidth` fields on the E
 *  arm — never re-typed from the console's rounded print. The reads rest on the FOUR TERM-SHARE
 *  faces over FAILED INTENDED-TARGET adjudications, so those are what is sized. */
const SIZING_TARGET = 0.02;
const SIZING_TARGET_TIGHTER = 0.01;
const SIZED_FACES: { face: string; group: string; hwSmoke: number }[] = [
  { face: 'decomposition.intendedFailed.floor.meanShare@E',
    group: '⭐⭐ THE TERM DECOMPOSITION — floor share over FAILED intended-target, arm E',
    hwSmoke: 0.011946378699922516 },
  { face: 'decomposition.intendedFailed.speed.meanShare@E',
    group: '⭐⭐ THE TERM DECOMPOSITION — speed share over FAILED intended-target, arm E',
    hwSmoke: 0.05813210452909154 },
  { face: 'decomposition.intendedFailed.pressure.meanShare@E',
    group: '⭐⭐ THE TERM DECOMPOSITION — pressure share over FAILED intended-target, arm E',
    hwSmoke: 0.09736939744402595 },
  { face: 'decomposition.intendedFailed.misalign.meanShare@E',
    group: '⭐⭐ THE TERM DECOMPOSITION — misalign share over FAILED intended-target, arm E',
    hwSmoke: 0.05482260993702704 },
  { face: 'roll.intended.realisedFail@E',
    group: '⭐⭐ THE ROLL\'S LIVE CALIBRATION — realised fail share, arm E',
    hwSmoke: 0.034021875294656445 },
];
/** ⭐⭐ THE DECLARED HALF-WIDTH is `SIZING_TARGET` — the value the block CERTIFIES on every one
 *  of the five sized faces at N ≤ 998. The TIGHTER target is published beside on the same five
 *  faces so the reader sees exactly what the block does NOT afford. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  ...SIZED_FACES.map((r) => ({ ...r, target: SIZING_TARGET })),
  ...SIZED_FACES.map((r) => ({ ...r, target: SIZING_TARGET_TIGHTER })),
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, blockAffords: N_FROZEN,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired >= 0);

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
type Pooled = {
  resCell: number[]; pFailBins: number[][]; multBins: number[][];
  decileN: number[][]; margN: number[][]; margFail: number[][];
  otherBins: number[][]; aftLadder: number[][]; knockBins: number[][];
  ssLaunchN: number[]; ssDistN: number[]; recompCell: number[]; decN: number[];
};
const emptyPooled = (): Pooled => ({
  resCell: zeros(RES_CELLS.length), pFailBins: zeros2(2, PFAIL_BINS),
  multBins: zeros2(2, MULT_BINS), decileN: zeros2(2, DECILE_BINS),
  margN: zeros2(MARGINALS.length, MARGINAL_MAX), margFail: zeros2(MARGINALS.length, MARGINAL_MAX),
  otherBins: zeros2(2, PFAIL_BINS), aftLadder: zeros2(2, HOLDS.length),
  knockBins: zeros2(2, KNOCK_BINS), ssLaunchN: zeros(LAUNCH_BINS), ssDistN: zeros(DIST_BINS),
  recompCell: zeros(RECOMP_CELLS.length), decN: zeros(DEC_CELLS.length),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.resCell, r.resCell); addInto2(p.pFailBins, r.pFailBins);
    addInto2(p.multBins, r.multBins); addInto2(p.decileN, r.decileN);
    addInto2(p.margN, r.margN); addInto2(p.margFail, r.margFail);
    addInto2(p.otherBins, r.otherBins); addInto2(p.aftLadder, r.aftLadder);
    addInto2(p.knockBins, r.knockBins);
    addInto(p.ssLaunchN, r.ssLaunchN); addInto(p.ssDistN, r.ssDistN);
    addInto(p.recompCell, r.recompCell); addInto(p.decN, r.decN);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  pFail: GROUPS.map((_g, i) => binMedian(p.pFailBins[i], PFAIL_BIN)),
  otherCurvePFail: GROUPS.map((_g, i) => binMedian(p.otherBins[i], PFAIL_BIN)),
  techniqueMultiplier: GROUPS.map((_g, i) => binMedian(p.multBins[i], MULT_BIN)),
  knockSpeedMs: GROUPS.map((_g, i) => binMedian(p.knockBins[i], KNOCK_BIN)),
  launchSpeedMs: binMedian(p.ssLaunchN, LAUNCH_BIN),
  passDistanceMetres: binMedian(p.ssDistN, DIST_BIN),
  marginal: MARGINALS.map((mk) => binMedian(p.margN[MGI(mk)], MARGINAL_BINS[mk].width)),
});
const pooled = {} as Record<Arm, Pooled>;
const medians = {} as Record<Arm, Record<string, unknown>>;
for (const arm of ARMS) {
  pooled[arm] = poolFrom(armRows(arm));
  medians[arm] = mediansFrom(pooled[arm]);
}
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const tot = (arm: Arm, pick: (r: Row) => number): number =>
  armRows(arm).reduce((a, r) => a + pick(r), 0);
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, ...TRACE_INERT_SEEDS, ...OVERHEAD_SEEDS,
  SCRATCH_BASE + 70];

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((arm) => cells.every((c) => c.rows[arm].worldOk && c.rows[arm].traceOn
      && c.rows[arm].rcBfAbsent && c.rows[arm].genomeClean
      && c.rows[arm].edsTouchCost === EDS_TOUCH_COST)
      && receiptRows[arm].worldOk && receiptRows[arm].traceOn && receiptRows[arm].rcBfAbsent
      && receiptRows[arm].genomeClean && receiptRows[arm].edsTouchCost === EDS_TOUCH_COST)
      && CURVE_UNANIMOUS,
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: '
      + `\`raArmedVersion(m) === ${RA_WORLD_VERSION}\`; BOTH trace flags TRUE `
      + '(`traceFirstTouch` AND `traceContests`); every RC/BF flag ABSENT (`rcAnticipate`, '
      + '`rcReady`, `bfFacingCost` all !== true); `info.genome` carries NO world-12 pin, NO '
      + 'corridor weight and NO RC gene (canon: dose placement, #270.2 / #334 item 1); and '
      + `⭐⭐ THE CURVE IS PINNED — \`m.edsTouchCost\` reads ${EDS_TOUCH_COST} on every match `
      + `of both arms, so this census measured the ${CURVE_MEASURED.toUpperCase()} curve `
      + `({span ${(EDS_TOUCH_COST ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base).span}, `
      + `weight ${(EDS_TOUCH_COST ? TOUCH_SPEED_COST.heavy : TOUCH_SPEED_COST.base).weight}}) `
      + `and publishes the ${OTHER_CURVE.toUpperCase()} one beside`,
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE && L3_DOSE_BYTES_SHA === L3_DOSE_PIN
      && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arm takes its doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`, CALLED); this gate hashes the FILE BYTES this process '
      + `read from ${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them to the values PINNED `
      + 'in #382 item 6 — a mismatch is `process.exit(3)` BEFORE any seed is walked. '
      + `⚠ \`pcDoseGuard.bytesChecked\` is ${pcDoseGuard.bytesChecked} under bare node (the `
      + 'loader says so itself), which is exactly why this gate hashes the bytes independently',
  },
  gTraceInert: {
    ok: TRACE_INERT_OK,
    note: '⭐⭐ BOTH LEDGER FLAGS ONLY RECORD. `traceFirstTouch` is read at exactly ONE place — '
      + 'the `if (match.traceFirstTouch) {` push AFTER the roll (anchored), which cannot '
      + 'influence a roll that has already happened — and `traceContests` at `traceContact`\'s '
      + `own early return. PROVEN on shared out-of-band scratch seeds `
      + `${TRACE_INERT_SEEDS.join(', ')}: the same seed built with both traces ON and both OFF `
      + `yields a BYTE-IDENTICAL whole-match signature on all ${traceInertRows.length} arm × `
      + 'seed pairs',
  },
  gLedgerNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.entries) > 0
      && tot(arm, (r) => r.gN[GI('intended')]) > 0
      && tot(arm, (r) => r.gFail[GI('intended')]) > 0
      && tot(arm, (r) => r.resCandidates) > 0
      && tot(arm, (r) => r.resCandidates)
        - tot(arm, (r) => r.resCell[RSI('rolled')])
        === tot(arm, (r) => r.resCell[RSI('freeTrapGk')])
          + tot(arm, (r) => r.resCell[RSI('freeTrapSlow')])
          + tot(arm, (r) => r.resCell[RSI('notReached')])),
    note: '⛔ THE E1a LEDGER IS NON-VACUOUS ON BOTH ARMS: trace entries exist (E '
      + `${tot('E', (r) => r.entries)}, D ${tot('D', (r) => r.entries)}), INTENDED-TARGET `
      + `entries exist (E ${tot('E', (r) => r.gN[GI('intended')])}, D `
      + `${tot('D', (r) => r.gN[GI('intended')])}) and FAILURES exist (E `
      + `${tot('E', (r) => r.gFail[GI('intended')])}, D `
      + `${tot('D', (r) => r.gFail[GI('intended')])}). ⭐⭐ AND THE FREE-TRAP IDENTITY HOLDS on `
      + 'both arms: RESOLUTIONS − TRACE ENTRIES = the two free-trap branches PLUS the '
      + 'resolver\'s own pre-roll early returns (`notReached`), which this census publishes as '
      + 'its OWN class and never pools into a free trap. ⚠ LIVENESS only — never a direction',
  },
  gRecomposition: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.recompCell[RECOMP_CELLS.indexOf('neither')]) === 0)
      && receiptRows.E.recompCell[RECOMP_CELLS.indexOf('neither')] === 0
      && receiptRows.D.recompCell[RECOMP_CELLS.indexOf('neither')] === 0,
    note: '⭐⭐ THE RECOMPOSITION IS BIT-EXACT ON EVERY ENTRY. The SHIPPED `touchFailChance` is '
      + 'CALLED on each entry\'s own LOGGED terms with the PINNED curve, and the logged `pFail` '
      + 'equals either that value EXACTLY (`exact`) or EXACTLY 0.45 × it (`ownTouch`, the '
      + 'discount applied AFTER the clamp — anchored at its site). The `neither` class is '
      + `${tot('E', (r) => r.recompCell[RECOMP_CELLS.indexOf('neither')])} (E) and `
      + `${tot('D', (r) => r.recompCell[RECOMP_CELLS.indexOf('neither')])} (D) — this gate is `
      + 'RED unless BOTH are 0, on the battery AND on the construction receipt. ⇒ every term '
      + 'this census decomposes is the term the coin actually used',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites: THE LAW ITSELF `
      + '(`touchFailChance`\'s signature, the `aware` form with its 0.6, the curve selector, '
      + 'THE RAW EXPRESSION with the floor 0.01 and the weights 0.1 / 0.05, and the return with '
      + 'the multiplier 1.3 / 0.85 and the cap 0.4 — every constant AT ITS OWN SITE) · '
      + '`TOUCH_SPEED_COST`\'s TWO curves · `clamp`/`clamp01` · THE ADJUDICATION '
      + '(`attemptFirstTouch`\'s entry, the speed it reads, THE TWO FREE TRAPS in ONE early '
      + 'return, the misalign form, the `pressureAt` read, the six-argument call, THE ×0.45 '
      + 'OWN-TOUCH LINE, `rng.chance`, the ledger push, the record shape, the `miscontrols` '
      + 'branch, the knock and its cooldown) · BOTH `.stats.miscontrols++` SITES ENUMERATED '
      + '(canon: a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY '
      + 'occurrence\'s site) · THE RESOLVER (its gate, its pre-roll early returns, the '
      + 'retention margin, the roll, `giveBall`, THE readyTick FORM and '
      + '`CONTACT_CONTROL_DELAY_TICKS`, the private `pendingControl` field) · BOTH TRACE DOORS '
      + 'and the E1a array · THE CURVE DOOR, its default `?? EDS_BUNDLE_ARMED`, that constant\'s '
      + 'own line and `envArmed`\'s form · `edsTouchCost` ABSENT FROM THE WHOLE WORLD COMPOSER '
      + '(0 occurrences) · `pressureAt` and `PRESSURE_RADIUS_M` · THE LAUNCH-SPEED FORM, the '
      + 'power clamp, `PASS_POWER_MIN`/`PASS_POWER_MAX`, the power-1.0 inertness line, the '
      + 'engine\'s own `struckAtChosenPower` counter and EVERY `performPass(` CALL SITE '
      + 'ENUMERATED · `CONTROL_MAX_SPEED` · `DEFLECT_MAX_SPEED` · `GRAVITY` · world 12\'s flag '
      + 'composition and the RA branch that ignores the tables argument',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — THE DECOMPOSITION on constructed terms (the aware form at all three of its '
      + 'poles, the multiplier at all three, each addend in isolation, the speed term\'s '
      + 'saturation at its own span, and the heavy curve steeper than the base) · THE '
      + 'RECOMPOSITION against the SHIPPED `touchFailChance` CALLED on four constructed inputs '
      + 'and at the cap · the recomposition CLASSIFIER (exact / ownTouch / neither) · the '
      + 'cap-hit test · THE FREE-TRAP CLASSIFIER in the ENGINE\'S OWN ORDER (keeper first, then '
      + '`speed <= 6`, and `6` itself free) · THE AFTERMATH LADDER on constructed settle-window '
      + 'states including `unresolved` · the ground-launch test · every bin helper. All are '
      + 'PURE functions called by BOTH the walk and this table',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.decN[DCI('intendedFailed')]) > 0
      && tot(arm, (r) => r.resCell[RSI('freeTrapSlow')]) > 0
      && tot(arm, (r) => r.resCell[RSI('freeTrapGk')]) > 0
      && tot(arm, (r) => r.aftN[GI('intended')]) > 0
      && tot(arm, (r) => r.ssN) > 0
      && tot(arm, (r) => r.gCapHit[GI('all')]) >= 0
      && tot(arm, (r) => r.ownTouchN) >= 0),
    note: '⛔ no headline face is computed on an empty class: EVERY arm has FAILED '
      + `intended-target adjudications (E ${tot('E', (r) => r.decN[DCI('intendedFailed')])}, D `
      + `${tot('D', (r) => r.decN[DCI('intendedFailed')])}), BOTH free-trap branches (keeper E `
      + `${tot('E', (r) => r.resCell[RSI('freeTrapGk')])} / slow `
      + `${tot('E', (r) => r.resCell[RSI('freeTrapSlow')])}), aftermath events, and linked `
      + `speed-source deliveries (E ${tot('E', (r) => r.ssN)}, D ${tot('D', (r) => r.ssN)}). `
      + `⚠ the CAP-HIT class (E ${tot('E', (r) => r.gCapHit[GI('all')])}) and the OWN-TOUCH `
      + `class (E ${tot('E', (r) => r.ownTouchN)}) are reported with their own realised `
      + 'intervals whatever their size — ⛔ no null is cut anywhere in this census. ⚠ LIVENESS '
      + 'only — never a direction and never a magnitude',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + '`Match` state after `m.step(DT)` (the E1a ledger array, the `pendingControl` TYPE '
      + 'VIEW, `pendingPass`, `dribbleTouch`, the team stats and the power ledger), and the '
      + 'only engine function it calls is the SHIPPED `touchFailChance`, a PURE arithmetic '
      + 'query of numbers already logged. Proven anyway — the same scratch seed walked OBSERVED '
      + 'and UNOBSERVED yields a BYTE-IDENTICAL whole-match signature on all '
      + `${lockstepRows.length} arm × out-of-band-scratch-seed walks`,
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: 'worktree-vs-HEAD over `src/`: `git diff --stat HEAD -- src` AND '
      + '`git status --porcelain -- src` both EMPTY (canon: xSrcUntouched) — X-SRC-ZERO',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + 'the construction receipt lie inside block 12,541,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail is `
      + 'DECLARED in the `seeds` block, and EVERY scratch seed this instrument walks (lockstep, '
      + 'trace-inertness, the curve pin AND the trace-overhead bench) is out-of-band and STORED '
      + 'there — canon, VERBATIM: "verifier scratch walks use the stage\'s own consumed band or '
      + 'the out-of-band scratch range (≥ 900,000,000) — never the next virgin block"',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, and '
        + 'the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN} seeds × ${ARMS.length} arms`,
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon, VERBATIM: "an artifact is written as compact JSON
   — no indentation; the hash is over the canonical body regardless; pretty-printing is a
   reader's tool, not a storage form")                                                       */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed, ...Object.fromEntries(ARMS.map((arm) => [arm, c.rows[arm]])),
}));
const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'reads', 'medians', 'bins', 'definitions', 'arms',
  'curve', 'terms', 'resolutionCells', 'holdOutcomes', 'groups', 'decompositionCells',
  'marginals', 'recompositionCells', 'doseSource', 'seeds', 'stats', 'anchoredSites',
  'fixtures', 'lockstep', 'traceInert', 'perf', 'sizing', 'perSeedCells',
  'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BQ-C0',
    title: '「停球」 THE FIRST-TOUCH CENSUS — the E1a ledger read LIVE on world 12: every failed '
      + 'touch decomposed into the term that carried it, the roll\'s own calibration, and one '
      + 'frozen sentence naming what the quality law must address',
    doc: 'docs/world-model/BQ-C0-FIRST-TOUCH-CENSUS.md',
    lineage: 'PT-C0 → the RC arc → RC-T1b (FAIL) → BN-C0 (the bounce census: C1, a '
      + 'control-QUALITY event, is the majority class on both arms) → #382 item 5 (THE FAILING '
      + 'LAW, LOCATED) → #382 item 6 (this census). E1a built the ledger this census READS; '
      + 'E1b built the second curve it publishes beside. Both measured the law on STAGED passes '
      + 'in a HELD world (pressure 0, misalign ≈ 0); this is the first LIVE read on world 12.',
    censusFormOfRecord: 'docs/world-model/BN-C0-BOUNCE-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #382 item 6',
    contract: 'BK-BODYBALL-CONTRACT.md §2 M-BK.2 + §3 STATUS',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis and arms no mechanism. '
      + 'The READ SENTENCES of #382 item 6(v) are FROZEN LITERALS selected by STORED booleans. '
      + 'The commander rules.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS the shipped exports '
      + '(`touchFailChance` ITSELF, `TOUCH_SPEED_COST`, the composer, the dose loaders) and '
      + 'reads `Match` state per tick; the E1a first-touch ledger is READ, never '
      + 're-implemented. THERE IS NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte '
      + 'for byte PER ARM, and `gTraceInert` proves BOTH trace flags byte-inert.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3). WHAT IS READ FROM THE ENGINE: '
      + 'every ROLL TERM (relativeSpeed, pressure, misalign, technique, positioning, pFail, '
      + 'clean, intendedTarget) from the E1a ledger — NOTHING is re-derived from state; the '
      + 'RESOLUTION population from `pendingControl`\'s own record; the OWN-TOUCH class from '
      + 'the ledger\'s own logged pFail (exactly 0.45 × the recomposition); the `miscontrols` '
      + 'team stat; the POWER ledger `pwChooserLedger.struckAtChosenPower`; the aftermath from '
      + '`ball.owner` / `phase`. WHAT IS A HEURISTIC, SAID SO: (1) the SPEED SOURCE — the '
      + 'engine records no launch speed, no pass distance and no per-strike power, so the '
      + 'launch speed is |ball.vel| at the END of the release tick and the distance is '
      + 'passer→target at that tick (the strike\'s own `d` is measured to the LED point); (2) '
      + 'the KNOCK SPEED is |ball.vel| at the END of the fail tick, one tick of physics after '
      + 'the knock itself; (3) the `dribbleTouch` tag cross-check is an END-OF-TICK read of a '
      + 'mutable field and is a RECEIPT only — the arithmetic own-touch detection is the record.',
    privateFieldRead: '⚠ DECLARED: `Match.pendingControl` is `private` (anchored at its own '
      + 'line). The census reads it through a TypeScript TYPE VIEW — a READ of engine state, '
      + 'never a write, and `gLockstep` proves the whole observation byte-inert. There is no '
      + 'public mirror of the control-attempt queue.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bq-c0-first-touch-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bq-c0-first-touch-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((arm) => ({
    arm, label: ARM_LABEL[arm],
    composition: arm === 'E'
      ? 'a4MatchFlags(12) as construction flags + armA4World(m, null, 12) — the EMPTY-BOOK form.'
      : 'a4MatchFlags(12) + armA4World(m, null, 12, l3Dose, pcDose) via the SHIPPED LOADERS — '
        + 'THE FORM THE USER PLAYS. The tables argument cannot reach worlds 11/12 at all '
        + '(anchored), so the two arms differ ONLY in the two DOSES.',
    constructorTrace: 'traceFirstTouch: true AND traceContests: true (BOTH arms; `gTraceInert` '
      + 'proves both byte-inert)',
    gate: `raArmedVersion(m) === ${RA_WORLD_VERSION}`,
  })),
  curve: {
    pinnedEdsTouchCost: EDS_TOUCH_COST,
    measured: CURVE_MEASURED,
    other: OTHER_CURVE,
    constants: TOUCH_SPEED_COST,
    unanimousAcrossArms: CURVE_UNANIMOUS,
    probe: CURVE_PROBE,
    note: '⭐⭐ `this.edsTouchCost = cfg.edsTouchCost ?? EDS_BUNDLE_ARMED` (anchored) and '
      + '`edsTouchCost` appears ZERO times in the whole world composer (anchored at want 0), so '
      + 'world 12 never sets it and the value is the env default. This process refuses the '
      + '`EDS_BUNDLE` env at its §1 envelope, so the pinned value is what a shipped world 12 '
      + `gets. THE CENSUS MEASURED THE ${CURVE_MEASURED.toUpperCase()} CURVE and publishes the `
      + `${OTHER_CURVE.toUpperCase()} one beside, NEVER scored.`,
  },
  definitions: {
    population: '⭐⭐ EVERY CONTROL-ATTEMPT RESOLUTION: a `pendingControl` that ENDS at a tick '
      + 'AT OR AFTER its own `readyTick` (the resolver\'s own gate `if (attempt === null || '
      + 'this.stepCount < attempt.readyTick) return false;`, anchored). A pending control that '
      + 'ends EARLIER was abandoned by another path and is COUNTED SEPARATELY '
      + '(`population.abandonedBeforeReadyShare`), never a resolution.',
    theSplit: '⭐⭐ ROLLED ADJUDICATIONS = the E1a trace entries (one per roll). FREE TRAPS = '
      + '`attemptFirstTouch`\'s ONE early return, in the ENGINE\'S OWN ORDER: a KEEPER first, '
      + 'then a ball at `speed <= 6` — no roll, no rng draw, NO trace entry. ⛔ A THIRD CLASS '
      + 'IS PUBLISHED RATHER THAN POOLED: `notReached`, the RESOLVER\'S OWN pre-roll early '
      + 'returns (a missing / sent-off / stunned body, or the retention margin), which never '
      + 'reach `attemptFirstTouch` at all. The identity RESOLUTIONS − TRACE ENTRIES = free '
      + 'traps + notReached is a GATE (`gLedgerNonVacuous`).',
    theSpeed: '⭐ the roll\'s `speed` IS the `PendingControlAttempt`\'s own frozen '
      + '`relativeSpeed` (the resolver hands it in; anchored), which is what the free-trap test '
      + '`speed <= 6` reads and what the ledger logs. The agreement between the two is a '
      + 'published receipt.',
    theDecomposition: '⭐⭐ THE FOUR ADDENDS OF `raw`, recomputed from the LOGGED terms with the '
      + 'SHIPPED arithmetic and IMPORTED constants — floor = 0.01 · speed = clamp01(('
      + 'relativeSpeed − 6) / span) · weight · pressure = pressure · 0.1 · aware · misalign = '
      + 'misalign · 0.05 · aware, aware = 1 − (positioning − 0.5) · 0.6. Each term\'s MEAN '
      + 'SHARE is the mean over entries of (term / raw). ⚠ THE DECOMPOSITION IS OF `raw`, '
      + 'BEFORE the technique multiplier `1.3 − 0.85 · technique` and BEFORE the cap 0.4: both '
      + 'act on the PRODUCT and scale every term equally, so neither can move a share — the '
      + 'multiplier\'s own distribution and the cap-hit share are published separately so the '
      + 'reader sees what they do.',
    theRecomposition: '⭐⭐ THE SHIPPED `touchFailChance` is CALLED on each entry\'s logged '
      + 'terms. A non-own-touch entry\'s logged pFail equals it BIT-EXACTLY; an own-touch entry '
      + '(the ×0.45 discount, applied AFTER the clamp) equals EXACTLY 0.45 × it. Any third '
      + 'class turns `gRecomposition` RED.',
    theCalibration: '⭐⭐ FROZEN RULE: `calibrated` iff the REALISED fail share (entries with '
      + '`clean === false` / entries) lies INSIDE the 2,000-draw cluster-bootstrap interval of '
      + 'the MEAN LOGGED pFail, on INTENDED-TARGET adjudications — E1a\'s I1 form, live. The '
      + 'calibration per pFail DECILE is published beside.',
    theAftermath: `⭐⭐ BN-C0's settle ladder at +K, K = ${K_TICKS} ticks read off the `
      + 'control-attempt law\'s own `readyTick` form (a CONSTANT offset; anchored), read from '
      + 'the FAILED RECEIVER\'S OWN side: sameSide / opponent / loose / out, plus `unresolved` '
      + 'for a window that ran past FULL TIME (COUNTED, entering no other reading).',
    theOtherCurve: `⭐ the \`${OTHER_CURVE}\` curve's pFail recomputed per adjudication from `
      + 'the SAME logged terms (the own-touch ×0.45 carried over). ⛔ AN EXPECTATION UNDER A '
      + 'COUNTERFACTUAL CURVE — no coin was tossed at those values — NEVER a measured share and '
      + 'NEVER scored.',
    powerAlwaysOne: '⭐⭐ a STORED boolean: the ENGINE\'S OWN `pwChooserLedger.'
      + 'struckAtChosenPower` ("strikes that reached `performPass` carrying a non-default '
      + 'weight" — the engine\'s own words) reads 0 on EVERY walked match on BOTH arms, AND '
      + 'every `performPass(` call site is ENUMERATED and passes no weight or the LITERAL 1. '
      + '⚠ The engine records no per-strike power anywhere else; this is the honest channel.',
    kTicks: K_TICKS,
    freeTrapSpeed: FREE_TRAP_SPEED,
    cap: CAP,
    binEdges: {
      note: '⚠ every width/count here is a BIN EDGE of a stored histogram — never a rule and '
        + 'never a threshold: no read word depends on one.',
      pFail: { width: PFAIL_BIN, bins: PFAIL_BINS },
      calibrationDecile: { width: DECILE_BIN, bins: DECILE_BINS },
      techniqueMultiplier: { width: MULT_BIN, bins: MULT_BINS },
      relativeSpeedMs: { width: SPD_BIN, bins: SPD_BINS },
      unitTerms: { width: UNIT_BIN, bins: UNIT_BINS },
      knockSpeedMs: { width: KNOCK_BIN, bins: KNOCK_BINS },
      launchSpeedMs: { width: LAUNCH_BIN, bins: LAUNCH_BINS },
      distanceM: { width: DIST_BIN, bins: DIST_BINS },
    },
    engineConstants: {
      floor: FLOOR_TERM, pressureWeight: 0.1, misalignWeight: 0.05, awareSlope: 0.6,
      multiplierBase: 1.3, multiplierSlope: 0.85, cap: CAP, ownTouchDiscount: 0.45,
      freeTrapSpeed: FREE_TRAP_SPEED, TOUCH_SPEED_COST,
      CONTACT_CONTROL_DELAY_TICKS, CONTROL_MAX_SPEED, DEFLECT_MAX_SPEED,
      PASS_POWER_MIN, PASS_POWER_MAX, DT, GRAVITY,
      note: '⛔ NO NEW CONSTANT: every value here is the engine\'s own, anchored at its own '
        + 'site in §3\'s table or IMPORTED (`TOUCH_SPEED_COST`, the constants module).',
    },
  },
  terms: TERMS, resolutionCells: RES_CELLS, holdOutcomes: HOLDS, groups: GROUPS,
  decompositionCells: DEC_CELLS, marginals: MARGINALS, recompositionCells: RECOMP_CELLS,
  doseSource: {
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_PIN, [PC_DOSE_FILE]: PC_DOSE_PIN },
    matchesPins: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN,
    l3NonEmpty: (L3_DOSE ?? []).some((c) => c.lunges > 0),
    pcNonEmpty: (PC_DOSE ?? []).some((r) => r.some((v) => v > 0)),
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  anchoredSites: ANCHORS, fixtures: FIXTURES, lockstep: lockstepRows,
  traceInert: traceInertRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,002,900–911), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. N_FROZEN takes #382 item 6(vi)\'s own cap (N ≤ 998) — the largest the block '
      + 'affords after the construction receipt at 12,541,999.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: N_FROZEN, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces, deltas,
  reads: {
    note: '⭐⭐ #382 item 6(v)\'s SENTENCES are FROZEN LITERALS. The selector is the STORED '
      + 'majority boolean per TERM (majority = mean share of `raw` over FAILED INTENDED-TARGET '
      + 'adjudications > 0.5); if no term holds a majority, `noMajority` is true and the MIX '
      + 'sentence prints. The calibration sentence is selected by the STORED `calibrated` '
      + 'boolean. The READ OF RECORD is selected on the E arm\'s booleans; D\'s are printed '
      + 'BESIDE at the same precision and the same prominence.',
    sentences: READ_SENTENCES, calibrationSentences: CALIB_SENTENCE,
    agreementSentences: AGREE_SENTENCE,
    E: READS.E, D: READS.D,
    dosedAgreesOnMajorityTerm: DOSED_AGREES,
    agreementSentencePrinted: AGREE_WORD,
    readOfRecord: READ_OF_RECORD,
    calibrationSentencePrinted: CALIB_WORD,
    readListPrinted: READ_LIST,
    powerAlwaysOne: POWER_ALWAYS_ONE,
    powerLedgerZeroOnEveryWalk: POWER_LEDGER_ZERO,
    powerCallSitesAllDefault: POWER_CALLSITES_DEFAULT,
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off the '
      + 'SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY published '
      + 'face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((arm) => [arm, {
    resolutionCell: { vocabulary: RES_CELLS, pooled: pooled[arm].resCell },
    pFail: { width: PFAIL_BIN, bins: PFAIL_BINS, groups: GROUPS, pooled: pooled[arm].pFailBins },
    otherCurvePFail: { width: PFAIL_BIN, bins: PFAIL_BINS, groups: GROUPS,
      pooled: pooled[arm].otherBins },
    techniqueMultiplier: { width: MULT_BIN, bins: MULT_BINS, groups: GROUPS,
      pooled: pooled[arm].multBins },
    calibrationDecile: { width: DECILE_BIN, bins: DECILE_BINS, groups: GROUPS,
      pooled: pooled[arm].decileN },
    marginalN: { vocabulary: MARGINALS, widths: MARGINALS.map((mk) => MARGINAL_BINS[mk]),
      pooled: pooled[arm].margN },
    marginalFail: { vocabulary: MARGINALS, pooled: pooled[arm].margFail },
    aftermathLadder: { vocabulary: HOLDS, groups: GROUPS, pooled: pooled[arm].aftLadder },
    knockSpeedMs: { width: KNOCK_BIN, bins: KNOCK_BINS, groups: GROUPS,
      pooled: pooled[arm].knockBins },
    launchSpeedMs: { width: LAUNCH_BIN, bins: LAUNCH_BINS, pooled: pooled[arm].ssLaunchN },
    passDistanceMetres: { width: DIST_BIN, bins: DIST_BINS, pooled: pooled[arm].ssDistN },
    recompositionCell: { vocabulary: RECOMP_CELLS, pooled: pooled[arm].recompCell },
    decompositionN: { vocabulary: DEC_CELLS, pooled: pooled[arm].decN },
  }])),
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length, armsPerSeed: ARMS.length,
    constructionReceiptSeed: RECEIPT_SEED, walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    traceInertScratchSeedsWalked: TRACE_INERT_SEEDS,
    traceOverheadScratchSeedsWalked: OVERHEAD_SEEDS,
    curvePinScratchSeedWalked: SCRATCH_BASE + 70,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    smokeScratchSeeds: [SCRATCH_BASE, SCRATCH_BASE + 11],
    smokeReceiptSeed: SCRATCH_BASE + 20,
    bootstrapRngSeededFrom: BLOCK_BASE, bootstrapDraws: BOOTSTRAP,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, arm) => a + armRows(arm).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / (cells.length * ARMS.length),
    traceOverhead: {
      matchesPerState: OVERHEAD_SEEDS.length, warmupDiscarded: true,
      msPerMatchTracesOn: OVERHEAD_ON, msPerMatchTracesOff: OVERHEAD_OFF,
      msPerMatchOverhead: OVERHEAD_ON - OVERHEAD_OFF, repetitions: benchReps,
      repetitionsPerState: 3,
      note: '⚠ A MACHINE READING ON ONE MACHINE, and a RECEIPT — never a football number.',
    },
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'and both ledgers\' recording cost included — never the game\'s frame cost.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
    + 'the artifact stores that list verbatim or stores none" (home: '
    + 'RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). THIS '
    + 'ARTIFACT STORES NONE. The list of record is '
    + 'docs/world-model/BQ-C0-FIRST-TOUCH-CENSUS.md §HONEST LIMITS.',
  perSeedCells, constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: (Record<Arm, Row> & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<Arm, Record<string, { pooled?: unknown }>>;
  medians: { values: Record<Arm, Record<string, unknown>> };
  reads: Record<string, unknown>;
  sizing: { rows: typeof sizingRows };
};
/** ⭐ JSON HAS NO NaN LITERAL: a face computed on an EMPTY class is NaN and `JSON.stringify`
 *  writes it as `null`. The gate recognises `null` as the SERIALIZATION of NaN — and nothing
 *  else: any other value must match BIT FOR BIT. */
const sameNum = (got: number, stored: number | null): boolean => (Number.isNaN(got)
  ? (stored === null || Number.isNaN(stored)) : got === stored);
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = disk.perSeedCells.map((c) => c[f.arm]);
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  faceChecks.push({
    face: `${f.face}@${f.arm}`,
    ok: nu === f.numerator && de === f.denominator && sameNum(ratio(nu, de), f.value),
  });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.face];
  const l = disk.perSeedCells.map((c) => c[dd.armL]);
  const r = disk.perSeedCells.map((c) => c[dd.armR]);
  const pl = ratio(sum(l.map((x) => def.num(x))), sum(l.map((x) => def.dn(x))));
  const pr = ratio(sum(r.map((x) => def.num(x))), sum(r.map((x) => def.dn(x))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: sameNum(pl, dd.leftValue) && sameNum(pr, dd.rightValue) && sameNum(pl - pr, dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
for (const arm of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[arm]);
  const got = poolFrom(rows);
  const b = disk.bins[arm];
  const cmp = (key: string, want: unknown): void => {
    binChecks.push({ bin: `${arm}.${key}`,
      ok: JSON.stringify(want) === JSON.stringify(b[key]?.pooled ?? []) });
  };
  cmp('resolutionCell', got.resCell);
  cmp('pFail', got.pFailBins);
  cmp('otherCurvePFail', got.otherBins);
  cmp('techniqueMultiplier', got.multBins);
  cmp('calibrationDecile', got.decileN);
  cmp('marginalN', got.margN);
  cmp('marginalFail', got.margFail);
  cmp('aftermathLadder', got.aftLadder);
  cmp('knockSpeedMs', got.knockBins);
  cmp('launchSpeedMs', got.ssLaunchN);
  cmp('passDistanceMetres', got.ssDistN);
  cmp('recompositionCell', got.recompCell);
  cmp('decompositionN', got.decN);
  binChecks.push({ bin: `${arm}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[arm]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${arm}.partition.resolutionCellsSumToResolutions`,
    ok: sum(got.resCell) === sum(rows.map((r) => r.resCandidates)) });
  binChecks.push({ bin: `${arm}.partition.freeTrapIdentity`,
    ok: sum(rows.map((r) => r.resCandidates)) - got.resCell[RSI('rolled')]
      === got.resCell[RSI('freeTrapGk')] + got.resCell[RSI('freeTrapSlow')]
        + got.resCell[RSI('notReached')] });
  binChecks.push({ bin: `${arm}.partition.recompositionSumsToEntries`,
    ok: sum(got.recompCell) === sum(rows.map((r) => r.entries)) });
  binChecks.push({ bin: `${arm}.partition.groupsSumToEntries`,
    ok: sum(rows.map((r) => r.gN[GI('all')])) === sum(rows.map((r) => r.entries))
      && sum(rows.map((r) => r.gN[GI('intended')]))
        <= sum(rows.map((r) => r.gN[GI('all')])) });
  binChecks.push({ bin: `${arm}.partition.pFailBinsSumToGroups`,
    ok: GROUPS.every((_g, i) => sum(got.pFailBins[i]) === sum(rows.map((r) => r.gN[i]))
      && sum(got.otherBins[i]) === sum(rows.map((r) => r.gN[i]))
      && sum(got.multBins[i]) === sum(rows.map((r) => r.gN[i]))
      && sum(got.decileN[i]) === sum(rows.map((r) => r.gN[i]))) });
  binChecks.push({ bin: `${arm}.partition.decompositionCounts`,
    ok: got.decN[DCI('intendedAll')] === sum(rows.map((r) => r.gN[GI('intended')]))
      && got.decN[DCI('allAll')] === sum(rows.map((r) => r.gN[GI('all')]))
      && got.decN[DCI('intendedFailed')] === sum(rows.map((r) => r.gFail[GI('intended')]))
      && got.decN[DCI('allFailed')] === sum(rows.map((r) => r.gFail[GI('all')])) });
  binChecks.push({ bin: `${arm}.partition.aftermathSumsToFails`,
    ok: GROUPS.every((_g, i) => sum(got.aftLadder[i]) === sum(rows.map((r) => r.aftN[i]))
      && sum(got.aftLadder[i]) === sum(rows.map((r) => r.gFail[i]))
      && sum(got.knockBins[i]) === sum(rows.map((r) => r.gFail[i]))) });
  binChecks.push({ bin: `${arm}.partition.marginalsSumToIntended`,
    ok: MARGINALS.every((mk) => sum(got.margN[MGI(mk)])
      === sum(rows.map((r) => r.gN[GI('intended')]))) });
  binChecks.push({ bin: `${arm}.partition.speedSourceBinsSumToLinked`,
    ok: sum(got.ssLaunchN) === sum(rows.map((r) => r.ssN))
      && sum(got.ssDistN) === sum(rows.map((r) => r.ssN)) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells */
for (const arm of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[arm]);
  const den = sum(rows.map((r) => r.decN[DCI('intendedFailed')]));
  const stored = disk.reads[arm] as {
    shares: Record<string, number | null>; majority: Record<string, boolean>;
    noMajority: boolean; majorityTerm: string; sentence: string;
    failedIntendedAdjudications: number;
    calibration: { realisedFail: number | null; meanPFail: number | null;
      meanPFailCi: [number, number]; calibrated: boolean; sentence: string };
  };
  const shares = Object.fromEntries(TERMS.map(
    (t) => [t, ratio(sum(rows.map((r) => r.decShareSum[DCI('intendedFailed')][TMI(t)])), den)],
  ));
  const majority = Object.fromEntries(TERMS.map(
    (t) => [t, Number.isFinite(shares[t]) && shares[t] > 0.5],
  ));
  const winners = TERMS.filter((t) => majority[t]);
  const noMajority = winners.length !== 1;
  const majorityTerm = noMajority ? 'noMajority' : winners[0];
  binChecks.push({ bin: `reads.${arm}.sharesRederive`,
    ok: TERMS.every((t) => sameNum(shares[t], stored.shares[t]))
      && den === stored.failedIntendedAdjudications });
  binChecks.push({ bin: `reads.${arm}.majorityBooleansRederive`,
    ok: TERMS.every((t) => majority[t] === stored.majority[t])
      && noMajority === stored.noMajority && majorityTerm === stored.majorityTerm });
  binChecks.push({ bin: `reads.${arm}.sentenceIsTheFrozenLiteral`,
    ok: READ_SENTENCES[majorityTerm as Term | 'noMajority'] === stored.sentence
      && (Object.values(READ_SENTENCES) as string[]).includes(stored.sentence) });
  /* ⭐⭐ THE CALIBRATION BOOLEAN, re-derived off disk */
  const realised = ratio(sum(rows.map((r) => r.gFail[GI('intended')])),
    sum(rows.map((r) => r.gN[GI('intended')])));
  const meanP = ratio(sum(rows.map((r) => r.gSumPFail[GI('intended')])),
    sum(rows.map((r) => r.gN[GI('intended')])));
  const ci = disk.faces.find((f) => f.face === 'roll.intended.meanPFail' && f.arm === arm);
  const cal = calibratedOf(realised, ci?.ciLo ?? Number.NaN, ci?.ciHi ?? Number.NaN);
  binChecks.push({ bin: `reads.${arm}.calibrationRederives`,
    ok: sameNum(realised, stored.calibration.realisedFail)
      && sameNum(meanP, stored.calibration.meanPFail)
      && cal === stored.calibration.calibrated
      && (cal ? CALIB_SENTENCE.calibrated : CALIB_SENTENCE.not) === stored.calibration.sentence
      && (Object.values(CALIB_SENTENCE) as string[]).includes(stored.calibration.sentence) });
}
{
  const eMaj = (disk.reads.E as { majorityTerm: string }).majorityTerm;
  const dMaj = (disk.reads.D as { majorityTerm: string }).majorityTerm;
  binChecks.push({ bin: 'reads.dosedAgreementIsStored',
    ok: (eMaj === dMaj) === (disk.reads.dosedAgreesOnMajorityTerm as boolean)
      && (disk.reads.agreementSentencePrinted as string)
        === (eMaj === dMaj ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && (disk.reads.readOfRecord as string)
        === (disk.reads.E as { sentence: string }).sentence
      && (disk.reads.calibrationSentencePrinted as string)
        === (disk.reads.E as { calibration: { sentence: string } }).calibration.sentence });
  const rows = ARMS.flatMap((a) => disk.perSeedCells.map((c) => c[a]));
  binChecks.push({ bin: 'reads.powerAlwaysOneIsStored',
    ok: (disk.reads.powerLedgerZeroOnEveryWalk as boolean)
      === rows.every((r) => r.powerStruckAtChosen === 0)
      && (disk.reads.powerAlwaysOne as boolean)
        === ((disk.reads.powerLedgerZeroOnEveryWalk as boolean)
          && (disk.reads.powerCallSitesAllDefault as boolean)) });
}
/** ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step */
for (const r of disk.sizing.rows) {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
  binChecks.push({
    bin: `sizing.${r.face}@${r.target}`,
    ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded && nReq === r.nRequired
      && hwAtN === r.expectedHalfWidthAtNFrozen
      && hwAtN * ZSUM / Z975 === r.mdeAtNFrozen
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} stored-bin / median / `
    + 'partition / READ-WORD / sizing checks re-derived from the SERIALIZED artifact off disk — '
    + 'canon, VERBATIM: "the re-derivation gate covers EVERY published face; a percentile face '
    + 'requires stored bins". The read sentences, EVERY majority boolean, the CALIBRATION '
    + 'boolean and `powerAlwaysOne` are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: every majority boolean, the `noMajority` '
    + 'flag, the majority TERM, the CALIBRATION boolean and its sentence, `powerAlwaysOne` and '
    + 'the dosed-agreement word are re-derived by applying the FROZEN rules to the SERIALIZED '
    + 'per-seed cells off disk, and every printed sentence must be one of the frozen literals. '
    + 'canon, VERBATIM: "a universal sentence about a table (\'every bin\', \'the one bin\') is '
    + 'a stored boolean or is not written"',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
artifact.allGreen = Object.values(gates).every((g) => g.ok);

/* ---- THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt ---- */
const SCHEMA_COMPLETE = BODY_SCHEMA.every((k) => artifact[k] !== undefined)
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail')
  && !(BODY_SCHEMA as readonly string[]).includes('receipts');
gates.gHashOrder = {
  ok: SCHEMA_COMPLETE,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
    + `${BODY_SCHEMA.length}-key schema is complete, covers the per-seed cells and the `
    + 'construction receipt, and EXCLUDES `hashedBodySha256`, `gFacesDetail` and `receipts`; '
    + 'the body hash is computed LAST — after every body key is assigned — and a NON-body '
    + '`receipts.hashReproducesFromFile` records that it reproduces from the written file',
};
artifact.gates = gates;
const ALL_GREEN_FINAL = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN_FINAL;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after every gate */
const OUT_PATH = ALL_GREEN_FINAL ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
const HASH_REPRODUCES_FROM_FILE = (() => {
  const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();
artifact.receipts = {
  what: '⭐⭐ canon, VERBATIM: "the body hash is computed after every body key is assigned, and '
    + 'a NON-body receipt field records that the hash reproduces from the written file" (home: '
    + 'RC-T1A-PRECUE-EXAM.md §COMMANDER CORRECTIONS item 3, ruling #372 item 3). This block is '
    + 'OUTSIDE `BODY_SCHEMA` by construction.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential. The FINAL file byte-hash and byte count are recomputed after the final '
    + 'write and PUBLISHED IN THE DOC\'s §R.',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');
const HASH_REPRODUCES_FINAL = (() => {
  const onDisk = JSON.parse(FINAL_BYTES) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`BQ-C0 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner(`--- THE CURVE: edsTouchCost = ${EDS_TOUCH_COST} ⇒ measured ${CURVE_MEASURED}, other `
  + `${OTHER_CURVE} ---`);
banner('--- §R1 THE POPULATION AND THE LIVE CALIBRATION ---');
for (const arm of ARMS) {
  banner(`  ${arm} resolutions/match ${f6(face('population.resolutionsPerMatch', arm).value)} · `
    + `freeTrap ${f6(face('population.freeTrapShare', arm).value)} · notReached `
    + `${f6(face('population.cell.notReached', arm).value)} · adjudications/match `
    + `${f6(face('population.adjudicationsPerMatch', arm).value)} · intendedShare `
    + `${f6(face('population.intendedTargetShare', arm).value)}`);
  banner(`    realisedFail(intended) ${f6(face('roll.intended.realisedFail', arm).value)} vs `
    + `meanPFail ${f6(face('roll.intended.meanPFail', arm).value)} `
    + `[${f6(face('roll.intended.meanPFail', arm).ciLo)}, `
    + `${f6(face('roll.intended.meanPFail', arm).ciHi)}] ⇒ calibrated=`
    + `${((READS[arm] as { calibration: { calibrated: boolean } }).calibration).calibrated}`);
}
banner('');
banner('--- §R2 ⭐⭐ THE TERM DECOMPOSITION (FAILED intended-target) ---');
for (const arm of ARMS) {
  banner(`  ${arm} ${TERMS.map((t) => `${t} `
    + `${f6(face(`decomposition.intendedFailed.${t}.meanShare`, arm).value)}`).join(' · ')}`
    + `  n=${face('decomposition.intendedFailed.floor.meanShare', arm).denominator}`);
  banner(`    majority = ${(READS[arm] as { majorityTerm: string }).majorityTerm}`
    + `  mult ${f6(face('decomposition.intendedFailed.multiplierMean', arm).value)}`
    + `  capHit ${f6(face('roll.intended.capHitShare', arm).value)}`
    + `  ownTouch ${f6(face('decomposition.ownTouchShare', arm).value)}`);
}
banner('');
banner('--- §R8 THE READS, PRINTED ---');
for (const s of READ_LIST) banner(`  ${s}`);
banner(`  (E majority ${E_MAJ} · D majority ${D_MAJ} · powerAlwaysOne ${POWER_ALWAYS_ONE})`);
banner('');
banner('--- §R4/§R5/§R6 (E arm) ---');
banner(`  otherCurve(${OTHER_CURVE}) meanPFail intended `
  + `${f6(face('otherCurve.intended.meanPFail', 'E').value)} vs live `
  + `${f6(face('roll.intended.meanPFail', 'E').value)}`);
banner(`  miscontrols stat/match ${f6(face('miscontrols.statPerMatch', 'E').value)} vs trace `
  + `${f6(face('miscontrols.traceFailsPerMatch', 'E').value)} gap `
  + `${f6(face('miscontrols.gapPerMatch', 'E').value)}`);
banner(`  aftermath(intended) ${HOLDS.map((h) => `${h} `
  + `${f6(face(`aftermath.intended.${h}`, 'E').value)}`).join(' · ')}`);
banner(`  speedSource launch ${f6(face('speedSource.meanLaunchSpeed', 'E').value)} m/s · dist `
  + `${f6(face('speedSource.meanDistance', 'E').value)} m · linked `
  + `${f6(face('speedSource.linkedShare', 'E').value)}`);
banner('');
banner('--- SIZING INPUTS (read these into SIZING_INPUTS before the freeze) ---');
for (const r of SIZING_INPUTS) {
  const [k, a] = r.face.split('@');
  banner(`  ${r.face} hwSmoke ${face(k, a as Arm).halfWidth}`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch).toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
