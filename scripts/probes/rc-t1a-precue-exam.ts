/**
 * ⭐⭐ RC-T1a — THE PRE-CUE EXAM (docs/world-model/RC-T1A-PRECUE-EXAM.md).
 *
 * Authorized by COMMANDER RULING #370 item 5, on the seam RC-T0 landed (`b74b1e8`) under
 * #369 item 6's dispatch. Contract frame:
 * docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3a +
 * docs/world-model/PC-PERCEPTION-CONTRACT.md §2-AMENDMENT M-PC.1b.
 * Instrument family: scripts/probes/ra-t1b-access-exam.ts (the PAIRED-ARM form, the cluster
 * bootstrap, the LOO flip counting, `gArmsDiverge` SOME-not-EVERY, the allowlist-hashed body,
 * the gFaces-off-disk gate) + scripts/probes/rc-c0-cooperation-census.ts (the wind-up
 * population, the meetable account at the arm instant, `predictedArrDistOf`, the
 * measured-arrival read at E, the START DELAY read, the pcHold state read) +
 * scripts/probes/pt-c0-playtest-forensic-census.ts (the DOSED composition, the first-contact
 * classes, the `BodySector` classifier CALLED, the A4 spacing / dup-run / 撞车 limbs) +
 * scripts/probes/dx-t1-expression-exam.ts (the SEASON LADDER's house form).
 *
 * ⭐ THE QUESTION: does opening the pre-cue door actually move the receiver CLOSER TO THE BALL
 * when it arrives — RC-C0's 3.13 m meetable-only arrival gap — WITHOUT costing completion or
 * conceding more interceptions? Scored on the EMPTY-BOOK pair (the form every exam measured);
 * REPORTED on the DOSED pair (the form the user plays), which #370 item 5(v) makes DECISIVE
 * for the entry question.
 *
 * THE FOUR ARMS, PAIRED on shared seeds (arm k walks seed s with the IDENTICAL population
 * construction — genomes and squads from the seed exactly as RC-C0/PT-C0's `buildMatch` does):
 *   E-SHUT  = world 12 EMPTY-BOOK: a4MatchFlags(12) + armA4World(m, null, 12). Flag ABSENT,
 *             gene ABSENT — exactly the world the user's entry IS.
 *   E-ARMED = E-SHUT + `rcAnticipate: true` in the CONSTRUCTOR + `rcAnticipationWeight` = 1
 *             written MATCH-LOCAL on BOTH teams AFTER `armA4World` (the `setRaGenes` idiom:
 *             `baseGenome`/`effGenome` replaced by SPREAD COPIES which CARRY the RA pins
 *             `passLeadSupport` = 1 and `raAccessWeight` = 1; `info.genome` NEVER written).
 *   D-SHUT / D-ARMED = the same pair in the DOSED form: armA4World(m, null, 12, L3_DOSE,
 *             PC_DOSE) with the doses obtained by CALLING the shipped loaders exactly as
 *             PT-C0 arm A did; `gDoseSource` hashes the BYTES read and compares them to the
 *             two PINNED expected values (PT-C0 §COMMANDER CORRECTIONS item 2's own order).
 *
 * H-RC.1 (frozen at §P.C before any battery seed; SCORED ON THE EMPTY-BOOK PAIR ONLY):
 *   (a) THE GAP FALLS — Δ `gap.meanDiffMetres.meetableCarried` (RC-C0 §P.D's face byte for
 *       byte) 95 % paired interval ENTIRELY BELOW ZERO ⇒ FALLS.
 *   (b1) COMPLETION DOES NOT FALL — Δ whole-match `passCompletion` NOT entirely below zero.
 *   (b2) INTERCEPTIONS DO NOT RISE — Δ `interceptionsPerMatch` NOT entirely above zero.
 *   H-RC.1 = PASS ⇔ (a) ∧ (b1) ∧ (b2). ⚠ A non-fall/non-rise certifies NOTHING SMALLER THAN
 *   THE DECLARED MDE.
 *
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited — the seam is already in src and
 * landed with its own 23-pin suite; this probe CALLS the shipped exports and reads `Match`
 * state per tick. THERE IS NO WRAPPER AT ALL; `gLockstep` proves observed ≡ unobserved.
 * ⛔ Receipts are receipts: `preCuedArms`, the hold counts and the tick histogram are ARMING
 * PLUMBING and are NEVER quoted as football effect sizes (home: ruling #289 item 1 +
 * BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, AI_INTERVAL, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  loadL3Dose, loadPcDose,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { PTP_FLIGHT_SPEED } from '../../src/ai/passLeadSeat';
import { PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, preCueTicks } from '../../src/ai/pcLatency';
import { RC_BELIEF_BY_RANK, RC_PRECUE_FLOOR_TICKS } from '../../src/ai/receiverAnticipationSeat';
import { ballAccessGeometry, type BodySector } from '../../src/sim/physical';
import { dist } from '../../src/utils/vec';
import {
  randomGenome, rcAnticipationWeightOf, mutateGenome, crossoverGenomes,
  type TacticalGenome,
} from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng, hashSeed } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the RC-C0 §1 form                          */
/* ========================================================================== */
const ENV_WHITELIST = ['RCT1A_MODE', 'RCT1A_N', 'RCT1A_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('RCT1A_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`RC-T1A FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.RCT1A_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('RC-T1A FATAL — RCT1A_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.RCT1A_N !== undefined ? Number(process.env.RCT1A_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('RC-T1A FATAL — RCT1A_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.RCT1A_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`RCT1A_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`RCT1A_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`RCT1A_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/rc-t1a-precue-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/rc-t1a-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('RC-T1A FATAL — an override run may never write the canonical artifact path');
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
const mean = (xs: readonly number[]): number => (xs.length === 0 ? Number.NaN
  : sum(xs) / xs.length);
const sd = (xs: readonly number[]): number => {
  if (xs.length < 2) return 0;
  const mu = mean(xs);
  return Math.sqrt(sum(xs.map((x) => (x - mu) ** 2)) / (xs.length - 1));
};
const round = (v: number, n: number): number => (Number.isFinite(v)
  ? Math.round(v * 10 ** n) / 10 ** n : v);
const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
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
/** the bin-derived MEDIAN: the bin whose cumulative count first reaches n/2, LOWER EDGE */
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
/* §3 THE ANCHORED SITES — anchored extraction with LINE RECEIPTS
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
const PCLAT_PATH = 'src/ai/pcLatency.ts';
const RCSEAT_PATH = 'src/ai/receiverAnticipationSeat.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const MTL_PATH = 'scripts/probes/mt-ladder.ts';
const SRC = new Map<string, string>();
const srcOf = (p: string): string => {
  const s = SRC.get(p);
  if (s !== undefined) return s;
  const v = readFileSync(p, 'utf8');
  SRC.set(p, v);
  return v;
};
const lineOf = (src: string, idx: number): number => src.slice(0, idx).split('\n').length;
const occurrences = (src: string, needle: string): { line: number }[] => {
  const out: { line: number }[] = [];
  let i = src.indexOf(needle);
  while (i >= 0) { out.push({ line: lineOf(src, i) }); i = src.indexOf(needle, i + needle.length); }
  return out;
};
interface Anchor {
  what: string; file: string; needle: string; wantOccurrences: number;
  occurrences: { line: number }[]; extracted: number | null; ok: boolean;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, wantOccurrences: number,
  extracted: number | null = null,
): void => {
  const hits = occurrences(srcOf(file), needle);
  ANCHORS.push({
    what, file, needle, wantOccurrences, occurrences: hits, extracted,
    ok: hits.length === wantOccurrences,
  });
};

/* --- the DEAD TIME's two named components: the AI cadence and the two CERTIFIED tiers --- */
anchor('⭐ AI_INTERVAL — the engine\'s own decision cadence', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
anchor('⭐⭐ PC_TIER_SIMPLE_TICKS — the certified SIMPLE tier (the pre-cue\'s floor endpoint)',
  PCLAT_PATH, 'export const PC_TIER_SIMPLE_TICKS = Math.round(PC_TIER_SIMPLE_SIM_S / DT); // 12',
  1, PC_TIER_SIMPLE_TICKS);
anchor('⭐⭐ PC_TIER_CHOICE_TICKS — the certified CHOICE tier (the pre-cue\'s ceiling endpoint)',
  PCLAT_PATH, 'export const PC_TIER_CHOICE_TICKS = Math.round(PC_TIER_CHOICE_SIM_S / DT); // 27',
  1, PC_TIER_CHOICE_TICKS);
/* --- the account: interceptBall's OWN time-to-point form, DX-C2 §P.A byte for byte --- */
anchor('⭐⭐ interceptBall\'s ts clamp', PERC_PATH,
  '  const ts = Math.max(p.topSpeed, 0.1);', 1);
anchor('⭐⭐ interceptBall\'s time-to-point form (2 honest occurrences — both branches)',
  PERC_PATH, 'const tMe = Math.sqrt(dx * dx + dy * dy) / ts + 0.15;', 2);
anchor('⭐ CONTROL_RADIUS — the presence clause\'s own control cut', CONST_PATH,
  'export const CONTROL_RADIUS = ', 1, CONTROL_RADIUS);
anchor('⭐ PTP_FLIGHT_SPEED — the chooser\'s own flight law', SEAT_PATH,
  'export const PTP_FLIGHT_SPEED = ', 1, PTP_FLIGHT_SPEED);
/* --- the START DELAY read's own two sites (the receiver's strike-gated candidate) --- */
anchor('⭐⭐ the `pass.targetGid === p.gid` STRIKE GATE (the receiver\'s first news)',
  BRAIN_PATH, '    if (pass && pass.side === team.side && pass.targetGid === p.gid) {', 1);
anchor('⭐⭐ the `ReceivePass` score literal 1.2', BRAIN_PATH,
  "      cands.push({ action: 'ReceivePass', score: 1.2, why: 'pass is coming to me' });", 1);
/* --- the TICK INDEXING (RC-C0 §P.A's three sites) --- */
anchor('the wind-up record\'s `readyTick` composition', MATCH_PATH,
  '      readyTick: this.stepCount + wTicks + bkTicks,', 1);
anchor('the head-of-step resolve CALL (the release tick)', MATCH_PATH,
  '    if (this.pendingPassWindup !== null) this.resolvePendingPassWindup();', 1);
anchor('the resolve\'s own guard', MATCH_PATH,
  '    if (!this.o1PassWindup || pp === null || this.stepCount < pp.readyTick) return;', 1);
/* --- WORLD 12's own composition, CALLED never copied --- */
anchor('⭐ world 12\'s flag composition', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1);
anchor('⭐ world 12\'s arming line (world 11\'s arming + the two exam pins)', A4_PATH,
  '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);', 1);
/* --- THE PRE-CUE SEAM UNDER EXAM: the ONE read and the ONE arm call --- */
anchor('⭐⭐ THE ONE PRE-CUE READ\'s branch head (the seam under exam)', MATCH_PATH,
  '        if (this.rcAnticipate && w.klass === \'passRelease\' && w.rel === \'own\'', 1);
anchor('⭐⭐ THE ONE `seat.arm(...)` CALL that carries the pre-cue', MATCH_PATH,
  '        seat.arm(gid, p.rosterIdx, side, w.klass, key, this.stepCount, preCue);', 1);
anchor('⭐⭐ the hold law\'s ONE home (`preCueTicks`, at the tiers\' own address)', PCLAT_PATH,
  'export const preCueTicks = (', 1);
anchor('⭐ the ledger\'s own pre-cue counter (PLUMBING, never an effect size)', PCLAT_PATH,
  '    if (preCued) this.ledger.preCuedArms++;', 1);
anchor('⭐⭐ RC_PRECUE_FLOOR_TICKS — DERIVED, the honest ceiling of purchasable benefit',
  RCSEAT_PATH, 'export const RC_PRECUE_FLOOR_TICKS =', 1, RC_PRECUE_FLOOR_TICKS);
/* --- PT-C0's own limbs: the A4 spacing/dup-run constants and the BK sector classifier --- */
anchor('⭐⭐ DUP_RUN_M — the A4 battery I6 duplicate-run bucket (NO new constant)',
  A4P1C_PATH, 'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)',
  1, 4);
anchor('⭐⭐ SAMPLE_EVERY — the A4 battery\'s own 6 Hz spacing-sample cadence', A4P1C_PATH,
  "const SAMPLE_EVERY = 10; // the battery's 6 Hz spacing-sample cadence (shape exhibit)", 1, 10);
anchor('⭐⭐ the `BodySector` TYPE, read off its own union', PHYS_PATH,
  "export type BodySector = 'front' | 'side' | 'back';", 1);
anchor('⭐⭐ the BK LAW\'S OWN sector assignment (the classifier this probe CALLS)', PHYS_PATH,
  '  const sector: BodySector = facingCos >= Math.SQRT1_2\n'
  + "    ? 'front'\n"
  + '    : facingCos <= -Math.SQRT1_2\n'
  + "      ? 'back'\n"
  + "      : 'side';", 1);
/* --- THE E4 WATCHABILITY DEFINITIONS: ONE anchored definition each, REUSED --- */
anchor('⭐⭐ E4 `forwardPassShare` — mt-ladder.ts\'s OWN definition, reused not re-invented',
  MTL_PATH,
  '    forwardPassShare: passes === 0 ? Number.NaN : '
  + '(st[0].passesForward + st[1].passesForward) / passes,', 1);
anchor('⭐ E4 `thirdMan` — the engine\'s own completed third-man release site', MATCH_PATH,
  '        if (pass.bounce && p.gid === pass.targetGid) team.stats.thirdMan++;', 1);
anchor('⭐ E4 `overlaps` — the engine\'s own completed overlap release site', MATCH_PATH,
  "        if (team.overlapper === p.index && Math.abs(p.pos.y) > 11) team.stats.overlaps++;", 1);
anchor('⭐⭐ E4 CHAIN LENGTH — the engine\'s OWN possession-chain ledger site', MATCH_PATH,
  '    if (n > team.stats.bestPassChain) team.stats.bestPassChain = n;', 1);
anchor('⭐ E4 CHAIN LENGTH\'s declared meaning, at its own home', TYPES_PATH,
  '  /** Longest chain of consecutive completed passes in one move (Phase 33). */', 1);
anchor('⭐ E4 `passesForward` — the engine\'s own forward-pass sites (5 honest occurrences)',
  MECH_PATH, 'team.stats.passesForward++;', 5);

/** ⭐⭐ THE FIVE `ticks at w = 1` VALUES — DERIVED at gate time from the IMPORTED function
 *  and compared to RC-T0 §1's printed column (#370 item 3(i): "RC-T1a's instrument pins all
 *  five as anchored fixtures"). ⛔ The expectation is the DOC's column; the got side is the
 *  law's own arithmetic. */
const TICKS_AT_W1_EXPECTED: readonly number[] = [17, 24, 26, 26, 27];
const TICKS_AT_W1_DERIVED: readonly number[] = [1, 2, 3, 4, 5].map((r) => preCueTicks(
  PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, RC_BELIEF_BY_RANK[r - 1],
));
const TICKS_COLUMN_PINNED = JSON.stringify(TICKS_AT_W1_DERIVED)
  === JSON.stringify(TICKS_AT_W1_EXPECTED);

const DUP_RUN_M = ANCHORS.find((a) => a.needle.startsWith('const DUP_RUN_M'))!
  .extracted as number;
const SAMPLE_EVERY = ANCHORS.find((a) => a.needle.startsWith('const SAMPLE_EVERY'))!
  .extracted as number;
/** THE SECTOR VOCABULARY — read off `BodySector`'s own union, never re-typed */
const SECT_NEEDLE = "export type BodySector = 'front' | 'side' | 'back';";
const SECTORS = ((srcOf(PHYS_PATH).slice(
  srcOf(PHYS_PATH).indexOf(SECT_NEEDLE), srcOf(PHYS_PATH).indexOf(SECT_NEEDLE) + SECT_NEEDLE.length,
).match(/'([a-z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly BodySector[];

const ANCHORS_OK = ANCHORS.every((a) => a.ok)
  && PTP_FLIGHT_SPEED === 18 && AI_INTERVAL === 0.15
  && PC_TIER_SIMPLE_TICKS === 12 && PC_TIER_CHOICE_TICKS === 27
  && RC_PRECUE_FLOOR_TICKS === 17
  && RA_WORLD_VERSION === 12 && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1
  && DUP_RUN_M === 4 && SAMPLE_EVERY === 10
  && SECTORS.length === 3 && JSON.stringify(SECTORS) === JSON.stringify(['front', 'side', 'back'])
  && RC_BELIEF_BY_RANK.length === 5
  && TICKS_COLUMN_PINNED;

/* ========================================================================== */
/* §4 THE DOSES — the SHIPPED LOADERS CALLED, the BYTES HASHED AND PINNED       */
/* ========================================================================== */
/** ⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a
 *  self-declared field" (home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6).
 *  PT-C0 §COMMANDER CORRECTIONS item 2's own order: "any future dosed arm PINS those two
 *  byte-hashes as expected values". The two expected values below are READ OF RECORD from
 *  PT-C0's artifact `doseSource.files` (published then, PINNED now). ⛔ If either differs the
 *  instrument REFUSES TO RUN — a dose is never approximated. */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_SHA_EXPECTED = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_SHA_EXPECTED = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
const DOSE_BYTES_MATCH = L3_DOSE_BYTES_SHA === L3_DOSE_SHA_EXPECTED
  && PC_DOSE_BYTES_SHA === PC_DOSE_SHA_EXPECTED;
if (!DOSE_BYTES_MATCH) {
  banner('RC-T1A FATAL — a dose file\'s BYTES differ from the PINNED expected value:');
  banner(`  ${L3_DOSE_FILE}\n    want ${L3_DOSE_SHA_EXPECTED}\n    got  ${L3_DOSE_BYTES_SHA}`);
  banner(`  ${PC_DOSE_FILE}\n    want ${PC_DOSE_SHA_EXPECTED}\n    got  ${PC_DOSE_BYTES_SHA}`);
  banner('  ⛔ a dose is NEVER approximated (#370 item 5(i) / PT-C0 §CORR 2). STOPPING.');
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
  banner(`RC-T1A FATAL — the DOSED arms are not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}
const L3_CELLS_POOLED = (L3_DOSE as readonly L3DoseCell[]).length;
const PC_ROWS_POOLED = (PC_DOSE as PcDoseTable).length;

/* ========================================================================== */
/* §5 SEEDS — block 12,535,000–999 (#370 item 5(iv)); the FOUR ARMS SHARE SEEDS */
/* ========================================================================== */
const BLOCK_BASE = 12_535_000;
const BLOCK_TOP = 12_535_999;
/** ⭐⭐ N_FROZEN — sized at §DEV-PREFLIGHT by the disclosed 12-pair scratch smoke BEFORE the
 *  freeze commit and BEFORE any battery seed. The three declared targets are (a) 0.5 m (HALF
 *  the honest ceiling of ≈ 1 m), (b1) 0.010 and (b2) 1.0/match; N_FROZEN is the LARGEST
 *  requirement, capped by what THIS block affords after the ladder and the receipt are
 *  reserved (997 pairs), and what the block cannot resolve is DECLARED in the sizing table.
 *  ⭐ THE BLOCK'S OWN PARTITION, so no seed is ever used twice: battery 12,535,000 … +N−1 ·
 *  the SEASON LADDER's two LEAGUE seeds 12,535,997–998 · the construction receipt 12,535,999. */
const N_MAX_PAIRS = 997;
const N_FROZEN = 579;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_100;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [900_002_190, 900_002_191];
/** ⭐ the SEASON LADDER's own league seeds — inside THIS stage's own authorized block and
 *  DISJOINT from every battery seed; every ladder MATCH seed is DERIVED from them through the
 *  SHIPPED `hashSeed`, the `League.createMatch` idiom. */
const LADDER_SEEDS = IS_SCRATCH_RUN ? [SCRATCH_BASE + 30] : [12_535_997, 12_535_998];

/* ========================================================================== */
/* §6 THE FOUR ARMS — the world's own composer CALLED; the match-local gene idiom */
/* ========================================================================== */
const ARMS = ['E-SHUT', 'E-ARMED', 'D-SHUT', 'D-ARMED'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  'E-SHUT': 'world 12 EMPTY-BOOK, flag ABSENT + gene ABSENT — exactly the world the entry IS',
  'E-ARMED': 'E-SHUT + `rcAnticipate: true` + `rcAnticipationWeight` = 1 MATCH-LOCAL, both teams',
  'D-SHUT': 'world 12 DOSED (PT-C0 arm A\'s composition), flag ABSENT + gene ABSENT',
  'D-ARMED': 'D-SHUT + `rcAnticipate: true` + `rcAnticipationWeight` = 1 MATCH-LOCAL, both teams',
};
const PAIRS = [
  { key: 'E', shut: 'E-SHUT' as Arm, armed: 'E-ARMED' as Arm, form: 'EMPTY-BOOK (the exam form — SCORED)' },
  { key: 'D', shut: 'D-SHUT' as Arm, armed: 'D-ARMED' as Arm, form: 'DOSED (the form the user plays — REPORTED)' },
] as const;
const isArmed = (a: Arm): boolean => a === 'E-ARMED' || a === 'D-ARMED';
const isDosed = (a: Arm): boolean => a === 'D-SHUT' || a === 'D-ARMED';
/** the exam-pinned MAXIMUM (the DX-T1 / RA-T1B idiom): measure the mechanism at full
 *  expression; the SEASON LADDER is where selection speaks. */
const RC_GENE_VALUE = 1;

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/**
 * ⭐⭐ THE MATCH-LOCAL GENE IDIOM, COPIED FROM `setRaGenes` (a4World.ts) — the ratified dosing
 * form (canon: dose placement, ruling #270.2 / #334 item 1): `baseGenome` and `effGenome` are
 * replaced by SPREAD COPIES and **`info.genome` is NEVER touched**. The spread CARRIES world
 * 12's own two pins (`passLeadSupport` = 1, `raAccessWeight` = 1) forward, because it spreads
 * the view `setRaGenes` already wrote inside `armA4World`. Called AFTER `armA4World`.
 */
const setRcGeneLocal = (match: Match, side: Side): void => {
  const team = match.teams[side];
  const view = {
    ...team.baseGenome, rcAnticipationWeight: RC_GENE_VALUE,
  } as TacticalGenome;
  team.baseGenome = view;
  team.effGenome = view;
};
/**
 * ⭐⭐ RC-C0 / PT-C0's own population construction (the same genome/squad/side/seed plumbing
 * and the same 240 s match), so arm k walks seed s with the IDENTICAL population and the four
 * arms differ ONLY in the flag, the gene and the dose — which is what makes every Δ PAIRED.
 */
const buildMatch = (seed: number, arm: Arm): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  const m = new Match({
    ...base,
    ...a4MatchFlags(RA_WORLD_VERSION),
    ...(isArmed(arm) ? { rcAnticipate: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (isDosed(arm)) armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, RA_WORLD_VERSION);
  if (isArmed(arm)) for (const side of [0, 1] as const) setRcGeneLocal(m, side);
  return m;
};

/* ========================================================================== */
/* §7 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   (canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"; home:
   DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2. REFINED at #334 item 2: "anchored
   extraction protects the source line; a headline-bearing walk-side predicate ALSO needs a
   composition fixture")                                                                     */
/* ========================================================================== */
/** ⭐⭐ THE ACCESS-TIME ACCOUNT — DX-C2 §P.A via RC-C0 §P.B, byte for byte in substance. */
const marginOf = (dBallPath: number, dMate: number, topSpeed: number): number =>
  dBallPath / PTP_FLIGHT_SPEED - (dMate / Math.max(topSpeed, 0.1) + 0.15);
const meetableOf = (dMate: number, margin: number): boolean =>
  dMate <= CONTROL_RADIUS || margin >= 0;
/** ⭐⭐ RC-C0 §P.D's `predictedArrDist`, REUSED — where the account says he stands at arrival. */
const predictedArrDistOf = (dBallPath: number, dMate: number, topSpeed: number): number => {
  const tBall = dBallPath / PTP_FLIGHT_SPEED;
  const chase = Math.max(0, tBall - 0.15) * Math.max(topSpeed, 0.1);
  return Math.max(0, dMate - chase);
};
/** ⭐ PT-C0 (i)'s A4 limbs, reused with their own anchored constants. */
const nearestMateOf = (xs: readonly number[], ys: readonly number[], a: number): number => {
  let nearest = Number.POSITIVE_INFINITY;
  for (let b = 0; b < xs.length; b++) {
    if (a === b) continue;
    const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
    if (dd < nearest) nearest = dd;
  }
  return nearest;
};
const dupRunPairsOf = (xs: readonly number[], ys: readonly number[]): number => {
  let n = 0;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      if (Math.hypot(xs[a] - xs[b], ys[a] - ys[b]) < DUP_RUN_M) n += 1;
    }
  }
  return n;
};
const minPairwiseOf = (xs: readonly number[], ys: readonly number[]): number => {
  let m = Number.POSITIVE_INFINITY;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
      if (dd < m) m = dd;
    }
  }
  return m;
};
/** ⭐⭐ PT-C0 (iii)'s delivery classifier and ground/measured tests (RA-T1B's own), reused. */
type Klass = 'shot' | 'headerShot' | 'headerClearance' | 'headerKnockdown' | 'clearance'
  | 'cross' | 'cutback' | 'throughBall' | 'loftedPass' | 'shortPass' | 'keeperThrow' | 'other';
interface StatDelta {
  shots: number; clearances: number; passes: number; crosses: number; cutbacks: number;
  throughBalls: number; longBalls: number; headersWon: number;
}
const klassOf = (d: StatDelta, pendingChangedHere: boolean): Klass | null => {
  let klass: Klass | null = null;
  if (d.shots > 0) klass = d.headersWon > 0 ? 'headerShot' : 'shot';
  if (d.clearances > 0 && klass === null) {
    klass = d.headersWon > 0 ? 'headerClearance' : 'clearance';
  }
  if (d.passes > 0 && klass === null) {
    klass = d.crosses > 0 ? 'cross'
      : d.cutbacks > 0 ? 'cutback'
        : d.throughBalls > 0 ? 'throughBall'
          : d.longBalls > 0 ? 'loftedPass' : 'shortPass';
  }
  if (d.headersWon > 0 && klass === null) klass = 'headerKnockdown';
  if (klass === null && pendingChangedHere) klass = 'other';
  return klass;
};
const isDelivery = (k: Klass): boolean =>
  k !== 'shot' && k !== 'headerShot' && k !== 'headerKnockdown' && k !== 'headerClearance';
const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>
  grounded || !(vzAfterGravity > 0);
const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>
  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');
/** ⭐⭐ PT-C0 (iii)'s FIRST-CONTACT CLASSES, reused byte for byte in substance. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
/** ⭐ DX-C2's own FOUR-WAY outcome ladder, reused — first terminal wins, TEMPORAL not causal. */
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');
/**
 * ⭐⭐ THE PRE-CUED HOLD'S OWN RANK, recovered from the record's stored `belief` — the
 * TIER-TRANSITION CURVE's key (M-PC.1b's own honest limit: the interpolation FORM is a choice,
 * so the curve is published and a non-linear reality would show). Rank 0 = "no cue / a rank the
 * census never saw", which `rcBeliefForRank` prices at belief 0 (⇒ the CHOICE tier exactly).
 * PURE — an exact float comparison against the seat's own frozen table.
 */
const rankOfBelief = (belief: number): number => {
  for (let r = 1; r <= RC_BELIEF_BY_RANK.length; r++) {
    if (belief === RC_BELIEF_BY_RANK[r - 1]) return r;
  }
  return 0;
};

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* THE ACCOUNT (RC-C0's own fixtures, re-walked) */
fx('marginOf.toFeet10m', marginOf(10, 0, 8), 10 / 18 - 0.15);
fx('marginOf.lead7mSlow', marginOf(15, 7, 7) < 0, true);
fx('marginOf.shortReachable', marginOf(9, 2, 8) > 0, true);
fx('meetable.presence', meetableOf(CONTROL_RADIUS * 0.5, -9), true);
fx('meetable.positiveMargin', meetableOf(5, 0.01), true);
fx('meetable.zeroMargin', meetableOf(5, 0), true);
fx('meetable.unmeetable', meetableOf(5, -0.01), false);
/* THE ARRIVAL READ's own prediction */
fx('predictedArrDist.standStill', predictedArrDistOf(2, 0, 8), 0);
fx('predictedArrDist.chaseCloses',
  predictedArrDistOf(18, 4, 8), Math.max(0, 4 - (1 - 0.15) * 8));
fx('predictedArrDist.floorAtZero', predictedArrDistOf(36, 1, 8), 0);
/* THE A4 LIMBS */
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.nearestSingleton', !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.noneAtSixMetres', dupRunPairsOf([0, 6, 12], [0, 0, 0]), 0);
fx('dupRun.onePairInsideFour', dupRunPairsOf([0, 3, 12], [0, 0, 0]), 1);
fx('dupRun.threePairsAllInside', dupRunPairsOf([0, 1, 2], [0, 0, 0]), 3);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('minPairwise.singleton', !Number.isFinite(minPairwiseOf([1], [1])), true);
/* THE DELIVERY / GROUND / MEASURED PREDICATES */
const D0: StatDelta = {
  shots: 0, clearances: 0, passes: 0, crosses: 0, cutbacks: 0,
  throughBalls: 0, longBalls: 0, headersWon: 0,
};
fx('klassOf.shortPass', klassOf({ ...D0, passes: 1 }, false), 'shortPass');
fx('klassOf.shotBeatsPass', klassOf({ ...D0, shots: 1, passes: 1 }, false), 'shot');
fx('klassOf.longBallIsLofted', klassOf({ ...D0, passes: 1, longBalls: 1 }, false), 'loftedPass');
fx('klassOf.null', klassOf(D0, false), null);
fx('isDelivery.shortPass', isDelivery('shortPass'), true);
fx('isDelivery.shotIsNot', isDelivery('shot'), false);
fx('isGroundLaunch.grounded', isGroundLaunch(true, 9), true);
fx('isGroundLaunch.risingIsNot', isGroundLaunch(false, 0.1), false);
fx('isGroundLaunch.fallingIs', isGroundLaunch(false, -0.1), true);
fx('measurable.shortPassWithTarget', isMeasurableGroundPass('shortPass', true, true), true);
fx('measurable.loftedIsNot', isMeasurableGroundPass('loftedPass', true, true), false);
fx('measurable.noTargetIsNot', isMeasurableGroundPass('shortPass', true, false), false);
fx('measurable.airborneIsNot', isMeasurableGroundPass('cutback', false, true), false);
/* THE OUTCOME LADDER and THE CONTACT CLASSES */
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.intercepted', outcomeOf(false, true, true), 'intercepted');
fx('outcomeOf.out', outcomeOf(false, false, true), 'out');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');
fx('contact.none', contactClassOf(null, 4, null, 0), 'none');
fx('contact.ownTarget', contactClassOf(4, 4, 0, 0), 'ownTarget');
fx('contact.ownNonTarget', contactClassOf(5, 4, 0, 0), 'ownNonTarget');
fx('contact.opponent', contactClassOf(9, 4, 1, 0), 'opponent');
/* THE LAW'S OWN SECTOR CLASSIFIER, CALLED on constructed geometries */
const sectorFx = (
  bx: number, by: number, hx: number, hy: number, ballX: number, ballY: number,
): BodySector => ballAccessGeometry(
  { pos: { x: bx, y: by }, bodyDir: { x: hx, y: hy }, coreRadius: 0.3 },
  { pos: { x: ballX, y: ballY }, radius: 0.11 },
  CONTROL_RADIUS,
).sector;
fx('sector.frontWhenBallAhead', sectorFx(0, 0, 1, 0, 1, 0), 'front');
fx('sector.backWhenBallBehind', sectorFx(0, 0, 1, 0, -1, 0), 'back');
fx('sector.sideWhenBallAbeam', sectorFx(0, 0, 1, 0, 0, 1), 'side');
fx('sector.frontAt44Degrees', sectorFx(0, 0, 1, 0, Math.cos(0.76), Math.sin(0.76)), 'front');
fx('sector.sideAt46Degrees', sectorFx(0, 0, 1, 0, Math.cos(0.81), Math.sin(0.81)), 'side');
fx('sector.backAt136Degrees', sectorFx(0, 0, 1, 0, Math.cos(2.38), Math.sin(2.38)), 'back');
fx('sector.vocabularyIsTheUnions', SECTORS, ['front', 'side', 'back']);
/* THE HOLD LAW AT w = 1 — the five anchored fixtures (#370 item 3(i)) */
fx('ticksAtW1.allFive', TICKS_AT_W1_DERIVED, TICKS_AT_W1_EXPECTED);
fx('ticksAtW1.rank1IsTheCeiling', TICKS_AT_W1_DERIVED[0], RC_PRECUE_FLOOR_TICKS);
fx('ticksAtW1.rank5IsTheChoiceTier', TICKS_AT_W1_DERIVED[4], PC_TIER_CHOICE_TICKS);
fx('preCueTicks.zeroWeightIsTheIdentity',
  preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 0, 1), PC_TIER_CHOICE_TICKS);
fx('preCueTicks.zeroBeliefIsTheIdentity',
  preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, 0), PC_TIER_CHOICE_TICKS);
fx('preCueTicks.fullBeliefIsTheSimpleFloor',
  preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, 1), PC_TIER_SIMPLE_TICKS);
fx('rankOfBelief.rank1', rankOfBelief(RC_BELIEF_BY_RANK[0]), 1);
fx('rankOfBelief.rank5', rankOfBelief(RC_BELIEF_BY_RANK[4]), 5);
fx('rankOfBelief.zeroIsRankZero', rankOfBelief(0), 0);
fx('rankOfBelief.unknownIsRankZero', rankOfBelief(0.5), 0);
/* THE BIN HELPERS */
fx('binOf.first', binOf(0.4, 0.5, 61), 0);
fx('binOf.overflow', binOf(999, 0.5, 61), 60);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 21), 10);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 21), 0);
fx('signedBinOf.overflow', signedBinOf(999, 1, 21), 20);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed)   */
/* ========================================================================== */
const SD_BIN_TICKS = 1;
const SD_BINS = 41;                // start delay 0–39 ticks, last is overflow (RC-C0's own)
const PC_HOLD_BINS = 41;           // APPLIED held ticks 0–39, last is overflow (RC-C0's own)
const HOLD_BINS = 31;              // pre-cued hold ticks 0–29, last is overflow
const CAL_BIN_M = 0.5;
const CAL_BINS = 13;               // (measured − predicted) signed — DX-C2 / RC-C0's own grid
const ALONG_BIN_M = 1;
const ALONG_BINS = 21;             // signed along-line offset at arrival
const LAT_BIN_M = 0.5;
const LAT_BINS = 21;               // lateral offset at arrival, last is overflow
const NEAR_BIN_M = 0.5;
const NEAR_BINS = 61;              // nearest-mate distance 0–30 m, last is overflow (PT-C0's)
const MINPAIR_BIN_M = 0.5;
const MINPAIR_BINS = 61;           // the side's min pairwise distance, the same grid
const FLIGHT_RETIRE_TICKS = 720;   // R9's own retire cap, inherited (BK-C1 §3 / DX-C2 §8)
/** the WINDOW groups: the whole released population, the carried class, the MEETABLE carried */
const WGROUPS = ['all', 'carried', 'meetableCarried'] as const;
const NWG = WGROUPS.length;
/** the GAP / ANATOMY groups — RC-C0 §P.D's face re-measured, meetableCarried PRIMARY */
const GGROUPS = ['carried', 'meetableCarried'] as const;
const NGG = GGROUPS.length;
const NRANK = RC_BELIEF_BY_RANK.length + 1;   // rank 0 (no cue) + ranks 1..5

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots',
  'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls', 'headersWon',
  'passesForward', 'thirdMan', 'overlaps', 'bestPassChain'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  /* the world / gene / dose receipts */
  worldOk: boolean; armedVersion: number; rcFlag: boolean; geneOk: boolean; genomeClean: boolean;
  ticks: number; matches: number; wallMs: number;
  /* the wind-up population (engine receipts, never football findings) */
  windupsArmed: number; windupsReleased: number;
  byDelivCarried: number; byDelivCarriedMeetable: number;
  /* (b) THE WINDOW, per WGROUP */
  wSum: number[]; wN: number[];
  sdSum: number[]; sdN: number[]; sdBins: number[][]; sdCensored: number[];
  pcHoldSum: number[]; pcHoldN: number[]; pcHoldObsDen: number[]; pcHoldBins: number[][];
  /* (a) THE GAP, per GGROUP — RC-C0 §P.D's face */
  gapPredSum: number[]; gapMeasSum: number[]; gapN: number[]; gapDiffBins: number[][];
  /* the arrival anatomy, per GGROUP */
  agN: number[]; reachedN: number[];
  alongSum: number[]; alongN: number[]; alongBins: number[][];
  latSum: number[]; latN: number[]; latBins: number[][];
  outc: number[][];
  /* ⭐ THE MECHANISM RECEIPT — the seat's OWN ledger, and the tier-transition curve */
  preCuedArms: number; armedHolds: number; armedSimple: number; armedChoice: number;
  preCueHoldBins: number[][];      // [RANK][HOLD_BINS] — the TIER-TRANSITION CURVE
  preCueTickSum: number[]; preCueTickN: number[];
  /* the user's three PT-C0 faces */
  gpMeasured: number; gpFlights: number;
  contactClass: number[]; recvSector: number[]; recvSectorN: number;
  crowdSamples: number; spacingSum: number; spacingSamples: number;
  dupRunSum: number; crashHits: number; minPairN: number;
  nearBins: number[]; minPairBins: number[];
  /* context (the 240 s match clock) */
  stats: Record<StatKey, number>;
}
const emptyStats = (): Record<StatKey, number> => Object.fromEntries(
  STAT_KEYS.map((k) => [k, 0]),
) as Record<StatKey, number>;
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1, rcFlag: false, geneOk: false, genomeClean: false,
  ticks: 0, matches: 1, wallMs: 0,
  windupsArmed: 0, windupsReleased: 0,
  byDelivCarried: 0, byDelivCarriedMeetable: 0,
  wSum: zeros(NWG), wN: zeros(NWG),
  sdSum: zeros(NWG), sdN: zeros(NWG), sdBins: zeros2(NWG, SD_BINS), sdCensored: zeros(NWG),
  pcHoldSum: zeros(NWG), pcHoldN: zeros(NWG), pcHoldObsDen: zeros(NWG),
  pcHoldBins: zeros2(NWG, PC_HOLD_BINS),
  gapPredSum: zeros(NGG), gapMeasSum: zeros(NGG), gapN: zeros(NGG),
  gapDiffBins: zeros2(NGG, CAL_BINS),
  agN: zeros(NGG), reachedN: zeros(NGG),
  alongSum: zeros(NGG), alongN: zeros(NGG), alongBins: zeros2(NGG, ALONG_BINS),
  latSum: zeros(NGG), latN: zeros(NGG), latBins: zeros2(NGG, LAT_BINS),
  outc: zeros2(NGG, OUTCOMES.length),
  preCuedArms: 0, armedHolds: 0, armedSimple: 0, armedChoice: 0,
  preCueHoldBins: zeros2(NRANK, HOLD_BINS),
  preCueTickSum: zeros(NRANK), preCueTickN: zeros(NRANK),
  gpMeasured: 0, gpFlights: 0,
  contactClass: zeros(CONTACTS.length), recvSector: zeros(SECTORS.length), recvSectorN: 0,
  crowdSamples: 0, spacingSum: 0, spacingSamples: 0,
  dupRunSum: 0, crashHits: 0, minPairN: 0,
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  stats: emptyStats(),
});

/* ========================================================================== */
/* §10 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER     */
/* ========================================================================== */
interface Windup {
  key: string; t0: number; gid: number; targetGid: number; readyTick: number;
  eX: number; eY: number; hasLead: boolean;
  meetable: boolean; predictedArrDist: number;
}
/** the WIND-UP flight — RC-C0's (b)+(c) object, trimmed to this exam's faces */
interface WuFlight {
  gid: number; targetGid: number; releaseTick: number;
  eX: number; eY: number; hasLead: boolean; meetable: boolean; predictedArrDist: number;
  launchX: number; launchY: number; L: number; ux: number; uy: number;
  wTicks: number; live: boolean;
  reachedPoint: boolean; arrDist: number; alongOffset: number; lateral: number;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  startDelayTicks: number | null; pcHoldTicks: number | null; pcHoldSearched: boolean;
}
/** the GROUND-PASS flight — PT-C0's (iii) object, trimmed to the user's two faces */
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  contactGid: number | null; contactClass: ContactClass;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  recvSector: BodySector | null;
}

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const wantArmed = isArmed(arm);
  row.armedVersion = raArmedVersion(m);
  row.rcFlag = (m as unknown as { rcAnticipate: boolean }).rcAnticipate === true;
  row.geneOk = ([0, 1] as const).every((s) => {
    const eff = m.teams[s].effGenome as TacticalGenome;
    const bas = m.teams[s].baseGenome as TacticalGenome;
    const raPins = eff.passLeadSupport === RA_WORLD_LEAD && eff.raAccessWeight === RA_WORLD_WEIGHT
      && bas.passLeadSupport === RA_WORLD_LEAD && bas.raAccessWeight === RA_WORLD_WEIGHT;
    const rcOk = wantArmed
      ? (eff.rcAnticipationWeight === RC_GENE_VALUE && bas.rcAnticipationWeight === RC_GENE_VALUE
        && rcAnticipationWeightOf(eff) === RC_GENE_VALUE)
      : (eff.rcAnticipationWeight === undefined && bas.rcAnticipationWeight === undefined
        && rcAnticipationWeightOf(eff) === null);
    return raPins && rcOk;
  });
  row.worldOk = row.armedVersion === RA_WORLD_VERSION && row.rcFlag === wantArmed && row.geneOk;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome;
    return g.rcAnticipationWeight === undefined && g.raAccessWeight === undefined
      && g.passLeadSupport === undefined && g.dvExposureWeight === undefined;
  });
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: { x: number; y: number }; targetGid: number;
      aimLead: { x: number; y: number } | null;
    } | null;
    /** ⭐ THE PRIVATE HOLDS MAP, read BYTE-INERTLY: a pure `Map.get` / iteration. ⛔ the
     *  mutating `holdFor` accessor (which DELETES expired holds) is NEVER called. */
    pcLatency: {
      holds: Map<number, { untilTick: number; ticks: number; armedTick: number;
        klass: string; preCued: boolean; belief: number }>;
      ledger: { preCuedArms: number; armedByTier: { simple: number; choice: number } };
    } | null;
  };
  const players = m.allPlayers;

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let wu: Windup | null = null;
  let endedWindup: Windup | null = null;
  let flight: WuFlight | null = null;
  let gp: GpFlight | null = null;

  /* ---------- BOOKING: the wind-up flight's (b) + (a) + anatomy faces ---------- */
  const bookWuFlight = (f: WuFlight): void => {
    const wg: number[] = [0];
    const gg: number[] = [];
    if (f.hasLead) {
      wg.push(1); gg.push(0);
      if (f.meetable) { wg.push(2); gg.push(1); }
    }
    for (const gi of wg) {
      row.wSum[gi] += f.wTicks;
      row.wN[gi] += 1;
      if (f.startDelayTicks === null) row.sdCensored[gi] += 1;
      else {
        row.sdSum[gi] += f.startDelayTicks;
        row.sdN[gi] += 1;
        row.sdBins[gi][binOf(f.startDelayTicks, SD_BIN_TICKS, SD_BINS)] += 1;
      }
      row.pcHoldObsDen[gi] += 1;
      if (f.pcHoldTicks !== null) {
        row.pcHoldSum[gi] += f.pcHoldTicks;
        row.pcHoldN[gi] += 1;
        row.pcHoldBins[gi][binOf(f.pcHoldTicks, 1, PC_HOLD_BINS)] += 1;
      }
    }
    for (const gi of gg) {
      row.agN[gi] += 1;
      row.outc[gi][OI(outcomeOf(f.completedHere, f.interceptedHere, f.wentDead))] += 1;
      if (f.reachedPoint && Number.isFinite(f.arrDist)) {
        row.reachedN[gi] += 1;
        /* ⭐⭐ (a) THE GAP — RC-C0 §P.D's face byte for byte */
        row.gapPredSum[gi] += f.predictedArrDist;
        row.gapMeasSum[gi] += f.arrDist;
        row.gapN[gi] += 1;
        row.gapDiffBins[gi][
          signedBinOf(f.arrDist - f.predictedArrDist, CAL_BIN_M, CAL_BINS)] += 1;
        row.alongSum[gi] += f.alongOffset; row.alongN[gi] += 1;
        row.alongBins[gi][signedBinOf(f.alongOffset, ALONG_BIN_M, ALONG_BINS)] += 1;
        row.latSum[gi] += f.lateral; row.latN[gi] += 1;
        row.latBins[gi][binOf(f.lateral, LAT_BIN_M, LAT_BINS)] += 1;
      }
    }
    if (f.hasLead) {
      row.byDelivCarried += 1;
      if (f.meetable) row.byDelivCarriedMeetable += 1;
    }
  };
  const retireWu = (): void => { if (flight !== null) { bookWuFlight(flight); flight = null; } };
  const bookGp = (f: GpFlight): void => {
    row.gpFlights += 1;
    row.contactClass[CTI(f.contactClass)] += 1;
    if (f.recvSector !== null) {
      row.recvSector[SECTORS.indexOf(f.recvSector)] += 1;
      row.recvSectorN += 1;
    }
  };
  const retireGp = (): void => { if (gp !== null) { bookGp(gp); gp = null; } };

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    const ball = m.ball;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';

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
    const lastTouch = ball.lastTouch;

    /* ---------- ⭐⭐ THE MECHANISM RECEIPT: newly-armed PRE-CUED holds, by RANK ----------
       ⭐ THE TICK INDEXING OF `armedTick`, MEASURED not assumed: `arm()` is called with
       `this.stepCount` as it stands DURING the step, which is ONE LESS than the `simTick` the
       probe reads AFTER `m.step(DT)`. So a hold armed inside the step that ends at tick S
       carries `armedTick === S − 1`, and that test selects each pre-cued arm EXACTLY ONCE.
       `gPreCueLedgerAgrees` proves it: this histogram's own n equals the seat's OWN ledger
       counter `preCuedArms` on every walked match, in every arm.
       ⚠ NOT the same test as the receiver's pcHold match below: the `passRelease` event of
       step S is DETECTED by the head-of-step detector in step S + 1, so the receiver's own
       hold carries `armedTick === releaseTick` — RC-C0 §P.D's own read, unchanged. */
    if (mm.pcLatency !== null) {
      for (const h of mm.pcLatency.holds.values()) {
        if (h.armedTick !== tick - 1 || !h.preCued) continue;
        const r = rankOfBelief(h.belief);
        row.preCueHoldBins[r][binOf(h.ticks, 1, HOLD_BINS)] += 1;
        row.preCueTickSum[r] += h.ticks;
        row.preCueTickN[r] += 1;
      }
    }

    /* ---------- (i) 挤人 — PT-C0's A4 limbs at the A4 battery's own cadence ---------- */
    if (tick % SAMPLE_EVERY === 0 && playing) {
      const ownerGid = ball.owner?.gid ?? null;
      const possSide: Side | null = ownerGid !== null ? players[ownerGid].side as Side
        : (gp !== null ? gp.passerSide : null);
      if (possSide !== null) {
        const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
        const xs = outs.map((q) => q.pos.x);
        const ys = outs.map((q) => q.pos.y);
        row.crowdSamples += 1;
        for (let a = 0; a < xs.length; a++) {
          const nearest = nearestMateOf(xs, ys, a);
          if (Number.isFinite(nearest)) {
            row.spacingSum += nearest;
            row.spacingSamples += 1;
            row.nearBins[binOf(nearest, NEAR_BIN_M, NEAR_BINS)] += 1;
          }
        }
        row.dupRunSum += dupRunPairsOf(xs, ys);
        const mp = minPairwiseOf(xs, ys);
        if (Number.isFinite(mp)) {
          row.minPairN += 1;
          row.minPairBins[binOf(mp, MINPAIR_BIN_M, MINPAIR_BINS)] += 1;
          if (mp < DUP_RUN_M) row.crashHits += 1;
        }
      }
    }

    /* ---------- THE WIND-UP RECORD: arm · end · release (RC-C0's tick indexing) ---------- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    endedWindup = null;
    if (wu !== null && key !== wu.key) {
      const released = passChangedHere && pp !== null && pp.passerGid === wu.gid
        && pp.targetGid === wu.targetGid && tick >= wu.readyTick;
      endedWindup = wu;
      if (released) {
        row.windupsReleased += 1;
        retireWu();
        const ox = ball.pos.x - ball.vel.x * DT;
        const oy = ball.pos.y - ball.vel.y * DT;
        const ux0 = wu.eX - ox;
        const uy0 = wu.eY - oy;
        const L = Math.sqrt(ux0 * ux0 + uy0 * uy0);
        flight = {
          gid: wu.gid, targetGid: wu.targetGid, releaseTick: tick,
          eX: wu.eX, eY: wu.eY, hasLead: wu.hasLead, meetable: wu.meetable,
          predictedArrDist: wu.predictedArrDist,
          launchX: ox, launchY: oy, L, ux: L > 1e-6 ? ux0 / L : 0, uy: L > 1e-6 ? uy0 / L : 0,
          wTicks: wu.readyTick - wu.t0, live: true,
          reachedPoint: false, arrDist: Number.NaN,
          alongOffset: Number.NaN, lateral: Number.NaN,
          completedHere: false, interceptedHere: false, wentDead: false,
          startDelayTicks: null, pcHoldTicks: null, pcHoldSearched: false,
        };
      }
      wu = null;
    }
    if (rec !== null && (wu === null || key !== wu.key)) {
      /* A NEW ARM at t0 = this tick — the first tick the record is observable from state.
         THE ARM INSTANT (RC-C0 §P.B, declared): the mate's arm position is the RECORD's own
         `aim` (exact, so dMate = |aimLead|); the passer's position and the mate's `topSpeed`
         are read at the END of the arm tick, because with NO WRAPPER mid-tick is not
         observable. ⚠ up to one tick of drift on the passer's position only. */
      row.windupsArmed += 1;
      const passer = players[rec.gid];
      const target = players[rec.targetGid];
      const eX = rec.aim.x + (rec.aimLead?.x ?? 0);
      const eY = rec.aim.y + (rec.aimLead?.y ?? 0);
      const dMate = Math.sqrt((eX - rec.aim.x) ** 2 + (eY - rec.aim.y) ** 2);
      const dBall = Math.sqrt((eX - passer.pos.x) ** 2 + (eY - passer.pos.y) ** 2);
      const ts = target.topSpeed;
      const margin = marginOf(dBall, dMate, ts);
      wu = {
        key: key as string, t0: tick, gid: rec.gid, targetGid: rec.targetGid,
        readyTick: rec.readyTick, eX, eY, hasLead: rec.aimLead !== null,
        meetable: meetableOf(dMate, margin),
        predictedArrDist: predictedArrDistOf(dBall, dMate, ts),
      };
    }

    /* ---------- THE RELEASED WIND-UP FLIGHT: start delay · pcHold · arrival · outcome ---- */
    if (flight !== null && flight.live) {
      const f = flight;
      const target = players[f.targetGid];
      /* ⭐ THE START DELAY — RC-C0 §P.D: ticks from the RELEASE tick to his first
         `ReceivePass`. CENSORED if he never enters it before the flight retires. */
      if (f.startDelayTicks === null && (target.action.type as string) === 'ReceivePass') {
        f.startDelayTicks = tick - f.releaseTick;
      }
      /* ⭐ THE PC HOLD — OBSERVED off the private holds map (a pure `Map.get`), matched on
         `armedTick === releaseTick` ∧ `klass === 'passRelease'`; APPLIED ticks (the #280
         form). An unobserved hold is NEVER imputed as zero. */
      if (!f.pcHoldSearched && mm.pcLatency !== null) {
        const h = mm.pcLatency.holds.get(f.targetGid);
        if (h !== undefined && h.armedTick === f.releaseTick && h.klass === 'passRelease') {
          f.pcHoldTicks = h.ticks;
          f.pcHoldSearched = true;
        }
      }
      /* ⭐⭐ THE MEASURED ARRIVAL — RC-C0's own read: the receiver→E distance at the tick the
         ball's along-line projection first reaches E. */
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
      if (d.passesCompleted[mySide] > 0) f.completedHere = true;
      if (d.interceptions[1 - mySide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.gid) retireWu();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireWu();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireWu();
    }

    /* ---------- (iii) THE GROUND-PASS RELEASE (PT-C0's own, for the user's two faces) ---- */
    const releases: { gid: number; klass: Klass }[] = [];
    if (ballIsLive) {
      for (const side of [0, 1] as const) {
        const k0 = klassOf({
          shots: d.shots[side], clearances: d.clearances[side], passes: d.passes[side],
          crosses: d.crosses[side], cutbacks: d.cutbacks[side],
          throughBalls: d.throughBalls[side], longBalls: d.longBalls[side],
          headersWon: d.headersWon[side],
        }, passChangedHere && pp !== null && pp.side === side);
        if (k0 === null) continue;
        let klass = k0;
        let gid = -1;
        if (passChangedHere && pp !== null && pp.side === side) gid = pp.passerGid;
        else if (lastTouch !== null && lastTouch.side === side) gid = lastTouch.gid;
        if (gid < 0) continue;
        if (klass === 'shortPass' && (players[gid].action.type as string) === 'ThrowOut') {
          klass = 'keeperThrow';
        }
        releases.push({ gid, klass });
      }
    }
    const hSpeedNow = Math.hypot(ball.vel.x, ball.vel.y);
    for (const rel of releases) {
      if (!isDelivery(rel.klass) || hSpeedNow < 1e-6) continue;
      const grounded = ball.z === 0 && ball.vz === 0;
      const vz0 = grounded ? 0 : ball.vz + GRAVITY * DT;
      const ground = isGroundLaunch(grounded, vz0);
      const targetGid = (pp !== null && passChangedHere && pp.passerGid === rel.gid)
        ? pp.targetGid : null;
      if (!isMeasurableGroundPass(rel.klass, ground, targetGid !== null)) continue;
      retireGp();
      row.gpMeasured += 1;
      gp = {
        passerGid: rel.gid, passerSide: players[rel.gid].side as Side,
        targetGid: targetGid as number, releaseTick: tick,
        contactGid: null, contactClass: 'none',
        completedHere: false, interceptedHere: false, wentDead: false, recvSector: null,
      };
    }

    /* ---------- (iii) FOLLOW THE GROUND PASS (PT-C0's own first-body + facing reads) ----- */
    if (gp !== null) {
      const f = gp;
      if (f.contactGid === null && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactGid = lastTouch.gid;
        f.contactClass = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
      }
      if (d.passesCompleted[f.passerSide] > 0 && !f.completedHere) {
        f.completedHere = true;
        /* ⭐ THE RECEIVER'S FACING SECTOR AT FIRST TOUCH — the BK law's own classifier CALLED */
        f.recvSector = ballAccessGeometry(players[f.targetGid], ball, CONTROL_RADIUS).sector;
      }
      if (d.interceptions[1 - f.passerSide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.passerGid) retireGp();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireGp();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireGp();
    }
  }
  retireWu();
  retireGp();
  if (observe && mm.pcLatency !== null) {
    row.preCuedArms = mm.pcLatency.ledger.preCuedArms;
    row.armedSimple = mm.pcLatency.ledger.armedByTier.simple;
    row.armedChoice = mm.pcLatency.ledger.armedByTier.choice;
    row.armedHolds = row.armedSimple + row.armedChoice;
  }
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  for (const k of STAT_KEYS) row.stats[k] = st[0][k] + st[1][k];
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
banner('RC-T1A — the lockstep receipt (observed vs unobserved, PER ARM; NO wrapper installed)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm-walks)`);
/**
 * ⭐ gArmsDiverge — the RECEIPT that the door demonstrably bites, PER PAIR (E and D
 * separately). ⚠ SOME, not EVERY (#364 item 1's ratified reading): a match where NO HOLD ever
 * changes legally walks byte-identically in both arms — the pre-cue only shortens a hold that
 * an uncovered cell would otherwise have paid at the choice tier, and a matured book may cover
 * every one of them. Requiring every seed to diverge would conflate "the door can bite" with
 * "the door bites every match". An INSTRUMENT receipt, never a finding.
 */
const divergeByPair = PAIRS.map((p) => ({
  pair: p.key,
  diverged: LOCKSTEP_SEEDS.filter((seed) => {
    const s = lockstepRows.find((r) => r.seed === seed && r.arm === p.shut)!;
    const a = lockstepRows.find((r) => r.seed === seed && r.arm === p.armed)!;
    return s.observed !== a.observed;
  }),
}));
/** ⭐ THE GATE IS ON THE SCORED PAIR ONLY. The DOSED pair's divergence count is REPORTED
 *  WHATEVER IT IS and is NEVER GATED — an inert dosed pair is precisely the entry question's
 *  own evidence (#370 items 4/5(v)), and gating it would turn the finding into a red gate. */
const ARMS_DIVERGE = (divergeByPair.find((r) => r.pair === 'E') as { diverged: number[] })
  .diverged.length > 0;

/* ========================================================================== */
/* §12 THE BATTERY — the FOUR ARMS PAIRED on every seed                        */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`RC-T1A — the battery: ${N} PAIRED SEEDS × ${ARMS.length} arms (${N * ARMS.length} walks), `
  + `seeds ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const arm of ARMS) rows[arm] = walkMatch(buildMatch(seed, arm), arm, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} pairs `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const arm of ARMS) receiptRows[arm] = walkMatch(buildMatch(RECEIPT_SEED, arm), arm, true);
const walksBooked = cells.length * ARMS.length + ARMS.length;

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over SHARED seeds (consumes NO stats)  */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);

interface FaceDef {
  unit: string; what: string; group: string;
  num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, group: string, what: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, what, group, num, dn }; };
const WG = (g: (typeof WGROUPS)[number]): number => WGROUPS.indexOf(g);
const GG = (g: (typeof GGROUPS)[number]): number => GGROUPS.indexOf(g);

/* ---- (a) THE SCORED GAP FACE — RC-C0 §P.D's face byte for byte ---- */
defFace('gap.meanDiffMetres.meetableCarried', 'metres', 'SCORED (a)',
  '⭐⭐ (a) THE GAP: measured arrival distance − `predictedArrDist` on MEETABLE CARRIED '
  + 'wind-up flights (RC-C0 §P.D byte for byte: predictedArrDist(dBallPath, dMate, '
  + 'topSpeed@arm) vs the receiver→E distance at the tick the ball\'s along-line projection '
  + 'first reaches E); bins stored',
  (r) => r.gapMeasSum[GG('meetableCarried')] - r.gapPredSum[GG('meetableCarried')],
  (r) => r.gapN[GG('meetableCarried')]);
/* ---- (b1) / (b2) THE SCORED COST FACES ---- */
defFace('passCompletion', 'share', 'SCORED (b1)',
  '⭐ (b1) COMPLETION — the ENGINE\'s own whole-match completion over ALL deliveries '
  + '(RC-C0 / PT-C0\'s own context face)',
  (r) => r.stats.passesCompleted, (r) => r.stats.passes);
defFace('interceptionsPerMatch', 'per match (240 s match clock)', 'SCORED (b2)',
  '⭐ (b2) INTERCEPTIONS — conceded. ⚠ BOTH teams are armed in the ARMED arms, so this is '
  + 'the MATCH TOTAL: every interception is conceded by a side whose receiver is armed',
  (r) => r.stats.interceptions, (r) => r.matches);
/* ---- the gap, beside ---- */
defFace('gap.meanDiffMetres.carried', 'metres', 'REPORTED gap',
  'the same face on the WHOLE carried class', 
  (r) => r.gapMeasSum[GG('carried')] - r.gapPredSum[GG('carried')],
  (r) => r.gapN[GG('carried')]);
defFace('gap.predictedMetres.meetableCarried', 'metres', 'REPORTED gap',
  '`predictedArrDist` alone — where the account says he stands',
  (r) => r.gapPredSum[GG('meetableCarried')], (r) => r.gapN[GG('meetableCarried')]);
defFace('gap.measuredMetres.meetableCarried', 'metres', 'REPORTED gap',
  'the MEASURED arrival distance alone',
  (r) => r.gapMeasSum[GG('meetableCarried')], (r) => r.gapN[GG('meetableCarried')]);
/* ---- ⭐ THE MECHANISM RECEIPT ---- */
for (const g of WGROUPS) {
  defFace(`window.startDelayMeanTicks.${g}`, 'ticks', 'REPORTED mechanism receipt',
    `⭐ THE MECHANISM RECEIPT — the target's post-strike START DELAY (RC-C0 §P.D: ticks from `
    + `the release tick to his first \`ReceivePass\`) on the ${g} class; bins stored`,
    (r) => r.sdSum[WG(g)], (r) => r.sdN[WG(g)]);
  defFace(`window.startDelayMeanSimSeconds.${g}`, 'sim-seconds', 'REPORTED mechanism receipt',
    `the same start delay in SIM-SECONDS (ticks × DT) on the ${g} class`,
    (r) => r.sdSum[WG(g)] * DT, (r) => r.sdN[WG(g)]);
  defFace(`window.startDelayCensoredShare.${g}`, 'share', 'REPORTED mechanism receipt',
    `the CENSORED-START bucket of the ${g} class: he never enters \`ReceivePass\` before the `
    + 'flight retires — COUNTED, never imputed',
    (r) => r.sdCensored[WG(g)], (r) => r.sdCensored[WG(g)] + r.sdN[WG(g)]);
  defFace(`window.pcHoldMeanAppliedTicks.${g}`, 'applied ticks', 'REPORTED mechanism receipt',
    `the OBSERVED \`passRelease\` hold armed on the target at the release tick, as its APPLIED `
    + `\`ticks\` (the #280 form, never nominal) on the ${g} class; a pure state read of the `
    + 'private holds map — the mutating `holdFor` accessor is NEVER called; bins stored',
    (r) => r.pcHoldSum[WG(g)], (r) => r.pcHoldN[WG(g)]);
  defFace(`window.pcHoldObservedShare.${g}`, 'share', 'REPORTED mechanism receipt',
    `the share of ${g} flights on which such a hold could be MATCHED — an unobserved hold is `
    + 'NEVER imputed as zero',
    (r) => r.pcHoldN[WG(g)], (r) => r.pcHoldObsDen[WG(g)]);
  defFace(`window.wMeanSimSeconds.${g}`, 'sim-seconds', 'REPORTED context',
    `the wind-up length W = readyTick − t0, in sim-seconds, on the ${g} class`,
    (r) => r.wSum[WG(g)] * DT, (r) => r.wN[WG(g)]);
}
defFace('receipt.preCuedArmsPerMatch', 'arms per match (240 s match clock)',
  'REPORTED plumbing receipt',
  '⛔ PLUMBING, NEVER AN EFFECT SIZE (ruling #289 item 1 + BU-T1 §CORR 5): the seat\'s OWN '
  + 'ledger counter `preCuedArms` — arms whose ticks came from the pre-cue interpolation '
  + 'instead of `pcTierTicks(tier)`, INCLUDING the ones the interpolation returned CHOICE for',
  (r) => r.preCuedArms, (r) => r.matches);
defFace('receipt.armedHoldsPerMatch', 'holds per match (240 s match clock)',
  'REPORTED plumbing receipt',
  '⛔ PLUMBING: every hold the latency seat armed (both tiers) — the denominator the pre-cued '
  + 'arms sit inside',
  (r) => r.armedHolds, (r) => r.matches);
defFace('receipt.bookCoveredArmShare', 'share', 'REPORTED plumbing receipt',
  '⛔ PLUMBING: the share of armed holds the BOOK put at the SIMPLE tier — the reason the '
  + 'DOSED form is a smaller room (a covered cell IGNORES the pre-cue entirely)',
  (r) => r.armedSimple, (r) => r.armedHolds);
/* ---- goals / shots ---- */
defFace('goalsPerMatch', 'goals per match (240 s match clock)', 'REPORTED football',
  '⭐ goals — REPORTED with a DECLARED MDE, gated by nothing',
  (r) => r.stats.goals, (r) => r.matches);
defFace('shotsPerMatch', 'shots per match (240 s match clock)', 'REPORTED football',
  'shots — the second creation eye', (r) => r.stats.shots, (r) => r.matches);
/* ---- THE E4 WATCHABILITY DIMENSIONS — ONE anchored definition each, REUSED ---- */
defFace('e4.forwardPassShare', 'share', 'REPORTED E4',
  '⭐ E4 — `mt-ladder.ts`\'s OWN definition, anchored and reused: passesForward / passes '
  + 'from the team stats',
  (r) => r.stats.passesForward, (r) => r.stats.passes);
defFace('e4.thirdManPerMatch', 'releases per match (240 s match clock)', 'REPORTED E4',
  '⭐ E4 — the engine\'s OWN completed third-man release counter (`Match.ts`, anchored)',
  (r) => r.stats.thirdMan, (r) => r.matches);
defFace('e4.overlapsPerMatch', 'releases per match (240 s match clock)', 'REPORTED E4',
  '⭐ E4 — the engine\'s OWN completed overlap release counter (`Match.ts`, anchored)',
  (r) => r.stats.overlaps, (r) => r.matches);
defFace('e4.bestPassChainMeanPerTeam', 'passes (longest completed-pass chain in one move)',
  'REPORTED E4',
  '⭐ E4 CHAIN LENGTH — the engine\'s OWN possession-chain ledger `bestPassChain` (anchored '
  + 'at its own home, `types.ts`: "Longest chain of consecutive completed passes in one '
  + 'move"), summed over the two teams and divided by TWO TEAM-MATCHES',
  (r) => r.stats.bestPassChain, (r) => r.matches * 2);
/* ---- THE USER'S THREE FACES from PT-C0 ---- */
defFace('contact.opponentFirstContactShare', 'share', 'REPORTED user face',
  '⭐⭐ THE USER\'S 传到对面身上 — of every MEASURED GROUND PASS, the share whose FIRST body '
  + 'contact after the release is an OPPONENT (PT-C0 (iii)\'s own classes and code)',
  (r) => r.contactClass[CTI('opponent')], (r) => r.gpFlights);
for (const s of SECTORS) {
  defFace(`contact.receiver${s[0].toUpperCase()}${s.slice(1)}ShareCompleted`, 'share',
    'REPORTED user face',
    `⭐⭐ THE USER'S 弹回 half — the receiver's own facing SECTOR at his first touch on `
    + `COMPLETED passes: \`${s}\` (the BK \`BodySector\` classifier CALLED, PT-C0's own read)`,
    (r) => r.recvSector[SECTORS.indexOf(s)], (r) => r.recvSectorN);
}
defFace('crowd.crashShare', 'share', 'REPORTED user face',
  '⭐⭐ THE USER\'S 挤人 (撞车) — of the sampled open-play ticks with an attributable '
  + 'possession side, the share whose MINIMUM PAIRWISE attacking-outfield distance is BELOW '
  + 'DUP_RUN_M = 4 m (the A4 battery\'s own limb, anchored)',
  (r) => r.crashHits, (r) => r.minPairN);
defFace('crowd.dupRunPairsPerSample', 'pairs per sampled tick', 'REPORTED user face',
  '⭐ THE A4 DUP-RUN LIMB, reused: attacking outfield PAIRS closer than DUP_RUN_M = 4 m',
  (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres', 'REPORTED user face',
  '⭐ THE A4 SPACING LIMB, reused: the mean nearest same-side OUTFIELDER distance',
  (r) => r.spacingSum, (r) => r.spacingSamples);
/* ---- RC-C0's other window / anatomy faces, cheap ---- */
defFace('window.meetableShareCarried', 'share', 'REPORTED anatomy',
  'RC-C0\'s own: the MEETABLE share of the carried class at the ARM instant',
  (r) => r.byDelivCarriedMeetable, (r) => r.byDelivCarried);
defFace('arrival.reachedPointShare.meetableCarried', 'share', 'REPORTED anatomy',
  'RC-C0\'s own: the share of meetable carried flights on which the ball reached E at all',
  (r) => r.reachedN[GG('meetableCarried')], (r) => r.agN[GG('meetableCarried')]);
defFace('arrival.alongLineOffsetMeanMetres.meetableCarried', 'metres', 'REPORTED anatomy',
  'RC-C0\'s own: his SIGNED along-line offset at the arrival tick (negative = UPSTREAM of E, '
  + 'positive = BEYOND it); bins stored',
  (r) => r.alongSum[GG('meetableCarried')], (r) => r.alongN[GG('meetableCarried')]);
defFace('arrival.lateralOffsetMeanMetres.meetableCarried', 'metres', 'REPORTED anatomy',
  'RC-C0\'s own: his LATERAL offset from the launch→E line at the arrival tick; bins stored',
  (r) => r.latSum[GG('meetableCarried')], (r) => r.latN[GG('meetableCarried')]);
for (const o of OUTCOMES) {
  defFace(`arrival.outcome.meetableCarried.${o}`, 'share', 'REPORTED anatomy',
    `DX-C2's own four-way ladder (TEMPORAL, not causal) on meetable carried: \`${o}\``,
    (r) => r.outc[GG('meetableCarried')][OI(o)], (r) => r.agN[GG('meetableCarried')]);
}
/* ---- context ---- */
defFace('context.groundPassesPerMatch', 'passes per match (240 s match clock)',
  'REPORTED context', 'the MEASURED ground-pass population per match (RA-T1B\'s own face)',
  (r) => r.gpMeasured, (r) => r.matches);
defFace('context.windupsReleasedPerMatch', 'flights per match (240 s match clock)',
  'REPORTED context', 'wind-up flights RELEASED per match',
  (r) => r.windupsReleased, (r) => r.matches);

const FACE_KEYS = Object.keys(FACES).sort();

interface FaceRow {
  face: string; arm: Arm; unit: string; group: string; what: string;
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
    const lo = pctl(draws, 0.025);
    const hi = pctl(draws, 0.975);
    faces.push({
      face: key, arm, unit: f.unit, group: f.group, what: f.what,
      value: point, numerator: sum(nu), denominator: sum(de),
      ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    });
  }
}
const face = (arm: Arm, k: string): FaceRow => {
  const f = faces.find((x) => x.face === k && x.arm === arm);
  if (f === undefined) { banner(`RC-T1A FATAL — unknown face ${arm}.${k}`); process.exit(3); }
  return f!;
};

/** ⭐ THE PAIRED Δ — armed − shut inside the SAME resampled seed set (the RA-T1B estimator) */
interface DeltaRow {
  key: string; pair: string; shutArm: Arm; armedArm: Arm;
  shutValue: number; armedValue: number; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  excludesZeroBelow: boolean; excludesZeroAbove: boolean; containsZero: boolean;
  looMaxInfluenceShare: number; looFlips: number; looScored: boolean;
}
const pairedDelta = (
  key: string, pairKey: string,
  frozenRule: ((d: { ciLo: number; ciHi: number }) => boolean) | null,
): DeltaRow => {
  const p = PAIRS.find((x) => x.key === pairKey)!;
  const f = FACES[key];
  const nuS = cells.map((c) => f.num(c.rows[p.shut]));
  const deS = cells.map((c) => f.dn(c.rows[p.shut]));
  const nuA = cells.map((c) => f.num(c.rows[p.armed]));
  const deA = cells.map((c) => f.dn(c.rows[p.armed]));
  const pS = ratio(sum(nuS), sum(deS));
  const pA = ratio(sum(nuA), sum(deA));
  const point = pA - pS;
  const draws: number[] = [];
  for (const idx of resampleIndex) {
    let n1 = 0; let d1 = 0; let n2 = 0; let d2 = 0;
    for (const i of idx) { n1 += nuA[i]; d1 += deA[i]; n2 += nuS[i]; d2 += deS[i]; }
    const v = ratio(n1, d1) - ratio(n2, d2);
    if (Number.isFinite(v)) draws.push(v);
  }
  draws.sort((a, b) => a - b);
  const lo = pctl(draws, 0.025);
  const hi = pctl(draws, 0.975);
  /* ⭐ LOO sensitivity (the #346/#348 orders): drop each seed, re-derive the POINT Δ;
     influence = |Δ_loo − Δ| / |Δ|; a FLIP = the frozen rule's verdict changing when the
     interval is SHIFTED by that influence (the conservative point-shift form, STATED). */
  const totNuS = sum(nuS); const totDeS = sum(deS);
  const totNuA = sum(nuA); const totDeA = sum(deA);
  let maxInf = 0; let flips = 0;
  for (let i = 0; i < cells.length; i++) {
    const dLoo = ratio(totNuA - nuA[i], totDeA - deA[i]) - ratio(totNuS - nuS[i], totDeS - deS[i]);
    const inf = Math.abs(dLoo - point);
    if (inf / Math.max(Math.abs(point), 1e-12) > maxInf) {
      maxInf = inf / Math.max(Math.abs(point), 1e-12);
    }
    if (frozenRule !== null && Number.isFinite(dLoo)) {
      const shift = dLoo - point;
      if (frozenRule({ ciLo: lo, ciHi: hi }) !== frozenRule({ ciLo: lo + shift, ciHi: hi + shift })) {
        flips += 1;
      }
    }
  }
  return {
    key, pair: pairKey, shutArm: p.shut, armedArm: p.armed,
    shutValue: pS, armedValue: pA, delta: point,
    ciLo: lo, ciHi: hi, halfWidth: (hi - lo) / 2,
    absDeltaOverHalfWidth: ratio(Math.abs(point), (hi - lo) / 2),
    excludesZeroBelow: hi < 0, excludesZeroAbove: lo > 0,
    containsZero: !(hi < 0) && !(lo > 0),
    looMaxInfluenceShare: maxInf, looFlips: flips, looScored: frozenRule !== null,
  };
};
/* ⭐⭐ THE THREE FROZEN H-RC.1 RULES (§P.C, in exact form) */
const RULE_A = (d: { ciLo: number; ciHi: number }): boolean => d.ciHi < 0;
const RULE_B1 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciHi < 0);
const RULE_B2 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciLo > 0);
/** the DOSED gap's own read rule — the ENTRY QUESTION's own selector (#370 item 5(v)) */
const RULE_DOSED_GAP_FALLS = (d: { ciLo: number; ciHi: number }): boolean => d.ciHi < 0;

const SCORED_RULES: Record<string, (d: { ciLo: number; ciHi: number }) => boolean> = {
  'E|gap.meanDiffMetres.meetableCarried': RULE_A,
  'E|passCompletion': RULE_B1,
  'E|interceptionsPerMatch': RULE_B2,
  'D|gap.meanDiffMetres.meetableCarried': RULE_DOSED_GAP_FALLS,
};
const deltas: DeltaRow[] = [];
for (const p of PAIRS) {
  for (const key of FACE_KEYS) {
    deltas.push(pairedDelta(key, p.key, SCORED_RULES[`${p.key}|${key}`] ?? null));
  }
}
const delta = (pairKey: string, k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k && x.pair === pairKey);
  if (d === undefined) { banner(`RC-T1A FATAL — unknown delta ${pairKey}.${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 H-RC.1 — THE FROZEN RULES APPLIED; THE VERDICT WORD IS PRINTED BY THEM   */
/* ========================================================================== */
const dA = delta('E', 'gap.meanDiffMetres.meetableCarried');
const dB1 = delta('E', 'passCompletion');
const dB2 = delta('E', 'interceptionsPerMatch');
const A_VERDICT: 'FALLS' | 'DOES-NOT-FALL' = RULE_A(dA) ? 'FALLS' : 'DOES-NOT-FALL';
const B1_VERDICT: 'DOES-NOT-FALL' | 'FALLS' = RULE_B1(dB1) ? 'DOES-NOT-FALL' : 'FALLS';
const B2_VERDICT: 'DOES-NOT-RISE' | 'RISES' = RULE_B2(dB2) ? 'DOES-NOT-RISE' : 'RISES';
const H_RC1: 'PASS' | 'FAIL' =
  A_VERDICT === 'FALLS' && B1_VERDICT === 'DOES-NOT-FALL' && B2_VERDICT === 'DOES-NOT-RISE'
    ? 'PASS' : 'FAIL';

/* ========================================================================== */
/* §14b THE PRE-COMMITTED READS — FROZEN LITERALS, SELECTED ON STORED BOOLEANS  */
/* ========================================================================== */
/** ⭐⭐ #370 item 5(v)'s sentences, FROZEN AS LITERALS at the freeze commit. ⛔ Selection is on
 *  stored booleans only; NO tie-break is ever invented after sight. */
const READ_PASS_BANKS = 'RC-T1a BANKS AND THE ARC PROCEEDS TO RC-C0b (the facing limb\'s '
  + 'detector census).';
const READ_A_FAILS = 'THE FORM QUESTION RETURNS TO THE COMMANDER WITH NUMBERS.';
const READ_B_FAILS = 'THE ARC PAUSES AT THE USER\'S FORK — a shorter hold costs football.';
const READ_DOSED_NO_ENTRY = 'NO ENTRY FOR LIMB 3a ALONE — world 13 waits for the facing limb.';
const READ_DOSED_ENTRY = 'THE RC ENTRY CANDIDATE FORMS (gated on the user\'s world-12 verdict).';
const READ_DOSED_UNRESOLVED = 'THE DOSED READ IS UNRESOLVED — the commander decides with numbers.';
/** "single figures" — the frozen literal the dosed read's second conjunct is cut on. */
const SINGLE_FIGURES_CEILING = 10;
const dDosedGap = delta('D', 'gap.meanDiffMetres.meetableCarried');
const DOSED_PRECUED_ARMS_PER_MATCH = face('D-ARMED', 'receipt.preCuedArmsPerMatch').value;
const DOSED_ARMS_SINGLE_FIGURES = DOSED_PRECUED_ARMS_PER_MATCH < SINGLE_FIGURES_CEILING;
const DOSED_READ_PRINTED: string = RULE_DOSED_GAP_FALLS(dDosedGap)
  ? READ_DOSED_ENTRY
  : (dDosedGap.containsZero && DOSED_ARMS_SINGLE_FIGURES
    ? READ_DOSED_NO_ENTRY : READ_DOSED_UNRESOLVED);
const VERDICT_READS_PRINTED: string[] = [
  ...(H_RC1 === 'PASS' ? [READ_PASS_BANKS] : []),
  ...(A_VERDICT !== 'FALLS' ? [READ_A_FAILS] : []),
  ...(B1_VERDICT !== 'DOES-NOT-FALL' || B2_VERDICT !== 'DOES-NOT-RISE' ? [READ_B_FAILS] : []),
];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form, from THIS exam's own scratch smoke   */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** ⭐ THE SCRATCH SMOKE's own realised PAIRED-Δ half-widths (12 pairs, seeds 900,002,100–111;
 *  §DEV-PREFLIGHT), read out of the smoke artifact's own `deltas[].halfWidth` fields —
 *  NEVER re-typed from the console's rounded print. HARDCODED here at the FREEZE COMMIT. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'gap.meanDiffMetres.meetableCarried', group: '(a)',
    hwSmoke: 1.3160878425650313, target: -0.5 },
  { face: 'passCompletion', group: '(b1)', hwSmoke: 0.04854895971183293, target: 0.01 },
  { face: 'interceptionsPerMatch', group: '(b2)', hwSmoke: 3, target: 1 },
  { face: 'goalsPerMatch', group: 'REPORTED (declared MDE)',
    hwSmoke: 1.1666666666666667, target: 0.25 },
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
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);

/* ========================================================================== */
/* §16 ⭐ THE SEASON LADDER — REPORTED, GATED BY NOTHING (the house form)        */
/* ========================================================================== */
/**
 * ⭐⭐ #370 item 5(iii)'s own order: "the season ladder (the gene evolvable via
 * `evolveReceiverAnticipation`, the RA-T1B instrument's form)". The BK-T4 §10 / DF-C0 §R4 /
 * DX-T1 §13 house ladder with the gene axis re-pointed at `rcAnticipationWeight`:
 *   · `geneAbsent`    — `evolveReceiverAnticipation` FALSE: the gene stays STRUCTURALLY ABSENT
 *     for every generation (mutation and crossover draw no value for it). THE CONTROL.
 *   · `geneEvolvable` — TRUE: the gene may enter the population through the SHIPPED
 *     `mutateGenome` / `crossoverGenomes` opt-in path. ⛔ NOTHING IS PRE-SEEDED and NO VALUE
 *     IS EVER SET BY HAND in this ladder.
 * BOTH arms walk THE ARMED WORLD (world 12 + `rcAnticipate: true`, EMPTY-BOOK) so the DOOR is
 * open in both and the only question is whether a coach who reads the passer's body can SPREAD.
 * ⚠ THE NEUTRAL-DRIFT SHADOW rides the control arm: inert passengers mutated by the SAME law in
 * their OWN rng namespace, inherited through the SAME elite/mutate/reborn assignments. They
 * touch no match, so they are what the gene level looks like with ZERO selection on it.
 * ⛔ REPORTED, GATED BY NOTHING AS FOOTBALL: no H-RC.1 conjunct reads a ladder number.
 */
const LADDER_ARMS = ['geneAbsent', 'geneEvolvable'] as const;
type LadderArm = (typeof LADDER_ARMS)[number];
const LADDER_TEAMS = MODE === 'smoke' ? 4 : 8;
const LADDER_GENS = MODE === 'smoke' ? 2 : 10;
const LADDER_ELITE_N = 2;
const LADDER_REBORN_N = 2;
const MUT_RATE = 0.4;
const MUT_SCALE = 0.08;
const REBORN_RATE = 0.5;
const REBORN_SCALE = 0.15;
const EARLY_GENS = Math.min(3, LADDER_GENS);
const LATE_FROM = Math.max(1, LADDER_GENS - 2);
interface LadderTeam { slot: number; genome: TacticalGenome }
interface LadderCell {
  arm: LadderArm; leagueSeed: number; generation: number; matches: number;
  goals: number; shots: number; passes: number; passesCompleted: number; interceptions: number;
  preCuedArms: number;
  geneMean: number; geneSd: number; geneMax: number;
  genePresentShare: number; geneAboveZeroShare: number;
  driftMean: number | null;
  doorChecked: number; doorWrong: number; franchiseDirty: number;
  wallSeconds: number;
}
/** the ladder's own match: THE ARMED WORLD in both arms, the EVOLVED genomes handed in as the
 *  franchise's own (`armA4World`'s `setRaGenes` then spreads them onto MATCH-LOCAL views). */
const ladderMatch = (seed: number, ga: TacticalGenome, gb: TacticalGenome): Match => {
  const ta = teamInfo('A', seed * 2 + 1);
  const tb = teamInfo('B', seed * 2 + 2);
  const m = new Match({
    seed,
    teamA: { ...ta, genome: ga },
    teamB: { ...tb, genome: gb },
    ...a4MatchFlags(RA_WORLD_VERSION),
    rcAnticipate: true,
  } as ConstructorParameters<typeof Match>[0]);
  armA4World(m, null, RA_WORLD_VERSION);
  return m;
};
const runLadderArm = (arm: LadderArm, leagueSeed: number): LadderCell[] => {
  const opts = { evolveReceiverAnticipation: arm === 'geneEvolvable' };
  const evoRng = new Rng(hashSeed(leagueSeed, 0xe1));
  const driftRng = new Rng(hashSeed(leagueSeed, 0xd8));
  const initRng = new Rng(leagueSeed);
  let pop: LadderTeam[] = Array.from({ length: LADDER_TEAMS }, (_, slot) => ({
    slot, genome: randomGenome(initRng),
  }));
  let shadow: number[] | null = arm === 'geneAbsent'
    ? new Array<number>(LADDER_TEAMS).fill(0) : null;
  const out: LadderCell[] = [];
  for (let gen = 1; gen <= LADDER_GENS; gen++) {
    const tGen = Date.now();
    const points = new Array<number>(LADDER_TEAMS).fill(0);
    const gd = new Array<number>(LADDER_TEAMS).fill(0);
    const acc = { goals: 0, shots: 0, passes: 0, passesCompleted: 0, interceptions: 0,
      preCuedArms: 0 };
    let matches = 0; let doorChecked = 0; let doorWrong = 0; let franchiseDirty = 0;
    let idx = 0;
    for (let a = 0; a < LADDER_TEAMS; a++) {
      for (let b = a + 1; b < LADDER_TEAMS; b++) {
        /** the per-match seed is DERIVED through the SHIPPED `hashSeed`, exactly as
         *  `League.createMatch` derives its fixture seeds from the league's own seed */
        const seed = hashSeed(leagueSeed, gen, idx, 0xdc);
        idx += 1;
        const m = ladderMatch(seed, pop[a].genome, pop[b].genome);
        doorChecked += 1;
        if (raArmedVersion(m) !== RA_WORLD_VERSION
          || (m as unknown as { rcAnticipate: boolean }).rcAnticipate !== true) doorWrong += 1;
        for (const side of [0, 1] as const) {
          const fr = m.teams[side].info.genome as TacticalGenome;
          if (fr.raAccessWeight !== undefined || fr.passLeadSupport !== undefined
            || fr.dvExposureWeight !== undefined) franchiseDirty += 1;
          if (arm === 'geneAbsent' && fr.rcAnticipationWeight !== undefined) franchiseDirty += 1;
        }
        while (!m.finished) m.step(DT);
        const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
        matches += 1;
        acc.goals += st[0].goals + st[1].goals;
        acc.shots += st[0].shots + st[1].shots;
        acc.passes += st[0].passes + st[1].passes;
        acc.passesCompleted += st[0].passesCompleted + st[1].passesCompleted;
        acc.interceptions += st[0].interceptions + st[1].interceptions;
        const pcl = (m as unknown as { pcLatency: { ledger: { preCuedArms: number } } | null })
          .pcLatency;
        if (pcl !== null) acc.preCuedArms += pcl.ledger.preCuedArms;
        const ga = st[0].goals;
        const gb2 = st[1].goals;
        gd[a] += ga - gb2; gd[b] += gb2 - ga;
        if (ga > gb2) points[a] += 3; else if (gb2 > ga) points[b] += 3;
        else { points[a] += 1; points[b] += 1; }
      }
    }
    const fitness = pop.map((t) => points[t.slot] * 100 + gd[t.slot]);
    const vals = pop.map((t) => t.genome.rcAnticipationWeight ?? 0);
    out.push({
      arm, leagueSeed, generation: gen, matches,
      goals: acc.goals, shots: acc.shots, passes: acc.passes,
      passesCompleted: acc.passesCompleted, interceptions: acc.interceptions,
      preCuedArms: acc.preCuedArms,
      geneMean: round(mean(vals), 8), geneSd: round(sd(vals), 8),
      geneMax: round(Math.max(0, ...vals), 8),
      genePresentShare: round(pop.filter((t) => t.genome.rcAnticipationWeight !== undefined)
        .length / LADDER_TEAMS, 6),
      geneAboveZeroShare: round(vals.filter((v) => v > 0).length / LADDER_TEAMS, 6),
      driftMean: shadow === null ? null : round(mean(shadow), 8),
      doorChecked, doorWrong, franchiseDirty,
      wallSeconds: round((Date.now() - tGen) / 1000, 3),
    });
    if (gen === LADDER_GENS) break;
    /* selection: `evolveGroup`'s band law, mirrored (the BK-T4 §10 / DX-T1 §13 anchors) */
    const order = [...pop].sort((x, y) => fitness[y.slot] - fitness[x.slot] || x.slot - y.slot);
    const pool = order.slice(0, 4);
    const pickParent = (exclude?: LadderTeam): LadderTeam => {
      const cands = pool.filter((f) => f !== exclude);
      const weights = cands.map((f) => 4 - pool.indexOf(f));
      const totalW = weights.reduce((x, y) => x + y, 0);
      let r = evoRng.next() * totalW;
      for (let i = 0; i < cands.length; i++) { r -= weights[i]; if (r <= 0) return cands[i]; }
      return cands[cands.length - 1];
    };
    const rebornFrom = order.length - LADDER_REBORN_N;
    const nextShadowBySlot = new Map<number, number>();
    const next: LadderTeam[] = [];
    order.forEach((f, rank) => {
      const sh = shadow === null ? null : shadow[f.slot];
      if (rank < LADDER_ELITE_N) {
        next.push({ slot: f.slot, genome: f.genome });
        if (sh !== null) nextShadowBySlot.set(f.slot, sh);
        return;
      }
      if (rank < rebornFrom) {
        next.push({
          slot: f.slot,
          genome: mutateGenome(f.genome, evoRng, { rate: MUT_RATE, scale: MUT_SCALE, ...opts }),
        });
        if (sh !== null) {
          nextShadowBySlot.set(f.slot, driftRng.chance(MUT_RATE)
            ? clamp01(sh + driftRng.gaussian() * MUT_SCALE) : sh);
        }
        return;
      }
      const pa = pickParent();
      const pb = pickParent(pa);
      next.push({
        slot: f.slot,
        genome: mutateGenome(
          crossoverGenomes(
            pa.genome, pb.genome, evoRng,
            false, false, false, false, false, false, false, false, false, false,
            arm === 'geneEvolvable',
          ),
          evoRng, { rate: REBORN_RATE, scale: REBORN_SCALE, ...opts },
        ),
      });
      if (shadow !== null) {
        const sa = shadow[pa.slot];
        const sb = shadow[pb.slot];
        const r = driftRng.next();
        const child = r < 0.4 ? sa : r < 0.8 ? sb : (sa + sb) / 2;
        nextShadowBySlot.set(f.slot, driftRng.chance(REBORN_RATE)
          ? clamp01(child + driftRng.gaussian() * REBORN_SCALE) : child);
      }
    });
    pop = next.sort((x, y) => x.slot - y.slot);
    shadow = shadow === null ? null : pop.map((t) => nextShadowBySlot.get(t.slot) ?? 0);
  }
  return out;
};
const tLadder0 = Date.now();
const ladderCells: LadderCell[] = [];
banner(`RC-T1A — the SEASON LADDER: ${LADDER_ARMS.length} arms × ${LADDER_SEEDS.length} leagues `
  + `× ${LADDER_GENS} generations × ${(LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2} fixtures`);
for (const larm of LADDER_ARMS) {
  for (const ls of LADDER_SEEDS) {
    ladderCells.push(...runLadderArm(larm, ls));
    banner(`  … ladder ${larm} league ${ls} done (${round((Date.now() - tLadder0) / 1000, 1)} s)`);
  }
}
const ladderWallSec = round((Date.now() - tLadder0) / 1000, 3);
const ladderByGeneration = LADDER_ARMS.flatMap((larm) => Array
  .from({ length: LADDER_GENS }, (_, i) => i + 1).map((gen) => {
    const cs = ladderCells.filter((c) => c.arm === larm && c.generation === gen);
    const mt = sum(cs.map((c) => c.matches));
    return {
      arm: larm, generation: gen, leagues: cs.length, matches: mt,
      goalsPerMatch: round(ratio(sum(cs.map((c) => c.goals)), mt), 6),
      shotsPerMatch: round(ratio(sum(cs.map((c) => c.shots)), mt), 6),
      passCompletion: round(ratio(sum(cs.map((c) => c.passesCompleted)),
        sum(cs.map((c) => c.passes))), 6),
      interceptionsPerMatch: round(ratio(sum(cs.map((c) => c.interceptions)), mt), 6),
      preCuedArmsPerMatch: round(ratio(sum(cs.map((c) => c.preCuedArms)), mt), 6),
      geneMean: round(mean(cs.map((c) => c.geneMean)), 8),
      geneMax: round(Math.max(0, ...cs.map((c) => c.geneMax)), 8),
      genePresentShare: round(mean(cs.map((c) => c.genePresentShare)), 6),
      geneAboveZeroShare: round(mean(cs.map((c) => c.geneAboveZeroShare)), 6),
      driftMean: cs.every((c) => c.driftMean === null) ? null
        : round(mean(cs.map((c) => c.driftMean ?? 0)), 8),
      unit: 'per-generation league aggregate (goals/shots per match on the 240 s match clock; '
        + 'gene levels are league-mean rcAnticipationWeight in [0,1])',
    };
  }));
const ladderGeneSlopes = LADDER_ARMS.map((larm) => {
  const perLeague = LADDER_SEEDS.map((ls) => {
    const cs = ladderCells.filter((c) => c.arm === larm && c.leagueSeed === ls);
    const early = cs.filter((c) => c.generation <= EARLY_GENS);
    const late = cs.filter((c) => c.generation >= LATE_FROM);
    return {
      leagueSeed: ls,
      earlyGeneMean: round(mean(early.map((c) => c.geneMean)), 8),
      lateGeneMean: round(mean(late.map((c) => c.geneMean)), 8),
      earlyGoalsPerMatch: round(ratio(sum(early.map((c) => c.goals)),
        sum(early.map((c) => c.matches))), 6),
      lateGoalsPerMatch: round(ratio(sum(late.map((c) => c.goals)),
        sum(late.map((c) => c.matches))), 6),
    };
  });
  return {
    arm: larm, perLeague,
    geneDelta: round(mean(perLeague.map((p) => p.lateGeneMean - p.earlyGeneMean)), 8),
    goalsDelta: round(mean(perLeague.map((p) => p.lateGoalsPerMatch - p.earlyGoalsPerMatch)), 6),
  };
});
const LADDER_CLEAN = ladderCells.every((c) => c.doorWrong === 0 && c.franchiseDirty === 0);
const LADDER_LIVE = ladderCells.some((c) => c.arm === 'geneEvolvable' && c.genePresentShare > 0);

/* ========================================================================== */
/* §17 THE GATES — liveness / receipt ONLY, NEVER direction; all stored         */
/* ========================================================================== */
const allRows: Row[] = [...ARMS.flatMap((a) => armRows(a)), ...ARMS.map((a) => receiptRows[a])];
const rowsOf = (arm: Arm): Row[] => [...armRows(arm), receiptRows[arm]];
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const preCuedArmsTotalEArmed = sum(armRows('E-ARMED').map((r) => r.preCuedArms));
const preCuedArmsTotalDArmed = sum(armRows('D-ARMED').map((r) => r.preCuedArms));
const preCuedArmsTotalShut = sum([...armRows('E-SHUT'), ...armRows('D-SHUT')]
  .map((r) => r.preCuedArms));
const partitionOk = allRows.every((r) => GGROUPS.every((_, gi) =>
  sum(r.outc[gi]) === r.agN[gi] && r.reachedN[gi] === r.gapN[gi]
  && r.gapN[gi] === r.alongN[gi] && r.gapN[gi] === r.latN[gi]))
  && allRows.every((r) => WGROUPS.every((_, gi) =>
    r.sdN[gi] + r.sdCensored[gi] === r.wN[gi] && r.pcHoldObsDen[gi] === r.wN[gi]))
  && allRows.every((r) => sum(r.contactClass) === r.gpFlights
    && sum(r.recvSector) === r.recvSectorN)
  && allRows.every((r) => sum(r.preCueTickN) === sum(r.preCueHoldBins.map(sum)));
const scoredDeltas = deltas.filter((d) => d.looScored);
const LOO_OK = scoredDeltas.length === Object.keys(SCORED_RULES).length
  && scoredDeltas.every((d) => Number.isInteger(d.looFlips) && d.looFlips >= 0);
const BODY_SCHEMA = [
  'stage', 'arms', 'definitions', 'doseSource', 'anchoredSites', 'ticksAtWeightOne',
  'fixtures', 'lockstep', 'armsDiverge', 'sizing', 'gates', 'faces', 'deltas', 'hRC1',
  'precommittedReads', 'seasonLadder', 'bins', 'medians', 'contactClasses', 'sectors',
  'outcomes', 'windowGroups', 'gapGroups', 'seeds', 'stats', 'perf', 'honestLimits',
] as const;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: allRows.every((r) => r.worldOk),
    note: `every walked match is world 12 by \`raArmedVersion\` = ${RA_WORLD_VERSION} with the `
      + 'RA pins on BOTH teams, and `rcAnticipate` matches its OWN arm (false on E-SHUT/D-SHUT, '
      + 'true on E-ARMED/D-ARMED) — asserted off the REAL constructed match, all four arms',
  },
  gGeneValuePinned: {
    ok: allRows.every((r) => r.geneOk),
    note: `\`rcAnticipationWeight\` = ${RC_GENE_VALUE} by VALUE on BOTH genome views of BOTH `
      + 'teams in the ARMED arms (read back through `rcAnticipationWeightOf`) and ABSENT '
      + '(accessor `null`, the ONE place ABSENT is distinguished from ZERO) in the SHUT arms; '
      + `world 12's own pins \`passLeadSupport\` = ${RA_WORLD_LEAD} / \`raAccessWeight\` = `
      + `${RA_WORLD_WEIGHT} CARRIED in the spread in every arm`,
  },
  gGenomeClean: {
    ok: allRows.every((r) => r.genomeClean),
    note: 'the FRANCHISE genome (`info.genome`) carries NONE of the four genes on any walked '
      + 'match — canon: dose placement (ruling #270.2 / #334 item 1); the match-local-copy '
      + 'idiom PLUS this info.genome-cleanliness conjunct is the ratified form',
  },
  gDoseSource: {
    ok: DOSE_BYTES_MATCH && DOSED_ARM_REACHABLE
      && L3_DOSE_BYTES_SHA.length === 64 && PC_DOSE_BYTES_SHA.length === 64,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arms take their doses from the SHIPPED LOADERS '
      + 'THEMSELVES (`loadL3Dose` / `loadPcDose`, CALLED, exactly as PT-C0 arm A did); this '
      + `gate HASHES the bytes read from ${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them `
      + 'to the two PINNED expected values READ OF RECORD from PT-C0\'s own artifact '
      + `(PT-C0 §CORR 2's order). Pooled: ${L3_CELLS_POOLED} L3 cells, ${PC_ROWS_POOLED} PC `
      + 'rows, both NON-EMPTY. ⛔ On any mismatch the instrument REFUSES TO RUN — a dose is '
      + 'never approximated',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} anchored sites matched at `
      + 'their EXACT expected occurrence counts with 1-based line receipts stored, and the '
      + `five \`ticks at w = 1\` values DERIVED from the imported \`preCueTicks\` are `
      + `[${TICKS_AT_W1_DERIVED.join(', ')}] against RC-T0 §1's printed column `
      + `[${TICKS_AT_W1_EXPECTED.join(', ')}] — ${TICKS_COLUMN_PINNED ? 'IDENTICAL' : 'DIFFERENT'}`
      + `. Extracted values in play: AI_INTERVAL ${AI_INTERVAL} · tiers `
      + `${PC_TIER_SIMPLE_TICKS}/${PC_TIER_CHOICE_TICKS} · RC_PRECUE_FLOOR_TICKS `
      + `${RC_PRECUE_FLOOR_TICKS} · CONTROL_RADIUS ${CONTROL_RADIUS} · PTP_FLIGHT_SPEED `
      + `${PTP_FLIGHT_SPEED} · DUP_RUN_M ${DUP_RUN_M} · SAMPLE_EVERY ${SAMPLE_EVERY} · sectors `
      + `[${SECTORS.join(', ')}]. ⭐ every count in this note is DERIVED from the same pinned `
      + 'values the gate checks (canon: gate notes derive)',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — the DX-C2/RC-C0 account, `predictedArrDist`, the A4 spacing/dup-run/'
      + 'min-pairwise arithmetic, the delivery + ground + measurable predicates, the outcome '
      + 'ladder, the first-contact classes, the BK `BodySector` classifier CALLED on '
      + 'constructed geometries, the hold law at its corners and the five w = 1 ticks, and '
      + 'every bin helper',
  },
  gArmsDiverge: {
    ok: ARMS_DIVERGE,
    note: '⭐ the RECEIPT that the door demonstrably bites, PER PAIR: '
      + divergeByPair.map((r) => `${r.pair} diverged on ${r.diverged.length}/`
        + `${LOCKSTEP_SEEDS.length} scratch seeds`).join(' · ')
      + '. ⚠ SOME, not EVERY (#364 item 1) — a match where NO hold ever changes legally walks '
      + 'byte-identically in both arms. ⭐ ONLY THE SCORED (E) PAIR IS GATED; the DOSED (D) '
      + 'pair\'s count is REPORTED whatever it is, because an inert dosed pair is the ENTRY '
      + 'QUESTION\'s own evidence and must never be a red gate. An INSTRUMENT receipt, never a '
      + 'finding',
  },
  gPreCueReceipt: {
    ok: preCuedArmsTotalEArmed > 0 && preCuedArmsTotalShut === 0,
    note: `⭐ LIVENESS ONLY, never direction: E-ARMED's own ledger shows `
      + `${preCuedArmsTotalEArmed} pre-cued arms summed over the battery (> 0 required) and `
      + `BOTH SHUT arms show EXACTLY ${preCuedArmsTotalShut} (the path is unreachable with the `
      + 'flag and gene absent). ⛔ D-ARMED\'s own count '
      + `(${preCuedArmsTotalDArmed} over the battery) is REPORTED WHATEVER IT IS and is NEVER `
      + 'GATED — it is the entry question\'s own evidence',
  },
  gPreCueLedgerAgrees: {
    ok: allRows.every((r) => sum(r.preCueTickN) === r.preCuedArms),
    note: '⭐ THE HISTOGRAM IS THE LEDGER: on EVERY walked match in EVERY arm the sum of the '
      + 'tier-transition histogram\'s own n over the six rank buckets EQUALS the seat\'s OWN '
      + '`ledger.preCuedArms` — which proves the `armedTick === simTick − 1` selection counts '
      + 'each pre-cued arm exactly once and misses none. ⛔ PLUMBING, never direction',
  },
  gPartition: {
    ok: partitionOk,
    note: 'every wind-up flight lands in EXACTLY ONE outcome per group, the reached-point / gap '
      + '/ along / lateral denominators agree row by row, start delay + censored = W\'s own n, '
      + 'the pcHold observed denominator is that same n, the first-contact classes and the '
      + 'facing sectors sum to their flight counts, and the pre-cue rank histogram sums to its '
      + 'own n — ALL FOUR ARMS plus the construction receipt',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((a) => sum(rowsOf(a).map((r) => r.gapN[GG('meetableCarried')])) > 0
      && sum(rowsOf(a).map((r) => r.byDelivCarried)) > 0
      && sum(rowsOf(a).map((r) => r.gpFlights)) > 0
      && sum(rowsOf(a).map((r) => r.recvSectorN)) > 0
      && sum(rowsOf(a).map((r) => r.minPairN)) > 0
      && sum(rowsOf(a).map((r) => r.sdCensored[WG('meetableCarried')])) >= 0
      && sum(rowsOf(a).map((r) => r.sdN[WG('meetableCarried')])) > 0),
    note: '⛔ no face on an empty cell: in EVERY arm the meetable-carried gap denominator, the '
      + 'carried class, the measured ground-pass population, the completed-pass facing sample, '
      + 'the crowd sample and the OBSERVED-start bucket are all live, and the CENSORED-start '
      + 'bucket is COUNTED. ⚠ LIVENESS only — no direction is asserted anywhere',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: `⭐ THERE IS NO WRAPPER AT ALL: observation is pure per-tick reads of Match state, `
      + `and ${lockstepRows.length} observed-vs-unobserved arm-walks on out-of-band scratch `
      + `(${LOCKSTEP_SEEDS.join(', ')}) are BYTE-IDENTICAL. The private holds map is read by a `
      + 'pure `Map.get` / iteration — the MUTATING `holdFor` accessor is never called',
  },
  gLadderClean: {
    ok: LADDER_CLEAN && LADDER_LIVE,
    note: `⭐ the SEASON LADDER is REPORTED and GATED BY NOTHING AS FOOTBALL; this receipt is `
      + `INSTRUMENT hygiene only: ${ladderCells.length} ladder cells, ZERO door-wrong matches, `
      + 'ZERO franchise-dirty sides (no world dose and — in the CONTROL arm — no '
      + '`rcAnticipationWeight` ever in `info.genome`), and the evolvable arm\'s gene really '
      + 'entered the population (nothing is pre-seeded and no value is ever set by hand)',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: '⛔ X-SRC-ZERO: worktree-vs-HEAD over `src/` EMPTY BOTH WAYS (canon: xSrcUntouched — '
      + '`git diff --stat HEAD -- src` AND `git status --porcelain -- src`). The seam under '
      + 'exam is already in the tree; this exam adds nothing there',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && LADDER_SEEDS.every((s) => inBlock(s) && !walkedSeeds.includes(s))
        && !walkedSeeds.includes(RECEIPT_SEED)
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: `BOOKED = WALKED: ${walkedSeeds.length} battery seeds, each walked EXACTLY ONCE PER `
      + `ARM (${ARMS.length} arms) plus the construction-receipt seed ${RECEIPT_SEED} in all `
      + `four arms = ${walksBooked} walks. THE BLOCK'S OWN PARTITION, disjoint by construction: `
      + `battery ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]} · ladder leagues `
      + `${LADDER_SEEDS.join(', ')} · receipt ${RECEIPT_SEED}. Lockstep on OUT-OF-BAND scratch `
      + `(${LOCKSTEP_SEEDS.join(', ')}) — canon: verifier scratch seeds`,
  },
  gN: {
    ok: SIZING_OK && N_FROZEN <= N_MAX_PAIRS && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? `THE OVERRIDE ARM: declared (${OVERRIDE_REASONS.join(', ')}), n = ${cells.length} as `
        + 'declared, artifact off every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = `
        + `${N_FROZEN} pairs (the block affords ${N_MAX_PAIRS} after the ladder and the receipt `
        + 'are reserved)',
  },
  gHashOrder: {
    ok: BODY_SCHEMA.length === new Set(BODY_SCHEMA).size
      && faces.length === FACE_KEYS.length * ARMS.length
      && deltas.length === FACE_KEYS.length * PAIRS.length
      && (H_RC1 === 'PASS' || H_RC1 === 'FAIL')
      && DOSED_READ_PRINTED.length > 0,
    note: '⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
      + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
      + `body is the ${BODY_SCHEMA.length} named keys and nothing else; \`hashedBodySha256\` is `
      + `computed LAST (after every face, Δ, verdict word and read sentence exists: `
      + `${faces.length} face rows, ${deltas.length} Δ rows, verdict ${H_RC1}), and the FILE `
      + 'BYTE-HASH is published in §R',
  },
  gLOO: {
    ok: LOO_OK,
    note: `⭐ every SCORED Δ carries its LOO flip count (the #346/#348 orders): `
      + scoredDeltas.map((d) => `${d.pair}.${d.key} = ${d.looFlips}`).join(' · ')
      + '. ⚠ the flip read uses the CONSERVATIVE POINT-SHIFT form (the interval translated by '
      + 'each dropped seed\'s influence) — stated, never hidden',
  },
};

/* ========================================================================== */
/* §18 THE ARTIFACT — per-pair × per-arm cells, stored bins, the allowlist body */
/* ========================================================================== */
const pooled = (arm: Arm): {
  startDelayTicks: number[][]; pcHoldAppliedTicks: number[][]; gapDiffMetres: number[][];
  alongLineOffsetMetres: number[][]; lateralOffsetMetres: number[][];
  preCueHoldTicksByRank: number[][]; nearestMateMetres: number[]; minPairwiseMetres: number[];
  contactClass: number[]; receiverSector: number[]; outcome: number[][];
} => {
  const sdB = zeros2(NWG, SD_BINS);
  const pcB = zeros2(NWG, PC_HOLD_BINS);
  const gapB = zeros2(NGG, CAL_BINS);
  const alB = zeros2(NGG, ALONG_BINS);
  const laB = zeros2(NGG, LAT_BINS);
  const rkB = zeros2(NRANK, HOLD_BINS);
  const neB = zeros(NEAR_BINS);
  const mpB = zeros(MINPAIR_BINS);
  const ccB = zeros(CONTACTS.length);
  const rsB = zeros(SECTORS.length);
  const ocB = zeros2(NGG, OUTCOMES.length);
  for (const r of armRows(arm)) {
    addInto2(sdB, r.sdBins); addInto2(pcB, r.pcHoldBins); addInto2(gapB, r.gapDiffBins);
    addInto2(alB, r.alongBins); addInto2(laB, r.latBins); addInto2(rkB, r.preCueHoldBins);
    addInto(neB, r.nearBins); addInto(mpB, r.minPairBins);
    addInto(ccB, r.contactClass); addInto(rsB, r.recvSector); addInto2(ocB, r.outc);
  }
  return {
    startDelayTicks: sdB, pcHoldAppliedTicks: pcB, gapDiffMetres: gapB,
    alongLineOffsetMetres: alB, lateralOffsetMetres: laB, preCueHoldTicksByRank: rkB,
    nearestMateMetres: neB, minPairwiseMetres: mpB,
    contactClass: ccB, receiverSector: rsB, outcome: ocB,
  };
};
const pooledByArm = Object.fromEntries(ARMS.map((a) => [a, pooled(a)])) as
  Record<Arm, ReturnType<typeof pooled>>;
/** ⭐ BIN-DERIVED medians so `gFaces` re-derives every one of them off disk — canon,
 *  VERBATIM: "the re-derivation gate covers EVERY published face; a percentile face requires
 *  stored bins" (home: ruling #287 item 1 + PC-C0-REACTION-BASELINE.md §CORR item 4). */
const medians = Object.fromEntries(ARMS.map((a) => {
  const p = pooledByArm[a];
  return [a, {
    startDelayTicks: WGROUPS.map((_, gi) => binMedian(p.startDelayTicks[gi], SD_BIN_TICKS, false)),
    pcHoldAppliedTicks: WGROUPS.map((_, gi) => binMedian(p.pcHoldAppliedTicks[gi], 1, false)),
    gapDiffMetres: GGROUPS.map((_, gi) => binMedian(p.gapDiffMetres[gi], CAL_BIN_M, true)),
    alongLineOffsetMetres: GGROUPS.map((_, gi) =>
      binMedian(p.alongLineOffsetMetres[gi], ALONG_BIN_M, true)),
    lateralOffsetMetres: GGROUPS.map((_, gi) =>
      binMedian(p.lateralOffsetMetres[gi], LAT_BIN_M, false)),
    preCueHoldTicksByRank: Array.from({ length: NRANK }, (_, r) =>
      binMedian(p.preCueHoldTicksByRank[r], 1, false)),
    minPairwiseMetres: binMedian(p.minPairwiseMetres, MINPAIR_BIN_M, false),
    nearestMateMetres: binMedian(p.nearestMateMetres, NEAR_BIN_M, false),
  }];
})) as unknown as Record<Arm, Record<string, unknown>>;

/** ⭐ THE HONEST LIMITS — this artifact stores the DOC's list VERBATIM or stores NONE. Canon,
 *  VERBATIM: "a stage doc's HONEST LIMITS list is the ONE home; the artifact stores that list
 *  verbatim or stores none" (home: RC-C0-COOPERATION-CENSUS.md §CORR item 3, ruling #367
 *  item 3). ⇒ STORES NONE: the ONE home is docs/world-model/RC-T1A-PRECUE-EXAM.md §HONEST
 *  LIMITS. */
const HONEST_LIMITS_NOTE = '⛔ NOT STORED HERE BY DESIGN. Canon, VERBATIM: "a stage doc\'s '
  + 'HONEST LIMITS list is the ONE home; the artifact stores that list verbatim or stores none" '
  + '(home: RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). '
  + 'THE ONE HOME: docs/world-model/RC-T1A-PRECUE-EXAM.md §HONEST LIMITS.';

const perPairCells = cells.map((c) => ({ seed: c.seed, rows: c.rows }));
const artifact: Record<string, unknown> = {
  stage: {
    id: 'RC-T1a',
    title: 'THE PRE-CUE EXAM — does opening the pre-cue door move the receiver closer to the '
      + 'ball when it arrives, without costing completion or conceding more interceptions',
    doc: 'docs/world-model/RC-T1A-PRECUE-EXAM.md',
    contracts: [
      'docs/world-model/RC-RECEIVER-COOPERATION-CONTRACT.md §2-AMENDMENT M-RC.3a',
      'docs/world-model/PC-PERCEPTION-CONTRACT.md §2-AMENDMENT M-PC.1b',
    ],
    lineage: 'RC-C0 (the licence + the 3.13 m gap) → PT-C0 (the user\'s three sentences, and '
      + 'THE DOSE MOVES THE GAME) → RC-T0 (the dormant seam, commit b74b1e8) → #370 item 5',
    authorizedBy: 'COMMANDER RULING #370 item 5',
    kind: 'EXAM — H-RC.1 is scored by the frozen §P.C rules ON THE EMPTY-BOOK PAIR ONLY; every '
      + 'other face, and the WHOLE DOSED PAIR, is REPORTED, gated by nothing.',
    xSrcZero: '⛔ the exam instrument edits nothing under `src/`: the seam under test landed at '
      + 'RC-T0 with its own 23-pin suite. THERE IS NO WRAPPER AT ALL — observation is pure '
      + 'per-tick reads of Match state (`gLockstep`).',
    receiptsAreNotEffectSizes: '⛔ `preCuedArms`, the armed-hold counts, the book-covered share '
      + 'and the tier-transition histogram are ARMING PLUMBING and are NEVER quoted as football '
      + 'effect sizes (home: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §CORR item 5).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/rc-t1a-precue-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/rc-t1a-precue-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries([...SRC.entries()]
      .filter(([p]) => p.startsWith('src/')).map(([p, s]) => [p, sha(s)])),
  },
  arms: Object.fromEntries(ARMS.map((a) => [a, ARM_LABEL[a]])),
  definitions: {
    pairs: PAIRS.map((p) => ({ pair: p.key, shut: p.shut, armed: p.armed, form: p.form })),
    matchLocalGeneIdiom: '⭐ `setRaGenes`\'s own form, copied: `baseGenome` and `effGenome` are '
      + 'replaced by SPREAD COPIES carrying world 12\'s two pins forward, and `info.genome` is '
      + 'NEVER written (canon: dose placement) — `gGenomeClean` proves it on every walked match.',
    whatNullMeans: '`armA4World(m, null, 12)` — the FIRST `null` is the A4 tables argument, '
      + 'which cannot reach world 12 at all (the RA branch RETURNS before the tables refusal). '
      + 'In the EMPTY-BOOK arms the two DOSE arguments are also absent, so the recognition '
      + 'books are BORN ABSENT (everyone a novice, every reaction pays the long tier) and the '
      + 'two defence books stay as the season left them.',
    account: 'tBall = dist(passer, E) / PTP_FLIGHT_SPEED · tMate = dist(mate, E) / '
      + 'max(topSpeed, 0.1) + 0.15 · margin = tBall − tMate · MEETABLE ⇔ dist(mate, E) ≤ '
      + 'CONTROL_RADIUS OR margin ≥ 0 — DX-C2 §P.A via RC-C0 §P.B, at the ARM INSTANT.',
    armInstant: 'the mate\'s arm position is the record\'s own `aim` (EXACT, so dMate = '
      + '|aimLead|); the passer\'s position and the mate\'s `topSpeed` are read at the END of '
      + 'the arm tick because with NO WRAPPER mid-tick is not observable — RC-C0 §P.B\'s own '
      + 'declared deviation, ≤ 1 tick (≈ 0.13 m at top pace) on the passer\'s position only.',
    predictedArrDist: 'max(0, dMate − max(0, tBall − 0.15) · max(topSpeed, 0.1)) — RC-C0 '
      + '§P.D / DX-C2 §P.D, reused byte for byte.',
    measuredArrival: 'the receiver→E distance at the tick the ball\'s along-line projection '
      + 'first reaches E (DX-C1 / DX-C2 / RC-C0\'s own arrival read).',
    startDelay: 'ticks from the RELEASE tick to the first tick at which '
      + '`target.action.type === \'ReceivePass\'`. CENSORED if he never enters it before the '
      + 'flight retires — that bucket is COUNTED and never imputed.',
    pcHold: 'OBSERVED from Match state: `match.pcLatency`\'s own hold record for the target '
      + 'gid, matched on `armedTick === releaseTick` ∧ `klass === \'passRelease\'`, published '
      + 'as its APPLIED `ticks` (the #280 form, never nominal). A PURE `Map.get` on the private '
      + 'holds map — the MUTATING `holdFor` accessor is NEVER called. ⚠ RC-C0 §CORR 2: the '
      + 'field is the ARMED tier length (the hold\'s own length), not the ticks actually spent.',
    tierTransitionCurve: '⭐ the pre-cued holds\' APPLIED tick histogram BY RANK, where the '
      + 'rank is recovered from the record\'s own stored `belief` by exact float comparison '
      + 'against the seat\'s frozen table (rank 0 = no cue / a rank the census never saw). '
      + 'M-PC.1b\'s own honest limit: the interpolation FORM is linear in the belief BY CHOICE, '
      + 'so the curve is published and a non-linear reality would show.',
    e4: {
      forwardPassShare: '`mt-ladder.ts`\'s OWN definition, anchored: (passesForward[0] + '
        + 'passesForward[1]) / (passes[0] + passes[1]) from the team stats.',
      thirdMan: 'the engine\'s own completed third-man release counter (`Match.ts`, anchored).',
      overlaps: 'the engine\'s own completed overlap release counter (`Match.ts`, anchored).',
      chainLength: 'the engine\'s OWN possession-chain ledger `bestPassChain` — "Longest chain '
        + 'of consecutive completed passes in one move" (`types.ts`, anchored) — summed over '
        + 'the two teams over TWO team-matches. ONE anchored definition, reused not re-invented.',
    },
    userFaces: 'PT-C0\'s own code reused: `contact.opponentFirstContactShare` (the first body '
      + 'the ball contacts after a measured ground pass) · the receiver\'s facing SECTOR at his '
      + 'first touch on COMPLETED passes (the BK `BodySector` classifier CALLED) · '
      + '`crowd.crashShare` (the A4 min-pairwise limb under DUP_RUN_M) + the dup-run and '
      + 'spacing limbs beside.',
    estimator: `CLUSTER BOOTSTRAP over the SHARED seeds, ${BOOTSTRAP} draws, rng seeded from `
      + 'the block base — the RA-T1B estimator. Both arms of a pair move together inside every '
      + 'draw, so every interval is a PAIRED one BY CONSTRUCTION.',
    clock: '⚠ every rate is on the 240 s MATCH clock; 1 sim-s = 60 ticks = 22.5 display-s; '
      + 'every tick figure is an APPLIED tick, never nominal.',
  },
  doseSource: {
    what: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field".',
    loadersCalled: ['loadL3Dose', 'loadPcDose'],
    files: {
      [L3_DOSE_FILE]: { expected: L3_DOSE_SHA_EXPECTED, got: L3_DOSE_BYTES_SHA,
        ok: L3_DOSE_BYTES_SHA === L3_DOSE_SHA_EXPECTED },
      [PC_DOSE_FILE]: { expected: PC_DOSE_SHA_EXPECTED, got: PC_DOSE_BYTES_SHA,
        ok: PC_DOSE_BYTES_SHA === PC_DOSE_SHA_EXPECTED },
    },
    expectedValuesReadOfRecordFrom: 'docs/world-model/data/pt-c0-playtest-forensic-census.json '
      + '`doseSource.files` (published at PT-C0, PINNED here per PT-C0 §COMMANDER CORRECTIONS '
      + 'item 2)',
    l3CellsPooled: L3_CELLS_POOLED, pcRowsPooled: PC_ROWS_POOLED,
    refusalBehaviour: '⛔ on any byte mismatch the instrument exits 3 BEFORE any walk — a dose '
      + 'is never approximated.',
  },
  anchoredSites: ANCHORS,
  ticksAtWeightOne: {
    what: '⭐⭐ RC-T0 §COMMANDER CORRECTIONS item 1\'s own order: "RC-T1a\'s instrument pins '
      + 'all five as anchored fixtures". DERIVED at gate time from the IMPORTED `preCueTicks`, '
      + 'never typed beside the pin (canon: gate notes derive).',
    recipe: 'preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1, RC_BELIEF_BY_RANK[r−1])',
    ranks: [1, 2, 3, 4, 5],
    beliefs: RC_BELIEF_BY_RANK,
    derived: TICKS_AT_W1_DERIVED,
    docColumnExpected: TICKS_AT_W1_EXPECTED,
    identical: TICKS_COLUMN_PINNED,
    tiers: { simple: PC_TIER_SIMPLE_TICKS, choice: PC_TIER_CHOICE_TICKS },
    honestCeilingTicks: RC_PRECUE_FLOOR_TICKS,
  },
  fixtures: { total: FIXTURES.length, passed: FIXTURES.filter((f) => f.ok).length, rows: FIXTURES },
  lockstep: lockstepRows,
  armsDiverge: divergeByPair,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-PAIR SCRATCH SMOKE (seeds 900,002,100–111), DISCLOSED '
      + 'in full at the doc\'s §DEV-PREFLIGHT; the realised paired-Δ half-widths were read out '
      + 'of the smoke artifact\'s own `deltas[].halfWidth` fields and HARDCODED into '
      + 'SIZING_INPUTS at the FREEZE COMMIT.',
    targets: '(a) 0.5 m — HALF the honest ceiling of ≈ 1 m (RC-T0 §4) · (b1) 0.010 (one point '
      + 'of completion) · (b2) 1.0/match (the RA-T1B value) · goals 0.25 (REPORTED, its MDE '
      + 'DECLARED).',
    nFrozen: N_FROZEN, nMaxPairs: N_MAX_PAIRS, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  hRC1: {
    scoredOn: 'THE EMPTY-BOOK PAIR ONLY (E-ARMED − E-SHUT)',
    frozenRules: {
      a: '(a) THE GAP FALLS — Δ(armed − shut) on `gap.meanDiffMetres.meetableCarried`: the '
        + '95 % paired interval lies ENTIRELY BELOW ZERO ⇒ FALLS.',
      b1: '(b1) COMPLETION DOES NOT FALL — Δ(armed − shut) on whole-match `passCompletion` '
        + '(the engine\'s ALL-deliveries face): the interval is NOT entirely below zero ⇒ '
        + 'DOES-NOT-FALL. Declared target 0.010.',
      b2: '(b2) INTERCEPTIONS DO NOT RISE — Δ(armed − shut) on `interceptionsPerMatch`: the '
        + 'interval is NOT entirely above zero ⇒ DOES-NOT-RISE. Declared target 1.0/match. '
        + '⚠ BOTH teams are armed in E-ARMED, so this is the MATCH TOTAL.',
      conjunction: 'H-RC.1 = PASS ⇔ (a) FALLS ∧ (b1) DOES-NOT-FALL ∧ (b2) DOES-NOT-RISE.',
      mdeWarning: '⚠ A NON-FALL / NON-RISE CERTIFIES NOTHING SMALLER THAN THE DECLARED MDE. '
        + 'Nothing smaller than an MDE is ever read as "no effect".',
    },
    aVerdict: A_VERDICT, b1Verdict: B1_VERDICT, b2Verdict: B2_VERDICT, verdict: H_RC1,
    aDelta: dA, b1Delta: dB1, b2Delta: dB2,
  },
  precommittedReads: {
    wordsOfRecord: '#370 item 5(v), verbatim: "H-RC.1 PASS on the empty-book pair ⇒ RC-T1a '
      + 'banks and the arc proceeds to RC-C0b (the facing limb\'s detector census); THE ENTRY '
      + 'QUESTION is then answered BY THE DOSED PAIR: if the dosed Δgap contains zero and '
      + 'dosed `preCuedArms` stay in single figures, world 13 = world 12 + limb 3a would change '
      + 'nothing the user can feel ⇒ ⛔ NO entry is cut for 3a alone — the entry WAITS for limb '
      + '3b (RC-T0b); if the dosed Δgap FALLS resolvedly, the RC entry candidate forms (gated '
      + 'as before on the user\'s world-12 verdict). (a) FAILS ⇒ the pre-cue does not move the '
      + 'receiver\'s arrival even where the room is largest — the FORM question (rank-only '
      + 'table · linear interpolation · the ≤ 1-tick drift) returns to the commander WITH '
      + 'numbers, never re-cut; (b) FAILS ⇒ a shorter hold costs football (rushed receivers) — '
      + 'the arc pauses at the user\'s fork with the weight rung named."',
    frozenSentences: {
      passBanks: READ_PASS_BANKS, aFails: READ_A_FAILS, bFails: READ_B_FAILS,
      dosedNoEntry: READ_DOSED_NO_ENTRY, dosedEntry: READ_DOSED_ENTRY,
      dosedUnresolved: READ_DOSED_UNRESOLVED,
    },
    selectors: {
      singleFiguresCeiling: SINGLE_FIGURES_CEILING,
      dosedGapCiLo: dDosedGap.ciLo, dosedGapCiHi: dDosedGap.ciHi,
      dosedGapFalls: RULE_DOSED_GAP_FALLS(dDosedGap),
      dosedGapContainsZero: dDosedGap.containsZero,
      dosedPreCuedArmsPerMatch: DOSED_PRECUED_ARMS_PER_MATCH,
      dosedArmsSingleFigures: DOSED_ARMS_SINGLE_FIGURES,
    },
    dosedReadPrinted: DOSED_READ_PRINTED,
    verdictReadsPrinted: VERDICT_READS_PRINTED,
  },
  seasonLadder: {
    note: '⭐ REPORTED, GATED BY NOTHING AS FOOTBALL (#370 item 5(iii)\'s own order). The '
      + 'BK-T4 §10 / DF-C0 §R4 / DX-T1 §13 house ladder with the gene axis re-pointed at '
      + '`rcAnticipationWeight`: BOTH arms walk THE ARMED WORLD (world 12 + `rcAnticipate`, '
      + 'EMPTY-BOOK), and the ONE difference is whether SELECTION MAY TOUCH THE GENE through '
      + 'the SHIPPED `mutateGenome` / `crossoverGenomes` opt-in. ⛔ NOTHING IS PRE-SEEDED and '
      + 'NO VALUE IS EVER SET BY HAND.',
    arms: LADDER_ARMS, teams: LADDER_TEAMS, generations: LADDER_GENS,
    leagueSeeds: LADDER_SEEDS,
    fixturesPerGeneration: (LADDER_TEAMS * (LADDER_TEAMS - 1)) / 2,
    selectionLaw: `elite ${LADDER_ELITE_N} · reborn ${LADDER_REBORN_N} · mutated the rest, `
      + `mutation {rate: ${MUT_RATE}, scale: ${MUT_SCALE}}, reborn {rate: ${REBORN_RATE}, `
      + `scale: ${REBORN_SCALE}} — \`evolveGroup\`'s own band law, mirrored probe-side because `
      + '`League.finishSeason` calls the shipped mutators with HARD-CODED options (the MT-T2 '
      + 'precedent).',
    matchSeedDerivation: 'hashSeed(leagueSeed, generation, fixtureIndex, 0xdc) — the SHIPPED '
      + '`hashSeed`, the `League.createMatch` idiom.',
    driftShadow: '⚠ THE NEUTRAL-DRIFT SHADOW rides the CONTROL arm: inert passengers mutated by '
      + 'the SAME law in their OWN rng namespace and inherited through the SAME '
      + 'elite/mutate/reborn assignments. They touch no match, so they are what the gene level '
      + 'looks like with ZERO selection on it — the honest null for "did selection ADOPT it".',
    limits: [
      `⚠ ONE ECOLOGY, ${LADDER_TEAMS} CLUBS, ${LADDER_SEEDS.length} LEAGUES, `
      + `${LADDER_GENS} GENERATIONS — a probe-side ladder, not the shipped League.`,
      '⚠ THE EARLY→LATE SLOPES ARE THE HOUSE IDIOM AND CARRY NO INTERVAL HERE.',
      '⛔ NO H-RC.1 CONJUNCT READS ANY LADDER NUMBER.',
    ],
    earlyGens: EARLY_GENS, lateFrom: LATE_FROM,
    wallSeconds: ladderWallSec,
    byGeneration: ladderByGeneration, slopes: ladderGeneSlopes, cells: ladderCells,
  },
  bins: {
    grids: {
      startDelayTicks: { width: SD_BIN_TICKS, bins: SD_BINS, overflowIsLast: true },
      pcHoldAppliedTicks: { width: 1, bins: PC_HOLD_BINS, overflowIsLast: true },
      preCueHoldTicksByRank: { width: 1, bins: HOLD_BINS, overflowIsLast: true, ranks: NRANK },
      gapDiffMetres: { width: CAL_BIN_M, bins: CAL_BINS, centreHoldsZero: true },
      alongLineOffsetMetres: { width: ALONG_BIN_M, bins: ALONG_BINS, centreHoldsZero: true },
      lateralOffsetMetres: { width: LAT_BIN_M, bins: LAT_BINS, overflowIsLast: true },
      nearestMateMetres: { width: NEAR_BIN_M, bins: NEAR_BINS, overflowIsLast: true },
      minPairwiseMetres: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, overflowIsLast: true },
    },
    pooledByArm,
  },
  medians,
  contactClasses: CONTACTS, sectors: SECTORS, outcomes: OUTCOMES,
  windowGroups: WGROUPS, gapGroups: GGROUPS,
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    constructionReceiptSeed: RECEIPT_SEED,
    walksBooked,
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    smokeScratchBand: [900_002_100, 900_002_111],
    ladderLeagueSeeds: LADDER_SEEDS,
    unwalkedTail: IS_OVERRIDE ? null
      : (batterySeeds[batterySeeds.length - 1] + 1 <= LADDER_SEEDS[0] - 1
        ? [batterySeeds[batterySeeds.length - 1] + 1, LADDER_SEEDS[0] - 1] : null),
    bootstrapRngSeededFrom: BLOCK_BASE,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  perf: {
    totalWallSeconds: (Date.now() - t0Wall) / 1000,
    batteryWalks: allRows.length,
    meanWallSecondsPerWalk: sum(allRows.map((r) => r.wallMs)) / 1000 / allRows.length,
    ladderWallSeconds: ladderWallSec,
    note: '⚠ A MACHINE READING ON ONE MACHINE.',
  },
  honestLimits: HONEST_LIMITS_NOTE,
  perPairCells,
  constructionReceipt: receiptRows,
};
const body: Record<string, unknown> = {};
for (const k of BODY_SCHEMA) body[k] = artifact[k];
artifact.hashedBodySha256 = sha(canonicalJson(body));

/* ========================================================================== */
/* §19 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const ALL_GREEN_PRE = Object.values(gates).every((g) => g.ok);
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perPairCells: { seed: number; rows: Record<Arm, Row> }[];
  faces: FaceRow[]; deltas: DeltaRow[];
  hRC1: { verdict: string; aVerdict: string; b1Verdict: string; b2Verdict: string;
    aDelta: DeltaRow; b1Delta: DeltaRow; b2Delta: DeltaRow };
  precommittedReads: {
    dosedReadPrinted: string; verdictReadsPrinted: string[];
    selectors: { singleFiguresCeiling: number; dosedGapCiLo: number; dosedGapCiHi: number;
      dosedGapFalls: boolean; dosedGapContainsZero: boolean;
      dosedPreCuedArmsPerMatch: number; dosedArmsSingleFigures: boolean };
  };
  bins: { pooledByArm: Record<Arm, ReturnType<typeof pooled>> };
  medians: Record<Arm, Record<string, unknown>>;
  sizing: { rows: typeof sizingRows };
  seasonLadder: { cells: LadderCell[]; byGeneration: typeof ladderByGeneration };
  ticksAtWeightOne: { derived: number[]; docColumnExpected: number[]; identical: boolean };
};
const dcells = disk.perPairCells;
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = dcells.map((c) => c.rows[f.arm]);
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  const v = ratio(nu, de);
  faceChecks.push({
    face: `${f.arm}.${f.face}`,
    ok: nu === f.numerator && de === f.denominator
      && (Number.isNaN(v) ? f.value === null || Number.isNaN(f.value) : v === f.value),
  });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.key];
  const pS = ratio(sum(dcells.map((c) => def.num(c.rows[dd.shutArm]))),
    sum(dcells.map((c) => def.dn(c.rows[dd.shutArm]))));
  const pA = ratio(sum(dcells.map((c) => def.num(c.rows[dd.armedArm]))),
    sum(dcells.map((c) => def.dn(c.rows[dd.armedArm]))));
  const eq = (a: number, b: number): boolean => (Number.isNaN(a)
    ? (b === null || Number.isNaN(b)) : a === b);
  faceChecks.push({
    face: `delta.${dd.pair}.${dd.key}`,
    ok: eq(pS, dd.shutValue) && eq(pA, dd.armedValue) && eq(pA - pS, dd.delta),
  });
}
const binChecks: { check: string; ok: boolean }[] = [];
/* ⭐ THE VERDICT WORDS AND THE READ SENTENCES RE-DERIVE FROM THE SERIALIZED Δ ROWS */
{
  const h = disk.hRC1;
  const reA = h.aDelta.ciHi < 0 ? 'FALLS' : 'DOES-NOT-FALL';
  const reB1 = !(h.b1Delta.ciHi < 0) ? 'DOES-NOT-FALL' : 'FALLS';
  const reB2 = !(h.b2Delta.ciLo > 0) ? 'DOES-NOT-RISE' : 'RISES';
  const reAll = (reA === 'FALLS' && reB1 === 'DOES-NOT-FALL' && reB2 === 'DOES-NOT-RISE')
    ? 'PASS' : 'FAIL';
  binChecks.push({ check: 'hRC1.aVerdict', ok: reA === h.aVerdict });
  binChecks.push({ check: 'hRC1.b1Verdict', ok: reB1 === h.b1Verdict });
  binChecks.push({ check: 'hRC1.b2Verdict', ok: reB2 === h.b2Verdict });
  binChecks.push({ check: 'hRC1.verdict', ok: reAll === h.verdict });
  const s = disk.precommittedReads.selectors;
  const reDosed = s.dosedGapCiHi < 0 ? READ_DOSED_ENTRY
    : ((!(s.dosedGapCiHi < 0) && !(s.dosedGapCiLo > 0))
      && s.dosedPreCuedArmsPerMatch < s.singleFiguresCeiling
      ? READ_DOSED_NO_ENTRY : READ_DOSED_UNRESOLVED);
  binChecks.push({ check: 'precommittedReads.dosedReadPrinted',
    ok: reDosed === disk.precommittedReads.dosedReadPrinted });
  const reVerdictReads = [
    ...(reAll === 'PASS' ? [READ_PASS_BANKS] : []),
    ...(reA !== 'FALLS' ? [READ_A_FAILS] : []),
    ...(reB1 !== 'DOES-NOT-FALL' || reB2 !== 'DOES-NOT-RISE' ? [READ_B_FAILS] : []),
  ];
  binChecks.push({ check: 'precommittedReads.verdictReadsPrinted',
    ok: JSON.stringify(reVerdictReads)
      === JSON.stringify(disk.precommittedReads.verdictReadsPrinted) });
  binChecks.push({ check: 'precommittedReads.selectors.dosedGapFalls',
    ok: (s.dosedGapCiHi < 0) === s.dosedGapFalls });
  binChecks.push({ check: 'precommittedReads.selectors.containsZero',
    ok: (!(s.dosedGapCiHi < 0) && !(s.dosedGapCiLo > 0)) === s.dosedGapContainsZero });
  binChecks.push({ check: 'precommittedReads.selectors.singleFigures',
    ok: (s.dosedPreCuedArmsPerMatch < s.singleFiguresCeiling) === s.dosedArmsSingleFigures });
}
/* ⭐ EVERY POOLED BIN re-derives by summing the SERIALIZED per-pair cells */
for (const arm of ARMS) {
  const p = disk.bins.pooledByArm[arm];
  const rows = dcells.map((c) => c.rows[arm]);
  const check = (name: string, got: number[] | number[][], want: number[] | number[][]): void => {
    binChecks.push({ check: `bins.${arm}.${name}`,
      ok: JSON.stringify(got) === JSON.stringify(want) });
  };
  const acc2 = (a: number, b: number, pick: (r: Row) => number[][]): number[][] => {
    const out = zeros2(a, b);
    for (const r of rows) addInto2(out, pick(r));
    return out;
  };
  const acc1 = (n: number, pick: (r: Row) => number[]): number[] => {
    const out = zeros(n);
    for (const r of rows) addInto(out, pick(r));
    return out;
  };
  check('startDelayTicks', acc2(NWG, SD_BINS, (r) => r.sdBins), p.startDelayTicks);
  check('pcHoldAppliedTicks', acc2(NWG, PC_HOLD_BINS, (r) => r.pcHoldBins), p.pcHoldAppliedTicks);
  check('gapDiffMetres', acc2(NGG, CAL_BINS, (r) => r.gapDiffBins), p.gapDiffMetres);
  check('alongLineOffsetMetres', acc2(NGG, ALONG_BINS, (r) => r.alongBins),
    p.alongLineOffsetMetres);
  check('lateralOffsetMetres', acc2(NGG, LAT_BINS, (r) => r.latBins), p.lateralOffsetMetres);
  check('preCueHoldTicksByRank', acc2(NRANK, HOLD_BINS, (r) => r.preCueHoldBins),
    p.preCueHoldTicksByRank);
  check('nearestMateMetres', acc1(NEAR_BINS, (r) => r.nearBins), p.nearestMateMetres);
  check('minPairwiseMetres', acc1(MINPAIR_BINS, (r) => r.minPairBins), p.minPairwiseMetres);
  check('contactClass', acc1(CONTACTS.length, (r) => r.contactClass), p.contactClass);
  check('receiverSector', acc1(SECTORS.length, (r) => r.recvSector), p.receiverSector);
  check('outcome', acc2(NGG, OUTCOMES.length, (r) => r.outc), p.outcome);
  /* ⭐ EVERY BIN-DERIVED MEDIAN re-derives off the SERIALIZED bins */
  const md = disk.medians[arm] as Record<string, unknown>;
  const eqJson = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
  binChecks.push({ check: `medians.${arm}.startDelayTicks`,
    ok: eqJson(WGROUPS.map((_, gi) => binMedian(p.startDelayTicks[gi], SD_BIN_TICKS, false)),
      md.startDelayTicks) });
  binChecks.push({ check: `medians.${arm}.pcHoldAppliedTicks`,
    ok: eqJson(WGROUPS.map((_, gi) => binMedian(p.pcHoldAppliedTicks[gi], 1, false)),
      md.pcHoldAppliedTicks) });
  binChecks.push({ check: `medians.${arm}.gapDiffMetres`,
    ok: eqJson(GGROUPS.map((_, gi) => binMedian(p.gapDiffMetres[gi], CAL_BIN_M, true)),
      md.gapDiffMetres) });
  binChecks.push({ check: `medians.${arm}.preCueHoldTicksByRank`,
    ok: eqJson(Array.from({ length: NRANK }, (_, r) =>
      binMedian(p.preCueHoldTicksByRank[r], 1, false)), md.preCueHoldTicksByRank) });
  binChecks.push({ check: `medians.${arm}.minPairwiseMetres`,
    ok: binMedian(p.minPairwiseMetres, MINPAIR_BIN_M, false) === md.minPairwiseMetres });
}
/* ⭐ THE SIZING ROWS re-derive off disk */
for (const r of disk.sizing.rows) {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
  binChecks.push({
    check: `sizing.${r.face}@${r.target}`,
    ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded && nReq === r.nRequired
      && hwAtN === r.expectedHalfWidthAtNFrozen
      && hwAtN * ZSUM / Z975 === r.mdeAtNFrozen
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen,
  });
}
/* ⭐ THE FIVE `ticks at w = 1` VALUES re-derive off disk against the imported law */
binChecks.push({
  check: 'ticksAtWeightOne.reDerives',
  ok: JSON.stringify(disk.ticksAtWeightOne.derived) === JSON.stringify([1, 2, 3, 4, 5]
    .map((r) => preCueTicks(PC_TIER_SIMPLE_TICKS, PC_TIER_CHOICE_TICKS, 1,
      RC_BELIEF_BY_RANK[r - 1])))
    && JSON.stringify(disk.ticksAtWeightOne.derived)
      === JSON.stringify(disk.ticksAtWeightOne.docColumnExpected)
    && disk.ticksAtWeightOne.identical === true,
});
/* ⭐ THE SEASON LADDER's per-generation aggregates re-derive off its OWN stored cells */
for (const g of disk.seasonLadder.byGeneration) {
  const cs = disk.seasonLadder.cells.filter((c) => c.arm === g.arm && c.generation === g.generation);
  const mt = sum(cs.map((c) => c.matches));
  binChecks.push({
    check: `seasonLadder.${g.arm}.gen${g.generation}`,
    ok: cs.length === g.leagues && mt === g.matches
      && round(ratio(sum(cs.map((c) => c.goals)), mt), 6) === g.goalsPerMatch
      && round(ratio(sum(cs.map((c) => c.preCuedArms)), mt), 6) === g.preCuedArmsPerMatch
      && round(mean(cs.map((c) => c.geneMean)), 8) === g.geneMean,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} verdict / read-sentence / `
    + 'bin / median / sizing / ticks-column / ladder checks re-derived from the SERIALIZED '
    + 'artifact off disk — canon, VERBATIM: "the re-derivation gate covers EVERY published '
    + 'face; a percentile face requires stored bins". H-RC.1\'s own three conjunct words, the '
    + 'VERDICT word and the PRE-COMMITTED READ SENTENCES are INCLUDED',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = ALL_GREEN_PRE && FACES_OK;
artifact.allGreen = ALL_GREEN;
const OUT_PATH = ALL_GREEN ? OUT_BASE : `${OUT_BASE}.RED.json`;
writeFileSync(OUT_PATH, `${JSON.stringify(artifact, null, 2)}\n`);
if (OUT_PATH !== OUT_PATH_PRE) {
  try { execSync(`rm -f ${JSON.stringify(OUT_PATH_PRE)}`); } catch { /* nothing */ }
}
const FILE_BYTE_SHA = sha(readFileSync(OUT_PATH, 'utf8'));

/* ========================================================================== */
/* §20 THE CONSOLE READ                                                        */
/* ========================================================================== */
const f6 = (v: number): string => (Number.isFinite(v) ? v.toFixed(6) : String(v));
banner('');
banner(`RC-T1A — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- H-RC.1 (SCORED on the EMPTY-BOOK pair) ---');
banner(`  (a) gap.meanDiffMetres.meetableCarried  shut ${f6(dA.shutValue)} → armed `
  + `${f6(dA.armedValue)}  Δ ${f6(dA.delta)} [${f6(dA.ciLo)}, ${f6(dA.ciHi)}] `
  + `(${f6(dA.absDeltaOverHalfWidth)} hw, LOO flips ${dA.looFlips})  ⇒ ${A_VERDICT}`);
banner(`  (b1) passCompletion  shut ${f6(dB1.shutValue)} → armed ${f6(dB1.armedValue)}  Δ `
  + `${f6(dB1.delta)} [${f6(dB1.ciLo)}, ${f6(dB1.ciHi)}] (LOO flips ${dB1.looFlips})  ⇒ `
  + `${B1_VERDICT}`);
banner(`  (b2) interceptionsPerMatch  shut ${f6(dB2.shutValue)} → armed ${f6(dB2.armedValue)}  Δ `
  + `${f6(dB2.delta)} [${f6(dB2.ciLo)}, ${f6(dB2.ciHi)}] (LOO flips ${dB2.looFlips})  ⇒ `
  + `${B2_VERDICT}`);
banner(`  ⭐⭐ H-RC.1 = ${H_RC1}`);
banner('');
banner('--- THE PRE-COMMITTED READS, PRINTED BY THE FROZEN FORM ---');
for (const s of VERDICT_READS_PRINTED) banner(`  ${s}`);
banner(`  THE ENTRY QUESTION (the DOSED pair): ${DOSED_READ_PRINTED}`);
banner(`    dosed Δgap ${f6(dDosedGap.delta)} [${f6(dDosedGap.ciLo)}, ${f6(dDosedGap.ciHi)}] · `
  + `dosed preCuedArms/match ${f6(DOSED_PRECUED_ARMS_PER_MATCH)} `
  + `(single figures = ${DOSED_ARMS_SINGLE_FIGURES})`);
banner('');
const REPORT_KEYS = [
  'receipt.preCuedArmsPerMatch', 'receipt.armedHoldsPerMatch', 'receipt.bookCoveredArmShare',
  'window.startDelayMeanSimSeconds.meetableCarried', 'window.startDelayMeanSimSeconds.all',
  'window.startDelayCensoredShare.meetableCarried',
  'window.pcHoldMeanAppliedTicks.meetableCarried', 'window.pcHoldObservedShare.meetableCarried',
  'gap.meanDiffMetres.carried', 'gap.measuredMetres.meetableCarried',
  'goalsPerMatch', 'shotsPerMatch',
  'e4.forwardPassShare', 'e4.thirdManPerMatch', 'e4.overlapsPerMatch',
  'e4.bestPassChainMeanPerTeam',
  'contact.opponentFirstContactShare', 'contact.receiverSideShareCompleted',
  'contact.receiverFrontShareCompleted', 'contact.receiverBackShareCompleted',
  'crowd.crashShare', 'crowd.dupRunPairsPerSample', 'crowd.nearestMateMeanMetres',
  'window.meetableShareCarried', 'arrival.reachedPointShare.meetableCarried',
  'arrival.alongLineOffsetMeanMetres.meetableCarried',
  'arrival.lateralOffsetMeanMetres.meetableCarried',
  'context.groundPassesPerMatch', 'context.windupsReleasedPerMatch',
];
for (const p of PAIRS) {
  banner(`--- REPORTED — pair ${p.key}: ${p.form} ---`);
  for (const k of REPORT_KEYS) {
    const dd = delta(p.key, k);
    banner(`  ${k.padEnd(48)} shut ${f6(dd.shutValue)} → armed ${f6(dd.armedValue)}  Δ `
      + `${f6(dd.delta)} [${f6(dd.ciLo)}, ${f6(dd.ciHi)}]`);
  }
  banner('');
}
banner('--- THE TIER-TRANSITION CURVE (pre-cued holds by RANK; ⛔ PLUMBING) ---');
for (const arm of ['E-ARMED', 'D-ARMED'] as const) {
  const rows = armRows(arm);
  const nByRank = Array.from({ length: NRANK }, (_, r) => sum(rows.map((x) => x.preCueTickN[r])));
  const mByRank = Array.from({ length: NRANK }, (_, r) => ratio(
    sum(rows.map((x) => x.preCueTickSum[r])), nByRank[r],
  ));
  banner(`  ${arm}: ` + Array.from({ length: NRANK }, (_, r) =>
    `rank ${r} n=${nByRank[r]} mean=${f6(mByRank[r])}`).join(' · '));
}
banner('');
banner('--- THE SEASON LADDER (REPORTED, gated by nothing as football) ---');
for (const s of ladderGeneSlopes) {
  banner(`  ${s.arm.padEnd(14)} gene mean early→late Δ ${f6(s.geneDelta)} · goals/match Δ `
    + `${f6(s.goalsDelta)}`);
}
const lastGen = ladderByGeneration.filter((g) => g.generation === LADDER_GENS);
for (const g of lastGen) {
  banner(`  ${g.arm.padEnd(14)} gen ${g.generation}: geneMean ${f6(g.geneMean)} · geneMax `
    + `${f6(g.geneMax)} · present ${f6(g.genePresentShare)} · >0 ${f6(g.geneAboveZeroShare)} · `
    + `drift ${g.driftMean === null ? 'n/a' : f6(g.driftMean)} · preCuedArms/match `
    + `${f6(g.preCuedArmsPerMatch)}`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`instrumentSha256   = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`hashedBodySha256   = ${artifact.hashedBodySha256 as string}`);
banner(`file byte-hash     = ${FILE_BYTE_SHA}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
