/**
 * ⭐⭐ BQ-C1 — 「三拍」 THE ATTEMPT-WINDOW CENSUS
 * (docs/world-model/BQ-C1-ATTEMPT-WINDOW-CENSUS.md).
 *
 * Authorized by COMMANDER RULING #383 item 6. Lineage: PT-C0 → the RC arc → RC-T1b (FAIL: not
 * readiness) → BN-C0 (not the sector; the bounce is a CONTROL-QUALITY event) → BQ-C0 (not the
 * coin: it is honest, has no heavy face, and its failures are at most 0.163509 of the control
 * attempts that end without possession) → #383 item 4(iii) (THE WINDOW, a LABELLED HYPOTHESIS)
 * → this census, which measures it.
 *
 * THE QUESTION: when a control attempt ends WITHOUT possession, what ended it?
 *
 * ⛔ THIS IS A CENSUS. It publishes MEASUREMENTS. It scores no hypothesis and arms no mechanism.
 * The READ SENTENCES are FROZEN LITERALS selected by STORED booleans. The commander rules.
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited. The probe CALLS the shipped exports
 * (`directBallAccess`, `pressureAt`, the composer, the dose loaders) and reads `Match` state per
 * tick; the CONTEST-EPISODE ledger and the E1a FIRST-TOUCH ledger are READ, never re-implemented;
 * the `this.pendingControl = null` sites are ANCHORED, never re-implemented. THERE IS NO WRAPPER
 * — `gLockstep` proves observed ≡ unobserved byte for byte per arm, and `gTraceInert` proves BOTH
 * trace flags change no byte of the world.
 * ⛔ WORLD 12 IS UNTOUCHED: no world is cut, no flag is armed, the user's play-test gate is his.
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 * ⭐ canon, VERBATIM: "a universal sentence about a table ('every bin', 'the one bin') is a
 * stored boolean or is not written" (home: BF-T1-FACING-COST-EXAM.md §CORR items 1–2).
 */
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve as pathResolve } from 'node:path';
import { Match } from '../../src/sim/Match';
import {
  CONTACT_CONTROL_DELAY_TICKS, CONTACT_CONTROL_RETENTION_MARGIN, CONTROL_RADIUS,
  CONTACT_RELEASE_MIN_SPEED, CONTACT_RELEASE_MAX_SPEED, CONTACT_RELEASE_INCOMING_SHARE,
  CONTACT_TANGENTIAL_RETENTION, CONTACT_COMMIT_TIME,
  CONTROL_MAX_SPEED, DEFLECT_MAX_SPEED, DT,
} from '../../src/sim/constants';
import { directBallAccess } from '../../src/sim/physical';
import { pressureAt, PRESSURE_RADIUS_M } from '../../src/ai/perception';
import {
  a4MatchFlags, armA4World, raArmedVersion,
  loadL3Dose, loadPcDose,
  RA_WORLD_VERSION, type L3DoseCell, type PcDoseTable,
} from '../../src/game/a4World';
import { randomGenome, type TacticalGenome } from '../../src/evolution/genome';
import { randomSquad } from '../../src/evolution/playerGenome';
import { TEAM_SIZE, type Side, type TeamInfo } from '../../src/sim/types';
import { Rng } from '../../src/utils/rng';

/* ========================================================================== */
/* §1 THE RUN ENVELOPE — no bypass (the BQ-C0 §1 form)                         */
/* ========================================================================== */
const ENV_WHITELIST = ['BQC1_MODE', 'BQC1_N', 'BQC1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'RA_WORLD', 'PW_LADDER'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BQC1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`BQ-C1 FATAL — env outside the whitelist: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.BQC1_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('BQ-C1 FATAL — BQC1_MODE must be smoke or full');
  process.exit(3);
}
const N_ENV = process.env.BQC1_N !== undefined ? Number(process.env.BQC1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV <= 0)) {
  banner('BQ-C1 FATAL — BQC1_N must be a positive integer');
  process.exit(3);
}
const OUT_ENV = process.env.BQC1_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`BQC1_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`BQC1_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`BQC1_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bq-c1-attempt-window-census.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/bq-c1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('BQ-C1 FATAL — an OVERRIDE run may never write a canonical artifact path');
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
  if (!Number.isFinite(v)) return 0;
  return Math.max(0, Math.min(n - 1, Math.floor(v / width)));
};
const binMedian = (bins: readonly number[], width: number): number => {
  const total = sum(bins);
  if (total === 0) return Number.NaN;
  let acc = 0;
  for (let i = 0; i < bins.length; i++) {
    acc += bins[i];
    if (acc >= total / 2) return i * width;
  }
  return (bins.length - 1) * width;
};
const canonicalJson = (v: unknown): string => {
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

/* ========================================================================== */
/* §3 THE ANCHORED SITES — anchored needle + line receipt, never first-occurrence
   canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4)
   canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
   occurrence's site" (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1)          */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PERC_PATH = 'src/ai/perception.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, MECH_PATH, CONST_PATH, PERC_PATH, PHYS_PATH, TYPES_PATH, A4_PATH]) {
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

/* ⭐⭐ THE SITE ENUMERATION — the NEEDLE COUNT is a GATE, and every occurrence is listed with
   its LINE and its PURPOSE, read from the surrounding code. */
const NULL_NEEDLE = 'this.pendingControl = null';
const NULL_SITES_FOUND = occurrences(SRC_OF[MATCH_PATH], NULL_NEEDLE);
/** ⛔ the ONE creation site — `applyControlContact`'s own assignment */
const CREATE_NEEDLE = 'this.pendingControl = {';
const CREATE_SITES_FOUND = occurrences(SRC_OF[MATCH_PATH], CREATE_NEEDLE);
/** the purposes, in SOURCE ORDER, each pinned by its own anchored context needle below. */
const SITE_PURPOSES: { line: number; purpose: string; endingClassItServes: string }[] = [
  { line: 3661, purpose: '`kickBall` — the low-level kick releases the ball with velocity and a '
    + 're-capture cooldown; any pending control on that ball is void',
    endingClassItServes: 'abandonedPossessionElsewhere / abandonedOther' },
  { line: 3685, purpose: '`giveBall`\'s OFFSIDE branch — the flagged target touches the ball, so '
    + 'the "reception" is a dead ball, not a control',
    endingClassItServes: 'resolvedOffside / abandonedOffside' },
  { line: 3828, purpose: '`giveBall`\'s TAIL — a body is given clean control; the attempt is '
    + 'consumed by the possession it produced',
    endingClassItServes: 'resolvedClean (and abandonedPossessionElsewhere off other callers)' },
  { line: 4801, purpose: '`awardRestart` — a restart (kickIn / corner / goalKick / freeKick) '
    + 'kills the live ball; the contest resolves `out` or `deadBall`',
    endingClassItServes: 'abandonedDeadBallOut (and abandonedOffside via `callOffside`)' },
  { line: 5582, purpose: '⭐ `bkApplyBodyStrike` — THE DEFLECTION PRECEDENT, in the engine\'s own '
    + 'words: "the deflection precedent: that attempt\'s ball is gone"',
    endingClassItServes: 'abandonedDeflection (kind `body`)' },
  { line: 5620, purpose: '`applyControlContact`\'s OFFSIDE branch — the cushioning contact itself '
    + 'is an offside reception; no attempt is created',
    endingClassItServes: 'abandonedOffside' },
  { line: 5636, purpose: '⭐⭐ `resolvePendingControlAttempt`\'s OWN CLEAR — fires UNCONDITIONALLY '
    + 'once `stepCount >= readyTick`, BEFORE the pre-roll returns and before the roll. Every '
    + 'RESOLVED-* ending is this one site',
    endingClassItServes: 'resolvedClean · resolvedRollFail · resolvedNotReached*' },
  { line: 5681, purpose: '`tryCapture`\'s APPLIED-DEFLECTION branch — `mech.tryDeflection` '
    + 'succeeded and the ball is gone off a stretched leg',
    endingClassItServes: 'abandonedDeflection (kind `deflection`)' },
  { line: 5798, purpose: '`setupKickoff` — a kickoff (match start, after a goal, after half-time) '
    + 'resets the world',
    endingClassItServes: 'abandonedDeadBallOut' },
  { line: 5865, purpose: '`endMatch` — THE WHISTLE; the contest resolves `stillLoose`',
    endingClassItServes: 'abandonedDeadBallOut' },
];
anchor('⭐⭐ THE SITE ENUMERATION — every `this.pendingControl = null` in Match.ts', MATCH_PATH,
  NULL_NEEDLE, SITE_PURPOSES.length, SITE_PURPOSES.map((s) => s.line));
anchor('⭐⭐ THE ONE CREATION SITE — `applyControlContact` opens the window', MATCH_PATH,
  CREATE_NEEDLE, 1);

/* --- the sites, each pinned by its own anchored CONTEXT needle (never first-occurrence) --- */
anchor('site 5582 — the deflection precedent, in the engine\'s own comment', MATCH_PATH,
  "    this.pendingControl = null; // the deflection precedent: that attempt's ball is gone", 1);
anchor('site 5636 — ⭐⭐ THE RESOLVER\'S OWN GATE AND CLEAR (the resolver runs FIRST)', MATCH_PATH,
  '  private resolvePendingControlAttempt(): boolean {\n'
  + '    const attempt = this.pendingControl;\n'
  + '    if (attempt === null || this.stepCount < attempt.readyTick) return false;\n'
  + '    this.pendingControl = null;', 1);
anchor('site 5637+ — ⭐⭐ THE PRE-ROLL RETURN (a): a missing / sent-off / STUNNED body', MATCH_PATH,
  '    const p = this.allPlayers[attempt.gid];\n'
  + '    if (!p || p.sentOff || p.stunTimer > 0) return false;', 1);
anchor('site 5648 — ⭐⭐ THE PRE-ROLL RETURN (b): THE RETENTION MARGIN', MATCH_PATH,
  '    if (access.geometry.centerDistance > access.sectorCenterReach '
  + '+ CONTACT_CONTROL_RETENTION_MARGIN) return false;', 1);
anchor('the resolver\'s OWN geometry call — `directBallAccess(p, this.ball, this.allPlayers, '
  + 'CONTROL_RADIUS)` (the census RE-CALLS this shipped function for its cross-check)', MATCH_PATH,
  '    const access = directBallAccess(p, this.ball, this.allPlayers, CONTROL_RADIUS);', 1);
anchor('the resolver\'s roll — `mech.attemptFirstTouch` and the `giveBall` on clean', MATCH_PATH,
  '    const clean = mech.attemptFirstTouch(this, p, {\n'
  + '      relativeSpeed: attempt.relativeSpeed,\n'
  + '      incomingDir: attempt.incomingDir,\n'
  + '    });\n'
  + '    if (clean) this.giveBall(p);', 1);
anchor('⭐⭐ THE ORDER OF OPERATIONS — `tryCapture` RESOLVES FIRST, then collects claims (the '
  + 'justification of the frozen precedence)', MATCH_PATH,
  '  private tryCapture(): void {\n'
  + '    if (this.resolvePendingControlAttempt()) return;', 1);
anchor('⭐⭐ THE REPLACEMENT — a NEW claim inside the window OVERWRITES the attempt (there is no '
  + '`= null` here: `applyControlContact` assigns straight over it)', MATCH_PATH,
  '    this.pendingControl = {\n'
  + '      gid: p.gid,\n'
  + '      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,\n'
  + '      relativeSpeed: claim.relativeSpeed,\n'
  + '      incomingDir: claim.incomingDir,\n'
  + '    };', 1);
anchor('⭐⭐ THE CUSHION — the contact law\'s release along the normal (min/max/incoming share) '
  + 'and the tangential retention', MATCH_PATH,
  '    const release = Math.min(\n'
  + '      CONTACT_RELEASE_MAX_SPEED,\n'
  + '      Math.max(\n'
  + '        CONTACT_RELEASE_MIN_SPEED,\n'
  + '        CONTACT_RELEASE_MIN_SPEED + Math.abs(relativeNormal) * CONTACT_RELEASE_INCOMING_SHARE,\n'
  + '      ),\n'
  + '    );\n'
  + '    ball.vel.x = p.vel.x + n.x * release + tx * CONTACT_TANGENTIAL_RETENTION;\n'
  + '    ball.vel.y = p.vel.y + n.y * release + ty * CONTACT_TANGENTIAL_RETENTION;', 1);
anchor('the cushion\'s other effects — vz, spin, lastTouch, the commit-time cooldown and the '
  + 'contest-ledger write', MATCH_PATH,
  '    ball.vz *= 0.25;\n'
  + '    ball.spin *= 0.4;\n'
  + '    ball.lastTouch = p;\n'
  + '    p.kickCooldown = Math.max(p.kickCooldown, CONTACT_COMMIT_TIME);\n'
  + "    this.traceContact(allClaims, p, 'controlAttempt');", 1);
anchor('THE CONTEST LEDGER\'S OWN WRITE — passive, never read by a contact/control decision',
  MATCH_PATH, '  /** Passive M3 ledger write. Never read by contact/control decisions. */', 1);
anchor('the ledger\'s THREE writers, ENUMERATED', MATCH_PATH, 'this.traceContact(', 3);
anchor('THE OFFSIDE RECORD — the engine\'s own `restart.offside` flag', MATCH_PATH,
  '    this.restart!.offside = true; // the UI labels the dead ball 🚩 offside', 1);
anchor('the restart OBJECT is rebuilt at every award (the census\'s offside/dead-ball signature)',
  MATCH_PATH,
  '    this.restart = { kind, side, pos: clone(pos), timer: 0, '
  + 'takerGid: this.pickTaker(kind, side, pos) };', 1);
anchor('`callOffside`\'s two call sites, ENUMERATED', MATCH_PATH, 'this.callOffside(', 2);

/* --- THE CONSTANTS, each at its own site (no new constant is invented anywhere) --- */
anchor('⭐⭐ CONTACT_CONTROL_DELAY_TICKS — the THREE ticks of the window', CONST_PATH,
  'export const CONTACT_CONTROL_DELAY_TICKS = 3;', 1, CONTACT_CONTROL_DELAY_TICKS);
anchor('⭐⭐ CONTACT_CONTROL_RETENTION_MARGIN — the resolver\'s own reach slack', CONST_PATH,
  'export const CONTACT_CONTROL_RETENTION_MARGIN = 0.02;', 1, CONTACT_CONTROL_RETENTION_MARGIN);
anchor('CONTACT_RELEASE_MIN_SPEED', CONST_PATH,
  'export const CONTACT_RELEASE_MIN_SPEED = 0.25;', 1, CONTACT_RELEASE_MIN_SPEED);
anchor('CONTACT_RELEASE_MAX_SPEED', CONST_PATH,
  'export const CONTACT_RELEASE_MAX_SPEED = 1.2;', 1, CONTACT_RELEASE_MAX_SPEED);
anchor('CONTACT_RELEASE_INCOMING_SHARE', CONST_PATH,
  'export const CONTACT_RELEASE_INCOMING_SHARE = 0.12;', 1, CONTACT_RELEASE_INCOMING_SHARE);
anchor('CONTACT_TANGENTIAL_RETENTION', CONST_PATH,
  'export const CONTACT_TANGENTIAL_RETENTION = 0.35;', 1, CONTACT_TANGENTIAL_RETENTION);
anchor('CONTACT_COMMIT_TIME', CONST_PATH,
  'export const CONTACT_COMMIT_TIME = 0.08;', 1, CONTACT_COMMIT_TIME);
anchor('CONTROL_RADIUS at its own definition site', CONST_PATH,
  'export const CONTROL_RADIUS = 1.25 * CONTROL_REACH_SCALE;', 1, CONTROL_RADIUS);
anchor('⭐ `pressureAt`\'s OWN FORM — the nearest opponent, 1 at 0 m and 0 beyond '
  + '`PRESSURE_RADIUS_M`; the census CALLS this shipped function', PERC_PATH,
  'export function pressureAt(pos: V2, opponents: Player[]): number {\n'
  + '  let best = Infinity;\n'
  + '  for (const o of opponents) {\n'
  + '    if (o.sentOff) continue;\n'
  + '    const d = dist(o.pos, pos);\n'
  + '    if (d < best) best = d;\n'
  + '  }\n'
  + '  return clamp01(1 - best / PRESSURE_RADIUS_M);\n'
  + '}', 1, PRESSURE_RADIUS_M);
anchor('the roll\'s own pressure site inside `attemptFirstTouch` (the ledger\'s pressure, for '
  + 'comparison with the census\'s declared reconstruction)', MECH_PATH,
  '  const pressure = pressureAt(p.pos, match.teams[1 - p.side].players);\n'
  + '  let pFail = touchFailChance(', 1);
anchor('⭐ THE ROLL\'S TWO EARLY RETURNS — a keeper or a ball at `speed <= 6` never rolls',
  MECH_PATH, "  if (p.role === 'GK' || speed <= 6) return true;", 1);
anchor('⭐ the SECTOR REACH the retention margin is measured against — `directBallAccess`\'s own '
  + '`sectorCenterReach` (the BodySector cones)', PHYS_PATH,
  '  const sectorCenterReach = actor.coreRadius + ball.radius + extension * extensionFactor;\n'
  + '  const withinPlayingDistance = geometry.centerDistance <= sectorCenterReach;', 1);
anchor('⭐ the contest ledger\'s KIND vocabulary, PARSED at run time (never re-typed)', PHYS_PATH,
  "export type ContestContactKind = 'controlAttempt' | 'poke' | 'deflection' | 'header' | 'body';",
  1);
anchor('the ACTION vocabulary\'s own union head (the census parses the names out of it)',
  TYPES_PATH, 'export type ActionType =\n', 1);
anchor('⭐⭐ `edsTouchCost` IS ABSENT FROM THE WHOLE WORLD COMPOSER — world 12 never sets it '
  + '(0 occurrences is the receipt)', A4_PATH, 'edsTouchCost', 0);
anchor('⭐⭐ the DOSE ARGUMENT is IGNORED for worlds 11/12 by construction (PT-C0 §P.D fact 2)',
  A4_PATH, '  if (isRaWorld(version)) {\n    armRaWorld(match, l3Dose, pcDose);\n    return;\n  }',
  1);

/** ⭐⭐ THE VOCABULARIES, PARSED OFF `src/` — never re-typed into this probe. */
const parseUnion = (src: string, head: string): string[] => {
  const i = src.indexOf(head);
  if (i < 0) return [];
  const j = src.indexOf(';', i);
  const body = src.slice(i + head.length, j);
  return [...body.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]);
};
const KIND_VOCAB = parseUnion(SRC_OF[PHYS_PATH], 'export type ContestContactKind =');
const ACTION_VOCAB = parseUnion(SRC_OF[TYPES_PATH], 'export type ActionType =');

/** ⭐⭐ K — the WINDOW, read off the control-attempt law's own constant. ⛔ NOT a typed constant
 *  of this census: it IS `CONTACT_CONTROL_DELAY_TICKS`, imported. */
const K_TICKS = CONTACT_CONTROL_DELAY_TICKS;

const ANCHORS_OK = ANCHORS.every((a) => a.occurrences.length === a.want)
  && RA_WORLD_VERSION === 12 && K_TICKS === 3
  && CONTROL_MAX_SPEED === 14 && DEFLECT_MAX_SPEED === 24
  && KIND_VOCAB.length === 5 && ACTION_VOCAB.length === 23
  && NULL_SITES_FOUND.length === SITE_PURPOSES.length
  && NULL_SITES_FOUND.every((s, i) => s.line === SITE_PURPOSES[i].line)
  && CREATE_SITES_FOUND.length === 1;

/* ========================================================================== */
/* §4 SEEDS — block 12,542,000–999 (#383 item 6(vii))                          */
/* ========================================================================== */
const BLOCK_BASE = 12_542_000;
const BLOCK_TOP = 12_542_999;
/** ⭐⭐ N_FROZEN = 998 — the LARGEST N the block affords after the construction receipt at
 *  12,542,999, with the unwalked tail 12,542,998 DECLARED. Sized by the §DEV-PREFLIGHT
 *  12-cluster scratch smoke, run BEFORE the freeze commit and BEFORE any battery seed. */
const N_FROZEN = 998;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_003_000;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const UNWALKED_TAIL = BLOCK_TOP - 1;
const CURVE_PIN_SEED = SCRATCH_BASE + 70;
const TRACE_INERT_SEEDS = [SCRATCH_BASE + 80, SCRATCH_BASE + 81];
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

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
  banner('BQ-C1 FATAL — a dose file\'s BYTES do not match the pinned value (#383 item 6)');
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
  banner(`BQ-C1 FATAL — the DOSED arm is not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty'}`);
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
/** BQ-C0's own population construction per seed, so the two arms differ ONLY in the doses. */
const buildMatch = (seed: number, arm: Arm, trace = true): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(RA_WORLD_VERSION), traceFirstTouch: trace, traceContests: trace,
  } as ConstructorParameters<typeof Match>[0]);
  if (arm === 'E') armA4World(m, null, RA_WORLD_VERSION);
  else armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  return m;
};
/** ⭐⭐ THE CURVE, PINNED before the battery (expected false — the base curve). */
const CURVE_PROBE = ARMS.map((arm) => ({
  arm, edsTouchCost: buildMatch(CURVE_PIN_SEED, arm, false).edsTouchCost,
}));
const EDS_TOUCH_COST = CURVE_PROBE[0].edsTouchCost;
const CURVE_MEASURED: 'base' | 'heavy' = EDS_TOUCH_COST ? 'heavy' : 'base';
const CURVE_UNANIMOUS = CURVE_PROBE.every((c) => c.edsTouchCost === EDS_TOUCH_COST);

/* ========================================================================== */
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed
   canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions"               */
/* ========================================================================== */

/** ⭐⭐ THE ENDING CLASSES — mutually exclusive, in a FROZEN precedence justified by the
 *  ENGINE'S OWN ORDER OF OPERATIONS (`tryCapture` RESOLVES FIRST, then collects claims;
 *  the offside branches return BEFORE any attempt is created or granted). */
const CLASSES = [
  'resolvedClean',
  'resolvedRollFail',
  'resolvedNotReachedStunnedOrOff',
  'resolvedNotReachedMargin',
  'resolvedOffside',
  'abandonedContactOpponent',
  'abandonedContactTeammate',
  'abandonedContactSameReceiver',
  'abandonedDeflection',
  'abandonedBodyStrike',
  'abandonedOffside',
  'abandonedDeadBallOut',
  'abandonedPossessionElsewhere',
  'abandonedOther',
] as const;
type Cls = (typeof CLASSES)[number];
const CI = (c: Cls): number => CLASSES.indexOf(c);
/** the ONE class that IS possession; every other class is a NON-POSSESSION ending */
const POSSESSION_CLASS: Cls = 'resolvedClean';
/** ⭐⭐ OBSERVED vs INFERRED, declared at §P and STORED here (BQ-C0 §CORR 2's remedy). */
const CLASS_OBSERVED: Record<Cls, boolean> = {
  resolvedClean: true,
  resolvedRollFail: true,
  resolvedNotReachedStunnedOrOff: false,
  resolvedNotReachedMargin: false,
  resolvedOffside: true,
  abandonedContactOpponent: true,
  abandonedContactTeammate: true,
  abandonedContactSameReceiver: true,
  abandonedDeflection: true,
  abandonedBodyStrike: true,
  abandonedOffside: true,
  abandonedDeadBallOut: false,
  abandonedPossessionElsewhere: false,
  abandonedOther: false,
};
/** THE ATTRIBUTION INPUT — every field is PUBLIC state or an ENGINE LEDGER read. */
interface EndInput {
  atOrAfterReady: boolean;   // endTick >= readyTick — the resolver's own gate, anchored
  offsideThisTick: boolean;  // the engine's own `restart.offside` on a NEW restart object
  rollFail: boolean;         // an E1a trace entry, this gid, this tick, `clean === false`
  ownsBall: boolean;         // `ball.owner.gid === attempt.gid` at the end of the tick
  stunnedOrOff: boolean;     // `p.sentOff || p.stunTimer > 0` at the end of the tick
  replacedByGid: number | null;    // a NEW pendingControl at the end of the tick
  replacedRelation: 'opponent' | 'teammate' | 'sameReceiver' | null;
  deflectionKindThisTick: 'deflection' | 'body' | null; // the CONTEST LEDGER's own kind
  deadBallThisTick: boolean; // phase left `playing`, or a new restart, or the whistle
  otherOwnerGid: number | null;    // possession by SOMEONE ELSE at the end of the tick
}
const classOf = (i: EndInput): Cls => {
  if (i.atOrAfterReady) {
    // the resolver's own clear (site 5636) fired UNCONDITIONALLY — this is a RESOLVED ending
    if (i.offsideThisTick) return 'resolvedOffside';
    if (i.rollFail) return 'resolvedRollFail';
    if (i.ownsBall) return 'resolvedClean';
    return i.stunnedOrOff ? 'resolvedNotReachedStunnedOrOff' : 'resolvedNotReachedMargin';
  }
  if (i.offsideThisTick) return 'abandonedOffside';
  if (i.replacedByGid !== null && i.replacedRelation !== null) {
    return i.replacedRelation === 'sameReceiver' ? 'abandonedContactSameReceiver'
      : i.replacedRelation === 'teammate' ? 'abandonedContactTeammate'
        : 'abandonedContactOpponent';
  }
  if (i.deflectionKindThisTick === 'deflection') return 'abandonedDeflection';
  if (i.deflectionKindThisTick === 'body') return 'abandonedBodyStrike';
  if (i.deadBallThisTick) return 'abandonedDeadBallOut';
  if (i.otherOwnerGid !== null) return 'abandonedPossessionElsewhere';
  return 'abandonedOther';
};
/** THE DISPLACEMENT COMPARISON, frozen: strictly larger, or a tie. */
const DISP_CELLS = ['ballLarger', 'bodyLarger', 'tie'] as const;
type DispCell = (typeof DISP_CELLS)[number];
const DPI = (d: DispCell): number => DISP_CELLS.indexOf(d);
const dispCellOf = (ballDisp: number, bodyDisp: number): DispCell => (
  ballDisp > bodyDisp ? 'ballLarger' : bodyDisp > ballDisp ? 'bodyLarger' : 'tie');

/** THE REPLACING BODY'S SIDE × the LEDGER'S KIND (for ABANDONED-BY-CONTACT) */
const SIDES = ['opponent', 'teammate', 'sameReceiver'] as const;
type SideCell = (typeof SIDES)[number];
const SDI = (s: SideCell): number => SIDES.indexOf(s);
/** the ledger's own vocabulary, PARSED off `physical.ts`, plus a `silent` cell for a tick the
 *  ledger recorded no contact at (published as such, never imputed) */
const KIND_CELLS = [...KIND_VOCAB, 'silent'];
const KDI = (k: string): number => Math.max(0, KIND_CELLS.indexOf(k));

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const EI = (o: Partial<EndInput>): EndInput => ({
  atOrAfterReady: false, offsideThisTick: false, rollFail: false, ownsBall: false,
  stunnedOrOff: false, replacedByGid: null, replacedRelation: null,
  deflectionKindThisTick: null, deadBallThisTick: false, otherOwnerGid: null, ...o,
});
fx('class.resolvedClean', classOf(EI({ atOrAfterReady: true, ownsBall: true })), 'resolvedClean');
fx('class.resolvedRollFail', classOf(EI({ atOrAfterReady: true, rollFail: true })),
  'resolvedRollFail');
fx('class.rollFailBeatsPossession',
  classOf(EI({ atOrAfterReady: true, rollFail: true, ownsBall: true })), 'resolvedRollFail');
fx('class.resolvedOffsideBeatsTheRoll',
  classOf(EI({ atOrAfterReady: true, offsideThisTick: true, rollFail: true })), 'resolvedOffside');
fx('class.notReachedStunned',
  classOf(EI({ atOrAfterReady: true, stunnedOrOff: true })), 'resolvedNotReachedStunnedOrOff');
fx('class.notReachedMargin', classOf(EI({ atOrAfterReady: true })), 'resolvedNotReachedMargin');
fx('class.theResolverBeatsAReplacement',
  classOf(EI({ atOrAfterReady: true, replacedByGid: 7, replacedRelation: 'opponent' })),
  'resolvedNotReachedMargin');
fx('class.abandonedOpponent',
  classOf(EI({ replacedByGid: 7, replacedRelation: 'opponent' })), 'abandonedContactOpponent');
fx('class.abandonedTeammate',
  classOf(EI({ replacedByGid: 7, replacedRelation: 'teammate' })), 'abandonedContactTeammate');
fx('class.abandonedSameReceiver',
  classOf(EI({ replacedByGid: 4, replacedRelation: 'sameReceiver' })),
  'abandonedContactSameReceiver');
fx('class.abandonedDeflection',
  classOf(EI({ deflectionKindThisTick: 'deflection' })), 'abandonedDeflection');
fx('class.abandonedBodyStrike',
  classOf(EI({ deflectionKindThisTick: 'body' })), 'abandonedBodyStrike');
fx('class.replacementBeatsADeflectionKind',
  classOf(EI({ replacedByGid: 7, replacedRelation: 'opponent', deflectionKindThisTick: 'body' })),
  'abandonedContactOpponent');
fx('class.abandonedOffsideBeatsEverything',
  classOf(EI({ offsideThisTick: true, replacedByGid: 7, replacedRelation: 'opponent',
    deadBallThisTick: true })), 'abandonedOffside');
fx('class.abandonedDeadBall', classOf(EI({ deadBallThisTick: true })), 'abandonedDeadBallOut');
fx('class.abandonedPossessionElsewhere',
  classOf(EI({ otherOwnerGid: 3 })), 'abandonedPossessionElsewhere');
fx('class.abandonedOther', classOf(EI({})), 'abandonedOther');
fx('class.everyInputLandsInExactlyOneClass',
  [...new Set(CLASSES)].length, CLASSES.length);
fx('disp.ballLarger', dispCellOf(0.8, 0.2), 'ballLarger');
fx('disp.bodyLarger', dispCellOf(0.2, 0.8), 'bodyLarger');
fx('disp.tie', dispCellOf(0.5, 0.5), 'tie');
fx('vocab.kindsParsedOffSrc', KIND_VOCAB,
  ['controlAttempt', 'poke', 'deflection', 'header', 'body']);
fx('vocab.actionsParsedOffSrcCount', ACTION_VOCAB.length, 23);
fx('sites.nullNeedleCount', NULL_SITES_FOUND.length, 10);
fx('sites.creationNeedleCount', CREATE_SITES_FOUND.length, 1);
fx('sites.everyNullSiteHasAPurpose',
  SITE_PURPOSES.filter((s) => s.purpose.length > 0).length, NULL_SITES_FOUND.length);
/** ⭐ THE RECONCILIATION ARITHMETIC, on CONSTRUCTED counts */
const rollFailShareOf = (rollFail: number, nonPossession: number): number =>
  ratio(rollFail, nonPossession);
fx('reconciliation.rollFailShareArithmetic', rollFailShareOf(4460, 27277),
  4460 / 27277);
fx('reconciliation.zeroDenominatorIsNaN', Number.isNaN(rollFailShareOf(0, 0)), true);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed).
   ⚠ Every width/count below is a BIN EDGE of a stored histogram — never a rule, never a
   threshold: no face's WORD depends on one, and every published cut re-derives off disk.    */
/* ========================================================================== */
const REL_BIN = 0.25; const REL_BINS = 20;    // the cushion release speed relative to the body
const NRM_BIN = 0.25; const NRM_BINS = 20;    // its component along the body→ball normal
const BSP_BIN = 1; const BSP_BINS = 12;       // the body's own speed at contact
const SPD_BIN = 2; const SPD_BINS = 13;       // the attempt's frozen `relativeSpeed`
const OPP_BIN = 1; const OPP_BINS = 16;       // nearest-opponent distance, contact and end
const PRS_BIN = 0.1; const PRS_BINS = 11;     // `pressureAt`, contact and end
const DSP_BIN = 0.1; const DSP_BINS = 20;     // ball / body displacement across the window
const WIN_BIN = 1; const WIN_BINS = 10;       // the window's own length in ticks
const GROUPS = ['intended', 'all'] as const;  // INTENDED TARGETS primary, all bodies beside
type Group = (typeof GROUPS)[number];
const GI = (g: Group): number => GROUPS.indexOf(g);
/** the physics CELLS whose P(no possession | cell) is published */
const PHYS_CELLS = ['releaseSpeed', 'releaseNormal', 'bodySpeed', 'relativeSpeed',
  'oppDistContact', 'oppDistEnd', 'pressureContact', 'pressureEnd', 'windowTicks'] as const;
type PhysCell = (typeof PHYS_CELLS)[number];
const PCI = (c: PhysCell): number => PHYS_CELLS.indexOf(c);
const PHYS_BINS: Record<PhysCell, { width: number; bins: number }> = {
  releaseSpeed: { width: REL_BIN, bins: REL_BINS },
  releaseNormal: { width: NRM_BIN, bins: NRM_BINS },
  bodySpeed: { width: BSP_BIN, bins: BSP_BINS },
  relativeSpeed: { width: SPD_BIN, bins: SPD_BINS },
  oppDistContact: { width: OPP_BIN, bins: OPP_BINS },
  oppDistEnd: { width: OPP_BIN, bins: OPP_BINS },
  pressureContact: { width: PRS_BIN, bins: PRS_BINS },
  pressureEnd: { width: PRS_BIN, bins: PRS_BINS },
  windowTicks: { width: WIN_BIN, bins: WIN_BINS },
};
const PHYS_MAX = Math.max(...PHYS_CELLS.map((c) => PHYS_BINS[c].bins));
/** the pass class at the contact tick */
const PASS_CELLS = ['toFeet', 'carried'] as const;
type PassCell = (typeof PASS_CELLS)[number];
const PSI = (p: PassCell): number => PASS_CELLS.indexOf(p);

/* ========================================================================== */
/* §8 THE PER-MATCH ROW — per-seed cells (canon: per-seed cells, ruling #282.2(ii))          */
/* ========================================================================== */
interface Row {
  worldOk: boolean; armedVersion: number; genomeClean: boolean; traceOn: boolean;
  rcBfAbsent: boolean; edsTouchCost: boolean; ticks: number; matches: number; wallMs: number;
  /* (i) THE POPULATION */
  created: number[]; ended: number[];           // per group
  ledgerControlAttemptContacts: number;         // the CONTEST LEDGER's own creation record
  /* (ii) THE ENDINGS, by the engine's own sites */
  clsN: number[][];                              // [group][class]
  clsObserved: number[]; clsInferred: number[];  // per group
  /* the NOT-REACHED geometry */
  nrDisp: number[][];                            // [group][dispCell]
  nrBallBins: number[]; nrBodyBins: number[];    // intended only
  nrMarginCrossCheckN: number; nrMarginCrossCheckAgree: number;
  /* the ABANDONED-BY-CONTACT split */
  abSideKind: number[][];                        // [sideCell][kindCell] — intended only
  /* (iii) THE WINDOW'S PHYSICS — intended targets */
  physN: number[][]; physNoPoss: number[][];     // [physCell][bin]
  passN: number[]; passNoPoss: number[];         // [passCell]
  actContactN: number[]; actEndN: number[];      // [actionIndex]
  holdLiveN: number; pcSeatLive: number;
  relSum: number; nrmSum: number; bodySpeedSum: number;
  oppContactSum: number; oppEndSum: number;
  prsContactSum: number; prsEndSum: number;
  physSumN: number;
  lawPredictedInRangeN: number;
  /* (iv) THE RECONCILIATION */
  resolutions: number;                           // endings at or after readyTick (all bodies)
  ownTargetControlContacts: number; ownTargetNoPossessionAtK: number;
  /* context (the 240 s match clock) */
  goals: number; passes: number; passesCompleted: number; interceptions: number; shots: number;
  statMiscontrols: number;
}
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1, genomeClean: false, traceOn: false, rcBfAbsent: false,
  edsTouchCost: false, ticks: 0, matches: 1, wallMs: 0,
  created: zeros(2), ended: zeros(2), ledgerControlAttemptContacts: 0,
  clsN: zeros2(2, CLASSES.length), clsObserved: zeros(2), clsInferred: zeros(2),
  nrDisp: zeros2(2, DISP_CELLS.length), nrBallBins: zeros(DSP_BINS), nrBodyBins: zeros(DSP_BINS),
  nrMarginCrossCheckN: 0, nrMarginCrossCheckAgree: 0,
  abSideKind: zeros2(SIDES.length, KIND_CELLS.length),
  physN: zeros2(PHYS_CELLS.length, PHYS_MAX), physNoPoss: zeros2(PHYS_CELLS.length, PHYS_MAX),
  passN: zeros(PASS_CELLS.length), passNoPoss: zeros(PASS_CELLS.length),
  actContactN: zeros(ACTION_VOCAB.length), actEndN: zeros(ACTION_VOCAB.length),
  holdLiveN: 0, pcSeatLive: 0,
  relSum: 0, nrmSum: 0, bodySpeedSum: 0, oppContactSum: 0, oppEndSum: 0,
  prsContactSum: 0, prsEndSum: 0, physSumN: 0, lawPredictedInRangeN: 0,
  resolutions: 0, ownTargetControlContacts: 0, ownTargetNoPossessionAtK: 0,
  goals: 0, passes: 0, passesCompleted: 0, interceptions: 0, shots: 0, statMiscontrols: 0,
});

/* ========================================================================== */
/* §9 THE WALK — one match; PURE per-tick reads of `Match` state, NO WRAPPER.
   The CONTEST-EPISODE ledger and the E1a FIRST-TOUCH ledger are READ from their own public
   arrays, never re-implemented. `pendingControl` is read through a DECLARED TYPE VIEW.        */
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
/** an OPEN attempt, from its creation tick to the tick it ENDS */
interface Attempt {
  gid: number; side: Side; readyTick: number; relativeSpeed: number;
  contactTick: number; intended: boolean; passClass: PassCell;
  ballX: number; ballY: number; bodyX: number; bodyY: number;
  releaseSpeed: number; releaseNormal: number; bodySpeed: number;
  oppDistContact: number; pressureContact: number;
  actionContact: number; holdLive: boolean;
}
/** BN-C0's own-target no-possession predicate, deferred to contactTick + K */
interface OwnTargetRead { gid: number; done: boolean; possessed: boolean }

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingControl: PendingView | null;
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    traceFirstTouch: boolean; traceContests: boolean; edsTouchCost: boolean;
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
  const actIdx = (t: string): number => Math.max(0, ACTION_VOCAB.indexOf(t));
  let prevAttempt: PendingView | null = null;
  let open: Attempt | null = null;
  let ftCursor = 0;
  let epIdx = 0; let cIdx = 0;
  let prevRestart: unknown = m.restart;
  const dueK = new Map<number, OwnTargetRead[]>();
  const ownReads: OwnTargetRead[] = [];

  while (!m.finished) {
    m.step(DT);
    const tick = m.simTick;
    row.ticks += 1;
    if (!observe) continue;
    const ball = m.ball;
    const ownerGid = ball.owner !== null ? ball.owner.gid : null;

    /* ---------- ⭐⭐ THE CONTEST LEDGER, READ (an ordered cursor over its own arrays) ------- */
    const eps = m.contestEpisodes;
    const contactsThisTick: { gid: number; side: Side; kind: string; tick: number }[] = [];
    for (;;) {
      if (epIdx >= eps.length) break;
      const cs = eps[epIdx].contacts;
      if (cIdx < cs.length) {
        const c = cs[cIdx];
        cIdx += 1;
        contactsThisTick.push({ gid: c.gid, side: c.side as Side, kind: c.kind, tick: c.tick });
        continue;
      }
      if (epIdx < eps.length - 1) { epIdx += 1; cIdx = 0; continue; }
      break;
    }
    let deflectKind: 'deflection' | 'body' | null = null;
    for (const c of contactsThisTick) {
      if (c.kind === 'controlAttempt') {
        row.ledgerControlAttemptContacts += 1;
        /* ⭐ BN-C0's OWN-TARGET predicate, REUSED: an own-target contact recorded
           `controlAttempt`, read at contactTick + K for possession by that same body. */
        const pp0 = mm.pendingPass;
        if (pp0 !== null && pp0.targetGid === c.gid && pp0.side === c.side) {
          const rec: OwnTargetRead = { gid: c.gid, done: false, possessed: false };
          ownReads.push(rec);
          const arr = dueK.get(tick + K_TICKS);
          if (arr === undefined) dueK.set(tick + K_TICKS, [rec]); else arr.push(rec);
        }
      }
      if (c.kind === 'deflection') deflectKind = 'deflection';
      else if (c.kind === 'body' && deflectKind === null) deflectKind = 'body';
    }
    const dueNow = dueK.get(tick);
    if (dueNow !== undefined) {
      for (const r of dueNow) {
        r.done = true;
        r.possessed = ownerGid !== null && ownerGid === r.gid;
      }
      dueK.delete(tick);
    }

    /* ---------- THE E1a FIRST-TOUCH LEDGER, READ ---------- */
    const trace = m.firstTouchTrace;
    const rollFailThisTick = new Set<number>();
    for (let i = ftCursor; i < trace.length; i++) {
      if (!trace[i].clean) rollFailThisTick.add(trace[i].gid);
    }
    ftCursor = trace.length;

    /* ---------- THE OFFSIDE / DEAD-BALL SIGNATURES (the engine's own records) ---------- */
    const restartNow = m.restart;
    const newRestart = restartNow !== null && restartNow !== prevRestart;
    const offsideThisTick = newRestart
      && (restartNow as unknown as { offside?: boolean }).offside === true;
    const deadBallThisTick = newRestart || m.phase !== 'playing' || m.finished;
    prevRestart = restartNow;

    /* ---------- ⭐⭐ THE POPULATION — every `pendingControl`, CREATED to ENDED ---------- */
    const cur = mm.pendingControl;
    const changed = (prevAttempt === null) !== (cur === null)
      || (prevAttempt !== null && cur !== null
        && (cur.gid !== prevAttempt.gid || cur.readyTick !== prevAttempt.readyTick));
    if (changed && open !== null) {
      /* ---- THE ENDING, ATTRIBUTED ---- */
      const a = open;
      const p = players[a.gid];
      const replacedByGid = cur === null ? null : cur.gid;
      const replacedRelation: 'opponent' | 'teammate' | 'sameReceiver' | null = cur === null
        ? null : cur.gid === a.gid ? 'sameReceiver'
          : (players[cur.gid].side as Side) === a.side ? 'teammate' : 'opponent';
      const input: EndInput = {
        atOrAfterReady: tick >= a.readyTick,
        offsideThisTick,
        rollFail: rollFailThisTick.has(a.gid),
        ownsBall: ownerGid !== null && ownerGid === a.gid,
        stunnedOrOff: p.sentOff || p.stunTimer > 0,
        replacedByGid,
        replacedRelation,
        deflectionKindThisTick: deflectKind,
        deadBallThisTick,
        otherOwnerGid: ownerGid !== null && ownerGid !== a.gid ? ownerGid : null,
      };
      const cls = classOf(input);
      const groups: Group[] = a.intended ? ['intended', 'all'] : ['all'];
      for (const g of groups) {
        const gi = GI(g);
        row.ended[gi] += 1;
        row.clsN[gi][CI(cls)] += 1;
        if (CLASS_OBSERVED[cls]) row.clsObserved[gi] += 1; else row.clsInferred[gi] += 1;
      }
      if (input.atOrAfterReady) row.resolutions += 1;
      const ballDisp = Math.hypot(ball.pos.x - a.ballX, ball.pos.y - a.ballY);
      const bodyDisp = Math.hypot(p.pos.x - a.bodyX, p.pos.y - a.bodyY);
      if (cls === 'resolvedNotReachedMargin' || cls === 'resolvedNotReachedStunnedOrOff') {
        const d = dispCellOf(ballDisp, bodyDisp);
        for (const g of groups) row.nrDisp[GI(g)][DPI(d)] += 1;
        if (a.intended) {
          row.nrBallBins[binOf(ballDisp, DSP_BIN, DSP_BINS)] += 1;
          row.nrBodyBins[binOf(bodyDisp, DSP_BIN, DSP_BINS)] += 1;
        }
        /* ⭐ THE GEOMETRY CROSS-CHECK — the SHIPPED `directBallAccess`, RE-CALLED at the end
           tick against the resolver's own retention-margin test (a declared reconstruction). */
        if (!p.sentOff) {
          row.nrMarginCrossCheckN += 1;
          const acc = directBallAccess(p, ball, players, CONTROL_RADIUS);
          const exceeded = acc.geometry.centerDistance
            > acc.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN;
          if (exceeded === (cls === 'resolvedNotReachedMargin')) {
            row.nrMarginCrossCheckAgree += 1;
          }
        }
      }
      if (cls === 'abandonedContactOpponent' || cls === 'abandonedContactTeammate'
        || cls === 'abandonedContactSameReceiver') {
        const sc: SideCell = cls === 'abandonedContactOpponent' ? 'opponent'
          : cls === 'abandonedContactTeammate' ? 'teammate' : 'sameReceiver';
        const kindHere = contactsThisTick.find((c) => c.gid === replacedByGid);
        if (a.intended) row.abSideKind[SDI(sc)][KDI(kindHere?.kind ?? 'silent')] += 1;
      }
      /* ---- ⭐ THE WINDOW'S PHYSICS, on INTENDED TARGETS (all bodies enter `all` counts) ---- */
      if (a.intended) {
        const noPoss = cls !== POSSESSION_CLASS;
        const oppEnd = (() => {
          let best = Infinity;
          for (const o of m.teams[1 - a.side].players) {
            if (o.sentOff) continue;
            const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
            if (d < best) best = d;
          }
          return best;
        })();
        const prsEnd = pressureAt(p.pos, m.teams[1 - a.side].players);
        const vals: Record<PhysCell, number> = {
          releaseSpeed: a.releaseSpeed, releaseNormal: a.releaseNormal,
          bodySpeed: a.bodySpeed, relativeSpeed: a.relativeSpeed,
          oppDistContact: a.oppDistContact, oppDistEnd: Number.isFinite(oppEnd) ? oppEnd : 0,
          pressureContact: a.pressureContact, pressureEnd: prsEnd,
          windowTicks: tick - a.contactTick,
        };
        for (const c of PHYS_CELLS) {
          const bi = binOf(vals[c], PHYS_BINS[c].width, PHYS_BINS[c].bins);
          row.physN[PCI(c)][bi] += 1;
          if (noPoss) row.physNoPoss[PCI(c)][bi] += 1;
        }
        row.passN[PSI(a.passClass)] += 1;
        if (noPoss) row.passNoPoss[PSI(a.passClass)] += 1;
        row.actContactN[a.actionContact] += 1;
        row.actEndN[actIdx(p.action.type)] += 1;
        if (a.holdLive) row.holdLiveN += 1;
        row.relSum += a.releaseSpeed; row.nrmSum += a.releaseNormal;
        row.bodySpeedSum += a.bodySpeed;
        row.oppContactSum += a.oppDistContact;
        row.oppEndSum += Number.isFinite(oppEnd) ? oppEnd : 0;
        row.prsContactSum += a.pressureContact; row.prsEndSum += prsEnd;
        row.physSumN += 1;
        /* the CONTACT LAW'S OWN PREDICTION, anchored beside: the release along the normal is
           clamped into [CONTACT_RELEASE_MIN_SPEED, CONTACT_RELEASE_MAX_SPEED] by construction */
        if (a.releaseNormal >= CONTACT_RELEASE_MIN_SPEED - 1e-9
          && a.releaseNormal <= CONTACT_RELEASE_MAX_SPEED + 1e-9) row.lawPredictedInRangeN += 1;
      }
      open = null;
    }
    if (changed && cur !== null) {
      /* ---- THE CREATION (`applyControlContact`'s ONE site), observed at the tick boundary ---- */
      const p = players[cur.gid];
      const side = p.side as Side;
      const pp = mm.pendingPass;
      const intended = pp !== null && pp.targetGid === cur.gid && pp.side === side;
      const nx = ball.pos.x - p.pos.x;
      const ny = ball.pos.y - p.pos.y;
      const nl = Math.max(Math.hypot(nx, ny), 1e-9);
      const rvx = ball.vel.x - p.vel.x;
      const rvy = ball.vel.y - p.vel.y;
      let oppBest = Infinity;
      for (const o of m.teams[1 - side].players) {
        if (o.sentOff) continue;
        const d = Math.hypot(o.pos.x - p.pos.x, o.pos.y - p.pos.y);
        if (d < oppBest) oppBest = d;
      }
      const holdLive = m.pcLatency !== null
        && m.pcLatency.holdSnapshot().some((h) => h.gid === cur.gid);
      if (m.pcLatency !== null) row.pcSeatLive += 1;
      open = {
        gid: cur.gid, side, readyTick: cur.readyTick, relativeSpeed: cur.relativeSpeed,
        contactTick: tick, intended, passClass: pp !== null ? 'toFeet' : 'carried',
        ballX: ball.pos.x, ballY: ball.pos.y, bodyX: p.pos.x, bodyY: p.pos.y,
        releaseSpeed: Math.hypot(rvx, rvy),
        releaseNormal: (rvx * nx + rvy * ny) / nl,
        bodySpeed: Math.hypot(p.vel.x, p.vel.y),
        oppDistContact: Number.isFinite(oppBest) ? oppBest : 0,
        pressureContact: pressureAt(p.pos, m.teams[1 - side].players),
        actionContact: actIdx(p.action.type), holdLive,
      };
      for (const g of (intended ? ['intended', 'all'] : ['all']) as Group[]) {
        row.created[GI(g)] += 1;
      }
    }
    prevAttempt = cur === null ? null : { ...cur };
  }

  if (observe) {
    for (const r of ownReads) {
      row.ownTargetControlContacts += 1;
      if (!(r.done && r.possessed)) row.ownTargetNoPossessionAtK += 1;
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
banner('BQ-C1 — gTraceInert (both traces ON vs OFF, whole-match signatures, per arm)');
const traceInertRows = TRACE_INERT_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const on = signatureOf(runOut(buildMatch(seed, arm, true)));
  const off = signatureOf(runOut(buildMatch(seed, arm, false)));
  return { seed, arm, signatureTraceOn: on, signatureTraceOff: off, equal: on === off };
}));
const TRACE_INERT_OK = traceInertRows.every((r) => r.equal);
banner(`  gTraceInert ${TRACE_INERT_OK ? 'GREEN' : 'RED'} (${traceInertRows.length} pairs)`);

/* ========================================================================== */
/* §11 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT             */
/* ========================================================================== */
banner('BQ-C1 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);

/* ========================================================================== */
/* §12 THE BATTERY — the two arms PAIRED on every seed                         */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`BQ-C1 — the battery: ${N} seeds × ${ARMS.length} arms, seeds `
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

/** the NON-POSSESSION total on a row, per group — every class except RESOLVED-CLEAN */
const nonPoss = (r: Row, g: Group): number =>
  r.ended[GI(g)] - r.clsN[GI(g)][CI(POSSESSION_CLASS)];
const clsCount = (r: Row, g: Group, c: Cls): number => r.clsN[GI(g)][CI(c)];
const parentContact = (r: Row, g: Group): number => clsCount(r, g, 'abandonedContactOpponent')
  + clsCount(r, g, 'abandonedContactTeammate') + clsCount(r, g, 'abandonedContactSameReceiver');
const parentNotReached = (r: Row, g: Group): number =>
  clsCount(r, g, 'resolvedNotReachedStunnedOrOff') + clsCount(r, g, 'resolvedNotReachedMargin');
const lineTotal = (r: Row, g: Group): number => clsCount(r, g, 'abandonedDeadBallOut')
  + clsCount(r, g, 'abandonedOffside') + clsCount(r, g, 'resolvedOffside');

/* ---- (i) THE POPULATION ---- */
for (const g of GROUPS) {
  const gi = GI(g);
  const lbl = g === 'intended' ? 'INTENDED TARGETS (PRIMARY)' : 'ALL BODIES (beside)';
  defFace(`population.${g}.attemptsPerMatch`, 'attempts per match (240 s match clock)',
    `⭐⭐ (i) PENDING CONTROLS CREATED per match — ${lbl}. The `
    + '`applyControlContact` creation site is the ONE creation site (anchored, needle count 1); '
    + 'observed at TICK BOUNDARIES through the DECLARED type view of the private '
    + '`pendingControl` field — a READ, never a write, proven byte-inert by `gLockstep`',
    'matches walked', (r) => r.created[gi], (r) => r.matches);
  defFace(`population.${g}.endingsPerMatch`, 'endings per match (240 s match clock)',
    `(i) PENDING CONTROLS that ENDED per match — ${lbl}`, 'matches walked',
    (r) => r.ended[gi], (r) => r.matches);
  defFace(`population.${g}.nonPossessionShare`, 'share',
    `⭐⭐ (i) THE NON-POSSESSION SHARE — endings in any class EXCEPT \`${POSSESSION_CLASS}\`, `
    + `${lbl}`, 'pending controls ended', (r) => nonPoss(r, g), (r) => r.ended[gi]);
  defFace(`population.${g}.observedShare`, 'share',
    '⭐⭐ (i) THE OBSERVED SHARE of endings — classes whose attribution has a UNIQUE PUBLIC '
    + 'SIGNATURE (an engine ledger entry, the engine\'s own `restart.offside`, possession, or '
    + 'the engine\'s own new `pendingControl`). The complement is INFERRED and published as '
    + 'BOUNDS (§P.B; BQ-C0 §CORR 2\'s remedy)', 'pending controls ended',
    (r) => r.clsObserved[gi], (r) => r.ended[gi]);
  defFace(`population.${g}.inferredShare`, 'share',
    '⭐⭐ (i) THE INFERRED SHARE of endings — the NOT-REACHED split, the dead-ball/out class, '
    + 'the possession-elsewhere class and the `other` class', 'pending controls ended',
    (r) => r.clsInferred[gi], (r) => r.ended[gi]);
  /* ⭐⭐ THE ENDING CLASSES — shares of EVERY ending, and of the NON-POSSESSION endings */
  for (const c of CLASSES) {
    defFace(`endings.${g}.${c}.ofAll`, 'share',
      `(ii) \`${c}\` as a share of EVERY ending, ${lbl} — ${CLASS_OBSERVED[c]
        ? 'OBSERVED (a unique public signature)' : 'INFERRED (published as a BOUND)'}`,
      'pending controls ended', (r) => clsCount(r, g, c), (r) => r.ended[gi]);
    defFace(`composition.${g}.${c}`, 'share',
      `⭐⭐ (iii) THE COMPOSITION OF NON-POSSESSION ENDINGS — \`${c}\`, ${lbl}. ${
        CLASS_OBSERVED[c] ? 'OBSERVED' : 'INFERRED — a BOUND'}`,
      'NON-POSSESSION endings', (r) => clsCount(r, g, c), (r) => nonPoss(r, g));
  }
  defFace(`composition.${g}.parent.abandonedByContact`, 'share',
    '⭐⭐ (iii) THE PARENT CLASS — ABANDONED-BY-CONTACT (opponent + teammate + the same '
    + 'receiver again), as a share of the NON-POSSESSION endings',
    'NON-POSSESSION endings', (r) => parentContact(r, g), (r) => nonPoss(r, g));
  defFace(`composition.${g}.parent.resolvedNotReached`, 'share',
    '⭐⭐ (iii) THE PARENT CLASS — RESOLVED-NOT-REACHED (the stunned/sent-off bound + the '
    + 'retention-margin bound), as a share of the NON-POSSESSION endings',
    'NON-POSSESSION endings', (r) => parentNotReached(r, g), (r) => nonPoss(r, g));
  defFace(`composition.${g}.parent.line`, 'share',
    '⭐⭐ (iii) THE LINE — dead ball / out / offside (both offside classes), as a share of the '
    + 'NON-POSSESSION endings', 'NON-POSSESSION endings',
    (r) => lineTotal(r, g), (r) => nonPoss(r, g));
  /* the NOT-REACHED geometry — the SUB-CLASS shares the reads select on */
  for (const d of DISP_CELLS) {
    defFace(`notReached.${g}.${d}OfNonPossession`, 'share',
      `⭐⭐ (iii) RESOLVED-NOT-REACHED with the ${d === 'ballLarger' ? 'BALL\'s' : d === 'bodyLarger'
        ? 'BODY\'s' : 'two'} displacement ${d === 'tie' ? 'EQUAL' : 'the LARGER'} across the `
      + 'window, as a share of the NON-POSSESSION endings — the sub-class the reads select on',
      'NON-POSSESSION endings', (r) => r.nrDisp[gi][DPI(d)], (r) => nonPoss(r, g));
    defFace(`notReached.${g}.${d}OfNotReached`, 'share',
      `(iii) the same cell as a share of the RESOLVED-NOT-REACHED class itself`,
      'RESOLVED-NOT-REACHED endings', (r) => r.nrDisp[gi][DPI(d)], (r) => parentNotReached(r, g));
  }
}
defFace('population.ledgerControlAttemptContactsPerMatch', 'contacts per match (240 s clock)',
  '⭐ THE CREATION RECEIPT — the CONTEST LEDGER\'s own `controlAttempt` contacts per match '
  + '(`traceContact(allClaims, p, \'controlAttempt\')`, anchored, written BEFORE the offside '
  + 'branch and before the creation). ⛔ never a football effect size',
  'matches walked', (r) => r.ledgerControlAttemptContacts, (r) => r.matches);
defFace('population.creationLedgerAgreementShare', 'share',
  '⭐ THE CREATION RECEIPT, as a share — pending controls the census OBSERVED created, over the '
  + 'ledger\'s own `controlAttempt` contacts. The gap is (a) contacts aborted by the offside '
  + 'branch before the creation and (b) any attempt created AND ended inside ONE tick, which a '
  + 'tick-boundary read cannot see (HONEST LIMIT). ⛔ never a football effect size',
  'ledger `controlAttempt` contacts',
  (r) => r.created[GI('all')], (r) => r.ledgerControlAttemptContacts);
defFace('notReached.marginCrossCheckAgreementShare', 'share',
  '⭐ THE GEOMETRY CROSS-CHECK — NOT-REACHED endings where the SHIPPED `directBallAccess`, '
  + 'RE-CALLED at the END tick, agrees with the class assigned (its `centerDistance` exceeds '
  + '`sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN` exactly when the census booked the '
  + 'MARGIN class). ⚠ A DECLARED RECONSTRUCTION one step after the resolver read it — a '
  + 'RECEIPT, never a class definition, and ⛔ never a football effect size',
  'NOT-REACHED endings cross-checked',
  (r) => r.nrMarginCrossCheckAgree, (r) => r.nrMarginCrossCheckN);

/* ---- (iv) THE ABANDONED-BY-CONTACT SPLIT (side × the ledger's kind) ---- */
for (const s of SIDES) {
  for (const k of KIND_CELLS) {
    defFace(`abandonedSplit.${s}.${k}`, 'share',
      `⭐⭐ (iv) THE REPLACING BODY — \`${s}\` × the CONTEST LEDGER's own kind \`${k}\``
      + `${k === 'silent' ? ' (the ledger recorded no contact by that body at that tick — '
        + 'PUBLISHED AS SUCH, never imputed)' : ''}, over ABANDONED-BY-CONTACT endings on `
      + 'INTENDED TARGETS', 'ABANDONED-BY-CONTACT endings (intended targets)',
      (r) => r.abSideKind[SDI(s)][KDI(k)],
      (r) => sum(r.abSideKind.map((rr) => sum(rr))));
  }
  defFace(`abandonedSplit.${s}.total`, 'share',
    `⭐⭐ (iv) THE REPLACING BODY — \`${s}\`, over ABANDONED-BY-CONTACT endings on INTENDED `
    + 'TARGETS', 'ABANDONED-BY-CONTACT endings (intended targets)',
    (r) => sum(r.abSideKind[SDI(s)]), (r) => sum(r.abSideKind.map((rr) => sum(rr))));
}

/* ---- (v) THE WINDOW'S PHYSICS — P(no possession | cell), INTENDED TARGETS ---- */
for (const c of PHYS_CELLS) {
  const ci = PCI(c);
  const nb = PHYS_BINS[c].bins;
  for (let b = 0; b < nb; b++) {
    defFace(`physics.noPossession.${c}.b${b}`, 'share',
      `(v) P(no possession at the end | ${c} bin ${b}: [${(b * PHYS_BINS[c].width).toFixed(3)}, `
      + `${((b + 1) * PHYS_BINS[c].width).toFixed(3)})) on INTENDED TARGETS`,
      `attempts in the bin`, (r) => r.physNoPoss[ci][b], (r) => r.physN[ci][b]);
  }
}
for (const pc of PASS_CELLS) {
  defFace(`physics.noPossession.passClass.${pc}`, 'share',
    `(v) P(no possession at the end | pass class \`${pc}\`) on INTENDED TARGETS — \`toFeet\` = a `
    + '`pendingPass` was live at the contact tick, `carried` = none was',
    'attempts in the cell', (r) => r.passNoPoss[PSI(pc)], (r) => r.passN[PSI(pc)]);
}
defFace('physics.meanReleaseSpeed', 'metres per second',
  '⭐ (v) THE CUSHION RELEASE — mean |v_ball − v_body| read from PUBLIC state at the END of the '
  + 'contact tick (ONE physics step after `applyControlContact` ran — a DECLARED phase), on '
  + 'INTENDED TARGETS', 'intended-target attempts ended',
  (r) => r.relSum, (r) => r.physSumN);
defFace('physics.meanReleaseNormalComponent', 'metres per second',
  '⭐ (v) its component along the body→ball NORMAL — the direction the contact law releases '
  + 'along. THE LAW\'S OWN PREDICTION, anchored beside: `release` is clamped into '
  + `[${CONTACT_RELEASE_MIN_SPEED}, ${CONTACT_RELEASE_MAX_SPEED}] with an incoming share of `
  + `${CONTACT_RELEASE_INCOMING_SHARE} and a tangential retention of ${CONTACT_TANGENTIAL_RETENTION}`,
  'intended-target attempts ended', (r) => r.nrmSum, (r) => r.physSumN);
defFace('physics.lawPredictedRangeShare', 'share',
  '⭐ (v) the share of intended-target attempts whose measured normal component lies inside the '
  + 'contact law\'s own clamp — ⚠ a ONE-STEP-LATER read, so a miss is physics, not a defect. '
  + '⛔ never a football effect size', 'intended-target attempts ended',
  (r) => r.lawPredictedInRangeN, (r) => r.physSumN);
defFace('physics.meanBodySpeedAtContact', 'metres per second',
  '(v) the RECEIVER\'s own speed at the contact tick', 'intended-target attempts ended',
  (r) => r.bodySpeedSum, (r) => r.physSumN);
defFace('physics.meanOpponentDistanceAtContact', 'metres',
  '(v) the NEAREST OPPONENT\'s distance at the contact tick — `pressureAt`\'s own input, a '
  + 'DECLARED reconstruction from public state', 'intended-target attempts ended',
  (r) => r.oppContactSum, (r) => r.physSumN);
defFace('physics.meanOpponentDistanceAtEnd', 'metres',
  '(v) the same at the END tick', 'intended-target attempts ended',
  (r) => r.oppEndSum, (r) => r.physSumN);
defFace('physics.meanPressureAtContact', 'pressure (1 at 0 m, 0 beyond PRESSURE_RADIUS_M)',
  '(v) the SHIPPED `pressureAt` CALLED at the contact tick', 'intended-target attempts ended',
  (r) => r.prsContactSum, (r) => r.physSumN);
defFace('physics.meanPressureAtEnd', 'pressure (1 at 0 m, 0 beyond PRESSURE_RADIUS_M)',
  '(v) the SHIPPED `pressureAt` CALLED at the END tick', 'intended-target attempts ended',
  (r) => r.prsEndSum, (r) => r.physSumN);
defFace('physics.holdLiveShare', 'share',
  '⭐ (v) A PC HOLD LIVE at the contact tick — a pure `holdSnapshot()` read of the seat\'s own '
  + 'map (PC-T0\'s reaction-latency seat, which world 12 ARMS). ⛔ the census does not adjudicate '
  + 'what a hold does; it publishes the cell',
  'intended-target attempts ended', (r) => r.holdLiveN, (r) => r.physSumN);
defFace('physics.pcSeatLiveShare', 'share',
  'THE SEAT RECEIPT — creations at which `match.pcLatency` was NOT null (whether the seat '
  + 'exists at all on this world). ⛔ never a football effect size',
  'pending controls created (all bodies)',
  (r) => r.pcSeatLive, (r) => r.created[GI('all')]);
for (let i = 0; i < ACTION_VOCAB.length; i++) {
  defFace(`physics.actionAtContact.${ACTION_VOCAB[i]}`, 'share',
    `(v) the receiver's \`action.type\` at the CONTACT tick — \`${ACTION_VOCAB[i]}\``,
    'intended-target attempts ended', (r) => r.actContactN[i], (r) => r.physSumN);
  defFace(`physics.actionAtEnd.${ACTION_VOCAB[i]}`, 'share',
    `(v) the receiver's \`action.type\` at the END tick — \`${ACTION_VOCAB[i]}\``,
    'intended-target attempts ended', (r) => r.actEndN[i], (r) => r.physSumN);
}

/* ---- (vi) THE RECONCILIATION FACE — the three censuses' denominators, ONCE ---- */
defFace('reconciliation.pendingCreatedPerMatch', 'pending controls per match (240 s clock)',
  '⭐⭐ (vi) DENOMINATOR 1 — every `pendingControl` CREATED (all bodies)', 'matches walked',
  (r) => r.created[GI('all')], (r) => r.matches);
defFace('reconciliation.resolutionsPerMatch', 'resolutions per match (240 s clock)',
  '⭐⭐ (vi) DENOMINATOR 2 — endings AT OR AFTER `readyTick` (BQ-C0\'s own population)',
  'matches walked', (r) => r.resolutions, (r) => r.matches);
defFace('reconciliation.ownTargetControlContactsPerMatch', 'contacts per match (240 s clock)',
  '⭐⭐ (vi) DENOMINATOR 3 — BN-C0\'s own: first contacts by the INTENDED TARGET recorded '
  + '`controlAttempt` in the contest ledger', 'matches walked',
  (r) => r.ownTargetControlContacts, (r) => r.matches);
defFace('reconciliation.rollFailShareOfNonPossession', 'share',
  '⭐⭐ (vi) #383 item 4(iii)\'s 0.163509, RE-DERIVED ON THIS BLOCK with DECLARED denominators: '
  + 'RESOLVED-ROLL-FAIL endings ÷ NON-POSSESSION endings, on ALL BODIES',
  'NON-POSSESSION endings (all bodies)',
  (r) => clsCount(r, 'all', 'resolvedRollFail'), (r) => nonPoss(r, 'all'));
defFace('reconciliation.rollFailShareOfNonPossessionIntended', 'share',
  '⭐⭐ (vi) the same on INTENDED TARGETS', 'NON-POSSESSION endings (intended targets)',
  (r) => clsCount(r, 'intended', 'resolvedRollFail'), (r) => nonPoss(r, 'intended'));
defFace('reconciliation.bnc0OwnTargetNoPossessionShare', 'share',
  '⭐⭐ (vi) BN-C0\'s OWN-TARGET NO-POSSESSION PREDICATE, REUSED on these walks: an own-target '
  + 'contact recorded `controlAttempt`, read at contactTick + K for possession by that SAME '
  + `body (K = ${K_TICKS} = CONTACT_CONTROL_DELAY_TICKS, imported). BN-C0 printed 0.227241 = `
  + '1 − 0.772759 on its OWN block and denominator',
  'own-target `controlAttempt` contacts',
  (r) => r.ownTargetNoPossessionAtK, (r) => r.ownTargetControlContacts);

/* ---- CONTEXT (rates on the 240 s match clock; 1 sim-s = 22.5 display-s) ---- */
defFace('context.goalsPerMatch', 'goals per match (240 s match clock)',
  'CONTEXT — the world is unchanged', 'matches walked', (r) => r.goals, (r) => r.matches);
defFace('context.passesPerMatch', 'passes per match (240 s match clock)', 'CONTEXT',
  'matches walked', (r) => r.passes, (r) => r.matches);
defFace('context.passCompletionShare', 'share', 'CONTEXT', 'passes',
  (r) => r.passesCompleted, (r) => r.passes);
defFace('context.miscontrolsPerMatch', 'miscontrols per match (240 s match clock)',
  'CONTEXT — the engine\'s own team stat', 'matches walked',
  (r) => r.statMiscontrols, (r) => r.matches);
defFace('context.ticksPerMatch', 'ticks per match', 'CONTEXT', 'matches walked',
  (r) => r.ticks, (r) => r.matches);

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
  if (f === undefined) { banner(`BQ-C1 FATAL — unknown face ${k}/${arm}`); process.exit(3); }
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
/* §14 THE PRE-REGISTERED READS — #383 item 6(vi)'s SENTENCES, VERBATIM.
   The SELECTORS are STORED booleans computed by the FROZEN majority rule on the composition
   of NON-POSSESSION endings, on INTENDED TARGETS. E is the READ OF RECORD; D prints beside.  */
/* ========================================================================== */
const S_ROLLFAIL = 'THE WINDOW IS THE COIN AFTER ALL — BQ-T0 re-forms the roll.';
const S_DUEL = 'THE WINDOW IS A DUEL — the defender\'s poke inside three ticks; 「被断」 not '
  + '「弹回」; the contest law and the pressure world are named.';
const S_CROWDING = 'THE WINDOW IS CROWDING — steps ②/③ are named.';
const S_CUSHION = 'THE WINDOW IS THE CUSHION — the contact law\'s release constants are named; '
  + 'the ball runs away from the foot.';
const S_FEET = 'THE WINDOW IS THE RECEIVER\'S FEET — he runs off the ball; the executor\'s plan '
  + 'inside the window is named.';
const S_LINE = 'THE WINDOW IS THE LINE — not a control question.';
const S_MIXED = 'THE WINDOW IS MIXED — the commander decides with the table.';
/** ⭐ THE PARENT-WITH-MIXED FORM, FROZEN: a parent class holding the majority while NEITHER of
 *  its sub-classes does prints the PARENT'S NAME with the MIXED literal APPENDED. */
const PARENT_PREFIX = {
  abandonedByContact: 'ABANDONED-BY-CONTACT — ',
  resolvedNotReached: 'RESOLVED-NOT-REACHED — ',
} as const;
const READ_LITERALS: readonly string[] = [
  S_ROLLFAIL, S_DUEL, S_CROWDING, S_CUSHION, S_FEET, S_LINE, S_MIXED,
  PARENT_PREFIX.abandonedByContact + S_MIXED, PARENT_PREFIX.resolvedNotReached + S_MIXED,
];
const AGREE_SENTENCE = {
  agrees: 'THE DOSED WORLD AGREES ON THE MAJORITY CLASS',
  disagrees: 'THE DOSED WORLD DISAGREES ON THE MAJORITY CLASS',
} as const;
/** ⭐⭐ THE MAJORITY RULE, FROZEN: majority = share > 0.5 on the NON-POSSESSION total. */
const isMajority = (s: number): boolean => Number.isFinite(s) && s > 0.5;
interface ReadOut {
  nonPossessionEndings: number;
  shares: Record<string, number | null>;
  majority: Record<string, boolean>;
  noMajority: boolean;
  majorityClass: string;
  sentence: string;
}
const readFor = (rows: readonly Row[]): ReadOut => {
  const g: Group = 'intended';
  const den = sum(rows.map((r) => nonPoss(r, g)));
  const sh = (n: number): number => ratio(n, den);
  const shares: Record<string, number> = {};
  for (const c of CLASSES) shares[c] = sh(sum(rows.map((r) => clsCount(r, g, c))));
  shares.parentAbandonedByContact = sh(sum(rows.map((r) => parentContact(r, g))));
  shares.parentResolvedNotReached = sh(sum(rows.map((r) => parentNotReached(r, g))));
  shares.line = sh(sum(rows.map((r) => lineTotal(r, g))));
  for (const d of DISP_CELLS) {
    shares[`notReached_${d}`] = sh(sum(rows.map((r) => r.nrDisp[GI(g)][DPI(d)])));
  }
  const majority: Record<string, boolean> = {};
  for (const k of Object.keys(shares)) majority[k] = isMajority(shares[k]);
  let majorityClass = 'mixed';
  let sentence = S_MIXED;
  if (majority.resolvedRollFail) {
    majorityClass = 'resolvedRollFail'; sentence = S_ROLLFAIL;
  } else if (majority.parentAbandonedByContact) {
    if (majority.abandonedContactOpponent) {
      majorityClass = 'abandonedContactOpponent'; sentence = S_DUEL;
    } else if (majority.abandonedContactTeammate) {
      majorityClass = 'abandonedContactTeammate'; sentence = S_CROWDING;
    } else {
      majorityClass = 'abandonedByContact.mixed';
      sentence = PARENT_PREFIX.abandonedByContact + S_MIXED;
    }
  } else if (majority.parentResolvedNotReached) {
    if (majority.notReached_ballLarger) {
      majorityClass = 'notReached.ballLarger'; sentence = S_CUSHION;
    } else if (majority.notReached_bodyLarger) {
      majorityClass = 'notReached.bodyLarger'; sentence = S_FEET;
    } else {
      majorityClass = 'resolvedNotReached.mixed';
      sentence = PARENT_PREFIX.resolvedNotReached + S_MIXED;
    }
  } else if (majority.line) {
    majorityClass = 'line'; sentence = S_LINE;
  }
  const outShares: Record<string, number | null> = {};
  for (const k of Object.keys(shares)) {
    outShares[k] = Number.isFinite(shares[k]) ? shares[k] : null;
  }
  return {
    nonPossessionEndings: den, shares: outShares, majority,
    noMajority: majorityClass === 'mixed', majorityClass, sentence,
  };
};
const READS: Record<Arm, ReadOut> = {
  E: readFor(armRows('E')), D: readFor(armRows('D')),
};
const DOSED_AGREES = READS.E.majorityClass === READS.D.majorityClass;
const AGREE_WORD = DOSED_AGREES ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees;
const READ_OF_RECORD = READS.E.sentence;
const READ_LIST = [READ_OF_RECORD, AGREE_WORD];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form                                      */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
const SIZING_TARGET = 0.02;
const SIZING_TARGET_TIGHTER = 0.01;
/** the §DEV-PREFLIGHT 12-cluster SCRATCH SMOKE's own realised half-widths (seeds
 *  900,003,000–011), read out of the smoke artifact's own `faces[].halfWidth` fields on the E
 *  arm — never re-typed from the console's rounded print. The reads rest on the COMPOSITION of
 *  NON-POSSESSION endings, so those class shares are what is sized. */
const SIZED_FACES: { face: string; group: string; hwSmoke: number }[] = [
  { face: 'composition.intended.resolvedRollFail@E',
    group: '⭐⭐ THE COMPOSITION — RESOLVED-ROLL-FAIL, arm E',
    hwSmoke: 0.07385471671185959 },
  { face: 'composition.intended.parent.abandonedByContact@E',
    group: '⭐⭐ THE COMPOSITION — the ABANDONED-BY-CONTACT parent, arm E',
    hwSmoke: 0.06601439496176338 },
  { face: 'composition.intended.abandonedContactOpponent@E',
    group: '⭐⭐ THE COMPOSITION — the replacing body an OPPONENT, arm E',
    hwSmoke: 0.06601439496176338 },
  { face: 'composition.intended.parent.resolvedNotReached@E',
    group: '⭐⭐ THE COMPOSITION — the RESOLVED-NOT-REACHED parent, arm E',
    hwSmoke: 0.08751715668568952 },
  { face: 'notReached.intended.ballLargerOfNonPossession@E',
    group: '⭐⭐ THE COMPOSITION — NOT-REACHED with the BALL\'s displacement larger, arm E',
    hwSmoke: 0.10526315789473684 },
  { face: 'notReached.intended.bodyLargerOfNonPossession@E',
    group: '⭐⭐ THE COMPOSITION — NOT-REACHED with the BODY\'s displacement larger, arm E',
    hwSmoke: 0.05849056603773585 },
];
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
  clsN: number[][]; nrDisp: number[][]; nrBallBins: number[]; nrBodyBins: number[];
  abSideKind: number[][]; physN: number[][]; physNoPoss: number[][];
  passN: number[]; actContactN: number[]; actEndN: number[];
};
const emptyPooled = (): Pooled => ({
  clsN: zeros2(2, CLASSES.length), nrDisp: zeros2(2, DISP_CELLS.length),
  nrBallBins: zeros(DSP_BINS), nrBodyBins: zeros(DSP_BINS),
  abSideKind: zeros2(SIDES.length, KIND_CELLS.length),
  physN: zeros2(PHYS_CELLS.length, PHYS_MAX), physNoPoss: zeros2(PHYS_CELLS.length, PHYS_MAX),
  passN: zeros(PASS_CELLS.length), actContactN: zeros(ACTION_VOCAB.length),
  actEndN: zeros(ACTION_VOCAB.length),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto2(p.clsN, r.clsN); addInto2(p.nrDisp, r.nrDisp);
    addInto(p.nrBallBins, r.nrBallBins); addInto(p.nrBodyBins, r.nrBodyBins);
    addInto2(p.abSideKind, r.abSideKind);
    addInto2(p.physN, r.physN); addInto2(p.physNoPoss, r.physNoPoss);
    addInto(p.passN, r.passN);
    addInto(p.actContactN, r.actContactN); addInto(p.actEndN, r.actEndN);
  }
  return p;
};
const mediansFrom = (p: Pooled): Record<string, unknown> => ({
  notReachedBallDisplacementMetres: binMedian(p.nrBallBins, DSP_BIN),
  notReachedBodyDisplacementMetres: binMedian(p.nrBodyBins, DSP_BIN),
  physics: PHYS_CELLS.map((c) => binMedian(p.physN[PCI(c)], PHYS_BINS[c].width)),
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
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, ...TRACE_INERT_SEEDS, CURVE_PIN_SEED];
const NONEMPTY_CLASSES = ARMS.flatMap((arm) => CLASSES
  .filter((c) => tot(arm, (r) => clsCount(r, 'all', c)) > 0).map((c) => `${arm}.${c}`));
const EMPTY_CLASSES = ARMS.flatMap((arm) => CLASSES
  .filter((c) => tot(arm, (r) => clsCount(r, 'all', c)) === 0).map((c) => `${arm}.${c}`));
const OTHER_TOTALS = Object.fromEntries(ARMS.map((arm) =>
  [arm, tot(arm, (r) => clsCount(r, 'all', 'abandonedOther'))]));

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
      + '`rcReady`, `bfFacingCost` all !== true); `info.genome` carries no world-12 pin, no '
      + 'corridor weight and no RC gene (canon: dose placement, #270.2 / #334 item 1); and '
      + `\`m.edsTouchCost\` reads ${EDS_TOUCH_COST} on every match of both arms (the `
      + `${CURVE_MEASURED.toUpperCase()} curve), unanimous on the curve pin at seed `
      + `${CURVE_PIN_SEED}`,
  },
  gDoseSource: {
    ok: L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN
      && DOSED_ARM_REACHABLE,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + `self-declared field". The FILE BYTES of \`${L3_DOSE_FILE}\` hash to `
      + `${L3_DOSE_BYTES_SHA} and \`${PC_DOSE_FILE}\` to ${PC_DOSE_BYTES_SHA}, both equal to `
      + '#383 item 6\'s pinned values; the SHIPPED loaders were CALLED and the dosed arm is '
      + 'non-empty. A mismatch is `process.exit(3)` BEFORE any seed is walked',
  },
  gTraceInert: {
    ok: TRACE_INERT_OK,
    note: '⭐⭐ BOTH trace flags ONLY RECORD: the same out-of-band scratch seed built with '
      + '`traceFirstTouch` AND `traceContests` ON and with both OFF runs to completion with a '
      + `BYTE-IDENTICAL whole-match signature, on ${traceInertRows.length} arm × seed pairs `
      + `(seeds ${TRACE_INERT_SEEDS.join(', ')})`,
  },
  gSiteEnumeration: {
    ok: NULL_SITES_FOUND.length === SITE_PURPOSES.length
      && NULL_SITES_FOUND.every((s, i) => s.line === SITE_PURPOSES[i].line)
      && CREATE_SITES_FOUND.length === 1
      && SITE_PURPOSES.every((s) => s.purpose.length > 0),
    note: '⭐⭐ canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and '
      + `enumerates EVERY occurrence's site". The needle \`${NULL_NEEDLE}\` occurs `
      + `${NULL_SITES_FOUND.length} times in \`${MATCH_PATH}\` — at lines `
      + `${NULL_SITES_FOUND.map((s) => s.line).join(', ')} — and EVERY one is listed in the `
      + 'artifact\'s `sites` block with its LINE and its PURPOSE, read from the surrounding '
      + `code. The ONE creation site \`${CREATE_NEEDLE}\` occurs `
      + `${CREATE_SITES_FOUND.length} time, at line `
      + `${CREATE_SITES_FOUND.map((s) => s.line).join(', ')}`,
  },
  gAttributionExhaustive: {
    ok: ARMS.every((arm) => GROUPS.every((g) =>
      tot(arm, (r) => sum(r.clsN[GI(g)])) === tot(arm, (r) => r.ended[GI(g)])
      && tot(arm, (r) => r.clsObserved[GI(g)] + r.clsInferred[GI(g)])
        === tot(arm, (r) => r.ended[GI(g)])
      && tot(arm, (r) => sum(r.nrDisp[GI(g)])) === tot(arm, (r) => parentNotReached(r, g))))
      && ARMS.every((arm) => tot(arm, (r) => sum(r.abSideKind.map((x) => sum(x))))
        === tot(arm, (r) => parentContact(r, 'intended'))),
    note: '⭐⭐ EVERY ended attempt lands in EXACTLY ONE class: per arm and per group the '
      + 'class counts SUM to the endings, the OBSERVED and INFERRED counts sum to the same '
      + 'total, the displacement cells sum to the RESOLVED-NOT-REACHED parent, and the '
      + 'side × kind table sums to the ABANDONED-BY-CONTACT parent on intended targets. The '
      + `OBSERVED classes are ${CLASSES.filter((c) => CLASS_OBSERVED[c]).join(', ')}; the `
      + `INFERRED ones (published as BOUNDS) are `
      + `${CLASSES.filter((c) => !CLASS_OBSERVED[c]).join(', ')}`,
  },
  gLedgerNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.created[GI('all')]) > 0
      && tot(arm, (r) => r.created[GI('intended')]) > 0
      && tot(arm, (r) => nonPoss(r, 'intended')) > 0
      && tot(arm, (r) => r.ledgerControlAttemptContacts) > 0
      && tot(arm, (r) => r.ownTargetControlContacts) > 0),
    note: '⭐ ATTEMPTS EXIST on both arms: pending controls created, intended-target creations, '
      + 'non-possession endings, contest-ledger `controlAttempt` contacts and BN-C0 own-target '
      + 'contacts are all non-zero. EVERY NON-EMPTY CLASS IS NAMED: '
      + `${NONEMPTY_CLASSES.join(', ')}${EMPTY_CLASSES.length > 0
        ? `; the EMPTY ones are ${EMPTY_CLASSES.join(', ')}` : '; no class is empty'}`
      + '. THE OTHER RECEIPT: `abandonedOther` totals '
      + `${JSON.stringify(OTHER_TOTALS)} (all bodies) — published, never imputed`,
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call '
      + `site — anchored match + line receipt — never first-occurrence". ${ANCHORS.length} `
      + 'anchors, EVERY one at its own occurrence count: the delay '
      + `${CONTACT_CONTROL_DELAY_TICKS} ticks · the retention margin `
      + `${CONTACT_CONTROL_RETENTION_MARGIN} · the release constants `
      + `${CONTACT_RELEASE_MIN_SPEED}/${CONTACT_RELEASE_MAX_SPEED}/`
      + `${CONTACT_RELEASE_INCOMING_SHARE} · the tangential retention `
      + `${CONTACT_TANGENTIAL_RETENTION} · the commit time ${CONTACT_COMMIT_TIME} · `
      + `CONTROL_RADIUS ${CONTROL_RADIUS} · the resolver's two pre-roll return lines · the `
      + `roll's own early return · \`pressureAt\`'s whole body (radius ${PRESSURE_RADIUS_M}) · `
      + `the ledger's ${KIND_VOCAB.length}-kind vocabulary and the `
      + `${ACTION_VOCAB.length}-name action vocabulary, both PARSED off \`src/\` at run time`,
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `⭐ ${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk fixtures: the `
      + 'FROZEN class precedence on CONSTRUCTED endings (including the three precedence '
      + 'guards — the resolver beats a replacement, a replacement beats a deflection kind, and '
      + 'offside beats everything), the displacement comparison, the parsed vocabularies, the '
      + 'site counts, and the reconciliation arithmetic on constructed counts',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => parentNotReached(r, 'all')) > 0
      && tot(arm, (r) => parentContact(r, 'all')) > 0
      && tot(arm, (r) => clsCount(r, 'all', 'resolvedClean')) > 0
      && tot(arm, (r) => clsCount(r, 'all', 'resolvedRollFail')) > 0),
    note: '⭐ THE FOUR CLASSES THE READS CAN SELECT are all reachable on both arms: '
      + 'RESOLVED-CLEAN, RESOLVED-ROLL-FAIL, the ABANDONED-BY-CONTACT parent and the '
      + 'RESOLVED-NOT-REACHED parent all carry counts, so no read is unreachable by '
      + 'construction',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + '`Match` state after `m.step(DT)` (the contest-episode ledger, the E1a ledger, the '
      + '`pendingControl` TYPE VIEW, `pendingPass`, `restart`, `phase`, `ball.owner`, the '
      + 'players\' own fields and the PC seat\'s `holdSnapshot()`), and the only engine '
      + 'functions it calls are the SHIPPED `directBallAccess` and `pressureAt` — both PURE '
      + 'queries of state. Proven anyway — the same scratch seed walked OBSERVED and '
      + `UNOBSERVED yields a BYTE-IDENTICAL whole-match signature on all ${lockstepRows.length}`
      + ' arm × out-of-band-scratch-seed walks',
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
      + 'the construction receipt lie inside block 12,542,000–999, each seed is walked ONCE PER '
      + `ARM (${ARMS.length} arms ⇒ ${walksBooked} walks booked), the unwalked tail `
      + `${UNWALKED_TAIL} is DECLARED in the \`seeds\` block, and EVERY scratch seed this `
      + 'instrument walks is out-of-band and STORED there — canon, VERBATIM: "verifier scratch '
      + 'walks use the stage\'s own consumed band or the out-of-band scratch range '
      + '(≥ 900,000,000) — never the next virgin block"',
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
  'curve', 'sites', 'classes', 'displacementCells', 'sideCells', 'kindCells', 'physicsCells',
  'passCells', 'actionVocabulary', 'groups', 'doseSource', 'seeds', 'stats', 'anchoredSites',
  'fixtures', 'lockstep', 'traceInert', 'perf', 'sizing', 'perSeedCells', 'constructionReceipt',
] as const;

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BQ-C1',
    title: '「三拍」 THE ATTEMPT-WINDOW CENSUS — every pendingControl tracked from the cushioning '
      + 'contact to the tick it ENDS, the ending attributed to the engine\'s own `= null` '
      + 'sites, and one frozen sentence naming what the quality law must address',
    doc: 'docs/world-model/BQ-C1-ATTEMPT-WINDOW-CENSUS.md',
    lineage: 'PT-C0 → the RC arc → RC-T1b (FAIL: not readiness) → BN-C0 (not the sector) → '
      + 'BQ-C0 (not the coin — it is honest, has no heavy face, and its failures are at most '
      + '0.163509 of the control attempts that end without possession) → #383 item 4(iii) (THE '
      + 'WINDOW, a LABELLED HYPOTHESIS with its probe) → #383 item 6 (this census).',
    censusFormOfRecord: 'docs/world-model/BQ-C0-FIRST-TOUCH-CENSUS.md',
    authorizedBy: 'COMMANDER RULING #383 item 6',
    contract: 'BK-BODYBALL-CONTRACT.md §2 M-BK.2 + §3 STATUS',
    userVerdictVerbatim: '12我看了下,还是有人挤人,传不出去球,传到人身上弹回,或经常传到对面身上',
    theQuestion: 'when a control attempt ends WITHOUT possession, what ended it?',
    kind: 'CENSUS — it publishes MEASUREMENTS. It scores no hypothesis and arms no mechanism. '
      + 'The READ SENTENCES of #383 item 6(vi) are FROZEN LITERALS selected by STORED booleans. '
      + 'The commander rules.',
    xSrcZero: 'no file under `src/` is created or edited. The probe CALLS the shipped exports '
      + '(`directBallAccess`, `pressureAt`, the composer, the dose loaders) and reads `Match` '
      + 'state per tick; the CONTEST-EPISODE ledger and the E1a FIRST-TOUCH ledger are READ, '
      + 'never re-implemented; the `= null` sites are ANCHORED, never re-implemented. THERE IS '
      + 'NO WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte PER ARM, and '
      + '`gTraceInert` proves BOTH trace flags byte-inert.',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3). THE `= null` SITES ARE THE LEDGER.',
    canonCounterfactualWordsAreStored: 'VERBATIM: "a counterfactual verdict sentence (\'had X '
      + 'been scored, the rule would read W\') quotes a word the instrument STORED by applying '
      + 'the frozen rule to X\'s stored interval; a universal sentence about a table (\'every '
      + 'bin\', \'the one bin\') is a stored boolean or is not written" (home: '
      + 'BF-T1-FACING-COST-EXAM.md §COMMANDER CORRECTIONS items 1–2, ruling #378 item 2).',
    headAtRun: gitOut('git rev-parse HEAD'),
    instrumentSha256: sha(readFileSync('scripts/probes/bq-c1-attempt-window-census.ts', 'utf8')),
    honestLimits: 'NONE STORED — canon, VERBATIM: "a stage doc\'s HONEST LIMITS list is the ONE '
      + 'home; the artifact stores that list verbatim or stores none". The list of record is '
      + '§HONEST LIMITS of the stage doc.',
  },
  arms: ARMS.map((arm) => ({ arm, label: ARM_LABEL[arm] })),
  curve: {
    pinnedEdsTouchCost: EDS_TOUCH_COST, curveMeasured: CURVE_MEASURED,
    unanimousAcrossArms: CURVE_UNANIMOUS, pinSeed: CURVE_PIN_SEED,
    note: '⭐⭐ pinned on a constructed match of EACH arm BEFORE the battery and asserted on '
      + 'EVERY walked match by `gWorld`.',
  },
  sites: {
    needle: NULL_NEEDLE, file: MATCH_PATH,
    occurrenceCount: NULL_SITES_FOUND.length,
    creationNeedle: CREATE_NEEDLE, creationOccurrenceCount: CREATE_SITES_FOUND.length,
    creationLines: CREATE_SITES_FOUND.map((s) => s.line),
    enumerated: NULL_SITES_FOUND.map((s, i) => ({
      line: s.line, purpose: SITE_PURPOSES[i].purpose,
      endingClassItServes: SITE_PURPOSES[i].endingClassItServes,
    })),
    theReplacement: '⭐⭐ NOT a `= null` site: a NEW claim inside the window OVERWRITES the '
      + 'attempt at the creation site itself (`applyControlContact` assigns straight over it). '
      + 'That is what ABANDONED-BY-CONTACT is, and the census reads it off the engine\'s own '
      + '`pendingControl` field at the tick boundary.',
  },
  classes: CLASSES.map((c) => ({
    id: c, observed: CLASS_OBSERVED[c],
    signature: c === 'resolvedClean' ? 'the body OWNS the ball at the end tick (OBSERVED)'
      : c === 'resolvedRollFail'
        ? 'an E1a first-touch trace entry for that gid at that tick with `clean === false` — '
          + 'the engine\'s OWN ledger (OBSERVED)'
        : c === 'resolvedNotReachedStunnedOrOff'
          ? 'the resolver\'s pre-roll return (a): `!p || p.sentOff || p.stunTimer > 0`, read '
            + 'from PUBLIC state at the END of the tick (INFERRED — a BOUND: `stunTimer` can '
            + 'also be SET later in the same tick by a tackle, and the resolver read it '
            + 'earlier; only the SUM of the two NOT-REACHED cells is exact)'
          : c === 'resolvedNotReachedMargin'
            ? 'the resolver\'s pre-roll return (b): the RETENTION MARGIN, taken as the '
              + 'residual of the NOT-REACHED parent (INFERRED — a BOUND, with the shipped '
              + '`directBallAccess` RE-CALLED at the end tick as a cross-check receipt)'
            : c === 'resolvedOffside' || c === 'abandonedOffside'
              ? 'the engine\'s OWN offside record — a NEW `restart` object at that tick '
                + 'carrying `offside === true` (OBSERVED)'
              : c === 'abandonedContactOpponent' || c === 'abandonedContactTeammate'
                || c === 'abandonedContactSameReceiver'
                ? 'a NEW `pendingControl` at the end of that tick — the engine\'s own field, '
                  + 'written by the ONE creation site; the replacing body\'s SIDE is read off '
                  + 'his own `side` and the ledger\'s KIND off the contest episodes (OBSERVED)'
                : c === 'abandonedDeflection'
                  ? 'a contest-episode contact of kind `deflection` at that tick — the '
                    + '`tryCapture` applied-deflection site (OBSERVED)'
                  : c === 'abandonedBodyStrike'
                    ? 'a contest-episode contact of kind `body` at that tick — '
                      + '`bkApplyBodyStrike`, THE DEFLECTION PRECEDENT (OBSERVED)'
                    : c === 'abandonedDeadBallOut'
                      ? 'a NEW `restart` object, a phase outside `playing`, or the whistle at '
                        + 'that tick (INFERRED — the site itself is not observable)'
                      : c === 'abandonedPossessionElsewhere'
                        ? 'possession by a DIFFERENT body at the end of that tick — `giveBall` '
                          + 'or `kickBall` off another path (INFERRED)'
                        : 'none of the above — the RECEIPT class, PUBLISHED with its count and '
                          + 'NEVER imputed (INFERRED)',
  })),
  displacementCells: DISP_CELLS, sideCells: SIDES, kindCells: KIND_CELLS,
  physicsCells: PHYS_CELLS, passCells: PASS_CELLS, actionVocabulary: ACTION_VOCAB,
  groups: GROUPS,
  definitions: {
    thePopulation: '⭐⭐ every `pendingControl` CREATED (the `applyControlContact` site — the ONE '
      + 'creation site, anchored), tracked from its creation tick to the tick it ENDS. '
      + 'INTENDED TARGETS primary (the `pendingPass` target at creation), all bodies beside.',
    thePrivateFieldRead: '⚠ `Match.pendingControl` is declared `private` and the engine '
      + 'publishes no mirror. The census reads it through a TypeScript TYPE VIEW — a READ of '
      + 'engine state, NEVER a write; `gLockstep` proves the whole observation byte-inert. '
      + 'DECLARED here rather than assumed (the BQ-C0 precedent, #383 item 3).',
    theTickBoundary: '⚠ the population is observed at TICK BOUNDARIES, after `m.step(DT)`. An '
      + 'attempt created AND ended inside ONE tick is invisible to that read; the CONTEST '
      + 'LEDGER\'s own `controlAttempt` contact count is published beside as the receipt.',
    thePrecedence: '⭐⭐ THE FROZEN PRECEDENCE, justified by the ENGINE\'S OWN ORDER OF '
      + 'OPERATIONS: `tryCapture` calls `resolvePendingControlAttempt()` FIRST and returns if '
      + 'it consumed the tick, and the resolver\'s own clear fires UNCONDITIONALLY once '
      + '`stepCount >= readyTick` — so an ending AT OR AFTER `readyTick` is ALWAYS the '
      + 'resolver\'s site and is classified RESOLVED-* before any claim is considered. Inside '
      + 'the RESOLVED branch, offside precedes the roll because `giveBall`\'s offside branch '
      + 'returns before any bookkeeping; the roll precedes possession because a failed roll '
      + 'cannot grant it. Inside the ABANDONED branch, offside precedes everything (both '
      + 'offside sites return immediately), the REPLACEMENT precedes a deflection kind (the '
      + 'engine\'s own `pendingControl` field is the stronger record), and dead ball precedes '
      + 'possession-elsewhere.',
    theDisplacementRule: '⭐⭐ for a RESOLVED-NOT-REACHED ending: `ballDisplacement` = |ball '
      + 'position at the end tick − ball position at the contact tick|, `bodyDisplacement` the '
      + 'same for the receiver. The cell is `ballLarger` / `bodyLarger` / `tie` on a STRICT '
      + 'comparison. "The cushion ran away" and "he ran away" are exactly these two cells.',
    theCushionRead: '⚠ the cushion release is read from PUBLIC state at the END of the contact '
      + 'tick — ONE physics step after `applyControlContact` set the velocity. DECLARED. The '
      + 'contact law\'s own constants are anchored beside as the law\'s prediction, never as a '
      + 'tolerance.',
    thePressureReconstruction: '⚠ the nearest-opponent distance and the SHIPPED `pressureAt` '
      + 'are evaluated by the census at the contact tick and at the end tick — a DECLARED '
      + 'RECONSTRUCTION from public state, not the roll\'s own logged pressure (which exists '
      + 'only where a roll occurred).',
    theReconciliation: '⭐⭐ THE THREE DENOMINATORS, PRINTED TOGETHER ONCE: (1) pending controls '
      + 'CREATED (this census\'s own), (2) RESOLUTIONS — endings at or after `readyTick` '
      + '(BQ-C0\'s own), (3) own-target contacts recorded `controlAttempt` in the contest '
      + 'ledger (BN-C0\'s own). #383 item 4(iii)\'s 0.163509 is re-derived as RESOLVED-ROLL-FAIL '
      + '÷ NON-POSSESSION endings; BN-C0\'s own-target no-possession predicate is re-used at '
      + `contactTick + K with K = ${K_TICKS}.`,
    theMajorityRule: '⭐⭐ FROZEN: majority = share > 0.5 of the NON-POSSESSION endings on '
      + 'INTENDED TARGETS. Evaluated in the frozen order roll-fail → the ABANDONED-BY-CONTACT '
      + 'parent (then its opponent / teammate sub-class) → the RESOLVED-NOT-REACHED parent '
      + '(then its ball-larger / body-larger sub-class) → the LINE → mixed. A parent holding '
      + 'the majority while NEITHER sub-class does prints the PARENT\'S NAME with the MIXED '
      + 'literal APPENDED.',
    kTicks: K_TICKS,
    constants: {
      CONTACT_CONTROL_DELAY_TICKS, CONTACT_CONTROL_RETENTION_MARGIN, CONTROL_RADIUS,
      CONTACT_RELEASE_MIN_SPEED, CONTACT_RELEASE_MAX_SPEED, CONTACT_RELEASE_INCOMING_SHARE,
      CONTACT_TANGENTIAL_RETENTION, CONTACT_COMMIT_TIME, PRESSURE_RADIUS_M,
      CONTROL_MAX_SPEED, DEFLECT_MAX_SPEED,
    },
    binEdges: {
      note: '⚠ every width/count here is a BIN EDGE of a stored histogram — never a rule and '
        + 'never a threshold: no read word depends on one.',
      releaseSpeedMs: { width: REL_BIN, bins: REL_BINS },
      releaseNormalMs: { width: NRM_BIN, bins: NRM_BINS },
      bodySpeedMs: { width: BSP_BIN, bins: BSP_BINS },
      relativeSpeedMs: { width: SPD_BIN, bins: SPD_BINS },
      opponentDistanceM: { width: OPP_BIN, bins: OPP_BINS },
      pressure: { width: PRS_BIN, bins: PRS_BINS },
      displacementM: { width: DSP_BIN, bins: DSP_BINS },
      windowTicks: { width: WIN_BIN, bins: WIN_BINS },
    },
  },
  doseSource: {
    l3File: L3_DOSE_FILE, l3BytesSha256: L3_DOSE_BYTES_SHA, l3Pinned: L3_DOSE_PIN,
    pcFile: PC_DOSE_FILE, pcBytesSha256: PC_DOSE_BYTES_SHA, pcPinned: PC_DOSE_PIN,
    loadersCalled: true, dosedArmReachable: DOSED_ARM_REACHABLE,
  },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP], batteryFirst: batterySeeds[0],
    batteryLast: batterySeeds[batterySeeds.length - 1], nFrozen: N_FROZEN, nWalked: cells.length,
    receiptSeed: RECEIPT_SEED, unwalkedTail: IS_SCRATCH_RUN ? null : UNWALKED_TAIL,
    walksBooked, walksWalked: walksBooked,
    scratch: { curvePin: CURVE_PIN_SEED, traceInert: TRACE_INERT_SEEDS,
      lockstep: LOCKSTEP_SEEDS, smoke: [SCRATCH_BASE, SCRATCH_BASE + 11],
      smokeReceipt: SCRATCH_BASE + 20 },
    isOverrideRun: IS_OVERRIDE, overrideReasons: OVERRIDE_REASONS,
  },
  stats: { consumed: 0, registry: 73,
    note: 'ZERO stats consumed; the registry is untouched by this census.' },
  anchoredSites: ANCHORS,
  fixtures: FIXTURES,
  lockstep: lockstepRows,
  traceInert: traceInertRows,
  faces, deltas,
  reads: {
    E: READS.E, D: READS.D,
    readOfRecord: READ_OF_RECORD,
    dosedAgreesOnMajorityClass: DOSED_AGREES,
    agreementSentencePrinted: AGREE_WORD,
    frozenLiterals: READ_LITERALS,
    agreementLiterals: [AGREE_SENTENCE.agrees, AGREE_SENTENCE.disagrees],
    note: '⭐⭐ every word above is SELECTED by a STORED boolean from the frozen literals of '
      + '#383 item 6(vi); `gReadWords` re-derives every one off the SERIALIZED artifact.',
  },
  medians: { values: medians,
    note: 'BIN-DERIVED medians (the lower edge of the bin whose cumulative count first reaches '
      + 'n/2), so `gFaces` re-derives every one off disk.' },
  bins: Object.fromEntries(ARMS.map((arm) => [arm, {
    endingClass: { pooled: pooled[arm].clsN },
    notReachedDisplacementCell: { pooled: pooled[arm].nrDisp },
    notReachedBallDisplacementM: { pooled: pooled[arm].nrBallBins },
    notReachedBodyDisplacementM: { pooled: pooled[arm].nrBodyBins },
    abandonedSideByKind: { pooled: pooled[arm].abSideKind },
    physicsN: { pooled: pooled[arm].physN },
    physicsNoPossession: { pooled: pooled[arm].physNoPoss },
    passClassN: { pooled: pooled[arm].passN },
    actionAtContactN: { pooled: pooled[arm].actContactN },
    actionAtEndN: { pooled: pooled[arm].actEndN },
  }])),
  sizing: { target: SIZING_TARGET, tighterTarget: SIZING_TARGET_TIGHTER, smokeClusters: SMOKE_N,
    z975: Z975, z80: Z80, rows: sizingRows,
    note: '⭐ the smoke half-widths are READ OUT of the smoke artifact\'s own `faces[].halfWidth` '
      + 'fields on the E arm — never re-typed from a rounded console print.' },
  perf: {
    batteryWallSeconds: (Date.now() - t0Wall) / 1000,
    meanWallSecondsPerMatch: ARMS.reduce((a, arm) => a
      + armRows(arm).reduce((x, r) => x + r.wallMs, 0), 0) / (walksBooked * 1000),
  },
  perSeedCells,
  constructionReceipt: Object.fromEntries(ARMS.map((arm) => [arm, receiptRows[arm]])),
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
  cmp('endingClass', got.clsN);
  cmp('notReachedDisplacementCell', got.nrDisp);
  cmp('notReachedBallDisplacementM', got.nrBallBins);
  cmp('notReachedBodyDisplacementM', got.nrBodyBins);
  cmp('abandonedSideByKind', got.abSideKind);
  cmp('physicsN', got.physN);
  cmp('physicsNoPossession', got.physNoPoss);
  cmp('passClassN', got.passN);
  cmp('actionAtContactN', got.actContactN);
  cmp('actionAtEndN', got.actEndN);
  binChecks.push({ bin: `${arm}.medians.allBinDerived`,
    ok: JSON.stringify(mediansFrom(got)) === JSON.stringify(disk.medians.values[arm]) });
  /* ⭐⭐ THE EXACT-SUM RECEIPTS re-derive off disk too */
  for (const g of GROUPS) {
    const gi = GI(g);
    binChecks.push({ bin: `${arm}.${g}.partition.classesSumToEndings`,
      ok: sum(got.clsN[gi]) === sum(rows.map((r) => r.ended[gi])) });
    binChecks.push({ bin: `${arm}.${g}.partition.observedPlusInferredIsEndings`,
      ok: sum(rows.map((r) => r.clsObserved[gi] + r.clsInferred[gi]))
        === sum(rows.map((r) => r.ended[gi])) });
    binChecks.push({ bin: `${arm}.${g}.partition.observedCountsMatchTheClassFlags`,
      ok: sum(rows.map((r) => r.clsObserved[gi]))
        === sum(rows.map((r) => sum(CLASSES.filter((c) => CLASS_OBSERVED[c])
          .map((c) => r.clsN[gi][CI(c)])))) });
    binChecks.push({ bin: `${arm}.${g}.partition.displacementCellsSumToNotReached`,
      ok: sum(got.nrDisp[gi]) === sum(rows.map((r) => parentNotReached(r, g))) });
    binChecks.push({ bin: `${arm}.${g}.partition.nonPossessionIsEndingsMinusClean`,
      ok: sum(rows.map((r) => nonPoss(r, g)))
        === sum(rows.map((r) => r.ended[gi] - r.clsN[gi][CI(POSSESSION_CLASS)])) });
  }
  binChecks.push({ bin: `${arm}.partition.sideKindSumsToContactParent`,
    ok: sum(got.abSideKind.map((x) => sum(x)))
      === sum(rows.map((r) => parentContact(r, 'intended'))) });
  binChecks.push({ bin: `${arm}.partition.physicsBinsSumToIntendedEndings`,
    ok: PHYS_CELLS.every((c) => sum(got.physN[PCI(c)])
      === sum(rows.map((r) => r.physSumN)))
      && sum(got.passN) === sum(rows.map((r) => r.physSumN))
      && sum(got.actContactN) === sum(rows.map((r) => r.physSumN))
      && sum(got.actEndN) === sum(rows.map((r) => r.physSumN)) });
  binChecks.push({ bin: `${arm}.partition.intendedEndingsEqualPhysicsN`,
    ok: sum(rows.map((r) => r.physSumN)) === sum(rows.map((r) => r.ended[GI('intended')])) });
  binChecks.push({ bin: `${arm}.partition.createdEqualsEnded`,
    ok: GROUPS.every((g) => sum(rows.map((r) => r.created[GI(g)]))
      === sum(rows.map((r) => r.ended[GI(g)]))) });
}
/** ⭐⭐ THE READ WORDS, re-derived from the SERIALIZED per-seed cells */
for (const arm of ARMS) {
  const rows = disk.perSeedCells.map((c) => c[arm]);
  const got = readFor(rows);
  const stored = disk.reads[arm] as unknown as ReadOut;
  binChecks.push({ bin: `reads.${arm}.sharesRederive`,
    ok: JSON.stringify(got.shares) === JSON.stringify(stored.shares)
      && got.nonPossessionEndings === stored.nonPossessionEndings });
  binChecks.push({ bin: `reads.${arm}.majorityBooleansRederive`,
    ok: JSON.stringify(got.majority) === JSON.stringify(stored.majority)
      && got.noMajority === stored.noMajority && got.majorityClass === stored.majorityClass });
  binChecks.push({ bin: `reads.${arm}.sentenceIsTheFrozenLiteral`,
    ok: got.sentence === stored.sentence && READ_LITERALS.includes(stored.sentence) });
}
{
  const eM = (disk.reads.E as unknown as ReadOut).majorityClass;
  const dM = (disk.reads.D as unknown as ReadOut).majorityClass;
  binChecks.push({ bin: 'reads.dosedAgreementIsStored',
    ok: (eM === dM) === (disk.reads.dosedAgreesOnMajorityClass as boolean)
      && (disk.reads.agreementSentencePrinted as string)
        === (eM === dM ? AGREE_SENTENCE.agrees : AGREE_SENTENCE.disagrees)
      && (disk.reads.readOfRecord as string)
        === (disk.reads.E as unknown as ReadOut).sentence });
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
    + 'requires stored bins". The read sentences, EVERY majority boolean and the exact-sum '
    + 'receipts are INCLUDED',
};
gates.gReadWords = {
  ok: binChecks.filter((b) => b.bin.startsWith('reads.')).every((b) => b.ok),
  note: '⭐⭐ THE READ WORDS ARE STORED, NOT TYPED: every class share, every majority boolean, '
    + 'the `noMajority` flag, the majority CLASS, the dosed-agreement boolean and every printed '
    + 'sentence are re-derived by applying the FROZEN rules to the SERIALIZED per-seed cells '
    + 'off disk, and every printed sentence must be one of the frozen literals. canon, '
    + 'VERBATIM: "a universal sentence about a table (\'every bin\', \'the one bin\') is a '
    + 'stored boolean or is not written"',
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
banner(`BQ-C1 — ${ALL_GREEN_FINAL ? 'ALL GATES GREEN' : '⛔ RED — routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner(`--- THE SITES: ${NULL_SITES_FOUND.length} × \`${NULL_NEEDLE}\` at lines `
  + `${NULL_SITES_FOUND.map((s) => s.line).join(', ')}; 1 creation site at `
  + `${CREATE_SITES_FOUND.map((s) => s.line).join(', ')} ---`);
banner('--- §R1 THE POPULATION AND THE ENDINGS ---');
for (const arm of ARMS) {
  banner(`  ${arm} created/match ${f6(face('population.all.attemptsPerMatch', arm).value)} `
    + `· intended ${f6(face('population.intended.attemptsPerMatch', arm).value)} `
    + `· nonPossession(intended) ${f6(face('population.intended.nonPossessionShare', arm).value)}`
    + ` · observed ${f6(face('population.intended.observedShare', arm).value)}`
    + ` · inferred ${f6(face('population.intended.inferredShare', arm).value)}`);
}
banner('');
banner('--- §R2 ⭐⭐ THE COMPOSITION OF NON-POSSESSION ENDINGS (intended targets) ---');
for (const arm of ARMS) {
  banner(`  ${arm} n=${face('composition.intended.resolvedClean', arm).denominator}`);
  for (const c of CLASSES) {
    if (c === POSSESSION_CLASS) continue;
    const v = face(`composition.intended.${c}`, arm).value;
    if (face(`composition.intended.${c}`, arm).numerator > 0) {
      banner(`     ${c} ${f6(v)} (n=${face(`composition.intended.${c}`, arm).numerator})`);
    }
  }
  banner(`     parent.abandonedByContact `
    + `${f6(face('composition.intended.parent.abandonedByContact', arm).value)} · `
    + `parent.resolvedNotReached `
    + `${f6(face('composition.intended.parent.resolvedNotReached', arm).value)} · line `
    + `${f6(face('composition.intended.parent.line', arm).value)}`);
  banner(`     notReached ballLarger `
    + `${f6(face('notReached.intended.ballLargerOfNonPossession', arm).value)} · bodyLarger `
    + `${f6(face('notReached.intended.bodyLargerOfNonPossession', arm).value)}`);
  banner(`     majorityClass = ${READS[arm].majorityClass}`);
}
banner('');
banner('--- §R8 THE READS, PRINTED ---');
for (const s of READ_LIST) banner(`  ${s}`);
banner(`  (D would print: ${READS.D.sentence})`);
banner('');
banner('--- §R5/§R6 (E arm) ---');
banner(`  release ${f6(face('physics.meanReleaseSpeed', 'E').value)} m/s · normal `
  + `${f6(face('physics.meanReleaseNormalComponent', 'E').value)} m/s · inLawRange `
  + `${f6(face('physics.lawPredictedRangeShare', 'E').value)}`);
banner(`  pressure contact ${f6(face('physics.meanPressureAtContact', 'E').value)} → end `
  + `${f6(face('physics.meanPressureAtEnd', 'E').value)} · holdLive `
  + `${f6(face('physics.holdLiveShare', 'E').value)}`);
banner(`  reconciliation: created/match `
  + `${f6(face('reconciliation.pendingCreatedPerMatch', 'E').value)} · resolutions/match `
  + `${f6(face('reconciliation.resolutionsPerMatch', 'E').value)} · ownTargetContacts/match `
  + `${f6(face('reconciliation.ownTargetControlContactsPerMatch', 'E').value)}`);
banner(`  rollFailShareOfNonPossession(all) `
  + `${f6(face('reconciliation.rollFailShareOfNonPossession', 'E').value)} · bnc0NoPossession `
  + `${f6(face('reconciliation.bnc0OwnTargetNoPossessionShare', 'E').value)}`);
banner(`  marginCrossCheck ${f6(face('notReached.marginCrossCheckAgreementShare', 'E').value)} `
  + `· creationLedgerAgreement `
  + `${f6(face('population.creationLedgerAgreementShare', 'E').value)}`);
banner('');
banner('--- SIZING INPUTS (read these into SIZED_FACES before the freeze) ---');
for (const r of SIZED_FACES) {
  const [k, a] = r.face.split('@');
  banner(`  ${r.face} hwSmoke ${face(k, a as Arm).halfWidth}`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`hashedBodySha256 = ${artifact.hashedBodySha256 as string}`);
banner(`fileByteSha256   = ${FINAL_FILE_SHA}  bytes ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerMatch `
  + `${((artifact.perf as { meanWallSecondsPerMatch: number }).meanWallSecondsPerMatch).toFixed(6)}`);
if (!ALL_GREEN_FINAL) process.exit(1);
