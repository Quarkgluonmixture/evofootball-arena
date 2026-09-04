/**
 * ⭐⭐ BF-T1 — THE FACING-COST EXAM (docs/world-model/BF-T1-FACING-COST-EXAM.md).
 *
 * Authorized by COMMANDER RULING #377 item 3 (scope = #376 item 5 made exact), on the law
 * BF-T0 + BF-T0-FIX landed (`0b344fa`). Binding contract:
 * docs/world-model/BF-BODY-FACING-CONTRACT.md §2 M-BF.1 (the facing factor) · M-BF.2 (HELD) ·
 * M-BF.3 (nothing else changes; Road B) · M-BF.4 (the coupling to RC).
 * THE LAW OF RECORD: ruling #374 item 4 as CORRECTED by #376 item 2 (clamp → facing → stun →
 * accel; the factor scales the CLAMPED target).
 *
 * Instrument family: scripts/probes/rc-t1a-precue-exam.ts (THE EXAM FORM OF RECORD — paired
 * arms on shared seeds, the cluster bootstrap, LOO flip counting, `gArmsDiverge` SOME-not-
 * EVERY, the frozen sentence literals, the allowlist-hashed body, gFaces off disk, the §19b
 * hash order, the match-local dose idiom, the PT-C0 user faces and the E4 definitions) +
 * scripts/probes/bf-c0-movement-facing-census.ts (the per-tick φ read, the role cells, the
 * COMPACT artifact and the NON-body hash receipt) + scripts/probes/df-t1-persistence-exam.ts
 * §3 (the 乱跑 instrument — DF-C0 §R2's definitions REUSED VERBATIM) +
 * scripts/probes/mt-ladder.ts (E4's forwardPassShare line, anchored).
 *
 * ⭐ THE QUESTION, in two halves: (a) does the price BITE ON THE PITCH where BF-C0's census
 * said it would — the mean speed of moving ticks past 90° falls, the mean speed of nearly-
 * aligned ticks holds — and (b) is the world STILL FOOTBALL when it does (goals inside a band,
 * completion not worse, interceptions not up)?
 *
 * THE SIX ARMS, PAIRED on shared seeds (arm k walks seed s with the IDENTICAL population
 * construction — RC-T1a's own `buildMatch` plumbing):
 *   E-SHUT  = world 12 EMPTY-BOOK: a4MatchFlags(12) + armA4World(m, null, 12). The flag is
 *             ABSENT and every body's `facingDepth` is 0.
 *   E-ARMED = E-SHUT + `bfFacingCost: true` in the CONSTRUCTOR flags ⇒ the SHIPPED writer
 *             `Match.setFacingDepth()` puts BF_DEPTH (0.30) on every body and on every
 *             substitute. — THE SCORED PAIR.
 *   D-SHUT / D-ARMED = the same pair DOSED: armA4World(m, null, 12, L3_DOSE, PC_DOSE) through
 *             the SHIPPED loaders, `gDoseSource` hashing the bytes against PT-C0's two PINNED
 *             values. — REPORTED.
 *   E-k60 / E-k80 = E-ARMED with the depth DOSED MATCH-LOCAL to 0.40 / 0.20 (k = 0.60 / 0.80),
 *             written on the BODY's public `facingDepth` — the very field the shipped writer
 *             targets, NEVER in `info.genome` — and RE-ASSERTED after EVERY step so a
 *             substitute's shipped re-write to 0.30 cannot leak. ⚠ These two arms carry a
 *             per-tick dose write BY DESIGN and are REPORTED, NEVER SCORED.
 *
 * H-BF.1 (frozen at §P.C before any battery seed; SCORED ON E-ARMED − E-SHUT ONLY):
 *   (a1) Δ of the MEAN SPEED of moving ticks with φ > 90° ENTIRELY BELOW ZERO ⇒ FALLS.
 *   (a2) Δ of the MEAN SPEED of moving ticks with φ < 15° NOT entirely below −0.05 m/s ⇒ HOLDS.
 *   (b1) Δ `goalsPerMatch` NOT entirely outside [−0.30, +0.30] ⇒ WITHIN-BAND.
 *   (b2) Δ whole-match `passCompletion` NOT entirely below −0.010 ⇒ DOES-NOT-FALL.
 *   (b3) Δ `interceptionsPerMatch` NOT entirely above +1.0 ⇒ DOES-NOT-RISE.
 *   H-BF.1 = PASS ⇔ (a1) ∧ (a2) ∧ (b1) ∧ (b2) ∧ (b3).
 *   ⚠ (a1)/(a2) are SELECTION statistics — who is in the bin can change under the law. Stated.
 *   ⚠ A non-fall / non-rise / within-band certifies NOTHING SMALLER THAN THE DECLARED MDE.
 *
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited — the law is already in the tree and
 * landed with its own 20-pin suite; this probe CALLS the shipped exports and reads `Match`
 * state per tick. THERE IS NO WRAPPER; `gLockstep` proves observed ≡ unobserved per arm.
 * ⛔ Receipts are receipts: the coverage share, the re-assertion counts and the substitution
 * counts are ARMING PLUMBING and are NEVER quoted as football effect sizes (home: ruling #289
 * item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).
 * ⛔ NO SEASON LADDER: a body law, no gene (#377 item 3).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import { CONTROL_RADIUS, DT, AI_INTERVAL, GRAVITY, MATCH_DURATION } from '../../src/sim/constants';
import { TURN_RATE, ACCEL } from '../../src/sim/Player';
import { BF_OFF_HEADING_FRACTION, BF_DEPTH, facingFactor, facingCosine } from '../../src/sim/bodyFacing';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  loadL3Dose, loadPcDose,
  RA_WORLD_VERSION, RA_WORLD_LEAD, RA_WORLD_WEIGHT,
  type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { ballAccessGeometry, type BodySector } from '../../src/sim/physical';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo, type Role } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass, the RC-T1a §1 form                         */
/* ========================================================================== */
const ENV_WHITELIST = ['BFT1_MODE', 'BFT1_N', 'BFT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'PC_DOSE', 'BK_WORLD'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BFT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`BF-T1 FATAL — unrecognised env: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.BFT1_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('BF-T1 FATAL — BFT1_MODE must be smoke|full'); process.exit(3);
}
const N_ENV = process.env.BFT1_N !== undefined ? Number(process.env.BFT1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV < 1)) {
  banner('BF-T1 FATAL — BFT1_N must be a positive integer'); process.exit(3);
}
const OUT_ENV = process.env.BFT1_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`BFT1_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`BFT1_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`BFT1_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bf-t1-facing-cost-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/bf-t1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('BF-T1 FATAL — an override run may never write the canonical artifact path');
  process.exit(3);
}

/* ========================================================================== */
/* §2 SMALL HELPERS (the RC-T1a §2 set)                                        */
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
const PLAYER_PATH = 'src/sim/Player.ts';
const FACING_PATH = 'src/sim/bodyFacing.ts';
const MATCH_PATH = 'src/sim/Match.ts';
const CONST_PATH = 'src/sim/constants.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const MTL_PATH = 'scripts/probes/mt-ladder.ts';
const DFT1_PATH = 'scripts/probes/df-t1-persistence-exam.ts';
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
  occurrences: { line: number }[]; extracted: unknown; ok: boolean;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, wantOccurrences: number,
  extracted: unknown = null,
): void => {
  const hits = occurrences(srcOf(file), needle);
  ANCHORS.push({
    what, file, needle, wantOccurrences, occurrences: hits, extracted,
    ok: hits.length === wantOccurrences,
  });
};

/* --- ⭐⭐ THE LAW ITSELF: the two constants and the two pure functions --- */
anchor('⭐⭐ BF_OFF_HEADING_FRACTION — the ONE ratified constant k = 0.70 (#374 item 4(ii))',
  FACING_PATH, 'export const BF_OFF_HEADING_FRACTION = 0.7;', 1, BF_OFF_HEADING_FRACTION);
anchor('⭐⭐ BF_DEPTH — DERIVED from k in one line, never typed twice (#375 item 2)',
  FACING_PATH, 'export const BF_DEPTH = 1 - BF_OFF_HEADING_FRACTION;', 1, BF_DEPTH);
anchor('⭐⭐ `facingFactor` — the law on scalars, the cosine-flat family',
  FACING_PATH, 'export function facingFactor(cosPhi: number, depth: number): number {', 1);
anchor('⭐⭐ `facingCosine` — cos φ between heading and intended direction; degenerate ⇒ 1',
  FACING_PATH,
  'export function facingCosine(headX: number, headY: number, dirX: number, dirY: number): number {',
  1);
/* --- ⭐⭐ THE SEAM'S ORDER, LINE BY LINE, IN THE ORDER `physicsStep` RUNS IT (#376 item 2) --- */
anchor('⭐⭐ (1) THE TOP-SPEED CLAMP — FIRST, and unchanged since before the seam', PLAYER_PATH,
  '    const dv = this.desiredVel;\n'
  + '    const max = this.topSpeed;\n'
  + '    const dl = Math.sqrt(dv.x * dv.x + dv.y * dv.y); // clampLen', 1);
anchor('⭐⭐ (2) THE ONE SEAM — the CLAMPED target scaled, both components by the SAME f',
  PLAYER_PATH,
  '    if (this.facingDepth > 0) {\n'
  + '      const tl = Math.sqrt(tx * tx + ty * ty);\n'
  + '      if (tl > 1e-8) {\n'
  + '        const f = facingFactor(\n'
  + '          facingCosine(this.heading.x, this.heading.y, tx / tl, ty / tl),\n'
  + '          this.facingDepth,\n'
  + '        );\n'
  + '        tx *= f;\n'
  + '        ty *= f;', 1);
anchor('⭐⭐ (3) THE STUN MULTIPLIER — AFTER the seam', PLAYER_PATH,
  '    if (this.stunTimer > 0) {\n'
  + '      tx *= 0.15;\n'
  + '      ty *= 0.15;\n'
  + '    }', 1);
anchor('⭐⭐ (4) THE ACCEL APPROACH — LAST of the four', PLAYER_PATH,
  '    const maxDelta = this.accel * dt; // approachV', 1);
anchor('⭐⭐ THE HEADING-FOLLOW FLOOR `sp > 0.5` — the population cut, the ENGINE\'s own '
  + '(ANCHORED, never a taste constant)', PLAYER_PATH, '    } else if (sp > 0.5) {', 1);
anchor('⭐ TURN_RATE — the turn cap the direction-change price is paid against, UNCHANGED',
  PLAYER_PATH, 'export const TURN_RATE = 6.5;', 1, TURN_RATE);
anchor('⭐ ACCEL — the only rate that limits how fast the velocity may change', PLAYER_PATH,
  'export const ACCEL = 14; // m/s^2 toward desired velocity', 1, ACCEL);
anchor('⭐ DT — the sim step every metre and every rate on this page is measured on',
  CONST_PATH, 'export const DT = 1 / 60;', 1, DT);
anchor('AI_INTERVAL — the decision cadence (context; the exam reads every tick)', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
anchor('⭐ MATCH_DURATION — the 240 s match clock every rate on this page runs on', CONST_PATH,
  'export const MATCH_DURATION = 240;', 1, MATCH_DURATION);
anchor('⭐ THE BODY DIRECTION the exam reads (`heading`)', PLAYER_PATH, '  heading = v2(1, 0);', 1);
anchor('⭐⭐ THE PUBLIC DEPTH FIELD the shipped writer targets and the rungs DOSE',
  PLAYER_PATH, '  facingDepth = 0;', 1);
anchor('⭐ `desiredVel` — the executor\'s intent the coverage read re-clamps', PLAYER_PATH,
  '  /** Set every frame by the action executor; physics chases it. */\n  desiredVel = v2();', 1);
anchor('⭐ the PURE `topSpeed` getter the coverage read clamps against', PLAYER_PATH,
  '    return this.baseSpeed * (0.62 + 0.38 * this.stamina);', 1);
/* --- ⭐⭐ THE SHIPPED WRITER AND ITS THREE CALL SITES --- */
anchor('⭐⭐ `Match.setFacingDepth()` — THE SHIPPED WRITER (`BF_DEPTH` or 0 on every body)',
  MATCH_PATH,
  '  private setFacingDepth(): void {\n'
  + '    const depth = this.bfFacingCost ? BF_DEPTH : 0;\n'
  + '    for (const t of this.teams) for (const p of t.players) p.facingDepth = depth;\n'
  + '  }', 1);
anchor('⭐ the `bfFacingCost` config read (`?? false` — the door is shut unless asked)',
  MATCH_PATH, '    this.bfFacingCost = cfg.bfFacingCost ?? false;', 1);
anchor('⭐⭐ the writer\'s re-call after BOTH substitution paths (2 honest occurrences; the '
  + 'two sites differ only in indentation, so the needle starts at the statement)',
  MATCH_PATH, 'this.setFacingDepth(); // ⭐ BF T0: the new man carries this match\'s depth too',
  2);
anchor('⭐⭐ the writer\'s FIRST call site — immediately after `this.teams` is built',
  MATCH_PATH,
  '    this.teams = [new Team(0, cfg.teamA), new Team(1, cfg.teamB)];', 1);
/* --- WORLD 12's own composition, CALLED never copied --- */
anchor('⭐ world 12\'s flag composition', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);
anchor('⭐ world 12\'s arming line (world 11\'s arming + the two exam pins)', A4_PATH,
  '  armCorridorWorld(match, l3Dose, pcDose);\n'
  + '  for (const side of [0, 1] as const) setRaGenes(match, side);', 1,
  [RA_WORLD_LEAD, RA_WORLD_WEIGHT]);
/* --- THE DF 乱跑 DEFINITION LINES (DF-T1 §3 / DF-C0 §R2, REUSED VERBATIM) --- */
anchor('⭐⭐ THE 乱跑 SWITCH — DF-T1 §3\'s own line: a marker\'s assigned man CHANGES',
  DFT1_PATH,
  '        if (prev !== null && cur2 !== null && prev !== cur2) {\n'
  + '          row.markSwitches += 1;', 1);
anchor('⭐⭐ THE 乱跑 DENOMINATOR — DF-T1 §8\'s own defender-minute line', DFT1_PATH,
  'const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;', 1);
anchor('⭐⭐ THE COVERAGE FACE — DF-T1 §3\'s own held-mark tick line', DFT1_PATH,
  '        if (cur2 !== null) row.markHeldTicks += 1;', 1);
anchor('⭐ the defender population line (outfield, not sent off, side out of possession)',
  DFT1_PATH, "      const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);", 1);
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
anchor('⭐ THE CARRY COUNTER — the engine\'s own `dribbles` site (context: carries/match)',
  MATCH_PATH, '      if (!recollect) team.stats.dribbles++;', 1);
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

/** ⭐ THE Role VOCABULARY — read off its own union, never re-typed */
const ROLE_NEEDLE = "export type Role = 'GK' | 'DF' | 'MF' | 'WG' | 'ST';";
const ROLES = ((srcOf(TYPES_PATH).slice(
  srcOf(TYPES_PATH).indexOf(ROLE_NEEDLE),
  srcOf(TYPES_PATH).indexOf(ROLE_NEEDLE) + ROLE_NEEDLE.length,
).match(/'([A-Z]+)'/g) ?? []).map((s) => s.slice(1, -1))) as readonly Role[];
anchor('⭐ the Role vocabulary, read off its own union', TYPES_PATH, ROLE_NEEDLE, 1, ROLES);
const RO_OF = (r: Role): number => ROLES.indexOf(r);
const NROLE = ROLES.length;

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
  && BF_OFF_HEADING_FRACTION === 0.7 && BF_DEPTH === 1 - 0.7
  && TURN_RATE === 6.5 && ACCEL === 14 && DT === 1 / 60 && AI_INTERVAL === 0.15
  && MATCH_DURATION === 240
  && RA_WORLD_VERSION === 12 && RA_WORLD_LEAD === 1 && RA_WORLD_WEIGHT === 1
  && DUP_RUN_M === 4 && SAMPLE_EVERY === 10
  && ROLES.length === 5 && ROLES.join(',') === 'GK,DF,MF,WG,ST'
  && SECTORS.length === 3 && JSON.stringify(SECTORS) === JSON.stringify(['front', 'side', 'back']);

/* ========================================================================== */
/* §4 THE DOSES — the SHIPPED LOADERS CALLED, the BYTES HASHED AND PINNED       */
/* ========================================================================== */
/** ⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a
 *  self-declared field" (home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6).
 *  The two expected values are READ OF RECORD from PT-C0's artifact `doseSource.files`.
 *  ⛔ If either differs the instrument REFUSES TO RUN — a dose is never approximated. */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_SHA_EXPECTED = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_SHA_EXPECTED = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
const DOSE_BYTES_MATCH = L3_DOSE_BYTES_SHA === L3_DOSE_SHA_EXPECTED
  && PC_DOSE_BYTES_SHA === PC_DOSE_SHA_EXPECTED;
if (!DOSE_BYTES_MATCH) {
  banner('BF-T1 FATAL — a dose file\'s BYTES differ from the PINNED expected value:');
  banner(`  ${L3_DOSE_FILE}\n    want ${L3_DOSE_SHA_EXPECTED}\n    got  ${L3_DOSE_BYTES_SHA}`);
  banner(`  ${PC_DOSE_FILE}\n    want ${PC_DOSE_SHA_EXPECTED}\n    got  ${PC_DOSE_BYTES_SHA}`);
  banner('  ⛔ a dose is NEVER approximated (PT-C0 §CORR 2). STOPPING.');
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
  banner(`BF-T1 FATAL — the DOSED arms are not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty dose'}`);
  process.exit(3);
}
const L3_CELLS_POOLED = (L3_DOSE as readonly L3DoseCell[]).length;
const PC_ROWS_POOLED = (PC_DOSE as PcDoseTable).length;

/* ========================================================================== */
/* §5 SEEDS — block 12,538,000–999 (#377 item 3); the SIX ARMS SHARE SEEDS      */
/* ========================================================================== */
const BLOCK_BASE = 12_538_000;
const BLOCK_TOP = 12_538_999;
/** ⭐⭐ N_FROZEN — sized at §DEV-PREFLIGHT by the disclosed 12-seed scratch smoke BEFORE the
 *  freeze commit and BEFORE any battery seed. The five declared targets are (a1) 0.10 m/s ·
 *  (a2) 0.05 m/s · (b1) 0.30 goals · (b2) 0.010 · (b3) 1.0/match; N_FROZEN is the LARGEST
 *  requirement, capped by what the block affords after the construction receipt is reserved. */
const N_MAX_SEEDS = 999;
const N_FROZEN = 506;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_002_500;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
/** the construction receipt seed: 12,538,999 — the block's top, walked in ALL SIX arms */
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const LOCKSTEP_SEEDS = [900_002_590, 900_002_591];

/* ========================================================================== */
/* §6 THE SIX ARMS — the world's own composer CALLED; the match-local depth dose */
/* ========================================================================== */
const ARMS = ['E-SHUT', 'E-ARMED', 'D-SHUT', 'D-ARMED', 'E-k60', 'E-k80'] as const;
type Arm = (typeof ARMS)[number];
/** ⭐⭐ THE RUNG DEPTHS, DERIVED from k in one line each — 0.30 is the shipped BF_DEPTH and
 *  the two rungs are 1 − k at k = 0.60 / 0.80 (#377 item 3). ⛔ never typed as a bare 0.4/0.2. */
const K_RUNG_60 = 0.6;
const K_RUNG_80 = 0.8;
const D_RUNG_60 = 1 - K_RUNG_60;
const D_RUNG_80 = 1 - K_RUNG_80;
/** the depth EVERY body of a walked match must carry, per arm */
const DEPTH_OF: Record<Arm, number> = {
  'E-SHUT': 0, 'E-ARMED': BF_DEPTH, 'D-SHUT': 0, 'D-ARMED': BF_DEPTH,
  'E-k60': D_RUNG_60, 'E-k80': D_RUNG_80,
};
const ARM_LABEL: Record<Arm, string> = {
  'E-SHUT': 'world 12 EMPTY-BOOK, `bfFacingCost` ABSENT — every body\'s `facingDepth` is 0',
  'E-ARMED': 'E-SHUT + `bfFacingCost: true` in the CONSTRUCTOR ⇒ the SHIPPED writer '
    + '`Match.setFacingDepth()` puts BF_DEPTH on every body and every substitute — SCORED',
  'D-SHUT': 'world 12 DOSED (PT-C0 arm A\'s composition), `bfFacingCost` ABSENT — REPORTED',
  'D-ARMED': 'D-SHUT + `bfFacingCost: true` (the shipped writer, BF_DEPTH) — REPORTED',
  'E-k60': 'E-ARMED with the depth DOSED MATCH-LOCAL to 1 − 0.60 on every body, RE-ASSERTED '
    + 'after EVERY step (⚠ a per-tick dose write BY DESIGN) — REPORTED, NEVER SCORED',
  'E-k80': 'E-ARMED with the depth DOSED MATCH-LOCAL to 1 − 0.80 on every body, RE-ASSERTED '
    + 'after EVERY step (⚠ a per-tick dose write BY DESIGN) — REPORTED, NEVER SCORED',
};
const PAIRS = [
  { key: 'E', shut: 'E-SHUT' as Arm, armed: 'E-ARMED' as Arm,
    form: 'EMPTY-BOOK, depth = BF_DEPTH (the exam form — SCORED)' },
  { key: 'D', shut: 'D-SHUT' as Arm, armed: 'D-ARMED' as Arm,
    form: 'DOSED, depth = BF_DEPTH (the matured-book form — REPORTED)' },
  { key: 'k60', shut: 'E-SHUT' as Arm, armed: 'E-k60' as Arm,
    form: 'EMPTY-BOOK, the k = 0.60 RUNG (REPORTED, never scored)' },
  { key: 'k80', shut: 'E-SHUT' as Arm, armed: 'E-k80' as Arm,
    form: 'EMPTY-BOOK, the k = 0.80 RUNG (REPORTED, never scored)' },
] as const;
const isDosed = (a: Arm): boolean => a === 'D-SHUT' || a === 'D-ARMED';
const isRung = (a: Arm): boolean => a === 'E-k60' || a === 'E-k80';
/** the CONSTRUCTOR flag: every arm that wants a non-zero depth opens the shipped door */
const wantsFlag = (a: Arm): boolean => DEPTH_OF[a] > 0;

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
 * ⭐⭐ THE MATCH-LOCAL DEPTH DOSE (canon: dose placement, ruling #270.2 / #334 item 1). The
 * dose is written on the BODY's PUBLIC `facingDepth` — THE VERY OBJECT AND FIELD THE SHIPPED
 * WRITER ITSELF TARGETS (`Match.setFacingDepth()`), never in `info.genome` and never in a
 * genome view of any kind; `gGenomeClean` proves the franchise genome stays clean on every
 * walked match. ⚠ Because the shipped writer re-writes BF_DEPTH after EVERY substitution,
 * the rung dose is RE-ASSERTED after every step and every re-assertion that CHANGED a value
 * is COUNTED and PUBLISHED per match (`gRungReassert`).
 */
const doseDepth = (m: Match, depth: number): number => {
  let changed = 0;
  for (const t of m.teams) {
    for (const p of t.players) {
      if (p.facingDepth !== depth) { p.facingDepth = depth; changed += 1; }
    }
  }
  return changed;
};
/**
 * ⭐⭐ RC-T1a's own population construction (the same genome/squad/side/seed plumbing and the
 * same 240 s match), so arm k walks seed s with the IDENTICAL population and the six arms
 * differ ONLY in the flag, the dose and the depth — which is what makes every Δ PAIRED.
 */
const buildMatch = (seed: number, arm: Arm): Match => {
  const base = { seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2) };
  const m = new Match({
    ...base,
    ...a4MatchFlags(RA_WORLD_VERSION),
    ...(wantsFlag(arm) ? { bfFacingCost: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (isDosed(arm)) armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, RA_WORLD_VERSION);
  if (isRung(arm)) doseDepth(m, DEPTH_OF[arm]);
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
const RAD2DEG = 180 / Math.PI;
/** ⭐⭐ φ — BF-C0 §P.A's face, REUSED: the angle between `heading` and `vel`, in DEGREES,
 *  both read at the SAME tick AFTER `m.step(DT)`. Sign-blind. A degenerate pair names no
 *  angle and is EXCLUDED (returns NaN). */
const phiDegOf = (hx: number, hy: number, vx: number, vy: number): number => {
  const hl = Math.sqrt(hx * hx + hy * hy);
  const vl = Math.sqrt(vx * vx + vy * vy);
  if (hl < 1e-12 || vl < 1e-12) return Number.NaN;
  const c = (hx * vx + hy * vy) / (hl * vl);
  return Math.acos(c > 1 ? 1 : c < -1 ? -1 : c) * RAD2DEG;
};
/** ⭐⭐ THE MOVING FLOOR — the SHIPPED `sp > 0.5` of `physicsStep`, ANCHORED above. */
const MOVING_FLOOR = 0.5;
const PHI_BIN_DEG = 15;
const NPHI = 12;
/** the two cuts fall on STORED BIN EDGES: 45° is the lower edge of bin 3, 90° of bin 6 */
const BIN45 = 3;
const BIN90 = 6;
/**
 * ⭐⭐ THE LIVE COVERAGE OF THE PRICE (#376 §CORR 6) — A READ, DECLARED. The probe recomputes
 * what the seam computed, from the SAME public fields, with the SHIPPED `facingFactor` /
 * `facingCosine`: the intent is CLAMPED to `topSpeed` exactly as `physicsStep` clamps it, and
 * the factor is taken on the clamped target's direction against `heading`.
 * ⚠ THE ONE-STEP PHASE SUBTLETY, STATED: `desiredVel` read after `m.step(DT)` is the
 * executor's intent for the step JUST TAKEN, and `heading` is the heading AFTER that step's
 * rotation — so this is the seam's own arithmetic on the step's intent with the heading one
 * rotation later. It is a COVERAGE receipt, never an effect size.
 */
const coverageFactorOf = (
  headX: number, headY: number, dvx: number, dvy: number, topSpeed: number, depth: number,
): number => {
  const dl = Math.sqrt(dvx * dvx + dvy * dvy);
  let tx = dvx;
  let ty = dvy;
  if (dl > topSpeed && dl > 1e-8) { const s = topSpeed / dl; tx = dvx * s; ty = dvy * s; }
  const tl = Math.sqrt(tx * tx + ty * ty);
  if (!(tl > 1e-8)) return 1;
  return facingFactor(facingCosine(headX, headY, tx / tl, ty / tl), depth);
};
const COVERAGE_EPS = 1e-6;
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
/** ⭐⭐ PT-C0 (iii)'s delivery classifier and ground/measured tests, reused byte for byte. */
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
/** ⭐ THE 乱跑 FAMILY — DF-T1 §3's own classifier, REUSED VERBATIM (only the MARK arm is used). */
const FLIGHT_RETIRE_TICKS = 720;

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
/* ⭐⭐ THE φ ARITHMETIC (BF-C0's face, re-fixtured at this head) */
fx('phi.aheadIsZero', near(phiDegOf(1, 0, 3, 0), 0), true);
fx('phi.abeamIsNinety', near(phiDegOf(1, 0, 0, 2), 90), true);
fx('phi.behindIsOneEighty', near(phiDegOf(1, 0, -4, 0), 180), true);
fx('phi.signBlind', near(phiDegOf(1, 0, 1, 1), phiDegOf(1, 0, 1, -1)), true);
fx('phi.degenerateHeadingIsNaN', Number.isNaN(phiDegOf(0, 0, 1, 0)), true);
fx('phi.degenerateVelIsNaN', Number.isNaN(phiDegOf(1, 0, 0, 0)), true);
fx('phi.binOf44IsBelow45', binOf(44.9, PHI_BIN_DEG, NPHI) < BIN45, true);
fx('phi.binOf45IsTheCut', binOf(45, PHI_BIN_DEG, NPHI), BIN45);
fx('phi.binOf90IsTheCut', binOf(90, PHI_BIN_DEG, NPHI), BIN90);
fx('phi.binOf180IsTheLast', binOf(180, PHI_BIN_DEG, NPHI), NPHI - 1);
/* ⭐⭐ THE COVERAGE RECOMPUTATION, on CONSTRUCTED states — the seam's own arithmetic */
fx('coverage.shutBodyIsAlwaysOne', coverageFactorOf(1, 0, 0, 5, 8, 0), 1);
fx('coverage.aheadIsExactlyOne', coverageFactorOf(1, 0, 5, 0, 8, BF_DEPTH), 1);
fx('coverage.abeamIsTheFloor', near(coverageFactorOf(1, 0, 0, 5, 8, BF_DEPTH),
  BF_OFF_HEADING_FRACTION), true);
fx('coverage.behindIsTheFloor', near(coverageFactorOf(1, 0, -5, 0, 8, BF_DEPTH),
  BF_OFF_HEADING_FRACTION), true);
fx('coverage.saturatedIntentPaysTheSame',
  near(coverageFactorOf(1, 0, 0, 24, 8, BF_DEPTH), coverageFactorOf(1, 0, 0, 8, 8, BF_DEPTH)),
  true);
fx('coverage.clampDoesNotMoveTheDirection',
  near(coverageFactorOf(1, 0, 3, 4, 1, BF_DEPTH), coverageFactorOf(1, 0, 30, 40, 1, BF_DEPTH)),
  true);
fx('coverage.degenerateIntentIsOne', coverageFactorOf(1, 0, 0, 0, 8, BF_DEPTH), 1);
fx('coverage.rung60IsDeeper',
  coverageFactorOf(1, 0, 0, 5, 8, D_RUNG_60) < coverageFactorOf(1, 0, 0, 5, 8, BF_DEPTH), true);
fx('coverage.rung80IsShallower',
  coverageFactorOf(1, 0, 0, 5, 8, D_RUNG_80) > coverageFactorOf(1, 0, 0, 5, 8, BF_DEPTH), true);
fx('coverage.rung60FloorIsK60', near(coverageFactorOf(1, 0, 0, 5, 8, D_RUNG_60), K_RUNG_60), true);
fx('coverage.rung80FloorIsK80', near(coverageFactorOf(1, 0, 0, 5, 8, D_RUNG_80), K_RUNG_80), true);
fx('coverage.appliedTestIsStrict', coverageFactorOf(1, 0, 5, 0, 8, BF_DEPTH) < 1 - COVERAGE_EPS,
  false);
fx('coverage.smallAngleIsFlat', coverageFactorOf(1, 0, Math.cos(0.13), Math.sin(0.13), 8,
  BF_DEPTH) > 0.997, true);
/* ⭐⭐ THE DEPTH LADDER — the two rungs DERIVED from k, never typed as bare depths */
fx('depths.shippedIsOneMinusK', BF_DEPTH, 1 - BF_OFF_HEADING_FRACTION);
fx('depths.rung60', D_RUNG_60, 1 - K_RUNG_60);
fx('depths.rung80', D_RUNG_80, 1 - K_RUNG_80);
fx('depths.ladderIsOrdered', D_RUNG_80 < BF_DEPTH && BF_DEPTH < D_RUNG_60, true);
/* ⭐⭐ THE PAIRED Δ ARITHMETIC, on a constructed two-seed table (ratio-of-sums) */
{
  const nuS = [3, 5]; const deS = [2, 3]; const nuA = [4, 5]; const deA = [2, 2];
  const pS = ratio(sum(nuS), sum(deS));
  const pA = ratio(sum(nuA), sum(deA));
  fx('pairedDelta.ratioOfSumsShut', near(pS, 8 / 5), true);
  fx('pairedDelta.ratioOfSumsArmed', near(pA, 9 / 4), true);
  fx('pairedDelta.isArmedMinusShut', near(pA - pS, 9 / 4 - 8 / 5), true);
  fx('pairedDelta.emptyDenominatorIsNaN', Number.isNaN(ratio(1, 0)), true);
}
/* THE A4 LIMBS (PT-C0's own, reused) */
fx('spacing.nearestOfThree', near(nearestMateOf([0, 3, 10], [0, 4, 0], 0), 5), true);
fx('spacing.nearestSingleton', !Number.isFinite(nearestMateOf([1], [1], 0)), true);
fx('dupRun.noneAtSixMetres', dupRunPairsOf([0, 6, 12], [0, 0, 0]), 0);
fx('dupRun.onePairInsideFour', dupRunPairsOf([0, 3, 12], [0, 0, 0]), 1);
fx('dupRun.boundaryIsStrict', dupRunPairsOf([0, DUP_RUN_M], [0, 0]), 0);
fx('minPairwise.picksSmallest', near(minPairwiseOf([0, 3, 12], [0, 4, 0]), 5), true);
fx('minPairwise.singleton', !Number.isFinite(minPairwiseOf([1], [1])), true);
/* THE DELIVERY / GROUND / MEASURED PREDICATES and THE CONTACT CLASSES */
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
fx('sector.vocabularyIsTheUnions', SECTORS, ['front', 'side', 'back']);
/* THE BIN HELPER */
fx('binOf.first', binOf(0.4, 0.5, 61), 0);
fx('binOf.overflow', binOf(999, 0.5, 61), 60);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §8 THE FROZEN BINS AND GRIDS (frozen at the FREEZE COMMIT, before any seed)  */
/* ========================================================================== */
const NEAR_BIN_M = 0.5;
const NEAR_BINS = 61;
const MINPAIR_BIN_M = 0.5;
const MINPAIR_BINS = 61;

/* ========================================================================== */
/* §9 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))  */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots', 'saves',
  'tackles', 'dribbles', 'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls',
  'headersWon', 'passesForward', 'thirdMan', 'overlaps', 'bestPassChain'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  /* the world / depth / dose receipts */
  worldOk: boolean; armedVersion: number; bfFlag: boolean;
  depthAtKickoffOk: boolean; depthAlwaysOk: boolean; genomeClean: boolean;
  substitutions: number; subsSeenWithRightDepth: number;
  reassertChanged: number;
  ticks: number; matches: number; wallMs: number;
  /* the population */
  openPlayTicks: number; bodyTicks: number; movingTicks: number; movingSpeedSum: number;
  /* ⭐⭐ φ — BF-C0's faces reused: bins overall and by role */
  phiBins: number[]; phiSpeedSum: number[];
  rolePhiBins: number[][]; roleMovingTicks: number[];
  /* ⭐⭐ THE SCORED SPEED FACES — strict cuts, accumulated on the tick */
  sp90Sum: number; sp90N: number; sp15Sum: number; sp15N: number;
  /* ⭐ THE KEEPER's own row: GoalkeeperPosition × GK */
  gkPosSpeedSum: number; gkPosMisSpeedSum: number; gkDistance: number;
  /* ⭐⭐ THE LIVE COVERAGE OF THE PRICE (a READ, declared) */
  covN: number; covApplied: number; covFSum: number;
  /* ⭐ THE DF FACES — DF-T1 §3's instrument, REUSED VERBATIM */
  defTeamTicks: number; defenderTicks: number; markSwitches: number; markHeldTicks: number;
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
  worldOk: false, armedVersion: -1, bfFlag: false,
  depthAtKickoffOk: false, depthAlwaysOk: true, genomeClean: false,
  substitutions: 0, subsSeenWithRightDepth: 0, reassertChanged: 0,
  ticks: 0, matches: 1, wallMs: 0,
  openPlayTicks: 0, bodyTicks: 0, movingTicks: 0, movingSpeedSum: 0,
  phiBins: zeros(NPHI), phiSpeedSum: zeros(NPHI),
  rolePhiBins: zeros2(NROLE, NPHI), roleMovingTicks: zeros(NROLE),
  sp90Sum: 0, sp90N: 0, sp15Sum: 0, sp15N: 0,
  gkPosSpeedSum: 0, gkPosMisSpeedSum: 0, gkDistance: 0,
  covN: 0, covApplied: 0, covFSum: 0,
  defTeamTicks: 0, defenderTicks: 0, markSwitches: 0, markHeldTicks: 0,
  gpMeasured: 0, gpFlights: 0,
  contactClass: zeros(CONTACTS.length), recvSector: zeros(SECTORS.length), recvSectorN: 0,
  crowdSamples: 0, spacingSum: 0, spacingSamples: 0,
  dupRunSum: 0, crashHits: 0, minPairN: 0,
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  stats: emptyStats(),
});

/* ========================================================================== */
/* §10 THE WALK — one match; PURE per-tick reads of Match state, NO WRAPPER     */
/*     (the ONE write is the RUNG arms' declared match-local depth dose)        */
/* ========================================================================== */
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  contactGid: number | null; contactClass: ContactClass;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  recvSector: BodySector | null;
}
const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const wantDepth = DEPTH_OF[arm];
  const rung = isRung(arm);
  row.armedVersion = raArmedVersion(m);
  row.bfFlag = (m as unknown as { bfFacingCost: boolean }).bfFacingCost === true;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      raAccessWeight?: number; passLeadSupport?: number; dvExposureWeight?: number;
      rcAnticipationWeight?: number; facingDepth?: number; bfFacingCost?: number;
    };
    return g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined && g.rcAnticipationWeight === undefined
      && g.facingDepth === undefined && g.bfFacingCost === undefined;
  });
  const players = m.allPlayers;
  const depthOkNow = (): boolean => players.every((p) => p.facingDepth === wantDepth);
  row.depthAtKickoffOk = depthOkNow();
  row.worldOk = row.armedVersion === RA_WORLD_VERSION
    && row.bfFlag === wantsFlag(arm) && row.depthAtKickoffOk;
  const names = players.map((p) => p.name);

  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  const mm = m as unknown as {
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
  };
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let gp: GpFlight | null = null;
  /* the 乱跑 state — DF-T1 §3's own per-defender previous assignment */
  const prevMark = new Map<string, number | null>();
  const markKey = (side: number, index: number): string => `${side}:${index}`;

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
    /* ⭐⭐ THE RUNG DOSE, RE-ASSERTED — the shipped writer re-writes BF_DEPTH on every
       substitution, so the rung must win. Runs in BOTH the observed and the unobserved walk
       (it is a DOSE, not an observation — `gLockstep` therefore still compares like with
       like). Every re-assertion that CHANGED a value is COUNTED and PUBLISHED. */
    if (rung) row.reassertChanged += doseDepth(m, wantDepth);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    /* the substitution receipt: a substitute IS the pitch-slot object with a NEW identity */
    for (let i = 0; i < players.length; i++) {
      if (players[i].name !== names[i]) {
        names[i] = players[i].name;
        row.substitutions += 1;
        if (players[i].facingDepth === wantDepth) row.subsSeenWithRightDepth += 1;
      }
    }
    if (!depthOkNow()) row.depthAlwaysOk = false;

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

    if (playing) {
      row.openPlayTicks += 1;
      /* ---------- ⭐⭐ THE φ POPULATION AND THE LIVE COVERAGE ---------- */
      for (const p of players) {
        if (p.sentOff) continue;
        row.bodyTicks += 1;
        const vx = p.vel.x;
        const vy = p.vel.y;
        const sp = Math.sqrt(vx * vx + vy * vy);
        if (!(sp > MOVING_FLOOR)) continue;
        const phi = phiDegOf(p.heading.x, p.heading.y, vx, vy);
        if (!Number.isFinite(phi)) continue;
        row.movingTicks += 1;
        row.movingSpeedSum += sp;
        const b = binOf(phi, PHI_BIN_DEG, NPHI);
        const ro = RO_OF(p.role);
        row.phiBins[b] += 1;
        row.phiSpeedSum[b] += sp;
        row.rolePhiBins[ro][b] += 1;
        row.roleMovingTicks[ro] += 1;
        if (phi > 90) { row.sp90Sum += sp; row.sp90N += 1; }
        if (phi < 15) { row.sp15Sum += sp; row.sp15N += 1; }
        if (p.role === 'GK' && (p.action.type as string) === 'GoalkeeperPosition') {
          row.gkPosSpeedSum += sp;
          if (phi > 45) row.gkPosMisSpeedSum += sp;
        }
        /* ⭐⭐ THE COVERAGE READ — the seam's own arithmetic recomputed from public fields */
        row.covN += 1;
        const f = coverageFactorOf(p.heading.x, p.heading.y, p.desiredVel.x, p.desiredVel.y,
          p.topSpeed, p.facingDepth);
        row.covFSum += f;
        if (f < 1 - COVERAGE_EPS) row.covApplied += 1;
      }
      /* ---------- ⭐ THE DF FACES — DF-T1 §3's instrument, REUSED VERBATIM ---------- */
      for (const t of m.teams) {
        const side = t.side;
        const defending = m.possessionSide !== side;
        if (!defending) continue;
        row.defTeamTicks += 1;
        const outfield = t.players.filter((p) => p.role !== 'GK' && !p.sentOff);
        row.defenderTicks += outfield.length;
        for (const p of outfield) {
          const k = markKey(side, p.index);
          const cur2 = t.marks.has(p.index) ? (t.marks.get(p.index) as number) : null;
          const prev = prevMark.has(k) ? (prevMark.get(k) as number | null) : null;
          if (cur2 !== null) row.markHeldTicks += 1;
          if (prev !== null && cur2 !== null && prev !== cur2) row.markSwitches += 1;
          prevMark.set(k, cur2);
        }
      }
      /* ---------- (i) 挤人 — PT-C0's A4 limbs at the A4 battery's own cadence ---------- */
      if (tick % SAMPLE_EVERY === 0) {
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
    }

    /* ---------- (iii) THE GROUND-PASS RELEASE (PT-C0's own, the user's two faces) ---- */
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
        f.recvSector = ballAccessGeometry(players[f.targetGid], ball, CONTROL_RADIUS).sector;
      }
      if (d.interceptions[1 - f.passerSide] > 0) f.interceptedHere = true;
      if (!ballIsLive) f.wentDead = true;
      if (ball.owner !== null && ball.owner.gid !== f.passerGid) retireGp();
      else if (f.completedHere || f.interceptedHere || f.wentDead) retireGp();
      else if (tick - f.releaseTick > FLIGHT_RETIRE_TICKS) retireGp();
    }
  }
  retireGp();
  if (observe) {
    for (const t of m.teams) for (const p of t.players) if (p.role === 'GK') row.gkDistance += p.distance;
    const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
    for (const k of STAT_KEYS) row.stats[k] = st[0][k] + st[1][k];
  }
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
banner('BF-T1 — the lockstep receipt (observed vs unobserved, PER ARM; NO wrapper installed)');
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
 * ⭐ gArmsDiverge — the RECEIPT that the door demonstrably bites, PER PAIR. ⚠ SOME, not EVERY
 * (#364 item 1's ratified reading): a match in which no body ever moves off-heading past the
 * threshold may legally walk BYTE-IDENTICALLY in both arms. Requiring every seed to diverge
 * would conflate "the price can bite" with "the price bites every match". THE GATE IS ON THE
 * SCORED (E) PAIR ONLY; the other three pairs' counts are REPORTED whatever they are.
 */
const divergeByPair = PAIRS.map((p) => ({
  pair: p.key,
  diverged: LOCKSTEP_SEEDS.filter((seed) => {
    const s = lockstepRows.find((r) => r.seed === seed && r.arm === p.shut)!;
    const a = lockstepRows.find((r) => r.seed === seed && r.arm === p.armed)!;
    return s.observed !== a.observed;
  }),
}));
const ARMS_DIVERGE = (divergeByPair.find((r) => r.pair === 'E') as { diverged: number[] })
  .diverged.length > 0;

/* ========================================================================== */
/* §12 THE BATTERY — the SIX ARMS PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`BF-T1 — the battery: ${N} SHARED SEEDS × ${ARMS.length} arms (${N * ARMS.length} walks), `
  + `seeds ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const arm of ARMS) rows[arm] = walkMatch(buildMatch(seed, arm), arm, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `(${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const arm of ARMS) receiptRows[arm] = walkMatch(buildMatch(RECEIPT_SEED, arm), arm, true);
const walksBooked = cells.length * ARMS.length + ARMS.length;
const armRows = (arm: Arm): Row[] => cells.map((c) => c.rows[arm]);

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over the SHARED seeds (consumes NO stats) */
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

/* ---- (a1)/(a2) THE SCORED SPEED FACES — BF-C0's φ face, cut on the shipped floor ---- */
defFace('speed.meanMps.phiAbove90', 'm/s', 'SCORED (a1)',
  '⭐⭐ (a1) THE PRICE BITES: the MEAN SPEED of MOVING open-play body-ticks whose φ (the angle '
  + 'between `heading` and `vel`, BF-C0 §P.A\'s face) is STRICTLY ABOVE 90°. ⚠ A SELECTION '
  + 'statistic — who is in the bin can change under the law',
  (r) => r.sp90Sum, (r) => r.sp90N);
defFace('speed.meanMps.phiBelow15', 'm/s', 'SCORED (a2)',
  '⭐⭐ (a2) THE FLAT SHAPE ON THE PITCH: the MEAN SPEED of MOVING open-play body-ticks whose '
  + 'φ is STRICTLY BELOW 15°. ⚠ Also a SELECTION statistic',
  (r) => r.sp15Sum, (r) => r.sp15N);
/* ---- (b1)/(b2)/(b3) THE SCORED DO-NO-HARM FACES ---- */
defFace('goalsPerMatch', 'goals per match (240 s match clock)', 'SCORED (b1)',
  '⭐ (b1) GOALS — both sides, the engine\'s own counter; a BAND rule [−0.30, +0.30]',
  (r) => r.stats.goals, (r) => r.matches);
defFace('passCompletion', 'share', 'SCORED (b2)',
  '⭐ (b2) COMPLETION — the ENGINE\'s own whole-match completion over ALL deliveries',
  (r) => r.stats.passesCompleted, (r) => r.stats.passes);
defFace('interceptionsPerMatch', 'interceptions per match (240 s match clock)', 'SCORED (b3)',
  '⭐ (b3) INTERCEPTIONS — the MATCH TOTAL (⚠ BOTH sides carry the price in the armed arms, '
  + 'so every interception is conceded by a side whose bodies are priced). STATED',
  (r) => r.stats.interceptions, (r) => r.matches);
/* ---- ⭐⭐ THE LIVE COVERAGE OF THE PRICE (#376 §CORR 6) — REPORTED, a READ ---- */
defFace('coverage.appliedShare', 'share of moving open-play body-ticks', 'REPORTED coverage',
  '⭐⭐ THE LIVE COVERAGE: the share of MOVING ticks on which the factor recomputed from '
  + '`heading` and the CLAMPED intent is < 1 − 1e-6. ⛔ PLUMBING, never an effect size',
  (r) => r.covApplied, (r) => r.covN);
defFace('coverage.meanFactor', 'factor (1 = no price)', 'REPORTED coverage',
  '⭐⭐ THE MEAN FACTOR APPLIED over the same moving ticks. ⛔ PLUMBING',
  (r) => r.covFSum, (r) => r.covN);
/* ---- ⭐ THE MISALIGNMENT SHARES THEMSELVES (BF-C0's faces, reused) ---- */
const phiAtOrAbove = (r: Row, b: number): number => sum(r.phiBins.slice(b));
const rolePhiAtOrAbove = (r: Row, ro: number, b: number): number => sum(r.rolePhiBins[ro].slice(b));
defFace('misalign.share45', 'share of moving open-play body-ticks', 'REPORTED misalignment',
  '⭐ φ > 45° — BF-C0 §P.B\'s headline, re-measured (45° is the LOWER EDGE of stored φ bin 3, '
  + 'so the cut needs no interpolation)',
  (r) => phiAtOrAbove(r, BIN45), (r) => r.movingTicks);
defFace('misalign.share90', 'share of moving open-play body-ticks', 'REPORTED misalignment',
  '⭐ φ > 90° — BF-C0\'s BACKPEDAL SHARE, re-measured (90° is the LOWER EDGE of stored bin 6)',
  (r) => phiAtOrAbove(r, BIN90), (r) => r.movingTicks);
for (let ro = 0; ro < NROLE; ro++) {
  const R = ROLES[ro];
  defFace(`misalign.role.${R}.share45`, 'share of that role\'s moving ticks',
    'REPORTED misalignment', `φ > 45° for role ${R} (BF-C0 §R1's by-role table, reused)`,
    (r) => rolePhiAtOrAbove(r, ro, BIN45), (r) => r.roleMovingTicks[ro]);
  defFace(`misalign.role.${R}.share90`, 'share of that role\'s moving ticks',
    'REPORTED misalignment', `φ > 90° for role ${R} (BF-C0 §R1's by-role table, reused)`,
    (r) => rolePhiAtOrAbove(r, ro, BIN90), (r) => r.roleMovingTicks[ro]);
}
for (let b = 0; b < NPHI; b++) {
  const lo = b * PHI_BIN_DEG;
  defFace(`phi.bin${b}.share`, 'share of moving open-play body-ticks', 'REPORTED φ bins',
    `the share of moving ticks in the stored φ bin [${lo}°, ${lo + PHI_BIN_DEG}°)`,
    (r) => r.phiBins[b], (r) => r.movingTicks);
  defFace(`phi.bin${b}.meanSpeedMps`, 'm/s', 'REPORTED φ bins',
    `⭐ THE MEAN SPEED IN φ BIN [${lo}°, ${lo + PHI_BIN_DEG}°) — BF-C0 §R1's envelope row, `
    + 'reused. ⚠ A SELECTION statistic (BF-C0 HONEST LIMITS 3), not an envelope test',
    (r) => r.phiSpeedSum[b], (r) => r.phiBins[b]);
}
/* ---- ⭐ THE KEEPER FACES ---- */
defFace('keeper.savesPerMatch', 'saves per match (240 s match clock)', 'REPORTED keeper',
  'the engine\'s own `saves` counter, BOTH teams', (r) => r.stats.saves, (r) => r.matches);
defFace('keeper.gkMetresPerKeeperPerMatch', 'metres per keeper per match (240 s match clock)',
  'REPORTED keeper',
  '⭐ the GK\'s own `distance` at full time, summed over the TWO keepers and divided by TWO '
  + 'keeper-matches — the ground he covers',
  (r) => r.gkDistance, (r) => r.matches * 2);
defFace('keeper.gkPositionMisalignedMetresPerMatch', 'metres per match (240 s match clock)',
  'REPORTED keeper',
  '⭐⭐ `GoalkeeperPosition` × GK\'s MISALIGNED metres — Σ|vel| over that row\'s moving ticks '
  + 'with φ > 45°, × DT (BF-C0 §R2\'s biggest exposure row, re-measured)',
  (r) => r.gkPosMisSpeedSum * DT, (r) => r.matches);
defFace('keeper.gkPositionMetresPerMatch', 'metres per match (240 s match clock)',
  'REPORTED keeper', 'the same row\'s TOTAL moving metres (the denominator beside it)',
  (r) => r.gkPosSpeedSum * DT, (r) => r.matches);
/* ---- ⭐ THE DF FACES — DF-T1 §3 / DF-C0 §R2's definitions, REUSED VERBATIM ---- */
defFace('df.markSwitchesPerDefenderMinute', 'switches per defender-minute (60 sim-s a body '
  + 'spent out of possession)', 'REPORTED defence',
  '⭐⭐ 乱跑 ITSELF — a marker\'s assigned man CHANGES (DF-C0 §R2\'s definition, DF-T1 §3\'s '
  + 'instrument, REUSED VERBATIM and anchored)',
  (r) => r.markSwitches, (r) => (r.defenderTicks * DT) / 60);
defFace('df.markHeldShare', 'share of defender body-ticks', 'REPORTED defence',
  '⭐ MARKING COVERAGE — how much of his defending life a body actually HAS a mark (DF-T1 §8\'s '
  + 'own face)', (r) => r.markHeldTicks, (r) => r.defenderTicks);
defFace('df.tacklesPerMatch', 'tackles per match (240 s match clock)', 'REPORTED defence',
  'the engine\'s own `tackles` counter, both sides — the CONTACT half of the defensive pair',
  (r) => r.stats.tackles, (r) => r.matches);
/* ---- ⭐⭐ THE USER'S THREE FACES (PT-C0's own code, reused) ---- */
defFace('contact.opponentFirstContactShare', 'share of measured ground passes',
  'REPORTED user face',
  '⭐⭐ 「传到对面身上」 — of every MEASURED GROUND PASS, the share whose FIRST body contact '
  + 'after the release is an OPPONENT (PT-C0 (iii)\'s classes, reused)',
  (r) => r.contactClass[CTI('opponent')], (r) => r.gpFlights);
for (const s of SECTORS) {
  defFace(`contact.receiver${s[0].toUpperCase()}${s.slice(1)}ShareCompleted`,
    'share of completed measured ground passes', 'REPORTED user face',
    `⭐⭐ 「${s === 'side' ? '侧身接球' : s}」 — the receiver's facing SECTOR at his FIRST TOUCH `
    + 'on COMPLETED passes (the BK `BodySector` classifier CALLED)',
    (r) => r.recvSector[SECTORS.indexOf(s)], (r) => r.recvSectorN);
}
defFace('crowd.crashShare', 'share of sampled open-play ticks with an attributable side',
  'REPORTED user face',
  '⭐⭐ 「挤人」 — the share of samples whose MINIMUM PAIRWISE attacking-outfield distance is '
  + `below DUP_RUN_M = ${DUP_RUN_M} m (PT-C0 (i)'s A4 limb, anchored constants)`,
  (r) => r.crashHits, (r) => r.minPairN);
defFace('crowd.dupRunPairsPerSample', 'duplicate-run pairs per sample', 'REPORTED user face',
  'the A4 dup-run limb beside it', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres', 'REPORTED user face',
  'the A4 spacing limb beside it', (r) => r.spacingSum, (r) => r.spacingSamples);
/* ---- ⭐ E4 (RC-T1a's anchored definitions, reused) + shots ---- */
defFace('e4.forwardPassShare', 'share', 'REPORTED E4',
  '⭐ E4 — `mt-ladder.ts`\'s OWN definition, anchored and reused: passesForward / passes',
  (r) => r.stats.passesForward, (r) => r.stats.passes);
defFace('e4.thirdManPerMatch', 'releases per match (240 s match clock)', 'REPORTED E4',
  'the engine\'s own completed third-man release counter (anchored)',
  (r) => r.stats.thirdMan, (r) => r.matches);
defFace('e4.overlapsPerMatch', 'releases per match (240 s match clock)', 'REPORTED E4',
  'the engine\'s own completed overlap release counter (anchored)',
  (r) => r.stats.overlaps, (r) => r.matches);
defFace('e4.bestPassChainMeanPerTeam', 'passes (longest completed-pass chain in one move)',
  'REPORTED E4',
  '⭐ the engine\'s OWN possession-chain ledger `bestPassChain`, over TWO team-matches',
  (r) => r.stats.bestPassChain, (r) => r.matches * 2);
defFace('shotsPerMatch', 'shots per match (240 s match clock)', 'REPORTED E4',
  'the engine\'s own `shots` counter, both sides', (r) => r.stats.shots, (r) => r.matches);
/* ---- CONTEXT (rates on the 240 s match clock) ---- */
defFace('context.groundPassesPerMatch', 'measured ground passes per match (240 s match clock)',
  'REPORTED context', 'PT-C0\'s own measured-ground-pass population',
  (r) => r.gpMeasured, (r) => r.matches);
defFace('context.carriesPerMatch', 'carries per match (240 s match clock)', 'REPORTED context',
  'the engine\'s own `dribbles` counter (a CARRY push), both sides',
  (r) => r.stats.dribbles, (r) => r.matches);
defFace('context.movingTicksPerMatch', 'moving body-ticks per match (240 s match clock)',
  'REPORTED context', 'the population\'s own size', (r) => r.movingTicks, (r) => r.matches);
defFace('context.metresPerMatch', 'metres per match (240 s match clock)', 'REPORTED context',
  'Σ|vel| over moving ticks × DT — the ground the world covers while moving',
  (r) => r.movingSpeedSum * DT, (r) => r.matches);
defFace('context.meanSpeedMps', 'm/s', 'REPORTED context',
  'the mean speed over every moving tick', (r) => r.movingSpeedSum, (r) => r.movingTicks);
defFace('context.movingShareOfBodyTicks', 'share of open-play body-ticks', 'REPORTED context',
  'how much of open play is above the shipped 0.5 m/s floor',
  (r) => r.movingTicks, (r) => r.bodyTicks);
defFace('context.openPlayTicksPerMatch', 'open-play ticks per match (240 s match clock)',
  'REPORTED context', 'the open-play clock itself', (r) => r.openPlayTicks, (r) => r.matches);
/* ---- RECEIPTS (⛔ PLUMBING, never effect sizes) ---- */
defFace('receipt.substitutionsPerMatch', 'substitutions per match', 'RECEIPT (plumbing)',
  '⛔ PLUMBING: identity changes observed in a pitch slot (`becomeSub`)',
  (r) => r.substitutions, (r) => r.matches);
defFace('receipt.rungReassertionsChangedPerMatch', 'values changed per match',
  'RECEIPT (plumbing)',
  '⛔ PLUMBING, and the RUNG ARMS\' OWN HONESTY RECEIPT: how many per-step re-assertions '
  + 'actually CHANGED a body\'s `facingDepth` (non-zero only where the shipped writer had '
  + 'just re-written BF_DEPTH on a substitution)',
  (r) => r.reassertChanged, (r) => r.matches);
const FACE_KEYS = Object.keys(FACES);

interface FaceRow {
  face: string; arm: Arm; unit: string; group: string; what: string;
  value: number; numerator: number; denominator: number;
  ciLo: number; ciHi: number; halfWidth: number;
}
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
  if (f === undefined) { banner(`BF-T1 FATAL — unknown face ${arm}.${k}`); process.exit(3); }
  return f!;
};

/** ⭐ THE PAIRED Δ — armed − shut inside the SAME resampled seed set (the RC-T1a estimator) */
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
  /* ⭐ LOO sensitivity (the #346/#348 orders), the CONSERVATIVE POINT-SHIFT form, STATED */
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

/* ⭐⭐ THE FIVE FROZEN H-BF.1 RULES (§P.C, in exact form; the DECLARED TARGETS are literals) */
const TARGET_A2_MPS = -0.05;
const TARGET_B1_BAND = 0.30;
const TARGET_B2_COMPLETION = -0.010;
const TARGET_B3_INTERCEPTIONS = 1.0;
const RULE_A1 = (d: { ciLo: number; ciHi: number }): boolean => d.ciHi < 0;
const RULE_A2 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciHi < TARGET_A2_MPS);
const RULE_B1 = (d: { ciLo: number; ciHi: number }): boolean =>
  !(d.ciLo > TARGET_B1_BAND || d.ciHi < -TARGET_B1_BAND);
const RULE_B2 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciHi < TARGET_B2_COMPLETION);
const RULE_B3 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciLo > TARGET_B3_INTERCEPTIONS);

const SCORED_RULES: Record<string, (d: { ciLo: number; ciHi: number }) => boolean> = {
  'E|speed.meanMps.phiAbove90': RULE_A1,
  'E|speed.meanMps.phiBelow15': RULE_A2,
  'E|goalsPerMatch': RULE_B1,
  'E|passCompletion': RULE_B2,
  'E|interceptionsPerMatch': RULE_B3,
};
const deltas: DeltaRow[] = [];
for (const p of PAIRS) {
  for (const key of FACE_KEYS) {
    deltas.push(pairedDelta(key, p.key, SCORED_RULES[`${p.key}|${key}`] ?? null));
  }
}
const delta = (pairKey: string, k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k && x.pair === pairKey);
  if (d === undefined) { banner(`BF-T1 FATAL — unknown delta ${pairKey}.${k}`); process.exit(3); }
  return d!;
};

/* ========================================================================== */
/* §14 H-BF.1 — THE FROZEN RULES APPLIED; THE VERDICT WORD IS PRINTED BY THEM   */
/* ========================================================================== */
const dA1 = delta('E', 'speed.meanMps.phiAbove90');
const dA2 = delta('E', 'speed.meanMps.phiBelow15');
const dB1 = delta('E', 'goalsPerMatch');
const dB2 = delta('E', 'passCompletion');
const dB3 = delta('E', 'interceptionsPerMatch');
const A1_VERDICT: 'FALLS' | 'DOES-NOT-FALL' = RULE_A1(dA1) ? 'FALLS' : 'DOES-NOT-FALL';
const A2_VERDICT: 'HOLDS' | 'DOES-NOT-HOLD' = RULE_A2(dA2) ? 'HOLDS' : 'DOES-NOT-HOLD';
const B1_VERDICT: 'WITHIN-BAND' | 'OUTSIDE-BAND' = RULE_B1(dB1) ? 'WITHIN-BAND' : 'OUTSIDE-BAND';
const B2_VERDICT: 'DOES-NOT-FALL' | 'FALLS' = RULE_B2(dB2) ? 'DOES-NOT-FALL' : 'FALLS';
const B3_VERDICT: 'DOES-NOT-RISE' | 'RISES' = RULE_B3(dB3) ? 'DOES-NOT-RISE' : 'RISES';
const H_BF1: 'PASS' | 'FAIL' =
  A1_VERDICT === 'FALLS' && A2_VERDICT === 'HOLDS' && B1_VERDICT === 'WITHIN-BAND'
    && B2_VERDICT === 'DOES-NOT-FALL' && B3_VERDICT === 'DOES-NOT-RISE' ? 'PASS' : 'FAIL';
const A_LIMB_OK = A1_VERDICT === 'FALLS' && A2_VERDICT === 'HOLDS';
const B_LIMB_OK = B1_VERDICT === 'WITHIN-BAND' && B2_VERDICT === 'DOES-NOT-FALL'
  && B3_VERDICT === 'DOES-NOT-RISE';

/* ========================================================================== */
/* §14b THE PRE-COMMITTED READS — FROZEN LITERALS, SELECTED ON STORED BOOLEANS  */
/* ========================================================================== */
/** ⭐⭐ #377 item 3's sentences, FROZEN AS LITERALS at the freeze commit. ⛔ Selection is on
 *  stored booleans only; NO tie-break is ever invented after sight. */
const READ_PASS = 'BF-T1 BANKS; THE RC ARC RESUMES WITH RC-T0b (the READY limb on the priced '
  + 'body); a BF entry (world 13) is a CANDIDATE decided WITH the RC entry, not alone.';
const READ_A_FAILS = 'THE LAW DOES NOT BITE WHERE THE CENSUS SAID — THE FORM RETURNS TO THE '
  + 'COMMANDER WITH NUMBERS (the coverage face first).';
const READ_B_FAILS = 'THE PRICE COSTS FOOTBALL — THE ARC PAUSES AT THE USER\'S FORK WITH THE '
  + 'k = 0.80 RUNG NAMED.';
const READS_PRINTED: string[] = [
  ...(H_BF1 === 'PASS' ? [READ_PASS] : []),
  ...(!A_LIMB_OK ? [READ_A_FAILS] : []),
  ...(!B_LIMB_OK ? [READ_B_FAILS] : []),
];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form, from THIS exam's own scratch smoke   */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** ⭐ THE SCRATCH SMOKE's own realised PAIRED-Δ half-widths (12 seeds, 900,002,500–511;
 *  §DEV-PREFLIGHT), read out of the smoke artifact's own `deltas[].halfWidth` fields —
 *  NEVER re-typed from the console's rounded print. HARDCODED here at the FREEZE COMMIT. */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number }[] = [
  { face: 'speed.meanMps.phiAbove90', group: '(a1)',
    hwSmoke: 0.048530357461394, target: 0.10 },
  { face: 'speed.meanMps.phiBelow15', group: '(a2)',
    hwSmoke: 0.033452432886839745, target: 0.05 },
  { face: 'goalsPerMatch', group: '(b1)', hwSmoke: 1.125, target: 0.30 },
  { face: 'passCompletion', group: '(b2)',
    hwSmoke: 0.04541721087723816, target: 0.010 },
  { face: 'interceptionsPerMatch', group: '(b3)',
    hwSmoke: 3.166666666666668, target: 1.0 },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  const hwRealised = delta('E', r.face).halfWidth;
  return {
    ...r, smokeClusters: SMOKE_N, seSmoke, seNeeded, nRequired,
    expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen: hwAtN * ZSUM / Z975,
    mdeAtRealisedHw: hwRealised * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);

/* ========================================================================== */
/* §16 THE GATES — liveness / receipt ONLY, NEVER direction; all stored         */
/* ========================================================================== */
const allRows: Row[] = [...ARMS.flatMap((a) => armRows(a)), ...ARMS.map((a) => receiptRows[a])];
const rowsOf = (arm: Arm): Row[] => [...armRows(arm), receiptRows[arm]];
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const scoredDeltas = deltas.filter((d) => d.looScored);
const LOO_OK = scoredDeltas.length === Object.keys(SCORED_RULES).length
  && scoredDeltas.every((d) => Number.isInteger(d.looFlips) && d.looFlips >= 0);
const subsTotal = (arm: Arm): number => sum(rowsOf(arm).map((r) => r.substitutions));
const subsRightDepth = (arm: Arm): number => sum(rowsOf(arm).map((r) => r.subsSeenWithRightDepth));
const reassertTotal = (arm: Arm): number => sum(rowsOf(arm).map((r) => r.reassertChanged));
const BODY_SCHEMA = [
  'stage', 'arms', 'definitions', 'doseSource', 'anchoredSites', 'fixtures', 'lockstep',
  'armsDiverge', 'sizing', 'gates', 'faces', 'deltas', 'hBF1', 'precommittedReads',
  'bins', 'roles', 'contactClasses', 'sectors', 'seeds', 'stats', 'perf', 'honestLimits',
] as const;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: allRows.every((r) => r.worldOk) && allRows.every((r) => r.depthAlwaysOk),
    note: `⭐ on EVERY walked match of ALL ${ARMS.length} arms (plus the construction receipt): `
      + `\`raArmedVersion\` = ${RA_WORLD_VERSION}; the \`bfFacingCost\` construction flag matches `
      + 'its OWN arm (absent on E-SHUT/D-SHUT, present on the four priced arms); and EVERY body '
      + 'carries its arm\'s declared `facingDepth` AT KICKOFF and AT EVERY OBSERVED TICK — '
      + ARMS.map((a) => `${a} = ${DEPTH_OF[a]}`).join(' · ')
      + `. Substitutions OBSERVED: `
      + ARMS.map((a) => `${a} ${subsRightDepth(a)}/${subsTotal(a)}`).join(' · ')
      + ' (identity changes in a pitch slot, each seen carrying its arm\'s depth). ⭐ every '
      + 'count in this note is DERIVED from the same rows the gate checks (canon: gate notes '
      + 'derive)',
  },
  gGenomeClean: {
    ok: allRows.every((r) => r.genomeClean),
    note: '⛔ the FRANCHISE genome (`info.genome`) carries NO exam gene and NO facing field on '
      + 'any walked match — canon: dose placement (ruling #270.2 / #334 item 1). ⭐⭐ THE RUNG '
      + 'DOSE IS WRITTEN ON THE BODY\'S PUBLIC `facingDepth` — the very object and field the '
      + 'SHIPPED writer `Match.setFacingDepth()` itself targets — and NEVER in `info.genome`',
  },
  gDoseSource: {
    ok: DOSE_BYTES_MATCH && DOSED_ARM_REACHABLE
      && L3_DOSE_BYTES_SHA.length === 64 && PC_DOSE_BYTES_SHA.length === 64,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field". The DOSED arms take their doses from the SHIPPED LOADERS '
      + '(`loadL3Dose` / `loadPcDose`, CALLED, exactly as PT-C0 arm A did); this gate HASHES '
      + `the bytes read from ${L3_DOSE_FILE} and ${PC_DOSE_FILE} and compares them to the two `
      + 'PINNED expected values READ OF RECORD from PT-C0\'s own artifact `doseSource.files`. '
      + `Pooled: ${L3_CELLS_POOLED} L3 cells, ${PC_ROWS_POOLED} PC rows, both NON-EMPTY. `
      + '⛔ On any mismatch the instrument REFUSES TO RUN — a dose is never approximated',
  },
  gRungReassert: {
    ok: reassertTotal('E-SHUT') === 0 && reassertTotal('E-ARMED') === 0
      && reassertTotal('D-SHUT') === 0 && reassertTotal('D-ARMED') === 0
      && rowsOf('E-k60').every((r) => r.depthAlwaysOk)
      && rowsOf('E-k80').every((r) => r.depthAlwaysOk),
    note: '⭐⭐ THE RUNG ARMS\' OWN HONESTY RECEIPT, PUBLISHED: the k-rungs re-assert their '
      + 'match-local depth after EVERY step, and the number of re-assertions that actually '
      + `CHANGED a value is ${reassertTotal('E-k60')} on E-k60 and ${reassertTotal('E-k80')} on `
      + 'E-k80 over every walked match (a non-zero count is the SHIPPED writer having just '
      + 're-written BF_DEPTH on a substitution — the re-assertion winning is exactly what this '
      + 'arm needs). ⭐ THE FOUR NON-RUNG ARMS RUN NO DOSE WRITE AT ALL (0 by construction: the '
      + 'writer is not called), so on E-ARMED the SHIPPED writer ALONE holds BF_DEPTH through '
      + `${subsTotal('E-ARMED')} observed substitutions — OBSERVED, not assumed. ⛔ PLUMBING, `
      + 'never direction',
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: `${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} anchored sites matched at `
      + 'their EXACT expected occurrence counts with 1-based line receipts stored. Extracted '
      + `values in play: BF_OFF_HEADING_FRACTION ${BF_OFF_HEADING_FRACTION} · BF_DEPTH `
      + `${BF_DEPTH} · TURN_RATE ${TURN_RATE} · ACCEL ${ACCEL} · DT ${DT} · AI_INTERVAL `
      + `${AI_INTERVAL} · MATCH_DURATION ${MATCH_DURATION} · DUP_RUN_M ${DUP_RUN_M} · `
      + `SAMPLE_EVERY ${SAMPLE_EVERY} · roles [${ROLES.join(', ')}] · sectors `
      + `[${SECTORS.join(', ')}]. The SEAM'S ORDER is pinned line by line in the order it runs `
      + '(clamp → facing → stun → accel), the shipped 0.5 m/s heading-follow floor the '
      + 'population is cut on is pinned, the shipped depth writer and its three call sites are '
      + 'pinned, and the DF 乱跑 and E4 definition lines are pinned at their own homes. ⭐ every '
      + 'count in this note is DERIVED from the same pinned values the gate checks (canon: gate '
      + 'notes derive)',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures: the φ arithmetic and both stored-bin cuts, THE COVERAGE RECOMPUTATION on '
      + 'CONSTRUCTED states (ahead ⇒ exactly 1, abeam and behind ⇒ the floor k, a 3× saturated '
      + 'intent pays the SAME as a 1× intent, the direction never moves, the two rungs bracket '
      + 'the shipped depth), the DEPTH LADDER derived from k, THE PAIRED Δ ARITHMETIC on a '
      + 'constructed two-seed table, the A4 spacing/dup-run/min-pairwise limbs, the '
      + 'delivery/ground/measurable predicates, the first-contact classes, the BK `BodySector` '
      + 'classifier CALLED on constructed geometries, and the bin helper',
  },
  gArmsDiverge: {
    ok: ARMS_DIVERGE,
    note: '⭐ the RECEIPT that the price demonstrably bites, PER PAIR: '
      + divergeByPair.map((r) => `${r.pair} diverged on ${r.diverged.length}/`
        + `${LOCKSTEP_SEEDS.length} scratch seeds`).join(' · ')
      + '. ⚠ SOME, not EVERY (#364 item 1\'s reading) — a match in which no body ever moves '
      + 'off-heading past the threshold may walk BYTE-IDENTICALLY in both arms, which is LEGAL. '
      + '⭐ ONLY THE SCORED (E) PAIR IS GATED; the dosed pair and the two rungs are REPORTED '
      + 'whatever they are. An INSTRUMENT receipt, never a finding',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((a) => sum(rowsOf(a).map((r) => r.movingTicks)) > 0
      && sum(rowsOf(a).map((r) => r.sp90N)) > 0
      && sum(rowsOf(a).map((r) => r.sp15N)) > 0
      && sum(rowsOf(a).map((r) => r.gpFlights)) > 0
      && sum(rowsOf(a).map((r) => r.recvSectorN)) > 0
      && sum(rowsOf(a).map((r) => r.minPairN)) > 0
      && sum(rowsOf(a).map((r) => r.defenderTicks)) > 0
      && ROLES.every((_, ro) => sum(rowsOf(a).map((r) => r.roleMovingTicks[ro])) > 0))
      && (['E-ARMED', 'D-ARMED', 'E-k60', 'E-k80'] as const)
        .every((a) => sum(rowsOf(a).map((r) => r.covApplied)) > 0)
      && (['E-SHUT', 'D-SHUT'] as const)
        .every((a) => sum(rowsOf(a).map((r) => r.covApplied)) === 0),
    note: '⛔ no face on an empty cell: in EVERY arm the moving population, the φ > 90° class, '
      + 'the φ < 15° class, EVERY ROLE, the measured ground-pass population, the completed-pass '
      + 'facing sample, the crowd sample and the defender population are all LIVE. ⭐ AND THE '
      + 'COVERAGE FACE IS NON-EMPTY ON EVERY ARMED ARM while it is EXACTLY ZERO on both SHUT '
      + 'arms (`facingDepth` 0 ⇒ the factor is identically 1) — liveness both ways, never '
      + 'direction',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THERE IS NO WRAPPER AT ALL: observation is pure per-tick reads of Match state, '
      + `and ${lockstepRows.length} observed-vs-unobserved arm-walks on out-of-band scratch `
      + `(${LOCKSTEP_SEEDS.join(', ')}) are BYTE-IDENTICAL. ⚠ The RUNG arms' declared per-step `
      + 'DOSE write runs in BOTH the observed and the unobserved walk, so lockstep compares '
      + 'like with like there too — canon: verifier scratch seeds',
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === '',
    note: '⛔ X-SRC-ZERO: worktree-vs-HEAD over `src/` EMPTY BOTH WAYS (canon: xSrcUntouched — '
      + '`git diff --stat HEAD -- src` AND `git status --porcelain -- src`). The law under exam '
      + 'is already in the tree with its own 20-pin suite; this exam adds nothing there',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && !walkedSeeds.includes(RECEIPT_SEED)
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && LOCKSTEP_SEEDS.every((s) => s >= 900_000_000)),
    note: `BOOKED = WALKED: ${walkedSeeds.length} battery seeds, each walked EXACTLY ONCE PER `
      + `ARM (${ARMS.length} arms) plus the construction-receipt seed ${RECEIPT_SEED} in all `
      + `${ARMS.length} arms = ${walksBooked} walks. THE BLOCK'S OWN PARTITION, disjoint by `
      + `construction: battery ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]} · `
      + `receipt ${RECEIPT_SEED}. Lockstep on OUT-OF-BAND scratch `
      + `(${LOCKSTEP_SEEDS.join(', ')}); the sizing smoke on scratch 900,002,500–511 — canon: `
      + 'verifier scratch seeds',
  },
  gN: {
    ok: SIZING_OK && N_FROZEN <= N_MAX_SEEDS && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? `THE OVERRIDE ARM: declared (${OVERRIDE_REASONS.join(', ')}), n = ${cells.length} as `
        + 'declared, artifact off every canonical path'
      : 'THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = '
        + `${N_FROZEN} shared seeds (the block affords ${N_MAX_SEEDS} once the construction `
        + 'receipt is reserved)',
  },
  gLOO: {
    ok: LOO_OK,
    note: '⭐ every SCORED Δ carries its LOO flip count (the #346/#348 orders): '
      + scoredDeltas.map((d) => `${d.pair}.${d.key} = ${d.looFlips}`).join(' · ')
      + '. ⚠ the flip read uses the CONSERVATIVE POINT-SHIFT form (the interval translated by '
      + 'each dropped seed\'s influence) — stated, never hidden. ⛔ The DOSED pair and the two '
      + 'RUNGS carry no scored rule and therefore no flip count: they are REPORTED',
  },
  gHashOrder: {
    ok: BODY_SCHEMA.length === new Set(BODY_SCHEMA).size
      && faces.length === FACE_KEYS.length * ARMS.length
      && deltas.length === FACE_KEYS.length * PAIRS.length
      && (H_BF1 === 'PASS' || H_BF1 === 'FAIL')
      && READS_PRINTED.length > 0,
    note: '⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
      + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
      + `body is the ${BODY_SCHEMA.length} named keys and nothing else, each name DISTINCT; the `
      + `${faces.length} face rows, the ${deltas.length} Δ rows, the verdict word ${H_BF1} and `
      + `the ${READS_PRINTED.length} printed read sentence(s) all EXIST before it. ⭐⭐ canon, `
      + 'VERBATIM: "the body hash is computed after every body key is assigned, and a NON-body '
      + 'receipt field records that the hash reproduces from the written file" — the hash runs '
      + 'at §19b, AFTER `gates.gFaces` is assigned and AFTER `artifact.gates = gates`, and '
      + '`receipts.hashReproducesFromFile` (OUTSIDE the schema) records the reproduction. '
      + 'Non-schema keys are the declared receipt/cell tier (`allGreen`, `perSeedCells`, '
      + '`constructionReceipt`, `gFacesDetail`, `receipts`, `hashedBodySha256`)',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — per-seed × per-arm cells, stored bins, the allowlist body */
/*     COMPACT JSON — canon, VERBATIM: "an artifact is written as compact JSON — no            */
/*     indentation; the hash is over the canonical body regardless; pretty-printing is a       */
/*     reader's tool, not a storage form" (home: ruling #372 item 5)                           */
/* ========================================================================== */
const pooled = (arm: Arm): {
  phiTicks: number[]; rolePhiTicks: number[][];
  contactClass: number[]; receiverSector: number[];
  nearestMateMetres: number[]; minPairwiseMetres: number[];
} => {
  const ph = zeros(NPHI);
  const rp = zeros2(NROLE, NPHI);
  const cc = zeros(CONTACTS.length);
  const rs = zeros(SECTORS.length);
  const ne = zeros(NEAR_BINS);
  const mp = zeros(MINPAIR_BINS);
  for (const r of armRows(arm)) {
    addInto(ph, r.phiBins); addInto2(rp, r.rolePhiBins);
    addInto(cc, r.contactClass); addInto(rs, r.recvSector);
    addInto(ne, r.nearBins); addInto(mp, r.minPairBins);
  }
  return {
    phiTicks: ph, rolePhiTicks: rp, contactClass: cc, receiverSector: rs,
    nearestMateMetres: ne, minPairwiseMetres: mp,
  };
};
const pooledByArm = Object.fromEntries(ARMS.map((a) => [a, pooled(a)])) as
  Record<Arm, ReturnType<typeof pooled>>;

/** ⭐ THE HONEST LIMITS — canon, VERBATIM: "a stage doc's HONEST LIMITS list is the ONE home;
 *  the artifact stores that list verbatim or stores none" (home: RC-C0-COOPERATION-CENSUS.md
 *  §COMMANDER CORRECTIONS item 3, ruling #367 item 3). ⇒ STORES NONE. */
const HONEST_LIMITS_NOTE = '⛔ NOT STORED HERE BY DESIGN. Canon, VERBATIM: "a stage doc\'s '
  + 'HONEST LIMITS list is the ONE home; the artifact stores that list verbatim or stores none" '
  + '(home: RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). '
  + 'THE ONE HOME: docs/world-model/BF-T1-FACING-COST-EXAM.md §HONEST LIMITS.';

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BF-T1',
    title: 'THE FACING-COST EXAM — does the price bite on the pitch where the census said it '
      + 'would, and is the world still football when it does',
    doc: 'docs/world-model/BF-T1-FACING-COST-EXAM.md',
    contracts: ['docs/world-model/BF-BODY-FACING-CONTRACT.md §2 M-BF.1 / M-BF.2 (HELD) / '
      + 'M-BF.3 / M-BF.4'],
    lineage: 'RC-C0b (turning is free, #373) → BF-C0 (the misalignment census) → BF-T0 (the '
      + 'dormant law) → BF-T0-FIX (the CORRECTED order: clamp → facing → stun → accel, #376 '
      + 'item 2 / #377 item 1) → #377 item 3',
    authorizedBy: 'COMMANDER RULING #377 item 3',
    lawOfRecord: 'ruling #374 item 4 as CORRECTED by #376 item 2: f(φ) = 1 − D·(1 − cos(min(φ, '
      + 'π/2))) applied to the CLAMPED target, after the top-speed clamp and before the stun '
      + 'multiplier and the accel approach; D = BF_DEPTH = 1 − BF_OFF_HEADING_FRACTION.',
    kind: 'EXAM — H-BF.1 is scored by the frozen §P.C rules ON THE EMPTY-BOOK PAIR ONLY '
      + '(E-ARMED − E-SHUT); the DOSED pair and BOTH k-rungs, and every other face, are '
      + 'REPORTED, gated by nothing.',
    xSrcZero: '⛔ the exam instrument edits nothing under `src/`: the law under exam landed at '
      + 'BF-T0 (+FIX) with its own 20-pin suite. THERE IS NO WRAPPER — observation is pure '
      + 'per-tick reads of Match state (`gLockstep`); the ONE write is the RUNG arms\' declared '
      + 'match-local depth dose on the body\'s own public field.',
    receiptsAreNotEffectSizes: '⛔ the coverage share and mean factor, the substitution counts '
      + 'and the rung re-assertion counts are ARMING PLUMBING and are NEVER quoted as football '
      + 'effect sizes (home: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §CORR item 5).',
    noSeasonLadder: '⛔ NO SEASON LADDER: a BODY law with no gene (#377 item 3).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bf-t1-facing-cost-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bf-t1-facing-cost-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries([...SRC.entries()]
      .filter(([p]) => p.startsWith('src/')).map(([p, s]) => [p, sha(s)])),
    compactJson: '⭐ canon, VERBATIM: "an artifact is written as compact JSON — no indentation; '
      + 'the hash is over the canonical body regardless; pretty-printing is a reader\'s tool, '
      + 'not a storage form" (home: ruling #372 item 5). Written with `JSON.stringify(artifact)` '
      + 'and no indent argument.',
  },
  arms: Object.fromEntries(ARMS.map((a) => [a, { label: ARM_LABEL[a], facingDepth: DEPTH_OF[a] }])),
  definitions: {
    pairs: PAIRS.map((p) => ({ pair: p.key, shut: p.shut, armed: p.armed, form: p.form })),
    depthLadder: {
      shipped: { k: BF_OFF_HEADING_FRACTION, depth: BF_DEPTH,
        note: 'the RATIFIED constant, written by the SHIPPED writer `Match.setFacingDepth()`' },
      rung60: { k: K_RUNG_60, depth: D_RUNG_60, note: 'DOSED match-local, REPORTED never scored' },
      rung80: { k: K_RUNG_80, depth: D_RUNG_80, note: 'DOSED match-local, REPORTED never scored' },
    },
    dosePlacement: '⭐⭐ the k-rung dose is written on the BODY\'s PUBLIC `facingDepth` — THE '
      + 'VERY OBJECT AND FIELD THE SHIPPED WRITER ITSELF TARGETS — and NEVER in `info.genome` '
      + 'or any genome view (canon: dose placement, ruling #270.2 / #334 item 1; '
      + '`gGenomeClean` proves it on every walked match). Because the shipped writer re-writes '
      + 'BF_DEPTH after EVERY substitution, the rung is RE-ASSERTED after every step and every '
      + 're-assertion that CHANGED a value is COUNTED and PUBLISHED (`gRungReassert`).',
    phi: 'φ = the angle between a body\'s `heading` and its `vel`, in DEGREES, both read at the '
      + 'SAME tick AFTER `m.step(DT)` — BF-C0 §P.A\'s face, REUSED. Sign-blind; a degenerate '
      + 'pair names no angle and is excluded. 15° bins to 180° (12 bins), STORED.',
    movingFloor: `MOVING = |vel| > ${MOVING_FLOOR} m/s — the ENGINE's OWN heading-follow floor `
      + '(`physicsStep`\'s `} else if (sp > 0.5) {`, ANCHORED). ⛔ Not a taste constant.',
    population: 'every OPEN-PLAY tick (`match.phase === \'playing\'`) on which a body is MOVING, '
      + 'BOTH SIDES and ALL 12 BODIES, the keeper included; a sent-off body is excluded.',
    scoredSpeedFaces: '⚠ (a1) and (a2) are SELECTION statistics: who ends up in a φ bin can '
      + 'itself change under the law (BF-C0 HONEST LIMITS 3 named the same hazard on the '
      + 'census\'s own envelope row). They are the RULED faces nonetheless — #377 item 3.',
    coverage: '⭐⭐ THE LIVE COVERAGE OF THE PRICE (#376 §CORR 6) — A READ, DECLARED: per armed '
      + 'arm, the share of MOVING ticks on which the factor applied was < 1 − 1e-6, and the '
      + 'MEAN factor applied. The probe RECOMPUTES what the seam computed, from the same public '
      + 'fields, with the SHIPPED `facingFactor` / `facingCosine`: the intent `desiredVel` is '
      + 'clamped to `topSpeed` exactly as `physicsStep` clamps it, and the factor is taken on '
      + 'the clamped target\'s direction against `heading`. ⚠ THE ONE-STEP PHASE SUBTLETY, '
      + 'STATED: `desiredVel` read after `m.step(DT)` is the executor\'s intent for the step '
      + 'JUST TAKEN and `heading` is the heading AFTER that step\'s rotation — so this is the '
      + 'seam\'s arithmetic on that step\'s intent with the heading one rotation later. ⛔ A '
      + 'COVERAGE receipt, never an effect size.',
    dfFaces: '⭐ 乱跑 = assignment switches per defender-minute — DF-C0 §R2\'s definition and '
      + 'DF-T1 §3\'s instrument, REUSED VERBATIM and ANCHORED (a marker\'s assigned man CHANGES; '
      + 'denominator = defender body-ticks × DT / 60, defenders = the out-of-possession side\'s '
      + 'outfield bodies not sent off). Marking coverage = the held-mark share of the same '
      + 'defender body-ticks.',
    e4: {
      forwardPassShare: '`mt-ladder.ts`\'s OWN definition, anchored: (passesForward[0] + '
        + 'passesForward[1]) / (passes[0] + passes[1]) from the team stats.',
      thirdMan: 'the engine\'s own completed third-man release counter (`Match.ts`, anchored).',
      overlaps: 'the engine\'s own completed overlap release counter (`Match.ts`, anchored).',
      chainLength: 'the engine\'s OWN possession-chain ledger `bestPassChain` (`types.ts`, '
        + 'anchored), summed over the two teams over TWO team-matches.',
    },
    userFaces: 'PT-C0\'s own code reused: `contact.opponentFirstContactShare` (the first body '
      + 'the ball contacts after a measured ground pass) · the receiver\'s facing SECTOR at his '
      + 'first touch on COMPLETED passes (the BK `BodySector` classifier CALLED) · '
      + '`crowd.crashShare` (the A4 min-pairwise limb under DUP_RUN_M) + the dup-run and '
      + 'spacing limbs beside.',
    estimator: `CLUSTER BOOTSTRAP over the SHARED seeds, ${BOOTSTRAP} draws, rng seeded from `
      + 'the block base — the RC-T1a estimator. Both arms of a pair move together inside every '
      + 'draw, so every interval is a PAIRED one BY CONSTRUCTION. Point estimates are '
      + 'ratio-of-sums, so every headline re-derives from the stored per-seed cells.',
    loo: 'LEAVE-ONE-OUT flip counting on every SCORED Δ: drop each seed, re-derive the POINT Δ, '
      + 'and count a FLIP when the frozen rule\'s verdict changes with the interval SHIFTED by '
      + 'that seed\'s influence. ⚠ THE CONSERVATIVE POINT-SHIFT FORM — stated, never hidden.',
    clock: '⚠ every rate is on the 240 s MATCH clock; 1 sim-s = 60 ticks = 22.5 display-s.',
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
      + '`doseSource.files` (published at PT-C0, PINNED here per PT-C0 §CORR item 2)',
    l3CellsPooled: L3_CELLS_POOLED, pcRowsPooled: PC_ROWS_POOLED,
    refusalBehaviour: '⛔ on any byte mismatch the instrument exits 3 BEFORE any walk.',
  },
  anchoredSites: ANCHORS,
  fixtures: { total: FIXTURES.length, passed: FIXTURES.filter((f) => f.ok).length, rows: FIXTURES },
  lockstep: lockstepRows,
  armsDiverge: divergeByPair,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-SEED SCRATCH SMOKE (seeds 900,002,500–511), DISCLOSED '
      + 'in full at the doc\'s §DEV-PREFLIGHT; the realised paired-Δ half-widths were read out '
      + 'of the smoke artifact\'s own `deltas[].halfWidth` fields and HARDCODED into '
      + 'SIZING_INPUTS at the FREEZE COMMIT.',
    targets: '(a1) 0.10 m/s · (a2) 0.05 m/s · (b1) 0.30 goals (the band\'s own half-width) · '
      + '(b2) 0.010 completion · (b3) 1.0 interceptions/match.',
    nFrozen: N_FROZEN, nMaxSeeds: N_MAX_SEEDS, rows: sizingRows,
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  hBF1: {
    scoredOn: 'THE EMPTY-BOOK PAIR ONLY (E-ARMED − E-SHUT)',
    frozenRules: {
      a1: '(a1) THE PRICE BITES IN THE WILD — Δ of the MEAN SPEED of moving ticks with φ > 90°: '
        + 'the 95 % paired interval lies ENTIRELY BELOW ZERO ⇒ FALLS.',
      a2: `(a2) THE FLAT SHAPE HOLDS — Δ of the MEAN SPEED of moving ticks with φ < 15°: the `
        + `interval is NOT entirely below ${TARGET_A2_MPS} m/s ⇒ HOLDS. Declared target `
        + `${Math.abs(TARGET_A2_MPS)} m/s.`,
      b1: `(b1) GOALS STAY IN THE BAND — Δ \`goalsPerMatch\`: the interval is NOT entirely `
        + `outside [−${TARGET_B1_BAND}, +${TARGET_B1_BAND}] ⇒ WITHIN-BAND.`,
      b2: `(b2) COMPLETION DOES NOT FALL — Δ whole-match \`passCompletion\`: the interval is `
        + `NOT entirely below ${TARGET_B2_COMPLETION} ⇒ DOES-NOT-FALL.`,
      b3: `(b3) INTERCEPTIONS DO NOT RISE — Δ \`interceptionsPerMatch\`: the interval is NOT `
        + `entirely above +${TARGET_B3_INTERCEPTIONS}/match ⇒ DOES-NOT-RISE. ⚠ BOTH sides `
        + 'carry the price in the armed arms, so this is the MATCH TOTAL.',
      conjunction: 'H-BF.1 = PASS ⇔ (a1) FALLS ∧ (a2) HOLDS ∧ (b1) WITHIN-BAND ∧ (b2) '
        + 'DOES-NOT-FALL ∧ (b3) DOES-NOT-RISE.',
      mdeWarning: '⚠ A NON-FALL / NON-RISE / WITHIN-BAND CERTIFIES NOTHING SMALLER THAN THE '
        + 'DECLARED MDE. Nothing smaller than an MDE is ever read as "no effect".',
      selectionWarning: '⚠ (a1) and (a2) are SELECTION statistics — who is in the bin can '
        + 'change under the law. Stated at §P.C before the battery.',
    },
    targets: { a2Mps: TARGET_A2_MPS, b1Band: TARGET_B1_BAND,
      b2Completion: TARGET_B2_COMPLETION, b3Interceptions: TARGET_B3_INTERCEPTIONS },
    a1Verdict: A1_VERDICT, a2Verdict: A2_VERDICT, b1Verdict: B1_VERDICT,
    b2Verdict: B2_VERDICT, b3Verdict: B3_VERDICT,
    aLimb: A_LIMB_OK, bLimb: B_LIMB_OK, verdict: H_BF1,
    a1Delta: dA1, a2Delta: dA2, b1Delta: dB1, b2Delta: dB2, b3Delta: dB3,
  },
  precommittedReads: {
    wordsOfRecord: '#377 item 3, verbatim: "PRE-COMMITTED READS (frozen literals, selected on '
      + 'stored booleans): PASS ⇒ BF-T1 banks, the RC arc resumes with RC-T0b (the READY limb '
      + 'on the priced body); a BF entry (world 13) is a CANDIDATE decided WITH the RC entry, '
      + 'not alone; (a) fails ⇒ the law does not bite where the census said — the FORM returns '
      + 'with numbers (the coverage face first); (b) fails ⇒ the price costs football — the arc '
      + 'pauses at the user\'s fork with the k = 0.80 rung named."',
    frozenSentences: { pass: READ_PASS, aFails: READ_A_FAILS, bFails: READ_B_FAILS },
    selectors: { verdict: H_BF1, aLimb: A_LIMB_OK, bLimb: B_LIMB_OK },
    readsPrinted: READS_PRINTED,
  },
  bins: {
    grids: {
      phiDeg: { width: PHI_BIN_DEG, bins: NPHI, cut45AtBin: BIN45, cut90AtBin: BIN90 },
      rolePhiTicks: { roles: NROLE, bins: NPHI },
      nearestMateMetres: { width: NEAR_BIN_M, bins: NEAR_BINS, overflowIsLast: true },
      minPairwiseMetres: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, overflowIsLast: true },
    },
    pooledByArm,
  },
  roles: ROLES, contactClasses: CONTACTS, sectors: SECTORS,
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batterySeeds: [batterySeeds[0], batterySeeds[batterySeeds.length - 1]],
    distinctWalked: walkedSeeds.length,
    constructionReceiptSeed: RECEIPT_SEED,
    walksBooked,
    lockstepScratchSeedsWalked: LOCKSTEP_SEEDS,
    smokeScratchBand: [900_002_500, 900_002_511],
    unwalkedTail: IS_OVERRIDE ? null
      : (batterySeeds[batterySeeds.length - 1] + 1 <= RECEIPT_SEED - 1
        ? [batterySeeds[batterySeeds.length - 1] + 1, RECEIPT_SEED - 1] : null),
    bootstrapRngSeededFrom: BLOCK_BASE,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73 },
  perf: {
    totalWallSeconds: (Date.now() - t0Wall) / 1000,
    batteryWalks: allRows.length,
    meanWallSecondsPerWalk: sum(allRows.map((r) => r.wallMs)) / 1000 / allRows.length,
    note: '⚠ A MACHINE READING ON ONE MACHINE.',
  },
  honestLimits: HONEST_LIMITS_NOTE,
  perSeedCells: cells.map((c) => ({ seed: c.seed, rows: c.rows })),
  constructionReceipt: receiptRows,
};

/* ========================================================================== */
/* §18 gFaces — RE-DERIVE EVERY PUBLISHED FACE OFF THE SERIALIZED ARTIFACT      */
/* ========================================================================== */
const ALL_GREEN_PRE = Object.values(gates).every((g) => g.ok);
const OUT_PATH_PRE = OUT_BASE;
writeFileSync(OUT_PATH_PRE, `${JSON.stringify(artifact)}\n`);
const disk = JSON.parse(readFileSync(OUT_PATH_PRE, 'utf8')) as {
  perSeedCells: { seed: number; rows: Record<Arm, Row> }[];
  faces: FaceRow[]; deltas: DeltaRow[];
  hBF1: { verdict: string; a1Verdict: string; a2Verdict: string; b1Verdict: string;
    b2Verdict: string; b3Verdict: string; aLimb: boolean; bLimb: boolean;
    a1Delta: DeltaRow; a2Delta: DeltaRow; b1Delta: DeltaRow; b2Delta: DeltaRow;
    b3Delta: DeltaRow;
    targets: { a2Mps: number; b1Band: number; b2Completion: number; b3Interceptions: number } };
  precommittedReads: { readsPrinted: string[];
    selectors: { verdict: string; aLimb: boolean; bLimb: boolean } };
  bins: { pooledByArm: Record<Arm, ReturnType<typeof pooled>> };
  sizing: { rows: typeof sizingRows };
};
const dcells = disk.perSeedCells;
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
/* ⭐⭐ THE FIVE CONJUNCT WORDS, THE VERDICT WORD AND THE READ SENTENCES, off disk */
{
  const h = disk.hBF1;
  const t = h.targets;
  const reA1 = h.a1Delta.ciHi < 0 ? 'FALLS' : 'DOES-NOT-FALL';
  const reA2 = !(h.a2Delta.ciHi < t.a2Mps) ? 'HOLDS' : 'DOES-NOT-HOLD';
  const reB1 = !(h.b1Delta.ciLo > t.b1Band || h.b1Delta.ciHi < -t.b1Band)
    ? 'WITHIN-BAND' : 'OUTSIDE-BAND';
  const reB2 = !(h.b2Delta.ciHi < t.b2Completion) ? 'DOES-NOT-FALL' : 'FALLS';
  const reB3 = !(h.b3Delta.ciLo > t.b3Interceptions) ? 'DOES-NOT-RISE' : 'RISES';
  const reA = reA1 === 'FALLS' && reA2 === 'HOLDS';
  const reB = reB1 === 'WITHIN-BAND' && reB2 === 'DOES-NOT-FALL' && reB3 === 'DOES-NOT-RISE';
  const reAll = reA && reB ? 'PASS' : 'FAIL';
  binChecks.push({ check: 'hBF1.a1Verdict', ok: reA1 === h.a1Verdict });
  binChecks.push({ check: 'hBF1.a2Verdict', ok: reA2 === h.a2Verdict });
  binChecks.push({ check: 'hBF1.b1Verdict', ok: reB1 === h.b1Verdict });
  binChecks.push({ check: 'hBF1.b2Verdict', ok: reB2 === h.b2Verdict });
  binChecks.push({ check: 'hBF1.b3Verdict', ok: reB3 === h.b3Verdict });
  binChecks.push({ check: 'hBF1.aLimb', ok: reA === h.aLimb });
  binChecks.push({ check: 'hBF1.bLimb', ok: reB === h.bLimb });
  binChecks.push({ check: 'hBF1.verdict', ok: reAll === h.verdict });
  const s = disk.precommittedReads.selectors;
  binChecks.push({ check: 'precommittedReads.selectors',
    ok: s.verdict === reAll && s.aLimb === reA && s.bLimb === reB });
  const reReads = [
    ...(reAll === 'PASS' ? [READ_PASS] : []),
    ...(!reA ? [READ_A_FAILS] : []),
    ...(!reB ? [READ_B_FAILS] : []),
  ];
  binChecks.push({ check: 'precommittedReads.readsPrinted',
    ok: JSON.stringify(reReads) === JSON.stringify(disk.precommittedReads.readsPrinted) });
}
/* ⭐ EVERY POOLED BIN re-derives by summing the SERIALIZED per-seed cells */
for (const arm of ARMS) {
  const p = disk.bins.pooledByArm[arm];
  const rows = dcells.map((c) => c.rows[arm]);
  const check = (name: string, got: number[] | number[][], want: number[] | number[][]): void => {
    binChecks.push({ check: `bins.${arm}.${name}`,
      ok: JSON.stringify(got) === JSON.stringify(want) });
  };
  const acc1 = (n: number, pick: (r: Row) => number[]): number[] => {
    const out = zeros(n);
    for (const r of rows) addInto(out, pick(r));
    return out;
  };
  const acc2 = (a: number, b: number, pick: (r: Row) => number[][]): number[][] => {
    const out = zeros2(a, b);
    for (const r of rows) addInto2(out, pick(r));
    return out;
  };
  check('phiTicks', acc1(NPHI, (r) => r.phiBins), p.phiTicks);
  check('rolePhiTicks', acc2(NROLE, NPHI, (r) => r.rolePhiBins), p.rolePhiTicks);
  check('contactClass', acc1(CONTACTS.length, (r) => r.contactClass), p.contactClass);
  check('receiverSector', acc1(SECTORS.length, (r) => r.recvSector), p.receiverSector);
  check('nearestMateMetres', acc1(NEAR_BINS, (r) => r.nearBins), p.nearestMateMetres);
  check('minPairwiseMetres', acc1(MINPAIR_BINS, (r) => r.minPairBins), p.minPairwiseMetres);
  /* ⭐ the two headline shares re-derive by an INDEPENDENT route from the stored φ histogram */
  const ph = p.phiTicks;
  const tot = sum(ph);
  binChecks.push({ check: `bins.${arm}.share45FromHistogram`,
    ok: ratio(sum(ph.slice(BIN45)), tot) === (disk.faces
      .find((f) => f.arm === arm && f.face === 'misalign.share45') as FaceRow).value });
  binChecks.push({ check: `bins.${arm}.share90FromHistogram`,
    ok: ratio(sum(ph.slice(BIN90)), tot) === (disk.faces
      .find((f) => f.arm === arm && f.face === 'misalign.share90') as FaceRow).value });
}
/* ⭐ THE SIZING ROWS re-derive off disk */
for (const r of disk.sizing.rows) {
  const seSmoke = r.hwSmoke / Z975;
  const seNeeded = Math.abs(r.target) / ZSUM;
  const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
  const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
  const dR = disk.deltas.find((d) => d.pair === 'E' && d.key === r.face);
  binChecks.push({
    check: `sizing.${r.face}@${r.target}`,
    ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded && nReq === r.nRequired
      && hwAtN === r.expectedHalfWidthAtNFrozen
      && hwAtN * ZSUM / Z975 === r.mdeAtNFrozen
      && dR !== undefined && dR.halfWidth * ZSUM / Z975 === r.mdeAtRealisedHw
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} verdict-word / read-sentence `
    + '/ stored-bin / histogram-route / sizing checks re-derived from the SERIALIZED artifact '
    + 'off disk — canon, VERBATIM: "the re-derivation gate covers EVERY published face; a '
    + 'percentile face requires stored bins". H-BF.1\'s FIVE conjunct words, the VERDICT word '
    + 'and the PRE-COMMITTED READ SENTENCES are INCLUDED, and both headline misalignment '
    + 'shares are re-derived by an INDEPENDENT route from the stored φ histogram',
};
artifact.gates = gates;
artifact.gFacesDetail = { faceChecks, binChecks };
const ALL_GREEN = ALL_GREEN_PRE && FACES_OK;
artifact.allGreen = ALL_GREEN;

/* ========================================================================== */
/* §19 THE HASH, LAST — the house order (#372 item 3), then the NON-BODY receipt */
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
/** ⭐⭐ THE NON-BODY RECEIPT (canon, #372 item 3): the body hash RECOMPUTED from the FILE
 *  JUST WRITTEN, under the DECLARED BODY_SCHEMA — persisted OUTSIDE the body. */
const HASH_REPRODUCES_FROM_FILE = (() => {
  const onDisk = JSON.parse(readFileSync(OUT_PATH, 'utf8')) as Record<string, unknown>;
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
banner(`BF-T1 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- H-BF.1 (SCORED on the EMPTY-BOOK pair, E-ARMED − E-SHUT) ---');
const line = (tag: string, d: DeltaRow, word: string): void => {
  banner(`  ${tag.padEnd(6)} ${d.key.padEnd(34)} shut ${f6(d.shutValue)} → armed `
    + `${f6(d.armedValue)}  Δ ${f6(d.delta)} [${f6(d.ciLo)}, ${f6(d.ciHi)}] `
    + `(${f6(d.absDeltaOverHalfWidth)} hw, LOO flips ${d.looFlips})  ⇒ ${word}`);
};
line('(a1)', dA1, A1_VERDICT);
line('(a2)', dA2, A2_VERDICT);
line('(b1)', dB1, B1_VERDICT);
line('(b2)', dB2, B2_VERDICT);
line('(b3)', dB3, B3_VERDICT);
banner(`  ⭐⭐ H-BF.1 = ${H_BF1}`);
banner('');
banner('--- THE PRE-COMMITTED READ, PRINTED BY THE FROZEN FORM ---');
for (const s of READS_PRINTED) banner(`  ${s}`);
banner('');
banner('--- SIZING (the 12-seed scratch smoke) ---');
for (const r of sizingRows) {
  banner(`  ${r.group} ${r.face.padEnd(34)} hwSmoke ${f6(r.hwSmoke)} target ${r.target} `
    + `N ${r.nRequired} hw@N ${f6(r.expectedHalfWidthAtNFrozen)} MDE ${f6(r.mdeAtNFrozen)} `
    + `MDE@realised ${f6(r.mdeAtRealisedHw)}`);
}
banner('');
const REPORT_KEYS = [
  'coverage.appliedShare', 'coverage.meanFactor',
  'misalign.share45', 'misalign.share90',
  'misalign.role.GK.share45', 'misalign.role.GK.share90',
  'misalign.role.DF.share90', 'misalign.role.MF.share90', 'misalign.role.WG.share90',
  'misalign.role.ST.share90',
  'keeper.savesPerMatch', 'keeper.gkMetresPerKeeperPerMatch',
  'keeper.gkPositionMisalignedMetresPerMatch', 'keeper.gkPositionMetresPerMatch',
  'df.markSwitchesPerDefenderMinute', 'df.markHeldShare', 'df.tacklesPerMatch',
  'contact.opponentFirstContactShare', 'contact.receiverSideShareCompleted',
  'contact.receiverFrontShareCompleted', 'contact.receiverBackShareCompleted',
  'crowd.crashShare', 'crowd.dupRunPairsPerSample', 'crowd.nearestMateMeanMetres',
  'e4.forwardPassShare', 'e4.thirdManPerMatch', 'e4.overlapsPerMatch',
  'e4.bestPassChainMeanPerTeam', 'shotsPerMatch',
  'context.groundPassesPerMatch', 'context.carriesPerMatch', 'context.movingTicksPerMatch',
  'context.metresPerMatch', 'context.meanSpeedMps', 'context.movingShareOfBodyTicks',
  'receipt.substitutionsPerMatch', 'receipt.rungReassertionsChangedPerMatch',
];
for (const p of PAIRS) {
  banner(`--- REPORTED — pair ${p.key}: ${p.form} ---`);
  for (const k of REPORT_KEYS) {
    const dd = delta(p.key, k);
    banner(`  ${k.padEnd(46)} shut ${f6(dd.shutValue)} → armed ${f6(dd.armedValue)}  Δ `
      + `${f6(dd.delta)} [${f6(dd.ciLo)}, ${f6(dd.ciHi)}]`);
  }
  banner('');
}
banner('--- THE φ BINS (share · mean speed), per arm ---');
for (const arm of ARMS) {
  banner(`  ${arm}: ` + Array.from({ length: NPHI }, (_, b) =>
    `${b * PHI_BIN_DEG}° ${f6(face(arm, `phi.bin${b}.share`).value)}/`
    + `${f6(face(arm, `phi.bin${b}.meanSpeedMps`).value)}`).join(' · '));
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`instrumentSha256   = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`hashedBodySha256   = ${artifact.hashedBodySha256 as string}`);
banner(`file byte-hash     = ${FINAL_FILE_SHA}`);
banner(`artifact bytes     = ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s`);
if (!ALL_GREEN) process.exit(1);
