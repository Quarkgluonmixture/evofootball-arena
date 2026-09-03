/**
 * ⭐⭐ PT-C0 — THE PLAY-TEST FORENSIC CENSUS
 * (docs/world-model/PT-C0-PLAYTEST-FORENSIC-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #368 item 3. Lineage: #365 (the RA entry `?a4world=12`) →
 * the USER'S PLAY-TEST VERDICT, #368 item 1, verbatim
 * 「12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上」 →
 * #368 item 2's three observations with their evidence status and the FROZEN discriminating
 * prediction → #368 item 3, this census.
 * Instrument family: scripts/probes/rc-c0-cooperation-census.ts (the run envelope, the
 * population/composition construction, the per-tick observation with NO WRAPPER, the cluster
 * bootstrap, the sizing arithmetic, the allowlist-hashed body, the gFaces-off-disk gate — all
 * inherited), plus scripts/probes/ra-t1b-access-exam.ts (the measured-ground-pass predicates
 * and the `groundPassesPerMatch` face, reused) and scripts/probes/a4-p1c-grant-census.ts (the
 * spacing and dup-run limbs, reused with their own constants, anchored).
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It attributes nothing, scores no hypothesis
 * and arms no mechanism. The ONE pre-registered item is the DISCRIMINATING PREDICTION of
 * #368 item 2(a), PRINTED from the frozen definitions — REPORTED, NO GATE.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS the shipped
 * exports and reads Match state per tick. THERE IS NO WRAPPER AT ALL: observation is pure
 * per-tick reads after `m.step(DT)`, and `gLockstep` proves observed ≡ unobserved PER ARM.
 *
 * THE THREE QUESTION GROUPS (#368 item 3, one per sentence of the user's verdict):
 *   (i)   挤人      — the A4 battery's OWN spacing and dup-run limbs on the ATTACKING side in
 *                     open play, plus the RAW nearest-same-side-outfielder distance
 *                     distribution and the 撞车 share (min pairwise < DUP_RUN_M).
 *   (ii)  传不出去   — the carrier's POSSESSION SPELL length (bins, split by release kind), the
 *                     PASS-LOST-TO-CARRY share off the decided action's own stored `scores`,
 *                     ground passes per match and carries per match.
 *   (iii) 传到人身上 — for every measured GROUND pass, the FIRST body the ball contacts
 *                     (none / own target / own non-target / opponent), the BK shell SECTOR of
 *                     a contacted own body (the law's OWN classifier, CALLED), the REBOUND
 *                     share (「弹回」), the receiver's facing sector at his first touch on
 *                     completed passes, and the outcome partition beside.
 *
 * FOUR ARMS, PAIRED ON THE SAME SEEDS (identical population construction per seed):
 *   A  world 12 DOSED      — THE FORM THE USER PLAYS: a4MatchFlags(12) +
 *                            armA4World(m, null, 12, l3Dose, pcDose), the shipped loaders'
 *                            own doses (`loadL3Dose` / `loadPcDose`, CALLED).
 *   B  world 12 EMPTY-BOOK — the exams' form: armA4World(m, null, 12).
 *   C  world 11 DOSED      — the user's own comparison.
 *   D  THE SHIPPED DEFAULT — a match built EXACTLY as the league's worker builds a fixture:
 *                            no a4 flags, no arming (canon: worker fixtures).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { League } from '../../src/sim/League';
import { CONTROL_RADIUS, DT, AI_INTERVAL, GRAVITY } from '../../src/sim/constants';
import {
  a4MatchFlags, armA4World, raArmedVersion, corridorArmedVersion,
  loadL3Dose, loadPcDose, pcDoseGuard,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT, CORRIDOR_WORLD_VERSION,
  CORRIDOR_WORLD_WEIGHT,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { ballAccessGeometry, type BodySector } from '../../src/sim/physical';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type ActionType, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng, hashSeed } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the RC-C0 §1 form                          */
/* ========================================================================== */
const ENV_WHITELIST = ['PTC0_MODE', 'PTC0_N', 'PTC0_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('PTC0_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`PT-C0 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.PTC0_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('PT-C0 FATAL — PTC0_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.PTC0_N !== undefined ? Number(process.env.PTC0_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('PT-C0 FATAL — PTC0_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.PTC0_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`PTC0_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`PTC0_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`PTC0_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/pt-c0-playtest-forensic-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/pt-c0-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('PT-C0 FATAL — an override run may never write the canonical artifact path');
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
/** the MEDIAN of a stored histogram, at the bin's LOWER EDGE × width (re-derivable off disk) */
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
const CONST_PATH = 'src/sim/constants.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const PLAYER_PATH = 'src/sim/Player.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const LEAGUE_PATH = 'src/sim/League.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const RAT1B_PATH = 'scripts/probes/ra-t1b-access-exam.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, BRAIN_PATH, MECH_PATH, CONST_PATH, PHYS_PATH, PLAYER_PATH,
  TYPES_PATH, A4_PATH, LEAGUE_PATH, A4P1C_PATH, RAT1B_PATH]) {
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

/* ⭐⭐ (i) THE A4 BATTERY'S OWN SPACING AND DUP-RUN LIMBS — reused, with its own constants */
anchor('⭐⭐ (i) DUP_RUN_M — the A4 battery I6 duplicate-run bucket (NO new constant)',
  A4P1C_PATH, 'const DUP_RUN_M = 4; // the battery I6 duplicate-run bucket (shape exhibit)', 1, 4);
anchor('⭐⭐ (i) SAMPLE_EVERY — the A4 battery\'s own 6 Hz spacing-sample cadence',
  A4P1C_PATH, 'const SAMPLE_EVERY = 10; // the battery\'s 6 Hz spacing-sample cadence (shape exhibit)',
  1, 10);
anchor('⭐⭐ (i) the A4 limb\'s OUTFIELDER FILTER, verbatim', A4P1C_PATH,
  "const outs = mine.players.filter((q) => q.role !== 'GK' && !q.sentOff);", 1);
anchor('⭐⭐ (i) the A4 limb\'s DUP-RUN PAIR TEST, verbatim', A4P1C_PATH,
  'if (b > a && dd < DUP_RUN_M) dupRunSum += 1;', 1);
anchor('⭐⭐ (i) the A4 limb\'s NEAREST-MATE accumulation, verbatim', A4P1C_PATH,
  'if (Number.isFinite(nearest)) { spacingSum += nearest; spacingSamples += 1; }', 1);
/* ⭐⭐ (ii) THE CARRIER'S OWN STORED SCORES — the pass-lost-to-carry face's channel */
anchor('⭐⭐ (ii) the CARRIER branch\'s own stored `scores` — the TOP-4 truncation of record',
  BRAIN_PATH, '  const scores = cands.slice(0, 4);', 1);
anchor('⭐ (ii) the carrier switch\'s DEFAULT branch (`Dribble`) — a fresh action object per '
  + 'decision, which is what the decision-tick detector reads', BRAIN_PATH,
  "      p.action = { type: 'Dribble', scores };", 1);
anchor('⭐ (ii) the carrier switch\'s `HoldUp` branch', BRAIN_PATH,
  "      p.action = { type: 'HoldUp', scores };", 1);
anchor('⭐ (ii) the OFF-BALL branch\'s own stored scores (the other `slice(0, 4)` — named so '
  + 'the two are never confused)', BRAIN_PATH, '    scores: cands.slice(0, 4),', 1);
anchor('⭐ (ii) the engine\'s own `dribbles` stat — the ONE increment site the '
  + '`carriesPerMatch` face reads', MATCH_PATH, 'if (!recollect) team.stats.dribbles++;', 1);
anchor('(ii) AI_INTERVAL — the decision cadence the carrier decides on', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
/* ⭐⭐ (iii) THE BODY-CONTACT CHANNEL AND THE LAW'S OWN SECTOR CLASSIFIER */
anchor('⭐⭐ (iii) the BK contact law\'s own claim collector — the `bodyStrike` channel',
  MATCH_PATH, "        kind: 'bodyStrike',", 1);
anchor('⭐⭐ (iii) the ledger the contact law counts applied strikes in', MATCH_PATH,
  '  bkContactLedger = {', 1);
anchor('⭐⭐ (iii) the applied-strike counter the per-tick channel read uses', MATCH_PATH,
  '    strikesApplied: 0,', 1);
anchor('⭐⭐ (iii) the touch channel the first-contact read rides on — the FOUR honest '
  + '`ball.lastTouch = p;` assignment sites (the two shipped control/deflection ones and the '
  + 'contact law\'s own two)', MATCH_PATH, '    ball.lastTouch = p;', 4);
anchor('⭐⭐ (iii) the BodySector TYPE, read off its own union', PHYS_PATH,
  "export type BodySector = 'front' | 'side' | 'back';", 1);
anchor('⭐⭐ (iii) the LAW\'S OWN SECTOR CLASSIFIER — the thresholds, verbatim (CALLED, never '
  + 're-implemented)', PHYS_PATH,
  '  const sector: BodySector = facingCos >= Math.SQRT1_2\n'
  + "    ? 'front'\n"
  + '    : facingCos <= -Math.SQRT1_2\n'
  + "      ? 'back'\n"
  + "      : 'side';", 1);
anchor('⭐ (iii) the classifier\'s own entry point', PHYS_PATH,
  'export function ballAccessGeometry(', 1);
anchor('⭐ (iii) the strike writes the receiver\'s first news — `registerPass`\'s own '
  + '`pendingPass`', MECH_PATH, '  match.pendingPass = {', 1);
anchor('(iii) CONTROL_RADIUS — the reach the classifier is called at', CONST_PATH,
  'export const CONTROL_RADIUS = ', 1, CONTROL_RADIUS);
anchor('(iii) GRAVITY — the ground-launch test\'s own vz correction', CONST_PATH,
  'export const GRAVITY = 9.81;', 1, GRAVITY);
anchor('(iii) the EXTERNAL body direction the sector classifier reads', PLAYER_PATH,
  '  get bodyDir(): Readonly<V2> {', 1);
/* ⭐⭐ (ii)/(iii) RA-T1B's OWN measured-ground-pass predicates, reused */
anchor('⭐⭐ RA-T1B\'s `isMeasurableGroundPass` — the GROUND-PASS population, verbatim',
  RAT1B_PATH,
  'const isMeasurableGroundPass = (k: Klass, ground: boolean, hasTarget: boolean): boolean =>\n'
  + "  ground && hasTarget && (k === 'shortPass' || k === 'throughBall' || k === 'cutback');", 1);
anchor('⭐⭐ RA-T1B\'s `isGroundLaunch`, verbatim', RAT1B_PATH,
  'const isGroundLaunch = (grounded: boolean, vzAfterGravity: number): boolean =>\n'
  + '  grounded || !(vzAfterGravity > 0);', 1);
anchor('⭐⭐ RA-T1B\'s `groundPassesPerMatch` face — the definition REUSED', RAT1B_PATH,
  '  (r) => r.gpMeasured, (r) => r.matches);', 1);
anchor('⭐ RA-T1B\'s own klass ladder (the delivery classifier), verbatim', RAT1B_PATH,
  '  if (d.passes > 0 && klass === null) {\n'
  + "    klass = d.crosses > 0 ? 'cross'\n"
  + "      : d.cutbacks > 0 ? 'cutback'\n"
  + "        : d.throughBalls > 0 ? 'throughBall'\n"
  + "          : d.longBalls > 0 ? 'loftedPass' : 'shortPass';\n"
  + '  }', 1);
/* ⭐ THE ARMS' OWN COMPOSITION LINES, CALLED never copied */
anchor('⭐ WORLD 12\'s flag composition — world 11 CALLED, plus RA_WORLD_DOORS', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐ WORLD 12\'s arming — world 11\'s arming CALLED, plus the two match-local pins',
  A4_PATH, '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);', 1,
  [RA_WORLD_LEAD, RA_WORLD_WEIGHT]);
anchor('⭐ WORLD 11\'s arming — world 10\'s arming CALLED, plus the pinned corridor weight',
  A4_PATH, '  armDfWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setCorridorWeight(match, side, CORRIDOR_WORLD_WEIGHT);',
  1, [CORRIDOR_WORLD_VERSION, CORRIDOR_WORLD_WEIGHT]);
anchor('⭐⭐ the DOSE ARGUMENT is IGNORED for worlds 11/12 by construction: `armA4World`\'s RA '
  + 'branch RETURNS before the `tables === null` refusal, so the `tables` argument can never '
  + 'reach these arms', A4_PATH,
  '  if (isRaWorld(version)) {\n    armRaWorld(match, l3Dose, pcDose);\n    return;\n  }', 1);
anchor('⭐⭐ THE SHIPPED CONSTRUCTION — the league\'s ONE `new Match(` site (arm D\'s own '
  + 'construction path)', LEAGUE_PATH, '    return new Match({', 1);
anchor('⭐⭐ the worker-fixture canon\'s own mechanism: `matchFlags` is UNDEFINED on a '
  + '`fromJSON` league, so the spread contributes nothing', LEAGUE_PATH,
  '      ...this.matchFlags,', 1);
/* ⭐ THE ActionType VOCABULARY — extracted from its own union, never re-typed */
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
/** THE SECTOR VOCABULARY — read off `BodySector`'s own union, never re-typed */
const SECT_NEEDLE = "export type BodySector = 'front' | 'side' | 'back';";
const SECTORS = ((SRC_OF[PHYS_PATH].slice(
  SRC_OF[PHYS_PATH].indexOf(SECT_NEEDLE), SRC_OF[PHYS_PATH].indexOf(SECT_NEEDLE)
    + SECT_NEEDLE.length,
).match(/'([a-z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly BodySector[];

const DUP_RUN_M = 4;      // ANCHORED above from a4-p1c-grant-census.ts — NO new constant
const SAMPLE_EVERY = 10;  // ANCHORED above from a4-p1c-grant-census.ts — NO new constant

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && ACTIONS.length === 23 && ACTIONS.includes('ReceivePass')
  && SECTORS.length === 3 && SECTORS.join(',') === 'front,side,back'
  && RA_WORLD_VERSION === 12 && CORRIDOR_WORLD_VERSION === 11
  && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1 && CORRIDOR_WORLD_WEIGHT === 0.5
  && AI_INTERVAL === 0.15 && GRAVITY === 9.81
  && DUP_RUN_M === (ANCHORS[0].extracted as number)
  && SAMPLE_EVERY === (ANCHORS[1].extracted as number);

/* ========================================================================== */
/* §4 SEEDS — block 12,534,000–999 (#368 item 3)                                */
/* ========================================================================== */
const BLOCK_BASE = 12_534_000;
const BLOCK_TOP = 12_534_999;
/** ⭐⭐ N_FROZEN = 999 — sized by the §DEV-PREFLIGHT 12-cluster scratch smoke BEFORE the
 *  freeze commit and BEFORE any battery seed. The three pre-registered 0.05 targets are the
 *  A−C paired Δ on the 撞车 share, the pass-lost-to-carry share and the own-target-side/back
 *  share; the sizing table declares row by row what this block affords. The block affords at
 *  most 999 battery walks (12,534,000–12,534,998) plus the construction receipt at
 *  12,534,999, so N_FROZEN takes the block's own maximum and any row needing more is
 *  DECLARED UNRESOLVABLE here. No null may be cut on an unresolvable row. */
const N_FROZEN = 999;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_001_900;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 12 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

/* ========================================================================== */
/* §5 THE ARMS — the composers CALLED, never copied                             */
/* ========================================================================== */
const ARMS = ['A', 'B', 'C', 'D'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  A: 'world 12 DOSED — THE FORM THE USER PLAYS',
  B: 'world 12 EMPTY-BOOK — the exams\' form',
  C: 'world 11 DOSED — the user\'s own comparison',
  D: 'THE SHIPPED DEFAULT — the world the league plays',
};

/** ⭐⭐ THE DOSES, from the SHIPPED LOADERS THEMSELVES (`loadL3Dose` / `loadPcDose`, CALLED).
 *  Each loader imports its own artifact file and enforces its own declared-SHA identity guard
 *  before returning, so a swapped file REFUSES TO ARM. `gDoseSource` additionally hashes the
 *  FILE BYTES this process read — canon, VERBATIM: "a dose-source guard should hash the bytes
 *  it reads, not a self-declared field". */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
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
  banner(`PT-C0 FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  banner('  §P requires the dosed arm to be DECLARED unreachable in the doc before a run '
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
/**
 * ⭐⭐ RC-C0's own population construction (the same genome/squad/side/seed plumbing and the
 * same 240 s match), so arm k walks seed s with the IDENTICAL population and the four arms
 * differ ONLY in the world's own composition — that is what makes every Δ PAIRED per seed.
 */
const buildMatch = (seed: number, arm: Arm): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  if (arm === 'D') {
    /* THE SHIPPED DEFAULT: no a4 flags, no arming — the constructor's own defaults, which is
       exactly what `League.createMatch` passes on a `fromJSON` league (canon: worker
       fixtures; `gShippedConstruction` proves the construction with a fixture). */
    return new Match(base as ConstructorParameters<typeof Match>[0]);
  }
  const version = arm === 'C' ? CORRIDOR_WORLD_VERSION : RA_WORLD_VERSION;
  const m = new Match({
    ...base, ...a4MatchFlags(version),
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'B') armA4World(m, null, RA_WORLD_VERSION);
  else armA4World(m, null, version, L3_DOSE, PC_DOSE);
  return m;
};
const armedVersionOf = (m: Match, arm: Arm): number => (arm === 'C'
  ? corridorArmedVersion(m) : raArmedVersion(m));
const wantedVersionOf = (arm: Arm): number => (arm === 'C' ? CORRIDOR_WORLD_VERSION
  : arm === 'D' ? 0 : RA_WORLD_VERSION);
const contactLawOf = (m: Match): boolean =>
  (m as unknown as { bkContactLaw: boolean }).bkContactLaw === true;

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   (canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"; home:
   DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2)                                      */
/* ========================================================================== */
/** ⭐⭐ (i) THE A4 SPACING LIMB's own arithmetic, reused: the nearest same-side OUTFIELDER. */
const nearestMateOf = (xs: readonly number[], ys: readonly number[], a: number): number => {
  let nearest = Number.POSITIVE_INFINITY;
  for (let b = 0; b < xs.length; b++) {
    if (a === b) continue;
    const dd = Math.hypot(xs[a] - xs[b], ys[a] - ys[b]);
    if (dd < nearest) nearest = dd;
  }
  return nearest;
};
/** ⭐⭐ (i) THE A4 DUP-RUN LIMB's own pair test, reused (pairs counted ONCE, b > a). */
const dupRunPairsOf = (xs: readonly number[], ys: readonly number[]): number => {
  let n = 0;
  for (let a = 0; a < xs.length; a++) {
    for (let b = a + 1; b < xs.length; b++) {
      if (Math.hypot(xs[a] - xs[b], ys[a] - ys[b]) < DUP_RUN_M) n += 1;
    }
  }
  return n;
};
/** ⭐ (i) the 撞车 face's own quantity: the side's MINIMUM PAIRWISE outfield distance. */
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
/** ⭐⭐ (iii) RA-T1B's OWN delivery classifier and its ground/measured tests, reused. */
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
/** ⭐ (iii) DX-C2's own FOUR-WAY outcome ladder, reused — first terminal wins, TEMPORAL. */
const OUTCOMES = ['completed', 'intercepted', 'out', 'unresolved'] as const;
type Outcome = (typeof OUTCOMES)[number];
const OI = (o: Outcome): number => OUTCOMES.indexOf(o);
const outcomeOf = (
  completedHere: boolean, interceptedHere: boolean, wentDead: boolean,
): Outcome => (completedHere ? 'completed'
  : interceptedHere ? 'intercepted' : wentDead ? 'out' : 'unresolved');
/** ⭐⭐ (iii) THE FIRST-CONTACT CLASSES. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
/** ⭐⭐ (iii) THE REBOUND SIGN: the post-contact velocity component along the launch line. */
const alongLaunchOf = (vx: number, vy: number, ux: number, uy: number): number =>
  vx * ux + vy * uy;
const isReboundOf = (alongLaunch: number): boolean => alongLaunch < 0;
/** ⭐⭐ (ii) THE PASS-LOST-TO-CARRY predicate, off the decided action's OWN stored `scores`. */
const PASS_FAMILY = ['Pass', 'LoftedPass', 'ThroughBall', 'Cross'] as const;
const CARRY_FAMILY = ['Dribble', 'HoldUp', 'ShieldHold'] as const;
const isPassFamily = (a: string): boolean => (PASS_FAMILY as readonly string[]).includes(a);
const isCarryFamily = (a: string): boolean => (CARRY_FAMILY as readonly string[]).includes(a);
const passLostToCarryOf = (chosen: string, scored: readonly string[]): boolean =>
  isCarryFamily(chosen) && scored.some(isPassFamily);
/** ⭐ (ii) THE SPELL RELEASE KIND, in the FROZEN precedence order. */
const RELEASES = ['passed', 'shot', 'cleared', 'lost'] as const;
type Release = (typeof RELEASES)[number];
const RI = (r: Release): number => RELEASES.indexOf(r);
const releaseKindOf = (passedHere: boolean, shotHere: boolean, clearedHere: boolean): Release =>
  (passedHere ? 'passed' : shotHere ? 'shot' : clearedHere ? 'cleared' : 'lost');

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* (i) the spacing / dup-run / min-pairwise arithmetic, walked at pinned geometries */
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.nearestIsSymmetric',
  near(nearestMateOf([0, 3], [0, 4], 0), nearestMateOf([0, 3], [0, 4], 1)), true);
fx('spacing.nearestSingleton',
  !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.noneAtSixMetres', dupRunPairsOf([0, 6, 12], [0, 0, 0]), 0);
fx('dupRun.onePairInsideFour', dupRunPairsOf([0, 3, 12], [0, 0, 0]), 1);
fx('dupRun.threePairsAllInside', dupRunPairsOf([0, 1, 2], [0, 0, 0]), 3);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('minPairwise.singleton', !Number.isFinite(minPairwiseOf([1], [1])), true);
/* (iii) the delivery / ground / measured predicates, RA-T1B's own fixtures re-walked */
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
fx('outcomeOf.completed', outcomeOf(true, true, true), 'completed');
fx('outcomeOf.intercepted', outcomeOf(false, true, true), 'intercepted');
fx('outcomeOf.out', outcomeOf(false, false, true), 'out');
fx('outcomeOf.unresolved', outcomeOf(false, false, false), 'unresolved');
/* (iii) the contact classes */
fx('contact.none', contactClassOf(null, 4, null, 0), 'none');
fx('contact.ownTarget', contactClassOf(4, 4, 0, 0), 'ownTarget');
fx('contact.ownNonTarget', contactClassOf(5, 4, 0, 0), 'ownNonTarget');
fx('contact.opponent', contactClassOf(9, 4, 1, 0), 'opponent');
/* (iii) the rebound sign, on constructed contacts */
fx('rebound.alongPositiveIsNotRebound',
  isReboundOf(alongLaunchOf(6, 0, 1, 0)), false);
fx('rebound.alongNegativeIsRebound',
  isReboundOf(alongLaunchOf(-6, 0, 1, 0)), true);
fx('rebound.sidewaysIsNotRebound',
  isReboundOf(alongLaunchOf(0, 7, 1, 0)), false);
fx('rebound.obliqueBackwardIsRebound',
  isReboundOf(alongLaunchOf(-3, 5, 1, 0)), true);
fx('rebound.alongValue', near(alongLaunchOf(3, 4, 0.6, 0.8), 5), true);
/* (iii) the LAW'S OWN sector classifier, CALLED on constructed geometries */
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
/* (ii) the pass-lost-to-carry predicate and the spell release ladder */
fx('lost.dribbleOverPass', passLostToCarryOf('Dribble', ['Dribble', 'Pass']), true);
fx('lost.holdUpOverCross', passLostToCarryOf('HoldUp', ['HoldUp', 'Cross']), true);
fx('lost.shieldHoldOverThroughBall',
  passLostToCarryOf('ShieldHold', ['ShieldHold', 'ThroughBall']), true);
fx('lost.passChosenIsNotLost', passLostToCarryOf('Pass', ['Pass', 'Dribble']), false);
fx('lost.dribbleWithNoPassScored',
  passLostToCarryOf('Dribble', ['Dribble', 'ClearBall']), false);
fx('lost.shootIsNeitherFamily', passLostToCarryOf('Shoot', ['Shoot', 'Pass']), false);
fx('release.passedWins', releaseKindOf(true, true, true), 'passed');
fx('release.shotNext', releaseKindOf(false, true, true), 'shot');
fx('release.clearedNext', releaseKindOf(false, false, true), 'cleared');
fx('release.lostIsTheFloor', releaseKindOf(false, false, false), 'lost');
/* the bin helpers */
fx('binOf.first', binOf(0.4, 0.5, 61), 0);
fx('binOf.overflow', binOf(999, 0.5, 61), 60);
fx('binOf.thirtyMetresIsOverflow', binOf(30, 0.5, 61), 60);
fx('binOf.spellTicks', binOf(15, 15, 41), 1);
fx('signedBinOf.centreHoldsZero', signedBinOf(0, 1, 21), 10);
fx('signedBinOf.underflow', signedBinOf(-999, 1, 21), 0);
fx('signedBinOf.overflow', signedBinOf(999, 1, 21), 20);
fx('binMedian.unsigned', binMedian([0, 0, 5, 0], 1, false), 2);
fx('binMedian.signed', binMedian([1, 1, 8, 1, 1], 0.5, true), 0);
fx('binMedian.empty', Number.isNaN(binMedian([0, 0], 1, false)), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 gShippedConstruction — ARM D ≡ THE WORKER'S OWN CONSTRUCTION              */
/* ========================================================================== */
/**
 * ⭐⭐ canon, VERBATIM: "WORKER-SIMMED fixtures play the SHIPPED world (League.toJSON omits
 * matchFlags; true since #155, stated now, test-pinned; refines #270's E4 correction; matches
 * the perf diagnostic)" (home: ruling #283.2(iv)).
 *
 * THE FIXTURE, on out-of-band scratch: build a League, round-trip it through
 * `toJSON`/`fromJSON` exactly as the worker's `simRunner` does, take its first fixture, and
 * compare `League.createMatch(f)` — the worker's own construction — against a Match built with
 * the arm-D constructor shape at the SAME derived seed, the SAME `TeamInfo` objects, the SAME
 * duration and the SAME derby flag. The two whole-match SIGNATURES must be identical after
 * both run to completion. Three receipts beside: `matchFlags` is absent from `toJSON`,
 * undefined on the `fromJSON` league, and the BOOLEAN FLAG SET of a worker-built match equals
 * that of a bare `new Match({ seed, teamA, teamB })`.
 */
const signatureOf = (m: Match): string => sha(JSON.stringify({
  tick: m.simTick, score: m.score, phase: m.phase,
  ball: { pos: m.ball.pos, vel: m.ball.vel, z: m.ball.z, vz: m.ball.vz },
  rng: (m.rng as unknown as { s: number }).s,
  players: m.allPlayers.map((pp) => ({
    gid: pp.gid, pos: pp.pos, vel: pp.vel, heading: pp.heading, stamina: pp.stamina,
  })),
}));
const runOut = (m: Match): Match => { while (!m.finished) m.step(DT); return m; };
const boolFlagSetOf = (m: Match): string => JSON.stringify(
  Object.entries(m as unknown as Record<string, unknown>)
    .filter(([, v]) => typeof v === 'boolean').sort(),
);
const shippedConstruction = ((): Record<string, unknown> => {
  const lg = new League({ seed: SCRATCH_BASE + 95 });
  const roundTripped = JSON.parse(JSON.stringify(lg.toJSON())) as Record<string, unknown>;
  const flagsInToJson = 'matchFlags' in roundTripped;
  const lg2 = League.fromJSON(roundTripped);
  const flagsOnFromJson = (lg2 as unknown as { matchFlags?: unknown }).matchFlags;
  const f = lg2.fixtures[0];
  const derivedSeed = hashSeed(lg2.seed, lg2.generation, f.round, f.division * 4 + f.index);
  const mWorker = lg2.createMatch(f);
  const mMine = new Match({
    seed: derivedSeed,
    teamA: lg2.teamInfo(f.home), teamB: lg2.teamInfo(f.away),
    duration: lg2.matchDuration, derby: lg2.isDerby(f.home, f.away),
  } as ConstructorParameters<typeof Match>[0]);
  const bare = new Match({
    seed: SCRATCH_BASE + 96, teamA: teamInfo('A', 1), teamB: teamInfo('B', 2),
  } as ConstructorParameters<typeof Match>[0]);
  const flagSetsAgree = boolFlagSetOf(bare) === boolFlagSetOf(lg2.createMatch(lg2.fixtures[1]));
  const contactLawOffOnShipped = !contactLawOf(bare) && !contactLawOf(mWorker);
  const sigWorker = signatureOf(runOut(mWorker));
  const sigMine = signatureOf(runOut(mMine));
  return {
    fixture: { ...f }, derivedSeed,
    matchFlagsAbsentFromToJson: !flagsInToJson,
    matchFlagsUndefinedOnFromJsonLeague: flagsOnFromJson === undefined,
    booleanFlagSetsAgree: flagSetsAgree,
    contactLawOffOnShipped,
    signatureWorkerPath: sigWorker,
    signatureArmDConstructorShape: sigMine,
    signaturesEqual: sigWorker === sigMine,
    ok: !flagsInToJson && flagsOnFromJson === undefined && flagSetsAgree
      && contactLawOffOnShipped && sigWorker === sigMine,
  };
})();
const SHIPPED_CONSTRUCTION_OK = shippedConstruction.ok === true;
banner(`PT-C0 — gShippedConstruction ${SHIPPED_CONSTRUCTION_OK ? 'GREEN' : 'RED'} `
  + '(arm D ≡ the worker\'s own construction, whole-match signature)');

/* ========================================================================== */
/* §8 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed)   */
/* ========================================================================== */
const NEAR_BIN_M = 0.5;
const NEAR_BINS = 61;              // nearest-mate distance 0–30 m in 0.5 m bins, last = overflow
const MINPAIR_BIN_M = 0.5;
const MINPAIR_BINS = 61;           // the side's min pairwise distance, same grid
const SPELL_BIN_TICKS = 15;        // 0.25 sim-s
const SPELL_BINS = 41;             // spell length 0–10 sim-s, last = overflow
const ALONG_BIN_MS = 1;
const ALONG_BINS = 21;             // post-contact along-launch velocity, signed m/s
const FLIGHT_RETIRE_TICKS = 720;   // R9's own retire cap, inherited (BK-C1 §3 / DX-C2 §8)

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii)) */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots',
  'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls', 'headersWon',
  'dribbles'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  worldOk: boolean; armedVersion: number; genomeClean: boolean; contactLawArmed: boolean;
  ticks: number; matches: number; wallMs: number;
  /* (i) 挤人 — the A4 limbs on the ATTACKING side in open play */
  crowdSamples: number;            // sampled ticks with an attributable possession side
  crowdUnattributed: number;       // sampled open-play ticks with no possession side
  crowdSampleTicks: number;        // all sampled ticks (the cadence's own denominator)
  spacingSum: number; spacingSamples: number;
  dupRunSum: number;
  crashHits: number;               // sampled ticks with min pairwise < DUP_RUN_M
  nearBins: number[]; minPairBins: number[];
  /* (ii) 传不出去 — the spell, the lost pass, the volumes */
  spellSum: number[]; spellN: number[]; spellBins: number[][];   // [RELEASES+1] (last = all)
  spellOpenAtEnd: number;
  carrierDecisions: number; carrierPassScored: number; passLostToCarry: number;
  gpMeasured: number;
  /* (iii) 传到人身上 — the ground-pass flights */
  gpFlights: number;
  contactClass: number[];                       // [CONTACTS]
  contactBodyStrike: number[];                  // [CONTACTS] — the law's own channel
  ownSector: number[][];                        // [2 own classes][SECTORS]
  ownTargetSideBack: number; ownBodyContacts: number;
  reboundN: number; reboundHits: number; reboundNoLine: number;
  alongBins: number[];
  recvSector: number[]; recvSectorN: number[];  // [SECTORS] on COMPLETED passes
  outc: number[];                               // [OUTCOMES]
  contactTickSum: number; contactTickN: number;
  strikesApplied: number;
  /* context (the 240 s match clock) */
  goals: number; passes: number; passesCompleted: number; interceptions: number;
  shots: number; dribbles: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1, genomeClean: false, contactLawArmed: false,
  ticks: 0, matches: 1, wallMs: 0,
  crowdSamples: 0, crowdUnattributed: 0, crowdSampleTicks: 0,
  spacingSum: 0, spacingSamples: 0, dupRunSum: 0, crashHits: 0,
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  spellSum: zeros(RELEASES.length + 1), spellN: zeros(RELEASES.length + 1),
  spellBins: zeros2(RELEASES.length + 1, SPELL_BINS),
  spellOpenAtEnd: 0,
  carrierDecisions: 0, carrierPassScored: 0, passLostToCarry: 0,
  gpMeasured: 0,
  gpFlights: 0,
  contactClass: zeros(CONTACTS.length), contactBodyStrike: zeros(CONTACTS.length),
  ownSector: zeros2(2, SECTORS.length),
  ownTargetSideBack: 0, ownBodyContacts: 0,
  reboundN: 0, reboundHits: 0, reboundNoLine: 0,
  alongBins: zeros(ALONG_BINS),
  recvSector: zeros(SECTORS.length), recvSectorN: zeros(1),
  outc: zeros(OUTCOMES.length),
  contactTickSum: 0, contactTickN: 0, strikesApplied: 0,
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0, dribbles: 0,
});

/* ========================================================================== */
/* §10 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER     */
/* ========================================================================== */
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  ux: number; uy: number; hasLine: boolean;
  contactGid: number | null; contactTick: number | null;
  contactClass: ContactClass; contactWasStrike: boolean;
  contactSector: BodySector | null; contactAlong: number;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  recvSector: BodySector | null;
}
interface Windup {
  key: string; gid: number; targetGid: number; eX: number; eY: number;
}

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  row.armedVersion = arm === 'D' ? 0 : armedVersionOf(m, arm);
  row.contactLawArmed = contactLawOf(m);
  row.worldOk = arm === 'D'
    ? (raArmedVersion(m) === 0 && corridorArmedVersion(m) === 0 && !row.contactLawArmed)
    : row.armedVersion === wantedVersionOf(arm);
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      raAccessWeight?: number; passLeadSupport?: number; dvExposureWeight?: number;
    };
    return g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined;
  });
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    pendingPassWindup: {
      gid: number; readyTick: number; aim: { x: number; y: number }; targetGid: number;
      aimLead: { x: number; y: number } | null;
    } | null;
    bkContactLedger: { strikesApplied: number };
  };
  const players = m.allPlayers;

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let prevStrikesApplied = mm.bkContactLedger.strikesApplied;
  let prevOwnerGid: number | null = m.ball.owner?.gid ?? null;
  let spellStartTick = m.simTick;
  const prevAction = new Map<number, unknown>();
  for (const p of players) prevAction.set(p.gid, p.action);
  let wu: Windup | null = null;
  let endedWindup: Windup | null = null;
  let flight: GpFlight | null = null;

  const bookFlight = (f: GpFlight): void => {
    row.gpFlights += 1;
    const ci = CTI(f.contactClass);
    row.contactClass[ci] += 1;
    if (f.contactWasStrike) row.contactBodyStrike[ci] += 1;
    if (f.contactTick !== null) {
      row.contactTickSum += f.contactTick - f.releaseTick;
      row.contactTickN += 1;
    }
    const isOwnBody = f.contactClass === 'ownTarget' || f.contactClass === 'ownNonTarget';
    if (isOwnBody) {
      row.ownBodyContacts += 1;
      if (f.contactSector !== null) {
        const si = SECTORS.indexOf(f.contactSector);
        row.ownSector[f.contactClass === 'ownTarget' ? 0 : 1][si] += 1;
        if (f.contactClass === 'ownTarget'
          && (f.contactSector === 'side' || f.contactSector === 'back')) {
          row.ownTargetSideBack += 1;
        }
      }
      if (f.hasLine) {
        row.reboundN += 1;
        if (isReboundOf(f.contactAlong)) row.reboundHits += 1;
        row.alongBins[signedBinOf(f.contactAlong, ALONG_BIN_MS, ALONG_BINS)] += 1;
      } else row.reboundNoLine += 1;
    }
    row.outc[OI(outcomeOf(f.completedHere, f.interceptedHere, f.wentDead))] += 1;
    if (f.recvSector !== null) {
      row.recvSector[SECTORS.indexOf(f.recvSector)] += 1;
      row.recvSectorN[0] += 1;
    }
  };
  const retireFlight = (): void => { if (flight !== null) { bookFlight(flight); flight = null; } };

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
    const strikesNow = mm.bkContactLedger.strikesApplied;
    const strikeHere = strikesNow > prevStrikesApplied;
    prevStrikesApplied = strikesNow;
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    const passChangedHere = passT !== null && passT !== prevPendingPassT;
    prevPendingPassT = passT;
    const lastTouch = ball.lastTouch;
    const ownerGid = ball.owner?.gid ?? null;

    /* ---------- (ii) THE POSSESSION SPELL ---------- */
    if (ownerGid !== prevOwnerGid) {
      if (prevOwnerGid !== null) {
        const prevSide = players[prevOwnerGid].side as Side;
        const kind = releaseKindOf(
          passChangedHere && pp !== null && pp.passerGid === prevOwnerGid,
          d.shots[prevSide] > 0, d.clearances[prevSide] > 0,
        );
        const len = tick - spellStartTick;
        for (const gi of [RI(kind), RELEASES.length]) {
          row.spellSum[gi] += len;
          row.spellN[gi] += 1;
          row.spellBins[gi][binOf(len, SPELL_BIN_TICKS, SPELL_BINS)] += 1;
        }
      }
      if (ownerGid !== null) spellStartTick = tick;
      prevOwnerGid = ownerGid;
    }

    /* ---------- (ii) THE CARRIER'S OWN DECISION ---------- */
    if (ownerGid !== null) {
      const carrier = players[ownerGid];
      if (prevAction.get(ownerGid) !== carrier.action) {
        row.carrierDecisions += 1;
        const scored = (carrier.action.scores as readonly { action: string }[])
          .map((s) => s.action);
        if (scored.some(isPassFamily)) row.carrierPassScored += 1;
        if (passLostToCarryOf(carrier.action.type as string, scored)) row.passLostToCarry += 1;
      }
    }

    /* ---------- (i) 挤人 — the A4 limbs at the A4 battery's own cadence ---------- */
    if (tick % SAMPLE_EVERY === 0 && playing) {
      row.crowdSampleTicks += 1;
      const possSide: Side | null = ownerGid !== null ? players[ownerGid].side as Side
        : (flight !== null ? flight.passerSide : null);
      if (possSide === null) row.crowdUnattributed += 1;
      else {
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
          row.minPairBins[binOf(mp, MINPAIR_BIN_M, MINPAIR_BINS)] += 1;
          if (mp < DUP_RUN_M) row.crashHits += 1;
        }
      }
    }

    /* ---------- THE WIND-UP RECORD (read ONLY to name the elected point E) ---------- */
    const rec = mm.pendingPassWindup;
    const key = rec === null ? null
      : `${rec.gid}:${rec.readyTick}:${rec.targetGid}:${rec.aim.x}:${rec.aim.y}`;
    endedWindup = null;
    if (wu !== null && key !== wu.key) { endedWindup = wu; wu = null; }
    if (rec !== null && (wu === null || key !== wu.key)) {
      wu = {
        key: key as string, gid: rec.gid, targetGid: rec.targetGid,
        eX: rec.aim.x + (rec.aimLead?.x ?? 0), eY: rec.aim.y + (rec.aimLead?.y ?? 0),
      };
    }

    /* ---------- (iii) THE GROUND-PASS RELEASE ---------- */
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
      retireFlight();
      row.gpMeasured += 1;
      /* E = the pass's aim point at the strike: the wind-up record's own `aim + aimLead` when
         this strike resolved a tracked wind-up for this passer and target, else the target's
         own position at the strike tick (`performPass`'s own `mate.pos` aim base). */
      const viaWindup = endedWindup !== null && endedWindup.gid === rel.gid
        && endedWindup.targetGid === (targetGid as number);
      const eX = viaWindup ? (endedWindup as Windup).eX : players[targetGid as number].pos.x;
      const eY = viaWindup ? (endedWindup as Windup).eY : players[targetGid as number].pos.y;
      const lx = ball.pos.x - ball.vel.x * DT;
      const ly = ball.pos.y - ball.vel.y * DT;
      const dxE = eX - lx;
      const dyE = eY - ly;
      const L = Math.hypot(dxE, dyE);
      const hasLine = L > 1e-6;
      flight = {
        passerGid: rel.gid, passerSide: players[rel.gid].side as Side,
        targetGid: targetGid as number, releaseTick: tick,
        ux: hasLine ? dxE / L : 0, uy: hasLine ? dyE / L : 0, hasLine,
        contactGid: null, contactTick: null, contactClass: 'none', contactWasStrike: false,
        contactSector: null, contactAlong: Number.NaN,
        completedHere: false, interceptedHere: false, wentDead: false, recvSector: null,
      };
    }

    /* ---------- (iii) FOLLOW THE FLIGHT ---------- */
    if (flight !== null) {
      const f = flight;
      /* THE FIRST BODY: the first tick after the release at which `ball.lastTouch` is a body
         OTHER than the passer. In an arm with `bkContactLaw` armed this channel also carries
         the law's own UNINTENTIONAL `bodyStrike`; without it the ball passes THROUGH bodies
         and only the shipped control/deflection channel can move `lastTouch`. */
      if (f.contactGid === null && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactGid = lastTouch.gid;
        f.contactTick = tick;
        f.contactClass = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
        f.contactWasStrike = strikeHere;
        f.contactSector = ballAccessGeometry(lastTouch, ball, CONTROL_RADIUS).sector;
        f.contactAlong = f.hasLine
          ? alongLaunchOf(ball.vel.x, ball.vel.y, f.ux, f.uy) : Number.NaN;
      }
      if (d.passesCompleted[f.passerSide] > 0 && !f.completedHere) {
        f.completedHere = true;
        f.recvSector = ballAccessGeometry(players[f.targetGid], ball, CONTROL_RADIUS).sector;
      }
      if (d.interceptions[1 - f.passerSide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.passerGid) retireFlight();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireFlight();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireFlight();
    }

    for (const p of players) prevAction.set(p.gid, p.action);
  }
  if (observe && prevOwnerGid !== null) row.spellOpenAtEnd += 1;
  retireFlight();
  row.strikesApplied = mm.bkContactLedger.strikesApplied;
  const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
  row.goals = st[0].goals + st[1].goals;
  row.passes = st[0].passes + st[1].passes;
  row.passesCompleted = st[0].passesCompleted + st[1].passesCompleted;
  row.interceptions = st[0].interceptions + st[1].interceptions;
  row.shots = st[0].shots + st[1].shots;
  row.dribbles = st[0].dribbles + st[1].dribbles;
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §11 THE LOCKSTEP RECEIPT — NO WRAPPER; the observation reads are BYTE-INERT  */
/* ========================================================================== */
banner('PT-C0 — the lockstep receipt (observed vs unobserved, PER ARM; NO wrapper is installed)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  G-LOCKSTEP ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} arm × scratch-seed walks)`);

/* ========================================================================== */
/* §12 THE BATTERY — the four arms PAIRED on every seed                        */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`PT-C0 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
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
/** the world-construction receipt: one walk per arm on its own seed (booked = walked) */
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

/* ---------------- (i) 挤人 — CROWDING ---------------- */
defFace('crowd.nearestMateMeanMetres', 'metres',
  '⭐⭐ (i) THE RAW SPACING FACE — the mean nearest-same-side-OUTFIELDER distance of an '
  + 'ATTACKING outfielder at a sampled open-play tick (the A4 battery\'s OWN spacing limb, '
  + 'arithmetic and constants anchored; bins stored)',
  '(sampled tick, attacking outfielder) pairs', (r) => r.spacingSum, (r) => r.spacingSamples);
defFace('crowd.dupRunPairsPerSample', 'pairs per sampled tick',
  '⭐ (i) THE A4 DUP-RUN LIMB, reused: attacking outfield PAIRS closer than DUP_RUN_M = 4 m, '
  + 'per sampled tick (each pair counted once)',
  'sampled ticks with an attributable possession side', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.crashShare', 'share',
  '⭐⭐ (i) THE 撞车 FACE — the share of sampled open-play ticks on which the ATTACKING side\'s '
  + 'MINIMUM PAIRWISE outfield distance is BELOW DUP_RUN_M = 4 m',
  'sampled ticks with an attributable possession side', (r) => r.crashHits, (r) => r.crowdSamples);
defFace('crowd.unattributedSampleShare', 'share',
  '(i) sampled open-play ticks with NO attributable possession side (no owner and no live '
  + 'ground-pass flight) — DECLARED and excluded, never folded',
  'all sampled open-play ticks', (r) => r.crowdUnattributed, (r) => r.crowdSampleTicks);
defFace('crowd.samplesPerMatch', 'samples per match (240 s match clock)',
  '(i) attributable spacing samples per match — the (i) denominator on the match clock',
  'matches walked', (r) => r.crowdSamples, (r) => r.matches);

/* ---------------- (ii) 传不出去 — THE BALL THAT CANNOT BE PASSED OUT ---------------- */
for (let gi = 0; gi <= RELEASES.length; gi++) {
  const g = gi === RELEASES.length ? 'all' : RELEASES[gi];
  defFace(`spell.meanSimSeconds.${g}`, 'sim-seconds',
    `⭐⭐ (ii) THE CARRIER'S POSSESSION SPELL — from the tick a body becomes \`ball.owner\` to `
    + `the tick he stops being it — ${g} class (bins stored; 1 sim-s = 22.5 display-s)`,
    `closed spells of the ${g} class`, (r) => r.spellSum[gi] * DT, (r) => r.spellN[gi]);
  defFace(`spell.perMatch.${g}`, 'spells per match (240 s match clock)',
    `(ii) the volume of ${g} spells per match`, 'matches walked',
    (r) => r.spellN[gi], (r) => r.matches);
  defFace(`spell.shareOfSpells.${g}`, 'share',
    `(ii) the ${g} share of all closed spells`, 'closed spells',
    (r) => r.spellN[gi], (r) => r.spellN[RELEASES.length]);
}
defFace('spell.openAtFullTimePerMatch', 'spells per match (240 s match clock)',
  '(ii) spells still OPEN at full time — COUNTED, and they enter no spell face',
  'matches walked', (r) => r.spellOpenAtEnd, (r) => r.matches);
defFace('lost.passLostToCarryShare', 'share',
  '⭐⭐ (ii) THE PASS-LOST-TO-CARRY SHARE — carrier decisions at which a PASS-FAMILY candidate '
  + '(`Pass` | `LoftedPass` | `ThroughBall` | `Cross`) appears in the decided action\'s OWN '
  + 'stored `scores` yet the chosen action is `Dribble` | `HoldUp` | `ShieldHold`. ⚠ `scores` '
  + 'is the TOP-4 (`cands.slice(0, 4)`, anchored) — a pass candidate ranked 5th or lower is '
  + 'INVISIBLE, so this face is a LOWER BOUND',
  'carrier decisions (a decision tick while owning the ball)',
  (r) => r.passLostToCarry, (r) => r.carrierDecisions);
defFace('lost.passScoredShare', 'share',
  '(ii) carrier decisions with ANY pass-family candidate in the stored top-4 — the '
  + 'denominator the lost share sits inside', 'carrier decisions',
  (r) => r.carrierPassScored, (r) => r.carrierDecisions);
defFace('lost.passLostGivenScoredShare', 'share',
  '⭐ (ii) the same loss CONDITIONED on a pass candidate being visible at all',
  'carrier decisions with a pass-family candidate in the stored top-4',
  (r) => r.passLostToCarry, (r) => r.carrierPassScored);
defFace('lost.carrierDecisionsPerMatch', 'decisions per match (240 s match clock)',
  '(ii) carrier decisions per match — the (ii) denominator on the match clock',
  'matches walked', (r) => r.carrierDecisions, (r) => r.matches);
defFace('volume.groundPassesPerMatch', 'passes per match (240 s match clock)',
  '⭐⭐ (ii) GROUND PASSES PER MATCH — RA-T1B\'s own reported face, its predicates REUSED and '
  + 'anchored (`isMeasurableGroundPass`: shortPass | throughBall | cutback, ground launch, '
  + 'with a pending-pass target)', 'matches walked', (r) => r.gpMeasured, (r) => r.matches);
defFace('volume.carriesPerMatch', 'carries per match (240 s match clock)',
  '⭐⭐ (ii) CARRIES PER MATCH — ⚠ DECLARED DEVIATION: RA-T1B publishes NO `carriesPerMatch` '
  + 'face (#364 item 2\'s "more carries" is PROSE), so this census defines it as the ENGINE\'S '
  + 'OWN `dribbles` team stat, anchored at its single increment site',
  'matches walked', (r) => r.dribbles, (r) => r.matches);

/* ---------------- (iii) 传到人身上 — THE BALL THAT HITS A BODY ---------------- */
for (const c of CONTACTS) {
  const ci = CTI(c);
  defFace(`contact.firstBody.${c}`, 'share',
    `⭐⭐ (iii) THE FIRST BODY the ball contacts after a measured GROUND pass — \`${c}\``,
    'measured ground-pass flights', (r) => r.contactClass[ci], (r) => r.gpFlights);
  defFace(`contact.firstBodyBodyStrikeShare.${c}`, 'share',
    `(iii) of \`${c}\` first contacts, the share that resolved through the CONTACT LAW's own `
    + '`bodyStrike` channel (structurally EMPTY where the law is not armed — declared per arm, '
    + 'never zero-imputed)', `\`${c}\` first contacts`,
    (r) => r.contactBodyStrike[ci], (r) => r.contactClass[ci]);
}
for (let oi = 0; oi < 2; oi++) {
  const own = oi === 0 ? 'ownTarget' : 'ownNonTarget';
  for (const s of SECTORS) {
    const si = SECTORS.indexOf(s);
    defFace(`contact.sector.${own}.${s}`, 'share',
      `⭐ (iii) the BK shell SECTOR of the contacted OWN body — \`${own}\` × \`${s}\` (the `
      + 'law\'s OWN classifier `ballAccessGeometry(...).sector`, CALLED never re-implemented)',
      `\`${own}\` first contacts with a sector read`,
      (r) => r.ownSector[oi][si], (r) => sum(r.ownSector[oi]));
  }
}
defFace('contact.ownTargetSideBackShare', 'share',
  '⭐⭐ (iii) THE PREDICTION\'S H2 TERM — P(first contact = own TARGET with sector ∈ '
  + '{side, back}) over ALL measured ground passes',
  'measured ground-pass flights', (r) => r.ownTargetSideBack, (r) => r.gpFlights);
defFace('contact.opponentFirstContactShare', 'share',
  '⭐⭐ (iii) THE PREDICTION\'S H1 TERM (i) — P(first contact = an OPPONENT body)',
  'measured ground-pass flights', (r) => r.contactClass[CTI('opponent')], (r) => r.gpFlights);
defFace('contact.ownNonTargetFirstContactShare', 'share',
  '⭐⭐ (iii) THE PREDICTION\'S H1 TERM (ii) — P(first contact = an own NON-TARGET body)',
  'measured ground-pass flights', (r) => r.contactClass[CTI('ownNonTarget')], (r) => r.gpFlights);
defFace('contact.h1SumShare', 'share',
  '⭐⭐ (iii) P(opponent) + P(own non-target) — H1\'s own quantity in the frozen read',
  'measured ground-pass flights',
  (r) => r.contactClass[CTI('opponent')] + r.contactClass[CTI('ownNonTarget')],
  (r) => r.gpFlights);
defFace('contact.reboundShare', 'share',
  '⭐⭐ (iii) THE REBOUND SHARE (「弹回」) — an OWN-body first contact after which the ball\'s '
  + 'velocity component along the launch line unit(E − launch) is NEGATIVE',
  'own-body first contacts with a defined launch line',
  (r) => r.reboundHits, (r) => r.reboundN);
defFace('contact.reboundShareOfAllGroundPasses', 'share',
  '(iii) the same rebound count over ALL measured ground passes (published beside so the two '
  + 'denominators can never be confused)', 'measured ground-pass flights',
  (r) => r.reboundHits, (r) => r.gpFlights);
defFace('contact.ownBodyContactShare', 'share',
  '⭐ (iii) P(the first body is one of OUR OWN) — the rebound face\'s own denominator as a '
  + 'share', 'measured ground-pass flights', (r) => r.ownBodyContacts, (r) => r.gpFlights);
defFace('contact.noLaunchLineShare', 'share',
  '(iii) own-body first contacts with NO defined launch line (|E − launch| ≤ 1e-6) — counted '
  + 'and excluded from the rebound face', 'own-body first contacts',
  (r) => r.reboundNoLine, (r) => r.ownBodyContacts);
defFace('contact.ticksToFirstBodyMean', 'ticks',
  '(iii) ticks from the strike to the first body contact', 'flights with a first body contact',
  (r) => r.contactTickSum, (r) => r.contactTickN);
for (const s of SECTORS) {
  const si = SECTORS.indexOf(s);
  defFace(`contact.receiverFacingAtTouch.${s}`, 'share',
    `⭐ (iii) on COMPLETED ground passes, the intended receiver's own facing SECTOR at his `
    + `first touch — \`${s}\` (the same classifier)`,
    'completed ground-pass flights with a sector read',
    (r) => r.recvSector[si], (r) => r.recvSectorN[0]);
}
for (const o of OUTCOMES) {
  defFace(`outcome.${o}`, 'share',
    `(iii) the \`${o}\` share of measured ground-pass flights (DX-C2's own four-way ladder, `
    + 'reused; the ladder is TEMPORAL, not causal)', 'measured ground-pass flights',
    (r) => r.outc[OI(o)], (r) => r.gpFlights);
}
defFace('contact.appliedBodyStrikesPerMatch', 'strikes per match (240 s match clock)',
  '(iii) the CONTACT LAW\'s own ledger — applied body strikes per match, whole match (an '
  + 'ARMING RECEIPT, ⛔ never a football effect size)', 'matches walked',
  (r) => r.strikesApplied, (r) => r.matches);

/* ---------------- §R5 CONTEXT ---------------- */
defFace('context.goalsPerMatch', 'goals per match (240 s match clock)', 'context — goals',
  'matches walked', (r) => r.goals, (r) => r.matches);
defFace('context.enginePassesPerMatch', 'passes per match (240 s match clock)',
  'context — the engine\'s own whole-match pass count (⚠ ALL deliveries, not the measured '
  + 'ground-pass population)', 'matches walked', (r) => r.passes, (r) => r.matches);
defFace('context.passCompletion', 'share',
  '⭐ context — the engine\'s own whole-match pass completion (⚠ ALL deliveries)',
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
  if (f === undefined) { banner(`PT-C0 FATAL — unknown face ${k}/${arm}`); process.exit(3); }
  return f!;
};

/** ⭐⭐ THE PAIRED Δ — the arms share seeds, so the bootstrap resamples SEEDS and both arms
 *  move together inside every draw: the interval is a PAIRED one by construction. */
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
/** THE THREE FROZEN PAIRS (#368 item 3): A−C (12 vs 11), A−D (12 vs shipped), A−B (dosed vs
 *  empty — the test of #365's first-look disclosure). REPORTED on every face; ⛔ nothing scored. */
const PAIRS: [Arm, Arm][] = [['A', 'C'], ['A', 'D'], ['A', 'B']];
const deltas: DeltaRow[] = [];
for (const key of FACE_KEYS) for (const [l, r] of PAIRS) deltas.push(pairedDelta(key, l, r));
const delta = (faceKey: string, armL: Arm, armR: Arm): DeltaRow => {
  const d = deltas.find((x) => x.face === faceKey && x.armL === armL && x.armR === armR);
  if (d === undefined) { banner(`PT-C0 FATAL — unknown Δ ${faceKey} ${armL}-${armR}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 THE DISCRIMINATING PREDICTION (#368 item 2(a)) — FROZEN, REPORTED, NO GATE */
/* ========================================================================== */
/**
 * ⭐ #368 item 2(a), verbatim: "on world 12 ground passes, if H2 dominates the FIRST body the
 * ball touches is the OWN TARGET with a side/back sector more often than an OPPONENT; if H1
 * dominates, opponents and own NON-target bodies dominate the first contact. REPORTED by
 * PT-C0, no gate."
 *
 * THE FROZEN PRINTED FORM. 'RESOLVEDLY' is defined as CI SEPARATION and nothing else: a
 * paired-free 95 % cluster-bootstrap interval on the contrast that lies ENTIRELY ABOVE ZERO.
 * There is NO threshold beyond the interval.
 *   H2 TEST: Δ_H2 = P(ownTarget ∧ sector ∈ {side, back}) − P(opponent), CI entirely > 0.
 *   H1 TEST: Δ_H1 = [P(opponent) + P(ownNonTarget)] − P(ownTarget ∧ side/back), CI entirely > 0.
 * FOUR-WAY VERDICT, frozen so no precedence is invented after sight:
 *   exactly H2 ⇒ "the numbers favour H2"; exactly H1 ⇒ "the numbers favour H1";
 *   BOTH ⇒ "MIXED — both conjuncts separate at once, so the frozen form favours NEITHER";
 *   NEITHER ⇒ "neither resolvedly".
 */
const withinArmContrast = (
  keyL: string, keyR: string, arm: Arm,
): { delta: number; ciLo: number; ciHi: number; halfWidth: number; leftValue: number;
  rightValue: number; absDeltaOverHalfWidth: number } => {
  const fl = FACES[keyL];
  const fr = FACES[keyR];
  const rows = armRows(arm);
  const nl = rows.map((r) => fl.num(r));
  const dl = rows.map((r) => fl.dn(r));
  const nr = rows.map((r) => fr.num(r));
  const dr = rows.map((r) => fr.dn(r));
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
    delta: pl - pr, ciLo: lo, ciHi: hi, halfWidth: hw, leftValue: pl, rightValue: pr,
    absDeltaOverHalfWidth: ratio(Math.abs(pl - pr), hw),
  };
};
const predictionFor = (arm: Arm): Record<string, unknown> => {
  const h2 = withinArmContrast(
    'contact.ownTargetSideBackShare', 'contact.opponentFirstContactShare', arm,
  );
  const h1 = withinArmContrast('contact.h1SumShare', 'contact.ownTargetSideBackShare', arm);
  const h2Res = h2.ciLo > 0;
  const h1Res = h1.ciLo > 0;
  const reading = h2Res && h1Res
    ? 'MIXED — both conjuncts separate above zero at once, so the FROZEN form favours NEITHER '
      + 'hypothesis resolvedly.'
    : h2Res
      ? 'THE NUMBERS FAVOUR H2 ("the receiver is not READY"): the first body the ball touches '
        + 'is the OWN TARGET with a side/back sector RESOLVEDLY more often than it is an '
        + 'OPPONENT.'
      : h1Res
        ? 'THE NUMBERS FAVOUR H1 ("priced ≠ struck"): opponents and own NON-target bodies '
          + 'RESOLVEDLY dominate the first contact.'
        : 'NEITHER RESOLVEDLY — no contrast\'s interval lies entirely above zero at this power, '
          + 'so the census prints no favoured hypothesis and no null may be cut either.';
  return {
    arm, armLabel: ARM_LABEL[arm],
    pOwnTargetSideBack: face('contact.ownTargetSideBackShare', arm),
    pOpponent: face('contact.opponentFirstContactShare', arm),
    pOwnNonTarget: face('contact.ownNonTargetFirstContactShare', arm),
    h2Contrast: h2, h1Contrast: h1,
    h2Resolved: h2Res, h1Resolved: h1Res,
    reading,
  };
};
const PREDICTION = { A: predictionFor('A'), B: predictionFor('B') };

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the RC-C0 §15 / DX-C2 §15 house form                 */
/* ========================================================================== */
/**
 * ⭐ THE HOUSE FORM:
 *   1  se(n)      = half-width(n) / z.975
 *   2  se(needed) = |target| / (z.975 + z.80)
 *   3  N          = ceil( n · (se(n) / se(needed))² )
 *   4  MDE(N)     = half-width(n) · sqrt(n/N) · (z.975 + z.80) / z.975
 * ⚠ IT ASSUMES the battery's per-seed cluster variance is the smoke's — 12 scratch clusters is
 * a NOISY variance estimate. Said here, BEFORE the battery. The smoke is DISCLOSED IN FULL at
 * the doc's §DEV-PREFLIGHT. Target 0.05 on the three pre-registered quantities of #368 item 3:
 * the A−C paired Δ on the 撞车 share, on the pass-lost-to-carry share and on the
 * own-target-side/back share.
 */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** the SCRATCH SMOKE's own realised half-widths (seeds 900,001,900–911; §DEV-PREFLIGHT), read
 *  out of the smoke artifact's own `deltas[].halfWidth` fields — never re-typed from the
 *  console's rounded print. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'crowd.crashShare@A-C', group: '(i) 挤人 — THE 撞车 SHARE, paired A−C',
    hwSmoke: 0.04584622674874325, target: 0.05 },
  { face: 'lost.passLostToCarryShare@A-C',
    group: '(ii) 传不出去 — THE PASS-LOST-TO-CARRY SHARE, paired A−C',
    hwSmoke: 0.0422021157351426, target: 0.05 },
  { face: 'contact.ownTargetSideBackShare@A-C',
    group: '(iii) 传到人身上 — THE OWN-TARGET SIDE/BACK SHARE, paired A−C',
    hwSmoke: 0.019852935605322836, target: 0.05 },
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
type Pooled = {
  nearBins: number[]; minPairBins: number[]; spellBins: number[][];
  contactClass: number[]; contactBodyStrike: number[]; ownSector: number[][];
  alongBins: number[]; recvSector: number[]; outc: number[];
};
const emptyPooled = (): Pooled => ({
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  spellBins: zeros2(RELEASES.length + 1, SPELL_BINS),
  contactClass: zeros(CONTACTS.length), contactBodyStrike: zeros(CONTACTS.length),
  ownSector: zeros2(2, SECTORS.length), alongBins: zeros(ALONG_BINS),
  recvSector: zeros(SECTORS.length), outc: zeros(OUTCOMES.length),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto(p.nearBins, r.nearBins); addInto(p.minPairBins, r.minPairBins);
    addInto2(p.spellBins, r.spellBins);
    addInto(p.contactClass, r.contactClass); addInto(p.contactBodyStrike, r.contactBodyStrike);
    addInto2(p.ownSector, r.ownSector); addInto(p.alongBins, r.alongBins);
    addInto(p.recvSector, r.recvSector); addInto(p.outc, r.outc);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  nearestMateMetres: binMedian(p.nearBins, NEAR_BIN_M, false),
  minPairwiseMetres: binMedian(p.minPairBins, MINPAIR_BIN_M, false),
  spellSimSeconds: Object.fromEntries([...RELEASES, 'all'].map((g, gi) => [
    g, binMedian(p.spellBins[gi], SPELL_BIN_TICKS, false) * DT,
  ])),
  alongLaunchVelocityMs: binMedian(p.alongBins, ALONG_BIN_MS, true),
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

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: ARMS.every((arm) => cells.every((c) => c.rows[arm].worldOk)
      && receiptRows[arm].worldOk),
    note: '⭐⭐ PER ARM, on EVERY walked match and the construction receipt: A/B '
      + '`raArmedVersion(m) === 12`, C `corridorArmedVersion(m) === 11`, D STRUCTURAL — no a4 '
      + 'flag set (`raArmedVersion === 0` AND `corridorArmedVersion === 0`) and the contact '
      + 'law OFF. Asserted off the REAL constructed match, so every arm is the world\'s own '
      + 'composition, CALLED never copied',
  },
  gDoseSource: {
    ok: DOSED_ARM_REACHABLE
      && L3_DOSE_BYTES_SHA.length === 64 && PC_DOSE_BYTES_SHA.length === 64,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arms (A and C) take their doses from the SHIPPED '
      + 'LOADERS THEMSELVES (`loadL3Dose` / `loadPcDose`, CALLED), each of which enforces its '
      + 'own declared-SHA identity guard on the artifact it imports before returning; this '
      + 'gate additionally publishes the sha256 of the FILE BYTES this process read from the '
      + `two paths the loaders name (${L3_DOSE_FILE}, ${PC_DOSE_FILE}) and asserts both doses `
      + 'are NON-EMPTY. ⚠ `pcDoseGuard.bytesChecked` is '
      + `${pcDoseGuard.bytesChecked} under bare node (the loader says so itself: the \`?raw\` `
      + 'query is stripped and the module loader hands back a parsed object), which is exactly '
      + 'why this gate hashes the bytes independently',
  },
  gShippedConstruction: {
    ok: SHIPPED_CONSTRUCTION_OK,
    note: '⭐⭐ THE FIXTURE: a League round-tripped through `toJSON`/`fromJSON` exactly as the '
      + 'worker\'s `simRunner` does, then `League.createMatch(f)` against a Match built with '
      + 'ARM D\'s constructor shape at the SAME derived seed / TeamInfo / duration / derby — '
      + 'the two WHOLE-MATCH SIGNATURES are identical after both run to completion. Three '
      + 'receipts beside: `matchFlags` absent from `toJSON`, undefined on the `fromJSON` '
      + 'league, and the BOOLEAN FLAG SET of a worker-built match equals a bare '
      + '`new Match({ seed, teamA, teamB })`. Canon, VERBATIM: "WORKER-SIMMED fixtures play '
      + 'the SHIPPED world (League.toJSON omits matchFlags; true since #155, stated now, '
      + 'test-pinned; refines #270\'s E4 correction; matches the perf diagnostic)"',
  },
  gGenomeClean: {
    ok: ARMS.every((arm) => cells.every((c) => c.rows[arm].genomeClean)
      && receiptRows[arm].genomeClean),
    note: 'the FRANCHISE genome (`info.genome`) carries NEITHER world-12 pin nor the corridor '
      + 'weight on ANY arm — the match-local arming idiom (canon: dose placement, #270.2 / '
      + '#334 item 1)',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `⭐⭐ anchored extraction with line receipts, ${ANCHORS.length} sites: the A4 `
      + 'battery\'s OWN `DUP_RUN_M` (4) · `SAMPLE_EVERY` (10) · outfielder filter · dup-run '
      + 'pair test · nearest-mate accumulation (NO new constant) · the CARRIER branch\'s own '
      + '`cands.slice(0, 4)` stored scores AND the off-ball branch\'s (named so the two can '
      + 'never be confused) · the engine\'s single `dribbles` increment site · `AI_INTERVAL` · '
      + 'the `bodyStrike` channel, the `bkContactLedger` and its `strikesApplied` counter · '
      + 'the three `ball.lastTouch = p` assignment sites · the `BodySector` union AND the '
      + 'LAW\'S OWN CLASSIFIER THRESHOLDS verbatim · `ballAccessGeometry`\'s entry point · '
      + '`registerPass`\'s `pendingPass` · `CONTROL_RADIUS` · `GRAVITY` · `bodyDir` · '
      + 'RA-T1B\'s `isMeasurableGroundPass` / `isGroundLaunch` / klass ladder / '
      + '`groundPassesPerMatch` face · worlds 12 and 11\'s own flag and arming lines · the '
      + '`armA4World` RA branch that proves the `tables` argument can never reach these arms · '
      + 'the league\'s ONE `new Match(` site and the `...this.matchFlags` spread · the '
      + `ActionType vocabulary read off its own union (${ACTIONS.length} labels, line `
      + `${ACT_BLOCK_LINE})`,
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures — the A4 spacing / dup-run / min-pairwise arithmetic, RA-T1B\'s delivery and '
      + 'ground-launch predicates, the outcome ladder, the first-contact classes, the REBOUND '
      + 'SIGN on constructed contacts, the LAW\'S OWN SECTOR CLASSIFIER **CALLED** on six '
      + 'constructed geometries (including both 45° boundaries), the pass-lost-to-carry '
      + 'predicate, the spell release ladder and every bin helper are PURE functions called by '
      + 'BOTH the walk and this table',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.gpFlights) > 0
      && tot(arm, (r) => r.crowdSamples) > 0
      && tot(arm, (r) => r.spellN[RELEASES.length]) > 0
      && tot(arm, (r) => r.carrierDecisions) > 0
      && tot(arm, (r) => r.ownBodyContacts) > 0)
      /* the contact law's own channel lives EXACTLY where the law is armed, and nowhere else */
      && ARMS.every((arm) => {
        const armed = cells.every((c) => c.rows[arm].contactLawArmed);
        const strikes = tot(arm, (r) => r.strikesApplied);
        return armed ? strikes > 0 : strikes === 0;
      })
      && cells.every((c) => c.rows.D.contactLawArmed === false)
      && (['A', 'B', 'C'] as const).every((arm) => cells.every((c) => c.rows[arm].contactLawArmed)),
    note: '⛔ no face is computed on an empty cell: EVERY arm has measured ground-pass flights '
      + `(A ${tot('A', (r) => r.gpFlights)}, B ${tot('B', (r) => r.gpFlights)}, C `
      + `${tot('C', (r) => r.gpFlights)}, D ${tot('D', (r) => r.gpFlights)}), attributable `
      + 'spacing samples, closed spells, carrier decisions and own-body first contacts. ⭐⭐ AND '
      + 'THE CONTACT CLASSES LIVE WHERE THE LAW IS ARMED AND NOWHERE ELSE: `bkContactLaw` is '
      + 'ARMED on A/B/C (applied strikes '
      + `${tot('A', (r) => r.strikesApplied)} / ${tot('B', (r) => r.strikesApplied)} / `
      + `${tot('C', (r) => r.strikesApplied)}) and OFF on D (applied strikes `
      + `${tot('D', (r) => r.strikesApplied)} — EXACTLY ZERO, structural). On arm D "contact" `
      + 'therefore means a DELIBERATE or DEFLECTED touch on the shipped channel only — the '
      + 'unintentional `bodyStrike` sub-class is STRUCTURALLY EMPTY there and is DECLARED, '
      + 'never zero-imputed. ⚠ this gate reads LIVENESS, never a direction and never a magnitude',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + 'Match state after `m.step(DT)`, and every classifier it calls '
      + '(`ballAccessGeometry`) is a PURE geometry query that awards nothing. Proven anyway — '
      + 'the same scratch seed walked OBSERVED and UNOBSERVED yields a BYTE-IDENTICAL '
      + `whole-match signature on all ${lockstepRows.length} arm × out-of-band-scratch-seed `
      + 'walks',
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
    note: 'BOOKED = WALKED, derived from the CELLS\' OWN distinct seeds: every battery seed and '
      + 'the construction receipt lie inside block 12,534,000–999, each seed is walked ONCE '
      + `PER ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), and every lockstep seed `
      + 'is out-of-band scratch (canon, VERBATIM: "verifier scratch walks use the stage\'s own '
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
        N_FROZEN} seeds × ${ARMS.length} arms`,
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT                                                            */
/* ========================================================================== */
const perSeedCells = cells.map((c) => ({
  seed: c.seed,
  ...Object.fromEntries(ARMS.map((arm) => [arm, c.rows[arm]])),
}));

/** ⭐⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a field
 *  not in the schema never enters the body; forbidden-name lists are retired" (home:
 *  PC-T0-LATENCY-SEAM.md §COMMANDER CORRECTIONS item 1). The body hash is computed LAST (the
 *  #356 hash order), and the FILE BYTE-HASH is published in the doc's §R. */
const BODY_SCHEMA = [
  'stage', 'gates', 'faces', 'deltas', 'prediction', 'medians', 'bins', 'definitions',
  'arms', 'contactClasses', 'sectors', 'releases', 'outcomes', 'actionVocabulary',
  'doseSource', 'shippedConstruction', 'seeds', 'stats', 'anchoredSites', 'fixtures',
  'lockstep', 'perf', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'PT-C0',
    title: 'THE PLAY-TEST FORENSIC CENSUS — the user\'s three sentences turned into '
      + 'instruments: 挤人 (crowding) · 传不出去 (the ball that cannot be passed out) · '
      + '传到人身上 (the ball that hits a body), on four arms paired on the same seeds',
    doc: 'docs/world-model/PT-C0-PLAYTEST-FORENSIC-CENSUS.md',
    lineage: '#365 (the RA entry ?a4world=12) → #368 item 1 (the USER\'S VERDICT, verbatim) → '
      + '#368 item 2 (the three observations and the FROZEN discriminating prediction) → '
      + '#368 item 3 (this census)',
    censusFormOfRecord: 'docs/world-model/RC-C0-COOPERATION-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #368 item 3',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    kind: 'CENSUS — it publishes MEASUREMENTS. It ATTRIBUTES NOTHING, scores no hypothesis and '
      + 'arms no mechanism. The ONE pre-registered item is #368 item 2(a)\'s DISCRIMINATING '
      + 'PREDICTION, PRINTED from the frozen definitions — REPORTED, NO GATE. The commander '
      + 'rules.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS the shipped exports '
      + 'and reads Match state per tick. THERE IS NO WRAPPER AT ALL — `gLockstep` proves '
      + 'observed ≡ unobserved byte for byte, PER ARM, on out-of-band scratch seeds.',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/pt-c0-playtest-forensic-census.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/pt-c0-playtest-forensic-census.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.keys(SRC_OF).map((p) => [p, sha(SRC_OF[p])])),
  },
  arms: ARMS.map((arm) => ({
    arm, label: ARM_LABEL[arm],
    composition: arm === 'A'
      ? 'a4MatchFlags(12) as construction flags + armA4World(m, null, 12, l3Dose, pcDose) — '
        + 'THE FORM THE USER PLAYS. ⭐ WHY `null` FOR THE TABLES: `GameApp.armA4` never loads '
        + 'the A4 census tables for world 12 at all (world 12 is in its `pcStack` predicate, '
        + 'which SKIPS the `loadA4Tables` branch), and `armA4World`\'s RA branch RETURNS before '
        + 'the `tables === null` refusal — so the tables argument is IGNORED by construction '
        + 'for worlds 11/12 (anchored). The user\'s form therefore differs from the exams\' '
        + 'form ONLY in the two DOSES.'
      : arm === 'B'
        ? 'a4MatchFlags(12) + armA4World(m, null, 12) — the EMPTY-BOOK form both RA exams and '
          + 'RC-C0 walked. `null` L3 dose ⇒ the defence books stay as the season left them '
          + '(season-one state); `null` PC dose ⇒ the recognition books are born absent, '
          + 'everyone a novice.'
        : arm === 'C'
          ? 'a4MatchFlags(11) + armA4World(m, null, 11, l3Dose, pcDose) — world 11 in the '
            + 'user\'s own form (the same two doses; the tables argument is ignored here too).'
          : 'new Match({ seed, teamA, teamB }) — no a4 flags, no arming: EXACTLY the '
            + 'construction `League.createMatch` performs on a `fromJSON` league, which is what '
            + 'the worker simulates. `gShippedConstruction` proves it with a whole-match '
            + 'signature fixture.',
    gate: arm === 'A' || arm === 'B' ? 'raArmedVersion(m) === 12'
      : arm === 'C' ? 'corridorArmedVersion(m) === 11'
        : 'STRUCTURAL: raArmedVersion === 0 AND corridorArmedVersion === 0 AND bkContactLaw off',
    contactLawArmed: cells.every((c) => c.rows[arm].contactLawArmed),
    contactMeaning: cells.every((c) => c.rows[arm].contactLawArmed)
      ? 'the BK CONTACT LAW IS ARMED (world 12 ⊃ 11 ⊃ 10 ⊃ 9): a body the shipped claim filter '
        + 'drops can still be STRUCK by the ball — `bodyStrike` — so "contact" here includes '
        + 'the UNINTENTIONAL kind, and the per-class `bodyStrike` share says how much of it is.'
      : 'the BK CONTACT LAW IS NOT ARMED: the ball passes THROUGH a body the shipped filter '
        + 'drops, and `ball.lastTouch` can only move on the shipped control/deflection channel. '
        + '"Contact" here therefore means a DELIBERATE or DEFLECTED touch, and the '
        + 'unintentional `bodyStrike` sub-class is STRUCTURALLY EMPTY — declared, never '
        + 'zero-imputed.',
  })),
  definitions: {
    crowding: {
      openPlay: "`m.phase === 'playing'`.",
      possessionSide: 'the ATTACKING side = `ball.owner.side` when the ball is owned; else the '
        + 'passer\'s side of a LIVE tracked measured-ground-pass flight (the ball in a pass '
        + 'flight); else the sampled tick has NO possession side and is EXCLUDED — counted in '
        + '`crowd.unattributedSampleShare`, never folded.',
      cadence: 'every `SAMPLE_EVERY` = 10 ticks (`simTick % 10 === 0`) — the A4 battery\'s OWN '
        + 'spacing-sample cadence, anchored. NO new constant.',
      population: "the A4 limb's own filter: `role !== 'GK' && !sentOff` on the attacking side.",
      spacingLimb: 'for each attacking outfielder a, `nearest_a = min_{b≠a} hypot(pos_a − '
        + 'pos_b)` over the same-side OUTFIELDERS — the A4 battery\'s own arithmetic, reused. '
        + 'Bins 0.5 m × 61 (0–30 m, last = overflow).',
      dupRunLimb: 'attacking outfield PAIRS (b > a, each counted once) with `hypot < DUP_RUN_M` '
        + '= 4 m — the A4 battery\'s own limb and its own constant, anchored.',
      crashFace: 'the 撞车 face = the share of sampled ticks whose attacking side\'s MINIMUM '
        + 'PAIRWISE outfield distance is `< DUP_RUN_M`.',
      designationNote: '⭐ THE A4 LIMBS DEPEND ON NO DESIGNATION — they are purely geometric '
        + '(positions, roles, sent-off), so nothing here needed declaring away and the raw '
        + 'faces and the limbs are BOTH primary.',
    },
    cannotPassOut: {
      spell: 'THE CARRIER\'S POSSESSION SPELL = from the tick `ball.owner.gid` becomes g (the '
        + 'previous tick\'s owner gid was not g) to the first tick at which the owner gid is '
        + 'no longer g. Length in ticks × DT = sim-seconds. Bins 0.25 sim-s (15 ticks) × 41 '
        + '(0–10 sim-s, last = overflow).',
      releaseKind: 'at the closing tick, in this FROZEN PRECEDENCE: `passed` (`pendingPass.t` '
        + 'changed this tick with `passerGid === g`) > `shot` (his side\'s `shots` stat rose) > '
        + '`cleared` (his side\'s `clearances` rose) > `lost`. ⚠ A REFINEMENT OF #368 item 3\'s '
        + 'three names, declared: `cleared` is published as its OWN bucket rather than folded '
        + 'into `passed` or `lost`.',
      openSpell: 'a spell still open at full time is COUNTED '
        + '(`spell.openAtFullTimePerMatch`) and enters NO spell face.',
      carrierDecision: 'a tick at which `ball.owner.gid === p.gid` AND `p.action` is a '
        + 'DIFFERENT OBJECT from the previous tick\'s for that gid. Every carrier decision '
        + 'assigns a FRESH action object literal (`p.action = { type: …, scores }`, anchored), '
        + 'and a tick on which no decision ran leaves the same object in place, so object '
        + 'identity IS the decision-tick detector. The map is primed from the constructed '
        + 'match before the first step, so the first tick cannot count as a spurious decision.',
      passLostToCarry: 'a carrier decision whose stored `p.action.scores` contains an entry '
        + 'with `action ∈ {Pass, LoftedPass, ThroughBall, Cross}` while `p.action.type ∈ '
        + '{Dribble, HoldUp, ShieldHold}`. ⚠ TRUNCATION DECLARED: `scores` is '
        + '`cands.slice(0, 4)` — the TOP-4 ONLY (anchored) — so a pass candidate ranked fifth '
        + 'or lower is INVISIBLE to this face and the face is a LOWER BOUND on the loss.',
      groundPassesPerMatch: 'RA-T1B\'s own reported face, definition REUSED and anchored: '
        + 'measured ground passes = `isMeasurableGroundPass` (shortPass | throughBall | '
        + 'cutback, ground launch, with a pending-pass target), per match.',
      carriesPerMatch: '⚠ DECLARED DEVIATION FROM THE BRIEF: RA-T1B publishes NO '
        + '`carriesPerMatch` face — #364 item 2\'s "more carries" is PROSE, not a measured '
        + 'face (verified by search over the exam\'s instrument and doc). This census therefore '
        + 'DEFINES it as the ENGINE\'S OWN `dribbles` team stat per match, anchored at its '
        + 'single increment site, and publishes the spell volumes beside.',
    },
    hitsABody: {
      population: 'every MEASURED GROUND PASS — RA-T1B\'s `isMeasurableGroundPass`, reused and '
        + 'anchored; registered at the strike via `pendingPass` (a pass with no pending target '
        + 'is not in the population). ONE flight is tracked at a time: a new release RETIRES '
        + 'the previous one (RA-T1B / RC-C0\'s own idiom).',
      electedPoint: 'E = the pass\'s aim point AT THE STRIKE. Where the strike resolved a '
        + 'TRACKED wind-up record for this passer and target, E = `aim + (aimLead ?? 0)` — the '
        + 'record\'s own elected point. Otherwise (a synchronous strike) E = the target\'s own '
        + 'position at the strike tick, which is `performPass`\'s own aim base `mate.pos`. '
        + 'LAUNCH = `ball.pos − ball.vel · DT`. u = unit(E − launch); |E − launch| ≤ 1e-6 ⇒ NO '
        + 'launch line and the flight enters no rebound face (COUNTED in '
        + '`contact.noLaunchLineShare`).',
      firstBody: 'THE FIRST BODY = the first tick after the release at which `ball.lastTouch` '
        + 'is a body OTHER than the passer. CLASSES: `ownTarget` (=== the pendingPass target) '
        + '/ `ownNonTarget` (same side) / `opponent` / `none` (the flight retires without such '
        + 'a tick). This is the engine\'s OWN touch channel: every path that moves the ball '
        + 'off a body assigns `ball.lastTouch = p` (three sites, anchored), the contact law\'s '
        + '`bkApplyBodyStrike` included.',
      channelPerArm: 'the contact law\'s own `bodyStrike` sub-class is recorded when '
        + '`bkContactLedger.strikesApplied` ROSE on the contact tick. Where the law is not '
        + 'armed that counter never moves (asserted EXACTLY ZERO by `gClassesNonVacuous`) and '
        + 'the sub-class is STRUCTURALLY EMPTY — declared per arm, never zero-imputed.',
      sector: 'the LAW\'S OWN CLASSIFIER, CALLED: '
        + '`ballAccessGeometry(body, ball, CONTROL_RADIUS).sector` — front ⇔ facingCos ≥ '
        + 'SQRT1_2, back ⇔ facingCos ≤ −SQRT1_2, else side, where facingCos = unit(body → '
        + 'ball) · unit(bodyDir) (thresholds anchored verbatim, never re-implemented). ⚠ READ '
        + 'AT THE END OF THE CONTACT TICK: with no wrapper the pre-resolution instant is not '
        + 'observable, and by then the law has already released the ball ALONG THE SAME '
        + 'body→ball normal the classifier reads — so the sector is that normal, up to one '
        + 'tick of drift. Declared.',
      rebound: 'THE REBOUND (「弹回」) = an OWN-body first contact whose POST-CONTACT ball '
        + 'velocity component along the launch line is NEGATIVE: `dot(ball.vel, u) < 0` read '
        + 'at the contact tick. Signed bins 1 m/s × 21 stored.',
      receiverFacing: 'on COMPLETED passes, the intended receiver\'s own facing SECTOR at his '
        + 'first touch = the same classifier called on him at the tick his side\'s '
        + '`passesCompleted` rose.',
      ladder: 'DX-C2\'s own FOUR-WAY outcome ladder, reused: `completed` / `intercepted` / '
        + '`out` / `unresolved`, first terminal event wins, TEMPORAL NOT CAUSAL.',
    },
    prediction: {
      frozenScope: '#368 item 2(a), verbatim: "on world 12 ground passes, if H2 dominates the '
        + 'FIRST body the ball touches is the OWN TARGET with a side/back sector more often '
        + 'than an OPPONENT; if H1 dominates, opponents and own NON-target bodies dominate the '
        + 'first contact. REPORTED by PT-C0, no gate."',
      resolvedly: '⭐ DEFINED AS CI SEPARATION AND NOTHING ELSE: the 95 % cluster-bootstrap '
        + 'interval of the contrast lies ENTIRELY ABOVE ZERO. There is NO threshold beyond the '
        + 'interval.',
      h2Test: 'Δ_H2 = P(ownTarget ∧ sector ∈ {side, back}) − P(opponent), CI entirely > 0.',
      h1Test: 'Δ_H1 = [P(opponent) + P(ownNonTarget)] − P(ownTarget ∧ side/back), CI entirely '
        + '> 0.',
      fourWay: 'exactly H2 ⇒ "the numbers favour H2"; exactly H1 ⇒ "the numbers favour H1"; '
        + 'BOTH ⇒ "MIXED — the frozen form favours NEITHER"; NEITHER ⇒ "neither resolvedly". '
        + 'The four-way is FROZEN so no precedence is invented after sight.',
      reportedNotScored: '⛔ REPORTED, NO GATE. The census prints the sentence from the frozen '
        + 'definitions and stops; it attributes nothing and the commander rules.',
    },
    pairedDeltas: '⭐ the four arms SHARE seeds and are built with the IDENTICAL population '
      + 'construction per seed, so the cluster bootstrap resamples SEEDS and both arms of a '
      + 'pair move together inside every draw — the interval is a PAIRED one by construction. '
      + 'THE THREE PAIRS OF RECORD: A−C (12 vs 11, the user\'s comparison), A−D (12 vs '
      + 'shipped), A−B (dosed vs empty — the test of #365\'s first-look disclosure). REPORTED '
      + 'on every face; ⛔ nothing here is scored.',
    clock: '1 sim-s = 60 ticks = 22.5 display-s; the match is 240 sim-seconds. Every per-match '
      + 'COUNT face carries the clock in its unit string; every SHARE face is clock-invariant.',
  },
  doseSource: {
    what: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field".',
    loadersCalled: ['loadL3Dose', 'loadPcDose'],
    files: { [L3_DOSE_FILE]: L3_DOSE_BYTES_SHA, [PC_DOSE_FILE]: PC_DOSE_BYTES_SHA },
    l3CellsPooled: L3_DOSE?.length ?? 0,
    pcRowsPooled: PC_DOSE?.length ?? 0,
    l3NonEmpty: (L3_DOSE ?? []).some((c) => c.lunges > 0),
    pcNonEmpty: (PC_DOSE ?? []).some((row) => row.some((v) => v > 0)),
    pcDoseGuardBytesChecked: pcDoseGuard.bytesChecked,
    tablesArgumentNote: '⭐ `loadA4Tables` is NOT called and NOT needed: `GameApp.armA4` never '
      + 'loads the A4 census tables for world 11 or 12 (both are in its `pcStack` predicate, '
      + 'which SKIPS that branch), and `armA4World`\'s RA / corridor branches RETURN before '
      + 'the `tables === null` refusal, so the tables argument cannot reach these arms at all. '
      + 'The user\'s form and the exams\' form therefore differ ONLY in the two doses — which '
      + 'is exactly what the A−B pair measures.',
    reachable: DOSED_ARM_REACHABLE,
    loadError: DOSE_LOAD_ERROR,
  },
  shippedConstruction,
  contactClasses: CONTACTS,
  sectors: SECTORS,
  releases: [...RELEASES, 'all'],
  outcomes: OUTCOMES,
  actionVocabulary: { labels: ACTIONS, count: ACTIONS.length },
  anchoredSites: ANCHORS,
  fixtures: FIXTURES,
  lockstep: lockstepRows,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS census\'s own 12-cluster SCRATCH SMOKE (seeds 900,001,900–911), '
      + 'DISCLOSED IN FULL at the doc\'s §DEV-PREFLIGHT. ⚠ 12 clusters is a NOISY variance '
      + 'estimate. Target 0.05 on the three pre-registered A−C paired Δs; N_FROZEN takes the '
      + 'block\'s own maximum (999 battery seeds) and any row needing more is DECLARED '
      + 'UNRESOLVABLE here.',
    nFrozen: N_FROZEN, arms: ARMS.length, blockAffords: 999, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  prediction: PREDICTION,
  medians: {
    note: '⭐ every median below is BIN-DERIVED (the lower edge of the bin whose cumulative '
      + 'count first reaches n/2) from the stored bins, so `gFaces` re-derives each one off '
      + 'the SERIALIZED artifact — canon, VERBATIM: "the re-derivation gate covers EVERY '
      + 'published face; a percentile face requires stored bins"',
    values: medians,
  },
  bins: Object.fromEntries(ARMS.map((arm) => [arm, {
    nearestMateMetres: { width: NEAR_BIN_M, bins: NEAR_BINS, overflowIsLast: true,
      pooled: pooled[arm].nearBins },
    minPairwiseMetres: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, overflowIsLast: true,
      pooled: pooled[arm].minPairBins },
    spellTicks: { width: SPELL_BIN_TICKS, bins: SPELL_BINS, overflowIsLast: true,
      groups: [...RELEASES, 'all'], pooled: pooled[arm].spellBins },
    alongLaunchVelocityMs: { width: ALONG_BIN_MS, bins: ALONG_BINS, centreHoldsZero: true,
      pooled: pooled[arm].alongBins },
    firstContactClass: { vocabulary: CONTACTS, pooled: pooled[arm].contactClass },
    firstContactBodyStrike: { vocabulary: CONTACTS, pooled: pooled[arm].contactBodyStrike },
    ownBodySector: { vocabulary: SECTORS, groups: ['ownTarget', 'ownNonTarget'],
      pooled: pooled[arm].ownSector },
    receiverFacingAtTouch: { vocabulary: SECTORS, pooled: pooled[arm].recvSector },
    outcome: { vocabulary: OUTCOMES, pooled: pooled[arm].outc },
  }])),
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
    meanWallSecondsPerMatch: ARMS.reduce(
      (a, arm) => a + armRows(arm).reduce((b, r) => b + r.wallMs, 0), 0,
    ) / 1000 / (cells.length * ARMS.length),
    note: '⚠ A MACHINE READING ON ONE MACHINE. The timed region is the WALK, observer reads '
      + 'included — never the game\'s frame cost.',
  },
  honestLimitsNote: '⛔ canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE home; '
    + 'the artifact stores that list verbatim or stores none" (home: '
    + 'RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). THIS '
    + 'ARTIFACT STORES NONE. The list of record is '
    + 'docs/world-model/PT-C0-PLAYTEST-FORENSIC-CENSUS.md §R HONEST LIMITS.',
  perSeedCells,
  constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/*    canon, VERBATIM: "the re-derivation gate covers EVERY published face; a    */
/*    percentile face requires stored bins"                                     */
/* ========================================================================== */
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact, null, 2)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: (Record<Arm, Row> & { seed: number })[];
  faces: FaceRow[]; deltas: DeltaRow[];
  bins: Record<Arm, Record<string, { pooled?: number[] | number[][] }>>;
  medians: { values: Record<Arm, Record<string, unknown>> };
  prediction: Record<'A' | 'B', Record<string, unknown>>;
  sizing: { rows: typeof sizingRows };
};
/** ⭐ JSON HAS NO NaN LITERAL: a face computed on an EMPTY class (an empty class is REPORTED,
 *  never zero-imputed) has the value NaN, and `JSON.stringify` writes it as `null`. The
 *  re-derivation gate therefore recognises `null` as the SERIALIZATION of NaN — and nothing
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
    ok: sameNum(pl, dd.leftValue) && sameNum(pr, dd.rightValue)
      && sameNum(pl - pr, dd.delta),
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
  cmp('nearestMateMetres', got.nearBins);
  cmp('minPairwiseMetres', got.minPairBins);
  cmp('spellTicks', got.spellBins);
  cmp('alongLaunchVelocityMs', got.alongBins);
  cmp('firstContactClass', got.contactClass);
  cmp('firstContactBodyStrike', got.contactBodyStrike);
  cmp('ownBodySector', got.ownSector);
  cmp('receiverFacingAtTouch', got.recvSector);
  cmp('outcome', got.outc);
  /* ⭐ EVERY BIN-DERIVED MEDIAN re-derives off the disk bins */
  binChecks.push({ bin: `${arm}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[arm]) });
  /* ⭐ THE PARTITIONS re-derive off disk too */
  binChecks.push({ bin: `${arm}.partition.firstContactSumsToFlights`,
    ok: sum(got.contactClass) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${arm}.partition.outcomeSumsToFlights`,
    ok: sum(got.outc) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ bin: `${arm}.partition.ownSectorSumsWithinOwnClasses`,
    ok: sum(got.ownSector[0]) <= got.contactClass[CTI('ownTarget')]
      && sum(got.ownSector[1]) <= got.contactClass[CTI('ownNonTarget')]
      && sum(got.ownSector[0]) + sum(got.ownSector[1])
        === sum(rows.map((r) => r.ownBodyContacts)) });
  binChecks.push({ bin: `${arm}.partition.spellKindsSumToAll`,
    ok: RELEASES.reduce((a, _, gi) => a + sum(got.spellBins[gi]), 0)
      === sum(got.spellBins[RELEASES.length]) });
  binChecks.push({ bin: `${arm}.partition.reboundInsideOwnBodyWithLine`,
    ok: sum(rows.map((r) => r.reboundHits)) <= sum(rows.map((r) => r.reboundN))
      && sum(rows.map((r) => r.reboundN)) + sum(rows.map((r) => r.reboundNoLine))
        === sum(rows.map((r) => r.ownBodyContacts)) });
  binChecks.push({ bin: `${arm}.partition.nearBinsMatchSpacingSamples`,
    ok: sum(got.nearBins) === sum(rows.map((r) => r.spacingSamples)) });
}
/** ⭐ THE PRINTED PREDICTION READ, re-derived from the SERIALIZED per-seed cells */
for (const arm of ['A', 'B'] as const) {
  const rows = disk.perSeedCells.map((c) => c[arm]);
  const share = (num: (r: Row) => number): number =>
    ratio(sum(rows.map(num)), sum(rows.map((r) => r.gpFlights)));
  const pSB = share((r) => r.ownTargetSideBack);
  const pOpp = share((r) => r.contactClass[CTI('opponent')]);
  const pNon = share((r) => r.contactClass[CTI('ownNonTarget')]);
  const stored = disk.prediction[arm] as unknown as {
    pOwnTargetSideBack: { value: number | null }; pOpponent: { value: number | null };
    pOwnNonTarget: { value: number | null };
    h2Contrast: { delta: number; ciLo: number }; h1Contrast: { delta: number; ciLo: number };
    h2Resolved: boolean; h1Resolved: boolean; reading: string;
  };
  const wantReading = stored.h2Resolved && stored.h1Resolved
    ? 'MIXED' : stored.h2Resolved ? 'H2' : stored.h1Resolved ? 'H1' : 'NEITHER';
  const gotReading = stored.reading.includes('MIXED') ? 'MIXED'
    : stored.reading.includes('FAVOUR H2') ? 'H2'
      : stored.reading.includes('FAVOUR H1') ? 'H1' : 'NEITHER';
  binChecks.push({ bin: `prediction.${arm}.sharesRederive`,
    ok: sameNum(pSB, stored.pOwnTargetSideBack.value)
      && sameNum(pOpp, stored.pOpponent.value)
      && sameNum(pNon, stored.pOwnNonTarget.value) });
  binChecks.push({ bin: `prediction.${arm}.contrastsRederive`,
    ok: Math.abs((pSB - pOpp) - stored.h2Contrast.delta) < 1e-12
      && Math.abs(((pOpp + pNon) - pSB) - stored.h1Contrast.delta) < 1e-12 });
  binChecks.push({ bin: `prediction.${arm}.readingFollowsTheFrozenFourWay`,
    ok: wantReading === gotReading
      && stored.h2Resolved === (stored.h2Contrast.ciLo > 0)
      && stored.h1Resolved === (stored.h1Contrast.ciLo > 0) });
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
    + 'partition / PREDICTION-READ / sizing checks re-derived from the SERIALIZED artifact off '
    + 'disk. ⭐ JSON has no NaN literal, so a face computed on an EMPTY class (an empty class '
    + 'is REPORTED, never zero-imputed) is stored as `null` and the gate recognises `null` as '
    + 'the serialization of NaN — every other value must match BIT FOR BIT',
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
    + 'construction receipt, and EXCLUDES `hashedBodySha256` itself; the body hash is computed '
    + 'LAST — after `gFaces` and `gHashOrder` are in `gates` — and the FILE BYTE-HASH of the '
    + 'final artifact is published in the doc\'s §R',
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
banner(`PT-C0 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
const f6 = (v: number): string => v.toFixed(6);
banner('');
banner('--- (i) 挤人 — CROWDING (attacking side, open play) ---');
for (const arm of ARMS) {
  banner(`  ${arm} nearest-mate ${f6(face('crowd.nearestMateMeanMetres', arm).value)} m  `
    + `median ${String((medians[arm] as { nearestMateMetres: number }).nearestMateMetres)} m  `
    + `dupRun ${f6(face('crowd.dupRunPairsPerSample', arm).value)} pairs/sample  ⭐撞车 `
    + `${f6(face('crowd.crashShare', arm).value)}  n=${face('crowd.crashShare', arm).denominator}`);
}
banner('');
banner('--- (ii) 传不出去 — THE BALL THAT CANNOT BE PASSED OUT ---');
for (const arm of ARMS) {
  banner(`  ${arm} spell ${f6(face('spell.meanSimSeconds.all', arm).value)} s (median `
    + `${String((medians[arm] as { spellSimSeconds: Record<string, number> })
      .spellSimSeconds.all)} s)  passLostToCarry `
    + `${f6(face('lost.passLostToCarryShare', arm).value)}  groundPasses `
    + `${f6(face('volume.groundPassesPerMatch', arm).value)}/match  carries `
    + `${f6(face('volume.carriesPerMatch', arm).value)}/match`);
}
banner('');
banner('--- (iii) 传到人身上 — THE BALL THAT HITS A BODY ---');
for (const arm of ARMS) {
  banner(`  ${arm} first contact: none ${f6(face('contact.firstBody.none', arm).value)} · `
    + `ownTarget ${f6(face('contact.firstBody.ownTarget', arm).value)} · ownNonTarget `
    + `${f6(face('contact.firstBody.ownNonTarget', arm).value)} · opponent `
    + `${f6(face('contact.firstBody.opponent', arm).value)}   n=`
    + `${face('contact.firstBody.none', arm).denominator}`);
  banner(`    ownTarget side/back ${f6(face('contact.ownTargetSideBackShare', arm).value)}  `
    + `rebound ${f6(face('contact.reboundShare', arm).value)}  completed `
    + `${f6(face('outcome.completed', arm).value)}  intercepted `
    + `${f6(face('outcome.intercepted', arm).value)}  contactLaw `
    + `${cells.every((c) => c.rows[arm].contactLawArmed) ? 'ARMED' : 'OFF'}`);
}
banner('');
banner('--- ⭐ THE DISCRIMINATING PREDICTION (#368 item 2(a)) — REPORTED, NO GATE ---');
for (const arm of ['A', 'B'] as const) {
  banner(`  arm ${arm}: ${(PREDICTION[arm] as { reading: string }).reading}`);
}
banner('');
banner('--- §R4 THE PAIRED Δs ---');
for (const key of ['crowd.crashShare', 'spell.meanSimSeconds.all', 'lost.passLostToCarryShare',
  'contact.ownTargetSideBackShare', 'contact.opponentFirstContactShare',
  'context.passCompletion'] as const) {
  for (const [l, r] of PAIRS) {
    const dd = delta(key, l, r);
    banner(`  ${key.padEnd(34)} ${l}−${r}  Δ ${f6(dd.delta)} [${f6(dd.ciLo)}, ${f6(dd.ciHi)}] `
      + `(${dd.absDeltaOverHalfWidth.toFixed(3)} hw)`);
  }
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FILE_BYTE_SHA}`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
