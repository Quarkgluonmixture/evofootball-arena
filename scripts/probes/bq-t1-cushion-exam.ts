/**
 * ⭐⭐ BQ-T1 — 「缓冲留球」 THE CUSHION EXAM (docs/world-model/BQ-T1-CUSHION-EXAM.md).
 *
 * Authorized by COMMANDER RULING #385 item 5, on the law BQ-T0 landed dormant (seam `0ae2bf8`).
 * Binding contract: docs/world-model/BK-BODYBALL-CONTRACT.md §2-AMENDMENT M-BK.5 — THE CUSHION
 * KEEPS THE BALL; THE ROLL DECIDES THE TOUCH (#384 item 5).
 *
 * Lineage: PT-C0 → RC-T1b (FAIL: not readiness) → BN-C0 (the bounce is a control-QUALITY event)
 * → BQ-C0 (the coin is honest and is NOT the story) → BQ-C1 (the window is MIXED and its largest
 * single piece is GEOMETRY: 0.414040 of the intended target's lost receptions in the dosed world)
 * → BQ-T0 (the law behind a shut door) → THIS EXAM, which opens the door on world 12.
 *
 * Instrument family: scripts/probes/bf-t1-facing-cost-exam.ts (THE EXAM FORM OF RECORD — paired
 * arms on shared seeds, the cluster bootstrap, LOO flip counting, `gArmsDiverge` SOME-not-EVERY,
 * the frozen sentence literals, the allowlist-hashed body, gFaces off disk, the hash order, the
 * PT-C0 user faces, the DF 乱跑 instrument and the E4 definitions) + BQ-C1's attempt-window
 * classes, sites, attribution and precedence (COPIED here and RE-ANCHORED at THIS head — the
 * banked census's own instrument is not edited) + BN-C0's bounce predicate and settle ladder.
 *
 * THE FOUR ARMS, PAIRED on shared seeds (arm k walks seed s with the IDENTICAL population
 * construction — BF-T1's own `buildMatch` plumbing), ALL FOUR with `traceContests: true` AND
 * `traceFirstTouch: true`:
 *   E-SHUT  = world 12 EMPTY-BOOK: a4MatchFlags(12) + armA4World(m, null, 12); `bqCushion` ABSENT.
 *   E-ARMED = E-SHUT + `bqCushion: true` in the CONSTRUCTOR flags. — THE SCORED PAIR.
 *   D-SHUT / D-ARMED = the same pair DOSED through the SHIPPED loaders, the two byte-hashes
 *             PINNED. — REPORTED, with the frozen rules' words STORED.
 *
 * H-BQ.1 (frozen at §P.C before any battery seed; SCORED ON E-ARMED − E-SHUT ONLY):
 *   (a) 「留球」 Δ of the intended target's NON-POSSESSION share ENTIRELY BELOW ZERO ⇒ FALLS.
 *   (b) 「几何那一类」 Δ of the RESOLVED-NOT-REACHED-margin class as a share of INTENDED ATTEMPTS
 *       ENTIRELY BELOW ZERO ⇒ FALLS. ⚠ the denominator is ATTEMPTS, not non-possession endings.
 *   (c) 「对抗不减」 Δ of the ABANDONED-BY-CONTACT (OPPONENT) class as a share of INTENDED ATTEMPTS
 *       NOT entirely below zero ⇒ DOES-NOT-FALL.
 *   (d1) Δ `goalsPerMatch` NOT entirely outside [−0.30, +0.30] ⇒ WITHIN-BAND.
 *   (d2) Δ `passCompletion` NOT entirely below −0.010 ⇒ DOES-NOT-FALL.
 *   (d3) Δ `interceptionsPerMatch` NOT entirely above +1.0 ⇒ DOES-NOT-RISE.
 *   H-BQ.1 = PASS ⇔ (a) ∧ (b) ∧ (c) ∧ (d1) ∧ (d2) ∧ (d3).
 *   ⚠ A non-fall / non-rise / within-band certifies NOTHING SMALLER THAN THE DECLARED MDE.
 *
 * ⛔ X-SRC-ZERO: no file under `src/` is created or edited — the law is already in the tree with
 * its own 24-pin suite (`tests/bqCushion.test.ts`). The probe CALLS the shipped exports and reads
 * `Match` state per tick; the CONTEST-EPISODE ledger and the E1a FIRST-TOUCH ledger are READ,
 * never re-implemented; every `= null` site is ANCHORED at THIS head. THERE IS NO WRAPPER —
 * `gLockstep` proves observed ≡ unobserved byte for byte per arm, and `gTraceInert` proves both
 * trace flags change no byte of the world.
 * ⛔ THIS STAGE SHIPS NOTHING: world 12's composition and bytes are untouched, no world is cut,
 * no preset names `bqCushion`, and the production fingerprint is unmoved.
 * ⛔ Receipts are receipts: the site counts, the creation-ledger agreement, the margin
 * cross-check and the dose hashes are ARMING PLUMBING and are NEVER quoted as football effect
 * sizes (home: ruling #289 item 1 + BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).
 * ⛔ NO SEASON LADDER: a body law, no gene (#385 item 5(iii)).
 *
 * ⭐ canon, VERBATIM: "an event attribution reads the engine's own record when one exists
 * (`shotLog`, the contest episodes, `lastTouch`); a heuristic is written only where no record
 * exists, and says so" (home: RC-T1B-READY-EXAM.md §COMMANDER CORRECTIONS item 5, #381 item 3).
 * ⭐ canon, VERBATIM: "a counterfactual verdict sentence ('had X been scored, the rule would read
 * W') quotes a word the instrument STORED by applying the frozen rule to X's stored interval; a
 * universal sentence about a table ('every bin', 'the one bin') is a stored boolean or is not
 * written" (home: BF-T1-FACING-COST-EXAM.md §COMMANDER CORRECTIONS items 1–2, #378 item 2).
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
  DT, GRAVITY, MATCH_DURATION, AI_INTERVAL,
} from '../../src/sim/constants';
import { directBallAccess, ballAccessGeometry, type BodySector } from '../../src/sim/physical';
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
/* §1 THE RUN ENVELOPE — no bypass (the BF-T1 / BQ-C1 §1 form)                 */
/* ========================================================================== */
const ENV_WHITELIST = ['BQT1_MODE', 'BQT1_N', 'BQT1_OUT'] as const;
const ENGINE_DOORS = ['EDS_BUNDLE', 'EDS_BUNDLE_ARMED', 'EDS_TRACE_CHOICE', 'EMERGENT_POS',
  'A4_WORLD', 'RA_WORLD', 'PW_LADDER'] as const;
const banner = (s: string): void => { process.stderr.write(`${s}\n`); };
const rogueOwn = Object.keys(process.env)
  .filter((k) => k.startsWith('BQT1_') && !(ENV_WHITELIST as readonly string[]).includes(k));
const rogueEngine = ENGINE_DOORS.filter((k) => process.env[k] !== undefined);
if (rogueOwn.length > 0 || rogueEngine.length > 0) {
  banner(`BQ-T1 FATAL — env outside the whitelist: ${[...rogueOwn, ...rogueEngine].join(', ')}`);
  process.exit(3);
}
const MODE = process.env.BQT1_MODE as 'smoke' | 'full' | undefined;
if (MODE !== undefined && MODE !== 'smoke' && MODE !== 'full') {
  banner('BQ-T1 FATAL — BQT1_MODE must be smoke or full');
  process.exit(3);
}
const N_ENV = process.env.BQT1_N !== undefined ? Number(process.env.BQT1_N) : undefined;
if (N_ENV !== undefined && (!Number.isInteger(N_ENV) || N_ENV <= 0)) {
  banner('BQ-T1 FATAL — BQT1_N must be a positive integer');
  process.exit(3);
}
const OUT_ENV = process.env.BQT1_OUT;
const OVERRIDE_REASONS = [
  ...(MODE !== undefined ? [`BQT1_MODE=${MODE}`] : []),
  ...(N_ENV !== undefined ? [`BQT1_N=${N_ENV}`] : []),
  ...(OUT_ENV !== undefined ? [`BQT1_OUT=${OUT_ENV}`] : []),
];
const IS_OVERRIDE = OVERRIDE_REASONS.length > 0;
const CANONICAL_OUT = 'docs/world-model/data/bq-t1-cushion-exam.json';
const CANONICAL_DIR_ABS = pathResolve('docs/world-model/data');
const OUT_BASE = OUT_ENV ?? (IS_OVERRIDE ? '/tmp/bq-t1-override.json' : CANONICAL_OUT);
const isCanonical = (p: string): boolean => pathResolve(p).startsWith(CANONICAL_DIR_ABS);
if (IS_OVERRIDE && isCanonical(OUT_BASE)) {
  banner('BQ-T1 FATAL — an OVERRIDE run may never write a canonical artifact path');
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
/** ⭐ the sizing form's own 6-dp ROUND-UP (BQ-C0 / RC-T1b's declared idiom) */
const ceil6 = (x: number): number => Math.ceil(x * 1e6) / 1e6;

/* ========================================================================== */
/* §3 THE ANCHORED SITES — anchored needle + LINE RECEIPT, never first-occurrence.
   ⭐⭐ RE-ANCHORED AT THIS HEAD. BQ-T0 §4 declared that BQ-C1's frozen probe no longer
   re-anchors here (its ten `= null` line receipts moved and its contiguous cushion needle is now
   split by the `if (!this.bqCushion)` branch). This instrument COPIES what it reuses and
   re-derives every receipt against the file in front of it; ⛔ the banked census's instrument is
   NOT edited.
   canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call site —
   anchored match + line receipt — never first-occurrence" (home: BK-C0-BODYBALL-CENSUS.md
   §COMMANDER CORRECTIONS item 1, ruling #306 item 4)
   canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and enumerates EVERY
   occurrence's site" (home: PC-C0-REACTION-BASELINE.md §COMMANDER CORRECTIONS item 1)         */
/* ========================================================================== */
const MATCH_PATH = 'src/sim/Match.ts';
const LEAGUE_PATH = 'src/sim/League.ts';
const MECH_PATH = 'src/sim/mechanics.ts';
const CONST_PATH = 'src/sim/constants.ts';
const PERC_PATH = 'src/ai/perception.ts';
const PHYS_PATH = 'src/sim/physical.ts';
const TYPES_PATH = 'src/sim/types.ts';
const A4_PATH = 'src/game/a4World.ts';
const A4P1C_PATH = 'scripts/probes/a4-p1c-grant-census.ts';
const MTL_PATH = 'scripts/probes/mt-ladder.ts';
const DFT1_PATH = 'scripts/probes/df-t1-persistence-exam.ts';
const SRC_OF: Record<string, string> = {};
for (const p of [MATCH_PATH, LEAGUE_PATH, MECH_PATH, CONST_PATH, PERC_PATH, PHYS_PATH,
  TYPES_PATH, A4_PATH, A4P1C_PATH, MTL_PATH, DFT1_PATH]) {
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
  occurrences: { line: number }[]; extracted?: unknown; ok: boolean;
}
const ANCHORS: Anchor[] = [];
const anchor = (
  what: string, file: string, needle: string, want: number, extracted?: unknown,
): { line: number }[] => {
  const hits = occurrences(SRC_OF[file], needle);
  ANCHORS.push({ what, file, needle, want, occurrences: hits, extracted,
    ok: hits.length === want });
  return hits;
};

/* ⭐⭐ THE SITE ENUMERATION, RE-COUNTED AND RE-ANCHORED AT THIS HEAD (BQ-C1 §P.B's list, whose
   line receipts moved when the seam landed — #385 item 3 records the move; this gate pins what
   the file in front of it holds). */
const NULL_NEEDLE = 'this.pendingControl = null';
const NULL_SITES_FOUND = occurrences(SRC_OF[MATCH_PATH], NULL_NEEDLE);
const CREATE_NEEDLE = 'this.pendingControl = {';
const CREATE_SITES_FOUND = occurrences(SRC_OF[MATCH_PATH], CREATE_NEEDLE);
/** the purposes, in SOURCE ORDER — BQ-C1 §P.B's own table, re-anchored at THIS head. */
const SITE_PURPOSES: { line: number; purpose: string; endingClassItServes: string }[] = [
  { line: 3694, purpose: '`kickBall` — the low-level kick releases the ball with velocity and a '
    + 're-capture cooldown; any pending control on that ball is void',
    endingClassItServes: 'abandonedPossessionElsewhere / abandonedOther' },
  { line: 3718, purpose: '`giveBall`\'s OFFSIDE branch — the flagged target touches the ball, so '
    + 'the "reception" is a dead ball, not a control',
    endingClassItServes: 'resolvedOffside / abandonedOffside' },
  { line: 3861, purpose: '`giveBall`\'s TAIL — a body is given clean control; the attempt is '
    + 'consumed by the possession it produced',
    endingClassItServes: 'resolvedClean (and abandonedPossessionElsewhere off other callers)' },
  { line: 4834, purpose: '`awardRestart` — a restart (kickIn / corner / goalKick / freeKick) '
    + 'kills the live ball; the contest resolves `out` or `deadBall`',
    endingClassItServes: 'abandonedDeadBallOut (and abandonedOffside via `callOffside`)' },
  { line: 5615, purpose: '⭐ `bkApplyBodyStrike` — THE DEFLECTION PRECEDENT, in the engine\'s own '
    + 'words: "the deflection precedent: that attempt\'s ball is gone"',
    endingClassItServes: 'abandonedBodyStrike (ledger kind `body`)' },
  { line: 5669, purpose: '`applyControlContact`\'s OFFSIDE branch — the cushioning contact itself '
    + 'is an offside reception; no attempt is created',
    endingClassItServes: 'abandonedOffside' },
  { line: 5685, purpose: '⭐⭐ `resolvePendingControlAttempt`\'s OWN CLEAR — fires UNCONDITIONALLY '
    + 'once `stepCount >= readyTick`, BEFORE the pre-roll returns and before the roll. Every '
    + 'RESOLVED-* ending is this one site',
    endingClassItServes: 'resolvedClean · resolvedRollFail · resolvedNotReached*' },
  { line: 5730, purpose: '`tryCapture`\'s APPLIED-DEFLECTION branch — `mech.tryDeflection` '
    + 'succeeded and the ball is gone off a stretched leg',
    endingClassItServes: 'abandonedDeflection (ledger kind `deflection`)' },
  { line: 5847, purpose: '`setupKickoff` — a kickoff (match start, after a goal, after half-time) '
    + 'resets the world',
    endingClassItServes: 'abandonedDeadBallOut' },
  { line: 5914, purpose: '`endMatch` — THE WHISTLE; the contest resolves `stillLoose`',
    endingClassItServes: 'abandonedDeadBallOut' },
];
anchor('⭐⭐ THE SITE ENUMERATION — every `this.pendingControl = null` in Match.ts, RE-COUNTED '
  + 'AT THIS HEAD', MATCH_PATH, NULL_NEEDLE, SITE_PURPOSES.length,
  SITE_PURPOSES.map((s) => s.line));
anchor('⭐⭐ THE ONE CREATION SITE — `applyControlContact` opens the window (its overwrite IS '
  + 'ABANDONED-BY-CONTACT; there is no `= null` there)', MATCH_PATH, CREATE_NEEDLE, 1,
  CREATE_SITES_FOUND.map((s) => s.line));

/* --- the sites, each pinned by its own anchored CONTEXT needle (never first-occurrence) --- */
anchor('site — the deflection precedent, in the engine\'s own comment', MATCH_PATH,
  "    this.pendingControl = null; // the deflection precedent: that attempt's ball is gone", 1);
anchor('site — ⭐⭐ THE RESOLVER\'S OWN GATE AND CLEAR (the resolver runs FIRST)', MATCH_PATH,
  '  private resolvePendingControlAttempt(): boolean {\n'
  + '    const attempt = this.pendingControl;\n'
  + '    if (attempt === null || this.stepCount < attempt.readyTick) return false;\n'
  + '    this.pendingControl = null;', 1);
anchor('⭐⭐ THE PRE-ROLL RETURN (a): a missing / sent-off / STUNNED body', MATCH_PATH,
  '    const p = this.allPlayers[attempt.gid];\n'
  + '    if (!p || p.sentOff || p.stunTimer > 0) return false;', 1);
anchor('⭐⭐ THE PRE-ROLL RETURN (b): THE RETENTION MARGIN — the 2 cm bar this exam moves the '
  + 'geometry against (⛔ the margin itself is UNTOUCHED by M-BK.5)', MATCH_PATH,
  '    if (access.geometry.centerDistance > access.sectorCenterReach '
  + '+ CONTACT_CONTROL_RETENTION_MARGIN) return false;', 1);
anchor('the resolver\'s OWN geometry call — `directBallAccess(p, this.ball, this.allPlayers, '
  + 'CONTROL_RADIUS)` (this exam RE-CALLS the same shipped function for its cross-check)',
  MATCH_PATH,
  '    const access = directBallAccess(p, this.ball, this.allPlayers, CONTROL_RADIUS);', 1);
anchor('the resolver\'s roll — `mech.attemptFirstTouch` and the `giveBall` on clean (UNTOUCHED '
  + 'by the law under exam)', MATCH_PATH,
  '    const clean = mech.attemptFirstTouch(this, p, {\n'
  + '      relativeSpeed: attempt.relativeSpeed,\n'
  + '      incomingDir: attempt.incomingDir,\n'
  + '    });\n'
  + '    if (clean) this.giveBall(p);', 1);
anchor('⭐⭐ THE ORDER OF OPERATIONS — `tryCapture` RESOLVES FIRST, then collects claims (the '
  + 'justification of the frozen precedence)', MATCH_PATH,
  '  private tryCapture(): void {\n'
  + '    if (this.resolvePendingControlAttempt()) return;', 1);
anchor('⭐⭐ THE REPLACEMENT — a NEW claim inside the window OVERWRITES the attempt', MATCH_PATH,
  '    this.pendingControl = {\n'
  + '      gid: p.gid,\n'
  + '      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,\n'
  + '      relativeSpeed: claim.relativeSpeed,\n'
  + '      incomingDir: claim.incomingDir,\n'
  + '    };', 1);

/* --- ⭐⭐ THE SEAM UNDER EXAM (BQ-T0 §1): the release clamp, then the SHIPPED two lines and
       the ARMED two lines ANCHORED SEPARATELY, because the branch now sits between them. --- */
anchor('⭐⭐ THE CUSHION\'S RELEASE CLAMP — computed on BOTH paths (a pure local; BQ-T0 §1)',
  MATCH_PATH,
  '    const release = Math.min(\n'
  + '      CONTACT_RELEASE_MAX_SPEED,\n'
  + '      Math.max(\n'
  + '        CONTACT_RELEASE_MIN_SPEED,\n'
  + '        CONTACT_RELEASE_MIN_SPEED + Math.abs(relativeNormal) * CONTACT_RELEASE_INCOMING_SHARE,\n'
  + '      ),\n'
  + '    );', 1);
anchor('⭐⭐ THE SEAM\'S BRANCH TEST — the whole shipped-path delta (BQ-T0 §1)', MATCH_PATH,
  '    if (!this.bqCushion) {', 1);
anchor('⭐⭐ THE SHIPPED CUSHION, character for character — the outward normal release plus the '
  + 'tangential retention (the geometry BQ-C1 measured)', MATCH_PATH,
  '      ball.vel.x = p.vel.x + n.x * release + tx * CONTACT_TANGENTIAL_RETENTION;\n'
  + '      ball.vel.y = p.vel.y + n.y * release + ty * CONTACT_TANGENTIAL_RETENTION;', 1);
anchor('⭐⭐ THE ARMED CUSHION — the ball takes the BODY\'s velocity and NOTHING else (M-BK.5); '
  + 'the branch contains no `+`, no `*`, no `release`, no `CONTACT_` and no `rng`', MATCH_PATH,
  '    } else {\n'
  + '      ball.vel.x = p.vel.x;\n'
  + '      ball.vel.y = p.vel.y;\n'
  + '    }', 1);
anchor('the cushion\'s other effects — vz, spin, lastTouch, the commit-time cooldown and the '
  + 'contest-ledger write (UNTOUCHED on both paths)', MATCH_PATH,
  '    ball.vz *= 0.25;\n'
  + '    ball.spin *= 0.4;\n'
  + '    ball.lastTouch = p;\n'
  + '    p.kickCooldown = Math.max(p.kickCooldown, CONTACT_COMMIT_TIME);\n'
  + "    this.traceContact(allClaims, p, 'controlAttempt');", 1);
/* --- ⭐⭐ THE FLAG'S OWN SEAM MAP: `bqCushion` counted and enumerated per file --- */
const CUSHION_NEEDLE = 'bqCushion';
const CUSHION_MATCH_SITES = occurrences(SRC_OF[MATCH_PATH], CUSHION_NEEDLE);
const CUSHION_LEAGUE_SITES = occurrences(SRC_OF[LEAGUE_PATH], CUSHION_NEEDLE);
const CUSHION_A4_SITES = occurrences(SRC_OF[A4_PATH], CUSHION_NEEDLE);
anchor('⭐⭐ `bqCushion` in Match.ts — the config field, the readonly, the initialiser (which '
  + 'names it TWICE) and the seam\'s branch test', MATCH_PATH, CUSHION_NEEDLE, 5,
  CUSHION_MATCH_SITES.map((s) => s.line));
anchor('⭐⭐ `bqCushion` in League.ts — the `matchFlags` key union, on its own line', LEAGUE_PATH,
  CUSHION_NEEDLE, 1, CUSHION_LEAGUE_SITES.map((s) => s.line));
anchor('⭐⭐ `bqCushion` in a4World.ts — ZERO: NO world, preset or bundle names the flag; this '
  + 'exam is the ONLY thing that arms it, and it arms it in the CONSTRUCTOR', A4_PATH,
  CUSHION_NEEDLE, 0, CUSHION_A4_SITES.map((s) => s.line));
anchor('⭐ the flag\'s own `?? false` — the door is SHUT unless asked', MATCH_PATH,
  '    this.bqCushion = cfg.bqCushion ?? false;', 1);
anchor('⭐⭐ `edsTouchCost` IS ABSENT FROM THE WHOLE WORLD COMPOSER — world 12 never sets it '
  + '(0 occurrences is the receipt)', A4_PATH, 'edsTouchCost', 0);

/* --- THE CONSTANTS, each at its own site (no new constant is invented anywhere) --- */
anchor('⭐⭐ CONTACT_CONTROL_DELAY_TICKS — the THREE ticks of the window (UNTOUCHED)', CONST_PATH,
  'export const CONTACT_CONTROL_DELAY_TICKS = 3;', 1, CONTACT_CONTROL_DELAY_TICKS);
anchor('⭐⭐ CONTACT_CONTROL_RETENTION_MARGIN — the 2 cm bar (UNTOUCHED)', CONST_PATH,
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
anchor('⭐ DT — the sim step every metre and every rate on this page is measured on', CONST_PATH,
  'export const DT = 1 / 60;', 1, DT);
anchor('⭐ MATCH_DURATION — the 240 s match clock every rate on this page runs on', CONST_PATH,
  'export const MATCH_DURATION = 240;', 1, MATCH_DURATION);
anchor('AI_INTERVAL — the decision cadence (context; the exam reads every tick)', CONST_PATH,
  'export const AI_INTERVAL = 0.15;', 1, AI_INTERVAL);
anchor('⭐ `pressureAt`\'s OWN FORM — the nearest opponent, 1 at 0 m and 0 beyond '
  + '`PRESSURE_RADIUS_M`; this exam CALLS this shipped function', PERC_PATH,
  'export function pressureAt(pos: V2, opponents: Player[]): number {\n'
  + '  let best = Infinity;\n'
  + '  for (const o of opponents) {\n'
  + '    if (o.sentOff) continue;\n'
  + '    const d = dist(o.pos, pos);\n'
  + '    if (d < best) best = d;\n'
  + '  }\n'
  + '  return clamp01(1 - best / PRESSURE_RADIUS_M);\n'
  + '}', 1, PRESSURE_RADIUS_M);
anchor('⭐ THE ROLL\'S TWO EARLY RETURNS — a keeper or a ball at `speed <= 6` never rolls '
  + '(so the adjudication COUNT is itself a face: the roll now sees attempts the margin used '
  + 'to swallow)', MECH_PATH, "  if (p.role === 'GK' || speed <= 6) return true;", 1);
anchor('⭐⭐ THE E1a LEDGER\'S OWN WRITE — the roll has already happened; this branch cannot '
  + 'influence it (the COUNT and the pFail this exam reads)', MECH_PATH,
  '  if (match.traceFirstTouch) {\n'
  + '    match.firstTouchTrace.push({', 1);
anchor('⭐ the SECTOR REACH the retention margin is measured against — `directBallAccess`\'s own '
  + '`sectorCenterReach` (the BodySector cones)', PHYS_PATH,
  '  const sectorCenterReach = actor.coreRadius + ball.radius + extension * extensionFactor;\n'
  + '  const withinPlayingDistance = geometry.centerDistance <= sectorCenterReach;', 1);
anchor('⭐ the contest ledger\'s KIND vocabulary, PARSED at run time (never re-typed)', PHYS_PATH,
  "export type ContestContactKind = 'controlAttempt' | 'poke' | 'deflection' | 'header' | 'body';",
  1);
anchor('THE CONTEST LEDGER\'S OWN WRITE — passive, never read by a contact/control decision',
  MATCH_PATH, '  /** Passive M3 ledger write. Never read by contact/control decisions. */', 1);
anchor('the ledger\'s THREE writers, ENUMERATED', MATCH_PATH, 'this.traceContact(', 3);
anchor('THE OFFSIDE RECORD — the engine\'s own `restart.offside` flag', MATCH_PATH,
  '    this.restart!.offside = true; // the UI labels the dead ball 🚩 offside', 1);
anchor('the restart OBJECT is rebuilt at every award (the offside/dead-ball signature)',
  MATCH_PATH,
  '    this.restart = { kind, side, pos: clone(pos), timer: 0, '
  + 'takerGid: this.pickTaker(kind, side, pos) };', 1);
/* --- BN-C0's settle window K, read off the control-attempt law's own readyTick form --- */
anchor('⭐⭐ THE readyTick FORM — `this.stepCount + CONTACT_CONTROL_DELAY_TICKS`. A CONSTANT '
  + 'offset, NOT a function of `relativeSpeed`, so K is ONE number for every contact (BN-C0 '
  + '§P.B, REUSED)', MATCH_PATH,
  '      readyTick: this.stepCount + CONTACT_CONTROL_DELAY_TICKS,', 1);
/* --- THE DF 乱跑 DEFINITION LINES (DF-T1 §3 / DF-C0 §R2, REUSED VERBATIM) --- */
anchor('⭐⭐ THE 乱跑 SWITCH — DF-T1 §3\'s own line: a marker\'s assigned man CHANGES', DFT1_PATH,
  '        if (prev !== null && cur2 !== null && prev !== cur2) {\n'
  + '          row.markSwitches += 1;', 1);
anchor('⭐⭐ THE 乱跑 DENOMINATOR — DF-T1 §8\'s own defender-minute line', DFT1_PATH,
  'const defenderMinutes = (r: Row): number => (r.defenderTicks * DT) / 60;', 1);
anchor('⭐⭐ THE MARKING-COVERAGE FACE — DF-T1 §3\'s own held-mark tick line', DFT1_PATH,
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
anchor('⭐ world 12\'s flag composition (the composer is CALLED, never copied)', A4_PATH,
  '    return { ...a4MatchFlags(CORRIDOR_WORLD_VERSION), ...RA_WORLD_DOORS };', 1,
  RA_WORLD_VERSION);

/** ⭐⭐ THE VOCABULARIES, PARSED OFF `src/` — never re-typed into this probe. */
const parseUnion = (src: string, head: string): string[] => {
  const i = src.indexOf(head);
  if (i < 0) return [];
  const j = src.indexOf(';', i);
  const body = src.slice(i + head.length, j);
  return [...body.matchAll(/'([A-Za-z]+)'/g)].map((m) => m[1]);
};
const KIND_VOCAB = parseUnion(SRC_OF[PHYS_PATH], 'export type ContestContactKind =');
const SECTORS = parseUnion(SRC_OF[PHYS_PATH], 'export type BodySector =') as BodySector[];
const DUP_RUN_M = ANCHORS.find((a) => a.needle.startsWith('const DUP_RUN_M'))!
  .extracted as number;
const SAMPLE_EVERY = ANCHORS.find((a) => a.needle.startsWith('const SAMPLE_EVERY'))!
  .extracted as number;

/** ⭐⭐ K — the WINDOW and BN-C0's SETTLE window. ⛔ NOT a typed constant of this exam: it IS
 *  `CONTACT_CONTROL_DELAY_TICKS`, imported. */
const K_TICKS = CONTACT_CONTROL_DELAY_TICKS;

const ANCHORS_OK = ANCHORS.every((a) => a.ok)
  && RA_WORLD_VERSION === 12 && K_TICKS === 3
  && KIND_VOCAB.length === 5
  && SECTORS.length === 3 && JSON.stringify(SECTORS) === JSON.stringify(['front', 'side', 'back'])
  && DUP_RUN_M === 4 && SAMPLE_EVERY === 10
  && NULL_SITES_FOUND.length === SITE_PURPOSES.length
  && NULL_SITES_FOUND.every((s, i) => s.line === SITE_PURPOSES[i].line)
  && CREATE_SITES_FOUND.length === 1
  && CUSHION_A4_SITES.length === 0;

/* ========================================================================== */
/* §4 SEEDS — block 12,543,000–999 (#385 item 5(v)); the FOUR ARMS SHARE SEEDS  */
/* ========================================================================== */
const BLOCK_BASE = 12_543_000;
const BLOCK_TOP = 12_543_999;
/** ⭐⭐ N_FROZEN = 998 — the LARGEST N the block affords after the construction receipt at
 *  12,543,999, with the unwalked tail 12,543,998 DECLARED. The declared targets for (a), (b)
 *  and (c) are their OWN smoke-MDEs at this N, ROUNDED UP TO 6 dp (the BQ-C0 / RC-T1b idiom,
 *  declared at §P.E); (d1) 0.30 goals · (d2) 0.010 completion · (d3) 1.0 interceptions. */
const N_MAX_SEEDS = 998;
const N_FROZEN = 998;
const N = N_ENV ?? (MODE === 'smoke' ? 3 : N_FROZEN);
const SCRATCH_BASE = 900_003_200;
const IS_SCRATCH_RUN = MODE === 'smoke';
const batterySeeds = Array.from({ length: N }, (_, i) => (IS_SCRATCH_RUN
  ? SCRATCH_BASE + i : BLOCK_BASE + i));
const RECEIPT_SEED = IS_SCRATCH_RUN ? SCRATCH_BASE + 20 : BLOCK_TOP;
const UNWALKED_TAIL = BLOCK_TOP - 1;
const CURVE_PIN_SEED = SCRATCH_BASE + 70;
const TRACE_INERT_SEEDS = [SCRATCH_BASE + 80, SCRATCH_BASE + 81];
const LOCKSTEP_SEEDS = [SCRATCH_BASE + 90, SCRATCH_BASE + 91];

/* ========================================================================== */
/* §5 THE FOUR ARMS — the world's own composer CALLED, never copied            */
/* ========================================================================== */
const ARMS = ['E-SHUT', 'E-ARMED', 'D-SHUT', 'D-ARMED'] as const;
type Arm = (typeof ARMS)[number];
const ARM_LABEL: Record<Arm, string> = {
  'E-SHUT': 'world 12 EMPTY-BOOK — `a4MatchFlags(12)` + `armA4World(m, null, 12)`; `bqCushion` '
    + 'ABSENT (the shipped cushion pushes the ball off the foot)',
  'E-ARMED': 'E-SHUT + `bqCushion: true` in the CONSTRUCTOR flags — the armed cushion gives the '
    + 'ball the BODY\'s velocity and nothing else (M-BK.5) — SCORED',
  'D-SHUT': 'world 12 DOSED — THE FORM THE USER PLAYS (the two doses through the SHIPPED '
    + 'loaders); `bqCushion` ABSENT — REPORTED',
  'D-ARMED': 'D-SHUT + `bqCushion: true` in the CONSTRUCTOR flags — REPORTED',
};
const isDosed = (a: Arm): boolean => a === 'D-SHUT' || a === 'D-ARMED';
const wantsCushion = (a: Arm): boolean => a === 'E-ARMED' || a === 'D-ARMED';
const PAIRS = [
  { key: 'E', shut: 'E-SHUT' as Arm, armed: 'E-ARMED' as Arm,
    form: 'EMPTY-BOOK, `bqCushion` armed (the exam form — SCORED)' },
  { key: 'D', shut: 'D-SHUT' as Arm, armed: 'D-ARMED' as Arm,
    form: 'DOSED — the form the user plays (REPORTED; the frozen rules\' words STORED)' },
] as const;

/** ⭐⭐ THE DOSES, from the SHIPPED LOADERS THEMSELVES, with the two PINNED byte-hashes.
 *  canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a self-declared
 *  field" (home: BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 6). */
const L3_DOSE_FILE = 'docs/world-model/data/l3-t1-convergence-exam.json';
const PC_DOSE_FILE = 'docs/world-model/data/pc-t1-learning-exam.json';
const L3_DOSE_PIN = 'a41a114c4727a2a6702bf4ca79b46b1d6924d80fa7fefb388d5364fd57da37db';
const PC_DOSE_PIN = '0301d7109cb0883a410a55cef9ff838dbce48d3627c418cbedd3e9e34448982f';
const L3_DOSE_BYTES_SHA = sha(readFileSync(L3_DOSE_FILE, 'utf8'));
const PC_DOSE_BYTES_SHA = sha(readFileSync(PC_DOSE_FILE, 'utf8'));
const DOSE_BYTES_MATCH = L3_DOSE_BYTES_SHA === L3_DOSE_PIN && PC_DOSE_BYTES_SHA === PC_DOSE_PIN;
if (!DOSE_BYTES_MATCH) {
  banner('BQ-T1 FATAL — a dose file\'s BYTES do not match the pinned value (#385 item 5(i))');
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
  banner(`BQ-T1 FATAL — the DOSED arms are not reachable from Node: ${DOSE_LOAD_ERROR ?? 'empty'}`);
  process.exit(3);
}
const L3_CELLS_POOLED = L3_DOSE === null ? 0 : L3_DOSE.length;
const PC_ROWS_POOLED = PC_DOSE === null ? 0 : PC_DOSE.length;

const teamInfo = (name: string, seed: number): TeamInfo => {
  const rng = new Rng(seed);
  return {
    id: name, name, short: name.slice(0, 3).toUpperCase(),
    colors: { primary: 0xff0000, secondary: 0xffffff },
    playerNames: Array.from({ length: TEAM_SIZE }, (_, i) => `P${i}`),
    genome: randomGenome(rng), squad: randomSquad(rng),
  };
};
/** ⭐⭐ BF-T1's own population construction per seed, so arm k walks seed s with the IDENTICAL
 *  population and the four arms differ ONLY in the constructor flag and the doses — which is
 *  what makes every Δ PAIRED. */
const buildMatch = (seed: number, arm: Arm, trace = true): Match => {
  const m = new Match({
    seed, teamA: teamInfo('A', seed * 2 + 1), teamB: teamInfo('B', seed * 2 + 2),
    ...a4MatchFlags(RA_WORLD_VERSION),
    traceFirstTouch: trace, traceContests: trace,
    ...(wantsCushion(arm) ? { bqCushion: true } : {}),
  } as ConstructorParameters<typeof Match>[0]);
  if (isDosed(arm)) armA4World(m, null, RA_WORLD_VERSION, L3_DOSE, PC_DOSE);
  else armA4World(m, null, RA_WORLD_VERSION);
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
/* §6 THE WALK-SIDE PREDICATES — PURE, fixture-backed.
   canon, VERBATIM: "a scored face's walk-side predicate is pinned — anchored extraction or
   fixture — because the re-derivation gate proves arithmetic, not definitions" (home:
   DF-T3-SURFACE-EXAM.md §COMMANDER CORRECTIONS item 2), REFINED at #334 item 2: "anchored
   extraction protects the source line; a headline-bearing walk-side predicate ALSO needs a
   composition fixture".                                                                     */
/* ========================================================================== */

/** ⭐⭐ BQ-C1 §P.B's ENDING CLASSES — COPIED here, mutually exclusive, in the SAME FROZEN
 *  precedence justified by the ENGINE'S OWN ORDER OF OPERATIONS (`tryCapture` RESOLVES FIRST,
 *  then collects claims; the offside branches return BEFORE any attempt is created or granted). */
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
const POSSESSION_CLASS: Cls = 'resolvedClean';
/** ⭐⭐ OBSERVED vs INFERRED, BQ-C1 §P.B's declaration COPIED (BQ-C0 §CORR 2's remedy). */
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
interface EndInput {
  atOrAfterReady: boolean;
  offsideThisTick: boolean;
  rollFail: boolean;
  ownsBall: boolean;
  stunnedOrOff: boolean;
  replacedByGid: number | null;
  replacedRelation: 'opponent' | 'teammate' | 'sameReceiver' | null;
  deflectionKindThisTick: 'deflection' | 'body' | null;
  deadBallThisTick: boolean;
  otherOwnerGid: number | null;
}
const classOf = (i: EndInput): Cls => {
  if (i.atOrAfterReady) {
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
/** BQ-C1's DISPLACEMENT RULE: strictly larger, or a tie. */
const DISP_CELLS = ['ballLarger', 'bodyLarger', 'tie'] as const;
type DispCell = (typeof DISP_CELLS)[number];
const DPI = (d: DispCell): number => DISP_CELLS.indexOf(d);
const dispCellOf = (ballDisp: number, bodyDisp: number): DispCell => (
  ballDisp > bodyDisp ? 'ballLarger' : bodyDisp > ballDisp ? 'bodyLarger' : 'tie');
/** the replacing body's SIDE × the LEDGER's own kind (BQ-C1 §R4's table) */
const SIDES = ['opponent', 'teammate', 'sameReceiver'] as const;
type SideCell = (typeof SIDES)[number];
const SDI = (s: SideCell): number => SIDES.indexOf(s);
const KIND_CELLS = [...KIND_VOCAB, 'silent'];
const KDI = (k: string): number => Math.max(0, KIND_CELLS.indexOf(k));

/** ⭐⭐ BN-C0 §P.B's SETTLE LADDER and BOUNCE PREDICATE, COPIED and re-anchored. `ownerSide` is
 *  `ball.owner?.side ?? null` and `live` is `phase === 'playing' || phase === 'restart'`, both
 *  read at the END of tick `contactTick + K`. A BOUNCE is an OWN-body first contact whose
 *  settle-window outcome is NOT `sameSide`; `unresolved` (the whistle came first) is COUNTED
 *  and enters NO bounce face. */
const HOLDS = ['sameSide', 'opponent', 'loose', 'out', 'unresolved'] as const;
type HoldOutcome = (typeof HOLDS)[number];
const HOI = (h: HoldOutcome): number => HOLDS.indexOf(h);
const holdOutcomeOf = (
  resolved: boolean, live: boolean, ownerSide: Side | null, passerSide: Side,
): HoldOutcome => (!resolved ? 'unresolved'
  : !live ? 'out'
    : ownerSide === null ? 'loose'
      : ownerSide === passerSide ? 'sameSide' : 'opponent');
const isBounceOf = (o: HoldOutcome): boolean => o !== 'sameSide' && o !== 'unresolved';

/** ⭐⭐ PT-C0 (iii)'s delivery classifier and ground/measured tests, reused. */
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
/** ⭐⭐ PT-C0 (iii)'s FIRST-CONTACT CLASSES, reused. */
const CONTACTS = ['none', 'ownTarget', 'ownNonTarget', 'opponent'] as const;
type ContactClass = (typeof CONTACTS)[number];
const CTI = (c: ContactClass): number => CONTACTS.indexOf(c);
const contactClassOf = (
  contactGid: number | null, targetGid: number, contactSide: Side | null, passerSide: Side,
): ContactClass => (contactGid === null || contactSide === null ? 'none'
  : contactGid === targetGid ? 'ownTarget'
    : contactSide === passerSide ? 'ownNonTarget' : 'opponent');
const OWN_CLASSES = ['ownTarget', 'ownNonTarget'] as const;
const OWNI = (c: string): number => OWN_CLASSES.indexOf(c as 'ownTarget');
/** PT-C0's own flight-retirement guard, reused */
const FLIGHT_RETIRE_TICKS = 720;
/** ⭐ PT-C0 (i)'s A4 limbs, reused with their own ANCHORED constants. */
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

/* --- THE FIXTURES (canon: a headline-bearing predicate needs a composition fixture) --- */
interface Fixture { name: string; got: unknown; want: unknown; ok: boolean }
const FIXTURES: Fixture[] = [];
const fx = (name: string, got: unknown, want: unknown): void => {
  FIXTURES.push({ name, got, want, ok: JSON.stringify(got) === JSON.stringify(want) });
};
const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-12;
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
fx('class.namesAreDistinct', [...new Set(CLASSES)].length, CLASSES.length);
fx('disp.ballLarger', dispCellOf(0.8, 0.2), 'ballLarger');
fx('disp.bodyLarger', dispCellOf(0.2, 0.8), 'bodyLarger');
fx('disp.tie', dispCellOf(0.5, 0.5), 'tie');
fx('vocab.kindsParsedOffSrc', KIND_VOCAB,
  ['controlAttempt', 'poke', 'deflection', 'header', 'body']);
fx('vocab.sectorsParsedOffSrc', SECTORS, ['front', 'side', 'back']);
fx('sites.nullNeedleCount', NULL_SITES_FOUND.length, 10);
fx('sites.creationNeedleCount', CREATE_SITES_FOUND.length, 1);
fx('sites.everyNullSiteHasAPurpose',
  SITE_PURPOSES.filter((s) => s.purpose.length > 0).length, NULL_SITES_FOUND.length);
fx('seam.bqCushionIsAbsentFromTheComposer', CUSHION_A4_SITES.length, 0);
/* ⭐⭐ BN-C0's SETTLE LADDER, on constructed settle-window states */
fx('bounce.sameSideIsNotABounce', isBounceOf(holdOutcomeOf(true, true, 0, 0)), false);
fx('bounce.opponentIsABounce', isBounceOf(holdOutcomeOf(true, true, 1, 0)), true);
fx('bounce.looseIsABounce', isBounceOf(holdOutcomeOf(true, true, null, 0)), true);
fx('bounce.outIsABounce', isBounceOf(holdOutcomeOf(true, false, null, 0)), true);
fx('bounce.unresolvedIsNoBounceFace', isBounceOf(holdOutcomeOf(false, true, null, 0)), false);
fx('bounce.outcomeOut', holdOutcomeOf(true, false, 0, 0), 'out');
fx('bounce.outcomeLoose', holdOutcomeOf(true, true, null, 1), 'loose');
fx('bounce.outcomeSameSide', holdOutcomeOf(true, true, 1, 1), 'sameSide');
fx('bounce.outcomeUnresolved', holdOutcomeOf(false, false, null, 0), 'unresolved');
fx('bounce.settleWindowIsTheEnginesOwnK', K_TICKS, CONTACT_CONTROL_DELAY_TICKS);
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
/* ⭐⭐ THE PAIRED Δ ARITHMETIC (armed − shut), on a constructed two-seed table */
{
  const nuS = [3, 5]; const deS = [2, 3]; const nuA = [4, 5]; const deA = [2, 2];
  const pS = ratio(sum(nuS), sum(deS));
  const pA = ratio(sum(nuA), sum(deA));
  fx('pairedDelta.ratioOfSumsShut', near(pS, 8 / 5), true);
  fx('pairedDelta.ratioOfSumsArmed', near(pA, 9 / 4), true);
  fx('pairedDelta.isArmedMinusShut', near(pA - pS, 9 / 4 - 8 / 5), true);
  fx('pairedDelta.emptyDenominatorIsNaN', Number.isNaN(ratio(1, 0)), true);
}
/* THE BIN HELPER and the 6-dp round-up the sizing declares */
fx('binOf.first', binOf(0.4, 0.5, 61), 0);
fx('binOf.overflow', binOf(999, 0.5, 61), 60);
fx('ceil6.roundsUp', ceil6(0.0123451), 0.012346);
fx('ceil6.exactStays', ceil6(0.012345), 0.012345);
const FIXTURES_OK = FIXTURES.every((f) => f.ok);

/* ========================================================================== */
/* §7 THE FROZEN BINS (frozen at the FREEZE COMMIT, before any battery seed).
   ⚠ Every width/count below is a BIN EDGE of a STORED histogram — never a rule and never a
   threshold: no conjunct's WORD depends on one, and every published cut re-derives off disk. */
/* ========================================================================== */
const NEAR_BIN_M = 0.5; const NEAR_BINS = 61;      // PT-C0's nearest-mate spacing limb
const MINPAIR_BIN_M = 0.5; const MINPAIR_BINS = 61; // PT-C0's 撞车 limb
const GROUPS = ['intended', 'all'] as const;        // INTENDED TARGETS primary, all bodies beside
type Group = (typeof GROUPS)[number];
const GI = (g: Group): number => GROUPS.indexOf(g);

/* ========================================================================== */
/* §8 THE PER-MATCH ROW — per-seed × per-arm cells (canon: per-seed cells, #282.2(ii))         */
/* ========================================================================== */
const STAT_KEYS = ['passes', 'passesCompleted', 'interceptions', 'goals', 'shots', 'saves',
  'tackles', 'dribbles', 'clearances', 'crosses', 'cutbacks', 'throughBalls', 'longBalls',
  'headersWon', 'passesForward', 'thirdMan', 'overlaps', 'bestPassChain',
  'miscontrols'] as const;
type StatKey = (typeof STAT_KEYS)[number];

interface Row {
  /* the world receipts */
  worldOk: boolean; armedVersion: number; cushionFlag: boolean; traceOn: boolean;
  rcBfAbsent: boolean; edsTouchCost: boolean; genomeClean: boolean;
  ticks: number; matches: number; wallMs: number;
  /* ⭐⭐ BQ-C1's POPULATION and ENDINGS */
  created: number[]; ended: number[];
  ledgerControlAttemptContacts: number;
  clsN: number[][]; clsObserved: number[]; clsInferred: number[];
  nrDisp: number[][];
  nrMarginCrossCheckN: number; nrMarginCrossCheckAgree: number;
  abSideKind: number[][];
  resolutions: number;
  /* ⭐⭐ THE ROLL, on INTENDED TARGETS (the E1a ledger READ) */
  rollAdjIntended: number; rollFailIntended: number; rollPFailSumIntended: number;
  rollAdjAll: number; rollFailAll: number;
  /* ⭐⭐ THE DUEL'S COUNT */
  contestEpisodes: number;
  /* ⭐⭐ BN-C0's BOUNCE and PT-C0's user faces */
  gpMeasured: number; gpFlights: number;
  contactClass: number[];
  ownSettleK: number[][]; ownBodyContacts: number[];
  ownTargetSideBack: number;
  ownTargetSector: number[]; ownTargetSectorCompleted: number[];
  recvSector: number[]; recvSectorN: number;
  rollFailSettleK: number[]; rollFailSettleN: number;
  /* PT-C0's crowd limbs */
  crowdSamples: number; spacingSum: number; spacingSamples: number;
  dupRunSum: number; crashHits: number; minPairN: number;
  nearBins: number[]; minPairBins: number[];
  /* the DF faces (DF-T1 §3's instrument, REUSED VERBATIM) */
  defenderTicks: number; markSwitches: number; markHeldTicks: number;
  /* the keeper */
  gkDistance: number;
  /* context on the 240 s match clock */
  openPlayTicks: number; bodyTicks: number; movingTicks: number; movingSpeedSum: number;
  possessionSpells: number; possessedTicks: number;
  stats: Record<StatKey, number>;
}
const emptyStats = (): Record<StatKey, number> => Object.fromEntries(
  STAT_KEYS.map((k) => [k, 0]),
) as Record<StatKey, number>;
const emptyRow = (): Row => ({
  worldOk: false, armedVersion: -1, cushionFlag: false, traceOn: false,
  rcBfAbsent: false, edsTouchCost: false, genomeClean: false,
  ticks: 0, matches: 1, wallMs: 0,
  created: zeros(2), ended: zeros(2), ledgerControlAttemptContacts: 0,
  clsN: zeros2(2, CLASSES.length), clsObserved: zeros(2), clsInferred: zeros(2),
  nrDisp: zeros2(2, DISP_CELLS.length),
  nrMarginCrossCheckN: 0, nrMarginCrossCheckAgree: 0,
  abSideKind: zeros2(SIDES.length, KIND_CELLS.length),
  resolutions: 0,
  rollAdjIntended: 0, rollFailIntended: 0, rollPFailSumIntended: 0,
  rollAdjAll: 0, rollFailAll: 0,
  contestEpisodes: 0,
  gpMeasured: 0, gpFlights: 0,
  contactClass: zeros(CONTACTS.length),
  ownSettleK: zeros2(OWN_CLASSES.length, HOLDS.length), ownBodyContacts: zeros(OWN_CLASSES.length),
  ownTargetSideBack: 0,
  ownTargetSector: zeros(SECTORS.length), ownTargetSectorCompleted: zeros(SECTORS.length),
  recvSector: zeros(SECTORS.length), recvSectorN: 0,
  rollFailSettleK: zeros(HOLDS.length), rollFailSettleN: 0,
  crowdSamples: 0, spacingSum: 0, spacingSamples: 0,
  dupRunSum: 0, crashHits: 0, minPairN: 0,
  nearBins: zeros(NEAR_BINS), minPairBins: zeros(MINPAIR_BINS),
  defenderTicks: 0, markSwitches: 0, markHeldTicks: 0,
  gkDistance: 0,
  openPlayTicks: 0, bodyTicks: 0, movingTicks: 0, movingSpeedSum: 0,
  possessionSpells: 0, possessedTicks: 0,
  stats: emptyStats(),
});

/* ========================================================================== */
/* §9 THE WALK — one match; PURE per-tick reads of `Match` state, NO WRAPPER.
   The CONTEST-EPISODE ledger and the E1a FIRST-TOUCH ledger are READ from their own public
   arrays, never re-implemented; `pendingControl` is read through a DECLARED TYPE VIEW (BQ-C0's
   precedent, ratified at #383 item 3). There is NO write of any kind.                        */
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
/** the moving floor for the context metres face — the ENGINE's OWN heading-follow floor */
const MOVING_FLOOR = 0.5;

interface PendingView { gid: number; readyTick: number; relativeSpeed: number }
interface Attempt {
  gid: number; side: Side; readyTick: number; relativeSpeed: number;
  contactTick: number; intended: boolean;
  ballX: number; ballY: number; bodyX: number; bodyY: number;
}
interface GpFlight {
  passerGid: number; passerSide: Side; targetGid: number; releaseTick: number;
  contactGid: number | null; contactClass: ContactClass; contactSector: BodySector | null;
  completedHere: boolean; interceptedHere: boolean; wentDead: boolean;
  recvSector: BodySector | null;
}
/** a deferred BN-C0 settle read: which cell it lands in when tick `due` arrives */
interface SettleRead {
  passerSide: Side; kind: 'ownFirstContact' | 'rollFail'; ownIdx: number;
  outcome: HoldOutcome;
}

const walkMatch = (m: Match, arm: Arm, observe: boolean): Row => {
  const tStart = Date.now();
  const row = emptyRow();
  const mm = m as unknown as {
    pendingControl: PendingView | null;
    pendingPass: { t: number; passerGid: number; targetGid: number; side: Side } | null;
    rcAnticipate?: boolean; rcReady?: boolean; bfFacingCost?: boolean;
    traceFirstTouch: boolean; traceContests: boolean; edsTouchCost: boolean;
    bqCushion: boolean;
  };
  row.armedVersion = raArmedVersion(m);
  row.cushionFlag = mm.bqCushion === true;
  row.traceOn = mm.traceFirstTouch === true && mm.traceContests === true;
  row.edsTouchCost = mm.edsTouchCost === true;
  row.rcBfAbsent = mm.rcAnticipate !== true && mm.rcReady !== true && mm.bfFacingCost !== true;
  row.genomeClean = ([0, 1] as const).every((s) => {
    const g = m.teams[s].info.genome as TacticalGenome & {
      raAccessWeight?: number; passLeadSupport?: number; dvExposureWeight?: number;
      rcReadyWeight?: number; facingDepth?: number; bqCushion?: number;
    };
    return g.raAccessWeight === undefined && g.passLeadSupport === undefined
      && g.dvExposureWeight === undefined && g.rcReadyWeight === undefined
      && g.facingDepth === undefined && g.bqCushion === undefined;
  });
  row.worldOk = row.armedVersion === RA_WORLD_VERSION
    && row.cushionFlag === wantsCushion(arm) && row.traceOn && row.rcBfAbsent && row.genomeClean;
  const players = m.allPlayers;

  let prevAttempt: PendingView | null = null;
  let open: Attempt | null = null;
  let ftCursor = 0;
  let epIdx = 0; let cIdx = 0;
  let prevRestart: unknown = m.restart;
  let prevPossessionSide: number = m.possessionSide;
  const prevStats: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
  for (const k of STAT_KEYS) prevStats[k] = [0, 0];
  let prevPendingPassT: number | null = mm.pendingPass?.t ?? null;
  let gp: GpFlight | null = null;
  const dueSettle = new Map<number, SettleRead[]>();
  const settleReads: SettleRead[] = [];
  const scheduleSettle = (tick: number, r: SettleRead): void => {
    settleReads.push(r);
    const arr = dueSettle.get(tick);
    if (arr === undefined) dueSettle.set(tick, [r]); else arr.push(r);
  };
  /* the 乱跑 state — DF-T1 §3's own per-defender previous assignment */
  const prevMark = new Map<string, number | null>();
  const markKey = (side: number, index: number): string => `${side}:${index}`;

  const bookGp = (f: GpFlight): void => {
    row.gpFlights += 1;
    row.contactClass[CTI(f.contactClass)] += 1;
    const isOwn = f.contactClass === 'ownTarget' || f.contactClass === 'ownNonTarget';
    if (isOwn) row.ownBodyContacts[OWNI(f.contactClass)] += 1;
    if (f.contactClass === 'ownTarget' && f.contactSector !== null) {
      row.ownTargetSector[SECTORS.indexOf(f.contactSector)] += 1;
      if (f.contactSector === 'side' || f.contactSector === 'back') row.ownTargetSideBack += 1;
      if (f.completedHere) row.ownTargetSectorCompleted[SECTORS.indexOf(f.contactSector)] += 1;
    }
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
    const ownerGid = ball.owner !== null ? ball.owner.gid : null;
    const ownerSide: Side | null = ball.owner !== null ? ball.owner.side as Side : null;
    const playing = m.phase === 'playing';
    const ballIsLive = playing || m.phase === 'restart';

    /* ---------- ⭐⭐ BN-C0's DEFERRED SETTLE READS, at contactTick + K ---------- */
    {
      const dueNow = dueSettle.get(tick);
      if (dueNow !== undefined) {
        for (const r of dueNow) r.outcome = holdOutcomeOf(true, ballIsLive, ownerSide, r.passerSide);
        dueSettle.delete(tick);
      }
    }

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
      if (c.kind === 'controlAttempt') row.ledgerControlAttemptContacts += 1;
      if (c.kind === 'deflection') deflectKind = 'deflection';
      else if (c.kind === 'body' && deflectKind === null) deflectKind = 'body';
    }

    /* ---------- ⭐⭐ THE E1a FIRST-TOUCH LEDGER, READ (the roll's COUNT and its RATE) ------ */
    const trace = m.firstTouchTrace;
    const rollFailThisTick = new Set<number>();
    for (let i = ftCursor; i < trace.length; i++) {
      const e = trace[i];
      row.rollAdjAll += 1;
      if (!e.clean) row.rollFailAll += 1;
      if (e.intendedTarget) {
        row.rollAdjIntended += 1;
        row.rollPFailSumIntended += e.pFail;
        if (!e.clean) row.rollFailIntended += 1;
      }
      if (!e.clean) {
        rollFailThisTick.add(e.gid);
        /* ⭐ BN-C0's settle ladder read at +K AFTER A FAILED ROLL — who has the ball three
           ticks later. The "passing side" for this read is the FAILING BODY's own side. */
        scheduleSettle(tick + K_TICKS, {
          passerSide: players[e.gid].side as Side, kind: 'rollFail', ownIdx: 0,
          outcome: 'unresolved',
        });
      }
    }
    ftCursor = trace.length;

    /* ---------- THE OFFSIDE / DEAD-BALL SIGNATURES (the engine's own records) ---------- */
    const restartNow = m.restart;
    const newRestart = restartNow !== null && restartNow !== prevRestart;
    const offsideThisTick = newRestart
      && (restartNow as unknown as { offside?: boolean }).offside === true;
    const deadBallThisTick = newRestart || !playing || m.finished;
    prevRestart = restartNow;

    /* ---------- ⭐⭐ THE POPULATION — every `pendingControl`, CREATED to ENDED ---------- */
    const cur = mm.pendingControl;
    const changed = (prevAttempt === null) !== (cur === null)
      || (prevAttempt !== null && cur !== null
        && (cur.gid !== prevAttempt.gid || cur.readyTick !== prevAttempt.readyTick));
    if (changed && open !== null) {
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
      if (cls === 'resolvedNotReachedMargin' || cls === 'resolvedNotReachedStunnedOrOff') {
        const ballDisp = Math.hypot(ball.pos.x - a.ballX, ball.pos.y - a.ballY);
        const bodyDisp = Math.hypot(p.pos.x - a.bodyX, p.pos.y - a.bodyY);
        const d = dispCellOf(ballDisp, bodyDisp);
        for (const g of groups) row.nrDisp[GI(g)][DPI(d)] += 1;
        /* ⭐ THE GEOMETRY CROSS-CHECK — the SHIPPED `directBallAccess`, RE-CALLED at the end
           tick against the resolver's own retention-margin test (a DECLARED reconstruction one
           physics step later; a RECEIPT, never a class definition). */
        if (!p.sentOff) {
          row.nrMarginCrossCheckN += 1;
          const acc = directBallAccess(p, ball, players, CONTROL_RADIUS);
          const exceeded = acc.geometry.centerDistance
            > acc.sectorCenterReach + CONTACT_CONTROL_RETENTION_MARGIN;
          if (exceeded === (cls === 'resolvedNotReachedMargin')) row.nrMarginCrossCheckAgree += 1;
        }
      }
      if (a.intended && (cls === 'abandonedContactOpponent' || cls === 'abandonedContactTeammate'
        || cls === 'abandonedContactSameReceiver')) {
        const sc: SideCell = cls === 'abandonedContactOpponent' ? 'opponent'
          : cls === 'abandonedContactTeammate' ? 'teammate' : 'sameReceiver';
        const kindHere = contactsThisTick.find((c) => c.gid === replacedByGid);
        row.abSideKind[SDI(sc)][KDI(kindHere?.kind ?? 'silent')] += 1;
      }
      open = null;
    }
    if (changed && cur !== null) {
      const p = players[cur.gid];
      const side = p.side as Side;
      const pp0 = mm.pendingPass;
      const intended = pp0 !== null && pp0.targetGid === cur.gid && pp0.side === side;
      open = {
        gid: cur.gid, side, readyTick: cur.readyTick, relativeSpeed: cur.relativeSpeed,
        contactTick: tick, intended,
        ballX: ball.pos.x, ballY: ball.pos.y, bodyX: p.pos.x, bodyY: p.pos.y,
      };
      for (const g of (intended ? ['intended', 'all'] : ['all']) as Group[]) {
        row.created[GI(g)] += 1;
      }
    }
    prevAttempt = cur === null ? null : { ...cur };

    /* ---------- CONTEXT, THE DF FACES AND PT-C0's CROWD LIMBS ---------- */
    if (playing) {
      row.openPlayTicks += 1;
      if (m.possessionSide !== -1) row.possessedTicks += 1;
      if (m.possessionSide !== -1 && m.possessionSide !== prevPossessionSide) {
        row.possessionSpells += 1;
      }
      for (const p of players) {
        if (p.sentOff) continue;
        row.bodyTicks += 1;
        const sp = Math.hypot(p.vel.x, p.vel.y);
        if (sp > MOVING_FLOOR) { row.movingTicks += 1; row.movingSpeedSum += sp; }
      }
      /* ⭐ THE DF FACES — DF-T1 §3's instrument, REUSED VERBATIM */
      for (const t of m.teams) {
        const side = t.side;
        if (m.possessionSide === side) continue;
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
      /* ⭐ 挤人 — PT-C0's A4 limbs at the A4 battery's own cadence */
      if (tick % SAMPLE_EVERY === 0) {
        const possSide: Side | null = ownerGid !== null ? players[ownerGid].side as Side
          : (gp !== null ? gp.passerSide : null);
        if (possSide !== null) {
          const outs = m.teams[possSide].players.filter((q) => q.role !== 'GK' && !q.sentOff);
          const xs = outs.map((q) => q.pos.x);
          const ys = outs.map((q) => q.pos.y);
          row.crowdSamples += 1;
          for (let a2 = 0; a2 < xs.length; a2++) {
            const nearest = nearestMateOf(xs, ys, a2);
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
    prevPossessionSide = m.possessionSide;

    /* ---------- (iii) THE GROUND-PASS RELEASE (PT-C0's own; BN-C0's population) ---------- */
    const d: Record<StatKey, [number, number]> = {} as Record<StatKey, [number, number]>;
    for (const k of STAT_KEYS) {
      const a2 = m.teams[0].stats[k] as number;
      const b2 = m.teams[1].stats[k] as number;
      d[k] = [a2 - prevStats[k][0], b2 - prevStats[k][1]];
      prevStats[k] = [a2, b2];
    }
    const pp = mm.pendingPass;
    const passT = pp?.t ?? null;
    const passChangedHere = passT !== null && passT !== prevPendingPassT;
    prevPendingPassT = passT;
    const lastTouch = ball.lastTouch;
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
        contactGid: null, contactClass: 'none', contactSector: null,
        completedHere: false, interceptedHere: false, wentDead: false, recvSector: null,
      };
    }
    /* ---------- (iii) FOLLOW THE GROUND PASS ---------- */
    if (gp !== null) {
      const f = gp;
      if (f.contactGid === null && lastTouch !== null && lastTouch.gid !== f.passerGid) {
        f.contactGid = lastTouch.gid;
        f.contactClass = contactClassOf(
          lastTouch.gid, f.targetGid, lastTouch.side as Side, f.passerSide,
        );
        f.contactSector = ballAccessGeometry(lastTouch, ball, CONTROL_RADIUS).sector;
        /* ⭐⭐ BN-C0's BOUNCE: an OWN-body first contact, read at contactTick + K */
        if (f.contactClass === 'ownTarget' || f.contactClass === 'ownNonTarget') {
          scheduleSettle(tick + K_TICKS, {
            passerSide: f.passerSide, kind: 'ownFirstContact',
            ownIdx: OWNI(f.contactClass), outcome: 'unresolved',
          });
        }
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
    for (const r of settleReads) {
      if (r.kind === 'rollFail') {
        row.rollFailSettleK[HOI(r.outcome)] += 1;
        if (r.outcome !== 'unresolved') row.rollFailSettleN += 1;
      } else {
        row.ownSettleK[r.ownIdx][HOI(r.outcome)] += 1;
      }
    }
    row.contestEpisodes = m.contestEpisodes.length;
    for (const t of m.teams) for (const p of t.players) if (p.role === 'GK') row.gkDistance += p.distance;
    const st = [m.teams[0].stats, m.teams[1].stats] as unknown as Record<StatKey, number>[];
    for (const k of STAT_KEYS) row.stats[k] = st[0][k] + st[1][k];
  }
  row.wallMs = Date.now() - tStart;
  return row;
};

/* ========================================================================== */
/* §10 gTraceInert — BOTH TRACE FLAGS ONLY RECORD                              */
/* ========================================================================== */
banner('BQ-T1 — gTraceInert (both traces ON vs OFF, whole-match signatures, per arm)');
const traceInertRows = TRACE_INERT_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const on = signatureOf(runOut(buildMatch(seed, arm, true)));
  const off = signatureOf(runOut(buildMatch(seed, arm, false)));
  return { seed, arm, signatureTraceOn: on, signatureTraceOff: off, equal: on === off };
}));
const TRACE_INERT_OK = traceInertRows.every((r) => r.equal);
banner(`  gTraceInert ${TRACE_INERT_OK ? 'GREEN' : 'RED'} (${traceInertRows.length} pairs)`);

/* ========================================================================== */
/* §11 gLockstep — NO WRAPPER; the observation reads are BYTE-INERT.
      gArmsDiverge — SOME, not EVERY (#364 item 1's ratified reading), on the SCORED pair.    */
/* ========================================================================== */
banner('BQ-T1 — the lockstep receipt (observed vs unobserved, PER ARM)');
const lockstepRows = LOCKSTEP_SEEDS.flatMap((seed) => ARMS.map((arm) => {
  const observed = buildMatch(seed, arm);
  walkMatch(observed, arm, true);
  const unobserved = buildMatch(seed, arm);
  walkMatch(unobserved, arm, false);
  return { seed, arm, observed: signatureOf(observed), unobserved: signatureOf(unobserved) };
}));
const LOCKSTEP_OK = lockstepRows.every((r) => r.observed === r.unobserved);
banner(`  gLockstep ${LOCKSTEP_OK ? 'GREEN' : 'RED'} (${lockstepRows.length} walks)`);
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
/* §12 THE BATTERY — the FOUR ARMS PAIRED on every seed                        */
/* ========================================================================== */
interface Cell { seed: number; rows: Record<Arm, Row> }
const cells: Cell[] = [];
banner(`BQ-T1 — the battery: ${N} SHARED SEEDS × ${ARMS.length} arms `
  + `(${N * ARMS.length} walks), seeds ${batterySeeds[0]}–${batterySeeds[batterySeeds.length - 1]}`);
const CHUNK = 25;
for (let start = 0; start < batterySeeds.length; start += CHUNK) {
  for (const seed of batterySeeds.slice(start, start + CHUNK)) {
    const rows = {} as Record<Arm, Row>;
    for (const arm of ARMS) rows[arm] = walkMatch(buildMatch(seed, arm), arm, true);
    cells.push({ seed, rows });
  }
  banner(`  … ${Math.min(start + CHUNK, batterySeeds.length)}/${batterySeeds.length} seeds `
    + `×${ARMS.length} arms (${((Date.now() - t0Wall) / 1000).toFixed(1)} s)`);
}
const receiptRows = {} as Record<Arm, Row>;
for (const arm of ARMS) receiptRows[arm] = walkMatch(buildMatch(RECEIPT_SEED, arm), arm, true);
const walksBooked = (cells.length + 1) * ARMS.length;
const armRows = (arm: Arm): Row[] => cells.map((c) => c.rows[arm]);

/* ========================================================================== */
/* §13 THE ESTIMATOR — CLUSTER BOOTSTRAP over the SHARED seeds (consumes NO stats)             */
/* ========================================================================== */
const BOOTSTRAP = 2000;
const rngBoot = new Rng(BLOCK_BASE);
const resampleIndex: number[][] = Array.from({ length: BOOTSTRAP }, () => Array
  .from({ length: cells.length }, () => Math.floor(rngBoot.next() * cells.length) % cells.length));
const pctl = (s: number[], q: number): number => (s.length === 0 ? Number.NaN
  : s[Math.min(s.length - 1, Math.floor(q * s.length))]);
interface FaceDef {
  unit: string; group: string; what: string;
  num: (r: Row) => number; dn: (r: Row) => number;
}
const FACES: Record<string, FaceDef> = {};
const defFace = (
  key: string, unit: string, group: string, what: string,
  num: (r: Row) => number, dn: (r: Row) => number,
): void => { FACES[key] = { unit, group, what, num, dn }; };

/* --- BQ-C1's own accessors, COPIED --- */
const nonPoss = (r: Row, g: Group): number =>
  r.ended[GI(g)] - r.clsN[GI(g)][CI(POSSESSION_CLASS)];
const clsCount = (r: Row, g: Group, c: Cls): number => r.clsN[GI(g)][CI(c)];
const parentContact = (r: Row, g: Group): number => clsCount(r, g, 'abandonedContactOpponent')
  + clsCount(r, g, 'abandonedContactTeammate') + clsCount(r, g, 'abandonedContactSameReceiver');
const parentNotReached = (r: Row, g: Group): number =>
  clsCount(r, g, 'resolvedNotReachedStunnedOrOff') + clsCount(r, g, 'resolvedNotReachedMargin');
const lineTotal = (r: Row, g: Group): number => clsCount(r, g, 'abandonedDeadBallOut')
  + clsCount(r, g, 'abandonedOffside') + clsCount(r, g, 'resolvedOffside');

/* ---- ⭐⭐ THE SIX SCORED FACES (H-BQ.1's conjuncts) ---- */
defFace('population.intended.nonPossessionShare', 'share', 'SCORED (a)',
  '⭐⭐ (a) 「留球」 — BQ-C1\'s `population.intended.nonPossessionShare`: pending controls created '
  + 'for the `pendingPass` target that end in any class OTHER than RESOLVED-CLEAN, over ALL such '
  + 'pending controls. BQ-C1\'s population, sites, attribution and precedence REUSED and '
  + 'RE-ANCHORED at this head',
  (r) => nonPoss(r, 'intended'), (r) => r.ended[GI('intended')]);
defFace('attempts.intended.notReachedMarginOfAttempts', 'share of INTENDED ATTEMPTS', 'SCORED (b)',
  '⭐⭐ (b) 「几何那一类」 — the RESOLVED-NOT-REACHED-margin class COUNT ÷ pending controls created '
  + 'for intended targets. ⚠ THE DENOMINATOR IS ATTEMPTS, NOT NON-POSSESSION ENDINGS — so a '
  + 'change in the non-possession total cannot move this face by composition alone',
  (r) => clsCount(r, 'intended', 'resolvedNotReachedMargin'), (r) => r.ended[GI('intended')]);
defFace('attempts.intended.opponentContactOfAttempts', 'share of INTENDED ATTEMPTS', 'SCORED (c)',
  '⭐⭐ (c) 「对抗不减」 — the ABANDONED-BY-CONTACT class with the REPLACING BODY AN OPPONENT, '
  + 'COUNT ÷ pending controls created for intended targets. ⚠ ATTEMPTS, not non-possession '
  + 'endings',
  (r) => clsCount(r, 'intended', 'abandonedContactOpponent'), (r) => r.ended[GI('intended')]);
defFace('goalsPerMatch', 'goals per match (240 s match clock)', 'SCORED (d1)',
  '⭐ (d1) GOALS — both sides, the engine\'s own counter; a BAND rule [−0.30, +0.30] '
  + '(BF-T1\'s band, VERBATIM)', (r) => r.stats.goals, (r) => r.matches);
defFace('passCompletion', 'share', 'SCORED (d2)',
  '⭐ (d2) COMPLETION — the ENGINE\'s own whole-match completion over ALL deliveries '
  + '(BF-T1\'s face, VERBATIM)', (r) => r.stats.passesCompleted, (r) => r.stats.passes);
defFace('interceptionsPerMatch', 'interceptions per match (240 s match clock)', 'SCORED (d3)',
  '⭐ (d3) INTERCEPTIONS — the MATCH TOTAL (⚠ BOTH sides carry the armed law in the armed arms, '
  + 'so every interception is conceded by a side whose bodies are armed). STATED',
  (r) => r.stats.interceptions, (r) => r.matches);

/* ---- ⭐⭐ BQ-C1's FULL COMPOSITION, on BOTH denominators, for BOTH groups ---- */
for (const g of GROUPS) {
  const gi = GI(g);
  const lbl = g === 'intended' ? 'INTENDED TARGETS (PRIMARY)' : 'ALL BODIES (beside)';
  defFace(`population.${g}.attemptsPerMatch`, 'attempts per match (240 s match clock)',
    'REPORTED population',
    `⭐ PENDING CONTROLS CREATED per match — ${lbl}. The \`applyControlContact\` creation site is `
    + 'the ONE creation site (anchored, needle count 1); observed at TICK BOUNDARIES through the '
    + 'DECLARED type view of the private `pendingControl` field — a READ, never a write',
    (r) => r.created[gi], (r) => r.matches);
  defFace(`population.${g}.endingsPerMatch`, 'endings per match (240 s match clock)',
    'REPORTED population', `PENDING CONTROLS that ENDED per match — ${lbl}`,
    (r) => r.ended[gi], (r) => r.matches);
  defFace(`population.${g}.observedShare`, 'share', 'REPORTED population',
    `⭐ THE OBSERVED SHARE of endings — ${lbl}: classes whose attribution has a UNIQUE PUBLIC `
    + 'SIGNATURE. The complement is INFERRED and published as BOUNDS (BQ-C1 §P.B)',
    (r) => r.clsObserved[gi], (r) => r.ended[gi]);
  defFace(`population.${g}.inferredShare`, 'share', 'REPORTED population',
    `⭐ THE INFERRED SHARE of endings — ${lbl}: the NOT-REACHED split, the dead-ball/out class, `
    + 'the possession-elsewhere class and the `other` receipt class — each a BOUND',
    (r) => r.clsInferred[gi], (r) => r.ended[gi]);
  if (g === 'all') {
    defFace('population.all.nonPossessionShare', 'share', 'REPORTED population',
      'the non-possession share over ALL BODIES (beside the scored intended-target face)',
      (r) => nonPoss(r, 'all'), (r) => r.ended[GI('all')]);
  }
  for (const c of CLASSES) {
    defFace(`composition.${g}.${c}`, 'share of NON-POSSESSION endings', 'REPORTED composition',
      `⭐⭐ THE COMPOSITION OF NON-POSSESSION ENDINGS — \`${c}\`, ${lbl}. ${
        CLASS_OBSERVED[c] ? 'OBSERVED (a unique public signature)' : 'INFERRED — a BOUND'}`,
      (r) => clsCount(r, g, c), (r) => nonPoss(r, g));
    defFace(`attempts.${g}.${c}OfAttempts`, 'share of ATTEMPTS', 'REPORTED composition',
      `⭐ the same class as a share of ATTEMPTS (pending controls ended) — ${lbl}. ${
        CLASS_OBSERVED[c] ? 'OBSERVED' : 'INFERRED — a BOUND'}`,
      (r) => clsCount(r, g, c), (r) => r.ended[gi]);
  }
  defFace(`composition.${g}.parent.abandonedByContact`, 'share of NON-POSSESSION endings',
    'REPORTED composition',
    '⭐⭐ THE PARENT — ABANDONED-BY-CONTACT (opponent + teammate + the same receiver again)',
    (r) => parentContact(r, g), (r) => nonPoss(r, g));
  defFace(`composition.${g}.parent.resolvedNotReached`, 'share of NON-POSSESSION endings',
    'REPORTED composition',
    '⭐⭐ THE PARENT — RESOLVED-NOT-REACHED (the stunned/sent-off bound + the margin bound)',
    (r) => parentNotReached(r, g), (r) => nonPoss(r, g));
  defFace(`composition.${g}.parent.line`, 'share of NON-POSSESSION endings',
    'REPORTED composition', '⭐ THE LINE — dead ball / out / offside (both offside classes)',
    (r) => lineTotal(r, g), (r) => nonPoss(r, g));
  defFace(`attempts.${g}.parent.abandonedByContactOfAttempts`, 'share of ATTEMPTS',
    'REPORTED composition', 'the ABANDONED-BY-CONTACT parent as a share of ATTEMPTS',
    (r) => parentContact(r, g), (r) => r.ended[gi]);
  defFace(`attempts.${g}.parent.resolvedNotReachedOfAttempts`, 'share of ATTEMPTS',
    'REPORTED composition', 'the RESOLVED-NOT-REACHED parent as a share of ATTEMPTS',
    (r) => parentNotReached(r, g), (r) => r.ended[gi]);
  for (const dcell of DISP_CELLS) {
    defFace(`notReached.${g}.${dcell}OfNonPossession`, 'share of NON-POSSESSION endings',
      'REPORTED composition',
      `⭐⭐ RESOLVED-NOT-REACHED with the ${dcell === 'ballLarger' ? 'BALL\'s' : dcell === 'bodyLarger'
        ? 'BODY\'s' : 'two'} displacement ${dcell === 'tie' ? 'EQUAL' : 'the LARGER'} across the `
      + 'window — "the cushion ran away" and "he ran away" are exactly these two cells',
      (r) => r.nrDisp[gi][DPI(dcell)], (r) => nonPoss(r, g));
    defFace(`notReached.${g}.${dcell}OfAttempts`, 'share of ATTEMPTS', 'REPORTED composition',
      'the same cell as a share of ATTEMPTS', (r) => r.nrDisp[gi][DPI(dcell)], (r) => r.ended[gi]);
    defFace(`notReached.${g}.${dcell}OfNotReached`, 'share of the NOT-REACHED class',
      'REPORTED composition', 'the same cell inside the RESOLVED-NOT-REACHED class itself',
      (r) => r.nrDisp[gi][DPI(dcell)], (r) => parentNotReached(r, g));
  }
}
/* ---- THE ABANDONED-BY-CONTACT SPLIT (side × the LEDGER's own kind) ---- */
for (const s of SIDES) {
  for (const k of KIND_CELLS) {
    defFace(`abandonedSplit.${s}.${k}`, 'share of ABANDONED-BY-CONTACT endings',
      'REPORTED composition',
      `⭐ THE REPLACING BODY — \`${s}\` × the CONTEST LEDGER's own kind \`${k}\``
      + `${k === 'silent' ? ' (the ledger recorded no contact by that body at that tick — '
        + 'PUBLISHED AS SUCH, never imputed)' : ''}, over ABANDONED-BY-CONTACT endings on `
      + 'INTENDED TARGETS',
      (r) => r.abSideKind[SDI(s)][KDI(k)], (r) => sum(r.abSideKind.map((rr) => sum(rr))));
  }
  defFace(`abandonedSplit.${s}.total`, 'share of ABANDONED-BY-CONTACT endings',
    'REPORTED composition',
    `⭐⭐ THE REPLACING BODY — \`${s}\`, over ABANDONED-BY-CONTACT endings on INTENDED TARGETS`,
    (r) => sum(r.abSideKind[SDI(s)]), (r) => sum(r.abSideKind.map((rr) => sum(rr))));
}
/* ---- THE RECEIPTS (⛔ PLUMBING, never football effect sizes) ---- */
defFace('population.ledgerControlAttemptContactsPerMatch', 'contacts per match (240 s clock)',
  'RECEIPT (plumbing)',
  '⛔ THE CREATION RECEIPT — the CONTEST LEDGER\'s own `controlAttempt` contacts per match',
  (r) => r.ledgerControlAttemptContacts, (r) => r.matches);
defFace('population.creationLedgerAgreementShare', 'share', 'RECEIPT (plumbing)',
  '⛔ pending controls the exam OBSERVED created, over the ledger\'s own `controlAttempt` '
  + 'contacts. The gap is the offside branch\'s pre-creation aborts plus any attempt created AND '
  + 'ended inside ONE tick, which a tick-boundary read cannot see',
  (r) => r.created[GI('all')], (r) => r.ledgerControlAttemptContacts);
defFace('notReached.marginCrossCheckAgreementShare', 'share', 'RECEIPT (plumbing)',
  '⛔ THE GEOMETRY CROSS-CHECK — NOT-REACHED endings where the SHIPPED `directBallAccess`, '
  + 'RE-CALLED at the END tick, agrees with the class assigned. ⚠ A DECLARED RECONSTRUCTION one '
  + 'physics step after the resolver read it — a RECEIPT, never a class definition',
  (r) => r.nrMarginCrossCheckAgree, (r) => r.nrMarginCrossCheckN);
defFace('reconciliation.resolutionsPerMatch', 'resolutions per match (240 s match clock)',
  'RECEIPT (plumbing)',
  '⛔ endings AT OR AFTER `readyTick` (BQ-C0\'s own denominator), per match',
  (r) => r.resolutions, (r) => r.matches);

/* ---- ⭐⭐ THE ROLL ON INTENDED TARGETS — the COUNT and the RATE, both (the E1a ledger READ) -- */
defFace('roll.adjudicationsPerMatchIntended', 'adjudications per match (240 s match clock)',
  'REPORTED the roll',
  '⭐⭐ THE ROLL\'S COUNT on intended targets — E1a trace entries with `intendedTarget` true, per '
  + 'match. ⭐ THE POINT OF THE FACE: armed, the roll SEES the attempts the margin used to '
  + 'swallow, so the COUNT can move even where the RATE does not',
  (r) => r.rollAdjIntended, (r) => r.matches);
defFace('roll.failuresPerMatchIntended', 'failures per match (240 s match clock)',
  'REPORTED the roll', '⭐⭐ the roll\'s FAILURES on intended targets per match',
  (r) => r.rollFailIntended, (r) => r.matches);
defFace('roll.realisedFailShareIntended', 'share', 'REPORTED the roll',
  '⭐⭐ THE ROLL\'S RATE on intended targets — failures ÷ adjudications (the engine\'s own '
  + 'ledger, both numerator and denominator)',
  (r) => r.rollFailIntended, (r) => r.rollAdjIntended);
defFace('roll.meanLoggedPFailIntended', 'probability', 'REPORTED the roll',
  '⭐⭐ the MEAN LOGGED `pFail` on intended-target adjudications — the exact term the roll used, '
  + 'read from the engine\'s own ledger entry (⛔ never re-computed)',
  (r) => r.rollPFailSumIntended, (r) => r.rollAdjIntended);
defFace('roll.adjudicationsPerMatchAll', 'adjudications per match (240 s match clock)',
  'REPORTED the roll', 'the same COUNT over ALL BODIES', (r) => r.rollAdjAll, (r) => r.matches);
defFace('roll.realisedFailShareAll', 'share', 'REPORTED the roll',
  'the same RATE over ALL BODIES', (r) => r.rollFailAll, (r) => r.rollAdjAll);

/* ---- ⭐⭐ THE DUEL'S COUNT (not only its share) ---- */
defFace('duel.opponentContactsPerMatch', 'contacts per match (240 s match clock)',
  'REPORTED the duel',
  '⭐⭐ THE DUEL\'S COUNT — opponent contacts INSIDE THE WINDOW per match: the endings on '
  + 'intended targets at which a body OF THE OTHER SIDE replaced a live attempt (the creation '
  + 'site\'s own overwrite, read off the engine\'s `pendingControl` field; every one of them '
  + 'carries the ledger kind `controlAttempt`). ⭐ A STABLE SHARE WITH A MOVING COUNT IS VISIBLE '
  + 'only because both are published',
  (r) => clsCount(r, 'intended', 'abandonedContactOpponent'), (r) => r.matches);
defFace('duel.teammateContactsPerMatch', 'contacts per match (240 s match clock)',
  'REPORTED the duel', 'the same COUNT for a TEAMMATE replacing the attempt (「有人挤人」)',
  (r) => clsCount(r, 'intended', 'abandonedContactTeammate'), (r) => r.matches);
defFace('duel.contestEpisodesPerMatch', 'episodes per match (240 s match clock)',
  'REPORTED the duel',
  '⭐ THE CONTEST-EPISODE LEDGER\'s own length per match — the engine\'s own record, READ',
  (r) => r.contestEpisodes, (r) => r.matches);
defFace('duel.tacklesPerMatch', 'tackles per match (240 s match clock)', 'REPORTED the duel',
  'the engine\'s own `tackles` counter, both sides — the CONTACT half of the defensive pair',
  (r) => r.stats.tackles, (r) => r.matches);

/* ---- ⭐⭐ BN-C0's BOUNCE FACE and SETTLE LADDER (its predicate and ladder REUSED, anchored) -- */
const ownResolved = (r: Row, oi: number): number =>
  sum(r.ownSettleK[oi]) - r.ownSettleK[oi][HOI('unresolved')];
const ownBounces = (r: Row, oi: number): number => r.ownSettleK[oi][HOI('opponent')]
  + r.ownSettleK[oi][HOI('loose')] + r.ownSettleK[oi][HOI('out')];
for (let oi = 0; oi < OWN_CLASSES.length; oi++) {
  const own = OWN_CLASSES[oi];
  defFace(`bounce.${own}BounceRate`, 'share of resolved own-body first contacts',
    'REPORTED the bounce',
    `⭐⭐ 「传到人身上弹回」 — BN-C0's BOUNCE PREDICATE, REUSED: a \`${own}\` FIRST body contact of `
    + 'a MEASURED GROUND PASS after which the PASSING SIDE does NOT hold the ball at '
    + `contactTick + K (K = ${K_TICKS} = CONTACT_CONTROL_DELAY_TICKS, imported). The ladder is `
    + '`sameSide` / `opponent` / `loose` / `out`; BOUNCE = not `sameSide`. ⚠ `unresolved` (the '
    + 'whistle came first) is COUNTED and enters NO bounce face',
    (r) => ownBounces(r, oi), (r) => ownResolved(r, oi));
  defFace(`bounce.${own}FirstShare`, 'share of measured ground passes', 'REPORTED the bounce',
    `the share of measured ground passes whose FIRST body contact is a \`${own}\` body`,
    (r) => r.contactClass[CTI(own)], (r) => r.gpFlights);
  defFace(`bounce.${own}UnresolvedShare`, 'share of own-body first contacts',
    'REPORTED the bounce',
    `\`${own}\` first contacts whose settle window ran past FULL TIME — COUNTED, never imputed`,
    (r) => r.ownSettleK[oi][HOI('unresolved')], (r) => sum(r.ownSettleK[oi]));
  for (const h of HOLDS) {
    defFace(`bounce.${own}Settle.${h}`, 'share of own-body first contacts',
      'REPORTED the bounce',
      `the settle-window ladder at contactTick + K — \`${h}\`, over \`${own}\` first contacts`,
      (r) => r.ownSettleK[oi][HOI(h)], (r) => sum(r.ownSettleK[oi]));
  }
}
for (const h of HOLDS) {
  defFace(`rollFailSettle.${h}`, 'share of roll failures with a resolved window',
    'REPORTED the bounce',
    `⭐⭐ BN-C0's SETTLE LADDER AT +K AFTER A FAILED ROLL — who has the ball three ticks after `
    + `the touch was spilled: \`${h}\`, over E1a failures whose window resolved. ⚠ the "passing `
    + 'side" for this read is the FAILING BODY\'s own side, and `unresolved` is excluded from '
    + 'the denominator (it is published as its own share below)',
    (r) => (h === 'unresolved' ? 0 : r.rollFailSettleK[HOI(h)]), (r) => r.rollFailSettleN);
}
defFace('rollFailSettle.unresolvedShare', 'share of roll failures', 'REPORTED the bounce',
  'roll failures whose settle window ran past FULL TIME — COUNTED, never imputed',
  (r) => r.rollFailSettleK[HOI('unresolved')], (r) => sum(r.rollFailSettleK));

/* ---- ⭐⭐ THE USER'S THREE PT-C0 FACES ---- */
defFace('contact.opponentFirstContactShare', 'share of measured ground passes',
  'REPORTED user face',
  '⭐⭐ 「传到对面身上」 — of every MEASURED GROUND PASS, the share whose FIRST body contact after '
  + 'the release is an OPPONENT (PT-C0 (iii)\'s classes, reused)',
  (r) => r.contactClass[CTI('opponent')], (r) => r.gpFlights);
defFace('contact.ownTargetSideBackShare', 'share of measured ground passes',
  'REPORTED user face',
  '⭐⭐ 「侧身/背身接球」 — P(first contact = the own TARGET with sector ∈ {side, back}) over ALL '
  + 'measured ground passes (PT-C0\'s own face; the BK `BodySector` classifier CALLED)',
  (r) => r.ownTargetSideBack, (r) => r.gpFlights);
defFace('crowd.crashShare', 'share of sampled open-play ticks with an attributable side',
  'REPORTED user face',
  `⭐⭐ 「挤人」/撞车 — the share of samples whose MINIMUM PAIRWISE attacking-outfield distance is `
  + `below DUP_RUN_M = ${DUP_RUN_M} m (PT-C0 (i)'s A4 limb, anchored constants)`,
  (r) => r.crashHits, (r) => r.minPairN);
defFace('crowd.dupRunPairsPerSample', 'duplicate-run pairs per sample', 'REPORTED user face',
  'the A4 dup-run limb beside it', (r) => r.dupRunSum, (r) => r.crowdSamples);
defFace('crowd.nearestMateMeanMetres', 'metres', 'REPORTED user face',
  'the A4 spacing limb beside it', (r) => r.spacingSum, (r) => r.spacingSamples);
defFace('contact.noneFirstContactShare', 'share of measured ground passes',
  'REPORTED user face',
  'the share of measured ground passes with NO body contact at all before the flight retired',
  (r) => r.contactClass[CTI('none')], (r) => r.gpFlights);

/* ---- ⭐ THE SECTORS: the receiver's first-touch sector shares, and COMPLETION BY SECTOR ---- */
for (const s of SECTORS) {
  const si = SECTORS.indexOf(s);
  const Cap = `${s[0].toUpperCase()}${s.slice(1)}`;
  defFace(`contact.receiver${Cap}ShareCompleted`, 'share of completed measured ground passes',
    'REPORTED sectors',
    `⭐ the receiver's facing SECTOR at his first touch on COMPLETED passes — \`${s}\` (the BK `
    + '`BodySector` classifier CALLED, at the completion tick)',
    (r) => r.recvSector[si], (r) => r.recvSectorN);
  defFace(`sector.firstTouch.${s}Share`, 'share of own-target first contacts',
    'REPORTED sectors',
    `⭐ the sector of the OWN-TARGET FIRST CONTACT itself — \`${s}\` (read at the contact tick)`,
    (r) => r.ownTargetSector[si], (r) => sum(r.ownTargetSector));
  defFace(`sector.completionBy.${s}`, 'share of own-target first contacts in the sector',
    'REPORTED sectors',
    `⭐⭐ COMPLETION BY SECTOR — of own-target first contacts made in the \`${s}\` sector, the `
    + 'share whose pass COMPLETED (the engine\'s own `passesCompleted` delta for the passing '
    + 'side while the flight was live)',
    (r) => r.ownTargetSectorCompleted[si], (r) => r.ownTargetSector[si]);
}

/* ---- ⭐ THE DEFENCE (DF-T1 §3 / DF-C0 §R2's definitions, REUSED VERBATIM and anchored) ---- */
defFace('df.markSwitchesPerDefenderMinute', 'switches per defender-minute (60 sim-s a body '
  + 'spent out of possession)', 'REPORTED defence',
  '⭐⭐ 乱跑 ITSELF — a marker\'s assigned man CHANGES (DF-C0 §R2\'s definition, DF-T1 §3\'s '
  + 'instrument, REUSED VERBATIM and anchored)',
  (r) => r.markSwitches, (r) => (r.defenderTicks * DT) / 60);
defFace('df.markHeldShare', 'share of defender body-ticks', 'REPORTED defence',
  '⭐ MARKING COVERAGE — how much of his defending life a body actually HAS a mark',
  (r) => r.markHeldTicks, (r) => r.defenderTicks);
defFace('df.interceptionsPerMatch', 'interceptions per match (240 s match clock)',
  'REPORTED defence', 'the READING half of the defensive pair, beside the tackles',
  (r) => r.stats.interceptions, (r) => r.matches);

/* ---- ⭐ THE KEEPER ---- */
defFace('keeper.savesPerMatch', 'saves per match (240 s match clock)', 'REPORTED keeper',
  'the engine\'s own `saves` counter, BOTH teams', (r) => r.stats.saves, (r) => r.matches);
defFace('keeper.gkMetresPerKeeperPerMatch', 'metres per keeper per match (240 s match clock)',
  'REPORTED keeper',
  '⭐ the GK\'s own `distance` at full time, summed over the TWO keepers and divided by TWO '
  + 'keeper-matches. ⭐ Goals conceded = `goalsPerMatch`: the two sides are symmetric, so the '
  + 'match total IS both keepers\' concession — no second face',
  (r) => r.gkDistance, (r) => r.matches * 2);

/* ---- ⭐ E4 (the anchored definitions, reused) + shots ---- */
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

/* ---- CONTEXT (rates on the 240 s match clock; 1 sim-s = 22.5 display-s) ---- */
defFace('context.groundPassesPerMatch', 'measured ground passes per match (240 s match clock)',
  'REPORTED context', 'PT-C0\'s own measured-ground-pass population',
  (r) => r.gpMeasured, (r) => r.matches);
defFace('context.passesPerMatch', 'passes per match (240 s match clock)', 'REPORTED context',
  'the engine\'s own `passes` counter, both sides', (r) => r.stats.passes, (r) => r.matches);
defFace('context.carriesPerMatch', 'carries per match (240 s match clock)', 'REPORTED context',
  'the engine\'s own `dribbles` counter (a CARRY push), both sides',
  (r) => r.stats.dribbles, (r) => r.matches);
defFace('context.miscontrolsPerMatch', 'miscontrols per match (240 s match clock)',
  'REPORTED context', 'the engine\'s own team stat (the roll\'s own aftermath counter)',
  (r) => r.stats.miscontrols, (r) => r.matches);
defFace('context.metresPerMatch', 'metres per match (240 s match clock)', 'REPORTED context',
  'Σ|vel| over moving open-play body-ticks × DT — the ground the world covers while moving',
  (r) => r.movingSpeedSum * DT, (r) => r.matches);
defFace('context.movingTicksPerMatch', 'moving body-ticks per match (240 s match clock)',
  'REPORTED context',
  `moving = |vel| > ${MOVING_FLOOR} m/s, the ENGINE's own heading-follow floor`,
  (r) => r.movingTicks, (r) => r.matches);
defFace('context.meanSpeedMps', 'm/s', 'REPORTED context',
  'the mean speed over every moving open-play body-tick',
  (r) => r.movingSpeedSum, (r) => r.movingTicks);
defFace('context.openPlayTicksPerMatch', 'open-play ticks per match (240 s match clock)',
  'REPORTED context', 'the open-play clock itself', (r) => r.openPlayTicks, (r) => r.matches);
defFace('context.possessionSpellsPerMatch', 'spells per match (240 s match clock)',
  'REPORTED context',
  '⚠ A DECLARED RECONSTRUCTION: the engine keeps NO possession-spell ledger. This counts '
  + 'open-play ticks at which `Match.possessionSide` CHANGED to a valid side, read at tick '
  + 'boundaries — the exam\'s own cut, not an engine record',
  (r) => r.possessionSpells, (r) => r.matches);
defFace('context.meanPossessionSpellSimSeconds', 'sim-seconds', 'REPORTED context',
  '⚠ the same DECLARED RECONSTRUCTION: open-play ticks with a possessing side × DT ÷ spells',
  (r) => r.possessedTicks * DT, (r) => r.possessionSpells);
defFace('context.ticksPerMatch', 'ticks per match', 'REPORTED context',
  'the whole-match tick count (the 240 s clock at DT = 1/60)', (r) => r.ticks, (r) => r.matches);

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
  if (f === undefined) { banner(`BQ-T1 FATAL — unknown face ${arm}.${k}`); process.exit(3); }
  return f as FaceRow;
};

/* ========================================================================== */
/* §14 THE PAIRED Δ (ARMED − SHUT), THE SIX FROZEN RULES, AND THE STORED WORDS  */
/* ========================================================================== */
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
      if (frozenRule({ ciLo: lo, ciHi: hi })
        !== frozenRule({ ciLo: lo + shift, ciHi: hi + shift })) flips += 1;
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

/* ⭐⭐ THE SIX FROZEN H-BQ.1 RULES (§P.C, in exact form; the DECLARED TARGETS are literals,
   and (a)/(b)/(c)'s own MDEs are computed at §15 from the disclosed smoke). */
const TARGET_D1_BAND = 0.30;
const TARGET_D2_COMPLETION = -0.010;
const TARGET_D3_INTERCEPTIONS = 1.0;
const RULE_A = (d: { ciLo: number; ciHi: number }): boolean => d.ciHi < 0;
const RULE_B = (d: { ciLo: number; ciHi: number }): boolean => d.ciHi < 0;
const RULE_C = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciHi < 0);
const RULE_D1 = (d: { ciLo: number; ciHi: number }): boolean =>
  !(d.ciLo > TARGET_D1_BAND || d.ciHi < -TARGET_D1_BAND);
const RULE_D2 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciHi < TARGET_D2_COMPLETION);
const RULE_D3 = (d: { ciLo: number; ciHi: number }): boolean => !(d.ciLo > TARGET_D3_INTERCEPTIONS);

/** ⭐⭐ THE SIX CONJUNCTS' FACES AND THEIR WORD PAIRS — the rules are applied to EVERY REPORTED
 *  PAIR and the resulting WORDS are STORED beside the intervals (`gRuleWords`; the RC-T1b form
 *  ordered at BF-T1 §CORR item 1). ⛔ Only the E pair is SCORED. */
const CONJUNCTS = [
  { id: 'a', face: 'population.intended.nonPossessionShare',
    rule: RULE_A, yes: 'FALLS', no: 'DOES-NOT-FALL' },
  { id: 'b', face: 'attempts.intended.notReachedMarginOfAttempts',
    rule: RULE_B, yes: 'FALLS', no: 'DOES-NOT-FALL' },
  { id: 'c', face: 'attempts.intended.opponentContactOfAttempts',
    rule: RULE_C, yes: 'DOES-NOT-FALL', no: 'FALLS' },
  { id: 'd1', face: 'goalsPerMatch', rule: RULE_D1, yes: 'WITHIN-BAND', no: 'OUTSIDE-BAND' },
  { id: 'd2', face: 'passCompletion', rule: RULE_D2, yes: 'DOES-NOT-FALL', no: 'FALLS' },
  { id: 'd3', face: 'interceptionsPerMatch',
    rule: RULE_D3, yes: 'DOES-NOT-RISE', no: 'RISES' },
] as const;
const SCORED_RULES: Record<string, (d: { ciLo: number; ciHi: number }) => boolean> =
  Object.fromEntries(CONJUNCTS.map((c) => [`E|${c.face}`, c.rule]));
/** the DOSED (a) Δ also carries a LOO flip count (#385 item 5(iv)) */
SCORED_RULES[`D|${CONJUNCTS[0].face}`] = RULE_A;

const deltas: DeltaRow[] = [];
for (const p of PAIRS) {
  for (const key of FACE_KEYS) {
    deltas.push(pairedDelta(key, p.key, SCORED_RULES[`${p.key}|${key}`] ?? null));
  }
}
const delta = (pairKey: string, k: string): DeltaRow => {
  const d = deltas.find((x) => x.key === k && x.pair === pairKey);
  if (d === undefined) { banner(`BQ-T1 FATAL — unknown delta ${pairKey}.${k}`); process.exit(3); }
  return d as DeltaRow;
};
/** ⭐⭐ THE STORED RULE WORDS — the six frozen rules applied to EVERY REPORTED PAIR. */
interface RuleWordRow {
  pair: string; conjunct: string; face: string; delta: number;
  ciLo: number; ciHi: number; halfWidth: number; absDeltaOverHalfWidth: number;
  word: string; holds: boolean; looFlips: number; looScored: boolean;
}
const ruleWords: RuleWordRow[] = [];
for (const p of PAIRS) {
  for (const c of CONJUNCTS) {
    const d = delta(p.key, c.face);
    const holds = c.rule(d);
    ruleWords.push({
      pair: p.key, conjunct: c.id, face: c.face, delta: d.delta,
      ciLo: d.ciLo, ciHi: d.ciHi, halfWidth: d.halfWidth,
      absDeltaOverHalfWidth: d.absDeltaOverHalfWidth,
      word: holds ? c.yes : c.no, holds, looFlips: d.looFlips, looScored: d.looScored,
    });
  }
}
const wordOf = (pairKey: string, id: string): RuleWordRow =>
  ruleWords.find((r) => r.pair === pairKey && r.conjunct === id) as RuleWordRow;
const A_WORD = wordOf('E', 'a').word;
const B_WORD = wordOf('E', 'b').word;
const C_WORD = wordOf('E', 'c').word;
const D1_WORD = wordOf('E', 'd1').word;
const D2_WORD = wordOf('E', 'd2').word;
const D3_WORD = wordOf('E', 'd3').word;
const H_BQ1: 'PASS' | 'FAIL' = CONJUNCTS.every((c) => wordOf('E', c.id).holds) ? 'PASS' : 'FAIL';
const AB_LIMB_OK = wordOf('E', 'a').holds && wordOf('E', 'b').holds;
const C_LIMB_OK = wordOf('E', 'c').holds;
const D_LIMB_OK = wordOf('E', 'd1').holds && wordOf('E', 'd2').holds && wordOf('E', 'd3').holds;

/* ========================================================================== */
/* §14b THE PRE-COMMITTED READS — FROZEN LITERALS, SELECTED ON STORED BOOLEANS  */
/*      (#385 item 5(vi), copied VERBATIM at the freeze commit)                 */
/* ========================================================================== */
const READ_PASS = 'BQ-T1 BANKS; THE CUSHION LAW IS AN ENTRY CANDIDATE — world 13 = world 12 + '
  + 'bqCushion — decided WITH the user\'s world-12 verdict and read WITH the dosed pair; steps '
  + '②/③ open next.';
const READ_AB_FAILS = 'THE LAW DOES NOT KEEP THE BALL ON THE PITCH — THE FORM RETURNS TO THE '
  + 'COMMANDER WITH THE CLASS TABLE FIRST.';
const READ_C_FAILS = 'THE LAW WEAKENS THE DUEL — the commander decides with the contact counts.';
const READ_D_FAILS = 'THE LAW COSTS FOOTBALL — THE ARC PAUSES AT THE USER\'S FORK.';
const READ_DOSED_MOVES = 'THE DOSED WORLD MOVES — the entry candidate is LIVE in the form the '
  + 'user plays.';
const READ_DOSED_STILL = 'THE DOSED WORLD DOES NOT MOVE — no entry yet; the commander decides '
  + 'with numbers.';
const READ_DOSED_UNRESOLVED = 'THE DOSED READ IS UNRESOLVED — the commander decides with numbers.';
const READ_LITERALS: readonly string[] = [READ_PASS, READ_AB_FAILS, READ_C_FAILS, READ_D_FAILS,
  READ_DOSED_MOVES, READ_DOSED_STILL, READ_DOSED_UNRESOLVED];
/** the ENTRY QUESTION, on D-ARMED − D-SHUT, from STORED booleans only */
const dosedA = delta('D', CONJUNCTS[0].face);
const DOSED_A_FALLS = RULE_A(dosedA);
const DOSED_A_CONTAINS_ZERO = dosedA.containsZero;
const DOSED_D_HOLDS = wordOf('D', 'd1').holds && wordOf('D', 'd2').holds
  && wordOf('D', 'd3').holds;
const DOSED_ENTRY_READ = (DOSED_A_FALLS && DOSED_D_HOLDS) ? READ_DOSED_MOVES
  : DOSED_A_CONTAINS_ZERO ? READ_DOSED_STILL : READ_DOSED_UNRESOLVED;
const READS_PRINTED: string[] = [
  ...(H_BQ1 === 'PASS' ? [READ_PASS] : []),
  ...(!AB_LIMB_OK ? [READ_AB_FAILS] : []),
  ...(!C_LIMB_OK ? [READ_C_FAILS] : []),
  ...(!D_LIMB_OK ? [READ_D_FAILS] : []),
  DOSED_ENTRY_READ,
];

/* ========================================================================== */
/* §15 THE SIZING, SHOWN — the house form, from THIS exam's own scratch smoke   */
/* ========================================================================== */
const Z975 = 1.959963985;
const Z80 = 0.8416212336;
const ZSUM = Z975 + Z80;
const SMOKE_N = 12;
/** ⭐ THE 12-SEED SCRATCH SMOKE's own realised PAIRED-Δ half-widths (seeds 900,003,200–211;
 *  §DEV-PREFLIGHT), read out of the smoke artifact's own `deltas[].halfWidth` fields on the E
 *  pair — NEVER re-typed from the console's rounded print. HARDCODED at the FREEZE COMMIT.
 *  ⭐⭐ (a), (b) and (c) carry NO externally given target, so their DECLARED TARGET IS THEIR OWN
 *  SMOKE-MDE AT N_FROZEN, ROUNDED UP TO 6 dp (the BQ-C0 / RC-T1b idiom — declared here). */
const SIZING_INPUTS: { face: string; group: string; hwSmoke: number; target: number | null }[] = [
  { face: 'population.intended.nonPossessionShare', group: '(a) 「留球」',
    hwSmoke: 0.04071163895299788, target: null },
  { face: 'attempts.intended.notReachedMarginOfAttempts', group: '(b) 「几何那一类」',
    hwSmoke: 0.014612529150810863, target: null },
  { face: 'attempts.intended.opponentContactOfAttempts', group: '(c) 「对抗不减」',
    hwSmoke: 0.010491614134037918, target: null },
  { face: 'goalsPerMatch', group: '(d1) goals', hwSmoke: 1.3333333333333335, target: TARGET_D1_BAND },
  { face: 'passCompletion', group: '(d2) completion',
    hwSmoke: 0.046711837396364475, target: Math.abs(TARGET_D2_COMPLETION) },
  { face: 'interceptionsPerMatch', group: '(d3) interceptions',
    hwSmoke: 4.083333333333332, target: TARGET_D3_INTERCEPTIONS },
];
const sizingRows = SIZING_INPUTS.map((r) => {
  const seSmoke = r.hwSmoke / Z975;
  const hwAtN = r.hwSmoke * Math.sqrt(SMOKE_N / N_FROZEN);
  const mdeAtNFrozen = hwAtN * ZSUM / Z975;
  /* ⭐⭐ (a)/(b)/(c): the DECLARED TARGET IS the smoke-MDE at N_FROZEN, rounded UP to 6 dp */
  const targetDerivedFromSmokeMde = r.target === null;
  const target = r.target === null ? ceil6(mdeAtNFrozen) : r.target;
  const seNeeded = Math.abs(target) / ZSUM;
  const nRequired = Math.ceil(SMOKE_N * ((seSmoke / seNeeded) ** 2));
  const hwRealised = delta('E', r.face).halfWidth;
  return {
    ...r, target, targetDerivedFromSmokeMde, smokeClusters: SMOKE_N, seSmoke, seNeeded,
    nRequired, expectedHalfWidthAtNFrozen: hwAtN, mdeAtNFrozen,
    mdeAtRealisedHw: hwRealised * ZSUM / Z975,
    resolvableAtNFrozen: nRequired <= N_FROZEN, blockAffords: N_MAX_SEEDS,
  };
});
const SIZING_OK = sizingRows.every((r) => Number.isFinite(r.nRequired) && r.nRequired > 0);
const N_LARGEST_REQUIRED = Math.max(...sizingRows.map((r) => r.nRequired));

/* ========================================================================== */
/* §16 THE GATES — liveness / receipt ONLY, NEVER direction; all stored         */
/* ========================================================================== */
const rowsOf = (arm: Arm): Row[] => [...armRows(arm), receiptRows[arm]];
const allRows: Row[] = ARMS.flatMap((a) => rowsOf(a));
const walkedSeeds = [...new Set(cells.map((c) => c.seed))].sort((a, b) => a - b);
const inBlock = (s: number): boolean => s >= BLOCK_BASE && s <= BLOCK_TOP;
const tot = (arm: Arm, pick: (r: Row) => number): number =>
  rowsOf(arm).reduce((a, r) => a + pick(r), 0);
const ALL_SCRATCH = [...LOCKSTEP_SEEDS, ...TRACE_INERT_SEEDS, CURVE_PIN_SEED];
const scoredDeltas = deltas.filter((d) => d.looScored);
const LOO_OK = scoredDeltas.length === Object.keys(SCORED_RULES).length
  && scoredDeltas.every((d) => Number.isInteger(d.looFlips) && d.looFlips >= 0);
const NONEMPTY_CLASSES = ARMS.flatMap((arm) => CLASSES
  .filter((c) => tot(arm, (r) => clsCount(r, 'all', c)) > 0).map((c) => `${arm}.${c}`));
const EMPTY_CLASSES = ARMS.flatMap((arm) => CLASSES
  .filter((c) => tot(arm, (r) => clsCount(r, 'all', c)) === 0).map((c) => `${arm}.${c}`));
const OTHER_TOTALS = Object.fromEntries(ARMS.map((arm) =>
  [arm, tot(arm, (r) => clsCount(r, 'all', 'abandonedOther'))]));
const MARGIN_CLASS_TOTALS = Object.fromEntries(ARMS.map((arm) =>
  [arm, tot(arm, (r) => clsCount(r, 'intended', 'resolvedNotReachedMargin'))]));
const OPP_CLASS_TOTALS = Object.fromEntries(ARMS.map((arm) =>
  [arm, tot(arm, (r) => clsCount(r, 'intended', 'abandonedContactOpponent'))]));
const ROLL_FAIL_TOTALS = Object.fromEntries(ARMS.map((arm) =>
  [arm, tot(arm, (r) => r.rollFailIntended)]));

const BODY_SCHEMA = [
  'stage', 'arms', 'definitions', 'doseSource', 'curve', 'sites', 'classes',
  'displacementCells', 'sideCells', 'kindCells', 'settleLadder', 'contactClasses', 'sectors',
  'groups', 'anchoredSites', 'fixtures', 'lockstep', 'traceInert', 'armsDiverge', 'sizing',
  'gates', 'faces', 'deltas', 'ruleWords', 'hBQ1', 'precommittedReads', 'bins', 'seeds',
  'stats', 'perf', 'honestLimits', 'perSeedCells', 'constructionReceipt',
] as const;

const gates: Record<string, { ok: boolean; note: string }> = {
  gWorld: {
    ok: allRows.every((r) => r.worldOk) && CURVE_UNANIMOUS
      && allRows.every((r) => r.edsTouchCost === EDS_TOUCH_COST),
    note: `⭐⭐ PER ARM, on EVERY walked match and the construction receipt: \`raArmedVersion(m) `
      + `=== ${RA_WORLD_VERSION}\`; \`bqCushion\` matches its OWN arm (`
      + ARMS.map((a) => `${a} = ${wantsCushion(a)}`).join(' · ')
      + '); BOTH trace flags TRUE (`traceFirstTouch` AND `traceContests`); every RC/BF flag '
      + 'ABSENT (`rcAnticipate`, `rcReady`, `bfFacingCost` all !== true); `info.genome` carries '
      + 'no exam gene and no facing/cushion field (canon: dose placement, #270.2 / #334 item 1); '
      + `and \`m.edsTouchCost\` reads ${EDS_TOUCH_COST} on every match of all four arms (the `
      + `${CURVE_MEASURED.toUpperCase()} curve), unanimous on the curve pin at seed `
      + `${CURVE_PIN_SEED}. ⭐ every value in this note derives from the same rows the gate `
      + 'checks (canon: gate notes derive)',
  },
  gDoseSource: {
    ok: DOSE_BYTES_MATCH && DOSED_ARM_REACHABLE
      && L3_DOSE_BYTES_SHA.length === 64 && PC_DOSE_BYTES_SHA.length === 64,
    note: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + `self-declared field". The FILE BYTES of \`${L3_DOSE_FILE}\` hash to `
      + `${L3_DOSE_BYTES_SHA} and \`${PC_DOSE_FILE}\` to ${PC_DOSE_BYTES_SHA}, both equal to `
      + `#385 item 5(i)'s pinned values; the SHIPPED loaders were CALLED (${L3_CELLS_POOLED} L3 `
      + `cells, ${PC_ROWS_POOLED} PC rows, both NON-EMPTY). ⛔ On any mismatch the instrument `
      + 'EXITS 3 BEFORE any seed is walked — a dose is never approximated',
  },
  gTraceInert: {
    ok: TRACE_INERT_OK,
    note: '⭐⭐ BOTH trace flags ONLY RECORD: the same out-of-band scratch seed built with '
      + '`traceFirstTouch` AND `traceContests` ON and with both OFF runs to completion with a '
      + `BYTE-IDENTICAL whole-match signature, on ${traceInertRows.length} arm × seed pairs `
      + `(seeds ${TRACE_INERT_SEEDS.join(', ')}) — every arm, both shut and armed`,
  },
  gSiteEnumeration: {
    ok: NULL_SITES_FOUND.length === SITE_PURPOSES.length
      && NULL_SITES_FOUND.every((s, i) => s.line === SITE_PURPOSES[i].line)
      && CREATE_SITES_FOUND.length === 1
      && SITE_PURPOSES.every((s) => s.purpose.length > 0)
      && CUSHION_MATCH_SITES.length === 5 && CUSHION_LEAGUE_SITES.length === 1
      && CUSHION_A4_SITES.length === 0,
    note: '⭐⭐ canon, VERBATIM: "a seam-map gate pins occurrence COUNTS per needle and '
      + 'enumerates EVERY occurrence\'s site". RE-COUNTED AND RE-ANCHORED AT THIS HEAD (BQ-T0 §4 '
      + `declared the move): the needle \`${NULL_NEEDLE}\` occurs ${NULL_SITES_FOUND.length} `
      + `times in \`${MATCH_PATH}\`, at lines `
      + `${NULL_SITES_FOUND.map((s) => s.line).join(', ')}, each listed with its PURPOSE; the ONE `
      + `creation site \`${CREATE_NEEDLE}\` occurs ${CREATE_SITES_FOUND.length} time, at line `
      + `${CREATE_SITES_FOUND.map((s) => s.line).join(', ')} (its overwrite IS `
      + 'ABANDONED-BY-CONTACT). ⭐⭐ THE SEAM UNDER EXAM: the SHIPPED two assignment lines and the '
      + 'ARMED two are anchored SEPARATELY because the branch now sits between them. ⭐⭐ THE '
      + `FLAG'S MAP: \`${CUSHION_NEEDLE}\` occurs ${CUSHION_MATCH_SITES.length} times in `
      + `\`${MATCH_PATH}\` (lines ${CUSHION_MATCH_SITES.map((s) => s.line).join(', ')} — the `
      + `initialiser names it twice), ${CUSHION_LEAGUE_SITES.length} time in \`${LEAGUE_PATH}\` `
      + `(line ${CUSHION_LEAGUE_SITES.map((s) => s.line).join(', ')}) and `
      + `${CUSHION_A4_SITES.length} times in \`${A4_PATH}\` — NO world, preset or bundle names `
      + 'the flag, and this exam arms it in the CONSTRUCTOR',
  },
  gAttributionExhaustive: {
    ok: ARMS.every((arm) => GROUPS.every((g) =>
      tot(arm, (r) => sum(r.clsN[GI(g)])) === tot(arm, (r) => r.ended[GI(g)])
      && tot(arm, (r) => r.clsObserved[GI(g)] + r.clsInferred[GI(g)])
        === tot(arm, (r) => r.ended[GI(g)])
      && tot(arm, (r) => sum(r.nrDisp[GI(g)])) === tot(arm, (r) => parentNotReached(r, g))
      && tot(arm, (r) => r.created[GI(g)]) === tot(arm, (r) => r.ended[GI(g)])))
      && ARMS.every((arm) => tot(arm, (r) => sum(r.abSideKind.map((x) => sum(x))))
        === tot(arm, (r) => parentContact(r, 'intended')))
      && ARMS.every((arm) => OWN_CLASSES.every((_, oi) =>
        tot(arm, (r) => sum(r.ownSettleK[oi])) === tot(arm, (r) => r.ownBodyContacts[oi])))
      && ARMS.every((arm) => tot(arm, (r) => sum(r.contactClass))
        === tot(arm, (r) => r.gpFlights)),
    note: '⭐⭐ BQ-C1\'s EXACT-SUM RECEIPTS, re-derived here: EVERY ended attempt lands in EXACTLY '
      + 'ONE class (per arm and per group the class counts SUM to the endings, created = ended, '
      + 'the OBSERVED and INFERRED counts sum to the same total, the displacement cells sum to '
      + 'the RESOLVED-NOT-REACHED parent, and the side × kind table sums to the '
      + 'ABANDONED-BY-CONTACT parent on intended targets); BN-C0\'s settle ladder sums to the '
      + 'own-body first contacts per own class; and PT-C0\'s first-contact classes sum to the '
      + `measured ground-pass flights. The OBSERVED classes are `
      + `${CLASSES.filter((c) => CLASS_OBSERVED[c]).join(', ')}; the INFERRED ones (published as `
      + `BOUNDS) are ${CLASSES.filter((c) => !CLASS_OBSERVED[c]).join(', ')}`,
  },
  gAnchoredConstants: {
    ok: ANCHORS_OK,
    note: '⭐⭐ canon, VERBATIM: "a src-extracted constant pins its extraction to the NAMED call '
      + `site — anchored match + line receipt — never first-occurrence". `
      + `${ANCHORS.filter((a) => a.ok).length}/${ANCHORS.length} anchors matched at their EXACT `
      + 'expected occurrence counts with 1-based line receipts stored. Extracted values in play: '
      + `the window ${CONTACT_CONTROL_DELAY_TICKS} ticks · the retention margin `
      + `${CONTACT_CONTROL_RETENTION_MARGIN} m · the release constants `
      + `${CONTACT_RELEASE_MIN_SPEED}/${CONTACT_RELEASE_MAX_SPEED}/`
      + `${CONTACT_RELEASE_INCOMING_SHARE} · the tangential retention `
      + `${CONTACT_TANGENTIAL_RETENTION} · the commit time ${CONTACT_COMMIT_TIME} · `
      + `CONTROL_RADIUS ${CONTROL_RADIUS} · DT ${DT} · MATCH_DURATION ${MATCH_DURATION} · `
      + `AI_INTERVAL ${AI_INTERVAL} · PRESSURE_RADIUS_M ${PRESSURE_RADIUS_M} · DUP_RUN_M `
      + `${DUP_RUN_M} · SAMPLE_EVERY ${SAMPLE_EVERY} · the ledger's `
      + `${KIND_VOCAB.length}-kind vocabulary and the ${SECTORS.length}-name sector union, both `
      + 'PARSED off `src/` at run time. The RESOLVER\'s gate, both pre-roll return lines, the '
      + 'roll\'s own early return, the E1a ledger write, the seam\'s branch test and BOTH of its '
      + 'assignment pairs, the DF 乱跑 lines at DF-T1\'s own home and the E4 definition lines are '
      + 'each pinned at their own site',
  },
  gWalkFixtures: {
    ok: FIXTURES_OK,
    note: `⭐ ${FIXTURES.filter((f) => f.ok).length}/${FIXTURES.length} walk-side predicate `
      + 'fixtures: BQ-C1\'s FROZEN class precedence on CONSTRUCTED endings (including the three '
      + 'precedence guards — the resolver beats a replacement, a replacement beats a deflection '
      + 'kind, and offside beats everything), the displacement comparison, BN-C0\'s SETTLE '
      + 'LADDER and BOUNCE predicate on constructed settle-window states, PT-C0\'s A4 '
      + 'spacing/dup-run/min-pairwise limbs, the delivery/ground/measurable predicates, the '
      + 'first-contact classes, the BK `BodySector` classifier CALLED on constructed geometries, '
      + 'THE PAIRED Δ ARITHMETIC on a constructed two-seed table, the parsed vocabularies, the '
      + 'site counts and the sizing form\'s own 6-dp round-up',
  },
  gRuleWords: {
    ok: ruleWords.length === PAIRS.length * CONJUNCTS.length
      && ruleWords.every((r) => r.word.length > 0
        && (CONJUNCTS.find((c) => c.id === r.conjunct) as { yes: string; no: string })
          .yes !== undefined
        && r.word === (r.holds
          ? (CONJUNCTS.find((c) => c.id === r.conjunct) as { yes: string }).yes
          : (CONJUNCTS.find((c) => c.id === r.conjunct) as { no: string }).no)),
    note: '⭐⭐ THE SIX FROZEN RULES ARE APPLIED TO EVERY REPORTED PAIR AND THE RESULTING WORDS '
      + `ARE STORED beside the intervals — ${ruleWords.length} rows `
      + `(${PAIRS.length} pairs × ${CONJUNCTS.length} conjuncts). This is BF-T1 §COMMANDER `
      + 'CORRECTIONS item 1\'s own order ("from RC-T1b on a paired exam applies its frozen rules '
      + 'to EVERY reported pair and stores the word beside the interval, never scored"). ⛔ ONLY '
      + 'THE E PAIR IS SCORED: the dosed words are REPORTED, and they gate nothing. Words on the '
      + `dosed pair: ${CONJUNCTS.map((c) => `${c.id} ${wordOf('D', c.id).word}`).join(' · ')}`,
  },
  gArmsDiverge: {
    ok: ARMS_DIVERGE,
    note: '⭐ the RECEIPT that the door demonstrably bites, PER PAIR: '
      + divergeByPair.map((r) => `${r.pair} diverged on ${r.diverged.length}/`
        + `${LOCKSTEP_SEEDS.length} scratch seeds`).join(' · ')
      + '. ⚠ SOME, not EVERY (#364 item 1\'s ratified reading) — a match in which no contact is '
      + 'ever made at the edge of reach may walk BYTE-IDENTICALLY in both arms, which is LEGAL. '
      + '⭐ ONLY THE SCORED (E) PAIR IS GATED; the dosed pair is REPORTED whatever it is. An '
      + 'INSTRUMENT receipt, never a finding',
  },
  gClassesNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.created[GI('intended')]) > 0
      && tot(arm, (r) => nonPoss(r, 'intended')) > 0
      && tot(arm, (r) => clsCount(r, 'intended', 'resolvedNotReachedMargin')) > 0
      && tot(arm, (r) => clsCount(r, 'intended', 'abandonedContactOpponent')) > 0
      && tot(arm, (r) => r.rollAdjIntended) > 0 && tot(arm, (r) => r.rollFailIntended) > 0
      && tot(arm, (r) => r.gpMeasured) > 0 && tot(arm, (r) => r.gpFlights) > 0
      && tot(arm, (r) => r.recvSectorN) > 0 && tot(arm, (r) => r.stats.shots) > 0
      && tot(arm, (r) => r.minPairN) > 0 && tot(arm, (r) => r.defenderTicks) > 0
      && OWN_CLASSES.every((_, oi) => tot(arm, (r) => sum(r.ownSettleK[oi])) > 0)),
    note: '⛔ NO FACE ON AN EMPTY CELL, AND THE MECHANISM EXISTS TO BE MOVED: on EVERY arm — '
      + 'INCLUDING BOTH SHUT ARMS — the intended-target attempt population, its non-possession '
      + 'endings, THE RESOLVED-NOT-REACHED-MARGIN CLASS (E-SHUT '
      + `${MARGIN_CLASS_TOTALS['E-SHUT']} · D-SHUT ${MARGIN_CLASS_TOTALS['D-SHUT']} · E-ARMED `
      + `${MARGIN_CLASS_TOTALS['E-ARMED']} · D-ARMED ${MARGIN_CLASS_TOTALS['D-ARMED']}), THE `
      + `OPPONENT-CONTACT CLASS (${ARMS.map((a) => `${a} ${OPP_CLASS_TOTALS[a]}`).join(' · ')}), `
      + `ROLL FAILURES ON INTENDED TARGETS (${ARMS.map((a) => `${a} ${ROLL_FAIL_TOTALS[a]}`)
        .join(' · ')}), the measured ground passes, the completed-pass facing sample, both `
      + 'own-body settle populations, the shots, the crowd sample and the defender population '
      + 'are ALL non-empty. ⭐ every count in this note derives from the same rows the gate '
      + 'checks (canon: gate notes derive)',
  },
  gLedgerNonVacuous: {
    ok: ARMS.every((arm) => tot(arm, (r) => r.ledgerControlAttemptContacts) > 0
      && tot(arm, (r) => r.contestEpisodes) > 0),
    note: '⭐ THE ENGINE\'S OWN LEDGERS ARE LIVE on every arm (contest `controlAttempt` contacts '
      + 'and contest episodes both non-zero). EVERY NON-EMPTY ENDING CLASS IS NAMED: '
      + `${NONEMPTY_CLASSES.join(', ')}${EMPTY_CLASSES.length > 0
        ? `; the EMPTY ones are ${EMPTY_CLASSES.join(', ')}` : '; no class is empty'}`
      + `. THE OTHER RECEIPT: \`abandonedOther\` totals ${JSON.stringify(OTHER_TOTALS)} on all `
      + 'bodies — published, never imputed',
  },
  gLockstep: {
    ok: LOCKSTEP_OK,
    note: '⭐ THE INSTRUMENT INSTALLS NO WRAPPER AT ALL: observation is pure per-tick reads of '
      + '`Match` state after `m.step(DT)` (the contest-episode ledger, the E1a ledger, the '
      + '`pendingControl` TYPE VIEW, `pendingPass`, `restart`, `phase`, `ball.owner`, `marks` '
      + 'and the players\' own fields), and the only engine functions it calls are the SHIPPED '
      + '`directBallAccess` and `ballAccessGeometry` — both PURE queries of state. Proven anyway '
      + `on all ${lockstepRows.length} arm × out-of-band-scratch-seed walks (seeds `
      + `${LOCKSTEP_SEEDS.join(', ')}) — canon: verifier scratch seeds`,
  },
  gSrcUntouched: {
    ok: gitOut('git diff --stat HEAD -- src') === ''
      && gitOut('git status --porcelain -- src') === ''
      && gitOut('git diff --stat HEAD -- tests') === ''
      && gitOut('git status --porcelain -- tests') === '',
    note: '⛔ X-SRC-ZERO: worktree-vs-HEAD over `src/` AND `tests/` EMPTY BOTH WAYS (canon: '
      + 'xSrcUntouched — `git diff --stat HEAD -- <dir>` AND `git status --porcelain -- <dir>`). '
      + 'The law under exam is already in the tree with its own 24-pin suite '
      + '(`tests/bqCushion.test.ts`); this exam adds nothing to either directory',
  },
  gSeedsBookedEqualWalked: {
    ok: !IS_OVERRIDE
      ? (walkedSeeds.length === N_FROZEN && walkedSeeds.every(inBlock) && inBlock(RECEIPT_SEED)
        && !walkedSeeds.includes(RECEIPT_SEED)
        && walksBooked === (N_FROZEN + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000))
      : (walkedSeeds.length === N && walksBooked === (N + 1) * ARMS.length
        && ALL_SCRATCH.every((s) => s >= 900_000_000)),
    note: `BOOKED = WALKED, derived from the CELLS' OWN distinct seeds: ${walkedSeeds.length} `
      + `battery seeds, each walked EXACTLY ONCE PER ARM (${ARMS.length} arms) plus the `
      + `construction-receipt seed ${RECEIPT_SEED} in all ${ARMS.length} arms = ${walksBooked} `
      + `walks. THE BLOCK'S OWN PARTITION, disjoint by construction: battery ${batterySeeds[0]}`
      + `–${batterySeeds[batterySeeds.length - 1]} · UNWALKED TAIL ${UNWALKED_TAIL} (DECLARED, `
      + `stays virgin) · receipt ${RECEIPT_SEED}. Every scratch seed this instrument walks is `
      + 'out-of-band and STORED in the `seeds` block — canon, VERBATIM: "verifier scratch walks '
      + 'use the stage\'s own consumed band or the out-of-band scratch range (≥ 900,000,000) — '
      + 'never the next virgin block"',
  },
  gN: {
    ok: SIZING_OK && N_FROZEN <= N_MAX_SEEDS && (!IS_OVERRIDE
      ? (cells.length === N_FROZEN && OVERRIDE_REASONS.length === 0)
      : (cells.length === N && !isCanonical(OUT_BASE) && OVERRIDE_REASONS.length > 0)),
    note: IS_OVERRIDE
      ? `THE OVERRIDE ARM: declared (${OVERRIDE_REASONS.join(', ')}), n = ${cells.length} as `
        + 'declared, artifact off every canonical path'
      : `THE FROZEN ARM: no override env at all, and the battery ran at exactly N_FROZEN = `
        + `${N_FROZEN} SHARED seeds — the LARGEST N the block affords after the receipt seed `
        + `${BLOCK_TOP} is reserved and the tail ${UNWALKED_TAIL} declared. The largest sizing `
        + `requirement is ${N_LARGEST_REQUIRED}`,
  },
  gLOO: {
    ok: LOO_OK,
    note: '⭐ every SCORED Δ carries its LOO flip count (the #346/#348 orders): '
      + scoredDeltas.map((d) => `${d.pair}.${d.key} = ${d.looFlips}`).join(' · ')
      + '. ⚠ the flip read uses the CONSERVATIVE POINT-SHIFT form (the interval translated by '
      + 'each dropped seed\'s influence) — stated, never hidden. ⭐ THE DOSED (a) Δ CARRIES ONE '
      + 'TOO (#385 item 5(iv)); every other dosed Δ is REPORTED and carries no scored rule',
  },
  gHashOrder: {
    ok: BODY_SCHEMA.length === new Set(BODY_SCHEMA).size
      && faces.length === FACE_KEYS.length * ARMS.length
      && deltas.length === FACE_KEYS.length * PAIRS.length
      && (H_BQ1 === 'PASS' || H_BQ1 === 'FAIL')
      && READS_PRINTED.length > 0
      && READS_PRINTED.every((s) => READ_LITERALS.includes(s))
      && !(BODY_SCHEMA as readonly string[]).includes('hashedBodySha256')
      && !(BODY_SCHEMA as readonly string[]).includes('gFacesDetail')
      && !(BODY_SCHEMA as readonly string[]).includes('receipts')
      && (BODY_SCHEMA as readonly string[]).includes('perSeedCells'),
    note: '⭐ canon, VERBATIM: "the hashed body is built from an explicit ALLOWLIST SCHEMA — a '
      + 'field not in the schema never enters the body; forbidden-name lists are retired". The '
      + `body is the ${BODY_SCHEMA.length} named keys and nothing else, each name DISTINCT — it `
      + 'COVERS the per-seed cells and the construction receipt and EXCLUDES `hashedBodySha256`, '
      + '`gFacesDetail`, `allGreen` and `receipts`; the '
      + `${faces.length} face rows, the ${deltas.length} Δ rows, the ${ruleWords.length} stored `
      + `rule-word rows, the verdict word ${H_BQ1} and the ${READS_PRINTED.length} printed read `
      + 'sentence(s), each one of the frozen literals, all EXIST before it. ⭐⭐ canon, VERBATIM: '
      + '"the body hash is computed after every body key is assigned, and a NON-body receipt '
      + 'field records that the hash reproduces from the written file" — the hash runs at §19, '
      + 'AFTER `gates.gFaces` is assigned and AFTER `artifact.gates = gates`',
  },
};

/* ========================================================================== */
/* §17 THE ARTIFACT — COMPACT JSON (canon, VERBATIM: "an artifact is written as compact JSON —
   no indentation; the hash is over the canonical body regardless; pretty-printing is a
   reader's tool, not a storage form"; home: ruling #372 item 5)                              */
/* ========================================================================== */
interface Pooled {
  endingClass: number[][]; notReachedDisplacementCell: number[][];
  abandonedSideByKind: number[][]; ownSettleAtK: number[][];
  firstContactClass: number[]; ownTargetContactSector: number[];
  ownTargetContactSectorCompleted: number[]; receiverSectorCompleted: number[];
  rollFailSettleAtK: number[]; nearestMateMetres: number[]; minPairwiseMetres: number[];
}
const emptyPooled = (): Pooled => ({
  endingClass: zeros2(2, CLASSES.length),
  notReachedDisplacementCell: zeros2(2, DISP_CELLS.length),
  abandonedSideByKind: zeros2(SIDES.length, KIND_CELLS.length),
  ownSettleAtK: zeros2(OWN_CLASSES.length, HOLDS.length),
  firstContactClass: zeros(CONTACTS.length),
  ownTargetContactSector: zeros(SECTORS.length),
  ownTargetContactSectorCompleted: zeros(SECTORS.length),
  receiverSectorCompleted: zeros(SECTORS.length),
  rollFailSettleAtK: zeros(HOLDS.length),
  nearestMateMetres: zeros(NEAR_BINS), minPairwiseMetres: zeros(MINPAIR_BINS),
});
const poolFrom = (rows: readonly Row[]): Pooled => {
  const p = emptyPooled();
  for (const r of rows) {
    addInto2(p.endingClass, r.clsN);
    addInto2(p.notReachedDisplacementCell, r.nrDisp);
    addInto2(p.abandonedSideByKind, r.abSideKind);
    addInto2(p.ownSettleAtK, r.ownSettleK);
    addInto(p.firstContactClass, r.contactClass);
    addInto(p.ownTargetContactSector, r.ownTargetSector);
    addInto(p.ownTargetContactSectorCompleted, r.ownTargetSectorCompleted);
    addInto(p.receiverSectorCompleted, r.recvSector);
    addInto(p.rollFailSettleAtK, r.rollFailSettleK);
    addInto(p.nearestMateMetres, r.nearBins);
    addInto(p.minPairwiseMetres, r.minPairBins);
  }
  return p;
};
const pooledByArm = Object.fromEntries(ARMS.map((a) => [a, poolFrom(armRows(a))])) as
  Record<Arm, Pooled>;

/** ⭐ canon, VERBATIM: "a stage doc's HONEST LIMITS list is the ONE home; the artifact stores
 *  that list verbatim or stores none" (home: RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS
 *  item 3, ruling #367 item 3). ⇒ STORES NONE. */
const HONEST_LIMITS_NOTE = '⛔ NOT STORED HERE BY DESIGN. Canon, VERBATIM: "a stage doc\'s '
  + 'HONEST LIMITS list is the ONE home; the artifact stores that list verbatim or stores none" '
  + '(home: RC-C0-COOPERATION-CENSUS.md §COMMANDER CORRECTIONS item 3, ruling #367 item 3). '
  + 'THE ONE HOME: docs/world-model/BQ-T1-CUSHION-EXAM.md §HONEST LIMITS.';

const artifact: Record<string, unknown> = {
  stage: {
    id: 'BQ-T1',
    title: '「缓冲留球」 THE CUSHION EXAM — does the intended receiver keep more of the balls '
      + 'that reach him, did the geometry class fall, does the defender still take it off him, '
      + 'and is the world still football',
    doc: 'docs/world-model/BQ-T1-CUSHION-EXAM.md',
    authorizedBy: 'COMMANDER RULING #385 item 5',
    contract: 'BK-BODYBALL-CONTRACT.md §2-AMENDMENT M-BK.5 (#384 item 5) + §3 STATUS',
    lawUnderExam: 'M-BK.5 — armed (`bqCushion`), a cushioning contact gives the ball the BODY\'s '
      + 'velocity and NOTHING else; the relative velocity after the touch is ZERO. The three-tick '
      + 'window, the 2 cm retention margin, the first-touch roll, the contest, the body-strike '
      + 'and deflection channels and the overlap solver are UNTOUCHED.',
    seam: 'BQ-T0, commit 0ae2bf8 (the dormant law; 24 pins, fingerprint unchanged)',
    lineage: 'PT-C0 → RC-T1b (FAIL: not readiness) → BN-C0 (the bounce is a control-QUALITY '
      + 'event) → BQ-C0 (the coin is honest and is not the story) → BQ-C1 (the window is MIXED; '
      + 'its largest single piece is GEOMETRY) → BQ-T0 (the law behind a shut door) → this exam.',
    examFormOfRecord: 'docs/world-model/BF-T1-FACING-COST-EXAM.md + '
      + 'docs/world-model/RC-T1B-READY-EXAM.md',
    kind: 'EXAM — H-BQ.1 is scored by the frozen §P.C rules ON THE EMPTY-BOOK PAIR ONLY '
      + '(E-ARMED − E-SHUT); the DOSED pair and every other face are REPORTED, gated by nothing, '
      + 'with the SAME six frozen rules applied and their WORDS STORED.',
    shipsNothing: '⛔ THIS STAGE SHIPS NOTHING (Road B): world 12\'s composition and bytes are '
      + 'untouched, no world is cut, `a4World.ts` contains no `bqCushion`, and the production '
      + 'fingerprint is unmoved. The entry is the commander\'s and the user\'s.',
    xSrcZero: '⛔ no file under `src/` or `tests/` is created or edited: the law is already in '
      + 'the tree with its own pin suite. The probe CALLS the shipped exports and reads `Match` '
      + 'state per tick; the contest-episode ledger and the E1a first-touch ledger are READ, '
      + 'never re-implemented; every `= null` site is ANCHORED at THIS head. THERE IS NO '
      + 'WRAPPER — `gLockstep` proves observed ≡ unobserved byte for byte per arm.',
    reAnchoring: '⭐⭐ BQ-T0 §4 declared that BQ-C1\'s frozen instrument no longer re-anchors at '
      + 'this head. This exam COPIES the classes, sites, attribution and precedence it reuses '
      + 'and RE-DERIVES every receipt against the file in front of it; ⛔ the banked census\'s '
      + 'own instrument is NOT edited.',
    receiptsAreNotEffectSizes: '⛔ the site counts, the creation-ledger agreement, the margin '
      + 'cross-check, the dose hashes and the divergence counts are ARMING PLUMBING and are '
      + 'NEVER quoted as football effect sizes (home: ruling #289 item 1 + '
      + 'BU-T1-MT-COMPOSITION.md §COMMANDER CORRECTIONS item 5).',
    noSeasonLadder: '⛔ NO SEASON LADDER: a BODY law with no gene (#385 item 5(iii)).',
    canonEngineLedgersBeforeHeuristics: 'VERBATIM: "an event attribution reads the engine\'s '
      + 'own record when one exists (`shotLog`, the contest episodes, `lastTouch`); a heuristic '
      + 'is written only where no record exists, and says so" (home: RC-T1B-READY-EXAM.md '
      + '§COMMANDER CORRECTIONS item 5, ruling #381 item 3).',
    canonCounterfactualWordsAreStored: 'VERBATIM: "a counterfactual verdict sentence (\'had X '
      + 'been scored, the rule would read W\') quotes a word the instrument STORED by applying '
      + 'the frozen rule to X\'s stored interval; a universal sentence about a table (\'every '
      + 'bin\', \'the one bin\') is a stored boolean or is not written" (home: '
      + 'BF-T1-FACING-COST-EXAM.md §COMMANDER CORRECTIONS items 1–2, ruling #378 item 2).',
    mode: MODE ?? 'full', overrideReasons: OVERRIDE_REASONS,
    generatedAtUtc: new Date().toISOString(),
    instrument: 'scripts/probes/bq-t1-cushion-exam.ts',
    instrumentSha256: sha(readFileSync('scripts/probes/bq-t1-cushion-exam.ts', 'utf8')),
    headAtRun: gitOut('git rev-parse HEAD'),
    srcSha256: Object.fromEntries(Object.entries(SRC_OF)
      .filter(([p]) => p.startsWith('src/')).map(([p, s]) => [p, sha(s)])),
    compactJson: '⭐ canon, VERBATIM: "an artifact is written as compact JSON — no indentation; '
      + 'the hash is over the canonical body regardless; pretty-printing is a reader\'s tool, '
      + 'not a storage form" (home: ruling #372 item 5).',
    clock: '⚠ every rate is on the 240 s MATCH clock; 1 sim-s = 60 ticks = 22.5 display-s '
      + '(homes: ruling #280.2(iii) + PC-T2 §CORR item 3).',
  },
  arms: Object.fromEntries(ARMS.map((a) => [a, {
    label: ARM_LABEL[a], bqCushion: wantsCushion(a), dosed: isDosed(a),
    scored: a === 'E-SHUT' || a === 'E-ARMED',
  }])),
  definitions: {
    pairs: PAIRS.map((p) => ({ pair: p.key, shut: p.shut, armed: p.armed, form: p.form })),
    thePopulation: '⭐⭐ BQ-C1 §P.B\'s, REUSED: every `pendingControl` CREATED (the '
      + '`applyControlContact` creation site — the ONE creation site, anchored), tracked from '
      + 'its creation tick to the tick it ENDS. INTENDED TARGETS primary (the `pendingPass` '
      + 'target at creation), all bodies beside.',
    thePrivateFieldRead: '⚠ `Match.pendingControl` is declared `private` and the engine '
      + 'publishes no mirror. This exam reads it through a TypeScript TYPE VIEW — a READ of '
      + 'engine state, NEVER a write; `gLockstep` proves the whole observation byte-inert. '
      + 'DECLARED (the BQ-C0 / BQ-C1 precedent, #383 item 3).',
    theTickBoundary: '⚠ the population is observed at TICK BOUNDARIES, after `m.step(DT)`. An '
      + 'attempt created AND ended inside ONE tick is invisible; the contest ledger\'s own '
      + '`controlAttempt` contact count is published beside as the receipt.',
    thePrecedence: '⭐⭐ BQ-C1\'s FROZEN PRECEDENCE, COPIED, justified by the ENGINE\'S OWN ORDER '
      + 'OF OPERATIONS: `tryCapture` calls `resolvePendingControlAttempt()` FIRST and returns if '
      + 'it consumed the tick, and the resolver\'s own clear fires UNCONDITIONALLY once '
      + '`stepCount >= readyTick` — so an ending AT OR AFTER `readyTick` is ALWAYS the '
      + 'resolver\'s site and is classified RESOLVED-* before any claim is considered. Inside '
      + 'the RESOLVED branch: offside → the roll\'s failure → possession → not reached. Inside '
      + 'the ABANDONED branch: offside → the replacement (the engine\'s own `pendingControl` '
      + 'field is the stronger record) → the deflection kinds → dead ball → possession '
      + 'elsewhere → other.',
    theTwoDenominators: '⭐⭐ (b) AND (c) ARE SHARES OF ATTEMPTS, NOT OF NON-POSSESSION ENDINGS, '
      + 'so that a change in the non-possession total cannot move them by composition alone. '
      + 'The SAME classes as shares of NON-POSSESSION endings are published BESIDE '
      + '(`composition.*`), REPORTED.',
    theDisplacementRule: '⭐⭐ for a RESOLVED-NOT-REACHED ending: `ballDisplacement` = |ball '
      + 'position at the END tick − ball position at the CONTACT tick|, `bodyDisplacement` the '
      + 'same for the receiver; the cell is `ballLarger` / `bodyLarger` / `tie` on a STRICT '
      + 'comparison (BQ-C1 §P.B, REUSED).',
    theRoll: '⭐⭐ THE E1a FIRST-TOUCH LEDGER, READ: adjudications, failures and the LOGGED '
      + '`pFail` on entries whose own `intendedTarget` flag is true. ⭐ THE COUNT AND THE RATE '
      + 'ARE BOTH PUBLISHED, because armed the roll SEES attempts the margin used to swallow — '
      + 'the count can move where the rate does not.',
    theDuel: '⭐⭐ THE DUEL\'S COUNT — endings on intended targets at which a body OF THE OTHER '
      + 'SIDE replaced a live attempt (the creation site\'s own overwrite, read off the '
      + 'engine\'s `pendingControl` field), per match; published BESIDE the same class\'s SHARE '
      + 'so a stable share with a moving count is visible. The contest-episode ledger\'s own '
      + 'length per match is published beside it.',
    theBounce: `⭐⭐ BN-C0's BOUNCE PREDICATE and SETTLE LADDER, REUSED and anchored: an OWN-body `
      + 'FIRST contact of a MEASURED GROUND PASS after which the PASSING SIDE does not hold the '
      + `ball at contactTick + K (K = ${K_TICKS} = CONTACT_CONTROL_DELAY_TICKS, imported). The `
      + 'ladder is `sameSide` / `opponent` / `loose` / `out`; BOUNCE = not `sameSide`; '
      + '`unresolved` (the whistle came first) is COUNTED and enters NO bounce face. ⭐ The same '
      + 'ladder is read at +K AFTER A FAILED ROLL — who has the ball three ticks later.',
    theUserFaces: 'PT-C0\'s own code reused: `contact.opponentFirstContactShare` (the first body '
      + 'the ball contacts after a measured ground pass) · `contact.ownTargetSideBackShare` '
      + '(the own TARGET met the ball side-on or back-on, the BK `BodySector` classifier CALLED) '
      + '· `crowd.crashShare` (the A4 min-pairwise limb under DUP_RUN_M) with the dup-run and '
      + 'spacing limbs beside.',
    theSectors: 'the receiver\'s facing SECTOR at his first touch on COMPLETED passes (read at '
      + 'the completion tick) and COMPLETION BY SECTOR (of own-target FIRST contacts made in a '
      + 'sector, the share whose pass completed — read at the contact tick).',
    theDfFaces: '⭐ 乱跑 = assignment switches per defender-minute — DF-C0 §R2\'s definition and '
      + 'DF-T1 §3\'s instrument, REUSED VERBATIM and ANCHORED. Marking coverage = the held-mark '
      + 'share of the same defender body-ticks.',
    e4: {
      forwardPassShare: '`mt-ladder.ts`\'s OWN definition, anchored.',
      thirdMan: 'the engine\'s own completed third-man release counter (`Match.ts`, anchored).',
      overlaps: 'the engine\'s own completed overlap release counter (`Match.ts`, anchored).',
      chainLength: 'the engine\'s OWN possession-chain ledger `bestPassChain`, over TWO '
        + 'team-matches.',
    },
    possessionSpells: '⚠ A DECLARED RECONSTRUCTION — the engine keeps NO possession-spell '
      + 'ledger. The face counts open-play ticks at which `Match.possessionSide` CHANGED to a '
      + 'valid side, read at tick boundaries. Said so, per the engine-ledgers-before-heuristics '
      + 'canon.',
    estimator: `CLUSTER BOOTSTRAP over the SHARED seeds, ${BOOTSTRAP} draws, rng seeded from the `
      + `block base ${BLOCK_BASE}. Both arms of a pair move together inside every draw, so every `
      + 'interval is a PAIRED one BY CONSTRUCTION. Point estimates are RATIO-OF-SUMS, so every '
      + 'headline re-derives from the stored per-seed cells.',
    loo: 'LEAVE-ONE-OUT flip counting on every SCORED Δ and on the DOSED (a) Δ: drop each seed, '
      + 're-derive the POINT Δ, and count a FLIP when the frozen rule\'s verdict changes with '
      + 'the interval SHIFTED by that seed\'s influence. ⚠ THE CONSERVATIVE POINT-SHIFT FORM — '
      + 'stated, never hidden.',
    constants: {
      CONTACT_CONTROL_DELAY_TICKS, CONTACT_CONTROL_RETENTION_MARGIN, CONTROL_RADIUS,
      CONTACT_RELEASE_MIN_SPEED, CONTACT_RELEASE_MAX_SPEED, CONTACT_RELEASE_INCOMING_SHARE,
      CONTACT_TANGENTIAL_RETENTION, CONTACT_COMMIT_TIME, PRESSURE_RADIUS_M,
      DT, MATCH_DURATION, AI_INTERVAL, DUP_RUN_M, SAMPLE_EVERY, K_TICKS,
    },
    binEdges: {
      note: '⚠ every width/count here is a BIN EDGE of a STORED histogram — never a rule and '
        + 'never a threshold: no conjunct word depends on one.',
      nearestMateMetres: { width: NEAR_BIN_M, bins: NEAR_BINS, overflowIsLast: true },
      minPairwiseMetres: { width: MINPAIR_BIN_M, bins: MINPAIR_BINS, overflowIsLast: true },
    },
  },
  doseSource: {
    what: '⭐⭐ canon, VERBATIM: "a dose-source guard should hash the bytes it reads, not a '
      + 'self-declared field".',
    loadersCalled: ['loadL3Dose', 'loadPcDose'],
    files: {
      [L3_DOSE_FILE]: { expected: L3_DOSE_PIN, got: L3_DOSE_BYTES_SHA,
        ok: L3_DOSE_BYTES_SHA === L3_DOSE_PIN },
      [PC_DOSE_FILE]: { expected: PC_DOSE_PIN, got: PC_DOSE_BYTES_SHA,
        ok: PC_DOSE_BYTES_SHA === PC_DOSE_PIN },
    },
    l3CellsPooled: L3_CELLS_POOLED, pcRowsPooled: PC_ROWS_POOLED,
    refusalBehaviour: '⛔ on any byte mismatch the instrument exits 3 BEFORE any walk.',
  },
  curve: {
    pinnedEdsTouchCost: EDS_TOUCH_COST, curveMeasured: CURVE_MEASURED,
    unanimousAcrossArms: CURVE_UNANIMOUS, pinSeed: CURVE_PIN_SEED,
    perArm: CURVE_PROBE,
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
      + 'attempt at the creation site itself. That overwrite IS ABANDONED-BY-CONTACT.',
    theFlagsMap: {
      needle: CUSHION_NEEDLE,
      [MATCH_PATH]: CUSHION_MATCH_SITES.map((s) => s.line),
      [LEAGUE_PATH]: CUSHION_LEAGUE_SITES.map((s) => s.line),
      [A4_PATH]: CUSHION_A4_SITES.map((s) => s.line),
      note: 'the initialiser names the flag twice, which is why Match.ts reads 5 and not 4; '
        + 'a4World.ts reads ZERO — no world, preset, env or bundle names it.',
    },
  },
  classes: CLASSES.map((c) => ({ id: c, observed: CLASS_OBSERVED[c] })),
  displacementCells: DISP_CELLS, sideCells: SIDES, kindCells: KIND_CELLS,
  settleLadder: HOLDS, contactClasses: CONTACTS, sectors: SECTORS, groups: GROUPS,
  anchoredSites: ANCHORS,
  fixtures: { total: FIXTURES.length, passed: FIXTURES.filter((f) => f.ok).length, rows: FIXTURES },
  lockstep: lockstepRows,
  traceInert: traceInertRows,
  armsDiverge: divergeByPair,
  sizing: {
    form: 'se(n) = hw(n)/z.975 · se(needed) = |target|/(z.975+z.80) · N = ceil(n·(se(n)/'
      + 'se(needed))²) · MDE(N) = hw(n)·sqrt(n/N)·(z.975+z.80)/z.975',
    varianceSource: 'THIS exam\'s own 12-SEED SCRATCH SMOKE (seeds 900,003,200–211), DISCLOSED '
      + 'in full at the doc\'s §DEV-PREFLIGHT; the realised paired-Δ half-widths were read out '
      + 'of the smoke artifact\'s own `deltas[].halfWidth` fields on the E pair and HARDCODED '
      + 'into SIZING_INPUTS at the FREEZE COMMIT.',
    targets: '⭐⭐ (a), (b) and (c) carry NO externally given target, so each one\'s DECLARED '
      + 'TARGET IS ITS OWN SMOKE-MDE AT N_FROZEN, ROUNDED UP TO 6 dp (declared — the BQ-C0 / '
      + 'RC-T1b idiom). (d1) 0.30 goals · (d2) 0.010 completion · (d3) 1.0 interceptions/match, '
      + 'BF-T1\'s bands VERBATIM.',
    nFrozen: N_FROZEN, nMaxSeeds: N_MAX_SEEDS, largestRequirement: N_LARGEST_REQUIRED,
    z975: Z975, z80: Z80, smokeClusters: SMOKE_N, rows: sizingRows,
    whatIsNotSized: '⛔ every REPORTED face (the whole dosed pair, the full composition, the '
      + 'roll, the bounce ladder, the sectors, the DF and keeper faces, E4 and context) is '
      + 'published with its OWN realised interval and NO null is cut on any of them: an interval '
      + 'containing zero reads "unresolved at this power", never "no difference".',
  },
  gates,
  allGreen: Object.values(gates).every((g) => g.ok),
  faces,
  deltas,
  ruleWords,
  hBQ1: {
    scoredOn: 'THE EMPTY-BOOK PAIR ONLY (E-ARMED − E-SHUT)',
    frozenRules: {
      a: '(a) 「留球」 — Δ of `population.intended.nonPossessionShare` lies ENTIRELY BELOW ZERO '
        + '(ciHi < 0) ⇒ FALLS; else DOES-NOT-FALL.',
      b: '(b) 「几何那一类」 — Δ of the RESOLVED-NOT-REACHED-margin class AS A SHARE OF INTENDED '
        + 'ATTEMPTS (class count ÷ pending controls created for intended targets — NOT ÷ '
        + 'non-possession endings) lies ENTIRELY BELOW ZERO ⇒ FALLS; else DOES-NOT-FALL.',
      c: '(c) 「对抗不减」 — Δ of the ABANDONED-BY-CONTACT (replacing body an OPPONENT) class AS A '
        + 'SHARE OF INTENDED ATTEMPTS is NOT entirely below zero (!(ciHi < 0)) ⇒ DOES-NOT-FALL; '
        + 'else FALLS.',
      d1: `(d1) Δ \`goalsPerMatch\` NOT entirely outside [−${TARGET_D1_BAND}, +${TARGET_D1_BAND}]`
        + ' ⇒ WITHIN-BAND; else OUTSIDE-BAND.',
      d2: `(d2) Δ \`passCompletion\` NOT entirely below ${TARGET_D2_COMPLETION} ⇒ DOES-NOT-FALL; `
        + 'else FALLS.',
      d3: `(d3) Δ \`interceptionsPerMatch\` NOT entirely above +${TARGET_D3_INTERCEPTIONS}/match `
        + '⇒ DOES-NOT-RISE; else RISES.',
      conjunction: 'H-BQ.1 = PASS ⇔ (a) ∧ (b) ∧ (c) ∧ (d1) ∧ (d2) ∧ (d3).',
      mdeWarning: '⚠ A NON-FALL / NON-RISE / WITHIN-BAND CERTIFIES NOTHING SMALLER THAN ITS '
        + 'DECLARED MDE. Nothing smaller than an MDE is ever read as "no effect".',
      denominatorWarning: '⚠ (b) and (c) are shares of ATTEMPTS so that a change in the '
        + 'non-possession total cannot move them by composition alone; the same classes as '
        + 'shares of non-possession endings are published BESIDE, REPORTED.',
      bothSidesArmed: '⚠ BOTH SIDES carry the armed law in the armed arms, so every match-total '
        + 'face is a MATCH TOTAL.',
    },
    targets: { d1Band: TARGET_D1_BAND, d2Completion: TARGET_D2_COMPLETION,
      d3Interceptions: TARGET_D3_INTERCEPTIONS },
    aWord: A_WORD, bWord: B_WORD, cWord: C_WORD,
    d1Word: D1_WORD, d2Word: D2_WORD, d3Word: D3_WORD,
    abLimb: AB_LIMB_OK, cLimb: C_LIMB_OK, dLimb: D_LIMB_OK, verdict: H_BQ1,
    conjunctFaces: CONJUNCTS.map((c) => ({ id: c.id, face: c.face, yes: c.yes, no: c.no })),
    aDelta: delta('E', CONJUNCTS[0].face), bDelta: delta('E', CONJUNCTS[1].face),
    cDelta: delta('E', CONJUNCTS[2].face), d1Delta: delta('E', CONJUNCTS[3].face),
    d2Delta: delta('E', CONJUNCTS[4].face), d3Delta: delta('E', CONJUNCTS[5].face),
  },
  precommittedReads: {
    wordsOfRecord: '#385 item 5(vi), the frozen literals copied VERBATIM at the freeze commit.',
    frozenSentences: {
      pass: READ_PASS, abFails: READ_AB_FAILS, cFails: READ_C_FAILS, dFails: READ_D_FAILS,
      dosedMoves: READ_DOSED_MOVES, dosedStill: READ_DOSED_STILL,
      dosedUnresolved: READ_DOSED_UNRESOLVED,
    },
    selectors: {
      verdict: H_BQ1, abLimb: AB_LIMB_OK, cLimb: C_LIMB_OK, dLimb: D_LIMB_OK,
      dosedAFalls: DOSED_A_FALLS, dosedAContainsZero: DOSED_A_CONTAINS_ZERO,
      dosedDWordsHold: DOSED_D_HOLDS,
    },
    dosedEntryRead: DOSED_ENTRY_READ,
    readsPrinted: READS_PRINTED,
    literals: READ_LITERALS,
  },
  bins: { pooledByArm },
  seeds: {
    block: [BLOCK_BASE, BLOCK_TOP],
    batteryFirst: batterySeeds[0], batteryLast: batterySeeds[batterySeeds.length - 1],
    nFrozen: N_FROZEN, nWalked: cells.length, distinctWalked: walkedSeeds.length,
    constructionReceiptSeed: RECEIPT_SEED,
    unwalkedTail: IS_SCRATCH_RUN ? null : UNWALKED_TAIL,
    walksBooked, walksWalked: walksBooked,
    scratch: { curvePin: CURVE_PIN_SEED, traceInert: TRACE_INERT_SEEDS,
      lockstep: LOCKSTEP_SEEDS, smoke: [SCRATCH_BASE, SCRATCH_BASE + 11],
      smokeReceipt: SCRATCH_BASE + 20 },
    bootstrapRngSeededFrom: BLOCK_BASE,
    isOverrideRun: IS_OVERRIDE, overrideReasons: OVERRIDE_REASONS,
  },
  stats: { consumed: 0, nextBase: 117_600, registryOfRecord: 73,
    note: 'ZERO stats consumed; the registry is untouched by this exam.' },
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
  faces: FaceRow[]; deltas: DeltaRow[]; ruleWords: RuleWordRow[];
  hBQ1: {
    verdict: string; aWord: string; bWord: string; cWord: string;
    d1Word: string; d2Word: string; d3Word: string;
    abLimb: boolean; cLimb: boolean; dLimb: boolean;
    aDelta: DeltaRow; bDelta: DeltaRow; cDelta: DeltaRow;
    d1Delta: DeltaRow; d2Delta: DeltaRow; d3Delta: DeltaRow;
    targets: { d1Band: number; d2Completion: number; d3Interceptions: number };
  };
  precommittedReads: {
    readsPrinted: string[]; dosedEntryRead: string;
    selectors: { verdict: string; abLimb: boolean; cLimb: boolean; dLimb: boolean;
      dosedAFalls: boolean; dosedAContainsZero: boolean; dosedDWordsHold: boolean };
  };
  bins: { pooledByArm: Record<Arm, Pooled> };
  sizing: { rows: typeof sizingRows };
};
const dcells = disk.perSeedCells;
/** ⭐ JSON HAS NO NaN LITERAL: a face on an empty class serializes as `null`. The gate
 *  recognises `null` as the SERIALIZATION of NaN — and nothing else. */
const eq = (a: number, b: number | null): boolean => (Number.isNaN(a)
  ? (b === null || Number.isNaN(b as number)) : a === b);
const faceChecks: { face: string; ok: boolean }[] = [];
for (const f of disk.faces) {
  const def = FACES[f.face];
  const rows = dcells.map((c) => c.rows[f.arm]);
  const nu = sum(rows.map((r) => def.num(r)));
  const de = sum(rows.map((r) => def.dn(r)));
  faceChecks.push({
    face: `${f.arm}.${f.face}`,
    ok: nu === f.numerator && de === f.denominator && eq(ratio(nu, de), f.value),
  });
}
for (const dd of disk.deltas) {
  const def = FACES[dd.key];
  const pS = ratio(sum(dcells.map((c) => def.num(c.rows[dd.shutArm]))),
    sum(dcells.map((c) => def.dn(c.rows[dd.shutArm]))));
  const pA = ratio(sum(dcells.map((c) => def.num(c.rows[dd.armedArm]))),
    sum(dcells.map((c) => def.dn(c.rows[dd.armedArm]))));
  faceChecks.push({
    face: `delta.${dd.pair}.${dd.key}`,
    ok: eq(pS, dd.shutValue) && eq(pA, dd.armedValue) && eq(pA - pS, dd.delta),
  });
}
const binChecks: { check: string; ok: boolean }[] = [];
/* ⭐⭐ THE SIX CONJUNCT WORDS, THE VERDICT WORD, THE STORED RULE WORDS ON EVERY REPORTED PAIR
   AND THE PRE-COMMITTED READ SENTENCES — all re-derived off disk from the stored intervals. */
{
  const h = disk.hBQ1;
  const t = h.targets;
  const reRules: Record<string, (d: { ciLo: number; ciHi: number }) => boolean> = {
    a: (d) => d.ciHi < 0,
    b: (d) => d.ciHi < 0,
    c: (d) => !(d.ciHi < 0),
    d1: (d) => !(d.ciLo > t.d1Band || d.ciHi < -t.d1Band),
    d2: (d) => !(d.ciHi < t.d2Completion),
    d3: (d) => !(d.ciLo > t.d3Interceptions),
  };
  const words: Record<string, [string, string]> = {
    a: ['FALLS', 'DOES-NOT-FALL'], b: ['FALLS', 'DOES-NOT-FALL'],
    c: ['DOES-NOT-FALL', 'FALLS'], d1: ['WITHIN-BAND', 'OUTSIDE-BAND'],
    d2: ['DOES-NOT-FALL', 'FALLS'], d3: ['DOES-NOT-RISE', 'RISES'],
  };
  const stored: Record<string, { d: DeltaRow; w: string }> = {
    a: { d: h.aDelta, w: h.aWord }, b: { d: h.bDelta, w: h.bWord },
    c: { d: h.cDelta, w: h.cWord }, d1: { d: h.d1Delta, w: h.d1Word },
    d2: { d: h.d2Delta, w: h.d2Word }, d3: { d: h.d3Delta, w: h.d3Word },
  };
  const holds: Record<string, boolean> = {};
  for (const id of Object.keys(reRules)) {
    const ok0 = reRules[id](stored[id].d);
    holds[id] = ok0;
    binChecks.push({ check: `hBQ1.${id}Word`,
      ok: (ok0 ? words[id][0] : words[id][1]) === stored[id].w });
  }
  const reAb = holds.a && holds.b;
  const reC = holds.c;
  const reD = holds.d1 && holds.d2 && holds.d3;
  const reAll = reAb && reC && reD ? 'PASS' : 'FAIL';
  binChecks.push({ check: 'hBQ1.abLimb', ok: reAb === h.abLimb });
  binChecks.push({ check: 'hBQ1.cLimb', ok: reC === h.cLimb });
  binChecks.push({ check: 'hBQ1.dLimb', ok: reD === h.dLimb });
  binChecks.push({ check: 'hBQ1.verdict', ok: reAll === h.verdict });
  /* ⭐⭐ THE STORED RULE WORDS ON EVERY REPORTED PAIR */
  for (const rw of disk.ruleWords) {
    const dd = disk.deltas.find((x) => x.pair === rw.pair && x.key === rw.face) as DeltaRow;
    const ok0 = reRules[rw.conjunct](dd);
    binChecks.push({ check: `ruleWords.${rw.pair}.${rw.conjunct}`,
      ok: dd !== undefined && ok0 === rw.holds
        && (ok0 ? words[rw.conjunct][0] : words[rw.conjunct][1]) === rw.word
        && eq(dd.delta, rw.delta) && eq(dd.ciLo, rw.ciLo) && eq(dd.ciHi, rw.ciHi) });
  }
  /* ⭐⭐ THE PRE-COMMITTED READS, from the same stored intervals */
  const dosedARow = disk.deltas.find((x) => x.pair === 'D'
    && x.key === 'population.intended.nonPossessionShare') as DeltaRow;
  const reDosedFalls = dosedARow.ciHi < 0;
  const reDosedZero = !(dosedARow.ciHi < 0) && !(dosedARow.ciLo > 0);
  const reDosedD = (['d1', 'd2', 'd3'] as const).every((id) => {
    const rw = disk.ruleWords.find((x) => x.pair === 'D' && x.conjunct === id) as RuleWordRow;
    return rw.holds;
  });
  const reEntry = (reDosedFalls && reDosedD) ? READ_DOSED_MOVES
    : reDosedZero ? READ_DOSED_STILL : READ_DOSED_UNRESOLVED;
  const reReads = [
    ...(reAll === 'PASS' ? [READ_PASS] : []),
    ...(!reAb ? [READ_AB_FAILS] : []),
    ...(!reC ? [READ_C_FAILS] : []),
    ...(!reD ? [READ_D_FAILS] : []),
    reEntry,
  ];
  const s = disk.precommittedReads.selectors;
  binChecks.push({ check: 'precommittedReads.selectors',
    ok: s.verdict === reAll && s.abLimb === reAb && s.cLimb === reC && s.dLimb === reD
      && s.dosedAFalls === reDosedFalls && s.dosedAContainsZero === reDosedZero
      && s.dosedDWordsHold === reDosedD });
  binChecks.push({ check: 'precommittedReads.dosedEntryRead',
    ok: reEntry === disk.precommittedReads.dosedEntryRead });
  binChecks.push({ check: 'precommittedReads.readsPrinted',
    ok: JSON.stringify(reReads) === JSON.stringify(disk.precommittedReads.readsPrinted)
      && disk.precommittedReads.readsPrinted.every((x) => READ_LITERALS.includes(x)) });
}
/* ⭐ EVERY POOLED BIN re-derives by summing the SERIALIZED per-seed cells, and the EXACT-SUM
   RECEIPTS re-derive off disk too */
for (const arm of ARMS) {
  const rows = dcells.map((c) => c.rows[arm]);
  const got = poolFrom(rows);
  const want = disk.bins.pooledByArm[arm];
  for (const k of Object.keys(got) as (keyof Pooled)[]) {
    binChecks.push({ check: `bins.${arm}.${k}`,
      ok: JSON.stringify(got[k]) === JSON.stringify(want[k]) });
  }
  for (const g of GROUPS) {
    const gi = GI(g);
    binChecks.push({ check: `${arm}.${g}.partition.classesSumToEndings`,
      ok: sum(got.endingClass[gi]) === sum(rows.map((r) => r.ended[gi])) });
    binChecks.push({ check: `${arm}.${g}.partition.observedPlusInferredIsEndings`,
      ok: sum(rows.map((r) => r.clsObserved[gi] + r.clsInferred[gi]))
        === sum(rows.map((r) => r.ended[gi])) });
    binChecks.push({ check: `${arm}.${g}.partition.observedCountsMatchTheClassFlags`,
      ok: sum(rows.map((r) => r.clsObserved[gi]))
        === sum(rows.map((r) => sum(CLASSES.filter((c) => CLASS_OBSERVED[c])
          .map((c) => r.clsN[gi][CI(c)])))) });
    binChecks.push({ check: `${arm}.${g}.partition.displacementCellsSumToNotReached`,
      ok: sum(got.notReachedDisplacementCell[gi])
        === sum(rows.map((r) => parentNotReached(r, g))) });
    binChecks.push({ check: `${arm}.${g}.partition.createdEqualsEnded`,
      ok: sum(rows.map((r) => r.created[gi])) === sum(rows.map((r) => r.ended[gi])) });
  }
  binChecks.push({ check: `${arm}.partition.sideKindSumsToContactParent`,
    ok: sum(got.abandonedSideByKind.map((x) => sum(x)))
      === sum(rows.map((r) => parentContact(r, 'intended'))) });
  binChecks.push({ check: `${arm}.partition.settleLadderSumsToOwnBodyContacts`,
    ok: OWN_CLASSES.every((_, oi) => sum(got.ownSettleAtK[oi])
      === sum(rows.map((r) => r.ownBodyContacts[oi]))) });
  binChecks.push({ check: `${arm}.partition.firstContactSumsToFlights`,
    ok: sum(got.firstContactClass) === sum(rows.map((r) => r.gpFlights)) });
  binChecks.push({ check: `${arm}.partition.rollFailSettleSumsToRollFailures`,
    ok: sum(got.rollFailSettleAtK) === sum(rows.map((r) => r.rollFailAll)) });
  binChecks.push({ check: `${arm}.partition.sectorCompletedNeverExceedsSector`,
    ok: SECTORS.every((_, si) =>
      got.ownTargetContactSectorCompleted[si] <= got.ownTargetContactSector[si]) });
}
/* ⭐ EVERY SIZING ROW's ARITHMETIC re-derives off disk, step by step */
for (const r of disk.sizing.rows) {
  const seSmoke = r.hwSmoke / Z975;
  const hwAtN = r.hwSmoke * Math.sqrt(r.smokeClusters / N_FROZEN);
  const mde = hwAtN * ZSUM / Z975;
  const target = r.targetDerivedFromSmokeMde ? ceil6(mde) : r.target;
  const seNeeded = Math.abs(target) / ZSUM;
  const nReq = Math.ceil(r.smokeClusters * ((seSmoke / seNeeded) ** 2));
  const dR = disk.deltas.find((d) => d.pair === 'E' && d.key === r.face);
  binChecks.push({
    check: `sizing.${r.face}@${r.target}`,
    ok: seSmoke === r.seSmoke && seNeeded === r.seNeeded && nReq === r.nRequired
      && hwAtN === r.expectedHalfWidthAtNFrozen && mde === r.mdeAtNFrozen
      && target === r.target
      && dR !== undefined && dR.halfWidth * ZSUM / Z975 === r.mdeAtRealisedHw
      && (nReq <= N_FROZEN) === r.resolvableAtNFrozen,
  });
}
const FACES_OK = faceChecks.every((f) => f.ok) && binChecks.every((b) => b.ok);
gates.gFaces = {
  ok: FACES_OK,
  note: `${faceChecks.filter((f) => f.ok).length}/${faceChecks.length} face-and-Δ checks and `
    + `${binChecks.filter((b) => b.ok).length}/${binChecks.length} verdict-word / stored-rule-word `
    + '/ read-sentence / stored-bin / exact-sum-partition / sizing checks re-derived from the '
    + 'SERIALIZED artifact off disk — canon, VERBATIM: "the re-derivation gate covers EVERY '
    + 'published face; a percentile face requires stored bins" (this exam publishes NO percentile '
    + 'face). H-BQ.1\'s SIX conjunct words, the VERDICT word, THE STORED RULE WORDS ON EVERY '
    + 'REPORTED PAIR, the dosed ENTRY READ and every PRE-COMMITTED READ SENTENCE are INCLUDED',
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
    + 'OUTSIDE `BODY_SCHEMA` by construction — a body field could not record a hash computed '
    + 'after itself.',
  hashReproducesFromFile: HASH_REPRODUCES_FROM_FILE,
  bodySchemaKeys: BODY_SCHEMA.length,
  note: '⚠ this block carries NO file byte-hash and NO byte count: both would be '
    + 'self-referential (writing them changes the file). The FINAL file byte-hash and byte count '
    + 'are recomputed after the final write and PUBLISHED IN THE DOC\'s §R.',
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
banner(`BQ-T1 — ${ALL_GREEN ? 'ALL GATES GREEN' : '⛔ RED — artifact routed to the .RED path'}`);
for (const [k, g] of Object.entries(gates)) banner(`  ${g.ok ? '✅' : '⛔'} ${k}`);
banner('');
banner('--- H-BQ.1 (SCORED on the EMPTY-BOOK pair, E-ARMED − E-SHUT) ---');
for (const c of CONJUNCTS) {
  const d = delta('E', c.face);
  const w = wordOf('E', c.id);
  banner(`  (${c.id.padEnd(2)}) ${c.face.padEnd(50)} shut ${f6(d.shutValue)} → armed `
    + `${f6(d.armedValue)}  Δ ${f6(d.delta)} [${f6(d.ciLo)}, ${f6(d.ciHi)}] `
    + `(${f6(d.absDeltaOverHalfWidth)} hw, LOO flips ${d.looFlips})  ⇒ ${w.word}`);
}
banner(`  ⭐⭐ H-BQ.1 = ${H_BQ1}`);
banner('');
banner('--- THE STORED RULE WORDS ON THE DOSED PAIR (REPORTED, gated by nothing) ---');
for (const c of CONJUNCTS) {
  const d = delta('D', c.face);
  banner(`  (${c.id.padEnd(2)}) ${c.face.padEnd(50)} shut ${f6(d.shutValue)} → armed `
    + `${f6(d.armedValue)}  Δ ${f6(d.delta)} [${f6(d.ciLo)}, ${f6(d.ciHi)}]  ⇒ `
    + `${wordOf('D', c.id).word}`);
}
banner('');
banner('--- THE PRE-COMMITTED READS, PRINTED BY THE FROZEN FORM ---');
for (const s of READS_PRINTED) banner(`  ${s}`);
banner('');
banner('--- SIZING (the 12-seed scratch smoke) ---');
for (const r of sizingRows) {
  banner(`  ${r.group.padEnd(22)} ${r.face.padEnd(50)} hwSmoke ${f6(r.hwSmoke)} target `
    + `${r.target}${r.targetDerivedFromSmokeMde ? ' (= its own smoke-MDE, 6-dp round-up)' : ''} `
    + `N ${r.nRequired} MDE@N ${f6(r.mdeAtNFrozen)} MDE@realised ${f6(r.mdeAtRealisedHw)}`);
}
banner('');
const REPORT_KEYS = [
  'population.intended.attemptsPerMatch', 'population.intended.nonPossessionShare',
  'population.intended.observedShare', 'population.intended.inferredShare',
  'composition.intended.resolvedNotReachedMargin', 'composition.intended.resolvedRollFail',
  'composition.intended.abandonedContactOpponent', 'composition.intended.abandonedBodyStrike',
  'composition.intended.abandonedContactTeammate', 'composition.intended.abandonedDeadBallOut',
  'composition.intended.parent.resolvedNotReached',
  'composition.intended.parent.abandonedByContact', 'composition.intended.parent.line',
  'notReached.intended.ballLargerOfNonPossession',
  'notReached.intended.bodyLargerOfNonPossession',
  'attempts.intended.notReachedMarginOfAttempts', 'attempts.intended.opponentContactOfAttempts',
  'attempts.intended.resolvedRollFailOfAttempts', 'attempts.intended.resolvedCleanOfAttempts',
  'abandonedSplit.opponent.total', 'abandonedSplit.teammate.total',
  'roll.adjudicationsPerMatchIntended', 'roll.failuresPerMatchIntended',
  'roll.realisedFailShareIntended', 'roll.meanLoggedPFailIntended',
  'duel.opponentContactsPerMatch', 'duel.teammateContactsPerMatch',
  'duel.contestEpisodesPerMatch', 'duel.tacklesPerMatch',
  'bounce.ownTargetBounceRate', 'bounce.ownTargetFirstShare',
  'bounce.ownNonTargetBounceRate', 'bounce.ownNonTargetFirstShare',
  'rollFailSettle.sameSide', 'rollFailSettle.opponent', 'rollFailSettle.loose',
  'rollFailSettle.out',
  'contact.opponentFirstContactShare', 'contact.ownTargetSideBackShare', 'crowd.crashShare',
  'contact.receiverFrontShareCompleted', 'contact.receiverSideShareCompleted',
  'contact.receiverBackShareCompleted',
  'sector.completionBy.front', 'sector.completionBy.side', 'sector.completionBy.back',
  'df.markSwitchesPerDefenderMinute', 'df.markHeldShare', 'df.interceptionsPerMatch',
  'keeper.savesPerMatch', 'keeper.gkMetresPerKeeperPerMatch',
  'goalsPerMatch', 'shotsPerMatch', 'passCompletion', 'interceptionsPerMatch',
  'e4.forwardPassShare', 'e4.thirdManPerMatch', 'e4.overlapsPerMatch',
  'e4.bestPassChainMeanPerTeam',
  'context.groundPassesPerMatch', 'context.carriesPerMatch', 'context.metresPerMatch',
  'context.movingTicksPerMatch', 'context.possessionSpellsPerMatch',
  'context.meanPossessionSpellSimSeconds',
  'population.creationLedgerAgreementShare', 'notReached.marginCrossCheckAgreementShare',
];
for (const p of PAIRS) {
  banner(`--- REPORTED — pair ${p.key}: ${p.form} ---`);
  for (const k of REPORT_KEYS) {
    const dd = delta(p.key, k);
    banner(`  ${k.padEnd(52)} shut ${f6(dd.shutValue)} → armed ${f6(dd.armedValue)}  Δ `
      + `${f6(dd.delta)} [${f6(dd.ciLo)}, ${f6(dd.ciHi)}]`);
  }
  banner('');
}
banner('--- SIZING INPUTS (read these into SIZING_INPUTS before the freeze) ---');
for (const r of SIZING_INPUTS) {
  banner(`  ${r.face} hwSmoke ${delta('E', r.face).halfWidth}`);
}
banner('');
banner(`artifact → ${OUT_PATH}`);
banner(`instrumentSha256   = ${(artifact.stage as { instrumentSha256: string }).instrumentSha256}`);
banner(`hashedBodySha256   = ${artifact.hashedBodySha256 as string}`);
banner(`file byte-hash     = ${FINAL_FILE_SHA}`);
banner(`artifact bytes     = ${FINAL_ARTIFACT_BYTES}`);
banner(`hashReproducesFromFile = ${HASH_REPRODUCES_FROM_FILE} (final file: ${HASH_REPRODUCES_FINAL})`);
banner(`wall ${((Date.now() - t0Wall) / 1000).toFixed(2)} s  meanWallSecondsPerWalk `
  + `${(sum(allRows.map((r) => r.wallMs)) / 1000 / allRows.length).toFixed(6)}`);
if (!ALL_GREEN) process.exit(1);
