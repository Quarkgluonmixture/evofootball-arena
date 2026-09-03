/**
 * ⭐⭐ RC-C0 — THE COOPERATION CENSUS (docs/world-model/RC-C0-COOPERATION-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #366 item 3, bound by
 * docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md (§3 RC-C0). Lineage: #360 item 4
 * (the cooperation seat named a HELD DOOR with its own number, DX-C2 §R3's +3.233 m) →
 * docs/world-model/PASSING-SYSTEM-AUDIT-2026-09-02.md §2.1 (the receiver's chair, re-found
 * from his own seat and ranked first) → the user's ratification 「按照推荐和workflow走」 (#366).
 * Instrument family: scripts/probes/dx-c2-meetability-census.ts (the run envelope, the
 * population/composition construction, the account, the cluster bootstrap, the sizing
 * arithmetic, the allowlist-hashed body, the gFaces-off-disk gate — all inherited).
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis, arms no mechanism
 * and makes no football claim. IT ADJUDICATES NOTHING except the ONE pre-committed licence
 * rule frozen at §P.C, whose verdict word it PRINTS FROM THE RULE — the commander rules.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS the shipped
 * exports and reads Match state per tick. THERE IS NO WRAPPER AT ALL: observation is pure
 * per-tick reads after `m.step(DT)`, and `gLockstep` proves observed ≡ unobserved.
 *
 * THE THREE FROZEN QUESTION GROUPS (#366 item 3, verbatim scope):
 *   (a) THE CUE — the OUTWARD alignment cue per same-side off-ball mate (the angle between
 *       the passer's `heading` and the passer→mate bearing — EXTERNAL FIELDS ONLY): the
 *       lock probability at the LAST pre-release tick against the uniform prior, the
 *       sharpening curve, the lock tick, the ambiguity count, the turn cue.
 *   (b) THE WINDOW — W; the target's MEASURED post-strike start delay; the dead time; the
 *       KINEMATIC BOUND `max(topSpeed, 0.1) × deadTime` against the meetable-carried
 *       arrival gap RE-MEASURED on this composition.
 *   (c) THE ARRIVAL ANATOMY — what the meetable receiver was doing at arm and at release,
 *       his velocity toward the elected point, where he stood when the ball reached it,
 *       the outcome partition and the collection distance downstream.
 *
 * ⭐ THE CENSUS'S RIGHT, STATED: the instrument READS the truth record
 * (`pendingPassWindup.{gid, targetGid, aim, aimLead, readyTick}`) ONLY to LABEL the target,
 * the window and the elected point E. The CUE ITSELF is computed from `pos` and `heading`
 * alone — `gCueChannel` proves it with a fixture (two passers with identical external state
 * and different private targets yield IDENTICAL θ vectors).
 *
 * ONE ARM ONLY — WORLD 12's OWN COMPOSITION, the composer CALLED never copied:
 *   a4MatchFlags(12) as construction flags + armA4World(m, null, 12) after construction,
 *   gated on the match by `raArmedVersion(match) === 12`.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, AI_INTERVAL } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT, CORRIDOR_WORLD_WEIGHT,
} from '../../src/game/a4World';
import { PTP_FLIGHT_SPEED } from '../../src/ai/passLeadSeat';
import { PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS } from '../../src/ai/pcLatency';
import { TURN_RATE } from '../../src/sim/Player';
import { dist, type V2 } from '../../src/utils/vec';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type ActionType, type Side, type TeamInfo } from '../../src/sim/types';
import type { Player } from '../../src/sim/Player';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the DX-C2 §1 form                          */
/* ========================================================================== */
const ENV_WHITELIST = ['RCC0_MODE', 'RCC0_N', 'RCC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('RCC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`RC-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.RCC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('RC-C0 FATAL — RCC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.RCC0_N !== undefined ? Number(process.env.RCC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('RC-C0 FATAL — RCC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.RCC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`RCC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`RCC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`RCC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/rc-c0-cooperation-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/rc-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('RC-C0 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the DX-C2 §2 set, unchanged)                              */
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
/** unsigned bin: index 0 = [0,width), last index is OVERFLOW (and underflow) */
const binOf = (v: number, width: number, n: number): number => {
  const i = Math.floor(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
/** signed bin: index 0 = ≤ −half·width, index n−1 = ≥ +half·width; centre bin holds 0 */
const signedBinOf = (v: number, width: number, n: number): number => {
  const half = Math.floor(n / 2);
  const i = half + Math.round(v / width);
  return i < 0 ? 0 : i >= n ? n - 1 : i;
};
/** the MEDIAN of a stored histogram: the bin whose cumulative count first reaches n/2,
 *  reported at the bin's LOWER EDGE × width (a bin-derived median — re-derivable off disk) */
const binMedian = (bins: readonly number[], width: number, signed: boolean): number => {
  const n = sum(bins);
  if (n === 0) return Number.NaN;
  const half = signed ? Math.floor(bins.length / 2) : 0;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc * 2 >= n) return (i - half) * width;
  }
  return (bins.length - 1 - half) * width;
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
   (canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence"; home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1 (ruling #306 item 4))                                       */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const BRAIN_PATH = 'src/ai/PlayerBrain.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const SEAT_PATH = 'src/ai/passLeadSeat.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PERC_PATH = 'src/ai/perception.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const PCLAT_PATH = 'src/ai/pcLatency.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const MATCH_SRC = readFileSync(MATCH_PATH, 'utf8');
const BRAIN_SRC = readFileSync(BRAIN_PATH, 'utf8');
const MECH_SRC = readFileSync(MECH_PATH, 'utf8');
const SEAT_SRC = readFileSync(SEAT_PATH, 'utf8');
const CONST_SRC = readFileSync(CONST_PATH, 'utf8');
const PERC_SRC = readFileSync(PERC_PATH, 'utf8');
const PLAYER_SRC = readFileSync(PLAYER_PATH, 'utf8');
const PCLAT_SRC = readFileSync(PCLAT_PATH, 'utf8');
const TYPES_SRC = readFileSync(TYPES_PATH, 'utf8');
const A4_SRC = readFileSync(A4_PATH, 'utf8');
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};

/** ⭐⭐ THE CUE'S OWN TRACE — the two EXTERNAL body fields, and the turn law that moves one */
const HEADING_NEEDLE = '  heading = v2(1, 0);';
const HEADING_HITS = occurrences(PLAYER_SRC, HEADING_NEEDLE);
const TURN_RATE_NEEDLE = 'export const TURN_RATE = 6.5;';
const TURN_RATE_HITS = occurrences(PLAYER_SRC, TURN_RATE_NEEDLE);
const FACETARGET_NEEDLE = '  faceTarget: V2 | null = null;';
const FACETARGET_HITS = occurrences(PLAYER_SRC, FACETARGET_NEEDLE);
/** the ARM site: the committed passer's aim lock — the reason the heading turns at all */
const ARM_FACE_NEEDLE = '    passer.faceTarget = { x: mate.pos.x, y: mate.pos.y };';
const ARM_FACE_HITS = occurrences(MATCH_SRC, ARM_FACE_NEEDLE);
/** the RECORD and its readyTick composition */
const READYTICK_NEEDLE = '      readyTick: this.stepCount + wTicks + bkTicks,';
const READYTICK_HITS = occurrences(MATCH_SRC, READYTICK_NEEDLE);
/** ⭐ the RESOLVE's own site inside the step — the head-of-tick release (the tick indexing) */
const RESOLVE_CALL_NEEDLE = '    if (this.pendingPassWindup !== null) this.resolvePendingPassWindup();';
const RESOLVE_CALL_HITS = occurrences(MATCH_SRC, RESOLVE_CALL_NEEDLE);
const RESOLVE_GUARD_NEEDLE = '    if (!this.o1PassWindup || pp === null || this.stepCount < pp.readyTick) return;';
const RESOLVE_GUARD_HITS = occurrences(MATCH_SRC, RESOLVE_GUARD_NEEDLE);
/** ⭐⭐ THE RECEIVER'S OWN MACHINE — the strike-gated candidate and its score literal */
const RECEIVE_GATE_NEEDLE = '    if (pass && pass.side === team.side && pass.targetGid === p.gid) {';
const RECEIVE_GATE_HITS = occurrences(BRAIN_SRC, RECEIVE_GATE_NEEDLE);
const RECEIVE_SCORE_NEEDLE = "      cands.push({ action: 'ReceivePass', score: 1.2, why: 'pass is coming to me' });";
const RECEIVE_SCORE_HITS = occurrences(BRAIN_SRC, RECEIVE_SCORE_NEEDLE);
/** the STRIKE is where the receiver's first news is written */
const REGISTER_PASS_NEEDLE = '  match.pendingPass = {';
const REGISTER_PASS_HITS = occurrences(MECH_SRC, REGISTER_PASS_NEEDLE);
/** ⭐⭐ interceptBall's own time-to-point account — DX-C2 §P.A byte for byte */
const TS_CLAMP_NEEDLE = '  const ts = Math.max(p.topSpeed, 0.1);';
const TS_CLAMP_HITS = occurrences(PERC_SRC, TS_CLAMP_NEEDLE);
const TME_NEEDLE = 'const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;';
const TME_HITS = occurrences(PERC_SRC, TME_NEEDLE);
/** topSpeed is a PURE getter (stamina-scaled base speed) — pinned so reads stay side-effect-free */
const TOPSPEED_NEEDLE = '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);';
const TOPSPEED_HITS = occurrences(PLAYER_SRC, TOPSPEED_NEEDLE);
/** the flight law and the presence clause's cut */
const PTP_SPEED_NEEDLE = 'export const PTP_FLIGHT_SPEED = ';
const PTP_SPEED_HITS = occurrences(SEAT_SRC, PTP_SPEED_NEEDLE);
const CONTROL_R_NEEDLE = 'export const CONTROL_RADIUS = ';
const CONTROL_R_HITS = occurrences(CONST_SRC, CONTROL_R_NEEDLE);
/** the DEAD TIME's two named components: the AI cadence and the PC reaction tiers */
const AI_INTERVAL_NEEDLE = 'export const AI_INTERVAL = 0.15;';
const AI_INTERVAL_HITS = occurrences(CONST_SRC, AI_INTERVAL_NEEDLE);
const PC_SIMPLE_NEEDLE = 'export const PC_TIER_SIMPLE_TICKS = Math.round(PC_TIER_SIMPLE_SIM_S / DT); // 12';
const PC_SIMPLE_HITS = occurrences(PCLAT_SRC, PC_SIMPLE_NEEDLE);
const PC_CHOICE_NEEDLE = 'export const PC_TIER_CHOICE_TICKS = Math.round(PC_TIER_CHOICE_SIM_S / DT); // 27';
const PC_CHOICE_HITS = occurrences(PCLAT_SRC, PC_CHOICE_NEEDLE);
/** ⭐ WORLD 12's own composition, CALLED never copied — the arm's own receipt */
const RA_FLAGS_NEEDLE = '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };';
const RA_FLAGS_HITS = occurrences(A4_SRC, RA_FLAGS_NEEDLE);
const RA_ARM_NEEDLE = '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);';
const RA_ARM_HITS = occurrences(A4_SRC, RA_ARM_NEEDLE);

/** ⭐ THE ActionType VOCABULARY — extracted from its own union, never re-typed */
const ACT_BLOCK_START = 'export type ActionType =';
const actBlockIdx = TYPES_SRC.indexOf(ACT_BLOCK_START);
const actBlock = actBlockIdx < 0 ? '' : TYPES_SRC.slice(
  actBlockIdx, TYPES_SRC.indexOf(';', actBlockIdx),
);
const ACTIONS = (actBlock.match(/\|\s*'([A-Za-z]+)'/g) ?? [])
  .map((s) => (/'([A-Za-z]+)'/.exec(s) as RegExpExecArray)[1]) as readonly ActionType[];
const ACT_BLOCK_LINE = actBlockIdx < 0 ? -1 : lineOf(TYPES_SRC, actBlockIdx);
const AI = (a: ActionType | string): number => {
  const i = (ACTIONS as readonly string[]).indexOf(a);
  return i < 0 ? ACTIONS.length : i; // the overflow slot: an unnamed label would be visible
};
const NACT = ACTIONS.length + 1;

const ANCHORS_OK = HEADING_HITS.length === 1 && TURN_RATE_HITS.length === 1
  && FACETARGET_HITS.length === 1 && ARM_FACE_HITS.length === 1
  && READYTICK_HITS.length === 1 && RESOLVE_CALL_HITS.length === 1
  && RESOLVE_GUARD_HITS.length === 1
  && RECEIVE_GATE_HITS.length === 1 && RECEIVE_SCORE_HITS.length === 1
  && REGISTER_PASS_HITS.length === 1
  && TS_CLAMP_HITS.length === 1 && TME_HITS.length === 2
  && TOPSPEED_HITS.length === 1 && PTP_SPEED_HITS.length === 1 && CONTROL_R_HITS.length === 1
  && AI_INTERVAL_HITS.length === 1 && PC_SIMPLE_HITS.length === 1 && PC_CHOICE_HITS.length === 1
  && RA_FLAGS_HITS.length === 1 && RA_ARM_HITS.length === 1
  && PTP_FLIGHT_SPEED === 18 && TURN_RATE === 6.5 && AI_INTERVAL === 0.15
  && PC_TIER_SIMPLE_TICKS === 12 && PC_TIER_CHOICE_TICKS === 27
  && RA_WORLD_VERSION === 12 && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1
  && ACTIONS.length === 23 && ACTIONS.includes('ReceivePass');

/* ========================================================================== */
/* §4 SEEDS — block 12,533,000–999 (#366 item 3)                                */
/* ========================================================================== */
const BLOCK_BASE = 12_533_000;
const BLOCK_TOP = 12_533_999;
/** ⭐⭐ N_FROZEN = 999 — sized by the §DEV-PREFLIGHT smoke BEFORE the freeze commit and
 *  BEFORE any battery seed. The two pre-registered 0.05 targets need 24 clusters (the
 *  licence Δ) and 1,802 clusters (the (b) coverage share on meetable carried); the LARGER
 *  requirement EXCEEDS what this block affords, so N_FROZEN takes the block's own maximum
 *  — 999 battery walks (12,533,000–12,533,998) plus the construction receipt at
 *  12,533,999 — and the sizing table DECLARES the coverage row unresolvable here. No null
 *  may be cut on an unresolvable row. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_001_800;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 80 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

/* ========================================================================== */
/* §5 THE ARM — WORLD 12's OWN COMPOSITION, the composer CALLED never copied    */
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
/** DX-C2's own population construction: the same genome/squad/side/seed plumbing, the same
 *  240 s match, with world 12's flags as CONSTRUCTION flags and world 12's own arming after. */
const buildMatch = (seed: number): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(RA_WORLD_VERSION),
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, RA_WORLD_VERSION);
  return m;
};

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   (canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"; home:
   DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2)                                      */
/* ========================================================================== */
/**
 * ⭐⭐ THE CUE (§P.A) — the OUTWARD alignment angle, in RADIANS, from EXTERNAL FIELDS ONLY.
 * θ = the angle between the passer's `heading` (a unit vector, the shipped body direction)
 * and `unit(mate.pos − passer.pos)`, both read at the SAME tick. Nothing private enters.
 * A degenerate bearing (mate ON the passer) or a degenerate heading names no angle: NaN.
 */
const cueAngle = (
  passerX: number, passerY: number, headX: number, headY: number,
  mateX: number, mateY: number,
): number => {
  const hl = Math.sqrt(headX * headX + headY * headY);
  const dx = mateX - passerX;
  const dy = mateY - passerY;
  const dl = Math.sqrt(dx * dx + dy * dy);
  if (!(hl > 1e-6) || !(dl > 1e-6)) return Number.NaN;
  const c = (headX * dx + headY * dy) / (hl * dl);
  return Math.acos(c < -1 ? -1 : c > 1 ? 1 : c);
};
/** the argmin over a θ vector; NaN entries are EXCLUDED; ties break to the LOWEST index. */
const argminFinite = (theta: readonly number[]): number => {
  let best = -1;
  let bv = Number.POSITIVE_INFINITY;
  for (let i = 0; i < theta.length; i++) {
    const v = theta[i];
    if (!Number.isFinite(v)) continue;
    if (v < bv) { bv = v; best = i; }
  }
  return best;
};
/** the AMBIGUITY count at a tick: how many NON-target mates are at least as well aligned. */
const ambiguityOf = (theta: readonly number[], targetIdx: number): number => {
  const tv = theta[targetIdx];
  if (!Number.isFinite(tv)) return -1;
  let n = 0;
  for (let i = 0; i < theta.length; i++) {
    if (i === targetIdx) continue;
    const v = theta[i];
    if (Number.isFinite(v) && v <= tv) n += 1;
  }
  return n;
};
/**
 * ⭐⭐ THE ACCESS-TIME ACCOUNT — DX-C2 §P.A, REUSED IN SUBSTANCE BYTE FOR BYTE (#366 item 3):
 *   tBall  = dist(passer, E) / PTP_FLIGHT_SPEED       (the chooser's own flight law, `/ 18`)
 *   tMate  = dist(mate, E) / max(topSpeed, 0.1) + 0.15 (`interceptBall`'s own time-to-point)
 *   margin = tBall − tMate                            (positive ⇒ the mate beats the ball)
 *   MEETABLE ⇔ dist(mate, E) ≤ CONTROL_RADIUS OR margin ≥ 0
 */
const marginOf = (dBallPath: number, dMate: number, topSpeed: number): number =>
  dBallPath / PTP_FLIGHT_SPEED - (dMate / Math.max(topSpeed, 0.1) + 0.15);
const meetableOf = (dMate: number, margin: number): boolean =>
  dMate <= CONTROL_RADIUS || margin >= 0;
/** ⭐ DX-C2 §P.D's PREDICTION, reused: where the account says he stands at ball arrival. */
const predictedArrDistOf = (dBallPath: number, dMate: number, topSpeed: number): number => {
  const tBall = dBallPath / PTP_FLIGHT_SPEED;
  const chase = Math.max(0, tBall - 0.15) * Math.max(topSpeed, 0.1);
  return Math.max(0, dMate - chase);
};
/**
 * ⭐⭐ THE DEAD TIME AND THE KINEMATIC BOUND (§P.D).
 *   deadTimeTicks = (releaseTick − lockTick) + startDelayTicks   [never locks ⇒ startDelay only]
 *   boundMetres    = max(topSpeed@t0, 0.1) × deadTimeTicks × DT  [the traced speed law]
 */
const deadTimeTicksOf = (
  releaseTick: number, lockTick: number | null, startDelayTicks: number,
): number => (lockTick === null ? startDelayTicks : releaseTick - lockTick + startDelayTicks);
const boundMetresOf = (topSpeed: number, deadTimeTicks: number): number =>
  Math.max(topSpeed, 0.1) * deadTimeTicks * DT;

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* the angle arithmetic, walked at pinned inputs */
fx('cue.straightAhead', near(cueAngle(0, 0, 1, 0, 5, 0), 0), true);
fx('cue.rightAngle', near(cueAngle(0, 0, 1, 0, 0, 3), Math.PI / 2), true);
fx('cue.behind', near(cueAngle(0, 0, 1, 0, -4, 0), Math.PI), true);
fx('cue.headingNotUnit', near(cueAngle(0, 0, 7, 0, 0, 9), Math.PI / 2), true);
fx('cue.sign.symmetric',
  near(cueAngle(0, 0, 1, 0, 1, 1), cueAngle(0, 0, 1, 0, 1, -1)), true);
fx('cue.degenerateMateOnPasser', Number.isNaN(cueAngle(2, 2, 1, 0, 2, 2)), true);
fx('cue.degenerateHeading', Number.isNaN(cueAngle(0, 0, 0, 0, 1, 1)), true);
fx('argmin.picksSmallest', argminFinite([0.9, 0.2, 1.4]), 1);
fx('argmin.skipsNaN', argminFinite([Number.NaN, 0.7, 1.1]), 1);
fx('argmin.tieToLowestIndex', argminFinite([0.5, 0.5]), 0);
fx('argmin.allNaN', argminFinite([Number.NaN, Number.NaN]), -1);
fx('ambiguity.unambiguous', ambiguityOf([0.1, 0.8, 1.2], 0), 0);
fx('ambiguity.twoBetter', ambiguityOf([0.9, 0.2, 0.4], 0), 2);
fx('ambiguity.tieCounts', ambiguityOf([0.5, 0.5], 0), 1);
/* the account, DX-C2's own fixtures re-walked */
fx('marginOf.toFeet10m', marginOf(10, 0, 8), 10 / 18 - 0.15);
fx('marginOf.lead7mSlow', marginOf(15, 7, 7) < 0, true);
fx('marginOf.shortReachable', marginOf(9, 2, 8) > 0, true);
fx('meetable.presence', meetableOf(CONTROL_RADIUS * 0.5, -9), true);
fx('meetable.positiveMargin', meetableOf(5, 0.01), true);
fx('meetable.zeroMargin', meetableOf(5, 0), true);
fx('meetable.unmeetable', meetableOf(5, -0.01), false);
fx('predictedArrDist.standStill', predictedArrDistOf(2, 0, 8), 0);
fx('predictedArrDist.chaseCloses',
  predictedArrDistOf(18, 4, 8), Math.max(0, 4 - (1 - 0.15) * 8));
fx('predictedArrDist.floorAtZero', predictedArrDistOf(36, 1, 8), 0);
/* the dead-time / bound arithmetic */
fx('deadTime.locked', deadTimeTicksOf(100, 92, 15), 23);
fx('deadTime.neverLocks', deadTimeTicksOf(100, null, 15), 15);
fx('deadTime.lockAtRelease', deadTimeTicksOf(100, 100, 0), 0);
fx('bound.simple', boundMetresOf(7, 30), 7 * 30 / 60);
fx('bound.minSpeedClamp', boundMetresOf(0.05, 60), 0.1 * 60 * DT);
fx('bound.zeroDeadTime', boundMetresOf(7, 0), 0);
/* the bin helpers */
fx('binOf.first', binOf(0.4, 0.5, 21), 0);
fx('binOf.overflow', binOf(999, 0.5, 21), 20);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 21), 10);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 21), 0);
fx('signedBinOf.overflow', signedBinOf(999, 1, 21), 20);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 gCueChannel — THE CHANNEL FIXTURE (the cue reads pos + heading, nothing else)  */
/* ========================================================================== */
/**
 * ⭐⭐ TWO PASSERS, IDENTICAL EXTERNAL STATE, DIFFERENT PRIVATE TARGETS. The census's right
 * is to read the truth record for LABELLING only; the CUE must be blind to it. This fixture
 * builds two bodies with the SAME `pos`/`heading` and DIFFERENT private `faceTarget` /
 * `pendingPassWindup`-style commitments, and asserts the θ VECTOR is byte-identical.
 */
const CUE_MATES: readonly [number, number][] = [[10, 0], [3, 7], [-4, 2], [0, -9], [6, -6]];
const cueVector = (
  px: number, py: number, hx: number, hy: number,
): number[] => CUE_MATES.map(([mx, my]) => cueAngle(px, py, hx, hy, mx, my));
const CUE_A = { pos: { x: 1, y: 2 }, heading: { x: 0.6, y: 0.8 }, faceTarget: { x: 10, y: 0 }, privateTargetGid: 3 };
const CUE_B = { pos: { x: 1, y: 2 }, heading: { x: 0.6, y: 0.8 }, faceTarget: { x: -4, y: 2 }, privateTargetGid: 8 };
const cueVecA = cueVector(CUE_A.pos.x, CUE_A.pos.y, CUE_A.heading.x, CUE_A.heading.y);
const cueVecB = cueVector(CUE_B.pos.x, CUE_B.pos.y, CUE_B.heading.x, CUE_B.heading.y);
/** the NEGATIVE half: a DIFFERENT external heading MUST move the vector (the cue is alive) */
const cueVecC = cueVector(CUE_A.pos.x, CUE_A.pos.y, -CUE_A.heading.x, -CUE_A.heading.y);
const CUE_CHANNEL_OK = JSON.stringify(cueVecA) === JSON.stringify(cueVecB)
  && JSON.stringify(cueVecA) !== JSON.stringify(cueVecC)
  && CUE_A.faceTarget.x !== CUE_B.faceTarget.x
  && CUE_A.privateTargetGid !== CUE_B.privateTargetGid;

/* ========================================================================== */
/* §8 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed)   */
/* ========================================================================== */
const THETA_BIN_DEG = 5;
const THETA_BINS = 36;                 // 0–180° in 5° bins
const LOCK_BIN_TICKS = 1;
const LOCK_BINS = 31;                  // ticks-before-release 0–29, last is overflow
const AMB_BINS = 6;                    // 0–4 non-target mates at least as aligned, + overflow
const W_BIN_TICKS = 1;
const W_BINS = 32;                     // W 0–30 ticks, last is overflow
const SD_BIN_TICKS = 1;
const SD_BINS = 41;                    // start delay 0–39 ticks, last is overflow
const DT_BIN_TICKS = 1;
const DTIME_BINS = 81;                 // dead time 0–79 ticks, last is overflow
const BOUND_BIN_M = 0.5;
const BOUND_BINS = 21;                 // bound 0–10 m, last is overflow
const CAL_BIN_M = 0.5;
const CAL_BINS = 13;                   // (measured − predicted) signed, DX-C2's own
const BG_BIN_M = 1;
const BG_BINS = 21;                    // (bound − gap) signed, centre holds 0
const VT_BIN_MS = 1;
const VT_BINS = 21;                    // velocity toward E, signed m/s
const ALONG_BIN_M = 1;
const ALONG_BINS = 21;                 // signed along-line offset at arrival
const LAT_BIN_M = 0.5;
const LAT_BINS = 21;                   // lateral offset at arrival, last is overflow
const COLLECT_BIN_M = 1;
const COLLECT_BINS = 21;               // signed collection distance from E
const FLIGHT_RETIRE_TICKS = 720;       // R9's own retire cap, inherited (BK-C1 §3 / DX-C2 §8)
const PC_HOLD_BINS = 41;               // APPLIED held ticks 0–39, last is overflow

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii)) */
/* ========================================================================== */
const DELIV = ['toFeet', 'carried'] as const;
type Deliv = (typeof DELIV)[number];
const DI = (d: Deliv): number => DELIV.indexOf(d);
const MEET = ['meetable', 'unmeetable'] as const;
const MI = (m: boolean): number => (m ? 0 : 1);
/** the WINDOW groups: the whole released population, the carried class, the MEETABLE carried */
const WGROUPS = ['all', 'carried', 'meetableCarried'] as const;
const NWG = WGROUPS.length;
/** the ARRIVAL-ANATOMY groups (#366 item 3(c): meetable carried PRIMARY, carried BESIDE) */
const AGROUPS = ['carried', 'meetableCarried'] as const;
const NAG = AGROUPS.length;
/** the GAP groups — DX-C2 §P.D's face re-measured on THIS composition */
const GGROUPS = ['carried', 'meetableCarried'] as const;
const NGG = GGROUPS.length;
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.intercepted', outcomeOf(false, true, true), 'intercepted');
fx('outcomeOf.out', outcomeOf(false, false, true), 'out');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');

interface Row {
  worldOk: boolean; armedVersion: number; genomeClean: boolean;
  ticks: number; matches: number; wallMs: number;
  /* the population (engine receipts, never football findings) */
  windupsArmed: number; windupsReleased: number;
  windupsCancelledEarly: number; windupsCancelledAtResolve: number;
  windupsStrandedTicks: number;
  byDeliv: number[];                 // [DELIV] released wind-up flights
  byDelivMeet: number[][];           // [DELIV][MEET]
  /* (a) THE CUE — read at the LAST PRE-RELEASE tick unless named otherwise */
  cueN: number; cueKSum: number; cueHitLast: number; cueHitArm: number; cueHitMid: number;
  cueNKx: number; cueKSumKx: number; cueHitLastKx: number;
  decHits: number[]; decN: number[];             // [10] normalized-window-position deciles
  lockBins: number[]; lockN: number; lockSum: number; neverLocks: number;
  thetaArmBins: number[]; thetaLastBins: number[];
  ambBins: number[];
  turnDec: number; turnCmp: number; turnDecRival: number; turnCmpRival: number;
  cueUnusableFlights: number;
  /* (b) THE WINDOW, per WGROUP */
  wSum: number[]; wN: number[]; wBins: number[][];
  sdSum: number[]; sdN: number[]; sdBins: number[][]; sdCensored: number[];
  pcHoldSum: number[]; pcHoldN: number[]; pcHoldBins: number[][];
  dtSum: number[]; dtN: number[]; dtBins: number[][];
  boundSum: number[]; boundN: number[]; boundBins: number[][];
  /* (b) THE GAP, per GGROUP — DX-C2 §P.D's face on THIS composition */
  gapPredSum: number[]; gapMeasSum: number[]; gapN: number[]; gapDiffBins: number[][];
  bgSum: number[]; bgN: number[]; bgBins: number[][]; coverN: number[];
  /* (c) THE ARRIVAL ANATOMY, per AGROUP */
  agN: number[];
  actArm: number[][]; actLast: number[][];
  vtArmSum: number[]; vtArmN: number[]; vtArmBins: number[][];
  vtLastSum: number[]; vtLastN: number[]; vtLastBins: number[][];
  alongSum: number[]; alongN: number[]; alongBins: number[][];
  latSum: number[]; latN: number[]; latBins: number[][];
  outc: number[][];
  collectSum: number[]; collectN: number[]; collectBins: number[][];
  /* context (the 240 s match clock) */
  goals: number; passes: number; passesCompleted: number; interceptions: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, genomeClean: false,
  ticks: 0, matches: 1, wallMs: 0,
  windupsArmed: 0, windupsReleased: 0,
  windupsCancelledEarly: 0, windupsCancelledAtResolve: 0, windupsStrandedTicks: 0,
  byDeliv: zeros(DELIV.length), byDelivMeet: zeros2(DELIV.length, MEET.length),
  cueN: 0, cueKSum: 0, cueHitLast: 0, cueHitArm: 0, cueHitMid: 0,
  cueNKx: 0, cueKSumKx: 0, cueHitLastKx: 0,
  decHits: zeros(10), decN: zeros(10),
  lockBins: zeros(LOCK_BINS), lockN: 0, lockSum: 0, neverLocks: 0,
  thetaArmBins: zeros(THETA_BINS), thetaLastBins: zeros(THETA_BINS),
  ambBins: zeros(AMB_BINS),
  turnDec: 0, turnCmp: 0, turnDecRival: 0, turnCmpRival: 0,
  cueUnusableFlights: 0,
  wSum: zeros(NWG), wN: zeros(NWG), wBins: zeros2(NWG, W_BINS),
  sdSum: zeros(NWG), sdN: zeros(NWG), sdBins: zeros2(NWG, SD_BINS), sdCensored: zeros(NWG),
  pcHoldSum: zeros(NWG), pcHoldN: zeros(NWG), pcHoldBins: zeros2(NWG, PC_HOLD_BINS),
  dtSum: zeros(NWG), dtN: zeros(NWG), dtBins: zeros2(NWG, DTIME_BINS),
  boundSum: zeros(NWG), boundN: zeros(NWG), boundBins: zeros2(NWG, BOUND_BINS),
  gapPredSum: zeros(NGG), gapMeasSum: zeros(NGG), gapN: zeros(NGG),
  gapDiffBins: zeros2(NGG, CAL_BINS),
  bgSum: zeros(NGG), bgN: zeros(NGG), bgBins: zeros2(NGG, BG_BINS), coverN: zeros(NGG),
  agN: zeros(NAG),
  actArm: zeros2(NAG, NACT), actLast: zeros2(NAG, NACT),
  vtArmSum: zeros(NAG), vtArmN: zeros(NAG), vtArmBins: zeros2(NAG, VT_BINS),
  vtLastSum: zeros(NAG), vtLastN: zeros(NAG), vtLastBins: zeros2(NAG, VT_BINS),
  alongSum: zeros(NAG), alongN: zeros(NAG), alongBins: zeros2(NAG, ALONG_BINS),
  latSum: zeros(NAG), latN: zeros(NAG), latBins: zeros2(NAG, LAT_BINS),
  outc: zeros2(NAG, OUTCOMES.length),
  collectSum: zeros(NAG), collectN: zeros(NAG), collectBins: zeros2(NAG, COLLECT_BINS),
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0,
});

/* ========================================================================== */
/* §10 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER     */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface TickCue {
  tick: number; gids: number[]; gk: boolean[]; theta: number[];
  /* the TARGET's own state at THIS tick — (c)'s "at the last pre-release tick" read */
  actAtTick: string; vtAtTick: number;
}
interface Windup {
  key: string; t0: number; gid: number; targetGid: number; readyTick: number;
  eX: number; eY: number; hasLead: boolean;
  dMate: number; margin: number; meetable: boolean; predictedArrDist: number;
  mateTopSpeedArm: number;
  actArm: string; vtArm: number;
  cues: TickCue[];
  strandedTicks: number;
}
interface Flight {
  gid: number; targetGid: number; releaseTick: number;
  eX: number; eY: number; hasLead: boolean; meetable: boolean;
  predictedArrDist: number; mateTopSpeedArm: number;
  lockTick: number | null; hasCue: boolean;
  launchX: number; launchY: number; L: number; ux: number; uy: number;
  wTicks: number; actArm: string; vtArm: number; actLast: string; vtLast: number;
  live: boolean;
  reachedPoint: boolean; arrDist: number; alongOffset: number; lateral: number;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  startDelayTicks: number | null; pcHoldTicks: number | null;
  collectAlong: number | null;
}

const walkMatch = (m: Match, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  row.armedVersion = raArmedVersion(m);
  row.worldOk = row.armedVersion === RA_WORLD_VERSION;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const f = m.teams[s].info.genome as TacticalGenome & { raAccessWeight?: number };
    return f.raAccessWeight === undefined && f.passLeadSupport === undefined
      && f.dvExposureWeight === undefined;
  });
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: V2; targetGid: number; aimLead: V2 | null;
    } | null;
    pcLatency: { holds: Map<number, { untilTick: number; ticks: number; armedTick: number;
      klass: string }> } | null;
  };
  const players = m.allPlayers;

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let wu: Windup | null = null;
  let flight: Flight | null = null;

  /* ---------- BOOKING: the wind-up's own faces (a) ---------- */
  const bookWindupCue = (w: Windup): { lockTick: number | null; hasCue: boolean;
    actLast: string; vtLast: number } => {
    const L = w.cues.length;
    if (L === 0) return { lockTick: null, hasCue: false, actLast: '', vtLast: Number.NaN };
    const last = w.cues[L - 1];
    const tIdxLast = last.gids.indexOf(w.targetGid);
    const vtLast = last.vtAtTick;
    const actLast = last.actAtTick;
    if (tIdxLast < 0 || !Number.isFinite(last.theta[tIdxLast]) || last.gids.length < 2) {
      row.cueUnusableFlights += 1;
      return { lockTick: null, hasCue: false, actLast, vtLast };
    }
    const hitAt = (j: number): boolean => {
      const c = w.cues[j];
      const a = argminFinite(c.theta);
      return a >= 0 && c.gids[a] === w.targetGid;
    };
    /* the PRIMARY population: all five same-side off-ball mates, the keeper INCLUDED */
    row.cueN += 1;
    row.cueKSum += last.gids.length;
    const hitLast = hitAt(L - 1);
    if (hitLast) row.cueHitLast += 1;
    if (hitAt(0)) row.cueHitArm += 1;
    if (hitAt(Math.floor((L - 1) / 2))) row.cueHitMid += 1;
    /* the SHARPENING CURVE across normalized window position (deciles, bins stored) */
    for (let j = 0; j < L; j++) {
      const u = L === 1 ? 0 : j / (L - 1);
      const b = Math.min(9, Math.floor(u * 10));
      row.decN[b] += 1;
      if (hitAt(j)) row.decHits[b] += 1;
    }
    /* THE LOCK TICK: the first tick from which the target is rank-1 through the last tick */
    let lockTick: number | null = null;
    if (hitLast) {
      let j = L - 1;
      while (j - 1 >= 0 && hitAt(j - 1)) j -= 1;
      lockTick = w.cues[j].tick;
      const tbr = w.readyTick - lockTick;
      row.lockN += 1;
      row.lockSum += tbr;
      row.lockBins[binOf(tbr, LOCK_BIN_TICKS, LOCK_BINS)] += 1;
    } else row.neverLocks += 1;
    /* the TARGET's own θ at t0 and at the last tick (5° bins to 180°) */
    const first = w.cues[0];
    const tIdx0 = first.gids.indexOf(w.targetGid);
    if (tIdx0 >= 0 && Number.isFinite(first.theta[tIdx0])) {
      row.thetaArmBins[binOf(first.theta[tIdx0] * 180 / Math.PI, THETA_BIN_DEG, THETA_BINS)] += 1;
    }
    row.thetaLastBins[
      binOf(last.theta[tIdxLast] * 180 / Math.PI, THETA_BIN_DEG, THETA_BINS)] += 1;
    /* AMBIGUITY at the last tick (0 = unambiguous) */
    const amb = ambiguityOf(last.theta, tIdxLast);
    if (amb >= 0) row.ambBins[Math.min(AMB_BINS - 1, amb)] += 1;
    /* THE TURN CUE: is θ_target DECREASING? — against the BEST NON-TARGET mate at the last
       tick (the frozen rival: the smallest θ among non-targets at the last pre-release tick) */
    let rivalGid = -1;
    let rivalV = Number.POSITIVE_INFINITY;
    for (let i = 0; i < last.gids.length; i++) {
      if (last.gids[i] === w.targetGid) continue;
      const v = last.theta[i];
      if (Number.isFinite(v) && v < rivalV) { rivalV = v; rivalGid = last.gids[i]; }
    }
    const thetaOf = (c: TickCue, gid: number): number => {
      const i = c.gids.indexOf(gid);
      return i < 0 ? Number.NaN : c.theta[i];
    };
    for (let j = 0; j + 1 < L; j++) {
      const a = thetaOf(w.cues[j], w.targetGid);
      const b = thetaOf(w.cues[j + 1], w.targetGid);
      if (Number.isFinite(a) && Number.isFinite(b)) {
        row.turnCmp += 1;
        if (b < a) row.turnDec += 1;
      }
      if (rivalGid >= 0) {
        const ra = thetaOf(w.cues[j], rivalGid);
        const rb = thetaOf(w.cues[j + 1], rivalGid);
        if (Number.isFinite(ra) && Number.isFinite(rb)) {
          row.turnCmpRival += 1;
          if (rb < ra) row.turnDecRival += 1;
        }
      }
    }
    /* THE KEEPER-EXCLUDED VARIANT, published BESIDE the primary */
    const kxIdx: number[] = [];
    for (let i = 0; i < last.gids.length; i++) if (!last.gk[i]) kxIdx.push(i);
    const targetIsGk = last.gk[tIdxLast];
    if (!targetIsGk && kxIdx.length >= 2) {
      row.cueNKx += 1;
      row.cueKSumKx += kxIdx.length;
      const sub = kxIdx.map((i) => last.theta[i]);
      const a = argminFinite(sub);
      if (a >= 0 && last.gids[kxIdx[a]] === w.targetGid) row.cueHitLastKx += 1;
    }
    return { lockTick, hasCue: true, actLast, vtLast };
  };

  /* ---------- BOOKING: the released flight's faces (b) + (c) ---------- */
  const bookFlight = (f: Flight): void => {
    const wg: number[] = [0];
    const ag: number[] = [];
    if (f.hasLead) {
      wg.push(1); ag.push(0);
      if (f.meetable) { wg.push(2); ag.push(1); }
    }
    for (const gi of wg) {
      row.wSum[gi] += f.wTicks;
      row.wN[gi] += 1;
      row.wBins[gi][binOf(f.wTicks, W_BIN_TICKS, W_BINS)] += 1;
      if (f.startDelayTicks === null) row.sdCensored[gi] += 1;
      else {
        row.sdSum[gi] += f.startDelayTicks;
        row.sdN[gi] += 1;
        row.sdBins[gi][binOf(f.startDelayTicks, SD_BIN_TICKS, SD_BINS)] += 1;
      }
      if (f.pcHoldTicks !== null) {
        row.pcHoldSum[gi] += f.pcHoldTicks;
        row.pcHoldN[gi] += 1;
        row.pcHoldBins[gi][binOf(f.pcHoldTicks, 1, PC_HOLD_BINS)] += 1;
      }
      if (f.startDelayTicks !== null) {
        const dtT = deadTimeTicksOf(f.releaseTick, f.lockTick, f.startDelayTicks);
        row.dtSum[gi] += dtT;
        row.dtN[gi] += 1;
        row.dtBins[gi][binOf(dtT, DT_BIN_TICKS, DTIME_BINS)] += 1;
        const bound = boundMetresOf(f.mateTopSpeedArm, dtT);
        row.boundSum[gi] += bound;
        row.boundN[gi] += 1;
        row.boundBins[gi][binOf(bound, BOUND_BIN_M, BOUND_BINS)] += 1;
      }
    }
    for (const gi of ag) {
      row.agN[gi] += 1;
      row.actArm[gi][AI(f.actArm)] += 1;
      row.actLast[gi][AI(f.actLast)] += 1;
      if (Number.isFinite(f.vtArm)) {
        row.vtArmSum[gi] += f.vtArm; row.vtArmN[gi] += 1;
        row.vtArmBins[gi][signedBinOf(f.vtArm, VT_BIN_MS, VT_BINS)] += 1;
      }
      if (Number.isFinite(f.vtLast)) {
        row.vtLastSum[gi] += f.vtLast; row.vtLastN[gi] += 1;
        row.vtLastBins[gi][signedBinOf(f.vtLast, VT_BIN_MS, VT_BINS)] += 1;
      }
      const outcome = outcomeOf(f.completedHere, f.interceptedHere, f.wentDead);
      row.outc[gi][OI(outcome)] += 1;
      if (f.reachedPoint && Number.isFinite(f.arrDist)) {
        row.alongSum[gi] += f.alongOffset; row.alongN[gi] += 1;
        row.alongBins[gi][signedBinOf(f.alongOffset, ALONG_BIN_M, ALONG_BINS)] += 1;
        row.latSum[gi] += f.lateral; row.latN[gi] += 1;
        row.latBins[gi][binOf(f.lateral, LAT_BIN_M, LAT_BINS)] += 1;
        /* the GAP, DX-C2 §P.D's face RE-MEASURED on this composition */
        row.gapPredSum[gi] += f.predictedArrDist;
        row.gapMeasSum[gi] += f.arrDist;
        row.gapN[gi] += 1;
        row.gapDiffBins[gi][
          signedBinOf(f.arrDist - f.predictedArrDist, CAL_BIN_M, CAL_BINS)] += 1;
        /* per flight: (bound − gap) and the SHARE with bound ≥ gap */
        if (f.startDelayTicks !== null) {
          const dtT = deadTimeTicksOf(f.releaseTick, f.lockTick, f.startDelayTicks);
          const bound = boundMetresOf(f.mateTopSpeedArm, dtT);
          const bg = bound - f.arrDist;
          row.bgSum[gi] += bg; row.bgN[gi] += 1;
          row.bgBins[gi][signedBinOf(bg, BG_BIN_M, BG_BINS)] += 1;
          if (bound >= f.arrDist) row.coverN[gi] += 1;
        }
      }
      if (f.collectAlong !== null) {
        row.collectSum[gi] += f.collectAlong; row.collectN[gi] += 1;
        row.collectBins[gi][signedBinOf(f.collectAlong, COLLECT_BIN_M, COLLECT_BINS)] += 1;
      }
    }
    const di = DI(f.hasLead ? 'carried' : 'toFeet');
    row.byDeliv[di] += 1;
    row.byDelivMeet[di][MI(f.meetable)] += 1;
  };
  const retireFlight = (): void => { if (flight !== null) { bookFlight(flight); flight = null; } };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    const ball = m.ball;
    const ballIsLive = m.phase === 'playing' || m.phase === 'restart';

    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a = m.teams[0].stats[k] as number;
      const b = m.teams[1].stats[k] as number;
      d[k] = [a - prevStats[k][0], b - prevStats[k][1]];
      prevStats[k] = [a, b];
    }
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    const passChangedHere = passT !== null && passT !== prevPendingPassT;
    prevPendingPassT = passT;

    /* ---------- THE WIND-UP RECORD: arm · observe · end ---------- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    if (wu !== null && key !== wu.key) {
      /* the tracked wind-up ENDED this tick */
      const released = passChangedHere && pp !== null && pp.passerGid === wu.gid
        && pp.targetGid === wu.targetGid && tick >= wu.readyTick;
      const cue = bookWindupCue(wu);
      if (released) {
        row.windupsReleased += 1;
        retireFlight();
        const ox = ball.pos.x - ball.vel.x * DT;
        const oy = ball.pos.y - ball.vel.y * DT;
        const ux0 = wu.eX - ox;
        const uy0 = wu.eY - oy;
        const L = Math.sqrt(ux0 * ux0 + uy0 * uy0);
        flight = {
          gid: wu.gid, targetGid: wu.targetGid, releaseTick: tick,
          eX: wu.eX, eY: wu.eY, hasLead: wu.hasLead, meetable: wu.meetable,
          predictedArrDist: wu.predictedArrDist, mateTopSpeedArm: wu.mateTopSpeedArm,
          lockTick: cue.lockTick, hasCue: cue.hasCue,
          launchX: ox, launchY: oy, L, ux: L > 1e-6 ? ux0 / L : 0, uy: L > 1e-6 ? uy0 / L : 0,
          actArm: wu.actArm, vtArm: wu.vtArm, actLast: cue.actLast, vtLast: cue.vtLast,
          wTicks: wu.readyTick - wu.t0,
          live: true,
          reachedPoint: false, arrDist: Number.NaN,
          alongOffset: Number.NaN, lateral: Number.NaN,
          completedHere: false, interceptedHere: false, wentDead: false,
          startDelayTicks: null, pcHoldTicks: null, collectAlong: null,
        };
      } else if (tick >= wu.readyTick) row.windupsCancelledAtResolve += 1;
      else row.windupsCancelledEarly += 1;
      wu = null;
    }
    if (rec !== null && (wu === null || key !== wu.key)) {
      /* A NEW ARM at t0 = this tick — the first tick the record is observable from state */
      row.windupsArmed += 1;
      const passer = players[rec.gid];
      const target = players[rec.targetGid];
      const eX = rec.aim.x + (rec.aimLead?.x ?? 0);
      const eY = rec.aim.y + (rec.aimLead?.y ?? 0);
      /* THE ACCOUNT AT THE ARM INSTANT: the mate's arm position is the RECORD's own `aim`
         (exact); the passer's position and the mate's topSpeed are read at the END of the
         arm tick (declared at §P — there is no wrapper, so mid-tick is not observable). */
      const dMate = Math.sqrt((eX - rec.aim.x) ** 2 + (eY - rec.aim.y) ** 2);
      const dBall = Math.sqrt((eX - passer.pos.x) ** 2 + (eY - passer.pos.y) ** 2);
      const ts = target.topSpeed;
      const margin = marginOf(dBall, dMate, ts);
      const vtArm = (() => {
        const dx = eX - target.pos.x;
        const dy = eY - target.pos.y;
        const dl = Math.sqrt(dx * dx + dy * dy);
        return dl > 1e-6 ? (target.vel.x * dx + target.vel.y * dy) / dl : Number.NaN;
      })();
      wu = {
        key: key as string, t0: tick, gid: rec.gid, targetGid: rec.targetGid,
        readyTick: rec.readyTick, eX, eY, hasLead: rec.aimLead !== null,
        dMate, margin, meetable: meetableOf(dMate, margin),
        predictedArrDist: predictedArrDistOf(dBall, dMate, ts),
        mateTopSpeedArm: ts,
        actArm: target.action.type as string, vtArm,
        cues: [], strandedTicks: 0,
      };
    }
    if (wu !== null) {
      if (tick < wu.readyTick) {
        /* ⭐⭐ THE CUE, at a PRE-RELEASE tick — EXTERNAL FIELDS ONLY */
        const passer = players[wu.gid];
        const gids: number[] = [];
        const gk: boolean[] = [];
        const theta: number[] = [];
        for (const q of players) {
          if (q.side !== passer.side || q.gid === passer.gid || q.sentOff) continue;
          gids.push(q.gid);
          gk.push(q.role === 'GK');
          theta.push(cueAngle(
            passer.pos.x, passer.pos.y, passer.heading.x, passer.heading.y, q.pos.x, q.pos.y,
          ));
        }
        const tgt = players[wu.targetGid];
        const dxE = wu.eX - tgt.pos.x;
        const dyE = wu.eY - tgt.pos.y;
        const dlE = Math.sqrt(dxE * dxE + dyE * dyE);
        wu.cues.push({
          tick, gids, gk, theta,
          actAtTick: tgt.action.type as string,
          vtAtTick: dlE > 1e-6 ? (tgt.vel.x * dxE + tgt.vel.y * dyE) / dlE : Number.NaN,
        });
      } else { wu.strandedTicks += 1; row.windupsStrandedTicks += 1; }
    }

    /* ---------- THE RELEASED FLIGHT: start delay · PC hold · arrival · outcome ---------- */
    if (flight !== null && flight.live) {
      const f = flight;
      const target = players[f.targetGid];
      if (f.startDelayTicks === null && (target.action.type as string) === 'ReceivePass') {
        f.startDelayTicks = tick - f.releaseTick;
      }
      if (f.pcHoldTicks === null && mm.pcLatency !== null) {
        const h = mm.pcLatency.holds.get(f.targetGid);
        if (h !== undefined && h.armedTick === f.releaseTick && h.klass === 'passRelease') {
          f.pcHoldTicks = h.ticks;
        }
      }
      if (!f.reachedPoint && f.L > 1e-6) {
        const proj = (ball.pos.x - f.launchX) * f.ux + (ball.pos.y - f.launchY) * f.uy;
        if (proj >= f.L) {
          f.reachedPoint = true;
          f.arrDist = dist(target.pos, { x: f.eX, y: f.eY });
          const rx = target.pos.x - f.launchX;
          const ry = target.pos.y - f.launchY;
          f.alongOffset = (rx * f.ux + ry * f.uy) - f.L;
          f.lateral = Math.abs(rx * f.uy - ry * f.ux);
        }
      }
      const mySide = players[f.gid].side as Side;
      if (d.passesCompleted[mySide] > 0 && !f.completedHere) {
        f.completedHere = true;
        if (f.L > 1e-6) {
          f.collectAlong = ((ball.pos.x - f.launchX) * f.ux
            + (ball.pos.y - f.launchY) * f.uy) - f.L;
        }
      }
      if (d.interceptions[1 - mySide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.gid) retireFlight();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireFlight();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireFlight();
    }
  }
  if (wu !== null) {
    bookWindupCue(wu);
    row.windupsCancelledEarly += 1;
  }
  retireFlight();
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — NO WRAPPER; the observation reads are BYTE-INERT  */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
banner('RC-C0 — the lockstep receipt (observed vs unobserved; the instrument installs NO wrapper)');
const lockstepRows = LOCKSTEP_SEEDS.map((seed) => {
  const observed = buildMatch(seed);
  walkMatch(observed, true);
  const unobserved = buildMatch(seed);
  walkMatch(unobserved, false);
  return { seed, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
});
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} scratch seeds)`);

/* ========================================================================== */
/* §12 THE BATTERY                                                             */
/* ========================================================================== */
interface Cell { seed: number; row: Row }
const cells: Cell[] = [];
banner(`RC-C0 — the battery: ${N} walks of WORLD 12's own composition, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    cells.push({ seed, row: walkMatch(buildMatch(seed), true) });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} walked `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
/** the world-construction receipt, one walk, its own seed (booked = walked) */
const receiptRow = walkMatch(buildMatch(RECEIPT_SEED), true);
const walksBooked = cells.length + 1;

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

/* ---------------- (a) THE CUE ---------------- */
defFace('cue.pLockLast', 'share',
  '⭐⭐ (a) P(the best-aligned same-side off-ball mate at the LAST pre-release tick IS the '
  + 'true target) — the licence rule\'s own left term',
  'wind-ups with a usable cue read', (r) => r.cueHitLast, (r) => r.cueN);
defFace('cue.pLockArm', 'share', '(a) the same probability at the ARM tick t0',
  'wind-ups with a usable cue read', (r) => r.cueHitArm, (r) => r.cueN);
defFace('cue.pLockMid', 'share', '(a) the same probability at the WINDOW MIDPOINT tick',
  'wind-ups with a usable cue read', (r) => r.cueHitMid, (r) => r.cueN);
defFace('cue.kBarMatesPerFlight', 'mates per flight',
  '(a) k̄ — the mean number of same-side off-ball mates in the cue vector at the last '
  + 'pre-release tick', 'wind-ups with a usable cue read', (r) => r.cueKSum, (r) => r.cueN);
defFace('cue.uniformPrior', 'share',
  '⭐⭐ (a) 1/k̄ — the UNIFORM PRIOR, computed as Σn / Σk so it re-derives from the same cells',
  'Σ mates over the population', (r) => r.cueN, (r) => r.cueKSum);
defFace('cue.pLockLast.keeperExcluded', 'share',
  '(a) pLockLast with the KEEPER EXCLUDED from the mate population (published BESIDE the '
  + 'primary; flights whose target IS the keeper are excluded)',
  'wind-ups with a usable keeper-excluded cue read', (r) => r.cueHitLastKx, (r) => r.cueNKx);
defFace('cue.kBarMatesPerFlight.keeperExcluded', 'mates per flight',
  '(a) k̄ with the keeper excluded', 'wind-ups with a usable keeper-excluded cue read',
  (r) => r.cueKSumKx, (r) => r.cueNKx);
defFace('cue.uniformPrior.keeperExcluded', 'share', '(a) 1/k̄ with the keeper excluded',
  'Σ keeper-excluded mates over the population', (r) => r.cueNKx, (r) => r.cueKSumKx);
for (let i = 0; i < 10; i++) {
  defFace(`cue.sharpening.decile${i}`, 'share',
    `(a) P(rank-1 == target) at normalized window-position decile ${i} (bins stored)`,
    'observed (flight, tick) pairs in that decile',
    (r) => r.decHits[i], (r) => r.decN[i]);
}
defFace('cue.lockTicksBeforeReleaseMean', 'ticks',
  '(a) THE LOCK TICK, as ticks-before-release: the first tick from which the target stays '
  + 'rank-1 through the last pre-release tick (bins stored)',
  'wind-ups that LOCK', (r) => r.lockSum, (r) => r.lockN);
defFace('cue.lockSimSecondsBeforeReleaseMean', 'sim-seconds',
  '(a) the same lock lead, on the SIM clock (1 sim-s = 60 ticks = 22.5 display-s)',
  'wind-ups that LOCK', (r) => r.lockSum * DT, (r) => r.lockN);
defFace('cue.neverLocksShare', 'share',
  '⭐ (a) THE NEVER-LOCKS BUCKET: the target is NOT rank-1 at the last pre-release tick',
  'wind-ups with a usable cue read', (r) => r.neverLocks, (r) => r.cueN);
defFace('cue.turnTowardTargetShare', 'share',
  '⭐ (a) THE TURN CUE: the share of window tick-pairs on which θ_target DECREASES (the '
  + 'passer turning toward the target)', 'observed consecutive tick-pairs',
  (r) => r.turnDec, (r) => r.turnCmp);
defFace('cue.turnTowardRivalShare', 'share',
  '(a) the same share for the BEST NON-TARGET mate at the last pre-release tick (the frozen '
  + 'rival)', 'observed consecutive tick-pairs for the rival',
  (r) => r.turnDecRival, (r) => r.turnCmpRival);
defFace('cue.unusableFlightShare', 'share',
  '(a) wind-ups with NO usable cue read (a degenerate bearing, or fewer than two mates on '
  + 'the pitch, or the target off the pitch) — declared, never folded',
  'all wind-ups observed', (r) => r.cueUnusableFlights, (r) => r.cueN + r.cueUnusableFlights);

/* ---------------- (b) THE WINDOW AND THE BOUND ---------------- */
for (let gi = 0; gi < NWG; gi++) {
  const g = WGROUPS[gi];
  defFace(`window.wMeanTicks.${g}`, 'ticks',
    `(b) W — the wind-up length of the ${g} class (readyTick − t0; bins stored)`,
    `released wind-up flights of the ${g} class`, (r) => r.wSum[gi], (r) => r.wN[gi]);
  defFace(`window.wMeanSimSeconds.${g}`, 'sim-seconds',
    `(b) W of the ${g} class on the SIM clock`,
    `released wind-up flights of the ${g} class`, (r) => r.wSum[gi] * DT, (r) => r.wN[gi]);
  defFace(`window.startDelayMeanTicks.${g}`, 'ticks',
    `(b) the target's MEASURED post-strike START DELAY (ticks from the release tick to his `
    + `first \`ReceivePass\`) — ${g} class; bins stored`,
    `released ${g} flights with an OBSERVED start`, (r) => r.sdSum[gi], (r) => r.sdN[gi]);
  defFace(`window.startDelayMeanSimSeconds.${g}`, 'sim-seconds',
    `(b) the same start delay on the SIM clock — ${g} class`,
    `released ${g} flights with an OBSERVED start`, (r) => r.sdSum[gi] * DT, (r) => r.sdN[gi]);
  defFace(`window.startDelayCensoredShare.${g}`, 'share',
    `⭐ (b) THE CENSORED-START BUCKET of the ${g} class: he never enters \`ReceivePass\` `
    + 'before the flight retires (cut out / lost / re-decided)',
    `released wind-up flights of the ${g} class`,
    (r) => r.sdCensored[gi], (r) => r.sdCensored[gi] + r.sdN[gi]);
  defFace(`window.pcHoldMeanAppliedTicks.${g}`, 'ticks',
    `(b) the target's PC reaction hold for THIS release, in APPLIED ticks (a state read of `
    + `the seat's own hold record; never nominal) — ${g} class; bins stored`,
    `released ${g} flights with an observed passRelease hold`,
    (r) => r.pcHoldSum[gi], (r) => r.pcHoldN[gi]);
  defFace(`window.pcHoldObservedShare.${g}`, 'share',
    `(b) the share of released ${g} flights on which a \`passRelease\` hold armed on the `
    + 'target at the release tick was OBSERVED',
    `released wind-up flights of the ${g} class`, (r) => r.pcHoldN[gi], (r) => r.wN[gi]);
  defFace(`window.deadTimeMeanTicks.${g}`, 'ticks',
    `(b) THE DEAD TIME of the ${g} class = (release tick − lock tick) + start delay; a `
    + 'never-locking wind-up contributes its START DELAY ALONE (stated); bins stored',
    `released ${g} flights with an OBSERVED start`, (r) => r.dtSum[gi], (r) => r.dtN[gi]);
  defFace(`window.deadTimeMeanSimSeconds.${g}`, 'sim-seconds',
    `(b) the same dead time on the SIM clock — ${g} class`,
    `released ${g} flights with an OBSERVED start`, (r) => r.dtSum[gi] * DT, (r) => r.dtN[gi]);
  defFace(`window.boundMeanMetres.${g}`, 'metres',
    `⭐ (b) THE KINEMATIC BOUND of the ${g} class = max(target.topSpeed@t0, 0.1) × dead time `
    + '(the traced account\'s own speed law — no new constant); bins stored',
    `released ${g} flights with an OBSERVED start`, (r) => r.boundSum[gi], (r) => r.boundN[gi]);
}
for (let gi = 0; gi < NGG; gi++) {
  const g = GGROUPS[gi];
  defFace(`gap.predictedMeanMetres.${g}`, 'metres',
    `(b) DX-C2 §P.D's \`predictedArrDist\` — where the account says the receiver stands when `
    + `the ball reaches E — ${g} class`,
    `${g} flights whose ball reached the elected point`,
    (r) => r.gapPredSum[gi], (r) => r.gapN[gi]);
  defFace(`gap.measuredMeanMetres.${g}`, 'metres',
    `(b) the MEASURED arrival distance (receiver→E at the tick the ball's along-line `
    + `projection first reaches E — DX-C1/DX-C2's own read) — ${g} class`,
    `${g} flights whose ball reached the elected point`,
    (r) => r.gapMeasSum[gi], (r) => r.gapN[gi]);
  defFace(`gap.meanDiffMetres.${g}`, 'metres',
    `⭐⭐ (b) THE GAP, RE-MEASURED ON THIS COMPOSITION: measured − predicted, ${g} class. `
    + '⛔ DX-C2\'s published +3.233 m is DESIGN CONTEXT ONLY (a different composition, the RA '
    + 'price SHUT) — never a Δ across batteries. Bins stored.',
    `${g} flights whose ball reached the elected point`,
    (r) => r.gapMeasSum[gi] - r.gapPredSum[gi], (r) => r.gapN[gi]);
  defFace(`bound.minusGapMeanMetres.${g}`, 'metres',
    `⭐ (b) per flight, (bound − gap) — ${g} class; positive ⇒ the wasted window alone `
    + 'covers the distance he was short. Bins stored.',
    `${g} flights with both a bound and a measured gap`, (r) => r.bgSum[gi], (r) => r.bgN[gi]);
  defFace(`bound.coversGapShare.${g}`, 'share',
    `⭐⭐ (b) THE SHARE with bound ≥ gap — ${g} class (the PRE-COMMITTED READ's own quantity: `
    + 'bound ≥ gap ⇒ wind-up reading alone shapes the seat)',
    `${g} flights with both a bound and a measured gap`, (r) => r.coverN[gi], (r) => r.bgN[gi]);
}

/* ---------------- (c) THE ARRIVAL ANATOMY ---------------- */
/** the FROZEN action shortlist — the contract §0 menu plus the idle label. The FULL
 *  ActionType vocabulary is published as STORED BINS beside, so any other label re-derives. */
const ACTION_SHORTLIST = ['ReceivePass', 'ChaseBall', 'SupportBallCarrier', 'MakeRun',
  'MoveToFormationSpot', 'HoldPosition'] as const;
for (let gi = 0; gi < NAG; gi++) {
  const g = AGROUPS[gi];
  for (const a of ACTION_SHORTLIST) {
    const ai = AI(a);
    defFace(`arrival.actionShareAtArm.${g}.${a}`, 'share',
      `(c) share of ${g} flights whose target was running \`${a}\` at the ARM tick t0`,
      `released ${g} flights`, (r) => r.actArm[gi][ai], (r) => r.agN[gi]);
    defFace(`arrival.actionShareAtLast.${g}.${a}`, 'share',
      `(c) share of ${g} flights whose target was running \`${a}\` at the LAST pre-release tick`,
      `released ${g} flights`, (r) => r.actLast[gi][ai], (r) => r.agN[gi]);
  }
  defFace(`arrival.velTowardEMeanMsAtArm.${g}`, 'metres per sim-second',
    `⭐ (c) the target's velocity component TOWARD the elected point at t0 (signed; positive `
    + `= coming) — ${g} class; bins stored`,
    `released ${g} flights with a defined bearing`, (r) => r.vtArmSum[gi], (r) => r.vtArmN[gi]);
  defFace(`arrival.velTowardEMeanMsAtLast.${g}`, 'metres per sim-second',
    `⭐ (c) the same component at the LAST pre-release tick — ${g} class; bins stored`,
    `released ${g} flights with a defined bearing`,
    (r) => r.vtLastSum[gi], (r) => r.vtLastN[gi]);
  defFace(`arrival.alongLineOffsetMeanMetres.${g}`, 'metres',
    `⭐⭐ (c) at the ball's arrival at E: the target's SIGNED along-line offset (negative = `
    + `UPSTREAM of E, positive = BEYOND it) — ${g} class; bins stored`,
    `${g} flights whose ball reached the elected point`,
    (r) => r.alongSum[gi], (r) => r.alongN[gi]);
  defFace(`arrival.lateralOffsetMeanMetres.${g}`, 'metres',
    `(c) at the ball's arrival at E: the target's LATERAL offset from the launch→E line — `
    + `${g} class; bins stored`, `${g} flights whose ball reached the elected point`,
    (r) => r.latSum[gi], (r) => r.latN[gi]);
  defFace(`arrival.reachedPointShare.${g}`, 'share',
    `(c) the share of ${g} flights whose ball reached the elected point at all`,
    `released ${g} flights`, (r) => r.alongN[gi], (r) => r.agN[gi]);
  for (const o of OUTCOMES) {
    defFace(`arrival.outcome.${g}.${o}`, 'share',
      `(c) the ${o} share of ${g} flights (DX-C2's own four-way partition, reused; the ladder `
      + 'is TEMPORAL, not causal)', `released ${g} flights`,
      (r) => r.outc[gi][OI(o)], (r) => r.agN[gi]);
  }
  defFace(`arrival.collectionAlongLineMeanMetres.${g}`, 'metres',
    `(c) for COMPLETED ${g} flights: the collection point's SIGNED along-line distance from `
    + 'E (positive = beyond E); bins stored', `completed ${g} flights`,
    (r) => r.collectSum[gi], (r) => r.collectN[gi]);
}

/* ---------------- §R4 CONTEXT ---------------- */
defFace('context.goalsPerMatch', 'goals per match (240 s match clock)', 'context — goals',
  'matches walked', (r) => r.goals, (r) => r.matches);
defFace('context.groundPassesPerMatch', 'passes per match (240 s match clock)',
  'context — the engine\'s own pass count', 'matches walked', (r) => r.passes, (r) => r.matches);
defFace('context.passCompletion', 'share',
  'context — the engine\'s own whole-match pass completion (⚠ ALL deliveries)',
  'passes', (r) => r.passesCompleted, (r) => r.passes);
defFace('context.windupFlightsPerMatch', 'flights per match (240 s match clock)',
  'context — RELEASED wind-up flights', 'matches walked',
  (r) => r.windupsReleased, (r) => r.matches);
defFace('context.windupsArmedPerMatch', 'arms per match (240 s match clock)',
  'context — wind-ups ARMED (the (a) population, cancellations included)', 'matches walked',
  (r) => r.windupsArmed, (r) => r.matches);
defFace('context.carriedShareOfWindupFlights', 'share',
  '⭐ context — the CARRIED (led) share of released wind-up flights (aimLead non-null)',
  'released wind-up flights', (r) => r.byDeliv[DI('carried')], (r) => r.windupsReleased);
defFace('context.meetableShareOfCarried', 'share',
  '⭐ context — the MEETABLE share of carried elections at the ARM instant (the frozen '
  + 'account; DX-C2 §P.A byte for byte in substance)', 'carried wind-up flights',
  (r) => r.byDelivMeet[DI('carried')][0], (r) => r.byDeliv[DI('carried')]);
defFace('context.cancelledEarlyShare', 'share',
  'context — wind-ups whose record ended BEFORE readyTick (a shot arm, an eviction, a lost '
  + 'ball)', 'wind-ups armed', (r) => r.windupsCancelledEarly, (r) => r.windupsArmed);
defFace('context.cancelledAtResolveShare', 'share',
  'context — wind-ups that reached readyTick and did NOT strike (the resolve\'s own '
  + 'interruption guards)', 'wind-ups armed',
  (r) => r.windupsCancelledAtResolve, (r) => r.windupsArmed);
defFace('context.strandedTicksPerMatch', 'ticks per match (240 s match clock)',
  'context — ticks on which a record sat live at or past readyTick (a dead-ball phase gate '
  + 'defers the head-of-tick resolve); EXCLUDED from every cue face', 'matches walked',
  (r) => r.windupsStrandedTicks, (r) => r.matches);

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = cells.map((c) => f.num(c.row));
  const de = cells.map((c) => f.dn(c.row));
  const point = ratio(sum(nu), sum(de));
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n = 0; let dd = 0;
    for (const i of idx) { n += nu[i]; dd += de[i]; }
    const v = ratio(n, dd);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  return {
    face: key, unit: f.unit, what: f.what, denNote: f.den,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`RC-C0 FATAL — unknown face ${k}`); process.exit(3); }
  return f!;
};
interface DeltaRow {
  key: string; left: string; right: string;
  leftValue: number; rightValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean;
}
const contrast = (key: string, left: string, right: string): DeltaRow => {
  const fl = FACES[left];
  const fr = FACES[right];
  const nl = cells.map((c) => fl.num(c.row));
  const dl = cells.map((c) => fl.dn(c.row));
  const nr = cells.map((c) => fr.num(c.row));
  const dr = cells.map((c) => fr.dn(c.row));
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
    key, left, right, leftValue: pl, rightValue: pr, delta: pl - pr,
    ciLo: lo, ciHi: hi, halfWidth: hw,
    absDeltaOverHalfWidth: ratio(Math.abs(pl - pr), hw),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
  };
};
const CONTRASTS: [string, string, string][] = [
  ['lockVsPrior', 'cue.pLockLast', 'cue.uniformPrior'],
  ['lockVsPriorKeeperExcluded', 'cue.pLockLast.keeperExcluded',
    'cue.uniformPrior.keeperExcluded'],
  ['sharpeningLastVsArm', 'cue.pLockLast', 'cue.pLockArm'],
  ['turnTowardTargetVsRival', 'cue.turnTowardTargetShare', 'cue.turnTowardRivalShare'],
  ['gapMeasuredVsPredicted.meetableCarried', 'gap.measuredMeanMetres.meetableCarried',
    'gap.predictedMeanMetres.meetableCarried'],
];
const deltas = CONTRASTS.map(([k, l, r]) => contrast(k, l, r));
const delta = (k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k);
  if (d === undefined) { banner(`RC-C0 FATAL — unknown contrast ${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 THE PRE-COMMITTED LICENCE RULE (§P.C) — FROZEN IN EXACT FORM             */
/* ========================================================================== */
/**
 * ⭐⭐ THE RULE, FROZEN AT §P.C BEFORE ANY BATTERY SEED, carrying #366 item 3's ONE
 * PRE-COMMITMENT, in exact form:
 *
 *   LICENSED ⇔ the 95 % cluster-bootstrap CI of Δ = pLockLast − 1/k̄ lies ENTIRELY ABOVE
 *              ZERO (i.e. `ciLo > 0`).
 *   BLOCKED  ⇔ otherwise (the CI contains zero, or lies entirely below it).
 *
 * The verdict WORD is printed FROM the rule. This census adjudicates nothing else — the
 * commander rules. (#366 item 3 states what each verdict means downstream; the executor
 * does not act on it.)
 */
const lic = delta('lockVsPrior');
const LICENCE: 'LICENSED' | 'BLOCKED' = lic.ciLo > 0 ? 'LICENSED' : 'BLOCKED';
const LICENCE_READING = LICENCE === 'LICENSED'
  ? 'THE OUTWARD CUE IDENTIFIES THE TARGET BEFORE THE RELEASE resolvedly better than the '
    + 'uniform prior — the reading half has an honest percept. Per #366 item 3 the commander '
    + 'rules on what follows; this census adjudicates nothing else.'
  : 'THE OUTWARD CUE DOES NOT IDENTIFY THE TARGET resolvedly better than the uniform prior '
    + 'at this power. Per #366 item 3\'s pre-commitment the seat is BLOCKED and the arc '
    + 'returns to the user with the OFFER channel named.';
/** ⭐ THE PRE-COMMITTED READ (no gate, #366 item 3): bound ≥ gap ⇒ wind-up reading alone
 *  shapes the seat; bound < gap ⇒ the seat is wind-up reading PLUS a named earlier-cue door. */
const coverShare = face('bound.coversGapShare.meetableCarried');
const bgMean = face('bound.minusGapMeanMetres.meetableCarried');
const PRECOMMITTED_READ = bgMean.ciLo > 0
  ? 'BOUND ≥ GAP on the mean (the interval lies entirely above zero) — wind-up reading ALONE '
    + 'is the seat\'s shape, on this composition\'s own numbers.'
  : bgMean.ciHi < 0
    ? 'BOUND < GAP on the mean (the interval lies entirely below zero) — the seat is wind-up '
      + 'reading PLUS a named earlier-cue door (the look · the offer channel), NEVER a truth '
      + 'read.'
    : 'THE MEAN (bound − gap) INTERVAL CONTAINS ZERO at this power — the read is UNRESOLVED '
      + 'and no shape conclusion may be cut on it; the per-flight coverage share is published '
      + 'beside as the quantity of record.';

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — DX-C2 §15's house form, from THIS census's own smoke */
/* ========================================================================== */
/**
 * ⭐ THE HOUSE FORM (DX-C2 §15's own, byte for byte in substance):
 *   1  se(n)      = half-width(n) / z.975
 *   2  se(needed) = |target| / (z.975 + z.80)
 *   3  N          = ceil( n · (se(n) / se(needed))² )
 *   4  MDE(N)     = half-width(n) · sqrt(n/N) · (z.975 + z.80) / z.975
 * ⚠ IT ASSUMES the battery's per-seed cluster variance is the smoke's — 12 scratch clusters
 * is a NOISY variance estimate. Said here, BEFORE the battery. The smoke is DISCLOSED IN
 * FULL at the doc's §DEV-PREFLIGHT. Target 0.05 on BOTH pre-registered quantities: the
 * licence Δ (§P.C) and the (b) coverage share (bound ≥ gap).
 */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised half-widths (seeds 900,001,800–811; §DEV-PREFLIGHT),
 *  read out of the smoke artifact's own `deltas[].halfWidth` / `faces[].halfWidth` fields —
 *  never re-typed from the console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'delta.lockVsPrior', group: '(a) §P.C — THE LICENCE',
    hwSmoke: 0.04918027907599562, target: 0.05 },
  { face: 'bound.coversGapShare.meetableCarried', group: '(b) — THE COVERAGE SHARE',
    hwSmoke: 0.42857142857142855, target: 0.05 },
  { face: 'bound.coversGapShare.carried', group: '(b) — the carried class, disclosed beside',
    hwSmoke: 0.19196428571428573, target: 0.05 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN,
    blockAffords: 999,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);

/* ========================================================================== */
/* §16 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const pooled = {
  decHits: zeros(10), decN: zeros(10),
  lockBins: zeros(LOCK_BINS), thetaArmBins: zeros(THETA_BINS),
  thetaLastBins: zeros(THETA_BINS), ambBins: zeros(AMB_BINS),
  wBins: zeros2(NWG, W_BINS), sdBins: zeros2(NWG, SD_BINS),
  pcHoldBins: zeros2(NWG, PC_HOLD_BINS), dtBins: zeros2(NWG, DTIME_BINS),
  boundBins: zeros2(NWG, BOUND_BINS),
  gapDiffBins: zeros2(NGG, CAL_BINS), bgBins: zeros2(NGG, BG_BINS),
  actArm: zeros2(NAG, NACT), actLast: zeros2(NAG, NACT),
  vtArmBins: zeros2(NAG, VT_BINS), vtLastBins: zeros2(NAG, VT_BINS),
  alongBins: zeros2(NAG, ALONG_BINS), latBins: zeros2(NAG, LAT_BINS),
  collectBins: zeros2(NAG, COLLECT_BINS),
};
for (const c of cells) {
  addInto(pooled.decHits, c.row.decHits); addInto(pooled.decN, c.row.decN);
  addInto(pooled.lockBins, c.row.lockBins);
  addInto(pooled.thetaArmBins, c.row.thetaArmBins);
  addInto(pooled.thetaLastBins, c.row.thetaLastBins);
  addInto(pooled.ambBins, c.row.ambBins);
  addInto2(pooled.wBins, c.row.wBins); addInto2(pooled.sdBins, c.row.sdBins);
  addInto2(pooled.pcHoldBins, c.row.pcHoldBins); addInto2(pooled.dtBins, c.row.dtBins);
  addInto2(pooled.boundBins, c.row.boundBins);
  addInto2(pooled.gapDiffBins, c.row.gapDiffBins); addInto2(pooled.bgBins, c.row.bgBins);
  addInto2(pooled.actArm, c.row.actArm); addInto2(pooled.actLast, c.row.actLast);
  addInto2(pooled.vtArmBins, c.row.vtArmBins); addInto2(pooled.vtLastBins, c.row.vtLastBins);
  addInto2(pooled.alongBins, c.row.alongBins); addInto2(pooled.latBins, c.row.latBins);
  addInto2(pooled.collectBins, c.row.collectBins);
}
/** ⭐ the MEDIANS — bin-derived, so `gFaces` re-derives every one of them off disk */
const medians = {
  wSimSeconds: {
    all: binMedian(pooled.wBins[0], W_BIN_TICKS, false) * DT,
    carried: binMedian(pooled.wBins[1], W_BIN_TICKS, false) * DT,
    meetableCarried: binMedian(pooled.wBins[2], W_BIN_TICKS, false) * DT,
  },
  startDelaySimSeconds: {
    all: binMedian(pooled.sdBins[0], SD_BIN_TICKS, false) * DT,
    carried: binMedian(pooled.sdBins[1], SD_BIN_TICKS, false) * DT,
    meetableCarried: binMedian(pooled.sdBins[2], SD_BIN_TICKS, false) * DT,
  },
  deadTimeSimSeconds: {
    all: binMedian(pooled.dtBins[0], DT_BIN_TICKS, false) * DT,
    carried: binMedian(pooled.dtBins[1], DT_BIN_TICKS, false) * DT,
    meetableCarried: binMedian(pooled.dtBins[2], DT_BIN_TICKS, false) * DT,
  },
  boundMetres: {
    all: binMedian(pooled.boundBins[0], BOUND_BIN_M, false),
    carried: binMedian(pooled.boundBins[1], BOUND_BIN_M, false),
    meetableCarried: binMedian(pooled.boundBins[2], BOUND_BIN_M, false),
  },
  lockTicksBeforeRelease: binMedian(pooled.lockBins, LOCK_BIN_TICKS, false),
  ambiguityAtLastTick: binMedian(pooled.ambBins, 1, false),
  thetaTargetAtArmDegrees: binMedian(pooled.thetaArmBins, THETA_BIN_DEG, false),
  thetaTargetAtLastDegrees: binMedian(pooled.thetaLastBins, THETA_BIN_DEG, false),
  boundMinusGapMetres: {
    carried: binMedian(pooled.bgBins[0], BG_BIN_M, true),
    meetableCarried: binMedian(pooled.bgBins[1], BG_BIN_M, true),
  },
};

const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const totCueN = cells.reduce((a, c) => a + c.row.cueN, 0);
const totDeliv = zeros(DELIV.length);
for (const c of cells) addInto(totDeliv, c.row.byDeliv);
const totMeetableCarried = cells.reduce((a, c) => a + c.row.byDelivMeet[DI('carried')][0], 0);
const totNeverLocks = cells.reduce((a, c) => a + c.row.neverLocks, 0);
const totCensored = cells.reduce((a, c) => a + sum(c.row.sdCensored), 0);
const totGapN = cells.reduce((a, c) => a + c.row.gapN[1], 0);

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: cells.every((c) => c.row.worldOk) && receiptRow.worldOk,
    note: '⭐ `raArmedVersion(match) === 12` on EVERY walked match (and the construction '
      + 'receipt) — asserted off the REAL constructed match, so the arm is world 12\'s own '
      + 'composition (`a4MatchFlags(12)` + `armA4World(m, null, 12)`), CALLED never copied',
  },
  gGenomeClean: {
    ok: cells.every((c) => c.row.genomeClean) && receiptRow.genomeClean,
    note: 'the FRANCHISE genome (`info.genome`) carries NEITHER world-12 pin nor the corridor '
      + 'weight — the match-local arming idiom (canon: dose placement, #270.2 / #334.1)',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ anchored extraction with line receipts: `AI_INTERVAL` · '
      + '`PC_TIER_SIMPLE_TICKS`/`PC_TIER_CHOICE_TICKS` (APPLIED, never nominal) · `TURN_RATE` '
      + '· `CONTROL_RADIUS` · `PTP_FLIGHT_SPEED` · `interceptBall`\'s ts clamp (1 hit) and '
      + 'the `/ ts + 0.15` time-to-point form (2 honest hits, both branches) · the '
      + '`ReceivePass` score literal 1.2 · the `pass.targetGid === p.gid` strike gate · the '
      + 'wind-up record\'s `readyTick` composition and the head-of-tick resolve site (the '
      + 'TICK INDEXING\'s own receipt) · the arm-site `faceTarget` lock · the external '
      + '`heading`/`faceTarget` declarations · the PURE `topSpeed` getter · world 12\'s own '
      + 'flag composition and arming lines · the ActionType vocabulary read off its own union '
      + `(${ACTIONS.length} labels, line ${ACT_BLOCK_LINE})`,
  },
  gCueChannel: {
    ok: CUE_CHANNEL_OK,
    note: '⭐⭐ THE CHANNEL FIXTURE: two passers with IDENTICAL `pos`/`heading` and DIFFERENT '
      + 'private targets (`faceTarget`, the private commitment gid) yield a BYTE-IDENTICAL θ '
      + 'vector — the cue reads `pos` + `heading` and nothing else. The negative half is '
      + 'asserted too: reversing the EXTERNAL heading DOES move the vector, so the fixture '
      + 'cannot pass by the cue being constant',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — the angle arithmetic, the argmin/tie/NaN rules, the ambiguity count, the '
      + 'DX-C2 account, the dead-time and kinematic-bound arithmetic and every bin helper are '
      + 'PURE functions called by BOTH the walk and this table',
  },
  gClassesNonVacuous: {
    ok: totDeliv[DI('toFeet')] > 0 && totDeliv[DI('carried')] > 0
      && totMeetableCarried > 0 && totCueN > 0 && totGapN > 0
      && totNeverLocks >= 0 && totCensored >= 0,
    note: '⛔ no face is computed on an empty cell: BOTH delivery classes are live '
      + `(toFeet ${totDeliv[DI('toFeet')]}, carried ${totDeliv[DI('carried')]}), meetable `
      + `carried n = ${totMeetableCarried} > 0, the cue population n = ${totCueN} > 0, the `
      + `(b) gap denominator on meetable carried n = ${totGapN} > 0, and the 'never locks' `
      + `(${totNeverLocks}) and 'censored start' (${totCensored}) buckets are COUNTED rather `
      + 'than dropped. ⚠ this gate reads LIVENESS, never a direction and never a magnitude',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + 'Match state after `m.step(DT)`. Proven anyway — the same scratch seed walked OBSERVED '
      + 'and UNOBSERVED yields a BYTE-IDENTICAL whole-match signature on '
      + `${LOCKSTEP_SEEDS.length} out-of-band scratch seeds`,
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
        && walksBooked === N_FROZEN + 1
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === N + 1
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds; every battery seed '
      + 'and the construction receipt lie inside block 12,533,000–999; every lockstep seed is '
      + 'out-of-band scratch (canon, VERBATIM: "verifier scratch walks use the stage\'s own '
      + 'consumed band or the out-of-band scratch range (≥ 900,000,000) — never the next '
      + 'virgin block")',
  },
  gN: {
    ok: SIZING_OK && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? 'THE OVERRIDE ARM: the override is DECLARED, the walked n equals the n it declared, '
        + 'and the artifact sits OFF every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = ${
        N_FROZEN}`,
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({ seed: c.seed, ...c.row }));

/** ⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a
 *  field not in the schema never enters the body; forbidden-name lists are retired"
 *  (home: PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1). The body hash is computed
 *  LAST (the #356 hash order), and the FILE BYTE-HASH is published in the doc's §R. */
const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'licence', 'precommittedRead', 'medians', 'bins',
  'account', 'cue', 'window', 'delivClasses', 'meetClasses', 'wGroups', 'aGroups', 'outcomes',
  'actionVocabulary', 'seeds', 'stats', 'anchoredSites', 'fixtures', 'cueChannelFixture',
  'lockstep', 'perf', 'honestLimits', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'RC-C0',
    title: 'THE COOPERATION CENSUS — the outward cue in the wind-up (does the passer\'s body '
      + 'name the target before the release, and how early) · the window and the kinematic '
      + 'bound against the meetable-carried arrival gap · the arrival anatomy',
    doc: 'docs/world-model/RC-C0-COOPERATION-CENSUS.md',
    contract: 'docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md',
    lineage: '#360 item 4 (the cooperation seat named a held door, DX-C2 §R3 +3.233 m) → '
      + 'PASSING-SYSTEM-AUDIT-2026-09-02.md §2.1 → COMMANDER RULING #366 item 3',
    censusFormOfRecord: 'docs/world-model/DX-C2-MEETABILITY-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #366 item 3 (the user\'s ratification, verbatim: '
      + '「按照推荐和workflow走」)',
    kind: 'CENSUS — it publishes MEASUREMENTS; it scores no hypothesis, arms no mechanism and '
      + 'ADJUDICATES NOTHING except the ONE pre-committed licence rule frozen at §P.C, whose '
      + 'verdict word it PRINTS FROM THE RULE. The commander rules.',
    arm: 'ONE ARM — WORLD 12\'s OWN COMPOSITION: `a4MatchFlags(12)` as construction flags + '
      + '`armA4World(m, null, 12)` after construction (the RA world = world 11\'s arming plus '
      + 'the two match-local exam pins). The composer is CALLED, never copied; the arm is '
      + 'gated on the match by `raArmedVersion(match) === 12`.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS the shipped exports '
      + 'and reads Match state per tick. THERE IS NO WRAPPER AT ALL — `gLockstep` proves '
      + 'observed ≡ unobserved byte for byte on out-of-band scratch seeds.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/rc-c0-cooperation-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/rc-c0-cooperation-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: {
      [MATCH_PATH]: sha(MATCH_SRC), [BRAIN_PATH]: sha(BRAIN_SRC), [MECH_PATH]: sha(MECH_SRC),
      [SEAT_PATH]: sha(SEAT_SRC), [CONST_PATH]: sha(CONST_SRC), [PERC_PATH]: sha(PERC_SRC),
      [PLAYER_PATH]: sha(PLAYER_SRC), [PCLAT_PATH]: sha(PCLAT_SRC),
      [TYPES_PATH]: sha(TYPES_SRC), [A4_PATH]: sha(A4_SRC),
    },
  },
  cue: {
    theta: 'θ_i(t) = the angle between `passer.heading` (a unit vector, the shipped external '
      + 'body direction) and `unit(mate_i.pos − passer.pos)`, BOTH read at tick t. EXTERNAL '
      + 'FIELDS ONLY (`pos`, `heading`) — `gCueChannel` proves the blindness with a fixture.',
    matePopulation: 'every same-side off-ball mate of the passer — ALL FIVE in 6v6, the '
      + 'KEEPER INCLUDED (the keeper-excluded variant is published BESIDE); the passer '
      + 'himself is excluded, and any body not on the pitch (`sentOff`) is excluded. k is '
      + 'read at the LAST pre-release tick and published per flight (k̄).',
    tickIndexing: '`m.simTick` after `m.step(DT)`. `armPendingPass` writes `readyTick = '
      + 'stepCount + wTicks + bkTicks` during the brain phase of the ARM tick t0, and '
      + '`resolvePendingPassWindup` runs at the HEAD of the step whose `stepCount >= '
      + 'readyTick` — BEFORE brains and physics. So the record is observable from state at '
      + 'the END of ticks t0 … readyTick−1, the RELEASE tick is `readyTick`, and W = '
      + 'readyTick − t0 ticks. ⚠ Ticks on which a record sits live AT OR PAST readyTick '
      + '(a dead-ball phase gate defers the head-of-tick resolve) are COUNTED and EXCLUDED '
      + 'from every cue face.',
    argmin: 'the argmin over the θ vector; NaN entries (a degenerate bearing) are EXCLUDED; '
      + 'ties break to the LOWEST gid. A flight whose target has no finite θ at the last '
      + 'pre-release tick, or which has fewer than two mates, has NO usable cue read and is '
      + 'counted in `cue.unusableFlightShare` rather than folded into any face.',
    rival: 'THE FROZEN RIVAL for the turn cue = the NON-TARGET mate with the smallest θ at '
      + 'the LAST pre-release tick; his own θ trajectory is then read over the same window.',
    censusRight: 'the instrument reads the truth record '
      + '(`pendingPassWindup.{gid, targetGid, aim, aimLead, readyTick}`) ONLY to LABEL the '
      + 'target, the window and the elected point E = aim (+ aimLead when non-null).',
  },
  account: {
    tBall: 'dist(passer, E) / PTP_FLIGHT_SPEED — the chooser\'s own flight law (`/ 18`)',
    tMate: 'dist(mate, E) / max(mate.topSpeed, 0.1) + 0.15 — `interceptBall`\'s own '
      + 'time-to-point form, byte for byte',
    margin: 'tBall − tMate (positive ⇒ the mate is at the point BEFORE the ball)',
    meetable: 'dist(mate, E) ≤ CONTROL_RADIUS OR margin ≥ 0 — DX-C2 §P.A REUSED IN SUBSTANCE '
      + 'BYTE FOR BYTE (#366 item 3). NO taste threshold.',
    armInstant: 'the mate\'s arm-time position is the RECORD\'s own `aim` (EXACT, so dMate = '
      + '|aimLead| by construction); the passer\'s position and the mate\'s `topSpeed` are '
      + 'read at the END of the arm tick, because with NO WRAPPER the mid-tick instant is not '
      + 'observable. ⚠ DECLARED as a deviation from DX-C2\'s mid-tick capture at §P.',
    predictedArrDist: 'max(0, dMate − max(0, tBall − 0.15) · max(topSpeed, 0.1)) — DX-C2 '
      + '§P.D\'s own prediction, reused.',
  },
  window: {
    W: 'readyTick − t0, in ticks; the sim-second face is W · DT (1 sim-s = 60 ticks = 22.5 '
      + 'display-s; the match is 240 sim-seconds).',
    startDelay: 'ticks from the RELEASE tick to the first tick at which '
      + '`target.action.type === \'ReceivePass\'`. CENSORED if he never enters it before the '
      + 'flight retires — that bucket is counted and named (cut out / lost / re-decided).',
    pcHold: 'OBSERVED from Match state: `match.pcLatency`\'s own hold record for the target '
      + 'gid, matched on `armedTick === releaseTick` and `klass === \'passRelease\'`, '
      + 'published as its APPLIED `ticks` (never nominal). A pure read — the seat\'s mutating '
      + '`holdFor` accessor is NOT called.',
    deadTime: '(release tick − lock tick) + start delay, in ticks and sim-seconds. A '
      + 'NEVER-LOCKING wind-up contributes its START DELAY ALONE (stated).',
    bound: 'max(target.topSpeed@t0, 0.1) × deadTime — the traced account\'s own speed law; no '
      + 'new constant.',
    gapContext: '⛔ DX-C2\'s published +3.233 m is DESIGN CONTEXT ONLY (a different '
      + 'composition, the RA price SHUT). No Δ is computed across batteries.',
  },
  anchoredSites: [
    { what: '⭐⭐ the EXTERNAL body direction the cue reads', file: PLAYER_PATH,
      needle: HEADING_NEEDLE, occurrences: HEADING_HITS },
    { what: 'TURN_RATE — the rate the committed body turns at', file: PLAYER_PATH,
      needle: TURN_RATE_NEEDLE, occurrences: TURN_RATE_HITS, extracted: TURN_RATE },
    { what: 'the INNER aim target (never read by the cue)', file: PLAYER_PATH,
      needle: FACETARGET_NEEDLE, occurrences: FACETARGET_HITS },
    { what: '⭐ the ARM site\'s own aim lock — why the heading turns at all', file: MATCH_PATH,
      needle: ARM_FACE_NEEDLE, occurrences: ARM_FACE_HITS },
    { what: '⭐⭐ THE TICK INDEXING (i): readyTick\'s composition at the arm',
      file: MATCH_PATH, needle: READYTICK_NEEDLE, occurrences: READYTICK_HITS },
    { what: '⭐⭐ THE TICK INDEXING (ii): the HEAD-OF-TICK resolve call inside the step',
      file: MATCH_PATH, needle: RESOLVE_CALL_NEEDLE, occurrences: RESOLVE_CALL_HITS },
    { what: '⭐⭐ THE TICK INDEXING (iii): the resolve\'s own `stepCount < readyTick` guard',
      file: MATCH_PATH, needle: RESOLVE_GUARD_NEEDLE, occurrences: RESOLVE_GUARD_HITS },
    { what: '⭐⭐ the receiver\'s STRIKE-GATED candidate — the `pass.targetGid === p.gid` gate',
      file: BRAIN_PATH, needle: RECEIVE_GATE_NEEDLE, occurrences: RECEIVE_GATE_HITS },
    { what: '⭐⭐ the `ReceivePass` score literal 1.2', file: BRAIN_PATH,
      needle: RECEIVE_SCORE_NEEDLE, occurrences: RECEIVE_SCORE_HITS },
    { what: 'the STRIKE writes the receiver\'s first news (`registerPass`)', file: MECH_PATH,
      needle: REGISTER_PASS_NEEDLE, occurrences: REGISTER_PASS_HITS },
    { what: '⭐⭐ interceptBall\'s ts clamp — the traced chase speed', file: PERC_PATH,
      needle: TS_CLAMP_NEEDLE, occurrences: TS_CLAMP_HITS },
    { what: '⭐⭐ interceptBall\'s time-to-point form (2 honest occurrences: airborne + ground)',
      file: PERC_PATH, needle: TME_NEEDLE, occurrences: TME_HITS },
    { what: 'the PURE topSpeed getter the account reads', file: PLAYER_PATH,
      needle: TOPSPEED_NEEDLE, occurrences: TOPSPEED_HITS },
    { what: 'PTP_FLIGHT_SPEED', file: SEAT_PATH, needle: PTP_SPEED_NEEDLE,
      occurrences: PTP_SPEED_HITS, extracted: PTP_FLIGHT_SPEED },
    { what: 'CONTROL_RADIUS — the presence clause\'s anchored cut', file: CONST_PATH,
      needle: CONTROL_R_NEEDLE, occurrences: CONTROL_R_HITS, extracted: CONTROL_RADIUS },
    { what: 'AI_INTERVAL — the decision cadence inside the dead time', file: CONST_PATH,
      needle: AI_INTERVAL_NEEDLE, occurrences: AI_INTERVAL_HITS, extracted: AI_INTERVAL },
    { what: 'PC_TIER_SIMPLE_TICKS (APPLIED)', file: PCLAT_PATH, needle: PC_SIMPLE_NEEDLE,
      occurrences: PC_SIMPLE_HITS, extracted: PC_TIER_SIMPLE_TICKS },
    { what: 'PC_TIER_CHOICE_TICKS (APPLIED)', file: PCLAT_PATH, needle: PC_CHOICE_NEEDLE,
      occurrences: PC_CHOICE_HITS, extracted: PC_TIER_CHOICE_TICKS },
    { what: '⭐ WORLD 12\'s flag composition — world 11 CALLED, plus RA_WORLD_DOORS',
      file: A4_PATH, needle: RA_FLAGS_NEEDLE, occurrences: RA_FLAGS_HITS,
      extracted: RA_WORLD_VERSION },
    { what: '⭐ WORLD 12\'s arming — world 11\'s arming CALLED, plus the two match-local pins',
      file: A4_PATH, needle: RA_ARM_NEEDLE, occurrences: RA_ARM_HITS,
      extracted: [RA_WORLD_LEAD, RA_WORLD_WEIGHT] },
    { what: 'the ActionType vocabulary, read off its own union', file: TYPES_PATH,
      needle: ACT_BLOCK_START, occurrences: [{ line: ACT_BLOCK_LINE }],
      extracted: ACTIONS.length },
  ],
  actionVocabulary: { labels: ACTIONS, overflowSlotIndex: ACTIONS.length },
  fixtures: FIXTURES,
  cueChannelFixture: {
    what: 'two passers, IDENTICAL external state, DIFFERENT private targets ⇒ IDENTICAL θ '
      + 'vector; and a REVERSED external heading ⇒ a DIFFERENT θ vector (the live half)',
    mates: CUE_MATES, a: CUE_A, b: CUE_B,
    thetaA: cueVecA, thetaB: cueVecB, thetaReversedHeading: cueVecC, ok: CUE_CHANNEL_OK,
  },
  lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,001,800–811), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. Target 0.05 on BOTH pre-registered quantities; N_FROZEN takes the LARGER '
      + 'requirement, capped by what the block affords (≤ 999 walks).',
    nFrozen: N_FROZEN,
    blockAffords: 999,
    rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  licence: {
    face: 'delta.lockVsPrior',
    frozenRule: 'LICENSED ⇔ the 95 % cluster-bootstrap CI of Δ = pLockLast − 1/k̄ lies '
      + 'ENTIRELY ABOVE ZERO (ciLo > 0); BLOCKED ⇔ otherwise. FROZEN AT §P.C IN EXACT FORM '
      + 'BEFORE ANY BATTERY SEED (#366 item 3\'s ONE PRE-COMMITMENT).',
    verdict: LICENCE,
    reading: LICENCE_READING,
    delta: lic,
    pLockLast: face('cue.pLockLast'),
    uniformPrior: face('cue.uniformPrior'),
    keeperExcludedBeside: delta('lockVsPriorKeeperExcluded'),
  },
  precommittedRead: {
    what: '⭐ THE PRE-COMMITTED READ (no gate, #366 item 3): bound ≥ gap ⇒ wind-up reading '
      + 'alone shapes the seat; bound < gap ⇒ the seat is wind-up reading PLUS a named '
      + 'earlier-cue door (the look · the offer) — never a truth read.',
    boundMinusGapMeanMetres: bgMean,
    coversGapShare: coverShare,
    reading: PRECOMMITTED_READ,
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off '
      + 'the SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY '
      + 'published face; a percentile face requires stored bins"',
    values: medians,
  },
  delivClasses: DELIV,
  meetClasses: MEET,
  wGroups: WGROUPS,
  aGroups: AGROUPS,
  outcomes: OUTCOMES,
  bins: {
    sharpeningDeciles: { bins: 10, hits: pooled.decHits, n: pooled.decN },
    lockTicksBeforeRelease: { width: LOCK_BIN_TICKS, bins: LOCK_BINS, overflowIsLast: true,
      pooled: pooled.lockBins },
    thetaTargetAtArmDegrees: { width: THETA_BIN_DEG, bins: THETA_BINS, overflowIsLast: true,
      pooled: pooled.thetaArmBins },
    thetaTargetAtLastDegrees: { width: THETA_BIN_DEG, bins: THETA_BINS, overflowIsLast: true,
      pooled: pooled.thetaLastBins },
    ambiguityAtLastTick: { width: 1, bins: AMB_BINS, overflowIsLast: true,
      pooled: pooled.ambBins },
    wTicks: { width: W_BIN_TICKS, bins: W_BINS, overflowIsLast: true, groups: WGROUPS,
      pooled: pooled.wBins },
    startDelayTicks: { width: SD_BIN_TICKS, bins: SD_BINS, overflowIsLast: true,
      groups: WGROUPS, pooled: pooled.sdBins },
    pcHoldAppliedTicks: { width: 1, bins: PC_HOLD_BINS, overflowIsLast: true, groups: WGROUPS,
      pooled: pooled.pcHoldBins },
    deadTimeTicks: { width: DT_BIN_TICKS, bins: DTIME_BINS, overflowIsLast: true,
      groups: WGROUPS, pooled: pooled.dtBins },
    boundMetres: { width: BOUND_BIN_M, bins: BOUND_BINS, overflowIsLast: true, groups: WGROUPS,
      pooled: pooled.boundBins },
    gapDiffMetres: { width: CAL_BIN_M, bins: CAL_BINS, centreHoldsZero: true, groups: GGROUPS,
      pooled: pooled.gapDiffBins },
    boundMinusGapMetres: { width: BG_BIN_M, bins: BG_BINS, centreHoldsZero: true,
      groups: GGROUPS, pooled: pooled.bgBins },
    actionAtArm: { vocabulary: ACTIONS, groups: AGROUPS, pooled: pooled.actArm },
    actionAtLastPreReleaseTick: { vocabulary: ACTIONS, groups: AGROUPS,
      pooled: pooled.actLast },
    velTowardEAtArmMs: { width: VT_BIN_MS, bins: VT_BINS, centreHoldsZero: true,
      groups: AGROUPS, pooled: pooled.vtArmBins },
    velTowardEAtLastMs: { width: VT_BIN_MS, bins: VT_BINS, centreHoldsZero: true,
      groups: AGROUPS, pooled: pooled.vtLastBins },
    alongLineOffsetMetres: { width: ALONG_BIN_M, bins: ALONG_BINS, centreHoldsZero: true,
      groups: AGROUPS, pooled: pooled.alongBins },
    lateralOffsetMetres: { width: LAT_BIN_M, bins: LAT_BINS, overflowIsLast: true,
      groups: AGROUPS, pooled: pooled.latBins },
    collectionAlongLineMetres: { width: COLLECT_BIN_M, bins: COLLECT_BINS,
      centreHoldsZero: true, groups: AGROUPS, pooled: pooled.collectBins },
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    constructionReceiptSeed: RECEIPT_SEED,
    walksBooked,
    unwalkedTail: (IS_OVERRIDE
      || batterySeeds[batterySeeds.length - 1] + 1 > BLOCK_TOP - 1) ? null
      : [batterySeeds[batterySeeds.length - 1] + 1, BLOCK_TOP - 1],
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    smokeScratchBand: [SCRATCH_BASE, SCRATCH_BASE + 99],
    bootstrapRngSeededFrom: BLOCK_BASE,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: cells.reduce((a, c) => a + c.row.wallMs, 0) / 1000 / cells.length,
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'included — never the game\'s frame cost.',
  },
  honestLimits: [
    '⭐⭐ THE CUE IS ANGULAR ALIGNMENT ALONE. It reads `heading` and the passer→mate bearing '
    + 'and NOTHING else — no distance, no lane, no defender, no history. A richer outward '
    + 'percept (the turn RATE, the deceleration, the mate\'s own bearing) would be a '
    + 'DIFFERENT cue; RC-T0 freezes what the seat actually spends, and #366 item 3 bound the '
    + 'census to THIS one. The turn-direction face is published as the second outward term '
    + 'the census can SHOW, not as a term of the seat.',
    '⭐⭐ THE ARM INSTANT IS READ AT THE END OF THE ARM TICK. With NO WRAPPER the mid-tick '
    + 'capture DX-C2 took inside `armPendingPass` is not observable, so the passer\'s '
    + 'position and the mate\'s `topSpeed` carry up to one tick (1/60 sim-s ≈ 0.13 m at top '
    + 'pace) of drift. The mate\'s own arm position does NOT drift — it is the record\'s own '
    + '`aim`, exact. Declared, not hidden.',
    '⭐⭐ THE (b) GAP CONFLATES MODEL ERROR WITH BEHAVIOUR, AND SAYS SO (DX-C2 §P.D\'s own '
    + 'warning, inherited): `predictedArrDist` assumes an ideal straight chase from the arm '
    + 'instant, and the live receiver has no `ReceivePass` until the ball is struck AND '
    + 'targeted at him. A large positive (measured − predicted) on MEETABLE elections is '
    + 'therefore evidence about the COOPERATION half — a finding, not an instrument error.',
    '⛔ DX-C2\'s +3.233 m IS CONTEXT ONLY — a DIFFERENT composition (the RA price SHUT, world '
    + '11 + four doors) on a DIFFERENT block. No Δ is computed across batteries and none may '
    + 'be quoted.',
    '⚠ THE DEAD TIME IS A CEILING ON WASTE, NOT A PROMISE OF METRES. The kinematic bound '
    + 'spends the whole dead time at `max(topSpeed, 0.1)` in a straight line from a standing '
    + 'start with no acceleration limit, no turn cost and no defender. The engine\'s own '
    + '`ACCEL` and `TURN_RATE` would all reduce it. It is an UPPER bound by construction and '
    + 'must be read as one.',
    '⚠ THE LOCK TICK IS A BACKWARD-LOOKING DEFINITION. It is the first tick from which the '
    + 'target stays rank-1 THROUGH the last pre-release tick — computable only after the '
    + 'window closes. A live receiver cannot know he is inside a lock; the seat RC-T0 would '
    + 'build spends a per-tick BELIEF, not this label. Stated so the number is not read as an '
    + 'available percept.',
    '⚠ THE START DELAY IS CENSORED where the target never enters `ReceivePass` before the '
    + 'flight retires (cut out, ball lost, or the argmax re-decided). The censored share is '
    + 'published per group and those flights contribute to NO dead-time, bound or coverage '
    + 'face — so every (b) face is conditioned on an OBSERVED start, and its denominator says '
    + 'so.',
    '⚠ THE OUTCOME LADDER IS TEMPORAL, NOT CAUSAL (BK-C2 §P.7\'s own warning, inherited '
    + 'through DX-C2).',
    '⚠ ONE ARM. World 12\'s own composition in the EMPTY-BOOK form (`armA4World(m, null, 12)` '
    + '— no L3/PC dose, the form both RA exams walked). No dose sweep, no shut arm, no '
    + 'contrast against another world: a census measures the world it is pointed at.',
    '⚠ THE PC HOLD IS OBSERVED, NOT ASSUMED. Where a `passRelease` hold for the target could '
    + 'not be matched at the release tick, the flight enters NO pcHold face and the observed '
    + 'share is published — an unobserved hold is never imputed as zero.',
    '⚠ CLOCK. 1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every '
    + 'per-match COUNT face carries the clock in its unit string; every SHARE face is '
    + 'clock-invariant; every reaction quantity is APPLIED ticks, never nominal.',
    '⚠ 12 SCRATCH CLUSTERS SIZED THIS BATTERY — a strictly weaker assumption than sizing off '
    + 'a published battery, and the block caps the battery at 999 walks regardless. The '
    + 'sizing table declares row by row what is NOT resolvable here, and no null is cut on '
    + 'an unresolvable row.',
  ],
  perSeedCells,
  constructionReceipt: receiptRow,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/*    canon, VERBATIM: "the re-derivation gate covers EVERY published face; a    */
/*    percentile face requires stored bins"                                     */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as typeof artifact & {
  perSeedCells: (Row & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<string, { pooled?: number[] | number[][]; hits?: number[]; n?: number[] }>;
  licence: { verdict: string; delta: DeltaRow };
  precommittedRead: { boundMinusGapMeanMetres: FaceRow; coversGapShare: FaceRow };
  medians: { values: typeof medians };
  sizing: { rows: typeof sizingRows };
};
const dcells = disk.perSeedCells;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const nu = sum(dcells.map((c) => def.num(c)));
  const de = sum(dcells.map((c) => def.dn(c)));
  const v = ratio(nu, de);
  faceChecks.push({
    face: f.face,
    ok: nu === f.numerator && de === f.denominator
      && (Number.isNaN(v) ? Number.isNaN(f.value) : v === f.value),
  });
}
for (const dd of disk.deltas) {
  const fl = FACES[dd.left];
  const fr = FACES[dd.right];
  const pl = ratio(sum(dcells.map((c) => fl.num(c))), sum(dcells.map((c) => fl.dn(c))));
  const pr = ratio(sum(dcells.map((c) => fr.num(c))), sum(dcells.map((c) => fr.dn(c))));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: (Number.isNaN(pl) ? Number.isNaN(dd.leftValue) : pl === dd.leftValue)
      && (Number.isNaN(pr) ? Number.isNaN(dd.rightValue) : pr === dd.rightValue)
      && (Number.isNaN(pl - pr) ? Number.isNaN(dd.delta) : pl - pr === dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
const reBin1 = (key: string, len: number, pick: (r: Row) => number[]): number[] => {
  const got = zeros(len);
  for (const c of dcells) addInto(got, pick(c));
  binChecks.push({ bin: key,
    ok: JSON.stringify(got) === JSON.stringify(disk.bins[key]?.pooled ?? []) });
  return got;
};
const reBin2 = (key: string, a: number, b: number,
  pick: (r: Row) => number[][]): number[][] => {
  const got = zeros2(a, b);
  for (const c of dcells) addInto2(got, pick(c));
  binChecks.push({ bin: key,
    ok: JSON.stringify(got) === JSON.stringify(disk.bins[key]?.pooled ?? []) });
  return got;
};
{
  const gh = zeros(10);
  const gn = zeros(10);
  for (const c of dcells) { addInto(gh, c.decHits); addInto(gn, c.decN); }
  binChecks.push({ bin: 'sharpeningDeciles',
    ok: JSON.stringify(gh) === JSON.stringify(disk.bins.sharpeningDeciles?.hits ?? [])
      && JSON.stringify(gn) === JSON.stringify(disk.bins.sharpeningDeciles?.n ?? []) });
}
const dLock = reBin1('lockTicksBeforeRelease', LOCK_BINS, (r) => r.lockBins);
const dThA = reBin1('thetaTargetAtArmDegrees', THETA_BINS, (r) => r.thetaArmBins);
const dThL = reBin1('thetaTargetAtLastDegrees', THETA_BINS, (r) => r.thetaLastBins);
const dAmb = reBin1('ambiguityAtLastTick', AMB_BINS, (r) => r.ambBins);
const dW = reBin2('wTicks', NWG, W_BINS, (r) => r.wBins);
const dSd = reBin2('startDelayTicks', NWG, SD_BINS, (r) => r.sdBins);
reBin2('pcHoldAppliedTicks', NWG, PC_HOLD_BINS, (r) => r.pcHoldBins);
const dDt = reBin2('deadTimeTicks', NWG, DTIME_BINS, (r) => r.dtBins);
const dBd = reBin2('boundMetres', NWG, BOUND_BINS, (r) => r.boundBins);
reBin2('gapDiffMetres', NGG, CAL_BINS, (r) => r.gapDiffBins);
const dBg = reBin2('boundMinusGapMetres', NGG, BG_BINS, (r) => r.bgBins);
reBin2('actionAtArm', NAG, NACT, (r) => r.actArm);
reBin2('actionAtLastPreReleaseTick', NAG, NACT, (r) => r.actLast);
reBin2('velTowardEAtArmMs', NAG, VT_BINS, (r) => r.vtArmBins);
reBin2('velTowardEAtLastMs', NAG, VT_BINS, (r) => r.vtLastBins);
reBin2('alongLineOffsetMetres', NAG, ALONG_BINS, (r) => r.alongBins);
reBin2('lateralOffsetMetres', NAG, LAT_BINS, (r) => r.latBins);
reBin2('collectionAlongLineMetres', NAG, COLLECT_BINS, (r) => r.collectBins);
/** ⭐ EVERY BIN-DERIVED MEDIAN re-derives off the disk bins */
{
  const mv = disk.medians.values;
  const wantMed = {
    wSimSeconds: {
      all: binMedian(dW[0], W_BIN_TICKS, false) * DT,
      carried: binMedian(dW[1], W_BIN_TICKS, false) * DT,
      meetableCarried: binMedian(dW[2], W_BIN_TICKS, false) * DT,
    },
    startDelaySimSeconds: {
      all: binMedian(dSd[0], SD_BIN_TICKS, false) * DT,
      carried: binMedian(dSd[1], SD_BIN_TICKS, false) * DT,
      meetableCarried: binMedian(dSd[2], SD_BIN_TICKS, false) * DT,
    },
    deadTimeSimSeconds: {
      all: binMedian(dDt[0], DT_BIN_TICKS, false) * DT,
      carried: binMedian(dDt[1], DT_BIN_TICKS, false) * DT,
      meetableCarried: binMedian(dDt[2], DT_BIN_TICKS, false) * DT,
    },
    boundMetres: {
      all: binMedian(dBd[0], BOUND_BIN_M, false),
      carried: binMedian(dBd[1], BOUND_BIN_M, false),
      meetableCarried: binMedian(dBd[2], BOUND_BIN_M, false),
    },
    lockTicksBeforeRelease: binMedian(dLock, LOCK_BIN_TICKS, false),
    ambiguityAtLastTick: binMedian(dAmb, 1, false),
    thetaTargetAtArmDegrees: binMedian(dThA, THETA_BIN_DEG, false),
    thetaTargetAtLastDegrees: binMedian(dThL, THETA_BIN_DEG, false),
    boundMinusGapMetres: {
      carried: binMedian(dBg[0], BG_BIN_M, true),
      meetableCarried: binMedian(dBg[1], BG_BIN_M, true),
    },
  };
  binChecks.push({ bin: 'medians.allBinDerived',
    ok: JSON.stringify(wantMed) === JSON.stringify(mv) });
}
/** ⭐ THE VERDICT ITSELF, and the pre-committed READ, re-derived from the serialized deltas */
{
  const dsd = disk.licence.delta;
  binChecks.push({ bin: 'licence.verdict',
    ok: (dsd.ciLo > 0 ? 'LICENSED' : 'BLOCKED') === disk.licence.verdict });
  const bg = disk.precommittedRead.boundMinusGapMeanMetres;
  const cs = disk.precommittedRead.coversGapShare;
  const dbgFace = disk.faces.find((f) => f.face === 'bound.minusGapMeanMetres.meetableCarried');
  const dcsFace = disk.faces.find((f) => f.face === 'bound.coversGapShare.meetableCarried');
  binChecks.push({ bin: 'precommittedRead.quotesItsOwnFaces',
    ok: JSON.stringify(bg) === JSON.stringify(dbgFace)
      && JSON.stringify(cs) === JSON.stringify(dcsFace) });
}
/** ⭐ THE PARTITIONS re-derive off disk too */
{
  const bd = zeros(DELIV.length);
  for (const c of dcells) addInto(bd, c.byDeliv);
  const rel = dcells.reduce((a, c) => a + c.windupsReleased, 0);
  binChecks.push({ bin: 'partition.delivery', ok: sum(bd) === rel });
  const bm = zeros2(DELIV.length, MEET.length);
  for (const c of dcells) addInto2(bm, c.byDelivMeet);
  binChecks.push({ bin: 'partition.meetability',
    ok: DELIV.every((_, i) => sum(bm[i]) === bd[i]) });
  const ag = zeros(NAG);
  for (const c of dcells) addInto(ag, c.agN);
  binChecks.push({ bin: 'partition.arrivalGroups',
    ok: ag[0] === bd[DI('carried')] && ag[1] === sum(dcells.map((c) => c.byDelivMeet[DI('carried')][0]))
      && AGROUPS.every((_, i) => sum(
        (() => { const o = zeros(OUTCOMES.length); for (const c of dcells) addInto(o, c.outc[i]); return o; })(),
      ) === ag[i]) });
  const cueTot = dcells.reduce((a, c) => a + c.cueN, 0);
  const lockTot = dcells.reduce((a, c) => a + c.lockN, 0);
  const neverTot = dcells.reduce((a, c) => a + c.neverLocks, 0);
  binChecks.push({ bin: 'partition.lockVsNeverLocks', ok: lockTot + neverTot === cueTot });
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
    + 'partition / VERDICT / pre-committed-read / sizing checks re-derived from the SERIALIZED '
    + 'artifact off disk',
};

/* ---- the #356 HASH ORDER: the body hash is computed LAST, off the ALLOWLIST schema ---- */
const SCHEMA_COMPLETE = BODY_SCHEMA.every((k) => artifact[k] !== undefined)
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail');
gates.gHashOrder = {
  ok: SCHEMA_COMPLETE,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
    + `${BODY_SCHEMA.length}-key schema is complete, covers the per-seed cells and the `
    + 'construction receipt, and EXCLUDES `hashedBodySha256` itself; the body hash is '
    + 'computed LAST — after `gFaces` and `gHashOrder` are in `gates` — and the FILE '
    + 'BYTE-HASH of the final artifact is published in the doc\'s §R',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN;
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after every gate */
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
const FILE_BYTE_SHA = sha(readFileSync(OUT_PATH, 'utf8'));

/* ========================================================================== */
/* §19 THE CONSOLE READ                                                        */
/* ========================================================================== */
banner('');
banner(`RC-C0 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- (a) THE CUE ---');
banner(`  pLockLast ${face('cue.pLockLast').value.toFixed(6)} `
  + `[${face('cue.pLockLast').ciLo.toFixed(6)}, ${face('cue.pLockLast').ciHi.toFixed(6)}]  `
  + `prior 1/k̄ ${face('cue.uniformPrior').value.toFixed(6)} `
  + `(k̄ ${face('cue.kBarMatesPerFlight').value.toFixed(6)})  n=${face('cue.pLockLast').denominator}`);
banner(`  Δ = pLockLast − 1/k̄ : ${lic.delta.toFixed(6)} [${lic.ciLo.toFixed(6)}, `
  + `${lic.ciHi.toFixed(6)}] (${lic.absDeltaOverHalfWidth.toFixed(3)} hw)  ⇒ ${LICENCE}`);
const licKx = delta('lockVsPriorKeeperExcluded');
banner(`  keeper-excluded BESIDE: Δ ${licKx.delta.toFixed(6)} [${licKx.ciLo.toFixed(6)}, `
  + `${licKx.ciHi.toFixed(6)}]  (pLockLast ${face('cue.pLockLast.keeperExcluded').value
    .toFixed(6)}, prior ${face('cue.uniformPrior.keeperExcluded').value.toFixed(6)})`);
banner(`  sharpening: arm ${face('cue.pLockArm').value.toFixed(6)} → mid `
  + `${face('cue.pLockMid').value.toFixed(6)} → last ${face('cue.pLockLast').value.toFixed(6)}`);
banner(`  lock lead median ${medians.lockTicksBeforeRelease} ticks `
  + `(mean ${face('cue.lockTicksBeforeReleaseMean').value.toFixed(6)}); never-locks `
  + `${face('cue.neverLocksShare').value.toFixed(6)}; ambiguity median `
  + `${medians.ambiguityAtLastTick}`);
banner(`  turn toward TARGET ${face('cue.turnTowardTargetShare').value.toFixed(6)} vs RIVAL `
  + `${face('cue.turnTowardRivalShare').value.toFixed(6)}`);
banner('');
banner('--- (b) THE WINDOW AND THE BOUND ---');
for (const g of WGROUPS) {
  banner(`  ${g.padEnd(16)} W ${face(`window.wMeanSimSeconds.${g}`).value.toFixed(6)} s  `
    + `start ${face(`window.startDelayMeanSimSeconds.${g}`).value.toFixed(6)} s  dead `
    + `${face(`window.deadTimeMeanSimSeconds.${g}`).value.toFixed(6)} s  bound `
    + `${face(`window.boundMeanMetres.${g}`).value.toFixed(6)} m  n=`
    + `${face(`window.boundMeanMetres.${g}`).denominator}  censored `
    + `${face(`window.startDelayCensoredShare.${g}`).value.toFixed(6)}`);
}
for (const g of GGROUPS) {
  banner(`  gap ${g.padEnd(16)} predicted ${face(`gap.predictedMeanMetres.${g}`).value
    .toFixed(6)} m vs measured ${face(`gap.measuredMeanMetres.${g}`).value.toFixed(6)} m  diff `
    + `${face(`gap.meanDiffMetres.${g}`).value.toFixed(6)} [${face(`gap.meanDiffMetres.${g}`)
      .ciLo.toFixed(6)}, ${face(`gap.meanDiffMetres.${g}`).ciHi.toFixed(6)}]  n=`
    + `${face(`gap.meanDiffMetres.${g}`).denominator}`);
  banner(`  bound−gap ${g.padEnd(10)} ${face(`bound.minusGapMeanMetres.${g}`).value.toFixed(6)} m `
    + `[${face(`bound.minusGapMeanMetres.${g}`).ciLo.toFixed(6)}, `
    + `${face(`bound.minusGapMeanMetres.${g}`).ciHi.toFixed(6)}]  covers `
    + `${face(`bound.coversGapShare.${g}`).value.toFixed(6)} `
    + `[${face(`bound.coversGapShare.${g}`).ciLo.toFixed(6)}, `
    + `${face(`bound.coversGapShare.${g}`).ciHi.toFixed(6)}]`);
}
banner(`  PRE-COMMITTED READ: ${PRECOMMITTED_READ}`);
banner('');
banner('--- (c) THE ARRIVAL ANATOMY ---');
for (const g of AGROUPS) {
  const mix = ACTION_SHORTLIST
    .map((a) => `${a} ${face(`arrival.actionShareAtArm.${g}.${a}`).value.toFixed(4)}`).join(' · ');
  banner(`  ${g} @arm: ${mix}`);
  banner(`  ${g} vel→E arm ${face(`arrival.velTowardEMeanMsAtArm.${g}`).value.toFixed(6)} m/s → `
    + `last ${face(`arrival.velTowardEMeanMsAtLast.${g}`).value.toFixed(6)} m/s; along `
    + `${face(`arrival.alongLineOffsetMeanMetres.${g}`).value.toFixed(6)} m, lateral `
    + `${face(`arrival.lateralOffsetMeanMetres.${g}`).value.toFixed(6)} m; completed `
    + `${face(`arrival.outcome.${g}.completed`).value.toFixed(6)}, intercepted `
    + `${face(`arrival.outcome.${g}.intercepted`).value.toFixed(6)}, unresolved `
    + `${face(`arrival.outcome.${g}.unresolved`).value.toFixed(6)}`);
}
banner('');
banner('--- §R4 CONTEXT ---');
banner(`  goals ${face('context.goalsPerMatch').value.toFixed(6)}/match · ground passes `
  + `${face('context.groundPassesPerMatch').value.toFixed(6)}/match · wind-up flights `
  + `${face('context.windupFlightsPerMatch').value.toFixed(6)}/match · carried share `
  + `${face('context.carriedShareOfWindupFlights').value.toFixed(6)} · meetable|carried `
  + `${face('context.meetableShareOfCarried').value.toFixed(6)} · completion `
  + `${face('context.passCompletion').value.toFixed(6)}`);
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FILE_BYTE_SHA}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
