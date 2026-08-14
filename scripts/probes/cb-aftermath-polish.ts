/**
 * CB — THE KNOCK AFTERMATH POLISH (docs/world-model/CB-AFTERMATH-POLISH.md).
 *
 * Contract CB-CARRY-BEAT-CONTRACT.md §2 M-CB.1(b), dispatched by ruling #272.4(a) as a
 * SEAM-HONESTY CORRECTION (not a new mechanism). Everything this probe scores — both fixes'
 * forms, the lifetime derivation, the A/B read list, the gate list, the N rule and the seed
 * ledger — is FROZEN in the stage doc IN ITS OWN COMMIT, before this file existed (#266.3(c)).
 *
 * ⭐ THE A/B IS ACROSS TWO BUILDS. `CBAP_ARM=pre` runs on the PRE-FIX build (the freeze commit,
 * = HEAD~ of the fix commit); `CBAP_ARM=post` runs on the POST-FIX build. The probe FILE is
 * byte-identical across both runs (its own sha is recorded in each artifact and asserted equal
 * in `combine`), the seeds are the same list, and every artifact carries the SRC FINGERPRINTS
 * that say which build produced it (`gArmsDistinct`). `CBAP_MODE=combine` reads both artifacts
 * off disk and publishes the paired A/B with the frozen gate battery.
 *
 * ⭐ THE LIFETIME LAW IS RE-DERIVED INDEPENDENTLY HERE — from `BALL_FRICTION_K`, `TURN_RATE` and
 * the recollect constants — and NEVER imported from `carryBeat.ts`, so the gate is a check and
 * not a tautology (and so the identical file runs against the PRE build, where the engine-side
 * law does not exist yet).
 *
 * ⭐ ENV SURFACE — WHITELISTED-OR-REFUSE (#261.2 / #262.2), including the ENGINE's own doors:
 *   accepted: CBAP_MODE (sizing|arm|combine, REQUIRED) · CBAP_ARM (pre|post, REQUIRED for
 *   sizing|arm) · CBAP_N · CBAP_SIZING_N · CBAP_SKIP_FP · CBAP_OUT
 * Anything else `CBAP_*`, or ANY engine door, is a FATAL refusal (exit 2). Every override makes
 * the run a PREFLIGHT: G-ENV-CLEAN goes RED and a canonical repo path may never be written.
 *
 * RUN: CBAP_MODE=sizing  CBAP_ARM=pre  npx tsx scripts/probes/cb-aftermath-polish.ts
 *      CBAP_MODE=arm     CBAP_ARM=pre  npx tsx scripts/probes/cb-aftermath-polish.ts
 *      CBAP_MODE=arm     CBAP_ARM=post npx tsx scripts/probes/cb-aftermath-polish.ts
 *      CBAP_MODE=combine                npx tsx scripts/probes/cb-aftermath-polish.ts
 * EXIT: 0 = every HARD gate green · 1 = a gate is RED · 2 = a refusal · 3 = a liveness refusal.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { League } from '../../src/sim/League';
import { Match } from '../../src/sim/Match';
import { runHeadless } from '../../src/sim/simRunner';
import {
  BALL_FRICTION_K, CONTEST_RADIUS, CONTROL_RADIUS, DT,
  TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
} from '../../src/sim/constants';
import { beatsDefender } from '../../src/sim/carryBeat';
import { TURN_RATE } from '../../src/sim/Player';
import { a4MatchFlags, armA4World, cbArmedVersion } from '../../src/game/a4World';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 FROZEN CONSTANTS                                                         */
/* ========================================================================== */
const SELF_PATH = 'scripts/probes/cb-aftermath-polish.ts';
const MECHANICS_PATH = 'src/sim/mechanics.ts';
const CARRYBEAT_PATH = 'src/sim/carryBeat.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const SIZING_PATH = 'docs/world-model/data/cb-aftermath-polish-sizing.json';
const ARM_PATH: Record<'pre' | 'post', string> = {
  pre: 'docs/world-model/data/cb-aftermath-polish-pre.json',
  post: 'docs/world-model/data/cb-aftermath-polish-post.json',
};
const COMBINE_PATH = 'docs/world-model/data/cb-aftermath-polish.json';

const FINGERPRINT_SEASONS = 2;
const FINGERPRINT_BASELINE =
  '57b0bdab389122af5e4cacd75c4e13020b8ff248a413a7fcd71cc6215ba4c673';
/** the banked production-identity baselines (CB-T0 §1, inherited verbatim). */
const LEAGUE_IDENT_BASELINES: readonly { seed: number; baseline: string }[] = [
  { seed: 1337, baseline: FINGERPRINT_BASELINE },
  { seed: 20260728, baseline: 'c6e319a45693424d707f0faeb2b5f7561955af9bd07a33e2da6a7f13533ff080' },
  { seed: 424242, baseline: '45d98c7441765fde680d1d42fcb228a7631416980bba40ec92b85be042a39f26' },
];
/** the CB play entry's own arming (a4World §CB): the world both arms are measured in. */
const CB_WORLD_VERSION = 6;
/**
 * ⭐ THE LAW-CHECK TOLERANCE, DERIVED (not chosen) — ⚠ AMENDMENT to the frozen `1e-9`, declared
 * in the stage doc §DEV with its receipts. `recoveryInterval`'s turn leg is `acos(x)/TURN_RATE`,
 * and `acos` is ILL-CONDITIONED at the aligned corner: a knock struck straight along the
 * knocker's own momentum has `x → 1`, where a ONE-ULP difference in `x` (the unavoidable
 * residue of re-deriving the release state from the world instead of reading the engine's own
 * locals) becomes `θ = sqrt(2·ε)` of angle. Propagated through the leg, the largest disagreement
 * an honest independent re-derivation can show is therefore
 *
 *     sqrt(2 · Number.EPSILON) / TURN_RATE  =  2.107e-8 rad / 6.5 rad·s⁻¹  ≈  3.24e-9 s
 *
 * — five orders of magnitude below one tick, and shown arithmetic rather than a tuned bar.
 */
const LAW_TOL = Math.sqrt(2 * Number.EPSILON) / TURN_RATE;
/** the incumbent hand constant the production push keeps (`performDribbleTouch`). */
const INCUMBENT_MARKER_S = 1.6;
/** the ARM's own marker in the PRE build, and the common yardstick for read 5b. */
const FIXED_HORIZON_TICKS = Math.round(INCUMBENT_MARKER_S / DT);
/** how long after an expiry the knocker's label is re-read for the ABANDON test (frozen). */
const ABANDON_LOOKAHEAD_TICKS = 12;
/** race tracking cap (s) — long enough that no derived lifetime can reach it. */
const RACE_CAP_S = 8;
/** identity: the trajectory is sampled every this many ticks. */
const IDENT_SAMPLE_TICKS = 30;
/** the reference probe's own reaction test: steering within 60° of the ball (#272.3's ruler). */
const COS60 = Math.cos(Math.PI / 3);

const BOOT_B = 2000;
const STATS_BASE = 110_400;
const STATS_FLOOR = 110_400;
const PUBLISHED_BASES = [104_000, 105_000, 106_000, 107_000, 108_000,
  109_000, 109_800, 110_000, 110_200];

const N_CAP = 200;
const N_FLOOR = 60;
const N_EVENTS = 300; // events of the rarest scored cell the precision term targets

/* ========================================================================== */
/* §2 ⭐ ENV — WHITELIST-OR-REFUSE + THE PREFLIGHT ROUTING                     */
/* ========================================================================== */
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const ENV_WHITELIST = ['CBAP_MODE', 'CBAP_ARM', 'CBAP_N', 'CBAP_SIZING_N',
  'CBAP_SKIP_FP', 'CBAP_OUT'] as const;
const ENGINE_DOORS = [
  'EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'EDS_SCALE_PITCH', 'EDS_SCALE_SPEED', 'EDS_SCALE_BALL', 'EDS_SCALE_TIME', 'EDS_SCALE_STAMINA',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE',
] as const;
const rogue = Object.keys(process.env)
  .filter((k) => k.startsWith('CBAP_') && !(ENV_WHITELIST as readonly string[]).includes(k));
if (rogue.length > 0) {
  banner(`FATAL: unrecognised env ${rogue.join(', ')} — whitelist-or-refuse (#261.2)`);
  process.exit(2);
}
const doorsSet = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (doorsSet.length > 0) {
  banner(`FATAL: the ENGINE's own doors are set (${doorsSet.join(', ')}) — refused (#262.2)`);
  process.exit(2);
}
const MODES = ['sizing', 'arm', 'combine'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.CBAP_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner('FATAL: CBAP_MODE is REQUIRED and must be one of sizing|arm|combine');
  process.exit(2);
}
type ArmName = 'pre' | 'post';
const ARM = process.env.CBAP_ARM as ArmName | undefined;
if (MODE !== 'combine' && (ARM === undefined || (ARM !== 'pre' && ARM !== 'post'))) {
  banner('FATAL: CBAP_ARM is REQUIRED for sizing|arm and must be one of pre|post');
  process.exit(2);
}
const intEnv = (v: string | undefined): number | null => (v ? Math.max(1, Number.parseInt(v, 10)) : null);
const N_ENV = intEnv(process.env.CBAP_N);
const SIZING_N_ENV = intEnv(process.env.CBAP_SIZING_N);
const SKIP_FP = process.env.CBAP_SKIP_FP === '1';
const OUT_ENV = process.env.CBAP_OUT;
const OVERRIDES: { name: string; set: boolean }[] = [
  { name: 'CBAP_N', set: N_ENV !== null },
  { name: 'CBAP_SIZING_N', set: SIZING_N_ENV !== null },
  { name: 'CBAP_SKIP_FP', set: SKIP_FP },
  { name: 'CBAP_OUT', set: OUT_ENV !== undefined },
];
const IS_PREFLIGHT = OVERRIDES.some((o) => o.set);
const PREFLIGHT_REASONS = OVERRIDES.filter((o) => o.set).map((o) => o.name);
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const isCanonicalPath = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === CANONICAL_DIR_ABS || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
const DEFAULT_OUT = MODE === 'sizing' ? SIZING_PATH
  : MODE === 'arm' ? ARM_PATH[ARM as ArmName] : COMBINE_PATH;
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? `/tmp/cb-aftermath-preflight-${MODE}.json` : DEFAULT_OUT);
if (IS_PREFLIGHT && isCanonicalPath(OUT_PATH)) {
  banner(`FATAL: a PREFLIGHT may not write a canonical repo path (${OUT_PATH}) — #262.2`);
  process.exit(2);
}

/* ========================================================================== */
/* §3 SEED LEDGER (#163, booked = walked)                                      */
/* ========================================================================== */
const BAND: readonly [number, number] = [12_478_000, 12_478_999];
const GUARD_BLOCK = 12_478_500;
const IDENT_BASE = IS_PREFLIGHT ? GUARD_BLOCK : 12_478_000;
const IDENT_N = 12;
const SIZING_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 40 : 12_478_100;
const BATTERY_BASE = IS_PREFLIGHT ? GUARD_BLOCK + 60 : 12_478_200;
const DET_SEED = IS_PREFLIGHT ? GUARD_BLOCK + 99 : 12_478_999;
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
const sum = (a: readonly number[]): number => a.reduce((x, y) => x + y, 0);
const mean = (a: readonly number[]): number => (a.length === 0 ? Number.NaN : sum(a) / a.length);
const quantileSorted = (a: readonly number[], q: number): number => {
  if (a.length === 0) return Number.NaN;
  const i = (a.length - 1) * q;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? a[lo] : a[lo] + (a[hi] - a[lo]) * (i - lo);
};
const stats6 = (values: readonly number[]): Record<string, number | null> => {
  if (values.length === 0) {
    return { n: 0, min: null, q1: null, median: null, q3: null, mean: null, max: null };
  }
  const s = [...values].sort((x, y) => x - y);
  return {
    n: s.length,
    min: round(s[0]), q1: round(quantileSorted(s, 0.25)), median: round(quantileSorted(s, 0.5)),
    q3: round(quantileSorted(s, 0.75)), mean: round(mean(s)), max: round(s[s.length - 1]),
  };
};
const hyp = (x: number, y: number): number => Math.sqrt(x * x + y * y);

/* ========================================================================== */
/* §5 THE SRC FINGERPRINTS (what build am I? what may not have moved?)         */
/* ========================================================================== */
/** the body of a top-level `export function NAME(` up to the next top-level `export ` (or EOF). */
const fnBody = (src: string, name: string): string => {
  const head = src.indexOf(`export function ${name}(`);
  if (head < 0) throw new Error(`cb-aftermath: ${name} not found in src`);
  const next = src.indexOf('\nexport ', head + 1);
  return src.slice(head, next < 0 ? src.length : next);
};
const MECH_SRC = readFileSync(MECHANICS_PATH, 'utf8');
const CB_SRC = readFileSync(CARRYBEAT_PATH, 'utf8');
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const SELF_SHA = sha(readFileSync(SELF_PATH, 'utf8'));

const TOUCH_PAST_BODY = fnBody(MECH_SRC, 'performTouchPast');
const DRIBBLE_TOUCH_BODY = fnBody(MECH_SRC, 'performDribbleTouch');
/** every `match.dribbleTouch = {` write site in `src/**`, with the function it sits in. */
const MARKER_WRITE_SITES = (() => {
  const out: { fn: string; text: string }[] = [];
  for (const m of MECH_SRC.matchAll(/match\.dribbleTouch = \{[^}]*\}/g)) {
    const at = m.index ?? 0;
    const fn = TOUCH_PAST_BODY.includes(m[0]) && MECH_SRC.indexOf(TOUCH_PAST_BODY) <= at
      && at < MECH_SRC.indexOf(TOUCH_PAST_BODY) + TOUCH_PAST_BODY.length
      ? 'performTouchPast'
      : DRIBBLE_TOUCH_BODY.includes(m[0]) ? 'performDribbleTouch' : 'UNCLASSIFIED';
    out.push({ fn, text: m[0] });
  }
  return out;
})();
const SRC_FACTS = {
  /** fix ①: the knock-and-go reset, and it exists ONLY inside `performTouchPast`. */
  knockAndGoInTouchPast: /p\.decisionTimer = 0;/.test(TOUCH_PAST_BODY),
  knockAndGoOccurrencesInMechanics: [...MECH_SRC.matchAll(/p\.decisionTimer = 0;/g)].length,
  /** fix ③: the derived lifetime, and the law's home in the pure module. */
  derivedLifetimeInTouchPast: /knockClaimLifetime\(/.test(TOUCH_PAST_BODY),
  lawExported: /export function knockClaimLifetime\(/.test(CB_SRC),
  /** the production push and its flat marker — must not move. */
  dribbleTouchBodySha: sha(DRIBBLE_TOUCH_BODY),
  dribbleTouchKeepsFlatMarker:
    /match\.dribbleTouch = \{ gid: p\.gid, until: match\.simTime \+ 1\.6 \}/.test(DRIBBLE_TOUCH_BODY),
  markerWriteSites: MARKER_WRITE_SITES.map((s) => s.fn),
  /** the two consumers that must not move. */
  matchExpirySha: sha(MATCH_SRC.split('\n')
    .filter((l) => l.includes('this.dribbleTouch = null') || l.includes('this.simTime > this.dribbleTouch.until'))
    .join('\n')),
  brainChaseBranchSha: sha(BRAIN_SRC.slice(
    BRAIN_SRC.indexOf('match.dribbleTouch !== null'),
    BRAIN_SRC.indexOf('chasing my own touch') + 40,
  )),
};
const FIX_PRESENT = SRC_FACTS.knockAndGoInTouchPast && SRC_FACTS.derivedLifetimeInTouchPast
  && SRC_FACTS.lawExported;

/* ========================================================================== */
/* §6 ⭐ THE LIFETIME LAW, RE-DERIVED INDEPENDENTLY (never imported)           */
/* ========================================================================== */
/**
 * §FIX-③ of the stage doc, re-implemented from the engine's own constants:
 *   D∞ = v0 / BALL_FRICTION_K                     (the ball's roll-out limit, closed form)
 *   brake = |v|/a · turn = θ/TURN_RATE · close = sqrt(2·d/a)   (`recoveryInterval`'s three legs)
 *   L = max( TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH , brake + turn + close )
 */
function derivedLifetime(k: {
  px: number; py: number; vx: number; vy: number; accel: number; hx: number; hy: number;
  bx: number; by: number; dirX: number; dirY: number; relSpeed: number; push: number;
}): number {
  const dInf = k.relSpeed / BALL_FRICTION_K;
  const tx = k.bx + k.dirX * dInf;
  const ty = k.by + k.dirY * dInf;
  const speed = hyp(k.vx, k.vy);
  const brake = speed / k.accel;
  let fx = k.vx;
  let fy = k.vy;
  if (speed === 0) { fx = k.hx; fy = k.hy; }
  const gx = tx - k.px;
  const gy = ty - k.py;
  const gd = hyp(gx, gy);
  const fd = hyp(fx, fy);
  const turnAngle = gd === 0 || fd === 0
    ? 0
    : Math.acos(Math.min(1, Math.max(-1, (fx * gx + fy * gy) / (fd * gd))));
  const turn = turnAngle / TURN_RATE;
  const close = Math.sqrt((2 * gd) / k.accel);
  const total = brake + turn + close;
  const window = TOUCH_RECOLLECT_BASE + k.push * TOUCH_RECOLLECT_PER_PUSH;
  return total > window ? total : window;
}

/* ========================================================================== */
/* §7 THE WORLD                                                                */
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
  if (cbArmedVersion(m) !== CB_WORLD_VERSION) throw new Error('cb-aftermath: the CB world failed to arm');
  return m;
};
/** the TWO flags-off world shapes (identity): bare production · the a4 substrate the CB world sits on. */
type Shape = 'bare' | 'a4substrate';
const flagsOffMatch = (seed: number, shape: Shape): Match => new Match({
  seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
  ...(shape === 'a4substrate' ? a4MatchFlags(3) : {}),
});

/** a TRAJECTORY digest of a whole flags-off match (byte-identity's own ruler). */
function trajectoryDigest(seed: number, shape: Shape): string {
  const m = flagsOffMatch(seed, shape);
  const rows: number[] = [];
  let tick = 0;
  while (!m.finished) {
    m.step(DT);
    tick += 1;
    if (tick % IDENT_SAMPLE_TICKS !== 0) continue;
    rows.push(round(m.ball.pos.x, 9), round(m.ball.pos.y, 9), round(m.ball.z, 9),
      round(m.ball.vel.x, 9), round(m.ball.vel.y, 9));
    for (const p of m.allPlayers) {
      rows.push(round(p.pos.x, 9), round(p.pos.y, 9), round(p.vel.x, 9), round(p.vel.y, 9),
        round(p.stamina, 9));
    }
  }
  rows.push(m.teams[0].stats.goals ?? 0, m.teams[1].stats.goals ?? 0, m.simTick);
  return sha(rows.join(','));
}

/* ========================================================================== */
/* §8 THE ARMED WALK — the aftermath of every chosen knock                     */
/* ========================================================================== */
const BALL_CHASE_LABELS = ['ChaseBall', 'InterceptPass', 'GoalkeeperRush', 'GoalkeeperSave'];
const isChase = (t: string): boolean => BALL_CHASE_LABELS.includes(t);

interface Knock {
  seed: number;
  /** the marker the ENGINE wrote, and the law's independent re-derivation of it. */
  markerLifetime: number;
  derived: number;
  push: number;
  window: number;
  relSpeed: number;
  back: boolean;
  challengers: number;
  /** ticks from release to a `ChaseBall` label; null = the race ended first. */
  chaseLag: number | null;
  outcome: string;
  tResolve: number | null;
  unresolvedAtOwnExpiry: boolean;
  unresolvedAtFixed: boolean;
  gapAtOwnExpiry: number | null;
  nearestAtOwnExpiry: boolean;
  abandoned: boolean;
  abandonGap: number | null;
  tGather: number | null;
  /** defender label-switch delays (the untouched control), one per opponent within CONTEST-ish range. */
  defDelays: (number | null)[];
}
interface SeedCell {
  seed: number;
  knocks: number;
  lagBuckets: Record<string, number>;
  lagPool: number[];
  lifetimePool: number[];
  gatherPool: number[];
  defDelayPool: number[];
  abandonGapPool: number[];
  knockerWins: number;
  backKnocks: number;
  backKnockerWins: number;
  unresolvedOwn: number;
  unresolvedFixed: number;
  abandons: number;
  outcomes: Record<string, number>;
  lawViolations: number;
  maxLawDeviation: number;
  lawDeviationsAbove1e9: number;
  lagOverOne: number;
  goals: number; shots: number; fouls: number; turnovers: number;
  touchPasts: number; chosen: number; unarmed: number;
  simSeconds: number;
}
const OUTCOMES = ['knocker', 'beatenDef', 'otherDef', 'oppGK', 'teammate', 'teammateGK',
  'out', 'whistle', 'matchEnd', 'cap'];
const LAG_BUCKETS = ['0', '1', '2-3', '4-9', '10+'];
const bucketOf = (t: number): string => (t <= 1 ? String(t) : t <= 3 ? '2-3' : t <= 9 ? '4-9' : '10+');

interface OpenRace {
  k: Knock; knocker: Player; expiryTick: number; releaseTick: number; done: boolean;
  defs: { gid: number; delay: number | null; already: boolean }[];
  beatenGids: Set<number>;
}

function walkArmed(seed: number): SeedCell {
  const m = armedMatch(seed);
  const cell: SeedCell = {
    seed, knocks: 0,
    lagBuckets: Object.fromEntries(LAG_BUCKETS.map((b) => [b, 0])),
    lagPool: [], lifetimePool: [], gatherPool: [], defDelayPool: [], abandonGapPool: [],
    knockerWins: 0, backKnocks: 0, backKnockerWins: 0,
    unresolvedOwn: 0, unresolvedFixed: 0, abandons: 0,
    outcomes: Object.fromEntries(OUTCOMES.map((o) => [o, 0])),
    lawViolations: 0, maxLawDeviation: 0, lawDeviationsAbove1e9: 0, lagOverOne: 0,
    goals: 0, shots: 0, fouls: 0, turnovers: 0,
    touchPasts: 0, chosen: 0, unarmed: 0, simSeconds: 0,
  };
  const open: OpenRace[] = [];
  const capTicks = Math.round(RACE_CAP_S / DT);
  /** ⚠ the probe's OWN turnover ruler (the engine keeps no such counter): a change of the
   *  controlling side. Comparable ACROSS these two arms only — not with any other stage's. */
  let prevPossession = m.possessionSide;
  let prevTouch = m.cbLedger.touchPasts;
  let prevChosen = m.cbChoiceLedger.chosen;
  let prevPush = m.cbLedger.touchPastPushMetres;
  let prevFouls = m.teams[0].stats.fouls + m.teams[1].stats.fouls;

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    const ball = m.ball;
    const foulsNow = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
    const whistled = foulsNow > prevFouls;
    prevFouls = foulsNow;
    if (m.possessionSide !== prevPossession) {
      cell.turnovers += 1;
      prevPossession = m.possessionSide;
    }

    /* ---- a new chosen knock? ---- */
    const touchDelta = m.cbLedger.touchPasts - prevTouch;
    const chosenDelta = m.cbChoiceLedger.chosen - prevChosen;
    const prevPushMetres = prevPush;
    prevTouch = m.cbLedger.touchPasts;
    prevChosen = m.cbChoiceLedger.chosen;
    prevPush = m.cbLedger.touchPastPushMetres;
    if (touchDelta > 0) {
      const p = ball.lastTouch;
      if (p === null || chosenDelta === 0) {
        cell.unarmed += touchDelta;
      } else {
        const ballSpeed = hyp(ball.vel.x, ball.vel.y);
        const dirX = ball.vel.x / ballSpeed;
        const dirY = ball.vel.y / ballSpeed;
        const window = p.kickCooldown;
        // the knock's push, EXACTLY as the engine computed it — the ledger's own delta
        // (`cbLedger.touchPastPushMetres`), not an inversion of the rounded recollect window.
        const push = m.cbLedger.touchPastPushMetres - prevPushMetres;
        // ⚠ THE RELEASE SPEED IS RE-DERIVED BY THE ENGINE'S OWN EXPRESSION (`vmag + max(push,
        // 0.8)`, `performTouchPast`), not read back off the integrated ball vector: the two
        // differ by ~1e-15 (the aim's unit-ness), and `recoveryInterval`'s `acos` is
        // ill-conditioned for a knock straight along the knocker's momentum (θ → 0), which
        // amplifies that into ~1e-9 s of lifetime. Re-deriving the input the LAW consumes keeps
        // the check a check; the residual is float noise (~1e-14).
        const relSpeed = hyp(p.vel.x, p.vel.y) + Math.max(push, 0.8);
        const v = hyp(p.vel.x, p.vel.y);
        const ax = v > 0.5 ? p.vel.x / v : p.heading.x;
        const ay = v > 0.5 ? p.vel.y / v : p.heading.y;
        const back = ax * dirX + ay * dirY < 0;
        const marker = m.dribbleTouch === null ? Number.NaN : m.dribbleTouch.until - m.simTime;
        const derived = derivedLifetime({
          px: p.pos.x, py: p.pos.y, vx: p.vel.x, vy: p.vel.y, accel: p.accel,
          hx: p.heading.x, hy: p.heading.y, bx: ball.pos.x, by: ball.pos.y,
          dirX, dirY, relSpeed, push,
        });
        let challengers = 0;
        const defs: OpenRace['defs'] = [];
        const beatenGids = new Set<number>();
        for (const o of m.teams[1 - p.side].players) {
          if (o.sentOff) continue;
          const d0 = hyp(o.pos.x - ball.pos.x, o.pos.y - ball.pos.y);
          if (d0 <= CONTEST_RADIUS) {
            challengers += 1;
            // CB-T0's own geometric predicate, on the release state (bookkeeping only).
            if (beatsDefender({ x: ball.pos.x, y: ball.pos.y }, { x: dirX, y: dirY }, relSpeed, push,
              { pos: { x: o.pos.x, y: o.pos.y }, vel: { x: o.vel.x, y: o.vel.y }, accel: o.accel })) {
              beatenGids.add(o.gid);
            }
          }
          if (d0 <= 8) {
            // R1, the untouched control, on the FINDING OF RECORD's own ruler: STEERING onto
            // the truth ball (desiredVel within 60°), not the action label.
            const tbx = ball.pos.x - o.pos.x;
            const tby = ball.pos.y - o.pos.y;
            const tbl = hyp(tbx, tby);
            const dvl = hyp(o.desiredVel.x, o.desiredVel.y);
            const on = tbl <= 0.3 || (dvl > 1e-6
              && (o.desiredVel.x * tbx + o.desiredVel.y * tby) / (dvl * tbl) >= COS60);
            defs.push({ gid: o.gid, delay: on ? 0 : null, already: on });
          }
        }
        const k: Knock = {
          seed, markerLifetime: marker, derived, push, window, relSpeed, back, challengers,
          chaseLag: null, outcome: 'cap', tResolve: null,
          unresolvedAtOwnExpiry: false, unresolvedAtFixed: false,
          gapAtOwnExpiry: null, nearestAtOwnExpiry: false,
          abandoned: false, abandonGap: null, tGather: null, defDelays: [],
        };
        cell.knocks += 1;
        cell.lifetimePool.push(round(marker));
        const deviation = Math.abs(marker - derived);
        if (!(deviation <= LAW_TOL)) cell.lawViolations += 1;
        if (deviation > 1e-9) cell.lawDeviationsAbove1e9 += 1;
        if (deviation > cell.maxLawDeviation) cell.maxLawDeviation = deviation;
        open.push({
          k, knocker: p, releaseTick: tick, done: false, defs, beatenGids,
          expiryTick: tick + Math.round(marker / DT),
        });
        continue; // the release tick itself takes no aftermath sample
      }
    }

    /* ---- open races ---- */
    for (let i = open.length - 1; i >= 0; i--) {
      const r = open[i];
      const k = r.k;
      const p = r.knocker;
      const t = tick - r.releaseTick;
      const tS = t * DT;
      if (!r.done) {
        if (ball.owner !== null) {
          const o = ball.owner;
          k.tResolve = tS;
          k.outcome = o.gid === p.gid ? 'knocker'
            : o.side === p.side ? (o.role === 'GK' ? 'teammateGK' : 'teammate')
              : o.role === 'GK' ? 'oppGK' : r.beatenGids.has(o.gid) ? 'beatenDef' : 'otherDef';
          if (k.outcome === 'knocker') k.tGather = tS;
          r.done = true;
        } else if (m.phase !== 'playing') {
          k.outcome = whistled ? 'whistle' : 'out';
          k.tResolve = tS;
          r.done = true;
        } else if (m.finished) {
          k.outcome = 'matchEnd';
          r.done = true;
        } else if (t >= capTicks) {
          k.outcome = 'cap';
          r.done = true;
        }
      }
      if (!r.done) {
        const gap = hyp(ball.pos.x - p.pos.x, ball.pos.y - p.pos.y);
        if (k.chaseLag === null && p.action.type === 'ChaseBall') k.chaseLag = t;
        if (t === Math.round(FIXED_HORIZON_TICKS) + 1) k.unresolvedAtFixed = true;
        if (tick === r.expiryTick + 1) {
          k.unresolvedAtOwnExpiry = true;
          k.gapAtOwnExpiry = round(gap);
          let nearer = 0;
          for (const q of m.teams[p.side].players) {
            if (q.sentOff || q.gid === p.gid || q.role === 'GK') continue;
            if (hyp(q.pos.x - ball.pos.x, q.pos.y - ball.pos.y) < gap) nearer += 1;
          }
          k.nearestAtOwnExpiry = nearer === 0;
        }
        if (tick === r.expiryTick + ABANDON_LOOKAHEAD_TICKS && k.unresolvedAtOwnExpiry) {
          if (k.nearestAtOwnExpiry && !isChase(p.action.type)) {
            k.abandoned = true;
            k.abandonGap = round(gap);
          }
        }
        // the defender control: label switch onto the ball, inside the FIXED yardstick window
        if (t <= FIXED_HORIZON_TICKS) {
          for (const d of r.defs) {
            if (d.delay !== null) continue;
            const o = m.allPlayers[d.gid];
            if (o === undefined || o.sentOff) continue;
            const tbx = ball.pos.x - o.pos.x;
            const tby = ball.pos.y - o.pos.y;
            const tbl = hyp(tbx, tby);
            const dvl = hyp(o.desiredVel.x, o.desiredVel.y);
            if (tbl <= 0.3 || (dvl > 1e-6
              && (o.desiredVel.x * tbx + o.desiredVel.y * tby) / (dvl * tbl) >= COS60)) d.delay = t;
          }
        }
      }
      if (r.done) {
        k.defDelays = r.defs.filter((d) => !d.already).map((d) => d.delay);
        // fold the knock into the cell
        cell.outcomes[k.outcome] = (cell.outcomes[k.outcome] ?? 0) + 1;
        if (k.outcome === 'knocker') cell.knockerWins += 1;
        if (k.back) {
          cell.backKnocks += 1;
          if (k.outcome === 'knocker') cell.backKnockerWins += 1;
        }
        if (k.chaseLag !== null) {
          cell.lagPool.push(k.chaseLag);
          cell.lagBuckets[bucketOf(k.chaseLag)] += 1;
          if (k.chaseLag > 1) cell.lagOverOne += 1;
        }
        if (k.tGather !== null) cell.gatherPool.push(round(k.tGather));
        if (k.unresolvedAtOwnExpiry) cell.unresolvedOwn += 1;
        if (k.unresolvedAtFixed) cell.unresolvedFixed += 1;
        if (k.abandoned) {
          cell.abandons += 1;
          if (k.abandonGap !== null) cell.abandonGapPool.push(k.abandonGap);
        }
        for (const d of k.defDelays) if (d !== null) cell.defDelayPool.push(d);
        open.splice(i, 1);
      }
    }
  }
  for (const r of open) {
    r.k.outcome = 'matchEnd';
    cell.outcomes.matchEnd += 1;
  }
  cell.goals = (m.teams[0].stats.goals ?? 0) + (m.teams[1].stats.goals ?? 0);
  cell.shots = (m.teams[0].stats.shots ?? 0) + (m.teams[1].stats.shots ?? 0);
  cell.fouls = m.teams[0].stats.fouls + m.teams[1].stats.fouls;
  cell.touchPasts = m.cbLedger.touchPasts;
  cell.chosen = m.cbChoiceLedger.chosen;
  cell.simSeconds = m.simTime;
  return cell;
}

/* ========================================================================== */
/* §9 SIZING + ARM MODES                                                       */
/* ========================================================================== */
const t0 = Date.now();
const armSummaryOf = (cells: readonly SeedCell[]): Record<string, unknown> => {
  const knocks = sum(cells.map((c) => c.knocks));
  const g = (f: (c: SeedCell) => number): number => sum(cells.map(f));
  return {
    matches: cells.length,
    knocks,
    knocksPerMatch: round(knocks / Math.max(1, cells.length), 4),
    lagBuckets: Object.fromEntries(LAG_BUCKETS.map((b) => [b, g((c) => c.lagBuckets[b])])),
    lagStats: stats6(cells.flatMap((c) => c.lagPool)),
    lifetimeStats: stats6(cells.flatMap((c) => c.lifetimePool)),
    gatherStats: stats6(cells.flatMap((c) => c.gatherPool)),
    defenderDelayStats: stats6(cells.flatMap((c) => c.defDelayPool)),
    abandonGapStats: stats6(cells.flatMap((c) => c.abandonGapPool)),
    regatherRate: round(g((c) => c.knockerWins) / Math.max(1, knocks)),
    backKnocks: g((c) => c.backKnocks),
    backRegatherRate: round(g((c) => c.backKnockerWins) / Math.max(1, g((c) => c.backKnocks))),
    unresolvedAtOwnExpiryRate: round(g((c) => c.unresolvedOwn) / Math.max(1, knocks)),
    unresolvedAtFixedRate: round(g((c) => c.unresolvedFixed) / Math.max(1, knocks)),
    abandons: g((c) => c.abandons),
    abandonRate: round(g((c) => c.abandons) / Math.max(1, knocks)),
    census: Object.fromEntries(OUTCOMES.map((o) => [o, g((c) => c.outcomes[o] ?? 0)])),
    censusShare: Object.fromEntries(OUTCOMES.map((o) => [o,
      round(g((c) => c.outcomes[o] ?? 0) / Math.max(1, knocks))])),
    lawViolations: g((c) => c.lawViolations),
    lawTolerance: LAW_TOL,
    maxLawDeviation: Math.max(0, ...cells.map((c) => c.maxLawDeviation)),
    lawDeviationsAbove1e9: g((c) => c.lawDeviationsAbove1e9),
    lagOverOne: g((c) => c.lagOverOne),
    perMatch: {
      goals: round(g((c) => c.goals) / Math.max(1, cells.length), 4),
      shots: round(g((c) => c.shots) / Math.max(1, cells.length), 4),
      fouls: round(g((c) => c.fouls) / Math.max(1, cells.length), 4),
      turnovers: round(g((c) => c.turnovers) / Math.max(1, cells.length), 4),
      touchPasts: round(g((c) => c.touchPasts) / Math.max(1, cells.length), 4),
      chosen: round(g((c) => c.chosen) / Math.max(1, cells.length), 4),
    },
    unarmedKnocks: g((c) => c.unarmed),
  };
};

/** the unhashed envelope + the cross-OUT acceptance test, shared by every mode. */
function writeArtifact(body: Record<string, unknown>, outPath: string): {
  digest: string; reread: string; crossOutIdentical: boolean;
} {
  const digest = sha(canonical(body));
  const envelope = {
    generatedAt: new Date().toISOString(),
    head: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
    outPath, preflight: IS_PREFLIGHT, preflightReasons: PREFLIGHT_REASONS,
    wallMs: Date.now() - t0,
  };
  writeFileSync(outPath, `${JSON.stringify({ ...body, resultSha256: digest, envelope }, null, 2)}\n`);
  const strip = (f: Record<string, unknown>): string => {
    const c = JSON.parse(JSON.stringify(f)) as Record<string, unknown>;
    delete c.resultSha256;
    delete c.envelope;
    return sha(canonical(c));
  };
  const crossPath = `/tmp/cb-aftermath-cross-out-${MODE}.json`;
  writeFileSync(crossPath, `${JSON.stringify({
    ...body,
    resultSha256: digest,
    envelope: { ...envelope, outPath: crossPath, wallMs: envelope.wallMs * 2 + 7, generatedAt: 'ANOTHER-INVOCATION' },
  }, null, 2)}\n`);
  const fileA = JSON.parse(readFileSync(outPath, 'utf8')) as Record<string, unknown>;
  const fileB = JSON.parse(readFileSync(crossPath, 'utf8')) as Record<string, unknown>;
  return {
    digest,
    reread: strip(fileA),
    crossOutIdentical: canonical(fileA.envelope) !== canonical(fileB.envelope)
      && strip(fileA) === strip(fileB),
  };
}

if (MODE === 'sizing') {
  const n = SIZING_N_ENV ?? 5;
  const st = Date.now();
  const cells: SeedCell[] = [];
  for (let i = 0; i < n; i++) cells.push(walkArmed(SIZING_BASE + i));
  const ms = Date.now() - st;
  const body = {
    schema: 'cb-aftermath-polish/sizing/v1',
    arm: ARM, fixPresent: FIX_PRESENT, srcFacts: SRC_FACTS,
    seeds: { base: SIZING_BASE, n },
    /** ⭐ the two terms the N rule consumes, published as FIXED numbers of this artifact. */
    msPerMatch: round(ms / n, 3),
    rarestPerMatch: round(sum(cells.map((c) => c.abandons)) / n, 6),
    summary: armSummaryOf(cells),
  };
  const w = writeArtifact(body, OUT_PATH);
  banner(`SIZING (${ARM}) n=${n} · msPerMatch ${body.msPerMatch} · abandons/match ${body.rarestPerMatch} · ${OUT_PATH}`);
  banner(`resultSha256 ${w.digest} · re-derives ${w.reread === w.digest}`);
  process.exit(0);
}

if (MODE === 'arm') {
  if (!existsSync(SIZING_PATH)) {
    banner(`FATAL: the committed sizing artifact is missing (${SIZING_PATH}) — the N rule cannot re-derive`);
    process.exit(2);
  }
  const sizing = JSON.parse(readFileSync(SIZING_PATH, 'utf8')) as {
    msPerMatch: number; rarestPerMatch: number; seeds: { n: number };
  };
  const precisionTerm = sizing.rarestPerMatch > 0
    ? Math.max(Math.ceil(N_EVENTS / sizing.rarestPerMatch), N_FLOOR) : Infinity;
  const wallTerm = Math.floor((0.5 * 3_600_000) / (sizing.msPerMatch * 2));
  const nStar = Math.min(precisionTerm, wallTerm, N_CAP);
  const N = N_ENV ?? nStar;
  banner(`ARM ${ARM} · fixPresent=${FIX_PRESENT} · N=${N} (precision ${precisionTerm} · wall ${wallTerm} · cap ${N_CAP})`);

  /* ---- identity: both world shapes, 12 virgin seeds ---- */
  const identRows: { seed: number; shape: Shape; digest: string }[] = [];
  for (const shape of ['bare', 'a4substrate'] as Shape[]) {
    for (let i = 0; i < IDENT_N; i++) {
      identRows.push({ seed: IDENT_BASE + i, shape, digest: trajectoryDigest(IDENT_BASE + i, shape) });
    }
  }
  /* ---- the production fingerprint ---- */
  const fpRows = SKIP_FP ? [] : LEAGUE_IDENT_BASELINES.map(({ seed, baseline }) => {
    const league = new League({ seed });
    const out = runHeadless(league.toJSON() as Record<string, unknown>, {
      kind: 'toGeneration', target: league.generation + FINGERPRINT_SEASONS,
    });
    const observed = sha(JSON.stringify(out.league));
    return { seed, baseline, observed, match: observed === baseline };
  });

  /* ---- the battery ---- */
  const SEEDS = Array.from({ length: N }, (_, i) => BATTERY_BASE + i);
  const cells = SEEDS.map((s, i) => {
    if (i % 25 === 0) banner(`  … seed ${s} (${i}/${N}) [${((Date.now() - t0) / 1000).toFixed(0)}s]`);
    return walkArmed(s);
  });
  /* ---- G-DET: the anchor seed walked twice, independently ---- */
  const detA = canonical(walkArmed(DET_SEED));
  const detB = canonical(walkArmed(DET_SEED));

  const body = {
    schema: 'cb-aftermath-polish/arm/v1',
    arm: ARM,
    probeSha: SELF_SHA,
    fixPresent: FIX_PRESENT,
    srcFacts: SRC_FACTS,
    world: {
      version: CB_WORLD_VERSION,
      flags: a4MatchFlags(CB_WORLD_VERSION) as unknown as Record<string, boolean>,
      armedVersionSeen: cbArmedVersion(armedMatch(DET_SEED)),
    },
    seeds: {
      band: BAND, ident: [IDENT_BASE, IDENT_BASE + IDENT_N - 1], sizing: SIZING_BASE,
      battery: [BATTERY_BASE, BATTERY_BASE + N - 1], det: DET_SEED, n: N,
    },
    nRule: {
      rule: 'N* = min( max( ceil(300 / abandonsPerMatch), 60 ), floor(0.5h / (msPerMatch × 2 arms)), 200 )',
      rarestPerMatch: sizing.rarestPerMatch, msPerMatch: sizing.msPerMatch,
      precisionTerm: Number.isFinite(precisionTerm) ? precisionTerm : null,
      wallTerm, cap: N_CAP, nStar, ran: N, overridden: N_ENV !== null,
    },
    identity: { rows: identRows, fingerprints: fpRows, skipped: SKIP_FP },
    det: { equal: detA === detB, digest: sha(detA) },
    summary: armSummaryOf(cells),
    cells,
  };
  const w = writeArtifact(body, OUT_PATH);
  banner(`ARM ${ARM} done · knocks ${(body.summary as Record<string, unknown>).knocks} · det ${detA === detB} · ${OUT_PATH}`);
  banner(`resultSha256 ${w.digest} · re-derives ${w.reread === w.digest} · crossOut ${w.crossOutIdentical}`);
  process.exit(0);
}

/* ========================================================================== */
/* §10 COMBINE — the paired A/B and the FROZEN GATE BATTERY                     */
/* ========================================================================== */
interface ArmBody {
  arm: ArmName; probeSha: string; fixPresent: boolean;
  srcFacts: typeof SRC_FACTS;
  world: { version: number; flags: Record<string, boolean>; armedVersionSeen: number };
  seeds: Record<string, unknown>;
  nRule: Record<string, unknown>;
  identity: { rows: { seed: number; shape: Shape; digest: string }[];
    fingerprints: { seed: number; baseline: string; observed: string; match: boolean }[];
    skipped: boolean };
  det: { equal: boolean; digest: string };
  summary: Record<string, unknown>;
  cells: SeedCell[];
}
const readArm = (arm: ArmName): ArmBody => {
  const p = ARM_PATH[arm];
  if (!existsSync(p)) { banner(`FATAL: the ${arm} arm artifact is missing (${p})`); process.exit(2); }
  return JSON.parse(readFileSync(p, 'utf8')) as ArmBody;
};
const PRE = readArm('pre');
const POST = readArm('post');

/* ---- the paired cluster bootstrap ---- */
const nClusters = Math.min(PRE.cells.length, POST.cells.length);
const bootRows: number[][] = (() => {
  const rng = new Rng(STATS_BASE);
  const rows: number[][] = [];
  for (let b = 0; b < BOOT_B; b++) {
    const idx: number[] = [];
    for (let i = 0; i < nClusters; i++) idx.push(rng.int(0, nClusters - 1));
    rows.push(idx);
  }
  return rows;
})();
const ciOf = (values: number[]): { lo: number; hi: number } => {
  const s = values.filter((v) => Number.isFinite(v)).sort((a, b) => a - b);
  return { lo: round(quantileSorted(s, 0.025)), hi: round(quantileSorted(s, 0.975)) };
};
type Num = (c: SeedCell) => number;
function pairedRate(num: Num, den: Num): {
  pre: number; post: number; delta: number; lo: number; hi: number; preN: number; postN: number;
} {
  const rate = (cells: SeedCell[], idx: readonly number[]): number => {
    let n = 0; let d = 0;
    for (const i of idx) { n += num(cells[i]); d += den(cells[i]); }
    return n / Math.max(1e-9, d);
  };
  const base = PRE.cells.map((_, i) => i).slice(0, nClusters);
  const pre = rate(PRE.cells, base);
  const post = rate(POST.cells, base);
  const draws = bootRows.map((idx) => rate(POST.cells, idx) - rate(PRE.cells, idx));
  return {
    pre: round(pre), post: round(post), delta: round(post - pre), ...ciOf(draws),
    preN: sum(base.map((i) => den(PRE.cells[i]))), postN: sum(base.map((i) => den(POST.cells[i]))),
  };
}
function pairedMedian(pool: (c: SeedCell) => number[]): {
  pre: number; post: number; delta: number; lo: number; hi: number;
} {
  const med = (cells: SeedCell[], idx: readonly number[]): number => {
    const all: number[] = [];
    for (const i of idx) for (const v of pool(cells[i])) all.push(v);
    all.sort((a, b) => a - b);
    return quantileSorted(all, 0.5);
  };
  const base = PRE.cells.map((_, i) => i).slice(0, nClusters);
  const pre = med(PRE.cells, base);
  const post = med(POST.cells, base);
  const draws = bootRows.map((idx) => med(POST.cells, idx) - med(PRE.cells, idx));
  return { pre: round(pre), post: round(post), delta: round(post - pre), ...ciOf(draws) };
}

const AB = {
  /* 1 */ chaseLagMedianTicks: pairedMedian((c) => c.lagPool),
  chaseLagOverOneTickRate: pairedRate((c) => c.lagOverOne, (c) => c.lagPool.length),
  /* 2 */ backRegatherRate: pairedRate((c) => c.backKnockerWins, (c) => c.backKnocks),
  /* 3 */ regatherRate: pairedRate((c) => c.knockerWins, (c) => c.knocks),
  /* 4 */ abandonRate: pairedRate((c) => c.abandons, (c) => c.knocks),
  /* 5 */ unresolvedAtOwnExpiryRate: pairedRate((c) => c.unresolvedOwn, (c) => c.knocks),
  /* 5b */ unresolvedAtFixedHorizonRate: pairedRate((c) => c.unresolvedFixed, (c) => c.knocks),
  /* 6 */ census: Object.fromEntries(OUTCOMES.map((o) => [o,
    pairedRate((c) => c.outcomes[o] ?? 0, (c) => c.knocks)])),
  /* R1 */ defenderDelayMedianTicks: pairedMedian((c) => c.defDelayPool),
  /* R2 */ markerLifetimeMedian: pairedMedian((c) => c.lifetimePool),
  /* R3 */ world: {
    knocksPerMatch: pairedRate((c) => c.knocks, () => 1),
    goalsPerMatch: pairedRate((c) => c.goals, () => 1),
    shotsPerMatch: pairedRate((c) => c.shots, () => 1),
    foulsPerMatch: pairedRate((c) => c.fouls, () => 1),
    turnoversPerMatch: pairedRate((c) => c.turnovers, () => 1),
  },
  gatherMedianS: pairedMedian((c) => c.gatherPool),
  abandonGapMedianM: pairedMedian((c) => c.abandonGapPool),
};

/* ========================================================================== */
/* §11 THE GATE OBJECTS + ⭐⭐ THE MACHINE-DERIVED LIVENESS MAP                 */
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

/* ---- gDet ---- */
interface DetInput { preEqual: boolean; postEqual: boolean; preDigest: string; postDigest: string }
registerGate<DetInput>({
  name: 'gDet',
  fn: (i) => ({
    preRederives: i.preEqual,
    postRederives: i.postEqual,
    armsActuallyDiffer: i.preDigest !== i.postDigest,
  }),
  input: { preEqual: PRE.det.equal, postEqual: POST.det.equal, preDigest: PRE.det.digest, postDigest: POST.det.digest },
  mutants: [
    { conjunct: 'preRederives', name: 'the pre arm did not re-derive', mutate: (i) => ({ ...i, preEqual: false }) },
    { conjunct: 'postRederives', name: 'the post arm did not re-derive', mutate: (i) => ({ ...i, postEqual: false }) },
    { conjunct: 'armsActuallyDiffer', name: 'the two arms produced the same anchor walk', mutate: (i) => ({ ...i, postDigest: i.preDigest }) },
  ],
});

/* ---- gIdentity ---- */
interface IdentInput {
  rows: { seed: number; shape: Shape; pre: string; post: string }[];
}
const identRows: IdentInput['rows'] = PRE.identity.rows.map((r, i) => ({
  seed: r.seed, shape: r.shape, pre: r.digest, post: POST.identity.rows[i]?.digest ?? 'MISSING',
}));
registerGate<IdentInput>({
  name: 'gIdentity',
  fn: (i) => ({
    everyDigestEqual: i.rows.length > 0 && i.rows.every((r) => r.pre === r.post),
    bothWorldShapes: new Set(i.rows.map((r) => r.shape)).size >= 2,
    twelveSeedsPerShape: [...new Set(i.rows.map((r) => r.shape))]
      .every((s) => new Set(i.rows.filter((r) => r.shape === s).map((r) => r.seed)).size >= IDENT_N),
  }),
  input: { rows: identRows },
  mutants: [
    { conjunct: 'everyDigestEqual', name: 'one flags-off trajectory moved', mutate: (i) => ({ rows: [{ ...i.rows[0], post: 'MOVED' }, ...i.rows.slice(1)] }) },
    { conjunct: 'bothWorldShapes', name: 'only one world shape was sampled', mutate: (i) => ({ rows: i.rows.filter((r) => r.shape === 'bare') }) },
    { conjunct: 'twelveSeedsPerShape', name: 'a shape is one seed short', mutate: (i) => ({ rows: i.rows.filter((r) => !(r.shape === 'a4substrate' && r.seed === IDENT_BASE)) }) },
  ],
});

/* ---- xFpProd ---- */
interface FpInput { pre: { match: boolean; observed: string; baseline: string }[]; post: { match: boolean; observed: string; baseline: string }[]; skipped: boolean }
registerGate<FpInput>({
  name: 'xFpProd',
  fn: (i) => ({
    preMatchesBaselines: !i.skipped && i.pre.length > 0 && i.pre.every((r) => r.match),
    postMatchesBaselines: !i.skipped && i.post.length > 0 && i.post.every((r) => r.match),
    headlineFingerprintHeld: i.pre[0]?.observed === FINGERPRINT_BASELINE
      && i.post[0]?.observed === FINGERPRINT_BASELINE,
  }),
  input: { pre: PRE.identity.fingerprints, post: POST.identity.fingerprints, skipped: PRE.identity.skipped || POST.identity.skipped },
  mutants: [
    { conjunct: 'preMatchesBaselines', name: 'a pre-arm league fingerprint moved', mutate: (i) => ({ ...i, pre: i.pre.map((r, k) => (k === 1 ? { ...r, match: false } : r)) }) },
    { conjunct: 'postMatchesBaselines', name: 'a post-arm league fingerprint moved', mutate: (i) => ({ ...i, post: i.post.map((r, k) => (k === 1 ? { ...r, match: false } : r)) }) },
    { conjunct: 'headlineFingerprintHeld', name: 'the headline fingerprint changed', mutate: (i) => ({ ...i, post: [{ ...i.post[0], observed: 'deadbeef' }, ...i.post.slice(1)] }) },
  ],
});

/* ---- gProdUntouched ---- */
interface ProdInput {
  preSha: string; postSha: string; preFlat: boolean; postFlat: boolean;
  preExpiry: string; postExpiry: string; preBrain: string; postBrain: string;
}
registerGate<ProdInput>({
  name: 'gProdUntouched',
  fn: (i) => ({
    dribbleTouchBodyIdentical: i.preSha === i.postSha,
    flatMarkerKept: i.preFlat && i.postFlat,
    markerExpiryUnmoved: i.preExpiry === i.postExpiry,
    chaseBranchUnmoved: i.preBrain === i.postBrain,
  }),
  input: {
    preSha: PRE.srcFacts.dribbleTouchBodySha, postSha: POST.srcFacts.dribbleTouchBodySha,
    preFlat: PRE.srcFacts.dribbleTouchKeepsFlatMarker, postFlat: POST.srcFacts.dribbleTouchKeepsFlatMarker,
    preExpiry: PRE.srcFacts.matchExpirySha, postExpiry: POST.srcFacts.matchExpirySha,
    preBrain: PRE.srcFacts.brainChaseBranchSha, postBrain: POST.srcFacts.brainChaseBranchSha,
  },
  mutants: [
    { conjunct: 'dribbleTouchBodyIdentical', name: 'the production push moved', mutate: (i) => ({ ...i, postSha: 'moved' }) },
    { conjunct: 'flatMarkerKept', name: 'the production flat 1.6 was replaced', mutate: (i) => ({ ...i, postFlat: false }) },
    { conjunct: 'markerExpiryUnmoved', name: "Match's marker expiry moved", mutate: (i) => ({ ...i, postExpiry: 'moved' }) },
    { conjunct: 'chaseBranchUnmoved', name: "the brain's chase branch moved", mutate: (i) => ({ ...i, postBrain: 'moved' }) },
  ],
});

/* ---- gScope ---- */
interface ScopeInput {
  sites: string[]; unclassified: number; knockAndGoOccurrences: number; knockAndGoInTouchPast: boolean;
}
registerGate<ScopeInput>({
  name: 'gScope',
  fn: (i) => ({
    exactlyTwoMarkerWrites: i.sites.length === 2,
    bothNamedFunctionsWrite: i.sites.includes('performTouchPast')
      && i.sites.includes('performDribbleTouch'),
    noUnclassifiedSite: i.unclassified === 0,
    knockAndGoWrittenExactlyOnce: i.knockAndGoOccurrences === 1 && i.knockAndGoInTouchPast,
  }),
  input: {
    sites: POST.srcFacts.markerWriteSites,
    unclassified: POST.srcFacts.markerWriteSites.filter((s) => s === 'UNCLASSIFIED').length,
    knockAndGoOccurrences: POST.srcFacts.knockAndGoOccurrencesInMechanics,
    knockAndGoInTouchPast: POST.srcFacts.knockAndGoInTouchPast,
  },
  mutants: [
    { conjunct: 'exactlyTwoMarkerWrites', name: 'a third marker write appeared', mutate: (i) => ({ ...i, sites: [...i.sites, 'performTouchPast'] }) },
    { conjunct: 'bothNamedFunctionsWrite', name: 'both writes sit in the same function', mutate: (i) => ({ ...i, sites: ['performTouchPast', 'performTouchPast'] }) },
    { conjunct: 'noUnclassifiedSite', name: 'a marker write outside both functions', mutate: (i) => ({ ...i, unclassified: 1 }) },
    { conjunct: 'knockAndGoWrittenExactlyOnce', name: 'the timer reset was written twice', mutate: (i) => ({ ...i, knockAndGoOccurrences: 2 }) },
  ],
});

/* ---- gArmsDistinct ---- */
interface ArmsInput {
  preFix: boolean; postFix: boolean; preProbe: string; postProbe: string;
  preSeeds: string; postSeeds: string; preFlags: string; postFlags: string;
}
registerGate<ArmsInput>({
  name: 'gArmsDistinct',
  fn: (i) => ({
    preIsTheUnfixedBuild: !i.preFix,
    postIsTheFixedBuild: i.postFix,
    sameProbeFile: i.preProbe === i.postProbe,
    sameSeedList: i.preSeeds === i.postSeeds,
    sameArmedWorld: i.preFlags === i.postFlags,
  }),
  input: {
    preFix: PRE.fixPresent, postFix: POST.fixPresent,
    preProbe: PRE.probeSha, postProbe: POST.probeSha,
    preSeeds: canonical(PRE.seeds), postSeeds: canonical(POST.seeds),
    preFlags: canonical(PRE.world), postFlags: canonical(POST.world),
  },
  mutants: [
    { conjunct: 'preIsTheUnfixedBuild', name: 'the pre arm already carried the fixes', mutate: (i) => ({ ...i, preFix: true }) },
    { conjunct: 'postIsTheFixedBuild', name: 'the post arm did not carry the fixes', mutate: (i) => ({ ...i, postFix: false }) },
    { conjunct: 'sameProbeFile', name: 'the probe file changed between arms', mutate: (i) => ({ ...i, postProbe: 'other' }) },
    { conjunct: 'sameSeedList', name: 'the arms walked different seeds', mutate: (i) => ({ ...i, postSeeds: 'other' }) },
    { conjunct: 'sameArmedWorld', name: 'the arms ran different armed worlds', mutate: (i) => ({ ...i, postFlags: 'other' }) },
  ],
});

/* ---- gLifetimeLaw ---- */
const preLifetimes = PRE.cells.flatMap((c) => c.lifetimePool);
const postLifetimes = POST.cells.flatMap((c) => c.lifetimePool);
interface LawInput {
  postViolations: number; preViolations: number;
  preAllFlat: boolean; distinctPost: number; spreadPost: number; postN: number;
}
registerGate<LawInput>({
  name: 'gLifetimeLaw',
  fn: (i) => ({
    postMarkerIsTheLaw: i.postN > 0 && i.postViolations === 0,
    preMarkerIsTheIncumbentConstant: i.preAllFlat,
    postNonVacuous: i.distinctPost >= 3 && i.spreadPost > 0.25,
    preIsNotAlreadyTheLaw: i.preViolations > 0,
  }),
  input: {
    postViolations: sum(POST.cells.map((c) => c.lawViolations)),
    preViolations: sum(PRE.cells.map((c) => c.lawViolations)),
    preAllFlat: preLifetimes.length > 0 && preLifetimes.every((v) => Math.abs(v - INCUMBENT_MARKER_S) < 1e-9),
    distinctPost: new Set(postLifetimes.map((v) => round(v, 4))).size,
    spreadPost: postLifetimes.length > 0 ? Math.max(...postLifetimes) - Math.min(...postLifetimes) : 0,
    postN: postLifetimes.length,
  },
  mutants: [
    { conjunct: 'postMarkerIsTheLaw', name: 'a post knock disagrees with the re-derivation', mutate: (i) => ({ ...i, postViolations: 1 }) },
    { conjunct: 'preMarkerIsTheIncumbentConstant', name: 'a pre knock was not the flat 1.6', mutate: (i) => ({ ...i, preAllFlat: false }) },
    { conjunct: 'postNonVacuous', name: 'the derived lifetime is a disguised constant', mutate: (i) => ({ ...i, distinctPost: 1, spreadPost: 0 }) },
    { conjunct: 'preIsNotAlreadyTheLaw', name: 'the pre arm already obeyed the law', mutate: (i) => ({ ...i, preViolations: 0 }) },
  ],
});

/* ---- gKnockAndGo ---- */
interface GoInput { postMaxLag: number; postN: number; preModal: string; preMedian: number }
const lagModal = (arm: ArmBody): string => {
  let best = LAG_BUCKETS[0];
  let bestN = -1;
  for (const b of LAG_BUCKETS) {
    const n = sum(arm.cells.map((c) => c.lagBuckets[b] ?? 0));
    if (n > bestN) { bestN = n; best = b; }
  }
  return best;
};
registerGate<GoInput>({
  name: 'gKnockAndGo',
  fn: (i) => ({
    postLagAtMostOneTick: i.postN > 0 && i.postMaxLag <= 1,
    preDefectWasPresent: i.preModal !== '0' && i.preModal !== '1' && i.preMedian > 1,
  }),
  input: {
    postMaxLag: Math.max(0, ...POST.cells.flatMap((c) => c.lagPool)),
    postN: sum(POST.cells.map((c) => c.lagPool.length)),
    preModal: lagModal(PRE),
    preMedian: AB.chaseLagMedianTicks.pre,
  },
  mutants: [
    { conjunct: 'postLagAtMostOneTick', name: 'a post knock still paid a stale-label lag', mutate: (i) => ({ ...i, postMaxLag: 2 }) },
    { conjunct: 'preDefectWasPresent', name: 'the pre arm had no lag to fix', mutate: (i) => ({ ...i, preModal: '1', preMedian: 1 }) },
  ],
});

/* ---- gWorld ---- */
interface WorldInput { preVersion: number; postVersion: number; flags: Record<string, boolean>; doorsSet: number }
registerGate<WorldInput>({
  name: 'gWorld',
  fn: (i) => ({
    bothArmsArmedAtSix: i.preVersion === CB_WORLD_VERSION && i.postVersion === CB_WORLD_VERSION,
    everyCbDoorOpen: i.flags.cbTouchPast === true && i.flags.cbChoiceSeat === true
      && i.flags.cbCommitPhysics === true,
    noEngineDoorSet: i.doorsSet === 0,
  }),
  input: {
    preVersion: PRE.world.armedVersionSeen, postVersion: POST.world.armedVersionSeen,
    flags: POST.world.flags, doorsSet: doorsSet.length,
  },
  mutants: [
    { conjunct: 'bothArmsArmedAtSix', name: 'an arm ran an unarmed world', mutate: (i) => ({ ...i, postVersion: 0 }) },
    { conjunct: 'everyCbDoorOpen', name: 'a CB door was shut', mutate: (i) => ({ ...i, flags: { ...i.flags, cbChoiceSeat: false } }) },
    { conjunct: 'noEngineDoorSet', name: 'an engine door was set', mutate: (i) => ({ ...i, doorsSet: 1 }) },
  ],
});

/* ---- gNonVac ---- */
interface VacInput {
  preKnocks: number; postKnocks: number; preBack: number; postBack: number;
  preLag: number; postLag: number; preAbandon: number; unarmed: number;
}
registerGate<VacInput>({
  name: 'gNonVac',
  fn: (i) => ({
    knocksInBothArms: i.preKnocks > 0 && i.postKnocks > 0,
    backHalfPopulated: i.preBack > 0 && i.postBack > 0,
    lagPopulated: i.preLag > 0 && i.postLag > 0,
    theDefectExisted: i.preAbandon > 0,
    everyKnockWasChosen: i.unarmed === 0,
  }),
  input: {
    preKnocks: sum(PRE.cells.map((c) => c.knocks)), postKnocks: sum(POST.cells.map((c) => c.knocks)),
    preBack: sum(PRE.cells.map((c) => c.backKnocks)), postBack: sum(POST.cells.map((c) => c.backKnocks)),
    preLag: sum(PRE.cells.map((c) => c.lagPool.length)), postLag: sum(POST.cells.map((c) => c.lagPool.length)),
    preAbandon: sum(PRE.cells.map((c) => c.abandons)),
    unarmed: sum(PRE.cells.map((c) => c.unarmed)) + sum(POST.cells.map((c) => c.unarmed)),
  },
  mutants: [
    { conjunct: 'knocksInBothArms', name: 'an arm produced no knocks', mutate: (i) => ({ ...i, postKnocks: 0 }) },
    { conjunct: 'backHalfPopulated', name: 'the back half is empty', mutate: (i) => ({ ...i, postBack: 0 }) },
    { conjunct: 'lagPopulated', name: 'no knock had a lag to measure', mutate: (i) => ({ ...i, preLag: 0 }) },
    { conjunct: 'theDefectExisted', name: 'the pre world never abandoned a race', mutate: (i) => ({ ...i, preAbandon: 0 }) },
    { conjunct: 'everyKnockWasChosen', name: 'a knock fired without a choice', mutate: (i) => ({ ...i, unarmed: 1 }) },
  ],
});

/* ---- gBoot ---- */
interface BootInput {
  rows: number; width: number; clusters: number; inRange: boolean; preSeeds: number; postSeeds: number;
}
registerGate<BootInput>({
  name: 'gBoot',
  fn: (i) => ({
    oneSharedMatrix: i.rows === BOOT_B,
    widthIsTheClusterCount: i.width === i.clusters,
    indicesInRange: i.inRange,
    clustersAreTheSeeds: i.clusters === i.preSeeds && i.clusters === i.postSeeds && i.clusters > 1,
  }),
  input: {
    rows: bootRows.length, width: bootRows[0]?.length ?? 0, clusters: nClusters,
    inRange: bootRows.every((r) => r.every((v) => v >= 0 && v < nClusters)),
    preSeeds: PRE.cells.length, postSeeds: POST.cells.length,
  },
  mutants: [
    { conjunct: 'oneSharedMatrix', name: 'a second matrix was drawn', mutate: (i) => ({ ...i, rows: BOOT_B + 1 }) },
    { conjunct: 'widthIsTheClusterCount', name: 'the resample width is wrong', mutate: (i) => ({ ...i, width: i.clusters + 1 }) },
    { conjunct: 'indicesInRange', name: 'an index is out of range', mutate: (i) => ({ ...i, inRange: false }) },
    { conjunct: 'clustersAreTheSeeds', name: 'a cluster is not one of the walked seeds', mutate: (i) => ({ ...i, postSeeds: i.postSeeds + 1 }) },
  ],
});

/* ---- gSeed ---- */
interface SeedInput {
  intervals: { name: string; lo: number; hi: number }[];
  consumed: readonly { name: string; range: readonly [number, number] }[];
  band: readonly [number, number];
}
const N_RAN = POST.cells.length;
registerGate<SeedInput>({
  name: 'gSeed',
  fn: (i) => ({
    inBand: i.intervals.every((v) => v.lo >= i.band[0] && v.hi <= i.band[1]),
    pairwiseDisjoint: i.intervals.every((a, ai) => i.intervals
      .every((b, bi) => bi === ai || a.hi < b.lo || b.hi < a.lo)),
    disjointFromTheLedger: i.intervals.every((v) => i.consumed
      .every((c) => v.hi < c.range[0] || c.range[1] < v.lo)),
  }),
  input: {
    intervals: [
      { name: 'ident', lo: IDENT_BASE, hi: IDENT_BASE + IDENT_N - 1 },
      { name: 'sizing', lo: SIZING_BASE, hi: SIZING_BASE + 4 },
      { name: 'battery', lo: BATTERY_BASE, hi: BATTERY_BASE + N_RAN - 1 },
      { name: 'det', lo: DET_SEED, hi: DET_SEED },
    ],
    consumed: CONSUMED, band: BAND,
  },
  mutants: [
    { conjunct: 'inBand', name: 'the band is narrowed under an interval', mutate: (i) => ({ ...i, band: [i.band[0], i.intervals[0].lo] as const }) },
    { conjunct: 'pairwiseDisjoint', name: 'a duplicate interval', mutate: (i) => ({ ...i, intervals: [...i.intervals, { ...i.intervals[0], name: 'dup' }] }) },
    { conjunct: 'disjointFromTheLedger', name: 'the ledger is extended over the battery block', mutate: (i) => ({ ...i, consumed: [...i.consumed, { name: 'x', range: [BATTERY_BASE, BATTERY_BASE + 1] as const }] }) },
  ],
});

/* ---- gStats ---- */
interface StatsInput { base: number; floor: number; published: number[]; step: number }
registerGate<StatsInput>({
  name: 'gStats',
  fn: (i) => ({
    atOrAboveTheFloor: i.base >= i.floor,
    onTheGrid: i.base % i.step === 0,
    clearOfEveryPublishedBase: i.published.every((p) => Math.abs(p - i.base) >= i.step),
  }),
  input: { base: STATS_BASE, floor: STATS_FLOOR, published: [...PUBLISHED_BASES], step: 200 },
  mutants: [
    { conjunct: 'atOrAboveTheFloor', name: 'the ruling floor is raised above the base', mutate: (i) => ({ ...i, floor: i.base + 200 }) },
    { conjunct: 'onTheGrid', name: 'off the 200 grid', mutate: (i) => ({ ...i, base: i.base + 1 }) },
    { conjunct: 'clearOfEveryPublishedBase', name: 'too close to a published base', mutate: (i) => ({ ...i, published: [...i.published, i.base + 1] }) },
  ],
});

/* ---- gEnvClean ---- */
interface EnvInput { preflight: boolean; reasons: string[]; preflightAimedAtCanonical: boolean }
registerGate<EnvInput>({
  name: 'gEnvClean',
  fn: (i) => ({
    notAPreflight: !i.preflight,
    noReasons: i.reasons.length === 0,
    noPreflightOnACanonicalPath: !i.preflightAimedAtCanonical,
  }),
  input: {
    preflight: IS_PREFLIGHT, reasons: PREFLIGHT_REASONS,
    preflightAimedAtCanonical: IS_PREFLIGHT && isCanonicalPath(OUT_PATH),
  },
  mutants: [
    { conjunct: 'notAPreflight', name: 'an override was set', mutate: (i) => ({ ...i, preflight: true }) },
    { conjunct: 'noReasons', name: 'an override reason exists', mutate: (i) => ({ ...i, reasons: ['CBAP_N'] }) },
    { conjunct: 'noPreflightOnACanonicalPath', name: 'a preflight aimed at a canonical path', mutate: (i) => ({ ...i, preflightAimedAtCanonical: true }) },
  ],
});

/* ---- gN ---- */
interface NInput {
  rarest: number; msPerMatch: number; precision: number | null; wall: number;
  cap: number; nStar: number; ran: number; overridden: boolean; sizingIsCommitted: boolean;
}
registerGate<NInput>({
  name: 'gN',
  fn: (i) => ({
    nStarIsTheRuleOutput: i.precision !== null
      && i.nStar === Math.min(Math.max(Math.ceil(N_EVENTS / i.rarest), N_FLOOR), i.wall, i.cap),
    ranAtNStar: i.ran === i.nStar && !i.overridden,
    precisionFromTheCommittedSizing: i.sizingIsCommitted,
  }),
  input: {
    rarest: (POST.nRule as Record<string, number>).rarestPerMatch,
    msPerMatch: (POST.nRule as Record<string, number>).msPerMatch,
    precision: (POST.nRule as Record<string, number>).precisionTerm ?? null,
    wall: (POST.nRule as Record<string, number>).wallTerm,
    cap: (POST.nRule as Record<string, number>).cap,
    nStar: (POST.nRule as Record<string, number>).nStar,
    ran: (POST.nRule as Record<string, number>).ran,
    overridden: (POST.nRule as unknown as Record<string, boolean>).overridden,
    sizingIsCommitted: existsSync(SIZING_PATH),
  },
  mutants: [
    { conjunct: 'nStarIsTheRuleOutput', name: 'N* is not the rule', mutate: (i) => ({ ...i, nStar: i.nStar + 1, ran: i.ran + 1 }) },
    { conjunct: 'ranAtNStar', name: 'the battery ran at another N', mutate: (i) => ({ ...i, ran: i.ran + 1 }) },
    { conjunct: 'precisionFromTheCommittedSizing', name: 'the sizing artifact is absent', mutate: (i) => ({ ...i, sizingIsCommitted: false }) },
  ],
});

/* ---- gHashEnvelope (its input is filled after the body exists) ---- */
interface HashInput { crossOutIdentical: boolean; rederivesFromDisk: boolean; forbidden: string[] }
const FORBIDDEN_BODY_KEYS = ['wallMs', 'generatedAt', 'head', 'outPath', 'elapsedMs', 'msPerMatchRealized'];
let hashInput: HashInput = { crossOutIdentical: true, rederivesFromDisk: true, forbidden: [] };
const hashPredicate = (i: HashInput): Conj => ({
  crossOutDigestIdentical: i.crossOutIdentical,
  rederivesFromTheWrittenBody: i.rederivesFromDisk,
  noInvocationKeyInTheBody: i.forbidden.length === 0,
});
registerGate<HashInput>({
  name: 'gHashEnvelope',
  fn: hashPredicate,
  input: hashInput,
  mutants: [
    { conjunct: 'crossOutDigestIdentical', name: 'the envelope leaked into the digest', mutate: (i) => ({ ...i, crossOutIdentical: false }) },
    { conjunct: 'rederivesFromTheWrittenBody', name: 'the written body does not re-derive', mutate: (i) => ({ ...i, rederivesFromDisk: false }) },
    { conjunct: 'noInvocationKeyInTheBody', name: 'an invocation key sits in the body', mutate: (i) => ({ ...i, forbidden: ['wallMs'] }) },
  ],
});

/* ---- gMutants is the conjunction over the registry; its own conjuncts are declared here ---- */
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
  banner('FATAL (#268.3(a)): the MACHINE-DERIVED coverage map has conjuncts without a mutant —');
  for (const u of uncoveredConjuncts) banner(`  · ${u}`);
  process.exit(3);
}
banner(`liveness: ${REGISTRY.length} gate objects · ${CONJUNCT_TOTAL} conjuncts enumerated FROM THE OBJECTS · every one has a mutant`);

/* ---- run the gates and their mutants ---- */
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
const FROZEN_GATE_NAMES = ['gDet', 'gIdentity', 'xFpProd', 'gProdUntouched', 'gScope',
  'gArmsDistinct', 'gLifetimeLaw', 'gKnockAndGo', 'gWorld', 'gNonVac', 'gBoot', 'gSeed',
  'gStats', 'gEnvClean', 'gHashEnvelope', 'gN', 'gMutants'];

/* ========================================================================== */
/* §12 THE ARTIFACT                                                            */
/* ========================================================================== */
const buildBody = (): Record<string, unknown> => ({
  schema: 'cb-aftermath-polish/v1',
  probeSha: SELF_SHA,
  arms: {
    pre: { fixPresent: PRE.fixPresent, srcFacts: PRE.srcFacts, summary: PRE.summary, nRule: PRE.nRule },
    post: { fixPresent: POST.fixPresent, srcFacts: POST.srcFacts, summary: POST.summary, nRule: POST.nRule },
  },
  seeds: { band: BAND, ident: [IDENT_BASE, IDENT_BASE + IDENT_N - 1], sizing: SIZING_BASE,
    battery: [BATTERY_BASE, BATTERY_BASE + N_RAN - 1], det: DET_SEED, n: N_RAN, consumed: CONSUMED },
  stats: { base: STATS_BASE, step: 200, resamples: BOOT_B, clusters: nClusters },
  law: {
    form: 'until = simTime + max( TOUCH_RECOLLECT_BASE + push·TOUCH_RECOLLECT_PER_PUSH , brake + turn + close )',
    terms: {
      dInfinity: 'releaseSpeed / BALL_FRICTION_K (the ball roll-out limit, closed form)',
      brake: '|v| / accel', turn: 'θ(momentum → rollOut) / TURN_RATE', close: 'sqrt(2·d / accel)',
    },
    constants: {
      BALL_FRICTION_K, TURN_RATE, TOUCH_RECOLLECT_BASE, TOUCH_RECOLLECT_PER_PUSH,
      CONTROL_RADIUS, DT, incumbentFlatMarker: INCUMBENT_MARKER_S,
    },
    rejectedAlternative: 'a per-tick LIVENESS marker (ball loose AND he is nearest) — a new mechanism, an information leak, and not re-derivable; see the stage doc §FIX-③',
  },
  ab: AB,
  identity: { rows: identRows, fingerprints: { pre: PRE.identity.fingerprints, post: POST.identity.fingerprints } },
  gates,
  mutants,
  coverage: COVERAGE_MAP,
  uncoveredConjuncts,
  perClusterCells: { pre: PRE.cells, post: POST.cells },
});

let body = buildBody();
const firstDigest = sha(canonical(body));
const w = writeArtifact(body, OUT_PATH);
const deepKeys = (x: unknown, out: Set<string> = new Set()): Set<string> => {
  if (Array.isArray(x)) { for (const y of x) deepKeys(y, out); return out; }
  if (x !== null && typeof x === 'object') {
    for (const [k, v] of Object.entries(x as Record<string, unknown>)) { out.add(k); deepKeys(v, out); }
  }
  return out;
};
hashInput = {
  crossOutIdentical: w.crossOutIdentical,
  rederivesFromDisk: w.reread === w.digest && w.digest === firstDigest,
  forbidden: FORBIDDEN_BODY_KEYS.filter((k) => deepKeys(body).has(k)),
};
const hashSpec = REGISTRY.find((r) => r.name === 'gHashEnvelope')!;
(hashSpec as unknown as GateSpec<HashInput>).input = hashInput;
({ gates, mutants } = runRegistry());
const mutSpec = REGISTRY.find((r) => r.name === 'gMutants')!;
(mutSpec as unknown as GateSpec<MutInput>).input = {
  uncovered: uncoveredConjuncts,
  dead: mutants.filter((m) => m.gate !== 'gMutants' && !m.live).length,
  total: mutants.filter((m) => m.gate !== 'gMutants').length,
};
({ gates, mutants } = runRegistry());

body = { ...buildBody(), gates, mutants };
const final = writeArtifact(body, OUT_PATH);

const keySetOk = canonical(Object.keys(gates).sort()) === canonical([...FROZEN_GATE_NAMES].sort());
if (!keySetOk) {
  banner(`FATAL: the gate key set is not the FROZEN list (#250.3(i)) — ${Object.keys(gates).sort().join(',')}`);
  process.exit(1);
}
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
banner(`A/B  lag med ${AB.chaseLagMedianTicks.pre} → ${AB.chaseLagMedianTicks.post} ticks · regather ${AB.regatherRate.pre} → ${AB.regatherRate.post} · back ${AB.backRegatherRate.pre} → ${AB.backRegatherRate.post} · abandons ${AB.abandonRate.pre} → ${AB.abandonRate.post}`);
banner(`mutants ${mutants.filter((m) => m.live).length}/${mutants.length} live · re-derives ${final.reread === final.digest} · crossOut ${final.crossOutIdentical}`);
banner(red.length === 0
  ? `GATES GREEN (${Object.keys(gates).length}) · resultSha256 ${final.digest} · ${OUT_PATH}`
  : `GATES *** RED ***: ${red.join(', ')} (${Object.keys(gates).length - red.length}/${Object.keys(gates).length}) · ${OUT_PATH}`);
process.exit(red.length === 0 ? 0 : 1);
