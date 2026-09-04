/**
 * ⭐⭐ RC-C0b — THE DETECTOR CENSUS (docs/world-model/RC-C0B-DETECTOR-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #372 item 6 (scope = #371 item 5 VERBATIM), bound by
 * docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3b (THE READY
 * LIMB). Lineage: RC-C0 (the cooperation census — the instrument family this adapts) →
 * PT-C0 (the dosed composition and the BK `BodySector` classifier, CALLED) → RC-T0 →
 * RC-T1a (the corrected hash ORDER and the artifact-reload receipt) → #372.
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis, arms no
 * mechanism and makes no football claim. IT ADJUDICATES NOTHING except the ONE
 * pre-committed licence rule frozen at §P.C, whose verdict word it PRINTS FROM THE RULE —
 * the commander rules.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS the shipped
 * exports and reads Match state per tick. THERE IS NO WRAPPER AT ALL: observation is pure
 * per-tick reads after `m.step(DT)`, and `gLockstep` proves observed ≡ unobserved.
 *
 * THE THREE FROZEN QUESTION GROUPS (#371 item 5, verbatim scope):
 *   (a) THE DETECTOR TABLE — over every OPEN-PLAY tick a same-side body OWNS the ball
 *       ("carrying ticks"), the truth label (a wind-up live for that owner — the census's
 *       right, never the seat's) against the EXTERNAL CELL = carrier SPEED bin × carrier
 *       heading ANGULAR-SPEED bin × my alignment RANK; the base rate; P(wind-up | cell);
 *       P(wind-up ∧ target = me | cell); the axis marginals; the lift; and the FROZEN CELL
 *       FAMILY F with its Δ, coverage and precision. ⭐ ONE PRE-COMMITMENT at §P.C.
 *   (b) THE TARGET'S FACING GEOMETRY during the wind-up — at the arm tick t0 and the last
 *       pre-release tick: the SECTOR the ball would meet if struck now (the BK classifier
 *       `ballAccessGeometry` CALLED, never re-implemented), the TURN he needs to face the
 *       passer, its ticks at TURN_RATE·DT against W, and the front-on share.
 *   (c) THE COST OF FACING — a CODE FACT (anchored) plus a walk-side FIXTURE.
 *
 * ⭐ THE CENSUS'S RIGHT, STATED: the instrument READS the truth record
 * (`pendingPassWindup.{gid, targetGid, readyTick}`) ONLY to LABEL the tick and the target.
 * THE CELL is computed from EXTERNAL fields alone (the owner's pos / heading / vel, my pos)
 * — `gCueChannel` proves it with a fixture.
 *
 * TWO ARMS, PAIRED ON SHARED SEEDS, the world's own composer CALLED never copied:
 *   E  world 12 EMPTY-BOOK — a4MatchFlags(12) + armA4World(m, null, 12)   [the exam form]
 *   D  world 12 DOSED      — armA4World(m, null, 12, L3_DOSE, PC_DOSE)    [the user's form]
 * Neither arm arms `rcAnticipate`; `gWorld` asserts the flag FALSE and the gene ABSENT.
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, AI_INTERVAL, TOUCH_CONTROL_DIST, BALL_RADIUS } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, raArmedVersion, loadL3Dose, loadPcDose,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { ballAccessGeometry, type BodySector } from '../../src/sim/physical';
import { TURN_RATE, ACCEL, Player } from '../../src/sim/Player';
import { randomGenome, rcAnticipationWeightOf, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad, randomPlayer } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type ActionType, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the RC-C0 §1 form                          */
/* ========================================================================== */
const ENV_WHITELIST = ['RCC0B_MODE', 'RCC0B_N', 'RCC0B_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('RCC0B_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`RC-C0b FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.RCC0B_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('RC-C0b FATAL — RCC0B_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.RCC0B_N !== undefined ? Number(process.env.RCC0B_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('RC-C0b FATAL — RCC0B_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.RCC0B_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`RCC0B_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`RCC0B_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`RCC0B_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/rc-c0b-detector-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/rc-c0b-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('RC-C0b FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the RC-C0 §2 set, unchanged)                              */
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
/** the EDGE-LIST bin: index i = [edges[i-1], edges[i]); the LAST index is the open top */
const edgeBinOf = (v: number, edges: readonly number[]): number => {
  for (let i = 0; i < edges.length; i++) if (v < edges[i]) return i;
  return edges.length;
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
const CONST_PATH = 'src/sim/constants.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const GENOME_PATH = 'src/evolution/genome.ts';
const PATHS = [MATCH_PATH, CONST_PATH, PLAYER_PATH, PHYS_PATH, TYPES_PATH, A4_PATH,
  GENOME_PATH] as const;
const SRC_OF: Record<string, string> = {};
for (const p of PATHS) SRC_OF[p] = readFileSync(p, 'utf8');
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
): void => {
  ANCHORS.push({ what, file, needle, want, occurrences: occurrences(SRC_OF[file], needle), extracted });
};

/* ⭐⭐ (a) THE CELL'S OWN EXTERNAL FIELDS AND THE TURN LAW THE ANGULAR-SPEED BIN IS CUT FROM */
anchor('⭐⭐ (a) the EXTERNAL body direction the cell reads (`heading`)', PLAYER_PATH,
  '  heading = v2(1, 0);', 1);
anchor('⭐⭐ (a) TURN_RATE — the cap the ANGULAR-SPEED BINS are anchored to', PLAYER_PATH,
  'export const TURN_RATE = 6.5;', 1, TURN_RATE);
anchor('⭐⭐ (a) BASE_SPEED — the role speed table the SPEED BINS are anchored to (the top '
  + 'entry 7.9 × the pace span 1.12 caps `topSpeed` under 8.9 m/s)', PLAYER_PATH,
  "const BASE_SPEED: Record<Role, number> = { GK: 6.4, DF: 7.0, MF: 7.3, WG: 7.9, ST: 7.7 };", 1);
anchor('⭐ (a) the PURE topSpeed getter the speed scale runs through', PLAYER_PATH,
  '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);', 1);
anchor('(a) the INNER aim target — NEVER read by the cell', PLAYER_PATH,
  '  faceTarget: V2 | null = null;', 1);
/* ⭐⭐ (c) THE HEADING INTEGRATOR — the CODE FACT of §P.E, anchored line by line */
anchor('⭐⭐ (c) THE VELOCITY INTEGRATION — `desiredVel` clamped by `topSpeed` alone; the '
  + 'heading appears NOWHERE in it', PLAYER_PATH,
  '    const dv = this.desiredVel;\n'
  + '    const max = this.topSpeed;\n'
  + '    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen', 1);
anchor('⭐⭐ (c) THE ACCELERATION LIMIT — `accel · dt` toward the target velocity, again with '
  + 'no heading term', PLAYER_PATH, '    const maxDelta = this.accel * dt; // approachV', 1);
anchor('⭐⭐ (c) THE POSITION INTEGRATION — position advances from VELOCITY, and it happens '
  + 'BEFORE the heading is touched at all', PLAYER_PATH,
  '    this.pos.x = this.pos.x + this.vel.x * dt;\n'
  + '    this.pos.y = this.pos.y + this.vel.y * dt;', 1);
anchor('⭐⭐ (c) THE HEADING ROTATION — toward `faceTarget` (backpedal, 27.5) or else the '
  + 'movement direction, capped at TURN_RATE; it WRITES `heading` and reads nothing back '
  + 'into `vel` or `pos`', PLAYER_PATH,
  '    if (turn) {\n'
  + '      const hx = this.heading.x;\n'
  + '      const hy = this.heading.y;', 1);
anchor('⭐⭐ (c) the shipped docstring of record: the body direction "remains independent of '
  + 'velocity direction"', PLAYER_PATH,
  '   * that could drift, and it remains independent of velocity direction.', 1);
anchor('⭐ (c) ACCEL — the only rate that limits how fast the velocity may change',
  PLAYER_PATH, 'export const ACCEL = 14; // m/s^2 toward desired velocity', 1, ACCEL);
/* ⭐⭐ (b) THE BK SECTOR CLASSIFIER — CALLED, never re-implemented (PT-C0 §P.C's own pins) */
anchor('⭐⭐ (b) the BodySector TYPE, read off its own union', PHYS_PATH,
  "export type BodySector = 'front' | 'side' | 'back';", 1);
anchor('⭐⭐ (b) THE LAW\'S OWN SECTOR CLASSIFIER — the thresholds, verbatim (CALLED, never '
  + 're-implemented)', PHYS_PATH,
  '  const sector: BodySector = facingCos >= Math.SQRT1_2\n'
  + "    ? 'front'\n"
  + '    : facingCos <= -Math.SQRT1_2\n'
  + "      ? 'back'\n"
  + "      : 'side';", 1);
anchor('⭐ (b) the classifier\'s own entry point', PHYS_PATH,
  'export function ballAccessGeometry(', 1);
anchor('(b) the EXTERNAL body direction the sector classifier reads', PLAYER_PATH,
  '  get bodyDir(): Readonly<V2> {', 1);
anchor('(b) CONTROL_RADIUS — the reach the classifier is called at', CONST_PATH,
  'export const CONTROL_RADIUS = ', 1, CONTROL_RADIUS);
anchor('(b) BALL_RADIUS — the ball the classifier is called with', CONST_PATH,
  'export const BALL_RADIUS = 0.11;', 1, BALL_RADIUS);
/* ⭐⭐ THE TRUTH RECORD AND ITS TICK INDEXING (RC-C0 §P.A's own three sites) */
anchor('⭐⭐ THE TRUTH RECORD — `pendingPassWindup`\'s own field list (the census LABELS with '
  + 'it and computes NO cell from it)', MATCH_PATH,
  '  pendingPassWindup:\n'
  + '    {\n'
  + '      gid: number; readyTick: number; aim: V2;\n'
  + '      targetGid: number; targetRosterIdx: number; offsideExempt: boolean; powerChoice: number;\n'
  + '      aimLead: V2 | null;\n'
  + '    } | null = null;', 1);
anchor('⭐⭐ THE TICK INDEXING (i): readyTick\'s composition at the arm', MATCH_PATH,
  '      readyTick: this.stepCount + wTicks + bkTicks,', 1);
anchor('⭐⭐ THE TICK INDEXING (ii): the HEAD-OF-TICK resolve call inside the step', MATCH_PATH,
  '    if (this.pendingPassWindup !== null) this.resolvePendingPassWindup();', 1);
anchor('⭐⭐ THE TICK INDEXING (iii): the resolve\'s own `stepCount < readyTick` guard',
  MATCH_PATH,
  '    if (!this.o1PassWindup || pp === null || this.stepCount < pp.readyTick) return;', 1);
anchor('⭐ the ARM site\'s own aim lock — why the passer\'s heading turns at all', MATCH_PATH,
  '    passer.faceTarget = { x: mate.pos.x, y: mate.pos.y };', 1);
/* the PRESSED bit, REPORTED beside — the engine's own split */
anchor('⭐ THE PRESSED BIT — the engine\'s own cut (an opponent inside `TOUCH_CONTROL_DIST` '
  + 'of the ball)', MATCH_PATH, '        const pressed = nearestOpp <= TOUCH_CONTROL_DIST;', 1);
anchor('TOUCH_CONTROL_DIST — the pressed cut\'s own constant', CONST_PATH,
  'export const TOUCH_CONTROL_DIST = 4.2;', 1, TOUCH_CONTROL_DIST);
anchor('AI_INTERVAL — the decision cadence a per-tick belief would be spent at', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
/* ⭐ THE ARMS — world 12's own composer, CALLED never copied; and the DORMANT seat */
anchor('⭐ WORLD 12\'s flag composition — world 11 CALLED, plus RA_WORLD_DOORS', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐ WORLD 12\'s arming — world 11\'s arming CALLED, plus the two match-local pins',
  A4_PATH,
  '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);', 1,
  [RA_WORLD_LEAD, RA_WORLD_WEIGHT]);
anchor('⭐ the DOSED arm\'s own entry — `armA4World`\'s l3Dose / pcDose parameters', A4_PATH,
  '  l3Dose: readonly L3DoseCell[] | null = null, pcDose: PcDoseTable | null = null,', 1);
anchor('⭐⭐ THE SEAT THIS CENSUS DOES NOT ARM — the `rcAnticipate` match flag', MATCH_PATH,
  '    this.rcAnticipate = cfg.rcAnticipate ?? false;', 1);
anchor('⭐⭐ THE GENE THIS CENSUS DOES NOT WRITE — `rcAnticipationWeightOf`\'s born-absent '
  + 'accessor', GENOME_PATH, 'export function rcAnticipationWeightOf(g: TacticalGenome): number | null {', 1);

/** ⭐ THE ActionType VOCABULARY — extracted from its own union, never re-typed */
const ACT_BLOCK_START = 'export type ActionType =';
const actBlockIdx = SRC_OF[TYPES_PATH].indexOf(ACT_BLOCK_START);
const actBlock = actBlockIdx < 0 ? '' : SRC_OF[TYPES_PATH].slice(
  actBlockIdx, SRC_OF[TYPES_PATH].indexOf(';', actBlockIdx),
);
const ACTIONS = (actBlock.match(/\|\s*'([A-Za-z]+)'/g) ?? [])
  .map((s) => (/'([A-Za-z]+)'/.exec(s) as RegExpExecArray)[1]) as readonly ActionType[];
const ACT_BLOCK_LINE = actBlockIdx < 0 ? -1 : lineOf(SRC_OF[TYPES_PATH], actBlockIdx);
ANCHORS.push({
  what: 'the ActionType vocabulary, read off its own union', file: TYPES_PATH,
  needle: ACT_BLOCK_START, want: 1, occurrences: [{ line: ACT_BLOCK_LINE }],
  extracted: ACTIONS.length,
});
const AI = (a: ActionType | string): number => {
  const i = (ACTIONS as readonly string[]).indexOf(a);
  return i < 0 ? ACTIONS.length : i; // the overflow slot: an unnamed label would be visible
};
const NACT = ACTIONS.length + 1;
/** THE SECTOR VOCABULARY — read off `BodySector`'s own union, never re-typed */
const SECT_NEEDLE = "export type BodySector = 'front' | 'side' | 'back';";
const SECTORS = ((SRC_OF[PHYS_PATH].slice(
  SRC_OF[PHYS_PATH].indexOf(SECT_NEEDLE), SRC_OF[PHYS_PATH].indexOf(SECT_NEEDLE)
    + SECT_NEEDLE.length,
).match(/'([a-z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly BodySector[];
const SI_OF = (s: BodySector): number => SECTORS.indexOf(s);

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && ACTIONS.length === 23 && ACTIONS.includes('ReceivePass')
  && SECTORS.length === 3 && SECTORS.join(',') === 'front,side,back'
  && TURN_RATE === 6.5 && ACCEL === 14 && AI_INTERVAL === 0.15
  && CONTROL_RADIUS > 0 && BALL_RADIUS === 0.11 && TOUCH_CONTROL_DIST === 4.2
  && RA_WORLD_VERSION === 12 && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1;

/* ========================================================================== */
/* §4 SEEDS — block 12,536,000–999 (#372 item 6)                                */
/* ========================================================================== */
const BLOCK_BASE = 12_536_000;
const BLOCK_TOP = 12_536_999;
/** ⭐⭐ N_FROZEN — sized by the §DEV-PREFLIGHT 12-cluster scratch smoke BEFORE the freeze
 *  commit and BEFORE any battery seed, at a 0.05 target on the pre-committed Δ_F (§P.C)
 *  and on the (b) front-on share at the last pre-release tick. The two arms SHARE seeds, so
 *  the block affords at most 999 battery seeds (12,536,000–12,536,998) plus the
 *  construction receipt at 12,536,999. Any row needing more is DECLARED UNRESOLVABLE here
 *  and no null may be cut on it. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_200;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 80 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

/* ========================================================================== */
/* §5 THE ARMS — WORLD 12's OWN COMPOSITION, the composer CALLED never copied   */
/* ========================================================================== */
const ARMS = ['E', 'D'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  E: 'world 12 EMPTY-BOOK — the exams\' form: a4MatchFlags(12) + armA4World(m, null, 12)',
  D: 'world 12 DOSED — THE FORM THE USER PLAYS: a4MatchFlags(12) + '
    + 'armA4World(m, null, 12, l3Dose, pcDose), the doses from the SHIPPED LOADERS',
};
/** ⭐⭐ THE DOSES, from the SHIPPED LOADERS THEMSELVES (`loadL3Dose` / `loadPcDose`, CALLED),
 *  with the two BYTE-HASHES OF RECORD PINNED from PT-C0's artifact `doseSource.files`
 *  (#369's §CORR item 2(i): "any future dosed arm PINS those two byte-hashes as expected
 *  values"). Canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a
 *  self-declared field". */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_SHA_PINNED = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_SHA_PINNED = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
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
  banner(`RC-C0b FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  banner('  §P.F requires the dosed arm to be DECLARED unreachable in the doc before a run '
    + 'without it; this instrument refuses to silently approximate a dose.');
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
/** ⭐⭐ RC-C0's own population construction (the same genome/squad/side/seed plumbing and the
 *  same 240 s match), so arm k walks seed s with the IDENTICAL population and the two arms
 *  differ ONLY in the two DOSES — that is what makes every (b) contrast PAIRED per seed. */
const buildMatch = (seed: number, arm: Arm): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(RA_WORLD_VERSION),
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'E') armA4World(m, null, RA_WORLD_VERSION);
  else armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  return m;
};

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   (canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions")             */
/* ========================================================================== */
/**
 * ⭐⭐ THE ALIGNMENT ANGLE — RC-C0 §P.A's CUE, BYTE FOR BYTE. θ = the angle in RADIANS
 * between the carrier's `heading` (a unit vector, the shipped external body direction) and
 * `unit(mate.pos − carrier.pos)`, both read at the SAME tick. Nothing private enters.
 * A degenerate bearing (mate ON the carrier) or a degenerate heading names no angle: NaN.
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
/**
 * ⭐⭐ THE RANK — RC-C0 §P.A's argmin, EXTENDED TO THE WHOLE VECTOR in its own terms:
 * rank(i) = 1 + #{ j ≠ i : θ_j < θ_i, or (θ_j === θ_i and gid_j < gid_i) } over the FINITE
 * entries. rank 1 is therefore EXACTLY RC-C0's `argminFinite` (strict argmin, ties to the
 * LOWEST gid). A NaN entry (degenerate bearing) has NO rank and is EXCLUDED from the tick.
 */
const rankOf = (
  theta: readonly number[], gids: readonly number[], i: number,
): number => {
  const ti = theta[i];
  if (!Number.isFinite(ti)) return -1;
  let r = 1;
  for (let j = 0; j < theta.length; j++) {
    if (j === i) continue;
    const tj = theta[j];
    if (!Number.isFinite(tj)) continue;
    if (tj < ti || (tj === ti && gids[j] < gids[i])) r += 1;
  }
  return r;
};
/** the ANGULAR SPEED of a heading between two consecutive ticks, in rad/s. */
const angSpeedOf = (
  hx0: number, hy0: number, hx1: number, hy1: number, dt: number,
): number => {
  const a = cueAngle(0, 0, hx0, hy0, hx1, hy1);
  return Number.isFinite(a) ? a / dt : Number.NaN;
};
/** the TURN a body needs to face a point, in TICKS at TURN_RATE (ceil; 0 when already on). */
const turnTicksOf = (turnRad: number): number => Math.ceil(turnRad / (TURN_RATE * DT));
/** ⭐⭐ (b) THE SECTOR THE BALL WOULD MEET IF STRUCK NOW — the BK law's OWN classifier,
 *  CALLED (never re-implemented): the target's body, and a ball placed at the PASSER (the
 *  classifier reads only the UNIT direction body→ball, so the passer's own position gives
 *  the approach direction exactly). */
const sectorFacing = (
  bodyX: number, bodyY: number, hx: number, hy: number, coreRadius: number,
  passerX: number, passerY: number,
): BodySector => ballAccessGeometry(
  { pos: { x: bodyX, y: bodyY }, bodyDir: { x: hx, y: hy }, coreRadius },
  { pos: { x: passerX, y: passerY }, radius: BALL_RADIUS },
  CONTROL_RADIUS,
).sector;

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* the angle arithmetic, walked at pinned inputs (RC-C0's own fixture table, reused) */
fx('cue.straightAhead', near(cueAngle(0, 0, 1, 0, 5, 0), 0), true);
fx('cue.rightAngle', near(cueAngle(0, 0, 1, 0, 0, 3), Math.PI / 2), true);
fx('cue.behind', near(cueAngle(0, 0, 1, 0, -4, 0), Math.PI), true);
fx('cue.headingNotUnit', near(cueAngle(0, 0, 7, 0, 0, 9), Math.PI / 2), true);
fx('cue.degenerateMateOnPasser', Number.isNaN(cueAngle(2, 2, 1, 0, 2, 2)), true);
fx('cue.degenerateHeading', Number.isNaN(cueAngle(0, 0, 0, 0, 1, 1)), true);
/* the RANK arithmetic — rank 1 IS RC-C0's argmin, ties to the LOWEST gid */
fx('rank.smallestIsOne', rankOf([0.9, 0.2, 1.4], [3, 5, 7], 1), 1);
fx('rank.middleIsTwo', rankOf([0.9, 0.2, 1.4], [3, 5, 7], 0), 2);
fx('rank.largestIsThree', rankOf([0.9, 0.2, 1.4], [3, 5, 7], 2), 3);
fx('rank.skipsNaN', rankOf([Number.NaN, 0.7, 1.1], [3, 5, 7], 2), 2);
fx('rank.nanHasNoRank', rankOf([Number.NaN, 0.7], [3, 5], 0), -1);
fx('rank.tieToLowestGid.winner', rankOf([0.5, 0.5], [3, 5], 0), 1);
fx('rank.tieToLowestGid.loser', rankOf([0.5, 0.5], [3, 5], 1), 2);
fx('rank.tieToLowestGid.reversedGids', rankOf([0.5, 0.5], [9, 2], 1), 1);
/* the ANGULAR SPEED arithmetic, anchored to TURN_RATE's own cap */
fx('angSpeed.noTurn', near(angSpeedOf(1, 0, 1, 0, DT), 0), true);
fx('angSpeed.quarterTurnPerTick',
  near(angSpeedOf(1, 0, 0, 1, DT), (Math.PI / 2) / DT), true);
fx('angSpeed.atTurnRateCap',
  near(angSpeedOf(1, 0, Math.cos(TURN_RATE * DT), Math.sin(TURN_RATE * DT), DT), TURN_RATE),
  true);
fx('angSpeed.degenerate', Number.isNaN(angSpeedOf(0, 0, 1, 0, DT)), true);
/* the BIN edges, frozen at §P.B */
const SPEED_EDGES = [1, 2, 3.5, 5] as const;          // ⇒ 5 bins, the last [5, ∞)
const NSPEED = SPEED_EDGES.length + 1;
const ANG_EDGES = [0.5, 2, 4] as const;               // ⇒ 4 bins, the last [4, TURN_RATE]
const NANG = ANG_EDGES.length + 1;
const NRANK = 6;                                       // ranks 1–5, index 5 = rank ≥ 6
const RI_OF = (r: number): number => (r < 1 ? 0 : r > NRANK ? NRANK - 1 : r - 1);
const NCELL = NSPEED * NANG * NRANK;
const CELL_OF = (si: number, ai: number, ri: number): number => (si * NANG + ai) * NRANK + ri;
fx('speedBin.zero', edgeBinOf(0, SPEED_EDGES), 0);
fx('speedBin.justUnderOne', edgeBinOf(0.999, SPEED_EDGES), 0);
fx('speedBin.one', edgeBinOf(1, SPEED_EDGES), 1);
fx('speedBin.threePointFour', edgeBinOf(3.4, SPEED_EDGES), 2);
fx('speedBin.four', edgeBinOf(4, SPEED_EDGES), 3);
fx('speedBin.top', edgeBinOf(8.8, SPEED_EDGES), 4);
fx('angBin.zero', edgeBinOf(0, ANG_EDGES), 0);
fx('angBin.half', edgeBinOf(0.5, ANG_EDGES), 1);
fx('angBin.two', edgeBinOf(2, ANG_EDGES), 2);
fx('angBin.turnRateCap', edgeBinOf(TURN_RATE, ANG_EDGES), 3);
fx('angBin.topIsTheTurnRateBin', NANG - 1, 3);
fx('cell.index.first', CELL_OF(0, 0, 0), 0);
fx('cell.index.last', CELL_OF(NSPEED - 1, NANG - 1, NRANK - 1), NCELL - 1);
fx('cell.count', NCELL, 120);
fx('rankIndex.one', RI_OF(1), 0);
fx('rankIndex.five', RI_OF(5), 4);
fx('rankIndex.overflow', RI_OF(9), 5);
/* the TURN-TICKS arithmetic */
fx('turnTicks.alreadyFacing', turnTicksOf(0), 0);
fx('turnTicks.oneTickWorth', turnTicksOf(TURN_RATE * DT), 1);
fx('turnTicks.justOverOneTick', turnTicksOf(TURN_RATE * DT * 1.01), 2);
fx('turnTicks.halfTurn', turnTicksOf(Math.PI), Math.ceil(Math.PI / (TURN_RATE * DT)));
/* ⭐⭐ (b) the LAW'S OWN sector classifier, CALLED on constructed geometries (PT-C0's own) */
fx('sector.frontWhenPasserAhead', sectorFacing(0, 0, 1, 0, 0.3, 1, 0), 'front');
fx('sector.backWhenPasserBehind', sectorFacing(0, 0, 1, 0, 0.3, -1, 0), 'back');
fx('sector.sideWhenPasserAbeam', sectorFacing(0, 0, 1, 0, 0.3, 0, 1), 'side');
fx('sector.frontAt44Degrees',
  sectorFacing(0, 0, 1, 0, 0.3, Math.cos(0.76), Math.sin(0.76)), 'front');
fx('sector.sideAt46Degrees',
  sectorFacing(0, 0, 1, 0, 0.3, Math.cos(0.81), Math.sin(0.81)), 'side');
fx('sector.backAt136Degrees',
  sectorFacing(0, 0, 1, 0, 0.3, Math.cos(2.38), Math.sin(2.38)), 'back');
fx('sector.vocabularyIsTheUnions', SECTORS, ['front', 'side', 'back']);
/* the bin helpers */
fx('binOf.first', binOf(0.4, 0.5, 21), 0);
fx('binOf.overflow', binOf(999, 0.5, 21), 20);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 41), 20);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 41), 0);
fx('signedBinOf.overflow', signedBinOf(999, 1, 41), 40);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);

/* ========================================================================== */
/* §7 gWalkFixtures (c) — THE COST-OF-FACING FIXTURE
   ⭐⭐ THE CODE FACT, FROZEN AT §P.E BEFORE ANY BATTERY SEED: `Player.physicsStep` derives
   the velocity from `desiredVel` clamped by `topSpeed` and rate-limited by `accel · dt`,
   then advances `pos` from `vel` — and only THEN rotates `heading` toward `faceTarget` (or
   the movement direction) at TURN_RATE. The heading is WRITTEN by that block and never READ
   back into `vel` or `pos`. The shipped docstring says it in the source's own words: the
   body direction "remains independent of velocity direction". ⇒ FACING THE PASSER WHILE
   DRIFTING IS FREE IN THIS ENGINE. The fixture DRIVES two identical bodies toward the same
   target for N ticks — one with `faceTarget` set 90° off its velocity, one with none — and
   reports the DISTANCE RATIO.                                                              */
/* ========================================================================== */
const FIXTURE_TICKS = 120;      // 2 sim-seconds of driving
const mkFixtureBody = (): Player => {
  const attrs = randomPlayer(new Rng(4242), 'MF');
  const p = new Player(0 as Side, 2, 'MF', 'FIX', attrs);
  p.pos = { x: 0, y: 0 };
  p.vel = { x: 0, y: 0 };
  p.heading = { x: 1, y: 0 };
  p.stamina = 1;
  return p;
};
const driveFixture = (faceOff: boolean): { dist: number; heading: [number, number] } => {
  const p = mkFixtureBody();
  const tx = 100;   // the target: straight down +x, far enough never to be reached
  const ty = 0;
  for (let t = 0; t < FIXTURE_TICKS; t++) {
    const dx = tx - p.pos.x;
    const dy = ty - p.pos.y;
    const dl = Math.sqrt(dx * dx + dy * dy);
    p.desiredVel = { x: (dx / dl) * p.topSpeed, y: (dy / dl) * p.topSpeed };
    /* the ONLY difference between the two bodies: one is told to FACE 90° off its velocity */
    p.faceTarget = faceOff ? { x: p.pos.x, y: p.pos.y + 50 } : null;
    p.physicsStep(DT);
  }
  return { dist: p.pos.x, heading: [p.heading.x, p.heading.y] };
};
const FIX_FREE = driveFixture(false);
const FIX_FACED = driveFixture(true);
const FACING_DISTANCE_RATIO = FIX_FACED.dist / FIX_FREE.dist;
/** the coupling fixture's own assertions: the distance is BIT-IDENTICAL, and the fixture is
 *  ALIVE (the faced body's heading really did leave the movement direction). */
fx('costOfFacing.distanceBitIdentical', FIX_FACED.dist === FIX_FREE.dist, true);
fx('costOfFacing.ratioIsExactlyOne', FACING_DISTANCE_RATIO === 1, true);
fx('costOfFacing.fixtureIsAlive.freeBodyFacesItsVelocity',
  Math.abs(FIX_FREE.heading[0] - 1) < 1e-9 && Math.abs(FIX_FREE.heading[1]) < 1e-9, true);
/** the faced body's heading must have LEFT its movement direction (+x) — it is driven to a
 *  point 50 m abeam, re-aimed every tick, so it ends up ≈ 90° off. The assertion is the
 *  ANGLE, not an exact vector: the aim point is taken at the START of the tick and the body
 *  advances a few centimetres inside it, so the converged heading is 90° plus a hair. */
const FACED_HEADING_OFF_VELOCITY_RAD = cueAngle(
  0, 0, FIX_FACED.heading[0], FIX_FACED.heading[1], 1, 0,
);
fx('costOfFacing.fixtureIsAlive.facedBodyTurnedAway',
  FACED_HEADING_OFF_VELOCITY_RAD > 1.5, true);
fx('costOfFacing.bodyActuallyMoved', FIX_FREE.dist > 5, true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 gCueChannel — THE CHANNEL FIXTURE (the CELL reads external state only)    */
/* ========================================================================== */
/**
 * ⭐⭐ TWO CARRIERS, IDENTICAL EXTERNAL STATE, DIFFERENT PRIVATE TARGETS. The census's right
 * is to read the truth record for LABELLING only; the CELL must be blind to it. This fixture
 * builds two carriers with the SAME `pos`/`heading`/`vel` and DIFFERENT private commitments,
 * and asserts the CELL VECTOR (speed bin × angular-speed bin × rank, per mate) is
 * byte-identical. The NEGATIVE half: a REVERSED external heading DOES move it.
 */
const CH_MATES: readonly [number, number][] = [[10, 0], [3, 7], [-4, 2], [0, -9], [6, -6]];
const CH_GIDS = [1, 2, 3, 4, 5];
const cellVector = (
  px: number, py: number, hx: number, hy: number, vx: number, vy: number,
  prevHx: number, prevHy: number,
): number[] => {
  const theta = CH_MATES.map(([mx, my]) => cueAngle(px, py, hx, hy, mx, my));
  const si = edgeBinOf(Math.sqrt(vx * vx + vy * vy), SPEED_EDGES);
  const ai = edgeBinOf(angSpeedOf(prevHx, prevHy, hx, hy, DT), ANG_EDGES);
  return theta.map((_, i) => CELL_OF(si, ai, RI_OF(rankOf(theta, CH_GIDS, i))));
};
const CH_A = {
  pos: { x: 1, y: 2 }, heading: { x: 0.6, y: 0.8 }, vel: { x: 2.5, y: -1 },
  prevHeading: { x: 0.7, y: 0.714142842854285 },
  faceTarget: { x: 10, y: 0 }, privateTargetGid: 3, privateReadyTick: 411,
};
const CH_B = {
  pos: { x: 1, y: 2 }, heading: { x: 0.6, y: 0.8 }, vel: { x: 2.5, y: -1 },
  prevHeading: { x: 0.7, y: 0.714142842854285 },
  faceTarget: { x: -4, y: 2 }, privateTargetGid: 5, privateReadyTick: 903,
};
const cellVecA = cellVector(CH_A.pos.x, CH_A.pos.y, CH_A.heading.x, CH_A.heading.y,
  CH_A.vel.x, CH_A.vel.y, CH_A.prevHeading.x, CH_A.prevHeading.y);
const cellVecB = cellVector(CH_B.pos.x, CH_B.pos.y, CH_B.heading.x, CH_B.heading.y,
  CH_B.vel.x, CH_B.vel.y, CH_B.prevHeading.x, CH_B.prevHeading.y);
const cellVecRevHeading = cellVector(CH_A.pos.x, CH_A.pos.y, -CH_A.heading.x, -CH_A.heading.y,
  CH_A.vel.x, CH_A.vel.y, CH_A.prevHeading.x, CH_A.prevHeading.y);
const cellVecFastVel = cellVector(CH_A.pos.x, CH_A.pos.y, CH_A.heading.x, CH_A.heading.y,
  7, 0, CH_A.prevHeading.x, CH_A.prevHeading.y);
const CUE_CHANNEL_OK = JSON.stringify(cellVecA) === JSON.stringify(cellVecB)
  && JSON.stringify(cellVecA) !== JSON.stringify(cellVecRevHeading)
  && JSON.stringify(cellVecA) !== JSON.stringify(cellVecFastVel)
  && CH_A.faceTarget.x !== CH_B.faceTarget.x
  && CH_A.privateTargetGid !== CH_B.privateTargetGid
  && CH_A.privateReadyTick !== CH_B.privateReadyTick;

/* ========================================================================== */
/* §9 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed)   */
/* ========================================================================== */
const LABELS = ['carry', 'windup'] as const;
type Label = (typeof LABELS)[number];
const LI = (l: Label): number => LABELS.indexOf(l);
const NLAB = LABELS.length;
const INSTANTS = ['arm', 'last'] as const;
type Instant = (typeof INSTANTS)[number];
const NINST = INSTANTS.length;
const TURN_BIN_DEG = 5;
const TURN_BINS = 36;                  // the turn-to-face-the-passer, 0–180° in 5° bins
const TT_BIN = 1;
const TT_BINS = 31;                    // turnTicks 0–29, last is overflow
const TTMW_BIN = 1;
const TTMW_BINS = 41;                  // (turnTicks − W) signed, centre bin holds 0
const W_BIN_TICKS = 1;
const W_BINS = 32;                     // W 0–30 ticks, last is overflow
/** the FROZEN FLOOR for the `bestCell` report (a REPORTED face, never the licence rule) */
const BEST_CELL_MIN_N = 1000;

/* ========================================================================== */
/* §10 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii)) */
/* ========================================================================== */
interface Row {
  worldOk: boolean; armedVersion: number; rcFlagOff: boolean; geneAbsent: boolean;
  genomeClean: boolean;
  ticks: number; matches: number; wallMs: number;
  /* ⭐⭐ (a) THE PER-TICK BASE COUNTS — independent of me, so P(windup | carrying tick)
     re-derives WITHOUT the mate multiplicity */
  carryTicks: number; windupTicks: number; carryTicksPressed: number;
  speedBinsByLabel: number[][];        // [LABEL][NSPEED]  — per TICK
  angBinsByLabel: number[][];          // [LABEL][NANG]    — per TICK
  mateSumByLabel: number[];            // [LABEL] Σ over ticks of the finite-mate count
  /* ⭐⭐ (a) THE DETECTOR TABLE — per CELL, per (tick × mate) */
  cellTicks: number[]; cellWindup: number[]; cellWindupTargetMe: number[];
  /* ⭐⭐ (b) THE TARGET'S FACING GEOMETRY, per wind-up flight, per INSTANT */
  facingN: number[];                   // [INSTANT]
  sectorBins: number[][];              // [INSTANT][3]
  turnDegSum: number[]; turnDegBins: number[][];   // [INSTANT], [INSTANT][TURN_BINS]
  turnTicksN: number; turnTicksSum: number; turnTicksBins: number[];
  turnCompletable: number; turnMinusWBins: number[];
  wSum: number; wN: number; wBins: number[];
  actArm: number[];                    // the target's action.type at t0 (RC-C0's face)
  /* context (the 240 s match clock) */
  windupsArmed: number; windupsReleased: number;
  goals: number; passes: number; passesCompleted: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: 0, rcFlagOff: false, geneAbsent: false, genomeClean: false,
  ticks: 0, matches: 1, wallMs: 0,
  carryTicks: 0, windupTicks: 0, carryTicksPressed: 0,
  speedBinsByLabel: zeros2(NLAB, NSPEED), angBinsByLabel: zeros2(NLAB, NANG),
  mateSumByLabel: zeros(NLAB),
  cellTicks: zeros(NCELL), cellWindup: zeros(NCELL), cellWindupTargetMe: zeros(NCELL),
  facingN: zeros(NINST), sectorBins: zeros2(NINST, 3),
  turnDegSum: zeros(NINST), turnDegBins: zeros2(NINST, TURN_BINS),
  turnTicksN: 0, turnTicksSum: 0, turnTicksBins: zeros(TT_BINS),
  turnCompletable: 0, turnMinusWBins: zeros(TTMW_BINS),
  wSum: 0, wN: 0, wBins: zeros(W_BINS),
  actArm: zeros(NACT),
  windupsArmed: 0, windupsReleased: 0,
  goals: 0, passes: 0, passesCompleted: 0,
});

/* ========================================================================== */
/* §11 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER     */
/* ========================================================================== */
interface FacingInstant { sector: BodySector; turnRad: number }
interface Windup {
  key: string; t0: number; gid: number; targetGid: number; readyTick: number;
  actArm: string;
  atArm: FacingInstant | null; atLast: FacingInstant | null;
}

const walkMatch = (m: Match, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  row.armedVersion = raArmedVersion(m);
  row.worldOk = row.armedVersion === RA_WORLD_VERSION;
  row.rcFlagOff = (m as unknown as { rcAnticipate: boolean }).rcAnticipate === false;
  row.geneAbsent = ([0, 1] as const).every(
    (s) => rcAnticipationWeightOf(m.teams[s].info.genome) === null,
  );
  row.genomeClean = ([0, 1] as const).every((s) => {
    const f = m.teams[s].info.genome as TacticalGenome & { raAccessWeight?: number };
    return f.raAccessWeight === undefined && f.passLeadSupport === undefined
      && f.dvExposureWeight === undefined && f.rcAnticipationWeight === undefined;
  });
  const mm = m as unknown as {
    pendingPassWindup: { gid: number; readyTick: number; targetGid: number } | null;
  };
  const players = m.allPlayers;
  const prevHx = players.map((p) => p.heading.x);
  const prevHy = players.map((p) => p.heading.y);
  let wu: Windup | null = null;

  /** book a wind-up's (b) faces at its END (the whole observed wind-up population) */
  const bookWindup = (w: Windup): void => {
    row.actArm[AI(w.actArm)] += 1;
    const W = w.readyTick - w.t0;
    row.wSum += W; row.wN += 1;
    row.wBins[binOf(W, W_BIN_TICKS, W_BINS)] += 1;
    const at: [Instant, FacingInstant | null][] = [['arm', w.atArm], ['last', w.atLast]];
    for (const [inst, fi] of at) {
      if (fi === null) continue;
      const ii = INSTANTS.indexOf(inst);
      row.facingN[ii] += 1;
      row.sectorBins[ii][SI_OF(fi.sector)] += 1;
      const deg = fi.turnRad * 180 / Math.PI;
      row.turnDegSum[ii] += deg;
      row.turnDegBins[ii][binOf(deg, TURN_BIN_DEG, TURN_BINS)] += 1;
    }
    /* ⭐ the TURN'S COST IN TICKS against the window, read at the ARM instant t0 */
    if (w.atArm !== null) {
      const tt = turnTicksOf(w.atArm.turnRad);
      row.turnTicksN += 1;
      row.turnTicksSum += tt;
      row.turnTicksBins[binOf(tt, TT_BIN, TT_BINS)] += 1;
      if (tt <= W) row.turnCompletable += 1;
      row.turnMinusWBins[signedBinOf(tt - W, TTMW_BIN, TTMW_BINS)] += 1;
    }
  };

  while (!m.finished) {
    m.step(DT);
    row.ticks += 1;
    if (!observe) continue;
    const tick = m.simTick;
    const ball = m.ball;
    const rec = mm.pendingPassWindup;

    /* ---------- (a) THE CARRYING TICK, ITS LABEL AND ITS CELLS ---------- */
    const owner = ball.owner;
    if (m.phase === 'playing' && owner !== null && !owner.sentOff) {
      const isWindup = rec !== null && rec.gid === owner.gid && tick < rec.readyTick;
      const li = LI(isWindup ? 'windup' : 'carry');
      row.carryTicks += 1;
      if (isWindup) row.windupTicks += 1;
      /* THE PRESSED BIT, REPORTED beside — the engine's own cut, at the ball */
      let nearestOpp = Infinity;
      for (const o of m.teams[1 - owner.side].players) {
        if (o.sentOff) continue;
        const d = Math.hypot(o.pos.x - ball.pos.x, o.pos.y - ball.pos.y);
        if (d < nearestOpp) nearestOpp = d;
      }
      if (nearestOpp <= TOUCH_CONTROL_DIST) row.carryTicksPressed += 1;
      /* THE EXTERNAL CELL — the owner's SPEED, his heading's ANGULAR SPEED, my RANK */
      const speed = Math.hypot(owner.vel.x, owner.vel.y);
      const si = edgeBinOf(speed, SPEED_EDGES);
      const angSpeed = angSpeedOf(
        prevHx[owner.gid], prevHy[owner.gid], owner.heading.x, owner.heading.y, DT,
      );
      const ai = Number.isFinite(angSpeed) ? edgeBinOf(angSpeed, ANG_EDGES) : -1;
      row.speedBinsByLabel[li][si] += 1;
      if (ai >= 0) row.angBinsByLabel[li][ai] += 1;
      if (ai >= 0) {
        const gids: number[] = [];
        const theta: number[] = [];
        for (const q of players) {
          if (q.side !== owner.side || q.gid === owner.gid || q.sentOff) continue;
          gids.push(q.gid);
          theta.push(cueAngle(
            owner.pos.x, owner.pos.y, owner.heading.x, owner.heading.y, q.pos.x, q.pos.y,
          ));
        }
        for (let i = 0; i < gids.length; i++) {
          const r = rankOf(theta, gids, i);
          if (r < 0) continue;             // a degenerate bearing names no cell: EXCLUDED
          row.mateSumByLabel[li] += 1;
          const idx = CELL_OF(si, ai, RI_OF(r));
          row.cellTicks[idx] += 1;
          if (isWindup) {
            row.cellWindup[idx] += 1;
            if (rec !== null && rec.targetGid === gids[i]) row.cellWindupTargetMe[idx] += 1;
          }
        }
      }
    }

    /* ---------- (b) THE WIND-UP RECORD: arm · observe · end ---------- */
    const key = rec === null ? null : `${rec.gid}:${rec.readyTick}:${rec.targetGid}`;
    if (wu !== null && key !== wu.key) { bookWindup(wu); wu = null; }
    if (rec !== null && wu === null) {
      row.windupsArmed += 1;
      wu = {
        key: key as string, t0: tick, gid: rec.gid, targetGid: rec.targetGid,
        readyTick: rec.readyTick,
        actArm: players[rec.targetGid].action.type as string,
        atArm: null, atLast: null,
      };
    }
    if (wu !== null && rec !== null && tick < wu.readyTick) {
      /* ⭐⭐ THE FACING GEOMETRY at a PRE-RELEASE tick — the target's body vs the passer */
      const passer = players[wu.gid];
      const target = players[wu.targetGid];
      const turnRad = cueAngle(
        target.pos.x, target.pos.y, target.heading.x, target.heading.y,
        passer.pos.x, passer.pos.y,
      );
      if (Number.isFinite(turnRad)) {
        const fi: FacingInstant = {
          sector: sectorFacing(
            target.pos.x, target.pos.y, target.heading.x, target.heading.y,
            target.coreRadius, passer.pos.x, passer.pos.y,
          ),
          turnRad,
        };
        if (wu.atArm === null && tick === wu.t0) wu.atArm = fi;
        wu.atLast = fi;
      }
      if (tick + 1 === wu.readyTick) row.windupsReleased += 1;
    }

    for (const p of players) { prevHx[p.gid] = p.heading.x; prevHy[p.gid] = p.heading.y; }
  }
  if (wu !== null) bookWindup(wu);
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<string, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §12 THE LOCKSTEP RECEIPT — NO WRAPPER; the observation reads are BYTE-INERT  */
/* ========================================================================== */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
banner('RC-C0b — the lockstep receipt (observed vs unobserved; the instrument installs NO wrapper)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} scratch walks)`);

/* ========================================================================== */
/* §13 THE BATTERY — the two arms PAIRED on shared seeds                       */
/* ========================================================================== */
interface Cell { seed: number; E: Row; D: Row }
const cells: Cell[] = [];
banner(`RC-C0b — the battery: ${N} PAIRED seeds × 2 arms of WORLD 12, seeds `
  + `${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    cells.push({
      seed,
      E: walkMatch(buildMatch(seed, 'E'), true),
      D: walkMatch(buildMatch(seed, 'D'), true),
    });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `walked (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
/** the world-construction receipt: one walk per arm on its own seed (booked = walked) */
const receiptRows: Record<Arm, Row> = {
  E: walkMatch(buildMatch(RECEIPT_SEED, 'E'), true),
  D: walkMatch(buildMatch(RECEIPT_SEED, 'D'), true),
};
const walksBooked = cells.length * ARMS.length + ARMS.length;

/* ========================================================================== */
/* §14 THE ESTIMATOR — CLUSTER BOOTSTRAP over match seeds (consumes NO stats)   */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef {
  arm: Arm; unit: string; what: string; den: string;
  num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, arm: Arm, unit: string, what: string, den: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { arm, unit, what, den, num, dn }; };
/** ⭐⭐ THE FROZEN CELL FAMILY F (§P.C): the TOP angular-speed bin ∧ RANK 1 —
 *  「he is turning onto me」. The top angular-speed bin is [4, TURN_RATE] rad/s (the
 *  engine's own turn cap is 6.5, so this bin is "turning at 60 %+ of the maximum a body
 *  can turn"), and rank 1 is RC-C0 §P.A's own argmin. */
const F_CELLS: number[] = [];
for (let si = 0; si < NSPEED; si++) F_CELLS.push(CELL_OF(si, NANG - 1, 0));
const inF = (idx: number): boolean => F_CELLS.includes(idx);
const sumCells = (xs: readonly number[], pick: (i: number) => boolean): number => {
  let t = 0;
  for (let i = 0; i < xs.length; i++) if (pick(i)) t += xs[i];
  return t;
};
fx('familyF.size', F_CELLS.length, NSPEED);
fx('familyF.isTopAngBinAndRank1', F_CELLS.map((i) => i % NRANK), zeros(NSPEED));
fx('familyF.allInTopAngBin',
  F_CELLS.map((i) => Math.floor(i / NRANK) % NANG), zeros(NSPEED).map(() => NANG - 1));

for (const arm of ARMS) {
  /* --- the BASE RATE and the population --- */
  defFace(`${arm}.baseRate`, arm, 'share',
    '⭐⭐ (a) THE BASE RATE P(a wind-up is live | this is a carrying tick) — per TICK, '
    + 'independent of any observer',
    'open-play carrying ticks', (r) => r.windupTicks, (r) => r.carryTicks);
  defFace(`${arm}.carryTicksPerMatch`, arm, 'ticks per match (240 s match clock)',
    '(a) open-play carrying ticks per match', 'matches walked',
    (r) => r.carryTicks, (r) => r.matches);
  defFace(`${arm}.windupTicksPerMatch`, arm, 'ticks per match (240 s match clock)',
    '(a) wind-up (pre-release) carrying ticks per match', 'matches walked',
    (r) => r.windupTicks, (r) => r.matches);
  defFace(`${arm}.pressedCarrierShare`, arm, 'share',
    '⭐ REPORTED — the share of carrying ticks with a PRESSED carrier (the engine\'s own '
    + 'cut: an opponent inside TOUCH_CONTROL_DIST of the ball), so the commander can see '
    + 'whether PRESSURE is a cheaper cue than the body',
    'open-play carrying ticks', (r) => r.carryTicksPressed, (r) => r.carryTicks);
  defFace(`${arm}.mateTicksPerCarryTick`, arm, 'mates per carrying tick',
    '(a) THE MATE MULTIPLICITY — Σ finite-ranked mates ÷ carrying ticks (the factor that '
    + 'separates the per-TICK tier from the per-CELL tier)',
    'open-play carrying ticks',
    (r) => sum(r.mateSumByLabel), (r) => r.carryTicks);
  /* --- THE FROZEN FAMILY F --- */
  defFace(`${arm}.pWindupGivenF`, arm, 'share',
    '⭐⭐ (a) P(a wind-up is live | THE FROZEN FAMILY F = the TOP angular-speed bin ∧ rank 1 '
    + '— 「he is turning onto me」). Per (tick × mate).',
    '(carrying tick × mate) pairs falling in F',
    (r) => sumCells(r.cellWindup, inF), (r) => sumCells(r.cellTicks, inF));
  defFace(`${arm}.coverageF`, arm, 'share',
    '⭐⭐ (a) THE COVERAGE OF F — the share of ALL (wind-up tick × TARGET mate) pairs that '
    + 'fall in F; the limb\'s SENSITIVITY, i.e. how often the family would fire at all',
    '(wind-up tick × target mate) pairs',
    (r) => sumCells(r.cellWindupTargetMe, inF), (r) => sum(r.cellWindupTargetMe));
  defFace(`${arm}.precisionTargetGivenF`, arm, 'share',
    '⭐⭐ (a) THE PRECISION FOR THE TARGET — P(the target is me | F ∧ a wind-up is live)',
    '(wind-up tick × mate) pairs in F',
    (r) => sumCells(r.cellWindupTargetMe, inF), (r) => sumCells(r.cellWindup, inF));
  defFace(`${arm}.pWindupTargetMeGivenF`, arm, 'share',
    '(a) P(a wind-up is live ∧ the target is me | F)',
    '(carrying tick × mate) pairs falling in F',
    (r) => sumCells(r.cellWindupTargetMe, inF), (r) => sumCells(r.cellTicks, inF));
  defFace(`${arm}.pWindupGivenAllCells`, arm, 'share',
    '(a) P(a wind-up is live | ANY cell) — the per-(tick × mate) base rate the LIFT is '
    + 'taken against on the CELL tier (⚠ NOT the licence rule\'s per-TICK base rate)',
    'all (carrying tick × mate) pairs',
    (r) => sum(r.cellWindup), (r) => sum(r.cellTicks));
  /* --- the AXIS MARGINALS --- */
  for (let si = 0; si < NSPEED; si++) {
    defFace(`${arm}.marginal.speed${si}`, arm, 'share',
      `(a) P(wind-up | carrier SPEED bin ${si}) over all (tick × mate) pairs`,
      `(tick × mate) pairs in speed bin ${si}`,
      (r) => sumCells(r.cellWindup, (i) => Math.floor(i / (NANG * NRANK)) === si),
      (r) => sumCells(r.cellTicks, (i) => Math.floor(i / (NANG * NRANK)) === si));
    defFace(`${arm}.tickShare.speed${si}.windup`, arm, 'share',
      `⭐ REPORTED — the carrier's SPEED distribution on WIND-UP ticks, bin ${si} (per TICK)`,
      'wind-up carrying ticks',
      (r) => r.speedBinsByLabel[LI('windup')][si], (r) => sum(r.speedBinsByLabel[LI('windup')]));
    defFace(`${arm}.tickShare.speed${si}.carry`, arm, 'share',
      `⭐ REPORTED — the carrier's SPEED distribution on CARRY (non-wind-up) ticks, bin ${si}`,
      'carry (non-wind-up) carrying ticks',
      (r) => r.speedBinsByLabel[LI('carry')][si], (r) => sum(r.speedBinsByLabel[LI('carry')]));
  }
  for (let ai = 0; ai < NANG; ai++) {
    defFace(`${arm}.marginal.ang${ai}`, arm, 'share',
      `(a) P(wind-up | carrier heading ANGULAR-SPEED bin ${ai}) over all (tick × mate) pairs`,
      `(tick × mate) pairs in angular-speed bin ${ai}`,
      (r) => sumCells(r.cellWindup, (i) => Math.floor(i / NRANK) % NANG === ai),
      (r) => sumCells(r.cellTicks, (i) => Math.floor(i / NRANK) % NANG === ai));
    defFace(`${arm}.tickShare.ang${ai}.windup`, arm, 'share',
      `⭐ REPORTED — the carrier's ANGULAR-SPEED distribution on WIND-UP ticks, bin ${ai}`,
      'wind-up carrying ticks',
      (r) => r.angBinsByLabel[LI('windup')][ai], (r) => sum(r.angBinsByLabel[LI('windup')]));
    defFace(`${arm}.tickShare.ang${ai}.carry`, arm, 'share',
      `⭐ REPORTED — the carrier's ANGULAR-SPEED distribution on CARRY ticks, bin ${ai}`,
      'carry (non-wind-up) carrying ticks',
      (r) => r.angBinsByLabel[LI('carry')][ai], (r) => sum(r.angBinsByLabel[LI('carry')]));
  }
  for (let ri = 0; ri < NRANK; ri++) {
    defFace(`${arm}.marginal.rank${ri}`, arm, 'share',
      `(a) P(wind-up | my alignment RANK ${ri + 1}${ri === NRANK - 1 ? '+' : ''}) over all `
      + '(tick × mate) pairs',
      `(tick × mate) pairs at rank ${ri + 1}`,
      (r) => sumCells(r.cellWindup, (i) => i % NRANK === ri),
      (r) => sumCells(r.cellTicks, (i) => i % NRANK === ri));
    defFace(`${arm}.marginalTargetMe.rank${ri}`, arm, 'share',
      `(a) P(wind-up ∧ the target is me | my alignment RANK ${ri + 1}`
      + `${ri === NRANK - 1 ? '+' : ''})`,
      `(tick × mate) pairs at rank ${ri + 1}`,
      (r) => sumCells(r.cellWindupTargetMe, (i) => i % NRANK === ri),
      (r) => sumCells(r.cellTicks, (i) => i % NRANK === ri));
  }
  /* --- (b) THE TARGET'S FACING GEOMETRY --- */
  for (let ii = 0; ii < NINST; ii++) {
    const inst = INSTANTS[ii];
    const IN = inst === 'arm' ? 'AtArm' : 'AtLast';
    for (const s of SECTORS) {
      defFace(`${arm}.facing.${s}Share${IN}`, arm, 'share',
        `⭐⭐ (b) the share of wind-ups whose TARGET would meet the ball on his \`${s}\` `
        + `sector at the ${inst === 'arm' ? 'ARM tick t0' : 'LAST pre-release tick'} — the `
        + 'BK law\'s OWN classifier CALLED with his heading and the passer→target approach',
        `wind-ups with a defined facing read at the ${inst} instant`,
        (r) => r.sectorBins[ii][SI_OF(s)], (r) => r.facingN[ii]);
    }
    defFace(`${arm}.facing.turnMeanDeg${IN}`, arm, 'degrees',
      `⭐ (b) the TURN the target would need to FACE THE PASSER at the ${inst} instant (the `
      + 'angle between his heading and the bearing target→passer); bins stored',
      `wind-ups with a defined facing read at the ${inst} instant`,
      (r) => r.turnDegSum[ii], (r) => r.facingN[ii]);
  }
  defFace(`${arm}.facing.turnTicksMean`, arm, 'ticks',
    `⭐ (b) the TICKS that turn needs at TURN_RATE·DT (ceil), read at the ARM instant t0; `
    + 'bins stored', 'wind-ups with a defined facing read at the arm instant',
    (r) => r.turnTicksSum, (r) => r.turnTicksN);
  defFace(`${arm}.facing.turnCompletableInWShare`, arm, 'share',
    '⭐⭐ (b) THE ROOM: the share of targets whose turn-to-face could COMPLETE inside the '
    + 'window W = readyTick − t0 (turnTicks ≤ W); the distribution of turnTicks − W is stored',
    'wind-ups with a defined facing read at the arm instant',
    (r) => r.turnCompletable, (r) => r.turnTicksN);
  defFace(`${arm}.window.wMeanTicks`, arm, 'ticks',
    '(b) W — the wind-up length (readyTick − t0); bins stored', 'wind-ups observed',
    (r) => r.wSum, (r) => r.wN);
  defFace(`${arm}.window.wMeanSimSeconds`, arm, 'sim-seconds',
    '(b) W on the SIM clock (1 sim-s = 60 ticks = 22.5 display-s)', 'wind-ups observed',
    (r) => r.wSum * DT, (r) => r.wN);
  /* --- the TARGET'S ACTION at t0 (RC-C0's face, for continuity) --- */
  for (const a of ['ReceivePass', 'ChaseBall', 'SupportBallCarrier', 'MakeRun',
    'MoveToFormationSpot', 'HoldPosition'] as const) {
    defFace(`${arm}.actionShareAtArm.${a}`, arm, 'share',
      `REPORTED (RC-C0's face, for continuity) — the share of wind-ups whose target was `
      + `running \`${a}\` at the ARM tick t0`, 'wind-ups observed',
      (r) => r.actArm[AI(a)], (r) => sum(r.actArm));
  }
  /* --- CONTEXT --- */
  defFace(`${arm}.context.windupsArmedPerMatch`, arm, 'arms per match (240 s match clock)',
    'context — wind-ups ARMED (cancellations included)', 'matches walked',
    (r) => r.windupsArmed, (r) => r.matches);
  defFace(`${arm}.context.windupsReleasedPerMatch`, arm,
    'releases per match (240 s match clock)',
    'context — wind-ups that reached their last pre-release tick', 'matches walked',
    (r) => r.windupsReleased, (r) => r.matches);
  defFace(`${arm}.context.goalsPerMatch`, arm, 'goals per match (240 s match clock)',
    'context — goals', 'matches walked', (r) => r.goals, (r) => r.matches);
  defFace(`${arm}.context.groundPassesPerMatch`, arm,
    'passes per match (240 s match clock)', 'context — the engine\'s own pass count',
    'matches walked', (r) => r.passes, (r) => r.matches);
  defFace(`${arm}.context.passCompletion`, arm, 'share',
    'context — the engine\'s own whole-match pass completion (⚠ ALL deliveries)', 'passes',
    (r) => r.passesCompleted, (r) => r.passes);
}
/* --- THE FULL CELL TABLE, published as a face per cell (counts + P) --- */
for (const arm of ARMS) {
  for (let idx = 0; idx < NCELL; idx++) {
    defFace(`${arm}.cell.${idx}.pWindup`, arm, 'share',
      `(a) P(wind-up | cell ${idx} = speed bin ${Math.floor(idx / (NANG * NRANK))} × `
      + `angular-speed bin ${Math.floor(idx / NRANK) % NANG} × rank ${(idx % NRANK) + 1})`,
      `(carrying tick × mate) pairs in cell ${idx}`,
      (r) => r.cellWindup[idx], (r) => r.cellTicks[idx]);
  }
}

const FACE_KEYS = Object.keys(FACES).sort();
interface FaceRow {
  face: string; arm: Arm; unit: string; what: string; denNote: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
const faces: FaceRow[] = FACE_KEYS.map((key) => {
  const f = FACES[key];
  const nu = cells.map((c) => f.num(c[f.arm]));
  const de = cells.map((c) => f.dn(c[f.arm]));
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
    face: key, arm: f.arm, unit: f.unit, what: f.what, denNote: f.den,
    value: point, numerator: sum(nu), denominator: sum(de),
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
  };
});
const face = (k: string): FaceRow => {
  const f = faces.find((x) => x.face === k);
  if (f === undefined) { banner(`RC-C0b FATAL — unknown face ${k}`); process.exit(3); }
  return f as FaceRow;
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
  const nl = cells.map((c) => fl.num(c[fl.arm]));
  const dl = cells.map((c) => fl.dn(c[fl.arm]));
  const nr = cells.map((c) => fr.num(c[fr.arm]));
  const dr = cells.map((c) => fr.dn(c[fr.arm]));
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
  /* ⭐⭐ THE LICENCE RULE'S OWN Δ, per arm (the EMPTY-BOOK arm is the RULE; the DOSED arm
     is REPORTED beside and is NEVER gated) */
  ['deltaF.E', 'E.pWindupGivenF', 'E.baseRate'],
  ['deltaF.D', 'D.pWindupGivenF', 'D.baseRate'],
  /* the LIFT of F over the CELL-tier base rate, published beside (both arms) */
  ['liftF.cellTier.E', 'E.pWindupGivenF', 'E.pWindupGivenAllCells'],
  ['liftF.cellTier.D', 'D.pWindupGivenF', 'D.pWindupGivenAllCells'],
  /* the rank-1 marginal against the cell-tier base rate — the alignment axis alone */
  ['rank1VsCellBase.E', 'E.marginal.rank0', 'E.pWindupGivenAllCells'],
  ['rank1VsCellBase.D', 'D.marginal.rank0', 'D.pWindupGivenAllCells'],
  /* the top angular-speed marginal alone — the turning axis alone */
  ['topAngVsCellBase.E', `E.marginal.ang${NANG - 1}`, 'E.pWindupGivenAllCells'],
  ['topAngVsCellBase.D', `D.marginal.ang${NANG - 1}`, 'D.pWindupGivenAllCells'],
  /* ⭐ (b) THE EMPTY-BOOK vs DOSED CONTRASTS, PAIRED ON SEEDS (reported, never gated) */
  ['frontShareAtLast.DminusE', 'D.facing.frontShareAtLast', 'E.facing.frontShareAtLast'],
  ['sideShareAtLast.DminusE', 'D.facing.sideShareAtLast', 'E.facing.sideShareAtLast'],
  ['backShareAtLast.DminusE', 'D.facing.backShareAtLast', 'E.facing.backShareAtLast'],
  ['frontShareAtArm.DminusE', 'D.facing.frontShareAtArm', 'E.facing.frontShareAtArm'],
  ['turnMeanDegAtLast.DminusE', 'D.facing.turnMeanDegAtLast', 'E.facing.turnMeanDegAtLast'],
  ['turnCompletableInWShare.DminusE',
    'D.facing.turnCompletableInWShare', 'E.facing.turnCompletableInWShare'],
  ['baseRate.DminusE', 'D.baseRate', 'E.baseRate'],
  ['wMeanTicks.DminusE', 'D.window.wMeanTicks', 'E.window.wMeanTicks'],
  ['pressedCarrierShare.DminusE', 'D.pressedCarrierShare', 'E.pressedCarrierShare'],
];
const deltas = CONTRASTS.map(([k, l, r]) => contrast(k, l, r));
const delta = (k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k);
  if (d === undefined) { banner(`RC-C0b FATAL — unknown contrast ${k}`); process.exit(3); }
  return d as DeltaRow;
};

/* ========================================================================== */
/* §15 THE PRE-COMMITTED LICENCE RULE (§P.C) — FROZEN IN EXACT FORM             */
/* ========================================================================== */
/**
 * ⭐⭐ THE RULE, FROZEN AT §P.C BEFORE ANY BATTERY SEED, carrying #371 item 5's ONE
 * PRE-COMMITMENT, in exact form:
 *
 *   LICENSED ⇔ the 95 % cluster-bootstrap CI of Δ_F = P(wind-up | F) − P(wind-up | carrying
 *              tick) lies ENTIRELY ABOVE ZERO (ciLo > 0) on the EMPTY-BOOK arm (the exam
 *              form).
 *   BLOCKED  ⇔ otherwise (the interval contains zero, or lies entirely below it) — the
 *              receiver cannot tell a wind-up from a dribble by the body alone, and the
 *              facing limb RETURNS TO THE COMMANDER with the look and the offer channel
 *              named.
 *
 * The DOSED arm's Δ_F is REPORTED beside (the user's form) and is NEVER gated. The verdict
 * WORD is printed FROM the rule. This census adjudicates nothing else — the commander rules.
 */
const licE = delta('deltaF.E');
const licD = delta('deltaF.D');
const LICENCE: 'LICENSED' | 'BLOCKED' = licE.ciLo > 0 ? 'LICENSED' : 'BLOCKED';
const LICENCE_READING = LICENCE === 'LICENSED'
  ? 'THE FROZEN FAMILY F IDENTIFIES A LIVE WIND-UP RESOLVEDLY ABOVE THE BASE RATE on the '
    + 'EMPTY-BOOK arm — the READY limb has an honest PRE-STRIKE percept to believe on. Its '
    + 'COVERAGE and its PRECISION for the target are published beside and are NOT part of '
    + 'the rule. Per #371 item 5 the commander rules on what follows; this census '
    + 'adjudicates nothing else.'
  : 'THE FROZEN FAMILY F DOES NOT IDENTIFY A LIVE WIND-UP resolvedly above the base rate on '
    + 'the EMPTY-BOOK arm at this power — the receiver cannot tell a wind-up from a dribble '
    + 'by the passer\'s body alone. Per #371 item 5\'s pre-commitment the FACING LIMB RETURNS '
    + 'TO THE COMMANDER with the look (the O2 scan, built and unwired) and the OFFER CHANNEL '
    + '(要球) NAMED as the alternatives.';
/** ⭐ THE BEST CELL, REPORTED (never a rule): the cell with the highest P(wind-up | cell)
 *  among cells with n ≥ the FROZEN FLOOR of 1,000 (tick × mate) pairs, on the EMPTY-BOOK arm. */
const bestCellOf = (arm: Arm): {
  arm: Arm; cellIndex: number | null; speedBin: number; angBin: number; rank: number;
  pWindup: number; n: number; floor: number;
} => {
  let best = -1;
  let bestV = -Infinity;
  for (let idx = 0; idx < NCELL; idx++) {
    const f = face(`${arm}.cell.${idx}.pWindup`);
    if (f.denominator < BEST_CELL_MIN_N) continue;
    if (f.value > bestV) { bestV = f.value; best = idx; }
  }
  if (best < 0) {
    return { arm, cellIndex: null, speedBin: -1, angBin: -1, rank: -1,
      pWindup: Number.NaN, n: 0, floor: BEST_CELL_MIN_N };
  }
  const f = face(`${arm}.cell.${best}.pWindup`);
  return {
    arm, cellIndex: best,
    speedBin: Math.floor(best / (NANG * NRANK)),
    angBin: Math.floor(best / NRANK) % NANG,
    rank: (best % NRANK) + 1,
    pWindup: f.value, n: f.denominator, floor: BEST_CELL_MIN_N,
  };
};
const BEST_CELL: Record<Arm, ReturnType<typeof bestCellOf>> = {
  E: bestCellOf('E'), D: bestCellOf('D'),
};
/** ⭐⭐ (c) THE COST OF FACING — THE CODE FACT, FROZEN AT §P.E BEFORE ANY BATTERY SEED. */
const COST_OF_FACING = 'FACING THE PASSER WHILE DRIFTING IS FREE IN THIS ENGINE. '
  + '`Player.physicsStep` (src/sim/Player.ts) computes the velocity from `desiredVel` clamped '
  + 'by `topSpeed` and rate-limited by `accel · dt`, advances `pos` from `vel`, and ONLY THEN '
  + 'rotates `heading` toward `faceTarget` (or, absent one, the movement direction) at '
  + 'TURN_RATE — the heading is WRITTEN by that block and never READ back into `vel` or '
  + '`pos`. The shipped docstring states it in the source\'s own words: the body direction '
  + '"remains independent of velocity direction". A body whose heading is misaligned with its '
  + 'velocity does NOT move slower, does NOT accelerate less, and its velocity is NOT turned '
  + 'toward its heading. THE FIXTURE proves the magnitude: two identical bodies driven toward '
  + 'the same target for 120 ticks, one with `faceTarget` set 90° off its velocity, cover a '
  + 'BIT-IDENTICAL distance (ratio exactly 1). ⚠ THE REALISM GAP IS NAMED, NOT HIDDEN: '
  + 'VISION S11 (转身/低速/受压仍是胶水) — a real receiver who opens his body to the passer '
  + 'pays in pace and in the first step, and this engine charges him nothing.';

/* ========================================================================== */
/* §16 THE SIZING, SHOWN — the RC-C0 §15 house form, from THIS census's own smoke */
/* ========================================================================== */
/**
 * ⭐ THE HOUSE FORM (RC-C0 §15's own, byte for byte in substance):
 *   1  se(n)      = half-width(n) / z.975
 *   2  se(needed) = |target| / (z.975 + z.80)
 *   3  N          = ceil( n · (se(n) / se(needed))² )
 *   4  MDE(N)     = half-width(n) · sqrt(n/N) · (z.975 + z.80) / z.975
 * ⚠ IT ASSUMES the battery's per-seed cluster variance is the smoke's — 12 scratch clusters
 * is a NOISY variance estimate. Said here, BEFORE the battery. The smoke is DISCLOSED IN
 * FULL at the doc's §DEV-PREFLIGHT. Target 0.05 on BOTH pre-registered quantities: the
 * licence Δ_F (§P.C, the EMPTY-BOOK arm) and the (b) front-on share at the last
 * pre-release tick.
 */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised half-widths (seeds 900,002,200–211; §DEV-PREFLIGHT),
 *  read out of the smoke artifact's own `deltas[].halfWidth` / `faces[].halfWidth` fields —
 *  never re-typed from the console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'delta.deltaF.E', group: '(a) §P.C — THE LICENCE (the EMPTY-BOOK arm)',
    hwSmoke: 0.028115630379545453, target: 0.05 },
  { face: 'E.facing.frontShareAtLast', group: '(b) — THE FRONT-ON SHARE (empty book)',
    hwSmoke: 0.04429968819737651, target: 0.05 },
  { face: 'D.facing.frontShareAtLast', group: '(b) — THE FRONT-ON SHARE (dosed, beside)',
    hwSmoke: 0.05005827442744923, target: 0.05 },
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
/* §17 THE GATES (all liveness/receipt — NEVER direction)                      */
/* ========================================================================== */
const pooled: Record<Arm, {
  cellTicks: number[]; cellWindup: number[]; cellWindupTargetMe: number[];
  speedBinsByLabel: number[][]; angBinsByLabel: number[][];
  sectorBins: number[][]; turnDegBins: number[][];
  turnTicksBins: number[]; turnMinusWBins: number[]; wBins: number[]; actArm: number[];
}> = { E: null as never, D: null as never };
for (const arm of ARMS) {
  const p = {
    cellTicks: zeros(NCELL), cellWindup: zeros(NCELL), cellWindupTargetMe: zeros(NCELL),
    speedBinsByLabel: zeros2(NLAB, NSPEED), angBinsByLabel: zeros2(NLAB, NANG),
    sectorBins: zeros2(NINST, 3), turnDegBins: zeros2(NINST, TURN_BINS),
    turnTicksBins: zeros(TT_BINS), turnMinusWBins: zeros(TTMW_BINS),
    wBins: zeros(W_BINS), actArm: zeros(NACT),
  };
  for (const c of cells) {
    const r = c[arm];
    addInto(p.cellTicks, r.cellTicks); addInto(p.cellWindup, r.cellWindup);
    addInto(p.cellWindupTargetMe, r.cellWindupTargetMe);
    addInto2(p.speedBinsByLabel, r.speedBinsByLabel);
    addInto2(p.angBinsByLabel, r.angBinsByLabel);
    addInto2(p.sectorBins, r.sectorBins); addInto2(p.turnDegBins, r.turnDegBins);
    addInto(p.turnTicksBins, r.turnTicksBins); addInto(p.turnMinusWBins, r.turnMinusWBins);
    addInto(p.wBins, r.wBins); addInto(p.actArm, r.actArm);
  }
  pooled[arm] = p;
}
/** ⭐ the MEDIANS — bin-derived, so `gFaces` re-derives every one of them off disk */
const medianFor = (arm: Arm) => ({
  turnDegAtArm: binMedian(pooled[arm].turnDegBins[0], TURN_BIN_DEG, false),
  turnDegAtLast: binMedian(pooled[arm].turnDegBins[1], TURN_BIN_DEG, false),
  turnTicksAtArm: binMedian(pooled[arm].turnTicksBins, TT_BIN, false),
  turnTicksMinusW: binMedian(pooled[arm].turnMinusWBins, TTMW_BIN, true),
  wTicks: binMedian(pooled[arm].wBins, W_BIN_TICKS, false),
});
const medians = { E: medianFor('E'), D: medianFor('D') };

const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const totBy = (arm: Arm, pick: (r: Row) => number): number =>
  cells.reduce((a, c) => a + pick(c[arm]), 0);
/** ⭐⭐ gBaseRateConsistency — the two TIERS agree: the per-CELL counts collapsed over mates
 *  equal the per-TICK counts multiplied by the recorded mate multiplicity (`mateSumByLabel`),
 *  which is the exact form because the multiplicity varies with sendings-off. */
const baseRateTiers = ARMS.map((arm) => {
  const cellTicksTot = totBy(arm, (r) => sum(r.cellTicks));
  const cellWindupTot = totBy(arm, (r) => sum(r.cellWindup));
  const mateSumAll = totBy(arm, (r) => sum(r.mateSumByLabel));
  const mateSumWindup = totBy(arm, (r) => r.mateSumByLabel[LI('windup')]);
  const tickWindup = totBy(arm, (r) => r.windupTicks);
  const tickCarry = totBy(arm, (r) => r.carryTicks);
  const speedTickTot = totBy(arm, (r) => sum(r.speedBinsByLabel[0]) + sum(r.speedBinsByLabel[1]));
  return {
    arm, cellTicksTot, cellWindupTot, mateSumAll, mateSumWindup, tickWindup, tickCarry,
    speedTickTot,
    ok: cellTicksTot === mateSumAll && cellWindupTot === mateSumWindup
      && speedTickTot === tickCarry && tickWindup <= tickCarry,
  };
});
const BASE_RATE_TIERS_OK = baseRateTiers.every((r) => r.ok);

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((arm) => cells.every((c) => c[arm].worldOk && c[arm].rcFlagOff
      && c[arm].geneAbsent) && receiptRows[arm].worldOk && receiptRows[arm].rcFlagOff
      && receiptRows[arm].geneAbsent),
    note: '⭐ on EVERY walked match of BOTH arms (and both construction receipts): '
      + '`raArmedVersion(match) === 12` (world 12\'s own composition, CALLED never copied), '
      + 'the `rcAnticipate` match flag is FALSE and `rcAnticipationWeightOf` returns null on '
      + 'BOTH teams — THE SEAT IS NOT THE CENSUS\'S BUSINESS and is provably unarmed',
  },
  gGenomeClean: {
    ok: ARMS.every((arm) => cells.every((c) => c[arm].genomeClean)
      && receiptRows[arm].genomeClean),
    note: 'the FRANCHISE genome (`info.genome`) carries NEITHER world-12 pin nor the corridor '
      + 'weight NOR the RC gene — the match-local arming idiom (canon: dose placement, '
      + '#270.2 / #334.1)',
  },
  gDoseSource: {
    ok: L3_DOSE_BYTES_SHA === L3_DOSE_SHA_PINNED && PC_DOSE_BYTES_SHA === PC_DOSE_SHA_PINNED
      && DOSED_ARM_REACHABLE,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arm calls the SHIPPED LOADERS (`loadL3Dose` / '
      + '`loadPcDose`) and this gate hashes the FILE BYTES this process read from the two '
      + `paths they name, comparing each against the BYTE-HASH OF RECORD pinned from PT-C0's `
      + `artifact \`doseSource.files\` (#369 §CORR item 2(i)): ${L3_DOSE_FILE} → `
      + `${L3_DOSE_SHA_PINNED.slice(0, 8)}… · ${PC_DOSE_FILE} → `
      + `${PC_DOSE_SHA_PINNED.slice(0, 8)}…; both pooled doses NON-EMPTY`,
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ anchored extraction with line receipts on '
      + `${ANCHORS.length} sites: TURN_RATE (the angular-speed bins' own cap) · BASE_SPEED `
      + '(the speed bins\' own scale) and the PURE `topSpeed` getter · ACCEL · AI_INTERVAL · '
      + 'CONTROL_RADIUS · BALL_RADIUS · TOUCH_CONTROL_DIST (the pressed cut) · the '
      + '`BodySector` union AND the law\'s five-line sector classifier VERBATIM · the four '
      + 'lines of THE HEADING INTEGRATOR that carry §P.E\'s code fact · the '
      + '`pendingPassWindup` record\'s own field list and the THREE tick-indexing sites · '
      + 'world 12\'s flag composition and arming lines and `armA4World`\'s dose parameters · '
      + `the dormant \`rcAnticipate\` flag and \`rcAnticipationWeightOf\` · the ActionType `
      + `vocabulary read off its own union (${ACTIONS.length} labels, line ${ACT_BLOCK_LINE})`,
  },
  gCueChannel: {
    ok: CUE_CHANNEL_OK,
    note: '⭐⭐ THE CHANNEL FIXTURE (the RC-C0 form): two carriers with IDENTICAL '
      + '`pos`/`heading`/`vel`/previous heading and DIFFERENT private commitments '
      + '(`faceTarget`, the private target gid, the private readyTick) yield a BYTE-IDENTICAL '
      + 'CELL VECTOR — the cell reads the owner\'s `pos`/`heading`/`vel` and my `pos`, and '
      + 'nothing else. BOTH negative halves are asserted too: reversing the EXTERNAL heading '
      + 'moves the vector, and changing the EXTERNAL velocity moves it — so the fixture '
      + 'cannot pass by the cell being constant',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — the angle arithmetic, the RANK rule (rank 1 IS RC-C0\'s strict argmin, '
      + 'ties to the lowest gid, NaN excluded), the angular-speed arithmetic against '
      + 'TURN_RATE\'s own cap, the frozen bin EDGES, the cell index, the turn-ticks ceil, the '
      + 'BK SECTOR CLASSIFIER **CALLED** on constructed geometries, every bin helper, and '
      + '⭐⭐ THE (c) COUPLING FIXTURE (two identical bodies driven at the same target for '
      + `${FIXTURE_TICKS} ticks, one facing 90° off its velocity: distance ratio `
      + `${FACING_DISTANCE_RATIO}, with the fixture's own liveness asserted — the faced `
      + 'body\'s heading really did leave its movement direction)',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => totBy(arm, (r) => r.windupTicks) > 0
      && totBy(arm, (r) => r.carryTicks) - totBy(arm, (r) => r.windupTicks) > 0
      && totBy(arm, (r) => sumCells(r.cellTicks, inF)) > 0
      && totBy(arm, (r) => sum(r.cellWindupTargetMe)) > 0
      && totBy(arm, (r) => r.facingN[0]) > 0 && totBy(arm, (r) => r.facingN[1]) > 0),
    note: '⛔ no face is computed on an empty cell: on BOTH arms both LABELS are live '
      + `(E carry ${totBy('E', (r) => r.carryTicks) - totBy('E', (r) => r.windupTicks)} / `
      + `windup ${totBy('E', (r) => r.windupTicks)}; D carry `
      + `${totBy('D', (r) => r.carryTicks) - totBy('D', (r) => r.windupTicks)} / windup `
      + `${totBy('D', (r) => r.windupTicks)}), THE FROZEN FAMILY F IS NON-EMPTY (E `
      + `${totBy('E', (r) => sumCells(r.cellTicks, inF))} · D `
      + `${totBy('D', (r) => sumCells(r.cellTicks, inF))} tick×mate pairs), the TARGET `
      + `population is live (E ${totBy('E', (r) => sum(r.cellWindupTargetMe))} · D `
      + `${totBy('D', (r) => sum(r.cellWindupTargetMe))}) and both facing instants are `
      + 'populated. ⚠ this gate reads LIVENESS, never a direction and never a magnitude',
  },
  gBaseRateConsistency: {
    ok: BASE_RATE_TIERS_OK,
    note: '⭐⭐ THE TWO TIERS AGREE, exactly: Σ over cells of the per-CELL tick counts equals '
      + 'the recorded mate multiplicity Σ`mateSumByLabel` (and the same for the wind-up '
      + 'counts), and the per-TICK speed histogram totals equal the carrying-tick count — so '
      + 'P(wind-up | carrying tick) re-derives WITHOUT the mate multiplicity and the per-cell '
      + 'table cannot silently disagree with the per-tick base rate. ⚠ the multiplicity is '
      + 'the EXACT recorded Σ (never a constant 5), because a sending-off changes it',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + 'Match state after `m.step(DT)`. Proven anyway — the same scratch seed walked OBSERVED '
      + 'and UNOBSERVED yields a BYTE-IDENTICAL whole-match signature on '
      + `${lockstepRows.length} out-of-band scratch walks (both arms)`,
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
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds; the two arms SHARE '
      + 'every battery seed, so the walk count is (seeds + receipt) × 2; every battery seed '
      + 'and the construction receipt lie inside block 12,536,000–999; every lockstep seed is '
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
/* §18 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({ seed: c.seed, E: c.E, D: c.D }));

/** ⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a
 *  field not in the schema never enters the body; forbidden-name lists are retired"
 *  (home: PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1). The body hash is computed
 *  LAST at §19b — AFTER every body key including `gates.gFaces` and `artifact.gates` — and a
 *  NON-body receipt field records that it reproduces from the written file (canon, VERBATIM:
 *  "the body hash is computed after every body key is assigned, and a NON-body receipt field
 *  records that the hash reproduces from the written file"). */
const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'licence', 'costOfFacing', 'bestCell', 'medians',
  'bins', 'cellDefinition', 'familyF', 'facing', 'doseSource', 'arms', 'labels', 'instants',
  'sectors', 'actionVocabulary', 'seeds', 'stats', 'anchoredSites', 'fixtures',
  'cueChannelFixture', 'costOfFacingFixture', 'lockstep', 'baseRateTiers', 'perf',
  'honestLimits', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'RC-C0b',
    title: 'THE DETECTOR CENSUS — can a receiver tell from the passer\'s BODY alone, and '
      + 'BEFORE the strike, that a pass is coming and to whom · the target\'s FACING GEOMETRY '
      + 'during the wind-up · the COST OF FACING as a code fact',
    doc: 'docs/world-model/RC-C0B-DETECTOR-CENSUS.md',
    contract: 'docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md',
    lineage: 'RC-C0 (the cooperation census, the instrument family) → PT-C0 (the dosed '
      + 'composition and the BK sector classifier) → RC-T0 → RC-T1a (the corrected hash '
      + 'order and the artifact-reload receipt) → COMMANDER RULING #372 item 6',
    censusFormOfRecord: 'docs/world-model/RC-C0-COOPERATION-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #372 item 6 (scope = #371 item 5 VERBATIM)',
    kind: 'CENSUS — it publishes MEASUREMENTS; it scores no hypothesis, arms no mechanism and '
      + 'ADJUDICATES NOTHING except the ONE pre-committed licence rule frozen at §P.C, whose '
      + 'verdict word it PRINTS FROM THE RULE. The commander rules.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS the shipped exports '
      + 'and reads Match state per tick. THERE IS NO WRAPPER AT ALL — `gLockstep` proves '
      + 'observed ≡ unobserved byte for byte on out-of-band scratch seeds.',
    storageForm: '⭐ canon, VERBATIM: "an artifact is written as compact JSON — no '
      + 'indentation; the hash is over the canonical body regardless; pretty-printing is a '
      + 'reader\'s tool, not a storage form" (home: ruling #372 item 5). This artifact is '
      + 'written with `JSON.stringify(artifact)` and no indent argument.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/rc-c0b-detector-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/rc-c0b-detector-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(PATHS.map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((a) => ({ arm: a, label: ARM_LABEL[a] })),
  labels: LABELS,
  instants: INSTANTS,
  sectors: SECTORS,
  actionVocabulary: { labels: ACTIONS, overflowSlotIndex: ACTIONS.length },
  cellDefinition: {
    population: '⭐⭐ EVERY OPEN-PLAY tick (`match.phase === \'playing\'`) on which a body OWNS '
      + 'the ball (`ball.owner !== null`, not sent off) — "carrying ticks", BOTH sides.',
    truthLabel: '⭐ THE CENSUS\'S RIGHT: L = `windup` iff `pendingPassWindup` is live for that '
      + 'owner (`gid === owner.gid`) at a PRE-RELEASE tick (`tick < readyTick`, RC-C0 §P.A\'s '
      + 'own indexing: the record is observable from state at the END of ticks t0 … '
      + 'readyTick−1, and the RELEASE tick is `readyTick`); else `carry`. The record LABELS '
      + 'only — it computes NO cell.',
    observers: 'every same-side OFF-BALL body ("me") that is not the owner and is on the pitch '
      + '(`sentOff === false`) — the KEEPER INCLUDED (RC-C0 §P.A\'s population, ruling #370 '
      + 'item 3\'s authority).',
    readSet: '⭐⭐ THE CELL READS ONLY: the owner\'s `pos`, `heading` (this tick and the '
      + 'previous tick) and `vel`, plus my own `pos`. ⛔ NOT `faceTarget`, NOT '
      + '`pendingPassWindup`, NOT `pendingPass`, NOT `action`/`scores`, NOT any TeamBrain '
      + 'designation, NOT `info.genome`. `gCueChannel` proves it with a fixture.',
    speedBins: { what: 'the carrier\'s |vel| in m/s', edges: SPEED_EDGES, bins: NSPEED,
      form: 'bin i = [edges[i−1], edges[i]); the last bin is [5, ∞). ANCHORED to the shipped '
        + 'BASE_SPEED table (top entry 7.9) × the pace span (0.88 + 0.24) and the PURE '
        + '`topSpeed` getter, which cap a body under 8.9 m/s.' },
    angSpeedBins: { what: 'the angle between the owner\'s heading at this tick and at the '
      + 'PREVIOUS tick, divided by DT — rad/s', edges: ANG_EDGES, bins: NANG,
      form: 'bin i = [edges[i−1], edges[i]); the last bin is [4, TURN_RATE] — ANCHORED to '
        + `TURN_RATE = ${TURN_RATE}, the engine\'s own cap, which no body can exceed. A tick `
        + 'whose angular speed is not finite (a degenerate heading) enters NO cell.' },
    rank: '⭐⭐ RC-C0 §P.A\'s CUE BYTE FOR BYTE, extended from the argmin to the whole vector: '
      + 'θ_i = the angle between the owner\'s `heading` and `unit(mate_i.pos − owner.pos)`; '
      + 'rank(i) = 1 + #{ j ≠ i : θ_j < θ_i, or (θ_j === θ_i and gid_j < gid_i) } over the '
      + 'FINITE entries. Rank 1 is EXACTLY RC-C0\'s `argminFinite` (strict argmin, ties to '
      + 'the LOWEST gid). A degenerate bearing names no rank and that mate is EXCLUDED.',
    rankBins: NRANK,
    cellCount: NCELL,
    cellIndex: '(speedBin · NANG + angBin) · NRANK + (rank − 1), clamped at rank ≥ 6 into the '
      + 'last rank slot.',
    counts: 'per cell: `cellTicks` (carrying ticks × mates falling in the cell), `cellWindup` '
      + '(label windup), `cellWindupTargetMe` (label windup ∧ `pendingPassWindup.targetGid` '
      + '=== my gid).',
    perTickBaseCounts: '⚠ STORED SEPARATELY and independent of me: `carryTicks`, '
      + '`windupTicks`, `carryTicksPressed`, `speedBinsByLabel`, `angBinsByLabel` and '
      + '`mateSumByLabel` — so P(wind-up | carrying tick), THE BASE RATE, re-derives WITHOUT '
      + 'the mate multiplicity. `gBaseRateConsistency` proves the two tiers agree.',
  },
  familyF: {
    frozenAt: '§P.C, BEFORE ANY BATTERY SEED',
    definition: '⭐⭐ THE FROZEN CELL FAMILY F = the TOP angular-speed bin [4, TURN_RATE] rad/s '
      + '∧ RANK 1 — 「he is turning onto me」: the carrier is swinging his body at 60 %+ of '
      + 'the fastest a body in this engine can turn, and of all his mates I am the one his '
      + 'heading points nearest to. It is the natural candidate the commander named (#371 '
      + 'item 5), and it is cut FROM THE ENGINE\'S OWN GRAIN: the angular-speed edge is a '
      + 'fraction of `TURN_RATE`, the shipped cap, and rank 1 is RC-C0\'s own argmin — no '
      + 'taste constant enters. F is the union over ALL FIVE speed bins (the family says '
      + 'nothing about how fast he is running).',
    cells: F_CELLS,
    size: F_CELLS.length,
  },
  facing: {
    population: 'every wind-up observed (the RC-C0 group-(a) population — cancellations '
      + 'included, since a cancelled wind-up still gave its evidence away), the TARGET only.',
    instants: 'the ARM tick t0 (the first tick the record is observable from state) and the '
      + 'LAST pre-release tick.',
    sector: '⭐⭐ THE BK LAW\'S OWN CLASSIFIER, CALLED: '
      + '`ballAccessGeometry({ pos: target.pos, bodyDir: target.heading, coreRadius }, '
      + '{ pos: passer.pos, radius: BALL_RADIUS }, CONTROL_RADIUS).sector` — the sector the '
      + 'ball WOULD meet if it were struck now, because the classifier reads only the UNIT '
      + 'direction target→ball and the ball would come FROM the passer. `front` ⇔ facingCos '
      + '≥ √½, `back` ⇔ facingCos ≤ −√½, else `side`. The five-line classifier is ANCHORED '
      + 'VERBATIM and NEVER re-implemented.',
    turn: 'the angle between the target\'s `heading` and the bearing target→passer (the same '
      + 'pure `cueAngle` the cell uses, with the roles swapped); 5° bins to 180°, stored.',
    turnTicks: `ceil(turn / (TURN_RATE · DT)) — the ticks that turn needs at the engine's own `
      + 'cap, read at the ARM instant t0, against the window W = readyTick − t0. The share '
      + 'with turnTicks ≤ W and the SIGNED distribution of (turnTicks − W) are stored.',
    contrast: 'the EMPTY-BOOK vs DOSED contrast on these is REPORTED, PAIRED ON SEEDS — never '
      + 'gated.',
  },
  doseSource: {
    what: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". PINNED: the two byte-hashes OF RECORD from PT-C0\'s artifact '
      + '`doseSource.files` (#369 §CORR item 2(i)).',
    loadersCalled: ['loadL3Dose', 'loadPcDose'],
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    pinned: { [L3_DOSE_FILE]: L3_DOSE_SHA_PINNED, [PC_DOSE_FILE]: PC_DOSE_SHA_PINNED },
    l3CellsPooled: L3_DOSE?.length ?? 0,
    pcRowsPooled: PC_DOSE?.length ?? 0,
    l3NonEmpty: (L3_DOSE ?? []).some((c) => c.lunges > 0),
    pcNonEmpty: (PC_DOSE ?? []).some((row) => row.some((v) => v > 0)),
    reachable: DOSED_ARM_REACHABLE, loadError: DOSE_LOAD_ERROR,
  },
  anchoredSites: ANCHORS,
  fixtures: FIXTURES,
  cueChannelFixture: {
    what: 'two carriers, IDENTICAL external state, DIFFERENT private commitments ⇒ IDENTICAL '
      + 'CELL vector; a REVERSED external heading ⇒ a DIFFERENT vector; a DIFFERENT external '
      + 'velocity ⇒ a DIFFERENT vector (the two live halves)',
    mates: CH_MATES, gids: CH_GIDS, a: CH_A, b: CH_B,
    cellA: cellVecA, cellB: cellVecB,
    cellReversedHeading: cellVecRevHeading, cellFasterVelocity: cellVecFastVel,
    ok: CUE_CHANNEL_OK,
  },
  costOfFacingFixture: {
    what: '⭐⭐ (c) two identical bodies driven toward the SAME target for '
      + `${FIXTURE_TICKS} ticks (2 sim-seconds) at their own topSpeed, one with `
      + '`faceTarget` set 90° off its velocity and one with none. The ONLY difference is the '
      + 'facing. If the engine charged movement for a misaligned heading the ratio would be '
      + '< 1.',
    ticks: FIXTURE_TICKS,
    distanceFree: FIX_FREE.dist, distanceFaced: FIX_FACED.dist,
    distanceRatio: FACING_DISTANCE_RATIO,
    headingFree: FIX_FREE.heading, headingFaced: FIX_FACED.heading,
    facedHeadingOffVelocityRadians: FACED_HEADING_OFF_VELOCITY_RAD,
  },
  lockstep: lockstepRows,
  baseRateTiers,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,002,200–211), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. Target 0.05 on BOTH pre-registered quantities; N_FROZEN takes the LARGER '
      + 'requirement, capped by what the block affords (≤ 999 shared seeds).',
    nFrozen: N_FROZEN,
    blockAffords: 999,
    rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  licence: {
    face: 'delta.deltaF.E',
    frozenRule: '⭐⭐ LICENSED ⇔ the 95 % cluster-bootstrap CI of Δ_F = P(wind-up | F) − '
      + 'P(wind-up | carrying tick) lies ENTIRELY ABOVE ZERO (ciLo > 0) on the EMPTY-BOOK arm '
      + '(the exam form); BLOCKED ⇔ otherwise — the receiver cannot tell a wind-up from a '
      + 'dribble by the body alone and the facing limb RETURNS TO THE COMMANDER with the look '
      + 'and the offer channel named. FROZEN AT §P.C IN EXACT FORM BEFORE ANY BATTERY SEED '
      + '(#371 item 5\'s ONE PRE-COMMITMENT). The DOSED arm\'s Δ_F is REPORTED beside (the '
      + 'user\'s form) and is NEVER gated.',
    verdict: LICENCE,
    reading: LICENCE_READING,
    deltaEmptyBook: licE,
    deltaDosedReportedBeside: licD,
    emptyBook: {
      baseRate: face('E.baseRate'), pWindupGivenF: face('E.pWindupGivenF'),
      coverageF: face('E.coverageF'), precisionTargetGivenF: face('E.precisionTargetGivenF'),
    },
    dosed: {
      baseRate: face('D.baseRate'), pWindupGivenF: face('D.pWindupGivenF'),
      coverageF: face('D.coverageF'), precisionTargetGivenF: face('D.precisionTargetGivenF'),
    },
  },
  bestCell: {
    what: '⭐ REPORTED, NEVER A RULE: the cell with the highest P(wind-up | cell) among cells '
      + `with n ≥ the FROZEN FLOOR of ${BEST_CELL_MIN_N} (carrying tick × mate) pairs. The `
      + 'floor is frozen at §P.C before the battery so the winner cannot be a rare cell '
      + 'picked after sight.',
    floor: BEST_CELL_MIN_N,
    E: BEST_CELL.E, D: BEST_CELL.D,
  },
  costOfFacing: {
    what: '⭐⭐ (c) THE CODE FACT, FROZEN AT §P.E BEFORE ANY BATTERY SEED — a reading of '
      + '`src/sim/Player.ts`\'s movement/heading integration, not a battery face.',
    answer: COST_OF_FACING,
    movesSlower: false, acceleratesLess: false, velocityTurnedTowardHeading: false,
    fixtureDistanceRatio: FACING_DISTANCE_RATIO,
    realismGap: 'VISION S11 — 转身/低速/受压仍是胶水. STATED, NOT HIDDEN.',
  },
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off '
      + 'the SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY '
      + 'published face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: {
    cellTicks: { what: 'the DETECTOR TABLE\'s own counts, pooled per arm', cells: NCELL,
      E: pooled.E.cellTicks, D: pooled.D.cellTicks },
    cellWindup: { what: 'the wind-up counts per cell, pooled per arm', cells: NCELL,
      E: pooled.E.cellWindup, D: pooled.D.cellWindup },
    cellWindupTargetMe: { what: 'the wind-up ∧ target = me counts per cell, pooled per arm',
      cells: NCELL, E: pooled.E.cellWindupTargetMe, D: pooled.D.cellWindupTargetMe },
    carrierSpeedByLabel: { what: 'the carrier\'s SPEED distribution on wind-up vs carry '
      + 'ticks (per TICK — the detector\'s raw material)', edges: SPEED_EDGES, labels: LABELS,
      E: pooled.E.speedBinsByLabel, D: pooled.D.speedBinsByLabel },
    carrierAngSpeedByLabel: { what: 'the carrier\'s heading ANGULAR-SPEED distribution on '
      + 'wind-up vs carry ticks (per TICK)', edges: ANG_EDGES, labels: LABELS,
      E: pooled.E.angBinsByLabel, D: pooled.D.angBinsByLabel },
    facingSector: { what: '(b) the sector the ball would meet, per instant', vocabulary: SECTORS,
      instants: INSTANTS, E: pooled.E.sectorBins, D: pooled.D.sectorBins },
    turnToFacePasserDegrees: { width: TURN_BIN_DEG, bins: TURN_BINS, overflowIsLast: true,
      instants: INSTANTS, E: pooled.E.turnDegBins, D: pooled.D.turnDegBins },
    turnTicksAtArm: { width: TT_BIN, bins: TT_BINS, overflowIsLast: true,
      E: pooled.E.turnTicksBins, D: pooled.D.turnTicksBins },
    turnTicksMinusW: { width: TTMW_BIN, bins: TTMW_BINS, centreHoldsZero: true,
      E: pooled.E.turnMinusWBins, D: pooled.D.turnMinusWBins },
    wTicks: { width: W_BIN_TICKS, bins: W_BINS, overflowIsLast: true,
      E: pooled.E.wBins, D: pooled.D.wBins },
    actionAtArm: { vocabulary: ACTIONS, E: pooled.E.actArm, D: pooled.D.actArm },
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    armsPerSeed: ARMS.length,
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
    meanWallSecondsPerMatch: cells.reduce((a, c) => a + c.E.wallMs + c.D.wallMs, 0)
      / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'included — never the game\'s frame cost.',
  },
  honestLimits: null,   // ⭐ canon: the doc's §R HONEST LIMITS is the ONE home (#367 item 3)
  perSeedCells,
  constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §19 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/*    canon, VERBATIM: "the re-derivation gate covers EVERY published face; a    */
/*    percentile face requires stored bins"                                     */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as typeof artifact & {
  perSeedCells: { seed: number; E: Row; D: Row }[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<string, Record<string, unknown>>;
  licence: { verdict: string; deltaEmptyBook: DeltaRow };
  bestCell: { floor: number; E: typeof BEST_CELL.E; D: typeof BEST_CELL.D };
  medians: { values: typeof medians };
  sizing: { rows: typeof sizingRows };
  costOfFacing: { fixtureDistanceRatio: number };
  costOfFacingFixture: { distanceRatio: number; distanceFree: number; distanceFaced: number };
};
const dcells = disk.perSeedCells;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const nu = sum(dcells.map((c) => def.num(c[def.arm])));
  const de = sum(dcells.map((c) => def.dn(c[def.arm])));
  const v = ratio(nu, de);
  /** ⚠ JSON has no NaN: an empty cell's `value` round-trips as `null`. The check accepts
   *  `null` EXACTLY WHERE the re-derivation itself is NaN, and nowhere else. */
  const isNull = (x: unknown): boolean => x === null || (typeof x === 'number' && Number.isNaN(x));
  faceChecks.push({
    face: f.face,
    ok: nu === f.numerator && de === f.denominator
      && (Number.isNaN(v) ? isNull(f.value) : v === f.value),
  });
}
for (const dd of disk.deltas) {
  const fl = FACES[dd.left];
  const fr = FACES[dd.right];
  const pl = ratio(sum(dcells.map((c) => fl.num(c[fl.arm]))),
    sum(dcells.map((c) => fl.dn(c[fl.arm]))));
  const pr = ratio(sum(dcells.map((c) => fr.num(c[fr.arm]))),
    sum(dcells.map((c) => fr.dn(c[fr.arm]))));
  const isNull2 = (x: unknown): boolean => x === null
    || (typeof x === 'number' && Number.isNaN(x));
  faceChecks.push({
    face: `delta.${dd.key}`,
    ok: (Number.isNaN(pl) ? isNull2(dd.leftValue) : pl === dd.leftValue)
      && (Number.isNaN(pr) ? isNull2(dd.rightValue) : pr === dd.rightValue)
      && (Number.isNaN(pl - pr) ? isNull2(dd.delta) : pl - pr === dd.delta),
  });
}
const binChecks: { bin: string; ok: boolean }[] = [];
const reBin1 = (
  key: string, len: number, pick: (r: Row) => number[],
): Record<Arm, number[]> => {
  const got = { E: zeros(len), D: zeros(len) };
  for (const c of dcells) { addInto(got.E, pick(c.E)); addInto(got.D, pick(c.D)); }
  binChecks.push({ bin: key,
    ok: JSON.stringify(got.E) === JSON.stringify(disk.bins[key]?.E ?? [])
      && JSON.stringify(got.D) === JSON.stringify(disk.bins[key]?.D ?? []) });
  return got;
};
const reBin2 = (
  key: string, a: number, b: number, pick: (r: Row) => number[][],
): Record<Arm, number[][]> => {
  const got = { E: zeros2(a, b), D: zeros2(a, b) };
  for (const c of dcells) { addInto2(got.E, pick(c.E)); addInto2(got.D, pick(c.D)); }
  binChecks.push({ bin: key,
    ok: JSON.stringify(got.E) === JSON.stringify(disk.bins[key]?.E ?? [])
      && JSON.stringify(got.D) === JSON.stringify(disk.bins[key]?.D ?? []) });
  return got;
};
reBin1('cellTicks', NCELL, (r) => r.cellTicks);
reBin1('cellWindup', NCELL, (r) => r.cellWindup);
reBin1('cellWindupTargetMe', NCELL, (r) => r.cellWindupTargetMe);
reBin2('carrierSpeedByLabel', NLAB, NSPEED, (r) => r.speedBinsByLabel);
reBin2('carrierAngSpeedByLabel', NLAB, NANG, (r) => r.angBinsByLabel);
reBin2('facingSector', NINST, 3, (r) => r.sectorBins);
const dTurnDeg = reBin2('turnToFacePasserDegrees', NINST, TURN_BINS, (r) => r.turnDegBins);
const dTurnTicks = reBin1('turnTicksAtArm', TT_BINS, (r) => r.turnTicksBins);
const dTurnMinusW = reBin1('turnTicksMinusW', TTMW_BINS, (r) => r.turnMinusWBins);
const dW = reBin1('wTicks', W_BINS, (r) => r.wBins);
reBin1('actionAtArm', NACT, (r) => r.actArm);
/** ⭐ EVERY BIN-DERIVED MEDIAN re-derives off the disk bins */
{
  const want = {
    E: {
      turnDegAtArm: binMedian(dTurnDeg.E[0], TURN_BIN_DEG, false),
      turnDegAtLast: binMedian(dTurnDeg.E[1], TURN_BIN_DEG, false),
      turnTicksAtArm: binMedian(dTurnTicks.E, TT_BIN, false),
      turnTicksMinusW: binMedian(dTurnMinusW.E, TTMW_BIN, true),
      wTicks: binMedian(dW.E, W_BIN_TICKS, false),
    },
    D: {
      turnDegAtArm: binMedian(dTurnDeg.D[0], TURN_BIN_DEG, false),
      turnDegAtLast: binMedian(dTurnDeg.D[1], TURN_BIN_DEG, false),
      turnTicksAtArm: binMedian(dTurnTicks.D, TT_BIN, false),
      turnTicksMinusW: binMedian(dTurnMinusW.D, TTMW_BIN, true),
      wTicks: binMedian(dW.D, W_BIN_TICKS, false),
    },
  };
  binChecks.push({ bin: 'medians.allBinDerived',
    ok: JSON.stringify(want) === JSON.stringify(disk.medians.values) });
}
/** ⭐ THE VERDICT WORD, THE FAMILY'S COVERAGE/PRECISION AND THE BEST CELL, re-derived */
{
  const dsd = disk.licence.deltaEmptyBook;
  binChecks.push({ bin: 'licence.verdict',
    ok: (dsd.ciLo > 0 ? 'LICENSED' : 'BLOCKED') === disk.licence.verdict });
  const lic2 = disk.licence as unknown as {
    emptyBook: Record<string, FaceRow>; dosed: Record<string, FaceRow>;
  };
  for (const arm of ARMS) {
    const blk = arm === 'E' ? lic2.emptyBook : lic2.dosed;
    for (const [k, fk] of [['baseRate', `${arm}.baseRate`],
      ['pWindupGivenF', `${arm}.pWindupGivenF`], ['coverageF', `${arm}.coverageF`],
      ['precisionTargetGivenF', `${arm}.precisionTargetGivenF`]] as const) {
      const df = disk.faces.find((f) => f.face === fk);
      binChecks.push({ bin: `licence.${arm}.${k}.quotesItsOwnFace`,
        ok: JSON.stringify(blk[k]) === JSON.stringify(df) });
    }
    /* the family's COVERAGE and PRECISION re-derived straight off the SERIALIZED cell table */
    const covNum = sum(dcells.map((c) => sumCells(c[arm].cellWindupTargetMe, inF)));
    const covDen = sum(dcells.map((c) => sum(c[arm].cellWindupTargetMe)));
    const preDen = sum(dcells.map((c) => sumCells(c[arm].cellWindup, inF)));
    const cf = disk.faces.find((f) => f.face === `${arm}.coverageF`) as FaceRow;
    const pf = disk.faces.find((f) => f.face === `${arm}.precisionTargetGivenF`) as FaceRow;
    const same = (a: number, b: unknown): boolean => (Number.isNaN(a)
      ? (b === null || (typeof b === 'number' && Number.isNaN(b))) : a === b);
    binChecks.push({ bin: `familyF.${arm}.coverageFromCellTable`,
      ok: covNum === cf.numerator && covDen === cf.denominator
        && same(ratio(covNum, covDen), cf.value) });
    binChecks.push({ bin: `familyF.${arm}.precisionFromCellTable`,
      ok: covNum === pf.numerator && preDen === pf.denominator
        && same(ratio(covNum, preDen), pf.value) });
    /* the BEST CELL re-derived off disk under the frozen floor */
    let best = -1;
    let bestV = -Infinity;
    for (let idx = 0; idx < NCELL; idx++) {
      const f = disk.faces.find((x) => x.face === `${arm}.cell.${idx}.pWindup`) as FaceRow;
      if (f.denominator < disk.bestCell.floor) continue;
      if (f.value > bestV) { bestV = f.value; best = idx; }
    }
    binChecks.push({ bin: `bestCell.${arm}`,
      ok: (best < 0 ? null : best) === disk.bestCell[arm].cellIndex
        && (best < 0 || (
          Math.floor(best / (NANG * NRANK)) === disk.bestCell[arm].speedBin
          && Math.floor(best / NRANK) % NANG === disk.bestCell[arm].angBin
          && (best % NRANK) + 1 === disk.bestCell[arm].rank
          && bestV === disk.bestCell[arm].pWindup)) });
  }
}
/** ⭐ THE TWO TIERS' consistency re-derives off disk too (gBaseRateConsistency's arithmetic) */
for (const arm of ARMS) {
  const cellTicksTot = sum(dcells.map((c) => sum(c[arm].cellTicks)));
  const mateSumAll = sum(dcells.map((c) => sum(c[arm].mateSumByLabel)));
  const cellWindupTot = sum(dcells.map((c) => sum(c[arm].cellWindup)));
  const mateSumWindup = sum(dcells.map((c) => c[arm].mateSumByLabel[LI('windup')]));
  binChecks.push({ bin: `baseRateTiers.${arm}`,
    ok: cellTicksTot === mateSumAll && cellWindupTot === mateSumWindup });
}
/** ⭐ THE (c) FIXTURE RATIO is a published face too — it re-derives off disk */
binChecks.push({ bin: 'costOfFacing.ratioMatchesItsFixture',
  ok: disk.costOfFacing.fixtureDistanceRatio === disk.costOfFacingFixture.distanceRatio
    && disk.costOfFacingFixture.distanceFaced === disk.costOfFacingFixture.distanceFree
    && disk.costOfFacingFixture.distanceRatio === 1 });
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
    + 'VERDICT / family-coverage / family-precision / best-cell / tier-consistency / '
    + '(c)-fixture / sizing checks re-derived from the SERIALIZED artifact off disk',
};

/* ---- gHashOrder: the STRUCTURAL conjunct the corrected order enforces ---- */
const SCHEMA_ASSIGNED = BODY_SCHEMA.every((k) => k in artifact)
  && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
  && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail');
gates.gHashOrder = {
  ok: SCHEMA_ASSIGNED,
  note: '⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
    + 'field not in the schema never enters the body; forbidden-name lists are retired" and '
    + '"the body hash is computed after every body key is assigned, and a NON-body receipt '
    + `field records that the hash reproduces from the written file". Every one of the `
    + `${BODY_SCHEMA.length} schema keys is ASSIGNED before the hash; non-schema keys are the `
    + 'declared receipt/cell tier (`allGreen`, `gFacesDetail`, `receipts`, '
    + '`hashedBodySha256`). The hash is computed at §19b — AFTER `gates.gFaces`, AFTER '
    + '`gates.gHashOrder` and AFTER `artifact.gates = gates` — and `receipts.'
    + 'hashReproducesFromFile` records that it reproduces from the written file',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = Object.values(gates).every((g) => g.ok);
artifact.allGreen = ALL_GREEN;

/* ========================================================================== */
/* §19b THE HASH, LAST — the PT-C0 / RC-C0 §356 HOUSE ORDER (#372 item 3)      */
/* ========================================================================== */
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));
/** ⭐ THE RED-ROUTING IDIOM, IN CODE (#334 item 5) — evaluated after every gate */
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
const FILE_BYTES = readFileSync(OUT_PATH, 'utf8');
/** ⭐⭐ THE NON-BODY RECEIPT (canon, #372 item 3): the body hash RECOMPUTED from the FILE
 *  JUST WRITTEN, under the DECLARED BODY_SCHEMA — persisted OUTSIDE the body. */
const HASH_REPRODUCES_FROM_FILE = (() => {
  const onDisk = JSON.parse(FILE_BYTES) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();
artifact.receipts = {
  what: '⭐⭐ canon, VERBATIM: "the body hash is computed after every body key is assigned, and '
    + 'a NON-body receipt field records that the hash reproduces from the written file" '
    + '(home: RC-T1A-PRECUE-EXAM.md §COMMANDER CORRECTIONS item 3, ruling #372 item 3). This '
    + 'block is OUTSIDE `BODY_SCHEMA` by construction — a body field could not record a hash '
    + 'computed after itself.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential (writing them changes the file). The FINAL file byte-hash and byte '
    + 'count are recomputed after the final write and PUBLISHED IN THE DOC\'s §R.',
};
writeFileSync(OUT_PATH, `${JSON.stringify(artifact)}\n`);
const FINAL_BYTES = readFileSync(OUT_PATH, 'utf8');
const FINAL_FILE_SHA = sha(FINAL_BYTES);
const FINAL_ARTIFACT_BYTES = Buffer.byteLength(FINAL_BYTES, 'utf8');
/** the receipt is re-checked against the FINAL file (the one published) */
const HASH_REPRODUCES_FINAL = (() => {
  const onDisk = JSON.parse(FINAL_BYTES) as Record<string, unknown>;
  const b2: Record<string, unknown> = {};
  for (const k of BODY_SCHEMA) b2[k] = onDisk[k];
  return sha(canonicalJson(b2)) === onDisk.hashedBodySha256;
})();

/* ========================================================================== */
/* §20 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`RC-C0b — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- (a) THE DETECTOR TABLE ---');
for (const arm of ARMS) {
  const d = arm === 'E' ? licE : licD;
  banner(`  ${arm} base rate ${f6(face(`${arm}.baseRate`).value)} `
    + `[${f6(face(`${arm}.baseRate`).ciLo)}, ${f6(face(`${arm}.baseRate`).ciHi)}]  `
    + `n=${face(`${arm}.baseRate`).denominator} carrying ticks`);
  banner(`  ${arm} P(windup | F) ${f6(face(`${arm}.pWindupGivenF`).value)} `
    + `[${f6(face(`${arm}.pWindupGivenF`).ciLo)}, ${f6(face(`${arm}.pWindupGivenF`).ciHi)}]  `
    + `n=${face(`${arm}.pWindupGivenF`).denominator} tick×mate`);
  banner(`  ${arm} Δ_F = ${f6(d.delta)} [${f6(d.ciLo)}, ${f6(d.ciHi)}] `
    + `(${f6(d.absDeltaOverHalfWidth)} hw)  coverage ${f6(face(`${arm}.coverageF`).value)}  `
    + `precision ${f6(face(`${arm}.precisionTargetGivenF`).value)}`);
  const bc = BEST_CELL[arm];
  banner(`  ${arm} best cell (n ≥ ${BEST_CELL_MIN_N}): #${bc.cellIndex} speed${bc.speedBin} × `
    + `ang${bc.angBin} × rank${bc.rank} → P ${f6(bc.pWindup)} (n=${bc.n})`);
}
banner(`  ⭐⭐ THE LICENCE (the EMPTY-BOOK arm, the frozen §P.C rule): ${LICENCE}`);
banner('');
banner('--- (b) THE TARGET\'S FACING GEOMETRY ---');
for (const arm of ARMS) {
  for (const inst of INSTANTS) {
    banner(`  ${arm} @${inst}: front ${f6(face(`${arm}.facing.frontShare${inst === 'arm' ? 'AtArm' : 'AtLast'}`).value)} `
      + `· side ${f6(face(`${arm}.facing.sideShare${inst === 'arm' ? 'AtArm' : 'AtLast'}`).value)} `
      + `· back ${f6(face(`${arm}.facing.backShare${inst === 'arm' ? 'AtArm' : 'AtLast'}`).value)} `
      + `· turn ${f6(face(`${arm}.facing.turnMeanDeg${inst === 'arm' ? 'AtArm' : 'AtLast'}`).value)}°`);
  }
  banner(`  ${arm} turn ticks ${f6(face(`${arm}.facing.turnTicksMean`).value)} vs W `
    + `${f6(face(`${arm}.window.wMeanTicks`).value)} ticks ⇒ completable in W `
    + `${f6(face(`${arm}.facing.turnCompletableInWShare`).value)}`);
}
banner('');
banner('--- (c) THE COST OF FACING (a CODE FACT) ---');
banner(`  distance ratio (faced 90° off vs free) = ${FACING_DISTANCE_RATIO}`);
banner(`  ${COST_OF_FACING.slice(0, 120)}…`);
banner('');
banner('--- REPORTED BESIDE ---');
for (const arm of ARMS) {
  banner(`  ${arm} carrying ticks/match ${f6(face(`${arm}.carryTicksPerMatch`).value)} · `
    + `wind-up ticks/match ${f6(face(`${arm}.windupTicksPerMatch`).value)} · arms/match `
    + `${f6(face(`${arm}.context.windupsArmedPerMatch`).value)} · releases/match `
    + `${f6(face(`${arm}.context.windupsReleasedPerMatch`).value)} · pressed carrier `
    + `${f6(face(`${arm}.pressedCarrierShare`).value)} · completion `
    + `${f6(face(`${arm}.context.passCompletion`).value)}`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`instrumentSha256 = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`file byte-hash   = ${FINAL_FILE_SHA}`);
banner(`artifact bytes   = ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!HASH_REPRODUCES_FROM_FILE || !HASH_REPRODUCES_FINAL) {
  banner('RC-C0b ⛔ THE HASH DOES NOT REPRODUCE FROM THE WRITTEN FILE — the very property '
    + '#371 item 1 found false. The run FAILS.');
  process.exit(1);
}
if (!ALL_GREEN) process.exit(1);
