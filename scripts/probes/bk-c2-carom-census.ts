/**
 * ⭐⭐ BK-C2 — THE CAROM CENSUS (docs/world-model/BK-C2-CAROM-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #341 item 3, serving the RED OF RECORD of that ruling —
 * the user's own words at the play-test gate, verbatim: 「弹身体感觉很影响比赛」, and the
 * question that opened it at #340 item 1: 「我发现传球经常会传到别人身上然后反弹回来,这个和
 * 传球速度有关系吗?还是怎么样,」.
 *
 * FOUR FROZEN QUESTION GROUPS (#341 item 3, verbatim scope):
 *   (a) WHO CAROMS — body class (cooldown/stun) × side (the KICKER's teammate vs opponent) ×
 *       distance from the pass line at kick time × context (the quick-exchange story MEASURED).
 *   (b) THE STALE MAP SIZED — for every caromed GROUND pass, what `laneOpenness` scored that
 *       exact line at the moment of choice, BESIDE the counterfactual contact-shell hazard read
 *       on the same line (BK-T3's `flightExposure`-restricted-to-strike-bodies form, re-derived
 *       as an OBSERVER — no mechanism armed, no flag beyond the arm's own set).
 *   (c) THE SPEED QUESTION — carom rate vs ball speed along the line, from the natural variation
 *       the shipped power law already plays, with the speed–distance CONFOUND named and handled
 *       (speed-within-distance-strata, the frozen decomposition of §P).
 *   (d) IMPACT — what share of possession losses and of scored "interceptions" ARE bodyStrike
 *       caroms.
 *
 * INSTRUMENT-ONLY, X-SRC-ZERO: `src/**` is untouched — nothing here arms, doses or edits a
 * seam; the probe IMPORTS the exported readers (`laneOpenness`, `flightExposure`) and reads
 * Match state and the `bkContactLedger` per tick. `gSrcUntouched` proves it against
 * `git diff --stat HEAD -- src` AND `git status --porcelain -- src`.
 *
 * TWO ARMS, SHARED VIRGIN SEEDS: **w11** = `a4MatchFlags(CORRIDOR_WORLD_VERSION)` + the entry's
 * own `armA4World` (the world the user judged) and **w9** = `a4MatchFlags(BK_WORLD_VERSION)` +
 * the same call (the no-DF/no-corridor isolate). Each arm arms ONLY its own flag set, by
 * CALLING `src/game/a4World.ts`'s own composer — no flag literal is typed here. R-乙 epoch 3's
 * `matchFor` idiom, byte for byte, including its null dose arguments.
 *
 * ⭐ CANON, COPIED FROM docs/world-model/CANON.md BESIDE ITS ACTUAL HOME (never re-typed from
 * memory, #301):
 *   · freeze-before-battery — freeze the instrument commit BEFORE the battery; the artifact
 *     records the instrument hash.  HOME: ruling #266.3(c). (paraphrase)
 *   · "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field not in the schema
 *     never enters the body; forbidden-name lists are retired".  HOME:
 *     PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1.
 *   · per-seed cells — per-seed/per-cluster cells stored so every headline re-derives.
 *     HOME: ruling #282.2(ii). (paraphrase)
 *   · gFaces-from-disk — the re-derivation gate parses the SERIALIZED artifact off disk.
 *     HOME: ruling #287 item 1.  VERBATIM extension: "the re-derivation gate covers EVERY
 *     published face; a percentile face requires stored bins" — HOME:
 *     PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 4.
 *   · "a field carries the unit its name claims".  HOME: ruling #294 item 3.
 *   · "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes a gated
 *     face".  HOME: PC-T2-ARMED-WORLD-READ.md §COMMANDER CORRECTIONS item 4.
 *   · "a src-extracted constant pins its extraction to the NAMED call site — anchored match +
 *     line receipt — never first-occurrence".  HOME: BK-C0-BODYBALL-CENSUS.md §COMMANDER
 *     CORRECTIONS item 1 (ruling #306 item 4).
 *   · "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY occurrence's
 *     site".  HOME: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1.
 *   · "a scored face's walk-side predicate is pinned — anchored extraction or fixture —
 *     because the re-derivation gate proves arithmetic, not definitions".  HOME:
 *     DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2.  REFINED at #334 item 2:
 *     "anchored extraction protects the source line; a headline-bearing walk-side predicate
 *     ALSO needs a composition fixture" (HOME: BK-T3 §CORR item 2).
 *   · receipts ≠ effect sizes — arming/plumbing receipts are never quoted as football effect
 *     sizes.  HOMES: ruling #289 item 1 + BU-T1 §CORR item 5. (paraphrase)
 *   · seed discipline — BOOKED = WALKED; blocks consumed whole.  HOME: the standing frontier
 *     practice (#286 item 5 onward). (paraphrase)
 *   · "verifier scratch walks use the stage's own consumed band or the out-of-band scratch
 *     range (≥ 900,000,000) — never the next virgin block".  HOME:
 *     PW-T0C-OBJECTIVE-FIDELITY.md §COMMANDER CORRECTIONS item 6.
 *   · clock honesty — every rate on the 240 s match clock or dual-axis (1 sim-s = 22.5
 *     display-s); APPLIED values, never nominal.  HOMES: ruling #280.2(iii) + PC-T2 §CORR
 *     item 3. (paraphrase)
 *   · "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits matchFlags; true
 *     since #155, stated now, test-pinned; refines #270's E4 correction; matches the perf
 *     diagnostic)".  HOME: ruling #283.2(iv). — quoted because the census walks worlds; THIS
 *     probe builds `Match` DIRECTLY and never round-trips a League, so no worker fixture is
 *     generated and the sentence binds nothing here.
 *
 * ⭐ ENV SURFACE — WHITELIST-OR-REFUSE (#261.2 + #262.2):
 *   accepted: BKC2_MODE (smoke|full, REQUIRED) · BKC2_N · BKC2_OUT.
 *   ANY other `BKC2_*` var is a FATAL refusal, and so is ANY of the ENGINE's own env doors.
 *   Every override is an OVERRIDE run: it may not write a canonical repo path.
 *
 * RUN: BKC2_MODE=full npx tsx scripts/probes/bk-c2-carom-census.ts
 * EXIT: 0 = every gate green · 1 = a gate is RED (reported, NEVER patched) · 2 = a refusal ·
 *       3 = the world/constant construction class BIT (nothing written).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve, sep as pathSep } from 'node:path';
import { Match } from '../../src/sim/Match';
import { BALL_RADIUS, DT, GRAVITY, KICK_COOLDOWN } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, bkArmedVersion, corridorArmedVersion,
  BK_WORLD_VERSION, CORRIDOR_WORLD_VERSION, type A4ArmedVersion,
} from '../../src/game/a4World';
import { laneOpenness } from '../../src/ai/perception';
import { flightExposure, DV_CLEAR_RADIUS } from '../../src/ai/deliveryValueSeat';
import { closestPointOnSegment, dist, type V2 } from '../../src/utils/vec';
import { randomGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §0 ENV — WHITELIST-OR-REFUSE INCL. THE ENGINE DOORS (#261.2 + #262.2)      */
/* ========================================================================== */
const ENV_WHITELIST = ['BKC2_MODE', 'BKC2_N', 'BKC2_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'PITCH_SCALE', 'FIELD_SCALE', 'GOAL_AND_BOX_SCALE', 'BODY_SCALE', 'CONTROL_REACH_SCALE',
  'SPEED_TIME_SCALE'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BKC2_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner('BK-C2 FATAL — refused env surface. '
    + `rogue BKC2_*: [${rogueOwn.join(', ')}] · ENGINE doors set: [${rogueEngine.join(', ')}]. `
    + `The whitelist is exactly: ${ENV_WHITELIST.join(' | ')} (whitelist-or-refuse).`);
  process.exit(2);
}
const MODES = ['smoke', 'full'] as const;
type Mode = (typeof MODES)[number];
const MODE = process.env.BKC2_MODE as Mode | undefined;
if (MODE === undefined || !(MODES as readonly string[]).includes(MODE)) {
  banner(`BK-C2 FATAL — BKC2_MODE is REQUIRED and must be one of ${MODES.join(' | ')}.`);
  process.exit(2);
}
const N_ENV = process.env.BKC2_N !== undefined ? Number(process.env.BKC2_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1 || N_ENV > 999)) {
  banner('BK-C2 FATAL — BKC2_N must be an integer in [1, 999].');
  process.exit(2);
}
const OUT_ENV = process.env.BKC2_OUT;
const PREFLIGHT_REASONS = [
  ...(MODE === 'smoke' ? ['mode=smoke'] : []),
  ...(N_ENV !== undefined ? ['BKC2_N set'] : []),
];
const IS_PREFLIGHT = PREFLIGHT_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bk-c2-carom-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_PATH = OUT_ENV ?? (IS_PREFLIGHT ? '/tmp/bk-c2-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => {
  const abs = pathResolve(p);
  return abs === pathResolve(CANONICAL_OUT) || abs.startsWith(CANONICAL_DIR_ABS + pathSep);
};
if (IS_PREFLIGHT && isCanonical(OUT_PATH)) {
  banner(`BK-C2 FATAL — an OVERRIDE run (${PREFLIGHT_REASONS.join(', ')}) may not write a `
    + `canonical repo path (${OUT_PATH}).`);
  process.exit(2);
}

/* ========================================================================== */
/* §1 SMALL HELPERS                                                           */
/* ========================================================================== */
const t0Wall = Date.now();
const sha = (v: string): string => createHash('sha256').update(v).digest('hex');
const round = (v: number, d = 6): number => (Number.isFinite(v)
  ? Number(v.toFixed(d)) : (Number.isNaN(v) ? Number.NaN : v));
const gitOut = (cmd: string): string => {
  try { return execSync(cmd, { encoding: 'utf8' }).trim(); } catch { return 'GIT-FAILED'; }
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
const sum2 = (m: readonly (readonly number[])[]): number => sum(m.map((r) => sum(r)));
const ratio = (num: number, den: number): number => (den === 0 ? Number.NaN : num / den);
const canonicalJson = (v: unknown): string => {
  if (v === null || typeof v !== 'object') return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalJson).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o).sort().map((k) => `${JSON.stringify(k)}:${canonicalJson(o[k])}`).join(',')}}`;
};
/** the median of a stored histogram, quoted at the LOWER EDGE of the containing bin */
const medianFromBins = (bins: readonly number[], binWidth: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= total / 2) return i * binWidth;
  }
  return (bins.length - 1) * binWidth;
};
const binOf = (v: number, width: number, n: number): number => {
  if (!Number.isFinite(v) || v < 0) return n - 1;
  return Math.min(n - 1, Math.floor(v / width));
};

/* ========================================================================== */
/* §2 THE ANCHORED CONSTANTS — pinned at their NAMED sites, with line receipts  */
/* ========================================================================== */
/**
 * ⭐⭐ CANON, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
 * anchored match + line receipt — never first-occurrence" (HOME: BK-C0 §CORR item 1). Three
 * walk-side definitions of this census are NOT the probe's taste — each is the ENGINE's own
 * line, extracted here with its occurrence count and its site enumerated (canon:
 * needle-occurrence counts, HOME: PC-C0 §CORR item 1):
 *
 *   1. THE STRIKE SHELL — `Match.ts`, inside `bkCollectBodyStrikes`:
 *      `const shell = p.coreRadius + ball.radius;`
 *   2. THE QUICK-EXCHANGE WINDOW N — `constants.ts`: `KICK_COOLDOWN`, the cooldown the contact
 *      law's own filter reads (`p.kickCooldown > 0`). N = KICK_COOLDOWN / DT ticks. NOT taste.
 *   3. THE CHOOSER'S OWN "OPEN LANE" LINE — `PlayerBrain.ts`, inside `groundCandidate`:
 *      `if (gain > 0.15 && lane < 0.4) {` — the ONE place the shipped ground-pass chooser
 *      itself divides a lane into open and contested. The census's OPEN predicate is that
 *      line's own threshold, read off the source, never a chosen cut.
 */
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const PERC_PATH = 'src/ai/perception.ts';
const CONST_PATH = 'src/sim/constants.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const PERC_SRC = readFileSync(PERC_PATH, 'utf8');
const CONST_SRC = readFileSync(CONST_PATH, 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
/** every occurrence of a needle, enumerated with its site — canon, not a spot check */
const occurrences = (src: string, needle: string): { line: number; text: string }[] => {
  const out: { line: number; text: string }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) {
    const ln = lineOf(src, i);
    out.push({ line: ln, text: src.split('\n')[ln - 1].trim() });
    i = src.indexOf(needle, i + 1);
  }
  return out;
};
/** the body of a NAMED method/function declaration, up to the next declaration at its indent */
const namedBody = (src: string, header: string): { body: string; start: number } | null => {
  const start = src.indexOf(header);
  if (start < 0) return null;
  return { body: src.slice(start, start + 6000), start };
};

const SHELL_NEEDLE = 'const shell = p.coreRadius + ball.radius;';
const SHELL_HITS = occurrences(MATCH_SRC, SHELL_NEEDLE);
const SHELL_FN = namedBody(MATCH_SRC, 'private bkCollectBodyStrikes(');
const SHELL_IN_FN = SHELL_FN !== null && SHELL_FN.body.includes(SHELL_NEEDLE);
const SHELL_LINE = SHELL_HITS.length > 0 ? SHELL_HITS[0].line : -1;

const LANE_GATE_NEEDLE = 'if (gain > 0.15 && lane < 0.4) {';
const LANE_GATE_HITS = occurrences(BRAIN_SRC, LANE_GATE_NEEDLE);
const LANE_GATE_RE = /if \(gain > [0-9.]+ && lane < ([0-9.]+)\) \{/;
const LANE_GATE_MATCH = LANE_GATE_RE.exec(BRAIN_SRC);
const OPEN_LANE_THRESHOLD = LANE_GATE_MATCH === null ? Number.NaN : Number(LANE_GATE_MATCH[1]);
const LANE_GATE_LINE = LANE_GATE_HITS.length > 0 ? LANE_GATE_HITS[0].line : -1;
const GROUND_CANDIDATE_FN = namedBody(BRAIN_SRC, 'const groundCandidate = (');
const LANE_GATE_IN_FN = GROUND_CANDIDATE_FN !== null
  && GROUND_CANDIDATE_FN.body.includes(LANE_GATE_NEEDLE);

const KICK_CD_NEEDLE = 'export const KICK_COOLDOWN = ';
const KICK_CD_HITS = occurrences(CONST_SRC, KICK_CD_NEEDLE);
const KICK_CD_LINE = KICK_CD_HITS.length > 0 ? KICK_CD_HITS[0].line : -1;
/** ⭐ N — THE QUICK-EXCHANGE WINDOW, DERIVED FROM THE ENGINE'S OWN COOLDOWN, never taste */
const QUICK_N_TICKS = Math.round(KICK_COOLDOWN / DT);

const LANE_GUARD_NEEDLE = 'if (dist(cp, from) < 1.5) continue;';
const LANE_GUARD_HITS = occurrences(PERC_SRC, LANE_GUARD_NEEDLE);
const LANE_OPENNESS_FN = namedBody(PERC_SRC, 'export function laneOpenness(');
const LANE_GUARD_IN_FN = LANE_OPENNESS_FN !== null
  && LANE_OPENNESS_FN.body.includes(LANE_GUARD_NEEDLE);
const LANE_GUARD_LINE = LANE_GUARD_HITS.length > 0 ? LANE_GUARD_HITS[0].line : -1;

const ANCHORS_OK = SHELL_HITS.length === 1 && SHELL_IN_FN && SHELL_LINE > 0
  && LANE_GATE_HITS.length === 1 && LANE_GATE_IN_FN && OPEN_LANE_THRESHOLD === 0.4
  && KICK_CD_HITS.length === 1 && KICK_CD_LINE > 0 && QUICK_N_TICKS === 27
  && LANE_GUARD_HITS.length >= 1 && LANE_GUARD_IN_FN
  && DV_CLEAR_RADIUS === 1.5;
if (!ANCHORS_OK) {
  banner('BK-C2 FATAL — the anchored extraction did not land. '
    + `shell hits=${SHELL_HITS.length} inFn=${SHELL_IN_FN} · laneGate hits=${LANE_GATE_HITS.length} `
    + `thr=${OPEN_LANE_THRESHOLD} inFn=${LANE_GATE_IN_FN} · KICK_COOLDOWN hits=${KICK_CD_HITS.length} `
    + `N=${QUICK_N_TICKS} · laneGuard hits=${LANE_GUARD_HITS.length} inFn=${LANE_GUARD_IN_FN}`);
  process.exit(3);
}

/* ========================================================================== */
/* §3 THE FROZEN BINS AND PREDICATES                                          */
/* ========================================================================== */
/** perpendicular distance of the striking body from the pass line AT KICK TIME */
const PERP_BIN_M = 0.5;
const PERP_BINS = 13; // [0, 6) m in 0.5 m steps + one overflow bin
/** the ball's speed along the line at the kick (the shipped power law's own variation) */
const SPEED_BIN_MS = 2;
const SPEED_BINS = 16; // [0, 30) m/s in 2 m/s steps + one overflow bin
/** the pass distance — the CONFOUND axis (#341 item 3(c): speed covaries with distance) */
const DIST_BIN_M = 5;
const DIST_BINS = 9; // [0, 40) m in 5 m steps + one overflow bin
/** the choice-map axes, both natively [0, 1] */
const LANE_BINS = 10;
const HAZ_BINS = 10;
const UNIT_BIN = 0.1;
/** ticks since the striking body's OWN last kick — the quick-exchange story, N-anchored */
const AGE_EDGES = [QUICK_N_TICKS / 3, (2 * QUICK_N_TICKS) / 3, QUICK_N_TICKS, 2 * QUICK_N_TICKS];
const AGE_BINS = AGE_EDGES.length + 1; // the last bin is "older than 2N, or never kicked"
const ageBin = (ticks: number): number => {
  if (!Number.isFinite(ticks) || ticks < 0) return AGE_BINS - 1;
  for (let i = 0; i < AGE_EDGES.length; i++) if (ticks < AGE_EDGES[i]) return i;
  return AGE_BINS - 1;
};
/** how long a released flight stays the ball's "current flight" for strike attribution */
const FLIGHT_RETIRE_TICKS = 720; // R9's own retire cap, inherited (BK-C1 §3)

/* ========================================================================== */
/* §4 THE ARMS — armed by CALLING src/game/a4World.ts, never by typed flags     */
/* ========================================================================== */
const ARMS = ['w9', 'w11'] as const;
type Arm = (typeof ARMS)[number];
const ARM_VERSION: Record<Arm, A4ArmedVersion> = {
  w9: BK_WORLD_VERSION, w11: CORRIDOR_WORLD_VERSION,
};
const ARM_READBACK: Record<Arm, (m: Match) => number> = {
  w9: bkArmedVersion, w11: corridorArmedVersion,
};
const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐ R-乙 epoch 3's `matchFor`, byte for byte: the entry's TWO calls, null doses. */
const buildMatch = (arm: Arm, seed: number): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  const v = ARM_VERSION[arm];
  const m = new Match({ ...base, ...a4MatchFlags(v) } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, v);
  return m;
};

/* ========================================================================== */
/* §5 THE OBSERVER READS — the choice map and its contact-shell counterfactual  */
/* ========================================================================== */
/**
 * ⭐⭐ THE STRIKE-ELIGIBLE BODY SET, the contact law's own gate read as an OBSERVER at the
 * moment of choice. `bkCollectBodyStrikes` collects a body that is (i) not `sentOff`,
 * (ii) `kickCooldown > 0 || stunTimer > 0`, (iii) not the ball's own `lastTouch`. Two sets are
 * published, both pre-registered, because the third condition and the cooldown clock both move
 * DURING the flight and a chooser cannot see the future:
 *
 *   · `all`     — every body on the pitch except the kicker himself, both sides. The PHYSICAL
 *                 read: this is the shell that already blocks an access line, and any of these
 *                 bodies can be cooling by the time the ball arrives. An UPPER bound.
 *   · `cooling` — restricted to the bodies that ARE inside the contact law's gate at the
 *                 choice tick. The chooser-honest read; it UNDERSTATES, because a body may
 *                 enter cooldown while the ball travels.
 */
const strikeBodies = (
  m: Match, kicker: Player, targetGid: number, coolingOnly: boolean,
): Player[] => {
  const out: Player[] = [];
  for (const p of m.allPlayers) {
    if (p.sentOff) continue;
    if (p.gid === kicker.gid) continue;
    /**
     * ⭐⭐ THE INTENDED RECEIVER IS NAMED OUT — BK-C1 §4(ii)'s own anchored condition, reused
     * verbatim in intent: "a delivery that reaches its man and is met there is a delivery
     * ARRIVING, not a block". He stands AT the aim point, so leaving him in would make every
     * line blocked and every hazard 1 — the predicate would carry no information at all.
     * (Measured in the sizing smoke: without this exclusion 74/74 ground lines read BLOCKED.)
     */
    if (p.gid === targetGid) continue;
    if (coolingOnly && !(p.kickCooldown > 0 || p.stunTimer > 0)) continue;
    out.push(p);
  }
  return out;
};
/**
 * ⭐ THE SHELL-BLOCKED PREDICATE — "is there a body whose PHYSICAL SHELL sits on this line".
 * The shell is the contact law's own (`Match.ts`: `const shell = p.coreRadius + ball.radius;`,
 * anchored above); a body is on the line when the closest point of the segment to him is
 * inside his shell. NO 1.5 m guard is applied here — that guard ("the kick clears them") is
 * exactly the assumption #340 item 2(c) named as now-false, and its size is published beside
 * this predicate as `onlyInsideGuard`.
 */
interface ShellRead { blocked: boolean; blockedOutsideGuard: boolean; nearestPerpM: number }
const shellRead = (from: V2, aim: V2, bodies: readonly Player[]): ShellRead => {
  let blocked = false;
  let outside = false;
  let nearest = Number.POSITIVE_INFINITY;
  const d = dist(from, aim);
  for (const o of bodies) {
    const cp = closestPointOnSegment(from, aim, o.pos);
    const perp = dist(cp, o.pos);
    const shell = o.coreRadius + BALL_RADIUS;
    if (perp < nearest) nearest = perp;
    /** BK-C1 §4(ii)'s second anchored condition: SHORT OF THE TARGET, i.e. `along < d − shell`. */
    if (perp < shell && dist(from, cp) < d - shell) {
      blocked = true;
      if (dist(cp, from) >= DV_CLEAR_RADIUS) outside = true;
    }
  }
  return { blocked, blockedOutsideGuard: outside, nearestPerpM: nearest };
};

/* ========================================================================== */
/* §6 THE PER-SEED, PER-ARM ROW (per-seed cells — canon, home ruling #282.2)   */
/* ========================================================================== */
interface ArmRow {
  worldOk: boolean; armedVersion: number; ticks: number; playingTicks: number;
  /* --- the engine's own receipts (never football findings) --- */
  ledStrikesApplied: number; ledStrikeClaims: number; ledPartitionGroundTicks: number;
  /* --- (a) WHO CAROMS --- */
  strikes: number;                    // strikes the walk ATTRIBUTED to a body
  strikesUnattributed: number;        // ledger said a strike, the walk could not name the body
  strikeByClass: number[];            // [cooldown, stunned]
  strikeBySide: number[];             // [kicker's teammate, kicker's opponent, no live flight]
  strikeClassSide: number[][];        // [cooldown|stunned] × [teammate|opponent]
  strikePerpBins: number[];           // perpendicular distance from the pass line AT KICK TIME
  strikeAgeBins: number[];            // ticks since the striking body's OWN last kick
  strikeTouchAgeBins: number[];       // ticks since the striking body's OWN last BALL CONTACT
  strikeWithinNOfOwnKick: number;     // context: inside the engine's own KICK_COOLDOWN window
  strikeWithinNOfOwnTouch: number;    // context: the same window, on ANY of his own contacts
  strikeIsPreviousPasser: number;     // context: the striker released the PREVIOUS delivery
  strikeOnGroundFlight: number; strikeOnLoftedFlight: number;
  /* --- (b) THE STALE MAP, over GROUND passes with a target line --- */
  gpMeasured: number; gpFromWindup: number; gpFromRelease: number;
  gpLaneBins: number[]; gpHazAllBins: number[]; gpHazCoolBins: number[];
  gpJoint: number[][];                // [laneOpen|laneContested] × [shellBlocked|shellClear]
  gpJointWindup: number[][];          // the same, on the ARM-TIME (true choice) subset only
  gpShellBlockedOnlyInsideGuard: number;
  gpShellBlockedCooling: number;
  gpCaromed: number;                  // measured ground passes whose flight was body-struck
  gpCaromJoint: number[][];
  gpCaromJointWindup: number[][];
  gpCaromLaneBins: number[];
  /* --- (c) THE SPEED QUESTION, with the distance confound stratified --- */
  gpSpeedBins: number[]; gpCaromSpeedBins: number[];
  gpDistBins: number[]; gpCaromDistBins: number[];
  gpSpeedDist: number[][];            // [dist bin][speed bin] launches
  gpCaromSpeedDist: number[][];       // [dist bin][speed bin] caroms
  /* --- (d) IMPACT --- */
  interceptions: number; interceptionsCaromPreceded: number; tackles: number;
  possessionFlips: number; flipsCaromLastContact: number; flipsStrikeSinceRelease: number;
}
const emptyArmRow = (): ArmRow => ({
  worldOk: false, armedVersion: 0, ticks: 0, playingTicks: 0,
  ledStrikesApplied: 0, ledStrikeClaims: 0, ledPartitionGroundTicks: 0,
  strikes: 0, strikesUnattributed: 0,
  strikeByClass: zeros(2), strikeBySide: zeros(3), strikeClassSide: zeros2(2, 2),
  strikePerpBins: zeros(PERP_BINS), strikeAgeBins: zeros(AGE_BINS),
  strikeTouchAgeBins: zeros(AGE_BINS),
  strikeWithinNOfOwnKick: 0, strikeWithinNOfOwnTouch: 0, strikeIsPreviousPasser: 0,
  strikeOnGroundFlight: 0, strikeOnLoftedFlight: 0,
  gpMeasured: 0, gpFromWindup: 0, gpFromRelease: 0,
  gpLaneBins: zeros(LANE_BINS), gpHazAllBins: zeros(HAZ_BINS), gpHazCoolBins: zeros(HAZ_BINS),
  gpJoint: zeros2(2, 2), gpJointWindup: zeros2(2, 2),
  gpShellBlockedOnlyInsideGuard: 0, gpShellBlockedCooling: 0,
  gpCaromed: 0, gpCaromJoint: zeros2(2, 2), gpCaromJointWindup: zeros2(2, 2),
  gpCaromLaneBins: zeros(LANE_BINS),
  gpSpeedBins: zeros(SPEED_BINS), gpCaromSpeedBins: zeros(SPEED_BINS),
  gpDistBins: zeros(DIST_BINS), gpCaromDistBins: zeros(DIST_BINS),
  gpSpeedDist: zeros2(DIST_BINS, SPEED_BINS), gpCaromSpeedDist: zeros2(DIST_BINS, SPEED_BINS),
  interceptions: 0, interceptionsCaromPreceded: 0, tackles: 0,
  possessionFlips: 0, flipsCaromLastContact: 0, flipsStrikeSinceRelease: 0,
});
interface Cell { seed: number; w9: ArmRow; w11: ArmRow }

/* ========================================================================== */
/* §7 THE WALK — one match, one arm, pure reads of engine state                */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'longBalls', 'crosses', 'throughBalls', 'cutbacks', 'clearances',
  'shots', 'headersWon', 'interceptions', 'tackles'] as const;
type StatKey = (typeof STAT_KEYS)[number];
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';

/** the CHOICE READ, computed at the tick the chooser actually chose */
interface ChoiceRead {
  tick: number; fromWindup: boolean; targetGid: number;
  lane: number;            // the value the CHOOSER saw (playmaker multiplier applied)
  laneRaw: number;         // `laneOpenness` itself
  hazAll: number; hazCool: number;
  blockedAll: boolean; blockedAllOutsideGuard: boolean; blockedCool: boolean;
  aimX: number; aimY: number; fromX: number; fromY: number; d: number;
}
/** a released delivery, tracked while it is the ball's CURRENT flight */
interface Flight {
  tick: number; gid: number; side: Side; lofted: boolean; ground: boolean;
  hSpeed: number; d: number; targetGid: number | null;
  posAtKick: Float64Array; live: boolean; struck: boolean;
  choice: ChoiceRead | null; measured: boolean;
  ox: number; oy: number; ax: number; ay: number;
}

const walk = (arm: Arm, seed: number): ArmRow => {
  const m = buildMatch(arm, seed);
  const row = emptyArmRow();
  row.armedVersion = ARM_READBACK[arm](m);
  row.worldOk = row.armedVersion === ARM_VERSION[arm];
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: { gid: number; readyTick: number; aim: V2; targetGid: number } | null;
    possessionSide: Side;
  };
  const players = m.allPlayers;
  const N = players.length;

  const lastKickTick = new Int32Array(N).fill(-1_000_000);
  /** ⭐ the SECOND context axis: a cooling body is far more often a body that just TOUCHED the
   *  ball (a control contact books `CONTACT_COMMIT_TIME`, a whiff books 0.3 s) than one who just
   *  passed it. Measuring only "since his own kick" would tell a story the ledger does not. */
  const lastTouchTick = new Int32Array(N).fill(-1_000_000);
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevLastTouchGid: number | null = m.ball.lastTouch?.gid ?? null;
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevWindupGid: number | null = null;
  let prevWindupReady = -1;
  let prevStrikes = 0;
  let prevStrikesCool = 0;
  let prevPossession: Side = mm.possessionSide;
  let strikeSinceRelease = false;
  let lastContactWasStrike = false;
  /** the body who released the delivery BEFORE the current one — the quick-exchange partner */
  let priorPasserGid: number | null = null;
  let currentPasserGid: number | null = null;
  let flight: Flight | null = null;
  /** the choice reads waiting for their release, keyed by the committing body */
  const pendingChoice = new Map<number, ChoiceRead>();

  /** compute the choice read for a ground pass from `from` to the target's CURRENT position */
  const readChoice = (p: Player, targetGid: number, tick: number, fromWindup: boolean,
    aim: V2): ChoiceRead | null => {
    const opp = m.teams[(1 - p.side) as Side].players;
    const from: V2 = { x: p.pos.x, y: p.pos.y };
    const d = dist(from, aim);
    if (!(d > 1e-6)) return null;
    const laneRaw = laneOpenness(from, aim, opp);
    const lane = Math.min(1, laneRaw * (p.traits.includes('playmaker') ? 1.15 : 1));
    const all = strikeBodies(m, p, targetGid, false);
    const cool = strikeBodies(m, p, targetGid, true);
    const sAll = shellRead(from, aim, all);
    const sCool = shellRead(from, aim, cool);
    return {
      tick, fromWindup, targetGid,
      lane, laneRaw,
      hazAll: flightExposure(from, aim, all),
      hazCool: flightExposure(from, aim, cool),
      blockedAll: sAll.blocked, blockedAllOutsideGuard: sAll.blockedOutsideGuard,
      blockedCool: sCool.blocked,
      aimX: aim.x, aimY: aim.y, fromX: from.x, fromY: from.y, d,
    };
  };

  /** book a finished flight's ground-pass cells (called when the flight retires) */
  const bookFlight = (f: Flight): void => {
    if (!f.measured || f.choice === null) return;
    const c = f.choice;
    const laneIdx = c.lane >= OPEN_LANE_THRESHOLD ? 0 : 1;
    const shellIdx = c.blockedAll ? 0 : 1;
    row.gpMeasured++;
    if (c.fromWindup) row.gpFromWindup++; else row.gpFromRelease++;
    row.gpLaneBins[binOf(c.lane, UNIT_BIN, LANE_BINS)]++;
    row.gpHazAllBins[binOf(c.hazAll, UNIT_BIN, HAZ_BINS)]++;
    row.gpHazCoolBins[binOf(c.hazCool, UNIT_BIN, HAZ_BINS)]++;
    row.gpJoint[laneIdx][shellIdx]++;
    if (c.fromWindup) row.gpJointWindup[laneIdx][shellIdx]++;
    if (c.blockedAll && !c.blockedAllOutsideGuard) row.gpShellBlockedOnlyInsideGuard++;
    if (c.blockedCool) row.gpShellBlockedCooling++;
    const sb = binOf(f.hSpeed, SPEED_BIN_MS, SPEED_BINS);
    const db = binOf(c.d, DIST_BIN_M, DIST_BINS);
    row.gpSpeedBins[sb]++;
    row.gpDistBins[db]++;
    row.gpSpeedDist[db][sb]++;
    if (f.struck) {
      row.gpCaromed++;
      row.gpCaromJoint[laneIdx][shellIdx]++;
      if (c.fromWindup) row.gpCaromJointWindup[laneIdx][shellIdx]++;
      row.gpCaromLaneBins[binOf(c.lane, UNIT_BIN, LANE_BINS)]++;
      row.gpCaromSpeedBins[sb]++;
      row.gpCaromDistBins[db]++;
      row.gpCaromSpeedDist[db][sb]++;
    }
  };
  const retire = (): void => {
    if (flight === null) return;
    bookFlight(flight);
    flight = null;
  };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks++;
    const playing = m.phase === 'playing';
    if (playing) row.playingTicks++;
    const ball = m.ball;
    const lastTouchGid = ball.lastTouch?.gid ?? null;
    const ballIsLive = playing || m.phase === 'restart';

    /* ---- his own last ball contact, read BEFORE this tick's strike rewrites `lastTouch` ---- */
    const touchChanged = lastTouchGid !== null && lastTouchGid !== prevLastTouchGid;

    /* ---- the ledger deltas: the ENGINE's own statement that a strike happened ---- */
    const led = m.bkContactLedger;
    const dStrikes = led.strikesApplied - prevStrikes;
    const dStrikesCool = led.strikesAppliedCooldown - prevStrikesCool;
    prevStrikes = led.strikesApplied;
    prevStrikesCool = led.strikesAppliedCooldown;
    const strikeThisTick = dStrikes > 0;

    /* ---- stat deltas, per side ---- */
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }

    /* ===== (a) THE STRIKE, ATTRIBUTED ===== */
    if (strikeThisTick) {
      /**
       * ⭐ WHO WAS STRUCK. `bkApplyBodyStrike` sets `ball.lastTouch = p` and returns — the
       * shipped one-contact-per-tick order guarantees at most one contact resolves per tick —
       * so the ball's OWN record of who touched it last IS the striking body. The attribution
       * is GATED, not assumed: the named body must still be inside the contact law's own gate
       * (`kickCooldown > 0 || stunTimer > 0`, the strike itself resets neither) and his class
       * must agree with the ledger's own cooldown/stunned split for this tick. A tick that
       * fails either test is booked `strikesUnattributed` and enters NO other cell.
       */
      const striker = lastTouchGid !== null ? players[lastTouchGid] : null;
      const cooling = striker !== null && striker.kickCooldown > 0;
      const stunned = striker !== null && striker.stunTimer > 0;
      const classAgrees = striker !== null
        && ((dStrikesCool === dStrikes && cooling) || (dStrikesCool === 0 && !cooling && stunned));
      if (striker === null || !classAgrees || dStrikes !== 1) {
        row.strikesUnattributed += dStrikes;
      } else {
        row.strikes++;
        row.strikeByClass[cooling ? 0 : 1]++;
        const age = tick - lastKickTick[striker.gid];
        row.strikeAgeBins[ageBin(age)]++;
        if (age <= QUICK_N_TICKS) row.strikeWithinNOfOwnKick++;
        const tAge = tick - lastTouchTick[striker.gid];
        row.strikeTouchAgeBins[ageBin(tAge)]++;
        if (tAge <= QUICK_N_TICKS) row.strikeWithinNOfOwnTouch++;
        if (priorPasserGid === striker.gid) row.strikeIsPreviousPasser++;
        if (flight !== null && flight.live) {
          const sideIdx = striker.side === flight.side ? 0 : 1;
          row.strikeBySide[sideIdx]++;
          row.strikeClassSide[cooling ? 0 : 1][sideIdx]++;
          if (flight.ground) row.strikeOnGroundFlight++; else row.strikeOnLoftedFlight++;
          /* the perpendicular distance from the pass LINE, at KICK TIME */
          const kx = flight.posAtKick[striker.gid * 2];
          const ky = flight.posAtKick[striker.gid * 2 + 1];
          const cp = closestPointOnSegment(
            { x: flight.ox, y: flight.oy }, { x: flight.ax, y: flight.ay }, { x: kx, y: ky },
          );
          row.strikePerpBins[binOf(dist(cp, { x: kx, y: ky }), PERP_BIN_M, PERP_BINS)]++;
          flight.struck = true;
        } else {
          row.strikeBySide[2]++;
        }
      }
      strikeSinceRelease = true;
      lastContactWasStrike = true;
      if (lastTouchGid !== null) lastTouchTick[lastTouchGid] = tick;
    } else if (touchChanged) {
      lastContactWasStrike = false;
      lastTouchTick[lastTouchGid!] = tick;
    }

    /* ===== THE CHOICE SEAT — the ARM-TIME aim, the engine's own record of the choice ===== */
    const wu = mm.pendingPassWindup;
    if (wu !== null && (wu.gid !== prevWindupGid || wu.readyTick !== prevWindupReady)) {
      const p = players[wu.gid];
      const c = readChoice(p, wu.targetGid, tick, true, { x: wu.aim.x, y: wu.aim.y });
      if (c !== null) pendingChoice.set(wu.gid, c);
    }
    prevWindupGid = wu?.gid ?? null;
    prevWindupReady = wu?.readyTick ?? -1;

    /* ===== RELEASE DETECTION — R9's / BK-C0 §2(a)'s idiom, reused verbatim ===== */
    const passT = mm.pendingPass?.t ?? null;
    const passChangedSide: Side | null = (passT !== null && passT !== prevPendingPassT)
      ? (mm.pendingPass?.side ?? null) : null;
    prevPendingPassT = passT;
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        let klass: Klass | null = null;
        if (d.shots[side] > 0) klass = d.headersWon[side] > 0 ? 'headerShot' : 'shot';
        if (d.clearances[side] > 0 && klass === null) {
          klass = d.headersWon[side] > 0 ? 'headerClearance' : 'clearance';
        }
        if (d.passes[side] > 0 && klass === null) {
          klass = d.crosses[side] > 0 ? 'cross'
            : d.cutbacks[side] > 0 ? 'cutback'
              : d.throughBalls[side] > 0 ? 'throughBall'
                : d.longBalls[side] > 0 ? 'loftedPass' : 'shortPass';
        }
        if (d.headersWon[side] > 0 && klass === null) klass = 'headerKnockdown';
        if (klass === null && passChangedSide === side) klass = 'other';
        if (klass === null) continue;
        let gid = -1;
        if (passChangedSide === side && mm.pendingPass !== null) gid = mm.pendingPass.passerGid;
        else if (lastTouchGid !== null && players[lastTouchGid].side === side) gid = lastTouchGid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && players[gid].action.type === 'ThrowOut') klass = 'keeperThrow';
        releases.push({ gid, klass });
      }
    }

    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      lastKickTick[rel.gid] = tick;
      /* shots and headed contacts are NOT deliveries — named out, never booked */
      if (rel.klass === 'shot' || rel.klass === 'headerShot' || rel.klass === 'headerKnockdown'
        || rel.klass === 'headerClearance') { pendingChoice.delete(rel.gid); continue; }
      if (hSpeedNow < 1e-6) { pendingChoice.delete(rel.gid); continue; }
      const p = players[rel.gid];
      const grounded = ball.z === 0 && ball.vz === 0;
      /**
       * ⭐ THE GROUND POPULATION (b)/(c) measure: a delivery whose launch had NO positive
       * vertical component AND whose intended man the engine itself names (`pendingPass
       * .targetGid`). The keeper's punt, the loft switch, the cross and the dink are LOFTED and
       * are censused for (a) only — #340 item 2(c)'s finding is about the GROUND chooser, and
       * the four lofted choosers already pay a corridor price in the w11 arm.
       */
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const lofted = !grounded && vz0 > 0;
      const targetGid = (mm.pendingPass !== null && mm.pendingPass.passerGid === rel.gid)
        ? mm.pendingPass.targetGid : null;
      retire();
      let choice = pendingChoice.get(rel.gid) ?? null;
      pendingChoice.delete(rel.gid);
      if (choice !== null && targetGid !== null && choice.targetGid !== targetGid) choice = null;
      const ox = ball.pos.x - ball.vel.x * DT;
      const oy = ball.pos.y - ball.vel.y * DT;
      const ground = !lofted;
      const measurable = ground && targetGid !== null
        && (rel.klass === 'shortPass' || rel.klass === 'throughBall' || rel.klass === 'cutback');
      if (measurable && choice === null) {
        /* the one-touch bypass releases synchronously (PlayerBrain's own gate) — no wind-up
           seat exists, so the choice is read at the RELEASE tick and booked as such. */
        const t = players[targetGid!];
        choice = readChoice(p, targetGid!, tick, false, { x: t.pos.x, y: t.pos.y });
      }
      const aimX = choice?.aimX ?? (ox + (ball.vel.x / hSpeedNow) * 20);
      const aimY = choice?.aimY ?? (oy + (ball.vel.y / hSpeedNow) * 20);
      const posAtKick = new Float64Array(N * 2);
      for (let i = 0; i < N; i++) {
        posAtKick[i * 2] = players[i].pos.x;
        posAtKick[i * 2 + 1] = players[i].pos.y;
      }
      flight = {
        tick, gid: rel.gid, side: p.side as Side, lofted, ground,
        hSpeed: hSpeedNow, d: choice?.d ?? Number.NaN, targetGid,
        posAtKick, live: true, struck: false,
        choice, measured: measurable && choice !== null,
        ox, oy, ax: aimX, ay: aimY,
      };
      priorPasserGid = currentPasserGid;
      currentPasserGid = rel.gid;
      strikeSinceRelease = false;
      lastContactWasStrike = false;
    }

    /* ===== (d) IMPACT — the engine's own counters, attributed ===== */
    const dInt = d.interceptions[0] + d.interceptions[1];
    if (dInt > 0) {
      row.interceptions += dInt;
      if (strikeSinceRelease) row.interceptionsCaromPreceded += dInt;
    }
    row.tackles += d.tackles[0] + d.tackles[1];
    if (mm.possessionSide !== prevPossession) {
      row.possessionFlips++;
      if (lastContactWasStrike) row.flipsCaromLastContact++;
      if (strikeSinceRelease) row.flipsStrikeSinceRelease++;
      prevPossession = mm.possessionSide;
    }

    /* ===== flight retirement ===== */
    if (flight !== null) {
      if (ball.owner !== null && ball.owner.gid !== flight.gid) retire();
      else if (tick - flight.tick > FLIGHT_RETIRE_TICKS) retire();
    }
    prevLastTouchGid = lastTouchGid;
  }
  retire();
  row.ledStrikesApplied = m.bkContactLedger.strikesApplied;
  row.ledStrikeClaims = m.bkContactLedger.strikeClaimsCooldown + m.bkContactLedger.strikeClaimsStunned;
  row.ledPartitionGroundTicks = m.bkContactLedger.partitionGroundTicks;
  return row;
};

/* ========================================================================== */
/* §8 THE BATTERY — virgin seeds, BOOKED = WALKED, SHARED across the two arms  */
/* ========================================================================== */
const BLOCK_BASE = 12_523_000;
/**
 * ⭐ THE SIZING, PRE-REGISTERED (doc §P.6): the 3-seed scratch smoke put the headline face
 * `caromedGroundOpenLaneButShellBlockedShare` at a bootstrap half-width of ≈ 0.094 on 3 clusters.
 * A cluster bootstrap's half-width falls like 1/sqrt(n), so a half-width ≤ 0.02 needs
 * n ≳ 3·(0.094/0.02)² ≈ 66; 120 is taken because the walk costs ≈ 0.9 s per seed per arm and the
 * authorized block is consumed whole either way. NOT tuned on any battery number.
 */
const N_SEEDS = N_ENV ?? (MODE === 'smoke' ? 2 : 120);
/** ⭐ the sizing smoke walks the OUT-OF-BAND SCRATCH RANGE (canon: verifier scratch seeds) */
const SMOKE_SEEDS = [900_000_000, 900_000_001, 900_000_002];
const BATTERY_SEEDS = MODE === 'smoke'
  ? SMOKE_SEEDS.slice(0, Math.min(N_SEEDS, SMOKE_SEEDS.length))
  : Array.from({ length: N_SEEDS }, (_, i) => BLOCK_BASE + i);
const RECEIPT_SEED = MODE === 'smoke' ? SMOKE_SEEDS[0] : BLOCK_BASE + 999;

const cells: Cell[] = [];
for (const s of BATTERY_SEEDS) {
  cells.push({ seed: s, w9: walk('w9', s), w11: walk('w11', s) });
  banner(`  … seed ${s} walked (${cells.length}/${BATTERY_SEEDS.length}) `
    + `${round((Date.now() - t0Wall) / 1000, 1)} s`);
}
let walksBooked = cells.length * 2;

/** the WORLD-CONSTRUCTION RECEIPT — its own booked seed, both arms (R9's idiom) */
const receiptMatches = Object.fromEntries(
  ARMS.map((a) => [a, buildMatch(a, RECEIPT_SEED)]),
) as Record<Arm, Match>;
const receiptVersions = Object.fromEntries(
  ARMS.map((a) => [a, ARM_READBACK[a](receiptMatches[a])]),
) as Record<Arm, number>;
const receiptLedgerZero = ARMS.every(
  (a) => Object.values(receiptMatches[a].bkContactLedger).every((x) => x === 0),
);
const RECEIPT_OK = ARMS.every((a) => receiptVersions[a] === ARM_VERSION[a]) && receiptLedgerZero;
walksBooked += ARMS.length;

/* pooled cells */
const poolArm = (arm: Arm, pick: (r: ArmRow) => number[]): number[] => {
  const acc = zeros(pick(cells[0][arm]).length);
  for (const c of cells) addInto(acc, pick(c[arm]));
  return acc;
};
const poolArm2 = (arm: Arm, pick: (r: ArmRow) => number[][]): number[][] => {
  const acc = pick(cells[0][arm]).map((x) => zeros(x.length));
  for (const c of cells) addInto2(acc, pick(c[arm]));
  return acc;
};

/* ========================================================================== */
/* §9 (c) THE CONFOUND — the frozen speed-within-distance decomposition        */
/* ========================================================================== */
/**
 * ⭐⭐ THE CONFOUND, NAMED AND HANDLED (#341 item 3(c)'s ⚠, binding). Under the shipped power
 * law a longer pass is struck harder, so the RAW carom-rate-vs-speed marginal cannot separate
 * "faster balls carom more" from "longer passes carom more". The frozen handling, pre-registered
 * BEFORE the battery:
 *
 *   1. the joint table `[distance bin][speed bin]` of launches and caroms is STORED per seed,
 *      so any stratification re-derives off disk;
 *   2. the published DECOMPOSITION splits, WITHIN each distance bin, at that bin's OWN median
 *      speed bin (computed from the POOLED table and stored as `speedSplitByDistBin`), then
 *      pools the upper and the lower halves ACROSS strata. Both halves' rates are published,
 *      as is the RAW marginal pair, so the confound's size is visible rather than argued;
 *   3. the split index is frozen from the pooled table and then treated as a constant by the
 *      per-seed face functions, so the bootstrap is conditional on it. STATED, not hidden.
 */
const splitOf = (pooled: readonly (readonly number[])[]): number[] => pooled.map((rowD) => {
  const total = sum(rowD);
  if (total === 0) return -1;
  let acc = 0;
  for (let i = 0; i < rowD.length; i++) {
    acc += rowD[i];
    if (acc >= total / 2) return i;
  }
  return rowD.length - 1;
});
const SPEED_SPLIT: Record<Arm, number[]> = Object.fromEntries(
  ARMS.map((a) => [a, splitOf(poolArm2(a, (r) => r.gpSpeedDist))]),
) as Record<Arm, number[]>;
/** upper half = speed bins STRICTLY ABOVE the stratum's median bin; lower half = at or below */
const stratSum = (r: ArmRow, arm: Arm, which: 'launch' | 'carom', upper: boolean): number => {
  const tbl = which === 'launch' ? r.gpSpeedDist : r.gpCaromSpeedDist;
  let acc = 0;
  for (let db = 0; db < DIST_BINS; db++) {
    const sp = SPEED_SPLIT[arm][db];
    if (sp < 0) continue;
    for (let sb = 0; sb < SPEED_BINS; sb++) {
      if (upper ? sb > sp : sb <= sp) acc += tbl[db][sb];
    }
  }
  return acc;
};
/** the POOLED marginal median speed bin — the RAW split, distance ignored (the confound's twin) */
const SPEED_MEDIAN_BIN: Record<Arm, number> = Object.fromEntries(
  ARMS.map((a) => [a, splitOf([poolArm(a, (r) => r.gpSpeedBins)])[0]]),
) as Record<Arm, number>;
const rawHalf = (r: ArmRow, arm: Arm, which: 'launch' | 'carom', upper: boolean): number => {
  const pooledMarginal = SPEED_MEDIAN_BIN[arm];
  const bins = which === 'launch' ? r.gpSpeedBins : r.gpCaromSpeedBins;
  let acc = 0;
  for (let sb = 0; sb < SPEED_BINS; sb++) if (upper ? sb > pooledMarginal : sb <= pooledMarginal) acc += bins[sb];
  return acc;
};

/* ========================================================================== */
/* §10 THE FACE TABLE — every published face is (numerator, denominator)       */
/* ========================================================================== */
interface FaceDef {
  num: (c: Cell) => number; den: (c: Cell) => number;
  unit: string; what: string; denNote: string;
}
const FACES: Record<string, FaceDef> = {};
const perArm = (
  key: string, num: (r: ArmRow) => number, den: (r: ArmRow) => number,
  unit: string, what: string, denNote: string,
): void => {
  for (const a of ARMS) {
    FACES[`${a}.${key}`] = {
      num: (c) => num(c[a]), den: (c) => den(c[a]),
      unit, what: `[${a}] ${what}`, denNote,
    };
  }
};

/* --- (a) WHO CAROMS --- */
perArm('strikeShareTeammateOfKicker', (r) => r.strikeBySide[0], (r) => r.strikeBySide[0] + r.strikeBySide[1],
  'share of attributed strikes on a live flight',
  '⭐ (a) SIDE-BLINDNESS SIZED: the share of body strikes whose struck body is the KICKER\'S OWN '
  + 'TEAMMATE. The contact law is side-blind by construction (BK-T1); this is how often that '
  + 'costs the passing side directly.',
  'denominator = strikes attributed to a live flight (teammate + opponent)');
perArm('strikeShareCooldownClass', (r) => r.strikeByClass[0], (r) => r.strikes,
  'share of attributed strikes',
  '(a) BODY CLASS: the share of strikes whose body was in `kickCooldown` (the complement is '
  + '`stunTimer`). The two halves of the shipped claim filter the contact law re-admits.',
  'denominator = every attributed strike');
perArm('strikeShareWithinCooldownOfOwnKick', (r) => r.strikeWithinNOfOwnKick, (r) => r.strikes,
  'share of attributed strikes',
  '⭐ (a) THE QUICK-EXCHANGE STORY, MEASURED: the share of strikes whose struck body kicked the '
  + 'ball himself within N ticks, N = KICK_COOLDOWN / DT (the engine\'s own cooldown constant, '
  + 'anchored — never taste).',
  'denominator = every attributed strike');
perArm('strikeShareWithinCooldownOfOwnTouch', (r) => r.strikeWithinNOfOwnTouch, (r) => r.strikes,
  'share of attributed strikes',
  '⭐ (a) THE SAME WINDOW ON ANY OF HIS OWN CONTACTS — a body is put on `kickCooldown` by a '
  + 'control contact and a whiff as well as by a kick, so this is the honest reading of '
  + '"刚碰过球的人站在线上". Published BESIDE the kick-only face, never instead of it.',
  'denominator = every attributed strike');
perArm('strikeSharePreviousPasser', (r) => r.strikeIsPreviousPasser, (r) => r.strikes,
  'share of attributed strikes',
  '(a) THE SHARPEST FORM of the same story: the struck body released the PREVIOUS delivery — '
  + '快速连续传递后站在线上的"刚出完球的人".',
  'denominator = every attributed strike');
perArm('strikeShareOnGroundFlight', (r) => r.strikeOnGroundFlight,
  (r) => r.strikeOnGroundFlight + r.strikeOnLoftedFlight,
  'share of attributed strikes on a live flight',
  '(a) WHICH DELIVERY PAYS: the share of strikes that happen on a GROUND flight (the chooser '
  + 'that prices no corridor at all) rather than a lofted one.',
  'denominator = strikes attributed to a live flight');

/* --- (b) THE STALE MAP SIZED --- */
perArm('groundOpenLaneButShellBlockedShare', (r) => r.gpJoint[0][0], (r) => r.gpMeasured,
  'share of measured ground passes',
  '⭐⭐ (b) THE STALE MAP, SIZED: the share of measured ground passes played on a line the OLD '
  + 'MAP called OPEN (chooser-seen `laneOpenness` >= the chooser\'s own 0.4 gate) while the '
  + 'CONTACT-SHELL read says a body\'s physical shell sits on that very line.',
  'denominator = ground passes with a named target and a choice read');
perArm('caromedGroundOpenLaneButShellBlockedShare', (r) => r.gpCaromJoint[0][0], (r) => r.gpCaromed,
  'share of caromed ground passes',
  '⭐⭐ (b) THE HEADLINE #341 ASKED FOR: of the ground passes that ACTUALLY caromed, the share '
  + 'whose line the old map called OPEN and the shell read would have called BLOCKED.',
  'denominator = measured ground passes whose flight was body-struck');
perArm('caromedGroundOnOpenLaneShare', (r) => r.gpCaromJoint[0][0] + r.gpCaromJoint[0][1],
  (r) => r.gpCaromed,
  'share of caromed ground passes',
  '(b) the wider form: of the caroms, the share played on a line the old map called OPEN at all.',
  'denominator = measured ground passes whose flight was body-struck');
perArm('caromRateOnOpenLaneShellBlocked', (r) => r.gpCaromJoint[0][0], (r) => r.gpJoint[0][0],
  'caroms per ground pass',
  '⭐ (b) THE DISCRIMINATING PAIR, half one: the carom rate on lines the old map called OPEN and '
  + 'the shell read called BLOCKED.',
  'denominator = measured ground passes in that joint cell');
perArm('caromRateOnOpenLaneShellClear', (r) => r.gpCaromJoint[0][1], (r) => r.gpJoint[0][1],
  'caroms per ground pass',
  '⭐ (b) THE DISCRIMINATING PAIR, half two: the carom rate on lines the old map called OPEN and '
  + 'the shell read ALSO called clear. If the shell read carries information the old map does '
  + 'not, this is the lower number.',
  'denominator = measured ground passes in that joint cell');
perArm('groundShellBlockedOnlyInsideGuardShare', (r) => r.gpShellBlockedOnlyInsideGuard,
  (r) => r.gpMeasured,
  'share of measured ground passes',
  '⭐ (b) THE FALSE 1.5 m CLEARANCE, SIZED: the share of ground passes whose ONLY shell-blocking '
  + 'body sits inside `laneOpenness`\'s own "the kick clears them" guard — the assumption #340 '
  + 'item 2(c) named as now-false under the contact law.',
  'denominator = ground passes with a named target and a choice read');
perArm('groundShellBlockedCoolingShare', (r) => r.gpShellBlockedCooling, (r) => r.gpMeasured,
  'share of measured ground passes',
  '(b) the chooser-honest lower bound: the share of ground passes with a body ALREADY inside the '
  + 'contact law\'s gate (cooling or stunned) sitting on the line at the moment of choice.',
  'denominator = ground passes with a named target and a choice read');
perArm('groundCaromRate', (r) => r.gpCaromed, (r) => r.gpMeasured,
  'caroms per ground pass',
  '(b)/(c) THE BASE RATE: measured ground passes whose flight was struck by a body.',
  'denominator = ground passes with a named target and a choice read');

/* --- (c) THE SPEED QUESTION — each arm's strata read that arm's OWN frozen split --- */
for (const a of ARMS) {
  FACES[`${a}.caromRateSpeedUpperHalfWithinDistance`] = {
    num: (c) => stratSum(c[a], a, 'carom', true), den: (c) => stratSum(c[a], a, 'launch', true),
    unit: 'caroms per ground pass',
    what: `[${a}] ⭐⭐ (c) THE SPEED ANSWER, CONFOUND-HANDLED: the carom rate of the FASTER half `
      + 'of each distance stratum, pooled across strata (the split is each stratum\'s own median '
      + 'speed bin, frozen from the pooled table).',
    denNote: 'denominator = measured ground passes in the upper speed half of their own distance bin',
  };
  FACES[`${a}.caromRateSpeedLowerHalfWithinDistance`] = {
    num: (c) => stratSum(c[a], a, 'carom', false), den: (c) => stratSum(c[a], a, 'launch', false),
    unit: 'caroms per ground pass',
    what: `[${a}] ⭐⭐ (c) the matching SLOWER half, same strata. The pair IS the answer to `
      + '「和传球速度有关系吗」 — within-distance, so the power law\'s own distance coupling '
      + 'cannot masquerade as a speed effect.',
    denNote: 'denominator = measured ground passes in the lower speed half of their own distance bin',
  };
  FACES[`${a}.caromRateSpeedUpperHalfRaw`] = {
    num: (c) => rawHalf(c[a], a, 'carom', true), den: (c) => rawHalf(c[a], a, 'launch', true),
    unit: 'caroms per ground pass',
    what: `[${a}] (c) THE RAW MARGINAL, published ONLY so the confound's size is visible: the `
      + 'faster half of ALL ground passes, split at the pooled median speed bin, distance '
      + 'ignored. ⚠ NOT the answer — the stratified pair above is.',
    denNote: 'denominator = measured ground passes above the pooled median speed bin',
  };
  FACES[`${a}.caromRateSpeedLowerHalfRaw`] = {
    num: (c) => rawHalf(c[a], a, 'carom', false), den: (c) => rawHalf(c[a], a, 'launch', false),
    unit: 'caroms per ground pass',
    what: `[${a}] (c) the matching raw lower half. ⚠ NOT the answer.`,
    denNote: 'denominator = measured ground passes at or below the pooled median speed bin',
  };
}

/* --- (d) IMPACT --- */
perArm('interceptionCaromPrecededShare', (r) => r.interceptionsCaromPreceded, (r) => r.interceptions,
  'share of scored interceptions',
  '⭐⭐ (d) THE "拦截" DECOMPOSED: the share of the engine\'s OWN scored `interceptions` that '
  + 'happened with a bodyStrike carom already on the ball since the delivery was released. This '
  + 'is what the epoch-3 explosion of Q27 (interceptions per tackle) is made of.',
  'denominator = every `team.stats.interceptions` increment, both teams');
perArm('possessionFlipCaromLastContactShare', (r) => r.flipsCaromLastContact, (r) => r.possessionFlips,
  'share of possession flips',
  '⭐ (d) THE LOSSES: the share of possession changes (the engine\'s own `possessionSide` flip) '
  + 'whose LAST ball contact before the flip was a bodyStrike carom.',
  'denominator = every possessionSide flip in the match');
perArm('possessionFlipStrikeSinceReleaseShare', (r) => r.flipsStrikeSinceRelease, (r) => r.possessionFlips,
  'share of possession flips',
  '(d) the wider form: a strike happened anywhere between the last release and the flip.',
  'denominator = every possessionSide flip in the match');
perArm('interceptionsPerTackle', (r) => r.interceptions, (r) => r.tackles,
  'interceptions per tackle',
  '(d) OUR OWN READ of R-乙\'s Q27 axis on this census\'s seeds, published so the decomposition '
  + 'above is anchored to a number of the same shape. ⚠ NOT a re-measurement of R-乙: different '
  + 'seeds, different cluster count.',
  'denominator = every `team.stats.tackles` increment, both teams');
perArm('strikesPerMatch', (r) => r.strikes, () => 1,
  'attributed strikes per match (240 s sim clock)',
  '(a) the scale of the phenomenon per match. ⚠ CLOCK: our match is 240 sim-seconds; 1 sim-s = '
  + '22.5 display-s (the dual-clock law, R-乙 §人话).',
  'denominator = matches walked (1 per cell)');
perArm('strikeAttributionCompleteness', (r) => r.strikes, (r) => r.strikes + r.strikesUnattributed,
  'share of ledger strikes the walk could name',
  '(a) THE INSTRUMENT\'S OWN HONESTY FACE: the share of the engine-ledgered applied strikes the '
  + 'walk attributed to a named body. ⚠ AN ARMING/INSTRUMENT RECEIPT, never a football finding '
  + '(canon: receipts != effect sizes).',
  'denominator = every applied strike the engine ledgered');

const FACE_KEYS = Object.keys(FACES).sort();

/* ========================================================================== */
/* §11 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)  */
/* ========================================================================== */
/**
 * ⭐ STATS CONSUMED: ZERO. The intervals are BOOTSTRAP RESAMPLES OF THE WALKED SEEDS, not a
 * registry-consuming statistic (the IN-T0 / DF-T2 / IN-T1 / BK-C1 precedent, #329 item 4). The
 * next stats base therefore remains >= 117,600. The resample rng is seeded from the SEED BLOCK's
 * own base, so the draw is reproducible without booking anything. The CLUSTER is the SEED, and
 * both arms ride the same resampled seed — the arms are paired by construction.
 */
const BOOTSTRAP = 2000;
const seedsWalked = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = cells.map((c) => f.num(c));
  const de = cells.map((c) => f.den(c));
  const point = ratio(sum(nu), sum(de));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0;
    let dd = 0;
    for (const i of idx) { n += nu[i]; dd += de[i]; }
    const v = ratio(n, dd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  return {
    face: key, unit: f.unit, what: f.what, denNote: f.denNote,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`BK-C2 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};

/* ========================================================================== */
/* §12 THE R-乙 QUOTATION — epoch 3's Q27 fields, READ OFF ITS OWN ARTIFACT    */
/* ========================================================================== */
/**
 * ⭐ CANON, VERBATIM: "a stage doc's prose quotes artifact FIELDS verbatim or the number becomes
 * a gated face" (HOME: PC-T2 §CORR item 4). #341 item 3(d) says the 1.95 -> ~19–21 numbers are
 * quoted "only from R-乙's ledger fields", so this census READS THEM OUT OF R-乙's OWN ARTIFACT
 * (bytes hashed first — canon: a dose/data-source guard hashes the bytes it reads, not a
 * self-declared field) rather than re-typing them from the doc's prose.
 */
const RYI_PATH = 'docs/world-model/data/r-yi-gap-table-post-entries-w10w11.json';
const RYI_BYTES = readFileSync(RYI_PATH, 'utf8');
const RYI_SHA = sha(RYI_BYTES);
interface RyiRow {
  kind: string; label: string; arm: string; id: string; key: string; unit: string;
  point: number; ci95: [number, number]; num: number; den: number; clusters: number;
}
const RYI_ROWS = ((JSON.parse(RYI_BYTES) as { result: { ledgerRows: RyiRow[] } })
  .result.ledgerRows).filter((r) => r.id === 'Q27');
const RYI_Q27 = Object.fromEntries(RYI_ROWS.map((r) => [r.arm, {
  key: r.key, unit: r.unit, point: r.point, ci95: r.ci95, num: r.num, den: r.den,
  clusters: r.clusters, label: r.label,
}]));
const RYI_OK = RYI_ROWS.length === 4 && RYI_ROWS.every((r) => r.key === 'interceptionsPerTackle')
  && ['bare', 'w9', 'w10', 'w11'].every((a) => RYI_Q27[a] !== undefined);

/* ========================================================================== */
/* §13 THE GATES (frozen — a red gate is REPORTED, never patched)              */
/* ========================================================================== */
const srcDiff = gitOut('git diff --stat HEAD -- src');
const srcStatus = gitOut('git status --porcelain -- src');
const pooled = Object.fromEntries(ARMS.map((a) => [a, {
  strikePerpBins: poolArm(a, (r) => r.strikePerpBins),
  strikeAgeBins: poolArm(a, (r) => r.strikeAgeBins),
  strikeTouchAgeBins: poolArm(a, (r) => r.strikeTouchAgeBins),
  gpLaneBins: poolArm(a, (r) => r.gpLaneBins),
  gpCaromLaneBins: poolArm(a, (r) => r.gpCaromLaneBins),
  gpHazAllBins: poolArm(a, (r) => r.gpHazAllBins),
  gpHazCoolBins: poolArm(a, (r) => r.gpHazCoolBins),
  gpSpeedBins: poolArm(a, (r) => r.gpSpeedBins),
  gpCaromSpeedBins: poolArm(a, (r) => r.gpCaromSpeedBins),
  gpDistBins: poolArm(a, (r) => r.gpDistBins),
  gpCaromDistBins: poolArm(a, (r) => r.gpCaromDistBins),
  gpJoint: poolArm2(a, (r) => r.gpJoint),
  gpJointWindup: poolArm2(a, (r) => r.gpJointWindup),
  gpCaromJoint: poolArm2(a, (r) => r.gpCaromJoint),
  gpCaromJointWindup: poolArm2(a, (r) => r.gpCaromJointWindup),
  gpSpeedDist: poolArm2(a, (r) => r.gpSpeedDist),
  gpCaromSpeedDist: poolArm2(a, (r) => r.gpCaromSpeedDist),
  strikeClassSide: poolArm2(a, (r) => r.strikeClassSide),
}])) as unknown as Record<Arm, Record<string, number[] | number[][]>>;

const totals = Object.fromEntries(ARMS.map((a) => [a, {
  strikes: sum(cells.map((c) => c[a].strikes)),
  strikesUnattributed: sum(cells.map((c) => c[a].strikesUnattributed)),
  ledStrikesApplied: sum(cells.map((c) => c[a].ledStrikesApplied)),
  gpMeasured: sum(cells.map((c) => c[a].gpMeasured)),
  gpCaromed: sum(cells.map((c) => c[a].gpCaromed)),
  gpFromWindup: sum(cells.map((c) => c[a].gpFromWindup)),
  gpFromRelease: sum(cells.map((c) => c[a].gpFromRelease)),
  interceptions: sum(cells.map((c) => c[a].interceptions)),
  tackles: sum(cells.map((c) => c[a].tackles)),
  possessionFlips: sum(cells.map((c) => c[a].possessionFlips)),
  ticks: sum(cells.map((c) => c[a].ticks)),
}])) as unknown as Record<Arm, Record<string, number>>;

const gates: Record<string, boolean> = {
  /** every walked match, both arms, read back as ITS OWN armed version, plus the receipt */
  gWorld: RECEIPT_OK && cells.every((c) => ARMS.every((a) => c[a].worldOk)),
  /** the two arms are the ENTRY's own compositions and nothing else is armed */
  gArmsIsolated: receiptVersions.w9 === BK_WORLD_VERSION
    && receiptVersions.w11 === CORRIDOR_WORLD_VERSION
    && (BK_WORLD_VERSION as number) !== (CORRIDOR_WORLD_VERSION as number),
  /** the shared-seed contract: both arms walked exactly the same seed list */
  gSharedSeeds: cells.length === BATTERY_SEEDS.length
    && cells.every((c, i) => c.seed === BATTERY_SEEDS[i]),
  /** the anchored extraction + the enumerated needle occurrences */
  gAnchoredConstants: ANCHORS_OK,
  /** ⭐ THE WALK'S STRIKE COUNT AGREES WITH THE ENGINE'S OWN LEDGER, match by match */
  gStrikeLedgerAgrees: cells.every((c) => ARMS.every(
    (a) => c[a].strikes + c[a].strikesUnattributed === c[a].ledStrikesApplied,
  )),
  /** ⭐ the attribution is not silently lossy: every arm names >= 99 % of ledgered strikes */
  gStrikeAttributionComplete: ARMS.every(
    (a) => totals[a].ledStrikesApplied > 0
      && totals[a].strikes / totals[a].ledStrikesApplied >= 0.99,
  ),
  /** the joint tables PARTITION their own population, per arm */
  gJointPartition: ARMS.every((a) => sum2(pooled[a].gpJoint as number[][]) === totals[a].gpMeasured
    && sum2(pooled[a].gpCaromJoint as number[][]) === totals[a].gpCaromed
    && sum2(pooled[a].gpJointWindup as number[][]) === totals[a].gpFromWindup
    && sum(pooled[a].gpLaneBins as number[]) === totals[a].gpMeasured
    && sum(pooled[a].gpSpeedBins as number[]) === totals[a].gpMeasured
    && sum2(pooled[a].gpSpeedDist as number[][]) === totals[a].gpMeasured
    && sum2(pooled[a].gpCaromSpeedDist as number[][]) === totals[a].gpCaromed
    && totals[a].gpFromWindup + totals[a].gpFromRelease === totals[a].gpMeasured),
  /** the strata are non-degenerate: both halves of the confound split have a population */
  gStratificationNonVacuous: ARMS.every((a) => {
    const up = sum(cells.map((c) => stratSum(c[a], a, 'launch', true)));
    const lo = sum(cells.map((c) => stratSum(c[a], a, 'launch', false)));
    return up > 0 && lo > 0 && SPEED_SPLIT[a].some((s) => s >= 0);
  }),
  /** the R-乙 Q27 quotation is READ, from hashed bytes, and complete */
  gRyiQ27Quoted: RYI_OK && RYI_SHA.length === 64,
  /** non-vacuity: every quantified face has a non-empty domain, in BOTH arms */
  gNonVacuous: ARMS.every((a) => totals[a].strikes > 0 && totals[a].gpMeasured > 0
    && totals[a].gpCaromed > 0 && totals[a].interceptions > 0 && totals[a].tackles > 0
    && totals[a].possessionFlips > 0 && sum(pooled[a].strikePerpBins as number[]) > 0)
    && cells.length === BATTERY_SEEDS.length,
  gSrcUntouched: srcDiff === '' && srcStatus === '',
  gSeedsBookedEqualWalked: walksBooked === BATTERY_SEEDS.length * ARMS.length + ARMS.length,
  gStatsZero: true, // bootstrap resamples of walked seeds consume no registry statistic
  gFaces: false,    // set below, after the artifact is on disk
};

/* ========================================================================== */
/* §14 THE ARTIFACT                                                            */
/* ========================================================================== */
const BODY_SCHEMA = ['stage', 'definitions', 'world', 'seeds', 'stats', 'whoCaroms',
  'staleMap', 'speedQuestion', 'impact', 'perSeedCells', 'faces', 'gates'] as const;

const binTable = (arm: Arm, key: string, width: number): Record<string, unknown> => ({
  bins: pooled[arm][key],
  binWidth: width,
  medianFromBinsLowerEdge: round(medianFromBins(pooled[arm][key] as number[], width), 6),
  total: sum(pooled[arm][key] as number[]),
});

const whoCaroms = {
  note: '⭐ (a) WHO CAROMS — body class x side x line distance at kick time x context.',
  quickExchangeWindowTicks: QUICK_N_TICKS,
  quickExchangeDerivation: 'N = KICK_COOLDOWN / DT, the ENGINE\'s own cooldown constant (the one '
    + 'the contact law\'s filter reads as `p.kickCooldown > 0`), anchored at '
    + `${CONST_PATH}:${KICK_CD_LINE}. NEVER a taste constant.`,
  ageBinEdgesTicks: AGE_EDGES,
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    attributedStrikes: totals[a].strikes,
    ledgerAppliedStrikes: totals[a].ledStrikesApplied,
    unattributed: totals[a].strikesUnattributed,
    byClassCooldownStunned: poolArm(a, (r) => r.strikeByClass),
    bySideTeammateOpponentNoFlight: poolArm(a, (r) => r.strikeBySide),
    classBySide: pooled[a].strikeClassSide,
    perpDistanceFromLineAtKick: binTable(a, 'strikePerpBins', PERP_BIN_M),
    /** ⚠ NON-UNIFORM BINS (the N-anchored edges above) — a bin-median would carry no unit, so
     *  none is published; the counts and the edges are the face. */
    ticksSinceOwnKick: {
      bins: pooled[a].strikeAgeBins,
      binEdgesTicks: AGE_EDGES,
      total: sum(pooled[a].strikeAgeBins as number[]),
    },
    ticksSinceOwnTouch: {
      bins: pooled[a].strikeTouchAgeBins,
      binEdgesTicks: AGE_EDGES,
      total: sum(pooled[a].strikeTouchAgeBins as number[]),
    },
    withinCooldownOfOwnKick: sum(cells.map((c) => c[a].strikeWithinNOfOwnKick)),
    withinCooldownOfOwnTouch: sum(cells.map((c) => c[a].strikeWithinNOfOwnTouch)),
    wasPreviousPasser: sum(cells.map((c) => c[a].strikeIsPreviousPasser)),
    onGroundFlight: sum(cells.map((c) => c[a].strikeOnGroundFlight)),
    onLoftedFlight: sum(cells.map((c) => c[a].strikeOnLoftedFlight)),
  }])),
};

const staleMap = {
  note: '⭐⭐ (b) THE STALE MAP SIZED — `laneOpenness` at the moment of choice BESIDE the '
    + 'contact-shell counterfactual on the SAME line, re-derived as an OBSERVER.',
  openLaneThreshold: OPEN_LANE_THRESHOLD,
  openLaneProvenance: `the ground-pass chooser's OWN gate line, anchored at ${BRAIN_PATH}:`
    + `${LANE_GATE_LINE} — \`${LANE_GATE_NEEDLE}\`. The census does not choose a cut.`,
  shellProvenance: `the contact law's own shell, anchored at ${MATCH_PATH}:${SHELL_LINE} — `
    + `\`${SHELL_NEEDLE}\` inside \`bkCollectBodyStrikes\`.`,
  guardProvenance: `laneOpenness's own 1.5 m clearance guard, anchored at ${PERC_PATH}:`
    + `${LANE_GUARD_LINE} — \`${LANE_GUARD_NEEDLE}\`; \`flightExposure\` carries it verbatim `
    + `(DV_CLEAR_RADIUS = ${DV_CLEAR_RADIUS}).`,
  counterfactualForm: 'BK-T3\'s hazard is `flightExposure`\'s SHIPPED form restricted to the '
    + 'bodies the flight would ACTUALLY strike. A GROUND pass clears nobody, so the height gate '
    + 'degenerates and the restriction is exactly the BODY SET: `flightExposure(from, aim, '
    + 'strikeBodies)` with the exported function CALLED, never re-implemented. Two body sets are '
    + 'published: `all` (every body but the kicker — the physical upper bound) and `cooling` '
    + '(only the bodies already inside the contact law\'s gate at the choice tick — the '
    + 'chooser-honest lower bound).',
  choiceTick: 'the ARM-TIME seat (`pendingPassWindup`, the engine\'s own record of the committed '
    + 'aim) wherever the shipped wind-up formed one; the RELEASE tick for the one-touch bypass '
    + 'that releases synchronously. The split is published per arm and the joint table is '
    + 'republished on the wind-up-only subset.',
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    measuredGroundPasses: totals[a].gpMeasured,
    fromWindupSeat: totals[a].gpFromWindup,
    fromReleaseTick: totals[a].gpFromRelease,
    caromedGroundPasses: totals[a].gpCaromed,
    jointLaneOpenByShellBlocked: pooled[a].gpJoint,
    jointWindupOnly: pooled[a].gpJointWindup,
    caromJointLaneOpenByShellBlocked: pooled[a].gpCaromJoint,
    caromJointWindupOnly: pooled[a].gpCaromJointWindup,
    jointRowsAre: '[laneOpen, laneContested] x [shellBlocked, shellClear]',
    laneOpennessAtChoice: binTable(a, 'gpLaneBins', UNIT_BIN),
    laneOpennessAtChoiceCaromedOnly: binTable(a, 'gpCaromLaneBins', UNIT_BIN),
    shellHazardAllBodies: binTable(a, 'gpHazAllBins', UNIT_BIN),
    shellHazardCoolingBodies: binTable(a, 'gpHazCoolBins', UNIT_BIN),
    shellBlockedOnlyInsideGuard: sum(cells.map((c) => c[a].gpShellBlockedOnlyInsideGuard)),
    shellBlockedByCoolingBody: sum(cells.map((c) => c[a].gpShellBlockedCooling)),
  }])),
};

const speedQuestion = {
  note: '⭐ (c) THE SPEED QUESTION — the user asked 「这个和传球速度有关系吗」. Answered on the '
    + 'natural variation the shipped power law already plays; NO speed was manipulated (the '
    + 'weight chooser `pwWeightChooser` is dormant in every entry world, #340 item 2(b)).',
  confound: '⚠ SPEED COVARIES WITH PASS DISTANCE under the shipped power law. The published '
    + 'answer is the WITHIN-DISTANCE-STRATUM pair; the raw marginal pair is published beside it '
    + 'ONLY so the confound\'s size is visible. The split is each distance bin\'s OWN median '
    + 'speed bin, frozen from the pooled table (stored below) and treated as a constant by the '
    + 'bootstrap — stated, not hidden.',
  speedBinWidthMs: SPEED_BIN_MS, distanceBinWidthM: DIST_BIN_M,
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    speedSplitByDistBin: SPEED_SPLIT[a],
    speedMedianBinMarginal: SPEED_MEDIAN_BIN[a],
    launchesBySpeedBin: pooled[a].gpSpeedBins,
    caromsBySpeedBin: pooled[a].gpCaromSpeedBins,
    launchesByDistanceBin: pooled[a].gpDistBins,
    caromsByDistanceBin: pooled[a].gpCaromDistBins,
    launchesByDistanceBySpeed: pooled[a].gpSpeedDist,
    caromsByDistanceBySpeed: pooled[a].gpCaromSpeedDist,
    caromRateBySpeedBin: (pooled[a].gpSpeedBins as number[]).map(
      (n, i) => round(ratio((pooled[a].gpCaromSpeedBins as number[])[i], n), 6),
    ),
    caromRateByDistanceBin: (pooled[a].gpDistBins as number[]).map(
      (n, i) => round(ratio((pooled[a].gpCaromDistBins as number[])[i], n), 6),
    ),
  }])),
};

const impact = {
  note: '⭐ (d) IMPACT — what share of the losses and of the scored "interceptions" ARE caroms.',
  interceptionAttribution: 'an `interceptions` increment is CAROM-PRECEDED iff a bodyStrike was '
    + 'applied on the ball at some tick after the most recent release and at or before the '
    + 'increment. A pre-registered ATTRIBUTION rule, not a causal claim.',
  lossAttribution: 'a possession flip (the engine\'s own `possessionSide` change) is '
    + 'CAROM-LAST-CONTACT iff the last ball contact before the flip was a bodyStrike; the wider '
    + '"a strike happened since the last release" form is published beside it.',
  ryiQ27: {
    provenance: { file: RYI_PATH, sha256: RYI_SHA, rowsRead: RYI_ROWS.length },
    note: '#341 item 3(d): the 1.95 -> ~19–21 numbers are quoted ONLY from R-乙\'s ledger '
      + 'FIELDS. They are read out of the artifact above, never re-typed from prose. ⚠ THEY ARE '
      + 'R-乙\'s SEEDS AND CLUSTERS, NOT THIS CENSUS\'S — no comparison of magnitudes between the '
      + 'two instruments is made or implied.',
    rows: RYI_Q27,
  },
  byArm: Object.fromEntries(ARMS.map((a) => [a, {
    interceptions: totals[a].interceptions,
    interceptionsCaromPreceded: sum(cells.map((c) => c[a].interceptionsCaromPreceded)),
    tackles: totals[a].tackles,
    possessionFlips: totals[a].possessionFlips,
    flipsCaromLastContact: sum(cells.map((c) => c[a].flipsCaromLastContact)),
    flipsStrikeSinceRelease: sum(cells.map((c) => c[a].flipsStrikeSinceRelease)),
  }])),
};

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BK-C2',
    title: 'THE CAROM CENSUS — who caroms, the stale map sized, the speed question answered, '
      + 'the impact decomposed',
    doc: 'docs/world-model/BK-C2-CAROM-CENSUS.md',
    contract: 'docs/world-model/BK-BODYBALL-CONTRACT.md',
    authorizedBy: 'COMMANDER RULING #341 item 3 (scope frozen at #340 item 3)',
    kind: 'INSTRUMENT-ONLY CENSUS — zero src behaviour change; no scored hypothesis; publishes '
      + 'MEASUREMENTS, never a football claim',
    userWordsOfRecord: [
      '我发现传球经常会传到别人身上然后反弹回来,这个和传球速度有关系吗?还是怎么样, (#340 item 1)',
      '我直接看的最后一版,传球像人,防守还可以,乱跑缓解,但是弹身体感觉很影响比赛,门将球合理了 (#341 item 1)',
    ],
    xSrcZero: 'the probe imports the EXPORTED readers (`laneOpenness`, `flightExposure`, '
      + '`closestPointOnSegment`) and reads Match state and `bkContactLedger` per tick. No src '
      + 'file is edited and no flag beyond each arm\'s own set is armed.',
    mode: MODE, generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bk-c2-carom-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bk-c2-carom-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: {
      [MATCH_PATH]: sha(MATCH_SRC), [BRAIN_PATH]: sha(BRAIN_SRC),
      [PERC_PATH]: sha(PERC_SRC), [CONST_PATH]: sha(CONST_SRC),
    },
    anchoredSites: [
      { what: 'the strike shell', file: MATCH_PATH, needle: SHELL_NEEDLE,
        occurrences: SHELL_HITS, line: SHELL_LINE, insideNamedFn: 'bkCollectBodyStrikes' },
      { what: 'the chooser\'s own open-lane line', file: BRAIN_PATH, needle: LANE_GATE_NEEDLE,
        occurrences: LANE_GATE_HITS, line: LANE_GATE_LINE, insideNamedFn: 'groundCandidate',
        extracted: OPEN_LANE_THRESHOLD },
      { what: 'the quick-exchange window N', file: CONST_PATH, needle: KICK_CD_NEEDLE,
        occurrences: KICK_CD_HITS, line: KICK_CD_LINE, extractedSeconds: KICK_COOLDOWN,
        extractedTicks: QUICK_N_TICKS },
      { what: 'laneOpenness\'s 1.5 m clearance guard', file: PERC_PATH, needle: LANE_GUARD_NEEDLE,
        occurrences: LANE_GUARD_HITS, line: LANE_GUARD_LINE, insideNamedFn: 'laneOpenness' },
    ],
  },
  definitions: {
    clockHonesty: '1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every '
      + 'per-match COUNT face carries the clock in its unit string; every SHARE face is '
      + 'clock-invariant.',
    strikeAttribution: 'a tick on which the engine\'s `bkContactLedger.strikesApplied` moved by '
      + 'exactly one; the struck body is the ball\'s own `lastTouch` after the step (the shipped '
      + 'one-contact-per-tick order guarantees at most one contact resolves per tick), GATED by '
      + 'the body still being inside the contact law\'s cooldown/stun gate and by his class '
      + 'agreeing with the ledger\'s own split for that tick. Anything else is booked '
      + '`strikesUnattributed` and enters no other cell.',
    liveFlight: 'the most recent release, retired when any body other than the kicker owns the '
      + 'ball or after 720 ticks (R9\'s own retire cap). A strike outside a live flight is '
      + 'booked in the third `bySide` slot and never enters the side or line-distance cells.',
    measuredGroundPass: 'a release whose launch had NO positive vertical component, whose class '
      + 'is shortPass / throughBall / cutback, and for which the engine itself names a target '
      + '(`pendingPass.targetGid`) — so a LINE exists to price. Shots and every headed contact '
      + 'are named out and never booked.',
    perpDistance: 'the distance from the STRIKING body\'s position AT THE KICK TICK to the '
      + 'segment (launch point -> aim), i.e. how far off the line he stood when the ball left. '
      + 'It is NOT where he was when he was struck — bodies move, and the question #341 asked is '
      + 'what the chooser could have seen.',
    honestLimits: [
      '⚠ NO BETWEEN-ARM EFFECT SIZE IS CLAIMED. Two arms are censused because #341 named two; '
      + 'w9 and w11 differ by the DF doors AND the corridor price at once, so any difference '
      + 'between them is multi-factor and is reported as an anatomy, never as an effect.',
      '⚠ THE COUNTERFACTUAL IS AN OBSERVER READ, NOT A MECHANISM. Nothing is armed; the numbers '
      + 'say what a shell-aware price WOULD have seen, not what a world with one would do. That '
      + 'is the fix slice\'s question.',
      '⚠ THE `cooling` BODY SET UNDERSTATES and the `all` set OVERSTATES: cooldown state at the '
      + 'moment of choice is not cooldown state when the ball arrives. Both bounds are published '
      + 'and neither is called the truth.',
      '⚠ THE ATTRIBUTION RULES IN (d) ARE TEMPORAL, NOT CAUSAL. "A carom happened before this '
      + 'interception" is not "this interception happened because of the carom".',
      '⚠ THE ONE-TOUCH BYPASS HAS NO WIND-UP SEAT, so its choice read is taken at the RELEASE '
      + 'tick (a tick or two after the decision). The split is published and the joint table is '
      + 'republished on the wind-up-only subset.',
    ],
  },
  world: {
    arms: ARMS,
    stacks: {
      w9: 'a4MatchFlags(BK_WORLD_VERSION) + armA4World(..., BK_WORLD_VERSION) — 身体诚实的世界',
      w11: 'a4MatchFlags(CORRIDOR_WORLD_VERSION) + armA4World(..., CORRIDOR_WORLD_VERSION) — the '
        + 'world the user judged (world 10 + the pinned rung-0.5 corridor price)',
    },
    armedVersionReadback: receiptVersions,
    expectedVersions: { w9: BK_WORLD_VERSION, w11: CORRIDOR_WORLD_VERSION },
    receiptLedgerZeroAtConstruction: receiptLedgerZero,
    armingIdiom: 'R-乙 epoch 3\'s `matchFor`, byte for byte: the entry\'s TWO calls — the flags '
      + 'at construction, then `armA4World` — with null dose arguments, so the arms are the ones '
      + 'R-乙 epoch 3 walked.',
    workerFixtureNote: 'CANON, VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world '
      + '(League.toJSON omits matchFlags; true since #155, stated now, test-pinned; refines '
      + "#270's E4 correction; matches the perf diagnostic)\" — this probe builds `Match` "
      + 'DIRECTLY and never round-trips a League, so no worker fixture is generated.',
  },
  seeds: {
    block: `${BLOCK_BASE}–${BLOCK_BASE + 999}`,
    booked: BATTERY_SEEDS,
    walked: seedsWalked,
    armsPerSeed: ARMS.length,
    walksTotal: walksBooked,
    receiptSeed: RECEIPT_SEED,
    scratchSmokeSeeds: SMOKE_SEEDS,
    scratchNote: 'the sizing smoke walks the OUT-OF-BAND SCRATCH RANGE (>= 900,000,000) — canon: '
      + 'verifier scratch seeds. The battery seeds come ONLY from the authorized block.',
    bookedEqualsWalked: walksBooked === BATTERY_SEEDS.length * ARMS.length + ARMS.length,
    consumedWhole: 'the block is consumed WHOLE of record',
  },
  stats: {
    consumed: 0,
    note: 'the CIs are BOOTSTRAP RESAMPLES OF THE WALKED SEEDS, not a registry-consuming '
      + 'statistic (the IN-T0 / DF-T2 / IN-T1 / BK-C1 precedent, #329 item 4). The next stats '
      + 'base remains >= 117,600.',
    bootstrapDraws: BOOTSTRAP,
    resampleRngSeed: BLOCK_BASE,
    clusterIsTheSeed: 'both arms ride the same resampled seed — the arms are paired by design.',
  },
  whoCaroms,
  staleMap,
  speedQuestion,
  impact,
  perSeedCells: cells,
  faces: faces.map((f) => ({
    face: f.face, unit: f.unit, what: f.what, denNote: f.denNote,
    value: round(f.value, 8), numerator: f.numerator, denominator: f.denominator,
    ci95: [round(f.ciLo, 8), round(f.ciHi, 8)], halfWidth: round(f.halfWidth, 8),
  })),
  gates,
};

writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
/* §15 gFaces — THE RE-DERIVATION GATE, PARSING THE SERIALIZED ARTIFACT        */
/* ========================================================================== */
/**
 * ⭐ CANON, VERBATIM: "the re-derivation gate covers EVERY published face; a percentile face
 * requires stored bins" (HOME: PC-C0 §CORR item 4). Every face, every median and every published
 * bin summary is re-derived FROM DISK, including the frozen speed split.
 */
const disk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as typeof artifact;
const diskCells = disk.perSeedCells as Cell[];
const diskFaces = disk.faces as {
  face: string; value: number; numerator: number; denominator: number;
}[];
const asNum = (v: number | null | undefined): number => (v === null || v === undefined ? Number.NaN : v);
const eq = (a: number | null, b: number | null): boolean => {
  const x = asNum(a);
  const y = asNum(b);
  return (Number.isNaN(x) && Number.isNaN(y)) || Math.abs(x - y) < 1e-8;
};
let faceChecks = 0;
let faceOk = 0;
const faceFailures: string[] = [];
for (const df of diskFaces) {
  const def = FACES[df.face];
  faceChecks++;
  if (def === undefined) { faceFailures.push(`${df.face}: no definition`); continue; }
  const n = sum(diskCells.map((c) => def.num(c)));
  const d0 = sum(diskCells.map((c) => def.den(c)));
  const ok = n === df.numerator && d0 === df.denominator
    && eq(round(ratio(n, d0), 8), df.value);
  if (ok) faceOk++; else faceFailures.push(`${df.face}: ${n}/${d0} vs ${df.numerator}/${df.denominator}`);
}
const binChecks: [string, boolean][] = [];
const poolDisk = (arm: Arm, pick: (r: ArmRow) => number[]): number[] => {
  const acc = zeros(pick(diskCells[0][arm]).length);
  for (const c of diskCells) addInto(acc, pick(c[arm]));
  return acc;
};
const poolDisk2 = (arm: Arm, pick: (r: ArmRow) => number[][]): number[][] => {
  const acc = pick(diskCells[0][arm]).map((x) => zeros(x.length));
  for (const c of diskCells) addInto2(acc, pick(c[arm]));
  return acc;
};
const diskWho = disk.whoCaroms as typeof whoCaroms;
const diskStale = disk.staleMap as typeof staleMap;
const diskSpeed = disk.speedQuestion as typeof speedQuestion;
const diskImpact = disk.impact as typeof impact;
for (const a of ARMS) {
  const who = (diskWho.byArm as Record<string, Record<string, unknown>>)[a];
  const st = (diskStale.byArm as Record<string, Record<string, unknown>>)[a];
  const sp = (diskSpeed.byArm as Record<string, Record<string, unknown>>)[a];
  const im = (diskImpact.byArm as Record<string, Record<string, number>>)[a];
  const perp = poolDisk(a, (r) => r.strikePerpBins);
  const ages = poolDisk(a, (r) => r.strikeAgeBins);
  const perpPub = who.perpDistanceFromLineAtKick as { bins: number[]; medianFromBinsLowerEdge: number };
  const agePub = who.ticksSinceOwnKick as { bins: number[] };
  binChecks.push([`${a}.perpBins`, JSON.stringify(perp) === JSON.stringify(perpPub.bins)]);
  binChecks.push([`${a}.perpMedian`,
    eq(perpPub.medianFromBinsLowerEdge, round(medianFromBins(perp, PERP_BIN_M), 6))]);
  binChecks.push([`${a}.ageBins`, JSON.stringify(ages) === JSON.stringify(agePub.bins)]);
  binChecks.push([`${a}.touchAgeBins`, JSON.stringify(poolDisk(a, (r) => r.strikeTouchAgeBins))
    === JSON.stringify((who.ticksSinceOwnTouch as { bins: number[] }).bins)]);
  binChecks.push([`${a}.classBySide`, JSON.stringify(poolDisk2(a, (r) => r.strikeClassSide))
    === JSON.stringify(who.classBySide)]);
  binChecks.push([`${a}.byClass`, JSON.stringify(poolDisk(a, (r) => r.strikeByClass))
    === JSON.stringify(who.byClassCooldownStunned)]);
  binChecks.push([`${a}.bySide`, JSON.stringify(poolDisk(a, (r) => r.strikeBySide))
    === JSON.stringify(who.bySideTeammateOpponentNoFlight)]);
  binChecks.push([`${a}.joint`, JSON.stringify(poolDisk2(a, (r) => r.gpJoint))
    === JSON.stringify(st.jointLaneOpenByShellBlocked)]);
  binChecks.push([`${a}.jointWindup`, JSON.stringify(poolDisk2(a, (r) => r.gpJointWindup))
    === JSON.stringify(st.jointWindupOnly)]);
  binChecks.push([`${a}.caromJoint`, JSON.stringify(poolDisk2(a, (r) => r.gpCaromJoint))
    === JSON.stringify(st.caromJointLaneOpenByShellBlocked)]);
  binChecks.push([`${a}.caromJointWindup`, JSON.stringify(poolDisk2(a, (r) => r.gpCaromJointWindup))
    === JSON.stringify(st.caromJointWindupOnly)]);
  for (const [k, pick, width] of [
    ['laneOpennessAtChoice', (r: ArmRow) => r.gpLaneBins, UNIT_BIN],
    ['laneOpennessAtChoiceCaromedOnly', (r: ArmRow) => r.gpCaromLaneBins, UNIT_BIN],
    ['shellHazardAllBodies', (r: ArmRow) => r.gpHazAllBins, UNIT_BIN],
    ['shellHazardCoolingBodies', (r: ArmRow) => r.gpHazCoolBins, UNIT_BIN],
  ] as [string, (r: ArmRow) => number[], number][]) {
    const acc = poolDisk(a, pick);
    const pub = st[k] as { bins: number[]; medianFromBinsLowerEdge: number };
    binChecks.push([`${a}.${k}`, JSON.stringify(acc) === JSON.stringify(pub.bins)]);
    binChecks.push([`${a}.${k}.median`,
      eq(pub.medianFromBinsLowerEdge, round(medianFromBins(acc, width), 6))]);
  }
  const sd = poolDisk2(a, (r) => r.gpSpeedDist);
  const cd = poolDisk2(a, (r) => r.gpCaromSpeedDist);
  binChecks.push([`${a}.speedDist`, JSON.stringify(sd) === JSON.stringify(sp.launchesByDistanceBySpeed)]);
  binChecks.push([`${a}.caromSpeedDist`, JSON.stringify(cd) === JSON.stringify(sp.caromsByDistanceBySpeed)]);
  binChecks.push([`${a}.speedSplit`, JSON.stringify(splitOf(sd)) === JSON.stringify(sp.speedSplitByDistBin)
    && JSON.stringify(splitOf(sd)) === JSON.stringify(SPEED_SPLIT[a])]);
  binChecks.push([`${a}.speedBins`, JSON.stringify(poolDisk(a, (r) => r.gpSpeedBins))
    === JSON.stringify(sp.launchesBySpeedBin)]);
  binChecks.push([`${a}.speedMedianMarginal`,
    splitOf([poolDisk(a, (r) => r.gpSpeedBins)])[0] === sp.speedMedianBinMarginal
    && splitOf([poolDisk(a, (r) => r.gpSpeedBins)])[0] === SPEED_MEDIAN_BIN[a]]);
  binChecks.push([`${a}.distBins`, JSON.stringify(poolDisk(a, (r) => r.gpDistBins))
    === JSON.stringify(sp.launchesByDistanceBin)]);
  binChecks.push([`${a}.impact`,
    im.interceptions === sum(diskCells.map((c) => c[a].interceptions))
    && im.interceptionsCaromPreceded === sum(diskCells.map((c) => c[a].interceptionsCaromPreceded))
    && im.tackles === sum(diskCells.map((c) => c[a].tackles))
    && im.possessionFlips === sum(diskCells.map((c) => c[a].possessionFlips))
    && im.flipsCaromLastContact === sum(diskCells.map((c) => c[a].flipsCaromLastContact))]);
  binChecks.push([`${a}.staleCounts`,
    (st.measuredGroundPasses as number) === sum(diskCells.map((c) => c[a].gpMeasured))
    && (st.caromedGroundPasses as number) === sum(diskCells.map((c) => c[a].gpCaromed))
    && (st.fromWindupSeat as number) === sum(diskCells.map((c) => c[a].gpFromWindup))]);
}
/** the R-乙 quotation re-reads from the same hashed bytes */
binChecks.push(['ryi.q27', (() => {
  const pub = (disk.impact as typeof impact).ryiQ27 as {
    provenance: { sha256: string }; rows: Record<string, { point: number; num: number; den: number }>;
  };
  if (pub.provenance.sha256 !== sha(readFileSync(RYI_PATH, 'utf8'))) return false;
  return ['bare', 'w9', 'w10', 'w11'].every((armName) => {
    const src = RYI_ROWS.find((r) => r.arm === armName);
    const got = pub.rows[armName];
    return src !== undefined && got !== undefined && got.point === src.point
      && got.num === src.num && got.den === src.den;
  });
})()]);
const binFailures = binChecks.filter(([, v]) => !v).map(([k]) => k);
gates.gFaces = faceOk === faceChecks && faceFailures.length === 0 && binFailures.length === 0;
(artifact as { gates: Record<string, boolean> }).gates = gates;
(artifact as { faceCoverage: unknown }).faceCoverage = {
  publishedFaces: FACE_KEYS.length, checksRun: faceChecks, checksPassed: faceOk,
  binChecksRun: binChecks.length, binFailures, failures: faceFailures,
};
/** the ALLOWLIST-SCHEMA hashed body, computed LAST so it covers the final gate values */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
(artifact as { hashedBodySha256: string }).hashedBodySha256 = sha(canonicalJson(body));
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);

/* ========================================================================== */
banner('');
banner('=== BK-C2 — THE CAROM CENSUS ===');
banner(`artifact → ${OUT_PATH}`);
for (const [k, v] of Object.entries(gates)) banner(`  ${v ? 'GREEN' : '**RED**'}  ${k}`);
banner('');
const show = (k: string): string => {
  const f = face(k);
  return `${k} = ${round(f.value, 6)} CI[${round(f.ciLo, 6)}, ${round(f.ciHi, 6)}] `
    + `n=${f.numerator}/${f.denominator}`;
};
for (const a of ARMS) {
  banner(`--- ${a} ---`);
  for (const k of ['strikeShareTeammateOfKicker', 'strikeShareCooldownClass',
    'strikeShareWithinCooldownOfOwnKick', 'strikeSharePreviousPasser', 'strikeShareOnGroundFlight',
    'groundOpenLaneButShellBlockedShare', 'caromedGroundOpenLaneButShellBlockedShare',
    'caromRateOnOpenLaneShellBlocked', 'caromRateOnOpenLaneShellClear',
    'strikeShareWithinCooldownOfOwnTouch',
    'groundShellBlockedOnlyInsideGuardShare', 'groundShellBlockedCoolingShare', 'groundCaromRate',
    'caromRateSpeedUpperHalfWithinDistance', 'caromRateSpeedLowerHalfWithinDistance',
    'caromRateSpeedUpperHalfRaw', 'caromRateSpeedLowerHalfRaw',
    'interceptionCaromPrecededShare', 'possessionFlipCaromLastContactShare',
    'interceptionsPerTackle', 'strikesPerMatch', 'strikeAttributionCompleteness']) {
    banner(`  ${show(`${a}.${k}`)}`);
  }
}
banner(`walks booked = walked: ${walksBooked}  ·  wall ${round((Date.now() - t0Wall) / 1000, 1)} s`);
const red = Object.entries(gates).filter(([, v]) => !v).map(([k]) => k);
if (red.length > 0) banner(`RED GATES: ${red.join(', ')} — REPORTED, NEVER PATCHED`);
process.exit(red.length > 0 ? 1 : 0);
